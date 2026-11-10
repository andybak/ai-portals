import*as a from"three";import{clamp as ee,lerp as we,smoothstep as Te,makeRng as vo,hashSeed as go}from"../kit/core.js";const wo=["#0D0F0D","#0A1611","#1E4A2C","#4F8F2B","#93C83F","#C7D1CD","#5A7FCC"],se=56,N=-56,Wt=40,Ne=56,ke=68,Je=26,It=20,T=-5,ie=68,le=Math.PI,s0=[-56,-40,-24,-8,8,24,40,56],V0=56,qt=2.4,vt=-66,E0=-214,B0=68,W0=428,I0=364,Le=new a.Vector3,i0=new a.Quaternion,yo=new a.Euler,zt=new a.Vector3;function u(h,w,n,z=0,y=0,B=0,L=1,F=1,x=1){return new a.Matrix4().compose(Le.set(h,w,n),i0.setFromEuler(yo.set(z,y,B)),zt.set(L,F,x))}const P=h=>new a.Color(h),te=(h,w,n)=>h.clone().lerp(w,n);function D(h,w,n,z){const y=h/2,B=w/2,L=n/2;z=Math.min(z,y*.45,B*.45,L*.45);const F=(g,V,q,$)=>$===0?[g*y,V*(B-z),q*(L-z)]:$===1?[g*(y-z),V*B,q*(L-z)]:[g*(y-z),V*(B-z),q*L],x=[],oe=[-1,1],I=(g,V,q,$)=>{x.push(g,V,q,g,q,$)};for(const g of oe){I(F(g,-1,-1,0),F(g,1,-1,0),F(g,1,1,0),F(g,-1,1,0)),I(F(-1,g,-1,1),F(1,g,-1,1),F(1,g,1,1),F(-1,g,1,1)),I(F(-1,-1,g,2),F(1,-1,g,2),F(1,1,g,2),F(-1,1,g,2));for(const V of oe){I(F(-1,g,V,1),F(1,g,V,1),F(1,g,V,2),F(-1,g,V,2)),I(F(g,-1,V,0),F(g,1,V,0),F(g,1,V,2),F(g,-1,V,2)),I(F(g,V,-1,0),F(g,V,1,0),F(g,V,1,1),F(g,V,-1,1));for(const q of oe)x.push(F(g,V,q,0),F(g,V,q,1),F(g,V,q,2))}}const ae=x.length,Pe=new Float32Array(ae*3),R=new Float32Array(ae*3),j=new a.Vector3,fe=new a.Vector3,H=new a.Vector3,Z=new a.Vector3;for(let g=0;g<ae;g+=3){if(j.fromArray(x[g]),fe.fromArray(x[g+1]),H.fromArray(x[g+2]),Z.copy(fe).sub(j).cross(Le.copy(H).sub(j)).normalize(),Z.dot(Le.copy(j).add(fe).add(H))<0){Z.negate();const q=x[g+1];x[g+1]=x[g+2],x[g+2]=q}for(let q=0;q<3;q++)Pe.set(x[g+q],(g+q)*3),R[(g+q)*3]=Z.x,R[(g+q)*3+1]=Z.y,R[(g+q)*3+2]=Z.z}return _t(Pe,R)}const _t=(h,w)=>({attributes:{position:{array:h},normal:{array:w}},index:null,dispose(){}});function Rt(h){const w=new Float32Array(h),n=new Float32Array(w.length);for(let z=0;z<w.length;z+=9){const y=w[z]-w[z+3],B=w[z+1]-w[z+4],L=w[z+2]-w[z+5],F=w[z+6]-w[z+3],x=w[z+7]-w[z+4],oe=w[z+8]-w[z+5];let I=x*L-oe*B,ae=oe*y-F*L,Pe=F*B-x*y;const R=Math.sqrt(I*I+ae*ae+Pe*Pe)||1;I/=R,ae/=R,Pe/=R,n[z]=n[z+3]=n[z+6]=I,n[z+1]=n[z+4]=n[z+7]=ae,n[z+2]=n[z+5]=n[z+8]=Pe}return _t(w,n)}let jt=null;function X(h,w,n){if(!jt){const B=new a.BoxGeometry(1,1,1),L=B.toNonIndexed();jt=[new Float32Array(L.attributes.position.array),new Float32Array(L.attributes.normal.array)],B.dispose(),L.dispose()}const z=jt[0],y=new Float32Array(108);for(let B=0;B<108;B+=3)y[B]=z[B]*h,y[B+1]=z[B+1]*w,y[B+2]=z[B+2]*n;return _t(y,jt[1])}const q0={};function r0(h,w,n,z){let y=q0[z];if(!y){y=q0[z]=new Float32Array((z+1)*2);for(let I=0;I<=z;I++)y[I*2]=Math.sin(I/z*6.283185307),y[I*2+1]=Math.cos(I/z*6.283185307)}const B=new Float32Array(z*18),L=new Float32Array(z*18),F=(w-h)/Math.max(n,1e-6),x=1/Math.hypot(1,F),oe=n/2;for(let I=0,ae=0;I<z;I++){const Pe=y[I*2],R=y[I*2+1],j=y[I*2+2],fe=y[I*2+3];for(let H=0;H<6;H++,ae+=3){const Z=H===2||H>3,g=H===0||H===2||H===5,V=Z?j:Pe,q=Z?fe:R,$=g?h:w;B[ae]=V*$,B[ae+1]=g?oe:-oe,B[ae+2]=q*$,L[ae]=V*x,L[ae+1]=F*x,L[ae+2]=q*x}}return _t(B,L)}const Ze=(h,w)=>new a.LatheGeometry(h.map(n=>new a.Vector2(Math.max(n[0],1e-4),n[1])),w);function kt(h,w){const n=zt.copy(w).sub(h),z=n.length();return i0.setFromUnitVectors(Le.set(0,1,0),n.normalize()),{m:new a.Matrix4().compose(new a.Vector3().copy(h).add(w).multiplyScalar(.5),i0,new a.Vector3(1,1,1)),len:z}}function gt(h=0){const w=[];let n=0,z=0,y=0,B,L,F,x,oe=Math.max(1024,h|0);const I=new a.Matrix3,ae=new a.Vector3,Pe=R=>{z&&w.push([B,L,F,x,y]),z=Math.max(oe,R),oe=Math.min(oe*4,65536),y=0,B=new Float32Array(z*3),L=new Float32Array(z*3),F=new Float32Array(z*3),x=new Float32Array(z*4)};return{get triangles(){return(n+y)/3},add(R,j,fe,H,Z){const g=R.attributes.position.array,V=R.attributes.normal.array,q=R.index?R.index.array:null,$=q?q.length:g.length/3;y+$>z&&(n+=y,Pe($));const U=j?j.elements:null,re=j?I.getNormalMatrix(j).elements:null,Ee=Z&&Z.jit!=null?Z.jit:1,me=Z&&Z.grad,K=Z&&Z.fn,$e=me?me[0]:0,We=me?1/(me[1]-me[0]):0,At=me?me[2]:1,Qe=me?me[3]-me[2]:0,Ue=fe.r,Ce=fe.g,Ie=fe.b,ft=H[0],Ot=H[1],ne=H[2],b=H[3]||0,W=K?F.subarray(y*3):null,mt=K?x.subarray(y*4):null;for(let Fe=0;Fe<$;Fe++){const et=(q?q[Fe]:Fe)*3,De=(y+Fe)*3,qe=(y+Fe)*4;let _e=g[et],Ye=g[et+1],Be=g[et+2],Ae=V[et],ye=V[et+1],ce=V[et+2];if(U){const be=U[0]*_e+U[4]*Ye+U[8]*Be+U[12],Se=U[1]*_e+U[5]*Ye+U[9]*Be+U[13];Be=U[2]*_e+U[6]*Ye+U[10]*Be+U[14],_e=be,Ye=Se;const wt=re[0]*Ae+re[3]*ye+re[6]*ce,Tt=re[1]*Ae+re[4]*ye+re[7]*ce;ce=re[2]*Ae+re[5]*ye+re[8]*ce,Ae=wt,ye=Tt;const yt=Math.sqrt(Ae*Ae+ye*ye+ce*ce)||1;Ae/=yt,ye/=yt,ce/=yt}B[De]=_e,B[De+1]=Ye,B[De+2]=Be,L[De]=Ae,L[De+1]=ye,L[De+2]=ce;let xe=Ee;if(me){const be=(Ye-$e)*We;xe*=At+Qe*(be<0?0:be>1?1:be)}F[De]=Ue*xe,F[De+1]=Ce*xe,F[De+2]=Ie*xe,x[qe]=ft,x[qe+1]=Ot,x[qe+2]=ne,x[qe+3]=b,K&&(ae.set(Ae,ye,ce),K(Fe,_e,Ye,Be,ae,W,mt))}y+=$,R.dispose()},build(){z&&w.push([B,L,F,x,y]);const R=w.length===1,j=n+y,fe=R?B.subarray(0,j*3):new Float32Array(j*3),H=R?L.subarray(0,j*3):new Float32Array(j*3),Z=R?F.subarray(0,j*3):new Float32Array(j*3),g=R?x.subarray(0,j*4):new Float32Array(j*4);let V=0;if(!R)for(const $ of w){const U=$[4];fe.set($[0].subarray(0,U*3),V*3),H.set($[1].subarray(0,U*3),V*3),Z.set($[2].subarray(0,U*3),V*3),g.set($[3].subarray(0,U*4),V*4),V+=U}const q=new a.BufferGeometry;return q.setAttribute("position",new a.BufferAttribute(fe,3)),q.setAttribute("normal",new a.BufferAttribute(H,3)),q.setAttribute("color",new a.BufferAttribute(Z,3)),q.setAttribute("surf",new a.BufferAttribute(g,4)),w.length=0,n=0,z=0,y=0,B=L=F=x=null,q}}}const f={WOODY:0,WOODX:1,WOODZ:2,STONE:3,PLASTER:4,TILE:5,MOSS:6,METAL:7,PEBBLE:8,CLOTH:9,BLIND:10,WATER:11,PAPER:12,PAPERLIT:13,FLOW:14,THATCH:15,BARK:16,FLORET:17,NEEDLE:18,KOI:19,CONIFER:20,FROND:21,DOME:22,ICE:23,FLAME:24,FEATHER:25,EARTH:26,GHOST:27},Pt=h=>-2-h,st=`
float h11(float n){ return fract(sin(n * 127.1) * 43758.5453); }
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float h31(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
float vn3(vec3 p){
  vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(mix(h31(i), h31(i + vec3(1,0,0)), f.x), mix(h31(i + vec3(0,1,0)), h31(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(h31(i + vec3(0,0,1)), h31(i + vec3(1,0,1)), f.x), mix(h31(i + vec3(0,1,1)), h31(i + vec3(1,1,1)), f.x), f.y), f.z);
}`,_0=`
uniform vec3 uZen, uHor, uSeam, uStrata, uSunDir; uniform vec4 uSkyK;
vec3 rainSky(vec3 d){
  float el = clamp(d.y, 0., 1.);
  float hz = length(d.xz) + 1e-4, fz = d.z / hz, fwd = 0.5 + 0.5 * fz;
  float az = atan(d.x, abs(d.z) < 1e-5 ? 1e-5 : d.z);
  float cl = vn3(vec3(d.xz / (el + 0.25) * 1.6 + vec2(uTime * 0.012, 0.), uTime * 0.01));
  // THE DECK: dark blue-grey rain cloud in long torn layers that slide slowly, greyer gaps between them
  float st = vn3(vec3(az * 1.6 + uTime * 0.006, el * 8.5, 2.3)) * 0.55 + vn3(vec3(az * 4.3 - uTime * 0.009, el * 19., 7.1)) * 0.3 + cl * 0.15;
  float bars = smoothstep(0.33, 0.56, st);
  vec3 deck = mix(uHor * 0.94, uStrata * (0.78 + 0.44 * cl), clamp((0.66 + 0.34 * bars) * uSkyK.y, 0., 1.));
  deck *= 1. - 0.2 * smoothstep(0.45, 0.95, el);
  // rain veils: slanted darker curtains hanging from the cloud and drifting sideways across it
  float sl = az * 2.4 + el * 2.9;
  float v1 = vn3(vec3(sl * 1.5 + uTime * 0.03, el * 1.4, 1.5 + uTime * 0.008));
  float v2 = vn3(vec3(sl * 5.3 + uTime * 0.05, el * 3.1, 6.));
  float veil = smoothstep(0.36, 0.76, v1 * 0.72 + v2 * 0.28);
  deck *= (0.92 + 0.16 * cl) * (1. - 0.26 * veil * smoothstep(0.01, 0.1, el) * (1. - 0.5 * smoothstep(0.5, 0.9, el)));
  // THE SEAM: under the deck's torn edge, low over the wall and the cedars, the cloud stands clear of the horizon and one
  // slot of silver light shows, brightest ahead and just under the edge, sinking into the haze below it
  float edge = 0.185 + 0.05 * (vn3(vec3(az * 2.1, 1., uTime * 0.01)) - 0.5) + 0.07 * (st - 0.45);
  float open = 1. - smoothstep(edge - 0.03, edge + 0.035, el);
  float glow = (0.34 + 0.66 * fwd * fwd) * (0.72 + 0.5 * vn3(vec3(az * 7., el * 26., 4. + uTime * 0.02))) * mix(0.42, 1., smoothstep(0., 0.15, el));
  vec3 c = mix(deck, uHor * 1.06 + uSeam * glow * uSkyK.x, open);
  c += uSeam * 0.1 * uSkyK.x * fwd * exp(-(el - edge) * (el - edge) * 55.) * (1. - open);   // the edge of the deck is lit from beneath
  c *= 1. + 0.14 * fz * (1. - el);
  // the break in the cloud, where the shafts come down from
  float bk = max(dot(d, uSunDir), 0.); bk = bk * bk * bk; bk = bk * bk; bk = bk * bk;
  c += uSeam * bk * uSkyK.z * (0.5 + 0.7 * cl);
  return c;
}`,Gt=`
uniform vec4 uSunA, uSunP[6];
float sunPool(vec2 xz){
  vec2 q = xz * 0.0085 + uSunA.w * vec2(0.004, 0.0015) + 3.3;
  float n = vn3(vec3(q, 3.7)) * 0.7 + vn3(vec3(q * 2.3 + 5.1, 1.2)) * 0.3;
  float k = smoothstep(0.53, 0.7, n);
  for (int i = 0; i < 6; i++) { vec2 dd = (xz - uSunP[i].xy) / max(uSunP[i].z, 1.); k = max(k, uSunP[i].w * exp(-dot(dd, dd) * 1.6) * (0.75 + 0.5 * n)); }
  return clamp(k, 0., 1.) * uSunA.z * max(smoothstep(74., 96., xz.y), step(xz.y, -57.5) * smoothstep(13., 18., abs(xz.x)));
}`,xo=`
attribute vec3 color; attribute vec4 surf;
uniform mat4 uInv; uniform float uTime;
varying vec3 vP, vN, vC, vV; varying vec4 vS; varying float vD, vMr;
#include <fog_pars_vertex>
void main(){
  vec3 p = position;
  if (surf.w > 0.) {
    float ph = dot(floor(position.xz * 0.07), vec2(1.7, 2.3));
    p.z += sin(uTime * 0.9 + ph) * surf.w; p.x += sin(uTime * 0.63 + ph * 1.3) * surf.w * 0.4;
  }
  // shade in the hall's own space, so a mesh the world moves about (a fish, a heron, a tipping bamboo) is lit where it is
  float mir = determinant(mat3(modelMatrix)) < 0. ? -1. : 1.;
  mat4 rel = uInv * modelMatrix;
  vec3 pl = (rel * vec4(p, 1.)).xyz; pl.y *= mir;
  vec3 nl = mat3(rel) * normal; nl.y *= mir;
  vP = pl; vN = nl; vC = color; vS = surf; vMr = mir < 0. ? 1. : 0.;
  vec3 camL = (uInv * vec4(cameraPosition, 1.)).xyz; camL.y *= mir;
  vV = camL - pl;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  vD = -mvPosition.z;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,bo=`
