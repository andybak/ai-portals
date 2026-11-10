import*as k from"three";import{makePath as js,makeRng as i0}from"../kit/core.js";import{buildHero as Qs,GLSL_COMMON as V0,BEAD_FRAG as ks,gridGeo as ut,gridGeoAsync as $s}from"../parts/spore-rain.js";const Z=Math.PI*2,ae=-12,be=1.9,t0=42,As=["#B5622B","#5A2E17","#4E7A2E","#C9D4C2","#F1E6C8","#FFD27A","#D8281C"],K=(F,z,H)=>{const st=Math.min(1,Math.max(0,(H-F)/(z-F)));return st*st*(3-2*st)},L=(F,z,H)=>F+(z-F)*H,Ue=F=>Math.min(1,Math.max(0,F)),Cs=`
vec3 leafDeform(vec3 p, float id, float seed, float flatK, out float tw){
  float hA = fract(id * 0.618 + seed), hB = fract(id * 0.371 + 0.3 + seed);
  tw = (hA - 0.5) * 1.5 * p.x * flatK;
  float ct = cos(tw), st = sin(tw);
  p.yz = vec2(ct * p.y - st * p.z, st * p.y + ct * p.z);
  p.y += (hB - 0.4) * 1.5 * p.z * p.z * flatK;
  return p;
}`,Js=`
attribute vec3 aCol;
attribute vec2 aux;
uniform vec4 uMisc;      // x amplitude (wind m / leg swing), y gait or wind phase, z, w free
varying vec3 vL, vN, vP, vCol;
varying vec2 vAux;
#ifdef PILL
  varying vec2 vPill;       // a pill millipede's plate: its own two random numbers (instanceColor.yz; instanceColor.x = how far it is rolled up)
#endif
#include <fog_pars_vertex>
${V0}
${Cs}
void main(){
  vec3 p = position; vec3 n = normal; float id = 0.0;
  #ifdef USE_INSTANCING
    id = float(gl_InstanceID);
  #endif
  #if VK == 2
    float lw = step(aux.y, -0.5) * aux.x;
    float ph = uMisc.y + (-aux.y - 1.0) * 3.14159 + id * uMisc.z;
    p.z += lw * uMisc.x * sin(ph);
    p.y += lw * uMisc.x * 0.55 * max(cos(ph), 0.0);
  #endif
  #if VK == 3
    p.y += (1.0 - aux.x) * 0.07 * sin(p.z * 2.6 + uTime * 2.2) * step(p.y, 0.5);
    p.x *= 1.0 + 0.02 * sin(p.z * 2.6 + uTime * 2.2);
  #endif
  #if VK == 4
    p.y += step(aux.y, -0.5) * aux.x * abs(p.x) * 1.1 * sin(uTime * 55.0 + id * 1.3);
  #endif
  #if VK == 5
    float flatK = 1.0;
    #ifdef USE_INSTANCING
      flatK = smoothstep(0.3, 0.8, length(instanceMatrix[1].xyz) / max(length(instanceMatrix[0].xyz), 1e-3));
    #endif
    float tw5;
    p = leafDeform(p, id, uMisc.z, flatK, tw5);
    float c5 = cos(tw5), s5 = sin(tw5);
    n.yz = vec2(c5 * n.y - s5 * n.z, s5 * n.y + c5 * n.z);
  #endif
  #ifdef PILL
    vPill = vec2(0.5);
    #ifdef USE_INSTANCING_COLOR
      // as the animal rolls up its legs fold away under the belly: a ball shows only plates
      float tuck = step(aux.y, -0.5) * instanceColor.x;
      p.x *= 1.0 - 0.5 * tuck; p.y = mix(p.y, -0.2, 0.85 * tuck);
      vPill = instanceColor.yz;
    #endif
  #endif
  vP = p;
  #ifdef USE_INSTANCING
    p = (instanceMatrix * vec4(p, 1.0)).xyz; n = mat3(instanceMatrix) * n;
  #endif
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vec3 wn = mat3(modelMatrix) * n;
  #if VK == 1
    float g1 = sin(uTime * 0.9 + wp.x * 0.05 + wp.z * 0.07) * 0.6 + sin(uTime * 2.3 + id * 1.3 + wp.x * 0.31) * 0.4;
    float g2 = cos(uTime * 1.1 + id * 0.7 + wp.z * 0.23);
    float w2 = aux.x * aux.x * uMisc.x;
    wp.x += w2 * g1; wp.z += w2 * 0.6 * g2;
    #ifdef USE_INSTANCING
      vec3 basePos = (modelMatrix * vec4(instanceMatrix[3].xyz, 1.0)).xyz;
      float gone = smoothstep(uMisc.w * 0.72, uMisc.w, length(basePos - uCamL)) * step(1.0, uMisc.w);
      wp.xyz = mix(wp.xyz, basePos, gone);
    #endif
  #endif
  #if VK == 4
    float h1 = fract(id * 0.618), h2 = fract(id * 0.371 + 0.2), h3 = fract(id * 0.137 + 0.6);
    float t = uTime * (0.7 + 0.6 * h1);
    wp.xyz += vec3(sin(t * 1.3 + h2 * 6.28) * (0.8 + 1.6 * h3), sin(t * 2.9 + h1 * 6.28) * 0.9 + sin(t * 0.7 + h3 * 6.28) * 0.6, cos(t * 1.1 + h3 * 6.28) * (0.8 + 1.6 * h2));
  #endif
  #if VK == 5
    // one leaf in five rocks on its keel as drips land on it
    wp.y += (aux.x - 0.5) * 0.22 * flatK * sin(uTime * (0.5 + fract(id * 0.618)) + id * 1.7) * step(0.8, fract(id * 0.371 + 0.3));
  #endif
  vL = wp.xyz; vN = wn; vCol = aCol; vAux = aux;
  #if defined(USE_INSTANCING_COLOR) && !defined(PILL)
    vCol *= instanceColor;
  #endif
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,to=`
attribute vec2 aux;
uniform vec4 uMisc;
varying float vA;
varying float vFogD;
${Cs}
void main(){
  float flatK = smoothstep(0.3, 0.8, length(instanceMatrix[1].xyz) / max(length(instanceMatrix[0].xyz), 1e-3));
  float tw;
  vec3 p = leafDeform(position, float(gl_InstanceID), uMisc.z, flatK, tw);
  vec4 mv = viewMatrix * modelMatrix * instanceMatrix * vec4(p, 1.0);
  // a leaf that stands on edge shades nothing: its outline would hang in the air as a dark fringe
  vec3 upI = instanceMatrix[1].xyz;
  vA = aux.x * smoothstep(0.6, 0.88, abs(upI.y) / max(length(upI), 1e-4)); vFogD = -mv.z;
  gl_Position = projectionMatrix * mv;
}`,eo=`
uniform float fogDensity;
uniform vec4 uMisc;
varying float vA;
varying float vFogD;
void main(){
  float f = exp(-fogDensity * fogDensity * vFogD * vFogD);
  float a = vA * vA * (3.0 - 2.0 * vA) * uMisc.x * f;
  gl_FragColor = vec4(0.0, 0.0, 0.0, a);
}`,Bs=`
vec2 h22(vec2 p){ vec3 a = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); a += dot(a, a.yzx + 33.33); return fract((a.xx + a.yz) * a.zy); }
// half width of a beech leaf at s along its midrib (0 base, 1 tip), in leaf lengths
float leafWid(float s){ return 0.33 * pow(max(sin(3.14159 * pow(clamp(s, 0.0, 1.0), 0.8)), 0.0), 0.75); }
// one layer of leaves: returns the covering leaf's priority (< 0: none), its coordinates (s along the midrib, q across in
// leaf lengths), its id, the distance in from its margin, its length in cells, and how far outside the nearest leaf of
// this layer the point lies (cells; large when inside one or far from any)
float leafCell(vec2 g, float seed, out vec2 buv, out float bid, out float bedge, out float blen, out float bnear){
  vec2 ci = floor(g), cf = fract(g); float best = -1.0; buv = vec2(0.0); bid = 0.0; bedge = 0.0; blen = 1.0; bnear = 1.0;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 o = vec2(float(i), float(j));
    vec2 rr = h22(ci + o + seed);
    vec2 rs = h22(ci + o + 17.3 + seed);
    vec2 d = cf - o - rr;
    float a = rs.x * 6.28318; float ca = cos(a), sa = sin(a);
    float sc = 1.3 + 0.55 * rs.y;
    vec2 q = vec2(ca * d.x + sa * d.y, -sa * d.x + ca * d.y) / sc;
    float s = clamp(q.x + 0.5, 0.0, 1.0);
    float e = leafWid(s) - abs(q.y);
    float pri = fract(rs.y * 5.3 + rr.x * 0.37);
    if (abs(q.x) < 0.5 && sc * 0.5 < 1.0) {
      if (e > 0.0) { if (pri > best) { best = pri; buv = vec2(s, q.y); bid = rr.y; bedge = e; blen = sc; } }
      else bnear = min(bnear, -e * sc);
    }
  }
  return best;
}`,ao=`
uniform vec3 cCopper, cUmber, cMoss, cPearl, cCream, cGold;
uniform vec3 uKeyDir, uKeyCol, uTone0, uTone1, uTone2, uTone3;
uniform vec4 uMisc, uMat, uArc;     // uMat: x gloss, y translucency, z fibre scale (FK 2: leaf length m), w pattern variant; uArc: the arcade (z0, z1, floor, height)
uniform float uSeed, uNight;
varying vec3 vL, vN, vP, vCol;
varying vec2 vAux;
#ifdef PILL
  varying vec2 vPill;
