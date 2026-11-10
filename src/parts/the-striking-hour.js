import*as r from"three";import{mergeGeometries as Jt}from"three/addons/utils/BufferGeometryUtils.js";import{makeRng as Mt,hashSeed as Pt}from"../kit/core.js";const $t=["#E9EEF3","#9DB0C2","#12161A","#1F3A35","#B3A46E","#56687A","#D4442B"],e0=Math.PI*2,D0=f=>(f=Math.min(1,Math.max(0,f)),f*f*(3-2*f)),eo=`
attribute vec3 aCol; attribute vec2 aPbr;
uniform mat4 uHeroInv; uniform float uTime;
#ifdef BELL
uniform float uRing; uniform float uRingPhase;
#endif
#ifdef WIRE
uniform float uSlack; uniform float uLen;
#endif
varying vec3 vP; varying vec3 vN; varying vec3 vCol; varying vec2 vPbr; varying vec3 vO;
#include <common>
#include <fog_pars_vertex>
void main(){
  vec3 p = position; vec3 n = normal;
  #ifdef BELL
  { float lip = smoothstep(16.0, 0.0, p.y); float ph = atan(p.z, p.x + 1e-5);
    float fl = uRing * lip * lip * cos(2.0 * ph) * sin(uRingPhase);
    float r = max(length(p.xz), 1e-3); p.xz += (p.xz / r) * fl; }
  #endif
  #ifdef WIRE
  { float s = clamp(p.y / uLen, 0.0, 1.0); float bow = sin(PI * s);
    p.x -= uSlack * bow * (1.0 + 0.35 * sin(s * 19.0 - uTime * 9.0));      // it bows up and away from the cradle's line
    p.z += uSlack * 0.45 * bow * sin(s * 13.0 + uTime * 7.0); }
  #endif
  vO = position;
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vP = (uHeroInv * wp).xyz;
  vN = mat3(uHeroInv) * (mat3(modelMatrix) * n);
  vCol = aCol; vPbr = aPbr;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,to=`
uniform mat4 uHeroInv; uniform vec3 uDialCol[4]; uniform vec3 uAmb; uniform vec3 uRoom;
uniform float uHalf; uniform float uDialR; uniform vec2 uHands[4]; uniform float uFade; uniform float uTime;
uniform vec3 uLouvre; uniform vec2 uBelfryY;
uniform vec3 uShaftO; uniform vec3 uShaftD; uniform vec3 uShaftCol;
uniform vec4 uHatch; uniform vec3 uHatchCol; uniform float uGlint; uniform vec3 uSeat; uniform vec3 uPortalCol; uniform vec3 uFillCol; uniform float uFill;
varying vec3 vP; varying vec3 vN; varying vec3 vCol; varying vec2 vPbr; varying vec3 vO;
#include <common>
#include <fog_pars_fragment>
float h31(vec3 p){ p = fract(p * vec3(0.1031, 0.1030, 0.0973)); p += dot(p, p.yzx + 33.33); return fract((p.x + p.y) * p.z); }
float vnoise(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(h31(i), h31(i + vec3(1,0,0)), f.x), mix(h31(i + vec3(0,1,0)), h31(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(h31(i + vec3(0,0,1)), h31(i + vec3(1,0,1)), f.x), mix(h31(i + vec3(0,1,1)), h31(i + vec3(1,1,1)), f.x), f.y), f.z); }
float handSeg(vec2 q, float ang, float len, float w, float blur){
  vec2 d = vec2(sin(ang), cos(ang)); float t = clamp(dot(q, d), -len * 0.2, len);
  float dist = length(q - d * t); float ww = w * (1.0 - 0.45 * clamp(t / len, 0.0, 1.0));
  return 1.0 - smoothstep(ww - blur, ww + blur, dist); }
// light let through the dial at in-plane point q (x right as seen from inside, y up)
float dialGlass(vec2 q, vec2 hands, float blur, float frame){
  float m = max(handSeg(q, hands.x, 52.0, 2.2, blur), handSeg(q, hands.y, 36.0, 3.2, blur));
  float r = length(q);
  float rings = (1.0 - smoothstep(0.6, 0.6 + blur, abs(r - 51.0))) + (1.0 - smoothstep(0.5, 0.5 + blur, abs(r - 38.0)));
  float a = atan(q.x, q.y + 1e-5); float sp = abs(fract(a * 12.0 / 6.2831853 + 0.5) - 0.5) * 6.2831853 / 12.0 * max(r, 1.0);
  float spokes = (1.0 - smoothstep(0.35, 0.35 + blur, sp)) * step(6.0, r);
  return (1.0 - 0.82 * m) * (1.0 - frame * 0.5 * clamp(rings + spokes, 0.0, 1.0)); }