uniform vec3 uSky, uMistCol, uMoss, uMossRim, uPine, uGap, uSun, uSunDir, uSeam, uStrata, uLampCol; uniform float uMist, uTime, uSnow; uniform vec4 uCorr, uPond, uLamps[5], uPatch; uniform vec3 uHallK; uniform sampler2D uShade;
varying vec3 vP, vN, vC, vV; varying vec4 vS; varying float vD, vMr;
#include <fog_pars_fragment>
${st}
${Gt}
// packed cells: x = 0 on the seam between two neighbours, rising toward each centre; yz = offset from the centre; w = a number of the cell's own
vec4 cushion(vec2 q){
  vec2 ci = floor(q), cf = fract(q), c1 = vec2(0.);
  float m1 = 9., m2 = 9., hc = 0.;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 o = vec2(float(i), float(j)), hv = vec2(h21(ci + o), h21(ci + o + 3.7)), c = o + 0.1 + 0.8 * hv - cf;
    float d = dot(c, c);
    if (d < m1) { m2 = m1; m1 = d; c1 = c; hc = fract(hv.x * 7.31 + hv.y * 3.17); } else if (d < m2) m2 = d;
  }
  return vec4(sqrt(m2) - sqrt(m1), -c1, hc);
}
// one rain ring per cell, thin, fading as it spreads: xy = slope of the ripple, z = its crest
vec3 rainRing(vec2 xz, float sc, float rate, float fw, float seed){
  vec2 q = xz / sc + seed, id = floor(q);
  vec2 f = fract(q) - 0.5 - (vec2(h21(id), h21(id + 5.3)) - 0.5) * 0.55;
  float ph = fract(uTime * rate + h21(id + 1.7)), r = length(f) + 1e-4;
  float lw = 0.011 + fw / sc, x = (r - ph * (0.16 + 0.24 * h21(id + 2.9))) / lw;
  float amp = (1. - ph) * (1. - ph) * (1. - smoothstep(0.05, 0.22, fw / sc)) * step(0.25, h21(id + 8.1));
  return vec3(f / r * x * exp(-x * x) * amp, exp(-x * x * 3.) * amp);
}
float mistAt(float d){ float md = uMist * d * 0.62; return 1. - exp(-md * md); }
// one cedar of a far rank, drawn on a long card (c counts trees along it, yh is metres above the garden floor): a spire of
// drooping tiers, each widening down to its hem, on a bare stem; every tree its own height, in clumps with gaps between
float spire(float c, float yh, float hLo, float hHi, float sp){
  float id = floor(c), hx = h11(id * 1.37 + 0.7), H = mix(hLo, hHi, hx * hx);
  float x = (fract(c) - 0.5 - (h11(id + 4.4) - 0.5) * 0.44) * sp;
  float t = clamp(yh / max(H, 1.), 0., 1.), tier = fract(yh / (H * 0.085) + hx * 3.);
  float w = H * 0.064 * pow(1. - t, 0.85) * (0.6 + 0.55 * (1. - tier)) * step(0.13 + 0.1 * hx, t) + H * 0.007 * (1. - t) + 0.2;
  float clump = smoothstep(0.36, 0.62, vn3(vec3(id * 0.17, hLo * 0.37, 2.3)));          // they stand in clumps, with gaps the light comes through
  return step(abs(x), w) * step(yh, H) * step(mix(0.08, 0.93, clump), h11(id + 8.8));
}
// what still water shows: the rain cloud, the walled garden's cedars and earthen wall, and (in the world, uPond.y) the
// teahouse with its lit round window, the pine limb and its bamboo props, all as soft dark smears
vec3 gardenEnv(vec3 p, vec3 r, float vd){
  r.y = abs(r.y) + 0.015; r = normalize(r);
  float rx = abs(r.x) < 1e-4 ? 1e-4 : r.x, rz = abs(r.z) < 1e-4 ? 1e-4 : r.z;
  float tx = ((rx > 0. ? 211. : -211.) - p.x) / rx, tz = ((rz > 0. ? 430. : 68.) - p.z) / rz;
  float t = max(min(tx, tz), 0.), sideW = step(tx, tz), garden = max(sideW, step(0., rz));
  float yh = p.y + r.y * t, al = mix(p.x + r.x * t, p.z + r.z * t, sideW);
  float lum = dot(uSky, vec3(0.4));
  // the sky as the water sees it: the dark deck above, the silver seam under its edge
  float cln = vn3(vec3(r.xz / (r.y + 0.25) * 1.6 + vec2(uTime * 0.012, 0.), uTime * 0.01));
  vec3 col = mix(uMistCol * 1.06 + uSeam * (0.3 + 0.6 * smoothstep(-0.2, 0.9, r.z)) * mix(0.45, 1., smoothstep(0., 0.15, r.y)),
    mix(uMistCol * 0.94, uStrata, 0.66) * (0.78 + 0.44 * cln), smoothstep(0.15, 0.23, r.y + (cln - 0.5) * 0.07));
  vec3 ced = vec3(0.016, 0.05, 0.028) * lum;
  float c2 = al / 31. + 7.7, c1 = al / 27. + 0.3;
  float s2 = ${T.toFixed(1)} + mix(74., 112., h11(floor(c2))) * clamp(1. - abs(fract(c2) - 0.5) * 2.1, 0., 1.);
  float s1 = ${T.toFixed(1)} + mix(70., 108., h11(floor(c1))) * clamp(1. - abs(fract(c1) - 0.5) * 2.3, 0., 1.);
  float y2 = p.y + r.y * t * 1.15, y1 = p.y + r.y * t * 1.05;
  col = mix(col, mix(ced * 1.5, uMistCol, clamp(mistAt(vd + t * 1.15) + 0.25 + smoothstep(40., 110., y2) * 0.5, 0., 1.)), (1. - smoothstep(s2 - 5., s2 + 5., y2)) * garden);
  col = mix(col, mix(ced, uMistCol, clamp(mistAt(vd + t * 1.05) + smoothstep(40., 110., y1) * 0.5, 0., 1.)), (1. - smoothstep(s1 - 5., s1 + 5., y1)) * garden);
  vec3 wallC = mix(vec3(0.10, 0.10, 0.07) * lum * 1.6, vec3(0.012, 0.014, 0.016), max(smoothstep(${(T+23).toFixed(1)}, ${(T+24.6).toFixed(1)}, yh), 1. - garden));
  col = mix(col, mix(wallC, uMistCol, mistAt(vd + t)), 1. - smoothstep(mix(46., ${(T+25).toFixed(1)}, garden), mix(56., ${(T+27).toFixed(1)}, garden), yh));
  if (uPond.y > 0.5) {
    float ax = -40. * uPond.x, rl = max(length(r.xz), 1e-3);
    float tt = (392. - p.z) / rz;
    if (rz > 0. && tt > 0.) {                                       // the teahouse, its window the palest thing in the pond
      float xh = p.x + r.x * tt - ax, yy = p.y + r.y * tt;
      float roof = 12. + 20. * pow(clamp((36. - abs(xh)) / 20., 0., 1.), 0.82);
      vec3 tc = mix(vec3(0.03, 0.045, 0.026), vec3(0.15, 0.155, 0.13), 1. - smoothstep(10.6, 12.6, yy)) * lum * 1.6;
      tc = mix(tc, uGap.b > uGap.g ? vec3(0.8, 0.9, 0.86) : vec3(0.72, 0.92, 0.78), 1. - smoothstep(5.4, 8.6, length(vec2(xh, yy - 2.6))));
      col = mix(col, mix(tc, uMistCol, mistAt(vd + tt)), (1. - smoothstep(roof - 2.5, roof + 2.5, yy)) * (1. - smoothstep(33., 38., abs(xh))));
    }
    float th = (16.3 - p.y) / r.y;                                  // the trained limb and its needle pads, overhead
    float lxh = p.x + r.x * th - ax, lzh = p.z + r.z * th;
    float ml = (1. - smoothstep(2.2, 7., abs(lxh))) * smoothstep(243., 252., lzh) * (1. - smoothstep(380., 388., lzh)) * (0.5 + 0.5 * vn3(vec3(lxh * 0.4, lzh * 0.3, 3.)));
    col = mix(col, mix(vec3(0.005, 0.016, 0.01), uMistCol, mistAt(vd + th)), ml * 0.92);
    for (int k = 0; k < 2; k++) {                                   // the two rows of bamboo props
      float tp = (ax + (k == 0 ? -8. : 8.) - p.x) / rx;
      float zh = p.z + r.z * tp, j = clamp(floor((zh - 252.) / 16. + 0.5), 0., 8.);
      float dz = abs(zh - (252. + 16. * j)) * abs(r.x) / rl;
      float mp = (1. - smoothstep(0.32, 0.8 + 0.012 * max(tp, 0.), dz)) * (1. - smoothstep(13., 15.5, p.y + r.y * tp)) * step(0., tp);
      col = mix(col, mix(vec3(0.016, 0.03, 0.012), uMistCol, mistAt(vd + max(tp, 0.))), mp * 0.88);
    }
  }
  return col;
}
void main(){
  vec3 n = normalize(vN + vec3(0., 1e-5, 0.));
  vec3 v = normalize(vV + vec3(0., 1e-5, 0.));
  float back = step(dot(n, v), 0.);
  if (back > 0.5) n = -n;
  float kind = floor(vS.x + 0.5), gloss = vS.y, ex = vS.z;
  float dome = step(21.5, kind) * step(kind, 22.5);
  if (dome > 0.5) kind = 6.;
  float fwPx = fwidth(vP.x), fwPy = fwidth(vP.y), fwPz = fwidth(vP.z);
  float fwP = fwidth(vC.x) * 8. + fwidth(vC.y) * 18., fwXZ = fwPx + fwPz;
  vec3 alb = vC, emis = vec3(0.), p = vP;
  float sunK = ex > 0.01 ? sunPool(p.xz - uSunA.xy * (p.y - (${T.toFixed(1)}))) : 0.;
  float mossCap = 1., glintK = 1., thru = 0., skyGl = 1.;
  vec3 snowTint = vec3(1.);
  float ndv0 = clamp(dot(n, v), 0., 1.);
  if (kind < 2.5) {                                   // timber, grain along y / x / z
    vec3 q = kind < 0.5 ? p.xzy : (kind < 1.5 ? p.yzx : p.xyz);
    float g = vn3(vec3(q.xy * 4., q.z * 0.3)), g2 = vn3(vec3(q.xy * 15., q.z * 1.2));
    float ring = abs(fract(g * 5. + q.x * 1.1) - 0.5) * 2.;
    alb *= 0.6 + 0.5 * g + 0.4 * g2 * ring;
    gloss *= 0.65 + 0.6 * g2;
  } else if (kind < 3.5) {                            // stone: grain and pits, pale lichen rosettes, dark wet streaks down the faces, moss on the ledges
    float s = vn3(p * 2.6), b = vn3(p * 0.45 + 7.);
    float nearK = 1. - smoothstep(0.03, 0.2, fwXZ);
    float gr = mix(0.5, vn3(p * 11.) * 0.6 + vn3(p * 29.) * 0.4, nearK);
    float wall = 1. - smoothstep(0.3, 0.75, abs(n.y));
    alb *= (0.68 + 0.56 * s) * (0.7 + 0.6 * gr) * (1. - 0.45 * nearK * smoothstep(0.7, 0.82, vn3(p * 17. + 3.)));
    alb = mix(alb, vec3(0.30, 0.36, 0.30), smoothstep(0.58, 0.72, b + s * 0.15) * 0.6);
    // rain runs down the upright faces in dark, glossy streaks that keep their place
    float streak = smoothstep(0.48, 0.72, vn3(vec3(p.x * 2.3 + p.z * 1.7, p.y * 0.2, p.z * 2.3 - p.x * 1.1)) + (gr - 0.5) * 0.12) * wall * ex;
    alb *= 1. - 0.5 * streak;
    // lichen: grey-green and ochre rosettes with crinkled rims, each its own size
    vec2 lq = abs(n.y) > 0.62 ? p.xz : (abs(n.x) > abs(n.z) ? p.zy : p.xy);
    vec4 lc = cushion(lq * 0.85 + 11.3);
    float lr = length(lc.yz), lrad = 0.14 + 0.24 * lc.w;
    float lich = (1. - smoothstep(lrad - 0.06, lrad, lr + (gr - 0.5) * 0.1 + (s - 0.5) * 0.06)) * step(0.42, lc.w) * (1. - 0.6 * streak) * (1. - smoothstep(0.35, 1.2, fwXZ));
    vec3 lcol = mix(vec3(0.25, 0.29, 0.23), vec3(0.32, 0.27, 0.12), step(0.82, lc.w));
    alb = mix(alb, lcol * (0.7 + 0.5 * gr) * (0.62 + 0.55 * smoothstep(0., lrad, lr)), lich * 0.82);
    float ms = smoothstep(0.3, 0.8, n.y) * smoothstep(0.35, 0.6, vn3(p * 0.8 + 3.)) * ex * (1. - 0.85 * smoothstep(0.56, 0.7, gloss));
    alb = mix(alb, uMoss * (0.6 + 0.8 * s) * (0.75 + 0.5 * gr), ms);
    gloss *= (1. - ms) * (1. - 0.75 * lich) * mix(0.5, 1., max(streak, 1. - wall)) * (0.75 + 0.5 * gr);
    glintK = 0.3;
  } else if (kind < 4.5) {                            // plaster / earth wall, rain streaked
    float st = vn3(vec3(p.x * 0.9, p.y * 0.06, p.z * 0.9)), s = vn3(p * 1.7);
    alb *= (0.8 + 0.25 * s) * (1. - 0.3 * smoothstep(0.5, 0.85, st) * ex);
  } else if (kind < 5.5) {                            // roof tile: round cover tiles running down the slope
    float ax = step(abs(n.x), abs(n.z));
    float t = mix(p.z, p.x, ax) / 1.5, u = mix(p.x, p.z, ax) / 2.1;
    float f = fract(t) - 0.5, ft = floor(t);
    float hump = 1. - smoothstep(0.18, 0.5, abs(f));
    float cu = u + h11(ft) ;
    alb *= (0.4 + 0.6 * hump) * (0.75 + 0.5 * h21(vec2(ft, floor(cu)))) * (0.7 + 0.3 * smoothstep(0., 0.2, fract(cu)));
    n = normalize(n + mix(vec3(0., 0., 1.), vec3(1., 0., 0.), ax) * f * hump * 1.1);
    alb = mix(alb, uMoss * 0.5, (1. - hump) * smoothstep(0.5, 0.7, vn3(p * 0.35)) * 0.6);
    gloss *= 0.45 + 0.55 * hump;
  } else if (kind < 6.5) {                            // moss: dark creases, bright crowns, frayed rim, drop glints
    // The real mounds (dome) are humps of their own, each with a soft quilting of big cushions, vivid on the crown and
    // near black where it meets its neighbours. The ground between them is a carpet of small soft tufts with shallow
    // creases, well below a stepping stone in size, lying dark in the shade the mounds lay on it (uShade).
    float s = vn3(p * 2.2), s2 = vn3(p * 9.), ny0 = n.y, gnd = 1. - dome;
    float lp = vn3(p * 0.1 + 2.), lp2 = vn3(p * 0.33 + 9.);
    float s4t = mix(0.5, vn3(p * 41.), 1. - smoothstep(0.015, 0.07, fwXZ));
    float topK = smoothstep(0.3, 0.75, ny0) * mix(1., 0.45, dome);
    // the slow patches, each in drifts of its own: moss that is wetter and darker, and paler new growth
    // (all of this belongs to the cushions and to the HILLSIDE's own ground, by a rule of place: the slope that falls from the
    // veranda's edge to the stone lantern's line, and the hill where it stands, as it stood before the way was cut, 1.5 to 4 m
    // over the garden's floor. The pond's shore by the stepping stones, the ground before the teahouse and the moss on the
    // thatch keep the look they had)
    float hillG = max(smoothstep(1.5, 4., 30. * smoothstep(-15., 150., p.x * uPond.x + (p.z - 230.) * 0.15) * smoothstep(80., 190., p.z)),
      smoothstep(${(ke-2).toFixed(1)}, ${(ke+4).toFixed(1)}, p.z) * (1. - smoothstep(184., 196., p.z)));
    float plc = max(dome, hillG);
    float wetP = smoothstep(0.55, 0.7, vn3(vec3(p.xz * 0.043 + uPatch.xy, 1.3)) * 0.72 + lp2 * 0.28) * plc;
    float paleP = smoothstep(0.56, 0.72, vn3(vec3(p.xz * 0.057 + uPatch.zw, 6.1)) * 0.76 + s * 0.24) * (1. - wetP) * plc;
    // velvet: every cushion is a pile of small soft heads, dark between them, each catching the sky on its own crown
    vec2 tq = p.xz + p.y * vec2(0.83, 0.56) + (vec2(vn3(p * 1.9 + 4.), vn3(p * 1.9 + 15.)) - 0.5) * 0.42 + (vec2(s2, vn3(p * 9. + 7.)) - 0.5) * 0.12;   // warped, so the heads never lie in rows
    float lodT = 1. - smoothstep(0.05, 0.22, fwXZ);
    // the heads are of two sizes, and a slow noise of the place says which grow where
    vec4 tf = mix(cushion(tq * 5.3 + 1.7), cushion(tq * 2.7 + 8.3), smoothstep(0.4, 0.6, vn3(vec3(p.xz * 0.21 + 7.3, 2.6)) * 0.8 + lp2 * 0.2));
    float tuft = mix(0.5, clamp(tf.x * 1.7 + (s4t - 0.5) * 0.5, 0., 1.), lodT);
    vec2 wq = p.xz + (vec2(lp2, vn3(p * 0.41 + 3.)) - 0.5) * mix(3.4, 1.5, gnd) + (vec2(s, vn3(p * 2.2 + 5.)) - 0.5) * mix(0.55, 0.3, gnd);
    float csc = mix(1., 2.7, gnd);
    vec4 ca = cushion(wq * 0.55 * csc), cb = cushion(wq * 0.23 * csc + 3.3);
    float lodA = 1. - smoothstep(0.55, 1.7, fwXZ * 1.15 * csc), lodB = 1. - smoothstep(0.55, 1.7, fwXZ * 0.5 * csc), onB = step(0.5, cb.w);
    float pA = mix(0.5, clamp(ca.x * 1.6, 0., 1.) * (0.55 + 0.45 * ca.w), lodA);
    float pB = mix(0.55, clamp(cb.x * 1.65, 0., 1.) * (0.75 + 0.5 * cb.w), lodB) * onB;
    float big = step(pA, pB), ch = mix(ca.w, cb.w, big);
    float seam = (1. - smoothstep(0., 0.17, abs(pA - pB))) * onB * lodA;
    float hh = mix(1., clamp(max(pA, pB), 0., 1.), topK);
    float fz = mix(0.5, vn3(p * 23.), 1. - smoothstep(0.03, 0.12, fwXZ));
    float hg = clamp(hh + ((s2 - 0.5) * 0.55 + (fz - 0.5) * 0.35) * gnd * topK, 0., 1.);       // the ground's tufts are frayed: no clean line runs between them
    float sh0 = texture2D(uShade, (p.xz - vec2(${(E0-.5).toFixed(1)}, ${(B0-.5).toFixed(1)})) / vec2(${W0.toFixed(1)}, ${I0.toFixed(1)})).r, sh = dome > 0.5 ? 0. : sh0;
    float vall = smoothstep(0., mix(0.85, 0.5, dome), hg);
    float mom = dome * step(0.4, gloss); gloss = mix(gloss, 0.2, dome);     // a great low cushion that others ride on and crowd: they lay their shade on it
    // the crease's own share of the shade (1 where no crease is): the seam where two cushions meet, the shade the mounds lay on the
    // ground and on each other, the flank's foot. Whatever is laid over the moss below yields to it: nearly black in the creases
    float crK = (1. - 0.7 * seam * topK * dome) * (1. - 0.93 * sh * sh * (3. - 2. * sh))
      * (1. - 0.8 * dome * smoothstep(0.8, 1., sh0) * (1. - smoothstep(0.5, 0.86, ny0)))
      * (1. - mom * max(0.62 * smoothstep(0.3, 0.8, sh0), 0.8 * smoothstep(0.35, 0.9, sh0)));               // a crease, nearly black, where two cushions meet; a great low cushion lies in the shade of those that crowd it, deepest where they stand thickest
    float occ = mix(mix(0.6, 0.05, dome), 1., vall) * crK;
    // a hollow: the hill's ground in the skirt of shade round whatever stands on it (mounds, rocks, hydrangeas, the lantern; the
    // shade grid, the same from every eye). It takes no lift, lies wet and dark, and no pale growth stands in it
    float holl = (1. - dome) * hillG * smoothstep(0.05, 0.45, sh0);
    float sideK = smoothstep(0.3, 0.93, ny0), s3 = fz, s4 = mix(0.5, vn3(p * 57.), 1. - smoothstep(0.012, 0.05, fwXZ));
    float crown = mix(smoothstep(0.5, 1., hg) * 0.38, smoothstep(0.45, 0.95, hh) * 0.5 + smoothstep(0.82, 0.995, ny0), dome);
    float detK = max(lodA, lodB);
    alb *= (0.5 + 0.5 * s + 0.42 * s2) * (0.78 + 0.44 * s3) * (0.8 + 0.4 * s4) * mix(0.1, 1.08, sideK) * mix(0.5, 1.2, smoothstep(0.2, 0.8, lp)) * mix(0.8, 1., dome);
    alb = mix(alb, alb * vec3(0.5, 0.82, 0.8), (1. - lp) * 0.55);                // cooler, deeper drifts
    alb = mix(alb * vec3(0.4, 0.8, 0.9), alb, sideK);                            // dark green beneath
    alb *= mix(vec3(1.), mix(vec3(0.62, 0.86, 0.88), vec3(1.3, 1.12, 0.7), ch), topK * detK * mix(0.6, 1., dome));   // every cushion its own green
    alb *= mix(1., (0.74 + 0.4 * smoothstep(0., 0.9, tuft)) * mix(1., 0.86 + 0.28 * tf.w, lodT) * (0.9 + 0.2 * s4t), plc);        // the heads, and the soft dark between them
    alb *= mix(1., mix(mix(1., 1.42, hillG * (1. - holl)), mix(0.55, 1.72, smoothstep(0.72, 0.98, ny0)), dome), crK);                // vivid on the crown only, falling to dark green down the flank; the lift yields to the crease and to the hollow
    alb = mix(alb, alb * vec3(0.64, 0.84, 0.78), max(wetP, holl) * 0.85);
    alb = mix(alb, alb * vec3(1.3, 1.2, 0.78) + uMossRim * 0.035, paleP * 0.8 * crK * (1. - holl));
    vec3 hi = mix(alb * 1.2, uMossRim * (0.7 + 0.55 * s) * (0.8 + 0.4 * s3), 0.3 + 0.4 * smoothstep(0.3, 0.7, lp2));
    alb = mix(mix(alb * mix(vec3(0.66, 0.8, 0.78), vec3(0.3, 0.5, 0.5), dome), alb, vall), hi, crown * 0.85) * occ;
    vec2 slope = mix(ca.yz * lodA * 1.7, cb.yz * lodB * 1.1, big) * (1. - smoothstep(0.1, 0.9, hh)) * mix(0.22 * (1. - 0.85 * uSnow), 1., dome);
    n = normalize(n + vec3(slope.x, 0., slope.y) * topK + vec3(tf.y, 0., tf.z) * (0.45 * plc * lodT * (1. - smoothstep(0.1, 0.8, tuft)) * smoothstep(0.1, 0.5, ny0)));
    float rimK = pow(1. - ndv0, 3.);
    alb += uMossRim * (rimK * mix(0.07, 0.3, dome) + (1. - ndv0) * (1. - ndv0) * 0.2 * dome * (0.5 + tuft) * crK) * (0.4 + s2) * (0.7 + 0.6 * s4) * smoothstep(0.05, 0.5, ny0);    // the soft rim, lit from behind; the nap of the velvet
    skyGl = mix(1., 0.22, plc);                                                                  // no sheet of sheen on a cushion: only beads and fine glints
    if (dome > 0.5 && (back > 0.5 || ndv0 < 0.5 * (vn3(p * 3.1) * 0.52 + vn3(p * 9.7) * 0.3 + s3 * 0.18) - 0.06)) discard;   // frayed edge
    // under snow the ground is one soft blanket: faint blue-grey dimples where the creases were, a few crowns standing clear
    float show = smoothstep(0.62, 0.9, hh) * step(0.8, ch) * topK * detK;
    mossCap = dome > 0.5 ? mix(1., smoothstep(0.15, 0.55, hh), topK * lodA) : 1. - 0.9 * show;
    snowTint = mix(vec3(1.), vec3(0.76, 0.83, 0.94), gnd * (1. - vall) * 0.7 * detK) * mix(vec3(1.), vec3(0.62, 0.7, 0.84), gnd * sh * 0.75);
    vec2 bq = p.xz * 6.5;                                                                       // water beads on the crowns: small, sparse, the colour of the sky
    float bead = (1. - smoothstep(0.08, 0.2, length(fract(bq) - 0.5))) * step(mix(0.965, 0.99, smoothstep(5., 26., vD)) - 0.03 * wetP, h21(floor(bq)));
    emis += (uSky * vec3(0.86, 1., 1.1) * 1.05 + uSun * sunK * 1.4) * bead * (0.35 + 0.65 * hh * hh) * smoothstep(0.25, 0.7, ny0) * (1. - sh) * (1. - smoothstep(0.12, 0.5, fwXZ));
    vec2 gq = tq * 6.3;                                                                          // fine wet glints that come and go as the drops gather and fall
    float gh = h21(floor(gq)), tw = 0.5 + 0.5 * sin(uTime * (0.6 + 1.7 * gh) + gh * 40.); tw *= tw; tw *= tw;
    emis += uSky * vec3(0.84, 1., 1.06) * 0.5 * (1. - smoothstep(0.06, 0.2, length(fract(gq) - 0.5))) * step(mix(0.95, 0.84, wetP), gh) * tw
      * smoothstep(0.3, 0.75, ny0) * (1. - sh) * (1. - smoothstep(0.05, 0.2, fwXZ)) * (1. - uSnow) * plc;
    alb = mix(alb, alb * vec3(1.25, 1.12, 0.72), sunK * 0.6 * smoothstep(0.2, 0.8, ny0));          // moss in the light turns gold-green
    alb *= 1. - 0.62 * uSnow;                                                                     // February: what the snow leaves bare is dark and wet
  } else if (kind < 7.5) {                            // bronze with verdigris
    float verd = smoothstep(0.4, 0.75, vn3(p * 1.3));
    alb = mix(alb, vec3(0.08, 0.2, 0.16), verd * 0.7); gloss *= 1. - 0.6 * verd;
  } else if (kind < 8.5) {                            // pebbles, with splash rings under the drip line
    vec2 q = p.xz * 1.25, id = floor(q), f = fract(q);
    float md = 9., hid = 0.;
    for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
      vec2 o = vec2(float(i), float(j)), c = o + vec2(h21(id + o), h21(id + o + 3.7)) - f;
      float d = dot(c, c);
      if (d < md) { md = d; hid = h21(id + o + 9.); }
    }
    float pl = smoothstep(0.12, 0.5, fwXZ * 1.25);
    alb *= mix((0.3 + 0.7 * (1. - smoothstep(0.06, 0.42, md))) * (0.55 + 0.9 * hid), 0.62, pl);
    gloss *= mix(1. - smoothstep(0.06, 0.42, md), 0.5, pl);
    float cx = floor((p.x - ${vt.toFixed(1)}) / ${qt.toFixed(1)} + 0.5) * ${qt.toFixed(1)} + ${vt.toFixed(1)};
    // where the eave's beads land: thin rings of two sizes that fade as they spread, like those on the pond
    float rr = length(vec2(p.x - cx, p.z - ${(ke+.3).toFixed(1)})), h0 = h11(cx), rlw = 0.016 + fwXZ * 0.3;
    float ph = fract(uTime * 0.9 + h0), ph2 = fract(uTime * 0.63 + h0 * 7.3 + 0.5);
    float rg = (1. - smoothstep(0., rlw, abs(rr - ph * (0.7 + 0.9 * h0)))) * (1. - ph) * (1. - ph)
      + 0.7 * (1. - smoothstep(0., rlw, abs(rr - ph2 * (0.45 + 0.8 * fract(h0 * 5.7))))) * (1. - ph2) * (1. - ph2);
    emis += uSky * 0.75 * rg * min(1., 0.03 / rlw + 0.2) * (1. - uSnow);
  } else if (kind < 9.5) {                            // cloth, oiled paper
    alb *= 0.85 + 0.3 * vn3(p * 12.);
  } else if (kind < 10.5) {                           // bamboo blind
    float sl = fract(p.y * 2.2);
    alb *= 0.15 + 0.85 * smoothstep(0., 0.14, sl) * (1. - smoothstep(0.84, 1., sl));
    alb *= 1. - 0.7 * (1. - smoothstep(0.02, 0.05, abs(fract(p.x / 3.2) - 0.5)));
  } else if (kind < 11.5) {                           // still water with rain rings
    // dark green-black water: thin rings of several sizes bend what it mirrors; pearl only where it looks at the cloud
    float fw = fwXZ * 0.5, wet = 1. - 0.7 * uSnow;
    float pool = step(0.3, gloss) * step(gloss, 0.7), rsc = mix(1., 0.34, pool);     // a rain pool in the moss (gloss 0.5 marks it): its rings are small
    vec3 r1 = rainRing(p.xz, 3.1 * rsc, 0.55, fw, 0.), r2 = rainRing(p.xz, 6.7 * rsc, 0.31, fw, 4.7), r3 = rainRing(p.xz, 1.7 * rsc, 0.8, fw, 9.1);
    vec2 wob = (vec2(vn3(vec3(p.xz * 0.7, uTime * 0.45)), vn3(vec3(p.xz * 0.7 + 9., uTime * 0.45))) - 0.5) * 0.05;
    n = normalize(n + vec3(r1.x + r2.x + r3.x * 0.6, 0., r1.y + r2.y + r3.y * 0.6) * 1.3 * wet + vec3(wob.x, 0., wob.y));
    float Fw = 0.03 + 0.97 * pow(1. - clamp(dot(n, v), 0., 1.), 4.2);
    vec3 env = gardenEnv(p, reflect(-v, n), vD);
    float spk = vn3(vec3(p.xz * 2.7, uTime * 1.6)) * vn3(vec3(p.xz * 6.9 + 7., uTime * 2.3));
    emis += mix(vec3(0.007, 0.019, 0.014) * dot(uSky, vec3(0.6)), env, Fw) + uSky * (r1.z + r2.z + r3.z * 0.5) * 0.09 * wet
      + uSun * sunK * (smoothstep(0.5, 0.64, spk) * 0.8 + (r1.z + r2.z) * 0.6 + 0.035) * (1. - smoothstep(0.2, 0.9, fw));
    alb = vec3(0.); gloss = 0.;
    if (pool > 0.5) {
      // A small dark water lying in a hollow (colour attribute x: 0 in its middle, 1 about where the water ends, more on
      // the wet moss round it). Looking down into it one sees the near-black of the creases and a little moss through the
      // shallows; it gives back the cloud only at a grazing angle. Its edge is cut by a clamped noise, never a straight run.
      float en = vC.x + clamp((vn3(vec3(p.xz * 0.9, 2.)) - 0.5) * 0.52 + (vn3(vec3(p.xz * 3.1, 6.)) - 0.5) * 0.2, -0.36, 0.36);
      if (en > 1.3 + 0.34 * vn3(vec3(p.xz * 6.1, 9.))) discard;
      float water = 1. - smoothstep(0.96, 1.04, en), lum = dot(uSky, vec3(0.6));
      vec3 deep = (vec3(0.005, 0.015, 0.01) + uMoss * 0.045 * smoothstep(0.5, 1., en) * (0.4 + 0.9 * vn3(p * 6.3))) * lum;
      vec3 wcol = mix(deep, env, Fw) + uSky * (r1.z + r2.z + r3.z * 0.5) * 0.13 * wet
        + uSun * sunK * ((r1.z + r2.z) * 0.6 + 0.035) * (1. - smoothstep(0.2, 0.9, fw));
      emis = wcol * water;
      alb = uMoss * 0.17 * (0.55 + 0.9 * vn3(p * 7.1)) * (1. - water);          // the wet rim of moss round it: darker than any cushion
      gloss = 0.12 * (1. - water);
    }
  } else if (kind < 13.5) {                           // ink-washed paper screen (colour attribute = panel coords)
    float pu = vC.x, pv = vC.y, pi = floor(vC.z * 32. + 0.5), w = pi + pu;
    float m1 = vn3(vec3(w * 1.3, pv * 3.2, 1.)), m2 = vn3(vec3(w * 3.1, pv * 7., 5.));
    float wash = smoothstep(0.35, 0.75, m1 * 0.7 + m2 * 0.3) * smoothstep(0.05, 0.5, pv);
    float y0 = 0.6 + 0.16 * sin(w * 1.7 + 1.) + 0.07 * sin(w * 4.3);
    float tuft = smoothstep(0.45, 0.7, vn3(vec3(w * 7., pv * 11., 9.)));
    float ink = (1. - smoothstep(0., 0.15, abs(pv - y0))) * tuft;
    ink = max(ink, (1. - smoothstep(0.004, 0.012, abs(pv - y0 + 0.012 * sin(w * 23.)))) * 0.9);
    alb = vec3(0.50, 0.55, 0.51) * (1. - 0.35 * wash);
    alb = mix(alb, vec3(0.02, 0.025, 0.03), clamp(ink, 0., 1.) * 0.88);
    float fe = min(min(pu, 1. - pu) * 8., min(pv, 1. - pv) * 18.);
    float frame = 1. - smoothstep(0.3 - fwP - 1e-4, 0.3 + fwP + 1e-4, fe);
    vec2 pc = vec2((pu - (mod(pi, 2.) < 0.5 ? 0.9 : 0.1)) * 8., (pv - 0.42) * 18.);
    float pr = length(pc), pull = (1. - smoothstep(0.5, 0.56, pr)) * smoothstep(0.3, 0.36, pr);
    float lsh = smoothstep(0.47, 0.6, vn3(vec3(pu * 2.6 + pi * 3.1 + 0.25 * sin(uTime * 1.9 + pi), pv * 5.5 + 0.12 * sin(uTime * 2.6 + pi * 1.3), 1.)) * 0.6 + vn3(vec3(pu * 7.5 + pi, pv * 16., 4.)) * 0.4);
    emis = alb * uSky * uHallK.y * 1.5 * (1. - 0.42 * lsh * smoothstep(0.12, 0.5, pv)) * (0.7 + 0.3 * pv) * (0.85 + 0.3 * vn3(vec3(pu * 0.7 + pi, pv, uTime * 0.6)));
    alb = mix(alb, vec3(0.006), max(frame, pull)); emis *= 1. - max(frame, pull);
    gloss = mix(0.04, 0.7, frame);
  } else if (kind < 14.5) {                           // water running down a rain chain
    float a = atan(n.z, n.x + 1e-5);
    float s = vn3(vec3(a * 1.5, p.y * 0.7 + uTime * 6., 2.)), s2 = vn3(vec3(a * 4., p.y * 2.2 + uTime * 9., 7.));
    alb = vec3(0.03); emis = uSky * (0.2 + 2.8 * s * s * s2); gloss = 1.;
  } else if (kind < 15.5) {                           // thatch: combed straw in courses, mossed and wet
    float st = vn3(vec3(p.x * 5., p.y * 0.6, p.z * 5.)), co = fract(p.y * 0.55 + vn3(p * 0.35) * 0.5);
    alb *= (0.5 + 0.7 * st) * (0.6 + 0.4 * smoothstep(0., 0.25, co));
    float ms = smoothstep(0.42, 0.62, vn3(p * 0.22 + 5.) * 0.7 + vn3(p * 1.1) * 0.3) * ex;
    alb = mix(alb, uMoss * (0.45 + 0.8 * st), ms * 0.85); gloss *= 0.5;
  } else if (kind < 16.5) {                           // pine bark: long plates between dark furrows, rust and lichen
    float limbK = step(vS.w, -0.5);
    vec3 q = limbK > 0.5 ? p.xyz : p.xzy;             // q.z runs along the grain
    vec2 an = abs(limbK > 0.5 ? n.xy : n.xz) + 1e-3;
    float wA = smoothstep(0.3, 0.7, an.x / (an.x + an.y));
    float fl = vn3(vec3(q.xy * 6., q.z * 1.3)), tone = vn3(q * vec3(1.2, 1.2, 0.35) + 4.);
    float wv = (vn3(q * vec3(0.7, 0.7, 0.45) + 1.7) - 0.5) * 1.5;     // the plates wander: long, narrow, never a net of tiles
    vec4 pa = cushion(vec2(q.y * 4.2 + wv, q.z * 0.5)), pb = cushion(vec2(q.x * 4.2 + 5.1 + wv, q.z * 0.5 + 2.7));
    float fur = (1. - smoothstep(0.015, 0.07 + 0.22 * fl, mix(pb.x, pa.x, wA))) * (1. - smoothstep(0.08, 0.3, fwXZ));
    alb *= mix(0.84, 1.14, mix(pb.w, pa.w, step(0.5, wA)));
    alb *= (0.55 + 0.55 * fl) * (0.8 + 0.4 * vn3(vec3(q.xy * 17., q.z * 2.2))) * mix(0.72, 1.3, tone) * (1. - 0.55 * fur);
    alb = mix(alb, alb * vec3(1.4, 0.9, 0.68), smoothstep(0.45, 0.8, tone) * 0.6);
    alb = mix(alb, vec3(0.28, 0.36, 0.27), (1. - fur) * smoothstep(0.62, 0.8, vn3(p * 0.9 + 2.) * 0.7 + fl * 0.3) * 0.6);
    alb = mix(alb, uMoss * (0.5 + 0.5 * fl), smoothstep(0.35, 0.8, n.y) * smoothstep(0.4, 0.65, vn3(p * 0.7 + 8.)) * ex);
    gloss *= 1. - 0.8 * fur;
  } else if (kind < 17.5) {                           // hydrangea head: a mass of small four-petalled florets
    vec3 g = p * 2.7, gi = floor(g);
    float hh = h31(gi);
    vec3 d3 = fract(g) - 0.5 - (vec3(hh, h31(gi + 3.1), h31(gi + 7.7)) - 0.5) * 0.4;
    vec3 t1 = normalize(cross(n, vec3(0.31, 0.9, 0.23)) + vec3(1e-4, 0., 0.)), t2 = cross(n, t1);
    vec2 d2 = vec2(dot(d3, t1), dot(d3, t2));
    float rr = length(d2), th = atan(d2.y, d2.x + 1e-5) + hh * 6.283;
    float edge = 0.27 + 0.17 * abs(cos(th * 2.));
    float pet = 1. - smoothstep(edge - 0.07, edge, rr);
    if (ndv0 < 0.36 && pet < 0.5) discard;            // a scalloped outline, not a ball
    vec3 fc = mix(alb, alb * vec3(1.5, 1.15, 1.) + vec3(0.03, 0.02, 0.05), hh);
    fc = mix(fc, vec3(0.3, 0.42, 0.22), step(0.88, h31(gi + 11.)));
    alb = mix(alb * 0.18, fc * (0.7 + 0.55 * rr / edge), pet);
    alb = mix(alb, vec3(0.5, 0.52, 0.4), (1. - smoothstep(0.03, 0.07, rr)) * 0.8);
    gloss = 0.3 * pet;
  } else if (kind < 18.5) {                           // pine pad: tufts of needles (colour attribute = pad coordinates, y = the pad's own number; y > 1.5 marks an upright fan card)
    float farK = smoothstep(0.3, 0.9, fwXZ), seed = fract(vC.y);
    float lit = smoothstep(-0.15, 0.3, v.y);          // seen from above the tops are lit; from below they are dark, with light in the needle tips
    float tip = 0.;
    if (vC.y > 1.5) {                                 // fans of needles standing along the pad's ribs: its thickness and bristling outline in side view
      float cu = vC.x * 3.5 + seed * 13.;
      float c1 = floor(cu), c2 = floor(cu + 0.5);
      vec2 f1 = vec2(fract(cu) - 0.5, (vC.z - 0.1 - 0.14 * h11(c1 + 1.3)) * 2.2), f2 = vec2(fract(cu + 0.5) - 0.5, (vC.z - 0.1 - 0.14 * h11(c2 + 7.1)) * 2.2);
      float r1 = length(f1), r2 = length(f2), a1 = atan(f1.x, f1.y + 1e-5), a2 = atan(f2.x, f2.y + 1e-5);
      float R1 = (0.8 + 0.55 * h11(c1 + 5.)) * (0.62 + 0.38 * abs(sin(a1 * 7. + c1))), R2 = (0.8 + 0.55 * h11(c2 + 9.)) * (0.62 + 0.38 * abs(sin(a2 * 7. + c2)));
      float ray1 = max(step(0.42, abs(sin(a1 * 14. + c1 * 3.))), step(r1, 0.22)), ray2 = max(step(0.42, abs(sin(a2 * 14. + c2 * 5.))), step(r2, 0.22));
      float m1 = step(abs(a1), 1.7) * step(r1, R1) * mix(ray1, 1., farK), m2 = step(abs(a2), 1.7) * step(r2, R2) * mix(ray2, 1., farK);
      if (max(m1, m2) * (1. - smoothstep(0.82, 1., abs(vC.x))) < 0.5) discard;
      tip = m1 > 0.5 ? r1 / R1 : r2 / R2;
      alb = uPine * vS.y * (0.5 + 0.75 * tip) * (0.75 + 0.5 * vn3(p * 1.3));
      emis += uPine * uSky * 0.3 * tip;
    } else {
      float rad = length(vC.xz), ang = atan(vC.z, vC.x + 1e-5);
      vec2 tq = p.xz * 0.85, ti = floor(tq), tf = fract(tq) - 0.5;
      float th1 = h21(ti);
      tf -= (vec2(th1, h21(ti + 4.1)) - 0.5) * 0.5;
      float ta = atan(tf.y, tf.x + 1e-5), st1 = 0.3 + 0.3 * abs(sin(ta * 5.5 + th1 * 6.283)), k1 = length(tf) / st1;
      vec2 tq2 = tq + 0.5, ti2 = floor(tq2), tf2 = fract(tq2) - 0.5;
      float th2 = h21(ti2 + 9.);
      tf2 -= (vec2(th2, h21(ti2 + 2.3)) - 0.5) * 0.5;
      float tb = atan(tf2.y, tf2.x + 1e-5), st2 = 0.3 + 0.3 * abs(sin(tb * 5.5 + th2 * 6.283)), k2 = length(tf2) / st2;
      float kk = min(k1, k2), ray = abs(sin((k1 < k2 ? ta : tb) * 10. + (k1 < k2 ? th1 : th2) * 40.));
      // each tuft a solid heart and then separate needles, the sky between them; the pad's outline ragged and spiky
      float cut = mix(0.52 + 0.8 * ray * ray, 3., farK);
      float rimR = 0.62 + 0.36 * abs(sin(ang * 4.5 + seed * 40.)) * (0.62 + 0.38 * sin(ang * 13. + seed * 90.));
      if (rad > rimR + 0.12 * farK || (rad > 0.15 && kk > cut)) discard;
      tip = smoothstep(0.45, 1.1, kk);
      alb = uPine * vS.y * (0.5 + 0.55 * ray * (1. - farK) + 0.3 * farK) * (0.7 + 0.5 * vn3(p * 1.3));
      alb = mix(alb, alb * vec3(1.5, 1.5, 1.1) + uMossRim * 0.05, tip * 0.7);   // fresh tips
      alb *= 1. + 0.5 * smoothstep(0.4, 0.85, rad);
      float br = (1. - smoothstep(0.022, 0.05 + fwXZ * 0.25, abs(sin(ang * 2.5 + seed * 20.)) * rad)) * (1. - smoothstep(0.5, 0.78, rad)) * (1. - farK);
      alb = mix(alb * mix(0.42, 1., lit), vec3(0.1, 0.08, 0.055), br * (1. - lit));          // branchlets under the pad
      emis += uPine * uSky * 0.5 * tip * (1. - lit) * (1. - br);
    }
    vec2 dq = p.xz * 3.6;                                                                   // a drop on a needle tip
    emis += uSky * vec3(0.9, 1., 1.08) * 1.3 * (1. - smoothstep(0.12, 0.3, length(fract(dq) - 0.5))) * step(0.965, h21(floor(dq))) * smoothstep(0.5, 0.9, tip) * (1. - farK);
    gloss = 0.3;
  } else if (kind < 19.5) {                           // koi (colour attribute = body coordinates): white, ink, slate
    float ty = floor(vS.y + 0.5);
    float m = vn3(vC * vec3(1.1, 1.1, 0.7) + ty * 7.3) * 0.75 + vn3(vC * 2.6 + 3. + ty * 5.1) * 0.25;
    float thr = ty < 0.5 ? 0.56 : (ty < 1.5 ? 0.6 : 0.55);
    float pt = smoothstep(thr - 0.02, thr + 0.02, m);
    vec3 white = vec3(0.66, 0.68, 0.64), ink = vec3(0.004, 0.005, 0.007), slate = vec3(0.045, 0.085, 0.19), verm = vec3(0.74, 0.07, 0.016), gold = vec3(0.8, 0.3, 0.03);
    alb = mix(ty < 0.5 ? white : (ty < 1.5 ? ink : gold), ty < 0.5 ? verm : (ty < 1.5 ? slate : white), pt);
    float sc = abs(fract(vC.z * 2.4 + 0.5 * floor(atan(vC.y, vC.x + 1e-5) * 3.)) - 0.5);
    alb *= 0.84 + 0.32 * sc;
    alb = mix(alb, white * 0.9, (1. - smoothstep(-0.5, -0.1, vC.y)) * 0.5);
    gloss = 0.95;
  } else if (kind < 20.5) {                           // cedar boughs: ragged hanging hems, lighter toward the tips
    float ed = vS.y, cn = vn3(p * vec3(0.16, 0.1, 0.16)), cn2 = vn3(p * 0.47);
    if (ed > 0.6 + 0.42 * (cn2 * 0.6 + cn * 0.4)) discard;
    if (p.y > 127. + 30. * vn3(vec3(p.x * 0.045, p.y * 0.1, p.z * 0.045))) discard;       // the tallest lose their tops in the cloud
    alb *= (0.5 + 0.8 * cn) * (0.7 + 0.55 * cn2) * mix(0.5, 1.3, ed) * mix(1., 0.4, back);
    gloss = 0.1; sunK *= 0.2;                           // the ranks stand dark against the seam: the break's light hardly reaches them
  } else if (kind > 26.5) {                           // a far rank of cedars on one long card (colour attribute = metres along, metres up, the rank's number)
    float m = max(spire(vC.x / 14. + vC.z * 17.3, vC.y, vS.y * 0.6, vS.y * 1.36, 14.), spire(vC.x / 19. + vC.z * 31.7 + 0.5, vC.y, vS.y * 0.74, vS.y * 1.62, 19.));
    if (m < 0.5) discard;
    alb = vec3(0.03, 0.075, 0.045) * (0.55 + 0.6 * vn3(vec3(vC.x * 0.21, vC.y * 0.13, vC.z * 9.)));
    gloss = 0.; sunK *= 0.2;
  } else if (kind > 25.5) {                           // the garden's earthen wall, rammed in lifts and streaked by rain, and the tiled cap that sheds water down it
    float sideW = step(abs(n.z), abs(n.x)), al = mix(p.x, p.z, sideW), hh = p.y - (${T.toFixed(1)}), fwA = fwXZ + fwPy, fwL = mix(fwPx, fwPz, sideW);
    if (abs(n.y) > 0.3) {                             // the cap: round cover tiles running down the slope, moss in the valleys, water sliding over them
      float t = al / 1.6, f = fract(t) - 0.5, ft = floor(t), lodC = 1. - smoothstep(0.3, 1., fwL / 1.6);
      float hump = mix(0.56, 1. - smoothstep(0.18, 0.5, abs(f)), lodC), cu = hh * 0.9 + h11(ft);
      alb *= (0.4 + 0.6 * hump) * mix(1., (0.75 + 0.5 * h21(vec2(ft, floor(cu)))) * (0.7 + 0.3 * smoothstep(0., 0.2, fract(cu))), lodC * (1. - smoothstep(0.2, 0.7, fwA)));
      alb = mix(alb, uMoss * 0.42, smoothstep(0.5, 0.7, vn3(p * 0.3)) * 0.5 * (1. - 0.6 * hump));
      gloss = (0.05 + 0.2 * hump) * (0.5 + 1.2 * vn3(vec3(al * 0.8, hh * 1.4 + uTime * 2.4, 3.)));
      float capSn = uSnow * smoothstep(0.3, 0.55, vn3(p * 0.21 + 2.) + 0.25);
      alb = mix(alb, vec3(0.72, 0.77, 0.82), capSn); gloss *= 1. - capSn;
    } else {
      float reach = 24. - hh, wob = vn3(vec3(al * 0.045, hh * 0.05, 3.));
      float lift = hh / 2.7 + (wob - 0.5) * 0.5, li = floor(lift), lfr = fract(lift);
      float tone = 0.7 + 0.56 * h11(li * 1.7 + 3.1 + floor(al / 61. + 0.5) * 0.37);                // each lift its own earth, in formwork bays
      float lam = vn3(vec3(al * 0.22, hh * 2.6, 1.)), nearK = 1. - smoothstep(0.05, 0.3, fwA);
      float grit = mix(0.5, vn3(vec3(al * 2.3, hh * 2.3, 5.)) * 0.6 + vn3(vec3(al * 7., hh * 7., 2.)) * 0.4, nearK);
      float joint = (1. - smoothstep(0.03, 0.1, min(lfr, 1. - lfr))) * (1. - smoothstep(0.25, 0.9, fwA));
      alb *= tone * (0.7 + 0.55 * lam) * (0.75 + 0.5 * grit) * (1. - 0.4 * joint);
      // rain: the band under the eave always wet, dark tongues running down from it, each its own length; a damp green foot
      float c1 = vn3(vec3(al * 0.31, 2., 7.)), c2 = vn3(vec3(al * 1.4, hh * 0.05, 4.));
      float tongue = smoothstep(0.3, 0.6, c1 * 0.62 + c2 * 0.38) * (1. - smoothstep(3. + 20. * c1, 8. + 26. * c1, reach + (c2 - 0.5) * 6.));
      float wet = clamp(max(tongue, (1. - smoothstep(0.5, 4., reach + (c2 - 0.5) * 2.5)) * 0.85), 0., 1.);
      alb *= 1. - 0.62 * wet;
      float foot = 1. - smoothstep(0.5, 6.5, hh + (vn3(vec3(al * 0.13, 1., 2.)) - 0.5) * 5.);
      alb = mix(alb, uMoss * 0.32 * (0.6 + 0.8 * lam), foot * 0.75);
      // the water itself: bright threads sliding down the wet face, and a faint shiver of the whole sheet
      float tc = al / 0.9, tid = floor(tc), tx = fract(tc) - 0.5 - (h11(tid + 3.3) - 0.5) * 0.6, fwT = fwL / 0.9;
      float thread = (1. - smoothstep(0.03, 0.06 + fwT, abs(tx))) * step(0.45, h11(tid + 9.1))
        * smoothstep(0.5, 0.95, fract(hh * 0.11 + uTime * (0.5 + 0.4 * h11(tid)) + h11(tid + 5.) * 7.)) * (1. - smoothstep(0.15, 0.6, fwT));
      emis += uSky * (0.5 * thread + 0.04 * vn3(vec3(al * 0.5, hh * 0.3 + uTime * 1.6, 3.))) * (1. - smoothstep(2., 14., reach)) * (1. - uSnow);
      gloss = 0.05 + 0.45 * wet;
    }
  } else if (kind > 24.5) {                           // feathers: the sky's light comes through a spread wing, so its underside is pale
    thru = 0.9; gloss = 0.12;
  } else if (kind > 23.5) {                           // a flame behind paper: the one warm thing in the rain
    float fl = sin(uTime * 11. + p.x * 3.1) * sin(uTime * 7.3 + p.z * 2.7) * 0.22 + vn3(vec3(p.xy * 1.7, uTime * 3.1)) * 0.3;
    emis = vC * (0.95 + 0.75 * (0.6 + fl)) * mix(1., 0.5, vMr); alb = vec3(0.); gloss = 0.;
  } else if (kind > 22.5) {                           // February: a skin of ice on the pond (colour attribute x = how freely it may form here)
    // sheets with thin broken edges and dark leads between them; grey-blue and half clear, the cloud and cedars lying in it
    float im = vn3(vec3(p.xz * 0.021, 1.)) * 0.58 + vn3(vec3(p.xz * 0.068 + 3., 4.)) * 0.3 + vn3(vec3(p.xz * 0.29, 7.)) * 0.12 + (vC.x - 1.) * 0.6;
    float e2 = im - 0.47 + (vn3(vec3(p.xz * 1.1, 2.)) - 0.5) * 0.045 + (vn3(vec3(p.xz * 3.7, 5.)) - 0.5) * 0.02;
    float lead = abs(vn3(vec3(p.xz * 0.043 + 11., 2.)) - 0.5) - 0.008 - 0.022 * vn3(vec3(p.xz * 0.017, 9.)) + (vn3(vec3(p.xz * 0.9, 8.)) - 0.5) * 0.012;
    if (e2 < 0. || lead < 0.) discard;
    float thk = smoothstep(0., 0.1, e2) * smoothstep(0., 0.03, lead);
    float crack = (1. - smoothstep(0.003, 0.009, abs(vn3(vec3(p.xz * 0.16 + 5., 3.)) - 0.5))) * (1. - smoothstep(0.1, 0.5, fwXZ));
    float dust = smoothstep(0.5, 0.72, vn3(vec3(p.xz * 0.085 + 2., 6.)) * 0.62 + vn3(vec3(p.xz * 0.8, 1.)) * 0.38) * thk;
    alb = mix(vec3(0.045, 0.07, 0.085), vec3(0.3, 0.37, 0.45), thk) * (0.8 + 0.4 * vn3(vec3(p.xz * 0.45, 3.)));
    alb = mix(alb, vec3(0.56, 0.63, 0.71), max(crack * 0.6, dust * 0.8));
    float Fi = 0.05 + 0.95 * pow(1. - ndv0, 3.6);
    emis += gardenEnv(p, reflect(-v, n), vD) * Fi * (1. - 0.75 * dust) * mix(1., 0.72, thk);
    gloss = 0.;
  } else {                                            // fronds and broad leaves
    alb *= (0.72 + 0.5 * vn3(p * 5.)) * mix(1., 0.6, back);
  }
  if ((kind < 10.5 || kind > 11.5) && (kind < 18.5 || kind > 19.5) && kind < 22.5) {   // snow caps (February)
    float snE = n.y + (vn3(p * 0.5) - 0.5) * 0.4, sn = uSnow * ex * smoothstep(0.3, 0.7, snE);
    // on the moss the snow lies in caps with an edge: bare patches and the cushions' sides stay dark and wet
    if (kind > 5.5 && kind < 6.5) sn = uSnow * ex * smoothstep(0.4, 0.58, snE) * mix(1., 0.1 + 0.9 * smoothstep(0.34, 0.5, vn3(p * 0.16 + 4.)), dome) * mossCap;
    alb = mix(alb, vec3(0.74, 0.79, 0.83) * (0.84 + 0.22 * vn3(p * 1.3)) * snowTint * mix(vec3(0.56, 0.68, 0.9), vec3(1.), smoothstep(0.55, 0.97, n.y)), sn); gloss *= 1. - sn; emis *= 1. - sn;
  }
  float up = mix(n.y * 0.5 + 0.5, 0.5 + 0.5 * abs(n.y), thru), inside = 1. - ex;
  vec3 Lg = vec3(clamp(p.x, -50., 50.), 9., 64.) - p;
  float dg = max(length(Lg), 1e-3); Lg /= dg;
  float Eg = 1. / (1. + dg * dg / 2600.);
  float kd = max(dot(n, Lg) * 0.5 + 0.5, 0.); kd *= kd;
  // indoors the timber is left to fall black: the rain light only grazes it, and the sheen below carries the form
  vec3 light = uSky * inside * (Eg * (kd * 1.0 + 0.4 * (1. - up) + 0.05) + 0.016);
  // the hall: its paper side walls glow, and the room holds a little warm light of its own
  float hall = inside * step(-56.7, p.z), wx = 56. - abs(p.x);
  light += uSky * vec3(1.1, 0.98, 0.82) * hall * (uHallK.x * (0.55 + 0.45 * up) + uHallK.y * (0.25 + 0.75 * max(n.x * sign(p.x), 0.)) / (1. + wx * wx / 900.));
  light += uSky * ex * (0.16 + 0.84 * up * up) + uMoss * ex * (1. - up) * 0.33 * dot(uSky, vec3(0.5));
  light += uSun * ex * sunK * (0.22 + 0.78 * max(dot(n, uSunDir), 0.));
  for (int i = 0; i < 5; i++) {                       // lantern flames
    vec3 dl = uLamps[i].xyz - p; float d2l = dot(dl, dl);
    light += uLampCol * uLamps[i].w / (1.7 + d2l * 0.02) * (0.35 + 0.65 * max(dot(n, dl * inversesqrt(d2l + 1e-3)), 0.));
  }
  // the corridor behind the hall: glow of the court-side paper (brighter where the panels stand open) and of the screens ahead
  float inC = step(p.z, -55.5) * inside;
  vec3 L2 = vec3(uCorr.x - p.x, (8. - p.y) * 0.3, 0.);
  float d2 = max(length(L2), 1e-3); L2 /= d2;
  float E2 = inC * uCorr.y * (0.3 + 0.7 * (1. - smoothstep(uCorr.w - 6., uCorr.w + 6., p.z))) * smoothstep(-174., -160., p.z) / (1. + d2 * d2 / 200.);
  float k2 = max(dot(n, L2) * 0.6 + 0.4, 0.);
  float inV = inC * step(p.z, -166.4);                // the vestibule, lit by its own paper windows
  light += uSky * (E2 * (k2 * k2 + 0.03) * 0.22 + inC * uCorr.z * (0.018 + 0.03 * abs(n.x) + 0.05 * max(n.y, 0.)) + inV * uCorr.z * (0.04 + 0.2 * max(n.y, 0.) + 0.09 * abs(n.x)));
  vec3 col = alb * light;
  float f0 = kind > 6.5 && kind < 7.5 ? 0.3 : 0.04;
  float F = f0 + (1. - f0) * pow(clamp(1. - dot(n, v), 0., 1.), 2.1);
  vec3 r = reflect(-v, n);
  float seeO = inside * smoothstep(0.25, 0.95, dot(r, Lg)) * min(Eg * 3., 1.);
  float seeS = ex * smoothstep(-0.15, 0.45, r.y);
  float seeC = E2 * 2.2 * smoothstep(0.35, 0.95, dot(r, L2));
  // the gap ahead lies along the polished boards as a streak of its own colour; edges turned to it take a pearl rim
  float gapK = exp(-p.x * p.x / 5.), seeG = inC * uCorr.z * smoothstep(0.8, 0.995, r.z) * mix(0.3, 1.5, gapK)
    * (0.5 + 1.0 * vn3(vec3(p.x * 1.7, p.z * 0.2 - uTime * 1.2, uTime * 0.8)));     // the gap's light shivers on the boards as the rain crosses it
  col += gloss * F * (uSky * (seeO * mix(0.9, 0.42, hall) * mix(vec3(1.), vec3(1.12, 0.96, 0.74), hall) + seeS * 0.7 * mix(1., 0.15, 1. - glintK) * skyGl + seeC) + mix(uSky, uGap, gapK * 0.85) * seeG * 0.8) + uSky * gloss * inC * uCorr.z * 0.16 * pow(1. - ndv0, 4.) + emis;
  float sg = max(dot(r, uSunDir), 0.); sg *= sg; sg *= sg;
  col += uSun * sunK * gloss * sg * sg * 1.3 * glintK;                                 // wet things glint where the light comes down
  // lacquer gives back the garden, and only a ghost of the room: the ceiling's double fades with distance from the opening
  col *= mix(1., mix(0.86, 0.4 * mix(1., 0.16 + 0.84 * smoothstep(-36., 38., p.z), smoothstep(13., 21., p.y)), inside), vMr);
  float mw = vS.w < -1.5 ? -2. - vS.w : vS.w;          // (a value below -1.5 is the coded weight, -2.1 to -2.6, of a thing deeper in the mist: see MW)
  float md = uMist * vD * ((kind > 19.5 && kind < 20.5) || kind > 25.5 ? 1. + clamp(mw, -0.9, 0.6) : 1.);     // the near rank of cedars stands dark out of the mist; the woods behind lie deeper in it
  col = mix(col, uMistCol, 1. - exp(-md * md));
  col = mix(col, uMistCol * 1.06, step(26.5, kind) * clamp(mw, 0., 0.6) * 1.25);      // the woods behind the near rank pale into the mist's own colour
  col = mix(col, mix(uMistCol, uStrata, 0.4 + 0.55 * smoothstep(52., 100., p.y)), smoothstep(60., 128., p.y) * 0.88 * step(0.5, ex));          // tall things lose their tops in the dark deck
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`;function Ct(h){return Object.assign(a.UniformsUtils.merge([a.UniformsLib.fog]),h)}const So=`
uniform mat4 uMirInv; uniform vec4 uMirWet;
varying vec4 vMirP;
`,Mo=`
  {
    float mrW = gl_Position.w;
    vec3 mrV = vec3((gl_Position.x + projectionMatrix[2][0] * mrW) / projectionMatrix[0][0], (gl_Position.y + projectionMatrix[2][1] * mrW) / projectionMatrix[1][1], -mrW);
    vec3 mrL = (uMirInv * vec4((mrV - viewMatrix[3].xyz) * mat3(viewMatrix), 1.)).xyz;
    float mrOn = determinant(mat3(modelMatrix)) < 0. ? 1. : 0.;
    vMirP = vec4(mrL, mrOn);
    if (mrOn > 0.5) {
      vec3 mrC = (uMirInv * vec4(cameraPosition, 1.)).xyz;
      float mrT = mrC.y / max(mrC.y - mrL.y, 1e-3);
      vec2 mrH = mix(mrC.xz, mrL.xz, clamp(mrT, 0., 1.));
      float mrK = smoothstep(uMirWet.x, uMirWet.y, mrH.y) * uMirWet.z * mrW;
      gl_Position.x += sin(mrH.x * 1.9 + mrH.y * 0.7 + uMirWet.w * 2.3) * mrK;
      gl_Position.y += sin(mrH.x * 1.3 - uMirWet.w * 1.7) * mrK * 1.6;
    }
  }
