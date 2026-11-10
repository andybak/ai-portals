import*as e from"three";import{clamp as V,lerp as ae,smoothstep as ue}from"../kit/core.js";const B=Math.PI/180,U=[0,278.5,0],G=[0,130.3,59.7],ne=Math.hypot(U[1]-G[1],U[2]-G[2]),Q=[0,(U[1]-G[1])/ne,(U[2]-G[2])/ne],re=[[60,.7],[80,14],[100,27],[120,37],[135,43.5],[145,45],[162,41.7],[177,32],[186,18],[190,2.6]],O=[[0,5,.5,-62,90],[8,11,2,-58,90],[11,16,12,-10,45],[14,24,30,20,0],[19,48,58,22,0],[24,62,86,34,0],[28,62,113,52,0],[30,59.7,130.3,68,0]],we=`
uniform float uNsTime;
uniform vec3 uNsMoonDir;
uniform vec4 uNsMoon;      // x key light 0..1, y phase (0 gibbous .. 1 crescent), z disc 0|1, w lift of dark looks
uniform vec4 uNsTwi;       // x arc gain, y arc height scale, z ember gain, w red shift of the ember
uniform vec4 uNsSheet;     // x gain, y shadow edge (km south of the zenith), z softness of the edge (km), w light left in the shadow
uniform vec4 uNsDisp;      // x bands, y billows, z whirl twist, w veil
uniform vec4 uNsDark;      // x star gain, y Milky Way, z aurora, w seed
uniform vec4 uNsBelow;     // x ice edge 0|1, y coast 0|1, z ice light, w seed
uniform vec4 uNsWhirl[4];  // xy centre (km east, km south), z radius km, w turn
uniform vec3 uNsColA;      // the sheet overhead
uniform vec3 uNsColB;      // the sheet lower down
const vec3 NS_PORTAL = vec3(0., .927568, -.373656);
const float NS_LIMB = -.10873;   // sine of the horizon's dip from 38 km
float nsH1(vec2 p){ p = fract(p * vec2(.1031, .1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.x); }
vec2 nsH2(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz) * q.zy); }
float nsH3(vec3 p){ p = fract(p * .1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float nsVn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(nsH1(i), nsH1(i + vec2(1., 0.)), f.x), mix(nsH1(i + vec2(0., 1.)), nsH1(i + vec2(1., 1.)), f.x), f.y); }
float nsFbm(vec2 p){ float s = 0., a = .5; for (int i = 0; i < 4; i++) { s += a * nsVn(p); p = p * 2.03 + vec2(17.1, 9.2); a *= .5; } return s; }
float nsFbm2(vec2 p){ return .65 * nsVn(p) + .35 * nsVn(p * 2.1 + vec2(5.3, 1.7)); }
// cells: x distance to the nearest site, y distance to the edge between the two nearest (cell units), z the cell's own number
vec3 nsVor(vec2 p){ vec2 i = floor(p), f = fract(p), gw = vec2(0.); float d1 = 8., d2 = 8.;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y)); vec2 r = g + nsH2(i + g) - f; float d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; gw = g; } else if (d < d2) { d2 = d; } }
  return vec3(sqrt(d1), sqrt(d2) - sqrt(d1), nsH1(i + gw + 7.7)); }
float nsG(float a, float c, float s){ float x = (a - c) / s; return exp(-x * x); }
// stars: one hashed cell of a cube's face per sample; a soft disc never under a pixel and a half (fw: footprint, radians)
float nsStarLayer(vec3 d, float n, float fw, float dens, out float tint){
  vec3 ad = abs(d); vec3 q = d / max(max(ad.x, ad.y), ad.z) * .9995; vec3 c = floor(q * n);
  float h = nsH3(c + 3.7); tint = nsH3(c + 11.3);
  vec3 sp = normalize((c + .5 + .72 * (vec3(nsH3(c + 1.1), nsH3(c + 5.9), nsH3(c + 8.3)) - .5)) / n);
  float mag = pow(max(nsH3(c + 23.1), 0.), 6.) * .93 + .07;
  float r0 = (.05 + .09 * mag) / n, r = max(r0, fw * 1.25), ang = length(d - sp);
  float tw = .7 + .3 * sin(uNsTime * (1.5 + 5. * tint) + h * 50.);
  return step(h, dens) * (1. - smoothstep(r * .3, r, ang)) * mag * tw * clamp((r0 * r0) / (r * r) * 6., .25, 1.); }
// value noise in four octaves, each faded where it falls under two pixels (fk: the footprint in p's own units)
float nsFbmF(vec2 p, float fk){ float s = 0., a = .5, f = 1.;
  for (int i = 0; i < 4; i++) { s += a * mix(.5, nsVn(p), 1. - smoothstep(.2, .55, fk * f)); p = p * 2.03 + vec2(17.1, 9.2); a *= .5; f *= 2.03; } return s; }
// gradient noise with a quintic fade, about 0..1: no lattice crease, so a patch cut from it has no straight edge or corner
float nsGn(vec2 p){ vec2 i = floor(p), f = fract(p), u = f * f * f * (f * (f * 6. - 15.) + 10.);
  float a = dot(nsH2(i) - .5, f), b = dot(nsH2(i + vec2(1., 0.)) - .5, f - vec2(1., 0.));
  float c = dot(nsH2(i + vec2(0., 1.)) - .5, f - vec2(0., 1.)), e = dot(nsH2(i + vec2(1., 1.)) - .5, f - vec2(1., 1.));
  return clamp(.5 + 1.9 * mix(mix(a, b, u.x), mix(c, e, u.x), u.y), 0., 1.); }
// the same in three octaves, each turned, each faded to its mean where it falls under two pixels (fk: footprint in p's units)
float nsGf(vec2 p, float fk){ float s = 0., a = .57, f = 1.;
  for (int i = 0; i < 3; i++) { s += a * mix(.5, nsGn(p), 1. - smoothstep(.2, .55, fk * f)); p = mat2(1.62, 1.22, -1.22, 1.62) * p + vec2(17.1, 9.2); a *= .5; f *= 2.03; } return s; }
// a crisp train of ripples: crests L km apart across n (unit). Smooth noise bends the phase (wob cycles), so the crests
// wander, fork and end. Where L falls under two pixels (fk) the train passes into its own mean, in every direction alike:
// it is never drawn out along one direction.
float nsRip(vec2 p, vec2 n, float L, float wob, float sd, float ph, float fk){
  float w = (nsGn(p / (L * 4.5) + sd) - .5) * wob + (nsGn(p / (L * 17.) + sd * 1.7) - .5) * wob * 5.;
  float s = .5 + .5 * sin((dot(p, n) / L + w) * 6.2832 + ph);
  return mix(.5, mix(s, s * s * (3. - 2. * s), .35), 1. - smoothstep(.2, .5, fk / L)); }
`,pe=`
// the twilight arc. a: degrees above the limb, cn: cosine of the bearing from the sun's (north, drifting east)
vec3 nsArc(float a, float cn){
  // ONE GLOW (order 6): no layer, no band, no edge anywhere. Five tones stand at five heights; every height takes a
  // smooth blend of all five (weights that never rest, so no tone holds flat) under one falling brightness: the ember
  // hot and thin on the limb, rose-gold within a degree or two, pale gold, turquoise from 3 to 6 degrees, thinning
  // upward into the deep blue of the night. Brightest due north, dying east and west.
  float h = .6 + .35 * uNsTwi.y, am = max(a, 0.), x = am / h, w = smoothstep(-.55, 1., cn); w = w * w * (.3 + .7 * w);
  float w0 = exp(-x * x * 1.2), w1 = nsG(x, 1.3, 1.05), w2 = nsG(x, 2.8, 1.35), w3 = nsG(x, 4.7, 1.9), w4 = nsG(x, 8.4, 2.9);
  vec3 em = mix(vec3(1., .19, .03), vec3(1., .08, .02), uNsTwi.w) * uNsTwi.z;
  vec3 c = (em * w0 + vec3(1., .30, .16) * .78 * w1 + vec3(1., .68, .34) * .55 * w2 + vec3(.05, .60, .56) * .56 * w3 + vec3(.004, .05, .20) * .12 * w4)
    / (w0 + w1 + w2 + w3 + w4 + 1e-4) * exp(-x * x / ((x + 6.) * 9.));
  vec3 blue = vec3(.016, .06, .34) * .44 * exp(-am / (10. * h));
  return (c * w + blue * (.14 + .86 * w)) * uNsTwi.x;
}
// the moon: a disc 0.9 degrees in radius (art's licence), its phase, earthshine and a small halo
vec3 nsMoonDisc(vec3 d, float fw){
  float ca = dot(d, uNsMoonDir), ang = sqrt(max(2. - 2. * ca, 0.)), R = .0157;
  float disc = 1. - smoothstep(R - fw, R + fw, ang);
  vec3 ex = normalize(cross(vec3(0., 1., 0.), uNsMoonDir)), ey = cross(uNsMoonDir, ex);
  vec3 rel = d - uNsMoonDir * ca; vec2 uv = vec2(dot(rel, ex), dot(rel, ey)) / R;
  vec3 n = vec3(uv, sqrt(max(1. - dot(uv, uv), 0.)));
  vec3 sl = normalize(mix(vec3(-.55, -.35, .76), vec3(-.62, -.42, -.66), uNsMoon.y));
  float lit = smoothstep(-.02, .12, dot(n, sl)), mare = .74 + .26 * nsFbm2(uv * 2.3 + 4.);
  vec3 c = vec3(.95, .97, 1.) * (1.7 * lit * mare) + vec3(.05, .07, .11) * (.25 + uNsMoon.y);
  float halo = exp(-ang * 24.) * .09 + exp(-ang * 95.) * .28;
  return (c * disc + vec3(.5, .62, .9) * halo * (1. - disc) * (1. - .7 * uNsMoon.y)) * uNsMoon.z;
}
// THE SHEET's density (about 1 in a luminous field, 0 in clear night). p: km east and km south on the shell 45 km
// overhead, fk: a pixel's footprint there in km, calm 0..1: the structure gives way to a smooth glowing veil; low 0..1 (by
// direction, toward the limb): the cover closes, so the bright band over the limb has no hole.
// SCALE BY THE SHEET'S OWN PLANE (order 4): billows are soft rolls 8 km apart (10 degrees overhead) with a wispy grain
// along them and a darker trough beside each; bands 40 km apart cross them at 70 degrees; knots where crests cross;
// whirls 30 to 38 km wide wind the rolls into loose open spirals; between the fields featureless veil, then clear night.
// On the lighter looks each roll carries short ribs 2.8 km apart across its length (order 5); nothing finer is drawn.
// Where a train's wave falls under fourteen pixels it fades, and by five it has passed into its own mean, a smooth
// bright veil: no fine, evenly spaced line is drawn anywhere, and toward the limb only broad unequal bands are left.
float nsF(float fk, float L){ return 1. - smoothstep(.2, .5, fk / L); }
// the sheet's own trains go sooner (order 5): whole while a wave spans fourteen pixels, gone at five, so that no fine,
// evenly spaced line is ever drawn; what is left is the train's mean, a smooth veil
float nsFs(float fk, float L){ return 1. - smoothstep(.07, .2, fk / L); }
float nsSheet(vec2 p, float fk, float calm, float low){
  float t = uNsTime, sd = uNsDark.w, core = 0.;
  p.x -= t * (.45 + .002 * p.y);                                    // the whole pattern shears east
  for (int k = 0; k < 4; k++) {                                     // the whirls: the domain wound round four centres
    vec4 w = uNsWhirl[k]; vec2 r = p - w.xy; float s = max(1. - length(r) / w.z, 0.);
    float a = w.w * uNsDisp.z * s * s * (1.2 + .01 * t), ca = cos(a), sa = sin(a);
    p = w.xy + vec2(ca * r.x - sa * r.y, sa * r.x + ca * r.y); core = max(core, s); }
  // the cover: cloud, a thin veil round it, clear night beyond; every bound soft and irregular
  float big = nsGf(p / 120. + sd, fk / 120.) - .04 - .03 * smoothstep(.6, 1.15, uNsTwi.y);   // (order 5: on the lighter looks more of the sky is clear night)
  float wh = .75 * smoothstep(0., .9, core);                         // a whirl carries cloud, with veil in it
  float body = max(mix(smoothstep(.32, .56, big), 1., low), wh), veil = max(mix(smoothstep(.20, .42, big), 1., low), wh);
  float tone = mix(1., .68 + .64 * nsGn(p / 53. + 2. + sd), nsFs(fk, 53.));
  vec2 wq = p + (vec2(nsGn(p / 85. + 3.1), nsGn(p / 85. + 7.7)) - .5) * 44. * nsFs(fk, 85.);
  // the bands: crests 40 km apart, a slow swell of light (the faster train)
  float sbn = .5 + .5 * sin(dot(wq, vec2(.574, .819)) * (6.2832 / 40.) - t * .17), band = mix(.5, sbn, nsFs(fk, 40.));
  // the billows: rolls 8 km apart at 70 degrees to the bands (the slower train), gently bent, forking, ending. Both trains
  // lie 35 degrees off east-west, one either way: toward the northern limb perspective squeezes them into herringbone
  vec2 nb = vec2(-.574, .819);
  float wb = (nsGn(p / 30. + 21.) - .5) * 1.3 + (nsGn(p / 104. + 35.7) - .5) * 3.2;
  float cyc = dot(p, nb) / 8. + wb + t * .0557, sr = .5 + .5 * sin(cyc * 6.2832), al = dot(p, vec2(.819, .574));
  float bead = smoothstep(.30, .62, nsGn(vec2(floor(cyc + .25) * 3.7, al / 15.) + 13.));          // each roll waxes and wanes along its own length
  float fib = (nsGn(vec2(cyc * 7.3, al / 5.) + 9.) - .5) * nsF(fk, 1.1);   // the grain runs along the roll
  // (order 5, the lighter looks) A ROLL IS RIPPLED CLOUD: short ribs 2.8 km apart stand across its length, on its crest,
  // in patches, each roll's out of step with the next; like every train they go into their mean before five pixels
  float rp = .5 + .5 * sin((al / 2.8 + 1.9 * nsGn(vec2(cyc * .9, al / 19.) + 4.)) * 6.2832);
  float ribs = mix(1., .5 + rp, smoothstep(.24, .50, nsGn(p / 17. + 23. + sd)) * nsFs(fk, 2.8) * smoothstep(.6, 1.15, uNsTwi.y));
  float roll = mix(.39, clamp(sr * sr * (1.4 - .4 * sr) * (1. + 1.2 * fib) * ribs + .22 * fib, 0., 1.3), .25 + .75 * bead);
  // where the rolls are too fine to draw, the same train's longer swell (20 km) still ribs the cloud; then its mean
  float sw = .5 + .5 * sin(cyc * 2.5133 + 1.3);
  roll = mix(mix(.39, .14 + .66 * sw * sw, nsFs(fk, 20.)), roll, nsFs(fk, 8.));
  // the fields: where billows stand, where bands run; elsewhere bare veil. No two quarters of the sky alike.
  float gb = max(smoothstep(.33, .55, mix(.5, nsGn(p / 33. + vec2(31., 7.) + sd), nsFs(fk, 33.)) + (uNsDisp.y - 1.) * .12 + .3 * low), wh) * (1. - .6 * core * core);
  float gn = smoothstep(.36, .60, mix(.5, nsGn(p / 71. + 11. + sd), nsFs(fk, 71.)) + (uNsDisp.x - .8) * .15 + .3 * low);
  float kb = clamp(.62 + .28 * uNsDisp.y, 0., 1.), kn = clamp(.2 + .55 * uNsDisp.x, 0., .9);
  // a band is rippled cloud (order 5): on its crest the rolls stand across its length, whether a billow field is there or not
  float rib = max(gb, .85 * gn * smoothstep(.35, .8, band));
  float B = mix(1., .45 + 1.1 * band, gn * kn), R = mix(1., .44 + 1.42 * roll, rib * kb);
  float knot = 1. + .45 * gb * gn * roll * band;                    // knots where crests cross
  float thin = mix(1., .55, smoothstep(.6, 1.15, uNsTwi.y));        // the lighter looks: less veil, so the gaps are night
  float den = .26 * veil * (.6 + .4 * uNsDisp.w) * thin + body * tone * .86 * B * R * knot;
  // toward the limb, where every train has gone into its mean: only broad, soft, unequal bands (two great slow fields)
  den *= mix(1., (.74 + .52 * nsGn(p / vec2(560., 300.) + sd + 5.)) * (.90 + .20 * nsGn(p / vec2(170., 950.) + 9.)), low);
  return mix(den, .58 + .10 * nsGn(p / 170.), calm);
}
`,ve=`
// a strip of water |s| < w0 with a crisp shore (a: a pixel, in s's units); under a pixel it keeps a pixel's width and thins
float nsCut(float s, float w0, float a){ float w = max(w0, a); return (1. - smoothstep(w - .6 * a, w + .6 * a, s)) * min(w0 / w, 1.); }
// WIDE WATER cut by smooth fields (order 5): two long shear leads that wind across the whole view (bent at 11 km, so
// none runs straight; wk: their width, unequal along them) and a polynya. j: a fine noise that makes every shore
// irregular. x: the water, crisp to the pixel; y: its middle, clear of the shore; z: the polynya's own field
vec3 nsWide(vec2 q, float j, float wk, float fk, float fm, float off, out vec2 zn){
  float kn = nsGn(q / 11. + 1.) - .5, pn = nsGn(q / 36. + 17.) + .22 * kn + .010 * j;
  float s1 = abs(nsGn(q / 70. + 5.) - .5 + .07 * kn + .0035 * j), s2 = abs(nsGn(q / 170. + 9.) - .47 + .04 * kn + .0018 * j);
  float a1 = fk * .017, a2 = fm * .007, ap = fk * .02 + 1e-4, k1 = nsF(fk, 1.4), k2 = nsF(fm, 3.5), kp = nsF(fk, 12.);
  float m = max(max(nsCut(s1, wk, a1) * k1, nsCut(s2, wk, a2) * k2), smoothstep(.72 - ap, .72 + ap, pn) * kp);
  float mid = max(max(nsCut(s1, wk * .5, a1) * k1, nsCut(s2, wk * .5, a2) * k2), smoothstep(.735 - ap, .735 + ap, pn) * kp);
  // (order 13) zn.x: the shore's belt, about a km of broken pack along a shear lead. (order 14) zn.y: over 0 wherever
  // any of this water can lie within off km of q (bounds by the three fields' steepest slopes), so the Earth reads
  // the water a second time only there
  zn = vec2(max(1. - smoothstep(wk + .004, wk + .013, s1), 1. - smoothstep(wk + .002, wk + .0055, s2)),
    max(max(wk + .027 * fk + .0454 * off + .006 - s1, wk + .0112 * fk + .021 * off + .003 - s2), pn - .704 + ap + .105 * off));
  return vec3(m, mid, pn);
}
// (order 13) cells as nsVor, and n: the unit direction from the cell's own site toward its nearest neighbour's, across
// the joint between them (so the Earth knows which shore of a lead, which side of a ridge, faces the moon)
vec3 nsVorE(vec2 p, out vec2 n){ vec2 i = floor(p), f = fract(p), gw = vec2(0.), r1 = vec2(0.), r2 = vec2(0.); float d1 = 8., d2 = 8.;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y)); vec2 r = g + nsH2(i + g) - f; float d = dot(r, r);
    if (d < d1) { d2 = d1; r2 = r1; d1 = d; r1 = r; gw = g; } else if (d < d2) { d2 = d; r2 = r; } }
  n = normalize(r2 - r1 + 1e-5);
  return vec3(sqrt(d1), sqrt(d2) - sqrt(d1), nsH1(i + gw + 7.7)); }
// (order 13) A GREAT LEAD'S WIDTH, in the great lattice's cell units (z: the great floe's own number, og: the country's
// openness there, a smooth field by place, t: the world's clock). Where the country is pressed shut the joint has no
// water (it may carry a ridge); where it is open the lead is 0.5 to 1.6 km wide. EVERY great lead breathes by a
// tenth by the clock, and the leads of under half of the great floes OPEN AND CLOSE by more than half their width,
// in 12.6 s of the world's clock.
float nsLw(float z, float og, float t){
  return .080 * smoothstep(.45, .59, og + .16 * (z - .5)) * (.3 + .7 * fract(z * 9.1)) * (1. + (.10 + .45 * step(.55, fract(z * 5.3))) * sin(t * .5 + z * 40.)); }
// (order 13) CLOUD STREETS over the pack, by place: rows of small low cloud 26 km apart that run east-north-east,
// across the moon's bearing, and wander with the country (w: a smooth field by place, handed in); each row stands in
// runs with clear gaps between (hw: the row's half width there, km, handed in); in a run small crisp clouds about a
// km across lie along the row's line, a row one to three clouds wide. The clouds slide along their rows at 0.6 km a
// second of the world's clock. x: km on the Earth, fk: the footprint. Under three pixels a cloud passes into its
// row's mean (a faint pale line), and that into nothing before a row is a few pixels wide.
float nsStreet(vec2 x, float w, float t, float fk){
  float a = dot(x, vec2(.83, -.56)) - t * .6, c = dot(x, vec2(.56, .83)), cw = c / 26. + w, row = floor(cw), r = abs(fract(cw) - .5) * 26.;
  float hw = 1.9 * smoothstep(.42, .56, nsGn(vec2(a / 30. + row * 3.7, row * 7.3) + 5.)) + 1e-3;
  float e = fk * .25 + .012, k = nsGn(vec2(a / 1.7 + row * 1.3, c / 1.3) + 71.) - .53 - .34 * (r / hw) * (r / hw);
  return mix(.25 * (1. - smoothstep(.4 * hw, hw, r)), smoothstep(-e, e, k), nsF(fk, 1.2)) * nsF(fk, 9.) * step(.05, hw);
}
// THE RANGE (order 7): separate massifs standing out of an ice field, each a long ridge lying ACROSS the coast (one in
// each cell 7 km by 17, bent by w), of very unequal size (some fill their cell and join their neighbours into a range,
// some are small nunataks; mass 0..1 sinks them away into ice cap). The height 0..1, falling evenly from the crest
// line to the foot.
float nsRange(vec2 q, vec2 w, float mass){
  vec3 v = nsVor((vec2(q.x * .6 + q.y * .8, q.x * .8 - q.y * .6) + w) / vec2(7., 17.) + 41.);
  return clamp(1. - v.x / ((.17 + .66 * v.z * v.z) * mass + .02), 0., 1.);
}
// THE EARTH. p: km east and km south on the ground, fk: a pixel's footprint there (km), dist: km along the sight line,
// d: the sight line, up: the ground's own up, cn: cosine of the bearing from north
vec3 nsEarth(vec2 p, float fk, float dist, vec3 d, vec3 up, float cn){
  float t = uNsTime; vec2 q = p + uNsBelow.w * 37.;
  // the far field's forms are filtered by the mean of the footprint's two axes, so they keep their shape toward the limb
  float fm = fk * sqrt(max(-dot(up, d), .03));
  float f1 = nsF(fm, 20.), f2 = nsF(fk, 4.), f3 = nsF(fk, 2.2), f4 = nsF(fk, .7), f5 = nsF(fk, .8);
  vec2 md = uNsMoonDir.xz / max(length(uNsMoonDir.xz), 1e-3);                            // toward the moon, along the ground
  // the country differs across the view: ground to brash (belt), or pressed tight (rz: there the leads are hairlines)
  float bn = nsGn(q / 19. + 21.);
  float rzn = nsGn(q / 23. + 9.), belt = smoothstep(.52, .64, bn), rz = smoothstep(.40, .62, rzn);
  // (ORDER 13) THREE SIZES OF FLOE, each with its own kind of lead.
  // GREAT FLOES about 20 km across (v1, bent by a smooth noise). Their joints are OPEN only where the country is open
  // (og, a smooth field 43 km broad): there a WIDE BLACK LEAD 0.5 to 1.6 km broad that winds with the joint, narrows
  // and ends where the country closes (never a net of equal meshes), a lit rim on its shore that faces the moon and a
  // shaded one on the other; where the country is shut a joint may carry a ridge.
  // Within the great floes, FLOES about 4 km across (v2) parted by NARROW, FLAT leads 0.1 to 0.4 km broad, more than
  // half of them grey refrozen: only in the loose parts of the pack (om: where the country is not pressed, and by the
  // great floe's own number); elsewhere the great floe's face is QUIET. The SMALLEST, about 0.8 km (v3), only where
  // the pack is broken: a belt about a km broad along the shore of a great lead or a shear lead; grey brash and
  // water lie between them.
  vec2 g13 = vec2(nsGn(q / 13.), nsGn(q / 13. + 7.3)), wp1 = (g13 - .5) * 8. * f2, nA, nB;
  vec3 v1 = nsVorE((q + wp1) / 20., nA);
  vec2 wp2 = (vec2(nsGn(q / 5.3 + 3.), nsGn(q / 5.3 + 11.)) - .5) * 1.8 * f3;
  vec3 v2 = nsVorE((q + wp2) / 4. + 13., nB);
  float a1 = fm / 20. + .003, a2 = fk / 4. + .006;                 // every edge is soft at the pixel
  float og = nsGn(q / 43. + 31.), w1 = nsLw(v1.z, og, t);                                // the great leads' width breathes
  float om = 1. - smoothstep(.37, .50, rzn + .30 * (fract(v1.z * 3.3) - .5));
  float w2 = .10 * om * (.45 + .55 * fract(v2.z * 7.7)) * (.8 + .2 * sin(t * .31 + v2.z * 40.));
  float l1 = nsCut(v1.y, w1, a1) * f1, l2 = nsCut(v2.y, w2, a2) * f2;
  // WATER IN ICE (order 5): the shear leads and the polynya are cut crisp, their shores irregular. Every shore of this
  // wide water is read a second time a step AWAY from the moon (e km, never under a pixel): water here with ice behind
  // it is the shore that faces the moon, a thin bright rim of rafted ice; ice here with water behind it is the shore
  // that faces away, in its own shadow. Brash lies along both shores; the middle of the water is open and black.
  float jn = nsGn(q / 1.3 + 2.), jf = nsGn(q / .45 + 6.), jj = jn - .5 + .6 * (jf - .5) * f4, wk = (.005 + .011 * bn) * (1. + .3 * sin(t * .45 + rzn * 12.)), off = max(.13, fk * 1.1); vec2 zn, znl;   // (order 13: the shear leads breathe too, stretch by stretch)
  vec2 ql = q - md * off;
  vec3 W0 = nsWide(q, jj, wk, fk, fm, off, zn), Wl = vec3(0.);
  if (fk < 1.25 && zn.y > 0.) Wl = nsWide(ql, jj, wk, fk, fm, off, znl);   // (order 14: read a second time only where a rim can be; a rim is gone by a footprint of 1.25 km)
  float pn = W0.z, pol = smoothstep(.71, .73, pn) * nsF(fk, 12.), polcore = smoothstep(.745, .80, pn);
  float wide = max(l1, W0.x);                                                            // wide water: it carries new ice and brash
  // (order 8) THE RIMS OF A LEAD STAND ON ITS ICE, NEVER ON ITS WATER. (order 13) A great lead's rims are a strip of
  // its ice 120 m broad: lit where the water lies toward the moon (s1: the joint's own bearing against the moon's),
  // shaded where it lies away. A narrow lead has no rim.
  float s1 = dot(nA, md), s2 = dot(nB, md), has = smoothstep(.004, .012, w1);
  float band = (nsCut(v1.y, w1 + .012, a1) * f1 - l1) * has;
  float shore = max(wide, l2), fsh = nsF(fk, 2.5), rimW = clamp(W0.x - Wl.x, 0., 1.) * fsh;
  float rimL = max(rimW, band * smoothstep(.1, .5, s1) * (1. - shore) * fsh), rimS = max(band * smoothstep(.1, .5, -s1), Wl.x) * (1. - shore) * fsh;
  float mid = max(nsCut(v1.y, w1 * .5, a1) * f1, W0.y);                                  // the middle of wide water
  // THE SMALLEST FLOES: the belt along a great lead's shore and along a shear lead
  float brk = clamp(max((1. - smoothstep(w1 + .05, w1 + .12, v1.y)) * has * f1, zn.x), 0., 1.) * (1. - wide);
  vec3 v3 = vec3(0.); if (brk > 0.) v3 = nsVor(q / .8 + 5.); float a3 = fk * .75 + .01;   // (order 14: read only in their belts)
  float sm = mix(.66, smoothstep(.15 - a3, .15 + a3, v3.y), f5), smz = mix(.5, v3.z, f5);
  float gap = brk * (1. - sm);                                                           // brash and water between the smallest floes
  float lead = max(max(wide, l2), gap) * (1. - rimW);
  float newi = smoothstep(.57, .62 + fk * .2, nsGn(q / 2.3 + 4.) + .03 * jj);                                // (order 5: new ice lies in plates with an edge, not in soft blots)
  float refr = max(max(wide * newi * f3 * .55, pol * smoothstep(.52, .57 + fk * .1, nsGn(q / 6.1 + 4.) + .03 * jj) * (1. - .5 * polcore)), l2 * (1. - wide) * step(.45, fract(v2.z * 5.1)));   // grey new ice; (order 13) more than half of the narrow leads are grey, refrozen; the great leads are open and black
  // brash: graded grey rubble adrift in wide water (a smooth field, never single cells), and thick along every shore
  float rub = smoothstep(.40, .60, bn + .15 * (belt - .5)) * (.62 + .38 * jn) * f3;
  float brash = max((wide - mid) * mix(.45, smoothstep(.40, .58, jf), f4) * fsh, gap * .6);
  // (ORDER 14) A GREAT FLOE'S FACE HAS A LIFE OF ITS OWN AT A MIDDLE SIZE, all of it by place on the Earth.
  // PIECES: a great floe is many OLD FLOES FROZEN TOGETHER. In each 4 km cell lies one old floe, pale with snow, each
  // in its own tone (tf), with a rounded, irregular outline of its own: by the cell's number and by the country (r0)
  // none at all in one cell of six, a floe 1 to 4 km across in most, and in a quarter one that fills its cell and
  // has grown into its neighbours (few and scattered where bn is low, crowded where it is high). Between the old
  // floes lies YOUNGER ICE, greyer and smooth. Where an old floe reaches its cell's joint, a SEAM (a thin dark healed
  // crack) lies along it. So the pieces are of unlike size and outline, and never a net of equal meshes.
  float tf = fract(v2.z * 3.3), jr = .25 * (jn - .5) * f3, eo = a2 * 1.2, fp = nsF(fk, 5.);
  float r0 = -.05 + .95 * fract(v2.z * 5.7) + .30 * (bn - .35);
  float fo = max(1. - smoothstep(r0 - eo, r0 + eo, v2.x + jr), om);   // (in loose pack a cell is one whole floe)
  float dk = max(uNsDark.z, 1. - uNsMoon.x);
  // HEALED LEADS: bands 0.3 to 1 km broad of younger, greyer, smooth ice that cross a great floe from edge to edge,
  // every great floe its own (level lines of the two smooth 13 km fields, at a level by the floe's own number, so
  // they wind and stop at the floe's edge). The second leaves the first on one side only (a fork); the first thins
  // to a point and ends where the country is pressed. Under a pixel a band keeps a pixel's breadth and thins.
  float lv = .38 + .24 * fract(v1.z * 11.3), ah = fk * .048 + .002, hwd = .008 + .018 * fract(v1.z * 17.9);
  float hsa = abs(g13.x - lv + .008 * jj), hsb = abs(g13.y - 1. + lv + .008 * jj), fh = nsF(fk, 6.);
  float heal = max(nsCut(hsa, hwd * smoothstep(.28, .40, rzn + .2 * (fract(v1.z * 7.1) - .5)), ah), nsCut(hsb, hwd * .7, ah) * smoothstep(lv - .01, lv + .02, g13.x)) * fh * (1. - brk);
  // RIDGE LINES, FEW AND OF EVERY BEARING: a fine pale line on the side of a joint that faces the moon and a thin
  // shadow on the other. LONG ones on the great joints where the country is shut. Within a great floe a ridge stands
  // only in the few places where the pieces were pressed together (the smooth 13 km field stands high there: about
  // one joint in seven): there every joint carries one, so the ridges stand in crooked chains 5 to 10 km long that
  // bear as the pieces' joints bear, each way. Never on water or on a healed lead.
  float shut = (1. - smoothstep(.45, .59, og + .16 * (v1.z - .5))) * f1 * fsh;
  float rs0 = smoothstep(.80, .90, abs(dot(nB, normalize(md + .45 * vec2(-md.y, md.x))))) * f2 * fsh, rsel = smoothstep(.66, .70, g13.y) * (1. - om) * f2 * fsh;   // (rs0: the joints that lie across the pressure; read by the coast's ice cap alone)
  float rd2 = nsCut(v2.y, .05, a2) * (1. - smoothstep(-.3, .2, s2)), rh2 = nsCut(v2.y, .07, a2) * smoothstep(0., .5, s2);
  float rdg = max(nsCut(v1.y, .014, a1) * shut * (1. - smoothstep(-.3, .2, s1)), rd2 * rsel);
  float rsh = max(nsCut(v1.y, .020, a1) * shut * smoothstep(0., .5, s1), rh2 * rsel);
  rdg *= (1. - shore) * (1. - brk) * (1. - heal); rsh *= (1. - shore) * (1. - brk) * (1. - heal);
  float seam = nsCut(v2.y, .022, a2) * fo * f2 * (1. - rsel) * (1. - heal);
  // RELIEF: the two shores of wide water and the ridge lines (a floe's face is quiet)
  float sunk = clamp(.5 * rimL - .6 * rimS + .55 * rdg - .5 * rsh, -1., 1.);
  // thin young ice (turquoise): whole floes of it, a fifth of the 4 km floes where the pack is loose (order 7: by the
  // floe, so it has the floe's own crisp edge and is no soft patch)
  float thinI = step(.80, fract(v2.z * 9.7)) * om * (1. - rz) * f2;
  // (ORDER 14) THE TONES OF A FACE: the great floe's own (gt); an old floe paler by its own number, the younger ice
  // between darker (wider apart on the dark looks, dk, so that the sizes read by the sky's light alone); THE SNOW'S
  // DRIFT on the older half of the old floes (dr: faint bands 1.6 km broad that lie along the wind, the streets'
  // own bearing, and wander a little with the country); the seam; the healed lead (greyer than the younger ice, and smooth). Each
  // passes into its own mean under its footprint.
  float dr = .5 + .5 * sin(dot(q, vec2(.56, .83)) * 2. + 6. * g13.x + 4. * g13.y);   // crests 3 km apart across the wind, bent by the two smooth 13 km fields
  float gt = (.60 + .20 * (fract(v1.z * 7.3) - .5) * f1) * (1. - .02 * (1. - fh));
  float alb = gt + (mix(-.12, .04 + .10 * tf, fo) * (1. + .4 * dk) + .10 * (dr - .5) * fo * smoothstep(.45, .65, tf) * nsF(fk, 1.6)) * (1. - thinI) * fp
    - .12 * thinI + .16 * (smz - .5) * brk;
  alb = mix(alb * (1. - .4 * seam), gt * (.70 - .06 * dk), heal * (1. - thinI));
  // THE ICE EDGE (below 'edge'): a black sea to the east-south-east; the pack breaks into floes toward it and its brash
  // is drawn out in streamers and wound into spiral eddies (the domain turned round one centre in each 30 km cell)
  float sea = 0.;
  if (uNsBelow.x > .5) {
    vec2 ce = floor(q / 30.), cc = (ce + .5 + (nsH2(ce + 3.) - .5) * .24) * 30., r = q - cc;
    float s = max(1. - length(r) / 11., 0.), ang = (nsH1(ce + 9.) > .5 ? 1. : -1.) * 5.5 * s * s, ca = cos(ang), sa = sin(ang);
    vec2 qe = cc + vec2(ca * r.x - sa * r.y, sa * r.x + ca * r.y) + (vec2(nsGn(q / 37. + 3.), nsGn(q / 37. + 8.)) - .5) * 34.;
    vec2 qs = vec2(dot(qe, vec2(.6, -.8)), dot(qe, vec2(.8, .6)));
    float sv = (p.x * .8 + p.y * .6) - 22. + (nsFbm(q / 70.) - .47) * 64. + (nsGn(qe / 12.) - .5) * 20.;   // km out to sea
    float conc = 1. - smoothstep(-8., 36., sv), loose = smoothstep(-16., 0., sv);          // how much of the sea still carries ice
    float stream = mix(.5, nsGn(qs / vec2(17., 1.5) + 4.), nsF(fk, 1.5)) * .62 + nsGn(qs / vec2(5., .9) + 8.) * .38 * f4;
    float icy = smoothstep(.98 - 1.0 * conc, 1.20 - 1.0 * conc, stream) * mix(1., .25 + .75 * smoothstep(.36, .60, jn), .85 * f3);   // streamers of brash: grains, not drawn lines
    float floe = smoothstep(.05, .09 + a2, v2.y) * step(fract(v2.z * 13.7), conc * 1.25) * f2;   // floes broken from the pack
    sea = loose * (1. - max(icy, floe)); alb = mix(alb, .46, loose * (1. - floe) * .7); }
  float water = clamp(max(lead * (1. - refr), sea), 0., 1.);
  float mu = max(dot(up, uNsMoonDir), 0.);
  // (order 7) NIGHT ON THE GROUND. The ice is lit only by what stands over it: the moon (less than half of it on the
  // darkest look, where the sky's own light leads), the night's indigo, the sheet's colour from overhead, the
  // curtains' green as a faint tint (the darkest look) and the twilight's cold light. (ORDER 13: NO WARM COLOUR ON
  // THE ICE: the arc's rose and ember do not light it, near or far.)
  vec3 key = vec3(.78, .87, 1.) * (.42 * uNsMoon.x * (.22 + mu)) * (1. - .55 * uNsDark.z);
  // (ORDER 14) THE TWILIGHT'S LIGHT ON THE ICE IS COLD: the arc lights the ice by the world's own arc gain and BY
  // PLACE (growing toward the north: nk is 0 some 40 km south of the point under the balloon, 1 by 140 km north of
  // it), as the sum of the twilight sky, a blue-white: never rose. On the dark looks there is more of it, near and
  // far alike (uNsMoon.w).
  float nk = smoothstep(-40., 140., -p.y);
  vec3 fill = vec3(.075, .09, .30) * .20 + uNsColA * .07 * uNsSheet.x + vec3(.08, .95, .40) * .030 * uNsDark.z + vec3(.82, .90, 1.) * .075 * uNsTwi.x * (.15 + .25 * uNsMoon.w + .85 * nk);   // (more of it near at hand on the dark looks: the lift of dark looks)
  vec3 tintI = mix(mix(vec3(.72, .78, 1.), vec3(.28, .78, .86), thinI * .42), vec3(.80, .84, .94), heal * .7);   // pale indigo and ice-blue; turquoise where the ice is thin; (order 14) a healed lead is greyer
  // relief takes the key on its moonlit side and is left with the indigo fill on its shadow side
  vec3 ice = alb * tintI * (key * clamp(1. + 1.5 * sunk, .12, 2.4) + fill * (1. + .5 * sunk)) * 1.25;
  ice = mix(ice, ice * vec3(.26, .34, .50), refr * (1. - rimL));                    // new ice: dark, smooth nilas
  float rubw = wide, nolnd = 1.;                                                         // where rubble may lie: all wide water; nolnd: 0 on land
  // A GLACIATED COAST (below 'coast') to the east-north-east: massifs with bare rock crests and snow, a moonlit and a
  // shadowed face and long shadows; glaciers in the valleys running down into fjords; a tongue of fast ice, a flaw lead
  if (uNsBelow.y > .5) {
    float cv = (p.x * .8 - p.y * .6) - 24. + (nsFbm(q / 55. + 11.) - .47) * 44.;           // km inland
    // (order 7) A MOUNTAIN RANGE FROM A GREAT HEIGHT. The massifs are read three times: here, a step toward the moon
    // (the slope: a lit flank and a shaded flank that meet in a crisp crest line) and a longer step toward the moon
    // (a massif there throws its shadow here, on its own flank or out on the ice field). Ribs gully the flanks.
    vec2 wr2 = (g13 - .5) * 12. * nsF(fm, 13.);
    float mass = .30 + .70 * rz;
    float R0 = nsRange(q, wr2, mass), R1 = nsRange(q + md * .5, wr2, mass), R2 = nsRange(q + md * 2.6, wr2, mass);
    float fl = nsF(fm, 7.), fr2 = nsF(fk, 2.2);
    float rib0 = 1. - abs(2. * nsGn(q / 2.2 + 31.) - 1.), rib1 = 1. - abs(2. * nsGn((q + md * .5) / 2.2 + 31.) - 1.);
    float m0 = R0, up0 = smoothstep(0., .12, R0);
    // (order 6) NO STRAIGHT SHORE: the massifs reach out as headlands, the ice between them draws the shore in as bays
    // (cs: km inland by the land's own relief), and the land rises out of the fast ice over a foot of smooth snow
    float cs = cv + (m0 - .35) * 9. + 5. * (bn - .5), foot = smoothstep(-2., 5., cs);
    float land = smoothstep(-2.5, 3.5, cs), rise = smoothstep(-1., 12., cs);
    float slope = ((R0 - R1) * fl + (rib0 - rib1) * .28 * up0 * fr2) * foot;
    float shdw = smoothstep(.06, .22, R2 - R0) * fl * foot;
    float flank = smoothstep(-.035, .035, slope), litk = mix(.22, 1.5, flank) * (1. - .7 * shdw * flank);
    // bare rock on the shaded flanks and along the crests; snow on the lit flanks and on the ice field
    float rock = max(smoothstep(.10, .40, m0 + .12 * (jn - .5) * f3) * (1. - flank) * .9, smoothstep(.80, .95, m0) * .6) * rise * fl;
    // GLACIERS: the ice between the massifs, smooth, with a crisp margin at their feet (order 8: no flow lines on it:
    // from this height they read as fine stripes, like banding). A tongue ENDS in a crisp ice
    // front 4 to 8 km inland of the shore; below the front the drowned valley is a fjord of dark water, brash thick
    // under the front. A massif's shadow lies on the ice beside it.
    float av = fm * .05 + .012, valley = (1. - smoothstep(.03 - av, .03 + av, m0 + .015 * jj * f3)) * fl;
    float tcs = 6. + 4. * (bn - .5) + 1.2 * jj, aw = max(.2, fk * .7), tk = 1. - smoothstep(-aw, aw, cs - tcs);
    float fj = valley * tk * land, front = valley * land * (1. - tk) * (1. - smoothstep(.3, .3 + 2. * aw, cs - tcs));
    brash = max(brash, fj * smoothstep(-3.5, 0., cs - tcs) * mix(.5, smoothstep(.36, .56, jf), f4));
    vec3 snow = (key * litk + fill * (.75 + .45 * flank)) * vec3(.78, .86, 1.) * (.80 + .25 * m0);
    vec3 rockc = vec3(.006, .008, .018) + key * .07 * litk + fill * .07;
    vec3 glac = (key * .80 * (1. - .7 * shdw) + fill * .9) * vec3(.66, .82, 1.) * (.80 + .9 * front);
    vec3 lc = mix(mix(snow, rockc, rock), glac, valley * .95);
    lc *= 1. + (.6 * rd2 - .5 * rh2) * rs0 * (1. - up0);                                  // (order 13: the ice cap between the massifs is no smooth sheet: short ridge lines cross it, on those 4 km joints that lie within 33 degrees of the pressure's bearing)
    float fn = nsGn(q / 9. + 2.), co = 3. * (fn - .5) + 9. * (bn - .5);                     // (the fast ice's outer edge winds too, with its flaw lead)
    float fast = smoothstep(-13., -8., cv + co) * (1. - land);                             // fast ice: smooth, pale, unbroken
    // the flaw lead (order 5): cut crisp like every wide water, its shore irregular, its width unequal; read a second time
    // a step away from the moon for its lit rim and its shaded shore; brash along both
    float fwv = abs(cv + 13.5 + co + .3 * jj), fww = .8 + 1.7 * bn, kf = nsF(fk, 5.) * (1. - land);
    float fwl = abs(cv + 13.5 + dot(ql - q, vec2(.8, -.6)) + 3. * (nsGn(ql / 9. + 2.) - .5) + 9. * (bn - .5) + .3 * jj);
    float flaw = nsCut(fwv, fww, fk) * kf, flawl = nsCut(fwl, fww, fk) * kf;
    float rl = clamp(flaw - flawl, 0., 1.) * fsh, rs = clamp(flawl - flaw, 0., 1.) * fsh;
    brash = max(brash, (flaw - nsCut(fwv, fww * .5, fk) * kf) * mix(.45, smoothstep(.40, .58, jf), f4) * fsh);
    flaw *= 1. - rl;
    ice = mix(ice, (key * (1. + .5 * sunk) + fill) * tintI * 1.2 * (.84 + .5 * (alb - gt)), fast);   // (order 14: the fast ice is no blank sheet: the old floes frozen into it, their seams and the healed leads show at half their tone)
    ice = mix(ice, (key * 2.2 + fill) * tintI, rl) * (1. - .6 * rs);
    ice = mix(ice, lc, land * (1. - fj));
    water = max(max(water * (1. - .35 * fast), flaw) * (1. - land), fj);                    // (order 7: the fast ice keeps its leads, as thin dark cracks)
    rubw = max(rubw * (1. - fast), max(flaw, fj)); nolnd = 1. - land * smoothstep(.05, .2, m0); }
  if (uNsBelow.x > .5) rubw = max(rubw, sea * .5);
  // open water: black, a faint blue mirror of the sheet. THE MOON'S GLITTER lies ONLY ON WATER, by the mirror angle.
  // (order 5) NEVER A DISC: glints a pixel or two across at every range (two scales chosen by the footprint, each
  // fading into the next: a term of filtering by eye), black water between them; the facets drift 0.6 km a second
  // of the world's clock. (orders 13 and 14) ITS STRENGTH (env) has three parts: a broad skirt (the fourth power of
  // the cosine between the mirrored sight line and the moon, times 0.2: water ruffled by wind, so a lead anywhere on
  // the moon's side carries a few faint glints), a core (the 26th power, times 0.5) and A PATH drawn out along the
  // moon's bearing (times 0.9; gc: the mirrored sight line's part across that bearing, ga: its part along it; 1.5
  // degrees across and 8 along). A glint's light is 0.2 + 2.2 env, never over 1.4, and more of the facets are lit
  // where env is high (the bar falls from .86 to .78 of the facets' field): small points in the heart too, never
  // flakes. It lies only where the pixel is water (whole from 0.95 of water, nothing under 0.6): never on a floe's
  // face, never on ice that stands in water.
  vec3 rm = reflect(d, up); float rd = max(dot(rm, uNsMoonDir), 0.), rq = rd * rd, gc = dot(rm, vec3(-md.y, 0., md.x)), ga = max(2. - 2. * rd - gc * gc, 0.);
  float env = rq * rq * .2 + pow(rd, 26.) * .5 + exp(-gc * gc / .0007 - ga / .02) * .9;
  // (order 7) THE SKY'S COLOURS ON BLACK WATER, broken as the moon's glitter is (other facets of the same two scales):
  // the curtains' green where the mirrored sight line looks north (the darkest look), the sheet's own blue where it
  // looks steeply up; the arc's colours on the open sea alone (below). The ice takes a faint sheen of its own
  // (skyC).
  float rh = max(rm.y, 0.), cnR = -rm.z / max(length(rm.xz), 1e-4);
  float eG = uNsDark.z * smoothstep(-.1, .9, cnR) * (1. - smoothstep(.45, .97, rh)), eA = 1. - smoothstep(.1, .92, rh);
  vec3 arcR = nsArc(2.2, cnR) * 1.5 * eA, skyI = vec3(.08, .95, .40) * .55 * eG + uNsColA * .16 * uNsSheet.x * smoothstep(.45, .95, rh);
  // (order 14, addition 1) THE ICE'S OWN SHEEN: the curtains' green as a tint only (a third of the water's), the
  // sheet's blue, and the arc's brightness where the mirror grazes toward it, in the same cold blue-white
  vec3 skyC = vec3(.08, .95, .40) * .20 * eG + uNsColA * .16 * uNsSheet.x * smoothstep(.45, .95, rh) + dot(arcR, vec3(.5)) * vec3(.82, .90, 1.);
  // THE FAR FIELD: broad tones of the pack, laid on after the water (ft; three fields 110, 43 and 23 km broad, the
  // two finer the country's own og and rzn, each faded to its mean under its footprint). BY PLACE: faint (0.3 of
  // it) within 32 km of the point under the balloon, whole by 196 km: no soft blots on the ice below. (order 15)
  // It is worked out here, before the water, because the sparks' bound is set against it.
  float bt = .57 * mix(.5, nsGn(q / 110. + 7.), nsF(fm, 110.)) + .285 * mix(.5, og, nsF(fm, 43.)) + .1425 * mix(.5, rzn, nsF(fm, 23.));
  float ft = 1. + (bt - .5) * 1.44 * mix(.3, 1., smoothstep(32., 196., length(p)));
  // (order 14) the water's own light is worked out only where there is water
  vec3 wat = vec3(0.);
  if (water > 0.) {
  float lg = log2(max(fk, .02) * 2.), l0 = floor(lg), fl = lg - l0, s0 = exp2(-l0); vec2 qg = q + vec2(t * .5, -t * .33);
  float thr = mix(.86, .78, clamp(env * 1.4, 0., 1.));
  float n0 = nsGn(qg * s0 + l0 * 7.3), n1 = nsGn(qg * s0 * .5 + (l0 + 1.) * 7.3);
  float glt = mix(smoothstep(thr, thr + .05, n0), smoothstep(thr, thr + .05, n1), fl);
  wat = vec3(.0012, .002, .007) + vec3(.0025, .008, .032) * uNsSheet.x * (.6 + .5 * uNsMoon.w)
    + vec3(.9, .95, 1.) * uNsMoon.x * min(glt * (.2 + 2.2 * env) + env * .025, 1.4) * smoothstep(.6, .95, water);
  float thS = mix(.76, .54, clamp(dot(skyI, vec3(.9)), 0., 1.));
  float gs = mix(smoothstep(thS, thS + .05, 1. - n0), smoothstep(thS, thS + .05, 1. - n1), fl);
  wat += skyI * (gs * 1.25 + .10);                                                         // (order 8: the sky's colour shows on the water between its glints too)
  // (order 13) the arc is mirrored by the OPEN SEA only, never by the ice or by a lead in it. (orders 14 and 15) It
  // lies there as its own colour on the water, faint, with a few small sparks: fewer than the moon's glints (a
  // higher bar on the same facets, .90 falling to .84) and dimmer. It does not read the moon. THE GATE (order 15):
  // the sparks lie where the pixel is open sea AND water, whole from 0.95 of both and nothing under 0.7 (fast ice
  // leaves 0.65 of the sea's field as water): on a floe's face, on land and on fast ice they are nothing. THE BOUND
  // (order 15): the cap is 0.25 divided by the far tone (ft) that is laid on after it, so the greatest light the
  // sparks add to what this law returns is 0.25.
  float thA = mix(.90, .84, clamp(dot(arcR, vec3(.9)), 0., 1.));
  wat += min(arcR * (.08 + .20 * mix(smoothstep(thA, thA + .05, n0), smoothstep(thA, thA + .05, n1), fl)), vec3(.25 / ft)) * smoothstep(.7, .95, min(sea, water));
  wat = mix(wat, (key + fill) * vec3(.42, .50, .62) * (.55 + .5 * rub), rub * rubw * .3);    // brash: graded grey rubble on it
  wat = mix(wat, (key + fill) * vec3(.52, .60, .72), clamp(brash, 0., 1.) * .85);            // and along every shore
  }
  vec3 col = mix(ice + skyC * (.035 + .30 * eA * eA) * alb, wat, water);
  // (ORDER 13) THE STREETS OF CLOUD AND THEIR SHADOWS. The clouds stand 1.6 km over the ice: a cloud is seen where the
  // sight line passes that height (the law's eye stands 38 km over the origin: a term of direction), and its SHADOW
  // lies on the ice 2.6 km from under it, on the side away from the moon (the moon is 32 degrees up), so that a gap
  // of ice shows between a row and its shadow. The shadow takes most of the moon's light and a third of the sky's
  // (with no moon it is the sky's alone, and faint). No street over land. Crisp small clouds, lit by the moon
  // and the sky like the ice, a little paler than snow.
  float sw = (og - .5) * .9, cl = nsStreet(q - p * (1.6 / 38.), sw, t, fk), shd = nsStreet(q + md * (1.6 * length(uNsMoonDir.xz) / max(uNsMoonDir.y, .2)), sw, t, fk);
  col *= ft;                                                                       // the far field's broad tones (ft, above)
  col *= 1. - shd * nolnd * mix(.30, .64, uNsMoon.x);
  col = mix(col, (key * 1.15 + fill * 1.4) * vec3(.80, .88, 1.), cl * nolnd * .92);   // the streets' clouds
  // (order 7: no cloud deck lies on the far ground: one law of ice holds to the limb, its forms growing fine, then smooth)
  col = min(col, vec3(1.8));                                                       // (nothing on the Earth over 1.8, whatever tone lies on a glint)
  // the air's own blue haze deepens with distance; the far ice keeps its form to the limb
  float air = 1. - exp(-dist / 650.);
  vec3 limb = vec3(.010, .034, .15) * (1. + .5 * uNsMoon.w) + dot(nsArc(.9, cn), vec3(.3)) * vec3(.085, .10, .13);   // (order 13: the far air is lifted toward the north: no rose on the ice; order 14: in a pale blue-white, not a deep blue)
  return mix(col, limb, air * .9);
}
`,ge=`
// THE SKY LAW with the footprint given: fw is a pixel's size in radians along d (a film that bends d hands in its own sight
// line's); soft (degrees) widens and dims the thin bright airglow line, for a surface whose bending would draw it as a zigzag
vec3 nsSkyS(vec3 d, float fw, float soft){
  float sy = clamp(d.y, -1., 1.), hl = max(length(d.xz), 1e-4), t = uNsTime;
  float az = t * .0012, cn = (-d.z * cos(az) + d.x * sin(az)) / hl;  // the arc drifts east along the limb
  float a = (asin(sy) + .10895) * 57.2958;                           // degrees above the limb
  float b = 6409. * sy;
  float under = 1. - smoothstep(-.8, .8, (sy - NS_LIMB) / fw);
  vec3 earth = vec3(0.), sky = vec3(0.);
  if (under > .002) {
    float te = -b - sqrt(max(b * b - 485640., 0.)); vec3 P = vec3(te * d.x, 6409. + te * sy, te * d.z);
    vec3 up = P / max(length(P), 1.); float ci = max(-dot(up, d), .03);
    earth = nsEarth(P.xz, te * fw / ci, te, d, up, cn); }
  if (under < .998) {
    vec3 arc = nsArc(a, cn);
    // the sheet: the ray met with the shell 45 km overhead
    float ts = -b + sqrt(b * b + 578835.); vec3 P = vec3(ts * d.x, 6409. + ts * sy, ts * d.z);
    float ci = clamp(dot(P, d) / 6454., .05, 1.), slant = min(1. / ci, 4.);  // seen aslant it is up to four times brighter
    float pd = dot(d, NS_PORTAL), calm = smoothstep(.86, .975, pd);         // a law of direction: calm sky behind the way out (whole within 13 degrees, gone by 31)
    float lk = smoothstep(.6, 1.15, uNsTwi.y), phi = atan(d.x + 1e-5, -d.z);              // (lk: 0 on the darkest look, 1 on the lighter)
    float low = (1. - smoothstep(12., mix(32., 27., lk), a)) * mix(.25, 1., lk);   // a law of direction: toward the limb the cover closes (no hole in the bright band)
    float fkS = ts * fw / ci, den = nsSheet(P.xz, fkS, calm, low);
    float zs = uNsSheet.z + .30 * length(P.xz);                             // the Earth's shadow: a long soft falling-off, wider with distance
    float lit = 1. - smoothstep(uNsSheet.y - zs, uNsSheet.y + zs, P.z + P.x * P.x * .0004 + (nsGn(P.xz / 60.) - .5) * 30. * (1. - smoothstep(.2, .55, fkS / 60.)));
    lit = mix(uNsSheet.w, 1., lit);                                         // the dark looks are lifted: the shadowed sheet never falls to black
    float x = .215 * slant * den * uNsSheet.x * lit;
    x *= mix(1., mix(.2, min(.52, .73 / uNsSheet.x), lk), 1. - smoothstep(10., mix(50., 36., lk), a));   // (order 6: on the darkest look the lower sky stays deep)                         // the band over the limb is no white wall: its broad bands keep their tone
    // (order 6) BY DIRECTION: the sheet's lower border in the north is ragged and patchy, between 2 and 20 degrees up
    // by the bearing: tongues of cloud reach down toward the arc and gaps of night reach up, no level band of night
    float rb = 4. + 14. * smoothstep(.24, .76, nsGn(vec2(phi * 4.2 + uNsDark.w, a * .11 + 2.))) + 5. * (nsGn(vec2(phi * 15., a * .3 + 5.3)) - .5);
    x *= mix(1., mix(.03, 1., smoothstep(rb, rb + 3.5 + .45 * rb, a)), smoothstep(-.5, .5, cn)) * (1. - .7 * clamp(dot(arc, vec3(.6)), 0., 1.));   // in the north, below 13 degrees, the sheet is lost in the arc's own glow: the arc keeps its colours
    float sb = .87 * (1. - exp(-1.25 * x / .87));                           // never over 0.87: the rolls keep their blue
    float cw = smoothstep(-.2, .9, cn);
    vec3 sc = mix(uNsColA, uNsColB, max((1. - smoothstep(8., 40., a)) * mix(.12, 1., lk), .75 * mix(mix(.4, 1., smoothstep(25., 55., a)), 1., lk) * smoothstep(.22, .62, sb)));   // silver toward the limb and on the crests, the look's blue in the troughs
    sc = mix(sc, vec3(1., .88, .66), (1. - smoothstep(1.5, 4. + 5. * uNsTwi.y, a)) * (.35 + .65 * cw) * min(.75 * uNsTwi.x, .85));   // palest gold in the last degrees
    // THE MILKY WAY (the dark looks): a band through the sky's top, 14 degrees off the zenith, with star clouds, a bulge
    // 36 degrees from the last line's direction and a dark rift of dust wandering along it
    float mw = 0.; vec3 milky = vec3(0.);
    if (uNsDark.y > .01) {
      float mb = dot(d, vec3(.6, .25, -.76)), lam = atan(dot(d, vec3(.785, 0., .62)), dot(d, vec3(-.155, .969, .196))), dl = lam + .61;
      float bulge = exp(-dl * dl * 3.), wid = .12 + .10 * bulge, e0 = mb / wid;
      float clouds = nsGf(vec2(lam * 2.6, mb * 8.) + 2., 0.);
      float rc = mb - .035 * sin(lam * 4. + 1.) - .07 * (nsGn(vec2(lam * 1.9, 3.)) - .5), rw = .020 + .035 * nsGn(vec2(lam * 3.7, 7.));
      float rift = exp(-rc * rc / (rw * rw)) * (.55 + .45 * bulge) + .3 * smoothstep(.50, .78, nsGn(vec2(lam * 2.2, mb * 27.) + 5.));
      mw = exp(-e0 * e0) * uNsDark.y;
      milky = mix(vec3(.050, .066, .125), vec3(.105, .095, .105), bulge) * mw * (.35 + 1.5 * clouds * clouds) * (1. + 1.2 * bulge) * clamp(1. - .85 * rift, 0., 1.);
      mw *= clamp(1. - .7 * rift, 0., 1.); }
    float tA, tB;
    float s1 = nsStarLayer(d, 46., fw, .05 * uNsDark.x + .05 * mw, tA), s2 = nsStarLayer(d, 120., fw, .035 * uNsDark.x + .09 * mw, tB);
    vec3 stars = mix(vec3(1., .82, .64), vec3(.72, .84, 1.), tA) * s1 * .95 + mix(vec3(1., .9, .8), vec3(.8, .88, 1.), tB) * s2 * .6;
    float veilk = clamp(1. - sb * 1.3 - dot(arc, vec3(.5)), 0., 1.);
    stars *= veilk; milky *= veilk;
    // THE AURORA (the darkest look), by direction: curtains standing in the north above the sheet, slowly rippling;
    // green at the foot, violet-red at the top; none within 20 degrees of the last line's direction
    vec3 aur = vec3(0.);
    if (uNsDark.z > .01) {
      // (order 6) CURTAINS, crisp: two thin sheets seen from the side. Each has a sharp lower border that winds with the
      // bearing (its folds), fine upright rays of unequal height standing on it (under two pixels they pass into their
      // mean), and ends; between and above them the night is dark and starry.
      float ff = 1. - smoothstep(.25, .6, fw * 75.);
      float r1 = mix(.45, nsGn(vec2(phi * 75. + t * .05, 1.5 + t * .03)), ff), r2 = mix(.45, nsGn(vec2(phi * 52. - t * .04, 7.5 + t * .02)), ff);
      float m1 = nsGn(vec2(phi * 1.9 + uNsDark.w, 3. + t * .008)), m2 = nsGn(vec2(phi * 2.6 - uNsDark.w, 11. - t * .006));
      float e1 = smoothstep(.40, .55, m1), e2 = smoothstep(.44, .59, m2);
      // (order 7) A CURTAIN IS ONE FOLDED RIBBON seen nearly edge on: its lower border wanders with the bearing and
      // folds (g: the fold's phase, bent forward and back by the slow field, so folds bunch, open and double back);
      // where the border runs steeply the ribbon lies along the sight line and is brightest; behind each fold its far
      // side shows again, higher and fainter. No part of a border is level; the two curtains have different laws.
      float g1 = phi * 23. + 13. * m1 + uNsDark.w + t * .02, g2 = phi * 29. - 12. * m2 + 2. + t * .016;
      float f1 = 13. + 12. * (m1 - .5) + 2.3 * sin(g1) + 1.3 * sin(2.3 * g1 + 1.7) + .7 * sin(5.1 * g1 + .5), f2 = 23. + 14. * (m2 - .5) + 2.1 * sin(g2) + 1.4 * sin(1.9 * g2 + .6) + .7 * sin(4.3 * g2 + 2.);
      float k1 = .55 + .9 * pow(abs(cos(g1)), 4.), k2 = .55 + .9 * pow(abs(cos(g2)), 4.);
      float h1 = a - f1, h2 = a - f2, bw = .10 + fw * 57.3;                    // the border: sharp, never under a pixel
      float h1b = h1 - 3.5 - 2.5 * sin(g1 + 2.2), h2b = h2 - 3. - 2.5 * sin(g2 + 4.);
      float d1 = 2.5 + 21. * r1 * r1, d2 = 2.5 + 17. * r2 * r2;
      float c1 = (smoothstep(-bw, bw, h1) * exp(-max(h1, 0.) / d1) * k1 + .4 * smoothstep(-bw, bw, h1b) * exp(-max(h1b, 0.) / (d1 * .7))) * (.25 + .75 * r1) * e1;
      float c2 = (smoothstep(-bw, bw, h2) * exp(-max(h2, 0.) / d2) * k2 + .4 * smoothstep(-bw, bw, h2b) * exp(-max(h2b, 0.) / (d2 * .7))) * (.25 + .75 * r2) * e2;
      vec3 col1 = mix(vec3(.08, .95, .40), vec3(.55, .10, .50), smoothstep(3., 22., h1)), col2 = mix(vec3(.08, .95, .40), vec3(.55, .10, .50), smoothstep(3., 20., h2));
      aur = (col1 * c1 + col2 * c2 * .8) * smoothstep(-.15, .5, cn) * (1. - smoothstep(.88, .94, pd)) * uNsDark.z * .62; }
    // the airglow line: hair-thin, breathing, never under a pixel and a half; a hair above the ember
    float fwd = fw * 57.3, wl = max(.11 + soft, fwd * .9);
    vec3 glow = vec3(.14, .9, .36) * nsG(a, .5, wl) * min(1., .22 / wl) * .09 * (.75 + .25 * sin(t * .5 + phi * 3.));   // (order 6: one hair above the limb, faint)
    vec3 deep = vec3(.0006, .0009, .003) + vec3(.002, .0065, .032) * max(uNsTwi.y - .6, 0.) * (.55 + .45 * cw);   // space black; the higher sun leaves it deep blue
    sky = deep + stars + milky + aur + arc + glow + sc * sb + nsMoonDisc(d, fw); }
  return mix(sky, earth, under);
}
// THE SKY LAW: linear colour of everything at infinity along the unit direction d (balloon space: +Y up, +Z south, +X east)
vec3 nsSkyF(vec3 d, float fw){ return nsSkyS(d, fw, 0.); }
vec3 nsSky(vec3 d){ return nsSkyS(d, clamp(length(fwidth(d)), 1e-5, .05), 0.); }
`,$=we+pe+ve+ge,F=re.map(t=>t[0]),H=re.map(t=>t[1]),X=(()=>{const t=F.length,o=[],a=new Array(t);for(let s=0;s<t-1;s++)o.push((H[s+1]-H[s])/(F[s+1]-F[s]));a[0]=o[0],a[t-1]=o[t-2];for(let s=1;s<t-1;s++)a[s]=o[s-1]*o[s]<=0?0:2*o[s-1]*o[s]/(o[s-1]+o[s]);return a})();function j(t,o){const a=F.length;t=V(t,F[0],F[a-1]);let s=0;for(;s<a-2&&t>F[s+1];)s++;const d=F[s+1]-F[s],i=(t-F[s])/d,n=i*i,l=n*i;return o[0]=(2*l-3*n+1)*H[s]+(l-2*n+i)*d*X[s]+(-2*l+3*n)*H[s+1]+(l-n)*d*X[s+1],o[1]=((6*n-6*i)*H[s]+(3*n-4*i+1)*d*X[s]+(-6*n+6*i)*H[s+1]+(3*n-2*i)*d*X[s+1])/d,o}const z=[0,0];function ie(t){return t<F[0]||t>F[F.length-1]?0:j(t,z)[0]}const M=(()=>{const o=new Float32Array(521),a=new Float32Array(521);let s=2.6,d=2.6;for(let i=0;i<=520;i++){const n=190-130*i/520,l=j(n,z)[0];i>0&&(s+=Math.hypot(l-d,130/520)),d=l,o[i]=n,a[i]=s}return{N:520,ys:o,as:a,total:s}})();function Pe(t){const o=V((190-t)/130,0,1)*M.N,a=Math.min(M.N-1,Math.floor(o));return ae(M.as[a],M.as[a+1],o-a)}function ee(t){let o=0,a=M.N;for(;a-o>1;){const s=o+a>>1;M.as[s]>t?a=s:o=s}return ae(M.ys[o],M.ys[a],V((t-M.as[o])/Math.max(1e-6,M.as[a]-M.as[o]),0,1))}const be=new e.Color,xe=new e.Matrix4,le=new e.Vector3,Ge=new e.Vector3,ke=new e.Vector3(0,1,0);function ye(t,o,a){let s,d,i,n;if(t>=30){const u=(t-30)*10;s=G[2]+Q[2]*u,d=G[1]+Q[1]*u,i=Math.asin(Q[1])/B,n=0}else{t=Math.max(0,t);let u=0;for(;u<O.length-2&&t>O[u+1][0];)u++;const f=O[Math.max(0,u-1)],p=O[u],x=O[u+1],R=O[Math.min(O.length-1,u+2)],c=(t-p[0])/(x[0]-p[0]),h=m=>{const b=(x[m]-f[m])/Math.max(.001,x[0]-f[0])*(x[0]-p[0]),N=(R[m]-p[m])/Math.max(.001,R[0]-p[0])*(x[0]-p[0]),k=c*c,y=k*c;return(2*y-3*k+1)*p[m]+(y-2*k+c)*b+(-2*y+3*k)*x[m]+(y-k)*N};s=h(1),d=h(2),i=h(3),n=h(4)}const l=i*B,g=n*B;return o.set(0,d,s),le.set(Math.sin(g)*Math.cos(l),Math.sin(l),-Math.cos(g)*Math.cos(l)).add(o),a&&a.setFromRotationMatrix(xe.lookAt(o,le,ke)),o}function Ne(t,o={}){const a=[t(),t(),t(),t(),t()],s=o.sunDepth!=null?o.sunDepth<7.5?6:o.sunDepth<11?9:13:a[0]<.5?9:a[0]<.76?6:13,d=(i,n,l)=>n.includes(i)?i:l;return{sunDepth:s,display:d(o.display,["bands","billows","whirls"],a[1]<.34?"bands":a[1]<.67?"billows":"whirls"),moon:d(o.moon,["gibbous","crescent","none"],a[2]<.55?"gibbous":a[2]<.8?"crescent":"none"),below:d(o.below,["pack","edge","coast"],a[3]<.4?"pack":a[3]<.7?"edge":"coast"),film:d(o.film,["clear","gold"],a[4]<.7?"clear":"gold")}}const I=new e.Vector3(Math.sin(135*B)*Math.cos(32*B),Math.sin(32*B),-Math.cos(135*B)*Math.cos(32*B));function Ae(t,o){const a=t.sunDepth,s=t.moon,d=o()*40,i=o()*40,n=(a===13?.6:0)+(s==="none"?.6:s==="crescent"?.25:0),l=[],g=t.display==="whirls",u=[[-44,-30],[40,-6],[8,-66],[-24,30]];for(let f=0;f<4;f++)l.push(new e.Vector4(u[f][0]+o.range(-8,8),u[f][1]+o.range(-8,8),g?19:15,(f%2?-1:1)*o.range(.8,1.2)));return{uNsTime:{value:0},uNsMoonDir:{value:I.clone()},uNsMoon:{value:new e.Vector4(s==="gibbous"?1:s==="crescent"?.36:0,s==="crescent"?1:0,s==="none"?0:1,Math.min(1,n))},uNsTwi:{value:a===6?new e.Vector4(.95,1.7,1.5,0):a===9?new e.Vector4(1,1.15,1.7,.15):new e.Vector4(.85,.6,1.7,.8)},uNsSheet:{value:(a===6?new e.Vector4(1,900,60,0):a===9?new e.Vector4(1+.2*n,54,28,.12):new e.Vector4(1.5+.2*n,-4,30,.06)).multiply(new e.Vector4(1.3,1,1,1))},uNsDisp:{value:t.display==="bands"?new e.Vector4(1.15,.55,.6,.8):t.display==="billows"?new e.Vector4(.6,1.35,.6,.7):new e.Vector4(.85,.7,1.15,1)},uNsDark:{value:new e.Vector4(a===6?1.1:a===9?1.6:2.6,a===13?1:a===9?.12:0,a===13?1:0,d)},uNsBelow:{value:new e.Vector4(t.below==="pack"?0:1,t.below==="coast"?1:0,1+n,i)},uNsWhirl:{value:l},uNsColA:{value:a===6?new e.Vector3(.15,.42,1):a===9?new e.Vector3(.08,.3,1):new e.Vector3(.13,.17,.92)},uNsColB:{value:a===6?new e.Vector3(.5,.73,1):a===9?new e.Vector3(.4,.64,1):new e.Vector3(.4,.5,1)}}}function Re(t){const o=new e.ShaderMaterial({uniforms:t,side:e.BackSide,depthWrite:!1,depthTest:!1,vertexShader:`varying vec3 vDir;
      void main(){ vDir = position; vec4 p = projectionMatrix * modelViewMatrix * vec4(position * 60., 1.);
        if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }`,fragmentShader:$+`
      varying vec3 vDir;
      void main(){ gl_FragColor = vec4(nsSky(normalize(vDir)), 1.); }`}),a=new e.Mesh(new e.BoxGeometry(2,2,2),o);return a.renderOrder=-1,a.frustumCulled=!1,a}const te=`
uniform float uTime; uniform float uBurst;
float nsFilmDisp(float th, float y, float R){
  float t = uTime, sl = clamp(1. - smoothstep(98., 140., y) + .45 * smoothstep(0., 9., uBurst), 0., 1.);
  float gw = 6.2832 * R / 160., sc = .5 - .5 * cos(th * 160.);
  float d = gw * (.11 * (1. - sl) - .30 * sl * (.55 + .45 * sin(th * 23. + y * .07))) * sc;      // scallop out, pleat in
  float br = .8 + .2 * sin(t * .45 + th * 3.);
  float f1 = 1. - abs(sin(th * 11. + .05 * y + .7 * sin(.07 * y - .33 * t)));
  float f2 = 1. - abs(sin(th * 19. - .08 * y + .6 * sin(.11 * y - .45 * t + 1.7)));
  float f3 = 1. - abs(sin(th * 31. + .13 * y + .5 * sin(.16 * y - .6 * t + 4.)));
  d -= sl * R * br * (.060 * f1 * f1 + .036 * f2 * f2 + .016 * f3);
  float rp = (.5 + .5 * smoothstep(120., 150., y)) * smoothstep(0., 14., R);   // ripples shrink with the cone toward its tip
  d += rp * (.15 * sin(th * 46. + y * .55 - t * 1.9) * sin(th * 9. - y * .21 + t * .4) + .06 * sin(th * 71. - y * .9 + t * 2.6) + .018 * sin(th * 113. + y * 1.7 - t * 3.3));
  return d;
}
`,he=`
// the torn hole in the crown: its lip (metres of arc from the crown) by bearing: irregular, 8 to 19 m, open within 1.8 s
float nsHole(float th){
  vec2 c = vec2(cos(th), sin(th));
  return (5. + 13. * nsGn(c * 1.7 + 3.) + 3. * nsGn(c * 6. + 11.)) * smoothstep(0., 1.8, uBurst);
}
`,ze=`
uniform float uSeamEnd[14]; uniform float uRibL[14]; uniform float uRibW[14];   // uRibW: half widths
float nsTear(float th, float a, float R, out float tip){
  float pitch = 6.2832 / 14., k = floor(th / pitch + .5), Fg = 16. * uBurst;
  int ki = int(mod(k + 14., 14.));
  // film splitting, not a pie: each seam parts at its own moment (the south one first, the others up to .4 s late) and
  // at its own rate; its line wanders a metre; it is a slit beside the front and gapes as the gas takes the film
  // (order 3: moments up to 1.2 s apart and rates from .65 to 1.3 of the south seam's, so the lengths are unequal)
  float km = float(ki), hk = nsH1(vec2(km, 3.7)), hq = nsH1(vec2(km, 9.1));
  float sk = uBurst - (ki == 0 ? 0. : .05 + 1.15 * hk * hk), F = 16. * (ki == 0 ? 1. : .65 + .65 * hq) * max(sk, 0.);
  float ds = abs((th - k * pitch) * R - (nsGn(vec2(a * .17, km * 7.3)) - .5) * 3. * smoothstep(2., 9., a));
  float E = uSeamEnd[ki], g = ki == 0 ? .12 : .6;
  float w = min((F - a) * (.09 + .70 * smoothstep(.4, 3.6, sk)) * (.7 + .6 * hq), (E - a) * g);
  float fray = (nsVn(vec2(th * 60., a * .9)) - .5) * 1.5 + (nsVn(vec2(th * 220., a * 3.)) - .5) * .5;
  tip = (1. - smoothstep(0., 4., abs(F - a))) * (1. - smoothstep(0., 3., ds)) * step(a, E) * step(0., uBurst);
  // each ribbon's own strip is cut out of the film as the front passes it (the ribbon mesh takes it over there)
  float ri = clamp(floor(th / pitch), 0., 13.); int rj = int(ri);
  float dc = abs(th - (ri + .5) * pitch) * R, hwid = min(uRibW[rj], .42 * pitch * R);
  float Fr = 16. * max(uBurst - .6 * fract(ri * .471 + .23), 0.);                       // the ribbon's own moment (as in its vertex law)
  float strip = min(hwid - dc, min(Fr, uRibL[rj]) - a + fray * .5);
  float hole = uBurst > 0. ? nsHole(th) - a + fray * .7 : -1000.;                        // the torn hole in the crown
  return max(max(w - ds + fray * smoothstep(0., 2.5, w), strip), hole);
}
`,Te=te+`
attribute vec4 aFilm;      // bearing, height, taut radius, its slope
attribute float aArc;      // metres from the crown along the meridian
varying vec4 vFilm; varying float vArc; varying vec3 vPos;
void main(){
  float th = aFilm.x, R = aFilm.z + nsFilmDisp(aFilm.x, aFilm.y, aFilm.z);
  vec3 p = vec3(sin(th) * R, aFilm.y, cos(th) * R);
  vFilm = aFilm; vArc = aArc; vPos = p;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
}`,Ee=$+te+he+ze+`
uniform vec3 uEye; uniform vec4 uFlash; uniform vec3 uTint;
uniform vec4 uFilmK;       // x which wall (+1 the near, -1.3 the far: the two bend the sight line apart), y frost gain
varying vec4 vFilm; varying float vArc; varying vec3 vPos;
void main(){
  float th = vFilm.x, y = vFilm.y, R = max(vFilm.z, .3), dR = vFilm.w;
  float gore = th * (160. / 6.2832), fg = fwidth(gore);
  float fs = clamp(length(fwidth(vPos)), 1e-4, 50.);                 // metres a pixel on the film
  float tip, tr = nsTear(th, vArc, R, tip);
  // the film's normal from its own law (creases and ripples are per pixel), and the taut normal
  float D = nsFilmDisp(th, y, R), h = .0016, kk = .25;
  float Dt = (nsFilmDisp(th + h, y, R) - D) / h, Dy = (nsFilmDisp(th, y + kk, R + dR * kk) - D) / kk;
  vec3 er = vec3(sin(th), 0., cos(th)), et = vec3(cos(th), 0., -sin(th)), upv = vec3(0., 1., 0.);
  vec3 N = normalize(cross(et * (R + D) + er * Dt, er * (dR + Dy) + upv));
  vec3 Ns = normalize(cross(et, er * dR + upv));
  vec3 V = normalize(vPos - uEye);
  // what the film shows: the sky law along the sight line bent by the film's normal (70 parts; 30 parts true, by the blend)
  // (order 5: the folds bend it less, the far wall least, so that what is seen through the envelope is plainly the sky)
  vec3 seen = nsSkyS(normalize(V + uFilmK.x * (Ns * .05 + (N - Ns) * (uFilmK.x > 0. ? .075 : .03))), clamp(length(fwidth(V)) * 1.6, 1e-5, .05), .7);
  vec3 sky0 = min(seen, vec3(1.9));                                  // (about what stands behind this pixel of the film)
  float nv = dot(N, V), cosv = abs(nv), graze = max(1. - cosv, 0.), fres = .05 + .95 * pow(graze, 5.);
  vec3 Rf = reflect(V, nv > 0. ? -N : N);
  float rm = max(dot(Rf, uNsMoonDir), 0.);
  float aR = (asin(clamp(Rf.y, -1., 1.)) + .10895) * 57.2958, cnR = -Rf.z / max(length(Rf.xz), 1e-4);
  vec3 env = aR > 0. ? nsArc(aR, cnR) + mix(uNsColB, uNsColA, clamp(Rf.y, 0., 1.)) * .13 * uNsSheet.x : vec3(.02, .03, .06) * (.4 + uNsMoon.x);
  float tipk = smoothstep(.6, 9., R); env *= .2 + .8 * tipk;          // no mirror of the arc in the last metres of the cone
  vec3 glint = vec3(.92, .96, 1.) * uNsMoon.x * min(pow(rm, 700.) * 16. + pow(rm, 50.) * .5, 1.6);
  // milk: the film's own scatter of moon, sheet and twilight, more where the sight line grazes it
  float lm = uNsMoon.x * (.35 + .65 * abs(dot(N, uNsMoonDir)));
  vec3 milk = uTint * (vec3(.80, .87, 1.) * lm * .011 + uNsColA * (.005 + .016 * uNsMoon.w) + vec3(1., .5, .22) * .016 * uNsTwi.x * max(-N.z, 0.) * tipk) / max(cosv, .16);
  // THE ARC'S LIGHT ON THE FILM (the look's own light, from the north): a warm glow where the sight line grazes the skin,
  // most on the north-facing skin and along sight lines toward the arc (a thin film scatters forward); and a cool bright rim
  // (order 5) a PLAIN RIM of ember and gold: nothing where the film is seen square on (the inside stays clean), strong at
  // grazing sight; ember within, gold at the very edge; it follows the scallops (the film's own normal) and the tapes
  float g3 = graze * graze * graze, nf = smoothstep(-.5, .7, -mix(Ns.z, N.z, .6)), fwdk = .4 + .6 * smoothstep(-.2, .9, -V.z);
  vec3 wc = mix(vec3(1., .33, .10), vec3(1., .22, .07), uNsTwi.w) * mix(vec3(1.), vec3(1., 1.45, 1.5), smoothstep(.62, .95, graze));
  // (order 6: the rim is of the envelope's own outline; a fold in the middle of the picture takes little of it, so the inside stays clean)
  float gz = mix(max(1. - abs(dot(Ns, V)), 0.), graze, .3), gz3 = gz * gz * gz;
  float wk = (.04 * gz * gz + .5 * gz3 + 1.5 * gz3 * gz) * (.45 + .55 * nf) * fwdk * tipk, cool = 1. - .9 * min(wk, 1.);
  vec3 warm = wc * uNsTwi.x * uNsTwi.z * min(wk, .95);
  env *= cool; milk *= cool; seen *= .5 + .5 * cool;
  vec3 rim = (uNsColB * .22 * uNsSheet.x + vec3(.8, .87, 1.) * lm * .28) * mix(g3, gz3, .75) * cool * cool
    + vec3(.02, .60, .55) * .30 * uNsTwi.x * graze * graze * (1. - graze) * 4. * nf * tipk;      // turquoise inside the ember rim, on the north-facing skin
  // frost: feathered patches, most on the film the moon does not reach; sparkle by the mirror angle
  float shade = 1. - smoothstep(-.35, .35, dot(Ns, uNsMoonDir));
  float fr = smoothstep(.48, .68, nsFbm(vPos.xz / 9. + y * .11 + 3.)) * (.3 + .7 * shade);
  fr *= .5 + .5 * nsVn(vPos.xz * 1.9 + y * 2.3);
  vec2 cu = vec2(th * 110., vArc * 2.4), sc = floor(cu); float hs = nsH1(sc), dotk = 1. - smoothstep(.06, .24, length(fract(cu) - .5));
  float tw = pow(max(.5 + .5 * sin(uTime * (2. + 5. * hs) + hs * 80. + dot(Rf, vec3(31., 17., 23.))), 0.), 8.);
  float spark = mix(.14, step(.80, hs) * tw * 5. * dotk, 1. - smoothstep(.14, .42, fs));
  float sq = smoothstep(.25, .8, cosv), back = step(uFilmK.x, 0.), dim = 1. - .6 * back;   // (sq: the film seen square on)
  // (order 7: seen square on, the frost's pale body is a quarter of itself: its sparkle stays, nothing milky lies across the middle)
  vec3 frost = uFilmK.y * (1. + .3 * smoothstep(135., 165., y)) * max(fr, .03) * (vec3(.62, .72, .95) * (lm * .22 + .04 + .10 * uNsMoon.w) * mix(1., .25, sq) + vec3(.9, .95, 1.) * spark * (.35 + uNsMoon.x + 1.2 * uNsMoon.w));
  // (order 6) CLEAN AND CALM INSIDE: seen square on, the film is clear and the true sky comes through it (its own bent
  // image of the sky weighs a third on the near wall, a seventh on the far one); toward grazing sight it takes body.
  // The far wall is fainter in everything (image, mirror, milk, frost, tapes) than the near wall's gores and frost.
  // (order 7) A GREAT BALLOON OF CLEAR FILM: seen square on the film is nearly clear (its own bent image of the sky
  // weighs a sixth on the near wall, a sixteenth on the far one: stars, whirls and curtains come through unchanged,
  // only tinted); its light is gathered into the tapes, the scallops beside them, the rim and the warm north flank
  float alpha = mix(mix(.7, .16, sq), mix(.42, .06, sq), back);
  vec3 col = seen * uTint * alpha + (env * fres + milk * mix(1., .5, sq) + frost) * dim + glint * (.08 + fres) + warm + rim;
  alpha = clamp(alpha + .18 * fres + .12 * fr * mix(1., .3, sq), 0., .95);
  // THE SCALLOPS: every gore bulges between its two tapes; its skin turns away to either side, so beside each tape lies
  // a soft band of the moon's and the sheet's light (the gore's middle stays clear), the moonward half brighter
  float gw = 6.2832 * R / 160., dg = abs(fract(gore + .5) - .5), gc = fract(gore) - .5, sc3 = abs(gc) * 2.; sc3 = sc3 * sc3 * sc3;
  vec3 Ng = normalize(Ns + et * gc * .9); float mg = abs(dot(Ng, uNsMoonDir));
  col += (uNsColB * .07 * uNsSheet.x + vec3(.8, .87, 1.) * uNsMoon.x * .30 * mg * mg) * sc3 * (1. - smoothstep(.12, .35, fg)) * dim * tipk * uFilmK.z;
  // the load tapes: crisp pale meridians that carry the light, never thinner than a pixel and a half
  float hw0 = min(.035 / max(gw, .02), .3), hw = max(hw0, .75 * fg);
  float line = (1. - smoothstep(hw - fg * .5, hw + fg * .5, dg)) * clamp(hw0 / hw, .6, 1.);
  line = mix(line, min(.6, 2. * hw0), smoothstep(.25, .5, fg)) * uFilmK.z * dim;
  // moon glints run along the tapes (a broad mirror lobe, in dashes that travel)
  float tg = pow(rm, 6.) * pow(max(.5 + .5 * sin(vArc * .9 - uTime * 1.6 + gore * 2.4), 0.), 3.) * (uNsMoon.x + .4 * uNsMoon.w);
  col = mix(col, uNsColB * .10 * uNsSheet.x + vec3(.8, .87, 1.) * lm * .20 + glint * .15 + vec3(.85, .92, 1.) * tg * 1.1 + warm * 1.3 + wc * .10 * uNsTwi.x * nf * fwdk * tipk * graze * graze, line); alpha = mix(alpha, .9, line);
  // the tear's frayed edge and its running tip
  float edge = (1. - smoothstep(0., .5 + 2. * fs, -tr)) * step(0., uBurst);
  col += vec3(.72, .86, 1.) * (edge * .85 + tip * .7) * (.55 + .45 * uNsMoon.x);
  col += uFlash.rgb * uFlash.w * (.10 / max(cosv, .2) + fr * .5 + .04);
  // nothing clips to white. The film is clearer now (order 7), so the near wall's own light is held to what the sky
  // behind it leaves under 1.9 (and to 1.5), the far wall's to 0.55: the two and the sky behind stack to about 2
  col = min(col, mix(max(vec3(1.9) - (1. - alpha) * (sky0 + .15), vec3(.3)), vec3(.55), back));
  col = min(col, vec3(1.5));
  if (tr > 0.) discard;
  gl_FragColor = vec4(col, alpha);
}`;function Fe(t,o,a,s){const l=new Float32Array(83460),g=new Float32Array(20865),u=new Float32Array(20865*3),f=new Uint16Array(320*64*6);for(let c=0,h=0;c<=64;c++){const m=2.6+(M.total-2.6)*c/64,b=ee(m);j(b,z);for(let N=0;N<=320;N++,h++){const k=N/320*Math.PI*2;l[h*4]=k,l[h*4+1]=b,l[h*4+2]=z[0],l[h*4+3]=z[1],g[h]=m,u[h*3]=Math.sin(k)*z[0],u[h*3+1]=b,u[h*3+2]=Math.cos(k)*z[0]}}for(let c=0,h=0;c<64;c++)for(let m=0;m<320;m++){const b=c*321+m,N=b+1,k=b+320+1,y=k+1;f[h++]=b,f[h++]=k,f[h++]=y,f[h++]=b,f[h++]=y,f[h++]=N}const p=new e.BufferGeometry;p.setAttribute("position",new e.BufferAttribute(u,3)),p.setAttribute("aFilm",new e.BufferAttribute(l,4)),p.setAttribute("aArc",new e.BufferAttribute(g,1)),p.setIndex(new e.BufferAttribute(f,1));const x=a.film==="gold"?new e.Vector3(1,.93,.8):new e.Vector3(.9,.95,1),R=(c,h,m)=>{const b=new e.ShaderMaterial({uniforms:{...t,uEye:o.uEye,uTime:o.uTime,uBurst:o.uBurst,uFlash:o.uFlash,uTint:{value:x},uFilmK:{value:new e.Vector4(h,1,h>0?.75:.35,0)},...s},vertexShader:Te,fragmentShader:Ee,side:c,transparent:!0,depthWrite:!1,blending:e.CustomBlending,blendSrc:e.OneFactor,blendDst:e.OneMinusSrcAlphaFactor,blendSrcAlpha:e.OneFactor,blendDstAlpha:e.OneMinusSrcAlphaFactor}),N=new e.Mesh(p,b);return N.renderOrder=m,N.frustumCulled=!1,N};return{back:R(e.BackSide,-1.3,1),front:R(e.FrontSide,1,3),geo:p}}function Se(t,o){const a=(c,h)=>{const m=new e.LatheGeometry(c.map(b=>new e.Vector2(b[0],b[1])),28);return m.setAttribute("aPart",new e.BufferAttribute(new Float32Array(m.attributes.position.count).fill(h),1)),m},s=a([[.001,190.98],[.44,190.98],[.52,190.86],[.52,190.32],[.98,190.25],[2.4,190.12],[2.5,190.3],[3,190.3],[3.12,190.12],[3.12,189.8],[.001,189.8]],1),d=a([[.001,62.2],[.55,62.2],[.75,61.6],[.8,60.3],[.7,60],[.001,60]],0),i=s.attributes.position.count,n=d.attributes.position.count,l=new e.BufferGeometry,g=(c,h)=>{const m=new Float32Array((i+n)*h);return m.set(s.attributes[c].array,0),m.set(d.attributes[c].array,i*h),new e.BufferAttribute(m,h)};l.setAttribute("position",g("position",3)),l.setAttribute("normal",g("normal",3)),l.setAttribute("aPart",g("aPart",1));const u=s.index.array,f=d.index.array,p=new Uint16Array(u.length+f.length);p.set(u,0);for(let c=0;c<f.length;c++)p[u.length+c]=f[c]+i;l.setIndex(new e.BufferAttribute(p,1)),s.dispose(),d.dispose();const x=new e.ShaderMaterial({uniforms:{uNsMoonDir:t.uNsMoonDir,uNsMoon:t.uNsMoon,uNsColA:t.uNsColA,uNsTwi:t.uNsTwi,uBurst:o.uBurst,uFlash:o.uFlash,uEye:o.uEye},side:e.DoubleSide,vertexShader:`attribute float aPart; uniform float uBurst; varying vec3 vN; varying vec3 vP; varying float vPart;
      void main(){ float s = max(uBurst, 0.); vec3 p = position; p.y -= aPart * min(2.4 * s * s, 123.); vN = normal; vP = p; vPart = aPart;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.); }`,fragmentShader:`uniform vec3 uNsMoonDir; uniform vec4 uNsMoon; uniform vec3 uNsColA; uniform vec4 uNsTwi; uniform vec4 uFlash; uniform vec3 uEye;
      varying vec3 vN; varying vec3 vP; varying float vPart;
      void main(){ vec3 V = normalize(vP - uEye); vec3 N = normalize(vN); if (dot(N, V) > 0.) N = -N;
        float rm = max(dot(reflect(V, N), uNsMoonDir), 0.);
        // the fitting's own detail: forty tape lugs on the plate, twenty-four bolts on the clamp ring, the ring polished
        float ang = atan(vP.x, vP.z), rr = length(vP.xz), fa = clamp(fwidth(ang) * 40., 0., 3.);
        float lug = mix(.5, smoothstep(-.3, .3, cos(ang * 40.)), 1. - smoothstep(.6, 1.8, fa)) * smoothstep(1., 1.2, rr) * (1. - smoothstep(2.3, 2.45, rr));
        float ring = smoothstep(2.42, 2.5, rr) * (1. - smoothstep(3., 3.1, rr));
        float bolt = smoothstep(.72, .92, cos(ang * 24.)) * (1. - smoothstep(.07, .16, abs(rr - 2.75))) * (1. - smoothstep(.5, 1.5, fa));
        float metal = vPart * (ring * .55 + bolt * .9 - lug * .30);
        vec3 c = vec3(.36, .39, .45) * (1. + metal) * (vec3(.8, .87, 1.) * uNsMoon.x * (.08 + .7 * max(dot(N, uNsMoonDir), 0.)) + uNsColA * (.07 + .12 * uNsMoon.w) * (.6 + .4 * N.y)
          + vec3(1., .45, .2) * .22 * uNsTwi.x * max(-N.z, 0.)) + vec3(.9, .95, 1.) * uNsMoon.x * (pow(rm, 90.) * 1.6 + vPart * (ring + bolt) * pow(rm, 12.) * .7) + uFlash.rgb * uFlash.w * .25;
        gl_FragColor = vec4(c + vec3(.004, .006, .016), 1.); }`}),R=new e.Mesh(l,x);return R.frustumCulled=!1,R.renderOrder=2,R}const Me=te+`
attribute vec4 aRib;       // bearing of the strip's middle, arc a, u across (-1..1), half width (m)
attribute vec4 aRest;      // length L, ribbon number, phase, stagger 0..1
uniform vec3 uProf[25];    // the taut meridian every 4 m of arc from the crown: radius, height, lean of its tangent
varying vec3 vPos; varying vec3 vN; varying vec4 vRib; varying float vFree; varying float vL; varying vec2 vPc;
vec3 nsProf(float a){ float x = clamp(a / 4., 0., 23.99); int i = int(x); return mix(uProf[i], uProf[i + 1], x - float(i)); }
vec3 ribPose(float a, float u, out float free){
  // each ribbon tears at its own moment (up to .6 s late): s is its own clock
  float L = aRest.x, thc = aRib.x, s = uBurst - .6 * fract(aRest.y * .471 + .23), F = 16. * max(s, 0.);
  float tau = s - a / 16., trp = max(s - L / 16., 0.);
  vec3 pr = nsProf(a); float hwid = min(aRib.w, .42 * (6.2832 / 14.) * pr.x);
  float th = thc + u * hwid / max(pr.x, 1.), Rr = pr.x + nsFilmDisp(th, pr.y, pr.x);
  vec3 rest = vec3(sin(th) * Rr, pr.y, cos(th) * Rr);
  float ah = max(min(F, L), a); vec3 ph = nsProf(ah);
  // each ribbon has its own rise, throat, lean and curl (g, h2, k2), so the flower has depth and some petal is always beside the lens
  float g = aRest.w, h2 = fract(aRest.y * .618 + .3), k2 = fract(aRest.y * .377 + .1);
  float climb = (63. + 37. * g) * (1. - exp(-trp / (.9 + .4 * h2)));
  // FROM THE TEARING (order 4) a freed strip lifts on the gas at once: within two seconds it stands up from its hinge
  // along the last line's direction and its outer part (from 2 to 26 m off the hinge) is drawn round that line, so the
  // ribbons rise with us and stand large round the way out well before they let go
  float q = ah - a, pre = smoothstep(.5, 2.8, s) * smoothstep(2., 26., q);
  float bl = max(smoothstep(0., 5., trp), pre), hr = mix(ph.x, 16.5 + 8. * k2, bl), hy = ph.y + climb;
  float psi0 = mix(ph.z, .02 + .16 * h2, smoothstep(.3, 2.4, s));
  // LATE (3.5 to 9.5 s after it lets go) the flower climbs past the lens again: its roots come to stand close round the way
  // out, just under its plane, and the petals open outward along the cone kept clear beyond it
  float sm = smoothstep(3.5, 9.5, trp);
  hr = mix(hr, 15.2 + 5. * k2, sm); hy = mix(hy, 266. + 11. * g, sm); psi0 = mix(psi0, .10 + .22 * h2, sm);
  float uncurl = 1. - .22 * sm;                                                          // (the curled tips open out a little; order 6: they stay curled)
  // the inner half of the freed length stands straight; the outer half curls slowly (1.25 to 2 radians when full blown)
  float q0 = .5 * L, q1 = min(q, q0), q2 = max(q - q0, 0.);
  float kap = ((1.25 + .75 * k2) / (.5 * L)) * smoothstep(5.5, 13., s) * uncurl + 1e-4, psi = psi0 + kap * q2;
  float dr = sin(psi0) * q1 + (cos(psi0) - cos(psi)) / kap, dh = cos(psi0) * q1 + (sin(psi) - sin(psi0)) / kap;
  float lift = smoothstep(0., 2., tau), amp = min(q * .05, 1.6) * lift;
  float fl = sin(q * .12 - uTime * 1.3 + aRest.z) * .6 + sin(q * .25 - uTime * 1.9 + aRest.z * 1.7 + u * 1.1) * .25;
  // the freed flower stands round the way out: its middle slides from the balloon's axis to the last straight line, its up leans with it
  vec3 upv = normalize(mix(vec3(0., 1., 0.), vec3(0., .927568, -.373656), bl));
  vec3 er = normalize(mix(vec3(sin(thc), 0., cos(thc)), vec3(sin(thc), .373656 * cos(thc), .927568 * cos(thc)), bl)), et = normalize(cross(upv, er));
  vec3 mid = vec3(0., hy, bl * (59.7 - (hy - 130.3) * .402834));
  vec3 nr = er * cos(psi) - upv * sin(psi);                                            // the ribbon's own normal, in its meridian plane
  // a slow twist along its length, and (order 6) each petal's own steady turn, an eighth to a third of a turn at its tip
  float tw = (.45 * sin(q * .04 + aRest.z + uTime * .22) + (.8 + 1.3 * h2) * (q / L) * (sin(aRest.z * 3.) > 0. ? 1. : -1.)) * lift;
  float fold = (sin(u * 3.9 + q * .05 + aRest.z * 2.) * .5 + sin(u * 8.5 - q * .09 + aRest.z) * .16) * min(q * .1, 1.) * lift;   // long folds
  // (order 6: it is cupped across its width like a trough, deeper toward its tip)
  vec3 pose = mid + er * (hr + dr) + upv * dh + (et * cos(tw) + nr * sin(tw)) * (u * hwid)
    + et * sin(q * .08 - uTime * .8 + aRest.z * 2.) * .8 * amp + nr * (fl * amp + fold) + (nr * cos(tw) - et * sin(tw)) * (u * u - .33) * hwid * (.25 + .5 * q / L) * lift;
  free = smoothstep(0., 1.1, tau);
  return mix(rest, pose, free);
}
// THE PIECES (order 7): 5 to 7.2 s after it began to tear a ribbon parts into three. Each piece keeps its own shape and
// from then on turns end over end about its own middle (gAng, about the axis across it), bends (gKap) and drifts
// (gDr), so the wheel has depth and the lens goes THROUGH it. Some middle pieces (the widest) curl up tight, turn
// slowly and come near: large curls that pass close by at the last. The frame (gC middle, gT along, gA across, gN normal) is set once for a vertex's piece in main.
vec3 gC, gT, gA, gN, gDr; float gBr, gKap, gAng;
vec3 ribPiece(vec3 p){
  vec3 r = p - gC; float rx = dot(r, gT), ry = dot(r, gA), rz = dot(r, gN);
  float ph = gKap * rx, sx = sin(ph), cx = cos(ph), x1 = sx / gKap - rz * sx, z1 = (1. - cx) / gKap + rz * cx;
  float ca = cos(gAng), sa = sin(gAng);
  return gC + gDr + gT * (x1 * ca - z1 * sa) + gN * (x1 * sa + z1 * ca) + gA * ry;
}
vec3 ribPos(float a, float u, out float free){
  vec3 p = ribPose(a, u, free); if (gBr > 0.) p = ribPiece(p);
  float thc = aRib.x, tau = uBurst - .6 * fract(aRest.y * .471 + .23) - a / 16.;
  // the way out keeps its air: 14.5 m round the last straight line, for every freed point (a piece's too: this law is the last)
  const vec3 LF = vec3(0., 130.3, 59.7), LD = vec3(0., .927568, -.373656);
  // (past the way out's plane, 160 m along the line, the clear space widens as a cone, so no freed point seen from the line
  // more than 5 m before the plane is ever seen inside the ring or before it: 14.5 m, or 10.5 + 1.4 m for each metre past the plane)
  float tl = dot(p - LF, LD); vec3 c = LF + LD * tl, r = p - c; float rag = 2.5 * fract(aRest.y * .37 + .2) + 2.5 + 2.5 * sin(a * .33 + aRest.z);   // (a ragged margin over the 14.5 m, so no round window is cut)
  float d = length(r), keep = max(14.5 + rag, 10.5 + 1.4 * (tl - 160.)) * smoothstep(0., 1.4, tau);
  float k = clamp(1. - d / max(keep, 1e-3), 0., 1.);
  vec3 n = normalize(r + vec3(sign(sin(thc)) * (k * keep * 1.2 + 1e-4), 0., 0.));
  // (a point that would lie inside is laid outward past the margin, the deeper the further, so the film folds back
  // there and no round rim is drawn on the tube)
  return c + n * max(d, keep + (keep - d) * .5);
}
void main(){
  float f0, f1, f2, fq;
  // this vertex's piece (0 the tip third, 2 the root third) and its ribbon's parting clock
  float L = aRest.x, h2 = fract(aRest.y * .618 + .3), sb = uBurst - .6 * fract(aRest.y * .471 + .23) - (5. + 2.2 * h2);
  float kf = min(floor((aRib.y - 2.6) / (L - 2.6) * 3. + 1e-3), 2.);
  gBr = 0.; gKap = 1e-4; gAng = 0.; gC = vec3(0.); gDr = vec3(0.); gT = vec3(0., 1., 0.); gA = vec3(1., 0., 0.); gN = vec3(0., 0., 1.);
  if (sb > 0.) {
    float ac = 2.6 + (L - 2.6) * (kf + .5) / 3.;
    gC = ribPose(ac, 0., fq); vec3 c2 = ribPose(ac - 1., 0., fq), c3 = ribPose(ac, 1., fq) - gC;
    gT = normalize(c2 - gC + vec3(0., 1e-5, 0.)); gA = normalize(c3 - gT * dot(c3, gT) + vec3(1e-5, 0., 0.)); gN = cross(gT, gA);
    float hk = fract(aRest.y * .733 + kf * .37 + .11), hk2 = fract(hk * 7.13 + .3), hk3 = fract(hk * 13.7 + .6);
    float curl = step(.5, kf) * step(kf, 1.5) * step(hk2, .3), sg = hk > .5 ? 1. : -1., g = sb * sb / (sb + 1.5);   // (a close curl is a middle piece, the widest)
    gKap = mix(.012 + .03 * hk3, .11 + .05 * hk3, curl) * smoothstep(0., 3., sb) + 1e-4;
    gAng = mix(.5 + .7 * hk3, .18, curl) * sg * g;
    const vec3 LF = vec3(0., 130.3, 59.7), LD = vec3(0., .927568, -.373656);
    vec3 rr = gC - LF; rr -= LD * dot(rr, LD); float rl = max(length(rr), 1e-3); rr /= rl;
    // two pieces in five fall behind (2 to 7 m/s, so the lens overtakes them one after another); the rest stay ahead as
    // the wheel round the way out and drift 2 to 24 m outward (far ones small); a close curl is drawn in to 17 m from
    // the line (the law of place below then holds it outside the clear air) and falls behind only a little: the lens
    // comes up to it and passes it in the last two seconds
    float vt = hk > .62 ? 2. + 5. * (hk - .62) / .38 : .3;
    gDr = -LD * mix(vt, .5 + 1.5 * hk3, curl) * g + rr * mix(2. + 22. * hk2 * hk2, 17. - rl, curl) * (1. - exp(-sb / 3.5));
    gBr = smoothstep(0., .8, sb);
  }
  vec3 p = ribPos(aRib.y, aRib.z, f0), pa = ribPos(aRib.y + .35, aRib.z, f1), pu = ribPos(aRib.y, aRib.z + .08, f2);
  vec3 nn = cross(pa - p, pu - p); float nl = length(nn);
  vN = nl > 1e-6 ? nn / nl : vec3(0., 1., 0.); vPos = p; vRib = aRib; vFree = f0; vL = aRest.x; vPc = vec2(kf, gBr);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
}`,Le=$+`
uniform vec3 uEye; uniform vec4 uFlash; uniform vec3 uTint; uniform float uBurst; uniform float uTime;
varying vec3 vPos; varying vec3 vN; varying vec4 vRib; varying float vFree; varying float vL; varying vec2 vPc;`+he+`
void main(){
  float a = vRib.y, u = vRib.z;
  float gore = vRib.x * (160. / 6.2832) + u * vRib.w * .57, fg = fwidth(gore);        // the tapes ride the ribbon, 1.77 m apart
  float fs = clamp(length(fwidth(vPos)), 1e-4, 50.);
  vec3 N = normalize(vN), V = normalize(vPos - uEye);
  // (order 5) A PETAL CURLS IN DEPTH: across its width it is cupped like a trough (the normal leans out toward either
  // edge, more as it comes free), so one side takes the light and the other lies in shade. Tu: the direction across it.
  vec3 px = dFdx(vPos), py = dFdy(vPos); float ax = dFdx(a), ay = dFdy(a), ux = dFdx(u), uy = dFdy(u);
  vec3 Tu = (px * ay - py * ax) * (ux * ay - uy * ax); Tu = Tu / max(length(Tu), 1e-9);
  N = normalize(N + Tu * u * .75 * vFree);
  float nv = dot(N, V), cosv = abs(nv), graze = max(1. - cosv, 0.), fres = .05 + .95 * pow(graze, 5.);
  vec3 Nv = N * sign(-nv);                                                              // the face turned to the eye
  float wm = .22 + .78 * smoothstep(-.35, .75, dot(Nv, uNsMoonDir)), wu = .3 + .7 * smoothstep(-.5, .8, Nv.y), wn = .25 + .75 * smoothstep(-.4, .7, -Nv.z);
  float lit = mix(wu, wm, .65 * min(uNsMoon.x, 1.));
  // the envelope's own clear film: the sky bent through it by its folds, the mirror at grazing angles, glints, frost, tape lines
  vec3 seen = nsSkyS(normalize(V + N * sign(-nv) * .13), clamp(length(fwidth(V)) * 2., 1e-5, .05), .7);
  vec3 Rf = reflect(V, nv > 0. ? -N : N); float rm = max(dot(Rf, uNsMoonDir), 0.);
  float aR = (asin(clamp(Rf.y, -1., 1.)) + .10895) * 57.2958, cnR = -Rf.z / max(length(Rf.xz), 1e-4);
  vec3 env = aR > 0. ? nsArc(aR, cnR) + mix(uNsColB, uNsColA, clamp(Rf.y, 0., 1.)) * .10 * uNsSheet.x : vec3(.02, .03, .06) * (.4 + uNsMoon.x);
  vec3 glint = vec3(.92, .96, 1.) * uNsMoon.x * min(pow(rm, 500.) * 12. + pow(rm, 40.) * .5, 1.6);
  float lm = uNsMoon.x * (.35 + .65 * abs(dot(N, uNsMoonDir)));
  vec3 milk = uTint * (vec3(.80, .87, 1.) * lm * .020 + uNsColA * (.012 + .07 * uNsMoon.w) + vec3(1., .36, .14) * .06 * uNsTwi.x * max(-N.z * sign(-nv), 0.)) / max(cosv, .16);
  float fr = smoothstep(.45, .68, nsFbm(vec2(a * .16, u * 1.3 + vRib.x * 7.)));
  vec2 cu = vec2(u * vRib.w * 3., a * 3.); float hs = nsH1(floor(cu) + vRib.x * 31.), dotk = 1. - smoothstep(.07, .26, length(fract(cu) - .5));
  float tw = pow(max(.5 + .5 * sin(uTime * (2. + 5. * hs) + hs * 80. + dot(Rf, vec3(31., 17., 23.))), 0.), 8.);
  float spark = mix(.05, step(.84, hs) * tw * 5. * dotk, 1. - smoothstep(.08, .24, fs));
  vec3 frost = .5 * max(fr, .05) * (vec3(.62, .72, .95) * (lm * .22 + .04 + .10 * uNsMoon.w) + vec3(.9, .95, 1.) * spark * (.35 + uNsMoon.x + 1.2 * uNsMoon.w));
  // its own body: the moon's light on the lit side, the sheet's blue from above, the arc's ember and gold from the north;
  // the sky is seen dimly through it, dimmer through the shaded side
  vec3 wc = mix(vec3(1., .33, .10), vec3(1., .22, .07), uNsTwi.w) * mix(vec3(1.), vec3(1., 1.45, 1.5), smoothstep(.62, .95, graze));
  float fwdk = .4 + .6 * smoothstep(-.2, .9, -V.z);
  vec3 body = uTint * (vec3(.80, .87, 1.) * uNsMoon.x * wm * .05 + uNsColA * .025 * uNsSheet.x * wu) * vFree + wc * uNsTwi.x * uNsTwi.z * (.8 + 1. * vPc.y) * graze * graze * graze * graze * (.3 + .7 * wn) * fwdk;
  float alpha = .7;
  vec3 col = (seen * uTint * alpha + env * fres + milk + frost) * mix(1., .42 + .58 * lit, vFree) + glint * (.08 + fres) + body;
  alpha = clamp(alpha + .18 * fres + .05 * fr, 0., .95);
  float dg = abs(fract(gore + .5) - .5), hw = max(.02, .75 * fg);
  float line = (1. - smoothstep(hw - fg * .5, hw + fg * .5, dg)) * clamp(.02 / hw, .35, 1.) * .7;
  col = mix(col, vec3(.010, .014, .034) + glint * .15, line); alpha = mix(alpha, .96, line);
  // frayed edges, brighter; the cut end where the tear's front is
  // while it still lies in the film a strip fills its place whole (no dark slice beside it); it narrows to its torn root
  // and its edges fray only as it comes free
  // (order 6) NO PETAL IS A RECTANGLE: freed, it is a leaf, a tenth of its width at its tip, full 30 m from the tip,
  // and it narrows again over its last 26 m to the torn root
  float wf = mix(1., pow(clamp((vL - a) / 26., 0., 1.), .75) * (.10 + .90 * pow(smoothstep(0., 30., a - nsHole(vRib.x)), .8)), vFree);
  // (order 7) where the ribbon parts into three it necks and tears: each piece narrows to a ragged point at its torn ends
  float dc = min(abs(a - 2.6 - (vL - 2.6) * .32778), abs(a - 2.6 - (vL - 2.6) * .66111)) + 3. * (nsVn(vec2(a * .37 + vRib.x * 5., 9.)) - .5);
  wf *= mix(1., .10 + .90 * smoothstep(-.5, 8., dc), vPc.y);
  float e = 1. - abs(u) / max(wf, .02) - vFree * (.30 * nsVn(vec2(a * .31, sign(u) * 3. + vRib.x * 9.)) + .07 * nsVn(vec2(a * 2.3, u * 5.)) + .04);
  float sdl = uBurst - .6 * fract(floor(vRib.x / .448799) * .471 + .23);                // this ribbon's own clock
  float cut = 16. * sdl - a + (nsVn(vec2(vRib.x * 60., a * .9)) - .5) * .75;
  // its tip ends at the torn hole's ragged lip (near the crown the radius is about the arc, so the bearing is known)
  float hl = a - nsHole(vRib.x + u * min(vRib.w / max(a, 1.), .1885)) - (nsVn(vec2(vRib.x * 60. + u * 9., a * .9)) - .5) * 1.1;
  cut = min(cut, hl);
  cut = min(cut, vL - a - .4 - 5. * nsVn(vec2(u * 1.7 + vRib.x * 5., 3.)) * nsVn(vec2(u * 6., vRib.x * 3.)));   // the torn root
  // the torn edge: a thin bright fray, a pixel and a half at the least; no drawn outline
  float fray = 1. - smoothstep(0., .02 + 1.5 * fs / max(vRib.w, .5), e);
  // the edge that faces north takes the arc's ember and gold (the same rim as the film's)
  float en = max(-Tu.z * sign(u), 0.), eb = 1. - smoothstep(0., .07 + 2. * fs / max(vRib.w, .5), e);
  col += wc * uNsTwi.x * uNsTwi.z * eb * vFree * (.9 + 1. * vPc.y) * en;
  col += vec3(.72, .86, 1.) * (fray * vFree * (.14 + .22 * uNsMoon.x) * (1. - .7 * en) + (1. - smoothstep(0., .5 + 2. * fs, hl)) * (.45 + .4 * uNsMoon.x)) + uFlash.rgb * uFlash.w * (.10 / max(cosv, .2) + fr * .5 + .04);
  col = min(col, vec3(1.5));
  if (e < 0. || cut < 0.) discard;
  if (vPc.y > 0. && abs(vPc.x - floor(vPc.x + .5)) > .02) discard;                        // (the one row of cells that spanned two pieces)
  // a frayed edge, not a cut one: the film thins out toward it over an unequal width (a twentieth to a fifth of the petal)
  float thr = nsVn(vec2(a * .9 + vRib.x * 13., 2.)) * nsVn(vec2(a * 4.1, vRib.x * 7. + sign(u))), fz = mix(1., smoothstep(0., .05 + .17 * thr, e), vFree);
  gl_FragColor = vec4(col * fz, alpha * fz);
}`;function De(t,o,a,s,d,i){const p=new Float32Array(45864),x=new Float32Array(11466*4),R=new Float32Array(11466*3),c=new Uint16Array(10080*6);let h=0;for(let T=0;T<14;T++){const q=(T+.5)/14*Math.PI*2,L=s[T],P=d[T]/2,W=i()*6.283,J=i(),Y=T*819;for(let D=0;D<=90;D++)for(let S=0;S<=8;S++){const A=Y+D*9+S,_=2.6+(L-2.6)*D/90;p[A*4]=q,p[A*4+1]=_,p[A*4+2]=-1+2*S/8,p[A*4+3]=P,x[A*4]=L,x[A*4+1]=T,x[A*4+2]=W,x[A*4+3]=J,R[A*3+1]=150}for(let D=0;D<90;D++)for(let S=0;S<8;S++){const A=Y+D*9+S,_=A+1,K=A+8+1,r=K+1;c[h++]=A,c[h++]=K,c[h++]=r,c[h++]=A,c[h++]=r,c[h++]=_}}const m=[];for(let T=0;T<25;T++){const q=T*4,L=q<=2.6?190:ee(q);j(L,z),m.push(new e.Vector3(q<=2.6?q:z[0],L,Math.atan(z[1])))}const b=new e.BufferGeometry;b.setAttribute("position",new e.BufferAttribute(R,3)),b.setAttribute("aRib",new e.BufferAttribute(p,4)),b.setAttribute("aRest",new e.BufferAttribute(x,4)),b.setIndex(new e.BufferAttribute(c,1));const N=a.film==="gold"?new e.Vector3(1,.93,.8):new e.Vector3(.9,.95,1),k=new e.ShaderMaterial({uniforms:{...t,uEye:o.uEye,uTime:o.uTime,uBurst:o.uBurst,uFlash:o.uFlash,uTint:{value:N},uProf:{value:m}},vertexShader:Me,fragmentShader:Le,side:e.DoubleSide,transparent:!0,depthWrite:!1,blending:e.CustomBlending,blendSrc:e.OneFactor,blendDst:e.OneMinusSrcAlphaFactor,blendSrcAlpha:e.OneFactor,blendDstAlpha:e.OneMinusSrcAlphaFactor}),y=new e.Mesh(b,k);return y.renderOrder=4,y.frustumCulled=!1,y.visible=!1,y}const fe=`
uniform vec3 uEye; uniform vec2 uPx; uniform vec3 uNsMoonDir; uniform vec4 uNsMoon; uniform vec3 uNsColA; uniform vec4 uNsTwi; uniform vec4 uFlash;
varying vec2 vUv; varying vec3 vCol;
// a tumbling plate at c (balloon space): its corner, never under a pixel and a half; its glint by the mirror angle of the moon
// (dull: its light when it shows no glint; rose: how much of the arc's rose a face turned north takes; cap: its most)
void nsPlate(vec3 c, float size, float spin, float vis, float dull, float rose, float cap){
  vec3 V = normalize(c - uEye);
  vec3 n = normalize(vec3(sin(spin), cos(spin * .73 + 1.), sin(spin * 1.31 + 2.)));
  vec3 H = normalize(uNsMoonDir - V);
  float spec = pow(abs(dot(n, H)), 24.), face = .25 + .75 * abs(dot(n, V));
  vec4 mv = modelViewMatrix * vec4(c, 1.);
  float px = size * projectionMatrix[1][1] * uPx.y * .5 / max(-mv.z, .05), grow = max(1., 1.5 / max(px, 1e-3));
  float ang = spin * .37; vec2 q = vec2(position.x * cos(ang) - position.y * sin(ang), position.x * sin(ang) + position.y * cos(ang));
  mv.xy += q * vec2(1., face) * size * grow;
  vUv = position.xy;
  vCol = min((vec3(.80, .87, 1.) * uNsMoon.x * (dull + 9. * spec) + uNsColA * (.3 + .6 * uNsMoon.w) * (2.5 * dull + 5. * spec * (.3 + uNsMoon.w))
    + vec3(1., .40, .20) * (rose * uNsTwi.x * pow(abs(n.z), 6.) * (.5 + 1.5 * face)) + uFlash.rgb * uFlash.w * .8) * vis / (grow * grow) * min(grow, 3.), vec3(cap));
  gl_Position = projectionMatrix * mv;
}`,qe=`
attribute vec4 aA;         // bearing, birth height, radius at birth (film + offset), phase
attribute vec4 aB;         // period s, fall m/s, size m, number 0..1
uniform float uTime; uniform float uShed;`+fe+`
void main(){
  // shed from the widest film, a flake falls free beside the lower cone and drifts outward at its own speed
  float ph = fract(uTime / aB.x + aA.w), age = ph * aB.x, vr = .3 + 2.4 * pow(fract(aA.w * 7.31), 1.5);
  float th = aA.x + .6 * sin(age * .21 + aA.w * 30.) / aA.z, r = aA.z + vr * age + .5 * sin(age * .5 + aA.w * 50.);
  vec3 c = vec3(sin(th) * r, aA.y - aB.y * age + .3 * sin(age * .9 + aA.w * 70.), cos(th) * r);
  // BY PLACE (order 5, the house term): no flake's middle within 2.6 m of the flown half plane (x = 0, z >= 0), so
  // that with its own size (0.34 m at the most) every flake leaves 2 m and more of clear air round the flown line
  float zk = min(c.z, 0.), kx = sqrt(max(6.76 - zk * zk, 0.));
  c.x += sign(c.x + 1e-4) * kx * exp(-abs(c.x) / max(kx, 1e-3));
  // (order 8) NO FLAKE POPS: each grows in by the route, in light, over a fifth of the shedding's measure (two thirds
  // of a second of route and more: a metre and a half to two of its fall), where it had come by a hard step
  float vis = smoothstep(aB.w * .8, aB.w * .8 + .2, uShed) * smoothstep(0., .04, ph) * (1. - smoothstep(.9, 1., ph));
  nsPlate(c, aB.z, uTime * (1.5 + 4. * aB.w) + aA.w * 90., vis, .4, 0., .9);
}`,Ce=`
attribute vec4 aA;         // bearing, arc a, taut radius, height
attribute vec4 aB;         // speed outward, speed upward, size m, number 0..1
uniform float uTime; uniform float uBurst;`+fe+`
void main(){
  float tau = uBurst - aA.y / 16. - aB.w * .7, tp = max(tau, 0.), life = 15. + 6. * fract(aB.w * 7.3);
  float r = aA.z + aB.x * 2.5 * (1. - exp(-tp / 2.5)) + .6 * sin(uTime * .9 + aB.w * 40.);
  float th = aA.x + .5 * sin(uTime * .6 + aB.w * 60.) / max(aA.z, 4.);
  vec3 c = vec3(sin(th) * r, aA.w + aB.y * 2.2 * (1. - exp(-tp / 2.2)) + (7.5 + 7. * fract(aB.w * 3.7)) * tp, cos(th) * r);   // carried up on the gas, with the flower
  const vec3 LF = vec3(0., 130.3, 59.7), LD = vec3(0., .927568, -.373656);
  // BY PLACE: nothing stands before the way out (its ring is 7 m in radius). From the crown upward (64 m along the last
  // line) no speck within 9 m of that line, thinning softly over 7 m more; past the way out's plane the tube opens as the
  // same cone the ribbons keep (10.5 + 1.4 m per metre), so no speck is seen inside the ring; below the crown 2.6 m of
  // air to a speck's middle (order 5: the house term of 2 m of clear air).
  float tc = dot(c - LF, LD), dl = length(c - LF - LD * tc);
  float tube = max(mix(2.6, 9., smoothstep(48., 64., tc)), 10.5 + 1.4 * (tc - 160.));
  float vis = step(0., tau) * smoothstep(0., .4, tp) * (1. - smoothstep(life * .65, life, tp)) * smoothstep(tube, tube + 7., dl);
  // (order 8) GLITTER, NOT SNOW: a grain is dull till it turns its face to the moon's mirror, and takes the arc's rose
  // when its face is turned north
  // (a grain is capped at 0.55, so its glint over a bright piece of film stays at about 2)
  nsPlate(c, aB.z, uTime * (2. + 5. * aB.w) + aB.w * 90., vis, .14, .5, .55);
}`,Be=`varying vec2 vUv; varying vec3 vCol;
void main(){ float d = length(vUv); gl_FragColor = vec4(vCol * (1. - smoothstep(.55, 1., d)), 0.); }`;function ce(t,o,a,s,d,i){const n=new e.InstancedBufferGeometry;n.setAttribute("position",new e.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),3)),n.setIndex([0,1,2,0,2,3]),n.setAttribute("aA",new e.InstancedBufferAttribute(s,4)),n.setAttribute("aB",new e.InstancedBufferAttribute(d,4)),n.instanceCount=s.length/4;const l=new e.ShaderMaterial({uniforms:{uEye:o.uEye,uPx:o.uPx,uTime:o.uTime,uFlash:o.uFlash,uNsMoonDir:t.uNsMoonDir,uNsMoon:t.uNsMoon,uNsColA:t.uNsColA,uNsTwi:t.uNsTwi,...i},vertexShader:a,fragmentShader:Be,transparent:!0,depthWrite:!1,side:e.DoubleSide,blending:e.CustomBlending,blendSrc:e.OneFactor,blendDst:e.OneFactor,blendSrcAlpha:e.ZeroFactor,blendDstAlpha:e.OneFactor}),g=new e.Mesh(n,l);return g.frustumCulled=!1,g.renderOrder=5,g}async function Ie(t,o={}){const a=t.rng.fork("ns-hero"),s=t.quality&&t.quality.detail||1,d=Ne(a.fork("look"),o.look||{}),i=Ae(d,a.fork("sky")),n=a.fork("craft"),l=new e.Group,g=new e.Group,u=new e.Group;l.add(u),l.add(g),u.add(Re(i)),await t.yield();const f={uEye:{value:new e.Vector3(0,0,100)},uTime:i.uNsTime,uBurst:{value:-1},uShed:{value:.5},uFlash:{value:new e.Vector4(1,1,1,0)},uPx:{value:new e.Vector2(1280,720)}},p=[],x=[],R=[];for(let r=0;r<14;r++)x.push(n.range(54,72)),R.push(n.range(7,11));const c=[];for(let r=0;r<14;r++)c.push(r===0?150:Math.max(x[(r+13)%14],x[r])+2);const h={uSeamEnd:{value:c},uRibL:{value:x},uRibW:{value:R.map(r=>r/2)}},m=Fe(i,f,d,h);g.add(m.back,m.front),await t.yield(),g.add(Se(i,f)),await t.yield();const b=De(i,f,d,x,R,n);g.add(b),await t.yield();const N=Math.max(200,Math.round(3e3*s)),k=new Float32Array(N*4),y=new Float32Array(N*4);for(let r=0;r<N;r++){let v=0,w=0;for(let E=0;E<6;E++){v=n()*Math.PI*2,w=n.range(118,168),j(w,z);const C=Math.hypot(1,z[1]),Z=(Math.sin(v)*I.x+Math.cos(v)*I.z-z[1]*I.y)/C;if(n()<.5+.5*(1-ue(-.35,.35,Z)))break}k[r*4]=v,k[r*4+1]=w,k[r*4+2]=ie(w)+.3+1.5*n(),k[r*4+3]=n(),y[r*4]=n.range(24,38),y[r*4+1]=n.range(2,3.2),y[r*4+2]=n()<.1?n.range(.16,.34):n.range(.05,.1),y[r*4+3]=n()}const T=ce(i,f,qe,k,y,{uShed:f.uShed});g.add(T),await t.yield();const q=Math.max(300,Math.round(3e3*s)),L=new Float32Array(q*4),P=new Float32Array(q*4);for(let r=0;r<q;r++){let v=0,w=3,E=0;for(let se=0;se<5&&(v=n()<.1?0:n.int(0,13),w=n.range(3,c[v]-2),E=.5+.5*Math.sin(w*.19+v*2.4),!(n()<.1+.9*E*E*E));se++);const C=ee(w),Z=j(C,z)[0],de=Math.floor((w*.19+v*2.4)/(Math.PI*2)-.25),oe=Math.sin(de*12.9898+v*78.233)*43758.5453,me=oe-Math.floor(oe);L[r*4]=v/14*Math.PI*2+n.gauss()*(v===0?3:.8)/Math.max(Z,3),L[r*4+1]=w,L[r*4+2]=Z,L[r*4+3]=C,P[r*4]=n.range(1.5,9),P[r*4+1]=n.range(5,16),P[r*4+2]=n.range(.06,.2),P[r*4+3]=V(me*.94+.03+n.range(-.025,.025),0,1)}const W=ce(i,f,Ce,L,P,{uBurst:f.uBurst});W.visible=!1,g.add(W),await t.yield(),p.push({update(){const r=f.uBurst.value>0;b.visible=r,W.visible=r}});const J=O.map(r=>({t:r[0],position:[0,r[2],r[1]],pitch:r[3],heading:r[4]})),Y={apex:[0,60,0],crown:[0,190,0],portal:U.slice(),lineFrom:G.slice(),lineDir:Q.slice(),moonDir:[I.x,I.y,I.z],poses:J,burstAt:30.8,tearSpeed:16},D=new e.Matrix4,S=new e.Vector3,A=new e.Vector2;function _(r,v,w){l.updateWorldMatrix(!0,!1),D.copy(l.matrixWorld).invert(),S.setFromMatrixPosition(w.matrixWorld).applyMatrix4(D),u.position.copy(S),f.uEye.value.copy(S),i.uNsTime.value=v,t.renderer&&(t.renderer.getDrawingBufferSize(A),f.uPx.value.copy(A));for(const E of p)E.update&&E.update(r,v)}const K={object:l,craft:g,sky:u,skyUniforms:i,look:d,anchors:Y,radiusAt:ie,setBurst(r){f.uBurst.value=+r||0},setShed(r){f.uShed.value=V(+r||0,0,1)},setFlash(r,v){if(f.uFlash.value.w=V(+r||0,0,1),v!=null){const w=v.isColor?v:be.set(v);f.uFlash.value.x=w.r,f.uFlash.value.y=w.g,f.uFlash.value.z=w.b}},flight:(r,v=new e.Vector3,w=new e.Quaternion)=>(ye(r,v,w),{position:v,quaternion:w}),update:_,dispose(){const r=new Set;l.traverse(v=>{for(const w of[v.geometry,v.material])if(w&&!r.has(w)){if(r.add(w),w.uniforms)for(const E in w.uniforms){const C=w.uniforms[E]&&w.uniforms[E].value;C&&C.isTexture&&C.dispose()}w.dispose()}})},radius:70,height:130,center:new e.Vector3(0,125,0),ground:!1,groundY:0};return l.userData.nightShining=K,K}export{$ as SKY_GLSL,Ie as buildHero,ie as radiusAt};
