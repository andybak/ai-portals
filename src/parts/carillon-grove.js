import*as m from"three";import{clamp as Pt,lerp as Q,smoothstep as Et,makeRng as ta,hashSeed as ea}from"../kit/core.js";const aa=["#D5DAE6","#8FA5B8","#A9D6C4","#3F9C86","#22323C","#0B1016","#FFC56B"],_=Math.PI*2,Fe=50,zt=230,ie=260,ve=60,qt=11,Vt=86.6;class Nt{constructor(){this.p=[],this.n=[],this.uv=[],this.c=[],this.pv=[],this.d=[],this.i=[],this.pr=[],this.pre=0,this.count=0,this.pivot=[0,0,0,0],this.data=[0,0,0,0],this.mi=[],this.mdec=1}set(n,e){return this.pivot=n,this.data=e,this}v(n,e,E,A,v,F,G,D,L){return this.p.push(n,e,E),this.n.push(A,v,F),this.uv.push(G,D),this.c.push(L[0],L[1],L[2]),this.pv.push(this.pivot[0],this.pivot[1],this.pivot[2],this.pivot[3]),this.d.push(this.data[0],this.data[1],this.data[2],this.data[3]),this.pr.push(this.pre),this.count++}quad(n,e,E,A){this.i.push(n,e,E,E,e,A),this.mdec&&this.mi.push(n,e,E,E,e,A)}grid(n,e,E,A,v){const F=this.i;for(let y=0;y<E;y++)for(let k=0;k<A;k++){const w=n+y*e+k;v?F.push(w,w+e,w+1,w+1,w+e,w+e+1):F.push(w,w+1,w+e,w+e,w+1,w+e+1)}if(!this.mdec)return;const G=y=>{const k=[];if(this.mdec<2||y<6)for(let w=0;w<=y;w++)k.push(w);else{for(let w=0;w<y;w+=2)k.push(w);k.push(y)}return k},D=G(E),L=G(A),q=this.mi;for(let y=0;y+1<D.length;y++)for(let k=0;k+1<L.length;k++){const w=n+D[y]*e+L[k],O=n+D[y+1]*e+L[k],W=n+D[y]*e+L[k+1],Y=n+D[y+1]*e+L[k+1];v?q.push(w,O,W,W,O,Y):q.push(w,W,O,O,W,Y)}}async geometry(n){const e=new m.BufferGeometry,E=this.count,A=12e3,v=async(D,L)=>{const q=new Float32Array(E*L);for(let y=0;y<D.length;y+=A*L)q.set(D.slice(y,y+A*L),y),n&&await n();return new m.BufferAttribute(q,L)};e.setAttribute("position",await v(this.p,3)),e.setAttribute("normal",await v(this.n,3)),e.setAttribute("uv",await v(this.uv,2)),e.setAttribute("color",await v(this.c,3)),e.setAttribute("aPivot",await v(this.pv,4)),e.setAttribute("aData",await v(this.d,4)),e.setAttribute("aPre",await v(this.pr,1));const F=D=>new m.BufferAttribute(E>65535?Uint32Array.from(D):Uint16Array.from(D),1);e.setIndex(F(this.i)),n&&await n();const G=new m.BufferGeometry;for(const D in e.attributes)G.setAttribute(D,e.attributes[D]);return G.setIndex(F(this.mi)),e.userData.mirror=G,e}get tris(){return this.i.length/3}}function Ie(r,n,e,E,A,v,F,G,D,L){for(let y=D;y<=L;y++){const k=G(y/e);for(let w=0;w<=n;w++){const O=w/n*_,W=Math.sin(O),Y=Math.cos(O),[ot,ut]=E(k,O),[vt,Mt]=E(Math.min(1,k+.001),O),[rt,ht]=E(Math.max(0,k-.001),O);let ct=vt-rt,X=Mt-ht;const Kt=Math.hypot(ct,X)||1;ct/=Kt,X/=Kt,r.v(v+W*ot,ut,F+Y*ot,-X*W,ct,-X*Y,w/n,k,A(k,O))}}}function pt(r,n,e,E,A,v=0,F=0,G=D=>D){const D=r.count;Ie(r,n,e,E,A,v,F,G,0,e),r.grid(D,n+1,e,n,!0)}async function oa(r,n,e,E,A,v,F=8){const G=r.count;for(let D=0;D<=e;D+=F)Ie(r,n,e,E,A,0,0,L=>L,D,Math.min(e,D+F-1)),v&&await v();r.grid(G,n+1,e,n,!0)}const J=new m.Vector3,it=new m.Vector3,Rt=new m.Vector3,ne=new m.Vector3;function K(r,n,e,E,A,v={}){const F=r.count,G=n.length,D=v.flat??1;J.subVectors(n[1],n[0]).normalize(),v.ref?it.copy(v.ref):it.set(Math.abs(J.y)>.9?1:0,Math.abs(J.y)>.9?0:1,0),it.addScaledVector(J,-it.dot(J)).normalize();for(let q=0;q<G;q++){const y=q/(G-1);J.subVectors(n[Math.min(G-1,q+1)],n[Math.max(0,q-1)]).normalize(),it.addScaledVector(J,-it.dot(J)).normalize(),Rt.crossVectors(J,it);for(let k=0;k<=e;k++){const w=k/e*_+(v.phase||0)+(v.twist?v.twist*y:0),O=Math.cos(w),W=Math.sin(w),Y=E(y,w);ne.set(0,0,0).addScaledVector(it,O).addScaledVector(Rt,W*D);const ot=it.x*O+Rt.x*W,ut=it.y*O+Rt.y*W,vt=it.z*O+Rt.z*W;r.v(n[q].x+ne.x*Y,n[q].y+ne.y*Y,n[q].z+ne.z*Y,ot,ut,vt,k/e,y,A(y,w))}}const L=e+1;if(r.grid(F,L,G-1,e,!1),v.cap){const q=n[G-1],y=r.v(q.x+J.x*v.cap,q.y+J.y*v.cap,q.z+J.z*v.cap,J.x,J.y,J.z,.5,1,A(1,0)),k=F+(G-1)*L;for(let w=0;w<e;w++)r.i.push(k+w,k+w+1,y)}}function nt(r,n,e,E,A,v,F,G,D=()=>1){const L=r.count;for(let q=0;q<=F;q++){const y=q/F,k=y*Math.PI,w=Math.sin(k),O=Math.cos(k);for(let W=0;W<=v;W++){const Y=W/v*_,ot=D(Y,y),ut=Math.sin(Y)*w,vt=Math.cos(Y)*w,Mt=ut/e,rt=O/E,ht=vt/A,ct=Math.hypot(Mt,rt,ht)||1;r.v(n.x+ut*e*ot,n.y+O*E*ot,n.z+vt*A*ot,Mt/ct,rt/ct,ht/ct,W/v,y,G(y,Y))}}r.grid(L,v+1,F,v,!0)}const s=(r,n,e)=>new m.Vector3(r,n,e),sa=r=>{const n=new m.Color(r);return[n.r,n.g,n.b]},Z=(r,n,e)=>[r[0]+(n[0]-r[0])*e,r[1]+(n[1]-r[1])*e,r[2]+(n[2]-r[2])*e];function gt(r,n){return new m.CatmullRomCurve3(r,!1,"centripetal").getPoints(n)}const Ut=[-9,-.7],wt=`
uniform float uS, uTime, uAfter;
float drawBack(float s) { return smoothstep(${Ut[0].toFixed(2)}, ${Ut[1].toFixed(2)}, s); }   // 0 = the clapper hangs, 1 = it is fully drawn back
float tollCore(float t, float seed, float per) {
  float flick = 0.82 + 0.18 * sin(t * 31.4 + seed * 40.0);
  float e = exp(-t / 3.2) * flick;
  e += 0.45 * exp(-max(t - per, 0.0) / 1.6) * step(per, t) + 0.28 * exp(-max(t - 2.0 * per, 0.0) / 1.6) * step(2.0 * per, t);
  return e;
}
float tollEnv(float t, float seed, float per) {      // t = seconds since the toll reached this bell
  if (t < 0.0) return 0.0;
  float e = tollCore(t, seed, per) + uAfter * (0.72 + 0.28 * sin(t * 1.9 + seed * 9.0)) * smoothstep(0.5, 3.0, t);
  return smoothstep(0.0, 0.3, t) * min(e, 1.3);
}
float tollPre(float pre, float seed, float per) {    // an earlier, scripted toll (pre < 0 = its time relative to the strike); no after-shimmer
  float t = uS - pre;
  if (pre > -0.001 || t < 0.0) return 0.0;
  // the grove holds its breath while the Bourdon's clapper is drawn back: a toll begins at its full strength whenever it begins,
  // dies down with what was left of the draw at that moment, and is silent once the clapper is fully back. After that a bell
  // stays quiet until the Bourdon's own toll reaches it
  float hush = clamp((1.0 - drawBack(uS)) / max(1.0 - drawBack(pre), 0.02), 0.0, 1.0);
  return smoothstep(0.0, 0.3, t) * min(tollCore(t, seed, per), 1.3) * hush;
}`,Ee=`
attribute vec4 aPivot; attribute vec4 aData; attribute float aPre;
varying vec3 vN, vW, vL; varying vec2 vUv; varying vec4 vData; varying vec3 vCol; varying float vPre, vPend, vThin;
#ifdef THIN
uniform float uPx;
#endif
${wt}
#include <common>
#include <fog_pars_vertex>
void main() {
  vec3 p = position, n = normal; vL = position; vThin = 1.0;
  if (aPivot.w > 0.0) {                                // pendulum swing about the hanging point
    float per = aPivot.w, t = uS - aData.x;
    float ang = 0.035 * sin(uTime * 6.2832 / per + aData.z * 20.0);
    if (t > 0.0) ang += 0.105 * sin(6.2832 * t / per) * exp(-t / 16.0);
    float tp = uS - aPre;
    if (aPre < -0.001 && tp > 0.0) ang += 0.105 * sin(6.2832 * tp / per) * exp(-tp / 9.0);
    ang *= (aData.w > 0.5 && aData.w < 1.5) ? 1.9 : 1.0;   // clapper seeds swing wider than their bells
    vec3 ax = vec3(cos(aData.z * 37.0), 0.0, sin(aData.z * 37.0)), q = p - aPivot.xyz;
    float c = cos(ang), s = sin(ang);
    p = aPivot.xyz + q * c + cross(ax, q) * s + ax * dot(ax, q) * (1.0 - c);
    n = n * c + cross(ax, n) * s + ax * dot(ax, n) * (1.0 - c);
  }
  vec4 w = modelMatrix * vec4(p, 1.0);
#ifdef THIN
  if (aData.y > 0.0 && (aData.w < 0.5 || aData.w > 2.5)) {   // thin lines (ropes, rungs, cables): aData.y = their radius; never thinner than ~1.6 px
    float need = 0.8 * length(cameraPosition - w.xyz) / max(uPx, 1.0);
    if (need > aData.y) { p += n * (need - aData.y); w = modelMatrix * vec4(p, 1.0); vThin = aData.y / need; }
  }
#endif
  vW = w.xyz; vN = normalize(mat3(modelMatrix) * n);
  vUv = uv; vData = aData; vCol = color; vPre = aPre; vPend = step(0.001, aPivot.w);
  vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ia=`