`,zo=`
uniform mat4 uMirInv; uniform vec4 uMirRect;
varying vec4 vMirP;
`,ko=`
  if (vMirP.w > 0.5) {
    if (vMirP.y > -0.01) discard;
    vec3 mrC = (uMirInv * vec4(cameraPosition, 1.)).xyz;
    if (mrC.y < 0.01) discard;
    vec2 mrH = mix(mrC.xz, vMirP.xz, mrC.y / max(mrC.y - vMirP.y, 1e-4));
    if (mrH.x < uMirRect.x || mrH.y < uMirRect.y || mrH.x > uMirRect.z || mrH.y > uMirRect.w) discard;
  } else if (vMirP.y < -0.01) {
    vec3 mrC = (uMirInv * vec4(cameraPosition, 1.)).xyz;
    if (mrC.y > 0.01) {
      vec2 mrH = mix(mrC.xz, vMirP.xz, mrC.y / max(mrC.y - vMirP.y, 1e-4));
      if (mrH.x > uMirRect.x - 0.08 && mrH.y > uMirRect.y - 0.08 && mrH.x < uMirRect.z + 0.08 && mrH.y < uMirRect.w + 0.08) discard;
    }
  }
`;function R0(h,w){if(!h||h.userData.mossMirror)return h;h.userData.mossMirror=!0;const n=h.onBeforeCompile,z=Object.prototype.hasOwnProperty.call(h,"customProgramCacheKey"),y=h.customProgramCacheKey,B=n?n.toString():"";return h.onBeforeCompile=function(L,F){n&&n.call(this,L,F),L.uniforms.uMirInv=w.uMirInv,L.uniforms.uMirRect=w.uMirRect,L.uniforms.uMirWet=w.uMirWet;const x=L.vertexShader,oe=x.lastIndexOf("}");L.vertexShader=So+x.slice(0,oe)+Mo+x.slice(oe),L.fragmentShader=zo+L.fragmentShader.replace(/void\s+main\s*\(\s*(void)?\s*\)\s*\{/,I=>I+ko)},h.customProgramCacheKey=function(){return(z?y.call(this):B)+"|mossMirror"},h.needsUpdate=!0,h}const j0=`
uniform mat4 uInv; varying vec3 vP, vV;
#include <fog_pars_vertex>
void main(){
  vP = position; vV = (uInv * vec4(cameraPosition, 1.)).xyz - position;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Po=`
uniform float uTime; varying vec3 vP, vV;
${st}
${_0}
void main(){
  vec3 v = normalize(vV + vec3(0., 1e-5, 0.));
  gl_FragColor = vec4(rainSky(vec3(-v.x, abs(v.y), -v.z)), 1.);
}`,Co=`
uniform vec3 uSky, uLacquer, uLeafCol, uLeafCol2, uStreak, uLampP, uLampCol; uniform float uTime, uLeafK, uRing;
varying vec3 vP, vV;
#include <fog_pars_fragment>
${st}
void main(){
  vec3 v = normalize(vV + vec3(0., 1e-5, 0.));
  float fr = pow(1. - clamp(v.y, 0., 1.), 2.4);
  float a = mix(0.86, 0.15, fr);
  // boards: along z in the hall, along x on the veranda
  float ver = step(40., vP.z);
  vec2 bq = mix(vec2(vP.x / 2.4, vP.z), vec2(vP.z / 2., vP.x), ver);
  float id = floor(bq.x), fx = fract(bq.x), wx = fwidth(bq.x);
  float bz = (bq.y + h11(id) * 30.) / 30., fz = fract(bz), wz = fwidth(bz);
  float seam = (1. - smoothstep(0., wx * 1.2 + 0.006, min(fx, 1. - fx))) * (1. - smoothstep(0.06, 0.25, wx));
  seam = max(seam, (1. - smoothstep(0., wz * 1.2 + 0.0005, min(fz, 1. - fz))) * (1. - smoothstep(0.004, 0.02, wz)));
  float sill = 1. - smoothstep(0.12, 0.22, abs(abs(vP.z - 40.) - 0.55));
  float bt = h21(vec2(id, floor(bz)));
  float haze = vn3(vec3(vP.xz * 0.07, 1.));
  // ring film where blown rain wets the outer edge
  float zone = smoothstep(46., 55.5, vP.z) * uRing;
  vec2 rq = vP.xz / 2.6, rid = floor(rq);
  vec2 rf = fract(rq) - 0.5 - (vec2(h21(rid), h21(rid + 4.4)) - 0.5) * 0.6;
  float rph = fract(uTime * 0.7 + h21(rid + 1.9));
  float ring = (1. - smoothstep(0., 0.1, abs(length(rf) * 2.6 - rph * 1.2))) * (1. - rph) * zone * step(0.5, h21(rid + 6.));
  // stuck leaves
  vec2 lq = vP.xz / 7., lid = floor(lq), lf = fract(lq) - 0.5;
  float lh = h21(lid + 17.);
  lf -= (vec2(h21(lid + 2.1), h21(lid + 8.7)) - 0.5) * 0.7;
  float la = atan(lf.y, lf.x + 1e-5) + lh * 6.283, lr = length(lf) * 7., lw = fwidth(vP.x) + fwidth(vP.z);
  float ledge = 0.13 + 0.42 * pow(abs(cos(la * 2.5)), 2.2);
  float leaf = (1. - smoothstep(ledge - lw - 1e-4, ledge + lw + 1e-4, lr)) * step(lh, uLeafK * mix(0.03, 0.3, smoothstep(-30., 56., vP.z)));
  float gl = 1. / (1. + (64. - vP.z) * (64. - vP.z) / 2600.);
  vec3 lac = uLacquer * (0.6 + 0.8 * bt) * uSky * 7.5 * (0.3 + 0.7 * gl);
  a = clamp(a + (bt - 0.5) * 0.06 + zone * 0.1 * haze + ring * 0.45, 0.1, 1.);
  a = mix(a, 0.96, max(seam * 0.7, sill * 0.9));
  vec3 col = lac + uSky * (0.008 + 0.03 * haze) * fr * gl / a + uSky * ring * 0.26;
  // The lacquer is polished, not perfect: beyond where it mirrors the opening exactly, the garden's light still lies along it
  // as a long soft streak running toward us, cut by the shadows of the posts and shivering with the rain
  vec3 rr = vec3(-v.x, v.y, -v.z);
  float tz = (56. - vP.z) / max(rr.z, 0.02), yh = rr.y * tz, xh = vP.x + rr.x * tz, over = max(yh - 15., 0.);
  float post = abs(fract((xh - 8.) / 16. + 0.5) - 0.5) * 16.;
  float strk = exp(-over / 30.) * smoothstep(0., 9., over) * step(0.02, rr.z) * (1. - smoothstep(48., 57., abs(xh))) * (0.3 + 0.7 * smoothstep(0.7, 3.2, post))
    * (0.5 + 0.8 * vn3(vec3(xh * 0.12, vP.z * 0.05, 2. + uTime * 0.07))) * (0.8 + 0.4 * vn3(vec3(vP.x * 1.3, vP.z * 0.11 - uTime * 0.4, 5.))) * (1. - ver);
  // and the paper lamp lays a warm glint from its double toward us
  vec3 camL = vP + vV;
  vec2 Lh = uLampP.xz - camL.xz, Ph = vP.xz - camL.xz;
  float dL = max(length(Lh), 1e-3); vec2 dl = Lh / dL;
  float da = dot(Ph, dl) - dL * camL.y / max(camL.y + uLampP.y, 1e-3), pe = Ph.x * dl.y - Ph.y * dl.x, gw = 0.5 + 0.04 * abs(da);
  float glint = exp(-pe * pe / (gw * gw)) * exp(-abs(da) / mix(15., 4., step(0., da))) * step(0.01, camL.y) * (0.75 + 0.5 * vn3(vec3(vP.xz * 0.8, uTime * 2.1)));
  col += (uStreak * strk + uLampCol * glint * 0.65) / a;
  col = mix(col, mix(uLeafCol, uLeafCol2, fract(lh * 37.)) * uSky * (0.12 + 0.5 * gl) + uSky * 0.05 * fr, leaf);
  a = mix(a, 1., leaf);
  gl_FragColor = vec4(col, a);
  #include <fog_fragment>
}`,Ao=`
uniform float uTime; varying vec3 vP;
${st}
${_0}
void main(){
  vec3 d = normalize(vP + vec3(0., 1e-3, 0.));
  vec3 c = rainSky(d);
  c = mix(uHor * 0.92, c, smoothstep(-0.06, 0.03, d.y));
  gl_FragColor = vec4(c, 1.);
}`,Oo=`
attribute vec3 color; attribute vec3 aCard;
uniform float uTime;
varying vec2 vUv; varying vec3 vC, vLP; varying float vD, vSeed, vUp, vCells;
#include <fog_pars_vertex>
void main(){
  vec3 p = position;
  vLP = position;
  float ph = aCard.y, t = fract(uTime * 0.21 + ph);
  float dip = sin(t * 24.) * exp(-t * 7.) * 0.9;
  p.y += (sin(uTime * 1.1 + ph * 6.3) * 0.34 - dip) * aCard.x;
  p.x += sin(uTime * 0.8 + ph * 9.) * 0.26 * aCard.x;
  vUv = uv; vC = color; vSeed = aCard.z; vUp = normal.y; vCells = normal.x;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  vD = -mvPosition.z;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,To=`
uniform vec3 uSky, uMistCol, uSun; uniform float uMist;
varying vec2 vUv; varying vec3 vC, vLP; varying float vD, vSeed, vUp, vCells;
#include <fog_pars_fragment>
${st}
${Gt}
vec2 leafCell(vec2 g, float seed){
  vec2 id = floor(g), f = fract(g) - 0.5;
  float hh = h21(id + seed);
  f -= (vec2(h21(id + seed + 1.3), h21(id + seed + 7.1)) - 0.5) * 0.4;
  float ang = atan(f.y, f.x + 1e-5) + hh * 6.283;
  return vec2(step(length(f), 0.2 + 0.3 * pow(abs(cos(ang * 2.5)), 0.7)) * step(0.16, hh), hh);
}
void main(){
  vec2 g = vUv * vCells;
  float lod = smoothstep(0.1, 0.3, sqrt(length(dFdx(g)) * length(dFdy(g))));
  vec2 l1 = leafCell(g, vSeed), l2 = leafCell(g + 0.5, vSeed + 31.);
  float blob = vn3(vec3(vUv * 4. + vSeed, 1.)) * 0.6 + vn3(vec3(vUv * 13. + vSeed, 5.)) * 0.4, hh = mix(l1.x > 0.5 ? l1.y : l2.y, 0.3 + 0.5 * blob, lod);
  float rim = length(vUv - 0.5) * 2. + (vn3(vec3(vUv * 5. + vSeed, 3.)) - 0.5) * 0.6 + (vn3(vec3(vUv * 19. + vSeed, 7.)) - 0.5) * 0.3;
  if (mix(max(l1.x, l2.x), step(0.4, blob), lod) < 0.5 || rim > 0.92) discard;
  vec3 col = vC * (0.5 + 0.9 * hh) * uSky * (0.72 + 0.4 * abs(vUp));
  float sunK = sunPool(vLP.xz - uSunA.xy * (vLP.y - (${T.toFixed(1)})));
  col += vC * (0.45 + 0.75 * hh) * uSun * sunK * vec3(1.15, 1.05, 0.7);              // a leaf with the light behind it is lit from inside
  float md = uMist * vD;
  col = mix(col, uMistCol, 1. - exp(-md * md));
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,Lo=`
attribute vec4 aO, aQ; attribute vec2 aK;
uniform float uTime, uViewH;
varying vec2 vQ; varying vec3 vK; varying float vSunK;
#include <fog_pars_vertex>
${st}
${Gt}
void main(){
  float t = fract(uTime * aQ.x + aQ.y);
  float bead = step(0.5, aK.y) * (1. - step(1.5, aK.y)), flake = step(1.5, aK.y);
  vec3 c = aO.xyz - vec3(0., aO.w * mix(t, t * t, bead), 0.);
  c.x += sin(uTime * 0.8 + aQ.y * 40.) * 1.4 * flake; c.z += cos(uTime * 0.6 + aQ.y * 23.) * 1.1 * flake;
  float len = aQ.w * mix(1., 0.55 + 1.3 * t, bead);
  vec4 mvPosition = viewMatrix * (modelMatrix * vec4(c, 1.));
  vec3 upv = normalize(mat3(viewMatrix) * (modelMatrix * vec4(0., 1., 0., 0.)).xyz);
  vec2 sd = normalize(vec2(upv.y, -upv.x) + vec2(1e-5, 0.));
  mvPosition.xyz += upv * (position.y * len);
  vec4 cp = projectionMatrix * mvPosition;
  // never fat: at least 1.5 px, at most a couple of pixels for rain (more for beads and flakes), and the nearest fade out
  float px = cp.w / max(uViewH * 0.5 * projectionMatrix[1][1], 1.);
  float w = min(max(aQ.z, 1.5 * px), mix(2.1, mix(6., 11., flake), max(bead, flake)) * px);
  float nearK = smoothstep(mix(6., 2.5, max(bead, flake)), mix(20., 8., max(bead, flake)), cp.w);
  cp.xy += sd * vec2(projectionMatrix[0][0], projectionMatrix[1][1]) * (position.x * w);
  gl_Position = cp;
  vQ = vec2(position.x, position.y + 0.5);
  vSunK = sunPool(c.xz - uSunA.xy * (c.y - (${T.toFixed(1)})));
  vK = vec3(aK.x * min(aQ.z / w, 1.) * nearK * smoothstep(0., 0.04, t) * (1. - smoothstep(0.96, 1., t)), bead, flake);
  #include <fog_vertex>
}`,Fo=`
uniform vec3 uSky, uSun;
varying vec2 vQ; varying vec3 vK; varying float vSunK;
#include <fog_pars_fragment>
void main(){
  float ac = 1. - vQ.x * vQ.x * 4.;
  float al = mix(sin(clamp(vQ.y, 0., 1.) * 3.14159), (1. - smoothstep(0.6, 1., vQ.y)) * (0.07 + 0.93 * (1. - smoothstep(0.1, 0.38, vQ.y))) * smoothstep(0., 0.06, vQ.y), vK.y);
  float rr = length(vec2(vQ.x * 2., vQ.y * 2. - 1.));
  float a = mix(clamp(ac, 0., 1.) * clamp(al, 0., 1.), 1. - smoothstep(0.2, 1., rr), vK.z) * vK.x;
  gl_FragColor = vec4(uSky * (mix(0.98, 2.4, vK.y) + 0.45 * vK.z) + uSun * vSunK * 1.5, clamp(a * mix(0.42, 0.9, max(vK.y, vK.z)) * (1. + 0.9 * vSunK), 0., 1.));
  #include <fog_fragment>
}`,Do=`
varying vec3 vP; varying float vD;
void main(){
  vP = position;
  vec4 mv = modelViewMatrix * vec4(position, 1.);
  vD = -mv.z;
  gl_Position = projectionMatrix * mv;
}`,Ko=`
uniform vec3 uSun; uniform float uTime, uShaft;
varying vec3 vP; varying float vD;
${st}
${Gt}
void main(){
  float h = vP.y - (${T.toFixed(1)});
  vec2 foot = vP.xz - uSunA.xy * h;
  float k = sunPool(foot);
  // the light comes down in separate rays: fine streaks that keep their place along the slant, shivering as the rain crosses them
  float ray = vn3(vec3(foot * 0.21, uTime * 0.12)) * 0.6 + vn3(vec3(foot * 0.67 + 9., uTime * 0.22)) * 0.4;
  float a = k * (0.25 + 1.5 * smoothstep(0.35, 0.75, ray)) * smoothstep(0., 9., h) * (1. - smoothstep(48., 100., h)) * (0.6 + 0.4 * smoothstep(0., 60., h));
  a *= smoothstep(7., 30., vD) * (1. - smoothstep(330., 560., vD)) * uShaft;
  gl_FragColor = vec4(uSun * a, 1.);
}`,Vo=`
attribute float aIdx;
uniform mat4 uInv; uniform vec4 uSunA, uSunP[6];
varying vec4 vB; varying float vD;
void main(){
  vec4 sp = aIdx < 0.5 ? uSunP[0] : (aIdx < 1.5 ? uSunP[1] : (aIdx < 2.5 ? uSunP[2] : (aIdx < 3.5 ? uSunP[3] : (aIdx < 4.5 ? uSunP[4] : uSunP[5]))));
  float mir = determinant(mat3(modelMatrix)) < 0. ? -1. : 1.;
  vec3 camL = (uInv * vec4(cameraPosition, 1.)).xyz; camL.y *= mir;
  vec3 ax = normalize(vec3(uSunA.x, 1., uSunA.y));
  vec3 c = vec3(sp.x, ${T.toFixed(1)}, sp.y) + ax * (position.y * 132.);
  vec3 sd = cross(ax, camL - c);
  sd /= max(length(sd), 1e-3);
  vec4 mv = modelViewMatrix * vec4(c + sd * (position.x * sp.z * 0.62), 1.);
  vD = -mv.z;
  vB = vec4(position.x, position.y, sp.w * step(-9000., sp.y), aIdx);
  gl_Position = projectionMatrix * mv;
}`,Eo=`
uniform vec3 uSun; uniform float uTime, uBeam;
varying vec4 vB; varying float vD;
${st}
void main(){
  float x = vB.x, t = vB.y;
  float g = exp(-x * x * 3.4) * (1. - smoothstep(0.72, 1., abs(x)));
  float ray = vn3(vec3(x * 5. + vB.w * 17.3, uTime * 0.11, 1.)) * 0.6 + vn3(vec3(x * 13. + vB.w * 5.1, uTime * 0.19, 5.)) * 0.4;
  float a = g * (0.45 + 1.15 * smoothstep(0.3, 0.72, ray)) * smoothstep(0., 0.05, t) * (1. - smoothstep(0.3, 0.85, t)) * (0.5 + 0.5 * smoothstep(0., 0.28, t));
  a *= smoothstep(9., 36., vD) * (1. - smoothstep(380., 620., vD)) * vB.z * uBeam;
  gl_FragColor = vec4(uSun * a, 1.);
}`,Bo=`
uniform float uTime, uViewH; uniform vec3 uBase;
varying vec3 vQ;
void main(){
  float t = position.y, s = position.x, w1 = t * t;
  vec3 c = uBase + vec3(0., t * 15., 0.);
  c.x += sin(t * 5. - uTime * 0.7) * 0.9 * w1 + sin(t * 13. - uTime * 1.3) * 0.5 * w1 * t;
  c.z += cos(t * 4.3 - uTime * 0.6) * 0.8 * w1 + sin(t * 9. - uTime * 1.1 + 2.) * 0.5 * w1 * t + 1.5 * w1;
  vec4 mv = modelViewMatrix * vec4(c, 1.);
  float hw = mix(0.05, 0.8, w1);
  float w = max(hw, 1.6 * (-mv.z) / max(uViewH * 0.5 * projectionMatrix[1][1], 1.));
  mv.x += s * w;
  vQ = vec3(s, t, hw / w);
  gl_Position = projectionMatrix * mv;
}`,Wo=`
uniform vec3 uSky; varying vec3 vQ;
void main(){
  float a = (1. - vQ.x * vQ.x) * pow(1. - clamp(vQ.y, 0., 1.), 1.3) * smoothstep(0., 0.03, vQ.y) * 0.55 * vQ.z;
  gl_FragColor = vec4(uSky * 0.9, clamp(a, 0., 1.));
}`,Io=`
attribute vec3 color; attribute vec4 surf; attribute float aPhase;
uniform float uTime, uFlap;
varying vec3 vC, vN;
#include <fog_pars_vertex>
void main(){
  vec3 p = position;
  float a = (sin(uTime * 17. + aPhase) * 0.75 + 0.12) * uFlap;
  p.y += abs(p.x) * sin(a) * surf.w; p.x *= mix(1., cos(a), surf.w) * mix(1., mix(0.2, 1., uFlap), step(0.001, surf.w));
  vC = color; vN = mat3(instanceMatrix) * normal;
  vec4 mvPosition = modelViewMatrix * (instanceMatrix * vec4(p, 1.));
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,qo=`
uniform vec3 uSky; varying vec3 vC, vN;
#include <fog_pars_fragment>
void main(){
  vec3 n = normalize(vN + vec3(0., 1e-5, 0.));
  gl_FragColor = vec4(vC * uSky * (0.4 + 0.6 * (n.y * 0.5 + 0.5)), 1.);
  #include <fog_fragment>
}`;async function Xo(h,w={}){let n=h.rng.fork?h.rng.fork("mirror-hall"):h.rng;const z=h.quality?.detail??1,y=(w.palette&&w.palette.length>=7?w.palette:wo).map(P),B=n(),L=w.season||(B<.5?"june":B<.76?"november":"february"),F=w.hour||(h.vary&&h.vary.hour&&h.vary.hour!=="any"?h.vary.hour:"day"),x=w.side===-1||w.side===1?w.side:n.sign(),oe=ee(w.rain??n.range(.65,1.3),.3,1.6),I=w.garden!==!1,ae=w.sky!==!1,Pe=w.rainField!==!1,R=L==="february"?1:0,j=y[5],fe={day:[j.clone().multiplyScalar(1.02),te(j,P("#a3b7b6"),.65).multiplyScalar(.8)],dawn:[te(j,P("#8fa9d4"),.5).multiplyScalar(.8),te(j,P("#9fb4c4"),.7).multiplyScalar(.7)],golden:[te(j,P("#ece4c6"),.45).multiplyScalar(.98),te(j,P("#b4bea4"),.6).multiplyScalar(.72)],night:[P("#667a9c").multiplyScalar(.36),P("#52668a").multiplyScalar(.3)]}[F]||null,H=fe?fe[0]:j.clone(),Z=fe?fe[1]:j.clone().multiplyScalar(.85);L==="february"&&(H.lerp(P("#d5dde6"),.3),Z.lerp(P("#6f7f96"),.42)),L==="november"&&(H.multiplyScalar(.94),Z.lerp(P("#b0b4a8"),.3));const g={uTime:{value:0},uInv:{value:new a.Matrix4},uSky:{value:H.clone()},uZen:{value:H},uHor:{value:Z},uMistCol:{value:Z.clone()},uMist:{value:w.mist??(ae?.0032:0)},uSnow:{value:R},uMoss:{value:L==="february"?te(y[3],P("#5f7a52"),.5):y[3].clone()},uMossRim:{value:y[4].clone()},uViewH:{value:450},uCorr:{value:new a.Vector4(0,0,0,-400)},uFlap:{value:1},uShade:{value:null},uPatch:{value:new a.Vector4(0,0,0,0)},uPond:{value:new a.Vector4(x,w.pondScene?1:0,0,0)},uPine:{value:te(y[2],y[3],.4).multiplyScalar(1.5)},uGap:{value:H.clone()}},V=new a.Vector3(-.5*x,1,.45).normalize(),q=(H.r+H.g+H.b)/3*1.15,$={day:["#fff3da",.9,1,[1,.96,.55]],dawn:["#dfe9ff",.8,.85,[.8,1,.4]],golden:["#ffe6b4",1.1,1.15,[1.2,1.12,.6]],night:["#9db4ff",.5,.6,[.55,.9,.3]]}[F]||["#fff3da",.9,1,[1,.92,.55]];Object.assign(g,{uSunDir:{value:V},uSunA:{value:new a.Vector4(V.x/V.y,V.z/V.y,$[2],0)},uSunP:{value:[0,1,2,3,4,5].map(()=>new a.Vector4(0,-9999,1,0))},uSun:{value:P($[0]).multiplyScalar(q*$[1]*1.6)},uSeam:{value:P($[0]).multiplyScalar(q*1.02)},uStrata:{value:te(Z,P("#3f5482"),.84).multiplyScalar(.8)},uSkyK:{value:new a.Vector4($[3][0],$[3][1],$[3][2],x)},uLamps:{value:[0,1,2,3,4].map(()=>new a.Vector4(0,-9999,0,0))},uLampCol:{value:P("#ffb662").multiplyScalar(F==="night"?.8:1.25)},uHallK:{value:new a.Vector3(F==="night"?.035:.075,F==="night"?.34:.5,0)},uShaft:{value:.035},uBeam:{value:.2}});const U={uMirInv:g.uInv,uMirRect:{value:new a.Vector4(-se+.03,N+.03,se-.03,Ne-.03)},uMirWet:{value:new a.Vector4(46,56,.0035,0)}},re=(...e)=>{const t={};for(const o of e)t[o]=g[o];return t};await h.yield();const Ee=new a.Group;Ee.name="mirror-hall";const me=new a.ShaderMaterial({uniforms:Ct(re("uTime","uInv","uSky","uMistCol","uMist","uSnow","uMoss","uMossRim","uCorr","uPond","uPine","uGap","uShade","uSun","uSunDir","uSunA","uSunP","uSeam","uStrata","uLamps","uLampCol","uHallK","uPatch")),vertexShader:xo,fragmentShader:bo,fog:!0,side:a.DoubleSide}),K=te(y[0],P("#7d5632"),.8),$e=te(y[0],P("#8c6439"),.82),We=te(y[0],P("#4b3421"),.7),At=P("#6e563a"),Qe=P("#aab2ab"),Ue=P("#5a605a"),Ce=P("#2e3539"),Ie=P("#6a5f45"),ft=P("#7d837f"),Ot=L==="november"?P("#b8281c"):y[6].clone(),ne=(e=.8,t=1.2)=>n.range(e,t),b=gt(68e3),W=gt(66e3);await h.yield();for(const e of[-1,1]){for(let t=0;t<7;t++)b.add(D(1.8,Je,1.8,.2),u(e*se,Je/2,N+t*16),K,[f.WOODY,.6,0],{jit:ne()});b.add(D(1.2,.7,96,.1),u(e*(se-.2),.36,-8),K,[f.WOODZ,.6,0]),b.add(D(1.5,1.4,96,.15),u(e*(se-.1),18.7,-8),K,[f.WOODZ,.6,0]),b.add(D(1.5,1.4,96,.15),u(e*(se-.1),25.2,-8),K,[f.WOODZ,.5,0]),b.add(X(.3,5.2,96),u(e*(se+.3),22,-8),Qe,[f.PLASTER,.04,0]);for(let t=0;t<12;t++)b.add(X(.5,5.1,.5),u(e*(se+.05),21.95,N+4+t*8),K,[f.WOODY,.5,0]);await h.yield();for(let t=0;t<12;t++){const o=N+t*8,r=(e<0?0:12)+t;b.add(new a.PlaneGeometry(8,17.3,2,2),u(e*(se-.45),.7+8.65,o+4,0,-e*le/2,0),K,[f.PAPER,.05,0],{fn:(s,i,c,v,d,l)=>{l[s*3]=ee((v-o)/8,0,1),l[s*3+1]=ee((c-.7)/17.3,0,1),l[s*3+2]=r/32}})}W.add(X(.4,25,97),u(e*(se+.7),7.5,-8),Qe,[f.PLASTER,.04,.6],{grad:[-5,20,.75,1]});for(let t=0;t<7;t++)W.add(D(1.2,25,1.9,.15),u(e*(se+.75),7.5,N+t*16),K,[f.WOODY,.5,.6]);await h.yield()}for(const e of[-40,-24,-8,8,24,40])b.add(D(1.8,Je,1.8,.2),u(e,Je/2,N),K,[f.WOODY,.6,0],{jit:ne()});b.add(D(112,1.4,1.5,.15),u(0,18.7,N+.1),K,[f.WOODX,.6,0]),b.add(D(112,1.4,1.5,.15),u(0,25.2,N+.1),K,[f.WOODX,.5,0]),b.add(X(112,5.2,.3),u(0,22,N-.3),Qe,[f.PLASTER,.04,0]);const mt=!!w.backOpen;for(const e of[-56,-40,-24,8,24,40])if(!(mt&&(e===-24||e===8))){b.add(X(14.4,18,.5),u(e+8,9,N-.25),$e,[f.WOODY,.35,0],{jit:ne(.75,1.15)});for(let t=1;t<4;t++)b.add(D(.4,18,.3,.06),u(e+.9+t*3.55,9,N+.12),K,[f.WOODY,.5,0]);b.add(D(14.4,.7,.9,.1),u(e+8,.36,N+.2),K,[f.WOODX,.6,0]),b.add(D(14.4,.5,.5,.08),u(e+8,9.2,N+.15),K,[f.WOODX,.5,0])}const Fe=mt?32:48;W.add(X(Fe,25,.4),u(-56+Fe/2,7.5,N-.75),Qe,[f.PLASTER,.04,.6],{grad:[-5,20,.75,1]}),W.add(X(Fe,25,.4),u(56-Fe/2,7.5,N-.75),Qe,[f.PLASTER,.04,.6],{grad:[-5,20,.75,1]}),W.add(X(mt?48:16,2,.4),u(0,19,N-.75),Qe,[f.PLASTER,.04,.6]),mt&&(b.add(D(48,1.3,1.5,.15),u(0,14.65,N),K,[f.WOODX,.7,.1]),b.add(D(46.4,.16,.9,.05),u(0,.05,N),We,[f.WOODX,.8,.1]));for(const e of s0)W.add(D(1.9,25,1.2,.15),u(e,7.5,N-.8),K,[f.WOODY,.5,.6]);if(w.doorScreens!==!1){for(let e=0;e<2;e++){const t=-8+e*8;b.add(new a.PlaneGeometry(8,17.3,2,2),u(t+4,.7+8.65,N-.5),K,[f.PAPERLIT,.05,0],{fn:(o,r,s,i,c,v)=>{v[o*3]=ee((r-t)/8,0,1),v[o*3+1]=ee((s-.7)/17.3,0,1),v[o*3+2]=(24+e)/32}})}b.add(D(16,.7,.9,.1),u(0,.36,N-.5),K,[f.WOODX,.6,0])}await h.yield(),b.add(X(112,.4,96),u(0,Je+.5,-8),At,[f.WOODX,.2,0]);for(let e=0;e<7;e++)b.add(D(112,1.6,1.4,.16),u(0,Je-.6,N+e*16),K,[f.WOODX,.55,0],{jit:ne(.85,1.15)});for(const e of[-40,-24,-8,8,24,40])b.add(D(1.4,1.4,96,.16),u(e,Je-.5,-8),K,[f.WOODZ,.55,0],{jit:ne(.85,1.15)});for(let e=0;e<24;e++)e%4!==0&&b.add(X(112,.4,.4),u(0,Je+.12,N+e*4),K,[f.WOODX,.45,0]);for(let e=1;e<28;e++)e%4!==2&&b.add(X(.4,.4,96),u(-se+e*4,Je+.12,-8),K,[f.WOODZ,.45,0]);await h.yield(),b.add(D(113,2,1.7,.22),u(0,21.2,Wt),K,[f.WOODX,.7,.05]),b.add(D(113,1.2,1.5,.15),u(0,25.4,Wt),K,[f.WOODX,.5,.05]),b.add(X(112,.3,.35),u(0,23.6,Wt),K,[f.WOODX,.5,.05]);for(let e=0;e<69;e++)b.add(X(.32,2.6,.32),u(-54.4+e*1.6,23.5,Wt),K,[f.WOODY,.5,.05]);await h.yield();const et=[[0,0],[1.2,0],[1.2,.5],[1.06,.64],[1,.85],[1,10],[.97,16],[.93,19.3],[1.03,19.45],[1.03,19.6],[0,19.6]];for(const e of s0){const t=ne(.85,1.15);b.add(Ze(et,16),u(e,0,55,0,n()*6.28,0),K,[f.WOODY,.8,.12],{jit:t,fn:(o,r,s,i,c,v,d)=>{s<.63&&(v[o*3]=Ie.r,v[o*3+1]=Ie.g,v[o*3+2]=Ie.b,d[o*4]=f.METAL,d[o*4+1]=.6)}}),b.add(D(2.7,.9,2.7,.2),u(e,20.05,55),K,[f.WOODX,.6,.1]),b.add(D(6.5,.8,1.3,.18),u(e,20.9,55),K,[f.WOODX,.6,.1]),b.add(D(1,1.2,15,.15),u(e,20.9,47.5),K,[f.WOODZ,.6,.08]),await h.yield()}b.add(D(136,1.9,1.5,.2),u(0,22.25,55),K,[f.WOODX,.65,.12]);const De=Math.atan(.25);for(let e=0;e<69;e++)b.add(X(.6,.8,30.9),u(-ie+e*2,24.15,53,De,0,0),K,[f.WOODZ,.55,.12],{jit:ne(.8,1.2)});await h.yield(),b.add(X(136,.3,30.9),u(0,24.72,53,De,0,0),At,[f.WOODX,.2,.1]);for(let e=0;e<V0;e++)(e&15)===0&&await h.yield(),b.add(new a.CylinderGeometry(.5,.5,.7,10),u(vt+e*qt,20.72,ke+.45,le/2,0,0),Ce,[f.METAL,.8,.8],{jit:ne(.8,1.3)});await h.yield();const qe=(e,t)=>{const o=Math.min(ee((ie-Math.abs(e))/40,0,1),ee((ie-Math.abs(t))/ie,0,1));return 20.9+34*(.42*o+.58*Math.pow(o,2.1))+2.4*Te(.72,1,Math.abs(e)/ie)*Te(.72,1,Math.abs(t)/ie)};{const e=new a.PlaneGeometry(ie*2,ie*2,56,56);e.rotateX(-le/2),await h.yield();const t=e.attributes.position;for(let i=0;i<t.count;i++)t.setY(i,qe(t.getX(i),t.getZ(i)));await h.yield(),e.computeVertexNormals(),await h.yield(),W.add(e,null,Ce,[f.TILE,.75,1],{fn:(i,c,v,d,l,m)=>{const p=.8+.3*h.noise.n2(c*.05,d*.05);m[i*3]*=p,m[i*3+1]*=p,m[i*3+2]*=p}}),await h.yield();const o=(i,c,v)=>{const d=[],l=[];for(let k=0;k<34;k++){const C=-ie+k/34*ie*2,A=-ie+(k+1)/34*ie*2,O=i===0?[C,c*ie]:[c*ie,C],S=i===0?[A,c*ie]:[c*ie,A],M=qe(O[0],O[1])+.05,E=qe(S[0],S[1])+.05,_=.25*c,Q=[O[0]+(i?_:0),19.9,O[1]+(i?0:_)],J=[S[0]+(i?_:0),19.9,S[1]+(i?0:_)],de=[Q[0],M,Q[2]],ue=[J[0],E,J[2]];d.push(...Q,...J,...ue,...Q,...ue,...de);for(let Oe=0;Oe<6;Oe++)l.push(i?c:0,0,i?0:c)}const p=new a.BufferGeometry;p.setAttribute("position",new a.Float32BufferAttribute(d,3)),p.setAttribute("normal",new a.Float32BufferAttribute(l,3)),v.add(p,null,K,[i?f.WOODZ:f.WOODX,.6,.7])};o(0,1,b),o(0,-1,W),o(1,1,W),o(1,-1,W),await h.yield(),W.add(D(60,2.4,2.6,.5),u(0,55.6,0),Ce,[f.METAL,.7,1],{jit:.8}),W.add(new a.CylinderGeometry(.9,.9,62,8),u(0,57,0,0,0,le/2),Ce,[f.METAL,.8,1]);const r=new a.Vector3,s=new a.Vector3;for(const i of[-1,1]){W.add(D(1.4,6,3.6,.6),u(i*30.6,57.2,0,0,0,-i*.35),Ce,[f.METAL,.7,1],{jit:.9}),W.add(D(1,3,2.2,.4),u(i*32.4,59.8,0,0,0,-i*.9),Ce,[f.METAL,.7,1]);for(const c of[-1,1])for(let v=0;v<10;v++){const d=v/10,l=(v+1)/10;r.set(i*we(28,ie,d),0,c*we(0,ie,d)),r.y=qe(r.x,r.z)+.6,s.set(i*we(28,ie,l),0,c*we(0,ie,l)),s.y=qe(s.x,s.z)+.6;const m=kt(r,s);W.add(new a.CylinderGeometry(1,1,m.len*1.04,7),m.m,Ce,[f.METAL,.75,1],{jit:ne(.8,1.1)})}await h.yield()}}for(const e of[-1,1]){W.add(X(11.2,.3,136),u(e*62.4,19.95,0),We,[f.WOODZ,.2,.3]);for(let o=0;o<26;o++)W.add(X(11,.7,.6),u(e*62.4,19.5,-ie+2+o*4),K,[f.WOODX,.4,.3]);W.add(X(1,5,113),u(e*(se+.6),-2.5,0),Ue,[f.STONE,.3,.6],{grad:[-5,0,.7,1]});const t=new a.PlaneGeometry(16,150,3,24);t.rotateX(-le/2),W.add(t,u(e*65,T+.06,0),ft,[f.PEBBLE,.4,.9]),await h.yield()}W.add(X(114,.3,11.2),u(0,19.95,-62.4),We,[f.WOODX,.2,.3]);for(let e=0;e<28;e++)W.add(X(.6,.7,11),u(-54+e*4,19.5,-62.4),K,[f.WOODZ,.4,.3]);W.add(X(114,5,1),u(0,-2.5,N-.6),Ue,[f.STONE,.3,.6],{grad:[-5,0,.7,1]}),W.add(D(113.4,1.4,1,.15),u(0,-.73,Ne+.1),K,[f.WOODX,.75,.4]),W.add(X(112,3.7,.4),u(0,-3.2,Ne-1.6),We,[f.WOODX,.2,.3],{grad:[-5,-1,.5,1]});for(let e=0;e<=14;e++)W.add(D(.9,3.4,.9,.1),u(-se+e*8,-3.1,Ne-.4),K,[f.WOODY,.5,.4]),W.add(D(1.7,.5,1.7,.18),u(-se+e*8,-4.75,Ne-.4),Ue,[f.STONE,.4,.8],{jit:ne()});await h.yield();{const e=new a.PlaneGeometry(150,17,30,4);e.rotateX(-le/2),W.add(e,u(0,T+.08,65.2),ft,[f.PEBBLE,.4,.9]);const t=new a.PlaneGeometry(150,14,20,2);t.rotateX(-le/2),W.add(t,u(0,T+.06,-64),ft,[f.PEBBLE,.4,.9]);let o=-74;for(;o<74;){const r=n.range(2.6,5.2);W.add(D(r-.25,n.range(.8,1.3),n.range(1.2,1.8),.25),u(o+r/2,T+.35,74+n.range(-.2,.2),0,n.range(-.06,.06),0),Ue,[f.STONE,.5,1],{jit:ne(.7,1.25)}),o+=r}}await h.yield();const _e=-16*x;W.add(D(9.5,2.7,5.2,.55),u(_e,T+1.3,59.9,0,.05*x,0),Ue,[f.STONE,.55,.75],{jit:1.1});const Ye=P("#27314f");for(const e of[-1,1]){const t=_e+e*.75+.6,o=59.6+e*.25,r=.12*e-.2,s=T+2.65;W.add(D(.95,.22,2.1,.07),u(t,s+.75,o,0,r,0),$e,[f.WOODZ,.7,.6],{jit:1.6});for(const i of[-.5,.45])W.add(X(.95,.66,.24),u(t+Math.sin(r)*i,s+.33,o+Math.cos(r)*i,0,r,0),$e,[f.WOODX,.5,.6],{jit:1.4});for(const i of[-1,1])W.add(X(.1,.1,.95),u(t+i*.2,s+.95,o+.35,.25,r+i*.42,0),Ye,[f.CLOTH,.2,.6])}const Be=new a.Vector3(-15*x,0,49),Ae=[],ye=w.cast||{};{const t=n.range(-.5,.5)+(x>0?.3:le-.3),o=u(0,0,0,0,t,1.18);let r=1e9;for(let l=0;l<24;l++)Le.set(Math.cos(l/24*6.283)*4.3,-1.95,Math.sin(l/24*6.283)*4.3).applyMatrix4(o),r=Math.min(r,Le.y);Le.set(0,-6.4,0).applyMatrix4(o),r=Math.min(r,Le.y-.2);const s=u(Be.x,-r,Be.z,0,t,1.18),i=s.clone().invert(),c=new a.Vector3;for(let l=0;l<24;l++){const m=new a.Vector3(Math.cos(l/24*6.283)*4.3,-1.95,Math.sin(l/24*6.283)*4.3).applyMatrix4(s);m.y<2.2&&m.y>.3&&Ae.push(m)}const v=P("#c9cdc4"),d=P("#c22f17");b.add(Ze([[.02,.22],[.45,.02],[1.4,-.42],[2.2,-.83],[2.35,-.91],[2.9,-1.2],[3.05,-1.28],[4.3,-1.95]],40),s,d,[f.CLOTH,.75,.2],{fn:(l,m,p,k,C,A)=>{c.set(m,p,k).applyMatrix4(i);const O=Math.hypot(c.x,c.z),S=.86+.14*Math.abs(Math.cos(Math.atan2(c.z,c.x)*20)),M=O>2.28&&O<2.97?v:d;A[l*3]=M.r*S,A[l*3+1]=M.g*S,A[l*3+2]=M.b*S}}),await h.yield(),b.add(new a.CylinderGeometry(.11,.13,6.6,7),s.clone().multiply(u(0,-3.1,0)),P("#5d6a4a"),[f.WOODY,.6,.2]),b.add(new a.CylinderGeometry(.34,.4,.5,10),s.clone().multiply(u(0,-.1,0)),P("#101112"),[f.CLOTH,.6,.2]),b.add(new a.CylinderGeometry(.3,.3,.4,10),s.clone().multiply(u(0,-2.6,0)),P("#101112"),[f.CLOTH,.6,.2]);for(let l=0;l<20;l++){const m=l/20*6.283,p=kt(Le.set(Math.cos(m)*.3,-2.6,Math.sin(m)*.3).clone(),new a.Vector3(Math.cos(m)*2.6,-1.05,Math.sin(m)*2.6));b.add(new a.CylinderGeometry(.035,.035,p.len,4),s.clone().multiply(p.m),P("#6b7355"),[f.WOODY,.4,.2])}Be.y=-r}if(ye.cape){const e=new a.Vector3(31*x,0,49),t=P("#b3a475"),o=n.range(-.25,.25)+(x>0?.25:-.25),r=(i,c,v)=>Le.set(i,c,v).applyMatrix4(u(e.x,0,e.z,0,o,0)).clone();for(const i of[-2.3,2.3]){const c=r(i,0,0);b.add(D(.34,6.6,.34,.06),u(c.x,3.3,c.z,0,o,0),$e,[f.WOODY,.6,.2]),b.add(D(.5,.3,1.7,.06),u(c.x,.15,c.z,0,o,0),$e,[f.WOODZ,.6,.2])}b.add(D(5.6,.3,.3,.06),u(e.x,6.2,e.z,0,o,0),$e,[f.WOODX,.6,.2]);for(let i=0;i<4;i++){const c=6.35-i*1.05,v=c-1.9,d=.75+i*.42,l=d+.75;b.add(Ze([[l,v],[l-.12,v+.3],[d,c],[d-.25,c]],18),u(e.x,0,e.z,0,o,0,1,1,.34),t,[f.THATCH,.2,.2],{jit:ne(.85,1.2),grad:[v,c,.75,1.1]})}for(let i=0;i<9;i++)Ae.push(r(-2+i*.5,1.45,i%2?.7:-.7));const s=r(3.3,4.6,.25);b.add(Ze([[.02,.85],[.5,.6],[1.9,0],[1.84,-.06],[.45,.48],[.02,.7]],20),u(s.x,s.y,s.z,.2,o,-1.25*(x>0?1:-1)),P("#a89a6c"),[f.THATCH,.3,.2],{jit:1.1})}await h.yield();const ce=new a.Vector3(9.6*x,0,11.5),xe=new a.Vector3(ce.x-1.9*x,0,16.4),be=new a.Vector3(ce.x+2.2*x,0,16.9);b.add(D(4.7,.75,4.7,.32),u(ce.x,.375,ce.z,0,n.range(-.2,.2),0),P("#5d4a94"),[f.CLOTH,.08,0],{grad:[0,.75,.5,1.1]}),b.add(new a.SphereGeometry(.22,8,6),u(ce.x,.72,ce.z,0,0,0,1,.5,1),j.clone().multiplyScalar(.5),[f.CLOTH,.2,0]),b.add(Ze([[0,0],[.36,0],[.4,.12],[.6,.5],[.66,.95],[.6,.95],[.54,.52],[0,.44]],18),u(xe.x,.24,xe.z,0,0,0,1.25,1.25,1.25),P("#93a69a"),[f.CLOTH,.9,0],{jit:1}),b.add(D(3.6,.24,2.6,.09),u(xe.x,.12,xe.z,0,.2*x,0),P("#b8271a"),[f.CLOTH,.95,0]),b.add(D(3.9,.12,2.9,.05),u(xe.x,.06,xe.z,0,.2*x,0),P("#0c0c0d"),[f.CLOTH,.95,0]),b.add(new a.CircleGeometry(.56,16),u(xe.x,1.12,xe.z,-le/2,0,0,1.25,1.25,1.25),te(y[4],y[3],.4),[f.CLOTH,.9,0]);const Se=new a.Vector3(ce.x+5.4*x,0,9.5);{const e=P("#ffb25e").multiplyScalar(.62);for(const t of[-1,1])for(const o of[-1,1])b.add(D(.16,5.2,.16,.03),u(Se.x+t*.78,2.6,Se.z+o*.78),We,[f.WOODY,.6,0]);for(const t of[1.5,4.9])b.add(D(1.9,.16,1.9,.04),u(Se.x,t,Se.z),We,[f.WOODX,.6,0]);b.add(X(1.46,3.3,1.46),u(Se.x,3.2,Se.z),e,[f.FLAME,0,0]),b.add(D(2.2,.14,2.2,.04),u(Se.x,5.25,Se.z),We,[f.WOODX,.6,0]),g.uLamps.value[0].set(Se.x,3.4,Se.z,F==="night"?1.3:.75)}b.add(Ze([[0,0],[.5,0],[.58,.1],[.5,.26],[.12,.2],[0,.22]],14),u(be.x,0,be.z),P("#56605a"),[f.STONE,.6,0]),b.add(new a.CylinderGeometry(.035,.045,1.7,5),u(be.x,1.05,be.z,.06,0,.04),P("#4a5046"),[f.WOODY,.3,0]);const wt=48*x;{const e=new a.PlaneGeometry(13.6,9,8,6),t=(o,r,s,i,c,v,d)=>{d[o*4+3]=(21.2-s)*.03};b.add(e,u(wt,16.7,55.95),P("#6d785a"),[f.BLIND,.25,.3],{fn:t}),b.add(new a.CylinderGeometry(.75,.75,13.8,10),u(wt,12.1,56,0,0,le/2),P("#6d785a"),[f.BLIND,.25,.3,.27],{jit:.85})}const Tt=[];for(const e of[-1,1]){const t=e*65.2,o=17.2,r=ke-.9;b.add(X(.08,3.2,.08),u(t,o+3.3,r),Ie,[f.METAL,.4,.6,.03]),b.add(Ze([[0,1.7],[.3,1.66],[.52,1.2],[.6,.4],[.82,0],[.74,0],[.52,.4],[0,1.4]],12),u(t,o,r,0,0,0,1.3,1.3,1.3),Ie,[f.METAL,.65,.6,.06],{jit:1.3}),b.add(X(.7,2.6,.05),u(t,o-2.2,r,0,.4,0),j.clone().multiplyScalar(.55),[f.CLOTH,.1,.6,.45]),Tt.push(new a.Vector3(t,o,r))}await h.yield();const yt=[-9.5*x,58*x],Ht=[];let l0=null;for(const e of yt){const t=ke+.35,o=20.3,r=T+1.7,s=[[.15,-.3],[.2,-.28],[.42,.18],[.47,.22],[.4,.2],[.17,-.2]];for(let c=o-.6,v=0;c>r+.3;c-=.86,v++)b.add(l0||(l0=Ze(s,8)),u(e,c,t,0,v*.8,0),Ie,[f.METAL,.7,.75],{jit:ne(.85,1.4)}),b.add(X(.07,.46,.07),u(e,c-.5,t),Ie,[f.METAL,.6,.75]);b.add(new a.CylinderGeometry(.12,.14,o-r,6,1,!0),u(e,(o+r)/2,t),j,[f.FLOW,1,.8]),W.add(Ze([[0,T],[2,T],[2.35,T+.45],[2.45,T+1.5],[2.15,T+1.72],[1.95,T+1.5],[0,T+1.4]],18),u(e,0,t),Ue,[f.STONE,.5,1],{jit:1.1});const i=new a.CircleGeometry(1.98,18);i.rotateX(-le/2),W.add(i,u(e,T+1.6,t),y[1],[f.WATER,1,1]),Ht.push({top:new a.Vector3(e,o,t),basin:new a.Vector3(e,T+1.6,t)}),await h.yield()}const Me=gt(I?11e4:0),Re=gt(I?Math.round(72e4*ee(z,.4,1)):0),pe={P:[],N:[],C:[],UV:[],A:[],I:[]},c0=[],xt=new a.Vector3(-12*x,T+6.8,114),Lt=h.noise,Xt=ee(h.vary?.density??1,.7,1.3),it=w.path||null,ut=(e,t)=>(1-Te(-52,-30,e*x))*Te(-196,-170,e*x)*Te(100,125,t)*(1-Te(364,384,t)),rt=(e,t)=>{let o=T+30*Te(-15,150,e*x+(t-230)*.15)*Te(80,190,t)+(2.4*Lt.fbm2(e*.012,t*.012,3)+1.5*(.5+.5*Lt.n2(e*.034+3,t*.034))*(1-ut(e,t)))*Te(76,110,t)-3.2*ut(e,t);if(it&&t>70){const s=it.nearestXZ(e,t);o=Math.min(o,s.y-6.5+Math.max(0,s.dist-9)*.6)}const r=ut(e,t);return r<.2&&(o=Math.max(o,we(T-.15,T-3,r/.2))),o},d0=[],f0=[],bt=[],lt=(e,t,o,r,s,i,c,v,d,l)=>{d0.push(e,t,o,r),f0.push(s,i,c,v),bt.push(d,l)},Nt=P("#3b332a"),G0=L==="november"?P("#a31d15"):y[4],H0=L==="november"?P("#d9552a"):te(y[3],y[4],.3),X0=P(L==="november"?"#e08a3a":"#b6dc55"),N0={red:[P("#c52d16"),P("#e2542a"),P("#f28a3e")],gold:[P("#d6a01e"),P("#e9bb32"),P("#f4d665")]};let Ft=null;const Zt=()=>{const e=Ft?N0[Ft]:null;return te(e?e[0]:G0,e?e[1]:H0,n()).lerp(e?e[2]:X0,n()<.22?.6:0).multiplyScalar(n.range(.75,1.1))},$t=(e,t,o,r,s,i,c)=>{if(it&&it.distanceTo(e,t-r*.3,o)<r+6.5)return;const v=pe.P.length/3,d=n(),l=n()*50,m=n()*6.28,p=Math.cos(m),k=Math.sin(m),C=n.range(.65,1),A=Math.max(3,r*2.1);for(let O=0;O<4;O++)for(let S=0;S<4;S++){const M=S/3,E=O/3,_=(M-.5)*2*r,Q=(E-.5)*2*r*C,J=(M-.5)*(M-.5)+(E-.5)*(E-.5);pe.P.push(e+_*p-Q*k,t-J*r*1.15+_*s+Q*i,o+_*k+Q*p),pe.N.push(A,1-J,0),pe.C.push(c.r,c.g,c.b),pe.UV.push(M,E),pe.A.push(.35+J*2.6,d,l)}for(let O=0;O<3;O++)for(let S=0;S<3;S++){const M=v+O*4+S;pe.I.push(M,M+4,M+1,M+1,M+4,M+5)}},m0=(e,t,o,r,s,i,c,v,d)=>{const l=kt(t,o);e.add(r0(s,r,l.len*1.03,i),l.m,c,v,d)},ht=(e,t,o,r,s)=>m0(Me,e,t,o,r,s,Nt,[f.STONE,.45,.8],{jit:ne(.75,1.2)}),u0=(e,t,o,r,s=rt(e,t)-.5,i=null)=>{Ft=L==="june"&&i?"red":L==="november"&&i?"gold":null;const c=new a.Vector3,v=new a.Vector3,d=new a.Vector3,l=new a.Vector3,m=new a.Vector3;c0.push(new a.Vector3(e,s,t)),c.set(e,s,t);let p=o*.03;const k=n()*6.28;for(let O=0;O<6;O++)v.set(c.x+(r.x+Math.sin(k+O*1.3)*.16)*o*.075,c.y+o*.07,c.z+(r.z+Math.cos(k+O*1.7)*.12)*o*.075),ht(c,v,p*(O===0?1.4:1),p*.88,9),c.copy(v),p*=.88;const C=n.int(5,6),A=n()*6.28;for(let O=0;O<C;O++){const S=A+O/C*6.28+n.range(-.3,.3),M=n.range(.12,.75),E=o*n.range(.3,.5),_=Math.cos(S)*Math.cos(M),Q=Math.sin(S)*Math.cos(M),J=Math.sin(M);if(v.set(c.x+_*E*.4,c.y+J*E*.55-O*.6,c.z+Q*E*.4),d.set(c.x+_*E*.75,v.y+J*E*.3,c.z+Q*E*.75),l.set(c.x+_*E,d.y+J*E*.08-E*.03,c.z+Q*E),ht(c,v,p*.75,p*.5,6),ht(v,d,p*.5,p*.3,5),ht(d,l,p*.3,p*.12,4),L==="february"){for(const de of[.3,.7])m.copy(v).lerp(l,de),ht(m.clone(),new a.Vector3(m.x-Q*E*.25*(de<.5?1:-1),m.y+E*.12,m.z+_*E*.25*(de<.5?1:-1)),p*.2,p*.06,4);continue}for(let de=0;de<9;de++){const ue=.15+de/8*1,Oe=(de%2?1:-1)*n.range(.2,1)*E*.2;ue<.5?m.copy(v).lerp(d,ue*2):ue<1?m.copy(d).lerp(l,ue*2-1):m.copy(l).addScaledVector(zt.copy(l).sub(d),ue-1);const he=o*n.range(.085,.14)*(1.1-.35*ue);$t(m.x-Q*Oe,m.y+n.range(-.04,.07)*o,m.z+_*Oe,he,n.range(-.35,.35),n.range(-.35,.35),Zt().multiplyScalar(.62+.55*ee(((m.y-s)/o-.42)/.45,0,1)))}}if(L!=="february")for(let O=0;O<7;O++)$t(c.x+n.range(-.14,.14)*o,c.y+o*n.range(.05,.3),c.z+n.range(-.14,.14)*o,o*n.range(.09,.14),n.range(-.3,.3),n.range(-.3,.3),Zt());Ft=null},G={x0:E0,z0:B0,n:W0,m:I0,c:1},tt=new Float32Array(G.n*G.m),Qt=(e,t,o,r=1)=>{const s=o*1.3+.9,i=Math.max(0,Math.floor((e-s-G.x0)/G.c)),c=Math.min(G.n-1,Math.ceil((e+s-G.x0)/G.c)),v=Math.max(0,Math.floor((t-s-G.z0)/G.c)),d=Math.min(G.m-1,Math.ceil((t+s-G.z0)/G.c));for(let l=v;l<=d;l++)for(let m=i;m<=c;m++){const p=G.x0+m*G.c-e,k=G.z0+l*G.c-t,C=r*(1-(p*p+k*k)/(s*s));C>0&&(tt[l*G.n+m]=Math.min(1,tt[l*G.n+m]+C*.75))}},Z0=(e,t)=>{const o=ee((e-G.x0)/G.c,0,G.n-1.001),r=ee((t-G.z0)/G.c,0,G.m-1.001),s=Math.floor(o),i=Math.floor(r),c=o-s,v=r-i,d=i*G.n+s;return we(we(tt[d],tt[d+1],c),we(tt[d+G.n],tt[d+G.n+1],c),v)},h0=()=>te(y[3],y[4],Math.pow(n(),1.6)*.65),p0={},v0=[];let $0=0;const g0=(e,t,o,r,s,i,c=0,v=null,d=0)=>{const l=c===3?3:c===4?4:c>1&&r>2.4?2:c>1&&r>1.3||c===1&&r>2.2?1:0,m=c>1?1+$0++%6:0,p=l*8+m;let k=p0[p];if(!k){const C=new a.SphereGeometry(1,l===3?9:l===4?7:l>1?12:l?9:7,l>2?2:l>1?4:l?3:2,0,le*2,0,le/2);if(m){const A=C.attributes.position;for(let O=0;O<A.count;O++){const S=A.getX(O),M=A.getY(O),E=A.getZ(O),_=1+.17*Lt.n3(S*1.7+m*7.3,M*1.7,E*1.7+m*3.1);A.setXYZ(O,S*_,M*(.9+.2*_),E*_)}C.computeVertexNormals()}k=p0[p]=C.toNonIndexed(),C.dispose()}v==null&&(v=rt(t,o)-r*.3,Qt(t,o,r)),(e===Re||e===Me)&&v0.push([t,o,r,v,r*s]),e.add(k,u(t,v,o,0,n()*6.28,0,r,r*s,r*n.range(.8,1.2)),i,[f.DOME,d?.6:.2,1],{grad:[v+r*.3,v+r*s*.84,.13,1.1],jit:ne(.82,1.2)})},Q0=te(y[2],y[3],.8),Dt=[null,null],U0=y[2].clone().multiplyScalar(.55),pt=["#c4241c","#e04a3a","#9a8c74","#b07684","#8ea4ea","#6c62c4"].map(P),w0=(e,t,o,r=null,s=Re)=>{r==null&&(r=rt(e,t)-.3,Qt(e,t,o*.9,.8)),s.add(Dt[0]||(Dt[0]=new a.SphereGeometry(1,8,4,0,le*2,0,le/2)),u(e,r,t,0,n()*6.28,0,o*.86,o*.74,o*.86),U0,[f.FROND,.2,1],{grad:[r,r+o*.7,.3,1]});const i=[],c=(m,p,k,C,A,O,S,M)=>{const E=Math.hypot(C,O)||1,_=-O/E,Q=C/E,J=m+C*S*.45,de=p+A*S*.45,ue=k+O*S*.45,Oe=[m,p,k],he=[m+C*S,p+A*S-S*.2,k+O*S],ze=[J,de+.1*S,ue],Xe=[J+_*M,de-.05*S,ue+Q*M],dt=[J-_*M,de-.05*S,ue-Q*M];i.push(...Oe,...Xe,...ze,...Oe,...ze,...dt,...Xe,...he,...ze,...ze,...he,...dt)},v=Math.round(22*ee(o/3,.7,1.3));for(let m=0;m<v;m++){const p=n()*6.28,k=n.range(.05,1.25),C=Math.cos(k),A=p+n.range(-.5,.5);c(e+Math.cos(p)*C*o*.8,r+Math.sin(k)*o*.68,t+Math.sin(p)*C*o*.8,Math.cos(A)*.9,n.range(-.1,.5),Math.sin(A)*.9,o*n.range(.42,.6),o*n.range(.15,.21))}const d=L==="february";for(let m=0;m<(d?6:8);m++){const p=n()*6.28,k=n.range(.3,1.4),C=o*n.range(.23,.33)*(d?.8:1),A=e+Math.cos(p)*Math.cos(k)*o*.92,O=r+Math.sin(k)*o*.8+C*.3,S=t+Math.sin(p)*Math.cos(k)*o*.92,M=d?te(pt[0],pt[1],n()):L==="november"?te(pt[2],pt[3],n()*.7):te(Ot,n()<.5?pt[4]:pt[5],n()*.6);s.add(Dt[1]||(Dt[1]=new a.SphereGeometry(1,9,6)),u(A,O,S,0,n()*6.28,0,C,.82*C,C),M,[f.FLORET,.15,1,.05],{jit:ne(.85,1.25)});for(let E=0;E<4;E++){const _=p+E*1.57+n.range(-.4,.4);c(A,O-C*.55,S,Math.cos(_)*.92,-.25,Math.sin(_)*.92,C*n.range(1.5,2),C*.6)}}const l=Rt(i);s.add(l,null,Q0,[f.FROND,.45,1,.05],{grad:[r,r+o,.5,1.25],jit:ne(.85,1.15)})},Y0=(e,t,o=12,r=.55)=>{const s=n()*6.28,i=n()*6.28,c=n()*6.28,v=n.range(-.1,.1),d=n()*6.28,l=[[.84,0],[1,.3],[.97,.7],[.82,.94],[r,1]],m=[],p=[];for(let A=0;A<l.length;A++)for(let O=0;O<o;O++){const S=O/o*6.2832,M=1+.13*Math.sin(S*2+s)+.08*Math.sin(S*3+i)+.045*Math.sin(S*5+c);m.push(Math.cos(S)*e*l[A][0]*M,t*l[A][1]*(1+v*Math.cos(S-d)*l[A][1]),Math.sin(S)*e*l[A][0]*M)}m.push(0,t*1.02,0);const k=l.length*o;for(let A=0;A<o;A++){const O=(A+1)%o;for(let S=0;S<l.length-1;S++){const M=S*o+A,E=S*o+O;p.push(M,M+o,E,E,M+o,E+o)}p.push(k-o+A,k,k-o+O)}const C=new a.BufferGeometry;return C.setAttribute("position",new a.Float32BufferAttribute(m,3)),C.setIndex(p),C.computeVertexNormals(),C},y0=y[2].clone().multiplyScalar(.8),Ut=(e,t,o,r=Me,s={})=>{const i=s.h||n.range(70,115),c=i*n.range(.1,.15)*(s.girth||1),v=o>1?10:o?8:6,d=o>1?7:o?6:5,l=d*2,m=s.mist||0;r.add(new a.CylinderGeometry(c*.05,c*.17,i*.9,6,1,!0),u(e,T+i*.45,t),Nt,[f.CONIFER,0,1,m]);const p=[],k=[],C=[],A=i*n.range(.16,.34),O=n()*6.28;for(let _=0;_<v;_++){const Q=_/(v-1),J=we(A,i*.95,Q)+i*.06,de=c*(1-.86*Math.pow(Q,.9))*n.range(.85,1.12),ue=i*.09*(1.25-.5*Q),Oe=p.length/3;p.push(0,J,0),k.push(0);for(let he=0;he<l;he++){const ze=O+_*.9+he/l*6.2832,Xe=he%2===0,dt=Xe?de*n.range(.9,1.15):de*.62;p.push(Math.cos(ze)*dt*.55,J-ue*.22,Math.sin(ze)*dt*.55),k.push(.3),p.push(Math.cos(ze)*dt,J-ue*(Xe?n.range(.9,1.25):.6),Math.sin(ze)*dt),k.push(1)}for(let he=0;he<l;he++){const ze=Oe+1+he*2,Xe=Oe+1+(he+1)%l*2;C.push(Oe,ze,Xe,ze,ze+1,Xe,Xe,ze+1,Xe+1)}}const S=new a.BufferGeometry;S.setAttribute("position",new a.Float32BufferAttribute(p,3)),S.setAttribute("edge",new a.Float32BufferAttribute(k,1)),S.setIndex(C),S.computeVertexNormals();const M=S.toNonIndexed(),E=M.attributes.edge.array;S.dispose(),r.add(M,u(e,T,t),y0,[f.CONIFER,0,1,m],{jit:ne(.75,1.2),fn:(_,Q,J,de,ue,Oe,he)=>{he[_*4+1]=E[_]}})},St=te(y[3],y[4],.12),ve={nx:88,nz:75,dx:420/88,dz:358/75,x0:-210,z0:72,geo:null},x0=async()=>{if(ve.geo)return ve.geo;const e=new a.PlaneGeometry(420,358,ve.nx,ve.nz);e.rotateX(-le/2),e.translate(0,0,251);const t=e.attributes.position;for(let o=0;o<t.count;o++)(o&127)===0&&await h.yield(),t.setY(o,rt(t.getX(o),t.getZ(o)));return ve.geo=e,ve.Y=t.array,e},J0=(e,t)=>{const o=ee((e-ve.x0)/ve.dx,0,ve.nx-1e-6),r=ee((t-ve.z0)/ve.dz,0,ve.nz-1e-6),s=Math.floor(o),i=Math.floor(r),c=o-s,v=r-i,d=ve.nx+1,l=ve.Y,m=l[(i*d+s)*3+1],p=l[((i+1)*d+s)*3+1],k=l[((i+1)*d+s+1)*3+1],C=l[(i*d+s+1)*3+1];return c+v<=1?m+c*(C-m)+v*(p-m):k+(1-c)*(p-k)+(1-v)*(C-k)};if(I){{const s=(c,v,d,l)=>{const m=new a.PlaneGeometry(c,v,6,6);m.rotateX(-le/2),Re.add(m,u(d,T-.03,l),St,[f.MOSS,.15,1],{jit:.8})};s(900,480,0,-167),s(240,358,330,251),s(240,358,-330,251);const i=new a.PlaneGeometry(176,300,8,12);i.rotateX(-le/2),Re.add(i,u(-116*x,T-.55,244),y[1],[f.WATER,1,1])}await h.yield();const e=Math.round(420*z*Xt),t=[];for(let s=0;s<30;s++)t.push([n.range(-150,150),80+Math.pow(n(),1.4)*220,n.range(7,20)]);for(let s=0;s<e;s++){(s&15)===0&&await h.yield();const i=t[s%t.length],c=i[0]+n.gauss()*i[2],v=Math.max(77,i[1]+n.gauss()*i[2]),d=1.2+Math.pow(n(),2.2)*6;if(ut(c,v)>.15||Math.abs(c)>200||v>420)continue;const l=ee((v-ke)/(xt.z-ke),0,1.6);(it?it.nearestXZ(c,v).dist<7+d*.6:Math.abs(c-xt.x*l)<8+d&&v<190)||g0(Re,c,v,d,n.range(.5,.8),h0(),it?0:1)}await h.yield();for(const[s,i]of[-66,-50,-35,-20,19,33,48,63,77].entries()){const c=i+n.range(-4,4),v=n.range(79,97),d=n.range(30,45)*(.9+.1*Xt);u0(c,v,d,new a.Vector3(ee(-c*.004,-.2,.2)+n.range(-.12,.12),0,n.range(-.34,-.1)),void 0,s===1||s===4?"red":null),await h.yield()}for(let s=0;s<12;s++){const i=-72+s*13+n.range(-3,3),c=n.range(76.5,81),v=n.range(2.3,3.4);Math.abs(i-xt.x*.25)<9||(w0(i,c,v),await h.yield())}const o=P("#76735f");Me.add(X(424,24,3),u(0,T+12,430),o,[f.EARTH,.05,1,Pt(.1)],{grad:[T,T+24,.8,1]}),Me.add(D(426,1.8,6.5,.5),u(0,T+24.9,430),Ce,[f.METAL,.6,1]);for(const s of[-1,1])Me.add(X(3,24,360),u(s*211,T+12,251),o,[f.EARTH,.05,1,Pt(.1)],{grad:[T,T+24,.8,1]}),Me.add(D(6.5,1.8,362,.5),u(s*211,T+24.9,251),Ce,[f.METAL,.6,1]);await h.yield();const r=[[23,6,-.72,88,134,1.14],[90,12,-.3,80,126,1],[162,16,-.14,76,132,.95]];for(let s=0;s<3;s++){const[i,c,v,d,l,m]=r[s],p=211+i,k=104,C=430+i,A=C-k,O=A*2+p*2;let S=n.range(0,18);for(;S<O;){const M=S<A?0:S<A+p*2?1:2,E=M===0?-p*x:M===1?(S-A-p)*x:p*x,_=M===0?k+S:M===1?C:C-(S-A-p*2),Q=s===0?M<2?2:1:s===1&&M<2?1:0;Ut(E+n.range(-c,c),_+n.range(-c,c),Q,s===0&&M===1?Me:Re,{h:we(d,l,Math.pow(n(),1.3)),girth:m,mist:v}),S+=(n()<.62?n.range(9,16):n.range(30,58))*(1+s*.14),await h.yield()}await h.yield()}}const eo={rng:n,side:x,season:L,snow:R,pal:y,detail:z,dens:Xt,K:f,M:u,C:P,mixC:te,chamferBox:D,box:X,tube:r0,soup:Rt,lathe:Ze,limbM:kt,makeBatch:gt,bi:b,bo:W,ga:Me,gb:Re,spray:$t,limb:m0,twig:ht,mapleAt:u0,leafCol:Zt,fall:lt,hillAt:rt,pondM:ut,jit:ne,GY:T,shade:Qt,dome:g0,mossC:h0,hydrangea:w0,rockGeo:Y0,cedarAt:Ut,shadeAt:Z0,domeAt:v0,groundPrep:x0,groundAt:J0,ground:ve,useRng:e=>{const t=n;return n=e,t},colors:{timber:K,timberB:$e,timberD:We,plaster:Qe,stone:Ue,tileC:Ce,bronze:Ie,pebble:ft,accent:Ot,bark:Nt,pearl:j}};if(w.extend&&await w.extend(eo),I){const e=w.rng2||vo(go("veranda6-beyond:"+(h.seed??0))),t=n;n=e,g.uPatch.value.set(e.range(0,60),e.range(0,60),e.range(0,60),e.range(0,60));const o=Ce.clone().multiplyScalar(.9),r=[f.EARTH,.2,1,Pt(.1)],s=T+28.6,i=T+24.8,c=(d,l,m,p)=>{const k=Math.hypot(m-d,p-l),C=-(p-l)/k*5.6,A=(m-d)/k*5.6,O=[];for(const M of[-1,1])O.push(d,s,l,m,s,p,m+C*M,i,p+A*M,d,s,l,m+C*M,i,p+A*M,d+C*M,i,l+A*M),O.push(d+C*M,i,l+A*M,d+C*M,i-.7,l+A*M,m+C*M,i-.7,p+A*M,d+C*M,i,l+A*M,m+C*M,i-.7,p+A*M,m+C*M,i,p+A*M);Me.add(Rt(O),null,o,r);const S=kt(Le.set(d,s+.15,l).clone(),new a.Vector3(m,s+.15,p));Me.add(r0(.8,.8,S.len,7),S.m,o,[f.METAL,.5,1],{jit:.85})};c(-217,430,217,430);for(const d of[-1,1])c(d*211,66,d*211,435);if(await h.yield(),!R){const d=(l,m)=>{const p=i-.6-rt(l,m);p>4&&lt(l,i-.6,m,p,e.range(.3,.5),e(),.2,.5,e.range(.6,1),1)};for(let l=100;l<424;l+=2.9)for(const m of[-1,1])d(m*205.3,l+e.range(-.8,.8));for(let l=-204;l<204;l+=2.9)d(l+e.range(-.8,.8),424.3)}await h.yield();for(const d of[-1,1]){let k=e.range(0,14);for(;96+k<453;)Ut(d*(234+e.range(-8,13)),96+k,d===-x?1:0,Re,{h:we(62,172,Math.pow(e(),1.6)),girth:e.range(.85,1.3),mist:Pt(.2)}),k+=d===-x?e.range(11,30):e.range(15,38),await h.yield()}const v=(d,l,m,p,k,C,A,O)=>{O.add(Rt([d,T,l,m,T,p,m,T+178,p,d,T,l,m,T+178,p,d,T+178,l]),null,y0,[f.GHOST,k,1,Pt(A)],{fn:(S,M,E,_,Q,J)=>{J[S*3]=Math.hypot(M-d,_-l),J[S*3+1]=E-T,J[S*3+2]=C}})};for(const[d,l,m]of[[31,104,.3],[82,90,.5],[101,99,.6],[151,94,.6],[176,106,.6]]){const p=211+d,k=430+d,C=e();if(v(-p,k,p,k,l,C,m,Me),d>50)for(const A of[-1,1])v(A*p,80,A*p,k,l,C+.07*A,m,Re)}n=t,await h.yield()}if(I){const e=await x0();e.computeVertexNormals(),await h.yield();const t=te(y[3],y[4],.62);Me.add(e,null,St,[f.MOSS,.15,1],{fn:(o,r,s,i,c,v)=>{const d=ee(.5+.7*Lt.fbm2(r*.03,i*.03,2),0,1),l=1;v[o*3]=we(St.r,t.r,d)*l,v[o*3+1]=we(St.g,t.g,d)*l,v[o*3+2]=we(St.b,t.b,d)*l}}),await h.yield()}{const e=new Uint8Array(G.n*G.m);for(let o=0;o<G.n*2;o++)tt[o]=0;for(let o=0;o<e.length;o++)e[o]=Math.round(tt[o]*255);const t=new a.DataTexture(e,G.n,G.m,a.RedFormat,a.UnsignedByteType);t.magFilter=t.minFilter=a.LinearFilter,t.unpackAlignment=1,t.needsUpdate=!0,g.uShade.value=t}const Ke=(e,t,o=0)=>{const r=new a.Mesh(e,t);return r.frustumCulled=!1,r.renderOrder=o,Ee.add(r),r};await h.yield();const b0=Ke(b.build(),me);await h.yield();const to=Ke(W.build(),me);await h.yield();let Ve=b0.geometry.attributes.position.count/3+to.geometry.attributes.position.count/3,Yt=null,S0=null,M0=null,oo=null;if(I&&(Yt=Ke(Me.build(),me),await h.yield(),S0=Ke(Re.build(),me),await h.yield(),Ve+=Yt.geometry.attributes.position.count/3+S0.geometry.attributes.position.count/3,pe.I.length)){const e=new a.BufferGeometry;e.setAttribute("position",new a.Float32BufferAttribute(pe.P,3)),e.setAttribute("normal",new a.Float32BufferAttribute(pe.N,3)),e.setAttribute("color",new a.Float32BufferAttribute(pe.C,3)),e.setAttribute("uv",new a.Float32BufferAttribute(pe.UV,2)),e.setAttribute("aCard",new a.Float32BufferAttribute(pe.A,3)),e.setIndex(pe.I),M0=Ke(e,new a.ShaderMaterial({uniforms:Ct(re("uTime","uSky","uMistCol","uMist","uSun","uSunA","uSunP")),vertexShader:Oo,fragmentShader:To,fog:!0,side:a.DoubleSide})),Ve+=pe.I.length/3,await h.yield()}ae&&(oo=Ke(new a.SphereGeometry(1500,24,12),new a.ShaderMaterial({uniforms:re("uTime","uZen","uHor","uInv","uSeam","uStrata","uSunDir","uSkyK"),side:a.BackSide,depthWrite:!1,fog:!1,vertexShader:"uniform mat4 uInv; varying vec3 vP; void main(){ vP = position - (uInv * vec4(cameraPosition, 1.)).xyz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:Ao}),-.5),Ve+=288*2);const Kt=new a.BufferGeometry;Kt.setAttribute("position",new a.Float32BufferAttribute([-se,0,N,se,0,N,se,0,Ne,-se,0,Ne],3)),Kt.setIndex([0,2,1,0,3,2]);const _o=Ke(Kt,new a.ShaderMaterial({uniforms:re("uTime","uInv","uZen","uHor","uSeam","uStrata","uSunDir","uSkyK"),vertexShader:j0,fragmentShader:Po,fog:!1,depthWrite:!1}),50),z0=L==="november"?[P("#9c1d14"),P("#cf4d24")]:[te(y[3],y[4],.5),y[4].clone()],ao=(H.r+H.g+H.b)/3,no=Ct({...re("uTime","uInv","uSky","uLampCol"),uLampP:{value:new a.Vector3(Se.x,3.4,Se.z)},uStreak:{value:(L==="november"?new a.Color(.5,.27,.13):R?new a.Color(.5,.56,.62):new a.Color(.4,.54,.3)).multiplyScalar(ao*.9)},uLacquer:{value:y[1].clone()},uLeafCol:{value:z0[0]},uLeafCol2:{value:z0[1]},uLeafK:{value:L==="november"?1.9:L==="february"?.12:1},uRing:{value:R?.25:ee(oe,.4,1.3)}}),Ro=Ke(Kt,new a.ShaderMaterial({uniforms:no,vertexShader:j0,fragmentShader:Co,fog:!0,transparent:!0,depthWrite:!0}),-100);Ve+=4,await h.yield();const so=Math.max(6,Math.round(11*z));for(let e=0;e<V0;e++){if(R&&e%3)continue;const t=vt+e*qt,o=n.range(.3,.62)*(R?.5:.8+.2*oe),r=R?2:Math.max(2,Math.round(so*n.range(.25,1)*ee(oe,.7,1.15)));for(let s=0;s<r;s++)lt(t+n.range(-.1,.1),20.25,ke+.45,25.1,o*n.range(.92,1.08),n(),n.range(.14,.2),n.range(.34,.48),n.range(.6,1),1)}for(const e of Ae)for(let t=0;t<2;t++)lt(e.x,e.y,e.z,e.y-.02,n.range(.5,.8),n(),.13,.3,.9,1);for(const e of Ht)for(let t=0;t<6;t++){const o=n()*6.28;lt(e.basin.x+Math.cos(o)*2.3,e.basin.y+.1,e.basin.z+Math.sin(o)*2.3,1.6,n.range(.9,1.3),n(),.12,.3,.8,1)}if(Pe){const e=Math.round((R?900:760*oe)*z*(w.rainCount||1));for(let t=0;t<e;t++){const o=n.range(-150,150),r=ke+3+Math.pow(n(),1.4)*(w.rainDepth||170);if(R){const s=n.range(.45,.85);lt(o,66,r,72,n.range(.05,.09),n(),s,s,n.range(.8,1),2)}else lt(o,70,r,76,n.range(.3,.4),n(),.07,n.range(4,7),n.range(.45,1),0)}}await h.yield();const ct=new a.InstancedBufferGeometry;ct.setAttribute("position",new a.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),ct.setIndex([0,1,2,0,2,3]),ct.setAttribute("aO",new a.InstancedBufferAttribute(new Float32Array(d0),4)),ct.setAttribute("aQ",new a.InstancedBufferAttribute(new Float32Array(f0),4)),ct.setAttribute("aK",new a.InstancedBufferAttribute(new Float32Array(bt),2)),ct.instanceCount=bt.length/2;const io=Ke(ct,new a.ShaderMaterial({uniforms:Ct(re("uTime","uSky","uViewH","uSun","uSunA","uSunP")),vertexShader:Lo,fragmentShader:Fo,fog:!0,transparent:!0,depthWrite:!1,side:a.DoubleSide}),2);Ve+=bt.length,await h.yield();let k0=null,P0=null;if(I){const e=[],t=[],o=(d,l,m,p)=>{const k=e.length/3;e.push(d,T,p,l,T,p,l,m,p,d,m,p),t.push(k,k+1,k+2,k,k+2,k+3)};for(let d=0;d<16;d++)o(-212,212,T+104,92+d*21);if(w.courtShafts)for(const d of[-64,-78,-92,-106])o(-44,44,T+44,d);const r=new a.BufferGeometry;r.setAttribute("position",new a.Float32BufferAttribute(e,3)),r.setIndex(t),k0=Ke(r,new a.ShaderMaterial({uniforms:re("uTime","uSun","uSunA","uSunP","uShaft"),vertexShader:Do,fragmentShader:Ko,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,side:a.DoubleSide}),3),Ve+=t.length/3;const s=[],i=[],c=[];(w.beams||[0,1,2,3,4,5]).forEach((d,l)=>{const m=l*4;s.push(-1,0,0,1,0,0,1,1,0,-1,1,0),i.push(d,d,d,d),c.push(m,m+1,m+2,m,m+2,m+3)});const v=new a.BufferGeometry;v.setAttribute("position",new a.Float32BufferAttribute(s,3)),v.setAttribute("aIdx",new a.Float32BufferAttribute(i,1)),v.setIndex(c),P0=Ke(v,new a.ShaderMaterial({uniforms:re("uTime","uInv","uSun","uSunA","uSunP","uBeam"),vertexShader:Vo,fragmentShader:Eo,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,side:a.DoubleSide}),3),Ve+=12}const Jt=new a.BufferGeometry,C0=[],A0=[];for(let e=0;e<=48;e++)C0.push(-1,e/48,0,1,e/48,0),e<48&&A0.push(e*2,e*2+1,e*2+2,e*2+1,e*2+3,e*2+2);Jt.setAttribute("position",new a.Float32BufferAttribute(C0,3)),Jt.setIndex(A0);const ro=Ke(Jt,new a.ShaderMaterial({uniforms:{...re("uTime","uSky","uViewH"),uBase:{value:new a.Vector3(be.x+.07,1.9,be.z+.1)}},vertexShader:Bo,fragmentShader:Wo,transparent:!0,depthWrite:!1,side:a.DoubleSide}),3);Ve+=96;const e0=gt();{const e=ye.wagtails?P("#1c1f25"):P("#141c32"),t=ye.wagtails?P("#d3d9da"):P("#b2babb");e0.add(new a.SphereGeometry(1,7,5),u(0,0,0,le/2,0,0,.17,.62,.15),e,[0,0,0,0],{fn:(i,c,v,d,l,m)=>{const p=l.y<-.25?t:e;m[i*3]=p.r,m[i*3+1]=p.g,m[i*3+2]=p.b}});const o=[],r=[];for(const i of[-1,1]){const c=[i*.12,.03,.24],v=[i*.12,.03,-.14],d=[i*.72,.03,.04],l=[i*.72,.03,-.24],m=[i*1.3,.03,-.52];o.push(...c,...v,...d,...v,...l,...d,...d,...l,...m),o.push(i*.05,0,-.5,i*.02,0,-.62,i*.24,0,-1.2);for(let p=0;p<12;p++)r.push(0,1,0)}const s=new a.BufferGeometry;s.setAttribute("position",new a.Float32BufferAttribute(o,3)),s.setAttribute("normal",new a.Float32BufferAttribute(r,3)),e0.add(s,null,e,[0,0,0,0],{fn:(i,c,v,d,l,m,p)=>{p[i*4+3]=d<-.45&&Math.abs(c)<.3?0:ee((Math.abs(c)-.12)/1.18,0,1)}})}const t0=e0.build();t0.setAttribute("aPhase",new a.InstancedBufferAttribute(new Float32Array([0,1.9]),1));const je=new a.InstancedMesh(t0,new a.ShaderMaterial({uniforms:Ct(re("uTime","uSky","uFlap")),vertexShader:Io,fragmentShader:qo,fog:!0,side:a.DoubleSide}),2);je.frustumCulled=!1,Ee.add(je),Ve+=2*t0.attributes.position.count/3,await h.yield();const ot=new a.Group;ot.name="mirror-twins",ot.scale.set(1,-1,1),Ee.add(ot);const Mt=[],Vt=new a.Matrix4,O0=e=>{const t=e.userData.src;t.updateWorldMatrix(!0,!1),e.matrix.copy(Vt).multiply(t.matrixWorld),e.visible=t.visible,t.isInstancedMesh&&(e.count=t.count)},Ge=(e,t={})=>{if(!e)return null;if(!e.isMesh&&!e.isPoints){const s=[];return e.traverse(i=>{(i.isMesh||i.isPoints)&&s.push(Ge(i,t))}),s}const o=Array.isArray(e.material)?e.material:[e.material];for(const s of o)R0(s,U);let r;return e.isInstancedMesh?(r=new a.InstancedMesh(e.geometry,e.material,e.count),r.instanceMatrix=e.instanceMatrix,e.instanceColor&&(r.instanceColor=e.instanceColor)):e.isPoints?r=new a.Points(e.geometry,e.material):r=new a.Mesh(e.geometry,e.material),r.frustumCulled=!1,r.matrixAutoUpdate=!1,r.renderOrder=o.some(s=>s.transparent)?-200:60,r.userData.src=e,r.userData.live=!!t.live,Ee.updateWorldMatrix(!0,!1),Vt.copy(Ee.matrixWorld).invert(),ot.add(r),O0(r),Mt.push(r),Ve+=t.count===!1?0:(e.geometry.index?e.geometry.index.count:e.geometry.attributes.position.count)/3*(e.isInstancedMesh?e.count:1),r};let T0=!0;const lo={root:ot,twins:Mt,uniforms:U,patch:e=>R0(e,U),add:Ge,remove(e){const t=Mt.indexOf(e);t>=0&&Mt.splice(t,1),ot.remove(e)},setEnabled(e){T0=!!e}};Ge(b0),Ge(Yt),Ge(M0),Ge(io,{count:!1}),Ge(k0),Ge(P0),Ge(ro),Ge(je,{live:!0}),Ve+=bt.length;const ge=x,L0=new a.CatmullRomCurve3([[-70*ge,19,82],[-48*ge,11.5,55],[-31*ge,5.4,31],[-13*ge,2.4,11],[5*ge,1.9,5],[23*ge,2.8,10],[39*ge,7,31],[48*ge,12,55],[60*ge,20,80]].map(e=>new a.Vector3(e[0],e[1],e[2]))),He=new a.Matrix4,Et=new a.Matrix4,at=new a.Vector3,F0=new a.Vector3,co=new a.Vector3(0,1,0),D0=new a.Matrix4().makeScale(0,0,0),nt=w.swallowScale??2.2,fo=[new a.Vector3(-3.6*ge,.37,53.6),new a.Vector3(-6.4*ge,.37,52.4)],mo=(e,t)=>{let o=0;if(ye.wagtails){const r=ee((e-.7)/.75,0,1);g.uFlap.value=Te(0,.06,r);for(let s=0;s<2;s++){const i=ee(r*1.25-s*.12,0,1),c=fo[s],v=(s?-.5:.4)*ge+le*.9+.5*Math.sin(t*.6+s*2);at.set(c.x+.9*Math.sin(t*.5+s*3)+i*(16+34*i)*ge*(s?1:.7),c.y+i*(5+9*i)+.08*Math.abs(Math.sin(t*6+s))*(1-i),c.z+.5*Math.sin(t*.37+s)+i*i*44),He.makeRotationY(we(v,.6*ge,Te(0,.25,i))),Et.makeRotationX((.22*Math.sin(t*9+s*1.7)-.15)*(1-Te(0,.1,i))-.25*Te(0,.2,i)),He.multiply(Et),nt!==1&&He.scale(zt.set(nt,nt,nt)),He.setPosition(at),je.setMatrixAt(s,i<1?He:D0)}je.instanceMatrix.needsUpdate=!0,je.visible=r<1;return}for(let r=0;r<2;r++){const s=e-r*.055;if(!(s>0&&s<1)){je.setMatrixAt(r,D0);continue}L0.getPoint(s,at),L0.getTangent(s,F0),r&&at.add(Le.set(2.4*ge,.5,-2.6)),at.y+=Math.sin(t*2.3+r*2)*.12,He.lookAt(Le.copy(at).add(F0),at,co),Et.makeRotationZ(Math.sin(s*6.283+r)*.45),He.multiply(Et),nt!==1&&He.scale(zt.set(nt,nt,nt)),He.setPosition(at),je.setMatrixAt(r,He),o++}je.instanceMatrix.needsUpdate=!0,je.visible=o>0},Y=(e,t,o)=>new a.Vector3(e,t,o),uo={entry:{position:Y(0,7,N),facing:Y(0,0,1)},flyThrough:[Y(0,7,-72),Y(0,7,N),Y(0,6.7,-20),Y(0,6.5,12),Y(0,6.5,44),Y(0,6.5,Ne),Y(0,6.4,ke+.5),Y(-4*x,4.5,84),Y(-9*x,2.6,100),xt.clone()],mirrorFrame:{position:Y(0,6.5,8),lookAt:Y(0,5.5,80)},postsFront:s0.map(e=>Y(e,0,55)),opening:{min:Y(-se,0,Ne),max:Y(se,It,Ne)},eaveEdge:{z:ke,y:It},swallowCross:Y(0,1.9,6),cushion:ce.clone(),teaBowl:xe.clone(),incense:Y(be.x,1.9,be.z),umbrella:Be.clone(),sandals:Y(_e+.6,T+3.5,59.6),blind:Y(wt,16,56),windBells:Tt,rainChains:Ht,dripLine:[Y(vt,It+.25,ke+.45),Y(-vt,It+.25,ke+.45)],gardenExit:xt,portalHint:{direction:Y(-.34*x,0,.94)},maples:c0};let o0=null,Bt=null;const ho=w.uSwallow??.29,po=w.uMirrorOff??.47,a0=new a.Vector2,jo=new a.Vector3,Go=new a.Vector3,n0=e=>e&&e.isColor?e:new a.Color(e),K0={object:Ee,radius:80,height:63,center:Y(0,9,6),anchors:uo,mirror:lo,ground:!1,groundY:T,season:L,hour:F,side:x,rainW:oe,hillAt:rt,pondM:ut,solidMat:me,triangles:Math.round(Ve),uniforms:g,setProgress(e){o0=e,Bt=(e-ho)/.08},setSwallows(e){Bt=e},setSky(e,t,o=1){e&&(g.uZen.value.copy(n0(e)).multiplyScalar(o),g.uSky.value.copy(g.uZen.value)),t&&(g.uHor.value.copy(n0(t)).multiplyScalar(o),g.uMistCol.value.copy(g.uHor.value))},setMist(e,t){g.uMist.value=e,t&&g.uMistCol.value.copy(n0(t))},update(e,t,o){if(g.uTime.value=t,U.uMirWet.value.w=t,g.uSunA.value.w=t,Ee.updateWorldMatrix(!0,!1),Vt.copy(Ee.matrixWorld).invert(),g.uInv.value.copy(Vt),h.renderer&&h.renderer.getDrawingBufferSize&&(h.renderer.getDrawingBufferSize(a0),a0.y>0&&(g.uViewH.value=a0.y)),mo(Bt??t/9%1*1.5-.25,t),ot.visible=T0&&(o0==null||o0<po),ot.visible)for(const r of Mt)r.userData.live?O0(r):r.visible=r.userData.src.visible},dispose(){g.uShade.value&&g.uShade.value.dispose()}};return K0.update(0,0,null),K0}export{Xo as buildHero};
