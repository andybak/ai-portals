import*as a from"three";const Pt=["#2F8062","#0B2E2A","#D8C56A","#EDF1E4","#0A1013","#B9D2C8","#2E8FD8"],Fe=28,it=n=>{const p=Math.min(1,Math.max(0,(n-.2)/.1));return 1-p*p*(3-2*p)};function lt(n){if(n<.21)return .93+.02*(1-n/.21*(n/.21));const p=(n-.21)/.79;return .93-.42*p-.55*Math.pow(p,2.2)-.36*Math.pow(p,6)}const Rt=n=>-1.1+.2*n+.42*n*n+.08*Math.pow(n,6),Tt=n=>.21*Math.exp(-(n/.2)*(n/.2))+.085*Math.exp(-(n/.5)*(n/.5))+.035*(1-n)+.004,_t=n=>2.75*Math.sqrt(n)*Math.pow(1-n,1.2),ct=.115,ut=.105;function ht(n){const p=n?[0,.07,.14,.21,.255,.3,.36,.42,.49,.56,.63,.7,.77,.83,.89,.94,.975,1]:[0,.21,.3,.45,.62,.8,.93,1],s=[];for(let d=p.length-1;d>0;d--)s.push(-p[d]);for(let d=0;d<p.length;d++)s.push(p[d]);const k=n?12:5,g=[],C=[],y=[],B=[],z=(d,h,f,r,x,i)=>(g.push(d,h,f),C.push(r,x),y.push(i),g.length/3-1),T=(d,h,f)=>{let r=0;for(let i=0;i<d.length;i+=3){const u=d[i]*3,A=d[i+1]*3,M=d[i+2]*3,D=g[A]-g[u],H=g[A+1]-g[u+1],q=g[A+2]-g[u+2],P=g[M]-g[u],E=g[M+1]-g[u+1],j=g[M+2]-g[u+2],se=H*j-q*E,ee=q*P-D*j,te=D*E-H*P;r+=se*((g[u]+g[A]+g[M])/3-h[0])+ee*((g[u+1]+g[A+1]+g[M+1])/3-h[1])+te*((g[u+2]+g[A+2]+g[M+2])/3-h[2])}const x=r*f<0;for(let i=0;i<d.length;i+=3)B.push(d[i],x?d[i+2]:d[i+1],x?d[i+1]:d[i+2])},G=(d,h,f)=>{const r=g.length/3,x=[];for(let i=0;i<d;i++)for(let u=0;u<h;u++)f(i,u);for(let i=0;i<d-1;i++)for(let u=0;u<h-1;u++){const A=r+i*h+u,M=A+1,D=A+h,H=D+1;x.push(A,D,M,M,D,H)}return{first:r,tris:x}},L=2*k+1,Q=[],U=G(s.length,L,(d,h)=>{const f=s[d],r=Math.abs(f),x=h<=k,i=Math.pow((x?h:2*k-h)/k,1.5),u=lt(r),A=Rt(r),M=it(r),D=Math.pow(1-i,4),H=Tt(r)*_t(i)*(r>.999?0:1);let q=x?H*1.1+ct*M*D:-H*.8-ut*M*D;x&&(q+=.012*Math.exp(-(r/.05)*(r/.05))*Math.sin(Math.PI*i)),q-=.05*r*r;const P=h===k?.5:h===0?.5+.5*M:h===2*k?.5-.5*M:x?1:0;z(2*f,q,u+(A-u)*i,P,i,0),h===2*k&&M<.001&&Q.push(g.length/3-1-2*k,g.length/3-1)});T(U.tris,[0,0,-.1],1);const J=s.filter(d=>Math.abs(d)<=.3001),W=n?3:2,I=.55,K=2*W+2,_=G(J.length,K,(d,h)=>{const f=J[d],r=Math.abs(f),x=it(r),i=h<=W,u=(i?h:2*W+1-h)/W,A=1-.45*u,M=(i?ct:-ut)*x*A-.05*r*r;z(2*f*(1-.12*u),M,lt(r)-I*u,i?1:0,u,2)});return T(_.tris,[0,0,.72],-1),{P:g,UV:C,PART:y,IDX:B,vert:z,section:T,grid:G,seam:Q,hero:n}}function ft(n){const{P:p,UV:s,PART:k,IDX:g,vert:C,section:y,grid:B,seam:z,hero:T}=n;if(T)for(const f of[-1,1]){const u=B(9,15,(A,M)=>{const D=A/8,H=M%14,q=H<7,P=q?H/6:1-(H-7)/6,E=Math.pow(Math.sin(Math.PI*(.22+.78*D)),.7)*(D>.999?.03:1),j=q?0:.02*Math.min(1,E*1.5),se=.17*E-j,ee=(.085-.03*D)*Math.min(1,E*1.3)-j,te=(P-.5)*4.1,re=Math.sin(te),ie=Math.cos(te),le=Math.max(-re,0),Y=Math.abs(2*P-1),ge=f*(.5+.05*D*D),V=-.015-.07*D,Me=.84+.56*D;C(ge+f*(ee*ie-.075*le*le*(.35+.65*D)*(1-.6*Y*Y*Y)),V+se*re,Me-.05*Math.abs(re),q?.46*Y*Y*Y:.54+.46*(1-Y*Y),D,3.2)});y(u.tris,[f*.52,-.08,1.14],1)}const G=3,L=4;if(!T)for(const f of[-1,1]){const r=B(G,L+1,(x,i)=>{const u=x/(G-1),A=i/L*Math.PI*2,M=.17*Math.pow(Math.sin(Math.PI*(.22+.78*u)),.7)*(u>.999?.02:1),D=f*(.475+.05*u*u),H=-.015-.07*u,q=.84+.56*u,P=Math.sin(A),E=Math.cos(A),j=f*E*.036*(1-.5*u)-f*(P<0?.15:.04)*P*P*(.35+.65*u);C(D+j,H+P*M,q-.05*Math.abs(P),E<0?1:0,u,3)});y(r.tris,[f*.52,-.08,1.14],1)}if(T)for(const f of[-1,1]){const r=B(5,7,(x,i)=>{const u=x/4*Math.PI,A=i/6*Math.PI*2,M=.05;C(f*.535+M*Math.sin(u)*Math.cos(A),0+M*Math.cos(u),.775+M*Math.sin(u)*Math.sin(A),.5,0,4)});y(r.tris,[f*.535,0,.775],1)}const Q=T?9:4,U=T?5:3,J=B(Q,U+1,(f,r)=>{const x=f/(Q-1),i=r/U*Math.PI*2,u=(.03*(1-x)+.006)*(1+1.1*Math.exp(-x*12));C(Math.cos(i)*u,.02+Math.sin(i)*u*.8-.05*x,-1.02-1.3*x,.5,x,5)});y(J.tris,[0,0,30],1);const W=C(0,.035,-.8,1,0,5),I=C(0,.03,-1.07,1,0,5),K=C(0,.21,-1.05,1,0,5),_=C(0,.15,-.93,1,0,5);g.push(W,I,_,_,I,K,W,_,I,_,K,I);const d=new a.BufferGeometry;d.setAttribute("position",new a.Float32BufferAttribute(p,3)),d.setAttribute("aUV",new a.Float32BufferAttribute(s,2)),d.setAttribute("aPart",new a.Float32BufferAttribute(k,1)),d.setIndex(g),d.computeVertexNormals();const h=d.attributes.normal.array;for(let f=0;f<z.length;f+=2){const r=z[f]*3,x=z[f+1]*3;let i=h[r]+h[x],u=h[r+1]+h[x+1],A=h[r+2]+h[x+2];const M=Math.hypot(i,u,A)||1;i/=M,u/=M,A/=M,h[r]=h[x]=i,h[r+1]=h[x+1]=u,h[r+2]=h[x+2]=A}for(const f of[W,I,K,_])h[f*3]=0,h[f*3+1]=.6,h[f*3+2]=-.2;return d}const Se=`
uniform float uTime;
uniform vec3 uCam;
uniform float uPushR;
uniform vec4 uClear;
uniform vec4 uCapA;      // the whale shark's keep-out capsule: nose end (xyz) and radius (0.01 = off)
uniform vec3 uCapB;      // tail end
uniform vec4 uThru;      // entry point (xyz) and 1 while the world is seen through the previous portal
uniform float uBank;
struct Frame { vec3 p; vec3 f; vec3 u; vec3 r; };
vec3 pushFrom(vec3 p, vec3 c, float R) {
  vec3 d = p - c; float l = length(d); float k = max(R - l, 0.0);
  return p + (d / max(l, 1e-3)) * (0.8 * k * k / max(R, 1e-3));
}
// the capsule: animals slide round the nearest point of the shark's body axis, most of them over or under it
vec3 pushCapsule(vec3 p) {
  vec3 ab = uCapB - uCapA.xyz;
  vec3 c = uCapA.xyz + ab * clamp(dot(p - uCapA.xyz, ab) / max(dot(ab, ab), 1e-4), 0.0, 1.0);
  // (by a margin: an animal's centre is never nearer the axis than 0.72 of the radius; it is moved out along a line
  // tipped toward the vertical, by just as far as brings it there, and not at all at the capsule's own skin)
  vec3 e = p - c; float l = length(e), R = uCapA.w;
  if (l >= R) return p;
  vec3 d = e; d.y *= 1.8; d = d / max(length(d), 1e-3) + vec3(0.0, 1e-4, 0.0);
  float want = R * (0.72 + 0.28 * l / max(R, 1e-3)), b = dot(e, d) / dot(d, d);
  return p + d * (-b + sqrt(max(b * b + (want * want - l * l) / dot(d, d), 0.0)));
}
// seen through the previous portal the lens stands behind the entry, outside the wall: whatever swims between it and
// the entry plane is sent under the sand, so the opening shows the floor of the eye
vec3 thruHide(vec3 p) { p.y -= 400.0 * uThru.w * step(p.z - uThru.z, -1.5); return p; }
Frame orbitFrame(vec4 slot, vec4 rnd, vec2 att) {
  Frame F; float sd = rnd.x; vec3 Y = vec3(0.0, 1.0, 0.0);
  if (rnd.w < 0.5) {
    float ang = slot.z + slot.w * uTime;
    float bobT = uTime * 0.43 + sd * 61.0;
    float r = slot.x + 0.45 * sin(uTime * 0.21 + sd * 40.0);
    vec3 o = vec3(cos(ang), 0.0, -sin(ang));
    F.p = o * r + Y * (slot.y + 0.4 * sin(bobT));
    F.f = normalize(vec3(-sin(ang), 0.09 * cos(bobT), -cos(ang)));
    float b = uBank * (0.75 + 0.5 * fract(sd * 17.3)) + 0.06 * sin(uTime * 0.31 + sd * 23.0);
    vec3 up = Y * cos(b) - o * sin(b);
    F.r = normalize(cross(up, F.f)); F.u = cross(F.f, F.r);
  } else if (rnd.w < 1.5) {
    vec3 o = vec3(cos(slot.z), 0.0, -sin(slot.z));
    // (the loop stands in the upright plane through the funnel's axis and its own centre: it climbs on the wall's side
    // and comes down on the eye's; it runs on the world clock from the animal's own seeded phase, one loop in 11.4 s)
    vec3 T = o;
    float th = uTime * 0.55 + sd * 6.283;
    float cs = cos(th), sn = sin(th);
    F.p = o * slot.x + Y * slot.y + 2.5 * (T * sn - Y * cs);
    F.f = T * cs + Y * sn;
    F.u = Y * cs - T * sn;
    F.r = cross(F.u, F.f);
  } else {
    float cy = cos(slot.w), sy = sin(slot.w), cp = cos(att.x), sp = sin(att.x);
    F.p = slot.xyz;
    F.f = vec3(sy * cp, sp, cy * cp);
    vec3 r0 = vec3(cy, 0.0, -sy);
    vec3 u0 = cross(F.f, r0);
    float cr = cos(att.y), sr = sin(att.y);
    F.r = r0 * cr + u0 * sr; F.u = cross(F.f, F.r);
  }
  F.p = pushFrom(F.p, uClear.xyz, uClear.w);
  F.p = pushCapsule(F.p);
  if (rnd.w < 1.5) F.p = pushFrom(F.p, uCam, uPushR);
  F.p = thruHide(F.p);
  return F;
}
`,Oe=`
float h21(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vn(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y);
}
float spots(vec2 p, float sd) {
  vec2 ip = floor(p), fp = fract(p); float m = 0.0;
  float nb = vn(p * 2.9 + sd * 3.0 + 5.0) - 0.5, nc = vn(p * 7.3 - sd * 2.0) - 0.5;      // breaks the edge of every blotch
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j));
    vec2 id = ip + g + sd;
    vec2 c = g + vec2(h21(id), h21(id + 17.3)) * 0.8 + 0.1 - fp;
    float rad = 0.17 + 0.27 * h21(id + 5.7);
    float on = step(0.42, h21(id + 31.1));
    m = max(m, on * (1.0 - smoothstep(rad * 0.55, rad * 1.05, length(c * vec2(1.0, 1.3)) + (nb * 0.5 + nc * 0.3) * rad)));
  }
  return m;
}
float caustic(vec2 p, float t) {
  p *= 0.55;
  float a = sin(p.x * 1.7 + sin(p.y * 1.3 + t * 0.9) * 1.4 + t * 0.6);
  float b = sin(p.y * 2.1 + sin(p.x * 1.1 - t * 0.7) * 1.6 - t * 0.5);
  float c = sin((p.x + p.y) * 1.4 + sin((p.x - p.y) * 0.9 + t * 0.4) * 1.2);
  float v = 1.0 - abs(a + b + c) / 3.0;
  return v * v * v * 2.2;
}
`,mt=`
attribute vec2 aUV;
attribute float aPart;
attribute vec4 iSlot;
attribute vec4 iRnd;
attribute vec4 iBeat;
uniform float uBeatAmp;
varying vec3 vRest;
varying vec3 vN;
varying vec3 vP;
varying vec4 vInfo;
varying vec3 vMorph;
varying float vLoop;
#include <fog_pars_vertex>
${Se}
void main() {
  vec3 q = position;
  vec3 n = normal;
  vRest = position;
  float a = clamp(abs(q.x) * 0.5, 0.0, 1.0);
  float sx = q.x < 0.0 ? -1.0 : 1.0;
  float base = iBeat.x * uTime + iBeat.y;
  // travelling wave: lags from the root out and from the leading edge back, so tips curl up and over late
  float ph = base - 1.6 * a + 1.0 * q.z;
  float sn = sin(ph), cn = cos(ph);
  // span^2.2: the inner wing stays an arc and only the outer third curls (1.6 folded the wing like a tent)
  float pa = pow(max(a, 1e-4), 2.2);
  float A = 0.85 * uBeatAmp;
  // a chain animal meeting the lens (mode 2 + show) spreads its wings and lifts the tips: the wave rides on an upward bias
  // (so does the animal that loops, mode 1: nose-on or edge-on it is a shallow V with curling tips, never a flat bar)
  float up = clamp(iRnd.w - 2.0, 0.0, 1.0) + 0.55 * step(0.5, iRnd.w) * step(iRnd.w, 1.5);
  float wv = sn * (1.0 - 0.5 * up) + 0.1 + 0.75 * up, cw = cn * (1.0 - 0.5 * up);
  float lift = A * pa * wv;
  float Lx = sx * A * 0.5 * (2.2 * pow(max(a, 1e-4), 1.2) * wv - 1.6 * pa * cw);
  float Lz = A * pa * cw;
  q.y += lift - 0.05 * sin(base) * (1.0 - a);
  q.x -= sx * 0.2 * lift * lift * a;
  n = normalize(vec3(n.x - Lx * n.y, n.y, n.z - Lz * n.y) + vec3(0.0, 1e-5, 0.0));
  if (aPart > 4.5) {            // tail: a whip that hangs in its own curve (one per animal) and sways slowly, never a straight spike
    float k = max(-1.02 - position.z, 0.0), ts = iRnd.x * 43.0;
    q.x += k * k * (0.30 * sin(base * 0.5 - k * 1.3) + 0.7 * sin(uTime * 0.37 + ts) + 0.3 * sin(ts * 3.1));
    q.y += k * k * (0.12 * sin(base - k * 0.9) + 0.5 * sin(uTime * 0.29 + ts * 1.7) - 0.2);
  } else if (aPart > 2.5 && aPart < 3.5) {   // scoops flex open and shut a little
    q.x += sx * 0.05 * aUV.y * sin(uTime * 0.7 + iRnd.x * 30.0);
  }
  q *= iRnd.y;
  Frame F = orbitFrame(iSlot, iRnd, iBeat.zw);
  vec3 P = F.p + F.r * q.x + F.u * q.y + F.f * q.z;
  vec3 N = F.r * n.x + F.u * n.y + F.f * n.z;
  if (aPart > 4.5 && aUV.x < 0.75) P += N * max(length(uCam - P) * 0.0007 - 0.008, 0.0);   // keep the whip a pixel wide
  vN = N; vP = P;
  vInfo = vec4(aUV.x, aUV.y, aPart, iRnd.x);
  vMorph = vec3(iRnd.z, lift, cn * pa);
  vLoop = step(0.5, iRnd.w) * step(iRnd.w, 1.5);
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,Ke=`
#ifdef FOG_EXP2
  #define SHAFT_DENS fogDensity
