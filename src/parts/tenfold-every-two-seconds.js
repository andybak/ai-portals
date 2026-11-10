import*as s from"three";const N=Math.PI/180,M=Math.PI*2,fe=h=>Math.min(1,Math.max(0,h)),p=(h,d,i)=>{const S=fe((i-h)/(d-h));return S*S*(3-2*S)},q=(h,d,i)=>h+(d-h)*i,jt=h=>h-Math.floor(h),J=31557600,Le={surf:8,cloud:1800,tide:44712,day:86400,moon:27.3*86400,year:J,dune:30*J,river:1e3*J,ice:1e5*J,shore:2e6*J,range:6e7*J},yo=.9082,xo=87e7*J,bo=17e8*J,So=h=>h<.7?p(0,.7,h):1-p(.7,1,h);function ko(h,d=0,i={ph:{},sw:{},f:{}}){const S=45*yo,K=h>=S,C=Math.min(h,S)/2-3,R=K?1:Math.pow(10,C),x=.8686*(Math.pow(10,C)-.001)+(K?d:0);i.t=h,i.k=C,i.rate=R,i.T=x,i.stopped=K,i.real=K?d:0,i.Tb=Math.min(x,2);for(const L in Le){const j=Le[L];i.ph[L]=jt(x/j),i.f[L]=R/j,i.sw[L]=1-p(1,2,i.f[L])}return i.wet=1-p(xo,bo,x),i.gyr=x/(1e9*J),i.glacial=So(i.ph.ice),i}function Mo(h){const d=(i,S)=>new s.Vector3(Math.cos(S*N)*Math.cos((i-315)*N),Math.sin(S*N),Math.cos(S*N)*Math.sin((i-315)*N));return{P:d(0,h),M:d(180,90-h),E:d(90,0),az:d}}function gt(h,d,i,S=new s.Vector3){const K=Math.sin(d),U=Math.cos(d);return S.copy(h.P).multiplyScalar(K).addScaledVector(h.M,U*Math.cos(i)).addScaledVector(h.E,-U*Math.sin(i))}const Xe=`
uniform sampler2D uHt, uCl, uNz;
uniform vec3 uCam, uKeyDir, uKeyCol, uAmbSky, uAmbGnd, uFogCol, uSunDir, uPole, uMer, uEast, uBandCol, uSkyZen, uSkyHor, uGlowCol, uDiscCol;
uniform float uTb, uPhSurf, uSwSurf, uPhCloud, uSwCloud, uPhDune, uSwDune, uRiverA, uRiverSpit, uSwRiver, uShore, uIceG, uIceR, uIceMean,
  uPhRange, uSwRange, uSnowLine, uSwYear, uWet, uSea, uSalt, uHardKey, uSwDay, uSinDs, uBandHalf, uDiscR, uDiscI, uMoonD, uSwMoon,
  uMoonI, uNight, uStarRot, uReal, uIsland, uIsleHot, uMirror, uForest, uKeyOn, uRangeMean, uTwi, uLook, uMoonLit;
uniform vec3 uGal;
uniform vec4 uLogs[7];
uniform vec3 uLogTip[7];
`,wt=`
// The coast runs straight beside the path and then bends away to the sea side in a long bay, so that from the beach the
// land lies AHEAD as well as beside us. inl() is the distance inland from that shore line (at mean tide, before any shift).
float bend(float x) { return 1250. * smoothstep(700., 3000., x); }
float inl(vec2 p) { return p.y + bend(p.x); }
// The range. Its crests are long lines lying ACROSS the view (their axis 60 degrees off the heading), rank behind rank,
// each further rank standing higher, so that from the beach five skylines are seen one above another: swell seen from a
// beach. They roll toward the eye and the beach (toward -RNX). RORG is where the eye is when the range has its turn.
const vec2 RNX = vec2(0.866, 0.5);              // across the crests, pointing away from the eye and inland
const vec2 RAX = vec2(0.5, -0.866);
const vec2 RORG = vec2(365., 0.);
const float RLAM = 640.;                        // one crest every 640 m, one crest per period
float rangeW(vec2 p) { return inl(p) - 70.; }
const vec2 APEX = vec2(480., 200.);
float rangeEnv(vec2 p) {
  float a = dot(p - RORG, RNX), b = dot(p - RORG, RAX);
  float aa = max(a - 60., 0.);
  // each rank is born behind the highest one, climbs as it comes, and sinks into the plain behind the beach. The
  // envelope grows by the square of the distance, so seen from the beach every rank's brow stands a clear step above
  // the brow in front (about four degrees each): five skylines, and a brow that comes nearer is seen to come DOWN.
  float e = (1.26e-4 * aa * aa + 0.09 * aa) * (1. - smoothstep(3900., 6200., a));
  e *= 0.78 + 0.5 * textureLod(uNz, vec2(b / 7000., 0.21), 0.).r;          // spurs and saddles that stay put: the whaleback keeps them
  e *= mix(0.4, 1., smoothstep(250., 520., length((p - vec2(480., 90.)) * vec2(1., 1.6))));         // across the delta the rollers are only low swells in the sand
  return e * smoothstep(-20., 170., rangeW(p)) * smoothstep(-700., 200., p.y);   // its time average is this: one long whaleback
}
// peaks and cols along each crest, riding with it
float rangePk(float a, float b) { return 0.42 + 0.72 * textureLod(uNz, vec2(b / 8000., a / 10000.) + 0.23, 0.).r + 0.5 * textureLod(uNz, vec2(b / 3600., a / 7000.) + 0.71, 0.).r; }
// every crest line wanders as it runs (no rank is a ruled band), and the wander rides with it
float rangeA(float a, float b) { return a + 420. * (textureLod(uNz, vec2(b / 22000., a / 30000.) + 0.47, 0.).r - 0.5); }   // (long bends only: nothing finer than 340 m, so no chevrons)   // (no feature finer than four grid cells: a summit crossing the grid never boils)
float rangeTex(vec2 p, float scroll, float det) {
  float b = dot(p - RORG, RAX), a = rangeA(dot(p - RORG, RNX) + scroll, b);
  vec2 q = vec2(a / RLAM, b / 9000.);
  float h1 = textureLod(uHt, q, 0.).r;
  float h2 = textureLod(uHt, q * vec2(2., 1.7) + vec2(0.31, 0.17), 0.).r;
  float h = (0.88 * h1 * (0.5 + 0.5 * h1) + 0.12 * h2 * (0.3 + 0.7 * h1)) * rangePk(a, b);
#ifdef DETAIL
  // shading only (the grid cannot hold these, so they are in the fragment's normals and never in the silhouette):
  // buttresses and gullies running down the faces and a fine ridged grain, all riding with the crest they belong to
  if (det > 0.) {
  float fd = 1. - smoothstep(3000., 7000., distance(p, uCam.xz));
  float g1 = textureLod(uHt, vec2(b / 1500. + 0.25 * h1, a / 5200.) + 0.11, 0.).r;
  float g2 = textureLod(uHt, vec2(b / 520. + 0.4 * h1, a / 3100.) + 0.47, 0.).r;
  float h3 = textureLod(uNz, vec2(a, b) / 260., 0.).r;
  float mid = 0.3 + 2.8 * h1 * (1. - h1);                          // the faces are fluted; brow and trough are smooth
  h += det * fd * mid * (0.16 * (g1 - 0.4) + 0.05 * (g2 - 0.4) + 0.035 * (h3 - 0.5));
  }
#endif
  return h;
}
// where a point stands on its own swell: x = 0 in the trough, 1 on the brow; y = which side of its buttress it is on
// (1 = the side turned to the key, 0 = the side turned away); z = the swell's raw height, 0..0.9
vec3 rangeRel(vec2 p, float scroll) {
  float b = dot(p - RORG, RAX), a = rangeA(dot(p - RORG, RNX) + scroll, b);
  float h1 = textureLod(uHt, vec2(a / RLAM, b / 9000.), 0.).r;
  float wv = 0.2 * h1 + 0.5 * textureLod(uNz, vec2(b / 2100., a / 1300.) + 0.61, 0.).r;      // the buttresses lean and wander: no two alike
  float gA = textureLod(uHt, vec2((b + 55.) / 1500. + wv, a / 5200.) + 0.11, 0.).r + 0.3 * textureLod(uHt, vec2((b + 55.) / 520. + 1.3 * wv, a / 3100.) + 0.47, 0.).r;
  float gB = textureLod(uHt, vec2((b - 55.) / 1500. + wv, a / 5200.) + 0.11, 0.).r + 0.3 * textureLod(uHt, vec2((b - 55.) / 520. + 1.3 * wv, a / 3100.) + 0.47, 0.).r;
  return vec3(clamp(h1 * (0.5 + 0.5 * h1) / 0.8, 0., 1.), 1. - smoothstep(0.02, 0.11, gA - gB), h1);
}
float rangeOnly(vec2 q) { return rangeEnv(q) * rangeTex(q, uPhRange * RLAM, 0.); }
// coast profile against zc = z - shoreline shift: sea bed, beach 1 in 20, a dune ridge, the plain
float coast(float zc) {
  float bed = -120. * (1. - exp(min(zc - 25., 0.) / 1300.));
  float beach = (zc - 25.) / 20.;
  float up = 3.2 + 14. * smoothstep(120., 1500., zc) + 1.6 * smoothstep(60., 110., zc);
  float land = min(beach, up);
  return zc < 25. ? max(bed, beach) : land;
}
// Crescent dunes in four rows behind the beach, marching down the coast (-x, toward the eye), each row half a step out
// with its neighbours: long windward backs, short slip faces, horns ahead. Their time average is four low even ridges.
const float DLAM = 72., DROW = 62.;
float gChanW = 0., gChanM = 0.;                  // set by fanH: how near the river's bed is (the dunes stand back from it; its banks are long slopes)
float duneBand(float zc) { return smoothstep(36., 50., zc) * (1. - smoothstep(270., 292., zc)); }
vec3 duneQ(vec2 p, float zc) {                   // x: phase along the march (crest at 0.78); y: the row's lump, 0 at its edges, 1 on its axis; z: row
  float row = (zc + 7. * sin(p.x * 0.011) - 40.) / DROW, ri = floor(row), zl = fract(row) * 2. - 1.;
  float lump = 1. - zl * zl;
  float s = fract(-p.x / DLAM - uPhDune + 0.5 * ri + 0.37 * fract(ri * 0.618 + 0.2) + 0.3 * lump + 0.05 * sin(p.x * 0.013 + ri));
  return vec3(s, lump * lump, ri);
}
float duneH(vec2 p, float zc) {
  vec3 q = duneQ(p, zc);
  float crest = q.x < 0.78 ? q.x / 0.78 : (1. - q.x) / 0.22;
  crest = crest * crest * (3. - 2. * crest);
  return duneBand(zc) * q.y * 7.5 * (uSwDune * crest + (1. - uSwDune) * 0.5);
}
// the delta: a low cone about the river's apex; the live channel points along uRiverA and a spit stands where it just was
const vec2 ISLE = vec2(1000., -390.);
float fanH(vec2 p, out float chan) {
  vec2 d = p - APEX; float r = length(d);
  float ang = atan(d.x, -d.y + 1e-4);                           // 0 = straight to sea, + toward +x
  float fan = 8. * (1. - smoothstep(40., 430., r)) * smoothstep(-0.25, 0.35, -d.y / max(r, 70.));
  // the live channel: a ribbon from the apex along uRiverA, in two threads that part and rejoin; measured in metres from
  // its own centre line, so its banks are smooth slopes several cells wide everywhere, the apex included
  vec2 ca = vec2(sin(uRiverA), -cos(uRiverA));
  float al = dot(d, ca), pe = dot(d, vec2(-ca.y, ca.x));
  float m1 = 15. * sin(al * 0.021 + uRiverA * 3.) * smoothstep(40., 160., al);
  float m2 = 34. * sin(al * 0.0125 + 1.2 - uRiverA * 2.) * smoothstep(60., 200., al);
  float w1 = 12. + 0.03 * max(al, 0.), w2 = 7. + 0.016 * max(al, 0.);
  float e1 = (pe - m1) / w1, e2 = (pe - m2) / w2;
  float along = smoothstep(-45., 30., al) * (1. - smoothstep(380., 560., al));
  float t2 = smoothstep(40., 240., al);
  float c1 = exp(-e1 * e1), c2 = 0.85 * exp(-e2 * e2) * t2;
  chan = uSwRiver * along * (c1 + c2 - c1 * c2);
  c1 = exp(-e1 * e1 / 7.); c2 = exp(-e2 * e2 / 9.) * t2;
  gChanW = uSwRiver * along * (c1 + c2 - c1 * c2);
  c1 = exp(-e1 * e1 / 2.6); c2 = exp(-e2 * e2 / 2.6) * t2;
  gChanM = uSwRiver * along * (c1 + c2 - c1 * c2);
  // the feeder: one fixed reach from the hills down to the apex
  float fd = (d.x - 30. * sin(d.y * 0.012)) / 26.;
  chan = max(chan, uWet * exp(-fd * fd) * smoothstep(-30., 25., d.y) * (1. - smoothstep(250., 420., d.y)));
  gChanW = max(gChanW, uWet * exp(-fd * fd / 6.) * smoothstep(-60., 25., d.y) * (1. - smoothstep(250., 420., d.y)));
  gChanM = max(gChanM, uWet * exp(-fd * fd / 2.6) * smoothstep(-40., 25., d.y) * (1. - smoothstep(250., 420., d.y)));
  float ds = ang - (uRiverA - uRiverSpit * 0.16);
  float spit = uSwRiver * abs(uRiverSpit) * 2.4 * exp(-ds * ds / 0.012) * smoothstep(200., 300., r) * (1. - smoothstep(330., 430., r));
  return fan + spit;
}
// the ice sheet: a lobed front, a 100 m cliff, and behind it a dome climbing by the square root of the distance
float iceFront(vec2 p) {
  return mix(2700., 150., uIceR) + 150. * (textureLod(uHt, vec2(p.x / 1700. + 0.2, 0.37), 0.).r - 0.45)
    + 60. * (textureLod(uNz, vec2(p.x / 1100., 0.63), 0.).r - 0.5);
}
float iceSurf(vec2 p) {
  float d = inl(p) - iceFront(p);
  float s = 104. * smoothstep(0., 42., d) + 15. * sqrt(max(d, 0.)) + 10. * textureLod(uNz, p / 900., 0.).r * smoothstep(40., 240., d) - 6.;
  s = d > 0. ? s : max(-6. + 1.5 * d, -400.);
  return mix(-400., s, smoothstep(0., 0.07, uIceG));
}
// rock and sand only (no ice)
float groundH(vec2 p) {
  float zc = inl(p) - uShore;
  float h = coast(zc);
  float chan; float fan = fanH(p, chan);
  h += duneH(p, zc) * (1. - smoothstep(0.04, 0.7, gChanW));
  h += fan;
  float env = rangeEnv(p);
  h += env * (uSwRange * rangeTex(p, uPhRange * RLAM, 1.) + (1. - uSwRange) * uRangeMean);
  h = mix(h, min(h, -0.7), smoothstep(0.1, 0.95, gChanM));            // long gentle banks, many cells wide: the water's edge is never a wall (the river cuts through whatever rolls past)
  vec2 dk = p - vec2(450., 0.); h -= 9. * exp(-dot(dk, dk) / 900.);     // the scour hollow the stack stands in: a pool at its foot
  // the rare island: built out of the sea on the left and worn back to a shoal
  vec2 di = p - ISLE; float ri = length(di);
  h += uIsland * (330. * exp(-ri / 150.) * (0.8 + 0.2 * textureLod(uNz, di / 700. + 0.5, 0.).r) - 70. * exp(-ri * ri / 1800.));   // a cone with concave flanks and a crater
  float near = (1. - smoothstep(26., 60., abs(p.y))) * (1. - smoothstep(470., 560., p.x));   // the path's corridor, and no further than the ring
  h = mix(h, min(h, 27.), near);
  return h;
}
float landH(vec2 p) { return max(groundH(p), iceSurf(p)); }
// the stack (exempt from the law) as the sea, the wet sand and the ground see it: does a ray from o along d meet a column
// 9 m in radius whose top is at 31 m?
const vec2 STK = vec2(450., 0.);
float stackHit(vec3 o, vec3 d) {
  vec2 oc = o.xz - STK; float dl = max(length(d.xz), 1e-4); vec2 dn = d.xz / dl;
  float tb = -dot(oc, dn);
  float d2 = dot(oc, oc) - tb * tb;
  float y = o.y + d.y / dl * max(tb, 0.);
  return step(0., tb) * (1. - smoothstep(55., 100., d2)) * (1. - smoothstep(24., 33., y));
}
vec3 stackTone() { return vec3(0.2, 0.22, 0.26) * (uAmbSky * 1.9 + vec3(0.14, 0.2, 0.42) * clamp(dot(uAmbSky, vec3(0.9)) + 0.05, 0.06, 1.) + uKeyCol * uKeyOn * 0.3) * 0.3183; }
// cloud shadows: nine blobs to a tile, carried one tile per cloud period in off the sea; their average is a thin even veil
float cloudCover(vec2 p) {
  float cl = textureLod(uCl, vec2(p.x / 350. + uPhCloud, p.y / 250. - uPhCloud), 0.).r;
  // far off, only the big clouds' shadows are seen: broad shapes draped over dune and ridge, never a rash of spots
  float cb = textureLod(uCl, vec2(p.x / 2900. + uPhCloud + 0.37, p.y / 2100. - uPhCloud + 0.11), 0.).r;
  return mix(smoothstep(0.45, 0.62, cl), smoothstep(0.45, 0.62, cb), smoothstep(300., 1300., distance(p, uCam.xz)));
}
float cloudShade(vec2 p) { return 1. - uWet * (uSwCloud * 0.86 * cloudCover(p) + (1. - uSwCloud) * 0.12); }
float cloudShadeH(vec2 p, float h) { return cloudShade(p); }
float fogAmt(vec3 wp) {
  float d = distance(wp, uCam);
  return 1. - exp(-d * 3.1e-4 * (0.26 + 1.34 * exp(-max(wp.y, 0.) / 190.)));
}
`,yt=`
float gRefl = 0.;          // 1 while a mirror (the sea, wet sand) is asking: the band's streak is then one gold, not a spectrum
vec3 sunTerm(vec3 d, float w, out float cover) {
  float D = asin(clamp(dot(d, uPole), -1., 1.));
  float Ds = asin(clamp(uSinDs, -1., 1.));
  float a = (D - Ds) / w; float arc = exp(-a * a);
  // the year's true average: brightness goes as 1 / sqrt(1 - x^2), so the band is dim in the middle and bright at both
  // edges, where the sun lingers at the solstices
  float x = D / uBandHalf;
  float inb = 1. - smoothstep(mix(0.965, 0.94, gRefl), mix(1.06, 1.14, gRefl), abs(x));   // a soft limb (a breath softer in a mirror): never a ruled edge
  float band = inb * min(inversesqrt(max(1. - x * x, 0.03)), 5.5);    // the mirror asks this same function: the streak on the sea is the band itself
  float md = 1. - uSwDay, my = 1. - uSwYear;
  float hor = smoothstep(-0.004, 0.02, d.y);
  cover = md * my * inb * 0.92 * hor;                                // a body of light: solid gold, the sky does not show through it
  float qd = acos(clamp(dot(d, uSunDir), -1., 1.)) / uDiscR;
  cover = max(cover, smoothstep(0.05, 0.2, uDiscR) * (1. - smoothstep(0.985, 1., qd)) * 0.85 * hor);
  float ox = max(abs(x) - 1., 0.) * uBandHalf;                       // radians outside the nearer edge
  // The year's sun: a solid gold body whose light climbs by the true 1 / sqrt law from its dim heart to each solstice
  // rail (gold all the way: the rails are only a breath paler, so the highlight keeps its hue). Outside each rail the
  // air itself is lit (a wide aureole), and where the band stands on the horizon it sets the haze glowing the way a low
  // sun does. Lower down it is seen through more air: warmer and a little dimmer.
  vec3 hi = vec3(max(uBandCol.r, max(uBandCol.g, uBandCol.b))) * vec3(1., 0.93, 0.78);
  float Lb = clamp(0.64 * band, 0.64, 2.4);                          // (the body stays under the bloom's threshold: only the rails glow, and no veil is thrown over the land)
  float edgeK = (Lb - 0.64) / 1.76;
  vec3 bcol = mix(uBandCol, hi, 0.1 + 0.15 * edgeK) * Lb;
  float up = max(d.y, 0.);
  float lift = 0.74 + 0.26 * smoothstep(0., 0.3, up);
  vec3 airT = mix(vec3(1., 0.7, 0.46), vec3(1.), smoothstep(0., 0.4, up));
  vec3 halo = uBandCol * (0.6 * exp(-ox * 16.) + 0.14 * exp(-ox * 4.5)) * (1. - inb) * (1. - 0.7 * gRefl);   // (a mirror keeps the band and lets most of its aureole go: one gold streak on a dark sea)
  vec3 glowH = mix(vec3(1., 0.46, 0.2), uBandCol, 0.45) * 0.55 * exp(-up * 13.) * exp(-ox * 3.2) * (1. - 0.6 * inb) * (1. - 0.6 * gRefl);
  vec3 c = md * (uBandCol * uSwYear * arc * 2.4 + my * (lift * airT * (bcol * inb + halo) + glowH));
  float am = (D - uMoonD) / (w * 0.8); float xm = D / 0.489;
  float mband = (1. - smoothstep(0.97, 1.08, abs(xm))) * min(inversesqrt(max(1. - xm * xm, 0.05)), 2.2);
  c += vec3(0.81, 0.85, 0.9) * md * uMoonI * (uSwMoon * exp(-am * am) * 0.3 + (1. - uSwMoon) * mband * 0.08 * (1. - 0.85 * inb * my) * (1. - 0.6 * gRefl));   // its own average: a faint silver margin just outside each gold edge
  // the disc: a hard small sun, or at the end a giant: bright at the heart, deep red at the limb, slow cells crawling on it
  float q = acos(clamp(dot(d, uSunDir), -1., 1.)) / uDiscR;
  float mu = sqrt(max(1. - q * q, 0.));
  float big = smoothstep(0.05, 0.2, uDiscR);
  vec2 sp = vec2(dot(d, uEast), dot(d, uPole)) * 1.3;
  float cell = textureLod(uNz, sp + vec2(uReal * 0.0035, 0.), 0.).r * 0.6 + textureLod(uNz, sp * 2.3 - vec2(0., uReal * 0.005), 0.).r * 0.4;
  vec3 dcol = mix(uDiscCol * (0.45 + 0.55 * mu), mix(vec3(0.30, 0.03, 0.018), vec3(0.80, 0.17, 0.045), mu * mu * (3. - 2. * mu)) * (0.9 + 0.2 * cell), big);
  float disc = 1. - smoothstep(mix(0.93, 0.985, big), 1., q);
  c += dcol * uDiscI * uSwDay * disc;
  // the air near the horizon reddens and dims whatever shines through it
  float ex = smoothstep(0., 0.11, d.y) * (0.8 + 0.2 * smoothstep(0.1, 0.5, d.y));     // amber only at its very foot, gold above, pale overhead
  return c * mix(vec3(0.95, 0.56, 0.3), vec3(1.), max(ex, 0.8 * gRefl * (1. - uSwDay))) * hor;
}
vec3 skyColor(vec3 d, float w);
// the river's water, silty and still: mostly a mirror of the sky. The sea plane and the land under the water both draw
// exactly this, so the water's edge in the channel is the height function's own line and never the grid's.
vec3 riverCol(vec3 V, vec3 amb, float cshade, float depth) {
  vec3 R = vec3(V.x, abs(V.y) + 0.002, V.z); R = normalize(R);
  gRefl = 1.;
  vec3 sk = min(skyColor(R, 0.016), vec3(1.25, 1.0, 0.8)) * 0.85 * (0.42 + 0.58 * cshade);
  float fr = 0.4 + 0.6 * pow(1. - clamp(-V.y, 0., 1.), 4.);
  vec3 w = mix(vec3(0.34, 0.43, 0.42) * amb * 0.5, sk, fr);
  return mix(mix(vec3(0.5, 0.47, 0.36) * amb * 0.6, sk, 0.45), w, smoothstep(0., 0.45, depth));      // silt shows through the shallows
}
vec3 skyColor(vec3 d, float w) {
  float h = max(d.y, 0.);
  vec3 c = mix(uSkyHor, uSkyZen, 1. - exp(-h * 3.4));
  c = mix(c, uSkyHor * 1.12, 0.5 * exp(-h * 26.));                    // a pale seam of haze lying on the horizon
  float g = max(dot(d, uSunDir), 0.); float g2 = g * g, g4 = g2 * g2, g16 = g4 * g4 * g4 * g4, g64 = g16 * g16 * g16 * g16;
  c += uGlowCol * uSwDay * (0.22 * g4 + 0.5 * g64 * g64);
  // the sun under the horizon still lights the air above where it is: the true twilight arch of the one night
  vec2 sa = uSunDir.xz / max(length(uSunDir.xz), 1e-3);
  float taz = dot(d.xz / max(length(d.xz), 1e-3), sa);
  // (a midsummer night at this latitude is never quite dark: the sun slides along under the northern horizon and its
  // glow goes with it, amber on the sea's edge under a wide teal arch, from the dusk's place round to the dawn's)
  float tw = uTwi * smoothstep(-0.95, 0.85, taz);
  c += tw * (vec3(1.15, 0.47, 0.15) * exp(-h * 11.) + vec3(0.10, 0.30, 0.46) * exp(-h * 3.6));
  float cover; vec3 st = sunTerm(d, w, cover);
  return c * (1. - cover) + st;
}
`,zo=`
varying vec3 vW;
uniform float uMirror, uSea;
void main() { vec3 q = vec3(position.x, uSea, position.z); vW = q; gl_Position = projectionMatrix * viewMatrix * vec4(q.x, q.y, q.z * uMirror, 1.); }
`,Ro=`
varying vec3 vD;
void main() {
  vD = position;
  vec4 p = projectionMatrix * viewMatrix * vec4(position * 100. + cameraPosition, 1.);
  if (abs(p.w) < 1e-4) p.w = 1e-4;
  gl_Position = p.xyww;
}
`,Ao=`
varying vec3 vD;
uniform sampler2D uStars;
${Xe}
${yt}
void main() {
  vec3 d = normalize(vD);
  d.z *= uMirror;
  // heat shimmer, after the law is off: the lowest sky (and the giant's foot) wavers, on real time
  float shim = step(0.0005, uReal) * exp(-max(d.y, 0.) * 16.);
  d.y += shim * 0.0016 * (sin(d.x * 140. + d.z * 90. + uReal * 5.3) + 0.7 * sin(d.z * 337. - d.x * 51. - uReal * 7.1) + 0.5 * sin(d.x * 613. + uReal * 3.7));
  d = normalize(d);
  float D = asin(clamp(dot(d, uPole), -1., 1.));
  float w = max(0.0052, 1.5 * fwidth(D));
  vec3 c = skyColor(d, w);
  // stars: a map in hour angle and declination, turned by the sidereal phase
  float hx = dot(d, uMer), hy = dot(d, uEast);
  float H = atan(hy, hx + (abs(hx) + abs(hy) < 1e-5 ? 1e-5 : 0.));
  vec2 suv = vec2(H / 6.2831853 + uStarRot, D / 3.14159265 + 0.5);
  float st = textureLod(uStars, suv, 0.).r; st = st * st * st * 2.2;
  c += vec3(0.8, 0.88, 1.) * st * 3.6 * uNight * smoothstep(0.02, 0.2, d.y);
  // the Milky Way: fixed among the stars, so it wheels with them
  float Hs = suv.x * 6.2831853, cD = cos(D);
  vec3 sv = vec3(cD * cos(Hs), cD * sin(Hs), sin(D));
  float gx = dot(sv, uGal);
  float mn = textureLod(uNz, sv.xy * 1.1 + sv.z * 0.63, 0.).r, mn2 = textureLod(uNz, sv.yz * 3.1 + sv.x * 1.7, 0.).r;
  float mw = exp(-gx * gx * 16.) * (0.45 + 1.1 * mn * mn) * (0.75 + 0.5 * mn2);
  mw *= 1. - 0.75 * exp(-(gx - 0.03) * (gx - 0.03) * 900.) * smoothstep(0.35, 0.6, mn2);      // a dark lane down its middle
  c += (vec3(0.42, 0.52, 0.95) + vec3(0.5, 0.3, 0.12) * mn) * mw * 0.2 * uNight * smoothstep(0.02, 0.25, d.y);
  // below the horizon: the haze colour, so the dome never shows a hole under the sea's edge
  c = mix(uFogCol, c, smoothstep(-0.03, 0.012, d.y));
  gl_FragColor = vec4(c, 1.);
}
`,Co=`
varying vec3 vW;
${Xe}
${wt}
${yt}
void main() {
  vec2 p = vW.xz;
  float depth = uSea - groundH(p);
  if (depth < -0.02) discard;
  vec3 V = normalize(vW - uCam);
  float dist = distance(vW, uCam);
  // swell and chop, every wavelength an integer multiple of the surf's one phase; flattened to silk as the swing goes
  float att = uSwSurf / (1. + dist * 0.004);
  vec2 n = vec2(0.);
  n += vec2(0.25, 1.) * 0.055 * cos(6.2831853 * ((p.y + 0.25 * p.x) / 46. - uPhSurf));
  n += vec2(-0.4, 1.) * 0.05 * cos(6.2831853 * ((p.y - 0.4 * p.x) / 19. - 2. * uPhSurf));
  n += vec2(0.9, 0.6) * 0.04 * cos(6.2831853 * ((0.6 * p.y + 0.9 * p.x) / 7.3 - 3. * uPhSurf));
  n += vec2(-0.7, 0.8) * 0.03 * cos(6.2831853 * ((0.8 * p.y - 0.7 * p.x) / 3.1 - 5. * uPhSurf));
  // chop and cat's-paws close to the eye (integer multiples of the same phase), bent by a slow grain so no line is ruled
  float nearS = 1. / (1. + dist * 0.035);
  float w1 = textureLod(uNz, p / 31. + 0.2, 0.).r, w2 = textureLod(uNz, p.yx / 11. + 0.5, 0.).r;
  n += vec2(0.6, 0.8) * 0.06 * nearS * cos(6.2831853 * (dot(p, vec2(0.6, 0.8)) / 1.7 + 1.6 * w1 - 8. * uPhSurf));
  n += vec2(-0.8, 0.5) * 0.05 * nearS * cos(6.2831853 * (dot(p, vec2(-0.8, 0.5)) / 0.83 + 2.1 * w2 - 11. * uPhSurf));
  n += vec2(0.2, -1.) * 0.035 * nearS * cos(6.2831853 * (dot(p, vec2(0.2, -1.)) / 0.37 + 3. * w1 + 2. * w2 - 16. * uPhSurf));
  n += (vec2(w1, w2) - 0.4) * 0.07;
  vec3 N = normalize(vec3(-n.x * att, 1., -n.y * att));
  vec3 R = reflect(V, N); R.y = abs(R.y) + 0.002;
  gRefl = 1.;
  float fres = 0.04 + 0.96 * pow(1. - max(dot(-V, N), 0.), 5.);
  float cshade = cloudShade(p);
  vec3 lit = (uAmbSky * 1.6 * (0.5 + 0.5 * cshade) + uKeyCol * uKeyOn * 0.22 * cshade) * 0.3183;
  vec3 deep = mix(vec3(0.028, 0.15, 0.23), vec3(0.11, 0.25, 0.38), 1. - uSwSurf) * lit;
  vec3 shal = mix(vec3(0.13, 0.40, 0.37), vec3(0.30, 0.47, 0.47), 1. - uSwSurf) * lit * 1.15;
  vec3 body = mix(shal, deep, 1. - exp(-max(depth, 0.) / 2.6));
  // once the surf is silk the bed shows through it: a turquoise ribbon of shallows along the shore, sand under the last of it
  float silk = (1. - uSwSurf) * uWet;
  float shalK = silk * exp(-max(depth, 0.) / 1.7);
  body = mix(body, vec3(0.26, 0.86, 0.78) * lit * 1.25, 0.8 * shalK);
  body = mix(vec3(0.42, 0.40, 0.29) * lit * (1. + 1.2 * silk), body, 1. - exp(-max(depth, 0.) / mix(0.35, 0.8, silk)));      // the sand shows through the last hand's depth
  // light scattered up through the faces of the chop that lean toward the sun
  body += vec3(0.05, 0.22, 0.19) * lit * uSwSurf * clamp(dot(N.xz, uSunDir.xz) * 6., 0., 1.) * uSwDay;
  vec3 c = mix(body, min(skyColor(R, 0.016), vec3(2.3, 1.62, 0.8)) * 0.82 * (0.5 + 0.5 * cshade), fres * (1. - 0.6 * shalK));
  float chS; float fanS = fanH(p, chS);
  c = mix(c, riverCol(V, uAmbSky * 1.6, cshade, depth), smoothstep(0.12, 0.45, chS) * uWet);
  float sr = stackHit(vW, R);                                         // the stack stands in its own reflection
  c = mix(c, c * 0.5 + stackTone() * (0.25 + 0.75 * fres), sr * 0.9);
  // sun glitter while there are waves to scatter it
  float gl = max(dot(R, uSunDir), 0.); float gl8 = gl * gl; gl8 *= gl8; gl8 *= gl8; float gl64 = gl8 * gl8; gl64 *= gl64; gl64 *= gl64;
  c += uDiscCol * uSwDay * uSwSurf * (gl64 * gl64 * gl64 * 2.6 + gl8 * gl8 * 0.05) * (1. - sr);
  // surf: foam lines run up the beach at the speed of a wave; their average is one pale swash band
  float rag = textureLod(uNz, p / 90., 0.).r, rag2 = textureLod(uNz, p.yx / 23. + 0.4, 0.).r;
  float lace = textureLod(uNz, p / 4.1 + vec2(0.3 * rag, uPhSurf), 0.).r * 0.62 + textureLod(uNz, p.yx / 15. + 0.3, 0.).r * 0.5;
  float run = depth * 20. / 15. + 0.5 * rag + 0.12 * sin(p.x / 17.);
  float f = fract(run + uPhSurf);
  float foam = uSwSurf * (smoothstep(0.93, 0.99, f) * 0.7 + smoothstep(0.55, 0.97, f) * 0.6 * smoothstep(0.56, 0.64, lace)) * (0.15 + 0.85 * smoothstep(0.3, 0.6, rag2)) * (1. - smoothstep(1.2, 2.4, depth));
  foam += uSwSurf * (1. - smoothstep(0.0, 0.22, depth)) * (0.35 + 0.6 * smoothstep(0.5, 0.6, lace));
  foam += uSwSurf * 0.4 * smoothstep(0.6, 0.68, lace) * (1. - smoothstep(0.2, 0.8, depth));      // lace left on the shallows by the last wave
  foam += (1. - uSwSurf) * (0.5 * (1. - smoothstep(0., 0.45, depth)) + 0.16 * (1. - smoothstep(0., 1.6, depth))) * (0.6 + 0.8 * rag);
  c = mix(c, vec3(0.86, 0.9, 0.9) * lit * 3.14, clamp(foam, 0., 1.) * uWet * (1. - smoothstep(0.12, 0.45, chS)));
  c = mix(c, uFogCol, fogAmt(vW));
  gl_FragColor = vec4(c, 1.);
}
`,Lo=`
varying vec3 vW;
varying float vIce;
${Xe}
${wt}
void main() {
  vec2 p = position.xz;
  float gv = groundH(p), iv = iceSurf(p);
  vec3 q = vec3(p.x, max(gv, iv), p.y);
  vW = q; vIce = iv - gv;
  gl_Position = projectionMatrix * viewMatrix * vec4(q.x, q.y, q.z * uMirror, 1.);
}
`,Do=`
#define DETAIL
varying vec3 vW;
varying float vIce;
${Xe}
${wt}
${yt}
float segDist(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a, ap = p - a;
  float t = clamp(dot(ap, ab) / max(dot(ab, ab), 1e-4), 0., 1.);
  return length(ap - ab * t);
}
void main() {
  vec2 p = vW.xz;
  float dist = distance(vW, uCam);
  float e = clamp(dist * 0.004, 0.6, 40.);
  float g0 = groundH(p), ic = iceSurf(p);
  float isIce = max(step(g0 + 0.02, ic), step(1.5, vW.y - g0) * step(-25., vIce));   // the wall's foot is ice wherever the grid has lifted it
  float hL = landH(p - vec2(e, 0.)), hR = landH(p + vec2(e, 0.)), hD = landH(p - vec2(0., e)), hU = landH(p + vec2(0., e));
  vec3 N = normalize(vec3(hL - hR, 2. * e, hD - hU));
  float h = max(g0, ic);
  float zc = inl(p) - uShore;
  float slope = 1. - N.y;
  float grain = textureLod(uNz, p / 37., 0.).r;
  float grain2 = textureLod(uNz, p / 410. + 0.37, 0.).r;

  // what it is made of
  float grain3 = textureLod(uNz, p / 7.3 + 0.61, 0.).r;
  float near = 1. - smoothstep(60., 420., dist);
  float grain4 = textureLod(uNz, p / 1.7 + 0.13, 0.).r;
  vec3 sand = vec3(0.66, 0.55, 0.37) * (0.78 + 0.2 * grain + 0.16 * grain2 + 0.16 * grain3 * near + 0.2 * (grain4 - 0.5) * (1. - smoothstep(20., 110., dist)));
  sand *= 0.85 + 0.33 * textureLod(uNz, vec2(p.x / 230. + 0.2 * grain2, p.y / 27.) + 0.77, 0.).r;      // wind-sorted streaks lying along the coast
  // lines of dark heavy sand sorted along the shore by the swash: they are what the swash leaves on average
  float lineS = textureLod(uNz, vec2(p.x / 260., (inl(p) - uShore + 9. * grain2 + 2.5 * sin(p.x / 23.)) / 11.), 0.).r;
  sand = mix(sand, vec3(0.42, 0.33, 0.24), 0.32 * smoothstep(0.56, 0.7, lineS) * (1. - smoothstep(3., 6.5, g0)) * smoothstep(1.2, 2.2, g0) * (1. - smoothstep(500., 1400., dist)));
  vec3 wetSand = vec3(0.43, 0.36, 0.235);
  // rock: bedded, the beds tilted a little along the range, ochre over umber
  float strata = textureLod(uHt, vec2(g0 / 240. + 0.3 * grain2 + p.x / 7000., 0.13 + p.y / 9000.), 0.).r;
  float bare = uSalt * uSwRange;                                       // 1 only after the law is off: the stop finds bare rock, crisp
  float strK = mix(mix(0.5, 0.16, smoothstep(500., 2600., dist)), 0.8, bare);          // bedding is a whisper, and fainter with distance: the ranks are told apart by light and haze, not stripes
  vec3 rock = mix(vec3(0.33, 0.225, 0.15), mix(mix(vec3(0.20, 0.135, 0.10), vec3(0.10, 0.06, 0.05), bare), vec3(0.44, 0.30, 0.185), smoothstep(0.15, 0.75, strata)), strK) * (0.85 + 0.3 * grain2);
  vec3 forest = mix(vec3(0.07, 0.15, 0.055), vec3(0.16, 0.25, 0.075), smoothstep(0.4, 0.62, grain)) * (0.8 + 0.4 * grain2);   // wood and meadow: a tone, no trees
  float wetAmt = (1. - smoothstep(1.1, 1.9, g0)) * uWet;
  vec3 alb = mix(sand, wetSand, wetAmt);
  float swashL = (1. - uSwSurf) * uWet * (1. - smoothstep(0.02, 0.5, abs(g0 - uSea))) * (0.6 + 0.6 * grain2);   // the surf's own average: one pale band of foam lying along the water's edge
  alb = mix(alb, vec3(0.80, 0.80, 0.76), 0.62 * swashL);   // the swash, averaged: a soft pale film either side of the water's edge
  // the sea bed, when the sea draws back: dark wet mud with pale standing pools, plainly not beach sand
  float cz = coast(zc);
  float pool = smoothstep(0.55, 0.61, textureLod(uNz, p / vec2(520., 150.) + 0.21, 0.).r);
  vec2 dI = p - ISLE; float rI = length(dI);
  float mudAmt = (1. - smoothstep(-2.8, -1.6, cz)) * uWet * (1. - uIsland * exp(-rI / 300.));
  float poolN = textureLod(uNz, p / vec2(520., 150.) + 0.21, 0.).r + (0.07 * (grain - 0.5) + 0.035 * (grain3 - 0.5)) * smoothstep(0., 0.07, uSalt);   // a brine pool's shore is lobed and crisp close to
  float brine = smoothstep(0., 0.07, uSalt);                           // the last drying: what is left standing is brine
  float hue = textureLod(uNz, p / vec2(900., 420.) + 0.63, 0.).r;
  vec3 brineCol = mix(vec3(0.40, 0.55, 0.53), vec3(0.64, 0.51, 0.45), smoothstep(0.46, 0.6, hue));   // two pale mineral tints (verdigris, rose): the first word is salt
  brineCol *= 0.7 + 0.6 * smoothstep(0.58, 0.7, poolN);                // deeper, darker toward each pool's middle
  vec3 mudCol = mix(vec3(0.06, 0.07, 0.075), vec3(0.27, 0.225, 0.18), brine) * (0.6 + 0.8 * grain) * (0.75 + 0.5 * lineS);
  float rim = smoothstep(0.49, 0.545, poolN) * (1. - pool) * brine;      // each pool lies in a rim of white salt it has left
  mudCol = mix(mudCol, vec3(0.86, 0.84, 0.78), 0.85 * rim);
  vec3 mud = mix(mudCol, mix(vec3(0.30, 0.42, 0.52), brineCol, brine), mix(0.75, 0.96, brine) * mix(pool, smoothstep(0.555, 0.59, poolN), brine));
  alb = mix(alb, mud, mudAmt);
  // dunes: pale crests, a crisp blue shadow on every slip face, coarse darker troughs: travelling whatever the light is doing
  float chF; float fanF = fanH(p, chF);
  vec3 dq = duneQ(p, zc);
  float dband = duneBand(zc) * dq.y * (1. - smoothstep(0.04, 0.7, gChanW));
  float ds = dq.x;
  float slip = smoothstep(0.775, 0.795, ds) * (1. - smoothstep(0.93, 0.985, ds)) * smoothstep(0.08, 0.3, dband) * uSwDune;
  float back = smoothstep(0.1, 0.78, ds) * (1. - smoothstep(0.775, 0.795, ds));
  alb *= 1. - 0.22 * dband * uSwDune * (1. - smoothstep(0., 0.4, ds)) * (1. - slip);
  alb = mix(alb, vec3(0.86, 0.78, 0.6), dband * uSwDune * back * back * 0.6);
  alb *= mix(1., 0.76 + 0.42 * dq.y, duneBand(zc) * (1. - uSwDune) * (1. - smoothstep(0.04, 0.7, gChanW)));
  float dOn = smoothstep(0.08, 0.3, dband) * uSwDune;
  float rip = sin(ds * 62. + 5. * grain + 9. * grain2);                // ripples lying along the contours of each back
  alb *= 1. + 0.2 * rip * dOn * back * (1. - smoothstep(450., 1000., dist));
  float knife = smoothstep(0.69, 0.776, ds) * (1. - smoothstep(0.778, 0.794, ds)) * dOn;
  alb = mix(alb, vec3(0.98, 0.91, 0.72), 0.75 * knife);               // the crest: a pale knife edge
  float slipG = smoothstep(0.79, 0.97, ds);
  alb = mix(alb, mix(vec3(0.50, 0.50, 0.52), vec3(0.64, 0.60, 0.58), slipG), 0.5 * slip);   // the slip face: fine pale sand in shade (its colour comes from the sky that fills it), paler toward its foot
  alb = mix(alb, vec3(0.72, 0.64, 0.47) * (0.92 + 0.14 * grain), clamp(fanF / 8., 0., 1.) * 0.65 * (1. - smoothstep(30., 60., g0)) * (1. - dband * uSwDune));      // the fan: pale silt
  float chAmt = smoothstep(0.04, 0.3, chF) * (1. - smoothstep(30., 60., g0));
  alb = mix(alb, vec3(0.50, 0.44, 0.33) * (0.9 + 0.2 * grain), chAmt * 0.7);
  float rk = max(smoothstep(0.10, 0.28, slope), smoothstep(20., 90., g0));
  alb = mix(alb, rock, rk);
  float renv = rangeEnv(p);
  vec3 rr = rangeRel(p, uPhRange * RLAM);
  // The forest: a tone, no trees. It clothes the plain behind the dunes and the lower slopes of every rank, thinning upward
  // to a ragged treeline well under the snowline, and leaves the steep faces and the brows to the rock. While the year is
  // the travelling rung it turns with the seasons (summer green, rust, bare under the low snowline); then it is its mean.
  float season = clamp((uSnowLine - 1500.) / 900., -1., 1.);
  vec3 fSummer = mix(vec3(0.055, 0.150, 0.045), vec3(0.185, 0.310, 0.070), smoothstep(0.38, 0.64, grain)) * (0.8 + 0.4 * grain2);
  vec3 fAutumn = mix(vec3(0.30, 0.115, 0.03), vec3(0.40, 0.25, 0.045), smoothstep(0.35, 0.65, grain));
  vec3 fBare = vec3(0.17, 0.14, 0.11) * (0.8 + 0.4 * grain);
  vec3 fNow = mix(mix(fBare, fAutumn, smoothstep(-0.75, -0.1, season)), fSummer, smoothstep(-0.05, 0.6, season));
  vec3 fMean = mix(fSummer, fAutumn, 0.22) * 1.05;
  forest = mix(fMean, fNow, uSwYear);
  float treeTop = 520. + 280. * grain2 - 260. * smoothstep(0.5, 0.85, rr.x) * uSwRange;       // lower under each brow: the brows stay rock and snow
  float inK = smoothstep(110., 240., zc);
  float fo = uForest * uWet * smoothstep(mix(2.5, 4.5, inK), mix(3.6, 9., inK), g0) * (1. - smoothstep(0.52, 0.82, slope + 0.2 * (grain - 0.5))) * (1. - smoothstep(treeTop - 90., treeTop + 60., g0))
    * (1. - duneBand(zc) * uSwDune) * (1. - isIce);
  // on the range it keeps to the troughs and the feet of the ranks (and to the foot of the whaleback): the faces are rock, for the key to split
  fo *= 1. - uSwRange * smoothstep(3., 40., renv) * smoothstep(0.27, 0.56, rr.x + 0.14 * (grain - 0.5));
  fo *= 1. - (1. - uSwRange) * smoothstep(20., 200., renv) * smoothstep(24., 70., g0 + 20. * (grain2 - 0.5));
  // toward the shore it thins to dune grass in tufts and patches: on the dunes only once they have stopped marching
  float tuft = smoothstep(0.45, 0.55, 0.3 * grain3 + 0.7 * grain + 0.3 * smoothstep(50., 200., zc) - 0.1);
  tuft *= mix(1., smoothstep(0.3, 0.52, 0.62 * grain3 + 0.5 * grain4), 1. - smoothstep(90., 380., dist));      // close to, a patch is clumps with sand between them, not a blot
  fo *= mix(tuft * smoothstep(40., 66., zc + 26. * grain2) * (1. - clamp(fanF / 2.5, 0., 1.) * uSwRiver) * (1. - chAmt), 1., inK);
  forest = mix(mix(vec3(0.14, 0.24, 0.06), vec3(0.30, 0.31, 0.09), grain4), forest, 0.25 + 0.75 * inK);
  // while the ice is abroad nothing green stands within its reach: bare ground at the foot of the wall, a grey-green
  // tundra tone out to some 800 m ahead of the front; the green follows the front back as it goes
  float zf = iceFront(p), dfr = inl(p) - zf;
  float cold = smoothstep(0.02, 0.12, uIceG) * (1. - smoothstep(180., 800., -dfr));
  forest = mix(forest, vec3(0.17, 0.20, 0.17) * (0.85 + 0.3 * grain2), cold);
  fo *= 1. - 0.75 * smoothstep(0.02, 0.12, uIceG) * (1. - smoothstep(50., 260., -dfr));
  float foK = fo * (0.74 + 0.22 * smoothstep(0.35, 0.65, grain2));
  alb = mix(alb, forest, foK);
  // snow: above the breathing snowline; once the year has blurred, its average whitens every crest like foam on a swell
  // (a white brow rides every high crest: it is what the eye follows as the rank comes on; the whaleback keeps a white top)
  float snowMean = mix(0.85 * smoothstep(760., 1000., g0 + 70. * grain2), smoothstep(0.8, 0.97, rr.x + 0.1 * grain2) * smoothstep(620., 1000., renv), uSwRange);
  // (and the year's true average on the heights: the snowline spends about a third of every year below the summits, so
  // the top of the range is dusted, more the higher, where the ground is not too steep to hold it)
  snowMean = max(snowMean, 0.8 * smoothstep(520., 960., g0 + 110. * (grain2 - 0.5)) * (1. - smoothstep(0.72, 0.98, slope + 0.2 * (grain - 0.5))) * uSwRange);
  float snow = uSwYear * smoothstep(uSnowLine - 50., uSnowLine + 50., g0 + 60. * grain2) + (1. - uSwYear) * snowMean;
  float snowAmt = snow * uWet * (1. - 0.6 * smoothstep(0.5, 0.8, slope) * (1. - smoothstep(1500., 3500., dist))) * (1. - 0.8 * (1. - uSwYear) * smoothstep(0.42, 0.72, slope));   // (the steep faces under a white brow are bare rock)
  alb = mix(alb, vec3(0.84, 0.87, 0.9), snowAmt);
  // on the steep faces the year's mean snow lies where a face can hold it: in the gullies, as white streaks running down
  // from the heights (so the grain of a cliff reads as couloirs, not as a smear)
  float gul = textureLod(uNz, vec2(dot(p - RORG, RAX) / 130. + 0.5 * grain2, g0 / 1500.) + 0.41, 0.).r;
  float dust = (1. - uSwYear) * uSwRange * uWet * smoothstep(430., 900., g0 + 160. * (grain2 - 0.5)) * smoothstep(0.42, 0.6, gul + 0.25 * smoothstep(700., 1100., g0)) * rk * (1. - isIce);
  alb = mix(alb, vec3(0.84, 0.87, 0.9), 0.85 * dust * (1. - snowAmt));
  alb = mix(alb, vec3(0.72, 0.8, 0.84), uIceMean * uWet * 0.6 * smoothstep(650., 900., g0));
  // the dry sea bed is salt: a pale crust broken into plates by darker seams
  float bed = 1. - smoothstep(-1.5, 1.5, cz);
  float cr1 = textureLod(uNz, p / 150. + 0.3, 0.).r, cr2 = textureLod(uNz, p.yx / 44. + 0.7, 0.).r;
  float crack = 0.6 * (1. - smoothstep(0., 0.05, abs(cr1 - 0.5))) * (1. - smoothstep(300., 900., dist)) + 0.45 * (1. - smoothstep(0., 0.05, abs(cr2 - 0.5))) * (1. - smoothstep(30., 140., dist));
  vec3 salt = mix(vec3(0.80, 0.73, 0.60) * (0.9 + 0.14 * grain), vec3(0.46, 0.38, 0.30), crack);
  // where the last brine stood the crust keeps its stain (rose, ochre, verdigris) inside a paler rim
  float stain = smoothstep(0.555, 0.59, poolN);
  salt = mix(salt, salt * mix(vec3(1.), brineCol * 1.7, 0.4), stain);
  salt = mix(salt, vec3(0.88, 0.85, 0.78), 0.5 * smoothstep(0.49, 0.545, poolN) * (1. - stain));
  float saltAmt = uSalt * bed * (1. - rk);
  alb = mix(alb, salt, saltAmt);
  // ice: a white sheet with faint moraine lines carried toward the front; its cliff is a blue wall split by vertical
  // clefts into seracs, bedded level; a dark line of moraine lies along its foot
  float sf = fract(dfr / 260. + 0.5 * grain2);
  float stripe = smoothstep(0.42, 0.5, sf) * (1. - smoothstep(0.5, 0.58, sf)) * smoothstep(60., 160., dfr);
  vec3 ice = mix(vec3(0.80, 0.88, 0.95), vec3(0.50, 0.57, 0.64), 0.22 * stripe) * (0.92 + 0.14 * grain2);
  float beds = textureLod(uHt, vec2(h / 23. + 0.5 * grain2, p.x / 1300.), 0.).r;
  float faceAmt = (1. - smoothstep(36., 58., dfr)) * smoothstep(0.1, 0.34, slope);
  float ser = textureLod(uNz, vec2((p.x + 0.6 * p.y) / 70. + 0.4 * grain2, h / 900.), 0.).r;
  float cleft = smoothstep(0.5, 0.58, ser);
  vec3 face = mix(vec3(0.36, 0.62, 0.86), vec3(0.07, 0.24, 0.50), cleft) * (0.8 + 0.4 * smoothstep(0.1, 0.75, beds));
  face = mix(face, vec3(0.74, 0.86, 0.95), smoothstep(74., 100., vW.y - g0) * 0.7);       // the lip, where the light comes through
  ice = mix(ice, face, faceAmt);
  alb = mix(alb, vec3(0.085, 0.078, 0.075) * (0.6 + 0.8 * grain), smoothstep(-42., -6., dfr) * (1. - isIce) * smoothstep(0.02, 0.12, uIceG) * (1. - smoothstep(60., 300., g0)));   // moraine
  alb = mix(alb, ice, isIce);
  // the rare island: black new rock, ash-grey lower down
  float isle = uIsland * (1. - smoothstep(380., 620., rI)) * smoothstep(-2., 6., g0);
  alb = mix(alb, mix(vec3(0.07, 0.062, 0.06), vec3(0.026, 0.024, 0.03), smoothstep(8., 90., g0)) * (0.8 + 0.4 * grain), isle * 0.97);

  // wind ripples on dry sand: they belong to the day, and go to smooth sand when the days blur (salt keeps its own grain)
  float sandAmt = (1. - rk) * (1. - isIce) * (1. - mudAmt) * (1. - fo) * (1. - saltAmt) * (1. - isle);
  float r1 = sin(p.x * 4.4 + 6. * grain + 1.3 * sin(p.y * 0.5)), r2 = sin(dot(p, vec2(0.9, 0.35)) + 5. * grain2);
  float r3 = sin(dot(p, vec2(0.66, 0.2)) + 4. * grain2 + 2.5 * grain);        // the long even ripple that is always there, whatever has blurred
  N = normalize(N + vec3(1., 0., 0.25) * ((0.15 * r1 * (1. - smoothstep(12., 70., dist)) + 0.06 * r2 * near) * (0.6 + 0.4 * uSwDay) + 0.07 * r3 * (1. - smoothstep(200., 700., dist))) * sandAmt * (1. - 0.9 * wetAmt));

  // light
  vec3 L = uKeyDir;
  float ndl = dot(N, L);
  float hk = max(max(uHardKey, 0.85 * (1. - uSwYear) * (1. - uSwDay) * rk), bare * rk);   // on rock the band's light is decided as soon as the band stands
  float key = mix(clamp(ndl, 0., 1.), smoothstep(0.4, 0.75, ndl), hk);
  // soft cast shadow: two taps of the height function along the ray toward the key
  vec2 lxz = L.xz; float ly = max(L.y, 0.06);
  float s1 = 90. + dist * 0.02, s2 = 420.;
  float o1 = landH(p + lxz * s1) - (h + ly * s1);
  float o2 = landH(p + lxz * s2) - (h + ly * s2);
  float o0 = landH(p + lxz * 16.) - (h + ly * 16.);
  float sh = (1. - smoothstep(-8., 30., o1)) * (1. - smoothstep(-20., 90., o2)) * (1. - 0.8 * smoothstep(-1., 3., o0));
  float cshd = cloudShadeH(p, h);
  sh *= cshd;
  // the logs' shadows: the hands of the day's clock
  float lg = 0.;
  for (int i = 0; i < 7; i++) {
    vec3 tip = uLogTip[i];
    vec2 st = tip.xz - lxz / ly * min(tip.y, 60. * ly);
    float dS = segDist(p, uLogs[i].xy, st);
    lg = max(lg, uLogs[i].w * (1. - smoothstep(0.3, 0.95, dS)));
  }
  sh *= 1. - 0.8 * lg * uSwDay * (1. - isIce);
  sh *= 1. - 0.8 * stackHit(vec3(p.x, h, p.y), L);                    // the stack's own shadow: the one that never blurs away
  // The range in ranks: where a point stands on its own swell decides how it is seen. The brow and the buttresses under
  // it take the key; the face below lies in the shadow of the rank in front; the foot stands in the haze of the trough.
  float rOn = uSwRange * smoothstep(0.5, 9., renv) * (1. - isIce);       // down to the low rollers that cross the plain and the sand
  float rOnM = uSwRange * smoothstep(40., 260., renv) * (1. - isIce);
  vec3 Lr = normalize(vec3(uKeyDir.x + 0.9 * RAX.x, uKeyDir.y, uKeyDir.z + 0.9 * RAX.y));
  float keyR = smoothstep(0.28, 0.62, dot(N, Lr));
  float away = max(0.68 * (1. - rr.y), 1. - keyR) * smoothstep(0.3, 0.55, rr.x);   // the sides of every summit and buttress turned from the key
  float foot = 1. - smoothstep(0.3, 0.55, rr.x);                        // and the foot of every face
  float shadeR = rOn * max(away, foot) * (0.45 + 0.55 * max(uLook, 0.8 * bare));
  // the whaleback, when the range is only its average, is still a lit thing: its spurs' far sides lie in violet shadow
  float mOn = (1. - uSwRange) * smoothstep(20., 200., renv) * (1. - isIce);
  vec3 Lm = normalize(vec3(uKeyDir.x + 1.7 * RAX.x, 0.8 * uKeyDir.y, uKeyDir.z + 1.7 * RAX.y));
  float spurM = smoothstep(0.47, 0.6, textureLod(uNz, vec2(dot(p - RORG, RAX) / 4200. + 0.00006 * g0, dot(p - RORG, RNX) / 11000.) + 0.19, 0.).r);
  float shadeM = mOn * max(1. - smoothstep(0.04, 0.26, dot(N, Lm) + 0.2 * (grain2 - 0.5)), 0.9 * spurM) * uHardKey;
  shadeR = max(shadeR, 0.85 * shadeM);
  shadeR *= 1. - 0.6 * foK * (1. - smoothstep(20., 120., renv));        // the wooded plain at the range's foot is in haze, not in night
  float ao = mix(1., 0.6 + 0.4 * smoothstep(0.1, 0.6, rr.x), rOn);
  alb *= mix(1., 0.8 + 0.45 * smoothstep(0.5, 0.95, rr.x), rOn * rk);   // richer toward each brow
  // under the true sun (before the band's decided key) every brow catches it: a warm line along the top of each blue rank
  float browSun = smoothstep(0.76, 0.95, rr.x) * rOn * (1. - uHardKey) * uLook * clamp(uKeyDir.y * 2., 0., 1.);
  shadeR *= 1. - 0.85 * browSun;
  alb = mix(alb, vec3(0.60, 0.44, 0.27) * (0.85 + 0.3 * grain2), 0.55 * browSun * rk * (1. - snowAmt));
  sh *= 1. - 0.8 * shadeR;
  sh *= 1. - 0.92 * slip;
  alb *= 1. - 0.2 * mOn * rk * smoothstep(0.55, 0.75, textureLod(uHt, vec2(g0 / 46. + 0.35 * grain2, p.x / 5200.), 0.).r);   // faint bedding lines following the whaleback's curve
  alb = mix(alb, alb * vec3(0.7, 0.74, 1.), 0.6 * shadeR * (1. - rk) * uLook);                    // a trough's shade on sand is cool
  alb = mix(alb, mix(vec3(0.13, 0.19, 0.42), vec3(0.17, 0.2, 0.36), uHardKey) * (0.7 + 0.6 * grain2), mix(mix(0.8, 0.56, uHardKey), 0.72, mOn) * shadeR * max(rk, 0.3 * foK) * uLook);      // what the violet sky makes of shadowed rock
  alb = mix(alb, alb * vec3(0.52, 0.62, 1.06), 0.9 * shadeR * max(snowAmt, 0.85 * dust) * uLook);       // snow turned from the key holds the sky's blue
  alb *= mix(vec3(1.), vec3(1.16, 0.98, 0.74), max(rOn, mOn) * rk * (1. - shadeR) * uLook * (1. - snowAmt) * (1. - 0.6 * foK) * (1. - 0.7 * dust));   // and the lit faces are gold
  vec3 amb = mix(uAmbGnd, uAmbSky * 1.7, N.y * 0.5 + 0.5) * (0.68 + 0.32 * cshd) * ao;
  amb *= 1. + mix(1.9, 0.8, mOn) * shadeR + (0.85 + 0.8 * slipG) * slip;
  vec3 skyT = uSkyZen * 1.2 + uSkyHor * 0.6; skyT /= max(max(skyT.r, max(skyT.g, skyT.b)), 1e-3);
  amb = mix(amb, max(amb.r, max(amb.g, amb.b)) * skyT, 0.75 * slip);  // a slip face is lit by the sky alone, whatever colour the sky is at that moment: blue by day, red under the giant                                          // the shadowed faces are filled by the violet sky: never black
  // ice is lit from inside as much as from outside: more of the sky's blue, less of the key's gold
  vec3 c = alb * (uKeyCol * uKeyOn * key * sh * (0.75 + 0.25 * ao) * (1. - 0.45 * isIce) * (1. - 0.8 * isIce * faceAmt) + amb * (1. + 1.6 * isIce + 1.2 * isIce * faceAmt)
    + uKeyCol * uKeyOn * vec3(0.10, 0.085, 0.06) * (1. - key * sh)) * 0.3183;      // lit sand throws a little warm light back into every shadow: none is black
  // wet sand, the river's bed and the pools hold the sky
  vec3 V = normalize(vW - uCam);
  float fres = 0.03 + 0.97 * pow(1. - clamp(dot(-V, N), 0., 1.), 4.);
  float gloss = max(max(wetAmt * (1. - rk) * (1. - mudAmt), chAmt), mudAmt * (0.1 + 0.9 * pool) * (1. - 0.5 * brine)) * (1. - isIce) * uWet;
  c *= 1. + (0.1 * r1 * (1. - smoothstep(12., 70., dist)) + 0.105 * r3 * (1. - smoothstep(200., 700., dist))) * sandAmt * (1. - wetAmt);   // every ripple has a lit side and a dull side
  // dry sand seen along its surface has a satin sheen, banded by the ripple
  c += sandAmt * (1. - wetAmt) * (uAmbSky * 0.5 + uKeyCol * uKeyOn * 0.07) * pow(1. - clamp(dot(-V, N), 0., 1.), 3.) * (0.35 + 0.65 * r3 * r3) * 0.3183;
  vec3 Rw = reflect(V, N); Rw.y = abs(Rw.y) + 0.002; gRefl = 1.;
  float mir = gloss * max(fres, mix(0.3, 0.7, 1. - uSwSurf) * wetAmt * (1. - mudAmt) * (1. - chAmt)) * 0.85;
  // runnels and tide pools the ebb leaves on the strand: long shallow mirrors lying along the shore
  float rz = zc + 7. * (grain2 - 0.5) + 2. * sin(p.x / 31.);
  float rn = textureLod(uNz, vec2(p.x / 310. + 0.12 * grain2, rz / 10.) + 0.57, 0.).r;
  float strand = smoothstep(uSea + 0.06, uSea + 0.3, g0) * (1. - smoothstep(uSea + 0.55, uSea + 1.05, g0)) * smoothstep(-2.4, -1.5, g0) * uWet * (1. - rk) * (1. - isIce) * (1. - chAmt);   // only the narrow wet strip at the water's edge
  float runl = smoothstep(0.53, 0.6, rn) * strand * smoothstep(0.22, 0.42, textureLod(uNz, p / vec2(170., 43.) + 0.31, 0.).r);    // broken into pools: none is a ruled line
  c *= 1. - 0.05 * smoothstep(0.49, 0.55, rn) * strand * (1. - runl);                       // each lies in a rim of darker wet sand
  // the river's own time average: water lay on every part of the fan for a fraction of the time, so the fan is glazed,
  // in the braids the channel ran in most often
  vec2 dA = p - APEX; float rA = length(dA);
  // (the channel swings as 55 degrees * sin, so it dwells longest at the two ends of its swing: the damp is smooth, a
  // little heavier toward the fan's two sides, with no shape of its own)
  float xa = atan(dA.x, -dA.y + (abs(dA.x) + abs(dA.y) < 1e-3 ? 1e-3 : 0.)) / 0.96;
  float dwell = (1. - smoothstep(0.92, 1.25, abs(xa))) * min(inversesqrt(max(1. - xa * xa, 0.12)), 2.4) / 2.4;
  float glz = (1. - uSwRiver) * uWet * clamp(fanF / 5., 0., 1.) * smoothstep(50., 150., rA) * (1. - smoothstep(330., 430., rA)) * (1. - isIce) * (1. - rk) * dwell;
  c *= 1. - 0.1 * glz;
  // wet sand is not glass: its sheen is a broad lobe that takes in the low bright sky, so the strand gleams instead of going dark under a steep eye
  vec3 Rwf = normalize(vec3(Rw.x, Rw.y * mix(0.5, 1., chAmt) + 0.02, Rw.z));
  c = mix(c, mix(min(skyColor(Rwf, 0.016), vec3(1.9, 1.5, 0.95)) * 0.75 * (0.55 + 0.45 * cshd), stackTone(), 0.85 * stackHit(vec3(p.x, h, p.y), Rw)), mir);
  c = mix(c, riverCol(V, uAmbSky * 1.6, cshd, uSea - g0), smoothstep(0.12, 0.45, chF) * smoothstep(0.02, 0.3, uSea - g0) * uWet * (1. - isIce));
  // the strand's pools: a film of water over pale silt. Seen steeply it is wet sand; seen along it, it holds the low bright sky
  vec3 Rg = normalize(vec3(Rw.x, Rw.y * 0.55 + 0.03, Rw.z));
  gRefl = 1.;
  vec3 sheen = min(skyColor(Rg, 0.016), vec3(1.6, 1.3, 0.95)) * (0.6 + 0.4 * cshd);
  c = mix(c, mix(c * 0.85, sheen * vec3(0.86, 0.95, 1.), 0.3 + 0.6 * fres), 0.5 * runl);
  // while it is being built its crater and three or four lava runs glow
  float aI = atan(dI.y, dI.x + (abs(dI.x) + abs(dI.y) < 1e-4 ? 1e-4 : 0.));
  float runs = smoothstep(0.62, 0.7, textureLod(uNz, vec2(aI * 0.55, 0.2 + rI / 2600.), 0.).r) * (1. - smoothstep(60., 330., rI));
  c += vec3(3.2, 0.85, 0.12) * uIsleHot * isle * max(exp(-rI * rI / 900.), 0.8 * runs);
  // Haze lies in the troughs. Seen from the beach, what shows of a rank is the top of its face above the brow of the rank
  // in front: the eye's ray is followed back to that brow (its place is known from the swell's own phase) and the nearer
  // the ray passes over it, the more trough haze it has come through. So every brow is cut out, sharp, against pale haze.
  float rph = acos(clamp(1. - 2. * pow(clamp(rr.z / 0.9, 1e-4, 1.), 0.833), -1., 1.)) / 3.14159265;
  vec2 toC = uCam.xz - p;
  float t0 = (0.4 * rph + 0.6) * RLAM / max(dot(-toC, RNX), 1.);
  float occ = 1e5;
  for (int i = 0; i < 3; i++) {
    float tt = min(t0 * (0.84 + 0.16 * float(i)), 0.95);
    occ = min(occ, h + (uCam.y - h) * tt - rangeOnly(p + toC * tt));
  }
  float mistO = (1. - smoothstep(0.004 * dist, 0.034 * dist, occ)) * step(t0, 0.9);
  float mistF = 1. - smoothstep(0.22, 0.6, rr.x);
  float mist = max(mistO, mistF) * rOnM * smoothstep(300., 1300., dist) * (1. - 0.7 * uSalt) * (0.6 + 0.4 * uLook);
  c = mix(c, uFogCol * 1.06, 0.9 * mist);
  // the whaleback: haze lying on it in three level layers stepping back, and a thin bright rim against the sky
  float hz = g0 + 55. * (textureLod(uNz, p / 2600. + 0.3, 0.).r - 0.5);
  float lay = max(max(exp(-(hz - 100.) * (hz - 100.) / 900.), exp(-(hz - 290.) * (hz - 290.) / 1500.)), exp(-(hz - 520.) * (hz - 520.) / 2200.));
  c = mix(c, uFogCol * 1.08, 0.42 * lay * mOn * smoothstep(400., 1500., dist));
  c += uKeyCol * uKeyOn * 0.05 * mOn * pow(1. - clamp(dot(-V, N), 0., 1.), 5.);
  // the far ranks stand in bluer air than the near ones
  c = mix(c, mix(uFogCol, uSkyHor * 0.92 + vec3(0., 0.01, 0.04), 0.55 * smoothstep(1400., 5200., dist)), fogAmt(vW) * (1. - 0.75 * isle) * (1. - 0.3 * bare));   // (new black rock is read through thinner air: it must be black)
  gl_FragColor = vec4(c, 1.);
}
`;function xe(h,d){const i=new Float32Array(d*d);for(let S=0;S<i.length;S++)i[S]=h();return(S,K)=>{const U=S*d,C=K*d,R=Math.floor(U),x=Math.floor(C);let L=U-R,j=C-x;L=L*L*(3-2*L),j=j*j*(3-2*j);const be=(R%d+d)%d,pe=(be+1)%d,ae=(x%d+d)%d,Se=(ae+1)%d;return q(q(i[ae*d+be],i[ae*d+pe],L),q(i[Se*d+be],i[Se*d+pe],L),j)}}async function Ho(h,d={}){const i=h.rng.fork?h.rng.fork("tenfold"):h.rng,S=d.detail||h.quality&&h.quality.detail||1,K=d.mirror?-1:1,U=d.lat||45,C=Mo(U),R=new s.Group;R.name="tenfold";const x=512,L=new Uint8Array(x*x),j=xe(i,4),be=xe(i,4),pe=xe(i,8),ae=xe(i,16),Se=xe(i,32);await h.yield();let xt=0,bt=0;for(let e=0;e<x;e++){const a=e/x;for(let o=0;o<x;o++){const r=o/x,t=jt(r+.13*(j(r,a)-.5)+.045*(pe(r,a)-.5));let l=t<.4?t/.4:(1-t)/.6;l=.5-.5*Math.cos(Math.PI*l),l=Math.pow(l,1.2);const u=.9+.1*be(r,a),m=(1-Math.abs(2*ae(r,a)-1))*.62+(1-Math.abs(2*Se(r,a)-1))*.38;L[e*x+o]=Math.round(255*fe(l*u*.9+m*.1*(.3+.7*l))),xt+=L[e*x+o],bt+=L[e*x+o]*L[e*x+o]}e%12===11&&await h.yield()}const se=new s.DataTexture(L,x,x,s.RedFormat,s.UnsignedByteType);se.wrapS=se.wrapT=s.RepeatWrapping,se.magFilter=s.LinearFilter,se.minFilter=s.LinearFilter,se.generateMipmaps=!1,se.needsUpdate=!0,await h.yield();const Z=256,St=new Uint8Array(Z*Z),kt=[];for(let e=0;e<9;e++)kt.push([(e%3+.2+.6*i())/3,(Math.floor(e/3)+.2+.6*i())/3,.1+.06*i(),.6+.8*i()]);for(let e=0;e<Z;e++){const a=e/Z;for(let o=0;o<Z;o++){const r=o/Z;let t=0;for(const l of kt){let u=Math.abs(r-l[0]),m=Math.abs(a-l[1]);u=Math.min(u,1-u)*l[3],m=Math.min(m,1-m),t=Math.max(t,1-Math.sqrt(u*u+m*m)/l[2])}St[e*Z+o]=Math.round(255*fe(.5+.75*t+.3*(pe(r,a)-.5)+.2*(ae(r,a)-.5)-.2))}e%24===23&&await h.yield()}const re=new s.DataTexture(St,Z,Z,s.RedFormat,s.UnsignedByteType);re.wrapS=re.wrapT=s.RepeatWrapping,re.magFilter=s.LinearFilter,re.minFilter=s.LinearFilter,re.generateMipmaps=!1,re.needsUpdate=!0,await h.yield();const $=256,Mt=new Uint8Array($*$),Xt=xe(i,64);for(let e=0;e<$;e++){const a=e/$;for(let o=0;o<$;o++){const r=o/$;Mt[e*$+o]=Math.round(255*fe(.42*pe(r,a)+.28*ae(r,a)+.18*Se(r,a)+.12*Xt(r,a)))}e%32===31&&await h.yield()}const ne=new s.DataTexture(Mt,$,$,s.RedFormat,s.UnsignedByteType);ne.wrapS=ne.wrapT=s.RepeatWrapping,ne.magFilter=s.LinearFilter,ne.minFilter=s.LinearFilter,ne.generateMipmaps=!1,ne.needsUpdate=!0,await h.yield();const E=1024,ke=512,ie=new Uint8Array(E*ke);for(let e=0;e<2600;e++){const a=Math.floor(i()*E),o=Math.floor(Math.acos(1-2*i())/Math.PI*ke)%ke,r=Math.pow(i(),3.2),t=Math.round(255*(.25+.75*r));ie[o*E+a]=Math.max(ie[o*E+a],t),r>.45&&(ie[o*E+(a+1)%E]=Math.max(ie[o*E+(a+1)%E],t>>1),o+1<ke&&(ie[(o+1)*E+a]=Math.max(ie[(o+1)*E+a],t>>1)))}const le=new s.DataTexture(ie,E,ke,s.RedFormat,s.UnsignedByteType);le.wrapS=s.RepeatWrapping,le.wrapT=s.ClampToEdgeWrapping,le.magFilter=s.LinearFilter,le.minFilter=s.LinearFilter,le.generateMipmaps=!1,le.needsUpdate=!0,await h.yield();const D=(e=0,a=0,o=0)=>new s.Vector3(e,a,o),n={uHt:{value:se},uCl:{value:re},uNz:{value:ne},uStars:{value:le},uCam:{value:D()},uKeyDir:{value:D(0,1,0)},uKeyCol:{value:new s.Color},uAmbSky:{value:new s.Color},uAmbGnd:{value:new s.Color},uFogCol:{value:new s.Color},uSunDir:{value:D(0,1,0)},uPole:{value:C.P.clone()},uMer:{value:C.M.clone()},uEast:{value:C.E.clone()},uBandCol:{value:new s.Color},uSkyZen:{value:new s.Color},uSkyHor:{value:new s.Color},uGlowCol:{value:new s.Color},uDiscCol:{value:new s.Color},uLogs:{value:[]},uLogTip:{value:[]}};for(const e of["uTb","uPhSurf","uSwSurf","uPhCloud","uSwCloud","uPhDune","uSwDune","uRiverA","uRiverSpit","uSwRiver","uShore","uIceG","uIceR","uIceMean","uPhRange","uSwRange","uSnowLine","uSwYear","uWet","uSea","uSalt","uHardKey","uSwDay","uSinDs","uBandHalf","uDiscR","uDiscI","uMoonD","uSwMoon","uMoonI","uNight","uStarRot","uReal","uIsland","uIsleHot","uMirror","uForest","uKeyOn","uRangeMean","uTwi","uLook","uMoonLit"])n[e]={value:0};{const e=xt/(x*x*255),a=bt/(x*x*255*255);n.uRangeMean.value=(.88*.5*(e+a)+.12*e*(.3+.7*e))*1.02}n.uMirror.value=K,n.uForest.value=d.forest===!1?0:1,n.uBandHalf.value=23.44*N,n.uDiscR.value=.6*N;{const e=(a,o)=>{const r=C.az(a,o),t=Math.asin(r.dot(C.P)),l=Math.atan2(r.dot(C.E),r.dot(C.M))+M*.449;return D(Math.cos(t)*Math.cos(l),Math.cos(t)*Math.sin(l),Math.sin(t))};n.uGal={value:e(283,6).cross(e(348,58)).normalize()}}for(let e=0;e<7;e++)n.uLogs.value.push(new s.Vector4(0,0,0,0)),n.uLogTip.value.push(D());const ee=S<.8?288:384,ve=S<.8?192:256,De=new Float32Array((ee+1)*(ve+1)*3);for(let e=0;e<=ve;e++){const a=Math.round(ve*.31),o=(e-a)/(e<a?a:ve-a),r=o<0?-57*Math.sinh(5.5*-o):347*Math.sinh(3.4*o);for(let t=0;t<=ee;t++){const l=-.35+1.35*t/ee,u=100+237*Math.sinh(4.2*l),m=(e*(ee+1)+t)*3;De[m]=u,De[m+1]=0,De[m+2]=r}e%48===47&&await h.yield()}const he=new Uint32Array(ee*ve*6);for(let e=0,a=0;e<ve;e++){for(let o=0;o<ee;o++){const r=e*(ee+1)+o,t=r+1,l=r+ee+1,u=l+1;he[a++]=r,he[a++]=l,he[a++]=t,he[a++]=t,he[a++]=l,he[a++]=u}e%48===47&&await h.yield()}const Ye=new s.BufferGeometry;Ye.setAttribute("position",new s.BufferAttribute(De,3)),Ye.setIndex(new s.BufferAttribute(he,1));const Yt=new s.ShaderMaterial({uniforms:n,vertexShader:Lo,fragmentShader:Do,side:s.DoubleSide}),Ue=new s.Mesh(Ye,Yt);Ue.frustumCulled=!1,R.add(Ue),await h.yield();const Ze=new s.PlaneGeometry(36e3,36e3,4,4);Ze.rotateX(-Math.PI/2),Ze.translate(-3700,0,2300);const Ut=new s.ShaderMaterial({uniforms:n,vertexShader:zo,fragmentShader:Co,side:s.DoubleSide}),$e=new s.Mesh(Ze,Ut);$e.frustumCulled=!1,R.add($e);const Zt=new s.ShaderMaterial({uniforms:n,vertexShader:Ro,fragmentShader:Ao,side:s.DoubleSide,depthWrite:!1}),Ne=new s.Mesh(new s.SphereGeometry(1,48,24),Zt);Ne.frustumCulled=!1,Ne.renderOrder=-10,R.add(Ne),await h.yield();const I=D(15.4,3.15,1.3),He=4.2,ge=e=>new s.Color(e),V=ge("#1F8FD6"),Fe=ge("#3FD0E8"),We=ge("#E0762B"),Qe=ge("#F4EFE4"),te=ge("#161A26"),ue=ge("#12508F"),Me=(e,a,o)=>e.clone().lerp(a,fe(o)),zt=()=>({p:[],n:[],c:[],i:[]}),Je=(e,a,o,r,t,l,u,m,c=18,w=12)=>{const y=e.p.length/3;for(let f=0;f<=w;f++)for(let g=0;g<=c;g++){const z=M*g/c,k=Math.PI*f/w,H=Math.sin(k)*Math.cos(z),G=Math.sin(k)*Math.sin(z),T=Math.cos(k);e.p.push(a+t*H,o+l*G,r+u*T);const F=H/t,O=G/l,P=T/u,W=Math.hypot(F,O,P)||1;e.n.push(F/W,O/W,P/W);const Q=m(H,G,T);e.c.push(Q.r,Q.g,Q.b)}for(let f=0;f<w;f++)for(let g=0;g<c;g++){const z=y+f*(c+1)+g,k=z+1,H=z+c+1,G=H+1;e.i.push(z,H,k,k,H,G)}},Ie=(e,a,o,r=1)=>{const t=e.p.length/3;for(let l=0;l<a.length;l++)e.p.push(...a[l]),e.n.push(0,r,0),e.c.push(o[l].r,o[l].g,o[l].b);for(let l=1;l+1<a.length;l++)e.i.push(t,t+l,t+l+1)},Rt=e=>{const a=new s.BufferGeometry;a.setAttribute("position",new s.Float32BufferAttribute(e.p.map(r=>r*He),3)),a.setAttribute("normal",new s.Float32BufferAttribute(e.n,3));const o=e.c.slice();for(let r=0;r<o.length;r+=3){const t=e.n[r],l=e.n[r+1],u=e.n[r+2],m=.66+.5*Math.max(0,.35*t+.75*l+.56*u)+.14*Math.max(0,-l);for(let c=0;c<3;c++)o[r+c]=Math.min(1,o[r+c]*1.25*m+.03)}return a.setAttribute("color",new s.Float32BufferAttribute(o,3)),a.setIndex(e.i),a},At=(e,a)=>.5+.5*Math.sin(e*23+1)*Math.sin(a*31+2),X=zt();Je(X,0,0,0,.034,.036,.075,(e,a,o)=>a>.12?Me(V,Fe,(a-.3)*.9*At(e,o)+(Math.abs(e)<.25?.5:0)):Me(We,Qe,(o-.55)*3)),Je(X,0,.018,.085,.03,.03,.037,(e,a,o)=>a>.18?Me(ue,Fe,At(e*3,o*3)*.9):a>-.25&&o>-.1?We:a>-.25?Qe:Me(Qe,We,-o*1.5),16,10);for(const e of[1,-1])Je(X,.024*e,.026,.101,.0055,.0055,.0055,()=>te,8,6);{const e=X.p.length/3,a=8;for(let o=0;o<=a;o++){const r=M*o/a,t=Math.cos(r),l=Math.sin(r);X.p.push(.0095*t,.017+.008*l,.112,0,.012,.212),X.n.push(t,l,.1,t,l,.1);const u=l<-.5?Me(te,We,.6):te;X.c.push(u.r,u.g,u.b,te.r,te.g,te.b)}for(let o=0;o<a;o++){const r=e+o*2;X.i.push(r,r+2,r+1,r+1,r+2,r+3)}}for(let e=-2;e<=2;e++){const a=e*.2;Ie(X,[[.008*e,.006,-.062],[.008*e+.009,.006,-.07],[Math.sin(a)*.062+.006,.004+.001*Math.abs(e),-.062-Math.cos(a)*.058],[Math.sin(a)*.062-.006,.004+.001*Math.abs(e),-.062-Math.cos(a)*.058],[.008*e-.009,.006,-.07]],[V,V,ue,ue,V])}const $t=Rt(X),Ct=new s.MeshBasicMaterial({vertexColors:!0,side:s.DoubleSide,color:15132390}),ce=new s.Group;ce.position.copy(I),ce.rotation.set(-.85,Math.PI,0,"YXZ"),ce.add(new s.Mesh($t,Ct));const Lt=[];for(const e of[1,-1]){const a=zt(),o=t=>t*e;Ie(a,[[0,.002,.036],[o(.072),.002,.034],[o(.118),.002,.012],[o(.078),.002,-.012],[0,.002,-.022]],[Fe,Fe,V,V,V]);for(let t=0;t<5;t++){const l=.004+.0145*t,u=-.058-.004*t;Ie(a,[[o(l),5e-4*t,-.01],[o(l+.016),5e-4*t,-.01],[o(l+.017),5e-4*t,u+.006],[o(l+.009),5e-4*t,u],[o(l+.002),5e-4*t,u+.008]],[V,V,ue,te,ue])}for(let t=0;t<7;t++){const l=(-82+13.5*t)*N,u=Math.cos(l),m=Math.sin(l),c=.062+.003*t,w=.076,y=.006,f=.0075,g=.003+6e-4*t;Ie(a,[[o(w+m*f),g,y-u*f],[o(w-m*f),g,y+u*f],[o(w+u*c*.86-m*f*.8),g,y+m*c*.86+u*f*.8],[o(w+u*c),g,y+m*c],[o(w+u*c*.9+m*f*.8),g,y+m*c*.9-u*f*.8]],[V,V,ue,te,ue])}const r=new s.Mesh(Rt(a),Ct);r.position.set(.028*e*He,.02*He,.01*He),r.userData.sgn=e,ce.add(r),Lt.push(r)}R.add(ce),await h.yield();const Dt=[],et=[];for(let e=0;e<48;e++)et.push(i());const Y=15,Nt=et[0]*M,Ht=e=>Math.pow(.5+.5*Math.cos(Y*e+.5*Math.sin(3*e+Nt)),.38),Qt=e=>.6*(.78+.22*Ht(e))*(.9+.2*et[1+(Math.floor(e/M*Y+.5)%Y+Y)%Y]),Ft=(e,a)=>{const o=Ht(e),r=.25+.1*Math.pow(a,1.6)+.035*a*a*o;return[r*Math.cos(e),Qt(e)*a+.012,r*Math.sin(e)]},Jt=(e,a)=>{const o=.9*a,r=o<.25?-.05*(1-o/.25*(o/.25)):.035*Math.exp(-((o-.52)/.1)*((o-.52)/.1))-.02*Math.exp(-((o-.33)/.06)*((o-.33)/.06));return[o*Math.cos(e),r+.012,o*Math.sin(e)]},tt=150,Wt=(e,a)=>{for(let o=0;o<a;o++)for(let r=0;r<tt;r++){const t=M*r/tt,l=M*(r+1)/tt,u=o/a,m=(o+1)/a,c=e(t,u),w=e(l,u),y=e(t,m),f=e(l,m);Dt.push(...c,...w,...y,...w,...f,...y)}};Wt(Ft,9),Wt(Jt,14),await h.yield();const ot=new s.BufferGeometry;ot.setAttribute("position",new s.Float32BufferAttribute(Dt,3)),ot.computeVertexNormals();const eo=new s.ShaderMaterial({uniforms:n,side:s.DoubleSide,transparent:!0,depthWrite:!1,vertexShader:`
      uniform float uMirror; varying vec3 vW; varying float vY, vR;
      void main() { vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vY = position.y; vR = length(position.xz); gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:`
      uniform vec3 uAmbSky, uKeyCol, uKeyDir, uSkyHor, uSkyZen; uniform vec2 uCrown; uniform float uKeyOn, uMirror; varying vec3 vW; varying float vY, vR;
      void main() {
        vec3 dx = dFdx(vW), dy = dFdy(vW); vec3 n = cross(dx, dy); float nl = length(n);
        vec3 N = nl > 1e-9 ? n / nl : vec3(0., 1., 0.);
        vec3 V = normalize(cameraPosition - vW); if (dot(N, V) < 0.) N = -N;
        float fres = 0.06 + 0.94 * pow(1. - max(dot(N, V), 0.), 3.);
        vec3 L = vec3(uKeyDir.x, uKeyDir.y, uKeyDir.z * uMirror);
        float sp = pow(max(dot(reflect(-L, N), V), 0.), 40.);
        vec3 c = mix(vec3(0.05, 0.26, 0.27), vec3(0.30, 0.62, 0.58), smoothstep(0., 0.6, vY)) * (uAmbSky * 1.3 + uKeyCol * uKeyOn * 0.25);
        c = mix(c, mix(uSkyHor, uSkyZen, 0.35) * 1.15, fres) + uKeyCol * uKeyOn * sp * 0.9;
        vec2 od = vW.xz - uCrown;
        float rim = smoothstep(0.3, 0.62, vY) * (0.35 + 0.65 * clamp(dot(od / max(length(od), 1e-4), L.xz) + 0.4, 0., 1.));
        c += uKeyCol * uKeyOn * 0.16 * rim;                     // the thin rim and its fingers are bright on the sunward side
        gl_FragColor = vec4(c, (mix(0.26, 0.8, smoothstep(0.02, 0.14, vY)) + 0.2 * max(max(fres, sp), rim)) * (1. - smoothstep(0.6, 0.86, vR)));
      }`}),ze=new s.Mesh(ot,eo);ze.position.set(I.x,0,I.z),R.add(ze),n.uCrown={value:new s.Vector2(I.x,I.z*K)};const Ke=90+Math.round(q(1500,2600,fe((S-.6)/.4))),Te=new Float32Array(Ke*3),Pe=new Float32Array(Ke*3),It=new Float32Array(Ke);for(let e=0;e<Ke;e++){let a,o,r,t=0,l=0,u=0,m;if(e<60){const c=(e+i()*.6)/60;o=q(.1,I.y-.2,c),a=I.x+(i()-.5)*.1+.07*Math.sin(c*9),r=I.z+(i()-.5)*.1,l=-Math.sqrt(19.6*Math.max(I.y-o,0))*.5,m=.09+.12*i()}else if(e<90){let c=i()*M,w=.7+i()*.3;if(o=.6+i()*.9,m=.05+.06*i(),e<60+2*Y){const y=(e-60)%Y,f=e>=60+Y?1:0;c=M*y/Y;for(let z=0;z<3;z++)c=(M*y-.5*Math.sin(3*c+Nt))/Y;const g=Ft(c,1);w=2.2*Math.hypot(g[0],g[2])+.05+.16*f,o=2*g[1]+.07+.2*f+.1*f*(w-.8),m=f?.035+.02*(m*10):.075}a=I.x+w*Math.cos(c),r=I.z+w*Math.sin(c),t=Math.cos(c)*.8,u=Math.sin(c)*.8,l=1+i()*1.5}else{a=q(8,112,i());const c=(a-4)/112,w=3.6*p(0,.07,c)*(1-p(.9,1,c))*(.86+.14*Math.sin(a*.23+.6)),y=.4*w,f=fe(.5+.1*Math.sin(a*.19+1)),g=(.25+.75*i())*(.7+2.4*f),z=Math.pow(i(),1.7);o=w-y*(1-Math.cos(g))+.05+z*2.6,r=-7+2.6*Math.cos(M*(a-34)/52)+1.35*y*Math.sin(g)+.35*y*f*g+(i()-.5)*.9-z*1.3,t=(i()-.5)*1.5,l=1+4*i(),u=3+9*i(),m=.045+.13*i()*i()}Te[e*3]=a,Te[e*3+1]=o,Te[e*3+2]=r,Pe[e*3]=t,Pe[e*3+1]=l,Pe[e*3+2]=u,It[e]=m}const Be=new s.BufferGeometry;Be.setAttribute("position",new s.BufferAttribute(Te,3)),Be.setAttribute("aV",new s.BufferAttribute(Pe,3)),Be.setAttribute("aS",new s.BufferAttribute(It,1)),n.uPx={value:400};const to=new s.ShaderMaterial({uniforms:n,transparent:!0,depthWrite:!1,vertexShader:`
      attribute vec3 aV; attribute float aS; uniform float uTb, uSea, uMirror, uPx; varying float vA;
      void main() {
        vec3 p = position + aV * uTb; p.y -= 4.9 * uTb * uTb;
        vA = step(uSea + 0.02, p.y);
        vec4 mv = viewMatrix * vec4(p.x, p.y, p.z * uMirror, 1.);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = min(max(2.5, aS * uPx / max(-mv.z, 0.05)), 0.035 * uPx) * vA;
      }`,fragmentShader:`
      uniform vec3 uAmbSky, uKeyCol; uniform float uKeyOn; varying float vA;
      void main() {
        vec2 q = gl_PointCoord * 2. - 1.; float r2 = dot(q, q);
        if (r2 > 1. || vA < 0.5) discard;
        float rim = smoothstep(0.35, 1., r2);
        float spec = exp(-dot(q - vec2(-0.35, -0.38), q - vec2(-0.35, -0.38)) * 14.);
        vec3 c = uAmbSky * (0.7 + 1.3 * rim) * 0.6 + uKeyCol * uKeyOn * (0.1 + 0.12 * rim + 1.6 * spec);
        gl_FragColor = vec4(c, 0.45 + 0.5 * max(rim, spec));
      }`}),at=new s.Points(Be,to);at.frustumCulled=!1,R.add(at),await h.yield();const qe=150,de=40,Ge=new Float32Array((qe+1)*(de+1)*3),Kt=[];for(let e=0;e<=qe;e++)for(let a=0;a<=de;a++){const o=(e*(de+1)+a)*3;Ge[o]=q(4,116,e/qe),Ge[o+1]=a/de,Ge[o+2]=0}for(let e=0;e<qe;e++)for(let a=0;a<de;a++){const o=e*(de+1)+a,r=o+1,t=o+de+1,l=t+1;Kt.push(o,t,r,r,t,l)}const st=new s.BufferGeometry;st.setAttribute("position",new s.BufferAttribute(Ge,3)),st.setIndex(Kt);const oo=`
    uniform sampler2D uNz; uniform float uTb, uSea, uMirror, uSwSurf; varying vec3 vW; varying float vS, vH, vC;
    void main() {
      float x = position.x, s = position.y, f = (x - 4.) / 112.;
      float fall = smoothstep(1.0, 1.9, uTb);
      float H = 3.6 * smoothstep(0., 0.07, f) * (1. - smoothstep(0.9, 1., f)) * (0.86 + 0.14 * sin(x * 0.23 + 0.6)) * (1. - 0.92 * fall);
      float c = clamp(0.5 + 0.95 * uTb + 0.1 * sin(x * 0.19 + 1.), 0., 1.);        // how far the lip has come over
      float la = (0.7 + 2.4 * c) * (0.84 + 0.36 * textureLod(uNz, vec2(x / 7., 0.37), 0.).r), R = 0.4 * H, th = 0.09 * H, Ri = R - th;
      float thr = 0.35 * R * c;
      float z, y;
      if (s < 0.3) { float a = s / 0.3; z = -9. * (1. - a); y = H * a * a * (3. - 2. * a) - 0.15 * (1. - a); }
      else if (s < 0.55) { float an = (s - 0.3) / 0.25 * la; z = 1.35 * R * sin(an) + thr * an; y = H - R * (1. - cos(an)); }
      else if (s < 0.75) { float an = (1. - (s - 0.55) / 0.2) * la; z = 1.35 * Ri * sin(an) + thr * an; y = H - th - Ri * (1. - cos(an)); }
      else { float q = (s - 0.75) / 0.25; z = -0.42 * H * sin(3.14159 * q) * (1. - q) + 1.7 * H * q * q; y = (H - th) * (1. - q) * (1. - q) * (1. + 0.5 * q) - 0.15 * q; }
      float zc = -7. + 2.6 * cos(6.2831853 * (x - 34.) / 52.);
      y += 0.3 * smoothstep(0.3, 0.9, uTb) * (1. - 0.6 * fall) * sin(x * 1.7 + s * 9.) * sin(x * 0.63 + 1.) * smoothstep(0., 0.07, f) * (1. - smoothstep(0.9, 1., f)) * step(0.02, s) * step(s, 0.98);
      vec3 q3 = vec3(x, uSea + y * uSwSurf - 2. * (1. - uSwSurf), zc + 5. * uTb + z);
      vW = q3; vS = s; vH = y / 3.6; vC = c;
      gl_Position = projectionMatrix * viewMatrix * vec4(q3.x, q3.y, q3.z * uMirror, 1.);
    }`,ao=`
    uniform sampler2D uHt, uCl, uNz; uniform vec3 uCam, uAmbSky, uKeyCol, uKeyDir, uSkyHor, uSkyZen; uniform float uKeyOn, uTb, uMirror;
    varying vec3 vW; varying float vS, vH, vC;
    void main() {
      vec3 dx = dFdx(vW), dy = dFdy(vW); vec3 n = cross(dx, dy); float nl = length(n);
      vec3 N = nl > 1e-9 ? n / nl : vec3(0., 1., 0.);
      vec3 V = normalize(uCam - vW); if (dot(N, V) < 0.) N = -N;
      float fres = 0.04 + 0.96 * pow(1. - max(dot(N, V), 0.), 4.);
      vec3 lit = (uAmbSky * 1.5 + uKeyCol * uKeyOn * 0.3) * 0.3183;
      float n1 = textureLod(uHt, vW.xz * vec2(0.11, 0.5), 0.).r, n2 = textureLod(uHt, vec2(vW.x * 0.9, vW.y * 0.35 + vW.z * 0.2) + 0.3, 0.).r;
      // thin water lets the low sun through: the lip and the top of the face glow green
      float thin = smoothstep(0.3, 1., vH) * step(0.3, vS);
      vec3 glass = mix(vec3(0.045, 0.21, 0.22), vec3(0.17, 0.52, 0.43), thin) * lit * 1.5 + uKeyCol * uKeyOn * vec3(0.07, 0.36, 0.25) * thin * thin * 0.2;
      glass *= 0.78 + 0.5 * n2;                                    // water drawn up the face in streaks
      glass *= vS > 0.75 ? mix(0.5, 1.12, smoothstep(0.03, 0.45, (vS - 0.75) * 4.)) : (vS > 0.55 ? 0.62 : 1.);   // dark under the lip, bright lower down the face
      vec3 back = mix(vec3(0.03, 0.14, 0.20), vec3(0.08, 0.30, 0.30), smoothstep(0.4, 1., vH)) * lit * 1.4;
      vec3 c = vS < 0.3 ? mix(back, mix(uSkyHor, uSkyZen, 0.6), fres * 0.45) : mix(glass, uSkyHor, fres * 0.3 * step(vS, 0.55));
      // the apron in front of the wave dies into the sea: it takes the sea's own colour, and its edge is foam lace, never a cut
      float qa = clamp((vS - 0.75) / 0.25, 0., 1.);
      vec3 seaC = mix(vec3(0.045, 0.19, 0.26) * lit * 1.15, mix(uSkyHor, uSkyZen, 0.45) * 0.8, fres);
      c = mix(c, seaC, step(0.75, vS) * smoothstep(0.2, 0.85, qa));
      float apn = (vS - 0.8) * 5. - 1.05 * textureLod(uNz, vW.xz / 6., 0.).r - 0.4 * textureLod(uNz, vW.xz / 1.4, 0.).r + 0.12;
      if (vS > 0.8 && apn > 0.) discard;
      float fringe = step(0.8, vS) * smoothstep(-0.34, -0.04, apn);
      float fallF = smoothstep(1.15, 2.0, uTb);
      if (textureLod(uNz, vW.xz / 3.3, 0.).r + 0.35 * textureLod(uNz, vW.xz / 0.9, 0.).r < fallF * 0.8) discard;
      float sp = pow(max(dot(reflect(-uKeyDir, N), V), 0.), 60.);
      c += uKeyCol * uKeyOn * sp * 0.4;
      // white: along the lip's edge, feathering off the crest, streaks drawn up the face; then all of it, as it falls
      float t = vS < 0.55 ? (vS - 0.3) / 0.25 : 1. - (vS - 0.55) / 0.2;
      float lipIn = step(0.3, vS) * step(vS, 0.75);
      // the lip's edge is a thinning sheet torn into fingers and holes: no straight line anywhere
      float fgr = textureLod(uNz, vec2(vW.x / 4.2, 0.37), 0.).r * 0.7 + textureLod(uNz, vec2(vW.x / 1.3, 0.81), 0.).r * 0.5;
      if (lipIn > 0.5 && t > 0.56 + 0.62 * smoothstep(0.38, 0.78, fgr)) discard;
      if (lipIn > 0.5 && t > 0.45 && textureLod(uNz, vec2(vW.x / 0.9, t * 1.7), 0.).r > 0.7 - 0.12 * t) discard;
      float foam = lipIn * smoothstep(0.45 - 0.4 * n1 - 0.6 * smoothstep(0.1, 0.8, uTb), 0.8, t);
      foam = max(foam, smoothstep(0.2, 0.3, vS) * step(vS, 0.34) * smoothstep(0.25, 0.6, n2) * 0.8);
      float q = clamp((vS - 0.75) / 0.25, 0., 1.);
      foam = max(foam, step(0.75, vS) * smoothstep(0.5, 1., q) * 0.12 * smoothstep(0.45, 0.6, textureLod(uNz, vW.xz / 4., 0.).r));
      foam = max(foam, fringe * 0.95 * smoothstep(0.3, 0.55, textureLod(uNz, vW.xz / 2.3 + 0.2, 0.).r));
      float ww = 0.88 * smoothstep(0.1, 0.8, uTb);
      foam = mix(foam, 1., ww * smoothstep(0.05, 0.5, vH * 3. + 0.5 * n1 - 0.2 + ww));
      float fz = textureLod(uNz, vW.xz / 1.9 + vW.y * 0.6, 0.).r * 0.6 + textureLod(uNz, vW.xz / 7. - vW.y * 0.2, 0.).r * 0.5;
      c = mix(c, mix(vec3(0.50, 0.66, 0.70), vec3(0.93, 0.95, 0.94), smoothstep(0.35, 0.75, fz)) * lit * 2.5 * (0.7 + 0.3 * N.y), clamp(foam, 0., 1.));
      gl_FragColor = vec4(c, 1.);
    }`,so=new s.ShaderMaterial({uniforms:n,side:s.DoubleSide,vertexShader:oo,fragmentShader:ao}),rt=new s.Mesh(st,so);rt.frustumCulled=!1,R.add(rt),await h.yield();const Tt=[],Pt=new s.CylinderGeometry(.26,.46,1,7,1);Pt.translate(0,.5,0);const ro=new s.MeshStandardMaterial({color:10128506,roughness:.9,side:s.DoubleSide}),Re=new s.InstancedMesh(Pt,ro,7);Re.frustumCulled=!1,R.add(Re);for(let e=0;e<7;e++){const a=62+e*25+i.range(-6,6),o=i.range(36,50),r=i.range(5,9),t=i.range(.55,1),l=i.range(0,M),u=D(Math.cos(l)*Math.cos(t),Math.sin(t),Math.sin(l)*Math.cos(t));Tt.push({base:D(a,(o-25)/20-.15,o),dir:u,len:r,lift:Le.tide*(.25+Math.floor(e*.6)),drift:i.range(.6,1.4)})}const nt=[],it=[],lt=[],no=[-122,-3,4.5];for(let e=-6;e<=6;e++)for(let a=-6;a<=6;a++){const o=(a+(e&1)*.5)*2,r=e*1.732,t=Math.hypot(o,r);if(t>9.3)continue;const l=i(),u=i(),m=i();let c=32-.42*Math.pow(Math.max(0,t-4.5),1.7)+(t<4.5?.5*Math.floor(l*2.99)-.9:1.6*(l-.5));t>7.2&&u<.4&&(c-=5+16*m);const w=1.175,y=.78+.44*m,f=.08*(u-.5),g=no.concat([c]);for(let z=0;z<6;z++){const k=f+M*z/6,H=f+M*(z+1)/6,G=o+w*Math.cos(k),T=r+w*Math.sin(k),F=o+w*Math.cos(H),O=r+w*Math.sin(H),P=y*(.92+.16*(z*7%3)/2);for(let W=0;W<3;W++){const Q=g[W],B=g[W+1];nt.push(G,Q,T,G,B,T,F,Q,O,F,Q,O,G,B,T,F,B,O),lt.push(-1,0,-1,0,1,0,1,0,-1,0,1,0);for(let _=0;_<6;_++)it.push(P,P,P)}nt.push(o,c+.12*(l-.5),r,F,c+.1*Math.sin(H+u*6),O,G,c+.1*Math.sin(k+u*6),T),lt.push(0,1,1,1,1,1);for(let W=0;W<3;W++)it.push(y*1.25,y*1.25,y*1.25)}}const Ae=new s.BufferGeometry;Ae.setAttribute("position",new s.Float32BufferAttribute(nt,3)),Ae.setAttribute("aTone",new s.Float32BufferAttribute(it,3)),Ae.setAttribute("aE",new s.Float32BufferAttribute(lt,2)),Ae.computeVertexNormals();const io=new s.ShaderMaterial({uniforms:n,side:s.DoubleSide,vertexShader:`
      attribute vec3 aTone; attribute vec2 aE; varying vec3 vW, vN, vL; varying vec2 vE; varying float vT;
      void main() {
        vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vL = position; vE = aE; vT = aTone.r;
        vN = mat3(modelMatrix) * normal;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,fragmentShader:`
      uniform sampler2D uNz; uniform vec3 uKeyDir, uKeyCol, uAmbSky, uAmbGnd, uSkyHor, uSkyZen, uFogCol, uBandCol; uniform float uKeyOn, uMirror, uSwDay;
      varying vec3 vW, vN, vL; varying vec2 vE; varying float vT;
      void main() {
        float nl = length(vN); vec3 N = nl > 1e-6 ? vN / nl : vec3(0., 1., 0.);
        vec3 V = normalize(cameraPosition - vW); if (dot(N, V) < 0.) N = -N;
        vec3 L = vec3(uKeyDir.x, uKeyDir.y, uKeyDir.z * uMirror);
        float n1 = textureLod(uNz, vec2(atan(vL.z, vL.x + (abs(vL.x) + abs(vL.z) < 1e-4 ? 1e-4 : 0.)) * 0.8, vL.y * 0.02), 0.).r;
        float n2 = textureLod(uNz, vec2(vL.x + vL.z, vL.y * 0.35) * 0.11, 0.).r;
        float y = vL.y + 1.6 * (n1 - 0.5);
        // basalt: cool grey, cross-jointed; below it the pale tide stain, the green weed belt, the dark foot
        float joint = smoothstep(0.47, 0.5, abs(fract(vL.y * 0.31 + 3. * vT + 0.4 * n2) - 0.5)) * (1. - vE.y);
        vec3 alb = vec3(0.21, 0.225, 0.26) * vT * (0.82 + 0.4 * n2) * (1. - 0.3 * joint);
        alb = mix(alb, vec3(0.50, 0.46, 0.37) * (0.8 + 0.4 * n2), (1. - smoothstep(4.2, 7.5, y)) * 0.85);       // tide stain
        alb = mix(alb, vec3(0.045, 0.075, 0.03) * (0.7 + 0.9 * n2), 1. - smoothstep(0.6, 2.2, y));                // weed
        alb = mix(alb, vec3(0.06, 0.065, 0.08), 1. - smoothstep(-9., -3.5, y));                                 // never dried
        float ndl = dot(N, L);
        float key = smoothstep(-0.05, 0.6, ndl);
        float lum = clamp(dot(uAmbSky, vec3(0.9)) + 0.05, 0.06, 1.);
        float edge = smoothstep(0.8, 0.98, abs(vE.x));
        float crev = 1. - 0.45 * smoothstep(0.55, 0.8, abs(vE.x)) * (1. - edge) * (1. - vE.y);                   // the joints between columns are dark
        vec3 amb = mix(uAmbGnd * 0.8, uAmbSky * 2.2, N.y * 0.3 + 0.7) + vec3(0.14, 0.18, 0.3) * lum;             // the sky and the sea fill its shadows: deep blue, never black
        vec3 c = alb * (uKeyCol * uKeyOn * key * 0.95 + amb * crev) * 0.3183;
        c += alb * uKeyCol * uKeyOn * 0.55 * edge * smoothstep(-0.3, 0.5, ndl) * 0.3183;                         // column edges and the rims of the tops catch a thin light
        float fr = pow(1. - clamp(dot(N, V), 0., 1.), 3.);
        c = mix(c, mix(uSkyHor, uSkyZen, 0.3) * 0.55, 0.3 * fr);                                                // wet rock: a sheen of sky
        float dd = distance(vW, cameraPosition);
        c = mix(c, uFogCol, 1. - exp(-dd * dd * 3.6e-7));
        gl_FragColor = vec4(c, 1.);
      }`}),ht=new s.Mesh(Ae,io);ht.position.set(450,0,0),R.add(ht);const lo=new s.MeshStandardMaterial({color:1710624,roughness:.5,metalness:.3,emissive:16767392,emissiveIntensity:.22,side:s.DoubleSide}),Oe=new s.Mesh(new s.TorusGeometry(7.7,.62,12,64),lo);Oe.rotation.y=Math.PI/2,Oe.position.set(450,40,0),R.add(Oe),await h.yield();const ut=Math.round(600*Math.max(.5,S)),Ee=new Float32Array(ut*3),Ve=new Float32Array(ut*3);for(let e=0;e<ut;e++)Ee[e*3]=i.range(395,470),Ee[e*3+1]=40+i.range(-9,9),Ee[e*3+2]=i.range(-16,16),Ve[e*3]=i.range(-.3,.1),Ve[e*3+1]=i.range(-.08,.12),Ve[e*3+2]=i.range(.1,.3);const ct=new s.BufferGeometry;ct.setAttribute("position",new s.BufferAttribute(Ee,3)),ct.setAttribute("aV",new s.BufferAttribute(Ve,3));const ho=new s.ShaderMaterial({uniforms:n,transparent:!0,depthWrite:!1,blending:s.AdditiveBlending,vertexShader:`
      attribute vec3 aV; uniform float uReal, uMirror, uPx; varying float vA;
      void main() {
        vec3 p = position + aV * uReal + 0.25 * sin(uReal * 0.9 + position.zxy * 1.7);
        vec4 mv = viewMatrix * vec4(p.x, p.y, p.z * uMirror, 1.);
        gl_Position = projectionMatrix * mv;
        vA = step(0.0005, uReal) * smoothstep(0.5, 3., -mv.z);
        gl_PointSize = max(2., 0.07 * uPx / max(-mv.z, 0.05)) * vA;
      }`,fragmentShader:`
      uniform vec3 uKeyCol; varying float vA;
      void main() { vec2 q = gl_PointCoord * 2. - 1.; float a = 1. - dot(q, q); if (a < 0. || vA < 0.01) discard; gl_FragColor = vec4(uKeyCol * 0.5 * a * vA, 1.); }`}),dt=new s.Points(ct,ho);dt.frustumCulled=!1,R.add(dt),await h.yield();const b=e=>new s.Color(e),v={dayZen:b("#2F68B4"),dayHor:b("#A9BFD8"),nightZen:b("#0C1430"),nightHor:b("#22365E"),dusk:b("#F08A4B"),endZen:b("#3A1A1C"),endHor:b("#B8683C"),keyDay:b("#FFE2B0"),keyLow:b("#F08A4B"),keyNight:b("#8FA6D8"),keyMean:b("#FFE2A8"),keyWhite:b("#FFF4E0"),keyYel:b("#FFB05A"),keyRed:b("#D2452A"),hemiSky:b("#9DB6D6"),violet:b("#5A5FA8"),mauve:b("#7A5A78"),gndViolet:b("#4A4468"),hemiGnd:b("#6B5A45"),haze:b("#C9B89A"),bandGold:b("#F2C14E"),bandWhite:b("#FFF4E0"),bandOr:b("#E0762B"),bandRed:b("#B3261A"),discRed:b("#E2502C")},me=new s.Color,mt=new s.Color,we=D(),Bt=D(),ft=D(),_e=D(),qt=new s.Matrix4,Gt=new s.Quaternion,uo=D(0,1,0),oe=D(),ye=D(),co=D(),mo=D(.25,.85,-.35).normalize(),Ot=new s.Vector2,A={clock:null,keyDir:D(0,1,0),keyColor:new s.Color,keyIntensity:1,hemiSky:new s.Color,hemiGnd:new s.Color,hemiIntensity:.55,fog:new s.Color,sunDir:we},Et=(e,a,o)=>{if(o<=a[0][0])return e.copy(a[0][1]);for(let r=1;r<a.length;r++)if(o<=a[r][0])return e.copy(a[r-1][1]).lerp(a[r][1],(o-a[r-1][0])/(a[r][0]-a[r-1][0]));return e.copy(a[a.length-1][1])},Vt=U*N,pt=11*N,fo=Math.acos(Math.max(-1,Math.min(1,(Math.sin(13*N)-Math.sin(pt)*Math.sin(Vt))/(Math.cos(pt)*Math.cos(Vt))))),vt=!!d.rare,po={ph:{},sw:{},f:{}},vo=[[.1,v.bandGold],[.87,v.bandWhite],[5,v.bandGold],[6.4,v.bandOr],[7.5,v.bandRed]],go=[[.1,v.keyMean],[.87,v.keyWhite],[5,v.keyYel],[7.5,v.keyRed]];function wo(e,a,o,r){const t=ko(e,a,po);A.clock=t;const l=t.t,u=1-t.sw.day,m=1-t.sw.year,c=t.gyr;n.uTb.value=t.Tb,n.uPhSurf.value=t.ph.surf,n.uSwSurf.value=t.sw.surf*t.wet,n.uPhCloud.value=t.ph.cloud,n.uSwCloud.value=t.sw.cloud,n.uPhDune.value=t.ph.dune,n.uSwDune.value=t.sw.dune,n.uRiverA.value=55*N*Math.sin(M*t.ph.river),n.uRiverSpit.value=Math.cos(M*t.ph.river),n.uSwRiver.value=t.sw.river*t.wet;const w=vt?p(31.4,32.7,l)*(1-.94*p(33.1,34.3,l)):0;n.uIsland.value=w,n.uIsleHot.value=vt?p(31.4,31.9,l)*(1-p(32.5,33.2,l)):0,n.uShore.value=vt?0:300*Math.sin(M*t.ph.shore)*t.sw.shore;const y=t.glacial*t.sw.ice*t.wet;n.uIceG.value=d.noIce?0:y,n.uIceR.value=Math.pow(y,.35),n.uIceMean.value=d.noIce?0:1-t.sw.ice,n.uPhRange.value=t.ph.range,n.uSwRange.value=t.sw.range;const f=Math.cos(M*t.ph.year),g=23.44*N*f;n.uSwYear.value=t.sw.year,n.uSinDs.value=Math.sin(g),n.uSnowLine.value=(d.snowBase||1500)+900*f,n.uWet.value=t.wet,n.uSalt.value=1-t.wet;const z=1.5*Math.sin(M*t.ph.tide)*t.sw.tide*t.wet;n.uSea.value=z-120*p(.12,.9,y)-200*(1-t.wet),n.uReal.value=t.real,n.uHardKey.value=t.stopped?0:p(31,32,l),n.uKeyOn.value=1,t.stopped?gt(C,pt,fo,we):gt(C,g,60*N+M*t.ph.day,we),n.uSunDir.value.copy(we),n.uSwDay.value=t.sw.day;const k=we.y,H=p(-.1,.16,k),G=Math.exp(-(k/.2)*(k/.2)),T=p(5,7.5,c);n.uBandHalf.value=q(23.44,30,p(3,7.5,c))*N,Et(n.uBandCol.value,vo,c),n.uDiscR.value=(t.stopped?30:.75)*N,n.uDiscI.value=t.stopped?1:7,t.stopped?n.uDiscCol.value.copy(v.discRed):n.uDiscCol.value.copy(v.keyLow).lerp(v.keyDay,p(.02,.3,k)),n.uMoonD.value=28*N*Math.sin(M*t.ph.moon),n.uSwMoon.value=t.sw.moon,n.uMoonI.value=t.stopped?0:1-T,n.uStarRot.value=t.ph.day,n.uNight.value=(1-p(-.16,-.02,k))*t.sw.day+(t.stopped,0);const F=q(H,.78,u);me.copy(v.nightZen).lerp(v.dayZen,F),mt.copy(v.nightHor).lerp(v.dayHor,F),mt.lerp(v.dusk,.55*G*(1-u)*p(-.14,0,k)),n.uSkyZen.value.copy(me).lerp(v.endZen,T*.9),n.uSkyHor.value.copy(mt).lerp(v.endHor,T*.85),n.uGlowCol.value.copy(n.uDiscCol.value).multiplyScalar(t.stopped?.1:.9*p(-.12,.05,k)),ft.copy(we),k<.06&&ft.lerp(mo,p(.06,-.06,k)).normalize(),gt(C,g*(1-m),0,Bt),A.keyDir.copy(ft).lerp(Bt,t.stopped?0:u).normalize(),A.keyDir.y<.1&&(A.keyDir.y=.1,A.keyDir.normalize());const O=A.keyColor;O.copy(v.keyLow).lerp(v.keyDay,p(.03,.4,k)).multiplyScalar(2.4*H),me.copy(v.keyNight).multiplyScalar(.62*2.4*(1-H)),O.add(me),Et(me,go,c),me.multiplyScalar(t.stopped?5:2.2),O.lerp(me,t.stopped?1:u),A.keyIntensity=1,A.hemiSky.copy(v.hemiSky).lerp(v.violet,.8*n.uHardKey.value).lerp(v.mauve,T*.8),A.hemiGnd.copy(v.hemiGnd).lerp(v.gndViolet,.6*n.uHardKey.value),A.hemiIntensity=.55*q(.6,1,F)*(t.stopped?1.5:1),n.uTwi.value=t.stopped?0:t.sw.day*(.5+.8*p(-.36,-.08,k))*(1-p(-.1,-.015,k)),n.uMoonLit.value=1-F,n.uLook.value=Math.max(n.uHardKey.value,t.stopped?0:.8*p(.15,.6,F)),n.uKeyDir.value.copy(A.keyDir),n.uKeyCol.value.copy(O),n.uAmbSky.value.copy(A.hemiSky).multiplyScalar(A.hemiIntensity),n.uAmbGnd.value.copy(A.hemiGnd).multiplyScalar(A.hemiIntensity),A.fog.copy(v.haze).multiplyScalar(.2+.66*F).lerp(n.uSkyHor.value,q(.8,.3,p(0,.4,F))),n.uFogCol.value.copy(A.fog),o.getWorldPosition(_e),n.uCam.value.set(_e.x,_e.y,_e.z*K),r&&(r.getDrawingBufferSize(Ot),n.uPx.value=.5*Ot.y*o.projectionMatrix.elements[5]);const P=t.Tb,W=Math.max(0,P-.25);ce.position.set(I.x-1.5*W,I.y+2.2*W+.03*Math.sin(M*1.5*P),I.z-8*W);for(const B of Lt)B.rotation.z=B.userData.sgn*(.95+.75*Math.sin(M*10*P+.4));const Q=1-p(.03,.4,P);ze.scale.set(2.2*(1+.8*P),Math.max(2*Q,.001),2.2*(1+.8*P)),ze.position.y=n.uSea.value;for(let B=0;B<7;B++){const _=Tt[B],Ce=p(_.lift-.05*Le.tide,_.lift+.12*Le.tide,t.T),_t=p(0,.3,Ce);oe.copy(_.dir),oe.y=q(oe.y,.04,_t),oe.normalize(),ye.set(_.base.x-14*_.drift*Ce,q(_.base.y,n.uSea.value,_t),_.base.z-75*Ce);const je=_.len*(1-p(.55,1,Ce));Gt.setFromUnitVectors(uo,oe),qt.compose(ye,Gt,co.set(1,Math.max(je,.001),1)),Re.setMatrixAt(B,qt),n.uLogs.value[B].set(ye.x,ye.z,0,1-p(0,.25,Ce)),n.uLogTip.value[B].set(ye.x+oe.x*je,oe.y*je,ye.z+oe.z*je)}return Re.instanceMatrix.needsUpdate=!0,A}return{group:R,update:wo,uniforms:n,frame:C,mirror:K,state:A,parts:{land:Ue,sea:$e,sky:Ne,bird:ce,crown:ze,beads:at,breaker:rt,logMesh:Re,stack:ht,ring:Oe,motes:dt}}}export{Le as PERIOD,yo as U_STOP,Ho as buildTenfold,ko as clockAt,Mo as skyFrame,gt as sunFrom};
