import*as t from"three";import{mergeVertices as ot}from"three/addons/utils/BufferGeometryUtils.js";const pt=["#9C4A2E","#F28A1C","#F4EFE2","#C2247E","#D9A441","#4A3328","#7E9463"],De=12,at=10,mt=24.4,Fe=31,st=70,Pe=20*Math.PI/180,He=`
#define NDOME ${De}
#define NCAST ${at}
uniform vec3 uSunDir, uSunCol, uSkyCol, uGndCol, uCam;
uniform float uTime, uFront, uOpen, uGrowth, uApron, uFill;
uniform vec2 uTideDir;
uniform vec4 uSeed, uWash, uSeason;
uniform vec4 uDomes[NDOME];
uniform vec4 uCast[NCAST];
uniform vec4 uCloud, uIsle, uIsleAx, uCb, uCbAx;
uniform vec3 uTune;      // x: opening lag behind the light line (m), y: how deep and blue the shade beyond the line is, z: gain of the sunlit strip on the line
// a long shallow hollow of the flats beside the plan line: x..y = where it begins and ends along the plan (m), z = the lateral of its middle line, w = half its width to the rim
uniform vec4 uHol;
// x = its depth at the middle (m), y = how much of it the rain daisies fill
uniform vec2 uHolK;
// the sky as the world's dome draws it at this moment (standing water mirrors it; see skyMir): zenith, horizon, the true sun
// (under the horizon too), its glow, the rose arch, the cloud field (offset xy, threshold, amount), the cloud's lit and shaded colours,
// the wind the streets lie along, the night
uniform vec3 uZen, uHor, uSunD, uGlow, uCloudCol, uCloudSh;
uniform vec4 uBelt, uCloudP, uWind;
uniform float uNight;
// the bright band of open sky along the horizon under the fog lid: rgb = its colour, a = how much of the sky the lid holds
uniform vec4 uBand;
uniform vec4 uTongue;
uniform vec4 uArc;       // the world's fly line on the plain: an arc (centre xz, radius), w = 1 when set: vygie mats on the plain keep 9 m off it
uniform vec4 uTrack;     // a faint two-track beside the fly line: x = offset to the right (m), y..z = where it runs (local z), w = amount
uniform float uFrac, uWet, uRain;
uniform vec3 uSkyRef, uGlowRef;
uniform float uNite;     // 0..1 night: a long exposure under stars shows the land pale and blue, never black
uniform vec4 uPlan;      // the plan line of the world: x = angle of the arc's start, y = metres flown before the arc
uniform vec4 uRise;      // a low ridge the fly line climbs: x = where along the plan (m), y = half-length, z = height
uniform vec4 uW2;        // a second dry wash that the fly line follows for a while: it lies under the line from x to y (plan metres), swinging in from the left (z) and away to the right (w)
uniform vec4 uPan;       // a rain pan beside the line: x = along the plan, y = lateral, z = water left 0..1, w = amount
uniform vec4 uRefl[8];   // what standing water mirrors: spheres (centre, radius; radius 0 = none): 0 to 3 beside the rain pan, 4 to 7 beside the puddles of the arrival
uniform vec4 uVeilM;     // the rain veils as standing water mirrors them: xy = the bearing they hang on (unit, local xz), z = how much of them there is
uniform vec3 uVeilC;     // their lit colour
uniform vec4 uBull;      // the gemsbok that stands in the pan: xyz = where, w = heading (x 9000 = none)
uniform vec4 uOrange;    // a tongue of the orange flats laid over whatever else would grow there: centre xz, radius, amount
uniform vec4 uMound;     // a heuweltjie: centre xz, radius, height
uniform vec4 uSw[3];     // low swells across the plan line: x = where along the plan (m), y = half-length, z = height, w = 0 a roller across the line, 1 two knolls beside it
uniform float uBias;     // how far the open heads of the instanced tiers turn their faces to the lens (0 = not at all)
uniform vec4 uReal;      // the world's tier of real plants round the lens: x = amount, y = its reach (m): the painted heads thin under it
uniform vec3 uHeu[3];
uniform vec3 cGravel, cOrange, cWhite, cMagenta, cGold, cRock, cGreen;
float h21(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
vec2 h22(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz) * q.zy); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float fbm(vec2 p){ return vn(p) * .5 + vn(p * 2.03 + 7.1) * .25 + vn(p * 4.11 + 3.3) * .125 + vn(p * 8.27 + 1.7) * .0625; }
// the sky along a ray d (unit, d.y >= 0), as the world's dome draws it at this moment: its gradient from horizon to zenith, the sun's
// glow, the rose arch opposite a sun on the horizon, the cloud streets with their lit and shaded sides, and by night a few stars.
// Standing water mirrors this.
vec3 skyMir(vec3 d){
  float elc = max(d.y, 0.);
  vec3 col = mix(uHor, uZen, pow(elc + 1e-4, .42));
  float sd = max(dot(d, uSunD), 0.), s2 = sd * sd, s8 = s2 * s2; s8 *= s8;
  vec2 dxz = d.xz / max(length(d.xz), 1e-4), sxz = uSunD.xz / max(length(uSunD.xz), 1e-4);
  float azf = .5 + .5 * dot(dxz, sxz);
  col += uGlow * (s2 * .1 + s8 * .22) + uGlow * exp(-elc * 8.) * azf * azf * .62;
  float anti = .5 - .5 * dot(dxz, sxz); anti *= anti;
  float bb = (elc - .11) / .08; col += uBelt.rgb * uBelt.a * anti * exp(-bb * bb);
  vec2 cp = d.xz / (elc + .06);
  vec2 cc = vec2(dot(cp, uWind.xy) * .42, dot(cp, vec2(-uWind.y, uWind.x)) * 1.7) + uCloudP.xy;
  float n = fbm(cc);
  float cov = smoothstep(uCloudP.z, uCloudP.z + .16, n) * (1. - smoothstep(7., 14., length(cp))) * uCloudP.w * (1. - .9 * uNight);
  vec3 ccol = mix(uCloudSh, uCloudCol, .55 * (1. - smoothstep(uCloudP.z + .1, uCloudP.z + .42, n) * .6)) + uGlow * (s8 * .35 + azf * azf * exp(-elc * 5.) * .3);
  col = mix(col, ccol, cov);
  vec2 sq = vec2(atan(d.z, d.x + 1e-6) * 23., elc * 30.); vec2 sh = h22(floor(sq) + 13.);
  col += (vec3(.75, .85, 1.) * step(.8, sh.x) * (1. - smoothstep(.05, .22, length(fract(sq) - .25 - .5 * sh))) * 1.2 + vec3(.045, .06, .12) * (.4 + elc)) * uNight;
  return col;
}
// a game path: one sandy trail trodden by the gemsbok, wandering either side of the fly line (the world's path is the line x = 0
// for z < 180 and a 760 m arc beyond); trackC = where its middle runs at local z
float trackC(float z){ float a = max(z - 180., 0.); return uTrack.x - a * a / 1520. + (vn(vec2(z * .021, 7.3)) - .5) * 9. + (vn(vec2(z * .083, 2.1)) - .5) * 2.2; }
float trackAt(vec2 p){
  float d = abs(p.x - trackC(p.y)) + (vn(p * 1.9 + 4.) - .5) * .24;
  return uTrack.w * (1. - smoothstep(.2, .52, d)) * smoothstep(uTrack.y, uTrack.y + 16., p.y) * (1. - smoothstep(uTrack.z - 50., uTrack.z, p.y));
}
// plan coordinates of a ground point: x = metres along the world's plan line, y = metres to the right of it
vec2 planAL(vec2 p){ vec2 q = p - uArc.xy; return vec2(uPlan.y + uArc.z * (uPlan.x - atan(q.y, q.x + 1e-4)), length(q) - uArc.z); }
// the second wash: signed distance from its centre line, and where it exists (0..1)
float wash2D(vec2 al){ float b = max(uW2.x - al.x, 0.), c = max(al.x - uW2.y, 0.); return al.y - (c * c / uW2.w - b * b / uW2.z); }
float wash2Gate(vec2 p, vec2 al){ return uArc.w * smoothstep(566., 600., al.x) * (1. - smoothstep(752., 790., al.x)) * smoothstep(310., 345., length(p)); }
// pools left in its bed: long shallow ones every 46 m (1 inside)
float wash2Pool(vec2 p, vec2 al, float d){
  float q = (fract((al.x - 663.) / 46.) - .5) * 46.;
  return 1. - smoothstep(.72, 1., length(vec2(q / 15., d / 3.1)) + (vn(p * .45 + 3.) - .5) * .5);
}
// the rain pan: x = 1 inside its rim, y = distance from its middle in rim radii
vec2 panAt(vec2 p, vec2 al){
  float dn = length((al - uPan.xy) / vec2(11.5, 6.6)) + (vn(p * .21 + 6.) - .5) * .3 + (vn(p * .9 + 2.) - .5) * .08;
  return vec2((1. - smoothstep(.94, 1., dn)) * uPan.w, dn);
}
// low swells: rollers lying across the plan line (their crests bend a little), or a pair of knolls either side of it
float swellH(vec2 al){
  float h = 0., ly = abs(al.y);
  for (int i = 0; i < 3; i++) {
    float a = al.x + .28 * al.y + 5. * sin(al.y * .055 + float(i) * 2.1);
    float t = clamp(abs(a - uSw[i].x) / max(uSw[i].y, 1.), 0., 1.);
    float lat = mix(1. - .4 * smoothstep(50., 130., ly), .22 + .78 * smoothstep(3., 11., ly) * (1. - smoothstep(20., 38., ly)), uSw[i].w);
    h += uSw[i].z * (.5 + .5 * cos(3.14159265 * t)) * lat;
  }
  return h * (1. - smoothstep(120., 260., ly));
}
// the damp hollow: distance (m) of a plan point from its middle line
float holD(vec2 al){ return length(vec2(max(max(uHol.x - al.x, al.x - uHol.y), 0.), al.y - uHol.z)); }
// the ridge, the damp hollow, the heuweltjie and the swale of the second wash: what they add to the height of the plain
float featH(vec2 p){
  vec2 al = planAL(p);
  float lf = (1. - smoothstep(10., 48., -al.y)) * (1. - smoothstep(70., 150., al.y));
  float h = uRise.z * (1. - smoothstep(0., 1., abs(al.x - uRise.x) / uRise.y)) * lf * uArc.w;
  h -= uHolK.x * (1. - smoothstep(uHol.w * .3, uHol.w, holD(al))) * smoothstep(310., 345., length(p)) * uArc.w;
  h -= 1.05 * (1. - smoothstep(3.2, 8.5, abs(wash2D(al)))) * wash2Gate(p, al);
  h += uMound.w * (1. - smoothstep(0., 1., length(p - uMound.xy) / uMound.z));
  return h + swellH(al) * uArc.w;
}
// the dry wash: signed distance (m, perpendicular) from the centre line of its S-curve
float washD(vec2 p){
  float a = p.x * uWash.z + uWash.w, sl = uWash.y * uWash.z * cos(a);
  return (p.y - (uWash.x + uWash.y * sin(a))) * inversesqrt(1. + sl * sl);
}
// species weights at a ground point: x orange daisy, y white rain daisy (or blue flax), z magenta vygie, w cover 0..1;
// sand: 1 on the bare sandy bed of the wash
vec4 speciesAtW(vec2 p, out float sand){
  float n1 = vn(p * .013 + uSeed.xy), n2 = vn(p * .037 + uSeed.yx * 1.7), n3 = vn(p * .12 + 3.1), n4 = vn(p * .31 + 8.7);
  float e0 = length(p * vec2(.8, 1.)), e = e0 + (n2 - .5) * 26.;
  // bands follow the lie of the land: warped contour stripes round the koppie
  float st = sin((e0 * .05 + (n1 - .5) * 5.5 + (n2 - .5) * 1.5) * 6.2832);
  // the valley floor in front of the koppie holds the last water: every year it is in full bloom, orange, with one band of
  // rain daisies along the wash
  float pk = 1. - smoothstep(70., 104., length((p - vec2(0., 138.)) * vec2(.72, 1.)));
  // the band of rain daisies follows the wash. On the valley floor it swells and pinches along its length and its banks are ragged
  // at three scales, so tongues of the orange flats run into it; down its middle the bed itself is bare red sand, in two braids
  float wS = washD(p);
  float wd = abs(wS + (n2 - .5) * mix(16., 10., pk) + (n3 - .5) * 8. * pk) + (n4 - .5) * 4. * pk;
  float wHalf = mix(8. + uSeason.x, 6. + 7.5 * vn(p * .023 + uSeed.yx), pk);
  float white = 1. - smoothstep(wHalf, wHalf + mix(11. + uSeason.x, 2.4, pk), wd);
  // one tongue of the orange flats can be laid into the band (uTongue: centre xz, radius)
  white *= smoothstep(uTongue.z * .62, uTongue.z * 1.12, length(p - uTongue.xy) + (n3 - .5) * 5. + (n4 - .5) * 2.5);
  float bedw = mix(1.9, 2.2, pk);
  sand = 1. - smoothstep(bedw, bedw + 1.3, abs(wS + (n3 - .5) * 9. + (n4 - .5) * 3.));
  sand = max(sand, (1. - smoothstep(.8, 1.9, abs(wS - 4.5 + (vn(p * .061 + 12.) - .5) * 12. + (n4 - .5) * 2.))) * smoothstep(.35, .6, vn(p * .033 + 5.)));
  sand *= smoothstep(84., 100., e0);
  white = max(white, smoothstep(.63 - uSeason.x * .014, .73, n1 + (n4 - .5) * .14 + st * .03) * (1. - pk));
  // and they stand in drifts in the shallow hollows of the flats, where the rain lay longest (the slow part of the noise the
  // puddles gather in), 15 to 30 m across with ragged edges
  white = max(white, smoothstep(.63, .73, vn(p * .11 + uSeed.zw) * .36 + vn(p * .031 + uSeed.zw + 23.) * .64 + (n4 - .5) * .12) * .92 * (1. - pk));
  // the second wash, out on the plain: a bare sandy bed 7 m wide with rain daisies crowding both its banks
  vec2 al = planAL(p); float w2g = wash2Gate(p, al), w2 = wash2D(al);
  float w2w = (1. - smoothstep(8., 15., abs(w2) + (n2 - .5) * 9. + (n4 - .5) * 3.)) * w2g;
  float sand2 = (1. - smoothstep(3.1, 4.4, abs(w2 + (n3 - .5) * 3. + (n4 - .5) * 1.4))) * w2g;
  sand = max(sand, sand2); white = max(white, w2w);
  // vygies: the koppie skirt, the three old termite mounds beside it, and heuweltjies dotted over the plain (low discs 20 to 32 m across)
  float mag = (1. - smoothstep(60., 86., e)) * .86;
  for (int i = 0; i < 3; i++) { float d = length(p - uHeu[i].xy); mag = max(mag, (1. - smoothstep(uHeu[i].z * .75, uHeu[i].z * 1.1, d + (n3 - .5) * 5.)) * (1. - pk)); }
  vec2 hc = p / 85.; vec2 hi = floor(hc); vec2 hj = h22(hi + 61.7);
  float hr = (10. + 6. * hj.x) * step(h21(hi + 7.7), .5 + uSeason.z * .7);
  float hd = length(fract(hc) - .5 - (hj - .5) * .55) * 85. + (n3 - .5) * 5.;
  mag = max(mag, (1. - smoothstep(hr * .75, hr * 1.1 + 1e-3, hd)) * (1. - pk) * smoothstep(120., 150., e0)
    * mix(1., smoothstep(8., 18., abs(length(p - uArc.xy) - uArc.z) + (n3 - .5) * 6.), uArc.w));
  mag = clamp(mag, 0., 1.);
  // the damp hollow of the flats is white with them from rim to rim (a ragged rim)
  float drf = uHolK.y * (1. - pk) * (1. - smoothstep(uHol.w * .55, uHol.w, holD(al) + (n3 - .5) * 10. + (n4 - .5) * 5.));
  mag *= 1. - drf; white = max(white, drf);
  // a second tongue of the orange flats (uOrange: centre xz, radius, amount): neither rain daisies nor vygies grow in it
  float ton = uOrange.w * (1. - smoothstep(uOrange.z * .62, uOrange.z * 1.12, length(p - uOrange.xy) + (n3 - .5) * 5. + (n4 - .5) * 2.5));
  white *= 1. - ton; mag *= 1. - ton;
  white *= 1. - mag;
  // a white field is never a sheet: bare gravel gaps a few metres wide open in it (about a sixth of it)
  float gap = 1. - .94 * white * (1. - pk) * (1. - smoothstep(.31, .42, vn(p * .17 + 31.) * .62 + n4 * .38));
  float cover = max(smoothstep(.27, .41, n3 * .4 + n4 * .24 + n1 * .3 + st * .075 + .03 + pk * .09) * gap, drf * smoothstep(.2, .34, n4)) * mix(uSeason.y, max(uSeason.y, 1.08), pk);
  cover = max(cover, w2w * .92 * smoothstep(.2, .42, n4 * .6 + n3 * .4 + .12) * uSeason.y);
  // along the stretch the light line crosses (790 to 900 m along the plan) the flats beside the line are in flower, without bare gaps
  cover = max(cover, .86 * uSeason.y * uArc.w * (1. - smoothstep(16., 34., abs(al.y) + (n3 - .5) * 12.)) * smoothstep(735., 760., al.x) * (1. - smoothstep(896., 930., al.x)) * (.8 + .2 * n4));
  // and over the ridge (its crest and the slope beyond, down to the banks of the second wash) the bloom is unbroken beside the line
  cover = max(cover, .86 * uSeason.y * uArc.w * (1. - smoothstep(15., 32., abs(al.y) + (n3 - .5) * 12.)) * smoothstep(505., 532., al.x) * (1. - smoothstep(640., 668., al.x)) * (.8 + .2 * n4));
  cover *= 1. - .97 * sand;
  cover *= 1. - panAt(p, al).x;
  cover *= 1. - smoothstep(uApron * .82, uApron * .98, length(p));
  cover *= 1. - .92 * trackAt(p);
  return vec4((1. - white) * (1. - mag), white, mag, clamp(cover, 0., 1.));
}
vec4 speciesAt(vec2 p){ float sand; return speciesAtW(p, sand); }
// the daisies' share of a ground point: x orange, y white (they sum to 1), z 0, w their cover (vygie ground carries few)
vec4 daisyMix(vec4 sp){ float s = max(sp.x + sp.y, 1e-3); return vec4(sp.x / s, sp.y / s, 0., sp.w * (1. - sp.z)); }
// vygie mats. Two jittered layers on turned grids: big lobed mats (4.8 m cells, 1.2 to 1.7 m in radius) and small cushions
// (1.5 m cells, 0.2 to 0.56 m). Both thin out with one low-frequency drift, so they crowd together in patches, small ones round
// the big, with bare slab and grit several metres wide between the patches. xy = centre (local xz), z = radius (m), w = hash
vec2 cushGrid(vec2 p, float s){ return vec2(.8 * p.x + .6 * p.y, -.6 * p.x + .8 * p.y) / s; }
vec4 cushCell(vec2 ci, float s){
  float big = step(3., s);
  vec2 hh = h22(ci + 21.3 + big * 40.), h2 = h22(ci + 57.9 + big * 17.);
  float r = mix(.2 + .36 * hh.x * hh.x, 1.2 + .52 * hh.x, big);
  vec2 q = (ci + .5) * s + (h2 - .5) * 2. * max(s * .5 - r * mix(1.28, 1.42, big), 0.);
  return vec4(.8 * q.x - .6 * q.y, .6 * q.x + .8 * q.y, r, hh.y);
}
// the outline of a mat: its radius in the direction of v as a multiple of its nominal radius (lobed; big mats more so)
float cushLobe(vec4 cc, vec2 v){
  float a = atan(v.y, v.x + 1e-5), k = cc.w * 43., big = step(.8, cc.z);
  return 1. + (.17 * cos(2. * a + k) + .12 * cos(3. * a + k * 1.7) + .07 * cos(5. * a + k * 2.9)) * mix(.45, 1., big);
}
float cushDrift(vec2 p){ return vn(p * .075 + uSeed.zw * 1.3) * .6 + vn(p * .19 + 4.7) * .28 + vn(p * .47 + 9.) * .12; }
// x: share of the ground under small cushions, y: under big mats, for vygie strength k (0..1) and drift dr
// (along the climb to the portal they stand a little thicker, so the lens passes over whole mats)
float cushLane(vec2 p){ return (1. - smoothstep(4., 13., abs(p.x))) * smoothstep(4., 14., p.y) * (1. - smoothstep(92., 112., p.y)); }
vec2 cushShare(float k, float dr, float lane){ float o = .1 * lane; return min(k * (1. + .16 * lane), 1.) * vec2(smoothstep(.32 - o, .45 - o, dr), smoothstep(.38 - o, .48 - o, dr)); }
// bare granite at a mat's centre (the slab mask of the ground without its slope term): most mats keep off it, a few spill over
float slabC(vec2 p){
  float e = length(p * vec2(.8, 1.));
  float sl = smoothstep(.62, .67, vn(p * .07 + uSeed.xy * 3.) * .75 + vn(p * .31 + 9.) * .25 + .05) * (1. - smoothstep(55., 92., e));
  return max(sl, 1. - smoothstep(8., 10., length(p)));
}
// 1 where the cell holds a mat: vygie ground and cover at its centre, thinned by the drift
float cushHere(vec4 cc){
  vec4 s = speciesAt(cc.xy); float big = step(.8, cc.z), lane = cushLane(cc.xy); vec2 sh = cushShare(s.z * min(s.w * 1.6, 1.), cushDrift(cc.xy), lane);
  float rock = step(.5, slabC(cc.xy)) * step(mix(.14, .36, big) + .4 * lane, fract(cc.w * 5.31));
  return step(mix(fract(cc.w * 7.13), fract(cc.w * 3.37), big), mix(sh.x, sh.y, big)) * (1. - rock);
}
// one jittered layer of star heads: x = mask, y = pale throat
vec2 cushStars(vec2 hg, float fw, float o, float dens){
  vec2 hid = floor(hg); vec2 hh = h22(hid + 3.1); vec2 hf = fract(hg) - .5 - (hh - .5) * .2;
  float rr = length(hf), a = atan(hf.y, hf.x + 1e-5);
  float R = (.4 + .09 * hh.y) * mix(.45, 1., o);
  float star = R * (.74 + .26 * cos(a * 8. + hh.x * 6.));
  float m = (1. - smoothstep(star - fw * .7, star + fw * .7, rr)) * step(hh.x, dens);
  return vec2(m, m * (1. - smoothstep(R * .2, R * .4, rr)) * o);
}
// albedo of a mat at p (cd = distance from its centre in radii, o = opening): grey-green succulent leaf under star-shaped heads
// with a pale throat, thinning toward the rim where the leaf shows; fwp = pixel footprint in metres
vec3 cushAlb(vec2 p, vec4 cc, float cd, float o, float fwp){
  float big = step(.8, cc.z), hd = mix(5., 3.5, big), fw = fwp * hd;
  float dens = mix(.72, .97, fract(cc.w * 3.71)) * (1. - .45 * smoothstep(.55, 1., cd));
  vec2 s1 = cushStars(vec2(.6 * p.x - .8 * p.y, .8 * p.x + .6 * p.y) * hd, fw, o, dens);
  vec2 s2 = cushStars(vec2(.96 * p.x + .28 * p.y, -.28 * p.x + .96 * p.y) * hd * 1.13 + 4.7, fw * 1.13, o, dens * .92);
  float hm = max(s1.x, s2.x), th = max(s1.y, s2.y * (1. - s1.x));
  float tint = fract(cc.w * 7.31), hv = h21(floor(p * hd) + 1.7);
  vec3 face = mix(cMagenta, cMagenta * vec3(1.2, .6, 1.3) + vec3(.02, 0., .04), step(.7, tint) * .7);
  face = mix(face, cMagenta * vec3(1.2, 1.7, 1.25) + vec3(.1, .03, .08), step(tint, .17) * .6) * (.74 + .34 * hv);
  vec3 backc = mix(cMagenta * vec3(.5, .55, .62), vec3(.3, .3, .32), .4);
  vec3 hcol = mix(mix(backc, face, o), vec3(1., .86, .5), th);
  float lf = vn(p * 11.) * .6 + vn(p * 29. + 3.) * .4;
  vec3 leaf = mix(cGreen * vec3(.5, .6, .55), vec3(.19, .25, .2), .6) * (.55 + .6 * lf);
  vec3 nearC = mix(leaf, hcol, hm);
  vec3 farC = mix(mix(leaf, backc, .3 * dens), mix(leaf, face * .96, dens * .62), o);
  return mix(farC, nearC, 1. - smoothstep(.3, .95, fw)) * (1. - .3 * smoothstep(.66, 1., cd));
}
// polygonal jointing: distance to the nearest cell wall of a jittered grid
float joints(vec2 p){
  vec2 g = floor(p), f = fract(p); float d1 = 8., d2 = 8.;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 o = vec2(float(i), float(j)); vec2 r = o + h22(g + o) - f; float d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d;
  }
  return sqrt(d2) - sqrt(d1);
}
vec3 graniteCol(float n){ return mix(cRock, cGravel, .1) * 2.2 * (.45 + .8 * n); }
float tideRag(vec2 p){ return (vn(p * .021 + uSeed.zw) - .5) * 26. + (vn(p * .13 + 5.) - .5) * 5.; }
// racing cloud shadow (0..1 shade) and the rare lone cloud island that shuts the flowers under it
// one staged cloud shadow: a long soft ellipse (uCb: centre, half-length, amount; uCbAx: long axis, squeeze of the short axis)
float cloudBand(vec2 p){ vec2 b = p - uCb.xy; float bd = length(vec2(dot(b, uCbAx.xy), dot(b, vec2(-uCbAx.y, uCbAx.x)) * uCbAx.z)) + (vn(p * .011 + 3.) - .5) * uCb.z * .3;
  return uCb.w * (1. - smoothstep(uCb.z * .5, uCb.z * 1.1 + 1e-3, bd)); }
// the racing shadows part around the lens (they thin to a quarter within 40 m of it), so the bloom under us is always in sun
float cloudCov(vec2 p){ vec2 q = p + uCloud.xy; float c = smoothstep(.47, .62, vn(q * .0038) * .68 + vn(q * .0105 + 4.) * .32) * uCloud.z;
  return max(c * mix(.25, 1., smoothstep(40., 140., length(p - uCam.xz))), cloudBand(p)); }
// the island is an ellipse: uIsle.z is its half-length along uIsleAx.xy (its direction of travel), uIsleAx.z squeezes the cross axis
float isleD(vec2 p, float shift){ vec2 q = p - uIsle.xy - uIsleAx.xy * shift;
  return length(vec2(dot(q, uIsleAx.xy), dot(q, vec2(-uIsleAx.y, uIsleAx.x)) * uIsleAx.z)) + (vn(p * .045 + 3.) - .5) * 9. + (vn(p * .19 + 9.) - .5) * 3.; }
float isleAt(vec2 p){ return uIsle.w * (1. - smoothstep(uIsle.z * .8, uIsle.z * 1.1, isleD(p, 0.))); }
// 1 where the light line has passed (sunlit), 0 still under the fog lid
float sunLine(vec2 p){ return smoothstep(-3.5, 3.5, uFront - dot(p, uTideDir) + tideRag(p)); }
// extra brightness in the 8 m just behind the line: the "line of sunlight"
float sunEdge(vec2 p){ float d = uFront - dot(p, uTideDir) + tideRag(p); return smoothstep(-3.5, 1.5, d) * (1. - smoothstep(2., 8.5, d)); }
// opening 0..1 of a head with hash h: 20 m behind the line, spread by the hash
float openAt(vec2 p, float h){ float d = uFront - dot(p, uTideDir) + tideRag(p) - uTune.x * (1. + .5 * h);
  // under the island heads shut a little way in from its leading edge and are still half open behind its trailing edge
  float isl = isleD(p, uIsleAx.w);
  return uOpen * smoothstep(0., 2.9 + uTune.x * .405, d) * (1. - uIsle.w * (1. - smoothstep(uIsle.z * .86 + h * 5., uIsle.z * 1.12 + 6. + h * 9., isl))); }
float domeShadow(vec3 p){
  float s = 1.;
  for (int i = 0; i < NDOME; i++) {
    vec3 c = uDomes[i].xyz - p; float r = uDomes[i].w; float t = dot(c, uSunDir);
    if (t > r * .55) { float d = length(c - uSunDir * t); s = min(s, smoothstep(r * .74, r * 1.05 + t * .035, d)); }
  }
  for (int i = 0; i < NCAST; i++) {
    vec3 c = uCast[i].xyz - p; float r = uCast[i].w; float t = dot(c, uSunDir);
    if (t > r * .55) { float d = length(c - uSunDir * t); s = min(s, mix(1., smoothstep(r * .7, r * 1.05 + t * .05, d), 1. - smoothstep(r * 9., r * 16., t))); }
  }
  s *= (1. - .82 * cloudCov(p.xz)) * (1. - .8 * isleAt(p.xz));
  return s;
}
// sh: extra shadow on the direct light (0 = fully shadowed); dmin: a floor on the diffuse term for rough ground,
// whose pebbles and seedlings stand up into a raking sun
vec3 shadeS(vec3 alb, vec3 N, vec3 P, float wrap, float sh, float dmin){
  // by starlight the eye (and a long exposure) loses the reds: everything turns pale and blue-grey, so red gravel never goes black
  alb = mix(alb, vec3(dot(alb, vec3(.42, .45, .13))) * vec3(.84, .96, 1.2) + .012, uNite * .62);
  float sl = sunLine(P.xz);
  float lit = sl * domeShadow(P) * sh * (1. + uTune.z * sunEdge(P.xz));
  float d = clamp((dot(N, uSunDir) + wrap) / (1. + wrap), 0., 1.);
  d = max(d, dmin * smoothstep(-.03, .12, uSunDir.y));
  vec3 hemi = mix(uGndCol, uSkyCol, N.y * .5 + .5) * uFill;
  // beyond the line the fog lid itself is the light: soft, dim and cool (a pearl light: colours keep their hue under it), and the
  // band of open sky along the horizon under the lid's far edge lays a pale warmth on whatever faces that band (it stands on the
  // sun's side: what is turned from it stays a dark shape)
  vec2 bxz = uSunDir.xz / max(length(uSunDir.xz), 1e-3);
  vec3 lid = hemi * mix(vec3(1.), vec3(.72, .76, .9), uTune.y) + vec3(.7, .76, .95) * dot(uSunCol, vec3(.3333)) * mix(.2, .19, uTune.y) * (.7 + .3 * N.y)
    + uBand.rgb * uBand.a * (.05 + .5 * (1. - abs(N.y)) * max(dot(N.xz, bxz), 0.));
  hemi = mix(lid, hemi, sl);
  // a cloud's shadow is blue-violet, never olive
  float cb = cloudBand(P.xz); float cs = max(isleAt(P.xz), max(.5 * cloudCov(P.xz), .9 * cb)) * sl;
  hemi *= mix(vec3(1.), vec3(.7, .82, 1.22), cs);
  vec3 c = alb * (uSunCol * d * lit + hemi) * .3183;
  // starlight: the whole sky is a lamp, so by night the land is pale and readable, never a dark mass under the stars
  c += alb * (vec3(.2, .27, .42) * (.5 + .5 * N.y) + vec3(.1, .13, .2)) * uNite;
  float lum = dot(c, vec3(.3, .5, .2));
  c = mix(c, lum * vec3(.78, .98, 1.75), .36 * cs);
  return mix(c, lum * vec3(.6, .95, 2.3) * 1.5, .5 * cb * sl);
}
vec3 shade(vec3 alb, vec3 N, vec3 P, float wrap){ return shadeS(alb, N, P, wrap, 1., 0.); }
// face and back colours of a head of species pick k (0..1) under weights sp
// sheets of yellow daisies (gousblom) lie across the orange flats, tens of metres wide; the valley floor at the koppie stays orange
float yellowAt(vec2 p){
  float pk = 1. - smoothstep(70., 104., length((p - vec2(0., 138.)) * vec2(.72, 1.)));
  return smoothstep(.54, .63, vn(p * .0125 + uSeed.wz * 1.9) * .6 + vn(p * .047 + 6.3) * .3 + vn(p * .19 + 1.1) * .1) * (1. - pk);
}
void headColours(vec4 sp, float k, float h, float yl, out vec3 face, out vec3 back){
  // (rain daisies are the palette's cream held well under white, each head its own tone, so a drift of them is single blossoms)
  vec3 wcol = mix(cWhite * vec3(.74, .725, .7) * (.84 + .24 * h), vec3(.16, .26, .78), uSeason.w);
  // shut heads keep a colour of their own (rose, pale mauve, dull orange) so a furled field never melts into the leaves
  if (k < sp.z) { face = cMagenta * (.74 + .4 * h); back = mix(cMagenta * vec3(.5, .55, .62), vec3(.38, .34, .42), .45) * (1.1 + .5 * h); }
  else if (k < sp.z + sp.y) { face = wcol; back = mix(vec3(.5, .36, .7), wcol * .5, .2) * (1.05 + .35 * h); }
  else { vec3 oc = mix(cOrange * vec3(1., .8, .7), vec3(.93, .62, .04), yl);
    face = mix(oc, oc * vec3(1.05, .62, .5), step(.86, h) * (1. - yl)) * (.9 + .25 * h); back = mix(oc * vec3(.66, .5, .4), vec3(.46, .33, .17), .3) * (1.1 + .5 * h); }
}
`,gt=`
#include <common>
#include <fog_pars_vertex>
`;function xe(a,n,e,s={}){return new t.ShaderMaterial({uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...a},vertexShader:gt+He+n,fragmentShader:`#include <common>
#include <fog_pars_fragment>
`+He+e,fog:!0,...s})}const wt=`
attribute float aOcc;
varying vec3 vP, vN; varying float vOcc;
void main(){
  vP = position; vN = normal; vOcc = aOcc;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,xt=`
