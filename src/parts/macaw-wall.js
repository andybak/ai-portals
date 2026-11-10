import*as r from"three";import{clamp as oe,lerp as Xe,smoothstep as Ne}from"../kit/core.js";const m0=["#B5472A","#E3261B","#1F5FBF","#F5C518","#2F5E2E","#8A6A45","#EAE3D2"],Jt=300,ge=150,st=40,Ht=45,v0=-1.4,w0=60,$=(l,u,B)=>new r.Vector3(l,u,B),Vt=26,Ie=`
float mwHash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float mwHash1(float p){ return fract(sin(p * 91.3458) * 47453.5453); }
vec3 mwHash3(float p){ return fract(sin(vec3(p * 12.9898, p * 78.233, p * 39.425)) * vec3(43758.5453, 24634.6345, 35734.7341)); }
float mwNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mwHash(i), mwHash(i + vec2(1., 0.)), f.x), mix(mwHash(i + vec2(0., 1.)), mwHash(i + vec2(1., 1.)), f.x), f.y); }
float mwFbm(vec2 p){ return 0.5 * mwNoise(p) + 0.25 * mwNoise(p * 2.03 + 7.1) + 0.125 * mwNoise(p * 4.1 + 3.3) + 0.0625 * mwNoise(p * 8.3 + 1.7); }
`,rt=`
uniform vec3 uSunDir, uSunCol, uSkyCol, uGndCol;
uniform float uShadowY, uWaterY;
float mwSunLine(vec3 p){ return smoothstep(uShadowY - 1.5, uShadowY + 3.0, p.y + 1.2 * sin(p.x * 0.11) + 0.8 * sin(p.x * 0.37 + 1.3)); }
vec3 mwAmbient(vec3 n){ return mix(uGndCol, uSkyCol, clamp(n.y * 0.5 + 0.5, 0., 1.)); }
`,g0=`
uniform float uTe, uTime, uBack;
uniform vec4 uScare, uTrk, uRt, uSkL, uSkQ, uHold, uHoldR;
uniform vec3 uHoldP;
float mwGo(float tau){ return tau * tau / (tau + 0.5); }
float mwDip(float tau){ float k = tau / 0.45; return -1.3 * k * exp(1.0 - k); }
// the wheel is a closed loop flown at one speed: uLoop = 24 points spaced evenly along it (a uniform Catmull-Rom spline runs
// through them), uTrk.z = its length in metres, uTrk.w = m/s (uTrk.x = the lowest a flying bird goes); s = metres along it, lat = metres to the left of travel
uniform vec3 uLoop[24];
vec3 mwLoopPt(float f){
  float i = floor(f), t = f - i;
  vec3 p0 = uLoop[int(mod(i + 23.0, 24.0))], p1 = uLoop[int(mod(i, 24.0))], p2 = uLoop[int(mod(i + 1.0, 24.0))], p3 = uLoop[int(mod(i + 2.0, 24.0))];
  return 0.5 * (2.0 * p1 + (p2 - p0) * t + (2.0 * p0 - 5.0 * p1 + 4.0 * p2 - p3) * t * t + (3.0 * p1 - p0 - 3.0 * p2 + p3) * t * t * t);
}
vec3 mwWheel(float s, float lat, float hy){
  float P = max(uTrk.z, 1.0), f = mod(s, P) / P * 24.0;
  vec3 c = mwLoopPt(f), d = mwLoopPt(f + 0.25) - c;
  vec2 o = normalize(vec2(d.z, -d.x) + vec2(1e-5, 0.0));
  return vec3(c.x + o.x * lat, c.y + hy, c.z + o.y * lat);
}
// the skein's line: an open route of 48 points, point k being where the line is at flush time uRt.x + k * uRt.y (it is the
// world's own camera line, so a bird that flies it some seconds ahead of the clock stays that far ahead of the lens)
uniform vec3 uRoute[48];
vec3 mwRoutePt(float f){
  f = clamp(f, 0.0, 46.999);
  float i = floor(f), t = f - i;
  vec3 p0 = uRoute[int(max(i - 1.0, 0.0))], p1 = uRoute[int(i)], p2 = uRoute[int(min(i + 1.0, 47.0))], p3 = uRoute[int(min(i + 2.0, 47.0))];
  return 0.5 * (2.0 * p1 + (p2 - p0) * t + (2.0 * p0 - 5.0 * p1 + 4.0 * p2 - p3) * t * t + (3.0 * p1 - p0 - 3.0 * p2 + p3) * t * t * t);
}
`;class lt{constructor(){this.p=[],this.a=[],this.c=[],this.i=[]}get n(){return this.p.length/3}v(u,B,s,T=0,L=0,y=0,F=0,b=null){return this.p.push(u,B,s),this.a.push(T,L,y,F),b?this.c.push(b.r,b.g,b.b):this.c.push(1,1,1),this.p.length/3-1}tri(u,B,s){this.i.push(u,B,s)}quad(u,B,s,T){this.i.push(u,B,s,u,s,T)}loft(u,B){let s=null;for(const T of u){const L=T.a||[0,0,0,0];let y;if(!(T.rx>0))y=[this.v(T.x||0,T.y||0,T.z,L[0],L[1],L[2],L[3],T.col)];else{y=[];for(let F=0;F<B;F++){const b=F/B*Math.PI*2+(T.twist||0);y.push(this.v((T.x||0)+Math.cos(b)*T.rx,(T.y||0)+Math.sin(b)*T.ry,T.z,L[0],L[1],L[2],L[3],T.col))}}if(s)for(let F=0;F<B;F++){const b=(F+1)%B;s.length===1&&y.length>1?this.tri(s[0],y[b],y[F]):y.length===1&&s.length>1?this.tri(s[F],s[b],y[0]):y.length>1&&this.quad(s[F],s[b],y[b],y[F])}s=y}}build(u=!1){const B=new r.BufferGeometry;return B.setAttribute("position",new r.Float32BufferAttribute(this.p,3)),B.setAttribute("aPart",new r.Float32BufferAttribute(this.a,4)),u&&B.setAttribute("color",new r.Float32BufferAttribute(this.c,3)),B.setIndex(this.i),B.computeVertexNormals(),B}}function pt(l,u,B,s=0,T=null){const L=l.p.length/3,y=new r.Vector3;for(let F=0;F<u.p.length;F+=3)y.set(u.p[F],u.p[F+1],u.p[F+2]).applyMatrix4(B),l.p.push(y.x,y.y,y.z),l.c.push(u.c[F],u.c[F+1],u.c[F+2]),l.s.push(s*u.a[F/3*4]),T?l.x.push(T[0],T[1]*u.a[F/3*4],T[2]):l.x.push(0,0,0);for(const F of u.i)l.i.push(L+F)}function y0(l,u){const B=u.range(0,900),s=u.range(55,58),T=u.range(-95,-60),L=u.range(5.6,7),y=u.range(.042,.058),F=u.range(.44,.58),b=H=>{const d=Ne(ge,92,Math.abs(H));return st*(.14+.86*d)*(.94+.07*l.n2(H*.013+B,3.3))};return{raw:(H,d)=>{const D=b(H),x=oe(d/D,0,1);let P=7*Math.pow(1-x,1.3)+2.6*Math.pow(1-x,6);P+=3.2*l.n2(H*.011+B,9.1);const q=H*y+.5*l.n2(H*.02+B,d*.035),Y=1-Math.abs(l.n2(q+B,7.7+d*.004));P+=3*(Y*Y-.5)*(.3+.7*x);const ce=1-Math.abs(l.n2(H*.17+B,2.2+d*.012));P+=.8*(ce*ce-.5)*x;const Q=d*F+.9*l.n2(H*.03+B,d*.1+5),Me=Q-Math.floor(Q);P+=.5*(.5-Me)*Ne(0,.14,Me),P+=1.1*Ne(.84,.96,x);const Ae=Ne(0,.12,x)*(1-Ne(.5,.92,x)),Re=(H-s)/L,v=(H-T)/8.5;return P+=9*Math.exp(-Re*Re)*Ae*(1+.12*l.n2(H*.3,d*.3)),P+=4.5*Math.exp(-v*v)*Ae,P+=.3*l.fbm2(H*.31+B,d*.31,3),P},topH:b,xb:s,xb2:T}}const b0=`
attribute vec2 aBake;
varying vec3 vP, vN; varying vec2 vBake;
#include <common>
#include <fog_pars_vertex>
void main(){
  vP = position; vN = normal; vBake = aBake;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,x0=`
