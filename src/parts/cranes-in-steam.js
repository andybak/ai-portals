import*as h from"three";const s0=["#0B1620","#F6F3F7","#F4B8B0","#FFC9A0","#8FA3CF","#5B5F8C","#D4202A"],Re=v=>new h.Color(v),De=(v,t,c)=>Math.min(c,Math.max(t,v)),fe=(v,t,c)=>v+(t-v)*c,ke=(v,t,c)=>{const A=De((c-v)/(t-v),0,1);return A*A*(3-2*A)},Oe=`
#define PI 3.14159265
const float HIP_Y = 0.80; const float HIP_Z = -0.04; const float LEG1 = 0.40; const float LEG2 = 0.42;
const vec3 NECK0 = vec3(0.0, 1.02, 0.20); const float NECKL = 0.50; const float BILL = 0.25;
struct Pose { float pitch; float hip; float lift; float n0; float n1; float n2; float head; float hyaw;
  float open; float raise; float famp; float fph; float dangle; float trail; float legs; float nx;
  vec2 footL; vec2 footR; };
float cwin(float c, float a, float b, float f){ return smoothstep(a, a + f, c) * (1.0 - smoothstep(b - f, b, c)); }
Pose poseStand(float t, float ph){
  Pose P;
  P.pitch = 0.02 * sin(t * 0.7 + ph * 31.0); P.hip = 0.006 * sin(t * 1.3 + ph * 17.0); P.lift = 0.0;
  P.n0 = 0.75 + 0.05 * sin(t * 0.45 + ph * 40.0); P.n1 = -0.95; P.n2 = 0.30;
  P.head = -0.08 + 0.06 * sin(t * 0.6 + ph * 23.0); P.hyaw = 0.0;
  P.open = 0.0; P.raise = 0.0; P.famp = 0.0; P.fph = 0.0; P.dangle = 0.0; P.trail = 0.0; P.legs = 1.0; P.nx = 0.0;
  P.footL = vec2(0.0); P.footR = vec2(0.0);
  return P;
}
// distance run / height gained / climb fraction of a leaver at take-off clock tau
vec3 leaveKin(vec4 C, float tau){
  float tp = max(tau - C.x, 0.0);
  float tv = 2.8; float a = 4.5;
  float s = tp < tv ? 0.5 * a * tp * tp : 0.5 * a * tv * tv + a * tv * (tp - tv);
  float q = clamp((s - 3.6) / (C.y > 1.0 ? C.y : 55.0), 0.0, 1.0);
  return vec3(s, C.z * q * q * (3.0 - 2.0 * q), q);
}
vec2 gaitFoot(float psi, float S){
  if (psi < 0.36) return vec2(S * (0.18 - psi), 0.0);          // stance: slides back at exactly body speed
  float w = (psi - 0.36) / 0.64; float ws = w * w * (3.0 - 2.0 * w);
  return vec2(S * mix(-0.18, 0.18, ws), 0.26 * sin(PI * w));
}
Pose cranePose(vec4 B, vec4 C, float t, float tau){
  float ty = B.x; float ph = B.y; float T = max(B.z, 0.5);
  Pose P = poseStand(t, ph);
  float c = fract(t / T + ph);
  if (ty < 0.5) {                                   // stand: look about, now and then stretch the wings
    P.hyaw = 0.8 * sin(t * 0.37 + ph * 50.0) * smoothstep(0.2, 0.8, sin(t * 0.21 + ph * 20.0) * 0.5 + 0.5);
    float st = cwin(c, 0.55, 0.82, 0.09) * C.x;
    P.open = st; P.raise = 0.75 * st; P.famp = 0.45 * st; P.fph = t * 8.0; P.n0 -= 0.2 * st; P.n1 += 0.3 * st;
  } else if (ty < 1.5) {                            // dance: two bows, rise, crouch, leap, land
    float b = cwin(c, 0.0, 0.30, 0.05) * (0.5 - 0.5 * cos(c / 0.30 * 4.0 * PI));
    float tall = cwin(c, 0.30, 0.52, 0.07);
    float jump = step(0.01, C.x);
    float kr = cwin(c, 0.42, 0.52, 0.04) * jump;
    float ta = clamp((c - 0.50) / 0.22, 0.0, 1.0);
    float air = cwin(c, 0.49, 0.74, 0.03);
    float kl = cwin(c, 0.70, 0.84, 0.05) * jump;
    P.pitch += 1.0 * b - 0.22 * tall + 0.28 * kr - 0.30 * air + 0.15 * kl;
    P.n0 += 0.35 * b; P.n1 = mix(P.n1, 0.45, b); P.n2 = mix(P.n2, 0.5, b);
    P.n0 = mix(P.n0, 0.48, tall); P.n1 = mix(P.n1, -0.55, tall); P.n2 = mix(P.n2, 0.05, tall);
    P.head += 0.5 * tall - 0.15 * b;
    P.hip -= 0.20 * kr + 0.14 * kl;
    P.lift = C.x * 4.0 * ta * (1.0 - ta);
    P.open = max(0.5 * b, smoothstep(0.20, 0.34, c) * (1.0 - smoothstep(0.80, 0.97, c)));
    P.raise = 0.5 * b + 0.95 * cwin(c, 0.30, 0.53, 0.08) + 0.2 * air;
    P.famp = 0.85 * air + 0.35 * tall * (1.0 - jump);
    P.fph = ta * 2.4 * 2.0 * PI + 1.9 + (1.0 - jump) * t * 7.0;
    P.dangle = smoothstep(0.0, 0.15, P.lift);
    P.hyaw = 0.5 * sin(t * 0.5 + ph * 9.0) * cwin(c, 0.84, 1.0, 0.05);
  } else if (ty < 2.5) {                            // duet: bills to the sky, the male's wings lifted
    float u = cwin(c, 0.08, 0.85, 0.08);
    float K = C.z > 0.5 ? 5.0 : 10.0;
    float pu = 0.5 + 0.5 * sin(2.0 * PI * K * c); pu = pu * pu * u;
    P.n0 = mix(P.n0, 0.30, u); P.n1 = mix(P.n1, -0.35, u); P.n2 = mix(P.n2, 0.02, u);
    P.head = mix(P.head, 1.22 + 0.16 * pu, u); P.pitch -= 0.12 * u + 0.04 * pu; P.hip += 0.012 * pu;
    P.open = 0.5 * u * C.z; P.raise = (1.3 * u + 0.12 * pu) * C.z;
  } else if (ty < 3.5) {                            // reed toss: bow to pick, fling, jump at it
    float b = cwin(c, 0.04, 0.26, 0.07);
    float fl = cwin(c, 0.24, 0.42, 0.05);
    float ta = clamp((c - 0.34) / 0.13, 0.0, 1.0);
    float air = cwin(c, 0.33, 0.49, 0.03);
    P.pitch += 1.0 * b - 0.25 * fl - 0.15 * air;
    P.n0 += 0.35 * b; P.n1 = mix(P.n1, 0.45, b); P.n2 = mix(P.n2, 0.5, b);
    P.n0 = mix(P.n0, 0.45, fl); P.n1 = mix(P.n1, -0.5, fl); P.n2 = mix(P.n2, 0.0, fl);
    P.head += 0.9 * fl - 0.15 * b;
    P.hip -= 0.16 * cwin(c, 0.29, 0.36, 0.03) + 0.1 * cwin(c, 0.46, 0.56, 0.04);
    P.lift = C.x * 4.0 * ta * (1.0 - ta);
    P.open = max(0.3 * b, cwin(c, 0.27, 0.64, 0.07)); P.raise = 0.3 * b + 0.7 * fl; P.famp = 0.8 * air;
    P.fph = ta * 2.0 * 2.0 * PI + 1.9; P.dangle = smoothstep(0.0, 0.15, P.lift);
  } else if (ty < 5.5) {                            // preen (4) / asleep on one leg, head tucked (5)
    float sl = step(4.5, ty);
    float w = mix(cwin(c, 0.08, 0.9, 0.1), 1.0, sl);
    float sd = C.y < 0.5 ? -1.0 : 1.0;
    P.n0 = mix(P.n0, 0.5, w); P.n1 = mix(P.n1, -0.95, w); P.n2 = mix(P.n2, -1.3, w);
    P.hyaw = PI * w * sd; P.nx = 0.07 * w * sd;
    P.head = mix(P.head, -0.42 + 0.1 * sin(t * 7.0 + ph * 5.0) * (1.0 - sl), w);
    P.footR = vec2(0.03, 0.40) * sl; P.pitch = mix(P.pitch, 0.012 * sin(t * 0.5 + ph * 11.0), sl);
  } else {                                          // leaver: wake, run three steps, lift, fly
    float tp = tau - C.x; vec3 k = leaveKin(C, tau);
    if (ty > 6.5) { tp = 30.0 + t; k = vec3(100.0, 0.0, 1.0); }      // flyer (7): always on the wing, beats on the pose clock
    float wake = smoothstep(-0.8, 0.0, tp);
    float air = smoothstep(3.6, 6.0, k.x); float fly = smoothstep(5.0, 16.0, k.x);
    P.n0 = mix(mix(P.n0, 1.2, wake), 1.34, fly); P.n1 = mix(P.n1, -0.2, wake) * (1.0 - fly);
    P.n2 = mix(P.n2, 0.12, wake) * (1.0 - fly);
    P.pitch = mix(mix(P.pitch, 0.34, wake), 0.05, fly) - 0.16 * sin(PI * k.z);
    P.head = mix(P.head, P.pitch, wake); P.hyaw = 0.0;
    float S = 2.0 * B.w; float bob = sin(2.0 * PI * 2.0 * k.x / S);
    P.hip = (-0.10 + 0.025 * bob) * wake * (1.0 - air); P.lift = k.y + 0.12 * air;
    P.open = smoothstep(-0.5, 0.5, tp); P.raise = 0.14; P.famp = mix(1.0, 0.72, fly) * P.open;
    P.fph = 2.0 * PI * 2.3 * t + ph * 6.0;
    vec2 gl = gaitFoot(fract(k.x / S + 0.18), 2.0); vec2 gr = gaitFoot(fract(k.x / S + 0.68), 2.0);
    P.footL = vec2(gl.x, gl.y * wake); P.footR = vec2(gr.x, gr.y * wake);
    P.trail = air; P.legs = mix(1.0, 1.0 - C.w, fly);
  }
  return P;
}
vec3 rigHip(Pose P){ return vec3(0.0, HIP_Y + P.hip + P.lift, 0.0); }
vec3 rigBodyDir(Pose P, vec3 d){ float c = cos(P.pitch), s = sin(P.pitch); return vec3(d.x, d.y * c - d.z * s, d.y * s + d.z * c); }
vec3 rigBody(Pose P, vec3 p){ return rigHip(P) + rigBodyDir(P, p - vec3(0.0, HIP_Y, HIP_Z)); }
vec2 neckArc(float th, float k, float len){ float kk = abs(k) < 1e-3 ? 1e-3 : k; return vec2(sin(th + kk * len) - sin(th), cos(th) - cos(th + kk * len)) / kk; }
// centre line of the neck in the body frame at t 0..1, and its angle from vertical (forward positive)
void rigNeck(Pose P, float t, out vec3 c, out float th){
  float tm = 0.45; float ta = min(t, tm); float tb = max(t - tm, 0.0);
  float k1 = P.n1 / (tm * NECKL); float k2 = P.n2 / ((1.0 - tm) * NECKL);
  vec2 a = neckArc(P.n0, k1, ta * NECKL); float thm = P.n0 + k1 * ta * NECKL;
  vec2 b = neckArc(thm, k2, tb * NECKL); th = thm + k2 * tb * NECKL;
  c = NECK0 + vec3(P.nx * t, a.x + b.x, a.y + b.y);
}
// head-local (x, up, forward) -> body frame
vec3 rigHead(Pose P, vec3 h){
  vec3 c; float th; rigNeck(P, 1.0, c, th);
  float cy = cos(P.hyaw), sy = sin(P.hyaw); float x2 = h.x * cy + h.z * sy; float f2 = -h.x * sy + h.z * cy;
  float ca = cos(P.head), sa = sin(P.head);
  return c + vec3(x2, h.y * ca + f2 * sa, -h.y * sa + f2 * ca);
}
vec3 rigHeadDir(Pose P, vec3 h){
  float cy = cos(P.hyaw), sy = sin(P.hyaw); float x2 = h.x * cy + h.z * sy; float f2 = -h.x * sy + h.z * cy;
  float ca = cos(P.head), sa = sin(P.head);
  return vec3(x2, h.y * ca + f2 * sa, -h.y * sa + f2 * ca);
}
vec3 rigBill(Pose P){ return rigBody(P, rigHead(P, vec3(0.0, 0.0, BILL))); }
vec3 rigTurn(vec3 v, float hd){ float c = cos(hd), s = sin(hd); return vec3(v.x * c + v.z * s, v.y, -v.x * s + v.z * c); }
// bird-local -> hero-local (instance foot point, heading, scale, and the leaver's run along its track)
vec3 rigWorld(vec3 l, vec4 A, vec4 B, vec4 C, float tau){
  vec3 root = A.xyz;
  float sc = B.w;
  if (B.x > 6.5) {                                   // flyer: a straight track of C.y metres, looping on the tau clock, shrunk away at both ends
    float L = max(C.y, 1.0); float s = mod(tau * 12.6 + C.x, L); root += vec3(sin(A.w), 0.0, cos(A.w)) * s;
    root.y += C.z * sin(3.14159265 * s / L);
    sc *= smoothstep(0.0, 30.0, s) * (1.0 - smoothstep(L - 30.0, L, s));
  } else if (B.x > 5.5) { float s = leaveKin(C, tau).x; root += vec3(sin(A.w), 0.0, cos(A.w)) * s; }
  return root + rigTurn(l * sc, A.w);
}
`;function Ee(v=1){const t=[],c=[],A=[],B=[],q=[],G=[],k=(g,d,E,w,N)=>(t.push(g[0],g[1],g[2]),c.push(d[0],d[1],d[2]),A.push(E[0],E[1],E[2]),q.push(w[0],w[1],w[2],w[3]),N?B.push(N[0],N[1],N[2]):B.push(0,0,0),t.length/3-1),U=(g,d,E,w)=>{G.push(g,d,E,g,E,w)},_=(g,d,E)=>{const w=t.length/3;for(let r=g;r<w;r++)c[r*3]=0,c[r*3+1]=0,c[r*3+2]=0;for(let r=d;r<G.length;r+=3){const p=G[r]*3,P=G[r+1]*3,D=G[r+2]*3,y=t[P]-t[p],m=t[P+1]-t[p+1],I=t[P+2]-t[p+2],ne=t[D]-t[p],ae=t[D+1]-t[p+1],a=t[D+2]-t[p+2],l=m*a-I*ae,s=I*ne-y*a,n=y*ae-m*ne;for(const f of[p,P,D])c[f]+=l,c[f+1]+=s,c[f+2]+=n}let N=0;for(let r=g;r<w;r++){const p=Math.hypot(c[r*3],c[r*3+1],c[r*3+2])||1;c[r*3]/=p,c[r*3+1]/=p,c[r*3+2]/=p,N+=c[r*3]*(t[r*3]-E[0])+c[r*3+1]*(t[r*3+1]-E[1])+c[r*3+2]*(t[r*3+2]-E[2])}if(N<0)for(let r=g*3;r<w*3;r++)c[r]=-c[r]},R=[.74,.735,.75],H=[.022,.022,.028],ee=[1,0,0],J=[.4,.37,.2],pe=[.03,.03,.035],oe=g=>Math.max(3,Math.round(g*v)),de=g=>Math.pow(Math.max(Math.sin(Math.PI*Math.pow(De(g,0,1),.85)),0),.7),$=g=>{const d=(g+.34)/.6;return d<=0?.02:Math.max(.02,.14*de(d))};{const g=oe(10),d=oe(10),E=t.length/3,w=G.length;for(let N=0;N<=g;N++){const r=N/g,p=de(r),P=fe(-.34,.26,r),D=fe(.9,1,r)+.02*Math.sin(Math.PI*r);for(let y=0;y<d;y++){const m=y/d*Math.PI*2,I=Math.sin(m),ne=I<0?.93:1,ae=.9+.1*De(I+.6,0,1);k([.14*p*Math.cos(m),D+.17*p*I*ne,P],[0,1,0],[R[0]*ae,R[1]*ae,R[2]*(ae*.5+.5)],[0,r,0,0])}}for(let N=0;N<g;N++)for(let r=0;r<d;r++){const p=E+N*d+r,P=E+N*d+(r+1)%d;U(p,P,P+d,p+d)}_(E,w,[0,.95,0])}{const g=oe(12),d=oe(8),E=t.length/3;for(let w=0;w<=g;w++){const N=w/g,r=fe(.064,.027,ke(0,.5,N))+.005*ke(.8,1,N);for(let p=0;p<d;p++){const P=p/d*Math.PI*2;k([r*Math.cos(P),r*Math.sin(P),0],[Math.cos(P),Math.sin(P),0],R,[1,N,0,Math.sin(P)])}}for(let w=0;w<g;w++)for(let N=0;N<d;N++){const r=E+w*d+N,p=E+w*d+(N+1)%d;U(r,r+d,p+d,p)}}{const g=oe(6),d=oe(8),E=t.length/3,w=G.length;for(let P=0;P<=g;P++){const D=P/g*Math.PI,y=.035-.07*Math.cos(D),m=Math.max(Math.sin(D),.02);for(let I=0;I<d;I++){const ne=I/d*Math.PI*2,ae=Math.sin(ne);let a=H;ae>.45&&y>-.012&&y<.092?a=ee:y<.034&&ae>-.4&&(a=R),k([.036*m*Math.cos(ne),.012+.042*m*ae,y],[0,1,0],a,[2,0,0,0])}}for(let P=0;P<g;P++)for(let D=0;D<d;D++){const y=E+P*d+D,m=E+P*d+(D+1)%d;U(y,m,m+d,y+d)}const N=t.length/3,r=6,p=[[.082,.017,.021,1],[.15,.012,.014,1],[.21,.007,.008,.85],[.25,.002,.002,.6]];for(const[P,D,y,m]of p)for(let I=0;I<r;I++){const ne=I/r*Math.PI*2;k([D*Math.cos(ne),.004+y*Math.sin(ne),P],[0,1,0],[J[0]*m,J[1]*m,J[2]*m],[2,0,0,1])}for(let P=0;P<p.length-1;P++)for(let D=0;D<r;D++){const y=N+P*r+D,m=N+P*r+(D+1)%r;U(y,m,m+r,y+r)}_(E,w,[0,.01,.06])}for(const g of[-1,1]){const d=oe(14),E=oe(5),w=t.length/3;for(let N=0;N<=d;N++){const r=N/d,p=.76*Math.pow(r,.9),P=.03+.07*Math.exp(-(((r-.45)/.28)**2))-.54*Math.max(r-.55,0)**2,D=1.25*ke(.45,1,r),y=.36+.04*Math.cos(2*Math.PI*r);for(let m=0;m<=E;m++){const I=m/E,ne=fe(.42,.15,r),ae=[g*(.09+p+I*y*Math.sin(D)),1.07+.03*Math.sin(Math.PI*I)*(1-.5*r)-.04*r*r-ne*y*Math.pow(I,1.7),.1+P-I*y*Math.cos(D)],a=Math.pow(I,.62),l=.13-fe(.64,.5,r)*a,s=fe(.55,1,ke(0,.5,r)),n=[g*($(l)*s+.014+.02*(1-r)),fe(1.105,.93,r)-a*a*a*fe(.3,.1,r),l];k(ae,[0,1,0],R,[3,r,g,I],n)}}for(let N=0;N<d;N++)for(let r=0;r<E;r++){const p=w+N*(E+1)+r;U(p,p+1,p+E+2,p+E+1)}}for(const g of[-1,1]){[[[0,.05,1],[.16,.04,1],[.3,.016,0],[1,.013,0]],[[0,.02,0],[.07,.0125,0],[.93,.0115,0],[1,.017,0]]].forEach((w,N)=>{const r=t.length/3;for(const[p,P,D]of w)for(let y=0;y<6;y++){const m=y/6*Math.PI*2;k([P*Math.cos(m),0,P*Math.sin(m)],[Math.cos(m),0,Math.sin(m)],D?R:pe,[4,p,g,N])}for(let p=0;p<w.length-1;p++)for(let P=0;P<6;P++){const D=r+p*6+P,y=r+p*6+(P+1)%6;U(D,D+6,y+6,y)}});for(const[w,N]of[[-.55,.095],[0,.12],[.55,.095],[Math.PI,.035]]){const r=t.length/3,p=Math.sin(w),P=Math.cos(w);for(const[D,y,m]of[[0,.011,.012],[N*.55,.008,.008],[N,.003,.004]])for(let I=0;I<3;I++){const ne=I/3*Math.PI*2+Math.PI/2,ae=Math.cos(ne)*y,a=Math.sin(ne)*y*.7+m;k([p*D+P*ae,a,P*D-p*ae],[P*Math.cos(ne),Math.max(Math.sin(ne),.2),-p*Math.cos(ne)],pe,[4,1,g,2])}for(let D=0;D<2;D++)for(let y=0;y<3;y++){const m=r+D*3+y,I=r+D*3+(y+1)%3;U(m,m+3,I+3,I)}}}const W=new h.BufferGeometry;return W.setAttribute("position",new h.Float32BufferAttribute(t,3)),W.setAttribute("normal",new h.Float32BufferAttribute(c,3)),W.setAttribute("color",new h.Float32BufferAttribute(A,3)),W.setAttribute("aFold",new h.Float32BufferAttribute(B,3)),W.setAttribute("aRig",new h.Float32BufferAttribute(q,4)),W.setIndex(G),W}function r0(v,t={}){const c=v.map(Re),A=new h.Vector3(...t.sunDir||[.34,.09,-.94]).normalize();return{uTime:{value:0},uTau:{value:0},uPx:{value:.0012},uSunDir:{value:A},uSunCol:{value:c[3].clone().multiplyScalar(1.25)},uRimCol:{value:c[3].clone().multiplyScalar(1.25)},uSky:{value:c[4].clone().multiplyScalar(.42)},uGround:{value:c[4].clone().lerp(c[2],.35).multiplyScalar(.2)},uCrown:{value:c[6].clone()},uRose:{value:c[2].clone()},uViolet:{value:c[5].clone()}}}const Ye=()=>h.UniformsUtils.clone(h.UniformsLib.fog),Ze=(v,t)=>{const c={};for(const A of t)c[A]=v[A];return c},Xe=`
attribute vec3 color; attribute vec3 aFold; attribute vec4 aRig; attribute vec4 iA; attribute vec4 iB; attribute vec4 iC;
uniform float uTime; uniform float uTau; uniform float uPx;
varying vec3 vN; varying vec3 vWp; varying vec3 vCol; varying vec4 vUv; varying float vFly;
#include <fog_pars_vertex>
${Oe}
void main(){
  float part = aRig.x;
  Pose P = cranePose(iB, iC, uTime, uTau);
  vec3 lp; vec3 ln;
  vec3 rootW = (modelMatrix * vec4(rigWorld(vec3(0.0, 1.0, 0.0), iA, iB, iC, uTau), 1.0)).xyz;
  float dist = length(rootW - cameraPosition);
  float wsc = clamp(uPx * dist * 62.0, 1.0, 4.0);          // thin parts never fall under ~1.5 pixels
  if (part < 0.5) {                                          // on the wing the body draws out: longer, slimmer, tapering to the tail
    vec3 bp = position; float fl = P.trail;
    bp.z = mix(bp.z, bp.z * 1.3 - 0.02, fl); bp.x *= 1.0 - 0.12 * fl; bp.y = 0.95 + (bp.y - 0.95) * (1.0 - 0.2 * fl);
    lp = rigBody(P, bp); ln = rigBodyDir(P, normal); }
  else if (part < 1.5) {
    vec3 c; float th; rigNeck(P, aRig.y, c, th);
    vec3 nn = vec3(0.0, -sin(th), cos(th));
    lp = rigBody(P, c + vec3(position.x, 0.0, 0.0) + nn * position.y);
    ln = rigBodyDir(P, vec3(normal.x, 0.0, 0.0) + nn * normal.y);
  } else if (part < 2.5) {
    float wd = mix(1.0, min(wsc, 3.0), aRig.w);
    vec3 hp = vec3(position.x * wd, 0.004 + (position.y - 0.004) * wd, position.z);
    lp = rigBody(P, rigHead(P, hp)); ln = rigBodyDir(P, rigHeadDir(P, normal));
  } else if (part < 3.5) {
    float side = aRig.z; float u = aRig.y;
    vec3 S = vec3(side * 0.09, 1.07, 0.10);
    vec3 dA = aFold - S; vec3 dB = position - S; float lA = length(dA); float lB = length(dB);
    float op = clamp(P.open * 1.3 - 0.3 * u, 0.0, 1.0);
    vec3 dd = mix(dA / max(lA, 1e-4), dB / max(lB, 1e-4), op); dd /= max(length(dd), 1e-3);
    vec3 w = dd * mix(lA, lB, op);
    float ph = P.fph - 0.9 * u;
    float ang = (P.raise + P.famp * sin(ph + 0.4 * sin(ph))) * (0.45 + 0.55 * u) * smoothstep(0.0, 0.6, op) * side;
    float ca = cos(ang), sa = sin(ang);
    w = vec3(w.x * ca - w.y * sa, w.x * sa + w.y * ca, w.z);
    vec3 n = normalize(mix(vec3(side * 0.85, 0.5, -0.1), vec3(0.0, 1.0, -0.6 * aRig.w), op));
    n = vec3(n.x * ca - n.y * sa, n.x * sa + n.y * ca, n.z);
    lp = rigBody(P, S + w); ln = rigBodyDir(P, n);
  } else {
    float side = aRig.z; float seg = aRig.w; float al = aRig.y;
    vec3 Hj = rigHip(P) + vec3(side * 0.055, 0.0, 0.0);
    vec2 ft = side < 0.0 ? P.footL : P.footR;
    vec3 Fp = vec3(side * 0.065, ft.y, ft.x);                                  // planted on the foot point
    vec3 Fd = Hj + vec3(side * 0.012, -0.77, -0.09 + 0.05 * sin(uTime * 5.0 + side));   // dangling in a leap
    vec3 Ft = Hj + vec3(0.0, -0.17, -0.79);                                    // trailing in flight
    vec3 Fq = mix(mix(Fp, Fd, P.dangle), Ft, P.trail);
    vec3 dv = Fq - Hj; float dl = length(dv); vec3 dir = dv / max(dl, 1e-4);
    float d = clamp(dl, 0.08, LEG1 + LEG2 - 0.004);
    vec3 Fk = Hj + dir * d;
    float ca = clamp((LEG1 * LEG1 + d * d - LEG2 * LEG2) / (2.0 * LEG1 * d), -1.0, 1.0); float sa = sqrt(max(1.0 - ca * ca, 0.0));
    vec3 pr = cross(vec3(1.0, 0.0, 0.0), dir); pr /= max(length(pr), 1e-4);
    vec3 K = Hj + dir * (LEG1 * ca) + pr * (LEG1 * sa);
    if (seg < 1.5) {
      vec3 a0 = seg < 0.5 ? Hj : K; vec3 a1 = seg < 0.5 ? K : Fk;
      vec3 ax = a1 - a0; ax /= max(length(ax), 1e-4);
      vec3 e1 = vec3(1.0, 0.0, 0.0) - ax * ax.x; e1 /= max(length(e1), 1e-4);
      vec3 e2 = cross(ax, e1);
      lp = mix(a0, a1, al) + (e1 * position.x + e2 * position.z) * wsc;
      ln = e1 * normal.x + e2 * normal.z;
    } else {
      float be = max(P.dangle * 1.1, P.trail * 2.6); float cb = cos(be), sb = sin(be);
      vec3 q = vec3(position.x * min(wsc, 2.0), position.y, position.z);
      lp = Fk + vec3(q.x, q.y * cb - q.z * sb, q.y * sb + q.z * cb);
      ln = vec3(normal.x, normal.y * cb - normal.z * sb, normal.y * sb + normal.z * cb);
    }
    lp = Hj + (lp - Hj) * P.legs;
  }
  vec4 wp = modelMatrix * vec4(rigWorld(lp, iA, iB, iC, uTau), 1.0);
  vWp = wp.xyz; vN = mat3(modelMatrix) * rigTurn(ln, iA.w); vCol = color; vUv = vec4(aRig.y, aRig.w, part, iC.w); vFly = P.trail;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Qe=`
