import*as x from"three";import{clamp as J,lerp as Z,smoothstep as E}from"../kit/core.js";const T=9,V=65,R=70,mt=16,dt=30,Ct=4,Pt=26,D=55,$=5,K=326,nt=346,it=1,L=r=>216-18*r,I=r=>mt+dt*(r+1),X=r=>$*(1-r/D*(r/D));class ft{constructor(){this.cap=2048,this.p=new Float32Array(this.cap*3),this.n=new Float32Array(this.cap*3),this.uv=new Float32Array(this.cap*2),this.m=new Float32Array(this.cap*4),this.d=new Float32Array(this.cap),this.idx=[],this.c=0}grow(){const t=(l,h)=>{const f=new Float32Array(this.cap*2*h);return f.set(l),f};this.p=t(this.p,3),this.n=t(this.n,3),this.uv=t(this.uv,2),this.m=t(this.m,4),this.d=t(this.d,1),this.cap*=2}v(t,l,h,f,v){this.c===this.cap&&this.grow();const o=this.c,y=o*3,M=o*2,F=o*4,g=this.p,s=this.n,b=this.m;return g[y]=t[0],g[y+1]=t[1],g[y+2]=t[2],s[y]=l[0],s[y+1]=l[1],s[y+2]=l[2],this.uv[M]=h[0],this.uv[M+1]=h[1],b[F]=f[0],b[F+1]=f[1],b[F+2]=f[2],b[F+3]=f[3],this.d[o]=v,this.c++}quad(t,l,h,f,v,o,y,M){const F=l[0]-t[0],g=l[1]-t[1],s=l[2]-t[2],b=f[0]-t[0],m=f[1]-t[1],e=f[2]-t[2];let a=g*e-s*m,c=s*b-F*e,d=F*m-g*b;const u=Math.hypot(a,c,d)||1;a/=u,c/=u,d/=u;const p=M===void 0?o:[o[0],o[1],M,o[3]],w=this.v(t,[a,c,d],v[0],p,y),k=this.v(l,[a,c,d],v[1],p,y),W=this.v(h,[a,c,d],v[2],p,y),B=this.v(f,[a,c,d],v[3],p,y);this.idx.push(w,k,W,w,W,B)}sweep(t,l,h,f,v,o={}){const y=o.len??1,M=o.along!==!1,F=!!o.flip,g=o.chamfer??1.3,s=o.uvOff??[0,0];let b=0;for(let m=0;m<t.length-1;m++){const e=t[m],a=t[m+1],c=Math.hypot(a[0]-e[0],a[1]-e[1]);if(c<1e-4)continue;const d=o.edge!==void 0?o.edge:c<g?1:0,u=this.c;for(let p=0;p<=l;p++){const w=p/l,k=Math.min(1,w+.001),W=Math.max(0,w-.001),B=h(w,e[0],e[1]),q=h(w,a[0],a[1]),_=h(W,e[0],e[1]),A=h(k,e[0],e[1]),P=A[0]-_[0],N=A[1]-_[1],n=A[2]-_[2],i=q[0]-B[0],S=q[1]-B[1],z=q[2]-B[2];let C=N*z-n*S,U=n*i-P*z,O=P*S-N*i;const j=Math.hypot(C,U,O)||1,G=(F?-1:1)/j;C*=G,U*=G,O*=G;const Y=w*y,st=M?[Y+s[0],b+s[1]]:[b+s[0],Y+s[1]],Bt=M?[Y+s[0],b+c+s[1]]:[b+c+s[0],Y+s[1]],Ft=o.occ?o.occ(B):f[3],Wt=o.occ?o.occ(q):f[3];this.v(B,o.nrm?o.nrm(w,e[0],e[1]):[C,U,O],o.uv?o.uv(w,e[0],e[1]):st,[f[0],f[1],d,Ft],v),this.v(q,o.nrm?o.nrm(w,a[0],a[1]):[C,U,O],o.uv?o.uv(w,a[0],a[1]):Bt,[f[0],f[1],d,Wt],v)}for(let p=0;p<l;p++){const w=u+p*2;F?this.idx.push(w,w+1,w+2,w+1,w+3,w+2):this.idx.push(w,w+2,w+1,w+1,w+2,w+3)}b+=c}}lathe(t,l,h,f,v,o,y,M={}){const F=t.reduce((g,s)=>Math.max(g,s[0]),0);this.sweep(t,l,(g,s,b)=>{const m=g*Math.PI*2;return[h+Math.sin(m)*s,f+b,v+Math.cos(m)*s]},o,y,{len:Math.PI*2*F,flip:!0,...M})}box(t,l,h,f,v,o,y,M,F="xXyYzZ",g){const s=(b,m,e)=>[b,m,e];F.includes("Z")&&this.quad(s(t,h,o),s(l,h,o),s(l,f,o),s(t,f,o),[[t,h],[l,h],[l,f],[t,f]],y,M,g),F.includes("z")&&this.quad(s(l,h,v),s(t,h,v),s(t,f,v),s(l,f,v),[[l,h],[t,h],[t,f],[l,f]],y,M,g),F.includes("X")&&this.quad(s(l,h,o),s(l,h,v),s(l,f,v),s(l,f,o),[[h,o],[h,v],[f,v],[f,o]],y,M,g),F.includes("x")&&this.quad(s(t,h,v),s(t,h,o),s(t,f,o),s(t,f,v),[[h,v],[h,o],[f,o],[f,v]],y,M,g),F.includes("Y")&&this.quad(s(t,f,o),s(l,f,o),s(l,f,v),s(t,f,v),[[t,o],[l,o],[l,v],[t,v]],y,M,g),F.includes("y")&&this.quad(s(t,h,v),s(l,h,v),s(l,h,o),s(t,h,o),[[t,v],[l,v],[l,o],[t,o]],y,M,g)}build(){const t=new x.BufferGeometry,l=this.c;return t.setAttribute("position",new x.BufferAttribute(this.p.slice(0,l*3),3)),t.setAttribute("normal",new x.BufferAttribute(this.n.slice(0,l*3),3)),t.setAttribute("aUv",new x.BufferAttribute(this.uv.slice(0,l*2),2)),t.setAttribute("aMat",new x.BufferAttribute(this.m.slice(0,l*4),4)),t.setAttribute("aDrw",new x.BufferAttribute(this.d.slice(0,l),1)),t.setIndex(this.idx),t.boundingSphere=new x.Sphere(new x.Vector3(0,170,70),320),t}}const tt=`
attribute float aDrw;
uniform float uOff[10];
uniform float uTime;
varying vec3 vP; varying vec3 vW; varying vec3 vN;
#include <fog_pars_vertex>
float drwOff() { return uOff[int(clamp(aDrw + 0.5, 0., 9.))]; }
`,et=`
uniform vec3 uSun; uniform vec3 uSunCol; uniform vec3 uSky; uniform vec3 uBounce; uniform vec3 uHorizon;
uniform float uTime; uniform float uFill; uniform float uFillSun; uniform vec2 uHaze;
varying vec3 vP; varying vec3 vW; varying vec3 vN;
#include <fog_pars_fragment>
float h21(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
vec2 h22(vec2 p) { float n = h21(p); return vec2(n, h21(p + n + 17.1)); }
float vnoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float fbm(vec2 p) { return 0.5 * vnoise(p) + 0.25 * vnoise(p * 2.03 + 11.7) + 0.125 * vnoise(p * 4.1 + 3.1) + 0.0625 * vnoise(p * 8.3 + 7.9); }
float cell(vec2 p) { vec2 i = floor(p), f = fract(p); float d = 9.;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) { vec2 g = vec2(float(x), float(y)); vec2 o = g + h22(i + g) - f; d = min(d, dot(o, o)); }
  return sqrt(max(d, 1e-6)); }
float satan(float y, float x) { return (abs(x) + abs(y) < 1e-6) ? 0. : atan(y, x); }
vec3 skyAt(vec3 d) { float h = clamp(d.y, -1., 1.); vec3 c = mix(uHorizon, uSky, smoothstep(0., 0.7, h));
  return mix(c, uBounce * 0.55, 1. - smoothstep(-0.5, 0.05, h)); }
// analytic light: sun, sky from above, warm bounce from below and from the sunlit side
vec3 ambientAt(vec3 n) { return uSky * (0.36 + 0.3 * n.y) + uBounce * (0.34 - 0.2 * n.y + 0.1 * n.x); }
// canyon shade (worlds only; materials that define CANYON get analytic box shadows from up to 12 cabinets)
#ifdef CANYON
uniform vec4 uBoxA[12]; uniform vec4 uBoxB[12];   // A: centre x, centre z, cos yaw, sin yaw.  B: half width, half depth, top y, bottom y
uniform vec4 uCandle;                             // the candle on the dresser top: x, z, top y, 1 if there is one
uniform vec4 uGap[3];                             // sheets of sun through the gaps in the shaded wall: x, z of the gap, half width, strength
float canyonShade(vec3 p) {
  float s = 1.;
  for (int i = 0; i < 12; i++) {
    vec4 A = uBoxA[i], B = uBoxB[i];
    vec2 d = p.xz - A.xy, q = vec2(A.z * d.x + A.w * d.y, -A.w * d.x + A.z * d.y), l = vec2(A.z * uSun.x + A.w * uSun.z, -A.w * uSun.x + A.z * uSun.z);
    vec3 o = vec3(q.x, p.y - 0.5 * (B.z + B.w), q.y), h = vec3(B.x, max(0.5 * (B.z - B.w), 0.), B.y), dr = vec3(l.x, uSun.y, l.y);
    vec3 sg = vec3(dr.x < 0. ? -1. : 1., dr.y < 0. ? -1. : 1., dr.z < 0. ? -1. : 1.);
    vec3 inv = sg / max(abs(dr), vec3(1e-4));
    vec3 t1 = (-h - o) * inv, t2 = (h - o) * inv, tn3 = min(t1, t2), tf3 = max(t1, t2);
    float tn = max(max(tn3.x, tn3.y), max(tn3.z, 0.3)), tf = min(min(tf3.x, tf3.y), tf3.z);
    s *= 1. - smoothstep(0., 5., tf - tn) * step(0.5, B.z - B.w);
  }
  // sun through the gaps between the low chests: a sheet of light that runs down-sun from each gap across the river
  vec2 sd = normalize(uSun.xz + vec2(1e-5, 0.));
  for (int i = 0; i < 3; i++) {
    vec2 d = p.xz - uGap[i].xy; float al = -dot(d, sd), ac = abs(d.x * sd.y - d.y * sd.x) + 2.5 * (vnoise(p.xz * 0.11) - 0.5);
    float m = (1. - smoothstep(uGap[i].z * 0.55, uGap[i].z, ac)) * smoothstep(-6., 10., al) * (1. - smoothstep(150., 190., al)) * uGap[i].w;
    s = max(s, m * 0.92);
  }
  // the candle and its pan throw their shadow along the dresser top (and on the key that lies there)
  float hc = p.y - uCandle.z;
  if (uCandle.w > 0.5 && hc > -1. && hc < 50.) {
    vec2 d = p.xz - uCandle.xy, sl = uSun.xz / max(uSun.y, 0.1);
    float k0 = max(-hc, 0.), k1 = max(46. - hc, k0), k = clamp(-dot(d, sl) / max(dot(sl, sl), 1e-3), k0, k1);
    float stem = (1. - smoothstep(2.2, 3.6, length(d + sl * k))) * smoothstep(4.8, 5.6, length(d));
    float pan = (1. - smoothstep(13.2, 15., length(d + sl * max(1.6 - hc, 0.)))) * step(hc, 1.) * smoothstep(13.8, 14.6, length(d));
    s *= 1. - 0.9 * max(stem, pan);
  }
  return s;
}
#else
float canyonShade(vec3 p) { return 1.; }
#endif
`,Nt=tt+`
attribute vec2 aUv; attribute vec4 aMat;
varying vec2 vUv; varying vec4 vMat;
void main() {
  vUv = aUv; vMat = aMat; vP = position;
  vec3 p = position; p.z += drwOff();
  vN = normalize(mat3(modelMatrix) * normal);
  vec4 w = modelMatrix * vec4(p, 1.); vW = w.xyz;
  vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,pt=et+`