varying vec3 vP, vN; varying vec2 vBake;
uniform vec3 uClay, uOchre, uGrey, uSoil, uPale;
uniform float uWet, uHarpyOn, uBandY, uSeedF;
uniform vec3 uHarpy, uHarpyW, uHarpyF, uCamL;
uniform float uHarpyFlap;
#include <common>
#include <fog_pars_fragment>
${Ie}
${rt}
float mwHarpyShadow(vec3 p){
  vec3 d = uHarpy - p; float t = dot(d, uSunDir);
  vec3 o = d - uSunDir * t;
  float a = dot(o, uHarpyW), b = dot(o, uHarpyF);
  float d1 = length(vec2(a / (2.2 + 0.7 * uHarpyFlap), (b - 0.15) / 0.8));
  float d2 = length(vec2(a / 0.7, (b + 0.5) / 1.7));
  float s = min(d1, d2);
  return 1.0 - 0.9 * smoothstep(1.3, 0.55, s) * step(0.0, t) * uHarpyOn;
}
// relief the mesh is too coarse to carry (metres out of the face): rain flutes three metres apart with rills between them, hard
// beds that stand out as ledges with an undercut beneath, and hollows the birds have dug into the soft bands. cav = how deep in
// a hollow this point lies (0..1); fine fades the rills out with distance
float mwRelief(vec2 q, float y, float fine, out float cav){
  float fl = abs(mwNoise(vec2(q.x * 0.31, y * 0.045 + 3.0)) * 2.0 - 1.0);
  float h = 0.6 * fl * (2.0 - fl);
  float rl = abs(mwNoise(vec2(q.x * 1.25 + 9.0, y * 0.09)) * 2.0 - 1.0); h += 0.17 * rl * fine;
  float bc = y * 0.62 + 0.9 * mwNoise(vec2(q.x * 0.035, y * 0.2 + 7.0)), bf = fract(bc), hard = step(0.42, mwHash1(floor(bc) + 5.0));
  h += hard * 0.34 * smoothstep(0.0, 0.11, bf) * (1.0 - 0.7 * smoothstep(0.5, 1.0, bf));
  vec2 hc = vec2(q.x / 3.4, y / 2.6), hi = floor(hc), hf = fract(hc) - 0.5 - 0.3 * (vec2(mwHash(hi + 3.1), mwHash(hi + 7.7)) - 0.5);
  float hr = length(hf * vec2(3.4, 2.6)) / (0.5 + 0.6 * mwHash(hi + 1.3));
  cav = step(0.6, mwHash(hi + 9.9)) * (1.0 - smoothstep(0.3, 1.0, hr));
  return h - 0.75 * cav;
}
void main(){
  vec3 n0 = normalize(vN + vec3(0., 0., 1e-5));
  vec2 q = vec2(vP.x + 0.6 * vP.z, vP.y);
  float h = vP.y + 0.012 * vP.x + 1.5 * mwNoise(vec2(q.x * 0.045, vP.y * 0.22));
  float b = h * 0.36 + uSeedF, bi = floor(b), bf = fract(b);
  float r = mix(mwHash1(bi), mwHash1(bi + 1.0), smoothstep(0.74, 1.0, bf));
  vec3 alb = mix(uClay, uOchre, smoothstep(0.55, 0.85, r));
  float ty = vP.y - uWaterY, toe0 = smoothstep(9.0, 3.0, ty), dC = distance(uCamL, vP);
  alb = mix(alb, uGrey, smoothstep(0.86, 0.96, r) * (1.0 - 0.6 * toe0));
  alb = mix(alb, uClay * vec3(0.66, 0.6, 0.62), smoothstep(0.22, 0.04, r));
  alb *= 0.88 + 0.24 * mwHash1(floor(h * 3.1));
  float g = mwFbm(q * vec2(1.3, 2.6));
  float gx = mwFbm((q + vec2(0.18, 0.0)) * vec2(1.3, 2.6)) - g, gy = mwFbm((q + vec2(0.0, 0.12)) * vec2(1.3, 2.6)) - g;
  alb *= (0.76 + 0.46 * g) * (0.9 + 0.2 * mwNoise(q * vec2(9.0, 15.0)));
  float st = mwNoise(vec2(q.x * 2.3, vP.y * 0.035)) * mwNoise(vec2(q.x * 0.31, vP.y * 0.03 + 3.0));
  alb *= 1.0 - 0.34 * smoothstep(0.3, 0.62, st) * (0.55 + 0.45 * uWet);
  // paler, freshly scraped clay where the birds feed
  float band = smoothstep(9.0, 3.0, abs(vP.y - uBandY));
  float pock = smoothstep(0.62, 0.8, mwNoise(q * vec2(0.9, 1.5) + 11.0));
  alb = mix(alb, uPale, 0.25 * band * pock);
  // close range: thin laminations, pits and fine cracks (fade before they could alias)
  float nearK = 1.0 - smoothstep(16.0, 55.0, dC);
  float lam = mwNoise(vec2(q.x * 0.5, vP.y * 8.0)), pit = mwNoise(q * vec2(4.0, 6.0)) * mwNoise(q * vec2(11.0, 15.0) + 3.0);
  float crk = smoothstep(0.08, 0.0, abs(mwNoise(q * vec2(1.7, 0.9) + 21.0) - 0.5)) * smoothstep(0.4, 0.7, mwNoise(q * 0.5 + 5.0));
  alb *= 1.0 - nearK * (0.2 * smoothstep(0.5, 0.8, lam) + 0.38 * smoothstep(0.25, 0.55, pit) + 0.45 * crk - 0.1);
  gy += nearK * (lam - 0.5) * 0.35;
  // the toe of the wall: thin beds standing out as ledges, each jointed into blocks of its own tone, the seams and joints dark;
  // wet and dark at the waterline with a pale line of dried silt above it (fades with distance before the beds could alias)
  float toe = toe0 * (1.0 - smoothstep(70.0, 150.0, dC));
  float bedC = vP.y * 2.9 + 1.3 * mwNoise(vec2(q.x * 0.21, vP.y * 0.6)) + 0.4 * mwNoise(q * vec2(1.1, 0.4) + 7.0), bedF = fract(bedC), bedH = mwHash1(floor(bedC) + 3.0);
  float ledge = smoothstep(0.0, 0.16, bedF) * (1.0 - smoothstep(0.84, 1.0, bedF));
  float jc = q.x * (0.36 + 0.5 * bedH) + 13.0 * bedH + 0.5 * mwNoise(vec2(q.x * 0.9, bedC)), jf = fract(jc);
  float joint = 1.0 - smoothstep(0.0, 0.07, min(jf, 1.0 - jf)), blockT = mwHash1(floor(jc) + 17.0 * floor(bedC));
  alb = mix(alb, alb * (0.6 + 0.6 * blockT) * vec3(0.95, 0.88, 0.84), toe);
  alb *= 1.0 - toe * (0.6 * (1.0 - ledge) + 0.5 * joint * ledge);
  gy += toe * (0.5 - bedF) * 0.8 * ledge;
  float top = smoothstep(0.5, 0.85, n0.y);
  // ledges, flutes and hollows, lit by the raking sun (they fade before they could alias, the rills first)
  float relK = (1.0 - smoothstep(190.0, 360.0, dC)) * (1.0 - 0.8 * toe0), fineK = 1.0 - smoothstep(45.0, 120.0, dC), re = max(0.07, dC * 0.0026), cav, cv2;
  float h0 = mwRelief(q, vP.y, fineK, cav), sx = clamp((mwRelief(q + vec2(re, 0.0), vP.y, fineK, cv2) - h0) / re, -1.6, 1.6), sy = clamp((mwRelief(q, vP.y + re, fineK, cv2) - h0) / re, -1.6, 1.6);
  gx += relK * sx * 0.62; gy += relK * sy * 0.62;
  alb *= 1.0 - relK * (0.5 * cav + 0.12 * (0.6 - h0));
  alb = mix(alb, uSoil * (0.7 + 0.6 * g), top);
  float tn = mwNoise(vec2(q.x * 0.55, 3.0)), foot = smoothstep(2.4, 0.2, ty), wetL = smoothstep(1.0, 0.25, ty + 0.5 * tn);
  alb *= mix(1.0, 0.62, foot) * mix(1.0, 0.7, uWet) * mix(1.0, 0.6, wetL);
  alb = mix(alb, uPale * 0.75, 0.3 * smoothstep(0.2, 0.0, abs(ty - 1.15 - 0.5 * tn)) * toe0);
  vec3 n = normalize(n0 + vec3(-gx * 1.3, -gy * 1.3, 0.0) * (1.0 - top));
  float nl = max(dot(n, uSunDir), 0.0);
  // the baked cast shadows (gullies, the buttress): one clear edge, a little ragged with the clay, instead of a soft smear; in
  // them the wall is lit by the sunlit clay opposite and by the sky, so a shadow is deep red-violet, never a black patch
  float cshd = smoothstep(0.3, 0.62, vBake.x + 0.22 * (g - 0.47) + 0.1 * (mwNoise(q * vec2(0.7, 1.1) + 31.0) - 0.5));
  float vis = cshd * mwSunLine(vP) * mwHarpyShadow(vP) * (1.0 - 0.55 * relK * cav * step(0.0, sx + 0.35 * sy));
  vec3 col = alb * (uSunCol * nl * vis + mwAmbient(n) * vBake.y);
  col += alb * (uClay * uSunCol * 0.3 + uSkyCol * 0.22) * (1.0 - cshd) * mwSunLine(vP) * vBake.y;          // warm bounce and sky in the gullies
  vec3 vdir = normalize(uCamL - vP + vec3(0., 1e-4, 0.));
  col += uSkyCol * (0.05 * foot + 0.12 * uWet) * (0.04 + 0.96 * (1.0 - max(dot(vdir, n), 0.0)));
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`;async function k0(l,u,B,s){const y=[1.2,4,10,22],F=[.55,.95,.7,-2.5],b=46+y.length,W=281,H=Jt/280,d=new Float32Array(W*45),D=new Float32Array(W);for(let v=0;v<W;v++){await s.yield();const O=-ge+v*H;D[v]=l.topH(O);for(let ee=0;ee<=44;ee++)d[v*45+ee]=l.raw(O,ee/44*D[v])}const x=v=>{const O=oe((v+ge)/H,0,279.9999),ee=Math.floor(O),R=O-ee;return D[ee]*(1-R)+D[ee+1]*R},P=(v,O)=>{if(v<-ge||v>ge)return-1e3;const ee=oe((v+ge)/H,0,280-1e-4),R=Math.floor(ee),K=ee-R,X=D[R]*(1-K)+D[R+1]*K,ne=O/X;if(ne>1||ne<0)return-1e3;const ue=Math.min(ne*44,44-1e-4),He=Math.floor(ue),Ce=ue-He,J=R*45+He,ye=J+44+1;return(d[J]*(1-Ce)+d[J+1]*Ce)*(1-K)+(d[ye]*(1-Ce)+d[ye+1]*Ce)*K},q=new Float32Array(W*b*3),Y=new Float32Array(W*b*2),ce=[];for(let v=0;v<W;v++){await s.yield();const O=-ge+v*H,ee=D[v],R=d[v*45+44];for(let K=0;K<b;K++){let X,ne,ue=1,He=1;if(K===0)X=-3,ne=d[v*45]+2.5,ue=0,He=.6;else if(K<=45){const J=K-1;X=J/44*ee,ne=d[v*45+J];let ye=0;for(let z=1;z<=34;z++){const V=O+u.x*z,Z=X+u.y*z,k=ne+u.z*z,E=P(V,Z);if(E<-900){if(V<-ge||V>ge||Z>x(V))break;continue}ye=Math.max(ye,E-k-.02*z)}ue=1-Ne(0,.8,ye);let qe=0,S=0;for(let z=-4;z<=4;z++){const V=v+z;V<0||V>=W||(qe+=d[V*45+J],S++)}He=oe(.84+.3*(ne-qe/S),.42,1.12)}else{const J=K-44-2;X=ee+F[J]+.25*Math.sin(O*.7+J),ne=R-y[J],He=.9}const Ce=(v*b+K)*3;q[Ce]=O,q[Ce+1]=X,q[Ce+2]=ne,Y[(v*b+K)*2]=ue,Y[(v*b+K)*2+1]=He}}await s.yield();for(let v=0;v<280;v++)for(let O=0;O<b-1;O++){const ee=v*b+O,R=ee+b;ce.push(ee,R,R+1,ee,R+1,ee+1)}await s.yield();const Q=new r.BufferGeometry;Q.setAttribute("position",new r.BufferAttribute(q,3)),Q.setAttribute("aBake",new r.BufferAttribute(Y,2)),Q.setIndex(ce),await s.yield(),Q.computeVertexNormals();const Me=new r.ShaderMaterial({uniforms:B,vertexShader:b0,fragmentShader:x0,fog:!0}),Ae=new r.Mesh(Q,Me);return Ae.frustumCulled=!1,{mesh:Ae,zAt:P,topAt:x,normalAt:(v,O,ee)=>{const K=(l.raw(v+.6,O)-l.raw(v-.6,O))/1.2,X=(l.raw(v,O+.6)-l.raw(v,Math.max(0,O-.6)))/(2*.6);return ee.set(-K,-X,1).normalize()},tris:ce.length/3}}const z0=`
attribute vec3 aCol, aAux; attribute float aSway;
varying vec3 vP, vN, vC, vAux; varying float vSw;
uniform float uTime;
#include <common>
#include <fog_pars_vertex>
void main(){
  vec3 p = position; float w = aSway;
  p.x += w * (0.16 * sin(uTime * 1.3 + position.x * 0.35 + position.y * 0.6) + 0.06 * sin(uTime * 2.9 + position.z * 1.7 + position.x));
  p.z += w * 0.12 * sin(uTime * 1.1 + position.x * 0.5 + 1.7);
  vP = p; vN = normal; vC = aCol; vSw = aSway; vAux = aAux;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,S0=`
varying vec3 vP, vN, vC, vAux; varying float vSw;
uniform vec3 uCamL, uBlkClay, uBlkOchre;
#include <common>
#include <fog_pars_fragment>
${Ie}
${rt}
void main(){
  vec3 n = normalize(vN + vec3(0., 1e-5, 0.)); if (!gl_FrontFacing) n = -n;
  vec3 fdx = dFdx(vP), fdy = dFdy(vP);
  float leaf = step(0.001, vSw);
  float m = mwNoise(vP.xy * 2.6 + vP.z * 1.9), m2 = mwNoise(vP.xz * 7.0 + vP.y * 5.0);
  float line = mwSunLine(vP);
  vec3 col;
  if (vAux.x > 1.5) {
    // a slumped block of the cliff: flat broken faces, its own tilted bedding, cracks; dark and wet at the waterline
    vec3 toC = uCamL - vP, V = toC / max(length(toC), 1e-3);
    vec3 fn = normalize(cross(fdx, fdy) + vec3(0., 1e-6, 0.)); if (dot(fn, V) < 0.0) fn = -fn;
    // beds a third of a metre thick, square to the block's own axis: red clay, ochre, here and there a pale one; dark seams
    float hb = vAux.y * 2.1 + vAux.z * 31.0 + 0.5 * m + 0.25 * mwNoise(vP.xz * 0.9 + 9.0), bi = floor(hb), bf = fract(hb), r = mwHash1(bi + vAux.z * 57.0), r2 = mwHash1(bi * 1.7 + 3.0);
    vec3 alb = mix(uBlkClay, uBlkOchre, 0.75 * step(0.78, r)) * (0.86 + 0.2 * r2);
    alb = mix(alb, uBlkOchre * 1.2 + 0.04, step(0.95, r));
    alb *= 1.0 - 0.2 * (1.0 - smoothstep(0.0, 0.14, bf) * (1.0 - smoothstep(0.86, 1.0, bf)));
    alb *= 0.9 + 0.2 * m2;
    alb *= 1.0 - 0.5 * smoothstep(0.03, 0.0, abs(mwNoise(vP.xz * 0.6 + vP.y * 0.8 + 5.0) - 0.5));        // a crack or two
    float ty = vP.y - uWaterY, tn = mwNoise(vP.xz * 0.9 + 2.0), wet = smoothstep(0.95, 0.75, ty + 0.3 * tn);
    alb *= mix(1.0, 0.22, wet);                                                                          // dark and wet to the last high water
    alb = mix(alb, uBlkOchre * 1.2 + 0.05, 0.4 * smoothstep(0.08, 0.0, abs(ty + 0.3 * tn - 0.99)));     // and a pale line of dried silt above it
    float nl = max(dot(fn, uSunDir), 0.0), ao = 0.55 + 0.45 * smoothstep(-0.2, 1.4, ty);
    vec3 amb = mwAmbient(fn); amb = mix(amb, vec3(dot(amb, vec3(0.3, 0.55, 0.15))), 0.55) * (0.85 + 0.75 * max(fn.y, 0.0));
    col = alb * (uSunCol * nl * max(line, 0.3) * 0.9 + (amb * 1.15 + uBlkClay * 0.3 * max(-fn.z, 0.0) * (0.3 + 0.7 * line)) * ao);
    col += uSkyCol * 0.2 * wet * pow(1.0 - max(dot(V, fn), 0.0), 2.0);
  } else {
    vec3 alb = vC * mix(0.85 + 0.3 * m, 0.55 + 0.6 * m + 0.35 * m2 * m2, leaf);
    n = normalize(n + leaf * 0.5 * vec3(m - 0.5, m2 - 0.3, 0.5 - m2));
    float nl = max(dot(n, uSunDir), 0.0);
    col = alb * (uSunCol * nl * line + mwAmbient(n));
    col += leaf * alb * vec3(0.9, 1.0, 0.35) * uSunCol * 0.22 * max(dot(-n, uSunDir), 0.0) * line;
  }
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,M0=`
attribute vec4 aQ;
varying vec4 vQ; varying vec3 vP;
#include <common>
#include <fog_pars_vertex>
void main(){
  vQ = aQ; vP = position;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,A0=`
varying vec4 vQ; varying vec3 vP;
uniform float uTime; uniform vec3 uFoam;
#include <common>
#include <fog_pars_fragment>
${Ie}
${rt}
void main(){
  float x = vQ.x, y = vQ.y, h = vQ.z, R = vQ.w, t = uTime;
  float rd = length(vec2(x, y)), n1 = mwNoise(vec2(x * 0.55 - t * 0.8 + h * 30.0, y * 1.5 + h * 7.0)), n2 = mwNoise(vec2(x * 1.9 - t * 1.5, y * 4.5 + h * 3.0));
  float n3 = mwNoise(vec2(x, y) * 1.7 + vec2(t * 0.35, -t * 0.2) + h * 20.0);
  float collar = smoothstep(0.95, 0.1, abs(rd - R * 1.42 - 0.2)) * smoothstep(0.1, 0.4, n3);       // the ring of foam stands clear of the block's own waterline
  float w = R * (0.75 + 0.1 * max(x, 0.0)), down = smoothstep(-0.3 * R, 0.8 * R, x) * (1.0 - smoothstep(0.45 * (3.5 + 2.5 * R), 3.5 + 2.5 * R, x));
  float wake = exp(-(y * y) / max(w * w, 0.01) * 1.6) * smoothstep(0.34, 0.7, n1) * (0.45 + 0.55 * n2);
  float sh = abs(abs(y) - w * 0.95 + 0.35 * sin(x * 0.8 - t * 1.4 + h * 6.0));
  float shear = smoothstep(0.26, 0.0, sh) * smoothstep(0.25, 0.6, n1 + 0.15);
  float a = clamp(1.3 * collar + down * (0.95 * wake + 0.8 * shear), 0.0, 0.9);
  a *= smoothstep(R * 0.92, R * 1.05, rd) * (1.0 - smoothstep(0.75 * (1.6 * R + 0.8), 1.6 * R + 0.8, abs(y)));
  if (a < 0.01) discard;
  vec3 fa = mix(uGndCol, uSkyCol, 0.8);
  vec3 col = uFoam * (uSunCol * 0.5 * mwSunLine(vP) + mix(fa, vec3(dot(fa, vec3(0.3, 0.55, 0.15))), 0.5) * 1.5);
  gl_FragColor = vec4(col, a);
  #include <fog_fragment>
}`;function e0(l,u,B,s,T,L=0){const y=new r.Vector3,F=new r.Vector3,b=new r.Vector3,W=new r.Vector3;let H=null;for(let d=0;d<u.length;d++){const D=u[Math.max(0,d-1)],x=u[Math.min(u.length-1,d+1)];y.subVectors(x,D).normalize(),W.set(0,0,1),Math.abs(y.z)>.9&&W.set(1,0,0),F.crossVectors(y,W).normalize(),b.crossVectors(y,F);const P=[],q=B[d];for(let Y=0;Y<s;Y++){const ce=Y/s*Math.PI*2,Q=Math.cos(ce)*q,Me=Math.sin(ce)*q;P.push(l.v(u[d].x+F.x*Q+b.x*Me,u[d].y+F.y*Q+b.y*Me,u[d].z+F.z*Q+b.z*Me,L,0,0,0,T))}if(H)for(let Y=0;Y<s;Y++){const ce=(Y+1)%s;l.quad(H[Y],H[ce],P[ce],P[Y])}H=P}}async function C0(l,u,B,s,T,L,y,F=0){const b={p:[],c:[],s:[],x:[],i:[]},W=new r.Matrix4,H=new r.Quaternion,d=new r.Euler,D=new r.Color(T[4]),x=new r.Color(T[0]),P=new r.Color(T[5]),q=new r.Color(T[6]),Y=(S,z,V=0)=>{const Z=S.clone();return Z.offsetHSL(V,0,0),Z.multiplyScalar(z)},ce=(S,z,V,Z,k,E)=>{const Se=new lt,be=l.range(-.045,.05),Ve=l.range(.5,1.05),me=l.range(0,6),le=(xe,ve,te)=>({z:xe,rx:ve*l.range(.85,1.15),ry:ve*l.range(.85,1.15),x:l.range(-.12,.12),y:l.range(-.12,.12),twist:me+l.range(-.2,.2),a:[xe,0,0,0],col:Y(D,Ve*te,be)});Se.loft([le(-.2,.75,.45),le(.35,1.05,.75),le(.8,.78,1.1),{z:1,rx:0,x:l.range(-.3,.3),y:l.range(-.3,.3),a:[1,0,0,0],col:Y(D,Ve*1.35,be+.02)}],8),W.compose($(S,z,V),H.setFromEuler(d.set(-Math.PI/2,0,l.range(0,6.28),"YXZ")),$(Z,E,k)),pt(b,Se,W,.9)},Q=[];for(let S=-ge+1,z=0;S<ge-1;S+=l.range(1.1,1.8),z++){(z&7)===0&&await y.yield();const V=s.topAt(S),Z=s.zAt(S,V*.999);if(Q.push($(S,V,Z)),l.chance(.86)){const k=l.range(.9,2);ce(S,V+.1,Z-l.range(.4,2.4),k*l.range(1.2,1.9),k*l.range(.6,1.2),k*l.range(1,1.5))}if(l.chance(.5)){const k=l.range(2.5,5);ce(S+l.range(-1,1),V+.4,Z-l.range(4,13),k*l.range(1,1.4),k*l.range(.8,1.5),k)}}await y.yield();for(let S=0;S<46;S++){const z=l.range(-ge+12,ge-12),V=s.topAt(z),Z=l.range(2,7.5),k=l.range(.18,.6),E=new lt,Se=Y(D,l.range(.5,1),l.range(-.03,.03));let be=null,Ve=null;for(let me=0;me<=3;me++){const le=V+.4-me/3*Z,xe=Math.max(s.zAt(z,Math.min(le,V*.999)),-900)+.3+.25*me,ve=k*(1-.2*me),te=E.v(z-ve,le,xe+.1,me/3,0,0,0,Se),Pe=E.v(z+ve,le-l.range(0,.5),xe,me/3,0,0,0,Se);be!==null&&E.quad(be,Ve,Pe,te),be=te,Ve=Pe}pt(b,E,W.identity(),.8)}await y.yield();const Me=[],Ae=[],Re=l.int(7,10);for(let S=0;S<Re;S++){const z=Xe(-118,118,(S+l.range(.15,.85))/Re),V=s.topAt(z),Z=s.zAt(z,V*.999),k=new lt,E=l.range(7,12),Se=l.range(.15,.45),be=l.range(-.25,.25),Ve=Y(P.clone().lerp(q,.35),l.range(.7,1)),me=[],le=[];for(let ve=0;ve<=5;ve++){const te=ve/5;me.push($(z+be*E*te*te,V-1+E*te,Z-1.2+Se*E*te*(.4+.6*te))),le.push(.34*(1-.8*te)+.03)}e0(k,me,le,6,Ve),Ae.push(me[5].clone());const xe=l.int(3,5);for(let ve=0;ve<xe;ve++){const te=l.range(.42,.92),Pe=me[Math.round(te*5)],Be=l.range(-1.1,1.1)+(ve%2?0:Math.PI*0),We=l.range(2.2,4.6),_=l.range(.15,.6),De=$(Math.sin(Be),0,Math.cos(Be)),Ue=[],I=[];for(let ke=0;ke<=3;ke++){const se=ke/3;Ue.push($(Pe.x+De.x*We*se,Pe.y+_*We*se*(.5+.5*se),Pe.z+De.z*We*se)),I.push(.13*(1-.75*se)+.02)}e0(k,Ue,I,5,Ve);for(let ke=0;ke<2;ke++){const se=l.range(.3,.95),Te=Ue[0].clone().lerp(Ue[3],se);Te.y=Pe.y+_*We*se*(.5+.5*se)+.1,Me.push({p:Te,n:$(-De.z*(ke?1:-1),0,De.x*(ke?1:-1)).lerp($(0,0,1),.5).normalize(),t:$(De.x,0,De.z)})}}pt(b,k,W.identity(),0)}await y.yield();const v=[],O=[],ee=[];for(let S=-ge+6;S<ge-6;S+=l.range(2.5,7)){v.push($(S,0,s.zAt(S,.01)+2.5));for(let z=0;z<34;z++)l()}const R=y.core&&y.core.makeRng?y.core.makeRng("macaw-talus:"+y.seed):l,K=y.core&&y.core.makeRng?y.core.makeRng("macaw-talus2:"+y.seed):l,X=(S,z,V,Z,k)=>{const E=new lt,Se=R.range(0,6.28),be=R.range(.7,.95)*K.range(.55,.92),Ve=R.range(-.16,.16),me=R.range(-.16,.16),le=[],xe=K()<.4?6:5,ve=K.range(0,6.28),te=K.range(.06,.24),Pe=[];for(let I=0;I<xe;I++)Pe.push(K.range(.74,1.16));for(const[I,ke]of[[0,1],[.52,R.range(.95,1.07)],[1,be]]){const se=[];for(let Te=0;Te<xe;Te++){const Ke=Te<4?R:K,_e=Se+Te*6.2832/xe+Ke.range(-.22,.22),Ye=ke*1.3*Ke.range(.84,1.14)*Pe[Te];se.push(E.v(Ve*I+Math.cos(_e)*Ye,me*I+Math.sin(_e)*Ye,I>.9?I+Ke.range(-.13,.05)+te*Math.cos(_e-ve):I,I))}le.push(se)}for(let I=0;I<2;I++)for(let ke=0;ke<xe;ke++){const se=(ke+1)%xe;E.quad(le[I][ke],le[I][se],le[I+1][se],le[I+1][ke])}for(let I=1;I<xe-1;I++)E.tri(le[2][0],le[2][I],le[2][I+1]);const Be=V*R.range(.3,.52),We=V*R.range(.26,.44),_=R.range(.26,.4),De=R.range(0,6.28);W.compose($(S,F-_*V,z),H.setFromEuler(d.set(-Math.PI/2+Z,k,De)),$(Be,We,V)),pt(b,E,W,0,[2,V,R()]);const Ue=.5*(Be+We)*1;O.push({x:S+.3*V*Math.sin(k),z:z+.3*V*Math.sin(Z),r:Ue,h:V}),V>1.7&&Math.abs(Z)<.4&&Math.abs(k)<.4&&ee.push({p:$(Ve,me,.99).applyMatrix4(W),r:Math.min(Be,We)*be*.9,x:S})};for(let S=-ge+5,z=0;S<ge-5;z++){(z&7)===0&&await y.yield();const V=S>-70&&S<134,Z=s.zAt(S,Math.max(F,0)+.01);X(S,Z+R.range(.3,1.2),R.range(2.1,V?4.3:3),R.range(-.5,.1),R.range(-.35,.35));const k=V?R.int(1,3):R.int(0,1);for(let E=0;E<k;E++)X(S+R.range(-2.4,2.4),Z+R.range(1.9,3.3)+1.8*E,R.range(1.2,2.8)*(1-.2*E),R.range(-.65,.65),R.range(-.65,.65));S+=V?R.range(2.6,5.2):R.range(4,8.5)}await y.yield();const ne=new r.BufferGeometry;ne.setAttribute("position",new r.Float32BufferAttribute(b.p,3)),await y.yield(),ne.setAttribute("aCol",new r.Float32BufferAttribute(b.c,3)),await y.yield(),ne.setAttribute("aSway",new r.Float32BufferAttribute(b.s,1)),ne.setAttribute("aAux",new r.Float32BufferAttribute(b.x,3)),await y.yield(),ne.setIndex(b.i),ne.computeVertexNormals(),await y.yield();const ue=new r.ShaderMaterial({uniforms:L,vertexShader:z0,fragmentShader:S0,fog:!0,side:r.DoubleSide}),He=new r.Mesh(ne,ue);He.frustumCulled=!1;const Ce=[],J=[],ye=[];for(const S of O){const z=3.5+2.5*S.r,V=1.6*S.r+.8,Z=1.6*S.r+1.1,k=Ce.length/3,E=R();for(const[Se,be]of[[Z,-V],[Z,V],[-z,V],[-z,-V]])Ce.push(S.x+Se,F+.035,S.z+be),J.push(-Se,be,E,S.r);ye.push(k,k+1,k+2,k,k+2,k+3)}const qe=new r.BufferGeometry;return qe.setAttribute("position",new r.Float32BufferAttribute(Ce,3)),qe.setAttribute("aQ",new r.Float32BufferAttribute(J,4)),qe.setIndex(ye),{mesh:He,perches:Me,snagTips:Ae,rim:Q,foot:v,blocks:O,blockTops:ee,foamGeo:qe,tris:b.i.length/3+ye.length/3}}const Ft={sides:6,rows:[0,.45,1],camber:.018,rings:[[-.2,-.005,0,0,0],[-.13,0,.046,.04,0],[-.02,0,.076,.07,0],[.1,.006,.08,.078,0],[.19,.024,.056,.056,0],[.235,.034,0,0,0]],head:{sides:7,rings:[[.186,.03,0,0],[.208,.034,.05,.05],[.252,.043,.066,.068],[.296,.039,.05,.056],[.32,.03,0,0]]},beak:[[.292,.03,.04,.05],[.342,.024,.035,.045],[.384,-.012,.019,.027],[.372,-.07,0,0]],beakSides:5,shoulder:[.07,.035,.105],span:[0,.14,.28,.42,.54,.64],lead:[.04,.068,.06,0,-.09,-.2],chord:[.25,.33,.34,.3,.23,.11],tailZ:-.15,tail:[[-.01,-.014,.54,.028],[.01,.014,.54,.028],[-.028,-.045,.33,.032],[.028,.045,.33,.032]],elbow:.25,chordM:.2,neck:[.02,.19],flap:3.7},t0={sides:4,rows:[0,.5,1],camber:.008,rings:[[-.1,0,0,0,0],[-.05,0,.03,.027,0],[.035,.003,.043,.04,0],[.095,.018,.033,.035,1],[.13,.01,0,0,1]],beak:null,shoulder:[.036,.016,.05],span:[0,.11,.22],lead:[.02,.03,-.06],chord:[.1,.11,.02],tailZ:-.07,tail:[[0,0,.13,.04]],elbow:.09,chordM:.1,neck:[.01,.07],flap:6.2},a0={sides:6,rows:[0,.5,1],camber:.04,rings:[[-.42,0,0,0,0],[-.28,0,.09,.08,0],[-.05,0,.16,.15,0],[.18,.01,.15,.14,0],[.3,.03,.09,.09,0],[.38,.05,.085,.09,1],[.44,.04,.05,.06,1],[.47,.02,0,0,1]],beak:[[.45,.035,.03,.035],[.5,.01,.018,.022],[.51,-.04,0,0]],shoulder:[.13,.06,.16],span:[0,.25,.5,.74,.9,1],lead:[.06,.1,.1,.05,-.04,-.2],chord:[.42,.48,.48,.44,.36,.12],tailZ:-.3,tail:[[-.03,-.07,.42,.08],[.03,.07,.42,.08],[-.09,-.2,.38,.07],[.09,.2,.38,.07]],elbow:.42,chordM:.45,neck:[.03,.3],flap:1.5};function Nt(l){const u=new lt,B=l.rows.length,s=l.span.length,[T,L,y]=l.shoulder,F=(b,W,H)=>{let d=null;for(const D of b){let x;if(!(D[2]>0))x=[u.v(0,D[1],D[0],D[4]??H,0,D[0],0)];else{x=[];for(let P=0;P<W;P++){const q=P/W*Math.PI*2+(W%2?Math.PI/2:0);x.push(u.v(Math.cos(q)*D[2],D[1]+Math.sin(q)*D[3],D[0],D[4]??H,Math.cos(q),D[0],Math.sin(q)))}}if(d)for(let P=0;P<W;P++){const q=(P+1)%W;d.length===1&&x.length>1?u.tri(d[0],x[q],x[P]):x.length===1&&d.length>1?u.tri(d[P],d[q],x[0]):x.length>1&&u.quad(d[P],d[q],x[q],x[P])}d=x}};F(l.rings,l.sides,0),l.head&&F(l.head.rings,l.head.sides,1),l.beak&&F(l.beak,l.beakSides||4,2);for(const b of[1,-1]){const W=[];for(let H=0;H<s;H++)for(let d=0;d<B;d++){const D=l.span[H],x=l.rows[d];W.push(u.v(b*(T+D),L+l.camber*Math.sin(Math.PI*x)*(1-D/l.span[s-1]),y+l.lead[H]-l.chord[H]*x,3,b,D,x))}for(let H=0;H<s-1;H++)for(let d=0;d<B-1;d++){const D=W[H*B+d],x=W[(H+1)*B+d],P=W[(H+1)*B+d+1],q=W[H*B+d+1];b>0?u.quad(D,x,P,q):u.quad(D,q,P,x)}}for(const[b,W,H,d]of l.tail){let D=null,x=null;const P=W===0?0:Math.sign(W);for(let q=0;q<=2;q++){const Y=q/2,ce=b+(W-b)*Y,Q=d*(1-.86*Y*Y),Me=l.tailZ-H*Y,Ae=u.v(ce-Q,.004-.01*Y,Me,4,P,Y,0),Re=u.v(ce+Q,.004-.01*Y,Me,4,P,Y,1);D!==null&&u.quad(D,x,Re,Ae),D=Ae,x=Re}}return u.build()}const P0=`
attribute vec4 aPart;
#ifndef HARPY
attribute vec4 iA, iN, iV, iW, iC, iS, iP; attribute vec3 iQ;
#endif
uniform vec3 uSh, uCamL; uniform vec2 uNeck;
uniform float uElbow, uChordM, uFlapHz;
uniform vec3 uHarpy, uHarpyW, uHarpyF; uniform float uHarpyPh, uHarpyOn;
uniform vec4 uSolo;                                                        // a bird flown from outside (HARPY): species, size, beat amplitude, bank
varying vec3 vN, vBN, vPL, vInfo; varying vec4 vPart;
#include <common>
#include <fog_pars_vertex>
${Ie}
${g0}
vec3 mwFly(float te){
#ifndef HARPY
  te = mix(te, -30.0, uBack * step(iS.w, -0.5));                          // the wall fills again: the clock runs back for every bird that is not of the skein
  float tau = max(te - iA.w, 0.0), seed = iV.w; vec3 h = mwHash3(seed + 3.7);
  vec3 L = iA.xyz + iN.xyz * (0.9 * (1.0 - exp(-tau * 3.0))) + iV.xyz * mwGo(tau) + vec3(0., mwDip(tau) - iS.z * (1.0 - exp(-tau * 1.1)), 0.);
  float wob = sin(te * 0.31 + h.x * 40.0);
  vec3 Wp = mwWheel(iW.x + uTrk.w * iW.w * te, iW.y + 1.2 * sin(te * 0.43 + h.z * 30.0), iW.z + 0.9 * wob + 0.6 * sin(te * 0.37 + h.x * 20.0));
  vec3 p = mix(L, Wp, smoothstep(iS.y, iS.y + 5.9, tau));
  if (iA.w < -6.0) {
    // a bird of the early flight (released long before the flush): past the lens it joins a ring that circles over the river in
    // front of the wall, low in the east and high in the west, and goes up into the wheel with everyone else when the wall bursts
    float ha = uHoldP.x + (h.x - 0.5) * uHoldP.y + uHold.w * (0.85 + 0.3 * h.y) * te, hr = 0.72 + 0.5 * h.z;     // (a crescent of the ring, uHoldP.y rad long, about uHoldP.x at the flush)
    vec3 Hp = uHold.xyz + vec3(uHoldR.x * hr * sin(ha), uHoldR.z * (h.y - 0.5) - uHoldR.w * sin(ha) - uHoldP.z * cos(ha) + 1.2 * sin(te * 0.5 + h.z * 20.0), uHoldR.y * hr * cos(ha));
    p = mix(mix(L, Hp, smoothstep(iS.y, iS.y + 4.5, tau)), Wp, smoothstep(-0.5, 6.0, te - 1.5 * h.z));
  }
  p.y = mix(p.y, max(p.y, uTrk.x + 0.5 * h.y), smoothstep(0.6, 1.6, tau));                 // never under the water
  if (iS.w >= 0.0) {
    // a bird of the skein: it leaves the wheel for the skein's line and flies it a little ahead of the lens, in its own place (hp
    // is shared by the two mates), until its turn comes to settle on its perch in the kapok
    vec3 hp = mwHash3((abs(iC.z) - 1.0) * 913.7 + 2.3);
    float lead = uSkL.x + iS.w * uSkL.y, f = (te + lead - uRt.x) / max(uRt.y, 1e-3);
    vec3 c = mwRoutePt(f), d = mwRoutePt(f + 0.3) - c;
    vec2 o = normalize(vec2(-d.z, d.x) + vec2(1e-5, 0.0));                                    // to the right of travel
    float lat = uSkQ.x + (hp.y - 0.5) * uSkQ.y + 0.55 * sign(iC.z) + 0.5 * sin(te * 0.6 + hp.x * 30.0) + 0.3 * wob;
    float up = uSkQ.z + (hp.z - 0.5) * uSkQ.w - uSkL.z * lead + 0.3 * (h.z - 0.5) + 0.35 * sin(te * 0.9 + hp.x * 9.0);
    vec3 Rp = c + vec3(o.x * lat, up, o.y * lat);
    p = mix(p, Rp, smoothstep(uRt.z, uRt.z + uRt.w, te + 1.5 * (hp.x - 0.5)));
    float land = smoothstep(iP.w - 1.7, iP.w, te);
    p = mix(p, iP.xyz + vec3(0., 1.1 * sin(3.1416 * land) * (1.0 - land), 0.), land);
  }
  vec3 sv = p - uScare.xyz; float sl = length(sv);                        // the flock parts round a stooping eagle
  p += sv / max(sl, 0.2) * uScare.w * (1.0 - smoothstep(0.0, max(uScare.w * 2.6, 0.01), sl));
  return p;
#else
  return uHarpy;
#endif
}
void main(){
  vec3 p = position;
#ifndef HARPY
  float seed = iV.w; vec3 h = mwHash3(seed);
  float teB = mix(uTe, -30.0, uBack * step(iS.w, -0.5));
  float landed = smoothstep(iP.w - 0.55, iP.w + 0.1, uTe), there = step(iP.w - 3.0, uTe);     // settling on the second perch; flying to it
  float tau = teB - iA.w, air = smoothstep(0.0, 0.6, tau) * (1.0 - landed);
  float tt = uTime + h.x * 50.0;
  float flare = smoothstep(0.5, 0.86, sin(tt * (0.5 + 0.4 * h.y)) * sin(tt * 0.163 + h.z * 9.0));
  float per = 3.3 + 4.0 * h.z, hopT = fract(tt / per) * per, hk = clamp(hopT / 1.6, 0.0, 1.0);
  float hop = step(0.01, iC.w) * smoothstep(0.0, 0.1, hk) * (1.0 - smoothstep(0.9, 1.0, hk)) * (1.0 - air);
  float open = max(air, max(flare * 0.8, hop));
  float ph = h.x * 6.283 + 6.2832 * uFlapHz * (0.9 + 0.2 * h.y) * mix(tt * 1.25, tau, step(0.0, tau) * (1.0 - landed));
  float amp = mix(0.5, mix(1.0, 0.46 + 0.34 * h.y, smoothstep(0.5, 5.0, tau)), air);
  // once it is up and away a bird misses a few beats now and then and rides on set wings: no two neighbours hold one pose
  float glide = smoothstep(0.5, 0.9, sin(tau * (0.8 + 0.7 * h.z) + h.x * 40.0)) * smoothstep(3.5, 6.5, tau) * (1.0 - smoothstep(iP.w - 2.5, iP.w - 1.0, uTe));
  amp *= 1.0 - 0.82 * glide;
  amp = mix(amp, 1.0, smoothstep(iP.w - 1.6, iP.w - 0.5, uTe) * air);                          // braking: deep beats as it comes in to the limb
  float sk = step(0.0, iS.w) * smoothstep(uRt.z, uRt.z + uRt.w, uTe);                          // 1 on a bird of the skein once it is on its line
  float size = iC.y, tws = sign(iC.z);
#else
  float air = 1.0, open = 1.0, ph = uHarpyPh, amp = uSolo.z, size = uSolo.y, tt = uTime, glide = 0.0; vec3 h = vec3(0.3);
#endif
  float fold = 1.0 - open;
  float A = 0.1 + 0.1 * glide + amp * sin(ph), B = 0.55 * amp * sin(ph - 1.1) - 0.12;
  float id = aPart.x;
  if (id > 2.5 && id < 3.5) {
    float side = aPart.y, s = aPart.z, s1 = min(s, uElbow), s2 = max(s - uElbow, 0.0);
    float yrel = p.y - uSh.y;
    vec3 fl = vec3(side * (uSh.x + s1 * cos(A) + s2 * cos(A + B)), uSh.y + yrel + s1 * sin(A) + s2 * sin(A + B), p.z + 0.08 * s * cos(ph) * amp);
    float cm = aPart.w * uChordM;
    vec3 fo = vec3(side * (uSh.x * 0.96 + 0.012 + 0.03 * (1.0 - aPart.w)), uSh.y + 0.012 - cm * 0.5, uSh.z + 0.03 - s * 0.66 - cm * 0.15);
    p = mix(fl, fo, fold);
  } else if (id > 3.5) {
    float t = aPart.z;
    p.x *= 1.0 + 0.25 * air * t;
    p.y += t * (0.02 * sin(ph + t * 2.5) * air - 0.03 * fold);
  } else if (id > 0.5) {
    float peck = (1.0 - air) * 0.75 * smoothstep(0.1, 1.0, sin(tt * (1.1 + 0.9 * h.y) + h.z * 6.0)) * step(0.25, h.z);
    vec2 q = vec2(p.y - uNeck.x, p.z - uNeck.y); float cs = cos(peck), sn = sin(peck);
    p.y = uNeck.x + q.x * cs - q.y * sn; p.z = uNeck.y + q.x * sn + q.y * cs;
  }
  p.y += 0.014 * sin(ph + 3.14) * air;
  vec3 P0 = mwFly(uTe);
#ifndef HARPY
  vec3 n = normalize(mix(iN.xyz, iQ, there) + vec3(0., 0., 1e-4));
  vec3 upW = normalize(vec3(0., 1., 0.) - n * n.y + vec3(1e-3, 1e-3, 0.));
  vec3 tw = cross(upW, n);
  float roll = iN.w + (1.0 - air) * 0.22 * sin(tt * 0.23 + h.y * 20.0);
  vec3 Fp = upW * cos(roll) + tw * sin(roll);
  vec3 P1 = mwFly(uTe + 0.08), P2 = mwFly(uTe + 0.38);
  vec3 Ff = normalize(P1 - P0 + n * 1e-3), Fa = normalize(P2 - P1 + n * 1e-3);
  // (the skein flies banked a little toward us, who are behind it: we see the colours of its backs, not wings edge on)
  float bank = clamp((Ff.z * Fa.x - Ff.x * Fa.z) * 6.0 + 0.2 * sin(tt * 0.83 + h.z * 30.0) + sk * 0.34 * sin(tt * 0.5 + h.x * 9.0), -1.0, 1.0);
  vec3 Rf = normalize(cross(vec3(0., 1., 0.), Ff) + vec3(1e-4, 0., 1e-4));
  vec3 Uf = normalize(vec3(0., 1., 0.) + Rf * bank);
  vec3 F = normalize(mix(Fp, Ff, air) + n * 1e-3);
  vec3 Ub = normalize(mix(n, Uf, air) + tw * (tws * 0.9 * sin(air * 3.1416)));
  vec3 base = P0 + n * (0.09 * size) + hop * iC.w * (n * sin(3.1416 * hk) + tw * (0.7 * tws * sin(6.2832 * hk)) + vec3(0., 0.3 * sin(6.2832 * hk) + 0.2 * sin(3.1416 * hk), 0.));
  float dC = distance(base, uCamL), nf = smoothstep(mix(0.8, 1.6, air), mix(1.6, 4.5, air), dC) * step(0.001, iC.y);
  vInfo = vec3(iC.x, mix(mix(iS.x, 1.0, there), 1.0, air), air);
  float fat = 1.0 + clamp(dC - 12.0, 0.0, 280.0) / mix(50.0, 72.0, air);
#else
  vec3 F = normalize(uHarpyF + vec3(0., 0., 1e-4));
  vec3 Ub = normalize(vec3(0., 1., 0.) + uHarpyW * (uSolo.w + 0.12 * sin(ph * 0.11)));
  vec3 base = P0; float dC = distance(base, uCamL), nf = uHarpyOn * smoothstep(0.8, 1.6, dC);
  vInfo = vec3(uSolo.x, 1.0, 1.0);
  float fat = 1.0 + clamp(dC - 12.0, 0.0, 280.0) / 100.0;
#endif
  vec3 R = normalize(cross(Ub, F) + vec3(1e-5, 0., 0.));
  vec3 Uo = cross(F, R);
  vec3 lp = base + (R * p.x + Uo * p.y + F * p.z) * (size * nf * fat);
  vN = R * normal.x + Uo * normal.y + F * normal.z;
  vBN = normal; vPL = lp; vPart = aPart;
  vec4 mvPosition = modelViewMatrix * vec4(lp, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,H0=`
varying vec3 vN, vBN, vPL, vInfo; varying vec4 vPart;
uniform vec3 uRed, uBlue, uYel, uGrn, uCream, uCamL;
uniform float uSpanLen;
#include <common>
#include <fog_pars_fragment>
${Ie}
${rt}
void main(){
  float sc = vInfo.x, id = vPart.x, s = vPart.z, c = vPart.w;
  bool top = gl_FrontFacing;
  vec3 bn = normalize(vBN + vec3(0., 1e-5, 0.));
  float sp = s / uSpanLen;
  float isWing = step(2.5, id) * step(id, 3.5), isTail = step(3.5, id), isHead = step(0.5, id) * step(id, 1.5), isBill = step(1.5, id) * step(id, 2.5);
  vec3 dark = vec3(0.025, 0.025, 0.03);
  vec3 sky = mix(uBlue, vec3(0.08, 0.42, 0.85), 0.45);
  vec3 alb;
  // ---- feathers, in wing coordinates (sp 0 at the shoulder .. 1 at the tip, c 0 at the leading .. 1 at the trailing edge) ----
  // nineteen flight feathers, each ending in its own rounded tip (a scalloped trailing edge, slotted into fingers at the hand),
  // with a dark shaft, each lying over its neighbour; three rows of coverts as overlapping scales. Every term fades out with
  // distance before it could alias, so it is there on the birds near the lens and gone on the far flock
  float fi = (sp + 0.2 * smoothstep(0.45, 1.0, sp) * (c - 0.55)) * 19.0, fwS = fwidth(sp), fwC = fwidth(c);
  float fK = (1.0 - smoothstep(0.3, 0.75, fwidth(fi))) * isWing, fKc = (1.0 - smoothstep(0.3, 0.75, fwS * 30.0)) * isWing;
  float ff = fract(fi), fc = abs(ff - 0.5) * 2.0;
  float cTip = 1.0 - mix(0.07, 0.4, smoothstep(0.5, 0.92, sp)) * fc * fc * fK;
  if (isWing > 0.5 && c > cTip) discard;
  float cov = 0.5 - 0.14 * sp, flight = smoothstep(cov - 0.015, cov + 0.015, c) * isWing;
  float shaft = 1.0 - smoothstep(0.04, 0.15, fc), tipD = smoothstep(cTip - 0.32, cTip - 0.03, c) * mix(0.5, 1.0, smoothstep(0.3, 0.7, sp));
  vec3 navy = vec3(0.012, 0.018, 0.06);
  float cr = clamp(c / max(cov, 0.05), 0.0, 0.999) * 3.0, row = floor(cr), fy = cr - row;
  float cu = sp * (30.0 - 4.0 * row) + 0.5 * row, fx = fract(cu) - 0.5;
  float rim = smoothstep(0.6, 1.0, length(vec2(fx * 2.0, fy)));
  float barb = mix(mix(1.0, 1.0 - 0.5 * rim + 0.12 * (1.0 - fy), fKc), mix(1.0, (0.74 + 0.4 * ff) * (1.0 - 0.45 * shaft), fK), flight);
  barb *= 1.0 - 0.45 * isWing * (1.0 - smoothstep(0.1, 0.3, fwC)) * (1.0 - smoothstep(0.0, 0.04, abs(c - cov)));     // the shadow under the greater coverts
  // a tail streamer is one feather: its shaft and its two vanes
  float tK = (1.0 - smoothstep(0.12, 0.4, fwC)) * isTail;
  barb = mix(barb, 1.0 - tK * (0.35 * (1.0 - smoothstep(0.04, 0.13, abs(c - 0.5))) + 0.12 * step(0.5, c)), isTail);
  // body plumage: a fine lie of feathers
  float bK = (1.0 - smoothstep(0.004, 0.012, fwidth(s))) * (1.0 - isWing) * (1.0 - isTail) * (1.0 - isBill);
  float plume = 1.0 - bK * 0.3 * (mwNoise(vec2((vPart.y + vPart.w) * 6.0, s * 90.0)) - 0.4);
  float sd = abs(vPart.y), upH = vPart.w;                                 // on head and bill: how far round to the side, how far up
  float face = smoothstep(0.3, 0.55, sd) * smoothstep(-0.8, -0.35, upH) * (1.0 - smoothstep(0.35, 0.75, upH)) * smoothstep(0.236, 0.256, s);
  float eyeD = length(vec2((s - 0.27) / 0.016, (upH - 0.22) / 0.26)), eye = (1.0 - smoothstep(0.85, 1.05, eyeD)) * step(0.3, sd);
  float lines = step(0.45, fract(upH * 5.0 + s * 30.0));
  if (sc < 1.5) {                                                          // scarlet (0) and red-and-green (1)
    vec3 red = sc < 0.5 ? uRed : uRed * vec3(0.78, 0.5, 0.7);
    vec3 bandC = sc < 0.5 ? uYel : uGrn * vec3(0.9, 1.55, 0.9);
    alb = red * plume;
    alb = mix(alb, sky, (1.0 - isWing) * (1.0 - isTail) * smoothstep(-0.07, -0.13, s));         // pale blue rump
    if (isWing > 0.5) {
      // lesser coverts red, the band across the median and greater rows grading through green into the blue of the flight
      // feathers, which go dusky toward their tips
      float e1 = cov * 0.36, grade = smoothstep(cov - 0.17, cov + 0.05, c);
      vec3 w = mix(red, bandC, smoothstep(e1 - 0.02, e1 + 0.03, c));
      w = mix(w, mix(bandC, uBlue, 0.55) * vec3(0.8, 1.1, 0.9), smoothstep(0.0, 0.6, grade));
      w = mix(w, mix(uBlue * 1.15, navy, 0.85 * tipD), smoothstep(0.6, 1.0, grade));
      alb = top ? w * barb : mix(red * 0.88, vec3(0.74, 0.27, 0.06) * mix(1.0, 0.6, tipD), smoothstep(0.4, 0.95, c)) * barb;
    }
    if (isTail > 0.5) alb = mix(red, uBlue, max(smoothstep(0.62, 0.95, s), 0.75 * step(0.5, abs(vPart.y)) * step(s, 0.5) * (top ? 1.0 : 0.0))) * barb;
    if (isHead > 0.5) {                                                    // a bare pale face (lined with tiny red feathers on the red-and-green), a pale-ringed dark eye
      alb = mix(red * plume, mix(uCream, red, sc < 0.5 ? 0.0 : 0.45 * lines), face);
      alb = mix(alb, mix(dark, vec3(0.75, 0.7, 0.4), smoothstep(0.5, 0.8, eyeD)), eye);
    }
    if (isBill > 0.5) alb = mix(uCream * 0.95, dark, max(smoothstep(-0.1, -0.5, upH), smoothstep(0.36, 0.378, s) * step(upH, 0.3)));   // horn above, dark below and at the hook
  } else if (sc < 2.5) {                                                   // blue-and-yellow
    vec3 gold = uYel * vec3(1.0, 0.82, 0.6);
    alb = mix(gold, sky, smoothstep(-0.25, 0.2, bn.y)) * plume;
    if (isWing > 0.5) alb = (top ? mix(mix(sky * vec3(0.85, 1.12, 0.95), sky, smoothstep(0.08, 0.3, c)), mix(uBlue * vec3(0.7, 0.8, 1.05), navy, 0.85 * tipD), flight) : mix(gold, gold * mix(0.62, 0.4, tipD), smoothstep(cov - 0.05, cov + 0.25, c))) * barb;
    if (isTail > 0.5) alb = (top ? mix(sky, uBlue * 0.8, s) : gold * 0.85) * barb;
    if (isHead > 0.5) {
      alb = mix(gold, sky, smoothstep(-0.35, 0.15, upH)) * plume;
      alb = mix(alb, uGrn * vec3(0.9, 1.7, 0.9), smoothstep(0.262, 0.285, s) * smoothstep(0.3, 0.6, upH));       // green forehead
      alb = mix(alb, uCream * (0.7 + 0.3 * lines), face);                                                      // white face lined with black
      alb = mix(alb, dark, smoothstep(-0.55, -0.8, upH) * smoothstep(0.236, 0.262, s));                        // black throat
      alb = mix(alb, mix(dark, vec3(0.75, 0.75, 0.5), smoothstep(0.5, 0.8, eyeD)), eye);
    }
    if (isBill > 0.5) alb = dark * 1.6;
  } else if (sc < 4.5) {                                                   // mealy (3) and blue-headed (4) parrots
    vec3 grn = uGrn * vec3(1.0, 1.6, 0.9);
    alb = mix(grn * 0.8, grn * 1.25, smoothstep(-0.4, 0.5, bn.y));
    if (isWing > 0.5) alb = mix(grn, mix(uBlue, dark, 0.3), smoothstep(0.45, 0.8, c) * smoothstep(0.2, 0.6, sp)) * barb;
    if (isTail > 0.5) alb = mix(grn, uYel * 0.8, smoothstep(0.6, 1.0, s));
    if (isHead > 0.5) alb = sc > 3.5 ? uBlue * 1.15 : mix(grn * 1.2, uCream * 0.7, 0.25);
  } else {                                                                 // harpy: slate above, white below, barred
    vec3 slate = vec3(0.09, 0.1, 0.12), white = uCream * 0.95;
    float bars = smoothstep(0.35, 0.65, abs(fract(s * (isTail > 0.5 ? 2.5 : 5.0)) - 0.5) * 2.0);
    alb = mix(white, slate, smoothstep(-0.2, 0.3, bn.y));
    alb = mix(alb, slate * 0.6, smoothstep(0.16, 0.2, s) * smoothstep(0.34, 0.3, s) * (1.0 - isWing) * (1.0 - isTail) * (1.0 - isHead));   // chest band
    if (isWing > 0.5) alb = (top ? slate * (0.8 + 0.4 * bars) : mix(white, slate, 0.8 * bars * smoothstep(0.25, 0.6, c))) * barb;
    if (isTail > 0.5) alb = mix(top ? slate : white, slate * 0.5, bars * 0.85);
    if (isHead > 0.5) alb = vec3(0.4, 0.41, 0.43);
    if (isBill > 0.5) alb = dark;
  }
  vec3 n = normalize(vN + vec3(0., 1e-5, 0.)); if (!top) n = -n;
  float d = dot(n, uSunDir), nl = max(d, 0.0) * 0.82 + 0.18 * (d * 0.5 + 0.5);
  float vis = vInfo.y * mwSunLine(vPL);
  float thin = max(isWing, isTail);
  vec3 col = alb * (uSunCol * nl * vis + mwAmbient(n) * 1.15);
  // light through the feathers: the vanes of the flight feathers glow, their shafts and overlaps stay dark
  col += thin * alb * uSunCol * max(-d, 0.0) * vis * (0.5 + 1.2 * flight * (1.0 - 0.6 * shaft * fK)) * vec3(1.12, 1.0, 0.8);
  vec3 V = normalize(uCamL - vPL + vec3(0., 1e-4, 0.));
  float gl = pow(max(dot(reflect(-uSunDir, n), V), 0.0), 18.0);
  col += uSunCol * vis * gl * (0.04 + 0.3 * isBill + 0.05 * isHead);      // a little gloss: the bill is polished horn
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,V0=`
attribute vec4 iA, iN, iC; attribute vec2 iS;
uniform float uTe, uBack; uniform vec3 uSunDir;
varying vec2 vUv; varying float vA;
#include <common>
#include <fog_pars_vertex>
void main(){
  vec3 n = iN.xyz;
  vec3 upW = normalize(vec3(0., 1., 0.) - n * n.y + vec3(1e-3, 1e-3, 0.)), tw = cross(upW, n);
  vec3 dl = -(uSunDir - n * dot(uSunDir, n));
  float size = iC.y, air = smoothstep(0.0, 0.5, mix(uTe, -30.0, uBack) - iA.w);
  vec3 dn = normalize(dl / max(length(dl), 0.3) - upW * 0.55), pw = normalize(cross(n, dn));   // always raking down-wall, away from the sun
  vec3 c = iA.xyz + n * 0.2 + dn * (0.86 * size);
  vec3 lp = c + (pw * position.y * 0.36 + dn * position.x * 1.05) * size;
  vUv = position.xy; vA = (1.0 - air) * iS.x * step(iC.w, 1.5);
  vec4 mvPosition = modelViewMatrix * vec4(lp, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,F0=`
varying vec2 vUv; varying float vA;
uniform vec3 uShadeCol;
#include <common>
#include <fog_pars_fragment>
void main(){
  float a = smoothstep(1.0, 0.6, length(vUv * vec2(1.0, 1.0 + 0.5 * (vUv.x * 0.5 + 0.5)))) * (0.76 - 0.36 * (vUv.x * 0.5 + 0.5)) * vA;
  if (a < 0.004) discard;
  gl_FragColor = vec4(uShadeCol, a);
  #include <fog_fragment>
}`,N0=`
attribute vec4 dA, dN; attribute vec2 dS;
uniform float uTe, uTime; uniform vec3 uCamL;
varying vec2 vUv; varying vec3 vK; varying vec3 vPL;
#include <common>
#include <fog_pars_vertex>
${Ie}
void main(){
  float type = dN.w; vec3 h = mwHash3(dS.x);
  vec3 c = dA.xyz; float size = dS.y, alpha = 0.0, rot = h.z * 6.283; vec2 asp = vec2(1.0);
  if (type < 0.5) {
    float age = uTe - dA.w - 0.05 - 0.25 * h.x, k = clamp(age / 3.4, 0.0, 1.0), on = step(0.0, age);
    float o = 1.5 * (1.0 - exp(-max(age, 0.0) * 1.6));
    c += dN.xyz * (0.2 + o) + on * vec3(-0.5 * age * (0.4 + h.y), 0.3 * o - 0.3 * age * k, 0.15 * age);
    size *= 0.6 + 2.9 * sqrt(k); alpha = on * (1.0 - k) * (1.0 - k) * smoothstep(0.0, 0.04, k) * 0.95;
    rot += age * (h.y - 0.5);
  } else if (type < 1.5) {
    float per = 2.2 + 2.6 * h.x, f = fract(uTime / per + h.y), fall = f * f * (5.0 + 7.0 * h.z);
    c += dN.xyz * (0.1 + 0.6 * f) + vec3(0.25 * (h.z - 0.5) * f, -fall, 0.);
    alpha = smoothstep(0.0, 0.06, f) * (1.0 - smoothstep(0.7, 1.0, f)) * 0.9;
    size = max(size, distance(c, uCamL) * 0.0024);
  } else if (type > 2.5) {                                   // a trickle of clay dust from where a bird is feeding: a soft wisp that falls and thins
    float per = 3.0 + 3.0 * h.x, f = fract(uTime / per + h.y), gone = smoothstep(dA.w - 0.3, dA.w + 0.4, uTe);
    c += dN.xyz * (0.25 + 0.5 * f) + vec3(0.5 * (h.z - 0.5) * f, -f * (2.5 + 3.5 * h.z), 0.);
    alpha = smoothstep(0.0, 0.12, f) * (1.0 - f) * 0.5 * (1.0 - gone); asp = vec2(0.55 + 0.5 * f, 1.5); rot = 0.0;
    size *= 0.7 + 1.1 * f;
  } else {
    float age = uTe - dA.w - 0.4 - h.x, k = clamp(age / 9.0, 0.0, 1.0), on = step(0.0, age);
    c += dN.xyz * (1.0 + 3.0 * k) + on * vec3(1.2 * sin(age * 1.3 + h.y * 6.0), -1.0 * age + 0.3 * sin(age * 2.6 + h.z * 6.0), 0.8 * cos(age * 1.1 + h.y * 4.0));
    alpha = on * (1.0 - smoothstep(0.85, 1.0, k)); rot += age * 3.0; asp = vec2(1.0, 0.3 + 0.25 * sin(age * 4.0 + h.x * 6.0));
    size = max(size, distance(c, uCamL) * 0.003);
  }
  vec2 q = position.xy * asp; float cs = cos(rot), sn = sin(rot);
  q = vec2(q.x * cs - q.y * sn, q.x * sn + q.y * cs) * size * step(0.002, alpha);
  vUv = position.xy; vK = vec3(type, alpha, h.x); vPL = c;
  vec4 mvPosition = modelViewMatrix * vec4(c, 1.0);
  mvPosition.xy += q;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,T0=`
varying vec2 vUv; varying vec3 vK; varying vec3 vPL;
uniform vec3 uDust, uRed;
#include <common>
#include <fog_pars_fragment>
${Ie}
${rt}
void main(){
  float r = length(vUv), a; vec3 alb;
  if (vK.x < 0.5) { a = smoothstep(1.0, 0.15, r) * (0.55 + 0.45 * mwNoise(vUv * 2.3 + vK.z * 31.0)); alb = uDust; }
  else if (vK.x < 1.5) { a = smoothstep(1.0, 0.5, r) * 0.85; alb = uDust * 0.6; }
  else if (vK.x > 2.5) { a = smoothstep(1.0, 0.1, r) * (0.5 + 0.5 * mwNoise(vUv * vec2(2.0, 1.2) + vK.z * 17.0)); alb = uDust * 1.05; }
  else { a = smoothstep(1.0, 0.8, r); alb = uRed * (0.7 + 0.3 * step(abs(vUv.y), 0.12)); }
  a *= vK.y; if (a < 0.004) discard;
  vec3 col = alb * (uSunCol * 0.55 * mwSunLine(vPL) + mix(uGndCol, uSkyCol, 0.6));
  gl_FragColor = vec4(col, a);
  #include <fog_fragment>
}`,o0={dawn:{sunDir:[.84,.24,.485],sunColor:"#FFD9A0",sunIntensity:2.25,skyColor:"#86AEC6",groundColor:"#6E5A48",shadowLineY:5,sitting:1},day:{sunDir:[.62,.6,.5],sunColor:"#FFF2DE",sunIntensity:3,skyColor:"#9CC0DC",groundColor:"#7A6650",shadowLineY:-20,sitting:1},golden:{sunDir:[-.84,.21,.5],sunColor:"#FFB45E",sunIntensity:2.7,skyColor:"#8E9CC0",groundColor:"#70523C",shadowLineY:3,sitting:.62}},R0=[[-6.4,116,6,22],[-4.4,84.4,9,22],[-2,46,12.5,22],[0,14,14,22],[3.6,-50.8,14,22],[5,-74,13.6,27],[6.4,-95,12.5,40],[9,-128,8,72],[12,-160,4.5,112]];async function L0(l,u={}){const s=l.rng.fork?l.rng.fork("macaw-wall"):l.rng,T=l.noise,L=(u.palette&&u.palette.length>=7?u.palette:m0).slice(0,7),y=o0[u.hour]||o0.dawn,F=u.weather==="rain",b=new r.Vector3().fromArray(u.sunDir||y.sunDir).normalize(),W=u.duration??40,H=u.flushAt??12.4,d=u.cast||s.pick(["mixed","mixed","mixed","red","blue","green"]),D=(u.eyeLine||R0).map(e=>e.slice()),x={loop:null,speed:14,refPoint:null,teRef:9,sigma:60,bulk:.55,...u.track||{}},P=24,q=[];{const e=u.wheelCenter||[-60,25,78],t=u.wheelRadius||[90,55],a=(x.loop||Array.from({length:16},(o,i)=>[e[0]+Math.cos(-i/16*6.2832)*t[0],e[1]+2.5*Math.sin(i/16*12.566),e[2]+Math.sin(-i/16*6.2832)*t[1]])).map(o=>new r.Vector3(o[0],o[1],o[2])),n=new r.CatmullRomCurve3(a,!0,"centripetal");n.arcLengthDivisions=600,x.length=n.getLength();for(let o=0;o<P;o++)q.push(n.getPointAt(o/P))}const Y=x.length,ce=(e,t)=>{const a=Math.floor(e),n=e-a,o=q[(a+P-1)%P],i=q[a%P],h=q[(a+1)%P],c=q[(a+2)%P],w=n*n,N=w*n,m=.5*(-n+2*w-N),p=.5*(2-5*w+3*N),g=.5*(n+4*w-3*N),f=.5*(-w+N);return t.set(o.x*m+i.x*p+h.x*g+c.x*f,o.y*m+i.y*p+h.y*g+c.y*f,o.z*m+i.z*p+h.z*g+c.z*f)},Q=new r.Vector3,Me=new r.Vector3;if(x.sRef=0,x.refPoint){const e=Me.fromArray(x.refPoint);let t=1e9;for(let a=0;a<P*20;a++){const n=ce(a/20,Q).distanceToSquared(e);n<t&&(t=n,x.sRef=a/20/P*Y)}}const Ae=new r.Vector3,Re=[0,0];{let e=1e9,t=-1e9,a=1e9,n=-1e9;for(const o of q)Ae.add(o),e=Math.min(e,o.x),t=Math.max(t,o.x),a=Math.min(a,o.z),n=Math.max(n,o.z);Ae.divideScalar(P),Re[0]=(t-e)/2,Re[1]=(n-a)/2}const v=(e,t=1)=>new r.Color(e).multiplyScalar(t),O=new r.Vector3,ee=new r.Vector3,R=new r.Vector3,K={uSunDir:{value:b.clone()},uSunCol:{value:v(u.sunColor||y.sunColor,u.sunIntensity??y.sunIntensity)},uSkyCol:{value:v(u.skyColor||y.skyColor).lerp(v("#cfc8e6"),.25).multiplyScalar(1)},uGndCol:{value:v(u.groundColor||y.groundColor,.26)},uShadowY:{value:u.shadowLineY??y.shadowLineY},uWaterY:{value:u.waterY??0}},X={pairs:0,route:null,t0:0,dt:1,join:[1e6,1],shape:()=>[1,1,0,0,8,2,4],...u.skein||{}},ne=[];for(let e=0;e<48;e++){const t=X.route?X.route[Math.min(e,X.route.length-1)]:[0,0,0];ne.push(new r.Vector3(t[0],t[1],t[2]))}const ue={uTe:{value:-10},uTime:{value:0},uBack:{value:0},uScare:{value:new r.Vector4(0,-999,0,0)},uTrk:{value:new r.Vector4(u.floorY??1.7,0,Y,x.speed)},uLoop:{value:q},uRoute:{value:ne},uRt:{value:new r.Vector4(X.t0,X.dt,X.join[0],X.join[1])},uSkL:{value:new r.Vector4(1,1,0,0)},uSkQ:{value:new r.Vector4(0,8,2,4)},uCamL:{value:new r.Vector3(0,1e4,0)},uHold:{value:new r.Vector4(48,29,52,.35)},uHoldR:{value:new r.Vector4(58,27,5,5)},uHoldP:{value:new r.Vector3(0,6.2832,0)}};if(u.early&&u.early.hold){const e=u.early.hold;ue.uHold.value.set(e.center[0],e.center[1],e.center[2],e.omega??.35),ue.uHoldR.value.set(e.rx??58,e.rz??27,e.spread??5,e.tilt??5),ue.uHoldP.value.set(e.phase??0,e.span??6.2832,e.dip??0)}const He=e=>X.shape(e),Ce=(e,t)=>{e=oe(e,0,46.999);const a=Math.floor(e),n=e-a,o=ne[Math.max(a-1,0)],i=ne[a],h=ne[Math.min(a+1,47)],c=ne[Math.min(a+2,47)],w=n*n,N=w*n,m=.5*(-n+2*w-N),p=.5*(2-5*w+3*N),g=.5*(n+4*w-3*N),f=.5*(-w+N);return t.set(o.x*m+i.x*p+h.x*g+c.x*f,o.y*m+i.y*p+h.y*g+c.y*f,o.z*m+i.z*p+h.z*g+c.z*f)},J={uHarpy:{value:new r.Vector3(0,500,0)},uHarpyW:{value:new r.Vector3(0,0,1)},uHarpyF:{value:new r.Vector3(-1,0,0)},uHarpyFlap:{value:1},uHarpyOn:{value:0},uHarpyPh:{value:0},uSolo:{value:new r.Vector4(5,1,.42,0)}},ye=v(L[0]);ye.offsetHSL(s.range(-.012,.012),0,s.range(-.02,.02));const qe={uRed:{value:v(L[1])},uBlue:{value:v(L[2])},uYel:{value:v(L[3])},uGrn:{value:v(L[4])},uCream:{value:v(L[6],.82)}},S=e=>({...r.UniformsUtils.clone(r.UniformsLib.fog),...K,...ue,...J,...qe,...e}),z=new r.Group;z.name="macaw-wall",await l.yield();const V=y0(T,s),Z=st*.72,k=await k0(V,b,S({uClay:{value:ye.clone().lerp(v(L[6]),.07)},uOchre:{value:v(L[5]).lerp(v(L[3]),.14).multiplyScalar(1)},uGrey:{value:v(L[5]).lerp(v(L[6]),.5).lerp(v("#8c8c94"),.35)},uSoil:{value:v(L[4]).lerp(v(L[5]),.5).multiplyScalar(.5)},uPale:{value:ye.clone().lerp(v(L[6]),.5)},uWet:{value:F?1:0},uBandY:{value:Z},uSeedF:{value:s.range(0,50)}}),l);z.add(k.mesh),await l.yield();const E=await C0(s,T,V,k,L,S({uBlkClay:{value:ye.clone().lerp(v(L[6]),.05)},uBlkOchre:{value:v(L[3]).lerp(v(L[5]),.72).lerp(ye,.15)}}),l,u.waterY??0);z.add(E.mesh);const Se=new r.Mesh(E.foamGeo,new r.ShaderMaterial({uniforms:S({uFoam:{value:v(L[6],.95)}}),vertexShader:M0,fragmentShader:A0,fog:!0,transparent:!0,depthWrite:!1,side:r.DoubleSide}));Se.frustumCulled=!1,Se.renderOrder=2,z.add(Se),await l.yield();const be=(e,t,a)=>{let n=0;for(let o=1;o<=30;o++){const i=e+b.x*o,h=t+b.y*o,c=a+b.z*o,w=k.zAt(i,h);if(w<-900){if(i<-ge||i>ge||h>k.topAt(i))break;continue}n=Math.max(n,w-c-.02*o)}return 1-Ne(0,.8,n)},Ve=(e,t=new r.Vector3)=>{const a=D,n=a.length;let o=0;for(;o<n-2&&e>a[o+1][0];)o++;const i=a[o],h=a[o+1],c=(e-i[0])/Math.max(h[0]-i[0],.001);return t.set(i[1]+(h[1]-i[1])*c,i[2]+(h[2]-i[2])*c,i[3]+(h[3]-i[3])*c)},me=y.sitting,le=Math.round(oe(u.density??s.range(720,800),400,800)*me);let xe=Math.min(Math.round(d==="green"?le*.62:le*.25),d==="green"?500:200),ve=Math.min(le-xe,680);ve-=ve%2;const te=new Set,Pe=(e,t)=>Math.round(e/.5)+":"+Math.round(t/.72),Be=(e,t)=>{const a=k.zAt(e,t),n=k.normalAt(e,t,new r.Vector3);return n.y=oe(n.y,-.2,.45),n.z=Math.max(n.z,.35),n.normalize(),{pos:new r.Vector3(e,t,a),n,wall:!0,vis:be(e,t,a+.15)}},We=(e,t)=>{const a=oe(.5+.5*T.n2(e*.018+77,t*.06)+s.range(-.22,.22),0,.999),n=d==="red"?[.58,.94]:d==="blue"?[.12,.2]:d==="green"?[.5,.8]:[.44,.67];return a<n[0]?0:a<n[1]?1:2},_=[],De=Math.min(E.perches.length-E.perches.length%2,44,ve),Ue=ve-De;for(let e=0;_.length<Ue&&e<Ue*30;e++){(e&31)===31&&await l.yield();let t,a,n=0;const o=s();if(o<.2)n=2,t=V.xb+oe(s.gauss()*3.3,-8,8),a=k.topAt(t)*s.range(.15,.6);else if(o<.58)n=1,t=Xe(-28,72,Math.pow(s(),.75)),a=k.topAt(t)*oe(.58+.19*s.gauss(),.2,.93),a=Math.round(a/1.55)*1.55+s.range(-.22,.22);else{t=s.range(-134,134);const g=.5+.5*T.n2(t*.025+40,1.7);if(s()>.22+.78*g*g)continue;const f=(d==="green"?.8:.7)+.05*T.n2(t*.02,8.8);a=k.topAt(t)*oe(f+(d==="green"?.06:.11)*s.gauss(),.46,.93)}const i=s.range(.52,.66),h=Pe(t,a),c=a+s.range(-.12,.12),w=Pe(t+i,c);if(h===w||te.has(h)||te.has(w)||Math.abs(t)>138)continue;te.add(h),te.add(w);const N=We(t,a),m=Be(t,a),p=Be(t+i,c);m.sp=p.sp=N,m.grp=p.grp=n,p.mate=m,_.push(m,p)}{const e=l.core.makeRng("macaw-east:"+l.seed),t=Math.round((u.eastPairs??0)*me),a=d==="red"?[.58,.94]:d==="blue"?[.12,.2]:d==="green"?[.5,.8]:[.44,.67];for(let n=0,o=0;n<t&&o<t*30;o++){(o&31)===31&&await l.yield();const i=Xe(95,129,Math.pow(e(),1.25));let c=k.topAt(i)*oe(.52+.2*e.gauss(),.2,.9);c=Math.round(c/1.55)*1.55+e.range(-.22,.22);const w=e.range(.52,.66),N=Pe(i,c),m=c+e.range(-.12,.12),p=Pe(i+w,m);if(N===p||te.has(N)||te.has(p))continue;te.add(N),te.add(p);const g=oe(.5+.5*T.n2(i*.018+77,c*.06)+e.range(-.22,.22),0,.999),f=g<a[0]?0:g<a[1]?1:2,M=Be(i,c),U=Be(i+w,m);M.sp=U.sp=f,M.grp=U.grp=3,U.mate=M,_.push(M,U),n++}}const I=_.length;for(let e=0;e<De;e++){const t=E.perches[e],a=e%2?_[_.length-1]:null;_.push({pos:t.p.clone(),n:t.n.clone(),wall:!1,vis:1,sp:a?a.sp:We(t.p.x,50),mate:a})}E.blockTops.filter(t=>t.x>-30&&t.x<96).sort((t,a)=>a.r-t.r).slice(0,14).filter((t,a)=>a%2===0).forEach((t,a)=>{const n=d==="blue"?2:d==="red"?a%2:a%3,o=Math.min(.62,t.r*.9);for(let i=0;i<2;i++){const h=t.p.clone().add(O.set((i-.5)*o,.2,.3*t.r)),c=new r.Vector3((i-.5)*.5,0,1).normalize();_.push({pos:h,n:c,wall:!1,vis:be(h.x,h.y,h.z+.3),sp:n,mate:i?_[_.length-1]:null,grp:0})}}),(u.eastPairs??0)>0&&E.blockTops.filter(t=>t.x>=96&&t.x<132).sort((t,a)=>a.r-t.r).slice(0,3).forEach((t,a)=>{const n=d==="blue"?2:d==="red"?a%2:(a+1)%3,o=Math.min(.62,t.r*.9);for(let i=0;i<2;i++){const h=t.p.clone().add(O.set((i-.5)*o,.2,.3*t.r)),c=new r.Vector3((i-.5)*.5+.5,0,1).normalize();_.push({pos:h,n:c,wall:!1,vis:be(h.x,h.y,h.z+.3),sp:n,mate:i?_[_.length-1]:null,grp:0})}});const ke=_.length-I-De;await l.yield();const se=[];for(let e=0;se.length<xe&&e<xe*30;e++){(e&31)===31&&await l.yield();const t=s.range(-128,128),a=.5+.5*T.n2(t*.03+11,5.1);if(s()>.2+.8*a)continue;const n=k.topAt(t)*oe(.36+.09*s.gauss(),.16,.52),o=Pe(t,n);if(te.has(o))continue;te.add(o);const i=Be(t,n);i.sp=T.n2(t*.04+5,2.2)+s.range(-.5,.5)>.1?4:3,se.push(i)}await l.yield();const Te=new r.Vector3,Ke=new r.Vector3,_e=new r.Vector3,Ye=new r.Vector3,Ze=new r.Vector3,it=u.laneFrom??.8,mt=u.laneTo??7,n0=(e,t,a)=>{Ve(e,Te),Ve(e+.3,Ke),_e.subVectors(Ke,Te).setY(0),_e.lengthSq()<1e-6&&_e.set(-1,0,0),_e.normalize();let n,o,i;t===0?(n=s.range(2.8,5),o=s.range(-.12,.7),i=s.range(-.5,1)):t===1?(n=s.range(5,10.5),o=s.range(-.22,.8),i=s.range(-1.1-.14*(n-5),.15*n)):(n=s.range(10.5,36),o=s.range(-.4,.95),i=oe(s.range(-.25,.22)*n,-7,9));const h=Math.cos(o)*n,c=Math.max(Math.sin(o)*n,-8);return a.set(Te.x+_e.x*h+_e.z*c,Te.y+i,Te.z+_e.z*h-_e.x*c)},Ee=u.keepOff||null,vt=new r.Vector3,s0=new r.Vector3,r0=(e,t)=>{const a=Ee.line,n=a.length;let o=0;for(;o<n-2&&e>a[o+1][0];)o++;const i=a[o],h=a[o+1],c=oe((e-i[0])/Math.max(h[0]-i[0],.001),-1,2);return t.set(i[1]+(h[1]-i[1])*c,i[2]+(h[2]-i[2])*c,i[3]+(h[3]-i[3])*c)},Tt=(e,t,a,n,o,i,h)=>{const c=it+(mt-it)*((o*.61803399+.31)%1);for(let w=0;w<(Ee?40:26);w++){const N=i??(w===0?c:w<6?oe(c+s.range(-.8,.8),it,mt):s.range(it,mt)),m=N-a;if(m<1.3){if(i!==void 0)return null;continue}h?Ze.copy(h):n0(N,n,Ze);const p=1-Math.exp(-3*m),g=m*m/(m+.5),f=-1.3*(m/.45)*Math.exp(1-m/.45),M=oe((e.y-Ze.y)*.92,0,40),U=1-Math.exp(-1.1*m);Ye.copy(Ze).sub(e).addScaledVector(t,-.9*p),Ye.y-=f-M*U,Ye.divideScalar(g);const A=Ye.length();if(A>8&&A<23&&Ye.z>.6){let j=!0;if(Ee)for(let C=.3;C<m+.6&&j;C+=.2){const we=C*C/(C+.5),fe=C/.45;vt.copy(e).addScaledVector(t,.9*(1-Math.exp(-3*C))).addScaledVector(Ye,we),vt.y+=-1.3*fe*Math.exp(1-fe)-M*(1-Math.exp(-1.1*C)),vt.distanceTo(r0(a+C,s0))<Ee.dist&&(j=!1)}if(j)return{V:Ye.clone(),tc:m,D:M,teP:N,pt:Ze.clone()}}if(i!==void 0)return null}return null};let Rt=0,ct=0;const Bt=Math.ceil((_.length-ke)/2),Lt=Math.round(Math.min(24,Bt*.11)),l0=Math.round(Math.min(56,Bt*.26)),Dt=(e,t)=>{const a=e.pos,n=e.n,o=e.mate;if(e.rel=o?o.rel+s.range(.03,.2):v0+Math.abs(a.x-Ht)/w0+s.range(0,.45)+(1-Math.min(a.y/st,1))*.25,e.b0=o?o.b0:1.6+s.range(0,.9),e.D=0,e.V=o?o.V.clone().add(O.set(s.range(-.5,.5),s.range(0,.35),s.range(-.5,.5))):new r.Vector3(n.x-s.range(.1,.75),s.range(.05,.4),Math.max(n.z,.5)).normalize().multiplyScalar(s.range(10.5,14.5)),!t){let c=null;if(o&&o.laneS){const w=o.laneS;O.copy(w.pt).add(ee.set(s.range(-.5,.5),s.range(-.15,.4),s.range(.55,.9)*(s()<.5?-1:1))),c=Tt(a,n,e.rel,o.cls,0,w.teP+s.range(.05,.16),O)}c?e.cls=o.cls:(e.cls=o?o.cls:ct<Lt?0:ct<Lt+l0?1:2,c=Tt(a,n,e.rel,e.cls,ct*2+(o?1:0))),o||ct++,c&&(e.V=c.V,e.D=c.D,e.b0=c.tc+.4,e.laneS=c,e.cls<2&&Rt++)}const i=!t&&(o?o.bulk0:s()<x.bulk),h=!t&&!!e.sk;e.bulk0=i,e.bulk=h,e.ws=o?o.ws:s.range(.965,1.035),e.sAt=o?o.sAt-s.range(.5,1.5):h?x.sRef+oe(s.gauss(),-2.3,2.3)*x.sigma:s()*Y,e.s0=e.sAt-x.speed*e.ws*x.teRef,e.lat=o?o.lat+s.range(-.9,.9):t?s.range(-10,12):oe(s.gauss()*4,-8,9),e.hy=o?o.hy+s.range(-.4,.4):t?s.range(-5,3):oe(s.gauss()*2.6,-4,7),e.cf=o?oe(o.cf+s.range(.002,.008),0,1):s(),e.cf=-1,e.perch=null,e.pn=null,e.landT=1e6,e.seed=s.range(1,900),e.size=t?s.range(1.35,1.65):s.range(1.12,1.3),e.roll=oe(s.gauss()*.17,-.35,.35),e.twist=o?-o.twist:s.sign(),e.pairH=o?o.pairH:e.seed*.618034%1,e.hop=e.wall&&s.chance(e.grp?.3:.1)?s.range(.8,2.1):0},_t=(e,t)=>{const a=new r.InstancedBufferGeometry;a.index=e.index;for(const f of["position","normal","aPart"])a.setAttribute(f,e.attributes[f]);const n=t.length,o=new Float32Array(n*4),i=new Float32Array(n*4),h=new Float32Array(n*4),c=new Float32Array(n*4),w=new Float32Array(n*4),N=new Float32Array(n*4),m=new Float32Array(n*4),p=new Float32Array(n*3);t.forEach((f,M)=>{o.set([f.pos.x,f.pos.y,f.pos.z,f.rel],M*4),i.set([f.n.x,f.n.y,f.n.z,f.roll],M*4),h.set([f.V.x,f.V.y,f.V.z,f.seed],M*4),c.set([f.s0,f.lat,f.hy,f.ws],M*4),w.set([f.sp,f.size,f.twist*(1+.999*f.pairH),f.hop],M*4),N.set([f.vis,f.b0,f.D,f.cf],M*4),m.set([f.pos.x,f.pos.y,f.pos.z,1e6],M*4),p.set([f.n.x,f.n.y,f.n.z],M*3)});const g=(f,M)=>new r.InstancedBufferAttribute(f,M);return a.setAttribute("iA",g(o,4)),a.setAttribute("iN",g(i,4)),a.setAttribute("iV",g(h,4)),a.setAttribute("iW",g(c,4)),a.setAttribute("iC",g(w,4)),a.setAttribute("iS",g(N,4)),a.setAttribute("iP",g(m,4)),a.setAttribute("iQ",g(p,3)),a.instanceCount=n,a.boundingSphere=new r.Sphere(new r.Vector3(-30,20,60),400),a},wt=(e,t,a,n)=>{const o=(e%Y+Y)%Y/Y*P;ce(o,n),ce(o+.25,Q).sub(n);const i=Math.hypot(Q.x,Q.z)||1;return n.x+=Q.z/i*t,n.y+=a,n.z+=-Q.x/i*t,n},gt=new r.Vector3,je=new r.Vector3,$e=new r.Vector3,i0=(e,t,a=new r.Vector3)=>{const n=Math.max(t-e.rel,0),o=n*n/(n+.5),i=n/.45;if(a.copy(e.pos).addScaledVector(e.n,.9*(1-Math.exp(-3*n))).addScaledVector(e.V,o),a.y+=-1.3*i*Math.exp(1-i)-e.D*(1-Math.exp(-1.1*n)),a.lerp(wt(e.s0+x.speed*e.ws*t,e.lat,e.hy,gt),Ne(e.b0,e.b0+5.9,n)),a.y=Xe(a.y,Math.max(a.y,(u.floorY??1.7)+.25),Ne(.6,1.6,n)),e.cf>=0){const h=He(t),c=h[0]+e.cf*h[1],w=(t+c-X.t0)/X.dt;Ce(w,je),Ce(w+.3,$e).sub(je);const N=Math.hypot($e.x,$e.z)||1,m=h[3]+(e.hpy-.5)*h[4]+.55*e.twist,p=h[5]+(e.hpz-.5)*h[6]-h[2]*c;je.x+=-$e.z/N*m,je.z+=$e.x/N*m,je.y+=p,a.lerp(je,Ne(X.join[0],X.join[0]+X.join[1],t+1.5*(e.hpx-.5))),e.perch&&a.lerp(e.perch,Ne(e.landT-1.7,e.landT,t))}return a},Je=[];for(let e=0;e+1<I;e+=2)Je.push(e);const et=Math.min(Je.length,Math.max(0,Math.round(X.pairs))),Fe=[],Wt=[],Yt=new Set,Et=Je.filter(e=>(_[e].sp??2)<1.5),yt=Je.filter(e=>!((_[e].sp??2)<1.5)),qt=Math.min(Et.length,Math.max(et-yt.length,Math.round(et*.5))),Ut=(e,t)=>{for(let a=0;a<t;a++)Yt.add(e[Math.floor((a+.5)*e.length/t)])};et>0&&(Ut(Et,qt),Ut(yt,Math.min(yt.length,et-qt)));for(const e of Yt)_[e].sk=!0,_[e+1].sk=!0;for(let e=0;e<_.length;e++)(e&31)===0&&await l.yield(),Dt(_[e],!1);await l.yield(),se.forEach(e=>Dt(e,!0));const tt=[];if(Ee&&Ee.line.length>3){const e=Ee.long&&Ee.long.length>3?Ee.long:Ee.line,t=e.length,a=e[0][0],n=e[t-1][0],o=(n-a)/(t-1),i=2.5,h=i+.17,c=100,w=10,N=(u.floorY??1.7)+.25,m=new r.Vector3,p=new r.Vector3,g={h:0,dy:0,B:0,w:0,g:0},f=[],M=(A,j)=>{const C=oe((A-a)/o,0,t-1),we=Math.min(Math.floor(C),t-2),fe=C-we,ze=fe*fe,ae=ze*fe,G=e[Math.max(we-1,0)],de=e[we],ie=e[we+1],pe=e[Math.min(we+2,t-1)],re=.5*(-fe+2*ze-ae),Le=.5*(2-5*ze+3*ae),Oe=.5*(fe+4*ze-3*ae),Qe=.5*(-ze+ae);return j.set(G[1]*re+de[1]*Le+ie[1]*Oe+pe[1]*Qe,G[2]*re+de[2]*Le+ie[2]*Oe+pe[2]*Qe,G[3]*re+de[3]*Le+ie[3]*Oe+pe[3]*Qe)},U=(A,j)=>{const C=Math.max(j-A.rel,0),we=C*C/(C+.5),fe=C/.45,ze=Ne(A.b0,A.b0+5.9,C);p.copy(A.pos).addScaledVector(A.n,.9*(1-Math.exp(-3*C))).addScaledVector(A.V,we),p.y+=-1.3*fe*Math.exp(1-fe)-A.D*(1-Math.exp(-1.1*C)),wt(A.s0+x.speed*A.ws*j,A.lat,A.hy,gt);const ae=Math.hypot(Q.x,Q.z)||1,G=Q.z/ae,de=-Q.x/ae;p.lerp(gt,ze);const ie=p.y<N+.25;p.y+=(Math.max(p.y,N)-p.y)*Ne(.6,1.6,C),p.addScaledVector(A.n,.09*A.size),M(j,m);const pe=p.x-m.x,re=p.z-m.z,Le=pe*G+re*de,Oe=pe-Le*G,Qe=re-Le*de,Zt=Math.max(Math.abs(Le)-1.2*ze,0);g.h=Math.sqrt(Oe*Oe+Qe*Qe+Zt*Zt),g.dy=p.y-m.y,g.B=1.5*ze+(ie?.25:0),g.w=ze,g.g=we;const $t=Math.max(Math.abs(g.dy)-g.B,0);return Math.sqrt(g.h*g.h+$t*$t)};for(const A of se){const j=Math.max(A.rel,a);let C=1e9,we=j,fe=0;const ze=()=>{C=1e9;for(let ae=j;ae<=n;){const G=U(A,ae);G<C&&(C=G,we=ae),ae+=Math.max(.01,(G-h)/c)}};ze();for(let ae=0;C<h&&ae<6;ae++){U(A,we);const G=g.w<.5,de=G?(1-g.w)*g.g:g.w;if(de<.05)break;f.length=0;const ie=re=>{U(A,re);const Le=(G?(1-g.w)*g.g:g.w)/de;if(g.h<h&&Le>1e-4){const Oe=Math.sqrt(h*h-g.h*g.h);f.push([(-Oe-g.dy-g.B)/Le,(Oe-g.dy+g.B)/Le])}};ie(we);for(let re=j;re<=n;re+=Math.max(.01,(g.h-h)/c))ie(re);f.sort((re,Le)=>re[0]-Le[0]);let pe=0;for(const re of f)re[0]<=pe&&re[1]>pe&&(pe=re[1]);if(pe+=.01,!(fe+pe/de<=w))break;fe+=pe/de,G?A.V.y+=pe/de:A.hy+=pe/de,ze()}C<h&&tt.push([se.indexOf(A),+C.toFixed(3),+we.toFixed(2)])}tt.length&&console.warn("macaw-wall (the part): "+tt.length+" small parrot(s) are left nearer the lens than "+h+" m by the block that keeps them off it (parrot: metres at flush time): "+tt.map(A=>A[0]+": "+A[1]+" at "+A[2]).join(", "))}let bt=0;const he=u.early||null;if(he&&he.pairs>0&&he.line&&he.line.length>1){const e=l.core.makeRng("macaw-early:"+l.seed),t=he.line,a=t.length,n=new r.Vector3,o=new r.Vector3,i=new r.Vector3,h=new r.Vector3,c=new r.Vector3,w=new r.Vector3,N=he.keep??9,m=(f,M)=>{let U=0;for(;U<a-2&&f>t[U+1][0];)U++;const A=t[U],j=t[U+1],C=oe((f-A[0])/Math.max(j[0]-A[0],.001),0,1);return M.set(A[1]+(j[1]-A[1])*C,A[2]+(j[2]-A[2])*C,A[3]+(j[3]-A[3])*C)},p=(f,M,U,A,j)=>{const C=A-U;if(C<1.3)return null;const we=1-Math.exp(-3*C),fe=C*C/(C+.5),ze=-1.3*(C/.45)*Math.exp(1-C/.45),ae=oe((f.y-j.y)*.92,0,40),G=1-Math.exp(-1.1*C);w.copy(j).sub(f).addScaledVector(M,-.9*we),w.y-=ze-ae*G,w.divideScalar(fe);const de=w.length();if(de<9||de>22||w.z<.6)return null;for(let ie=.3;ie<C+1.6;ie+=.2){const pe=ie*ie/(ie+.5),re=ie/.45;if(h.copy(f).addScaledVector(M,.9*(1-Math.exp(-3*ie))).addScaledVector(w,pe),h.y+=-1.3*re*Math.exp(1-re)-ae*(1-Math.exp(-1.1*ie)),h.distanceTo(m(U+ie,c))<N)return null}return{V:w.clone(),D:ae,tc:C}},g=Je.filter(f=>{const M=_[f];return!M.sk&&M.grp!==2&&M.grp!==3&&M.pos.x>he.x0&&M.pos.x<he.x1&&_[f+1]&&_[f+1].mate===M&&(M.pos.x>(he.xFull??-1e9)||e()<(he.thin??1))});e.shuffle(g);for(let f=0;f<g.length&&bt<he.pairs;f++){(f&7)===0&&await l.yield();const M=_[g[f]],U=_[g[f]+1];let A=he.t0+Math.abs(M.pos.x-he.xw)/he.wave+e.range(0,he.jitter),j=null,C=0;for(let ze=0;ze<24&&!j;ze++){C=he.pass?e.range(he.pass[0],he.pass[1]):A+e.range(2.3,4.8),m(C,n),m(C+.3,o).sub(n).setY(0),o.lengthSq()<1e-6&&o.set(1,0,0),o.normalize();const ae=e()<.35,G=he.box,de=G?e.range(G.c[0],ae?Xe(G.c[0],G.c[1],.4):G.c[1]):ae?e.range(3,18):e.range(-4,48),ie=G?e.range(G.lt[0],G.lt[1])*(ae?.5:1):ae?e.range(-4,14):e.range(-8,38),pe=G?e.range(G.up[0],ae?Xe(G.up[0],G.up[1],.5):G.up[1]):ae?e.range(3,9):e.range(3,16);if(!(de*de+ie*ie+pe*pe<(N+1.5)*(N+1.5))){if(i.set(n.x+o.x*de+o.z*ie,n.y+pe,n.z+o.z*de-o.x*ie),he.pass){const re=he.speed||[12,19];A=C-(M.pos.distanceTo(i)/e.range(re[0],re[1])+.45)}j=p(M.pos,M.n,A,C,i)}}if(!j)continue;M.rel=A,M.V=j.V,M.D=j.D,M.b0=j.tc+.3,M.early=!0;const we=A+e.range(.05,.22);i.x+=e.range(-.5,.5),i.y+=e.range(-.1,.4),i.z+=e.range(.55,.9)*e.sign();const fe=p(U.pos,U.n,we,C+e.range(.05,.16),i);U.rel=we,U.early=!0,fe?(U.V=fe.V,U.D=fe.D,U.b0=fe.tc+.3):(U.V=j.V.clone().add(i.set(e.range(-.5,.5),e.range(0,.35),e.range(-.5,.5))),U.D=j.D,U.b0=M.b0),bt++}}const ut=e=>e-Math.floor(e),c0=e=>[ut(Math.sin(e*12.9898)*43758.5453),ut(Math.sin(e*78.233)*24634.6345),ut(Math.sin(e*39.425)*35734.7341)];for(let e=0;e<_.length;e++){const t=_[e];if(t.sk&&!t.mate){const a=_[e+1],n=Fe.length/2;t.cf=(n+.25+.5*t.pairH)/Math.max(et,1),a.cf=t.cf;const o=c0((Math.abs(t.twist*(1+.999*t.pairH))-1)*913.7+2.3);t.hpx=a.hpx=o[0],t.hpy=a.hpy=o[1],t.hpz=a.hpz=o[2],Fe.push(t,a)}else t.sk||Wt.push(t)}{const e=l.core.makeRng("macaw-skein:"+l.seed),t=[];for(let a=0;a<Fe.length;a+=2)t.push(Fe[a].cf);e.shuffle(t);for(let a=0;a<Fe.length;a+=2)Fe[a].cf=t[a/2],Fe[a+1].cf=t[a/2]}const u0=Math.max(0,u.extraSlots|0),at=[];for(let e=0;e<u0;e++)at.push({pos:new r.Vector3(0,-500,0),n:new r.Vector3(0,0,1),rel:1e6,V:new r.Vector3,seed:7.3+e*3.71,roll:0,s0:0,lat:0,hy:0,ws:1,sp:0,size:0,twist:e%2?-1:1,pairH:ut((e>>1)*.618034+.31),hop:0,vis:1,b0:1e6,D:0,cf:-1});const xt=Fe.concat(at,Wt),Ot=Fe.length+at.length;await l.yield();const ht=(e,t={})=>new r.ShaderMaterial({uniforms:S({uSh:{value:new r.Vector3().fromArray(e.shoulder)},uNeck:{value:new r.Vector2(e.neck[0],e.neck[1])},uElbow:{value:e.elbow},uChordM:{value:e.chordM},uFlapHz:{value:e.flap},uSpanLen:{value:e.span[e.span.length-1]}}),vertexShader:P0,fragmentShader:H0,fog:!0,side:r.DoubleSide,...t}),kt=Nt(Ft),It=Nt(t0),Ge=new r.Mesh(_t(kt,xt),ht(Ft));Ge.frustumCulled=!1,Ge.renderOrder=1,z.add(Ge);const ft=new r.Mesh(_t(It,se),ht(t0));ft.frustumCulled=!1,ft.renderOrder=1,z.add(ft),await l.yield();const dt=[k.mesh,E.mesh,Se];let zt=null;const St=_.slice(0,I).concat(se);{const e=St.length,t=new r.InstancedBufferGeometry;t.setAttribute("position",new r.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),t.setIndex([0,1,2,0,2,3]);const a=new Float32Array(e*4),n=new Float32Array(e*4),o=new Float32Array(e*4),i=new Float32Array(e*2);St.forEach((w,N)=>{a.set([w.pos.x,w.pos.y,w.pos.z,w.rel],N*4),n.set([w.n.x,w.n.y,w.n.z,0],N*4),o.set([w.sp,w.sp>2.5?.5:w.size,0,0],N*4),i.set([w.vis,0],N*2)}),t.setAttribute("iA",new r.InstancedBufferAttribute(a,4)),t.setAttribute("iN",new r.InstancedBufferAttribute(n,4)),t.setAttribute("iC",new r.InstancedBufferAttribute(o,4)),t.setAttribute("iS",new r.InstancedBufferAttribute(i,2)),t.instanceCount=e;const h=new r.ShaderMaterial({uniforms:{...r.UniformsUtils.clone(r.UniformsLib.fog),uTe:ue.uTe,uSunDir:K.uSunDir,uShadeCol:{value:ye.clone().multiplyScalar(.1).lerp(v("#0a1420"),.4)}},vertexShader:V0,fragmentShader:F0,fog:!0,transparent:!0,depthWrite:!1,side:r.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),c=new r.Mesh(t,h);c.frustumCulled=!1,c.renderOrder=.5,z.add(c),dt.push(c)}{const e=[],t=[],a=[];for(const m of St)e.push(m.pos.x,m.pos.y,m.pos.z,m.rel),t.push(m.n.x,m.n.y,m.n.z,0),a.push(s.range(0,99),m.sp>2.5?s.range(.3,.5):s.range(.55,.95));const n=Math.round(260*(l.quality?.detail??1));for(let m=0;m<n;m++){const p=m<n*.6&&I?_[s.int(0,I-1)]:Be(s.range(-130,130),s.range(8,34));e.push(p.pos.x+s.range(-.4,.4),p.pos.y-s.range(0,1.5),p.pos.z,0),t.push(p.n.x,p.n.y,p.n.z,1),a.push(s.range(0,99),s.range(.035,.07))}const o=_.slice(0,I).filter(m=>m.grp>0),i=Math.round(Math.min(110,o.length*.45)*(l.quality?.detail??1));for(let m=0;m<i;m++){const p=o[m*7%o.length];e.push(p.pos.x+s.range(-.3,.3),p.pos.y-s.range(.2,.8),p.pos.z,p.rel),t.push(p.n.x,p.n.y,p.n.z,3),a.push(s.range(0,99),s.range(.45,.8))}const h=_.slice(0,I).filter(m=>m.sp<1.5);for(let m=0;m<40&&h.length;m++){const p=s.pick(h);e.push(p.pos.x,p.pos.y,p.pos.z,p.rel),t.push(p.n.x,p.n.y,p.n.z,2),a.push(s.range(0,99),s.range(.07,.11))}const c=new r.InstancedBufferGeometry;c.setAttribute("position",new r.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),c.setIndex([0,1,2,0,2,3]),c.setAttribute("dA",new r.InstancedBufferAttribute(new Float32Array(e),4)),c.setAttribute("dN",new r.InstancedBufferAttribute(new Float32Array(t),4)),c.setAttribute("dS",new r.InstancedBufferAttribute(new Float32Array(a),2)),c.instanceCount=a.length/2;const w=new r.ShaderMaterial({uniforms:S({uDust:{value:ye.clone().lerp(v(L[6]),.35).multiplyScalar(.9)}}),vertexShader:N0,fragmentShader:T0,fog:!0,transparent:!0,depthWrite:!1,side:r.DoubleSide}),N=new r.Mesh(c,w);N.frustumCulled=!1,N.renderOrder=3,z.add(N),dt.push(N),zt=N}if(u.harpy!==!1){const e=ht(a0,{defines:{HARPY:1}}),t=new r.Mesh(Nt(a0),e);t.frustumCulled=!1,t.renderOrder=1,z.add(t),dt.push(t)}const Kt=[];for(let e=0;e<(u.lead|0);e++){const t={uHarpy:{value:new r.Vector3(0,-500,0)},uHarpyW:{value:new r.Vector3(0,0,1)},uHarpyF:{value:new r.Vector3(-1,0,0)},uHarpyPh:{value:0},uHarpyOn:{value:0},uSolo:{value:new r.Vector4(0,1.25,.85,0)}},a=ht(Ft,{defines:{HARPY:1}});Object.assign(a.uniforms,t);const n=new r.Mesh(kt,a);n.frustumCulled=!1,n.renderOrder=1,z.add(n),Kt.push({U:t,mesh:n})}const ot=u.harpyAt?u.harpyAt:(e,t=new r.Vector3)=>e<0?t.set(14-25*e,30-7*e,22+13.5*e):t.set(14-25*e,30+.35*e*e,22+.8*e*e),h0=(e,t=new r.Vector3)=>{ot(e,R);for(let a=0;a<160;a++){t.copy(R).addScaledVector(b,-a);const n=k.zAt(t.x,t.y);if(n>-900&&t.z<=n)return t;if(t.y<0)break}return null},Mt=V.xb,jt=k.topAt(Mt)*.3,At=$(-10,17,46),f0={flyThrough:D.map(e=>$(e[1],e[2],e[3])),eyeLine:D,buttress:$(Mt,jt,k.zAt(Mt,jt)),scarletBand:$(0,k.topAt(0)*.72,k.zAt(0,k.topAt(0)*.72)),bandNormal:$(0,0,1),waveOrigin:$(Ht,Z,k.zAt(Ht,Z)),harpyOver:ot(0),wheelCenter:Ae.clone(),wheelRadius:Re.slice(),rim:E.rim,foot:E.foot,snags:E.snagTips,viewpoints:{approach:{position:$(140,3,235),look:$(20,22,0)},alongWall:{position:$(84,9,22),look:$(20,20,4)},flush:{position:$(14,14,22),look:$(-40,22,6)},wheel:{position:$(-95,12,40),look:Ae.clone()}},portalSeat:{position:$(-175,14,118),facing:$(.9,0,-.44).normalize()},sunDir:b.clone()};let Ct=null,Gt=0;const Qt=u.harpyEnd??12.5,d0=u.backBirds??320,nt=new r.Vector3,Pt=Math.PI*2,p0=k.tris+E.tris+kt.index.count/3*_.length+It.index.count/3*se.length,Xt={object:z,radius:14,height:st,center:At,extent:{length:Jt,height:st,depth:40},anchors:f0,ground:!0,groundY:0,eventSeconds:W,flushAt:H,stats:{macaws:_.length,parrots:se.length,parrotsNear:tt.length,laneBirds:Rt,early:bt*2,triangles:Math.round(p0),cast:d,buildMs:0},setProgress(e){Ct=e*W-H},setFlushTime(e){Ct=e},setShadowLine(e){K.uShadowY.value=e},setLight(e={}){e.sunColor&&K.uSunCol.value.set(e.sunColor).multiplyScalar(e.sunIntensity??2.7),e.skyColor&&K.uSkyCol.value.set(e.skyColor).lerp(v("#cfc8e6"),.25).multiplyScalar(1),e.groundColor&&K.uGndCol.value.set(e.groundColor).multiplyScalar(.26)},harpyAt:ot,shadowAt:h0,eyeAt:Ve,wheelAt:wt,track:x,skein:Fe,skeinAt:(e,t=new r.Vector3)=>{const a=He(e),n=a[0]+.5*a[1];return Ce((e+n-X.t0)/X.dt,t),t.y+=a[5]-a[2]*n,t},setStage(e){Gt=e},setPerches(e){const t=Ge.geometry,a=t.attributes.iP,n=t.attributes.iQ,o=Math.floor(e.length/2);if(!o)return;const i=[];for(let c=0;c<Fe.length;c+=2)i.push(c);i.sort((c,w)=>Fe[w].cf-Fe[c].cf);const h=[];for(let c=0;c<o;c++)h.push(c);h.sort((c,w)=>e[c*2].t-e[w*2].t),i.forEach((c,w)=>{const N=h[Math.min(w,o-1)%o],m=w>=o?.8:0;for(let p=0;p<2;p++){const g=Fe[c+p],f=e[N*2+p];let M=f.t;for(let U=0;U<4;U++){const A=He(M);M=f.t-(A[0]+g.cf*A[1])+.3}g.perch=f.p.clone(),g.perch.y+=m,g.pn=f.n.clone(),g.landT=M,a.setXYZW(c+p,g.perch.x,g.perch.y,g.perch.z,M),n.setXYZ(c+p,f.n.x,f.n.y,f.n.z),t.attributes.iC.setW(c+p,f.hop??0)}}),a.needsUpdate=!0,n.needsUpdate=!0,t.attributes.iC.needsUpdate=!0},setExtras(e){const t=Ge.geometry,a=t.attributes,n=Fe.length;e.slice(0,at.length).forEach((o,i)=>{const h=n+i,c=at[i];a.iA.setXYZW(h,o.p.x,o.p.y,o.p.z,1e6),a.iN.setXYZW(h,o.n.x,o.n.y,o.n.z,o.roll??0),a.iP.setXYZW(h,o.p.x,o.p.y,o.p.z,1e6),a.iQ.setXYZ(h,o.n.x,o.n.y,o.n.z),a.iC.setXYZW(h,o.sp??0,o.size??1.25,c.twist*(1+.999*c.pairH),o.hop??0),a.iS.setXYZW(h,1,1e6,0,-1)});for(const o of["iA","iN","iP","iQ","iC","iS"])a[o].needsUpdate=!0},setLead(e,t,a,n,o,i=0,h=0){const c=Kt[e];c&&(c.U.uHarpy.value.copy(t),c.U.uHarpyF.value.copy(a),c.U.uHarpyW.value.set(0,1,0).cross(a).normalize(),c.U.uHarpyPh.value=n,c.U.uHarpyOn.value=o,c.U.uSolo.value.x=h,c.U.uSolo.value.w=i,c.mesh.visible=o>.001)},birds:_,birdAt:(e,t,a)=>i0(_[e],t,a),faceZ:(e,t)=>k.zAt(e,t),rimY:e=>k.topAt(e),update(e,t,a){ue.uTime.value=t,z.updateWorldMatrix(!0,!1),nt.setFromMatrixPosition(a.matrixWorld),z.worldToLocal(nt),ue.uCamL.value.copy(nt);let n=Ct;if(n===null){const h=Math.atan2(nt.x-At.x,nt.z-At.z),c=((h+.5)%Pt+Pt)%Pt;n=((t+2*c+16.02)%Vt+Vt)%Vt-4}ue.uTe.value=n;{const h=He(n);ue.uSkL.value.set(h[0],h[1],h[2],0),ue.uSkQ.value.set(h[3],h[4],h[5],h[6])}const o=Gt;ue.uBack.value=o===2?1:0;for(const h of dt)h.visible=o!==1;if(zt&&(zt.visible=o===0),ft.visible=o===0,Ge.geometry.instanceCount=o===0?xt.length:o===1?Math.max(Ot,1):Math.min(xt.length,Ot+d0),ot(n,J.uHarpy.value),ot(n+.1,O),J.uHarpyF.value.subVectors(O,J.uHarpy.value).normalize(),J.uHarpyW.value.set(0,1,0).cross(J.uHarpyF.value).normalize(),J.uHarpyOn.value=Ne(-9,-8,n)*(1-Ne(Qt-1.5,Qt,n)),u.scare){const h=u.scare(n);ue.uScare.value.set(J.uHarpy.value.x,J.uHarpy.value.y,J.uHarpy.value.z,h)}const i=n*5.2;J.uHarpyPh.value=i,J.uHarpyFlap.value=.5+.5*Math.cos(.42*Math.sin(i))},dispose(){}};return Xt.stats.buildMs=Math.round(0),Xt}export{L0 as buildHero};