// one dial: adds its irradiance to E and its mirror image to R
void dial(int i, vec3 dir, vec3 right, vec3 col, vec2 hands, vec3 P, vec3 N, vec3 Rv, float rough, inout vec3 E, inout vec3 R, inout float cover, inout float shade){
  vec3 C = uRoom + dir * uHalf; vec3 toC = C - P; float d = max(length(toC), 1.0); vec3 L = toC / d;
  float depth = max(dot(toC, dir), 0.0);
  // daylight comes down through the glass: the hands' shadows fall inward and DOWN (0.9 m per metre from the dial), so the
  // minute hand lies along the bed as a soft bar of shade. Penumbra grows with distance.
  vec2 q = vec2(dot(P - C, right), P.y - C.y + 0.9 * depth);
  float bl = 1.0 + 0.065 * depth;
  float hm = max(handSeg(q, hands.x, 52.0, 3.6, bl), handSeg(q, hands.y, 36.0, 4.4, bl)) * smoothstep(2.0, 14.0, depth);
  hm = min(1.0, hm * 1.25);
  float sh = 1.0 - 0.95 * hm;
  shade *= 1.0 - 0.62 * hm;
  float w = clamp(dot(N, L) * 0.6 + 0.4, 0.0, 1.0); w *= w;
  float solid = 1.7 * uDialR * uDialR / (uDialR * uDialR + d * d);
  E += col * (w * solid * sh);
  float dn = dot(Rv, dir);
  if (dn > 1e-3) { float t = depth / dn; vec3 H = P + Rv * t - C; vec2 hq = vec2(dot(H, right), H.y);
    float soft = 1.0 + rough * 34.0; float rr = length(hq);
    float inside = 1.0 - smoothstep(uDialR - soft, uDialR + soft, rr);
    float lat = abs(dot(H, right)); float win = (1.0 - smoothstep(uHalf - soft, uHalf + soft, lat));
    float g = dialGlass(hq, hands, 0.8 + rough * 26.0, 1.0);
    float pol = 1.0 - smoothstep(0.1, 0.34, rough);                      // polished metal mirrors the glass at its true (HDR) brightness: white glints
    R += col * (inside * win * g * 1.7 * mix(1.0, uGlint, pol) * (0.4 + 0.6 * sh)); cover += inside * win; }
}
// belfry: flat cold bars of daylight through horizontal louvres on one side
vec3 louvre(vec3 dir, vec3 P, vec3 N, float flatK){
  float wrap = clamp(dot(N, dir) * 0.7 + 0.3, 0.0, 1.0);
  float bars = mix(0.3, 1.0, smoothstep(-0.35, 0.35, sin((P.y + 0.4 * dot(P, dir)) * 1.15)));
  bars = mix(bars, 0.62, flatK);                                             // inside the bell the bars are lost: one soft light
  return uLouvre * (wrap * bars * 0.5);
}
void main(){
  if (uFade < 0.999) { float dh = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715)))); if (dh > uFade) discard; }
  vec3 N = normalize(vN + vec3(1e-5)); if (!gl_FrontFacing) N = -N;
  vec3 camL = (uHeroInv * vec4(cameraPosition, 1.0)).xyz;
  vec3 V = normalize(camL - vP + vec3(1e-5));
  float metal = vPbr.x; float rough = vPbr.y;
  // procedural breakup in the part's own space so it turns with the wheel
  float n1 = vnoise(vO * 0.55 + 7.0), n2 = vnoise(vO * 3.1), n3 = vnoise(vO * vec3(9.0, 9.0, 0.6));
  // masonry (rough >= 0.95, not metal) is coursed ashlar; the underside of the ceiling is planked oak
  float stoneK = step(0.935, rough) * (1.0 - metal);
  float woodK = step(0.88, rough) * (1.0 - stoneK) * (1.0 - metal) * smoothstep(0.6, 0.9, -N.y) * step(120.0, vP.y);
  float plainK = max(stoneK, step(0.855, rough) * (1.0 - metal));          // stone and timber: no machine-grime blotch
  float pxw = fwidth(vP.x) + fwidth(vP.y) + fwidth(vP.z);
  #ifdef BELL
  // a cast and lathe-turned bell: fine concentric tool rings up the bore, a few broader bands, a faint verdigris bloom
  float tf = 1.0 / (1.0 + 2.5 * fwidth(vO.y * 5.5));
  float bore = step(0.52, vPbr.y);
  float turn = sin(vO.y * 34.5 + 1.3 * n1) * tf; float band = smoothstep(0.35, 0.65, vnoise(vec3(vO.y * 1.7, 3.0, 1.0))) * (1.0 - 0.3 * bore);                                           // the inside of the bell (its lathe carries roughness 0.6)
  vec2 bd = vO.xz / max(length(vO.xz), 1e-3);
  float run = vnoise(vec3(bd * 7.0, vO.y * 0.16)) * 0.6 + vnoise(vec3(bd * 23.0, vO.y * 0.5 + 4.0)) * 0.4;      // casting skin and verdigris runs down the bore
  vec3 alb = vCol * (0.95 + mix(0.05, 0.07, bore) * turn) * (0.93 + mix(0.1, 0.22, bore) * band) * (0.95 + 0.1 * n2) * mix(1.0, 0.6 * (0.62 + 0.7 * run), bore);
  alb = mix(alb, alb * vec3(0.72, 1.06, 1.0), bore * 0.5 * smoothstep(0.55, 0.85, run));
  alb = mix(alb, alb * vec3(0.8, 1.02, 0.98), 0.35 * smoothstep(0.5, 0.8, n1));
  float grime = 0.0; rough = clamp(rough - 0.05 * turn - 0.04 * band, 0.1, 1.0);
  // daylight reaches the lip only: up the bore the louvre light dies and the next world is the only light
  float boreK = mix(1.0, mix(1.0, 0.16, smoothstep(1.5, 16.0, vO.y)), bore);
  #else
  float boreK = 1.0; float bore = 0.0;
  #ifdef FLY
  // riveted plate: fine vertical brushed streaks, an oil-stained lower third, no cloudy mottle
  float br1 = vnoise(vec3(vO.x * 7.0, vO.y * 0.55, vO.z * 7.0)), br2 = vnoise(vec3(vO.x * 19.0 + 5.0, vO.y * 1.6, vO.z * 19.0));
  float oilLine = smoothstep(46.2, 51.0, vO.y + 2.6 * (br1 - 0.5) + 1.2 * (n1 - 0.5));
  vec3 alb = vCol * (0.8 + 0.26 * br1 + 0.14 * br2) * mix(0.5, 1.0, oilLine);
  float grime = 0.0; rough = clamp(rough + metal * (0.16 * (br2 - 0.5) + 0.12 * (br1 - 0.5) - 0.14 * (1.0 - oilLine)), 0.08, 1.0);
  #else
  vec3 alb = vCol * mix(0.78 + 0.34 * n1, 0.95 + 0.08 * n1, plainK) * (0.93 + 0.14 * n2);
  float grime = smoothstep(0.55, 0.9, n1 * 0.7 + n2 * 0.5) * (1.0 - 0.85 * plainK);
  #endif
  #endif
  if (stoneK > 0.5) {
    float su = abs(N.x) > 0.5 ? vP.z : vP.x; float sv = vP.y;
    if (abs(N.y) > 0.7) { su = vP.x; sv = vP.z; }
    float row = floor(sv / 3.0); su += 3.0 * mod(row, 2.0) + 1.3 * h31(vec3(row, 7.0, 3.0));
    vec2 cf = vec2(fract(su / 6.0) * 6.0, fract(sv / 3.0) * 3.0);
    float edge = min(min(cf.x, 6.0 - cf.x), min(cf.y, 3.0 - cf.y));
    float mortar = (1.0 - smoothstep(0.06, 0.15 + pxw, edge)) / (1.0 + 0.5 * pxw);
    float lit = (1.0 - smoothstep(0.15, 0.5, cf.y)) * (1.0 - mortar);            // the worn arris under each joint catches light
    float bv = h31(vec3(floor(su / 6.0), row, 1.7));
    float damp = smoothstep(0.45, 0.85, vnoise(vec3(su * 0.3, sv * 0.02, 4.0))) * smoothstep(0.25, 0.75, vnoise(vec3(su * 0.06, sv * 0.045, 9.0)));
    alb *= (0.84 + 0.26 * bv) * (1.0 - 0.45 * mortar) * (1.0 + 0.1 * lit) * (1.0 - 0.3 * damp) * (0.9 + 0.2 * vnoise(vec3(su, sv, 0.0) * 1.9));
  }
  if (woodK > 0.01) {
    float pz = vP.z / 3.5; float pid = floor(pz); float pf = fract(pz);
    float seam = (1.0 - smoothstep(0.012, 0.03 + pxw * 0.3, min(pf, 1.0 - pf))) / (1.0 + 0.3 * pxw);
    float bx = vP.x / 23.0 + h31(vec3(pid, 2.0, 5.0)); float bf2 = fract(bx);
    float butt = 1.0 - smoothstep(0.004, 0.009 + pxw * 0.05, min(bf2, 1.0 - bf2));
    float pv = h31(vec3(pid, floor(bx), 3.0));
    float grain = vnoise(vec3(vP.x * 0.35, vP.z * 5.0, pid)) * 0.6 + vnoise(vec3(vP.x * 1.3, vP.z * 14.0, pid)) * 0.4;
    vec2 hd = vP.xz - uHatch.xz;                                               // the ceiling falls off into the corners
    alb *= mix(1.0, (0.78 + 0.34 * pv) * (0.84 + 0.3 * grain) * (1.0 - 0.6 * max(seam, butt)) * (0.48 + 0.72 * exp(-dot(hd, hd) / 4200.0)), woodK);
  }
  { float beamK = step(0.88, rough) * (1.0 - stoneK) * (1.0 - metal) * step(120.0, vP.y) * (1.0 - woodK);
    if (beamK > 0.01) {
      float ga = abs(N.x) > 0.6 ? vP.z : vP.x; float gb = abs(N.y) > 0.6 ? (abs(N.x) > 0.6 ? vP.x : vP.z) : vP.y;
      float fd = 1.0 / (1.0 + 5.0 * pxw);
      float g1 = vnoise(vec3(ga * 0.22, gb * 4.5, 3.0)), g2 = vnoise(vec3(ga * 0.9, gb * 15.0, 7.0));
      float shake = smoothstep(0.72, 0.8, vnoise(vec3(ga * 0.12, gb * 2.2, 11.0)));          // drying checks along the grain
      alb *= mix(1.0, (0.72 + 0.5 * g1) * (0.86 + 0.28 * g2 * fd) * (1.0 - 0.45 * shake * fd), beamK);
    } }
  #ifdef WIRE
  float wireNear = 1.0 - smoothstep(5.0, 34.0, length(camL - vP));
  { float ph = 3.0 * atan(vO.z, vO.x + 1e-5) + vO.y * 5.2; float lf = 1.0 / (1.0 + 1.6 * fwidth(vO.y * 5.2));
    float lay = cos(ph), yarn = cos(ph * 5.0 + vO.y * 31.0);
    vec3 ax = vec3(0.5, 0.8660254, 0.0); vec3 tg = cross(ax, N); tg /= max(length(tg), 1e-3);
    N = normalize(N + (ax * (0.2 * sin(ph)) - tg * (0.75 * sin(ph))) * lf + vec3(1e-5));
    float valley = 1.0 - smoothstep(-0.95, 0.1, lay);
    alb *= mix(1.0, (1.0 - 0.72 * valley) * (0.86 + 0.14 * yarn), lf); rough = clamp(rough + 0.3 * valley * lf, 0.06, 1.0);
    alb *= mix(1.0, 0.75, wireNear); }
  #endif
  alb *= 1.0 - 0.35 * grime; rough = clamp(rough + 0.25 * grime + 0.12 * (n3 - 0.5) * metal, 0.06, 1.0);
  vec3 Rv = reflect(-V, N);
  vec3 E = uAmb * (0.7 + 0.3 * N.y); vec3 R = vec3(0.0); float cover = 0.0; float shade = 1.0;
  dial(0, vec3(1,0,0), vec3(0,0,1), uDialCol[0], uHands[0], vP, N, Rv, rough, E, R, cover, shade);
  dial(1, vec3(-1,0,0), vec3(0,0,-1), uDialCol[1], uHands[1], vP, N, Rv, rough, E, R, cover, shade);
  dial(2, vec3(0,0,1), vec3(-1,0,0), uDialCol[2], uHands[2], vP, N, Rv, rough, E, R, cover, shade);
  dial(3, vec3(0,0,-1), vec3(1,0,0), uDialCol[3], uHands[3], vP, N, Rv, rough, E, R, cover, shade);
  shade = max(shade, 0.2); E *= shade; R *= 0.3 + 0.7 * shade;
  float bf = smoothstep(uBelfryY.x, uBelfryY.y, vP.y);
  if (bf > 0.0) {
    E += bf * (louvre(vec3(1,0,0), vP, N, bore) + louvre(vec3(-1,0,0), vP, N, bore) + louvre(vec3(0,0,1), vP, N, bore) + louvre(vec3(0,0,-1), vP, N, bore));
    R += uLouvre * (bf * 0.7 * (1.0 - abs(Rv.y)) * mix(mix(0.35, 1.0, smoothstep(-0.3, 0.3, sin(Rv.y * 16.0))), 0.6, bore));
  }
  #ifdef BELL
  { float rimB = 1.0 - clamp(dot(N, V), 0.0, 1.0); E *= mix(2.4, 1.2, bore); R += uLouvre * (bf * 0.9 * rimB * rimB); }
  #endif
  E *= boreK; R *= boreK;
  // daylight spilling down through the belfry hatch, and the next world's light inside the bell
  vec3 Eh = vec3(0.0);
  { vec3 Lh = vec3(uHatch.x, uHatch.y + 6.0, uHatch.z) - vP; float d2 = dot(Lh, Lh); vec3 lh = Lh / sqrt(max(d2, 1.0));
    float below = 1.0 - smoothstep(uHatch.y + 1.0, uHatch.y + 8.0, vP.y);
    float wr = clamp(dot(N, lh) * 0.55 + 0.45, 0.0, 1.0);
    Eh = uHatchCol * (below * wr * wr * 1500.0 / (1500.0 + d2));
    vec2 ho = abs(vP.xz - uHatch.xz) - uHatch.w; float dh = length(max(ho, 0.0)) + min(max(ho.x, ho.y), 0.0) * 0.3;
    float zone = smoothstep(134.0, 141.0, vP.y) * (1.0 - smoothstep(uHatch.y + 0.5, uHatch.y + 3.0, vP.y));
    if (zone > 0.0) {
      vec2 th = uHatch.xz - vP.xz; th /= max(length(th), 1e-3);
      float face = clamp(dot(N.xz, th), 0.0, 1.0), under = clamp(-N.y, 0.0, 1.0);
      float rake = 0.34 + 0.66 * smoothstep(-0.3, 0.45, sin(dh * 1.75 + 1.4 * vnoise(vec3(vP.xz * 0.21, 2.0)) + (vP.x + vP.z) * 0.12));
      Eh += uHatchCol * (zone * exp(-max(dh, 0.0) / 22.0) * (0.8 * face + 0.85 * under + 0.08) * mix(1.0, rake, smoothstep(0.5, 5.0, dh)));
    }
    E += Eh; }
  { vec3 Lp = uSeat - vP; float d2 = dot(Lp, Lp); vec3 lp = Lp / sqrt(max(d2, 1.0));
    float wr = clamp(dot(N, lp) * 0.6 + 0.4, 0.0, 1.0);
    vec3 pl = uPortalCol * (wr * 240.0 / (240.0 + d2));
    #ifdef BELL
    pl *= 1.0 + 1.6 * (1.0 - smoothstep(6.0, 34.0, sqrt(d2)));   // the next world's light pools round the seat and dies up the bore
    pl *= mix(1.0, (1.0 - 0.8 * smoothstep(9.5, 21.0, sqrt(d2))) * (1.0 + 1.1 * (1.0 - smoothstep(8.0, 17.0, sqrt(d2)))), bore);   // inside, the next world's light washes the bronze from the opening out to the lip
    #endif
    E += pl; R += pl * 0.7; }
  E += uFillCol * ((uFill + 0.25 * bf) * boreK); R += uFillCol * (uFill * 1.5) + Eh * 1.2;
  // the one hard shaft of sunlight from the open pane: a square beam, no occlusion
  { vec3 rel = vP - uShaftO; float tt = dot(rel, uShaftD); vec3 pp = rel - uShaftD * tt;
    vec3 sU = normalize(cross(uShaftD, vec3(0.0, 1.0, 0.0)) + vec3(1e-5)); vec3 sV = cross(sU, uShaftD);
    float sf = 0.25 + 0.012 * max(tt, 0.0);
    float inb = (1.0 - smoothstep(3.0 - sf, 3.0 + sf, abs(dot(pp, sU)))) * (1.0 - smoothstep(3.0 - sf, 3.0 + sf, abs(dot(pp, sV)))) * step(0.0, tt);
    E += uShaftCol * (inb * clamp(dot(N, -uShaftD) * 0.8 + 0.2, 0.0, 1.0) * mix(0.55, 1.0, smoothstep(3.0, 9.0, length(camL - vP)))); }
  R += uAmb * (boreK * (1.0 - clamp(cover, 0.0, 1.0)) * (0.5 + 0.5 * clamp(Rv.y * 0.5 + 0.5, 0.0, 1.0)));
  // the dark bed and floor mirrored from below
  R *= mix(1.0, smoothstep(-0.55, 0.15, Rv.y), 0.75);
  float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 5.0);
  #ifdef BELL
  fres *= 1.0 - 0.35 * bore;
  #endif
  vec3 F0 = mix(vec3(0.04), alb, metal);
  vec3 F = mix(F0, vec3(1.0), fres * (1.0 - rough * 0.8));
  #ifndef BELL
  { float warm = clamp((alb.r - alb.b) / max(alb.r, 1e-3) * 2.2, 0.0, 1.0);          // brass only: blued steel must not go navy
    R *= mix(vec3(1.0), alb / max(max(alb.r, max(alb.g, alb.b)), 1e-3), 0.55 * metal * warm);
    R = mix(R, R * 0.72, 0.6 * metal * warm); }                                        // and it stays under the white point, so the hue survives the tone map
  #endif
  vec3 col = alb * (1.0 - metal) * E * 0.62 + F * R * (1.0 - 0.55 * rough) + alb * metal * E * 0.38 * rough;
  #ifdef BELL
  col += alb * E * 0.3;
  #endif
  #ifdef WIRE
  { float rimW = 1.0 - clamp(dot(N, V), 0.0, 1.0); rimW *= rimW; col *= mix(1.0, 0.5, wireNear); col += (uFillCol * 0.2 + Eh * 0.12 + uAmb * 0.6) * (rimW * (0.4 + 0.6 * clamp(N.y * 0.5 + 0.8, 0.0, 1.0)) * mix(1.0, 0.3, wireNear)); }
  #endif
  col += alb * metal * (E * (bf * 0.3) + Eh * 0.6);            // in the belfry dull metal is lit by the louvres, not only mirrored
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,fo=new r.Matrix4,Xe=new r.Quaternion,oo=new r.Euler,St=new r.Vector3,ao=new r.Vector3;function o(f=0,P=0,R=0,K=0,J=0,T=0,q=1,_=q,D=q){return new r.Matrix4().compose(ao.set(f,P,R),Xe.setFromEuler(oo.set(K,J,T)),St.set(q,_,D))}function ae(f,P,R=1,K=R){const J=new r.Vector3().subVectors(P,f),T=J.length();return Xe.setFromUnitVectors(new r.Vector3(0,1,0),J.normalize()),new r.Matrix4().compose(f,Xe,St.set(R,T,K))}function no(f){const P=new r.BufferGeometry;return P.setAttribute("position",new r.Float32BufferAttribute(f,3)),P.computeVertexNormals(),P}function w(f,P,R,K=.08){const J=f/2,T=P/2,q=R/2;K=Math.min(K,J*.49,T*.49,q*.49);const _=(d,p,S,l)=>[d*(l===0?J:J-K),p*(l===1?T:T-K),S*(l===2?q:q-K)],D=[],o0=[-1,1];for(let d=0;d<3;d++)for(const p of o0){const S=[];for(const[l,F]of[[-1,-1],[1,-1],[1,1],[-1,1]]){const y=d===0?[p,l,F]:d===1?[l,p,F]:[l,F,p];S.push(_(y[0],y[1],y[2],d))}D.push(S)}for(let d=0;d<3;d++){const p=(d+1)%3,S=(d+2)%3;for(const l of o0)for(const F of o0){const y=[];for(const[g,b]of[[-1,p],[1,p],[1,S],[-1,S]]){const k=[0,0,0];k[d]=g,k[p]=l,k[S]=F,y.push(_(k[0],k[1],k[2],b))}D.push(y)}}for(const d of o0)for(const p of o0)for(const S of o0)D.push([_(d,p,S,0),_(d,p,S,1),_(d,p,S,2)]);const $=[];for(const d of D){const p=d[1][0]-d[0][0],S=d[1][1]-d[0][1],l=d[1][2]-d[0][2],F=d[2][0]-d[0][0],y=d[2][1]-d[0][1],g=d[2][2]-d[0][2],b=S*g-l*y,k=l*F-p*g,B=p*y-S*F,C=b*(d[0][0]+d[2][0])+k*(d[0][1]+d[2][1])+B*(d[0][2]+d[2][2])<0;for(let a0=1;a0<d.length-1;a0++){const O=d[0],G=C?d[a0+1]:d[a0],c0=C?d[a0]:d[a0+1];$.push(O[0],O[1],O[2],G[0],G[1],G[2],c0[0],c0[1],c0[2])}}return no($)}function h(f,P=24,R=!1,K=e0,J=0){const T=[],q=[],_=f.length,D=[];for(let d=0;d<_-1;d++){const p=f[d+1][0]-f[d][0],S=f[d+1][1]-f[d][1],l=Math.hypot(p,S)||1;D.push([S/l,-p/l])}const o0=(d,p)=>{if(!R)return D[p];const S=D[Math.max(0,d-1)],l=D[Math.min(_-2,d)],F=S[0]+l[0],y=S[1]+l[1],g=Math.hypot(F,y)||1;return[F/g,y/g]};for(let d=0;d<P;d++){const p=J+d/P*K,S=J+(d+1)/P*K,l=Math.cos(p),F=Math.sin(p),y=Math.cos(S),g=Math.sin(S);for(let b=0;b<_-1;b++){const[k,B]=f[b],[C,a0]=f[b+1],O=o0(b,b),G=o0(b+1,b),c0=[[k*l,B,k*F,O[0]*l,O[1],O[0]*F],[C*l,a0,C*F,G[0]*l,G[1],G[0]*F],[C*y,a0,C*g,G[0]*y,G[1],G[0]*g],[k*y,B,k*g,O[0]*y,O[1],O[0]*g]],F0=(W0,se,A0)=>{for(const v0 of[W0,se,A0])T.push(v0[0],v0[1],v0[2]),q.push(v0[3],v0[4],v0[5])};k>1e-5&&F0(c0[0],c0[1],c0[3]),C>1e-5&&F0(c0[1],c0[2],c0[3])}}const $=new r.BufferGeometry;return $.setAttribute("position",new r.Float32BufferAttribute(T,3)),$.setAttribute("normal",new r.Float32BufferAttribute(q,3)),$}const O0=(f,P,R=.06)=>[[0,0],[f-R,0],[f,R],[f,P-R],[f-R,P],[0,P]];function Fe(f){const{R:P,teeth:R=0,depth:K=1,thick:J=1,spokes:T=6,hubR:q=3,rimW:_=2.5,spokeW:D=1.2,bevel:o0=.12}=f,$=[];if(R>0){const l=P-K,F=e0/R;for(let y=0;y<R;y++){const g=y*F,b=P-l,k=f.leaf?[[0,l],[.13,l],[.2,l+.3*b],[.26,l+.62*b],[.33,l+.88*b],[.42,P],[.58,P],[.67,l+.88*b],[.74,l+.62*b],[.8,l+.3*b],[.87,l]]:[[0,l],[.2,l],[.36,P],[.64,P],[.8,l]];for(const[B,C]of k)$.push(new r.Vector2(Math.cos(g+B*F)*C,Math.sin(g+B*F)*C))}}else{const F=(f.notches||[]).slice().sort((g,b)=>g[0]-b[0]);let y=0;for(let g=0;g<180;g++){const b=g/180*e0,k=(g+1)/180*e0;for($.push(new r.Vector2(Math.cos(b)*P,Math.sin(b)*P));y<F.length&&F[y][0]>=b&&F[y][0]<k;){const[B,C]=F[y++],a0=P-K;for(const[O,G]of[[B-C/2,P],[B-C/2,a0],[B+C/2,a0],[B+C/2,P]])$.push(new r.Vector2(Math.cos(O)*G,Math.sin(O)*G))}}}const d=[],p=q,S=P-(R>0?K:0)-_;if(T>0&&S>p+1)for(let l=0;l<T;l++){const F=l/T*e0,y=e0/T,g=[],b=(O,G)=>Math.asin(Math.min(.9,G/O)),k=D*.5,B=D*.85,C=10,a0=5;for(let O=0;O<=C;O++){const G=F+b(S,k)+(y-2*b(S,k))*(O/C);g.push(new r.Vector2(Math.cos(G)*S,Math.sin(G)*S))}for(let O=a0;O>=0;O--){const G=F+b(p,B)+(y-2*b(p,B))*(O/a0);g.push(new r.Vector2(Math.cos(G)*p,Math.sin(G)*p))}d.push(g)}return ro($,d,J,o0)}function ro(f,P,R,K){const J=y=>{let g=0;for(let b=0,k=y.length;b<k;b++){const B=y[b],C=y[(b+1)%k];g+=B.x*C.y-C.x*B.y}return g},T=[J(f)<0?f.slice().reverse():f];for(const y of P)T.push(J(y)>0?y.slice().reverse():y);const q=T.map(y=>{const g=y.length,b=new Array(g);for(let k=0;k<g;k++){const B=y[(k+g-1)%g],C=y[k],a0=y[(k+1)%g];let O=C.x-B.x,G=C.y-B.y,c0=a0.x-C.x,F0=a0.y-C.y;const W0=Math.hypot(O,G)||1,se=Math.hypot(c0,F0)||1;O/=W0,G/=W0,c0/=se,F0/=se;let A0=G+F0,v0=-(O+c0);const ve=Math.hypot(A0,v0);ve<1e-6?(A0=G,v0=-O):(A0/=ve,v0/=ve);const x0=K/Math.max(.5,A0*G-v0*O);b[k]=new r.Vector2(C.x-A0*x0,C.y-v0*x0)}return b}),_=R/2,D=_-K,o0=[].concat(...q),$=r.ShapeUtils.triangulateShape(q[0],q.slice(1));let d=$.length*6;for(const y of T)d+=y.length*18;const p=new Float32Array(d*3);let S=0;const l=(y,g)=>{p[S++]=y.x,p[S++]=y.y,p[S++]=g};for(const y of $){let g=o0[y[0]],b=o0[y[1]];const k=o0[y[2]];if((b.x-g.x)*(k.y-g.y)-(b.y-g.y)*(k.x-g.x)<0){const B=g;g=b,b=B}l(g,_),l(b,_),l(k,_),l(g,-_),l(k,-_),l(b,-_)}for(let y=0;y<T.length;y++){const g=T[y],b=q[y],k=g.length;for(let B=0;B<k;B++){const C=(B+1)%k;l(g[B],D),l(g[C],D),l(b[C],_),l(g[B],D),l(b[C],_),l(b[B],_),l(g[B],-D),l(g[C],-D),l(g[C],D),l(g[B],-D),l(g[C],D),l(g[B],D),l(b[B],-_),l(b[C],-_),l(g[C],-D),l(b[B],-_),l(g[C],-D),l(g[B],-D)}}const F=new r.BufferGeometry;return F.setAttribute("position",new r.BufferAttribute(p,3)),F.computeVertexNormals(),F}class f0{constructor(){this.list=[],this.tris=0}add(P,R,K,J=0,T=.6,q=0){let _=P.index?P.toNonIndexed():P.clone();for(const l of Object.keys(_.attributes))l!=="position"&&l!=="normal"&&_.deleteAttribute(l);_.attributes.normal||_.computeVertexNormals();const D=_.attributes.position.count,o0=_.attributes.position,$=new Float32Array(D*3),d=new Float32Array(D*2),p=new r.Color,S=1+q;for(let l=0;l<D;l++)typeof K=="function"?K(o0.getX(l),o0.getY(l),o0.getZ(l),p):p.copy(K),$[l*3]=p.r*S,$[l*3+1]=p.g*S,$[l*3+2]=p.b*S,d[l*2]=p.metal!==void 0?p.metal:J,d[l*2+1]=p.rough!==void 0?p.rough:T;return p.metal=void 0,p.rough=void 0,_.setAttribute("aCol",new r.BufferAttribute($,3)),_.setAttribute("aPbr",new r.BufferAttribute(d,2)),R&&_.applyMatrix4(R),this.list.push(_),this.tris+=D/3,this}mesh(P,R){const K=Jt(this.list,!1);for(const T of this.list)T.dispose();this.list.length=0;const J=new r.Mesh(K,P);return J.name=R||"",J.frustumCulled=!1,J}}const Q=20,P0=22,u0=-6,b0=8,Qe=-28,X0=5,ne=-6.45,Ve=1,re=2.7,Me=15.1,Pe=-2.6,U=26,t0=1,s0=44,w0=60,de=12,I0=-50,Se=26.6,Q0=10.5,Re=8,ze=[5.75,6.4,7.05],so=ze[0],me=new r.Vector3(I0-Re,Se+.6,so),C0=new r.Vector3(Math.cos(Math.PI/3),Math.sin(Math.PI/3),0),Je=163,J0=184,$e=30,Rt=17;async function uo(f,P={}){const R=f.rng.fork?f.rng.fork("striking-hour-hero"):f.rng,K=f.quality?.detail??1,J=(P.palette&&P.palette.length>=7?P.palette:$t).map(e=>new r.Color(e)),[T,q,_,D,o0,$,d]=J,p=(()=>{const e=.3*$.r+.55*$.g+.15*$.b;return $.clone().lerp(new r.Color(e,e,e*1.05),.6).multiplyScalar(1.25)})(),S=o0.clone().lerp(q,.14),l=Object.assign({duration:40,warning:24,release:26,interval:2.5},P.timeline||{}),F=Math.max(1,P.blows??5),y=Object.assign({center:[0,75,0],half:70,dialRadius:55},P.room||{}),g=R.pick([0,0,1,2]),b=[D,new r.Color("#2c3a47"),new r.Color("#1d2226")][g].clone(),k=[3.4,2.5,2.3][g],B=R.pick([5,6,6,8]),C=R.pick([5,6]),a0=R.pick([4,5,6]),O=R.pick([88,96,104]),G=R.pick([64,72]),c0=R.pick([36,40,44]),F0=R.int(0,2),W0=R.int(1,12),se=R.range(0,1),A0=R.range(.92,1.06),v0=R.range(-.25,.25),ve=P.dials?P.dials.map(e=>new r.Color(e)):[new r.Color("#F4F2EE").multiplyScalar(1.28),new r.Color("#BFD2EA").multiplyScalar(.92),T.clone().lerp(q,.18),T.clone().lerp(q,.3)],x0={uHeroInv:{value:new r.Matrix4},uTime:{value:0},uDialCol:{value:ve},uAmb:{value:q.clone().multiplyScalar(.11)},uRoom:{value:new r.Vector3().fromArray(y.center)},uHalf:{value:y.half},uDialR:{value:y.dialRadius},uLouvre:{value:q.clone().lerp(T,.4).multiplyScalar(1.5)},uBelfryY:{value:new r.Vector2(146,160)},uHands:{value:[0,1,2,3].map(()=>new r.Vector2(-.105,(W0-1/12)/12*e0))},uShaftO:{value:new r.Vector3(70,54,-22)},uShaftD:{value:new r.Vector3(-1,-.42,.1).normalize()},uShaftCol:{value:new r.Color(0,0,0)},uHatch:{value:new r.Vector4(0,150,0,15)},uHatchCol:{value:new r.Color(0,0,0)},uGlint:{value:1},uSeat:{value:new r.Vector3(0,300,0)},uPortalCol:{value:new r.Color(0,0,0)},uFillCol:{value:q.clone().multiplyScalar(.5)}},zt=[];function pe(e={},t={}){const n=new r.ShaderMaterial({defines:e,fog:!0,vertexShader:eo,fragmentShader:to,uniforms:Object.assign(r.UniformsUtils.clone(r.UniformsLib.fog),x0,{uFade:{value:1},uFill:{value:0}},t)});return zt.push(n),n}await f.yield?.();const S0=pe(),V0=new r.Group;V0.name="the-striking-hour-hero";let Ae=0;const h0=(e,t,n,a=V0)=>{Ae+=e.tris;const c=e.mesh(t,n);return a.add(c),c},I=(e,t,n,a=1)=>{const c=e.clone().multiplyScalar(a);return c.metal=t,c.rough=n,c},Z=I(b,0,.42,k),Le=I(b,0,.5,k*1.4),q0=I(S,1,.22),G0=I(S,1,.12,1.08),Ee=I(S,1,.34,.8),l0=I(p,1,.26),p0=I(p,1,.1,1.25),R0=I(p,1,.5,.6),g0=I(d,0,.4),et=I(S,0,.5,1.7),$0=I(new r.Color("#5d564c"),0,.9),At=I(new r.Color("#8a8566"),1,.4),Y0=I(_,0,.6,1.6),s=(e,t,n,a)=>e.add(t,n,a,a.metal,a.rough,typeof a=="function"?0:R.range(-.06,.06)),Lt=Mt(Pt("striking-hour-hero:tint-new:"+(f.seed??0))),j=(e,t,n,a)=>e.add(t,n,a,a.metal,a.rough,typeof a=="function"?0:Lt.range(-.06,.06)),A=Math.PI/2,Et=Mt(Pt("striking-hour-hero:r4-red:"+(f.seed??0))),z0=(e,t,n,a)=>e.add(t,n,a,a.metal,a.rough,Et.range(-.06,.06)),Ne=(e,t,n,a,c,i)=>{const u=h([[t+n+.02,c-.02],[t+n,c],[t-n,c],[t-n-.02,c-.02]],i);z0(e,u,o(0,0,a,A),g0),z0(e,u,o(0,0,a,-A),g0)},M=new f0,d0=(e,t,n=10,a=.06)=>h(O0(e,t,a),n),kt=h([[0,0],[.95,0],[.95,.1],[.7,.22],[.42,.22],[.3,.34],[0,.34]],14);function tt(e,t,n=1.25){s(M,w(3.6,.7,2.2,.12),o(e,Q+.35,t),Z),s(M,w(2.2,1.2,1.9,.2),o(e,Q+1.2,t),Z),s(M,h([[0,-1],[n,-1],[n+.12,-.85],[n+.12,.85],[n,1],[0,1]],14),o(e,P0,t,A),Z),s(M,h([[0,-1.12],[.95,-1.12],[.95,1.12],[0,1.12]],12),o(e,P0,t,A),Ee);for(const a of[-1.45,1.45])s(M,h(O0(.2,.3,.04),6),o(e+a,Q+.7,t),R0)}if(P.bed!==!1){for(const t of[-20,u0,b0,20]){s(M,w(110,.6,2.6,.1),o(0,Q-.3,t),Z),s(M,w(110,.6,2.6,.1),o(0,Q-3.9,t),Z),s(M,w(109.4,3.2,.7,.08),o(0,Q-2.1,t),Z);for(let n=-50;n<=50.1;n+=10)s(M,w(.45,3,2.2,.1),o(n+5,Q-2.1,t),Z);for(const n of[-1,1]){for(const a of[-1,-3.2])s(M,w(100,.17,.06,.01),o(0,Q+a,t+n*.37),et);for(let a=-40;a<=40.1;a+=20)s(M,kt,o(a,Q-2.1,t+n*.35,n*A),a===0?et:Le)}await f.yield?.()}await f.yield?.();for(const t of[-54,-47.5,40,54])s(M,w(1.8,3.6,42.4,.14),o(t,Q-2.2,0),Z),s(M,w(2.6,.5,42.6,.1),o(t,Q-.25,0),Z);const e=h([[0,0],[3.4,0],[3.4,.7],[2.9,1.1],[2.5,1.5],[2.1,3.2],[1.6,13],[1.9,13.5],[1.9,14],[2.6,14.9],[2.9,15.2],[2.9,16],[0,16]],8);for(const t of[-46,46])for(const n of[-17,17]){s(M,e,o(t,0,n,0,Math.PI/8),Z),s(M,w(8.4,.5,8.4,.16),o(t,.25,n),Z);for(let a=0;a<4;a++)s(M,h(O0(.35,.45,.06),6),o(t+(a&1?3.4:-3.4),.5,n+(a&2?3.4:-3.4)),R0);s(M,w(.5,6.5,9,.12),o(t,13.2,n-Math.sign(n)*4.2,Math.sign(n)*.62),Z)}}await f.yield?.();for(const e of[Qe,ne,Me])tt(e,u0),tt(e,b0);await f.yield?.();async function Be(e){const t=new f0,n=e.thick??1,a=e.z,c=e.R-(e.teeth?e.depth:0),i=c-e.rimW,u=(m,E,W,x)=>{const X=Math.hypot(m,E),z=D0((X-(c-.2))/Math.max(e.depth||1,.5));x.copy(S).multiplyScalar(.92+.22*z+.06*se*Math.sin(X*2.1)),x.metal=1,x.rough=.3-.17*z},v=Fe(e);await f.yield?.(),t.add(v,o(0,0,a),u),await f.yield?.();const L=h([[c-.25,n/2-.02],[c-.45,n/2+.2],[i+.5,n/2+.2],[i+.2,n/2-.02]],72),V=h([[0,-1.7],[1.35,-1.7],[1.6,-1.45],[1.6,-1.05],[e.hubR*.7,-.95],[e.hubR*.93,-.62],[e.hubR*.93,.62],[e.hubR*.7,.95],[1.6,1.05],[1.6,1.45],[1.35,1.7],[0,1.7]],28);s(t,L,o(0,0,a,A),G0),s(t,L,o(0,0,a,-A),G0),s(t,V,o(0,0,a,A),q0);for(let m=0;m<e.spokes;m++){const E=(m+.5)/e.spokes*e0+e0/e.spokes/2,W=i-e.hubR+.6,x=(i+e.hubR)/2;s(t,w(W,.42,n+.4,.12),o(Math.cos(E)*x,Math.sin(E)*x,a,0,0,E),q0)}for(let m=0;m<6;m++){const E=m/6*e0;for(const W of[-1,1])s(t,h(O0(.24,.26,.05),6),o(Math.cos(E)*e.hubR*.62,Math.sin(E)*e.hubR*.62,a+W*.8,W*A),R0)}s(t,d0(.72,b0-u0+2.9,12,.12),o(0,0,u0-1.45,A),l0);for(const m of[u0+1.35,b0-1.35])s(t,h([[.7,-.22],[1.05,-.22],[1.12,-.1],[1.12,.1],[1.05,.22],[.7,.22]],12),o(0,0,m,A),p0);if(e.pinionZ!==void 0){const m=Fe({R:2.7,teeth:e.pinionLeaves||10,depth:1.25,thick:3,spokes:0,hubR:0,rimW:0,bevel:.1});s(t,m,o(0,0,e.pinionZ),p0);for(const E of[-1,1])s(t,h([[.7,0],[2.85,0],[2.85,.22],[2.6,.34],[.7,.34]],20),o(0,0,e.pinionZ+E*1.5,E*A),l0)}await f.yield?.(),e.extra?.(t),await f.yield?.();const N=h0(t,S0,e.name);return N.position.set(e.x,P0,0),N}function K0(e,t,n=[],a=.1){const c=new r.Shape(e.map(u=>new r.Vector2(u[0],u[1])));for(const u of n)c.holes.push(new r.Path(u.map(v=>new r.Vector2(v[0],v[1]))));const i=new r.ExtrudeGeometry(c,{depth:t-2*a,bevelEnabled:!0,bevelThickness:a,bevelSize:a,bevelOffset:-a,bevelSegments:1,steps:1,curveSegments:1});return i.translate(0,0,-(t-2*a)/2),i}function He(e,t,n,a=()=>0,c=26){const i=[],u=[];for(let v=0;v<=c;v++){const L=e+(t-e)*(v/c);i.push([L,a(L)+n(L)]),u.push([L,a(L)-n(L)])}return i.concat(u.reverse())}const L0=Math.PI/180,_t=await Be({name:"pinWheel",x:Qe,z:X0,R:15,teeth:G,depth:1,thick:.9,spokes:C,hubR:3.2,rimW:3.6,spokeW:1.3,pinionZ:Ve,extra(e){s(e,h([[13.5,.43],[13.3,.62],[11.7,.62],[11.5,.43]],72),o(0,0,X0,A),G0);for(let t=0;t<3;t++)for(let n=0;n<8;n++){const a=Math.PI-45*L0+t*6*L0-n*45*L0,c=ze[t]-.34;s(e,h([[0,0],[.5,0],[.5,.56],[.4,.68],[0,.68]],10),o(Math.cos(a)*12.5,Math.sin(a)*12.5,c,A),p0),t>0&&s(e,d0(.3,c-X0-.4,8,.02),o(Math.cos(a)*12.5,Math.sin(a)*12.5,X0+.4,A),l0)}Ne(e,12.5,.2,X0,.675,72);for(let t=0;t<3;t++)for(let n=0;n<8;n++){const a=Math.PI-45*L0+t*6*L0-n*45*L0;z0(e,h([[.5,.56],[.52,.58],[.42,.7],[0,.72]],10),o(Math.cos(a)*12.5,Math.sin(a)*12.5,ze[t]-.34,A),g0)}{const t=h([[3.0060000000000002,.64],[2.2699999999999996,.975],[1.63,1.075]],28);z0(e,t,o(0,0,X0,A),g0),z0(e,t,o(0,0,X0,-A),g0)}}});await f.yield?.();const Ct=await Be({name:"greatWheel",x:ne,z:Ve,R:20,teeth:O,depth:1.25,thick:1.1,spokes:B,hubR:4,rimW:2.6,spokeW:1.7,extra(e){const t=[[0,-4.3],[6.1,-4.3],[6.1,-3.95],[5,-3.9]];for(let a=0;a<9;a++){const c=-3.9+a*.35;t.push([5,c+.03],[5.22,c+.175],[5,c+.32])}t.push([5,-.75],[6.1,-.7],[6.1,-.4],[0,-.4]),e.add(h(t,36),o(0,0,0,A),(a,c,i,u)=>{const v=c<-1.95&&c>-3.88&&Math.hypot(a,i)>4.9;u.set(v?"#7d7a6c":"#000000"),v||u.copy(p).multiplyScalar(.55),u.metal=v?0:1,u.rough=v?.9:.5});const n=w(1,1,1.4,.12);s(e,n,o(0,0,u0-1.9),R0);for(const a of[-4.3,-.75])z0(e,h([[6.1,a-.02],[6.14,a+.02],[6.14,a+.33],[6.1,a+.37]],36),o(0,0,0,A),g0);z0(e,h([[5.2,-4.32],[6,-4.32]],36),o(0,0,0,A),g0)}});await f.yield?.();const ot=e0/78,Te=[];{let e=0,t=W0;Te.push([Math.PI/2,2.6*L0]);for(let n=F;e+n<76;n=t++%12+1)e+=n,Te.push([((Math.PI/2-e*ot)%e0+e0)%e0,2.6*L0])}const Ft=await(async()=>{const e=new f0,n=Fe({R:12,teeth:0,depth:1.5,thick:.7,spokes:a0,hubR:2.6,rimW:2.4,spokeW:1,notches:Te});await f.yield?.(),e.add(n,o(0,0,re),(i,u,v,L)=>{const V=Math.hypot(i,u);L.copy(S).multiplyScalar(V>11.7?1.12:.9),L.metal=1,L.rough=V>11.7?.12:.34}),s(e,h([[1.5,-.75],[2.4,-.6],[2.4,.6],[1.5,.75]],20),o(0,0,re,A),q0);const a=h([[10.3,.33],[10.1,.5],[9.5,.5],[9.3,.33]],60);s(e,a,o(0,0,re,A),G0),s(e,a,o(0,0,re,-A),G0),Ne(e,9.8,.2,re,.52,60);const c=h0(e,S0,"countWheel");return c.position.set(ne,P0,0),c})();await f.yield?.();const Vt=await Be({name:"warningWheel",x:Me,z:Pe,R:7,teeth:c0,depth:.8,thick:.7,spokes:a0,hubR:2,rimW:1.3,spokeW:.8,pinionZ:Ve,extra(e){s(e,d0(.32,1.3,8),o(5.3,0,Pe,A),p0),s(e,h([[.7,0],[1.7,0],[1.7,.3],[.9,1.1],[.7,1.1]],16),o(0,0,3.2,A),p0),Ne(e,5.575,.15,Pe,.57,48),z0(e,h([[.34,.56],[.7,.56],[.7,.64],[.34,.7]],10),o(5.3,0,Pe,A),g0)}});await f.yield?.(),await f.yield?.();const E0=-13,U0=45.5,Nt=K0([[-3.2,0],[3.2,0],[3.2,.8],[1.3,3.2],[.75,24],[1.3,25],[1.3,26.4],[-1.3,26.4],[-1.3,25],[-.75,24],[-1.3,3.2],[-3.2,.8]],.8,[[[-.9,4.2],[.9,4.2],[.45,11],[-.45,11]],[[-.4,12.2],[.4,12.2],[.3,21.5],[-.3,21.5]]],.12);for(const e of[u0,b0])s(M,Nt,o(E0,Q,e),Z),s(M,w(7.6,.5,2.4,.1),o(E0,Q+.25,e),Z),s(M,h([[0,-.7],[1.1,-.7],[1.25,-.5],[1.25,.5],[1.1,.7],[0,.7]],14),o(E0,U0,e,A),Z);s(M,d0(.5,b0-u0+2.4,10,.1),o(E0,U0,u0-1.2,A),l0),s(M,d0(.42,5.6,10,.08),o(I0,Se,4.2,A),l0);const at=K0([[-2,0],[2,0],[2,.6],[.9,2],[.8,6],[1,7.4],[-1,7.4],[-.8,6],[-.9,2],[-2,.6]],.7,[[[-.35,2.4],[.35,2.4],[.3,5.2],[-.3,5.2]]],.1);s(M,at,o(I0,Q,b0+.9),Z),s(M,at,o(I0,Q,4.6),Z),s(M,w(4.6,.6,5.4,.12),o(I0,Q-.1,6.6),Z),s(M,w(.6,3.4,4,.12),o(I0,Q-2,6.2,.5),Z);const De=(u0+b0)/2;s(M,w(4.6,1.5,b0-u0+2.6,.2),o(U,Q+.75,De),Z),s(M,w(3.8,3.4,6.6,.3),o(U,Q+2.9,2),Z),s(M,w(3,.3,5.6,.1),o(U,Q+4.7,2),Le),s(M,h([[0,24.6],[2.9,24.6],[2.9,25.2],[2.3,25.6],[1.9,26.6],[1.75,27.2],[1.95,27.5],[1.95,28],[1.7,28.3],[1.15,40.6],[1.4,41],[1.4,41.5],[1.75,42],[1.75,42.9],[1.2,43.2],[0,43.2]],16),o(U,0,t0),Z),s(M,h([[.7,43.1],[1,43.1],[1,43.5],[.7,43.5]],14),o(U,0,t0),G0);for(const e of[-1,1]){s(M,d0(.22,1,8,.01),ae(new r.Vector3(U,Q+1.4,De+e*6.4),new r.Vector3(U,35.5,t0+e*1.3)),R0);for(const t of[-1.6,1.6])s(M,h(O0(.3,.4,.05),6),o(U+t,Q+1.5,De+e*6.9),R0)}s(M,h([[0,35.2],[1.75,35.2],[1.85,35.4],[1.85,35.9],[1.75,36.1],[0,36.1]],16),o(U,0,t0),Le),s(M,d0(.38,1,10,.005),ae(new r.Vector3(Me+1.2,P0,3.9),new r.Vector3(U-1.9,P0,3.9)),l0),s(M,h([[.4,0],[1.6,0],[1.6,.3],[.8,1],[.4,1]],16),o(Me+2.1,P0,3.9,0,0,Math.PI/2),p0),await f.yield?.();{const e=I(S,1,.12,1.3),t=de+1.8,n=(u,v,L)=>new r.Vector3(u,v,L),a=h([[0,42],[.62,42],[.62,42.5],[.36,43.2],[.3,52.5],[.36,61.6],[.6,62.1],[.6,62.9],[.4,63.3],[.4,64.2],[.55,64.4],[.55,64.9],[0,65.1]],10),c=h([[.3,0],[.5,.06],[.5,.5],[.3,.56]],10),i=[[18.2,u0],[18,b0],[30.6,u0],[29.3,b0]];for(let u=0;u<4;u++){const v=(u<2?Math.PI:0)+(u%2?1:-1)*(u<2?-1:1)*Math.PI/6,L=Math.cos(v),V=Math.sin(v),N=U+L*t,m=t0+V*t;j(M,a,o(N,0,m),Z);for(const W of[44.6,59.4])j(M,c,o(N,W,m),e);j(M,w(t-1.2,1.1,.34,.08),o(U+L*(t+1.2)/2,42.35,t0+V*(t+1.2)/2,0,-v,0),Z),j(M,w(t-1,.2,.9,.06),o(U+L*(t+1)/2,42.95,t0+V*(t+1)/2,0,-v,0),Le);for(const W of[46.2,57.8])j(M,w(1,.5,.5,.08),o(N-L*.75,W,m-V*.75,0,-v,0),Y0),j(M,w(.4,.6,.6,.08),o(N-L*1.35,W,m-V*1.35,0,-v,0),g0);const E=i[V<0?L<0?0:2:L<0?1:3];j(M,d0(.2,1,8,.004),ae(n(E[0],Q-.1,E[1]),n(N-L*.5,42.3,m-V*.5)),R0),j(M,w(1.6,.4,1.6,.1),o(E[0],Q+.2,E[1]),Z),j(M,w(t-.4,.7,.4,.1),o(U+L*(t+.4)/2,64.05,t0+V*(t+.4)/2,0,-v,0),Z),await f.yield?.()}j(M,h([[t-.25,62.25],[t+.25,62.25],[t+.25,62.75],[t-.25,62.75],[t-.25,62.25]],56),o(U,0,t0),Y0),j(M,h([[t+.25,62.38],[t+.33,62.42],[t+.33,62.58],[t+.25,62.62]],56),o(U,0,t0),e),j(M,h([[6.75,42.7],[7.25,42.7],[7.25,43.2],[6.75,43.2],[6.75,42.7]],40),o(U,0,t0),Y0),j(M,h([[7.25,42.82],[7.33,42.86],[7.33,43.04],[7.25,43.08]],40),o(U,0,t0),e),j(M,h([[.9,63.55],[1.5,63.55],[1.7,63.75],[1.7,64.5],[1.3,64.75],[.5,64.75],[.5,65],[0,65]],16),o(U,0,t0),e);for(const u of[-1,1])j(M,h(O0(.2,.3,.04),6),o(U+u*1.15,64.7,t0),R0);for(const[u,v]of[[29.2,1.72],[39.3,1.3]])j(M,h([[v-.1,u],[v+.12,u+.08],[v+.12,u+.62],[v-.1,u+.7]],16),o(U,0,t0),e)}await f.yield?.();const lo=h0(M,S0,"static");await f.yield?.();const N0=new r.Group;N0.position.set(U,0,t0),V0.add(N0);const nt=pe({FLY:""});{const e=new f0,t=w0-s0,n=(s0+w0)/2,a=1.1,c=de,i=(a+c)/2,u=c-a,v=I(T.clone().lerp(p,.72),1,.25,.9),L=I(S,1,.14,1.25),V=h([[1.9,0],[1.7,.08],[1.3,.2],[.7,.28],[0,.3]],20,!0),N=h([[1.9,0],[2.15,0],[2.15,.1],[2,.18],[1.9,.1]],20),m=h([[2.55,0],[2.85,0],[2.85,.05],[2.55,.05]],10,!1,1.9,-.95),E=h([[1.25,0],[1.75,0],[1.75,.16],[1.6,.26],[1.4,.26],[1.25,.16]],24),W=h([[0,0],[1.25,0],[1.25,.12],[.5,.3],[0,.32]],24);for(let z=0;z<2;z++){const i0=o(0,0,0,0,z*Math.PI,0),r0=(Y,M0,T0,ue=0,xe=0,Ce=0)=>i0.clone().multiply(o(Y,M0,T0,ue,xe,Ce));s(e,w(u,t,.16,.04),r0(i,n,0),v);for(const Y of[s0+.4,w0-.4])s(e,w(u+.2,.8,.5,.1),r0(i,Y,0),l0);for(const Y of[s0+t/3,s0+2*t/3])s(e,w(u-.6,.5,.4,.08),r0(i,Y,0),l0);s(e,w(.8,t,.56,.1),r0(c-.4,n,0),g0);for(const Y of[-1,1])s(e,E,r0(i,n,Y*.08,Y*A),G0),s(e,W,r0(i,n,Y*.08,Y*A),l0);s(e,w(.9,t,.6,.1),r0(a+.45,n,0),l0);for(let Y=0;Y<3;Y++){const M0=s0+Y*t/3+(Y===0?.8:.25),T0=s0+(Y+1)*t/3-(Y===2?.8:.25),ue=(M0+T0)/2,xe=T0-M0,Ce=a+.9,xt=c-.8,Ze=xt-Ce;for(const j0 of[M0+.09,T0-.09])j(e,w(Ze,.18,.36,.05),r0(i+.05,j0,0),L);for(const j0 of[Ce+.09,xt-.09])j(e,w(.18,xe-.36,.36,.05),r0(j0,ue,0),L);if(Y!==1){const j0=Math.hypot(Ze-.5,xe-.5),je=Math.atan2(xe-.5,Ze-.5);for(const he of[-1,1])j(e,w(j0,.3,.3,.06),r0(i+.05,ue,0,0,0,he*je),l0);for(const he of[-1,1])j(e,V,r0(i+.05,ue,he*.08,he*A),p0),j(e,N,r0(i+.05,ue,he*.08,he*A),L);await f.yield?.()}else for(const j0 of[-1,1])for(const je of[0,Math.PI])j(e,m,r0(i,n,j0*.08,j0*A,0,je),p0)}if(await f.yield?.(),F0===1&&s(e,w(.5,t-1.2,.4,.08),r0(i,n,0),l0),F0===2)for(const Y of[-1,1])s(e,w(Math.hypot(u-1.4,t/3-.6),.36,.34,.06),r0(i,n,0,0,0,Y*Math.atan2(t/3-.6,u-1.4)),l0);for(const Y of[s0+1.3,w0-1.3])s(e,w(2.6,2.6,.62,.12),r0(c-1.3,Y,0),g0);const wt=h([[0,0],[.13,0],[.1,.07],[0,.09]],5);for(const Y of[-1,1]){for(let M0=0;M0<9;M0++)for(const T0 of[s0+.4,s0+t/3,s0+2*t/3,w0-.4])s(e,wt,r0(a+1.3+M0*.95,T0,Y*(T0===s0+.4||T0===w0-.4?.25:.2),Y*A),p0);for(let M0=0;M0<11;M0++)s(e,wt,r0(c-.4,s0+3.2+M0*.96,Y*.25,Y*A),p0)}for(const Y of[s0+1.6,n,w0-1.6])s(e,w(2,1.3,1.5,.2),r0(1.1,Y,0),q0);await f.yield?.()}N0.userData.vanes=h0(e,nt,"flyVanes",N0),await f.yield?.();const x=new f0,X=(s0+w0)/2;s(x,h([[0,42.6],[.72,42.6],[.72,61.2],[1,61.4],[1,61.8],[.5,62.1],[.85,62.7],[.85,63],[.35,63.7],[0,63.8]],14),null,p0);for(const z of[43.6,60.5])s(x,h([[.7,z],[1.45,z],[1.6,z+.15],[1.6,z+.45],[1.45,z+.6],[.7,z+.6]],16),null,G0);for(const z of[s0+1.6,X,w0-1.6])s(x,h([[.7,z-.75],[1.5,z-.75],[1.75,z-.5],[1.75,z+.5],[1.5,z+.75],[.7,z+.75]],16),null,q0);for(let z=0;z<4;z++)s(x,w(.5,15.4,.22,.06),o(Math.cos(z*Math.PI/2)*.8,X,Math.sin(z*Math.PI/2)*.8,0,-z*Math.PI/2),Ee);N0.userData.arbor=h0(x,S0,"flyArbor",N0)}await f.yield?.();const ke=Object.assign(r.UniformsUtils.clone(r.UniformsLib.fog),{uBlur:{value:0},uAng:{value:0},uTime:x0.uTime,uPale:{value:T.clone().lerp(q,.35).multiplyScalar(.8)},uRed:{value:d.clone().multiplyScalar(.82)},uSheen:{value:T.clone().lerp(q,.25).multiplyScalar(.85)},uSteel:{value:p.clone().multiplyScalar(.5)},uDense:{value:1},uY:{value:new r.Vector2(s0,w0-s0)},uR:{value:de}}),Bt=new r.ShaderMaterial({uniforms:ke,fog:!0,transparent:!0,depthWrite:!1,side:r.DoubleSide,vertexShader:`varying vec3 vL; varying vec3 vNv; varying vec3 vVv;
      #include <common>
      #include <fog_pars_vertex>
      void main(){ vL = position; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
      vNv = normalMatrix * normal; vVv = -mvPosition.xyz;
      #include <fog_vertex>
      }`,fragmentShader:`uniform float uBlur, uAng, uTime, uR, uDense; uniform vec3 uPale, uRed, uSheen, uSteel; uniform vec2 uY; varying vec3 vL; varying vec3 vNv; varying vec3 vVv;
      #include <common>
      #include <fog_pars_fragment>
      float hh(float x){ return fract(sin(x * 127.1) * 43758.5453); }
      // smooth noise that closes round the drum: n cells per turn
      float streak(float a, float n, float seed){ float x = a / 6.2831853 * n; float i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
        return mix(hh(mod(i, n) + seed), hh(mod(i + 1.0, n) + seed), f); }
      // The fly at speed is a glass SHELL of blur: the surface its tips sweep, thin as a film. Looked at square on there is next
      // to nothing of it in the way, so the arbor, the cage and the train show clear through its middle; where the sight grazes
      // it (the limb) it looks along the film and through the most of it, and there it is the dense blue-grey of the smeared
      // plates. So the drum has a firm outline against a white dial, one thin red ring at each end where the corner tips run,
      // and nothing level across its body: only the fine upright streaks of the blur, faint, drifting slowly round.
      void main(){
        float r = length(vL.xz); float a = atan(vL.z, vL.x + 1e-5); float yf = clamp((vL.y - uY.x) / uY.y, 0.0, 1.0);
        float side = smoothstep(uR - 0.3, uR - 0.05, r);
        // how the sight meets the film: 0 square on, 1 along it; it falls away from the limb in a metre and a half
        float graze = abs(dot(normalize(vNv + vec3(1e-5)), normalize(vVv + vec3(1e-5)))); graze = exp(-4.0 * graze * graze);
        float sqOn = (1.0 - graze) * (1.0 - graze);                                     // the streaks live where the film is seen square on: none crowd together along the limb
        // streaks: the drum turns with the fly, so a pattern at (a - 0.96 uAng) drifts slowly in the room and never strobes
        float fine = smoothstep(0.52, 0.94, streak(a - uAng * 0.93, 18.0, 3.0));
        float hair = smoothstep(0.58, 0.97, streak(a - uAng * 1.035, 16.0, 11.0));
        float st = clamp(0.6 * fine + 0.35 * hair, 0.0, 1.0);
        // a thin red ring at the top and bottom edge: feathered inside, a brighter core
        float dEdge = mix(uR - r, min(yf, 1.0 - yf) * uY.y, side);
        float feather = mix(1.0, smoothstep(0.0, 0.25, dEdge), side);                           // no hard top and bottom edge
        // the swept corner tips: one thin ring on the very edge, half a metre of true red; the far rim is dimmer, so it reads as depth
        float redm = mix((1.0 - smoothstep(0.25, 0.6, dEdge)) * smoothstep(0.0, 0.12, dEdge) * 0.9, 0.94 * (1.0 - smoothstep(0.10, 0.28, abs(dEdge - 0.30))), side);
        redm *= gl_FrontFacing ? 1.0 : 0.45;
        float shim = 0.5 + 0.5 * sin(a * 3.0 + uAng * 0.21 + yf * 2.0) * sin(uTime * 7.0 + a * 2.0);
        // the film: nearly clear square on, dense along the sight; the end discs are thinner still, so the eye looks in at the top
        float alpha = mix(0.04 + 0.22 * graze, 0.12 + 0.72 * graze, side) + (0.24 * st + 0.02 * shim) * mix(0.5, 1.0, side) * sqOn;
        alpha = mix(alpha, 0.9, redm) * feather * uBlur;
        vec3 col = mix(uPale * 0.55, mix(uPale, uSheen, 0.5), st * sqOn);
        col = mix(col, uRed * (1.15 + 0.15 * st), redm);                              // signal red, under the bloom threshold: it must not go orange
        gl_FragColor = vec4(col, clamp(alpha * uDense, 0.0, 0.94));
        #include <fog_fragment>
      }`}),ge=new r.Mesh(h([[1.2,s0],[de,s0],[de,w0],[1.2,w0]],56),Bt);ge.frustumCulled=!1,ge.renderOrder=3,ge.visible=!1,N0.add(ge),Ae+=336;const Oe=e=>(t,n,a,c)=>{t>e?(c.copy(d),c.metal=0,c.rough=.4):(c.copy(p).multiplyScalar(.95),c.metal=1,c.rough=.3)},Ht=ze.map((e,t)=>{const n=new f0,a=u=>.34+.62*Math.exp(-((u/1.5)**2))+.16*Math.exp(-(((u+Re-.7)/.7)**2))+(u>Q0-1.6?.3*D0((u-Q0+1.6)/.9)*(1-D0((u-Q0+.4)/.4)):0),c=u=>(u>Q0-3?.07*(u-Q0+3)**2:0)+.25*D0(-u/Re);n.add(K0(He(-Re,Q0,a,c,30),.46,[],.08),null,Oe(Q0-2.3)),s(n,h([[.42,-.36],[.95,-.36],[1.05,-.26],[1.05,.26],[.95,.36],[.42,.36]],14),o(0,0,0,A),q0),t===0&&s(n,h([[0,0],[.5,0],[.5,.5],[.3,.9],[0,.9]],8),o(-Re+.6,.55,0),R0);const i=h0(n,S0,"liftLever"+t);return i.position.set(I0,Se,e),i});await f.yield?.();const le=26,rt=-4.4,Tt=(()=>{const e=new f0,t=a=>.36+.75*Math.exp(-((a/1.8)**2))+.1*D0(a/le)+(a<0?.25*D0(-a/4):0);e.add(K0(He(-4.5,le,t,a=>a>le-2.5?-.09*(a-le+2.5)**2:0,34),.5,[],.09),null,Oe(le-2.6)),s(e,h([[.5,-.4],[1.1,-.4],[1.2,-.28],[1.2,.28],[1.1,.4],[.5,.4]],14),o(0,0,0,A),q0),s(e,w(2.2,2.2,1.3,.25),o(-3.9,0,0),I(p,1,.55,.5)),s(e,d0(.2,14.2,8),o(24.4,-14.6,.9),l0),s(e,w(1.2,.7,2.2,.1),o(24.4,-.4,.5),l0),s(e,w(1.5,.8,.6,.1),o(24.1,-14.9,1.1),p0);const n=h0(e,S0,"warningLever");return n.position.set(E0,U0,rt),n})(),ee=new r.Vector2(ne-E0,P0+12-U0),Dt=(()=>{const e=new f0,t=ee.length(),n=Math.atan2(ee.y,ee.x),a=i=>.3+.6*Math.exp(-((i/1.5)**2))+(i>t-1.2?.35*(1-Math.abs((i-t+.6)/.6)):0);e.add(K0(He(-2.2,t+.5,a,i=>.9*Math.sin(Math.PI*Math.min(1,Math.max(0,i/t))),26),.44,[],.08),o(0,0,0,0,0,n),Oe(1e9)),s(e,h([[.5,-.36],[1,-.36],[1.1,-.25],[1.1,.25],[1,.36],[.5,.36]],14),o(0,0,0,A),q0),s(e,w(.7,1.9,.5,.1),o(ee.x,ee.y-.2,0),p0),z0(e,w(.86,.7,.66,.1),o(ee.x,ee.y+.3,0),g0);const c=h0(e,S0,"lockingLever");return c.position.set(E0,U0,re),c})();await f.yield?.();const Z0=me.clone().addScaledVector(C0,Je),st=pe({WIRE:""},{uSlack:{value:0},uLen:{value:Je},uFill:{value:.3}}),Ot=(()=>{const n=[],a=[],i=Je-3.4,u=(N,m)=>{const E=-.3+(i- -.3)*(N/230),W=m/8*e0,x=.2*(1+.05*Math.cos(3*W+E*2.4));return[Math.cos(W)*x,E,Math.sin(W)*x,Math.cos(W),0,Math.sin(W)]};for(let N=0;N<230;N++)for(let m=0;m<8;m++){const E=u(N,m),W=u(N+1,m),x=u(N+1,m+1),X=u(N,m+1);for(const z of[E,W,X,W,x,X])n.push(z[0],z[1],z[2]),a.push(z[3],z[4],z[5])}const v=new r.BufferGeometry;v.setAttribute("position",new r.Float32BufferAttribute(n,3)),v.setAttribute("normal",new r.Float32BufferAttribute(a,3));const L=new f0;L.add(v,null,I(p,1,.42,.8),1,.42);{const N=h([[.2,0],[.33,.1],[.36,.3],[.36,.9],[.33,1.1],[.2,1.2]],10),m=I(S,1,.16,1.3);for(let E=9;E<i-6;E+=13)L.add(N,o(0,E,0),m,1,.16)}{const N=h([[.2,0],[.31,.06],[.31,.62],[.2,.68]],10);for(let m=9;m<i-6;m+=13)z0(L,N,o(0,m+1.3,0),g0)}const V=h0(L,st,"hammerWire");return V.position.copy(me),V.quaternion.setFromUnitVectors(new r.Vector3(0,1,0),C0),V})();await f.yield?.();const lt=new r.Vector3(1.05*Math.sin(Math.PI/3),-1.05*Math.cos(Math.PI/3),-1.75),k0=e=>me.clone().addScaledVector(C0,(e-me.y)/C0.y).add(lt),Ie=k0(J0+.45),te=Ie.clone().addScaledVector(C0,8),n0=Math.round((Ie.x+2)*10)/10,y0=Math.round((Ie.z-.95)*10)/10,ye=1.6,m0=new r.Vector3(n0,J0+1.6-4.6*ye,y0+16.9+5.2*ye);let it=null,be=null,We=null,we=null;if(P.bell!==!1){const e=A0,t=[[17*e,.3],[16.75*e,1.2],[15.3*e,3],[14.2,4.6],[14.35,4.8],[14,5.1],[13.4,6],[11.9,10],[10.7,15],[9.9,20],[9.45,23.6],[9.6,23.8],[9.6,24.2],[9.35,24.4],[8.8,26.5],[7.2,28.3],[4.5,29.3],[2,29.8],[0,30]],n=[[0,27.9],[2.5,27.7],[5,27.2],[7.4,26],[8.4,24],[8.9,20.5],[8.7,20.2],[8.72,19.8],[8.98,19.5],[9.75,15],[10.6,11.4],[10.42,11.1],[10.46,10.7],[10.8,10.4],[12.3,6],[12.75,4.9],[12.5,4.5],[12.55,3.7],[13.5*e,2.9],[15*e,1.2],[16*e,.3],[16.5*e,0],[17*e,.3]];we=pe({BELL:""},{uRing:{value:0},uRingPhase:{value:0}}),we.side=r.DoubleSide;const a=new f0,c=I(new r.Color("#9c8d5c"),1,.4);a.add(h(t,96,!0),null,(x,X,z,i0)=>{i0.copy(c).multiplyScalar(X<1.4?1.25:1),i0.metal=1,i0.rough=X<1.4?.3:.44}),s(a,h(n,96,!0),null,I(c,1,.6,.55)),it=h0(a,we,"bell"),it.position.set(n0,J0,y0),await f.yield?.();const i=new f0,u=J0+$e;s(i,h([[0,u-.3],[3.4,u-.3],[3.4,u+.5],[2.4,u+1.3],[0,u+1.3]],10),o(n0,0,y0),At),s(i,w(7.5,5.5,46,.35),o(n0,u+4,y0),$0),s(i,w(5.5,2.4,30,.3),o(n0,u+7.9,y0),$0);for(const x of[-17.5,-6,6,17.5]){s(i,w(8.1,6.3,.9,.08),o(n0,u+4,y0+x),Y0);for(const X of[-1,1])s(i,h(O0(.35,.5,.06),6),o(n0+X*2.6,u+6.75,y0+x),Y0)}for(const x of[-1,1])s(i,d0(1.1,3.2,12,.15),o(n0,u+4,y0+x*23-(x>0?0:3.2),A),Y0),s(i,w(9.5,8.5,2.6,.3),o(n0,u+2.2,y0+x*25.2),$0);s(i,w(16,2.2,2.6,.2),o(n0,m0.y-2.5,m0.z),$0);for(const x of[-1,1])s(i,w(1.8,m0.y-1.4-150,1.8,.15),o(n0+x*7,(m0.y-1.4+150)/2,m0.z),$0),s(i,K0([[-1.6,-1.5],[1.6,-1.5],[1,1.1],[-1,1.1]],.6),o(n0+x*1.35,m0.y,m0.z,0,Math.PI/2),Y0);s(i,d0(.5,4.2,10),o(n0-2.1,m0.y,m0.z,0,0,-Math.PI/2),l0);const v=Z0.clone().add(new r.Vector3(.7,1.2,.5)),L=new r.Vector3(n0,m0.y-.5*ye,m0.z+6.8*ye);s(i,w(1.8,1.8,30,.16),o(v.x+.6,v.y+1.9,v.z+16.4),$0);for(const x of[18,30])s(i,w(1.5,v.y+1-150,1.5,.14),o(v.x+.6,(v.y+1+150)/2,v.z+x),$0);s(i,K0([[-.42,-.42],[.42,-.42],[2,.16],[2.1,.4],[2,.64],[.5,.5],[.26,2],[0,2.14],[-.26,2],[-.5,.34],[-1.76,-.72],[-1.52,-1.12]],.36,[],.08),o(v.x,v.y,v.z,0,0,0,.8),l0),s(i,h([[0,-.3],[.3,-.3],[.38,-.22],[.38,.22],[.3,.3],[0,.3]],16),o(v.x,v.y,v.z,A),Ee),s(i,h([[0,-.4],[.22,-.4],[.22,.4],[0,.4]],8),o(v.x,v.y,v.z,A),R0);for(const[x,X]of[[1.48,.32],[0,1.52],[-1.28,-.72]])s(i,h([[0,-.26],[.13,-.26],[.16,-.22],[.16,.22],[.13,.26],[0,.26]],8),o(v.x+x,v.y+X,v.z,A),Ee);s(i,w(.7,1.7,.7,.26),o(v.x+.3,v.y+.85,v.z+.7),Y0);for(const x of[.2,1.3])s(i,h(O0(.16,.2,.04),6),o(v.x-.16,v.y+x,v.z+.75,0,0,Math.PI/2),p0);s(i,d0(.3,1,8,.01),ae(Z0.clone().addScaledVector(C0,-5.2),Z0.clone().addScaledVector(C0,.4)),R0),s(i,d0(.2,1,8,.002),ae(v.clone().add(new r.Vector3(0,1.6,.2)),L),l0),h0(i,S0,"belfryStatic"),await f.yield?.();const V=new f0;V.add(K0([[-.9,-.9],[.9,-.9],[1.8,.4],[3.9,3.4],[3.9,5.6],[2.7,5.6],[.6,1.6],[-6.4,.3],[-7.2,.5],[-7.4,-.5],[-6.6,-.9]],1.1,[],.12),o(0,0,0,0,Math.PI/2),I(p,1,.5,.55),1,.5),V.add(h([[0,-1.9],[1.35,-1.9],[1.6,-1.6],[1.6,-.55],[1.68,-.5],[1.68,.5],[1.6,.55],[1.6,1.4],[1.3,1.9],[0,1.9]],18),o(0,4.6,-3.3,A),(x,X,z,i0)=>{Math.abs(X)<.52&&Math.hypot(x,z)>1.6?(i0.copy(d),i0.metal=0,i0.rough=.4):(i0.copy(p).multiplyScalar(.7),i0.metal=1,i0.rough=.36)}),V.add(h([[0,-2.32],[1.22,-2.32],[1.36,-2.2],[1.36,-1.9],[0,-1.9]],18),o(0,4.6,-3.3,A),I(new r.Color("#57534e"),0,.9),0,.9);for(let x=0;x<6;x++){const X=x/6*e0+.3;V.add(h([[0,0],[.16,0],[.2,.06],[.2,.16],[.12,.22],[0,.22]],6),o(Math.cos(X)*1.66,4.6+Math.sin(X)*1.66,-3.3,0,0,X-Math.PI/2),I(p,1,.2,1.2),1,.2)}V.add(w(.5,1,4.4,.16),o(0,6.3,-3.3),I(p,1,.45,.6),1,.45),V.add(h([[0,-.75],[.9,-.75],[1.1,-.55],[1.1,.55],[.9,.75],[0,.75]],14),o(0,0,0,0,0,Math.PI/2),I(S,1,.3,.9),1,.3),be=h0(V,S0,"hammer"),be.position.copy(m0),be.scale.setScalar(ye);const N=new f0,m=24,E=I(p,1,.5,.5),W=I(new r.Color("#8a8672"),0,.9);s(N,h([[0,-m-5],[.42,-m-4.9],[.6,-m-4.5],[.55,-m-2.7],[.8,-m-2.1],[1.4,-m-1.4],[1.62,-m-.4],[1.5,-m+.6],[1,-m+1.7],[.62,-m+2.5],[.5,-m+3.2],[0,-m+3.2]],16),null,E),j(N,w(.95,m-3.6,.4,.12),o(0,-(m+2.4)/2,0),E),j(N,h([[.5,-m+3],[.78,-m+3.1],[.78,-m+3.5],[.5,-m+3.6]],12),null,I(p,1,.3,.9)),j(N,h([[0,-1.5],[.6,-1.4],[.85,-.7],[.85,0],[0,0]],10),null,E);for(let x=0;x<6;x++)j(N,h([[.57,-.13],[.74,-.08],[.78,0],[.74,.08],[.57,.13]],10),o(0,-m-4.2+x*.25,0,.06*(x%2?1:-1)),W);s(N,d0(.2,1,6,.002),ae(new r.Vector3(.5,-m-3.6,0),new r.Vector3(-3,-m-15,0)),W),We=h0(N,S0,"clapper"),We.position.set(n0,J0+27,y0)}await f.yield?.();const ct=ne-5.15,ft=-3,ut=13.5,B0=new r.Group;B0.position.set(ct,ut,ft),V0.add(B0);{const e=new f0,t=[[0,-7.4],[2,-7.4],[2.2,-7.2]];for(let a=0;a<5;a++){const c=-7.2+a*1.3;t.push([2.2,c+1.14],[2.05,c+1.22],[2.2,c+1.3])}t.push([2.2,-.9],[1.5,-.5],[.5,-.3],[.5,.2],[0,.2]),s(e,h(t,18),null,I(_,0,.55,2.2)),s(e,h([[.25,0],[.6,0],[.75,.3],[.6,.9],[.25,.9]],8),null,R0),z0(e,h([[2.2,-3.22],[2.25,-3.17],[2.25,-2.29],[2.2,-2.24]],18),null,g0),h0(e,S0,"weight",B0);const n=new f0;s(n,d0(.2,1,8,.002),null,I(new r.Color("#7d7a6c"),0,.9)),B0.userData.line=h0(n,S0,"weightLine",B0),B0.userData.line.position.y=.6}await f.yield?.();let _e=null,H0=null,ie=null;if(P.dust!==!1){const e=Math.round(3e3*K),t=new Float32Array(e*4),n=new Float32Array(e*3);for(let m=0;m<e;m++)t[m*4]=4+44*Math.sqrt(R()),t[m*4+1]=R.range(24,82)-12*R()*R(),t[m*4+2]=R()*e0,t[m*4+3]=R();const a=new r.BufferGeometry;a.setAttribute("position",new r.BufferAttribute(n,3)),a.setAttribute("aS",new r.BufferAttribute(t,4)),H0=Object.assign(r.UniformsUtils.clone(r.UniformsLib.fog),{uTime:x0.uTime,uSwirl:{value:0},uPull:{value:0},uBufH:{value:450},uAxis:{value:new r.Vector2(U,t0)},uCol:{value:T.clone().lerp(q,.3).multiplyScalar(.36)}}),_e=new r.Points(a,new r.ShaderMaterial({uniforms:H0,fog:!0,transparent:!0,depthWrite:!1,blending:r.AdditiveBlending,vertexShader:`attribute vec4 aS; uniform float uTime, uSwirl, uPull, uBufH; uniform vec2 uAxis; varying float vA;
        #include <common>
        #include <fog_pars_vertex>
        void main(){ float r = aS.x; float k = 14.0 / max(r, 9.0);
          float ang = aS.z - uSwirl * k * k + uTime * 0.03 * (aS.w - 0.5);
          r *= 1.0 - 0.38 * uPull * (1.0 - smoothstep(12.0, 44.0, r));
          float y = aS.y + sin(uTime * 0.13 + aS.w * 40.0) * 1.5 + uPull * 3.0 * k * sin(ang * 0.5 + aS.w * 6.0) - uTime * 0.05 * aS.w;
          vec3 p = vec3(uAxis.x + cos(ang) * r, y, uAxis.y + sin(ang) * r);
          vec4 mvPosition = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mvPosition;
          float sz = (0.16 + 0.3 * fract(aS.w * 7.3)) * (1.0 + uPull * (0.5 + 1.1 * k));
          float arm = 0.5 + 0.5 * cos(2.0 * ang + 0.2 * r - uSwirl * 0.35); arm = mix(1.0, 0.25 + 3.2 * arm * arm * arm, uPull * (1.0 - smoothstep(30.0, 52.0, r)));
          float px = sz * projectionMatrix[1][1] * uBufH * 0.5 / max(-mvPosition.z, 0.5);
          vA = clamp(px / 1.6, 0.0, 1.0) * (0.55 + 0.45 * sin(uTime * 1.7 + aS.w * 91.0)); vA *= smoothstep(4.0, 16.0, -mvPosition.z) * arm * (1.0 + 0.8 * uPull * k) * mix(1.0, 1.7 / (1.0 + (r / 14.0) * (r / 14.0)), uPull); gl_PointSize = clamp(px, 1.6, uBufH * 0.006);
          #include <fog_vertex>
        }`,fragmentShader:`uniform vec3 uCol; varying float vA;
        #include <common>
        #include <fog_pars_fragment>
        void main(){ vec2 q = gl_PointCoord - 0.5; float d = 1.0 - smoothstep(0.1, 0.5, length(q));
          gl_FragColor = vec4(uCol * d * vA, 1.0);
          #ifdef USE_FOG
            #ifdef FOG_EXP2
              float ff = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
            #else
              float ff = smoothstep(fogNear, fogFar, vFogDepth);
            #endif
            gl_FragColor.rgb *= 1.0 - ff;
          #endif
        }`})),_e.frustumCulled=!1,_e.renderOrder=4,V0.add(_e),await f.yield?.();const c=Math.round(260*K),i=10,u=new Float32Array(c*i*6*4),v=new Float32Array(c*i*6*2),L=new Float32Array(c*i*6*3);let V=0;for(let m=0;m<c;m++){const E=13.5+24*Math.pow(R(),1.6),W=R.range(38,74),x=R()*e0,X=R();for(let z=0;z<i;z++)for(const[i0,r0]of[[z,-1],[z+1,-1],[z,1],[z+1,-1],[z+1,1],[z,1]])u[V*4]=E,u[V*4+1]=W,u[V*4+2]=x,u[V*4+3]=X,v[V*2]=i0/i,v[V*2+1]=r0,V++}const N=new r.BufferGeometry;N.setAttribute("position",new r.BufferAttribute(L,3)),N.setAttribute("aS",new r.BufferAttribute(u,4)),N.setAttribute("aT",new r.BufferAttribute(v,2)),ie=new r.Mesh(N,new r.ShaderMaterial({uniforms:H0,fog:!0,transparent:!0,depthWrite:!1,blending:r.AdditiveBlending,side:r.DoubleSide,vertexShader:`attribute vec4 aS; attribute vec2 aT; uniform float uTime, uSwirl, uPull, uBufH; uniform vec2 uAxis; varying float vA; varying float vS;
        #include <common>
        #include <fog_pars_vertex>
        void main(){ float r0 = aS.x; float k = 14.0 / max(r0, 9.0);
          float len = (0.42 + 0.8 * aS.w) * uPull * k;                                      // radians of trail
          float ang = aS.z - uSwirl * k * k * (0.8 + 0.4 * aS.w) + aT.x * len;
          float r = r0 * (1.0 - 0.3 * uPull * (1.0 - smoothstep(12.0, 40.0, r0))) + aT.x * 1.6 * uPull;
          float y = aS.y + sin(uTime * 0.21 + aS.w * 40.0) * 1.2 + mod(uSwirl * (0.6 + aS.w), 9.0) - 4.5 - aT.x * 2.2 * uPull;
          vec3 p = vec3(uAxis.x + cos(ang) * r, y, uAxis.y + sin(ang) * r);
          vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
          float px = projectionMatrix[1][1] * uBufH * 0.5 / max(-mvPosition.z, 0.5);        // pixels per metre here
          float wdt = max(0.035 + 0.05 * fract(aS.w * 5.3), 0.9 / px);
          p.y += aT.y * wdt;
          mvPosition = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mvPosition;
          float cyc = mod(uSwirl * (0.6 + aS.w), 9.0) / 9.0;
          vA = uPull * (1.0 - aT.x) * (1.0 - aT.x) * smoothstep(0.0, 0.3, aT.x) * 1.5 * sin(3.14159 * cyc) / (1.0 + (r0 / 26.0) * (r0 / 26.0)) * clamp((0.035 + 0.05 * fract(aS.w * 5.3)) * px / 0.9, 0.25, 1.0)
            * smoothstep(3.0, 12.0, -mvPosition.z) * (0.6 + 0.9 * k);
          vS = aT.y;
          #include <fog_vertex>
        }`,fragmentShader:`uniform vec3 uCol; varying float vA; varying float vS;
        #include <common>
        #include <fog_pars_fragment>
        void main(){ float d = 1.0 - vS * vS;
          gl_FragColor = vec4(uCol * (1.25 * d * vA), 1.0);
          #ifdef USE_FOG
            #ifdef FOG_EXP2
              float ff = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
            #else
              float ff = smoothstep(fogNear, fogFar, vFogDepth);
            #endif
            gl_FragColor.rgb *= 1.0 - ff;
          #endif
        }`})),ie.frustumCulled=!1,ie.renderOrder=4,ie.visible=!1,V0.add(ie),Ae+=c*i*2}const _0=D0,qe=l.warning-l.release,ht=45*L0,It=ht/l.interval,Ge=.31,dt=F*l.interval+.3-Ge,ce=.16,Ye=e0*3.2,Wt=e=>e<=0?0:Math.min(dt,e-.15*(1-Math.exp(-e/.15))),oe=dt+.15,mt=[];for(let e=1;e<=F;e++)mt.push(l.release+e*l.interval+.15+ce-Ge);const qt=new r.Vector3(-(te.x-n0),0,-(te.z-y0)).normalize().cross(new r.Vector3(0,1,0)),fe={strikeT:0,blur:0,haul:0,flyAngle:0,sinceBlow:99};let vt=!1,pt=!1,gt=0,yt=0;function Gt(e){let t=v0+Math.PI*_0((e-qe)/.7),n=0;if(e>0){const a=Math.min(e,oe),c=Math.min(a,3);if(t+=Ye*(c*c*c)/27+Ye*Math.max(0,a-3),n=Ye*Math.min(1,(a/3)**2),e>oe){const i=Math.min(e-oe,3);t+=n*(i-i*i/6),n*=1-i/3}}gt=t,yt=n}function Ke(e){fe.strikeT=e;const t=Wt(e),n=It*(t+Ge);_t.rotation.z=n,Ct.rotation.z=-n*.3,Ft.rotation.z=Math.min(t/l.interval,F)*ot,Vt.rotation.z=t*1.15+.6*_0((e-qe)/.5);let a=0,c=99;for(let E=0;E<3;E++){const W=(n+E*6*L0)/ht,x=Math.floor(W),X=W-x;let z=x<F?.46*_0((X-.5)/.5)**1.3:0;if(x>=1){const i0=X*l.interval+(x>=F?Math.max(0,e-oe):0);z-=.07*Math.exp(-i0*7)*Math.cos(i0*26),E===0&&(c=i0)}Ht[E].rotation.z=-z,E===0&&(a=Math.max(0,z)/.46)}fe.haul=a,fe.sinceBlow=c-ce;const i=c-ce;if(Ot.position.copy(me).addScaledVector(C0,3.55*a-.3*Math.exp(-Math.max(c,0)*3)),st.uniforms.uSlack.value=i>0?1.3*Math.exp(-i*1.5):c<90?1.3*c/ce:0,be){const E=c<ce?1-(c/ce)**2:0,W=i>0?.05*Math.exp(-i*9)*Math.abs(Math.sin(i*20)):0;be.rotation.x=.34*Math.max(a,E)+W,we.uniforms.uRing.value=i>0?.55*Math.exp(-i*.85):0,we.uniforms.uRingPhase.value=Math.max(i,0)*21;const x=l.duration-l.release-2.2;We.quaternion.setFromAxisAngle(qt,.3+.15*_0((e-x)/1.1)+(i>0?.012*Math.exp(-i*1.2)*Math.sin(i*5):0))}Gt(e);const u=gt,L=_0((yt/e0-.8)/.7);fe.blur=L,fe.flyAngle=u,N0.rotation.y=u,nt.uniforms.uFade.value=1-L,N0.userData.vanes.visible=L<.985,ge.visible=L>.01,ke.uBlur.value=L,ke.uAng.value=u;const V=e-qe,N=_0((e-oe)/.5);Tt.rotation.z=(.07-.16*_0(V/.25)+(V>0?.03*Math.exp(-V*5)*Math.sin(V*22):0))*(1-N)+.07*N;const m=e-oe;if(Dt.rotation.z=.1*_0(e/.3)*(1-_0(m/.2))+(m>0?.015*Math.exp(-m*8)*Math.sin(m*30):0),B0.position.y=ut-.45*t,B0.userData.line.scale.y=P0+.5-(B0.position.y+.6),H0&&(H0.uSwirl.value=e>0?.9*(e-3*(1-Math.exp(-e/3))):0,H0.uPull.value=_0(e/3.5),ie.visible=e>.05),!pt)for(const E of x0.uHands.value)E.x=e<0?-e0/60:0}function bt(e){vt=!0,Ke(e)}function Yt(e){bt(e*l.duration-l.release)}function Kt(e,t,n){pt=!0,x0.uHands.value[e].set(t,n)}Ke(P.progress!==void 0?P.progress*l.duration-l.release:-10);const Ut=new r.Matrix4,Zt=new r.Vector2;function jt(e,t,n){x0.uTime.value=t,V0.updateWorldMatrix(!0,!1),x0.uHeroInv.value.copy(Ut.copy(V0.matrixWorld).invert()),H0&&f.renderer&&(H0.uBufH.value=f.renderer.getDrawingBufferSize(Zt).y),vt||Ke((t+19)%l.duration-l.release)}const H=(e,t,n)=>new r.Vector3(e,t,n),Ue=[];for(let e=0;e<=8;e++){const t=Math.PI/2+e/8*e0,n=25+9*D0((e-.5)/1.5)*(1-D0((e-4.2)/1.6));Ue.push(H(U+Math.cos(t)*n,47+e/8*11,t0+Math.sin(t)*n))}const Xt=[H(62,46,21),H(44,46.5,20.5),...Ue,H(0,55,18),H(-20,50,21),H(-33,47,22),H(-42,45,18.5),H(-46.2,44.5,11.5),H(-45,46.5,5.6),H(-42.6,51.4,3.7),k0(58),k0(80),k0(110),k0(140),k0(168),te.clone()];x0.uSeat.value.copy(te);{const e=k0(150);x0.uHatch.value.set(e.x,150,e.z,15)}const Qt={flyAxis:{base:H(U,43,t0),top:H(U,w0,t0),y0:s0,y1:w0,tipRadius:de},orbit:Ue,flyThrough:Xt,wire:{start:me.clone(),end:Z0.clone(),dir:C0.clone(),radius:.2,clipOffset:lt.clone().negate()},wireLine:{from:k0(58),to:te.clone()},portalSeat:{position:te.clone(),facing:C0.clone().negate(),radius:7,tiltDeg:60},hatch:{center:k0(150).setY(150),size:30},bell:{center:H(n0,J0+$e/2,y0),mouth:H(n0,J0,y0),mouthRadius:Rt*A0,height:$e,innerRadiusAtSeat:12},hammer:{pivot:m0.clone(),strikePoint:H(n0,J0+1.6,y0+Rt)},belfryPosts:[H(n0-7,150,m0.z),H(n0+7,150,m0.z),H(Z0.x+1.3,150,Z0.z+18.5),H(Z0.x+1.3,150,Z0.z+30.5)],leverShaft:{position:H(I0,Se,6.4),noses:ze.map(e=>H(I0+Q0,Se,e))},crossShaft:{a:H(E0,U0,u0),b:H(E0,U0,b0),warningLeverTip:H(E0+le,U0,rt)},wheels:{pin:H(Qe,P0,X0),great:H(ne,P0,Ve),count:H(ne,P0,re),warning:H(Me,P0,Pe),radii:[15,20,12,7]},bed:{top:Q,halfLength:55,halfWidth:20,girdersZ:[-20,u0,b0,20],freeBays:[[-20,u0],[b0,20]]},weightWell:H(ct,0,ft),viewpoints:{doors:{position:H(58,47,14),target:H(U,52,t0)},hero:{position:H(4,50,-9),target:H(U+2,60,t0)},levers:{position:H(-34,45,17),target:H(-44,27,6)},upTheWire:{position:k0(120),target:te.clone()}}};return{object:V0,radius:48,height:64,center:H(-8,34,0),anchors:Qt,update:jt,setProgress:Yt,setStrikeTime:bt,setHands:Kt,uniforms:x0,makeMaterial:pe,drumUniforms:ke,dustUniforms:H0,timeline:{...l,blows:F,blowTimes:mt,strikeEnd:l.release+oe,hour:W0},state:fe,stats:{triangles:Math.round(Ae)},livery:b,liveryMul:k,liveryId:g,colors:{opal:T,grey:q,black:_,brass:S,steel:p,red:d},dispose(){},ground:!0,groundY:0}}export{f0 as Batch,o as M,ae as along,uo as buildHero,w as cbox,Fe as gearPlate,h as lathe,O0 as rodProfile};