uniform vec3 uSunDir; uniform vec3 uSunCol; uniform vec3 uSky; uniform vec3 uGround; uniform vec3 uRimCol;      // uRimCol: the light on an edge turned to the sun and through a thin wing (the key's own colour unless the world gives another)
float h1(float x){ return fract(sin(x * 127.1) * 43758.5453); }
float h2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h2(i), h2(i + vec2(1.0, 0.0)), f.x), mix(h2(i + vec2(0.0, 1.0)), h2(i + vec2(1.0, 1.0)), f.x), f.y); }
// wrapped key + sky/ground fill + a rim of back light on whatever edge faces the sun
vec3 shade(vec3 alb, vec3 N, vec3 Vv, float thin, float rimK){
  float ndl = dot(N, uSunDir);
  float wrap = clamp((ndl + 0.45) / 1.45, 0.0, 1.0); wrap *= wrap;
  vec3 col = alb * (uSunCol * wrap + mix(uGround, uSky, N.y * 0.5 + 0.5));
  col += thin * alb * uRimCol * max(-ndl, 0.0) * 0.55;
  float fr = 1.0 - max(dot(N, Vv), 0.0);
  float rim = fr * fr * fr * smoothstep(-0.3, 0.8, dot(-Vv, uSunDir));
  col += uRimCol * rim * rimK * (0.25 + 0.9 * alb);
  return col;
}`,$e=`
uniform vec3 uCrown;
varying vec3 vN; varying vec3 vWp; varying vec3 vCol; varying vec4 vUv; varying float vFly;
#include <fog_pars_fragment>
${Qe}
void main(){
  float part = vUv.z; float juv = step(1.5, vUv.w);
  vec3 N = vN / max(length(vN), 1e-4);
  vec3 Vv = cameraPosition - vWp; Vv /= max(length(Vv), 1e-4);
  vec3 BLK = vec3(0.022, 0.022, 0.028); vec3 TAWNY = vec3(0.36, 0.22, 0.11);
  float red = clamp((vCol.r - vCol.g) * 1.4, 0.0, 1.0) * step(1.5, part) * step(part, 2.5);
  vec3 alb = mix(vCol, vec3(vCol.g, vCol.g, vCol.b), step(0.5, red));
  float thin = 0.0;
  if (part > 2.5 && part < 3.5) {                       // wing: cut feather tips, paint the black flight feathers
    float u = vUv.x, v = vUv.y; float fu = fract(u * 24.0); float fid = floor(u * 24.0);
    float prim = smoothstep(0.52, 0.62, u);
    float v0 = mix(0.86, 0.42, prim);
    float tip = clamp((v - v0) / (1.0 - v0), 0.0, 1.0);
    if (abs(fu - 0.5) * 2.0 > 1.0 - tip * tip * mix(0.85, 0.95, prim)) discard;
    float blk = (1.0 - step(0.57, u)) * smoothstep(0.48, 0.53, v + 0.04 * (h1(fid) - 0.5));
    blk = max(blk, (1.0 - step(0.21, u)) * smoothstep(0.28, 0.34, v));
    alb = mix(alb, BLK, blk * (1.0 - 0.6 * juv));
    alb *= 0.80 + 0.20 * smoothstep(0.0, 0.6, 1.0 - abs(fu - 0.5) * 2.0);
    float row = fract(v * 3.0 + 0.1 * sin(fu * 6.2832));                 // three rows of coverts lying over one another, each with a soft shadow at its hem
    alb *= 1.0 - 0.16 * smoothstep(0.72, 1.0, row) * (1.0 - blk) * (1.0 - step(0.9, v));
    if (dot(N, Vv) < 0.0) N = -N;
    thin = 1.0;
  } else if (part > 0.5 && part < 1.5) {                // neck: black, white from the nape down the hind neck
    float t = vUv.x, frt = vUv.y;
    float thr = mix(-1.2, 0.15, smoothstep(0.30, 1.0, t));
    float wb = 1.0 - smoothstep(thr - 0.12, thr + 0.12, frt);
    float base = 1.0 - smoothstep(0.03, 0.13, t + 0.04 * frt);
    alb = mix(mix(BLK, TAWNY, juv), vCol, max(wb * (1.0 - juv), base));
  } else if (part > 1.5 && part < 2.5) {                // head: bare red crown (the one accent in the world)
    alb = mix(alb, uCrown, red * (1.0 - juv));
    alb = mix(alb, TAWNY, juv * (1.0 - vUv.y));
  }
  float rimK = 0.9;
  if (part < 0.5) {                                     // a bird on the wing: matte feathers, softly modelled, blue beneath; no pearl highlight
    alb *= mix(1.0, 0.82 + 0.18 * smoothstep(-0.5, 0.3, N.y), vFly);
    vec3 Nf = N * 0.3 + Vv * 0.45 + vec3(0.0, 0.45, 0.0); Nf /= max(length(Nf), 1e-3);
    N = mix(N, Nf, 0.75 * vFly); N /= max(length(N), 1e-3); rimK = mix(0.9, 0.2, vFly);
  }
  vec3 col = shade(alb, N, Vv, thin, rimK);
  if (part < 0.5) { float lum = dot(col, vec3(0.3, 0.55, 0.15)); col = mix(col, vec3(lum) + alb * uSunCol * 0.16, 0.85 * vFly); }      // a flyer's shaded body is grey-white, never a blue egg under a teal sky
  col += uCrown * red * (1.0 - juv) * 0.22;
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`;function We(v,t){const c=new h.InstancedBufferGeometry;c.index=v.index;for(const k in v.attributes)c.setAttribute(k,v.attributes[k]);const A=t.length,B=new Float32Array(A*4),q=new Float32Array(A*4),G=new Float32Array(A*4);return t.forEach((k,U)=>{B.set([k.x,k.y||0,k.z,k.heading||0],U*4),q.set([k.type||0,k.phase||0,k.period||8,k.scale||1],U*4),G.set(k.c||[0,0,0,0],U*4)}),c.setAttribute("iA",new h.InstancedBufferAttribute(B,4)),c.setAttribute("iB",new h.InstancedBufferAttribute(q,4)),c.setAttribute("iC",new h.InstancedBufferAttribute(G,4)),c.instanceCount=A,c}function N0(v,t,c={}){const A=c.shared||r0(c.palette||s0,c),B=We(Ee(c.detail??1),t),q=new h.ShaderMaterial({uniforms:{...Ye(),...Ze(A,["uTime","uTau","uPx","uSunDir","uSunCol","uSky","uGround","uRimCol","uCrown"])},vertexShader:Xe,fragmentShader:$e,fog:!0,side:h.DoubleSide}),G=new h.Mesh(B,q);return G.frustumCulled=!1,G.name="cranes",{object:G,shared:A,update(k,U){c.shared||(A.uTime.value=U)}}}const Je=`
uniform vec3 uRose; uniform vec3 uViolet;
varying vec2 vQ; varying vec4 vS; varying vec3 vWp;       // vS = (age 0..1, seed, opacity, kind 0 breath / 1 steam)
#include <fog_pars_fragment>
${Qe}
void main(){
  float r = length(vQ); float soft = 1.0 - smoothstep(0.0, 1.0, r);
  float n = vnoise(vQ * 2.1 + vS.y * 17.0 + vec2(0.0, -vS.x * 1.6));
  n = 0.6 * n + 0.4 * vnoise(vQ * 4.7 - vS.y * 9.0 + vec2(vS.x * 0.8, 0.0));
  // steam is rising, torn vapour: drawn out upward in strands and eaten away harder toward the rim, so its outline is shreds, never a disc
  vec2 w = vec2(vQ.x * 1.2 + 0.3 * sin(vQ.y * 2.6 + vS.y * 21.0), vQ.y * 0.92 - vS.x * 1.3);
  float nt = 0.55 * vnoise(w * 2.1 + vS.y * 17.0) + 0.3 * vnoise(w * 4.7 - vS.y * 9.0) + 0.15 * vnoise(w * 9.5 + vS.y * 31.0);
  float r2 = r * r;
  float torn = smoothstep(0.31 + 0.48 * r2, 0.57 + 0.43 * r2, nt + 0.16 * (1.0 - r)) * (1.0 - smoothstep(0.5, 1.0, r)) * 1.2 * smoothstep(0.05, 0.8, vWp.y);
  float al = mix(soft * mix(soft, 1.0, 0.4) * (0.06 + 1.15 * smoothstep(0.2, 0.8, n)), torn, vS.w) * vS.z;
  al = min(al, mix(0.85, 0.66, vS.w));
  if (al < 0.004) discard;
  vec3 Vd = vWp - cameraPosition; Vd /= max(length(Vd), 1e-4);
  float fs = max(dot(Vd, uSunDir), 0.0); fs *= fs; fs *= fs;                 // forward scatter, pow 4
  vec3 breath = uSky * 1.3 + uSunCol * (0.25 + 1.5 * fs);
  vec3 steam = mix(uViolet * 0.55 + uSky * 0.5, uRose * 0.95, clamp(0.35 + 0.4 * vQ.y + 0.3 * n, 0.0, 1.0)) * (0.42 + 0.2 * length(uSunCol))
             + uSunCol * 0.4 * fs * (0.4 + 0.6 * n);
  float sm = max(steam.r, max(steam.g, steam.b));                            // the glow of the steam stays under white: the frosted reeds and twigs in front of it keep their lines
  if (sm > 0.6) steam *= (0.6 + 0.22 * (1.0 - exp(-(sm - 0.6) / 0.22))) / sm;
  gl_FragColor = vec4(mix(breath, steam, vS.w), al);
  #include <fog_fragment>
}`,l0=`
attribute vec4 iA; attribute vec4 iB; attribute vec4 iC; attribute vec4 iD;      // iD = (cycle offset, period s, size m, seed)
uniform float uTime; uniform float uTau; uniform float uRate;
varying vec2 vQ; varying vec4 vS; varying vec3 vWp;
#include <fog_pars_vertex>
${Oe}
void main(){
  bool lv = iB.x > 5.5;
  float per = max(iD.y, 0.2);
  float te = (floor(uTime / per - iD.x) + iD.x) * per;        // when this puff left the bill
  float age = uTime - te;
  float tauE = uTau - age * uRate;                            // the take-off clock at that moment
  Pose P = cranePose(iB, iC, te, tauE);
  vec3 p = rigWorld(rigBill(P), iA, iB, iC, tauE);
  float a = clamp(age / min(per, 4.0), 0.0, 1.0);
  p += vec3(sin(iD.w * 40.0 + age * 0.7) * 0.05, 0.10, cos(iD.w * 23.0 + age * 0.6) * 0.05) * age;
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vec4 mvPosition = viewMatrix * wp;
  mvPosition.xy += position.xy * iD.z * (0.22 + 1.1 * sqrt(a));
  float op = smoothstep(0.0, 0.05, a) * (1.0 - a) * (1.0 - a) * (lv ? smoothstep(5.0, 10.0, -mvPosition.z) : smoothstep(1.2, 3.5, -mvPosition.z));
  if (lv && tauE < iC.x) op *= step(fract(iD.w * 7.0), 0.34);          // a standing bird breathes slowly
  if (lv) op *= 1.0 - 0.6 * smoothstep(1.0, 4.0, tauE - iC.x);          // and on the wing its breath is torn away
  vQ = position.xy; vS = vec4(a, iD.w, op * 0.85, 0.0); vWp = wp.xyz;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,p0=`
attribute vec4 iP; attribute vec4 iQ;          // iP = (x, y, z, size)  iQ = (seed, wisp rate, x stretch, opacity)
uniform float uTime;
varying vec2 vQ; varying vec4 vS; varying vec3 vWp;
#include <fog_pars_vertex>
void main(){
  float sd = iQ.x; float life = fract(uTime * iQ.y + sd);
  float wisp = step(0.0001, iQ.y);
  vec3 p = iP.xyz;
  p.x = mod(p.x + 54.0 + uTime * 0.6 * (0.6 + 0.8 * sd), 108.0) - 54.0;       // leans and drifts downstream
  p.y += wisp * life * iP.w * 0.9 + 0.25 * sin(uTime * 0.21 + sd * 30.0);
  p.x += wisp * life * iP.w * 0.6;
  float edge = 1.0 - smoothstep(42.0, 54.0, abs(p.x));
  float sz = iP.w * (0.75 + 0.5 * life * wisp);
  float ang = (sd - 0.5) * mix(1.2, 2.0, wisp) + uTime * 0.06 * (sd - 0.5);            // a head of the curtain lies nearly level, a wisp stands up and leans: never a squashed sliver
  float ca = cos(ang), sa = sin(ang);
  vec2 q = vec2(position.x * mix(iQ.z, 0.85 * iQ.z, wisp), position.y * mix(0.9, 1.15, wisp));
  q = vec2(q.x * ca - q.y * sa, q.x * sa + q.y * ca);
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vec4 mvPosition = viewMatrix * wp;
  mvPosition.xy += q * sz;
  float op = iQ.w * edge * mix(1.0, sin(3.14159 * life), wisp) * smoothstep(2.0, 8.0, -mvPosition.z);
  vQ = position.xy; vS = vec4(life + uTime * 0.07, sd, op, 1.0); vWp = cameraPosition + mvPosition.xyz * mat3(viewMatrix);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,d0=`
attribute vec4 iR;                              // (x, z, tau of the footfall, size)
uniform float uTau;
varying vec2 vQ; varying vec2 vA;
#include <fog_pars_vertex>
void main(){
  float age = (uTau - iR.z) / 1.15;
  float on = step(0.0, age) * step(age, 1.0);
  float rad = iR.w * (0.25 + 1.0 * sqrt(clamp(age, 0.0, 1.0))) * on;
  float jet = step(0.5, position.z);            // z = 1 marks the upright splash card
  vec3 p = vec3(iR.x, 0.02, iR.y) + mix(vec3(position.x * rad, 0.0, position.y * rad), vec3(0.0), jet);
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(p, 1.0);
  float up = sin(3.14159 * clamp(age * 2.2, 0.0, 1.0));
  mvPosition.xy += jet * on * vec2(position.x * 0.22, (position.y + 1.0) * 0.30 * up) * iR.w * 2.0;
  vQ = position.xy; vA = vec2(mix((1.0 - age) * on, up * on, jet), jet);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,m0=`
uniform vec3 uSunCol; uniform vec3 uSky;
varying vec2 vQ; varying vec2 vA;
#include <fog_pars_fragment>
void main(){
  float r = length(vQ); float al;
  if (vA.y > 0.5) {                                                           // the kick of spray: a loose fan of drops, never a solid shape
    float env = (1.0 - smoothstep(0.1, 1.0, abs(vQ.x) * (1.1 + 0.9 * vQ.y))) * (1.0 - smoothstep(0.1, 1.0, vQ.y)) * smoothstep(-1.0, -0.8, vQ.y);
    vec2 g = vec2(vQ.x * 6.0, (vQ.y + 1.0) * 4.5 - vA.x * 1.5); vec2 id = floor(g);
    float hh = fract(sin(dot(id, vec2(127.1, 311.7))) * 43758.5453);
    float dr = 1.0 - smoothstep(0.08, 0.36, length(fract(g) - 0.5 - (vec2(hh, fract(hh * 7.3)) - 0.5) * 0.5));
    al = env * (0.06 + 0.9 * dr * step(0.45, hh)) * vA.x * 0.34;
  } else { al = smoothstep(0.55, 0.9, r) * (1.0 - smoothstep(0.9, 1.0, r)) * vA.x * vA.x * 0.2; }
  if (al < 0.004) discard;
  gl_FragColor = vec4(uSky * 1.2 + uSunCol * 0.55, al);
  #include <fog_fragment>
}`,g0=`
attribute vec4 aD;                              // (seed, fall speed, twinkle rate, size)
uniform float uTime; uniform float uPx;
varying float vTw;
#include <fog_pars_vertex>
void main(){
  vec3 p = position;
  p.y = mod(p.y - uTime * aD.y, 4.5) + 0.1;                  // low over the bar: higher, it reads as stars in a dawn sky
  p.x += 0.35 * sin(uTime * 0.23 + aD.x * 50.0); p.z += 0.35 * cos(uTime * 0.19 + aD.x * 31.0);
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(p, 1.0);
  float tw = max(sin(uTime * aD.z + aD.x * 80.0), 0.0); tw *= tw; tw *= tw; tw *= tw;
  vTw = (0.05 + 0.95 * tw) * smoothstep(1.5, 5.0, -mvPosition.z) * (1.0 - 0.85 * smoothstep(8.0, 22.0, -mvPosition.z));
  gl_PointSize = clamp(aD.w / max(uPx * -mvPosition.z, 1e-4), 1.5, 4.5);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,x0=`
uniform vec3 uSunCol; varying float vTw;
#include <fog_pars_fragment>
void main(){
  vec2 q = gl_PointCoord * 2.0 - 1.0; float d = 1.0 - smoothstep(0.2, 1.0, length(q));
  gl_FragColor = vec4((uSunCol * 2.2 + vec3(0.6)) * vTw * d, 1.0);
}`,y0=`
attribute vec3 color; attribute vec4 iA; attribute vec4 iB; attribute vec4 iC;
uniform float uTime; uniform float uTau; uniform float uPx;
varying vec3 vN; varying vec3 vWp; varying vec3 vCol;
#include <fog_pars_vertex>
${Oe}
vec3 billAt(float t){ return rigWorld(rigBill(cranePose(iB, iC, t, uTau)), iA, iB, iC, uTau); }
void main(){
  float T = max(iB.z, 0.5); float c = fract(uTime / T + iB.y);
  float cp = 0.15; float cr = 0.30; float Tf = 1.5; float cl = cr + Tf / T;
  vec3 G = billAt(uTime - (c - cp) * T); G.y = iA.y + 0.03;          // where it lies, and where the bow picks it up
  vec3 p = G; float spin = 0.0;
  if (c >= cp && c < cr) { p = billAt(uTime); }                       // carried in the bill
  else if (c >= cr && c < cl) {                                       // thrown: lands exactly where it will be picked up
    vec3 P0 = billAt(uTime - (c - cr) * T); float ts = (c - cr) * T; vec3 gv = vec3(0.0, -7.0, 0.0);
    vec3 v0 = (G - P0) / Tf - 0.5 * gv * Tf;
    p = P0 + v0 * ts + 0.5 * gv * ts * ts; spin = ts / Tf * 4.0 * 3.14159265;
  }
  float dist = length((modelMatrix * vec4(p, 1.0)).xyz - cameraPosition);
  float wsc = clamp(uPx * dist * 125.0, 1.0, 4.0);
  vec3 l = vec3(position.x, position.y * wsc, position.z * wsc);
  float cs = cos(spin), sn = sin(spin);
  l = vec3(l.x * cs - l.y * sn, l.x * sn + l.y * cs, l.z);
  vec3 n = vec3(normal.x * cs - normal.y * sn, normal.x * sn + normal.y * cs, normal.z);
  vec4 wp = modelMatrix * vec4(p + rigTurn(l, iA.w), 1.0);
  vWp = wp.xyz; vN = mat3(modelMatrix) * rigTurn(n, iA.w); vCol = color;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,w0=`
attribute vec4 iP; attribute vec4 iQ;
varying vec2 vQ; varying vec4 vS; varying vec3 vWp;
#include <fog_pars_vertex>
void main(){
  vec4 wp = modelMatrix * vec4(iP.xyz, 1.0);
  vec4 mvPosition = viewMatrix * wp; float a = clamp(iQ.x, 0.0, 1.0);
  mvPosition.xy += position.xy * iP.w * (0.22 + 1.1 * sqrt(a));
  float op = smoothstep(0.0, 0.05, a) * (1.0 - a) * (1.0 - a) * smoothstep(1.2, 3.5, -mvPosition.z) * iQ.z;
  vQ = position.xy; vS = vec4(a, iQ.y, op * 0.85, 0.0); vWp = wp.xyz;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,P0=["uTime","uTau","uRate","uRose","uViolet","uSunDir","uSunCol","uSky","uGround","uRimCol"],c0=(v,t)=>new h.ShaderMaterial({uniforms:{...Ye(),...Ze(v,P0)},vertexShader:t,fragmentShader:Je,fog:!0,transparent:!0,depthWrite:!1});function B0(v,t){const c=je(!1),A=new h.InstancedBufferAttribute(new Float32Array(t*4),4),B=new h.InstancedBufferAttribute(new Float32Array(t*4),4);A.setUsage(h.DynamicDrawUsage),B.setUsage(h.DynamicDrawUsage),c.setAttribute("iP",A),c.setAttribute("iQ",B),c.instanceCount=t;const q=new h.Mesh(c,c0(v,w0));return q.frustumCulled=!1,q.renderOrder=3,q.name="free-breath",{object:q,set(G,k,U,_,R,H,ee,J){const pe=G*4;A.array[pe]=k,A.array[pe+1]=U,A.array[pe+2]=_,A.array[pe+3]=R,B.array[pe]=H,B.array[pe+1]=ee,B.array[pe+2]=J,B.array[pe+3]=0},flush(){A.needsUpdate=B.needsUpdate=!0}}}function T0(v,t,c){const A=[],B=[],q=[],G=[],k=(R,H,ee,J)=>{A.push(R.x,R.y||0,R.z,R.heading||0),B.push(R.type||0,R.phase||0,R.period||8,R.scale||1),q.push(...R.c||[0,0,0,0]),G.push(H-(R.phase||0),J??(R.period||8),ee,c())};for(const R of v)if(R.type===2){const H=R.c&&R.c[2]>.5,ee=H?5:10;for(let J=0;J<3;J++)k(R,H?(J+1.25)/ee:(2*J+2.25)/ee,H?.62:.44);k(R,.93,.3)}else R.type===5?k(R,c(),.22):R.type<5.5&&k(R,c(),.32);const U=je(!1);be(U,"iA",A,4),be(U,"iB",B,4),be(U,"iC",q,4),be(U,"iD",G,4),U.instanceCount=G.length/4;const _=new h.Mesh(U,c0(t,l0));return _.frustumCulled=!1,_.renderOrder=3,_.name="breath",_}const b0=`
attribute vec3 color; attribute vec3 aOff; attribute vec4 aW;
uniform float uTime; uniform float uPx; uniform float uWind;
varying vec3 vN; varying vec3 vWp; varying vec3 vCol; varying vec4 vW;
#include <fog_pars_vertex>
void main(){
  vec3 p = position; float sw = aW.x * uWind;
  p.x += sw * (0.07 * sin(uTime * 0.9 + aW.y) + 0.025 * sin(uTime * 2.3 + aW.y * 1.7));
  p.z += sw * 0.045 * sin(uTime * 0.7 + aW.y * 1.3);
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vec3 tc = cameraPosition - wp.xyz; float dist = length(tc);
  vec2 sd = vec2(tc.z, -tc.x); sd /= max(length(sd), 1e-4);               // ribbons turn to the lens and stay 1.5 px wide
  wp.xyz += vec3(sd.x, 0.0, sd.y) * aOff.x * clamp(uPx * dist * 0.75 / max(abs(aOff.x), 1e-4), 1.0, 6.0);
  vWp = wp.xyz; vN = mat3(modelMatrix) * normal; vCol = color; vW = aW;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,k0=`
uniform float uSnow;
varying vec3 vN; varying vec3 vWp; varying vec3 vCol; varying vec4 vW;
#include <fog_pars_fragment>
${Qe}
// river shingle: one layer of rounded stones. Returns (distance to the joint, stone id, distance to the stone's centre)
vec3 shingle(vec2 p){
  vec2 i = floor(p), f = fract(p); float d1 = 8.0, d2 = 8.0, id = 0.0;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y)); vec2 o = vec2(h2(i + g), h2(i + g + 17.3)); vec2 r = g + o - f; float d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; id = h2(i + g + 5.1); } else if (d < d2) { d2 = d; }
  }
  return vec3(sqrt(d2) - sqrt(d1), id, sqrt(d1));
}
void main(){
  vec3 N = vN / max(length(vN), 1e-4);
  vec3 Vv = cameraPosition - vWp; float dist = length(Vv); Vv /= max(dist, 1e-4);
  vec3 alb = vCol; float thin = 0.0; float rimK = 0.5; vec3 add = vec3(0.0);
  vec3 SNOW = vec3(0.60, 0.61, 0.64);
  float fw = length(fwidth(vWp.xz));                 // metres per pixel on the ground (taken before any loop)
  if (vW.w < 0.5) {                               // dark wet shingle: cobbles and pebbles, rime on their crowns, snow drifted to the bank foot
    float kA = 1.0 - smoothstep(0.10, 0.34, fw * 5.2); float kB = 1.0 - smoothstep(0.10, 0.34, fw * 15.0);
    vec3 A = shingle(vWp.xz * 5.2 + 3.0); vec3 B = shingle(vWp.xz * 15.0);
    float wet = 1.0 - smoothstep(0.02, 0.2, vW.z);
    float tone = mix(0.5, 0.34 + 0.5 * A.y, kA) * mix(1.0, 0.7 + 0.6 * B.y, kB);
    float kC = 1.0 - smoothstep(0.10, 0.34, fw * 1.9); vec3 C = shingle(vWp.xz * 1.9 + 11.0);            // cobbles the size of a loaf: these still read from the far end of the bar
    tone *= mix(1.0, 0.62 + 0.62 * C.y, kC);
    float patchy = vnoise(vWp.xz * 1.1 + 7.0); float lane = vnoise(vWp.xz * vec2(0.3, 1.7) + 2.0);        // beds of paler and darker gravel: these hold out to the far end of the bar
    tone *= 0.72 + 0.4 * patchy + 0.3 * lane;
    vec3 hue = mix(vec3(0.82, 0.92, 1.12), vec3(1.16, 0.98, 0.8), fract(A.y * 7.3 + B.y * 3.1 * kB));
    alb = vCol * hue * tone * 1.25;
    float joint = mix(1.0, smoothstep(0.0, 0.16, A.x), kA * 0.6) * mix(1.0, smoothstep(0.0, 0.2, B.x), kB * 0.5) * mix(1.0, smoothstep(0.0, 0.11, C.x), kC * 0.6);
    alb *= 0.25 + 0.75 * joint;
    float rime = smoothstep(0.42, 0.75, B.y) * smoothstep(0.10, 0.3, B.x) * kB + 0.35 * smoothstep(0.6, 0.9, A.y) * smoothstep(0.1, 0.3, A.x) * kA * (1.0 - kB);
    alb = mix(alb, SNOW * 0.8, rime * 0.55 * (1.0 - wet));
    float hoar = smoothstep(0.52, 0.7, 0.6 * vnoise(vWp.xz * 2.1 + 5.0) + 0.4 * vnoise(vWp.xz * 6.3)) * step(0.01, vW.z);        // patches of hoar on the dry stones: pale at any distance
    alb = mix(alb, SNOW * 0.62, hoar * 0.5 * (1.0 - wet));
    float ang = 6.2832 * B.y; vec3 bump = vec3(cos(ang), 0.0, sin(ang)) * (0.5 - B.z) * 1.1 * kB + vec3(cos(A.y * 40.0), 0.0, sin(A.y * 40.0)) * (0.45 - A.z) * 0.6 * kA;
    float cover = vnoise(vWp.xz * vec2(0.22, 0.6) + 3.0) * 0.6 + vnoise(vWp.xz * 1.3) * 0.4;
    float backK = (1.0 - smoothstep(-5.5, 1.5, vWp.z));
    float sn = smoothstep(0.60, 0.66, cover * 0.62 + backK * 0.36 + uSnow * 0.4 + 0.05 * (B.y - 0.5) * kB) * step(0.01, vW.z) * (1.0 - wet);
    float drift = 0.62 * vnoise(vWp.xz * vec2(0.16, 0.85) + 9.0) + 0.38 * vnoise(vWp.xz * vec2(0.55, 2.3) + 4.0);          // thin drifts the wind laid along the bar
    sn = max(sn, smoothstep(0.56, 0.63, drift + uSnow * 0.3 + 0.04 * (B.y - 0.5) * kB) * step(0.01, vW.z) * (1.0 - wet));
    alb = mix(alb, SNOW * (0.92 + 0.1 * vnoise(vWp.xz * 6.0)), sn);
    float lip = smoothstep(0.0, 0.025, vWp.y) * (1.0 - smoothstep(0.04, 0.10, vWp.y + 0.05 * (B.y - 0.5) * kB));       // a rind of ice where the stones meet the water
    alb = mix(alb, vec3(0.36, 0.44, 0.52), lip * 0.75);
    N = normalize(N + bump * (1.0 - sn) + vec3(0.0, 0.6, 0.0));
    float gl = step(0.982, h2(floor(vWp.xz * 60.0))) * max(sn, 0.5 * rime) * (1.0 - smoothstep(14.0, 34.0, dist));   // frost glints
    add = uSunCol * gl * 1.6 * (0.5 + 0.5 * sin(dot(Vv, vec3(40.0, 13.0, 29.0)) + vWp.x * 3.0));
    float fres = 1.0 - max(dot(N, Vv), 0.0); fres *= fres; fres *= fres;
    add += (uSky * 0.55 + uSunCol * 0.25 * smoothstep(0.2, 0.9, dot(reflect(-Vv, N), uSunDir))) * fres * (0.25 + 0.75 * wet) * (1.0 - sn);     // wet stones take the sky
  } else if (vW.w < 1.5) {                        // cut bank: dark frozen earth in strata, frost creeping down from the lip
    // dark frozen river earth in beds: loam over silt and a seam of gravel, cracked by the frost, pebbles and root holes close to; frost
    // creeps down from the lip. The face looks away from the sun: it stands in its own shade under the blue of the sky, and only the
    // rime at its lip takes a little of the key
    float bed = vnoise(vec2(vWp.x * 0.22, vWp.y * 5.5 + 0.6 * vnoise(vec2(vWp.x * 0.5, 3.0)))); float st = vnoise(vec2(vWp.x * 0.7, vWp.y * 9.0)); float cl = vnoise(vWp.xy * 3.3 + vWp.z);
    float kN = 1.0 - smoothstep(0.02, 0.08, fw);
    float crack = (1.0 - smoothstep(0.0, 0.09, abs(vnoise(vec2(vWp.x * 2.3, vWp.y * 1.1) + 7.0) - 0.5))) * kN;
    float grit = vnoise(vec2(vWp.x * 19.0, vWp.y * 23.0)) * kN;
    alb *= (0.5 + 0.55 * bed + 0.35 * st * cl) * mix(vec3(1.12, 1.0, 0.86), vec3(0.9, 0.98, 1.1), smoothstep(0.35, 0.7, bed)) * (1.0 - 0.5 * crack) * (0.85 + 0.4 * grit);
    alb = mix(alb, vec3(0.105, 0.1, 0.1) * (0.6 + 0.8 * grit), smoothstep(0.62, 0.74, vnoise(vec2(vWp.x * 0.13, vWp.y * 4.0 + 9.0))) * 0.7);
    float fr = smoothstep(0.62, 0.95, vW.z + 0.3 * vnoise(vWp.xy * vec2(2.0, 5.0)));
    alb = mix(alb, SNOW, max(fr, 0.5 * smoothstep(0.55, 0.8, vnoise(vec2(vWp.x * 1.7, vWp.y * 7.0) + 4.0)) * smoothstep(1.2, 2.6, vWp.y)));
    add = SNOW * uSunCol * 0.07 * fr * smoothstep(1.6, 2.9, vWp.y);
    rimK = 0.15;
  } else if (vW.w < 2.5) {                        // frosted stems: dark thread inside a fur of rime that the sun lights through
    N = normalize(Vv * 0.7 + vec3(0.0, 0.6, 0.0) + N * 0.3);
    alb = mix(alb, SNOW * 1.1, vW.z);
    thin = 1.0; rimK = 0.0;
    float bk = max(dot(-Vv, uSunDir), 0.0); float farS = smoothstep(7.0, 24.0, dist);
    alb *= mix(1.0, 0.5, bk * farS);                                         // looked at against the sun from far off we see the shaded side of the fur: blue-grey, drawn on the glowing steam
    add = uSunCol * vW.z * (0.10 + 0.75 * bk * bk) * (1.0 - 0.75 * farS);
  } else {                                        // snow caps and the dead sedge under them: plain, softly modelled
    float nn = vnoise(vWp.xz * 14.0 + vWp.y * 9.0);
    alb *= 0.86 + 0.28 * nn;
    N = normalize(N + vec3(nn - 0.5, 0.0, vnoise(vWp.zx * 11.0) - 0.5) * 0.5);
    rimK = 0.35 * vW.z;
    add = uSunCol * vW.z * step(0.975, h2(floor(vWp.xz * 70.0))) * 1.2 * (1.0 - smoothstep(8.0, 22.0, dist));
  }
  vec3 col = shade(alb, N, Vv, thin, rimK) + add;
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`;async function M0(v,t,c,A){const B=[],q=[],G=[],k=[],U=[],_=[],R=(a,l,s,n,f,x,M)=>(B.push(a,l,s),q.push(n[0],n[1],n[2]),G.push(f[0],f[1],f[2]),k.push(x[0],x[1],x[2]),U.push(M[0],M[1],M[2],M[3]),B.length/3-1),H=(a,l,s,n)=>{_.push(a,l,s,a,s,n)},ee=[0,0,0],J=[0,1,0],pe=A.coves||[],oe=a=>{let l=0;for(const s of pe){const n=(a-s)/2.6;l+=Math.exp(-n*n)}return l},de=a=>7.4*Math.pow(Math.max(1-(a/(a<0?52:43.5))**2,0),.32)+.7*c.n2(a*.07,3.1)+.25*c.n2(a*.31,9.7)-1.7*oe(a),$=(a,l)=>{const s=de(a)-l,n=a<0?ke(54.5,49.5,-a):ke(46,41,a);return-.35+.65*ke(-.4,2,s)*n+.035*c.n2(a*.45,l*.45)*ke(.3,2.5,s)};{const M=B.length/3;for(let Z=0;Z<=118;Z++){(Z&15)===0&&await v.yield();for(let S=0;S<=20;S++){const j=fe(-58,50,Z/118),L=fe(-8.6,11,Math.pow(S/20,.9)),O=$(j,L),K=($(j+.3,L)-$(j-.3,L))/.6,me=($(j,L+.3)-$(j,L-.3))/.6,re=Math.hypot(K,1,me),ue=ke(.14,0,O),xe=.165+.035*c.n2(j*.2,L*.2);let Me=[fe(xe,.035,ue),fe(xe*.97,.037,ue),fe(xe*.95,.044,ue)];R(j,O,L,[-K/re,1/re,-me/re],Me,ee,[0,0,ke(.16,.3,O),0])}}for(let Z=0;Z<118;Z++)for(let S=0;S<20;S++){const j=M+Z*21+S;H(j,j+1,j+20+2,j+20+1)}}const W=a=>-8.3+.9*c.n2(a*.05,5.5)+.35*c.n2(a*.23,1.5),g=(a,l)=>3.05+.25*c.n2(a*.06,l*.06+20)+.08*c.n2(a*.4,l*.4);{const l=[[.5,.25,0],[.05,.75,0],[-.35,1.4,.05],[-.15,2.1,.25],[.25,2.65,.6],[.1,2.95,1.2],[-.5,3.1,2],[-2.2,3.2,2],[-6,3.25,2],[-12,2.9,2],[-16,1.2,2],[-19,-.3,2]],s=B.length/3,n=l.length;await v.yield();for(let f=0;f<=130;f++){const x=fe(-60,60,f/130),M=W(x),Z=.3*c.n2(x*.5,2.2);for(let S=0;S<n;S++){const[j,L,O]=l[S],K=O>=2,me=K?g(x,M+j)+(L-3.1):L*(g(x,M)/3.05)+0,re=M+j+(K?0:Z*(L/3)*.8+.15*c.n2(x*1.3,L*2)),ue=.035+.02*c.n2(x*.3,L);R(x,me,re,K?J:[0,.25,.97],K?[.6,.61,.64]:[ue*1.25,ue,ue*.85],ee,[0,0,K?1:O,K?0:1])}}for(let f=0;f<130;f++)for(let x=0;x<n-1;x++){const M=s+f*n+x;H(M,M+n,M+n+1,M+1)}}const d=(a,l,s,n,f,x,M=.25)=>{const Z=B.length/3,S=a.length;for(let j=0;j<S;j++){const L=j/(S-1),O=l*fe(1,M,L),K=f*L*L;R(a[j][0],a[j][1],a[j][2],J,s,[-O,0,0],[K,x,n,2]),R(a[j][0],a[j][1],a[j][2],J,s,[O,0,0],[K,x,n,2])}for(let j=0;j<S-1;j++){const L=Z+j*2;H(L,L+1,L+3,L+2)}},E=(a,l,s,n,f)=>{const x=t.range(-.25,.25),M=t.range(-.15,.15),Z=[];for(let O=0;O<=3;O++){const K=O/3;Z.push([a+x*K*K*n,l+n*K*(1-.06*K),s+M*K*K*n])}d(Z,.012,[.34,.27,.15],.45,1,f,.6);const S=Z[3],j=[x+t.range(-.3,.3),t.range(-.5,.1),M],L=t.range(.22,.36);d([[S[0],S[1],S[2]],[S[0]+j[0]*L*.5,S[1]+L*.45,S[2]+j[2]*L],[S[0]+j[0]*L,S[1]+L*(.7+j[1]*.5),S[2]+j[2]*L]],.045,[.42,.34,.2],.85,1.2,f,.3)},w=(a,l,s,n,f,x,M,Z)=>{const S=[],L=Math.sin(x),O=Math.cos(x);for(let K=0;K<=6;K++){const me=K/6,re=f*n*me*me;S.push([a+L*re,l+n*me*(1-.12*f*me),s+O*re])}if(d(S,.02*(.6+n*.18),[.06,.045,.04],.55+.3*t(),.8,M,.25),Z>0)for(let K=0;K<3;K++){const me=t.range(.35,.85),re=Math.floor(me*6),ue=S[re];w(ue[0],ue[1],ue[2],n*t.range(.22,.4),t.range(.6,1.4),x+t.range(-1.6,1.6),M+K,0)}},N=Math.round(620*(A.detail??1));await v.yield();for(let a=0;a<N;a++){(a&63)===0&&await v.yield();const l=t.range(-58,58);if(c.n2(l*.09,40)+.3*c.n2(l*.5,41)<-.15&&t()<.8)continue;const n=W(l)-.7-Math.abs(t.gauss())*1.6;E(l,g(l,n)-.05,n,t.range(1.5,2.3),l*.6+t())}await v.yield();for(let a=0;a<150;a++){const l=t.sign(),s=l*t.range(39.5,47.5),n=t.range(-7.5,-1.5)+.25*(47-Math.abs(s)),f=$(s,n);f<-.2||E(s,Math.max(f,-.05),n,t.range(1.3,2.1),s+t())}const r=34;for(let a=0;a<r;a++){(a&3)===0&&await v.yield();const l=fe(-57,57,(a+t())/r),s=W(l)-t.range(1.6,7.5),n=g(l,s)-.1,f=t.range(.8,1.5),x=t.int(7,12);for(let M=0;M<x;M++)w(l+t.range(-.3,.3),n,s+t.range(-.3,.3),t.range(2.2,4.6)*f,t.range(.05,.4),t.range(0,6.28),l+M,1)}await v.yield();for(let a=0;a<170;a++){const l=t.range(-58,58),s=W(l)+.32,n=g(l,s)*.93,f=t.range(.3,1.1),x=t.range(-.2,.2);d([[l,n,s],[l+x*.5,n-f*.5,s+.12],[l+x,n-f,s+.08]],.012,[.2,.16,.1],.7,.5,l*3,.4)}{const a=v.core.makeRng(v.core.hashSeed(v.seed+":bank-fur"));for(let l=0;l<150;l++){const s=a.range(-58,58),n=W(s)+.3,f=g(s,n)*a.range(.82,.95),x=a.range(.7,1.9),M=a.range(-.35,.35);d([[s,f,n],[s+M*.4,f-x*.4,n+.16],[s+M*.8,f-x*.75,n+.1],[s+M,f-x,n+.14]],.016,[.13,.09,.06],a.range(.25,.6),.3,s*3,.35)}await v.yield();for(let l=0;l<320;l++){const s=a.range(-58,58),n=W(s)+a.range(.05,.45),f=g(s,n)-.06,x=a.range(.25,.6),M=a.range(-.25,.25),Z=a.range(.2,.5);d([[s,f,n],[s+M*.5,f+x*.6,n+Z*.4],[s+M,f+x*.55,n+Z],[s+M*1.2,f+x*.1,n+Z*1.5]],.014,[.4,.32,.17],a.range(.7,1),.8,s*2,.3)}await v.yield();for(let l=0;l<160;l++){const s=a.range(-56,56),n=W(s)+a.range(.5,1.3),f=$(s,n)-.03,x=a.range(.3,.7),M=a.range(-.3,.3);d([[s,f,n],[s+M*.5,f+x*.7,n+.05],[s+M,f+x,n+.12]],.013,[.38,.3,.16],a.range(.6,1),.8,s*2,.3)}}const p=v.core.makeRng(v.core.hashSeed(v.seed+":tussock")),P=(a,l,s,n,f,x=20,M=1)=>{const S=t.range(0,6.28),j=p.range(0,6.28),L=p.range(0,6.28),O=p.range(-.22,.22)*n,K=p.range(-.22,.22)*n,me=Q=>1+.17*Math.sin(2*Q+j)+.1*Math.sin(3*Q+L),re=(Q,le,X,ie,Y,ve,te,z)=>{const se=B.length/3;for(let Pe=0;Pe<13;Pe++){const ze=Pe/13*6.283+S,Ge=Q*me(ze)*(1-te+2*te*p());R(a+O*z+Math.cos(ze)*n*Ge,l+f*le*(1-.6*te+1.2*te*p())*(.85+.15*me(ze+1.3)),s+K*z+Math.sin(ze)*n*Ge,[Math.cos(ze)*(1-ie),ie,Math.sin(ze)*(1-ie)],X,ee,[0,0,ve,Y])}return se},ue=(Q,le)=>{for(let X=0;X<13;X++){const ie=Q+X,Y=Q+(X+1)%13,ve=le+X,te=le+(X+1)%13;H(ie,ve,te,Y)}},xe=[.6,.61,.64],Me=[.44,.48,.56],Ie=re(.8,-.12,[.06,.05,.035],.3,3,0,.12,0),Le=re(.72,.46,[.085,.07,.045],.25,3,0,.1,.3);ue(Ie,Le);const He=re(.9,.4,Me,-.3,3,.4,.08,.3),Ce=re(1.22,.47,Me,.1,3,.7,.1,.4),Fe=re(1.16,.64,xe,.5,3,1,.1,.5),Ae=re(.84,.86,xe,.8,3,1,.1,.8),Ne=re(.42,1,xe,.95,3,1,.12,1);ue(He,Ce),ue(Ce,Fe),ue(Fe,Ae),ue(Ae,Ne);const Be=R(a+O,l+f*1.06,s+K,J,xe,ee,[0,0,1,3]);for(let Q=0;Q<13;Q++)_.push(Ne+Q,Be,Ne+(Q+1)%13);for(let Q=0;Q<15;Q++){const le=(Q+p.range(.1,.9))/15*6.283+S,X=Math.cos(le),ie=Math.sin(le),Y=me(le),ve=p.range(1.35,1.95),te=p.range(1.18,1.36),z=p.range(.28,.44),se=p.range(.7,1.1);d([[a+X*n*.98*Y,l+f*.5,s+ie*n*.98*Y],[a+X*n*te*Y,l+f*z,s+ie*n*te*Y],[a+X*n*ve*Y,l+f*.03,s+ie*n*ve*Y]],Math.max(.012,n*p.range(.06,.1)),[.3*se,.235*se,.115*se],p.range(.1,.45),.2,S+Q,.3)}for(let Q=0;Q<12;Q++){const le=(Q+p.range(.1,.9))/12*6.283+S+.2,X=Math.cos(le),ie=Math.sin(le),Y=me(le),ve=p.range(1.02,1.3),te=p.range(.45,.75);d([[a+X*n*.88*Y,l+f*.47,s+ie*n*.88*Y],[a+X*n*.98*Y,l+f*p.range(.2,.3),s+ie*n*.98*Y],[a+X*n*ve*Y,l+f*0,s+ie*n*ve*Y]],Math.max(.014,n*p.range(.08,.12)),[.26*te,.2*te,.1*te],p.range(0,.25),.1,S+Q*2,.4)}for(let Q=0;Q<x;Q++){const le=Q/x*6.283+t.range(-.25,.25),X=Math.cos(le),ie=Math.sin(le),Y=t.range(.5,1.5),ve=f*t.range(1.1,2)*M,te=t.range(.8,1.15),z=n*t.range(.25,.8);d([[a+X*z,l+f*.5,s+ie*z],[a+X*(z+n*.45*Y),l+f*.5+ve*.55,s+ie*(z+n*.45*Y)],[a+X*(z+n*1*Y),l+f*.5+ve*.92,s+ie*(z+n*1*Y)],[a+X*(z+n*1.55*Y),l+f*.5+ve*(1-.14*Y),s+ie*(z+n*1.55*Y)]],.012,[.42*te,.33*te,.16*te],t.range(.15,.5),.35,S+Q,.3)}for(let Q=0;Q<5;Q++){const le=t.range(0,6.28),X=n*t.range(.1,.7),ie=t.range(.2,.42),Y=t.range(-.08,.08),ve=t.range(-.08,.08),te=a+Math.cos(le)*X,z=s+Math.sin(le)*X;d([[te,l+f*.8,z],[te+Y*.5,l+f*.8+ie*.6,z+ve*.5],[te+Y,l+f*.8+ie,z+ve]],.009,[.44,.35,.18],t.range(.3,.6),.6,S+Q*2,.35)}},D=2.3,y=A.lineDist,m=.1052*(A.wind??1),I={made:0,notMade:0},ne=(...a)=>{const l=B.length/3,s=_.length;if(P(...a),I.made++,!y)return;let n=!1;for(let f=l,x=B.length/3;f<x&&!n;f++)n=y(B[f*3],B[f*3+1],B[f*3+2])-Math.abs(k[f*3])-m*U[f*4]<D;n&&(B.length=q.length=G.length=k.length=l*3,U.length=l*4,_.length=s,I.made--,I.notMade++)};for(let a=0,l=-49.5;l<41.5;a++){(a&3)===0&&await v.yield();const s=1+Math.floor(t()*t()*4.4),n=t()<.3?t.range(1.8,3.6):t.range(.55,1.5);for(let f=0;f<s;f++){const x=l+(f?t.range(-.9,.9):0),M=de(x)-n-(f?t.range(-.3,.7):0),Z=$(x,M),S=t();S<.3?ne(x,Z,M,t.range(.24,.4),t.range(.13,.2),t.int(3,7),1.6):S<.55?ne(x,Z,M,t.range(.1,.16),t.range(.14,.24),t.int(8,12),1.1):ne(x,Z,M,t.range(.17,.32),t.range(.24,.46),t.int(13,22),t.range(.8,1.25))}l+=t()<.4?t.range(4.5,8.5):t.range(1.6,3.4)}for(let a=0;a<12;a++){(a&3)===0&&await v.yield();const l=t.range(-48,40),s=W(l)+t.range(1.2,2.6);P(l,$(l,s),s,t.range(.2,.34),t.range(.28,.44),t.int(10,20))}await v.yield();const ae=new h.BufferGeometry;return ae.setAttribute("position",new h.Float32BufferAttribute(B,3)),ae.setAttribute("normal",new h.Float32BufferAttribute(q,3)),await v.yield(),ae.setAttribute("color",new h.Float32BufferAttribute(G,3)),ae.setAttribute("aOff",new h.Float32BufferAttribute(k,3)),await v.yield(),ae.setAttribute("aW",new h.Float32BufferAttribute(U,4)),ae.setIndex(_),{geometry:ae,barY:$,front:de,bankZ:W,bankTop:g,lip:I}}const S0=`
attribute vec3 aS; varying vec3 vS;
#include <fog_pars_vertex>
void main(){ vS = aS; vec4 mvPosition = viewMatrix * modelMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,z0=`
uniform vec3 uSky; uniform float uShK; varying vec3 vS;
#include <fog_pars_fragment>
void main(){
  float ac = 1.0 - vS.x * vS.x; float t = clamp(vS.y, 0.0, 1.0);
  float al = ac * ac * (0.5 * (1.0 - t) * (1.0 - 0.6 * t) + 0.4 * exp(-t * 16.0)) * smoothstep(0.0, 0.04, t) * vS.z * uShK;
  if (al < 0.004) discard;
  gl_FragColor = vec4(uSky * 0.06, min(al, 0.8));
  #include <fog_fragment>
}`,C0=`
varying vec3 vN; varying vec3 vWp; varying vec3 vCol;
#include <fog_pars_fragment>
${Qe}
void main(){
  vec3 Vv = cameraPosition - vWp; Vv /= max(length(Vv), 1e-4);
  vec3 N = Vv * 0.7 + vec3(0.0, 0.6, 0.0) + vN * 0.2; N /= max(length(N), 1e-3);
  float bk = max(dot(-Vv, uSunDir), 0.0);
  gl_FragColor = vec4(shade(vCol, N, Vv, 1.0, 0.0) + uSunCol * 0.5 * bk * bk, 1.0);
  #include <fog_fragment>
}`;function A0(){const v=[],t=[],c=[],A=[],B=(U,_,R,H,ee,J)=>{const pe=v.length/3,oe=4;for(let de=0;de<=oe;de++){const $=de/oe,W=fe(U,_,$),g=R*(1-.5*Math.abs($-.5)),d=[fe(ee[0],J[0],$),fe(ee[1],J[1],$),fe(ee[2],J[2],$)],E=.03*Math.sin($*3);for(const w of[-1,1])v.push(W,H?E:w*g+E,H?w*g:0),t.push(0,H?1:0,H?0:1),c.push(d[0],d[1],d[2])}for(let de=0;de<oe;de++){const $=pe+de*2;A.push($,$+1,$+3,$,$+3,$+2)}},q=[.36,.29,.16],G=[.62,.6,.6];B(-.5,.5,.006,0,q,q),B(-.5,.5,.006,1,q,q),B(.22,.56,.035,0,q,G),B(.22,.56,.035,1,q,G),B(-.2,.1,.02,0,q,q);const k=new h.BufferGeometry;return k.setAttribute("position",new h.Float32BufferAttribute(v,3)),k.setAttribute("normal",new h.Float32BufferAttribute(t,3)),k.setAttribute("color",new h.Float32BufferAttribute(c,3)),k.setIndex(A),k}const be=(v,t,c,A)=>v.setAttribute(t,new h.InstancedBufferAttribute(new Float32Array(c),A));function je(v){const t=new h.InstancedBufferGeometry,c=[-1,-1,0,1,-1,0,1,1,0,-1,1,0],A=[0,1,2,0,2,3];return v&&(c.push(-1,-1,1,1,-1,1,1,1,1,-1,1,1),A.push(4,5,6,4,6,7)),t.setAttribute("position",new h.Float32BufferAttribute(c,3)),t.setIndex(A),t}const f0={dawn:{sun:null,k:1.25,sky:.8,steam:1,sleep:0},blue:{sun:"#9C8FCB",k:.45,sky:.6,steam:1.1,sleep:.45},morning:{sun:"#FFF1DC",k:1.5,sky:.7,steam:.45,sleep:0},evening:{sun:"#FFB25E",k:1.3,sky:.65,steam:.9,sleep:.1},moon:{sun:"#9FB4E8",k:.5,sky:.22,steam:.8,sleep:.5}};async function W0(v,t={}){const c=v.rng,A=v.noise,B=t.palette&&t.palette.length>=7?t.palette:s0,q=v.quality?.detail??1,G=f0[t.hour]||f0.dawn,k=t.weather||"still",U=t.season||"winter",_=r0(B,t);_.uSunCol.value.copy(Re(G.sun||B[3])).multiplyScalar(G.k*(k==="snow"?.45:1)),_.uRimCol.value.copy(_.uSunCol.value),_.uSky.value.copy(Re(B[4])).multiplyScalar(G.sky*(k==="snow"?1.25:1)),_.uGround.value.copy(Re(B[4])).lerp(Re(B[2]),.4).multiplyScalar(.42*G.sky/.8),_.uRate={value:0},_.uDance={value:0};const R=t.leaveSeconds??16,H=new h.Group;H.name="cranes-in-steam-hero";const ee=(e,i,o,u={})=>new h.ShaderMaterial({uniforms:{...Ye(),...Ze(_,o)},vertexShader:e,fragmentShader:i,fog:!0,...u}),J=["uSunDir","uSunCol","uSky","uGround","uRimCol"],pe=[-36,-17,2,21],oe=await M0(v,c.fork("setting"),A,{detail:q,coves:pe,lineDist:t.lineDist,wind:k==="wind"?3.2:1}),de=ee(b0,k0,["uTime","uPx",...J],{side:h.DoubleSide});de.uniforms.uWind={value:k==="wind"?3.2:1},de.uniforms.uSnow={value:U==="thaw"?-.5:k==="snow"?.8:0};const $=new h.Mesh(oe.geometry,de);$.frustumCulled=!1,H.add($),await v.yield();const W=c.fork("cranes"),g=[],d=[],E=[],w=t.lineZ??9.6,N=Math.round(De(t.count??W.int(21,25)*2,28,96)/2)*2,r=W.range(-.3,.3),p=(e,i)=>Math.min(w-i,oe.front(e)-1),P=["bow","leap","duet","leap","idle","leap","toss","leap","bow","leap","preen","leap"],D=["leap","bow","idle","leap","duet","sleep","leap","bow","preen","leap","duet","bow"],y=[],m=v.core.makeRng(v.core.hashSeed(v.seed+":dance-floor")),I=5;for(let e=0,i=-44.6;i<38.6;e++,i+=4.2){const o=P[e%P.length],u=o==="leap",b=u||o==="bow",T=i+r+m.range(-.3,.3),F=u?I+.42:o==="bow"?I+.45+m.range(0,.4):I+.5+m.range(0,.9),V=(u?2.72:o==="duet"?.2:.49)+m.range(-1,1)*(u?.2:o==="duet"?.3:.6)+(!b&&o!=="duet"&&m.chance(.5)?Math.PI:0),he=u?7:o==="bow"?8:void 0,ce=(.3+.37*e)%1;y.push({kind:o,x:T,z:p(T,F),ang:V,H:u?m.range(1.8,2.1):0,ph:ce,T:he,front:!0,turn:b||o==="duet"?0:1.2})}const ne=y.length;for(let e=0,i=-42.5;i<36.6;e++,i+=4.2){const o=D[e%D.length],u=o==="leap",b=u||o==="bow",T=i+r+m.range(-.4,.4),F=Math.min(w-7.3-m.range(0,1.2),oe.front(T)-2.6);y.some(V=>Math.hypot(V.x-T,V.z-F)<2.2)||y.push({kind:o,x:T,z:F,ang:(u?2.6:o==="duet"?-.25:.6)+m.range(-1,1)*(b?.3:.7),H:u?m.range(1.3,1.9):0,ph:(.62+.29*e)%1,T:u?m.range(6.5,8):void 0,second:!0,turn:b||o==="duet"?0:1.2})}const ae=(e,i,o)=>E.every(u=>Math.hypot(u.x-e,u.z-i)>o);for(const e of y)E.push(e);const a=Math.max(4,Math.round((N-2*y.length)/2));for(let e=0,i=0;e<a&&i<800;i++){const o=m.range(-44,36),u=m.range(-6,-2.4);if(!ae(o,u,3.2))continue;const b=m();let T=b<.25?"duet":b<.6?"idle":"preen";m()<G.sleep&&(T="sleep"),E.push({kind:T,x:o,z:u,ang:m.range(-.7,.7)+(m.chance(.5)?Math.PI:0),H:0}),e++}const l=[];pe.forEach((e,i)=>{[-1,1].forEach(o=>{const u=e+o*m.range(.7,1.1),b=Math.min(oe.front(u)+.4,w-I)-(o>0?0:.35);y.some(T=>Math.hypot(T.x-u,T.z-b)<1.5)||l.push({x:u,z:b,kind:o>0?i%2?"preen":"stretch":i%2?"stretch":"sleep",hd:Math.PI/2+(o>0?Math.PI:0)+m.range(-.5,.5),ph:m()})})});const s=v.core.makeRng(v.core.hashSeed(v.seed+":extra-cranes"));for(const e of t.extraPairs||[])E.push({...e,extra:!0,H:e.H??s.range(1.2,1.9),ph:e.ph??s(),T:e.T??(e.kind==="leap"?7:s.range(6.5,9))});let n=!1,f=0;const x=(e,i,o)=>o&&t.extraGround?t.extraGround(e,i):Math.max(oe.barY(e,i),-.06);let M=!1;const Z=e=>(e.extra=n,e.grp=n?f:0,e.near=M,n||(e.z=Math.min(e.z,w-I)),e.y=e.y??x(e.x,e.z,n),e.scale=e.scale??W.range(.95,1.04),g.push(e),e),S=(e,i,o,u,b)=>d.push({b:i,off:o-i.phase,per:b??i.period,size:u,seed:e()});let j=null,L=[];E.forEach((e,i)=>{n=!!e.extra,f=e.g??0,M=!!e.front;const o=e.extra?s:W,u=e.kind==="duet",b=e.ang+(u?Math.PI/2:0),T=Math.cos(b),F=Math.sin(b),V=u?.4:o.range(.8,1),he=e.T??o.range(6.5,9),ce=e.ph??o(),ge=!e.front&&o.chance(.08)?2:0;for(const we of[-1,1]){const ye=we>0?1:0,qe=e.x+T*V*we-(u?F*.22*we:0),Se=e.z+F*V*we+(u?T*.22*we:0);let C={x:qe,z:Se,heading:Math.atan2(-T*we,-F*we),period:he,phase:ce,scale:(ye?1.03:.97)*o.range(.98,1.02)*(e.big??1)};const _e=e.juv&&!ye?2:ge;if(e.kind==="leap"||e.kind==="bow"?(C.type=1,C.phase=(ce+(ye?0:.76))%1,C.c=[e.kind==="leap"?e.H*(ye?1:o.range(.7,.95)):0,0,ye,ge]):e.kind==="duet"?(C.type=2,C.heading=Math.atan2(-F,T)+o.range(-.15,.15),C.period=he*.8,C.c=[0,0,ye,0]):e.kind==="toss"?ye?(C.type=3,C.period=9,C.c=[.95,0,1,0]):(C.type=0,C.c=[1,0,0,0]):e.kind==="sleep"?(C.type=5,C.heading+=o.range(-1,1),C.c=[0,ye,0,0]):e.kind==="preen"?(C.type=ye?4:0,C.c=[1,o.chance(.5)?1:0,0,_e]):(C.type=0,C.phase=o(),C.c=[o.chance(.6)?1:0,0,ye,_e]),e.turn&&C.type!==5&&(C.heading+=m.range(-e.turn,e.turn)),Z(C),C.type===2){const Ke=ye?5:10;for(let Te=0;Te<3;Te++)S(o,C,ye?(Te+1.25)/Ke:(2*Te+2.25)/Ke,ye?.62:.44);S(o,C,.93,.3)}else C.type!==5?(S(o,C,o(),.34),S(o,C,o(),.3),C.type===1&&C.c[0]>0&&S(o,C,.76,.5)):S(o,C,o(),.22);C.type===3&&L.push(C),e===y[1]&&ye&&(j=C)}}),n=!1,M=!0;for(const e of l){const i={x:e.x,z:e.z,heading:e.hd,period:m.range(7,10),phase:e.ph,scale:m.range(.98,1.05)};e.kind==="sleep"?(i.type=5,i.c=[0,m.chance(.5)?1:0,0,0]):e.kind==="preen"?(i.type=4,i.c=[1,m.chance(.5)?1:0,0,0]):(i.type=0,i.c=[1,0,1,0]),Z(i),S(W,i,m(),i.type===5?.22:.34)}await v.yield();const O=new h.Vector3(...t.exit||[150,7.5,w]),K=t.camX0??12,me=12.6,re=.5*4.5*2.8*2.8,ue=Math.max(0,Math.round(t.leavers??12)),xe=[],Me=[],Ie=(e,i)=>Math.max((e-re-K-i)/me,0),Le=(e,i,o)=>{const u=(e?-1:1)*W.range(2.7,i),b=W.range(o,5)*Math.sqrt(Math.max(1-(u/(i+.9))**2,0));return[u,b]};for(let e=0;xe.length<ue&&e<800;e++){const i=xe.length%12<7,o=W.range(46,58),u=w+(i?-W.range(4.6,10.5):W.range(5,10.5));if(!xe.every(V=>Math.hypot(V.x-o,(V.z-u)*1.4)>2.4))continue;const[b,T]=Le(i,4.8,-2.6),F=Math.min(W.range(7,13),o-re-K-1);xe.push({x:o,y:-.06,z:u,type:6,heading:Math.atan2(O.x-o,O.z+b-u),phase:W(),period:4,scale:W.range(.95,1.04),aimY:O.y+T,tuck:W.chance(.35)?1:0,wait:Ie(o,F),climb:30})}const He=Math.max(0,Math.round(t.roost??0));for(let e=0,i=0;e<He&&i<4e3;i++){const o=e%2===0,u=46+38*Math.pow(W(),1.7),b=w+(o?-1:1)*W.range(3.4,10);if(!xe.every(he=>Math.hypot(he.x-u,(he.z-b)*1.3)>2))continue;const[T,F]=Le(o,5.3,-1.2),V=Math.min(8+26*Math.pow(W(),1.4),u-re-K-.5);xe.push({x:u,y:-.06,z:b,type:6,heading:Math.atan2(O.x-u,O.z+T-b),phase:W(),period:4,scale:W.range(.95,1.04),aimY:O.y+F,tuck:W.chance(.35)?1:0,wait:Ie(u,V),climb:W.range(20,32),roost:!0}),e++}const Ce=[];xe.forEach(e=>{e.c=[e.wait,e.climb,e.aimY-e.y-.92*e.scale,e.tuck],Ce.push(e);for(let b=0;b<(e.roost?2:4);b++)d.push({b:e,off:b/(e.roost?2:4)+W.range(0,.1),per:2,size:.34,seed:W()});const i=2*e.scale,o=Math.sin(e.heading),u=Math.cos(e.heading);for(const[b,T]of[[.18,-1],[.68,1]])for(let F=0;F<3;F++){const V=(F+1-b)*i-0;if(V>4.6||V<.2)continue;const he=V+.18*i,ce=T*.065*e.scale;Me.push(e.x+o*he+u*ce,e.z+u*he-o*ce,e.c[0]+Math.sqrt(2*V/4.5),W.range(.5,.75))}}),await v.yield();const Fe=Ee(1),Ae=ee(Xe,$e,["uTime","uTau","uPx","uCrown",...J],{side:h.DoubleSide}),Ne=ee(Xe,$e,["uTime","uTau","uPx","uCrown",...J],{side:h.DoubleSide});Ne.uniforms.uTime=_.uDance;const Be=new h.Mesh(We(Fe,g.filter(e=>e.near)),Ae);Be.frustumCulled=!1,Be.name="cranes",H.add(Be),await v.yield();const Q=Ee(.66),le=[Be],X=[];{const e=new h.Mesh(We(Q,g.filter(i=>!i.near&&!i.extra)),Ae);e.frustumCulled=!1,e.name="cranes-mid",H.add(e),le.push(e)}const ie=g.some(e=>e.extra)?Ee(t.extraDetail??.85):null,Y=[...new Set(g.filter(e=>e.extra).map(e=>e.grp))].sort((e,i)=>e-i);for(const e of Y){const i=g.filter(V=>V.extra&&V.grp===e),o=new h.Mesh(We(ie,i),Ne);o.name="cranes-shoals",H.add(o),(X[e]=X[e]||[]).push(o);let u=1e9,b=-1e9,T=1e9,F=-1e9;for(const V of i)u=Math.min(u,V.x),b=Math.max(b,V.x),T=Math.min(T,V.z),F=Math.max(F,V.z);o.geometry.boundingSphere=new h.Sphere(new h.Vector3((u+b)/2,1.5,(T+F)/2),Math.hypot(b-u,F-T)/2+5),o.frustumCulled=!0}await v.yield();const ve=Ee(.6);if(Ce.length){const e=new h.Mesh(We(ve,Ce),Ae);e.frustumCulled=!1,e.name="leavers",H.add(e),le.push(e)}await v.yield();const te={transparent:!0,depthWrite:!1};{const e=_.uSunDir.value,i=Math.hypot(e.x,e.z)||1,o=-e.x/i,u=-e.z/i,b=t.shadowLen??3.2,T=6,F=[],V=[],he=[];for(const we of g){const ye=F.length/3,qe=we.scale||1;for(let Se=0;Se<=T;Se++){const C=Se/T,_e=-.25+C*(b+.25),Ke=we.x+o*_e,Te=we.z+u*_e,a0=(.17+.3*C)*qe;for(const Ue of[-1,1]){const o0=Ke+u*Ue*a0,n0=Te-o*Ue*a0,i0=x(o0,n0,we.extra);F.push(o0,i0+.03,n0),V.push(Ue,C,i0>.04?1:0)}}for(let Se=0;Se<T;Se++){const C=ye+Se*2;he.push(C,C+1,C+3,C,C+3,C+2)}}const ce=new h.BufferGeometry;ce.setAttribute("position",new h.Float32BufferAttribute(F,3)),ce.setAttribute("aS",new h.Float32BufferAttribute(V,3)),ce.setIndex(he);const ge=new h.Mesh(ce,ee(S0,z0,["uSky"],{...te,side:h.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-4,polygonOffsetUnits:-4}));ge.material.uniforms.uShK={value:t.shadowK??1},ge.frustumCulled=!1,ge.renderOrder=1,ge.name="shadows",H.add(ge)}await v.yield();for(const e of[-1,...Y]){const i=e>=0,o=d.filter(ce=>(ce.b.extra?ce.b.grp:-1)===e);if(!o.length)continue;const u=je(!1),b=[],T=[],F=[],V=[];for(const ce of o){const ge=ce.b;b.push(ge.x,ge.y,ge.z,ge.heading),T.push(ge.type,ge.phase,ge.period,ge.scale),F.push(...ge.c),V.push(ce.off,ce.per,ce.size,ce.seed)}be(u,"iA",b,4),be(u,"iB",T,4),be(u,"iC",F,4),be(u,"iD",V,4),u.instanceCount=o.length;const he=new h.Mesh(u,ee(l0,Je,["uTime","uTau","uRate","uRose","uViolet",...J],te));he.frustumCulled=!1,he.renderOrder=3,H.add(he),i&&(he.material.uniforms.uTime=_.uDance,(X[e]=X[e]||[]).push(he))}if(L.length){const e=We(A0(),L),i=new h.Mesh(e,ee(y0,C0,["uTime","uTau","uPx",...J],{side:h.DoubleSide}));i.frustumCulled=!1,H.add(i)}if(Me.length){const e=je(!0);be(e,"iR",Me,4),e.instanceCount=Me.length/4;const i=new h.Mesh(e,ee(d0,m0,["uTau","uSunCol","uSky"],{...te,side:h.DoubleSide}));i.frustumCulled=!1,i.renderOrder=2,H.add(i)}const z=c.fork("steam");if(t.steam!==!1){const e=je(!1),i=[],o=[],u=G.steam*(k==="wind"?.6:1),b=F=>Math.round(F*(.6+.4*q));for(let F=0;F<b(40);F++)i.push(z.range(-58,58),z.range(4.6,7),z.range(-16.5,-12),z.range(5,8)),o.push(z(),0,1.8,z.range(.5,.8)*u);for(let F=0;F<b(18);F++)i.push(z.range(-58,58),z.range(7.5,11),z.range(-22,-15),z.range(8,12)),o.push(z(),0,1.6,z.range(.4,.62)*u);for(let F=0;F<9;F++)i.push(-52+F*12.5+s.range(-3,3),s.range(5.2,7.4),s.range(-13.5,-11.5),s.range(6.5,9.5)),o.push(s(),0,1.9,s.range(.7,.95)*u);for(let F=0;F<b(26);F++){const V=z.chance(.6);i.push(z.range(-54,54),z.range(.3,.7),V?z.range(11.5,17):z.range(-1,6),V?z.range(1.6,2.8):z.range(1,1.7)),o.push(z(),z.range(.06,.12),1.4,(V?z.range(.16,.28):z.range(.1,.18))*u)}be(e,"iP",i,4),be(e,"iQ",o,4),e.instanceCount=o.length/4;const T=new h.Mesh(e,ee(p0,Je,["uTime","uRose","uViolet",...J],te));T.frustumCulled=!1,T.renderOrder=1,T.name="steam",H.add(T)}{const e=Math.round((k==="snow"?900:520)*q),i=new Float32Array(e*3),o=new Float32Array(e*4);for(let T=0;T<e;T++)i.set([z.range(-48,48),z.range(0,10),z.range(-15,15)],T*3),o.set([z(),z.range(.08,.3)*(k==="snow"?3:1),z.range(1.5,5.5),z.range(.02,.04)*(k==="snow"?1.6:1)],T*4);const u=new h.BufferGeometry;u.setAttribute("position",new h.BufferAttribute(i,3)),u.setAttribute("aD",new h.BufferAttribute(o,4));const b=new h.Points(u,ee(g0,x0,["uTime","uPx","uSunCol"],{transparent:!0,depthWrite:!1,blending:h.AdditiveBlending}));b.frustumCulled=!1,b.renderOrder=4,H.add(b)}await v.yield();const se=(e,i,o)=>new h.Vector3(e,i,o),Pe=y[Math.min(8,ne-1)],ze={flyThrough:[se(-75,2,w),se(-40,2,w),se(0,2,w),se(40,2,w),se(90,O.y,fe(w,O.z,.45)),se(O.x,O.y,O.z)],closestPass:se(Pe.x,2,w),lookAt:se(Pe.x+2,1.6,2.5),nearestPair:se(Pe.x,oe.barY(Pe.x,Pe.z),Pe.z),leapPair:se(y[1].x,oe.barY(y[1].x,y[1].z),y[1].z),portalSeat:{position:O.clone(),facing:se(-1,0,0)},leaveStart:se(52,0,w),leaversLeft:se(52,0,w-7.5),leaversRight:se(52,0,w+7.5),sunDir:_.uSunDir.value.clone(),barEnds:[se(-44,.3,0),se(44,.3,0)],bankTop:se(0,3.1,-9.5),waterY:0},Ge=44,u0=4.5,v0=se(Pe.x+2,1.5,3);let Ve=0;const e0=new h.Vector2,h0=e=>{Ve=De(e,0,1)};let t0=!1;return{object:H,radius:Ge,height:u0,center:v0,anchors:ze,shared:_,ground:!0,groundY:0,counts:{dancers:N,leavers:xe.length,lipTussocks:oe.lip.made,lipNotMade:oe.lip.notMade},birds:{dancers:g,flock:Ce},setProgress:h0,setDance(e){t0=!0,_.uDance.value=e},setShown(e,i){for(const o of le)o.visible=!!e;X.forEach((o,u)=>{if(o)for(const b of o)b.visible=Array.isArray(i)?!!i[u]:!!i})},setLight({sunDir:e,sunColor:i,sky:o,ground:u}={}){e&&_.uSunDir.value.set(e.x??e[0],e.y??e[1],e.z??e[2]).normalize(),i&&(_.uSunCol.value.copy(i),_.uRimCol.value.copy(i)),o&&_.uSky.value.copy(o),u&&_.uGround.value.copy(u)},update(e,i,o){_.uTime.value=i,t0||(_.uDance.value=i);const u=Ve*R-1;_.uRate.value=t.rate??(Ve>0&&Ve<1?1:0),_.uTau.value=u,o&&o.isPerspectiveCamera&&(v.renderer.getDrawingBufferSize(e0),_.uPx.value=2*Math.tan(o.fov*Math.PI/360)/Math.max(e0.y,1))},dispose(){Fe.dispose(),Q.dispose(),ve.dispose(),ie?.dispose()}}}export{Qe as LIGHT_GLSL,W0 as buildHero,T0 as makeBreath,N0 as makeCranes,B0 as makePuffs};
