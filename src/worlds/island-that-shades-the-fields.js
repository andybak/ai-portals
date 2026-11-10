import*as C from"three";import{clamp as We,lerp as B,smoothstep as Xt}from"../kit/core.js";import{makeSky as I0,makeCloudField as T0}from"../kit/sky.js";import*as F0 from"../kit/water.js";import*as e0 from"../kit/fauna.js";import{GLSL_NOISE as pe}from"../kit/fx.js";import{buildHero as D0,makeGeo as Yt,makeFlight as _0,ISLE as E0,CAVE as o0,lawnY as a0,domeH as N0,lin as Ct,mulc as Y,mixc as Ve}from"../parts/island-that-shades-the-fields.js";const A=Math.PI*2,{R:L,Y0:je,FLOOR:Re,ADAM:ne,TOP:ht,RIM:gt,SHAFT:G,TIERS:ve,GAL_W:Oe,ROD:L0,TERRACE:Ie,COURT:Ue}=E0,B0=40,Z=_=>_.toFixed(1),Ot=`
uniform vec3 uSunDir, uSunCol, uSkyCol, uGroundCol, uFogCol; uniform float uFogK, uTime, uNight, uHand; uniform vec4 uShore;
const float ISLE_R = ${Z(L)}, ISLE_Y0 = ${Z(je)}, ISLE_RIM = ${Z(gt)};
float shoreX(float z){ return uShore.x + uShore.y * sin(z / 170. + uShore.z) + 12. * sin(z / 61. + uShore.w); }
// 1 in the sun, 0 in the island's shadow (for anything below the underside): the sun's ray is followed through the
// island's thickness and its nearest pass to the axis is measured against the island's radius
float isleSun(vec3 p){
  if (uSunDir.y < .03) return 1.;
  float t0 = max((ISLE_Y0 - p.y) / uSunDir.y, 0.), t1 = (ISLE_RIM - p.y) / uSunDir.y;
  if (t1 <= 0.) return 1.;
  vec2 a = p.xz + uSunDir.xz * t0, ab = uSunDir.xz * (t1 - t0);
  float h = clamp(-dot(a, ab) / max(dot(ab, ab), 1e-4), 0., 1.);
  return smoothstep(ISLE_R - 4., ISLE_R + 8., length(a + ab * h));
}
vec3 hazed(vec3 col, float dist){ return mix(col, uFogCol, 1. - exp(-dist * uFogK)); }
// sun and sky on a matte surface: lit 1, shade about half and blue
vec3 daylight(vec3 N, float sun){
  float k = clamp(dot(N, uSunDir), 0., 1.) * sun;
  return uSunCol * k + uSkyCol * (.55 + .45 * N.y) + uGroundCol * (.5 - .5 * N.y);
}`,Ge=`
float cloudSun(vec2 p){
  vec2 q = (p - vec2(uHand * 7., 2.7) * uTime) * .0021;
  float n = vnoise(q) * .65 + vnoise(q * 2.3 + 4.) * .35;
  return 1. - .42 * smoothstep(.5, .66, n);
}`,n0=`
vec3 landColor(vec2 p, float px){
  float di = shoreX(p.y) - uHand * p.x;
  float n1 = vnoise(p * .05), n2 = vnoise(p * .9);
  vec3 sand = mix(vec3(.62, .52, .34), vec3(.78, .68, .46), n1) * (.9 + .2 * n2 * (1. - smoothstep(.3, 2., px)));
  sand = mix(sand * .62, sand, smoothstep(0., 7., di + 2. * sin(uTime * .5 + p.y * .05)));
  vec2 q = p + vec2(fbm(p * .006) * 60., fbm(p * .006 + 7.) * 60.);
  vec3 vo = voronoi(q / 78.);
  float id = vo.z, kindf = fract(id * 7.31);
  vec3 crop = kindf < .3 ? vec3(.16, .36, .1) : kindf < .5 ? vec3(.3, .46, .12) : kindf < .7 ? vec3(.62, .5, .2) : kindf < .85 ? vec3(.34, .24, .14) : vec3(.5, .52, .22);
  float ang = fract(id * 3.7) * 3.14159;
  float fur = sin(dot(p, vec2(cos(ang), sin(ang))) * 1.6);
  crop *= .86 + .14 * fur * (1. - smoothstep(.5, 2.5, px)) + .12 * (n1 - .5);
  float hedge = 1. - smoothstep(.012, .03 + px * .01, vo.y);
  float tuft = vnoise(q * .35);
  crop = mix(crop, vec3(.05, .15, .05) * (.7 + .6 * tuft), hedge * (.55 + .45 * step(.35, tuft)));
  float lane = (1. - smoothstep(.0, .012 + px * .006, abs(vo.y - .05))) * step(.55, fract(id * 5.3));
  crop = mix(crop, vec3(.6, .54, .42), lane * .8);
  return mix(sand, crop, smoothstep(14., 26., di + (n1 - .5) * 10.));
}`,K0=`
uniform vec3 uSeaCol, uSeaDeep, uSeaShallow, uSkyHi, uSkyLo; uniform vec4 uBoats[24]; uniform sampler2D uLandMap; uniform vec4 uMapBox;
#define WTRAIN(dir, k, sp, amp) { float keep = 1. - smoothstep(.25, .8, px * k); float ph = dot(p, dir) * k + uTime * sp; h += sin(ph) * amp * keep; g += dir * cos(ph) * amp * k * keep; }
float swell(vec2 p, float px, out vec2 g){
  float h = 0.; g = vec2(0.);
  WTRAIN(vec2(.8, .6), .09, .9, 1.)
  WTRAIN(vec2(.3, .954), .17, 1.2, .55)
  WTRAIN(vec2(-.5, .866), .31, 1.7, .3)
  WTRAIN(vec2(.954, -.3), .62, 2.3, .16)
  WTRAIN(vec2(.1, .995), 1.3, 3.1, .08)
  return h / 2.1;
}
// the sea and the land as the eye would see them looking down along d from high over the point P (y = 0)
vec3 worldBelow(vec3 P, vec3 d, float px){
  float di = shoreX(P.z) - uHand * P.x, out_ = -di;
  float sun = isleSun(vec3(P.x, 0., P.z)) * cloudSun(P.xz);
  // where the mirrored ray runs shallow the swell is drawn out along it: there it is given by its mean, not in streaks
  float shallow = 1. - smoothstep(.12, .4, -d.y);
  vec2 g; float h = swell(P.xz, px, g);
  h *= 1. - .8 * shallow; g *= 1. - shallow;
  vec3 n = normalize(vec3(-g.x * .6, 1., -g.y * .6));
  float fres = pow(1. - clamp(dot(-d, n), 0., 1.), 4.);
  vec3 rr = reflect(d, n);
  vec3 skyRef = mix(uSkyLo, uSkyHi, clamp(rr.y, 0., 1.));
  vec3 lightK = uSkyCol * .7 + uSunCol * (.5 * sun * clamp(uSunDir.y + .2, 0., 1.));
  vec3 body = mix(uSeaDeep, uSeaCol, clamp(.5 + .5 * h, 0., 1.)) * lightK;
  body = mix(uSeaShallow * lightK, body, smoothstep(0., 46., out_ + 8. * vnoise(P.xz * .04)));
  vec3 sea = mix(body, skyRef, .06 + .55 * fres);
  // the sun's glitter: sparks where a pixel is smaller than a ripple, their mean light where it is larger (no streaks)
  float far = max(smoothstep(1.5, 6., px), shallow);
  // (the long swell alone would make the glitter great blots: the sparks are small, moving, and many)
  float spark = smoothstep(.7, .9, vnoise(P.xz * 2.3 + uTime * vec2(.9, .6))) * 3.5;
  sea += uSunCol * sun * pow(clamp(dot(reflect(d, vec3(0., 1., 0.)), uSunDir), 0., 1.), 40.) * mix(spark, .55, far) * 1.2;
  // white where it breaks: lines of surf walking in to the shore, the swash at the edge, a few caps outside
  float brk = vnoise(vec2(P.z * .05, out_ * .2 - uTime * .3));
  float line = smoothstep(.72, .93, fract(out_ / 13. + uTime * .11 + .25 * vnoise(vec2(P.z * .02, 3.)))) * (1. - smoothstep(6., 44., out_)) * smoothstep(.25, .6, brk) * (1. - smoothstep(3., 9., px));
  float swash = (1. - smoothstep(0., 3.5 + 2. * sin(uTime * .5 + P.z * .05), out_)) * (.5 + .5 * brk);
  // (a cap is a short broken crest, a metre or two long, where the swell stands high inside a windier patch: never a blot)
  float caps = smoothstep(.74, .9, vnoise(P.xz * .045 + vec2(uTime * .12, 0.))) * smoothstep(.45, .8, h * .5 + .5) * (1. - smoothstep(1., 6., px));
  caps *= smoothstep(.62, .8, vnoise(P.xz * vec2(.4, 1.3) + vec2(uTime * .35, 0.)));
  sea = mix(sea, vec3(.93, .96, .97) * (lightK + .15), clamp(line + swash + caps * .6, 0., 1.) * .9);
  // the boats at anchor, each as the mirror shows it: the hull and deck from over it, and the mast and sails standing
  // away from the hull along the ray's own lie (a point h metres up shows where the ray is h metres over the sea),
  // rocking as the boat rocks. s is how far the ray runs over the ground for each metre of height.
  vec2 s = d.xz / max(-d.y, 2e-3); float sl = min(length(s), 12.);
  float crisp = 1. - smoothstep(1.2, 4., px);
  for (int i = 0; i < 24; i++) {
    vec4 b = uBoats[i];
    if (b.w < .5) continue;
    vec2 rel = P.xz - b.xy; float reach = 7. + 10. * sl;
    if (dot(rel, rel) > reach * reach) continue;
    float cs = cos(b.z), sn = sin(b.z);
    vec2 q = vec2(rel.x * cs + rel.y * sn, -rel.x * sn + rel.y * cs);
    vec2 sq = vec2(s.x * cs + s.y * sn, -s.x * sn + s.y * cs);
    sq.y += .07 * sin(uTime * .9 + b.w - 1.);
    float sqn = max(length(sq), 1e-3); if (sqn > 12.) sq *= 12. / sqn;
    // hull: pointed at the bow, square at the stern; a pale deck inside the dark gunwale
    float hw = q.x < .6 ? mix(1.3, 1.65, smoothstep(-4., .6, q.x)) : 1.65 * sqrt(max(1. - (q.x - .6) * (q.x - .6) / 16.8, 0.));
    float edge = mix(-9., hw - abs(q.y), step(-4., q.x) * step(q.x, 4.7));
    float hull = smoothstep(-.5 * px, .5 * px + .05, edge), deck = smoothstep(.3, .45 + .5 * px, edge);
    vec3 bc = mix(vec3(.13, .08, .05), vec3(.55, .43, .27), deck) * lightK;
    // a ring of broken water round the hull
    float foam = (1. - smoothstep(0., 1.4, abs(edge + .5))) * step(-4.6, q.x) * step(q.x, 5.3) * (.5 + .5 * brk) * crisp;
    sea = mix(sea, vec3(.9, .94, .96) * (lightK + .15), foam * .7 * (1. - hull));
    sea = mix(sea, bc, hull);
    // the mainsail (between the mast at x 0.3 and the boom's end at x -3.5, from 2 m up to the gaff) and the jib
    float sy = abs(sq.y) < .03 ? .03 : sq.y, h = q.y / sy, xs = q.x - sq.x * h;
    float sail = step(2., h) * step(h, 8.4 - (.3 - xs) * .5) * step(-3.5, xs) * step(xs, .3);
    sail = max(sail, step(1.8, h) * step(h, 7.4 - (xs - .45) * 1.4) * step(.45, xs) * step(xs, 4.6));
    sea = mix(sea, vec3(.78, .74, .62) * (lightK + .1), sail * crisp);
    // the mast: from its foot to its top, 9 m up
    vec2 m0 = vec2(.3, 0.), mv = sq * 9., pm = q - m0;
    float tm = clamp(dot(pm, mv) / max(dot(mv, mv), 1e-3), 0., 1.);
    float dm = length(pm - mv * tm);
    sea = mix(sea, vec3(.2, .13, .08) * lightK, (1. - smoothstep(.12, .22 + px, dm)) * crisp);
  }
  vec3 land = landColor(P.xz, px);
  // the village's roofs and the trees, from the map drawn of them (canonical x across, z up the map)
  vec2 muv = (vec2(uHand * P.x, P.z) - uMapBox.xy) / uMapBox.zw;
  if (muv.x > 0. && muv.x < 1. && muv.y > 0. && muv.y < 1.) { vec4 mp = texture2D(uLandMap, muv); land = mix(land, mp.rgb, mp.a); }
  land *= uSunCol * (sun * clamp(uSunDir.y, 0., 1.)) + uSkyCol * .8;
  return mix(sea, land, smoothstep(-1., 1., di));
}`,H0=`
varying vec3 vWorld;
void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vWorld = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }`,$0=`
${pe}
${Ot}
${Ge}
${n0}
${K0}
uniform vec3 uAdam;
varying vec3 vWorld;
void main(){
  vec3 toP = vWorld - cameraPosition; float dEye = length(toP);
  vec3 V = toP / max(dEye, 1e-3);
  // the plate is a made thing: great facets (rings 44 m wide, cut into sectors about as wide), each a hair out of
  // level, so the picture breaks a little at every seam; and a bevel round the edge, 6 m wide, turned 25 degrees out
  float r = length(vWorld.xz), ring = floor(r / 44.), nSec = 6. * (ring + 1.);
  float an = atan(vWorld.z, vWorld.x) / 6.2831853 + .5, sec = floor(an * nSec);
  float dr = (.5 - abs(fract(r / 44.) - .5)) * 44., da = (.5 - abs(fract(an * nSec) - .5)) * 6.2831853 / nSec * r;
  float fid = ring * 37. + sec;
  vec2 tilt = (vec2(hash11(fid * 1.31 + 2.), hash11(fid * 2.17 + 9.)) - .5) * .014;
  vec2 out2 = vWorld.xz / max(r, 1e-3);
  float bev = smoothstep(ISLE_R - 6., ISLE_R - 5.4, r);
  vec3 n = normalize(vec3(tilt.x, -1., tilt.y) + vec3(out2.x, 0., out2.y) * bev * .47);
  vec3 d = reflect(V, n);
  d.y = -max(-d.y, 2e-3); d = normalize(d);
  float t = min(vWorld.y / -d.y, 9000.);
  vec3 P = vWorld + d * t;
  vec2 fw = fwidth(P.xz); float px = clamp(max(fw.x, fw.y), 1e-2, 1e3);
  vec3 below = worldBelow(P, d, px);
  below = hazed(below, t * .5);
  float ndv = clamp(dot(-V, n), 0., 1.);
  // light from the sea running up over the plate, where the sea straight below lies in the sun
  float a = vnoise(vWorld.xz * .11 + vec2(uTime * .22, 0.)), b = vnoise(vWorld.xz * .19 - vec2(0., uTime * .17) + 5.);
  float ripple = pow(clamp(1. - abs(a - b) * 2.4, 0., 1.), 6.) * (.3 + .7 * isleSun(vec3(vWorld.x, 0., vWorld.z)));
  vec3 col = uAdam * (.5 + .5 * uSkyCol) + below * mix(.6, .97, pow(clamp(1. - ndv, 0., 1.), 3.)) * vec3(.74, .85, 1.) + uSunCol * ripple * .05 * (1. - uNight);
  // each facet a shade of its own, and the seams: a dark line with a bright hair beside it
  float fwp = max(length(fwidth(vWorld.xz)), 1e-3), seamD = min(dr, da);
  col *= .96 + .08 * hash11(fid * 3.7 + 1.);
  col *= 1. - .35 * (1. - smoothstep(.08, .12 + fwp, seamD)) * (1. - smoothstep(.5, 2., fwp));
  col += (uSkyCol * .12 + uSunCol * .02) * (1. - smoothstep(.0, .08 + fwp, abs(seamD - .28))) * (1. - smoothstep(.4, 1.5, fwp));
  col = mix(col, col * .8 + uAdam * .3, bev * .5);
  gl_FragColor = vec4(hazed(col, dEye), 1.);
}`,Te=`
varying vec3 vWorld, vN;
void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vWorld = wp.xyz; vN = mat3(modelMatrix) * normal; gl_Position = projectionMatrix * viewMatrix * wp; }`,V0=`
${pe}
${Ot}
${Ge}
${n0}
varying vec3 vWorld, vN;
void main(){
  vec2 fw = fwidth(vWorld.xz); float px = clamp(max(fw.x, fw.y), 1e-2, 1e3);
  vec3 N = normalize(vN);
  vec3 col = landColor(vWorld.xz, px) * daylight(N, isleSun(vWorld) * cloudSun(vWorld.xz));
  col = mix(vec3(.2, .3, .3) * uSkyCol, col, smoothstep(-2.5, 0., vWorld.y));
  gl_FragColor = vec4(hazed(col, length(vWorld - cameraPosition)), 1.);
}`,s0=`
// rock, not paint: a bed's colour dulled toward the rock's own grey, mottled at two sizes, and crossed by veins of a
// paler mineral that wander over the beds (thin, a little lighter than the bed; they fade as a pixel grows past them)
vec3 rock(vec3 ore, float arc, float yy, float px){
  float g = dot(ore, vec3(.3, .5, .2)), keep = 1. - smoothstep(.3, 1.6, px);
  vec3 c = mix(ore, vec3(g) * vec3(1.05, 1., .92), .4);
  c *= .78 + .44 * fbm(vec2(arc * .09, yy * .22));
  c *= 1. - .2 * keep * (vnoise(vec2(arc * 1.3, yy * 2.1)) - .5) * 2.;
  float v = abs(fbm(vec2(arc * .035 + 7., yy * .12)) - .5), v2 = abs(fbm(vec2(arc * .05 - 3., yy * .3 + 9.)) - .5);
  float vein = max(1. - smoothstep(0., .006 + px * .012, v), .6 * (1. - smoothstep(0., .004 + px * .012, v2)));
  return mix(c, c * 1.35 + .05, vein * .5 * keep);
}
// bedded rock: courses of uneven height, each broken into blocks by joints, each block with a tone of its own; the
// fine lines fade as a pixel grows past them. Returns a tone about 1 for the place (arc and height in metres).
float strata(float arc, float yy, float px){
  float w = yy * .55 + .9 * vnoise(vec2(arc * .018, yy * .11));
  float bid = floor(w), bf = fract(w);
  float bw = 2.2 + 3.4 * hash11(bid * 1.93);
  float c = arc / bw + hash11(bid * 4.7) * 9.;
  float cid = floor(c), cf = fract(c);
  float keep = 1. - smoothstep(.25, 1.3, px);
  float tone = mix(1., .9 + .2 * hash11(bid * 7.1 + cid * 3.3), .3 + .7 * keep);
  // a bed's seam is strong or faint by the bed; only some blocks are parted from their neighbour by a joint
  float bedLine = (1. - smoothstep(0., .07 + px * .4, min(bf, 1. - bf))) * (.35 + .65 * hash11(bid * 2.9));
  float joint = (1. - smoothstep(0., .03 + px * .25 / bw, min(cf, 1. - cf))) * step(.68, hash11(bid * 5.3 + cid * 1.7));
  tone *= 1. - .34 * max(bedLine, joint * .5) * (.35 + .65 * keep);
  // relief: each bed stands out from the face by its own measure; a bed that stands out past the one over it has a
  // lit ledge along its top, a bed under one that stands out lies in its shadow near the top; blocks differ a little
  float s0 = hash11(bid * 3.37), s1 = hash11((bid + 1.) * 3.37), far = 1. - smoothstep(1.5, 6., px);
  float ledge = max(s0 - s1, 0.) * smoothstep(.78, .97, bf), shade = max(s1 - s0, 0.) * smoothstep(.35, .95, bf);
  tone *= 1. + (.55 * ledge - .6 * shade) * far;
  tone *= 1. + .12 * (hash11(bid * 1.3 + cid * 6.1) - .5) * far;
  // weather: dark stains run down the face
  tone *= .84 + .3 * vnoise(vec2(arc * .3, yy * .035 + 3.));
  return tone;
}`,j0=`
${pe}
${Ot}
${s0}
uniform vec3 uAdam, uSeaCol, uSkyHi, uSkyLo, uLie; uniform float uTiers[5];
varying vec3 vWorld, vN;
void main(){
  vec3 toP = vWorld - cameraPosition; float dEye = length(toP); vec3 V = toP / max(dEye, 1e-3);
  vec3 N = normalize(vec3(vWorld.x, 0., vWorld.z));
  float y = vWorld.y, arc = atan(vWorld.z, vWorld.x) * ISLE_R;
  vec2 fw = vec2(length(fwidth(vWorld)), 0.); float px = clamp(fw.x, 1e-2, 1e3);
  // the beds' lie: they dip across the island by the visit's draw (the same plane in the well's wall) and roll a little
  float warp = (vnoise(vec2(arc * .012, y * .04)) - .5) * 7. + sin(arc * .0045 + uLie.z) * 3.5;
  float yy = y + warp + dot(vWorld.xz, uLie.xy);
  // the galleries' shadows: each slab shades the cliff under it for as far as the sun's height carries
  float cosA = dot(N, normalize(vec3(uSunDir.x, 0., uSunDir.z) + vec3(1e-4, 0., 0.)));
  float drop = ${Z(Oe)} * uSunDir.y / max(length(uSunDir.xz) * max(cosA, .22), 1e-3);
  float sunK = 1.;
  for (int i = 0; i < 5; i++) { float top = uTiers[i] - .7; sunK *= 1. - .88 * smoothstep(top - drop - .6, top - drop + .6, y) * (1. - smoothstep(top - .2, top + .4, y)); }
  // under the turf's overhang
  sunK *= 1. - .6 * smoothstep(ISLE_RIM - 5.5, ISLE_RIM - 4., y);
  vec3 col;
  if (yy < ${Z(ne)}) {
    // adamant: tall facets, each turned a little, mirror the sky above the horizon and the sea below it
    float cell = arc / 9. + .35 * vnoise(vec2(floor(y / 37.) * 3.1, arc * .02));
    float fid = floor(cell), ff = fract(cell);
    float turn = (hash11(fid * 1.37 + floor(y / 37.) * 5.1) - .5) * .7;
    vec3 T = vec3(-N.z, 0., N.x);
    vec3 Nf = normalize(N + T * turn + vec3(0., (hash11(fid * 2.11) - .5) * .25, 0.));
    vec3 Rr = reflect(V, Nf);
    vec3 env = Rr.y > 0. ? mix(uSkyLo, uSkyHi, clamp(Rr.y * 1.4, 0., 1.)) : mix(uSkyLo * .8, uSeaCol * (uSkyCol * .8 + uSunCol * .45), clamp(-Rr.y * 3., 0., 1.));
    float ndv = clamp(dot(-V, Nf), 0., 1.);
    float seam = (1. - smoothstep(.0, .035 + px * .06, min(ff, 1. - ff))) * .5 + (1. - smoothstep(0., .4 + px, abs(fract(y / 37. + .2) - .5) * 37.)) * .35;
    env = mix(env, vec3(dot(env, vec3(.3, .4, .3))), .45) * vec3(.6, .72, .95);
    col = uAdam * daylight(Nf, sunK) * .9 + env * (.03 + .26 * pow(clamp(1. - ndv, 0., 1.), 4.));
    col += uSunCol * pow(clamp(dot(Rr, uSunDir), 0., 1.), 60.) * sunK * 1.4;
    col *= 1. - seam * .55;
    // light from the sea plays up the adamant (strongest low on the cliff, where the sea outside lies in the sun)
    // broad soft patches of light that climb the face as the swell passes below
    float ra = vnoise(vec2(arc * .045 + uTime * .1, y * .06 - uTime * .32)), rb = vnoise(vec2(arc * .09 + 5., y * .11 - uTime * .5));
    vec3 out2 = vWorld + N * 40.;
    col += uSunCol * vec3(.55, .8, 1.) * smoothstep(.42, .8, ra * .65 + rb * .35) * .1 * exp(-(y - ISLE_Y0) / 70.) * isleSun(vec3(out2.x, 0., out2.z)) * (1. - uNight);
    col = mix(col, vec3(.3, .2, .16) * daylight(N, sunK), smoothstep(${Z(ne-2)}, ${Z(ne)}, yy) * .7);
  } else {
    float b = (yy - ${Z(ne)}) / ${Z((gt-4-ne)/4)};
    float bi = floor(b), bf = fract(b);
    vec3 ore = bi < 1. ? vec3(.5, .13, .09) : bi < 2. ? vec3(.68, .42, .1) : bi < 3. ? vec3(.24, .29, .36) : vec3(.86, .83, .74);
    vec3 next = bi < 1. ? vec3(.68, .42, .1) : bi < 2. ? vec3(.24, .29, .36) : vec3(.86, .83, .74);
    ore = mix(ore, next, smoothstep(.86, 1., bf) * .5);
    ore = rock(ore, arc, yy, px) * strata(arc, yy, px);
    float turf = smoothstep(ISLE_RIM - 4.6, ISLE_RIM - 3.4, y + (vnoise(vec2(arc * .3, 2.)) - .5) * 1.5);
    ore = mix(ore, vec3(.1, .34, .08) * (.8 + .5 * vnoise(vec2(arc * .7, y * 2.))), turf);
    col = ore * daylight(N, sunK);
  }
  gl_FragColor = vec4(hazed(col, dEye), 1.);
}`,O0=`
${pe}
${Ot}
${Ge}
uniform vec4 uBasins[4];
uniform vec2 uStreet[10]; uniform vec2 uStreetDir;
varying vec3 vWorld, vN;
float segDist(vec2 p, vec2 a, vec2 b){ vec2 ab = b - a; float h = clamp(dot(p - a, ab) / max(dot(ab, ab), 1e-4), 0., 1.); return length(p - a - ab * h); }
void main(){
  vec2 p = vWorld.xz; float r = length(p);
  vec2 fw = fwidth(p); float px = clamp(max(fw.x, fw.y), 1e-2, 1e3);
  vec3 N = normalize(vN);
  float n1 = fbm(p * .035), n2 = vnoise(p * .7), n3 = vnoise(p * 4.);
  vec3 turf = mix(vec3(.04, .17, .04), vec3(.18, .38, .095), smoothstep(.25, .75, n1)) * (.82 + .28 * n2 * (1. - smoothstep(.4, 3., px)) + .2 * n3 * (1. - smoothstep(.05, .5, px)));
  // mown rings about the axis, a darker and a lighter swathe by turns (each 3.5 m wide)
  turf *= .9 + .1 * smoothstep(-.3, .3, sin(r * .9 + n1 * 2.)) * (1. - smoothstep(1., 5., px));
  // clover and dry patches
  turf = mix(turf, vec3(.3, .36, .1), .5 * smoothstep(.62, .8, vnoise(p * .021 + 11.)));
  vec3 vo = voronoi(p * 1.4);
  float daisy = smoothstep(.16, .06, vo.x) * step(.72, fract(vo.z * 9.1)) * smoothstep(.45, .7, vnoise(p * .09 + 3.)) * (1. - smoothstep(.08, .35, px));
  turf = mix(turf, vec3(.9, .9, .82), daisy);
  // the walks
  float walk = (1. - smoothstep(1.1, 1.8, abs(mod(r - 56., 26.) - 13.))) * step(60., r) * step(r, 205.);
  for (int i = 0; i < 4; i++) {
    vec4 b = uBasins[i];
    walk = max(walk, 1. - smoothstep(1.2, 2., abs(length(p - b.xy) - b.z - 4.5)));
    vec2 dir = b.xy / max(length(b.xy), 1e-3);
    walk = max(walk, (1. - smoothstep(1., 1.8, segDist(p, dir * ${Z(G+5.5)}, b.xy - dir * (b.z + 4.5)))));
    walk = max(walk, (1. - smoothstep(1., 1.8, segDist(p, b.xy + dir * (b.z + 4.5), dir * ${Z(L-9)}))) * step(length(p - b.xy), 400.));
    // the basin's stone kerb
    float kd = length(p - b.xy) - b.z;
    turf = mix(turf, vec3(.8, .77, .68) * (.85 + .3 * n3), (1. - smoothstep(.0, .5, abs(kd - .9) - .9)));
  }
  vec3 gravel = vec3(.74, .68, .54) * (.82 + .3 * vnoise(p * 6.) * (1. - smoothstep(.05, .4, px)));
  vec3 col = mix(turf, gravel, walk * .92);
  // the paved street under the bowl's line (8 m wide, from the rim's gate to the well) and the well's terrace: stone
  // slabs in courses, each its own shade, a darker kerb stone along the street's edge, and round the well a band of
  // three-cornered inlays (their pattern, cut in dark stone)
  float sd = 1e3;
  for (int i = 0; i < 9; i++) sd = min(sd, segDist(p, uStreet[i], uStreet[i + 1]));
  float court = 1. - smoothstep(${Z(G+Ie+1.6)}, ${Z(G+Ie+2)}, r), street = 1. - smoothstep(3.8, 4.1, sd);
  vec2 q = court > .5 ? vec2(atan(p.y, p.x) * 16.870424, r / 1.5) : vec2(dot(p, uStreetDir) / 1.9, dot(p, vec2(-uStreetDir.y, uStreetDir.x)) / 1.15);
  q.x += .5 * mod(floor(q.y), 2.);
  vec2 fq = fract(q), cell = floor(q);
  float fine = 1. - smoothstep(.04, .3, px), joint = (1. - smoothstep(.0, .05, min(min(fq.x, 1. - fq.x) * 1.9, min(fq.y, 1. - fq.y) * 1.15))) * fine;
  vec3 slab = vec3(.8, .77, .68) * (.86 + .2 * hash12(cell) * fine + .1 * n2) * (1. - .45 * joint);
  slab *= 1. - .3 * (1. - court) * smoothstep(3.1, 3.3, sd);
  float th = atan(p.y, p.x) * 7.639437, band = (r - ${Z(G+4.5)}) / 3.2, tw = abs(fract(th) - .5) * 2.;
  float inlay = step(0., band) * step(band, 1.) * smoothstep(-.03, .03, (1. - band) - tw) * court;
  slab = mix(slab, vec3(.2, .22, .27), inlay * .85);
  col = mix(col, slab, max(court, street));
  // the rim's parapet strip and the shaft's lip are stone
  col = mix(col, vec3(.78, .75, .66), smoothstep(${Z(L-2.2)}, ${Z(L-1.6)}, r));
  col *= daylight(N, cloudSun(p));
  gl_FragColor = vec4(hazed(col, length(vWorld - cameraPosition)), 1.);
}`,U0=`
attribute float kind;
uniform float uTime;
varying vec3 vWorld, vN, vCol; varying float vKind;
void main(){
  vec4 wp = vec4(position, 1.); vec3 n = normal;
  #ifdef USE_INSTANCING
  wp = instanceMatrix * wp; n = mat3(instanceMatrix) * n;
  #endif
  wp = modelMatrix * wp; n = mat3(modelMatrix) * n;
  if (kind > 5.5) wp.xyz += normalize(n) * (kind - 6.) * .55 * sin(uTime * 5. + wp.x * 1.3 + wp.z * 1.7 - wp.y * 2.);
  vWorld = wp.xyz; vN = n; vCol = color; vKind = kind;
  #ifdef USE_INSTANCING_COLOR
  vCol *= instanceColor;
  #endif
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,G0=`
${Ot}
uniform vec3 uSkyHi, uSkyLo, uLampCol;
varying vec3 vWorld, vN, vCol; varying float vKind;
void main(){
  vec3 toP = vWorld - cameraPosition; float dEye = length(toP); vec3 V = toP / max(dEye, 1e-3);
  vec3 N = normalize(vN);
  if (dot(N, V) > 0.) N = -N;
  float sun = vWorld.y < ISLE_Y0 + 1. ? isleSun(vWorld) : 1.;
  vec3 col;
  if (vKind < .5 || vKind > 5.5) col = vCol * daylight(N, sun);
  else if (vKind < 1.5) {
    vec3 Rr = reflect(V, N);
    vec3 env = mix(uSkyLo, uSkyHi, clamp(Rr.y * .5 + .5, 0., 1.));
    col = vCol * daylight(N, sun) * .55 + vCol * env * .5 + uSunCol * vCol * pow(clamp(dot(Rr, uSunDir), 0., 1.), 40.) * sun * 2.2;
  }
  else if (vKind < 2.5) col = vCol * (1.5 + 1.8 * uNight);
  else {
    // a window: lit from inside at night, and by day where the island's shadow lies on the house
    float lit = max(uNight, 1. - sun);
    col = vCol * daylight(N, sun) * (1. - .8 * lit) + uLampCol * lit * 1.7 * step(.35, fract(vWorld.x * .37 + vWorld.z * .23 + vWorld.y * .11));
  }
  gl_FragColor = vec4(hazed(col, dEye), 1.);
}`,Q0=`
attribute vec3 aB; attribute vec4 aP, aQ;
uniform float uPixH;
varying vec3 vCol, vWorld; varying vec2 vUv; varying float vMode, vFlash, vAlpha;
${Ot}
vec3 along(float a){
  float k = pow(clamp(1. - a, 0., 1.), 1.5) * aQ.x, ph = aP.w;
  return mix(position, aB, a) + vec3(sin(uTime * .7 + ph) + .4 * sin(uTime * 1.9 + ph * 2.3), .25 * sin(uTime * .9 + ph * 1.3) * step(2.5, aQ.x), cos(uTime * .53 + ph * 1.7)) * k;
}
void main(){
  vMode = aP.z; vCol = color; vFlash = 1.; vAlpha = 1.;
  vec4 mv;
  if (aP.z < .5) {
    vec3 p = along(aP.y), p2 = along(aP.y + .03);
    mv = viewMatrix * modelMatrix * vec4(p, 1.);
    vec4 mv2 = viewMatrix * modelMatrix * vec4(p2, 1.);
    vec2 dir = mv2.xy - mv.xy; float dl = length(dir); dir = dl > 1e-5 ? dir / dl : vec2(0., 1.);
    float halfTrue = aQ.z * .5, halfW = max(halfTrue, .6 * max(-mv.z, 0.) * uPixH / projectionMatrix[1][1]);
    vAlpha = halfTrue / max(halfW, 1e-5);
    mv.xy += vec2(-dir.y, dir.x) * aP.x * halfW;
    vUv = vec2(aP.x, aP.y); vWorld = (modelMatrix * vec4(p, 1.)).xyz;
  } else {
    float a = aQ.y > 0. ? fract(uTime * aQ.y + aP.w) : aQ.w;
    vec3 c = along(a);
    float sz = aQ.z * (aQ.y > 0. ? smoothstep(0., .06, a) * smoothstep(1., .9, a) : 1.);
    mv = viewMatrix * modelMatrix * vec4(c, 1.);
    float tw = aQ.y > 0. ? sin(uTime * 7. + aP.w * 5.) : aP.z > 2.5 ? .9 * sin(uTime * 4.3 + aP.w * 3.) : .25 * sin(uTime * 1.3 + aP.w);
    vec2 cr = vec2(aP.x, aP.y);
    // a paper turns on its thread: now broad, now edge on
    if (aP.z > 2.5) cr.x *= .3 + .7 * abs(cos(uTime * 3.1 + aP.w * 2.));
    cr = vec2(cr.x * cos(tw * .5) - cr.y * sin(tw * .5), cr.x * sin(tw * .5) + cr.y * cos(tw * .5));
    mv.xy += cr * sz;
    vUv = vec2(aP.x, aP.y); vWorld = (modelMatrix * vec4(c, 1.)).xyz;
    vFlash = aQ.y > 0. ? .55 + 1.6 * pow(abs(tw), 6.) : 1.;
  }
  gl_Position = projectionMatrix * mv;
}`,X0=`
${Ot}
varying vec3 vCol, vWorld; varying vec2 vUv; varying float vMode, vFlash, vAlpha;
void main(){
  float sun = vWorld.y < ISLE_Y0 ? isleSun(vWorld) : 1.;
  vec3 light = uSunCol * (.55 * sun) + uSkyCol * .8;
  if (vMode > .5 && vMode < 2.5) {
    vec2 q = clamp(vUv, -1., 1.);
    float d = vMode < 1.5 ? length(q / vec2(1., .42)) : abs(q.x) + abs(q.y) * .8;
    if (d > 1.) discard;
  }
  gl_FragColor = vec4(hazed(vCol * light * vFlash, length(vWorld - cameraPosition)), clamp(vAlpha, 0., 1.));
}`,Qe=`
attribute vec3 aFlow;
varying vec3 vWorld, vFlow;
void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vWorld = wp.xyz; vFlow = aFlow; gl_Position = projectionMatrix * viewMatrix * wp; }`,Xe=`
${pe}
${Ot}
uniform float uMode, uFlowK; uniform vec3 uSkyHi, uSkyLo, uWaterCol; uniform vec4 uDrops[6];
varying vec3 vWorld, vFlow;
void main(){
  float ac = clamp(vFlow.y, -1., 1.), hw = max(vFlow.z, .05);
  vec3 toP = vWorld - cameraPosition; float dEye = length(toP); vec3 V = toP / max(dEye, 1e-3);
  vec2 g = vec2(0.); float alpha = 1., white = 0.;
  if (uMode < .5) {
    vec2 q = vec2(ac * hw, vFlow.x - uTime * 2.4 * uFlowK);
    g += vec2(.3, .95) * cos(dot(q, vec2(.3, .95)) * 2.3) * .22 + vec2(-.5, .87) * cos(dot(q, vec2(-.5, .87)) * 3.9 + 1.) * .15 + vec2(.9, .44) * cos(dot(q, vec2(.9, .44)) * 6.3) * .08;
    g += (vec2(vnoise(q * 1.3), vnoise(q * 1.3 + 7.)) - .5) * .5;
    white = smoothstep(.7, .9, vnoise(vec2(vFlow.x * .09, 3.))) * smoothstep(.45, .8, vnoise(q * vec2(2.5, 1.2))) * .7;
    alpha = 1. - smoothstep(.7, 1., abs(ac));
  } else if (uMode < 1.5) {
    vec2 q = vWorld.xz;
    for (int i = 0; i < 6; i++) {
      vec4 s = uDrops[i]; vec2 dv = q - s.xy; float dl = length(dv) + 1e-3;
      float ph = dl * 1.15 - uTime * s.w + s.z;
      g += dv / dl * cos(ph) * .3 * exp(-dl / 16.) * smoothstep(0., 2., dl);
    }
    g += (vec2(vnoise(q * .9 + uTime * .2), vnoise(q * .9 - uTime * .17 + 5.)) - .5) * .12;
  } else {
    vec2 q = vec2(ac * hw, vFlow.x - uTime * 14.);
    float st = vnoise(vec2(q.x * 1.6, q.y * .07)) * .6 + vnoise(vec2(q.x * 4., q.y * .21)) * .4;
    alpha = smoothstep(.3, .62, st) * (1. - ac * ac) * .9;
    white = 1.;
  }
  vec3 n = normalize(vec3(-g.x, 1., -g.y));
  float fres = pow(1. - clamp(dot(-V, n), 0., 1.), 3.);
  vec3 rr = reflect(V, n);
  vec3 lightK = uSkyCol * .85 + uSunCol * .45;
  vec3 col = mix(uWaterCol * lightK, mix(uSkyLo, uSkyHi, clamp(rr.y, 0., 1.)), .18 + .72 * fres);
  col += uSunCol * pow(clamp(dot(rr, uSunDir), 0., 1.), 140.) * 4.;
  col = mix(col, vec3(.93, .96, .97) * (lightK + .1), white * .8);
  gl_FragColor = vec4(hazed(col, dEye), alpha);
}`,Y0=`
${pe}
${Ot}
${s0}
uniform vec3 uAdam, uWarm, uLie; uniform vec2 uStone; uniform vec4 uStair; uniform float uHandS;
varying vec3 vWorld, vN;
void main(){
  // how far over the cave's dome this point of the wall is (under it: the cave's own space, not drawn)
  vec2 sc = (vWorld.xz - uStone) / ${Z(o0.R)};
  float over = vWorld.y - ${Z(Re)} - ${Z(o0.H)} * sqrt(max(1. - dot(sc, sc), 0.));
  if (over < 0.) discard;
  vec3 toP = vWorld - cameraPosition; float dEye = length(toP); vec3 V = toP / max(dEye, 1e-3);
  vec3 N = -normalize(vec3(vWorld.x, 0., vWorld.z) + vec3(1e-4, 0., 0.));
  float y = vWorld.y, arc = atan(vWorld.z, vWorld.x) * ${Z(G)}, depth = ${Z(ht)} - y;
  float skyK = exp(-max(depth, 0.) / 15.), warmK = exp(-over / 11.);
  vec3 sh = normalize(vec3(uSunDir.x, 0., uSunDir.z) + vec3(1e-4, 0., 0.));
  float chord = ${Z(2*G)} * max(dot(N, sh), 0.);
  float lit = 1. - smoothstep(-1.5, 1.5, depth - chord * uSunDir.y / max(length(uSunDir.xz), 1e-3));
  // the stair's lamps: one over every twelfth step of the 132 (uStair: the landing's angle, the winding, the top
  // step's height, the landing's), each a pool of warm light on the wall round it
  float fs = (uStair.z - y) / max(uStair.z - uStair.w, 1.) * 132., k0 = clamp(floor((fs - 6.) / 12. + .5), 0., 10.), lampK = 0.;
  for (int i = -1; i <= 1; i++) {
    float fk = (6. + 12. * clamp(k0 + float(i), 0., 10.)) / 132., ak = uStair.x + uStair.y * (1. - fk), yk = mix(uStair.z, uStair.w, fk) + 2.;
    float da = mod(atan(vWorld.z, uHandS * vWorld.x) - ak + 3.14159265, 6.2831853) - 3.14159265;
    lampK += exp(-(da * da * ${Z(G*G)} + (y - yk) * (y - yk)) / 12.);
  }
  vec3 light = uSunCol * max(dot(N, uSunDir), 0.) * lit + uSkyCol * (.2 + .8 * skyK) + uWarm * (warmK * .8 + lampK * 1.1);
  float yy = y + (vnoise(vec2(arc * .05, y * .1)) - .5) * 3. + dot(vWorld.xz, uLie.xy) * 6. + 2.5 * sin(arc * .04 + uLie.z);
  vec3 col;
  if (yy < ${Z(ne)}) {
    float cell = arc / 5.5, fid = floor(cell), ff = fract(cell);
    vec3 T = vec3(-N.z, 0., N.x);
    vec3 Nf = normalize(N + T * (hash11(fid * 1.7) - .5) * .6 + vec3(0., (hash11(fid * 3.3) - .5) * .3, 0.));
    vec3 Rr = reflect(V, Nf);
    vec3 env = Rr.y > 0. ? uSkyCol * 1.6 * smoothstep(.2, .9, Rr.y) * skyK : uWarm * 1.5 * smoothstep(.0, .8, -Rr.y) * (.35 + .65 * warmK);
    float ndv = clamp(dot(-V, Nf), 0., 1.);
    // the lamps below, mirrored again and again in the facets: small flames, each in a cell of its own, sliding as the eye moves
    vec2 gc = vec2(arc * .55 + Rr.x * 2., y * .55 + Rr.y * 2.), gi = floor(gc), gf = fract(gc) - .5;
    vec2 go = (vec2(hash11(gi.x * 7.3 + gi.y * 13.1), hash11(gi.x * 3.7 + gi.y * 5.9)) - .5) * .6;
    float glint = exp(-dot(gf - go, gf - go) * mix(45., 150., hash11(gi.x * 5.1 + gi.y * 2.3))) * step(.64, hash11(gi.x * 1.9 + gi.y * 9.7)) * 2.6;
    col = uAdam * (light * 1.5 + .35) + env * (.25 + .6 * pow(clamp(1. - ndv, 0., 1.), 2.)) + uWarm * (glint * warmK + lampK * .22);
    col *= 1. - .5 * (1. - smoothstep(0., .05, min(ff, 1. - ff)));
  } else {
    float b = (yy - ${Z(ne)}) / ${Z((ht-5-ne)/4)}, bi = floor(b);
    vec3 ore = bi < 1. ? vec3(.5, .13, .09) : bi < 2. ? vec3(.68, .42, .1) : bi < 3. ? vec3(.24, .29, .36) : bi < 4. ? vec3(.86, .83, .74) : vec3(.2, .13, .08);
    float pxw = length(fwidth(vWorld));
    ore = rock(ore, arc, yy, pxw) * strata(arc, yy, pxw);
    ore = mix(ore, vec3(.1, .32, .08), smoothstep(${Z(ht-1.6)}, ${Z(ht-.8)}, y));
    col = ore * light;
  }
  gl_FragColor = vec4(col, 1.);
}`,Z0=`
attribute float aK; varying float vK;
void main(){ vK = aK; gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.); }`,J0=`
uniform vec3 uShadeCol; varying float vK;
void main(){ gl_FragColor = vec4(mix(vec3(1.), uShadeCol, clamp(vK, 0., 1.)), 1.); }`,ta=`
${pe}
${Ot}
${Ge}
uniform vec3 uShadeCol;
varying vec3 vWorld, vN;
void main(){
  float k = 1. - isleSun(vec3(vWorld.x, 0., vWorld.z)) * cloudSun(vWorld.xz);
  float sea = smoothstep(-1., 7., uHand * vWorld.x - shoreX(vWorld.z));
  // (it fails with distance as the haze takes the sea)
  k *= exp(-length(vWorld - cameraPosition) * uFogK * 2.);
  gl_FragColor = vec4(mix(vec3(1.), uShadeCol, k * sea), 1.);
}`;var ia={id:"island-that-shades-the-fields",name:"The Island That Shades the Fields",category:"books",placeKind:"sky",book:"Gulliver's Travels",author:"Jonathan Swift, 1667 to 1745",media:["air","open"],weirdness:.7,async build(_){const r0=t=>_.core.makeRng(_.core.hashSeed("island/"+t+":"+_.seed)),O={};for(const t of["vary","ore","sky","clouds","ocean","bays","stairs","galleryfolk","walkers","anglers","petitions","figures","palace","houses","topiary","bowltrees","townfolk","townwalk","wellfolk","stones","rivulets","kites","boats","anchorage","scatter","village","trees","gulls","gulls2","gulls3","gulls4","drops","fall","pennants"])O[t]=r0(t);const Zt=_.vary||{},io=_.quality?.detail??1,ut=B(.75,1.1,We(((Zt.density??1)-.7)/.6,0,1))*(io<1?.8:1),Fe=!!Zt.rare,tt=new C.Scene,It=O.vary,nt=It.chance(.5)?1:-1,co=It(),Ye=Zt.hour==="night"?"night":Zt.hour==="golden"||Zt.hour==="dawn"?"golden":Zt.hour==="day"||co<5/8?"day":co<7/8?"golden":"night",l0=It.range(.86,1.14),De=(60+It.range(-8,8))*Math.PI/180,Jt=[40+It.range(-6,6),It.range(22,34),It.range(0,A),It.range(0,A)],Ze=It.range(.3,.48),Je=It.int(1,99),i0=It.range(-.12,.12),ea=Zt.mood??It(),ho=O.ore.range(0,A),fo=O.ore.range(.01,.02),uo={value:new C.Vector3(fo*Math.cos(ho),fo*Math.sin(ho),O.ore.range(0,A))},bt=Ye==="night"?1:0,Et=Ye==="golden",K=t=>nt*t,oa=(t,d)=>[nt*t*Math.cos(d),t*Math.sin(d)],Ce=(bt?34:Et?15:B0)*Math.PI/180,po=new C.Vector3(nt*Math.cos(De)*Math.cos(Ce),Math.sin(Ce),Math.sin(De)*Math.cos(Ce)).normalize(),to=Math.atan2(po.x,-po.z)*180/Math.PI,eo=Ce*180/Math.PI,c0=bt?{preset:"night",bodyOverrides:{0:{elevation:eo,azimuth:to,size:2.6}},key:0,bake:!0,renderer:_.renderer,clouds:{coverage:Ze*.7,seed:Je}}:Et?{preset:"goldenHour",sunElevation:eo,sunAzimuth:to,clouds:{coverage:Ze,seed:Je}}:{preset:"day",zenith:"#3f86d8",horizon:"#bfe2ff",sunElevation:eo,sunAzimuth:to,clouds:{coverage:Ze,seed:Je,lit:"#ffffff",shade:"#8ea2c4"}},Nt=I0({rng:O.sky,...c0});await _.yield(),tt.add(Nt.object);const me=Nt.lightDirection.clone().normalize(),vo=Nt.horizonColor.clone().lerp(Nt.zenithColor,.25);tt.fog=new C.FogExp2(vo,32e-5);const Q=(t,d,n)=>new C.Vector3(t,d,n),se=bt?{sun:Q(.1,.14,.25),sky:Q(.028,.04,.085),ground:Q(.012,.018,.03),lamp:Q(1,.62,.24)}:Et?{sun:Q(1.3,.74,.36),sky:Q(.3,.33,.52),ground:Q(.22,.15,.11),lamp:Q(1,.62,.24)}:{sun:Q(1.02,.96,.84),sky:Q(.3,.4,.62),ground:Q(.17,.17,.13),lamp:Q(1,.62,.24)},Pe=t=>Q(t.r,t.g,t.b),h0=Pe(Nt.zenithColor),f0=Pe(Nt.horizonColor),d0=Et?Q(.3,.22,.16):bt?Q(.02,.05,.1):Pe(new C.Color("#2a7fb8")).multiplyScalar(.8),u0=Et?Q(.1,.08,.09):bt?Q(.006,.014,.035):Q(.02,.12,.26),mo={uSunDir:{value:me},uSunCol:{value:se.sun},uSkyCol:{value:se.sky},uGroundCol:{value:se.ground},uFogCol:{value:Pe(vo)},uFogK:{value:3e-4},uTime:{value:0},uNight:{value:bt},uShore:{value:new C.Vector4(Jt[0],Jt[1],Jt[2],Jt[3])},uHand:{value:nt}},pt={uSkyHi:{value:h0},uSkyLo:{value:f0},uSeaCol:{value:d0},uSeaDeep:{value:u0},uSeaShallow:{value:Et?Q(.42,.34,.22):bt?Q(.03,.08,.12):Q(.2,.62,.62)},uAdam:{value:Pe(new C.Color("#0c1a2e")).multiplyScalar(1.6)},uLampCol:{value:se.lamp}},Kt=t=>Jt[0]+Jt[1]*Math.sin(t/170+Jt[2])+12*Math.sin(t/61+Jt[3]);await _.yield();const Ht=_0({hand:nt,deepK:l0}),rt=Ht.route,p0=Ht.path,aa=Ht.L,wt=Ht.M;await _.yield();const v0=Math.min(8,_.renderer.capabilities.getMaxAnisotropy()),kt=Ht.line,go=kt.length-1,Tt=rt.dir,_e=rt.nl,ge=rt.K,wo=rt.Rc,we=(t,d=0)=>[ge[0]-Tt[0]*t+_e[0]*d,ge[1]-Tt[1]*t+_e[1]*d],oo=rt.H.kerb-rt.H.bowl,ot=(t,d,n)=>{let g=1e9;for(let a=0;a<=go;a++){const v=kt[a],u=(v.x-t)**2+(v.y-d)**2+(v.z-n)**2;u<g&&(g=u)}return Math.sqrt(g)};await _.yield();const Ft=(t,d,n,g={})=>new C.ShaderMaterial({uniforms:{...mo,...n},vertexShader:t,fragmentShader:d,...g}),yo={value:Array.from({length:24},()=>new C.Vector4(0,0,0,0))},re=[-1220,-780,1420,1420],Mo={value:null},m0=Ft(H0,$0,{uSeaCol:pt.uSeaCol,uSeaDeep:pt.uSeaDeep,uSeaShallow:pt.uSeaShallow,uSkyHi:pt.uSkyHi,uSkyLo:pt.uSkyLo,uAdam:pt.uAdam,uBoats:yo,uLandMap:Mo,uMapBox:{value:new C.Vector4(re[0],re[1],re[2],re[3])}},{side:C.DoubleSide}),xo=new C.Mesh(new C.CircleGeometry(L,120).rotateX(Math.PI/2),m0);xo.position.y=je,tt.add(xo);const g0=Ft(Te,j0,{uAdam:pt.uAdam,uSeaCol:pt.uSeaCol,uSkyHi:pt.uSkyHi,uSkyLo:pt.uSkyLo,uTiers:{value:ve.slice()},uLie:uo}),bo=new C.Mesh(new C.CylinderGeometry(L,L,gt-je,180,1,!0),g0);bo.position.y=(gt+je)/2,tt.add(bo);const ko=22,Ee=we((oo+Ue)/2,-(ko+12)),$t=[];for(let t=0;t<4;t++){const d=t*Math.PI/2+(t?i0*(t===2?-1:1):0),n=Math.cos(d),g=Math.sin(d),a=Ee[0]*n-Ee[1]*g,v=Ee[0]*g+Ee[1]*n;$t.push({x:K(a),z:v,r:ko,level:a0(Math.hypot(a,v))-1.2})}const et=(t,d)=>{const n=Math.hypot(t,d);let g=a0(n)+1.1*_.noise.fbm2(t*.012,d*.012,3)*Xt(G+4,G+30,n)*(1-Xt(L-30,L-6,n));for(const a of $t){const v=Math.hypot(t-a.x,d-a.z);v<a.r+14&&(g=B(a.level,g,Xt(a.r+2,a.r+14,v)),g-=2.6*(1-Xt(a.r-5,a.r,v)))}return g};{const n=[],g=[];for(let s=0;s<=44;s++){const l=B(G,L,Math.pow(s/44,.9));for(let h=0;h<=132;h++){const o=h/132*A,p=l*Math.cos(o),i=l*Math.sin(o);n.push(p,s===0?ht:s===44?gt:et(p,i),i)}s%11===10&&await _.yield()}for(let s=0;s<44;s++)for(let l=0;l<132;l++){const h=s*133+l,o=h+132+1;g.push(h,h+1,o,h+1,o+1,o)}const a=new C.BufferGeometry;a.setAttribute("position",new C.Float32BufferAttribute(n,3)),a.setIndex(g),a.computeVertexNormals();const v=[];for(let s=0;s<10;s++){const l=kt[Math.round(B(wt.rim-4,wt.kerb,s/9)/2.5)];v.push(new C.Vector2(l.x,l.z))}const u=Ft(Te,O0,{uBasins:{value:$t.map(s=>new C.Vector4(s.x,s.z,s.r,s.level))},uStreet:{value:v},uStreetDir:{value:new C.Vector2(K(Tt[0]),Tt[1])}});tt.add(new C.Mesh(a,u))}const w0=new C.Vector2(K(rt.stone[0]),rt.stone[1]),So=Ft(Te,Y0,{uAdam:pt.uAdam,uWarm:{value:Q(1,.66,.3)},uStone:{value:w0},uLie:uo,uStair:{value:new C.Vector4},uHandS:{value:nt}},{side:C.BackSide}),zo=new C.Mesh(new C.CylinderGeometry(G,G,ht-Re,96,1,!0),So);zo.position.y=(ht+Re)/2,tt.add(zo),await _.yield();const y0=(t,d)=>We((nt*t-Kt(d))*.09,-3,30),ao=F0.makeOcean({rng:O.ocean,light:Nt,preset:"breeze",radius:3600,depthAt:y0,depthRect:[-1300,-1300,1300,1300],depthRes:128,deep:bt?"#04182c":Et?"#3a2c2a":"#0b4f86",shallowColor:Et?"#c89a5a":"#49cfc0"});tt.add(ao.object),await _.yield();const le=(t,d)=>{const n=Kt(d)-t;if(n<0)return Math.max(n*.09,-8);const g=_.noise.fbm2(t*.004,d*.004,3);return 1.6*Xt(0,22,n)+Xt(20,320,n)*(7+14*g)+Xt(320,1500,n)*(30+70*(.5+.5*g))};{const t=[-40,-15,-4,0,4,9,15,22,32,46,64,90,125,175,250,350,500,700,1e3,1500,2300,3300],d=[];for(let u=0;u<3400;u+=Math.abs(u)<500?16:16+(Math.abs(u)-500)*.14)d.push(u),u>0&&d.unshift(-u);const n=[],g=[],a=t.length;for(const u of d)for(const s of t){const l=Kt(u)-s;n.push(K(l),le(l,u),u)}for(let u=0;u<d.length-1;u++)for(let s=0;s<a-1;s++){const l=u*a+s,h=l+a;nt>0?g.push(l,l+1,h,l+1,h+1,h):g.push(l,h,l+1,l+1,h,h+1)}const v=new C.BufferGeometry;v.setAttribute("position",new C.Float32BufferAttribute(n,3)),v.setIndex(g),v.computeVertexNormals(),tt.add(new C.Mesh(v,Ft(Te,V0,{},{side:C.DoubleSide})))}await _.yield();const M0={uSkyHi:pt.uSkyHi,uSkyLo:pt.uSkyLo,uLampCol:pt.uLampCol},ie=Ft(U0,G0,M0,{vertexColors:!0,side:C.DoubleSide}),S={stone:Y(Ct("#f1ead6"),.84),chalk:Y(Ct("#efe9dc"),.8),slate:Ct("#5d6b78"),ochre:Ct("#d6a54a"),ore:Ct("#b5483a"),copper:Ct("#c9773a"),turf:Ct("#4f9a4a"),wood:Ct("#4a3524"),dark:[.03,.035,.05],lamp:[1,.62,.22],sail:Ct("#d8c8a0"),robes:["#27408b","#7a2633","#1f5f5a","#5a3a7a","#c9a23a","#e8e2d0"].map(Ct),cloth:["#b5483a","#d6a54a","#3d6a9a","#efe9dc"].map(Ct)},Vt=(t,d)=>Math.atan2(nt*t,d),x0=Vt,Ne=(t,d,n,g,a)=>{for(const v of[0,1,2,0,2,3])t.kind(6+n[v]),t.v(d[v],g,a)},Co=(t,d)=>{const n=Yt(),g=9.75,a=Oe,v=[];n.kind(0).col(S.stone,.92),n.box(-g,-.8,-.5,g,0,a,Y(S.stone,1));for(const s of[-7,0,7])n.hexa([[s-.45,-4,.5],[s+.45,-4,.5],[s+.45,-4,-.2],[s-.45,-4,-.2],[s-.45,-.8,a-.7],[s+.45,-.8,a-.7],[s+.45,-.8,-.2],[s-.45,-.8,-.2]],S.stone,Y(S.stone,.8),!0);n.col(S.stone,1);for(let s=-9;s<=9.01;s+=2.25)n.box(s-.13,0,a-.38,s+.13,1.05,a-.12);if(n.box(-g,1.05,a-.45,g,1.22,a-.05),n.box(-g,.45,a-.32,g,.56,a-.18),t<0)return{geo:n.build(),spots:v};const u=t===2?[-6,0,6]:[d.range(-7,-3),d.range(3,7)];for(const s of u){const l=d.range(.9,1.3),h=d.range(2.6,3.3);n.kind(0).col(S.chalk,1),n.box(s-l-.3,0,-.3,s+l+.3,h+.4,.22),n.kind(5).col(S.dark,1),n.quad([s-l,.02,.24],[s+l,.02,.24],[s+l,h,.24],[s-l,h,.24]),n.kind(2).col(S.lamp,1),n.box(s+l+.5,h-.3,.2,s+l+.8,h+.15,.5)}if(t===1){const s=d.range(-8,-2),l=s+d.range(6,9),h=d.pick(S.cloth),o=d.pick(S.cloth),p=8;for(let e=0;e<p;e++){const c=B(s,l,e/p),m=B(s,l,(e+1)/p),y=.5*Math.sin(Math.PI*e/p),b=.5*Math.sin(Math.PI*(e+1)/p);Ne(n,[[c,2.5,3.9],[m,2.5,3.9],[m,3.6,.15],[c,3.6,.15]],[y,b,0,0],[0,.96,.27],Y(e%2?h:o,.9))}n.kind(0).col(S.wood,1),n.bar([s,0,3.8],[s,2.5,3.8],.07,.07,4),n.bar([l,0,3.8],[l,2.5,3.8],.07,.07,4);const i=(s+l)/2;n.col(S.wood,1.3),n.box(i-1.3,.78,1,i+1.3,.86,1.9),n.bar([i-1.1,0,1.45],[i-1.1,.78,1.45],.05,.05,4),n.bar([i+1.1,0,1.45],[i+1.1,.78,1.45],.05,.05,4),v.push([i-.6,2.25,0,2],[i+.7,.62,0,0],[l+1.2,a-.75,3,0])}else if(t===0){const s=d.range(-8,4),l=d.pick(S.cloth),h=d.range(3.2,4.6),o=5;n.kind(0).col(S.wood,1.6),n.bar([s,0,a-.3],[s,5.2,a-.3],.07,.05,4);let p=s+5+d.range(0,1);for(let i=0;i<5&&p<g-1.5;i++){const e=d.range(.7,1.4),c=d.range(.6,1.3),m=Y(d.pick(S.cloth),d.range(.8,1.15));Ne(n,[[p,1.24-c,a+.06],[p+e,1.24-c,a+.06],[p+e,1.24,a+.02],[p,1.24,a+.02]],[.5,.5,0,0],[0,0,1],m),p+=e+d.range(.15,.6)}v.push([s+1.5,a-.75,3,0],[s-2.5,1.2,0,1]);for(let i=0;i<o;i++){const e=i/o,c=(i+1)/o;Ne(n,[[s+e*h,5.1-e*.25,a-.3],[s+e*h,4.2+e*.25,a-.3],[s+c*h,4.2+c*.25,a-.3],[s+c*h,5.1-c*.25,a-.3]],[e*.9,e*.9,c*.9,c*.9],[0,0,1],l)}}else if(t===2){n.kind(0).col(S.chalk,1);for(let s=-9;s<=9.01;s+=4.5)n.bar([s,0,a-.7],[s,4.3,a-.7],.3,.24,6);n.box(-g,4.3,-.4,g,4.75,a-.1,Y(S.slate,.9));for(let s=-6.75;s<=7;s+=9)n.kind(1).col(S.copper,1),n.bar([s,4.3,a-.7],[s,3.5,a-.7],.03,.03,4),n.kind(2).col(S.lamp,1),n.ball([s,3.3,a-.7],.22,6);v.push([d.range(-8,-5),a-.75,3,0],[d.range(-1,1),1,0,1],[d.range(4,8),.7,0,0])}else if(t===3){const s=d.range(-6,6),l=d.range(.15,.6),h=a-.25;n.kind(0).col(S.wood,1),n.bar([s,0,h],[s,1.55,h],.09,.07,5),n.kind(1).col(S.copper,1),n.bar([s,1.6-1*Math.sin(l),h-1*Math.cos(l)],[s,1.6+2.2*Math.sin(l),h+2.2*Math.cos(l)],.11,.2,8,!0);const o=s+d.range(2.2,3.4)*(d.chance(.5)?1:-1);n.kind(0).col(S.wood,1),n.bar([o,0,h-.5],[o,1.2,h-.5],.07,.06,5),n.kind(1).col(S.ochre,1);const p=[o,2.1,h-.5],i=e=>[o,2.1-.9*Math.cos(e*Math.PI/8),h-.5+.9*Math.sin(e*Math.PI/8)];for(let e=0;e<4;e++)n.bar(i(e),i(e+1),.035,.035,4);n.bar(p,i(0),.03,.03,4),n.bar(p,i(4),.03,.03,4),v.push([s,h-1.3,1,0],[o-.2,h-1.25,0,0])}if(d.chance(.6)){const s=d.range(-8,8),l=d.int(1,3);n.kind(0).col(S.stone,.8),n.box(s-1.6,-2.3,-.2,s+1.6,-2.05,.75);for(let h=0;h<l;h++){const o=s-1.1+h*1.1+d.range(-.2,.2);n.col([.3,.22,.13],1),n.lathe(o,.3,[[.3,-2.05],[.36,-1.9],[.2,-1.92]],6),n.col([.92,.93,.95],1),n.ball([o,-1.78,.3],.17,6,.8),n.ball([o+.13,-1.66,.36],.08,5)}}return{geo:n.build(),spots:v}},Po=[];{const d=O.bays,n=[];for(let e=0;e<4;e++)for(let c=0;c<2;c++)n.push({...Co(e,d),list:[]}),c&&await _.yield();const g={...Co(-1,d),list:[]},a=new Uint8Array(72),v=L+Oe;for(let e=0;e<72;e++){const c=(e+.5)/72*A,m=K(Math.cos(c)),y=Math.sin(c);for(let b=0;b<=go&&!a[e];b++){const x=kt[b];x.y<gt+30&&x.x*m+x.z*y>v+1&&(a[e]=1)}}const u=e=>{for(let c=-2;c<=2;c++)if(a[(e+c+72)%72])return!0;return!1};n.push(g);for(const e of ve)for(let c=0;c<72;c++){const m=d.chance(.4)?0:d.int(1,3),y=d.int(0,1),b=(c+.5)/72*A,x={a:b,yt:e,tint:d.range(.88,1.08),warm:d.range(-.03,.03)};if(!u(c)){g.list.push(x);continue}n[m*2+y].list.push(x);for(const f of n[m*2+y].spots)Po.push({a:b,yt:e,sp:f})}const s=new C.Matrix4,l=new C.Quaternion,h=new C.Euler,o=new C.Vector3,p=new C.Vector3(1,1,1),i=new C.Color;for(const e of n){if(!e.list.length)continue;const c=new C.InstancedMesh(e.geo,ie,e.list.length);e.list.forEach((m,y)=>{s.compose(o.set(K(L*Math.cos(m.a)),m.yt,L*Math.sin(m.a)),l.setFromEuler(h.set(0,x0(Math.cos(m.a),Math.sin(m.a)),0)),p),c.setMatrixAt(y,s),c.setColorAt(y,i.setRGB(m.tint+m.warm,m.tint,m.tint-m.warm))}),c.frustumCulled=!1,tt.add(c),await _.yield()}}const yt={pos:[],b:[],p:[],q:[],col:[],idx:[]},qo=(t,d,n,g,a)=>{yt.pos.push(t[0],t[1],t[2]),yt.b.push(d[0],d[1],d[2]),yt.p.push(n[0],n[1],n[2],n[3]),yt.q.push(g[0],g[1],g[2],g[3]),yt.col.push(a[0],a[1],a[2])},no=(t,d,n,g,a,v,u=8)=>{const s=yt.pos.length/3;for(let l=0;l<=u;l++)for(const h of[-1,1])qo(t,d,[h,l/u,0,a],[n,0,g,0],v);for(let l=0;l<u;l++){const h=s+l*2;yt.idx.push(h,h+1,h+2,h+1,h+3,h+2)}},ye=(t,d,n,g,a,v,u,s,l)=>{const h=yt.pos.length/3;for(const[o,p]of[[-1,-1],[1,-1],[1,1],[-1,1]])qo(t,d,[o,p,a,g],[n,v,u,s],l);yt.idx.push(h,h+1,h+2,h,h+2,h+3)};let r=Yt();const Mt=async()=>{r.triangles&&(tt.add(new C.Mesh(r.build(),ie)),r=Yt()),await _.yield()},Dt=async()=>{r.triangles>9e3?await Mt():await _.yield()},Lt=t=>({h:t.range(.92,1.08),c:t.pick(S.robes),tone:t.range(.7,1),tilt:t.range(.07,.14)*(t.chance(.5)?1:-1),skin:t.range(.8,1.1)}),Pt=(t,d,n,g,a,v,u=0)=>{const{h:s,c:l,tone:h,tilt:o,skin:p}=v;t.tr(d,n,g,a,s),t.kind(0).col(l,h),t.lathe(0,0,[[.36,0],[.3,.55],[.2,1],[.25,1.32],[.1,1.5]],6),t.col([.5,.36,.27],p),t.ball([o,1.66,.02],.15,6),t.col(l,h*.8);const i=1.36,e=(m,y)=>t.bar([m*.23,i,0],y,.065,.05,4);u===1?(e(-1,[-.08,1.18,.5]),e(1,[.08,1.24,.42])):u===2?(e(1,[.34,2.04,.14]),e(-1,[-.3,.9,.05])):u===3?(e(-1,[-.26,1.1,.42]),e(1,[.26,1.1,.42])):u===4?(e(1,[.3,1.62,.5]),e(-1,[-.3,.85,.04])):u===5?(e(-1,[-.02,1.56,.3]),e(1,[.42,1.58,.2])):u===6?(e(-1,[-.34,1.5,.34]),e(1,[.02,1.36,.42])):u===7?(e(-1,[-.62,1.42,0]),e(1,[.62,1.42,0])):(e(-1,[-.3,.85,.04]),e(1,[.3,.85,.04]));const c=v.prop||0;if(c===1)t.col(S.wood,1.5),t.bar([.3,1.6,.48],[.3,2.05,1],.03,.03,4),t.col([.86,.8,.62],1),t.ball([.3,1.86,1.06],.19,6,1.15);else if(c===2)t.col([.45,.2,.08],1.2),t.box(-.44,1.46,.26,-.18,1.54,.5),t.bar([-.36,1.5,.48],[-.52,1.56,.86],.03,.025,4),t.col(S.chalk,1),t.bar([.02,1.36,.42],[-.5,1.62,.5],.012,.012,3);else if(c===3)t.col(S.wood,2),t.bar([-.1,1.6,.26],[.6,1.6,.2],.028,.028,4);else if(c===4){t.kind(1).col(S.copper,1.1);const m=[.3,1.62,.52];t.bar(m,[.3,2.22,.52],.022,.022,4),t.bar(m,[.9,1.62,.52],.022,.022,4);for(let y=0;y<4;y++){const b=y/4*Math.PI/2,x=(y+1)/4*Math.PI/2;t.bar([.3+.6*Math.cos(b),1.62+.6*Math.sin(b),.52],[.3+.6*Math.cos(x),1.62+.6*Math.sin(x),.52],.022,.022,4)}}else c===5&&(t.kind(1).col(S.copper,1.1),t.bar([.3,1.62,.5],[.12,1.02,.62],.02,.012,4),t.bar([.3,1.62,.5],[.5,1.02,.62],.02,.012,4));if(v.rich){t.kind(0).col(l,h*.6),t.lathe(o,.02,[[.19,1.74],[.17,1.86],[.02,1.9]],6),t.kind(1).col(S.ochre,1.25);for(let m=0;m<5;m++){const y=v.rich+m*1.26,b=.345-.06*(m%2),x=.3+.36*(m%2)+.05*m,f=Math.cos(y),w=Math.sin(y),M=.09;m%2?t.tri([b*f-M*w,x,b*w+M*f],[b*f+M*w,x,b*w-M*f],[b*f,x+2*M,b*w]):t.quad([b*f-M*w,x,b*w+M*f],[b*f,x-M,b*w],[b*f+M*w,x,b*w-M*f],[b*f,x+M,b*w])}}t.pop()},Ao=[];{const t=O.stairs;for(let d=0;d<ve.length-1;d++){const n=ve[d],g=ve[d+1]-n,a=40,v=.75/L,u=t.range(0,A);for(let s=0;s<8;s++){const l=u+s/8*A+t.range(-.1,.1),h=s%2?1:-1;Ao.push({aS:l,dir:h,y0:n,rise:g,sweep:v*a});for(let o=0;o<a;o++){const p=l+h*v*o,i=n+g*(o+1)/a;r.tr(L*Math.cos(p),i,L*Math.sin(p),Math.PI/2-p),r.kind(0).col(S.stone,o%2?.86:.98),r.box(-.42,-1.3,.2,.42,0,2.5),o%4===0&&(r.col(S.stone,1),r.box(-.08,0,2.3,.08,1,2.5)),r.pop()}s%3===2&&await _.yield()}await Mt()}}const Me=[];let xe=null;{const t=O.galleryfolk;let d=0;for(const u of Po){const s=t.chance(.5),l=Lt(t),h=t.chance(.5)?1:-1;if(!s)continue;const o=Math.cos(u.a),p=Math.sin(u.a),i=L+u.sp[1],e=i*o+u.sp[0]*p*nt,c=i*p-u.sp[0]*o*nt,m=u.sp[3]===0?[o,p]:u.sp[3]===2?[-o,-p]:[-p*h,o*h];ot(K(e),u.yt+1,c)>2.5&&Pt(r,K(e),u.yt,c,Vt(m[0],m[1]),l,u.sp[2]),++d%30===0&&await Mt()}await Mt();const n=O.walkers,g=Math.round(30*ut);for(const u of ve)for(let s=0;s<g;s++){const l=n.chance(.5)?1:-1;Me.push({y:u,r:L+(l>0?2.8:3.15),a0:n.range(0,A),w:l*n.range(1,1.5)/L,ph:n.range(0,A),h:n.range(.92,1.08),c:n.pick(S.robes),tone:n.range(.7,1)})}for(const u of Ao)for(let s=0;s<2;s++)Me.push({stair:u,v:n.range(.018,.03),ph:n.range(0,1),h:n.range(.92,1.08),c:n.pick(S.robes),tone:n.range(.7,1)});const a=Yt();Pt(a,0,0,0,0,{h:1,c:[1,1,1],tone:1,tilt:.1,skin:1.6}),xe=new C.InstancedMesh(a.build(),ie,Me.length);const v=new C.Color;Me.forEach((u,s)=>xe.setColorAt(s,v.setRGB(u.c[0]*u.tone,u.c[1]*u.tone,u.c[2]*u.tone))),xe.frustumCulled=!1,tt.add(xe),await _.yield()}const Le=new C.Matrix4,Wo=new C.Quaternion,Ro=new C.Vector3,Io=new C.Vector3,To=new C.Euler,Fo=t=>{for(let d=0;d<Me.length;d++){const n=Me[d];let g,a,v,u;if(n.stair){const h=(t*n.v+n.ph)%1,o=h<.5?h*2:2-h*2,p=n.stair;g=p.aS+p.dir*p.sweep*o,a=p.y0+p.rise*o,v=L+1.35,u=p.dir*(h<.5?1:-1)}else g=n.a0+n.w*t,a=n.y,v=n.r,u=Math.sign(n.w);a+=.035*Math.abs(Math.sin(t*5.2+d*1.7));const s=Math.cos(g),l=Math.sin(g);Le.compose(Ro.set(v*s,a,v*l),Wo.setFromEuler(To.set(0,Math.atan2(-l*u,s*u),0)),Io.set(n.h,n.h,n.h)),xe.setMatrixAt(d,Le)}xe.instanceMatrix.needsUpdate=!0};Fo(0);const Do=[];{const t=ve[0],d=[.75,.8,.86],n=[.3,.3,.27],g=Ct("#c9a45a"),a=L+Oe-.75,v=(i,e,c)=>1-Xt(30,90,ot(i,e,c)),u=(i,e,c,m)=>{for(let y=e[1];y>c[1];y-=2.5)if(ot(e[0],y,e[2])<6+m*We((e[1]-y)/(e[1]-c[1]),0,1))return!1;for(let y=0;y<=5;y++)if(ot(B(i[0],e[0],y/5),B(i[1],e[1],y/5),B(i[2],e[2],y/5))<6)return!1;return!0},s=O.anglers;let l=s.range(0,.05),h=0;for(;l<A;){++h%10===0&&await _.yield();const i=s.range(9,15)/(.75+.5*(ut-.75)/.35),e=s.range(-.12,.12),c=s.range(.12,.34),m=L0*s.range(.85,1.1),y=s.range(0,A),b=s.chance(.45),x=s.range(.03,.06),f=s.range(.55,.9),w=s(),M=s.range(1.1,1.7),k=Lt(s),z=Math.cos(l),q=Math.sin(l),T=Math.cos(l+e),R=Math.sin(l+e),N=[a*z+.45*T,t+1.2,a*q+.45*R],E=[N[0]+m*Math.cos(c)*T,t+1.2+m*Math.sin(c),N[2]+m*Math.cos(c)*R],H=[K(N[0]),N[1],N[2]],I=[K(E[0]),E[1],E[2]],$=[I[0],.2,I[2]],st=v(I[0],30,I[2]);if(l+=i*(1+1.2*st)/L,E[0]<Kt(E[2])+8||!u(H,I,$,M))continue;Pt(r,K(a*z),t,a*q,Vt(T,R),k,1);const at=[B(H[0],I[0],.55),B(H[1],I[1],.55)+.5,B(H[2],I[2],.55)];r.kind(0).col(g,1),r.bar(H,at,.13,.09,5),r.bar(at,I,.09,.045,5),no($,I,M,.1+.06*st,y,n,10),ye($,I,M,y,1,0,.32,.012,[.85,.2,.12]),b&&ye($,I,M,y+w,1,x,f,0,d)}await Mt();const o=O.petitions,p=["#f4efe2","#f1d9c9","#dfe6ee","#f3e7b8"].map(Ct);for(l=o.range(0,.05),h=0;l<A;){++h%6===0&&await _.yield();const i=o.range(16,26)/(.75+.5*(ut-.75)/.35),e=o.range(0,A),c=o.range(.8,1.3),m=o.int(7,12),y=o.int(2,4),b=[],x=[];for(let I=0;I<12;I++)b.push([o.range(.025,.05),o.range(.5,.75),o.pick(p),o.range(0,A)]);for(let I=0;I<4;I++)x.push([o.range(0,A),o.range(1.1,2.6),Lt(o)]);const f=Lt(o),w=Math.cos(l),M=Math.sin(l),k=(a+.9)*w,z=(a+.9)*M,q=Kt(z)-k,T=[K(k),t+1.15,z],R=q>0?le(k,z):.6,N=[T[0],R+2.1,z],E=v(T[0],30,z);if(l+=i*(1+1.2*E)/L,q<-25||!u(T,T,N,c))continue;Pt(r,K(a*w),t,a*M,Vt(w,M),f,3),no(N,T,c,.14+.06*E,e,[.75,.72,.62],10),ye(N,T,c,e,1,0,.3,.004,[.25,.2,.16]);let H=.03;for(let I=0;I<m;I++)H+=b[I][0],ye(N,T,c,e+b[I][3],3,0,b[I][1],H,b[I][2]);if(q>3)for(let I=0;I<y;I++){const $=x[I][0],st=k+x[I][1]*Math.cos($),at=z+x[I][1]*Math.sin($);Kt(at)-st>1&&ot(K(st),le(st,at)+1,at)>2.5&&Pt(r,K(st),le(st,at),at,Vt(-Math.cos($),-Math.sin($)),x[I][2],2)}else Do.push([k+2.6,z])}await Mt()}const Be={uSkyHi:pt.uSkyHi,uSkyLo:pt.uSkyLo,uWaterCol:{value:bt?Q(.02,.05,.09):Q(.1,.3,.36)}},so=[0,1,2,3,4,5].map(()=>new C.Vector4),qe=[];{const t=O.rivulets,d=[],n=[],g=[],a=(l,h,o)=>{const p=d.length/3;let i=0;for(let e=0;e<l.length;e++){const c=l[e],m=l[Math.min(e+1,l.length-1)],y=l[Math.max(e-1,0)];let b=m[0]-y[0],x=m[1]-y[1];const f=Math.hypot(b,x)||1;b/=f,x/=f,e&&(i+=Math.hypot(c[0]-y[0],c[1]-y[1]));const w=B(h,o,e/(l.length-1))*.5*(1+.5/.7);for(const M of[-1,1]){const k=c[0]-x*w*M,z=c[1]+b*w*M;d.push(k,et(k,z)+.14,z),n.push(i,M*(1/.7),w*.7)}}for(let e=0;e<l.length-1;e++){const c=p+e*2;g.push(c,c+1,c+2,c+1,c+3,c+2)}qe.push(l)};{const l=[],h=(oo+Ue)/2;for(let o=oo-6;o>h+13;o-=3){const p=we(o,-7-9.5*Xt(h+40,h+14,o));l.push([K(p[0]),p[1]])}a(l,1.3,2.3)}for(let l=0;l<4;l++){const h=$t[l],o=Math.atan2(h.z,h.x),p=l===0?4:5;for(let i=0;i<p;i++){const e=o+(i-(p-1)/2)*.36+t.range(-.07,.07),c=L-t.range(8,34),m=t.range(3,8),y=t.range(1.2,2.4),b=t.range(0,A),x=t.range(1,1.5),f=t.range(1.8,2.6),w=c*Math.cos(e),M=c*Math.sin(e),k=h.x-w,z=h.z-M,q=Math.hypot(k,z),T=h.x-k/q*(h.r-3),R=h.z-z/q*(h.r-3),N=Math.max(6,Math.round(q/4)),E=[];let H=!0;for(let I=0;I<=N;I++){const $=I/N,st=m*Math.sin($*Math.PI)*Math.sin($*y*A+b),at=B(w,T,$)-z/q*st,vt=B(M,R,$)+k/q*st;l===0&&Math.abs((at-K(ge[0]))*nt*-_e[0]+(vt-ge[1])*-_e[1]-7)<5&&(H=!1),E.push([at,vt])}H&&a(E,x,f)}}const v=new C.BufferGeometry;v.setAttribute("position",new C.Float32BufferAttribute(d,3)),v.setAttribute("aFlow",new C.Float32BufferAttribute(n,3)),v.setIndex(g);const u=new C.Mesh(v,Ft(Qe,Xe,{...Be,uMode:{value:0},uFlowK:{value:Fe?-1:1},uDrops:{value:so}},{transparent:!0,depthWrite:!1,side:C.DoubleSide}));u.renderOrder=2,tt.add(u);const s=O.drops;for(const l of $t){const h=[0,1,2,3,4,5].map(()=>{const p=s.range(0,A),i=s.range(2,l.r-5);return new C.Vector4(l.x+i*Math.cos(p),l.z+i*Math.sin(p),s.range(0,A),s.range(.9,1.7))}),o=new C.Mesh(new C.CircleGeometry(l.r-.3,48).rotateX(-Math.PI/2),Ft(Qe.replace("vFlow = aFlow;","vFlow = vec3(0.);").replace("attribute vec3 aFlow;",""),Xe,{...Be,uMode:{value:1},uFlowK:{value:1},uDrops:{value:h}}));o.position.set(l.x,l.level-.45,l.z),tt.add(o)}await _.yield()}const X={r:G-1.6,w:3,n:132,turn:.75*A};{r.kind(0).col(S.stone,.95),r.lathe(0,0,[[G-.05,ht-.3],[G-.05,ht+.35],[G+1,ht+.35],[G+1,ht]],96),r.kind(0).col(S.chalk,1);for(let v=0;v<108;v++){const u=v/108*A,s=(G+.5)*Math.cos(u),l=(G+.5)*Math.sin(u);r.bar([s,ht+.35,l],[s,ht+1.12,l],.16,.1,5)}r.hoop([0,ht+1.2,0],[0,1,0],G+.5,.17,96,5),await _.yield();const t=Math.atan2(-rt.stone[1],-rt.stone[0]),d=Math.hypot(rt.stone[0],rt.stone[1])+X.r;X.yEnd=Re+N0(d)+1,X.aFar=t;const n=(v,u)=>{const s=t+u*X.turn*(1-v/X.n);return[K(X.r*Math.cos(s)),B(ht-.4,X.yEnd,v/X.n),X.r*Math.sin(s)]},g=v=>{let u=1e9;for(let s=0;s<=X.n;s+=2){const l=n(s,v);u=Math.min(u,ot(l[0],l[1]+1,l[2]))}return u};X.sg=g(1)>=g(-1)?1:-1,X.clear=g(X.sg),So.uniforms.uStair.value.set(t,X.sg*X.turn,ht-.4,X.yEnd);for(let v=0;v<=X.n;v++){const u=n(v,X.sg),s=Math.atan2(u[2],u[0]);r.tr(u[0],u[1],u[2],Math.PI/2-s),r.kind(0).col(S.stone,v%2?.8:.95),r.box(-.62,-.5,-X.w/2,.62,0,X.w/2),v%3===0&&(r.kind(1).col(S.copper,1),r.bar([0,0,-X.w/2+.1],[0,1.1,-X.w/2+.1],.05,.05,4)),r.pop(),v%44===43&&await _.yield()}const a=O.wellfolk;for(let v=6;v<=X.n;v+=12){const u=n(v,X.sg),s=Math.atan2(u[2],u[0]),l=G-.4,h=l*Math.cos(s),o=l*Math.sin(s);r.kind(1).col(S.copper,1),r.bar([G*Math.cos(s),u[1]+2.5,G*Math.sin(s)],[h,u[1]+2.4,o],.05,.05,4),r.bar([h,u[1]+2.4,o],[h,u[1]+2.15,o],.03,.03,4),r.kind(2).col(S.lamp,1),r.ball([h,u[1]+2,o],.2,6,1.2)}for(let v=9;v<X.n;v+=8){const u={...Lt(a),rich:a.range(.1,6)},s=a.chance(.55),l=a.chance(.5),h=a.chance(.3),o=n(v,X.sg),p=Math.atan2(o[2],o[0]);!s||ot(o[0],o[1]+2.3,o[2])<5||Pt(r,o[0],o[1],o[2],h?Math.atan2(-o[0],-o[2]):Math.atan2(-Math.sin(p),Math.cos(p))+(l?0:Math.PI),u,h?3:0)}await _.yield()}const W={D:G+Ie+28,y:ht+5.4,half:62,back:-24,front:20,drum:16,towers:[]},Ke=[[],[]];{const t=O.palace;W.x=K(Tt[0]*W.D),W.z=Tt[1]*W.D,W.yaw=Vt(-Tt[0],-Tt[1]);const d=Math.cos(W.yaw),n=Math.sin(W.yaw);W.toW=(o,p)=>[W.x+o*d+p*n,W.z-o*n+p*d],W.loc=(o,p)=>[(o-W.x)*d-(p-W.z)*n,(o-W.x)*n+(p-W.z)*d],r.tr(W.x,W.y,W.z,W.yaw),r.kind(0).col(S.stone,.86),r.box(-W.half,-7,W.back,W.half,0,W.front,Y(S.chalk,1.04)),r.col(S.stone,.8),r.box(-W.half-.5,-7,W.back-.5,W.half+.5,-4.6,W.front+.5,Y(S.stone,.9));for(let o=0;o<13;o++)r.col(S.chalk,o%2?.93:1.02),r.box(-17,-7,W.front+.5*o,17,-.4*(o+1),W.front+.5*(o+1));for(const o of[-1,1]){r.col(S.stone,.9),r.box(o*17,-7,W.front,o*19.4,.5,W.front+7.2,Y(S.chalk,1)),r.col(S.chalk,1),r.ball([o*18.2,1.5,W.front+6],1,10);for(let p=20.4;p<W.half;p+=1.6)r.bar([o*p,0,W.front-.5],[o*p,1,W.front-.5],.2,.13,5);r.box(o>0?19.4:-W.half,1,W.front-.8,o>0?W.half:-19.4,1.25,W.front-.2)}await _.yield();const g=W.drum,a=24;r.col(S.stone,.95),r.lathe(0,0,[[g+1.2,0],[g+1.2,1.4],[g,1.6],[g,a-2.4],[g+.9,a-1.8],[g+.9,a],[g-.8,a+.3]],48);for(let o=0;o<16;o++){const p=(o+.5)/16*A,i=o/16*A,e=o===4;r.kind(0).col(S.chalk,1.03),r.bar([(g+.25)*Math.cos(p),1.6,(g+.25)*Math.sin(p)],[(g+.25)*Math.cos(p),a-2.4,(g+.25)*Math.sin(p)],.75,.62,6);const c=(e?2.7:1.5)/g,m=g+.06,y=(M,k)=>[m*Math.cos(i+M),k,m*Math.sin(i+M)],b=e?.05:5.5,x=e?9:15.5;r.kind(e?0:5).col(e?S.wood:S.dark,e?1.5:1),r.quad(y(-c,b),y(c,b),y(c,x),y(-c,x)),r.tri(y(-c,x),y(c,x),y(0,x+(e?3.2:2.6))),r.kind(5).col(S.dark,1);const f=a-5.2,w=[0,1,2,3,4,5].map(M=>y(Math.cos(M/6*A+.3)*1.1/g,f+Math.sin(M/6*A+.3)*1.15));for(let M=1;M<5;M++)r.tri(w[0],w[M],w[M+1])}const v=[],u=g-.8,s=17;for(let o=0;o<=9;o++){const p=o/9*Math.PI/2;v.push([Math.max(3.3,u*Math.pow(Math.max(Math.cos(p),0),.85)),a+.3+s*Math.sin(p)])}r.kind(0).col(S.slate,1.25),r.lathe(0,0,v,48),r.kind(1).col(S.ochre,1.15);for(let o=0;o<16;o++){const p=o/16*A,i=Math.cos(p),e=Math.sin(p);for(let c=0;c<9;c++)r.bar([(v[c][0]+.1)*i,v[c][1],(v[c][0]+.1)*e],[(v[c+1][0]+.1)*i,v[c+1][1],(v[c+1][0]+.1)*e],.3,.26,4)}const l=a+.3+s;r.kind(0).col(S.chalk,1),r.lathe(0,0,[[3.5,l-.6],[3.5,l+4.6],[4.2,l+5],[.4,l+8.4]],12),r.kind(5).col(S.dark,1);for(let o=0;o<6;o++){const p=(o+.5)/6*A,i=.22,e=3.56;r.quad([e*Math.cos(p-i),l+.6,e*Math.sin(p-i)],[e*Math.cos(p+i),l+.6,e*Math.sin(p+i)],[e*Math.cos(p+i),l+3.8,e*Math.sin(p+i)],[e*Math.cos(p-i),l+3.8,e*Math.sin(p-i)])}r.kind(1).col(S.copper,1),r.bar([0,l+8,0],[0,l+12.4,0],.35,.25,6),W.top=l+12.4+8.6,Ke[0].push({x:W.x,y:W.y+W.top,z:W.z,s:7.5,tilt:t.range(.34,.5),yaw:t.range(0,A),speed:t.range(.22,.32)*(t.chance(.5)?1:-1),ph:t.range(0,A)}),await _.yield();const h=(o,p,i,e,c,m,y)=>{for(let b=0;b<m;b++){const x=y+b/m*A,f=y+(b+.5)/m*A,w=y+(b+1)/m*A;r.tri([o,p,i],[o+e*Math.cos(x),p+e*Math.sin(x),i],[o+c*Math.cos(f),p+c*Math.sin(f),i]),r.tri([o,p,i],[o+c*Math.cos(f),p+c*Math.sin(f),i],[o+e*Math.cos(w),p+e*Math.sin(w),i])}};r.kind(1).col(S.ochre,1.2),h(0,16.6,g+.35,1.5,3.1,12,.13);for(const o of[-1,1]){const p=50+t.range(-1.5,1.5),i=p-t.range(3,5.5),e=15+t.range(-.4,.4),c=e+t.range(.8,1.8),m=o>0?[15,p,i,15]:[-p,-15,-15,-i],y=[9,9,-9,-9],b=[e,e,c,c],x=m.map((D,V)=>[D,0,y[V]]),f=m.map((D,V)=>[D,b[V],y[V]]);r.kind(0).col(S.stone,.97),r.hexa([...x,...f],S.slate,Y(S.stone,.97)),r.col(S.chalk,1.02),r.box(Math.min(m[0],m[1]),e-.9,9,Math.max(m[0],m[1]),e+.3,9.5);const w=[o*(20+t.range(-2,2)),c+5+t.range(-.5,.5),t.range(-1.5,.5)],M=[o*(43+t.range(-2,2)),c+4+t.range(-.5,.5),t.range(-1.5,.5)],k=f.map(D=>[D[0]+Math.sign(D[0]-o*32)*.7,D[1]+.3,D[2]*1.1]),z=D=>Math.abs(D[0]-w[0])<Math.abs(D[0]-M[0])?w:M,q=Y(S.slate,1);r.col(q,1);for(let D=0;D<4;D++){const V=(D+1)%4,P=z(k[D]),F=z(k[V]);P===F?r.tri(k[D],k[V],P,q,q,Y(q,1.2)):r.quad(k[D],k[V],F,P,q,Y(q,1.2))}for(let D=0;D<8;D++){const V=o*(17.6+4.25*D),P=9.07,F=t.range(-.35,.35),U=(D+(o>0?0:1))%3,J=11.6+t.range(-.2,.2);if(r.kind(5).col(S.dark,1),r.quad([V-.9,2.2,P],[V+.9,2.2+F*.3,P],[V+.9+F,7.2,P],[V-.9+F,7.2-F*.3,P]),U===0){const j=[0,1,2,3,4,5,6].map(dt=>[V+1.25*Math.cos(dt/7*A+F),J+1.3*Math.sin(dt/7*A+F),P]);for(let dt=1;dt<6;dt++)r.tri(j[0],j[dt],j[dt+1])}else U===1?r.tri([V-1.4,J-1.2,P],[V+1.4,J-1.2+F,P],[V+F*2,J+1.7,P]):r.quad([V-1.1,J+F,P],[V,J-1.7,P],[V+1.1,J,P],[V+F,J+1.7,P])}r.kind(0);for(let D=0;D<8;D++){const V=o*(16.6+4.64*D);r.col(S.chalk,1.02),r.bar([V,0,14],[V,9,14],.62,.5,8),r.box(V-.8,0,13.2,V+.8,.5,14.8)}r.col(S.stone,.95),r.box(o>0?15:-50.6,9,13.1,o>0?50.6:-15,10.3,14.9),r.box(o>0?15:-50.6,10.3,9,o>0?50.6:-15,10.6,15.2,Y(S.slate,1.1)),r.kind(1).col(S.ochre,1.2);for(let D=0;D<7;D++)h(o*(18.9+4.64*D),9.65,14.96,.24,.6,5,Math.PI/2+t.range(-.3,.3));await _.yield();const T=o*56.5,R=5.5,N=32+t.range(-2,2),E=t.range(-1.8,1.8),H=t.range(-1.8,1.8),I=t.range(-.3,.3),$=t.range(.78,.88),st=[[-R,R],[R,R],[R,-R],[-R,-R]].map(([D,V])=>[T+D*t.range(.9,1.08),0,V*t.range(.9,1.08)]),at=[[-R,R],[R,R],[R,-R],[-R,-R]].map(([D,V])=>[T+E+(D*Math.cos(I)+V*Math.sin(I))*$,N,H+(-D*Math.sin(I)+V*Math.cos(I))*$]);r.kind(0).col(S.stone,.92),r.hexa([...st,...at],S.slate,Y(S.stone,.92));for(let D=0;D<4;D++){const V=.2+.2*D,P=(U,J)=>[0,1,2].map(j=>B(B(st[0][j],st[1][j],U),B(at[0][j],at[1][j],U),J)+(j===2?.09:0)),F=t.range(-.05,.05);r.kind(5).col(S.dark,1),r.quad(P(.5+F,V-.045),P(.62+F,V),P(.5-F,V+.045),P(.38+F,V))}const vt=T+E,St=H;r.kind(0).col(S.chalk,1),r.lathe(vt,St,[[R*$+.9,N-.4],[R*$+.9,N+.8],[5,N+1],[4.4,N+3.4],[2.6,N+5.3],[.05,N+6.1]],14);const xt=t.range(0,A),jt=t.range(.6,1),zt=Math.cos(xt)*Math.cos(jt),Se=Math.sin(xt)*Math.cos(jt),de=Math.sin(jt);r.kind(1).col(S.copper,1),r.bar([vt+zt*1.5,N+2+de*1.5,St+Se*1.5],[vt+zt*8,N+2+de*8,St+Se*8],.5,.75,8,!0),r.bar([vt,N+6,St],[vt,N+9.2,St],.2,.14,5);const ft=W.toW(vt,St);Ke[1].push({x:ft[0],y:W.y+N+10.3,z:ft[1],s:3.4,tilt:t.range(.2,.5),yaw:t.range(0,A),speed:t.range(.3,.55)*(t.chance(.5)?1:-1),ph:t.range(0,A)}),W.towers.push({u:T,q:R+.5,h:N+4}),await _.yield()}r.pop(),await Mt()}const _t={pos:[],k:[],idx:[]},_o=Math.max(me.y,.36),be=[-me.x/_o,-me.z/_o],b0=t=>{const d=t.slice().sort((v,u)=>v[0]-u[0]||v[1]-u[1]),n=(v,u,s)=>(u[0]-v[0])*(s[1]-v[1])-(u[1]-v[1])*(s[0]-v[0]),g=[],a=[];for(const v of d){for(;g.length>=2&&n(g[g.length-2],g[g.length-1],v)<=0;)g.pop();g.push(v)}for(let v=d.length-1;v>=0;v--){const u=d[v];for(;a.length>=2&&n(a[a.length-2],a[a.length-1],u)<=0;)a.pop();a.push(u)}return g.pop(),a.pop(),g.concat(a)},Ae=t=>{const d=[];for(const[a,v,u]of t)d.push([a,v]),u>0&&d.push([a+be[0]*u,v+be[1]*u]);const n=b0(d),g=_t.pos.length/3;for(const[a,v]of n)_t.pos.push(a,et(a,v)+.16,v),_t.k.push(1);for(let a=1;a<n.length-1;a++)_t.idx.push(g,g+a+1,g+a)};{const t=Math.cos(W.yaw),d=Math.sin(W.yaw),n=be[0]*t-be[1]*d,g=be[0]*d+be[1]*t,a=W.drum,v=2,u=(m,y)=>Math.abs(m)<W.half&&y>W.back&&y<W.front,s=(m,y,b)=>{if(b<0)return u(m,y);const x=m*m+y*y,f=Math.abs(m);if(x<a*a&&b<24.3||b>=24.3&&x+(b-24.3)*(b-24.3)*.8<15.2*15.2||f>15&&f<50&&y>-9&&y<9&&b<17||f>15&&f<50.6&&y>=9&&y<15&&b>9&&b<10.6)return!0;for(const w of W.towers)if(Math.abs(m-w.u)<w.q&&Math.abs(y)<w.q&&b<w.h)return!0;return!1},l=(m,y)=>s(m,y,.5),h=new Map,o=(m,y,b)=>{const x=(m+500)*2e3+(y+500)*2+(b?1:0);if(h.has(x))return h.get(x);const f=m*v,w=y*v,M=W.toW(f,w),k=b?.05:et(M[0],M[1])-W.y;let z=0;for(let T=.75;T<62&&!z;T+=1.5)s(f-n*T,w-g*T,k+T)&&(z=1);const q={k:z,x:M[0],y:W.y+k+(b?.03:.16),z:M[1]};return h.set(x,q),q},p=Math.ceil(64*Math.hypot(n,g)/v)+2,i=Math.ceil((W.half+6)/v)+p,e=Math.floor((W.back-6)/v)-p,c=Math.ceil((W.front+8)/v)+p;for(let m=-i;m<i;m++){for(let y=e;y<c;y++){const b=(m+.5)*v,x=(y+.5)*v,f=u(b,x);if(f&&l(b,x)||!f&&Math.abs(b)<19.4&&x>W.front&&x<W.front+7.2)continue;const w=W.toW(b,x),M=Math.hypot(w[0],w[1]);if(M>L-4||M<G+2.5)continue;const k=[o(m,y,f),o(m+1,y,f),o(m+1,y+1,f),o(m,y+1,f)];if(!(k[0].k+k[1].k+k[2].k+k[3].k))continue;const z=_t.pos.length/3;for(const q of k)_t.pos.push(q.x,q.y,q.z),_t.k.push(q.k);_t.idx.push(z,z+2,z+1,z,z+3,z+2)}(m+i)%3===2&&await _.yield()}}const Eo=(t,d=1)=>{const n=t.pick([0,0,0,1,2,2,3,4]),g=t.range(.75,1.45)*d,a=t.range(0,1),v=t.range(0,1),u=t.range(0,1),s=n===1,l=(s?B(2.2,3,a):B(3.2,5.2,a))*g,h=(s?B(2.2,3,v):n===4?l/g:B(2.8,4.2,v))*g,o=s?B(11,15,u)*Math.sqrt(g):B(5,7.5,u)*g;return{kd:n,w:l,d:h,h:o,s:g,seed:t.int(0,999999)}},No=(t,d,n,g)=>{const a=Math.cos(n),v=Math.sin(n),u=et(t,d),s=g.w*1.14+.12*g.h,l=g.d*1.14+.12*g.h,h=[];for(const[o,p]of[[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0]])h.push([t+o*s*a+p*l*v,u+g.h*1.1,d-o*s*v+p*l*a]);return h.push([t,u+g.h*(g.kd===1?1.7:1.6)+2+2.4*g.s,d]),h},He=new C.Matrix4,k0=(t,d,n,g)=>{const a=_.core.makeRng(_.core.hashSeed("island/house:"+g.seed)),{kd:v,w:u,d:s,h:l,s:h}=g,o=et(t,d)-.7,p=Math.cos(n),i=Math.sin(n),e=a.range(-.12,.12),c=a.range(-.12,.12),m=a.range(-.13,.13),y=a.range(.84,.98),b=P=>{const F=P[0]+e*P[1],U=P[2]+c*P[1];return[t+F*p+U*i,d-F*i+U*p,P[1]-.7]},x=v===3?3:v===4?a.int(7,9):4,f=x===3?[[-u,s],[u,s*.5],[u*.1,-s*1.2]]:x===4?[[-u,s],[u,s],[u,-s],[-u,-s]]:Array.from({length:x},(P,F)=>{const U=Math.PI/2+Math.PI/x-F/x*A;return[u*.95*Math.cos(U),u*.95*Math.sin(U)]}),w=x>4?.04:.15,M=x>4?.03:.1,k=f.map(([P,F])=>[P*(1+a.range(-w,w)),0,F*(1+a.range(-w,w))]),z=k.map(P=>[(P[0]*Math.cos(m)+P[2]*Math.sin(m))*y,(l+.7)*(1+a.range(-M,M)),(-P[0]*Math.sin(m)+P[2]*Math.cos(m))*y]),q=a.range(0,1),T=Y(q<.6?S.stone:q<.75?Ve(S.stone,S.ochre,.3):q<.9?Ve(S.stone,S.ore,.2):Ve(S.stone,S.slate,.3),a.range(.86,1.04)),R=a.chance(.55)?Y(S.slate,a.range(.8,1.1)):a.chance(.6)?Y(S.ochre,a.range(.55,.75)):Y(S.ore,a.range(.6,.85));r.tr(t,o,d,n),r.push(He.set(1,e,0,0,0,1,0,0,0,c,1,0,0,0,0,1)),r.kind(0).col(T,1);for(let P=0;P<x;P++){const F=(P+1)%x;r.quad(k[P],k[F],z[F],z[P],Y(T,.93),T)}const N=Math.max(...z.map(P=>P[1])),E=l*(v===1?a.range(.4,.6):a.range(.3,.5)),H=x===4&&v!==1&&u>4.4,I=z.map(P=>[P[0]*1.13,P[1]-.25,P[2]*1.13]),$=a.range(-.4,.4)*u,st=a.range(-.4,.4)*s,at=H?[[-u*.55+$*.3,N+E*a.range(.8,1.1),st],[u*.55+$*.3,N+E*a.range(.8,1.1),st]]:[[$,N+E,st]],vt=P=>at.length>1&&P[0]>0?at[1]:at[0];r.col(R,1);for(let P=0;P<x;P++){const F=(P+1)%x,U=vt(I[P]),J=vt(I[F]);U===J?r.tri(I[P],I[F],U,R,R,Y(R,1.25)):r.quad(I[P],I[F],J,U,R,Y(R,1.25)),r.quad(I[P],z[P],z[F],I[F],Y(R,.6))}if(v!==1&&x<=4){const P=a.range(-.5,.5)*u*y,F=a.range(-.5,.5)*s*y,U=N-.6,J=E*a.range(.9,1.3)+.8,j=a.range(.35,.5)*Math.sqrt(h),dt=a.range(-.3,.3),Ut=a.range(-.3,.3);r.kind(0).col(T,.9),r.hexa([[P-j,U,F+j],[P+j,U,F+j*.8],[P+j,U,F-j],[P-j,U,F-j*.8],[P-j+dt,U+J,F+j+Ut],[P+j+dt,U+J,F+j*.8+Ut],[P+j+dt,U+J,F-j+Ut],[P-j+dt,U+J,F-j*.8+Ut]],S.dark,Y(T,.9))}const St=We(Math.round(l/3.3),1,4),xt=Math.sqrt(h);for(let P=0;P<x;P++){const F=(P+1)%x,U=k[F][0]-k[P][0],J=k[F][2]-k[P][2],j=Math.hypot(U,J)||1,dt=-J/j,Ut=U/j,mt=(lt,At,ct)=>[B(B(k[P][0],k[F][0],lt),B(z[P][0],z[F][0],lt),At)+dt*ct,B(B(k[P][1],k[F][1],lt),B(z[P][1],z[F][1],lt),At),B(B(k[P][2],k[F][2],lt),B(z[P][2],z[F][2],lt),At)+Ut*ct],ue=x>4?P%2?0:1:Math.max(1,Math.round(j/3.2)),qt=l+.7;for(let lt=0;lt<St;lt++)for(let At=0;At<ue;At++){const ct=P===0&&lt===0&&At===0,Wt=(At+.5)/ue+a.range(-.06,.06),Gt=Math.min(.4/ue,(ct?.62:a.range(.42,.58))*xt/j),Qt=a.range(-.05,.05),Xo=ct||lt===0?0:a.int(0,3),ee=ct?.72/qt:(lt+.4)/St,ze=ct?ee+2.3*xt/qt:(lt+.8)/St,Yo=.14/j,Zo=.14/qt,Jo=(ee+ze)/2,t0=(it,Rt)=>Xo===2?[mt(Wt-Gt-it,ee-it*.6,Rt),mt(Wt+Gt+it,ee-it*.6+Qt,Rt),mt(Wt+Qt*2,ze+it,Rt)]:Xo===3?[mt(Wt-Gt-it,Jo+Qt,Rt),mt(Wt,ee-it,Rt),mt(Wt+Gt+it,Jo,Rt),mt(Wt+Qt,ze+it,Rt)]:[mt(Wt-Gt-it,ee-it,Rt),mt(Wt+Gt+it,ee-it+Qt,Rt),mt(Wt+Gt+Qt+it,ze+it+Qt*.6,Rt),mt(Wt-Gt+Qt-it,ze+it-Qt,Rt)],oe=t0(Yo>Zo?Zo:Yo,.05),ae=t0(0,.09);if(r.kind(0).col(S.chalk,1.04),oe.length===3?r.tri(oe[0],oe[1],oe[2]):r.quad(oe[0],oe[1],oe[2],oe[3]),r.kind(ct?0:5).col(ct?S.wood:S.dark,ct?1.4:1),ae.length===3?r.tri(ae[0],ae[1],ae[2]):r.quad(ae[0],ae[1],ae[2],ae[3]),ct){const it=mt(Wt,ee,.5),Rt=mt(Wt+Gt+.45/j,ze-.2/qt,.3);r.kind(0).col(S.chalk,.95),r.box(it[0]-1*xt,.3,it[2]-.5,it[0]+1*xt,.74,it[2]+.5),r.kind(2).col(S.lamp,1),r.ball(Rt,.17,6)}}}const jt=[];if(v===2){const P=k[2],F=a.range(1.3,1.9)*xt,U=(l+.7)*a.range(1.25,1.6),J=a.range(-.14,.14),j=a.range(-.14,.14);r.pop(),r.push(He.set(1,J,0,0,0,1,0,0,0,j,1,0,0,0,0,1)),r.kind(0).col(T,.96),r.lathe(P[0]*.92,P[2]*.92,[[F,0],[F*.88,U]],7),r.col(R,1),r.lathe(P[0]*.92,P[2]*.92,[[F*.88+.4,U-.2],[.04,U+F*2.3]],7),r.kind(5).col(S.dark,1);for(let ue=0;ue<2;ue++){const qt=a.range(0,A),lt=F*.93,At=U*(.45+.3*ue),ct=.28;r.quad([P[0]*.92+lt*Math.cos(qt-ct),At,P[2]*.92+lt*Math.sin(qt-ct)],[P[0]*.92+lt*Math.cos(qt+ct),At+.2,P[2]*.92+lt*Math.sin(qt+ct)],[P[0]*.92+lt*Math.cos(qt+ct),At+1.5,P[2]*.92+lt*Math.sin(qt+ct)],[P[0]*.92+lt*Math.cos(qt-ct),At+1.3,P[2]*.92+lt*Math.sin(qt-ct)])}const dt=U+F*2.3,Ut=P[0]*.92+J*dt,mt=P[2]*.92+j*dt;jt.push([t+Ut*p+mt*i,d-Ut*i+mt*p,dt-.7]),r.pop(),r.push(He.set(1,e,0,0,0,1,0,0,0,c,1,0,0,0,0,1))}const zt=at[0],Se=a.int(0,3),de=1.2+.6*xt,ft=[zt[0],zt[1]+de,zt[2]],D=a.range(1.2,1.9)*xt,V=b([zt[0],zt[1]+de+1.15*D,zt[2]]);if(r.kind(1).col(S.copper,1),r.bar([zt[0],zt[1]-.4,zt[2]],ft,.09*xt,.07*xt,5),Se<2)Ke[Se].push({x:V[0],y:o+zt[1]+de+1.15*D,z:V[1],s:D,tilt:a.range(.2,.6),yaw:a.range(0,A),speed:a.range(.25,.7)*(a.chance(.5)?1:-1),ph:a.range(0,A)});else if(Se===2){const P=a.range(.3,.9),F=a.range(0,A),U=Math.cos(F)*Math.cos(P),J=Math.sin(F)*Math.cos(P),j=Math.sin(P);r.bar([ft[0]-U*1.1*D,ft[1]-j*1.1*D,ft[2]-J*1.1*D],[ft[0]+U*2*D,ft[1]+j*2*D,ft[2]+J*2*D],.14*D,.22*D,7,!0)}else{const P=a.range(0,A),F=[Math.cos(P),0,Math.sin(P)];r.hoop([ft[0],ft[1]+D,ft[2]],F,D,.06*D,14,4),r.bar([ft[0],ft[1],ft[2]],[ft[0]-F[2]*D,ft[1]+D+a.range(-.6,.6)*D,ft[2]+F[0]*D],.04*D,.04*D,4)}return r.pop(),r.pop(),Ae([...k.map(b).map(P=>[P[0],P[1],0]),...z.map(b),...at.map(b),...jt]),{x:t,z:d,r:(x===4?Math.hypot(u,s):Math.max(u,s)*1.25)*1.1,h:zt[1]+de+2.3*D}},ce=[];{const t=O.houses,d=qe.flat(),n=(f,w,M,k)=>{const z=Math.hypot(f,w);if(z<G+Ie+4+M||z>L-12-M)return!1;{const q=W.loc(f,w);if(Math.abs(q[0])<W.half+8+M&&q[1]>W.back-8-M&&q[1]<W.front+22+M)return!1}for(const q of $t){if(Math.hypot(f-q.x,w-q.z)<q.r+8+M)return!1;const T=Math.hypot(q.x,q.z);if(f*q.x+w*q.z>0&&Math.abs(f*q.z-w*q.x)/T<M+2.6)return!1}for(const q of d)if((q[0]-f)**2+(q[1]-w)**2<(M+k)**2)return!1;for(const q of ce)if((q.x-f)**2+(q.z-w)**2<(q.r+M+1.5)**2)return!1;return!0},g=[56,82,108,134,160,186],a=(f,w,M)=>{const k=Math.hypot(f,w);return k<60||k>205||Math.abs((k-56)%26-13)>Math.min(M,9)+1.2},v=1.5,u=(f,w,M,k)=>{const z=(k.kd===3||k.kd===4?Math.max(k.w,k.d)*1.25:Math.hypot(k.w,k.d))*1.1;if(!n(f,w,z,3)||!a(f,w,z*.8))return!1;for(const q of No(f,w,M,k))if(ot(q[0],q[1],q[2])<v*k.h)return!1;return ce.push(k0(f,w,M,k)),!0};for(const f of[-1,1]){let w=wt.rim+10+t.range(0,6),M=0;for(;w<wt.court;){const k=Eo(t,1.05),z=t.range(1.55,2),q=t.range(2.5,6),T=t.range(-.25,.25),R=k.w*1.14+.12*k.h,N=Math.round((w+R)/2.5),E=kt[N],H=kt[N+2],I=Math.hypot(H.x-E.x,H.z-E.z)||1,$=(H.x-E.x)/I,st=(H.z-E.z)/I,at=Math.atan2(st*f,-$*f)+T,vt=z*k.h+k.d*1.14+.12*k.h;let St=1e9;for(const jt of No(E.x-st*vt*f,E.z+$*vt*f,at,k))St=Math.min(St,ot(jt[0],jt[1],jt[2]));const xt=vt+Math.max(0,z*k.h-St)+.1;u(E.x-st*xt*f,E.z+$*xt*f,at,k),w+=2*R+q,M++,await Dt()}}await Mt();const s=Math.round(120*ut);let l=0;for(const f of g){let w=t.range(0,1);for(;w<A;){const M=Eo(t,1),k=f+t.range(-5,5),z=t.range(-.35,.35),q=t.chance(.5+.45*(ut-.75)/.35);w+=t.range(17,27)/f,q&&ce.length<s&&u(K(k*Math.cos(w)),k*Math.sin(w),Vt(-Math.cos(w),-Math.sin(w))+z,M),++l%3===0&&await Dt()}}await Mt();const h=O.topiary,o=[.035,.16,.05],p=["#d94f3d","#e8c23a","#e9e4f2","#7a4fb8","#e07aa8"].map(Ct),i=(f,w,M,k,z,q,T)=>{r.kind(0).col(o,T),k===0?r.lathe(f,M,[[q,w],[.05,w+z]],9):k===1?r.lathe(f,M,[[q*.8,w],[q*.8,w+z*.8],[.02,w+z*.8]],10):k===2?(r.lathe(f,M,[[q*.3,w],[q*.3,w+z*.4]],6),r.ball([f,w+z*.4+q*.8,M],q,8)):r.lathe(f,M,[[q,w],[q*.5,w+z*.36],[q*.85,w+z*.37],[q*.4,w+z*.7],[q*.6,w+z*.71],[.04,w+z]],8)},e=(f=1)=>({kd:h.int(0,1),r:h.range(4,8)*f,turn:h.range(0,A),fc:h.pick(p),fc2:h.pick(p),ck:h.int(0,3),ch:h.range(2.6,4.2),cr:h.range(.9,1.4),sh:h.range(.8,1.2)}),c=(f,w,M)=>{if(!n(f,w,M.r+.5,1.5)||ot(f,et(f,w)+M.ch,w)<M.ch+M.cr+5)return!1;const k=et(f,w),z=(et(f+2,w)-et(f-2,w))/4,q=(et(f,w+2)-et(f,w-2))/4;if(r.tr(f,k,w,0),r.push(He.set(1,0,0,0,z,1,q,0,0,0,1,0,0,0,0,1)),M.kd===0)r.kind(0).col(o,M.sh*1.15),r.lathe(0,0,[[M.r,-.3],[M.r,.9],[M.r-.8,.9],[M.r-.8,-.3]],22),r.col(M.fc,.9),r.lathe(0,0,[[M.r-1.5,.1],[M.r*.55,.1]],22),r.col(M.fc2,.9),r.lathe(0,0,[[M.r*.45,.1],[M.cr+.3,.1]],16),i(0,0,0,M.ck,M.ch,M.cr,M.sh);else{const T=[0,1,2].map(R=>[M.r*Math.cos(M.turn+R/3*A),M.r*Math.sin(M.turn+R/3*A)]);for(let R=0;R<3;R++){const N=T[R],E=T[(R+1)%3],H=Math.hypot(E[0]-N[0],E[1]-N[1]),I=-(E[1]-N[1])/H*.4,$=(E[0]-N[0])/H*.4;r.kind(0).col(o,M.sh*1.15),r.hexa([[N[0]-I,-.3,N[1]-$],[E[0]-I,-.3,E[1]-$],[E[0]+I,-.3,E[1]+$],[N[0]+I,-.3,N[1]+$],[N[0]-I,.9,N[1]-$],[E[0]-I,.9,E[1]-$],[E[0]+I,.9,E[1]+$],[N[0]+I,.9,N[1]+$]]),i(N[0]*.72,0,N[1]*.72,(M.ck+R)%2?0:2,M.ch*.7,M.cr*.75,M.sh)}r.col(M.fc,.9),r.tri([T[0][0]*.55,.1,T[0][1]*.55],[T[1][0]*.55,.1,T[1][1]*.55],[T[2][0]*.55,.1,T[2][1]*.55]),r.col(M.fc2,.9),r.lathe(0,0,[[M.r*.16,.14],[.02,.14]],9)}return r.pop(),r.pop(),Ae([[f-.8,w-.8,0],[f+.8,w-.8,0],[f+.8,w+.8,0],[f-.8,w+.8,0],[f,w,M.ch*.85]]),ce.push({x:f,z:w,r:M.r,h:M.ch}),!0};for(const f of[-1,1])for(let w=wt.rim+18;w<wt.court-6;w+=h.range(9,14)){const M=e(.5),k=Math.round(w/2.5),z=kt[k],q=kt[k+2],T=Math.hypot(q.x-z.x,q.z-z.z)||1,R=(5.5+M.r)*f;c(z.x-(q.z-z.z)/T*R,z.z+(q.x-z.x)/T*R,M)}await Mt();const m=Math.round(64*ut);for(let f=0;f<m;f++){const w=e(1),M=h.range(0,A),k=Math.sqrt(h.range(.04,.88))*L;c(K(k*Math.cos(M)),k*Math.sin(M),w),f%4===3&&await Dt()}for(const f of[-1,1]){const w=e(1),M=e(1);w.kd=0,w.r=8,M.kd=1,M.r=7.5,M.turn=Math.atan2(Tt[1],K(Tt[0]))+(f>0?0:Math.PI/3);const k=we(27,f*14.5),z=we(47,f*14);c(K(k[0]),k[1],w),c(K(z[0]),z[1],M)}await Dt();const y=(f,w)=>{const M=h.range(2.4,4.4),k=h.range(.9,1.5),z=h.int(0,3),q=h.range(.8,1.2),T=et(f,w)-.2;ot(f,T+M,w)<M+k+5||!n(f,w,k,1.2)||(i(f,T,w,z,M,k,q),Ae([[f-k*.7,w-k*.7,0],[f+k*.7,w-k*.7,0],[f+k*.7,w+k*.7,0],[f-k*.7,w+k*.7,0],[f,w,M*.85]]),ce.push({x:f,z:w,r:k,h:M}))};for(const f of $t){const w=Math.hypot(f.x,f.z),M=f.x/w,k=f.z/w;for(let z=G+Ie+6;z<L-14;z+=9)for(const q of[-1,1])y(M*z-k*4.5*q,k*z+M*4.5*q);for(let z=0;z<22;z++){const q=(z+.5)/22*A;y(f.x+(f.r+9.8)*Math.cos(q),f.z+(f.r+9.8)*Math.sin(q))}await Dt()}for(let f=13;f<Ue+6;f+=6.5)for(const w of[-1,1]){const M=we(f,w*10.5);y(K(M[0]),M[1])}await Dt();const b=O.bowltrees,x=Math.round(54*ut);for(let f=0;f<x;f++){const w=b.range(0,A),M=Math.sqrt(b.range(.05,.9))*L,k=b.range(6,9.5),z=b.range(2.2,3.4),q=b.range(.85,1.25),T=b.range(-.8,.8),R=b.range(-.8,.8),N=b.range(0,1),E=K(M*Math.cos(w)),H=M*Math.sin(w),I=et(E,H)-.2;if(!n(E,H,1.6,2)||!a(E,H,1.5)||ot(E,I+k-z,H)<z+8)continue;const $=Y(Ve([.05,.2,.05],[.16,.24,.04],N),q);r.kind(0).col(S.wood,1.3),r.bar([E,I,H],[E+T*.3,I+k-z,H+R*.3],.34,.22,6),r.col($,1),r.ball([E+T*.3,I+k-z*.9,H+R*.3],z,8,.85),r.col($,1.18),r.ball([E+T,I+k-z*.3,H+R],z*.66,7,.85),Ae([[E,H,0],[E-z*.75,H-z*.75,k-z],[E+z*.75,H-z*.75,k-z],[E+z*.75,H+z*.75,k-z],[E-z*.75,H+z*.75,k-z],[E+T,H+R,k]]),ce.push({x:E,z:H,r:1.6,h:k}),f%6===5&&await Dt()}await Mt()}{const t=O.stones,d=[.5,.5,.47];for(let n=0;n<qe.length;n++){const g=qe[n],a=n===0?1:3;for(let v=1;v<g.length-1;v++){const u=g[v],s=g[v-1],l=g[v+1],h=Math.hypot(l[0]-s[0],l[1]-s[1])||1,o=-(l[1]-s[1])/h,p=(l[0]-s[0])/h,i=t.chance(.5)?1:-1,e=t.range(1.5,2.3),c=t.range(.28,.6),m=t.range(.5,.8),y=t.range(.75,1.15);if(v%a===0){const w=u[0]+o*e*i,M=u[1]+p*e*i;r.kind(0).col(d,y),r.ball([w,et(w,M)+c*m*.3,M],c,5,m)}const b=Math.hypot(u[0],u[1]),x=Math.hypot(l[0],l[1]),f=69+26*Math.round((b-69)/26);if((b-f)*(x-f)<=0&&b!==x&&f>=69&&f<=199){const w=(f-b)/(x-b),M=B(u[0],l[0],w),k=B(u[1],l[1],w),z=et(M,k),q=Math.atan2(k,M);if(ot(M,z+2,k)>6){r.tr(M,z,k,Math.PI-q);for(let T=0;T<6;T++){const R=-3+T,N=E=>.15+.75*(1-E/3*(E/3));r.kind(0).col(S.stone,T%2?.86:.95),r.hexa([[-1.1,-.3,R],[1.1,-.3,R],[1.1,-.3,R+1],[-1.1,-.3,R+1],[-1.1,N(R),R],[1.1,N(R),R],[1.1,N(R+1),R+1],[-1.1,N(R+1),R+1]])}for(const T of[-1.1,1.1])r.col(S.chalk,1),r.bar([T,.5,-3],[T,1.3,0],.09,.09,4),r.bar([T,1.3,0],[T,.5,3],.09,.09,4);r.pop()}}}n%3===2&&await Dt()}for(const n of $t){const g=n.level-.45,a=8,v=t.range(0,A);r.kind(0).col(S.stone,.95),r.lathe(n.x,n.z,[[2.2,g-2.4],[1.6,g+.5],[.5,g+.7],[.4,g+1.9],[2.6,g+2.5],[2.7,g+2.7],[.5,g+2.6],[.35,g+3.8],[1.4,g+4.3],[1.45,g+4.45],[.2,g+4.4],[.14,g+5.3]],12),r.kind(1).col(S.copper,1),r.ball([n.x,g+5.5,n.z],.26,6),r.kind(0).col([.78,.9,.97],1);for(let u=0;u<a;u++){const s=v+u/a*A,l=Math.cos(s),h=Math.sin(s);for(let o=0;o<5;o++){const p=o/5,i=(o+1)/5,e=c=>[n.x+l*(1.4+4.6*c),g+4.4+2.6*c-7*c*c,n.z+h*(1.4+4.6*c)];r.bar(e(p),e(i),.05+.03*p,.05+.03*i,4)}}}await Mt()}{const t=O.townfolk,d=[.3,.27,.22],n=()=>({kd:t.pick([0,0,0,1,2,3,4]),ws:[0,1,2,3].map(()=>({...Lt(t),rich:t.range(.1,6)})),turn:t.range(-.6,.6),back:t.chance(.6)}),g=(l,h,o)=>{if(ot(l,h+2.3,o)<5||Math.hypot(l,o)<G+2.2)return!1;for(const p of ce)if((p.x-l)**2+(p.z-o)**2<(p.r+1.2)**2)return!1;for(const p of $t)if(Math.hypot(l-p.x,o-p.z)<p.r+1)return!1;for(const p of qe)for(const i of p)if((i[0]-l)**2+(i[1]-o)**2<4)return!1;return!0},a=[[[0,0,0,0,0,1],[-.55,-.8,.25,4,1,0]],[[-.75,0,Math.PI/2,0,0,1],[.75,0,-Math.PI/2,2,0,1],[-1.5,-.75,.9,4,1,0],[1.5,-.75,-1.5,4,1,0]],[[-1.15,0,.2,6,2,1],[0,.35,0,5,3,1],[1.15,0,-.5,3,0,1]],[[0,0,0,7,0,1],[.35,1.25,Math.PI,4,4,0],[-.95,.85,2.3,4,5,0]],[[0,0,0,2,0,1],[-.6,-.8,.3,4,1,0]]],v=(l,h,o,p,i)=>{const e=Math.cos(o),c=Math.sin(o),m=a[p.kd].map((y,b)=>{const x=l+y[0]*e+y[1]*c,f=h-y[0]*c+y[1]*e;return{m:y,px:x,pz:f,py:i(x,f),w:p.ws[b]}});for(const y of m)if(!g(y.px,y.py,y.pz))return!1;for(const y of m){const b={...y.w,prop:y.m[4],rich:y.m[5]?y.w.rich:0,c:y.m[5]?y.w.c:d};Pt(r,y.px,y.py,y.pz,o+y.m[2],b,y.m[3]),i===u&&Ae([[y.px-.3,y.pz-.3,0],[y.px+.3,y.pz-.3,0],[y.px+.3,y.pz+.3,0],[y.px-.3,y.pz+.3,0],[y.px,y.pz,1.7*b.h]])}if(p.kd===2){const y=l+1.3*e+.55*c,b=h-1.3*c+.55*e,x=i(y,b);r.tr(y,x,b,o-.5),r.kind(1).col(S.ochre,1.2),r.bar([0,0,0],[0,1.5,.1],.04,.03,4),r.bar([0,1.5,.1],[.75,1.2,0],.035,.03,4),r.bar([.75,1.2,0],[.06,.08,0],.03,.03,4),r.kind(0).col(S.chalk,1);for(let f=1;f<5;f++)r.bar([.15*f,1.5-.07*f,.06],[.15*f,.1+.26*f,0],.008,.008,3);r.pop()}return!0},u=(l,h)=>et(l,h);let s=0;for(let l=wt.rim+16;l<wt.kerb-12;l+=t.range(6,10)){const h=n(),o=t.chance(.5)?1:-1,p=t.range(4,7.2)*o,i=Math.round(l/2.5),e=kt[i],c=kt[i+2],m=Math.hypot(c.x-e.x,c.z-e.z)||1,y=(c.x-e.x)/m,b=(c.z-e.z)/m;v(e.x-b*p,e.z+y*p,Math.atan2(y,b)+(h.back?0:Math.PI)+h.turn,h,u)&&s++,s%4===3&&await Dt()}for(let l=0;l<Math.round(12*ut);l++){const h=n(),o=t.range(0,A),p=G+t.range(4.5,9.5);v(K(p*Math.cos(o)),p*Math.sin(o),Vt(-Math.cos(o),-Math.sin(o))+h.turn*2,h,u)}await Dt();for(let l=0;l<4;l++){const h=n(),o=t.range(-15,15),p=t.range(15,18.5),i=W.toW(o,p);v(i[0],i[1],W.yaw+h.turn,h,()=>W.y)}for(let l=0;l<Math.round(26*ut);l++){const h=t.range(0,A),o={...Lt(t),rich:t.range(.1,6)},p=t.chance(.75)?3:2,i=K((G+1.75)*Math.cos(h)),e=(G+1.75)*Math.sin(h);ot(i,ht+2.6,e)<5||Pt(r,i,ht+.35,e,Vt(-Math.cos(h),-Math.sin(h)),o,p)}await Mt()}const te=[],$e=[];let ke=null;{const t=O.townwalk,d=Math.round((wt.rim+12)/2.5),n=Math.round((wt.kerb-14)/2.5);for(let u=d;u<=n;u++){const s=kt[u],l=kt[u+1],h=Math.hypot(l.x-s.x,l.z-s.z)||1;$e.push([s.x,et(s.x,s.z),s.z,(l.x-s.x)/h,(l.z-s.z)/h])}for(let u=0;u<Math.round(30*ut);u++)te.push({lat:t.range(.8,2.4)*(t.chance(.5)?1:-1),v:t.range(1,1.5)/2.5,ph:t.range(0,2*(n-d)),h:t.range(.92,1.08),c:t.pick(S.robes),tone:t.range(.7,1)});const g=Math.atan2(ge[1],K(ge[0]));for(let u=0;u<Math.round(24*ut);u++){const s=G+t.range(3.5,9),l={ring:s,v:t.range(1,1.5)/s,ph:t.range(0,2),h:t.range(.92,1.08),c:t.pick(S.robes),tone:t.range(.7,1),ys:[]};for(let h=0;h<=20;h++){const o=g+Math.PI/6+h/20*(A-Math.PI/3);l.ys.push(et(s*Math.cos(o),s*Math.sin(o)))}te.push(l)}const a=Yt();Pt(a,0,0,0,0,{h:1,c:[1,1,1],tone:1,tilt:.1,skin:1.6,rich:1}),ke=new C.InstancedMesh(a.build(),ie,te.length);const v=new C.Color;te.forEach((u,s)=>ke.setColorAt(s,v.setRGB(u.c[0]*u.tone,u.c[1]*u.tone,u.c[2]*u.tone))),ke.frustumCulled=!1,tt.add(ke),te.aK=g,await _.yield()}const Lo=t=>{const d=$e.length-1,n=A-Math.PI/3;for(let g=0;g<te.length;g++){const a=te[g];let v,u,s,l;if(a.ring){const h=(t*a.v/n+a.ph)%2,o=h<1?h:2-h,p=te.aK+Math.PI/6+o*n,i=o*20,e=Math.min(19,Math.floor(i)),c=h<1?1:-1;v=a.ring*Math.cos(p),s=a.ring*Math.sin(p),u=B(a.ys[e],a.ys[e+1],i-e),l=Math.atan2(-Math.sin(p)*c,Math.cos(p)*c)}else{const h=(t*a.v+a.ph)%(2*d),o=h<d?h:2*d-h,p=Math.min(d-1,Math.floor(o)),i=o-p,e=$e[p],c=$e[p+1],m=h<d?1:-1;v=B(e[0],c[0],i)-e[4]*a.lat,s=B(e[2],c[2],i)+e[3]*a.lat,u=B(e[1],c[1],i),l=Math.atan2(e[3]*m,e[4]*m)}u+=.035*Math.abs(Math.sin(t*5.2+g*1.7)),Le.compose(Ro.set(v,u,s),Wo.setFromEuler(To.set(0,l,0)),Io.set(a.h,a.h,a.h)),ke.setMatrixAt(g,Le)}ke.instanceMatrix.needsUpdate=!0};Lo(0);{const t=O.figures,d=Math.round(70*ut);for(let h=0;h<d;h++){const o=t.pick($t),p=Math.hypot(o.x,o.z),i=t.range(G+8,L-12),e=t.range(-1.1,1.1),c=t.chance(.3),m=t.range(0,A),y=t.chance(.45),b=c?o.x+(o.r+4.5+e)*Math.cos(m):o.x/p*i-o.z/p*e,x=c?o.z+(o.r+4.5+e)*Math.sin(m):o.z/p*i+o.x/p*e,f=Lt(t),w=Lt(t),M=t.range(0,A);Math.hypot(b-o.x,x-o.z)<o.r+2.5||ot(b,et(b,x)+1,x)<25||(Pt(r,b,et(b,x),x,M,f),y&&Pt(r,b+.7,et(b+.7,x+.6),x+.6,M+.4,{...w,prop:1,c:[.3,.27,.22]},4),h%24===23&&await _.yield())}await _.yield();const n=O.kites,g=Math.round(11*ut),a=n.range(0,A),v=[Math.cos(a),Math.sin(a)];for(let h=0;h<g;h++){const o=n.range(0,A),p=n.range(45,L-25),i=n.range(26,56),e=i*n.range(.4,.8),c=n.range(0,A),m=n.pick(S.cloth),y=n.range(1.3,2),b=p*Math.cos(o),x=p*Math.sin(o),f=et(b,x)+1.2,w=[b+v[0]*e,f+i,x+v[1]*e];let M=Math.hypot(w[0],w[2])<L-10;for(let k=0;M&&k<=1;k+=.1)ot(B(w[0],b,k),B(w[1],f,k),B(w[2],x,k))<8+(y+4)*(1-k)&&(M=!1);M&&(no(w,[b,f,x],4,.03,c,[.62,.6,.55],10),ye(w,[b,f,x],4,c,2,0,y,0,m),ye(w,[b,f,x],4,c,2,0,y*.3,.035,[.9,.86,.7]))}await _.yield(),r.kind(0).col(S.stone,.95),r.lathe(0,0,[[L-.8,gt-.2],[L-.8,gt+1],[L-.1,gt+1],[L-.1,gt-.4]],144);const u=O.pennants,s=Math.round(A*L/10),l=(h,o,p,i,e,c,m,y)=>{if(!(ot(h,o+e,p)<7+c||ot(h,o+e*.5,p)<7)){r.tr(h,o,p,i),r.kind(0).col(S.wood,1.6),r.bar([0,0,0],[0,e,0],.09,.06,5);for(let b=0;b<6;b++){const x=b/6,f=(b+1)/6;Ne(r,[[x*c,e-.1-x*.35,0],[x*c,e-1.4+x*.35,0],[f*c,e-1.4+f*.35,0],[f*c,e-.1-f*.35,0]],[x*.9,x*.9,f*.9,f*.9],[0,0,1],b%2?y:m)}r.pop()}};for(let h=0;h<s;h++){const o=(h+u.range(.2,.8))/s*A,p=u.range(6,8.5),i=u.range(4,6.5),e=u.pick(S.cloth),c=u.pick(S.cloth),m=L-.45;l(m*Math.cos(o),gt+1,m*Math.sin(o),Math.PI/2-o,p,i,e,c),h%20===19&&await Dt()}for(let h=16;h<Ue+12;h+=9)for(const o of[-1,1]){const p=u.range(9,10.5),i=u.range(6,7.5),e=u.pick(S.cloth),c=u.pick(S.cloth),m=we(h,o*15.5),y=K(m[0]);l(y,et(y,m[1])-.2,m[1],Vt(Tt[0],Tt[1])+Math.PI/2,p,i,e,c)}await _.yield()}const Bo=[];{const t=[Yt(),Yt()];t[0].kind(1).col(S.copper,1),t[0].hoop([0,0,0],[0,0,1],1,.05,16,4).hoop([0,0,0],[1,0,0],.92,.05,16,4).hoop([0,0,0],[0,1,0],.84,.05,16,4),t[0].bar([0,-1.15,0],[0,1.15,0],.035,.035,4).ball([0,0,0],.2,6),t[1].kind(1).col(S.copper,1),t[1].ball([0,0,0],.3,8).bar([-1.25,0,0],[.95,0,0],.035,.035,4).bar([0,0,-.7],[0,0,1.05],.035,.035,4),t[1].ball([-1.25,0,0],.17,6).ball([.95,0,0],.12,6).ball([0,0,1.05],.14,6).ball([0,0,-.7],.09,6);const d=new C.Euler;for(let n=0;n<2;n++){const g=Ke[n];if(!g.length)continue;const a=new C.InstancedMesh(t[n].build(),ie,g.length);for(const v of g)v.q=new C.Quaternion().setFromEuler(d.set(v.tilt*(n?.3:1),v.yaw,0,"YXZ"));a.frustumCulled=!1,tt.add(a),Bo.push({mesh:a,list:g})}}const S0=new C.Matrix4,Ko=new C.Quaternion,z0=new C.Quaternion,C0=new C.Vector3,P0=new C.Vector3,q0=new C.Vector3(0,1,0),Ho=t=>{for(const{mesh:d,list:n}of Bo){for(let g=0;g<n.length;g++){const a=n[g];Ko.copy(a.q).multiply(z0.setFromAxisAngle(q0,t*a.speed+a.ph)),d.setMatrixAt(g,S0.compose(C0.set(a.x,a.y,a.z),Ko,P0.set(a.s,a.s,a.s)))}d.instanceMatrix.needsUpdate=!0}};if(Ho(0),_t.idx.length){const t=new C.BufferGeometry;t.setAttribute("position",new C.Float32BufferAttribute(_t.pos,3)),t.setAttribute("aK",new C.Float32BufferAttribute(_t.k,1)),t.setIndex(_t.idx);const d=bt?Q(.72,.76,.86):Et?Q(.42,.42,.62):Q(.4,.5,.66),n=new C.Mesh(t,new C.ShaderMaterial({uniforms:{uShadeCol:{value:d}},vertexShader:Z0,fragmentShader:J0,transparent:!0,depthWrite:!1,blending:C.MultiplyBlending,side:C.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));n.renderOrder=1,tt.add(n)}await _.yield();const Bt=[];let he=null;{const t=O.boats,d=Yt(),n=9,g=i=>{const e=[-4,.9,1.3*i],c=[.6,.85,1.65*i],m=[-3.6,-.5,.5*i],y=[.6,-.6,.7*i],b=[4.7,1.25,0],x=[3.9,-.4,0];return d.kind(0).col([.2,.12,.07],1),d.quad(m,y,c,e),d.tri(y,x,b),d.tri(y,b,c),[e,c,m,b]},a=g(-1),v=g(1);d.quad(a[2],v[2],v[0],a[0]),d.col([.55,.43,.27],1),d.quad([a[0][0],.6,a[0][2]],[v[0][0],.6,v[0][2]],[v[1][0],.6,v[1][2]],[a[1][0],.6,a[1][2]]),d.tri([a[1][0],.6,a[1][2]],[v[1][0],.6,v[1][2]],[4.2,.9,0]),d.col([.3,.2,.12],1),d.bar([.3,.5,0],[.3,n,0],.1,.05,5),d.bar([.3,8.5,0],[-3.6,6.6,.5],.05,.04,4),d.col(S.sail,1),d.quad([.3,8.4,.06],[.3,1.9,.06],[-3.5,2.1,.7],[-3.5,6.5,.5]),d.tri([.45,7.4,0],[4.6,1.6,0],[.5,2,0]);const u=4.7,s=3.3,l=(i,e,c)=>{const m=K(i),y={x:m,z:e,head:c.range(0,A),ph:c.range(0,A),tint:c.range(.75,1.15)};if(!(i-Kt(e)<30||ot(m,5,e)<u+2.5*s)){for(const b of Bt)if((b.x-m)**2+(b.z-e)**2<900)return;Bt.push(y)}};for(const[i,e]of Do){const c=K(i),m={x:c,z:e,head:t.range(0,A),ph:t.range(0,A),tint:t.range(.75,1.15),crew:[Lt(t),Lt(t)]};if(ot(c,5,e)<u+2.5*s||Bt.some(b=>(b.x-c)**2+(b.z-e)**2<900))continue;const y=Yt();Pt(y,-1.2,.6,0,-Math.PI/2,m.crew[0],2),Pt(y,-2.9,.6,.2,Math.PI/2,m.crew[1],0),m.mesh=new C.Mesh(y.build(),ie),m.mesh.matrixAutoUpdate=!1,m.mesh.frustumCulled=!1,tt.add(m.mesh),Bt.push(m)}const h=O.anchorage,o=O.scatter;for(let i=h.range(15,40);i<wt.edgeIn;i+=h.range(40,55)){const e=kt[Math.round(i/2.5)],c=(u+n*h.range(1.5,2))*(h.chance(.5)?1:-1),m=h.range(-6,6);l(nt*e.x+c,e.z+m,h)}const p=Math.min(24,Bt.length+Math.round(13*ut));for(let i=0;i<60&&Bt.length<p;i++){const e=o.range(-1.9,1.9),c=o.range(60,560);l(c*Math.cos(e),c*Math.sin(e),o)}if(Bt.length){he=new C.InstancedMesh(d.build(),ie,Bt.length);const i=new C.Color;Bt.forEach((e,c)=>{he.setColorAt(c,i.setRGB(e.tint,e.tint,e.tint)),c<24&&yo.value[c].set(e.x,e.z,-e.head,1+e.ph)}),he.frustumCulled=!1,tt.add(he)}if(me.y>.05){const i=new C.PlaneGeometry(6400,6400).rotateX(-Math.PI/2),e=new C.Mesh(i,Ft(Te,ta,{uShadeCol:{value:bt?Q(.7,.74,.84):Et?Q(.5,.46,.6):Q(.42,.52,.7)}},{transparent:!0,depthWrite:!1,blending:C.MultiplyBlending}));e.position.set(0,1.3,0),e.renderOrder=3,tt.add(e)}await _.yield()}const $o=new C.Matrix4,A0=new C.Quaternion,Vo=new C.Euler,W0=new C.Vector3,R0=new C.Vector3(1,1,1),jo=t=>{if(he){for(let d=0;d<Bt.length;d++){const n=Bt[d];Vo.set(.07*Math.sin(t*.9+n.ph),n.head,.05*Math.sin(t*.7+n.ph*1.7),"YXZ"),he.setMatrixAt(d,$o.compose(W0.set(n.x,ao.heightAt(n.x,n.z,t)-.15,n.z),A0.setFromEuler(Vo),R0)),n.mesh&&n.mesh.matrix.copy($o)}he.instanceMatrix.needsUpdate=!0}};jo(0);{const t=O.village,d=-190+t.range(-25,25),n=Kt(d)-80,g=(o,p,i,e,c,m,y,b)=>{const x=K(o),f=le(o,p)-.3;r.tr(x,f,p,nt>0?i:Math.PI-i),r.kind(0).col(b,1),r.box(-e,0,-c,e,m,c);const w=c*.95;r.col(y,1),r.quad([-e-.3,m-.2,c+.35],[e+.3,m-.2,c+.35],[e+.3,m+w,0],[-e-.3,m+w,0]),r.quad([e+.3,m-.2,-c-.35],[-e-.3,m-.2,-c-.35],[-e-.3,m+w,0],[e+.3,m+w,0]),r.col(b,.92),r.tri([-e,m,c],[-e,m,-c],[-e,m+w,0]),r.tri([e,m,-c],[e,m,c],[e,m+w,0]),r.kind(5).col(S.dark,1),r.quad([-e*.5,m*.35,c+.05],[-e*.2,m*.35,c+.05],[-e*.2,m*.7,c+.05],[-e*.5,m*.7,c+.05]),r.quad([e*.2,m*.35,c+.05],[e*.5,m*.35,c+.05],[e*.5,m*.7,c+.05],[e*.2,m*.7,c+.05]),r.pop()},a=Math.round(38*ut),v=[],u=[],s=[];for(let o=0;o<a*3&&v.length<a;o++){const p=t.range(0,A),i=70*Math.sqrt(t()),e=n+i*Math.cos(p)*.8,c=d+i*Math.sin(p)*1.3,m=t.range(3,4.6),y=t.range(2.2,3),b=t.range(2.6,3.8),x=t.pick([0,Math.PI/2])+t.range(-.25,.25),f=t.chance(.6),w=t.range(0,1),M=t.range(.8,1.05),k=f?Y(S.ore,B(.7,1,w)):Y(S.ochre,B(.5,.75,w));Kt(c)-e<26||v.some(z=>(z[0]-e)**2+(z[1]-c)**2<121)||(v.push([e,c]),u.push({xc:e,z:c,yaw:x,w:m+.3,d:y+.35,c:k}),g(e,c,x,m,y,b,k,Y(S.chalk,M)))}{const o=K(n),p=le(n,d)-.3;v.push([n,d]),r.tr(o,p,d,.3),r.kind(0).col(S.chalk,.95),r.box(-7,0,-3,5,6,3,Y(S.slate,.9)),r.box(5,0,-2.6,10,15,2.6),r.col(S.slate,.9),r.lathe(7.5,0,[[3.6,15],[.05,26]],4,Math.PI/4,Math.PI/4+A),r.quad([-7,6,3],[5,6,3],[5,9.5,0],[-7,9.5,0]),r.quad([5,6,-3],[-7,6,-3],[-7,9.5,0],[5,9.5,0]),r.pop()}await _.yield();const l=O.trees,h=Math.round(170*ut);for(let o=0;o<h;o++){const p=l.range(-760,620),i=Kt(p)-l.range(34,620),e=l.range(4.5,10),c=l.range(.7,1.15),m=[l.range(-.12,.12)*e,l.range(-.12,.12)*e],y=[0,1].map(()=>[l.range(0,A),l.range(.3,.45),l.range(.36,.48),l.range(.55,.8)]),b=K(i),x=le(i,p),f=e*.5;if(v.some(M=>(M[0]-i)**2+(M[1]-p)**2<49)||ot(b,x+e,p)<f*6)continue;const w=[b+m[0],x+e*.62,p+m[1]];r.kind(0).col([.16,.1,.06],1),r.bar([b,x-.3,p],w,e*.06,e*.035,5),r.col([.045,.19,.05],c),r.ball([w[0],w[1]+e*.22,w[2]],f,7,.8);for(const[M,k,z,q]of y)r.col([.06,.24,.06],c*.9),r.ball([w[0]+Math.cos(M)*e*k,w[1]+e*(q-.62)*.6,w[2]+Math.sin(M)*e*k],e*z,6,.75);s.push({xc:i+nt*m[0],z:p+m[1],r:f,s:e,sh:c,lobes:y}),o%12===11&&await Dt()}await Mt();{const o=io<1?1024:2048,p=document.createElement("canvas");p.width=p.height=o;const i=p.getContext("2d"),e=o/re[2];i.setTransform(e,0,0,-e,-re[0]*e,o+re[1]*e);const c=(x,f=1)=>"rgb("+x.map(w=>Math.round(255*Math.pow(We(w*f,0,1),1/2.2))).join(",")+")",m=[Math.cos(De),Math.sin(De)],y=1/Math.tan(Ce);i.fillStyle="rgba(8,16,14,0.5)";for(const x of s)i.beginPath(),i.ellipse(x.xc-m[0]*x.s*y*.8,x.z-m[1]*x.s*y*.8,x.r*1.2,x.r*1.2,0,0,A),i.fill();for(const x of u){i.save(),i.translate(x.xc,x.z),i.rotate(-x.yaw);const f=Math.sin(x.yaw)*m[0]+Math.cos(x.yaw)*m[1];i.fillStyle=c(x.c,.8+.3*f),i.fillRect(-x.w,0,2*x.w,x.d),i.fillStyle=c(x.c,.8-.3*f),i.fillRect(-x.w,-x.d,2*x.w,x.d),i.restore()}i.save(),i.translate(n,d),i.rotate(-.3),i.fillStyle=c(S.slate,.95),i.fillRect(-7,0,12,3),i.fillStyle=c(S.slate,.7),i.fillRect(-7,-3,12,3),i.fillStyle=c(S.chalk,.9),i.fillRect(5,-2.6,5,5.2),i.fillStyle=c(S.slate,.85),i.beginPath(),i.moveTo(7.5,-3.4),i.lineTo(10.9,0),i.lineTo(7.5,3.4),i.lineTo(4.1,0),i.fill(),i.restore(),await _.yield();for(let x=0;x<s.length;x++){const f=s[x];x%60===59&&await _.yield(),i.fillStyle=c([.045,.19,.05],f.sh*.8),i.beginPath(),i.arc(f.xc,f.z,f.r,0,A),i.fill();for(const[w,M,k]of f.lobes)i.fillStyle=c([.06,.24,.06],f.sh*.95),i.beginPath(),i.arc(f.xc+nt*Math.cos(w)*f.s*M,f.z+Math.sin(w)*f.s*M,f.s*k,0,A),i.fill();i.fillStyle=c([.1,.34,.09],f.sh),i.beginPath(),i.arc(f.xc+m[0]*f.r*.3,f.z+m[1]*f.r*.3,f.r*.55,0,A),i.fill()}await _.yield();const b=new C.CanvasTexture(p);b.colorSpace=C.SRGBColorSpace,b.anisotropy=v0,Mo.value=b}await _.yield()}const Oo=T0({rng:O.clouds,sky:Nt,count:12,altitude:150,altitudeJitter:110,center:[0,0,0],extent:[2e3,2e3],size:[150,280],avoid:[[0,gt+80,0,L+85,-20,L+85]],wind:[nt*1.3,0,.5]});tt.add(Oo.object),await _.yield();const ro=t=>new C.Color(t.x,t.y,t.z),Uo=e0.makeFauna(tt,{light:{sunDir:me.clone(),sunColor:ro(se.sun),sunIntensity:bt?1:1.6,sky:ro(se.sky),skyIntensity:1.5,ground:ro(se.ground),groundIntensity:1.5}});{const t=(v,u,s,l,h)=>{const o=[];for(let p=0;p<10;p++){const i=p/10*A;o.push([K(v+l*Math.cos(i)),u+h*Math.sin(2*i),s+l*Math.sin(i)])}return o},d=(v,u,s,l)=>{for(const h of l)if(ot(h[0],h[1],h[2])<s[0]+17)return;Uo.add(e0.makeFlock({rng:v,species:"gulls",count:u,spread:s,route:l,closed:!0}))},n=Math.round(24*ut),g=rt.a2+rt.sweepC*.5;d(O.gulls,n,[20,8,30],t((wo+95)*Math.cos(g),112,(wo+95)*Math.sin(g),40,14)),await _.yield(),d(O.gulls2,n,[24,8,30],t(0,ht+62,0,72,6)),await _.yield();const a=kt[Math.round(wt.edgeIn/2/2.5)];d(O.gulls3,Math.round(n*.7),[16,6,20],t(nt*a.x+75,36,a.z,28,5));{const v=rt.aF0+Math.PI/12;d(O.gulls4,Math.round(n*.8),[12,5,16],t((L+60)*Math.cos(v),gt+14,(L+60)*Math.sin(v),18,4))}}if(await _.yield(),Fe){const t=O.fall,d=rt.a2+rt.sweepC*t.range(.35,.65),n=Math.cos(d),g=Math.sin(d),a=t.range(3.2,4.6),v=[],u=[],s=[],l=28;let h=!0;for(let p=0;p<=l;p++){const i=p/l,e=i*(gt+1),c=gt+1.2-e,m=L-.4+9*Math.sqrt(Math.min(1,e/26))+.012*e,y=a*(1+.7*i);ot(K(m*n),c,m*g)<12+y&&(h=!1);for(const b of[-1,1])v.push(K(m*n-g*y*b),c,m*g+n*y*b),u.push(e,b,y)}const o=[];for(let p=0;p<=9;p++){const i=L-34+p*3.75,e=K(i*n),c=i*g;o.push([e,Math.max(et(e,c)+.16,i>L-2?gt+1.15:0),c])}if(h){for(let x=0;x<l;x++){const f=x*2;s.push(f,f+1,f+2,f+1,f+3,f+2)}const p=v.length/3;o.forEach((x,f)=>{for(const w of[-1,1])v.push(x[0]-nt*g*a*.8*w,x[1],x[2]+n*a*.8*w),u.push(f*3.75,w,a*.8)});const i=new C.BufferGeometry;i.setAttribute("position",new C.Float32BufferAttribute(v,3)),i.setAttribute("aFlow",new C.Float32BufferAttribute(u,3));const e=i.clone(),c=i;e.setIndex(s);const m=[];for(let x=0;x<9;x++){const f=p+x*2;m.push(f,f+1,f+2,f+1,f+3,f+2)}c.setIndex(m);const y=new C.Mesh(e,Ft(Qe,Xe,{...Be,uMode:{value:2},uFlowK:{value:1},uDrops:{value:so}},{transparent:!0,depthWrite:!1,side:C.DoubleSide})),b=new C.Mesh(c,Ft(Qe,Xe,{...Be,uMode:{value:0},uFlowK:{value:1},uDrops:{value:so}},{transparent:!0,depthWrite:!1,side:C.DoubleSide}));y.renderOrder=4,b.renderOrder=2,tt.add(y,b)}await _.yield()}await Mt();const Go={value:2/720};{const t=new C.BufferGeometry;t.setAttribute("position",new C.Float32BufferAttribute(yt.pos,3)),t.setAttribute("aB",new C.Float32BufferAttribute(yt.b,3)),t.setAttribute("aP",new C.Float32BufferAttribute(yt.p,4)),t.setAttribute("aQ",new C.Float32BufferAttribute(yt.q,4)),t.setAttribute("color",new C.Float32BufferAttribute(yt.col,3)),t.setIndex(yt.idx),t.boundingSphere=new C.Sphere(new C.Vector3(0,100,0),L+120);const d=new C.Mesh(t,Ft(Q0,X0,{uPixH:Go},{vertexColors:!0,side:C.DoubleSide,transparent:!0}));d.renderOrder=3,tt.add(d)}const Qo=new C.Vector2;await _.yield();const lo=rt.toCave([X.r*Math.cos(X.aFar),X.yEnd,X.r*Math.sin(X.aFar)]),fe=await D0(_,{hand:nt,plan:Ht.cave,density:Zt.density,rare:Fe,landing:[nt*lo[0],lo[1],lo[2]]});return fe.object.position.set(K(rt.stone[0]),Re,rt.stone[1]),fe.object.rotation.y=-nt*rt.psi,tt.add(fe.object),fe.setPortalLight("#ffe2b0",1.1),fe.setLight(null,bt?Q(.07,.1,.2):Et?Q(.5,.4,.42):Q(.3,.46,.8)),await _.yield(),await Nt.prewarm(_.renderer,null,tt),{scene:tt,path:p0,duration:Ht.duration,info:{hand:nt,hour:Ye,rare:Fe,dip:Math.round(rt.dip),places:Object.fromEntries(Object.entries(wt).map(([t,d])=>[t,Math.round(d)]))},pace:Ht.pace,camera:Ht.camera,pois:Ht.pois,portal:{shape:"circle",radius:7,color:"#ffe2b0",glow:1.1,revealDistance:wt.end-wt.dome},post:{exposure:bt?1.25:1,bloom:{strength:.32,radius:.6,threshold:.95},grade:{saturation:1.08,contrast:1.05,tint:"#fffdf8",shadowTint:"#141a30",vignette:.24,grain:.015,aberration:0}},update(t,d,n,g){mo.uTime.value=d,_.renderer.getDrawingBufferSize(Qo),Go.value=2/Math.max(Qo.y,1),Nt.update(t,d,n),ao.update(t,d,n),fe.update(t,d,n),Ho(d),jo(d),Fo(d),Lo(d),Oo.update(t,d,n),Uo.update(t,d,n,g)},dispose(){Nt.dispose?.(),fe.dispose?.()}}}};export{ia as default};
