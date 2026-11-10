import*as t from"three";import{mergeGeometries as X}from"three/addons/utils/BufferGeometryUtils.js";import*as U from"../kit/core.js";const we=["#DED6C4","#77746E","#262421","#F3EFE4","#16B3AE","#5A2A9C","#0F9B58"],V={turquoise:["#0C7C82","#16B3AE","#7FE0D6"],violet:["#36156A","#5A2A9C","#A27FE0"],emerald:["#076B3C","#0F9B58","#6FD79C"]},Q=new t.Vector3(.66,.72,.21).normalize(),ve=new t.Vector3(-Math.sin(25*Math.PI/180),0,-Math.cos(25*Math.PI/180)),le=[[-70,9,-260],[-70,14,-159],[-90,21,-85],[-100,30,0],[-91,39,68],[-70,45,121],[-62,62,200]],k={ringR:190,ribbons:98,bayNearWidth:22,bayFarWidth:40,collarR:16,collarY:150,towerH:170,footW:4,topW:1,bayNear:[-70,14,-159],bayFar:[-70,45,121]},Z=`
uniform vec3 uCard, uGraphite, uCharcoal, uChalk;
uniform vec3 uLightDir, uWindDir;
uniform float uTime, uWind, uPencil;
uniform vec3 uConePos;
uniform vec4 uConeBays;
uniform vec2 uConeN;    // ribbons in the port arc and in the starboard arc
uniform vec4 uField;    // the sown field: half width (x), z0, z1, strength of its contact shade (0 = none)
uniform vec4 uBannerC;  // the banner's contact shade: half width, length of the cloth, height of the hoist, strength (0 = none)
uniform vec4 uBannerO;  // the banner's line in plan: the hoist's centre (x, z) and the way it streams (x, z)
float sw_h11(float n){ return fract(sin(n * 127.1 + 1.7) * 43758.5453); }
float sw_h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float sw_h31(vec3 p){ p = fract(p * vec3(.1031, .1030, .0973)); p += dot(p, p.yzx + 33.33); return fract((p.x + p.y) * p.z); }
float sw_vn2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(sw_h21(i), sw_h21(i + vec2(1., 0.)), f.x), mix(sw_h21(i + vec2(0., 1.)), sw_h21(i + vec2(1., 1.)), f.x), f.y); }
float sw_vn3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  float a = mix(sw_h31(i), sw_h31(i + vec3(1., 0., 0.)), f.x), b = mix(sw_h31(i + vec3(0., 1., 0.)), sw_h31(i + vec3(1., 1., 0.)), f.x);
  float c = mix(sw_h31(i + vec3(0., 0., 1.)), sw_h31(i + vec3(1., 0., 1.)), f.x), d = mix(sw_h31(i + vec3(0., 1., 1.)), sw_h31(i + vec3(1., 1., 1.)), f.x);
  return mix(mix(a, b, f.y), mix(c, d, f.y), f.z); }
float sw_fbm2(vec2 p){ return sw_vn2(p) * .55 + sw_vn2(p * 2.13 + 7.1) * .3 + sw_vn2(p * 4.7 + 3.3) * .15; }
// pixel footprint in metres of a world position (filter by the pixel's footprint: lawful)
float sw_foot(vec3 P){ vec3 d = fwidth(P); return max(max(d.x, max(d.y, d.z)), 1e-5); }
// the pixel's SHORT side on the surface, in metres: it grows with distance alone, whatever the angle the surface is seen at
float sw_short(vec3 P){
  vec3 dx = dFdx(P), dy = dFdy(P);
  float A = dot(dx, dx), B = dot(dx, dy), C = dot(dy, dy);
  return sqrt(max(.5 * (A + C - sqrt(max((A - C) * (A - C) + 4. * B * B, 0.))), 1e-10));
}
// CARD TOOTH: grain with a place in the world, about three pixels across at any distance, 0..1
float sw_tooth(vec3 P, float fw){
  float l = log2(max(fw * 2.6, 1e-5)), l0 = floor(l), f = l - l0;
  float s0 = exp2(-l0);
  return mix(sw_vn3(P * s0), sw_vn3(P * s0 * .5 + 11.3), f);
}
// one set of parallel pencil strokes. c = metres across the strokes, a = metres along them, fwc = fwidth(c),
// t = tone wanted 0..1. Returns graphite coverage 0..1.
// A stroke runs 14 to 60 times its spacing before the hand lifts; it presses in the middle and lifts to nothing at
// both ends (its width and its weight taper over the last third of each end), and its weight breathes along its length.
float sw_strokes(float c, float a, float fwc, float period, float t){
  float x = c / period + .22 * (sw_vn2(vec2(a * .035, c * .13) / period) - .5);
  float id = floor(x), f = abs(fract(x) - .5);
  float r1 = sw_h11(id * 1.37 + period * 17.), r2 = sw_h11(id * 2.11 + period * 5.);
  float seg = a / (period * (14. + 46. * r2 * r2)) + r1 * 9.;
  float hl = .3 + .19 * sw_h11(id * 3.3 + floor(seg) * 1.9);
  float gap = 1. - smoothstep(hl * .42, hl, abs(fract(seg) - .5));          // the taper: 1 in the middle, 0 at the lifted ends
  float press = (.6 + .4 * sw_vn2(vec2(a / (period * 14.) + r2 * 31., id * .7))) * (.35 + .65 * gap);
  float want = clamp(t * 1.5 + .1, 0., 1.);
  float present = smoothstep(want + .02, want - .02, r2) * smoothstep(0., .3, gap);
  float px = period / max(fwc, 1e-5);
  float w = clamp(mix(.16, .42, t) * press, 1.15 / px, 3.2 / px);      // a stroke is 2 to 4 pixels wide in its middle, near or far
  float aa = .8 / px;
  float line = (1. - smoothstep(w * .5 - aa, w * .5 + aa, f)) * present * (.5 + .5 * press);
  float avg = mix(.2, .5, t) * want * .9;
  return mix(avg, line, smoothstep(2.5, 4.5, px));
}
// strokes at the drawing's own scale: of the stroke spacings 0.0625, 0.25, 1, 4, 16 and 64 m the two that stand about
// (and 256 m on a slope seen at a low angle) 7 and 28 pixels apart are drawn and cross-faded by the pixel's footprint (fc = fwidth of the across coordinate), so
// near ground and a flank a kilometre off are both hatched by the same hand; a spacing under 3 pixels has faded into
// its flat average.
float sw_hatchSet(float c, float a, float fc, float t){
  float lv = clamp(log2(max(fc, 1e-6) * 7.) * .5, -2., 3.999);
  float i0 = floor(lv), fr = lv - i0;
  float p0 = exp2(2. * i0), p1 = p0 * 4.;
  float wf = 1. - smoothstep(.5, 1., fr), wc = smoothstep(0., .5, fr);
  float h0 = sw_strokes(c, a, fc, p0, t);
  float h1 = sw_strokes(c, a, fc, p1, t);
  return max(h0 * wf, h1 * wc);
}
// HATCHING: ONE set of parallel strokes at one fixed diagonal (60 degrees to the course on level ground). A stroke is
// where an upright plane across that diagonal cuts the surface, so the strokes are parallel in plan and draped over the
// form: one direction across a whole flank, with no kink where the surface turns from facet to facet. Laid in patches
// (dense beside nearly bare). t = the half tone wanted. A second set, 30 degrees off the
// first, crosses it only where x says so: x is the contact shade under a cloth and nothing else, so no hillside is ever
// a lattice. With distance the strokes thin and at last leave one flat tone.
// ON THE HORN (sw_hornK 1, set by the card material from a vertex attribute that rises smoothly from the valley floor)
// the cutting planes lean over: they hold the line of sight of the valley (between the entry's and the last run's), so
// from the field and from beside the banner every stroke on every face of the peak lies at the hand's one slant,
// rising to the right, instead of running down the fall lines to meet at the summit.
float sw_hornK = 0.;
float sw_hatch(vec3 P, vec3 N, float t, float x){
  const vec3 d1 = vec3(.5, 0., -.866), e1 = vec3(.866, 0., .5);
  const vec3 d2 = vec3(.866, 0., -.5), e2 = vec3(.5, 0., .866);
  const vec3 dS = vec3(.585, .767, -.263), eS = vec3(-.7, .64, .31);
  // ON THE OPEN LAND THE HATCH IS LAID IN PATCHES OF THREE SLANTS (the twelfth review), 17 degrees apart, each patch
  // fading out toward its neighbours, so the strokes of a wide level floor never all run to one vanishing point
  float pq = sw_vn2(P.xz * .016 + 13.) * 3., pk = floor(pq), pf = pq - pk, land = 1. - sw_hornK;
  float rot = (pk - 1.) * .3 * land, patchW = mix(1., smoothstep(0., .16, pf) * smoothstep(1., .84, pf), land);
  float cl = dot(P, d1), al = dot(P, e1);
  float c1 = mix(cl * cos(rot) + al * sin(rot), dot(P, dS), sw_hornK), a1 = mix(al * cos(rot) - cl * sin(rot), dot(P, eS) - .35 * P.y, sw_hornK), c2 = dot(P, d2), a2 = dot(P, e2);
  vec3 dn = mix(d1, dS, sw_hornK); dn = dn / max(length(dn), 1e-4);
  // the hand's angle drifts a few degrees from patch to patch
  c1 += 2.2 * (sw_vn2(P.xz * .021) - .5);
  c2 += 2.2 * (sw_vn2(P.xz * .017 + 31.) - .5);
  float f1 = max(fwidth(c1), 1e-5), f2 = max(fwidth(c2), 1e-5);
  float flat1 = smoothstep(.97, .85, abs(dot(N, dn)));
  float pm = sw_vn2(P.xz * .035 + P.y * .02 + 7.);
  a1 += .35 * P.y;                                    // a stroke running down a steep face is still measured along its length
  float tp = clamp(t * (.3 + 1.4 * smoothstep(.25, .6, pm)), 0., 1.) * patchW;
  float avg = mix(.2, .5, tp) * clamp(tp * 1.5 + .1, 0., 1.) * .9;
  float h = mix(avg, sw_hatchSet(c1, a1, f1, tp), flat1);
  float hx = mix(.2, sw_hatchSet(c2, a2, f2, x * .8), smoothstep(.97, .85, abs(dot(N, d2))));
  h = max(h, hx * x);
  // depth is pressure: the strokes give way to their flat tone by the pixel's SHORT side on the surface (its footprint,
  // which grows with distance alone), not by its long side, so a slope seen at a low angle a few hundred metres off is
  // still hatched, at a wider spacing, while beyond about 1,400 m only the flat tone is left
  return clamp(mix(h, max(avg, .3 * x), max(smoothstep(3., 4.6, sw_short(P)), smoothstep(30., 60., f1))), 0., 1.);
}
// CHALK is laid in strokes too: broad ones at an angle of their own, the widest the pixel can hold, with card and pencil
// left between them. Returns the share of the chalk wanted that lies here, .3 to 1.
float sw_chalkStrokes(vec3 P){
  const vec3 d3 = vec3(.31, .2, .93), e3 = vec3(.95, 0., -.31);
  float c = dot(P, d3) + 3. * (sw_vn2(P.xz * .013 + 5.) - .5), a = dot(P, e3);
  // the pixel's short side on the ground: the same on every facet at one distance, so a touch runs on across facets
  vec3 dx = dFdx(P), dy = dFdy(P);
  float A = dot(dx, dx), B = dot(dx, dy), C = dot(dy, dy);
  float fm = sqrt(max(.5 * (A + C - sqrt((A - C) * (A - C) + 4. * B * B)), 1e-10));
  float fc = max(fwidth(c), 1e-5);
  // touches 3 to 6 pixels wide and some ten times as long, at the two sizes the pixel can hold; an even tone where a
  // slope seen edge on would crowd them
  float lv = log2(fm * 3.2), i0 = floor(lv), fr = lv - i0, p0 = exp2(i0), p1 = p0 * 2.;
  float n0 = sw_vn2(vec2(c / p0, a / (p0 * 11.) + 3.)), n1 = sw_vn2(vec2(c / p1 + 5., a / (p1 * 11.)));
  float k = smoothstep(.33, .55, mix(n0, n1, smoothstep(.15, .85, fr)));
  return .3 + .7 * mix(k, .5, smoothstep(.45, 1.1, fc / p0));
}
// lay pencil, then charcoal, then chalk on the card. All amounts 0..1. Depth is pressure: fw thins the pencil.
vec3 sw_draw(vec3 P, float fw, float pencil, float charcoal, float chalk){
  float th = sw_tooth(P, fw);
  vec3 col = uCard * (1. + (th - .5) * .05);
  float far = 1. - .55 * smoothstep(1.4, 4., fw);
  col = mix(col, uGraphite, clamp(pencil * uPencil * far * (.72 + .5 * th), 0., 1.));
  // the cores of the stumped masses are pressed solid and hold at any distance (Q2: real darks); their fringes thin
  float core = smoothstep(.6, .92, charcoal);
  float smudge = charcoal * (.82 + .3 * sw_vn3(P * .05)) * (1. - .3 * smoothstep(4., 9., fw) * (1. - core));
  col = mix(col, uCharcoal, clamp(smudge * mix(.6 + .55 * th, .95 + .1 * th, core) + .1 * core, 0., 1.));   // the pressed cores reach the charcoal itself
  col = mix(col, uChalk, clamp(chalk * (.45 + .8 * th), 0., 1.));
  return col;
}
// A TONE LAID IN STROKES (the squall, the land's and the tower's charcoal): cw is the place across the strokes in stroke
// pitches, fcw the pixel's footprint in the same measure (a slope across neighbouring pixels: lawful), k how far the
// tone stands over its threshold (0 at the stroke's point, 1 where it has its full width), full that width as a share
// of the stroke's pitch (over 1: neighbouring strokes close up solid). Under some three pixels to a stroke it gives
// way to its flat average.
float sw_laidE(float cw, float fcw, float k, float full, float soft){
  float f = abs(fract(cw) - .5) * 2., duty = clamp(k, 0., 1.) * full, e = clamp(soft * fcw, .02, 1.);
  return (1. - smoothstep(duty - e, duty + e, f)) * clamp(duty / e, 0., 1.);
}
float sw_laid(float cw, float fcw, float k, float full){ return sw_laidE(cw, fcw, k, full, 2.); }
// a charcoal mass laid in strokes of pitch p (metres across, c; a along them): the tone cT is read ONCE FOR EACH STROKE,
// on its own centre line (carried there by slope, the tone's own fall across the strokes, taken across neighbouring
// pixels), so the mass ends where its strokes end, each at a place of its own and tapering to a point. x: the open
// tone (strokes with card between them), y: the pressed core (strokes closed up until only a hair of card is left
// between some of them: sw_coreFull is the pressed stroke's width as a share of its pitch).
float sw_coreFull = .93;
vec2 sw_laidMass(float c, float a, float fc, float p, float cT, float slope){
  float cw = c / p, ci = floor(cw), hs = sw_h11(ci * 1.7 + p * 3.1);
  float n = cT + clamp(slope * (ci + .5 - cw) * p, -.3, .3) + .1 * (hs - .5) + .12 * (sw_vn2(vec2(ci * 3.7 + p, a / (p * 9.))) - .5);
  return vec2(sw_laidE(cw, fc / p, (n - .34) / .14, .56 + .28 * hs, 1.1), sw_laidE(cw, fc / p, (n - .62) / .1, sw_coreFull + .1 * hs, 1.1));
}
// CONTACT SHADE under the sown field (a soft edgeless smudge, heavier along the drilled rows) and under the banner
// (fainter the further the cloth flies above the land), by place, never cast.
float sw_fieldContact(vec3 P){
  float e = min(min(P.x + uField.x, uField.x - P.x), min(P.z - uField.y, uField.z - P.z));
  float edge = smoothstep(-.6, 1.6, e + 1.2 * (sw_vn2(P.xz * .31) - .5));
  edge *= .3 + .7 * smoothstep(uField.y + 10., uField.y + 170., P.z);      // the far end is drilled but not yet sown: furrows, little shade
  edge *= (.2 + .8 * smoothstep(4., 70., uField.x - abs(P.x))) * (.25 + .75 * smoothstep(2., 46., uField.z - P.z));   // the sides and the cone's end fray out pass by pass
  float fx = max(fwidth(P.x), 1e-5);
  float row = abs(fract(P.x / 1.1) - .5) * 1.1;
  float band = 1. - smoothstep(.12, .5, row);
  band = mix(.42, band, smoothstep(2.5, 5., 1.1 / fx));
  float leeE = -(P.x + uField.x);                    // metres outside the starboard edge
  // the lee band: 16 to 30 m wide by place; from high off it thins to a light tone (the pixel's size on the ground:
  // lawful), never a black wedge
  float fpl = max(max(fwidth(P.x), fwidth(P.z)), 1e-4);
  float leeB = step(0., leeE) * (1. - smoothstep(2. + 2. * min(fpl, .5), 16. + 8. * sw_vn2(P.xz * .05) + 8. * min(fpl, .5), leeE)) * smoothstep(-6., 4., min(P.z - uField.y, uField.z - P.z));
  return max(edge * (.5 + .42 * band) * (.85 + .3 * sw_vn2(P.xz * .07)), mix(.8, .3, smoothstep(.35, 1.1, fpl)) * leeB);
}
float sw_bannerHem = 0.;      // set by sw_bannerContact: the band of shade beside the port hem where the cloth passes close over the land
float sw_bannerGap = 0.;      // set by sw_bannerContact: metres from the land here up to the cloth's own line
float sw_bannerNarrow = 0.;   // set before the call: 1 on the horn, where the shade is a little narrower than the cloth
float sw_bannerContact(vec3 P){
  vec2 q = P.xz - uBannerO.xy;
  float s = dot(q, uBannerO.zw), x = dot(q, vec2(uBannerO.w, -uBannerO.z));
  float bq = max(s, 0.);
  // the cloth's own line (bannerY in the world): all but level for 80 m off the ring, the pour to 403 m, then all but level
  float by = uBannerC.z - .55 * (22. * log(1. + exp(min((bq - 80.) / 22., 20.))) - .572 - 22. * log(1. + exp(min((bq - 403.) / 22., 20.)))) - .012 * bq;
  x -= 24.3 * (log(1. + exp(min((bq - 640.) / 90., 20.))) - .000816);   // the cloth's swing to starboard past the cone (bannerLX in the world)
  float gap = max(by - P.y, 0.);
  sw_bannerGap = gap;
  float w = uBannerC.x * (1. - .4 * smoothstep(0., uBannerC.y, s));
  w *= 1. - .15 * sw_bannerNarrow;
  float lat = 1. - smoothstep(w * .8, w * 1.3 + gap * .04, abs(x - .06 * gap + (sw_vn2(P.xz * .02) - .5) * 14.));      // as wide as the cloth, and a little beyond each hem
  // (past the cone the cloth's far third flies thin and high and its shade is a light broken tone: the headland and
  // the cone's floor keep their card)
  float along = smoothstep(-4., 12., s) * (1. - smoothstep(uBannerC.y - 40., uBannerC.y + 30., s)) * (1. - .7 * smoothstep(520., 660., s));
  // BESIDE THE PORT HEM, where the cloth passes close over the land (the pour over the horn's snow), a band of shade
  // nine metres wide lies on the land just outside the cloth, broken along its length: the cloth is seen to hang over
  // the mountain, not to lie on it
  float w0 = uBannerC.x * (1. - .4 * smoothstep(0., uBannerC.y, s)) * (.55 + .45 * smoothstep(40., 260., s));
  sw_bannerHem = (1. - smoothstep(30., 90., gap)) * smoothstep(w0 - 5., w0 - 1., -x) * (1. - smoothstep(w0 + 5., w0 + 11., -x + (sw_vn2(P.xz * .09) - .5) * 5.))
    * smoothstep(.22, .42, sw_vn2(vec2(s * .045, 7.))) * along;
  // the shade is drawn, not cast: it keeps its weight however high the cloth flies (a little lighter under the far cloth)
  return lat * along * mix(1., .86, smoothstep(140., 420., gap));
}
// CONTACT SHADE of the ribbon cone on level ground, by place (never cast): 0..1 at world position P.
float sw_coneContact(vec3 P){
  vec2 q = P.xz - uConePos.xz;
  float r = length(q);
  float ang = (r > 1e-3) ? atan(q.y, q.x) : 0.;
  // two arcs of evenly spaced stakes between the bays: uConeBays = (first angle, span) of the port arc, then of the starboard arc
  float stA = uConeBays.y / max(uConeN.x - 1., 1.), stB = uConeBays.w / max(uConeN.y - 1., 1.);
  float xa = (mod(ang - uConeBays.x + .03, 6.2831853) - .03) / max(stA, 1e-4);
  float xb = (mod(ang - uConeBays.z + .03, 6.2831853) - .03) / max(stB, 1e-4);
  float inA = step(xa, uConeN.x - .5), inB = (1. - inA) * step(xb, uConeN.y - .5);
  float sl = mix(xb, xa, inA), n = mix(uConeN.y - 1., uConeN.x - 1., inA), st = mix(stB, stA, inA);
  float id = clamp(floor(sl + .5), 0., n);
  float bay = max(inA, inB);
  float lat = abs(sl - id) * r * st;
  float k = clamp((${k.ringR.toFixed(1)} - r) / 174., 0., 1.);
  float h = k * 150.;
  // under each ribbon ONE SHORT BAND of rubbed shade (the twelfth review): the ribbon's own width, begun at its stake
  // and lifting some 25 m in, where the cloth has climbed out of reach of the ground; torn at the edges, pressed
  // unevenly and broken along its length, each of a weight of its own. Nothing runs on in to the tower's foot.
  float hw = mix(2.2, 1.3, clamp(h / 30., 0., 1.));
  float torn = lat + (sw_vn2(vec2(r * .35, id * 7.1)) - .5) * 1.3;
  float s = (1. - smoothstep(hw * .55, hw + .7, torn)) * exp(-h / 11.) * smoothstep(-6., 1., ${k.ringR.toFixed(1)} - r - 2.) * step(r, ${k.ringR.toFixed(1)} + 1.5);
  s *= (.6 + .4 * sw_vn2(vec2(r * .09, id * 3.3))) * smoothstep(.16, .4, sw_vn2(vec2(r * .07 + id, id * 1.7)));
  return s * (.5 + .22 * sw_h11(id + n)) * bay;
}
`,J=`
float sw_px(float depth){ return max(depth, .05) * 2. / max(projectionMatrix[1][1] * 1000., 1e-3); }
`,xe=`
${J}
attribute vec3 aTone;
attribute float aBed;
uniform float uHull;
varying vec3 vP, vN, vTone;
varying float vBed, vPx;
void main(){
  vec3 p = position;
  #ifdef USE_INSTANCING
  vec4 wp = modelMatrix * instanceMatrix * vec4(p, 1.);
  vec3 wn = mat3(modelMatrix) * mat3(instanceMatrix) * normal;
  #else
  vec4 wp = modelMatrix * vec4(p, 1.);
  vec3 wn = mat3(modelMatrix) * normal;
  #endif
  vec4 mv = viewMatrix * wp;
  // uHull > 0: this is the pencil contour, the same form pushed out along its normal by uHull thousandths of the frame
  wp.xyz += normalize(wn + vec3(0., 1e-6, 0.)) * uHull * sw_px(-mv.z);
  vP = wp.xyz; vN = wn; vTone = aTone; vBed = aBed;
  vPx = sw_px(-mv.z);      // a thousandth of the frame's height at this thing's own view depth, in metres: its NEARNESS
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,ge=`
${Z}
uniform float uHull, uContact, uLee, uBedTone, uSmudge, uMass, uRock;
uniform vec4 uRockAxis;   // the tower (rock: 1): its lean at the top (x, z) and its height
varying vec3 vP, vN, vTone;
varying float vBed, vPx;
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-6, 0.));
  float fw = sw_foot(vP);
  // THE ROCK'S STROKES LIE ON ITS WHOLE FORM (the eleventh review): on the tower the strokes' planes cut a smooth
  // leaning cone that stands for the rock (the place carried out along the radius from the tower's own axis to that
  // cone), not the stepped and jointed surface itself, so a stroke runs straight across ledges, joints and blocks and is
  // never bent into chevrons by them
  vec3 PS = vP;
  if (uRock > .5) {
    float yy = max(vP.y - uConePos.y, 0.), kA = pow(max(yy / max(uRockAxis.z, 1.), 1e-4), 1.3), sk = max(0., 1. - yy / 26.);
    vec2 axS = uConePos.xz + uRockAxis.xy * kA, qS = vP.xz - axS;
    PS.xz = axS + qS / max(length(qS), 1e-3) * (26. - 11. * clamp(yy / 150., 0., 1.) + 12. * sk * sk);
  }
  if (uHull > 0.) {  // contour: graphite of slightly uneven weight, breaking here and there
    float wgt = .78 + .22 * sw_vn3(vP * .21);
    float th = sw_tooth(vP, fw);
    gl_FragColor = vec4(mix(uCard, mix(uGraphite, uCharcoal, .4), clamp(wgt * (.8 + .4 * th), 0., 1.)), 1.);
    return;
  }
  float nl = dot(N, uLightDir);
  float lee = smoothstep(.34, -.5, nl);
  float under = smoothstep(-.05, -.75, N.y);
  // the pencil half tone: the tone baked at build, a little more on lee and under sides, thinning to bare card on the lit
  // shoulders of slopes. Its strokes are one set; the lee itself is massed in charcoal below.
  float lit = smoothstep(.35, .85, nl) * smoothstep(.985, .9, N.y);
  float mk = min(uMass, 1.), horn = step(1.5, uMass);
  sw_hornK = max(clamp(vBed, 0., 1.) * horn, uRock);      // the tower (rock: 1): every face hatched at the hand's slant, as the horn is
  float t = smoothstep(.06, .8, clamp(vTone.x * (1. - .85 * lit * mk * (1. - smoothstep(.12, .4, vTone.y))) + uLee * mix(.95 * lee + .4 * under, .45 * lee + .3 * under, mk) * (1. - horn) * (1. - .55 * uRock), 0., 1.));
  // S3: THE LAND IN THREE STEPS BY NEARNESS (land and horn, uMass over 0; vPx is the thing's own view depth through the
  // projection, lawful: see the head). NEAR (under some 750 m): crisp line, hatching, charcoal lees laid in strokes,
  // chalk. MIDDLE: firm line and light hatching on the lee sides only, the lees' charcoal strokes lifted to a pale tone. FAR (beyond some 1,600 to 2,100 m; T4: the middle ranges are inked):
  // the outline alone, no hatch, no fill, no chalk. Nothing far is dark, nothing near is pale.
  float nearK = 1. - smoothstep(.9, 1.6, vPx), farK = smoothstep(1.9, 2.5, vPx);
  t *= mix(1., mix(.75 * smoothstep(.25, -.25, nl), 1., nearK) * (1. - farK), mk);
  // the contact shade under the ribbons and under the banner is the darkest ground: hatched, CROSSED (the only crossing
  // in the drawing), then stumped
  float level = smoothstep(.5, .9, N.y);
  sw_bannerNarrow = sw_hornK * horn;
  float contactB = uContact * uBannerC.w * sw_bannerContact(vP) * smoothstep(-.25, .3, N.y), contactC = uContact * sw_coneContact(vP) * level;
  float contact = max(contactC, contactB);
  t = max(t, max(contactC * .97, contactB * .3));      // the banner's shade: a light pencil hatch one way under its rubbed charcoal (below)
  float pencil = sw_hatch(PS, N, t, smoothstep(.22, .6, contactC)) * step(.02, t);
  // on the open land the pencil lightens with distance by the pixel's short side (sw_draw lightens it by the long side,
  // which would leave every slope seen at a low angle a whisper): the long side's share is taken back out here
  pencil *= mix(1., (1. - .5 * smoothstep(3., 5., sw_short(vP))) / (1. - .55 * smoothstep(1.4, 4., fw)), mk);
  // bed lines: one pencil line at each half-integer of the bed coordinate, never under 1.5 px, flat tone when crowded
  float fb = max(fwidth(vBed), 1e-5);
  float dl = abs(fract(vBed) - .5) / fb;
  float bw = .9 + 1.3 * sw_vn3(vP * .13 + 5.);
  float bline = (1. - smoothstep(bw * .5, bw * .5 + 1., dl)) * (.45 + .55 * sw_vn3(vP * .07 + 9.)) * smoothstep(.34, .2, fb);
  // THE TOWER'S STRATA (S4, rock: 1): one firm pencil line along every bed PLANE (the ledge between two beds, at each
  // whole number of the bed coordinate), each bed's line of a weight of its own, a little uneven, broken where the hand
  // lifted; none in the middle of a bed's face
  float bedId = floor(vBed + .5), dPl = min(fract(vBed), 1. - fract(vBed)) / fb;
  float bOn = smoothstep(.2, .3, sw_vn3(vec3(vP.xz * .08, bedId * 3.7)));
  float sline = (1. - smoothstep(bw * .5 + .2, bw * .5 + 1.2, dPl)) * (.62 + .38 * sw_h11(bedId * 2.3 + 1.)) * (.8 + .2 * sw_vn3(vP * .07 + 9.)) * bOn;
  bline = mix(bline, sline, uRock);
  // T2: the tower's faces that turn toward the light are bare card (its lines and its ledges' shades draw it there)
  pencil *= 1. - uRock * mix(.9, .98, smoothstep(-.3, .2, nl));
  bline = mix(.3, bline, smoothstep(.34, .2, fb)) * uBedTone;
  pencil = max(pencil, bline);
  // charcoal: stumped lee and under sides. On the land (uMass 1) it is gathered into big edgeless masses in the lee
  // gullies, whose cores reach the charcoal itself (Q2: the card is the sheet's middle tone, not its whole range)
  float mass = smoothstep(.36, .66, sw_fbm2(vP.xz * .0062 + vP.y * .004 + 2.3));
  float charcoal = clamp(vTone.y * mix(1., .5 + .6 * mass, mk) + uLee * (lee * mix(lee * .85, (.35 + .65 * lee) * (.6 + .4 * mass), mk) + under * .35), 0., 1.);   // on the land a ridge's whole lee carries the tone, so its strokes stand together as one mass
  // R4: on the land and on the horn these masses are DRAWN, in two steps with hard torn edges: a fringe of charcoal
  // strokes at the hand's one slant with the card left between them, and a core pressed solid; far off the strokes
  // close into one flat tone
  charcoal = mix(charcoal, vTone.y, horn);            // the horn (mass: 2): its masses are laid at build, vertex by vertex
  // THE TOWER'S LEE (rock: 1; T2): hatched in open charcoal strokes; the port faces of its blocks (the joints
  // that turn toward the light) and the tops of its ledges are left bare card
  float rockLit = max(smoothstep(-.12, .38, nl) * .75, smoothstep(.3, .7, N.y));
  charcoal *= 1. - uRock * rockLit;
  // S3: no charcoal on the middle and far land. The tone itself is hardly lowered with distance (a tone lowered to its
  // threshold leaves single strokes standing apart, which read as trees): the strokes laid from it are LIFTED instead
  // (midK, below), so a middle lee is the same mass of strokes, pale, and a far one is not there
  float midK = smoothstep(1.5, 2.1, vPx) * mk;
  charcoal *= 1. - .25 * midK;
  // (the open land's own lees stay strokes with the card between them: only the horn, the rock and the contact shades
  // are pressed solid, so no hill is one closed black shape)
  charcoal = mix(charcoal, min(charcoal, .84), mk * (1. - horn));
  // T2: THE TOWER IS NOT BLACK. Its lee is hatched in open charcoal strokes with the card between them; only the
  // under sides of its ledges are pressed
  charcoal = mix(charcoal, min(charcoal, .43 + .4 * under), uRock);
  // THE BANNER'S SHADE (the twelfth review: the cloth has weight) is RUBBED: one broad band of charcoal rubbed into the
  // card under the cloth's own line, as wide as the cloth, on valley floor, hill and snow alike, mid grey under the
  // high cloth and pressed dark where the cloth passes close over the land (on the horn), torn at its edges, the
  // card's tooth through it; it keeps its weight at any distance and no chalk is laid in it. It is laid over the
  // land's own strokes (below), never as strokes of its own: long parallel strokes on a level floor run to a point.
  float nearB = max(1. - smoothstep(60., 200., sw_bannerGap), sw_hornK * horn);
  float tornB = smoothstep(.3, .42, contactB + (sw_vn2(vP.xz * .09 + 2.) - .5) * .45 + (sw_vn2(vP.xz * .31 + 9.) - .5) * .2);
  float shadeB = max(contactB * tornB, uContact * uBannerC.w * sw_bannerHem * smoothstep(-.25, .3, N.y)) * (mix(.46, .8, nearB) + .16 * sw_vn2(vP.xz * .013 + 4.));
  float keepB = smoothstep(.2, .5, shadeB);
  sw_coreFull = mix(.93, 1.25, mk);
  {
    // EVERY DARK IS LAID IN STROKES (S3, S4; the tenth review: no closed dark shape with a smooth outline): charcoal
    // strokes at the hand's one slant, three to six pixels wide at any distance (two pitches cross-faded by the
    // pixel's footprint across the strokes), the tone read once for each stroke, so a lee ends in stroke tips with
    // card between them and its core is the same strokes closed up
    float cL = mix(dot(PS, vec3(.5, 0., -.866)), dot(PS, vec3(.585, .767, -.263)), sw_hornK) + 2.2 * (sw_vn2(PS.xz * .021) - .5) + 1.7;
    float aL = mix(dot(PS, vec3(.866, 0., .5)) + .35 * PS.y, dot(PS, vec3(-.7, .64, .31)), sw_hornK) + 9.;
    float cT = charcoal + .14 * (sw_vn2(vP.xz * .028 + vP.y * .02) - .5) + .09 * (sw_vn2(vP.xz * .11 + vP.y * .07 + 5.) - .5);
    float fcL = max(fwidth(cL), 1e-5);
    vec2 gC = vec2(dFdx(cL), dFdy(cL)), gT = vec2(dFdx(cT), dFdy(cT));
    float slope = dot(gT, gC) / max(dot(gC, gC), 1e-8);
    float lv = log2(fcL * 9.), i0 = floor(lv);
    vec2 laid = mix(sw_laidMass(cL, aL, fcL, exp2(i0), cT, slope), sw_laidMass(cL, aL, fcL, exp2(i0 + 1.), cT, slope), smoothstep(.25, .75, lv - i0));
    // THE LEES ARE MASSES (the twelfth review): on land and horn the open strokes are a rubbed mid grey fringe (the
    // card's tooth through them), under them a soft rubbed tone, and the core is the same strokes pressed until they
    // close, so a lee is one dark shape with a torn edge and no stroke stands alone as a black mark
    float rub = .34 * smoothstep(.3, .6, cT);
    float laidT = mix(max(laid.x * .9, laid.y), max(max(laid.x * .5, rub), laid.y), mk);
    charcoal = mix(charcoal, laidT * (1. - midK), max(mk, uRock));
  }
  // and every ledge stays in the dark as one level line of bare card with a touch of chalk: the top of each bed, two
  // pixels and more (the bed coordinate's slope across neighbouring pixels), its weight a little uneven
  float lwB = max(mix(.07, .21, uRock), 2.2 * fb), fbed = fract(vBed);
  float ledge = uRock * (1. - smoothstep(lwB, lwB + fb, fbed)) * (.7 + .3 * sw_vn3(vP * .09 + 3.)) * smoothstep(.3, .15, fb);
  charcoal *= 1. - .94 * ledge;
  // light shades on the level ground (o.smudge): masses with a place in the world, never laid as darks
  charcoal = max(charcoal, shadeB);
  charcoal = max(charcoal, uSmudge * smoothstep(.5, .78, sw_fbm2(vP.xz * .017 + 3.7)) * smoothstep(.8, .97, N.y));
  charcoal = max(charcoal, contactC);
  charcoal = max(charcoal, uContact * uField.w * sw_fieldContact(vP) * level);
  // chalk: touches on the land. On the horn (P5) the snow is laid solid where it is whole and seen from far off (white
  // chalk pressed flat on the lit faces, so the peak is plainly a snow peak from the field); seen nearer (by the
  // pixel's footprint: under about a metre and a half of rock to the pixel) the chalk is laid in strokes over a light
  // scumble, and close to (under half a metre) it is bare card with the chalk in touches, never a white field
  float cs = sw_chalkStrokes(vP);
  float chalkFar = smoothstep(.34, .7, vTone.z) * smoothstep(.6, 1.6, fw);
  float chalkK = mix(mix(1., cs, max(mk, uRock * (1. - ledge))), mix(mix((cs - .3) * 1.3, .4 + .6 * cs, smoothstep(.08, .4, fw)), 1.25, chalkFar), horn);
  float chalkT = (1. - .96 * keepB) * max(vTone.z, uRock * max(.8 * ledge, .8 * smoothstep(.05, .5, nl)));
  gl_FragColor = vec4(sw_draw(vP, fw, pencil, charcoal, chalkT * chalkK * mix(1., 1. - .85 * farK, mk)), 1.);
}`,be=`
${J}
attribute vec3 aSize;
varying vec3 vP, vN;
varying vec2 vUv;
varying vec3 vSize;
void main(){
  #ifdef USE_INSTANCING
  vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.);
  vec3 wn = mat3(modelMatrix) * mat3(instanceMatrix) * normal;
  #else
  vec4 wp = modelMatrix * vec4(position, 1.);
  vec3 wn = mat3(modelMatrix) * normal;
  #endif
  vec4 mv = viewMatrix * wp;
  // thin parts keep at least ~1.6 thousandths of the frame: push the surface out along its normal when far
  float grow = max(0., 1.6 * sw_px(-mv.z) - aSize.z) * step(.001, aSize.z);
  wp.xyz += normalize(wn + vec3(0., 1e-6, 0.)) * grow * .5;
  vP = wp.xyz; vN = wn; vUv = uv; vSize = aSize;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,ye=`
${Z}
uniform float uChalkGlance, uHeavy;
varying vec3 vP, vN;
varying vec2 vUv;
varying vec3 vSize;
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-6, 0.));
  float fw = sw_foot(vP);
  vec3 V = cameraPosition - vP;
  V = V / max(length(V), 1e-4);
  vec2 m = min(vUv, 1. - vUv) * vSize.xy;
  float lw = max(.018, mix(1.5, 2.7, uHeavy) * fw);
  float e = min(m.x, m.y);
  float line = 1. - smoothstep(lw * .6, lw, e);
  float rim = (vSize.z > .001 && vSize.z < 900.) ? smoothstep(mix(.62, .5, uHeavy), mix(.86, .74, uHeavy), 1. - abs(dot(N, V))) : 0.;
  // a part thinner than three pixels is one pencil line
  float thin = smoothstep(3.5, 1.5, min(vSize.x, vSize.y) / fw);
  float lee = smoothstep(.2, -.5, dot(N, uLightDir));
  float tone = lee * .5 * (1. - thin);
  float pencil = max(max(line, rim) * .95, max(tone * .55, thin * .8));
  float glance = uChalkGlance * smoothstep(.75, .97, dot(N, uLightDir)) * (1. - line) * (1. - thin * .5);
  float charcoal = lee * lee * .18 * (1. - thin);
  if (uHeavy > 0.) {
    // heavy pencil (the summit steel): hatching across the shaded face at the hand's one slant, charcoal on the lee side
    // and where the outline turns from the light
    float hc = dot(vP, vec3(.61, .5, -.61));
    float hatch = sw_hatchSet(hc, dot(vP, vec3(.5, -.7, .5)), max(fwidth(hc), 1e-5), .75) * smoothstep(.05, .5, lee) * (1. - thin);
    pencil = max(pencil, hatch * .9 * uHeavy);
    charcoal = max(charcoal, uHeavy * max(.55 * lee * lee * (1. - thin), max(line, rim) * smoothstep(.1, .6, lee) * .85));
  }
  gl_FragColor = vec4(sw_draw(vP, fw, pencil, charcoal, glance), 1.);
}`,ke=`
uniform vec3 uShade, uMid, uLight;
// one pencil fold line where the fold coordinate g crosses a whole number: about 1.5 pixels wide whatever the distance,
// none on a cloth narrower than about 12 pixels (wpx = the cloth's width in pixels), none where the folds crowd closer
// than a few pixels. A slope taken across neighbouring pixels: lawful.
float sw_foldLine(float g, float wpx){
  float fg = max(fwidth(g), 1e-5);
  float d = abs(fract(g + .5) - .5) / fg;
  return (1. - smoothstep(.5, 1.15, d)) * smoothstep(12., 18., wpx) * (1. - smoothstep(.22, .45, fg));
}
// sw_streak: how strongly the long soft streaks fray the tones (1 for ribbons and blades; a very large cloth sets it lower
// before the call so its folds stay three flat tones)
float sw_streak = 1.;
// sw_wax: (the share of joins between strokes that may leave a hair of bare card, the share of the bare specks of tooth);
// (.38, 1.) for ribbons and blades; a very large cloth sets both lower before the call
vec2 sw_wax = vec2(.38, 1.);
// sw_comb: how far one wax stroke carries its tone past its neighbours (.2 for ribbons and blades: a tone edge steps a
// little from stroke to stroke). A very large cloth sets it higher, so that its tones MEET IN STROKES: along every edge
// between two tones the strokes of both run on side by side, and inside a broad tone single strokes of the next one lie.
// sw_strokeW: the strokes' width, in units of the 2 to 4 pixels of ribbons and blades.
float sw_comb = .2;
float sw_strokeW = 1.;
// sw_tip: 0 for ribbons and blades. A very large cloth seen close sets it toward 1: a stroke then carries its tone in
// its middle and lets go toward its two edges, so where its pressure falls away along its length it ends in a point,
// never on a square cut.
float sw_tip = 0.;
// sw_hemPx: the hem line's width, in units of the one-pixel line of a small cloth (a ribbon beside the eye sets it higher)
float sw_hemPx = 1.;
// one lattice of wax strokes side by side, each p cloth metres wide (x across the fall, y along it, fx = fwidth(x)).
// Returns the hair of bare card left where two neighbouring strokes fail to meet, 0..1: hair thin (one to two pixels),
// on fewer than half of the joins, and only along stretches of them. press = this stroke's pressure, .35 to 1,
// breathing along its length.
float sw_waxSet(float x, float y, float fx, float p, float seed, out float press){
  float q = x / p + .2 * (sw_vn2(vec2(y / (p * 60.), x / p * .31 + seed * 9.)) - .5);
  float id = floor(q), f = fract(q);
  press = .35 + .65 * sw_vn2(vec2(y / (p * 45.) + sw_h11(id * 1.731 + seed * 61. + p * 13.) * 17., id * .37));
  press = .68 + (press - .68) * mix(1., 1.35 * (1. - (2. * f - 1.) * (2. * f - 1.)), sw_tip);
  float e = min(f, 1. - f) * p / fx;
  float idE = f < .5 ? id : id + 1.;
  float rE = sw_h11(idE * 2.37 + seed * 29. + p * 7.);
  float open = smoothstep(.4, .56, sw_vn2(vec2(y / (p * 30.) + rE * 23., idE * .91)));
  float hw = .3 + .5 * rE;
  return (1. - smoothstep(hw, hw + .45, e)) * step(rE, sw_wax.x) * open;
}
// cl: cloth metres (x across, y along the fall); v: tone by the fold; hem: metres to the hem (99. = none);
// fold: pencil fold-line coverage 0..1 from sw_foldLine (0. = none); grain: 0..1, how much of the wax's own texture this
// cloth can carry here (0 for a cloth only a few pixels wide, which stays three flat tones)
vec3 sw_crayon(vec2 cl, float v, float hem, vec3 P, float fw, float seed, float fold, float grain){
  float fx = max(fwidth(cl.x), 1e-5), fy = max(fwidth(cl.y), 1e-5);
  // long soft streaks along the fall, three widths of them, fray the edge between two tones so it is never a contour
  float s0 = sw_vn2(vec2(cl.x * .62 + seed * 5., cl.y * .004 + 1.));
  float s1 = sw_vn2(vec2(cl.x * 2.3 + seed * 13., cl.y * .012));
  float s2 = sw_vn2(vec2(cl.x * 7.5 + seed * 7., cl.y * .03 + 3.));
  float k0 = smoothstep(2.5, 5., (1. / .62) / fx), k1 = smoothstep(2.5, 5., (1. / 2.3) / fx), k2 = smoothstep(2.5, 5., (1. / 7.5) / fx);
  float st = .5 + (s0 - .5) * .9 * k0 * (1. - .5 * k1) + (s1 - .5) * .9 * k1 * (1. - .4 * k2) + (s2 - .5) * .8 * k2;
  // THE WAX STROKES: side by side along the fall, 2 to 4 pixels wide whatever the distance (the two stroke widths the
  // pixel can hold, cross-faded by its footprint). A stroke shifts the tone a little, so tone edges step from stroke to
  // stroke; between some strokes a hair of bare card; and the card's tooth, which lives in the cloth and moves with it,
  // shows through wherever a stroke was laid lightly.
  float lv = log2(fx * 3.4 * sw_strokeW), i0 = floor(lv), fr = lv - i0, p0 = exp2(i0), p1 = p0 * 2.;
  float pr0, pr1;
  float h0 = sw_waxSet(cl.x, cl.y, fx, p0, seed, pr0), h1 = sw_waxSet(cl.x, cl.y, fx, p1, seed, pr1);
  float w1 = smoothstep(.15, .85, fr);
  float hair = mix(h0, h1, w1), press = mix(pr0, pr1, w1);
  float vv = v + (st - .5) * .44 * sw_streak + (press - .68) * sw_comb * grain;
  vec3 col = mix(uShade, uMid, smoothstep(.37, .39, vv));
  col = mix(col, uLight, smoothstep(.67, .69, vv));
  float fcl = max(fx, fy);
  // the tooth under the wax: fine, and drawn out a little along the stroke that skipped over it
  float th = sw_tooth(vec3(cl.x, cl.y * .4, seed * 91.), fcl * .55);
  // a cloth that can carry less grain has fewer bare specks and hairs, never fainter ones: only the three wax tones and
  // the card itself lie inside a cloth
  float skip = smoothstep(.02, -.02, th - mix(-.05, mix(.37, .2, press) * sw_wax.y, grain));
  // the hem is missed in places: bare card along it for a stretch
  float hw = sw_vn2(vec2(cl.y * .33 + seed * 5., seed * 3.));
  float hemMiss = (1. - smoothstep(0., max(.17, 2.5 * fw), hem - .1 * hw)) * smoothstep(.45, .55, sw_vn2(vec2(cl.y * .8, cl.x * 2. + seed)));
  col = mix(col, uCard, clamp(max(max(hair * smoothstep(.35, .5, grain), skip), hemMiss), 0., 1.));
  // the hem's pencil line, and each fold drawn once more as one thin pencil line over the wax
  float hl = (1. - smoothstep(max(.012, .6 * fw) * sw_hemPx, max(.03, 1.3 * fw) * sw_hemPx, abs(hem - .17))) * smoothstep(.5, .25, fw);
  col = mix(col, mix(uGraphite, uCharcoal, .6), clamp(max(fold * (.6 + .4 * s2), hl * min(.8 * sw_hemPx, 1.)), 0., 1.));
  return col;
}
`,ie=`
vec3 sw_ribWave(float d, float L, float a, vec4 rnd, float time, float wind){
  // the ripple grows with the height above the foot: near its stake the cloth is held and only sways
  float env = smoothstep(1., 16., d) * smoothstep(.5, 12., L - d) * mix(.42, 1., smoothstep(10., 80., d));
  float k = 6.2832 / max(rnd.y, 1.);
  float ed = .45 + .75 * abs(a);
  float ph = k * (d - 12. * time) + rnd.x + a * .55;
  float ph2 = k * 2.3 * (d - 15. * time) + rnd.x * 3.1 - a * 1.5;
  float A = rnd.w * (.55 + .45 * wind);
  float fineK = smoothstep(18., 90., d);
  float disp = env * A * (sin(ph) + .2 * ed * fineK * sin(ph2));
  float slope = env * A * k * (cos(ph) + .46 * ed * fineK * cos(ph2));
  float tw = sin(6.2832 * (d - 9. * time) / 160. + rnd.z) * .6 + sin(6.2832 * (d - 9. * time) / 71. + rnd.z * 2.7) * .4;
  // S7: NO RIBBON IS A FLAT BAR. Each turns over once or twice along its length: in a twisted stretch it comes round
  // through its own edge to show its under face (150 degrees) and back
  float twist = env * 2.6 * smoothstep(.1, .8, tw);
  return vec3(disp, slope, twist);
}
`,_e=`
${ie}
uniform float uTime, uWind;
uniform vec3 uLightDir, uWindDir;
attribute vec3 iFoot, iTop;
attribute vec4 iRnd;
attribute vec3 iW;
varying vec3 vP, vT, vB, vNn;
varying vec4 vRnd;
varying vec4 vCl;   // x across metres (ungathered), y metres along, z a, w half width here
varying vec3 vMisc; // L, sgn, seed
void main(){
  float a = position.x, s = position.y, pl = position.z;
  vec3 ch = iTop - iFoot;
  float L = max(length(ch), 1.);
  vec3 t = ch / L;
  vec3 b = normalize(cross(t, vec3(0., 1., 0.)) + vec3(1e-6, 0., 0.));
  vec3 n = cross(b, t);
  float d = s * L;
  vec3 wperp = uWindDir - t * dot(uWindDir, t);
  float arch = 4. * s * (1. - s);
  float belly = iW.z * (.8 + .2 * uWind) * (1. + .12 * sin(uTime * .37 + iRnd.x));
  vec3 base = iFoot + t * d + (vec3(0., -1.3, 0.) + wperp * belly) * arch;
  float hwFull = mix(iW.x, iW.y, s);
  float gF = smoothstep(1.5, 13., d), gT = smoothstep(.5, 5., L - d);
  float hw = hwFull * mix(.07, 1., gF) * mix(.3, 1., gT);
  vec3 w = sw_ribWave(d, L, a, iRnd, uTime, uWind);
  float lb = dot(b, uLightDir);
  float sgn = lb < 0. ? -1. : 1.;
  float cs = cos(w.z), sn = sin(w.z) * sgn;
  vec3 across = b * cs - n * sn, nrm = n * cs + b * sn;
  float cup = (1. - a * a) * .2 * hw * gF * gT;
  float zig = pl * hwFull * (.2 * (1. - gF) * smoothstep(.3, 2.5, d) + .1 * (1. - gT));
  vec3 p = base + across * (a * hw) + nrm * (w.x + cup + zig);
  vec4 wp = modelMatrix * vec4(p, 1.);
  vP = wp.xyz; vT = t; vB = b; vNn = n; vRnd = iRnd;
  vCl = vec4(a * hwFull, d, a, hw);
  vMisc = vec3(L, sgn, fract(iRnd.x * .731));
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,Me=`
${Z}
${ke}
${ie}
varying vec3 vP, vT, vB, vNn;
varying vec4 vRnd;
varying vec4 vCl;
varying vec3 vMisc;
void main(){
  float d = vCl.y, a = vCl.z, hw = vCl.w, L = vMisc.x, sgn = vMisc.y, seed = vMisc.z;
  float fw = sw_foot(vP);
  vec3 w = sw_ribWave(d, L, a, vRnd, uTime, uWind);
  float n0 = dot(vNn, uLightDir);
  float tl = dot(vT, uLightDir) < 0. ? -1. : 1.;
  float gF = smoothstep(1.5, 13., d), gT = smoothstep(.5, 5., L - d);
  // the ribbon's width in pixels (a slope across neighbouring pixels: lawful)
  float wpx = 2. / max(fwidth(a), 1e-5);
  // lengthwise folds: two or three long ones that wander down the ribbon, each with its trough in the shade tone on one
  // side of its pencil line; many more where the cloth is gathered to a fixing. The mid tone holds the rest; the slow
  // twist turns whole stretches to the light tone, and the ripple only nudges the tone.
  float g = a * 1.15 + .3 + .22 * sin(d * .031 + seed * 40.) + .09 * sin(d * .083 + seed * 17.);
  float q = fract(g);
  float gg = fract(a * 4.5 + .5) - .5;
  float gather = 1. - gF * gT;
  float twl = sin(clamp(w.z, 0., 1.5)) * max(abs(dot(vB, uLightDir)), .5) * (1. - smoothstep(1.5, 1.75, w.z));
  float back = smoothstep(1.62, 1.9, w.z);      // the under face, turned to the eye by the twist: the shade tone
  float v = .52 + .07 * n0 - .1 * w.y * tl + .46 * twl + .05 * a * sgn - .22 * smoothstep(.6, .9, q) + .06 * (1. - smoothstep(0., .22, abs(q - .28)));
  v = mix(v, .5 + gg * .62, gather);
  v = mix(v, .1 + .12 * (1. - smoothstep(0., .22, abs(q - .28))), back * (1. - gather));
  // beside the eye (60 pixels wide and more) a ribbon is drawn as one cloth: heavier fold lines, a hem line two pixels
  // wide, single strokes of the light and the shade tone lying in the mid tone with pointed ends, hairs of card between
  float near = smoothstep(55., 140., wpx);
  float fold = max(sw_foldLine(g, wpx) * (1. - gather), sw_foldLine(a * 4.5 + .5, wpx) * gather * .8) * (1. + .6 * near);
  float hem = (1. - abs(a)) * hw;
  sw_hemPx = 1. + near;
  sw_comb = mix(.2, .5, near);
  sw_tip = near;
  // a ribbon seen large (from about 25 pixels wide; beside the eye in the bays it is 60 and more) is pressed hard: the
  // wax fills the tooth, so only a few hairs and hardly a speck of bare card are left in it and it stays cloth, not
  // speckle
  sw_wax = vec2(.38, 1.) * mix(1., mix(.13, .4, near), smoothstep(22., 70., wpx));
  vec3 col = sw_crayon(vCl.xy, v, mix(99., hem, gF * gT * smoothstep(.14, .07, fw)), vP, fw, seed, fold, smoothstep(12., 40., wpx));
  // THE HEM'S OUTER EDGE (the ninth review): beside the eye the cloth's own edge is ruled too, so the hem is a doubled line
  float fh = max(fwidth(hem), 1e-4), fd = max(fwidth(d), 1e-4);
  // (S7: and from eight pixels wide every ribbon carries one pencil edge, along the hem turned from the light)
  col = mix(col, mix(uGraphite, uCharcoal, .6), (1. - smoothstep(max(.02, .8 * fh), max(.045, 1.7 * fh), hem)) * .85 * max(near, smoothstep(7., 12., wpx) * step(a * sgn, 0.)) * gF * gT);
  // eyelets along both hems, 2.4 m apart: a charcoal ring about a hole of bare card, AT ITS TRUE SIZE (S7: 17 cm
  // across) and drawn only while that is over two pixels (fe: a pixel in eyelet radii, by the footprint across the
  // hem and along the ribbon, slopes across neighbouring pixels: lawful); whole from three pixels up; no floor
  float fe = max(fh, fd) / .085, el = length(vec2(hem - .2, (fract(d / 2.4) - .5) * 2.4)) / .085;
  float eOn = (1. - smoothstep(.62, 1., fe)) * gF * gT;
  col = mix(col, uCard, (1. - smoothstep(.68 - .5 * fe, .68 + .5 * fe, el)) * .9 * eOn);
  col = mix(col, uCharcoal, (1. - smoothstep(max(.3 - .5 * fe, 0.), .5 + .5 * fe, abs(el - 1.))) * .88 * eOn);
  // lashings: crossing turns of rope over the gathered neck for 3 m at each fixing (rope is bare card between two ruled
  // pencil edges; the gathered cloth shows between the turns)
  float dn = min(d, (L - d) * 1.7);
  float neck = smoothstep(.3, .4, dn) * (1. - smoothstep(3., 3.15, dn));
  float u1 = fract(dn * 2.4 + a * .9), u2 = fract(dn * 2.4 - a * .9 + .5);
  float fr = max(fwidth(dn * 2.4), 1e-4);
  float dq = min(min(u1, 1. - u1), min(u2, 1. - u2));
  float rw = max(.2, 1.1 * fr);
  float rope = 1. - smoothstep(rw, rw + fr, dq);
  float redge = rope * smoothstep(rw - 1.6 * fr, rw - .6 * fr, dq);
  col = mix(col, mix(uCard, mix(uGraphite, uCharcoal, .3), max(redge, .12)), rope * neck);
  gl_FragColor = vec4(col, 1.);
}`;function Ae(s={}){const e=s.palette&&s.palette.length>=7?s.palette:we,l=r=>new t.Color(r),a={uCard:{value:l(e[0])},uGraphite:{value:l(e[1])},uCharcoal:{value:l(e[2])},uChalk:{value:l(e[3])},uLightDir:{value:Q.clone()},uWindDir:{value:ve.clone()},uTime:{value:0},uWind:{value:1},uPencil:{value:1},uRoute:{value:new t.Vector3},uConePos:{value:new t.Vector3},uConeBays:{value:new t.Vector4(-1.89,3.75,2.04,2.21)},uConeN:{value:new t.Vector2(61,37)},uField:{value:new t.Vector4(210,-40,380,0)},uBannerC:{value:new t.Vector4(26,700,421,0)},uBannerO:{value:new t.Vector4(0,1370,0,-1)}},n={turquoise:[l(V.turquoise[0]),l(e[4]),l(V.turquoise[2])],violet:[l(V.violet[0]),l(e[5]),l(V.violet[2])],emerald:[l(V.emerald[0]),l(e[6]),l(V.emerald[2])]},o=r=>({...a,uShade:{value:n[r][0]},uMid:{value:n[r][1]},uLight:{value:n[r][2]}});function i(r={}){return new t.ShaderMaterial({uniforms:{...a,uHull:{value:r.hull??0},uContact:{value:r.contact??0},uLee:{value:r.lee??1},uBedTone:{value:r.bedTone??0},uSmudge:{value:r.smudge??0},uMass:{value:r.mass??0},uRock:{value:r.rock??0},uRockAxis:{value:new t.Vector4(0,0,170,0)}},vertexShader:xe,fragmentShader:ge,side:r.side??t.FrontSide,fog:!1})}function c(r,u=2.6){const f=new t.Mesh(r.geometry,i({hull:u,side:t.BackSide}));return f.frustumCulled=!1,f.matrixAutoUpdate=r.matrixAutoUpdate,f.matrix.copy(r.matrix),f.position.copy(r.position),f.quaternion.copy(r.quaternion),f.scale.copy(r.scale),f}function h(r={}){return new t.ShaderMaterial({uniforms:{...a,uChalkGlance:{value:r.chalk??0},uHeavy:{value:r.heavy??0}},vertexShader:be,fragmentShader:ye,side:r.side??t.FrontSide,fog:!1})}function b(r="violet"){return new t.ShaderMaterial({uniforms:o(r),vertexShader:_e,fragmentShader:Me,side:t.DoubleSide,fog:!1})}return{palette:e,uniforms:a,crayons:n,clothUniforms:o,cardMaterial:i,outlineOf:c,ruledMaterial:h,ribbonMaterial:b}}const Pe=new t.Matrix4,he=new t.Quaternion,ee=new t.Vector3,ce=new t.Vector3,de=new t.Vector3(0,1,0);function q(s,e,l,a){const n=new t.BoxGeometry(s,e,l),o=new Float32Array(72),i=[[l,e],[l,e],[s,l],[s,l],[s,e],[s,e]];for(let c=0;c<6;c++)for(let h=0;h<4;h++)o[(c*4+h)*3]=i[c][0],o[(c*4+h)*3+1]=i[c][1],o[(c*4+h)*3+2]=0;return n.setAttribute("aSize",new t.BufferAttribute(o,3)),a&&n.applyMatrix4(a),n}function I(s,e,l,a=7,n=l){ee.copy(e).sub(s);const o=Math.max(ee.length(),.001),i=new t.CylinderGeometry(n,l,o,a,1,!1),c=i.attributes.position.count,h=new Float32Array(c*3);for(let b=0;b<c;b++)h[b*3]=1e3,h[b*3+1]=o,h[b*3+2]=Math.min(2*Math.min(l,n),800);return i.setAttribute("aSize",new t.BufferAttribute(h,3)),he.setFromUnitVectors(de,ee.multiplyScalar(1/o)),ce.copy(s).add(e).multiplyScalar(.5),i.applyMatrix4(Pe.compose(ce,he,new t.Vector3(1,1,1))),i}function te(s,e,l,a,n=96){const o=[],i=[],c=[],h=[],b=[],r=[[s+l/2,e-a/2],[s+l/2,e+a/2],[s-l/2,e+a/2],[s-l/2,e-a/2]],u=[[1,0],[0,1],[-1,0],[0,-1]],f=[a,l,a,l];for(let d=0;d<4;d++){const p=r[d],x=r[(d+1)%4],M=o.length/3;for(let S=0;S<=n;S++){const N=S/n*Math.PI*2,C=Math.cos(N),T=Math.sin(N);if(o.push(p[0]*C,p[1],p[0]*T,x[0]*C,x[1],x[0]*T),i.push(u[d][0]*C,u[d][1],u[d][0]*T,u[d][0]*C,u[d][1],u[d][0]*T),c.push(.5,0,.5,1),h.push(1e3,f[d],0,1e3,f[d],0),S<n){const F=M+S*2;b.push(F,F+1,F+2,F+1,F+3,F+2)}}}const w=new t.BufferGeometry;return w.setAttribute("position",new t.Float32BufferAttribute(o,3)),w.setAttribute("normal",new t.Float32BufferAttribute(i,3)),w.setAttribute("uv",new t.Float32BufferAttribute(c,2)),w.setAttribute("aSize",new t.Float32BufferAttribute(h,3)),w.setIndex(b),w}function Se(s){const e=k.towerH,l=-Math.PI/2-.84+s.range(-.3,.3),a=s.range(17,26),n=new t.Vector3(Math.cos(l)*a,0,Math.sin(l)*a),o=[];let i=-9;for(;i<e+30;)o.push(i),i+=s.range(2.4,7.5)*(s.chance(.2)?2:1);const c=o.map(()=>s.range(-1,1)),h=s.range(-.09,.09),b=s.range(-.05,.11),r=s.range(.9,1.08),u=s.range(96,122),f=s.range(.06,.16);return{H:e,lean:n,beds:o,setback:c,dipX:h,dipZ:b,axisAt:(p,x=new t.Vector3)=>{const M=Math.pow(Math.max(p,0)/e,1.3);return x.set(n.x*M,p,n.z*M)},profile:p=>{let x=27*r+(15-27*r)*Math.min(p/150,1);if(p<26){const M=1-p/26;x+=13*M*M+(40-27*r-13)*M*M*M}if(x*=1+f*Math.exp(-((p-u)*(p-u))/500),p>150){const M=(p-150)/(e-150);x=15*(1-.5*M)*(M>.86?1-.72*(M-.86)/.14:1)}return x}}}async function Te(s,e,l){const{H:a,beds:n,setback:o,dipX:i,dipZ:c,axisAt:h,profile:b}=e,r=s.noise,u=88,f=[];for(let y=0;y<n.length-1;y++){const v=n[y],_=n[y+1];if(_<.5||v>a-1.5)continue;const A=Math.max(v+.16,0),z=Math.min(_-.16,a-1.2),B=Math.max(0,Math.ceil((z-A)/3.8)-1);for(let m=0;m<=B+1;m++)f.push({y:A+(z-A)*m/(B+1),bed:y,f:m/(B+1)})}f.push({y:a-.5,bed:n.length-2,f:1}),f[0].y=0;const w=f.length,d=w*u+1,p=new Float32Array(d*3),x=new Float32Array(d*3),M=new Float32Array(d),S=new t.Vector3;for(let y=0;y<w;y++){const v=f[y],_=v.y;h(_,S);const A=b(_),z=o[v.bed],B=_>150?1-.45*(_-150)/20:1,m=_>153?1.9:1;for(let P=0;P<u;P++){const E=P/u*Math.PI*2,L=Math.cos(E),R=Math.sin(E),W=r.fbm3(L*1.3+4.1,R*1.3,_*.016,3),K=r.n3(L*4.6,R*4.6,v.bed*7.31),ae=Math.tanh(K*7),ue=r.n3(L*13,R*13,_*.21),se=(1-v.f)*(1-v.f);let H=A*(1+.2*W*m)+B*(z*2.3+ae*.6+ue*.06-se*1.1*(.5+.5*z));const j=Math.max(0,1-_/22);H+=j*j*(4+5*r.n3(L*2.2,R*2.2,3.3));const ne=Math.exp(-Math.pow((_-153.5)/5.2,4));H=H*(1-ne)+Math.min(H,14.3)*ne,H=Math.max(H,1.2);const G=(y*u+P)*3,me=S.x+L*H,pe=S.z+R*H;p[G]=me,p[G+2]=pe,p[G+1]=Math.max(0,_-(L*H*i+R*H*c)*Math.min(1,_/14));const re=(L*Q.x+.3*Q.y+R*Q.z)/1.044,Y=U.smoothstep(.45,-.55,re-.25*W);x[G]=.05+Math.max(0,-.3*W)+j*.08+.72*Y,x[G+1]=Math.min(1,Math.max(0,-W-.3)*.4+.96*Y*(.4+.6*Y)+.25*se*Y*(1-j)),x[G+2]=.85*U.smoothstep(.45,.9,re+.2*W)*U.smoothstep(.1,.7,ae)*(1-j),M[y*u+P]=v.bed+v.f*.999}(y&15)===15&&await s.yield()}h(a,S),p[(d-1)*3]=S.x,p[(d-1)*3+1]=a+1.4,p[(d-1)*3+2]=S.z,x[(d-1)*3]=.1,M[d-1]=n.length-1.001;const N=[];for(let y=0;y<w-1;y++)for(let v=0;v<u;v++){const _=y*u+v,A=y*u+(v+1)%u,z=_+u,B=A+u;N.push(_,z,A,A,z,B)}for(let y=0;y<u;y++)N.push((w-1)*u+y,d-1,(w-1)*u+(y+1)%u);const C=new t.BufferGeometry;C.setAttribute("position",new t.BufferAttribute(p,3)),C.setAttribute("aTone",new t.BufferAttribute(x,3)),C.setAttribute("aBed",new t.BufferAttribute(M,1)),C.setIndex(N),await s.yield(),C.computeVertexNormals(),await s.yield();const T=C.attributes.normal.array;for(let y=0;y<d;y++)x[y*3]=Math.max(0,x[y*3]-.5*U.smoothstep(.35,.85,T[y*3+1])*(1-x[y*3+1]));const F=new t.Mesh(C,l.cardMaterial({bedTone:1,lee:0,rock:1}));return F.material.uniforms.uRockAxis.value.set(e.lean.x,e.lean.z,a,0),F.frustumCulled=!1,F}function Ce(s,e,l){const o=[],i=[],c=[];for(let r=0;r<=14;r++)for(let u=0;u<72;u++){const f=l*Math.pow(r/14,1.4),w=u/72*Math.PI*2,d=Math.cos(w)*f,p=Math.sin(w)*f;o.push(d,0,p);const x=s.noise.fbm2(d*.011+9,p*.011,3);i.push(.1+.5*U.smoothstep(-.15,.5,x)+.5*Math.exp(-Math.pow((f-46)/16,2))*(.5-.5*Math.cos(w)),Math.max(0,.55*Math.exp(-Math.pow((f-40)/12,2))*-Math.cos(w)),0)}for(let r=0;r<14;r++)for(let u=0;u<72;u++){const f=r*72+u,w=r*72+(u+1)%72,d=f+72,p=w+72;c.push(f,w,d,w,p,d)}const h=new t.BufferGeometry;h.setAttribute("position",new t.Float32BufferAttribute(o,3)),h.setAttribute("aTone",new t.Float32BufferAttribute(i,3)),h.setIndex(c),h.computeVertexNormals();const b=new t.Mesh(h,e.cardMaterial({contact:1,lee:0}));return b.frustumCulled=!1,b}function oe(s,e,l,a,n){const o=new t.TorusGeometry(s,e,l,a),i=o.attributes.position.count,c=new Float32Array(i*3);for(let h=0;h<i;h++)c[h*3]=1e3,c[h*3+1]=1e3,c[h*3+2]=2*e;return o.setAttribute("aSize",new t.BufferAttribute(c,3)),n&&o.applyMatrix4(n),o}const g=(s,e,l)=>new t.Vector3(s,e,l),O=(s,e,l,a=0,n=0,o=0)=>new t.Matrix4().compose(g(s,e,l),new t.Quaternion().setFromEuler(new t.Euler(a,n,o)),g(1,1,1));function Fe(s,e,l){const a=s.axisAt(k.collarY),n=k.collarR,o=[];o.push(te(n+.75,0,.38,.38,100)),o.push(te(n,2,1.2,2.6,100)),o.push(te(n-.2,7.2,.5,.5,72));const i=20,c=l.range(0,1),h=n-.2;for(let u=0;u<i;u++){const f=(u+c)/i*Math.PI*2,w=(u+c+.5)/i*Math.PI*2,d=(u+c+1)/i*Math.PI*2,p=Math.cos(f),x=Math.sin(f),M=Math.cos(w),S=Math.sin(w),N=Math.cos(d),C=Math.sin(d);o.push(I(g(p*n,3.3,x*n),g(p*h,7.2,x*h),.2,5)),o.push(I(g(p*n,3.3,x*n),g(M*h,7.2,S*h),.13,4)),o.push(I(g(M*h,7.2,S*h),g(N*n,3.3,C*n),.13,4)),o.push(I(g(p*h,7.2,x*h),g(p*8.5,15.5,x*8.5),.2,5)),o.push(q(1.3,.22,1.3,O(p*8.9,15,x*8.9,0,-f,0))),o.push(q(3.2,.5,.7,O(p*(n-1.9),.9,x*(n-1.9),0,-f,0))),o.push(q(.6,3.2,1.6,O(p*n,2,x*n,0,-f,0))),o.push(I(g(p*(n+.75),0,x*(n+.75)),g(p*n,.9,x*n),.12,4))}const b=X(o,!1);b.translate(a.x,a.y,a.z);const r=new t.Mesh(b,e.ruledMaterial({chalk:.5,side:t.DoubleSide}));return r.frustumCulled=!1,r}const D={eye:[0,.78,-.3],reach:4.6,scale:1.7};function ze(){const s=[],e=[];s.push(q(1.7,.09,1.7,O(0,.045,-.1)));for(const[n,o]of[[-.62,-.72],[.62,-.72],[-.62,.52],[.62,.52]])s.push(q(.16,.12,.16,O(n,.14,o,0,.6,0)));const l=g(0,1.25,-.62);s.push(I(g(0,-.1,.02),l,.11,6)),s.push(q(.3,.1,.3,new t.Matrix4().compose(l,new t.Quaternion().setFromUnitVectors(de,l.clone().normalize()),g(1,1,1)))),s.push(oe(.13,.03,4,6,O(D.eye[0],D.eye[1],D.eye[2]+.02,0,Math.PI/2,0)));const a=(n,o=0)=>g(o,0,n);return e.push(oe(.17,.045,4,6,O(0,0,.16,0,Math.PI/2,0))),e.push(I(a(.28),a(.62),.045,5)),e.push(q(.5,.16,.14,O(0,0,.66))),e.push(I(a(.66,.2),a(1.5,.2),.04,5)),e.push(I(a(.66,-.2),a(1.5,-.2),.04,5)),e.push(q(.2,.2,.2,O(0,0,1.08))),e.push(q(.5,.16,.14,O(0,0,1.5))),e.push(I(a(1.5),a(1.86),.045,5)),e.push(oe(.16,.042,4,6,O(0,0,1.98,0,Math.PI/2,0))),e.push(I(a(2.06,.05),a(D.reach+.3,.12),.06,5)),e.push(I(a(2.06,-.05),a(D.reach+.3,-.12),.06,5)),{ground:X(s,!1),rig:X(e,!1)}}function Ne(s,e){const l=(o,i,c)=>{const h=Math.min(Math.max((i-1.3)/(s.y-1.5),0),1);return[Math.hypot(o-h*s.x,c-h*s.z)-(k.ringR-(k.ringR-k.collarR-.75)*h),Math.atan2(c-h*s.z,o-h*s.x)]},a=[null,null,null,null];let n=null;for(let o=0;o<e.length-1;o++){const i=e[o],c=e[o+1],h=Math.max(2,Math.ceil(i.distanceTo(c)/.5));for(let b=0;b<=h;b++){const r=b/h,u=i.x+(c.x-i.x)*r,f=i.y+(c.y-i.y)*r,w=i.z+(c.z-i.z)*r,d=l(u,f,w);n&&n[0]>0&&d[0]<=0&&a[0]===null&&(a[0]=d[1],a[2]=g(u,f,w)),n&&n[0]<=0&&d[0]>0&&a[0]!==null&&a[1]===null&&(a[1]=n[1],a[3]=g(u,f,w)),n=d}}return a[0]===null&&(a[0]=l(...k.bayNear)[1],a[2]=g(...k.bayNear)),a[1]===null&&(a[1]=l(...k.bayFar)[1],a[3]=g(...k.bayFar)),a}function Be(s,e,l,a,n){const o=s.axisAt(k.collarY),i=[],[c,h,b,r]=Ne(o,a),u=n.near/2/k.ringR,f=n.far/2/k.ringR,w=T=>(T%(Math.PI*2)+Math.PI*2)%(Math.PI*2),d=c+u,p=w(h-f-d),x=h+f,M=w(c-u-x),S=[],N=Math.min(Math.max(Math.round(k.ribbons*p/(p+M)),2),k.ribbons-2),C=k.ribbons-N;for(let T=0;T<N;T++)S.push(d+p*T/(N-1));for(let T=0;T<C;T++)S.push(x+M*T/(C-1));i.bays={thN:c,thF:h,a0:d,spanA:p,b0:x,spanB:M,crossN:b,crossF:r,nA:N,nB:C};for(let T=0;T<S.length;T++){const F=S[T],y=Math.cos(F),v=Math.sin(F),_=g(y*k.ringR,0,v*k.ringR),A=g(o.x+y*(k.collarR+.75),o.y-.2,o.z+v*(k.collarR+.75)),z=g(o.x-_.x,0,o.z-_.z).normalize(),B=Math.atan2(z.x,z.z),m=D.scale*(T===0||T===S.length-1?1.8:1),P=_.clone().addScaledVector(z,D.eye[2]*m);P.y=D.eye[1]*m;const E=A.clone().sub(P).normalize(),L=P.clone().addScaledVector(E,D.reach*m);i.push({i:T,th:F,stake:_,top:A,foot:L,eye:P,dir:E,yaw:B,ks:m,rnd:[F*3+e.range(0,2.2),e.range(9,14),F*2+e.range(0,1.6),e.range(.34,.52)],belly:e.range(2,3)*l})}return i}async function Ee(s,e,l,a){const o=[0,.4,1.3,2.2,3.4,5,7,9.5,13],i=a<.8?.75:1,c=Math.round(28*i),h=Math.round(45*i);for(let m=1;m<=c;m++)o.push(13+49*m/c);for(let m=1;m<=h;m++)o.push(62+164*m/(h+1));o.push(226,228,232-2.4,232-1.2,232-.4,232);const b=5,r=o.length,u=new Float32Array(b*r*3),f=[];for(let m=0;m<r;m++)for(let P=0;P<b;P++){const E=(m*b+P)*3;u[E]=-1+2*P/(b-1),u[E+1]=o[m]/232,u[E+2]=P&1?-1:1}for(let m=0;m<r-1;m++)for(let P=0;P<b-1;P++){const E=m*b+P,L=E+1,R=E+b,W=R+1;f.push(E,L,R,L,W,R)}const w=new t.InstancedBufferGeometry;w.setAttribute("position",new t.BufferAttribute(u,3)),w.setIndex(f);const d=e.length,p=new Float32Array(d*3),x=new Float32Array(d*3),M=new Float32Array(d*4),S=new Float32Array(d*3);e.forEach((m,P)=>{m.foot.toArray(p,P*3),m.top.toArray(x,P*3),M.set(m.rnd,P*4),S[P*3]=k.footW/2,S[P*3+1]=k.topW/2,S[P*3+2]=m.belly}),w.setAttribute("iFoot",new t.InstancedBufferAttribute(p,3)),w.setAttribute("iTop",new t.InstancedBufferAttribute(x,3)),w.setAttribute("iRnd",new t.InstancedBufferAttribute(M,4)),w.setAttribute("iW",new t.InstancedBufferAttribute(S,3)),w.instanceCount=d;const N=new t.Mesh(w,l.ribbonMaterial("violet"));N.frustumCulled=!1,await s.yield();const C=ze(),T=l.ruledMaterial({chalk:.35,side:t.DoubleSide}),F=new t.InstancedMesh(C.ground,T,d),y=new t.InstancedMesh(C.rig,T,d),v=new t.Matrix4,_=new t.Quaternion,A=g(1,1,1),z=g(0,0,1),B=new t.Euler;return e.forEach((m,P)=>{A.setScalar(m.ks),F.setMatrixAt(P,v.compose(m.stake,_.setFromEuler(B.set(0,m.yaw,0)),A)),y.setMatrixAt(P,v.compose(m.eye,_.setFromUnitVectors(z,m.dir),A))}),F.frustumCulled=!1,y.frustumCulled=!1,{ribbons:N,ground:F,rig:y}}const $=24,fe=12,Le=4,Re=`
${J}
#define SWIFT_LINE ${$}
#define SWIFT_OFF ${fe.toFixed(1)}
#define SWIFT_LEAN ${Le.toFixed(1)}
uniform float uTime, uBurst, uLineN;
uniform vec3 uCentre;
uniform vec3 uLine[SWIFT_LINE];
uniform vec3 uLineT[SWIFT_LINE];
attribute vec4 iOrb;   // radius, height, phase, speed
varying float vK;
void main(){
  float r = iOrb.x * (1. + uBurst * (1.2 + fract(iOrb.z * 3.7) * 2.2)) * (1. + .22 * sin(uTime * .7 + iOrb.z * 5.));
  float ang = iOrb.z + uTime * iOrb.w / max(iOrb.x, 1.);
  float tilt = fract(iOrb.z * 1.9) * 1.2 - .6;
  vec3 c = uCentre + vec3(cos(ang) * r, iOrb.y + sin(ang * 2. + iOrb.z) * 5. + tilt * sin(ang) * 9. + uBurst * 14. * fract(iOrb.z * 7.3), sin(ang) * r);
  float bd = 1e12;
  vec3 bq = c;
  vec3 bt = vec3(0., 0., 1.);
  for (int k = 0; k < SWIFT_LINE - 1; k++) {
    if (float(k) + 1.5 < uLineN) {
      vec3 e = uLine[k + 1] - uLine[k];
      float s = clamp(dot(c - uLine[k], e) / max(dot(e, e), 1e-6), 0., 1.);
      vec3 q = uLine[k] + e * s;
      vec3 w = c - q;
      float d2 = dot(w, w);
      if (d2 < bd) { bd = d2; bq = q; bt = mix(uLineT[k], uLineT[k + 1], s); }
    }
  }
  if (bd < SWIFT_OFF * SWIFT_OFF) {
    float g = 1. - sqrt(bd) / SWIFT_OFF;
    bt = normalize(bt);
    vec3 nu = vec3(0., 1., 0.) - bt * bt.y;
    nu /= max(length(nu), 1e-4);
    vec3 w = (c - bq) + nu * (SWIFT_LEAN * g * g);
    float wl = length(w);
    c = bq + ((wl > 1e-4 && abs(dot(w, bt)) < .1 * wl) ? w / wl : nu) * SWIFT_OFF;
  }
  float dirS = iOrb.w < 0. ? -1. : 1.;
  vec3 fwd = normalize(vec3(-sin(ang), .25 * cos(ang * 2. + iOrb.z), cos(ang)) * dirS);
  vec3 sideV = normalize(cross(fwd, vec3(0., 1., 0.)));
  vec3 upV = cross(sideV, fwd);
  float flap = sin(uTime * 17. + iOrb.z * 40.) * step(.35, fract(uTime * .21 + iOrb.z));   // flicker, then glide
  vec4 mvc = viewMatrix * modelMatrix * vec4(c, 1.);
  float sc = max(1., 1.5 * sw_px(-mvc.z) / .18);
  vec3 p = c + (fwd * position.z + sideV * position.x + upV * (abs(position.x) * (.25 + .7 * flap))) * sc;
  vK = position.y;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(p, 1.);
}`,Ie=`
uniform vec3 uGraphite, uCharcoal;
varying float vK;
void main(){ gl_FragColor = vec4(mix(uCharcoal, uGraphite, vK), 1.); }`;function Oe(s,e,l,a){const n=[0,0,.42,.09,0,.05,-.09,0,.05,0,0,-.5,.06,0,.05,-.06,0,.05,.05,0,.16,.62,1,-.02,.98,1,-.42,.05,0,.16,.98,1,-.42,.2,0,0,-.05,0,.16,-.98,1,-.42,-.62,1,-.02,-.05,0,.16,-.2,0,0,-.98,1,-.42],o=new t.InstancedBufferGeometry;o.setAttribute("position",new t.Float32BufferAttribute(n,3));const i=new Float32Array(a*4);for(let r=0;r<a;r++)i[r*4]=e.range(19,46),i[r*4+1]=e.range(-9,24),i[r*4+2]=e.range(0,6.283),i[r*4+3]=e.range(13,22)*(e.chance(.8)?1:-1);o.setAttribute("iOrb",new t.InstancedBufferAttribute(i,4)),o.instanceCount=a;const c=s.uniforms,h=new t.ShaderMaterial({uniforms:{uTime:c.uTime,uGraphite:c.uGraphite,uCharcoal:c.uCharcoal,uBurst:{value:0},uCentre:{value:l.clone()},uLine:{value:new Float32Array($*3)},uLineT:{value:new Float32Array($*3)},uLineN:{value:0}},vertexShader:Re,fragmentShader:Ie,side:t.DoubleSide,fog:!1}),b=new t.Mesh(o,h);return b.frustumCulled=!1,b}async function He(s,e={}){const l=s.rng,a=e.detail??s.quality?.detail??1,n=e.wind??l.pick(["gusty","gusty","steady","gale"]),o=n==="steady"?.6:n==="gale"?1.45:1,i=e.style??Ae({palette:e.palette});i.uniforms.uWind.value=o;const c=new t.Group;c.name="sown-with-cloth:ribbon-cone";const h=Se(l);await s.yield();const b=await Te(s,h,i);c.add(b,i.outlineOf(b,3.4)),await s.yield();const r=Fe(h,i,l);c.add(r),await s.yield();const u=e.route&&e.route.length>1?e.route.map(v=>v.isVector3?v:g(v[0],v[1],v[2])):le.map(v=>g(...v)),f=Be(h,l,Math.min(o,1.2),u,{near:e.bayNearWidth??k.bayNearWidth,far:e.bayFarWidth??k.bayFarWidth});i.uniforms.uConeBays.value.set(f.bays.a0,f.bays.spanA,f.bays.b0,f.bays.spanB),i.uniforms.uConeN.value.set(f.bays.nA,f.bays.nB);const w=await Ee(s,f,i,a);c.add(w.ribbons,w.ground,w.rig),await s.yield();const d=h.axisAt(k.collarY),p=Oe(i,l,d.clone().add(g(0,6,0)),Math.round(80*a));c.add(p);let x=null,M=null;e.ground!==!1&&(x=Ce(s,i,520),c.add(x)),e.sheet!==!1&&(M=new t.Mesh(new t.SphereGeometry(2400,16,8),new t.MeshBasicMaterial({color:i.uniforms.uCard.value,side:t.BackSide,depthTest:!1,depthWrite:!1,fog:!1})),M.renderOrder=-.5,M.frustumCulled=!1,c.add(M)),await s.yield();const S={bayNear:g(...k.bayNear),bayFar:g(...k.bayFar),bayNearStake:g(Math.cos(f.bays.thN)*k.ringR,0,Math.sin(f.bays.thN)*k.ringR),bayFarStake:g(Math.cos(f.bays.thF)*k.ringR,0,Math.sin(f.bays.thF)*k.ringR),flyThrough:le.map(v=>g(...v)),bayNearCrossing:f.bays.crossN,bayFarCrossing:f.bays.crossF,collar:d.clone(),gaze:d.clone().add(g(0,-6,0)),summit:h.axisAt(k.towerH),lean:h.lean.clone(),viewpoints:[{pos:g(-70,9,-330),look:g(0,80,0)},{pos:g(-96,26,-40),look:d.clone()},{pos:g(-70,14,-168),look:g(-80,30,-60)}],portalSeat:{position:g(-60,408,770),facing:g(0,0,-1),note:"the summit ring of the banner, not on this piece"},ringR:k.ringR,stakes:f.map(v=>v.stake.clone())};let N=0;const C=i.uniforms;function T(v){N=v;const _=Math.min(Math.max((v-.355)/.02,0),1),A=Math.min(Math.max((v-.42)/.09,0),1);p.material.uniforms.uBurst.value=_*_*(3-2*_)*(1-A*A*(3-2*A))}const F={x:d.x,z:d.z,r:46*(1+1.2+2.2)*1.22,y0:d.y+6-19.4,y1:d.y+6+48.4,line:$,off:fe};function y(v){const _=p.material.uniforms,A=_.uLine.value,z=_.uLineT.value,B=v?Math.min(v.length,$):0;if(A.fill(0),z.fill(0),_.uLineN.value=0,!(B<2)){for(let m=0;m<B;m++)A[m*3]=v[m].x,A[m*3+1]=v[m].y,A[m*3+2]=v[m].z;for(let m=0;m<B;m++){const P=Math.max(m-1,0)*3,E=Math.min(m+1,B-1)*3,L=A[E]-A[P],R=A[E+1]-A[P+1],W=A[E+2]-A[P+2],K=Math.hypot(L,R,W)||1;z[m*3]=L/K,z[m*3+1]=R/K,z[m*3+2]=W/K}_.uLineN.value=B}}return{object:c,radius:k.ringR,height:k.towerH,center:g(0,78,0),anchors:S,style:i,setProgress:T,setFlownLine:y,swiftAir:F,wind:n,update(v,_,A){C.uTime.value=_,C.uConePos.value.setFromMatrixPosition(c.matrixWorld),M&&A&&M.position.setFromMatrixPosition(A.matrixWorld).sub(C.uConePos.value)},dispose(){},ground:!1,groundY:0}}export{ke as CLOTH_GLSL,k as CONE,V as CRAYON,le as FLY,Q as LIGHT_DIR,we as PALETTE,Me as RIBBON_FRAG,ie as RIBBON_GLSL,_e as RIBBON_VERT,Z as STYLE_GLSL,J as STYLE_VERT_GLSL,ve as WIND_DIR,He as buildHero,Ae as makeStyle,q as ruledBox,te as ruledRing,I as ruledTube};
