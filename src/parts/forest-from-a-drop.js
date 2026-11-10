import*as a from"three";import{mergeGeometries as yt}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as de,lerp as ie,smoothstep as Re}from"../kit/core.js";const be=["#EFE3C4","#C9A45A","#6F8FA6","#C99A5B","#8C8A4A","#4A2E20","#2B1D1A"],He=Math.PI*2,Ve=`
uniform float uTime;
uniform vec3 uWinDir, uWinU, uWinV;   // the one window: direction to it and its right/up axes (world)
uniform vec2 uWinSize;                // half size as tangents
uniform vec3 uWinCol;
float h11(float n){ return fract(sin(n * 127.1) * 43758.5453); }
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec2 h22(vec2 p){ return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
float vn1(float x){ float i = floor(x), f = fract(x); f = f * f * (3. - 2. * f); return mix(h11(i), h11(i + 1.), f); }
float vn2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
// The window: a soft cream rounded rectangle of four panes with a cross bar, found from the
// reflection vector r. soft = edge softness (tangent units), wob = offset that distorts it on wet slip.
float mochaWindow(vec3 r, float soft, vec2 wob){
  float d = dot(r, uWinDir);
  vec2 p = vec2(dot(r, uWinU), dot(r, uWinV)) / max(d, 0.05) + wob;
  float aa = max(soft, 1.5 * max(fwidth(p.x), fwidth(p.y)));
  vec2 q = abs(p) - uWinSize + 0.03;
  float sd = length(max(q, 0.)) + min(max(q.x, q.y), 0.) - 0.03;
  float w = 1. - smoothstep(-aa, aa, sd);
  float bw = uWinSize.x * 0.07;
  float bar = min(abs(p.x), abs(p.y));
  w *= mix(0.3, 1., smoothstep(bw - aa, bw + aa, bar));
  return w * step(0.05, d);
}
`,Ge=`
uniform float uPale;    // how far distance pales everything toward cream (0..1)
uniform float uWinK;    // strength of the window on this material (1; the Great Jar's own materials share one the hero eases)
vec2 mochaWob(vec3 w){
  return (vec2(vn2(vec2(dot(w.xz, vec2(0.71, 0.71)) * 0.21, w.y * 0.03 + uTime * 0.7)),
               vn2(vec2(dot(w.xz, vec2(0.71, -0.71)) * 0.21 + 9., w.y * 0.03 - uTime * 0.6))) - 0.5) * 0.085;
}
// wet slip is still moving: it dries in long runs that sag down the wall (the only weather). Glaze and stain both
// multiply their wetness by this, so a ribbon's ground is always the tone of the slip under it.
// thr: how dry the slip is here. Under -0.2 it is wet all over (just laid), 0.845 leaves the long wet runs, over 1.8 it is dry.
float mochaSheenT(vec3 w, float thr){
  float s = vn2(vec2(dot(w.xz, vec2(0.6, 0.8)) * 0.024, w.y * 0.009 + uTime * 0.1));
  s += 0.5 * vn2(vec2(dot(w.xz, vec2(-0.8, 0.6)) * 0.06 + 7., w.y * 0.022 + uTime * 0.18));
  s += 0.22 * vn2(vec2(dot(w.xz, vec2(0.8, 0.6)) * 0.21 + 3., w.y * 0.045 + uTime * 0.12));   // the drying line is ragged, never a smooth arc
  float e = max(1.2 * fwidth(s), 1e-4);                 // a crisp drying line: flat tone either side, one pixel of edge
  return 0.06 + 0.94 * smoothstep(thr - e, thr + e, s);
}
float mochaSheen(vec3 w){ return mochaSheenT(w, 0.845); }
// (polish 1) The window is crisp and whole on every surface: one small steady tremble everywhere, never a wobble that jumps
// at a drying line (from the valley that read as a torn, blurred pane on the Jar).
vec3 mochaWin(vec3 col, vec3 V, vec3 N, vec3 w){
  float win = mochaWindow(reflect(V, N), 0.005, mochaWob(w) * 0.12);
  return clamp(mix(col, uWinCol, 0.85 * win * uWinK), 0., 1.);
}
vec3 mochaFinish(vec3 col, vec3 cream, vec3 V, vec3 N, vec3 w, float wet, float dist){
  col = mix(col, cream, uPale * (1. - exp(-dist / 900.)));
  return mochaWin(col, V, N, w);
}
`,bt=`
attribute vec4 aBand; attribute vec3 aSurf;
varying vec4 vBand; varying vec3 vSurf; varying vec3 vW; varying vec3 vN;
void main(){
  vBand = aBand; vSurf = aSurf;
  vec4 w = modelMatrix * vec4(position, 1.);
  vW = w.xyz; vN = mat3(modelMatrix) * normal;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,gt=`
${Ve}
${Ge}
uniform vec3 uCream, uHoney, uBlue, uTan, uOlive, uChoc, uInk, uRust, uOrange, uDark;
uniform vec3 uLap;
#ifdef MOCHA_FLOOR
uniform vec3 uPots[32];   // the floor only: (x, z, foot radius) of everything that stands on it
uniform vec4 uFlood;      // (polish 3) the burst of slip: (x, z) of the great strike's foot, the radius the blue slip has run to over the tray, 0
uniform vec2 uShade;      // (polish 3) the way the glaze ran on the tray: every pool is drawn out that way from its pot's foot
#endif
uniform float uLead;    // (polish 3) strength of the dark wet edge of a clock front (the Pitcher's read as a ragged patch at arm's length)
uniform float uFringe;  // 1: beyond 150 m the glaze draws the dark fringe of far trees itself; 0: this pot carries real trees at any distance
uniform vec4 uWet;      // x: 0 = slip front from the clock, 1 = hero front; y: hero front angle; z: hero wetness; w: drip growth
varying vec4 vBand; varying vec3 vSurf; varying vec3 vW; varying vec3 vN;

// distance to the nearest cell edge of a jittered cell net (crazing); p in cells
float crazeNet(vec2 p){
  vec2 ip = floor(p), fp = fract(p);
  float d1 = 9., d2 = 9.;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j));
    vec2 o = g + 0.15 + 0.7 * h22(ip + g) - fp;
    float d = dot(o, o);
    if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; }
  }
  return sqrt(d2) - sqrt(d1);
}