varying vec3 vP, vN; varying float vOcc;
// one jittered layer of flat heads: colour in rgb, coverage in a (no loops, no derivatives inside)
vec4 headLayer(vec2 p, vec2 g, float fw, vec4 sp, float cover, float facing, float grow, float near, float yl){
  vec2 id = floor(g), f = fract(g) - .5; vec2 hh = h22(id); float k = h21(id + 17.3);
  float pres = step(h21(id + 5.1), cover * .8 * uFrac);
  float o = openAt(p, hh.x);
  vec3 face, back; headColours(sp, k, hh.y, yl, face, back);
  // heads of several sizes (a few large, many small); each keeps inside its own cell, jittered as far as its size leaves room, so
  // no disc is ever cut by a cell wall and no lattice shows
  float R = min(mix(.17, .27, o) * (.5 + 1.15 * hh.y * hh.y) * grow * (1. + .16 * step(k, sp.y)), .44);
  vec2 c = f - (h22(id + 31.7) - .5) * 2. * max(.47 - R, 0.); float r = length(c);
  float m = (1. - smoothstep(R - fw * .7, R + fw * .7, r)) * pres;
  vec3 col = mix(back, face, o * facing) * (.82 + .36 * h21(id + 23.9));
  col *= mix(1., .8 + .2 * cos(atan(c.y, c.x + 1e-4) * 13. + hh.x * 6.), near * o);
  col = mix(col, vec3(.05, .025, .012), (1. - smoothstep(R * .22, R * .34, r)) * o * step(sp.z, k) * near * near * step(.3, hh.y));
  return vec4(col, m);
}
// a low shrub mat in one grid cell: x = its body, y = the shadow it throws along sd (unit, away from the sun), Ls radii long
vec2 bossie(vec2 bg, vec2 cell, vec2 sd, float Ls, float keep){
  vec2 bh = h22(cell + 3.7); vec2 v = bg - (cell + .5 + (bh - .5) * .6);
  float br = (.07 + .1 * bh.x) * step(.6, h21(cell + 9.1) + keep);
  float t = dot(v, sd), w = dot(v, vec2(-sd.y, sd.x)), L = br * Ls;
  float sh = (1. - smoothstep(br * .5, br * 1.05 + 1e-3, abs(w) + br * .4 * t / max(L, 1e-3))) * smoothstep(-br, 0., t) * (1. - smoothstep(L * .6, L + 1e-3, t)) * step(1e-4, br);
  return vec2(1. - smoothstep(br * .55, br + 1e-3, length(v) + (vn(bg * 13.) - .5) * .05), sh);
}
// paints one vygie mat (cc, presence cp) at p onto alb and N: lobed body, dark contact rim, a short shadow away from the sun.
// cres: how well the mat resolves at this distance (far away it melts into meanC by its share meanAmt)
void cushPaint(vec2 p, vec4 cc, float cp, float cres, float fwp, vec2 sdn, float Ls, vec3 meanC, float meanAmt, inout vec3 alb, inout vec3 N, inout float cshd, inout float glit){
  vec2 v = p - cc.xy; float big = step(.8, cc.z), R = cc.z * cushLobe(cc, v);
  float cd = length(v) / R + (vn(p * 5.3 + cc.w * 40.) - .5) * mix(.14, .07, big) + (vn(p * 1.7 + cc.w * 17.) - .5) * .1 * big;
  float co = openAt(cc.xy, cc.w);
  float body = (1. - smoothstep(.86, 1., cd)) * cp;
  float ring = smoothstep(.78, .98, cd) * (1. - smoothstep(1., mix(1.22, 1.09, big), cd)) * cp;
  vec2 sv = v - sdn * min(cc.z, .62) * min(.22 * Ls, .75);
  float sh = (1. - smoothstep(.8, 1.12, length(sv) / (cc.z * cushLobe(cc, sv)))) * cp * (1. - body);
  // away from the climb no mound stands on the mat: there it is a low flat thing with a faint rim, never a dark-edged pit
  float low = max(smoothstep(mix(10., 20., big), mix(12., 23., big), abs(cc.x)), max(1. - smoothstep(-3., 0., cc.y), smoothstep(94., 98., cc.y)));
  ring *= 1. - .75 * low; sh *= 1. - .7 * low;
  vec3 cAlb = cushAlb(p, cc, cd, co, fwp);
  vec3 albN = mix(alb * (1. - .55 * ring), cAlb, body);
  alb = mix(mix(alb, meanC, meanAmt), albN, cres);
  // a dome; a big mat is flat-topped with a rolled edge and a lumpy top
  float hz = sqrt(max(1. - cd * cd, 0.));
  vec3 Nd = normalize(vec3(v.x / R, hz * mix(1., 2.4, big) + .32, v.y / R) + vec3(vn(p * 2.3 + 5.) - .5, 0., vn(p * 2.3 + 9.) - .5) * .55 * big);
  N = normalize(mix(N, Nd, body * cres * .92));
  cshd = max(cshd * (1. - body * cres), sh * cres); glit = max(glit * (1. - body * cres), max(body * cres, meanAmt * (1. - cres)) * co);
}
// one layer of drop rings on standing water: cells of 1 / sc metres, each with one ring that widens and fades (fwp: metres of ground to a pixel)
float dropRing(vec2 p, float sc, float fwp, float t){
  vec2 rg = p * sc; vec2 rid = floor(rg); vec2 rh = h22(rid + 7.7); float rt = fract(t * (.7 + .5 * rh.x) + rh.y * 9.);
  float rr = length(fract(rg) - .5 - (rh - .5) * .5), w = max(.05, fwp * sc * 1.25);
  return (1. - smoothstep(0., w, abs(rr - rt * .42))) * (1. - rt) * (1. - smoothstep(.09, .26, fwp * sc));
}
void main(){
  vec3 N = normalize(vN); vec2 p = vP.xz;
  vec3 toCam = uCam - vP; float dist = length(toCam); vec3 V = toCam / max(dist, 1e-3);
  vec2 g = mat2(.88, .48, -.48, .88) * p * 7.3; float fw = length(fwidth(g)); float near = 1. - smoothstep(.3, 1.0, fw);
  float fwp = length(fwidth(p)), cres = 1. - smoothstep(.22, .75, fwp / 1.5), cresB = 1. - smoothstep(.3, 1., fwp / 2.8);
  // red granite gravel, darker fines, quartz pebble patches
  float g1 = fbm(p * .55), g2 = fbm(p * .06 + 11.);
  vec3 alb = mix(cGravel, vec3(.4, .26, .17), .3 + .35 * g2) * mix(.5, .92, g1);
  alb = mix(alb, cGravel * vec3(.6, .56, .6), smoothstep(.45, .7, vn(p * .05 + 17.)) * .5);
  alb = mix(alb, vec3(dot(alb, vec3(.33))) * vec3(1.12, .96, .86), .24);
  alb *= mix(1., (.62 + .5 * vn(p * 23.)) * (.72 + .56 * vn(p * 67. + 3.)), near);
  float qz = smoothstep(.6, .72, vn(p * .085 + 40.));
  alb = mix(alb, cWhite * .56, qz * mix(.26, smoothstep(.55, .8, vn(p * 27.) * .6 + vn(p * 9.) * .4) * .8, near) * .7);
  // granite slabs on the skirt and the bare saddle rock
  float e = length(p * vec2(.8, 1.)); float slope = 1. - N.y;
  float sj = (vn(p * 2.3 + 4.) - .5) * .05;
  float slab = smoothstep(.62, .67, vn(p * .07 + uSeed.xy * 3.) * .75 + vn(p * .31 + 9.) * .25 + slope * .35 + sj) * (1. - smoothstep(55., 92., e));
  slab = max(slab, 1. - smoothstep(8., 10., length(p) + (vn(p * .4) - .5) * 4. + sj * 20.));
  float jd = joints(p * .21 + vec2(vn(p * .3), vn(p * .3 + 7.)) * .5);
  float crack = (1. - smoothstep(.0, .035, jd)) * .65;
  vec3 rockc = graniteCol(fbm(p * .5 + 3.) * .7 + vn(p * 6.) * .3) * (1. - crack) * (.85 + .3 * smoothstep(.0, .5, jd));
  rockc = mix(rockc, vec3(.5, .52, .36), smoothstep(.7, .78, vn(p * .9 + 30.)) * smoothstep(.5, .7, vn(p * 7.)) * .2);
  // the flower field
  float sand; vec4 sp = speciesAtW(p, sand); vec4 spd = daisyMix(sp); float cover = spd.w * (1. - slab);
  sand *= 1. - slab;
  float grow = smoothstep(.45, 1., uGrowth);
  alb = mix(alb, rockc, slab);
  // the game path: pale trodden sand, printed with cloven hooves
  float tk = trackAt(p) * (1. - slab);
  alb = mix(alb, mix(cGravel * 1.1, vec3(.74, .5, .33), .62) * (.72 + .3 * vn(p * 3.1) + .12 * vn(p * 17.)), tk * .9);
  vec2 hq = vec2((p.x - trackC(p.y)) * 3.4 + .5, p.y * 2.3); vec2 hid = floor(hq); vec2 hh2 = h22(hid + 4.2); vec2 hf = fract(hq) - .5 - (hh2 - .5) * .45;
  float hoof = (1. - smoothstep(.11, .2, length(hf * vec2(1.3, .8)))) * smoothstep(.015, .05, abs(hf.x)) * step(.3, hh2.x) * (1. - smoothstep(.2, .7, length(fwidth(hq))));
  alb *= 1. - .55 * hoof * tk;
  // the rain pan: where its water has gone, pale clay curling into polygons (dark and damp beside the water that is left)
  vec2 al = planAL(p); vec2 pan = panAt(p, al);
  float panW = pan.x * (1. - smoothstep(uPan.z - .07, uPan.z, pan.y));
  if (pan.x > .002) {
    float cj = joints(p * 1.7 + vec2(vn(p * .9), vn(p * .9 + 4.)) * .4);
    vec3 clay = vec3(.56, .4, .3) * (.72 + .3 * vn(p * 1.3 + 8.) + .1 * vn(p * 9.)) * (1. - .62 * (1. - smoothstep(.02, .09, cj))) * (.9 + .16 * smoothstep(.05, .4, cj));
    clay *= mix(.5, 1., smoothstep(uPan.z, uPan.z + .22, pan.y));
    alb = mix(alb, clay, pan.x * (1. - smoothstep(.1, .5, uWet) * .5));
  }
  // the bed of the wash: pale red river sand, combed into faint ripples by the last flood
  float wsd = washD(p);
  alb = mix(alb, mix(cGravel * 1.15, vec3(.7, .35, .19), .62) * (.74 + .2 * vn(p * 2.3 + 1.) + .1 * sin(wsd * 9. + vn(p * .8) * 9.) * near), sand * .9);
  // loose stones
  vec2 sg = p * 1.3; vec2 sid = floor(sg); vec2 sh = h22(sid + 1.9); vec2 sf = fract(sg) - .5 - (sh - .5) * .7;
  float sr = (.05 + .17 * sh.y * sh.y) * step(.35, h21(sid + 4.4));
  float stn = (1. - smoothstep(sr * .7, sr + 1e-3, length(sf * vec2(1., 1.3)))) * (1. - smoothstep(.3, 1., length(fwidth(sg))));
  alb = mix(alb, graniteCol(sh.x) * (.6 + .9 * smoothstep(-sr, sr, dot(sf, uSunDir.xz))), stn);
  // gravel: a dense layer of small pebbles (dark varnish, rust, quartz) so bare ground is never smooth up close
  vec2 pg = mat2(.8, .6, -.6, .8) * p * 5.3 + vec2(vn(p * 1.7), vn(p * 1.7 + 5.)) * .8; vec2 pid = floor(pg); vec2 ph = h22(pid + 2.3); vec2 pf = fract(pg) - .5 - (ph - .5) * .7;
  // (quartz patches: drifts a few metres across where the pebbles lie thicker and most of them are white)
  float qp = smoothstep(.58, .72, vn(p * .085 + 17.) * .68 + vn(p * .33 + 4.) * .32);
  float prr = (.06 + .17 * ph.x * ph.x) * step(.4 - .28 * qp, h21(pid + 8.8)); float pfw = length(fwidth(pg));
  float pm = (1. - smoothstep(prr * .7, prr + pfw, length(pf * vec2(1., 1.25)))) * (1. - smoothstep(.25, .8, pfw));
  vec3 pc = mix(mix(cRock * 1.3, cGravel * 1.25, step(.45, ph.y)), cWhite * .5, step(.93 - .5 * qp, ph.y));
  alb = mix(alb, pc * (.55 + .8 * smoothstep(-prr - 1e-3, prr + 1e-3, dot(pf, uSunDir.xz))), pm * .85 * (1. - slab) * (1. - .7 * sand));
  // micro relief so the light is never flat
  N = normalize(N + vec3(vn(p * 1.1 + 3.) - .5, 0., vn(p * 1.1 + 9.) - .5) * .32 + vec3(vn(p * 5.) - .5, 0., vn(p * 5. + 4.) - .5) * .18 * near);
  // the green haze: seedlings are a fresh spring green and come up in drifts, so red gravel and quartz still show between them;
  // near the lens the haze resolves into single seedlings and rosettes
  float young = 1. - smoothstep(.4, .85, uGrowth), sprout = smoothstep(.05, .4, uGrowth);
  vec3 gcol = mix(mix(cGreen, vec3(.14, .38, .06), .42), vec3(.15, .47, .06), .66 * young);
  float drift = smoothstep(.36, .6, vn(p * .23 + 2.) * .46 + vn(p * .061 + 9.) * .3 + vn(p * .95) * .24);
  float gAmt = cover * sprout * mix(1., drift, .8 * young) * (.68 + .3 * fbm(p * 1.7));
  vec2 sdg = mat2(.74, .67, -.67, .74) * p * 6.1; vec2 sdi = floor(sdg); vec2 sdh = h22(sdi + 6.6); float sfw = length(fwidth(sdg));
  float srr = (.12 + .22 * sdh.x) * mix(.7, 1.25, uGrowth), sdl = length(fract(sdg) - .5 - (sdh - .5) * .5);
  float tuft = (1. - smoothstep(srr - sfw * .7, srr + sfw * .7, sdl)) * step(h21(sdi + 3.3), gAmt * 1.25);
  float gA = mix(gAmt, mix(gAmt * .78, tuft, 1. - smoothstep(.3, 1., sfw)), young);
  // and, a pace apart, the rosettes that have got away: six blunt leaves round a darker heart
  vec2 rq = mat2(.6, .8, -.8, .6) * p * 2.6; vec2 rqi = floor(rq); vec2 rqh = h22(rqi + 9.4); float rfw = length(fwidth(rq));
  vec2 rqv = fract(rq) - .5 - (rqh - .5) * .5; float rql = length(rqv), rqr = (.2 + .18 * rqh.x) * mix(.55, 1.1, sprout);
  float rqs = rqr * (.72 + .28 * cos(atan(rqv.y, rqv.x + 1e-5) * 6. + rqh.y * 6.));
  float ros = (1. - smoothstep(rqs - rfw * .7, rqs + rfw * .7, rql)) * step(h21(rqi + 1.7), gAmt * 1.7) * young * (1. - smoothstep(.3, 1., rfw));
  gA = max(gA, ros);
  alb = mix(alb, gcol * mix(.5, .9, vn(p * 1.3 + 2.)) * (1. - .45 * young * smoothstep(srr * .1, srr * .9, sdl) * (1. - smoothstep(.3, 1., sfw))) * (1. - .4 * ros * (1. - smoothstep(0., rqr * .5, rql))), gA);
  // bossies: low grey-green shrub mats, each throwing a shadow that lengthens as the sun sinks (a clock hand)
  vec2 bgq = p / 2.6; float sxl = max(length(uSunDir.xz), 1e-3); vec2 sdn = -uSunDir.xz / sxl;
  float Ls = clamp(1.6 * sxl / max(uSunDir.y, .05), 1.2, 7.), keepB = .1 + (vn(p * .05 + 2.) - .5) * .5 - .3 * (1. - smoothstep(70., 104., length((p - vec2(0., 138.)) * vec2(.72, 1.))));
  vec2 b0 = bossie(bgq, floor(bgq), sdn, Ls, keepB), b1 = bossie(bgq, floor(bgq - sdn * .62), sdn, Ls, keepB);
  // (painted mats only beyond 16 to 30 m, where they melt into the haze: near the lens every bossie is a standing shrub)
  float bfar = smoothstep(16., 30., dist) * (1. - pan.x);
  float bos = b0.x * (1. - slab) * (1. - sand) * bfar, bsh = max(b0.y, b1.y) * (1. - slab) * (1. - sand) * (1. - bos) * bfar;
  vec2 bv = fract(bgq) - .5;
  alb = mix(alb, cGreen * vec3(.5, .6, .56) * (.45 + .6 * vn(p * 7.)) * (.55 + .8 * smoothstep(-.2, .2, dot(bv, -sdn) + (vn(p * 4.) - .5) * .2)), bos * .9);
  vec3 Hn = normalize(mix(vec3(0., 1., 0.), uSunDir, .6));
  float facing = mix(.5, 1., smoothstep(-.2, .6, dot(Hn, V)));
  // near: two rotated, jittered layers of individual heads (no visible lattice)
  vec2 gB = mat2(.62, -.78, .78, .62) * p * 8.9 + 3.7;
  // rain daisies stand in drifts: denser and thinner patches a few metres across, with leaf mats and bare grit between
  float wpat = smoothstep(.4, .6, vn(p * .83 + 4.) * .45 + vn(p * .29 + 7.) * .55);
  float lpat = smoothstep(.3, .58, vn(p * 1.9 + 3.) * .45 + vn(p * .61 + 8.) * .55);
  // near the lens the heads stand in clumps a pace or two across, with grit and leaf between them
  float clump = smoothstep(.3, .62, vn(p * 1.37 + 12.3) * .5 + vn(p * .47 + 5.9) * .5) * 1.25;
  float coverH = cover * mix(1., mix(.36, 1., wpat), spd.y) * mix(1., clump, .85 * near);
  float yl = yellowAt(p);
  vec4 L1 = headLayer(p, g, fw, spd, coverH, facing, grow, near, yl);
  vec4 L2 = headLayer(p, gB, fw * 1.37, spd, coverH, facing, grow, near, yl);
  // a third, coarser layer of bigger heads, so the nearest flowers are whole daisies with eyes and not dots
  vec2 gC = mat2(.34, .94, -.94, .34) * p * 4.3 + 9.1;
  vec4 L3 = headLayer(p, gC, fw * .59, spd, coverH * .6, facing, grow, near, yl);
  // under the world's real plants the painted heads thin out: there the flowers are the plants themselves
  float realK = uReal.x * (1. - smoothstep(uReal.y * .5, uReal.y, dist));
  L1.a *= 1. - .5 * realK; L2.a *= 1. - .5 * realK; L3.a *= 1. - .85 * realK;
  // far: the mean of the same heads. Orange daisies carpet the ground; rain daisies are cream heads over fresh green leaf
  float oA = openAt(p, .5);
  vec3 fo, bo, fw2, bw;
  headColours(vec4(1., 0., 0., 1.), .5, .4, yl, fo, bo); headColours(vec4(0., 1., 0., 1.), .5, .4, 0., fw2, bw);
  fo = mix(fo, cGold * 1.15, vn(p * .023 + 2.) * .4) * (.72 + .5 * vn(p * vec2(.05, .11) + 6.));
  vec3 leafC = mix(cGreen, vec3(.12, .36, .05), .6) * (.5 + .6 * vn(p * 1.3 + 2.));
  // under the rain daisies the leaf comes in fresh green mats and darker blue-green drifts
  vec3 leafD = mix(leafC, cGreen * vec3(.3, .48, .4), smoothstep(.42, .68, vn(p * .21 + 15.) * .6 + vn(p * .74 + 2.) * .4));
  float fvar = .8 + .4 * vn(p * 3.1 + 1.);
  vec3 oFar = mix(bo, fo, oA * facing) * fvar * mix(.8, 1.1, smoothstep(.3, .7, vn(p * .29 + 21.)));
  vec3 wFar = mix(mix(leafD, bw, mix(.3, .62, wpat)), mix(leafD * 1.15, fw2, mix(.05, .88, wpat)), oA * facing) * mix(1., fvar, .5);
  vec3 farCol = oFar * spd.x + wFar * spd.y;
  // (a shut field is still a field of heads: copper, mauve and rose backs over the leaf, three quarters of the cover of the open one)
  float farAmt = clamp(cover * mix(.68, .86, oA) * grow * uFrac * (.7 + .5 * vn(p * .9 + 4.)) * (.82 + .3 * vn(p * 4.3)), 0., 1.);
  // near the lens the single heads stand over their own leaves: an orange-green wash under the daisies, plain leaf under the rain daisies
  vec3 washC = mix(oFar, leafC, .3) * spd.x + leafD * (.8 + .4 * vn(p * 9. + 5.)) * spd.y;
  vec3 nearAlb = mix(alb, washC, farAmt * mix(.5, mix(.12, .92, lpat), spd.y) * (1. - bos));
  nearAlb = mix(nearAlb, L1.rgb, L1.a * (1. - bos)); nearAlb = mix(nearAlb, L2.rgb, L2.a * (1. - bos)); nearAlb = mix(nearAlb, L3.rgb, L3.a * (1. - bos));
  float hShare = mix(farAmt * mix(.8, mix(.4, 1., wpat), spd.y), max(max(L1.a, L2.a), L3.a), near) * (1. - bos) * oA * facing;
  alb = mix(mix(alb, farCol, farAmt * (1. - bos)), nearAlb, near);
  // vygie mats: lobed mats and small cushions, each with a dark contact rim, its own lit and shaded sides and a short shadow
  float cshd = 0., glit = 0.;
  if (sp.z > .004) {
    vec2 shr = cushShare(sp.z * min(sp.w * 1.6, 1.), cushDrift(p), cushLane(p)) * (1. - .7 * slab) * grow;
    // far away the mats melt into a mottled, patchy wash that still leaves grit showing
    vec3 meanC = mix(mix(cGreen * .5, cMagenta * vec3(.5, .55, .62), .35), cMagenta * .9, .62 * oA) * (.75 + .5 * vn(p * .43 + 1.3));
    vec4 cs = cushCell(floor(cushGrid(p, 1.5)), 1.5), cb = cushCell(floor(cushGrid(p, 4.8)), 4.8);
    cushPaint(p, cs, cushHere(cs) * grow, cres, fwp, sdn, Ls, meanC, shr.x * .137, alb, N, cshd, glit);
    cushPaint(p, cb, cushHere(cb) * grow, cresB, fwp, sdn, Ls, meanC, shr.y * .24, alb, N, cshd, glit);
  }
  alb *= mix(.38, 1., vOcc);
  // rain: wet gravel goes dark and saturated, drying in patches
  // (the quartz patches and the white pebbles stay pale in it)
  float wetk = uWet * smoothstep(.15, .75, uWet + vn(p * .16 + 9.) * .5 - .1);
  alb *= mix(vec3(1.), vec3(.46, .27, .225), wetk * (1. - .78 * max(qz, qp)));
  vec3 col = shadeS(alb, N, vP, .12, (1. - .82 * bsh) * (1. - .8 * cshd), .45 * (1. - glit));
  float lit = sunLine(p) * domeShadow(vP);
  // open heads lean to the sun, so a field in bloom is brighter than the ground it stands on
  vec3 HnO = normalize(mix(vec3(0., 1., 0.), uSunDir, .6 * oA));
  col += (fo * spd.x + fw2 * spd.y) * uSunCol * lit * max(dot(HnO, uSunDir) - max(dot(N, uSunDir), .45), 0.) * hShare * .3183 * (1. - .8 * bsh);
  // vygie heads glitter in the sun
  float tw = h21(floor(p * 34.) + floor(uTime * 5. + dot(V, vec3(31., 17., 23.))) * 7.3);
  col += mix(uSunCol, uSunCol * cMagenta * 2.5, .5) * lit * step(.9965, tw) * glit * mix(.25, 1., near) * .42;
  // puddles left by the rain: sky mirror with drop rings and a sun glint; they shrink as uWet falls
  // (and standing water that outlasts the rain: the pan, and the pools in the bed of the second wash)
  float w2 = wash2D(al); float poolRaw = wash2Pool(p, al, w2) * wash2Gate(p, al);
  float still = max(panW, smoothstep(.42, .6, poolRaw));
  col *= 1. - .42 * smoothstep(0., .42, poolRaw) * (1. - still);                      // damp sand round a pool
  if (uWet > .003 || still > .003) {
    float wk = smoothstep(.003, .03, uWet);
    float pn = vn(p * .11 + uSeed.zw) * .55 + vn(p * .34 + 2.) * .33 + vn(p * 1.3) * .12 - slope * 2.;
    // pe: how far a point lies inside a puddle's shore (0 at the water's edge, growing toward its middle); the shore itself
    // wanders a little with the grit
    float pe = pn - mix(.8, .575, uWet) + (vn(p * 2.9 + 6.) - .5) * .012;
    float pud = smoothstep(0., .045, pe) * (1. - slab) * wk;
    // the wet margin: for a pace round the water the gravel is soaked, darker than wet gravel and far darker than dry
    float marg = smoothstep(-.11, .0, pe + (vn(p * 1.3 + 4.) - .5) * .03) * (1. - slab) * wk;
    col *= 1. - .46 * marg;
    pud = max(pud, still);
    // how deep the water stands: a film at the shore, a hand deep in the middle
    float deep = max(smoothstep(0., .13, pe) * wk, still);
    // the rings of the last drops, while the rain falls, at two sizes (small quick ones and wide slow ones up to a metre across);
    // each is drawn no thinner than the ground it covers can show, and goes where it would be finer than that
    float ring = max(dropRing(p, 1.1, fwp, uTime), dropRing(p + 3.7, .45, fwp, uTime * .8)) * uRain;
    // the water's face: the wind's small ripples, and the slope of each ring
    vec3 Nw = normalize(vec3((vn(p * 3. + uTime * .6) - .5) * .05 + ring * .22, 1., (vn(p * 3. + 5. - uTime * .5) - .5) * .05 - ring * .16));
    float cv = clamp(dot(Nw, V), 0., 1.); float fr = 1. - cv; fr = .16 + .84 * fr * fr * sqrt(fr);
    vec3 R = reflect(-V, Nw); float sg = clamp(dot(R, uSunDir), 0., 1.); float g2 = sg * sg; g2 *= g2; g2 *= g2; g2 *= g2; g2 *= g2; g2 *= g2;
    // A puddle is water: it mirrors the sky that stands over it at this moment, by the ray the eye's line is thrown along (skyMir:
    // the dome's own gradient, glow, arch, cloud and stars). So the far puddles, seen low, hold the bright horizon (the lit rain
    // and the afterglow where they look toward them, the rose arch away from them) and the ones under the lens hold the deep of
    // the sky and show their bed; by night they are dark with a few stars in them.
    R.y = abs(R.y);
    vec3 skyR = skyMir(R);
    // the lit rain: the veils hang in the water as they hang in the sky (the same curtains, by the bearing and height of the mirrored ray)
    float azR = atan(R.z, R.x + 1e-6), cR = vn(vec2(azR * 6.5 + 2., 1.7 + uTime * .02));
    float veilR = smoothstep(.36, .66, cR) * smoothstep(.1, .7, dot(R.xz, uVeilM.xy) / max(length(R.xz), 1e-4)) * (1. - smoothstep(.03, .26 + .14 * cR, R.y)) * uVeilM.z;
    skyR = mix(skyR, uVeilC * (.7 + .5 * vn(vec2(azR * 95., uTime * 1.3 + cR * 3.))), veilR);
    // and the boulders that stand beside the water lie in it upside down, dark (uRefl)
    float dkR = 0.;
    for (int i = 0; i < 8; i++) {
      vec3 oc = vP - uRefl[i].xyz; float b = dot(oc, R), r2 = uRefl[i].w * uRefl[i].w;
      dkR = max(dkR, (1. - smoothstep(r2 * .78, r2 * 1.08 + 1e-3, dot(oc, oc) - b * b)) * step(b, 0.) * step(.01, uRefl[i].w));
    }
    vec3 rockM = cRock * (uSunCol * .2 + uSkyRef * .5) * (.8 + .4 * vn(p * .7 + R.xz * 9.));
    skyR = mix(skyR, rockM, dkR * .86);
    float frG = fr;
    // the rain pan: still, wide water, a full mirror at any hour: of the dawn sky at the first sun of day 2 (rose where it looks
    // out low under the arch and blue where it looks up), with the dark shapes of what stands beyond it (uRefl) and of the gemsbok
    // that stands in it (uBull) lying upside down in the water, and a bright rim along the shore that faces a low sun
    float pm = panW, rimK = 0.;
    if (pm > .002) {
      // (the pan's water is wide and shallow over silt, so it gives back less than a clear pool would: the sky of this moment by
      // the mirrored ray, a little dimmer than the sky itself)
      vec3 mir = skyR * .72;
      // the gemsbok: body, neck, head and four legs, in the animal's own frame
      float cb = cos(uBull.w), sb = sin(uBull.w);
      vec3 bo = vP - uBull.xyz; bo = vec3(bo.x * cb - bo.z * sb, bo.y, bo.x * sb + bo.z * cb) / 1.18;
      vec3 bd = vec3(R.x * cb - R.z * sb, R.y, R.x * sb + R.z * cb);
      float dkB = 0.;
      { vec3 oo = (bo - vec3(0., .98, -.08)) / vec3(.25, .3, .78), dd = bd / vec3(.25, .3, .78); vec3 q = oo + dd * max(-dot(oo, dd) / max(dot(dd, dd), 1e-5), 0.); dkB = max(dkB, 1. - smoothstep(.7, 1.15, dot(q, q))); }
      { vec3 oo = (bo - vec3(0., 1.27, .6)) / vec3(.13, .3, .2), dd = bd / vec3(.13, .3, .2); vec3 q = oo + dd * max(-dot(oo, dd) / max(dot(dd, dd), 1e-5), 0.); dkB = max(dkB, 1. - smoothstep(.7, 1.15, dot(q, q))); }
      { vec3 oo = (bo - vec3(0., 1.5, .93)) / vec3(.09, .1, .21), dd = bd / vec3(.09, .1, .21); vec3 q = oo + dd * max(-dot(oo, dd) / max(dot(dd, dd), 1e-5), 0.); dkB = max(dkB, 1. - smoothstep(.7, 1.15, dot(q, q))); }
      float dh2 = max(dot(bd.xz, bd.xz), 1e-5);
      for (int i = 0; i < 4; i++) {
        vec2 lo = bo.xz - vec2(i < 2 ? -.127 : .127, (i == 0 || i == 2) ? .41 : -.55); float tl = -dot(lo, bd.xz) / dh2;
        dkB = max(dkB, (1. - smoothstep(.045, .1, length(lo + bd.xz * tl))) * step(0., tl) * step(bo.y + bd.y * tl, .9));
      }
      mir = mix(mir, vec3(.05, .045, .05) + mir * .1, dkB * .9);
      skyR = mix(skyR, mir, pm); fr = mix(fr, max(fr, .9), pm);
      vec2 sdz = uSunDir.xz / max(length(uSunDir.xz), 1e-3); vec2 pal = (al - uPan.xy) / vec2(11.5, 6.6);
      // (the shore that faces the sun: the outward normal of the pan's rim, taken in the plan's own frame and turned to the world's)
      vec2 qa = p - uArc.xy; qa /= max(length(qa), 1e-3); vec2 outw = normalize(vec2(-qa.y, qa.x) * -pal.x * 6.6 + qa * pal.y * 11.5 + vec2(1e-4, 0.));
      rimK = pm * smoothstep(uPan.z - .3, uPan.z - .05, pan.y) * smoothstep(-.1, .7, dot(outw, sdz)) * (1. - smoothstep(.02, .3, uSunDir.y)) * (1. - uNite);
    }
    // through the water its bed shows: the soaked gravel, darker the deeper the water stands over it, so a puddle seen from above
    // darkens toward its middle; over that lies the mirror, by the angle the eye's line meets the water at
    vec3 bed = col * mix(1., .34, deep) * mix(vec3(1.), vec3(.86, .9, 1.), deep);
    float mirK = mix(.68, .6, still) + .16 * vn(p * .21 + 5.) + .1 * vn(p * 1.9 + uTime * .3) + ring * .6;
    vec3 pcol = mix(bed, skyR * mirK, fr * mix(.6, .96, max(deep, pm))) + uSunCol * g2 * g2 * lit * (.12 + 1.3 * smoothstep(.55, .9, vn(p * 6. + vec2(uTime * 1.4, -uTime))));
    pcol += uSunCol * vec3(1., .8, .6) * rimK * (.16 + .7 * smoothstep(.45, .8, vn(p * 5. + vec2(uTime * 1.1, -uTime * .8)))) * lit;
    col = mix(col, pcol, pud);
    // (wet gravel between the pools: a broken sheen of the same sky, strongest where the eye's line is low: the gravel itself
    // stays dark red)
    float gl = vn(p * 1.7 + 3.) * .6 + vn(p * 5.1 + 8.) * .4;
    col += skyR * wetk * (1. - pud) * frG * (.05 + .2 * smoothstep(.5, .78, gl)) * (1. - dkR);
  }
  gl_FragColor = vec4(col, 1.);
#include <fog_fragment>
}`,yt=`
attribute vec3 color;
varying vec3 vP, vN, vC;
void main(){
  vP = position; vN = normal; vC = color;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,bt=`
varying vec3 vP, vN, vC;
void main(){
  vec3 N = normalize(vN);
  vec3 an = abs(N); an = an * an; an /= max(an.x + an.y + an.z, 1e-4);
  // triplanar value noise: varnish mottling, crystals, hairline joints
  float nA = fbm(vP.zy * .8) * an.x + fbm(vP.xz * .8 + 5.) * an.y + fbm(vP.xy * .8 + 9.) * an.z;
  float nB = vn(vP.zy * 4.5) * an.x + vn(vP.xz * 4.5) * an.y + vn(vP.xy * 4.5) * an.z;
  float jt = vn(vec2(vP.y * .9 + vn(vP.xz * .15) * 3., 3.7)) ;
  float joint = (1. - smoothstep(.0, .04, abs(jt - .5))) * (1. - an.y);
  // within 30 m of the lens: crystal grain at two scales and thin flaking edges (the stacks the lens passes at 8 to 15 m)
  float nearK = 1. - smoothstep(9., 32., length(uCam - vP));
  float nC = vn(vP.zy * 15.) * an.x + vn(vP.xz * 15. + 3.) * an.y + vn(vP.xy * 15. + 7.) * an.z;
  float nD = vn(vP.zy * 47. + 1.) * an.x + vn(vP.xz * 47.) * an.y + vn(vP.xy * 47. + 2.) * an.z;
  // bump: tilt the normal by the screen-space gradient of the mottling (derivatives taken here, outside any loop)
  float hgt = nA * .5 + nB * .12 + nC * .035 * nearK;
  vec3 dp1 = dFdx(vP), dp2 = dFdy(vP); float dh1 = dFdx(hgt), dh2 = dFdy(hgt);
  vec3 r1 = cross(dp2, N), r2 = cross(N, dp1); float det = dot(dp1, r1);
  vec3 Nb = abs(det) * N - sign(det) * (dh1 * r1 + dh2 * r2) * .8 + N * 1e-6;
  N = normalize(mix(N, Nb / max(length(Nb), 1e-6), .8));
  vec3 alb = mix(vC, cRock * 1.6, .3) * (.4 + .66 * nA) * (.8 + .3 * nB) * .9;
  alb = mix(alb, vC * .2, joint * .6);
  alb *= mix(1., (.74 + .5 * nC) * (.8 + .4 * nD), nearK);
  alb *= 1. - .3 * nearK * (1. - smoothstep(.0, .05, abs(fract(nA * 4.3 + nB * .7) - .5)));
  // pale lichen and wind-blown grit on ledges
  float lich = smoothstep(.56, .88, vn(vP.xz * .7 + vP.y * .53 + 30.) + (nB - .5) * .3) * smoothstep(.35, .8, nA);
  alb = mix(alb, vec3(.27, .27, .2), lich * .2 * (1. - .85 * uWet));
  alb = mix(alb, cGravel * .8, smoothstep(.86, .97, N.y) * smoothstep(.45, .7, nA) * .55);
  // a low sun wraps round the boulders, so the terminator is soft and the sunward flanks glow
  float low = 1. - smoothstep(.08, .42, uSunDir.y);
  vec3 col = shade(alb, N, vP, .16 * low);
  // a little sky sheen on the varnish; much more while the rock is still wet from the rain (it mirrors the lit sky)
  vec3 V = normalize(uCam - vP + vec3(0., 1e-4, 0.));
  float f1 = 1. - clamp(dot(N, V), 0., 1.), fr = f1 * f1 * f1;
  col += uSkyCol * fr * .05;
  col += (uSkyRef + uGlowRef * .35) * (.012 + .15 * f1 * f1 * f1) * uWet * (.55 + .6 * nB) * (.5 + .5 * N.y + .25);
  // still wet after the rain: the sun glints off the varnish in streaks where the water runs
  float wk = sqrt(max(uWet, 0.)); vec3 Rw = reflect(-V, N); float sg = max(dot(Rw, uSunDir), 0.); sg *= sg; sg *= sg; sg *= sg;
  col += uSunCol * (sg * sg * .5 + sg * .06) * wk * smoothstep(.35, .7, nA + (nB - .5) * .4) * sunLine(vP.xz) * domeShadow(vP);
  col += alb * uSunCol * f1 * f1 * smoothstep(-.2, .5, dot(N, uSunDir)) * uNite * 1.6;
  // the faces turned from a low sun are filled by the bright sky behind the lens, never a black cut-out
  col += alb * uSkyCol * (.5 + .5 * N.y) * low * .07;
  // out of the sun (dusk shadow, the fog lid, a tor's shade) granite keeps its colour: more of the sky's fill than the sums give
  col += alb * mix(uGndCol, uSkyCol, N.y * .5 + .5) * uFill * (1. - sunLine(vP.xz) * domeShadow(vP)) * .15;
  // light thrown up by the sunlit ground: the faces turned from the sun are warm brown, never a black cut-out
  col += alb * uSunCol * vec3(.36, .22, .1) * max(uSunDir.y, 0.) * (.62 - .38 * N.y) * .36 * sunLine(vP.xz) * (1. - .6 * uWet);
  // seen against the sun, the edges that face it catch a warm rim
  col += alb * uSunCol * (fr + .35 * f1 * f1 * low) * smoothstep(.1, .8, dot(-V, uSunDir)) * smoothstep(-.4, .3, dot(N, uSunDir)) * sunLine(vP.xz) * domeShadow(vP) * 3.4;
  // under the fog lid a rock is a dark shape, and the band of open sky along the horizon (on the sun's side) lays a pale rim on the
  // edges and shoulders turned to it
  vec2 bxz = uSunDir.xz / max(length(uSunDir.xz), 1e-3);
  col += (alb * 1.6 + .02) * uBand.rgb * uBand.a * (1. - sunLine(vP.xz)) * (fr * 1.6 + f1 * f1 * .2) * smoothstep(-.3, .5, dot(N, normalize(vec3(bxz.x, .4, bxz.y))));
  gl_FragColor = vec4(col, 1.);
#include <fog_fragment>
}`,Ae=new Map;function Te(a){if(Ae.has(a))return Ae.get(a);let n=new t.IcosahedronGeometry(1,a);n.deleteAttribute("normal"),n.deleteAttribute("uv"),n=ot(n,1e-4);const e={pos:n.attributes.position.array.slice(),idx:Array.from(n.index.array)};return n.dispose(),Ae.set(a,e),e}async function zt(a,n){if(Ae.has(a))return;let e=new t.IcosahedronGeometry(1,a);e.deleteAttribute("normal"),e.deleteAttribute("uv"),await n.yield(),e=ot(e,1e-4),await n.yield(),Ae.set(a,{pos:e.attributes.position.array.slice(),idx:Array.from(e.index.array)}),e.dispose(),await n.yield()}async function kt(a,n){const e=a.attributes.position.array,s=a.index.array,l=new Float32Array(e.length);for(let c=0;c<s.length;c+=6e4){const x=Math.min(s.length,c+6e4);for(let y=c;y<x;y+=3){const b=s[y]*3,j=s[y+1]*3,N=s[y+2]*3,m=e[N]-e[j],A=e[N+1]-e[j+1],f=e[N+2]-e[j+2],T=e[b]-e[j],R=e[b+1]-e[j+1],E=e[b+2]-e[j+2],F=A*E-f*R,Y=f*T-m*E,K=m*R-A*T;l[b]+=F,l[b+1]+=Y,l[b+2]+=K,l[j]+=F,l[j+1]+=Y,l[j+2]+=K,l[N]+=F,l[N+1]+=Y,l[N+2]+=K}await n.yield()}for(let c=0;c<l.length;c+=12e4){const x=Math.min(l.length,c+12e4);for(let y=c;y<x;y+=3){const b=Math.hypot(l[y],l[y+1],l[y+2])||1;l[y]/=b,l[y+1]/=b,l[y+2]/=b}await n.yield()}a.setAttribute("normal",new t.BufferAttribute(l,3))}const Pt=.25,St=4;async function Ct(a,n,e){const s=a.attributes.position.array,l=a.index.array,c=[],x=n.length,y=[];for(let N=0;N<x;N+=96){const m=Math.min(x,N+96),A=(m-N)/3;let f=0,T=0,R=0,E=0;for(let F=N;F<m;F+=3)f+=n[F]/A,T+=n[F+1]/A,R+=n[F+2]/A;for(let F=N;F<m;F+=3)E=Math.max(E,Math.hypot(n[F]-f,n[F+1]-T,n[F+2]-R));y.push(N,m,f,T,R,E)}await e.yield();let b=0;for(let N=0;N<l.length;N+=4500){const m=Math.min(l.length,N+4500);for(let A=N;A<m;A+=3){const f=l[A]*3,T=l[A+1]*3,R=l[A+2]*3,E=s[T]-s[f],F=s[T+1]-s[f+1],Y=s[T+2]-s[f+2],K=s[R]-s[f],$=s[R+1]-s[f+1],B=s[R+2]-s[f+2];let _=F*B-Y*$,C=Y*K-E*B,M=E*$-F*K;const Q=Math.hypot(_,C,M);let W=!(Q>0);if(!W){_/=Q,C/=Q,M/=Q;const J=_*s[f]+C*s[f+1]+M*s[f+2]-Pt;if(_*n[b]+C*n[b+1]+M*n[b+2]>J)W=!0;else for(let oe=0;oe<y.length&&!W;oe+=6)if(!(_*y[oe+2]+C*y[oe+3]+M*y[oe+4]+y[oe+5]<=J)){for(let z=y[oe],G=y[oe+1];z<G;z+=3)if(_*n[z]+C*n[z+1]+M*n[z+2]>J){W=!0,b=z;break}}}W&&c.push(l[A],l[A+1],l[A+2])}await e.yield()}const j=(l.length-c.length)/3;return a.setIndex(c),j}function nt(a,n,e,s,l){const c=Te(n.detail),x=c.pos.length/3,y=a.pos.length/3,b=s.range(-50,50),j=s.range(-50,50),N=s.range(-50,50),m=[];for(let B=0;B<n.facets;B++){const _=s.range(0,Math.PI*2),C=s.range(-.5,.9);m.push([Math.cos(_)*Math.cos(C),Math.sin(C),Math.sin(_)*Math.cos(C),s.range(.72,.92)])}const A=[];if(n.r>6){const B=s.int(2,3);for(let _=0;_<B;_++){const C=s.range(0,Math.PI);A.push([Math.cos(C),s.range(-.15,.15),Math.sin(C),s.range(-.45,.45),.075,s.range(.07,.12)])}A.push([s.range(-.15,.15),1,s.range(-.15,.15),s.range(-.05,.4),.07,.08])}const f=s.range(0,Math.PI*2),T=Math.cos(f),R=Math.sin(f),E=n.sx??s.range(.85,1.2),F=n.sz??s.range(.85,1.2),Y=n.r>6?s.range(2.2,3.4):0,K=n.tone??1,$=new t.Color;for(let B=0;B<x;B++){const _=c.pos[B*3],C=c.pos[B*3+1],M=c.pos[B*3+2],Q=e.fbm3(_*1.15+b,C*1.15+j,M*1.15+N,3),W=e.n3(_*3.7+N,C*3.7+b,M*3.7+j);let J=1+.15*Q+.04*W+.05*Math.abs(e.n3(_*2.3+j,C*2.3+N,M*2.3+b));for(const I of A){const V=(_*I[0]+C*I[1]+M*I[2]-I[3])/I[4];J*=1-I[5]*Math.exp(-V*V)}for(const I of m){const V=_*I[0]+C*I[1]+M*I[2];V>.001&&J*V>I[3]&&(J=I[3]/V)}if(Y){const I=(C*.5+.5)*Y+Q*.6,V=I-Math.floor(I);J*=1-.035*Math.min(1,V*6)*(1-V)}const oe=C<-.35?.35+.65*Math.max(0,(C+1)/.65):1,z=_*J*E,G=M*J*F,ee=C*J*n.sy*(C<0?oe:1);a.pos.push(n.x+(z*T-G*R)*n.r,n.y+ee*n.r,n.z+(z*R+G*T)*n.r);const se=Math.max(0,e.n2((Math.atan2(M,_)+f)*2.6+b,C*.35+j))*(1-Math.abs(C)),ae=Math.max(0,C);let X=(.78+.3*Q+.22*ae)*K*(1-.65*se);X*=.55+.45*Math.min(1,(C+1.05)*1.4),$.copy(l.rock).lerp(l.gravel,.07+.1*ae+.05*W).multiplyScalar(X*2.3),a.col.push($.r,$.g,$.b)}for(let B=0;B<c.idx.length;B++)a.idx.push(y+c.idx[B])}function Ne(a,n={}){const e=new t.BufferGeometry;e.setAttribute("position",new t.Float32BufferAttribute(a.pos,3)),a.col&&e.setAttribute("color",new t.Float32BufferAttribute(a.col,3)),a.nor&&a.nor.length&&e.setAttribute("normal",new t.Float32BufferAttribute(a.nor,3));for(const s in n)e.setAttribute(s,new t.Float32BufferAttribute(n[s][0],n[s][1]));return a.idx&&e.setIndex(a.idx),(!a.nor||!a.nor.length)&&e.computeVertexNormals(),e}const Mt=`
attribute vec3 color; attribute float aSway, aKind;
varying vec3 vP, vN, vC; varying float vKind;
void main(){
  vec3 P = position;
  // rosettes tremble (time-lapse wind), stiff wood barely moves
  float ph = dot(position.xz, vec2(1.7, 2.3));
  P += aSway * vec3(sin(uTime * 7.3 + ph), sin(uTime * 9.1 + ph * 1.3) * .5, cos(uTime * 6.1 + ph * .7)) * .05;
  vP = P; vN = normal; vC = color; vKind = aKind;
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.);
  gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,At=`
varying vec3 vP, vN, vC; varying float vKind;
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.));
  vec3 V = normalize(uCam - vP + vec3(0., 1e-4, 0.));
  vec3 alb = vC; float wrap = .1; vec3 extra = vec3(0.);
  if (vKind < .5) {
    // bark: smooth gold skin splitting into razor-edged flakes with dark rims
    vec2 q = vec2(atan(N.z, N.x + 1e-4) * 2.2, vP.y * 1.6);
    float fl = vn(q * 2.1 + 3.), fl2 = vn(q * 6.3 + 11.);
    float rim = (1. - smoothstep(.0, .06, abs(fl - .5))) + (1. - smoothstep(.0, .05, abs(fl2 - .45))) * .5;
    alb *= .78 + .4 * fl2;
    alb = mix(alb, vC * vec3(.42, .34, .28), clamp(rim, 0., 1.) * .7);
    alb = mix(alb, vC * 1.25 + .06, smoothstep(.62, .7, fl) * .35);
  } else if (vKind < 1.5) {
    if (dot(N, V) < 0.) N = -N;
    wrap = .45;
    // sun through the fleshy blades
    extra = vC * uSunCol * sunLine(vP.xz) * domeShadow(vP) * clamp(-dot(N, uSunDir), 0., 1.) * .09;
  } else {
    // weaver haystack: straw streaks hanging down
    float st = vn(vec2(atan(N.z, N.x + 1e-4) * 9., vP.y * 1.2)) * .6 + vn(vP.xz * 7.) * .4;
    alb *= .55 + .8 * st; wrap = .35;
  }
  vec3 col = shade(alb, N, vP, wrap) + extra;
  // seen against the light (a low sun, or the glow of the night sky) trunk, branches and blades carry a rim
  float f1 = 1. - clamp(dot(N, V), 0., 1.);
  col += alb * uSunCol * f1 * f1 * smoothstep(.0, .7, dot(-V, uSunDir)) * smoothstep(-.4, .3, dot(N, uSunDir)) * sunLine(vP.xz) * domeShadow(vP) * mix(.9, 2.6, uNite);
  // (and under the fog lid, the pale rim of the band of open sky along the horizon)
  vec2 bxz = uSunDir.xz / max(length(uSunDir.xz), 1e-3);
  col += (alb + .015) * uBand.rgb * uBand.a * (1. - sunLine(vP.xz)) * f1 * f1 * .5 * smoothstep(-.3, .5, dot(N, normalize(vec3(bxz.x, .4, bxz.y))));
  gl_FragColor = vec4(col, 1.);