#else
  #define SHAFT_DENS 0.02
#endif
// thickness of a cylinder of radius^2 R2 along the part [0, tmax] of a ray, measured ACROSS the column (the chord
// times the sine of the angle to the axis), so that looking up along the shaft does not pile it into a hard-edged slab
float shaftSlab(float A, float B, float C, float R2, float tmax) {
  float s = sqrt(max(B * B - A * (C - R2), 0.0));
  return max(min((-B + s) / A, tmax) - max((-B - s) / A, 0.0), 0.0) * sqrt(A);
}
uniform vec3 uShaftWarm;      // the gold of the core (uShaftCol is the pale skin of sunlit water round it)
uniform float uShaftT;        // seconds: the rays inside the column drift
vec3 shaftGlow(vec3 c, vec3 p, float warm) {
  vec3 d = p - c; float tmax = length(d); d /= max(tmax, 1e-4);
  vec3 ax = normalize(uShaftA - uShaftB + vec3(0.0, 1e-4, 0.0));
  vec3 oc = c - uShaftB;
  vec3 dp = d - ax * dot(d, ax), op = oc - ax * dot(oc, ax);
  float A = max(dot(dp, dp), 1e-4), B = dot(dp, op), C = dot(op, op), R2 = uShaftR * uShaftR;
  // a core of three nested radii (a shoulder, not a seam) inside a faint skin of two
  float core = shaftSlab(A, B, C, 0.16 * R2, tmax) + shaftSlab(A, B, C, 0.34 * R2, tmax) + shaftSlab(A, B, C, 0.58 * R2, tmax);
  float skin = shaftSlab(A, B, C, 0.9 * R2, tmax) + shaftSlab(A, B, C, 1.25 * R2, tmax);
  // the skin fades with the ray's nearest approach to the axis and is gone before its own rim: no silhouette, even
  // against black water at night
  skin *= 1.0 - smoothstep(0.45 * uShaftR, 1.08 * uShaftR, sqrt(max(C - B * B / A, 0.0)));
  float sO = sqrt(max(B * B - A * (C - R2), 0.0));
  float tm = 0.5 * (max((-B - sO) / A, 0.0) + min((-B + sO) / A, tmax));
  vec3 pm = c + d * tm;
  float h = clamp(pm.y / 28.0, 0.0, 1.0);
  vec3 w = pm - uShaftB; w -= ax * dot(w, ax);
  // rays: bright and dark threads that run the length of the column (w is the place ACROSS it) and drift slowly
  float rays = 0.62 + 0.38 * sin(w.x * 2.3 + 1.7 * sin(w.z * 1.1 + 2.0 + uShaftT * 0.11)) * sin(w.z * 2.1 - 1.3 * sin(w.x * 0.9) - uShaftT * 0.09);
  rays += 0.24 * sin(w.x * 6.1 - w.z * 4.3 + uShaftT * 0.23) * sin(w.z * 5.2 + w.x * 1.7 + uShaftT * 0.17);
  rays = max(rays, 0.04); rays *= rays * 0.85;
  float fd = SHAFT_DENS * tm;
  // a lens that stands inside the column sees less of it (on the final rise the ring must hang on dark water, not on a veil)
  float lens = mix(0.2, 1.0, smoothstep(0.3 * uShaftR, 1.8 * uShaftR, sqrt(max(C, 0.0))));
  // the spine: the innermost third of the column is brighter than its shoulders
  float spine = shaftSlab(A, B, C, 0.05 * R2, tmax);
  vec3 lit = uShaftCol * (1.0 - exp(-(0.03 * core + 0.014 * skin))) * (0.7 + 0.3 * rays)
           + uShaftWarm * (warm * ((1.0 - exp(-0.06 * core)) * rays + 0.55 * (1.0 - exp(-0.3 * spine)) * (0.5 + 0.5 * rays)));
  return lit * (uShaft * lens * smoothstep(0.0, 0.2, h) * (0.45 + 0.55 * h) * exp(-fd * fd));
}
`,He=`
uniform vec4 uBeam[8];
uniform vec2 uBeamLean;
float beamAt(vec3 p) {
  float s = 0.0;
  for (int i = 0; i < 8; i++) {
    vec2 d = p.xz - uBeam[i].xy - uBeamLean * p.y;
    float r = max(uBeam[i].z, 0.05);
    s += uBeam[i].w * exp(-dot(d, d) / (r * r));
  }
  return s;
}
`,Re=`
uniform vec3 uWater;
uniform vec3 uGold;
uniform vec3 uAmbUp;
uniform vec3 uAmbDown;
uniform vec3 uSunDir;
uniform vec3 uSunCol;
uniform vec3 uKeyCol;
uniform float uSun;
uniform float uShaft;
uniform float uCaustic;
uniform vec3 uShaftA;
uniform vec3 uShaftB;
uniform float uShaftR;
uniform vec3 uFogUp;
uniform vec3 uFogDn;
// the water a thing fades into is paler looking up and darker looking down (both 1,1,1 = plain scene fog)
vec3 fogTint(float h) { return mix(vec3(1.0), uFogUp, smoothstep(0.0, 0.5, h)) * mix(vec3(1.0), uFogDn, smoothstep(0.0, 0.5, -h)); }
uniform vec3 uFogFar;
uniform float uFogFarK;
// the water a thing fades into: the scene fog colour near the lens, cooler and bluer with distance (uFogFarK 0 = plain fog)
vec3 waterFog(vec3 fogCol, float h, float f) { return mix(fogCol, uFogFar, uFogFarK * smoothstep(0.3, 1.0, f)) * fogTint(h); }
float shaftAxisDist(vec3 p) {
  vec3 ab = uShaftB - uShaftA;
  float t = clamp(dot(p - uShaftA, ab) / max(dot(ab, ab), 1e-4), 0.0, 1.0);
  return length(p - (uShaftA + ab * t));
}
float inShaft(vec3 p) {
  float d = shaftAxisDist(p);
  // full inside the column; outside it the light it scatters sideways and the gold pool it throws on the sand still
  // reach the inner lane (about half strength 7 m out) and die away before the outer lanes
  float inside = 1.0 - smoothstep(uShaftR * 0.7, uShaftR * 1.05, d);
  return max(inside, 0.8 * (1.0 - smoothstep(uShaftR, uShaftR + 15.0, d))) * uShaft;
}
// 1 inside the gold core of the column, 0 at its skin
float inCore(vec3 p) { return (1.0 - smoothstep(uShaftR * 0.45, uShaftR * 1.1, shaftAxisDist(p))) * uShaft; }
uniform vec3 uShaftCol;
${Ke}
${He}
`,dt=`
uniform float uTime;
uniform vec3 uCam;
uniform vec3 uBack;
uniform vec3 uBelly;
uniform vec3 uPale;
uniform vec3 uBioCol;
uniform float uBio;
varying vec3 vRest;
varying vec3 vN;
varying vec3 vP;
varying vec4 vInfo;
varying vec3 vMorph;
varying float vLoop;
#include <fog_pars_fragment>
${Re}
${Oe}
void main() {
  if (vP.y > 28.02) discard;      // above the sea surface (the breach): the world's ceiling writes no depth
  float side = vInfo.x, aux = vInfo.y, part = vInfo.z, seed = vInfo.w;
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0));
  vec3 V = normalize(uCam - vP + vec3(0.0, 1e-5, 0.0));
  float x = vRest.x, z = vRest.z, ax = abs(x), a = clamp(ax * 0.5, 0.0, 1.0);
  float fwz = fwidth(z);
  vec2 sp = vec2(x, z) + seed * vec2(37.1, 91.7);
  float n1 = vn(sp * 2.4), n2 = vn(sp * 6.3 + 11.0), n3 = vn(sp * 17.0 + 3.0);
  float s7 = fract(seed * 7.3), s13 = fract(seed * 13.7);

  // ---- back: black with the pale Y on each shoulder and a pale smudge at the wingtip
  float curve = 0.40 - 0.26 * ax - 0.12 * ax * ax + (n1 - 0.5) * 0.12;
  // (feathered: each mark is densest along its spine and breaks into mottle toward its edge, four times as far out
  // as its core is wide; a hard-edged patch reads as cut paper)
  float bd = abs(z - curve) + (n2 - 0.5) * 0.11 + (n3 - 0.5) * 0.05;
  float band = 1.0 - smoothstep(0.0, 0.27 + 0.1 * s13, bd);
  band *= band * smoothstep(0.05, 0.3, ax) * (1.0 - smoothstep(0.5 + 0.3 * s7, 1.0 + 0.3 * s7, ax));
  float ad = abs(ax - 0.36 - (z - 0.3) * 0.55 + (n2 - 0.5) * 0.08) + (n3 - 0.5) * 0.04;
  float arm = 1.0 - smoothstep(0.0, 0.27, ad);
  arm *= arm * smoothstep(0.2, 0.4, z) * (1.0 - smoothstep(0.46, 0.7, z));
  // no two animals carry the same mark: each shoulder has its own strength, about half the shoulders have no arm (so many
  // marks are one-armed or a bare bar), the bar runs 0.5-1.3 of its length, and a quarter of the animals show only a smudge
  float sideK = fract(seed * (x < 0.0 ? 23.1 : 29.7) + 0.13), s5 = fract(seed * 5.9 + 0.31);
  band *= (0.4 + 0.6 * step(0.3, fract(sideK * 3.7))) * (1.0 - smoothstep(0.5 + 0.8 * s13, 0.75 + 0.9 * s13, ax / (0.55 + 0.3 * s7)));
  arm *= step(0.5, sideK);
  float smudge = (1.0 - smoothstep(0.05, 0.5, length(vec2(ax - 0.42 - 0.2 * s7, (z - 0.28) * 1.7)) + (n1 - 0.5) * 0.35)) * 0.55;
  float mark = clamp(max(band, arm * 0.85), 0.0, 1.0) * (0.4 + 0.6 * s13) * (0.6 + 0.6 * n2) * (0.85 + 0.3 * n3);
  mark = mix(mark, smudge * (0.5 + 0.5 * sideK), step(s5, 0.27));
  mark = max(mark, smoothstep(0.84, 1.0, a) * 0.35 * n1);
  // from 6 m out the feathered mottle is lost and a back would be a plain dark shape: with distance every animal's
  // marks are drawn as what they read as from above, a clean pale-grey flash across each shoulder (every animal has
  // both, parted by the black of the spine), the outer quarter of each wing pale and a thin pale trailing edge; the
  // all-black morph keeps a ghost of them. The back's blue sheen and its gloss fall away with them: far off it is black
  float camD = length(uCam - vP);
  // (the same holds, from 3 m, for a back looked DOWN on from 30 degrees or steeper: down the funnel every back below
  // the lens is a black diamond with its two flashes and pale tips, whatever its distance)
  float farK = max(smoothstep(5.0, 13.0, camD), smoothstep(0.42, 0.72, V.y) * smoothstep(2.5, 5.0, camD));
  // (each flash is a wedge: broadest and palest beside the spine, narrowing and fading out along the wing, its edge
  // soft; the wing's last tenth is pale and so is a hair of the trailing edge. Grey, a quarter as bright as a belly)
  float flw = mix(0.2, 0.05, smoothstep(0.25, 1.0, ax));
  float fl = (1.0 - smoothstep(flw * 0.6, flw + 0.05, abs(z - curve - 0.03) + (n2 - 0.5) * 0.04)) * smoothstep(0.2, 0.32, ax) * (1.0 - smoothstep(0.6 + 0.25 * s7, 1.05 + 0.25 * s7, ax));
  fl *= 1.0 - 0.35 * smoothstep(0.3, 0.95, ax);
  float rimP = max(0.85 * smoothstep(0.74, 0.93, a + (n1 - 0.5) * 0.05), 0.45 * smoothstep(0.92, 1.0, aux) * smoothstep(0.3, 0.6, a));
  float markFar = max(fl * (0.9 + 0.1 * sideK), rimP * (0.7 + 0.3 * n1));
  // (the animal that loops shows its back from every side in turn, tail-on and nose-on too: it carries the clean
  // flashes, pale wing ends and pale trailing edge at any distance, in the near tone)
  mark = mix(mark, max(mark * 0.6, markFar), max(farK, step(0.5, vLoop))) * (1.0 - 0.62 * vMorph.x);
  vec3 backCol = mix(uBack * (0.7 + 0.6 * n2), mix(uPale * (0.58 + 0.24 * n3), vec3(0.275, 0.285, 0.295) * (0.9 + 0.2 * n3), farK), mark);      // greyer than the bellies

  // ---- belly: white, grey wing margins, black blotches unique to the animal, five gill slits a side
  float margin = smoothstep(0.62, 1.05, a * 0.55 + aux * 0.62 + (n1 - 0.5) * 0.10);
  vec2 wp = sp + (vec2(n1, n2) - 0.5) * 0.22;
  float blot = spots(wp * 4.4, 0.0) * (1.0 - smoothstep(0.1, 0.42, z)) * smoothstep(-1.0, -0.72, z) * (1.0 - smoothstep(0.65, 1.25, ax));
  blot = max(blot, spots(wp * 2.6 + 9.0, 4.0) * smoothstep(0.5, 0.9, ax) * (1.0 - smoothstep(1.25, 1.7, ax)) * step(0.45, fract(seed * 3.1)));
  float gz = (0.52 - z - 0.25 * (ax - 0.4)) / 0.105;
  float gi = floor(gz);
  float gd = abs(fract(gz) - 0.5) * 0.105;
  float gw = 0.011 + 0.006 * sin(uTime * 1.5 + seed * 40.0);
  float slit = (1.0 - smoothstep(gw * 0.3, gw + fwz + 0.022, gd)) * step(-0.5, gi) * step(gi, 4.5)
             * (1.0 - smoothstep(0.065 - 0.012 * gi, 0.14 - 0.012 * gi, abs(ax - 0.40 + 0.022 * gi) + (n2 - 0.5) * 0.03));
  vec3 bellyCol = uBelly * (1.0 - 0.7 * margin) * (0.9 + 0.1 * n3) * (1.0 - 0.16 * smoothstep(0.45, 0.8, n1 * 0.6 + n2 * 0.5));
  float whiteHeart = 1.0 - smoothstep(0.2, 0.5, length(vec2(x * 0.8, z + 0.3)) + (n1 - 0.5) * 0.3);
  float mel = vMorph.x * (1.0 - 0.8 * whiteHeart);
  bellyCol = mix(bellyCol, uBack * 1.3, clamp(max(blot, mel), 0.0, 1.0));
  bellyCol = mix(bellyCol, bellyCol * 0.35 + uBack * 0.5, slit * 0.8);       // soft grey creases, not black dashes

  float back = smoothstep(0.42, 0.58, side);
  vec3 albedo = mix(bellyCol, backCol, back);
  float gloss = 0.12 + 0.1 * back;
  float occl = 1.0;
  // painted eye for the far animals (the hero animals carry a modelled one)
  albedo = mix(albedo, uBack * 0.5, (1.0 - smoothstep(0.035, 0.06, length(vec2(ax - 0.535, z - 0.775)))) * step(part, 0.5));
  if (part > 1.5 && part < 2.5) {          // mouth lining: pale lip, rust-barred gill plates, dark throat
    float bars = smoothstep(0.2, 0.5, abs(fract(aux * 5.0 + 0.25) - 0.5) * 2.0);
    float fine = smoothstep(0.25, 0.75, 0.5 + 0.5 * sin(x * 42.0));
    // (rust plates ruled with pale lines, dark gaps between them; they keep a fifth of the light at the back of the
    // mouth, so the stripes show from any front quarter, not only down the throat)
    vec3 plate = mix(vec3(0.42, 0.12, 0.035), uPale * 1.25, fine * 0.55);
    albedo = mix(uPale * 1.0, plate, bars * smoothstep(0.05, 0.14, aux));
    albedo = mix(albedo, uBack, (1.0 - bars) * smoothstep(0.1, 0.3, aux) * 0.85);
    occl = mix(1.0, 0.2, smoothstep(0.1, 1.0, aux));
    gloss = 0.05;
  } else if (part > 2.5 && part < 3.5) {   // scoops: white inside, black outside, dark tip
    if (part > 3.1) {
      // the full model's scoop is a rolled lobe, a C in section: side runs 0 on the outer face, 0.5 on the lips,
      // 1 in the depth of the roll. Black outside, pale lips, and the hollow falls into its own shade
      albedo = mix(uBack * (0.7 + 0.6 * n2), uBelly * 0.92, smoothstep(0.28, 0.5, side));
      occl = mix(1.0, 0.2, smoothstep(0.58, 1.0, side) * (0.55 + 0.45 * aux));
    } else {
      float lowFace = 1.0 - smoothstep(-0.03, 0.05, vRest.y + 0.015 + 0.07 * aux);
      albedo = mix(uBack * (0.7 + 0.6 * n2), uBelly * 0.92, max(smoothstep(0.25, 0.6, side), lowFace));
    }
    albedo = mix(albedo, uBack, smoothstep(0.9, 1.0, aux) * 0.5);
    albedo *= mix(0.5, 1.0, smoothstep(0.0, 0.7, aux));        // it rolls out of the shadow of the head
  } else if (part > 3.5 && part < 4.5) {   // eye
    albedo = uBack * 0.35; gloss = 0.9;
  } else if (part > 4.5) {
    albedo = uBack * 0.8; gloss = 0.1;
  }

  // ---- light: gold key from above through the surface, green water from every side, deep green below
  float hemi = N.y * 0.5 + 0.5;
  float ndv = abs(dot(N, V));
  float sh = inShaft(vP);
  float cauRaw = caustic(vP.xz + vP.y * 0.3, uTime);
  float cau = mix(1.0, cauRaw, uCaustic);
  // form: surfaces that face the sand take the darker, greener light from below; the belly is brightest at its
  // centre, greys under the wing roots (soft occlusion along the body-wing junction) and toward the margins, and
  // light bounced off the rippled sand crawls across it
  float under = (1.0 - back) * step(part, 0.5);
  vec3 amb = mix(uAmbDown, uAmbUp, smoothstep(0.0, 1.0, hemi));
  float rootAO = exp(-(ax - 0.5) * (ax - 0.5) / 0.022) * (1.0 - smoothstep(0.2, 0.75, z)) * smoothstep(-1.0, -0.5, z);
  float heart = 1.0 - smoothstep(0.0, 1.15, length(vec2(ax * 0.75, z + 0.05)));
  float form = mix(0.76, 1.45, heart) * (1.0 - 0.32 * rootAO) * (0.84 + 0.16 * ndv) * (0.86 + 0.28 * mix(1.0, cauRaw, 0.4));
  amb *= mix(vec3(1.0), form * mix(vec3(0.82, 0.94, 0.9), vec3(1.0), heart), under);
  float ndl = max(dot(N, uSunDir) * 0.85 + 0.15, 0.0);
  vec3 sun = ndl * uKeyCol * uSun * cau;
  // the shaft: bellies, scoops and lips near the column flare bone-gold whichever way they face (light scattered out
  // of it and thrown back up off the sand); backs take a sixth of that and stay black. Once the sun is out every back
  // carries thin gold caustic lines instead, brightest beside the column
  float lit = mix(1.0, 0.16, back);
  float shc = inCore(vP);
  vec3 flare = mix(uSunCol * 0.55 + vec3(0.14), uShaftWarm * 2.6 + vec3(0.04), shc) * (sh * lit * (0.7 + 0.3 * min(cauRaw, 1.6)) * (0.8 + 0.2 * ndv));
  // a narrow beam crossing the animal: a gold flash, on bellies and (a fifth as strong, as a sheen) on backs
  float beam = beamAt(vP) * step(part, 3.5);
  amb = amb * (1.0 - 0.3 * sh * (1.0 - back)) + flare + uSunCol * beam * (0.55 * (1.0 - back) + 0.12);
  vec3 col = albedo * (amb + sun) * occl;
  // (a finer, faster net than the one on the sand, kept to its brightest filaments: at the sand's scale one cell
  // covers a whole back and washes it khaki)
  float net = caustic((vP.xz + vP.y * 0.3) * 4.2, uTime * 1.4);
  // (the lines lie on skin that faces the sky and are seen from above it: a back looked at from below carries none)
  float above = smoothstep(-0.05, 0.25, V.y) * smoothstep(0.0, 0.3, N.y);
  col += uSunCol * ((0.35 * uShaft + 0.65 * sh + 1.5 * beam) * back * smoothstep(1.8, 2.2, net) * 0.045 * step(part, 0.5) * (1.0 - smoothstep(12.0, 26.0, camD)) * above);
  col += uSunCol * beam * back * 0.035 * (0.4 + hemi);
  // backs stay black, but never a flat cut-out: the wet skin carries the blue of the water above it (most along the
  // leading edge and where it turns away from the lens: still darker than the water behind it), and within 15 m thin
  // lines of caustic light crawl over it in every mood
  float skin = step(part, 0.5), body = step(part, 4.5);
  float le = (1.0 - smoothstep(0.0, 0.25, aux)) * skin;
  float lobe = max(dot(N, normalize(uSunDir + vec3(0.0, 0.7, 0.0))), 0.0);
  float fr3 = pow(max(1.0 - ndv, 0.0), 2.5);
  col += uWater * (back * body * (0.012 - 0.006 * farK + (0.06 * lobe * lobe + 0.15 * fr3) * (1.0 - 0.85 * farK) + 0.09 * le * (0.4 + 0.6 * hemi) * (1.0 - 0.75 * farK)) * occl * (0.7 + 0.6 * n2));
  col += uKeyCol * (uSun * back * skin * smoothstep(1.75, 2.15, net) * 0.045 * max(N.y, 0.0) * (1.0 - smoothstep(7.0, 15.0, camD)) * above);
  col *= mix(1.0, 0.55 + 0.45 * ndv, step(2.5, part) * step(part, 3.5));     // scoops: rolled paddles, darker where they turn away
  float fr = pow(max(1.0 - ndv, 0.0), 4.0);
  // (the outer wing and its curling tip catch a pale rim where they turn edge-on: an animal seen along its own plane is a
  // thin winged line with lit tips, not a dark lump)
  col += (uAmbUp * 0.5 + uKeyCol * uSun * 0.25) * (pow(max(1.0 - ndv, 0.0), 2.5) * smoothstep(0.5, 0.95, a) * skin * occl * 0.5);
  col += uWater * fr * (0.12 + 0.26 * hemi) * occl * (1.0 - (0.45 + 0.47 * farK) * back);                       // water-coloured rim: never a flat cut-out
  vec3 H = normalize(uSunDir + V + vec3(0.0, 1e-5, 0.0));
  float spec = pow(max(dot(N, H), 0.0), 28.0) * gloss * (1.0 - 0.8 * farK * back);
  col += spec * (uKeyCol * uSun * 0.6 + uSunCol * sh * 0.45 * (1.0 - back)) + uAmbUp * gloss * 0.2 * fr;
  // night: blue-green sparks shed along the beating wing margins
  float edge = max(smoothstep(0.35, 1.0, a) * smoothstep(0.3, 1.0, aux), smoothstep(0.86, 1.0, aux) * 0.6) * step(part, 0.5);
  float spark = smoothstep(0.72, 0.9, vn(sp * 9.0 + vec2(0.0, uTime * 1.3))) * (0.3 + abs(vMorph.z) * 2.5);
  // (a spark cell never fills a block of the screen: within 7 m of the lens it fades to a fine glimmer)
  col += uBioCol * uBio * (edge * min(spark * 8.0, 2.0) * smoothstep(2.5, 7.0, camD) + edge * 0.1 + fr * 0.12);
  gl_FragColor = vec4(col, 1.0);
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      float fogF = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      float fogF = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
    // the whip tail thins away into the water toward its tip
    float tailK = step(4.5, part) * step(side, 0.75);
    fogF = max(fogF, smoothstep(0.35, 1.0, aux) * 0.6 * tailK);
    vec3 fogDir = normalize(vP - uCam + vec3(0.0, 1e-5, 0.0));
    // (the whip fades into the level-gaze water colour, darkened: seen from below it must never turn paler than the water behind it)
    vec3 fogTo = mix(waterFog(fogColor, fogDir.y, fogF), waterFog(fogColor, 0.0, fogF) * 0.45, tailK);
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogTo, fogF);
  #endif
  gl_FragColor.rgb += shaftGlow(uCam, vP, 0.0) * 0.12;      // a thin veil only: an animal behind the column stays a clean three-tone shape
}
`,Be=`
float fogFade() {
#ifdef USE_FOG
  #ifdef FOG_EXP2
    return exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  #else
    return 1.0 - smoothstep(fogNear, fogFar, vFogDepth);
  #endif
#else
  return 1.0;
#endif
}
`,he=10,Dt=`
uniform float uTime;
uniform vec3 uCam;
uniform vec4 uClear;
uniform vec4 uCapA;
uniform vec3 uCapB;
uniform vec4 uThru;
uniform vec4 uBow;        // the whale shark's snout (xyz) and its own scale (0..1): its school is as large as it is
uniform vec3 uBowF;       // its heading
uniform vec4 uSch[${he}];     // per school: metres inside the eye wall, height, phase, turn rate (radians a second)
uniform vec4 uSchB[${he}];    // rise and fall (m), its phase, length (m), spare
uniform vec2 uRibbon;     // thickness, phase of the weave
vec3 helix(float sx, vec2 off, float lead) {
  int i = int(clamp(floor(sx), 0.0, ${he-1}.0));
  vec4 A = uSch[i], B = uSchB[i];
  float t = clamp(sx - float(i), 0.0, 1.0);
  float r0 = 9.0 + 4.0 * clamp((A.y - 2.0) / 24.0, 0.0, 1.0) - 0.35 - A.x;
  float ang = A.z + A.w * uTime - t * B.z / max(r0, 2.0) + lead;
  float y = clamp(A.y + B.x * sin(ang + B.y), 2.6, 25.4);
  // (a school never swims through the ring's sphere and is not squeezed against it either: within 15 m of the ring,
  // measured level, the whole school dips under a bell that clears the sphere by 2 m and more, in its own shape,
  // and comes up again behind)
  vec2 lq = vec2(cos(ang), -sin(ang)) * r0 - uClear.xz;
  float hq = length(lq) / 15.0;
  float dip = max(y - (uClear.y - (uClear.w + 2.0) * (1.0 - hq * hq)), 0.0) * (1.0 - smoothstep(0.53, 1.0, hq));
  // (each fish's offset already holds the shape of its school, see SCHOOLS in buildHero; a school spreads into the
  // eye more than toward the wall, and the whole line weaves a little)
  float r = 9.0 + 4.0 * clamp((y - 2.0) / 24.0, 0.0, 1.0) - 0.35 - A.x + off.x * uRibbon.x * (off.x > 0.0 ? 0.55 : 1.25)
          + 0.3 * sin(t * 9.0 - uTime * 1.4 + uRibbon.y + A.z);
  y += off.y * uRibbon.x * 1.3 + 0.4 * sin(t * 6.0 + uTime * 1.1 + A.z * 3.0) + 0.2 * sin(t * 14.0 - uTime * 0.8) - dip;
  return vec3(cos(ang) * r, y, -sin(ang) * r);
}
vec3 keepOut(vec3 c) {
  vec3 d = c - uClear.xyz; float l = length(d); float k = max(uClear.w - l, 0.0);
  c += (d / max(l, 1e-3)) * (0.8 * k * k / max(uClear.w, 1e-3));
  vec3 ab = uCapB - uCapA.xyz;
  vec3 cc = uCapA.xyz + ab * clamp(dot(c - uCapA.xyz, ab) / max(dot(ab, ab), 1e-4), 0.0, 1.0);
  d = c - cc; l = length(d); k = max(uCapA.w * 0.55 - l, 0.0);      // the ribbon pours round the whale shark
  c += (d / max(l, 1e-3)) * k;
  d = c - uCam; l = length(d); k = max(2.2 - l, 0.0);               // the school opens round the lens
  c += (d / max(l, 1e-3)) * (0.8 * k * k / 2.2);
  c.y -= 400.0 * uThru.w * step(c.z - uThru.z, -1.5);
  return c;
}
`,Vt=`
attribute vec4 iFish;
varying vec3 vN;
varying vec3 vP;
varying vec4 vFish;       // body z, seed, fade, flash
#include <fog_pars_vertex>
${Dt}
void main() {
  float rider = step(50.0, iFish.x), p = rider > 0.5 ? 0.0 : iFish.x;
  vec2 off = iFish.yz + 0.25 * vec2(sin(uTime * 0.9 + iFish.w * 50.0), cos(uTime * 0.7 + iFish.w * 31.0));
  vec3 c = helix(p, off, 0.0);
  vec3 c2 = helix(p, off, 0.03);
  vec3 f = normalize(c2 - c + vec3(1e-5, 0.0, 0.0));
  c = keepOut(c);
  // the whale shark's own school (setBow: its snout, its heading, its scale) lives in the shark's frame: a dense ball
  // of fish 2 m ahead of the snout that rolls slowly, and two streams that split from the ball and run back along
  // either cheek as far as the gills; the ball opens round the lens like a school does
  vec3 bf = normalize(uBowF + vec3(0.0, 0.0, 1e-5)), br = normalize(cross(vec3(0.0, 1.0, 0.0), bf) + vec3(1e-5, 0.0, 0.0)), bu = cross(bf, br);
  float rl = fract(iFish.w * 211.0), rb = fract(iFish.w * 577.0), rc = fract(iFish.w * 331.0);
  float ra = iFish.w * 937.0 + uTime * (0.25 + 0.3 * rc) + 0.5 * sin(uTime * 0.7 + iFish.w * 300.0);
  float bt = clamp(rl / 0.62, 0.0, 1.0), cp = 2.0 * rb - 1.0, sp2 = sqrt(max(1.0 - cp * cp, 0.0)), brad = 1.75 * sqrt(bt);
  vec3 ball = bf * (2.1 + 1.25 * brad * cp + 0.25 * sin(uTime * 1.3 + iFish.w * 170.0)) + (br * cos(ra) + bu * sin(ra)) * (brad * sp2) + bu * 0.15;
  float st = clamp((rl - 0.62) / 0.38, 0.0, 1.0);
  vec3 cheek = bf * (0.7 - 3.9 * st + 0.3 * sin(uTime * 1.3 + iFish.w * 170.0)) + br * ((rb < 0.5 ? -1.0 : 1.0) * (1.25 + 0.55 * rc + 0.25 * st))
             + bu * ((fract(iFish.w * 733.0) - 0.5) * 1.5 + 0.1 + 0.15 * sin(uTime * 0.9 + iFish.w * 90.0));
  vec3 bo = mix(ball, cheek, step(0.62, rl));
  // (nothing swims through the head: behind the snout's tip the fish stand off its axis)
  float along = dot(bo, bf); vec3 bro = bo - bf * along; float brl = length(bro);
  bo += (bro / max(brl, 1e-3)) * (max(1.2 - brl, 0.0) * (1.0 - smoothstep(0.1, 0.7, along)));
  vec3 bow = uBow.xyz + bo;
  vec3 dl = bow - uCam; float ll = length(dl);
  bow += (dl / max(ll, 1e-3)) * max(2.4 - ll, 0.0);
  c = mix(c, bow, rider);
  f = normalize(mix(f, bf, rider) + vec3(1e-5, 0.0, 0.0));
  vec3 r = normalize(cross(vec3(0.0, 1.0, 0.0), f) + vec3(0.0, 0.0, 1e-5));
  vec3 u = cross(f, r);
  float fade = mix(1.0, uBow.w, rider);
  float dist = length(uCam - c);
  // none longer than 28 cm near the lens (they are only drawn larger beyond 14 m, to stay visible); a rider shrinks
  // away inside 2.6 m of the lens
  float sc = (0.8 + 0.3 * fract(iFish.w * 9.1)) * max(1.0, dist * 0.07) * fade * mix(1.0, smoothstep(1.2, 2.6, dist), rider);
  vec3 q = position;
  q.x += 0.03 * sin(uTime * 11.0 + iFish.w * 80.0 + q.z * 14.0) * (0.125 - q.z) * 4.0;   // tail beat
  q *= sc;
  vec3 P = c + r * q.x + u * q.y + f * q.z;
  vN = r * normal.x + u * normal.y + f * normal.z;
  vP = P;
  float fl = 0.5 + 0.5 * sin(uTime * 4.5 + iFish.w * 60.0 + p * 37.0);
  float flash = fl * fl; flash *= flash; flash *= flash;
  vFish = vec4(position.z, iFish.w, fade, flash);
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,Nt=`
uniform vec3 uCam;
uniform vec3 uCobalt;
uniform vec3 uSilver;
uniform vec3 uBioCol;
uniform float uBio;
varying vec3 vN;
varying vec3 vP;
varying vec4 vFish;
#include <fog_pars_fragment>
${Re}
void main() {
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0));
  float top = smoothstep(-0.15, 0.4, N.y);
  float sh = inShaft(vP);
  float beam = beamAt(vP);
  vec3 amb = mix(uAmbDown, uAmbUp, N.y * 0.5 + 0.5) + uGold * (sh * 0.3 + beam * 0.6);
  vec3 flank = uSilver * (0.4 + 1.5 * vFish.w * (1.0 + 1.5 * sh + 1.5 * beam));
  vec3 alb = mix(flank, uCobalt * 2.4, top);
  alb = mix(alb, uGold * 1.5, (1.0 - smoothstep(-0.08, -0.045, vFish.x)) * (1.0 - top * 0.4));   // yellow tail stripe
  vec3 col = alb * (amb * 1.25 + (uKeyCol * uSun + uSunCol * sh * 2.0) * max(dot(N, uSunDir), 0.0));
  // night: flanks shed blue-green light, but only at a distance: close to the lens a fish keeps its own colours
  float farK = 1.0;
  #ifdef USE_FOG
    farK = smoothstep(3.0, 11.0, vFogDepth);
  #endif
  col += uBioCol * uBio * (0.2 + 1.0 * vFish.w) * (0.12 + 0.88 * farK);
  gl_FragColor = vec4(col, 1.0);
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      float fogF = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      float fogF = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
    vec3 fogDir = normalize(vP - uCam + vec3(0.0, 1e-5, 0.0));
    gl_FragColor.rgb = mix(gl_FragColor.rgb, waterFog(fogColor, fogDir.y, fogF), fogF);
  #endif
  gl_FragColor.rgb += shaftGlow(uCam, vP, 0.0) * 0.12;      // a thin veil only: an animal behind the column stays a clean three-tone shape
}
`,It=`
attribute vec3 aMote;     // phase, angle, radial
attribute vec4 iSlot;
attribute vec4 iRnd;
attribute vec4 iBeat;
uniform float uPx;
varying float vA;
#include <fog_pars_vertex>
${Se}
void main() {
  float ph = fract(aMote.x + iRnd.x * 7.0 + uTime * 0.33);
  float s = 1.0 - ph;                                  // 1 far ahead .. 0 at the lips
  float ang = aMote.y * 6.2831853 + iRnd.x * 20.0 + s * 1.5;
  float rad = (0.05 + 0.85 * s * s) * (0.25 + 0.75 * aMote.z);
  vec3 q = vec3(cos(ang) * rad * 1.25, sin(ang) * rad * 0.6 - 0.04 * s, 0.86 + 2.7 * s) * iRnd.y;
  Frame F = orbitFrame(iSlot, iRnd, iBeat.zw);
  vec3 P = F.p + F.r * q.x + F.u * q.y + F.f * q.z;
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  float dist = max(-mvPosition.z, 0.1);
  float px = 0.05 * uPx * 0.83 / dist;
  gl_PointSize = clamp(px, 1.6, 12.0);
  vA = smoothstep(0.0, 0.1, s) * (1.0 - smoothstep(0.75, 1.0, s)) * min(px / 1.6, 1.0) * (1.0 - smoothstep(0.0, 0.8, 0.4 / dist));
  #include <fog_vertex>
}
`,qt=`
uniform vec3 uMote;
varying float vA;
#include <fog_pars_fragment>
${Be}
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float a = 1.0 - smoothstep(0.1, 0.5, length(d));
  gl_FragColor = vec4(uMote * a * vA * fogFade(), 1.0);
}
`,Gt=`
uniform vec3 uShaftA;
uniform vec3 uShaftB;
uniform float uShaftR;
varying vec3 vP;
#include <fog_pars_vertex>
void main() {
  vec3 c = mix(uShaftB, uShaftA, position.y * 1.3 - 0.15);      // 0 foot .. 1 top, overshooting both ends
  vec3 P = c + vec3(position.x, 0.0, position.z) * uShaftR * 1.3;
  vP = P;
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  if (abs(gl_Position.w) < 1e-4) gl_Position.w = 1e-4;
  gl_Position.z = gl_Position.w * 0.999995;
  #include <fog_vertex>
}
`,Lt=`
uniform vec3 uCam;
uniform float uShaft;
uniform vec3 uShaftA;
uniform vec3 uShaftB;
uniform float uShaftR;
uniform vec3 uShaftCol;
varying vec3 vP;
#include <fog_pars_fragment>
${Ke}
void main() {
  vec3 d = normalize(vP - uCam + vec3(0.0, 1e-5, 0.0));
  gl_FragColor = vec4(shaftGlow(uCam, uCam + d * 400.0, 1.0), 1.0);
}
`,Ut=`
attribute vec4 iSlot;
attribute vec4 iRnd;
attribute vec4 iBeat;
uniform vec3 uSunDir;
varying vec2 vQ;
varying float vH;
#include <fog_pars_vertex>
${Se}
void main() {
  Frame F = orbitFrame(iSlot, iRnd, iBeat.zw);
  float h = max(F.p.y, 0.0);
  vec2 foot = F.p.xz - uSunDir.xz / max(uSunDir.y, 0.2) * h;
  vec2 f2 = normalize(F.f.xz + vec2(1e-5, 0.0));
  vec2 r2 = vec2(f2.y, -f2.x);
  float grow = 1.0 + h * 0.06;
  float beat = 1.0 - 0.14 * (0.5 + 0.5 * sin(iBeat.x * uTime + iBeat.y - 1.2));
  vec2 xz = foot + (r2 * position.x * beat + f2 * position.z) * iRnd.y * grow;
  vQ = position.xz; vH = h;
  if (F.p.y < -100.0) xz = foot;                 // hidden with its animal (seen through the previous portal)
  vec4 mvPosition = modelViewMatrix * vec4(xz.x, 0.05, xz.y, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,Et=`
uniform vec3 uShadowCol;
uniform float uShadow;
varying vec2 vQ;
varying float vH;
#include <fog_pars_fragment>
${Be}
void main() {
  float d = abs(vQ.x) / 2.3 + abs(vQ.y + 0.1) / 1.25 + 0.25 * vQ.y * vQ.y;     // the diamond
  float soft = 0.18 + vH * 0.03;
  float a = (1.0 - smoothstep(1.0 - soft, 1.0 + soft, d)) * uShadow / (1.0 + vH * 0.10) * fogFade();
  gl_FragColor = vec4(uShadowCol, a);
}
`,Te=n=>9+4*Math.min(1,Math.max(0,(n-2)/24)),Ae=new a.Vector3(-8,21.5,3.5),ve=new a.Vector3(-5.5,23,-6.5),_e=new a.Vector3(2,1.5,-3.5),Ot=5.2,pt=4.5,pe=18,Kt=[[2,1.5,-3.5],[2.1,1.5,-.6],[2,1.5,1.4],[.5,1.55,3.3],[-2.2,1.7,4.6],[-5.2,1.9,5.6],[-8,2.2,5.7],[-9.95,2.5,4],[-10.9,2.7,.6],[-10.4,2.75,-3.3],[-7.9,2.85,-7.4],[-4.3,3.4,-8.2],[-.7,4.2,-7.3],[3.88,5.2,-5.31],[5.26,5.7,-3.01],[5.8,6.05,-.59],[5.57,6.35,1.75],[5.07,6.6,3.71],[4.42,6.75,4.98],[3.15,6.9,5.7],[.2,7.4,5.7],[-2.7,7.9,5.7],[-4.8,8.3,5.7],[-7.1,8.8,5],[-8.6,9.3,3],[-9.1,10,-.6],[-8.1,10.8,-3.95],[-5.6,11.6,-6.4],[-2.25,12.3,-7.35],[.95,13,-6.75],[3.3,13.6,-4.75],[4.5,14.1,-2.1],[4.6,14.5,.5],[3.75,14.8,2.8],[1.65,15.1,4.05],[-.8,15.4,3.6],[-2.4,15.7,1.75],[-2.4,16.05,-.75],[-1.5,16.6,-3.15],[-.6,17.1,-5.65],[.8,17.6,-7.7],[3.05,18.1,-8.8],[5.55,18.6,-8.7],[7.7,19,-7.35],[9.3,19.3,-5.25],[10.3,19.55,-2.8],[10.15,19.75,.2],[8.35,19.9,2.6],[5.5,20,3.5],[1,20.5,3.5],[-3.5,21,3.5],[-8,21.5,3.5]],Z=[[0,-9.5,23.5,-11],[.15,-6.6,25,-9.4],[.3,-3.3,28.3,-8],[.42,-2,30.3,-7.6],[.55,-2,28,-7.2],[.7,-1.5,25.6,-8.8],[.85,-3.2,24.6,-10.6],[1,-6,24.3,-12.5]];function Ht(){const n=[0,0,.125],p=[],s=[[.088,.02,.011],[.035,.036,.018],[-.03,.026,.012]];for(const[y,B,z]of s)for(let T=0;T<6;T++){const G=T/6*Math.PI*2;n.push(Math.sin(G)*z,Math.cos(G)*B+.002,y)}n.push(0,0,-.085);for(let y=0;y<6;y++){const B=(y+1)%6;p.push(0,1+B,1+y,19,13+y,13+B);for(let z=0;z<2;z++){const T=1+z*6,G=T+6;p.push(T+y,G+B,G+y,G+B,T+y,T+B)}}const k=n.length/3;n.push(0,0,-.078,0,.046,-.132,0,0,-.106,0,-.046,-.132,0,.034,.05,0,.053,.004,0,.026,-.03);for(const[y,B,z]of[[0,1,2],[0,2,3],[4,5,6]])p.push(k+y,k+B,k+z,k+y,k+z,k+B);const g=new a.BufferGeometry;g.setAttribute("position",new a.Float32BufferAttribute(n,3)),g.setIndex(p),g.computeVertexNormals();const C=g.attributes.normal.array;for(let y=k;y<k+7;y++)C[y*3]=0,C[y*3+1]=.3,C[y*3+2]=0;return g}const Wt=`
attribute vec2 aRm;       // which fish of the pair, 0 nose .. 1 tail
attribute vec4 iSlot;
attribute vec4 iRnd;
attribute vec4 iBeat;
attribute vec4 iRem;      // station x, station z, seed, length (0 = none; below 0 = a chin rider only, on a full-detail animal that has none of its own)
uniform float uRemK;      // 1.3 on the full-detail animals (0.65-1 m: they must read as fish under a chin), 1 on the far ones
varying vec3 vN;
varying vec3 vP;
varying vec3 vR;
#include <fog_pars_vertex>
${Se}
void main() {
  float second = step(0.5, aRm.x);
  float sd = iRem.z + second * 0.37;
  vec3 q = position;
  q.x += 0.07 * sin(uTime * 4.0 + sd * 40.0 - aRm.y * 4.0) * aRm.y * aRm.y;       // sculling tail
  float len = abs(iRem.w) * uRemK;
  q *= len * (1.0 - 0.2 * second) * clamp(iRnd.y * 1.5 - 0.5, 0.0, 1.0);
  vec3 st = mix(vec3(iRem.x + 0.10 * sin(uTime * 0.21 + sd * 17.0), 0.0, iRem.y + 0.22 * sin(uTime * 0.13 + sd * 29.0)),
                vec3(-iRem.x * 0.6 + 0.08 * sin(uTime * 0.17 + sd * 11.0), 0.0, 0.42 + 0.12 * sin(uTime * 0.11 + sd * 5.0)), second);
  st.y = -(0.30 - 0.32 * abs(st.x)) * (1.0 - 0.5 * smoothstep(0.2, 0.9, abs(st.z - 0.1))) - 0.075 * len;
  float yaw = 0.25 * sin(uTime * 0.19 + sd * 23.0);
  float cy = cos(yaw), sy = sin(yaw);
  vec3 l = st * iRnd.y + vec3(q.x * cy + q.z * sy, -q.y, q.z * cy - q.x * sy);
  vec3 n = vec3(normal.x * cy + normal.z * sy, -normal.y, normal.z * cy - normal.x * sy);
  Frame F = orbitFrame(iSlot, iRnd, iBeat.zw);
  // a chin rider grows in as its host comes within 10 m of the lens (its host only wears the full model about there)
  if (iRem.w < 0.0) l = mix(st * iRnd.y, l, second * (1.0 - smoothstep(6.0, 10.0, length(uCam - F.p))));
  vec3 P = F.p + F.r * l.x + F.u * l.y + F.f * l.z;
  vN = F.r * n.x + F.u * n.y + F.f * n.z;
  vP = P; vR = position;
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,$t=`
uniform vec3 uCam;
varying vec3 vN;
varying vec3 vP;
varying vec3 vR;
#include <fog_pars_fragment>
${Re}
void main() {
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0));
  vec3 V = normalize(uCam - vP + vec3(0.0, 1e-5, 0.0));
  if (dot(N, V) < 0.0) N = -N;
  vec3 amb = mix(uAmbDown, uAmbUp, N.y * 0.5 + 0.5) + uGold * inShaft(vP) * 0.3;
  float stripe = 1.0 - smoothstep(0.013, 0.034, abs(vR.y + 0.004));                // the pale line along the flank
  vec3 alb = mix(vec3(0.1, 0.11, 0.12), vec3(0.56, 0.58, 0.5), stripe * 0.9);       // slate with a bone stripe: a fish, not one more black blotch
  alb = mix(alb, vec3(0.02), smoothstep(0.3, 0.5, vR.z) * step(0.0, vR.y) * 0.6);   // the sucker plate on the crown
  vec3 col = alb * (amb + uKeyCol * uSun * max(dot(N, uSunDir), 0.0));
  col += uWater * pow(max(1.0 - abs(dot(N, V)), 0.0), 3.0) * 0.14;
  gl_FragColor = vec4(col, 1.0);
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      float fogF = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      float fogF = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
    gl_FragColor.rgb = mix(gl_FragColor.rgb, waterFog(fogColor, -V.y, fogF), fogF);
  #endif
  gl_FragColor.rgb += shaftGlow(uCam, vP, 0.0) * 0.12;      // a thin veil only: an animal behind the column stays a clean three-tone shape
}
`;function vt(n,p,s){const k=[],g=[],C=[],y=[.5,.44,.33,.14,-.08,-.28,-.42],B=[.008,.038,.056,.06,.048,.028,.012];for(let T=0;T<s;T++){const G=k.length/3;for(let I=0;I<n;I++){const K=I/(n-1)*(y.length-1),_=Math.min(y.length-2,Math.floor(K)),d=K-_,h=y[_]+(y[_+1]-y[_])*d,f=B[_]+(B[_+1]-B[_])*d;for(let r=0;r<p;r++){const x=r/p*Math.PI*2;let i=Math.cos(x)*f*.9;h>.2&&(i=Math.min(i,f*.5)),k.push(Math.sin(x)*f*(h>.2?1.15:.8),i,h),g.push(T,.5-h)}}for(let I=0;I<n-1;I++)for(let K=0;K<p;K++){const _=G+I*p+K,d=G+I*p+(K+1)%p,h=_+p,f=d+p;C.push(_,h,d,d,h,f)}const L=(I,K,_)=>(k.push(I,K,_),g.push(T,.5-_),k.length/3-1),Q=L(0,0,-.4),U=L(0,.07,-.52),J=L(0,-.07,-.52),W=L(0,0,-.47);if(C.push(Q,U,W,Q,W,J),p>3){for(const r of[-1,1]){const x=L(r*.05,-.005,.26),i=L(r*.15,-.02,.14),u=L(r*.05,-.005,.16);C.push(x,i,u)}const I=L(0,.045,-.05),K=L(0,.085,-.2),_=L(0,.03,-.34);C.push(I,K,_);const d=L(0,-.045,-.05),h=L(0,-.08,-.2),f=L(0,-.03,-.34);C.push(d,h,f)}}const z=new a.BufferGeometry;return z.setAttribute("position",new a.Float32BufferAttribute(k,3)),z.setAttribute("aRm",new a.Float32BufferAttribute(g,2)),z.setIndex(C),z.computeVertexNormals(),z}const jt=`
attribute float aIdx;
uniform vec3 uCam;
uniform vec4 uThru;
varying vec4 vB;          // across -1..1, along 0 foot .. 1 ceiling, strength, index
varying float vAx;        // how nearly the view runs along the beam (1 = straight up it)
#include <fog_pars_vertex>
${He}
void main() {
  vec4 b = uBeam[int(aIdx + 0.5)];
  float t = position.y;
  vec3 c = vec3(b.x + uBeamLean.x * 28.0 * t, 28.0 * t, b.y + uBeamLean.y * 28.0 * t);
  vec3 ax = normalize(vec3(uBeamLean.x, 1.0, uBeamLean.y));
  vec3 side = normalize(cross(ax, uCam - c) + vec3(1e-5, 0.0, 0.0));
  vec3 P = c + side * (position.x * b.z * 1.8 * (0.75 + 0.5 * t));
  vB = vec4(position.x, t, b.w * (1.0 - uThru.w * step(b.y - uThru.z, -1.5)), aIdx);
  vAx = abs(dot(normalize(P - uCam + vec3(0.0, 1e-4, 0.0)), ax));
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,Yt=`
uniform float uTime;
uniform vec3 uBeamCol;
varying vec4 vB;
varying float vAx;
#include <fog_pars_fragment>
${Be}
${Oe}
void main() {
  float x = vB.x, k = 1.0 - x * x;
  float prof = exp(-x * x * 4.5) * k * k;
  float n = 0.2 + 1.0 * vn(vec2(vB.y * 7.0 - uTime * 0.25, vB.w * 3.7)) * (0.6 + 0.8 * vn(vec2(x * 3.0 + vB.w, vB.y * 2.6 + uTime * 0.1)));
  float ends = smoothstep(0.0, 0.1, vB.y) * (1.0 - smoothstep(0.8, 1.0, vB.y)) * (0.35 + 0.65 * vB.y);
  // a beam close to the lens, or one looked up along toward the sun, would stand in the frame as a broad pale bar: both fade
  float bar = smoothstep(1.5, 8.0, vFogDepth) * (1.0 - 0.85 * smoothstep(0.62, 0.93, vAx));
  gl_FragColor = vec4(uBeamCol * (prof * n * ends * vB.z * fogFade() * bar), 1.0);
}
`,Xt=`
attribute vec4 aB;        // angle, radial, depth, seed
uniform vec4 uBreach;     // the hole (xyz) and the breach's progress k (below 0: parked)
uniform float uTime;
uniform float uPx;
varying float vA;
#include <fog_pars_vertex>
void main() {
  float k = uBreach.w, crown = step(aB.w, 0.4);
  float a1 = clamp((k - 0.27) / 0.3, 0.0, 1.0), a2 = clamp((k - 0.52) / 0.48, 0.0, 1.0);
  float ang = aB.x * 6.2831853 + 0.4 * sin(uTime * 1.7 + aB.w * 40.0);
  // the crown: a ring that opens on the ceiling; the plume: a column driven down, then rising and spreading
  float rr = mix((1.2 + 1.5 * a1) * (0.8 + 0.4 * aB.y), (0.25 + 1.3 * aB.y) * (0.5 + 0.9 * a2), 1.0 - crown);
  float sink = mix(0.1 + 0.35 * aB.z * sin(3.1416 * a1), 3.2 * aB.z * sin(3.1416 * min(a2 * 1.7, 1.0) * 0.5) * (1.0 - 0.85 * smoothstep(0.35, 1.0, a2)), 1.0 - crown);
  vec3 P = uBreach.xyz + vec3(cos(ang) * rr, -sink, sin(ang) * rr);
  float life = mix(sin(3.1416 * a1), sin(3.1416 * a2), 1.0 - crown);
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  float dist = max(-mvPosition.z, 0.1);
  float px = (0.05 + 0.09 * fract(aB.w * 17.0)) * uPx * 0.83 / dist;
  gl_PointSize = clamp(px, 1.5, 14.0);
  vA = max(life, 0.0) * step(0.0, k) * min(px / 1.5, 1.0);
  #include <fog_vertex>
}
`,Qt=`
uniform vec3 uBubble;
varying float vA;
#include <fog_pars_fragment>
${Be}
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = (1.0 - smoothstep(0.3, 0.5, d)) * (0.35 + 0.65 * smoothstep(0.15, 0.42, d));     // a bright rim round a dimmer heart
  gl_FragColor = vec4(uBubble * a * vA * fogFade(), 1.0);
}
`;async function Jt(n,p={}){const s=n.rng.fork("manta-cyclone-hero"),k=n.quality?.detail??1,g=(p.palette&&p.palette.length>=7?p.palette:Pt).map(e=>new a.Color(e)),[C,y,B,z,T,G,L]=g,Q=p.turn===-1?-1:1,U=new a.Group;U.name="manta-cyclone",Q<0&&(U.scale.z=-1);const J=Math.min(10,Math.max(8,Math.round(p.tiers??s.int(8,10)))),W=Math.min(.34,Math.max(0,p.melanistic??s.pick([0,.05,.085,.085,.14,.22,.33]))),I=s()*Math.PI*2,K=s.range(.27,.42),_=s.range(.5,.75),d=s()*Math.PI*2,h=s.range(.9,1.08),f=e=>({seed:s(),size:s.range(3.5,4.5)/4,mel:s()<W?1:0,mode:e,freq:s.range(.3,.4)*Math.PI*2,phase:s()*Math.PI*2}),r=[],x=13;for(let e=0;e<J;e++){const t=3.2+e*(20.8/(J-1)),o=Te(t)+2.1;for(let l=0;l<x;l++){const c=f(0);c.slot=[o+s.range(-.25,.25),t+s.range(-.2,.2),I+(l+.25*e)/x*Math.PI*2+s.range(-.04,.04),2/o],r.push(c)}}for(let e=0;e<6;e++){const t=4.6+e*3.6;for(let o=0;o<10;o++){const l=f(0),c=t+s.range(-.7,.7),m=15.8+2.8*((c-2)/24)+s.range(-.6,.6);l.slot=[m,c,I*1.7+(o+.37*e)/10*Math.PI*2+s.range(-.16,.16),1.8/m],r.push(l)}}const i=r.length,u=Math.max(16,192-J*12-60);for(let e=0;e<u;e++){const t=f(0),o=s.range(4,23.5),l=21+1.8*((o-2)/24)+s.range(-1,1.6);t.slot=[l,o,(e+s.range(-.3,.3))/u*Math.PI*2,1.6/l],r.push(t)}const A=[];for(let e=0;e<pe;e++){const t=f(0);t.slot=[50,-60,0,0],t.size=1e-4,A.push(t)}{const e=f(1);e.slot=[Math.hypot(ve.x,ve.z),ve.y,Math.atan2(-ve.z,ve.x),0],e.mel=0,A.push(e);const t=f(2);t.slot=[0,-60,0,0],t.mel=0,t.size=1.1,A.push(t)}const M=p.chain!==!1,D=[];if(M)for(let e=0;e<28;e++){const t=f(2);t.slot=[0,-50,0,0],t.jit=s.range(-.8,.8),t.side=s.range(-1.6,1.6),t.lift=s.range(-.9,.9),D.push(t)}const H=p.ribbon===!1?0:Math.round(2400*k),q=H+(H>0?Math.round(1e3*k):0),P=new Float32Array(Math.max(1,q)*4);for(let e=0;e<H;e++)P[e*4+1]=s.gauss()*.75,P[e*4+2]=s.gauss()*.75,P[e*4+3]=s(),e%400===399&&await n.yield();{const e=n.core.makeRng(n.core.hashSeed("manta-school-fish:"+n.seed));for(let t=H;t<q;t++)P[t*4+1]=e.gauss()*.75,P[t*4+2]=e.gauss()*.75,P[t*4+3]=e()}const E=n.core.makeRng(n.core.hashSeed("manta-schools:"+n.seed)),j=[];for(let e=0;e<he;e++){const t=5+(e+E.range(.15,.85))/he*15,o=E.range(.4,3.2),l=E.range(3,4.6),c=(e+E.int(0,2))%3,m=c===2?E.range(5,6.5):c===1?E.range(14,18):E.range(9,14);j.push({y:t,inset:o,rate:l/(Te(t)-.35-o),phase:E()*Math.PI*2,rise:E.range(.7,2),risePhase:E()*Math.PI*2,len:m,kind:c})}for(let e=0;e<q;e++){const t=e*4,o=P[t+3],l=o*113.3%1,c=o*71.7%1,m=Math.min(he-1,Math.floor(o*37.7%1*he)),b=j[m].kind;if(c<.9){const F=b===1?.04+.92*l:Math.pow(l,1.7),S=b===1?.5*Math.sqrt(Math.sin(Math.PI*F))+.1:(Math.min(1,Math.sqrt(F*9))*Math.pow(1-F,.7)+.12)*(b===2?1.5:1);P[t]=m+.999*F,P[t+1]*=2*S,P[t+2]*=2*S}else P[t]=m+.3+.699*l,P[t+1]*=3.6,P[t+2]*=2.6}const se=q>0?Math.round(430*k):0,ee=new Float32Array(Math.max(1,q+se)*4);ee.set(P.subarray(0,q*4));{const e=n.core.makeRng(n.core.hashSeed("manta-shark-school:"+n.seed));for(let t=0;t<se;t++){const o=(q+t)*4;ee[o]=100,ee[o+1]=0,ee[o+2]=0,ee[o+3]=e()}}const te=Math.max(6,Math.round(14*k)),re=new Float32Array(te*3);for(let e=0;e<te;e++)re[e*3]=(e+s())/te,re[e*3+1]=s(),re[e*3+2]=Math.sqrt(s());const ie=new Float32Array(r.length*4);for(let e=0;e<r.length;e++){const t=s()<.3;ie[e*4]=s.range(.1,.34)*(s()<.5?-1:1),ie[e*4+1]=s.range(-.45,.15),ie[e*4+2]=s(),ie[e*4+3]=t?s.range(.5,.75):0}const le=new Float32Array(A.length*4);le.set([.2,-.2,s(),.6],pe*4);const Y=[];for(let e=0;e<8;e++){const t=e/8*Math.PI*2+s.range(-.3,.3),o=s.range(1.5,6.5);Y.push({cx:Math.cos(t)*o+.5,cz:Math.sin(t)*o+5.5,ax:s.range(3.5,6.5),az:s.range(3,6),w:Math.PI*2/s.range(9,17),ph:s()*6.283,ph2:s()*6.283,rad:s.range(.25,.7),k:s.range(.7,1.2)})}const ge=new Float32Array(260*4);for(let e=0;e<ge.length;e++)ge[e]=s();await n.yield();const V=(e,t=1)=>new a.Color(e.r*t,e.g*t,e.b*t),Me=(e,t)=>{const o=Math.max(e.r,e.g,e.b,1e-4);return V(e,t/o)},gt=new a.Vector3(0,Math.cos(.436),-Math.sin(.436)),We=new a.Vector3(-.3,Fe-.4,-13.5),ke=new a.Vector3(.4,0,4),v={uTime:{value:0},uCam:{value:new a.Vector3(0,1e4,0)},uPushR:{value:4.5},uClear:{value:new a.Vector4(Ae.x,Ae.y,Ae.z,7)},uBank:{value:K},uCapA:{value:new a.Vector4(0,-500,0,.01)},uCapB:{value:new a.Vector3(0,-500,1)},uThru:{value:new a.Vector4(_e.x,_e.y,_e.z,0)},uBow:{value:new a.Vector4(0,-500,0,0)},uBowF:{value:new a.Vector3(1,0,0)},uBeam:{value:Y.map(()=>new a.Vector4(0,0,.4,0))},uBeamLean:{value:new a.Vector2(0,-Math.tan(.436))},uWater:{value:V(C)},uGold:{value:V(B)},uAmbUp:{value:V(C,.9).add(V(G,.35))},uAmbDown:{value:V(C,.8).add(V(z,.38))},uSunDir:{value:gt},uSunCol:{value:V(B,2)},uKeyCol:{value:V(G,1).add(V(B,.45))},uSun:{value:.5},uShaft:{value:0},uCaustic:{value:.35},uShaftA:{value:We},uShaftB:{value:ke.clone()},uShaftR:{value:pt},uShaftWarm:{value:new a.Color(B.r*1.15,B.g*1.2,B.b*.45)},uShaftT:{value:0},uFogFar:{value:new a.Color(0,0,0)},uFogFarK:{value:0},uFogUp:{value:new a.Color(1,1,1)},uFogDn:{value:new a.Color(1,1,1)},uShaftCol:{value:V(B,.5).add(V(C,.6))},uBio:{value:Math.min(1,Math.max(0,p.bio??0))},uBioCol:{value:new a.Color(.12,.85,.7)}},bt=v.uShaftCol.value.clone(),wt=v.uShaftWarm.value.clone(),ae=()=>a.UniformsUtils.clone(a.UniformsLib.fog),be=new a.ShaderMaterial({name:"manta",fog:!0,vertexShader:mt,fragmentShader:dt,uniforms:{...ae(),...v,uBeatAmp:{value:h},uBack:{value:Me(T,.034)},uBelly:{value:Me(z,.72)},uPale:{value:V(z,.42)}}}),xt=new a.ShaderMaterial({name:"manta-far",fog:!0,vertexShader:mt,fragmentShader:dt,uniforms:{...ae(),...v,uBeatAmp:be.uniforms.uBeatAmp,uBack:be.uniforms.uBack,uBelly:be.uniforms.uBelly,uPale:be.uniforms.uPale}}),De=new a.ShaderMaterial({name:"manta-motes",fog:!0,vertexShader:It,fragmentShader:qt,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,uniforms:{...ae(),...v,uPx:{value:900},uMote:{value:V(B,.3).add(V(G,.2))}}});await n.yield();const yt=ht(!1);await n.yield();const Ce=ft(yt);await n.yield();const Ft=ht(!0);await n.yield();const $e=ft(Ft);await n.yield();const St=new a.Float32BufferAttribute(new Float32Array(te*3),3),Bt=new a.Float32BufferAttribute(re,3),Ve=(e,t,o,l)=>{if(!t.length)return null;const c=t.length,m=new Float32Array(c*4),b=new Float32Array(c*4),F=new Float32Array(c*4);for(let oe=0;oe<c;oe++){const ne=t[oe];m.set(ne.slot,oe*4),b.set([ne.seed,ne.size,ne.mel,ne.mode],oe*4),F.set([ne.freq,ne.phase,ne.att||0,ne.loop||0],oe*4)}const S=new a.InstancedBufferAttribute(m,4),w=new a.InstancedBufferAttribute(b,4),R=new a.InstancedBufferAttribute(F,4);o&&(S.setUsage(a.DynamicDrawUsage),R.setUsage(a.DynamicDrawUsage)),w.setUsage(a.DynamicDrawUsage);const N=new a.InstancedBufferGeometry;N.setIndex(e.index);for(const oe of["position","normal","aUV","aPart"])N.setAttribute(oe,e.attributes[oe]);N.setAttribute("iSlot",S),N.setAttribute("iRnd",w),N.setAttribute("iBeat",R),N.instanceCount=c;const me=new a.Mesh(N,e===Ce?xt:be);me.frustumCulled=!1,me.name=l,U.add(me);const de=new a.InstancedBufferGeometry;de.setAttribute("position",St),de.setAttribute("aMote",Bt),de.setAttribute("iSlot",S),de.setAttribute("iRnd",w),de.setAttribute("iBeat",R),de.instanceCount=c;const ye=new a.Points(de,De);return ye.frustumCulled=!1,ye.name=l+"-motes",ye.renderOrder=9,U.add(ye),{list:t,slot:m,beat:F,rnd:b,iSlot:S,iBeat:R,iRnd:w,mesh:me,pts:ye}},je=Ve(Ce,r,!1,"mantas");await n.yield();const ce=Ve($e,A,!0,"mantas-near"),At=Ve(Ce,D,!0,"chain");await n.yield();let Ne=null;if(p.remoras!==!1){const e=m=>new a.ShaderMaterial({name:"manta-remoras",fog:!0,vertexShader:Wt,fragmentShader:$t,side:a.DoubleSide,uniforms:{...ae(),...v,uRemK:{value:m}}}),t=e(1),o=e(1.3),l=vt(7,6,2),c=vt(4,3,1);for(const[m,b,F,S]of[[ce,le,l,"remoras-near"],[je,ie,c,"remoras"]]){const w=new a.InstancedBufferGeometry;w.setIndex(F.index);for(const me of["position","normal","aRm"])w.setAttribute(me,F.attributes[me]);w.setAttribute("iSlot",m.iSlot),w.setAttribute("iRnd",m.iRnd),w.setAttribute("iBeat",m.iBeat);const R=new a.InstancedBufferAttribute(b,4);m===ce&&(R.setUsage(a.DynamicDrawUsage),Ne=R),w.setAttribute("iRem",R),w.instanceCount=m.list.length;const N=new a.Mesh(w,m===ce?o:t);N.frustumCulled=!1,N.name=S,U.add(N)}}if(await n.yield(),q>0){const e=Ht(),t=new a.InstancedBufferGeometry;t.setIndex(e.index),t.setAttribute("position",e.attributes.position),t.setAttribute("normal",e.attributes.normal),t.setAttribute("iFish",new a.InstancedBufferAttribute(ee,4)),t.instanceCount=q+se;const o=new a.ShaderMaterial({name:"manta-fusiliers",fog:!0,vertexShader:Vt,fragmentShader:Nt,uniforms:{...ae(),...v,uSch:{value:j.map(c=>new a.Vector4(c.inset,c.y,c.phase,c.rate))},uSchB:{value:j.map(c=>new a.Vector4(c.rise,c.risePhase,c.len,0))},uRibbon:{value:new a.Vector2(_,d)},uCobalt:{value:V(L)},uSilver:{value:V(G,.9).add(V(z,.25))}}}),l=new a.Mesh(t,o);l.frustumCulled=!1,l.name="fusiliers",U.add(l)}if(await n.yield(),p.shaft!==!1){const e=new a.CylinderGeometry(1,1,1,32,1,!0);e.translate(0,.5,0);const t=new a.ShaderMaterial({name:"manta-shaft",fog:!0,vertexShader:Gt,fragmentShader:Lt,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,side:a.BackSide,uniforms:{...ae(),...v}}),o=new a.Mesh(e,t);o.frustumCulled=!1,o.name="shaft",o.renderOrder=9,U.add(o)}const Ye={value:V(B,.5).add(V(C,.25))};let Xe=p.beams===!1?0:.35;if(p.beams!==!1){const t=[],o=[],l=[];for(let F=0;F<8;F++){const S=t.length/3;for(let w=0;w<=10;w++)t.push(-1,w/10,0,1,w/10,0),o.push(F,F);for(let w=0;w<10;w++){const R=S+w*2;l.push(R,R+1,R+2,R+1,R+3,R+2)}}const c=new a.BufferGeometry;c.setAttribute("position",new a.Float32BufferAttribute(t,3)),c.setAttribute("aIdx",new a.Float32BufferAttribute(o,1)),c.setIndex(l);const m=new a.ShaderMaterial({name:"manta-beams",fog:!0,vertexShader:jt,fragmentShader:Yt,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,side:a.DoubleSide,uniforms:{...ae(),...v,uBeamCol:Ye}}),b=new a.Mesh(c,m);b.frustumCulled=!1,b.name="beams",b.renderOrder=9,U.add(b)}const Qe={uBreach:{value:new a.Vector4(Z[2][1],Fe-.15,Z[2][3],-1)},uPx:De.uniforms.uPx,uBubble:{value:V(G,.9).add(V(z,.3))}};{const e=new a.BufferGeometry;e.setAttribute("position",new a.Float32BufferAttribute(new Float32Array(260*3),3)),e.setAttribute("aB",new a.Float32BufferAttribute(ge,4));const t=new a.ShaderMaterial({name:"manta-breach-bubbles",fog:!0,vertexShader:Xt,fragmentShader:Qt,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,uniforms:{...ae(),uTime:v.uTime,...Qe}}),o=new a.Points(e,t);o.frustumCulled=!1,o.name="breach-bubbles",o.renderOrder=9,U.add(o)}const Je={uShadowCol:{value:V(y,.35)},uShadow:{value:.42}};if(p.shadows!==!1){const e=r.filter(w=>w.slot[1]<8.6),t=e.length,o=new Float32Array(t*4),l=new Float32Array(t*4),c=new Float32Array(t*4);e.forEach((w,R)=>{o.set(w.slot,R*4),l.set([w.seed,w.size,w.mel,0],R*4),c.set([w.freq,w.phase,0,0],R*4)});const m=new a.PlaneGeometry(6.4,4.6,1,1);m.rotateX(-Math.PI/2),m.translate(0,0,-.1);const b=new a.InstancedBufferGeometry;b.setIndex(m.index),b.setAttribute("position",m.attributes.position),b.setAttribute("iSlot",new a.InstancedBufferAttribute(o,4)),b.setAttribute("iRnd",new a.InstancedBufferAttribute(l,4)),b.setAttribute("iBeat",new a.InstancedBufferAttribute(c,4)),b.instanceCount=t;const F=new a.ShaderMaterial({name:"manta-shadows",fog:!0,vertexShader:Ut,fragmentShader:Et,transparent:!0,depthWrite:!1,side:a.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,uniforms:{...ae(),...v,...Je}}),S=new a.Mesh(b,F);S.frustumCulled=!1,S.name="wing-shadows",S.renderOrder=1,U.add(S)}await n.yield();const Ie=[new a.Vector3(-34,10.5,74),new a.Vector3(-25,11,55),new a.Vector3(-14,11.8,37),new a.Vector3(-5,12.5,25.5)];for(let e=-90;e<=30;e+=30){const t=e*Math.PI/180;Ie.push(new a.Vector3(Math.cos(t)*22.2,13+(e+90)/150,-Math.sin(t)*22.2))}const ze=200,X=new Float32Array((ze+1)*3);let ue=1;{const e=new a.CatmullRomCurve3(Ie,!1,"centripetal"),t=e.getSpacedPoints(ze);ue=e.getLength();for(let o=0;o<=ze;o++)X[o*3]=t[o].x,X[o*3+1]=t[o].y,X[o*3+2]=t[o].z}const qe=(e,t)=>{const o=Math.min(.99999,Math.max(0,e/ue))*ze,l=Math.floor(o),c=o-l,m=l*3;return t.set(X[m]+(X[m+3]-X[m])*c,X[m+1]+(X[m+4]-X[m+1])*c,X[m+2]+(X[m+5]-X[m+2])*c),t},Mt=new a.CatmullRomCurve3(Z.map(e=>new a.Vector3(e[1],e[2],e[3])),!1,"centripetal"),Ze=(e,t)=>{let o=0;for(;o<Z.length-2&&e>Z[o+1][0];)o++;const l=Math.min(1,Math.max(0,(e-Z[o][0])/(Z[o+1][0]-Z[o][0])));return Mt.getPoint((o+l)/(Z.length-1),t)};await n.yield();let et=null,Pe=null,fe=-1;const O=new a.Vector3,$=new a.Vector3,Ge=new a.Vector3,kt=new a.Vector2,we=(e,t,o)=>{const l=Math.min(1,Math.max(0,(o-e)/(t-e)));return l*l*(3-2*l)},Ct=e=>Math.atan2(Math.sin(e),Math.cos(e)),tt=e=>{const t=At;if(t){for(let o=0;o<t.list.length;o++){const l=t.list[o];let c=e*1.8+o*Ot+l.jit;c=(c%ue+ue)%ue,qe(c,O),qe(c+1.5,$),qe(c+4.5,Ge);const m=Math.atan2($.x-O.x,$.z-O.z),b=Math.atan2(Ge.x-$.x,Ge.z-$.z),F=Math.hypot($.x-O.x,$.z-O.z)||1,S=o*4;t.slot[S]=O.x+Math.cos(m)*l.side,t.slot[S+1]=O.y+l.lift+.3*Math.sin(e*.4+l.seed*30),t.slot[S+2]=O.z-Math.sin(m)*l.side,t.slot[S+3]=m,t.beat[S+2]=Math.atan2($.y-O.y,F)+.05*Math.cos(e*.4+l.seed*30),t.beat[S+3]=Math.min(.5,Math.max(-.5,-Ct(b-m)*2.4)),t.rnd[S+1]=l.size*Math.max(.001,we(0,9,c)*(1-we(ue-9,ue-.5,c)))}t.iSlot.needsUpdate=!0,t.iBeat.needsUpdate=!0,t.iRnd.needsUpdate=!0}},Le=new Int32Array(pe).fill(-1),Ue=new Uint8Array(r.length),Ee=new Float32Array(i),at=new Int16Array(i),xe=[];for(let e=0;e<i;e++)xe.push(e);const zt=(e,t)=>Ee[e]-Ee[t],ot=e=>{const t=v.uCam.value,o=je,l=ce;for(let b=0;b<i;b++){const F=r[b].slot,S=F[2]+F[3]*e,w=Math.cos(S)*F[0]-t.x,R=F[1]-t.y,N=-Math.sin(S)*F[0]-t.z;Ee[b]=w*w+R*R+N*N}xe.sort(zt);for(let b=0;b<i;b++)at[xe[b]]=b;let c=!1,m=0;for(let b=0;b<pe;b++){const F=Le[b];if(F>=0&&at[F]<pe+5)continue;for(F>=0&&(o.rnd[F*4+1]=r[F].size,Ue[F]=0,Le[b]=-1,l.rnd[b*4+1]=1e-4,c=!0);m<i&&Ue[xe[m]];)m++;if(m>=i||m>=pe+5)continue;const S=xe[m],w=b*4,R=S*4;for(let N=0;N<4;N++)l.slot[w+N]=o.slot[R+N],l.rnd[w+N]=o.rnd[R+N],l.beat[w+N]=o.beat[R+N],le[w+N]=ie[R+N];le[w+3]===0&&(le[w+3]=-(.55+.2*r[S].seed)),l.rnd[w+1]=r[S].size,o.rnd[R+1]=1e-4,Ue[S]=1,Le[b]=S,c=!0}return c&&(o.iRnd.needsUpdate=!0,l.iSlot.needsUpdate=!0,l.iBeat.needsUpdate=!0,Ne&&(Ne.needsUpdate=!0)),c},nt=()=>{const e=ce,t=(pe+1)*4;if(fe<0){e.slot[t+1]=-60,e.rnd[t+1]=1e-4;return}Ze(fe,O),Ze(Math.min(1,fe+.02),$);const o=Math.hypot($.x-O.x,$.z-O.z)||1;e.slot[t]=O.x,e.slot[t+1]=O.y,e.slot[t+2]=O.z,e.slot[t+3]=Math.atan2($.x-O.x,$.z-O.z),e.beat[t+2]=Math.atan2($.y-O.y,o),e.beat[t+3]=.5*Math.sin(fe*9),e.rnd[t+1]=1.1*we(0,.07,fe)*(1-we(.88,1,fe))+1e-4},st=e=>{for(let t=0;t<8;t++){const o=Y[t];v.uBeam.value[t].set(o.cx+o.ax*Math.sin(e*o.w+o.ph),o.cz+o.az*Math.sin(e*o.w*.83+o.ph2),o.rad,Xe*o.k*(.75+.25*Math.sin(e*.9+o.ph*3)))}};tt(0),ot(0),nt(),st(0);const rt={object:U,radius:23,height:Fe,center:new a.Vector3(0,13,0),ground:!0,groundY:0,uniforms:v,info:{wheelPhase:I,bottomRate:2/(Te(3.2)+2.1),tiers:J,laneN:x,melanistic:W,turn:Q,schools:he,animals:r.length+D.length+1,fish:q+se},setProgress(e){if(et=Math.min(1,Math.max(0,e)),Pe===null){const t=we(.488,.545,et);v.uShaft.value=t,v.uCaustic.value=.35+.65*t}},setShaft(e){Pe=Math.min(1,Math.max(0,e)),v.uShaft.value=Pe,v.uCaustic.value=.35+.65*Pe},setBeams(e,t){Xe=Math.max(0,e),t&&Ye.value.copy(t)},setBio(e){v.uBio.value=Math.min(1,Math.max(0,e))},setPush(e){v.uPushR.value=Math.max(.01,e)},setClear(e,t){v.uClear.value.set(e.x,e.y,e.z,Math.max(.01,t))},setCapsule(e,t,o){v.uCapA.value.set(e.x,e.y,e.z,Math.max(.01,o)),v.uCapB.value.copy(t)},setBow(e,t,o){v.uBow.value.set(e.x,e.y,e.z,Math.min(1,Math.max(0,o))),v.uBowF.value.copy(t)},setThrough(e){v.uThru.value.w=e?1:0},setBreach(e){fe=e,Qe.uBreach.value.w=e},breachHole:new a.Vector3(Z[2][1],Fe,Z[2][3]),setFogTint(e,t){e&&v.uFogUp.value.copy(e),t&&v.uFogDn.value.copy(t)},setShadow(e){Je.uShadow.value=e},setShaftTint(e){v.uShaftCol.value.copy(bt).multiply(e),v.uShaftWarm.value.copy(wt).multiply(e)},setFogFar(e,t=1){v.uFogFar.value.copy(e),v.uFogFarK.value=t},setLight(e={}){e.sunDir&&v.uSunDir.value.copy(e.sunDir).normalize(),e.sunColor&&v.uSunCol.value.copy(e.sunColor),e.keyColor&&v.uKeyCol.value.copy(e.keyColor),e.ambientUp&&v.uAmbUp.value.copy(e.ambientUp),e.ambientDown&&v.uAmbDown.value.copy(e.ambientDown),e.water&&v.uWater.value.copy(e.water),e.sun!==void 0&&(v.uSun.value=e.sun),e.caustic!==void 0&&(v.uCaustic.value=e.caustic)},update(e,t,o){v.uTime.value=t,v.uShaftT.value=t,o&&(U.updateWorldMatrix(!0,!1),o.getWorldPosition(O),v.uCam.value.copy(U.worldToLocal(O))),n.renderer&&n.renderer.getDrawingBufferSize&&(De.uniforms.uPx.value=n.renderer.getDrawingBufferSize(kt).y),v.uShaftB.value.set(ke.x+Math.sin(t*.13)*.9,0,ke.z+Math.cos(t*.17)*.9),tt(t),ot(t),nt(),st(t),ce.iSlot.needsUpdate=!0,ce.iBeat.needsUpdate=!0,ce.iRnd.needsUpdate=!0},dispose(){Ce.dispose(),$e.dispose()}};return rt.anchors={portalSeat:{position:Ae.clone(),normal:new a.Vector3(.994,-.11,0),radius:4.5},flyThrough:Kt.map(e=>new a.Vector3(e[0],e[1],e[2])),entry:_e.clone(),entryDir:new a.Vector3(0,0,1),eye:new a.Vector3(0,6.5,0),eyeRadius:Te,eyeLook:new a.Vector3(0,22,0),columnMid:new a.Vector3(0,13,0),somersault:ve.clone(),shaftTop:We.clone(),shaftFoot:ke.clone(),shaftRadius:pt,chainPath:Ie.map(e=>e.clone()),chainLength:ue,surfaceY:Fe,viewpoints:[{position:new a.Vector3(2,1.5,-3.5),target:new a.Vector3(1,6,9)},{position:new a.Vector3(-7.7,2.3,2),target:new a.Vector3(-7,3.2,-8)},{position:new a.Vector3(3.5,14.5,1.5),target:new a.Vector3(0,0,3)},{position:new a.Vector3(5.5,20,3.5),target:Ae.clone()}]},rt}export{He as BEAM_GLSL,Be as FOG_FADE_GLSL,Re as LIGHT_PARS_GLSL,Oe as NOISE_GLSL,Se as ORBIT_GLSL,Ke as SHAFT_FN_GLSL,Jt as buildHero};