void main(){
  float t = vBand.x, mpt = max(vBand.y, 0.01), R = max(vSurf.y, 1.);
  float band = floor(t), f = t - band, m = f * mpt;            // m: metres above this band's foot
  float ang = vSurf.x, arc = ang * R, hgt = vSurf.z;
  vec3 Vd = vW - cameraPosition; float dist = length(Vd);
  vec3 V = Vd / max(dist, 1e-3);
  float nl = length(vN); vec3 N = vN / max(nl, 1e-5);
  if (!gl_FrontFacing) N = -N;
  vec2 sp = vec2(arc, hgt);
  vec2 fw = vec2(length(vec2(dFdx(sp.x), dFdy(sp.x))), length(vec2(dFdx(sp.y), dFdy(sp.y))));
  float px = max(max(fw.x, fw.y), 1e-4);                       // metres per pixel on the surface

  // ---- the slip, band by band, in the potter's order
  vec3 col = uCream; float isBlue = 0., slip = 1.;
  if (t < 0. || band >= 4.) { slip = 0.; }
  else if (band < 1.) col = uChoc;
  else if (band < 2.) col = uOlive;
  else if (band < 3.) col = uTan;
  else { col = uBlue; isBlue = 1.; }

  // ---- wet slip: an angle front from the clock (or the hero's own front)
  // uLap = (a0, S, T): the front spends T of each lap crossing the S of the pot that starts at a0 (turns); S = T is an even lap
  float ca0 = fract(ang / 6.2831853 - uLap.x), inS = step(ca0, uLap.y);
  float nL = ceil(uLap.z - 1e-4);                             // T over 1: more than one front is in the sector at a time
  float ca = mix(uLap.z + (ca0 - uLap.y) / max(1. - uLap.y, 1e-3) * (nL - uLap.z), ca0 / max(uLap.y, 1e-3) * uLap.z, inS);   // the lap time at which the front is here
  float mLap = 6.2831853 * R * mix((1. - uLap.y) / max(nL - uLap.z, 1e-3), uLap.y / max(uLap.z, 1e-3), inS);                 // metres it travels per lap here
  float wobM = 4.5 * sin(hgt * 0.19 + vBand.w * 40.) + 5. * (vn1(hgt * 0.4 + 3.) - 0.5);
  float behind = fract(fract(uTime / 24. + vBand.w) - ca + wobM / mLap);      // laps since the slip was laid here: 0 just laid ... 1 oldest
  float thr = mix(-0.3, 2., smoothstep(0.02, 0.6, behind)), wet = 1.;   // just laid: wet all over; then it dries in crisp runs; dry by 0.6 of a lap
  float lw = clamp(max(2.4, 2.5 * px) / mLap, 0.0015, 0.06), la = clamp(px / mLap, 1e-5, 0.01);
  float lead = (1. - smoothstep(lw, lw + la, behind)) * uLead;                            // the edge of the wet slip: one dark wobbling line
  if (uWet.x > 0.5) {
    float bm = (uWet.y - ang) * R + 14. * sin(hgt * 0.045 + 1.) + 9. * (vn1(hgt * 0.12) - 0.5);   // metres behind the hero front
    float le = max(6., 3.5 * px);
    wet = smoothstep(0., px, bm) * uWet.z;
    thr = mix(-0.3, 0.845, smoothstep(30., 380., bm));
    lead = smoothstep(0., px, bm) * (1. - smoothstep(le, le + px, bm));
  }
  wet *= isBlue * mochaSheenT(vW, thr); lead *= isBlue;

  // ---- on the blue only: pinstripes, the cog border, and below it the drips
  if (isBlue > 0.5) {
    float pw = mpt * 0.011 + 0.15, top = mpt - m;
    float a1 = max(px, 0.02);
    float pin = smoothstep(pw * 0.7 - a1, pw * 0.7 + a1, m) * (1. - smoothstep(pw * 1.7 - a1, pw * 1.7 + a1, m));
    pin = max(pin, smoothstep(pw * 0.7 - a1, pw * 0.7 + a1, top) * (1. - smoothstep(pw * 1.7 - a1, pw * 1.7 + a1, top)));
    float per = max(10., mpt * 0.075);
    float nT = max(floor(6.2831853 * R / per), 3.);
    float ca = fract(ang * nT / 6.2831853);
    float aT = clamp(fw.x * nT / (6.2831853 * R), 1e-4, 0.25);
    float tooth = smoothstep(0.25 - aT, 0.25 + aT, ca) * (1. - smoothstep(0.75 - aT, 0.75 + aT, ca));
    float c0 = pw * 2.6, c1 = pw * 2.6 + mpt * 0.03;
    float cog = tooth * smoothstep(c0 - a1, c0 + a1, top) * (1. - smoothstep(c1 - a1, c1 + a1, top));
    cog = max(cog, smoothstep(c1 - a1, c1 + a1, top) * (1. - smoothstep(c1 + pw - a1, c1 + pw + a1, top)));
    col = mix(col, uBlue * 0.9, wet * mix(0.8, 0.55, step(uWet.x, 0.5) * (1. - uLead)));
    col = mix(col, uBlue * 0.62, lead);
    if (uWet.x < 0.5) {                                         // distance: the trees thin to a dark fringe along the foot of the blue
      float fk = smoothstep(150., 400., dist) * uFringe, pS = floor(vBand.w * 512. + 0.5);
      float xc = arc / (mpt * 0.31) + pS * 0.37, hh = h11(floor(xc) * 1.7 + pS), xf = abs(fract(xc) - 0.5) * 2.;
      float xd = arc / (mpt * 0.13) + pS * 0.11, hd = h11(floor(xd) * 2.3 + pS + 5.), xg = abs(fract(xd) - 0.5) * 2.;
      float gA = clamp((behind - 0.07 - 0.2 * hh) / 0.2, 0., 1.), gB = clamp((behind - 0.05 - 0.25 * hd) / 0.15, 0., 1.);
      // (polish 1) each far tree is a fan: a stem that opens into a round crown, as the dendrites do (they were humps, and read as hills)
      float mm = m - pw * 1.7, ax = 2. * max(fwidth(xc), 1e-4), ag = 2. * max(fwidth(xd), 1e-4);
      float tA = max(mpt * (0.3 + 0.42 * hh) * gA, 1e-3), tB = max(mpt * (0.12 + 0.2 * hd) * gB, 1e-3);
      float frA = (1. - smoothstep(-a1, a1, mm - tA * sqrt(max(1. - xf * xf, 0.)))) * (1. - smoothstep(-ax, ax, xf - 0.08 - 0.92 * clamp(mm / tA, 0., 1.))) * step(0.01, gA);
      float frB = (1. - smoothstep(-a1, a1, mm - tB * sqrt(max(1. - xg * xg, 0.)))) * (1. - smoothstep(-ag, ag, xg - 0.1 - 0.9 * clamp(mm / tB, 0., 1.))) * step(0.01, gB);
      float fr = max(frA, frB) * step(0., mm);
      col = mix(col, uInk, 0.78 * fr * fk);
    }
    col = mix(col, uInk, max(pin, cog));
  }
  if (band == 2.) {                                             // the hand: a blue drip runs below its line
    float nD = max(floor(6.2831853 * R / (mpt * 1.7 + 14.)), 3.);
    float ca = ang * nD / 6.2831853, ci = floor(ca);
    float sd = floor(vBand.w * 512. + 0.5);                     // an exact number: a hash must not see interpolation noise
    float on = step(0.72, h11(ci + sd * 3.));
    float wD = 0.5 + mpt * 0.05, L = mpt * (0.25 + 0.55 * h11(ci * 3. + sd + 2.)) * (0.55 + 0.45 * uWet.w);
    float x = (fract(ca) - 0.5) * 6.2831853 * R / nD, dn = mpt - m;
    float yy = clamp(dn, 0., L);
    float dd = length(vec2(x, dn - yy)) - wD * (0.55 + 0.45 * yy / max(L, 0.01));
    col = mix(col, uBlue * 0.92, on * (1. - smoothstep(-px, px, dd)));
  }
`,Mt=`
  // ---- honey: pooled along the foot of every band, and wherever the vertex mask says a hollow is
  float hw = 0.25 + mpt * 0.02;
  float foot = (t < 0.) ? 0. : (1. - smoothstep(0., hw, m));
  foot *= foot;
  float pool = clamp(max(vBand.z, foot * 0.9), 0., 1.);
  #ifdef MOCHA_FLOOR
  float inF = 0., edgeF = 0., hF = 0., edgeH = 0.;
  {
    // (polish 3) THE TRAY. The pots stand on a tray of the same ware, and its glaze is where the picture gets its depth: under
    // every pot the honey has pooled deep and run one way (uShade), flat inside a drawn edge, a darker pool inside a paler one:
    // the ware's own "shadow". Further out it lies in broad flat patches, the wheel's turning lines go round the Great Jar,
    // and one slate-blue line runs round it as round the sky.
    float pxF = max(max(fwidth(vW.x), fwidth(vW.z)), 1e-3), dP = 1e5;
    for (int i = 0; i < 32; i++) {
      vec3 q = uPots[i]; vec2 d = vW.xz - q.xy;
      float L = q.z * 1.5 + 30., h = clamp(dot(d, uShade) / L, 0., 1.);
      dP = min(dP, length(d - uShade * (L * h)) - q.z * mix(1.06, 0.62, h) - 12.);
    }
    float wP = 9. * (vn2(vW.xz * 0.045) - 0.5) + 3. * (vn2(vW.xz * 0.17 + 5.) - 0.5);         // the pool's edge wanders like a poured glaze
    float dO = dP + wP, dI = dP + 30. + 1.6 * wP;
    float inP = 1. - smoothstep(-pxF, pxF, dO), inI = 1. - smoothstep(-pxF, pxF, dI), lw = max(0.6, 1.2 * pxF);
    float rim = max((1. - smoothstep(lw, lw + pxF, abs(dO))), 0.7 * (1. - smoothstep(lw, lw + pxF, abs(dI)))) * clamp(2.2 / pxF, 0., 1.);
    float nP = vn2(vW.xz * 0.0052 + 11.) + 0.45 * vn2(vW.xz * 0.019 + 3.);
    float eP = max(fwidth(nP), 1e-4);
    float inQ = smoothstep(0.7 - eP, 0.7 + eP, nP), inQ2 = smoothstep(0.93 - eP, 0.93 + eP, nP);
    float rimQ = max(1. - smoothstep(eP, 2.2 * eP, abs(nP - 0.7)), 1. - smoothstep(eP, 2.2 * eP, abs(nP - 0.93))) * clamp(0.004 / eP, 0., 1.);
    pool = clamp(max(max(pool, 0.72 * inQ + 0.24 * inQ2), 0.92 * inP), 0., 1.);
    float rF = length(vW.xz), pxR = max(fwidth(rF), 1e-3);
    float dR = abs(fract(rF / 85. + 0.3 * vn1(rF / 85. + 2.)) - 0.5) * 85., wR = max(0.7, 1.1 * pxR);
    float ring = (1. - smoothstep(wR, wR + pxR, dR)) * clamp(4. / pxR, 0., 1.) * (1. - inP);
    float dB = abs(rF - 1012. - 9. * (vn2(vW.xz * 0.011) - 0.5)), wB = max(1.6, 1.1 * pxR);
    float blueL = (1. - smoothstep(wB, wB + pxR, dB)) * (1. - inP) * clamp(6. / pxR, 0., 1.);
    // the burst of slip: from the great strike a sheet of wet blue runs out over the tray, lobed like a splash, a dark wet edge leading it
    vec2 dF2 = vW.xz - uFlood.xy; float rf = length(dF2), af = atan(dF2.x, abs(dF2.y) + 1e-4);
    float lobes = 0.11 * sin(af * 9. + 1.3) + 0.07 * sin(af * 17. + 4.) + 0.05 * sin(af * 31. + 2.);
    float dFl = rf - uFlood.z * (1. + lobes) + 16. * (vn2(vW.xz * 0.021 + 3.) - 0.5);
    float lwF = max(2.2, 1.6 * pxF);
    inF = (1. - smoothstep(-pxF, pxF, dFl)) * step(2., uFlood.z);
    edgeF = inF * (1. - smoothstep(lwF, lwF + pxF, -dFl));
    // (polish 5) behind the blossom the flood turns: a second front runs out from the strike (uFlood.w) and inside it the slip is warm
    float dH = rf - uFlood.w * (1. + 0.6 * lobes) + 24. * (vn2(vW.xz * 0.017 + 9.) - 0.5);
    hF = (1. - smoothstep(-pxF, pxF, dH)) * step(2., uFlood.w) * inF;
    edgeH = hF * (1. - smoothstep(lwF, lwF + pxF, -dH));
    float deep = mix(0.38, 0.62, inI);                                                         // honey, then honey gone toward chocolate
    col = mix(col, mix(uHoney, uChoc, deep), max(0.8 * inI, 0.62 * rim) * (1. - inF));
    col = mix(col, uHoney * 0.84, 0.5 * rimQ * (1. - inP) * (1. - inF));
    col = mix(col, uHoney * 0.88, 0.55 * ring * (1. - inF));
    col = mix(col, uBlue, 0.85 * blueL * (1. - inF));
    pool *= (1. - inF * (1. - 0.9 * inI)) * (1. - 0.72 * inI);
    slip = max(slip, inF);
  }
  #endif
  if (t < -1.5) {                                              // a thumb-pressed terminal: sp is metres on the pad
    float rr = length(sp * vec2(1., 0.78) + vec2(0.35 * sin(sp.y * 0.9), 0.));
    float rd = 0.5 + 0.5 * sin(rr * 6.2831853 / 0.55 + 1.2 * sin(sp.x * 0.7));
    float ra = clamp(0.2 / max(px, 1e-4), 0., 1.);
    pool = clamp(vBand.z * mix(0.55, 0.25 + 0.75 * smoothstep(0.25, 0.75, rd), ra), 0., 1.);
  }
  col = mix(col, mix(col, uHoney, mix(1., 0.4, slip)), pool);
  #ifdef MOCHA_FLOOR
  {
    vec3 slipC = mix(uBlue, uBlue * 0.9, 0.8 * mochaSheenT(vW * vec3(1., 0., 1.) + vec3(0., 40., 0.), 0.7));
    col = mix(col, mix(slipC, col, 0.5 * pool), inF);
    col = mix(col, uBlue * 0.6, edgeF);
    // marbled slip: warm honey in three flat tones, each inside a drawn line, with pools of the first slip left in it
    vec2 mq = vW.xz * 0.0085 + vec2(0.011, -0.004) * uTime; mq += 1.5 * vec2(vn2(mq * 0.9 + 4.), vn2(mq * 0.9 + 17.) + 0.02 * uTime);      // still wet: it creeps
    float mN = vn2(mq * 1.7 + 2.), eM = max(fwidth(mN), 1e-4);
    vec3 warm = min(uHoney * vec3(1.07, 0.95, 0.8), vec3(1.));
    vec3 marb = mix(warm, mix(uHoney, uCream, 0.6), smoothstep(0.64 - eM, 0.64 + eM, mN));
    marb = mix(marb, mix(warm, uChoc, 0.32), 1. - smoothstep(0.36 - eM, 0.36 + eM, mN));
    marb = mix(marb, slipC, 1. - smoothstep(0.2 - eM, 0.2 + eM, mN));
    float lnM = (1. - smoothstep(eM, 2.2 * eM, min(min(abs(mN - 0.64), abs(mN - 0.36)), abs(mN - 0.2)))) * clamp(0.004 / eM, 0., 1.);
    marb = mix(marb, uChoc, 0.4 * lnM);
    col = mix(col, marb, hF);
    col = mix(col, mix(uChoc, uHoney, 0.3), edgeH);
  }
  #endif

  // ---- (polish 1) two honey turning lines on the cream shoulder, as on the sky: a shoulder reads as ware against the cream sky
  #ifdef MOCHA_FLOOR
  if (band >= 4. && t < 5.) {
    float lwS = max(mpt * 0.0045, 1.1 * px), d1S = abs(m - mpt * 0.075), d2S = abs(m - mpt * 0.2);
    float lnS = 1. - smoothstep(lwS, lwS + px, min(d1S, d2S));
    col = mix(col, uHoney, 0.55 * lnS * clamp(mpt * 0.02 / px, 0., 1.));
  }
  #else
  // ---- (polish 6) THE SHOULDER FRIEZE: the ware's other marks, slip-trailed on the cream above the belly band of every pot, in
  // the potter's order: a rust-orange line between two dark pinstripes, a row of CAT'S EYES (three slips dropped one in another),
  // an EARTHWORM cable of three slips laid side by side. Flat slip inside drawn edges; no pot shows a bare cream shoulder.
  if (band >= 4. && t < 5.) {
    float D = min(mpt, 0.3 * R + 20.), y = m / D, ay = max(px / D, 1e-4), sdP = floor(vBand.w * 512. + 0.5);
    float kd = clamp(0.03 / ay - 0.3, 0., 1.);
    float inB = smoothstep(0.06 - ay, 0.06 + ay, y) * (1. - smoothstep(0.15 - ay, 0.15 + ay, y));
    float lwB = max(0.007, 1.1 * ay);
    float lnB = 1. - smoothstep(lwB, lwB + ay, min(abs(y - 0.06), abs(y - 0.15)));
    vec3 dc = mix(col, uOrange, inB);
    dc = mix(dc, uDark, lnB);
    // cat's eyes: whole turns only (no seam)
    float nE = max(floor(6.2831853 * R / (0.46 * D)), 5.);
    float ce = ang * nE / 6.2831853, ci = floor(ce), hs = h11(ci * 1.3 + sdP * 0.7), sA = hs * 6.2831853;
    vec2 q = vec2((fract(ce) - 0.5) * 6.2831853 * R / (nE * D) * 0.8, y - 0.36 - 0.02 * (hs - 0.5)) / 0.125;
    float ax = max(max(fwidth(ce) * 6.2831853 * R / (nE * D) * 0.8, ay) / 0.125, 1e-4);
    float th = atan(q.y, q.x + 1e-5), r0 = length(q) / (0.9 + 0.1 * cos(th * 3. + sA));
    vec2 c1 = 0.16 * vec2(cos(sA + 0.2 * sin(uTime * 0.4 + sA)), sin(sA)), c2 = c1 + 0.12 * vec2(cos(sA * 3.3), sin(sA * 3.3));
    float r1 = length(q - c1) / 0.56, r2 = length(q - c2) / 0.24;
    vec3 eo = mix(uOrange, uBlue, step(0.5, fract(ci * 0.5 + 0.25)));
    vec3 ec = mix(uCream, eo, smoothstep(1. - ax, 1. + ax, r1));
    ec = mix(uDark, ec, smoothstep(1. - 2. * ax, 1. + 2. * ax, r2));
    float lwE = max(0.09, 1.3 * ax);
    ec = mix(ec, uDark, smoothstep(1. - lwE - ax, 1. - lwE + ax, r0));
    dc = mix(dc, ec, 1. - smoothstep(1. - ax, 1. + ax, r0));
    // the earthworm cable
    float nW = max(floor(6.2831853 * R / (0.7 * D)), 3.);
    float v = (y - 0.63 - 0.035 * sin(ang * nW)) / 0.042, av = max(ay / 0.042, 1e-4);
    float w3 = v + 0.3 * sin(ang * nW * 0.5 + 1.);
    vec3 wc = mix(uOrange, uCream, smoothstep(-0.3 - av, -0.3 + av, w3));
    wc = mix(wc, uDark, smoothstep(0.3 - av, 0.3 + av, w3));
    float lwW = max(0.14, 1.3 * av);
    wc = mix(wc, uDark, smoothstep(1. - lwW - av, 1. - lwW + av, abs(v)));
    dc = mix(dc, wc, 1. - smoothstep(1. - av, 1. + av, abs(v)));
    // and under the lip, where there is room for them: a blue line and a rust one
    float yl = (mpt - m) / D, room = step(1.5 * D, mpt);
    float l1 = smoothstep(0.1 - ay, 0.1 + ay, yl) * (1. - smoothstep(0.16 - ay, 0.16 + ay, yl));
    float l2 = smoothstep(0.2 - ay, 0.2 + ay, yl) * (1. - smoothstep(0.225 - ay, 0.225 + ay, yl));
    dc = mix(dc, uBlue, l1 * room); dc = mix(dc, uOrange, l2 * room);
    col = mix(col, dc, kd);
  }
  #endif
  // ---- turning ridges: irregular, 2 to 5 m apart, under 5 percent
  col *= 1. + 0.04 * (vn1(hgt * 0.31 + vBand.w * 57.) - 0.5) * (1. - smoothstep(150., 600., dist));

  // ---- crazing: a honey hairline net at two scales, filtered, gone with distance
  // fine net: cells of half a metre, a hairline a pixel and a half wide within 20 m, gone by 60 m (and before its cells get small enough to shimmer)
  float k1 = (1. - smoothstep(22., 60., dist)), k2 = (1. - smoothstep(250., 900., dist));
  float e1 = crazeNet(sp / 0.55), e2 = crazeNet(sp / 5.5 + 7.3);
  float w1 = px / 0.55, w2 = px / 5.5;
  float h1 = max(0.016, 0.75 * w1);
  float l1 = (1. - smoothstep(h1, h1 + 1.5 * w1, e1)) * k1 * (1. - smoothstep(0.065, 0.125, w1));   // gone before a cell is under 8 px: never a fine mesh
  float l2 = (1. - smoothstep(0.006, 0.008 + 1.5 * w2, e2)) * k2 * clamp(0.008 / max(w2, 1e-4), 0., 1.);
  float craze = clamp(l1 * mix(0.24, 0.62, step(0., t)) + l2 * 0.34 * step(0., t), 0., 1.);
  col = mix(col, mix(uHoney * 0.92, mix(col * 0.74, uHoney, 0.22), slip), craze);

  // ---- pinholes and iron specks, only near
  vec2 cq = sp / 0.9, ci2 = floor(cq);
  float hsp = h21(ci2 + 3.1);
  vec2 cp = 0.2 + 0.6 * h22(ci2) - fract(cq);
  float speck = step(0.88, hsp) * (1. - smoothstep(0., 1.1 * px / 0.9, length(cp) - 0.034 * (1.1 + 4. * (hsp - 0.88))));
  // iron specks (dark) and a few pinholes (the bare body showing through)
  col = mix(col, mix(mix(uInk, uRust, 0.2), mix(uCream, uHoney, 0.3), step(0.975, hsp)), speck * (1. - smoothstep(20., 60., dist)) * 0.9 * clamp(0.07 / px - 0.5, 0., 1.));

  gl_FragColor = vec4(mochaFinish(col, uCream, V, N, vW, wet, dist), 1.);
}`,Ft=`
uniform float uTime, uResY, uRegrow; uniform vec4 uGrow;   // w: 1 = hero (x: growth in birth units, z: wetness), 0 = run on the clock per tree
attribute vec4 aRib; attribute vec3 aLat; attribute vec3 aGrow; attribute float aLag;   // aLag: laps after the tree's root at which the slip front reaches this vertex
varying vec4 vRib; varying vec4 vAux; varying vec3 vMore; varying vec3 vW; varying vec3 vN;
void main(){
  float ph = fract(uTime / 24. + aGrow.y);
  float dl = floor(aGrow.y + 1e-4) * 0.01;             // clock trees: laps by which this tree's drop comes late (whole part of aGrow.y)
  // each vertex has its own clock: since = laps since the wet edge reached it in the tree's present life. Before that
  // (since < 0) it still shows the old, full-grown tree, so a tree is wiped where the edge is and regrows behind it.
  float lph = ph - aLag, since = lph + 0.08 + dl, wetT = fract(since);
  float old = (uGrow.w > 0.5) ? 0. : step(since, 0.03);
  float g = (uGrow.w > 0.5) ? uGrow.x : mix(ph * 24. * aGrow.z, 1e4, old);
  float wet = (uGrow.w > 0.5) ? uGrow.z : (1. - smoothstep(0.02, 0.5, wetT)) * step(0.035, wetT);
  float drown = (uGrow.w > 0.5) ? 0. : smoothstep(0.935 - dl, 0.95 - dl, lph);
  if (uGrow.w > 1.5) {
    drown = smoothstep(0., 22., uGrow.y - aGrow.y);
    // (polish 2) the forest comes back: a wave goes out along the band from the great tree (uRegrow, metres) and every drowned
    // tree it has passed grows again from its root (aGrow.z = the root's metres along the band; 0 = this one stays drowned)
    float rg = uRegrow - abs(aGrow.z);
    if (rg > 0. && abs(aGrow.z) > 0.5) { drown = 0.; g = rg * 1.1; }
  }
  if (uGrow.w < 0.5) drown = max(drown, uGrow.y);                      // clock trees: uGrow.y fades the whole mesh into the slip   // mode 2, old trees on the hero band: aGrow.y = metres along the band, uGrow.y = where the slip front is
  vec4 w = modelMatrix * vec4(position, 1.);
  float dist = length(w.xyz - cameraPosition);
  float mpp = dist * 2. / (max(projectionMatrix[1][1], 0.01) * max(uResY, 1.));
  float gF = min(g, aRib.w);
  float dm = (gF - aRib.x) * aGrow.x;                 // metres behind the growing front
  // the stain soaks in: a thin running tip that swells to its full width a little way behind the front
  // a thick limb is drawn as a line: it runs thin (under a third of its soaked width) and swells a long way behind the front
  float thick = smoothstep(0.5, 3., aRib.y), tipK = mix(0.55, 0.3, thick);
  float hT = aRib.y * tipK, rT = min(hT * mix(1.7, 1.5, thick), hT + 1.2) + 0.12 * (1. - thick);      // the tip, and its bead: a round drop about 1.5 tips wide
  float hw = aRib.y * (tipK + (1. - tipK) * smoothstep(0., max(aRib.y * mix(11., 16., thick), 0.5), dm - rT));
  float hwE = max(hw, 0.75 * mpp), cov = min(1., hw / hwE);
  float halo = max(hw * 1.9 + 0.12, hwE + mpp);
  float rE = max(rT, 1.1 * mpp);
  float W = halo;
  if (dm > -5. && dm < 2. * rE + 5.) W = max(W, rE * 1.15);
  if (dm < -8.) W = 0.;
  vec3 lat = mat3(modelMatrix) * aLat;
  vRib = vec4(aRib.x, hwE, aRib.z * W, gF);
  vAux = vec4(halo, cov, rE, wet);
  vMore = vec3(aGrow.x, drown, min(1., (rT * rT) / max(rE * rE, 1e-8)));
  if (aRib.y < 0.) {
    // a blot: the drop flattened where it landed, a round pool under the trunk's foot (two points 1.4 radii either side of it;
    // aRib.x = -1 / +1 says which, -aRib.y is the radius). It spreads in under half a second from the moment the tree is born.
    float Rb = -aRib.y, kB = clamp(g / max(0.45 * aGrow.z, 1e-4), 0., 1.), on = step(1e-4, kB);
    float Re = max(Rb * kB * (2. - kB), 1.1 * mpp);
    W = 1.4 * Rb * on;
    vRib = vec4(0., 0., aRib.z * W, Re + aRib.x * 1.4 * Rb);
    vAux = vec4(-1., 0., Re, wet);
    vMore = vec3(1., drown, on * min(1., (Rb * Rb) / max(Re * Re, 1e-8)));
  }
  w.xyz += lat * (aRib.z * W);
  vW = w.xyz; vN = mat3(modelMatrix) * normal;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,St=`
${Ve}
${Ge}
uniform vec3 uCream, uBlue, uInk, uRust; uniform float uInkPale, uFree;
varying vec4 vRib; varying vec4 vAux; varying vec3 vMore; varying vec3 vW; varying vec3 vN;
void main(){
  float s = abs(vRib.z), a = max(fwidth(vRib.z), 1e-4);
  float dm = (vRib.w - vRib.x) * vMore.x;
  float wet = vAux.w * mochaSheen(vW), rE = vAux.z;
  float vis = smoothstep(-a, a, dm - rE);                  // the line ends inside its bead, so the tip is a whole round drop
  float core = (1. - smoothstep(vRib.y - 0.6 * a, vRib.y + 0.6 * a, s)) * vAux.y * vis;
  float blot = step(vAux.x, -0.5);                         // 1 on a blot's quad (see the vertex shader)
  float hl = 1. - smoothstep(vRib.y, max(vAux.x, vRib.y + a), s);
  hl = hl * sqrt(max(hl, 0.)) * 0.85 * vAux.y * vis;
  vec2 bq = vec2(dm - rE, vRib.z) / max(rE, 1e-3);
  float bl = length(bq), ab = a / max(rE, 1e-3);
  float bead = (1. - smoothstep(1. - ab, 1. + ab, bl)) * vMore.z;
  hl = max(hl, blot * 0.8 * (1. - smoothstep(1., 1.34, bl)) * vMore.z);   // the blot's rust edge
  vec2 wq = abs(bq - vec2(-0.3, 0.32)) - vec2(0.2, 0.27);
  float bwin = (1. - smoothstep(-ab, ab, max(wq.x, wq.y))) * smoothstep(0.03, 0.03 + ab, min(abs(bq.x + 0.3), abs(bq.y - 0.32)));
  bwin *= bead * clamp(0.25 / max(ab, 1e-3), 0., 1.) * (1. - blot);
  vec3 Vd = vW - cameraPosition; float dist = length(Vd);
  float P = uPale * (1. - exp(-dist / 900.));              // distance pales the slip and the halo fully, the ink by uInkPale of that
  vec3 base = mix(mix(uBlue, uBlue * 0.9, wet * 0.8), uCream, P);        // the same wet blue the glaze lays underneath
  base = mix(base, vec3(1.), uFree);                         // (polish 3) a stain that has stood up out of the slip has no ground under it: MIN leaves what is behind it as it is
  vec3 col = mix(base, mix(uRust, uCream, P), hl);
  col = mix(col, mix(uInk, uCream, P * uInkPale), max(core, bead));
  col = mix(col, uWinCol, bwin * 0.9);
  col = mix(col, base, vMore.y);                           // drowned under the next slip front
  vec3 N = vN / max(length(vN), 1e-5);
  gl_FragColor = vec4(mix(mochaWin(col, Vd / max(dist, 1e-3), N, vW), col, uFree), 1.);
}`,kt=`
uniform vec4 uDrop;   // x: squash 0 = sphere ... 1 = a flat blot lying on the wall (local +Z is the wall normal); y: blot spread
varying vec3 vW; varying vec3 vN; varying float vFlat;
void main(){
  #ifdef USE_INSTANCING
    mat4 im = instanceMatrix;
  #else
    mat4 im = mat4(1.);
  #endif
  vec3 p = position, n = normal;
  float sq = uDrop.x, a = atan(p.y, p.x + 1e-5);
  float lobes = 1. + 0.1 * sin(a * 3. + 1.3) + 0.07 * sin(a * 5. + 4.) + 0.04 * sin(a * 8.);
  // (polish 3) uDrop.w: falling, the great drop is a drop: round below, drawn out to a point above
  float tl = max(p.y, 0.) * uDrop.w * (1. - sq);
  p.xz *= sqrt(max(1. - 0.96 * tl, 0.)); p.y += 2.1 * tl * tl + 0.5 * tl;
  p.xy *= mix(1., uDrop.y * lobes, sq);
  p.z *= mix(1., 0.03, sq);
  n = mix(n, vec3(0., 0., 1.), sq * 0.97);
  vec4 w = modelMatrix * im * vec4(p, 1.);
  vW = w.xyz; vN = mat3(modelMatrix) * mat3(im) * n; vFlat = sq;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,At=`
${Ve}
${Ge}
uniform vec3 uCream, uInk, uRust; uniform vec4 uDrop;
varying vec3 vW; varying vec3 vN; varying float vFlat;
void main(){
  vec3 Vd = vW - cameraPosition; float dist = length(Vd); vec3 V = Vd / max(dist, 1e-3);
  vec3 N = vN / max(length(vN), 1e-5);
  vec3 r = reflect(V, N);
  // a bead bends the room into itself: pull the reflection half way to the window so its image is larger
  vec3 rb = mix(r, uWinDir, 0.5 * (1. - vFlat)); rb = rb / max(length(rb), 1e-4);
  float win = mochaWindow(rb, 0.012, mochaWob(vW) * vFlat);
  vec3 col = mix(uInk, uCream, uPale * (1. - exp(-dist / 900.)) * (1. - uDrop.z * (1. - 0.2 * vFlat)));      // uDrop.z = 1: the great drop, full ink at any distance; flattened to a blot it is stain, and pales as the stain does
  gl_FragColor = vec4(clamp(mix(col, uWinCol, 0.9 * win), 0., 1.), 1.);
}`,zt=`
varying vec3 vC; varying vec3 vQ; varying vec2 vUp;
void main(){
  #ifdef USE_INSTANCING
    mat4 im = instanceMatrix;
  #else
    mat4 im = mat4(1.);
  #endif
  vec4 c = modelMatrix * im * vec4(0., 0., 0., 1.);
  float sx = length(im[0].xyz), sy = length(im[1].xyz);
  vec4 cv = viewMatrix * c;
  vec2 up = (viewMatrix * vec4(0., 1., 0., 0.)).xy; float ul = length(up);
  up = ul > 1e-3 ? up / ul : vec2(0., 1.);
  // (polish 2) a falling drop is a drop: round below, drawn out to a point above (sy over sx says how much: a bead at rest is round)
  float tl = max(position.y, 0.), tk = clamp((sy / max(sx, 1e-4) - 0.9) / 0.22, 0., 1.);
  vec2 q = vec2(position.x * mix(1., sqrt(max(1. - tl, 0.)), tk), position.y + tl * 1.25 * tk);
  cv.xy += vec2(up.y, -up.x) * (q.x * sx) + up * (q.y * sy);
  vC = c.xyz; vQ = vec3(position.xy, sx); vUp = up;
  gl_Position = projectionMatrix * cv;
}`,Wt=`
${Ve}
${Ge}
uniform vec3 uCream, uInk;
varying vec3 vC; varying vec3 vQ; varying vec2 vUp;
void main(){
  float z = sqrt(max(1. - dot(vQ.xy, vQ.xy), 0.));
  // (the normal leans out faster than a true sphere's, so the window's image sits nearer the middle of the bead, whole and readable)
  vec3 nv = vec3((vUp.y * vQ.x + vUp.x * vQ.y) * 1.6, (vUp.y * vQ.y - vUp.x * vQ.x) * 1.6, z);
  vec3 N = nv * mat3(viewMatrix);                          // view space back to world
  N = N / max(length(N), 1e-5);
  vec3 Vd = vC + N * vQ.z - cameraPosition; float dist = length(Vd); vec3 V = Vd / max(dist, 1e-3);
  vec3 rb = mix(reflect(V, N), uWinDir, 0.5); rb = rb / max(length(rb), 1e-4);   // a bead bends the room into itself (as the great drop does)
  float win = mochaWindow(rb, 0.012, vec2(0.)) * smoothstep(0.25, 0.45, dot(rb, uWinDir));   // one window, no ghost of it at the far rim
  vec3 col = mix(uInk, uCream, uPale * (1. - exp(-dist / 900.)));
  gl_FragColor = vec4(clamp(mix(col, uWinCol, 0.9 * win), 0., 1.), 1.);
}`,Bt=`
varying vec3 vD;
void main(){ vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,Rt=`
${Ve}
uniform vec3 uCream, uHoney, uBlue, uOrange; uniform float uSkyWarm;
varying vec3 vD;
float skyNet(vec2 p){
  vec2 ip = floor(p), fp = fract(p); float d1 = 9., d2 = 9.;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j)); vec2 o = g + 0.15 + 0.7 * h22(ip + g) - fp; float d = dot(o, o);
    if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; }
  }
  return sqrt(d2) - sqrt(d1);
}
void main(){
  vec3 d = vD / max(length(vD), 1e-4);
  float el = degrees(asin(clamp(d.y, -1., 1.)));
  float az = atan(d.x, abs(d.z) < 1e-5 ? 1e-5 : d.z);
  float aw = max(fwidth(el), 1e-3);
  // (polish 3) honey pools toward the horizon in two flat steps inside drawn, wandering edges, as it lies on the tray: the sky has
  // three calm tones, and a cream shoulder stands light against it (only whole turns of az: no seam)
  float e1 = 8.5 + 1.6 * sin(az * 3. + 1.) + 0.9 * sin(az * 7. + 4.) + 0.5 * sin(az * 13.);
  float e2 = 22. + 2.2 * sin(az * 2. + 2.) + 1.2 * sin(az * 5. + 1.) + 0.6 * sin(az * 11. + 3.);
  float s1 = 1. - smoothstep(-aw, aw, el - e1), s2 = 1. - smoothstep(-aw, aw, el - e2);
  vec3 col = mix(uCream, uHoney, 0.08 + 0.3 * s2 + 0.36 * s1);
  float eln = max(1. - smoothstep(0.16, 0.16 + aw, abs(el - e1)), 1. - smoothstep(0.16, 0.16 + aw, abs(el - e2)));
  col = mix(col, uHoney * 0.84, 0.55 * eln);
  float t1 = 1. - smoothstep(0.2, 0.2 + aw, abs(el - 12. - 0.25 * sin(az * 2. + 1.)));
  float t2 = 1. - smoothstep(0.2, 0.2 + aw, abs(el - 30. - 0.3 * sin(az * 3. + 4.)));
  col = mix(col, uHoney, 0.6 * max(t1, t2));                                                      // two turning lines
  float bl = 1. - smoothstep(0.2, 0.2 + aw, abs(el - 48. - sin(az * 3. + 2.) - 0.4 * sin(az * 7.)));
  col = mix(col, uBlue, 0.8 * bl);                                                                 // one thin slate-blue line
  // (polish 6) FEATHERED SLIP: over our heads the potter trailed lines of blue and honey slip across the wet cream and drew a
  // feather through them, as on a combed dish: flat chevroned bands inside drawn edges that lie like a mackerel sky, in
  // perspective toward the horizon, and creep (the slip is still wet). They pale into the honey of the horizon.
  {
    vec2 cq = d.xz / max(d.y + 0.16, 0.1);
    float kc = smoothstep(4., 13., el) * (1. - smoothstep(72., 86., el));
    vec2 cw = cq * 1.1 + vec2(0.008, 0.005) * uTime;
    float comb = abs(fract(cw.x * 1.5 + 0.15 * vn1(cw.y * 0.7)) - 0.5) * 2.;                        // the feather's strokes
    float bf = cw.y * 2.5 + 0.5 * comb * comb + 0.3 * vn2(cw * 0.6 + 2.);
    float st = fract(bf), eb = max(fwidth(bf), 1e-4), ib = floor(bf);
    float hb = h11(ib * 1.7 + 3.);
    float wB = 0.2 + 0.16 * hb, wH = wB + 0.1 + 0.1 * h11(ib + 9.);
    float mk = vn2(cq * 0.85 + vec2(0.006, 0.) * uTime + 5.) + 0.35 * vn2(cq * 2.3 + 11.), em = max(fwidth(mk), 1e-4);
    float inC = smoothstep(0.52 - em, 0.52 + em, mk) * kc * clamp(0.05 / eb, 0., 1.);
    float sB = smoothstep(0.03 - eb, 0.03 + eb, st) * (1. - smoothstep(wB - eb, wB + eb, st));
    float sH = smoothstep(wB - eb, wB + eb, st) * (1. - smoothstep(wH - eb, wH + eb, st));
    vec3 warmS = mix(uHoney, uOrange, 0.55 * uSkyWarm);
    vec3 cc = mix(col, mix(col, uBlue, mix(0.62, 0.3, uSkyWarm)), sB);
    cc = mix(cc, mix(col, warmS, 0.6), sH);
    float lnC = max(1. - smoothstep(eb, 2.2 * eb, min(min(abs(st - 0.03), abs(st - wB)), abs(st - wH))), 1. - smoothstep(em, 2.2 * em, abs(mk - 0.52)));
    cc = mix(cc, uHoney * 0.8, 0.5 * lnC * clamp(0.02 / eb, 0., 1.));
    col = mix(col, cc, inC);
  }
  vec2 sp = d.xz / max(1. + d.y, 0.3) * 7.5;                                                       // crazing, cells some 8 degrees across
  float pw = max(fwidth(sp.x), fwidth(sp.y));
  float net = 1. - smoothstep(0.004, 0.006 + 1.5 * pw, skyNet(sp));
  col = mix(col, uHoney, 0.15 * net * clamp(0.02 / max(pw, 1e-4), 0., 1.));      // (polish 6) barely there: strangers read the net as a cracked ceiling
  gl_FragColor = vec4(clamp(col, 0., 1.), 1.);
}`;function Vt(n,t={}){const p=t.palette||be,f=(o,h)=>new a.Color(p[o]||h),W={cream:f(0,be[0]),honey:f(1,be[1]),blue:f(2,be[2]),tan:f(3,be[3]),olive:f(4,be[4]),chocolate:f(5,be[5]),ink:f(6,be[6]),rust:new a.Color(t.rust||"#8A4A2A"),window:new a.Color(t.window||"#FFF8E6")},w={uTime:{value:0},uResY:{value:720},uPale:{value:t.pale??.55},uWinDir:{value:new a.Vector3(0,.6428,.766)},uWinU:{value:new a.Vector3(1,0,0)},uWinV:{value:new a.Vector3(0,.766,-.6428)},uWinSize:{value:new a.Vector2(.16,.22)},uWinK:{value:1},uWinCol:{value:W.window},uCream:{value:W.cream},uHoney:{value:W.honey},uBlue:{value:W.blue},uTan:{value:W.tan},uOlive:{value:W.olive},uChoc:{value:W.chocolate},uInk:{value:W.ink},uRust:{value:W.rust},uOrange:{value:new a.Color(t.orange||"#C8622B")},uDark:{value:new a.Color(t.dark||"#43281C")},uSkyWarm:{value:0}},l={value:1},R={uWinDir:{value:new a.Vector3(0,.6428,.766)},uWinU:{value:new a.Vector3(1,0,0)},uWinV:{value:new a.Vector3(0,.766,-.6428)}},b=new a.Vector3,v=new a.Vector2;function T(o,h){const B=o.uWinDir.value.copy(h).normalize(),i=o.uWinU.value.set(B.z,0,-B.x);i.lengthSq()<1e-6&&i.set(1,0,0),i.normalize(),o.uWinV.value.crossVectors(i,B).normalize(),o.uWinV.value.y<0&&o.uWinV.value.negate()}function V(o,h=!0){T(w,o),h&&T(R,o)}function j(o){T(R,o)}function L(o={}){const h=o.floor?{uFlood:{value:new a.Vector4(0,700,0,0)},uShade:{value:new a.Vector2(.8,.6)},uPots:{value:Array.from({length:32},(B,i)=>o.floor[i]?new a.Vector3(o.floor[i].x,o.floor[i].z,o.floor[i].foot):new a.Vector3(1e6,1e6,0))}}:null;return new a.ShaderMaterial({defines:h?{MOCHA_FLOOR:1}:{},uniforms:{...w,...o.hero?{uWinK:l,...R}:{},...h||{},...o.uniforms||{},uLead:{value:o.lead??1},uFringe:{value:o.fringe??1},uWet:{value:new a.Vector4(o.hero?1:0,0,0,.5)},uLap:{value:new a.Vector3(o.lap?.[0]??0,o.lap?.[1]??.5,o.lap?.[2]??.5)}},vertexShader:bt,fragmentShader:gt+Mt,side:o.side??a.FrontSide})}function M(o={}){return new a.ShaderMaterial({uniforms:{...w,...o.hero?{uWinK:l,...R}:{},...o.uniforms||{},uFree:{value:o.free?1:0},uGrow:{value:new a.Vector4(-1,0,0,o.hero?1:0)},uRegrow:{value:-1},uInkPale:{value:o.inkPale??(o.hero?.2:.35)}},vertexShader:Ft,fragmentShader:St,side:a.DoubleSide,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-6,blending:a.CustomBlending,blendEquation:a.MinEquation,blendSrc:a.OneFactor,blendDst:a.OneFactor})}function N(o={}){return new a.ShaderMaterial({uniforms:{...w,uDrop:{value:new a.Vector4(0,1.7,o.hero?1:0,0)}},vertexShader:kt,fragmentShader:At,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-10})}function ae(){return new a.ShaderMaterial({uniforms:{...w},vertexShader:zt,fragmentShader:Wt,side:a.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-10})}const G=()=>new a.CircleGeometry(1,32);function F(o=3500){const h=new a.Mesh(new a.SphereGeometry(o,48,24),new a.ShaderMaterial({uniforms:w,vertexShader:Bt,fragmentShader:Rt,side:a.BackSide,depthWrite:!1,depthTest:!1}));return h.renderOrder=-1,h.frustumCulled=!1,h}function r(o,h,B){w.uTime.value=h,n.renderer&&(w.uResY.value=Math.max(64,n.renderer.getDrawingBufferSize(v).y))}return{palette:W,uniforms:w,heroWindow:l,setWindow:V,setHeroWindow:j,glaze:L,stain:M,drop:N,bead:ae,beadGeometry:G,makeSky:F,update:r,post:{flat:1,bloom:{strength:0},grade:{saturation:1,contrast:1,vignette:0,grain:0}},lathe:st,strap:lt,thumbPad:je,growDendrite:_e,ribbons:ht,treeStart:(o,h)=>((o-h/He+.92)%1+1)%1}}async function st(n){const t=n.profile,p=t[t.length-1][0],f=768,W=new Float32Array(f+1);for(let s=0,u=0;s<=f;s++){const k=s/f*p;for(;u<t.length-2&&k>t[u+1][0];)u++;const g=t[Math.max(u-1,0)],P=t[u],C=t[u+1],q=t[Math.min(u+2,t.length-1)],O=de((k-P[0])/Math.max(C[0]-P[0],1e-6),0,1),oe=C[0]-P[0],me=(C[1]-g[1])/Math.max(C[0]-g[0],1e-6)*oe,fe=(q[1]-P[1])/Math.max(q[0]-P[0],1e-6)*oe,Y=O*O,ee=Y*O;W[s]=(2*ee-3*Y+1)*P[1]+(ee-2*Y+O)*me+(-2*ee+3*Y)*C[1]+(ee-Y)*fe}const w=s=>{const u=de(s/p,0,1)*f,k=Math.min(Math.floor(u),f-1);return W[k]+(W[k+1]-W[k])*(u-k)};let l=0;for(let s=0;s<=f;s++)l=Math.max(l,W[s]);l=n.refR||l;const R=n.edges,b=n.phase??0,v=n.step??.4,T=n.wobble??l*.004,V=n.lean||[0,0],j=n.oval??0,L=n.slump||{amp:0,dir:0},M=[v,v*2,v,v*2,0],N=Math.round(l/38)+3,ae=Math.round(l/14)+5,G=Math.round(l/5.5)+9,F=(s,u)=>{if(s<=0||s>4)return s<=0?R[0]:p;const k=.3*Math.min(R[s]-R[s-1],(s<4?R[s+1]:p)-R[s]),g=Math.sin(u*N+b*40+s*2.1)+.6*Math.sin(u*ae+b*71+s*4.7)+.3*Math.sin(u*G+s*1.3+b*13);return R[s]+Math.min(T,k)*g*.6},r=(s,u,k,g)=>{let P=w(u)+k;P*=1+j*Math.cos(2*s+b*9)*Math.sin(Math.PI*de(u/p,0,1)*.9+.2);const C=u-L.amp*Re(.72*p,p,u)*(.5+.5*Math.cos(s-L.dir));return g[0]=Math.sin(s)*P+V[0]*u,g[1]=C,g[2]=Math.cos(s)*P+V[1]*u,g},d=[0,0,0],o=[0,0,0],h=[0,0,0],B=(s,u,k,g)=>{r(s,u,k,d),r(s+.5/l,u,k,o),r(s,u+.5,k,h);const P=o[0]-d[0],C=o[1]-d[1],q=o[2]-d[2],O=h[0]-d[0],oe=h[1]-d[1],me=h[2]-d[2];let fe=C*me-q*oe,Y=q*O-P*me,ee=P*oe-C*O;const pe=Math.hypot(fe,Y,ee)||1;return g[0]=d[0],g[1]=d[1],g[2]=d[2],g[3]=fe/pe,g[4]=Y/pe,g[5]=ee/pe,g},i=n.rows||[2,2,2,8,20],x=n.cols||48,_=[];for(let s=0;s<5;s++)for(let u=0;u<=i[s];u++)_.push([s,u/i[s]]);const Q=_.length,y=x+1,S=Q*y,E=new Float32Array(S*3),H=new Float32Array(S*3),U=new Float32Array(S*4),J=new Float32Array(S*3),z=[0,0,0,0,0,0],ne=n.a0??0,K=n.a1??He,$=n.colAt||(s=>s);for(let s=0;s<y;s++){const u=ne+(K-ne)*$(s/x);for(let k=0;k<Q;k++){const g=_[k][0],P=_[k][1],C=F(g,u),q=g<4?F(g+1,u):p,O=C+(q-C)*(g===4?P*(2-P)*.35+P*.65:P);B(u,O,M[g],z);const oe=k*y+s;E.set([z[0],z[1],z[2]],oe*3),H.set([z[3],z[4],z[5]],oe*3);const me=(w(O+6)+w(O-6)-2*w(O))/36*l*.6,fe=g===4?de(me,0,.8)+(n.pool?n.pool(u,O):0):0;U.set([g+(O-C)/Math.max(q-C,.001)*.9999,(g<4?R[g+1]:p)-R[g],fe,b],oe*4),J.set([u,l,O],oe*3)}n.yield&&s%2===1&&await n.yield()}n.yield&&await n.yield();const Z=new(S>65535?Uint32Array:Uint16Array)((Q-1)*x*6);let D=0;for(let s=0;s<Q-1;s++){for(let u=0;u<x;u++){const k=s*y+u,g=k+1,P=k+y,C=P+1;Z[D++]=k,Z[D++]=g,Z[D++]=C,Z[D++]=k,Z[D++]=C,Z[D++]=P}n.yield&&s%12===11&&await n.yield()}n.yield&&await n.yield();const m=new a.BufferGeometry;return m.setAttribute("position",new a.BufferAttribute(E,3)),m.setAttribute("normal",new a.BufferAttribute(H,3)),m.setAttribute("aBand",new a.BufferAttribute(U,4)),m.setAttribute("aSurf",new a.BufferAttribute(J,3)),m.setIndex(new a.BufferAttribute(Z,1)),n.yield&&await n.yield(),m.computeBoundingSphere(),n.yield&&await n.yield(),{geometry:m,surf:(s,u,k,g=0)=>(B(s,u,M[3]+g,k),k),H:p,R:l,edgeAt:F,rAt:w,phase:b}}function lt(n){const t=n.points,p=t.length,f=n.cross||14,W=n.width||9,w=n.thick||2.6,l=p*(f+1),R=new Float32Array(l*3),b=new Float32Array(l*3),v=new Float32Array(l*4),T=new Float32Array(l*3),V=new a.Vector3,j=new a.Vector3,L=new a.Vector3,M=new a.Vector3,N=new a.Vector3;let ae=0;for(let r=0;r<p;r++){V.subVectors(t[Math.min(r+1,p-1)],t[Math.max(r-1,0)]).normalize(),j.copy(n.side).addScaledVector(V,-n.side.dot(V)).normalize(),L.crossVectors(V,j).normalize(),r>0&&(ae+=t[r].distanceTo(t[r-1]));const d=r/(p-1),o=1+.55*Math.pow(Math.abs(2*d-1),6);for(let h=0;h<=f;h++){const B=h/f*He,i=Math.cos(B),x=Math.sin(B),_=Math.sign(i)*Math.pow(Math.abs(i),.55)*W*.5*o,Q=Math.sign(x)*Math.pow(Math.abs(x),.8)*w*.5,y=x>0?-.22*w*Math.exp(-((_/(.16*W))**2)):0;N.copy(t[r]).addScaledVector(j,_).addScaledVector(L,Q+y),M.set(0,0,0).addScaledVector(j,i*w).addScaledVector(L,x*W).normalize();const S=r*(f+1)+h;R.set([N.x,N.y,N.z],S*3),b.set([M.x,M.y,M.z],S*3);const E=Math.pow(Math.abs(2*d-1),8)*.9,H=x>0?.75*Math.exp(-((_/(.1*W))**2)):0;v.set([-1,1,de(Math.max(E,H)+(n.pool?n.pool(d,_/(W*.5)):0),0,1),n.phase??0],S*4),T.set([_+(x>0?0:40),1,ae],S*3)}}const G=new Uint16Array((p-1)*f*6);let F=0;for(let r=0;r<p-1;r++)for(let d=0;d<f;d++){const o=r*(f+1)+d,h=o+1,B=o+f+1,i=B+1;G[F++]=o,G[F++]=h,G[F++]=i,G[F++]=o,G[F++]=i,G[F++]=B}return ct(R,b,v,T,G)}function ct(n,t,p,f,W){const w=new a.BufferGeometry;return w.setAttribute("position",new a.BufferAttribute(n,3)),w.setAttribute("normal",new a.BufferAttribute(t,3)),w.setAttribute("aBand",new a.BufferAttribute(p,4)),w.setAttribute("aSurf",new a.BufferAttribute(f,3)),w.setIndex(new a.BufferAttribute(W,1)),w.computeBoundingSphere(),w}function je(n,t,p,f=4.5,W=0){const b=new Float32Array(1845),v=new Float32Array(615*3),T=new Float32Array(615*4),V=new Float32Array(615*3),j=t.clone().normalize(),L=p.clone().addScaledVector(j,-p.dot(j)).normalize(),M=new a.Vector3().crossVectors(L,j),N=d=>{const o=d/f;return 1.5*(1-o*o)*(1-o*o)+.55*Math.exp(-(((o-.72)/.2)**2))-1.25*Math.exp(-((o/.5)**2))},ae=new a.Vector3,G=new a.Vector3;for(let d=0;d<=14;d++)for(let o=0;o<=40;o++){const h=o/40*He,B=1+.07*Math.sin(h*3+1)+.05*Math.sin(h*5),i=d/14*f*1.12,x=Math.cos(h)*i*B,_=Math.sin(h)*i*B*1.12,Q=N(Math.min(i,f))-Math.max(0,i-f)*1.4,y=(N(Math.min(i+.1,f))-Q)/.1;ae.copy(n).addScaledVector(M,x).addScaledVector(L,_).addScaledVector(j,Q),G.copy(j).addScaledVector(M,-y*Math.cos(h)).addScaledVector(L,-y*Math.sin(h)).normalize();const S=d*41+o;b.set([ae.x,ae.y,ae.z],S*3),v.set([G.x,G.y,G.z],S*3),T.set([-2,1,de(1.15-i/(f*.8),0,1)+.5*Re(.9,1.1,i/f),W],S*4),V.set([x,1,_],S*3)}const F=new Uint16Array(560*6);let r=0;for(let d=0;d<14;d++)for(let o=0;o<40;o++){const h=d*41+o,B=h+1,i=h+40+1,x=i+1;F[r++]=h,F[r++]=i,F[r++]=x,F[r++]=h,F[r++]=x,F[r++]=B}return ct(b,v,T,V,F)}async function _e(n,t){const p=t.orders??5,f=t.segs||[30,14,9,6,4,3],W=t.kids||[11,8,5,3,2],w=t.fork||[.44,.7],l=t.ratio??.7,R=Array.isArray(l)?l:[l,l,l,l,l,l],b=t.keep,v=t.bounds,T=t.habit||"upright",V=t.speed||(()=>1),j=t.budget??1e9,L=t.minHw??.025,M=T==="fern"?[.01,.02,.03,.05,.06,.06]:[.022,.05,.07,.09,.11,.12],N=[.05,0,0,0,0,0],ae=t.curl||(T==="seaweed"?[0,.05,.035,.012,0,0]:T==="fern"?[0,.012,0,0,0,0]:[0,.03,.02,.008,0,0]),G=[],F=[{x:t.x,y:t.y,h:t.heading??0,len:t.len,hw:t.hw,order:0,birth:t.birth??0,side:0}],r=v?t.cell??0:0,d=r?Math.ceil((v.x1-v.x0)/r)+1:0,o=r?Math.ceil((v.y1-v.y0)/r)+1:0,h=r?new Int32Array(d*o):null,B=(y,S,E,H)=>{const U=Math.max(0,Math.floor((y-E-v.x0)/r)),J=Math.min(d-1,Math.floor((y+E-v.x0)/r)),z=Math.max(0,Math.floor((S-E-v.y0)/r)),ne=Math.min(o-1,Math.floor((S+E-v.y0)/r));for(let K=z;K<=ne;K++)for(let $=U;$<=J;$++)h[K*d+$]===0&&(h[K*d+$]=H)};let i=0,x=0,_=0,Q=0;for(F[0].anc=[];Q<F.length&&i<j;){const y=F[Q++],S=y.order,E=++_,H=Math.max(2,f[S]|0),U=y.len/H,J=V(S),z=new Float32Array((H+1)*4),ne=new Float32Array(H+1);let K=y.x,$=y.y,Z=y.h,D=0;z.set([K,$,y.hw,y.birth],0),ne[0]=Z;for(let m=1;m<=H;m++){Z+=n.gauss()*(y.wg??M[S])-Z*N[S]+y.side*(y.cu??ae[S])+(S===0?.03*Math.sin(m*.37+y.x):0);const X=K+Math.sin(Z)*U,s=$+Math.cos(Z)*U;if(v&&(X<v.x0||X>v.x1||s<v.y0||s>v.y1))break;const u=m/H,k=Math.max(L,y.hw*(1-.82*Math.pow(u,1.15)));if(h){const g=h[Math.floor((s-v.y0)/r)*d+Math.floor((X-v.x0)/r)];if(m>1&&g!==0&&g!==E&&!y.anc.includes(g))break;const P=Math.max(1,Math.ceil(U/r)),C=Math.max(k,r*.6);for(let q=1;q<=P;q++)B(ie(K,X,q/P),ie($,s,q/P),C,E)}K=X,$=s,D=m,z.set([K,$,k,y.birth+m*U/J],m*4),ne[m]=Z}if(!(D<1)){if(D<H)for(let m=1;m<=D;m++)z[m*4+2]=Math.max(L,y.hw*(1-.82*Math.pow(m/D,1.15)));if(G.push({order:S,n:D+1,pts:z.subarray(0,(D+1)*4),speed:J}),i+=D,S<p){const m=W[S];for(let X=0;X<m;X++){const s=S===0?t.clear??.16:.14,u=s+(.97-s)*((X+.25+.5*n())/m),k=(X%2?1:-1)*(n.chance(.12)?-1:1),g=n.range(w[0],w[1]),P=n.range(.8,1.15),C=u*D,q=Math.min(Math.floor(C),D-1),O=C-q,oe=ie(z[q*4],z[q*4+4],O),me=ie(z[q*4+1],z[q*4+5],O),fe=Math.max(L,ie(z[q*4+2],z[q*4+6],O)*.7),Y=ie(z[q*4+3],z[q*4+7],O),ee=y.len*(.35+.65*D/H)*R[S]*(1-.62*u)*P*(T==="seaweed"?1.3:1);if(ee<(t.minLen??.8)||b&&n()>b(S+1))continue;const pe={x:oe,y:me,h:ne[q]+k*g*(T==="seaweed"?1.6:1),len:ee,hw:fe,order:S+1,side:k,anc:h?[...y.anc,E]:null,birth:t.start?t.start(S+1,oe,me,Y):Y};t.limb&&t.limb(pe,u,X),F.push(pe)}}t.yield&&++x%50===0&&await t.yield()}}return G}async function ht(n,t,p={}){let f=0,W=0;for(const d of n)f+=d.n,W+=d.n-1;const w=new Float32Array(f*6),l=new Float32Array(f*6),R=new Float32Array(f*6),b=new Float32Array(f*8),v=new Float32Array(f*6),T=new Float32Array(f*2),V=new(f*2>65535?Uint32Array:Uint16Array)(W*6),j=new Float64Array(6),L=new Float64Array(384);let M=0,N=0,ae=0;const G=p.start??0,F=p.rate??1;for(const d of n){const o=d.n,h=d.pts,B=h[(o-1)*4+3];let i=o<=64?L:new Float64Array(o*6);for(let x=0;x<o;x++)t(h[x*4],h[x*4+1],j),i.set(j,x*6);for(let x=0;x<o;x++){const _=Math.max(x-1,0)*6,Q=Math.min(x+1,o-1)*6,y=x*6,S=p.lag?p.lag(h[x*4]):0,E=i[Q]-i[_],H=i[Q+1]-i[_+1],U=i[Q+2]-i[_+2],J=i[y+3],z=i[y+4],ne=i[y+5];let K=z*U-ne*H,$=ne*E-J*U,Z=J*H-z*E;const D=Math.hypot(K,$,Z)||1;K/=D,$/=D,Z/=D;for(let m=-1;m<=1;m+=2)w[M*3]=i[y],w[M*3+1]=i[y+1],w[M*3+2]=i[y+2],l[M*3]=J,l[M*3+1]=z,l[M*3+2]=ne,R[M*3]=K,R[M*3+1]=$,R[M*3+2]=Z,b[M*4]=h[x*4+3],b[M*4+1]=h[x*4+2],b[M*4+2]=m,b[M*4+3]=B,d.blot&&(b[M*4]=x===0?-1:1,b[M*4+1]=-d.blot),v[M*3]=d.speed,v[M*3+1]=G,v[M*3+2]=F,T[M]=S,M++;if(x>0){const m=M-4;V[N++]=m,V[N++]=m+1,V[N++]=m+3,V[N++]=m,V[N++]=m+3,V[N++]=m+2}}p.yield&&++ae%200===0&&await p.yield()}const r=new a.BufferGeometry;return r.setAttribute("position",new a.BufferAttribute(w,3)),r.setAttribute("normal",new a.BufferAttribute(l,3)),r.setAttribute("aLat",new a.BufferAttribute(R,3)),r.setAttribute("aRib",new a.BufferAttribute(b,4)),r.setAttribute("aGrow",new a.BufferAttribute(v,3)),r.setAttribute("aLag",new a.BufferAttribute(T,1)),r.setIndex(new a.BufferAttribute(V,1)),r}async function Tt(n,t={}){const p=n.rng,f=t.detail??n.quality?.detail??1,W=!t.style,w=t.style||Vt(n,{palette:t.palette}),l={wet:.24,fall:.37,strike:.53,trunk:.59,limbs:.72,end:.985,...t.timing||{}},R=new a.Group,b={phase:p(),lean:[p.range(-.012,.012),p.range(-.006,.006)],oval:p.range(.004,.012),slumpDir:p.range(-.9,.9),slumpAmp:p.range(14,34),belly:p.range(-6,6),neck:p.range(-25,25),lip:p.range(-18,22)},v=p.fork("tree"),T=p.fork("runner");await n.yield();const V=700,j=900,L=40,M=260,N=await st({yield:n.yield,profile:[[0,680],[20,695],[46,700],[150,693+b.belly],[260,672+b.belly],[400,612],[560,500],[700,385+b.neck],[780,340+b.neck],[840,345+b.neck*.7],[880,372+b.lip],[900,392+b.lip]],edges:[0,14,27,L,M],a0:-Math.PI,a1:Math.PI,cols:Math.round(216*(.7+.3*f)),rows:[2,2,3,18,22],colAt:e=>{const c=2*e-1;return .5+.5*(.4*c+.6*c*c*c)},phase:b.phase,refR:V,lean:b.lean,oval:b.oval,slump:{amp:b.slumpAmp,dir:b.slumpDir}}),ae=w.glaze({hero:!0}),G=new a.Mesh(N.geometry,ae);R.add(G),await n.yield();const F=new Float64Array(6),r=(e,c,A=0,I=new a.Vector3)=>(N.surf(e/V,c,F,0),I.set(F[0]+F[3]*A,F[1]+F[4]*A,F[2]+F[5]*A)),d=(e,c,A=new a.Vector3)=>(N.surf(e/V,c,F,0),A.set(F[3],F[4],F[5])),o=(e,c,A)=>N.surf(e/V,c,A,.12),h=t.lugX??190,B=t.lugY??228,i=t.lugScale??1,x=12*i,_=t.lugDir??1,Q=t.lugYaw??0,y=Math.cos(t.lugPitch??.4189)*_,S=Math.sin(t.lugPitch??.4189),E=r(h,B,x),H=d(h,B),U=r(h+y,B+S,x).sub(r(h-y,B-S,x)).normalize();if(Q){const e=new a.Vector3(0,1,0),c=U.clone().applyAxisAngle(e,Q),A=U.clone().applyAxisAngle(e,-Q);U.copy(c.dot(H)<A.dot(H)?c:A)}const J=H.clone().addScaledVector(U,-H.dot(U)).normalize(),z=new a.Vector3().crossVectors(J,U).normalize(),ne=-(x/Math.max(J.dot(H),.3)+1.6*i),K=[[-14.8*i,ne],[-13.8*i,ne*.6],[-11.6*i,ne*.22]],$=K.map(([e,c])=>E.clone().addScaledVector(z,e).addScaledVector(J,c));for(let e=0;e<=10;e++){const c=(-80+e*16)*Math.PI/180;$.push(E.clone().addScaledVector(z,10.6*i*Math.sin(c)).addScaledVector(J,10.6*i*Math.cos(c)))}for(let e=2;e>=0;e--)$.push(E.clone().addScaledVector(z,-K[e][0]).addScaledVector(J,K[e][1]));const Z=new a.CatmullRomCurve3($,!1,"centripetal").getSpacedPoints(56),D=e=>{const c=E.clone().addScaledVector(z,e).addScaledVector(J,ne+1.6*i);return{x:Math.atan2(c.x,c.z)*V,y:c.y}};let m=D(-18*i),X=D(18*i),s=z;if(m.y>X.y){const e=m;m=X,X=e,s=z.clone().negate()}await n.yield();const u=lt({points:Z,side:U,width:8*Math.pow(i,.8),thick:3.4*Math.pow(i,.8),phase:b.phase});await n.yield();const k=[je(r(m.x,m.y,.15+.5*(i-1)),d(m.x,m.y),s,4.6*i,b.phase),je(r(X.x,X.y,.15+.5*(i-1)),d(X.x,X.y),s.clone().negate(),4.2*i,b.phase)];await n.yield();const g=yt([u,...k]),P=new a.Mesh(g,w.glaze({side:a.DoubleSide}));R.add(P),await n.yield();const C=L+14,q=22,O=[67,42,27,15,15,15],oe=t.habit||"upright",me=(t.twigs??.55)*f*f,fe=e=>de(10+(Math.abs(e)-53)/137*12,5.5,20.5),Y=await _e(v,{x:0,y:C,len:196,hw:t.trunkHw??4.5,heading:v.range(-.1,.1),orders:t.orders??5,habit:oe,clear:v.range(.13,.22),segs:[46,20,13,8,5,3],kids:[v.int(12,15),10,7,5,3],cell:.9,ratio:[v.range(.78,.9),.7,.7,.7,.7,.7],fork:[.44,.7],curl:oe==="upright"?[0,v.range(.02,.036),.02,.008,0,0]:void 0,keep:e=>e>=5?me:e===4?t.fine??1:1,bounds:{x0:-150,x1:180,y0:L+8,y1:241},budget:3e4,yield:n.yield,speed:e=>O[e],start:(e,c,A,I)=>e===3?Math.max(I,fe(c)-3.2+1.6*v()):I,limb:(e,c,A)=>{if(t.aim===!1||e.order!==1||e.side<0||c>.74)return;const I=178-62*(c/.74),te=B-70+(I-53)*.51+(A%3-1)*9;e.h=Math.atan2(I-e.x,te-e.y)-.16,e.len=Math.max(e.len,Math.hypot(I-e.x,te-e.y)*1.2),e.cu=.016*196/e.len*(oe==="seaweed"?1.5:1),e.wg=oe==="fern"?.03:.05,e.hw=Math.min(e.hw,.95)}});await n.yield();const ee=v.fork("feather"),pe=3/(.6+.4*f),Ue=async e=>{const c=Y.length;for(let A=e;A<c;A++){const I=Y[A],te=I.pts;if(I.order>3)continue;let xe=ee.range(0,pe),Fe=ee.sign();for(let he=1;he<I.n;he++){const ze=te[he*4-4],We=te[he*4-3],ge=te[he*4],se=te[he*4+1],le=Math.hypot(ge-ze,se-We);if(!(ge<62||Math.abs(se-(B-70+(ge-53)*.51))>32))for(xe+=le;xe>=pe;){xe-=pe;const ye=de(1-xe/Math.max(le,.001),0,1),qe=ie(ze,ge,ye),Ie=ie(We,se,ye),Le=ie(te[he*4-2],te[he*4+2],ye),Se=ee.range(1.5,4.2)*(.8+.5*Math.min(Le,1)),Ne=Math.atan2(ge-ze,se-We)+Fe*ee.range(.45,.95),et=ee.range(-.25,.25),tt=Math.max(ie(te[he*4-1],te[he*4+3],ye),fe(qe)-2.6+1.4*ee()),at=de(Le*.3,.03,.07),ot=new Float32Array(16);Fe=-Fe;let De=qe+Math.sin(Ne)*Le*.6,Be=Ie+Math.cos(Ne)*Le*.6,nt=0,rt=0;for(let we=0;we<4;we++){ot.set([De,Be,at*(1-.2*we),tt+we*Se/3/15],we*4),we===1&&(nt=De,rt=Be);const ke=Ne+et*(we+1)/3;De+=Math.sin(ke)*Se/3,Be+=Math.cos(ke)*Se/3}if(Be<238&&Be>L+8&&De<m.x-6&&(Y.push({order:5,n:4,pts:ot,speed:15}),Se>3.2)){const we=Ne+et/3-Fe*ee.range(.5,.8),ke=Se*ee.range(.35,.55),it=new Float32Array(12);for(let Ae=0;Ae<3;Ae++)it.set([nt+Math.sin(we)*ke*Ae/2,rt+Math.cos(we)*ke*Ae/2,at*.75,tt+(Se/3+ke*Ae/2)/15],Ae*4);Y.push({order:5,n:3,pts:it,speed:15})}}}A%400===399&&await n.yield()}};t.feather!==!1&&await Ue(0);const dt=Y.length;await n.yield();const re={x:m.x-4.7*i,y:m.y-1.7*i};let ce=null,ve=1e9;for(const e of Y)if(!(e.order<1||e.order>2))for(let c=1;c<e.n;c++){const A=e.pts[c*4],I=e.pts[c*4+1],te=Math.hypot(re.x-A,re.y-I);A<re.x-55&&I<re.y+60&&I>re.y-70&&te<ve&&(ve=te,ce={x:A,y:I,hw:e.pts[c*4+2],birth:e.pts[c*4+3]})}ce||(ce={x:Math.min(100,re.x-60),y:Math.min(170,re.y+40),hw:.5,birth:8},ve=Math.hypot(re.x-ce.x,re.y-ce.y));{const e=Math.max(12,Math.ceil(ve/2.4)),c=new Float32Array((e+1)*4),A=q-1.2,I=Math.max(ce.birth,A-ve/15),te=de(ce.hw*.9,.7,1.1),xe=-(re.y-ce.y)/ve,Fe=(re.x-ce.x)/ve,he=T.range(.5,1.4),ze=T.range(0,6),We=ve*.07*T.sign();for(let se=0;se<=e;se++){const le=se/e,ye=Math.sin(le*Math.PI)*(We*Math.sin(le*Math.PI*he+.4)+1.6*Math.sin(le*9+ze));c.set([ie(ce.x,re.x,le)+xe*ye,ie(ce.y,re.y,le)+Fe*ye,ie(te,.1,Math.pow(le,1.3)),ie(I,A,le)],se*4)}const ge=ve/Math.max(A-I,.5);Y.push({order:3,n:e+1,pts:c,speed:ge});for(let se=1;se<9;se++){const le=Math.floor(se/9*e),ye=se%2?1:-1,qe=await _e(T,{x:c[le*4],y:c[le*4+1],len:T.range(14,28)*(1-.5*se/9),hw:c[le*4+2]*.6,heading:Math.atan2(re.x-ce.x,re.y-ce.y)+ye*T.range(.5,.8),orders:1,segs:[6,3],kids:[3],birth:c[le*4+3],speed:()=>15,bounds:{x0:-136,x1:m.x-6,y0:L+6,y1:240}});for(const Ie of qe)Y.push(Ie)}}t.feather!==!1&&await Ue(dt),await n.yield();const Ye=await ht(Y,o,{yield:n.yield});Ye.boundingSphere=new a.Sphere(r(30,140,0),260);const Qe=w.stain({hero:!0}),Ke=new a.Mesh(Ye,Qe);Ke.renderOrder=3,R.add(Ke),await n.yield();const Ee=r(0,C,0),Pe=d(0,C),$e=w.drop({hero:!0}),Me=new a.Mesh(new a.SphereGeometry(1,64,22).rotateX(Math.PI/2),$e);Me.scale.setScalar(t.dropRadius??6),Me.renderOrder=2,Me.quaternion.setFromUnitVectors(new a.Vector3(0,0,1),Pe),R.add(Me);const Ze=t.fallHeight??180,Ce=t.dropRadius??6,mt=[[-30,165,150],[-14,165,82],[0,165,62],[30,165,38],[53,165,26],[85,180.5,14],[126,199.5,12],[h,B,x]],ft={strike:Ee.clone(),strikeNormal:Pe.clone(),dropStart:Ee.clone().addScaledVector(Pe,Ce*.9).add(new a.Vector3(0,Ze,0)),trunkMid:r(0,140,0),crown:r(70,200,0),treeTop:r(0,240,0),portalSeat:{position:E.clone(),direction:U.clone(),normal:J.clone(),wall:H.clone(),up:z.clone(),radius:7*i},flyThrough:mt.map(([e,c,A])=>r(e,c,A)),thumbprint:r(m.x,m.y,.5),runnerEnd:r(re.x,re.y,.2),viewpoints:{framed:r(-30,165,330),pass:r(0,165,62),climb:r(110,192,12)},windowDir:new a.Vector3(0,.6428,.766),timing:l,wallPoint:r};let Oe=-1;const ut=new a.Vector3(0,1,0),pt=Ee.clone().addScaledVector(Pe,Ce*.9),wt=r(0,C+Ce*.75,.3),Te=(e,c,A)=>de((e-c)/Math.max(A-c,1e-4),0,1),vt=1.12*(t.trunkHw??4.5)/Ce,xt=r(0,C+1.5,.3),ue=t.front||[[l.wet,-385],[l.wet+.03,-94],[l.wet+.07,20],[l.wet+.12,100],[l.strike-.04,165],[l.strike,205],[l.strike+.06,350],[l.strike+.16,735]],Xe=e=>{if(e<=ue[0][0])return ue[0][1];for(let c=1;c<ue.length;c++)if(e<ue[c][0])return ie(ue[c-1][1],ue[c][1],(e-ue[c-1][0])/Math.max(ue[c][0]-ue[c-1][0],1e-4));return ue[ue.length-1][1]};function Je(e){const c=e<l.strike?-1:e<l.trunk?3*Te(e,l.strike,l.trunk):e<l.limbs?3+7*Te(e,l.trunk,l.limbs):10+12*Te(e,l.limbs,l.end),A=1-.25*Re(l.limbs,1,e);Qe.uniforms.uGrow.value.set(c,0,A,1),ae.uniforms.uWet.value.set(1,Xe(e)/V,A,.3+.7*e);const I=Te(e,l.fall,l.strike),te=Re(l.strike,l.strike+.012,e);Me.visible=e>=l.fall;const xe=Re(l.strike+.012,l.trunk+.025,e);Me.position.copy(pt).addScaledVector(ut,Ze*(1-I)).lerp(wt,te).lerp(xt,xe),$e.uniforms.uDrop.value.set(te,ie(t.blot??.8,vt,xe),1,t.dropTail??0)}return Je(0),{object:R,radius:480,height:260,center:new a.Vector3(0,130,0),anchors:ft,style:w,jar:{radius:V,height:j,bandFoot:L,bandTop:M},wallPoint:r,wallNormal:d,frontAt:Xe,setProgress(e){Oe=de(e,0,1)},update(e,c,A){W&&w.update(e,c,A),Je(Oe>=0?Oe:.22+.78*((c+14)/34%1))},dispose(){},ground:!0,groundY:0}}export{Tt as buildHero,Vt as makeStyle};