#include <fog_fragment>
}`,U=new t.Vector3,Se=new t.Vector3,Lt=new t.Vector3,Bt=new t.Vector3,Ot=new t.Vector3(0,1,0);function rt(a,n,e,s,l,c=0){const x=a.pos.length/3,y=n.length,b=new t.Vector3,j=new t.Vector3,N=new t.Vector3;for(let m=0;m<y;m++){N.copy(n[Math.min(y-1,m+1)]).sub(n[Math.max(0,m-1)]).normalize(),b.set(1,0,0),Math.abs(N.x)>.9&&b.set(0,0,1),b.addScaledVector(N,-b.dot(N)).normalize(),j.crossVectors(N,b);for(let A=0;A<s;A++){const f=A/s*Math.PI*2,T=Math.cos(f),R=Math.sin(f),E=b.x*T+j.x*R,F=b.y*T+j.y*R,Y=b.z*T+j.z*R;a.pos.push(n[m].x+E*e[m],n[m].y+F*e[m],n[m].z+Y*e[m]),a.nor.push(E,F,Y),a.col.push(l[m].r,l[m].g,l[m].b),a.sway.push(0),a.kind.push(c)}}for(let m=0;m<y-1;m++)for(let A=0;A<s;A++){const f=x+m*s+A,T=x+m*s+(A+1)%s,R=f+s,E=T+s;a.idx.push(f,R,T,T,R,E)}}function Rt(a,n,e,s,l,c,x,y,b,j){const N=new t.Vector3(1,0,0);Math.abs(e.x)>.9&&N.set(0,0,1),N.addScaledVector(e,-N.dot(e)).normalize();const m=new t.Vector3().crossVectors(e,N),A=(C,M,Q,W)=>{a.pos.push(C.x,C.y,C.z),a.nor.push(M.x,M.y,M.z),a.col.push(Q.r,Q.g,Q.b),a.sway.push(W),a.kind.push(1)};let f=a.pos.length/3;const T=s*.5,R=y.clone().multiplyScalar(.6),E=[[0,1.3,0],[1,.2,0],[0,.2,1],[-1,.2,0],[0,.2,-1],[0,-.7,0]];for(const C of E)U.copy(n).addScaledVector(N,C[0]*T).addScaledVector(e,C[1]*T).addScaledVector(m,C[2]*T),Se.copy(U).sub(n).normalize(),A(U,Se,R,.2);a.idx.push(f,f+2,f+1,f,f+3,f+2,f,f+4,f+3,f,f+1,f+4,f+5,f+1,f+2,f+5,f+2,f+3,f+5,f+3,f+4,f+5,f+4,f+1);const F=x.range(0,6.28),Y=s*(c?.095:j?.33:.17),K=new t.Vector3,$=new t.Vector3,B=new t.Vector3,_=new t.Vector3;for(let C=0;C<l;C++){const M=F+C*2.39996,Q=(.22+1.45*Math.pow((C+.5)/l,.8))*x.range(.9,1.1);_.copy(N).multiplyScalar(Math.cos(M)).addScaledVector(m,Math.sin(M)),K.copy(e).multiplyScalar(Math.cos(Q)).addScaledVector(_,Math.sin(Q)),$.crossVectors(K,e).normalize().multiplyScalar(Y),B.crossVectors($,K).normalize();const W=s*x.range(.8,1.15),J=y.clone().multiplyScalar(x.range(.75,1.1));f=a.pos.length/3,U.copy(n).addScaledVector(K,W*.08),A(Se.copy(U).add($),B,J,.1),A(Se.copy(U).sub($),B,J,.1),c?(U.copy(n).addScaledVector(K,W*.55).addScaledVector(e,-W*.05),A(Se.copy(U).addScaledVector($,.85),B,J,.55),A(Se.copy(U).addScaledVector($,-.85),B,J,.55),U.copy(n).addScaledVector(K,W).addScaledVector(e,W*.06),A(U,B,b,1),a.idx.push(f,f+1,f+2,f+1,f+3,f+2,f+2,f+3,f+4)):(U.copy(n).addScaledVector(K,W),A(U,B,b,1),a.idx.push(f,f+1,f+2))}}function Ge(a,n,e,s,l){const c={pos:[],nor:[],col:[],sway:[],kind:[],idx:[]},x=n.H,y=n.hero,b=!!n.butter,j=y?10:b?7:6,N=y?6:b?5:4,m=(b?s.gold.clone().lerp(s.green,.38).multiplyScalar(1.1):s.gold.clone()).multiplyScalar(e.range(.82,1)),A=b?m.clone().lerp(s.white,.25):s.gold.clone().lerp(s.white,.55).multiplyScalar(.8),f=(b?new t.Color("#4f8f2c"):s.green.clone().lerp(new t.Color("#1d4a4c"),.62)).multiplyScalar(e.range(.85,1.05)),T=f.clone().lerp(s.gold,.3).multiplyScalar(1.15),R=x*e.range(.066,.078)*(b?2.5:1),E=x*e.range(.38,.46)*(b?1.15:1),F=e.range(-.04,.04)*x,Y=e.range(-.04,.04)*x,K=[0,.05,.28,.64,1].map(z=>new t.Vector3(F*z*z,E*z,Y*z*z));rt(c,K,[R*1.45,R*1.12,R*.92,R*.76,R*.66],j,[m.clone().multiplyScalar(.6),m,m,m.clone().lerp(A,.3),m.clone().lerp(A,.6)]);const $=[],B=(z,G,ee,se,ae,X)=>{const I=z.clone().addScaledVector(G,ee),V=z.clone().addScaledVector(G,ee*.5).addScaledVector(X,ee*e.range(-.05,.05)),ne=m.clone().lerp(A,Math.min(1,.55+ae*.12));if(rt(c,[z,V,I],[se,se*.86,se*.74],N,[ne,ne,ne.clone().multiplyScalar(.92)]),ae>=n.levels){$.push([I,G.clone()]);return}const pe=(.64-.04*ae)*e.range(.85,1.15),he=X.clone().applyAxisAngle(G,Math.PI/2+e.range(-.5,.5)).normalize();for(const re of[-1,1]){const ye=G.clone().applyAxisAngle(he,re*pe*e.range(.85,1.15));ye.y+=.14,ye.normalize(),B(I,ye,ee*e.range(.7,.82),se*.74,ae+1,he)}},_=K[K.length-1],C=new t.Vector3(Math.cos(n.yaw??0),0,Math.sin(n.yaw??0));for(const z of[-1,1]){const G=new t.Vector3(0,1,0).applyAxisAngle(C,z*e.range(.42,.56)).normalize();B(_,G,x*e.range(.15,.19),R*.52,1,C)}const M=x*(y?.1:b?.2:.125);for(const[z,G]of $)Rt(c,z,G,M*e.range(.85,1.15),y?14:b?8:10,y,e,f,T,b);let Q=null;if(n.nest){const z=Te(4),G=c.pos.length/3,ee=x*.115,se=E+x*.2,ae=new t.Color("#c9ad72");for(let X=0;X<z.pos.length/3;X++){const I=z.pos[X*3],V=z.pos[X*3+1],ne=z.pos[X*3+2],pe=ee*(1+.22*l.n3(I*2+7,V*2,ne*2+3)+.1*l.n3(I*7,V*3,ne*7));c.pos.push(F+I*pe*1.3,se+V*pe*(V<0?1+.25*l.n2(I*6,ne*6):.55),Y+ne*pe*1.15),c.nor.push(I,V,ne);const he=.7+.3*V;c.col.push(ae.r*he,ae.g*he,ae.b*he),c.sway.push(0),c.kind.push(2)}for(const X of z.idx)c.idx.push(G+X);Q=new t.Vector3(F,se-ee*.6,Y)}const W=new t.Matrix4;n.lean&&(U.set(n.leanDir[1],0,-n.leanDir[0]).normalize(),W.makeRotationAxis(U,n.lean)),W.setPosition(n.x,n.y,n.z);const J=new t.Matrix3().setFromMatrix4(W),oe=a.pos.length/3;for(let z=0;z<c.pos.length;z+=3)U.set(c.pos[z],c.pos[z+1],c.pos[z+2]).applyMatrix4(W),a.pos.push(U.x,U.y,U.z),U.set(c.nor[z],c.nor[z+1],c.nor[z+2]).applyMatrix3(J),a.nor.push(U.x,U.y,U.z);for(let z=0;z<c.col.length;z++)a.col.push(c.col[z]);for(let z=0;z<c.sway.length;z++)a.sway.push(c.sway[z]*x/9),a.kind.push(c.kind[z]);for(let z=0;z<c.idx.length;z++)a.idx.push(oe+c.idx[z]);return{nest:Q?Q.applyMatrix4(W):null,top:new t.Vector3(0,x,0).applyMatrix4(W)}}const Ve=`
float slabAt(vec2 p, float slope){
  float e = length(p * vec2(.8, 1.));
  float slab = smoothstep(.62, .67, vn(p * .07 + uSeed.xy * 3.) * .75 + vn(p * .31 + 9.) * .25 + slope * .35) * (1. - smoothstep(55., 92., e));
  return max(slab, 1. - smoothstep(8., 10., length(p) + (vn(p * .4) - .5) * 4.));
}
`,Nt=Ve+`
attribute vec3 iPos; attribute vec4 iRnd;
varying vec2 vUv; varying vec3 vP, vHn, vFace, vBack; varying float vOpen, vEye;
void main(){
  vec4 sp = daisyMix(speciesAt(iPos.xz));
  float pres = step(iRnd.x, sp.w * 1.05 * uFrac) * step(slabAt(iPos.xz, iRnd.w), .35);
  float o = openAt(iPos.xz, iRnd.y);
  float k = fract(iRnd.x * 7.31 + iRnd.y * 3.17);
  headColours(sp, k, iRnd.z, yellowAt(iPos.xz), vFace, vBack);
  vEye = step(sp.z, k); vOpen = o;
  float a0 = iRnd.z * 6.283;
  vec3 Hn = normalize(mix(vec3(0., 1., 0.), uSunDir, .6 * o) + vec3(cos(a0), 0., sin(a0)) * (1. - o) * .35
    + vec3(sin(uTime * 8. + a0 * 5.), 0., cos(uTime * 6.7 + a0 * 3.)) * .07);
  float dist = length(uCam - iPos);
  Hn = normalize(Hn + (uCam - iPos) / max(dist, 1e-3) * uBias * o);
  vec3 T = normalize(cross(vec3(.3, 0., 1.), Hn)); vec3 Bv = cross(Hn, T);
  float size = (.05 + .03 * iRnd.z) * pres * mix(.7, 1., o) * smoothstep(.45, 1., uGrowth);
  size *= (1. + dist * .02) * (1. - smoothstep(60., 90., dist));
  float hgt = (.15 + .17 * fract(iRnd.z * 5.3)) * uGrowth * mix(1., .5, 1. - vEye);
  vec3 P = iPos + vec3(0., hgt, 0.) + (Hn - vec3(0., 1., 0.)) * hgt * .4 + (T * position.x + Bv * position.y) * size;
  vUv = position.xy; vP = P; vHn = Hn;
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.);
  gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,it=`
varying vec2 vUv; varying vec3 vP, vHn, vFace, vBack; varying float vOpen, vEye;
void main(){
  float r = length(vUv); float a = atan(vUv.y, vUv.x + 1e-5);
  float pm = abs(fract(a * 2.069) - .5) * 2.;                 // thirteen petals
  if (r > mix(1., .58, pm * pm * vOpen)) discard;
  vec3 N = normalize(vHn); vec3 V = normalize(uCam - vP + vec3(0., 1e-4, 0.));
  float front = step(0., dot(N, V)); if (front < .5) N = -N;
  vec3 alb = mix(vBack, vFace, vOpen * mix(.55, 1., front)) * (.84 + .16 * cos(pm * 3.1416));
  alb = mix(alb, alb * 1.5 + .025, (1. - vOpen) * (1. - smoothstep(.15, .8, r)));          // a shut bud: a pale furled tip
  // dark ring and eye of the daisies, pale throat of the vygies
  // (the eyes fade with distance: far off a field of daisies is colour, not dots)
  float eye = (1. - smoothstep(.24, .31, r)) * vOpen * front * (1. - .85 * smoothstep(11., 30., length(uCam - vP)));
  alb = mix(alb, mix(vec3(1., .9, .55), vec3(.05, .024, .012), vEye), eye);
  alb = mix(alb, vFace * .45, (1. - smoothstep(.31, .42, r)) * (1. - eye) * vEye * vOpen * front * .7);
  float lit = sunLine(vP.xz) * domeShadow(vP);
  vec3 col = shade(alb, N, vP, .5) + alb * uSunCol * lit * .07
    + vFace * uSunCol * lit * (1. - front) * clamp(dot(normalize(vHn), uSunDir), 0., 1.) * .26 * vOpen;
  gl_FragColor = vec4(col, 1.);
#include <fog_fragment>
}`,Vt=`
attribute vec3 iPos; attribute vec4 iRnd; attribute float aPart;
varying vec3 vP, vN, vFace, vBack; varying float vPart, vOpen, vT; varying vec2 vQ;
void main(){
  vec4 sp = speciesAt(iPos.xz);
  float o = openAt(iPos.xz, iRnd.y);
  float k = fract(iRnd.x * 7.31 + iRnd.y * 3.17);
  // the near tier is daisies only: vygies stay in the cushions
  headColours(vec4(sp.x + sp.z, sp.y, 0., 1.), k * (sp.x + sp.y + sp.z), iRnd.z, yellowAt(iPos.xz), vFace, vBack);
  float grow = smoothstep(.45, 1., uGrowth);
  float sc = (.85 + .5 * iRnd.z) * 2.;
  float hgt = (.2 + .15 * iRnd.w) * uGrowth;
  float a0 = iRnd.x * 6.283;
  vec3 up = vec3(0., 1., 0.);
  vec3 wind = vec3(sin(uTime * 8. + a0 * 5.), 0., cos(uTime * 6.7 + a0 * 3.)) * .06;
  vec3 Hn = normalize(mix(up, uSunDir, .6 * o) + vec3(cos(a0), -.25, sin(a0)) * (1. - o) * .5 + wind);
  vec3 T = normalize(cross(vec3(.3, 0., 1.), Hn)); vec3 Bv = cross(Hn, T);
  vec3 head = iPos + up * hgt + (Hn - up) * hgt * .4;
  vec3 P; vec3 N; vQ = vec2(0.);
  if (aPart < .5) {
    float ang = position.x + a0, t = position.y, side = position.z;
    float jit = sin(position.x * 5. + a0 * 9.) * .08;
    float th1 = mix(1.47, -.08, o) + jit, th2 = th1 + mix(.1, -.32, o);
    float L = .036 * sc * mix(.75, 1., grow), r0 = .012 * sc;
    float s1 = min(t * 2., 1.), s2 = max(t * 2. - 1., 0.);
    float rad = r0 + (cos(th1) * s1 + cos(th2) * s2) * L * .5;
    float hh = (sin(th1) * s1 + sin(th2) * s2) * L * .5;
    float w = mix(.0052, .0086, s1) * (1. - s2 * .66) * sc * mix(.6, 1., o);
    vec2 d2 = vec2(cos(ang), sin(ang)); vec2 l2 = d2 * rad + vec2(-d2.y, d2.x) * side * w;
    P = head + T * l2.x + Bv * l2.y + Hn * (hh + .003 * sc);
    float th = mix(th1, th2, step(.5, t));
    N = (T * d2.x + Bv * d2.y) * (-sin(th)) + Hn * cos(th) + (T * -d2.y + Bv * d2.x) * side * .25;
    vQ = vec2(side, t);
  } else if (aPart < 1.5) {
    P = head + (T * position.x + Bv * position.z) * sc + Hn * position.y * sc;
    N = T * position.x + Bv * position.z + Hn * .012;
  } else if (aPart < 2.5) {
    float t = position.y;
    vec3 c = iPos + up * hgt * t + (Hn - up) * hgt * .4 * t * t;
    P = c + vec3(position.x, 0., position.z) * sc * .8;
    N = vec3(position.x, 0., position.z) * 200. + up * .1;
  } else if (aPart < 3.5) {
    // the head's own shadow: a soft disc on the ground, away from the sun, longer when the sun is low
    float hl = max(length(uSunDir.xz), 1e-3); vec2 sd = -uSunDir.xz / hl;
    float run = min(hgt * hl / max(uSunDir.y, .12), hgt * 4.);
    float rs = .05 * sc * mix(.5, 1., o) * smoothstep(.03, .14, uSunDir.y) * sunLine(iPos.xz);
    vec2 q = (head.xz + sd * run) + (sd * position.x * (1. + .25 * run / max(hgt, 1e-3)) + vec2(-sd.y, sd.x) * position.z) * rs;
    P = vec3(q.x, iPos.y + .025 + .04 * length(q - iPos.xz), q.y);
    N = up; vQ = position.xz;
  } else {
    // basal leaves: four grey-green straps arching out of the rosette
    float ang = position.x + a0 * 3., t = position.y, side = position.z;
    vec2 d2 = vec2(cos(ang), sin(ang));
    vec2 l2 = d2 * t * .075 * sc + vec2(-d2.y, d2.x) * side * .011 * sc;
    P = iPos + vec3(l2.x, (.012 + sin(t * 2.2) * .035 * sc) * uGrowth, l2.y);
    N = normalize(vec3(-d2.x * .5, 1., -d2.y * .5) + vec3(-d2.y, 0., d2.x) * side * .5);
  }
  vP = P; vN = N; vPart = aPart; vOpen = o; vT = position.y;
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.);
  gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,lt=`