#ifdef CANYON
varying vec3 vSunL;      // worlds: the sun in each front's own space, from the vertex shader
#define uSunL vSunL
#else
uniform vec3 uSunL;
#endif
uniform vec3 uWoodA; uniform vec3 uWoodB; uniform vec3 uWoodC; uniform vec3 uCream; uniform vec3 uOak;
varying vec2 vUv; varying vec4 vMat;
void main() {
  float kind = floor(vMat.x + 0.5), seed = vMat.y, edge = vMat.z, occ = vMat.w;
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
  vec3 V = normalize(cameraPosition - vW + vec3(0., 1e-4, 0.));
  if (dot(N, V) < 0.) N = -N;
  vec2 b = vUv; float fw = max(fwidth(vUv.x), fwidth(vUv.y));
  // --- joinery of a drawer front (kind 1): board x is -55..55 from the centre, y 0..26 ---
  float isFront = step(0.5, kind) * step(kind, 1.5), field = 0., band = 0., inlay = 0., ebony = 0.;
  if (isFront > 0.5) {
    vec2 q = vec2(55. - abs(b.x), min(b.y, 26. - b.y)); float e = min(q.x, q.y);
    b.x = abs(b.x);                                    // book-match about the centre line
    band = 1. - smoothstep(2.0, 2.05, e);              // cross-banding border
    float aw = max(fw, 0.02);
    inlay = smoothstep(2.0 - aw, 2.0, e) * (1. - smoothstep(2.6, 2.6 + aw, e));
    ebony = 1. - smoothstep(0.08, 0.08 + aw, abs(abs(e - 2.3) - 0.36));
    field = smoothstep(4.4, 5.6, e);
    occ = max(occ, 0.35 * (1. - smoothstep(0., 1.5, e)));
  }
  float hsh = 0.;
  if (isFront > 0.5 && uSunL.z > 0.05) {
    vec2 k = -uSunL.xy / max(uSunL.z, 0.15);
    vec2 r = vec2(vUv.x - sign(vUv.x) * 30., vUv.y - 13.5);
    for (int j = 0; j < 2; j++) {
      vec2 a = vec2(j == 0 ? -5. : 5., 0.), ba = k * 6., pa = r - a;
      float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-4), 0., 1.);
      hsh = max(hsh, 1. - smoothstep(0.55, 1.25, length(pa - ba * h)));
    }
    vec2 rb = r - k * 5.65 - vec2(0., -0.6);
    float el = abs(length(rb / vec2(6.0, 4.6)) - 1.) * 4.6;
    hsh = max(hsh, (1. - smoothstep(0.45, 1.1, el)) * (1. - smoothstep(-0.2, 0.6, rb.y)));
    hsh *= 0.85;
  }
  float isOak = step(1.5, kind) * step(kind, 2.5), isDark = step(2.5, kind) * step(kind, 3.5), vert = step(4.5, kind) * step(kind, 5.5), isBot = step(5.5, kind);
  vec2 g = band > 0.5 ? b.yx + 31. : b;               // g.x runs along the grain
  g += seed * vec2(37.1, 91.7);
  // --- figure: big cathedral flame, growth rings, burr eyes, pores ---
  float big = fbm(g * vec2(0.035, 0.16));
  float flame = fbm(g * vec2(0.012, 0.07) + 9.);
  float pith = g.y + (big - 0.5) * 9. + (flame - 0.5) * 22. + 3. * sin(g.x * 0.02 + seed * 6.);
  float saw = fract(pith / 0.8);
  float ring = smoothstep(0., 0.75, saw) * (1. - smoothstep(0.86, 1., saw));
  float ringFade = 1. - smoothstep(0.1, 0.4, fw);
  float wide = 0.5 + 0.5 * sin(pith * 0.9 + 4. * big);      // broad bands that survive distance
  float swirlPre = fbm(b * 0.11 + 4. * vec2(fbm(b * 0.05 + seed), fbm(b * 0.05 + 7.)));
  vec2 bw = b * 0.8 + seed * 13.; bw += 1.4 * vec2(fbm(bw * 0.6 + 3.), fbm(bw * 0.6 + 17.));
  float eyes = cell(bw); float eyeRing = 0.5 + 0.5 * sin(eyes * 9. + 22. * swirlPre + 5. * fbm(bw * 1.7));
  float swirl = swirlPre;
  float burr = field * (1. - isOak);
  float tone = mix(0.25 + 0.5 * wide + 0.25 * mix(0.5, ring, ringFade), 0.12 + 0.3 * swirl + 0.42 * smoothstep(0.3, 0.7, fbm(b * 0.05 + seed * 5.)) + 0.12 * (eyeRing - 0.5) * ringFade - 0.22 * (1. - smoothstep(0.03, 0.22, eyes)) * ringFade, burr);
  tone = clamp(tone + (flame - 0.5) * 0.35, 0., 1.);
  float pore = vnoise(g * vec2(0.4, 25.)) * vnoise(g * vec2(1.3, 9.) + 5.);
  float poreFade = 1. - smoothstep(0.012, 0.07, fw);
  vec3 alb = mix(uWoodA, uWoodB, smoothstep(0.05, 0.55, tone)); alb = mix(alb, uWoodC, smoothstep(0.6, 1., tone) * 0.45);
  alb *= vec3(1.0, 0.8, 0.72);                          // red glaze
  alb *= 1. - 0.3 * poreFade * smoothstep(0.18, 0.32, pore);
  alb *= mix(1., 0.82, band * 0.6);
  // oak drawer sides with through-dovetails (board x = metres back from the front, y = height)
  if (isOak > 0.5) {
    float fleck = smoothstep(0.62, 0.8, vnoise(g * vec2(0.5, 3.2) + 70.)) * (1. - smoothstep(0.05, 0.3, fw));
    vec3 oak = uOak * vec3(1., 0.86, 0.72) * (0.86 + 0.24 * (wide - 0.5) + 0.22 * (big - 0.5)) * (1. - 0.25 * poreFade * smoothstep(0.15, 0.3, pore)) * (1. + 0.35 * fleck);
    oak *= 1. - 0.55 * (1. - smoothstep(0.12, 0.3 + fw, abs(b.y - 2.2))) * step(3.3, b.x);            // groove of the bottom board
    oak *= 1. - 0.3 * smoothstep(0.5, 0.9, fbm(vec2(b.x * 0.05, b.y * 1.3) + seed * 30.)) * step(3.3, b.x);  // runner wear streaks
    oak = mix(oak, oak * vec3(0.7, 0.6, 0.5), smoothstep(10., 120., b.x) * 0.6 + 0.25 * big);
    if (b.x > 3.3) {      // the side is joinery, not a blank board: three boards high, each its own tone, dark joints between; a walnut runner let in along it, pegged
      float by = b.y / 8.67, bj2 = abs(fract(by) - 0.5) * 8.67;
      oak *= 0.8 + 0.4 * fract(floor(by) * 0.37 + seed * 5.3);
      oak *= 1. - 0.3 * (0.5 + 0.5 * sin((b.y + 2.5 * big) * 2.4));                                    // the long grain of each board
      oak *= 1. - 0.62 * smoothstep(3.9 - fw, 4.25, bj2);
      float run = 1. - smoothstep(1.3, 1.5 + fw, abs(b.y - 6.4));
      vec3 runC = uWoodB * vec3(1.05, 0.86, 0.76) * (0.7 + 0.4 * wide);
      float pg = length(vec2((fract(b.x / 9.) - 0.5) * 9., b.y - 6.4));
      runC = mix(runC, uOak * 1.25, (1. - smoothstep(0.45, 0.65 + fw, pg)));
      oak = mix(oak, runC, run * 0.85);
      oak *= 1. - 0.55 * (1. - smoothstep(0., 0.3 + fw, abs(b.y - 4.75))) * (1. - run);                // the runner's shadow on the board below
    }
    float ty = fract(b.y / 3.) - 0.5, tx = clamp(b.x / 3.2, 0., 1.);
    float tail = step(abs(ty), 0.17 + 0.14 * tx) * step(b.x, 3.2) * step(0.01, b.x);
    float er = 0.5 + 0.5 * sin(length(vec2(b.x - 1.6, ty * 3.) + 0.3 * big) * 9.);
    alb = mix(oak, uWoodB * (0.75 + 0.3 * er) * vec3(1.08, 0.95, 0.9), tail);
    alb *= 1. - 0.5 * (1. - smoothstep(0.0, 0.12 + fw, abs(abs(ty) - (0.17 + 0.14 * tx)) * 3.)) * step(b.x, 3.2);
    alb *= 1. - 0.35 * (1. - smoothstep(0., 0.15 + fw, abs(b.x - 3.2)));
  }
  alb = mix(alb, uCream * 0.82, inlay); alb = mix(alb, vec3(0.012, 0.009, 0.008), ebony * isFront);
  // --- wear: pale matte arrises, dust on up-facing surfaces, darkening toward gaps ---
  vec3 worn = vec3(0.49, 0.26, 0.09);
  float scr = smoothstep(0.93, 1., vnoise(b * vec2(0.9, 14.) + 40.)) * poreFade;
  alb = mix(alb, worn, clamp(edge * 0.75 + scr * 0.25, 0., 1.));
  float dust = smoothstep(0.55, 0.95, N.y) * (0.45 + 0.4 * fbm(vW.xz * 0.15)) * (1. - 0.85 * isFront);
  alb = mix(alb, vec3(0.42, 0.33, 0.22), dust * 0.55);
  alb = mix(alb, vec3(0.012, 0.008, 0.006), isDark);
  { float th = vW.y + 0.7 * vnoise(vW.xz * 0.35 + vW.y * 0.2);
    alb *= 1. - 0.5 * (1. - smoothstep(1.2, 2.4, th));
    alb = mix(alb, vec3(0.5, 0.42, 0.3), 0.45 * smoothstep(2.1, 2.5, th) * (1. - smoothstep(2.6, 3.4, th))); }
  float gloss = (1. - edge * 0.8) * (1. - dust) * (1. - isDark) * mix(1., 0.55, isOak);
  // the bottom of a drawer (kind 6): pale oak boards run front to back, each its own tone and its own figure, a dark joint
  // between each. Board x = metres back from the lip (0 at the lip, falling inward), y = across. The tone changes AT the
  // joint and is eased across the joint's own width, so no hard edge is left where the joint has faded with distance.
  if (isBot > 0.5) {
    float bq = b.y / 9.2 + seed, bf = fract(bq + 0.5), bj = abs(fract(bq) - 0.5) * 9.2, bi = floor(bq + 0.5), bn = bi + (bf < 0.5 ? -1. : 1.);
    float jFade = 1. - smoothstep(0.2, 0.9, fw), tFade = 1. - smoothstep(0.8, 3., fw);
    float t0 = 0.78 + 0.36 * fract(bi * 0.37 + seed * 3.), t1 = 0.78 + 0.36 * fract(bn * 0.37 + seed * 3.);
    float tb = mix(0.5 * (t0 + t1), t0, smoothstep(0., 0.26 + fw, bj));
    // the figure of a flat-sawn board: long arches about a heart that wanders along it, medullary flecks, open pores
    float gl = b.x * 0.03 + bi * 5.7 + seed * 11.;
    float heart = (bf - 0.5) * 9.2 + 3.2 * (fbm(vec2(gl, bi * 3.1)) - 0.5);
    float sawB = fract((abs(heart) + (b.x + 30. * fbm(vec2(gl * 0.5, bi * 1.7 + 4.))) * 0.114 * (fract(bi * 0.61) < 0.5 ? 1. : -1.)) / 0.8);      // the design's ring: 0.8 m apart, a sawtooth with a sharp dark edge on one side
    float rings = smoothstep(0., 0.75, sawB) * (1. - smoothstep(0.86, 1., sawB));
    float fleck = smoothstep(0.62, 0.8, vnoise(g * vec2(0.5, 3.2) + 70.)) * (1. - smoothstep(0.05, 0.3, fw));
    alb = uOak * vec3(1.02, 0.9, 0.76) * (0.9 + 0.2 * (wide - 0.5) + 0.14 * (big - 0.5)) * mix(0.96, tb, tFade);
    alb *= (1. - 0.22 * ringFade * (0.65 - rings)) * (1. + 0.3 * fleck) * (1. - 0.3 * poreFade * smoothstep(0.15, 0.3, pore));
    alb *= 1. - 0.66 * jFade * (1. - smoothstep(0.07, 0.26 + fw, bj));      // a joint is dark wood, never black, and narrower than a drawer's shadow gap
    if (edge > 0.05 && edge < 0.2) alb *= 1. - 0.42 * jFade * (1. - smoothstep(2.2, 3.6 + fw, abs(abs(b.y) - 30.)));      // the shade a runner lays on the boards beside it
    gloss = 0.22;
    if (edge > 0.2) {      // a runner: a walnut rail pegged in oak, as the runner let into a drawer's side; long grain, a worn arris
      float sec = abs(b.y), lg = mix(0.5, vnoise(vec2(b.x * 0.09 + seed * 40., b.y * 5.)), 1. - smoothstep(0.03, 0.12, fw)), pg = length(vec2((fract(b.x / 9.) - 0.5) * 9., b.y));
      alb = uWoodB * vec3(1.05, 0.86, 0.76) * (0.7 + 0.5 * lg) * (1. - 0.25 * poreFade * smoothstep(0.15, 0.3, pore));
      alb = mix(alb, uOak * 1.25, (1. - smoothstep(0.45, 0.65 + fw, pg)) * jFade);
      float arris = jFade * (1. - smoothstep(0.02, 0.2 + fw, abs(sec - 2.2)));
      alb = mix(alb, worn, 0.7 * arris);
      alb *= 1. - 0.16 * smoothstep(2.6, 3.8, sec);      // a rail's side is a little darker toward the boards: dark wood, never black
      alb = mix(uOak * vec3(1.02, 0.9, 0.76) * 0.864, alb, 1. - smoothstep(1.2, 3.5, fw));      // far off, where a rail is a pixel or two wide, it settles into the boards' tone: no dark thread flickers under a far drawer
      gloss = 0.3 * (1. - 0.8 * arris);      // the worn arris is matte
    }
    // dust in the still air well back from the lip (in the board's own metres, so it rides with its drawer); wet where the water threads off the lip
    float dustB = smoothstep(0.4, 0.8, fbm(b * 0.11 + seed * 9.)) * (1. - smoothstep(-16., -6., b.x)) * tFade;
    alb = mix(alb, vec3(0.42, 0.33, 0.22), 0.26 * dustB); gloss *= 1. - 0.7 * dustB;
    float wet = smoothstep(0., 1., b.x + 0.9 + 1.8 * fbm(vec2(b.y * 0.13 + seed * 7., 3.)) + 4.5 * jFade * pow(vnoise(vec2(b.y * 0.8, seed * 5.)), 3.));      // a narrow band: a drawer a little way out must not go dark all under
    wet *= tFade; alb *= mix(1., 0.68, wet); gloss = mix(gloss, 0.5, wet);
  }
  // the hall behind the keyhole plate is the inside of the carcass: plain pale boards. A slab of sun comes in at the
  // mouth and slants across the floor and the far wall; the plate hangs in it and throws its own shape.
  float hallK = step(vW.z, -0.45) * step(abs(vW.x), 55.3) * step(285.4, vW.y) * step(vW.y, 326.3), slab = 0., deep = 0.;
  if (hallK > 0.5) {
    float c = abs(N.x) > 0.5 ? vW.z : vW.x, bj = abs(fract(c / 6.5) - 0.5) * 6.5, bi = floor(c / 6.5);
    alb = uOak * vec3(1.08, 0.8, 0.52) * (0.72 + 0.3 * wide + 0.22 * (big - 0.5)) * (0.82 + 0.3 * fract(bi * 0.37 + 0.2));
    alb *= 1. - 0.5 * (1. - smoothstep(0.03, 0.14 + fw, bj));
    gloss = 0.1; occ = 0.08 + 0.42 * smoothstep(4., 46., -vW.z); deep = smoothstep(5., 30., -vW.z);
    vec3 Ls = normalize(uSun); float tz = -vW.z / max(Ls.z, 0.08); vec3 E = vW + Ls * tz;
    slab = (1. - smoothstep(53.2, 55., abs(E.x))) * (1. - smoothstep(324., 326., E.y));
    slab *= 1. - (1. - smoothstep(9., 10.6, abs(E.x))) * smoothstep(287.2, 288.8, E.y) * (1. - smoothstep(321.4, 322.8, E.y));
  }
  // --- fibre direction: grain axis turned by the figure, tilted out of the surface ---
  vec3 up = abs(N.y) > 0.9 ? vec3(0., 0., 1.) : vec3(0., 1., 0.);
  vec3 T = normalize(cross(up, N) + vec3(1e-5, 0., 0.)); vec3 B = cross(N, T);
  if (vert + band > 0.5) { vec3 t0 = T; T = B; B = -t0; }
  float turn = mix((big - 0.5) * 0.9 + (ring - 0.5) * 0.25 * ringFade, (swirl - 0.5) * 5. + (fbm(bw * 0.35) - 0.5) * 1.6, burr);
  float tilt = (tone - 0.5) * 0.42 + (flame - 0.5) * 0.3;
  vec3 F = normalize(T * cos(turn) + B * sin(turn) + N * tilt);
  vec3 L = normalize(uSun), H = normalize(L + V + vec3(0., 1e-4, 0.));
  float nl = dot(N, L), lit = smoothstep(-0.05, 0.25, nl) * (1. - occ) * (1. - hsh) * canyonShade(vW);
  lit = mix(lit, smoothstep(-0.05, 0.25, nl) * slab, hallK);
  float fh = dot(F, H), sinFH = sqrt(max(1. - fh * fh, 1e-6));
  float aniso = pow(clamp(sinFH, 1e-4, 1.), 24.) * (0.35 + 0.65 * max(nl, 0.)) * (1. - 0.4 * burr);
  float nh = max(dot(N, H), 0.), nv = max(dot(N, V), 0.);
  float coat = pow(clamp(nh, 1e-4, 1.), 300.) * (0.55 + 0.45 * tone);      // the clear coat's own glint: a narrow warm band, never a white patch
  float fres = 0.04 + 0.96 * pow(clamp(1. - nv, 1e-4, 1.), 5.);
  vec3 amb = ambientAt(N) * (1. - 0.65 * occ);
  // Luminous shade: where the sun does not reach, the wood is lit by the sunlit wall opposite, the sand and the
  // river. Lb points at that second light (the sun's azimuth turned about, low); faces that look down take the
  // river's turquoise with a slow caustic shimmer.
  float shadeK = 1. - lit * smoothstep(0., 0.3, nl + 0.05);
  vec3 Lb = normalize(vec3(-uSun.x, 0.25, -uSun.z) + vec3(1e-4, 0., 0.));
  float nlb = max(dot(N, Lb), 0.), down = smoothstep(0.35, 0.9, -N.y) * (1. - hallK);
  float caus = 1.;
  if (down > 0.01) {      // light thrown up by the river: a slow net of bright lines
    vec2 cq = vW.xz * mix(0.16, 0.3, isBot) + 0.5 * vec2(fbm(vW.xz * 0.07 + uTime * 0.04), fbm(vW.zx * 0.07 - uTime * 0.03));      // under a drawer's boards the net is finer
    float w1 = smoothstep(0.3, 0.62, cell(cq + vec2(uTime * 0.05, -uTime * 0.035))), w2 = smoothstep(0.28, 0.6, cell(cq * 1.37 + 7. - vec2(uTime * 0.04, uTime * 0.045)));
    caus = mix(0.62 + 1.25 * w1 * (0.35 + 0.65 * w2), 0.8 + 0.75 * w1 * (0.35 + 0.65 * w2), isBot);      // and gentler: light on boards, not a mottle
  }
  vec3 bcol = mix(uBounce, (vec3(0.2, 0.26, 0.24) + uBounce * 0.95) * caus, down);
  #ifdef CANYON
  float seaK = max(smoothstep(130., 175., abs(vW.x)) * (1. - smoothstep(650., 720., vW.z)), 1. - smoothstep(40., 110., vW.z));
  // a chest in the open sea has no wall opposite, but the sunlit sawdust bars and its lit neighbours throw warm light up at it from all round: its shade stays red-brown
  bcol = mix(bcol, bcol * vec3(1.1, 0.92, 0.78), seaK * (1. - down)); nlb = mix(nlb, 0.55, seaK);
  #endif
  float sf = smoothstep(0., 0.3, nl), fl = mix(uFill, uFillSun, sf);      // a face that looks at the sun but stands in a drawer's shadow sees the bright sky and river: it keeps the fuller fill
  vec3 fill = bcol * mix(fl, max(fl, 1.3), down) * shadeK * (0.5 + 0.5 * max(nlb, 0.9 * max(nl, 0.)) + 0.45 * down) * (1. - 0.5 * occ * (1. - 0.6 * sf));   // a face turned to the sun but in another's shadow still sees the bright canyon
  // inside the hall the light is what the sun slab throws about: strongest near the lit floor and wall
  if (hallK > 0.5) { float nearSlab = 1. - smoothstep(0., 30., abs(vW.x - 30.) + max(vW.y - 300., 0.) * 0.8); fill = uSunCol * vec3(1., 0.8, 0.55) * (0.1 + 0.2 * nearSlab) * shadeK * mix(1., 0.62, deep); amb *= 0.55 * mix(1., 0.4, deep); }
  vec3 col = alb * (uSunCol * max(nl, 0.) * lit + amb + fill);
  col += uBounce * vec3(1., 0.8, 0.7) * 0.035 * shadeK * (1. - 0.5 * occ) * (1. - hallK);      // a warm floor: the deepest cast shade is red-brown, never black
  col += gloss * lit * uSunCol * (vec3(0.8, 0.4, 0.14) * aniso * 0.3 * (0.5 + tone) + vec3(0.9, 0.62, 0.34) * coat * 0.24);
  // the polish in shade: the same streaming band, lit by the wall opposite
  vec3 Hb = normalize(Lb + V + vec3(0., 1e-4, 0.)); float fhb = dot(F, Hb);
  float anisoB = pow(clamp(sqrt(max(1. - fhb * fhb, 1e-6)), 1e-4, 1.), 14.) * (0.3 + 0.7 * nlb) * (1. - 0.4 * burr);
  col += gloss * shadeK * (1. - 0.6 * occ) * uBounce * uFill * vec3(1., 0.62, 0.3) * anisoB * 0.28 * (0.5 + tone);
  vec3 refl = mix(skyAt(reflect(-V, N)), uBounce * 1.5 + uSky * 0.15, 0.65 * shadeK * (1. - down));
  col += gloss * fres * refl * 0.55 * (1. - 0.7 * occ) * mix(1., min(0.45 + 0.3 * uFill, 1.), shadeK) * (1. - 0.9 * deep);
  if (hallK > 0.5) {      // slow sunlit dust: a few large soft motes of brass and tan drift in the hall, thickest in and beside the sun slab, thinning to nothing in the far corners
    float nearS = 1. - smoothstep(0., 36., abs(vW.x - 30.) + max(vW.y - 300., 0.) * 0.8);
    vec2 sq = (abs(N.z) > 0.5 ? vW.xy : (abs(N.x) > 0.5 ? vW.zy : vW.xz)) * 0.21 + uTime * vec2(0.012, 0.004), si = floor(sq), sf = fract(sq) - 0.5 - 0.3 * (h22(si) - 0.5);
    float sh = h21(si + 3.7), big = 0.6 + 0.8 * fract(sh * 17.3);
    sf += 0.05 * vec2(sin(uTime * 0.21 + sh * 40.), cos(uTime * 0.17 + sh * 23.));
    float mote = (1. - smoothstep(0.015 * big, 0.21 * big, length(sf))) * step(0.92 - 0.42 * nearS, sh);
    col += mix(vec3(0.76, 0.48, 0.07), vec3(0.69, 0.38, 0.12), step(0.5, fract(sh * 7.1))) * mote * (0.15 + 0.85 * nearS) * (0.3 + 0.7 * deep) * (1. - 0.8 * slab) * 0.75;
  }
  gl_FragColor = vec4(col, 1.);
  #ifdef USE_FOG
  // haze on the wood goes toward the sky's pale butter, never grey, and never takes more than half: a far chest is two tones paler and red-brown beneath
  float hzF = min(1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth), 0.5) * uHaze.y;
  gl_FragColor.rgb = mix(gl_FragColor.rgb, mix(fogColor, vec3(0.89, 0.77, 0.55), uHaze.x), hzF);
  #endif
}`,rt=(r,t)=>{const l=J(t,0,1)*(r.length-1),h=Math.min(r.length-2,Math.floor(l));return Z(r[h],r[h+1],l-h)};async function qt(r,t){const l=async()=>{t&&t.yield&&await t.yield()},h=new ft,f=9,v=()=>r.range(0,1),o=[[4.6,0],[6,.5],[6.9,2],[7,3.4],[6.5,5],[5.3,6.1],[5.3,6.5],[6,6.8],[6,7.4],[5.1,7.7],[5.1,8.1],[6.5,8.5],[6.5,9]];for(const e of[-55,55])for(const a of[-9,-61])h.lathe(o,20,e,0,a,[0,v(),0,0],f,{occ:c=>c[1]>8?.6:c[1]<1.2?.45:0});const y=[[0,7],[.7,7],[1.1,6.3],[1.1,5.5],[2.3,4.3],[2.3,3.5],[3.5,2.5],[3.7,.7],[3.2,0],[-2,0]],M=v();h.sweep(y,2,(e,a,c)=>[Z(-V-a,V+a,e),9+c,a],[0,M,0,0],f,{len:2*V});for(const e of[-1,1])h.sweep(y,2,(a,c,d)=>[e*(V+c),9+d,Z(c,-R,a)],[0,v(),0,0],f,{len:R});h.box(-V,V,9,9.01,-R,0,[0,M,0,.8],f,"y"),await l();for(const e of[-1,1]){const a=e*V,c=e>0?"X":"x",d=[5,v(),0,0];h.box(e>0?a-1:a,e>0?a:a+1,16,K,-R,-1,d,f,c);const u=e>0?[a,a+.9]:[a-.9,a];for(const[w,k]of[[-R,-62],[-12,-1]])h.box(u[0],u[1],16,K,w,k,[5,v(),0,0],f,c+"zZ");for(const w of[16,114,212,316])h.box(u[0],u[1],w,w+10,-62,-12,[0,v(),0,0],f,c+"yY");const p=[[5.2,0],[5.2,3],[4.4,3.6],[4.4,4.4],[4.9,4.8],[4.9,6.4],[4,7.4],[3.7,150],[4,302],[4.9,303.2],[4.9,304.8],[4.3,305.4],[4.3,306.4],[5.2,307],[5.2,310]];h.lathe(p,14,e*60,16,-1.5,[5,v(),0,0],f,{along:!1,len:1}),h.box(e>0?D:-V,e>0?V:-D,16,K,-2,-1.99,[5,v(),0,.3],f,"Z"),await l()}for(let e=0;e<6;e++)h.box(-V+e*21.67,-V+(e+1)*21.67,9,nt-6,-R,-R+.01,[5,v(),0,.15],f,"z");await l();for(let e=0;e<=T;e++){const a=mt+dt*e;e<T&&h.box(-D,D,a,a+Ct,-3,-.5,[0,v(),0,.75],f,"Z")}{const e=I(T-1),a=-46,c=[0,v(),0,0],d=p=>J(.5+-p[2]/22,0,1),u=[[-D,e],[-D,K],[D,K],[D,e]];h.sweep(u,4,(p,w,k)=>[w,k,Z(-.5,a,p)],c,f,{len:46,along:!1,occ:d,edge:0}),h.box(-D,D,e,K,a,a+.01,[3,0,0,1],f,"Z"),h.box(-D,D,e-.01,e,a,-.5,[3,0,0,1],f,"Y")}await l(),h.box(-V,V,K,334,-R,.6,[0,v(),0,0],f,"xXZ"),h.box(-D,D,K,K+.01,-46,.6,[3,0,0,1],f,"y");const F=[[0,0],[1.3,0],[1.3,1.3],[2.5,2.5],[2.5,4.3],[4.1,5.5],[4.1,7.5],[5.8,8.9],[5.8,11.4],[5.2,12],[-4,12]];h.sweep(F,2,(e,a,c)=>[Z(-V-a,V+a,e),334+c,.6+a],[0,v(),0,0],f,{len:2*V});for(const e of[-1,1])h.sweep(F,2,(a,c,d)=>[e*(V+c),334+d,Z(.6+c,-R,a)],[0,v(),0,0],f,{len:R});h.box(-V-4,V+4,nt-.01,nt,-R,-3,[0,v(),0,0],f,"Y"),await l();const g=[0,v(),.25,0];for(let e=-63;e<=61.01;e+=4)h.box(e,e+2,331.6,334,.6,2.4,g,f,"xXyZ");for(const e of[-1,1])for(let a=-3;a>=-69;a-=4)h.box(e>0?V:V*e-1.8,e>0?V+1.8:-V,331.6,334,a-2,a,g,f,"zZy"+(e>0?"X":"x"));await l();const s=[-55,-54.5,-50.6,-49.4,-44,-38,-32,-26,-20,-14,-8,-4.6,-3.6,0,3.6,4.6,8,14,20,26,32,38,44,49.4,50.6,54.5,55],b=[[-3,0],[-.5,0],[0,.5],[0,4.4],[.9,5.6],[.9,20.4],[0,21.6],[0,25.5],[-.5,26],[-3,26],[-3,24.6]];for(let e=0;e<T;e++){const a=L(e),c=I(e),d=c-Pt,u=v(),p=(w,k,W)=>{const B=rt(s,w),q=D-Math.abs(B);let _=k>0?k*J((q-4.4)/1.2,0,1):k;k>=-.5&&(_-=Math.max(0,.5-q));let A=d+W;return W>25.4&&(A-=1.5*(1-E(3.6,4.6,Math.abs(B)))),[B,A,a+X(B)+_]};h.sweep(b,s.length-1,p,[1,u,0,0],e,{uv:(w,k,W)=>[rt(s,w),W],chamfer:.9});for(const w of[-1,1]){const k=w*54.5,W=w*52.5,B=a-.5,q=v();h.quad([w*D,d,a],[w*D,d,a-3],[w*D,c,a-3],[w*D,c,a],[[0,0],[3,0],[3,26],[0,26]],[5,u,.5,0],e),h.quad([k,d,B-2.5],[k,d,-1],[k,c,-1],[k,c,B-2.5],[[0,0],[B-1.5,0],[B-1.5,26],[0,26]],[2,q,0,0],e),h.quad([k,c,B-2.5],[k,c,-1],[W,c,-1],[W,c,B-2.5],[[8,0],[B+6.5,0],[B+6.5,2],[8,2]],[2,q,.35,0],e),h.quad([W,c-1.6,B-2.5],[W,c-1.6,-1],[W,c,-1],[W,c,B-2.5],[[8,3],[B+6.5,3],[B+6.5,4.6],[8,3]],[2,q,0,.3],e)}h.quad([-54.5,d,-1],[54.5,d,-1],[54.5,d,a-.5],[-54.5,d,a-.5],[[-.5-a,-54.5],[-.5-a,54.5],[0,54.5],[0,-54.5]],[6,v(),0,.8],e),await l()}const m=h.build();return await l(),m}const ot=[],Ut=["#3B2417","#8A5A32","#D9A662","#F2E3C4","#5E8F5A","#4FB7C4","#E2B84C"],bt=new x.Quaternion,_t=r=>{const t=J(1.6*r,-1,1);return 1.5*t-.5*t*t*t};async function Et(r,t={}){const l=r.rng.fork?r.rng.fork("tallboy"):r.rng,h=t.palette&&t.palette.length>=7?t.palette:Ut,f=h.map(i=>new x.Color(i)),v=J(t.detail??r.quality?.detail??1,.6,1),o=(t.sunDir?t.sunDir.clone():new x.Vector3(-.83,.41,.39)).normalize(),y={uSun:{value:o},uSunCol:{value:new x.Color(t.sunColor??"#FFD9A0").multiplyScalar(2.3)},uSky:{value:new x.Color(t.skyColor??"#9DB9C6").multiplyScalar(.85)},uHorizon:{value:new x.Color(h[3]).multiplyScalar(.95)},uBounce:{value:new x.Color(t.bounceColor??h[2]).multiplyScalar(.5)},uSunL:{value:o.clone()},uTime:{value:0},uProg:{value:0},uOff:{value:new Array(10).fill(0)},uFill:{value:t.fill??1.7},uFillSun:{value:t.fillSun??t.fill??1.7},uHaze:{value:new x.Vector2(t.hazeWarm??0,t.hazeK??1)}},M=new x.Group;M.name="tallboy";const F=(i,S,z={},C={})=>new x.ShaderMaterial({uniforms:{...x.UniformsUtils.clone(x.UniformsLib.fog),...y,...z},vertexShader:i,fragmentShader:S,fog:!0,...C}),g=(i,S,z=0)=>{const C=new x.Mesh(i,S);return C.frustumCulled=!1,C.renderOrder=z,M.add(C),C},s=[];for(let i=0;i<T;i++)s.push({a:l.range(.5,1.5),p:l.range(14,26),f:l.range(0,1)});const b={},m=(i,S)=>i>=T?0:s[i].a*_t(Math.sin(((i in b?b[i]:S)/s[i].p+s[i].f)*Math.PI*2)),e={},a=[],c={ctx:r,rng:l,pal:f,palHex:h,detail:v,U:y,group:M,mat:F,add:g,anchors:e,updaters:a,drawerOffset:m,sun:o,ribbon:t.ribbon,moths:t.moths,flocks:t.flocks},d=f[0].clone(),u=f[1].clone(),p=f[0].clone().lerp(f[1],.45);p.r*=1.12,p.b*=.85;const w=l.range(-.012,.012);for(const i of[d,p,u])i.offsetHSL(w,0,0);const k=F(Nt,pt,{uWoodA:{value:d.multiplyScalar(.8)},uWoodB:{value:p.multiplyScalar(.85)},uWoodC:{value:u.multiplyScalar(.72)},uCream:{value:f[3]},uOak:{value:f[2].clone().lerp(f[3],.5).multiplyScalar(.44)}},{side:x.DoubleSide});await r.yield?.(),g(await qt(l.fork?l.fork("wood"):l,r),k),await r.yield?.();for(const i of ot)await i(c),await r.yield?.();e.lips=[],e.meadows=[];for(let i=0;i<T;i++)e.lips.push({position:new x.Vector3(0,I(i),L(i)+$),drawer:i}),e.meadows.push({center:new x.Vector3(0,I(i)-it,i===T-1?L(i)*.5:L(i)-9),halfWidth:52,zNear:L(i)-3,zFar:i===T-1?0:L(i+1)+$+1,y:I(i)-it,drawer:i});const W=at,B=x.MathUtils.degToRad(16);e.portalSeat={position:new x.Vector3(0,W,H),normal:new x.Vector3(0,Math.sin(B),Math.cos(B)),radius:7,pitch:B};const q=[[0,20,640],[0,16,420],[8,14,300],[18,22,262]];for(let i=0;i<T;i++)q.push([i<7?20:20-(i-6)*9,I(i)+9,L(i)+$+5.1]);q.push([0,W+60*Math.sin(B),H+60*Math.cos(B)],[0,W,H]),e.flyThrough=q.map(i=>new x.Vector3(i[0],i[1],i[2])),e.viewpoints={river:new x.Vector3(0,20,640),bend:new x.Vector3(-120,40,520),climb:new x.Vector3(20,I(3)+9,L(3)+16),top:new x.Vector3(0,W+16.5,61)},e.cascadeFoot=new x.Vector3(0,0,L(0)+$+6);let _=0;const A=t.focus||null,P=typeof t.prog=="number"?t.prog:null,N={hall:[0,300,30,26],handle:[30,I(3)-13,L(3)+8,12],mid:[0,I(4)-8,L(4),42],base:[0,24,205,50],top:[0,292,40,44],stag:[10.5,286.5,39,5],foot:[0,40,215,34]}[A];return{object:M,radius:N?N[3]:190,height:N?N[3]:nt,center:N?new x.Vector3(N[0],N[1],N[2]):new x.Vector3(0,165,70),anchors:e,ground:!0,groundY:0,drawerOffset:m,uniforms:y,setProgress(i){_=J(i,0,1)},breatheBy(i,S){b[i]=S},update(i,S,z){y.uTime.value=S,y.uProg.value=P!==null?P:_;for(let C=0;C<T;C++)y.uOff.value[C]=m(C,S);M.getWorldQuaternion(bt).invert(),y.uSunL.value.copy(y.uSun.value).applyQuaternion(bt);for(const C of a)C(i,S,z,_)},dispose(){}}}const Tt=tt+`
attribute vec2 aUv; attribute vec4 aMat;
varying vec2 vUv; varying vec4 vMat;
void main() {
  vUv = aUv; vMat = aMat; vec3 p = position; vec3 n = normal;
  if (aMat.x > 1.5 && aMat.x < 2.5) {                  // a bail: swings about its posts (aUv = pivot y, z)
    float ph = aMat.y * 6.2831;
    float a = 0.085 * sin(uTime * 0.9 + ph) + 0.05 * sin(uTime * 2.3 + ph * 1.7) * (0.5 + 0.5 * sin(uTime * 0.21 + ph));
    a += 0.04 * max(0., sin(uTime * 0.9 + ph + 1.2));     // knocks back a little further than it comes forward
    float c = cos(a), s = sin(a); vec2 r = p.yz - aUv;
    p.yz = aUv + vec2(c * r.x - s * r.y, s * r.x + c * r.y);
    n.yz = vec2(c * n.y - s * n.z, s * n.y + c * n.z);
  }
  vP = position; p.z += drwOff();
  vN = normalize(mat3(modelMatrix) * n);
  vec4 w = modelMatrix * vec4(p, 1.); vW = w.xyz;
  vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,wt=et+`
uniform vec3 uBrass;
varying vec2 vUv; varying vec4 vMat;
void main() {
  float kind = floor(vMat.x + 0.5);
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
  vec3 V = normalize(cameraPosition - vW + vec3(0., 1e-4, 0.));
  if (dot(N, V) < 0.) N = -N;
  float fw = max(fwidth(vUv.x), fwidth(vUv.y)) + 0.01;
  float cut = 0., hole = 0.;
  if (kind > 0.5 && kind < 1.5) {                      // the big plate: uv in metres about the keyhole head
    vec2 q = vUv; float r = length(q);
    vec2 e = vec2(10., 17.) - abs(q - vec2(0., -1.));  // distance to the plate's edge
    float ed = min(e.x, e.y);
    cut = 1. - smoothstep(0.06, 0.06 + fw, abs(ed - 1.1)); cut = max(cut, 1. - smoothstep(0.04, 0.04 + fw, abs(ed - 1.5)));
    cut = max(cut, (1. - smoothstep(0.05, 0.05 + fw, abs(r - 8.4))) );
    float a = satan(q.y, q.x);
    float rays = smoothstep(0.75, 0.95, abs(sin(a * 18.))) * smoothstep(8.6, 8.9, r) * (1. - smoothstep(9.3, 9.6, r));
    // scrolled acanthus: spirals in the four spandrels
    vec2 s = abs(q - vec2(0., -1.)) - vec2(5.4, 11.6); float sr = length(s);
    float sa = satan(s.y, s.x);
    float spiral = 1. - smoothstep(0.07, 0.07 + fw, abs(fract(sr * 0.55 - sa * 0.3183 * 0.5) - 0.5) * 1.2);
    cut = max(cut, max(rays, spiral * (1. - smoothstep(3.0, 3.4, sr))) * step(1.7, ed));
    N = normalize(N + 0.3 * vec3(fbm(q * 0.45) - 0.5, fbm(q * 0.45 + 13.) - 0.5, 0.) + 0.1 * vec3(vnoise(q * 3.) - 0.5, vnoise(q * 3. + 7.) - 0.5, 0.));
  } else if (kind > 2.5 && kind < 3.5) {               // escutcheon: uv in metres, keyhole drawn dark
    vec2 q = vUv; float head = length(q - vec2(0., 0.35)) - 0.42;
    float slot = max(abs(q.x) - (0.16 + 0.1 * (0.3 - q.y)), max(q.y - 0.35, -0.75 - q.y));
    hole = 1. - smoothstep(0., fw, min(head, slot));
    cut = (1. - smoothstep(0.03, 0.03 + fw, abs(length(q) - 1.45))) ;
  } else if (kind > 3.5 && kind < 4.5) {               // domed screw head with its slot
    hole = 0.85 * (1. - smoothstep(0.1, 0.1 + fw, abs(vUv.x * 0.8 + vUv.y * 0.6)));
  }
  vec3 L = normalize(uSun), H = normalize(L + V + vec3(0., 1e-4, 0.)), R = reflect(-V, N);
  float nl = dot(N, L), nh = max(dot(N, H), 0.), nv = max(dot(N, V), 0.);
  float tarn = fbm(vP.xy * 0.35 + vP.z * 0.2) * 0.5 + fbm(vP.xy * 2.1) * 0.25;
  vec3 base = uBrass * vec3(1., 0.86, 0.62) * (0.5 + 0.3 * tarn);
  // two-tone matcap: the metal mirrors a warm ground below and a pale sky above
  float m = smoothstep(-0.25, 0.1, R.y) - 0.45 * smoothstep(0.12, 0.5, R.y) + 0.35 * smoothstep(0.6, 0.95, R.y);
  float cs = canyonShade(vW);                          // brass in the canyon's shade is dull gold, lit by the wall opposite
  vec3 warm = (uBounce + vec3(dot(uBounce, vec3(0.333)))) * 0.5 * uFill * (1. - cs);
  vec3 env = mix(uBounce * 0.22 + warm * 0.6, skyAt(R) * 0.9 + uHorizon * 0.3, clamp(m, 0., 1.));
  float fres = 0.55 + 0.45 * pow(clamp(1. - nv, 1e-4, 1.), 4.);
  vec3 col = base * (uSunCol * (0.35 * max(nl, 0.)) * cs + ambientAt(N) * 0.3 + warm) + base * env * fres * 1.25;
  float glint = pow(clamp(nh, 1e-4, 1.), 140.) * 5.5 + pow(clamp(nh, 1e-4, 1.), 22.) * 0.7;
  col += base * uSunCol * glint * smoothstep(-0.05, 0.2, nl) * cs;
  col *= 1. - 0.72 * cut; col = mix(col, vec3(0.006, 0.005, 0.004), hole);
  col *= 1. - 0.6 * vMat.w;
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,ut=30,gt=13,at=306,H=3.2,xt=(r,t)=>[t*ut,I(r)-12.5,L(r)+X(ut)+.9],Vt=r=>[gt,I(r)-8.5,L(r)+X(gt)+.9];ot.push(async r=>{const{rng:t,pal:l,mat:h,add:f,anchors:v}=r,o=new ft,y=(u,p,w,k,W,B,q,_={})=>o.sweep(u,p,(A,P,N)=>{const n=A*Math.PI*2,i=P*(_.scallop&&P>2.4?1+.07*Math.cos(n*8):1);return[w+Math.cos(n)*i,k+Math.sin(n)*i*(_.sy??1),W+N]},B,q,{edge:0,uv:(A,P)=>[Math.cos(A*Math.PI*2)*P,Math.sin(A*Math.PI*2)*P*(_.sy??1)],..._}),M=[[3,0],[3,.25],[2.6,.6],[2.2,.6],[2,.42],[1.5,.42],[1.2,.95],[.78,1.15],[.78,4.1],[1.1,4.35],[1.1,5.65],[.72,5.95],[0,6.05]],F=[];for(let u=0;u<=10;u++){const p=u/10*Math.PI*2;F.push([Math.cos(p),Math.sin(p)])}const g=[[-5,0],[-5.95,-.55],[-6.2,-1.8],[-5.4,-3.05],[-3.7,-4.3],[-1.9,-4.95],[0,-5.15]],s=g.concat(g.slice(0,-1).reverse().map(u=>[-u[0],u[1]]));v.handles=[],v.keyholes=[];for(let u=0;u<T;u++){for(const W of[-1,1]){const[B,q,_]=xt(u,W);for(const n of[-5,5])y(M,16,B+n,q,_+X(B+n)-X(B),[0,0,0,0],u,{scallop:!0});const A=_+5-.35,P=new x.CatmullRomCurve3(s.map(n=>new x.Vector3(B+n[0],q+n[1],A)),!1,"centripetal"),N=n=>{const i=P.getPoint(n),S=P.getTangent(n),z=1-Math.abs(n-.5)*2,C=.44+.34*E(.1,.75,z)+.16*E(.9,.96,z)+.2*(1-E(0,.05,z));return{c:i,g:S,r:C}};o.sweep(F,28,(n,i,S)=>{const z=N(n);return[z.c.x-z.g.y*i*z.r,z.c.y+z.g.x*i*z.r,z.c.z+S*z.r]},[2,t(),0,0],u,{edge:0,uv:()=>[q,A],nrm:(n,i,S)=>{const z=N(n);return[-z.g.y*i,z.g.x*i,S]}}),v.handles.push({position:new x.Vector3(B,q-2.5,A),drawer:u,side:W}),await r.ctx.yield?.()}const[p,w,k]=Vt(u);y([[1.9,0],[1.9,.22],[1.55,.5],[0,.56]],20,p,w,k,[3,0,0,0],u,{sy:1.3}),v.keyholes.push(new x.Vector3(p,w-.2,k+.6)),await r.ctx.yield?.()}await r.ctx.yield?.();const b=[];for(let u=0;u<=120;u++)b.push(-Math.PI/2+u/120*Math.PI*2);for(const u of[.19,.367,.5075,Math.atan2(10,18)])b.push(-Math.PI/2+u,-Math.PI/2+Math.PI*2-u);b.push(Math.atan2(16,10),Math.PI-Math.atan2(16,10),Math.PI+Math.atan2(18,10)),b.sort((u,p)=>u-p);const m=u=>{let p=u+Math.PI/2;p>Math.PI&&(p-=Math.PI*2);const w=Math.abs(p),k=w<1.2?Math.min(13.5/Math.cos(w),2.6/Math.max(Math.sin(w),.001)):0;return Math.max(7.25,k)},e=u=>Math.min(10/Math.max(Math.abs(Math.cos(u)),.001),(Math.sin(u)>0?16:18)/Math.max(Math.abs(Math.sin(u)),.001)),a=(u,p,w)=>{const k=rt(b,u),W=p<5?m(k)+p:e(k)-(p-10);return[Math.cos(k)*W,at+Math.sin(k)*W,w]};o.sweep([[0,H-1.5],[0,H-.2],[.3,H],[10.9,H],[10,H-.5],[10,H-1.1]],b.length-1,a,[1,0,0,0],9,{edge:0,uv:(u,p,w)=>{const k=a(u,p,w);return[k[0],k[1]-at]}});for(const u of[-1,1]){for(const p of[12.6,-14.6])y([[1.15,0],[1.05,.4],[.62,.7],[0,.78]],14,u*7.6,at+p,H,[4,0,0,0],9);o.box(u*6-.7,u*6+.7,at+15.5,K,H-1,H-.4,[0,0,0,.2],9,"xXZ")}await r.ctx.yield?.();const c=h(Tt,wt,{uBrass:{value:l[6].clone()}},{side:x.DoubleSide}),d=o.build();await r.ctx.yield?.(),f(d,c)});const lt=(r,t)=>L(r)-3+X(t),yt=r=>r===T-1?L(r)-3:14.1,Mt=r=>r===T-1?{cz:17,rx:15,rz:9}:{cz:8.8,rx:12,rz:5};function ct(r,t,l){const h=Mt(r),f=(Math.hypot(t/h.rx,(l-h.cz)/h.rz)-1)*Math.min(h.rx,h.rz),v=Math.max(Math.abs(t)-2.6,l-h.cz,-1-l);return Math.min(f,v)}function Q(r,t,l){const h=.4*Math.sin(t*.13+r*1.7)*Math.cos(l*.21+r*2.3)+.22*Math.sin(t*.31+l*.17+r),f=ct(r,t,l);return I(r)-it+h*E(0,3,f)*E(0,2.5,l)-.45*(1-E(-1.5,1.2,f))}const Dt=tt+`
attribute vec2 aUv; attribute vec4 aMat;
varying vec2 vUv; varying vec4 vMat;
void main() {
  vUv = aUv; vMat = aMat; vP = position; vec3 p = position; p.z += drwOff();
  vN = normalize(mat3(modelMatrix) * normal);
  vec4 w = modelMatrix * vec4(p, 1.); vW = w.xyz;
  vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Lt=et+`
uniform vec3 uGreen; uniform vec3 uGold; uniform vec3 uWater; uniform vec3 uCream;
varying vec2 vUv; varying vec4 vMat;   // vUv = (x, zRel); vMat = (pool cz, rx, rz, depth of the visible strip)
void main() {
  vec2 q = vUv; float cz = vMat.x, rx = vMat.y, rz = vMat.z;
  float e = (length(vec2(q.x / max(rx, 1.), (q.y - cz) / max(rz, 1.))) - 1.) * min(rx, rz);   // the radii are 12 or 15 and 5 or 9 (poolOf): the guard changes nothing
  float ch = max(abs(q.x) - 2.6, max(q.y - cz, -1. - q.y));
  float d = min(e, ch) + (fbm(q * 0.5) - 0.5) * 1.6;
  vec3 V = normalize(cameraPosition - vW + vec3(0., 1e-4, 0.)), L = normalize(uSun);
  float fw = max(fwidth(q.x), fwidth(q.y));
  float dist = length(cameraPosition - vW);
  // grass: mown-by-wind bands, drifts of colour, flowers resolved near and tinted far
  float wind = fbm(q * 0.09 + vec2(uTime * 0.22, uTime * 0.05));
  float gust = smoothstep(0.35, 0.75, fbm(q * vec2(0.05, 0.16) + vec2(uTime * 0.35, 0.)));
  float patchy = fbm(q * 0.21 + 3.);
  float blades = vnoise(q * vec2(7., 1.6) + wind * 2.) * (1. - smoothstep(0.03, 0.2, fw));
  vec3 grass = mix(uGreen * 0.62, mix(uGreen, uGold, 0.55) * 1.05, patchy * 0.7 + 0.3 * gust);
  grass *= 0.8 + 0.4 * blades;
  vec2 fc = q * 1.1; vec2 fi = floor(fc); vec2 fo = fract(fc) - 0.5 - (h22(fi) - 0.5) * 0.6;
  float fl = h21(fi + 7.3), drift = smoothstep(0.42, 0.7, fbm(q * 0.12 + 20.));
  float dot_ = (1. - smoothstep(0.1, 0.16 + fw, length(fo))) * step(fl, 0.5 * drift + 0.06);
  float kindF = h21(fi + 2.1);
  vec3 fcol = kindF < 0.5 ? uCream * 0.8 : (kindF < 0.8 ? vec3(0.8, 0.58, 0.06) : vec3(0.16, 0.26, 0.7));
  float near = 1. - smoothstep(0.1, 0.45, fw);
  grass = mix(grass, fcol, dot_ * near * 0.9);
  grass = mix(grass, mix(grass, uCream * 0.8 + vec3(0.1, 0.08, 0.), 0.3), drift * (1. - near));
  // bank: wet sand and reed shadow round the water
  float bank = 1. - smoothstep(0., 1.3, d);
  vec3 ground = mix(grass, vec3(0.34, 0.27, 0.16) * (0.7 + 0.5 * patchy), bank * 0.8);
  ground = mix(ground, uGreen * 0.3, smoothstep(0.6, 1.3, d) * (1. - smoothstep(1.3, 2.4, d)) * 0.6);
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
  float nl = max(dot(N, L), 0.);
  float back = pow(clamp(dot(-V, L) * 0.5 + 0.5, 1e-4, 1.), 3.);
  float occ = smoothstep(vMat.w - 2.5, vMat.w + 1.5, q.y) * 0.85 + 0.35 * (1. - smoothstep(0., 0.8, q.y));
  vec3 col = ground * (uSunCol * (nl * 0.95 + 0.25 * back) * (1. - occ) + ambientAt(N) * (1. - 0.6 * occ));
  // water
  if (d < 0.) {
    float depth = clamp(-d / 3.5, 0., 1.);
    vec2 src = vec2(0., min(vMat.w - 3.4, cz + 1.6));          // where the fall from above lands
    float rr = length(q - src);
    float rings = sin(rr * 2.6 - uTime * 5.5) * exp(-rr * 0.16) * step(vMat.w, 20.);
    vec2 flow = q + vec2(0., uTime * 0.9 * (1. - smoothstep(0., cz, q.y)));
    float rip = fbm(flow * 0.9 + vec2(uTime * 0.25, 0.)) - 0.5 + 0.35 * rings;
    vec3 Nw = normalize(vec3(rip * 0.5, 1., (fbm(flow * 0.9 + 9.) - 0.5) * 0.5 + 0.2 * rings));
    float fres = 0.04 + 0.96 * pow(clamp(1. - dot(Nw, V), 1e-4, 1.), 5.);
    vec3 body = mix(uWater * 0.75 + uCream * 0.12, uWater * 0.28, depth);
    vec3 wcol = body * (uSunCol * 0.45 * (1. - occ) + ambientAt(vec3(0., 1., 0.)));
    wcol = mix(wcol, skyAt(reflect(-V, Nw)) * (1. - 0.5 * occ), fres * 0.85);
    float sp = pow(clamp(dot(Nw, normalize(L + V + vec3(0., 1e-4, 0.))), 1e-4, 1.), 240.);
    wcol += uSunCol * sp * 2.2 * (1. - occ);
    float foam = smoothstep(0.55, 0.9, fbm(flow * 1.6 + uTime * 0.4)) * exp(-rr * 0.22) * step(vMat.w, 20.) + (1. - smoothstep(0., 0.35, -d)) * 0.35;
    wcol = mix(wcol, vec3(0.85, 0.92, 0.9) * (0.5 + 0.5 * (1. - occ)), clamp(foam, 0., 1.));
    col = mix(col, wcol, smoothstep(0., 0.12 + fw, -d));
  }
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,Ot=`
attribute vec3 iPos; attribute vec4 iDat; attribute float iDrw; attribute vec2 uv2;
uniform float uOff[10]; uniform float uTime;
varying vec2 vUv; varying vec4 vDat; varying vec3 vW; varying float vQ;
#include <fog_pars_vertex>
void main() {
  float w = iDat.x, h = iDat.y, hang = step(h, 0.), seed = iDat.w;
  float a = iDat.z + position.z * 1.5708 + position.z * seed;   // position.z = quad index (0 or 1)
  vec3 p = vec3(cos(a), 0., sin(a)) * position.x * w * (1. - hang * position.z);
  p.y = uv2.y * h;
  float t = uTime, k = uv2.y * uv2.y;
  vec2 gust = vec2(sin(t * 1.1 + iPos.x * 0.11 + seed * 6.) + 0.6 * sin(t * 2.3 + iPos.x * 0.23 + iPos.z * 0.19), 0.6 * cos(t * 0.9 + iPos.x * 0.07 + seed * 9.));
  p.xz += gust * k * abs(h) * mix(0.16, 0.07, hang) + vec2(0.25, 0.) * k * abs(h) * (1. - hang);
  p.z += hang * k * 0.5;
  vec3 wp = iPos + p; wp.z += uOff[int(clamp(iDrw + 0.5, 0., 9.))];
  vUv = uv2; vDat = iDat; vQ = position.z;
  vec4 wpos = modelMatrix * vec4(wp, 1.); vW = wpos.xyz;
  vec4 mvPosition = viewMatrix * wpos; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,It=`
uniform vec3 uSun; uniform vec3 uSunCol; uniform vec3 uSky; uniform vec3 uBounce;
uniform vec3 uGreen; uniform vec3 uGold; uniform vec3 uCream;
varying vec2 vUv; varying vec4 vDat; varying vec3 vW; varying float vQ;
#include <fog_pars_fragment>
float h11(float p) { return fract(sin(p * 127.1 + 3.7) * 43758.5453); }
void main() {
  float seed = vDat.w, hang = step(vDat.y, 0.), kind = fract(seed * 7.31);
  float nb = floor(3. + 4. * fract(seed * 3.7)); float u = vUv.x * nb, id = floor(u) + vQ * 17. + seed * 91.;
  float bx = abs(fract(u) - 0.5) * 2., top = 0.5 + 0.5 * h11(id), v = vUv.y;
  float lean = (h11(id + 5.) - 0.5) * 0.8 * v;
  float blade = step(abs(fract(u + lean) - 0.5) * 2., (1. - v / top) * 0.75 + 0.04) * step(v, top);
  // hanging strands carry little leaves; standing tufts may carry a flower head on each blade
  // ivy: a thin wavering stem with pointed leaves on alternate sides, each its own size and green, some missing
  float sx = fract(u + 0.16 * sin(v * 4.3 + id * 1.7) + 0.05 * sin(v * 11. + id)) - 0.5, slen = 0.35 + 0.65 * top;
  float lc = v * (8. + 5. * h11(id + 3.)) + h11(id + 1.), li = floor(lc), lf = fract(lc), lside = mod(li, 2.) * 2. - 1.;
  float lsz = (0.7 + 0.5 * h11(id * 3.1 + li * 7.7)) * step(0.1, h11(li * 1.3 + id * 5.)) * (1. - 0.4 * smoothstep(0.6, 1., v / slen));
  float lwid = 0.4 * lsz * sqrt(max(1. - (2. * lf - 1.) * (2. * lf - 1.), 1e-6)) * (1.2 - 0.7 * lf);
  float leaf = hang * max(step(abs(sx), 0.055), step(abs(sx - lside * 0.2 * lsz), lwid)) * step(v, slen);
  float ltone = 0.55 + 0.9 * h11(id * 3.1 + li * 2.3);
  // the garland's body: clumps of leaves that lie close under the lip and thin out downward, so it is a mass of green even seen edge-on
  vec2 bc = vec2(vUv.x * 3. + 0.37 * vQ, v * 9.), bi = floor(bc); float bush = hang * step(length(fract(bc) - 0.5 - 0.2 * vec2(h11(bi.x * 3.3 + bi.y), h11(bi.y * 5.1 + bi.x) ) + 0.1), 0.6) * step(h11(bi.x * 7.3 + bi.y * 3.1 + seed * 40.), 1.05 - 1.7 * v);
  ltone = mix(ltone, 0.6 + 0.7 * h11(bi.x * 1.7 + bi.y * 9.1 + seed * 13.), bush * (1. - leaf)); leaf = max(leaf, bush);
  float flower = (1. - hang) * step(kind, 0.3) * step(length(vec2((fract(u + lean) - 0.5) * 0.9, (v - top) * abs(vDat.y) / max(vDat.x, 0.1) * nb * 0.9)), 0.34) * step(0.35, h11(id + 9.));
  float m = max(max(blade * (1. - hang), leaf), flower);
  if (m < 0.5) discard;
  vec3 L = normalize(uSun), V = normalize(cameraPosition - vW + vec3(0., 1e-4, 0.));
  vec3 gcol = mix(uGreen * 0.4, mix(uGreen, uGold, 0.15 + 0.35 * h11(id + 2.)) * 0.85, v / top);
  gcol = mix(gcol, mix(vec3(0.028, 0.1, 0.03), vec3(0.075, 0.17, 0.04), step(1.25, ltone) * 0.5) * min(ltone, 1.15) * (0.75 + 0.25 * v), hang);
  float fk = fract(seed * 23.7);
  vec3 fcol = fk < 0.5 ? uCream * 0.62 : (fk < 0.8 ? vec3(0.62, 0.44, 0.05) : vec3(0.13, 0.2, 0.55));
  vec3 alb = mix(gcol, fcol, flower);
  float back = pow(clamp(dot(-V, L) * 0.5 + 0.5, 1e-4, 1.), 2.);
  vec3 col = alb * (uSunCol * (0.5 + 0.45 * back) * mix(0.35 + 0.65 * v, 1., hang * 0.5 + flower) + uSky * 0.45 + uBounce * 0.3);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`;ot.push(async r=>{const{rng:t,pal:l,mat:h,add:f,detail:v}=r,o=[],y=[],M=[],F=[],g=[],s=[];let b=0;for(let A=0;A<T;A++){const P=yt(A),N=Mt(A),n=[0,.5,1.2,2.2,3.5];for(let z=5;z<P-1;z+=A===T-1?3:1.6)n.push(z);n.push(P,P+3,P+6.5);const i=42,S=b;for(const z of n)for(let C=0;C<=i;C++){const U=-52.5+105*C/i,O=Q(A,U,z),j=.4,G=Q(A,U+j,z)-Q(A,U-j,z),Y=Q(A,U,z+j)-Q(A,U,z-j),st=Math.hypot(G,2*j,Y);o.push(U,O,lt(A,U)-z),y.push(-G/st,2*j/st,Y/st),M.push(U,z),F.push(N.cz,N.rx,N.rz,P),g.push(A),b++}for(let z=0;z<n.length-1;z++)for(let C=0;C<i;C++){const U=S+z*(i+1)+C,O=U+i+1;s.push(U,U+1,O,U+1,O+1,O)}await r.ctx.yield?.()}const m=new x.BufferGeometry;m.setAttribute("position",new x.Float32BufferAttribute(o,3)),m.setAttribute("normal",new x.Float32BufferAttribute(y,3)),m.setAttribute("aUv",new x.Float32BufferAttribute(M,2)),m.setAttribute("aMat",new x.Float32BufferAttribute(F,4)),m.setAttribute("aDrw",new x.Float32BufferAttribute(g,1)),m.setIndex(s);const e=l[4].clone(),a=l[2].clone(),c={uGreen:{value:e},uGold:{value:a},uWater:{value:l[5]},uCream:{value:l[3]}};f(m,h(Dt,Lt,c,{side:x.DoubleSide})),await r.ctx.yield?.();const d=[],u=[],p=[],w=Math.round(2700*v);for(let A=0;A<w;A++){A%400===399&&await r.ctx.yield?.();const P=t()<.3?T-1:t.int(0,T-2),N=yt(P),n=t.range(-51.5,51.5),i=.5+(N-1.2)*Math.pow(t(),P===T-1?1:1.25),S=ct(P,n,i);if(S<.5){A-=t()<.5?1:0;continue}const z=S<2,C=z?t.range(1.8,2.8):t.range(.7,1.4),U=z?t.range(1,1.6):t.range(1.8,3.2);d.push(n,Q(P,n,i)-.05,lt(P,n)-i),u.push(U,C,t.range(0,3.14),z?.5+t()*.49:t()),p.push(P)}for(let A=0;A<T;A++){const P=Math.round(30*v);for(let N=0;N<P;N++){let n=t.range(-53,53);Math.abs(n)<6&&(n=Math.sign(n||1)*t.range(6,16)),d.push(n,I(A)-.25,L(A)+X(n)+(D-Math.abs(n)>5.6?1.15:.3)),u.push(t.range(2.5,5.5),-t.range(1.8,4.6),0,t()),p.push(A)}}const k=new x.InstancedBufferGeometry,W=[],B=[],q=[];let _=0;for(let A=0;A<2;A++){for(let P=0;P<=2;P++)W.push(-.5,0,A,.5,0,A),B.push(0,P/2,1,P/2);for(let P=0;P<2;P++){const N=_+P*2;q.push(N,N+1,N+2,N+1,N+3,N+2)}_+=6}k.setAttribute("position",new x.Float32BufferAttribute(W,3)),k.setAttribute("uv2",new x.Float32BufferAttribute(B,2)),k.setIndex(q),k.setAttribute("iPos",new x.InstancedBufferAttribute(new Float32Array(d),3)),k.setAttribute("iDat",new x.InstancedBufferAttribute(new Float32Array(u),4)),k.setAttribute("iDrw",new x.InstancedBufferAttribute(new Float32Array(p),1)),k.instanceCount=p.length,f(k,h(Ot,It,c,{side:x.DoubleSide}))});const jt=tt+`
attribute vec2 aUv; attribute vec4 aMat;
varying vec2 vUv; varying vec4 vMat;
void main() {
  vUv = aUv; vMat = aMat; vP = position; vec3 p = position;
  float v = aUv.y;
  p.x += 0.35 * sin(uTime * 1.7 + v * 9. + aMat.z * 6.) * v * v;      // the sheet wavers as it falls
  p.z += 0.3 * sin(uTime * 1.3 + v * 7. + aUv.x * 2. + aMat.z * 4.) * v + drwOff();
  vN = vec3(0., 0., 1.);
  float drop = step(2.5, aMat.w), sd = aMat.z;
  float tt = fract(uTime * (0.4 + 0.25 * fract(sd * 7.1)) + sd) * 1.5;                     // a droplet's flight, looping
  vec3 vel = vec3((fract(sd * 13.7) - 0.5) * 6., 4.5 + 6. * fract(sd * 29.3), (fract(sd * 51.1) - 0.25) * 5.);
  p = mix(p, position + vec3(0., 0., drwOff()) + vel * tt - vec3(0., 4.9 * tt * tt, 0.), drop);
  vec4 w = modelMatrix * vec4(p, 1.); vW = w.xyz;
  vec4 mvPosition = viewMatrix * w; mvPosition.xy += drop * aUv * aMat.x * (1.2 - 0.5 * tt);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,kt=et+`
uniform vec3 uWater; uniform vec3 uCream;
varying vec2 vUv; varying vec4 vMat;   // vUv = (-1..1 across, 0..1 down in fall time); vMat = (height m, layer, seed, kind)
void main() {
  float x = clamp(vUv.x, -1., 1.), v = clamp(vUv.y, 0., 1.), H = vMat.x, layer = vMat.y, seed = vMat.z;      // the across and along coordinates, kept to their own ranges
  vec3 V = normalize(cameraPosition - vW + vec3(0., 1e-4, 0.)), L = normalize(uSun);
  float a; vec3 col;
  if (vMat.w > 0.5) {                                   // spray puff / foam ring (soft disc)
    float r = length(clamp(vUv, -1., 1.));
    float n = fbm(vUv * 2.5 + seed * 9. + vec2(0., -uTime * 0.6));
    a = (1. - smoothstep(0.25, 1., r)) * (0.35 + 0.65 * n) * vMat.x;
    if (vMat.w > 1.5) a *= 0.6 + 0.4 * sin(r * 9. - uTime * 3.2 + n * 6.);
    if (vMat.w > 2.5) a = (1. - smoothstep(0.15, 1., r)) * 0.85;
    col = mix(uWater, vec3(1.), 0.8) * (uSunCol * 0.36 + uSky * 0.5);
  } else {
    float t = uTime * (0.55 + 0.12 * layer);
    vec2 q = vec2(x * 3.2 + seed * 7. + layer * 3.3, v * 2.6 - t);
    float streak = fbm(vec2(q.x * 2.2, q.y * 1.4)) * 0.6 + vnoise(vec2(q.x * 7., q.y * 2.2 + 3.)) * 0.4;
    float clots = fbm(vec2(q.x * 0.8, q.y * 3.) + 5.);
    float glass = 1. - smoothstep(0.02, 0.2, v);           // smooth turquoise lip before it breaks up
    float body = smoothstep(0.32 + 0.2 * v, 0.62, streak * 0.75 + clots * 0.45);
    float edge = 1. - smoothstep(0.55 - 0.25 * v, 1., abs(x) + 0.25 * (vnoise(vec2(v * 9. - t * 2., seed)) - 0.5));
    a = mix(body, 0.85, glass) * edge * (0.72 + 0.28 * layer);
    a *= 1. - smoothstep(0.93, 1., v) * 0.6;
    float white = clamp(body * (0.55 + 0.6 * v) + 0.25 * streak, 0., 1.) * (1. - 0.8 * glass);
    float thru = pow(clamp(dot(-V, L) * 0.5 + 0.5, 1e-4, 1.), 2.);  // sun through the water
    vec3 wcol = mix(uWater * 0.8, vec3(0.93, 0.98, 0.97), white);
    col = wcol * (uSunCol * (0.3 + 0.16 * thru) + uSky * 0.42 + uBounce * 0.12);
    col += uSunCol * 0.25 * glass * pow(clamp(1. - abs(x), 1e-4, 1.), 2.);
    if (seed > 5.) {      // a fall into the sea (the world's): a column of water like the canyon's, whose edges fray into strands and a veil of spray as it drops; white-turquoise, the sun through it
      float drop = v * v * H, fray = smoothstep(0.08, 0.8, v), rim = smoothstep(0.25, 0.8, abs(x)) * fray;
      vec2 sq = vec2(x * (1.6 + 1.2 * fray) + seed * 7. + layer * 3.3, drop * 0.05 - t * 1.6);
      float strand = vnoise(vec2(sq.x * 1.25, sq.y * 0.22)) * 0.62 + vnoise(vec2(sq.x * 3.4 + 3., sq.y * 0.7)) * 0.38;
      float clot = fbm(vec2(sq.x * 0.7, sq.y * 1.2) + 5.);
      float bodyS = smoothstep(0.34 + 0.2 * fray, 0.62 + 0.14 * fray, strand * 0.74 + clot * 0.5);
      float veil = fbm(vec2(x * 1.1 + seed * 3., drop * 0.02 - t * 0.5)) * fray * 0.22;
      float edgeS = 1. - smoothstep(0.45, 1., abs(x) + 0.5 * fray * (vnoise(vec2(drop * 0.1 - t * 2., seed + x * 1.5)) - 0.5));
      float aS = (bodyS * (1. - 0.25 * fray) + veil) * edgeS * (0.74 + 0.26 * layer);
      a = mix(a, aS * (1. - smoothstep(0.92, 1., v) * 0.5), rim);
      float whiteS = clamp(bodyS * (0.6 + 0.5 * v) + 0.3 * strand, 0., 1.);
      col = mix(col, mix(uWater * 0.85, vec3(0.93, 0.98, 0.97), whiteS) * (uSunCol * (0.3 + 0.16 * thru) + uSky * 0.42 + uBounce * 0.12), rim);
      col = mix(col, uWater * (uSunCol * (0.34 + 0.3 * thru) + uSky * 0.5), 0.3 * (1. - white) * (1. - rim));      // the turquoise of the water shows through the column's body
    }
  }
  gl_FragColor = vec4(col, clamp(a, 0., 1.));
  #include <fog_fragment>
}`;ot.push(async r=>{const{rng:t,pal:l,mat:h,add:f,anchors:v}=r,o=[],y=[],M=[],F=[],g=[];let s=0;const b=(e,a,c,d,u,p,w)=>{const k=s;for(const[W,B]of[[-1,-1],[1,-1],[1,1],[-1,1]])o.push(e+W*d,w?a:a+B*d*.8,w?c+B*d:c),y.push(W,B),M.push(...u),F.push(p),s++;g.push(k,k+1,k+2,k,k+2,k+3)};v.falls=[];for(let e=0;e<T;e++){const a=I(e)-1.35,c=L(e)+$-.6,d=e===0?.1:I(e-1)-it-.35,u=a-d,p=e===0?5.2:3.6,w=t();for(let B=0;B<2;B++){const A=s;for(let P=0;P<=18;P++)for(let N=0;N<=8;N++){const n=P/18,i=N/8*2-1,S=Math.max(0,n-.04)/.96,z=(4.1-.9*E(0,.25,n)+1.6*n*n)*(B?.82:1),C=a+.25*(1-E(0,.04,n))-u*S*S,U=c+(n<.04?n/.04*1.4-.8:.6+p*S)+(1-i*i)*.5+B*(.45+.5*n);o.push(i*z,C,U),y.push(i,n),M.push(u,B,w,0),F.push(e),s++}for(let P=0;P<18;P++)for(let N=0;N<8;N++){const n=A+P*9+N,i=n+8+1;g.push(n,i,n+1,n+1,i,i+1)}}const k=c+.6+p+.6,W=Math.max(e-1,0);b(0,d+.12,k,e===0?15:7.5,[.7,0,t(),2],W,!0);for(let B=0;B<5;B++)b(t.range(-3.2,3.2),d+t.range(1.5,4.5),k+t.range(-1,2.2),t.range(3.5,6.5)*(e===0?1.5:1),[.34,0,t(),1],W,!1);for(let B=0;B<22;B++){const q=s,_=t.range(.12,.3)*(e===0?1.4:1),A=t(),P=t.range(-2.6,2.6);for(const[N,n]of[[-1,-1],[1,-1],[1,1],[-1,1]])o.push(P,d+.2,k-.6),y.push(N,n),M.push(_,0,A,3),F.push(W),s++;g.push(q,q+1,q+2,q,q+2,q+3)}v.falls.push({top:new x.Vector3(0,a,c),foot:new x.Vector3(0,d,k),drawer:e}),await r.ctx.yield?.()}const m=new x.BufferGeometry;m.setAttribute("position",new x.Float32BufferAttribute(o,3)),m.setAttribute("aUv",new x.Float32BufferAttribute(y,2)),m.setAttribute("aMat",new x.Float32BufferAttribute(M,4)),m.setAttribute("aDrw",new x.Float32BufferAttribute(F,1)),m.setIndex(g),f(m,h(jt,kt,{uWater:{value:l[5]},uCream:{value:l[3]}},{side:x.DoubleSide,transparent:!0,depthWrite:!1}),5)});const zt=tt+`
attribute vec3 aCol; attribute vec4 aAnim; attribute vec3 aPiv;
varying vec3 vCol; varying vec4 vAnim;
void main() {
  vCol = aCol; vAnim = aAnim; vec3 p = position; vec3 n = normal;
  float ty = aAnim.x, ph = aAnim.y * 6.2831, amt = aAnim.z, t = uTime;
  vec3 lat = vec3(cos(aAnim.w), 0., -sin(aAnim.w));
  if (ty > 0.5 && ty < 1.5) {
    float lift = smoothstep(0.5, 0.8, sin(t * 0.27 + ph)) ;
    float a = amt * (1. - lift) + 0.05 * sin(t * 4.5 + ph) * (1. - lift) + 0.12 * sin(t * 0.7 + ph * 2.) * lift;
    float c = cos(a), s = sin(a); vec3 r = p - aPiv;
    p = aPiv + r * c + cross(lat, r) * s + lat * dot(lat, r) * (1. - c);
    n = n * c + cross(lat, n) * s + lat * dot(lat, n) * (1. - c);
  } else if (ty > 1.5 && ty < 2.5) {
    p += lat * amt * sin(t * 9. + ph) * smoothstep(0.6, 0.9, sin(t * 0.8 + ph * 3.));
  } else if (ty > 2.5 && ty < 3.5) {
    p.x += amt * (sin(t * 0.9 + ph + p.y * 0.3) + 0.4 * sin(t * 2.1 + ph * 2. + p.z)); p.z += amt * 0.6 * cos(t * 0.7 + ph);
  } else if (ty > 3.5) {
    p.z += amt * (sin(t * 2.6 + ph + p.x * 1.3) + 0.5 * sin(t * 4.1 + p.y * 2.)); p.x += amt * 0.3 * sin(t * 1.7 + ph);
  }
  vP = position; p.z += drwOff();
  vN = normalize(mat3(modelMatrix) * n + vec3(0., 1e-5, 0.));
  vec4 w = modelMatrix * vec4(p, 1.); vW = w.xyz;
  vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,At=et+`
varying vec3 vCol; varying vec4 vAnim;
void main() {
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)), V = normalize(cameraPosition - vW + vec3(0., 1e-4, 0.)), L = normalize(uSun);
  if (dot(N, V) < 0.) N = -N;
  vec3 alb = vCol; float foliage = step(2.5, vAnim.x) * step(vAnim.x, 3.5);
  float dap = vnoise(vP.xy * 2.6 + vP.z * 2.1) * 0.6 + vnoise(vP.zx * 6.3 + vP.y * 5.2) * 0.4;
  alb *= mix(1., 0.5 + 1.1 * dap, foliage);
  float blossom = foliage * smoothstep(0.74, 0.8, vnoise(vP.xz * 5.7 + vP.y * 4.9));
  alb = mix(alb, vec3(0.62, 0.2, 0.12), blossom * 0.7);
  float nl = dot(N, L), wrap = max(nl * 0.75 + 0.25, 0.);
  float back = pow(clamp(dot(-V, L) * 0.5 + 0.5, 1e-4, 1.), 2.) * foliage;
  float rim = pow(clamp(1. - dot(N, V), 1e-4, 1.), 3.) * max(nl + 0.4, 0.) * (1. - foliage);
  vec3 col = alb * (uSunCol * (wrap + 0.35 * back) + ambientAt(N)) + uSunCol * rim * 0.12;
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`;class St{constructor(){this.p=[],this.n=[],this.c=[],this.a=[],this.pv=[],this.d=[],this.idx=[],this.k=0,this.lod=0,this.reset()}reset(){this.o=[0,0,0],this.h=0,this.s=1,this.drw=9,this.anim=[0,0,0,0],this.piv=[0,0,0]}at(t,l,h,f){this.o=t,this.h=l,this.s=h,this.drw=f}xf(t){const l=Math.cos(this.h),h=Math.sin(this.h);return[this.o[0]+(t[0]*l+t[2]*h)*this.s,this.o[1]+t[1]*this.s,this.o[2]+(-t[0]*h+t[2]*l)*this.s]}rot(t){const l=Math.cos(this.h),h=Math.sin(this.h);return[t[0]*l+t[2]*h,t[1],-t[0]*h+t[2]*l]}v(t,l,h){const f=Math.cos(this.h),v=Math.sin(this.h),o=this.o,y=this.s,M=this.piv;return this.p.push(o[0]+(t[0]*f+t[2]*v)*y,o[1]+t[1]*y,o[2]+(-t[0]*v+t[2]*f)*y),this.n.push(l[0]*f+l[2]*v,l[1],-l[0]*v+l[2]*f),this.c.push(h[0],h[1],h[2]),this.a.push(this.anim[0],this.anim[1],this.anim[2],this.h),this.pv.push(o[0]+(M[0]*f+M[2]*v)*y,o[1]+M[1]*y,o[2]+(-M[0]*v+M[2]*f)*y),this.d.push(this.drw),this.k++}ball(t,l,h,f,v=7,o=5){this.lod&&(v=Math.max(4,v-1-this.lod),o=Math.max(3,o-2));const y=this.k;for(let M=0;M<=o;M++){const F=M/o*Math.PI,g=Math.cos(F),s=Math.sin(F),b=f?h.map((m,e)=>Z(f[e],m,E(-.5,.3,g))):h;for(let m=0;m<=v;m++){const e=m/v*Math.PI*2,a=Math.cos(e)*s,c=Math.sin(e)*s,d=a/l[0],u=g/l[1],p=c/l[2],w=Math.hypot(d,u,p);this.v([t[0]+a*l[0],t[1]+g*l[1],t[2]+c*l[2]],[d/w,u/w,p/w],b)}}for(let M=0;M<o;M++)for(let F=0;F<v;F++){const g=y+M*(v+1)+F,s=g+v+1;this.idx.push(g,g+1,s,g+1,s+1,s)}}tube(t,l,h,f,v,o,y=5){this.lod&&(y=Math.max(3,y-1));const M=[l[0]-t[0],l[1]-t[1],l[2]-t[2]],F=Math.hypot(...M)||1,g=M.map(a=>a/F);let s=Math.abs(g[1])>.9?[1,0,0]:[0,1,0],b=[g[1]*s[2]-g[2]*s[1],g[2]*s[0]-g[0]*s[2],g[0]*s[1]-g[1]*s[0]];const m=Math.hypot(...b);b=b.map(a=>a/m),s=[b[1]*g[2]-b[2]*g[1],b[2]*g[0]-b[0]*g[2],b[0]*g[1]-b[1]*g[0]];const e=this.k;for(let a=0;a<2;a++)for(let c=0;c<=y;c++){const d=c/y*Math.PI*2,u=Math.cos(d),p=Math.sin(d),w=a?f:h,k=a?l:t,W=[s[0]*u+b[0]*p,s[1]*u+b[1]*p,s[2]*u+b[2]*p];this.v([k[0]+W[0]*w,k[1]+W[1]*w,k[2]+W[2]*w],W,a&&o?o:v)}for(let a=0;a<y;a++){const c=e+a,d=c+y+1;this.idx.push(c,d,c+1,c+1,d,d+1)}}quad(t,l,h,f,v){const o=[0,0,1],y=this.v(t,o,v),M=this.v(l,o,v),F=this.v(h,o,v),g=this.v(f,o,v);this.idx.push(y,M,F,y,F,g)}build(){const t=new x.BufferGeometry;return t.setAttribute("position",new x.Float32BufferAttribute(this.p,3)),t.setAttribute("normal",new x.Float32BufferAttribute(this.n,3)),t.setAttribute("aCol",new x.Float32BufferAttribute(this.c,3)),t.setAttribute("aAnim",new x.Float32BufferAttribute(this.a,4)),t.setAttribute("aPiv",new x.Float32BufferAttribute(this.pv,3)),t.setAttribute("aDrw",new x.Float32BufferAttribute(this.d,1)),t.setIndex(this.idx),t}}function ht(r,t,l,h,f,v,o=1){const y=v==="stag",M=v==="goat",F=(y?1.5:M?.78:t.range(.92,1.06))*o,g=M?[.7,.67,.6]:y?[.36,.19,.09]:[.4+t.range(-.05,.05),.22,.1],s=M?[.52,.5,.45]:[.55,.44,.3],b=M?[.3,.28,.25]:[.12,.07,.04],m=[.62,.55,.42],e=t();r.at(l,h,F,f),r.piv=[0,1.1,.55],r.anim=[0,0,0],r.ball([0,1,0],[.27,.3,.62],g,s),r.ball([0,1.04,.42],[.25,.32,.3],g,s,6,4),r.ball([0,1.04,-.46],[.26,.3,.3],M?g:[.5,.36,.22],s,6,4);const a=t.range(-.12,.12);for(const c of[-1,1]){const d=c*.15,u=.45+c*a,p=-.5-c*a*.7;r.tube([d,.92,.45],[d,.48,u+.04],.085,.05,g,s),r.tube([d,.48,u+.04],[d,0,u],.05,.035,s,b),r.tube([d*1.1,.96,-.5],[d*1.1,.5,p-.12],.1,.05,g,s),r.tube([d*1.1,.5,p-.12],[d*1.1,0,p],.05,.035,s,b)}r.anim=[2,e,.05],r.tube([0,1.14,-.72],[0,.9,-.88],.055,.02,M?g:[.75,.72,.66],b,4),r.anim=[1,e,y?.25:M?1.75:1.9],r.tube([0,1.1,.52],[0,1.58,.9],.16,.09,g,g,6),r.ball([0,1.66,1.04],[.09,.1,.2],g,s,6,4),r.ball([0,1.62,1.22],[.055,.06,.08],b,null,5,3);for(const c of[-1,1])if(r.tube([c*.07,1.74,.95],[c*.21,1.87,.9],.05,.015,g,s,4),y){const d=[c*.06,1.76,.98],u=[c*.32,2.22,.8],p=[c*.4,2.62,.96];r.tube(d,u,.04,.03,m,m,4),r.tube(u,p,.03,.012,m,m,4),r.tube(u,[c*.46,2.3,1.12],.025,.01,m,m,4),r.tube([c*.36,2.42,.88],[c*.6,2.62,.74],.025,.01,m,m,4),r.tube([c*.1,1.85,.95],[c*.17,2,1.22],.025,.01,m,m,4)}else M&&r.tube([c*.05,1.75,1],[c*.1,1.96,.84],.035,.012,m,b,4);M&&r.tube([0,1.57,1.14],[0,1.4,1.1],.04,.01,g,g,4)}function vt(r,t,l,h,f=1){const v=t.range(.95,1.3)*f,o=t(),y=[.16,.11,.07],M=[.24,.17,.1],F=f>1.7,g=[];r.at(l,t.range(0,6.28),v,h),r.piv=[0,0,0],r.anim=[0,0,0];const s=[t.range(-.5,.5),0,t.range(-.3,.3)],b=[s[0]*.5,1.6,s[2]*.5],m=[s[0],2.9,s[2]];r.tube([0,-.2,0],b,.5,.34,y,M,6),r.tube(b,m,.34,.27,M,y,6);const e=5;for(let a=0;a<e;a++){const c=a/e*6.28+t.range(-.4,.4),d=t.range(1.5,2.6),u=[m[0]+Math.cos(c)*d,t.range(3.7,4.8),m[2]+Math.sin(c)*d];r.anim=[0,0,0],r.tube(m,u,.2,.08,y,M,4);const p=t.range(.8,1.15);r.anim=[3,o+a*.13,.07],r.ball([u[0],u[1]+.5,u[2]],[t.range(1.5,2.1),t.range(1,1.4),t.range(1.5,2.1)],[.12*p,.24*p,.06*p],[.04,.09,.03],8,5),g.push([u[0],u[1]+.5,u[2]]);const w=t.range(.85,1.25),k=t.range(0,6.28);r.anim=[3,o+a*.21,.1],r.ball([u[0]+Math.cos(k)*1.2,u[1]+t.range(-.2,1.3),u[2]+Math.sin(k)*1.2],[t.range(.9,1.3),t.range(.7,1),t.range(.9,1.3)],[.14*w,.27*w,.07*w],[.04,.09,.03],6,4)}if(r.anim=[3,o,.09],r.ball([m[0],5.4,m[2]],[2.2,1.5,2.2],[.15,.27,.07],[.05,.1,.03],8,5),F){r.anim=[0,0,0],r.tube(b,[b[0]-1.9,3.3,b[2]+.9],.2,.05,y,M,4),r.tube([b[0]-1.9,3.3,b[2]+.9],[b[0]-2.5,4.3,b[2]+.5],.06,.02,M,M,3);const a=[b[0]+2.4,2.3,b[2]-1.2];r.tube(b,a,.22,.1,y,M,4),r.anim=[3,o+.4,.08],r.ball([a[0]+.3,a[1]+.5,a[2]],[1.3,.8,1.2],[.13,.25,.06],[.04,.09,.03],6,4),g.push([a[0]+.3,a[1]+.2,a[2]]);for(let c=0;c<(r.lod>1?0:16);c++){const d=g[c%g.length],u=t.range(0,6.28),p=t.range(.5,1.5);r.anim=[3,o+c*.13,.07],r.ball([d[0]+Math.cos(u)*p,d[1]-t.range(.35,.95),d[2]+Math.sin(u)*p],[.24,.24,.24],[.7,.08,.04],[.34,.03,.02],5,3)}}}ot.push(async r=>{const{rng:t,mat:l,add:h,anchors:f,ctx:v}=r,o=new St,y=(s,b,m,e,a)=>{for(let c=0;c<30;c++){const d=t.range(b,m)*t.sign(),u=t.range(e,a);if(ct(s,d,u)>2.2)return[d,u]}return[40,5]},M=(s,b,m)=>[b,Q(s,b,m),lt(s,b)-m];for(let s=0;s<T-1;s++){const b=t.int(1,2);for(let u=0;u<b;u++){const[p,w]=y(s,20,47,6,9.5);vt(o,t,M(s,p,w),s)}const m=s%3===1,e=t.int(2,3),[a,c]=y(s,16,40,3,9),d=t.range(0,6.28);for(let u=0;u<e;u++){const p=a+t.range(-6,6),w=J(c+t.range(-3,3),1.5,11.5);ct(s,p,w)>1&&ht(o,t,M(s,p,w),d+t.range(-.9,.9),s,m?"goat":"deer")}await v.yield?.()}const F=T-1;t(),ht(o,t,M(F,18,8),-1.78,F,"stag",1.75),f.stag=new x.Vector3(18,Q(F,18,8)+4.4,lt(F,18)-8);for(const[s,b]of[[40,31],[46,13],[-17,46],[-30,22],[-36,9]])ht(o,t,M(F,s+t.range(-2,2),b+t.range(-2,2)),t.range(0,6.28),F,"deer",1.7);for(const[s,b]of[[-38,40],[40,50],[-22,60],[45,26],[22,62]])vt(o,t,M(F,s+t.range(-3,3),b+t.range(-3,3)),F,1.9);await v.yield?.();{const m=M(0,31,10.2),e=[.5,.36,.2];o.reset(),o.drw=0;const a=[0,8.6,-2.7];for(const c of[-.3,.3])o.at([m[0]+c,m[1],m[2]],0,1,0),o.tube([0,0,0],a,.06,.05,e,e,4);o.at(m,0,1,0);for(let c=1;c<26;c++){const d=c/26.5;o.tube([-.3,a[1]*d,a[2]*d],[.3,a[1]*d,a[2]*d],.03,.03,e,e,3)}f.ladderFoot=new x.Vector3(...m)}{const[,b,m]=xt(2,1),e=[-25,b+.3,L(2)+X(25)+6.6],a=[25,b+.3,e[2]];o.reset(),o.drw=2;const c=[.75,.7,.6],d=28,u=W=>-3.2*4*W*(1-W),p=W=>[Z(e[0],a[0],W),e[1]+u(W),e[2]];for(let W=0;W<d;W++)o.tube(p(W/d),p((W+1)/d),.045,.045,c,c,3);const w=[[.75,.72,.66],[.6,.08,.06],[.75,.72,.66],[.14,.24,.5],[.72,.6,.3],[.75,.72,.66],[.55,.2,.3]];let k=.6;for(o.piv=[0,0,0];k<.94;){const W=t.range(.7,2.3),B=t.range(.9,1.9),q=t.pick(w),_=p(k),A=p(k+W/50),P=t();o.anim=[0,P,0];const N=o.v([_[0],_[1],_[2]],[0,0,1],q),n=o.v([A[0],A[1],A[2]],[0,0,1],q);o.anim=[4,P,.07];const i=o.v([_[0],_[1]-B*.5,_[2]],[0,.2,1],q),S=o.v([A[0],A[1]-B*.5,A[2]],[0,.2,1],q);o.anim=[4,P,.16];const z=o.v([_[0]+.05,_[1]-B,_[2]],[0,.3,1],q.map(U=>U*.8)),C=o.v([A[0]-.05,A[1]-B,A[2]],[0,.3,1],q.map(U=>U*.8));o.idx.push(N,i,n,n,i,S,i,z,S,S,z,C),k+=W/50+t.range(.008,.03)}f.washing=new x.Vector3(19,e[1]-3,e[2])}await v.yield?.();const g=o.build();await v.yield?.(),h(g,l(zt,At,{},{side:x.DoubleSide}))});const Ht=`
attribute vec4 iA; attribute vec4 iB; attribute float aW;
uniform float uTime; uniform float uProg; uniform float uRib; uniform vec3 uPath[8]; uniform vec3 uPathB[8];
varying vec3 vN; varying vec3 vW; varying float vWing;
#include <fog_pars_vertex>
vec3 cr(vec3 a, vec3 b, vec3 c, vec3 d, float t) { return 0.5 * ((2. * b) + (c - a) * t + (2. * a - 5. * b + 4. * c - d) * t * t + (3. * b - a - 3. * c + d) * t * t * t); }
vec3 pathAt(float t) { float f = clamp(t, 0., 0.9999) * 5.; int i = int(floor(f)); return cr(uPath[i], uPath[i + 1], uPath[i + 2], uPath[i + 3], fract(f)); }
vec3 pathBt(float t) { float f = clamp(t, 0., 0.9999) * 5.; int i = int(floor(f)); return cr(uPathB[i], uPathB[i + 1], uPathB[i + 2], uPathB[i + 3], fract(f)); }
vec3 swiftPos(float k) {
  if (iA.x < 0.5) {
    float a = k * iA.z + iA.y * 6.2831, r = iB.w;
    float zr = iA.x > 0.1 ? 0.9 : 0.55;
    return iB.xyz + vec3(cos(a) * r, sin(a * 2. + iA.w * 6.) * r * 0.22 + sin(a * 0.37) * 4., sin(a) * r * zr + sin(a * 3.) * r * 0.08);
  }
  float kk = clamp(k, 0., 1.);
  float tp = iA.x < 1.5 ? (kk < 0.1 ? kk * 3. : 0.3 + (kk - 0.1) * 0.7778) : kk;     // the stream bursts out, then cruises
  float taper = smoothstep(0., 0.1, tp) * (1. - smoothstep(0.86, 1., tp));
  vec3 c = iA.x < 1.5 ? pathAt(tp) : pathBt(tp);
  float wob = iB.z * 6.2831 + tp * 22.;
  vec3 off = taper * (vec3(iB.x, iB.y, 0.) * (iA.x < 1.5 ? 3.6 : 8.5) + 0.9 * vec3(sin(wob), cos(wob * 1.3), sin(wob * 0.7)));
  if (iA.x < 1.5) {      // the stream's last stretch: over the top meadow it opens into a funnel as wide as the hall's mouth, and each key flies in
    // along its own line to its own place on the rim of the keyhole's round head, so none hangs across the middle of it
    float fun = smoothstep(0.64, 0.84, tp), cl = smoothstep(0.84, 1., tp), th = 3.1416 * (0.03 + 0.94 * iB.z);
    off = mix(off, vec3(cos(th) * mix(46., 6.6, cl), sin(th) * mix(11., 6.6, cl) + 2. * (1. - cl), 0.) + 0.9 * (1. - cl) * vec3(sin(wob), cos(wob * 1.3), sin(wob * 0.7)), fun);
  }
  return c + off;
}
void main() {
  float k = iA.x < 0.5 ? uTime : (iA.x < 1.5 ? (uProg - 0.485) * 2.41 - iA.y * 0.26 : uRib - iA.y * 0.5);
  float e = iA.x < 0.5 ? 0.05 : 0.004;
  vec3 c = swiftPos(k), c2 = swiftPos(k + e);
  vec3 fw = c2 - c; fw = normalize(fw + vec3(0., 0., 1e-4));
  vec3 rt = normalize(cross(vec3(0., 1., 0.), fw) + vec3(1e-4, 0., 0.)); vec3 up = cross(fw, rt);
  float show = iA.x < 0.5 ? 1. : step(0.001, k) * step(k, 0.999);
  vec3 p = position; float wing = abs(aW);
  float flap = sin(uTime * (iA.x < 1.5 ? 13. + 5. * iA.w : 7. + 2. * iA.w) + iA.w * 40.) * (0.75 + 0.25 * sin(uTime * 0.9 + iA.w * 9.));
  p.y += wing * flap * 0.5; p.x *= 1. - 0.2 * wing * flap * flap;
  p *= (iA.x < 0.5 ? 1.25 + 7.5 * iA.x : (iA.x < 1.5 ? 2.2 : 5.)) * show;
  vec3 wp = c + rt * p.x + up * p.y + fw * p.z;
  vec3 n = normalize(rt * normal.x + up * (normal.y + 1e-3) + fw * normal.z + rt * sign(aW) * flap * wing * 0.6);
  vN = normalize(mat3(modelMatrix) * n); vWing = wing;
  vec4 w = modelMatrix * vec4(wp, 1.); vW = w.xyz;
  vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Gt=`
uniform vec3 uSun; uniform vec3 uSunCol; uniform vec3 uSky; uniform vec3 uBounce; uniform vec3 uBrass;
varying vec3 vN; varying vec3 vW; varying float vWing;
#include <fog_pars_fragment>
void main() {
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)), V = normalize(cameraPosition - vW + vec3(0., 1e-4, 0.)), L = normalize(uSun);
  if (dot(N, V) < 0.) N = -N;
  vec3 R = reflect(-V, N); float nh = max(dot(N, normalize(L + V + vec3(0., 1e-4, 0.))), 0.);
  vec3 base = uBrass * vec3(1., 0.84, 0.6) * mix(0.62, 0.8, step(0.01, vWing));
  vec3 env = mix(uBounce * 0.9 + vec3(0.2, 0.15, 0.08), uSky * 1.1 + vec3(0.25, 0.22, 0.16), smoothstep(-0.2, 0.3, R.y));
  vec3 col = base * (uSunCol * 0.35 * max(dot(N, L), 0.) + env * 0.95) + base * uSunCol * (pow(clamp(nh, 1e-4, 1.), 60.) * 2.6);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`;ot.push(async r=>{const{rng:t,pal:l,mat:h,add:f,anchors:v,detail:o,U:y}=r,M=[],F=[],g=[],s=[];let b=0;const m=(n,i,S,z,C,U,O=0)=>(M.push(n,i,S),F.push(z,C,U),g.push(O),b++);for(let n=0;n<10;n++){const i=n/10*6.2832,S=(n+1)/10*6.2832,z=.2,C=.1,U=.25,O=m(.012,Math.sin(i)*C*.86,U+Math.cos(i)*C,1,0,0),j=m(0,Math.sin(i)*z*.86,U+Math.cos(i)*z,.8,Math.sin(i)*.6,Math.cos(i)*.6),G=m(0,Math.sin(S)*z*.86,U+Math.cos(S)*z,.8,Math.sin(S)*.6,Math.cos(S)*.6),Y=m(.012,Math.sin(S)*C*.86,U+Math.cos(S)*C,1,0,0);s.push(O,j,G,O,G,Y)}for(let n=0;n<4;n++){const i=n/4*6.2832+.785,S=i+1.5708,z=.05,C=i+.785,U=m(Math.cos(i)*z,Math.sin(i)*z,.06,Math.cos(C),Math.sin(C),0),O=m(Math.cos(S)*z,Math.sin(S)*z,.06,Math.cos(C),Math.sin(C),0),j=m(Math.cos(S)*z*.8,Math.sin(S)*z*.8,-.5,Math.cos(C),Math.sin(C),0),G=m(Math.cos(i)*z*.8,Math.sin(i)*z*.8,-.5,Math.cos(C),Math.sin(C),0);s.push(U,O,j,U,j,G)}for(const[n,i,S]of[[-.5,-.41,-.22],[-.41,-.35,-.12],[-.35,-.27,-.22]]){const z=m(0,0,n,1,.2,0),C=m(0,0,i,1,.2,0),U=m(0,S,i,1,.2,0),O=m(0,S,n,1,.2,0);s.push(z,C,U,z,U,O)}{const n=m(0,.075,-.02,1,.2,0),i=m(0,.075,.03,1,.2,0),S=m(0,-.075,.03,1,.2,0),z=m(0,-.075,-.02,1,.2,0);s.push(n,i,S,n,S,z)}for(const n of[-1,1]){const i=m(n*.05,.01,.3,0,1,0,0),S=m(n*.34,.01,.27,0,1,0,n*.5),z=m(n*.66,.01,.02,0,1,0,n*1),C=m(n*.3,.01,.13,0,1,0,n*.4),U=m(n*.05,.01,.14,0,1,0,0);s.push(i,S,C,S,z,C,i,C,U)}const e=new x.InstancedBufferGeometry;e.setAttribute("position",new x.Float32BufferAttribute(M,3)),e.setAttribute("normal",new x.Float32BufferAttribute(F,3)),e.setAttribute("aW",new x.Float32BufferAttribute(g,1)),e.setIndex(s);const a=[],c=[],d=235,u=Math.round(110*o),p=28;for(let n=0;n<d;n++){const i=t.range(0,6.28),S=Math.sqrt(t());a.push(1,Math.pow(t(),.8),1,t()),c.push(Math.cos(i)*S,Math.sin(i)*S,t(),0)}for(let n=0;n<u;n++){const i=t.int(3,T-3),S=v.keyholes[i],z=t();a.push(0,t(),t.range(.22,.4)*t.sign()*(z<.5?1:.8),t()),c.push(S.x+t.range(-34,26),S.y+t.range(4,20),S.z+t.range(14,30),t.range(9,24))}const w=r.ctx,k=w.core.makeRng(w.core.hashSeed("tallboy-flocks:"+w.seed)),W=r.moths,B=W?Math.round(W[3]):0;for(let n=0;n<B;n++)a.push(.36,t(),t.range(.4,.8)*t.sign(),t()),c.push(W[0]+t.range(-2,2),W[1]+t.range(-7,6),W[2]+t.range(-2,2),t.range(6,27));let q=0;for(const n of r.flocks||[]){const i=n[1]+(n[7]||0)*k(),S=Math.round((n[3]+(n[8]||0)*k())*Math.max(.6,o)),z=n[5]+(n[9]||0)*k(),C=n[6]+(n[10]||0)*k();for(let U=0;U<S;U++)a.push(C,k(),k.range(.16,.34)*k.sign(),k()),c.push(n[0]+k.range(-6,6),i+k.range(-10,10),n[2]+k.range(-6,6),k.range(n[4],z)),q++}for(let n=0;n<p;n++){const i=t.range(0,6.28),S=Math.sqrt(t());a.push(2,(n+t())/p,1,t()),c.push(Math.cos(i)*S,Math.sin(i)*S*.45,t(),0)}e.setAttribute("iA",new x.InstancedBufferAttribute(new Float32Array(a),4)),e.setAttribute("iB",new x.InstancedBufferAttribute(new Float32Array(c),4)),e.instanceCount=d+u+B+q+p;const _=v.keyholes[1],A=new x.Vector3(0,at,H);v.swiftKeyhole=_;const P=[[_.x,_.y,_.z-6],[_.x,_.y,_.z],[_.x-9,I(1)+4,L(1)+8],[-ut-16,I(1)+10,L(2)+10],[-74,I(6)+9,L(6)+34],[2,A.y+9,82],[A.x,A.y,A.z],[A.x,A.y-1,A.z-30]];v.swiftPath=P.slice(1,7).map(n=>new x.Vector3(n[0],n[1],n[2]));const N=r.ribbon&&r.ribbon.length===8?r.ribbon:P.map(n=>[n[0],n[1]-400,n[2]]);y.uRib={value:-1},f(e,h(Ht,Gt,{uBrass:{value:l[6]},uPath:{value:P.map(n=>new x.Vector3(n[0],n[1],n[2]))},uPathB:{value:N.map(n=>new x.Vector3(n[0],n[1],n[2]))},uProg:y.uProg,uRib:y.uRib},{side:x.DoubleSide}))});export{wt as BRASS_FS,kt as FALL_FS,et as FS_HEAD,ft as Geo,St as PGeo,At as PROP_FS,zt as PROP_VS,tt as VS_HEAD,pt as WOOD_FS,ht as addAnimal,vt as addTree,Et as buildHero,rt as pl};
