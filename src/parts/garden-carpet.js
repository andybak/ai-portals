import*as o from"three";import{clamp as de,lerp as ee,smoothstep as L}from"../kit/core.js";const Rt=["#EDE3CC","#A6321F","#1B2A52","#6F93B8","#E0A228","#5E7B4A","#8A6238"],D=.6,he=240,te=390,le=.2,ht=24,He=0,Et=!1,Dt="",ae=`
#define NCR ${ht}
#define NOC 15
#define NLAMP 2
uniform float uTime;
uniform vec3 uPal[7];
uniform vec3 uGround, uBorderG, uWaterC, uBedC;
uniform float uWinter, uNight;
uniform vec4 uCrA[NCR];
uniform vec4 uCrB[NCR];
uniform float uPacerK;   // the size of the carp that leads the canal run (creature 5): larger while it is seen from high up
uniform vec3 uSunDir, uSunCol, uSkyCol, uBounceCol;
uniform vec4 uWin;      // window plane x, z centre, half z, creep (m)
uniform vec4 uWin2;     // y0, y1, cell, bar half width
uniform vec4 uBranch;   // sway (m), strength, leaf amount, spacing of the window posts (0 = none)
uniform vec4 uBrA;      // the branch outside the window in window coordinates (z, y): foot xy, tip zw
uniform vec4 uMul;      // the window's mullions: z of the centre light, half its width, half a post's width, spacing of the transoms (0 = none)
uniform vec4 uMul2;     // transoms: height of the first above the sill, half their thickness; z = how much wider the second light south of the centre one is (m)
uniform vec4 uOccA[NOC];   // things standing on the carpet, as capsules: end a, radius
uniform vec4 uOccB[NOC];   // end b, on
uniform vec2 uOccSkip;     // a material skips its own occluders: first index, one past the last
uniform float uPenK;       // penumbra width (1 on the wool; standing things take a wider, softer one)
uniform float uCloud;      // depth of the soft shade that drifts past the window (thin cloud over a low sun), 0 = none
uniform vec4 uWave;     // front x, lift (m), half length, on
uniform vec3 uAmbTint;  // the cast of the shade on the wool (the warm bounce off the oak boards): multiplies the wool's ambient only
uniform vec4 uLampP[NLAMP];   // the warm lights of the room (stove, lantern): position, reach (m)
uniform vec4 uLampC[NLAMP];   // their colour (linear HDR, already flickering), wrap
float gcHash(vec2 p){ p = fract(p * vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.y); }
float gcNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(gcHash(i), gcHash(i + vec2(1., 0.)), f.x), mix(gcHash(i + vec2(0., 1.)), gcHash(i + vec2(1., 1.)), f.x), f.y); }
float gcSeg(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-4), 0., 1.); return length(pa - ba * h); }
// warm light of the stove and the lantern on a surface at P with normal N: a soft pool, no shadows
vec3 gcWarm(vec3 P, vec3 N){
  vec3 s = vec3(0.);
  for (int i = 0; i < NLAMP; i++) {
    vec3 d = uLampP[i].xyz - P;
    float dist = sqrt(max(dot(d, d), 1e-3));
    float w = uLampC[i].w;
    float ndl = clamp((dot(N, d) / dist + w) / (1. + w), 0., 1.);
    float q = dist / max(uLampP[i].w, 1.);
    s += uLampC[i].rgb * ndl / (1. + q * q) * (1. - smoothstep(1.1, 3., q));
  }
  return s;
}
// THE RISING GARDEN (driven by the world through setGarden): uGar.x = how far the canals and the pool have sunk and filled
// with silk water (and, in winter, thawed), uGar.y = how far the flower beds have swollen, uGar.w = strength of the long
// shadows of the trees that stand up from the pile; uGT[i] = one standing tree: foot x, z, height now (0 = flat), radius
// (negative: a round crown on a thin trunk).
#define NGT 40
uniform vec4 uGar;
uniform vec4 uGT[NGT];
float gcFieldK(vec2 q){ return (1. - smoothstep(170., 179., abs(q.x))) * (1. - smoothstep(320., 329., abs(q.y))); }
float gcWaterD(vec2 q){ vec2 A = abs(q); vec2 p = A; if (p.y > p.x) p = p.yx;
  float dP = min(length(p) - 80., min(length(p - vec2(74., 0.)) - 26., length(p - vec2(52.33, 52.33)) - 26.));
  return min(min(A.x, A.y) - 12., dP); }
float gcBedD(vec2 q){ vec2 A = abs(q);
  float dA = max(max(abs(mod(A.x - 24., 44.) - 19.) - 19., abs(A.y - 279.) - 39.), max(24. - A.x, A.x - 156.));
  float dB = max(max(abs(A.x - 142.) - 30., abs(mod(A.y - 22., 50.) - 22.) - 22.), max(22. - A.y, A.y - 122.));
  return min(dA, dB); }
// how far the ground at q stands above (beds) or below (water) the flat pile, in metres
float gcLift(vec2 q){
  float w = gcWaterD(q);
  float sink = -3.2 * uGar.x * (1. - smoothstep(-4.5, 0.6, w)) * gcFieldK(q) * smoothstep(20., 24., length(q));
  float b = 1. - smoothstep(-12., 0.5, gcBedD(q));
  return sink + 5. * uGar.y * b * (2. - b);
}
// the long shadows of the standing trees on the ground at q (1 = open)
float gcTreeSh(vec2 q){
  if (uGar.w < 0.01) return 1.;
  vec2 d = -normalize(uSunDir.xz + vec2(1e-4, 0.));
  float cot = min(length(uSunDir.xz) / max(uSunDir.y, 0.05), 3.2);
  float sh = 1.;
  for (int i = 0; i < NGT; i++) {
    vec4 T = uGT[i];
    if (T.z < 0.5) continue;
    vec2 v = q - T.xy;
    float L = T.z * cot;
    float t = clamp(dot(v, d), 0., L), k = t / max(L, 1.);
    float w = T.w > 0. ? T.w * (1. - 0.8 * k) : 1.6 - T.w * smoothstep(0.42, 0.7, k) * (1. - smoothstep(0.93, 1.06, k) * 0.5);
    float pen = 1.2 + t * 0.05;
    sh *= 1. - (0.9 - 0.45 * k) * (1. - smoothstep(w - pen, w + pen, length(v - d * t)));
  }
  return mix(1., sh, uGar.w);
}
float gcWaveLift(float x){ float s = (x - uWave.x) / max(uWave.z, 1.); return uWave.w * uWave.y * exp(-s * s * 2.2); }
// the rolling wave's light: x = sun multiplier (lit east face, shaded lee), y = pale crest where the nap turns, z = sky light left in the lee
vec3 gcWaveLight(float x){ float s = (x - uWave.x) / max(uWave.z, 1.);
  float lee = uWave.w * (1. - smoothstep(-0.25, 0.05, s)) * exp(-s * s * 0.9);
  return vec3(clamp(1. + uWave.w * 2.6 * max(s, 0.) * exp(-s * s * 6.) - 0.97 * lee, 0.03, 1.6), 1. + 0.75 * uWave.w * exp(-s * s * 26.), 1. - 0.7 * lee); }
// the crest of the rolling wave, where the pile turns over and shows its pale sides (0..1)
float gcWaveCrest(float x){ float s = (x - uWave.x) / max(uWave.z, 1.) - 0.05; return uWave.w * exp(-s * s * 30.); }
`,me=`
float gAO;   // contact darkening of the last gcSun / gcOcc (1 = open)
float gBars, gBrD;   // of the last gcLattice: 1 in an opening and 0 on a bar; signed distance to the branch
float gLatK = 1.;     // how much of the fine lattice's own pattern the next gcLattice keeps (the wool sets it from uLatK; 1 = all)
// signed distance (m) to the branch outside the window, in window coordinates w = (z, y)
float gcBranch(vec2 w){
  float sw = uBranch.x, lf = uBranch.z;
  vec2 a = uBrA.xy, b = uBrA.zw + vec2(0., sw);
  vec2 ab = b - a;
  float hh = clamp(dot(w - a, ab) / max(dot(ab, ab), 1e-4), 0., 1.);
  float db = length(w - a - ab * hh) - mix(13., 5., hh);
  vec2 n = vec2(-ab.y, ab.x) * 0.1;
  vec2 t1 = mix(a, b, 0.62) + n * 2.6 + vec2(0., sw * 0.7);
  db = min(db, gcSeg(w, mix(a, b, 0.45), t1) - 4.);
  db = min(db, length(w - b - vec2(-10., 12. + sw * 0.5)) - 34. * lf);
  db = min(db, length(w - t1 - vec2(4., 6.)) - 27. * lf);
  db = min(db, length(w - mix(a, b, 0.5) + n * 1.5 - vec2(0., sw * 0.25)) - 22. * lf);
  db = min(db, length(w - mix(a, b, 0.84) + n * 2.0 - vec2(sw * 0.3, sw * 0.6)) - 19. * lf);
  return db + (gcNoise((w - vec2(0., sw * 0.5)) * 0.085 + vec2(uTime * 0.35, -uTime * 0.27)) - 0.5) * 13. * lf;   // the leaves stir
}
// share of the sun passing the lattice at window point w = (z, y), seen through a penumbra of blur metres
float gcLattice(vec2 w, float blur){
  float env = min(uWin.z - abs(w.x - uWin.y), min(w.y - uWin2.x, uWin2.y - w.y));
  float e = smoothstep(-blur * 2., blur * 2., env);
  vec2 g = (w + vec2(0., uWin.w)) / max(uWin2.z, 1.);
  float d0 = abs(fract(g.y) - 0.5);
  float d1 = abs(fract(g.x * 0.866 + g.y * 0.5) - 0.5);
  float d2 = abs(fract(-g.x * 0.866 + g.y * 0.5 + 0.5) - 0.5);
  float d = min(d0, min(d1, d2)) * uWin2.z - uWin2.w;
  float bars = smoothstep(-blur, blur, d);
  // the coarse frame: heavy mullions (a wide centre light, narrower lights either side) and transoms. Their shadows are
  // tens of metres wide, so they outlive the penumbra that blurs the fine lattice: the long bars of shade on the wool
  float sp = max(uBranch.w, 1.);
  float um = abs(w.x - uMul.x) - uMul.y;
  // south of the centre light the third post stands further off (one wide light over the south border): the clear stretch
  // between the second post and the third is drawn out by uMul2.z, the posts themselves keep their width
  um -= uMul2.z * step(uMul.x, w.x) * clamp((um - sp - 20.) / max(sp + uMul2.z - 40., 1.), 0., 1.);
  float dpost = abs(mod(max(um, -0.5 * sp) + 0.5 * sp, sp) - 0.5 * sp) - uMul.z;
  float st = max(uMul.w, 1.);
  float dtr = abs(mod(w.y - uWin2.x - uMul2.x + 0.5 * st, st) - 0.5 * st) - uMul2.y;
  dpost = min(dpost, mix(1e3, dtr, step(1.5, uMul.w)));
  float bc = min(blur * 1.6, 5. + blur * 0.3);
  float posts = mix(1., smoothstep(-bc, bc, dpost), step(1.5, uBranch.w));
  gBars = bars * e * posts; gBrD = gcBranch(w);
  float br = 1. - uBranch.y * (1. - smoothstep(-blur * 3. - 4., blur * 3. + 4., gBrD));
  float cl = 1. - uCloud * smoothstep(0.38, 0.72, gcNoise(w * vec2(0.0035, 0.002) + vec2(uTime * 0.03, uTime * 0.004)));
  // on dark wool the net of the fine lattice reads as blotches: there it is taken toward its own mean, a soft dapple, and
  // the posts' long bars carry the shade
  return e * mix(0.34, 1., mix(0.45, bars, gLatK)) * mix(0.03, 1., posts) * br * cl;
}
// the lattice alone at hero-local point P
float gcLat(vec3 P){
  float t = (uWin.x - P.x) / max(uSunDir.x, 0.05);
  vec3 h = P + uSunDir * t;
  return gcLattice(vec2(h.z, h.y), 0.5 + max(t, 0.) * 0.0021 * uPenK);
}
// soft sun shadow of the capsules (returned) and their contact darkening (gAO)
float gcOcc(vec3 P){
  float sh = 1.; gAO = 1.;
  for (int i = 0; i < NOC; i++) {
    vec4 A = uOccA[i], B = uOccB[i];
    float fi = float(i);
    if (B.w < 0.5 || (fi >= uOccSkip.x && fi < uOccSkip.y)) continue;
    vec3 pa = P - A.xyz, ba = B.xyz - A.xyz;
    float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-4), 0., 1.);
    float d = length(pa - ba * h);
    gAO *= mix(0.42, 1., smoothstep(A.w * 0.9, A.w * 1.75, d));
    vec3 pp = pa - uSunDir * dot(pa, uSunDir), bp = ba - uSunDir * dot(ba, uSunDir);
    float h2 = clamp(dot(pp, bp) / max(dot(bp, bp), 1e-4), 0., 1.);
    float d2 = length(pp - bp * h2);
    float along = dot(ba * h2 - pa, uSunDir);
    float pen = 1.2 + max(along, 0.) * 0.035;
    float s = smoothstep(A.w - pen, A.w + pen * 1.5, d2);
    sh *= mix(1., mix(0.06, 1., s), smoothstep(-A.w * 0.2, A.w * 0.6, along));
  }
  return sh;
}
// share of the sun reaching hero-local point P: through the lattice, past the branch, past the things on the carpet
float gcSun(vec3 P){ return gcLat(P) * gcOcc(P); }
`,ge=`
vec2 gcNap(vec2 q, float t){
  // the lie of the pile wanders only a little, so the ground keeps one value and it is the strokes and the canal bands that turn pale
  float a = (gcNoise(q * 0.011 + vec2(t * 0.013, -t * 0.009)) - 0.5) * 1.7;
  a += (gcNoise(q * 0.035 + vec2(-t * 0.02, t * 0.016) + 7.3) - 0.5) * 0.9;
  vec2 A = abs(q);
  float canal = 1. - smoothstep(10., 16., min(A.x, A.y));
  float s = max(A.x, A.y);
  float bandC = smoothstep(0.55, 1., sin(s * 0.045 - t * 0.55 + gcNoise(q * 0.02) * 2.));
  a += canal * bandC * 2.6;
  // the strokes: bands where the pile has been turned over, crossing the carpet one after another as if a hand were smoothing it
  float st = mod(dot(q, vec2(0.83, 0.56)) - t * 16., 420.) - 210.;
  a += 2.9 * exp(-st * st / 900.);
  float sw = (q.x - uWave.x) / max(uWave.z, 1.);
  a += uWave.w * 3.1 * exp(-sw * sw * 3.);
  return vec2(sin(a), cos(a));
}
float gcSheen(vec2 lean, vec3 toEye){ return mix(1.22, 0.8, 0.5 + 0.5 * dot(lean, toEye.xz)); }
float gcKnot(vec2 f){ vec2 c = f - 0.5; float slot = smoothstep(0.39, 0.5, max(abs(c.x), abs(c.y)));
  float pil = 1.04 + 0.8 * dot(c, uSunDir.xz) - 0.2 * (1. - smoothstep(0.0, 0.09, abs(c.y)));   // pillow, and the groove between the knot's two ends
  return mix(pil, 0.42, slot); }
`,Oe=`
float gW;      // edge softening in metres: 0.3 at knot scale, the pixel footprint far away
float gGlow;   // emissive share of the last gcDye (night lamps, moths)
float gLobe;   // of the last gcReserve: +1 on a lobe of the scalloped edge, -1 between two
float gcIn(float d){ return clamp(0.5 - d / gW, 0., 1.); }
float gcBand(float d, float a, float b){ return gcIn(d - b) * (1. - gcIn(d - a)); }
float gcBox(vec2 p, vec2 h){ vec2 d = abs(p) - h; return max(d.x, d.y); }
float gcEll(vec2 p, vec2 r){ return (length(p / r) - 1.) * min(r.x, r.y); }
float gcPool(vec2 q){ vec2 p = abs(q); if (p.y > p.x) p = p.yx;
  return min(length(p) - 80., min(length(p - vec2(74., 0.)) - 26., length(p - vec2(52.33, 52.33)) - 26.)); }
float gcCypress(vec2 A, out vec2 l){
  l = A - vec2(A.x < 90. ? 27. : 153., A.y < 180. ? 160. : 200.);
  float s = (l.y + 4.) / (l.y > -4. ? 21. : 11.);
  float wd = 6.6 * (l.y > -4. ? max(1. - s * s, 0.) : sqrt(max(1. - s * s, 0.)));
  return max(abs(l.x) - wd, (abs(s) - 1.) * 11.);
}
// border frame: x = depth into the border from the edge, y = coordinate along it, z = 1 on the long sides
vec3 gcBorder(vec2 q){ vec2 A = abs(q); float ex = 240. - A.x, ez = 390. - A.y;
  return ex < ez ? vec3(ex, q.y, 1.) : vec3(ez, q.x, 0.); }
float gcPalmette(vec3 b, vec2 A, out vec2 pp, out float alt){
  float cell = b.z > 0.5 ? 39. : 40.;
  float ci = floor(b.y / cell); alt = mod(ci, 2.);
  pp = vec2(b.y - (ci + 0.5) * cell, (b.x - 30.) * (alt > 0.5 ? 1. : -1.));
  float d = min(gcEll(pp - vec2(0., -1.), vec2(7.2, 9.6)), length(pp - vec2(0., 8.2)) - 3.6);
  float corner = step(180., A.x) * step(330., A.y);
  vec2 cq = abs(A - vec2(210., 360.)); if (cq.y > cq.x) cq = cq.yx;
  float dc = min(length(cq) - 5., min(gcEll(cq - vec2(9., 0.), vec2(5., 2.9)), gcEll(vec2(cq.x + cq.y, cq.y - cq.x) * 0.7071 - vec2(9., 0.), vec2(5., 2.9))));
  return mix(d, dc, corner);
}
// 1 where the pile is cut high (3 m): cypresses, the pool rim, palmettes and corner rosettes
float gcRelief(vec2 q){
  vec2 A = abs(q); vec2 l; float al;
  vec3 b = gcBorder(q);
  if (b.x < 60.) return gcIn(gcPalmette(b, A, l, al) - 0.6) * step(14.4, b.x) * step(b.x, 45.6);
  float r = gcIn(gcCypress(A, l));
  return max(r, gcBand(gcPool(q), -0.6, 3.0) * step(12.6, min(A.x, A.y)));
}
// the cypresses are cut highest of all: x = the long shadow they throw away from the sun, y = 1 on the sunward flank
// falling to 0 on the lee flank, z = 1 on the cypress itself
vec3 gcCyRelief(vec2 q, vec2 sd){
  vec2 l;
  float d0 = gcCypress(abs(q), l);
  float d1 = gcCypress(abs(q + sd * 2.2), l);
  float dm = min(min(d1, gcCypress(abs(q + sd * 4.4), l)), min(gcCypress(abs(q + sd * 6.6), l), gcCypress(abs(q + sd * 8.8), l)));
  float dl = gcCypress(abs(q + sd * 11.2), l);
  float inC = gcIn(d0), w = gW + 0.6;
  float sh = max(1. - smoothstep(-w, w, dm), 0.55 * (1. - smoothstep(-w, w * 2.5, dl)));
  return vec3(sh * (1. - inC), clamp(0.5 + (d1 - d0) * 0.2, 0., 1.), inC);
}
// a reserve (the medallion an animal stands on): an ellipse with a scalloped edge of sixteen lobes; pe in metres from its centre
float gcReserve(vec2 pe, vec2 r){
  vec2 e = pe / r; float pl = max(length(e), 1e-3);
  vec2 c1 = e / pl;
  vec2 c2 = vec2(c1.x * c1.x - c1.y * c1.y, 2. * c1.x * c1.y);
  vec2 c4 = vec2(c2.x * c2.x - c2.y * c2.y, 2. * c2.x * c2.y);
  vec2 c8 = vec2(c4.x * c4.x - c4.y * c4.y, 2. * c4.x * c4.y);
  gLobe = c8.x * c8.x - c8.y * c8.y;
  return (pl - 1.) * min(r.x, r.y) + 1.1 * gLobe;
}
// the woven creatures: centres and frames come from JS, already snapped to whole knots
void gcCreatures(vec2 q, inout vec3 col){
  vec3 I = uPal[0], M = uPal[1], N = uPal[2], B = uPal[3], S = uPal[4], G = uPal[5], W = uPal[6];
  for (int i = 0; i < NCR; i++) {
    vec4 ca = uCrA[i], cb = uCrB[i];
    vec2 d = q - ca.xy;
    if (i == 5) d /= max(uPacerK, 1.);
    if (cb.x < 0.5 || dot(d, d) > 1400.) continue;
    float flip = cb.z < 0. ? -1. : 1.;
    float keep = clamp(abs(cb.z), 0., 1.);                 // 1 = full dye, less = dim shape under ice
    float l = dot(d, ca.zw), w = (d.y * ca.z - d.x * ca.w) * flip;
    float fr = cb.y;
    vec3 c = col; float m = 0.;
    if (cb.x < 1.5) {                                      // carp, 16 m: l forward
      float w2 = w - fr * 0.6 * clamp((-l - 2.) / 3., 0., 2.);
      float dB = gcEll(vec2(l - 0.6, w2), vec2(6.3, 2.35));
      float dT = max(abs(w2) - (-l - 4.4) * 0.8, max(-l - 8.8, l + 4.8));
      float dF = gcEll(vec2(l - 1.6, abs(w2) - 2.5), vec2(1.7, 1.0));
      float dd = min(dB, min(dT, dF));
      m = gcIn(dd - 0.6);
      c = N;
      c = mix(c, S, gcIn(dd));
      c = mix(c, M, gcIn(max(dB, 0.25 - sin(l * 1.05 + cb.w * 2.4))) * step(-0.5, w2));
      c = mix(c, M, gcIn(dT + 0.3));
      c = mix(c, I, gcIn(max(dB + 0.3, w2 + 1.0)));
      c = mix(c, I, gcIn(gcBox(vec2(l - 6.3, w2), vec2(0.5, 0.75))));
      c = mix(c, N, gcIn(gcBox(vec2(l - 4.5, abs(w2) - 1.05), vec2(0.3))));
      gGlow = max(gGlow, m * 0.09 * uNight);
    } else if (cb.x < 2.5) {                               // duck, 14 m, with its chevron wake
      float k = 1.55; vec2 p = vec2(l, w) / k;
      float dB = k * gcEll(vec2(p.x + 0.6, p.y), vec2(3.4, 2.1));
      float dH = k * (length(vec2(p.x - 3.3, p.y)) - 1.5);
      float dK = k * gcBox(vec2(p.x - 5.2, p.y), vec2(0.75, 0.5));
      float dd = min(dB, min(dH, dK));
      float arm = abs(abs(w) - (-l - 2.4) * 0.5) - 0.6;
      float dash = abs(mod(-l - fr * 0.6, 4.8) - 2.4) - 1.5;
      float wk = gcIn(max(max(arm, dash), max(l + 6., -l - 35.)));
      m = max(gcIn(dd - 0.6), wk);
      c = mix(I, N, gcIn(dd - 0.6));
      c = mix(c, cb.w > 0.5 ? I : mix(W, I, 0.35), gcIn(dB));
      c = mix(c, W, gcIn(k * gcEll(vec2(p.x + 1.2, p.y), vec2(2.1, 1.0))));
      c = mix(c, cb.w > 0.5 ? G : W, gcIn(dH));
      c = mix(c, S, gcIn(dK));
    } else if (cb.x < 3.5) {                               // gazelle, 34 m, side elevation (w is up), on a scalloped reserve that steps with it
      float k = 1.7;
      float graze = step(9.5, fr), sf = fr - 10. * graze;
      vec2 p = vec2(l, w) / k;
      vec2 hd = mix(vec2(8.7, 4.7), vec2(9.5, -4.2), graze);
      float dB = k * min(gcEll(p - vec2(-2.5, 0.9), vec2(3.7, 3.1)), gcEll(p - vec2(2.3, 0.7), vec2(4.4, 2.8)));   // haunch and barrel
      float dN = k * (gcSeg(p, vec2(5.3, 1.6), hd) - 1.2);
      float dH = k * gcEll(p - hd - vec2(0.9, -0.1), vec2(2.1, 1.3));
      float dHorn = k * (min(gcSeg(p, hd + vec2(-0.2, 1.0), hd + vec2(-2.3, 3.4)), gcSeg(p, hd + vec2(-2.3, 3.4), hd + vec2(-1.5, 5.4))) - 0.42);
      float o = mod(sf + step(0.2, p.x), 2.) < 0.5 ? 1.75 : 0.5;   // two pairs of legs that open and close in turn as it strides
      float lx = abs(abs(p.x - 0.2) - 4.2) - o;
      float legX = abs(lx) - 0.56;
      float dL = k * max(legX, max(p.y + 0.6, -p.y - 7.3));
      float dHf = k * max(legX, max(p.y + 6.4, -p.y - 7.3));
      float dTl = k * gcEll(p - vec2(-6.5, 2.7), vec2(1.3, 0.8));
      float dA = min(min(dB, dN), min(min(dH, dL), dTl));
      float dR = gcReserve(vec2(l - 2.6, w - 0.6), vec2(23., 18.5));
      m = gcIn(dR - 0.8);
      c = mix(N, mix(I, S, 0.1 + 0.45 * uNight), gcIn(dR));
      c = mix(c, M, gcBand(dR, -3.1, -1.9));
      c = mix(c, mix(G, N, 0.3), gcIn(max(abs(dR + 5.4) - 0.6, 0.3 - gLobe)));
      // a saffron animal in an indigo outline one knot wide: ivory belly and scut, indigo horns, hooves and eye, a madder collar
      c = mix(c, N, gcIn(min(dA, dHorn) - 0.75));
      c = mix(c, S, gcIn(dA));
      c = mix(c, I, gcIn(max(dB + 0.5, (p.y + 0.55) * k)));
      c = mix(c, M, gcIn(max(dN, abs(dot(p - vec2(6.6, 2.7), vec2(0.6, 0.8))) * k - 0.5)));
      c = mix(c, N, gcIn(min(dHf, dHorn)));
      c = mix(c, I, gcIn(dTl + 0.3));
      c = mix(c, N, gcIn(k * (length(p - hd - vec2(1.1, 0.3)) - 0.4)));
    } else if (cb.x < 4.5) {                               // small ivory bird, 5 m
      float dB = gcEll(vec2(l, w), vec2(2.0, 1.35));
      float dT = gcBox(vec2(l + 2.7, w), vec2(1.2, 0.5));
      float dK = gcBox(vec2(l - 2.4, w), vec2(0.6, 0.3));
      float dd = min(dB, min(dT, dK));
      m = gcIn(dd - 0.6);
      c = mix(N, I, gcIn(dd));
      c = mix(c, S, gcIn(dK));
      c = mix(c, M, gcIn(gcBox(vec2(l - 0.2, abs(w) - 0.5), vec2(0.6, 0.3))));
    } else if (cb.x < 5.5) {                               // crane (winter), side elevation
      float k = 1.6; vec2 p = vec2(l, w) / k;
      float dB = k * gcEll(p, vec2(4.4, 2.4));
      vec2 hd = mix(vec2(5.6, 8.6), vec2(7.4, -5.6), step(9.5, fr));
      float dN = k * (gcSeg(p, vec2(3.2, 1.2), hd) - 0.7);
      float dH = k * gcEll(p - hd - vec2(0.7, 0.), vec2(1.4, 0.9));
      float dK = k * gcBox(p - hd - vec2(2.9, -0.1), vec2(1.1, 0.3));
      float o = mod(fr, 2.) < 0.5 ? 1.5 : 0.4;
      float dL = k * max(abs(abs(p.x) - o) - 0.36, max(p.y + 1.5, -p.y - 8.6));
      float dP = k * gcEll(p - vec2(-4.4, -0.8), vec2(2.2, 1.5));
      float dR = gcReserve(vec2(l - 2., w - 0.5), vec2(20., 18.5));
      m = gcIn(dR - 0.8);
      c = mix(N, mix(B, I, 0.25), gcIn(dR));
      c = mix(c, M, gcBand(dR, -3.1, -1.9));
      c = mix(c, S, gcIn(max(abs(dR + 5.4) - 0.6, 0.3 - gLobe)));
      float dA = min(min(dB, dN), min(min(dH, dK), min(dL, dP)));
      c = mix(c, N, gcIn(dA - 0.6));
      c = mix(c, N, gcIn(dL));
      c = mix(c, I, gcIn(min(dB, min(dN, dH))));
      c = mix(c, N, gcIn(dP + 0.3));
      c = mix(c, M, gcIn(k * (length(p - hd - vec2(0.5, 0.5)) - 0.6)));
      c = mix(c, S, gcIn(dK));
    } else {                                               // moth (night): two pale wings that open and close
      float op = fr > 0.5 ? 1. : 0.45;
      float dd = max(abs(l) - 2.7 * op, abs(w) - 2.4 + abs(l) * 0.55);
      m = gcIn(dd);
      c = mix(I, B, 0.3);
      c = mix(c, N, gcIn(gcBox(vec2(l, w), vec2(0.3, 1.2))));
      gGlow = max(gGlow, m * 0.35);
    }
    col = mix(col, c, m * keep);
  }
}
`,_e=`
vec4 gcDye(vec2 q, float t){
  gGlow = 0.;
  vec3 I = uPal[0], M = uPal[1], N = uPal[2], B = uPal[3], S = uPal[4], G = uPal[5], W = uPal[6];
  vec2 A = abs(q);
  vec3 b = gcBorder(q);
  float high = 0., tall = 0.;
  vec3 col;
  float frz = uWinter * (1. - uGar.x);                    // how frozen the water is: the winter canals thaw while the garden stands
  float flow = 1. - frz;
  if (b.x < 60.) {
    // ---------------- border ----------------
    float bd = b.x, along = b.y;
    float cell = b.z > 0.5 ? 39. : 40.;
    float dirS = b.z > 0.5 ? (q.x < 0. ? -1. : 1.) : (q.y < 0. ? 1. : -1.);
    float v = bd - 30.;
    col = uBorderG;
    float ph = along * 3.14159265 / cell;
    float vy = 11. * sin(ph);
    float cs = cos(ph);
    float dv = abs(v - vy) / sqrt(1. + 0.78 * cs * cs) - 0.7;
    float sl = mod(along, 13.) - 6.5;
    col = mix(col, mix(G, I, 0.3), gcIn(gcEll(vec2(sl, abs(v - vy) - 2.5), vec2(2.3, 1.1))));
    col = mix(col, mix(G, I, mix(0.0, 0.45, uNight)), gcIn(dv));
    float sb = mod(along * dirS - 0.6 * floor(t * 2.5), 13.) - 6.5;
    float bud = gcIn(max(abs(sb) - 1.1, dv - 0.8));
    col = mix(col, S, bud);
    gGlow = max(gGlow, bud * uNight * 0.5);
    vec2 pp; float alt;
    float dp = gcPalmette(b, A, pp, alt);
    float corner = step(180., A.x) * step(330., A.y);
    float dcal = gcEll(vec2(abs(pp.x) - 6.4, pp.y + 9.0), vec2(4.6, 2.2)) + corner * 99.;
    col = mix(col, G, gcIn(dcal));
    col = mix(col, I, gcIn(dp - 0.6));
    col = mix(col, mix(N, B, alt * 0.55 * (1. - corner)), gcIn(dp));
    float heart = mix(gcEll(pp - vec2(0., -1.6), vec2(3.9, 5.7)), length(A - vec2(210., 360.)) - 3.6, corner);
    col = mix(col, S, gcIn(heart));
    col = mix(col, M, gcIn(heart + 1.8));
    col = mix(col, I, gcIn(length(pp - vec2(0., 8.2)) - 1.5) * (1. - corner));
    high = gcIn(dp - 0.6);
    // guards
    float gu = mod(along, 6.) - 3., gi = mod(floor(along / 6.), 2.);
    float dia = abs(gu) + abs(bd - 7.8) - 3.1;
    vec3 g1 = mix(I, gi > 0.5 ? M : N, gcIn(dia));
    g1 = mix(g1, S, gcIn(dia + 2.2));
    col = mix(col, g1, gcBand(bd, 3., 12.6));
    float tz = bd - 51.9;
    float cr = mod(along, 7.2) < 3.6 ? tz : -tz;
    vec3 g2 = mix(I, N, gcIn(cr));
    g2 = mix(g2, S, gcIn(abs(abs(tz) - 2.4) - 0.3) * gcIn(abs(mod(along, 3.6) - 1.8) - 0.3));
    col = mix(col, g2, gcBand(bd, 46.8, 57.));
    col = mix(col, N, max(gcBand(bd, 12.6, 14.4), gcBand(bd, 45.6, 46.8)));
    col = mix(col, N, max(gcIn(bd - 1.8), gcBand(bd, 57., 58.2)));
    col = mix(col, I, max(gcBand(bd, 1.8, 3.), gcBand(bd, 58.2, 60.3)));
    high *= step(14.4, bd) * step(bd, 45.6);
    // flat-woven bands at both ends
    float ez = 390. - A.y;
    float kil = gcIn(ez - 9.);
    vec3 kc = mix(I, B, gcBand(mod(ez, 3.), 0.9, 1.8));
    kc = mix(kc, M, gcBand(ez, 4.2, 4.8));
    kc = mix(kc, N, gcBand(ez, 8.4, 9.));
    col = mix(col, kc, kil);
    high *= 1. - kil;
    return vec4(col, mix(mix(2.4, 3.0, high), 0.7, kil));
  }
  // ---------------- field ----------------
  float dC = min(A.x, A.y) - 12.;
  float dP = gcPool(q);
  float dW = min(dC, dP);
  float quad = step(0., q.x) * 13. + step(0., q.y) * 29.;
  col = uGround;
  // millefleur sprigs on the open ground
  { float row = floor(A.y / 9.6);
    vec2 A2 = vec2(A.x + mod(row, 2.) * 4.8, A.y);
    vec2 sid = floor(A2 / 9.6); vec2 sp = A2 - (sid + 0.5) * 9.6;
    float hs = gcHash(sid + quad);
    vec3 pc = hs < 0.33 ? mix(I, M, uWinter) : (hs < 0.66 ? S : mix(B, N, uWinter * 0.6));
    float on = step(0.2, fract(hs * 7.13));
    col = mix(col, mix(G, N, uWinter * 0.7), gcIn(gcBox(abs(sp) - vec2(1.5), vec2(0.45))) * on);
    col = mix(col, pc, gcIn(min(gcBox(sp, vec2(2.1, 0.45)), gcBox(sp, vec2(0.45, 2.1)))) * on);
    col = mix(col, mix(N, M, step(0.5, hs)), gcIn(gcBox(sp, vec2(0.45))) * on);
  }
  // striped flower beds
  { float dA = max(gcBox(vec2(mod(A.x - 24., 44.) - 19., A.y - 279.), vec2(19., 39.)), max(24. - A.x, A.x - 156.));
    float dB = max(gcBox(vec2(A.x - 142., mod(A.y - 22., 50.) - 22.), vec2(30., 22.)), max(22. - A.y, A.y - 122.));
    float dBed = min(dA, dB);
    float sv = mod(dA < dB ? A.y : A.x, 21.6);
    vec3 bc = uBedC;
    bc = mix(bc, M, gcBand(sv, 0., 3.6));
    bc = mix(bc, S, gcBand(sv, 7.2, 10.8));
    bc = mix(bc, I, gcBand(sv, 14.4, 18.));
    float tick = gcIn(abs(mod((dA < dB ? A.x : A.y) + 1.2, 4.8) - 2.4) - 0.3) * gcIn(abs(mod(sv, 7.2) - 5.4) - 0.3);
    bc = mix(bc, mix(N, G, 0.4), tick);
    col = mix(col, I, gcIn(dBed - 1.2));
    col = mix(col, N, gcIn(dBed - 0.6));
    col = mix(col, bc, gcIn(dBed));
  }
  // blossoming trees: 2 by 3 in each quarter
  { vec2 tp = vec2(A.x - 54., A.y - 135.);
    vec2 tid = clamp(floor(tp / vec2(36., 30.)), vec2(0.), vec2(1., 2.));
    vec2 tl = tp - (tid + 0.5) * vec2(36., 30.);
    vec2 cl = tl - vec2(0., 2.5);
    float dcr = length(cl) - 9.6;
    float dtr = gcBox(tl - vec2(0., -10.), vec2(0.9, 3.4));
    col = mix(col, W, gcIn(dtr));
    // spring: a sage crown, scalloped in ivory
    vec3 cc = mix(G, mix(G, N, 0.55), gcBand(dcr, -4.5, -3.3));
    float leaf = gcIn(dcr) * flow;
    col = mix(col, I, gcIn(dcr - 0.6) * flow);
    col = mix(col, cc, leaf);
    // winter: bare boughs
    float bw = min(gcBox(tl - vec2(0., 1.), vec2(0.5, 9.)), max(abs(abs(tl.x) - (tl.y + 5.) * 0.75) - 0.5, max(-tl.y - 5., tl.y - 5.5)));
    bw = min(bw, max(abs(abs(tl.x) - (tl.y - 1.) * 0.7) - 0.5, max(1. - tl.y, tl.y - 10.)));
    col = mix(col, N, gcIn(bw) * uWinter);
    // flowers on an 8-knot grid inside the crown, opening and closing in four stepped frames
    vec2 fid = floor(cl / 4.8 + 0.5); vec2 fl = cl - fid * 4.8;
    float h = gcHash(fid * 3.7 + tid * 11.3 + quad + 5.);
    float tri = 1. - abs(2. * fract(t * 0.05 + h) - 1.);
    float fr = floor(clamp((tri - 0.25) / 0.6, 0., 0.999) * 4.);
    float inC = step(length(fid * 4.8), 7.2);
    float fd = abs(fl.x) + abs(fl.y) - (0.5 + 0.62 * fr);
    vec3 fc = mix(I, M, step(2.5, fr));
    fc = mix(fc, mix(M, S, step(2.5, fr)), gcIn(fd + 1.3) * step(1.5, fr));
    fc = mix(fc, mix(I, S * 1.2, 0.5), uNight * 0.5);
    fc = mix(fc, M, uWinter);                                // winter: madder berries left on the bare boughs
    col = mix(col, fc, gcIn(fd) * inC * mix(1., step(0.6, h) * step(fr, 1.5), uWinter));
  }
  // cypresses: indigo and sage feathers in a saffron outline, cut in relief
  { vec2 l; float dcy = gcCypress(A, l);
    float chev = fract((l.y - abs(l.x) * 1.15) / 4.8);
    float fe = clamp((abs(chev - 0.5) - 0.33) / max(gW / 4.8, 1e-3) + 0.5, 0., 1.);
    vec3 body = mix(N * 0.8, mix(G, N, 0.35), uNight);       // dark indigo spires (sage where the ground itself is indigo)
    vec3 cy = mix(body, mix(mix(G, I, uWinter * 0.75), mix(G, I, 0.4), uNight), fe);
    cy = mix(cy, mix(body, G, 0.5), gcIn(abs(l.x) - 0.3));
    // winter: a bare tree inside the saffron outline: indigo boughs and a trunk on pale blue, madder berries a knot or two at a time
    vec3 cyW = mix(mix(I, B, 0.45), N * 1.15, fe);
    float bh = gcHash(floor((l + vec2(40.)) / 1.8));
    cyW = mix(cyW, M, mix(step(0.78, bh), 0.2, smoothstep(0.6, 1.5, gW)) * (1. - fe));
    cyW = mix(cyW, N * 1.15, gcIn(abs(l.x) - 0.5));
    cy = mix(cy, cyW, uWinter);
    col = mix(col, W, gcIn(gcBox(l - vec2(0., -17.), vec2(0.9, 2.2))));
    col = mix(col, cy, gcIn(dcy));
    col = mix(col, S, gcBand(dcy, -1.35, 0.05));
    tall = gcIn(dcy);
    high = max(high, tall);
  }
  // water: canals and pool
  { float inW = gcIn(dW);
    vec3 wc = uWaterC;
    float sC = max(A.x, A.y), aC = A.x < A.y ? q.x : q.y;
    float wy = sC - 0.6 * floor(t * 1.4) * flow;
    float row = floor(wy / 3.6);
    float wx = aC + mod(row, 2.) * 2.4 + 60.;
    float hw = gcHash(vec2(floor(wx / 4.8), row));
    float dash = gcIn(gcBox(vec2(mod(wx, 4.8) - 2.4, mod(wy, 3.6) - 1.8), vec2(1.5, 0.3)));
    vec3 canal = mix(wc, hw > 0.5 ? mix(wc, I, 0.7) : mix(wc, N, 0.4), dash * mix(1., step(0.8, hw), frz));
    // winter: the ice. Pale cracks stepping slantwise across the canal, and a slow band of sheen sliding along it
    float ch = gcHash(vec2(floor(sC / 13.2), 3.));
    float cx = mod(sC + ch * 7., 13.2) - 6.6 + aC * (ch > 0.5 ? 1. : -1.);
    float crack = gcIn(abs(cx) - 0.6) * step(0.2, ch);
    // a second, finer set of cracks the other way, and the sheen: a pale band that slides along the canal a knot at a time
    float ch2 = gcHash(vec2(floor((sC + 4.) / 19.2), 8.));
    float cx2 = mod(sC + 4. + ch2 * 9., 19.2) - 9.6 - aC * (ch2 > 0.5 ? 0.6 : -0.6);
    float crack2 = gcIn(abs(cx2) - 0.42) * step(0.2, ch2);
    float glint = gcBand(mod(sC - 0.6 * floor(t * 2.), 72.), 0., 6.);
    vec3 ice = mix(wc, B, 0.42) * 0.94;                        // the ice lies a shade deeper than the frozen pool, so that its cracks show
    canal = mix(canal, mix(ice, mix(ice, I, 0.5), dash * step(0.8, hw)), frz);
    canal = mix(canal, mix(B, N, 0.45), frz * gcIn(abs(cx - 1.2) - 0.3) * step(0.2, ch) * 0.8);
    canal = mix(canal, mix(ice, I, 0.8), frz * glint);
    canal = mix(canal, I * 1.04, frz * max(crack, crack2));
    float r = length(q);
    float rr = mod(r - 0.6 * floor(t * 1.6) * flow, 14.4);
    vec3 pool = mix(wc, mix(wc, I, 0.65), gcBand(rr, 0., 1.2));
    pool = mix(pool, mix(wc, N, 0.35), gcBand(rr, 7.2, 8.4));
    wc = mix(canal, pool, gcIn(dP + 1.));
    // lotus, drifting a knot at a time
    vec2 lid = floor(q / 30. + 0.5);
    float lh = gcHash(lid + 3.);
    float lr = length(lid * 30.);
    vec2 off = (vec2(lh, fract(lh * 9.7)) - 0.5) * 9. + 0.6 * floor(vec2(sin(t * 0.11 + lh * 40.), cos(t * 0.09 + lh * 17.)) * 5. * flow);
    vec2 ll = q - lid * 30. - off;
    float dl = max(length(ll) - 4.3, -max(abs(ll.y) - ll.x * 0.4, -ll.x));
    float lon = step(62., lr) * step(lr, 70.) * step(0.3, lh) * (1. - frz);
    wc = mix(wc, N, gcIn(dl - 0.6) * lon);
    wc = mix(wc, mix(G, I, 0.15), gcIn(dl) * lon);
    float dbud = abs(ll.x + 1.6) + abs(ll.y - 1.4) - 1.5;
    wc = mix(wc, lh > 0.65 ? I : M, gcIn(dbud) * lon);
    wc = mix(wc, S, gcIn(dbud + 1.1) * lon);
    // the rosette island
    vec2 p8 = A; if (p8.y > p8.x) p8 = p8.yx;
    vec2 p8r = vec2(p8.x + p8.y, p8.y - p8.x) * 0.7071;
    float pet = min(gcEll(p8 - vec2(11.5, 0.), vec2(6.6, 3.5)), gcEll(p8r - vec2(11.5, 0.), vec2(6.6, 3.5)));
    vec2 p16 = vec2(p8.x * 0.9239 + p8.y * 0.3827, abs(p8.y * 0.9239 - p8.x * 0.3827));
    float pet2 = gcEll(p16 - vec2(7., 0.), vec2(3.8, 1.9));
    vec3 isl = mix(I, B, gcBand(r, 17.4, 18.6));
    isl = mix(isl, N, gcIn(pet - 0.6));
    isl = mix(isl, M, gcIn(pet));
    isl = mix(isl, I, gcIn(pet2 - 0.5));
    isl = mix(isl, S, gcIn(pet2));
    isl = mix(isl, N, gcIn(r - 4.2));
    isl = mix(isl, S, gcIn(r - 3.0));
    isl = mix(isl, M, gcIn(r - 1.2));
    wc = mix(wc, N, gcIn(r - 22.));
    wc = mix(wc, S, gcIn(r - 21.4));
    wc = mix(wc, isl, gcIn(r - 20.2));
    col = mix(col, wc, inW);
    // banks and the pool rim
    float nearB = 1. - smoothstep(0.3, 0.8, gW);            // at tuft scale the bank's two dark lines are slate blue, not indigo: seen along the canal from just above they would read as a black trench
    col = mix(col, mix(uWaterC, N, 0.6 - 0.42 * nearB), gcBand(dW, -1.2, 0.));
    col = mix(col, I, gcBand(dW, 0., 1.2));
    col = mix(col, mix(N, mix(B, I, 0.25), 0.62 * nearB), gcBand(dW, 1.2, 2.4));
    float rim = step(12.6, min(A.x, A.y));
    col = mix(col, S, gcBand(dP, 2.4, 3.6) * rim * gcIn(-dC));
    high = max(high, gcBand(dP, -0.6, 3.0) * rim);
  }
  gcCreatures(q, col);
  // night: woven lamps along the canals, rings of glowing knots that swell and shrink a knot at a time
  { float sC = max(A.x, A.y);
    vec2 lp = vec2(min(A.x, A.y) - 17.4, mod(sC, 36.) - 18.);
    float lhs = gcHash(vec2(floor(sC / 36.), quad));
    float k = floor(1.5 + 1.5 * sin(t * 0.9 + lhs * 6.28));
    float lr = length(lp);
    float ring = gcIn(abs(lr - (2.1 + 0.6 * k)) - 0.6);
    float core = gcIn(lr - 0.9);
    float lon = uNight * step(108., sC) * step(sC, 324.);
    float halo = clamp(1. - lr / 15., 0., 1.); halo *= halo * lon;
    col = mix(col, mix(col, S, 0.6), halo);
    col = mix(col, S, max(ring, core) * lon);
    gGlow = max(gGlow, max(max(ring, core) * lon * 1.3, halo * 0.5));
  }
  // winter: single ivory knots of snow stepping down row by row
  { vec2 kk = floor(q / 0.6);
    vec2 sc = floor(kk / 12.);
    float sh = gcHash(sc + 91.);
    vec2 kin = kk - sc * 12.;
    float rowS = mod(floor(t * 3. + sh * 12.), 12.);
    float fl = step(abs(kin.x - floor(sh * 11.99)), 0.5) * step(abs(kin.y - rowS), 0.5);
    col = mix(col, I, fl * uWinter * step(gW, 0.5) * step(0.35, sh));
  }
  return vec4(col, mix(mix(2.4, 3.0, high), 4.3, tall));
}
`,mt=`
${ae}
uniform vec4 uShell;   // weave only: this shell (0 = the skin, 1 = the outermost), the pile's height in metres, 1 if the piece wears shells at all, fill light
varying vec3 vP; varying vec3 vN; varying vec2 vQ;
#include <fog_pars_vertex>
void main(){
  vec3 P = position;
  #ifdef GC_WEAVE
    vQ = uv; vN = normal;
    P += normal * (uShell.x * uShell.y);                    // a shell of pile over the weave (the border gate): pushed out along the normal
  #else
    P.y += gcWaveLift(P.x) + gcLift(P.xz); vQ = P.xz; vN = vec3(0., 1., 0.);
  #endif
  vP = P;
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,gt=`
${ae}
${me}
${ge}
${Oe}
${_e}
uniform vec3 uCam; uniform vec4 uTuft; uniform float uBack; uniform float uLatK;
uniform vec4 uShell;   // weave only: this shell (0 = the skin, 1 = the outermost), the pile's height in metres, 1 if the piece wears shells at all, fill light
varying vec3 vP; varying vec3 vN; varying vec2 vQ;
#include <fog_pars_fragment>
void main(){
  vec2 p = vQ;
  vec2 fw2 = fwidth(p);
  float fwMax = max(max(fw2.x, fw2.y), 1e-4), fwMin = max(min(fw2.x, fw2.y), 1e-4);
  float fw = sqrt(fwMax * fwMin);
  float far = smoothstep(0.2, 0.38, fwMax);
  vec2 kc = (floor(p / 0.6) + 0.5) * 0.6;
  vec2 q = mix(kc, p, far);
  gW = max(0.3, fw * 1.6);
  vec4 dye = gcDye(q, uTime);
  float glow = gGlow;
  float detail = 1. - smoothstep(0.1, 0.24, fwMax);
  float ks = mix(0.84, gcKnot(fract(p / 0.6)), detail);
  vec2 sd = normalize(uSunDir.xz + vec2(1e-4, 0.));
  float r0 = gcRelief(q), r1 = gcRelief(q + sd * 0.75);
  float sh = max(max(r1, gcRelief(q + sd * 1.5)), max(gcRelief(q + sd * 2.4), gcRelief(q + sd * 3.3)));
  float shadow = clamp(sh - r0, 0., 1.), edge = clamp(r0 - r1, 0., 1.);
  vec3 toEye = normalize(uCam - vP);
  float sheen = gcSheen(gcNap(q, uTime), toEye);
  float abr = (0.95 + 0.1 * gcHash(kc) * detail + 0.05 * (1. - detail)) * (0.95 + 0.1 * gcNoise(vec2(p.y * 0.05, 3.7)));
  vec3 amb = uSkyCol * 0.76 + uBounceCol * 0.42;
  #ifdef GC_WEAVE
    vec3 N = normalize(vN + vec3(0., 1e-4, 0.));
    float ndl = clamp(dot(N, uSunDir) * 0.75 + 0.25, 0., 1.);
    float up = 0.5 + 0.5 * N.y;
    amb = uSkyCol * (0.25 + 0.6 * up) + uBounceCol * (0.75 - 0.6 * up);
    vec2 f = fract(p / 0.6);
    float bump = 0.72 + 0.4 * sin(f.x * 3.14159) * (0.6 + 0.4 * sin(f.y * 3.14159));
    vec3 base = mix(dye.rgb, mix(dye.rgb * 0.62 + uPal[0] * 0.2, uPal[0] * 0.8, 0.12), uBack);
    float kk = mix(ks, mix(0.9, bump, detail), uBack);
    float sunW = gcSun(vP);
    // a standing piece of the carpet (the border gate) is pile all round: blunt tufts on the knot grid, cut into the shells
    // where the knots can be told apart, dark at the root and paler at the tip; its shaded faces take the light thrown back
    // off the sunlit wool around it
    float tuftE = max(abs(fract(p.x / 0.6) - 0.5), abs(fract(p.y / 0.6) - 0.5));
    if (uShell.x > 0.001 && tuftE > mix(0.6, 0.47 - 0.19 * uShell.x, detail)) discard;
    float pileK = mix(1., uShell.x > 0.001 ? (0.6 + 0.55 * uShell.x) * (0.88 + 0.24 * gcHash(kc + 5.)) : 0.4, detail * uShell.z);
    kk = mix(kk, 1., detail * uShell.z);
    vec3 c = base * abr * kk * pileK * (uSunCol * sunW * ndl + (amb + gcWarm(vP, N)) * gAO + (uSunCol * 0.2 + uBounceCol * 0.55) * uShell.w);
  #else
    vec3 wl = gcWaveLight(p.x);
    amb *= uAmbTint;
    dye.rgb = mix(dye.rgb, uPal[0] * 1.04 + dye.rgb * 0.12, 0.62 * gcWaveCrest(p.x));
    vec3 cyr = gcCyRelief(q, sd);
    gLatK = uLatK;
    float sunRaw = gcSun(vP);
    // the rising garden: the swollen beds and the sunk banks take the low sun on the flank that faces it, the trees lay their long shadows
    float gOn = step(0.002, uGar.x + uGar.y);
    float lE = gcLift(q + vec2(1.6, 0.)) - gcLift(q - vec2(1.6, 0.)), lS = gcLift(q + vec2(0., 1.6)) - gcLift(q - vec2(0., 1.6));
    vec3 gN = normalize(vec3(-lE, 3.2, -lS));
    float slopeK = mix(1., clamp(dot(gN, uSunDir) / max(uSunDir.y, 0.05), 0.12, 2.1), gOn);
    float tsh = gcTreeSh(q);
    float silk = uGar.x * (1. - smoothstep(-1.6, -0.2, gcWaterD(q))) * gcFieldK(q) * smoothstep(21., 23., length(q));
    sunRaw *= tsh;
    float sun = sunRaw * slopeK * (1. - 0.8 * shadow) * (1. + 0.3 * edge) * wl.x * (1. - 0.86 * cyr.x) * mix(1., mix(0.42, 1.55, cyr.y), cyr.z);
    float ambK = gAO * (0.72 + 0.28 * tsh) * (1. - 0.3 * shadow) * wl.z * (1. - 0.3 * cyr.x) * mix(1., mix(0.75, 1.1, cyr.y), cyr.z);
    ks = mix(ks, 0.97, silk); sheen = mix(sheen, 1., silk);
    vec3 warm = gcWarm(vec3(vP.x, 2.6, vP.z), vec3(0., 1., 0.)) * gAO * (1. - 0.45 * shadow) * mix(1., 0.8, cyr.x) * (0.35 + 0.65 * tsh);   // a standing tree's long shadow takes some of the lamps' light too, or the warm pool would wash it out
    vec3 c = dye.rgb * abr * sheen * wl.y * ks * (1. + 0.05 * r0) * (uSunCol * sun + amb * ambK + warm);
    c += (dye.rgb * 0.5 + uPal[0] * 0.2) * uSunCol * sunRaw * cyr.z * smoothstep(0.7, 1., cyr.y) * 0.9;
    float pr = uTuft.z * (1. - smoothstep(uTuft.x, uTuft.y, length(p - uCam.xz)));
    c = mix(c, dye.rgb * amb * 0.22, pr * 0.92 * (1. - silk));
    if (silk > 0.001) {
      // silk water: slow bands of lustre sliding outward from the pool, fine threads lying along the flow, the pale window in it at a glance
      vec2 A2 = abs(q);
      float sAl = max(A2.x, A2.y), aAc = A2.x < A2.y ? q.x : q.y;
      float inPool = 1. - smoothstep(-6., 4., gcPool(q));
      float along = mix(sAl, length(q), inPool), across = mix(aAc, 0.2 * length(q), inPool);
      float n1 = gcNoise(vec2(across * 0.16, along * 0.045 - uTime * 0.11));
      float bandS = 0.5 + 0.5 * sin(along * 0.21 - uTime * 0.85 + n1 * 5.);
      float thr = gcNoise(vec2(across * 2.3 + n1 * 2., along * 0.11 - uTime * 0.22));
      vec3 wN = normalize(vec3((n1 - 0.5) * 0.5 + (thr - 0.5) * 0.22, 1., (bandS - 0.5) * 0.3));
      vec3 R = reflect(-toEye, wN);
      float fres = 1. - clamp(toEye.y, 0., 1.); fres = fres * fres * fres;
      float sd = max(dot(R, uSunDir), 0.); sd *= sd; sd *= sd; sd *= sd; sd *= sd;
      vec3 deep = mix(dye.rgb * (vec3(0.72, 0.9, 1.12) + uPal[3] * 0.35), uPal[3] * vec3(0.8, 1.02, 1.3), 0.42 * (1. - smoothstep(0.02, 0.2, length(dye.rgb - uWaterC)))) * abr;   // open water (not a carp, a duck or a lotus) is drawn toward a clear silk blue
      vec3 sc = deep * (0.82 + 0.3 * bandS * bandS + 0.16 * (thr - 0.5)) * (uSunCol * sun + amb * ambK + warm);
      sc += (uSkyCol * 1.5 + uPal[3] * 0.3) * (0.1 + 0.9 * fres) * (0.3 + 0.5 * bandS + 0.3 * thr) * gAO * 0.55;
      sc += uSunCol * sunRaw * (sd * 1.3 + 0.1 * bandS * bandS * bandS);
      c = mix(c, sc, silk);
    }
  #endif
  c += dye.rgb * glow * 4.;
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}
`,Kt=`
${ae}
${me}
${ge}
${Oe}
${_e}
attribute vec2 aKnot; attribute float aKind;
uniform vec3 uCam; uniform vec4 uTuft; uniform float uLatK;
varying vec3 vCol; varying vec3 vN; varying vec3 vP; varying vec4 vUvk; varying vec2 vF; varying vec3 vL; varying float vGlow; varying vec3 vWarm;
#include <fog_pars_vertex>
void main(){
  vec2 kc = aKnot;
  gW = 0.3;
  vec4 dye = gcDye(kc, uTime);
  vGlow = gGlow;
  float h = gcHash(kc * 1.7 + 0.3);
  float pr = uTuft.z * (1. - smoothstep(uTuft.x, uTuft.y, length(kc - uCam.xz)));
  float H = dye.a * (0.94 + 0.12 * h) * (0.95 + 0.1 * gcNoise(kc * 0.31)) * pr;
  vec2 lean = gcNap(kc, uTime);
  float yy = position.y;
  float wsc = smoothstep(0., 0.05, pr);
  // the cut is a little ragged: each corner of the top stands at its own height
  float rag = step(0.99, yy) * (fract(h * 17.3 + position.x * 3.7 + position.z * 9.1) - 0.5) * 0.07;
  // the rising garden: the tufts ride the swollen beds; where the canals have turned to silk water they sink away
  float silkT = uGar.x * (1. - smoothstep(-1.6, -0.2, gcWaterD(kc))) * gcFieldK(kc) * smoothstep(21., 23., length(kc));
  H *= 1. - silkT;
  vec3 P = vec3(kc.x + position.x * 0.6 * wsc, ${le.toFixed(2)} + 0.03 + (yy + rag) * H + gcWaveLift(kc.x) + gcLift(kc), kc.y + position.z * 0.6 * wsc);
  P.xz += (lean * 0.42 + (vec2(h, fract(h * 7.31)) - 0.5) * 0.16) * (yy * yy * min(H, 2.7) / 2.4);
  vec2 sd = normalize(uSunDir.xz + vec2(1e-4, 0.));
  float r0 = gcRelief(kc), r1 = gcRelief(kc + sd * 0.75);
  float sh = max(max(r1, gcRelief(kc + sd * 1.5)), max(gcRelief(kc + sd * 2.4), gcRelief(kc + sd * 3.3)));
  float shadow = clamp(sh - r0, 0., 1.), edge = clamp(r0 - r1, 0., 1.);
  vec3 root = vec3(kc.x, 0., kc.y);
  float sheen = gcSheen(lean, normalize(uCam - root));
  float abr = (0.95 + 0.1 * gcHash(kc)) * (0.95 + 0.1 * gcNoise(vec2(kc.y * 0.05, 3.7)));
  vec3 wl = gcWaveLight(kc.x);
  vec3 cyr = gcCyRelief(kc, sd);
  dye.rgb = mix(dye.rgb, uPal[0] * 1.04 + dye.rgb * 0.12, 0.62 * gcWaveCrest(kc.x));
  vCol = dye.rgb * abr * sheen * wl.y * (1. + 0.05 * r0);
  gLatK = uLatK;
  float tshT = gcTreeSh(kc);
  float lE = gcLift(kc + vec2(1.6, 0.)) - gcLift(kc - vec2(1.6, 0.)), lS = gcLift(kc + vec2(0., 1.6)) - gcLift(kc - vec2(0., 1.6));
  float slopeT = mix(1., clamp(dot(normalize(vec3(-lE, 3.2, -lS)), uSunDir) / max(uSunDir.y, 0.05), 0.12, 2.1), step(0.002, uGar.x + uGar.y));
  float sunT = gcSun(root) * tshT * slopeT;
  vL = vec3(sunT * (1. - 0.8 * shadow) * (1. + 0.3 * edge) * wl.x * (1. - 0.86 * cyr.x) * mix(1., mix(0.6, 1.3, cyr.y), cyr.z),
    gAO * (0.72 + 0.28 * tshT) * (1. - 0.3 * shadow) * wl.z * (1. - 0.3 * cyr.x), pr);
  vWarm = gcWarm(vec3(kc.x, 2.6, kc.y), vec3(0., 1., 0.)) * gAO * (1. - 0.45 * shadow) * mix(1., 0.8, cyr.x) * (0.35 + 0.65 * tshT);
  vN = normal; vP = P; vF = position.xz * 1.3514 + 0.5; vUvk = vec4(uv.x, yy, aKind, h);
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,Ht=`
${ae}
${ge}
uniform vec3 uCam;
varying vec3 vCol; varying vec3 vN; varying vec3 vP; varying vec4 vUvk; varying vec2 vF; varying vec3 vL; varying float vGlow; varying vec3 vWarm;
#include <fog_pars_fragment>
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.));
  vec3 amb = (uSkyCol * 0.76 + uBounceCol * 0.42) * uAmbTint;
  float yy = vUvk.y, pr = vL.z, hh = vUvk.w, prd = pr * pr;
  vec3 col = vCol * mix(1., 0.88 + 0.24 * fract(hh * 5.7), prd);
  vec3 c;
  if (vUvk.z > 0.5) {
    // the cut top: fibre ends seen end-on, stippled and matte, fraying darker at its edge; it takes the low sun at a glance, so no highlight
    float st = 0.74 + 0.48 * gcNoise(vF * 5. + hh * 50.);
    float dots = 0.8 + 0.2 * step(0.4, gcNoise(vF * 13. + hh * 20.));
    vec2 e = abs(vF - 0.5);
    float fray = 1. - 0.34 * smoothstep(0.26, 0.5, max(e.x, e.y));
    c = col * 0.92 * mix(1., st * dots * fray, prd) * (uSunCol * vL.x * mix(1., 0.82, pr) + amb * vL.y + vWarm);
  } else {
    // flank and shoulder: fibres running up, dark at the root where the neighbours shade it, lit on the side toward the sun
    float streak = 0.5 + 0.62 * gcNoise(vec2(vUvk.x * 8. + hh * 31., yy * 0.6 + hh * 9.)) + 0.3 * gcNoise(vec2(vUvk.x * 27. + hh * 13., yy * 1.9 + hh * 5.));
    float g = mix(0.16, 1., smoothstep(0.3, 1., yy));
    float dH = dot(N.xz, normalize(uSunDir.xz + vec2(1e-4, 0.)));
    float face = max(0.74 + 0.92 * dH, 0.04) * (0.25 + 0.75 * g);
    c = col * 0.92 * mix(1., streak, prd) * (uSunCol * vL.x * mix(1., face, pr) + (amb * vL.y + vWarm) * mix(1., 0.22 + 0.78 * g, pr));
  }
  vec3 V = normalize(uCam - vP);
  float rim = 1. - abs(dot(N, V)); rim *= rim;
  c += vCol * amb * rim * 0.16 * pr;
  c += vCol * vGlow * 4.;
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}
`,Ot=`
varying vec3 vP; varying vec3 vN; varying vec2 vUv;
#include <fog_pars_vertex>
void main(){
  vP = position; vN = normal; vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,_t=`
${ae}
${me}
varying vec3 vP; varying vec3 vN; varying vec2 vUv;
#include <fog_pars_fragment>
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.));
  float s = vUv.y * 0.9 + vUv.x * 2.;
  float strand = abs(fract(s) - 0.5) * 2.;
  float fib = 0.82 + 0.36 * gcNoise(vec2(s * 30., vUv.y * 2. - vUv.x * 9.));
  float val = (0.5 + 0.5 * smoothstep(0.0, 0.7, strand)) * fib;
  vec3 col = uPal[1] * (0.92 + 0.16 * gcHash(vec2(floor(s), 2.)));
  float ndl = clamp(dot(N, uSunDir) * 0.7 + 0.3, 0., 1.);
  float up = 0.5 + 0.5 * N.y;
  float sunR = gcSun(vP);
  vec3 c = col * val * (uSunCol * sunR * ndl + gAO * (uSkyCol * (0.2 + 0.6 * up) + uBounceCol * (0.6 - 0.5 * up) + gcWarm(vP, N)));
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}
`,c=(s,u,n)=>new o.Vector3(s,u,n),vt=s=>Math.floor(s/D)*D+D*.5,Ve=(s,u)=>{const n=Math.sin(s*127.1+u*311.7)*43758.5453;return n-Math.floor(n)},Fe=(s,u)=>{const n=(s%(2*u)+2*u)%(2*u);return n<u?n:2*u-n},ve=s=>s&&s.isColor?s.clone():new o.Color(s);function Vt(){const s=[],u=[],n=[],_=[],K=[],P=[[0,1],[1,0],[0,-1],[-1,0]];for(let d=0;d<4;d++){const[B,C]=P[d],R=-C,H=B,g=s.length/3,m=(S,N,se,pe,xe)=>{s.push(B*S+R*S*se,N,C*S+H*S*se),u.push(B,xe,C),n.push(pe,N),_.push(0)};m(.48,0,-1,0,.1),m(.48,0,1,1,.1),m(.475,.76,1,1,.3),m(.475,.76,-1,0,.3),m(.37,1,1,.89,.6),m(.37,1,-1,.11,.6),K.push(g,g+2,g+1,g,g+3,g+2,g+3,g+4,g+2,g+3,g+5,g+4)}const I=s.length/3,Q=[[-1,-1],[1,-1],[1,1],[-1,1]];for(const[d,B]of Q)s.push(d*.37,1,B*.37),u.push(0,1,0),n.push(.5+d*.5,1),_.push(1);K.push(I,I+2,I+1,I,I+3,I+2);const k=new o.InstancedBufferGeometry;return k.setAttribute("position",new o.Float32BufferAttribute(s,3)),k.setAttribute("normal",new o.Float32BufferAttribute(u,3)),k.setAttribute("uv",new o.Float32BufferAttribute(n,2)),k.setAttribute("aKind",new o.Float32BufferAttribute(_,1)),k.setIndex(K),k}function Ft(s){const u=[],n=[],_=[],K=[];for(let P=-1;P<=1;P+=2){const I=u.length/3,Q=s.range(0,6);for(let k=0;k<=132;k++){const d=-te+2*te*k/132,B=P*(he+1.25)+Math.sin(d*.045+Q)*.35+Math.sin(d*.013+Q*2)*.5,C=le+1.3+Math.sin(d*.07+Q)*.12;for(let R=0;R<=7;R++){const H=R/7*Math.PI*2,g=Math.cos(H),m=Math.sin(H),S=1.55*(1+.07*Math.sin(H*3+d*1.4))*Math.max(.03,Math.sqrt(L(0,4,te-Math.abs(d))));u.push(B+g*S,C+m*S*.92,d),n.push(g,m,0),_.push(R/7,d/3.2)}}for(let k=0;k<132;k++)for(let d=0;d<7;d++){const B=I+k*8+d,C=B+7+1;K.push(B,C,B+1,B+1,C,C+1)}}const T=new o.BufferGeometry;return T.setAttribute("position",new o.Float32BufferAttribute(u,3)),T.setAttribute("normal",new o.Float32BufferAttribute(n,3)),T.setAttribute("uv",new o.Float32BufferAttribute(_,2)),T.setIndex(K),T}const pt={spring:{sun:[1,.8,.5],sky:[.25,.32,.47],bounce:[.36,.26,.16]},golden:{sun:[1.1,.66,.3],sky:[.25,.26,.36],bounce:[.4,.25,.13]},winter:{sun:[.7,.68,.66],sky:[.2,.28,.48],bounce:[.2,.22,.28]},night:{sun:[.3,.42,.7],sky:[.12,.17,.32],bounce:[.1,.1,.14]}};async function jt(s,u={}){const n=s.rng.fork?s.rng.fork("garden-carpet-hero"):s.rng,_=s.quality?.detail??1,K=s.vary||{},ne=(u.palette&&u.palette.length>=7?u.palette:Rt).slice(0,7).map(e=>{const t=new o.Color(e),a=.2126*t.r+.7152*t.g+.0722*t.b;return t.lerp(new o.Color(a,a,a),.27).multiplyScalar(.82)}),[X,T,P,I,Q,k]=ne,d=K.hour||"any",B=n(),C=Dt||u.variant||(d==="dawn"?"winter":d==="night"?"night":d==="golden"||d==="day"||B<.5?"spring":B<.78?"winter":"night"),R=pt[C==="spring"&&d==="golden"?"golden":C]||pt.spring,H=Et||(u.rare??!!K.rare),g=u.lead||(n.chance(.3)?"ducks":"carp"),m=C==="winter"?1:0,S=C==="night"?1:0,N=(e,t,a)=>e.clone().lerp(t,a),se=m?X.clone().multiplyScalar(.93):S?N(P,I,.1):N(T,P,n.range(0,.12)),pe=m?N(T,P,.1):S?N(T,P,.34):N(T,P,n.range(.2,.45)),xe=m?N(I,X,.3):S?N(I,X,.2).multiplyScalar(.8):N(I,X,.12),xt=m?N(P,I,.12):S?N(T,P,.4):k.clone(),wt=ht,we=[],be=[];for(let e=0;e<wt;e++)we.push(new o.Vector4(0,0,1,0)),be.push(new o.Vector4(0,0,1,0));const ye=c(.74,.31,.6).normalize(),ke=[],ie=[],$e=15;for(let e=0;e<$e;e++)ke.push(new o.Vector4(0,-999,0,1)),ie.push(new o.Vector4(0,-999,0,0));const je=[];for(let e=0;e<40;e++)je.push(new o.Vector4(0,0,0,1));let oe=1,Xe=1;const Qe=[new o.Vector4(0,-999,0,100),new o.Vector4(0,-999,0,100)],Ae=[new o.Vector4(0,0,0,.5),new o.Vector4(0,0,0,.5)],l={uTime:{value:0},uPal:{value:ne},uGround:{value:se},uBorderG:{value:pe},uWaterC:{value:xe},uBedC:{value:xt},uWinter:{value:m},uNight:{value:S},uCrA:{value:we},uCrB:{value:be},uSunDir:{value:ye},uSunCol:{value:new o.Color().fromArray(R.sun)},uSkyCol:{value:new o.Color().fromArray(R.sky)},uBounceCol:{value:new o.Color().fromArray(R.bounce)},uWin:{value:new o.Vector4(680,551,600,0)},uWin2:{value:new o.Vector4(150,800,18,2.7)},uBranch:{value:new o.Vector4(0,.55,1,100)},uBrA:{value:new o.Vector4(221,190,521,400)},uMul:{value:new o.Vector4(551,105,15,0)},uMul2:{value:new o.Vector4(0,6,0,0)},uOccA:{value:ke},uOccB:{value:ie},uOccSkip:{value:new o.Vector2(-1,-1)},uPenK:{value:1},uLatK:{value:1},uCloud:{value:0},uLampP:{value:Qe},uLampC:{value:Ae},uWave:{value:new o.Vector4(-9999,13,46,0)},uAmbTint:{value:new o.Color(1,1,1)},uCam:{value:c(0,100,400)},uTuft:{value:new o.Vector4(34,48,1,0)},uGar:{value:new o.Vector4(0,0,0,0)},uGT:{value:je},uPacerK:{value:1}},re=(e={})=>Object.assign(o.UniformsUtils.merge([o.UniformsLib.fog]),l,e),Y=new o.Group;Y.name="garden-carpet-hero",await s.yield?.();const Be=new o.PlaneGeometry(2*he,2*te,96,156);await s.yield?.(),Be.rotateX(-Math.PI/2),Be.translate(0,le,0),await s.yield?.();const bt=new o.ShaderMaterial({uniforms:re({uBack:{value:0},uShell:{value:new o.Vector4(0,0,0,0)}}),vertexShader:mt,fragmentShader:gt,fog:!0}),Ce=new o.Mesh(Be,bt);Ce.frustumCulled=!1,Ce.name="carpet",Y.add(Ce),await s.yield?.();const ce=ee(38,54,de((_-.6)/.4,0,1));l.uTuft.value.set(ce-19,ce,1,0);const Ie=Math.max(1e3,Math.round(u.tufts??9800*(ce/54)*(ce/54))),fe=Vt(),Se=new Float32Array(Ie*2),ze=new o.InstancedBufferAttribute(Se,2);ze.setUsage(o.DynamicDrawUsage),fe.setAttribute("aKnot",ze),fe.instanceCount=0;const yt=new o.ShaderMaterial({uniforms:re(),vertexShader:Kt,fragmentShader:Ht,fog:!0}),Me=new o.Mesh(fe,yt);Me.frustumCulled=!1,Me.name="tufts",Y.add(Me),await s.yield?.();const kt=new o.ShaderMaterial({uniforms:re(),vertexShader:Ot,fragmentShader:_t,fog:!0,side:o.DoubleSide}),Pe=new o.Mesh(Ft(n),kt);Pe.frustumCulled=!1,Pe.name="selvedge",Y.add(Pe),await s.yield?.();const ue=n.chance(.5)?1:-1,Ye=[];for(let e=0;e<5;e++)Ye.push({r:44+e*3.4+n.range(-1,1),a0:e/5*Math.PI*2+n.range(-.25,.25),w:n.range(.085,.115),seed:n.range(0,6),out:n.range(.5,1)});const At=[[0,-1],[0,1],[1,0],[-1,0]].map((e,t)=>({d:e,off:n.range(0,300),speed:n.range(2,2.8),side:n.chance(.5)?1:-1})),Ne=[[1,1],[-1,1],[1,-1],[-1,-1]],Ze=[];for(let e=0;e<6;e++){const[t,a]=Ne[e%4];Ze.push(e<4?{sx:t,sz:a,az:262+n.int(0,2)*14.4+2.1,x0:e===0?56:40,x1:e===0?122:140,off:n.range(0,200),per:n.range(16,26)}:{sx:1,sz:e===4?1:-1,az:44+(e===4?0:n.int(0,1)*50),x0:130,x1:154,off:n.range(0,90),per:n.range(14,22)})}const We=[0,0],Bt=e=>{const t=Ne[e&3],a=(e>>2)%6;return We[0]=t[0]*(72+a%2*36),We[1]=t[1]*(150+(a/2|0)*30+2.5),We},Je=[];for(let e=0;e<4;e++)Je.push({k:n.range(0,100),q:e});const x=c(),qe=c(),et=c(0,0,-150);let tt=-1,Te=null,at=!1,ot=1;const ct=[-1,0,1,0],Ct=[0,0],It=[0,0],lt=(e,t,a,r)=>{const z=Ve(t,a*7.7+r.k),W=Bt(r.q+4*Math.floor(z*6));return e[0]=W[0]+(Ve(t,3.3+a)-.5)*12,e[1]=W[1]+(Ve(t,8.1+a)-.5)*12,e};function Z(e,t,a,r,z,W,U,V,O){we[e].set(vt(a),vt(r),z,W),be[e].set(t,U,V,O)}function St(e){const t=m?e*.45:e,a=l.uWave.value,r=a.w>.01?L(-70,20,a.x)*(1-L(140,420,a.x)):0;for(let f=0;f<5;f++){const i=Ye[f],v=i.r+r*12*i.out,q=D/v,p=Math.floor((i.a0+ue*i.w*t)/q)*q+r*Math.sin(i.seed*9)*.5,A=Math.round(p/(Math.PI/36))*(Math.PI/36)+r*ue*-1.1,w=ct[Math.floor(t*3+f*1.3)&3],M=Math.cos(p)*v,G=Math.sin(p)*v,h=r>.5?1:0,y=M+r*Math.max(0,Math.min(a.x+26,52)+f*9-M),b=G*(1-.72*r);Z(f,1,y,b,h?1:-Math.sin(A)*ue,h?0:Math.cos(A)*ue,w,m?.82:1,i.seed)}const z=(1-L(50,64,x.y))*(1-L(40,70,Math.abs(x.x)))*L(16,-22,x.z)*(1-L(330,372,-x.z)),W=Math.max(ee(8,30,L(-85,-128,x.z)),x.y*2),U=-84-Fe(t*3.2,30),V=ee(U,Math.max(x.z-W,-372),z),O=ee(0,de(x.x*.35+1.5,-4.5,4.5),z);l.uPacerK.value=g==="carp"?1+1*L(15,40,x.y)*z:1,et.set(O,2.6,V);const J=ct[Math.floor(t*3.5)&3];g==="carp"?Z(5,1,O,V,0,-1,J,m?.82:1,2.2):Z(5,1,0,120+Fe(t*3,190),0,1,J,m?.82:1,2.2);for(let f=0;f<4;f++){const i=At[f],v=i.d[0]===0,q=v?124:112,p=v?180:52,A=(m?.2:1)*e*i.speed+i.off;let w=q+Fe(A,p),M=(A%(2*p)+2*p)%(2*p)<p?1:-1,G=3.3*i.side;f===0&&g==="ducks"&&(w=-V,M=1,G=O-3);const h=Math.floor(e*4)%8;for(let y=0;y<2;y++){const b=w-y*13.2*M,E=G+(y?-6.6*i.side:0),$=v?E:i.d[0]*b,j=v?i.d[1]*b:E;Z(6+f*2+y,2,$,j,i.d[0]*M,i.d[1]*M,h,1,y?0:1)}}for(let f=0;f<6;f++){const i=Ze[f],v=i.per,q=e+i.off,p=Math.floor(q/v),A=q-p*v,w=v*.62,M=p*w+Math.min(A,w),G=Math.floor(M*1.15),h=i.x1-i.x0,b=(G*1.2%(2*h)+2*h)%(2*h),E=b<h?1:-1,$=i.x0+(b<h?b:2*h-b),j=A>w+.8&&A<v-.8?10:0,F=E*i.sx;Z(14+f,m?5:3,i.sx*$,i.sz*i.az,F,0,(G&3)+j,-F,0)}for(let f=0;f<4;f++){const i=Je[f],v=e/2.6+i.k,q=Math.floor(v),p=Math.floor(de((v-q-.72)/.28,0,.999)*4)/4,A=lt(Ct,q,f,i),w=lt(It,q+1,f,i),M=ee(A[0],w[0],p),G=ee(A[1],w[1],p);let h=w[0]-A[0],y=w[1]-A[1];const b=Math.hypot(h,y)||1;h/=b,y/=b;const E=Math.round(Math.atan2(y,h)/(Math.PI/4))*(Math.PI/4);Z(20+f,S?6:4,M,G+(p>0&&p<.75?-1.2:0),Math.cos(E),Math.sin(E),Math.floor(e*4)&1,1,0)}}let Ge=1e9,nt=1e9,st=1e9;function zt(e){const t=fe,a=1-L(38,60,x.y);l.uTuft.value.z=a;const r=ce*oe;if(l.uTuft.value.x=r-19*oe,l.uTuft.value.y=r,a<=.001){t.instanceCount=0,Ge=1e9;return}e.getWorldDirection(qe);let z=qe.x,W=qe.z;const U=Math.hypot(z,W);U<.05?(z=0,W=-1):(z/=U,W/=U);const V=Math.round(Math.atan2(z,W)/.035),O=Math.floor(x.x/D),J=Math.floor(x.z/D);if(Math.abs(O-Ge)<2&&Math.abs(J-nt)<2&&V===st&&Math.abs(oe-Xe)<.02)return;Ge=O,nt=J,st=V,Xe=oe;const f=r+.5,i=9.5,v=Math.cos(1),q=f*f,p=x.x-z*i,A=x.z-W*i,w=Math.ceil(f/D)+1,M=he-.01,G=te-.01;let h=0;for(let y=-w;y<=w&&h<Ie;y++){const b=(J+y+.5)*D;if(b<-G||b>G)continue;const E=b-x.z,$=b-A;for(let j=-w;j<=w;j++){const F=(O+j+.5)*D;if(F<-M||F>M)continue;const dt=F-x.x;if(dt*dt+E*E>q)continue;const De=F-p,Ke=De*z+$*W;if(!(Ke<0||Ke*Ke<v*v*(De*De+$*$))){if(h>=Ie)break;Se[h*2]=F,Se[h*2+1]=b,h++}}}t.instanceCount=h,ze.needsUpdate=!0}const it=c();function Le(e){const t=l.uWave.value;if(Te!==null){t.x=Te,t.w=1;return}const a=(e-.415)/.24;if(!H||a<.04||a>.96){t.w=0,t.x=-9999;return}t.x=-330+660*a,t.w=L(.04,.2,a)*(1-L(.8,.96,a))}function rt(e,t,a){l.uTime.value=t,a&&(Y.getWorldPosition(it),a.getWorldPosition(x).sub(it),l.uCam.value.copy(x)),l.uWin.value.w=-t*.21,l.uBranch.value.x=ot*(14*Math.sin(t*.6)+6*Math.sin(t*1.7+1)),at||Le(H?.43+t%16/16*.22:-1),St(t),a&&zt(a)}function Mt(e){at=!0,tt=e,Le(e)}function Pt(e){Te=e??null,Le(tt)}function Nt(e={}){if(e.sunDir&&ye.fromArray(e.sunDir).normalize(),e.sunColor!==void 0&&l.uSunCol.value.copy(ve(e.sunColor)),e.skyColor!==void 0&&l.uSkyCol.value.copy(ve(e.skyColor)),e.bounceColor!==void 0&&l.uBounceCol.value.copy(ve(e.bounceColor)),e.window){const t=e.window,a=l.uWin.value,r=l.uWin2.value;a.set(t.x??a.x,t.zc??a.y,t.hz??a.z,a.w),r.set(t.y0??r.x,t.y1??r.y,t.cell??r.z,t.bar??r.w)}e.branch!==void 0&&(l.uBranch.value.y=e.branch),e.leaf!==void 0&&(l.uBranch.value.z=e.leaf),e.posts!==void 0&&(l.uBranch.value.w=e.posts),e.mullions&&l.uMul.value.fromArray(e.mullions),e.transoms&&l.uMul2.value.set(e.transoms[0],e.transoms[1],e.transoms[2]||0,0),e.branchLine&&l.uBrA.value.fromArray(e.branchLine),e.sway!==void 0&&(ot=e.sway),e.cloud!==void 0&&(l.uCloud.value=e.cloud),e.lattice!==void 0&&(l.uLatK.value=e.lattice),e.ambTint!==void 0&&l.uAmbTint.value.copy(ve(e.ambTint))}function Wt(e=[]){for(let t=0;t<$e;t++){const a=e[t];if(!a){ie[t].w=0;continue}const r=a.b||a.a;ke[t].set(a.a[0],a.a[1],a.a[2],a.r),ie[t].set(r[0],r[1],r[2],1)}}function qt(e=[]){for(let t=0;t<2;t++){const a=e[t];if(!a){Ae[t].set(0,0,0,.5);continue}Qe[t].set(a.p[0],a.p[1],a.p[2],a.reach??200),Ae[t].set(a.color[0],a.color[1],a.color[2],a.wrap??.5)}}function Tt(e={}){const t=l.uGar.value;e.water!==void 0&&(t.x=e.water),e.beds!==void 0&&(t.y=e.beds),e.shadow!==void 0&&(t.w=e.shadow),e.tufts!==void 0&&(oe=de(e.tufts,.3,1))}function Gt(e={}){const t=e.occSkip||[-1,-1];return new o.ShaderMaterial({uniforms:re({uBack:{value:e.back?1:0},uOccSkip:{value:new o.Vector2(t[0],t[1])},uPenK:{value:e.penumbra??1},uShell:{value:new o.Vector4(e.shell??0,e.pile??0,e.pile?1:0,e.fill??0)}}),defines:{GC_WEAVE:1},vertexShader:mt,fragmentShader:gt,fog:!0,side:e.side??o.DoubleSide})}const ft=[],ut=[],Re=[];for(const[e,t]of Ne){for(const a of[27,153])for(const r of[160,200])ft.push(c(e*a,3.2,t*r));for(const a of[72,108])for(const r of[152.5,182.5,212.5])ut.push(c(e*a,2.6,t*r));for(const a of[43,87,131])Re.push(c(e*a,2.6,t*279));for(const a of[44,94])Re.push(c(e*142,2.6,t*a))}const Lt={entry:c(0,9,435),apex:c(140,150,100),pool:c(0,0,0),poolRadius:100,rosetteRadius:22,carpRing:52,poolPass:c(-20,60,-10),canalRun:[c(0,11,-130),c(-8,9.2,-165),c(0,14,-210)],closePass:{position:c(-27,3.2,-160),length:34,width:13},portalSeat:{position:c(0,35,-316),facing:c(0,0,1)},rollAxis:{from:c(0,35,-310),to:c(0,35,-460),radius:35,hollow:11},flyThrough:[c(0,9,435),c(0,9,374),c(0,9,287),c(60,60,205),c(140,150,100),c(70,96,40),c(-20,60,-10),c(-60,16,-30),c(0,11,-130),c(-8,9.2,-165),c(0,14,-210),c(0,35,-316)],cat:c(-150,0,-250),chairLegs:[c(-212,0,140),c(-212,0,-10)],slippers:c(195,0,-130),yarn:c(150,0,240),fringeGate:c(0,0,395),cypresses:ft,trees:ut,beds:Re,window:{x:680,zc:551,hz:600,y0:150,y1:800,cell:18,bar:2.7},sunDir:ye.clone(),pileTop:le+3.03,tuftTop:le+2.43,halfWidth:he,halfLength:te,knot:D};await s.yield?.(),rt(0,0,null),await s.yield?.();const Ee=He===1?{radius:70,height:150,center:c(0,0,0)}:He===2?{radius:2,height:26,center:c(-14,2,-160)}:He===3?{radius:4,height:30,center:c(60,2,285)}:{radius:110,height:150,center:c(0,0,0)};return{object:Y,radius:Ee.radius,height:Ee.height,center:Ee.center,anchors:Lt,update:rt,dispose(){},ground:!0,groundY:0,setProgress:Mt,setLighting:Nt,setWave:Pt,makeWeaveMaterial:Gt,setOccluders:Wt,setLamps:qt,setGarden:Tt,variant:C,lead:g,rare:H,uniforms:l,pacer:et,lightUniforms:{uSunDir:l.uSunDir,uSunCol:l.uSunCol,uSkyCol:l.uSkyCol,uBounceCol:l.uBounceCol,uWin:l.uWin,uWin2:l.uWin2,uBranch:l.uBranch,uBrA:l.uBrA,uMul:l.uMul,uMul2:l.uMul2,uOccA:l.uOccA,uOccB:l.uOccB,uLampP:l.uLampP,uLampC:l.uLampC,uTime:l.uTime},glsl:{common:ae,light:me,nap:ge,dye:Oe+_e}}}export{jt as buildHero};