varying vec3 vP, vN, vFace, vBack; varying float vPart, vOpen, vT; varying vec2 vQ;
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)); vec3 V = normalize(uCam - vP + vec3(0., 1e-4, 0.)); vec3 N0 = N;
  float inner = step(0., dot(N, V)); if (inner < .5) N = -N;
  vec3 alb; float wrap = .5; float sunK = 1.;
  if (vPart < .5) {
    // upper face blazes, the underside is dull; a dark ring at the petal base and a faint crease down the middle
    // (seen from behind, an open head still shows its colour through the thin rays: paler and duller, never a dark sliver)
    alb = mix(vBack, vFace * 1.08 + .04, mix(.7 * vOpen, mix(.35, 1., vOpen), inner));
    alb = mix(alb, vFace * .3, (1. - smoothstep(.0, .3, vT)) * inner * .8);
    alb *= (.9 + .1 * vT) * (.86 + .14 * smoothstep(.0, .5, abs(vQ.x)));
  } else if (vPart < 1.5) { alb = vec3(.05, .024, .012); wrap = .2; }
  else if (vPart < 2.5) { alb = mix(cGreen, vec3(.16, .36, .08), .45) * mix(.35, .62, vT); }
  else if (vPart < 3.5) {
    if (dot(vQ, vQ) > 1.) discard;
    alb = mix(mix(vBack, vFace, .5), cGreen, .5) * (.5 + .3 * dot(vQ, vQ)); sunK = .16 + .3 * dot(vQ, vQ); N = vec3(0., 1., 0.); wrap = .12;
  } else { alb = mix(cGreen, vec3(.14, .34, .07), .5) * mix(.5, .85, vT); wrap = .3; }
  float lit = sunLine(vP.xz) * domeShadow(vP);
  vec3 col = shadeS(alb, N, vP, wrap, sunK, 0.) + alb * uSunCol * lit * .08 * step(vPart, .5)
    + vFace * uSunCol * lit * (1. - inner) * clamp(dot(N0, uSunDir), 0., 1.) * .42 * vOpen * step(vPart, .5)
    + vFace * uSunCol * lit * inner * clamp(-dot(N0, uSunDir), 0., 1.) * .3 * vOpen * step(vPart, .5);          // rays lit from behind glow
  gl_FragColor = vec4(col, 1.);
