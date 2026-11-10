import*as f from"three";import{mergeGeometries as Ie}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as de,lerp as Re,smoothstep as ee}from"../kit/core.js";const ge=24,Ne=["#0F1D40","#1E9FA6","#3F8F6E","#F2E7C9","#C98A2B","#17151C","#5B6672"],F={x:-70,z:-40,r:300},ve={x:0,z:-556},he=`
uniform vec3 uPig[8];
uniform vec3 uHazeCol;
uniform vec4 uHaze;
float ebHash1(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
vec2 ebHash2(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz) * q.zy); }
vec3 ebHash3(vec3 p){ p = fract(p * vec3(.1031, .1030, .0973)); p += dot(p, p.yxz + 33.33); return fract((p.xxy + p.yxx) * p.zyx); }
float ebHaze(float d){ return uHaze.z * (1. - exp(-pow(max(d, 0.) / uHaze.x, uHaze.y))); }
vec3 ebPig(float i){ return uPig[int(clamp(i, 0., 7.) + .5)]; }
`,pe=`
uniform vec4 uSwell[3];
uniform float uTime;
float ebSwell(vec2 xz){
  float h = 0.;
  for (int i = 0; i < 3; i++) { vec4 s = uSwell[i]; h += s.w * sin(dot(xz, s.xy) * s.z - sqrt(9.81 * s.z) * uTime + float(i) * 1.7); }
  return h;
}
`,Ge=`
precision highp float;
${pe}
uniform vec2 uSnap;
varying vec2 vXZ;
varying vec3 vWP;
void main(){
  vec3 lp = vec3(position.x + uSnap.x, 0., position.z + uSnap.y);
  lp.y = ebSwell(lp.xz);
  vXZ = lp.xz; vWP = lp;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(lp, 1.);
}
`,_e=`
precision highp float;
#define NOPS ${ge}
#define CELL 7.0
${he}
uniform vec4 uOpA[NOPS];
uniform vec4 uOpB[NOPS];
uniform vec4 uOpC[NOPS];
uniform vec4 uGap[8];
uniform vec4 uEddy;
uniform vec4 uSat[2];
uniform vec4 uRain;
uniform vec3 uSunDir;
uniform vec3 uCamL;
uniform float uTime;
uniform float uHi;
uniform vec3 uHiCol;
uniform float uGlow;
uniform float uSeed;
uniform float uDetail;
uniform vec4 uField;
uniform vec2 uRank;
varying vec2 vXZ;
varying vec3 vWP;

float tineRamp(float s, float s0, float s1, float hd, float tl){
  return smoothstep(s0 - tl, s0 + tl, s) * (1. - smoothstep(s1 - hd, s1, s));
}
float vnoise(vec2 p){
  vec2 i = floor(p), f = p - i; f = f * f * (3. - 2. * f);
  return mix(mix(ebHash1(i), ebHash1(i + vec2(1., 0.)), f.x), mix(ebHash1(i + vec2(0., 1.)), ebHash1(i + vec2(1., 1.)), f.x), f.y);
}
// share of bloom pigment (0 = bare navy sea, 1 = thick bloom) in BASE space: straight spokes that the
// eddy operation winds into the spiral
float bloomMask(vec2 pb){
  vec2 q = pb - uEddy.xy + vec2(1e-3, 0.);
  float d = length(q), th = atan(q.y, q.x);
  float env = 1. - smoothstep(uEddy.z * .3, uEddy.z * 1.05, d);
  float arms = .5 + .5 * cos(th * uEddy.w + 2.2 * vnoise(pb * .012 + 3.));
  arms = smoothstep(.4, .78, arms);
  float m = env * (.12 + .88 * arms) + .7 * (1. - smoothstep(10., 95., d));
  for (int i = 0; i < 2; i++) { m += .9 * (1. - smoothstep(uSat[i].z * .35, uSat[i].z * 1.15, length(pb - uSat[i].xy))); }
  m += .4 * smoothstep(.6, .82, vnoise(pb * .0045 + 9.)) * (1. - env);
  return clamp(m, 0., 1.);
}
float navyShare(float m){ return mix(.85, .27, m); }
// pigment index of band n in cell id
float pigOf(vec2 id, float n, float navyW){
  float h = ebHash1(id * 1.73 + vec2(n * 13.17 + 3.1, n * 7.31 - 1.7));
  float h2 = ebHash1(id * 2.31 + vec2(n * 5.77 - 8.3, n * 3.13 + 2.9));
  if (h < navyW) return h2 < .55 ? 0. : 7.;
  float t = (h - navyW) / max(1. - navyW, 1e-3);
  return t < .42 ? 1. : (t < .72 ? 2. : 3.);
}
vec3 seaPig(float i){
  // 7 inside the base is the ground laid a little thinner (navy leaning to turquoise), not still water
  return i > 6.5 ? mix(uPig[0], uPig[1], .17) : ebPig(i);
}
vec3 regionMean(float m){
  float nw = navyShare(m);
  // averaged the way the eye reads a marbled sheet from afar (in root space), so the far sea stays ink
  vec3 navy = sqrt(mix(uPig[0], mix(uPig[0], uPig[1], .17), .45));
  vec3 bright = sqrt(uPig[1]) * .42 + sqrt(uPig[2]) * .30 + sqrt(uPig[3]) * .28;
  vec3 v = mix(bright, navy, nw);
  return v * v;
}
// THE NONPAREIL FIELD. North of the row the sheet is laid in RANKS 14 m deep: bands of pigment lying across
// the tide, four to a rank (a wide dominant band that cycles turquoise, jade, cream from rank to rank, a navy
// band, a narrower band of one of the other two, a thin navy band), which the fine comb draws into feathers.
// Read in the space before the shears and eddies are undone, so the ranks stay square to the comb.
// uField: row arc radius, half width, north edge z, tide shift (m). uRank: rank depth, seed.
float fieldSd(vec2 pf){
  float a = uField.x - length(pf - uEddy.xy);
  return max(max(a, abs(pf.x) - uField.y), max(uField.z - pf.y, pf.y + 215.));
}
// band coordinate at rank coordinate t (whole part: rank * 4 + band), the band's pigment, the rank's mean
float rankBand(float t, out float pig, out vec3 mean){
  float R = floor(t), f = t - R;
  float A = 1. + mod(R, 3.);
  float B = 1. + mod(A - 1. + (ebHash1(vec2(R * 1.37 + 2.1, uRank.y)) < .5 ? 1. : 2.), 3.);
  float k = 3., lo = .83, hi = 1.; pig = 7.;
  if (f < .46) { k = 0.; lo = 0.; hi = .46; pig = A; }
  else if (f < .62) { k = 1.; lo = .46; hi = .62; pig = 0.; }
  else if (f < .83) { k = 2.; lo = .62; hi = .83; pig = B; }
  vec3 m = .46 * sqrt(ebPig(A)) + .21 * sqrt(ebPig(B)) + .33 * sqrt(mix(uPig[0], uPig[1], .06));
  mean = m * m;
  return R * 4. + k + (f - lo) / (hi - lo);
}
// one layer of battal stones at pp: nearest cell, its neighbour, the distance to the wall between them
void stoneCell(vec2 pp, float seed, out vec2 id1, out vec2 id2, out vec2 hh1, out vec2 hh2, out float d1, out float d2, out float eCell, out vec2 cen){
  vec2 q = pp / CELL + seed; vec2 g = floor(q); vec2 f = q - g;
  d1 = 1e3; d2 = 1e3; vec2 r1 = vec2(0.), r2 = vec2(1., 0.);
  id1 = g; id2 = g; hh1 = vec2(0.); hh2 = vec2(0.);
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 o = vec2(float(i), float(j));
      vec2 h = ebHash2(g + o);
      vec2 r = o + .5 + .72 * (h - .5) - f;
      float d = dot(r, r);
      if (d < d1) { d2 = d1; r2 = r1; id2 = id1; hh2 = hh1; d1 = d; r1 = r; id1 = g + o; hh1 = h; }
      else if (d < d2) { d2 = d; r2 = r; id2 = g + o; hh2 = h; }
    }
  }
  vec2 dr = r2 - r1;
  eCell = dot(.5 * (r1 + r2), dr / max(length(dr), 1e-4)) * CELL;
  cen = (id1 + .5 + .72 * (hh1 - .5) - seed) * CELL;
}
float rimLine(float px, float w){ return 1. - smoothstep(w * .5 - .5, w * .5 + .5, px); }
void main(){
  vec2 p = vXZ;
  vec2 dxp = dFdx(vXZ), dyp = dFdy(vXZ);
  float mpp = max(.5 * (abs(dxp.x) + abs(dyp.x) + abs(dxp.y) + abs(dyp.y)), 1e-5);
  float rimW = max(1.2, .04 / mpp);
  float camD = length(vWP - uCamL);
  float fmax = max(max(length(dxp), length(dyp)), 1e-6);        // metres a pixel along its long axis
  float ringA = 0., ringPig = 3., pxRing = 1e5;

  float pxDrop = 1e5;
  float capPig = -1.;
  float lensA = 0.;
  float disturb = 0.;
  bool gotPre = false, gotF = false;
  vec2 pPre = p, pF = p;
  for (int i = 0; i < NOPS; i++) {
    int k = NOPS - 1 - i;
    vec4 A = uOpA[k]; vec4 B = uOpB[k]; vec4 C = uOpC[k];
    int ty = int(C.w + .5);
    if (ty == 0) continue;
    if (ty == 1) {                                   // DROP  A: x z r coreFrac   B: pigment corePigment lensAlpha
      vec2 d = p - A.xy; float d2 = dot(d, d); float dl = sqrt(d2);
      vec2 nrm = d / max(dl, 1e-4);
      float fn = max(abs(dot(dxp, nrm)) + abs(dot(dyp, nrm)), 1e-6);
      float sd = dl - A.z;
      pxDrop = min(pxDrop, abs(sd) / fn);
      if (sd < 0.) {
        float sd2 = dl - A.z * A.w;
        bool core = A.w > .001 && sd2 < 0.;
        if (A.w > .001) pxDrop = min(pxDrop, abs(sd2) / fn);
        float cp = B.x;
        if (C.x > .01 && !core) {                      // pressed bands between the core and the rim (C.x m each)
          float bq = sd2 / C.x, bk = floor(bq), bfq = bq - bk, bpx = C.x / fn;
          pxDrop = min(pxDrop, min(bfq, 1. - bfq) * bpx + max(0., 3. - bpx) * 2.);
          float m3 = mod(bk, 3.);
          cp = (m3 < .5 || bpx < 1.2) ? B.x : (m3 < 1.5 ? 1. : 0.);
        }
        capPig = core ? B.y : cp;
        lensA = core ? B.z : 0.;
        break;
      }
      float k2 = A.z * A.z / max(d2, 1e-4);
      float sh = sqrt(max(1. - k2, 0.));
      p = A.xy + d * sh;
      disturb += dl * (1. - sh);
    } else if (ty == 2) {                            // STROKE  A: x0 z0 mx mz   B: drag L length head   C: tail
      vec2 q = p - A.xy; float s = dot(q, A.zw); float v = q.x * A.w - q.y * A.z;
      float e = B.x * exp(-abs(v) / max(B.y, 1e-3));
      float ss = s - e * tineRamp(s, 0., B.z, B.w, C.x);
      ss = s - e * tineRamp(ss, 0., B.z, B.w, C.x);
      float dsp = e * tineRamp(ss, 0., B.z, B.w, C.x);
      p -= A.zw * dsp;
      disturb += dsp;
    } else if (ty == 3) {                            // COMB  A: x z mx mz   B: drag L spacing(<0: back-and-forth) feather   C: sMin sMax halfWidth
      vec2 q = p - A.xy; float s = dot(q, A.zw); float v = q.x * A.w - q.y * A.z;
      float sp = abs(B.z); float t = v / sp; float k0 = floor(t); float f = (t - k0) * sp;
      float sg = (B.z < 0. && mod(k0, 2.) > .5) ? -1. : 1.;
      float sg1 = B.z < 0. ? -sg : sg;
      float e = B.x * (sg * exp(-f / B.y) + sg1 * exp(-(sp - f) / B.y));
      float fe = B.w * (C.y - C.x);
      float w = smoothstep(C.x, C.x + fe, s) * (1. - smoothstep(C.y - fe, C.y, s)) * (1. - smoothstep(C.z * .65, C.z, abs(v)));
      p -= A.zw * e * w;
    } else if (ty == 4) {                            // VORTEX  A: x z angle R
      if (!gotPre) { pPre = p; gotPre = true; }
      if (A.w > 60. && !gotF) { pF = p; gotF = true; }
      vec2 q = p - A.xy; float d = length(q);
      float a = -A.z * exp(-d / max(A.w, 1e-3));
      float c = cos(a), sn = sin(a);
      p = A.xy + vec2(c * q.x - sn * q.y, sn * q.x + c * q.y);
    } else if (ty == 5) {                            // SHEAR  A: dx dz amp k   B: phase
      if (!gotF) { pF = p; gotF = true; }
      float v = p.y * A.x - p.x * A.y;
      p -= A.xy * A.z * sin(A.w * v + B.x);
    } else if (ty == 6) {                            // GAP TINES  A: x z mx mz   B: approach runout head tail
      vec2 q = p - A.xy; float s = dot(q, A.zw); float v = q.x * A.w - q.y * A.z;
      float ss = s;
      for (int it = 0; it < 3; it++) {
        float acc = 0.;
        for (int g = 0; g < 8; g++) {
          vec4 G = uGap[g];
          acc += G.w * exp(-abs(v - G.x) / max(G.z, 1e-3)) * tineRamp(ss - G.y, -B.x, B.y, B.z, B.w);
        }
        ss = s - acc;
      }
      p -= A.zw * (s - ss);
      disturb += (s - ss) * .25;
    } else if (ty == 7) {                            // RING FIELD  A: x z regionR cell   B: maxR period density pigment   C: phase area seed
      vec2 q = (p - A.xy) / A.w; vec2 g = floor(q);
      float h0 = ebHash1(g + C.z + 4.4);
      float tt = uTime / max(B.y, .1) + h0 * 9.7 + C.x;
      float cyc = floor(tt), ph = tt - cyc;
      vec2 h = ebHash2(g + C.z + cyc * 7.13);
      float rr = min(B.x / A.w, .45);
      vec2 c = g + rr + (1. - 2. * rr) * h;
      float on = step(ebHash1(g + C.z + cyc * 3.71), B.z) * step(length(c) * A.w, A.z);
      float R = B.x * sqrt(ph);
      float wdt = min(R, C.y / max(2. * R, 1e-3)) * (1. - smoothstep(.8, 1., ph));
      vec2 dq = q - c; float dl = length(dq) * A.w;
      float sdr = abs(dl - R) - .5 * wdt;
      // (a ring whose band is thinner than a pixel and a half along the footprint's long axis is not drawn: at a
      //  grazing angle it would break into dashes. Rings displace nothing, so the walk goes on underneath.)
      float vis = on * step(.003, wdt) * smoothstep(1.2, 2.4, wdt / fmax);
      if (vis > 0.) {
        vec2 nrm = dq / max(length(dq), 1e-4);
        float fn = max(abs(dot(dxp, nrm)) + abs(dot(dyp, nrm)), 1e-6);
        pxRing = min(pxRing, abs(sdr) / fn + (1. - vis) * 4.);
        if (sdr < 0.) { ringA = vis; ringPig = B.w; }
      }
    }
  }

  // ---- stones (always evaluated so that every derivative stays at the top level)
  vec2 pb = p;
  if (!gotPre) pPre = p;
  vec2 id1, id2, hh1, hh2, cen; float d1, d2, eCell;
  stoneCell(pb, uSeed, id1, id2, hh1, hh2, d1, d2, eCell, cen);
  float mC = bloomMask(cen);
  float navyW = navyShare(mC);
  float b = hh1.x * 6. + ebHash1(id1 + 7.7) * 3. - d1 * CELL * CELL / (3. + 4. * hh1.y);
  float b2 = hh2.x * 6. + ebHash1(id2 + 7.7) * 3. - d2 * CELL * CELL / (3. + 4. * hh2.y);
  // the nonpareil field takes the place of the stones north of the row
  if (!gotF) pF = p;
  float sdF = fieldSd(pF);
  float inF = step(sdF, 0.);
  float tF = (pF.y + uField.w + 2.4 * sin(pF.x * .019 + 1.3) + 1.1 * sin(pF.x * .053 + 4.)) / uRank.x;
  float pigF; vec3 meanF;
  float bFld = rankBand(tF, pigF, meanF);
  b = mix(b, bFld, inF);
  float n = floor(b), bf = b - n;
  float pIdx = inF > .5 ? pigF : pigOf(id1, n, navyW);
  float pNb = inF > .5 ? -1. : pigOf(id1, bf < .5 ? n - 1. : n + 1., navyW);
  float mP = bloomMask(pb);
  float pCell2 = pigOf(id2, floor(b2), navyW);
  float pMean = pigOf(id1, -3., navyW);
  float laceOn = step(.42, ebHash1(id1 + 2.2));
  vec2 q = pb / CELL;

#ifdef LACE
  // gall lace: hairline cells in mapped space
  vec2 ql = pb / .85 + 17.; vec2 gq = floor(ql); vec2 fl = ql - gq;
  float l1 = 1e3, l2 = 1e3; vec2 s1 = vec2(0.), s2 = vec2(1., 0.);
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 o = vec2(float(i), float(j));
      vec2 r = o + .5 + .8 * (ebHash2(gq + o + 31.) - .5) - fl;
      float d = dot(r, r);
      if (d < l1) { l2 = l1; s2 = s1; l1 = d; s1 = r; }
      else if (d < l2) { l2 = d; s2 = r; }
    }
  }
  vec2 dls = s2 - s1;
  float eLace = dot(.5 * (s1 + s2), dls / max(length(dls), 1e-4)) * .85;
#endif

#ifdef RAIN
  // rain stones: round drops laid on top of the wound sheet (in the space before the eddies are undone)
  vec2 idR, idR2, hR, hR2, cenR; float dR, dR2, eR;
  stoneCell(pPre, uSeed + 41.3, idR, idR2, hR, hR2, dR, dR2, eR, cenR);
  float rainOn = step(.001, uRain.z);
  float present = step(ebHash1(idR + 91.7), .94 * smoothstep(uRain.x, uRain.x + uRain.y, cenR.y)) * rainOn;
  vec2 cenR2 = (idR2 + .5 + .72 * (hR2 - .5) - uSeed - 41.3) * CELL;
  float present2 = step(ebHash1(idR2 + 91.7), .94 * smoothstep(uRain.x, uRain.x + uRain.y, cenR2.y)) * step(sqrt(dR2) * CELL, CELL * (.3 + .13 * hR2.y) + .2);
  float sdS = sqrt(dR) * CELL - CELL * (.3 + .13 * hR.y);
  float bR = hR.x * 6. + uRain.z * uTime * (.7 + .6 * ebHash1(idR + 3.3)) - dR * CELL * CELL / (2.2 + 2.6 * hR.x);
  float nR = floor(bR), bfR = bR - nR;
  float pR = pigOf(idR, nR, .5);
  float pRn = pigOf(idR, bfR < .5 ? nR - 1. : nR + 1., .5);
  vec2 qR = pPre / CELL;
#endif

  // ---- derivatives, once, after every loop
  float fwB = fwidth(b);
  // cells per pixel along the WORST screen axis: a footprint that is long one way and thin the other (raked
  // pattern seen at a grazing angle) must melt as soon as its thin side nears a pixel, or it breaks into dashes
  float cq = max(length(dFdx(q)), length(dFdy(q))) * 1.3;
  float fwC = fwidth(eCell);
  float fwT = max(abs(dFdx(tF)), abs(dFdy(tF))) * 1.3;
  float fwF = fwidth(sdF);

  float bandLod = 1. - smoothstep(.08, .32, fwB);
  float cellLod = (1. - smoothstep(.12, .38, cq)) * (1. - inF);
  float farK = smoothstep(.25, .6, cq);
  float rimB = rimLine(min(bf, 1. - bf) / max(fwB, 1e-5), rimW) * bandLod * (abs(pNb - pIdx) < .5 ? .28 : 1.);
  float rimC = rimLine(eCell / max(fwC, 1e-5), rimW) * cellLod * (abs(pCell2 - pIdx) < .5 ? .34 : 1.);
  rimC = max(rimC, rimLine(abs(sdF) / max(fwF, 1e-5), rimW) * (1. - farK));
  // a hairline rib down the middle of every dominant band
  rimC = max(rimC, rimLine(abs(fract(tF) - .23) / max(fwT / 1.3, 1e-5), 1.) * (1. - smoothstep(.016, .05, fwT)) * inF * .75);

  vec3 cPig = seaPig(pIdx);
#ifdef LACE
  float fwL = fwidth(eLace);
  float lq = max(length(dFdx(ql)), length(dFdy(ql))) * 1.3;
  float lace = rimLine(eLace / max(fwL, 1e-5), max(1., .022 / mpp)) * (1. - smoothstep(.1, .3, lq)) * laceOn;
  vec3 laceCol = abs(pIdx - 3.) < .5 ? mix(uPig[3], uPig[0], .45) : mix(cPig, uPig[3], .62);
  cPig = mix(cPig, laceCol, lace * .85);
  // pinhole bubbles near the camera
  vec2 qb = pPre / .42 + 5.; vec2 gb = floor(qb); vec2 hb = ebHash2(gb + 77.);
  vec2 cb = gb + .15 + .7 * ebHash2(gb + 3.3);
  float db = length(qb - cb) * .42 - (.011 + .016 * hb.x);
  float bubOn = step(hb.y, .3) * (1. - smoothstep(22., 40., camD));
  cPig = mix(cPig, uPig[5], bubOn * (1. - smoothstep(-.5, .5, (db - .012) / mpp)));
  cPig = mix(cPig, uPig[3], bubOn * (1. - smoothstep(-.5, .5, db / mpp)));
#endif

  // far colour: the region's mean (continuous, not per cell); the field's own mean fades in from its edge
  float edgeF = smoothstep(0., 50., -sdF);
  // (melted, the field goes to a calmer, darker mean than its ranks: the far sea stays ink under the pale sky)
  vec3 rMean = regionMean(mix(mP, mix(mP, .14, edgeF), inF));
  vec3 cellMean = mix(mix(rMean, seaPig(pMean), .5), meanF, inF);
  vec3 base = mix(cPig, cellMean, smoothstep(.22, .46, fwB));
  float farF = max(smoothstep(.16, .4, fwT), (1. - edgeF) * smoothstep(.12, .4, cq));
  base = mix(base, rMean, mix(farK, farF, inF));
  base = mix(base, uPig[5], max(rimB, rimC) * .92);

#ifdef RAIN
  float fwBR = fwidth(bR);
  float cqR = max(length(dFdx(qR)), length(dFdy(qR))) * 1.3;
  float fwER = fwidth(eR);
  float fwSd = fwidth(sdS);
  float rainLod = (1. - smoothstep(.25, .6, cqR)) * present;
  vec3 colR = mix(seaPig(pR), mix(uPig[0], uPig[1], .3), smoothstep(.22, .46, fwBR));
  float rimBR = rimLine(min(bfR, 1. - bfR) / max(fwBR, 1e-5), rimW) * (1. - smoothstep(.08, .32, fwBR)) * (abs(pRn - pR) < .5 ? .28 : 1.);
  float rimCR = rimLine(eR / max(fwER, 1e-5), rimW) * present2 * (1. - smoothstep(.15, .45, cqR));
  colR = mix(colR, uPig[5], max(rimBR, rimCR) * .92);
  base = mix(base, colR, rainLod * step(sdS, 0.));
  base = mix(base, uPig[5], rimLine(abs(sdS) / max(fwSd, 1e-5), rimW) * rainLod * .92);
#endif

  vec3 capCol = capPig > 6.5 ? uPig[7] : ebPig(max(capPig, 0.));
  vec3 col = capPig > -.5 ? capCol : base;
  float bright = capPig > -.5 ? step(.5, capPig) * step(capPig, 3.5) : step(.5, pIdx) * step(pIdx, 3.5);
  col *= 1. + uGlow * bright * smoothstep(.4, 5., disturb);
  col = mix(col, ebPig(ringPig), ringA);
  col = mix(col, uPig[5], rimLine(min(pxDrop, pxRing), rimW) * .92);

  // the one wet highlight: a column of short dashes under the sun's bearing
  vec2 toF = vXZ - uCamL.xz;
  vec2 sdir = uSunDir.xz / max(length(uSunDir.xz), 1e-4);
  float along = dot(toF, sdir), across = toF.x * sdir.y - toF.y * sdir.x;
  float la = log(max(along, .5)) * 24.;
  float fwLa = max(fwidth(la), 1e-5), fwAc = max(fwidth(across), 1e-5);
  float row = floor(la), fr = la - row;
  float tick = floor(uTime * 2.2 + ebHash1(vec2(row, 3.)) * 9.);
  float h2 = ebHash1(vec2(row, tick)), h3 = ebHash1(vec2(tick + 5., row));
  float colW = .034 * max(along, 0.) + .25;
  float el = atan(max(uCamL.y, 1.), max(along, .5));
  float ge = (el - asin(clamp(uSunDir.y, -1., 1.))) / .42;
  float env = mix(.22, 1., exp(-ge * ge)) * step(0., along) * (1. - smoothstep(.55, .9, ge)) * (1. - smoothstep(900., 2400., along));
  // each dash is a small lens of light, not a bar
  float hl = colW * (.2 + .6 * h2);
  float dAc = (across - (h3 - .5) * colW * 1.5) / hl, dLa = (fr - .5) / .21;
  float dpx = max(max(fwAc / hl, fwLa / .21), 1e-4);
  float dash = (1. - smoothstep(-1., 1., (sqrt(dAc * dAc + dLa * dLa) - 1.) / dpx)) * step(1. - .8 * env, h2 * .999 + .001)
             * (1. - smoothstep(.5, 1.1, fwLa));
  col = mix(col, uHiCol, clamp(dash * uHi, 0., 1.) * (1. - step(.001, lensA)) * (1. - step(6.5, capPig)));

  col = mix(col, uHazeCol, ebHaze(camD));
  gl_FragColor = vec4(col, lensA > .001 ? lensA : 1.);
}
`,Ve=s=>`
precision highp float;
${pe}
varying vec3 vN;
varying vec3 vWPos;
varying vec3 vOP;
varying vec3 vCol;
varying float vDist;
${s.vertDecl||""}
void main(){
  vec3 op = position;
  vec3 on = normal;
  #ifdef USE_INSTANCING
    mat4 mm = modelMatrix * instanceMatrix;
  #else
    mat4 mm = modelMatrix;
  #endif
  #ifdef USE_COLOR
    vCol = color.rgb;
  #else
    vCol = vec3(1.);
  #endif
  vOP = position;
  ${s.vertMain||""}
  vec4 wp = mm * vec4(op, 1.);
  vec3 wn = mat3(mm) * on;
  vN = wn / max(length(wn), 1e-5);
  vWPos = wp.xyz;
  vec4 mv = viewMatrix * wp;
  vDist = length(mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`,Ke=s=>`
precision highp float;
${he}
uniform vec3 uSunDir;
uniform vec3 uColor;
uniform float uTime;
uniform float uSpots;
uniform float uSpotCell;
uniform float uSpotCream;
uniform float uBias;
uniform float uOutline;
uniform float uOpacity;
varying vec3 vN;
varying vec3 vWPos;
varying vec3 vOP;
varying vec3 vCol;
varying float vDist;
${s.fragDecl||""}
float sRim(float px, float w){ return 1. - smoothstep(w * .5 - .5, w * .5 + .5, px); }
void main(){
  vec3 N = vN / max(length(vN), 1e-5);
  if (!gl_FrontFacing) N = -N;
  vec3 V = cameraPosition - vWPos; V /= max(length(V), 1e-5);
  vec3 op = vOP, wp = vWPos;
  vec3 pig = vCol * uColor;
  float rim = 0.;
  float spotAmt = uSpots, spotCream = uSpotCream;
  float lightBias = uBias;
  // spot-marbling: one stone per cell, two sizes, drawn in object space so it rides with the thing
  vec3 qs = op / uSpotCell; vec3 gs = floor(qs); vec3 hs = ebHash3(gs + 11.3);
  float rs = .12 + .3 * hs.x;
  float sdA = (length(qs - gs - rs - (1. - 2. * rs) * ebHash3(gs + 3.7)) - rs) * uSpotCell;
  vec3 qt = op / (uSpotCell * .31) + 5.5; vec3 gt = floor(qt); vec3 ht = ebHash3(gt + 23.1);
  float rt = .14 + .26 * ht.x;
  float sdB = (length(qt - gt - rt - (1. - 2. * rt) * ebHash3(gt + 8.2)) - rt) * uSpotCell * .31;
  float fwS = max(fwidth(op.x) + fwidth(op.y) + fwidth(op.z), 1e-5) * .6;
  ${s.fragPigment||""}
  float onA = step(hs.y, spotAmt * .8), onB = step(ht.y, spotAmt * .4);
  float lodA = 1. - smoothstep(.12, .4, fwS / uSpotCell), lodB = 1. - smoothstep(.12, .4, fwS / (uSpotCell * .31));
  vec3 spotA = hs.z < spotCream ? uPig[3] : uPig[2];
  vec3 spotB = ht.z < spotCream ? uPig[3] : uPig[2];
  pig = mix(pig, spotA, onA * (1. - smoothstep(-.5, .5, sdA / fwS)) * mix(.45, 1., lodA));
  rim = max(rim, onA * lodA * sRim(abs(sdA) / fwS, 1.3));
  pig = mix(pig, spotB, onB * (1. - smoothstep(-.5, .5, sdB / fwS)) * lodB);
  rim = max(rim, onB * lodB * sRim(abs(sdB) / fwS, 1.2) * .8);
  // two steps of shade split by a hairline
  float ndl = dot(N, uSunDir) + lightBias;
  float aa = max(fwidth(ndl), 1e-4);
  float lit = smoothstep(-aa, aa, ndl);
  rim = max(rim, sRim(abs(ndl) / aa, 1.4) * .85);
  vec3 col = mix(mix(pig, uPig[0], .35) * .72, pig, lit);
  float nv = abs(dot(N, V));
  rim = max(rim, uOutline * (1. - smoothstep(.1, .24, nv)));
  col = mix(col, uPig[5], rim * .92);
  col = mix(col, uHazeCol, ebHaze(vDist));
  gl_FragColor = vec4(col, uOpacity);
}
`;function Le(s,n){const o=(s&&s.length>=7?s:Ne).map(h=>new f.Color(h)),y=o[3].clone(),r=Math.max(y.r,y.g,y.b);r>.78&&y.multiplyScalar(.78/r);const i=new f.Color("#0A1230").lerp(o[0],.25),c=[o[0],o[1],o[2],y,o[4],o[5],o[6],i],m=h=>2*Math.PI/h,d=h=>{const t=h*Math.PI/180;return[Math.sin(t),-Math.cos(t)]},g=d(45),u=d(72),b=d(14);return{uPig:{value:c},uHazeCol:{value:n?new f.Color(n):y.clone()},uHaze:{value:new f.Vector4(3980,.793,1,0)},uSunDir:{value:new f.Vector3(Math.cos(42*Math.PI/180),Math.sin(42*Math.PI/180),0)},uTime:{value:0},uSwell:{value:[new f.Vector4(g[0],g[1],m(70),.5),new f.Vector4(u[0],u[1],m(31),.13),new f.Vector4(b[0],b[1],m(17),.07)]}}}function Be(s={}){const n=s.shared||Le(s.palette,s.hazeColor),o={uPig:n.uPig,uHazeCol:n.uHazeCol,uHaze:n.uHaze,uSunDir:n.uSunDir,uTime:n.uTime,uSwell:n.uSwell,uColor:{value:new f.Color(s.color??"#ffffff")},uSpots:{value:s.spots??0},uSpotCell:{value:s.spotCell??1.8},uSpotCream:{value:s.spotCream??.5},uBias:{value:s.bias??0},uOutline:{value:s.outline??.85},uOpacity:{value:s.opacity??1},...s.uniforms||{}},y=new f.ShaderMaterial({uniforms:o,vertexShader:Ve(s),fragmentShader:Ke(s),vertexColors:s.vertexColors??!1,side:s.side??f.FrontSide,transparent:!!s.transparent,depthWrite:s.depthWrite??!s.transparent,fog:!1});return y.userData.shared=n,y}const Xe=`
attribute vec4 aRock;
varying vec4 vRock;
`,Ze=`
  vRock = aRock;
`,$e=`
varying vec4 vRock;
`,Ue=`
  {
    float bed = vRock.x, bi = floor(bed), bfr = bed - bi;
    float bj = floor(bed / 4.);
    float hbd = ebHash1(vec2(bj, 4.2)), hlm = ebHash1(vec2(bi, 1.3));
    vec3 slate = uPig[6], black = uPig[5];
    pig = mix(black, slate, clamp((hbd < .24 ? .2 : (hbd < .62 ? .68 : 1.)) + (hlm - .5) * .26, 0., 1.));
    pig = mix(pig, mix(slate, uPig[3], .32), step(.9, hbd) * .7);
    float fb = max(fwidth(bed), 1e-5);
    float farK = 1. - smoothstep(.12, .45, fb);
    float bedEdge = step(abs(bed / 4. - floor(bed / 4. + .5)), .13);
    rim = max(rim, sRim(min(bfr, 1. - bfr) / fb, 1.5) * farK * mix(.4, 1., bedEdge));
    // joints: each bed is cut by its own vertical hairlines
    float jw = 1.7 + 3.4 * ebHash1(vec2(bi, 9.1));
    float ju = vRock.y / jw + hbd * 7.;
    float fj = max(fwidth(vRock.y) / jw, 1e-5);
    float jf = abs(fract(ju) - .5);
    rim = max(rim, sRim((.5 - jf) / fj, 1.2) * .55 * step(.4, ebHash1(vec2(floor(ju + .5), bi + 3.))) * (1. - smoothstep(.06, .22, fj)) * farK * step(vRock.w, .5));
    // guano: cream runs hanging from the upper ledges
    float sc = vRock.y / .34, sci = floor(sc);
    float hsk = ebHash1(vec2(sci, bj * 1.7 + 2.)), hsl = ebHash1(vec2(sci + 9., bj));
    float bfj = fract(bed / 4.);
    float fsc = max(fwidth(sc), 1e-5);
    float run = step(1. - .42 * smoothstep(.3, .75, vRock.z), hsk) * step(1. - (.15 + .8 * hsl * hsl), bfj) * step(vRock.w, .5);
    float runEdge = abs(fract(sc) - .5);
    float runLod = 1. - smoothstep(.25, .7, fsc);
    pig = mix(pig, uPig[3], run * mix(.35, 1., runLod) * (1. - smoothstep(.5 - fsc * 1.5, .5, runEdge)));
    // tops: paler, thick with thrift and lichen
    float top = step(.5, vRock.w) * step(vRock.w, 1.5);
    pig = mix(pig, mix(slate, uPig[2], .22), top * .8);
    spotAmt = mix(spotAmt, 1., top);
    spotCream = mix(mix(.12, .85, smoothstep(.15, .7, vRock.z)), .8, top);
    // the wet foot under the notch: lamp-black, jade-spotted
    float wet = 1. - smoothstep(1.3, 2.4, op.y + .5 * sin(vRock.y * .37));
    pig = mix(pig, mix(black, uPig[0], .25), wet);
    spotCream = mix(spotCream, .0, wet);
  }
`,Ye=`
precision highp float;
${pe}
attribute vec3 aCol;
varying vec3 vC;
varying float vDist;
void main(){
  vec3 lp = position;
  vec4 mv0 = viewMatrix * modelMatrix * vec4(lp, 1.);
  lp.y = ebSwell(lp.xz) + .14 + length(mv0.xyz) * .0009;
  vC = aCol;
  vec4 mv = viewMatrix * modelMatrix * vec4(lp, 1.);
  vDist = length(mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`,Je=`
precision highp float;
${he}
uniform float uTime;
varying vec3 vC;
varying float vDist;
void main(){
  float wash = .9 * sin(uTime * .7 + vC.x * .09 + vC.z) + .45 * sin(uTime * 1.13 + vC.x * .23 + 2. * vC.z);
  float rho = vC.y - wash;
  float frho = max(fwidth(vC.y), 1e-5);
  float edge = rho - (1.7 + .6 * sin(vC.x * .8 + uTime * .5));
  float solid = 1. - smoothstep(-frho, frho, edge);
  vec2 ql = vec2(vC.x, rho) / 1.05; vec2 g = floor(ql), f = ql - g;
  float l1 = 1e3, l2 = 1e3; vec2 s1 = vec2(0.), s2 = vec2(1., 0.);
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 o = vec2(float(i), float(j));
      vec2 h = ebHash2(g + o + vC.z * 13.);
      vec2 r = o + .5 + .36 * sin(uTime * (.5 + h.x) + 6.283 * h) - f;
      float d = dot(r, r);
      if (d < l1) { l2 = l1; s2 = s1; l1 = d; s1 = r; }
      else if (d < l2) { l2 = d; s2 = r; }
    }
  }
  vec2 dls = s2 - s1;
  float e = dot(.5 * (s1 + s2), dls / max(length(dls), 1e-4)) * 1.05;
  float fe = max(fwidth(e), 1e-5);
  float wl = .3 * (1. - smoothstep(1.5, 6.8, rho));
  float lace = (1. - smoothstep(-.5, .5, (e - wl) / fe)) * step(.004, wl);
  float a = max(solid, lace) * (1. - smoothstep(6.4, 7.4, vC.y));
  float rimK = solid * (1. - smoothstep(1., 2.2, abs(edge) / frho));
  vec3 col = mix(uPig[3], uPig[5], rimK * .8);
  col = mix(col, uHazeCol, ebHaze(vDist));
  gl_FragColor = vec4(col, a);
}
`,Qe=`
precision highp float;
${pe}
attribute vec4 aK;
attribute vec2 aPerp;
varying vec3 vK;
varying float vDist;
void main(){
  vec3 lp = position;
  float t = aK.x;
  lp.xz += aPerp * (sin(uTime * 1.25 + aK.z + t * 3.1) * .5 + sin(uTime * .53 + aK.z * 1.7) * .3) * t * t;
  vec4 mv0 = viewMatrix * modelMatrix * vec4(lp, 1.);
  lp.y = ebSwell(lp.xz) + .24 + length(mv0.xyz) * .0011 - .12 * t;
  vK = vec3(aK.y, aK.w, t);
  vec4 mv = viewMatrix * modelMatrix * vec4(lp, 1.);
  vDist = length(mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`,et=`
precision highp float;
${he}
varying vec3 vK;
varying float vDist;
void main(){
  float s = abs(vK.x);
  float fs = max(fwidth(vK.x), 1e-5);
  vec3 jade = uPig[2];
  vec3 col = vK.y < .5 ? jade : mix(jade, uPig[0], .35) * .9;
  col = mix(col, mix(jade, uPig[3], .35), step(.86, vK.y));
  float rim = 1. - smoothstep(.6, 1.6, (1. - s) / fs);
  rim = max(rim, (1. - smoothstep(.3, 1.2, s / fs)) * .7);
  col = mix(col, uPig[5], rim * .9 * (1. - smoothstep(.25, .6, fs)));
  col = mix(col, uHazeCol, ebHaze(vDist));
  gl_FragColor = vec4(col, 1.);
}
`;function tt(s,n,o){const y=s.length/2,r=s.thick/2,i=s.height,c=n.range(0,90),m=[],d=4;for(let v=0;v<d;v++)m.push({th:(v+n.range(.15,.85))/d*Math.PI*2,depth:n.range(.16,.3),y0:n.chance(.5)?0:n.range(.1,.4),y1:n.range(.75,1.2),w:n.range(.05,.08)});const g={x:n.range(-1,1)*.05*i,z:n.range(-1,1)*.04*i},u=s.flatTop?.74:n.range(.46,.66),b=n.range(2.2,3.4),h={x:n.range(.07,.19)*n.sign(),z:n.range(-.08,.08)},t=[],w=n.int(2,3);let S=0;for(let v=0;v<w;v++){const A={t:n.range(.24,.86),w:n.range(.5,1),ph:n.range(0,6.28),amp:n.range(.06,.17),lobes:n.int(1,2)};t.push(A),S+=A.w}for(const v of t)v.w*=.86/S;const P=(v,A)=>{let T=.14*A;for(const C of t)T+=C.w*ee(-.03,.03,A-(C.t+C.amp*Math.sin(v*C.lobes+C.ph)));return Math.min(1,T)},O=v=>{const A=Math.cos(v),T=Math.sin(v),C=b;return 1/Math.pow(Math.pow(Math.abs(A)/y,C)+Math.pow(Math.abs(T)/r,C),1/C)*(1+.19*o.n2(A*1.3+c,T*1.3+c*.7)+.07*o.n2(A*3.7-c,T*3.7+c))},B=v=>de(u+(s.flatTop?.08:.2)*o.n2(Math.cos(v)*1.1+c*1.3,Math.sin(v)*1.1-c),.26,.85);return{a:y,b:r,H:i,sd:c,fiss:m,lean:g,dip:h,outline:O,topFrac:B,crown:v=>(s.flatTop?.03:.3)*Math.max(0,.35+o.n2(Math.cos(v)*2.3-c*.6,Math.sin(v)*2.3+c*1.9)),wall:(v,A,T)=>{let C=1-(1-B(v))*P(v,A);C*=1+T;for(const j of m){let I=Math.abs(v-j.th);I>Math.PI&&(I=Math.PI*2-I);const q=ee(j.y0-.06,j.y0+.04,A)*(1-ee(j.y1-.1,j.y1,A));C*=1-j.depth*Math.exp(-(I*I)/(j.w*j.w))*q}return C}}}function at(s,n,o,y){const r=tt(s,o,y),i=s.height;let c=[];const m=44;for(let a=0;a<m;a++)c.push((a+.5)/m*Math.PI*2);for(const a of r.fiss)c.push(a.th-a.w*.9,a.th,a.th+a.w*.9);c=c.map(a=>(a%(Math.PI*2)+Math.PI*2)%(Math.PI*2)).sort((a,p)=>a-p),c.push(c[0]+Math.PI*2);const d=c.length,g=[0];for(let a=1;a<d;a++){const p=r.outline(c[a]);g.push(g[a-1]+(c[a]-c[a-1])*p)}const u=[],b=[[-3.5,1.16,-3],[-.3,1.15,-2.4],[.7,1.13,-2.05],[1,1,-1.95],[1.9,.91,-1.5],[3,.865,-1],[4.1,.92,-.5],[5,1,-.05]];for(const a of b)u.push({y:a[0],kb:a[1]-1,bed:a[2],notch:!0});const h=5.2,t=Math.max(5,Math.round((i-h)/4.3)),w=[];let S=0;for(let a=0;a<t;a++){const p=o.range(.55,1.45);w.push(p),S+=p}let P=h;const O=[];for(let a=0;a<t;a++){const p=P+(i-h)*w[a]/S,M=o.range(-.06,.06)+(a%2?.03:-.03)+(o.chance(.22)?.07:0),z=Math.max(2,Math.round((p-P)/1.5));u.push({y:P+.04,kb:M,bed:a*4,j:a},{y:(P+p)/2,kb:M+.012,bed:a*4+z/2,j:a},{y:p-.04,kb:M-.008,bed:a*4+z-.001,j:a}),O.push({y0:P,y1:p,kb:M}),P=p}const B=[],te=[],X=[],v=n*53,A=(a,p,M,z,D,Z,Y=1,ae=0)=>{const G=de(M/i,0,1);let V=M>0?M*(1-r.crown(a)*ee(.5,1,G))+ae:M,J=r.outline(a)*r.wall(a,G,z)*Y;const oe=r.lean.x*G*G,$=r.lean.z*G*G;let _=Math.cos(a)*J+oe,U=Math.sin(a)*J+$;const se=y.n3(_*.16+r.sd,V*.22,U*.16)*.55+y.n3(_*.5,V*.6+r.sd,U*.5)*.2;J+=se*(Z===1?.3:1),_=Math.cos(a)*J+oe,U=Math.sin(a)*J+$,V+=(_*r.dip.x+U*r.dip.z)*ee(4,15,M),B.push(_,V,U),te.push(D+v,p,G,Z)};for(const a of u)for(let p=0;p<d;p++)A(c[p],g[p],a.y,a.kb+(a.notch?0:.045*y.n2(c[p]*2.2+a.j*17.3,a.j*3.1+r.sd)),a.bed,0);const T=u.length;for(let a=0;a<T-1;a++)for(let p=0;p<d-1;p++){const M=a*d+p,z=M+1,D=M+d,Z=D+1;X.push(M,D,z,z,D,Z)}const C=u[T-1],j=B.length/3;for(let a=0;a<d;a++)A(c[a],g[a],C.y,C.kb,C.bed,1);for(let a=0;a<d;a++)A(c[a],g[a],C.y,C.kb,C.bed,1,.56,(s.flatTop?.5:.09*i)*(.25+1.5*Math.abs(y.n2(c[a]*1.9+r.sd,2.2))));const I=i*(1-r.crown(0)*.5)+(s.flatTop?.9:.06*i);B.push(r.lean.x,I,r.lean.z),te.push(C.bed+v,0,1,1);const q=B.length/3-1;for(let a=0;a<d-1;a++){const p=j+a,M=p+1,z=j+d+a,D=z+1;X.push(p,z,M,M,z,D,z,q,D)}const R=new f.BufferGeometry;return R.setAttribute("position",new f.Float32BufferAttribute(B,3)),R.setAttribute("aRock",new f.Float32BufferAttribute(te,4)),R.setIndex(X),R.computeVertexNormals(),{geometry:R,shape:r,ths:c,us:g,beds:O}}function ot(s,n,o,y){const r=new f.BoxGeometry(1,1,1,3,3,3),i=r.attributes.position,c=[],m=o*s.range(.8,1.5),d=o*s.range(.5,.9),g=o*s.range(.7,1.2),u=s.range(0,50);for(let b=0;b<i.count;b++){let h=i.getX(b),t=i.getY(b),w=i.getZ(b);const S=Math.hypot(h,t,w)||1,P=.3;h=Re(h,h/S*.62,P),t=Re(t,t/S*.62,P),w=Re(w,w/S*.62,P);const O=1+.16*n.n3(h*2.1+u,t*2.1,w*2.1-u);h*=O*m,t*=O*d,w*=O*g,i.setXYZ(b,h+.12*o*t/d,t,w),c.push(y+t/1.4,(h+w)*.8+u,.1,2)}return r.deleteAttribute("uv"),r.setAttribute("aRock",new f.Float32BufferAttribute(c,4)),r.computeVertexNormals(),r}async function st(s,n,o,y,r){const i=[],c=[],m=[],d=[],g=[],u=[],b=[],h=[-1.2,.9,2.7,4.9,7.5];for(let S=0;S<s.length;S++){const P=s[S],{shape:O,ths:B,us:te}=n[S],X=Math.cos(P.yaw),v=Math.sin(P.yaw),A=(q,R)=>[P.x+q*X-R*v,P.z+q*v+R*X],T=i.length/3,C=B.length,j=o.range(0,6.28);for(let q=0;q<h.length;q++)for(let R=0;R<C;R++){const a=O.outline(B[R])*1.14+h[q],p=A(Math.cos(B[R])*a,Math.sin(B[R])*a);i.push(p[0],0,p[1]),c.push(te[R],h[q],j)}for(let q=0;q<h.length-1;q++)for(let R=0;R<C-1;R++){const a=T+q*C+R,p=a+1,M=a+C,z=M+1;m.push(a,p,M,p,z,M)}const I=Math.round((46+P.length*.9)*y);r&&await r();for(let q=0;q<I;q++){r&&q%24===23&&await r();const R=o.range(0,Math.PI*2),a=O.outline(R)*1.16+o.range(0,1.3),p=R+o.range(-.7,.7),M=o.range(2.6,4.6),z=o.range(.8,1.4),D=o.range(0,6.28),Z=o(),Y=A(Math.cos(R)*a,Math.sin(R)*a),ae=[Math.cos(p),Math.sin(p)],G=[ae[0]*X-ae[1]*v,ae[0]*v+ae[1]*X],V=[-G[1],G[0]],J=d.length/3,oe=6;for(let $=0;$<=oe;$++){const _=$/oe,U=z*(1-.8*Math.pow(_,1.6))*(1+.22*Math.sin(_*9+D))*($===0?.6:1),se=Y[0]+G[0]*M*_+V[0]*.25*Math.sin(_*4+D),re=Y[1]+G[1]*M*_+V[1]*.25*Math.sin(_*4+D);for(const K of[-1,1])d.push(se+V[0]*U*.5*K,0,re+V[1]*U*.5*K),g.push(_,K,D,Z),u.push(V[0],V[1]);if($<oe){const K=J+$*2;b.push(K,K+1,K+2,K+1,K+3,K+2)}}}r&&await r()}r&&await r();const t=new f.BufferGeometry;t.setAttribute("position",new f.Float32BufferAttribute(i,3)),t.setAttribute("aCol",new f.Float32BufferAttribute(c,3)),t.setIndex(m),r&&await r();const w=new f.BufferGeometry;return w.setAttribute("position",new f.Float32BufferAttribute(d,3)),w.setAttribute("aK",new f.Float32BufferAttribute(g,4)),w.setAttribute("aPerp",new f.Float32BufferAttribute(u,2)),w.setIndex(b),{collar:t,kelp:w}}const it={navy:0,ground:0,turquoise:1,jade:2,cream:3,ochre:4,black:5,rim:5,slate:6,still:7},Ce=(s,n)=>s==null?n:typeof s=="number"?s:it[s]??n;function nt(){const s=[];let n=0;const o=(i,c,m)=>{const d={type:i,f:{...m,...c}};d.order=c.order??50+n++*.001,s.push(d);const g={fields:d.f,set(u){return Object.assign(d.f,u),g},remove(){const u=s.indexOf(d);u>=0&&s.splice(u,1)}};return g},y={addDrop:(i={})=>o(1,i,{x:0,z:0,r:0,pigment:3,core:0,corePigment:7,lens:0,bandW:0}),addStroke:(i={})=>o(2,i,{x0:0,z0:0,x1:0,z1:0,drag:14,width:7,head:0,tail:12}),addComb:(i={})=>o(3,i,{x:0,z:0,dirX:0,dirZ:-1,drag:6,sharp:.6,spacing:2.4,alternate:!1,sMin:-100,sMax:100,halfWidth:100,feather:.14}),addVortex:(i={})=>o(4,i,{x:0,z:0,angle:0,radius:20}),addShear:(i={})=>o(5,i,{dirX:1,dirZ:0,amp:5,wavelength:300,phase:0}),addGapTines:(i={})=>o(6,i,{x:0,z:0,dirX:0,dirZ:-1,approach:90,runout:50,head:80,tail:30}),addRingField:(i={})=>o(7,i,{x:0,z:0,radius:60,cell:16,maxR:3,period:6,density:.6,pigment:3,phase:0,area:.9,seed:0}),free:()=>ge-s.length,count:()=>s.length,list:s},r=i=>{const c=Math.hypot(i.dirX,i.dirZ)||1;return[i.dirX/c,i.dirZ/c]};return y.pack=(i,c,m)=>{s.sort((d,g)=>d.order-g.order);for(let d=0;d<ge;d++){const g=i[d],u=c[d],b=m[d];g.set(0,0,0,0),u.set(0,0,0,0),b.set(0,0,0,0);const h=s[d];if(!h)continue;const t=h.f;if(h.type===1){if(!(t.r>.02))continue;g.set(t.x,t.z,t.r,de(t.core,0,.995)),u.set(Ce(t.pigment,3),Ce(t.corePigment,7),t.lens||0,0),b.set(t.bandW||0,0,0,1)}else if(h.type===2){const w=t.x1-t.x0,S=t.z1-t.z0,P=Math.hypot(w,S);if(P<.5)continue;g.set(t.x0,t.z0,w/P,S/P),u.set(t.drag,Math.max(t.width,.05),P,Math.max(t.head||0,1.7*Math.abs(t.drag),4)),b.set(Math.max(t.tail,.5),0,0,2)}else if(h.type===3){const w=r(t);g.set(t.x,t.z,w[0],w[1]),u.set(t.drag,Math.max(t.sharp,.02),Math.max(t.spacing,.1)*(t.alternate?-1:1),de(t.feather,.01,.5)),b.set(t.sMin,Math.max(t.sMax,t.sMin+1),Math.max(t.halfWidth,1),3)}else if(h.type===4)g.set(t.x,t.z,t.angle,Math.max(t.radius,.1)),b.w=4;else if(h.type===5){const w=r(t);g.set(w[0],w[1],t.amp,2*Math.PI/Math.max(t.wavelength,1)),u.x=t.phase,b.w=5}else if(h.type===6){const w=r(t);g.set(t.x,t.z,w[0],w[1]),u.set(t.approach,t.runout,Math.max(t.head,1),Math.max(t.tail,.5)),b.w=6}else h.type===7&&(g.set(t.x,t.z,t.radius,Math.max(t.cell,.5)),u.set(t.maxR,Math.max(t.period,.1),t.density,Ce(t.pigment,3)),b.set(t.phase,t.area,t.seed,7))}},y}function lt(s){const n=Math.round(200*(.5+.5*s)),o=Math.round(150*(.5+.5*s)),y=new Float32Array((o+1)*n*3),r=new Uint32Array(o*n*6);let i=0;for(let m=0;m<=o;m++){const d=m/o,g=3200*(.02*d+.98*Math.pow(d,3.6));for(let u=0;u<n;u++){const b=(u+(m&1)*.5)/n*Math.PI*2,h=(m*n+u)*3;y[h]=Math.cos(b)*g,y[h+1]=0,y[h+2]=Math.sin(b)*g}}for(let m=0;m<o;m++)for(let d=0;d<n;d++){const g=(d+1)%n,u=m*n+d,b=m*n+g,h=(m+1)*n+d,t=(m+1)*n+g;m&1?(r[i++]=u,r[i++]=h,r[i++]=b,r[i++]=b,r[i++]=h,r[i++]=t):(r[i++]=u,r[i++]=t,r[i++]=b,r[i++]=u,r[i++]=h,r[i++]=t)}const c=new f.BufferGeometry;return c.setAttribute("position",new f.BufferAttribute(y,3)),c.setIndex(new f.BufferAttribute(r,1)),c}const rt=[[153,32,269],[107,32,230],[62,27,183],[28,19,127],[7,11,65],[0,6,0],[0,3,-75],[0,5,-200],[0,7,-330],[0,14,-365],[0,40,-425],[0,62,-472],[0,68,-492],[0,64,-508],[0,53.6,-520],[0,4.5,-554.4]];async function ht(s,n={}){const o=s.rng,y=s.noise,r=s.quality?.detail??1,i=(e,l,x)=>new f.Vector3(e,l,x),c=Le(n.palette,n.hazeColor);n.sunDir&&c.uSunDir.value.copy(n.sunDir).normalize();const m=new f.Group;m.name="combed-sea-hero";const d=o.chance(.5)?1:-1,g=n.arms??(o.chance(.65)?2:3),u=o.range(2.3,2.7),b=110,h=(e,l)=>{const x=e*Math.PI/180;return[F.x+l*Math.sin(x),F.z-l*Math.cos(x)]},t=h(o.range(118,128),o.range(235,255)),w=o.chance(.5)?h(o.range(56,68),o.range(215,235)):h(o.range(292,304),o.range(215,235)),S=[{x:t[0],z:t[1],r:40},{x:w[0],z:w[1],r:25}],P=[34,41,30,47,60,52,38,44,31],O=[];for(let e=0;e<8;e++)O.push(e===4?46:o.range(16,28));const B=P.map((e,l)=>l===4?o.range(37,44):l===5?o.range(35,42):o.range(27,41)),te=B.reduce((e,l)=>e+l,0),X=O.reduce((e,l)=>e+l,0),v=(520-X)/te,A=Math.hypot(0-F.x,-330-F.z),T=Math.atan2(0-F.x,-(-330-F.z)),C=o.int(0,3),j=o.int(6,8),I=new Array(9);{let e=-23;for(let l=4;l>=0;l--){const x=B[l]*v;I[l]=e-x/2,e-=x+(l>0?O[l-1]:0)}}{let e=23;for(let l=5;l<9;l++){const x=B[l]*v;I[l]=e+x/2,e+=x+(l<8?O[l]:0)}}const q=e=>{const l=T+e/A;return{x:F.x+A*Math.sin(l),z:F.z-A*Math.cos(l),yaw:l}},R=P.map((e,l)=>{const x=q(I[l]),N=B[l]*v,k=Math.min(N*.82,l===4||l===5?o.range(23,28):o.range(16,26));return{x:x.x,z:x.z,yaw:x.yaw,length:N,thick:k,height:e,flatTop:l===C||l===j}}),a=[];for(let e=0;e<8;e++){const l=e===4?0:(I[e]+B[e]*v/2+I[e+1]-B[e+1]*v/2)/2,x=q(l);a.push({x:x.x,z:x.z,width:O[e],drag:e===4?38:o.range(24,32)})}const p=nt(),M=()=>Array.from({length:ge},()=>new f.Vector4),z={...c,uOpA:{value:M()},uOpB:{value:M()},uOpC:{value:M()},uGap:{value:a.map(e=>new f.Vector4(-e.x,-(e.z+330),e.width*.38,e.drag))},uEddy:{value:new f.Vector4(F.x,F.z,F.r,g)},uSat:{value:[new f.Vector4(0,0,40,0),new f.Vector4(0,0,25,0)]},uRain:{value:new f.Vector4(60,50,n.rain===!1?0:.5,0)},uCamL:{value:i(0,30,0)},uSnap:{value:new f.Vector2},uHi:{value:1},uHiCol:{value:new f.Color(1.25,1.19,1.02)},uGlow:{value:0},uField:{value:new f.Vector4(A+13,262,-722,0)},uRank:{value:new f.Vector2(14,Math.floor(u*37)+.5)},uSeed:{value:Math.floor(o.range(3,60))+.37},uDetail:{value:r>=.7?1:0}},D={};n.rain!==!1&&(D.RAIN=1),r>=.7&&(D.LACE=1);const Z=new f.ShaderMaterial({defines:D,uniforms:z,vertexShader:Ge,fragmentShader:_e,side:f.DoubleSide,fog:!1});await s.yield?.();const Y=new f.Mesh(lt(r),Z);Y.frustumCulled=!1,Y.name="ebru-sea",m.add(Y),await s.yield?.();const ae=p.addVortex({x:F.x,z:F.z,angle:0,radius:b,order:0}),G=S.map((e,l)=>p.addVortex({x:e.x,z:e.z,angle:0,radius:e.r/2.5,order:1+l})),V=p.addShear({dirX:1,dirZ:0,amp:6,wavelength:420,phase:0,order:3}),J=p.addShear({dirX:0,dirZ:1,amp:5,wavelength:310,phase:1,order:4}),oe=o.range(6.6,7.4),$=p.addComb({x:0,z:-420,dirX:1,dirZ:0,drag:12,sharp:4,spacing:oe,alternate:!0,sMin:-640,sMax:640,halfWidth:310,feather:.3,order:10}),_=p.addGapTines({x:0,z:-330,dirX:0,dirZ:-1,approach:95,runout:55,head:85,tail:35,order:11}),U=p.addComb({x:0,z:-316,dirX:0,dirZ:-1,drag:7,sharp:.8,spacing:o.range(2.4,2.6),alternate:!1,sMin:0,sMax:425,halfWidth:360,feather:.1,order:12}),se=4,re=2,K=n.ring===!1?null:p.addDrop({x:ve.x,z:ve.z,r:22+se*re,pigment:3,core:.78,corePigment:7,bandW:re,order:100}),me=[];let xe=null,be=null,we=null;if(n.skerries!==!1){const e=[];for(let L=0;L<9;L++){const E=R[L],Q=at(E,L,o,y);me.push(Q);const ue=new f.Matrix4().makeRotationY(-E.yaw).setPosition(E.x,0,E.z);Q.geometry.applyMatrix4(ue),e.push(Q.geometry);const ke=Math.cos(E.yaw),Se=Math.sin(E.yaw);E.toWorld=(ie,fe,ne)=>i(E.x+ie*ke-ne*Se,fe,E.z+ie*Se+ne*ke),E.top=E.toWorld(Q.shape.lean.x,E.height,Q.shape.lean.z);const Te=o.int(4,7);for(let ie=0;ie<Te;ie++){const fe=o.range(0,Math.PI*2),ne=o.range(2.4,5.6),qe=Q.shape.outline(fe)*1.13+ne*o.range(.2,.9),le=E.toWorld(Math.cos(fe)*qe,ne*o.range(-.12,.2),Math.sin(fe)*qe);if(Math.abs(le.x)<31&&le.z<-250&&le.z>-420)continue;const Fe=ot(o,y,ne,L*53+20+ie*3);Fe.applyMatrix4(new f.Matrix4().makeRotationFromEuler(new f.Euler(o.range(-.35,.35),o.range(0,6.28),o.range(-.35,.35))).setPosition(le.x,le.y,le.z)),e.push(Fe)}await s.yield?.()}const l=Ie(e,!1);e.forEach(L=>L.dispose()),await s.yield?.(),xe=Be({shared:c,spots:.34,spotCell:2.3,spotCream:.5,outline:.7,vertDecl:Xe,vertMain:Ze,fragDecl:$e,fragPigment:Ue});const x=new f.Mesh(l,xe);x.name="skerries",m.add(x),await s.yield?.();const N=await st(R,me,o,r,s.yield?()=>s.yield():null);await s.yield?.();const k={uPig:c.uPig,uHazeCol:c.uHazeCol,uHaze:c.uHaze,uTime:c.uTime,uSwell:c.uSwell};we=new f.ShaderMaterial({uniforms:k,vertexShader:Qe,fragmentShader:et,side:f.DoubleSide,fog:!1});const H=new f.Mesh(N.kelp,we);H.frustumCulled=!1,H.name="kelp-fringe",m.add(H),be=new f.ShaderMaterial({uniforms:k,vertexShader:Ye,fragmentShader:Je,side:f.DoubleSide,transparent:!0,depthWrite:!1,fog:!1});const W=new f.Mesh(N.collar,be);W.frustumCulled=!1,W.renderOrder=1,W.name="foam-collars",m.add(W),await s.yield?.()}let Me=0,ye=null,ze=null;const He=()=>{if(ye!=null)return ye;if(ze==null)return 44;const e=ze;return 30*ee(.45,.64,e)+10*ee(.64,.8,e)+4*ee(.88,.93,e)},Ee=c.uSwell.value,Oe=(e,l,x=Me)=>{let N=0;for(let k=0;k<3;k++){const H=Ee[k];N+=H.w*Math.sin((e*H.x+l*H.y)*H.z-Math.sqrt(9.81*H.z)*x+k*1.7)}return N},ce=new f.Vector3,Pe=e=>{const l=Math.min(e,150),x=d*(u*Math.PI*2+.0349*l);ae.fields.angle=x;for(let k=0;k<S.length;k++){const H=S[k];G[k].fields.angle=-d*(5.5+.09*l);const W=H.x-F.x,L=H.z-F.z,E=-x*Math.exp(-Math.hypot(W,L)/b),Q=Math.cos(E),ue=Math.sin(E);z.uSat.value[k].set(F.x+Q*W-ue*L,F.z+ue*W+Q*L,H.r,0)}V.fields.phase=e*.05,J.fields.phase=1+e*.06,$.fields.drag=12+1.5*Math.sin(e*.31),U.fields.drag=7+.7*Math.sin(e*.37),z.uField.value.w=e*.5;const N=1+.07*Math.sin(e*.42)+.1*l/150;for(let k=0;k<a.length;k++)z.uGap.value[k].w=a[k].drag*N;if(K){const k=He()/2,H=re*ee(1,8,k),W=k+se*H,L=K.fields;L.r=W,L.core=W>.02?k/W:0,L.bandW=H}p.pack(z.uOpA.value,z.uOpB.value,z.uOpC.value)};Pe(0);const De=[R[4],R[5]],Ae=[];if(me.length)for(const e of[4,5]){const l=R[e],x=me[e];x.beds.forEach((N,k)=>{if(!(N.y1<l.height*.3||k%2))for(let H=0;H<3;H++){const W=o.range(0,Math.PI*2),L=N.y1/l.height,E=x.shape.outline(W)*x.shape.wall(W,L,N.kb)+.4;Ae.push(l.toWorld(Math.cos(W)*E+x.shape.lean.x*L*L,N.y1+.2,Math.sin(W)*E+x.shape.lean.z*L*L))}})}const We=i(0,53.6-4.5,-520+554.4).normalize(),je={portalSeat:{position:i(0,4.5,-554.4),normal:We,radius:7,ringCentre:i(ve.x,0,ve.z)},flyThrough:rt.map(e=>i(e[0],e[1],e[2])),gap:i(0,0,-330),gapWidth:46,eddyCentre:i(F.x,0,F.z),eddyRadius:F.r,eddySense:d,satellites:S.map(e=>({position:i(e.x,0,e.z),radius:e.r})),rowCentre:i(F.x,0,F.z),rowRadius:A,gaps:a.map(e=>({position:i(e.x,0,e.z),width:e.width})),greatStacks:De.map(e=>e.top?e.top.clone():i(e.x,e.height,e.z)),ledges:Ae,field:{centre:i(0,0,-480),width:500,depth:250},viewpoints:{entry:i(153,32,269),overEddy:i(60,150,190),raceApproach:i(0,6,-200),overField:i(0,68,-492)}};return{object:m,radius:80,height:70,center:i(0,10,-330),anchors:je,ground:!1,groundY:0,ops:p,uniforms:c,seaUniforms:z,stacks:R,heightAt:Oe,materials:{sea:Z,rock:xe,collar:be,kelp:we},kit:{styleMaterial:Be,EBRU_GLSL:he,SWELL_GLSL:pe},setProgress(e){ze=de(e,0,1)},setRing(e){ye=e},setRain(e=60,l=50,x=.5){z.uRain.value.x=e,z.uRain.value.y=Math.max(l,1),z.uRain.value.z=x},setSun(e){c.uSunDir.value.copy(e).normalize()},setHighlight(e,l){z.uHi.value=e,l!=null&&z.uHiCol.value.copy(l)},setGlow(e){z.uGlow.value=e},setHaze(e,l){e!=null&&c.uHazeCol.value.set(e),l!=null&&(c.uHaze.value.z=l)},enableLens(e){Z.transparent=!!e,Y.renderOrder=e?-.5:0,Z.needsUpdate=!0},update(e,l,x){Me=l,c.uTime.value=l,x&&(m.updateMatrixWorld(),x.getWorldPosition(ce),m.worldToLocal(ce),z.uCamL.value.copy(ce),z.uSnap.value.set(ce.x,ce.z)),Pe(l)},dispose(){}}}export{he as EBRU_GLSL,pe as SWELL_GLSL,ht as buildHero,Be as styleMaterial};