uniform vec3 uBody, uLip, uPale, uGold, uSky, uStrike; uniform float uAmb, uBackA, uIn, uAmberK, uGlassAmb, uVeinK, uClear, uDense, uDawnK; uniform vec2 uLightAz; uniform vec3 uEmber;
varying vec3 vN, vW, vL; varying vec2 vUv; varying vec4 vData; varying vec3 vCol; varying float vPre, vPend;
${wt}
#include <common>
#include <fog_pars_fragment>
float veins(vec2 uv, float n, float seed) {
  float x = uv.x * n, v = clamp(uv.y, 0.0, 1.0);
  x += 0.07 * sin(v * 9.0 + floor(x) * 1.7 + seed * 6.0) * v;
  float f = abs(fract(x) - 0.5), w = 0.035 + 0.03 * v + fwidth(x) * 0.8;
  float m = 1.0 - smoothstep(w * 0.3, w, f);
  float b1 = abs(f - 0.55 * max(v - 0.36, 0.0));
  m = max(m, 0.75 * (1.0 - smoothstep(w * 0.2, w * 0.75, b1)) * step(0.36, v));
  float b2 = abs(f - (0.55 * (v - 0.36) - 0.62 * max(v - 0.64, 0.0)));
  m = max(m, 0.55 * (1.0 - smoothstep(w * 0.15, w * 0.6, b2)) * step(0.64, v));
  float b3 = abs(f - 0.3 * max(v - 0.78, 0.0));
  m = max(m, 0.45 * (1.0 - smoothstep(w * 0.15, w * 0.5, b3)) * step(0.78, v));
  return m * smoothstep(0.0, 0.05, v);
}
// the finer net between the ribs of the Bourdon, seen from inside: side veins leave every rib up-and-out like a leaf's,
// a second, fainter family crosses them, and a thread runs up the middle of every panel where the two sides meet
float net(vec2 uv, float f, float pid, float fwx, float fwv, float seed) {
  float v = clamp(uv.y, 0.0, 1.0), wd = 0.3 + 0.9 * v, h = fract(sin(pid * 12.9898 + seed * 7.0) * 43758.5);   // a panel is wider toward the lip; every rib has its own rhythm
  float k1 = 20.0 + 7.0 * h;
  float q1 = v * k1 + f * 4.4 * wd + f * f * 3.0 + 3.0 * h + 0.3 * sin(f * 12.0 + v * 8.0 + h * 6.0);
  float w1 = (0.05 + 0.1 * (0.5 - f)) + (fwv * k1 + fwx * 5.5 * wd) * 0.9;
  float m = (1.0 - smoothstep(w1 * 0.45, w1, abs(fract(q1) - 0.5))) * (0.35 + 1.3 * (0.5 - f)) * clamp(0.4 / max(w1, 0.12), 0.0, 1.0);
  float q2 = v * 57.0 - f * 7.0 * wd + 2.0 * sin(v * 11.0 + h * 9.0) + 1.5 * sin(f * 9.0 + h * 4.0);
  float w2 = 0.07 + (fwv * 57.0 + fwx * 7.0 * wd) * 0.9;
  m = max(m, 0.3 * (1.0 - smoothstep(w2 * 0.45, w2, abs(fract(q2) - 0.5))) * clamp(0.3 / max(w2, 0.1), 0.0, 1.0));
  float wm = 0.015 + fwx * 0.9;
  m = max(m, 0.45 * (1.0 - smoothstep(wm * 0.4, wm, 0.5 - f)));
  return m * smoothstep(0.02, 0.09, v);
}
void main() {
  float kind = vData.w, v = clamp(vUv.y, 0.0, 1.0);    // crown-to-lip coordinate, kept in its own range before it is squared or raised to a power
  vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vW);
  float fr = pow(max(1.0 - abs(dot(N, V)), 0.0), 2.2);
  float isWall = step(kind, 1.5), isRib = step(1.5, kind) * step(kind, 2.5), isLip = step(2.5, kind), isB = step(kind, 0.5);
  float vn = isWall * veins(vUv, vData.y, vData.z);
  // thickness: lip, veins and grazing angles read as deeper, more saturated glass
  float thick = clamp(pow(v, 3.5) * 0.85 + vn * 0.55 + fr * 0.6 + isLip + isRib * 0.25, 0.0, 1.0);
  float streak = 0.5 + 0.5 * sin(vUv.x * 190.0 + sin(v * 14.0 + vData.z * 5.0) * 3.0);      // drawn-glass striation
  vec3 tint = mix(uBody, uLip, thick) * (0.9 + 0.1 * streak);
  float sky = 0.62 + 0.38 * N.y, amb = max(uAmb, uGlassAmb);                                   // glass keeps its own colour in the dark
  amb = mix(amb, max(amb, 0.72), isLip);                                                       // the thick bead holds light of its own
  vec3 col = tint * (0.55 + 0.45 * sky) * amb * 1.05;
  col = mix(col, uPale * amb * 0.92, max(isRib * 0.8, smoothstep(0.55, 1.0, vn) * 0.75));
  col += uSky * amb * fr * (0.4 - 0.26 * isLip);                                               // pearl reflection at the rim
  // the glass is never still: slow bands of sky light slide down the wall and along the veins as the bell breathes
  float gl = pow(0.5 + 0.5 * sin(v * (7.0 + 5.0 * step(kind, 0.5)) - uTime * 1.5 + vData.z * 20.0 + sin(vUv.x * 12.566 + vData.z * 9.0) * 1.3), 5.0);
  col += uSky * amb * gl * isWall * (0.13 + 0.24 * vn + 0.3 * step(kind, 0.5)) * (0.4 + 0.6 * v);
  float alpha = clamp(0.4 + 0.42 * thick + 0.25 * fr + isRib, 0.0, 0.96);
  if (!gl_FrontFacing) alpha *= uBackA;
  // toll: gold from the strike point outward, veins leading the wall
  float d = distance(vL, uStrike);
  float lead = max(max(vn, isRib), isLip * 0.6);
  float tA = vData.x + (1.0 - max(step(0.5, kind) * step(kind, 1.5), vPend)) * d / mix(125.0, 420.0, lead);
  float g = tollEnv(uS - tA, vData.z + vUv.x * 3.0, 4.0 + vData.z * 5.0);
  g = max(g, tollPre(vPre, vData.z + vUv.x * 3.0, 4.0 + vData.z * 5.0));
  float fq = (uS - tA) * 4.5, fp = (uS - vPre) * 4.5;
  float front = exp(-fq * fq) * step(0.0, uS) + exp(-fp * fp) * step(vPre, -0.001);                                 // the bright crack of the front itself
  float T = uTime * 0.6;
  float ca = pow(0.5 + 0.5 * sin(vUv.x * 75.0 + sin(v * 21.0 - T * 1.7) * 2.4 + T), 5.0)
           + pow(0.5 + 0.5 * sin(vUv.x * 44.0 - sin(v * 13.0 + T * 1.1) * 3.1 - T * 0.7), 6.0);
  // gold after-shimmer: bands of light that climb the wall toward the crown
  float band = pow(0.5 + 0.5 * sin(v * 26.0 + uTime * 1.9 + 1.4 * sin(vUv.x * 12.566 + vData.z * 7.0)), 4.0);
  // the wall turns to amber glass; only vein cores, ribs, lip and the travelling front are HDR
  float amberK = mix(uAmberK, 1.0, uIn * max(isB, isRib)), veinK = mix(uVeinK, 1.0, uIn);     // bright hours need a deeper, stronger amber outside to beat their sky
  vec3 GA = uGold * mix(vec3(1.0, 0.8, 0.52), vec3(1.0, 0.68, 0.36), clamp(amberK - 1.0, 0.0, 1.0));
  vec3 amber = GA * amberK * (gl_FrontFacing ? 0.5 + 0.28 * v * v + ca * 0.16 + 0.14 * band * isB : 0.36 + 0.2 * v * v + ca * 0.3);
  // some seconds after its toll a wall relaxes back toward celadon: gold stays in veins, ribs, lip and the travelling shimmer
  float rel = smoothstep(mix(3.5, 7.0, isB), mix(9.0, 14.0, isB), uS - tA) * isWall, cap = mix(0.94, mix(0.76, 0.26, isB), rel);
  float inK = gl_FrontFacing ? 0.0 : isB * uIn, nt = 0.0;
  float x24 = vUv.x * 24.0, fwx = fwidth(x24), fwv = fwidth(v);              // derivatives are taken outside the branch
  if (!gl_FrontFacing) { col = mix(col, mix(uBody, uLip, 0.5 + 0.3 * vn + 0.2 * v * v) * amb * (0.5 + 0.28 * sky) * (0.88 + 0.12 * streak), rel * isB * 0.88); alpha = min(alpha + 0.2 * rel * isB, 0.96); }   // from inside, the Bourdon is thick green glass
  if (inK > 0.0) {
    // INSIDE THE BOURDON the wall is thick clear glass: the grove, the arch and the sky are seen through its panes. The glass
    // gathers where it is thick (beside every rib, along the leaf veins, in the last metres above the lip) and at grazing angles
    float f = abs(fract(x24) - 0.5);
    nt = net(vUv, f, floor(x24 + 0.5), fwx, fwv, vData.z);
    float bright = smoothstep(0.5, 1.0, uAmb);                                              // a bright sky behind: the veins are darker lines; at night they carry the light
    float flank = 1.0 - smoothstep(0.02, 0.1, f), vv = max(vn, mix(0.35, 0.85, bright) * nt);
    float lipZ = smoothstep(0.86, 1.0, v), crownZ = 1.0 - smoothstep(0.02, 0.2, v);
    float low = smoothstep(0.58, 0.78, v), dense = (1.0 - low) * (1.0 - 0.7 * crownZ);     // clear at the mouth (the grove and the horizon show through), rich and deep above, thin and pale in the crown
    // a pane is thin in its middle and thick toward its ribs and along its leaf veins, all the way up the wall: the thin glass is
    // clearer and paler, so what stands or glows behind the wall shows between the veins and no pane is one flat sheet
    float pane = smoothstep(0.1, 0.4, f) * (1.0 - min(nt, 1.0));
    dense *= 1.0 - 0.7 * pane;
    float dC = distance(cameraPosition, vW), air = 1.0 - exp(-dC / 150.0);
    float tk = clamp(0.7 * flank + 0.2 * (1.0 - smoothstep(0.06, 0.34, f)) + 0.46 * vv + 0.8 * lipZ * lipZ + 0.6 * fr, 0.0, 1.0);
    float back = max(uAmb, 0.42);                                                          // how bright the world behind the glass is
    vec3 T = mix(mix(uBody * vec3(0.8, 1.25, 1.1), uLip * mix(1.5, 1.25, bright), 0.8 * dense), uLip * 0.9, tk) * (0.9 + 0.1 * streak);   // what the glass lets through
    float sideL = 0.5 + 0.5 * dot(vL.xz / max(length(vL.xz), 1.0), uLightAz);               // the side of the bell toward the bright band of the sky is lit through; the far side is deep
    // the light inside: gold thrown up from the lit lake on the lower wall, the portal's pale light in the crown, deep glass between
    float warm = smoothstep(0.4, 1.0, v) * min(g, 1.0);
    vec3 inner = T * mix(vec3(1.0), vec3(0.6, 1.0, 0.94), bright * dense) * uSky * back * mix(1.25, 1.1, bright * dense) * mix(0.9, 1.1, sideL * sideL * (3.0 - 2.0 * sideL));
    inner += T * uGold * vec3(1.0, 0.72, 0.4) * uDawnK * sideL * sideL * 0.04;
    inner += T * (uGold * vec3(1.0, 0.76, 0.45) * warm * 0.2 + uPale * crownZ * 0.4) + uPale * back * 0.12 * nt;
    inner += uSky * back * (fr * 0.15 + gl * 0.05);
    inner = mix(inner, uPale * back * 0.6 + uGold * 0.08 * min(g, 1.0), 0.14 * air * (1.0 - 0.7 * bright));         // the air between us and the far wall
    float aIn = clamp(mix(mix(uClear, uDense, dense), 0.94, tk), 0.0, 0.96);
    col = mix(col, inner, inK); alpha = mix(alpha, aIn, inK); cap = mix(cap, 0.0, inK);
  }
  // the lip stays deep celadon: its gold is a bead of light sliding round inside it, and every vein ends in it as a bright root
  float core = pow(0.5 + 0.5 * sin(vUv.x * 6.2832 * floor(vData.y * 0.5 + 0.25) - uTime * 1.2 + vData.z * 9.0), 3.0) * (1.0 - 0.8 * fr);   // (+ 0.25: a whole count must not fall to the count below it between two pixels)
  float root = 1.0 - smoothstep(0.05, 0.2, abs(fract(vUv.x * vData.y) - 0.5));
  float lipGold = isLip * (0.05 + 1.1 * core + 1.6 * root);
  // the Bourdon's own lip is a rim of thick glass lit from within, the same all the way round: deep celadon at its edge and
  // bright along its heart. After the toll a thread of gold lies in that heart, swelling slowly as it slides round, and every
  // vein ends in it as a small bright root
  float big = isLip * (1.0 - vPend), heart = clamp(dot(N, V), 0.0, 1.0); heart *= heart;
  col = mix(col, uLip * (0.45 + 1.2 * heart) * max(amb, 0.72) + uSky * amb * fr * 0.14, big);
  float thread = 0.55 + 0.45 * sin(vUv.x * 18.85 - uTime * 0.6 + vData.z * 9.0);
  lipGold = mix(lipGold, heart * (0.5 + 0.6 * thread + 0.8 * (1.0 - smoothstep(0.02, 0.07, abs(fract(vUv.x * vData.y) - 0.5)))), big);
  cap = mix(cap, 0.0, isLip);
  col = mix(col, amber * (1.0 + 0.9 * max(vn * veinK, isRib)), clamp(g * 1.5, 0.0, cap));
  col += uGold * vec3(1.0, 0.8, 0.52) * ca * 0.2 * rel * isB * min(g, 1.0) * (1.0 - 0.6 * inK);
  col += uGold * vec3(1.0, 0.86, 0.62) * g * (vn * vn * 1.05 * veinK * mix(1.0, 0.25 + 0.75 * band, inK) + isRib * (0.95 * veinK - 0.45 * uIn) + lipGold) + uGold * front * (0.5 + 2.2 * lead) * mix(1.0, 0.5, clamp(amberK - 1.0, 0.0, 1.0));
  // inside: ripples of after-shimmer climb the wall along the veins, and the lit lake throws its caustics on the lower wall
  col += inK * uGold * vec3(1.0, 0.8, 0.5) * min(g, 1.0) * (band * (0.04 + 0.9 * vn + 0.4 * nt) + 0.05 * vn + ca * 0.2 * smoothstep(0.5, 0.95, v));
  // the clapper's ember pressed against the wall shines through the glass where it struck
  float hd = d / 9.5, hot = exp(-hd * hd) * isB * smoothstep(0.0, 0.25, uS) * (0.85 + 0.15 * sin(uTime * 23.0) * exp(-max(uS, 0.0) * 0.3));
  col += uGold * vec3(1.0, 0.82, 0.55) * hot * (1.0 + 1.0 * vn);
  // THE BUILD. As the clapper is drawn back (drawBack, the clapper's own key) its ember's copper gathers in the glass round the
  // place the ember hangs: low in the wall and faint in the veins, half as strong one mouth-radius from the ember. Each part of
  // the wall keeps it until the strike's own front reaches that part (tA, the same arrival the gold has) and gives it up to the
  // bright crack of that front, so nothing dips between the two and the strike is a plain step up in brightness and in colour:
  // the copper is the deep amber, under half the wall's gold after the strike, and under a third of the veins'
  float ce = distance(vL, uEmber) / ${ve.toFixed(1)};
  float chg = isB * drawBack(uS) * step(uS, tA) / (1.0 + ce * ce);
  col += uGold * vec3(1.0, 0.68, 0.36) * chg * (0.42 + 0.3 * vn + 0.3 * ca) * (1.0 - 0.6 * inK);
  alpha = clamp(alpha + g * 0.38 * (1.0 - 0.75 * inK) + front * 0.4 + chg * 0.16, 0.0, 0.98);
  alpha = mix(alpha, 0.95, big);
  if (isRib * uIn > 0.0) {
    // a rib seen from inside the bell is a rod of pale glass, dark at its edges and bright along its core, and the after-shimmer
    // climbs it toward the collar as beads of gold
    float nvR = clamp(dot(N, V), 0.0, 1.0), aR = max(uAmb * 0.9, 0.62);
    float bead = clamp(0.5 + 0.5 * sin(v * 19.0 + uTime * 1.7 + floor(x24) * 2.399), 0.0, 1.0); bead = bead * bead * bead;
    vec3 rc = mix(uLip * 0.6, mix(uPale, uLip * 1.2, 0.7 * smoothstep(0.5, 1.0, uAmb)), nvR * nvR) * aR * (0.4 + 0.6 * nvR) + uSky * aR * pow(max(nvR, 1e-4), 8.0) * 0.2;
    rc += uGold * vec3(1.0, 0.82, 0.55) * min(g, 1.0) * (0.4 + 1.6 * bead) * (0.35 + 0.65 * nvR);
    col = mix(col, rc, isRib * uIn); alpha = mix(alpha, 0.93, isRib * uIn);
  }
  gl_FragColor = vec4(col, alpha);
  #include <fog_fragment>
}`,na=`
uniform vec3 uGold, uSky, uCold; uniform float uAmb, uCharge, uPilot, uRime, uRim;
varying vec3 vN, vW, vL; varying vec2 vUv; varying vec4 vData; varying vec3 vCol; varying float vPre, vPend, vThin;
${wt}
#include <common>
#include <fog_pars_fragment>
void main() {
  float kind = vData.w;
  vec3 N = normalize(vN), V = normalize(cameraPosition - vW);
  float nv = clamp(dot(N, V), 0.0, 1.0), fr = pow(1.0 - nv, 3.0);
  float sky = 0.5 + 0.5 * N.y;
  vec3 col = vCol * (0.35 + 0.65 * sky) * uAmb;
  if (kind < 0.5) {                                    // lacquer: thin pearl rim, tight sky sheen, faint gold kick from the bell
    float rimFar = 1.0 - 0.8 * smoothstep(60.0, 220.0, distance(cameraPosition, vW));       // far stalks stay pure silhouettes
    col += uSky * uRim * rimFar * (pow(1.0 - nv, 4.0) * 0.42 + pow(sky, 6.0) * 0.03 + 0.012);
    float g = tollEnv(uS - length(vL.xz) / 300.0, 0.3, 6.0);
    vec3 toAxis = normalize(vec3(-vL.x, 0.0, -vL.z) + 1e-4);
    col += uGold * g * (pow(max(dot(N, toAxis), 0.0), 2.0) * 0.05 + fr * 0.04);
    // what hangs with a bell (its cord, its knots, its clapper's stem) takes a glint of that bell's own gold while it rings
    float gb = max(tollEnv(uS - vData.x, vData.z, 4.0 + vData.z * 5.0), tollPre(vPre, vData.z, 4.0 + vData.z * 5.0));
    col += uGold * vec3(1.0, 0.8, 0.5) * min(gb, 1.0) * vPend * 0.45;
  } else if (kind < 1.5) {                             // ember seed: pilot from the first frame, 6x on a toll
    float g = max(tollEnv(uS - vData.x, vData.z, 4.0 + vData.z * 5.0), tollPre(vPre, vData.z, 4.0 + vData.z * 5.0));
    float pulse = 0.85 + 0.15 * sin(uTime * 2.3 + vData.z * 30.0);
    float hot = uPilot * pulse * (1.0 + uCharge * vData.y) + 5.0 * g;
    col = uGold * vec3(1.0, 0.84, 0.6) * hot * (0.5 + 0.5 * nv);
  } else if (kind < 2.5) {
    col = uCold * (2.6 + 0.5 * sin(uTime * 1.3 + vData.z * 50.0)) * (vData.y > 0.001 ? vData.y : 1.0);   // aData.y = gain (window panes are dimmer than lamps)
  }
  if (kind < 0.5 || kind > 2.5) {                      // frost season: rime on everything that faces the sky
    float rm = uRime * smoothstep(0.42, 0.95, sky + 0.07 * sin(vL.y * 0.31 + vL.x * 0.7 + 2.0 * sin(vL.y * 0.13 + vL.z * 0.4)) * sin(vL.x * 0.9 - vL.z * 0.6 + vL.y * 0.07));
    col = mix(col, uSky * uAmb * 0.86, rm);
  }
  #ifdef USE_FOG
  col = mix(fogColor, col, clamp(max(vThin, 0.55), 0.0, 1.0));     // a widened thin line carries less of its own colour
  #endif
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,re=`
#ifdef USE_FOG
  uniform vec3 fogColor;
  #ifdef FOG_EXP2
    uniform float fogDensity;
    float addFog(float d, float k) { return exp(-fogDensity * fogDensity * d * d * k * k); }
  #else
    uniform float fogNear, fogFar;
    float addFog(float d, float k) { return 1.0 - smoothstep(fogNear, fogFar, d * k); }
  #endif
#else
  float addFog(float d, float k) { return 1.0; }
#endif`,ra=`
attribute vec4 aDir; attribute vec4 aSeed;
uniform float uPx;
varying float vA, vGold, vDist; varying vec2 vWing;
${wt}
void main() {
  float sd = aSeed.x, t = uS - aSeed.w * 0.9;
  vec3 p = position; float a = 0.6, gold = 0.0, size = aSeed.z, near = 0.0;
  float oa = uTime * (0.35 + 0.5 * fract(sd * 9.7)) + sd * 60.0, orr = 1.2 + 1.8 * fract(sd * 5.3);             // roosting: a slow orbit off the glass
  p += orr * vec3(sin(oa), 0.6 * sin(oa * 1.3 + sd * 20.0), cos(oa)) + 0.3 * vec3(sin(uTime * 1.3 + sd * 50.0), sin(uTime * 1.7 + sd * 31.0), cos(uTime * 1.1 + sd * 77.0));
  if (t > 0.0) {
    gold = smoothstep(0.0, 0.4, t);
    if (aSeed.y > 0.5) {                                // helix climbing the bell's axis
      // the helix: every moth climbs at the same rate along one of two strands, so the swarm reads as one gold ribbon
      float k = smoothstep(0.0, 4.0, t), k2 = smoothstep(1.5, 6.0, t), h = mod(aDir.w + uTime * 7.0, 176.0), hk = h / 176.0;
      float strand = step(0.5, fract(sd * 2.0));
      float rr = mix(length(position.xz), mix(22.0, 9.5, hk) + 1.3 * sin(sd * 211.0) * (1.0 - 0.6 * hk), k);
      float ang = h * 0.06 - uTime * 0.16 + strand * 3.14159;
      vec3 hp = vec3(sin(ang) * rr, 52.0 + h, cos(ang) * rr);
      hp += (0.35 + 0.5 * fract(sd * 17.0)) * vec3(sin(uTime * 2.1 + sd * 40.0), sin(uTime * 2.7 + sd * 22.0), cos(uTime * 1.9 + sd * 63.0));
      p = mix(p, hp, k2);
      a = 0.9 * smoothstep(0.0, 0.04, hk) * (1.0 - smoothstep(0.95, 1.0, hk)); size *= 1.5; near = 1.0;
    } else {                                            // thrown off the glass toward the neighbours, in streams
      float fly = aDir.w * (1.0 - exp(-t * 0.55));
      p += aDir.xyz * fly + vec3(0.0, 6.0 * sin(t * 0.8 + sd * 9.0), 0.0);
      p += (1.5 + fly * 0.03) * vec3(sin(uTime * 2.3 + sd * 44.0), cos(uTime * 1.9 + sd * 12.0), sin(uTime * 2.9 + sd * 71.0));
      a = mix(0.6, 1.0, gold) * (1.0 - smoothstep(9.0, 16.0, t) * 0.8); size *= 1.0 + gold * 0.6;
    }
  }
  float tw = 0.55 + 0.45 * sin(uTime * (5.0 + sd * 9.0) + sd * 100.0);
  vec4 mv = modelViewMatrix * vec4(p, 1.0); vDist = -mv.z;
  gl_Position = projectionMatrix * mv;
  float px = uPx * size / max(vDist, 1.0), cap = mix(22.0, 30.0, near);
  gl_PointSize = clamp(px, 1.5, cap);
  // a moth right at the basket does not blind us; the ribbon's own moths come close and large, as wings, and thin as they grow
  float fadeN = mix(0.25 + 0.75 * smoothstep(5.0, 22.0, vDist), smoothstep(4.0, 12.0, vDist) * mix(1.0, 0.6, smoothstep(12.0, 30.0, px)), near);
  vA = a * tw * clamp(px / 1.5, 0.25, 1.0) * fadeN; vGold = gold;
  vWing = vec2(smoothstep(7.0, 16.0, min(px, cap)), 0.35 + 0.65 * abs(sin(uTime * (9.0 + sd * 7.0) + sd * 50.0)));
}`,la=`
uniform vec3 uGold, uSky;
varying float vA, vGold, vDist; varying vec2 vWing;
${re}
void main() {
  vec2 q = clamp(gl_PointCoord, 0.0, 1.0) - 0.5; float d = length(q * vec2(1.0, 1.7));
  float m = (1.0 - smoothstep(0.08, 0.5, d));
  if (vWing.x > 0.0) {                                 // close to, a glass-moth is two beating wings and a bright body
    vec2 w = vec2(abs(q.x) / max(vWing.y, 0.25), q.y - 0.22 * abs(q.x));               // wings swept back from a narrow waist
    float wing = (1.0 - smoothstep(0.14, 0.3, length((w - vec2(0.24, -0.02)) * vec2(1.0, 0.82)))) * smoothstep(0.0, 0.07, abs(q.x));
    float body = (1.0 - smoothstep(0.02, 0.07, length(q * vec2(2.6, 0.75))));
    m = mix(m, max(wing * 0.85, body), vWing.x);
  }
  vec3 c = mix(uSky * 0.7, uGold * vec3(1.0, 0.8, 0.5) * 2.4, vGold);
  gl_FragColor = vec4(c * m * vA * addFog(vDist, 0.6), 1.0);
}`,ha=`
attribute vec4 aPivot; attribute vec4 aData; attribute float aPre;
varying vec2 vQ; varying float vG, vDist, vPil;
${wt}
void main() {
  vQ = uv * 2.0 - 1.0; vPil = aPivot.z;
  float g = max(tollEnv(uS - aData.x, aData.z, 4.0 + aData.z * 5.0), tollPre(aPre, aData.z, 4.0 + aData.z * 5.0));
  vG = g * aData.w;
  vec4 mv = modelViewMatrix * vec4(position + vec3(0.0, aPivot.y, 0.0), 1.0);   // aPivot = (how much taller than wide, how far above its bell): a far toll blooms up into the mist
  vDist = max(-mv.z, 1.0);
  float push = (vDist + aData.y * 0.7) / vDist;        // the glow hangs in the mist BEHIND its bell, so stalks cut out black against it
  mv.xyz *= push;
  mv.xy += vQ * vec2(1.0, 1.0 + aPivot.x) * aData.y * 1.3 * (0.8 + 0.2 * min(g, 1.0)) * push;
  gl_Position = projectionMatrix * mv;
}`,ca=`
uniform vec3 uGold; uniform float uHaloK;
varying vec2 vQ; varying float vG, vDist, vPil;
${re}
void main() {
  float r = min(length(vQ), 1.5); if ((r > 1.0 && vPil < 0.5) || vG < 0.002) discard;
  float h = max(exp(-r * r * 4.6) - 0.01, 0.0);            // a bloom with no edge
  if (vPil > 0.5) {                                        // a far toll's light thrown up into the mist: a pale column over a bloom at its foot
    float qx = clamp(vQ.x, -1.0, 1.0), qy = clamp(vQ.y, -1.0, 1.0);          // the quad's own range, before anything is squared
    float up = 0.5 - 0.5 * qy, foot = (qy + 0.8) * 5.0;
    h = max(exp(-qx * qx * 5.0) - 0.007, 0.0) * (0.4 * up * up * smoothstep(-1.0, -0.84, qy) + 1.0 * exp(-foot * foot)) * (1.0 - smoothstep(0.7, 1.0, abs(qx)));
  }
  float pale = mix(1.0, 0.42, smoothstep(320.0, 1250.0, vDist));          // the blooms pale step by step toward the limit of sight
  gl_FragColor = vec4(mix(uGold, vec3(dot(uGold, vec3(0.3, 0.5, 0.2))), 0.25 * (1.0 - h)) * h * vG * uHaloK * pale * addFog(vDist, 0.33), 1.0);
}`,da=`
varying vec3 vL; varying float vDist;
void main() { vL = position; vec4 mv = modelViewMatrix * vec4(position, 1.0); vDist = -mv.z; gl_Position = projectionMatrix * mv; }`,fa=`
uniform vec3 uGold, uSky; uniform float uSeed;
varying vec3 vL; varying float vDist;
${wt}
${re}
void main() {
  vec2 p = vL.xy; float r = length(p);
  float edge = 1.0 - smoothstep(170.0, 215.0, r);
  float dark = 0.34 * (1.0 - smoothstep(30.0, 95.0, r));
  float g = tollEnv(uS - 0.35, 0.2, 6.0);
  float rip = 0.0;                                       // chime-fish: a ring of small expanding circles under the lip
  for (int i = 0; i < 14; i++) {
    float fi = float(i), a = fi * 0.4488 + uSeed, rr = 52.0 + 9.0 * fract(sin(fi * 12.9 + uSeed) * 43758.5);
    float t0 = 1.1 + fract(sin(fi * 78.2 + uSeed) * 9631.3) * 1.4, t = mod(max(uS - t0, 0.0), 6.5);
    float d = distance(p, rr * vec2(sin(a), cos(a))), R = t * 5.5;
    float wq = (d - R + 3.0) / 4.5;
    float w = sin((d - R) * 1.6) * exp(-wq * wq) * exp(-t * 0.45) * step(t0, uS);
    rip += w;
  }
  float bq = (r - (uS - 0.3) * 24.0) / 9.0;
  float big = sin((r - (uS - 0.3) * 24.0) * 0.5) * exp(-bq * bq) * step(0.3, uS) * exp(-max(uS, 0.0) * 0.25);
  rip += big * 1.5;
  float sh = 0.75 + 0.25 * sin(r * 0.9 - uTime * 1.4 + sin(p.x * 0.21) * 2.0);
  vec3 add = uGold * g * (1.6 * exp(-r * r / 2600.0) + 0.5 * exp(-(r - 58.0) * (r - 58.0) / 49.0)) * sh;
  add += (uSky * 0.35 + uGold * g * 1.2) * max(rip, 0.0);
  float a = clamp(dark + max(-rip, 0.0) * 0.35, 0.0, 0.8) * edge;
  float f = addFog(vDist, 1.0);
  gl_FragColor = vec4(add * edge * f, a * f);
}`;async function va(r,n={}){const e=r.rng.fork?r.rng.fork("bourdon"):r.rng,A=(n.palette&&n.palette.length>=7?n.palette:aa).map(sa),v=A[0],F=A[2],G=A[3],D=A[4],L=A[5],q=Z(F,v,.6),y=Z(D,A[1],.25),k=Z(L,D,.6),w=e.range(.2,.28),O=e.range(16,21),W=e.range(14,19),Y=ve-qt-W-O,ot=e.pick([0,5,6,6,7,8]),ut=ot?e.range(.9,2.4):0,vt=e.range(0,_),Mt=e.range(0,2),rt=e(),ht=e.range(-.2,.2),ct=e.range(3,8),X=(t,a)=>{const p=Math.pow(Math.sin(Math.min(t/w,1)*Math.PI/2),.8),h=t**6,M=ut*Math.cos(ot*a+vt);return[qt+W*p+Y*t+O*t*t*t*t-Mt*Math.sin(Math.PI*Pt((t-.3)/.6,0,1))+M*h*t*t+.5*Math.sin(a*3+rt*9)*t,zt-(zt-Fe)*Math.pow(t,1.2)-M*1.1*h*h]},Kt=t=>Math.pow(Pt((zt-t)/(zt-Fe),0,1),1/1.2),St=(t,a=0)=>X(Kt(t),a)[0];await r.yield?.();const R=new Nt;R.mdec=2;const At=r.yield?()=>r.yield():null,Ot=t=>Z(F,G,t**3);R.set([0,0,0,0],[0,24,rt,0]),await oa(R,96,60,X,Ot,At),await r.yield?.(),R.set([0,0,0,0],[0,24,rt,2]);for(let t=0;t<24;t++){const a=(t+.5)/24*_,p=[];for(let h=0;h<=36;h++){const M=Q(.012,.992,h/36),[x,g]=X(M,a);p.push(s(Math.sin(a)*(x+.3),g+.15,Math.cos(a)*(x+.3)))}K(R,p,4,h=>Q(.75,.5,h)+.35*h**8,()=>q,{ref:s(Math.sin(a),0,Math.cos(a)),phase:Math.PI/4}),t%6===5&&await r.yield?.()}R.set([0,0,0,0],[0,24,rt,3]),pt(R,96,12,(t,a)=>{const[p,h]=X(1,a),M=-t*_;return[p+.3+2*Math.cos(M),h-1.6+2.3*Math.sin(M)]},()=>G),await r.yield?.();const at=s(0,228.4,9.6),dt=158,yt=6;let Gt=.2;for(let t=.05;t<.6;t+=.002){const a=at.y-dt*Math.cos(t);if(at.z+dt*Math.sin(t)+yt*.92>=St(a)-.6){Gt=t;break}}const Wt=s(0,at.y-dt*Math.cos(Gt),at.z+dt*Math.sin(Gt)),mt=s(0,Wt.y,St(Wt.y)),l=new Nt;l.mdec=2;const Ht=r.noise,j=t=>Z(L,D,Pt(t,0,1)),me=[],le=[];for(let t=0;t<3;t++){const a=ht+Math.PI/3+t*_/3,p=Math.sin(a),h=Math.cos(a),M=Math.cos(a),x=-Math.sin(a),g=e.range(-4,4),V=e.range(0,7),I=[[Vt,-3],[Vt-1,18],[Vt-3+V*.4,62],[82+V,128],[70+V*.6,192],[47,238],[20,257],[0,ie]],i=I.map(([u,f],c)=>{const P=Math.sin(Math.PI*Pt(c/(I.length-1),0,1))*(c>0?1:0),T=(g+ct*Ht.n2(t*7.3+1.1,c*.9))*P;return s(p*u+M*T,f,h*u+x*T)}),d=gt(i,76);me.push({pts:d,sx:p,sz:h,tx:M,tz:x}),le.push(s(p*Vt,0,h*Vt)),await r.yield?.();const b=[];for(let u=.05+e()*.03;u<.97;u+=e.range(.05,.09))b.push(u);const o=u=>{let f=0;for(const c of b){const P=(u-c)/.007;f+=Math.exp(-P*P)}return f};l.set([0,0,0,0],[0,0,e(),0]),K(l,d,14,(u,f)=>Q(4.8,1.9,Math.pow(u,.75))*(1+.8*Math.exp(-u*34))*(1+.075*Math.cos(7*f))*(1+.24*o(u))*(1+.06*Ht.n2(u*30+t*11,f*.7)),(u,f)=>j(.1+.22*(.5+.5*Math.cos(7*f))+.35*o(u)+.15*Ht.n2(u*50+t*5,f)),{ref:s(M,0,x),twist:e.range(-2.5,2.5)}),await r.yield?.();const N=e.int(4,6),z=e()*_;for(let u=0;u<N;u++){const f=z+u/N*_+e.range(-.3,.3),c=e.range(11,21),P=e.range(9,19),T=Math.sin(f),C=Math.cos(f),U=le[t],$=gt([s(U.x+T*2.5,P,U.z+C*2.5),s(U.x+T*c*.4,P*.55,U.z+C*c*.4),s(U.x+T*c*.8,1.2,U.z+C*c*.8),s(U.x+T*c,-2.5,U.z+C*c)],9);K(l,$,6,st=>Q(1.7,.55,st)*(1+.5*Math.exp(-st*9)),(st,H)=>j(.12+.2*Math.cos(3*H)**2),{})}for(const u of b){if(u<.1||!e.chance(.55))continue;const f=d[Math.round(u*76)],c=e()*_,P=e.range(3.5,8)*(1.2-u*.6),T=s(p*Math.cos(c)*.6+M*Math.sin(c),.5,h*Math.cos(c)*.6+x*Math.sin(c)).normalize(),C=gt([f.clone(),f.clone().addScaledVector(T,P*.6).add(s(0,P*.25,0)),f.clone().addScaledVector(T,P).add(s(0,P*.9,0))],5);l.mdec=0,K(l,C,5,U=>Q(.9,.08,U),()=>j(.2),{}),l.mdec=2}}await r.yield?.(),l.set([0,0,0,0],[0,0,e(),0]),nt(l,s(0,ie-.5,0),6.2,4.6,6.2,18,10,(t,a)=>j(.15+.25*Math.cos(3*a+1)**2*t),(t,a)=>1+.16*Math.cos(3*(t-ht)+Math.PI)*Math.sin(a*Math.PI)+.07*Ht.n2(t*2,a*5));for(let t=0;t<3;t++){const a=ht+t*_/3,p=gt([s(Math.sin(a)*2.5,ie-3.5,Math.cos(a)*2.5),s(Math.sin(a)*6.5,246,Math.cos(a)*6.5),s(Math.sin(a)*10.4,237,Math.cos(a)*10.4),s(Math.sin(a)*11.4,231.2,Math.cos(a)*11.4)],8);K(l,p,6,h=>.75+.5*Math.exp(-h*8)+.45*Math.exp(-(1-h)*8),(h,M)=>j(.2+.2*Math.sin(h*40)**2),{twist:5})}l.mdec=0,pt(l,48,8,t=>{const a=-t*_;return[qt+.5+1.25*Math.cos(a),zt+.4+1.7*Math.sin(a)]},(t,a)=>j(.02+.08*(.5+.5*Math.cos(24*a))*(t>.5?1:.4)));for(let t=0;t<24;t++){const a=(t+.5)/24*_;nt(l,s(Math.sin(a)*(qt+1.6),zt-.5,Math.cos(a)*(qt+1.6)),.75,1,.75,6,4,()=>j(.1))}const xt=m.MathUtils.degToRad(n.seatTilt??20),jt=s(0,226,0),pe=7.7,qe=s(0,-Math.cos(xt),-Math.sin(xt)),ge=(t,a)=>s(Math.sin(t)*a,jt.y-Math.cos(t)*a*Math.tan(xt),Math.cos(t)*a),we=[];for(let t=0;t<=48;t++)we.push(ge(t/48*_,pe));K(l,we,6,()=>.5,(t,a)=>j(.03+.07*Math.cos(a)**2),{});for(let t=0;t<3;t++){const a=ht+Math.PI/3+t*_/3,p=ge(a,pe+.2);K(l,[p,s(Math.sin(a)*9.4,Q(p.y,229.2,.6),Math.cos(a)*9.4),s(Math.sin(a)*10.9,229.6,Math.cos(a)*10.9)],5,h=>.36+.25*h,()=>j(.04),{}),l.set([0,0,0,0],[0,0,e(),2]),nt(l,s(Math.sin(a)*9.2,227.4,Math.cos(a)*9.2),.42,.55,.42,6,4,()=>v),l.set([0,0,0,0],[0,0,e(),0])}await r.yield?.(),l.set([0,0,0,0],[0,0,.21,0]);for(let t=0;t<12;t++){const a=t/12*_,p=t%2?.078:.115,h=[];for(let M=0;M<=9;M++){const[x,g]=X(Q(.004,p,M/9),a);h.push(s(Math.sin(a)*(x-.55),g-.45,Math.cos(a)*(x-.55)))}K(l,h,6,M=>(.22+1.9*Math.pow(Math.sin(Math.PI*Math.pow(M,.55)),1.2))*(1-.92*M**5),(M,x)=>j(.03+.16*Math.cos(x)**2*(1-M)),{ref:s(Math.cos(a),0,-Math.sin(a)),flat:.2})}l.mdec=2;const xe=[],Tt=new Nt,be=n.sideBells??e.int(10,14),$t=(t,a,p,h,M)=>{Tt.set([0,0,0,0],[p,a,M,h]);const x=Tt.count;for(let g=0;g<4;g++)Tt.v(t.x,t.y,t.z,0,1,0,g&1,g>>1,v);Tt.quad(x,x+1,x+2,x+3)};$t(s(0,138,0),150,.35,.085,.37);for(let t=0;t<be;t++){const a=me[t%3],p=Q(.2,.8,(Math.floor(t/3)+e())/Math.ceil(be/3)),h=a.pts[Math.round(p*76)],M=(t%2?1:-1)*e.range(.25,1.15),x=Math.cos(M),g=Math.sin(M),V=s(a.sx*x+a.tx*g,0,a.sz*x+a.tz*g),I=e.range(15,28),i=e.range(3.4,6.6),d=e.range(5,9),b=i*e.range(2.1,2.5),o=h.clone().addScaledVector(V,I).add(s(0,I*.42,0)),N=o.y-d-b;if(N<7||Math.abs(o.x)<i+18&&o.z>30&&N<62)continue;const z=gt([h.clone(),h.clone().addScaledVector(V,I*.35).add(s(0,I*.5,0)),h.clone().addScaledVector(V,I*.78).add(s(0,I*.72,0)),o.clone().add(s(0,1.2,0)),o.clone().addScaledVector(V,I*.06).add(s(0,-2.2,0))],14);l.set([0,0,0,0],[0,0,e(),0]),K(l,z,6,S=>Q(1.25,.32,Math.pow(S,.7))*(1+.3*Math.exp(-S*12)),(S,B)=>j(.15+.25*Math.cos(2*B)**2),{});const u=e(),f=4+(i-3.4)/3.2*2.6,c=o.y-d,P=s(o.x,c-b*.5,o.z),T=.35+P.distanceTo(mt)/90*e.range(.7,1.3),C=[o.x,o.y-1.5,o.z,f],U=e.int(12,16),$=e.range(.14,.24),st=e.range(.26,.36),H=S=>[i*(.07+(.75-$)*Math.pow(Math.sin(Math.min(S/st,1)*Math.PI/2),.8)+.18*S+$*S**6),c-b*Math.pow(S,1.15)];R.set(C,[T,U,u,1]),pt(R,28,13,H,Ot,o.x,o.z),R.set(C,[T,U,u,3]),R.mdec=0,pt(R,28,5,S=>{const B=-S*_;return[i+.05+.2*Math.cos(B),c-b-.1+.26*Math.sin(B)]},()=>G,o.x,o.z),R.mdec=2,l.set(C,[T,0,u,0]),K(l,[s(o.x,o.y-1.5,o.z),s(o.x,c+.2,o.z)],4,()=>.2,()=>j(.3),{}),nt(l,s(o.x,c+.1,o.z),i*.12,i*.1,i*.12,6,4,()=>j(.35)),K(l,[s(o.x,c,o.z),s(o.x,c-b*.78,o.z)],3,()=>.11,()=>j(.2),{}),l.set(C,[T,0,u,1]),nt(l,s(o.x,c-b*.8,o.z),i*.17,i*.22,i*.17,8,6,()=>A[6]),$t(P,i*5,T,.16,u),xe.push({position:P,radius:i,delay:T}),t%3===2&&await r.yield?.()}if(await r.yield?.(),n.gallery!==!1){const t=ve+5.5,a=42.5,p=132,h=.5,M=g=>Math.abs((g+Math.PI)%_-Math.PI)<h,x=(g,V,I)=>s(Math.sin(g)*V,I,Math.cos(g)*V);l.mdec=1;for(let g=0;g<p;g++){const V=g/p*_,I=(g+.74)/p*_,i=(V+I)/2;if(M(i))continue;const d=.35*Math.sin(g*1.9)+.5*Math.cos(i*6),b=(g%2?.1:.55)+e()*.3,o=.25*Math.sin(g*2.7);if(l.set([0,0,0,0],[0,.16,e(),3]),K(l,[x(V,t+o,a+d),x(I,t-o,a+d)],4,()=>1.5+.2*Math.sin(g*4.1),()=>Z(Z(y,v,.12),D,b),{ref:s(Math.sin(i),0,Math.cos(i)),phase:Math.PI/4,flat:.1}),g%4===0){const[N,z]=X(1,i);l.data=[0,.2,l.data[2],3],K(l,[x(i,t+1.2,a+d),x(i,N+1.6,z-1.2)],4,()=>.2,()=>k,{}),K(l,[x(i,t-1.2,a+d),x(i,N-1.2,z-3.2)],4,()=>.2,()=>k,{})}g%9===3&&(l.set([0,0,0,0],[0,0,e(),2]),nt(l,x(i,t+1.3,a+d+1.7),.45,.6,.45,6,4,()=>v)),g%44===43&&await r.yield?.()}l.set([0,0,0,0],[0,.2,e(),3]);for(const[g,V]of[[h,Math.PI],[Math.PI,_-h]]){const I=[],i=[],d=[];for(let b=0;b<=40;b++){const o=Q(g,V,b/40);I.push(x(o,t+1.05,a+1.25+.12*Math.sin(b*Math.PI*.5))),i.push(x(o,t+1.1,a-.2+.5*Math.cos(o*6))),d.push(x(o,t-1.1,a-.2+.5*Math.cos(o*6)))}K(l,I,4,()=>.2,()=>k,{}),K(l,i,4,()=>.2,()=>k,{}),K(l,d,4,()=>.2,()=>k,{})}for(const g of[e.range(1.4,2.2),e.range(3.9,4.9),.5+.2,_-.72]){const V=Math.cos(g),I=-Math.sin(g);for(const i of[-.45,.45]){const d=x(g,t+1.2,a);d.x+=V*i,d.z+=I*i,K(l,[d,s(d.x,-.5,d.z)],4,()=>.16,()=>k,{})}for(let i=1;i<a;i+=2.2){const d=x(g,t+1.2,i);l.data=[0,.13,.5,3],K(l,[s(d.x-V*.5,i,d.z-I*.5),s(d.x+V*.5,i,d.z+I*.5)],3,()=>.13,()=>y,{})}}l.mdec=2}await r.yield?.();const lt=new Nt;lt.mdec=2,lt.set([0,0,0,0],[0,0,.5,0]),nt(lt,s(0,0,0),1.3,1.1,1.3,8,6,()=>j(.4)),lt.set([0,0,0,0],[0,.5,.5,0]);const he=18,Me=t=>Math.exp(-(((t*he%1-.5)/.12)**2)),ye=[];for(let t=0;t<=he*6;t++)ye.push(s(0,-(t/(he*6))*(dt-yt*1.1),0));K(lt,ye,6,t=>Q(.5,.85,t)*(1+.8*Me(t))+1.2*Math.exp(-(1-t)*40),(t,a)=>Z(j(.15+.3*Math.cos(a)**2),Z(G,v,.5),.8*Me(t)),{twist:6}),lt.set([0,0,0,0],[0,0,.5,0]),nt(lt,s(0,-dt+yt*1.05,0),2.6,1.8,2.6,10,5,t=>j(.2+.3*t),t=>1+.15*Math.cos(5*t)),lt.set([0,0,0,0],[0,1,.5,1]),nt(lt,s(0,-dt,0),yt,yt*1.22,yt,20,14,()=>A[6],(t,a)=>(1+.05*Math.cos(8*t)*Math.sin(a*Math.PI))*(.82+.18*Math.sin(Math.min(1,a*1.6)*Math.PI/2))),await r.yield?.();const Yt=Math.round(1500*(r.quality?.detail??1))+2600,ce=2600,Qt=new Float32Array(Yt*3),kt=new Float32Array(Yt*4),Lt=new Float32Array(Yt*4),ke=[];for(let t=0;t<7;t++)ke.push(t/7*_+e.range(-.3,.3));for(let t=0;t<Yt;t++){const a=Q(.08,1,Math.pow(e(),.7)),p=e()*_,[h,M]=X(a,p),x=Math.sin(p)*(h+.7),g=Math.cos(p)*(h+.7);Qt[t*3]=x,Qt[t*3+1]=M,Qt[t*3+2]=g;let V=0,I=9;for(const b of ke){const o=Math.abs((b-p+Math.PI*3)%_-Math.PI);o<I&&(I=o,V=b)}const i=V+e.gauss()*.1,d=.06+e.gauss()*.09;kt[t*4]=Math.sin(i),kt[t*4+1]=d,kt[t*4+2]=Math.cos(i),kt[t*4+3]=e.range(45,175),Lt[t*4]=e(),Lt[t*4+1]=t<ce?1:0,Lt[t*4+2]=e.range(.45,1),t<ce&&(kt[t*4+3]=(t+.5)/ce*176),Lt[t*4+3]=Math.hypot(x-mt.x,M-mt.y,g-mt.z)/125,t%1400===1399&&await r.yield?.()}const De=[s(0,35,260),s(0,35,150),s(0,36,75),s(0,40,40),s(-14,58,12),s(-22,84,-10),s(-19,112,-24),s(-7,141,-25),s(0,226-60*Math.cos(xt),-60*Math.sin(xt)),jt.clone()],Ve=new m.CatmullRomCurve3([...De.slice(1,9),s(0,226-30*Math.cos(xt),-30*Math.sin(xt)),jt.clone()],!1,"centripetal").getPoints(280),Ne=t=>{let a=1e9;for(const p of Ve){const h=p.distanceToSquared(t);h<a&&(a=h)}return Math.sqrt(a)};await r.yield?.();const et=ta(ea("bourdon-chimes:"+(r.seed??1))),de=[];{const t=Wt.clone().sub(at),a=t.lengthSq(),p=s(0,0,0),h=i=>{const d=Pt(p.copy(i).sub(at).dot(t)/a,0,1);return p.copy(at).addScaledVector(t,d).distanceTo(i)},M=(i,d,b,o,N,z,u,f)=>{const c=z-u,P=Math.max(1,Math.round(c/8)),T=f/22,C=f/44,U=f*.12,$=[[z,0]];for(let S=0;S<P;S++){const B=z-c*(S+.5+.3*((b*17+S*.37)%1-.5))/P;$.push([B+U,0],[B,1],[B-U,0])}$.push([u,0]);const st=$.length,H=S=>$[Math.round(S*(st-1))];l.set(i,[d,C,b,0]),K(l,$.map(([S])=>s(o,S,N)),5,S=>Q(T,C,(z-H(S)[0])/c)*(1+2.2*H(S)[1]),S=>Z(Z(G,L,.3),v,.55*H(S)[1]),{})},x=(i,d,b,o,N)=>{const z=Math.sin(i),u=Math.cos(i),f=(c,P)=>s(z*c,P,u*c);l.set([0,0,0,0],[0,o/30,N,0]),K(l,gt([f(St(b-o,i)+.1,b-o),f(d+.5,b-o*.35),f(d+.12,b+o*.1),f(d-.04,b+o*.03),f(d,b-o*.12)],7),5,c=>o*Q(.11,.035,Math.pow(c,.7)),c=>Z(Z(F,v,.4),Z(G,L,.3),c),{})},g=(i,d,b,o,N,z,u,f,c,P,T)=>{const C=10+Math.floor(f*5),U=.14+.1*(f*7%1),$=.26+.1*(f*13%1),st=H=>[N*(.07+(.75-U)*Math.pow(Math.sin(Math.min(H/$,1)*Math.PI/2),.8)+.18*H+U*H**6),b-z*Math.pow(H,1.15)];R.set(i,[u,C,f,1]),pt(R,c,P,st,Ot,d,o),T&&(R.set(i,[u,C,f,3]),pt(R,c,2,H=>{const S=-H*_;return[N+.04+.13*Math.cos(S),b-z-.08+.2*Math.sin(S)]},()=>G,d,o)),l.set(i,[u,0,f,1]),nt(l,s(d,b-z*.8,o),N*.2,N*.26,N*.2,6,3,()=>A[6])},V=(i,d,b,o,N)=>{const z=o*et.range(2.1,2.5),u=St(d,i)-.9,f=Math.sin(i)*u,c=Math.cos(i)*u,P=d-b,T=s(f,P-z*.5,c),C=et(),U=et.chance(N),$=o+(U?o*.9:0);if(P-z<58||St(P-z,i)-u<$+1.2||Ne(T)<9.5+z*.5+.14*(b+z*.5)||h(T)<5+$+.14*b)return!1;for(const B of de)if(Math.hypot(B.c.x-f,B.c.z-c)<B.reach+$+2.5&&T.y-z*.5-2<B.c.y+B.H*.5+B.up&&B.c.y-B.H*.5-2<T.y+z*.5+(U?o*7:0))return!1;const st=3+o*.9,H=[f,d,c,st],S=.4+T.distanceTo(mt)/90*et.range(.7,1.3);if(R.mdec=0,l.mdec=0,g(H,f,P,c,o,z,S,C,16,7,!0),M(H,S,C,f,c,d,P+o*.2,o),R.set(H,[S,6,C,1]),pt(R,8,4,B=>[o*(.02+.15*Math.sin(Math.PI*B)),P+o*.34-B*o*.4],Ot,f,c),x(i,u,d,o,C),U)for(let B=0;B<3;B++){const bt=o*(.55-.07*B),Xe=bt*2.2,Be=B%2?-1:1,_e=i+1.3+B*2.1,oe=Math.sin(_e)*o*.9*Be,se=Math.cos(_e)*o*.9*Be,It=P+o*1.1+B*o*1.9;l.set(H,[S,bt/22,C,0]),K(l,gt([s(f,It+bt*1.6,c),s(f+oe*.55,It+bt*1.75,c+se*.55),s(f+oe,It+bt*1.1,c+se),s(f+oe,It,c+se)],6),4,Je=>bt*Q(.1,.045,Je),()=>Z(G,L,.3),{}),g(H,f+oe,It,c+se,bt,Xe,S+.15*(B+1),(C+.37*(B+1))%1,10,5,!1)}return R.mdec=2,l.mdec=2,$t(T,o*5,S,.14,C),de.push({c:T,R:o,H:z,reach:$,up:U?o*7:0}),!0},I=Math.round(14+8*(r.quality?.detail??1));for(let i=0;i<700&&de.length<I;i++){const d=et.int(0,23),b=et()**3;V((d+.5)/24*_,et.range(112,212),et.range(9,24)+et()**2*52,1.5+et()*1.1+b*2.4,.45),i%60===59&&await r.yield?.()}for(let i=0;i<12;i++){const d=i/12*_,b=i%2?.078:.115,[o,N]=X(b,d),z=i%2?1.05:1.45,u=i%2?3.5:6.5+2*et(),f=Math.sin(d)*(o-.9),c=Math.cos(d)*(o-.9),P=et(),T=[f,N-.6,c,2.6+z],C=1.6+.9*et();R.mdec=0,l.mdec=0,g(T,f,N-.6-u,c,z,z*2.3,C,P,12,5,!1),M(T,C,P,f,c,N-.6,N-.5-u,z),R.mdec=2,l.mdec=2,$t(s(f,N-.6-u-z,c),z*5,C,.12,P)}}await r.yield?.();const Zt=new m.BufferGeometry;Zt.setAttribute("position",new m.BufferAttribute(Qt,3)),Zt.setAttribute("aDir",new m.BufferAttribute(kt,4)),Zt.setAttribute("aSeed",new m.BufferAttribute(Lt,4));const Dt=t=>new m.Color(t[0],t[1],t[2]),tt={uS:{value:-20},uTime:{value:0},uAfter:{value:.24},uAmb:{value:n.ambient??1},uGold:{value:Dt(A[6])},uSky:{value:Dt(v)},uBody:{value:Dt(F)},uLip:{value:Dt(G)},uPale:{value:Dt(q)},uCold:{value:Dt(Z(F,[1,1,1],.65))},uStrike:{value:mt.clone()},uCharge:{value:0},uPilot:{value:1.2},uRime:{value:n.rime??0},uBackA:{value:.72},uHaloK:{value:1},uPx:{value:600},uSeed:{value:rt*6},uIn:{value:0},uClear:{value:.38},uDense:{value:.7},uDawnK:{value:0},uLightAz:{value:new m.Vector2(-.6,-.8)},uShaft:{value:0},uEmber:{value:new m.Vector3(0,70,0)},uAmberK:{value:1},uVeinK:{value:1},uGlassAmb:{value:0},uRim:{value:n.ambient??1}},Ct=(t,a,p,h)=>{const M=m.UniformsUtils.clone(m.UniformsLib.fog);for(const x of p)M[x]=tt[x];return new m.ShaderMaterial({uniforms:M,vertexShader:t,fragmentShader:a,fog:!0,...h})},Bt=["uS","uTime","uAfter","uGold","uSky","uAmb"],fe=Ct(Ee,ia,[...Bt,"uBody","uLip","uPale","uStrike","uBackA","uIn","uClear","uDense","uDawnK","uLightAz","uEmber","uAmberK","uGlassAmb","uVeinK"],{vertexColors:!0,transparent:!0,side:m.DoubleSide,depthWrite:!1}),_t=Ct(Ee,na,[...Bt,"uCold","uCharge","uPilot","uRime","uPx","uRim"],{vertexColors:!0,defines:{THIN:1}}),Pe={transparent:!0,depthWrite:!1,blending:m.AdditiveBlending},Re=Ct(ra,la,[...Bt,"uPx"],Pe),ze=Ct(ha,ca,[...Bt,"uHaloK"],{...Pe,depthTest:!0}),Ue=Ct(da,fa,[...Bt,"uSeed"],{transparent:!0,depthWrite:!1,blending:m.CustomBlending,blendSrc:m.OneFactor,blendDst:m.OneMinusSrcAlphaFactor,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),Ke=`
varying vec3 vN, vW; varying vec2 vUv;
void main() { vUv = uv; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }`,Oe=`
uniform vec3 uGold; uniform float uShaft;
varying vec3 vN, vW; varying vec2 vUv;
${wt}
void main() {
  vec3 V = cameraPosition - vW; float dC = length(V); V /= max(dC, 1e-3);
  float nv = min(abs(dot(vN / max(length(vN), 1e-4), V)), 1.0), core = nv * nv * (0.4 + 0.6 * nv);            // thickest through the middle, nothing at its edges
  float an = vUv.x * 6.2832, h = clamp(vUv.y, 0.0, 1.0);
  float ray = 0.55 + 0.45 * sin(an * 5.0 + uTime * 0.11 + 2.0 * sin(an * 3.0 - uTime * 0.07)) * sin(an * 9.0 - uTime * 0.05 + 1.3);
  float fall = mix(0.1, 1.0, h * h) * smoothstep(0.0, 0.08, h) * (1.0 - smoothstep(0.93, 1.0, h));
  float drift = 0.8 + 0.2 * sin(h * 40.0 - uTime * 0.9 + an * 2.0);
  float toll = min(tollEnv(uS, 0.2, 6.0), 1.0);        // the Bourdon's own toll and its after-shimmer: this light is nothing without them
  float k = core * ray * fall * drift * uShaft * toll * smoothstep(5.0, 34.0, dC);
  gl_FragColor = vec4(uGold * vec3(1.0, 0.84, 0.6) * k, 1.0);
}`,We=new m.ShaderMaterial({uniforms:{uGold:tt.uGold,uS:tt.uS,uTime:tt.uTime,uAfter:tt.uAfter,uShaft:tt.uShaft},vertexShader:Ke,fragmentShader:Oe,transparent:!0,depthWrite:!1,blending:m.AdditiveBlending,side:m.DoubleSide,fog:!1}),Ft=new m.Mesh(new m.CylinderGeometry(6.2,21,166,40,1,!0),We);Ft.position.set(0,143,0),Ft.renderOrder=4.6,Ft.visible=!1;const Xt=new m.Group;Xt.name="bourdon";const Se=await R.geometry(At),Ae=await l.geometry(At),Ge=await lt.geometry(At),He=await Tt.geometry(At),Jt=new m.Mesh(Se,fe);Jt.renderOrder=3;const Te=new m.Mesh(Ae,_t),ft=new m.Mesh(Ge,_t);ft.position.copy(at);const te=new m.Mesh(He,ze);te.renderOrder=4,te.frustumCulled=!1;const ue=new m.Points(Zt,Re);if(ue.renderOrder=5,ue.frustumCulled=!1,Xt.add(Te,ft,Jt,te,ue,Ft),n.waterFx!==!1){const t=new m.Mesh(new m.PlaneGeometry(440,440),Ue);t.rotation.x=-Math.PI/2,t.position.y=.08,t.renderOrder=1,Xt.add(t)}for(const t of[Jt,Te,ft])t.geometry.computeBoundingSphere(),t.geometry.boundingSphere.radius+=12,t.geometry.userData.mirror.boundingSphere=t.geometry.boundingSphere;let ee=null,ae=null;const je=t=>t<0?0:Et(0,.3,t)*Math.min(1.3,Math.exp(-t/3.2)+tt.uAfter.value*Et(.5,3,t)),$e=t=>{if(t<Ut[0])return .03*Math.sin(t*.9);if(t<-.5){const a=Et(Ut[0],Ut[1],t);return-.25*a+.004*Math.sin(t*9)*a+.03*Math.sin(t*.9)*(1-a)}if(t<0){const a=(t+.5)/.5;return Q(-.25,Gt,a*a)}return Gt-.045*Math.abs(Math.sin(t*4.2))*Math.exp(-t*1.2)-.0025*Math.sin(t*37)*Math.exp(-t*.35)},Le=new m.Vector2;function Ce(t,a,p){const h=ee!==null?ee:(a+2)%30-8;tt.uS.value=h,tt.uTime.value=a,tt.uCharge.value=h<0?1.1*Et(-9,-.3,h):0;const M=h<0?1-Et(-1.5,-.4,h):0;ft.rotation.x=-($e(h)+.012*Math.sin(a*.83)*M),ft.rotation.z=.034*Math.sin(a*.71+.6)*M,ae&&(ae.rotation.x=ft.rotation.x,ae.rotation.z=ft.rotation.z),tt.uEmber.value.set(0,at.y-dt*Math.cos(ft.rotation.x),at.z-dt*Math.sin(ft.rotation.x)),Ft.visible=tt.uShaft.value>.004,p&&r.renderer&&(r.renderer.getDrawingBufferSize(Le),tt.uPx.value=p.projectionMatrix.elements[5]*Le.y*.5)}Ce(0,0,null);function Ye(){const t=new m.Group;t.name="bourdon-mirror",t.scale.y=-1;const a=new m.Mesh(Ae.userData.mirror,_t),p=new m.Mesh(Se.userData.mirror,fe),h=new m.Mesh(Ge.userData.mirror,_t);return p.renderOrder=2,h.position.copy(at),ae=h,t.add(a,h,p),t}const Qe=X(1,0)[1]-3.9,Ze={portalSeat:{position:jt.clone(),normal:qe.clone(),radius:7,tiltDeg:n.seatTilt??20},flyThrough:De.map(t=>t.clone()),axisBottom:s(0,55,0),axisTop:s(0,222,0),strikePoint:mt.clone(),clapperRest:Wt.clone(),clapperHinge:at.clone(),lipFront:s(0,Qe,X(1,0)[0]),revealView:{position:s(0,35,230),target:s(0,140,0)},underView:{position:s(0,36,72),target:s(0,150,0)},feet:le,apex:s(0,ie,0),sideBells:xe};return{object:Xt,radius:95,height:262,center:s(0,132,0),anchors:Ze,update:Ce,dispose(){},setToll(t){ee=t},setProgress(t){ee=t},goldLevel:t=>Pt(je(t),0,1),tollArrival:t=>t.distanceTo(mt)/90,makeMirror:Ye,uniforms:tt,strikeSpeed:90,materials:{glass:fe,solid:_t,halo:ze},glassMesh:Jt,haloMesh:te,ground:!0,groundY:0}}export{Nt as Buf,re as GLSL_ADDFOG,wt as GLSL_COMMON,nt as blob,va as buildHero,pt as lathe,gt as spline,K as tube};
