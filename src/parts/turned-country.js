import*as d from"three";import{mergeGeometries as Re}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as Ae,lerp as ne,smoothstep as fe}from"../kit/core.js";const ge=Math.PI*2,Ve=["#15110E","#D33B22","#E4B23F","#EBDAB6","#7E9F6B","#D2E2E4","#9C6B45"],i={PLAIN:0,BERRY:1,COMMA:2,LEAF:3,DOTS:4,REED:5,GOLD:6,GRAIN:7,RINGS:8,THREAD:9,PETAL:10,TOOL:11};function Ye(t){const r=t/.6;return Ae((r*(r+.0245786)-90537e-9)/(r*(.983729*r+.432951)+.238081),0,1)}function We(t){let r=0,e=4;for(let s=0;s<28;s++){const o=(r+e)*.5;Ye(o)<t?r=o:e=o}return(r+e)*.5}function se(t){const r=new d.Color(t),e=new d.Color(We(r.r),We(r.g),We(r.b)),s=e.r*.2126+e.g*.7152+e.b*.0722,o=1.12;return e.r=Math.max(.004,s+(e.r-s)*o),e.g=Math.max(.004,s+(e.g-s)*o),e.b=Math.max(.004,s+(e.b-s)*o),e}class be{constructor(){this.bands=[],this.r=0,this.y=0}at(r,e){return this.r=r,this.y=e,this}band(r,e){const s=[[this.r,this.y]];for(const n of e)s.push([n[0],n[1]]);this.bands.push({p:s,...r});const o=s[s.length-1];return this.r=o[0],this.y=o[1],this}bead(r,e,s,o){const n=this.r,v=this.y,f=[],h=e-n,B=s-v,T=Math.hypot(h,B)||1,G=B/T,U=-h/T;for(let S=1;S<=5;S++){const b=S/5,z=Math.sin(b*Math.PI);f.push([n+h*b+G*o*z,v+B*b+U*o*z])}return this.band({step:99,...r},f)}cove(r,e,s,o){return this.bead(r,e,s,-o)}}function Ie(t,r,e,s,o){const n=o*o,v=n*o;return .5*(2*r+(-t+e)*o+(2*t-5*r+4*e-s)*n+(-t+3*r-3*e+s)*v)}function Xe(t,r){const e=t.p,s=e.length,o=[];let n=0;for(let h=1;h<s;h++)n+=Math.hypot(e[h][0]-e[h-1][0],e[h][1]-e[h-1][1]);const v=(t.step||2.5)*r,f=Math.max(1,Math.ceil(n/v/(s-1)));for(let h=0;h<s-1;h++){const B=e[Math.max(0,h-1)],T=e[h],G=e[h+1],U=e[Math.min(s-1,h+2)];for(let S=0;S<f;S++){const b=S/f;o.push([Math.max(0,Ie(B[0],T[0],G[0],U[0],b)),Ie(B[1],T[1],G[1],U[1],b)])}}return o.push([e[s-1][0],e[s-1][1]]),o}function xe(t,r,e=1){const s=t.bands,o=new Array(s.length);let n=0,v=0;for(let L=0;L<s.length;L++){const u=Xe(s[L],e);o[L]=u,n+=u.length*(r+1),v+=(u.length-1)*r*6}const f=new Float32Array(n*3),h=new Float32Array(n*3),B=new Float32Array(n*2),T=new Float32Array(n*4),G=new Float32Array(n*3),U=new Float32Array(n*3),S=new Float32Array(n*4),b=n>65535?new Uint32Array(v):new Uint16Array(v),z=new Float64Array(r+1),P=new Float64Array(r+1);for(let L=0;L<=r;L++){const u=L/r*ge;z[L]=Math.sin(u),P[L]=Math.cos(u)}let k=0,N=0,p=0,M=0;for(let L=0;L<s.length;L++){const u=s[L],q=o[L],W=q.length,D=[0];for(let x=1;x<W;x++)D.push(D[x-1]+Math.hypot(q[x][0]-q[x-1][0],q[x][1]-q[x-1][1]));const I=D[W-1],Be=k+I*.5,re=I*.5,ce=u.c,$=u.c2||u.c,Te=u.n||12,ve=u.mo||0,C=u.spin||0,we=u.seed||0,Ge=u.hl||0,ie=u.gloss===void 0?1:u.gloss;for(let x=0;x<W;x++){const ue=q[Math.max(0,x-1)],de=q[Math.min(W-1,x+1)];let R=de[0]-ue[0],w=de[1]-ue[1];const ee=Math.hypot(R,w)||1;R/=ee,w/=ee;const y=w,me=-R,Me=q[x][0],ze=q[x][1],Oe=k+D[x],le=u.dark?ne(u.dark[0],u.dark[1],I>0?D[x]/I:0):1,Pe=ce.r*le,Ee=ce.g*le,qe=ce.b*le,Q=$.r*le,V=$.g*le,Y=$.b*le;for(let X=0;X<=r;X++,p++){const ke=z[X],Se=P[X];let pe=Me,a=y,l=me;if(u.thread){const te=(D[x]/u.thread+X/r)%1,j=1-Math.abs(te*2-1),Z=Math.min(1,Math.min(D[x],I-D[x])/(u.thread*.5));pe+=(j-.5)*u.thread*.55*Z;const K=(te<.5?1:-1)*.75*Z,J=Math.hypot(1,K);a=(y-K*R)/J,l=(me-K*w)/J}const c=p*3,m=p*4;f[c]=pe*ke,f[c+1]=ze,f[c+2]=pe*Se,h[c]=a*ke,h[c+1]=l,h[c+2]=a*Se,B[p*2]=X/r*ge,B[p*2+1]=Oe,T[m]=Be,T[m+1]=re,T[m+2]=Te,T[m+3]=ve,G[c]=Pe,G[c+1]=Ee,G[c+2]=qe,U[c]=Q,U[c+1]=V,U[c+2]=Y,S[m]=C,S[m+1]=we,S[m+2]=Ge,S[m+3]=ie}}for(let x=0;x<W-1;x++){const ue=q[x][0]<1e-4,de=q[x+1][0]<1e-4;for(let R=0;R<r;R++){const w=N+x*(r+1)+R,ee=w+1,y=w+r+1,me=y+1;ue||(b[M++]=w,b[M++]=ee,b[M++]=y),de||(b[M++]=ee,b[M++]=me,b[M++]=y)}}N+=W*(r+1),k+=I}const g=new d.BufferGeometry;g.setAttribute("position",new d.BufferAttribute(f,3)),g.setAttribute("normal",new d.BufferAttribute(h,3)),g.setAttribute("uv",new d.BufferAttribute(B,2)),g.setAttribute("aBand",new d.BufferAttribute(T,4)),g.setAttribute("aCol",new d.BufferAttribute(G,3)),g.setAttribute("aCol2",new d.BufferAttribute(U,3)),g.setAttribute("aFx",new d.BufferAttribute(S,4)),g.setIndex(new d.BufferAttribute(M<v?b.slice(0,M):b,1));let O=0,F=1/0,A=-1/0;for(const L of o)for(const u of L)u[0]>O&&(O=u[0]),u[1]<F&&(F=u[1]),u[1]>A&&(A=u[1]);return O+=1,g.boundingSphere=new d.Sphere(new d.Vector3(0,(F+A)/2,0),Math.hypot(O,(A-F)/2)),g.boundingBox=new d.Box3(new d.Vector3(-O,F,-O),new d.Vector3(O,A,O)),g}const Ke=`
attribute vec4 aBand, aFx; attribute vec3 aCol, aCol2;
uniform float uTime;
varying vec2 vUv; varying vec4 vBand, vFx; varying vec3 vCol, vCol2, vN, vP; varying float vR, vSpinA, vSpinW;
#include <common>
#include <fog_pars_vertex>
void main(){
  vUv = uv; vBand = aBand; vFx = aFx; vCol = aCol; vCol2 = aCol2;
  vR = length(position.xz);
  // free spin: a band may turn on its own. Its rate breathes between rest (flowers) and full speed (stripes).
  float th = uTime * 0.2618 + aFx.y * 6.2832;          // 24 s cycle, staggered by seed
  float c1 = 0.5 + 0.5 * cos(th);
  vSpinW = aFx.x * c1 * c1;
  vSpinA = mod(aFx.x * (0.375 * uTime + (0.5 * sin(th) + 0.0625 * sin(2.0 * th)) / 0.2618), 6.2832);   // constant per band, so safe to wrap
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vP = wp.xyz; vN = normalize(mat3(modelMatrix) * normal);
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,_e=`
precision highp float;
uniform vec3 uSun, uKey, uGold, uUmber, uSkyLo, uSkyHi;
uniform vec4 uBell[5]; uniform float uBellK[5];
uniform float uPix, uTime, uLathe;
uniform vec4 uWin; uniform vec3 uWinK;
uniform vec4 uGlow;   // the portal seat (world) and how far the kernel lid has lifted
varying vec2 vUv; varying vec4 vBand, vFx; varying vec3 vCol, vCol2, vN, vP; varying float vR, vSpinA, vSpinW;
#include <common>
#include <fog_pars_fragment>
float h11(float n){ return fract(sin(n * 127.1 + 3.7) * 43758.5453); }
float cov(float d, float e){ return 1.0 - smoothstep(-e, e, d); }
float atan2s(float y, float x){ return atan(y, abs(x) < 1e-5 ? 1e-5 : x); }
// spin smear: stretch a stroke round the axis by sm metres, and thin its paint so that paint is conserved
float gW;   // cell width in metres, set in main: strokes repeat with the cell so smears join into rings
float smearX(float p, float sm){ p = mod(p + 0.5 * gW, gW) - 0.5 * gW; return sign(p) * max(abs(p) - sm, 0.0); }
float thin(float chord, float sm){ return chord / max(chord + 2.0 * sm, 1e-4); }
float berry(vec2 p, vec2 o, float r, float sm, float e){
  vec2 v = vec2(smearX(p.x - o.x, sm), p.y - o.y);
  float dy = p.y - o.y, c = 2.0 * sqrt(max(r * r - dy * dy, 0.0));
  return cov(length(v) - r, e) * thin(max(c, r * 0.3), sm);
}
// tapered comma: an arc of radius rho from angle a0 over span, fat round head tapering to a point
float comma(vec2 p, vec2 ctr, float rho, float a0, float span, float t0, float sm, float e){
  vec2 v = vec2(smearX(p.x - ctr.x, sm), p.y - ctr.y);
  float ang = atan2s(v.y, v.x) - a0;
  ang = mod(ang + 6.2832 + 1.2, 6.2832) - 1.2;          // keep the branch cut away from the stroke
  float rel = clamp(ang, 0.0, span);
  vec2 q = rho * vec2(cos(a0 + rel), sin(a0 + rel));
  float k = rel / span, th = t0 * (1.0 - k * k) * (0.6 + 0.4 * (1.0 - k));   // fat round head, quick taper to a point
  return cov(length(v - q) - th, e) * thin(t0 * 1.4, sm);
}
// curled leaf: a one-and-a-quarter turn spiral, pointed at both ends, with a centre vein
float leaf(vec2 p, vec2 ctr, float m, float flip, float sm, float e){
  vec2 v = vec2(smearX(p.x - ctr.x, sm), (p.y - ctr.y)) * vec2(flip, 1.0);
  float rho = length(v), th = atan2s(v.y, v.x) + 3.14159;      // 0..2pi
  float b = m * 0.05, tMax = 7.6, best = 1e3, vein = 0.0;
  for (int k = 0; k < 2; k++) {
    float tt = min(th + 6.2832 * float(k), tMax);
    float x = tt / tMax, w = m * 0.115 * sin(3.14159 * sqrt(x)) * (0.35 + 0.65 * x);
    float dc = abs(rho - b * tt), d = dc - w;
    if (d < best) { best = d; vein = 1.0 - smoothstep(0.12 * w, 0.3 * w + 1e-4, dc + 0.5 * e); }
  }
  return cov(best, e) * (1.0 - 0.55 * vein * step(sm, 1e-4)) * thin(m * 0.2, sm);
}
float petal(vec2 p, float m, float sm, float e, out float eye){
  vec2 v = vec2(smearX(p.x, sm), p.y);
  float rho = length(v), th = atan2s(v.y, v.x);
  float c5 = abs(cos(2.5 * th));
  float d = rho - m * (0.2 + 0.24 * sqrt(c5));
  float ring = abs(rho - m * 0.13) ;
  eye = cov(rho - m * 0.105, e) * thin(m * 0.2, sm);
  return cov(d, e) * smoothstep(-e, e, ring - m * 0.022) * thin(m * 0.6, sm);
}
void main(){
  vec3 N = normalize(vN);
  vec3 Vv = cameraPosition - vP; float dist = length(Vv); vec3 V = Vv / max(dist, 1e-3);
  float NV = clamp(dot(N, V), 0.0, 1.0);
  float e = max(dist * uPix / max(NV, 0.25), 1e-4);            // pixel footprint in metres, no derivatives
  float motif = vBand.w, h = vBand.y, q = vUv.y - vBand.x, Nc = max(vBand.z, 1.0), seed = vFx.y;
  float W = 6.2832 * max(vR, 0.05) / Nc; gW = W;
  float cell = (vUv.x + vSpinA) * Nc / 6.2832 + seed;
  float id = floor(cell), p = (fract(cell) - 0.5) * W;
  float m = min(W, 2.0 * h);                                     // the stroke unit of this frieze
  float B = max(abs(vSpinW) * 0.05 * Nc / 6.2832, uLathe * 1.3);                    // smear in cells over a 1/20 s shutter
  float sm = min(B, 1.0) * W * 0.5;
  vec2 pq = vec2(p, q);
  vec3 paint = vCol; float a1 = 0.0, a2 = 0.0, mean1 = 0.0, mean2 = 0.0, goldMask = 0.0, satin = 0.0;
  vec3 Nl = N;
  if (motif < 0.5) {
  } else if (motif < 1.5) {                                      // berries in fives, gold dots, a gold tendril
    float r = 0.115 * m;
    a1 = berry(pq, vec2(0.0, 0.03 * m), r * 1.15, sm, e);
    a1 = max(a1, berry(pq, vec2(-0.21 * m, 0.19 * m), r, sm, e));
    a1 = max(a1, berry(pq, vec2(0.21 * m, 0.19 * m), r, sm, e));
    a1 = max(a1, berry(pq, vec2(-0.14 * m, -0.2 * m), r, sm, e));
    a1 = max(a1, berry(pq, vec2(0.14 * m, -0.2 * m), r, sm, e));
    a2 = berry(pq, vec2(0.5 * W, 0.27 * m), r * 0.55, sm, e);
    a2 = max(a2, berry(pq, vec2(0.5 * W, -0.27 * m), r * 0.55, sm, e));
    a2 = max(a2, comma(pq, vec2(0.5 * W, 0.0), 0.16 * m, -1.3, 2.6, 0.05 * m, sm, e));
    mean1 = 0.3; mean2 = 0.08;
  } else if (motif < 2.5) {                                      // strokework: commas up and down, gold dots between
    float mm = min(W * 0.5, 2.0 * h);
    a1 = comma(pq, vec2(-0.25 * W, -0.1 * mm), 0.27 * mm, -0.5, 2.5, 0.12 * mm, sm, e);
    a1 = max(a1, comma(pq * vec2(1.0, -1.0), vec2(0.25 * W, -0.1 * mm), 0.27 * mm, -0.5, 2.5, 0.12 * mm, sm, e));
    a2 = berry(pq, vec2(0.0, 0.0), 0.07 * mm, sm, e);
    a2 = max(a2, berry(pq, vec2(0.5 * W, 0.0), 0.07 * mm, sm, e));
    mean1 = 0.26; mean2 = 0.05;
  } else if (motif < 3.5) {                                      // curled leaves, turned alternately
    a1 = leaf(pq, vec2(0.0), m, mod(id, 2.0) * 2.0 - 1.0, sm, e);
    a2 = berry(pq, vec2(0.5 * W, 0.3 * m), 0.045 * m, sm, e);
    a2 = max(a2, berry(pq, vec2(0.5 * W, -0.3 * m), 0.045 * m, sm, e));
    mean1 = 0.3; mean2 = 0.03;
  } else if (motif < 4.5) {                                      // dot row
    a1 = berry(pq, vec2(0.0), 0.3 * m, sm, e); mean1 = 0.28;
  } else if (motif < 5.5) {                                      // reeding: flutes round the axis, in the normal
    vec3 T = cross(vec3(0.0, 1.0, 0.0), N); T /= max(length(T), 1e-4);
    float keepR = smoothstep(0.6, 2.0, W / e);
    Nl = normalize(N + T * 0.55 * sin(fract(cell) * 6.2832) * keepR);
  } else if (motif < 6.5) { goldMask = 1.0;
  } else if (motif < 7.5) {                                      // birch flank: long grain along s, sparse pores
    float ka = vUv.x * 38.2, w = 6.2832 * max(vR, 0.05) / 240.0, keepG = smoothstep(0.5, 2.0, w / e);
    float f = h11(floor(ka)) * 0.6 + h11(floor(ka * 3.0) + 17.0) * 0.4;
    float tick = step(0.9, h11(floor(ka * 2.0) * 3.1 + floor(vUv.y / 1.9 + h11(floor(ka * 2.0)) * 5.0)));
    paint *= 1.0 + (f - 0.5) * 0.11 * keepG; paint = mix(paint, uUmber, 0.16 * tick * keepG); satin = 1.0;
  } else if (motif < 8.5) {                                      // turned-off end grain: growth rings and pores
    float sp = max(vBand.z, 0.2), rr = vR / sp; rr += 0.33 * sin(rr * 0.9 + seed * 9.0);
    rr += 0.3 * sin(vUv.x * 3.0 + seed * 6.0) + 0.16 * sin(vUv.x * 7.0 + 1.3);
    float fr = fract(rr), dl = min(fr, 1.0 - fr) * sp, keepG = smoothstep(0.4, 1.6, 0.09 * sp / e);
    float ring = cov(dl - 0.07 * sp, e);
    float ka = vUv.x * 28.6, tick = step(0.82, h11(floor(ka) * 1.7 + floor(rr * 2.0)));
    paint = mix(paint, uUmber, mix(0.05, 0.3 * ring + 0.1 * tick * step(0.25, fr) * step(fr, 0.75), keepG)); satin = 1.0;
  } else if (motif < 9.5) {                                      // screw thread: umber in the grooves
    float ph = fract((q + h) / max(vBand.z, 0.1) + vUv.x / 6.2832);
    paint = mix(paint, uUmber * 0.8, 0.42 * smoothstep(0.3, 0.5, abs(ph - 0.5))); satin = 1.0;
  } else if (motif < 10.5) {                                     // five-petal flowers with gold eyes
    float eye; a1 = petal(pq, m, sm, e, eye); a2 = eye;
    a2 = max(a2, berry(pq, vec2(0.5 * W, 0.3 * m), 0.06 * m, sm, e));
    a2 = max(a2, berry(pq, vec2(0.5 * W, -0.3 * m), 0.06 * m, sm, e));
    mean1 = 0.34; mean2 = 0.06;
  } else {                                                       // bare inside walls: lathe tool lines round the axis, long grain
    float sp = max(vBand.z, 0.2), fr = fract((q + h) / sp), dl = min(fr, 1.0 - fr) * sp;
    float line = cov(dl - 0.06 * sp, e) * smoothstep(0.4, 1.6, 0.12 * sp / e);
    float ka = vUv.x * 38.2, f = h11(floor(ka)) * 0.6 + h11(floor(ka * 3.0) + 17.0) * 0.4;
    paint *= 1.0 + (f - 0.5) * 0.1 * smoothstep(0.5, 2.0, 6.2832 * max(vR, 0.05) / 240.0 / e);
    paint = mix(paint, uUmber, 0.26 * line); satin = 1.0;
    // one broad burnt ring for every four tool lines, in the middle of the bay between two of them and fading out to their
    // edges: measured along the solid's own profile in tool-line spacings, and in nothing else
    float bay = abs(fract((q + h) / (4.0 * sp) + 0.375) - 0.5) * 4.0;
    paint = mix(paint, paint * uUmber * 1.6, 0.45 * (1.0 - smoothstep(0.16, 0.44, bay)));
  }
  float keep = smoothstep(0.6, 2.2, 0.14 * m / e);               // strokes under two pixels fade to the ring mean
  a1 = mix(mean1, a1, keep); a2 = mix(mean2, a2, keep);
  paint = mix(paint, vCol2, a1); paint = mix(paint, uGold, a2); goldMask = max(goldMask, a2);
  float hlf = vFx.z;
  if (hlf > 7.5) {                                               // +8: V tool grooves round the axis, every vFx.x' metres (ground bands)
    hlf -= 8.0;
    float gsp = 0.55 + 1.3 * h11(floor(vBand.x * 0.37) + 2.0), gfr = fract(vUv.y / gsp), gdl = min(gfr, 1.0 - gfr) * gsp;
    float gl = cov(gdl - 0.05, e) * smoothstep(0.3, 1.4, 0.08 / e);
    float g2 = cov(abs(fract(vUv.y / (gsp * 4.0) + 0.37) - 0.5) * gsp * 4.0 - 0.16, e) * smoothstep(0.3, 1.4, 0.22 / e);
    paint = mix(paint, paint * uUmber * 1.6, 0.3 * gl + 0.34 * g2);
  }
  if (hlf > 3.5) { hlf -= 4.0; goldMask = max(goldMask, 1.0 - a1); }   // +4: the base coat itself is gold leaf
  if (hlf > 0.5) {                                               // gold hairlines at the band's edges (2: one centre line)
    float hw = clamp(h * 0.1, 0.03, 0.42);
    float d = hlf > 1.5 ? abs(q) - hw : abs(abs(q) - (h - 2.2 * hw)) - hw;
    float al = cov(d, e) * mix(0.35, 1.0, smoothstep(0.3, 1.2, hw / e));
    paint = mix(paint, uGold, al); goldMask = max(goldMask, al);
  }
  // faked shadows: a soft disc straight under every lifted bell, widening and fading with height
  vec3 shadow = vec3(1.0);
  for (int i = 0; i < 5; i++) {
    float hg = uBell[i].z - vP.y;
    float Rr = uBell[i].w * 1.15 + max(hg, 0.0) * 0.1, d = length(vP.xz - uBell[i].xy);
    float sh = (1.0 - smoothstep(Rr * 0.62, Rr, d)) * step(0.5, hg) * uBellK[i] / (1.0 + max(hg, 0.0) * 0.004);
    shadow *= mix(vec3(1.0), vec3(0.58, 0.47, 0.40), sh);
  }
  // base coat: flat two-step light, shade tinted umber, never grey
  float wrap = smoothstep(-0.105, 0.105, dot(Nl, uSun));
  vec3 shadeTint = 0.62 * mix(vec3(1.0), uUmber / max(dot(uUmber, vec3(0.333)), 1e-3), 0.3);
  vec3 col = paint * mix(shadeTint, vec3(1.0), wrap) * uKey * shadow;
  // clear coat, never spun: one four-pane window per solid, fixed in the world
  vec3 R = reflect(-V, N);
  vec3 ax = cross(uSun, vec3(0.0, 1.0, 0.0)); ax /= max(length(ax), 1e-4);
  vec3 ay = cross(ax, uSun);
  float rs = dot(R, uSun);
  vec2 wv = vec2(dot(R, ax), dot(R, ay)); wv.x += wv.y * uWin.z;             // uWin: half width, half height, slant, soft edge
  vec2 dq = abs(wv) - uWin.xy + 0.04;
  float dw = length(max(dq, 0.0)) + min(max(dq.x, dq.y), 0.0) - 0.04;
  float win = (1.0 - smoothstep(0.0, max(uWin.w, 1e-3), dw)) * mix(1.0, smoothstep(0.008, 0.024, min(abs(wv.x), abs(wv.y))), uWinK.y) * step(0.0, rs);
  float gloss = vFx.w * (1.0 - satin);
  float lit = mix(0.25, 1.0, wrap) * mix(0.5, 1.0, min(shadow.g * 1.6 - 0.6, 1.0));
  col += uKey * win * uWinK.x * gloss * lit;
  float rs2 = max(rs, 0.0); rs2 *= rs2; rs2 *= rs2;                        // (R.S)^4
  col += paint * goldMask * (rs2 * rs2 * 0.75 + rs2 * 0.25) * gloss * lit; // gold's second, broad highlight keeps its hue
  col += paint * satin * rs2 * 0.16 * lit;                                 // satin birch: one wide dim highlight
  float fr = 1.0 - NV; float fr5 = fr * fr; fr5 = fr5 * fr5 * fr;
  vec3 sky = mix(uSkyLo, uSkyHi, smoothstep(-0.1, 0.8, R.y));
  col += sky * (0.04 + 0.5 * fr5) * mix(0.35, 1.0, gloss) * mix(0.6, 1.0, shadow.g);
  // gold light pours out from under the kernel lid: everything within a dozen metres of the seat takes it
  vec3 gv = uGlow.xyz - vP; float gd2 = dot(gv, gv);
  float gk = uGlow.w / (1.0 + gd2 / 46.0), gn = 0.3 + 0.7 * clamp(dot(N, gv) / sqrt(max(gd2, 1e-4)), 0.0, 1.0);
  col += (paint * 0.75 + 0.16 * smoothstep(0.03, 0.2, paint.g)) * vec3(2.1, 1.32, 0.5) * gk * gn;   // black lacquer stays black
  col = mix(col, uSkyLo, 0.15 * smoothstep(900.0, 1500.0, dist));         // far solids lean to horizon cream, no fog
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`;function Ze(t,r){return new d.ShaderMaterial({uniforms:Object.assign(d.UniformsUtils.merge([d.UniformsLib.fog]),t),vertexShader:Ke,fragmentShader:_e,fog:!!r})}function H(t,r,e=1.1){return Math.max(6,Math.round(ge*t/(r*e)))}function Le(t,r){if(r.stroke)for(const e of t.bands)e.c2&&(e.c2=r.stroke(e.c,e.c2))}function Je(t,r,e,s){const o=r/180,n=r*.158,v=new be,f=s.seed,h={c:e.base,c2:e.s1};return v.at(.82*t,0),v.band({...h,step:1.5*o},[[.86*t,.6*o]]),v.bead({c:e.gold,mo:i.GOLD},.875*t,4*o,1.7*o),v.cove({...h,mo:i.REED,n:H(t,2.2*o)},.93*t,8.6*o,1*o),v.band({...h,mo:s.dishMo,n:H(t,14.5*o,s.cellK),hl:1,seed:f,spin:s.dishSpin,step:3.4*o},[[.975*t,12.5*o],[1*t,18.5*o],[1*t,23.6*o]]),v.bead({c:e.gold,mo:i.GOLD},.985*t,27.1*o,1.5*o),v.band({...h,step:1.2*o},[[.975*t,27.9*o],[.955*t,n]]),v.band({c:e.birch,mo:i.RINGS,n:1.4*o,seed:f,gloss:0,step:2*o},[[.928*t,n]]),v.band({c:e.birch,mo:i.THREAD,n:1*o,thread:1*o,gloss:0,step:.25*o},[[.925*t,n+1*o],[.925*t,n+2*o]]),v.bead({...h,hl:2},.885*t,n+1.8*o,.95*o),v.band({...h,c2:e.gold,mo:i.DOTS,n:H(.87*t,5*o,1.3),spin:s.spin[1]*.6,seed:f+.1,step:3*o},[[.872*t,n-2.6*o],[.866*t,n-6.4*o]]),v.bead({c:e.gold,mo:i.GOLD},.862*t,n-8*o,.55*o),v.band({c:e.birch,mo:i.TOOL,n:2.2*o,gloss:0,dark:[1,.7],step:5*o},[[.858*t,12*o],[.845*t,5.5*o],[.8*t,2.8*o]]),v.band({c:e.birch,mo:i.RINGS,n:2.3*o,seed:f+.3,gloss:0,dark:[.7,.86],step:9*o},[[.5*t,2.2*o],[.3*t,2.2*o]]),Le(v,e),v}function $e(t,r,e,s){const o=r/180,n=r*.158,v=n/o,f=new be,h=s.seed,B=s.full,T=s.neck,G={c:e.base,c2:e.s1},U=e.goldBase?4:0,S={c:e.gold,mo:i.GOLD},b=55+s.j[0],z=93+s.j[1],P=124+s.j[2],k=.885,N=.7*B,p=.37*B*T;f.at(0,(P+13.6)*o),f.band({c:e.birch,mo:i.RINGS,n:2.6*o,seed:h,gloss:0,dark:[.26,.32],step:7*o},[[.1*t,(P+13.2)*o],[(p-.1)*t,(P+4)*o]]),f.band({c:e.birch,mo:i.TOOL,n:3.2*o,gloss:0,dark:[.25,.7],step:14*o},[[(p-.03)*t,(P-6)*o],[(N-.075)*t,z*o],[(k-.085)*t,(b+4)*o],[.9*t,(v+16)*o],[.928*t,(v+9)*o]]),f.bead(S,.932*t,(v+7.4)*o,.5*o),f.band({...G,c2:e.gold,mo:i.DOTS,n:H(.93*t,5.6*o,1.3),seed:h+.7,dark:[.8,1],step:4*o},[[.934*t,(v+3.6)*o],[.936*t,(v+.3)*o]]),f.band({c:e.birch,mo:i.RINGS,n:1.4*o,seed:h,gloss:0,step:2*o},[[.965*t,n+.05*o]]),f.band({...G,step:1.2*o},[[.992*t,n+.5*o],[1*t,n+1.4*o]]),f.bead(S,.995*t,n+5*o,1.7*o),f.band({...G,c2:e.s1,mo:s.mo[0],n:H(.94*t,(b-v-9)*o,s.cellK),hl:1+U,seed:h,step:3.6*o},[[.972*t,(v+8.5)*o],[.915*t,(v+(b-v)*.52)*o],[(k+.006)*t,(b-1)*o]]),f.band({c:e.cb,step:1*o},[[(k+.014)*t,(b+.6)*o]]),f.bead({c:e.cb,c2:e.gold,mo:i.DOTS,n:H(k*t,4.2*o,1.5),spin:s.spin[0],seed:h+.21},(k-.005)*t,(b+5)*o,2.1*o),f.cove({...G,mo:i.REED,n:H(k*t,2.4*o)},(k-.03)*t,(b+8.5)*o,.9*o),f.band({...G,c2:e.s2,mo:s.mo[1],n:H(.82*t,(z-b-10)*o,s.cellK),hl:1+U,seed:h+.4,step:3.6*o},[[(k-.036)*t,(b+12.5)*o],[((k-.036+N+.02)*.5+.052)*t,ne(b+12.5,z,.5)*o],[(N+.02)*t,(z-1)*o]]),f.bead(S,(N+.02)*t,(z+1.6)*o,1*o),f.bead({c:e.s3,c2:e.s1,mo:i.BERRY,n:H(N*t,5.4*o,1.25),spin:-s.spin[1],seed:h+.63},(N+.005)*t,(z+7)*o,2.5*o),f.bead(S,(N-.02)*t,(z+8.6)*o,1*o),f.band({...G,c2:e.s4,mo:s.mo[2],n:H(.56*t*B,(P-z-12)*o,s.cellK),hl:1+U,seed:h+.8,step:3.4*o},[[(N-.04)*t,(z+12)*o],[(ne(N,p,.42)+.035)*t,ne(z+12,P,.56)*o],[(p+.035)*t,(P-1)*o]]),f.bead({c:e.cb,c2:e.gold,mo:i.DOTS,n:H(p*t,3.4*o,1.5),spin:s.spin[2],seed:h+.9},(p+.01)*t,(P+4.4)*o,2*o),f.band({c:e.gold,mo:i.GOLD,step:.8*o},[[(p-.03)*t,(P+5.2)*o]]),f.cove({...G,mo:i.REED,n:s.reeds,step:3*o},.19*T*t,(P+19)*o,3.2*o*s.waistCut),f.bead(S,.17*T*t,(P+22.4)*o,1.5*o);const M=P+23,g=s.onionH,O=s.onionW*t;return f.band({c:e.fin,c2:e.gold,mo:i.COMMA,n:s.finN,hl:1,seed:h+.5,step:2.8*o},[[.11*t,(M+.4)*o],[O*.8,(M+.16*g)*o],[O,(M+.36*g)*o],[O*.66,(M+.62*g)*o],[O*.3,(M+.84*g)*o],[.045*t,(M+g)*o]]),f.bead(S,.03*t,(M+g+3.4)*o,1.9*o),f.band({c:e.gold,mo:i.GOLD,step:2.5*o},[[.022*t,(M+g+5)*o],[.012*t,(M+g+8)*o],[0,(M+g+11.4)*o]]),f.top=(M+g+11.4)*o,Le(f,e),f}function Ce(t,r){const e=new be,s=r.seed;return e.at(0,19.2),e.band({c:t.birch,mo:i.RINGS,n:.5,seed:s,gloss:0,dark:[.34,.4],step:1.6},[[3.5,18.6],[6.2,16.2]]),e.band({c:t.birch,mo:i.TOOL,n:.8,gloss:0,dark:[.4,.95],step:1.8},[[8.4,12.5],[9.2,8],[9.3,5.05]]),e.band({c:t.birch,mo:i.RINGS,n:.34,seed:s,gloss:0,step:1},[[9.75,5.02]]),e.bead({c:t.birch,mo:i.GRAIN,gloss:0},10,6.3,.42),e.cove({c:t.umber,mo:i.PLAIN,gloss:0},9.96,6.75,.12),e.band({c:t.birch,mo:i.GRAIN,gloss:0,step:.9},[[9.97,7.65],[9.9,9],[9.75,10.1]]),e.cove({c:t.umber,mo:i.PLAIN,gloss:0},9.67,10.55,.12),e.bead({c:t.birch,mo:i.GRAIN,gloss:0,step:.4},9.33,12.15,.6),e.cove({c:t.umber,mo:i.PLAIN,gloss:0},9.2,12.6,.12),e.band({c:t.birch,mo:i.GRAIN,gloss:0,step:.9},[[8.48,14.34],[7.6,15.9],[5.6,18.1]]),e.cove({c:t.umber,mo:i.PLAIN,gloss:0},5.3,18.4,.1),e.band({c:t.birch,mo:i.RINGS,n:.42,seed:s+.2,gloss:0,step:.8},[[3.6,19.6],[1.5,20.2]]),e.bead({c:t.birch,mo:i.GRAIN,gloss:0},1.1,20.9,.38),e.band({c:t.gold,mo:i.GOLD,step:.35},[[.75,21.2],[1,21.7],[.6,22.4],[0,22.9]]),e.top=22.9,Le(e,t),e}function et(t,r){const e=new be,s=r.seed;return e.at(5.4,0),e.bead({c:t.birch,mo:i.GRAIN,gloss:0},5.8,1.1,.4),e.cove({c:t.umber,mo:i.PLAIN,gloss:0},5.9,1.4,.1),e.band({c:t.birch,mo:i.GRAIN,gloss:0,step:.7},[[7.6,2.2],[9.4,3.6],[9.95,4.6]]),e.bead({c:t.birch,mo:i.GRAIN,gloss:0},9.7,5,.3),e.band({c:t.birch,mo:i.RINGS,n:.34,seed:s,gloss:0,step:1},[[9.25,5]]),e.band({c:t.gold,mo:i.GOLD,step:.4},[[9,4.75],[8.75,4.3]]),e.band({c:t.black,c2:t.gold,mo:i.DOTS,n:36,spin:r.spin[0]*.5,seed:s,step:.7},[[7.6,3.5],[5.2,2.75],[2.4,2.45],[0,2.4]]),Le(e,t),e}function tt(t,r){const e=new be;return e.at(7.1,-.42),e.band({c:t.black,c2:t.verm,mo:i.COMMA,n:16,hl:1,seed:r.seed,spin:r.spin[0]*.12,step:.9},[[8.6,-.8],[10.6,-.5],[12.8,.9],[14.5,2.8]]),e.bead({c:t.gold,mo:i.GOLD,step:.3},13.9,3.6,.42),e.band({c:t.black,step:.5},[[13.2,3.2],[11.6,1.95],[10,1.05],[8.95,.78]]),e.bead({c:t.verm,c2:t.gold,mo:i.DOTS,n:52,spin:-r.spin[1]*.6,seed:r.seed+.4,step:.3},8.75,.74,.14),e.bead({c:t.gold,mo:i.GOLD,step:.25},7.75,.66,.5),e.band({c:t.black,step:.5},[[7.1,.42]]),e.bead({c:t.verm,c2:t.gold,mo:i.DOTS,n:44,spin:r.spin[1],seed:r.seed,step:.3},7.1,-.42,.34),Le(e,t),e}const he=[[60,180],[43,130],[30,90],[19,56]],ye=t=>(t=Ae(t,0,1),t*t*t*(t*(t*6-15)+10));async function nt(t,r={}){const e=t.rng.fork?t.rng.fork("nesting-mountain"):t.rng,s=r.palette&&r.palette.length>=7?r.palette:Ve,o=Ae(r.detail??t.quality?.detail??1,.6,1),n={black:se(s[0]),verm:se(s[1]),gold:se(s[2]),birch:se(s[3]),sage:se(s[4]),blue:se(s[5]),umber:se(s[6])};n.cream=se("#F1ECE0");const v=new d.Vector3().copy(r.sunDir||new d.Vector3(-.42,.81,.41)).normalize(),f=[{base:n.black,s1:n.verm,s2:n.verm,s3:n.cream,s4:n.gold,cb:n.verm,fin:n.verm},{base:n.verm,s1:n.black,s2:n.black,s3:n.cream,s4:n.gold,cb:n.black,fin:n.black},{base:n.sage,s1:n.cream,s2:n.cream,s3:n.cream,s4:n.gold,cb:n.black,fin:n.verm},{base:n.gold,s1:n.verm,s2:n.black,s3:n.cream,s4:n.black,cb:n.verm,fin:n.verm,goldBase:!0}];f[2].s1=n.verm;for(const a of f)a.gold=n.gold,a.birch=n.birch,a.black=n.black,a.umber=n.umber;const h={birch:n.birch,gold:n.gold,black:n.black,verm:n.verm,umber:n.umber},B=new Map([[n.black,s[0]],[n.verm,s[1]],[n.gold,s[2]],[n.birch,s[3]],[n.sage,s[4]],[n.blue,s[5]],[n.umber,s[6]],[n.cream,"#F1ECE0"]].map(([a,l])=>{const c=new d.Color(l).getHex();return[a,[c>>16&255,c>>8&255,c&255]]})),T=(a,l)=>{const c=B.get(a),m=B.get(l);return Math.hypot(c[0]-m[0],c[1]-m[1],c[2]-m[2])},G=[n.black,n.verm,n.gold,n.sage],U=(a,l)=>l===a||!B.has(a)||!B.has(l)||T(a,l)>=90?l:G.reduce((c,m)=>T(a,m)>T(a,c)?m:c);for(const a of[...f,h])a.stroke=U;const S=[[i.COMMA,i.PETAL,i.LEAF],[i.BERRY,i.COMMA,i.LEAF],[i.PETAL,i.BERRY,i.LEAF],[i.COMMA,i.LEAF,i.BERRY],[i.PETAL,i.COMMA,i.LEAF],[i.BERRY,i.PETAL,i.COMMA]],b=e.int(0,5),z=he.map((a,l)=>({dishSpin:e.range(.16,.3)*(l%2?-1:1),seed:e(),full:e.range(.95,1.06),neck:e.range(.9,1.1),waistCut:e.range(.8,1.25),j:[e.range(-2.5,2.5),e.range(-2.5,2.5),e.range(-2.5,2.5)],mo:l===2?[e.pick([i.PETAL,i.BERRY]),e.pick([i.COMMA,i.PETAL]),i.LEAF]:S[(b+l*2)%6],dishMo:e.pick([i.COMMA,i.BERRY,i.LEAF]),cellK:e.range(.95,1.3),spin:[e.range(1.6,2.6)*e.sign(),e.range(1.8,3),e.range(2.5,4)*e.sign()],reeds:e.int(26,40),finN:e.int(7,11),onionH:e.range(20.4,22.6),onionW:e.range(.22,.27)})),P={seed:e(),spin:[e.range(2,3),e.range(2.5,3.5)*e.sign()]},k={uTime:{value:0},uSun:{value:v},uKey:{value:new d.Color(r.keyColor||"#ffffff")},uGold:{value:n.gold},uUmber:{value:n.umber},uSkyLo:{value:new d.Color(r.skyLow||"#F4E9D0")},uSkyHi:{value:new d.Color(r.skyHigh||s[5])},uBell:{value:[0,1,2,3,4].map(()=>new d.Vector4(0,0,-1e4,1))},uBellK:{value:[0,0,0,0,0]},uPix:{value:.0012},uLathe:{value:0},uWin:{value:new d.Vector4(.16,.22,0,.03)},uWinK:{value:new d.Vector3(1.6,1,0)},uGlow:{value:new d.Vector4(0,12,0,0)}},N=Ze(k,r.fog),p=new d.Group;p.name="nesting-mountain";const M=[96,88,80,64,48].map(a=>Math.round(a*(.75+.25*o)/4)*4),g=[],O=[],F=[],A=[];for(let a=0;a<4;a++){const[l,c]=he[a],m=$e(l,c,f[a],z[a]),te=xe(m,M[a],1),j=new d.Mesh(te,N);j.name="bell"+a,j.frustumCulled=!1,p.add(j),g.push(j),F.push(m.top),A.push(c*.158),await t.yield?.(),O.push(xe(Je(l,c,f[a],z[a]),M[a],1)),await t.yield?.()}{const a=Ce(h,P),l=xe(a,M[4],1),c=new d.Mesh(l,N);c.name="kernel-lid",c.frustumCulled=!1,p.add(c),g.push(c),F.push(a.top),A.push(5),O.push(xe(et(h,P),M[4],1))}await t.yield?.();const L=Re(O,!1);L.boundingSphere=new d.Sphere(new d.Vector3(0,16,0),72),L.boundingBox=new d.Box3(new d.Vector3(-62,0,-62),new d.Vector3(62,34,62)),await t.yield?.();const u=new d.Mesh(L,N);u.name="dishes",p.add(u);for(const a of O)a.dispose();const q=d.MathUtils.degToRad(25),W=new d.Vector3(0,16,0),D=new d.Vector3(0,Math.sin(q),Math.cos(q)),I=new d.Mesh(xe(tt(h,P),96,1),N);I.name="portal-frame",I.position.copy(W),I.rotation.x=Math.PI/2-q,I.visible=r.portalFrame!==!1,p.add(I);const Be=new d.ShaderMaterial({transparent:!0,depthWrite:!1,blending:d.AdditiveBlending,fog:!1,uniforms:{uTime:k.uTime,uOpen:{value:0},uCol:{value:new d.Color(s[2])}},vertexShader:"varying vec2 vQ; void main(){ vQ = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`uniform float uTime, uOpen; uniform vec3 uCol; varying vec2 vQ;
      void main(){ float r = length(vQ), a = atan(vQ.y, abs(vQ.x) < 1e-5 ? 1e-5 : vQ.x);
        float bands = 0.5 + 0.5 * sin(r * 22.0 - uTime * 1.7 + 2.0 * sin(a * 3.0 + uTime * 0.6));
        float core = 1.0 - smoothstep(0.0, 1.0, r);
        vec3 c = mix(uCol * 1.3, vec3(1.0, 0.8, 0.5) * 1.9, core * core) * (0.5 + 0.5 * bands);
        gl_FragColor = vec4(c * uOpen * (1.0 - smoothstep(0.93, 1.0, r)), 1.0); }`}),re=new d.Mesh(new d.CircleGeometry(1,48),Be);re.name="portal-glow",re.scale.setScalar(7.05),re.position.copy(W).addScaledVector(D,-.45),re.rotation.x=-q,re.visible=r.portalGlow!==!1,p.add(re);const ce=new d.ShaderMaterial({transparent:!0,depthWrite:!1,blending:d.AdditiveBlending,fog:!1,uniforms:{uSeat:{value:W.clone()},uK:{value:0},uSize:{value:15},uTime:k.uTime},vertexShader:`uniform vec3 uSeat; uniform float uSize; varying vec2 vQ;
      void main(){ vQ = position.xy; vec4 c = viewMatrix * vec4(uSeat, 1.0);
        float dl = max(length(c.xyz), 1e-3); c.xyz -= c.xyz / dl * min(9.0, dl * 0.5);          // stand 9 m toward the eye: clear of the ring
        c.xy += position.xy * uSize; gl_Position = projectionMatrix * c; }`,fragmentShader:`uniform float uK, uTime; varying vec2 vQ;
      void main(){ float r = length(vQ), core = exp(-r * r * 16.0), mid = exp(-r * r * 3.6), far = max(1.0 - r, 0.0);
        float breathe = 0.94 + 0.06 * sin(uTime * 1.3);
        vec3 c = vec3(1.0, 0.8, 0.46) * core * 1.5 + vec3(1.0, 0.6, 0.2) * (mid * 0.85 + far * far * 0.2);
        gl_FragColor = vec4(c * uK * breathe, 1.0); }`}),$=new d.Mesh(new d.PlaneGeometry(2,2),ce);$.name="seat-halo",$.frustumCulled=!1,$.renderOrder=3,$.visible=r.seatHalo!==!1,p.add($);const Te=new d.ShaderMaterial({fog:!1,uniforms:{uTime:k.uTime,uK:{value:0}},vertexShader:`varying vec3 vN, vV; varying float vL;
      void main(){ vL = position.y; vec4 mv = modelViewMatrix * vec4(position, 1.0); vV = mv.xyz; vN = normalMatrix * normal; gl_Position = projectionMatrix * mv; }`,fragmentShader:`uniform float uTime, uK; varying vec3 vN, vV; varying float vL;
      void main(){ vec3 n = normalize(vN + vec3(0.0, 0.0, 1e-5)), v = normalize(-vV + vec3(0.0, 0.0, 1e-5));
        float nv = abs(dot(n, v)), bands = 0.5 + 0.5 * sin(vL * 3.6 - uTime * 1.4);
        vec3 c = mix(vec3(1.05, 0.42, 0.07), vec3(1.7, 1.02, 0.3), nv * nv) * (0.88 + 0.12 * bands);
        gl_FragColor = vec4(c * uK, 1.0); }`}),ve=new d.Group;ve.position.copy(W),ve.rotation.x=Math.PI/2-q,p.add(ve);const C=new d.Mesh(new d.SphereGeometry(6.7,40,24),Te);C.name="seat-pearl",C.frustumCulled=!1,C.visible=!1,ve.add(C),await t.yield?.();const we=new d.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,blending:d.CustomBlending,blendSrc:d.DstColorFactor,blendDst:d.ZeroFactor,uniforms:{uK:{value:1}},vertexShader:"varying vec2 vQ; void main(){ vQ = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:"uniform float uK; varying vec2 vQ; void main(){ float a = (1.0 - smoothstep(0.54, 1.0, length(vQ))) * uK; gl_FragColor = vec4(mix(vec3(1.0), vec3(0.58, 0.47, 0.40), a), 1.0); }"}),Ge=new d.CircleGeometry(1,40),ie=[];for(let a=0;a<5;a++){const l=we.clone();l.uniforms.uK={value:0};const c=new d.Mesh(Ge,l);c.rotation.x=-Math.PI/2,c.position.y=.12,c.renderOrder=2,c.name="shadow"+a,c.visible=r.groundShadows!==!1,p.add(c),ie.push(c)}{const a=we.clone();a.uniforms.uK={value:.9};const l=new d.Mesh(Ge,a);l.rotation.x=-Math.PI/2,l.position.y=.1,l.scale.setScalar(he[0][0]*1.22),l.renderOrder=2,l.name="shadow-base",l.visible=r.groundShadows!==!1,p.add(l),ie.push(l)}const x=d.MathUtils.degToRad(188+e.range(-3,3)),ue=d.MathUtils.degToRad(73+e.range(-3,3)),de=[230,200,175,150],R=[140,150,165,190],w=[{a:-.18,b:.14,L1:104,cv:.42,d:.14,c:.42},{a:.18,b:.33,L1:76,cv:.8,d:.33,c:.56},{a:.48,b:.56,L1:100-A[2],cv:.8,d:.56,c:.82},{a:.58,b:.64,L1:19,cv:.74,d:.7,c:.9},{a:.63,b:.66,L1:14,cv:.72,d:.66,c:.76}];for(let a=0;a<5;a++){const l=w[a];if(a<4){const c=x+ue*a;l.hx=Math.sin(c)*de[a],l.hz=Math.cos(c)*de[a],l.Lh=R[a]-A[a],l.thr=2.6*he[a][1]/180,l.R=he[a][0]}else l.hx=7,l.hz=-30,l.Lh=40,l.thr=.6,l.R=10;l.dir=e.sign(),l.bob=e.range(0,ge),l.turn=0}w[0].s={u0:.5,u1:.605,x:w[0].hx,z:w[0].hz,lift:52-A[0]},w[1].s={u0:.53,u1:.62,x:-124,z:-135,lift:54-A[1]},w[2].s={u0:.535,u1:.612,x:74,z:-70,lift:60-A[2]};function ee(a,l,c={}){const m=w[a],te=ye((l-m.a)/(.4*(m.b-m.a))),j=m.a+.35*(m.b-m.a),Z=m.b-.35*(m.b-j);c.y=m.thr*te+(m.L1-m.thr)*ye((l-j)/(m.b-j))+(m.Lh-m.L1)*ye((l-Z)/(m.cv-Z));const K=ye((l-m.d)/(m.c-m.d));if(c.x=m.hx*K,c.z=m.hz*K,c.q=te,c.w=K,m.s){const J=ye((l-m.s.u0)/(m.s.u1-m.s.u0));c.x=ne(c.x,m.s.x,J),c.z=ne(c.z,m.s.z,J),c.y=ne(c.y,m.s.lift,J),c.w=Math.max(K,J)}return c}const y=(a,l,c)=>new d.Vector3(a,l,c),me=W.clone().addScaledVector(D,60),Me=ee(1,.42),ze=[];for(let a=0;a<=10;a++){const l=a/10,c=d.MathUtils.degToRad(-158-450*l),m=ne(52,85,Math.sin(Math.min(l*1.6,1)*Math.PI*.5));ze.push(y(Math.sin(c)*m,ne(86,40,ye(l)),Math.cos(c)*m))}const Oe=[[80,100,41],[50,118,42],[25,124,43],[8,108,45]].map(([a,l,c])=>{const m=d.MathUtils.degToRad(a);return y(Math.sin(m)*l,c,Math.cos(m)*l)}),le={portalSeat:{position:W.clone(),normal:D.clone(),radius:7,tiltDeg:25},diveStart:me,diveDir:D.clone().negate(),flyThrough:[y(0,8,600),y(0,8,300),y(-4,30,205),y(-11,86,52),y(-12,86,0),y(-14,86,-30),...ze,...Oe,y(1.5,49,82),me.clone(),W.clone()],closePass:{u:.42,camera:y(-12,86,0),sageCrown:y(0,F[2],0),vermilionLip:y(Me.x+he[1][0],A[1]+Me.y,Me.z)},summits:[{u:0,y:F[0]},{u:.14,y:F[1]},{u:.33,y:F[2]},{u:.56,y:F[3]},{u:.64,y:F[4]},{u:.67,y:W.y}],rims:[0,1,2,3].map(a=>({radius:he[a][0],y:A[a]+w[a].thr})).concat([{radius:10,y:5}]),hang:w.map((a,l)=>a.s?{position:y(a.s.x,A[l]+a.s.lift,a.s.z),radius:a.R,top:F[l]-A[l]}:{position:y(a.hx,A[l]+a.Lh,a.hz),radius:a.R,top:F[l]-A[l]}),hangEarly:[1,2].map(a=>({position:y(w[a].hx,A[a]+w[a].Lh,w[a].hz),radius:w[a].R})).concat([{position:y((w[1].hx-124)/2,100,(w[1].hz-135)/2),radius:43}]),viewpoints:{entry:y(0,8,600),threeBells:y(60,62,60),finalRims:y(0,40,60)},extent:{radius:292,height:300},sunDir:v.clone()};let Pe=null;const Ee=r.fixedU??null,qe=!!r.orbitDemo,Q={},V=new d.Vector3,Y=new d.Vector3,X=new d.Vector2,ke=w.map(()=>({x:0,z:0,y:0,radius:1,strength:0}));function Se(a,l,c){k.uTime.value=l;let m=Pe;if(m===null)if(Ee!==null)m=Ee;else if(qe&&c){Y.setFromMatrixPosition(c.matrixWorld),p.worldToLocal(Y);let E=Math.atan2(Y.x,Y.z);E<-.6&&(E+=ge),m=Ae((E+.3)/4.4,0,1)}else m=Math.min(1,l/47%1.2);c&&t.renderer?.getDrawingBufferSize&&(t.renderer.getDrawingBufferSize(X),X.y>0&&c.fov&&(k.uPix.value=2*Math.tan(d.MathUtils.degToRad(c.fov)*.5)/X.y)),p.updateWorldMatrix(!0,!1);const te=p.matrixWorld.getMaxScaleOnAxis();for(let E=0;E<5;E++){const _=w[E],oe=g[E];ee(E,m,Q);const je=fe(_.thr,_.thr+12,Q.y);_.turn+=Math.min(a,.1)*(ge/30)*_.dir*je;const Ue=Math.sin(l*.45+_.bob)*1.1*Q.w,He=Math.sin(l*.31+_.bob*2)*1.6*Q.w;oe.position.set(Q.x+He,Q.y+Ue,Q.z),oe.rotation.y=Q.q*Math.PI*.5+_.turn;const Ne=A[E]+Q.y+Ue,De=fe(1,12,Q.y);V.set(oe.position.x,Ne,oe.position.z),p.localToWorld(V),k.uBell.value[E].set(V.x,V.z,V.y,_.R*te),k.uBellK.value[E]=De;const ae=ke[E];ae.x=oe.position.x,ae.z=oe.position.z,ae.y=Ne,ae.radius=_.R*1.15+Ne*.1,ae.strength=De/(1+Ne*.004),ie[E].position.set(ae.x,.12,ae.z),ie[E].scale.setScalar(ae.radius),ie[E].material.uniforms.uK.value=ae.strength}const j=fe(.5,10,g[4].position.y),Z=.5+.5*fe(3,30,g[4].position.y);I.scale.setScalar(Z),Be.uniforms.uOpen.value=j;const K=fe(1,13,g[4].position.y);V.copy(W),p.localToWorld(V),k.uGlow.value.set(V.x,V.y,V.z,K),ce.uniforms.uSeat.value.copy(V);let J=K*.42,Fe=1;if(c){Y.setFromMatrixPosition(c.matrixWorld).sub(V);const E=Y.length();Y.divideScalar(Math.max(E,.001));const _=Math.max(0,Y.dot(D)),oe=_*_;J*=fe(20,72,E)*(1-oe*oe),Fe=1-fe(.34,.74,_)}ce.uniforms.uK.value=J;const Qe=Math.max(.012,Fe);C.scale.set(Z,Z*Qe,Z),C.position.y=-.3*(1-Fe),C.visible=K>.002,Te.uniforms.uK.value=.35+.65*K,pe.progress=m}const pe={object:p,radius:120,height:190,center:y(0,80,0),anchors:le,uniforms:k,material:N,colors:n,update:Se,setProgress(a){Pe=a==null?null:Ae(a,0,1)},bellState:ee,shadows:ke,progress:0,dispose(){for(const a of ie)a.material.dispose();we.dispose()},ground:!0,groundY:0};return Se(0,0,null),pe}export{Ve as DEFAULT_PALETTE,_e as LACQUER_FRAG,Ke as LACQUER_VERT,i as MO,be as Prof,se as aim,nt as buildHero,H as cells,xe as turn};