#include <fog_fragment>
}`,Le=`
// the profile of a mound: height (in mound heights) at radius rad (0..1); the same broken line the mesh rings follow
float cushProf(float rad, float big){
  float ps = rad < .6 ? mix(1., .74, rad / .6) : mix(.74, -.12, (rad - .6) / .4);
  float pb = rad < .3 ? mix(1., .97, rad / .3) : rad < .58 ? mix(.97, .82, (rad - .3) / .28) : rad < .82 ? mix(.82, .5, (rad - .58) / .24) : mix(.5, -.3, (rad - .82) / .18);
  return mix(ps, pb, big);
}
float cushLump(vec2 off, vec4 cc, float big){ return mix(1. + (vn(off * 2.1 + cc.w * 50.) - .5) * .5, .5 + 1.05 * vn(off * 1.15 + cc.w * 50.), big); }
float cushPres(vec4 cc, float big){
  float pres = cushHere(cc) * smoothstep(.45, 1., uGrowth);
  // a small cushion swallowed by a big mat is not drawn (the mat is painted over it on the ground too)
  if (big < .5) { vec4 cb = cushCell(floor(cushGrid(cc.xy, 4.8)), 4.8); vec2 vb = cc.xy - cb.xy;
    pres *= 1. - cushHere(cb) * (1. - step(cb.z * cushLobe(cb, vb) + cc.z * .6, length(vb))); }
  return pres;
}
float cushHgt(vec4 cc, float big){ return mix(max(cc.z * .62, .17), .14 + cc.z * .33, big); }
vec3 cushFace(vec4 cc, float hv){
  float tint = fract(cc.w * 7.31);
  vec3 face = mix(cMagenta, cMagenta * vec3(1.2, .6, 1.3) + vec3(.02, 0., .04), step(.7, tint) * .7);
  return mix(face, cMagenta * vec3(1.2, 1.7, 1.25) + vec3(.1, .03, .08), step(tint, .17) * .6) * (.74 + .34 * hv);
}
`,qt=Ve+Le+`
attribute vec2 iCell; attribute vec4 iH; attribute float iS;
varying vec3 vP; varying vec4 vCc; varying float vO, vUp; varying vec2 vOff;
void main(){
  vec4 cc = cushCell(iCell, iS); float big = step(3., iS);
  vec2 q0 = (iCell + .5) * iS; vec2 c0 = vec2(.8 * q0.x - .6 * q0.y, .6 * q0.x + .8 * q0.y);
  float pres = cushPres(cc, big);
  vec2 dir = position.xz;
  float r = cc.z * .95 * pres * cushLobe(cc, dir);
  vec2 off = cc.xy - c0 + dir * r;
  float hgt = cushHgt(cc, big) * pres;
  // (the skirt of the mound goes a hand's breadth into the ground, so no gap shows under it where the ground dips)
  vec3 P = vec3(c0.x + off.x, iH.x + dot(iH.yz, off) + position.y * hgt * mix(1., cushLump(off, cc, big), step(.1, position.y)) - .12 * step(position.y, 0.), c0.y + off.y);
  vP = P; vCc = cc; vO = openAt(cc.xy, cc.w); vUp = position.y; vOff = off;
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.);
  gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,Dt=Le+`
varying vec3 vP; varying vec4 vCc; varying float vO, vUp; varying vec2 vOff;
void main(){
  vec2 p = vP.xz; vec2 v = p - vCc.xy; float big = step(.8, vCc.z), R = max(vCc.z * cushLobe(vCc, v), 1e-3), cd = length(v) / R;
  float fwp = length(fwidth(vP));
  // the mound's own slope: the dome, and the humps of a big mat (from the lump function's gradient)
  float hz = sqrt(max(1. - cd * cd, 0.));
  float l0 = cushLump(vOff, vCc, big), lx = cushLump(vOff + vec2(.08, 0.), vCc, big), lz = cushLump(vOff + vec2(0., .08), vCc, big);
  vec3 N = normalize(vec3(v.x / R, hz * mix(1., 1.7, big) + .3, v.y / R) - vec3(lx - l0, 0., lz - l0) * 5. * big * smoothstep(.1, .5, vUp));
  // two maps of the surface, neither of them stretched: the plan on the top of the mound, and round its flank (the way round it,
  // the way up it) where it falls steeply. Every head is drawn in one of them, so it is a round star whichever way the surface faces
  float top = 1. - smoothstep(mix(.4, .6, big), mix(.66, .84, big), cd);
  vec2 uS = vec2(atan(v.y, v.x + 1e-5) * vCc.z * .9, vP.y * 1.15), uv = mix(uS, p, step(.5, top));
  float hd = mix(7.5, 6., big), fw = fwp * hd, dens = mix(.8, .98, fract(vCc.w * 3.71));
  vec2 t1 = cushStars(p * hd, fw, vO, dens), t2 = cushStars(vec2(.6 * p.x - .8 * p.y, .8 * p.x + .6 * p.y) * hd * 1.13 + 4.7, fw * 1.13, vO, dens * .94);
  vec2 f1 = cushStars(uS * hd, fw, vO, dens), f2 = cushStars(vec2(.6 * uS.x - .8 * uS.y, .8 * uS.x + .6 * uS.y) * hd * 1.13 + 4.7, fw * 1.13, vO, dens * .94);
  float hm = mix(max(f1.x, f2.x), max(t1.x, t2.x), top), th = mix(max(f1.y, f2.y * (1. - f1.x)), max(t1.y, t2.y * (1. - t1.x)), top);
  float hv = h21(floor(uv * hd) + 1.7);
  vec3 face = cushFace(vCc, hv), backc = mix(cMagenta * vec3(.5, .55, .62), vec3(.3, .3, .32), .4);
  // (each head: rays darker toward their tips and between them, a small pale throat)
  vec3 hcol = mix(mix(backc, face * (.8 + .3 * hm), vO), vec3(.95, .74, .42), th * .7);
  // succulent leaf between the heads: short grey-green fingers, dark between them
  float lf = vn(uv * 23.) * .55 + vn(uv * 57. + 3.) * .45;
  vec3 leaf = mix(cGreen * vec3(.52, .66, .58), vec3(.2, .3, .22), .5) * (.25 + 1.0 * smoothstep(.25, .8, lf));
  N = normalize(N + vec3(vn(uv * 41.) - .5, 0., vn(uv * 41. + 7.) - .5) * .5);
  vec3 nearC = mix(leaf, hcol, hm);
  vec3 farC = mix(mix(leaf, backc, .3 * dens), mix(leaf, face * .96, dens * .74), vO);
  vec3 alb = mix(nearC, farC, smoothstep(.3, .95, fw)) * mix(.5, 1., smoothstep(-.2, .3, vUp)) * (.78 + .22 * smoothstep(.2, .9, l0));
  vec3 col = shadeS(alb, N, vP, .25, 1., 0.);
  // the rays are satin: now one head, now another flashes back the sun
  float lit = sunLine(p) * domeShadow(vP); vec3 V = normalize(uCam - vP + vec3(0., 1e-4, 0.));
  float tw = h21(floor(uv * hd) + floor(uTime * 5. + dot(V, vec3(31., 17., 23.))) * 7.3);
  col += mix(uSunCol, uSunCol * cMagenta * 2.5, .3) * lit * step(.965, tw) * hm * vO * (1. - smoothstep(.4, 1., fw)) * .4;
  gl_FragColor = vec4(col, 1.);
#include <fog_fragment>
}`,Ft=Ve+Le+`
attribute vec2 iCell; attribute vec4 iH; attribute float iS; attribute vec3 iF;
varying vec3 vP, vN, vFace; varying vec2 vQ; varying float vO, vHs;
void main(){
  vec4 cc = cushCell(iCell, iS); float big = step(3., iS);
  vec2 q0 = (iCell + .5) * iS; vec2 c0 = vec2(.8 * q0.x - .6 * q0.y, .6 * q0.x + .8 * q0.y);
  float pres = cushPres(cc, big);
  float a = iF.x * 6.2832, rad = sqrt(iF.y) * .93; vec2 dir = vec2(cos(a), sin(a));
  float r = cc.z * .95 * pres * cushLobe(cc, dir) * rad;
  vec2 off = cc.xy - c0 + dir * r;
  float hgt = cushHgt(cc, big) * pres;
  float o = openAt(cc.xy, fract(cc.w + iF.z * .37));
  vec3 base = vec3(c0.x + off.x, iH.x + dot(iH.yz, off) + cushProf(rad, big) * hgt * cushLump(off, cc, big) + .015, c0.y + off.y);
  vec3 toC = uCam - base; float dc = length(toC);
  vec3 Nd = normalize(vec3(dir.x * rad * rad * 1.1, 1., dir.y * rad * rad * 1.1));
  vec3 Hn = normalize(Nd + vec3(0., .35, 0.) + toC / max(dc, 1e-3) * .7 * mix(.3, 1., o) + vec3(sin(uTime * 7. + iF.x * 40.), 0., cos(uTime * 6.1 + iF.z * 30.)) * .05);
  vec3 T = normalize(cross(vec3(.3, 0., 1.), Hn)); vec3 Bv = cross(Hn, T);
  // (thinned by the mat's own density, shut heads small; drawn a little larger with distance and gone by 45 m)
  float dens = mix(.72, .97, fract(cc.w * 3.71));
  float size = (.034 + .03 * iF.z) * mix(.45, 1., o) * step(fract(iF.z * 9.7 + iF.x * 3.1), dens) * step(1e-3, pres) * (1. + dc * .03) * (1. - smoothstep(30., 45., dc));
  vec3 P = base + Hn * .012 + (T * position.x + Bv * position.y) * size;
  vP = P; vN = Hn; vQ = position.xy; vO = o; vHs = iF.z; vFace = cushFace(cc, fract(iF.z * 5.3 + iF.y * 2.9));
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.);
  gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,Ht=`