#endif
#include <fog_pars_fragment>
${V0}
${Bs}
// what leafSurf found last, for the relief a fallen leaf shows near the eye: x = how well its pleats are resolved, y = the
// crown of a pleat, z = the curled rim just inside its margin (crowns and rim are broken along the leaf, as a dead leaf's
// are), w = which flank of a pleat this is (-1..1: the flank toward the leaf's tip is the lit one, by the leaf's own measure)
vec4 gLeaf = vec4(0.0);
float gGroove = 0.0;          // and the groove a side vein runs in
// the relief's measure: above 1 on the crowns and the lit flank, below 1 in the grooves and on the shaded flank (0.36 at
// the least: 0.66 * 0.76 * 0.72). rel = the leaf's height 0..1 (the arcade walls' measure)
float leafRelief(float rel){ return (0.66 + 0.5 * rel) * (1.0 + 0.24 * gLeaf.w) * (1.0 - 0.28 * gGroove); }
// The relief itself, eased in by k. A groove is deep umber, not black: where the measure brightens, the leaf's colour is
// multiplied by it; where it darkens, the leaf goes toward the litter's own deep umber (the bed's) and stops at
// RELIEF_FLOOR of its own colour, whichever is the brighter, and a leaf already darker than that keeps its colour.
const float RELIEF_FLOOR = 0.6;
vec3 leafRelieved(vec3 leaf, float rel, float k){
  float m = leafRelief(rel);
  vec3 deep = min(leaf, max(leaf * RELIEF_FLOOR, cUmber * 0.9 + 0.012));
  // (how far into the groove: 0 where the measure is 1, 1 where it is at its least; 1.5625 = 1 / 0.64)
  float t = clamp((1.0 - m) * 1.5625, 0.0, 1.0);
  return mix(leaf, mix(leaf * max(m, 1.0), deep, t), k);
}
// dpx, dpy: the screen derivatives of the point; hx, hy: those of a height in metres; k scales it. (The four derivatives
// are taken by main, on every pixel: not in here, which only some pixels call.)
vec3 bumpN(vec3 N, vec3 dpx, vec3 dpy, float hx, float hy, float k){
  vec3 r1 = cross(dpy, N), r2 = cross(N, dpx); float det = dot(dpx, r1);
  vec3 g = sign(det) * (hx * r1 + hy * r2);
  return normalize(abs(det) * N - k * g + N * 1e-6);
}
// the canopy as a wet surface mirrors it: bright gaps between leaf masses
vec3 skyRefl(vec3 R){
  float n = vnoise(vec3(R.xz / (abs(R.y) + 0.4) * 2.2, 3.0));
  return uSkyCol * (0.5 + 1.3 * smoothstep(0.42, 0.72, n));
}
// A beech leaf's surface. s along the midrib 0..1, q across (leaf lengths), e distance in from the margin, id random,
// tone its colour, d = (ds/dx, dq/dx, ds/dy, dq/dy): the footprint of a pixel on the leaf. Every line is filtered by its own
// footprint, so a leaf seen edge-on is the same leaf, only smoother: no dashes, no dither. Writes albedo, a soft height
// 0..1 (pleats between the side veins, the midrib sunk) and gl (x = a water bead's glint, y = its shade); returns x = 1 in
// a hole or outside the toothed margin, y = how wet the spot is.
vec2 leafSurf(float s, float q, float e, float id, vec3 tone, vec4 d, out vec3 alb, out float h, out vec2 gl){
  float aq = abs(q), sg = q < 0.0 ? -1.0 : 1.0;
  float fwS = abs(d.x) + abs(d.z), fwQ = abs(d.y) + abs(d.w);
  float fwMax = max(length(d.xy), length(d.zw)) + 1e-6;
  // side veins: seven or eight pairs, straight and parallel, bending toward the tip only at the margin
  float kq = (0.95 + 2.2 * aq) * sg;
  float vc = (s - aq * 0.95 - aq * aq * 1.1) * 8.0 + id * 7.0 + step(0.0, q) * 0.5;
  float wv = 8.0 * (abs(d.x - kq * d.y) + abs(d.z - kq * d.w)) + 1e-4;      // veins per pixel
  float fv = fract(vc), dl = min(fv, 1.0 - fv);
  float hw = 0.045 + 0.02 * (1.0 - s);
  float side = clamp((hw - dl) / wv + 0.5, 0.0, 1.0) * min(1.0, 2.0 * hw / wv);
  side = mix(side, 2.0 * hw, smoothstep(0.22, 0.6, wv)) * smoothstep(0.02, 0.07, s) * smoothstep(0.0, 0.02, aq);
  float kPl = 1.0 - smoothstep(0.18, 0.5, wv);
  float pleat = mix(0.5, 0.5 - 0.5 * cos(6.28318 * fv), kPl) * smoothstep(0.0, 0.05, aq);
  float hm = 0.0045 + 0.009 * (1.0 - s);
  float mid = clamp((hm - aq) / (fwQ + 1e-5) + 0.5, 0.0, 1.0) * min(1.0, 2.0 * hm / (fwQ + 1e-5));
  vec3 pn = vec3(s * 70.0, q * 70.0, id * 31.0);
  float kFine = 1.0 - smoothstep(0.003, 0.009, fwMax), kMid = 1.0 - smoothstep(0.012, 0.035, fwMax);
  float n1 = mix(0.5, vnoise(pn), kFine), n2 = vnoise(pn * 0.14 + 5.0), n3 = vnoise(pn * 0.045 + 11.0);
  float rot = smoothstep(0.58, 0.8, vnoise(pn * 0.09 + 23.0));
  float spot = smoothstep(0.78, 0.88, vnoise(pn * 0.45 + 3.0)) * kMid;
  alb = tone * (0.76 + 0.4 * n3 + 0.12 * n2) * (0.93 + 0.14 * n1);
  alb = mix(alb, tone * vec3(1.2, 1.12, 0.55), smoothstep(0.5, 0.85, n3) * 0.3);
  alb = mix(alb, cUmber * 0.45, rot * 0.5);
  // the blade is paler on the crown of each pleat and dark in the vein's groove: soft tonal ridges, no relief needed
  alb *= (1.0 - 0.45 * spot) * (0.86 + 0.2 * pleat) * (1.0 - 0.5 * side) * (1.0 - 0.55 * mid);
  // the margin: a dark line where the blade ends, a dry pale rim just inside it
  float rimW = 0.012 + 1.5 * fwQ;
  alb *= 0.5 + 0.5 * smoothstep(0.0, rimW * 0.6, e);
  alb += tone * 0.2 * smoothstep(rimW * 3.0, rimW, e) * smoothstep(0.0, rimW * 0.6, e);
  gLeaf = vec4(kPl, kPl * smoothstep(0.9, 0.995, 0.5 - 0.5 * cos(6.28318 * (fv - 0.1))) * smoothstep(0.02, 0.08, aq) * smoothstep(0.3, 0.6, n2),
    smoothstep(rimW * 3.0, rimW, e) * smoothstep(0.0, rimW * 0.6, e) * smoothstep(0.35, 0.6, n3), kPl * sin(6.28318 * fv) * smoothstep(0.0, 0.05, aq));
  gGroove = kPl * (1.0 - smoothstep(hw, 0.13, dl)) * smoothstep(0.02, 0.07, s) * smoothstep(0.0, 0.03, aq);
  h = pleat * 0.45 * kPl - mid * 0.35 + 0.3 * n2;
  // water beads sitting on the blade: a lens that darkens what is under it, with one sharp point of sky
  float kDrop = 1.0 - smoothstep(0.0016, 0.004, fwMax);
  vec2 dg = vec2(s, q) * 15.0, dr = h22(floor(dg) + id * 91.0), dc = fract(dg) - 0.25 - 0.5 * dr;
  float rad = 0.07 + 0.13 * dr.x, dd = length(dc), on = step(0.74, dr.y) * kDrop * (1.0 - uFrost);
  float bead = on * (1.0 - smoothstep(rad * 0.8, rad, dd));
  gl = vec2(on * (1.0 - smoothstep(rad * 0.12, rad * 0.3, length(dc - vec2(-0.3, 0.32) * rad))), bead);
  alb *= 1.0 - 0.3 * bead * smoothstep(rad * 0.3, rad, dd) - 0.25 * on * (1.0 - smoothstep(rad, rad * 1.25, dd)) * (1.0 - bead);
  // (teeth, nibbles and holes are cut out of the blade only where a pixel is much smaller than they are: they are gone
  // before the cutting stops, so a margin seen edge-on is one clean line and never a row of dashes)
  float kCut = 1.0 - smoothstep(0.003, 0.006, fwMax);
  float hole = smoothstep(0.84, 0.87, vnoise(pn * 0.1 + 41.0) + 0.12 * n2) * (1.0 - mid) * (1.0 - side * 0.7) * step(0.012, e) * kCut;
  // (a wall of the arcade, uMat.w = 1, is an old leaf eaten through between its veins: the light comes through the holes)
  hole = max(hole, step(0.5, uMat.w) * smoothstep(0.77, 0.8, vnoise(pn * 0.21 + 17.0) + 0.1 * n2) * (1.0 - mid) * (1.0 - side) * step(0.02, e) * kCut);
  float teeth = 0.013 * (0.5 - 0.5 * cos(6.28318 * fv)) * kMid * smoothstep(0.08, 0.2, s) * kCut;
  float nib = 1.0 - step(max(teeth, 0.03 * smoothstep(0.5, 0.82, vnoise(pn * 0.22 + 7.0)) * kCut), e);
  return vec2(max(hole, nib), 0.55 + 0.9 * smoothstep(0.35, 0.7, n3 + 0.3 * (1.0 - n2)));
}
// Hoar's own glints: sparse cold points along the margin and the midrib of a frosted leaf. Each is fixed to its place on
// the leaf (s along the midrib, q across; d = a pixel's footprint on the leaf), is drawn as a round point three to four
// pixels across whatever the distance, and brightens and dims on its own slow clock (0.25 to 1.1 times a second).
// They are gone where the leaf is so far that the points would not stand apart.
float hoarGlint(float s, float q, float id, vec4 d){
  const float G = 22.0;
  float kG = 1.0 - smoothstep(0.2, 0.45, G * (max(length(d.xy), length(d.zw)) + 1e-6));
  if (kG <= 0.0) return 0.0;
  float ci = floor(s * G);
  vec2 r1 = h22(vec2(ci, floor(id * 977.0)) + 3.1), r2 = h22(vec2(ci, floor(id * 977.0)) + 61.7), r3 = h22(vec2(ci, floor(id * 977.0)) + 127.3);
  float sc = (ci + 0.3 + 0.4 * r1.x) / G;
  float qm = (q < 0.0 ? -1.0 : 1.0) * max(leafWid(sc) - 0.004 - 0.014 * r1.y, 0.0), qr = (r2.y - 0.5) * 0.014;
  float det = d.x * d.w - d.z * d.y; det = (det < 0.0 ? -1.0 : 1.0) * max(abs(det), 1e-10);
  vec2 a = vec2(s - sc, q - qm), b = vec2(s - sc, q - qr);
  float la = length(vec2(d.w * a.x - d.z * a.y, d.x * a.y - d.y * a.x)) / abs(det), lb = length(vec2(d.w * b.x - d.z * b.y, d.x * b.y - d.y * b.x)) / abs(det);
  float onM = step(0.5, fract(r3.x * 7.3 + (q < 0.0 ? 0.37 : 0.0))), onR = step(0.65, r3.y);
  float twM = 0.5 + 0.5 * sin(uTime * (1.6 + 5.3 * r2.x) + r1.y * 40.0 + (q < 0.0 ? 2.0 : 0.0)), twR = 0.5 + 0.5 * sin(uTime * (1.6 + 5.3 * r3.x) + r2.y * 40.0);
  float g = onM * (0.15 + 0.85 * twM * twM * twM) * (1.0 - smoothstep(0.7, 2.2, la)) + onR * (0.15 + 0.85 * twR * twR * twR) * (1.0 - smoothstep(0.7, 2.2, lb));
  return min(g, 1.0) * kG;
}
// moss turf from above: a mat of star-shaped shoot tips of two sizes, no two alike. p in metres; returns x = tone 0..1
// (pale young tips), y = height 0..1
vec3 mossStar(vec2 g){
  vec2 ci = floor(g), cf = fract(g); float d1 = 4.0; vec2 dv = vec2(1.0, 0.0); float idc = 0.0;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 o = vec2(float(i), float(j)); vec2 r = h22(ci + o + 3.7); vec2 d = cf - o - r; float l = dot(d, d);
    if (l < d1) { d1 = l; dv = d; idc = r.x; }
  }
  float r = sqrt(d1);
  float ang = atan(dv.y, abs(dv.x) + abs(dv.y) < 1e-4 ? 1.0 : dv.x);
  float rays = 0.5 + 0.5 * cos(ang * (5.0 + floor(idc * 3.99)) + idc * 20.0);
  float star = (1.0 - smoothstep(0.0, 0.5 + 0.2 * idc, r)) * mix(1.0, 0.2 + 0.8 * rays, smoothstep(0.05, 0.26, r));
  return vec3(star, idc, r);
}
vec2 mossTex(vec2 p, float fine){
  vec3 a = mossStar(p * 4.3), b = mossStar(p * 2.2 + 17.0);
  float star = max(a.x * (0.6 + 0.4 * b.y), b.x * 0.75);
  float tone = clamp(star * (0.7 + 0.6 * a.y) + 0.35 * (b.y - 0.5), 0.0, 1.0);
  return vec2(mix(0.42, tone, fine), mix(0.42, star, fine));
}
// one family of creases running round a limb. s = the crease coordinate (one crease to a unit), fs = a pixel measured
// in s (taken by the caller), hw = half the dark line's width in s. Returns x = the dark hairline, y = the pale lip that
// stands beside it, z = the soft groove round it (for the relief). Thinner than a pixel it fades to its own average.
vec3 crease(float s, float fs, float hw){
  float fr = fract(s) - 0.5, k = 1.0 - smoothstep(0.3, 0.75, fs);
  float ln = clamp((hw - abs(fr)) / fs + 0.5, 0.0, 1.0) * min(1.0, 2.0 * hw / fs);
  float lp = clamp((hw - abs(fr - hw * 2.1)) / fs + 0.5, 0.0, 1.0) * min(1.0, 2.0 * hw / fs);
  return vec3(ln, lp, 1.0 - smoothstep(0.0, hw * 5.0 + fs, abs(fr))) * k;
}
void main(){
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0));
  if (!gl_FrontFacing && (uMat.w < 1.5 || uMat.w > 2.5)) N = -N;
  vec3 toCam = uCamL - vL; float dist = length(toCam) + 1e-3;
  vec3 V = toCam / dist;
  #if FK == 7
    if (dot(N, V) < 0.0) N = -N;          // cuticle always shows its outside, whichever way its mesh is wound
  #endif
  vec3 alb = vCol; float gloss = uMat.x, ao = 1.0, sss = uMat.y, h = 0.0, bumpK = 0.0;
  vec2 glint = vec2(0.0);
  float rime = 0.1;           // where hoar frost grows on a frosty morning: margins, ribs and tips, not blotches
  float crest = 0.0, hoar = 0.0;        // a near fallen leaf's lit crowns and rim; hoar's glints
  float nearK = 1.0 - smoothstep(50.0, 170.0, dist);
  // a pixel that is cut away (a leaf's holes and teeth, a trunk lost in its crown) is only marked where the cut is decided
  // and is thrown away further down, after the last derivative: one taken beside a pixel already gone is not defined
  bool cut = false;
  #if FK == 0
    // ---- litter floor: two layers of overlapping beech leaves over wet humus, with moss
    float fwm = max(fwidth(vL.x), fwidth(vL.z));
    vec2 buv, uvB; float bid, idB, bedge, eB, blen, lenB, nearT, nearB;
    float best = leafCell(vL.xz / 6.6, uSeed, buv, bid, bedge, blen, nearT);
    float pB = leafCell(vL.xz / 5.7 + 37.7, uSeed + 5.0, uvB, idB, eB, lenB, nearB);
    float under = 0.0, cell = 6.6;
    if (best < 0.0 && pB >= 0.0) { buv = uvB; bid = fract(idB + 0.37); bedge = eB; blen = lenB; best = pB; under = 1.0; cell = 5.7; }
    vec4 dB = vec4(dFdx(buv), dFdy(buv));                 // a pixel's footprint on the covering leaf
    dB = clamp(dB, vec4(-0.25), vec4(0.25));
    float fineK = 1.0 - smoothstep(10.0, 42.0, dist);
    float n1 = vnoise(vL * 0.35 + uSeed), n2 = vnoise(vL * 1.7), n3 = vnoise(vL * 6.0) * fineK + 0.5 * (1.0 - fineK);
    float mossy = smoothstep(0.52, 0.7, 0.55 * fbm3(vL * 0.045 + uSeed) + 0.25 * n1 + vAux.x * 0.75);
    // the bed between leaves: wet black humus, leaf skeletons and crumbs
    float crumb = vnoise(vL * 13.0) * fineK;
    // (the bed is itself old leaves pressed flat: their midribs show as pale threads)
    float sk = (1.0 - smoothstep(0.0, 0.05, abs(vnoise(vL * 0.9 + 31.0) - 0.5))) * fineK;
    vec3 bed = mix(cUmber * 0.9 + 0.012, uTone3 * 0.7, smoothstep(0.3, 0.7, n1)) * (0.62 + 0.5 * n2) * (0.75 + 0.5 * crumb) * (1.0 + 0.7 * sk);
    alb = bed; gloss = 0.8; h = n2 * 0.05 + n3 * 0.03 + crumb * 0.02; sss = 0.0; ao = 0.78;
    if (best >= 0.0) {
      vec3 tone = bid < 0.25 ? uTone0 : bid < 0.5 ? uTone1 : bid < 0.75 ? uTone2 : uTone3;
      tone = mix(tone, cGold * 0.5, step(0.86, fract(bid * 11.3)) * 0.4);
      tone *= 0.74 + 0.5 * fract(bid * 7.3);
      float lenM = cell * blen;
      vec3 leaf; float lh;
      // one leaf in eight is lemon, one in eight nearly black with wet: neighbours never match
      tone = mix(tone, cGold * 0.62, step(0.875, fract(bid * 23.7)) * 0.7);
      tone *= 1.0 - 0.5 * step(fract(bid * 31.3), 0.125);
      vec2 ls = leafSurf(buv.x, buv.y, bedge, bid, tone, dB, leaf, lh, glint);
      float edgeK = smoothstep(0.0, 0.004 + fwm / lenM, bedge) * (1.0 - ls.x);
      glint *= edgeK;
      // near the eye a fallen leaf is a leaf, not paving: the pleats between its veins stand in relief, bright on their
      // crowns and deep umber in the grooves (the arcade walls' own measure, eased in), and the crowns and the curled margin
      // catch the sky. Whole within 6 m of the eye, gone by 18 m: beyond that the floor is as it was.
      float relK = (1.0 - smoothstep(6.0, 18.0, dist)) * gLeaf.x;
      leaf = leafRelieved(leaf, clamp(lh * 1.7, 0.0, 1.0), relK);
      crest = relK * edgeK * (0.3 * gLeaf.y + 0.45 * gLeaf.z) * (1.0 - 0.4 * under);
      if (uFrost > 0.5) hoar = hoarGlint(buv.x, buv.y, bid, dB) * edgeK;
      leaf *= 1.0 - 0.3 * under;
      // hyphae: white threads wandering over some leaves
      float hy = (1.0 - smoothstep(0.0, 0.012 + fwm * 0.06, abs(vnoise(vL * 0.8 + 4.0) - 0.5))) * step(0.7, fract(bid * 3.7)) * fineK * smoothstep(0.3, 0.6, vnoise(vL * 0.21));
      leaf = mix(leaf, cCream * 0.75, hy * 0.55);
      // every leaf lies at its own tilt, with its margin curled up off the one below
      float rim = 1.0 - smoothstep(0.0, 0.035, bedge);
      float tilt = (buv.y * (fract(bid * 9.1) - 0.5) * 0.7 + (buv.x - 0.5) * (fract(bid * 13.7) - 0.5) * 0.35) * lenM;
      alb = mix(bed, leaf, edgeK);
      h = mix(h, tilt + lh * 0.007 * lenM + rim * 0.1 + 0.12 + 0.1 * fract(bid * 5.1), edgeK);
      gloss = mix(gloss, 0.62 * ls.y, edgeK); ao = mix(ao, 1.0, edgeK) * (1.0 - 0.2 * under);
      h += edgeK * relK * lh * 0.012 * lenM;
      // hoar is a hairline fringe: 0.01 of the leaf's length in from the margin (it was 0.05) and 0.005 across the midrib
      // (it was 0.024), each no thinner on screen than a pixel and paler as it thins
      // (a pixel measured across the midrib and across the margin, not along them: a rib running away from the eye stays a hairline)
      float fwL = fwm / lenM + 1e-5, fwR = min(fwL, abs(dB.y) + abs(dB.w) + 1e-5), fwE = min(fwL, fwR + 0.35 * (abs(dB.x) + abs(dB.z)));
      float rimeM = (1.0 - smoothstep(0.01 - 0.5 * fwE, 0.01 + 0.5 * fwE, bedge)) * min(1.0, 0.016 / fwE);
      float rimeR = (1.0 - smoothstep(0.0, 0.0025 + fwR, abs(buv.y))) * min(1.0, 0.008 / fwR) * (1.0 - smoothstep(0.01, 0.04, fwL));
      rime = mix(0.15, max(rimeM, 0.7 * rimeR), edgeK);
    }
    // shade under the raised margins of the leaves above
    if (under > 0.5 || best < 0.0) ao *= 0.72 + 0.28 * smoothstep(0.0, 0.055, nearT);
    if (best < 0.0) ao *= 0.86 + 0.14 * smoothstep(0.0, 0.05, nearB);
    float fineM = 1.0 - smoothstep(7.0, 30.0, dist);
    vec2 mt = mossTex(vL.xz, fineM);
    // turf: dark between the shoots, olive stars, young tips pale; broad drifts of deeper and yellower moss
    float drift = vnoise(vL * 0.23 + 7.0);
    vec3 moss = mix(cMoss * 0.78, mix(cMoss * 1.08, mix(cMoss, cGold, 0.45) * 1.15, smoothstep(0.55, 0.95, mt.x)), smoothstep(0.08, 0.6, mt.x));
    moss *= (0.82 + 0.3 * n2) * (0.86 + 0.3 * drift);
    moss += uSkyCol * 0.03;                 // a little of the sky lies even in the gaps between shoots
    // further off the stars are lost, and the turf shows as tufts with the dark between them
    float tuftK = smoothstep(0.3, 0.64, 0.6 * vnoise(vec3(vL.xz * 0.9, 3.0)) + 0.4 * vnoise(vec3(vL.xz * 2.3, 11.0)));
    moss *= mix(1.0, 0.6 + 0.7 * tuftK, 1.0 - 0.7 * fineM);
    moss = mix(moss, mix(cMoss, cGold, 0.5) * 1.1, smoothstep(0.8, 1.0, tuftK) * 0.5 * (1.0 - fineM));
    moss = mix(moss, cUmber * 0.6, smoothstep(0.62, 0.8, vnoise(vL * 0.6 + 19.0)) * 0.22);
    alb = mix(alb, moss, mossy); gloss = mix(gloss, 0.12, mossy); h = mix(h, mt.y * 0.3 + n2 * 0.12, mossy);
    ao = mix(ao, 0.86 + 0.14 * mt.y, mossy) * (1.0 - vAux.y * (1.0 - 0.5 * mossy));       // the shade between painted leaves is not laid on moss
    // beads of water sit in the moss
    vec2 bc = vL.xz * 1.9; vec2 br = h22(floor(bc) + 57.0);
    float bead = step(0.8, br.x) * (1.0 - smoothstep(0.035, 0.085, length(fract(bc) - 0.25 - 0.5 * br))) * (1.0 - smoothstep(18.0, 42.0, dist));
    glint = glint * (1.0 - mossy) + vec2(bead * mossy, 0.0);
    rime = mix(rime, mix(0.4, smoothstep(0.4, 0.9, mt.x), fineM), mossy);
    bumpK = nearK * (0.3 + 0.7 * fineK) * (1.0 - smoothstep(0.02, 0.12, fwm));
  #elif FK == 1
    float f3 = vnoise(vP * uMat.z * vec3(1.0, 0.3, 1.0) + uSeed); float g3 = vnoise(vP * uMat.z * 0.23 + uSeed);
    alb = vCol * (0.82 + 0.3 * f3) * (0.86 + 0.26 * g3);
    float wk = step(0.5, uMat.w) * step(uMat.w, 1.5), fine1 = 1.0 - smoothstep(8.0, 32.0, dist);
    // (two fields at an angle to each other: no lattice shows in the warts)
    vec3 pw = vP * uMat.z * 1.4;
    float wsp = smoothstep(0.42, 0.7, 0.55 * vnoise(pw + 11.0) + 0.45 * vnoise(vec3(0.8 * pw.x + 0.6 * pw.z, 1.1 * pw.y + 0.35 * pw.x, 0.8 * pw.z - 0.6 * pw.x) * 1.6 + 3.0));
    alb *= mix(1.0, 0.9 + 0.2 * wsp, wk * fine1);
    h = f3 * 0.6 + g3 + wsp * 1.3 * wk; bumpK = (0.03 + 0.035 * wk) * nearK * (0.3 + 0.7 * fine1); ao = vAux.y < 0.0 ? 0.85 : vAux.x; gloss = uMat.x * abs(vAux.y);
    if (uMat.w > 2.5) {
      // a common puffball is studded with pearly cones, big ones ringed by small, over a tan net
      vec3 g = vP * 1.9, cb = floor(g - 0.5), cf = g - cb; float d1 = 9.0, d2 = 9.0, idc = 0.0;
      for (int k = 0; k < 8; k++) {
        vec3 o = vec3(float(k - (k / 2) * 2), float((k / 2) - (k / 4) * 2), float(k / 4));
        float hx = h31(cb + o), hy = h31(cb + o + 17.3), hz = h31(cb + o + 41.9);
        float dd = length(cf - o - 0.2 - 0.6 * vec3(hx, hy, hz));
        if (dd < d1) { d2 = d1; d1 = dd; idc = hx; } else d2 = min(d2, dd);
      }
      float rad = 0.2 + 0.2 * idc;
      float stud = (1.0 - smoothstep(rad * 0.35, rad, d1)) * fine1;
      alb = mix(alb * (0.74 + 0.2 * smoothstep(0.0, 0.25, d2 - d1)), cCream * 0.86, stud * 0.85);
      h = stud * 1.4 + f3 * 0.3; bumpK = 0.11 * nearK * (0.3 + 0.7 * fine1); gloss *= 1.0 - 0.5 * stud;
    }
    #if VK == 1
      rime = 0.08 + 0.42 * smoothstep(0.66, 1.05, vAux.x);         // the tips of shoots and tufts
    #endif
  #elif FK == 2
    // ---- a beech leaf as a mesh: veined, pleated, blotched, holed, paler beneath
    float fw2 = max(fwidth(vAux.x), fwidth(vAux.y));
    vec4 d2 = vec4(dFdx(vAux), dFdy(vAux));
    float fwQ2 = fwidth(vAux.y), fwM2 = fwidth(leafWid(vAux.x) - abs(vAux.y));       // a pixel measured across the midrib, and across the margin
    if (vAux.x < -0.01) {
      // the leaf's stalk
      alb = vCol * vec3(0.5, 0.42, 0.34) * (0.8 + 0.4 * vnoise(vP * 40.0)); gloss = 0.5; sss = 0.0;
    } else {
      float e2 = leafWid(vAux.x) - abs(vAux.y);
      vec3 leaf2; float lh2;
      vec2 ls2 = leafSurf(vAux.x, vAux.y, max(e2, 0.0), fract(vCol.r * 7.0 + vCol.b * 13.0), vCol, d2, leaf2, lh2, glint);
      if (ls2.x > 0.5 && fw2 < 0.012) cut = true;          // (decided here, thrown away after the relief's derivatives)
      alb = leaf2;
      // beneath, a beech leaf is paler and matt, its veins standing proud
      if (!gl_FrontFacing) { alb = alb * vec3(0.9, 0.88, 0.84) + 0.025; glint *= step(0.5, uMat.w); }
      h = lh2 * 0.007 * uMat.z; bumpK = nearK * (1.0 - smoothstep(0.004, 0.02, fw2));
      if (uMat.w > 0.5) {
        // an arcade wall is a leaf seen from a hand's breadth: the pleats between its veins stand in relief, bright on
        // their crowns and dark in the grooves, and the wet lies along the grooves
        float rel = clamp(lh2 * 1.7, 0.0, 1.0);
        alb *= 0.7 + 0.46 * rel;
        ao *= 0.78 + 0.22 * rel;
      }
      #if VK == 5
        // a leaf lying in the litter, near the eye: the same relief as the floor's own leaves (whole within 6 m, gone by 18 m)
        float relK2 = (1.0 - smoothstep(6.0, 18.0, dist)) * gLeaf.x;
        alb = leafRelieved(alb, clamp(lh2 * 1.7, 0.0, 1.0), relK2);
        crest = relK2 * (0.3 * gLeaf.y + 0.45 * gLeaf.z) * step(0.0, e2);
        h += relK2 * lh2 * 0.012 * uMat.z;
      #endif
      if (uFrost > 0.5) hoar = hoarGlint(vAux.x, vAux.y, fract(vCol.r * 7.0 + vCol.b * 13.0), d2) * step(0.0, e2);
      gloss = uMat.x * ls2.y * (gl_FrontFacing || uMat.w > 0.5 ? 1.0 : 0.4); ao = 0.8 + 0.2 * smoothstep(0.0, 0.05, e2);
      // hoar is a hairline fringe: 0.009 of the leaf's length in from the margin (it was 0.045) and 0.005 across the midrib
      // (it was 0.024), each no thinner on screen than a pixel and paler as it thins
      // (a pixel measured across the midrib and across the margin, not along them: a rib running away from the eye stays a hairline)
      float fwL2 = fw2 + 1e-5, fwR2 = min(fwL2, fwQ2 + 1e-5), fwE2 = min(fwL2, fwM2 + 1e-5);
      rime = max((1.0 - smoothstep(0.009 - 0.5 * fwE2, 0.009 + 0.5 * fwE2, e2)) * min(1.0, 0.0144 / fwE2), 0.7 * (1.0 - smoothstep(0.0, 0.0025 + fwR2, abs(vAux.y))) * min(1.0, 0.008 / fwR2) * (1.0 - smoothstep(0.01, 0.04, fwL2)));
    }
  #elif FK == 3
    float b = vAux.x; float pat;
    if (uMat.w < 0.5) {
      // snail: five dark bands on yellow, growth lines along the whorl
      pat = 0.0;
      pat += 1.0 - smoothstep(0.012, 0.022, abs(b - 0.14)); pat += 1.0 - smoothstep(0.018, 0.03, abs(b - 0.27));
      pat += 1.0 - smoothstep(0.036, 0.05, abs(b - 0.45)); pat += 1.0 - smoothstep(0.038, 0.05, abs(b - 0.64)); pat += 1.0 - smoothstep(0.022, 0.035, abs(b - 0.82));
      pat = clamp(pat, 0.0, 1.0) * uMisc.z;
      float gr = vnoise(vec3(vAux.y * 55.0, b * 2.0, 1.0));
      alb = mix(vCol * (0.84 + 0.22 * gr), cUmber * 0.38, pat);
      alb *= 0.85 + 0.2 * vnoise(vP * 1.3);
      h = gr * 0.5; bumpK = 0.03; gloss = 1.1;
    } else {
      // turkeytail: concentric zones, pale growing edge, velvet
      float z = b * 7.0 + 0.6 * vnoise(vec3(vAux.y * 3.0, b * 4.0, uSeed));
      float zi = floor(z), zf = fract(z);
      float hz = fract(sin(zi * 12.99 + vCol.r * 40.0) * 43758.5);
      vec3 zc = mix(mix(cUmber * 0.7, cCopper * 0.8, hz), mix(vec3(0.18, 0.2, 0.24), cGold * 0.55, fract(hz * 7.1)), step(0.5, fract(hz * 3.3)));
      alb = mix(zc, zc * 0.6, smoothstep(0.75, 1.0, zf)) * (0.8 + 0.4 * vnoise(vec3(vAux.y * 40.0, b * 3.0, 2.0)));
      alb = mix(alb, cCream * 0.85, smoothstep(0.9, 0.99, b));
      alb *= vCol.g + 0.3; h = zf * 0.6; bumpK = 0.04 * nearK; gloss = 0.3;
    }
  #elif FK == 4
    float r = vAux.x;
    if (vAux.y < 1.5) {
      // scarlet top, washed orange at the margin, cream warts
      vec2 wg = vL.xz * 0.55; vec2 wi = floor(wg), wf = fract(wg); float wart = 0.0;
      for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
        vec2 o = vec2(float(i), float(j)); vec2 rr = h22(wi + o + 3.1);
        float rad = (0.12 + 0.2 * rr.x) * step(1.0 - vAux.y, fract(rr.y * 9.7) + 0.02);
        wart = max(wart, 1.0 - smoothstep(rad * 0.6, rad + 1e-3, length(wf - o - 0.2 - 0.6 * rr)));
      }
      wart *= 1.0 - smoothstep(0.86, 0.98, r);
      vec3 red = vec3(vCol.r, vCol.g, vCol.g * 0.6) * (0.8 + 0.3 * vnoise(vL * 0.7));
      red = mix(red, vec3(0.95, 0.42, 0.06), smoothstep(0.55, 1.0, r) * (0.35 + 0.5 * (1.0 - vAux.y)));
      float stri = smoothstep(0.88, 1.0, r) * 0.25 * vnoise(vec3(vCol.b * 9.0, atan(vP.z, abs(vP.x) + abs(vP.z) < 1e-4 ? 1.0 : vP.x) * 30.0, 0.0));
      alb = mix(red * (1.0 - stri), cCream * 0.9, wart);
      h = wart; bumpK = 0.25 * nearK; gloss = mix(1.25, 0.35, wart); sss = 0.12;
    } else {
      // gills under the cap: radial blades, filtered at distance
      float gph = vCol.r * 6.28318 * 84.0; float fw = fwidth(vCol.r * 84.0);
      float gl = 0.5 + 0.5 * sin(gph); gl = mix(gl, 0.5, smoothstep(0.15, 0.5, fw));
      alb = cCream * mix(0.5, 0.92, gl) * (0.75 + 0.25 * r); gloss = 0.3; sss = 0.3; ao = 0.55 + 0.45 * r;
    }
  #elif FK == 5
    // ---- bark: long braided ridges with dark cracks between them, a finer weave on those, lenticel dashes, crusts of
    // pale lichen with crisp edges, moss along the top; pale birch when the vertex colour is light. uMat.z is the limb's
    // radius in metres, so bark is the same size on the bough the beetle runs down as on the log it runs into. Every
    // layer fades by the size of a pixel in its own pattern, so nothing shimmers and nothing goes flat too early.
    float ang = vAux.x * 6.28318; vec3 q = vec3(cos(ang), 0.0, sin(ang)) * uMat.z;
    float along = vAux.y;
    vec3 p1 = vec3(q.x * 2.3, along * 0.3, q.z * 2.3) + uSeed;
    vec3 p2 = vec3(q.x * 6.1, along * 0.8, q.z * 6.1) + 7.3;
    float f1 = max(length(dFdx(p1)), length(dFdy(p1))), f2 = max(length(dFdx(p2)), length(dFdy(p2)));
    float k1 = 1.0 - smoothstep(0.2, 0.6, f1), k2 = 1.0 - smoothstep(0.15, 0.5, f2), k3 = 1.0 - smoothstep(0.05, 0.17, f2);
    float fine5 = 1.0 - smoothstep(14.0, 60.0, dist);
    float rid = mix(0.5, fbm3(p1), 0.2 + 0.8 * k1);
    float w2 = vnoise(p2 + 0.5 * rid), w3 = vnoise(p2 * 2.7 + 3.1);
    float r2 = mix(0.6, 1.0 - abs(2.0 * w2 - 1.0), k2);                       // the crests of the finer ridges
    // cracks are contour lines of the noise, their width measured in the pattern (the distance to the contour is the
    // difference in value over the slope), so a flat spot in the noise is a plate, not a black pool
    float d1 = abs(rid - 0.47) * f1 / max(fwidth(rid), 1e-5), d2 = abs(w2 - 0.5) * f2 / max(fwidth(w2), 1e-5), d3 = abs(w3 - 0.5) * f2 * 2.7 / max(fwidth(w3), 1e-5);
    float cr1 = (1.0 - smoothstep(0.015, 0.05 + f1, d1)) * k1;        // cracks between the big plates
    float cr2 = (1.0 - smoothstep(0.01, 0.06 + f2, d2)) * k2 * 0.8;         // and between the ridges
    float cr3 = (1.0 - smoothstep(0.0, 0.07 + f2 * 2.7, d3)) * k3 * 0.45;
    float crack = max(cr1, max(cr2, cr3));
    float fineB = mix(0.5, vnoise(vec3(q.x * 15.0, along * 1.6, q.z * 15.0)), 1.0 - smoothstep(0.05, 0.18, f2));
    float lentB = smoothstep(0.66, 0.76, vnoise(vec3(q.x * 2.4, along * 5.0, q.z * 2.4) + 5.0)) * (1.0 - smoothstep(0.025, 0.09, f2));      // lenticels: short dashes round the limb
    float birch = smoothstep(0.5, 0.7, vCol.g);
    vec3 beech = vCol * (0.66 + 0.6 * rid) * (0.74 + 0.4 * r2) * (0.86 + 0.28 * fineB) * (1.0 - 0.14 * lentB);
    beech = mix(beech, cUmber * 0.26, crack * 0.8);
    float lent = smoothstep(0.62, 0.72, vnoise(vec3(q.x * 0.75, along * 1.1, q.z * 0.75) + 5.0));
    vec3 bir = vCol * (0.86 + 0.14 * fineB) * (1.0 - 0.75 * lent);
    alb = mix(beech, bir, birch);
    // lichen: big grey-green crusts and small white and sulphur ones, each with a paler growing edge and dark fruit dots
    float fwL = max(length(dFdx(vL)), length(dFdy(vL)));
    float lA = vnoise(vL * 0.42 + 9.0) + 0.16 * (vnoise(vL * 1.9 + 4.0) - 0.5), lB = vnoise(vL * 1.25 + 21.0) + 0.12 * (vnoise(vL * 4.3) - 0.5);
    float eA = 0.012 + fwL * 0.5, eB = 0.02 + fwL * 1.3;
    float pA = smoothstep(0.585 - eA, 0.585 + eA, lA), pB = smoothstep(0.69 - eB, 0.69 + eB, lB);
    float rimA = pA * (1.0 - smoothstep(0.6, 0.66, lA)), rimB = pB * (1.0 - smoothstep(0.7, 0.75, lB));
    float dots = smoothstep(0.7, 0.8, vnoise(vL * 7.0 + 2.0)) * (1.0 - smoothstep(0.03, 0.1, fwL));
    float sulph = step(0.55, vnoise(vL * 0.31 + 40.0));
    vec3 lichA = vec3(0.62, 0.68, 0.58) * (0.8 + 0.4 * vnoise(vL * 3.1)) * (1.0 + 0.45 * rimA) * (1.0 - 0.6 * dots);
    vec3 lichB = mix(vec3(0.78, 0.8, 0.72), vec3(0.72, 0.62, 0.22), sulph) * (0.85 + 0.3 * vnoise(vL * 5.0)) * (1.0 + 0.3 * rimB);
    float lichK = (1.0 - birch) * (1.0 - 0.6 * smoothstep(60.0, 200.0, dist));
    alb = mix(alb, lichA, pA * 0.9 * lichK * (1.0 - 0.7 * cr1));
    alb = mix(alb, lichB, pB * 0.92 * lichK);
    float lich = max(pA, pB) * lichK;
    float mk = smoothstep(0.72, 0.98, N.y * 0.75 + 0.9 * (fbm3(vL * 0.16 + 3.0) - 0.42)) * (1.0 - birch) * uMat.w;
    vec2 mt5 = mossTex(vL.xz * 1.3, fine5);
    alb = mix(alb, mix(cMoss * 0.35, cMoss * 1.05, mt5.x) * (0.75 + 0.4 * vnoise(vL * 2.3)), mk);
    h = (rid * 0.9 + r2 * 0.3 * k2 + fineB * 0.12 - crack * 0.5) * (1.0 - 0.6 * lich) + lich * 0.12 + mk * mt5.y * 0.8;
    bumpK = (0.42 * nearK + 0.04) * (1.0 - 0.5 * birch); gloss = mix(0.2, 0.1, max(mk, lich));
    ao = (0.72 + 0.28 * rid) * (1.0 - 0.45 * crack * (1.0 - mk));
    rime = (0.1 + 0.5 * r2 * k2 * smoothstep(0.3, 0.7, rid)) * (1.0 - 0.9 * crack) + 0.35 * mk;      // rime on the crests and the moss; the cracks stay dark
  #elif FK == 8
    // ---- broken, rotted beech wood: growth rings and dark zone lines on the end grain, long fibre on the split
    // faces, pale sap wood under the bark going through tan to umber rot round the bore; matt and damp.
    // aux = (distance from the log's axis in metres, ao); uMisc.xy = the log's axis on the ground plane
    float rho = vAux.x; vec2 T2 = uMisc.xy;
    vec3 gp = vec3(vL.x * T2.y - vL.z * T2.x, vL.y, dot(vL.xz, T2));
    float endK = smoothstep(0.5, 0.85, abs(dot(N.xz, T2)));
    float fw8 = max(length(dFdx(vL)), length(dFdy(vL)));
    float kf = 1.0 - smoothstep(0.03, 0.12, fw8), km = 1.0 - smoothstep(0.1, 0.45, fw8);
    float fib = mix(0.5, vnoise(vec3(gp.xy * 5.0, gp.z * 0.3)), km), fib2 = mix(0.5, vnoise(vec3(gp.xy * 16.0, gp.z * 0.8 + 3.0)), kf);
    float big8 = vnoise(vec3(gp.xy * 0.33, 2.0)), mid8 = vnoise(vec3(gp.xy * 1.5, 5.0));
    float rr = rho * 2.3 + 1.6 * big8 + 0.3 * mid8, fwR = fwidth(rr);
    float ringC = 0.5 + 0.5 * cos(6.28318 * rr);
    float ringLine = smoothstep(0.55, 0.95, ringC) * (1.0 - smoothstep(0.25, 0.7, fwR));
    float zone = clamp((rho - 7.5) / 2.9 + 0.3 * (big8 - 0.5) + 0.12 * (mid8 - 0.5), 0.0, 1.0);
    vec3 wood8 = mix(mix(cUmber * 0.75, mix(cCopper, cCream, 0.35) * 0.9, smoothstep(0.0, 0.3, zone)), cCream * vec3(0.8, 0.73, 0.58), smoothstep(0.18, 0.6, zone));
    wood8 *= vCol * (0.84 + 0.3 * fib) * (0.92 + 0.16 * fib2);
    wood8 *= 1.0 - endK * (0.42 * ringLine + 0.1 * (1.0 - ringC) * (1.0 - smoothstep(0.25, 0.7, fwR)));
    wood8 *= mix(0.78 + 0.3 * smoothstep(0.35, 0.65, fib), 1.0, endK);
    float zl = (1.0 - smoothstep(0.0, 0.03 + fw8 * 0.4, abs(vnoise(vec3(gp.xy * 0.5, 9.0)) - 0.5))) * smoothstep(0.25, 0.5, zone) * km;
    wood8 = mix(wood8, vec3(0.03, 0.025, 0.02), zl * 0.75 * endK);
    float wr = smoothstep(0.64, 0.78, vnoise(vec3(gp.xy * 0.8 + 13.0, gp.z * 0.25)));
    wood8 = mix(wood8, cCream * 0.8 * vCol, wr * 0.45);
    wood8 = mix(wood8, cMoss * 0.55, smoothstep(0.82, 1.0, zone) * 0.5 * smoothstep(0.35, 0.7, vnoise(vec3(gp.xy * 1.1, 17.0))));
    alb = wood8; ao = vAux.y; gloss = 0.1; sss = 0.0;
    h = fib * 0.22 + fib2 * 0.08 - ringLine * 0.12 * endK; bumpK = 0.3 * nearK * km;
    rime = 0.25 + 0.5 * fib;
  #elif FK == 9
    // ---- beech bark on a bough or a trunk: smooth silver-grey skin, mottled, green with algae in drifts, fine wrinkles
    // round the limb, a few long splits that run with the grain (never closed loops: seen along the limb they converge
    // on the vanishing point), crusts of lichen, moss on whatever faces the sky and round a trunk's foot. Pale birch
    // when the vertex colour is light. aux = (around 0..1, metres along); uMat.z = the limb's radius in metres;
    // uMisc.y = how much more moss; uMisc.x = 1 on a standing trunk (aux.y is then its height).
    float R9 = uMat.z, a9 = vAux.y, ang9 = vAux.x * 6.28318;
    vec3 pm = vec3(cos(ang9) * R9, a9, sin(ang9) * R9);
    // a standing trunk goes up into its crown: it darkens under the leaves and is lost among them in ragged sprays, so
    // that looking straight up the columns end in foliage and never in the air
    // (by the angle it is looked up at, not by its height: from far or near the eye sees the same share of the column)
    float crown9 = uMisc.x * (-V.y * 10.0 + 2.2 * (vnoise(vL * 0.021 + 3.0) - 0.5) + 1.4 * (vnoise(vL * 0.1) - 0.5));
    if (crown9 > 7.6) cut = true;          // (decided here, thrown away after the relief's derivatives)
    // (uMisc.z, 1 as a rule, eases that darkening: under the parasol's vault the trunk beside it is looked up at from its
    // foot, and there it is bark, not a black wedge)
    float crownD = smoothstep(3.2, 7.0, crown9) * uMisc.z, vk9 = clamp((1.0 - uMisc.z) * 2.0, 0.0, 1.0);
    // looked up at, a trunk's flanks go in among the sprays before its middle does: its outline is broken by leaves, and
    // is never one straight edge from the root to the roof
    float spray9 = uMisc.x * vk9 * smoothstep(1.0, 4.6, crown9) * smoothstep(0.34, 0.6, 0.72 * vnoise(vL * 0.13 + 5.0) + 0.28 * vnoise(vL * 0.4 + 9.0));
    // (decided here, on the normal as it is before the relief turns it; thrown away after the relief's derivatives)
    if (uMisc.x > 0.5 && (abs(dot(N, V)) < 0.66 * spray9 || (!gl_FrontFacing && crown9 > 1.0 && vk9 > 0.0))) cut = true;
    float fw9 = max(length(dFdx(vL)), length(dFdy(vL)));                    // metres to a pixel
    float kf9 = 1.0 - smoothstep(0.02, 0.09, fw9), km9 = 1.0 - smoothstep(0.1, 0.5, fw9);
    float fine9 = 1.0 - smoothstep(14.0, 60.0, dist);
    float mott = fbm3(pm * 0.31 + uSeed), mott2 = mix(0.5, vnoise(pm * 1.4 + 3.0), km9);
    float wrF = fwidth(a9) * 8.0;
    float wr = mix(0.5, vnoise(vec3(pm.x * 0.8, a9 * 8.0, pm.z * 0.8)), kf9 * (1.0 - smoothstep(0.12, 0.4, wrF)));
    float lent9 = smoothstep(0.7, 0.8, vnoise(vec3(pm.x * 1.5, a9 * 4.5, pm.z * 1.5) + 5.0)) * kf9;
    float N9 = floor(R9 * 2.4 + 0.5), li = vAux.x * N9, cid = floor(li);
    float wand = 0.56 * (vnoise(vec3(a9 * 0.13, cid * 7.3, 1.0)) - 0.5);
    float dm = abs(fract(li) - 0.5 - wand) * 6.28318 * R9 / max(N9, 1.0);   // metres from this cell's split
    float on9 = smoothstep(0.52, 0.62, vnoise(vec3(a9 * 0.07 + cid * 3.7, cid * 1.3, 9.0)));
    float w9 = 0.035 + 0.06 * vnoise(vec3(a9 * 0.6, cid, 4.0));
    float crack9 = (1.0 - smoothstep(w9, w9 + 0.03 + 1.5 * fw9, dm)) * on9 * min(1.0, 2.5 * w9 / max(fw9, 1e-4)) * (1.0 - smoothstep(0.5, 1.6, fw9));
    float birch = smoothstep(0.5, 0.7, vCol.g);
    vec3 beech = vCol * (0.74 + 0.42 * mott) * (0.92 + 0.16 * mott2) * (0.94 + 0.12 * wr) * (1.0 - 0.22 * lent9);
    beech = mix(beech, beech * vec3(0.74, 1.04, 0.62), smoothstep(0.42, 0.72, vnoise(pm * 0.19 + 11.0)) * 0.55);
    // a standing trunk is read from far off: long dark runs where the rain comes down it, pale flanks between, green drifts
    float run9 = vnoise(vec3(pm.x * 0.06, a9 * 0.011, pm.z * 0.06) + 7.0), run2 = vnoise(vec3(pm.x * 0.2, a9 * 0.03, pm.z * 0.2) + 2.0);
    beech *= mix(1.0, (0.36 + 0.7 * run9) * (0.74 + 0.5 * run2), uMisc.x);
    float bLip = 0.0, bGroove = 0.0, rosK = 0.0, rosRim = 0.0, rosH = 0.0; vec3 rosC = vec3(0.0);
    #ifdef BOUGH
      // ---- the bough is walked along, a hand's width under the eye, and its skin is drawn for that distance: creases
      // of three sizes running round the limb (a dark hairline, a pale lip beside it), lenticels as short dark dashes
      // with raised rims, umber stains, and rosettes of leafy lichen with lobed pale margins and fruit cups in the
      // middle. Each is filtered by the size of a pixel in its own pattern; in frost the rime grows on the lips and rims.
      crack9 *= 0.5 * smoothstep(0.35, 0.6, vnoise(vec3(a9 * 0.8, cid * 3.1, 2.0)));          // the long splits: short and few
      beech *= 1.3 + 0.3 * mix(0.5, vnoise(pm * 5.5 + 2.0), kf9);
      beech = mix(beech, vec3(0.27, 0.205, 0.125) * (0.6 + 0.8 * mott), smoothstep(0.46, 0.72, vnoise(pm * 0.42 + 31.0)) * 0.52);
      beech = mix(beech, vec3(0.2, 0.27, 0.11) * (0.7 + 0.6 * mott2), smoothstep(0.5, 0.78, vnoise(pm * 0.27 + 57.0)) * 0.4);
      float cW = vnoise(vec3(pm.x * 0.3, a9 * 0.1, pm.z * 0.3) + 17.0);
      float s1 = a9 * 0.42 + 0.9 * cW + 0.3 * mott2;
      float s2 = a9 * 1.35 + 1.6 * cW + 0.5 * vnoise(vec3(pm.x * 0.9, a9 * 0.3, pm.z * 0.9));
      float s3 = a9 * 4.6 + 4.0 * cW + 1.2 * vnoise(vec3(pm.x * 1.7, a9 * 0.6, pm.z * 1.7) + 3.0);
      float pr1 = smoothstep(0.3, 0.5, vnoise(vec3(pm.x * 0.25, floor(s1) * 5.3, pm.z * 0.25)));
      float pr2 = smoothstep(0.32, 0.5, vnoise(vec3(pm.x * 0.5, floor(s2) * 5.3 + 2.0, pm.z * 0.5)));
      float pr3 = smoothstep(0.42, 0.6, vnoise(vec3(pm.x * 0.9, floor(s3) * 5.3 + 7.0, pm.z * 0.9)));
      vec3 c1 = crease(s1, fwidth(a9) * 0.42 + 1e-4, 0.019) * pr1, c2 = crease(s2, fwidth(a9) * 1.35 + 1e-4, 0.038) * pr2, c3 = crease(s3, fwidth(a9) * 4.6 + 1e-4, 0.055) * pr3;
      float bLine = max(c1.x * 0.85, max(c2.x * 0.82, c3.x * 0.7));
      bLip = max(c1.y, max(c2.y * 0.85, c3.y * 0.55)); bGroove = c1.z + 0.6 * c2.z;
      // lenticels: one to a cell, a lens lying round the limb
      float Nl9 = max(floor(6.28318 * R9 * 1.1 + 0.5), 1.0), cwl = 6.28318 * R9 / Nl9;
      vec2 lg = vec2(vAux.x * Nl9, a9 * 2.1 + 0.13), lci = floor(lg);
      vec2 lr = h22(lci + 71.0), lq = h22(lci + 13.7);
      vec2 ld = (fract(lg) - 0.35 - 0.3 * lr) * vec2(cwl, 1.0 / 2.1);
      float lhw = 0.12 + 0.18 * lq.x, lth = 0.028 + 0.022 * lq.y;
      float le = length(ld / vec2(lhw, lth)), lpx = fw9 / lth + 1e-3;
      float lon = step(0.5, fract(lq.x * 5.7 + lr.y * 3.3)) * (1.0 - smoothstep(0.035, 0.11, fw9));
      float lentD = lon * (1.0 - smoothstep(1.0 - lpx, 1.0 + lpx, le)) * min(1.0, 1.5 / max(lpx, 1e-3));
      float lentL = lon * smoothstep(1.0, 1.2 + lpx, le) * (1.0 - smoothstep(1.5, 2.1 + lpx, le));
      beech = mix(beech, cUmber * 0.2, max(bLine, lentD * 0.72));
      beech += vCol * (0.3 * bLip * (1.0 - bLine) + 0.2 * lentL);
      bLip = max(bLip, 0.7 * lentL);
      // lichen rosettes: one to a cell or none, five to seven lobes, sage, sulphur or pale grey
      float Nr9 = max(floor(6.28318 * R9 / 2.3 + 0.5), 1.0), cwr = 6.28318 * R9 / Nr9;
      vec2 rg = vec2(vAux.x * Nr9, a9 / 2.3 + 0.37), rci = floor(rg);
      vec2 rr = h22(rci + 5.3), rq = h22(rci + 91.7);
      vec2 rd = (fract(rg) - 0.33 - 0.34 * rr) * vec2(cwr, 2.3);
      float r0 = 0.3 + 0.4 * rq.x, rho = length(rd), th9 = atan(rd.y, abs(rd.x) + abs(rd.y) < 1e-4 ? 1.0 : rd.x), ph9 = rq.y * 6.28318;
      float lob = abs(sin(th9 * (2.5 + 0.5 * floor(rr.x * 2.99)) + ph9));
      float edge9 = r0 * (0.7 + 0.3 * sqrt(lob)) * (1.0 + 0.07 * sin(th9 * 13.0 + ph9 * 5.0));
      float sd9 = rho - edge9, aa9 = fw9 * 0.9 + 0.004;
      float rfade = step(fract(rr.y * 7.31 + rq.x * 3.7), 0.58) * (1.0 - smoothstep(0.1, 0.4, fw9));
      rosK = (1.0 - smoothstep(-aa9, aa9, sd9)) * rfade;
      float zone = clamp(rho / max(edge9, 1e-3), 0.0, 1.0), kind9 = fract(rr.x * 13.7 + rq.y * 5.1);
      vec3 body9 = kind9 < 0.4 ? vec3(0.74, 0.56, 0.11) : kind9 < 0.8 ? vec3(0.44, 0.54, 0.4) : vec3(0.62, 0.66, 0.58);
      vec3 rimC = kind9 < 0.4 ? vec3(0.8, 0.72, 0.3) : vec3(0.74, 0.79, 0.7);
      rosRim = smoothstep(0.8, 0.92, zone) * rosK;
      float slit = (1.0 - smoothstep(0.0, 0.2, lob)) * smoothstep(0.3, 0.6, zone);
      float ringL = 1.0 - smoothstep(0.0, 0.035 + aa9 / r0, abs(zone - 0.5 - 0.06 * sin(th9 * 7.0 + ph9)));
      vec2 dg = rd * 8.5 + rr * 9.0, dq = h22(floor(dg) + rci * 3.1);
      float dd9 = length(fract(dg) - 0.3 - 0.4 * dq), drad = 0.16 + 0.14 * dq.x;
      float cup = (1.0 - smoothstep(drad - aa9 * 8.5, drad + aa9 * 8.5, dd9)) * step(0.35, dq.y) * (1.0 - smoothstep(0.38, 0.52, zone)) * (1.0 - smoothstep(0.012, 0.045, fw9));
      rosC = body9 * (0.6 + 0.3 * zone + 0.22 * vnoise(vL * 6.0)) * (1.0 - 0.45 * slit) * (1.0 - 0.3 * ringL);
      rosC = mix(rosC, rimC, smoothstep(0.8, 0.92, zone));
      rosC = mix(rosC, kind9 < 0.4 ? vec3(0.78, 0.36, 0.05) : vec3(0.17, 0.13, 0.09), cup);
      rosC = mix(rosC, rimC, cup * smoothstep(drad * 0.55, drad * 0.85, dd9) * 0.8);
      rosH = rosK * (0.4 + 0.6 * smoothstep(0.6, 0.9, zone));
      // a rosette lies a little proud of the bark: a thin shadow round it
      beech *= 1.0 - 0.42 * rfade * (1.0 - rosK) * (1.0 - smoothstep(0.0, 0.07 + aa9, sd9));
    #endif
    beech = mix(beech, cUmber * 0.24, crack9 * mix(0.7, 0.85, uMisc.x));
    // high on a trunk the bark is green-brown with algae and moss in drifts (seen only from near its foot, looking up)
    beech = mix(beech, (cMoss * 0.5 + cUmber * 0.34) * (0.55 + 0.9 * run2), uMisc.x * vk9 * smoothstep(0.38, 0.66, vnoise(vL * 0.05 + 23.0)) * smoothstep(0.6, 3.0, crown9) * 0.7);
    beech = mix(beech, cMoss * 0.16 + cUmber * 0.1, crownD * 0.85);
    float lentB9 = smoothstep(0.62, 0.72, vnoise(vec3(pm.x * 0.2, a9 * 0.9, pm.z * 0.2) + 5.0));
    vec3 bir = vCol * (0.86 + 0.14 * mott2) * (1.0 - 0.75 * lentB9);
    alb = mix(beech, bir, birch);
    float lA = vnoise(vL * 0.42 + 9.0) + 0.16 * (vnoise(vL * 1.9 + 4.0) - 0.5), lB = vnoise(vL * 1.25 + 21.0) + 0.12 * (vnoise(vL * 4.3) - 0.5);
    float eA = 0.012 + fw9 * 0.5, eB = 0.02 + fw9 * 1.3;
    float pA = smoothstep(0.61 - eA, 0.61 + eA, lA), pB = smoothstep(0.7 - eB, 0.7 + eB, lB);
    float rimA = pA * (1.0 - smoothstep(0.625, 0.685, lA)), rimB = pB * (1.0 - smoothstep(0.71, 0.76, lB));
    float dots = smoothstep(0.7, 0.8, vnoise(vL * 7.0 + 2.0)) * (1.0 - smoothstep(0.03, 0.1, fw9));
    float sulph = step(0.7, vnoise(vL * 0.31 + 40.0));
    vec3 lichA = vec3(0.5, 0.57, 0.47) * (0.8 + 0.4 * vnoise(vL * 3.1)) * (1.0 + 0.45 * rimA) * (1.0 - 0.6 * dots);
    vec3 lichB = mix(vec3(0.66, 0.68, 0.6), vec3(0.62, 0.55, 0.26), sulph) * (0.7 + 0.5 * vnoise(vL * 5.0)) * (1.0 + 0.3 * rimB);
    float lichK = (1.0 - birch) * (1.0 - 0.7 * smoothstep(60.0, 220.0, dist)) * (1.0 - 0.6 * uMisc.x);
    #ifdef BOUGH
      lichK *= 0.3;             // (the big soft crusts stand back: the rosettes are the lichen here)
    #endif
    // (crusts, not paint: each plate is broken up by the bark's own mottling and is never one flat colour)
    float crust9 = 0.55 + 0.45 * smoothstep(0.35, 0.65, vnoise(vL * 2.6 + 13.0));
    alb = mix(alb, lichA, pA * 0.8 * lichK * crust9 * (1.0 - 0.7 * crack9));
    alb = mix(alb, lichB, pB * 0.75 * lichK * crust9);
    float lich = max(pA, pB) * lichK;
    alb = mix(alb, rosC, rosK);
    float mN = fbm3(vL * 0.16 + 3.0);
    float mk = smoothstep(0.54 - 0.16 * uMisc.y, 0.8 - 0.16 * uMisc.y, N.y * 0.5 + 1.4 * (mN - 0.45)) * step(0.5, uMat.w);
    mk = max(mk, uMisc.x * (1.0 - smoothstep(3.0, 34.0, a9 + 30.0 * (mN - 0.5))) * smoothstep(0.3, 0.55, vnoise(vL * 0.11 + 17.0)));
    mk *= 1.0 - birch * 0.7;
    vec2 mt5 = mossTex(vL.xz * 1.3 + vL.y * 0.9, fine9);
    vec3 moss9 = mix(cMoss * 0.42, mix(cMoss * 1.05, mix(cMoss, cGold, 0.4) * 1.1, smoothstep(0.6, 0.95, mt5.x)), smoothstep(0.08, 0.6, mt5.x)) * (0.75 + 0.4 * vnoise(vL * 2.3));
    alb = mix(alb, moss9, mk);
    h = (mott * 0.7 + wr * 0.05 - crack9 * 0.6 + lent9 * 0.03) * (1.0 - 0.6 * lich) + lich * 0.1 + mk * (0.25 + mt5.y * 0.8);
    bumpK = (0.3 * nearK + 0.03) * (1.0 - 0.5 * birch); gloss = mix(0.22, 0.1, max(mk, lich));
    #ifdef BOUGH
      h += (rosH * 0.12 - bGroove * 0.1) * (1.0 - mk);
      bumpK = 0.7 * nearK * (1.0 - smoothstep(0.04, 0.22, fw9)) + 0.05;
    #endif
    // a bough lying down is darker down its flanks: it reads as round from above
    ao = (0.8 + 0.2 * mott) * (1.0 - 0.5 * crack9 * (1.0 - mk)) * mix(0.62 + 0.38 * smoothstep(-0.35, 0.75, N.y), 1.0, uMisc.x);
    rime = 0.05 + 0.1 * lich + mk * (0.05 + 0.3 * smoothstep(0.6, 0.95, mt5.x));
    #ifdef BOUGH
      // rime as bright lines on the creases' lips and the rosettes' rims, and on the moss tips: no even bloom
      rime = (0.8 * bLip + 0.9 * rosRim + 0.05 * rosK) * (1.0 - mk) + mk * (0.08 + 0.5 * smoothstep(0.55, 0.95, mt5.x));
    #endif
  #elif FK == 6
    // ---- white cushion moss: a pale glaucous dome made of thousands of tiny star tips
    float fine6 = 1.0 - smoothstep(9.0, 36.0, dist);
    // star tips laid on from three sides, so the flanks of the dome carry the same stars as its crown
    vec3 w6 = N * N; w6 *= w6; w6 /= (w6.x + w6.y + w6.z + 1e-4);
    vec2 m6 = mossTex(vL.xz * 0.8, fine6) * w6.y + mossTex(vL.zy * 0.8 + 5.3, fine6) * w6.x + mossTex(vL.xy * 0.8 + 9.1, fine6) * w6.z;
    float big6 = vnoise(vL * 0.5 + uSeed), mid6 = vnoise(vL * 2.1);
    // deep green down between the rosettes, glaucous on them, the youngest tips nearly white
    alb = mix(vCol * vec3(0.36, 0.5, 0.36), vCol * (0.86 + 0.3 * smoothstep(0.5, 1.0, m6.x)), smoothstep(0.05, 0.5, m6.x)) * (0.86 + 0.28 * big6);
    alb = mix(alb, cMoss * 1.1, smoothstep(0.6, 0.85, mid6) * 0.22);
    alb = mix(alb, cUmber * 0.7, (1.0 - smoothstep(0.5, 0.7, vAux.x)) * 0.3);
    h = m6.y * 0.42 + mid6 * 0.25 + big6 * 0.35; bumpK = nearK * (0.3 + 0.7 * fine6); ao = (0.68 + 0.32 * vAux.x) * (0.68 + 0.32 * m6.y); gloss = 0.1; sss = 0.3;
    rime = mix(0.5, smoothstep(0.35, 0.9, m6.x), fine6);
  #else
    // ---- cuticle: black, finely granulate, mirror-wet; the vertex colour is the structural sheen along margins
    #ifdef PILL
      float fwZ7 = fwidth(vP.z);          // (for the plate, below: taken before the branch, which not every pixel of a block takes)
    #endif
    if (vAux.y < -0.5) { alb = vCol; gloss = 0.5; ao = 0.85; }
    else {
      float g7 = vnoise(vP * uMat.z * 0.5);
      alb = vec3(0.02, 0.018, 0.024) * (0.7 + 0.6 * g7) + vCol * 0.035 * vAux.y;
      h = g7 * 0.05 / uMat.z; bumpK = nearK * (1.0 - smoothstep(4.0, 14.0, dist)); ao = vAux.x; gloss = 0.0;
      #ifdef PILL
      {
        // a pill millipede's plate, drawn from the plate's own coordinates (vP: z runs from its hind edge to its front,
        // uMisc.w is its length): dark slate, mottled, a few plates browner; a pale buff hind margin with a dark line
        // before it; fine growth lines parallel to the margin. The belly (aux.y low) is matt and dark.
        float tp = clamp(vP.z / max(uMisc.w, 0.1) + 0.5, 0.0, 1.0);
        float fwp = fwZ7 / max(uMisc.w, 0.1) + 0.004;
        float plate7 = smoothstep(0.4, 0.7, vAux.y);
        vec3 pp = vec3(vP.xy * 2.6, vP.z * 2.6 + vPill.x * 37.0);
        float mot7 = vnoise(pp + 3.0), wob7 = 0.05 * (vnoise(pp * 1.9 + 11.0) - 0.5);
        float mW = 0.125 + 0.035 * vPill.y + 0.6 * wob7;
        // (the end domes, aux.y 0.75, carry no margin)
        float marg7 = (1.0 - smoothstep(mW - fwp, mW + fwp, tp)) * smoothstep(0.8, 0.95, vAux.y);
        float seam7 = (1.0 - smoothstep(0.012, 0.03 + fwp, abs(tp - mW - 0.03))) * min(1.0, 0.03 / fwp);
        float grow7 = 0.5 + 0.5 * sin(tp * 70.0 + 2.0 * mot7); grow7 = mix(0.5, grow7, 1.0 - smoothstep(0.02, 0.07, fwp * 5.0));
        vec3 slate = vec3(0.076, 0.085, 0.106) * (0.74 + 0.5 * mot7) * (0.9 + 0.2 * g7) * (0.93 + 0.14 * grow7);
        slate = mix(slate, vec3(0.092, 0.07, 0.05) * (0.8 + 0.4 * mot7), smoothstep(0.55, 0.9, vPill.x) * 0.6);
        vec3 buff = vec3(0.45, 0.37, 0.225) * (0.82 + 0.3 * g7) * (0.9 + 0.2 * vPill.y);
        alb = mix(slate, buff, marg7) * (1.0 - 0.65 * seam7 * (1.0 - marg7));
        alb = mix(vec3(0.05, 0.046, 0.04), alb, plate7);
        h += marg7 * 0.012;
      }
      #endif
    }
  #endif
  // the relief's derivatives are taken here, on every pixel: not inside the branch below, which only the pixels with
  // relief take, and before a cut pixel is thrown away. Taken where a neighbour does not go, they are not defined.
  vec3 bpx = dFdx(vL), bpy = dFdy(vL); float bhx = dFdx(h), bhy = dFdy(h);
  #if FK == 2 || FK == 9
    if (cut) discard;         // the cut decided above is made here: this was the program's last derivative
  #endif
  #if FK != 7
    // by moonlight colour drains away: copper and umber, which hold no blue, would go black; they go pewter instead
    alb = mix(alb, vec3(dot(alb, vec3(0.3, 0.55, 0.15)) * 1.25 + 0.07), uNight * 0.8);
  #endif
  vec3 Ng = N;
  #if FK == 0 || FK == 2
    // a leaf seen edge-on keeps its shape and loses its relief: the pleats are in its colour, not in its normal
    bumpK *= smoothstep(0.08, 0.42, abs(dot(N, V)));
  #endif
  if (bumpK > 0.0) N = bumpN(N, bpx, bpy, bhx, bhy, bumpK);
  // under the leaf arcade the skylight is cut off: only the glow through its walls and the far mouth remain
  float ay = clamp((vL.y - uArc.z) / (uArc.w + 1.5), 0.0, 1.0);
  float arcSh = smoothstep(uArc.x - 5.0, uArc.x + 7.0, vL.z) * (1.0 - smoothstep(uArc.y - 7.0, uArc.y + 5.0, vL.z)) * (1.0 - smoothstep(0.8, 1.15, abs(vL.x) / (6.5 * (1.0 - ay) + 4.5)));
  ao *= 1.0 - 0.22 * arcSh;
  // ---- light: pearl skylight with a soft key from the bright side, copper bounce, the one shaft, wet highlights
  float beam = shaftMask(vL) * capLit(vL);
  #if FK == 9
    beam *= 1.0 - 0.9 * uMisc.x;            // a great trunk stands outside the one shaft: it is the dark the shaft is seen against
    ao *= 1.0 - 0.55 * crownD;
  #endif
  float ndl = dot(N, uSunDir);
  float dif = clamp(ndl * 0.88 + 0.12, 0.0, 1.0);
  float ndk = dot(N, uKeyDir);
  vec3 sky = mix(uGroundCol, uSkyCol, N.y * 0.5 + 0.5);
  vec3 col = alb * sky * ao * 0.95;
  col += alb * uKeyCol * ao * clamp(ndk * 0.7 + 0.3, 0.0, 1.0);
  col += alb * uSunCol * dif * beam;
  col += alb * (uKeyCol + cCopper * 0.2) * 0.62 * arcSh;      // warm light filtered through the arcade's walls
  // translucency: thin leaves and flesh glow when the bright side is behind them
  float back = max(dot(V, -uKeyDir), 0.0); back = back * back;
  vec3 thru = alb * (vec3(1.0) + 1.2 * alb / max(max(alb.r, max(alb.g, alb.b)), 0.05));
  col += thru * uKeyCol * sss * clamp(0.35 - ndk, 0.0, 1.0) * (0.35 + 1.5 * back);
  col += thru * uSunCol * sss * shaftMask(vL) * clamp(0.4 - ndl, 0.0, 1.0) * (0.25 + 1.2 * back);
  // wet highlights. Leaves and litter take one broad soft sheen of sky from their own shape and no mirror image of the
  // canopy: at a grazing angle a mirror turns every pleat into a white band
  vec3 Nr = N; float fresCap = 1.0, specP = 48.0, specK = 1.6, mirK = 1.0, shP = 14.0, shK = 0.36;
  #if FK == 0 || FK == 2
    Nr = normalize(mix(Ng, N, 0.4)); fresCap = 0.3; specP = 10.0; specK = 0.34; mirK = 0.0; shP = 5.0; shK = 0.3;
  #endif
  #if FK == 5 || FK == 8 || FK == 9
    // bark and broken wood are matt: damp darkens them, and only a faint broad sheen of sky lies on the ridges
    fresCap = 0.12; specP = 8.0; specK = 0.25; mirK = 0.0; shP = 4.0; shK = 0.22;
  #endif
  vec3 R = reflect(-V, Nr);
  float nv = clamp(dot(Nr, V), 0.0, 1.0);
  float fres = min(0.04 + 0.96 * pow(1.0 - nv, 5.0), fresCap);
  float wet = gloss * uWet;
  vec3 env = mix(uSkyCol * 0.9, skyRefl(R), mirK);
  col += (env * 0.5 * fres * smoothstep(-0.2, 0.6, R.y) + uSkyCol * shK * pow(max(R.y, 0.0), shP)) * wet * ao;
  vec3 Hk = normalize(uKeyDir + V + vec3(0.0, 1e-4, 0.0));
  col += uKeyCol * wet * specK * pow(max(dot(Nr, Hk), 0.0), specP) * ao;
  vec3 Hh = normalize(uSunDir + V + vec3(0.0, 1e-4, 0.0));
  col += uSunCol * wet * beam * 2.2 * pow(max(dot(Nr, Hh), 0.0), 60.0);
  // water beads on leaves: a point of sky each, gold in the shaft
  col = col * (1.0 - 0.12 * glint.y) + (uSkyCol * 2.6 + uSunCol * beam * 1.5) * glint.x * uWet * (1.0 - uFrost);
  // a near fallen leaf's crowns and curled rim catch the sky (dry under frost: there the hoar glints instead, cold points
  // on the rime, gold only in the shaft: see the frost below)
  col += (uSkyCol * 0.4 + alb * 1.5) * (uSkyCol + uSunCol * beam * 0.5) * crest * uWet * (1.0 - 0.5 * uFrost) * ao;
  #if FK == 7 && defined(PILL)
    if (vAux.y >= -0.5) {
      // A pill millipede's plates are polished slate, and the light on them does not ask which way is up: rolled into a
      // ball its plates face every way. The wood's skylight wraps the whole animal; a broad soft band of the pearl sky
      // lies across whatever faces between the eye and the open canopy over its shoulder, with a tight highlight inside
      // it; where a plate turns away from the eye it carries a cool rim; and in the one shaft the plates take the sun.
      // By moonlight the band is the bright gaps of the canopy, not the dim air.
      float plate7 = smoothstep(0.4, 0.7, vAux.y);
      vec3 skyP = uSkyCol * (1.0 + 3.0 * uNight);
      vec3 Lw = normalize(V + vec3(0.0, 0.85, 0.0));
      float nl7 = clamp(dot(N, Lw), 0.0, 1.0);
      float band7 = nl7 * nl7 * nl7;
      float rim7 = 1.0 - nv; rim7 = rim7 * rim7 * (0.35 + 0.65 * rim7);
      col += alb * skyP * 0.5;
      col += skyP * ao * plate7 * (0.21 * band7 + 0.8 * pow(nl7, 48.0));
      col += skyP * vec3(0.82, 0.96, 1.2) * 0.34 * rim7 * ao * (0.35 + 0.65 * plate7);
      col += uKeyCol * 0.8 * pow(max(dot(N, Hk), 0.0), 30.0) * ao * plate7;
      col += uSunCol * beam * (0.5 * alb * clamp(ndl * 0.5 + 0.5, 0.0, 1.0) + 1.6 * plate7 * pow(max(dot(N, Hh), 0.0), 60.0));
    }
  #elif FK == 7
    if (vAux.y >= -0.5) {
      // cuticle mirrors the canopy above and the litter below, with a tight sky highlight and a violet (or bronze) edge
      vec3 env7 = mix(uGroundCol * 0.6, skyRefl(R), smoothstep(-0.25, 0.3, R.y));
      col += env7 * (0.06 + 0.94 * pow(1.0 - nv, 4.0)) * ao * 0.9;
      col += uSkyCol * (1.3 * pow(max(R.y, 0.0), 24.0) + 0.16 * pow(max(R.y, 0.0), 4.0)) * ao;
      col += uKeyCol * 1.6 * pow(max(dot(N, Hk), 0.0), 60.0) * ao;
      col += uSunCol * beam * 2.0 * pow(max(dot(N, Hh), 0.0), 80.0);
      float gz = 1.0 - nv;
      col += vCol * vAux.y * ao * (0.045 + 0.24 * max(N.y, 0.0) + 1.0 * gz * gz * gz) * (uSkyCol.g * 1.5 + 0.15);
      #ifdef SNAKE
      {
        // a snake millipede is a row of polished rings, and each ring carries its own sharp point of the sky: the
        // highlight lies on the crown of every ring (vP.z runs along the ring, uMisc.w is its length) and is cut by the
        // groove between two rings, so it runs down the animal as a line of beads. A cool rim where the ring turns away.
        float tr = clamp(vP.z / max(uMisc.w, 0.05) + 0.5, 0.0, 1.0);
        float crown7 = smoothstep(0.08, 0.42, tr) * (1.0 - smoothstep(0.58, 0.92, tr));
        vec3 skyP = uSkyCol * (1.0 + 3.0 * uNight);
        vec3 Lw = normalize(V + vec3(0.0, 0.85, 0.0));
        float nl7 = clamp(dot(N, Lw), 0.0, 1.0);
        float rim7 = 1.0 - nv; rim7 = rim7 * rim7 * (0.35 + 0.65 * rim7);
        col += skyP * ao * crown7 * (4.5 * pow(nl7, 64.0) + 0.05 * nl7 * nl7 * nl7);
        col += skyP * vec3(0.82, 0.96, 1.2) * 0.1 * rim7 * ao * (0.4 + 0.6 * crown7);
      }
      #endif
    }
  #endif
  #if FK != 7
    // hoar frost: white crystals along margins, midribs and shoot tips, and a thin even bloom of them over the rest
    float grain = mix(0.5, vnoise(vL * 19.0), 1.0 - smoothstep(10.0, 38.0, dist));
    float frBase = 0.04 + 0.1 * grain;
    #ifdef BOUGH
      frBase = 0.012 + 0.03 * grain;
    #endif
    float fr = uFrost * clamp(Ng.y * 0.7 + 0.5, 0.0, 1.0) * clamp(rime * (0.7 + 0.5 * grain) + frBase, 0.0, 1.0);
    #if FK == 9
      fr *= 1.0 - 0.9 * crownD;
    #endif
    col = mix(col, uSkyCol * 1.15 + uKeyCol * 0.7 + uSunCol * beam * 0.6, fr * 0.78);
    col += (uSkyCol * vec3(0.92, 1.0, 1.2) * 3.2 + uSunCol * beam * 1.2) * hoar * uFrost * clamp(Ng.y * 0.7 + 0.5, 0.0, 1.0);
  #endif
  gl_FragColor = vec4(col, 1.0);
  #if FK == 9 && defined(USE_FOG)
    // the great trunks are the dark of the wood: the mist takes them at half the rate it takes the litter, so that at
    // three distances they are three darks and never slabs of the mist's own grey
    // (and up in the crowns it is dark against the leaves)
    float fd9 = vFogDepth * mix(1.0, 0.3 * (1.0 - 0.65 * smoothstep(3.2, 7.0, crown9)), uMisc.x);
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, 1.0 - exp(-fogDensity * fogDensity * fd9 * fd9));
  #else
  #include <fog_fragment>
  #endif
}`,so=`
attribute vec4 iB;          // phase, kind (0 bead, 1 drip), fall height, period
varying vec3 vL, vN;
#include <fog_pars_vertex>
${V0}
void main(){
  vec3 c = instanceMatrix[3].xyz;
  float s = length(instanceMatrix[0].xyz);
  vec3 p = position; vec3 sc = vec3(1.0, 0.8, 1.0); float drop = 0.0;
  float tremble = sin(uTime * (4.0 + 5.0 * fract(iB.x * 7.3)) + iB.x * 40.0);
  if (iB.y < 0.5) {
    sc = vec3(1.0 - 0.05 * tremble, 0.78 + 0.07 * tremble, 1.0 - 0.05 * tremble);
  } else {
    float f = fract(uTime / iB.w + iB.x) * iB.w;
    drop = min(15.0 * f * f, 25.0 * f);
    float wob = sin(f * 15.0 + iB.x * 9.0) * 0.16;
    sc = vec3(1.0 + wob, 0.85 - wob * 1.4, 1.0 + wob);
    if (drop > iB.z) {
      float fh = iB.z < 41.6 ? sqrt(iB.z / 15.0) : iB.z / 25.0;
      float a = clamp((f - fh) / 0.5, 0.0, 1.0);
      drop = iB.z;
      float rim = smoothstep(0.3, 1.0, length(position.xz));
      sc = vec3(1.0 + 3.2 * a, (0.45 + 2.2 * rim * sin(a * 3.14159)) * (1.0 - a) * (1.0 - a), 1.0 + 3.2 * a) * step(a, 0.995);
      p.y = abs(p.y);
    }
  }
  vec3 lp = c + p * s * sc - vec3(0.0, drop, 0.0);
  vL = lp; vN = normalize(position / max(sc, vec3(0.2)) + vec3(0.0, 1e-4, 0.0));
  vec4 mvPosition = viewMatrix * vec4(lp, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,oo=`
attribute vec3 aK;
attribute vec2 iA;
varying vec3 vL, vN;
#include <fog_pars_vertex>
${V0}
void main(){
  vec3 c = instanceMatrix[3].xyz; float s = length(instanceMatrix[0].xyz);
  float a = clamp(iA.x, 0.0, 1.0);
  float open = 1.0 - (1.0 - a) * (1.0 - a);
  float R = mix(0.4, 2.1, open), H = 1.9 * sin(min(a * 1.2, 1.0) * 3.14159);
  vec3 p, n;
  if (aK.x < 0.5) {
    float th = position.x * 6.28318, v = position.y;
    float spike = 0.5 + 0.5 * cos(th * 11.0 + iA.y * 6.0); spike *= spike * spike;
    float r = R * (0.74 + 0.4 * v * v);
    p = vec3(cos(th) * r, H * v * (0.4 + 0.6 * spike * v), sin(th) * r);
    n = vec3(cos(th), 0.55 - 0.9 * v, sin(th));
  } else {
    float th = (aK.y + iA.y) * 6.28318, t = max(a - 0.16, 0.0) * 1.5;
    float r = R * 1.1 + 2.4 * t * (0.6 + 0.8 * aK.z);
    float rad = 0.17 * (0.7 + 0.6 * aK.z) * step(0.16, a) * (1.0 - smoothstep(0.86, 1.0, a));
    p = vec3(cos(th) * r, 1.1 + 3.4 * t - 4.4 * t * t, sin(th) * r) + position * rad;
    n = position;
  }
  vec3 lp = c + p * s * step(0.002, a) * step(a, 0.998);
  vL = lp; vN = normalize(n + vec3(0.0, 1e-4, 0.0));
  vec4 mvPosition = viewMatrix * vec4(lp, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,no=ks.replace("gl_FragColor = vec4(col, 1.0);","float lum = dot(col, vec3(0.3, 0.5, 0.2)); gl_FragColor = vec4(col, clamp(0.07 + 0.8 * fres + smoothstep(0.8, 1.6, lum), 0.0, 1.0));"),ro=`
attribute vec4 aC;
attribute float aSz;
uniform float uPx;
varying vec4 vC;
varying float vFog;
void main(){
  vec4 mv = viewMatrix * vec4(position, 1.0);
  float px = aSz * projectionMatrix[1][1] * uPx * 0.5 / max(-mv.z, 0.5);
  float pc = clamp(px, 1.5, 46.0);
  float al = (px > 46.0 ? 46.0 / px : 1.0) * smoothstep(1.5, 6.0, -mv.z);
  vC = aC * al; vFog = -mv.z;
  gl_PointSize = pc;
  gl_Position = projectionMatrix * mv;
}`,io=`
attribute vec4 aS;
uniform float uPx;
uniform vec3 uBox, uDrift, uMoteCol;
uniform float uMoteK;
varying vec4 vC;
varying float vFog;
${V0}
void main(){
  vec3 p = aS.xyz * uBox + uDrift * uTime * (0.6 + 0.8 * aS.w);
  p.x += 1.2 * sin(uTime * 0.3 + aS.w * 40.0); p.y += 0.8 * sin(uTime * 0.23 + aS.w * 70.0);
  p = mod(p - uCamL + uBox * 0.5, uBox) - uBox * 0.5;
  float edge = 1.0 - smoothstep(0.38, 0.5, max(abs(p.x) / uBox.x, max(abs(p.y) / uBox.y, abs(p.z) / uBox.z)));
  vec3 wp = p + uCamL;
  float lit = coreMask(wp) * capLit(wp);
  float tw = 0.5 + 0.5 * sin(uTime * (2.0 + 5.0 * aS.w) + aS.w * 300.0); tw *= tw;
  vec4 mv = viewMatrix * vec4(wp, 1.0);
  float size = mix(0.5 + 0.9 * fract(aS.w * 13.0), 0.16, lit);
  float px = size * projectionMatrix[1][1] * uPx * 0.5 / max(-mv.z, 0.5);
  float pc = clamp(px, 1.5, 26.0);
  float al = mix(0.10 * uMoteK, 0.5, lit) * edge * min(px / 1.5, 1.0) * (px > 26.0 ? 26.0 / px : 1.0) * smoothstep(2.0, 7.0, -mv.z);
  vC = vec4(mix(uMoteCol, uSunCol * (0.5 + 2.5 * tw), lit) * al, al * (1.0 - 0.7 * lit));
  vFog = -mv.z;
  gl_PointSize = pc;
  gl_Position = projectionMatrix * mv;
}`,Ss=`
uniform vec3 fogColor;
uniform float fogDensity;
varying vec4 vC;
varying float vFog;
void main(){
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float s = 1.0 - smoothstep(0.0, 1.0, d); s *= s;
  vec4 c = vC * s;
  float f = 1.0 - exp(-fogDensity * fogDensity * vFog * vFog);
  c.rgb = mix(c.rgb, fogColor * c.a, f);
  gl_FragColor = c;
}`,lo=`
varying vec3 vD;
void main(){ vD = position; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv; }`,co=`
uniform vec3 uFogCol, uCanA, uCanB, uCanC, uGap, uGlow, uTone0, uTone1, uTone2, uTone3, cUmber, cGold, uKeyCol, uKeyDir;
uniform float uSeed, uGapK, uFloorY, uFogDens, uNight, uVault;
uniform vec3 uAmber;
uniform vec4 uAxis;      // xz: the direction from the entry to the parasol; w: how strongly the lit clearing behind it glows
uniform vec4 uHero;      // xyz: the direction from the eye to the parasol's cap; w: how far the canopy round it is put in shade
varying vec3 vD;
${V0}
${Bs}
// One layer of the canopy seen from below against the light: real beech leaves, each with its midrib and veins, hanging
// in sprays with sky or deeper foliage between. g: the layer's plane coordinate; fw: a pixel's size in g; dens: the share
// of leaves kept here (sprays). Returns the coverage and the covering leaf's colour. A leaf smaller than a few pixels
// is not drawn as a leaf: the layer goes over to an even veil of its mean colour, so nothing sparkles.
float leafLayer(vec2 g, float seed, float fw, float dens, out vec3 lc){
  vec2 buv; float bid, be, bl, bn;
  float best = leafCell(g, seed, buv, bid, be, bl, bn);
  float keep = step(fract(bid * 37.7), dens);
  float fl = fw / max(bl, 1.0);
  float a = best >= 0.0 ? smoothstep(0.0, fl + 0.004, be) * keep : 0.0;
  // (a crown is one colour: green, lemon or copper by the drift, each leaf only a little off its neighbours)
  float tsel = vnoise(vec3(g * 0.11, seed + 2.0)) + 0.3 * (vnoise(vec3(g * 0.37, seed)) - 0.5) + 0.16 * (fract(bid * 11.3) - 0.5);
  vec3 tone = mix(mix(uCanC, uCanB, smoothstep(0.4, 0.5, tsel)), uCanA, smoothstep(0.58, 0.68, tsel));
  tone *= 0.8 + 0.36 * fract(bid * 7.3);
  float kv = 1.0 - smoothstep(0.03, 0.12, fl);
  float mid = (1.0 - smoothstep(0.005, 0.012 + fl, abs(buv.y))) * kv;
  float vv = (1.0 - smoothstep(0.1, 0.3, abs(fract((buv.x - abs(buv.y) * 1.05) * 8.0 + bid * 7.0) - 0.5))) * (1.0 - smoothstep(0.008, 0.03, fl));
  lc = tone * (1.0 - 0.5 * mid) * (1.0 - 0.24 * vv) * (0.8 + 0.3 * smoothstep(0.0, 0.07, be));
  float lost = smoothstep(0.22, 0.6, fw);
  lc = mix(lc, uCanA * 0.4 + uCanB * 0.32 + uCanC * 0.28, lost);
  return mix(a, dens * 0.86, lost);
}
// a rank of far trunks standing round the horizon: n places, each with a column at its own spot and of its own girth,
// flared at the foot. az 0..1 round the horizon; aa: a pixel in the same unit. Returns coverage; sdn = -1..1 across the
// trunk, idr its random
float trunkRank(float az, float elv, float n, float seed, float aa, out float sdn, out float idr){
  float c = az * n, i = floor(c);
  float h = fract(sin((i + seed) * 12.9898) * 43758.5453), h2 = fract(h * 17.3);
  float wHalf = (0.05 + 0.04 * h2) * (1.0 + 1.1 * exp(-elv * 15.0) * (1.0 + 0.2 * sin(elv * 50.0 + h * 40.0)) + 0.3 * exp(-elv * 3.5)) * (1.0 - 0.35 * elv);
  float ce = max(cos(elv), 0.15);       // a column keeps its girth as the eye looks up it
  sdn = (c - i - 0.33 - 0.34 * h) * ce / wHalf; idr = h;
  float e = aa * n * ce / wHalf;
  return 1.0 - smoothstep(1.0 - e, 1.0 + e, abs(sdn));
}
void main(){
  vec3 d = normalize(vD + vec3(0.0, 1e-4, 0.0));
  vec3 col;
  // (the canopy's plane coordinate and a pixel's size in it, for the branch above the horizon: taken here on every pixel,
  // since a derivative taken in a branch that the pixel next to it does not take is not defined)
  float up = max(d.y, 0.0);
  vec2 uv = d.xz / (up + 0.3);
  vec2 fwv = fwidth(uv);
  if (d.y < -0.003) {
    float t = max(cameraPosition.y - uFloorY, 0.4) / max(-d.y, 1e-3);
    vec3 P = cameraPosition + d * t;
    vec2 buv, uvB; float bid, idB, be, eB, bl, lB, nT, nB;
    float best = leafCell(P.xz / 6.6, uSeed, buv, bid, be, bl, nT);
    float pB = leafCell(P.xz / 5.7 + 37.7, uSeed + 5.0, uvB, idB, eB, lB, nB);
    float under = 0.0;
    if (best < 0.0 && pB >= 0.0) { buv = uvB; bid = fract(idB + 0.37); be = eB; best = pB; under = 1.0; }
    float n1 = vnoise(P * 0.35 + uSeed), n2 = vnoise(P * 1.7);
    vec3 alb = mix(cUmber * 0.9 + 0.012, uTone3 * 0.7, smoothstep(0.3, 0.7, n1)) * (0.62 + 0.5 * n2) * 0.78;
    float gl = 0.5;
    if (best >= 0.0) {
      vec3 tone = bid < 0.25 ? uTone0 : bid < 0.5 ? uTone1 : bid < 0.75 ? uTone2 : uTone3;
      tone = mix(tone, cGold * 0.5, step(0.86, fract(bid * 11.3)) * 0.4);
      tone *= 0.74 + 0.5 * fract(bid * 7.3);
      float mid = 1.0 - smoothstep(0.004, 0.02, abs(buv.y));
      float vv = 1.0 - smoothstep(0.1, 0.3, abs(fract((buv.x - abs(buv.y) * 1.05) * 9.0 + bid * 7.0) - 0.5));
      vec3 leaf = tone * (0.62 + 0.5 * vnoise(vec3(buv * 9.0, bid * 30.0))) * (1.0 - 0.45 * mid) * (0.72 + 0.28 * vv);
      leaf = mix(leaf, cUmber * 0.42, smoothstep(0.5, 0.75, vnoise(vec3(buv * 6.0, bid * 17.0))) * 0.6);
      leaf *= (1.0 - 0.42 * under) * (0.4 + 0.6 * smoothstep(0.0, 0.05, be));
      alb = mix(alb, leaf, smoothstep(0.0, 0.01, be));
      gl = 0.4 + 0.5 * fract(bid * 5.1);
    }
    if (under > 0.5 || best < 0.0) alb *= 0.7 + 0.3 * smoothstep(0.0, 0.055, nT);
    alb = mix(alb, vec3(dot(alb, vec3(0.3, 0.55, 0.15)) * 1.25 + 0.07), uNight * 0.8);
    // seen close (from the portal, before the floor mesh begins) it must not go flat: copper and umber, blotched,
    // with wet-black crumbs and husk shadows in it
    float nearF = 1.0 - smoothstep(30.0, 110.0, t);
    alb *= mix(vec3(1.0), vec3(1.0, 0.8, 0.6), 0.6 * nearF) * (0.72 + 0.56 * vnoise(P * 1.3 + 5.0));
    alb = mix(alb, cUmber * 0.22, smoothstep(0.6, 0.7, vnoise(vec3(P.xz * 0.5, 3.0))) * 0.8 * nearF);
    col = alb * (uSkyCol * 0.95 + uKeyCol * clamp(uKeyDir.y * 0.7 + 0.3, 0.0, 1.0)) * mix(0.8, 0.6, nearF);
    float fres = 0.04 + 0.96 * pow(1.0 - clamp(-d.y, 0.0, 1.0), 5.0);
    col += uSkyCol * uWet * gl * (0.16 * fres + 0.5 * smoothstep(0.55, 0.8, vnoise(vec3(P.xz * 0.9, 7.0))) * smoothstep(0.6, 0.9, n2));
    // beads of water catching the sky
    vec2 bc = P.xz / 2.6, bi = floor(bc); vec2 br = h22(bi + 91.0);
    col += uSkyCol * 1.5 * step(0.8, br.x) * (1.0 - smoothstep(0.03, 0.1, length(fract(bc) - 0.25 - 0.5 * br)));
    float f = 1.0 - exp(-uFogDens * uFogDens * t * t);
    col = mix(col, uFogCol, f);
  } else {
    float fw = max(fwv.x, fwv.y);
    vec2 sway = 0.02 * vec2(sin(uTime * 0.21 + uv.y * 2.0), cos(uTime * 0.17 + uv.x * 2.0));
    float big = vnoise(vec3(uv * 0.9, uSeed)), big2 = vnoise(vec3(uv * 2.1 + 7.0, uSeed + 3.0));
    float sunward = max(dot(d, uSunDir), 0.0);
    float az = atan(d.z, abs(d.x) + abs(d.z) < 1e-5 ? 1.0 : d.x), elv = asin(clamp(d.y, 0.0, 1.0)), cel = sqrt(max(1.0 - d.y * d.y, 0.0));
    // The canopy is read from the ground up as three depths of beech leaf against the light. Deepest: the dark of the
    // crowns with pearl sky showing through in clusters. Over it a roof of small leaves in the crowns' own shade. Then
    // sprays of larger leaves lit through, copper, lemon and green, and nearest a few big leaves hanging low.
    vec3 skyC = uGap * (0.84 + 0.3 * sunward * sunward);
    vec3 deepC = mix(mix(uCanA, uCanC, smoothstep(0.3, 0.7, big)), uCanB, smoothstep(0.55, 0.85, big2) * 0.5) * 0.3;
    float gapN = vnoise(vec3(uv * 4.6 + 3.0, uSeed + 9.0)) + 0.3 * (vnoise(vec3(uv * 15.0, 2.0)) - 0.5);
    float gapT = 0.64 - uGapK - 0.1 * sunward * sunward;
    float gapM = smoothstep(gapT, gapT + 0.1, gapN);
    vec3 can = mix(deepC, skyC, gapM);
    vec3 lc;
    float deep = smoothstep(0.1, 0.55, d.y) * (1.0 - uNight);
    float c3 = leafLayer(uv * 64.0 + sway * 30.0 + uSeed, 3.0, fw * 64.0, 0.78 + 0.2 * big, lc);
    can = mix(can, lc * mix(vec3(0.5), vec3(0.34, 0.42, 0.37), deep), c3);
    float c2 = leafLayer(uv * 34.0 + sway * 18.0 + 11.0, 7.0, fw * 34.0, smoothstep(0.3, 0.7, vnoise(vec3(uv * 2.6 + 5.0, uSeed + 1.0))), lc);
    can = mix(can * (1.0 - 0.3 * c2), lc * (0.66 + 0.6 * sunward) * (0.85 + 0.3 * big2), c2);
    float c1 = leafLayer(uv * 19.0 + sway * 12.0 + 23.0, 13.0, fw * 19.0, smoothstep(0.56, 0.74, vnoise(vec3(uv * 1.5 + 9.0, uSeed + 5.0))) * 0.85, lc);
    can = mix(can * (1.0 - 0.35 * c1), lc * (0.58 + 0.5 * sunward), c1);
    // round the parasol the canopy is a dark, cool mass of copper and green: the lit cap and the bar stand against it
    // (under the vault itself the whole canopy above is that mass, a stop down and cooler: the lit gills and the gold
    // side of the stalk are then the brightest things in the picture, and only a few pearl gaps break the dark)
    float hk = smoothstep(mix(0.72, -0.35, uVault), mix(0.96, 0.3, uVault), dot(d, uHero.xyz)) * uHero.w;
    can = mix(can, can * mix(vec3(0.5, 0.62, 0.56), vec3(0.26, 0.38, 0.4), uVault), hk);
    // great boughs reach up from the trunks into the canopy: dark limbs with a fork each, in front of the leaves
    float bough = 0.0;
    float aaz = (abs(fwv.x) + abs(fwv.y)) * 0.35 + 0.002;
    for (int i = 0; i < 7; i++) {
      float fi = float(i), hb = fract(sin(fi * 12.9898 + uSeed * 3.1) * 43758.5453), hc = fract(hb * 13.7);
      float a0 = fi * 0.898 + hb * 0.5 + uSeed;
      float c = a0 + (hc - 0.5) * 1.5 * elv + 0.07 * sin(elv * 7.0 + fi * 2.3);
      float w = mix(0.05, 0.01, smoothstep(0.0, 1.25, elv)) * (0.7 + 0.6 * hc);
      float da = abs(mod(az - c + 3.14159, 6.28318) - 3.14159) * cel;
      float m = 1.0 - smoothstep(w - aaz, w + aaz, da);
      float c2b = c + (hb > 0.5 ? 1.0 : -1.0) * 0.55 * max(elv - 0.22 - 0.3 * hc, 0.0);
      float da2 = abs(mod(az - c2b + 3.14159, 6.28318) - 3.14159) * cel;
      m = max(m, (1.0 - smoothstep(w * 0.5 - aaz, w * 0.5 + aaz, da2)) * step(0.22 + 0.3 * hc, elv));
      bough = max(bough, m * smoothstep(0.2, 0.36, elv) * (1.0 - smoothstep(0.8, 1.25, elv)));
    }
    can = mix(can, mix(uFogCol * 0.3, deepC, 0.5) * (1.0 - 0.4 * hk), bough * 0.86);
    can += uGlow * (0.5 * pow(sunward, 6.0) + 1.2 * pow(sunward, 40.0)) * (1.0 - bough * 0.6);
    float hz = 1.0 - smoothstep(0.03, 0.36, d.y);
    // a far glade: low on the sun's side the wood opens, and the mist there is bright; the trunks stand dark against it
    float sunAz = atan(uSunDir.z, abs(uSunDir.x) + abs(uSunDir.z) < 1e-5 ? 1.0 : uSunDir.x);
    float dAz = abs(mod(az - sunAz + 3.14159, 6.28318) - 3.14159);
    float glade = exp(-dAz * dAz * 2.2) * exp(-elv * 7.0) * (1.0 - uNight * 0.6);
    vec3 fogH = uFogCol * (1.0 + 0.22 * glade) + uGlow * 1.6 * glade;
    col = mix(can, fogH, clamp(0.08 + 0.92 * hz, 0.0, 1.0));
    // the wall of the wood: two ranks of far trunks, the nearer rank darker, each lit from the bright side, mossed at
    // the foot; they fade up into the canopy, where the boughs take over
    float az01 = az / 6.28318 + 0.5, aaT = aaz / 6.28318 / max(cel, 0.2);
    float sdB, idB2, sdA, idA2;
    float tB = trunkRank(az01, elv, 19.0, 3.0 + uSeed, aaT, sdB, idB2);
    float tAr = trunkRank(az01, elv, 10.0, 11.0 + uSeed, aaT, sdA, idA2);
    float tFade = (1.0 - smoothstep(0.22, 0.6, elv)) * (0.5 + 0.5 * smoothstep(0.0, 0.05, elv));
    float sideL = clamp(2.0 * sin(sunAz - az), -1.0, 1.0);
    float barkB = 0.9 + 0.2 * vnoise(vec3(sdB * 5.0 + idB2 * 20.0, elv * 2.0, 1.0));
    vec3 tcolB = fogH * mix(0.74, 0.6, idB2) * vec3(0.94, 1.0, 0.97) * (0.86 + 0.2 * clamp(sdB, -1.0, 1.0) * sideL) * barkB;
    col = mix(col, tcolB, tB * tFade * 0.9);
    float barkA = 0.88 + 0.24 * vnoise(vec3(sdA * 6.0 + idA2 * 20.0, elv * 2.0, 1.0)) - 0.14 * smoothstep(0.55, 0.75, vnoise(vec3(sdA * 2.5 + idA2 * 9.0, elv * 14.0, 4.0)));
    vec3 tcolA = mix(uFogCol * vec3(0.4, 0.44, 0.41), uFogCol * vec3(0.25, 0.29, 0.27), idA2) * (0.84 + 0.3 * clamp(sdA, -1.0, 1.0) * sideL) * barkA;
    tcolA = mix(tcolA, tcolA * vec3(0.72, 1.1, 0.6), exp(-elv * 16.0) * 0.6);
    col = mix(col, tcolA, tAr * tFade * mix(0.7, 0.95, idA2));
    // the great beech that stands behind the parasol as the entry sees it: a darker wall for the lit column to stand against
    vec2 hd = normalize(d.xz + vec2(1e-5, 0.0));
    float behind = smoothstep(0.95, 0.994, dot(hd, uAxis.xy)) * (1.0 - smoothstep(0.07, 0.3, d.y));
    col = mix(col, uAmber * (0.8 + 0.4 * vnoise(vec3(d.xz * 9.0, 2.0))), behind * 0.88 * uAxis.w);
  }
  col = mix(col, uFogCol, 1.0 - smoothstep(0.0, 0.02, abs(d.y + 0.003)));
  gl_FragColor = vec4(col, 1.0);
}`;function kt(F){let z=0,H=0;for(const Vt of F){const Ot=Vt.g||Vt;z+=Ot.attributes.position.count,H+=Ot.index.count}const st=new Float32Array(z*3),Bt=new Float32Array(z*3),qt=new Float32Array(z*3),dt=new Float32Array(z*2),R=new(z>65535?Uint32Array:Uint16Array)(H);let N=0,V=0;const ot=new k.Vector3,Pt=new k.Matrix3;for(const Vt of F){const Ot=Vt.g||Vt,pt=Vt.m||null,Qt=Ot.attributes.position.count,At=Ot.attributes.position.array,gt=Ot.attributes.normal.array;pt&&Pt.getNormalMatrix(pt);for(let wt=0;wt<Qt;wt++)ot.set(At[wt*3],At[wt*3+1],At[wt*3+2]),pt&&ot.applyMatrix4(pt),st[(N+wt)*3]=ot.x,st[(N+wt)*3+1]=ot.y,st[(N+wt)*3+2]=ot.z,ot.set(gt[wt*3],gt[wt*3+1],gt[wt*3+2]),pt&&ot.applyMatrix3(Pt).normalize(),Bt[(N+wt)*3]=ot.x,Bt[(N+wt)*3+1]=ot.y,Bt[(N+wt)*3+2]=ot.z;qt.set(Ot.attributes.aCol.array,N*3),dt.set(Ot.attributes.aux.array,N*2);const fe=Ot.index.array;for(let wt=0;wt<fe.length;wt++)R[V+wt]=fe[wt]+N;N+=Qt,V+=fe.length,Ot.dispose()}const xt=new k.BufferGeometry;return xt.setAttribute("position",new k.BufferAttribute(st,3)),xt.setAttribute("normal",new k.BufferAttribute(Bt,3)),xt.setAttribute("aCol",new k.BufferAttribute(qt,3)),xt.setAttribute("aux",new k.BufferAttribute(dt,2)),xt.setIndex(new k.BufferAttribute(R,1)),xt}function j0(F){const z=F.length/8,H=new Float32Array(z*3),st=new Float32Array(z*3),Bt=new Float32Array(z*2),qt=new Uint16Array(z);for(let R=0;R<z;R++)H[R*3]=F[R*8],H[R*3+1]=F[R*8+1],H[R*3+2]=F[R*8+2],st[R*3]=F[R*8+3],st[R*3+1]=F[R*8+4],st[R*3+2]=F[R*8+5],Bt[R*2]=F[R*8+6],Bt[R*2+1]=F[R*8+7],qt[R]=R;const dt=new k.BufferGeometry;return dt.setAttribute("position",new k.BufferAttribute(H,3)),dt.setAttribute("aCol",new k.BufferAttribute(st,3)),dt.setAttribute("aux",new k.BufferAttribute(Bt,2)),dt.setIndex(new k.BufferAttribute(qt,1)),dt.computeVertexNormals(),dt}function ze(F,z,H,st){return ut(F,z,!0,(Bt,qt,dt,R,N)=>{const V=H(qt),ot=Bt*Z;dt.p[0]=Math.cos(ot)*V[0],dt.p[1]=V[1],dt.p[2]=Math.sin(ot)*V[0],dt.c[0]=dt.c[1]=dt.c[2]=1,dt.a[0]=1,dt.a[1]=1,st&&st(Bt,qt,dt,V)})}function Te(F,z,H,st,Bt,qt){const dt=new k.CatmullRomCurve3(F,!1,"centripetal"),R=dt.getLength(),N=new k.Vector3,V=new k.Vector3,ot=new k.Vector3,Pt=new k.Vector3,xt=[];for(let Vt=0;Vt<=z;Vt++)dt.getPointAt(Vt/z,N),dt.getTangentAt(Vt/z,V),ot.set(0,1,0).addScaledVector(V,-V.y).normalize(),ot.lengthSq()<.01&&ot.set(1,0,0),Pt.crossVectors(V,ot).normalize(),xt.push([N.clone(),ot.clone(),Pt.clone()]);return ut(H,z,!0,(Vt,Ot,pt,Qt,At)=>{const gt=xt[At],fe=Vt*Z,wt=Math.cos(fe),vt=Math.sin(fe);let de=st(Ot);qt&&(de*=1+qt(wt,vt,Ot*R)),pt.p[0]=gt[0].x+(gt[1].x*wt+gt[2].x*vt)*de,pt.p[1]=gt[0].y+(gt[1].y*wt+gt[2].y*vt)*de,pt.p[2]=gt[0].z+(gt[1].z*wt+gt[2].z*vt)*de,pt.c[0]=Bt.r,pt.c[1]=Bt.g,pt.c[2]=Bt.b,pt.a[0]=Vt,pt.a[1]=Ot*R})}function It(F,z,H,st=10,Bt=6,qt=1,dt=1){return ut(st,Bt,!0,(R,N,V)=>{const ot=R*Z,Pt=N*Math.PI,xt=Math.sin(Pt);V.p[0]=F[0]+Math.cos(ot)*xt*z[0],V.p[1]=F[1]+Math.cos(Pt)*z[1],V.p[2]=F[2]+Math.sin(ot)*xt*z[2],V.c[0]=H.r,V.c[1]=H.g,V.c[2]=H.b,V.a[0]=qt*(.6+.4*(.5+.5*Math.cos(Pt))),V.a[1]=dt})}function we(F,z,H,st,Bt=!0){const qt=F.length-1;return ut(3,qt,!0,(dt,R,N,V,ot)=>{const Pt=F[ot],xt=dt*Z,Vt=z*(1-.6*R);N.p[0]=Pt[0]+Math.cos(xt)*Vt,N.p[1]=Pt[1]+Math.sin(xt)*Vt*.9,N.p[2]=Pt[2]+Math.sin(xt+1.6)*Vt,N.c[0]=H.r,N.c[1]=H.g,N.c[2]=H.b,N.a[0]=Bt?R:.85,N.a[1]=Bt?-(1+st):st})}function Me(F,z,H,st=8,Bt=3,qt=1,dt=1,R=null){const N=new k.CatmullRomCurve3(F.map(Qt=>new k.Vector3(Qt[0],Qt[1],Qt[2])),!1,"centripetal"),V=(F.length-1)*Bt,ot=new k.Vector3,Pt=new k.Vector3,xt=new k.Vector3,Vt=new k.Vector3,Ot=[];let pt=null;for(let Qt=0;Qt<=V;Qt++){const At=Qt/V;N.getPoint(At,ot),N.getTangent(At,Pt),pt?xt.copy(pt).addScaledVector(Pt,-pt.dot(Pt)):(xt.set(0,1,0).addScaledVector(Pt,-Pt.y),xt.lengthSq()<.01&&xt.set(1,0,0).addScaledVector(Pt,-Pt.x)),xt.normalize(),Vt.crossVectors(Pt,xt).normalize(),pt=xt.clone();const gt=At*(F.length-1),fe=Math.min(F.length-2,Math.floor(gt)),wt=gt-fe;Ot.push([ot.clone(),xt.clone(),Vt.clone(),L(z[fe],z[fe+1],wt*wt*(3-2*wt))])}return ut(st,V,!0,(Qt,At,gt,fe,wt)=>{const vt=Ot[wt],de=Qt*Z,E=Math.cos(de),Ct=Math.sin(de),te=vt[3];gt.p[0]=vt[0].x+(vt[1].x*E+vt[2].x*Ct)*te,gt.p[1]=vt[0].y+(vt[1].y*E+vt[2].y*Ct)*te,gt.p[2]=vt[0].z+(vt[1].z*E+vt[2].z*Ct)*te,gt.c[0]=H.r,gt.c[1]=H.g,gt.c[2]=H.b,gt.a[0]=qt,gt.a[1]=dt,R&&R(Qt,At,gt,At)})}const ho={afternoon:{fog:"#C6D2BE",fogK:.6,dens:.0033,exposure:1.36,canA:"#A0521F",canB:"#C7AE3C",canC:"#44702A",gap:"#DCE6D6",gapI:.9,glowI:.32,tint:"#fbf8ee",shadow:"#0a1409",sat:1.06,bloom:.42,portal:"#ffd98a",heroFog:.6,wall:.7},dawn:{fog:"#EBD9D6",fogK:.86,dens:.0056,exposure:1.2,canA:"#9A5638",canB:"#CFAE74",canC:"#5E7A4A",gap:"#F3E4E0",gapI:.95,glowI:.6,tint:"#fff0ee",shadow:"#150e14",sat:1.04,bloom:.5,portal:"#ffc2b0",heroFog:.5,wall:.78},day:{fog:"#D3DAD6",fogK:.9,dens:.0036,exposure:1.12,canA:"#96501F",canB:"#C6B548",canC:"#4A7A30",gap:"#E6ECEA",gapI:.98,glowI:.3,tint:"#f6faff",shadow:"#0c1210",sat:1.12,bloom:.36,portal:"#e8f4ff",heroFog:.62,wall:.74},night:{fog:"#3D4F86",fogK:.5,dens:.0036,exposure:2.5,canA:"#243260",canB:"#344C88",canC:"#1E2E58",gap:"#9FB4EE",gapI:.62,glowI:.5,tint:"#eef0ff",shadow:"#080b1a",sat:.8,bloom:.55,portal:"#a9c4ff",heroFog:.62,wall:.6}},fo={october:["#B5622B","#8E4A22","#C98A45","#73401F"],early:["#C9B13A","#8FA038","#B5622B","#D9C25A"],late:["#7E4A27","#8E5531","#A06436","#6E4426"]};var bo={id:"spore-rain",name:"Spore Rain",category:"wilderness",weirdness:.1,media:["tiny"],async build(F){const{rng:z,noise:H}=F,st=F.quality?.detail??1,Bt=F.vary||{},qt=Bt.density??1,dt=z.fork("spore-look-2"),R=i0("spore-rain-extras:"+F.seed),N=i0("spore-rain-third:"+F.seed),V=i0("spore-rain-fourth:"+F.seed);let ot=Bt.hour==="golden"?"afternoon":Bt.hour==="dawn"||Bt.hour==="day"||Bt.hour==="night"?Bt.hour:null;{const t=dt();ot||(ot=t<.45?"afternoon":t<.63?"dawn":t<.8?"day":"night")}let Pt;{const t=dt();Pt=t<.5?"drip":t<.78?"shower":"frost"}let xt;{const t=dt();xt=t<.5?"october":t<.76?"early":"late"}const Vt=ot==="night"?"slug":dt.pick(["yellow","yellow","pink","brown"]),Ot=dt.chance(.3),pt=dt.chance(.35),Qt=!!Bt.rare,At=ho[ot],gt=ot==="night",fe=Pt==="frost",wt=Pt==="shower",vt=xt==="late",de={};["copper","umber","moss","pearl","cream","gold","scarlet"].forEach((t,n)=>{de[t]=new k.Color(As[n])});const E=(t,n=1)=>new k.Color(t).multiplyScalar(n),Ct=new k.Scene,te=await Qs(F,{palette:As,hour:ot,weather:Pt,season:xt});Ct.add(te.object);const Q0=(()=>{const t=te.object.getObjectByName("shaft");return t?(t.material.uniforms.uStrength.value*=1.9*(ot==="day"?5.5:1),t.material.uniforms.uStrength):null})(),Xa=Q0?Q0.value:0;te.shaft.point.z=5;const Wt=te.uniforms;Wt.uFogK&&(Wt.uFogK.value=At.heroFog),Wt.uGlitR&&ot==="day"&&(Wt.uGlitR.value=11),await F.yield();const Oe=te.anchors.flyThrough,_t=Oe[7].clone().sub(Oe[6]).setY(0).normalize(),ke=ae+be,K0=z.range(-1.5,1.5),g0=Oe[7].clone().addScaledVector(_t,49.4).setY(-6),Le=g0.clone().addScaledVector(_t,60),Ma=[[0,ke,420],[0,ke,380],[0,ke,330],[-2+K0,ke,296],[-6+K0,ke,264],[-6+K0,ke,238],[-2+K0*.5,ke,204],[-3-K0,ke,162],[-7,ke,122],[-8,ke,98],[-8,ke,84],[-7.5,ke+6,64]];for(const t of Oe)Ma.push(t.clone());Ma.push(Oe[7].clone().lerp(g0,.5),g0.clone(),g0.clone().lerp(Le,.5),Le.clone());const O=js(Ma),U=O.length;await F.yield();const E0=2.3,ne=new Float32Array((Math.ceil(U/.25)+1)*3),$0=ne.length/3;for(let t=0,n=new k.Vector3;t<$0;t++)O.posAtDist(Math.min(t*.25,U),n),ne[t*3]=n.x,ne[t*3+1]=n.y,ne[t*3+2]=n.z;let b0=1e9,J0=-1;const xa=(t,n)=>{const m=(n+2.01)*(n+2.01);b0=1e9,J0=-1;for(let f=0;;f+=16){const p=Math.min(f,$0-1);if(t(p*3)<m)for(let d=Math.max(p-8,0),u=Math.min(p+8,$0-1);d<=u;d++){const a=t(d*3);a<b0&&(b0=a,J0=d*3)}if(p===$0-1)break}};{const t=te.object.getObjectByName("water"),n=t&&t.geometry.getAttribute("iB");if(n){const m=n.array,f=t.instanceMatrix.array;for(let p=0;p<t.count;p++){if(m[p*4+1]!==1)continue;const d=p*16,u=f[d+12],a=f[d+13],h=f[d+14],e=a-m[p*4+2],o=E0+1.25*Math.hypot(f[d],f[d+1],f[d+2]);xa(s=>{const l=ne[s]-u,i=ne[s+2]-h,c=ne[s+1],g=c>a?c-a:c<e?e-c:0;return l*l+g*g+i*i},o),b0<o*o&&(m[p*4+1]=0)}n.needsUpdate=!0}}await F.yield();const Ae=t=>{let n=0,m=1e9;for(let f=0;f<=200;f++){const p=O.pointAt(f/200*.66),d=Math.abs(p.z-t);d<m&&(m=d,n=f/200*.66)}return n},Ce=Ae(84),w0=Ae(44),Fs=O.nearestXZ(Oe[3].x,Oe[3].z).u,Ne=O.nearestXZ(Oe[7].x,Oe[7].z).u,Rs=O.nearestXZ(g0.x,g0.z).u,D=new k.Vector3,J=new k.Vector3,nt=(t,n)=>{O.posAtDist(t,D),O.tangentAtDist(t,J);const m=Math.hypot(J.x,J.z)||1;return[D.x-J.z/m*n,D.z+J.x/m*n]},l0=[],T0=(t,n)=>{const m=Math.abs(t-8)-38,f=Math.abs(n-4)-25,p=Math.hypot(Math.max(m,0),Math.max(f,0))+Math.min(Math.max(m,f),0),d=L(20,40,K(0,30,n-4)),u=Ue((p-15)/d);return 1-(.6*u+.4*u*u*(3-2*u))},Ls=(t,n)=>{const m=T0(t,n);let f=ae+(1.5*H.fbm2(t*.017,n*.017,3)+.45*H.n2(t*.075+9,n*.075))*(1-.75*m);const p=4*m*(1-m);f+=12*m+p*(1.5*(1-Math.abs(H.n2(t*.05+3,n*.012)))-.7+.5*H.n2(t*.11,n*.11));const d=Math.hypot(t,n);return L(f,-.3,1-K(13,26,d))},xe=(t,n)=>{const m=Ls(t,n),f=O.nearestXZ(t,n),p=L(m,f.y-be,1-K(4,13,f.dist)),d=Math.min(m,f.y-be-3.5+Math.max(0,f.dist-5)*.6);return L(p,d,K(Ne-.022,Ne+.004,f.u))},Ya=Wt.uSunDir.value,Ps=new k.Vector3(Ya.x,0,Ya.z).normalize().multiplyScalar(.8).setY(.6).normalize(),Vs=Wt.uSkyCol.value.clone().multiplyScalar(.8).add(Wt.uSunCol.value.clone().multiplyScalar(gt?.24:.05)),ta=E(At.fog,At.fogK);Ct.fog=new k.FogExp2(ta,At.dens),Ct.background=ta.clone();const re=fo[xt].map(t=>E(t)),Ft=396,Tt=334,va=t=>Ue((Ft-t)/(Ft-Tt)),ya=t=>9+3*va(t),ea=t=>3.6+2.6*va(t),M0=t=>ae+13.5+4*va(t),aa=t=>M0(t)+1.2,Ks=(t,n)=>{const m=Math.abs(t),f=ea(n),p=ya(n);return m<=f?M0(n):L(M0(n),ae,Ue((m-f)/(p-f)))},ja={uKeyDir:{value:Ps},uKeyCol:{value:Vs},uArc:{value:new k.Vector4(Tt,Ft,ae,15)},uNight:{value:gt?1:0},uTone0:{value:re[0]},uTone1:{value:re[1]},uTone2:{value:re[2]},uTone3:{value:re[3]}},x0=()=>k.UniformsUtils.clone(k.UniformsLib.fog),rt=(t,n,m={})=>new k.ShaderMaterial({defines:t===10?{FK:9,VK:n,BOUGH:1}:{FK:t,VK:n},uniforms:{...x0(),...Wt,...ja,uMisc:{value:new k.Vector4(...m.misc||[0,0,1,0])},uMat:{value:new k.Vector4(m.gloss??.4,m.sss??0,m.fibre??4,m.variant??0)}},vertexShader:Js,fragmentShader:ao,fog:!0,side:k.DoubleSide}),se=(t,n,m,f=!1)=>{const p=new k.Mesh(t,n);return p.name=m,p.frustumCulled=f,p.matrixAutoUpdate=!1,Ct.add(p),p},G=new k.Matrix4,yt=new k.Quaternion,mt=new k.Vector3,I=new k.Vector3,St=new k.Euler,sa=new k.Quaternion,ht=new k.Vector3(0,1,0);for(let t=0;t<24;t++)R();const oa=new k.ShaderMaterial({uniforms:{...Wt,...ja,uFogCol:{value:ta},uCanA:{value:E(At.canA)},uCanB:{value:E(At.canB)},uCanC:{value:E(At.canC)},uGap:{value:E(At.gap,At.gapI)},uGlow:{value:Wt.uSunCol.value.clone().multiplyScalar(At.glowI*.4)},uGapK:{value:ot==="day"?.08:0},uFloorY:{value:ae},uFogDens:{value:At.dens},uVault:{value:0},uAxis:{value:new k.Vector4(0,-1,0,1)},uHero:{value:new k.Vector4(0,.2,-1,0)},uAmber:{value:E({afternoon:"#E9A548",dawn:"#EFA98A",day:"#E3BC6E",night:"#5870C0"}[ot]||"#E9A548",1.2)}},vertexShader:lo,fragmentShader:co,side:k.BackSide,depthWrite:!1,depthTest:!1,fog:!1}),na=new k.Mesh(new k.SphereGeometry(1500,40,20),oa);na.renderOrder=-3,na.frustumCulled=!1,Ct.add(na),await F.yield();const ie=U*Ae(258),c0=.34*U+13,ve=.375*U+12.5,De=.375*U+72,Qa=nt(ie,15.5),$a=nt(c0,-10.5),ee=Qt?nt(De,54):null;l0.push([Qa[0],Qa[1],13,2.3],[$a[0],$a[1],7.5,4.2]);for(let t=0,n=0;t<6&&n<200;n++){const m=z.range(40,U*Ce),f=(z.chance(.5)?1:-1)*z.range(16,70),p=z.range(5,12.5),[d,u]=nt(m,f);u>Tt-12&&u<Ft+16&&Math.abs(d)<26||l0.some(a=>Math.hypot(a[0]-d,a[1]-u)<a[2]+p+4)||ee&&(Math.hypot(d-ee[0],u-ee[1])<p+22||f>0&&m>De-75&&m<De+15)||(l0.push([d,u,p,p*z.range(.32,.5)]),t++)}const h0=(t,n)=>[Le.x+_t.x*t-_t.z*n,Le.z+_t.z*t+_t.x*n],N0=[[...h0(-52,-36),8.5,3.4],[...h0(-20,40),10.5,4.2],[...h0(8,-34),6.2,2.8],[...h0(46,30),9,3.6]],f0=N0[2],v0=(t,n)=>{let m=0;for(const f of N0){const p=Math.hypot(t-f[0],n-f[1])/f[2];p<1.5&&(m=Math.max(m,1-K(.7,1.5,p)))}return m},Es=(t,n)=>{let m=0;for(const f of N0){const p=Math.hypot(t-f[0],n-f[1])/f[2];p<1&&(m=Math.max(m,f[3]*Math.pow(1-p*p,.6)))}return m},oe=(t,n)=>{let m=0;for(const f of l0){const p=Math.hypot(t-f[0],n-f[1])/f[2];p<1.5&&(m=Math.max(m,1-K(.7,1.5,p)))}return m},za=(t,n)=>{let m=0;for(const f of l0){const p=Math.hypot(t-f[0],n-f[1])/f[2];p<1&&(m=Math.max(m,f[3]*Math.pow(1-p*p,.6)))}return m},ft=(t,n)=>xe(t,n)+za(t,n),D0=(t,n)=>xe(t,n)+Math.max(za(t,n),Es(t,n));let ka=null;{const p=ka=await $s(F,112,158,!1,(d,u,a)=>{const h=L(-230,270,d),e=L(-200,520,u);a.p[0]=h,a.p[1]=xe(h,e),a.p[2]=e;const o=T0(h,e),s=K(Tt,Tt-12,e)*K(270,292,e)*.45;a.c[0]=a.c[1]=a.c[2]=1,a.a[0]=Math.min(1,3.4*o*(1-o)*.8+.5*o+oe(h,e)+v0(h,e)+s),a.a[1]=0});se(p,rt(0,0),"floor").renderOrder=-2}await F.yield();const y0=(t,n,m)=>{const f=Math.atan2(m-t[1],n-t[0]),p=Math.hypot(n-t[0],m-t[1]),d=Math.min(1,p/(t[2]*(1+.07*H.n2(Math.cos(f)*1.5+t[0],Math.sin(f)*1.5)))),u=1-Math.abs(H.n2(n*.3+7,m*.3)),a=.35*H.n2(n*.5,m*.5)+.16*H.n2(n*1.7,m*1.7)+.3*(u*u-.4);return t[4]+(t[3]+.4)*Math.pow(Math.max(1-d*d,0),.6)*(1+.2*a)+a*.5*(1-d)-.6*d*d*d};{const t=[],n=E("#C4D2B8"),m=E("#7E9A70");[...l0,...N0].forEach((f,p)=>{f[4]=xe(f[0],f[1])-.4;const d=p<2;t.push(ut(d?52:28,d?18:9,!0,(u,a,h)=>{const e=u*Z,o=Math.pow(a,.8),s=f[2]*o*(1+.07*H.n2(Math.cos(e)*1.5+f[0],Math.sin(e)*1.5)),l=f[0]+Math.cos(e)*s,i=f[1]+Math.sin(e)*s,c=1-Math.abs(H.n2(l*.3+7,i*.3)),g=.35*H.n2(l*.5,i*.5)+.16*H.n2(l*1.7,i*1.7)+.3*(c*c-.4);h.p[0]=l,h.p[2]=i,h.p[1]=y0(f,l,i);const r=.55+.45*(1-o)+.25*g;h.c[0]=L(m.r,n.r,r),h.c[1]=L(m.g,n.g,r),h.c[2]=L(m.b,n.b,r),h.a[0]=(.5+.5*(1-o*o))*(.8+.2*c),h.a[1]=.3}))}),se(kt(t),rt(6,0,{gloss:.22}),"cushions")}await F.yield();const d0=(t,n,m=!1)=>{const f=ut(t,n,!1,(p,d,u)=>{const a=p,h=(d-.5)*2,e=Math.sign(h)*Math.pow(Math.abs(h),.75),o=Math.abs(e),s=.33*Math.pow(Math.max(Math.sin(Math.PI*Math.pow(a,.8)),0),.75),l=a-.5,i=e*s,c=K(.62,1,o);u.p[0]=l,u.p[2]=i*(1-.14*c*c),u.p[1]=.55*i*i+.075*s*c*c+.16*l*l-.02*Math.sin(a*9)*o+.012*Math.sin(a*15+1)*e+.01*Math.sin(a*28.3+e*2)*o+.05*K(.8,1,a)*K(.8,1,a),u.c[0]=u.c[1]=u.c[2]=1,u.a[0]=a,u.a[1]=i});return m?kt([f,ut(3,3,!0,(p,d,u)=>{const a=p*Z,h=.0065*(1+.6*d*d);u.p[0]=-.5-.105*d,u.p[1]=.04+.03*d*d+Math.cos(a)*h,u.p[2]=Math.sin(a)*h+.012*d*d,u.c[0]=u.c[1]=u.c[2]=1,u.a[0]=-.02,u.a[1]=0})]):f},Ja=ut(8,4,!1,(t,n,m)=>{const f=(n-.5)*2,p=.33*Math.pow(Math.max(Math.sin(Math.PI*Math.pow(L(.05,.95,t),.8)),0),.75);m.p[0]=(t-.5)*1.12,m.p[1]=-.014,m.p[2]=f*(p+.09),m.c[0]=m.c[1]=m.c[2]=0,m.a[0]=(Math.abs(f)>.9?0:1)*K(0,.2,t)*K(1,.8,t),m.a[1]=0}),ts=z(),G0=t=>t.copy(z.pick(re)).multiplyScalar(z.range(.72,1.18)),Y=new k.Color;{const f=d0(18,8);{const h=f.attributes.position.array,e=f.attributes.aux.array;for(let o=0;o<h.length/3;o++){const s=e[o*2],l=e[o*2+1],i=.33*Math.pow(Math.max(Math.sin(Math.PI*Math.pow(s,.8)),0),.75),c=i>1e-4?Math.min(1,Math.abs(l)/i):0,g=K(.55,1,c),r=.6+.4*Math.sin(s*17+(l>0?0:2.1));h[o*3+1]-=.34*i*g*g*r+.012*Math.sin(s*50.3)*(1-g),h[o*3+2]*=1-.22*g*g*r}f.computeVertexNormals()}const p=new k.InstancedMesh(f,rt(2,1,{gloss:.85,sss:vt?1.25:.85,fibre:46,variant:1,misc:[.06,0,1,0]}),75),d=new k.Vector3,u=new k.Vector3,a=new k.Vector3;for(let h=0;h<52;h++){const e=h%2?1:-1,o=Math.floor(h/2),s=o%2,l=L(Ft,Tt,(Math.floor(o/2)+.5*s+z.range(-.12,.12))/12.5),i=ya(l)+s*1.3+z.range(-.4,.6),c=ea(l)+s*.5+z.range(-.2,.5),g=xe(e*i,l)-.3,r=M0(l)+z.range(-.3,.9)+s*.5;d.set(-e*(i-c),r-g,z.range(-1.6,1.6));const w=d.length()*z.range(1.04,1.12);d.normalize(),a.set(0,0,1).addScaledVector(d,-d.z).normalize(),u.crossVectors(a,d).normalize(),u.x*e<0&&(u.negate(),a.negate()),G.makeBasis(d,u,a),G.scale(mt.set(w,w*.7,w*z.range(.95,1.2))),G.setPosition(e*(i+c)*.5,(g+r)*.5,l),p.setMatrixAt(h,G),G0(Y),vt&&Y.lerp(de.copper,.4),p.setColorAt(h,Y)}for(let h=0;h<8;h++){const e=h%2?1:-1,o=Math.floor(h/2),s=e*(ya(Ft)+2+2.2*o+z.range(-.4,.4)),l=Ft+1.6+2.1*o+z.range(-.4,.4),i=xe(s,l)-.4,c=e*(ea(Ft)+.7+1.3*o),g=M0(Ft)-.4+.7*o+z.range(-.3,.5),r=Ft-1+.9*o;d.set(c-s,g-i,r-l);const w=d.length()*z.range(1.05,1.12);d.normalize(),u.set(-e*.55,.25,.8),u.addScaledVector(d,-u.dot(d)).normalize(),a.crossVectors(d,u).normalize(),G.makeBasis(d,u,a),G.scale(mt.set(w,w*.75,w*z.range(1,1.2))),G.setPosition((s+c)*.5,(i+g)*.5,(l+r)*.5),p.setMatrixAt(52+h,G),G0(Y),vt&&Y.lerp(de.copper,.4),p.setColorAt(52+h,Y)}for(let h=0;h<15;h++){const e=L(Ft+.5,Tt-.5,(h+.5+z.range(-.2,.2))/15),o=h%2?1:-1;d.set(o*(2*ea(e)+4.2),z.range(-1.3,1.3),z.range(-3,3));const s=d.length();d.normalize(),u.set(0,1,0).addScaledVector(d,-d.y).normalize(),a.crossVectors(d,u).normalize(),G.makeBasis(d,u,a),G.scale(mt.set(s,s*.45,s*z.range(.95,1.2))),G.setPosition(z.range(-.7,.7),M0(e)+1+z.range(0,.6)+h%3*.25,e),p.setMatrixAt(60+h,G),G0(Y),vt&&Y.lerp(de.copper,.4),p.setColorAt(60+h,Y)}p.name="arcade",p.computeBoundingSphere(),Ct.add(p)}await F.yield();const Be=[],e0=(t,n,m,f,p=!0)=>{const d=new k.InstancedMesh(t,n,m.length);return m.forEach((u,a)=>{d.setMatrixAt(a,u.m),p&&d.setColorAt(a,u.c)}),d.name=f,d.computeBoundingSphere(),Ct.add(d),d},Ze=(t,n,m,f,p,d,u,a,h=null,e=null)=>{for(const o of t){if(!o.length)continue;const s=e0(u,a,o,n+"-lo"),l=p?e0(p,d,o,n):null,i=l&&h?e0(h,e,o,n+"-shade",!1):null;i&&(i.renderOrder=-1),Be.push({lo:s,hi:l,extra:i,c:s.boundingSphere.center.clone(),r:s.boundingSphere.radius,range:m,sw:f})}},He=(t,n,m,f=null,p=0)=>{const d=[];for(let u=0;u<n;u++)d.push([]);for(let u=0;u<t.count;u++)t.getMatrixAt(u,G),d[Math.min(n-1,Math.floor(O.nearestXZ(G.elements[12],G.elements[14]).u*n))].push(u);for(const u of d){if(!u.length)continue;const a=f?t.geometry.clone():t.geometry,h=new k.InstancedMesh(a,t.material,u.length);if(u.forEach((e,o)=>{t.getMatrixAt(e,G),h.setMatrixAt(o,G),t.instanceColor&&(t.getColorAt(e,Y),h.setColorAt(o,Y))}),f){const e=new Float32Array(u.length*4);u.forEach((o,s)=>{for(let l=0;l<4;l++)e[s*4+l]=f[o*4+l]}),a.setAttribute("iB",new k.InstancedBufferAttribute(e,4))}h.name=t.name,h.computeBoundingSphere(),h.boundingSphere.radius+=p,Ct.add(h),Be.push({lo:h,hi:null,extra:null,c:h.boundingSphere.center.clone(),r:h.boundingSphere.radius,range:m,sw:0})}f&&t.geometry.dispose(),t.dispose()},ra=U*Ne,Ge=(t,n,m)=>{const f=t-Le.x,p=n-Le.z,d=f*_t.x+p*_t.z,u=Math.abs(-f*_t.z+p*_t.x);return d>-10-m&&u<11+m},Ts=[[-.5,.35,0],[.5,.35,0],[-.25,.1,0],[.25,.1,0],[0,0,0],[0,1,.3],[0,1,-.3],[-.25,1,.27],[.25,1,.3],[-.25,1,-.27],[.25,1,-.3]],Aa=(t,n,m=6)=>{for(const f of Ts){D.set(f[0],f[1]*n,f[2]).applyMatrix4(t);const p=O.nearestXZ(D.x,D.z);if(p.dist<m&&D.y>p.y-be+.95&&O.distanceTo(D.x,D.y,D.z)<m)return!0}return!1};let ia=0;const la=nt(ie,12.5),z0=nt(c0-3.5,-5),es=(t,n,m,f)=>{const p=f<0?-1:1,d=Math.abs(f);return!(n<Ft+14&&n>Tt-8&&Math.abs(t)<22||n>Ft&&Math.abs(t)<10+(n-Ft)*.2||Math.hypot(t-la[0],n-la[1])<17||p>0&&Math.abs(m-ie)<30&&d<34||Math.hypot(t-z0[0],n-z0[1])<15||p<0&&m>c0-30&&m<c0+4&&d<16||Math.abs(m-ve)<9&&d<30||ee&&(Math.hypot(t-ee[0],n-ee[1])<21||p>0&&m>De-85&&m<De+30&&d<70)||n>36&&n<112&&d<17)},Ca=(t,n,m,f)=>!(!es(t,n,m,f)||n<Tt&&n>60&&Math.abs(t)<3+(460-n)*.047);{const n=Math.round(640*L(.75,1,st)),m=[],f=[],p=[],d=new k.Quaternion;for(let e=0;e<10;e++)m.push([]),f.push([]);for(let e=0,o=0;e<n&&o<n*8;o++){(o&15)===0&&await F.yield();const s=z.range(-5,U-4),l=s>ra+6,i=z(),c=(z.chance(.5)?1:-1)*((l?6.5:1.5)+60*Math.pow(i,1.9)),[g,r]=nt(s,c);if(Math.hypot(g,r)<19||oe(g,r)>.4||Ge(g,r,1))continue;const w=O.nearestXZ(g,r).dist,b=z.range(8.5,13);if(l&&w<6||Math.abs(s-ra)<14&&w<8)continue;const M=Math.hypot(g-O.start.x,r-O.start.z)<17,x=r<Ft+9&&r>Tt-6&&Math.abs(g)<7.5,A=w>15&&!M&&z.chance(.1),v=ft(g,r),y=Math.max(-.25,Math.min(.25,(ft(g+2,r)-ft(g-2,r))/4)),C=Math.max(-.25,Math.min(.25,(ft(g,r+2)-ft(g,r-2))/4));St.set(z.range(-.08,.08),z.range(0,Z),A?z.range(.45,1):z.range(-.07,.07),"YXZ"),yt.setFromEuler(St),yt.premultiply(d.setFromUnitVectors(ht,I.set(-y,1,-C).normalize()));const S=w<4.5||M||x?.35:w<9?.7:1;if(G.compose(I.set(g,v+(A?b*.22:.16+.22*S),r),yt,mt.set(b,b*S*z.range(.6,1.3),b)),Aa(G,S<.5?.1:.2)){ia++;continue}const B=Math.min(9,Math.max(0,Math.floor((s+5)/(U+1)*10)));(w<22?m:f)[B].push({m:G.clone(),c:G0(Y).clone()}),e++}{const e=E("#D2A63E"),o=new k.Vector3,s=new k.Vector3,l=new k.Vector3,i=()=>{Y.copy(re[Math.floor(R()*re.length)%re.length]).multiplyScalar(R.range(.7,1.22));const b=R();return b<.15&&!vt&&!gt?Y.lerp(e,.75):b>.87&&Y.multiplyScalar(.5),Y},c=Math.round(150*L(.7,1,st)),g=Math.max(U*Ae(206),ve+14)-6,r=U*Ae(104)+8;for(let b=0,M=0;b<c&&M<c*14;M++){(M&15)===0&&await F.yield();const x=R.range(14,U-34),A=x>ra-6,v=(R.chance(.5)?1:-1)*R.range(A?9.5:7.4,A?26:23),y=R.range(6.5,10.5),C=R.range(.5,1.12),S=R.range(-1,1),B=R.range(.75,1.2),P=R.chance(.7);i();const[T,_]=nt(x,v);if(Math.hypot(T,_)<24||oe(T,_)>.2||Ge(T,_,3)||!Ca(T,_,x,v)||x>g&&x<r&&Math.abs(v)<14.5)continue;O.tangentAtDist(x,J);const X=Math.hypot(J.x,J.z)||1,Q=v<0?-1:1,tt=-J.z/X*Q,ct=J.x/X*Q,at=Math.cos(S),Mt=Math.sin(S),j=P?1:-1;if(o.set((tt*at-ct*Mt)*j,0,(ct*at+tt*Mt)*j).multiplyScalar(Math.cos(C)).setY(Math.sin(C)).normalize(),l.crossVectors(o,ht).normalize(),s.crossVectors(l,o).normalize(),G.makeBasis(o,s,l).scale(mt.set(y,y*B,y)),I.set(T,ft(T,_)-.25,_).addScaledVector(o,y*.5),G.setPosition(I),Aa(G,.25,6.4)){ia++;continue}const W=Math.min(9,Math.max(0,Math.floor((x+5)/(U+1)*10)));m[W].push({m:G.clone(),c:Y.clone()}),b++}const w=Math.round(300*L(.6,1,st));for(let b=0;b<10;b++)p.push([]);for(let b=0,M=0;b<w&&M<w*8;M++){(M&15)===0&&await F.yield();const x=R.range(-4,U*Ne-8),A=(R.chance(.5)?1:-1)*(.4+15*Math.pow(R(),1.5)),v=R.range(4.2,7.4),y=R.range(.9,1.7),C=R.chance(.3);St.set(R.range(-.22,.22)+(C?Math.PI:0),R.range(0,Z),R.range(-.22,.22),"YXZ"),i();const[S,B]=nt(x,A);if(Math.abs(A)<2.4||Math.hypot(S,B)<19||oe(S,B)>.5||Ge(S,B,1))continue;if(G.compose(I.set(S,ft(S,B)+(C?.55:.4)+.05*v*(y-.9),B),yt.setFromEuler(St),mt.set(v,v*y,v)),Aa(G,.3)){ia++;continue}const P=Math.min(9,Math.max(0,Math.floor((x+5)/(U+1)*10)));p[P].push({m:G.clone(),c:Y.clone()}),b++}}{const e=new k.Vector3,o=new k.Vector3,s=new k.Vector3,l=Math.round(96*L(.7,1,st));for(let i=0,c=0;i<l&&c<l*6;c++){(c&15)===0&&await F.yield();const g=V.range(-78,88),r=(V.chance(.5)?1:-1)*(13+62*Math.pow(V(),1.4)),w=V.range(8,12.5),b=V.range(0,Z),M=V()<.2,x=V.range(.45,1),A=V.range(.7,1.25),v=V.range(.72,1.18),y=Math.floor(V()*re.length)%re.length,C=V.range(-.08,.08),S=V.range(-.07,.07),[B,P]=h0(g,r);if(Ge(B,P,2.5)||v0(B,P)>.3||B<-225||B>265||P<-195||O.nearestXZ(B,P).dist<9)continue;Y.copy(re[y]).multiplyScalar(v);const T=D0(B,P);M?(e.set(Math.cos(b)*Math.cos(x),Math.sin(x),Math.sin(b)*Math.cos(x)).normalize(),s.crossVectors(e,ht).normalize(),o.crossVectors(s,e).normalize(),G.makeBasis(e,o,s).scale(mt.set(w*.8,w*.8*A,w*.8)),I.set(B,T-.25,P).addScaledVector(e,w*.4),G.setPosition(I)):(St.set(C,b,S,"YXZ"),G.compose(I.set(B,T+.38,P),yt.setFromEuler(St),mt.set(w,w*A,w))),(O.nearestXZ(B,P).dist<30?m:f)[9].push({m:G.clone(),c:Y.clone()}),i++}}for(const e of[m,f,p])for(let o=0;o<e.length;o++)e[o]=e[o].filter(s=>v0(s.m.elements[12],s.m.elements[14])<.35);const u=rt(2,5,{gloss:.62,sss:.5,fibre:11,misc:[0,0,ts,0]}),a=new k.ShaderMaterial({uniforms:{...x0(),uMisc:{value:new k.Vector4(.3,0,ts,0)}},vertexShader:to,fragmentShader:eo,fog:!0,transparent:!1,depthWrite:!1,blending:k.CustomBlending,blendEquation:k.AddEquation,blendSrc:k.ZeroFactor,blendDst:k.OneMinusSrcAlphaFactor,blendSrcAlpha:k.ZeroFactor,blendDstAlpha:k.OneFactor,side:k.DoubleSide});await F.yield();const h=d0(7,3);Ze(m,"litter",330,55,d0(14,6,!0),u,h,u,Ja,a),await F.yield(),Ze(p,"litter-small",200,40,d0(10,6,!0),u,d0(6,2),u,Ja,a),await F.yield(),Ze(f,"litter-far",330,0,null,null,h,u)}await F.yield();let Ba=null,Ns=null;{const t=E("#DCE6CE"),n=E("#A6BE96"),m=E("#4E6A48"),f=[],p=[];for(let a=0;a<7;a++){const h=a%3===0,e=a/7*Z+(h?.2:0),o=h?1.15:.5+.12*(a%2),s=h?.7:1,l=Math.cos(e),i=Math.sin(e),c=.1,g=l*Math.cos(o)*s*.5,r=Math.sin(o)*s*.5,w=i*Math.cos(o)*s*.5,b=o+.4,M=g+l*Math.cos(b)*s*.5,x=r+Math.sin(b)*s*.5,A=w+i*Math.cos(b)*s*.5,v=-i*c,y=l*c,C=(S,B,P,T,_,X)=>{f.push(S,B,P,T.r,T.g,T.b,_,X),p.push(l*.5,.86,i*.5)};C(0,-.1,0,m,.3,.2),C(g+v,r,w+y,n,.75,.4),C(g-v,r,w-y,n,.75,.4),C(g+v,r,w+y,n,.75,.4),C(M,x,A,t,1,.5),C(g-v,r,w-y,n,.75,.4)}const d=Ba=j0(f);d.attributes.normal.array.set(p);const u=Ns=rt(1,1,{gloss:.3,sss:.5,fibre:14,variant:2,misc:[.035,0,1,112]});for(let a=0;a<2;a++){const h=l0[a],e=Math.round((a===0?980:560)*L(.5,1,st)),o=[],s=O.nearestXZ(h[0],h[1]);O.pointAt(s.u,D);const l=Math.hypot(D.x-h[0],D.z-h[1])||1,i=(D.x-h[0])/l,c=(D.z-h[1])/l;for(let r=0,w=0;r<e&&w<e*4;w++){(w&127)===0&&await F.yield();const b=R.range(0,Z),M=Math.sqrt(R())*.97,x=h[2]*M,A=h[0]+Math.cos(b)*x,v=h[1]+Math.sin(b)*x,y=Math.cos(b)*i+Math.sin(b)*c,C=R.range(.42,.82)*(a===0?1:.85),S=R.range(0,Z),B=R.range(0,Z),P=R.range(.82,1.14),T=R();if(R()>.3+.7*K(-.5,.4,y))continue;const _=y0(h,A,v),X=(y0(h,A+.4,v)-y0(h,A-.4,v))/.8,Q=(y0(h,A,v+.4)-y0(h,A,v-.4))/.8;I.set(-X,1,-Q).normalize().lerp(ht,.35).add(mt.set(Math.cos(S)*.22,0,Math.sin(S)*.22)).normalize(),yt.setFromUnitVectors(ht,I).multiply(sa.setFromAxisAngle(ht,B)),G.compose(I.set(A,_-.06,v),yt,mt.set(C,C*.9,C)),T>.9?Y.setRGB(P*1.05,P*1,P*.7):Y.setRGB(P,P*1.02,P*.96),o.push({m:G.clone(),c:Y.clone()}),r++}const g=e0(d,u,o,"cushion-tufts");Be.push({lo:g,hi:null,extra:null,c:g.boundingSphere.center.clone(),r:g.boundingSphere.radius,range:100,sw:0})}}await F.yield();const Ie=[],Sa=[],Fa={},I0=[[-126,46,32]];{const t=(d,u,a,h)=>{const[e,o]=nt(d,u);Ie.push({x:e,z:o,y:ft(e,o)-.5,H:a,R:h,kind:0})},n=[315,301,288,278],m=[-14.6,14.8,-15.2,16];for(let d=0;d<4;d++)t(U*Ae(n[d])+R.range(-2,2),m[d]+R.range(-.6,.6),R.range(11.5,16.5),R.range(4.4,5.6));const f=[ie-15,ie+1,ie+15,ie+27],p=[-11.2,-13.4,-10.8,-14.2];for(let d=0;d<4;d++)t(f[d]+R.range(-2,2),p[d]+R.range(-.6,.6),R.range(9.5,15),R.range(4.2,6.2));for(let d=0,u=0;d<7&&u<300;u++){const a=R.range(40,U*.8),h=(R.chance(.5)?1:-1)*R.range(62,150),e=R.range(19,29),o=R.range(8.5,12.5),[s,l]=nt(a,h);Math.hypot(s,l)<70||O.nearestXZ(s,l).dist<58||oe(s,l)>0||l>60&&Math.abs(s)<16+(430-l)*.27||h>0&&a>ie-70&&a<ie+60||ee&&Math.hypot(s-ee[0],l-ee[1])<40||Ie.some(i=>Math.hypot(i.x-s,i.z-l)<45)||I0.some(i=>Math.hypot(i[0]-s,i[1]-l)<i[2]*1.6+22)||(Ie.push({x:s,z:l,y:xe(s,l)-.6,H:e,R:o,kind:1}),d++)}}await F.yield();{const t=E("#3E5420"),n=E("#6E8A30"),m=E("#9CAA46"),f=E("#CBD074"),p=E("#6E5A30"),d=(b,M,x=0)=>{const A=[];A.push(ut(b&&!x?5:3,b&&!x?3:1,!0,(B,P,T)=>{const _=B*Z,X=.015*(1-.45*P);T.p[0]=Math.cos(_)*X+.03*P*P,T.p[1]=P,T.p[2]=Math.sin(_)*X,T.c[0]=L(p.r,n.r,P),T.c[1]=L(p.g,n.g,P),T.c[2]=L(p.b,n.b,P),T.a[0]=.3+P*.6,T.a[1]=.4}));const v=[],y=[],C=x||(b?50:15);for(let B=0;B<C;B++){const P=B/(C-1),T=L(.07,1,Math.pow(P,.8)),_=B*2.39996+(b?0:.4),X=Math.cos(_),Q=Math.sin(_),tt=K(.8,1,P),ct=K(.94,1,P),at=(.1+.075*Math.sin(Math.PI*Math.min(1,P*.9+.1)))*(1+.3*tt)*(1-.45*ct)*(b?1.12:1.1),Mt=L(-.2,.55,P*P)+.8*ct,j=(b?x?.016:.0118:.042)*(1-.3*ct),W=.03*T*T,et=Math.cos(Mt),it=Math.sin(Mt),$=Math.cos(Mt+.8),bt=Math.sin(Mt+.8),zt=.05+.4*P,Et=.45+.55*P,Ht=[L(t.r,n.r,zt)*.8,L(t.g,n.g,zt)*.8,L(t.b,n.b,zt)*.8],Ut=[L(n.r,m.r,Et),L(n.g,m.g,Et),L(n.b,m.b,Et)],ce=[L(Ut[0],f.r,tt),L(Ut[1],f.g,tt),L(Ut[2],f.b,tt)],ye=X*at*.45*et,Ee=T+at*.45*it,Fe=Q*at*.45*et,Qe=ye+X*at*.55*$,$e=Ee+at*.55*bt,Je=Fe+Q*at*.55*$,Re=-Q*j,ue=X*j,r0=T*.7,ge=Math.min(1.1,T+.08),he=(Ha,W0,X0,P0,ba,wa)=>{v.push(Ha+W,W0,X0,P0[0],P0[1],P0[2],ba,wa),y.push(X*.55,.82,Q*.55)};b?(he(0,T,0,Ht,r0,.5),he(ye+Re,Ee,Fe+ue,Ut,ge,.7),he(ye-Re,Ee,Fe-ue,Ut,ge,.7),he(ye+Re,Ee,Fe+ue,Ut,ge,.7),he(Qe,$e,Je,ce,ge,.8),he(ye-Re,Ee,Fe-ue,Ut,ge,.7)):(he(Re,T-.012,ue,Ht,r0,.5),he(-Re,T+.012,-ue,Ht,r0,.5),he(Qe,$e,Je,ce,ge,.75))}const S=j0(v);if(S.attributes.normal.array.set(y),A.push(S),M){const B=E("#B8742C");A.push(we([[.03,1,0],[.05,1.25,.01],[.08,1.5,.02],[.12,1.62,.03]],.012,B,0,!1)),A.push(It([.14,1.62,.035],[.035,.07,.035],B,b?6:4,b?3:2,1,1));const P=kt(A),T=P.attributes.aux.array,_=P.attributes.position.array;for(let X=0;X<T.length/2;X++)_[X*3+1]>1.001&&(T[X*2]=Math.min(1.6,_[X*3+1]));return P}return kt(A)},u=rt(1,1,{gloss:.5,sss:.4,fibre:9,variant:2,misc:[.55,0,1,285]}),a=Math.round(1500*st*L(.85,1.1,(qt-.7)/.6)),h=Math.round(a*.08);await F.yield();const e=10,o=5,s=b=>{const M=[];for(let x=0;x<b;x++)M.push([]);return M},l=s(e),i=s(o),c=s(o);let g=0,r=0;for(let b=0;(g<a||r<h)&&b<a*9;b++){(b&63)===0&&await F.yield();const M=z.range(0,U+30),x=M>ra-4,A=z(),v=z.chance(.5)?1:-1,y=v*((x?M>U-75?19:13:6.2)+85*Math.pow(A,1.6));if(M>U*w0+6&&!x)continue;const[C,S]=nt(M,y);if(Math.hypot(C,S)<20||Ge(C,S,3)||S<Ft+14&&S>Tt-8&&Math.abs(C)<22||S>Ft&&Math.abs(C)<10+(S-Ft)*.2||Math.hypot(C-la[0],S-la[1])<17||v>0&&Math.abs(M-ie)<30&&Math.abs(y)<34||Math.hypot(C-z0[0],S-z0[1])<15||v<0&&M>c0-30&&M<c0+4&&Math.abs(y)<16||Math.abs(M-ve)<9&&Math.abs(y)<30||ee&&(Math.hypot(C-ee[0],S-ee[1])<21||v>0&&M>De-85&&M<De+30&&Math.abs(y)<70))continue;const B=T0(C,S),P=K(Tt-2,Tt-14,S)*K(268,290,S),T=S>36&&S<112&&Math.abs(y)<17;let _=Math.max(P,3.2*B*(1-B),.9*K(.2,.9,oe(C,S))*(za(C,S)<.6?1:0),K(.15,.5,H.fbm2(C*.021+40,S*.021,2))*.8);if(x&&(_=Math.max(_,.32)),z()>_*(T?.55:1))continue;const X=S<Tt&&S>60&&Math.abs(C)<3+(460-S)*.047,Q=z.range(7,14)*(.75+.25*Math.min(1,Math.abs(y)/14))*(T||X?.4:1);if(O.nearestXZ(C,S).dist<6.2+Q*.26)continue;St.set(z.range(-.09,.09),z.range(0,Z),z.range(-.09,.09)),G.compose(I.set(C,ft(C,S)-.3,S),yt.setFromEuler(St),mt.set(Q*1.3,Q,Q*1.3));const tt=z.range(.8,1.2);z.chance(.1)?Y.setRGB(tt*1.3,tt*.95,tt*.55):Y.setRGB(tt,tt*z.range(.95,1.08),tt*z.range(.8,1));const ct={m:G.clone(),c:Y.clone()},at=Math.min(.999,M/(U+31));r<h&&z.chance(.14)?(c[Math.floor(at*o)].push(ct),r++):g<a&&((O.nearestXZ(C,S).dist<27?l[Math.floor(at*e)]:i[Math.floor(at*o)]).push(ct),g++)}await F.yield();for(const b of[l,i,c])for(let M=0;M<b.length;M++)b[M]=b[M].filter(x=>{const A=x.m.elements[12],v=x.m.elements[14];return!Ie.some(y=>Math.hypot(y.x-A,y.z-v)<(y.kind?5:y.R*.6+2))});{const b=(U-104)/U,M=(A,v)=>{const y=O.nearestXZ(A,v);return y.u>b&&y.dist>15};for(const A of[l,i,c])for(let v=0;v<A.length;v++)A[v]=A[v].filter(y=>!M(y.m.elements[12],y.m.elements[14]));const x=22;l.push([]);for(let A=0,v=0;A<x&&v<200;v++){await F.yield();const y=V.range(-100,84),C=(V.chance(.5)?1:-1)*(21+58*Math.pow(V(),1.25)),S=V.range(5.5,13.5),B=V.range(3.6,7.5),P=Math.round(V.range(16,34)*L(.6,1,st)*(S>9?1.2:1)),T=V()<.2,[_,X]=h0(y,C);if(!(Ge(_,X,9)||v0(_,X)>0||Math.hypot(_-f0[0],X-f0[1])<16||_<-215||_>255||X<-188)&&!(O.nearestXZ(_,X).dist<17+B)){for(let Q=0;Q<P;Q++){const tt=V.gauss(),ct=V.gauss(),at=V.range(.62,1.12),Mt=V.range(0,Z),j=V.range(-.1,.1),W=V.range(-.1,.1),et=V.range(.8,1.2),it=V()<.1,$=_+tt*B,bt=X+ct*B,zt=Math.min(1,Math.hypot(tt,ct)/2.4);if(Ge($,bt,4)||v0($,bt)>.2||O.nearestXZ($,bt).dist<15.5)continue;const Et=Math.max(2.2,S*(1-.72*zt*zt)*at);St.set(j,Mt,W),G.compose(I.set($,D0($,bt)-.3,bt),yt.setFromEuler(St),mt.set(Et*1.3,Et,Et*1.3)),T&&Q%3===0?Y.setRGB(et*1.3,et*.95,et*.55):Y.setRGB(et,et*1.03,et*.9);const Ht={m:G.clone(),c:Y.clone()};it?c[o-1].push(Ht):(O.nearestXZ($,bt).dist<46?l[e]:i[o-1]).push(Ht)}A++}}}const w=d(!1,!1);Ze(l,"haircap",290,44,d(!0,!1),u,w,u),await F.yield(),Ze(i,"haircap-far",290,0,null,null,w,u),await F.yield(),Ze(c,"haircap-capsules",290,36,d(!0,!0),u,d(!1,!0),u),await F.yield();{const M=s(8),x=Math.round(1450*L(.5,1,st)),A=U*Ce-6,v=U*Ne-4,y=U*Ae(331),C=U*Ae(266);for(let T=0,_=0;T<x&&_<x*6;_++){(_&63)===0&&await F.yield();const X=R()<.72,Q=X?R.range(A,v):R.range(y,C),tt=(R.chance(.5)?1:-1)*(2.7+16*Math.pow(R(),1.75)),ct=R(),at=R.range(0,Z),Mt=R.range(-.12,.12),j=R.range(-.12,.12),W=R.range(.85,1.25),et=R(),[it,$]=nt(Q,tt),bt=Math.abs(tt);if(Math.hypot(it,$)<15.5||oe(it,$)>.1||X&&tt>3.5&&tt<6.9||X&&et>.25+.75*K(.25,.7,T0(it,$)))continue;const zt=Math.min(2.9,.75+.3*(bt-2.7)),Et=L(.7,zt,ct*ct);St.set(Mt,at,j),G.compose(I.set(it,ft(it,$)-.12,$),yt.setFromEuler(St),mt.set(Et*2.3,Et,Et*2.3)),et<.12?Y.setRGB(W*1.25,W*1,W*.6):Y.setRGB(W,W*1.05,W*.85),M[Math.min(7,Math.floor((X?(Q-A)/(v-A)*.75:.75+(Q-y)/(C-y)*.25)*8))].push({m:G.clone(),c:Y.clone()}),T++}const S=rt(1,1,{gloss:.5,sss:.4,fibre:9,variant:2,misc:[.11,0,1,190]});Ze(M,"turf",190,34,d(!0,!1,22),S,d(!1,!1,8),S),await F.yield();const B=s(8),P=Math.round(2200*L(.5,1,st));for(let T=0,_=0;T<P&&_<P*5;_++){(_&63)===0&&await F.yield();const X=R()<.84,Q=X?R.range(A,v):R.range(y,C),tt=(R.chance(.5)?1:-1)*(2+12*Math.pow(R(),1.7)),ct=R(),at=R.range(0,Z),Mt=R.range(-.3,.3),j=R.range(-.3,.3),W=R.range(.5,.84),et=R(),it=R.range(0,.5),[$,bt]=nt(Q,tt);if(Math.hypot($,bt)<15.5||oe($,bt)>.1||X&&et>.2+.8*K(.2,.6,T0($,bt)))continue;const zt=L(.32,tt>3.2&&tt<7.2?.42:.74,ct);St.set(Mt,at,j),G.compose(I.set($,ft($,bt)+it*zt*.5,bt),yt.setFromEuler(St),mt.set(zt,zt*(.8+it),zt)),et<.03?Y.setRGB(W*1.15,W*1.05,W*.5):Y.setRGB(W*.72,W*1,W*.5),B[Math.min(7,Math.floor((X?(Q-A)/(v-A)*.75:.75+(Q-y)/(C-y)*.25)*8))].push({m:G.clone(),c:Y.clone()}),T++}{const T=Math.round(440*L(.5,1,st));for(let _=0,X=0;_<T&&X<T*4;X++){(X&63)===0&&await F.yield();const Q=V.range(A+4,v-2),tt=(V.chance(.5)?1:-1)*(1.25+5.6*Math.pow(V(),1.3)),ct=V(),at=V.range(0,Z),Mt=V.range(-.3,.3),j=V.range(-.3,.3),W=V.range(.55,.9),et=V(),it=V.range(0,.4),[$,bt]=nt(Q,tt);if(Math.hypot($,bt)<15.5||oe($,bt)>.1)continue;const zt=L(.26,tt>3.2&&tt<7.2?.38:.5,ct);St.set(Mt,at,j),G.compose(I.set($,ft($,bt)+it*zt*.4,bt),yt.setFromEuler(St),mt.set(zt,zt*(.8+it),zt)),et<.05?Y.setRGB(W*1.15,W*1.05,W*.5):Y.setRGB(W*.72,W*1,W*.5),B[Math.min(7,Math.floor((Q-A)/(v-A)*.75*8))].push({m:G.clone(),c:Y.clone()}),_++}}Ze(B,"turf-stars",84,0,null,null,Ba,rt(1,1,{gloss:.3,sss:.5,fibre:14,variant:2,misc:[.035,0,1,84]}))}}await F.yield();const p0=[],Ra=[],a0=[],pe=[],as=[],ca=[],Ds=Math.max(U*Ae(206),ve+14),La=U*Ae(104),ha=t=>!!ee&&t>De-78&&t<De+16,ss=[.466,.514,.572].map(t=>{const[n,m]=nt(t*U,10.5);return{d:t*U,x:n,z:m}});{const t=Math.max(7,Math.min(13,Math.round(L(7,13,(qt-.7)/.6)))),n=de.cream.clone().multiplyScalar(.9),m=E("#D8281C"),f=E("#B4A2C4"),p=(e,o,s,l=-1,i=0,c=1)=>{const g=s,r=l>=0?l:e===1?.08:e%4===3?g.range(.05,.3):g.range(.35,1),w=ha(o)&&e%2===1,b=e%2&&!w?1:-1,M=(r<.2?g.range(3.2,4.6):L(9.5,14,g())*(vt?.62:1))*c;let x=r<.2?M*.42:L(3.6,7.2,K(.2,1,r))*g.range(.9,1.08),A=Math.max(i,(r<.2?g.range(9.5,12):g.range(8.2,10.5)+(vt?3:0))+(w?6.5:0)),[v,y]=nt(o,b*A);for(const j of ss)Math.hypot(j.x-v,j.z-y)>x+3.4||(A+=6.5,[v,y]=nt(o,b*A),x=Math.max(Math.min(x,Math.hypot(j.x-v,j.z-y)-3.2),2.8));const C=ft(v,y)-.5,S=g.range(0,Z),B=g.range(.02,.09),P=r<.2?.9:g.range(.72,1),T=new k.Matrix4().makeRotationAxis(I.set(Math.cos(S),0,Math.sin(S)).clone(),B).setPosition(v,C,y);if(a0.push({x:v,z:y,y:C,H:M,R:x,age:r}),p0.push({m:T,g:ze(14,12,j=>{const W=j*M;return[P*(1+1*Math.exp(-W*W/3.2)+.12*Math.sin(W*3.1)*Math.exp(-W/3))*(1-.22*j),W]},(j,W,et)=>{const it=.86+.14*H.n2(j*30,W*22+e*7),$=K(.25,0,W);et.c[0]=n.r*it*(1-.25*$),et.c[1]=n.g*it*(1-.32*$),et.c[2]=n.b*it*(1-.45*$),et.a[0]=.5+.5*K(0,.2,W)-.35*K(.82,1,W),et.a[1]=.8})}),r>=.2){const j=M*.74;p0.push({m:T,g:ze(16,4,W=>[P*.8+.1+1.25*Math.pow(W,.7),j-1.5*W*W-.1*W],(W,et,it)=>{const $=.9+.1*Math.sin(W*Z*9);it.c[0]=n.r*$,it.c[1]=n.g*$*.97,it.c[2]=n.b*$*.9,it.a[0]=.75,it.a[1]=.7})})}const _=K(.2,.85,r),X=vt?-.9:L(x*1.25,x*.16,_),Q=L(1.7,3.2,_),tt=vt?.05:L(.92,.22,K(.3,1,r)),ct=vt?E("#C8641E"):m.clone().multiplyScalar(g.range(.85,1.05)),at=j=>M+(vt?.9*Math.pow(j,2.2):X*(1-Math.pow(j,Q)))+(r<.2?0:.18*x*Math.exp(-j*j*30)),Mt=j=>x*(r<.2?Math.sin(j*Math.PI*.62)/Math.sin(Math.PI*.62):Math.pow(j,.9));if(Ra.push({m:T,g:ze(30,12,j=>[Mt(j)*(1+(j>.9?.02:0)),at(j)+(r<.2?-x*.9*j*j:0)],(j,W,et)=>{et.c[0]=ct.r,et.c[1]=ct.g,et.c[2]=e*.37%1,et.a[0]=W,et.a[1]=tt})}),r>=.2&&Ra.push({m:T,g:ze(30,4,j=>{const W=L(.12,1,j);return[x*Math.pow(W,.9),at(W)-(.25+.9*(1-W))*(vt?.5:1)]},(j,W,et)=>{et.c[0]=j,et.c[1]=0,et.c[2]=0,et.a[0]=L(.12,1,W),et.a[1]=2})}),vt)for(let j=0;j<2;j++){const[W,et]=nt(o+g.range(-4,4),b*(A-2.4+j*5.5+g.range(-1,1))),it=ft(W,et)-.3,$=g.range(3.5,5.5),bt=g.range(2.6,3.8),zt=new k.Matrix4().makeTranslation(W,it,et);p0.push({m:zt,g:ze(10,5,Et=>[.75*(1+.5*Math.exp(-Et*Et*8)),Et*$],(Et,Ht,Ut)=>{Ut.c[0]=f.r*1.15,Ut.c[1]=f.g*1.15,Ut.c[2]=f.b*1.1,Ut.a[0]=.5+.5*Ht,Ut.a[1]=.6})}),p0.push({m:zt,g:ze(18,9,Et=>{const Ht=Et<.7?Et/.7:1-(Et-.7)/.3*.82;return[bt*Ht,$+(Et<.7?bt*.42*(1-Ht*Ht):-.25-.3*(1-Ht))]},(Et,Ht,Ut)=>{const ce=Ht<.7?1:.62+.1*Math.sin(Et*Z*40);Ut.c[0]=f.r*ce,Ut.c[1]=f.g*ce*.95,Ut.c[2]=f.b*ce,Ut.a[0]=Ht<.7?1:.55,Ut.a[1]=Ht<.7?1.6:.4})})}};for(let e=0;e<t;e++){const o=(e+z.range(.15,.85))/t;p(e,L(Ds,La,o),z),e&1&&await F.yield()}{const e=t+t%2;p(e,La+17+N.range(-1.5,1.5),N,N.range(.3,.36),10.6,.7),p(e+2,La+40+N.range(-2,2),N,N.range(.3,.38),11,.78)}await F.yield();const d=16,u=E("#C6AE86"),a=E("#8A6A45");for(let e=0,o=0;e<d&&o<300;o++){const s=e<3,l=s?ss[e].d:z.range(U*Ae(300),U*Ce+10),i=s?z.range(9,11)*(ha(l)?-1:1):(z.chance(.5)?1:-1)*z.range(11,46),c=s?10.5:i,[g,r]=nt(l,c);if(!s&&(oe(g,r)>.2||ee&&Math.hypot(g-ee[0],r-ee[1])<20||c>0&&ha(l)||Math.abs(l-ve)<12||a0.some(y=>Math.hypot(y.x-g,y.z-r)<y.R+5)||pe.some(y=>Math.hypot(y.x-g,y.z-r)<9)))continue;const w=s?z.range(6,7.5):z.range(4,8),b=w*z.range(.36,.42),M=ft(g,r)-.25,x=s?.75:z();pe.push({x:g,z:r,y:M,H:w,R:b,d:l});const A=z.range(.9,1.1),v=z.range(0,9);(s?ca:as).push({m:s?null:new k.Matrix4().makeTranslation(g,M,r),g:ze(s?26:18,s?16:12,y=>[b*L(.5,1,K(.2,.62,y))*Math.sqrt(Math.max(1-Math.pow(Math.max(0,(y-.64)/.36),2.2),0))*Math.sqrt(K(0,.08,y)*.75+.25),w*(y-.035*K(.93,1,y))],(y,C,S)=>{const B=y*Z,P=H.n3(Math.cos(B)*3.2+v,C*9,Math.sin(B)*3.2)*.5+.5,T=K(.55,.8,P),_=1+.045*T*K(.3,.6,C)+.05*Math.sin(B*2+v)*A;S.p[0]*=_,S.p[2]*=_;const X=(.8+.3*P)*(1-.7*K(.955,1,C)),Q=x>.6?.55:.1;S.c[0]=L(u.r,a.r,Q+.3*T)*X,S.c[1]=L(u.g,a.g,Q+.3*T)*X,S.c[2]=L(u.b,a.b,Q+.3*T)*X,S.a[0]=.45+.55*K(0,.3,C),S.a[1]=.7})}),e++,(e&1)===0&&await F.yield()}const h=rt(1,0,{gloss:.5,sss:.14,fibre:3,variant:3});await F.yield(),se(kt(as),h,"puffballs"),ca.forEach((e,o)=>{const s=se(e.g,h,"puffball-"+o);s.position.set(pe[o].x,pe[o].y,pe[o].z),s.updateMatrix(),ca[o]=s})}await F.yield();const k0=(t,n)=>{const{H:m,R:f,sr:p,top:d,mid:u,gill:a,stalk:h,ng:e,dome:o,m:s,noStalk:l,res:i=28,sn:c=12,sv:g=10}=n;l||t.push({m:s,g:ze(c,g,b=>{const M=b*(m+.6*f*o);return[p*(1+.8*Math.exp(-M*M/(2.2*p*p+1)))*(1-.24*b),M]},(b,M,x)=>{const A=.84+.16*H.n2(b*30,M*22+m),v=K(.22,0,M);x.c[0]=h.r*A*(1-.25*v),x.c[1]=h.g*A*(1-.32*v),x.c[2]=h.b*A*(1-.45*v),x.a[0]=.5+.5*K(0,.2,M)-.4*K(.8,1,M),x.a[1]=.8})});const r=f*o,w=b=>m+r*(1-Math.pow(b,2.2))+.1*f*Math.exp(-b*b*30);t.push({m:s,g:ze(i,10,b=>{const M=Math.min(1,b/.85),x=Math.max(0,(b-.85)/.15);return[f*(Math.pow(M,.9)-.035*x*x),w(M)-.07*f*x]},(b,M,x)=>{const A=Math.min(1,M/.85),v=H.n2(b*40+m,M*6),y=Math.exp(-A*A*7),C=M>.7?.9+.1*Math.sin(b*Z*e):1,S=(.86+.18*v)*C;x.c[0]=L(d.r,u.r,y)*S,x.c[1]=L(d.g,u.g,y)*S,x.c[2]=L(d.b,u.b,y)*S,x.a[0]=M>.85?.7:1,x.a[1]=1.5})}),t.push({m:s,g:ut(e*2,4,!0,(b,M,x,A)=>{const v=b*Z,y=L(.1,.97,M),C=A%2,S=(.05+.2*Math.pow(Math.sin(Math.PI*Math.min(1,.08+y*.92)),.6))*f;x.p[0]=Math.cos(v)*f*y,x.p[2]=Math.sin(v)*f*y,x.p[1]=w(y)-.06*f-C*S;const B=C?1:.4;x.c[0]=a.r*B,x.c[1]=a.g*B,x.c[2]=a.b*B*(C?1:.85),x.a[0]=(C?.95:.4)*(.6+.4*M),x.a[1]=.35})})};{const t=E("#B98A52"),n=E("#74481F"),m=E("#E4D8B8"),f=E("#D6CAAC"),p=E("#D9CBA6"),d=E("#6E4A26"),u=rt(1,0,{gloss:.6,sss:.14,fibre:3,variant:1});Fa.mat=u;for(const a of Ie){const h=[];await F.yield();const e=R.range(0,Z),o=a.kind?R.range(.01,.04):R.range(.03,.1),s=new k.Matrix4().makeRotationAxis(new k.Vector3(Math.cos(e),0,Math.sin(e)),o).setPosition(a.x,a.y,a.z);if(a.kind===0)k0(h,{H:a.H,R:a.R,sr:R.range(.75,1),top:t.clone().multiplyScalar(R.range(.85,1.12)),mid:n,gill:m,stalk:f,ng:34,dome:R.range(.22,.4),m:s});else{k0(h,{H:a.H,R:a.R,sr:R.range(1.1,1.4),top:p,mid:d,gill:m,stalk:f,ng:30,dome:R.range(.24,.34),m:s,res:20});const i=a.H*.72;h.push({m:s,g:ze(14,3,c=>[1.3+2.2*Math.pow(c,.7),i-1.8*c*c],(c,g,r)=>{r.c[0]=f.r*.9,r.c[1]=f.g*.86,r.c[2]=f.b*.8,r.a[0]=.75,r.a[1]=.6})})}const l=kt(h);l.computeBoundingSphere(),Sa.push(se(l,u,"troop",!0))}}await F.yield();{const t=E("#6B4A26"),n=E("#C9A877"),m=[];for(let u=0;u<4;u++){const a=u/4*Z+.2*Math.sin(u*2.3);m.push(ut(4,5,!1,(h,e,o)=>{const s=.62*Math.sin(Math.PI*Math.min(1,.12+e*.88))*(1-.4*e),l=a+(h-.5)*s*1.7,i=.16+.95*Math.sin(e*1.9)*(1+.07*Math.sin(h*19+e*23)),c=.05+.55*e*e+.3*e+.12*Math.abs(h-.5);o.p[0]=Math.cos(l)*i,o.p[1]=c,o.p[2]=Math.sin(l)*i;const g=.75+.25*Math.sin(h*31+e*17);o.c[0]=L(n.r,t.r,.5+.5*g*e),o.c[1]=L(n.g,t.g,.5+.5*g*e),o.c[2]=L(n.b,t.b,.5+.5*g*e),o.a[0]=.4+.6*e,o.a[1]=.5}))}const f=Math.round(64*L(.7,1,st)),p=new k.InstancedMesh(kt(m),rt(1,0,{gloss:.45,sss:.12,fibre:14}),f);let d=0;for(let u=0;d<f&&u<f*8;u++){const a=z.range(0,U*Ce+5),h=(z.chance(.5)?1:-1)*(7.2+28*Math.pow(z(),1.7)),[e,o]=nt(a,h);if(oe(e,o)>.3||o<Ft+6&&o>Tt-6&&Math.abs(e)<9||a0.some(i=>Math.hypot(i.x-e,i.z-o)<4)||pe.some(i=>Math.hypot(i.x-e,i.z-o)<i.R+2.5))continue;const s=z.range(1.5,2.1);St.set(z.range(-.5,.5),z.range(0,Z),z.range(-.5,.5)),G.compose(I.set(e,ft(e,o)+.05,o),yt.setFromEuler(St),mt.set(s,s*z.range(.8,1.15),s));const l=z.range(.7,1.15);p.setMatrixAt(d,G),p.setColorAt(d,Y.setRGB(l,l,l)),d++}p.count=d,p.name="husks",He(p,6,240)}await F.yield();const We=[],po=E("#746B5E"),s0=E("#5E4630"),lt=(t,n,m)=>new k.Vector3(t,n,m);We.push(Te([lt(-15,ae+3,409),lt(-7.5,ae+9.5,403.5),lt(.6,aa(Ft)+.7,Ft),lt(-.4,aa((Ft+Tt)/2)+.3,(Ft+Tt)/2),lt(.2,aa(Tt),Tt),lt(7,aa(Tt)-2.2,Tt-8),lt(14,ae+7,Tt-18),lt(20,ae+.4,Tt-27)],40,8,t=>.55-.2*t,s0,(t,n,m)=>.1*H.n2(m*.25,t*2)));const q0=(()=>{const t=nt(ve+4.5,-15),n=nt(ve+2.5,-8.5),m=nt(ve+.6,-3.2),f=nt(ve-.6,3.2),p=nt(ve-2.5,9.5),d=nt(ve-5,15),u=nt(ve-7,20);return[lt(t[0],ft(t[0],t[1])+.2,t[1]),lt(n[0],ae+4.9,n[1]),lt(m[0],ae+5.85,m[1]),lt(f[0],ae+5.95,f[1]),lt(p[0],ae+5.3,p[1]),lt(d[0],ae+3.3,d[1]),lt(u[0],ft(u[0],u[1])+.1,u[1])]})(),Pa=new k.CatmullRomCurve3(q0,!1,"centripetal");We.push(Te(q0,36,8,t=>.5-.14*t,s0,(t,n,m)=>.1*H.n2(m*.3+5,n*2)));const Zt=U*Ne,Kt=4,Xe=E("#716C60");{const t=[],n=[];for(let p=0;p<7;p++)n.push([N.range(18,118),(N.chance(.5)?1:-1)*N.range(1.25,1.9),N.range(.07,.14),N.range(1.2,2.2)]);for(let p=Zt-16;p<U+12;p+=9)O.posAtDist(p,D),t.push(lt(D.x,D.y-be-Kt+(p<Zt?-.5:0),D.z));const m=Te(t,112,30,p=>Kt*(1-.06*p),Xe,(p,d,u)=>{const a=Math.atan2(d,p);let h=.03*H.n3(p*1.5,u*.09,d*1.5)+.012*H.n3(p*5,u*.4,d*5);for(const e of n){const o=(u-e[0])/e[3],s=(a-e[1])/.34;h+=e[2]*Math.exp(-o*o-s*s)}return h});m.computeBoundingSphere();const f=se(m,rt(10,0,{variant:1,fibre:Kt,misc:[0,.28,1,0]}),"branch",!0);Be.push({lo:f,hi:null,extra:null,c:m.boundingSphere.center.clone(),r:m.boundingSphere.radius,range:330,sw:0})}await F.yield();const me=_t.clone(),Pe=new k.Vector3().crossVectors(me,ht).normalize(),Ve=Le.clone().addScaledVector(me,-6),A0=10.5,mo=7.5,os=t=>1.5*H.n2(Math.cos(t)*1.4+20,Math.sin(t)*1.4)+.5*H.n2(Math.cos(t)*5,Math.sin(t)*5+7),_0=t=>.55*os(t),fa=(t,n,m,f)=>t.set(Ve.x+me.x*f+Pe.x*Math.cos(n)*m,Ve.y+Math.sin(n)*m,Ve.z+me.z*f+Pe.z*Math.cos(n)*m),U0=76,da=[],ns=[];for(let t=0;t<=U0;t++)da.push((t+(t>0&&t<U0?N.range(-.28,.28):0))/U0*Z);const rs=(t,n)=>{const m=(t%Z+Z)%Z;let f=0;for(;f<U0-1&&da[f+1]<m;)f++;const p=ns[f],d=n<8.35?0:n<9.3?1:2;return p&&p[d]!==null?p[d]:p&&p[2]!==null?p[2]+.5:_0(t)};{const t=[[46,10.1],[32,10.6],[17,10.4],[7,10.6],[1.6,10.55],[.35,10.38]],n=[ut(64,(t.length-1)*2,!0,(p,d,u)=>{const a=d*(t.length-1),h=Math.min(t.length-2,Math.floor(a)),e=a-h,o=p*Z;let s=L(t[h][0],t[h+1][0],e),l=L(t[h][1],t[h+1][1],e);const i=1-K(2,9,s);s+=(_0(o)+.9*Math.abs(H.n2(p*40,3.3))*(1-K(.3,2,s)))*i,l*=1+.045*H.n3(Math.cos(o)*1.8,s*.08,Math.sin(o)*1.8)+.012*H.n3(Math.cos(o)*7,s*.4,Math.sin(o)*7),fa(D,o,l,s),u.p[0]=D.x,u.p[1]=D.y,u.p[2]=D.z,u.c[0]=Xe.r,u.c[1]=Xe.g,u.c[2]=Xe.b,u.a[0]=p,u.a[1]=s})];for(let p=0;p<30;p++){const d=N.range(0,Z),u=N.range(.1,.26),a=N.range(1.2,3.6),h=N.range(.25,1.3),e=N.range(.6,1.6),o=N.range(.9,1.9),s=N.range(-.25,.25);Math.sin(d)<-.55||n.push(ut(3,4,!1,(l,i,c)=>{const g=d+(l-.5)*u*(1-.35*i*i)+s*i*u,w=_0(g)+o-a*i,b=Math.pow(i,e);fa(D,g,A0+.08+h*b+.12*Math.sin(l*Math.PI)*i,w),c.p[0]=D.x,c.p[1]=D.y,c.p[2]=D.z;const M=1-.25*i;c.c[0]=Xe.r*M,c.c[1]=Xe.g*M,c.c[2]=Xe.b*M,c.a[0]=g/Z,c.a[1]=w}))}const m=kt(n);m.computeBoundingSphere();const f=se(m,rt(9,0,{variant:1,fibre:A0,misc:[0,0,1,0]}),"log-bark",!0);Be.push({lo:f,hi:null,extra:null,c:m.boundingSphere.center.clone(),r:m.boundingSphere.radius,range:330,sw:0})}await F.yield();{const t=[],n=new k.Vector3,m=new k.Vector3,f=new k.Vector3,p=new k.Vector3,d=(i,c,g,r,w,b,M)=>{t.push(i.x,i.y,i.z,r[0],r[1],r[2],i.w,w,c.x,c.y,c.z,r[0],r[1],r[2],c.w,b,g.x,g.y,g.z,r[0],r[1],r[2],g.w,M)},u=(i,c,g)=>{const r=fa(new k.Vector3,i,c,g);return r.w=c,r},a=(i,c,g,r,w,b,M)=>{d(i,c,g,w,b,b,M),d(i,g,r,w,b,M,M)},h=[7.62,8.35,9.3,10.22];for(let i=0;i<U0;i++){const c=da[i],g=da[i+1],r=(c+g)*.5,w=_0(r),b=[null,null,null],M=Math.sin(r)<-.62;for(let x=0;x<3;x++){const A=N(),v=N.range(.05,.15),y=N.range(-.75,.55),C=N.range(1.3,3.4),S=N.range(.2,.5),B=N.range(-.25,.5),P=N.range(-.3,.3),T=N.range(.8,1.14),_=N.range(.94,1.02),X=N.range(.84,1);if(M||x<2&&A<.13)continue;const Q=A<.37,tt=w+(Q?-C:y),ct=w+1.9;b[x]=Q?w-.4:tt;const at=h[x]+.02,Mt=h[x+1]-.03-(x<2?N.range(0,.08):0),j=L(c,g,v),W=L(c,g,1-v),et=[T,T*_,T*X],it=u(j,at,ct),$=u(W,at,ct),bt=u(W,Mt,ct),zt=u(j,Mt,ct),Et=Q?S:N.range(.82,1),Ht=r+P*(g-c)*(Q?1:.2),Ut=Math.max(7.6,(at+Mt)*.5+(Q?x===0?Math.abs(B):B:0)),ce=(ue,r0,ge)=>u(L(Ht,ue,Et),L(Ut,r0,Et),tt+ge),ye=Q?0:N.range(-.25,.25),Ee=Q?0:N.range(-.2,.2),Fe=ce(j,at,ye),Qe=ce(W,at,Ee),$e=ce(W,Mt,-ye),Je=ce(j,Mt,-Ee),Re=Math.max(.66,Math.min(1,.86+.12*(w-tt)));a(Fe,Qe,$e,Je,et,Re,Re),a(it,$,Qe,Fe,et,.4,.9),a($,bt,$e,Qe,et,.4,.9),a(bt,zt,Je,$e,et,.4,.9),a(zt,it,Fe,Je,et,.4,.9)}ns.push(b)}for(let i=0;i<46;i++){const c=N.range(0,Z),g=N.range(7.9,10.1),r=N.range(1.6,4.4),w=N.range(.1,.24),b=N.range(-.2,.55),M=N.range(-.06,.06),x=N.range(.9,1.2);if(Math.sin(c)<-.55)continue;const A=rs(c,g)+.3,v=Math.max(7.5,g+b*r),y=w/g,C=u(c-y,g-w*.4,A),S=u(c+y,g-w*.4,A),B=u(c,g+w*.8,A),P=u(c+M,v,A-r),T=[x,x*.97,x*.9];d(C,S,P,T,.6,.6,1),d(S,B,P,T,.6,.6,1),d(B,C,P,T,.6,.6,1)}const e=j0(t);await F.yield();const o=ut(48,5,!0,(i,c,g,r,w)=>{const b=i*Z,M=_0(b),x=[[M+1.25,10.32],[M+1.5,9],[M+1.5,7.56],[M+4.5,7.5],[10,7.5],[17,7.5]][w],A=x[1]*(w>2?1+.03*H.n3(Math.cos(b)*4,x[0]*.3,Math.sin(b)*4+3):1);fa(D,b,A,x[0]),g.p[0]=D.x,g.p[1]=D.y,g.p[2]=D.z;const v=w>2?.3:.36;g.c[0]=v,g.c[1]=v*.9,g.c[2]=v*.8,g.a[0]=A,g.a[1]=w>2?.7:.5}),s=kt([e,o]);s.computeBoundingSphere();const l=se(s,rt(8,0,{misc:[me.x,me.z,0,0]}),"log-wood",!0);Be.push({lo:l,hi:null,extra:null,c:s.boundingSphere.center.clone(),r:s.boundingSphere.radius,range:330,sw:0})}await F.yield();const Va=[];let pa=null;{const t=E("#D9D6CC"),n=E("#4C463B"),m=nt(U*Ae(170),168),f=(u,a)=>[Le.x+_t.x*u-_t.z*a,Le.z+_t.z*u+_t.x*a],p=[[m[0],m[1],22,t,3],[I0[0][0],I0[0][1],I0[0][2],n,6],[...f(250,4),52,n,7],[-105,-175,44,n,6],[...f(68,97),38,n,5],[...f(139,-150),42,n,6],[-160,170,34,n,5]],d=[];for(const u of p){await F.yield();const a=u[2],h=u[4],e=[];for(let l=0;l<h;l++)e.push([(l+V.range(.15,.85))/h*Z,V.range(.75,1.3),V.range(4,8)]);const o=[-.25,0,.1,.25,.5,1,2.2,5,10,18],s=Math.min(ae,u[0]>-225&&u[0]<265&&u[1]>-195&&u[1]<515?xe(u[0],u[1]):ae)-1.5;Va.push([u[0],u[1],a]),Ie.forEach((l,i)=>{Sa[i]&&Math.hypot(l.x-u[0],l.z-u[1])<a*1.5+l.R&&(Sa[i].visible=!1)}),d.push({m:new k.Matrix4().makeTranslation(u[0],s,u[1]),g:ut(48,o.length-1,!0,(l,i,c,g,r)=>{const w=o[r]*a,b=l*Z,M=Math.max(w,0);let x=0;for(const y of e){const C=Math.cos(b-y[0]);C>0&&(x=Math.max(x,y[1]*Math.pow(C,y[2])))}const A=a*(1+.035*Math.sin(b*3+u[0])+.02*Math.sin(b*7+M*.03)+x*(1.15*Math.exp(-M/(.3*a))+.22*Math.exp(-M/(1.4*a)))+.1*Math.exp(-M/(.6*a)));c.p[0]=Math.cos(b)*A,c.p[1]=w,c.p[2]=Math.sin(b)*A;const v=1-.25*x*Math.exp(-M/(.5*a));c.c[0]=u[3].r*v,c.c[1]=u[3].g*v,c.c[2]=u[3].b*v,c.a[0]=l,c.a[1]=M})})}await F.yield(),pa=rt(9,0,{variant:1,fibre:36,misc:[1,0,1,0]}),se(kt(d),pa,"great-trunks")}const o0=[];{const t=Math.round(36*L(.6,1,st));for(let n=0,m=0;n<t&&m<t*8;m++){(m&7)===0&&await F.yield();const f=R.range(6,U*Ce+6),p=R.range(-32,32),d=R.range(11,30),u=R.range(0,Math.PI),a=R.range(.2,.46),h=R.range(-.3,.3),e=R(),o=R.range(.3,.7),s=R.range(.5,.95)*(R.chance(.5)?1:-1),l=R.range(.15,.5),[i,c]=nt(f,p);if(c<Ft+12&&c>Tt-8&&Math.abs(i)<14||Math.hypot(i,c)<34)continue;const g=[];let r=!0,w=!1;for(let M=0;M<=5&&r;M++){const x=M/5-.5,A=u+h*x*2,v=i+Math.cos(A)*d*x,y=c+Math.sin(A)*d*x;(oe(v,y)>.05||a0.some(C=>Math.hypot(C.x-v,C.z-y)<3.2)||pe.some(C=>Math.hypot(C.x-v,C.z-y)<C.R+1.2)||Ie.some(C=>Math.hypot(C.x-v,C.z-y)<3.4))&&(r=!1),O.nearestXZ(v,y).dist<3.2+d*.12?r=!1:O.nearestXZ(v,y).dist<7.5&&(w=!0),g.push(lt(v,ft(v,y),y))}if(!r)continue;const b=w?Math.min(a,.26):a;for(const M of g)M.y+=b*.5;if(We.push(Te(g,12,6,M=>b*(1-.45*M),s0,(M,x,A)=>.14*H.n2(A*.35+n*3,M*2))),o0.push({pts:g,r:b,len:d}),e>.35&&!w){const M=o-.5,x=u+h*M*2,A=i+Math.cos(x)*d*M,v=c+Math.sin(x)*d*M,y=d*R.range(.18,.3),C=x+s;if(Ca(A,v,f,p)){const S=ft(A,v)+b*.5,B=[];for(let P=0;P<=3;P++){const T=P/3;B.push(lt(A+Math.cos(C)*y*T,S+Math.sin(l)*y*T*(.6+.4*T),v+Math.sin(C)*y*T))}B.every(P=>O.distanceTo(P.x,P.y,P.z)>6.5)&&We.push(Te(B,6,5,P=>b*.6*(1-.6*P),s0,null))}}n++}}const C0=Math.ceil(U/.5),Ka=new Float32Array(C0+1),Ea=new Float32Array(C0+1);for(let t=0;t<=C0;t++)O.pointAt(t/C0,D),Ka[t]=D.x,Ea[t]=D.z;const ma=(t,n)=>{const m=Math.round(O.nearestXZ(t,n).u*C0),f=Math.max(0,m-10),p=Math.min(C0-1,m+10);let d=1e9;for(let u=f;u<=p;u++){const a=Ka[u],h=Ea[u],e=Ka[u+1]-a,o=Ea[u+1]-h,s=Ue(((t-a)*e+(n-h)*o)/Math.max(e*e+o*o,1e-9));d=Math.min(d,Math.hypot(t-a-e*s,n-h-o*s))}return d},Gs=2.05,Is=1.45,Ta=Gs+Is,is=(t,n)=>{const m=O.nearestXZ(t,n),f=m.u*U;O.pointAt(m.u,D),O.tangentAt(m.u,J);const p=((t-D.x)*-J.z+(n-D.z)*J.x)/(Math.hypot(J.x,J.z)||1);return!(!es(t,n,f,p)||oe(t,n)>.5||a0.some(d=>Math.hypot(d.x-t,d.z-n)<3.5)||pe.some(d=>Math.hypot(d.x-t,d.z-n)<d.R+2)||Ie.some(d=>Math.hypot(d.x-t,d.z-n)<4.4))},ua=o0.length;{const t=i0("spore-rain-short-twigs:"+F.seed),n=30,m=0,f=U*Ce,p=Math.round((f-m)/n*L(.6,1,st)),d=(u,a)=>{let h=1e9;for(const e of o0)for(let o=0;o+1<e.pts.length;o++){const s=e.pts[o],l=e.pts[o+1],i=l.x-s.x,c=l.z-s.z,g=Ue(((u-s.x)*i+(a-s.z)*c)/Math.max(i*i+c*c,1e-9));h=Math.min(h,Math.hypot(u-s.x-i*g,a-s.z-c*g))}return h};for(const u of[-1,1])for(let a=0,h=0,e=0;a<p;h++){if((h&3)===0&&await F.yield(),h===0&&(e=t.range(m,f)),h===20){a++,h=-1;continue}const o=e+t.range(-3,3),s=u*t.range(4.4,10.5),l=t.range(4,8),i=t.range(0,Math.PI),c=t.range(.85,1.2),g=t.range(-.3,.3),[r,w]=nt(o,s),b=[];let M=!0;for(let A=0;A<=5&&M;A++){const v=A/5-.5,y=i+g*v*2,C=r+Math.cos(y)*l*v,S=w+Math.sin(y)*l*v;(!is(C,S)||ma(C,S)<Ta||d(C,S)<3)&&(M=!1),b.push(lt(C,ft(C,S),S))}if(!M)continue;const x=(.09+.018*l)*c;for(const A of b)A.y+=x*.5;We.push(Te(b,10,6,A=>x*(1-.45*A)*Math.sqrt(Ue(Math.min(A,1-A)*14)),s0,(A,v,y)=>.14*H.n2(y*.35+(ua+a)*3+u,A*2))),o0.push({pts:b,r:x,len:l}),a++,h=-1}}const Na=[],Rt={R:1.25,pts:[],lat:9.6};{for(let s=0,l=0;s<9&&l<90;l++){const i=V.range(-70,70),c=(V.chance(.5)?1:-1)*V.range(15,60),g=V.range(12,26),r=V.range(0,Math.PI),w=V.range(.24,.5),b=V.range(-.3,.3),[M,x]=h0(i,c),A=[];let v=!0;for(let y=0;y<=5&&v;y++){const C=y/5-.5,S=r+b*C*2,B=M+Math.cos(S)*g*C,P=x+Math.sin(S)*g*C;(Ge(B,P,3)||v0(B,P)>.05||O.nearestXZ(B,P).dist<10||Math.hypot(B-f0[0],P-f0[1])<12||B<-225||B>265||P<-195)&&(v=!1),A.push(lt(B,D0(B,P)+w*.5,P))}v&&(We.push(Te(A,12,6,y=>w*(1-.45*y),s0,(y,C,S)=>.14*H.n2(S*.35+s*3+50,y*2))),s++)}await F.yield();const t=new k.Vector3,n=new k.Vector3,m=new k.Vector3,f=(s,l,i,c,g,r,w,b)=>{t.set(c,g,r).normalize();const M=V.range(0,Z);m.set(Math.cos(M),0,Math.sin(M)),m.addScaledVector(t,-m.dot(t)),m.lengthSq()<.01&&m.set(0,0,1),m.normalize(),n.crossVectors(m,t).normalize(),G.makeBasis(t,n,m).scale(mt.set(w,w*V.range(.7,1.3),w)),G.setPosition(s+t.x*w*.56,l+t.y*w*.56,i+t.z*w*.56),Na.push({m:G.clone(),c:b.clone()})},p=E("#D2B23E"),d=E("#7E9A3A"),u=s=>{const l=V();return Y.copy(s===0?re[Math.floor(l*re.length)%re.length]:l<.45?p:l<.8?d:re[0]).multiplyScalar(V.range(.8,1.2)),vt&&Y.lerp(de.copper,.5),Y},a=new k.Vector3,h=new k.Vector3;for(let s=0;s<6;s++){const l=Zt+13+s*15.5+V.range(-3,3),i=s%2?1:-1,c=V.range(.2,.8),g=V.range(2.6,4.2),r=V.range(2.4,4.4),w=V.range(.5,.72);if(l>U-26)continue;O.posAtDist(l,D),O.tangentAtDist(l,a),a.setY(0).normalize(),h.set(-a.z,0,a.x).multiplyScalar(i);const b=D.y-be,M=(y,C,S)=>lt(D.x+h.x*y+a.x*C,b+S,D.z+h.z*y+a.z*C),x=[M(2.9,0,-2.4),M(4.6,1.6*c,-1.3),M(6.6,3.4*c,-.5),M(10.2,6*c,g-.5),M(13.6,9*c,g+r-.5)];We.push(Te(x,14,6,y=>w*(1-.74*y),s0,(y,C,S)=>.12*H.n2(S*.4+s*7,y*2)));const A=new k.CatmullRomCurve3(x,!1,"centripetal"),v=7+s%3;for(let y=0;y<v;y++)A.getPoint(.52+.48*(y+V.range(.1,.9))/v,I),f(I.x,I.y-.1,I.z,h.x*V.range(-.3,.5)+a.x*V.range(-.4,.4),-1,h.z*V.range(-.3,.5)+a.z*V.range(-.4,.4),V.range(4.2,6.8),u(0))}await F.yield();const e=(s,l)=>{We.push(Te(s,30,6,c=>.3-.1*c,s0,(c,g,r)=>.1*H.n2(r*.3+s[0].x,c*2)));const i=new k.CatmullRomCurve3(s,!1,"centripetal");for(let c=0;c<l;c++){const g=.14+.74*(c+V.range(.15,.85))/l;i.getPoint(g,I);const r=V.range(0,Z),w=V.range(.15,.6);f(I.x,I.y-.15,I.z,Math.cos(r)*w,-1,Math.sin(r)*w,V.range(3.6,6.2),u(1))}},o=(s,l)=>D0(s,l)-.6;e([lt(-41,o(-41,46),46),lt(-42,8,38),lt(-40,16.5,26),lt(-36,19.5,13),lt(-32,15,1),lt(-29.5,6.5,-9),lt(-28.5,o(-28.5,-15),-15)],30),e([lt(40,o(40,30),30),lt(39,7,23),lt(35,14.5,13),lt(30,16.5,3),lt(26.5,10.5,-5),lt(25,o(25,-11),-11)],22);{const s=[14,-24],l=[_t.x,_t.z],i=[_t.z,-_t.x],c=(w,b,M)=>lt(s[0]+w*l[0]+b*i[0],M,s[1]+w*l[1]+b*i[1]),g=c(17,21,0),r=c(60,20,0);e([g.setY(o(g.x,g.z)),c(23,20,5),c(31,18,12.5),c(40,16.5,14.5),c(48,16.5,11),c(55,18,3),r.setY(o(r.x,r.z))],28)}await F.yield();{const s=Zt-24,l=Zt+32;for(let w=s;w<=l+.01;w+=4){const b=(w-s)/(l-s),M=Rt.lat+.6*Math.sin(b*5),[x,A]=nt(w,M);O.posAtDist(w,D);const v=xe(x,A),y=K(0,.18,b)*(1-K(.8,1,b));Rt.pts.push(lt(x,L(v-Rt.R-.4,Math.max(D.y-be+.5-Rt.R,v-Rt.R*.6),y),A))}Rt.curve=new k.CatmullRomCurve3(Rt.pts,!1,"centripetal"),Rt.len=Rt.curve.getLength();const i=Te(Rt.pts,44,14,w=>Rt.R*(1+.25*(1-K(0,.2,w))-.2*K(.75,1,w)),Xe,(w,b,M)=>.07*H.n3(w*1.3,M*.2,b*1.3)+.03*H.n3(w*4,M*.6,b*4)),c=[];for(const w of[.52,.7]){Rt.curve.getPointAt(w,I);const b=I.x+1.2,M=I.z+.8;c.push(Te([lt(I.x,I.y-.3,I.z),lt(I.x+.7,I.y-1.8,I.z+.5),lt(b,xe(b,M)-.8,M)],5,8,x=>.75-.25*x,Xe,null))}const g=kt([i,...c]);g.computeBoundingSphere();const r=se(g,rt(10,0,{variant:1,fibre:Rt.R,misc:[0,.6,1,0]}),"root",!0);Be.push({lo:r,hi:null,extra:null,c:g.boundingSphere.center.clone(),r:g.boundingSphere.radius,range:300,sw:0})}}await F.yield(),se(kt(We),rt(5,0,{variant:1,fibre:4}),"wood"),await F.yield();{const t=new k.InstancedMesh(d0(8,4),rt(2,1,{gloss:.45,sss:vt?1.3:1,fibre:15,misc:[.4,0,1,0]}),Na.length);Na.forEach((n,m)=>{t.setMatrixAt(m,n.m),t.setColorAt(m,n.c)}),t.name="hanging-leaves",He(t,7,190,null,4)}await F.yield();const Da=[];{const t=[],n=E("#C39A5E"),m=E("#7A4E24"),f=E("#E4D8B8"),p=E("#D6CAAC"),d=13;for(let h=0;h<d;h++){const e=(h+V.range(-.3,.3))/d*Z,o=f0[2]+V.range(2.4,3.9),s=V.range(2.6,5.4),l=V.range(1.5,2.5),i=V.range(.03,.14),c=V.range(0,Z),g=V.range(.3,.44),r=V.range(.85,1.15),w=V.range(.25,.5);if(h===4)continue;const b=f0[0]+Math.cos(e)*o,M=f0[1]+Math.sin(e)*o,x=new k.Matrix4().makeRotationAxis(new k.Vector3(Math.cos(c),0,Math.sin(c)),i).setPosition(b,D0(b,M)-.3,M);k0(t,{H:s,R:l,sr:g,top:n.clone().multiplyScalar(r),mid:m,gill:f,stalk:p,ng:18,dome:w,m:x,res:16}),Da.push([b,M,l+1.2,.4]),(h&3)===3&&await F.yield()}const u=kt(t);u.computeBoundingSphere();const a=se(u,Fa.mat,"ring-caps",!0);Be.push({lo:a,hi:null,extra:null,c:u.boundingSphere.center.clone(),r:u.boundingSphere.radius,range:150,sw:0});for(const h of N0)Da.push([h[0],h[1],h[2]*1.15,.3])}await F.yield();{const t=[],n=E("#DDDCD0"),m=E("#B9B6A6"),f=E("#E6E4DA"),p=E("#CFC9B8"),d=new k.Vector3,u=new k.Vector3,a=new k.Vector3,h=new k.Vector3,e=new k.Matrix4;let o=R.chance(.5)?1:-1;for(let s=Zt+12;s<U-33;s+=R.range(6.5,10)){o=-o,await F.yield();const l=R.chance(.4)?2:1;for(let i=0;i<l;i++){const c=s+i*R.range(2.5,4),g=R.range(-.15,.3),r=R.range(2.5,4.3)*(i?.75:1),w=R.range(2.4,7.2)*(i?.6:1)+1.2,b=R.range(.12,.34),M=R.range(-2.5,2.5);let x=R.range(8.8,12.6)+(i?1.5:0);for(O.posAtDist(c,D),O.tangentAtDist(c,d),d.setY(0).normalize(),u.set(-d.z,0,d.x).multiplyScalar(o);Math.hypot(x-r,w)<6.6;)x+=.5;a.copy(D).setY(D.y-be-Kt+Math.sin(g)*Kt).addScaledVector(u,Math.cos(g)*Kt*.96),h.copy(D).addScaledVector(u,x).addScaledVector(d,M).setY(D.y+w);const A=[a.x+(h.x-a.x)*.62,a.y+(h.y-a.y)*.22,a.z+(h.z-a.z)*.62],v=[a.x+(h.x-a.x)*.93,a.y+(h.y-a.y)*.7,a.z+(h.z-a.z)*.93],y=.12+.03*r;t.push(Me([[a.x,a.y,a.z],A,v,[h.x,h.y+.1*r,h.z]],[y*1.5,y,y*.9,y*1.1],p,8,3,.85,.9)),e.makeRotationAxis(d,o*b).setPosition(h.x,h.y,h.z),k0(t,{H:0,R:r,sr:0,top:n.clone().multiplyScalar(R.range(.9,1.05)),mid:m,gill:f,stalk:p,ng:26,dome:R.range(.3,.46),m:e.clone(),noStalk:!0,res:24})}}for(let s=0;s<12;s++){const l=s<4?V.range(.2,.34):V.range(.5,.8),i=s%2?1:-1,c=V.range(0,.42),g=V.range(.9,2.3),r=i>0?V.range(.75,1.25):V.range(.5,.72),w=V.range(.9,1.05),b=V.range(.3,.46),M=V.range(.1,.3);Rt.curve.getPointAt(l,D),Rt.curve.getTangentAt(l,d),d.setY(0).normalize(),u.set(-d.z,0,d.x).multiplyScalar(i);const x=i>0?1.9:1.15,A=Math.cos(c)*Rt.R,v=Math.sin(c)*Rt.R;a.copy(D).addScaledVector(u,A*.96).setY(D.y+v*.96),h.copy(D).addScaledVector(u,A+x).setY(D.y+v+g),t.push(Me([[a.x,a.y,a.z],[a.x+(h.x-a.x)*.7,a.y+(h.y-a.y)*.3,a.z+(h.z-a.z)*.7],[h.x,h.y+.05,h.z]],[.13,.085,.1],p,6,3,.85,.9)),e.makeRotationAxis(d,i*M).setPosition(h.x,h.y,h.z),k0(t,{H:0,R:r,sr:0,top:n.clone().multiplyScalar(w),mid:m,gill:f,stalk:p,ng:16,dome:b,m:e.clone(),noStalk:!0,res:16})}await F.yield();{const s=kt(t);s.computeBoundingSphere();const l=se(s,rt(1,0,{gloss:1.5,sss:.7,fibre:2.2,variant:0}),"porcelain",!0);Be.push({lo:l,hi:null,extra:null,c:s.boundingSphere.center.clone(),r:s.boundingSphere.radius,range:300,sw:0})}}await F.yield();const Ga=[];{const t=ut(14,2,!0,(h,e,o)=>{const s=h*Z,l=e*(1+.2*Math.sin(s*5+1)+.1*Math.sin(s*11))*(.6+.4*e);o.p[0]=Math.cos(s)*l,o.p[2]=Math.sin(s)*l,o.p[1]=.03+.1*Math.sin(e*Math.PI)+.09*e*e*Math.sin(s*7+2);const i=.5+.55*e;o.c[0]=i,o.c[1]=i,o.c[2]=i,o.a[0]=.55+.45*e,o.a[1]=.25}),n=Math.round(84*L(.6,1,st)),m=new k.InstancedMesh(t,rt(1,0,{gloss:.2,sss:.25,fibre:12}),n),f=[[],[],[]],p=new k.Vector3,d=new k.Vector3;Ga.length=0;const u=(h,e)=>{O.posAtDist(h,D),O.tangentAtDist(h,J),d.set(-J.z,0,J.x).normalize();const o=Math.sqrt(Kt*Kt-e*e);p.copy(d).multiplyScalar(e/Kt).addScaledVector(ht,o/Kt).normalize(),I.copy(D).addScaledVector(d,e).setY(D.y-be-Kt+o*(1+.02))};let a=0;for(let h=0;h<n;h++){const e=N.range(Zt+5,U-9),o=(N.chance(.5)?1:-1)*N.range(1.55,3.75),s=N.range(.45,1.25)*(N.chance(.2)?1.5:1),l=N(),i=N.range(.8,1.15);u(e,o),yt.setFromUnitVectors(ht,p).multiply(sa.setFromAxisAngle(ht,N.range(0,Z))),G.compose(I,yt,mt.set(s,s*N.range(.7,1.3),s)),m.setMatrixAt(a,G),l<.2?Y.setRGB(.78*i,.56*i,.14*i):l<.5?Y.setRGB(.62*i,.68*i,.6*i):Y.setRGB(.42*i,.52*i,.4*i),m.setColorAt(a,Y),a++}m.count=a,m.name="bough-lichen",He(m,12,150),await F.yield();for(let h=0;h<13;h++){const e=Zt+8+(U-20-Zt)*(h+N.range(.1,.9))/13,o=h%2?1:-1,s=N.range(2.1,3.1),l=N.range(2.2,4.2),i=Math.round(N.range(34,58)*L(.5,1,st));for(let c=0;c<i;c++){const g=N.gauss?N.gauss():N.range(-1,1),r=e+g*l*.5,w=o*Math.min(3.8,Math.max(1.5,s+N.range(-.9,.9))),b=N.range(.34,.7),M=N.range(.5,.86),x=N.range(0,Z),A=N();r<Zt+4||r>U-8||(u(r,w),yt.setFromUnitVectors(ht,p.lerp(ht,.4).normalize()).multiply(sa.setFromAxisAngle(ht,x)),G.compose(I,yt,mt.set(b,b*.95,b)),A<.06?Y.setRGB(M*1.15,M*1.05,M*.5):Y.setRGB(M*.72,M,M*.5),f[Math.min(2,Math.floor((r-Zt)/(U-Zt)*3))].push({m:G.clone(),c:Y.clone()}))}Ga.push([e,o,s,l])}Ze(f,"bough-moss",90,0,null,null,Ba,rt(1,1,{gloss:.3,sss:.5,fibre:14,variant:2,misc:[.03,0,1,90]}))}await F.yield();{const t=ut(10,3,!1,(o,s,l)=>{const i=o*Math.PI,c=s*(1+.09*Math.sin(i*5)+.05*Math.sin(i*11));l.p[0]=Math.cos(i)*c,l.p[2]=Math.sin(i)*c*.85-.08,l.p[1]=.16*(1-s)+.05*Math.sin(i*6)*s-.12*s*s,l.c[0]=l.c[1]=l.c[2]=1,l.a[0]=s,l.a[1]=o}),n=114,m=new k.InstancedMesh(t,rt(3,0,{gloss:.3,sss:.15,variant:1}),n),f=new k.Vector3,p=new k.Vector3,d=new k.Vector3;let u=0;const a=(o,s,l)=>{p.copy(s).setY(0).normalize(),f.crossVectors(ht,p).normalize(),G.makeBasis(f,ht,p).scale(mt.set(l,l*z.range(.7,1.3),l)).setPosition(o),m.setMatrixAt(u,G),m.setColorAt(u,Y.setRGB(z(),z.range(.45,.8),0)),u++};for(let o=0;o<64;o++){const s=o%16,l=L(-.3,Math.PI+.3,(s+z.range(.1,.9))/16),i=o%3===0;if(d.copy(Pe).multiplyScalar(Math.cos(l)).addScaledVector(ht,Math.sin(l)),i){const c=z.range(8.3,10.2);I.copy(Ve).addScaledVector(d,c).addScaledVector(me,rs(l,c)-.1),a(I,J.copy(me).negate().addScaledVector(Pe,Math.cos(l)*.5),z.range(1.3,2.4))}else{const c=z.range(.6,7)+os(l)*.55+1;I.copy(Ve).addScaledVector(d,A0+.05).addScaledVector(me,c),J.copy(Pe).multiplyScalar(Math.cos(l)>=0?1:-1).addScaledVector(me,-.9*Math.abs(Math.sin(l))),a(I,J,z.range(1.6,3.4)*(1-.3*Math.abs(Math.sin(l))))}}for(let o=0;o<32;o++){const s=z.range(Zt+8,U-12),l=z.chance(.5)?1:-1,i=z.range(-.1,.5);O.posAtDist(s,D),O.tangentAtDist(s,J),d.set(-J.z,0,J.x).normalize().multiplyScalar(l),I.copy(D).setY(D.y-be-Kt+Math.sin(i)*Kt).addScaledVector(d,Math.cos(i)*Kt*.97),a(I,d,z.range(1,2.2))}for(let o=0;o<18;o++){const s=V.range(.28,.8),l=V.range(-.55,.32),i=V.range(.7,1.25),c=V.range(.7,1.3),g=V(),r=V.range(.45,.8);Rt.curve.getPointAt(s,D),Rt.curve.getTangentAt(s,J),d.set(J.z,0,-J.x).normalize(),I.copy(D).addScaledVector(d,Math.cos(l)*Rt.R*.97).addScaledVector(ht,Math.sin(l)*Rt.R*.97),p.copy(d),f.crossVectors(ht,p).normalize(),G.makeBasis(f,ht,p).scale(mt.set(i,i*c,i)).setPosition(I),m.setMatrixAt(u,G),m.setColorAt(u,Y.setRGB(g,r,0)),u++}m.count=u,m.name="brackets",m.frustumCulled=!1,Ct.add(m);const h=E("#84857E"),e=.7;d.copy(Pe).multiplyScalar(-Math.cos(e)).addScaledVector(ht,Math.sin(e)),I.copy(Ve).addScaledVector(d,A0+.2).addScaledVector(me,3.2),p0.push(ut(14,8,!0,(o,s,l)=>{const i=o*Z,c=s*Math.PI*.5,g=.8+.2*Math.sin(s*26),r=2.6*Math.sin(c+.15)*g;l.p[0]=I.x+Math.cos(i)*r,l.p[1]=I.y+2.2*Math.cos(c)-1.2*(1-s)*0-.4,l.p[2]=I.z+Math.sin(i)*r;const w=.7+.3*Math.sin(s*26+1);l.c[0]=h.r*w,l.c[1]=h.g*w,l.c[2]=h.b*w,l.a[0]=.6+.4*(1-s),l.a[1]=.5}))}await F.yield();{const t=E("#6A3E1E"),n=E("#9A6A38"),m=E("#B79A6A"),f=ut(6,6,!0,(e,o,s)=>{const l=e*Z,i=.5+.5*Math.cos(3*l),g=.3*Math.pow(Math.max(Math.sin(Math.PI*Math.pow(.12+.88*o,.7)),0),.9)*(.42+.58*Math.pow(i,1.3));s.p[0]=Math.cos(l)*g,s.p[1]=Math.sin(l)*g+.16,s.p[2]=-.45+o;const r=.8+.3*i,w=1-K(0,.14,o);s.c[0]=L(L(t.r,n.r,i*i)*r,m.r,w),s.c[1]=L(L(t.g,n.g,i*i)*r,m.g,w),s.c[2]=L(L(t.b,n.b,i*i)*r,m.b,w),s.a[0]=.6+.4*i,s.a[1]=1-.6*w}),p=E("#B98F5A"),d=E("#6E4A2A"),u=ut(6,7,!0,(e,o,s)=>{const l=e*Z,i=(o*6+e*2)%1,c=.3*Math.pow(Math.max(Math.sin(Math.PI*Math.pow(.03+.97*o,.8)),0),.8)*(1+.1*i);s.p[0]=Math.cos(l)*c,s.p[1]=Math.sin(l)*c+.22,s.p[2]=-.5+o;const g=K(.55,1,i);s.c[0]=L(p.r,d.r,g),s.c[1]=L(p.g,d.g,g),s.c[2]=L(p.b,d.b,g),s.a[0]=.75+.25*Math.sin(l),s.a[1]=.55}),a=rt(1,0,{gloss:1.1,fibre:6}),h=(e,o,s,l,i,c)=>{const g=new k.InstancedMesh(e,a,o);let r=0;for(let w=0;r<o&&w<o*5;w++){const b=z.range(2,U*Ne-14),[M,x]=nt(b,(z.chance(.5)?1:-1)*(1.2+15*Math.pow(z(),1.5)));if(Math.hypot(M,x)<18||oe(M,x)>.6)continue;const A=z.range(l,i),v=c(A);St.set(z.range(-.25,.25),z.range(0,Z),z.range(0,Z),"YXZ"),G.compose(I.set(M,ft(M,x)+.1,x),yt.setFromEuler(St),mt.set(v,v,A)),g.setMatrixAt(r,G);const y=z.range(.7,1.25);g.setColorAt(r,Y.setRGB(y,y,y)),r++}g.count=r,g.name=s,He(g,8,170)};h(f,Math.round(130*L(.6,1,st)),"nuts",1.6,2.3,e=>e*.95),h(u,Math.round(90*L(.6,1,st)),"buds",2.4,3.4,()=>z.range(.9,1.25))}await F.yield();{const t=E("#CDBFA6"),n=E("#7E6B58"),m=[we([[0,0,0],[.03,.3,.012],[.05,.6,0],[.045,.87,-.01]],.02,n,.5,!0)];m.push(ze(9,4,e=>[.2*Math.pow(e,.62)*(1+.22*e*e*e),.8+.32*(1-Math.pow(e,1.5))],(e,o,s,l)=>{const i=Math.round(e*9)%2?.6:1,c=L(1,i,K(.25,1,o))*(.8+.2*o),g=1-K(0,.3,o);s.c[0]=L(t.r*c,n.r*1.3,g*.6),s.c[1]=L(t.g*c,n.g*1.2,g*.6),s.c[2]=L(t.b*c,n.b,g*.6),s.a[0]=1,s.a[1]=1}));const f=260,p=new k.InstancedMesh(kt(m),rt(1,1,{gloss:.5,sss:.95,fibre:26,misc:[.16,0,1,0]}),f+80);let d=0;const u=(e,o,s,l,i,c=.25)=>{d>=f||(St.set(z.range(-c,c),z.range(0,Z),z.range(-c,c)),G.compose(I.set(e,o,s),yt.setFromEuler(St),mt.set(l*z.range(.9,1.4),l,l*z.range(.9,1.4))),p.setMatrixAt(d,G),p.setColorAt(d,i),d++)},a=new k.Color;for(let e=Zt+7;e<U-9;e+=z.range(4,6.5)){const o=z.chance(.5)?1:-1,s=z.int(3,6);for(let l=0;l<s;l++){const i=e+z.range(-2.4,2.4),c=z.range(3.62,3.95);O.posAtDist(i,D),O.tangentAtDist(i,J);const g=-J.z,r=J.x,w=Math.hypot(g,r)||1,b=z.range(.8,1.15);u(D.x+g/w*c*o,D.y-be-Kt+Math.sqrt(Kt*Kt-c*c)-.15,D.z+r/w*c*o,z.range(1.4,2.5),a.setRGB(b,b,b*z.range(.9,1.05)),.3)}}const h=Math.round(24*qt);for(let e=0,o=0;e<h&&o<200;o++){const s=z.range(8,U*Ce),l=(z.chance(.5)?1:-1)*z.range(6.5,15),[i,c]=nt(s,l);if(c<Ft+8&&c>Tt-8||oe(i,c)>.5||l>0&&ha(s)||a0.some(r=>Math.hypot(r.x-i,r.z-c)<3.5)||pe.some(r=>Math.hypot(r.x-i,r.z-c)<r.R+2))continue;const g=z.int(4,8);for(let r=0;r<g;r++){const w=i+z.range(-2.6,2.6),b=c+z.range(-2.6,2.6),M=z.range(.75,1.15);O.nearestXZ(w,b).dist<5.6||u(w,ft(w,b)-.1,b,z.range(1.9,3.6),a.setRGB(M,M,M))}e++}for(let e=0;e<14;e++){const o=z.range(-7,7),s=z.range(.4,6);u(Ve.x+me.x*s+Pe.x*o,Ve.y+Math.sqrt(A0*A0-o*o)-.3,Ve.z+me.z*s+Pe.z*o,z.range(2.4,3.8),a.setRGB(1.5,1.75,2.3),.45)}{const e=i0("spore-rain-fifth-b:"+F.seed),o=d+80;for(let s=Zt+9;s<U-12&&d<o;s+=e.range(7,11)){const l=e.chance(.5)?1:-1,i=e.int(4,7),c=e.range(2.5,3.2);for(let g=0;g<i&&d<o;g++){const r=s+e.range(-1.3,1.3),w=l*(c+e.range(-.35,.35)),b=e.range(.85,1.2),M=e.range(.8,1.7);O.posAtDist(r,D),O.tangentAtDist(r,J);const x=-J.z,A=J.x,v=Math.hypot(x,A)||1;St.set(e.range(-.25,.25),e.range(0,Z),e.range(-.25,.25)),G.compose(I.set(D.x+x/v*w,D.y-be-Kt+Math.sqrt(Kt*Kt-w*w)-.08,D.z+A/v*w),yt.setFromEuler(St),mt.set(M*1.15,M,M*1.15)),p.setMatrixAt(d,G),p.setColorAt(d,a.setRGB(b,b*.97,b*.9)),d++}}}p.count=d,p.name="bonnets",He(p,9,230)}await F.yield();const ls=[],cs=12,hs=32,qs=100;{const t=E("#CDBFA6"),n=E("#7E6B58"),m=[[0,0,0],[.03,.3,.012],[.05,.6,0],[.045,.87,-.01]],f=w=>ut(1,1,!1,(b,M,x)=>{const A=w[M>.5?w.length-1:0],v=(b-.5)*.045*(1-.5*M);x.p[0]=A[0]+v,x.p[1]=A[1],x.p[2]=A[2]+v*.6,x.c[0]=n.r,x.c[1]=n.g,x.c[2]=n.b,x.a[0]=M,x.a[1]=-1.5}),p=(w,b,M,x=!1,A=null)=>kt([x?f(M):we(M,.02,n,.5,!0),ze(w,b,v=>{const y=A?A(v):v;return[.2*Math.pow(y,.62)*(1+.22*y*y*y),.8+.32*(1-Math.pow(y,1.5))]},(v,y,C,S)=>{const B=A?A(y):y,P=Math.round(v*9)%2?.6:1,T=L(1,P,K(.25,1,B))*(.8+.2*B),_=1-K(0,.3,B);C.c[0]=L(t.r*T,n.r*1.3,_*.6),C.c[1]=L(t.g*T,n.g*1.2,_*.6),C.c[2]=L(t.b*T,n.b,_*.6),C.a[0]=1,C.a[1]=1})]),d=p(18,5,m),u=p(9,2,[m[0],m[3]],!1,w=>w*w),a=p(5,1,[m[0],m[3]],!0,w=>.25+.75*w);await F.yield();const e=rt(1,1,{gloss:.5,sss:.95,fibre:26,misc:[.16,0,1,96]}),o=L(.6,1,st),s=new k.Vector3,l=new k.Vector3,i=new k.Vector3,c=new k.Quaternion,g=new k.Color,r={twigs:o0.length,withTroops:0,metres:0,tufts:0,bells:0,within8:0,nearest:1e9,leftOutByRoute:0,shortTwigs:o0.length-ua,shortBells:0,shortWithin8:0,shortNearest:1e9,shortList:[]};for(let w=0;w<o0.length;w++){await F.yield();const b=o0[w],M=i0("spore-rain-twig-troop:"+w+":"+F.seed),x=new k.CatmullRomCurve3(b.pts,!1,"centripetal"),A=x.getLength(),v=[];r.metres+=A;for(let B=M.range(.3,2.4);B<A-.3;){const P=M.int(3,9),T=.32+.11*P,_=M(),X=M.chance(.5)?1:-1,Q=M()<o,tt=M();let ct=0;for(let at=0;at<P;at++){const Mt=((at+M.range(.1,.9))/P-.5)*2*T,j=M(),W=M(),et=M(),it=M.range(.05,.36),$=M.range(-.7,.7),bt=M.range(0,Z),zt=M.range(.78,1.15),Et=M.range(.9,1.4),Ht=M.range(.9,1.4),Ut=M.range(.9,1.05);if(!Q)continue;const ce=Ue((B+T+Mt)/A),ye=b.r*(1-.45*ce);x.getPointAt(ce,s),x.getTangentAt(ce,l);const Ee=Math.hypot(l.x,l.z)||1,Fe=l.x/Ee,Qe=l.z/Ee,$e=-Qe,Je=Fe,Re=_<.45||_>.8&&j<.5,ue=Re?(W*2-1)*.7*ye:X*(ye+.2+1.8*W*W),r0=ue<0?-1:1,ge=s.x+$e*ue,he=s.z+Je*ue,Ha=Re?s.y+Math.sqrt(Math.max(ye*ye-ue*ue,0))-.07:ft(ge,he)-.1,W0=1.5+1.5*et,X0=W0/1.12,P0=$e*r0+Fe*$,ba=Je*r0+Qe*$,wa=Math.hypot(P0,ba)||1;if(i.set(P0/wa*Math.sin(it),Math.cos(it),ba/wa*Math.sin(it)),!is(ge,he))continue;const Y0=ma(ge,he),Wa=ma(ge+i.x*W0,he+i.z*W0);if(Y0<Ta||Wa<Ta){r.leftOutByRoute++;continue}G.compose(I.set(ge,Ha,he),yt.setFromUnitVectors(ht,i).multiply(c.setFromAxisAngle(ht,bt)),mt.set(X0*Et,X0,X0*Ht)),v.push({m:G.clone(),c:g.setRGB(zt,zt,zt*Ut).clone()}),ct++,r.bells++,Y0<8&&r.within8++,r.nearest=Math.min(r.nearest,Y0,Wa),w>=ua&&(r.shortBells++,Y0<8&&r.shortWithin8++,r.shortNearest=Math.min(r.shortNearest,Y0,Wa))}ct&&r.tufts++,B+=2*T+(.2+2.4*tt*tt)/qt}if(w>=ua){const B=b.pts[3],P=O.nearestXZ(B.x,B.z);O.pointAt(P.u,D),O.tangentAt(P.u,J),r.shortList.push({u:P.u,side:(B.x-D.x)*-J.z+(B.z-D.z)*J.x<0?-1:1,near:Math.min(...b.pts.map(T=>ma(T.x,T.z))),len:b.len,bells:v.length})}if(!v.length)continue;r.withTroops++;const y=e0(d,e,v,"twig-bonnets"),C=e0(u,e,v,"twig-bonnets"),S=e0(a,e,v,"twig-bonnets");y.matrixAutoUpdate=C.matrixAutoUpdate=S.matrixAutoUpdate=!1,ls.push({near:y,mid:C,far:S,c:S.boundingSphere.center.clone(),r:S.boundingSphere.radius})}r.nearest=r.bells?Math.round(r.nearest*100)/100:-1,r.metres=Math.round(r.metres),r.shortNearest=r.shortBells?Math.round(r.shortNearest*100)/100:-1,Ct.userData.twigTroops=r}await F.yield();{const t=i0("spore-rain-fifth:"+F.seed),n=new k.Vector3,m=new k.Vector3,f=new k.Vector3,p=new k.Vector3,d=(c,g)=>{O.posAtDist(c,D),O.tangentAtDist(c,f),f.setY(0).normalize(),m.set(-f.z,0,f.x);const r=Math.sqrt(Math.max(.01,Kt*Kt-g*g));return n.copy(m).multiplyScalar(g/Kt).addScaledVector(ht,r/Kt).normalize(),I.copy(D).addScaledVector(m,g).setY(D.y-be-Kt+r)},u=E("#D6A02A"),a=E("#B55A1A"),h=E("#A9A866"),e=E("#D3C283"),o=E("#7E4320"),s=E("#C98A45"),l=E("#5E4630"),i=[[Zt+1.5,-2.6,10,1.25],[Zt+27,2.8,8,.9],[Zt+46,-2.8,9,.95],[Zt+62,2.9,7,.8],[U-22.5,-2.9,8,.85]];for(const c of i){const g=[],r=c[3];d(c[0],c[1]);const w=I.x,b=I.y-.14,M=I.z,x=n.x,A=n.z;for(let C=0;C<c[2];C++){const S=t.range(0,Z),B=Math.sqrt(t()),P=C>=c[2]-2,T=(P?t.range(.45,.7):t.range(1,2.1)*(1-.3*B))*r,_=(P?t.range(.22,.3):t.range(.42,.74))*r,X=Math.cos(S)+x*.7,Q=Math.sin(S)+A*.7,tt=Math.hypot(X,Q)||1,ct=new k.Matrix4().makeRotationAxis(p.set(Q/tt,0,-X/tt),.1+.5*B+t.range(0,.12)).setPosition(w+Math.cos(S)*B*.42*r,b,M+Math.sin(S)*B*.42*r);k0(g,{H:T,R:_,sr:.07*r+.05*_,top:u.clone().multiplyScalar(t.range(.85,1.12)),mid:a,gill:h,stalk:e,ng:10,dome:P?t.range(.8,1):t.range(.42,.64),m:ct,res:12,sn:7,sv:5})}await F.yield();for(let C=0;C<2;C++){const S=t.range(1.5,2.3),B=c[0]+(C?1:-1)*t.range(3.2,5.5),P=c[1]+t.range(-.25,.35)*Math.sign(c[1]);d(B,P);const T=[n.x,n.z],_=t.range(-.5,.5),X=T[0]*Math.cos(_)+f.x*Math.sin(_),Q=T[1]*Math.cos(_)+f.z*Math.sin(_),tt=(at,Mt,j)=>[I.x+X*at*S+f.x*j*S,I.y-.1+Mt*S,I.z+Q*at*S+f.z*j*S],ct=[tt(0,0,0),tt(.16,.36,.04),tt(.3,.66,-.05),tt(.52,.98,.03)];g.push(Me(ct,[.085*S,.06*S,.045*S,.03*S],l,5,2,.8,.4));for(let at=1;at<4;at++){const Mt=at%2?1:-1,j=(at===3?.62:.5)*S,W=at===3?p.set(X*.5,1,Q*.5):p.set(X*.35+f.x*Mt*.8,.85,Q*.35+f.z*Mt*.8);yt.setFromUnitVectors(ht,W.normalize());const et=new k.Matrix4().compose(I.set(ct[at][0],ct[at][1],ct[at][2]),yt,mt.set(1,1,1));g.push({m:et,g:ze(6,5,it=>[.1*j*Math.sin(Math.PI*Math.pow(it,.62))*(1-.45*it)+.008,j*it],(it,$,bt)=>{const zt=(Math.floor($*7+it*2)%2?.8:1.05)*(.8+.3*$);bt.c[0]=L(o.r,s.r,$*$)*zt,bt.c[1]=L(o.g,s.g,$*$)*zt,bt.c[2]=L(o.b,s.b,$*$)*zt,bt.a[0]=.7+.3*$,bt.a[1]=1.2})})}}const v=kt(g);v.computeBoundingSphere();const y=se(v,Fa.mat,"bough-tuft",!0);Be.push({lo:y,hi:null,extra:null,c:v.boundingSphere.center.clone(),r:v.boundingSphere.radius,range:105,sw:0}),await F.yield()}{const c=E("#8A5A3C"),g=E("#3F7A22"),r=E("#6E9A2E"),w=E("#8FAA34"),b=[Me([[0,-.05,0],[.035,.45,.02],[0,.9,0]],[.042,.03,.028],c,5,2,1,.5,(x,A,v,y)=>{v.c[0]=L(c.r,g.r,y*y),v.c[1]=L(c.g,g.g,y*y),v.c[2]=L(c.b,g.b,y*y),v.a[0]=.4+.45*y,v.a[1]=.5})];for(const x of[-1,1])b.push(ut(6,2,!1,(A,v,y)=>{const C=(A-.5)*2.75,S=.5*v*(1-.1*Math.cos(C*2.2));y.p[0]=x*(.03+Math.cos(C)*S),y.p[2]=Math.sin(C)*S,y.p[1]=.9+.16*v-.12*v*v+.09*Math.abs(Math.sin(C))*v*v;const B=.75+.3*Math.cos(C*6)*v*.3+.25*v;y.c[0]=L(g.r,r.r,v*v)*B,y.c[1]=L(g.g,r.g,v*v)*B,y.c[2]=L(g.b,r.b,v*v)*B,y.a[0]=.86+.14*v,y.a[1]=1.1})),b.push(ut(4,2,!1,(A,v,y)=>{const C=(v-.5)*2,S=.15*Math.sin(Math.PI*Math.pow(A,.75));y.p[2]=x*(.02+.42*A),y.p[0]=S*C,y.p[1]=.93+.3*A-.1*A*A+.06*Math.abs(C)*Math.sin(Math.PI*A);const B=C===0?.78:1;y.c[0]=w.r*B,y.c[1]=w.g*B,y.c[2]=w.b*B,y.a[0]=.92+.08*A,y.a[1]=1.1}));const M=[];for(const x of Ga){if(x[0]<Zt+14||x[0]>U-15)continue;const A=t.int(3,5);for(let v=0;v<A;v++){const y=x[0]+t.range(-.5,.5)*x[3],C=x[1]*Math.min(3.5,Math.max(2.5,x[2]+t.range(-.4,.7))),S=t.range(.8,1.3),B=t.range(.8,1.2),P=t();d(y,C),yt.setFromUnitVectors(ht,n.lerp(ht,.7).normalize()).multiply(sa.setFromAxisAngle(ht,t.range(0,Z))),G.compose(I.setY(I.y-.05),yt,mt.set(S,S*t.range(.85,1.1),S)),P<.14||vt?Y.setRGB(1.5*B,.95*B,.6*B):Y.setRGB(B,B,B),M.push({m:G.clone(),c:Y.clone()})}}if(M.length){const x=e0(kt(b),rt(1,1,{gloss:.5,sss:.9,fibre:9,misc:[.05,0,1,0]}),M,"seedlings");Ct.remove(x),He(x,12,120)}}}await F.yield();{const t=E("#3F7032"),n=[],m=14;for(let u=0;u<7;u++){const a=u/7*Z+z.range(-.3,.3),h=Math.cos(a),e=Math.sin(a),o=z.range(.85,1.25);let s=0,l=0;const i=[];for(let r=0;r<=m;r++){const w=r/m,b=L(1.3,-.55*o,w);i.push([s,l,w,b]),s+=Math.cos(b)/m,l+=Math.sin(b)/m}const c=r=>.2*Math.pow(Math.max(Math.sin(Math.PI*Math.min(1,r*1.02+.04)),0),.55)*K(.02,.14,r),g=(r,w,b,M,x,A)=>n.push(r*h-e*b,w,r*e+h*b,t.r*M,t.g*M,t.b*M,x,A);for(let r=0;r<m;r++){const w=i[r],b=i[r+1],M=(w[2]+b[2])*.5,x=c(w[2]),A=c(b[2]),v=c(M);for(const y of[-1,1]){const C=w[1]-.12*x,S=b[1]-.12*A,B=.42*x*y,P=.42*A*y;g(w[0],w[1],0,.6,w[2],.4),g(b[0],b[1],0,.6,b[2],.4),g(b[0],S,P,.86,b[2],.45),g(w[0],w[1],0,.6,w[2],.4),g(b[0],S,P,.86,b[2],.45),g(w[0],C,B,.86,w[2],.45);const T=L(w[0],b[0],.6)+Math.cos(w[3])*v*.2,_=L(w[1],b[1],.6)+Math.sin(w[3])*v*.2-.34*v;g(w[0],C,B,.86,w[2],.45),g(b[0],S,P,.86,b[2],.45),g(T,_,v*y,1.22,M,.5)}}}await F.yield();const f=34,p=new k.InstancedMesh(j0(n),rt(1,1,{gloss:.5,sss:.9,fibre:30,misc:[1.6,0,1,0]}),f);let d=0;await F.yield();for(let u=0;d<9&&u<300;u++){const a=R.range(30,U*.93),h=(R.chance(.5)?1:-1)*R.range(46,80),e=R.range(34,46),o=R.range(0,Z),s=R.range(.9,1.25),[l,i]=nt(a,h);Math.hypot(l,i)<62||O.nearestXZ(l,i).dist<45||oe(l,i)>0||!Ca(l,i,a,h)||i>60&&Math.abs(l)<16+(430-i)*.27||h>0&&a>ie-70&&a<ie+60||Ie.some(c=>Math.hypot(c.x-l,c.z-i)<30)||I0.some(c=>Math.hypot(c[0]-l,c[1]-i)<c[2]*1.6+20)||(G.compose(I.set(l,xe(l,i)-1,i),yt.setFromAxisAngle(ht,o),mt.set(e,e,e)),p.setMatrixAt(d,G),p.setColorAt(d,Y.setRGB(1,s,1)),d++)}await F.yield();for(let u=0;d<f-3&&u<300;u++){const a=z.range(-20,U*.95),h=(z.chance(.5)?1:-1)*z.range(75,190),[e,o]=nt(a,h);if(Math.hypot(e,o)<70||O.nearestXZ(e,o).dist<70)continue;const s=z.chance(.4),l=z.range(36,52);G.compose(I.set(e,xe(e,o)-1,o),yt.setFromAxisAngle(ht,z.range(0,Z)),mt.set(l,l*(s?.6:1),l)),p.setMatrixAt(d,G),p.setColorAt(d,s?Y.setRGB(3.4,1,.5):Y.setRGB(1,z.range(.9,1.2),1)),d++}for(const u of[[36,46,40,0],[70,-66,42,1],[120,6,50,0]]){if(d>=f)break;const a=Le.x+_t.x*u[0]-_t.z*u[1],h=Le.z+_t.z*u[0]+_t.x*u[1];G.compose(I.set(a,xe(a,h)-1,h),yt.setFromAxisAngle(ht,u[0]),mt.set(u[2],u[2]*(u[3]?.6:1),u[2])),p.setMatrixAt(d,G),p.setColorAt(d,u[3]?Y.setRGB(3.4,1,.5):Y.setRGB(1,1.1,1)),d++}await F.yield();for(let u=0;u<d;u++)if(p.getMatrixAt(u,G),Va.some(a=>Math.hypot(G.elements[12]-a[0],G.elements[14]-a[1])<a[2]*1.5+12)){const a=G.elements[12],h=G.elements[13],e=G.elements[14];p.setMatrixAt(u,G.makeScale(0,0,0).setPosition(a,h,e))}p.count=d,p.name="ferns",He(p,5,900,null,3)}await F.yield();const B0=Vt==="slug",$t=new k.Group;$t.name="snail";const Ye=new k.Vector3,fs=[];{const[t,n]=nt(ie,12.5);O.posAtDist(ie-7,D),Ye.set(D.x-t,0,D.z-n).normalize(),$t.position.set(t,ft(t,n)-.08,n),$t.rotation.y=Math.atan2(Ye.x,Ye.z);const m=E(B0?"#6E5E4C":"#8E866F"),f=E("#2A241C"),p=E("#B9B29A"),d=c=>.95*Math.pow(Math.sin(Math.PI*(.02+.92*Math.pow(c,.75))),.55),u=B0?-5.6:-4,a=3.5,h=[ut(14,26,!0,(c,g,r)=>{const w=c*Z,b=Math.sin(w),M=Math.cos(w),x=g,A=L(u,a,x),v=d(x),y=(.3+.75*K(.05,.4,x))*(1-.25*K(.75,1,x))*(B0?1.15:1),C=Math.pow(K(.7,1,x),1.5)*1;r.p[0]=v*M*(b<0?1.14:1),r.p[1]=C+y*(b>0?b:.15*b)+.03,r.p[2]=A;const S=H.n3(M*3,A*2.2,b*3)*.5+.5,B=B0?K(.55,.7,H.n3(M*1.6+5,A*.9,b*1.6)*.5+.5)*(b>-.1?1:0):0,P=b>.6&&!B0?.35*K(.6,.95,b):0,T=(.7+.4*S)*(1-P)*(1-.75*B),_=b<0?1:0;r.c[0]=L(m.r*T,p.r,_*.5),r.c[1]=L(m.g*T,p.g,_*.5),r.c[2]=L(m.b*T,p.b,_*.5),r.a[0]=b<0?.45:.7+.3*b,r.a[1]=1.7})],e=1+.6,o=a-.35;for(const c of[-1,1])h.push(we([[c*.3,e-.5,o],[c*.42,e-.62,o+.3],[c*.5,e-.78,o+.52]],.09,m,0,!1));const s=new k.Mesh(kt(h),rt(1,3,{gloss:1,sss:.3,fibre:5}));s.frustumCulled=!1,$t.add(s);const l=rt(1,0,{gloss:1,sss:.3,fibre:6});for(const c of[-1,1]){const g=kt([we([[0,0,0],[0,.45,0],[0,.9,0],[0,1.35,0],[0,1.72,0]],.15,m,1.6,!1),It([0,1.78,0],[.13,.13,.13],f,6,4,1,2.5)]),r=new k.Mesh(g,l);r.position.set(c*.3,e-.12,o-.25),r.frustumCulled=!1,$t.add(r),fs.push({m:r,sd:c,base:new k.Vector3(c*.5,.72,.5).normalize()})}if(!B0){const c=E(Vt==="pink"?"#D49A86":Vt==="brown"?"#C08A3C":"#E6C63E"),g=3.1,r=.97,w=.1255,b=Math.PI/2+.5,M=ut(18,92,!0,(v,y,C)=>{const S=y,B=(1-S)*g*Z,P=b-B,T=r*Math.exp(-w*B),_=.9*T*(1+.07*K(.975,1,S)),X=v*Z,Q=Math.cos(X),tt=Math.sin(X),ct=Math.cos(P),at=Math.sin(P);C.p[0]=.62*(r-T)+_*tt,C.p[1]=(T+_*Q)*ct,C.p[2]=(T+_*Q)*at;const Mt=1-.55*K(.985,1,S);C.c[0]=c.r*Mt,C.c[1]=c.g*Mt,C.c[2]=c.b*Mt,C.a[0]=(v+.5)%1,C.a[1]=S*3}),x=new k.Mesh(M,rt(3,0,{gloss:1,variant:0,misc:[0,0,Vt==="pink"?0:Vt==="brown"?.6:1,0]}));x.frustumCulled=!1;const A=new k.Group;A.position.set(-.25,1.92,-.5),A.add(x),$t.add(A),$t.userData.pivot=A}Ct.add($t);const i=E("#2B2A22");p0.push(ut(1,18,!1,(c,g,r)=>{const w=3.2+g*36,b=2.2*Math.sin(g*2.4)+(c-.5)*1.5,M=t-Ye.x*w+Ye.z*b,x=n-Ye.z*w-Ye.x*b;r.p[0]=M,r.p[1]=ft(M,x)+.09,r.p[2]=x,r.c[0]=i.r,r.c[1]=i.g,r.c[2]=i.b,r.a[0]=1,r.a[1]=3.2}))}await F.yield();const q={nM:pt?5:3,nSeg:pt?11:30,segLen:.3,gap:pt?6.5:.7};{const t=E("#E6E2D6"),n=E(pt?"#9A8460":"#6E7890"),m=pt?.62:.46,f=pt?.42:q.segLen;q.segLen=f,q.R=m,q.plate=pt?.8:f*1.12;const p=(e,o,s)=>{const l=e*Z-.9817,i=Math.sin(l),c=Math.cos(l),g=e*16<13.01||e>.999,r=g?o:.84;return s[0]=Math.sign(c)*Math.pow(Math.abs(c),.8)*m*1.25*r,s[1]=i>=0?Math.pow(i,.9)*m*r:i*m*(g?.75*r:.6),g?Math.max(i,0):-1},d=(e,o,s)=>ut(16,2,!0,(l,i,c)=>{const g=Math.cos(i*Math.PI*.5),r=p(l,s,c.p);c.p[0]*=g,c.p[1]=.12*m+(c.p[1]-.12*m)*g,c.p[2]=e+o*Math.sin(i*Math.PI*.5),c.c[0]=n.r,c.c[1]=n.g,c.c[2]=n.b,c.a[0]=r<0?.5:.62+.2*r,c.a[1]=r<0?.1:.75}),u=pt?[ut(16,3,!0,(e,o,s)=>{const l=p(e,1.08-.22*o+.04*Math.sin(Math.PI*o),s.p);s.p[2]=(o-.5)*q.plate,s.c[0]=n.r,s.c[1]=n.g,s.c[2]=n.b,s.a[0]=l<0?.5:.72+.28*l,s.a[1]=l<0?.1:1})]:[ut(9,3,!0,(e,o,s)=>{const l=e*Z,i=m*(1+.06*Math.sin(o*Math.PI))*(o>.99?.93:1);s.p[0]=Math.cos(l)*i,s.p[1]=Math.sin(l)*i*(Math.sin(l)<0?.7:1),s.p[2]=(o-.5)*f*1.12;const c=o>.7?1:0;s.c[0]=n.r,s.c[1]=n.g,s.c[2]=n.b,s.a[0]=.6+.4*Math.max(Math.sin(l),0),s.a[1]=c?.9:.12})];for(const e of[-1,1])for(const o of[-.08,.08]){const s=we([[e*m*.55,-m*.45,o],[e*m*1.25,-m*.42,o],[e*m*1.5,-m*1.02,o]],.05,t,o>0?.35:0),l=s.attributes.aux.array;for(let i=0;i<l.length;i+=2)l[i]=Math.pow(l[i],.7);u.push(s)}const a=q.nM*q.nSeg;if(q.mesh=new k.InstancedMesh(kt(u),rt(7,2,{fibre:9,variant:pt?3:0,misc:[.15,0,.55,q.plate]}),a),pt){q.mesh.material.defines.PILL=1;const e=i0("spore-rain-pill:"+F.seed),o=new k.Color;q.tint=new Float32Array(a*2);for(let s=0;s<a;s++)q.tint[s*2]=e(),q.tint[s*2+1]=e(),q.mesh.setColorAt(s,o.setRGB(0,q.tint[s*2],q.tint[s*2+1]));q.caps=new k.InstancedMesh(kt([d(-.5*q.plate,-.3,1.05),d(.5*q.plate,.3,.85)]),q.mesh.material,q.nM*2);for(let s=0;s<q.nM*2;s++)q.caps.setColorAt(s,o.setRGB(0,e(),e()));q.caps.renderOrder=20,q.caps.frustumCulled=!1,q.caps.name="millipede-ends",Ct.add(q.caps)}else q.mesh.material.defines.SNAKE=1;q.mesh.material.transparent=!0,q.mesh.renderOrder=20,q.mesh.frustumCulled=!1,q.mesh.name="millipedes",Ct.add(q.mesh),q.uMid=(Ce+w0)*.5+.004,q.s0=Math.max(10,q.uMid*U-3*t0*q.uMid-40),q.s1=q.uMid*U+3*t0*(1-q.uMid)+20;const h=Math.ceil((q.s1-q.s0)/.5)+1;q.ns=h,q.route=new Float32Array(h*3);for(let e=0;e<h;e++){const[o,s]=nt(q.s0+e*.5,pt?5.4:5);q.route[e*3]=o,q.route[e*3+1]=ft(o,s)+m*.98,q.route[e*3+2]=s}}await F.yield();const Xt={n:14,len:Pa.getLength()};Xt.n=Math.max(14,Math.round(Xt.len/2.6)),Xt.gap=Xt.len/Xt.n;{const t=E("#8E2F14"),n=E("#1C1210"),m=E("#C9A86A"),f=[It([0,.02,-.4],[.2,.19,.27],n,8,5,1,2),It([0,0,-.02],[.11,.11,.2],t,7,4,1,1.4),It([0,.06,.3],[.15,.13,.15],t,7,4,1,1.6)];for(let p=0;p<6;p++){const d=p%2?1:-1,u=[-.12,0,.12][p>>1],a=[-.42,0,.4][p>>1];f.push(we([[d*.08,-.03,u],[d*.3,.1,u+a*.5],[d*.46,-.3,u+a]],.03,n,((p>>1)+p%2)%2))}for(const p of[-1,1])f.push(we([[p*.07,.12,.4],[p*.16,.24,.55],[p*.2,.16,.74]],.018,n,.5,!1));f.push(ut(4,3,!1,(p,d,u)=>{const a=.2*Math.sin(Math.PI*(.1+.85*d));u.p[0]=(p-.5)*2*a,u.p[1]=.12+.75*d+.12*Math.pow(Math.abs(p-.5)*2,2),u.p[2]=.46+.3*d-.25*d*d,u.c[0]=m.r*(.8+.3*d),u.c[1]=m.g*(.8+.3*d),u.c[2]=m.b,u.a[0]=1,u.a[1]=.8})),Xt.mesh=new k.InstancedMesh(kt(f),rt(1,2,{gloss:.9,sss:.25,fibre:20,misc:[.11,0,1.9,0]}),Xt.n),Xt.mesh.frustumCulled=!1,Xt.mesh.name="ants",Ct.add(Xt.mesh),Be.push({lo:Xt.mesh,hi:null,extra:null,c:q0[3].clone(),r:22,range:210,sw:0})}await F.yield();const jt={n:Math.max(40,Math.round(60*qt))};{const t=E("#6C7090"),n=E("#A9ACC4"),m=[It([0,0,0],[.15,.17,.42],t,7,4,1,2.2),It([0,.04,.5],[.13,.13,.15],n,5,3,1,2)];for(const p of[-1,1]){m.push(we([[p*.06,.1,.6],[p*.18,.26,.82],[p*.24,.2,1.08]],.03,t,.6,!1));for(let d=0;d<3;d++)m.push(we([[p*.1,-.06,-.2+d*.22],[p*.34,-.24,-.2+d*.26]],.035,t,(d+(p>0?1:0))%2))}m.push(we([[0,-.1,-.36],[0,-.2,-.1],[0,-.22,.14]],.04,n,.4,!1)),jt.mesh=new k.InstancedMesh(kt(m),rt(1,2,{gloss:1,fibre:16,misc:[.05,0,2.7,0]}),jt.n),jt.mesh.frustumCulled=!1,jt.mesh.name="springtails",Ct.add(jt.mesh),jt.d=new Float32Array(jt.n*8);for(let p=0;p<jt.n;p++){const d=p<jt.n*.45?z.range(18,U*.2):z.range(U*.2,U*Ce),u=z.chance(.5)?1:-1,[a,h]=nt(d,u*z.range(3.3,6.5)),e=z.range(.35,1.1)*u;O.tangentAtDist(d,J);const o=Math.hypot(J.x,J.z)||1,s=J.x/o,l=J.z/o,i=s*Math.cos(e)-l*Math.sin(e),c=l*Math.cos(e)+s*Math.sin(e),g=z.range(12,17);jt.d.set([a,ft(a,h)+.3,h,i*g,ft(a+i*g,h+c*g)+.3,c*g,d-z.range(8,13),z.range(0,Z)],p*8)}const f=[];for(let p=0;p<jt.n;p++)f.push(Array.from(jt.d.subarray(p*8,p*8+8)));f.sort((p,d)=>p[6]-d[6]),f.forEach((p,d)=>jt.d.set(p,d*8))}await F.yield();const Se={};{const t=E("#D8281C"),n=E("#8E1410"),m=[It([0,0,-.06],[.31,.23,.38],t,12,8,1,.5),It([0,-.02,.32],[.16,.13,.15],t,8,5,1,.5)];{const f=m[0].attributes.position.array;for(let p=0;p<f.length;p+=3){const d=1+.06*H.n3(f[p]*9,f[p+1]*9,f[p+2]*9)-.05*Math.exp(-Math.pow(f[p]/.05,2))*(f[p+1]>0?1:0);f[p]*=d,f[p+1]*=d}m[0].computeVertexNormals()}for(let f=0;f<8;f++){const p=f%2?1:-1,d=f>>1,u=[.5,.2,-.15,-.45][d],a=(d+f%2)%2;m.push(Me([[p*.16,-.05,u*.4],[p*.4,.08,u*.9],[p*.56,-.24,u*1.25]],[.045,.035,.02],n,5,2,1,1,(h,e,o,s)=>{o.a[0]=s,o.a[1]=-(1+a)}))}Se.mesh=new k.Mesh(kt(m),rt(1,2,{gloss:.35,sss:.3,fibre:30,misc:[.1,0,0,0]})),Se.mesh.frustumCulled=!1,Se.mesh.name="mite",Ct.add(Se.mesh),Se.cx=z0[0],Se.cz=z0[1]}await F.yield();{const t=E("#1B1712"),n=E("#C9D4C2"),m=[],f=[[.05,.075],[.16,.105],[.28,.07],[.345,-.02],[.29,-.1],[.16,-.115],[.05,-.06]];for(const a of[-1,1])for(let h=0;h+1<f.length;h++){const e=f[h],o=f[h+1],s=.2+.2*e[0],l=.2+.2*o[0];m.push(a*.03,.04,0,n.r*.18,n.g*.18,n.b*.18,0,-1,a*e[0],.04+.06*e[0],e[1],n.r*s,n.g*s,n.b*s,e[0]/.345,-1,a*o[0],.04+.06*o[0],o[1],n.r*l,n.g*l,n.b*l,o[0]/.345,-1)}const p=[j0(m),It([0,0,0],[.055,.055,.2],t,5,3,1,1),we([[0,-.03,.05],[.05,-.2,0],[.03,-.38,-.1]],.02,t,.4,!1),we([[0,-.03,-.05],[-.05,-.2,-.1],[-.03,-.36,-.2]],.02,t,.4,!1)],d=90,u=new k.InstancedMesh(kt(p),rt(1,4,{gloss:.8,sss:.9,fibre:20}),d);for(let a=0;a<d;a++){if(a<54)I.set(z.range(-24,-13.5),z.range(2.5,10),z.range(-2,27));else{const e=(z.chance(.5)?1:-1)*z.range(3.6,6.8),o=z.range(-16,1.5);I.copy(Ve).addScaledVector(me,o).addScaledVector(Pe,e).setY(Ve.y+z.range(-2.5,5))}const h=z.range(.8,1.15);{const e=.8+1.6*((a*.137+.6)%1),o=.8+1.6*((a*.371+.2)%1),s=E0+.6*h,l=i=>{const c=Math.max(Math.abs(ne[i]-I.x)-e,0),g=Math.max(Math.abs(ne[i+1]-I.y)-1.5,0),r=Math.max(Math.abs(ne[i+2]-I.z)-o,0);return c*c+g*g+r*r};for(let i=0;i<60;i++){xa(l,s);const c=Math.sqrt(b0);if(c>=s)break;let g=I.x-ne[J0],r=I.z-ne[J0+2],w=Math.hypot(g,r);w<.001&&(g=Pe.x,r=Pe.z,w=Math.hypot(g,r)),I.x+=g/w*(s-c+.05),I.z+=r/w*(s-c+.05)}}G.compose(I,yt.setFromAxisAngle(ht,z.range(0,Z)),mt.set(h,h,h)),u.setMatrixAt(a,G)}u.frustumCulled=!1,u.name="gnats",Ct.add(u)}await F.yield();const Nt=Qt?{}:null;if(Nt){const t=De,[n,m]=ee,f=ft(n,m)-.15;O.posAtDist(t-30,D);const p=new k.Group;p.position.set(n,f,m),p.rotation.y=Math.atan2(D.x-n,D.z-m);const d=E("#644828"),u=E("#BCA97C"),a=E("#D9962A"),h=E("#0A0806"),e=(i,c,g)=>{const r=i.attributes.position.array,w=i.attributes.aCol.array;for(let b=0;b<r.length;b+=3){const M=H.n3(r[b]*g,r[b+1]*g,r[b+2]*g),x=H.n3(r[b]*g*3+9,r[b+1]*g*3,r[b+2]*g*3),A=.75+.3*M+.2*x,v=K(4.5,1.5,r[b+1]);r[b+1]+=c*Math.max(x,0),w[b]=L(w[b]*A,u.r,v*.7),w[b+1]=L(w[b+1]*A,u.g,v*.7),w[b+2]=L(w[b+2]*A,u.b,v*.7),r[b+1]<.1&&(r[b+1]=.1)}return i.computeVertexNormals(),i},o=[e(It([0,5,-1],[8.6,6.2,10.4],d,22,14,1,1),.5,.35),e(It([0,6.3,8.6],[5.6,3.7,5.2],d,16,10,1,1),.3,.45),e(It([7.4,3.4,-4.5],[3.8,4.4,6.2],d,10,7,1,1),.4,.4),e(It([-7.4,3.4,-4.5],[3.8,4.4,6.2],d,10,7,1,1),.4,.4)];for(const i of[-1,1])o.push(e(It([i*3.4,9.3,8],[1.9,1.7,2.1],d,8,6,1,1),.1,.6)),o.push(It([i*3.9,9.6,8.5],[1.35,1.3,1.35],a,10,7,1,3),It([i*4.75,9.6,9.2],[.55,.42,.95],h,6,4,1,3)),o.push(we([[i*5.6,4.6,6.2],[i*7.6,2.6,8.4],[i*6.8,.5,10.6],[i*7.4,.3,12.6]],1.5,d,1,!1));const s=rt(1,0,{gloss:.42,fibre:1.1,variant:1}),l=new k.Mesh(kt(o),s);l.frustumCulled=!1,p.add(l),Nt.throat=new k.Mesh(It([0,0,0],[3.9,2.4,3.3],u,12,8,1,1.4),s),Nt.throat.position.set(0,3.5,11.2),Nt.throat.frustumCulled=!1,p.add(Nt.throat),Nt.lids=[];for(const i of[-1,1]){const c=new k.Mesh(ut(10,5,!1,(g,r,w)=>{const b=(g-.5)*2.6,M=r*1.5;w.p[0]=1.5*Math.sin(b)*Math.cos(M*.6),w.p[1]=1.5*Math.cos(b)*Math.cos(M-.2),w.p[2]=1.5*Math.sin(M-.2),w.c[0]=d.r,w.c[1]=d.g,w.c[2]=d.b,w.a[0]=1,w.a[1]=1}),s);c.position.set(i*3.9,9.6,8.5),c.rotation.y=i*.6,c.frustumCulled=!1,p.add(c),Nt.lids.push(c)}p.name="toad",Nt.group=p,Nt.u=(t-16)/U,Nt.back=new k.Vector3(n,f+11.4,m),Ct.add(p)}await F.yield();{const t=[];for(const f of a0)t.push([f.x,f.z,f.R*1.05+1,f.age<.2?.5:.34],[f.x,f.z,3.2,.4]);for(const f of pe)t.push([f.x,f.z,f.R+2.2,.5]);for(const f of Ie)t.push([f.x,f.z,f.R*1.05+1,.34],[f.x,f.z,3.4,.42]);t.push([$t.position.x,$t.position.z,5.5,.4]),Nt&&t.push([Nt.back.x,Nt.back.z,17,.5]);for(const f of Da)t.push(f);for(const f of Va)t.push([f[0],f[1],f[2]*1.9,.42]);for(let f=2;f<Rt.pts.length-2;f++)t.push([Rt.pts[f].x,Rt.pts[f].z,6,.45]);const n=ka.attributes.position.array,m=ka.attributes.aux.array;for(let f=0;f<m.length/2;f++){(f&127)===0&&await F.yield();const p=n[f*3],d=n[f*3+2];let u=0;for(const h of t){const e=p-h[0],o=d-h[1],s=e*e+o*o;if(s<h[2]*h[2]){const l=1-Math.sqrt(s)/h[2];u=Math.max(u,h[3]*Math.min(1,l*2.2))}}const a=O.nearestXZ(p,d);a.u>Ne+.012&&(u=Math.max(u,.5*(1-K(3.5,8,a.dist)))),Ge(p,d,4)&&(u=Math.max(u,.5)),m[f*2+1]=u}}await F.yield(),se(kt(p0),rt(1,0,{gloss:.6,sss:.14,fibre:3,variant:1}),"fungi"),await F.yield();{const t=kt(Ra);t.computeBoundingSphere(),se(t,rt(4,0,{gloss:1,sss:.1}),"agaric-caps",!0)}await F.yield();const je=new k.Group;je.name="beetle",Ct.add(je);const ds=[],ps=[],Lt={pos:new k.Vector3,tan:new k.Vector3,u0:.79,f0:.47,speed:4.5},ms=-1.5;let Ia=null;{const t=E(Ot?"#C98A2E":"#6A45F0"),n=E(Ot?"#9A6424":"#4A34C0"),m=E("#17120E"),f=[];f.push(ut(28,14,!1,(a,h,e)=>{const o=(a-.5)*Math.PI,s=Math.sin(o),l=Math.cos(o),i=h,c=Math.abs(s),g=.8+.34*Math.sin(Math.PI*Math.min(1,i*.85+.08)),r=1-K(0,.16,i),w=K(.8,.97,c),b=K(.12,0,i),M=Math.max(w,b),x=Math.exp(-Math.pow((c-.78)/.07,2))+.8*Math.exp(-Math.pow((i-.14)/.05,2))*(1-w),A=Math.exp(-Math.pow(s/.045,2))*K(.1,.3,i),v=Math.exp(-(Math.pow((c-.5)/.13,2)+Math.pow((i-.86)/.09,2)));e.p[0]=g*s,e.p[2]=-1.95+i*2.2-.14*l*r+.1*c*r,e.p[1]=-1.12+.34*Math.pow(Math.max(l,0),.7)*(.75+.25*Math.sin(Math.PI*Math.min(1,i+.15)))+.075*M-.035*x-.014*A-.03*v-.16*(1-i)*(1-i)+.01*H.n2(a*26,h*22),e.c[0]=t.r,e.c[1]=t.g,e.c[2]=t.b,e.a[0]=(.75+.25*l)*(1-.35*Math.min(1,x))*(1-.3*v),e.a[1]=.1+1.25*M+.25*Math.min(1,x)})),f.push(It([0,-1.2,-2.48],[.47,.21,.56],t,14,8,1,.2)),f.push(It([0,-1.27,-3],[.24,.06,.15],t,8,4,.9,.35));for(const a of[-1,1])f.push(It([a*.45,-1.14,-2.5],[.14,.12,.17],t,8,5,1,.5)),f.push(Me([[a*.27,-1.25,-2.88],[a*.42,-1.25,-3.14],[a*.27,-1.27,-3.4],[-a*.03,-1.28,-3.5]],[.1,.085,.05,.012],t,8,3,.9,.4)),f.push(Me([[a*.3,-1.31,-2.8],[a*.52,-1.33,-3.08],[a*.5,-1.37,-3.34],[a*.42,-1.4,-3.5]],[.035,.03,.035,.055],m,6,2,1,1,(h,e,o,s)=>{o.a[0]=s,o.a[1]=-(1+(a>0?1:0))}));Ia=rt(7,2,{fibre:24,misc:[.05,0,0,0]});const p=new k.Mesh(kt(f),Ia);p.frustumCulled=!1,p.name="beetle-shell",je.add(p);const d=rt(7,0,{fibre:24}),u=ut(8,33,!0,(a,h,e,o,s)=>{const l=h,i=Math.min(10,Math.floor(l*11+1e-6)),c=l*11-i,g=a*Z,r=(i===0?.085:L(.062,.034,l))*(.72+.5*Math.pow(Math.max(c,0),.7))*(s===33?.3:1);e.p[0]=Math.cos(g)*r,e.p[1]=.14*Math.sin(l*Math.PI)-.3*l+Math.sin(g)*r,e.p[2]=-2.1*l,e.c[0]=n.r,e.c[1]=n.g,e.c[2]=n.b,e.a[0]=.92,e.a[1]=i>3?.14:.6});for(const a of[-1,1]){const h=new k.Mesh(u,d);h.position.set(a*.38,-1.16,-2.74),h.frustumCulled=!1,je.add(h),ds.push({m:h,sd:a});const e=[[a*.83,.5,-.39],[a*1,.05,-.72],[a*1.17,-.52,-1.06],[a*1.25,-.9,-1.38]],o=[Me([[0,0,0],[a*.42,.3,-.2],[a*.82,.5,-.38]],[.08,.125,.08],n,8,4,.95,.5),It([a*.83,.5,-.39],[.095,.095,.095],n,8,5,1,.7),Me(e,[.068,.056,.062,.082],n,8,3,.9,.45),Me([[a*1.25,-.9,-1.38],[a*1.3,-1,-1.62],[a*1.32,-1.06,-1.86],[a*1.32,-1.1,-2.1]],[.07,.06,.052,.03],n,6,3,.85,.35)];for(let l=0;l<6;l++){const i=.5+l*.45,c=Math.min(2,Math.floor(i)),g=i-c,r=e[c],w=e[c+1],b=L(r[0],w[0],g),M=L(r[1],w[1],g),x=L(r[2],w[2],g),A=l%2?.75:-.2;o.push(Me([[b,M,x],[b+a*.11*A+a*.03,M-.05,x+.13]],[.024,.004],n,4,1,.9,.3))}const s=new k.Mesh(kt(o),d);s.position.set(a*.72,ms,-1.55),s.frustumCulled=!1,je.add(s),ps.push({m:s,sd:a})}{const a=[];a.push(ut(22,14,!1,(e,o,s)=>{const l=(e-.5)*Math.PI,i=Math.sin(l),c=Math.cos(l),g=Math.abs(i),r=o,w=.86*Math.pow(Math.max(Math.sin(Math.PI*(.2+.8*r)),0),.6),b=K(.8,.97,g),M=Math.pow(.5+.5*Math.cos(l*15),3)*(1-b)*K(.02,.12,r)*(1-K(.85,1,r));s.p[0]=w*i,s.p[2]=.56-2.7*r,s.p[1]=.16+.66*Math.pow(Math.max(c,0),.72)*(.5+.5*Math.sin(Math.PI*Math.min(1,r*.92+.12)))+.045*b*(1-r)+.02*M,s.c[0]=t.r,s.c[1]=t.g,s.c[2]=t.b,s.a[0]=(.72+.28*c)*(1-.3*(1-M)*(1-b)*.4),s.a[1]=.12+1.2*b+.3*M})),a.push(ut(16,8,!1,(e,o,s)=>{const l=(e-.5)*Math.PI,i=Math.sin(l),c=Math.cos(l),g=Math.abs(i),r=o,w=.5+.24*Math.sin(Math.PI*Math.min(1,r*.8+.12)),b=Math.max(K(.78,.97,g),K(.14,0,r));s.p[0]=w*i,s.p[2]=1.56-1.02*r,s.p[1]=.2+.46*Math.pow(Math.max(c,0),.7)*(.72+.28*Math.sin(Math.PI*Math.min(1,r+.15)))+.06*b,s.c[0]=t.r,s.c[1]=t.g,s.c[2]=t.b,s.a[0]=.75+.25*c,s.a[1]=.12+1.25*b}));const h=n.clone().multiplyScalar(.4);a.push(It([0,.33,.3],[.6,.3,1.9],t,10,6,.5,.1)),a.push(It([0,.42,1.86],[.37,.2,.44],t,12,7,1,.25));for(const e of[-1,1]){a.push(It([e*.35,.47,1.86],[.11,.1,.14],t,7,4,1,.5)),a.push(Me([[e*.2,.36,2.16],[e*.33,.36,2.38],[e*.2,.35,2.58],[-e*.03,.34,2.66]],[.08,.07,.04,.012],t,6,2,.9,.4)),a.push(Me([[e*.27,.5,2.02],[e*.62,.78,2.6],[e*1.02,.76,3.2],[e*1.34,.56,3.8]],[.06,.05,.04,.025],h,5,3,1,1,(o,s,l,i)=>{l.a[0]=.5*i*i,l.a[1]=-(1+(e>0?.3:1.1))}));for(let o=0;o<3;o++){const s=[1.02,.34,-.36][o],l=[.72,.05,-.95][o],i=(o+(e>0?1:0))%2;a.push(Me([[e*.42,.26,s],[e*1,.5,s+l*.45],[e*1.3,0,s+l*.85],[e*1.4,-.6,s+l]],[.13,.11,.08,.045],h,6,2,1,1,(c,g,r,w)=>{r.a[0]=Math.pow(w,.8),r.a[1]=-(1+i)}))}}Lt.amp=.4,Lt.size=1.6,Lt.mesh=new k.Mesh(kt(a),rt(7,2,{fibre:12,misc:[Lt.amp,0,0,0]})),Lt.mesh.frustumCulled=!1,Lt.mesh.name="beetle-two",Lt.mesh.matrixAutoUpdate=!1,Ct.add(Lt.mesh)}}await F.yield();const _s=new k.ShaderMaterial({uniforms:{...x0(),...Wt},vertexShader:so,fragmentShader:ks,fog:!0}),qa=(t,n)=>{const m=new k.InstancedMesh(t,_s,n);return m.frustumCulled=!1,m};let S0=null,m0=null,O0=null;if(!fe){const t=Math.round(240*st*(ot==="dawn"?1.4:1)),n=new k.IcosahedronGeometry(1,1),m=new Float32Array(t*4),f=qa(n,t);let p=0;for(let o=0;p<t&&o<t*5;o++){const s=z.range(0,U-14),l=s>Zt+4,i=l?z.range(1,3.7)*(z.chance(.5)?1:-1):(z.chance(.5)?1:-1)*(1.6+16*Math.pow(z(),1.6)),[c,g]=nt(s,i),r=z.range(.1,.28)*(z.chance(.1)?1.5:1);if(!l&&s>U*w0-4)continue;let w;l?(O.posAtDist(s,D),w=D.y-be-Kt+Math.sqrt(Kt*Kt-i*i)+r*.5):w=ft(c,g)+.3+r*.5,G.makeScale(r,r,r).setPosition(c,w,g),f.setMatrixAt(p,G),m[p*4]=z(),p++}f.count=p,f.name="beads",He(f,9,120,m),await F.yield();const d=Math.round((wt?300:130)*L(.8,1.15,(qt-.7)/.6)),u=new k.IcosahedronGeometry(1,d>160?0:1),a=new Float32Array(d*4),h=qa(u,d);for(let o=0;o<d;o++){const s=z.range(5,U-20),l=o<22;let i,c,g;if(l){const b=z.chance(.5)?1:-1;c=z.range(Tt,Ft+3),i=b*z.range(2.5,7.4),g=Ks(i,c)-.9}else{if([i,c]=nt(s,(z.chance(.5)?1:-1)*(3.2+22*Math.pow(z(),1.3))),Math.hypot(i,c)<22){const b=22/Math.max(Math.hypot(i,c),1);i*=b,c*=b,O.nearestXZ(i,c).dist<3.2&&(i-=9)}g=ft(i,c)+z.range(24,34)}const r=ft(i,c),w=z.range(.36,.5);G.makeScale(w,w,w).setPosition(i,g,c),h.setMatrixAt(o,G),a[o*4]=z(),a[o*4+1]=1,a[o*4+2]=Math.max(g-r-.15,2),a[o*4+3]=wt?z.range(2.2,4):z.range(3.4,7);{const b=g-a[o*4+2],M=1.25*w,x=4.2*w,A=b+1.2*w;xa(v=>{const y=ne[v]-i,C=ne[v+2]-c,S=Math.sqrt(y*y+C*C),B=ne[v+1],P=Math.max(S-M,0),T=B>g?B-g:B<b?b-B:0,_=Math.max(S-x,0),X=B>A?B-A:B<b?b-B:0;return Math.min(P*P+T*T,_*_+X*X)},E0),b0<E0*E0&&(a[o*4+1]=0)}}h.name="drips",He(h,6,420,a,38);const e=new k.IcosahedronGeometry(1,1);e.setAttribute("iB",new k.InstancedBufferAttribute(new Float32Array(16),4)),S0=qa(e,4),S0.name="raindrops",Ct.add(S0);{const i=new k.IcosahedronGeometry(1,0),c=i.attributes.position.array,g=i.index?i.index.array:null,r=g?g.length:c.length/3,w=[],b=[],M=[];for(let v=0;v<=5;v++)for(let y=0;y<=30;y++)w.push(y/30,v/5,0),b.push(0,0,0);for(let v=0;v<5;v++)for(let y=0;y<30;y++){const C=v*31+y,S=C+1,B=C+30+1,P=B+1;M.push(C,B,S,S,B,P)}for(let v=0;v<11;v++){const y=w.length/3,C=(v+.5)/11,S=N();if(g){for(let B=0;B<c.length;B+=3)w.push(c[B],c[B+1],c[B+2]),b.push(1,C,S);for(let B=0;B<g.length;B++)M.push(y+g[B])}else for(let B=0;B<r;B++)w.push(c[B*3],c[B*3+1],c[B*3+2]),b.push(1,C,S),M.push(y+B)}i.dispose();const x=new k.BufferGeometry;x.setAttribute("position",new k.BufferAttribute(new Float32Array(w),3)),x.setAttribute("aK",new k.BufferAttribute(new Float32Array(b),3)),x.setIndex(M),O0=new k.InstancedBufferAttribute(new Float32Array(8),2),x.setAttribute("iA",O0);const A=new k.ShaderMaterial({uniforms:{...x0(),...Wt},vertexShader:oo,fragmentShader:no,fog:!0,side:k.DoubleSide,transparent:!0,depthWrite:!1});m0=new k.InstancedMesh(x,A,4),m0.frustumCulled=!1,m0.name="crowns",Ct.add(m0);for(let v=0;v<4;v++)O0.setXY(v,0,N()),m0.setMatrixAt(v,G.identity())}}await F.yield();const le={n:xt==="early"?72:24};{le.mesh=new k.InstancedMesh(d0(12,6),rt(2,0,{gloss:.5,sss:.7,fibre:10}),le.n),le.mesh.frustumCulled=!1,le.mesh.name="falling-leaves",Ct.add(le.mesh),le.d=new Float32Array(le.n*8);for(let t=0;t<le.n;t++){let n=0,m=0,f=!1;for(let d=0;d<40&&!f;d++){const u=z.range(20,U*.97),a=u>U*.7;[n,m]=nt(u,(z.chance(.5)?1:-1)*(a?z.range(34,70):z.range(16.5,40))),f=Math.hypot(n,m)>34&&O.nearestXZ(n,m).dist>16.4&&!(m>Tt-8&&m<Ft+16&&Math.abs(n)<26)&&!Ge(n,m,8)}const p=z.range(38,52);le.d.set([n,ft(n,m)+.4,m,p,z.range(0,30),z.range(0,Z),f||t===0?z.range(8,11.5):0,z.range(.9,1.5)],t*8),le.mesh.setColorAt(t,G0(Y))}}const us={transparent:!0,depthWrite:!1,blending:k.CustomBlending,blendEquation:k.AddEquation,blendSrc:k.OneFactor,blendDst:k.OneMinusSrcAlphaFactor,blendSrcAlpha:k.OneFactor,blendDstAlpha:k.OneMinusSrcAlphaFactor},_a={value:450},gs={value:1},n0=[];for(let t=0;t<3;t++){const n=pe[t];n0.push({x:n.x,y:n.y+n.H*.955,z:n.z,u:n.d/U-.048,wind:t===2?2.2:1.7,n:680,h:n.H*.88,lean:t===2?.4:0})}if(wt)for(let t=3;t<Math.min(pe.length,10);t++){const n=pe[t];n0.push({x:n.x,y:n.y+n.H*.955,z:n.z,u:-1,period:z.range(5,9),off:z.range(0,9),wind:1.5,n:40,h:n.H*1.2})}const Z0=n0.reduce((t,n)=>t+n.n,0),Dt={pos:new Float32Array(Z0*3),col:new Float32Array(Z0*4),size:new Float32Array(Z0),seed:new Float32Array(Z0*4)};for(let t=0;t<Z0*4;t++)Dt.seed[t]=N();{const t=new k.BufferGeometry;t.setAttribute("position",new k.BufferAttribute(Dt.pos,3)),t.setAttribute("aC",new k.BufferAttribute(Dt.col,4)),t.setAttribute("aSz",new k.BufferAttribute(Dt.size,1)),Dt.geo=t;const n=new k.ShaderMaterial({uniforms:{...x0(),uPx:_a},vertexShader:ro,fragmentShader:Ss,fog:!0,...us}),m=new k.Points(t,n);m.frustumCulled=!1,m.renderOrder=2,m.name="puff-smoke",Ct.add(m)}{const t=Math.round(520*st),n=new Float32Array(t*4);for(let d=0;d<n.length;d++)n[d]=z();const m=new k.BufferGeometry;m.setAttribute("position",new k.BufferAttribute(new Float32Array(t*3),3)),m.setAttribute("aS",new k.BufferAttribute(n,4));const f=new k.ShaderMaterial({uniforms:{...x0(),...Wt,uPx:_a,uBox:{value:new k.Vector3(80,30,80)},uDrift:{value:new k.Vector3(.5,fe?-.05:-.22,.3)},uMoteCol:{value:ta.clone().multiplyScalar(gt?1.5:1.12)},uMoteK:gs},vertexShader:io,fragmentShader:Ss,fog:!0,...us}),p=new k.Points(m,f);p.frustumCulled=!1,p.renderOrder=2,p.name="motes",Ct.add(p)}await F.yield();const bs=new k.Vector2,Yt=new k.Matrix4,Gt=new k.Vector3,Jt=new k.Vector3,qe=new k.Vector3,_e=new k.Vector3,H0=new k.Vector3,Us=U/t0,u0=ie/U,F0=ve/U,Ua=$t.position.clone(),Oa=E(gt?"#232A3E":"#33200F"),Za=E(gt?"#56617E":"#7A5A38");for(const t of n0){const n=O.nearestXZ(t.x,t.z);O.pointAt(n.u,D),O.tangentAt(n.u,J);const m=Math.hypot(D.x-t.x,D.z-t.z)||1,f=Math.hypot(J.x,J.z)||1,p=t.lean??1,d=J.x/f*(1-p)+(D.x-t.x)/m*p,u=J.z/f*(1-p)+(D.z-t.z)/m*p,a=Math.hypot(d,u)||1;t.wx=d/a,t.wz=u/a}const ws=new k.Vector3,R0=new k.Vector3,ga=new k.Vector3,Os=new k.Color,Ms=(t,n,m)=>{const f=Math.min(q.ns-1.001,Math.max(0,(t-q.s0)/.5)),p=Math.floor(f),d=f-p,u=q.route;n.set(L(u[p*3],u[p*3+3],d),L(u[p*3+1],u[p*3+4],d),L(u[p*3+2],u[p*3+5],d)),m.set(u[p*3+3]-u[p*3],u[p*3+4]-u[p*3+1],u[p*3+5]-u[p*3+2]).normalize()},L0={snail:new k.Vector3,ants:q0[2].clone().add(q0[3]).multiplyScalar(.5),cap:te.center.clone().setY(te.center.y+2)};L0.snail.copy(Ua).addScaledVector(Ye,2.5).setY(Ua.y+2.2);const Ke=new k.Vector3,Zs=new k.Vector3,Hs=new k.Vector3,xs=[-12,Ft+9.5],Ws=ft(-12,Ft+9.5),Xs=(t,n)=>Zs.copy(L0.ants).lerp(L0.cap,K(F0-.014,F0+.004,n)),vs=t=>Math.min(.8,Math.max(.18,Lt.f0+Lt.speed*t0/Rt.len*(t-Lt.u0))),ys=(t,n)=>(Rt.curve.getPointAt(vs(t),n),n.y+=Rt.R+.6*Lt.size-.1,n),Ys=(t,n)=>ys(n,Hs);function zs(t,n,m,f){Ke.setFromMatrixPosition(m.matrixWorld),te.update(t,n,m),te.setProgress(Ue((f-w0+.02)/(Ne-w0+.02))),na.position.copy(Ke),F.renderer&&(F.renderer.getDrawingBufferSize(bs),_a.value=bs.y);const p=f*U;for(const a of Be){const h=Ke.distanceTo(a.c)-a.r,e=!!a.hi&&h<a.sw;a.lo.visible=!e&&h<a.range,a.hi&&(a.hi.visible=e),a.extra&&(a.extra.visible=e)}for(const a of ls){const h=Ke.distanceTo(a.c)-a.r;a.near.visible=h<cs,a.mid.visible=h>=cs&&h<hs,a.far.visible=h>=hs&&h<qs}{const a=K(250,430,Math.hypot(Ke.x-Wt.uCapC.value.x,Ke.z-Wt.uCapC.value.z));Wt.uFogK&&(Wt.uFogK.value=L(At.heroFog,.3,a));const h=K(.33,.41,f)*(1-.6*K(.47,.57,f))*(1-K(.62,.68,f)),e=Wt.uShaftP.value,o=Wt.uSunDir.value;Gt.copy(Ke).sub(e);const s=Gt.dot(o);Gt.addScaledVector(o,-s);const l=1-K(.72,1.12,Gt.length()/Wt.uCoreR.value);oa.uniforms.uAxis.value.w=L(.25,1,K(345,402,Ke.z));const i=oa.uniforms.uHero.value;Gt.copy(L0.cap).sub(Ke);const c=Gt.length()||1,g=1-K(38,80,c);i.set(Gt.x/c,Gt.y/c,Gt.z/c,(gt?.35:.85)*(1-.5*K(330,420,c))*(gt?1:1+.1*g)),oa.uniforms.uVault.value=g,gs.value=1-.8*g,pa&&(pa.uniforms.uMisc.value.z=1-.62*g*(1-K(.76,.79,f))),te.shaft.core=L(ot==="day"?11:te.shaft.radius,4.6,g),Q0&&(Q0.value=L(Xa*(ot==="day"?1-.6*a-.25*K(120,250,c)+.15*h:1+1.2*a+.9*h),Math.min(.5,Xa*1.8),g*(1-l))*L(1,.3,l))}{O.tangentAt(f,J);const a=p/2.3*Z;Gt.copy(f>0?Ke:O.start);{const e=m.matrixWorld.elements,o=Math.hypot(J.x,J.z)||1,s=Math.asin(Math.max(-1,Math.min(1,-e[9]/(Math.hypot(e[8],e[9],e[10])||1)))),l=Math.atan2(J.y,o),i=Math.max(0,l-s-.07),c=f>0?Math.min(l,s-Math.min(.03,.6*i)):l,g=Math.cos(c);let r=J.x/o,w=J.z/o;if(f>0){const b=Math.hypot(e[8],e[10])||1,M=-e[8]/b,x=-e[10]/b,A=Math.atan2(r*x-w*M,r*M+w*x),v=.07;if(Math.abs(A)>v){const y=A-Math.sign(A)*v,C=Math.cos(y),S=Math.sin(y),B=r*C-w*S,P=r*S+w*C;r=B,w=P}}Jt.set(Gt.x+r*g,Gt.y+Math.sin(c),Gt.z+w*g)}Yt.lookAt(Gt,Jt,ht),je.quaternion.setFromRotationMatrix(Yt);const h=Math.max(0,(m.fov?Math.tan(m.fov*Math.PI/360):.6)-.62);je.position.copy(Gt),je.position.y+=.03*Math.sin(a*2)-.27-2*h;{const e=m.matrixWorld.elements;je.rotateZ(.018*Math.sin(a)+(f>0?.85*Math.asin(Math.max(-1,Math.min(1,e[1]/(Math.hypot(e[0],e[1],e[2])||1)))):0))}for(const e of ds)e.m.rotation.set(.06*Math.sin(n*1.7+e.sd)+.03*Math.sin(a*2),-e.sd*(1.26+.3*Math.sin(n*2.4+(e.sd>0?0:Math.PI))+.05*Math.sin(a)),0);for(const e of ps){const o=a+(e.sd>0?0:Math.PI);e.m.rotation.set(.42*Math.sin(o),0,e.sd*.1*Math.cos(o)),e.m.position.y=ms+.07*Math.max(Math.cos(o),0)}Ia.uniforms.uMisc.value.y=n*9}{const a=vs(f);ys(f,Lt.pos),Rt.curve.getTangentAt(a,Lt.tan),_e.crossVectors(ht,Lt.tan).normalize(),H0.crossVectors(Lt.tan,_e).normalize();const h=a>.181&&a<.799?1:0,e=a*Rt.len;Yt.makeBasis(_e.multiplyScalar(Lt.size),H0.multiplyScalar(Lt.size),Jt.copy(Lt.tan).multiplyScalar(Lt.size)).setPosition(Lt.pos.x,Lt.pos.y+.04*h*Math.sin(e/Lt.amp/Lt.size*2),Lt.pos.z),Lt.mesh.matrix.copy(Yt),Lt.mesh.material.uniforms.uMisc.value.y=e/Lt.amp/Lt.size+(1-h)*.25*Math.sin(n*1.3)}$t.position.copy(Ua).addScaledVector(Ye,Math.min(n,45)*.15-3),$t.position.y=ft($t.position.x,$t.position.z)-.08;const d=$t.userData.pivot;d&&d.rotation.set(.02*Math.sin(n*.57+1),0,.035*Math.sin(n*.8)),$t.updateMatrixWorld(),Gt.copy(Ke),$t.worldToLocal(Gt);const u=K(u0-.014,u0-.004,f)*(1-K(u0+.012,u0+.03,f));for(const a of fs){Jt.copy(Gt).sub(a.m.position);const h=Jt.length()||1;Jt.multiplyScalar(1/h);const e=.7*(1-K(25,75,h))*(Jt.z>-.3?1:.35);qe.copy(a.base).multiplyScalar(1-e).addScaledVector(Jt,e),qe.x+=.07*Math.sin(n*.9+a.sd),qe.y=Math.max(qe.y,.15),qe.normalize(),a.m.quaternion.setFromUnitVectors(ht,qe);const o=u*(Gt.x*a.sd>0?1:.15);a.m.scale.set(1+.45*o,1-.72*o,1+.45*o)}{const a=q.uMid*U+14+3*t0*(f-q.uMid),h=q.nSeg*q.segLen;let e=0;for(let o=0;o<q.nM;o++){const s=a-o*(h+q.gap),l=pt?1-K(5,13,Math.abs(p-(s-h*.5))):0;let i=0,c=0,g=0;l>=.01&&(Ms(s-(q.nSeg-1)*.5*q.segLen,ws,R0),_e.crossVectors(ht,R0).normalize(),ga.crossVectors(R0,_e).normalize(),i=l*Z*.93,c=q.nSeg*q.segLen*(1-.44*l)/i,g=-c*Math.cos(i*.5)+.1*l);for(let r=0;r<q.nSeg;r++){if(l<.01)Ms(s-r*q.segLen,Gt,Jt),_e.crossVectors(ht,Jt).normalize(),H0.crossVectors(Jt,_e).normalize();else{const b=i*((q.nSeg-1)*.5-r)/q.nSeg,M=Math.sin(b),x=Math.cos(b);Gt.copy(ws).addScaledVector(R0,c*M).addScaledVector(ga,c*x+g),Jt.copy(R0).multiplyScalar(x).addScaledVector(ga,-M),H0.copy(R0).multiplyScalar(M).addScaledVector(ga,x)}const w=pt?(.74+.26*K(0,2,r))*(.72+.28*K(0,3,q.nSeg-1-r)):(.55+.45*K(0,3,r))*(.5+.5*K(0,4,q.nSeg-1-r));Yt.makeBasis(_e,H0,Jt).scale(mt.set(w,w,1)).setPosition(Gt),pt&&(q.mesh.setColorAt(e,Os.setRGB(l,q.tint[e*2],q.tint[e*2+1])),r===0?q.caps.setMatrixAt(o*2,Yt):r===q.nSeg-1&&q.caps.setMatrixAt(o*2+1,Yt)),q.mesh.setMatrixAt(e++,Yt)}}pt&&(q.mesh.instanceColor.needsUpdate=!0,q.caps.instanceMatrix.needsUpdate=!0),q.mesh.instanceMatrix.needsUpdate=!0,q.mesh.material.uniforms.uMisc.value.y=a/.15}for(let a=0;a<Xt.n;a++){const h=(a*Xt.gap+2.2*n)%Xt.len,e=h/Xt.len;Pa.getPointAt(e,Gt),Pa.getTangentAt(e,Jt),qe.copy(ht).addScaledVector(Jt,-Jt.y).normalize(),_e.crossVectors(qe,Jt).normalize();const o=1.35*K(0,2.5,h)*(1-K(Xt.len-2.5,Xt.len,h));Gt.addScaledVector(qe,.5-.14*e+.3*o),Yt.makeBasis(_e,qe,Jt).scale(mt.set(o,o,o)).setPosition(Gt),Xt.mesh.setMatrixAt(a,Yt)}Xt.mesh.instanceMatrix.needsUpdate=!0,Xt.mesh.material.uniforms.uMisc.value.y=2.2*n/.11;{const a=jt.d;let h=0;for(let e=0;e<jt.n;e++){const o=e*8;if(a[o+6]<p-70)continue;if(a[o+6]>p+190)break;const s=Ue((p-a[o+6])/Us/1.15),l=Math.atan2(a[o+3],a[o+5])+(s<=0?.6*Math.sin(n*.7+a[o+7]):0);St.set(-s*Z*3,l,0,"YXZ"),I.set(a[o]+a[o+3]*s,L(a[o+1],a[o+4],s)+22*s*(1-s),a[o+2]+a[o+5]*s),Yt.compose(I,yt.setFromEuler(St),mt.set(1.3,1.3,1.3)),jt.mesh.setMatrixAt(h++,Yt)}jt.mesh.count=h,jt.mesh.instanceMatrix.needsUpdate=!0,jt.mesh.material.uniforms.uMisc.value.y=n*3}{const a=n*.45,h=Se.cx+.9*Math.cos(a),e=Se.cz+.9*Math.sin(a);Se.mesh.position.set(h,ft(h,e)+.5,e),Se.mesh.rotation.set(0,Math.atan2(-Math.sin(a),Math.cos(a)),0),Se.mesh.scale.setScalar(2),Se.mesh.material.uniforms.uMisc.value.y=n*5.1}if(Nt){Nt.throat.scale.setScalar(1+.13*Math.sin(n*5.5)*(.6+.4*Math.sin(n*.7)));const a=K(Nt.u-.012,Nt.u-.004,f)*(1-K(Nt.u+.004,Nt.u+.014,f));for(const h of Nt.lids)h.rotation.x=L(-1.25,.25,a)}{const a=le.d;for(let h=0;h<le.n;h++){if(h===0){const A=Ue(f/.06),v=1-K(.85,1,A),y=n*1.5,C=Math.sin(y);I.set(-3+(xs[0]+3)*Math.pow(A,.6)+C*v,Ws+.4+8.1*(1-Math.pow(A,1.5))+.4*C*C*v,xs[1]+.8*Math.cos(n*.7)*v),St.set(.25*Math.sin(n*.9)*v,.9+A*1.4,.8*Math.cos(y)*v,"YXZ"),Yt.compose(I,yt.setFromEuler(St),mt.set(7.5,7.5,7.5)),le.mesh.setMatrixAt(0,Yt);continue}const e=h*8,o=a[e+3],s=o/4,l=s+3.5,i=((n+a[e+4])%l+l)%l,c=Math.min(i,s),g=o-4*c,r=K(0,2.5,g),w=a[e+7],b=c*w*1.6+a[e+5],M=Math.sin(b);I.set(a[e]+3*M*r,a[e+1]+g+.6*M*M*r,a[e+2]+1.2*Math.cos(c*w*.7+a[e+5])*r),St.set(.25*Math.sin(c*w*.9)*r,a[e+5]+c*.2,.85*Math.cos(b)*r,"YXZ");const x=a[e+6]*K(0,.6,i)*(1-K(l-.5,l,i));Yt.compose(I,yt.setFromEuler(St),mt.set(x,x,x)),le.mesh.setMatrixAt(h,Yt)}le.mesh.instanceMatrix.needsUpdate=!0}{let a=0;for(const h of n0){const e=h.u>=0?(f-h.u)*t0:(n+h.off)%h.period,o=h.u>=0?9:h.period-.5;for(let s=0;s<h.n;s++,a++){const l=Dt.seed[a*4],i=Dt.seed[a*4+1],c=Dt.seed[a*4+2],g=Dt.seed[a*4+3],r=e-l*.5;if(r<=0||r>o){Dt.col[a*4]=Dt.col[a*4+1]=Dt.col[a*4+2]=Dt.col[a*4+3]=0,Dt.size[a]=0;continue}const w=h.h*(.15+.85*Math.pow(i,.65)),b=Math.min(9.5,w*(1-Math.exp(-r*3.4))+.3*r*i),M=Math.min(1.2,b/h.h),x=Math.max(0,r-.25),A=M*M,v=Math.pow(x,.6),y=(.3+.13*b+1.9*A*v)*(.3+.7*g),C=c*Z+(i-.5)*1.6*r,S=h.wind*A*(.35*r+1.5*Math.pow(x,1.2));Dt.pos[a*3]=h.x+Math.cos(C)*y+h.wx*S,Dt.pos[a*3+1]=h.y+.2+b+.45*y*Math.sin(C*2+r*1.3)-.3*A*x,Dt.pos[a*3+2]=h.z+Math.sin(C)*y+h.wz*S;const B=.4*K(0,.06,r)*Math.exp(-Math.max(0,r-1.6)*.32)*(1-K(o-1.5,o,r))*(1-.3*g*A),P=Math.min(1,g*g*(.35+.65*M)+.12*x);Dt.col[a*4]=L(Oa.r,Za.r,P)*B,Dt.col[a*4+1]=L(Oa.g,Za.g,P)*B,Dt.col[a*4+2]=L(Oa.b,Za.b,P)*B,Dt.col[a*4+3]=B,Dt.size[a]=(.85+.75*g)*(.55+.6*M)+1.05*A*v}}Dt.geo.attributes.position.needsUpdate=!0,Dt.geo.attributes.aC.needsUpdate=!0,Dt.geo.attributes.aSz.needsUpdate=!0}for(let a=0;a<3;a++){const h=(f-n0[a].u)*t0,e=h>0&&h<2.5?Math.exp(-h*3.2)*Math.cos(h*13)*K(0,.05,h):0,o=ca[a];o.scale.set(1+.07*e,1-.16*e,1+.07*e),o.updateMatrix()}if(S0){for(let a=0;a<4;a++){let h=0,e=-999,o=0,s=0,l=0;const i=a<3?n0[a]:null,c=i?i.u:Nt?Nt.u-.012:-9,g=(f-c)*t0,r=i||(Nt?Nt.back:null);r&&g>-1.4&&g<.02&&(h=r.x,o=r.z,e=r.y+.8+25*Math.max(-g,0),s=.95),Yt.makeScale(s,s,s).setPosition(h,e,o),S0.setMatrixAt(a,Yt),r&&g>0&&g<1.6&&(l=g/1.6),O0.setX(a,l),r&&(Yt.makeScale(1.35,1.35,1.35).setPosition(r.x,r.y+.05,r.z),m0.setMatrixAt(a,Yt))}S0.instanceMatrix.needsUpdate=!0,m0.instanceMatrix.needsUpdate=!0,O0.needsUpdate=!0}}return zs(0,0,{position:O.start.clone(),matrixWorld:new k.Matrix4().setPosition(O.start)},0),{scene:Ct,path:O,duration:t0,pace:t=>1+.22*K(.1,.15,t)*(1-K(.2,.25,t))-.2*K(.36,.42,t)*(1-K(.54,.6,t))-.28*K(.63,.69,t)*(1-K(.77,.82,t))+.18*K(.8,.84,t)*(1-K(.86,.9,t)),camera:{fov:62,near:.3,far:3200,lookAhead:24,sway:.8,bank:.6},pois:[{at:L0.snail,from:u0-.1,to:u0+.04,weight:.55},{at:Xs,from:F0-.11,to:F0+.03,weight:.5},{at:L0.cap,from:F0,to:Ce+.02,weight:.4},{at:te.anchors.hub,from:Ce-.02,to:.797,weight:.8,fade:.13},{at:Ys,from:.762,to:.824,weight:.5}],portal:{shape:"circle",radius:7,color:At.portal,glow:1,revealDistance:190},post:{exposure:At.exposure,bloom:{strength:At.bloom,radius:.6,threshold:.9},grade:{saturation:At.sat,contrast:1.05,tint:At.tint,shadowTint:At.shadow,vignette:.34,grain:.02,aberration:0}},ride:"none",_info:{hour:ot,weather:Pt,season:xt,snailMorph:Vt,bronze:Ot,pills:pt,rare:Qt,U_BANK:Ce,U_CREST:w0,U_HUB:Fs,U_BR:Ne,U_BREND:Rs,uSnail:u0,uMite:c0/U,uAnt:F0,uToad:Nt?Nt.u:-1,uMilli:q.uMid,leafSkips:ia,jets:n0.slice(0,3).map(t=>({u:t.u,x:t.x,y:t.y,z:t.z,h:t.h})),agarics:a0,puffballs:pe.slice(0,3)},update:zs,dispose(){}}}};export{bo as default};
