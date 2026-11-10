import*as t from"three";import{clamp as Dt,lerp as bt,smoothstep as J}from"../kit/core.js";const Ft=["#F4EBD6","#D9B36A","#3B2A1E","#D8381E","#1F8A6B","#E8B93A","#8FC4F0"],T=-6,$=75.5,Q=5.8,W=120,tt=764,dt=4.3,rt=3.5,lt=210,At=.094,Bt=14,mt=3,pt=310,ht=634,Gt=7,wt=46,kt=3.4,jt={dye:[266,358],gallery:[456,568],deckY:25.5,bay:631},et=Math.PI*2,H=e=>8*Math.sin(et*e/210)*J(150,220,e)*(1-J(500,620,e));function gt(e){let a=12+5.6*J(72,144,e);a+=1.6*Math.sin(et*(e-160)/230)*J(170,240,e)*(1-J(600,680,e));const n=(e-pt)/wt,v=(e-ht)/30;return a-=kt*Math.exp(-n*n)+1*Math.exp(-v*v),bt(a,18,J(650,704,e))}const St=e=>lt-(lt-$)*(e/At),Vt=`
const float DK_Z0 = ${T.toFixed(1)}, DK_R0 = ${$.toFixed(1)}, DK_SP = ${Q.toFixed(1)};
float snakeX(float s){ return 8.*sin(6.2831853*s/210.)*smoothstep(150.,220.,s)*(1.-smoothstep(500.,620.,s)); }
float eyeY(float s){
  float y = 12. + 5.6*smoothstep(72.,144.,s);
  y += 1.6*sin(6.2831853*(s-160.)/230.)*smoothstep(170.,240.,s)*(1.-smoothstep(600.,680.,s));
  float a = (s-${pt.toFixed(1)})/${wt.toFixed(1)}, b = (s-${ht.toFixed(1)})/30.;
  y -= ${kt.toFixed(1)}*exp(-a*a) + 1.0*exp(-b*b);
  return mix(y, 18., smoothstep(650.,704.,s));
}
vec3 bodyAt(float s){ return vec3(snakeX(s), eyeY(s) - ${dt.toFixed(1)}, DK_Z0 - s); }
`,st=`
uniform float uEye, uFront, uTime;
${Vt}
float dkHash(float k){ return fract(sin(k*12.9898 + 4.137)*43758.5453); }
// wave time of a rest station: 0 before the front arrives, ~1 when the disc has stood (half a second)
float dkWave(float r){ return max(0., (r - uFront)/${Bt.toFixed(1)}); }
float dkLift(float t){ return (1. - exp(-4.2*t)*cos(5.6*t))*smoothstep(0., .35, t); }
// c centre, R right, U up, N the face normal looking back at the eye; inf = (lift, moving, scale, waveTime)
void discState(float k, out vec3 c, out vec3 R, out vec3 U, out vec3 N, out vec4 inf){
  float rnd = dkHash(k);
  float r = DK_R0 + DK_SP*k;
  float st = max(r, uEye + ${rt.toFixed(1)} + DK_SP*k);
  float t = dkWave(r);
  float e = dkLift(t);
  float mv = smoothstep(0., 22., st - r);
  vec3 fly = bodyAt(st);
  vec3 tg = normalize(bodyAt(st + 1.5) - bodyAt(st - 1.5));
  vec3 side = normalize(cross(tg, vec3(0., 1., 0.)));
  float far = smoothstep(0., 22., k);
  float amp = mix(.25, 1.2, far);
  float ph = uTime*(.85 + .35*mv) - k*.55 + rnd*1.3;
  fly += side*sin(ph)*amp + vec3(0., 1., 0.)*sin(ph*1.31 + 1.7)*amp*.55;
  // aloft but not yet hauling: the body hovers above the curve, higher the further behind the wave front
  float hov = (1. - mv)*smoothstep(10., 170., r - uFront);
  fly.y += hov*(${Gt.toFixed(1)} + 4.*(1. - smoothstep(20., 70., uEye)) + 1.1*sin(uTime*.7 - r*.021)); fly.x += hov*1.6*sin(uTime*.43 - r*.013);
  vec3 rest = vec3(snakeX(r), 3.45, DK_Z0 - r);
  c = mix(rest, fly, e);
  vec3 N0 = -tg, U0 = cross(N0, side);
  float pitch = mix(1.22, .15 + .05*sin(ph*1.7 + rnd*6.), min(e, 1.2));
  float roll = sin(ph + 1.2)*(.07 + .09*far)*clamp(e, 0., 1.);
  N = N0*cos(pitch) + U0*sin(pitch);
  vec3 U1 = U0*cos(pitch) - N0*sin(pitch);
  R = side*cos(roll) + U1*sin(roll);
  U = U1*cos(roll) - side*sin(roll);
  inf = vec4(e, mv, 1. - smoothstep(757., 764., st), t);
}
`,ct=`
uniform vec3 uSunDir, uSun, uSky, uRoof, uGable, uAmb, uFloor, uCam;
uniform float uGain;
vec3 dkDiffuse(vec3 n){
  float s = clamp(dot(n, uSunDir)*.62 + .38, 0., 1.); s *= s;
  float l = clamp(-n.x*sign(uSunDir.x)*.5 + .5, 0., 1.);
  float g = clamp(-n.z*.6 + .4, 0., 1.);
  return uSun*s + uSky*l*l + uRoof*clamp(n.y*.5 + .5, 0., 1.) + uGable*g*g*.6 + uFloor*clamp(-n.y*.5 + .5, 0., 1.) + uAmb;
}
// soft bars of roof-light: one band of paper per 16 m bay (0 under a truss .. 1 under the middle of a band)
float dkBars(float z){ float c = .5 + .5*cos(6.2831853*(z - 10.)/16.); return c*c*(3. - 2.*c); }
float dkSpec(vec3 n, vec3 v, float p){
  vec3 h = uSunDir + v; h = h/max(length(h), 1e-4);
  return pow(max(dot(n, h), 0.), p);
}
float dkH21(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x*p.y); }
// ZONES. uGalK > 0: the lantern gallery exists (flame light under the drying deck, daylight shut out).
// uBay = (x0, x1 across the sunward roof slope, z centre, half length) of the open roof bay; uBayCol its light.
uniform vec4 uBay; uniform vec3 uBayCol; uniform float uGalK;
float dkGal(vec3 p){
  float s = -6. - p.z;
  return smoothstep(450., 462., s)*(1. - smoothstep(560., 574., s))*(1. - smoothstep(25.1, 25.9, p.y))*step(1e-3, uGalK);
}
// how much of the shaft of sky light from the open bay reaches p (traced back along the light to the roof slope)
float dkBay(vec3 p){
  float sg = uSunDir.x < 0. ? -1. : 1.;
  float t = (46. - p.y - p.x*sg*.9375)/max(uSunDir.y + abs(uSunDir.x)*.9375, .05);
  vec3 h = p + uSunDir*max(t, 0.);
  float hx = h.x*sg;
  return smoothstep(uBay.x - 1., uBay.x + 1., hx)*(1. - smoothstep(uBay.y - 1., uBay.y + 1., hx))*(1. - smoothstep(uBay.w - 2., uBay.w + 1.5, abs(h.z - uBay.z)));
}
float dkVn(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
  return mix(mix(dkH21(i), dkH21(i + vec2(1., 0.)), f.x), mix(dkH21(i + vec2(0., 1.)), dkH21(i + vec2(1., 1.)), f.x), f.y);
}
`;function zt(){const e={pos:[],nor:[],uv:[],ap:[],idx:[],n:0};return e.v=(a,n,v,C,S,y,d,g,F,R,f,x)=>(e.pos.push(a,n,v),e.nor.push(C,S,y),e.uv.push(d,g),e.ap.push(F,R,f,x),e.n++),e.tri=(a,n,v)=>{e.idx.push(a,n,v)},e.quad=(a,n,v,C)=>{e.idx.push(a,n,v,a,v,C)},e.build=a=>{const n=a?new t.InstancedBufferGeometry:new t.BufferGeometry;return n.setAttribute("position",new t.Float32BufferAttribute(e.pos,3)),n.setAttribute("normal",new t.Float32BufferAttribute(e.nor,3)),n.setAttribute("uv",new t.Float32BufferAttribute(e.uv,2)),n.setAttribute("aP",new t.Float32BufferAttribute(e.ap,4)),n.setIndex(e.n>65535?new t.Uint32BufferAttribute(e.idx,1):new t.Uint16BufferAttribute(e.idx,1)),n},e}const I=new t.Vector3,ot=new t.Vector3,q=new t.Vector3,yt=new t.Vector3;function ut(e,a,n,v,C,S,y){const d=a.length,g=[];let F=0;for(let f=0;f<d;f++){const x=a[f],A=a[S?(f+d-1)%d:Math.max(0,f-1)],P=a[S?(f+1)%d:Math.min(d-1,f+1)];yt.subVectors(P,A).normalize(),I.crossVectors(C,yt).normalize(),ot.crossVectors(yt,I).normalize(),f>0&&(F+=x.distanceTo(a[f-1]));const V=y?y(f):[1,0,0,0],m=n[f],b=[];for(let U=0;U<=v;U++){const B=U/v*et,L=Math.cos(B),l=Math.sin(B),r=I.x*L+ot.x*l,s=I.y*L+ot.y*l,z=I.z*L+ot.z*l;b.push(e.v(x.x+r*m,x.y+s*m,x.z+z*m,r,s,z,U/v,F,V[0],V[1],V[2],V[3]))}g.push(b)}const R=S?d:d-1;for(let f=0;f<R;f++){const x=g[f],A=g[(f+1)%d];for(let P=0;P<v;P++)e.quad(x[P],x[P+1],A[P+1],A[P])}return F}function at(e,a,n,v,C,S,y,d){const g=[],F=[];I.set(.31,.77,.55).cross(n).normalize(),ot.crossVectors(n,I).normalize();const R=I.clone(),f=ot.clone();for(let x=0;x<S;x++){const A=x/S*et;g.push(new t.Vector3().copy(a).addScaledVector(R,Math.cos(A)*v).addScaledVector(f,Math.sin(A)*v)),F.push(C)}ut(e,g,F,y,n,!0,()=>[d,0,0,0])}function _t(e){const a=zt(),n=e?64:24,v=2.47,C=e?[.14,.28,.42,.56,.7,.82,.92,1]:[.36,.7,1],S=a.v(0,0,0,0,0,1,0,0,0,0,0,0),y=[];for(const l of C){const r=[];for(let s=0;s<n;s++){const z=s/n*et,E=Math.cos(z)*l,G=Math.sin(z)*l;r.push(a.v(E*v,G*v,0,0,0,1,E*v/2.5,G*v/2.5,0,l,0,0))}y.push(r)}for(let l=0;l<n;l++)a.tri(S,y[0][l],y[0][(l+1)%n]);for(let l=0;l+1<y.length;l++)for(let r=0;r<n;r++){const s=(r+1)%n;a.quad(y[l][r],y[l+1][r],y[l+1][s],y[l][s])}const d=new t.Vector3(0,0,1),g=new t.Vector3(1,0,0),F=new t.Vector3(0,1,0),R=[],f=[];for(let l=0;l<n;l++){const r=l/n*et;R.push(new t.Vector3(Math.cos(r)*2.5,Math.sin(r)*2.5,0)),f.push(.078)}ut(a,R,f,e?8:4,d,!0,()=>[1,0,0,.3]);const x=[],A=[],P=e?18:8,V=(l,r)=>{const s=l/5;return r.set(l,.85+.22*s*s,.11+.3*s*s)};for(let l=0;l<=P;l++){const r=-5+10*l/P;x.push(V(r,new t.Vector3)),A.push(bt(.088,.044,Math.abs(r)/5))}ut(a,x,A,e?8:5,F,!1,()=>[1,0,0,.7]);const m=e?12:5,b=e?5:3,U=Math.sqrt(2.5*2.5-.85*.85);for(const l of[-1,1]){const r=V(l*U,new t.Vector3);r.z*=.5,at(a,r,g,.15,.04,m,b,2),e&&at(a,r,new t.Vector3(.75,.66*l,0).normalize(),.16,.035,m,b,2),e&&at(a,r,new t.Vector3(.75,-.66*l,0).normalize(),.16,.035,m,b,2);const s=V(l*4.9,new t.Vector3);at(a,s,g,.085,.04,m,b,2),e&&at(a,V(l*4.7,new t.Vector3),g,.09,.03,m,b,2)}for(const l of e?[90,210,330,262,270,278]:[]){const r=l*Math.PI/180;at(a,new t.Vector3(Math.cos(r)*2.5,Math.sin(r)*2.5,0),new t.Vector3(-Math.sin(r),Math.cos(r),0),.115,.04,m,b,2)}const B=e?14:8,L=[[.02,-.05,2.5,.12],[.3,.14,2.1,.95],[-.24,.1,1.85,-.85]];for(const l of[-1,1]){const r=V(l*4.92,new t.Vector3);L.forEach((p,_)=>{const D=I.set(Math.sin(p[0])*l,Math.cos(p[0]),p[1]).normalize().clone(),N=new t.Vector3(D.y,-D.x,0).normalize().multiplyScalar(Math.cos(p[3])).addScaledVector(d,Math.sin(p[3])),h=new t.Vector3().crossVectors(N,D).normalize();let k=null;for(let j=0;j<=B;j++){const K=j/B,X=K*K*.28*p[2];q.copy(r).addScaledVector(D,p[2]*K),q.x+=l*X,q.z+=X*.4;const O=a.v(q.x-N.x*.19,q.y-N.y*.19,q.z-N.z*.19,h.x,h.y,h.z,-1,K,3,K,l,(_+1)/3),Y=a.v(q.x+N.x*.19,q.y+N.y*.19,q.z+N.z*.19,h.x,h.y,h.z,1,K,3,K,l,(_+1)/3);k&&a.quad(k[0],k[1],Y,O),k=[O,Y]}});const s=[],z=[],E=e?5:2,G=[.06,.15,.19,.2,.2,.19];for(let p=0;p<=E;p++){const _=p/E;s.push(new t.Vector3(r.x+l*.06,r.y-.08-_*1.05,r.z+.02)),z.push(e?G[p]:[.06,.17,.2][p])}ut(a,s,z,e?10:5,g,!1,p=>[4,p/E,l,0])}return a}function Ct(e){const a=zt(),n=(y,d,g,F,R,f,x,A,P)=>{const V=new t.Vector3(y,d,g),m=new t.Vector3(F,R,f),b=V.distanceTo(m),U=new t.Vector3().subVectors(m,V).normalize(),B=new t.Vector3().crossVectors(P,U).normalize(),L=new t.Vector3().crossVectors(U,B).normalize(),l=e(),r=e()*7,s=(p,_,D)=>new t.Vector3().copy(p?m:V).addScaledVector(U,p?.06:-.06).addScaledVector(B,_*x*.5).addScaledVector(L,D*A*.5),z=(p,_,D,N,h,k)=>{const j=a.v(p.x,p.y,p.z,h.x,h.y,h.z,0,r,5,l,0,0),K=a.v(_.x,_.y,_.z,h.x,h.y,h.z,1,r,5,l,0,0),X=a.v(D.x,D.y,D.z,h.x,h.y,h.z,1,r+k,5,l,0,0),O=a.v(N.x,N.y,N.z,h.x,h.y,h.z,0,r+k,5,l,0,0);a.quad(j,K,X,O)},E=B.clone().negate(),G=L.clone().negate();z(s(0,1,-1),s(0,1,1),s(1,1,1),s(1,1,-1),B,b),z(s(0,-1,1),s(0,-1,-1),s(1,-1,-1),s(1,-1,1),E,b),z(s(0,1,1),s(0,-1,1),s(1,-1,1),s(1,1,1),L,b),z(s(0,-1,-1),s(0,1,-1),s(1,1,-1),s(1,-1,-1),G,b),z(s(1,1,-1),s(1,1,1),s(1,-1,1),s(1,-1,-1),U,.3)},v=new t.Vector3(1,0,0),C=new t.Vector3(0,1,0),S=new t.Vector3(0,0,1);for(const y of[-1,1]){const d=y*1.55;n(d*1.1,0,-2.45,d,4.12,-1.8,.24,.3,v),n(d*1.1,0,2.6,d,2.62,2.05,.24,.3,v),n(d,2.28,2.55,d,4.02,-2.2,.2,.26,v),n(d,1.75,-2.14,d,1.2,2.33,.16,.2,v)}return n(-2,3.72,-1.86,2,3.72,-1.86,.22,.3,S),n(-1.9,2.2,2.14,1.9,2.2,2.14,.2,.26,S),n(-1.85,.95,-2.28,1.85,.95,-2.28,.18,.24,S),n(-1.5,1.05,-2.2,1.5,3.5,-1.95,.14,.18,S),a}const Rt=`
#include <common>
#include <fog_pars_vertex>
attribute float aK;
attribute vec4 aP;
${st}
varying vec2 vUv; varying vec4 vP; varying vec3 vN; varying vec3 vPos; varying vec4 vS;
void main(){
  vec3 c, R, U, N; vec4 inf;
  discState(aK, c, R, U, N, inf);
  float lift = clamp(inf.x, 0., 1.), mv = inf.y, rnd = dkHash(aK);
  vec3 p = position, n = normal;
  float part = aP.x;
  if (part < .5) {
    // the silk bellies back toward the eye in flight and sags a little on the trestle
    float rr = dot(p.xy, p.xy)/6.25;
    float b = mix(-.1, .4 + .09*sin(uTime*2.3 + aK*1.7) + .14*mv, lift);
    b += .035*sin(uTime*8.5 + p.x*2.6 + p.y*1.9 + aK)*(.3 + mv)*lift;
    p.z += b*(1. - rr);
    n = normalize(vec3(2.*b*p.x/6.25, 2.*b*p.y/6.25, 1.));
  }
  vec3 wl = c + (R*p.x + U*p.y + N*p.z)*inf.z;
  vec3 nl = normalize(R*n.x + U*n.y + N*n.z);
  if (part > 2.5) {
    // plumes and tufts: droop at rest, spring as the disc stands, stream and tremble in the haul
    float t = aP.y, t2 = t*t, ph = rnd*40. + aP.w*9. + aP.z*2.;
    float sprung = sin(inf.w*8.)*exp(-inf.w*1.6)*step(0.001, inf.w);
    if (part < 3.5) {
      wl += vec3(0., -1., 0.)*t2*1.1*(1. - lift)*inf.z;
      wl += N*(t2*(.22 + .95*mv) + t*sprung*.9)*inf.z - U*t2*.3*mv*inf.z;
      wl += R*sin(uTime*11.5 + ph + t*4.)*t2*(.05 + .11*mv) + N*sin(uTime*15.3 + ph*1.7 + t*5.)*t2*.09*mv;
    } else {
      wl += vec3(0., -1., 0.)*t*.5*(1. - lift)*inf.z;
      wl += N*(t2*(.12 + 1.1*mv) + t*sprung*.4)*inf.z + U*t2*.35*mv*inf.z;
      wl += R*sin(uTime*9. + ph + t*3.)*t*(.04 + .07*mv);
    }
  }
  vUv = uv; vP = aP; vN = nl; vPos = wl; vS = vec4(inf.x, mv, aK, rnd);
  vec4 mvPosition = modelViewMatrix*vec4(wl, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
  #ifdef USE_FOG
    vFogDepth *= 1. - .42*lift*(1. - mv);      // the standing wave reads through the dust of the finishing floor
  #endif
}`,Nt=`
#include <common>
#include <fog_pars_fragment>
${ct}
uniform vec3 uGround, uScallop, uGilt, uKey, uCream, uBamboo, uCord, uPlumeA, uPlumeB, uTuft, uFlame;
uniform float uLantern, uMotif, uTime, uTrans, uBars, uEye;
varying vec2 vUv; varying vec4 vP; varying vec3 vN; varying vec3 vPos; varying vec4 vS;

// what gilt, lacquer and wet paint see of the room
vec3 dkEnv(vec3 r){
  float s = max(dot(r, uSunDir), 0.);
  float g = max(-r.z, 0.), l = max(-r.x, 0.);
  return uSun*s*s*s*1.6 + uRoof*max(r.y, 0.) + uGable*g*g + uSky*l*l + uAmb;
}
// the painted disc: returns albedo, a = how much of it is gilt
vec4 dkPaint(vec2 p, float k, float rnd, float fw){
  float g = k/119.;
  float r = length(p);
  float th = atan(p.y, p.x + step(r, 1e-5)*1e-4);
  float aR = fw*1.5;
  // overlapping scales, upper rows over lower ones
  float S = mix(3.3, 4.3, rnd);
  vec2 q = p*S + vec2(rnd*3., .15);
  float jt = floor(q.y/.36) + 1., d = 1., found = 0., cdy = 0.;
  vec2 cid = vec2(0.);
  for (int i = 0; i < 3; i++) {
    float j = jt - float(i), off = .5*mod(j, 2.);
    float cx = floor(q.x - off + .5) + off;
    vec2 dv = q - vec2(cx, j*.36);
    float dd = length(dv)*2.;
    if (found < .5 && dd < 1.) { d = dd; found = 1.; cid = vec2(cx, j); cdy = dv.y; }
  }
  float aF = fw*S*1.7, aS = min(aF, .11), aB = min(aF, .3);
  float fine = 1. - smoothstep(.12, .5, aF);          // keylines and gilt edges, while they are wider than a pixel
  float h1 = dkH21(cid*1.37 + rnd*17.), h2 = dkH21(cid*2.11 + 9.1 + rnd*5.);
  float bandGilt = step(h1, smoothstep(.1, 1., g)*.85);
  float grScal = step(h2, (1. - g)*.36);
  vec3 gcol = mix(uGround, uScallop*.9, grScal)*mix(.7, 1.06, smoothstep(.2, .72, d));
  vec3 bandC = mix(uScallop, uGilt, bandGilt);
  vec3 alb = gcol;
  float gilt = 0.;
  float spine = (1. - smoothstep(.055, .055 + aS*.5, length(vec2(q.x - cid.x, (cdy + .27)*.7))))*fine;   // a gilt drop on each scale
  alb = mix(alb, uGilt, spine*.8); gilt = spine*.8;
  alb = mix(alb, uKey, smoothstep(.7 - aS, .7, d)*fine);
  float bnd = smoothstep(.735 - aB, .735, d);
  alb = mix(alb, mix(mix(bandC, uGilt, .25)*.86, bandC, fine), bnd); gilt = mix(gilt, mix(.25, bandGilt, fine), bnd);
  float gl = smoothstep(.87 - aS, .87, d)*fine;
  alb = mix(alb, uGilt, gl); gilt = max(gilt, gl);
  float ky = smoothstep(.94 - aS, .94, d)*fine;
  alb = mix(alb, uKey, ky); gilt *= 1. - ky;
  // far away the scales melt into their average instead of shimmering
  float lod = smoothstep(.6, 1.8, aF);
  vec3 gAvg = mix(uGround, uScallop*.9, (1. - g)*.36)*.9;
  vec3 avg = gAvg*.6 + mix(uScallop, uGilt, smoothstep(.1, 1., g)*.85)*.22 + uGilt*.1 + uKey*.08;
  alb = mix(alb, avg, lod); gilt = mix(gilt, .1 + .2*g, lod);
  // centre roundel: spiral pearl, ringed sun or eight-petal flower
  float m0 = smoothstep(-.15, .15, sin(th*3. + r*40. + rnd*6.));
  vec3 rc0 = mix(uScallop, uGilt, m0);
  float m1 = step(.5, fract(r*13.5))*(.6 + .4*step(0., cos(th*12.)));
  vec3 rc1 = mix(uGround, uCream, m1);
  float pet = smoothstep(.0, aR + .004, .25*(.5 + .5*abs(cos(th*4.))) - r);
  vec3 rc2 = mix(uScallop*.8, mix(uCream, uGround, smoothstep(.02, .16, r)*.75), pet);
  float w1 = 1. - min(abs(uMotif - 1.), 1.), w2 = step(1.5, uMotif);
  vec3 rc = mix(mix(rc0, rc1, w1), rc2, w2);
  float rg = mix(mix(m0, 0., w1), 0., w2);
  float pearl = 1. - smoothstep(.055, .055 + aR, r);
  rc = mix(rc, uGround, pearl*(1. - w2)); rg *= 1. - pearl;
  float inR = 1. - smoothstep(.275 - aR, .275, r);
  alb = mix(alb, rc, inR); gilt = mix(gilt, rg, inR);
  float ring = smoothstep(.265 - aR, .265, r)*(1. - smoothstep(.315, .315 + aR, r));
  alb = mix(alb, uGilt, ring); gilt = max(gilt, ring);
  float kl = (1. - smoothstep(.005, .005 + aR, abs(r - .262))) + (1. - smoothstep(.005, .005 + aR, abs(r - .32))) + (1. - smoothstep(.004, .004 + aR, abs(r - .07)))*(1. - w2);
  // gilt rim with pearls
  float rim = smoothstep(.85 - aR, .85, r);
  float an = th/6.2831853*36.;
  vec2 pc = vec2((fract(an) - .5)*(6.2831853*.915/36.), r - .915);
  float pd = length(pc)/.034;
  float prl = 1. - smoothstep(.7, .7 + aR*30., pd);
  float prk = (1. - smoothstep(1., 1. + aR*30., pd))*(1. - prl);
  vec3 rimc = mix(uGilt, mix(uGround, uScallop, step(.5, fract(floor(an)*.5 + .25))), prl);
  rimc = mix(rimc, uKey, prk);
  alb = mix(alb, rimc, rim); gilt = mix(gilt, 1. - prl - prk, rim);
  kl += (1. - smoothstep(.006, .006 + aR, abs(r - .852))) + (1. - smoothstep(.005, .005 + aR, abs(r - .975)));
  kl = clamp(kl, 0., 1.)*(1. - smoothstep(.02, .06, fw));
  alb = mix(alb, uKey, kl); gilt *= 1. - kl;
  return vec4(alb, clamp(gilt, 0., 1.));
}

void main(){
  vec3 V = uCam - vPos; float dist = length(V); V /= max(dist, 1e-4);
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
  if (!gl_FrontFacing) N = -N;
  float fwx = fwidth(vUv.x);
  float fw = max(fwx + fwidth(vUv.y), 1e-5);
  float part = vP.x, k = vS.z, rnd = vS.w, lift = clamp(vS.x, 0., 1.);
  float ndv = abs(dot(N, V));
  float gal = dkGal(vPos), bay = dkBay(vPos);
  vec3 col;
  if (part < .5) {
    vec2 p = vUv; float r = length(p);
    vec4 pt = dkPaint(p, k, rnd, fw);
    vec3 alb = pt.rgb; float gilt = pt.a;
    // print mottle, brush drag and the weave of the silk
    alb *= .88 + .22*dkVn(p*vec2(9., 31.) + rnd*50.);
    float wv = sin(p.x*560.)*sin(p.y*560.);
    alb *= 1. + .09*wv*(1. - smoothstep(.1, .5, fw*560.));
    // bamboo ribs and the spar seen as shadows inside the lit disc
    float sw = max(fw*1.5, .006);
    float ribs = (1. - smoothstep(.011, .011 + sw, abs(p.x))) + (1. - smoothstep(.011, .011 + sw, abs(p.y + .12)));
    ribs += 1. - smoothstep(.03, .03 + sw*1.5, abs(p.y - .34 - .022*p.x*p.x));
    ribs = clamp(ribs, 0., 1.);
    // crinkled leaf normal for the gilt
    vec2 gn = vec2(dkVn(p*64. + 3.) - .5, dkVn(p*64. + 17.) - .5)*(1. - smoothstep(.01, .05, fw));
    vec3 Ng = normalize(N + vec3(gn.x, gn.y, 0.)*1.3);
    float bar = dkBars(vPos.z);
    vec3 front = alb*(dkDiffuse(N) + uRoof*(bar - .5)*.5);
    vec3 back = dkDiffuse(-N) + uRoof*(bar - .45)*uBars;
    vec3 tcol = (alb*alb*1.5 + alb*.3)*mix(1., .5, gilt);
    col = front*.38 + tcol*back*uTrans*(1. - .72*ribs);
    vec3 leaf = uGilt*(dkEnv(reflect(-V, Ng))*1.25 + uSun*dkSpec(Ng, V, 30.)*2.2);
    col += leaf*gilt*(.5 + .5*lift);
    col += uSun*.05*pow(max(1. - ndv, 0.), 3.);
    // under the drying deck the daylight is shut out; in the open bay the shaft of sky light goes through the silk
    col *= mix(1., .26, gal*(1. - .6*uLantern));
    float wrapB = clamp(dot(N, uSunDir)*.5 + .5, 0., 1.);
    col += uBayCol*bay*(alb*wrapB*.7 + tcol*(1. - .72*ribs)*(1.25 - wrapB) + leaf*gilt*.35);
    // lantern festival, and the lantern gallery on any day: a flame inside every disc
    float fl = .86 + .14*sin(uTime*7. + k*2.3)*sin(uTime*11.3 + k);
    vec2 lp = p - vec2(0., -.08);
    float lanE = max(uLantern, gal*uGalK);
    col += lanE*fl*lift*(tcol*uFlame*1.5*exp(-r*r*2.4) + uFlame*2.6*exp(-dot(lp, lp)*60.)*(1. - .6*ribs));
    col *= mix(.62, 1., lift)*(1. + .7*lift*(1. - vS.y));      // a small sun switching on as it stands
    // from the finishing floor the far chain already aloft glows through its silk, so the wave is read at once
    col += tcol*(uSun + uRoof)*lift*smoothstep(50., 120., dist)*(1. - smoothstep(30., 75., uEye))*(1. - .6*ribs)*.8;
  } else if (part < 1.5) {
    float al = vUv.y;
    float node = abs(fract(al/.62 + vP.w*3.) - .5)*.62;
    float nd = 1. - smoothstep(.012, .012 + max(fw, .02), node);
    vec3 a = uBamboo*(.78 + .3*dkVn(vec2(vUv.x*5., al*.8)))*(.9 + .2*dkVn(vec2(vUv.x*37., al*2.3)));
    a = mix(a, a*vec3(.72, .95, .5), .4*dkVn(vec2(al*.35, 3. + k)));
    a = mix(a, uKey*1.6 + a*.25, nd*.75);
    col = a*dkDiffuse(N) + uSun*dkSpec(N, V, 38.)*.45 + uBamboo*(uSun + uRoof)*.3*pow(max(1. - ndv, 0.), 3.);
  } else if (part < 2.5) {
    vec3 a = uCord*(.72 + .38*sin(vUv.y*95. + vUv.x*6.2831853));
    col = a*dkDiffuse(N) + uCord*uSun*.2*pow(max(1. - ndv, 0.), 2.);
  } else if (part < 3.5) {
    float x = vUv.x, t = vUv.y, ax = abs(x);
    float w = smoothstep(0., .1, t)*(1. - t*t*t*t*t)*.92 + .06;
    w *= .9 + .1*step(.3, fract(t*21. + vP.w*7.));
    if (ax > w + fwx) discard;
    float bars = smoothstep(.3, .62, fract(t*12. - ax*.9 + vP.w*.37));
    vec3 a = mix(uPlumeA, uPlumeB, bars);
    a *= .82 + .26*sin(ax*38. + t*90.)*(1. - smoothstep(.1, .5, fw*38.));
    a = mix(a, uCream*.85, (1. - smoothstep(.05, .13, ax))*.75);
    a = mix(a, uTuft, (1. - smoothstep(.0, .14, t))*.8);
    col = a*(dkDiffuse(N)*.5 + dkDiffuse(-N)*.6) + uSun*.06*pow(max(1. - ndv, 0.), 2.);
  } else {
    float t = vUv.y;
    float st = dkVn(vec2(vUv.x*46., t*2.5 + rnd*9.));
    if (t > .7 && st > (1. - t)*3.4) discard;
    vec3 a = uTuft*(.55 + .6*st);
    a = mix(a, uGilt, (1. - smoothstep(.0, .1, t))*.9);
    col = a*(dkDiffuse(N)*.6 + dkDiffuse(-N)*.6);
  }
  // bamboo, cord, plumes and tufts: lantern-lit under the deck, flaring in the shaft of the open bay
  if (part > .5) col = col*mix(1., .3, gal) + col*uFlame*1.9*gal*uGalK + col*uBayCol*bay*1.6;
  gl_FragColor = vec4(col*uGain, 1.);
  #include <fog_fragment>
}`,Ut=`
#include <common>
#include <fog_pars_vertex>
attribute vec4 aL;            // disc k, fraction to disc k+1, which line (0 top, 1, 2), ribbon side
${st}
uniform vec3 uCam; uniform float uTwang;
varying float vW; varying float vF; varying vec3 vPos;
vec3 dkAttach(float k, float li, out vec2 st){
  vec3 c, R, U, N; vec4 inf; discState(k, c, R, U, N, inf);
  float a = 1.5707963 + li*2.0943951;
  st = vec2(clamp(inf.x, 0., 1.), inf.z);
  return c + (R*cos(a) + U*sin(a))*2.5*inf.z;
}
void main(){
  vec2 s0, s1;
  vec3 A = dkAttach(aL.x, aL.z, s0), B = dkAttach(aL.x + 1., aL.z, s1);
  float f = aL.y, bow = 4.*f*(1. - f);
  vec3 p = mix(A, B, f);
  p.y -= mix(mix(.3, .9, step(.5, aL.z)), .1, min(s0.x, s1.x))*bow;
  p += vec3(sin(uTime*47. + aL.x*1.3 + aL.z*2.), cos(uTime*53. + aL.x), 0.)*bow*(.015 + .2*uTwang);
  vec3 dir = B - A; dir /= max(length(dir), 1e-4);
  vec3 toCam = uCam - p; float dist = length(toCam);
  vec3 side = cross(dir, toCam); side /= max(length(side), 1e-4);
  float w = max(.03, dist*.0015);
  p += side*aL.w*w*min(s0.y, s1.y);
  vW = clamp(.03/w, 0., 1.); vF = f; vPos = p;
  vec4 mvPosition = modelViewMatrix*vec4(p, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Mt=`