varying vec3 vP, vN, vFace; varying vec2 vQ; varying float vO, vHs;
void main(){
  float r = length(vQ), a = atan(vQ.y, vQ.x + 1e-5);
  // many narrow rays in two whorls; shut, a small pointed bud
  float pm = abs(fract(a * 3.5 + vHs * 7.) - .5) * 2.;
  if (r > mix(.55, mix(1., .7, pm * pm), vO)) discard;
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.)); vec3 V = normalize(uCam - vP + vec3(0., 1e-4, 0.)); if (dot(N, V) < 0.) N = -N;
  vec3 backc = mix(cMagenta * vec3(.5, .55, .62), vec3(.3, .3, .32), .4);
  vec3 alb = mix(backc * (1.2 + .5 * (1. - r)), vFace * (.8 + .3 * cos(pm * 3.1416)) * (.72 + .4 * r), vO);
  // the pale throat and its ring of stamens
  alb = mix(alb, vec3(.95, .82, .5), (1. - smoothstep(.16, .3, r)) * vO);
  alb = mix(alb, vec3(.6, .4, .08), (1. - smoothstep(.05, .12, r)) * vO);
  float lit = sunLine(vP.xz) * domeShadow(vP);
  vec3 col = shade(alb, N, vP, .5) + alb * uSunCol * lit * .1;
  // the rays are satin: now one flower, now another flashes back the sun
  float tw = h21(floor(vP.xz * 9.) + floor(uTime * 5. + vHs * 13. + dot(V, vec3(31., 17., 23.))) * 7.3);
  col += mix(uSunCol, uSunCol * cMagenta * 2.5, .5) * lit * step(.93, tw) * vO * smoothstep(.2, .5, r) * (1. - smoothstep(.6, .95, r)) * .6;
  gl_FragColor = vec4(col, 1.);
#include <fog_fragment>
}`;function Tt(){const a=[],n=[],e=[];for(let l=0;l<13;l++){const c=l/13*Math.PI*2,x=a.length/3;for(const y of[0,.5,1])for(const b of[-1,1])a.push(c,y,b),n.push(0);e.push(x,x+1,x+2,x+1,x+3,x+2,x+2,x+3,x+4,x+3,x+5,x+4)}let s=a.length/3;a.push(0,.009,0),n.push(1);for(let l=0;l<6;l++){const c=l/6*Math.PI*2;a.push(Math.cos(c)*.0135,.003,Math.sin(c)*.0135),n.push(1)}for(let l=0;l<6;l++)e.push(s,s+1+(l+1)%6,s+1+l);s=a.length/3;for(const l of[0,1])for(let c=0;c<3;c++){const x=c/3*Math.PI*2;a.push(Math.cos(x)*.0045,l,Math.sin(x)*.0045),n.push(2)}for(let l=0;l<3;l++){const c=(l+1)%3;e.push(s+l,s+3+l,s+c,s+c,s+3+l,s+3+c)}s=a.length/3;for(const l of[[-1,-1],[1,-1],[1,1],[-1,1]])a.push(l[0],0,l[1]),n.push(3);e.push(s,s+2,s+1,s,s+3,s+2);for(let l=0;l<4;l++){const c=l/4*Math.PI*2+.4;s=a.length/3,a.push(c,.1,-.6,c,.1,.6,c,.6,-1,c,.6,1,c,1,0);for(let x=0;x<5;x++)n.push(4);e.push(s,s+1,s+2,s+1,s+3,s+2,s+2,s+3,s+4)}return{pos:a,part:n,idx:e}}function ct(a,n,e,s){const l=new t.InstancedBufferGeometry;l.setAttribute("position",new t.Float32BufferAttribute(a.pos,3)),a.part&&l.setAttribute("aPart",new t.Float32BufferAttribute(a.part,1)),l.setIndex(a.idx),l.setAttribute("iPos",new t.InstancedBufferAttribute(new Float32Array(n),3)),l.setAttribute("iRnd",new t.InstancedBufferAttribute(new Float32Array(e),4)),l.instanceCount=n.length/3;const c=new t.Mesh(l,s);return c.frustumCulled=!1,c}async function It(a,n={}){const e=a.rng,s=a.noise,l=(o,r,p)=>Math.min(p,Math.max(r,o)),c=(o,r,p)=>{const w=l((p-o)/(r-o),0,1);return w*w*(3-2*w)},x=(n.palette&&n.palette.length>=7?n.palette:pt).map(o=>new t.Color(o)),y={gravel:x[0],orange:x[1],white:x[2],magenta:x[3],gold:x[4],rock:x[5],green:x[6]},b=Math.max(100,n.apron??280),j=l(n.density??1,.5,1.5),N={orange:[0,1,0,0],white:[9,1,0,0],thin:[0,.74,.5,0],flax:[3,1,0,1]}[n.season]||[0,1,0,0],m=new t.Group;m.name="kokerboom-koppie";const A=typeof n.plain=="function"?n.plain:null,f=e.sign(),T=n.tideDir?new t.Vector2(n.tideDir[0],n.tideDir[1]):new t.Vector2(e.range(.24,.42),-1);T.normalize();const R=[e.range(104,128),e.range(14,26),e.range(.012,.02),e.range(0,6.28)];R[1]=24+(R[1]-14)*.6,R[2]=.026+(R[2]-.012)*.7,R[3]=Math.PI+(R[3]/6.28-.5)*.5,R[0]=138-R[1]*Math.sin(R[3]);const E=[];for(let o=0;o<3;o++){const r=e.range(0,Math.PI*2),p=e.range(112,Math.min(200,b*.72));E.push(new t.Vector3(Math.sin(r)*p,Math.cos(r)*p,e.range(11,15)))}const F=[-1,1].map(o=>({s:o,x:o*e.range(33,35.5),z:e.range(-3,3),top:o===f?39.5:e.range(33.5,36.5),r:e.range(13.2,14.6),sy:e.range(1.18,1.34)})),Y=F.map(o=>({x:o.x*1.04,z:o.z,r:21,h:e.range(6,8)})),K=e.range(0,100),$=e.range(0,100),B=mt-Y.reduce((o,r)=>o+r.h*Math.exp(-(r.x*r.x+r.z*r.z)/(r.r*r.r)),0),_=4.4,C=o=>Fe-o*Math.tan(Pe),M=(o,r)=>{const p=Math.hypot(o*.8,r),w=l(p/st,0,1);let g=B*(1-w*w*(3-2*w));for(const i of Y)g+=i.h*Math.exp(-((o-i.x)**2+(r-i.z)**2)/(i.r*i.r));const S=r>-25?c(7,24,Math.abs(o)):1;if(r>8&&r<84){const i=(C(r)-_)*c(8,22,r)*(1-c(64,84,r))-g;i>0&&(g+=i*(1-c(9,30,Math.abs(o)))*c(8,22,r)*(1-c(64,84,r)))}const k=c(.12,.4,w)*(1-c(.85,1.25,p/st));g+=s.fbm2(o*.032+K,r*.032+$,3)*4.6*k*(.1+.9*S);const h=c(62,140,p);A?g+=A(o,r):g+=(s.fbm2(o*.007+$,r*.007+K,2)*1.5+.2)*h*(.25+.75*S);const u=Math.abs(r-(R[0]+R[1]*Math.sin(o*R[2]+R[3])));return g-=.8*(1-c(4,12,u))*c(78,100,p),A?g:g*(1-c(b*.86,b,Math.hypot(o,r)))},Q=(o,r)=>{const p=M(o+.7,r)-M(o-.7,r),w=M(o,r+.7)-M(o,r-.7);return 1-1.4/Math.hypot(p,1.4,w)},W=Math.cos(Pe),J=Math.sin(Pe),oe=[[0,.8,172],[0,.35,150],[0,0,128],[0,.25,110],[0,.8,92]].map(o=>new t.Vector3(o[0],M(0,o[2])*.5+1.8+o[1],o[2]));for(let o=80;o>=0;o-=20)oe.push(new t.Vector3(0,Fe-o*J,o*W));const z=(o,r,p)=>r>-30&&Math.abs(o)<7.2+p*1.25,G=[],ee=[],se=(o,r,p,w,g)=>M(o,r)+p*w*g;for(const o of F){const r={x:o.x,y:o.top-o.r*o.sy,z:o.z,r:o.r,sy:o.sy,sx:e.range(.95,1.05),sz:e.range(.95,1.08),detail:9,facets:5,tone:1};G.push(r),ee.push(r);const p=e.int(2,3),w=e.range(0,6.28);for(let S=0;S<p;S++){const k=w+S/p*Math.PI*1.3-Math.PI*.65,h=o.r*e.range(.75,1),u=e.range(7.5,10.5),i=o.x+o.s*Math.abs(Math.cos(k))*h+o.s*2,d=o.z+Math.sin(k)*h*1.25,v=e.range(.85,1.1),P={x:i,y:se(i,d,u,v,.3),z:d,r:u,sy:v,sx:1,sz:1.05,detail:9,facets:4,tone:e.range(.9,1.08)};G.push(P),ee.push(P)}const g=e.int(6,8);for(let S=0;S<g;S++){const k=e.range(0,6.28),h=S<3?e.range(1,1.45):e.range(.25,1),u=S<3?e.range(3.2,5):e.range(2.2,4.2),i=o.x+Math.cos(k)*Math.cos(h)*o.r*.97,d=o.z+Math.sin(k)*Math.cos(h)*o.r*.97;if(Math.abs(i)<17)continue;const v=r.y+Math.sin(h)*o.r*o.sy*.95+u*.22;if(G.push({x:i,y:v,z:d,r:u,sy:e.range(.62,.9),detail:3,facets:4,tone:e.range(.85,1.12)}),S<2&&e.chance(.7)){const P=u*e.range(.5,.68);G.push({x:i+e.range(-.8,.8),y:v+u*.75+P*.45,z:d+e.range(-.8,.8),r:P,sy:.85,detail:3,facets:3,tone:1.05})}}}for(let o=0,r=0;ee.length<De&&o<4&&r<60;r++){const p=e.range(0,Math.PI*2),w=e.range(34,56),g=e.range(7,10.5),S=Math.sin(p)*w/.8,k=Math.cos(p)*w;if(z(S,k,g+6)||ee.some(i=>Math.hypot(i.x-S,i.z-k)<i.r+g+2))continue;const h=e.range(.6,.85),u={x:S,y:se(S,k,g,h,.12),z:k,r:g,sy:h,sx:e.range(1,1.25),sz:e.range(1,1.25),detail:9,facets:1,tone:e.range(.9,1.1)};G.push(u),ee.push(u),o++}const ae=(o,r,p,w,g,S,k)=>{for(let h=0,u=0;h<o&&u<o*8;u++){let i,d;if(G.length&&e.chance(.55)){const L=e.pick(G),D=L.r*e.range(.9,1.7)+1,H=e.range(0,6.28);i=L.x+Math.cos(H)*D,d=L.z+Math.sin(H)*D}else{const L=e.range(0,Math.PI*2),D=e.range(r,p);i=Math.sin(L)*D/.8,d=Math.cos(L)*D}const v=e.range(w,g)*e.range(.8,1.1),P=Math.hypot(i*.8,d);if(P<13||P>p+12||z(i,d,v))continue;const q=e.range(.6,.95);G.push({x:i,y:se(i,d,v,q,e.range(.15,.45)),z:d,r:v,sy:q,detail:S,facets:k,tone:e.range(.82,1.15)}),h++}};ae(40,16,66,1.9,4.4,3,4),ae(80,14,84,.55,1.6,2,3),await a.yield();const X=new t.Vector3(-.5,.62,.6).normalize(),I=[];for(let o=0;o<De;o++){const r=ee[o];I.push(r?new t.Vector4(r.x,r.y+r.r*(r.sy-1)*.3,r.z,r.r*1.04):new t.Vector4(0,-1e3,0,.001))}const V={uSunDir:{value:X.clone()},uSunCol:{value:new t.Color(3,2.84,2.5)},uSkyCol:{value:new t.Color(.62,.74,.9)},uGndCol:{value:new t.Color(.2,.17,.15)},uCam:{value:new t.Vector3(0,30,200)},uTime:{value:0},uFront:{value:-20},uOpen:{value:1},uGrowth:{value:1},uApron:{value:n.field??b},uFill:{value:n.fill??1.5},uTideDir:{value:T},uSeed:{value:new t.Vector4(e.range(0,90),e.range(0,90),e.range(0,90),e.range(0,90))},uWash:{value:new t.Vector4(...R)},uSeason:{value:new t.Vector4(N[0],N[1]*j,N[2],N[3])},uDomes:{value:I},uHeu:{value:E},uCast:{value:Array.from({length:at},()=>new t.Vector4(0,-1e3,0,.001))},uCloud:{value:new t.Vector4(0,0,0,0)},uCb:{value:new t.Vector4(0,0,100,0)},uCbAx:{value:new t.Vector4(1,0,1,0)},uIsle:{value:new t.Vector4(0,0,100,0)},uIsleAx:{value:new t.Vector4(0,1,1,0)},uHol:{value:new t.Vector4(0,0,9e3,20)},uHolK:{value:new t.Vector2(0,0)},uTongue:{value:new t.Vector4(0,9e3,1,0)},uArc:{value:new t.Vector4(0,0,1,0)},uTrack:{value:new t.Vector4(2.2,96,330,0)},uTune:{value:new t.Vector3(8,1,1)},uNite:{value:0},uPlan:{value:new t.Vector4(0,0,0,0)},uRise:{value:new t.Vector4(0,1,0,0)},uW2:{value:new t.Vector4(0,0,60,60)},uPan:{value:new t.Vector4(0,0,0,0)},uRefl:{value:[0,1,2,3,4,5,6,7].map(()=>new t.Vector4)},uVeilM:{value:new t.Vector4(1,0,0,0)},uVeilC:{value:new t.Color(0,0,0)},uBull:{value:new t.Vector4(9e3,0,9e3,0)},uOrange:{value:new t.Vector4(0,9e3,1,0)},uMound:{value:new t.Vector4(0,9e3,1,0)},uSw:{value:[new t.Vector4(0,1,0,0),new t.Vector4(0,1,0,0),new t.Vector4(0,1,0,0)]},uBias:{value:0},uReal:{value:new t.Vector4(0,14,0,0)},uFrac:{value:1},uWet:{value:0},uRain:{value:0},uSkyRef:{value:new t.Color(.5,.62,.8)},uGlowRef:{value:new t.Color(0,0,0)},uZen:{value:new t.Color(.055,.19,.53)},uHor:{value:new t.Color(.56,.68,.78)},uSunD:{value:X.clone()},uGlow:{value:new t.Color(0,0,0)},uCloudCol:{value:new t.Color(1,1,1)},uCloudSh:{value:new t.Color(.42,.47,.6)},uBelt:{value:new t.Vector4(.42,.2,.25,0)},uCloudP:{value:new t.Vector4(0,0,.5,0)},uWind:{value:new t.Vector4(1,0,0,0)},uNight:{value:0},uBand:{value:new t.Vector4(0,0,0,0)},cGravel:{value:y.gravel},cOrange:{value:y.orange},cWhite:{value:y.white},cMagenta:{value:y.magenta},cGold:{value:y.gold},cRock:{value:y.rock},cGreen:{value:y.green}};let ne=null,pe=null,he=null,re=null;const ye=84,de=132;{const o=ye,r=de,p=[],w=[],g=[],S=[];for(let h=0;h<=o;h++){const u=b*Math.pow(h/o,1.45);for(let i=0;i<r;i++){const d=(i+h%2*.5)/r*Math.PI*2,v=Math.sin(d)*u,P=Math.cos(d)*u,q=M(v,P);p.push(v,q,P);const L=M(v+.8,P)-M(v-.8,P),D=M(v,P+.8)-M(v,P-.8),H=1/Math.hypot(L,1.6,D);w.push(-L*H,1.6*H,-D*H);let Z=1;if(u<110)for(const O of G){const te=Math.hypot(v-O.x,P-O.z);te<O.r*1.6&&q>O.y-O.r*O.sy-1&&(Z*=.3+.7*c(O.r*.7,O.r*1.6,te))}g.push(Z)}await a.yield()}await a.yield();for(let h=0;h<o;h++){for(let u=0;u<r;u++){const i=h*r+u,d=h*r+(u+1)%r,v=i+r,P=d+r;h%2?S.push(i,P,v,i,d,P):S.push(i,d,v,d,P,v)}h%16===15&&await a.yield()}await a.yield();const k=Ne({pos:p,nor:w,idx:S},{aOcc:[g,1]});re=p,await a.yield(),ne=xe(V,wt,xt,{side:t.DoubleSide}),m.add(new t.Mesh(k,ne))}await a.yield();let Be=null;{const o={pos:[],col:[],idx:[]};for(const p of[...new Set(G.map(w=>w.detail))].sort((w,g)=>w-g))await zt(p,a);for(let p=0;p<G.length;p++)nt(o,G[p],s,e,y),await a.yield();await a.yield();const r=new t.BufferGeometry;r.setAttribute("position",new t.Float32BufferAttribute(o.pos,3)),await a.yield(),r.setAttribute("color",new t.Float32BufferAttribute(o.col,3)),await a.yield(),r.setIndex(o.idx),await a.yield(),await kt(r,a),await a.yield(),pe=xe(V,yt,bt),m.add(new t.Mesh(r,pe)),Be=r}await a.yield();const Oe=[],Ie=[];let je=null;{const o={pos:[],nor:[],col:[],sway:[],kind:[],idx:[]},r=e.sign();for(const g of[-1,1]){const S=g*12.3,k=3+e.range(-.8,.8),h=M(S,k)-.25,u=Ge(o,{x:S,y:h,z:k,H:12.6*e.range(.97,1.03),leanDir:[-g,0],lean:13*Math.PI/180,levels:5,hero:!0,nest:g===r,yaw:e.range(-.5,.5)},e,y,s);Oe.push(new t.Vector3(S,h,k)),Ie.push(u.top),u.nest&&(je=u.nest),await a.yield()}await a.yield();const p=[];for(let g=0,S=0;g<28&&S<500;S++){let k,h;if(g<8){const d=F[g%2],v=e.range(0,6.28),P=d.r*e.range(1.05,1.7);k=d.x+Math.cos(v)*P,h=d.z+Math.sin(v)*P}else if(g<18)k=e.sign()*e.range(15,74),h=e.range(-9,7);else{const d=e.range(0,Math.PI*2),v=e.range(20,62);k=Math.sin(d)*v/.8,h=Math.cos(d)*v}if(h>-30&&Math.abs(k)<15||G.some(d=>Math.hypot(d.x-k,d.z-h)<d.r*1.08+.7)||p.some(d=>Math.hypot(d[0]-k,d[1]-h)<5))continue;const u=e.range(4.8,8),i=e.range(0,6.28);Ge(o,{x:k,y:M(k,h)-.2,z:h,H:u,leanDir:[Math.cos(i),Math.sin(i)],lean:e.range(0,.1),levels:u>6.6?4:3,hero:!1,yaw:e.range(0,3.14)},e,y,s),p.push([k,h]),g++,g%2===1&&await a.yield()}await a.yield();const w=Ne(o,{aSway:[o.sway,1],aKind:[o.kind,1]});await a.yield(),he=xe(V,Mt,At,{side:t.DoubleSide}),m.add(new t.Mesh(w,he))}await a.yield();const be={mid:null,near:null,cush:[]},Ce=a.quality?.detail??1,Re=(o,r,p)=>G.some(w=>Math.hypot(w.x-o,w.z-r)<w.r*.95+p);{const o=Math.round(15e3*Ce),r=[],p=[];for(let g=0,S=0;g<o&&S<o*3;S++){let k,h;if(e.chance(.86))k=e.gauss()*5.5,h=26+152*Math.sqrt(e());else{const v=e.gauss()*.9,P=e.range(26,118);k=Math.sin(v)*P/.8,h=Math.cos(v)*P}if(Re(k,h,.1))continue;const u=e(),i=e(),d=e();g++,g<=o*.8&&(r.push(k,M(k,h),h),p.push(u,i,d,Math.hypot(k*.8,h)>84?0:Q(k,h))),g%500===499&&await a.yield()}await a.yield();const w={pos:[-1,-1,0,1,-1,0,1,1,0,-1,1,0],idx:[0,1,2,0,2,3]};be.mid=ct(w,r,p,xe(V,Nt,it,{side:t.DoubleSide})),m.add(be.mid)}await a.yield();const _e=new t.Vector3(0,0,112);{for(let g=0,S=0,k=Math.round(250*(.5+.5*Ce));g<k&&S<k*4;S++){const h=e.gauss()*3.6,u=e.range(78,150);Math.abs(h)<.4||Re(h,u,.2)||(e(),e(),e(),e(),g++)}const o=a.core.makeRng(((a.seed|0)^5369127)>>>0),r=Math.round(520*(.5+.5*Ce)),p=[],w=[];for(let g=0,S=0;g<r&&S<r*4;S++){const k=o.gauss()*4.3,h=o.range(80,179);Math.abs(k)<.5||Math.abs(k)>13||Re(k,h,.3)||(p.push(k,M(k,h),h),w.push(o(),o(),o(),o()),g++)}_e.y=M(0,112),be.near=ct(Tt(),p,w,xe(V,Vt,lt,{side:t.DoubleSide})),m.add(be.near)}await a.yield();{const o=xe(V,qt,Dt),r=xe(V,Ft,Ht,{side:t.DoubleSide}),p=(h,u)=>{const i=[.03,1,-.02],d=[];u.forEach(([v,P],q)=>{for(let L=0;L<h;L++){const D=(L+q%2*.5)/h*Math.PI*2;i.push(Math.cos(D)*v,P,Math.sin(D)*v)}});for(let v=0;v<h;v++)d.push(0,1+(v+1)%h,1+v);for(let v=0;v<u.length-1;v++){const P=1+v*h,q=P+h,L=v%2;for(let D=0;D<h;D++){const H=(D+1)%h;L?d.push(P+D,P+H,q+H,P+D,q+H,q+D):d.push(P+D,P+H,q+D,P+H,q+H,q+D)}}return{pos:i,idx:d}},w=a.core.makeRng(((a.seed|0)^3891703)>>>0),g=(h,u,i,d,v)=>{const P=re[h*3],q=re[h*3+2],L=re[u*3],D=re[u*3+2],H=re[i*3],Z=re[i*3+2],O=(D-Z)*(P-H)+(H-L)*(q-Z);if(Math.abs(O)<1e-9)return null;const te=((D-Z)*(d-H)+(H-L)*(v-Z))/O,le=((Z-q)*(d-H)+(P-H)*(v-Z))/O,ie=1-te-le;return te<-.001||le<-.001||ie<-.001?null:te*re[h*3+1]+le*re[u*3+1]+ie*re[i*3+1]},S=(h,u)=>{const i=Math.hypot(h,u);if(!re||i>b*.98)return M(h,u);const d=Math.floor(ye*Math.pow(i/b,1/1.45)),v=(Math.atan2(h,u)/(Math.PI*2)%1+1)%1*de;for(let P=0;P<3;P++){const q=d+(P===1?-1:P===2?1:0);if(q<0||q>=ye)continue;const L=Math.floor(v-q%2*.5);for(let D=-1;D<=1;D++){const H=((L+D)%de+de)%de,Z=q*de+H,O=q*de+(H+1)%de,te=Z+de,le=O+de,ie=q%2?g(Z,le,te,h,u):g(Z,O,te,h,u);if(ie!==null)return ie;const ze=q%2?g(Z,O,le,h,u):g(O,le,te,h,u);if(ze!==null)return ze}}return M(h,u)},k=async(h,u,i,d,v,P)=>{const q=[],L=[],D=[],H=[],Z=[],O=[],te=[],le=Math.ceil(110/h);for(let ke=-le;ke<=le;ke++){for(let Me=-le;Me<=le;Me++){const Ye=(Me+.5)*h,Ze=(ke+.5)*h,fe=.8*Ye-.6*Ze,ve=.6*Ye+.8*Ze;if(Math.abs(fe)>i||ve<-1||ve>96||Re(fe,ve,.4+h*.2))continue;const $e=S(fe,ve),Je=(S(fe+d,ve)-S(fe-d,ve))/(2*d),Xe=(S(fe,ve+d)-S(fe,ve-d))/(2*d),et=Math.hypot(fe*.8,ve)>84?0:Q(fe,ve);if(q.push(Me,ke),L.push($e,Je,Xe,et),D.push(h),Math.abs(fe)<P)for(let tt=0;tt<v;tt++)H.push(Me,ke),Z.push($e,Je,Xe,et),O.push(h),te.push(w(),w(),w())}(ke&7)===7&&await a.yield()}const ie=new t.InstancedBufferGeometry;ie.setAttribute("position",new t.Float32BufferAttribute(u.pos,3)),ie.setIndex(u.idx),ie.setAttribute("iCell",new t.InstancedBufferAttribute(new Float32Array(q),2)),ie.setAttribute("iH",new t.InstancedBufferAttribute(new Float32Array(L),4)),ie.setAttribute("iS",new t.InstancedBufferAttribute(new Float32Array(D),1)),ie.instanceCount=D.length;const ze=new t.Mesh(ie,o);ze.frustumCulled=!1,m.add(ze),be.cush.push(ze),await a.yield();const we=new t.InstancedBufferGeometry;we.setAttribute("position",new t.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),we.setIndex([0,1,2,0,2,3]),we.setAttribute("iCell",new t.InstancedBufferAttribute(new Float32Array(H),2)),we.setAttribute("iH",new t.InstancedBufferAttribute(new Float32Array(Z),4)),we.setAttribute("iS",new t.InstancedBufferAttribute(new Float32Array(O),1)),we.setAttribute("iF",new t.InstancedBufferAttribute(new Float32Array(te),3)),we.instanceCount=O.length;const qe=new t.Mesh(we,r);qe.frustumCulled=!1,m.add(qe),be.cush.push(qe)};await k(1.5,p(8,[[.6,.74],[1,-.12]]),11,.5,Math.round(5*Ce),6),await a.yield(),await k(4.8,p(16,[[.3,.97],[.58,.82],[.82,.5],[1,-.3]]),22,1.2,Math.round(36*Ce),13)}await a.yield();const ht=F.map(o=>{let r=0;const p=new t.Vector3(o.x,o.top,o.z);for(const w of G)Math.hypot(w.x-o.x,w.z-o.z)<o.r&&w.y+w.r*w.sy>r&&(r=w.y+w.r*w.sy,p.set(w.x,r,w.z));return p}),dt=new t.Vector3(0,24,0),ut={portalSeat:{position:new t.Vector3(0,Fe,0),facing:new t.Vector3(0,-Math.sin(Pe),Math.cos(Pe)),tilt:Pe,radius:7},flyThrough:oe,gateTrees:Oe,nestTree:je,torTops:ht,treeTops:Ie,saddle:new t.Vector3(0,M(0,0),0),foot:new t.Vector3(0,M(0,72),72),nearField:_e,tideDir:new t.Vector3(T.x,0,T.y),sunDir:X.clone(),viewpoints:{reveal:new t.Vector3(30,14,230),foot:new t.Vector3(-14,4,120),climb:new t.Vector3(0,9.5,58)}};let We=!1,ce=null,ue=null,ft=0;const me={},Ee=new t.Quaternion,ge=new t.Vector3,Ke=new t.Vector3,Ue=o=>{We=!0,V.uFront.value=o},Qe=o=>Ue(-330+420*l(o,0,1));n.progress!=null&&Qe(n.progress);const vt=()=>{let o=m;for(;o.parent;)o=o.parent;ce=ue=null,o.traverse(r=>{r.isDirectionalLight&&!ce?ce=r:r.isHemisphereLight&&!ue&&(ue=r)})};return{object:m,radius:62,height:56,center:dt,anchors:ut,ground:!0,groundY:-3,heightAt:M,glsl:He+Ve,uniforms:V,apron:b,palette:y,groundMaterial:ne,makeMat:xe,midFrag:it,nearFrag:lt,tiers:be,async makeProps(o=[],r=[]){const p=new t.Group,w={nests:[],tops:[]},g=[],S=new Map,k=u=>{for(;g.length<=u;)g.push([]);return g[u]},h=u=>{let i=S.get(u);return i||(i=a.core.makeRng(a.core.hashSeed(u+":"+a.seed)),S.set(u,i)),i};if(o.length){const u=[];for(let i=0;i<o.length;i++){const d=o[i],v=d.g|0;u[v]||(u[v]={pos:[],col:[],idx:[]}),nt(u[v],d,s,h("rock of "+(d.st||"plain")),y),await a.yield()}{const i=[];for(const d of o){const v=d.g|0,P=Te(d.detail).pos.length/3,q=i[v]|0,L=u[v].pos;if(i[v]=q+P,d.seat===void 0&&!d.on)continue;let D=d.on&&d.on.moved||0;if(d.seat!==void 0){const H=St*(d.detail+1),Z=new Array(H).fill(1/0);for(let O=q;O<q+P;O++){const te=Math.min(H-1,Math.floor((Math.atan2(L[O*3+2]-d.z,L[O*3]-d.x)/(2*Math.PI)+.5)*H));Z[te]=Math.min(Z[te],L[O*3+1])}D=d.seat-Math.max(...Z.filter(O=>O<1/0))}for(let H=q;H<q+P;H++)L[H*3+1]+=D;d.y+=D,d.moved=D}await a.yield()}for(let i=0;i<u.length;i++)if(u[i]){await a.yield();const d=Ne(u[i]);await a.yield();const v=new t.Mesh(d,pe);p.add(v),k(i).push(v)}}if(r.length){const u=[];for(const i of r)i.on&&(i.y+=i.on.moved||0,i.on=null);for(let i=0;i<r.length;i++){const d=r[i],v=h("tree of "+(d.st||"plain")),P=v.range(0,6.28),q=d.g|0;u[q]||(u[q]={pos:[],nor:[],col:[],sway:[],kind:[],idx:[]});const L=Ge(u[q],{leanDir:[Math.cos(P),Math.sin(P)],lean:v.range(0,.1),levels:3,hero:!1,yaw:v.range(0,3.14),...d},v,y,s);w.tops.push(L.top),L.nest&&w.nests.push(L.nest),await a.yield()}for(let i=0;i<u.length;i++)if(u[i]){await a.yield();const d=Ne(u[i],{aSway:[u[i].sway,1],aKind:[u[i].kind,1]});await a.yield();const v=new t.Mesh(d,he);p.add(v),k(i).push(v)}}return p.userData.info=w,p.userData.groups=g,p},async seenFrom(o,r){const p=r||Be;return p?Ct(p,o,a):0},setProgress:Qe,setFront:Ue,setOpen(o){V.uOpen.value=l(o,0,1)},setGrowth(o){V.uGrowth.value=l(o,0,1)},setLight(o={}){Object.assign(me,o)},update(o,r,p){V.uTime.value=r,We||(V.uFront.value=-270+420*(r/16%1)),m.updateWorldMatrix(!0,!1),p&&(ge.setFromMatrixPosition(p.matrixWorld),V.uCam.value.copy(m.worldToLocal(ge))),ft++%90===0&&(!ce||!ce.parent||!ue)&&vt(),m.getWorldQuaternion(Ee).invert(),me.sunDir?ge.copy(me.sunDir):ce?(ge.setFromMatrixPosition(ce.matrixWorld),Ke.setFromMatrixPosition(ce.target.matrixWorld),ge.sub(Ke)):ge.copy(X).applyQuaternion(m.getWorldQuaternion(new t.Quaternion)),ge.lengthSq()>1e-8&&V.uSunDir.value.copy(ge.normalize().applyQuaternion(Ee)),me.sunColor?V.uSunCol.value.copy(me.sunColor):ce&&V.uSunCol.value.copy(ce.color).multiplyScalar(ce.intensity),me.skyColor?V.uSkyCol.value.copy(me.skyColor):ue&&V.uSkyCol.value.copy(ue.color).multiplyScalar(ue.intensity),me.groundColor?V.uGndCol.value.copy(me.groundColor):ue&&V.uGndCol.value.copy(ue.groundColor).multiplyScalar(ue.intensity)},dispose(){}}}export{It as buildHero};