#include <common>
#include <fog_pars_fragment>
${ct}
uniform vec3 uCream, uFlame;
varying float vW; varying float vF; varying vec3 vPos;
void main(){
  vec3 a = uCream*vec3(.5, .44, .32)*(1. + .25*sin(vF*260.));
  vec3 col = a*(uSun*.4 + uRoof*.7 + uSky*.35 + uAmb)*mix(.6, 1., vW);
  float gal = dkGal(vPos), bay = dkBay(vPos);
  col = col*mix(1., .3, gal) + col*uFlame*1.6*gal*uGalK + a*uBayCol*bay;
  gl_FragColor = vec4(col*uGain, 1.);
  #include <fog_fragment>
}`,Tt=`
#include <common>
#include <fog_pars_vertex>
attribute float aK;
attribute vec4 aP;
${st}
varying vec2 vUv; varying vec4 vP; varying vec3 vN; varying vec3 vPos; varying float vLift;
void main(){
  float r = DK_R0 + DK_SP*aK, t = dkWave(r);
  vec3 tg = bodyAt(r + 1.5) - bodyAt(r - 1.5); tg.y = 0.; tg = normalize(tg);
  float yaw = (dkHash(aK + 50.) - .5)*.1;
  vec3 back = -tg*cos(yaw) + cross(tg, vec3(0., 1., 0.))*sin(yaw);
  vec3 side = cross(vec3(0., 1., 0.), back);
  // the empty trestle rocks after its disc leaves
  float rock = .05*sin(t*9.)*exp(-t*1.1)*step(.001, t);
  float cr = cos(rock), sr = sin(rock);
  vec3 p = position, n = normal;
  p.yz = vec2(p.y*cr - p.z*sr, p.z*cr + p.y*sr);
  n.yz = vec2(n.y*cr - n.z*sr, n.z*cr + n.y*sr);
  vec3 wl = vec3(snakeX(r), 0., DK_Z0 - r) + side*p.x + vec3(0., p.y, 0.) + back*p.z;
  vN = side*n.x + vec3(0., n.y, 0.) + back*n.z;
  vUv = uv; vP = aP; vPos = wl; vLift = clamp(dkLift(t), 0., 1.);
  vec4 mvPosition = modelViewMatrix*vec4(wl, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Lt=`
#include <common>
#include <fog_pars_fragment>
${ct}
uniform vec3 uTimber, uBamboo, uFlame;
varying vec2 vUv; varying vec4 vP; varying vec3 vN; varying vec3 vPos; varying float vLift;
void main(){
  vec3 V = uCam - vPos; V /= max(length(V), 1e-4);
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
  float tint = vP.y;
  vec3 a = uTimber*(1.25 + 1.1*tint);
  a *= .62 + .7*dkVn(vec2(vUv.x*13. + tint*30., vUv.y*1.5));
  a *= .9 + .2*dkVn(vec2(vUv.x*55. + tint*9., vUv.y*5.));
  float e = 1. - smoothstep(0., .13, min(vUv.x, 1. - vUv.x));
  a = mix(a, uBamboo*.75, e*.5);                      // worn gold arrises
  float ndv = max(dot(N, V), 0.);
  vec3 col = a*dkDiffuse(N) + uBamboo*(uSun + uRoof)*.1*pow(max(1. - ndv, 0.), 3.);
  col *= .5 + .5*smoothstep(0., 1.8, vPos.y);         // falls into shadow toward the floor
  col *= mix(.62, 1., max(vLift, 1. - smoothstep(1.8, 3.2, vPos.y)));   // shade under the lying disc
  float gal = dkGal(vPos), bay = dkBay(vPos);
  col = col*mix(1., .28, gal) + a*uFlame*.5*gal*uGalK*(.5 + .5*N.y) + a*uBayCol*bay*clamp(dot(N, uSunDir)*.6 + .4, 0., 1.);
  gl_FragColor = vec4(col*uGain, 1.);
  #include <fog_fragment>
}`,Et=`
#include <common>
#include <fog_pars_vertex>
attribute vec4 aD;
${st}
uniform vec3 uCam; uniform float uPx;
varying float vA;
void main(){
  float r = position.x, ts = max(0., (r - uFront)/28.);
  vec3 base = vec3(snakeX(r) + (position.y - .5)*5.4, 3. + position.z*1.4, DK_Z0 - r + (aD.x - .5)*5.8);
  vec3 dir = vec3(position.y - .5, .5 + aD.y, aD.x - .5)*1.6;
  vec3 p = base + dir*(1. - exp(-ts*2.4))*2.4;
  p += vec3(sin(uTime*.7 + aD.x*30.)*.3, ts*.3, ts*1.4)*smoothstep(0., .5, ts);
  vA = smoothstep(0., .06, ts)*exp(-ts*.8)*step(.001, ts);
  vec4 mvPosition = modelViewMatrix*vec4(p, 1.);
  gl_Position = projectionMatrix*mvPosition;
  gl_PointSize = vA < .01 ? 0. : clamp(aD.z*uPx/max(-mvPosition.z, .5), 0., 64.);
  #include <fog_vertex>
}`,Kt=`
#include <common>
#include <fog_pars_fragment>
${ct}
uniform vec3 uCream;
varying float vA;
void main(){
  vec2 q = gl_PointCoord*2. - 1.;
  float d = dot(q, q);
  if (d > 1.) discard;
  float a = (1. - d)*(1. - d)*vA*.34;
  gl_FragColor = vec4(uCream*(uSun*.55 + uRoof*.5 + uAmb)*uGain, a);
  #include <fog_fragment>
}`,ft={afternoon:{sunDir:[.78,.58,-.22],sun:["#ffe4b4",1.55],sky:["#a9c2e6",.36],roof:["#f6dfae",.58],gable:[null,.78],ambient:["#5a4230",.3],floor:["#d9b36a",.16],lantern:0},lantern:{sunDir:[.6,.7,-.38],sun:["#5f86d8",.5],sky:["#4a6fc8",.36],roof:["#5078d0",.42],gable:["#3f6fe0",.95],ambient:["#1c2a55",.45],floor:["#c8783a",.12],lantern:1},rain:{sunDir:[.5,.82,-.28],sun:["#d9dde0",.7],sky:["#c4ccd4",.5],roof:["#d5d9dc",.62],gable:["#c9d2da",.7],ambient:["#4a4744",.36],floor:["#9a968c",.12],lantern:0},gold:{sunDir:[-.86,.3,-.22],sun:["#ffb45a",1.5],sky:["#c9b7a8",.3],roof:["#f0c890",.36],gable:[null,.6],ambient:["#5a3a22",.3],floor:["#e09848",.2],lantern:0},snow:{sunDir:[.7,.66,-.26],sun:["#eef2f8",1.02],sky:["#cfdcf0",.5],roof:["#e8eef6",.6],gable:["#dfe8f4",.8],ambient:["#4c5058",.38],floor:["#c8d0dc",.2],lantern:0}},Z=(e,a=1)=>{const n=new t.Color;return e&&e.isColor?n.copy(e):Array.isArray(e)?n.setRGB(e[0],e[1],e[2]):n.set(e),n.multiplyScalar(a)};async function Ht(e,a={}){const n=e.rng.fork?e.rng.fork("hundred-segment-dragon"):e.rng,v=e.quality?.detail??1,C=(a.palette&&a.palette.length>=7?a.palette:Ft).map(o=>new t.Color(o)),[S,y,d,g,F,R,f]=C,x=a.pathLength??tt,A=a.livery??n.pick(["vermilion","vermilion","azure","black"]),P=a.motif??n.int(0,2),V=ft[a.mood]?a.mood:"afternoon",m=(o,i,c=0,u=0)=>new t.Color().copy(o).offsetHSL(i,c,u),b=n.range(-.012,.012),B={vermilion:{ground:m(g,b),scallop:m(F,b*2),tuft:m(g,.01,0,-.03),cord:m(g,0,-.1,-.2)},azure:{ground:m(f,.02+b,.1,-.33),scallop:m(S,0,0,.02),tuft:m(f,.02,.1,-.25),cord:m(f,.03,0,-.45)},black:{ground:new t.Color("#2b1b15"),scallop:m(R,b,0,-.04),tuft:m(g,b),cord:new t.Color("#1a100c")}}[A]||null||{ground:g,scallop:F,tuft:g,cord:m(g,0,-.1,-.2)},L=m(y,n.range(-.025,.015),.08,n.range(-.1,-.02)),l=m(d,0,0,-.05),r={uEye:{value:0},uFront:{value:lt},uTime:{value:0},uTwang:{value:0},uPx:{value:400},uCam:{value:new t.Vector3(0,12,0)},uSunDir:{value:new t.Vector3(.78,.58,-.22).normalize()},uSun:{value:new t.Color},uSky:{value:new t.Color},uRoof:{value:new t.Color},uGable:{value:new t.Color},uAmb:{value:new t.Color},uFloor:{value:new t.Color},uGain:{value:1},uLantern:{value:0},uTrans:{value:1.05},uBars:{value:.9},uMotif:{value:P},uFlame:{value:new t.Color(1,.5,.16)},uBay:{value:new t.Vector4(0,0,0,-9)},uBayCol:{value:new t.Color(0,0,0)},uGalK:{value:0},uGround:{value:B.ground},uScallop:{value:B.scallop},uGilt:{value:R.clone()},uKey:{value:new t.Color("#150d09")},uCream:{value:S.clone()},uBamboo:{value:y.clone()},uCord:{value:B.cord},uPlumeA:{value:L},uPlumeB:{value:l},uTuft:{value:B.tuft},uTimber:{value:d.clone()}};let s=V;function z(o={}){if(o.sunDir){const i=o.sunDir;r.uSunDir.value.set(i.x??i[0],i.y??i[1],i.z??i[2]).normalize()}o.sun&&r.uSun.value.copy(Z(o.sun)),o.sky&&r.uSky.value.copy(Z(o.sky)),o.roof&&r.uRoof.value.copy(Z(o.roof)),o.gable&&r.uGable.value.copy(Z(o.gable)),o.ambient&&r.uAmb.value.copy(Z(o.ambient)),o.floor&&r.uFloor.value.copy(Z(o.floor)),o.lantern!==void 0&&(r.uLantern.value=o.lantern),o.gain!==void 0&&(r.uGain.value=o.gain)}function E(o){const i=ft[o]||ft.afternoon;s=ft[o]?o:"afternoon";const c=u=>Z(u[0]||f,u[1]);z({sunDir:i.sunDir,sun:c(i.sun),sky:c(i.sky),roof:c(i.roof),gable:c(i.gable),ambient:c(i.ambient),floor:c(i.floor),lantern:i.lantern})}E(V),a.lantern!==void 0&&(r.uLantern.value=a.lantern);const G=new t.Group;G.name="hundred-segment-dragon";const p=(o,i,c={})=>new t.ShaderMaterial({uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...r},vertexShader:o,fragmentShader:i,fog:!0,...c}),_=(o,i,c=0)=>{const u=new t.Mesh(o,i);return u.frustumCulled=!1,u.renderOrder=c,G.add(u),u};let D=0;const N=p(Rt,Nt,{side:t.DoubleSide}),h={};for(const o of[!0,!1]){const i=_t(o),c=i.build(!0),u=o?mt:W-mt,M=new Float32Array(u);for(let w=0;w<u;w++)M[w]=o?w:w+mt;c.setAttribute("aK",new t.InstancedBufferAttribute(M,1)),c.instanceCount=u,D+=i.idx.length/3*u,h[o?"near":"body"]=_(c,N),await e.yield?.()}{const i=[],c=[];let u=0;for(let w=0;w<3;w++)for(let it=0;it<W-1;it++)for(let nt=0;nt<=5;nt++)i.push(it,nt/5,w,-1,it,nt/5,w,1),nt<5&&c.push(u,u+1,u+3,u,u+3,u+2),u+=2;const M=new t.BufferGeometry;M.setAttribute("position",new t.Float32BufferAttribute(new Float32Array(u*3),3)),M.setAttribute("aL",new t.Float32BufferAttribute(i,4)),M.setIndex(c),D+=c.length/3,h.lines=_(M,p(Ut,Mt,{side:t.DoubleSide}))}if(await e.yield?.(),a.trestles!==!1){const o=Ct(n.fork?n.fork("trestle"):n),i=o.build(!0),c=new Float32Array(W);for(let u=0;u<W;u++)c[u]=u;i.setAttribute("aK",new t.InstancedBufferAttribute(c,1)),i.instanceCount=W,D+=o.idx.length/3*W,h.trestles=_(i,p(Tt,Lt))}if(await e.yield?.(),a.dust!==!1){const o=Math.round(1500*v),i=new Float32Array(o*3),c=new Float32Array(o*4);for(let w=0;w<o;w++)i[w*3]=n.range($-4,lt+10),i[w*3+1]=n(),i[w*3+2]=n(),c[w*4]=n(),c[w*4+1]=n(),c[w*4+2]=n.range(.25,.8),c[w*4+3]=n();const u=new t.BufferGeometry;u.setAttribute("position",new t.Float32BufferAttribute(i,3)),u.setAttribute("aD",new t.Float32BufferAttribute(c,4));const M=new t.Points(u,p(Et,Kt,{transparent:!0,depthWrite:!1}));M.frustumCulled=!1,M.renderOrder=3,G.add(M),h.dust=M,D+=o}const k={Z0:T,R0:$,SPACING:Q,COUNT:W,LENGTH:tt,DROP:dt,LEAD:rt,x:H,eyeY:gt,eye:(o,i=new t.Vector3)=>i.set(H(o),gt(o),T-o),body:(o,i=new t.Vector3)=>i.set(H(o),gt(o)-dt,T-o),restStation:o=>$+Q*o,discStation:(o,i)=>Math.max($+Q*o,i+rt+Q*o),tailStation:o=>Math.max($,o+rt),front:St},j=[];for(let o=0;o<tt;o+=8)j.push(k.eye(o));j.push(k.eye(tt));const K=o=>new t.Vector3(H(o)+Math.sign(H(o))*8,0,T-o),X={entry:k.eye(0),flyThrough:j,portalSeat:{position:new t.Vector3(0,18,T-tt),normal:new t.Vector3(0,0,1),radius:7},tailRest:new t.Vector3(H($),3.45,T-$),waveStart:k.body(lt),rackDips:[k.eye(pt).add(new t.Vector3(0,3.5,0)),k.eye(ht).add(new t.Vector3(0,3.5,0))],headRack:new t.Vector3(H(424)+8,0,-430),bendPosts:[262.5,367.5,472.5,577.5].map(K),viewpoints:{ride:{position:k.eye(382),target:k.body(382+rt+Q*4).add(new t.Vector3(0,3,0))},wave:{position:new t.Vector3(-14,11,T-60),target:k.body(150)},flank:{position:new t.Vector3(H(300)+26,15,T-285),target:k.body(310)}},sunDir:r.uSunDir.value};let O=!1;function Y(o,i){r.uEye.value=i??o*x,r.uFront.value=St(o);const c=(o-.01)/.004;r.uTwang.value=o<.01?Math.exp(-c*c):Math.exp(-(o-.01)*70)}Y(0);const xt=new t.Vector3,Pt=new t.Vector2,vt={radius:15,height:16,center:new t.Vector3(H(300),13,T-300)};return{object:G,radius:vt.radius,height:vt.height,center:vt.center,anchors:X,ground:!1,groundY:0,bounds:new t.Box3(new t.Vector3(-14,0,T-tt),new t.Vector3(14,26,T-$+5)),triangles:Math.round(D),drawCalls:G.children.length,snake:k,glsl:{curve:Vt},uniforms:r,parts:h,livery:A,motif:P,get mood(){return s},setProgress(o,i){O=!0,Y(Dt(o,0,1),i)},setLight:z,setMood:E,update(o,i,c){if(r.uTime.value=i,O||Y(i/36%1),c){G.updateWorldMatrix(!0,!1),xt.setFromMatrixPosition(c.matrixWorld),r.uCam.value.copy(G.worldToLocal(xt));const u=e.renderer?e.renderer.getDrawingBufferSize(Pt).y:900;r.uPx.value=.5*u*c.projectionMatrix.elements[5]}},dispose(){}}}export{Vt as GLSL_CURVE,ct as GLSL_LIGHT,ft as MOODS,jt as ZONES,Ht as buildHero};
