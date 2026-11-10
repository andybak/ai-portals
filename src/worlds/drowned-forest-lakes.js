import*as h from"three";import{makePath as kn,clamp as ze,lerp as N,smoothstep as te,makeRng as Ve,hashSeed as Ge}from"../kit/core.js";import{makeSky as Sn}from"../kit/sky.js";import*as ut from"../kit/flora.js";import*as gt from"../kit/fauna.js";import*as ma from"../kit/fx.js";import{buildHero as Mn,normalsInSteps as zn}from"../parts/drowned-forest-lakes.js";const Ms=["#0E8FA8","#0B4F6C","#7FD6C8","#EDE8D6","#E3A82B","#1F3A2C","#C8421A"],Fe=-31,F=-100,Qt=258,va=335,pa=.372,Rt=252,je=[193.3,4.5,-143.8],$e=[.423,-.906],Yt=[.906,.423],Jt=307,bo=365,at=12,xo=7,Pn={morning:{hour:"morning",season:"peak",sky:{preset:"day",zenith:"#1a4c9c",horizon:"#c6d9e8",sunElevation:28,sunAzimuth:-97,clouds:!1,clouds2:{coverage:.34,stretch:1,opacity:.55,scale:.8}},sun:"#FFE9C4",sunI:3.1,low:1,lake:1,amb:"#9dbbe6",ambI:1.1,gnd:"#77705f",hazeK:1/3400,fog:7e-4,shadow:[0,0,1e4,1],exposure:1,tint:"#ffffff",leaves:1,snow:0},dawn:{hour:"dawn",season:"peak",sky:{preset:"dawn",sunElevation:5,sunAzimuth:-97,clouds:!1,clouds2:{coverage:.4,stretch:1,opacity:.6,scale:.8}},sun:"#FFAE9A",sunI:2.7,low:.3,lake:.5,amb:"#7f9ad6",ambI:1.25,gnd:"#5d6680",hazeK:1/2500,fog:.001,shadow:[.12,0,-42,28],exposure:1.2,tint:"#f4f1ff",leaves:.6,snow:0,scat:.82,wallHz:.4,isle:[1,.86,.72,.22,.6,.45,0],isleRock:[0,.3,1,.82]},amber:{hour:"afternoon",season:"late",shaft:120,fill:[.5,.4,.29],sky:{preset:"goldenHour",sunElevation:15,sunAzimuth:94,clouds:!1,clouds2:{coverage:.42,stretch:1,opacity:.6,scale:.8}},sun:"#FFB868",sunI:3,low:.3,lake:.55,amb:"#8fa6dc",ambI:1.2,gnd:"#6f6258",hazeK:1/3600,fog:7e-4,shadow:[-.2,0,-90,32],exposure:1.15,tint:"#fff4e6",leaves:2.2,snow:0,scat:.62,wallHz:.6},snow:{hour:"morning",season:"snow",sky:{preset:"day",zenith:"#5c7fb4",horizon:"#d3dde6",sunElevation:28,sunAzimuth:-97,sunIntensity:6,clouds:{coverage:.62,softness:.5,opacity:.8},clouds2:{coverage:.5,stretch:1,opacity:.6}},sun:"#FFF1DC",sunI:2.3,low:1,lake:1,amb:"#b3c6e2",ambI:1.3,gnd:"#8a8c90",hazeK:1/2600,fog:8e-4,shadow:[0,0,1e4,1],exposure:.98,tint:"#f3f7ff",leaves:.5,snow:1},night:{hour:"night",season:"peak",moon:!0,sky:{preset:"night",zenith:"#050d24",mid:"#0e2148",horizon:"#27477f",bodyOverrides:{0:{elevation:20,azimuth:-22,size:3,glow:.35}},clouds:!1,clouds2:{coverage:.36,stretch:1,opacity:.5,scale:.8,lit:"#9fb2e0",shade:"#1c2a52"}},sun:"#c3d3ff",sunI:1.35,low:1,lake:1.4,amb:"#4668b8",ambI:1.25,gnd:"#1c2a4c",hazeK:1/2900,fog:7e-4,shadow:[0,0,1e4,1],exposure:1.45,tint:"#e9f0ff",leaves:.6,snow:0,scat:.24,heroAmb:.55,shW:[.045,.07,.125],wallHz:.3,isle:[.5,.64,1,.95,.5,.4,1],isleRock:[0,0,.8,.5]}},ot=`
float h21(vec2 p){ p = fract(p * vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.x); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float fbm(vec2 p){ float s = 0., a = .5; for (int i = 0; i < 4; i++) { s += a * vn(p); p = p * 2.03 + vec2(17.1, 9.2); a *= .5; } return s / .9375; }
float fbr(vec2 p){ float s = 0., a = .5; for (int i = 0; i < 3; i++) { s += a * vn(p); p = mat2(.8, .6, -.6, .8) * p * 2.07 + vec2(13.7, 7.1); a *= .5; } return s / .875; }
float h31(vec3 p){ p = fract(p * vec3(.1031, .1030, .0973)); p += dot(p, p.yzx + 33.33); return fract((p.x + p.y) * p.z); }
float vn3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(mix(h31(i), h31(i + vec3(1., 0., 0.)), f.x), mix(h31(i + vec3(0., 1., 0.)), h31(i + vec3(1., 1., 0.)), f.x), f.y),
    mix(mix(h31(i + vec3(0., 0., 1.)), h31(i + vec3(1., 0., 1.)), f.x), mix(h31(i + vec3(0., 1., 1.)), h31(i + vec3(1., 1., 1.)), f.x), f.y), f.z); }`,Qe=`
uniform float uTime, uU, uSnow, uHazeK, uLow, uWSun, uMoon; uniform vec3 uSun, uSunCol, uSkyCol, uGndCol, uHaze, uZen, uHor, uShW, uFill; uniform vec4 uShadow, uShaft;
// where the low sun reaches: above the shadow of the ridge, and in the band of light that comes down the side valley
// (uShaft: unit vector across the band in xz, its offset, its half-width; a half-width of 0 means no band)
float shaftAt(vec3 p){ return step(1., uShaft.w) * (1. - smoothstep(.55, 1., abs(dot(p.xz, uShaft.xy) - uShaft.z) / max(uShaft.w, 1.))); }
float sunGate(vec3 p){ return mix(uLow, 1., max(smoothstep(0., uShadow.w, p.y + uShadow.x * p.x + uShadow.z), shaftAt(p))); }
// white water takes direct light only where the sun really reaches; in the valley's shade it is lit by the sky (uShW: the
// extra sky light the eye gives white water there), so it reads cool and pale, never the colour of a sun it cannot see
float sunW(vec3 p){ return smoothstep(uLow * .999, 1., sunGate(p)); }
vec3 hazed(vec3 c, float d){ return mix(c, uHaze, 1. - exp(-d * uHazeK)); }`,Ka=`
float lobeG(float x){ float a = x - (${F.toFixed(1)}); return 4.6 * (1. + cos(a * .0805)) + 1.4 * (1. + sin(a * .19 + .8)); }
float lobeD(float x){ float a = x - (${F.toFixed(1)}); return -.3703 * sin(a * .0805) + .266 * cos(a * .19 + .8); }
// the round of the face under a side light: its alcoves lie in their own shade, each buttress has a lit and a shaded flank
float formK(float x, float sx){ return (.66 + .46 * smoothstep(0., 10., lobeG(x))) * clamp(1. - 1.05 * lobeD(x) * (sx < 0. ? -1. : 1.), .55, 1.5); }
float ledgePh(vec3 p){ return p.y * .42 + 1.1 * vn(vec2(p.z * .11 + p.x * .07, 3.7)) + .3 * vn(vec2(p.z * .43 - p.x * .31, 9.1)) + .1 * vn(vec2(p.x * 1.3 + p.z * 1.1, p.y * .7)); }`,zs=`
vec3 wetRock(vec3 p, vec3 moss, vec3 bone, float d, float ny){
  // (every pattern is drawn in space, not in plan: on a wall of the slot nothing is drawn out into streaks)
  float n3 = vn3(p * vec3(3.1, 2.7, 3.1)), grain = vn3(p * 11. + 17.), wetS = vn3(vec3(p.x * 1.5, p.y * .7, p.z * 1.5) + 9.);
  float mossF = vn3(p * 6.) * .6 + vn3(p * 15. + 3.) * .4;
  float steep = 1. - smoothstep(.22, .6, ny), fine = 1. - smoothstep(70., 190., d);
  // the face bulges: lobes a few metres across. Under a bulge a dark hollow, on its shoulder pale wet stone and moss
  vec3 q = p * vec3(.4, .46, .4) + 4.7;
  float b0 = vn3(q) + .45 * vn3(q * 2.3 + 8.), b1 = vn3(q + vec3(0., .2, 0.)) + .45 * vn3(q * 2.3 + vec3(8., 8.46, 8.));
  float und = clamp((b1 - b0) * 4.6, -1., 1.), hol = max(und, 0.), sho = max(-und, 0.);
  // drapery: on the steep face the stone hangs in flutes three times as tall as they are wide
  float cur = vn3(vec3(p.x * .95, p.y * .26, p.z * .95) + 3.);
  // rimstone lips: no courses. Their height is warped at two scales (so they run 0.4 to 3 m apart, climb, merge and
  // die out), each hangs in scallops of uneven width, whole stretches have none, and on a near-vertical face they
  // are faint; the fine cracks are kept for ledges only
  float w1 = vn3(p * vec3(.17, .11, .17) + 2.), w2 = vn3(p * vec3(.5, .33, .5) + 13.);
  float sc = abs(sin((p.x + p.z * .8) * 1.25 + 3. * vn3(p * vec3(.3, .22, .3) + 21.)));
  float ph = p.y * 1.15 + 3.4 * w1 + 1.5 * w2 + .5 * sc * (.4 + w2) + .2 * vn3(p * 2.1);
  float lf = fract(ph), lipOn = smoothstep(.34, .6, vn3(p * vec3(.45, .8, .45) + 11.) + .25 * (1. - steep)) * mix(1., .45, steep) * fine;
  float band = vn3(vec3(p.x * .3, ph * .55, p.z * .3) + 1.7);
  vec3 rock = mix(vec3(.2, .135, .075), bone * vec3(.4, .3, .17), smoothstep(.42, .72, band)) * (.55 + .7 * n3) * (.7 + .5 * wetS) * (.74 + .52 * grain);
  rock *= mix(1., .6 + .8 * cur, steep * .8);
  rock = mix(rock, bone * vec3(.72, .6, .4) * (.7 + .5 * grain), sho * .62);
  rock *= 1. - .72 * hol;
  rock = mix(rock, bone * vec3(.66, .55, .37) * (.7 + .5 * grain), smoothstep(0., .05, lf) * (1. - smoothstep(.07, .2, lf)) * .75 * lipOn);
  rock *= 1. - .6 * smoothstep(.8, .99, lf) * lipOn;
  rock *= 1. - .55 * (1. - smoothstep(.0, .06, abs(vn3(p * vec3(1.9, 1.2, 1.9) + 31.) - .5))) * fine * (1. - steep);
  float mossC = smoothstep(.5, .57, vn3(p * vec3(.9, .8, .9)) * .55 + vn3(p * vec3(2.7, 2.3, 2.7) + 5.) * .45 + .1 * sho - .07 * hol);   // (cushions with an edge, on the shoulders)
  // (round 11) THE SHELVES, at the scale of the stair's pools: under each lip a dark undercut, the lip itself a cream rim
  // in scallops, on the tread behind it a wet shine and a cushion of bright moss, and leaves caught there. They are
  // shapes with edges, drawn in space, at one size from the lake as from the slot: nothing is drawn out along the wall.
  float slotW = 1. - smoothstep(13., 19., abs(p.x - (${F.toFixed(1)})));                                       // the walls of the slot: shelf on shelf; on the open face a shelf here and there
  float lp = ledgePh(p), lid = floor(lp), lfr = lp - lid, lk2 = 1. - smoothstep(mix(30., 60., slotW), mix(85., 150., slotW), d);
  float onL = smoothstep(mix(.5, .3, slotW), mix(.62, .46, slotW), vn(vec2(lid * 7.3 + 1.7, p.z * .12 + p.x * .09))) * lk2;                 // (a shelf runs eight or ten metres and pinches out)
  float undK = smoothstep(.62, .93, lfr) * (1. - smoothstep(.975, 1., lfr)), rimK = max(smoothstep(.955, .985, lfr), 1. - smoothstep(.015, .05, lfr)), trdK = smoothstep(.03, .07, lfr) * (1. - smoothstep(.2, .34, lfr + .1 * (vn3(p * 1.7 + 3.) - .5)));
  rock *= 1. - .66 * undK * onL;
  rock = mix(rock, bone * vec3(.42, .5, .46) * (.75 + .5 * grain), trdK * onL * .55);                         // the wet tread, turquoise-grey
  rock = mix(rock, bone * vec3(.86, .78, .58) * (.8 + .3 * grain), rimK * onL * .75 * (.5 + .5 * smoothstep(.3, .6, vn3(p * vec3(.9, .6, .9) + 23.))));   // (the rim shows in runs, not as one drawn line)
  mossC = max(mossC * (1. - .8 * undK * onL), trdK * onL * smoothstep(.36, .5, vn3(p * vec3(.8, .5, .8) + 14.)));
  vec3 outC = mix(rock, moss * (.42 + .95 * mossF) * (.8 + .4 * n3) * (1. - .4 * hol) * (1. + .5 * trdK * onL), max(mossC, .3 * smoothstep(.5, .72, wetS)));
  {   // (round 11) within thirty metres of the lens the stone has a grain you could touch: pores and pits in the travertine,
      // moss in tufts with bright tips over dark crevices, a wet glint on the treads. Drawn in space at the scale of a hand,
      // so the walls beside the climb are sharp where they are nearest and nothing on them is a soft smear.
    float nk = 1. - smoothstep(9., 30., d), mK = max(mossC, .3 * smoothstep(.5, .72, wetS));
    float tA = vn3(p * 19.), tB = vn3(p * 47. + 3.), pore = smoothstep(.6, .7, vn3(p * 29. + 7.));
    vec3 det = outC * (.5 + .66 * tA) * (.72 + .5 * tB) * 1.14;
    det = mix(det, det * vec3(1.32, 1.26, .7), mK * smoothstep(.58, .78, tB) * .65);
    det *= 1. - .5 * (1. - mK) * pore;
    det = mix(det, bone * vec3(.8, .74, .58), (1. - mK) * (1. - pore) * smoothstep(.7, .78, tA) * .3);
    outC = mix(outC, det, nk);
  }
  vec2 lc2 = floor(p.xz * 3.3 + lid * 1.7); float lfK = step(.8, h21(lc2)) * smoothstep(.34, .2, length(fract(p.xz * 3.3 + lid * 1.7) - .5)) * trdK * onL * (1. - smoothstep(30., 70., d));
  return mix(outC, mix(vec3(.89, .66, .17), vec3(.78, .26, .1), step(.7, h21(lc2 + 3.))) * .8, lfK * .9);
}`,Ps=`
attribute vec3 aMat, aRib; varying vec3 vP, vN, vMat, vRib;
void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vP = wp.xyz; vN = normal; vMat = aMat; vRib = aRib; gl_Position = projectionMatrix * viewMatrix * wp; }`,As=`
${ot}
${Qe}
${Ka}
${zs}
uniform vec3 uBone, uGold, uScar, uSpruce, uMoss, uSoil, uTurq; uniform float uFar, uLate, uRibK, uFallS, uWallHz;
varying vec3 vP, vN, vMat, vRib;
float knob(vec2 q){ return vn(q * 2.4) * .6 + vn(q * 6.3 + 4.) * .4; }
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
  vec3 Vv = cameraPosition - vP; float d = length(Vv); vec3 V = Vv / max(d, 1e-3);
  float graze = smoothstep(.14, .46, abs(dot(N, V)));                 // 0 where the land turns edge-on to the eye: at every skyline
  float alt = vMat.z * 1000., n1 = fbm(vP.xz * .05), n2 = vn(vP.xz * .6), n3 = vn(vP.xz * 3.1), nearK = 1. - smoothstep(50., 150., d);
  N = normalize(N + vec3(n3 - .5, 0., vn(vP.xz * 3.1 + 7.) - .5) * (.35 + .5 * vMat.x) * nearK);
  // forest floor: soil, moss, leaf litter
  vec3 soil = mix(uSoil, uMoss * .8, smoothstep(.4, .7, n1 + .25 * n2)) * (.7 + .6 * n2);
  vec2 lc = floor(vP.xz * 2.7);
  float leaf = step(.55, h21(lc)) * smoothstep(.34, .2, length(fract(vP.xz * 2.7) - .5 - .2 * (vec2(h21(lc + 5.), h21(lc + 9.)) - .5)));
  soil = mix(soil, mix(uGold, uScar, step(.72, h21(lc + 2.))) * .75, leaf * .85 * nearK);
  soil = mix(soil, mix(uGold, uScar, .3) * .42, (1. - nearK) * .5);
  // slope forest. Dark spruce is the mass; gold and scarlet stand in soft drifts whose hue comes only from low, warped
  // noise (stands, not crowns). Crowns are round cells that tilt the normal, so each is half lit and half blue, and they
  // fade into soft clumps with distance.
  float mid = fbm(vP.xz * .011 + 3.), cfade = 1. - smoothstep(380., 1150., d), cfar = 1. - smoothstep(900., 2800., d);
  // The valley walls are modelled in paint. Spurs and gullies run down them (vRib.x: metres along the wall's contours;
  // vRib.y: 1 on the walls of the side valley, whose contours run the other way): hr is the height of the relief (1 on a
  // spur's crest, 0 in a gully), slopeS its fall along the wall. The spurs take the light raking along the wall (rock and
  // larch gold on the lit flank, blue shade on the other), the gullies hold haze and tongues of snow, and one gully of the
  // west wall beyond the gate carries the white thread of a fall (uFallS: its z). Fades in above the valley floor and with distance.
  // (vRib.y, baked per vertex: 0 on the main walls, -1 / +1 on the south / north wall of the side valley, turning smoothly
  // over the shoulder between two faces, where the count along the wall (vRib.x) is blended too: the spurs of one face run
  // on into those of the other like the bones of a fish. vRib.z is 0 on the side valley's floor. The spurs fade out with
  // height, well below the crest, and wherever the land turns edge-on to the eye: no skyline carries a rib, a band or a step.)
  float sK = vRib.x * 1000., wallK = (1. - vMat.x) * uRibK * smoothstep(90., 380., d), yS = vRib.y, sgn = 1. - 2. * clamp(yS, 0., 1.);
  float grazeR = smoothstep(.07, .26, abs(dot(N, V)));                 // (the spurs hold on a wall looked along; they still die at the skyline itself)
  // (round 13) THE WALLS ARE READ FROM THE LAKE, where a wall's skyline stands only some 300 m over the water (the slope
  // rolls back above that): everything that makes it a mountainside is painted inside those 300 m. Its lowest third (to
  // 100 m) is the dark spruce mass; a broken band of larch gold lies over that (95-190 m); the spurs run from the crest
  // two thirds of the way down (they die out between 110 and 40 m), each gold-green on the flank the light rakes and
  // blue on its lee; grey rock breaks out from 210 m and on the spurs' crests from 130 m, and a little snow lies in
  // the gullies under the crest. hiK is the look's own sun (uLow): under the high suns (morning, snow, the moon), which
  // shine flat on a wall, the spurs are painted at full strength over the shoulders as well and up to the crest; under
  // the low suns (amber, dawn: hiK 0) they keep the raking relief they had, begun a little lower on the wall (50-190 m).
  float hiK = smoothstep(.3, 1., uLow);
  float ribOn = mix(smoothstep(50., 190., alt) * (1. - smoothstep(500., 740., alt)) * vRib.z, smoothstep(40., 110., alt) * (1. - .35 * smoothstep(650., 900., alt)) * smoothstep(0., .45, vRib.z), hiK) * wallK * grazeR, fallOn = wallK * (1. - smoothstep(.1, .26, abs(yS))) * step(0., vP.x);   // (the fall keeps to the main wall's own face: where the slope begins to turn toward the side valley a line of constant z would lie along a contour)
  float hr = .6, slopeS = 0., gul = 0., thr2 = 0., gz = 0., puff = 0., bl = 0.;
  vec3 c3 = vec3(0.), Lr = uSun;
  if (max(ribOn, fallOn) > .01) {
    c3 = normalize(vec3(yS, 0., 1. - abs(yS)));                     // the way along the wall, from the wall itself (never from the coarse mesh's normal): it turns smoothly over a shoulder
    float wv = (vn(vec2(sK * .0016, alt * .0019 + 3.)) - .5) * .6, ya = alt * .0011, e = .1, u1 = sK * mix(.0055, .0078, hiK) + wv, u2 = sK * .019 + wv * 1.2;   // (the spurs lean and wander a little as they climb)
    // (the relief is a function of the way along the wall only, so every crest runs up the slope: none can turn along a contour)
    float h0 = 1. - abs(2. * vn(vec2(u1, 7.3)) - 1.), ha = 1. - abs(2. * vn(vec2(u1 - e, 7.3)) - 1.), hb = 1. - abs(2. * vn(vec2(u1 + e, 7.3)) - 1.);
    float g0 = 1. - abs(2. * vn(vec2(u2, 3.1)) - 1.), ga = 1. - abs(2. * vn(vec2(u2 - e, 3.1)) - 1.), gb = 1. - abs(2. * vn(vec2(u2 + e, 3.1)) - 1.);
    hr = mix(.55, h0 * .7 + g0 * .3, .65 + .35 * vn(vec2(sK * .004 + 5., ya * 2.6))); slopeS = clamp((hb - ha) * 4.6 + (gb - ga) * 1.7, -1.2, 1.2);
    // the far fall: a white ribbon never under three and a half pixels wide, falling in leaps; on the ledge between two leaps
    // it is hidden and a puff of mist stands there
    float sc = vP.z - (uFallS + 10. * sin(alt * .019) + 4. * sin(alt * .061)), fa = fallOn * smoothstep(70., 90., alt) * (1. - smoothstep(300., 330., alt));
    gz = (1. - smoothstep(8., 60., abs(sc))) * fallOn * smoothstep(60., 110., alt) * (1. - smoothstep(330., 400., alt));
    hr = mix(hr, .04, gz * .85 * step(.01, ribOn));
    float fw2 = max(1.3, d * .004), lw = abs(fract(alt * .017 + .4 * vn(vec2(alt * .011, 1.))) - .5), leap = 1. - smoothstep(.36, .46, lw);   // (lw: .5 on a ledge)
    thr2 = smoothstep(fw2 * 1.3, fw2 * .55, abs(sc) + fw2 * .7 * (vn(vec2(alt * .07, 3.)) - .5)) * fa * leap * (.5 + .5 * smoothstep(.25, .5, vn(vec2(sc * .4, alt * .09 + uTime * .9))));
    puff = exp(-sc * sc / (fw2 * fw2 * 16.)) * fa * smoothstep(.3, .47, lw) * (.55 + .45 * vn(vec2(sc * .12 + uTime * .1, alt * .06 - uTime * .12)));
    gul = (1. - smoothstep(0., .5, hr)) * step(.01, ribOn);
    // (under a low sun a wall that faces away from it still takes the light that rakes along it through the gap of the side
    // valley: its spurs are lit on one flank, blue on the other, not a dark slab)
    bl = smoothstep(.1, -.3, dot(N, uSun)) * (1. - uLow);
    Lr = normalize(mix(uSun, N * .5, bl) + c3 * (1.1 * sgn) + vec3(0., .25, 0.));
  }
  vec2 sw = vP.xz * .0043 + vec2(.0016 * vP.y, 0.); sw += (vec2(fbr(sw * 2.1 + 3.), fbr(sw * 2.1 + 11.)) - .5) * .4;
  float st1 = fbr(sw * 2.9), st2 = fbr(sw * 6.7 + 5.), st3 = fbr(sw * 4.3 + 21.);
  float tex = fbr(mat2(.8, .6, -.6, .8) * vP.xz * .045 + vP.y * .02);
  float larch = smoothstep(85., 125., alt + 50. * (mid - .5)) * (1. - smoothstep(150., 215., alt + 50. * (mid - .5)));
  float foot = 1. - smoothstep(35., 240., alt + 90. * (st2 - .5));
  float share = clamp(.06 + .5 * foot + .5 * larch + .22 * uLate * smoothstep(120., 300., alt) * (1. - smoothstep(520., 640., alt)), 0., 1.), thA = .7 - .28 * share;   // (late October: the gold has climbed the walls)
  vec2 cp = mat2(.866, .5, -.5, .866) * (vP.xz + vec2(0., .45 * vP.y)) / 6.6, ci = floor(cp), cfr = fract(cp), dv = vec2(0.);
  float F1 = 9., cidh = .5;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j)), r = g + vec2(h21(ci + g), h21(ci + g + 37.7)) * .8 + .1 - cfr; float dd = dot(r, r);
    if (dd < F1) { F1 = dd; dv = r; cidh = h21(ci + g + 71.3); }
  }
  F1 = sqrt(F1);
  float dome = 1. - smoothstep(0., .62, F1), gap = smoothstep(.4, .72, F1), fm = smoothstep(12., 55., alt) * cfade * (1. - vMat.x);
  float litF = ribOn * smoothstep(.1, .7, -slopeS * sgn);          // the flank of a spur that the raking light reaches
  float aut = smoothstep(thA - .05, thA + .05, st1 * .62 + st2 * .38 + (tex - .5) * .14 + (.2 + .25 * bl) * litF * smoothstep(190., 260., alt) - .1 * gul * ribOn * smoothstep(190., 260., alt));
  // a mountainside in bands: its lower third is dark spruce (the gold stays on the valley floor and comes back as the larch band above)
  aut *= 1. - .85 * smoothstep(50., 110., alt + 50. * (mid - .5)) * (1. - vMat.x) * (1. - .3 * litF);   // (no drifts of scarlet up the wall: above the spruce the colour is the larch band's)
  // (round 10) and above it a broken band of larch gold, most on the lit flanks of the spurs
  float wallF = (1. - vMat.x) * uRibK * smoothstep(90., 380., d), shF = ribOn * smoothstep(.1, .7, slopeS * sgn);
  aut = max(aut, larch * smoothstep(.4, .6, st2 * .55 + tex * .3 + .22 * litF - .12 * shF) * .92 * wallF);
  vec3 autC = mix(uGold * vec3(1., .86, .6), uScar * 1.05, smoothstep(.5, .64, st3) * (1. - larch) * .85 * (1. - .85 * wallF * smoothstep(60., 150., alt)));
  vec3 forest = mix(uSpruce * 1.85, autC * (.46 + .2 * larch * wallF), aut * .88 * (.35 + .65 * cfar));
  // a wall is a mountainside: its lowest third a dark spruce mass, each spur gold-green on the flank the light rakes and blue on the other
  forest *= 1. - .42 * (1. - smoothstep(80., 130., alt + 40. * (mid - .5))) * wallF * (1. - .5 * litF);
  forest = mix(forest, forest * vec3(1.42, 1.3, .8), mix(.55, .8, hiK) * litF * (1. - uSnow));
  forest = mix(forest, forest * vec3(.6, .72, 1.), .5 * shF);
  vec2 tw = vec2(-(.866 * dv.x + .5 * dv.y), .5 * dv.x - .866 * dv.y);          // from the crown's centre to here, in world xz
  float side = dot(tw, normalize(uSun.xz + vec2(1e-5, 0.))) * (.3 + .7 * sunGate(vP));
  float dsoft = 1. - smoothstep(.26, .66, F1);                                  // light and shade live inside the crown, so no edge shows where two crowns meet
  float cellK = 1. - .7 * uSnow;                                                 // (under first snow the crowns are not each picked out: the white lies in drifts)
  forest *= mix(1., (1. + (.4 * cidh - .18) * dsoft) * (1. + .85 * side * dsoft) * (1. - .32 * gap * (1. - .5 * aut)), cfade * cellK);
  forest *= mix(1., .78 + .44 * tex, cfar * (1. - .6 * cfade));
  float crown = dome;
  vec3 rock = vec3(.4, .39, .39) * (.65 + .7 * vn(vP.xz * .02 + vP.y * .03));
  rock = mix(rock, uBone * vec3(.52, .43, .31) * (.6 + .6 * tex), ribOn * (.35 + .4 * litF));                 // (the spurs: warm bare rock)
  float rk = max(smoothstep(215., 300., alt + 80. * (mid - .5)) * (.5 + .5 * smoothstep(.35, .6, tex + .3 * smoothstep(330., 480., alt))), smoothstep(.74, .58, N.y) * smoothstep(150., 380., alt));   // (broken rock under the crest, bare above it)
  rk = max(rk, ribOn * max(smoothstep(.74, .96, hr + .25 * (tex - .5)) * smoothstep(130., 250., alt + 90. * (mid - .5)) * .85, gz * .55));
  forest *= 1. - .34 * gul * ribOn;
  float snowL = mix(420., 340., uSnow);
  float sn = smoothstep(snowL - 70., snowL + 90., alt + 170. * (mid - .5) + 150. * gul * ribOn) * smoothstep(.3, .62, N.y + .25 * tex);
  vec3 land = mix(soil, forest, smoothstep(12., 55., alt));
  land = mix(land, rock, rk); land = mix(land, vec3(.86, .89, .95), sn);
  float dust = uSnow * smoothstep(.4, .8, N.y) * (.25 + .3 * n2 + .45 * smoothstep(120., 520., alt)) * (1. - sn);      // first snow: thicker with height
  float drift = smoothstep(.36, .6, st1 * .5 + st3 * .28 + .22 * tex + .26 * smoothstep(140., 520., alt) + .16 * (hr - .5) * ribOn - .2 * gul * ribOn + .1 * litF);
  dust *= mix(1., mix(.7, 1.7 * drift + .1, cfade), smoothstep(12., 55., alt));   // on the canopy it lies in drifts and bands that follow the spurs and thicken with height; dark spruce shows through in ragged patches
  land = mix(land, vec3(.8, .84, .9), clamp(dust, 0., .88));
  // travertine: cream, amber stain, moss on the shoulders
  vec3 trav = uBone * (.42 + .24 * n2 + .14 * n3) * mix(vec3(1.), vec3(1.05, .92, .72), smoothstep(.4, .75, n1));
  trav = mix(trav, uMoss * (.55 + .5 * n3), smoothstep(.5, .75, n1 * .5 + n2 * .55 + .2 * N.y - .1) * .85);
  trav = mix(trav, vec3(.82, .86, .92), uSnow * smoothstep(.6, .9, N.y) * .5 * (1. - vMat.y));
  float face = smoothstep(.72, .4, N.y) * vMat.x, streak = vn3(vec3(vP.x * 1.1, vP.y * .45, vP.z * 1.1));   // (drapery two to one, drawn in space)
  trav = mix(trav, mix(vec3(.2, .19, .17), uMoss * .5, smoothstep(.35, .7, streak)) * (.6 + .5 * n3), face * .82);
  // the rock the fall runs over (marked by a negative altitude): always wet, near black, with round cushions of dark moss
  // (clumps, not streaks), so the white water reads as lace on it in every light and from any distance
  float wetF = clamp(-vMat.z * 120., 0., 1.);
  if (wetF > .001) trav = mix(trav, wetRock(vP, uMoss, uBone, d, N.y), wetF * .9);
  vec3 alb = mix(land, trav, vMat.x);
  alb *= mix(1., .7 + .38 * vn3(vP * 8.) + .22 * vn3(vP * 21. + 3.), nearK * vMat.x);
  // the sheet of water over the shoal and the outlet tongue. Under the film the travertine is wet and dark: tan lips of
  // rimstone with a white foam line, amber pools between them; knobs stand out of it cream and dry, tilting the normal
  // so each has a lit and a shaded side, with a foam tail on its downstream (+Z) side; flow threads at three scales run
  // to the lip; leaves ride the sheet toward the fall. Seen at a grazing angle a pixel covers a long strip of ground, so
  // every layer fades to its mean (FF) before its cells get smaller than a pixel: no sparkle in the middle distance.
  vec2 fwv = fwidth(vP.xz); float pz = max(fwv.x, fwv.y);
  #define FF(cell) (1. - smoothstep(.3, .75, pz / (cell)))
  // nf: the last few metres under the lens. There the painted knobs give way to the real stones (instanced, each with its
  // own collar of foam) and the sheet is clear water over small terraces
  float nf = 1. - smoothstep(3.5, 10., d), kw = mix(.06, .012, nf);
  float k1 = vn(vP.xz * 2.4), kn = mix(.5, k1, FF(.42) * (1. - nf)) * .6 + mix(.5, vn(vP.xz * 6.3 + 4.), FF(.16) * (1. - nf)) * .4;
  float film = vMat.y * (1. - face), wat = smoothstep(.66 + kw, .66 - kw, kn) * film, t = uTime, thr = 0., foam = 0., pearl = 0., lipF = 0., crestF = 0., lf = 0., flowN = .5;
  if (vMat.x > .01) {
    float nk = 1. - smoothstep(6., 24., d), nk3 = 1. - smoothstep(2.5, 9., d);
    vec2 kg = (vec2(vn((vP.xz + vec2(.15, 0.)) * 2.4), vn((vP.xz + vec2(0., .15)) * 2.4)) - k1) / .15;      // relief from the broad knobs only
    N = normalize(N + vec3(-kg.x, 0., -kg.y) * ((.2 + .75 * nf * smoothstep(.6, .72, kn)) * vMat.x * (1. - face) * FF(.42)));
    vec2 rp = vP.xz * vec2(.3, .62) + vec2(vn(vP.xz * .33), vn(vP.xz * .33 + 5.)) * 1.2, ri = floor(rp), rf = fract(rp); float D1 = 9., D2 = 9.;
    for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j)), r = g + vec2(h21(ri + g + 3.), h21(ri + g + 19.)) * .76 + .12 - rf; float dd = dot(r, r);
      if (dd < D1) { D2 = D1; D1 = dd; } else if (dd < D2) D2 = dd;
    }
    float rd = sqrt(D2) - sqrt(D1), wd = mix(.15, .045, nf) + pz * .9;                                     // lips widen and dim with distance instead of breaking into dots
    float dam = smoothstep(wd, wd * .4, rd) * film * min(1., .22 / wd), pool = smoothstep(.14, .5, rd) * film;
    lipF = exp(-(vP.z - 246.) * (vP.z - 246.) * 1.1) * vMat.y * step(vP.z, 251.);      // a rimstone rim a hand above the lake's level, 11 m inside the crest
    // (round 12) THE TOP LAKE'S LEVEL WATER LIES OVER THE TONGUE TO THE SHOAL'S CREST (z 256.6: the hero's mirror ends there).
    // lakeK: 1 under that water. There the ground is the lake's floor seen through still clear water: small rimstone pools
    // with thin pale rims at every distance, no running threads, no pearls, no leaves racing to the fall, no painted sheen
    // (the mirror above does that); and a hair of white along the crest where the lake breaks into the sheet.
    float lakeK = 1. - smoothstep(255.2, 257., vP.z); crestF = exp(-(vP.z - 256.9) * (vP.z - 256.9) * 2.2) * film; lipF *= 1. - lakeK;   // (the old rim 11 m inside the crest lies under the lake now: no white line across it)
    dam = max(dam * (1. - .8 * lakeK), max(lipF, crestF * .8));
    // (round 23) UNDER THE RUNNING SHEET THE BED KEEPS THREE TENTHS OF THE TILT. The two lines that tilt the normal (the
    // 0.3 m grain of the land, and the knobs' relief, at the head of this block) throw the sun's light into bright and
    // near-black patches a hand to an arm across. On dry stone that is its form. Under LIVE's white threads and net it
    // was hidden; with the net toned down it is what read as a mottled, muddy floor in the sunlit looks: light that
    // reaches a bed through moving water is spread by the surface. So where the running sheet lies the normal goes seven
    // tenths of the way back to the land's own. 0.7: a level tuned on the whole shoal in five looks.
    // sheetK: THE RUNNING SHEET'S PRESENCE AT THE PLACE, with the eye taken out (the motion pass). Live's wat reads the
    // eye (nf, in its width kw and in kn; and the footprint). Of wat's own terms sheetK keeps the FILM alone (the sheet
    // as the land carries it), and drops nf, the footprint AND the whole knob term kn: kn's near part is the eye, and
    // its far part alone would leave the full tilt on every painted knob's place under the lens too, where live draws
    // water and no knob: dark shaded humps in the sunlit looks (seen in a reckoning, not rendered). So the tilt is three tenths wherever the film lies, on
    // a painted knob's place as between the knobs, far and near alike (a far knob's relief is three tenths of live's
    // now). Nothing under the lake's level water (1 - lakeK): the lake's floor is live's. (The line stands here, below
    // lakeK, for that; nothing between the tilt's lines and this one reads N.)
    float sheetK = film * (1. - lakeK);
    N = normalize(mix(N, normalize(vN + vec3(0., 1e-5, 0.)), .7 * sheetK));
    float flow = vn(vec2(vP.x * 1.6, vP.z * .45 - t * 1.6));
    float a1 = vn(vec2(vP.x * 6.5 + flow * 2., vP.z * .7 - t * 2.6)), a2 = vn(vec2(vP.x * 15. + a1 * 2.5, vP.z * 1.5 - t * 4.)), a3 = vn(vec2(vP.x * 29. + a2 * 2., vP.z * 3. - t * 7.));
    float r1 = 1. - abs(2. * a1 - 1.), r2 = 1. - abs(2. * a2 - 1.), r3 = 1. - abs(2. * a3 - 1.);
    r1 *= r1; r1 *= r1 * r1; r2 *= r2; r2 *= r2 * r2; r3 *= r3; r3 *= r3;
    // the broad flow layer is 15 cm strokes: under the nose they would be 40 px smears, so it gives way there to the two
    // fine ones (threads a few pixels wide that run at the lens) and to the little terraces below
    float far1 = smoothstep(2.5, 7., d);
    // (round 23) thr, on the next line, is still computed and since round 22 is READ BY NOTHING: the straight threads it
    // draws (nine to ten times as long as wide, running at the lens) are out of the picture. The line stands as it was;
    // flowN, set on the same line, is still read (by the sheen at the composite).
    thr = (mix(.12, r1, FF(.5)) * .6 * (.35 + .65 * nearK) * far1 + r2 * (.6 - .48 * nf) * FF(.3) + mix(r3, r3 * r3, nf) * (.45 + .2 * nf) * FF(.16)) * (1. - lakeK); flowN = mix(.5, a1, FF(.5) * far1);
    float tail = max(smoothstep(.64, .78, kn + vn((vP.xz - vec2(0., .22)) * 2.4) * .6 - k1 * .6), .65 * smoothstep(.64, .78, kn + vn((vP.xz - vec2(0., .55)) * 2.4) * .6 - k1 * .6)) * FF(.42) * (1. - nf);
    float collar = smoothstep(.035, .0, abs(kn - .66)) * nf * FF(.04);                          // a thin line of foam where each knob meets the water
    foam = (tail * (.3 + .7 * mix(.5, smoothstep(.3, .7, vn(vec2(vP.x * 11., vP.z * 3. - t * 6.))), FF(.3))) * (1. - .55 * nf) + collar * .8) * (1. - lakeK) + dam * (.3 + .7 * mix(.5, vn(vec2(vP.x * 7., vP.z * 7. - t * 4.)), FF(.15))) * (1. - .7 * lakeK);
    // (round 23) THE WHITE NET IS TONED DOWN AND OPENED, NOT TAKEN OFF. What made it a projected grid: every rim of the
    // pools (3.3 m by 1.6 m) and of the little terraces (0.87 m by 0.42 m) the same near white (the bone at 0.8 to 0.86,
    // nine tenths strong), closed all round, each carrying a line of foam its whole length (0.7 of white), all one
    // width; and between them straight threads nine to ten times as long as wide, running at the lens. Round 22 took
    // net and threads off and left a brown floor. Now the rims stay, clearly seen, as pale stone rims of a terrace of
    // pools, and three things break the grid, all three by the place alone (larger noises: 4.3 m and 1.4 m; 1.1 m):
    //   rimV: a rim's stone stands out in RUNS, six tenths to its whole strength along its length;
    //   rimF: its foam is at LIVE's own strength only in short arcs, about a third of its length, and elsewhere under
    //         half of it (0.45);
    //   rimW: its WIDTH varies along its length: where the noise is low the rim's flank is thinned toward its crown
    //         (dam taken a second time, by four tenths at the most: the flank keeps at least six tenths of its own
    //         strength; a soft edge, never above live's own).
    // And the hardest white is pressed down: the foam on a rim's crown loses three tenths where the rim stands at its
    // full strength (1 - .3 * dam), a thin near rim more than a broad far one. The four levels (0.6, 0.45, 0.6, 0.3)
    // are levels tuned on the whole shoal in five looks (the notes have the rims' measured contrast against the pool
    // beside live's, position by position).
    // THE FOAM IS TAKEN DOWN BY SUBTRACTING live's own rim term from the line above, which stands as it was. The term
    // is typed twice: the line above and the line below MUST CHANGE TOGETHER, or a residue is left on every rim.
    // The hair of white on the crest (crestF) is live's.
    float rimB = vn(vP.xz * .23 + 11.) * .6 + vn(vP.xz * .71 + 3.) * .4, rimV = smoothstep(.3, .62, rimB), rimF = smoothstep(.53, .68, rimB);
    float rimW = mix(dam, 1., mix(.6, 1., smoothstep(.35, .65, vn(vP.xz * .9 + vec2(31., 17.)))));               // RIDES on live's mask dam: 1 at most
    foam = max(foam - dam * (1. - .7 * lakeK) * (.3 + .7 * mix(.5, vn(vec2(vP.x * 7., vP.z * 7. - t * 4.)), FF(.15))) * (1. - crestF) * (1. - lakeK) * (1. - mix(.45, 1., rimF) * rimW * (1. - .3 * dam)), 0.);   // RIDES on live's mask dam: what is left is never above live's; nothing is taken off under the lake's level water (1 - lakeK)
    // A RIM IS A LOW STONE DAM: its flank away from the sun stands in a thin soft shade. rimG: the way down the rim's
    // flank on the ground (the slope of rd, the distance from the rim's crest, taken from the pixel's own footprint);
    // rimL: 1 on the middle of the flank that faces away from the sun (by the sun's own direction), 0 on the crown, at
    // the rim's foot and on the sunward flank; only where the sun reaches (sunGate), and gone before a rim is finer than
    // a pixel (FF of 0.3 m, a rim's breadth).
    vec2 rimX = dFdx(vP.xz), rimY = dFdy(vP.xz), rimD = vec2(dFdx(rd), dFdy(rd));
    vec2 rimG = vec2(rimD.x * rimY.y - rimD.y * rimX.y, rimD.y * rimX.x - rimD.x * rimY.x) * sign(rimX.x * rimY.y - rimX.y * rimY.x);
    float rimL = smoothstep(0., .8, -dot(rimG, uSun.xz) / max(length(rimG) * length(uSun.xz), 1e-6)) * 4. * dam * (1. - dam) * FF(.3) * sunGate(vP);   // RIDES on live's mask dam
    // little rimstone terraces under the lens: pools half a metre long, each held by a thin white rim, clear water over pale marl
    vec2 tq = vP.xz * vec2(1.15, 2.4) + vec2(vn(vP.xz * .8 + 3.), vn(vP.xz * .8 + 8.)) * 1.1 + (vec2(vn(vP.xz * 2.3 + 13.), vn(vP.xz * 2.3 + 29.)) - .5) * .8, tci = floor(tq), tcf = fract(tq); float E1 = 9., E2 = 9.;
    for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j)), r = g + vec2(h21(tci + g + 41.), h21(tci + g + 57.)) * .8 + .1 - tcf; float dd = dot(r, r);
      if (dd < E1) { E2 = E1; E1 = dd; } else if (dd < E2) E2 = dd;
    }
    float nfL = max(nf, lakeK * (1. - smoothstep(12., 34., d)));                           // (under the lake's level water the little terraces are the floor as far as they can be told apart)
    float te = sqrt(E2) - sqrt(E1), tw = .05 + pz * 2.2, trim = smoothstep(tw, tw * .3, te) * min(1., .1 / tw) * film * nfL * (.3 + .7 * smoothstep(.3, .62, vn(vP.xz * 1.7 + 5.))), tin = smoothstep(.03, .4, te);
    pearl = (step(.975, vn(vP.xz * 11. + vec2(t * 1.1, -t * 4.))) * (1. - nk) * .4 + step(.968, vn(vP.xz * 27. + vec2(t * 2.3, -t * 9.))) * nk3) * (1. - lakeK);
    float kn2 = mix(.5, vn(vP.xz * 15.) * .55 + vn(vP.xz * 37. + 9.) * .45, FF(.05));    // pebbled travertine under the lens
    alb *= mix(1., .7 + .6 * kn2, vMat.x);
    vec3 wet = uBone * vec3(.52, .385, .2) * (.72 + .56 * kn2) * (.8 + .4 * n2);
    wet = mix(wet, uBone * vec3(.33, .2, .065) * (.7 + .6 * n3), pool * .9);
    wet = mix(wet, uTurq * .3, pool * smoothstep(.6, .85, n1 + .3 * n2) * .4);
    float tk = 1. - smoothstep(253., 260., vP.z);                                          // the outlet tongue: pale marl terraces under clear water
    wet = mix(wet, mix(uBone * vec3(.6, .57, .44) * (.8 + .4 * kn2), uTurq * .62, pool * .55), tk);
    // (round 23) THE WHOLE SHOAL IS CLEAR WATER OVER PALE MARL, as live's own tongue is (the line above). Beyond the
    // tongue the bed was tan lips and amber pools (the four lines above): hidden under live's white threads and net, and
    // once those are toned down it is the brown, muddy floor of round 22. So the tongue's own paint lies over the whole
    // sheet (1 - tk: the tongue itself is as it was), with a pool's water painted by its depth: pale and milky over the
    // shallow margin inside the rim (the turquoise at 1.15, mixed 0.45 toward live's rim colour, the bone at 0.8: the
    // marl seen through a hand of water), deeper turquoise in its middle (0.55; live's tongue has 0.62 all over), from
    // 0.35 to 0.8 of rd (a pool's middle lies at about 1 of it), over eight tenths of a pool for live's 0.55: shallow
    // water in the open, not under the lake. The five levels (1.15, 0.45, 0.55, the two ends of the depth, 0.8) are
    // levels tuned on the whole shoal in five looks: they hold live's brightness with its threads gone in the sunlit
    // looks, keep the rims seen against the pools in shade, and keep the water from a loud blue under the moon. By
    // the place alone. (The motion pass: the marl between a rim and its pool is no longer the tongue's tan (.6, .57,
    // .44) but the same marl seen through a finger of water, paler and toward the water's colour (.54, .66, .58: a
    // tenth brighter): the little terraces no longer lay a brighter paint of their own under the lens, so the bed
    // itself carries that light, far and near alike; and nothing on the sheet is tan. A level tuned on the whole
    // shoal in five looks.)
    wet = mix(wet, mix(uBone * vec3(.54, .66, .58) * (.8 + .4 * kn2), mix(mix(uTurq * 1.15, uBone * .8, .45), uTurq * .55, smoothstep(.35, .8, rd)), pool * .8), (1. - tk) * (1. - lakeK));   // (not under the lake's level water: the lake's floor is live's)
    // (round 23) THE RIM: live's own pale rim (the bone at 0.8), with only so much stone in it that it reads as a low
    // stone dam and not as a white line: pebbled (0.8 to 1 of it), a warmer cream on its crown (dam * dam), the thin
    // soft shade on its flank away from the sun (rimL, a quarter), standing out in runs (rimV) and of varying width
    // (rimW). Under the lake's level water and on the crest it is as it was. RIDES on live's mask dam: no colour above
    // live's 0.8, no strength above live's 0.92.
    wet = mix(wet, mix(uBone * mix(vec3(.8), vec3(.8, .77, .68), dam * dam) * (.8 + .2 * kn2) * (1. - .25 * rimL), uBone * .8, max(lakeK, crestF)), dam * .92 * mix(rimW * mix(.6, 1., rimV), 1., max(lakeK, crestF)));
    vec3 bedR = wet;                                // the bed with its rims as the whole shoal's lines paint it at this place: the same far and near
    vec3 marl = mix(uBone * vec3(.62, .54, .36) * (.72 + .56 * kn2), uTurq * (.5 + .3 * kn2), tin * .9);
    marl = mix(marl, uBone * vec3(.56, .4, .2) * (.7 + .6 * kn2), smoothstep(.62, .8, h21(tci + 3.3) ) * .55 * (1. - tk));   // one pool in three stained amber
    wet = mix(wet, marl, nfL * .9 * (1. - dam));
    // (round 23, the motion pass) THE LITTLE TERRACES ARE THE FINE RELIEF OF THE SAME BED: THE SAME PLACE CARRIES THE
    // SAME PAINT FAR AND NEAR. Live's line above lays its little terraces under its mask nfL (the lens, and the lake).
    // On the running sheet the line below takes that paint off again, whole, and lays in its place the bed as the
    // whole shoal's lines paint it there (bedR), with the little pools as a MODULATION of that paint: paler and
    // warmer toward a little pool's margin, deeper and bluer toward its middle, by te alone:
    //     bedR * (1 + (.5 - smoothstep(.15, .35, te)) * (.5, .2, -.1) * FF(.42) * (1 - dam))
    // THE MEAN of smoothstep(.15, .35, te) over the shoal's ground is 0.500 (counted at 300,000 places, twice: 0.501
    // and 0.499), so the modulation's mean over the little pools is 1 in every channel: where the footprint fades it
    // (FF of 0.42 m, a little terrace's lesser breadth: whole where a terrace is resolved, gone before it is finer
    // than a pixel) the picture goes to bedR itself with no step in brightness or colour. It hangs on no distance:
    // not nfL, not nf. It gives way on a rim (1 - dam: RIDES on live's mask dam) and has no pebbling of its own.
    // WHAT THE MASK nfL STILL DOES, place by place (near paint less far paint at one place, one footprint). The paint is
    //     lakeK * mix(bedR, marl, nfL * .9 * (1 - dam)) + (1 - lakeK) * bedR * modulation,
    // so the step of nfL from 0 to 1 is  lakeK * .9 * (1 - dam) * (marl - bedR):
    //   on the running sheet (lakeK 0): NOTHING, at every kind of place: a little pool's margin in a big pool's
    //     middle (live's own step there: +0.176 in albedo luminance, the reader's count), beside a big rim (live:
    //     +0.056), a little pool's middle on a big pool's margin, a stained pool of live's (the stain lies in marl,
    //     which is wholly covered), on a rim (dam 1: nothing in live either);
    //   under the lake (lakeK 1): live's own step, the term above with bedR live's own paint there: the lake's floor
    //     is live's by pixel;
    //   in the crest's strip (z 255.2 to 257, 1.8 m): lakeK times a step of live's kind, against a bed that is
    //     live's with at most (1 - tk) * (1 - lakeK) of the shoal's floor in it (lakeK * (1 - lakeK) * (1 - tk) is
    //     0.10 at the most): NOT shown smaller than live's at every point of that strip.
    // The amplitudes (.5, .2, -.1) and the two ends of te are levels tuned on the whole shoal in five looks.
    wet = mix(wet, bedR * (1. + (.5 - smoothstep(.15, .35, te)) * vec3(.5, .2, -.1) * FF(.42) * (1. - dam)), 1. - lakeK);
    wet = mix(wet, mix(uBone * mix(vec3(.86), vec3(.86, .83, .73), trim) * (.8 + .2 * kn2), uBone * .86, max(lakeK, crestF)), trim * .9 * mix(.6, 1., max(lakeK, crestF))); foam += trim * (.25 + .75 * vn(vec2(vP.x * 9., vP.z * 9. - t * 3.))) * (1. - lakeK) * mix(.5 * rimF, 1., max(lakeK, crestF));   // (round 23: the little terraces' rims likewise: live's pale rim (0.86), pebbled, warmer on the crown, six tenths strong under the running sheet (a level tuned on the whole shoal in five looks), their foam only in the arcs where the pools' rims carry theirs and half of live's there; under the lake's level water AND on the crest every rim and its foam are as they were. RIDES on live's mask trim (which carries nfL: the little rims are live's own near paint): no colour and no strength above live's. Its step, 0.54 of (the rim's colour less the bed), is at most 0.17 in albedo luminance; live's own, 0.9 of (0.86 of the bone less live's marl), is 0.12 to 0.28: smaller at most places, not shown smaller at every one)
    // (round 23, the motion pass) THE WATER RUNS: RIPPLE TRAINS ON ITS SURFACE, moving down the current (+z, with the
    // current's own sideways wander, flow). With live's threads and its foam on every rim gone the sheet stood still
    // but for the foam arcs. Now short soft crests lie ACROSS the current, two and a half times as broad across it as
    // along it (never a line along the flow): over a rim they are quick and bunched (crest to crest about 0.24 m,
    // 1 m/s), in a pool's middle slow and wide (about 0.44 m, 0.75 m/s: between live's rim foam, 0.57 m/s, and its
    // leaves, 2.4 m/s); ripK: 1 on a rim, 0 from under half of the way to a pool's middle (rd, by the place). Each
    // train fades to its mean before a crest is finer than a pixel (FF). rip: -1 to 1, mean 0, and 0 where the running
    // sheet is not (sheetK: the film, not under the lake). It is a gentle shading of the ground's colour under the
    // sheet (0.3 of it at the very most, a few hundredths of the picture's range as a rule: the line after live's two
    // below): no white, no line. 0.3: a level tuned on the whole shoal in five looks. By the place and the world's
    // clock alone: it hangs on no mask of live's (not wat, not nf, not nfL, not dam), so it lies on a painted knob's
    // place as on the water beside it, far and near alike; nothing under the lake's level water (rip is 0 there).
    // (round 25) The trains no longer go into flowN: live's sheen line reads flowN under live's mask wat, which reads
    // the eye, and the reader of round 24 found that mask making more difference than in live wherever a trough lay
    // on a painted knob's place. flowN is live's again; the shading of the ground's colour carries the motion alone.
    float ripK = 1. - smoothstep(.1, .45, rd);
    float rip = (mix(mix(.5, vn(vec2(vP.x * 1.8 + flow + 7., vP.z * 4.5 - t * 3.4)), FF(.22)), vn(vec2(vP.x * 3.3 + flow, vP.z * 8.3 - t * 8.3)), ripK * FF(.12)) - .5) * 2. * sheetK;
    alb = mix(alb, wet, film * max(smoothstep(.72 + kw, .72 - kw - .04 * (1. - nf), kn), lakeK));     // (under the lake no painted knob of dry stone: they were dark blots under the water)
    alb *= 1. - .45 * nf * film * smoothstep(.09, .0, abs(kn - .7)) * (1. - lakeK);                       // the wet dark line round each knob
    alb *= 1. + .3 * rip;                           // (round 23, the motion pass) the ripple trains' shading: by the place alone (rip carries sheetK), under no mask
    // leaves riding the sheet: each a hand long, a pointed oval with a midrib, lying any way round; gold, tan and a few scarlet
    vec2 lq = vec2(vP.x, vP.z - t * 2.4) * 5.5, lcc = floor(lq), lo = fract(lq) - .5 - .3 * (vec2(h21(lcc + 5.), h21(lcc + 9.)) - .5);
    float lan = h21(lcc + 17.) * 6.283, lca = cos(lan), lsa = sin(lan), lh = h21(lcc + 2.); vec2 lr = vec2(lo.x * lca + lo.y * lsa, -lo.x * lsa + lo.y * lca);
    float lsh = smoothstep(0., .03, .11 * (1. - lr.x * lr.x * 14.) - abs(lr.y));
    lf = step(mix(.975, .93, uLate), h21(lcc + 31.)) * lsh * wat * FF(.11) * (1. - lakeK);
    wat *= 1. - lakeK;                                                                        // (no painted sheen under the mirror)
    alb = mix(alb, mix(mix(uGold, uGold * vec3(.8, .62, .4), step(.5, lh)), uScar * .85, step(.84, lh)) * (.62 + .38 * smoothstep(0., .03, abs(lr.y))) * .95, lf);
  }
  alb = mix(alb, alb * vec3(.5, .72, .7) + vec3(0., .015, .02), vMat.x * .35 * (1. - film));
  float fmask = fm * (1. - rk) * (1. - sn);                                    // crowns stand out of the slope: lit side, blue side
  vec3 Nl = normalize(N + vec3(tw.x, 0., tw.y) * (fmask * dsoft * cellK) - c3 * (slopeS * (2.2 + .8 * bl) * ribOn));
  float ndl = max(dot(Nl, normalize(mix(uSun, Lr, ribOn))), 0.), shadeK = ribOn * smoothstep(.05, .6, slopeS * sgn);   // (the blue is the painted spur's own lee flank: taken from the coarse mesh normal it stepped along every arete)
  float cl = 1. - .5 * smoothstep(.52, .7, fbm(vP.xz * .0017 + uTime * vec2(.006, .003))) * smoothstep(40., 200., alt);
  vec3 ambL = mix(mix(uGndCol, uSkyCol, Nl.y * .5 + .5), uSkyCol * vec3(.8, .95, 1.3), .45 * fmask);
  ambL = mix(ambL, uSkyCol * vec3(.66, .9, 1.5), (.6 + .3 * bl) * shadeK) * mix(1., .6 + .5 * hr, ribOn);                    // a spur's shaded flank and the gullies: blue, and darker the deeper
  vec3 lightC = uSunCol * ndl * mix(sunGate(vP), 1., .65 * ribOn) * cl * (1. + (.35 + .9 * bl) * ribOn) + ambL + uShW * (1.6 * vMat.x * (1. - .3 * wetF) + 3. * sn * uMoon)   // (and the far snows keep a glimmer under the moon)
    + uFill * (1. - .4 * vMat.x) * (1. - sn) * (1. - .65 * shadeK)
    + (uSkyCol * 1.5 + uSunCol * .14) * wetF * (1. - .5 * smoothstep(0., .3, ndl));       // the fall's rock in shade is lit by the white water all round it: never black          // late light: the warm bounce that keeps the shaded forest in colour
  vec3 col = alb * lightC;
  col *= mix(1., formK(vP.x, uSun.x), wetF * .85 * smoothstep(11., 16., abs(vP.x - (${F.toFixed(1)}))));   // (round 11) the fall's face is round: alcoves in shade, each buttress lit on one flank
  // the spurs, painted outright: the flank the light rakes is warm and bright, its lee flank blue shade, the gullies dark.
  // (So the wall over the gate is a mountainside of three or four spurs in every light, not a smooth cone.)
  col *= 1. + litF * vec3(.85, .68, .3) * (1. - sn);
  col = mix(col, col * vec3(.46, .6, .98), .72 * shadeK * (1. - sn));
  col *= 1. - .28 * gul * ribOn * (1. - sn);
  col *= 1. + .3 * hiK * ribOn * smoothstep(.84, .97, hr) * (1. - sn);                          // (round 13) and a spur's own crest catches the light: a pale line down the wall
  col = mix(col, vec3(dot(col, vec3(.3, .5, .2))) * vec3(.72, .9, 1.3), .62 * uMoon * wallK * (1. - sn));   // (round 13: under the moon a wall's larch and lit rock are silver-blue, never orange)
  float ov = 1. - max(V.y, 0.), fr = .04 + .8 * ov * ov * ov * ov;
  vec3 white = uSunCol * sunW(vP) + uSkyCol + uShW;
  col = mix(col, mix(uHor, uZen, .8) * .85, wat * fr * .32 * (.3 + .7 * flowN) * (1. - lf));
  col += white * (1. - .85 * lf) * (wat * (foam * .7) + (lipF * .5 + crestF * .32) * (.4 + .6 * vn(vec2(vP.x * 6., vP.z * 4. - t * 3.))));   // (round 23: live's line less its straight threads (thr * .5): nothing long runs at the lens. The foam's weight is live's. RIDES on live's mask wat)
  col += (uSunCol * 5. * sunW(vP) + uShW * 3.) * pearl * wat * (1. - smoothstep(25., 70., d));
  vec3 fallW = (uSunCol * sunW(vP) * .7 + uSkyCol * 1.5 + uShW * 1.2) * 1.15;                                  // the far fall: white in sun, blue-white in the valley's shade
  col = mix(mix(col, fallW * .8, puff * .5), fallW, thr2 * .95);
  float fo = smoothstep(30., 150., alt) * (1. - smoothstep(500., 1600., d));         // blue valley haze between the shore trees and the slope
  // haze lies along the foot of the walls and thickens with distance (uWallHz: most under a low sun, looked at against the
  // light: ridge behind ridge), and a little more of it lies in the gullies (none at a skyline: the spurs have faded there).
  float hzK = 1. + .45 * fo + wallK * (.3 + .6 * (1. - smoothstep(120., 420., alt)) + uWallHz * smoothstep(250., 1000., d)) + 1.1 * gul * ribOn;
  gl_FragColor = vec4(mix(col, mix(uHaze, mix(uHor, uZen, .62), .6 * fo), min(1. - exp(-d * uHazeK * hzK), uFar)), 1.);
}`,Fs=`
uniform float uTime; attribute vec3 aCol; attribute float aFlex; varying vec3 vP, vN, vC, vP0, vLoc; varying float vF, vLace, vKind, vFootY;
#ifdef ISLE
  // the island's trees: aLf = a leaf card's own coordinates in metres (across, along) and the size of the leaves it is cut into
  uniform vec3 uSun; attribute vec3 aLf; varying vec3 vLf; varying float vRim;
#endif
void main(){
  vec3 p = (instanceMatrix * vec4(position, 1.)).xyz, n = normalize(mat3(instanceMatrix) * normal), c = aCol;
  #ifdef USE_INSTANCING_COLOR
    c *= instanceColor;
  #endif
  // aFlex + 4 marks leaves cut to lace in the fragment shader, + 8 birch bark, + 16 travertine stones
  float stone = step(15.5, aFlex), a1 = aFlex - 16. * stone, bark = step(7.5, a1), a2 = a1 - 8. * bark, lace = step(3.5, a2), fl = a2 - 4. * lace, ph = p.x * .31 + p.z * .27;
  vP0 = p; vLoc = position; vKind = bark + 2. * stone;
  p.x += fl * (sin(uTime * 1.6 + ph) * .1 + sin(uTime * 5.3 + p.y * 2.1 + p.x * 1.7) * .035);
  p.z += fl * (sin(uTime * 1.25 + ph * 1.3) * .08 + cos(uTime * 4.7 + p.y * 1.9 + p.z * 1.3) * .035);
  vP = p; vN = n; vC = c; vF = fl; vLace = lace; vFootY = instanceMatrix[3].y;
  #ifdef ISLE
    vLf = aLf;
    vec3 cc = instanceMatrix[3].xyz + vec3(0., 6.4 * length(instanceMatrix[1].xyz), 0.);       // about the middle of the crown
    vRim = dot(normalize(p - cc + vec3(0., 1e-4, 0.)), uSun);                                   // 1 on the side of the crown that faces the light
  #endif
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
}`,Ts=`
${ot}
${Qe}
uniform float uFallZ, uWallHz;
varying vec3 vP, vN, vC, vP0, vLoc; varying float vF, vLace, vKind, vFootY;
#ifdef ISLE
  uniform vec4 uIsTone; uniform vec3 uIsLit; varying vec3 vLf; varying float vRim;
#endif
void main(){
  vec3 Vv = cameraPosition - vP; float d = length(Vv); vec3 V = Vv / max(d, 1e-3);
  float cutK = 1.;
  #ifdef ISLE
    // Every card is a spray of small leaves, not one big diamond: it is cut into cells a hand across, each holding one leaf
    // (a pointed oval hanging any way round for the birch, a broad lobed one for the maple), one cell in seven empty, each
    // leaf its own shade. Far off, where a leaf would be less than a pixel, the card closes up again.
    if (vLf.z > .01) {
      vec2 g = vLf.xy / vLf.z, ci = floor(g), cf = fract(g) - .5;
      float hh = h21(ci + 3.7), ang = (h21(ci + 11.3) - .5) * 1.4, ca = cos(ang), sa = sin(ang), maple = step(.3, vLf.z), far = smoothstep(26., 60., d);
      cf -= (vec2(h21(ci + 23.1), h21(ci + 41.9)) - .5) * .28;
      vec2 r = vec2(cf.x * ca + cf.y * sa, -cf.x * sa + cf.y * ca);
      float shp = mix(r.x * r.x * 8. + r.y * r.y * 3.3 + r.y * .22, dot(r, r) * 4.6 * (1. + .32 * cos(5. * atan(r.y, r.x + 1e-5))), maple);
      if (far < .97 && (hh > .9 || shp > mix(.75, 2.6, far))) discard;
      cutK = mix(.7 + .6 * h21(ci + 5.9), 1., far);
    }
  #endif
  // willow leaves: each broad blade is cut into narrow hanging leaflets (in the plant's rest frame, so the cut rides the sway)
  if (vLace > .5 && vn3(vP0 * vec3(13., 4.5, 13.)) < .47 - .2 * smoothstep(14., 40., d)) discard;
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)); if (!gl_FrontFacing) N = -N;
  float leafy = smoothstep(.25, .6, vF), bark = step(.5, vKind) * step(vKind, 1.5), stone = step(1.5, vKind), up = 0., glint = 0.;
  vec3 alb = vC * (.8 + .4 * vn(vP.xz * 5. + vP.y * 4.)) * (.74 + .52 * vn3(vP * vec3(.8, 1.1, .8)));
  if (bark > .5) {
    // white birch: chalk-white paper with short dark lenticel dashes lying across the stem, black scars where limbs were
    // shed, tan where the paper has peeled, and a rough dark foot
    float ang = atan(vN.z, vN.x + 1e-5), y = vP0.y, row = floor(y * 5.5);
    vec2 lq = vec2(ang * 2.1 + row * 1.7, y * 5.5), ci = floor(lq), cf = fract(lq); float hh = h21(ci + 3.);
    float dash = step(.4, hh) * (1. - smoothstep(.1, .26, abs(cf.y - .5))) * smoothstep(0., .12, cf.x) * (1. - smoothstep(.45 + .4 * hh, .6 + .4 * hh, cf.x));
    vec2 bq = vec2(ang * .8 + floor(y * 1.9) * 2.3, y * 1.9), bf = fract(bq); float bh = h21(floor(bq) + 11.);       // and the long dark bands that half ring the stem
    dash = max(dash, step(.5, bh) * (1. - smoothstep(.06, .15 + .1 * bh, abs(bf.y - .5))) * smoothstep(0., .1, bf.x) * (1. - smoothstep(.75, .95, bf.x)));
    float scar = smoothstep(.66, .74, vn(vec2(ang * .8 + 3., y * 1.3))) * (.6 + .4 * vn(vec2(ang * 5., y * 9.)));
    float foot = (1. - smoothstep(.1, 1.7, y + .9 * vn(vec2(ang * 2., y * 1.6)))) * (.4 + .5 * vn(vec2(ang * 4., y * 6.)));
    vec3 paper = mix(vec3(.72, .7, .64), vec3(.66, .5, .36), smoothstep(.6, .78, vn(vec2(ang * 1.7 + 9., y * 2.6))) * .5) * (.86 + .22 * vn(vec2(ang * 7., y * 2.)));
    alb = mix(paper, vec3(.05, .045, .04), clamp(max(max(dash * .9, scar), foot * .88), 0., 1.)) * vC;
    up = .5 - .5 * N.y;
  }
  if (stone > .5) {
    // travertine: rimstone ridges following its contours, pits, cream where it is dry, amber and dark where the water keeps it wet
    float h = vLoc.y, w1 = vn(vP0.xz * 3.1), tr = fract(h * 6.5 + 1.3 * w1 + .35 * vn(vP0.xz * 9.));
    float lip = smoothstep(0., .1, tr) * (1. - smoothstep(.1, .34, tr)), crease = 1. - smoothstep(0., .5, tr);
    float pit = vn3(vP0 * 14.) * .6 + vn3(vP0 * 31. + 5.) * .4, pits = 1. - smoothstep(.2, .36, pit);
    float wet = 1. - smoothstep(-.06, .2, h + .12 * (w1 - .5));
    alb = vC * (.72 + .5 * lip - .28 * crease) * (1. - .5 * pits) * (.85 + .3 * vn(vP0.xz * 21.));
    alb = mix(alb, alb * vec3(.5, .37, .22), wet * .85);
    N = normalize(N + vec3(vn(vP0.xz * 11.) - .5, 0., vn(vP0.xz * 11. + 7.) - .5) * .7 + vec3(0., .5 * (lip - crease), 0.));
    vec3 Rf = reflect(-V, N); float sr = max(dot(Rf, uSun), 0.), s2 = sr * sr; s2 *= s2; s2 *= s2;
    glint = (s2 * s2 * .9 + .08 * (1. - max(dot(N, V), 0.))) * (.35 + .65 * wet);
  }
  // (round 13) the old spruces on the lip stand over the slot's white water: its light comes up under their boughs and in
  // at the side that faces the slot, so each is a tree of lit green tiers, not a dark cut-out from the climb. A rule of
  // the place: conifers within 22-40 m of the axis, from 40 m behind the fall's line outward.
  float wl = (1. - smoothstep(22., 40., abs(vP.x - (${F.toFixed(1)})))) * smoothstep(uFallZ - 40., uFallZ - 22., vP.z) * (1. - bark) * (1. - stone) * (1. - leafy);
  up = max(up, wl * clamp(.55 - .45 * N.y + .5 * N.x * sign((${F.toFixed(1)}) - vP.x), 0., 1.));
  float sunK = 1.;
  #ifdef ISLE
    // No leaf brighter than paper; and the island keeps the key of the hour. In the blue shade of dawn its gold is ochre and
    // its scarlet wine; under the moon the crowns are blue-grey, and only the leaves on the side the moon catches keep their gold.
    alb *= cutK; alb *= min(1., .8 / max(max(alb.r, alb.g), max(alb.b, 1e-3)));
    float rimI = uIsLit.z * smoothstep(.74, .96, vRim) * leafy * smoothstep(.85, 1.15, cutK);      // (a thin rim: only the edge that faces the moon)
    alb = mix(mix(alb, dot(alb, vec3(.3, .55, .15)) * uIsTone.rgb, uIsTone.a * mix(.5, 1., leafy)) * uIsLit.x, mix(alb, vec3(.8, .68, .4), .45) * vec3(1.15, 1., .72), rimI);
    sunK = mix(uIsLit.y, 1., rimI);
  #endif
  alb = mix(alb, vec3(.82, .86, .92), uSnow * smoothstep(.5, .95, N.y) * (.15 + .55 * vn3(vP * 1.3 + 4.)));
  float sd = dot(N, uSun), ndl = max(sd, 0.);
  ndl = mix(ndl, ndl * .6 + .4 * (sd * .5 + .5) + .45 * max(-sd, 0.) * max(dot(-V, uSun), 0.), leafy);
  #ifdef ISLE
    // every crown half lit, half blue: the light falls on the crown as a whole, in leaf masses with a lit side and a shaded
    // side and a darker underside, not on each leaf alone (so no crown is a glowing blob)
    float mass = vn3(vP * .5) - .5, cl = smoothstep(-.3, .5, vRim + .7 * mass + .3 * (vn3(vP * 1.8 + 9.) - .5));
    ndl = mix(ndl, cl * (.45 + .55 * ndl) * 1.1, leafy * .88);
    alb = mix(alb, alb * vec3(.46, .58, .98), leafy * (1. - cl) * .62 * (1. - .6 * uIsTone.a));
    alb *= mix(1., .72 + .56 * smoothstep(-.25, .25, mass + .35 * N.y), leafy);
  #endif
  vec3 col = alb * (uSunCol * ndl * sunGate(vP) * sunK + mix(uGndCol, uSkyCol, N.y * .5 + .5) * (1. + .3 * leafy) + uShW * .5 + uFill * .8
    + (uSunCol * sunW(vP) * .3 + uSkyCol * .5 + uShW * .4) * up);                // (white bark over white water takes the water's light from below)
  col += (uSunCol * sunW(vP) + uSkyCol * .6 + uShW) * glint;
  // (round 13) a crown that stands up a slope is hazed as the slope behind it is (the land's own rule: the blue haze that
  // lies along the foot of the walls and thickens with distance), so the stands on a wall sink into its painted canopy
  // and are not dark cut-outs on it. Only a crown whose foot stands 6-36 m or more over the lake's level: the trees of the
  // valley floor are as they were.
  float sl = smoothstep(6., 36., vFootY), fo = smoothstep(30., 150., vP.y) * (1. - smoothstep(500., 1600., d)) * sl;
  float hzK = 1. + sl * (.45 * fo + smoothstep(90., 380., d) * (.3 + .6 * (1. - smoothstep(120., 420., vP.y)) + uWallHz * smoothstep(250., 1000., d)));
  gl_FragColor = vec4(mix(col, mix(uHaze, mix(uHor, uZen, .62), .6 * fo), 1. - exp(-d * uHazeK * hzK)), 1.);
}`,An=`
attribute float aDepth, aFoot; varying vec3 vP; varying float vDepth, vFoot;
void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vP = wp.xyz; vDepth = aDepth; vFoot = aFoot; gl_Position = projectionMatrix * viewMatrix * wp; }`,Fn=`
${ot}
${Qe}
${Ka}
uniform vec3 uBone, uGold, uScar, uSpruce, uTurq; uniform float uFallZ;
uniform vec4 uRaft[24], uRaftB[24]; uniform vec3 uDuck[9];   // leaf rafts: centre xz, half width, half length; unit direction xz, hue, wander (m). The flight's nine ducks: xz, how near the water
varying vec3 vP; varying float vDepth, vFoot;
float hgt(vec2 q, float churn){ return .05 * vn(q * .3 + uTime * vec2(.06, .04)) + .02 * vn(q * 1.1 - uTime * .13) + churn * .07 * vn(q * 1.7 + vec2(uTime * .3, uTime * 1.3)); }
void main(){
  vec3 Vv = cameraPosition - vP; float d = length(Vv); vec3 V = Vv / max(d, 1e-3); vec2 q = vP.xz;
  vec2 fq = fwidth(q); float pz = max(fq.x, fq.y), pxA = length(dFdx(q)), pxL = length(dFdy(q));   // (a pixel's width and length on the water)
  float churn = 1. - smoothstep(3., 34., q.y - uFallZ - 8. * vn(vec2(q.x * .07, 2.))), e = .2;
  // THE FOOT OF THE FALLS (vFoot: metres out from where the falling water lands): no straight edge and no dark band there.
  // A ragged carpet of foam lies 6-13 m out on the water, boiling; beyond it the image of the falls is broken by the chop
  // and its lowest ten metres are the white of the spray, not the dark of wet rock
  float ft = vFoot + 2.4 * (vn(vec2(q.x * .31, 3. + uTime * .2)) - .5), carpet = 1. - smoothstep(1., 4. + 18. * vn(vec2(q.x * .09, 4.)) * (.5 + vn(vec2(q.x * .31, 11.))), ft);
  churn = max(churn, carpet);
  float h0 = hgt(q, churn), hx = hgt(q + vec2(e, 0.), churn), hz = hgt(q + vec2(0., e), churn);
  vec3 N = normalize(vec3(h0 - hx, e, h0 - hz));
  // (round 11) THE IMAGE IN THE LAKE IS SOFT AND RIPPLED. Long low wavelets lie across the view and draw every edge of it
  // out into a wavering fringe; the outlines of the slopes, the peak and the trees are soft and ragged, never a cut-out
  float rw = vn(vec2(q.x * .21, q.y * 1.7 - uTime * .4)) - .5, rw2 = vn(vec2(q.x * .55 + 3., q.y * 4.3 + uTime * .65)) - .5;
  N = normalize(N + vec3(.02 * rw2, 0., .05 * rw + .022 * rw2));
  float om = 1. - clamp(dot(N, V), 0., 1.), Fr = .03 + .97 * om * om * om * om * om;
  vec3 R = reflect(-V, N); R.y = abs(R.y) + .004; R = normalize(R);
  float hl = max(length(R.xz), 1e-4); vec2 dr = R.xz / hl; float ty = R.y / hl, az = atan(dr.x, -dr.y + 1e-5);
  float md = max(dot(R, uSun), 0.); vec3 c = mix(uHor, uZen, pow(max(R.y, 0.), .4)) + uSunCol * uMoon * (5. * smoothstep(.9978, .9988, md) + .2 * pow(md, 400.));
  float rag = (vn(vec2(az * 38., ty * 17.)) - .5) * .04 + (vn(vec2(az * 9., 5.)) - .5) * .05;
  // the snow peak at the head of the valley stands in the water on the axis, over the image of the spruce clump
  float pk = .42 * max(0., 1. - pow(abs(az) / .2, .85)) * (.9 + .2 * vn(vec2(az * 40., 2.)));
  vec3 snowC = mix(uSunCol * (.35 + .65 * uLow) + uSkyCol * 1.1, uSkyCol * 1.7 + uShW * .5, smoothstep(-.03, .05, az * (uSun.x < 0. ? 1. : -1.) + .05 * (vn(vec2(ty * 60., az * 30.)) - .5)));
  vec3 pkC = mix(vec3(.3, .32, .38) * (uSunCol * .5 * uLow + uSkyCol * 1.3), snowC * .82, smoothstep(.4, .7, ty / max(pk, 1e-3) + .25 * vn(vec2(az * 80., ty * 45.))));
  c = mix(c, mix(pkC, uHaze, .3), smoothstep(-.012, .03, pk - ty + rag * .5));
  float sl = (.12 + .4 * pow(abs(dr.x), 1.5)) * (.8 + .4 * vn(vec2(az * 2.2 + 4., 1.7)));
  float sf = clamp(ty / max(sl, 1e-3), 0., 1.), stx = vn(vec2(az * 30., ty * 60.)), stb = vn(vec2(az * 7. + 3., ty * 9.));
  vec3 slope = mix(uSpruce * (1.2 + .9 * stx), uGold * (.34 + .3 * stx), smoothstep(.45, .7, stb * .7 + stx * .3) * (.35 + .65 * smoothstep(.3, .75, sf)));
  slope = mix(slope, vec3(.34, .35, .39), smoothstep(.78, .95, sf + .15 * (stb - .5)));                    // forest below, larch gold, bare rock at the crest
  slope *= uSunCol * (.25 + .75 * smoothstep(-.2, .6, dr.x * -uSun.x)) * (.55 + .45 * uLow) + uSkyCol + uFill;
  c = mix(c, mix(slope, uHaze, .25 + .25 * sf), smoothstep(-.025, .05, sl - ty + rag));
  if (dr.y < -.05) {                                                    // the fall and the trees on its lip
    float tt = (uFallZ - q.y) / (dr.y * hl), hx2 = q.x + R.x * tt;
    tt = (uFallZ + lobeG(hx2) - q.y) / (dr.y * hl); hx2 = q.x + R.x * tt;                                      // (the face bulges: its image does too)
    float hh = R.y * tt, clump = (1. - smoothstep(9., 25., abs(hx2 + 100.))) * smoothstep(4., 8., abs(hx2 + 100.));
    float inside = 1. - smoothstep(98., 112., abs(hx2 + 100.));
    float wht = smoothstep(.3, .72, vn(vec2(hx2 * .55, 3.)) * .7 + .45 * vn(vec2(hx2 * .21, 9.))) * (.75 + .25 * vn(vec2(hx2 * 1.7, hh * .2 - uTime * .6)));
    vec3 fall = mix(mix(vec3(.2, .135, .075), uSpruce * 2.6 + vec3(.03, .05, 0.), vn(vec2(hx2 * .23, hh * .3))) * (uSunCol * .5 * uWSun + uSkyCol + uShW * .8 + uFill * .6), (uSunCol * .45 * uWSun + uSkyCol * .9 + uShW) * .8, wht * .9);
    fall = mix(fall, (uSunCol * .5 * uWSun + uSkyCol + uShW) * .85, (1. - smoothstep(1., 11. + 4. * vn(vec2(hx2 * .2, 2.)), hh)) * .8);
    // the trees on the lip: separate crowns, big and small, ragged, each with a lighter top; on the axis the dark spruce clump stands over all of them
    float crown = 23. + 8. * vn(vec2(hx2 * .16, 5.)) + 8. * vn(vec2(hx2 * .55, 9.)) * vn(vec2(hx2 * 1.3, 2.)) + 13. * clump * (.7 + .3 * vn(vec2(hx2 * .9, 7.))), k2 = vn(vec2(hx2 * .21, 8.));
    vec3 tc = mix(mix(uGold, uScar, step(.72, k2)), uSpruce * .9, max(step(k2, .42), clump)) * (uSunCol * .5 * uLow + uSkyCol * .8) * .75 * (1. - .45 * clump);
    tc *= .7 + .6 * smoothstep(crown - 9., crown, hh);
    c = mix(c, tc, inside * smoothstep(crown + 1.5, crown - 5., hh + 60. * rag) * step(0., tt));
    fall *= mix(1., formK(hx2, uSun.x), .7 * smoothstep(11., 16., abs(hx2 + 100.)));
    c = mix(c, fall, inside * smoothstep(26., 23.5, hh + 20. * rag) * step(0., tt));
  }
  vec3 body = mix(uBone * .55, uTurq, 1. - exp(-vDepth * .9)) * (uSunCol * (.25 + .5 * uSun.y) * sunGate(vP) + uSkyCol * 1.15);
  vec3 col = mix(body, c, clamp(Fr * 1.15 + .04, 0., .92));
  // (round 13) THE RAFTS OF LEAVES: twenty-four streaks of red and gold lying on the lake, each 10-30 m long and 1.5-4 m
  // wide, wandering a little, ragged at the edge, some redder, some all gold. Near the lens every leaf is a pointed oval a
  // hand long lying any way round; where a pixel holds several the streak is their mean colour, so from the far shore and
  // through the portal a raft is still a plain warm streak on the turquoise, never a scatter of specks.
  // (hand mend after round 13: this supersedes the note above) THE RAFTS ARE DRIFTS OF LEAVES, NOT PAINT. Each is a short
  // windrow at most 12 m long and 2 m wide (uRaft: half width, half length; the mask is nothing beyond them), narrowing to
  // its ends, ragged, and BROKEN: the turquoise shows through a third of it in holes 1-3 m across, and its ends thin out
  // into single leaves. It is gold first with scarlet flecks (30 leaves in a hundred, more in one patch and fewer in the
  // next), and what is drawn far off is what lies there near: no raft is one colour, none is redder than its leaves.
  // Near the lens every leaf is a pointed oval a hand long lying any way round; where a pixel holds several, the drift
  // is drawn in dabs (clumps of leaves three pixels across), seven gold to three scarlet, and turquoise water between them.
  float rM = 0., rgn = vn(q * .55 + 3.), rgn2 = vn(q * 1.9 + 11.);      // (ragged edges: lobes 2 m and 0.5 m across; they only ever eat into a raft)
  for (int i = 0; i < 24; i++) {
    vec4 A = uRaft[i], B = uRaftB[i]; if (A.z < .01) break;             // (the rafts in use come first; one not in use has no width)
    vec2 r = q - A.xy;
    float al = r.x * B.x + r.y * B.y, ac = r.y * B.x - r.x * B.y + B.w * sin(al * .23 + B.z * 40.);
    float ea = abs(al) / max(A.w, .01), sp = clamp(1. - ea * ea, 0., 1.);   // (a spindle: at its ends 0.7 of its width; it thins over the last two fifths of its length)
    float m = (1. - smoothstep(.8, 1., abs(ac) / max(A.z * (.7 + .3 * sp), .01) * (1. + .2 * rgn + .12 * rgn2))) * (1. - smoothstep(.6, 1., ea * (1. + .15 * rgn + .1 * rgn2)));
    rM = max(rM, m);
  }
  rM *= 1. - churn;
  if (rM > .002) {
    // THE HOLES are of the lake's own coordinates (a noise of 1.05 m and 0.5 m lobes; a third of the lake lies under its
    // .43 level: holes 1-3 m across), so a raft is a chain of clumps. Where it holds, it is thick in one metre and thin
    // in the next (thick), and scarlet has 0.12 to 0.48 of it, 0.3 in the mean, in patches 1-2 m across (sc).
    // cv: the share of the water the leaves hide: .6 in the thick of the raft and .45 where it is thin, falling through
    // .2 to nothing over its ragged rim and its thinning ends, and nothing in its holes
    float hole = smoothstep(.385, .475, .6 * vn(q * .95 + 23.) + .4 * vn(q * 2.1 + 41.));
    float thick = smoothstep(.2, .55, vn(q * 1.2 + 17.)), sc = clamp(.3 + .4 * (vn(q * .8 + 7.) - .5), .12, .48);
    float lF = 1. - smoothstep(.2, .6, pz * 3.1), cv = (.45 + .15 * thick) * rM * hole;   // (lF: 0 where a leaf is under a pixel)
    // (near: three layers of leaf cells of different pitch and lie, every cell full, so the leaves never stand in a lattice;
    // together they hide .39 of the water where they lie. lsd: how far inside the nearest leaf's outline, in cells)
    vec2 lq = q * 3.1, lc = floor(lq), lo = fract(lq) - .5 - .34 * (vec2(h21(lc + 5.), h21(lc + 9.)) - .5);
    float lan = h21(lc + 17.) * 6.283, lca = cos(lan), lsa = sin(lan), lh = h21(lc + 2.); vec2 lr = vec2(lo.x * lca + lo.y * lsa, -lo.x * lsa + lo.y * lca);
    float lsd = .17 * (1. - lr.x * lr.x * 9.) - abs(lr.y);
    vec2 mq = q.yx * 4.37 + 13.3, mc = floor(mq), mo = fract(mq) - .5 - .34 * (vec2(h21(mc + 3.), h21(mc + 8.)) - .5);
    float man = h21(mc + 19.) * 6.283, mca = cos(man), msa = sin(man); vec2 mr = vec2(mo.x * mca + mo.y * msa, -mo.x * msa + mo.y * mca);
    float msd = .17 * (1. - mr.x * mr.x * 9.) - abs(mr.y);
    if (msd > lsd) { lsd = msd; lh = h21(mc + 2.); lr = mr; lc = mc + 50.; }
    vec2 nq = vec2(q.x + q.y, q.x - q.y) * 2.65 + vec2(7.7, 3.1), nc = floor(nq), no = fract(nq) - .5 - .34 * (vec2(h21(nc + 4.), h21(nc + 6.)) - .5);
    float nan2 = h21(nc + 23.) * 6.283, nca = cos(nan2), nsa = sin(nan2); vec2 nr = vec2(no.x * nca + no.y * nsa, -no.x * nsa + no.y * nca);
    float nsd = .17 * (1. - nr.x * nr.x * 9.) - abs(nr.y);
    if (nsd > lsd) { lsd = nsd; lh = h21(nc + 2.); lr = nr; lc = nc + 90.; }
    // (THE DABS: a noise whose cells are 0.385 m, or three pixels where that is more, along the lake's two axes each for
    // itself (across the lake: three of a pixel's widths, and never less than the pixel's whole reach along x; along it:
    // three of its reaches along z; the octave of each axis is blended into the next, as the glitter's is). A dab is
    // where the noise stands over the level that leaves the share cv of the water under it (.82 - .64 cv, measured for
    // this noise); it is scarlet where a second noise, of cells 0.55 as wide, stands over the level of the share sc
    // (flecks, smaller than the dabs). Near the lens the dabs spread (cv / .39) and the leaves stand inside them: far
    // off each leaf is drawn so fat that the three layers close the dab, and as the lens nears they shrink to their own
    // outline and the water opens between them, so a clump opens into its leaves, is never drawn twice and never as a
    // wash. A cell is never longer than 6 m (half a raft); where a pixel is 2.5-5 m long on the water (the farthest
    // slivers) the dabs give way to their mean.)
    float cvE = mix(cv, min(cv / .39, 1.), lF);
    vec2 dl = log2(clamp(vec2(max(pxA, fq.x * .34), fq.y), vec2(.128), vec2(1e3, 2.)) * 7.8), di = floor(dl), dfr = dl - di, dsc = 2.6 * exp2(-di);
    float dn = mix(mix(vn(q * dsc + 31.), vn(q * dsc * vec2(.5, 1.) + 31.), dfr.x), mix(vn(q * dsc * vec2(1., .5) + 31.), vn(q * dsc * .5 + 31.), dfr.x), dfr.y);
    float dh = mix(mix(vn(q * dsc * vec2(1.8, 1.37) + 77.), vn(q * dsc * vec2(.9, 1.37) + 77.), dfr.x), mix(vn(q * dsc * vec2(1.8, .685) + 77.), vn(q * dsc * vec2(.9, .685) + 77.), dfr.x), dfr.y);
    float dg = 1. / sqrt(max((dfr.x * dfr.x + (1. - dfr.x) * (1. - dfr.x)) * (dfr.y * dfr.y + (1. - dfr.y) * (1. - dfr.y)), .25));   // (octaves half blended vary less than one: made up)
    dn = .5 + (dn - .5) * dg; dh = .5 + (dh - .5) * dg;
    float dabK = 1. - smoothstep(2.5, 5., fq.y), th = mix(1.02, .82 - .64 * cvE, smoothstep(0., .15, cvE));
    float cover = mix(cvE, smoothstep(th - .06, th + .06, dn), dabK) * smoothstep(0., .05, lsd + 1.6 * (1. - lF) * (1. - lF));
    float scar = mix(mix(sc, smoothstep(-.06, .06, dh - .82 + .64 * sc), dabK), step(1. - sc, lh), lF);
    vec3 lcol = mix(uGold * mix(vec3(.94, .88, .8), mix(vec3(1.), vec3(.8, .62, .4), step(.5, lh)), lF), uScar, scar) * (.82 + .36 * vn(q * 1.6 + 29.));
    // IN SHADE, AT DAWN AND UNDER THE MOON THE LEAVES ARE DULL GOLD-BROWN, never maroon: warm is 1 where the warm sun itself
    // lies on the water and 0 in the valley's shade and by moonlight. As it falls, a gold leaf goes four fifths of the
    // way to a brown-gold (the palette's gold with its red held back a tenth and its green and blue let up), a scarlet
    // one nearly all the way (.95) to the same brown-gold a sixth darker (so the drift keeps two tones, and neither
    // is red), and the light they are seen by loses three fifths of its colour (the blue of the sky's light, which
    // makes scarlet wine-dark and gold green) for its own brightness, a little warm.
    float warm = sunW(vP) * (1. - uMoon);
    lcol = mix(mix(lcol, (uGold * vec3(.9, 1.1, 1.2) + vec3(.04, .04, .02)) * mix(vec3(1.), vec3(.85, .8, .78), scar), mix(.8, .95, scar)), lcol, warm);
    vec3 lL = uSunCol * (.3 + .6 * uSun.y) * sunGate(vP) + uSkyCol * 1.1;
    lL = mix(dot(lL, vec3(.3, .59, .11)) * vec3(1.1, 1., .8), lL, .4 + .6 * warm);
    lcol *= lL * .8 * mix(1., (.82 + .36 * h21(lc + 7.)) * (.75 + .25 * smoothstep(0., .04, abs(lr.y))), lF);
    col = mix(col, lcol, cover * .94);
    rM = cover;                                                           // (what follows is hidden only where a leaf lies: the rings and the glitter show in the holes and between the dabs)
  } else rM = 0.;
  // and under the flight of ducks that leads the lens up the lake: two or three rings of downwash on the water under
  // each bird (2 m across), stronger the lower it flies, and once it is within 3 m of the water a short thin V
  // behind it (they fly toward -z)
  float dkR = 0., dkV = 0.;
  for (int i = 0; i < 9; i++) {
    vec3 D = uDuck[i]; vec2 r = q - D.xy; float l = length(r), ry = max(r.y, 0.), vv = abs(r.x) - .22 * ry;
    dkR += D.z * sin(l * 5.5 - uTime * 6. + 2.5 * vn(r * .9 + D.xy)) * exp(-l * 1.4) * smoothstep(.1, .5, l) * (.35 + .65 * vn(r * 1.6 + D.yx));   // (rings broken and bent: a ruffle, never a target)
    dkV += smoothstep(.7, .98, D.z) * exp(-vv * vv / (.012 + .0016 * ry * ry)) * smoothstep(.4, 2.2, r.y) * exp(-ry * .7);
  }
  vec3 wWhite = uSunCol * .7 * sunW(vP) + uSkyCol + uShW;
  col = mix(col * (1. - .16 * clamp(-dkR, 0., 1.)), wWhite * .9, clamp(max(dkR, 0.) * .36 + dkV * (.22 + .4 * vn(vec2(q.x * 3., q.y * 1.4 - uTime * 1.5))), 0., .6) * (1. - rM * .7));
  float foam = churn * smoothstep(.42, .7, vn(vec2(q.x * 1.3 + uTime * .15, q.y * 1.3 - uTime * .8)) + .35 * churn - .1);
  float lace = smoothstep(.34, .6, vn(vec2(q.x * 1.7, q.y * 1.7 - uTime * 1.2)) * .55 + vn(q * .6 + vec2(uTime * .1, -uTime * .35)) * .45 + .6 * carpet - .25);
  foam = max(foam, carpet * lace);
  col = mix(col, (uSunCol * .8 * sunW(vP) + uSkyCol + uShW) * .95, foam * .85);
  float sr = max(dot(reflect(-V, N), uSun), 0.), s2 = sr * sr; s2 *= s2; s2 *= s2; s2 *= s2; s2 *= s2;
  col += uSunCol * s2 * s2 * 3. * sunGate(vP) * (1. - .75 * uMoon);
  // (round 11) a band of glitter lies across the lake where the breath of the fall ruffles it, 15 to 60 m out from the foot
  // (vFoot): glints along the wavelets near the lens, and where a pixel holds many of them their mean, a soft bright band
  // (round 13: the band reaches 50-92 m out, so that it lies across the middle of the lake from the entry and through the
  // portal; there, where a pixel is metres of water long, the glints are drawn as the dashes they are at that slant:
  // cells 0.6 m across and, along the view, as long as two to five pixels cover (the octave is chosen from the pixel's own
  // length on the water and blended into the next), so the glitter is fine and bright at every distance)
  float gFF = 1. - smoothstep(.12, .5, pz), glod = log2(max(pxL, .03) * 5.), gl0 = floor(glod), gs0 = exp2(-gl0);
  vec2 ga = vec2(q.x * 1.6, q.y * gs0), gb = vec2(q.x * 1.6, q.y * gs0 * .5), gt1 = vec2(uTime * .25, -uTime * .5 * gs0), gt2 = vec2(7. - uTime * .3, uTime * .4 * gs0);
  float sp0 = vn(ga + gt1) * vn(ga * 2.3 + gt2), sp1 = vn(gb + gt1) * vn(gb * 2.3 + gt2);
  float gband = smoothstep(13., 25., ft) * (1. - smoothstep(50., 92., ft)) * (1. - carpet) * smoothstep(14., 38., d) * (1. - .8 * rM);   // (never under the lens itself: there a glint would be a white patch)
  float gsp2 = smoothstep(.31, .4, mix(sp0, sp1, glod - gl0)) * (1. - smoothstep(.3, .7, pxA * 1.6)) * smoothstep(.09, .3, pz);
  float gsp = smoothstep(.62, .82, vn(vec2(q.x * 2.4, q.y * 7.) + vec2(uTime * .3, -uTime * 1.1)) * vn(vec2(q.x * 5.3 + 7., q.y * 2.9) - vec2(uTime * .4, uTime * .5)) * 2.2) * smoothstep(.035, .09, pz) * gFF;
  float gsoft = .08 + .2 * smoothstep(.4, .7, vn(vec2(q.x * .09 + uTime * .03, q.y * .45 - uTime * .12)));
  col += (uSkyCol * 1.1 + uSunCol * .45 * sunGate(vP) + uShW * .6) * gband * (gsoft * .6 + .4 * gsp + .85 * gsp2);
  gl_FragColor = vec4(hazed(col, d), smoothstep(0., .3, vDepth));
}`,Tn=`
attribute vec4 aT; attribute float aF, aSt, aLg; varying vec2 vUv; varying vec3 vP; varying vec4 vT; varying float vF, vSt, vLg;
void main(){
  vec4 wp = modelMatrix * vec4(position, 1.); vP = wp.xyz; vUv = uv; vT = aT; vF = aF; vSt = aSt; vLg = aLg;
  vec4 c1 = projectionMatrix * viewMatrix * wp;
  vec3 tc = cameraPosition - wp.xyz; float dl = max(length(tc), 1e-3);
  vec4 c2 = projectionMatrix * viewMatrix * vec4(wp.xyz + tc / dl * min(.9, dl * .3), 1.);
  if (c1.w > 1e-3 && c2.w > 1e-3) c1.z = c2.z / c2.w * c1.w;
  gl_Position = c1;
}`,Ln=`
${ot}
${Qe}
${Ka}
uniform vec3 uGold; uniform float uLate;
varying vec2 vUv; varying vec3 vP; varying vec4 vT; varying float vF, vSt, vLg;
void main(){
  float d = distance(cameraPosition, vP), e = 1. - abs(vUv.x), w = vT.z, yl = vUv.y, xm = vUv.x * w, sd = vT.y, t = uTime * vT.x;
  float nearT = 1. - smoothstep(30., 130., d), fineT = 1. - smoothstep(9., 36., d), midT = 1. - smoothstep(60., 150., d), closeT = 1. - smoothstep(7., 24., d);
  float seg = floor(clamp(vLg, 0., .999) * 3.), lk = 1. - smoothstep(.03, .1, abs(fract(vLg * 3. + .5) - .5));
  float x1 = xm + (vn(vec2(xm * .8 + sd * 17. + seg * 5.3, yl * .06 - t * .08)) - .5) * .7 + (h21(vec2(seg + 1.7, sd * 91.)) - .5) * .5 * w;
  float s1 = vn(vec2(x1 * 2.3 + sd * 41. + seg * 9.1, yl * .1 - t * .3));
  float s2 = mix(.5, vn(vec2(x1 * 5.2 + sd * 13., yl * .26 - t * .7)), midT);
  float s3 = mix(.5, vn(vec2(x1 * 11. + sd * 7., yl * .7 - t * 1.6)), fineT);
  float strand = s1 * .38 + s2 * .4 + s3 * .22;                    // (streaked: the veil is strands with the wet rock between, from the far shore as from the slot)
  float ends = smoothstep(0., 1.6, yl) * smoothstep(0., 2.4, vT.w - yl);
  float fe = smoothstep(0., .8, e), body = fe * fe * (3. - 2. * fe);
  float aFar = body * (.3 + .7 * smoothstep(.34, .62, strand));
  float aNear = body * smoothstep(.4, .56, strand + .22 * (e - .5));
  float cl1 = vn(vec2(x1 * 5.5 + sd * 9., yl * 1.25 - t * 2.6)), cl2 = vn(vec2(x1 * 13. + sd * 5., yl * 3.1 - t * 5.5));
  float aClose = body * smoothstep(.4, .6, strand + .08 * (vSt - .5)) * smoothstep(.3, .58, cl1 * .6 + cl2 * .4 + .25 * (strand - .5));
  float a = mix(mix(aFar, aNear, nearT * .8), aClose, closeT * .85);
  // Beside the lens (the walls of the slot) the water is drawn in world space, so nothing follows the ribbon and nothing shows
  // where it bends: tumbling white clots, an opaque foamy core, edges that break into clots and drops. No sheet, no streak.
  float slotK = 1. - smoothstep(13., 17., abs(vP.x - (${F.toFixed(1)})));           // the walls of the slot are seen from inside it: clots from far further off
  float tumT = 1. - smoothstep(mix(19., 44., slotK), mix(42., 90., slotK), d);
  vec2 wq = vec2(xm * 1.1 + (vP.x * .83 + vP.z * .71) * .35 + sd * 13., vP.y * .8 - yl * .45);     // (across the veil; down it: height, and the run of the veil counted in, so the pattern still travels where it crosses a ledge)
  // strands, not clots: every layer is drawn out three to four times along the fall and runs downward, each wandering a
  // little as it goes; the veil's edge breaks into single strands and drops, and its length into separate leaps
  float wx = wq.x + .2 * (vn(vec2(wq.y * .6, sd * 7.)) - .5), wy = wq.y;
  float k1 = vn(vec2(wx * 1.7, wy * .36 + t * .55)), k2 = vn(vec2(wx * 4.3 + 3.1 + .2 * wy, wy * .95 + t * 1.4)), k3 = vn(vec2(wx * 9.6 + 7.7 - .15 * wy, wy * 2.4 + t * 3.3));
  float clot = k1 * .44 + k2 * .33 + k3 * .23, eR = e + .2 * (k2 - .5) + .32 * (k3 - .5), core = smoothstep(.05, .7, eR);   // (a ragged edge: the ribbon's own never shows)
  float gapL = smoothstep(.3, .5, vn(vec2(sd * 31. + wx * .5, wy * .2 + t * .35)) + .25 * core);                     // the leaps
  float dropT = step(.8, vn(vec2(wx * 21., wy * 5.5 + t * 7.))) * (1. - core) * smoothstep(-.1, .1, eR) * .7;        // drops flung off the edge
  // (round 11) BESIDE THE LENS THE WATER FALLS IN LEAPS, SHELF TO SHELF: shelves at the spacing of the rock's own (ledgePh, the
  // count the rock is painted from) break every veil into strands two or three metres tall, each with its own place, width and wander;
  // it leaves a lip narrow, frays as it falls and bursts on the tread below, and one leap in three is missing, the water
  // gone behind the stone, so the rock, its rim and its moss show between. Shapes with breaks: no ribbon, no long streak.
  // Every column of water (a metre wide) has its own run of leaps: its own count of drops and its own heights, so no two
  // neighbours break at one level and neither the face nor a wall of the slot ever reads as courses or tiles. A leap is a
  // tongue: narrow where it leaves a lip, spreading as it falls, frayed by the same travelling strands, ending in its burst.
  float colX = xm * .95 + sd * 7., cellS = floor(colX), hcol = h21(vec2(cellS * 1.7 + 3.1, sd * 37.));
  float lp = ledgePh(vP) * mix(.7, 1.3, hcol) + fract(hcol * 13.7), lid = floor(lp), lfr = lp - lid;
  float cfS = fract(colX) - .5 + .34 * (h21(vec2(lid * 3.7 + cellS * 1.3, sd * 7.3)) - .5);
  // (a broad veil of the bays is many leaps side by side with few missing; a thread on a buttress is one leap wide and often gone)
  float denseW = smoothstep(.8, 2.2, w);
  float hc = h21(vec2(cellS * 3.1 + lid * 13.7, sd * 57. + 1.)), keepL = step(mix(.24, .07, denseW), hc);     // (round 12: one leap in four of a thread is missing, one in fourteen of a veil: it was two in five and one in seven)
  // (no leap is a slab: its head and its foot are ragged, it leaves the lip as a thin film that gathers as it falls, and
  // within fifty metres of the lens it is fine strands with the wet rock dark between them)
  float nearL = 1. - smoothstep(14., 48., d), lfrN = clamp(lfr + .16 * (vn(vec2(wx * 2.7 + hc * 3., wy * .8)) - .5), 0., 1.);
  // (round 12) a leap reaches from its lip nearly to the tread below: its head gathers within a fifth of the drop and its
  // foot frays only over the last fifth, so the leaps of one column join into a body of falling water and are not left
  // hanging apart as spindles
  float fallK = smoothstep(0., .2, lfrN) * (1. - smoothstep(.8, 1., lfrN));
  float wdt = mix(.46, .15, smoothstep(.3, 1., lfr)) * (.7 + .6 * fract(hc * 7.31)) * mix(1., 1.25, denseW), offS = abs(cfS + .13 * (vn(vec2(wy * 1.3 + hc * 9., sd * 3.)) - .5));
  float texS = smoothstep(.22, .55, k2 * .5 + k3 * .5 + .25 * (1. - offS / max(wdt, .05)));
  float texF = smoothstep(.3, .62, k3 * .62 + k2 * .38 + .2 * (1. - offS / max(wdt, .05)));                 // beside the lens each tongue is itself fine strands, the rock dark between them
  float sA = (1. - smoothstep(wdt * .3, wdt, offS)) * keepL * fallK * (mix(.5, .16, nearL) + mix(.5, .84, nearL) * texS) * mix(1., .22 + .78 * texF, nearL);
  float puffS = smoothstep(0., .1, lfrN) * (1. - smoothstep(.12, .36, lfrN)) * keepL * smoothstep(.36, .6, vn(vec2(wx * 2.6 + hc * 5., wy * 2.2 + t * 1.3)) + .3 * (1. - 2. * abs(cfS)));
  // (round 12) and behind the leaps the veil keeps a body: a thin film of water in strands down its whole length, densest
  // in its middle, which the leaps ride on. Within 40 m of the lens a veil is one piece of water again, the wet rock
  // showing through between its strands, never detached white dashes.
  float filmS = body * smoothstep(.3, .6, k1 * .45 + k2 * .35 + k3 * .2 + .22 * (e - .5)) * mix(.34, .6, denseW);
  float aLeap = max(max(max(sA, puffS * .75), filmS) * smoothstep(-.05, .25, eR), dropT * keepL);
  float aTum = mix(max(smoothstep(.62 - .46 * core, .86 - .4 * core, clot) * smoothstep(.02, .3, eR) * mix(1., gapL, .75 * slotK), dropT), aLeap, 1. - smoothstep(38., 80., d));
  a = mix(a, aTum, tumT);
  // (round 11) on the open face the leaps hold from the foot of the fall out to 50-100 m (metres from the lens): closing on
  // the fall, each veil resolves from a far thread into tongues of water that break on every shelf, with the rock, its rims
  // and its moss between them. Nothing is drawn out into a streak along the face.
  a = mix(a, aLeap, (1. - smoothstep(50., 100., d)) * (1. - slotK));
  float burst = lk * body * (.5 + .5 * vn(vec2(xm * 2.6 + sd * 5., yl * .8 - t * 2.2)));
  burst *= 1. - tumT;                                             // (beside the lens the burst on a ledge is the clots themselves, not a white bar)
  a = max(a, burst * .9) * mix(mix(.74, 1., smoothstep(.3, 1.3, w)), 1., tumT) * mix(1., .55 + .45 * vSt, tumT) * ends * vF;
  float side = vUv.x * (uSun.x < 0. ? 1. : -1.), sw = sunW(vP), beadT = 1. - smoothstep(18., 60., d);
  vec3 white = uSunCol * .75 * sw + uSkyCol * .95 + uShW;
  // a round body of water: its sun-side third burns warm, its far side falls into blue shade
  vec3 col = white * (.56 + .44 * smoothstep(.36, .8, strand)) * mix(vec3(1.), vec3(.66, .74, .87), smoothstep(.05, .9, -side) * (.3 + .6 * sw));
  col = mix(col, white * 1.06, burst);
  col *= mix(1., .7 + .5 * cl2, closeT * (1. - tumT));
  col = mix(col, white * mix(mix(vec3(.85, .91, 1.), vec3(.68, .8, .98), 1. - smoothstep(14., 48., d)), vec3(1.03), smoothstep(.25, .8, k2 * .55 + k3 * .45 + .25 * (k1 - .5))) * mix(.92, 1., core), tumT);   // white all through: pale blue in its hollows, never grey
  col *= mix(1., mix(.78, 1.06, smoothstep(.6, 1.4, formK(vP.x, uSun.x))), (1. - slotK) * (1. - .6 * tumT));              // (round 11) the veils on a buttress's shaded flank and in the alcoves are in the face's own shade
  col += (uSunCol * .5 * sw + uShW * .3) * smoothstep(.12, .7, side) * (.6 + .4 * s2) * (1. - .6 * tumT);
  float bead = smoothstep(.62, .76, vn(vec2(x1 * 7. + sd * 3., yl * 1.1 - t * 3.4))) * beadT * smoothstep(.3, .55, strand) * (1. + .8 * closeT) * (1. - .85 * tumT);
  col += (uSunCol * 1.5 * sw + uSkyCol * .5 + uShW) * bead * (.55 + .45 * smoothstep(-.3, .6, side));
  col = mix(col, uGold * (uSunCol + uSkyCol), uLate * step(.8, vn(vec2(vUv.x * 9. + sd * 31., yl / max(w, .3) * 3. - t * 2.))) * .8 * (1. - .9 * closeT));   // (the riding leaves are specks from afar)
  gl_FragColor = vec4(hazed(col, d), clamp(a + bead * .5 * ends * vF * body, 0., 1.) * mix(.92, .97, tumT));
}`,qn=`
uniform float uTime; uniform vec3 uSun;
attribute vec4 aV; attribute vec2 aS; varying vec2 vUv; varying vec3 vP; varying float vK, vSide, vSeed;
void main(){
  float ph = fract(uTime * .03 * (.7 + .6 * fract(aV.w * 7.3)) + aV.w);
  vec3 c = aV.xyz + vec3(sin(ph * 6.283 + aV.w * 40.) * .8, ph * aS.y * .3, 0.);
  vec3 toC = cameraPosition - c; float dl = length(toC.xz);
  vec2 rgt = dl > 1e-3 ? vec2(toC.z, -toC.x) / dl : vec2(1., 0.);
  vec3 p = c + vec3(rgt.x, 0., rgt.y) * (position.x * aS.x) + vec3(0., position.y * aS.y, 0.);
  vUv = vec2(position.x * 2., position.y); vP = p; vSeed = aV.w;
  vSide = dot(rgt, normalize(uSun.xz + vec2(1e-5, 0.)));
  vK = sin(ph * 3.1416) * smoothstep(5., 16., length(toC));
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
}`,Cn=`
${ot}
${Qe}
uniform float uVeil;
varying vec2 vUv; varying vec3 vP; varying float vK, vSide, vSeed;
void main(){
  float y = vUv.y, d = distance(cameraPosition, vP);
  // a column that leans and wanders as it climbs, widest low down, torn into long wisps by noise drawn out along its height
  float n2 = vn(vec2(vUv.x * 5. - vSeed * 5., y * 6.5 - uTime * .27));
  float r = vUv.x - (vn(vec2(vSeed * 13., y * 2.6 - uTime * .06)) - .5) * 1.1 * y + (n2 - .5) * .4 * (.3 + y);   // ragged edges
  float wid = mix(.7, .36, y), sx = clamp(1. - r * r / (wid * wid), 0., 1.), shape = sx * sx * smoothstep(0., .07, y) * (1. - smoothstep(.2, 1., y));
  float n = fbm(vec2(r * 2.3 + vSeed * 9., y * 2.1 - uTime * .1));
  float n3 = fbm(vec2(r * 5.3 + vSeed * 3., y * 4.6 - uTime * .17));                // a finer tear: holes the rock shows through
  float a = shape * smoothstep(.43, .58, n + .22 * (1. - y) + .3 * (n2 - .5)) * smoothstep(.3, .6, n3 + .12 * (1. - y)) * vK * uVeil;
  if (a < .004) discard;
  float lit = smoothstep(-.45, .55, r / wid * vSide + .5 * (n - .5));
  vec3 col = mix(uSkyCol * 1.45 + uHaze * .12 + uShW * .5, uSunCol * 1.05 * sunW(vP) + uSkyCol * 1.05 + uShW, lit);
  gl_FragColor = vec4(hazed(col, d) * a, a);
}`,En=`
varying vec3 vP, vN;
void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vP = wp.xyz; vN = normal; gl_Position = projectionMatrix * viewMatrix * wp; }`,Kn=`
${ot}
${Qe}
${Ka}
${zs}
uniform vec3 uBone, uMoss, uTurq;
varying vec3 vP, vN;
void main(){
  vec3 Vv = cameraPosition - vP; float d = length(Vv); vec3 V = Vv / max(d, 1e-3), N = normalize(vN + vec3(0., 1e-5, 0.));
  float xr = vP.x - (${F.toFixed(1)}), ax = abs(xr), t = uTime;
  float q = (vP.z - ${Jt.toFixed(1)}) / ${(bo-Jt).toFixed(1)} * ${at.toFixed(1)} - .3 * cos(xr * .33) + .09 * sin(xr * 1.1 + 1.7);
  float k = floor(q), f = q - k, on = step(-.5, k) * step(k, ${at.toFixed(1)} - .5);
  float wS = (1. - smoothstep(5.2, 9.2, ax)) * smoothstep(302.5, 306.5, vP.z) * (1. - smoothstep(366.5, 371., vP.z)) * on;
  float pool = 1. - smoothstep(.6, .66, f), rim = smoothstep(.57, .64, f) * (1. - smoothstep(.69, .73, f)), ris = smoothstep(.69, .74, f);
  float dp = 1. - smoothstep(.12, .62, f);                                // depth of a pool: 1 at its head, 0 at the rim
  float pebble = vn3(vP * 5.) * .6 + vn3(vP * 13. + 4.) * .4;
  vec3 marl = uBone * vec3(.62, .56, .4) * (.7 + .5 * pebble);
  vec3 water = mix(marl, uTurq * (.75 + .2 * pebble), .35 + .6 * dp);
  water = mix(water, uTurq * vec3(.35, .75, .85), dp * dp * .5);
  float drape = vn(vec2(vP.x * 1.6 + k * 3.7, vP.y * .9)) * .6 + vn(vec2(vP.x * 4.6 + 3., vP.y * 2.6)) * .4;
  // (round 11: the dam under the white water is dark wet stone and moss in cushions with an edge, cream only at its lip: no brown smear between the strands)
  vec3 dam = mix(vec3(.13, .105, .075), uBone * vec3(.46, .4, .27), smoothstep(.45, .8, drape)) * (.7 + .5 * pebble);
  dam = mix(dam, uMoss * (.75 + .6 * pebble), smoothstep(.5, .56, vn3(vP * vec3(1.3, 1.1, 1.3) + 7.)) * .85);
  vec3 alb = mix(mix(water, uBone * vec3(.8, .74, .58) * (.75 + .35 * pebble), rim), dam, ris);
  alb = mix(wetRock(vP, uMoss, uBone, d, N.y), alb, wS);
  // White water over each dam: strands that fall. They are drawn in space (across the slot, down the drop), three to four
  // times as long as they are wide and running downward, each wandering a little; between them the wet drapery of the dam
  // shows. At the foot of every drop a line of foam, ragged on its pool side; the pool beyond it is clear to its marl.
  float xs = vP.x + (vn(vec2(vP.x * .7, k * 3.1)) - .5) * .8 + .42 * (vn(vec2(vP.y * 1.1, k * 5.1 + vP.x * .3)) - .5);
  float sA = vn(vec2(xs * 2.3 + k * 7.3, 1.7 + vP.y * .05)), sB = vn(vec2(xs * 5.9 + k * 2.9, vP.y * .3 + t * .6)), sC = vn(vec2(xs * 13. + 4.1, vP.y * 1.1 + t * 2.5));
  float strand = sA * .38 + sB * .38 + sC * .24, run = vn(vec2(xs * 3.6 + 9., vP.y * .85 + t * 3.2));    // run: the brightness that travels down a strand
  // (round 13) the edge of every strand is ragged: it wavers a hand's width from side to side every half metre of its fall
  // and frays finer still, so a gap between two strands opens and pinches shut down the drop and is never a straight slot
  float rag = (vn(vec2(xs * 4.3 + k * 1.9, vP.y * 2.4 + t * 1.3)) - .5) * .3 + (vn(vec2(xs * 11. + 3.7, vP.y * 6.5 + t * 3.1)) - .5) * .14;
  float fall = smoothstep(.39, .57, strand + .14 + rag);                     // (strands with an edge, the dam between them)
  float over = smoothstep(.6, .68, f) * (1. - smoothstep(.7, .76, f));
  float drops = step(.78, vn(vec2(xs * 19., vP.y * 5.5 + t * 9.))) * (1. - fall) * ris * .55;                 // drops in the gaps
  float ww = ris * fall * (.78 + .22 * run) + drops + over * smoothstep(.34, .56, sB * .6 + sA * .4) * .75;
  float foamN = vn(vec2(vP.x * 3. + t * .3, vP.z * 3. - t * 1.2)) * .6 + vn(vP.xz * 8. + t * vec2(.5, -2.)) * .4;
  float foam = max((1. - smoothstep(.03, .1 + .09 * foamN, f)) * step(.5, k), smoothstep(.9, .985, f) * (.6 + .4 * foamN));   // the line at the foot of the drop
  float lines = smoothstep(.72, .82, vn(vec2(vP.x * 1.1 + foamN, vP.z * 2.2 - t * .4))) * pool * .14;
  float inPool = pool * wS;
  vec3 Np = normalize(vec3((vn(vP.xz * 2.1 + t * vec2(.2, .5)) - .5) * .25, 1., (vn(vP.xz * 2.1 + 5. - t * vec2(.3, .4)) - .5) * .25));
  N = normalize(mix(normalize(N + vec3(pebble - .5, 0., vn(vP.xz * 5. + 9.) - .5) * .5), Np, inPool));
  vec3 lightC = uSunCol * max(dot(N, uSun), 0.) * sunGate(vP) + mix(uGndCol, uSkyCol, N.y * .5 + .5) + uShW * 1.2 + uFill * .6 + (uSkyCol * .9 + uSunCol * .1) * (1. - wS * pool);
  vec3 col = alb * lightC;
  float ov = 1. - max(dot(V, Np), 0.), fr = .03 + .6 * ov * ov * ov * ov;
  col = mix(col, mix(uHor, uZen, .7) * .9, inPool * fr);
  vec3 white = uSunCol * .8 * sunW(vP) + uSkyCol + uShW;
  col = mix(col, white * mix(vec3(.86, .92, 1.), vec3(1.02), smoothstep(.3, .7, run * .6 + sC * .4)), clamp(ww + foam * .92 + lines, 0., 1.) * wS);   // (white all through: the low end of its range is pale blue, never grey)
  float al = (1. - smoothstep(9.6, 10.8, ax)) * smoothstep(0., .3, q);
  gl_FragColor = vec4(hazed(col, d), al);
}`,Rn=`
varying vec2 vUv; varying vec3 vP;
void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vP = wp.xyz; vUv = uv; gl_Position = projectionMatrix * viewMatrix * wp; }`,Bn=`
${ot}
${Qe}
uniform float uVeil;
varying vec2 vUv; varying vec3 vP;
void main(){
  float y = vUv.y, d = distance(cameraPosition, vP), t = uTime;
  float n = fbm(vec2(vUv.x * .11, y * 1.7 - t * .06)), n2 = fbm(vec2(vUv.x * .37 + 7., y * 2.9 - t * .13));
  float a = smoothstep(.3, .78, n * .6 + n2 * .4 + .42 * (1. - y) - .3 * y) * (1. - smoothstep(.3, 1., y)) * smoothstep(0., .06, y);
  a *= (1. - smoothstep(98., 108., abs(vUv.x))) * smoothstep(8., 17., abs(vUv.x) + 3. * (n2 - .5)) * smoothstep(9., 30., d) * uVeil * .8;   // (it thins away before the slot, so the slot's wall never cuts it)
  if (a < .004) discard;
  vec3 col = mix(uSkyCol * 1.4 + uHaze * .12 + uShW * .6, uSunCol * sunW(vP) + uSkyCol * 1.05 + uShW, .35 + .5 * n2);
  gl_FragColor = vec4(hazed(col, d) * a, a);
}`,Ls=`
uniform float uTime;
attribute vec4 aV; attribute vec2 aS; varying vec2 vUv; varying vec3 vP; varying float vSeed, vK;
void main(){
  vec3 c = aV.xyz + vec3(sin(uTime * .05 + aV.w * 40.) * 4., 0., cos(uTime * .04 + aV.w * 23.) * 3.);
  vec3 toC = cameraPosition - c; float dl = length(toC.xz);
  vec2 rgt = dl > 1e-3 ? vec2(toC.z, -toC.x) / dl : vec2(1., 0.);
  vec3 p = c + vec3(rgt.x, 0., rgt.y) * (position.x * aS.x) + vec3(0., position.y * aS.y, 0.);
  vUv = vec2(position.x * 2., position.y); vP = p; vSeed = aV.w;
  vK = smoothstep(10., 30., length(toC)) * (1. - smoothstep(240., 380., length(toC))) * (1. - smoothstep(3.2, 8., cameraPosition.y));   // (looked down on from the turn a sheet of mist is a pale patch with an edge: it is there only for a lens near the water)
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
}`,qs=`
${ot}
${Qe}
uniform float uMist;
varying vec2 vUv; varying vec3 vP; varying float vSeed, vK;
void main(){
  float y = vUv.y, x = vUv.x, d = distance(cameraPosition, vP);
  float n = fbm(vec2(x * 1.6 + vSeed * 9. + uTime * .012, y * 3.2 + vSeed * 4.)), sx = clamp(1. - x * x, 0., 1.);
  float a = sx * sx * smoothstep(0., .12, y) * (1. - smoothstep(.25, 1., y)) * smoothstep(.3, .7, n + .25 * (1. - y)) * vK * uMist;
  if (a < .004) discard;
  vec3 V = normalize(cameraPosition - vP + vec3(0., 1e-5, 0.));
  float fw = max(dot(-V, uSun), 0.), lit = sunW(vP) * (.45 + .55 * fw * fw);
  vec3 col = mix(uSkyCol * 1.3 + uHaze * .15 + uShW * .4, uSunCol * 1.1 + uSkyCol, lit);
  gl_FragColor = vec4(hazed(col, d) * a, a);
}`,Nn=`
attribute float aSeed; varying vec2 vUv; varying vec3 vP; varying float vSeed;
void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vP = wp.xyz; vUv = uv; vSeed = aSeed; gl_Position = projectionMatrix * viewMatrix * wp; }`,In=`
${ot}
${Qe}
uniform float uBankK; uniform vec4 uBeam;      // strength; the sun's azimuth (xz, unit), cos and sin of its elevation
varying vec2 vUv; varying vec3 vP; varying float vSeed;
void main(){
  float d = distance(cameraPosition, vP), y = vP.y, t = uTime;
  float n = fbm(vec2(vP.x * .03 + vSeed * 7.3 + t * .016, y * .16 - t * .008 + vSeed * 3.1));
  float n2 = fbm(vec2(vP.x * .1 - t * .03 + vSeed * 11., y * .4 + vSeed * 5. + t * .012));
  float plan = smoothstep(.34, .62, fbm(vec2(vP.x * .017 + t * .006, vP.z * .05 + 4.)));              // billows and gaps in plan: a bank, not a bar
  float top = 1. + 6.5 * n * plan, body = (1. - smoothstep(top * .15, top, y)) * smoothstep(0., .3, y);
  float near = smoothstep(7., 26., d) * (1. - smoothstep(.55, 1., abs(vUv.x))) * (1. - .45 * smoothstep(110., 230., d));
  float a = body * smoothstep(.2, .7, n * .45 + n2 * .55 + .1) * (.25 + .75 * plan) * near;
  float b = y * uBeam.z - dot(vP.xz, uBeam.xy) * uBeam.w;
  float beam = smoothstep(.4, .64, vn(vec2(b * .2 + vSeed * 1.7, vP.z * .05)) * .62 + vn(vec2(b * .53 + 3., vSeed * 9. + vP.z * .02)) * .38);
  float sw = sunW(vP), hz = (1. - smoothstep(top, top + 9., y)) * smoothstep(0., .6, y) * near;   // (a thin haze over the bank still shows the shafts)
  vec3 V = normalize(cameraPosition - vP + vec3(0., 1e-5, 0.));
  float fw = max(dot(-V, uSun), 0.), lit = sw * (.12 + .88 * beam) * (.7 + .3 * fw * fw);
  float al = clamp(a * .11 * (.6 + .4 * mix(1., beam, sw)) + hz * beam * sw * .075, 0., 1.) * uBankK;
  if (al < .003) discard;
  vec3 col = mix(uSkyCol * 1.2 + uHaze * .22 + uShW * .45, uSunCol * 1.7 + uSkyCol * .8, lit);
  gl_FragColor = vec4(hazed(col, d) * al, al);
}`,Dn=`
uniform float uTime, uU, uDur, uResY;
attribute vec4 aO, aV; varying vec2 vUv; varying float vK, vLeaf;
void main(){
  vec3 c; float size, k = 1., leaf = step(aV.w, 0.);
  if (leaf > .5) {
    float tau = (uU - aO.w) * uDur; k = step(0., tau) * (1. - smoothstep(2.4, 3.6, tau)); tau = max(tau, 0.);
    c = aO.xyz + vec3(aV.x * tau * .4 + sin(tau * 3.1 + aV.z * 9.) * .35, -1.1 * tau + aV.y * tau * exp(-tau * 2.), aV.z * tau * .4 + cos(tau * 2.6 + aV.x * 7.) * .35); size = .2;
  } else {
    float T = aV.w, tau = fract(uTime / T + aO.w) * T;
    c = aO.xyz + aV.xyz * tau - vec3(0., 4.9 * tau * tau, 0.); size = .05 + .04 * fract(aO.w * 7.3); k = smoothstep(0., .08, tau) * (1. - smoothstep(T * .8, T, tau));
  }
  vec4 mv = viewMatrix * vec4(c, 1.);
  size = max(size, -mv.z * 3.2 / (projectionMatrix[1][1] * max(uResY, 1.)));            // never under about 1.6 px
  mv.xy += position.xy * size;
  vUv = position.xy * 2.; vK = k; vLeaf = leaf; gl_Position = projectionMatrix * mv;
}`,Wn=`
${Qe}
uniform vec3 uGold; varying vec2 vUv; varying float vK, vLeaf;
void main(){
  float r = length(vUv), a = (1. - smoothstep(.35, 1., r)) * vK;
  if (a < .01) discard;
  vec3 col = mix((uSunCol * 2.2 * uWSun + uSkyCol + uShW * 2.) * 1.3, uGold * (uSunCol * .8 * (.3 + .7 * uWSun) + uSkyCol), vLeaf);
  gl_FragColor = vec4(col * a, a * mix(.75, 1., vLeaf));
}`,On=`
attribute vec4 iA; attribute float iW; varying vec2 vUv; varying float vW;
void main(){
  float len = 1.5 + 7.5 * iW, c = cos(iA.w), s = sin(iA.w);
  vec2 l = vec2(position.x * len * .56, -position.z * len - .1);
  vec3 p = vec3(iA.x + l.x * c + l.y * s, .04, iA.z - l.x * s + l.y * c);
  vUv = vec2(position.x * 2., position.z); vW = iW * step(iA.y, .4);
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
}`,Vn=`
${ot}
${Qe}
varying vec2 vUv; varying float vW;
void main(){
  float v = vUv.y, ax = abs(vUv.x), n = vn(vec2(vUv.x * 7., v * 16. - uTime * 2.5));
  float arms = smoothstep(.15, 0., abs(ax - v * .8)) * smoothstep(0., .06, v);
  float core = smoothstep(.2, 0., ax) * (1. - smoothstep(.04, .4, v));
  float a = (arms * (.5 + .5 * n) + core * .45 * (.4 + .6 * n)) * (1. - v) * clamp(vW * 1.8, 0., 1.) * .8;
  if (a < .01) discard;
  gl_FragColor = vec4((uSunCol * .55 * uWSun + uSkyCol * 1.15 + uShW) * a, a);
}`,ko=t=>t-Math.floor(t),Ra=(t,r)=>{let c=ko(t*.1031),m=ko(r*.103);const d=c*(m+33.33)+m*(c+33.33);return c+=d,m+=d,ko((c+m)*c)},Cs=(t,r)=>{const c=Math.floor(t),m=Math.floor(r);let d=t-c,R=r-m;return d=d*d*(3-2*d),R=R*R*(3-2*R),N(N(Ra(c,m),Ra(c+1,m),d),N(Ra(c,m+1),Ra(c+1,m+1),d),R)},ea=(t,r)=>{let c=0,m=.5;for(let d=0;d<3;d++){c+=m*Cs(t,r);const R=(.8*t-.6*r)*2.07+13.7;r=(.6*t+.8*r)*2.07+7.1,t=R,m*=.5}return c/.875},Gn=(t,r)=>{let c=0,m=.5;for(let d=0;d<4;d++)c+=m*Cs(t,r),t=t*2.03+17.1,r=r*2.03+9.2,m*=.5;return c/.9375},Ba={aut:0,scar:0,larch:0};function Hn(t,r,c,m,d=0){let R=t*.0043+.0016*r,T=c*.0043;const y=ea(R*2.1+3,T*2.1+3),l=ea(R*2.1+11,T*2.1+11);R+=(y-.5)*.4,T+=(l-.5)*.4;const x=ea(R*2.9,T*2.9),p=ea(R*6.7+5,T*6.7+5),P=ea(R*4.3+21,T*4.3+21),H=ea((.8*t-.6*c)*.045+r*.02,(.6*t+.8*c)*.045+r*.02),A=Gn(t*.011+3,c*.011+3),B=te(300,420,m+140*(A-.5))*(1-te(560,650,m)),q=1-te(35,240,m+90*(p-.5)),I=.7-.28*ze(.06+.5*q+.5*B+.22*d*te(120,300,m)*(1-te(520,640,m)),0,1);return Ba.aut=te(I-.05,I+.05,x*.62+p*.38+(H-.5)*.14),Ba.scar=te(.5,.64,P)*(1-B)*.85,Ba.larch=B,Ba}const se=t=>new h.Color(t),st=()=>({p:[],c:[],f:[],i:[]});function nt(t){const r=new h.BufferGeometry;return r.setAttribute("position",new h.Float32BufferAttribute(t.p,3)),r.setAttribute("aCol",new h.Float32BufferAttribute(t.c,3)),r.setAttribute("aFlex",new h.Float32BufferAttribute(t.f,1)),r.setIndex(t.i),r.computeVertexNormals(),r}function mt(t,r,c,m,d,R,T){const y=t.p.length/3,l=r.length,x=[0,0,0];for(let p=0;p<l;p++){const P=r[p],H=r[Math.max(0,p-1)],A=r[Math.min(l-1,p+1)],B=p/(l-1),q=N(c,m,B);let I=A[0]-H[0],U=A[1]-H[1],$=A[2]-H[2];const E=Math.hypot(I,U,$)||1;I/=E,U/=E,$/=E;let Q=Math.abs(U)>.9?1:0,_=Math.abs(U)>.9?0:1,le=0,he=_*$-le*U,O=le*I-Q*$,K=Q*U-_*I;const v=Math.hypot(he,O,K)||1;he/=v,O/=v,K/=v;const w=U*K-$*O,k=$*he-I*K,L=I*O-U*he;for(let j=0;j<d;j++){const J=j/d*6.2832,ie=Math.cos(J)*q,ue=Math.sin(J)*q;t.p.push(P[0]+he*ie+w*ue,P[1]+O*ie+k*ue,P[2]+K*ie+L*ue),R(B,x),t.c.push(x[0],x[1],x[2]),t.f.push(T(B))}}for(let p=0;p<l-1;p++)for(let P=0;P<d;P++){const H=y+p*d+P,A=y+p*d+(P+1)%d;t.i.push(H,H+d,A,A,H+d,A+d)}}function Na(t,r,c,m,d,R,T,y,l,x,p,P,H){const A=Math.hypot(R,T,y)||1;R/=A,T/=A,y/=A;let B=r.range(-1,1),q=r.range(-.3,.3),I=r.range(-1,1),U=T*I-y*q,$=y*B-R*I,E=R*q-T*B;const Q=(Math.hypot(U,$,E)||1)/(x*.5);U/=Q,$/=Q,E/=Q;const _=t.p.length/3,le=c+R*l*.45,he=m+T*l*.45,O=d+y*l*.45;t.p.push(c,m,d,le+U,he+$,O+E,c+R*l,m+T*l,d+y*l,le-U,he-$,O-E);for(let K=0;K<4;K++){const v=P*(K===2?1.12:K===0?.8:1);t.c.push(p.r*v,p.g*v,p.b*v),t.f.push(H)}t.i.push(_,_+1,_+3,_+1,_+2,_+3)}const Bt=(t,r)=>(c,m)=>{m[0]=N(t.r,r.r,c),m[1]=N(t.g,r.g,c),m[2]=N(t.b,r.b,c)};function Es(t,r,c,m){const d=st(),R=Bt(se("#4a3d2c"),se("#8a8048")),T=m?6:5,y=m?46:20,l=m?.6:1,x=m?.42:1,p=new h.Color;for(let P=0;P<T;P++){const H=(P+t.range(-.3,.3))/T*6.2832,A=t.range(.22,.6),B=t.range(3,4.6),q=Math.cos(H),I=Math.sin(H),U=[];for(let $=0;$<=4;$++){const E=$/4,Q=A*B*Math.pow(E,1.5);U.push([q*Q,B*E*(1-.13*E),I*Q])}mt(d,U,.07,.014,3,R,$=>$*.45);for(let $=0;$<y;$++){const E=t.range(.22,1),Q=E*4,_=Math.min(3,Math.floor(Q)),le=Q-_,he=U[_],O=U[_+1];p.copy(r).lerp(c,t()),Na(d,t,N(he[0],O[0],le)+t.range(-.25,.25),N(he[1],O[1],le)+t.range(-.1,.3),N(he[2],O[2],le)+t.range(-.25,.25),q*t.range(0,.7)+t.range(-.4,.4),-t.range(.4,1.2),I*t.range(0,.7)+t.range(-.4,.4),t.range(.5,.85)*l,t.range(.2,.3)*x,p,t.range(.8,1.2),(m?.45:4.45)+.55*E)}}return nt(d)}function Un(t,r,c,m,d){const R=st(),T=se("#d6d1c2"),y=se("#2a2622"),l=new h.Color,x=[[0,-.4,0],[.2,1.8,.1],[.55,3.8,-.1],[1.2,5.8,.1],[2.1,7.6,0],[3.2,9,.1],[4.4,10,0]];mt(R,x,.24,.07,7,(B,q)=>{const I=t.chance(.2+.25*(1-B))?t.range(.15,.6):1;q[0]=N(y.r,T.r,I),q[1]=N(y.g,T.g,I),q[2]=N(y.b,T.b,I)},B=>B*.12);const p=Bt(se("#6b6258"),se("#4a3a2c")),P=[],H=[[4.5,1,.03,.14,4.7],[5.3,1,.1,-.16,4.9],[3.9,1,0,-.05,4.4]];for(let B=0;B<10;B++){const q=H[B],I=q?q[0]:t.range(2.4,6),U=Math.min(5,Math.floor(I)),$=I-U,E=[N(x[U][0],x[U+1][0],$),N(x[U][1],x[U+1][1],$),N(x[U][2],x[U+1][2],$)];let Q=q?q[1]:t.range(.15,1),_=q?q[2]:t.range(.1,.6),le=q?q[3]:t.range(-1,1);const he=Math.hypot(Q,_,le);Q/=he,_/=he,le/=he;const O=q?q[4]:t.range(2.4,4.4),K=[E,[E[0]+Q*O*.5,E[1]+_*O*.5+.25,E[2]+le*O*.5],[E[0]+Q*O,E[1]+_*O-.3,E[2]+le*O]];if(mt(R,K,q?.075:.055,q?.03:.012,4,p,w=>(q?.04:.12)+w*(q?.08:.3)),q)for(const w of[.62,.8,.96]){const k=w<.5?0:1,L=(w-.5)*2;P.push([N(K[k][0],K[k+1][0],L),N(K[k][1],K[k+1][1],L)+.06,N(K[k][2],K[k+1][2],L)])}const v=Math.round(84*d);for(let w=0;w<v;w++){const k=t.range(.25,1.08),L=k<.5?0:1,j=k<.5?k*2:Math.min(1,(k-.5)*2),J=K[L],ie=K[L+1],ue=.45+.75*k,ce=t();l.copy(ce<.6?r:ce<.9?c:m),Na(R,t,N(J[0],ie[0],j)+t.gauss()*ue*.5,N(J[1],ie[1],j)+t.gauss()*ue*.4-.2,N(J[2],ie[2],j)+t.gauss()*ue*.5,t.range(-.5,.5),-1,t.range(-.5,.5),t.range(.24,.36),t.range(.17,.25),l,t.range(.8,1.2),t.range(.6,1))}}const A=nt(R);return A.userData.perch=P,A}function Ks(t,r,c){const m=st(),d=new h.Color,R=r===0?8:0,T=10,y=r===0?1.5:.8,l=[],x=r===0?.26:.36,p=()=>{for(;l.length<m.p.length;)l.push(0)},P=(Q,_,le,he,O,K,v,w,k,L,j)=>{p(),Na(m,t,Q,_,le,he,O,K,v,w,k,L,j);const J=t.int(0,40)*x,ie=t.int(0,40)*x;l.push(J,ie,x,J+w*.5,ie+v*.45,x,J,ie+v,x,J-w*.5,ie+v*.45,x)},H=r===0?(Q,_)=>{const le=.92+.1*Math.sin(Q*23);_[0]=le,_[1]=le,_[2]=le}:Bt(se("#3b2a20"),se("#5a4030")),A=r===0?T*.97:T*.6,B=[];for(let Q=0;Q<=6;Q++){const _=Q/6;B.push([y*_*_+.25*Math.sin(_*5+1),-.5+(A+.5)*_,.2*Math.sin(_*4)])}mt(m,B,r===0?.21:.3,.03,7,H,Q=>R+Q*.06);const q=Q=>{const _=ze(Q,0,.999)*6,le=Math.floor(_),he=_-le;return[N(B[le][0],B[le+1][0],he),N(B[le][1],B[le+1][1],he),N(B[le][2],B[le+1][2],he)]},I=r===0?9:7,U=r===0?86:84,$=r===0?Bt(se("#8a8378"),se("#4a3a2c")):Bt(se("#4a352a"),se("#3a2a20"));for(let Q=0;Q<I;Q++){const _=r===0?.3+.66*(Q+t.range(.1,.9))/I:.42+.56*(Q+t.range(.1,.9))/I,le=q(_),he=Q*2.4+t.range(-.4,.4),O=(_-.3)/.7,K=r===0?N(3.1,1.5,O)*t.range(.85,1.15):N(4.4,2.6,O)*t.range(.85,1.15),v=r===0?t.range(.55,1):t.range(.35,.95)+(Q===I-1?1:0),w=Math.hypot(1,v),k=Math.cos(he)/w,L=v/w,j=Math.sin(he)/w,J=r===0?.35:.12,ie=[le,[le[0]+k*K*.5,le[1]+L*K*.5+.1*K,le[2]+j*K*.5],[le[0]+k*K,le[1]+L*K-J*K,le[2]+j*K]];mt(m,ie,r===0?.06:.1,.014,4,$,ue=>(r===0?R:0)+.06+ue*.25);for(let ue=0;ue<U;ue++){const ce=t.range(.2,1.1),we=ce<.5?0:1,ye=ce<.5?ce*2:Math.min(1,(ce-.5)*2),oe=ie[we],xe=ie[we+1],Pe=r===0?.36+.42*ce:.5+.6*ce,de=t();d.copy(de<.56?c[0]:de<.86?c[1]:c[2]);const ge=N(oe[0],xe[0],ye)+t.gauss()*Pe*.55,Ae=N(oe[1],xe[1],ye)+t.gauss()*Pe*(r===0?.55:.4)-(r===0?.35:0),Se=N(oe[2],xe[2],ye)+t.gauss()*Pe*.55;r===0?P(ge,Ae,Se,t.range(-.3,.3),-1,t.range(-.3,.3),t.range(.62,.95),t.range(.4,.56),d,t.range(.8,1.2),t.range(.6,1)):P(ge,Ae,Se,k+t.range(-.8,.8),t.range(-.55,.15),j+t.range(-.8,.8),t.range(.76,1.08),t.range(.6,.82),d,t.range(.78,1.2),t.range(.5,.9))}}p();const E=nt(m);return E.setAttribute("aLf",new h.Float32BufferAttribute(l,3)),E}async function _n(t,r,c,m,d){const R=st(),T=new h.Color,y=8,l=(O,K)=>{const v=.92+.1*Math.sin(O*23);K[0]=v,K[1]=v,K[2]=v},x=[[0,-.4,0],[.25,2,.1],[.7,4,-.1],[1.5,5.9,.1],[2.6,7.5,0],[3.9,8.7,.1],[5.2,9.5,0],[6.4,10.3,-.2],[7.3,11.2,.1],[7.9,12.3,0]];mt(R,x,.47,.035,8,l,O=>y+O*.05),mt(R,[[0,-.5,0],[.03,.3,.02],[.07,.9,.04],[.14,1.6,.06]],.68,.43,8,l,()=>y);const p=O=>{const K=Math.min(8,Math.floor(O)),v=O-K;return[N(x[K][0],x[K+1][0],v),N(x[K][1],x[K+1][1],v),N(x[K][2],x[K+1][2],v)]},P=Bt(se("#6a5a4a"),se("#4a3626")),H=[[6,[8.9,9.6,-.75],.2,.075],[3.75,[8.4,6.75,1.7],.23,.08],[4.5,[7.9,8,-2.2],.2,.075]],A=[],B=[],q=(O,K,v,w,k,L,j,J)=>{const ie=Math.hypot(K,v,w)||1;K/=ie,v/=ie,w/=ie;const ue=[O,[O[0]+K*k*.5,O[1]+v*k*.5+.08*k,O[2]+w*k*.5],[O[0]+K*k,O[1]+v*k-J*k,O[2]+w*k]];return mt(R,ue,L,.011,j,P,ce=>.08+.3*ce),B.push(ue),ue};for(const[O,K,v,w]of H){const k=p(O),L=[];for(let we=0;we<=5;we++){const ye=we/5;L.push([N(k[0],K[0],ye),N(k[1],K[1],ye)+.3*Math.sin(ye*Math.PI),N(k[2],K[2],ye)])}mt(R,L,v,w,6,l,we=>y+.02+.04*we),A.push({pts:L,r0:v,r1:w});const j=L[5],J=j[0]-L[4][0],ie=j[1]-L[4][1],ue=j[2]-L[4][2],ce=Math.atan2(ue,J);for(let we=0;we<3;we++){const ye=ce+[-.75,.05,.8][we]+t.range(-.15,.15),oe=[.12,.55,-.02][we]+t.range(-.08,.08),xe=t.range(1.25,1.9),Pe=q(j,Math.cos(ye),oe,Math.sin(ye),xe,w*.72,4,.12);for(let de=0;de<2;de++){const ge=Pe[1+de],Ae=ye+t.range(-1.1,1.1);q(ge,Math.cos(Ae),t.range(.1,.7),Math.sin(Ae),t.range(.6,1.05),.022,3,.2)}}for(let we=0;we<7;we++){const ye=.17+.115*we,oe=Math.min(4,Math.floor(ye*5)),xe=ye*5-oe,Pe=[N(L[oe][0],L[oe+1][0],xe),N(L[oe][1],L[oe+1][1],xe),N(L[oe][2],L[oe+1][2],xe)],de=ce+(we%2?1:-1)*t.range(.5,1.5),ge=t.range(1,1.8),Ae=q(Pe,Math.cos(de),t.range(.55,1.3),Math.sin(de),ge,.04,3,.1);if(we%2===0){const Se=de+t.range(-1,1);q(Ae[1],Math.cos(Se),t.range(.2,.9),Math.sin(Se),ge*.6,.02,3,.15)}}}for(let O=0;O<7;O++){const K=p(5.6+.48*O),v=(O%2?1:-1)*t.range(.6,2.2)+t.range(-.3,.3),w=t.range(1.1,2),k=q(K,Math.cos(v)+.35,t.range(.35,1.1),Math.sin(v),w,.04,3,.1),L=v+t.range(-1,1);q(k[1],Math.cos(L)+.2,t.range(.2,.8),Math.sin(L),w*.6,.02,3,.15)}const I=(O,K)=>{const v=A[O],w=K*5,k=Math.min(4,Math.floor(w)),L=w-k,j=v.pts[k],J=v.pts[k+1];return[N(j[0],J[0],L),N(j[1],J[1],L)+N(v.r0,v.r1,K),N(j[2],J[2],L)]},U=O=>{const K=A[O].pts;return Math.atan2(K[5][0]-K[0][0],K[5][2]-K[0][2])},$=p(5.3);$[1]+=.14;const E=[I(0,.92),I(1,.9),I(0,.4),I(1,.48),I(2,.72),$],Q=[U(0),U(1),U(0),U(1),U(2),Math.atan2(1.3,.1)],_=(O,K,v)=>{for(const w of E){const k=K-w[1];if(Math.abs(O-w[0])<.85&&k>-1.5&&k<2)return!1}return!0},le=(O,K,v,w)=>{if(!_(O,K,v))return;const k=t();T.copy(k<.55?r:k<.88?c:m),Na(R,t,O,K,v,t.range(-.6,.6),-1,t.range(-.6,.6),t.range(.34,.5)*w,t.range(.22,.3)*w,T,t.range(.75,1.2),t.range(.6,1))};await d();for(let O=0;O<B.length;O++){const K=B[O];(O&7)===7&&await d();for(let w=0;w<16;w++){const k=t.range(.25,1.04),L=k<.5?0:1,j=k<.5?k*2:(k-.5)*2,J=K[L],ie=K[L+1];le(N(J[0],ie[0],j)+t.range(-.16,.16),N(J[1],ie[1],j)+t.range(-.25,.1),N(J[2],ie[2],j)+t.range(-.16,.16),1)}const v=K[2];for(let w=0;w<13;w++)le(v[0]+t.gauss()*.42,v[1]+t.gauss()*.34,v[2]+t.gauss()*.42,1.08)}await d();const he=nt(R);return he.userData.slots=E,he.userData.yaws=Q,he}function Zn(t,r,c){const m=st(),d=10,R=Bt(se("#3a2f26"),se("#2a241e"));mt(m,[[0,-.5,0],[0,3,0],[.05,6.5,0],[0,d,0]],.2,.025,5,R,y=>y*.1);const T=(y,l,x,p,P,H)=>(m.p.push(y,l,x),m.c.push(p.r*P,p.g*P,p.b*P),m.f.push(H),m.p.length/3-1);for(let y=0;y<11;y++){const l=y/10,x=1.1+8.6*l,p=2.7*Math.pow(1-l,.8)+.28,P=t()*6.28;for(let H=0;H<6;H++){const A=P+H/6*6.2832+t.range(-.2,.2),B=p*t.range(.8,1.12),q=Math.cos(A),I=Math.sin(A),U=B*.36,$=t.range(.8,1.2),E=B*t.range(.3,.5),Q=T(q*.1,x,I*.1,r,.7*$,.02),_=T(q*B*.55-I*U,x-E*.5,I*B*.55+q*U,r,$,.12),le=T(q*B*.55+I*U,x-E*.5,I*B*.55-q*U,r,$,.12),he=T(q*B*.55,x-E*.25+.16*B,I*B*.55,c,.9*$,.1),O=T(q*B,x-E,I*B,c,1.15*$,.2);m.i.push(Q,_,he,Q,he,le,_,O,he,he,O,le)}}return nt(m)}function jn(t,r,c,m){const d=st(),R=6;d.p.push(0,.44,0),d.c.push(r.r*1.1,r.g*1.1,r.b*1.1),d.f.push(0);for(let T=0;T<2;T++)for(let y=0;y<R;y++){const l=y/R*6.283+T*.45,x=(T?1:.6)*t.range(.8,1.2),p=T?-t.range(.1,.4):.3*t.range(.8,1.2),P=T?c:r,H=t.range(.85,1.15);d.p.push(Math.cos(l)*x,p,Math.sin(l)*x),d.c.push(P.r*H,P.g*H,P.b*H),d.f.push(0)}for(let T=0;T<R;T++){const y=(T+1)%R;d.i.push(0,1+y,1+T,1+T,1+y,1+R+T,1+y,1+R+y,1+R+T)}for(let T=0;T<3;T++){const y=t()*6.283,l=t.range(.1,.5),x=t.range(.9,1.5),p=t.range(.2,.6),P=Math.cos(y),H=Math.sin(y),A=.06,B=t.range(.8,1.2),q=P*l,I=H*l,U=d.p.length/3;d.p.push(q-H*A,.15,I+P*A,q+H*A,.15,I-P*A,q+P*p*.4-H*A*.8,.15+x*.6,I+H*p*.4+P*A*.8,q+P*p*.4+H*A*.8,.15+x*.6,I+H*p*.4-P*A*.8,q+P*p,.15+x,I+H*p);for(let $=0;$<5;$++){const E=B*($<2?.8:$<4?1:1.2);d.c.push(m.r*E,m.g*E,m.b*E),d.f.push($<2?0:$<4?.5:1.3)}d.i.push(U,U+1,U+2,U+1,U+3,U+2,U+2,U+3,U+4)}return nt(d)}function Xn(t,r,c){const m=st();for(let d=0;d<10;d++){const R=t()*6.283,T=t.range(0,.35),y=t.range(1.5,2.3),l=t.range(.1,.5),x=Math.cos(R),p=Math.sin(R),P=.07,H=t.range(.8,1.2),A=x*T,B=p*T,q=m.p.length/3;m.p.push(A-p*P,0,B+x*P,A+p*P,0,B-x*P,A+x*l*.4-p*P*.8,y*.6,B+p*l*.4+x*P*.8,A+x*l*.4+p*P*.8,y*.6,B+p*l*.4-x*P*.8,A+x*l,y,B+p*l);for(let I=0;I<5;I++){const U=I<2?r:c,$=H*(I<2?.8:I<4?1:1.2);m.c.push(U.r*$,U.g*$,U.b*$),m.f.push(I<2?0:I<4?.5:1.3)}m.i.push(q,q+1,q+2,q+1,q+3,q+2,q+2,q+3,q+4)}return nt(m)}function $n(t){const r=st(),c=5;return[[.04,.5,.5],[.3,.78,.37],[.56,1,.24]].forEach(([m,d,R],T)=>{const y=r.p.length/3;r.p.push(0,d,0),r.c.push(1.15,1.15,1.15),r.f.push(.3);for(let l=0;l<c;l++){const x=(l+T*.4)/c*6.2832,p=R*(l%2?.82:1)*t.range(.85,1.15);r.p.push(Math.cos(x)*p,m-(l%2?0:.05)+t.range(-.02,.02),Math.sin(x)*p);const P=.42+.14*(l%2);r.c.push(P,P,P),r.f.push(.3)}for(let l=0;l<c;l++)r.i.push(y,y+1+(l+1)%c,y+1+l)}),nt(r)}function Qn(t){const r=st(),c=3;return[[.05,.62,.48],[.42,1,.3]].forEach(([m,d,R],T)=>{const y=r.p.length/3;r.p.push(0,d,0),r.c.push(1.15,1.15,1.15),r.f.push(.3);for(let l=0;l<c;l++){const x=(l+T*.5)/c*6.2832,p=R*(l%2?.84:1)*t.range(.85,1.15);r.p.push(Math.cos(x)*p,m-(l%2?0:.05)+t.range(-.02,.02),Math.sin(x)*p);const P=.42+.14*(l%2);r.c.push(P,P,P),r.f.push(.3)}for(let l=0;l<c;l++)r.i.push(y,y+1+(l+1)%c,y+1+l)}),nt(r)}function Rs(t,r=4){const c=st(),m=5,d=(R,T,y,l,x,p)=>{const P=c.p.length/3,H=t();c.p.push(R+t.range(-.04,.04),T+x,y+t.range(-.04,.04)),c.c.push(1.25*p,1.25*p,1.25*p),c.f.push(.5);for(let A=0;A<m;A++){const B=(A+H)/m*6.2832,q=l*t.range(.8,1.2);c.p.push(R+Math.cos(B)*q,T+t.range(-.25,.2)*x,y+Math.sin(B)*q);const I=p*t.range(.78,1.02);c.c.push(I,I,I),c.f.push(.5)}c.p.push(R,T-x*.8,y),c.c.push(.36*p,.36*p,.36*p),c.f.push(.3);for(let A=0;A<m;A++){const B=(A+1)%m;c.i.push(P,P+1+B,P+1+A,P+1+A,P+1+B,P+6)}};return d(0,.6,0,.36,.34,1),d(.25,.44,.1,.27,.26,.86),r>2&&(d(-.22,.46,-.14,.28,.27,.92),d(.03,.8,-.05,.22,.2,1.08)),nt(c)}function Yn(t,r,c){const m=st(),d=6,R=[[1,-.3,0],[.96,.1,.35],[.66,.36,1]],T=new h.Color;for(let y=0;y<3;y++)for(let l=0;l<d;l++){const x=(l+y*.5)/d*6.2832,p=R[y][0]*t.range(.82,1.15);m.p.push(Math.cos(x)*p,R[y][1]+(y?t.range(-.05,.07):0),Math.sin(x)*p),T.copy(c).lerp(r,R[y][2]),m.c.push(T.r,T.g,T.b),m.f.push(16)}m.p.push(t.range(-.1,.1),.5,t.range(-.1,.1)),m.c.push(r.r*1.08,r.g*1.08,r.b*1.08),m.f.push(16);for(let y=0;y<2;y++)for(let l=0;l<d;l++){const x=y*d+l,p=y*d+(l+1)%d;m.i.push(x,x+d,p,p,x+d,p+d)}for(let y=0;y<d;y++)m.i.push(2*d+y,3*d,2*d+(y+1)%d);return nt(m)}const Jn=`
attribute vec4 iK; varying vec2 vQ; varying vec3 vP;
void main(){
  vec2 q = vec2(position.x * 3.6, position.z * 6.4 - 1.5);                 // in stone radii: 1.8 either side, 1.5 upstream to 4.9 downstream (+Z)
  vec3 p = vec3(iK.x + q.x * iK.w, iK.y + .08 - (iK.z > 258. ? .078 : 0.) * q.y * iK.w, iK.z + q.y * iK.w);
  vQ = q; vP = p; gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
}`,e0=`
${ot}
${Qe}
varying vec2 vQ; varying vec3 vP;
void main(){
  float r = length(vQ), t = uTime, d = distance(cameraPosition, vP), ax = abs(vQ.x);
  float n = vn(vec2(vP.x * 9., vP.z * 4. - t * 6.)), n2 = vn(vec2(vP.x * 3.3, vP.z * 1.5 - t * 3.));
  float bow = smoothstep(.34, 0., abs(r - 1.14)) * smoothstep(1., -.3, vQ.y);
  float tail = smoothstep(1.2, .5, ax * (1. + .1 * vQ.y)) * smoothstep(.5, 1.3, vQ.y) * (1. - smoothstep(1.6, 4.9, vQ.y));
  float edge = smoothstep(.26, 0., abs(ax - 1.02 + .07 * vQ.y)) * smoothstep(.2, 1., vQ.y) * (1. - smoothstep(1.5, 4.4, vQ.y));
  float nearT = mix(.3, 1., smoothstep(3., 9., d));                 // under the lens the long tail would be a smear: the collar stays
  float a = clamp(bow * (.45 + .55 * n) + (tail * (.2 + .8 * smoothstep(.3, .75, n * .6 + n2 * .4)) + edge * .5 * (.4 + .6 * n)) * nearT, 0., 1.) * .85 * (1. - smoothstep(40., 90., d));
  if (a < .01) discard;
  gl_FragColor = vec4(hazed(uSunCol * sunW(vP) + uSkyCol + uShW, d) * a, a);
}`,t0=`
void rotX(inout vec3 q, float a){ float c = cos(a), s = sin(a); q.yz = vec2(q.y * c + q.z * s, -q.y * s + q.z * c); }
void rotZ(inout vec3 q, float a){ float c = cos(a), s = sin(a); q.xy = vec2(q.x * c - q.y * s, q.x * s + q.y * c); }
void rotY(inout vec3 q, float a){ float c = cos(a), s = sin(a); q.xz = vec2(q.x * c + q.z * s, -q.x * s + q.z * c); }`,a0=`vec3 traj(float q){ return iA.xyz; }
`;function o0(){const t=new gt.Geo,r=se,c=r("#3a2d22"),m=r("#ece6d6"),d=r("#5a2850"),R=r("#c98a3c"),T=r("#f07a18"),y=r("#1d4a3c"),l=r("#f3f0e6"),x=r("#d63a2a"),p=r("#28384f"),P=r("#2b241e");t.loft([{z:-.21,y:.02,rx:0,ry:0,top:P},{z:-.15,y:.015,rx:.042,ry:.034,top:P,belly:l},{z:-.05,y:0,rx:.076,ry:.06,top:c,belly:m},{z:.05,y:0,rx:.08,ry:.066,top:c,belly:R},{z:.12,y:.012,rx:.06,ry:.056,top:d,belly:d},{z:.17,y:.03,rx:0,ry:0,top:d}],{sides:8}),t.blob(0,.088,.165,.042,.046,.06,y,l,6,4),t.tube([[0,.078,.215],[0,.07,.255]],[.014,.007],4,x,x);for(const A of[-1,1])t.fan([[A*.034,.045,0],[A*.046,.168,-.09],[A*.034,.05,-.18]],T);t.fan([[0,.02,-.17],[-.055,.025,-.26],[0,.03,-.275],[.055,.025,-.26]],P);for(const A of[-1,1])t.tube([[A*.034,-.035,-.02],[A*.04,-.095,.035]],[.011,.009],4,x,x),t.fan([[A*.04,-.09,.02],[A*.085,-.1,.1],[A*.04,-.105,.115],[A*0,-.1,.1]],x);const H=t.strip([[.05,.04,.06],[.2,.045,.075],[.33,.04,.03],[.4,.035,-.04]],[[.05,.04,-.08],[.2,.04,-.1],[.31,.038,-.1],[.4,.035,-.06]],[p,p,p,p],[l,l,p,p]);return t.anim(H,A=>[ze((A-.05)/.35,0,1),1,1,0]),t.pivot(H,.05,.04,0),t.mirror(H),t.build()}const s0=`
void deform(inout vec3 p, inout vec3 n){
  float brk = clamp(iB.y - 1., 0., 1.), fly = min(iB.y, 1.), ph = h11(float(gl_InstanceID)) * 6.28; gYaw = iA.w;   // state 1..2: braking, wings held high and cupped
  if (aAnim.z > .5) {
    vec3 q = p - aPivot; float side = aAnim.y, a = fly * (sin(uTime * 50.3 + ph - aAnim.x * 1.2) * mix(.95, .42, brk) + .12 + .75 * brk);
    q.x *= mix(.16, 1., fly); q.z -= (1. - fly) * aAnim.x * .1; rotZ(q, a * side); p = aPivot + q; gThin = 1.;
  }
  p.y += (1. - fly) * .012 * sin(uTime * 2.3 + ph);
  rotX(p, iB.z); rotX(n, iB.z); rotZ(p, iB.w); rotZ(n, iB.w);
}`;function n0(){const t=new gt.Geo,r=se("#e2861a"),c=se("#fff0bd"),m=se("#5b3211"),d=se("#a6cdf0"),R=se("#f5ad30"),T=se("#17110c"),y=se("#3c2410"),l=se("#f0a030");t.loft([{z:-.34,y:0,rx:0,ry:0,top:m},{z:-.27,y:0,rx:.1,ry:.1,top:m,belly:l},{z:-.05,y:.01,rx:.125,ry:.12,top:m,belly:l},{z:.16,y:.02,rx:.135,ry:.125,top:m,belly:l},{z:.27,y:.035,rx:.1,ry:.095,top:r,belly:l},{z:.32,y:.045,rx:.05,ry:.05,top:r,belly:l},{z:.35,y:.05,rx:0,ry:0,top:r}],{sides:8});const x=[t.blob(0,.115,.44,.118,.12,.108,R,R,7,5),t.blob(0,.2,.42,.08,.045,.085,m,m,6,3),t.blob(0,.1,.525,.07,.078,.04,d,d,6,4)];for(const H of[-1,1])x.push(t.blob(H*.028,.122,.558,.014,.014,.012,T,T,4,3));x.push(t.blob(0,.072,.56,.022,.016,.014,c,c,4,3));for(const H of x)t.anim(H,()=>[0,0,4,0]),t.pivot(H,0,.05,.33);const p=(H,A,B,q,I)=>{const U=t.tube([[H,A,B],[H*1.25,A-q*.5,B+.03],[H*1.3,A-q*.9,B],[H*1.3,A-q*.94,B+.02]],[.07,.056,.046,.04],6,r,c),$=t.blob(H*1.3,A-q*.98,B+.04,.045,.05,.062,y,y,5,3);for(const E of[U,$])t.anim(E,(Q,_)=>[ze((A-_)/q,0,1),Math.sign(H),I,0]),t.pivot(E,H,A,B)};p(.1,0,.22,.46,1),p(-.1,0,.22,.46,1),p(.09,-.02,-.24,.5,2),p(-.09,-.02,-.24,.5,2);const P=t.tube([[0,.04,-.32],[0,.06,-.58],[0,.06,-.86],[0,.03,-1.16]],[.046,.04,.034,.02],6,r,c);return t.anim(P,(H,A,B)=>[ze((-.32-B)/.8,0,1),0,3,0]),t.pivot(P,0,.04,-.32),t.build()}const r0=`
void deform(inout vec3 p, inout vec3 n){
  float air = iB.y, sit = iB.w, ph = h11(float(gl_InstanceID)) * 6.28, part = aAnim.z, th = 0.; gYaw = iA.w;
  if (part > 3.5) th = (-1.45 + .14 * sin(uTime * .9 + ph)) * sit - .3 * air;
  else if (part > 2.5) th = mix(mix(.57, .42, sit), -.28, air) + aAnim.x * .3 * sin(uTime * 2.1 + ph)
    + aAnim.x * aAnim.x * (h11(float(gl_InstanceID) * 1.7 + 3.) * 2.1 - .75) * (1. - air);          // every tail hangs in its own curve: a hook, a crook, an S
  else if (part > 1.5) th = mix(mix(-.4, -.1, sit), -.8, air);
  else if (part > .5) th = mix(mix(.3, -.71, sit), 1.2, air) + .08 * sin(uTime * 1.3 + ph + aAnim.y) * (1. - sit);
  if (part > .5) { vec3 q = p - aPivot; if (part < 2.5) { rotZ(q, aAnim.y * .5 * air); rotZ(n, aAnim.y * .5 * air); } rotX(q, th); rotX(n, th); p = aPivot + q; if (part > 3.5) p += vec3(0., .09, .035) * sit; }
  vec3 hp = vec3(0., -.02, -.27); float sa = 1.15 * sit;
  p -= hp; rotX(p, sa); rotX(n, sa); p += hp;
  p.y -= air * .8 * p.z * p.z;
  rotX(p, iB.z); rotX(n, iB.z);
}`;function l0(t){const r=new gt.Geo,c=se,m=c(t?"#55709a":"#c8421a"),d=c(t?"#3a4f73":"#8f2610"),R=c(t?"#3f5273":"#f2bb2a"),T=c(t?"#2b3a55":"#c58a1c"),y=c(t?"#2c3b57":"#1f6b3c"),l=c(t?"#1a2538":"#0f3a22"),x=c(t?"#1d2740":"#27407a"),p=c(t?"#ecebe4":"#f08a1c"),P=c(t?"#b9bcc0":"#16130f"),H=c(t?"#3a4763":"#c9a468"),A=c(t?"#1c2233":"#6b4424"),B=c(t?"#b5483a":"#c9a23a"),q=c(t?"#c8372c":"#e9c873"),I=c("#e6d9a8"),U=c("#14100c"),$=t?c("#15161c"):R,E=(v,w,k,L,j)=>r.anim(v,(J,ie,ue)=>[L?L(J,ie,ue):0,j?j(J,ie,ue):0,w,k]),Q=[[-.215,.03,0,0],[-.17,.028,.036,.036],[-.1,.018,.064,.064],[-.02,.004,.08,.083],[.06,.008,.082,.088],[.13,.028,.068,.078],[.185,.058,.046,.056],[.225,.085,0,0]];E(r.loft(Q.map(([v,w,k,L])=>({z:v,y:w,rx:k,ry:L,top:v>.02?y:R,belly:m})),{sides:10,shade:[.3,.8]}),0,0);const _=(v,w)=>{let k=0;for(;k<Q.length-2&&v>Q[k+1][0];)k++;const L=Q[k],j=Q[k+1],J=ze((v-L[0])/(j[0]-L[0]),0,1),ie=N(L[2],j[2],J)+1e-4,ue=N(L[3],j[3],J),ce=ze(w/ie,-.95,.95);return N(L[1],j[1],J)+ue*Math.sqrt(1-ce*ce)},le=[r.tube([[0,.065,.175],[0,.15,.212],[0,.215,.228]],[.042,.031,.028],7,m,t?$:c("#c8742a")),r.blob(0,.245,.245,.032,.035,.047,$,q,7,5),r.tube([[0,.243,.286],[0,.239,.31],[0,.231,.325]],[.011,.007,.0015],5,I,I),r.tube([[0,.266,.287],[0,.291,.245],[0,.297,.195],[0,.286,.145],[0,.268,.108]],[.01,.027,.029,.021,.003],6,$,t?$:T,{flatten:.5})];for(const v of[-1,1])le.push(r.blob(v*.0285,.252,.262,.0075,.0075,.006,U,U,4,3)),le.push(r.fan([[v*.012,.29,.2],[v*.03,.283,.13],[v*.024,.262,.088],[v*.008,.276,.14]],$,t?$:T));for(const v of le)E(v,3,4);{const v=[0,.236,.205],w=[0,-.957,-.29],k=[0,.29,-.957],L=p.clone().multiplyScalar(.72),j=t?0:1,J=[.905,.05,.42],ie=[-9e-4,-.9695,-.245],ue=[.4246,.2113,-.8803],ce=[.02,.228,.2],we=(oe,xe,Pe,de,ge)=>{const Ae=Math.cos(xe),Se=Math.sin(xe),Me=[Se,k[1]*Ae,k[2]*Ae],ne=[Ae,-k[1]*Se,-k[2]*Se],Le=.012+.03*oe,qe=.042+.002*oe,D=Math.cos(Pe),Ke=Math.sin(Pe);return[v[0]+w[0]*Le+Me[0]*qe+(w[0]*D+Me[0]*Ke)*de+ne[0]*ge,v[1]+w[1]*Le+Me[1]*qe+(w[1]*D+Me[1]*Ke)*de+ne[1]*ge,v[2]+w[2]*Le+Me[2]*qe+(w[2]*D+Me[2]*Ke)*de+ne[2]*ge]},ye=(oe,xe,Pe)=>{const de=.02+(oe+1.2*Pe-.2)*.0245,ge=.006+.004*(3-oe)+.12*de,Ae=Math.cos(xe)*de,Se=Math.sin(xe)*de;return[ce[0]+J[0]*ge+ie[0]*Ae+ue[0]*Se,ce[1]+J[1]*ge+ie[1]*Ae+ue[1]*Se,ce[2]+J[2]*ge+ie[2]*Ae+ue[2]*Se]};for(let oe=0;oe<4;oe++){const xe=6+oe,Pe=3.5/xe,de=.05+.007*oe,ge=.35+.05*oe,Ae=2*(.042+.002*oe+Math.sin(ge)*de*.5)*Math.sin(Pe/2)*1.3;for(let Se=0;Se<xe;Se++){const Me=-1.75+(Se+.5)*Pe,ne=[],Le=.86+.28*((Se*5+oe*3)%4/3),qe=p.clone().multiplyScalar(Le),D=L.clone().multiplyScalar(Le);for(const[Ke,wa,Ia]of[[0,-.42,D],[0,.42,D],[.48,-.6,qe],[.48,.6,qe],[.7,-.55,qe],[.7,.55,qe],[.93,-.27,P],[1,0,P],[.93,.27,P],[.79,-.5,P],[.79,.5,P]]){const vt=we(oe,Me,ge,Ke*de,wa*Ae),Nt=ye(oe,.654+(Me+wa*Pe*1.04)*1.125,Ke),rt=r.v(vt[0],vt[1],vt[2],Ia);ne.push(rt),r.a[rt*4]=Ke,r.a[rt*4+2]=1,r.a[rt*4+3]=4,r.pv[rt*3]=(Nt[0]-vt[0])*j,r.pv[rt*3+1]=(Nt[1]-vt[1])*j,r.pv[rt*3+2]=(Nt[2]-vt[2])*j}r.quad(ne[0],ne[1],ne[3],ne[2]),r.quad(ne[2],ne[3],ne[5],ne[4]),r.quad(ne[4],ne[5],ne[10],ne[9]),r.tri(ne[9],ne[10],ne[7]),r.tri(ne[9],ne[7],ne[6]),r.tri(ne[10],ne[8],ne[7])}}}for(let v=0;v<2;v++)for(let w=0;w<4-v;w++){const k=(w-(3-v)/2)*.034,L=.135-v*.05,j=(J,ie)=>_(L+ie,k+J)+.006;E(r.fan([[k,j(0,0),L],[k-.024,j(-.024,-.03),L-.03],[k-.016,j(-.016,-.058),L-.058],[k,j(0,-.068),L-.068],[k+.016,j(.016,-.058),L-.058],[k+.024,j(.024,-.03),L-.03]],y,l),0,4)}for(const v of[-1,1])for(let w=0;w<5;w++){const k=.02-w*.035,L=v*(.022+.004*w),j=_(k,L)+.005,J=.085+.012*w,ie=v*(.062+.006*w),ue=k-J,ce=Math.min(j-.012,_(ue,ie*.8)-.004-.008*w);E(r.fan([[ie,ce,ue],[L-v*.012,j,k],[L,j+.002,k+.012],[L+v*.016,j-.006,k-.004]],T,R),0,4)}{const v=[.11,.06,0,-.06,-.12,-.185],w=[.058,.07,.068,.058,.04,.014],k=[.004,-.034,-.046,-.04,-.026,0],L=[.064,.086,.09,.082,.064,.04],j=[[d,d,d,d,A,A],[x,x,d,A,A,A],[A,A,H,H,A,P]],J=[0,1,2].map(ce=>v.map((we,ye)=>[L[ye]+(ce===1?.012:ce===2?.004:-.004),N(w[ye],k[ye],ce/2),we])),ie=r.strip(J[0],J[1],j[0],j[1]),ue=r.strip(J[1],J[2],j[1],j[2]);for(const ce of[ie,ue])E(ce,6,3,(we,ye,oe)=>ze((.11-oe)/.295,0,1),()=>1),r.pivot(ce,.06,.05,.1),r.mirror(ce)}const he=[0,.03,-.17],O=(v,w,k,L,j,J,ie,ue,ce,we,ye)=>{const oe=-Math.cos(k),xe=Math.sin(k),Pe=[],de=[],ge=[],Ae=[],Se=[];for(let Me=0;Me<=ie;Me++){const ne=Me/ie,Le=j*(1-.84*ne)*Math.min(1,ne*7+.25)+.0025,qe=v+xe*L*ne,D=w+L*(.06*ne-.22*ne*ne),Ke=he[2]+oe*L*ne;Pe.push([qe,D,Ke]),de.push([qe-oe*Le,D-J*Le,Ke+xe*Le]),ge.push([qe+oe*Le,D-J*Le,Ke-xe*Le]),Ae.push(ye),Se.push(we)}for(const Me of[r.strip(de,Pe,Se,Ae),r.strip(Pe,ge,Ae,Se)])E(Me,2,ce,(ne,Le,qe)=>ze(Math.hypot(ne-v,qe-he[2])/.7,0,1),()=>ue),r.pivot(Me,he[0],he[1],he[2])},K=H.clone().multiplyScalar(.7);for(const v of[-1,1]){O(v*.009,.036,v*.02,.7,.034,1.25,10,v*.15,2,H,K);for(let w=1;w<=3;w++)O(v*(.014+.008*w),.03-.011*w,v*(.03+.09*w),[.52,.38,.26][w-1],.028,.75,6,v*(.3+.23*w),2,H,K);for(let w=0;w<3;w++)O(v*(.03+.007*w),.036-.008*w,v*(.07+.05*w),.27-.045*w,.011,.2,3,v*.4,4,m,d)}for(const v of[-1,1]){const w=v*.037,k=[r.blob(v*.036,-.036,-.005,.027,.046,.036,m,d,6,4),r.tube([[w,-.055,-.01],[w,-.098,-.03],[w,-.135,-.012],[w,-.166,.004]],[.015,.0095,.0085,.0085],5,d,B)];for(const L of[-.024,0,.024])k.push(r.tube([[w,-.166,.004],[w+L*.6,-.169,.03],[w+L,-.173,.056]],[.0065,.005,.002],4,B,B));k.push(r.tube([[w,-.166,.004],[w,-.172,-.022]],[.006,.002],4,B,B));for(const L of k)E(L,5,4,(j,J)=>ze((-.03-J)/.14,0,1),()=>v),r.pivot(L,v*.036,-.03,-.005)}return r.build()}const i0=`
uniform vec4 uPz;
void deform(inout vec3 p, inout vec3 n){
  float part = aAnim.z, t = uTime, hop = uPz.y, cr = uPz.z; gYaw = iA.w; gThin = aAnim.w;
  float sac = floor(t * 1.4), hy = uPz.x + .2 * (mix(h11(sac), h11(sac + 1.), smoothstep(0., .18, fract(t * 1.4))) - .5);
  vec3 nk = vec3(0., .07, .19);
  if (part > 5.5) { vec3 q = p - aPivot; q.x *= 1. + 1.3 * hop * aAnim.x; q.y += (.035 * hop + .002 * sin(t * 2.1)) * aAnim.x; p = aPivot + q; }
  else if (part > 4.5) { vec3 q = p - aPivot; q.y *= 1. - .3 * cr - .25 * hop; rotX(q, -.8 * hop * aAnim.x); p = aPivot + q; }
  else if (part > 2.5) { vec3 q = p - nk; rotY(q, hy); p = nk + q; rotY(n, hy); p.y += .004 * sin(t * 1.7 + 1.); }
  else if (part > 1.5) {
    vec3 q = p - aPivot; float a = aAnim.x;
    rotY(q, (.11 * sin(t * .8) + .05 * sin(t * 1.9 + 2.) * a + uPz.w) * a + aAnim.y * .12 * iB.y * a);
    rotX(q, (.05 * sin(t * 1.15 + 1.) - .3 * hop) * a * (.4 + .6 * a)); p = aPivot + q;
  }
  else if (part > .5) { p += aPivot * iB.y * (.93 + .07 * sin(t * 2.6)); vec3 q = p - nk; rotY(q, hy * .65); p = nk + q; rotY(n, hy * .65); }
  if (part < 4.5 || part > 5.5) {
    vec3 hp = vec3(0., -.03, -.01), q = p - hp; rotX(q, iB.w); p = hp + q; rotX(n, iB.w);
    p.y += .003 * sin(t * 2.) - .03 * cr;
  }
}`,h0=`
vec3 pattern(vec3 alb, vec3 l, float id){
  if (id > 1.5 && id < 2.5) {
    float q = -l.z * 19. + abs(l.x) * 24., w = fwidth(q) * 1.2, f = abs(fract(q) - .5) * 2.;
    alb *= mix(.82, mix(1.08, .3, 1. - smoothstep(.34 - w, .34 + w, f)), 1. - smoothstep(.35, 1.1, w));
  } else if (id > 2.5 && id < 3.5) {
    float q = l.y * 58. - l.z * 10., w = fwidth(q) * 1.2, f = abs(fract(q) - .5) * 2.;
    alb *= mix(.88, 1.05 - .5 * (1. - smoothstep(.08, .22 + w, f)), 1. - smoothstep(.35, 1.1, w));
  } else if (id < .5) {
    float w = fwidth(l.z * 24.) * 1.2, row = floor(l.z * 24.);
    vec2 sc = vec2(atan(l.x, l.y - .02 + 1e-5) * 4.5 + .5 * mod(row, 2.), l.z * 24.), cf = vec2(fract(sc.x) - .5, fract(sc.y));
    float e = smoothstep(.62, .92, length(vec2(cf.x * 1.5, 1. - cf.y)));
    alb *= mix(.9, 1.06 - .42 * e, 1. - smoothstep(.35, 1.1, w));
  }
  return alb;
}`;var u0={id:"drowned-forest-lakes",name:"The Peacock Lakes",category:"wilderness",weirdness:.1,media:["air"],async build(t){const{rng:r,noise:c}=t,m=t.quality?.detail??1,d=t.vary||{hour:"any",rare:!1,density:1},R=Ve(Ge("lakes-look:"+t.seed)),T=R();let y=T<.42?"morning":T<.52?"dawn":T<.62?"night":T<.81?"amber":"snow";d.hour==="night"?y="night":d.hour==="dawn"?y="dawn":d.hour==="golden"?y=y==="dawn"?"dawn":"amber":d.hour==="day"&&y!=="morning"&&y!=="snow"&&(y=R()<.7?"morning":"snow");const l=Pn[y],x=ze(((d.density??1)-.7)/.6,0,1),p=l.season==="late",P=50,[H,A,B,q,I,U,$]=Ms.map(se),E=new h.Scene,Q=Sn({rng:r,...l.sky});E.add(Q.object),await t.yield();const _=(l.moon?Q.lightDirection:Q.sunDirection).clone().normalize(),le=se(l.sun),he=se(l.amb),O=se(l.gnd),K=Q.zenithColor.clone(),v=Q.horizonColor.clone(),w=v.clone().lerp(K,l.low<1?.5:l.snow?.42:.22),k=new h.DirectionalLight(le,l.sunI*(l.low<1?.4:1));k.position.copy(_).multiplyScalar(600),E.add(k),E.add(new h.HemisphereLight(he,O,l.ambI)),E.fog=new h.FogExp2(w,l.fog);const L=he.clone().multiplyScalar(l.ambI/Math.PI),j=.2126*L.r+.7152*L.g+.0722*L.b,J=l.shW?new h.Color(...l.shW):l.low<1?L.clone().lerp(new h.Color(j,j,j).multiplyScalar(1.15),.5).multiplyScalar(1.5):new h.Color(0,0,0),ie=U.clone().lerp(se("#8FA32B"),.6),ue=U.clone().lerp(I,.28).multiplyScalar(.62),ce=Math.hypot(_.x,_.z)||1,we=[15,-12],ye={uTime:{value:0},uU:{value:0},uSnow:{value:l.snow},uHazeK:{value:l.hazeK},uLow:{value:l.low},uWSun:{value:l.low<1?0:1},uShW:{value:J},uSun:{value:_},uSunCol:{value:le.clone().multiplyScalar(l.sunI/Math.PI)},uSkyCol:{value:he.clone().multiplyScalar(l.ambI/Math.PI)},uGndCol:{value:O.clone().multiplyScalar(l.ambI/Math.PI)},uHaze:{value:w},uZen:{value:K},uHor:{value:v},uShadow:{value:new h.Vector4(...l.shadow)},uBone:{value:q},uGold:{value:I},uScar:{value:$},uSpruce:{value:U},uMoss:{value:ie},uSoil:{value:ue},uTurq:{value:B},uFallZ:{value:va+5},uLate:{value:p?1:0},uFar:{value:1},uRibK:{value:1},uFallS:{value:-540},uWallHz:{value:l.wallHz??0},uMoon:{value:l.moon?1:0},uDur:{value:P},uResY:{value:450},uFill:{value:new h.Color(...l.fill||[0,0,0])},uShaft:{value:new h.Vector4(-_.z/ce,_.x/ce,(-_.z*we[0]+_.x*we[1])/ce,l.shaft||0)}},oe=(e,a,o={},s=null)=>new h.ShaderMaterial({uniforms:s?{...ye,...s}:ye,vertexShader:e,fragmentShader:a,...o});await t.yield();const xe=e=>-6*ze((e-Qt)/(va-Qt),0,1.25),Pe=[[F,Fe+5.6,482],[F,Fe+4.3,462],[F,Fe+2.7,440],[F,Fe+1.7,418],[F,Fe+1.55,398],[F,-28.1,380],[F,-19.4,368],[F,-10.4,356],[F,-4,344],[F,-2.2,332],[F,-1.75,320],[F,-1.7,308],[F,xe(296)+1.2,296],[F,xe(282)+1.2,282],[F,xe(268)+1.2,268],[F,1.25,254],[F,1.3,240]],de=await Mn(t,{palette:Ms,hour:l.hour,season:l.season,density:x,backdrop:!1,zMax:242,surfZ:256.6,approach:Pe,snow:l.snow,sunDir:[_.x,_.y,_.z],sunColor:l.sun,ambientSky:l.moon?"#1e3f86":void 0,ambientHorizon:l.moon?"#2c4c88":void 0,sunIntensity:l.sunI*l.lake,ambient:l.heroAmb??(l.low<1?1.25:.62),scatter:l.scat,skyColor:K,horizonColor:v,skyline:{treeHeight:19,slopeTan:.5,axisTan:.12,peakTan:.42,peakWidth:.2},gustU:pa,healU:.74,progress:0,portalRadius:xo,slopeFill:l.fill,outletFill:[J.r*1.6+(l.fill?l.fill[0]*.6:0),J.g*1.6+(l.fill?l.fill[1]*.6:0),J.b*1.6+(l.fill?l.fill[2]*.6:0)],lowSun:l.low,paleK:y==="dawn"?1:.8,isleRock:l.isleRock,shaft:l.shaft?{perp:[-_.z/ce,_.x/ce],offset:(-_.z*we[0]+_.x*we[1])/ce,half:l.shaft,out:.8,in:1.75}:null});E.add(de.object);const ge=de.lake;await t.yield();const Ae=(e,a,o,s,n,i,u)=>{const f=Math.abs(e-o)-n+u,b=Math.abs(a-s)-i+u;return Math.min(Math.max(f,b),0)+Math.hypot(Math.max(f,0),Math.max(b,0))-u},Se=e=>4.6*(1+Math.cos((e-F)*.0805))+1.4*(1+Math.sin((e-F)*.19+.8)),Me=(e,a)=>{const o=a-Se(e)*(1-te(350,384,a));return Math.min(Ae(e,o,-62,500,78,156,55),Ae(e,o,F,364,104,20,16))+5*c.n2(e*.012+9.1,a*.012)+1.5*c.n2(e*.05,a*.05+3.3)},ne=e=>va+Se(e)+4.5*c.n2(e*.021,7.7)+1.5*c.n2(e*.09,3.1),Le=e=>N(45,F,te(180,330,e))+(e>250?560:380)*Math.sin((e-250)/520)*te(450,1250,Math.abs(e-250)),qe=e=>N(340,215,te(180,330,e)),D={trav:0,film:0,alt:0,hum:0,t:0,rise:0,sh:0,s:0,sk:0,rk:1},Ke=[[-17,.42,2.6,1.7],[16,.36,2.5,1.6],[-27,.56,3.1,1.8],[25.5,.5,3.1,1.7],[36,.3,3,1.5],[-39,.38,3,1.6],[-56,.47,3.1,1.7],[58,.42,3,1.6],[-76,.5,3,1.6],[79,.36,3,1.5]].map(e=>[F+e[0],e[1],e[2],e[3]]),wa=-3.92,Ia=Fe-.7,vt=e=>-.3*Math.cos((e-F)*.33)+.09*Math.sin((e-F)*1.1+1.7),Nt=(e,a)=>(a-Jt)/(bo-Jt)*at+vt(e),rt=e=>{const a=ze(e/at,0,1);return N(wa,Ia,.5*a+.5*a*a*(3-2*a))},So=(e,a)=>{const o=Nt(e,a),s=Math.floor(o),n=o-s,i=n-.66;return N(rt(s),rt(s+1),te(.7,.98,n))+(s>=0&&s<at?.1*Math.exp(-i*i/.0018):0)},ve=(e,a)=>{const o=Math.abs(e-F),s=Math.abs(e-Le(a))-qe(a);let n=0,i;if(D.s=a,D.sk=0,D.rk=1,s>0&&(n=(950*(1-Math.exp(-s/800))*(1+.22*c.fbm2(e/700,a/700,3))+85*(c.ridged2(e/420+3,a/420,4)-.35)*te(60,500,s))*te(-40,240,s)),s>0&&e>Le(a)){const u=Math.abs(a-(-25+.174*(e-385)))-(120+.05*s);if(u<2600){const f=.115*s*(1+.25*c.n2(e/300,5.5))+(u>0?880*(1-Math.exp(-u/700))*(1+.2*c.fbm2(e/500+9,a/500,3)):0)+20*c.n2(e/110,a/110)*te(0,300,s),b=n-f,M=N(60,220,te(60,320,Math.min(n,f))),re=ze(.5+.5*b/M,0,1);n=N(n,f,re)-M*re*(1-re)*.5;const g=-25+.174*(e-385),z=a<g?-1:1,C=ze(.5+.5*b/(1.6*M),0,1);D.s=N(a,g+z*(120+.85*s),C),D.sk=C*z,D.rk=(1-C*(1-te(40,220,u)))*(1-.4*4*C*(1-C)),n=Math.max(n,0)}}if(D.alt=n,D.rise=n,D.trav=0,D.film=0,D.hum=0,D.t=0,a<242)i=ge.bedAt(e,a)+Math.max(0,-a-300)*.02,D.sh=ge.sdf(e,a);else{const u=7.2+1.3*c.n2(a*.05,4.4),f=Math.max(0,c.n2(e*.07,a*.07+20)*.9-.12)*te(u,u+5,o)+.045*c.n2(e*.9,a*.9);let b=xe(a)-.1+f+.075*Math.exp(-((a-256.5)*(a-256.5))/6)+.09*Math.max(0,o-55)+2.2*te(55,90,o);a<Qt&&(b=N(ge.bedAt(e,a),b,te(242,255,a))+.05*Math.exp(-((a-246)*(a-246))/1.6)*(1-te(12,20,o)));const M=Me(e,a),re=Math.max(M,0),g=Math.max(-M,0),z=M>0?Fe+.06+.5*te(0,4,re)+.06*Math.min(re,60)+.7*(.5+.5*c.n2(e*.06,a*.06))*te(1,12,re)-Math.max(0,a-700)*.02:Fe-.35-4.6*te(0,38,g)+.3*c.n2(e*.08,a*.08),C=1-te(6.5,13,o),G=te(96,126,o),V=Math.max(C,G),ee=N(9,60,V),ae=N(ne(e),C>=G?306:va-22,V),W=ze((a-ae)/ee,0,1),S=W-.05*Math.sin(W*18.85)*(1-V),Z=S*S*(3-2*S);if(i=N(b,z,Z),W>0&&W<1&&(i+=.7*c.n2(e*.16,a*.3)*Math.sin(W*Math.PI)*(1-G),V<.5))for(let X=0;X<Ke.length;X++){const Y=Ke[X],fe=(e-Y[0])/Y[2],pe=(W-Y[1])/.1,me=fe*fe+pe*pe;me<6&&(i+=Y[3]*Math.exp(-me))}o<9.2&&a>302.5&&a<371&&(i=N(i,So(e,a),(1-te(5.2,9.2,o))*te(302.5,306.5,a)*(1-te(366.5,371,a)))),D.hum=f,D.t=W,D.sh=a<va?o-62:M,D.trav=Math.max((1-te(56,76,o))*Math.max(te(242,246,a),1-te(22,34,o)),(1-te(100,118,o))*te(ae-10,ae-2,a))*(1-te(374,394,a)),D.film=(1-te(.04,.2,f))*(1-te(52,58,o))*te(Qt-1,Qt+1,a)*(1-te(.02,.2,W)),a<Qt+1&&(D.film=Math.max(D.film,(1-te(13,19,o))*te(243.5,244.5,a)*(1-te(-.03,.1,b))))}return n<56&&(D.alt=Math.max(n,56*te(24,64,D.sh))),a>=242&&D.t>.03&&D.t<.995&&D.trav>.3&&(D.alt=-9*Math.min(1,4*Math.sin(D.t*Math.PI))*D.trav),i+n},Mo=Pe.map(e=>[e[0],e[1],e[2]]);for(const e of de.anchors.flyThrough)Mo.push([e.x,e.y,e.z]);const Be=kn(Mo),Ze=Be.length;await t.yield();const yt=[],lt=[],ga=[],Bs=oe(Ps,As),ya=async(e,a,o={})=>{const s=e.length,n=a.length,i=new Float32Array(s*n*3),u=new Float32Array(s*n*3),f=new Float32Array(s*n*3),b=new Uint8Array(s*n),M=[];for(let z=0;z<n;z++){for(let C=0;C<s;C++){const G=z*s+C,V=e[C],ee=a[z];let ae=o.height?o.height(V,ee):ve(V,ee);if(o.sink){const W=o.sink(V,ee,C,z);W&&(ae-=W,b[G]=1)}i[G*3]=V,i[G*3+1]=ae,i[G*3+2]=ee,u[G*3]=D.trav,u[G*3+1]=D.film,u[G*3+2]=D.alt/1e3,o.height||(f[G*3]=D.s/1e3,f[G*3+1]=D.sk,f[G*3+2]=D.rk),(C&31)===31&&await t.yield()}await t.yield()}for(let z=0;z<n-1;z++)for(let C=0;C<s-1;C++){const G=z*s+C,V=G+1,ee=G+s,ae=ee+1;o.hole&&b[G]&&b[V]&&b[ee]&&b[ae]||M.push(G,ee,V,V,ee,ae)}await t.yield();const re=new h.BufferGeometry;re.setAttribute("position",new h.BufferAttribute(i,3)),re.setAttribute("aMat",new h.BufferAttribute(u,3)),re.setAttribute("aRib",new h.BufferAttribute(f,3)),re.setIndex(M),await t.yield(),await zn(re,t.yield),await t.yield();const g=new h.Mesh(re,o.material||Bs);return g.frustumCulled=!1,E.add(g),g},He=(e,a,o,s)=>{const n=Math.max(1,Math.round((o-a)/s));for(let i=0;i<n;i++)e.push(a+(o-a)*i/n)},bt=[],xt=[];He(bt,-262,-214,4.8),He(bt,-214,-122,2.4),He(bt,-122,-78,1.1),He(bt,-78,14,2.4),He(bt,14,62,4.8),bt.push(62),He(xt,242,262,1),He(xt,262,296,2),He(xt,296,372,1),He(xt,372,404,2),He(xt,404,564,8),xt.push(564),await ya(bt,xt,{sink:(e,a,o,s)=>{if(o===0||o===bt.length-1||s===xt.length-1||s===0&&e<-205)return 3;const n=Nt(e,a);return Math.abs(e-F)<8.8&&n>.45&&n<at+.5?.9:0}});{const a=[0,.33,.6,.66,.71,.79,.88,.97],o=[];for(let b=0;b<at;b++)for(const M of a)o.push(b+M);o.push(at,at+.45,at+.9);const s=o.length,n=new Float32Array(s*27*3),i=[];for(let b=0;b<s;b++){for(let M=0;M<=26;M++){const re=F-11+22*M/26,g=Jt+(o[b]-vt(re))*(bo-Jt)/at,z=(b*27+M)*3;n[z]=re,n[z+1]=ve(re,g),n[z+2]=g}(b&7)===7&&await t.yield()}for(let b=0;b<s-1;b++)for(let M=0;M<26;M++){const re=b*27+M,g=re+1,z=re+26+1,C=z+1;i.push(re,z,g,g,z,C)}const u=new h.BufferGeometry;u.setAttribute("position",new h.BufferAttribute(n,3)),u.setIndex(i),u.computeVertexNormals();const f=new h.Mesh(u,oe(En,Kn,{transparent:!0,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-2}));f.renderOrder=.5,f.frustumCulled=!1,E.add(f),lt.push(f),await t.yield()}const zo=(e,a,o,s,n=0,i=0)=>{const u=[];for(let M=o;M<=s+1e-6;M+=12)u.push(M);let f=12,b=s;for(;b<a;)f=Math.min(f*1.2,b<s+n?58:115),b+=f,u.push(b);for(f=12,b=o;b>e;)f=Math.min(f*1.2,b>o-i?58:115),b-=f,u.unshift(b);return u},Ns=(e,a)=>e>-204&&e<294&&a>-229&&a<242.5||e>-261&&e<61&&a>=242&&a<563;await ya(zo(-2300,2300,-276,312,1150,0),zo(-2750,2500,-246,582,0,1150),{hole:!0,sink:(e,a)=>Ns(e,a)?2.5:0});const ta=-30,aa=-3500,Po=.42*3500,Da=[],Wa=[];He(Da,ta-1300,ta+1300,58),Da.push(ta+1300),He(Wa,aa-1100,aa+1100,58),Wa.push(aa+1100);const Ao=oe(Ps,As,{},{uFar:{value:.5},uRibK:{value:0}});{const s=[],n=[];He(s,2200,4500,66),s.push(4500),He(n,-550,1550,66),n.push(1550),await ya(s,n,{material:Ao,height:(i,u)=>{const f=Math.hypot(i-3350,u-500)/640,b=Math.hypot(i-3350-60,u-500+470)/520,re=Math.max(1180*Math.max(0,1-Math.pow(f,.8)),1180*.66*Math.max(0,1-Math.pow(b,.9)))*(.86+.2*c.ridged2(i/480+3,u/480,4))+50*c.fbm2(i/300,u/300,3)+120;return D.trav=0,D.film=0,D.alt=re+350,re}})}await ya(Da,Wa,{material:Ao,height:(e,a)=>{const o=Math.hypot(e-ta,a-aa)/700,s=Math.hypot(e-ta+490,a-aa-60)/630,i=Math.max(Po*Math.max(0,1-Math.pow(o,.85)),Po*.62*Math.max(0,1-Math.pow(s,.9)))*(.86+.2*c.ridged2(e/520+7,a/520,4))+50*c.fbm2(e/300,a/300,3)+30;return D.trav=0,D.film=0,D.alt=i+350,i}}),await t.yield();const It=new h.PlaneGeometry(250,336,40,54);It.rotateX(-Math.PI/2),It.translate(-92,Fe,504);const kt=It.attributes.position,Fo=new Float32Array(kt.count);for(let e=0;e<kt.count;e++)Fo[e]=Fe-ve(kt.getX(e),kt.getZ(e)),(e&255)===255&&await t.yield();It.setAttribute("aDepth",new h.BufferAttribute(Fo,1));const To=new Float32Array(kt.count);for(let e=0;e<kt.count;e++){const a=kt.getX(e);To[e]=kt.getZ(e)-N(ne(a)+10.5,369.5,1-te(6.5,13,Math.abs(a-F)))}It.setAttribute("aFoot",new h.BufferAttribute(To,1));const ba=[],xa=[],Oa=[];for(let e=0;e<24;e++)ba.push(new h.Vector4(0,0,1,1)),xa.push(new h.Vector4(0,1,0,0));for(let e=0;e<9;e++)Oa.push(new h.Vector3(0,0,0));const ka=new h.Mesh(It,oe(An,Fn,{transparent:!0,depthWrite:!1},{uRaft:{value:ba},uRaftB:{value:xa},uDuck:{value:Oa}}));ka.renderOrder=2,ka.frustumCulled=!1,E.add(ka),lt.push(ka),await t.yield();const Dt=[],Lo=Math.round(850*m*Math.min(l.leaves,1.6));{const e=Ve(Ge("lakes-strays:"+t.seed));for(let a=0,o=Math.floor(Lo/4);a<o;a++){const s=F+e.range(-60,60),n=e.range(360,540);Me(s,n)<-1.5&&n>366&&Dt.push([s,n,e()*6.283,e.range(.17,.32),e(),e()])}}await t.yield();const Va=[],qo=[],Co=[],Eo=[],Ko=[],Ro=[],Bo=[],St=[0,0],No=(e,a)=>{let o=1;for(let s=0;s<Ke.length;s++){const n=Ke[s],i=(e-n[0])/n[2],u=(a-n[1]+.02)/.13;o=Math.min(o,te(.45,1.5,i*i+u*u))}return o},Ye=Ve(Ge("lakes-veils:"+t.seed)),Io=(e,a,o,s,n=0)=>{let i=e,u=a,f=0;const b=Ye(),M=[],re=.55;for(let G=0;G<42;G++){const V=ve(i,u),ee=D.t,ae=.6;if(V<Fe-.15||n&&Math.abs(i-F)<n)break;St[0]=(ve(i+ae,u)-ve(i-ae,u))/(2*ae),St[1]=(ve(i,u+ae)-ve(i,u-ae))/(2*ae);const W=Math.hypot(St[0],St[1]),S=te(.1,.6,W),Z=1/Math.max(W,.001);let X=-St[0]*Z*S,Y=-St[1]*Z*S+(1-S);const fe=Math.hypot(X,Y)||1;X/=fe,Y/=fe;const pe=1/Math.sqrt(1+W*W),me=-St[0]*pe*re,Te=pe*re,Ie=-St[1]*pe*re,We=te(.3,1.2,W),wt=o*(1+.5*(1-We)),ua=i+Y*wt,Ea=u-X*wt,yo=i-Y*wt,ks=u+X*wt,gn=Math.max(ve(ua,Ea),V-1),yn=No(ua,D.t),bn=Math.max(ve(yo,ks),V-1),xn=No(yo,D.t);M.push([ua+me,gn+Te,Ea+Ie,yo+me,bn+Te,ks+Ie,f,yn,xn,We,ee]);const Ss=1.4*pe;i+=X*Ss,u+=Y*Ss,f+=1.4}let g=M.length;if(g<2)return;for(let G=1;G<g-1;G++)for(const V of[1,4])M[G][V]=Math.max(M[G][V],(M[G-1][V]+M[G+1][V])/2-.1);if(n){for(let V=0;V<3;V++){const ee=M.map(ae=>ae.slice());for(let ae=1;ae<g-1;ae++)for(let W=0;W<6;W++){const S=.25*ee[ae-1][W]+.5*ee[ae][W]+.25*ee[ae+1][W];M[ae][W]=W===1||W===4?Math.max(S,ee[ae][W]-.12):S}}const G=[];for(let V=0;V<g&&(G.push(M[V]),V!==g-1);V++){const ee=M[Math.max(0,V-1)],ae=M[V],W=M[V+1],S=M[Math.min(g-1,V+2)],Z=[];for(let X=0;X<11;X++)Z.push(X<6?(-ee[X]+9*ae[X]+9*W[X]-S[X])/16:(ae[X]+W[X])/2);G.push(Z)}M.length=0;for(const V of G)M.push(V);g=M.length}const z=Va.length/3,C=M[g-1][6];for(let G=0;G<g;G++){const V=M[G];if(Va.push(V[0],V[1],V[2],V[3],V[4],V[5]),qo.push(-1,V[6],1,V[6]),Co.push(s,b,o,C,s,b,o,C),Eo.push(V[7],V[8]),Ko.push(V[9],V[9]),Ro.push(V[10],V[10]),G){const ee=z+G*2;Bo.push(ee-2,ee,ee-1,ee-1,ee,ee+1)}}};for(let e=0;e<92;e++){const a=F-104+208*(e+r())/92;Math.abs(a-F)>14&&(r(),r(),r())}for(let e=0;e<23;e++)r(),r(),r(),r();for(let e=0;e<5;e++)r();const Do=74;for(let e=0;e<Do;e++){const a=F-104+208*(e+Ye())/Do,o=Ye(),s=(o<.14?Ye.range(.28,.45):o<.66?Ye.range(.6,1.15):Ye.range(1.3,2.3))*(p?.88:1),n=Ye.range(1.6,3.2);Math.abs(a-F)>14&&Io(a,ne(a)-1.6,Math.max(.26,s*N(1.4,.75,te(2.5,9.5,Se(a)))),n),await t.yield()}for(let e=0;e<30;e++)Io(F+(e%2?1:-1)*Ye.range(12.2,13.4),312+Math.floor(e/2)*2.3+Ye.range(-.6,.6),Ye.range(.3,.62),Ye.range(1.8,3.2),8.7),await t.yield();const Mt=new h.BufferGeometry;Mt.setAttribute("position",new h.Float32BufferAttribute(Va,3)),Mt.setAttribute("uv",new h.Float32BufferAttribute(qo,2)),Mt.setAttribute("aT",new h.Float32BufferAttribute(Co,4)),Mt.setAttribute("aF",new h.Float32BufferAttribute(Eo,1)),Mt.setAttribute("aSt",new h.Float32BufferAttribute(Ko,1)),Mt.setAttribute("aLg",new h.Float32BufferAttribute(Ro,1)),Mt.setIndex(Bo);const Sa=new h.Mesh(Mt,oe(Tn,Ln,{transparent:!0,depthWrite:!1,side:h.DoubleSide}));Sa.renderOrder=1,Sa.frustumCulled=!1,E.add(Sa),lt.push(Sa),await t.yield();const oa={value:0},Wt=ma.fxGroup();E.add(Wt.object);const Ga=[],Wo=w.clone().lerp(se("#ffffff"),.55).multiplyScalar(l.low<1?.75:1);for(let e=0;e<64;e++){const a=F+r.range(-98,98);Ga.push([a,Fe+r.range(1,8),ne(a)+r.range(7,17)])}for(let e=0;e<22;e++){const a=F+r.range(-9,9),o=r.range(326,364);Ga.push([a,ve(a,o)+r.range(1.5,6),o])}const sa=r.fork("mist"),it=[],Ot=[];for(let e=0;e<86;e++){const a=Ga[e],o=e>=64,s=Math.abs(a[0]-F);if(o?e%3!==0:e%2!==1||s<13)continue;const n=o?Math.max(a[2],344+(a[2]-326)*.3):ne(a[0])+9.5+(a[2]-ne(a[0])-7)*.45;it.push(a[0],o?ve(a[0],n)-.4:Fe-.4,n,sa()),Ot.push(o?sa.range(4,5.6):sa.range(5.5,8),o?sa.range(6.5,9):sa.range(17,25))}for(const[e,a,o,s]of[[-22,.37,7,22],[25,.81,7.5,20],[-44,.13,8,24],[-15.5,.55,5.6,18],[17,.23,6,19]])it.push(F+e,Fe-.4,ne(F+e)+11.5,a),Ot.push(o,s);const Vt=new h.InstancedBufferGeometry;Vt.setAttribute("position",new h.Float32BufferAttribute([-.5,0,0,.5,0,0,-.5,1,0,.5,1,0],3)),Vt.setIndex([0,1,2,2,1,3]),Vt.setAttribute("aV",new h.InstancedBufferAttribute(new Float32Array(it),4)),Vt.setAttribute("aS",new h.InstancedBufferAttribute(new Float32Array(Ot),2)),Vt.instanceCount=it.length/4;const Ma=new h.Mesh(Vt,oe(qn,Cn,{transparent:!0,depthWrite:!1,premultipliedAlpha:!0,side:h.DoubleSide},{uVeil:{value:l.low<1?.7:.85}}));Ma.renderOrder=3,Ma.frustumCulled=!1,E.add(Ma),lt.push(Ma),await t.yield();{const e=[],a=[],o=[];for(let W=0;W<=54;W++){const S=-108+216*W/54,Z=F+S,X=N(ne(Z)+10.5,369.5,1-te(6.5,13,Math.abs(S)));for(let Y=0;Y<3;Y++)e.push(Z,Fe-.3+4.5*Y,X+1.2-1.1*Y),a.push(S,Y/2);if(W)for(let Y=0;Y<2;Y++){const fe=(W-1)*3+Y,pe=fe+3;o.push(fe,pe,fe+1,fe+1,pe,pe+1)}}const n=new h.BufferGeometry;n.setAttribute("position",new h.Float32BufferAttribute(e,3)),n.setAttribute("uv",new h.Float32BufferAttribute(a,2)),n.setIndex(o);const i=new h.Mesh(n,oe(Rn,Bn,{transparent:!0,depthWrite:!1,premultipliedAlpha:!0,side:h.DoubleSide},{uVeil:{value:l.low<1?.8:.95}}));i.renderOrder=2.6,i.frustumCulled=!1,E.add(i),lt.push(i);const u=Ve(Ge("lakes-mist2:"+t.seed)),f=[],b=[];for(let W=0,S=0;W<24&&S<400;S++){if(W<17){const We=15+u.gauss()*60,wt=-15+u.gauss()*28;if(ge.sdf(We,wt)>-6)continue;f.push(We,.1,wt,u()),b.push(u.range(18,34),u.range(3,6)),W++;continue}const Z=u.range(4,16),X=u.range(-1,1),Y=u(),fe=u.range(18,34),pe=u.range(3,6),me=(X<0?-1:1)*(fe/2+xo+3+Math.abs(X)*24),Te=je[0]+$e[0]*(Z-3)+Yt[0]*me,Ie=je[2]+$e[1]*(Z-3)+Yt[1]*me;f.push(Te,Math.max(.1,ge.bedAt(Te,Ie))+.1,Ie,Y),b.push(fe,pe),W++}const M=new h.InstancedBufferGeometry;M.setAttribute("position",new h.Float32BufferAttribute([-.5,0,0,.5,0,0,-.5,1,0,.5,1,0],3)),M.setIndex([0,1,2,2,1,3]),M.setAttribute("aV",new h.InstancedBufferAttribute(new Float32Array(f),4)),M.setAttribute("aS",new h.InstancedBufferAttribute(new Float32Array(b),2)),M.instanceCount=f.length/4;const re=new h.Mesh(M,oe(Ls,qs,{transparent:!0,depthWrite:!1,premultipliedAlpha:!0,side:h.DoubleSide},{uMist:{value:l.shaft?.3:l.moon?.16:l.low<1?.14:.13}}));re.renderOrder=3.5,re.frustumCulled=!1,E.add(re);{const W=Ve(Ge("lakes-sillmist:"+t.seed)),S=[],Z=[],X=je[0]-$e[0]*3,Y=je[2]-$e[1]*3;for(let me=0;me<10;me++){const Te=(me%2?1:-1)*W.range(10.5,24),Ie=W.range(-2.5,4);S.push(X+Yt[0]*Te+$e[0]*Ie,.25,Y+Yt[1]*Te+$e[1]*Ie,W()),Z.push(W.range(9,15),W.range(3.2,5.6))}const fe=new h.InstancedBufferGeometry;fe.setAttribute("position",new h.Float32BufferAttribute([-.5,0,0,.5,0,0,-.5,1,0,.5,1,0],3)),fe.setIndex([0,1,2,2,1,3]),fe.setAttribute("aV",new h.InstancedBufferAttribute(new Float32Array(S),4)),fe.setAttribute("aS",new h.InstancedBufferAttribute(new Float32Array(Z),2)),fe.instanceCount=S.length/4;const pe=new h.Mesh(fe,oe(Ls,qs,{transparent:!0,depthWrite:!1,premultipliedAlpha:!0,side:h.DoubleSide},{uMist:{value:l.moon?.3:.5}}));pe.renderOrder=3.5,pe.frustumCulled=!1,E.add(pe)}await t.yield();const g=[],z=[],C=[],G=[],V=11;for(let W=0;W<V;W++){const S=16+6*W+u.range(-1.2,1.2),Z=u(),X=W*4;g.push(F-78,0,S,F+78,0,S,F-78,20,S,F+78,20,S),z.push(-1,0,1,0,-1,1,1,1),C.push(Z,Z,Z,Z),G.push(X,X+1,X+2,X+2,X+1,X+3)}const ee=new h.BufferGeometry;ee.setAttribute("position",new h.Float32BufferAttribute(g,3)),ee.setAttribute("uv",new h.Float32BufferAttribute(z,2)),ee.setAttribute("aSeed",new h.Float32BufferAttribute(C,1)),ee.setIndex(G);const ae=new h.Mesh(ee,oe(Nn,In,{transparent:!0,depthWrite:!1,premultipliedAlpha:!0,side:h.DoubleSide},{uBankK:{value:l.shaft?1:y==="dawn"?.9:l.moon?.55:l.snow?.6:.5},uBeam:{value:new h.Vector4(_.x/ce,_.z/ce,Math.min(ce,.848),Math.max(_.y,.53))}}));ae.renderOrder=3.4,ae.frustumCulled=!1,E.add(ae)}await t.yield(),y==="dawn"&&(Wt.add(ma.makeMist({rng:r.fork("smoke1"),count:80,area:[360,2.5,380],center:[45,1.6,30],size:[18,40],color:Wo,opacity:.15,drift:[.5,0,.9],time:oa})),Wt.add(ma.makeMist({rng:r.fork("smoke2"),count:40,area:[180,2.5,260],center:[-80,Fe+1.6,480],size:[16,34],color:Wo,opacity:.2,drift:[.4,0,.7],time:oa})),await t.yield()),l.snow&&Wt.add(ma.makeParticles({rng:r.fork("snow"),preset:"snow",count:Math.round(2e3*m),size:[.035,.09],time:oa})),Wt.add(ma.makeParticles({rng:r.fork("leaffall"),preset:"leaves",count:Math.round(420*m*l.leaves),colors:["#e3a82b","#c8421a","#f0c44a"],time:oa})),await t.yield();const Is=oe(Fs,Ts,{side:h.DoubleSide}),Ds=new h.Matrix4,Oo=new h.Quaternion,Vo=new h.Euler,pt=new h.Vector3,Go=new h.Vector3,Oe=(e,a,o=Is)=>{const s=new h.InstancedMesh(e,o,Math.max(1,a.length));return s.count=a.length,a.forEach((n,i)=>{Vo.set(0,n[3],0),Oo.setFromEuler(Vo),pt.set(n[0],n[1],n[2]),Go.set(n[4],n[5],n[4]),s.setMatrixAt(i,Ds.compose(pt,Oo,Go)),s.setColorAt(i,n[6])}),s.instanceMatrix.needsUpdate=!0,s.instanceColor&&(s.instanceColor.needsUpdate=!0),s.frustumCulled=!1,E.add(s),s},be=r.fork("plants"),De=(e,a=0)=>new h.Color(e*(1+a),e,e*(1-a)),na=p?I.clone().lerp(se("#b7791f"),.35):I,Ct=[],Je=Ve(Ge("lakes-willows:"+t.seed));for(let e=0,a=Math.round(70+12*x);e<6e3&&Ct.length<a;e++){const o=Ct.length<36,s=o?Je.range(254,318):Je.range(246,333),n=F+(o?Ct.length%2?1:-1:Je.sign())*(o?Je.range(8.3,10.6):Je.range(10.5,20));if(Ct.some(f=>(f[0]-n)*(f[0]-n)+(f[2]-s)*(f[2]-s)<(o?5:7))||o&&Math.abs(s-Rt)<3.5)continue;const i=ve(n,s);if(D.t>.02)continue;const u=o?Je.range(.95,1.4):Je.range(.75,1.25);Ct.push([n,i-.12,s,Je()*6.283,u,u*Je.range(.85,1.15),De(Je.range(.8,1.2),Je.range(-.08,.08))])}const Ws=Ct.slice(0,36),Ha=Ct.slice(36).filter((e,a)=>a%4!==2),Ho=se(p?"#c9a738":"#b9b43a"),Uo=se(p?"#a58a2c":"#8a9a2e"),Ne=Ve(Ge("lakes-laid:"+t.seed)),Ua=(e,a,o)=>{const s=e[0]+a,n=ne(s)+9*(e[1]-.045+o);return[s,ve(s,n),n]};Ke.forEach((e,a)=>{if(a%3!==2)for(let o=0;o<2;o++){const s=Ua(e,(o?1:-1)*Ne.range(.5,1.3),Ne.range(-.01,.01)),n=Ne.range(.95,1.3);Ha.push([s[0],s[1]-.3,s[2],Ne()*6.283,n,n*Ne.range(.9,1.1),De(Ne.range(.85,1.2),Ne.range(-.06,.06))])}});const ht=de.anchors.island,Ce=Ve(Ge("lakes-island:"+t.seed));for(let e=0;e<5;e++){const a=(e+Ce.range(-.3,.3))/5*6.283,o=ht.r*Ce.range(.72,.9),s=ht.x+Math.cos(a)*o,n=ht.z+Math.sin(a)*o,i=Ce.range(.55,.85);Ha.push([s,ht.heightAt(s,n)-.1,n,Ce()*6.283,i,i*Ce.range(.9,1.1),De(Ce.range(.9,1.25),Ce.range(-.04,.08))])}await t.yield(),yt.push(Oe(Es(be,Ho,Uo,!0),Ws)),await t.yield(),Oe(Es(be,Ho,Uo,!1),Ha),await t.yield();const Os=Un(be,na,I.clone().lerp(se("#f2d15a"),.6),se(p?"#a4671e":"#9aa53a"),p?.62:1),_o=[];await t.yield();const ra=Math.max(0,ve(F-11.5,Rt)),Vs=Ve(Ge("lakes-monkeytree:"+t.seed)),_a=await _n(Vs,na,I.clone().lerp(se("#f2d15a"),.6),se(p?"#b06a1e":"#9aa53a"),t.yield);yt.push(Oe(_a,[[F-11.5,ra,Rt,0,1,1,De(1)],[F+11.5,ra,Rt,Math.PI,1,1,De(.95,.04)]])),await t.yield();for(let e=0;e<6;e++){const a=e%2?1:-1,o=269+e*7.2+be.range(-1.5,1.5),s=F+a*be.range(12,13.5),n=be.range(.8,.98);_o.push([s,ve(s,o)-.1,o,(a>0?Math.PI:0)+be.range(-.35,.35),n,n,De(be.range(.85,1.1),be.range(-.05,.05))])}yt.push(Oe(Os,_o)),await t.yield();{const e=l.isle||[1,1,1,0,1,1,0],a=oe(Fs,Ts,{side:h.DoubleSide,defines:{ISLE:1}},{uIsTone:{value:new h.Vector4(e[0],e[1],e[2],e[3])},uIsLit:{value:new h.Vector3(e[4],e[5],e[6])}}),o=[],s=[],n=(i,u)=>new h.Color(i*(1+u),i,i*(1-u));for(const i of ht.trees){if(i.kind===2)continue;const u=i.h/10;(i.kind?s:o).push([i.x,i.y-.15,i.z,-i.out+Ce.range(-.5,.5),u*Ce.range(.95,1.1),u,n(Ce.range(.86,1.04),Ce.range(-.03,.07))])}Oe(Ks(Ce,0,[I.clone().lerp(se("#f6c531"),.5),se("#f7dc62"),se("#e08a1c")]),o,a),await t.yield(),Oe(Ks(Ce,1,[$.clone().lerp(se("#e0401c"),.5),se("#ee6a1e"),se("#a8231a")]),s,a)}await t.yield();const ct=Ve(Ge("lakes-lipspruce:"+t.seed)),la=[],Za=(e,a)=>{const o=ne(e)-a,s=ve(e,o);if(D.t>.03)return;const n=ct.range(.8,1.35);la.push([e,s-.2,o,ct()*6.283,n,n*ct.range(.9,1.15),De(ct.range(.8,1.25))])};for(let e=0;e<8;e++){const a=e%2?1:-1,o=F+a*ct.range(15.5,25);Za(o,ct.range(3,12))}for(let e=0;e<12;e++){const a=F+(e%2?1:-1)*ct.range(30,102);Za(a,ct.range(2.5,6)),Za(a+ct.range(-4,4),ct.range(6,11))}Ke.forEach((e,a)=>{if(a%3===0)return;const o=Ua(e,a%3===2?0:Ne.range(-2.2,2.2),.005),s=a%3===2?Ne.range(.55,.7):Ne.range(.34,.46);if(la.push([o[0],o[1]-.3,o[2],Ne()*6.283,s*1.15,s,De(Ne.range(.85,1.2))]),a%3===2){const n=Ua(e,Ne.sign()*1.9,.012),i=Ne.range(.3,.4);la.push([n[0],n[1]-.3,n[2],Ne()*6.283,i*1.15,i,De(Ne.range(.85,1.2))])}});for(const e of ht.trees)if(e.kind===2){const a=e.h/10;la.push([e.x,e.y-.2,e.z,e.yaw,a*1.1,a,De(Ce.range(.9,1.25))])}await t.yield();const Zo=Zn(be,U.clone().multiplyScalar(2.3),U.clone().lerp(se("#5f8a4a"),.5).multiplyScalar(1.5));Oe(Zo,la),await t.yield();{const e=Ve(Ge("lakes-clump:"+t.seed)),a=[];for(let o=0;o<10;o++){const s=o>>1,n=F+(o%2?1:-1)*(13.6+s*1.85+e.range(-.5,.5)),i=ne(n)-1.5-s%3*3.3-e.range(0,1.6),u=ve(n,i),f=e.range(1.9,2.6)*(1-.05*s);a.push([n,u-.3,i,e()*6.283,f*.7,f,De(.5+e.range(.3,.42)*.7,-.04)])}ga.push(Oe(Zo,a))}await t.yield();const za=[],ja=[],Gs=Math.round(250*(.6+.4*m)),Ue=Ve(Ge("lakes-knobs:"+t.seed));for(let e=0,a=0,o=0;e<4e3&&za.length<Gs;e++){(e&127)===127&&await t.yield(),e%5===0&&(a=F+Ue.range(-8.5,8.5),o=Ue.chance(.34)?Ue.range(248.5,262):Ue.range(260,331));const s=a+Ue.gauss()*1.5,n=o+Ue.gauss()*2.2,i=Ue.range(.22,.5)*(Ue.chance(.15)?1.5:1);if(Math.abs(s-F)>10.5||n<247.5||n>333||za.some(b=>(b[0]-s)*(b[0]-s)+(b[2]-n)*(b[2]-n)<(b[4]+i)*(b[4]+i)*1.5))continue;const u=ve(s,n);if(D.t>.02||D.film<.5)continue;const f=Ue.chance(.22);za.push([s,u,n,Ue()*6.283,i,i*Ue.range(.7,1.25),f?new h.Color(.62,.86,.42).multiplyScalar(Ue.range(.8,1.1)):De(Ue.range(.85,1.15),Ue.range(0,.06))]),ja.push(s,u,n,i)}await t.yield(),yt.push(Oe(Yn(Ne,q.clone().multiplyScalar(.66),new h.Color(q.r*.36,q.g*.28,q.b*.16)),za));const ia=new h.InstancedBufferGeometry;ia.setAttribute("position",new h.Float32BufferAttribute([-.5,0,0,.5,0,0,-.5,0,1,.5,0,1],3)),ia.setIndex([0,2,1,1,2,3]),ia.setAttribute("iK",new h.InstancedBufferAttribute(new Float32Array(ja),4)),ia.instanceCount=ja.length/4;const Xa=new h.Mesh(ia,oe(Jn,e0,{transparent:!0,depthWrite:!1,premultipliedAlpha:!0,side:h.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-8}));Xa.renderOrder=1,Xa.frustumCulled=!1,E.add(Xa),await t.yield();const zt=[];for(let e=0;e<6e3&&zt.length<310;e++){(e&127)===127&&await t.yield();const a=F+be.range(-64,124)*(e%5?-1:1)-(e%5,0),o=be.range(384,566),s=Me(a,o);if(s<-3.5||s>1.5||Math.abs(a-F)<26)continue;const n=be.range(.8,1.35);zt.push([a,Math.max(ve(a,o),Fe-.3),o,be()*6.283,n,n,De(be.range(.8,1.2))])}{let e=0;for(let a=0;a<zt.length;a++)a%4!==3&&(zt[e++]=zt[a]);zt.length=e}for(let e=0;e<16;e++){const a=Ce()*6.283,o=ht.r*Ce.range(.86,1.03),s=ht.x+Math.cos(a)*o,n=ht.z+Math.sin(a)*o,i=Ce.range(.6,1);zt.push([s,Math.max(ht.heightAt(s,n),0)-.05,n,Ce()*6.283,i,i,De(Ce.range(.85,1.2))])}await t.yield(),Oe(Xn(be,I.clone().multiplyScalar(.45),I.clone().lerp(se("#f0d28a"),.3)),zt),await t.yield();const $a=[],Qa=[],Ya=[],Hs=p?$.clone().multiplyScalar(.8):$,Us=se("#7c8a2e"),jo=(e,a,o,s,n,i,u,f,b)=>{const M=Hn(a,o,s,n,p?1:0),re=e(),g=!b&&M.aut>.4&&re<.06+.9*M.aut,z=e();if(g){const C=e.range(10,16)*i,G=z<.1?Us:z<.1+.9*M.scar?Hs:na;(u?Ya:Qa).push([a,o-.5-f*C,s,e()*6.283,C*e.range(.8,1.15),C,G.clone().multiplyScalar(e.range(.42,.74))])}else{const C=e.range(13,23)*i,G=M.larch>.5&&e()<.4;$a.push([a,o-.5-f*C,s,e()*6.283,C*e.range(.4,.56),C,G?na.clone().multiplyScalar(e.range(.45,.7)):U.clone().multiplyScalar(e.range(1.3,2.4))])}},Xo=Math.round(800*(.55+.45*m)),Gt=Ve(Ge("lakes-belt:"+t.seed));for(let e=0,a=0;e<Xo*10&&a<Xo;e++){(e&63)===0&&await t.yield();const o=e%5===0,s=o?Gt.range(-340,160):Gt.range(-340,430),n=o?Gt.range(335,650):Gt.range(-430,335),i=ve(s,n),u=D.sh,f=D.alt;if(D.rise>45||D.trav>.05||u<22||u>240||Gt()>1.12-u/240)continue;const b=Be.nearestXZ(s,n).dist;b<52||(jo(Gt,s,i,n,f,1,b>230,0,b<=72||Math.hypot(s-je[0],n-je[2])<90),a++)}const Ja=[],$o=Math.round(520*(.6+.4*m));for(let e=0,a=0;e<$o&&a<$o;e++){(e&7)===0&&await t.yield();const o=e%10<7,s=o?be.range(-470,290):be.range(-330,520),n=24+230*Math.pow(be(),1.3),i=be.int(6,10),u=be.range(7,15);let f=0;for(let b=0;b<i;b++){const M=s+be.gauss()*u*.62,re=(o?Le(M)+qe(M)+n:Le(M)-qe(M)-n)+be.gauss()*u*.5,g=ve(re,M),z=D.rise;z>230||z<4||D.trav>.05||(jo(be,re,g,M,D.alt,be.range(.85,1.3),!0,.45,!0),a++,f++)}f&&Ja.push([o,s,n,u])}await t.yield();for(const e of[Ya,$a,Qa]){let a=0;for(let o=0;o<e.length;o++)o%7!==6&&o%7!==3&&(e[a++]=e[o]);e.length=a}Oe(Rs(be,2),Ya),await t.yield(),Oe($n(be),$a),await t.yield(),Oe(Rs(be),Qa),await t.yield();const _e=r.fork("forest"),_s=ut.makeWind({direction:[.5,.85],strength:.9}),Qo={wind:_s};ut.prepareLeafTexture&&await ut.prepareLeafTexture(Qo,t.yield),await t.yield();const Yo=ut.windMaterial(Qo);await t.yield();const Jo=async e=>{const a=ut.birchGeometry({rng:_e,detail:e,autumn:!0,height:14,fullness:p?.6:1});await t.yield();const o=ut.mapleGeometry({rng:_e,detail:e,height:12});await t.yield();const s=ut.coniferGeometry({rng:_e,detail:e,height:19,snow:l.snow*.45,leaf:"#24513a",leafLight:"#5a865c",leafDark:"#102a1e"});return await t.yield(),[a,o,s]},Zs=await Jo(1),js=await Jo(0),Pt=[],es=je[0]-$e[0]*3,ts=je[2]-$e[1]*3,eo=(e,a,o,s=_e)=>{const n=Be.nearestXZ(e,a);if(n.dist<20||Pt.some(f=>(f.x-e)*(f.x-e)+(f.z-a)*(f.z-a)<16))return;const i=s(),u=i<o?2:i<o+(1-o)*.68?0:1;Pt.push({x:e,y:ve(e,a),z:a,s:s.range(.85,1.35),rot:s()*6.283,d:n.dist,u:n.u,v:u})},to=Math.round(118+34*x);for(let e=0;e<6e3&&Pt.length<to;e++){const a=_e.range(-200,290),o=_e.range(-225,241),s=ge.sdf(a,o);if(s<5||s>44||_e()>1.15-s/44)continue;const n=(a-es)*Yt[0]+(o-ts)*Yt[1],i=(a-es)*$e[0]+(o-ts)*$e[1];Math.abs(n)<26&&i>-8||Math.abs(a-F)<17&&o>205||(eo(a,o,Math.hypot(a-je[0],o-je[2])<75?.8:s>20?.62:.32),(e&255)===0&&await t.yield())}const ha=Ve(Ge("lakes-shoaltrees:"+t.seed)),ao=Ve(Ge("lakes-lowtrees:"+t.seed));for(let e=0;e<1500&&Pt.length<to+60;e++){(e&127)===0&&await t.yield();const a=F+ha.sign()*ha.range(21,118),o=ha.range(243,333);ve(a,o),!(D.t>.02||D.film>.5&&ha()<.6)&&eo(a,o,.3,ha)}for(let e=0;e<2500&&Pt.length<to+94;e++){(e&127)===0&&await t.yield();const a=ao.range(-300,110),o=ao.range(346,562);Me(a,o)<5||(ve(a,o),!(D.t>.02&&D.t<.98)&&eo(a,o,.45,ao))}{const e=Pt.map((a,o)=>[a.d,o]).sort((a,o)=>o[0]-a[0]).slice(0,84).filter((a,o)=>o%2===0).map(a=>a[1]).sort((a,o)=>o-a);for(const a of e)Pt.splice(a,1)}await t.yield();const Xs=l.low<1;await t.yield();const as=ut.makeScatter({rng:_e,points:Pt,variants:Zs,farVariants:js,farDistance:42,material:Yo,chunks:3,cullDistance:900,sink:.02,heightAt:ve,groundShadow:{sunDir:_,strength:Xs?.25:.45}});E.add(as.object),await t.yield();const ca=[];for(let e=0;e<3e3&&ca.length<46;e++){(e&127)===127&&await t.yield();const a=_e.range(-200,290),o=_e.range(-225,241),s=ge.sdf(a,o),n=s>2&&s<13?Be.nearestXZ(a,o):null;n&&n.dist>22&&!(Math.abs(a-F)<17&&o>205)&&ca.push({x:a,y:ve(a,o),z:o,s:_e.range(.24,.34),rot:_e()*6.283,d:n.dist,u:n.u,v:0})}ca.length>30&&(ca.length=30),await t.yield();const $s=ut.bambooGeometry({rng:_e,detail:0,stalk:"#9fb04a",leaf:"#8fae3e"});await t.yield();const os=ut.makeScatter({rng:_e,points:ca,variants:[$s],material:Yo,sink:.02,tint:.2});E.add(os.object),await t.yield();const ss=gt.lightFrom(E),oo=[],so=(e,a,o,s={})=>{const n=new Float32Array(a*4),i=new Float32Array(a*4),u=new Float32Array(a*3).fill(1),f=gt.instancedGeo(e,a,n,i,u);f.attributes.iA.setUsage(h.DynamicDrawUsage),f.attributes.iB.setUsage(h.DynamicDrawUsage);const b=gt.creatureMaterial({instanced:!0,upright:!0,pre:t0,traj:a0,deform:o,light:ss,rim:.3,...s}),M=gt.creatureMesh(f,b,0);return E.add(M),oo.push(b),{iA:n,iB:i,iT:u,g:f,m:b,mesh:M}},Ht=38,et=so(o0(),Ht,s0,{rim:.35}),no=new Float32Array(Ht),ro=r.fork("ducks"),lo=de.anchors.standPerches||[],fa=[0,.3,1.7,2.1,3.5,3.8,5.2,5.6,7.1],Qs=[6.5,7.6,9.4,8.2,10.3,7.1,9,10.5,8.5],ns=[],io=[],Ys=pa*Ze,rs=.034,Js=6e-4,en=rs*Ze,ls=1.2,Ee=new h.Vector3,At=new h.Vector3,ft=new h.Vector3,is=new h.Vector2;for(let e=0;e<9;e++)ns.push((e%2?1:-1)*(.55+.5*fa[e])),io.push(-.5+.12*fa[e]);await t.yield();const hs=(e,a,o)=>{const s=pa+Js*e,n=(a-s)/rs,i=ze(n,0,1),u=i*i,f=u*i,b=(.4-s)*Ze+13.5+.5*fa[e]-6.5-fa[e],M=n<=0?(a-pa)*Ze:(s-pa)*Ze+(f-2*u+i)*en+(3*u-2*f)*b+(f-u)*ls+Math.max(0,n-1)*ls,re=Ys+6.5+fa[e]+M,g=te(.25,1,i);Be.posAtDist(re,o),Be.tangentAtDist(re,ft);const z=te(.27,.3,a)*(1-te(.352,.37,a)),C=Math.hypot(ft.x,ft.z)||1,G=N(ns[e],Qs[e],g)-5.2*z,V=1-te(.04,.5,i);return o.x-=ft.z/C*G,o.z+=ft.x/C*G,o.y=N(.03,o.y+io[e]-(.35+.25*io[e])*z,V),n},cs=(e,a,o,s)=>{const n=te(.775,.875,a),i=a*Ze+15+3.3*e+.5*Ze*.04*Math.log(1+Math.exp((.5-a)/.04))+30*n,u=an[e]+52*n*n;Be.posAtDist(i,s),Be.tangentAtDist(i,ft);const f=Math.hypot(ft.x,ft.z)||1;s.x-=ft.z/f*u,s.z+=ft.x/f*u,s.y=Math.max(s.y+on[e]+4*n,1)+.14*Math.sin(o*1.9+e*2.3)},ho=new Float32Array(Ht),co=new Float32Array(Ht),fs=new Float32Array(Ht),tn=[[135.6,-56],[175.3,-126.7]],an=[-2.8,2.4,-.7,3.9],on=[-.5,-1.3,-1.9,-.9];for(let e=0;e<Ht;e++){const a=e*4,o=e%3===2,s=e>=25&&e<29;if(fs[e]=ro()*6.283,et.iB[a]=s?.75:e<9||e>=34?2.05:e===23||e===24?3.5:e>=29?e-29<lo.length?2.9:0:1.45,e>=29&&e<34&&e-29<lo.length){const n=lo[e-29],i=Be.pointAt(Be.nearestXZ(n.x,n.z).u,Ee);et.iA.set([n.x,n.y+.3,n.z,Math.atan2(i.x-n.x,i.z-n.z)+(e%2?1.1:-1.1)],a)}if(s?et.iT.set([.2,.18,.17],e*3):o&&et.iT.set([.62,.58,.55],e*3),e>=9&&e<23){const n=tn[e<16?0:1];let i=n[0],u=n[1];for(let f=0;f<60;f++){i=n[0]+ro.range(-7,7),u=n[1]+ro.range(-7,7);let b=ge.sdf(i,u)<-2.5&&Be.nearestXZ(i,u).dist>7.5;for(let M=9;M<e&&b;M++)Math.hypot(ho[M]-i,co[M]-u)<1.3&&(b=!1);if(b)break}ho[e]=i,co[e]=u,no[e]=.2}else if(e===23||e===24){const n=de.anchors.duckPerches[e-23];et.iA.set([n.x,n.y+.36,n.z,Math.atan2(-$e[0],-$e[1])+(e===23?.75:-.75)],a)}else if(e===25||e===26){const n=F+(e===25?-7.6:8.2),i=e===25?291:302;et.iA.set([n,ve(n,i)+.13,i,e===25?1.9:-2.3],a)}await t.yield()}const Ut=new h.InstancedBufferGeometry;Ut.setAttribute("position",new h.Float32BufferAttribute([-.5,0,0,.5,0,0,-.5,0,1,.5,0,1],3)),Ut.setIndex([0,2,1,1,2,3]),Ut.setAttribute("iA",et.g.attributes.iA);const fo=new h.InstancedBufferAttribute(no,1);fo.setUsage(h.DynamicDrawUsage),Ut.setAttribute("iW",fo),Ut.instanceCount=23;const uo=new h.Mesh(Ut,oe(On,Vn,{transparent:!0,depthWrite:!1,premultipliedAlpha:!0,side:h.DoubleSide}));uo.renderOrder=4,uo.frustumCulled=!1,E.add(uo),await t.yield();const ds=Math.round(5+3*x),Ft=so(n0(),ds,r0,{rim:.6,fill:.36,back:.8}),Tt=r.fork("monkeys"),sn=1.9,Lt=.02,mo=.012,vo=.012,_t=_a.userData.slots,Re=(e,a)=>e?[F+11.5-_t[a][0],ra+_t[a][1],Rt-_t[a][2]]:[F-11.5+_t[a][0],ra+_t[a][1],Rt+_t[a][2]],Zt=[[Re(0,0),Re(0,0),Re(1,0),Re(1,2),.208],[Re(0,1),Re(0,1),Re(1,1),Re(1,3),.226],[Re(0,2),Re(0,0),Re(1,0),Re(1,0),.243],[Re(0,3),Re(0,1),Re(1,1),Re(1,1),.2485]],Pa=Zt.length,us=[[4,1],[4,0],[5,0],[5,1]],nn=[.66,0,.7,1],rn=_a.userData.yaws,ms=[],tt=[],po=[];for(let e=0;e<ds;e++){const a=e*4,o=sn*Tt.range(.9,1.06)*(e===6?.72:1);if(ms.push(o),Ft.iB[a]=o,e>=Pa){const[u,f]=us[e-Pa],b=Re(f,u),M=nn[e-Pa],re=(f?-1:1)*Tt.range(.3,.7);Ft.iA.set([b[0],b[1]+o*N(.46,.09,M),b[2],M<.1?rn[u]+(f?Math.PI:0):M<.9?re*1.6:re],a),Ft.iB[a+3]=M;continue}const s=Zt[e][1],n=Zt[e][2],i=Zt[e][4];for(let u=0;u<20;u++){const f=u<7?s:n;tt.push(f[0]+Tt.range(-.8,.8),f[1]+.3+Tt.range(-.5,.6),f[2]+Tt.range(-.8,.8),u<7?i+.001:i+Lt),po.push(Tt.range(-1,1),Tt.range(.4,1.6),Tt.range(-1,1),0)}}await t.yield();const Aa=Be.tangentAt(.885),vs=Math.hypot(Aa.x,Aa.z)||1,ps=Aa.x/vs,ws=Aa.z/vs,qt=de.anchors.pheasantPerch,gs=1.5,ln=.172*gs-.012,ys=Math.atan2(ps*.819+ws*.574,ws*.819-ps*.574),bs=new h.Vector4(0,0,0,0),Xe=new h.Vector3,Et=so(l0(l.snow>0),1,i0,{rim:.5,fill:.3,pattern:h0,defines:{PATTERN:1},uniforms:{uPz:{value:bs}}});l.low<1&&Et.iT.fill(1.6),Et.iA.set([qt.position.x,qt.position.y+ln,qt.position.z,ys]),Et.iB.set([gs,0,0,.06]),await t.yield();let Fa=null;d.rare&&(Fa=gt.makeHerd({rng:r.fork("takin"),preset:{...gt.HERD_PRESETS.bison,h:1.3,headLen:.4,horns:.2},count:9,coat:"#c59a45",belly:"#9c7430",legs:"#4c3a26",sock:"#2f261c",accent:"#3a2c1e",horn:"#2c2620",center:[F+19,0,253],radius:7.5,heightAt:ve,path:Be,clear:14,light:ss}),E.add(Fa.object)),await t.yield();const Kt=r.fork("spray"),hn=Math.round(520*(.5+.5*m));for(let e=0;e<hn;e++){const a=e%3===0,o=a?Kt.range(308,371):Kt.range(262,334),s=F+Kt.range(-1,1)*(a?11:9.5),n=Math.max(ve(s,o),Fe)+.08,i=Kt.range(1.4,3.2)*(a?1.3:1);tt.push(s,n,o,Kt()),po.push(Kt.range(-.5,.5),i,Kt.range(.3,1.3),2*i/9.8)}const jt=new h.InstancedBufferGeometry;jt.setAttribute("position",new h.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,-.5,.5,0,.5,.5,0],3)),jt.setIndex([0,1,2,2,1,3]),jt.setAttribute("aO",new h.InstancedBufferAttribute(new Float32Array(tt),4)),jt.setAttribute("aV",new h.InstancedBufferAttribute(new Float32Array(po),4)),jt.instanceCount=tt.length/4;const Ta=new h.Mesh(jt,oe(Dn,Wn,{transparent:!0,depthWrite:!1,premultipliedAlpha:!0},{uGold:{value:na}}));Ta.renderOrder=5,Ta.frustumCulled=!1,E.add(Ta),yt.push(Ta,Ft.mesh),await t.yield();{const e=r.fork("rafts"),a=[],o=Math.round(Lo*.75);for(let S=0;S<12;S++)a.push([F+e.range(-16,16),e.range(372,480),e.range(.5,1.4),e.range(6,17)]);for(let S=0;S<o;S++){const Z=a[S%a.length],X=Z[0]+e.gauss()*Z[2],Y=Z[1]+e.gauss()*Z[3],fe=[X,Y,e()*6.283,e.range(.17,.32),e(),e()];Y>366&&Me(X,Y)<-1.2&&Dt.push(fe),(S&255)===255&&await t.yield()}const s=de.makeLeaves(Dt);s.position.y=Fe,E.add(s),lt.push(s),await t.yield();const n=r.fork("lipleaves"),i=[];for(let S=0;S<360;S++){const Z=S%3,X=n.range(196,255.5),Y=F+(Z===2?n.gauss()*1.6:(Z?1:-1)*((X>232?4.2:7)+n.gauss()*1.3)),fe=[Y,X,n()*6.283,n.range(.2,.36),n(),n()];(X>240?Math.abs(Y-F)<6.5:ge.sdf(Y,X)<-1.5)&&i.push(fe)}const u=de.makeLeaves(i);E.add(u),await t.yield();const f=r.fork("lipmoss"),b=[],M=ie.clone().multiplyScalar(1.25),re=ie.clone().lerp(U,.45),g=I.clone().lerp(se("#a8b45a"),.55).multiplyScalar(.8);for(let S=0;S<132;S++){const Z=13+(S>>1)*1.38+f.range(-.4,.4),X=F+(S%2?Z:-Z),Y=ne(X)+f.range(-1.5,1.2),fe=f.range(.9,1.9);b.push([X,ve(X,Y)-.06*fe,Y,f()*6.283,fe,fe*f.range(.8,1.3),De(f.range(.85,1.2),f.range(-.05,.05))])}for(let S=0;S<10;S++)for(let Z=0;Z<3;Z++){const X=S>>1,Y=F+(S%2?1:-1)*(13.6+X*1.85),fe=ne(Y)-1.5-X%3*3.3,pe=f()*6.283,me=f.range(.7,1.5),Te=Y+Math.cos(pe)*me,Ie=fe+Math.sin(pe)*me,We=f.range(.8,1.4);b.push([Te,ve(Te,Ie)-.06*We,Ie,f()*6.283,We,We*f.range(.8,1.2),De(f.range(.85,1.2),f.range(-.05,.05))])}lt.push(Oe(jn(f,M,re,g),b)),await t.yield();const z=r.fork("lakerafts"),C=8,G=[],V=z(),ee=(S,Z,X,Y,fe,pe)=>{const me=Math.sin(fe),Te=Math.cos(fe),Ie=Y*Math.abs(me)+(X+pe)*Math.abs(Te);if(Math.abs(S-F)-Ie<C||Z-Y*Math.abs(Te)<376||Me(S,Z)>-4||Me(S+me*Y,Z+Te*Y)>-3||Me(S-me*Y,Z-Te*Y)>-3)return!1;for(let We=0;We<G.length;We++)if(Math.hypot(S-G[We][0],Z-G[We][1])<14)return!1;return G.push([S,Z,X,Y,me,Te,z(),pe]),!0};for(let S=0;S<12;S++)ee(a[S][0],a[S][1],z.range(.9,1),ze(a[S][3]*.5,5,6),z.range(-.52,.52),z.range(.2,.6));for(let S=0;G.length<12&&S<400;S++){const Z=z.range(.9,1),X=z.range(5,6),Y=z.range(-.52,.52),fe=z.range(.2,.6),pe=z(),me=C+X*Math.abs(Math.sin(Y))+(Z+fe)*Math.abs(Math.cos(Y))+.5+14*pe*pe;ee(F+(S%2?me:-me),376+X+(102-X)*((V+S*.618)%1),Z,X,Y,fe)}for(let S=0;S<24;S++){const Z=G[S];Z?(ba[S].set(Z[0],Z[1],Z[2],Z[3]),xa[S].set(Z[4],Z[5],Z[6],Z[7])):(ba[S].set(0,0,0,0),xa[S].set(0,1,0,0))}await t.yield();const ae=r.fork("drifts"),W=[];for(let S=0;S<Ja.length;S++){const[Z,X,Y,fe]=Ja[S];for(let pe=0;pe<6;pe++){const me=X+ae.gauss()*fe*.62,Te=(Z?Le(me)+qe(me)+Y:Le(me)-qe(me)-Y)+ae.gauss()*fe*.5,Ie=ae.range(13,23)*ae.range(.85,1.3),We=ae()*6.283,wt=ae.range(.4,.56),ua=ae.range(1.3,2.4),Ea=ve(Te,me);D.rise>230||D.rise<4||D.trav>.05||W.push([Te,Ea-.5-.45*Ie,me,We,Ie*wt,Ie,U.clone().multiplyScalar(ua)])}(S&7)===7&&await t.yield()}Oe(Qn(ae),W),await t.yield()}const wo=e=>{const a=new h.Box3,o=new h.Box3;for(const s of e){if(s.isInstancedMesh)s.computeBoundingBox(),o.copy(s.boundingBox);else if(!s.geometry.isInstancedBufferGeometry)s.geometry.computeBoundingBox(),o.copy(s.geometry.boundingBox);else continue;s.updateMatrixWorld(),a.union(o.applyMatrix4(s.matrixWorld))}return a},Xt=wo(yt),da=wo(lt),xs=wo(ga);for(let e=0;e<tt.length;e+=4)Xt.expandByPoint(pt.set(tt[e],tt[e+1]-4,tt[e+2])),Xt.expandByPoint(pt.set(tt[e],tt[e+1]+1.5,tt[e+2]));for(const e of Zt)for(let a=0;a<4;a++)Xt.expandByPoint(pt.set(e[a][0],e[a][1]+3.5,e[a][2]));for(const[e,a]of us){const o=Re(a,e);Xt.expandByPoint(pt.set(o[0],o[1]+2,o[2]))}for(let e=0;e<Ot.length;e+=2){const a=Ot[e]/2+.8,o=e*2;da.expandByPoint(pt.set(it[o]-a,it[o+1],it[o+2]-a)),da.expandByPoint(pt.set(it[o]+a,it[o+1]+1.3*Ot[e+1],it[o+2]+a))}for(let e=0;e<Dt.length;e++)da.expandByPoint(pt.set(Dt[e][0],Fe,Dt[e][1]));Xt.expandByScalar(3),da.expandByScalar(3),xs.expandByScalar(3);const go=e=>{let a=0;for(let o=0;o<8;o++){const s=(o&1?e.max.x:e.min.x)-Xe.x,n=(o&2?e.max.y:e.min.y)-Xe.y,i=(o&4?e.max.z:e.min.z)-Xe.z;s*dt.x+n*dt.y+i*dt.z<=0&&a++}return a<8};await t.yield(),await Q.prewarm(t.renderer,null,E);const cn=new h.Vector3,fn=new h.Vector3,$t=new h.Vector3,dn=new h.Vector3(je[0],je[1],je[2]),dt=new h.Vector3,un=Pe.reduce((e,a)=>a[1]<e[1]?a:e)[2];let La=0;for(;La<Ze&&Be.posAtDist(La,$t).z>un;)La+=.5;const qa=Be.nearestXZ(qt.abeam.x,qt.abeam.z).u*Ze,Ca=[[.44,-100,5,20],[.5,-100,10,-2],[.53,-100,11,-2],[.555,-62,9,-36],[.6,-31,3.5,-37],[.635,-10,6,-31],[.65,16.5,13,-14],[.7,66,6,-30],[.75,105,10,-8.5],[.79,133,9,-34],[.86,150,5,-52]],ke=te,mn=et.g.attributes.iA,vn=et.g.attributes.iB,pn=Ft.g.attributes.iA,wn=Ft.g.attributes.iB;return{scene:E,path:Be,duration:P,look:y,pace:e=>1.1-.25*ke(.18,.215,e)+.2*ke(.275,.31,e)-.31*ke(.455,.53,e)+.16*ke(.76,.82,e)+.1*ke(.895,.93,e),camera:{fov:62,near:.3,far:6e3,lookAhead:20,bank:.75},pois:[{at:[F,3,338],from:0,to:La/Ze,weight:.42,fade:.35},{at:(e,a)=>(Be.pointAt(ze(a,0,1),$t),$t.z-=15,$t.y=Math.max(Fe,So(F,$t.z))+.5,$t),from:.1,to:.2,weight:.5},{at:[F,ra+8.4,Rt],from:.18,to:.272,weight:.5},{at:(e,a)=>{let o=0;for(;o<Ca.length-2&&a>Ca[o+1][0];)o++;const s=Ca[o],n=Ca[o+1],i=ze((a-s[0])/(n[0]-s[0]),0,1);return cn.set(N(s[1],n[1],i),N(s[2],n[2],i),N(s[3],n[3],i))},from:.44,to:.86,weight:.6,fade:.2},{at:(e,a)=>fn.set(qt.position.x,qt.position.y+.5,qt.position.z).lerp(dn,ke(qa-3.6,qa+11.7,a*Ze)),from:(qa-83.5)/Ze,to:(qa+60.1)/Ze,weight:.6}],portal:{shape:"circle",radius:xo,color:"#bfe6ff",glow:1,tilt:!0},post:{exposure:l.exposure,bloom:{strength:.3,radius:.6,threshold:.92},grade:{saturation:1.08,contrast:1.05,tint:l.tint,shadowTint:"#04121a",vignette:.3,grain:.02}},ride:"none",update(e,a,o,s){ye.uTime.value=a,ye.uU.value=s,oa.value=a,t.renderer.getDrawingBufferSize(is),ye.uResY.value=is.y,o.getWorldPosition(Xe),o.getWorldDirection(dt),Q.update(e,a,o),de.setProgress(s),de.setLens(Xe.x,Xe.y,Xe.z,dt.x,dt.y,dt.z),de.update(e,a);const n=go(Xt),i=go(da),u=go(xs);for(let g=0;g<yt.length;g++)yt[g].visible=n;for(let g=0;g<ga.length;g++)ga[g].visible=u;for(let g=0;g<lt.length;g++)lt[g].visible=i;as.update(e,a,o),os.update(e,a,o),Wt.update(e,a,o);for(let g=0;g<oo.length;g++)oo[g].uniforms.uTime.value=a;Fa&&Fa.update(e,a,o);const f=et.iA,b=et.iB;for(let g=0;g<9;g++){const z=hs(g,s,Ee);hs(g,s+.0015,At);const C=At.x-Ee.x,G=At.y-Ee.y,V=At.z-Ee.z,ee=ze(z,0,1),ae=1-ke(.84,1,ee),W=1-ke(.3,.5,ee),S=ke(.2,.45,ee)*(1-ke(.84,1,ee)),Z=g*4;f[Z]=Ee.x,f[Z+1]=Ee.y+W*.12*Math.sin(a*1.7+g*2.1),f[Z+2]=Ee.z,f[Z+3]=Math.atan2(C,V),b[Z+1]=ae+S,b[Z+2]=ze(Math.atan2(G,Math.hypot(C,V)+1e-5),-.5,.6)*W+.6*S,b[Z+3]=W*.14*Math.sin(a*1.1+g*1.3),no[g]=ke(.46,.84,z)*(1-.75*ke(1.1,2.6,z)),Oa[g].set(Ee.x,Ee.z,Ee.z>366?1-ke(1.2,8.5,Ee.y-Fe):0)}for(let g=9;g<23;g++){const z=g*4,C=fs[g];f[z]=ho[g]+.6*Math.sin(a*.21+C),f[z+1]=.03,f[z+2]=co[g]+.6*Math.cos(a*.17+C*1.7),f[z+3]=C+.9*Math.sin(a*.13+C*2.3)}for(let g=25;g<27;g++){const z=Math.sin(a*5+g*2);b[g*4+2]=-.3*z*z*z*z}for(let g=27;g<29;g++){const z=g*4,C=g===27?-1:1,G=a*.3+g*3;f[z]=F+C*(46+24*Math.sin(G)),f[z+1]=Fe+1.3+.4*Math.sin(a*.9+g),f[z+2]=374+3*Math.sin(a*.6+g),f[z+3]=Math.atan2(C*7.2*Math.cos(G),1.8*Math.cos(a*.6+g)),b[z+1]=1}for(let g=34;g<38;g++){const z=g-34,C=g*4,G=ke(.25,.27,s)*(1-ke(.9,.93,s));cs(z,s,a,Ee),cs(z,s+.0015,a,At);const V=At.x-Ee.x,ee=At.y-Ee.y,ae=At.z-Ee.z;f[C]=Ee.x,f[C+1]=Ee.y,f[C+2]=Ee.z,f[C+3]=Math.atan2(V,ae),b[C]=2.2*G,b[C+1]=1,b[C+2]=ze(Math.atan2(ee,Math.hypot(V,ae)+1e-5),-.4,.5),b[C+3]=.16*Math.sin(a*1.2+z*1.7)}mn.needsUpdate=!0,vn.needsUpdate=!0,fo.needsUpdate=!0;{const g=Et.iA,z=Et.iB,C=g[0]-Xe.x,G=g[1]-Xe.y,V=g[2]-Xe.z,ee=Math.hypot(C,V);Et.mesh.visible=ee<300&&C*dt.x+G*dt.y+V*dt.z>-1.5;let ae=Math.atan2(Xe.x-g[0],Xe.z-g[2])-ys;ae-=6.28318*Math.round(ae/6.28318),bs.set(ze(ae,-1.7,1.7)*(1-ke(60,110,ee)),0,0,0),z[1]=1-ke(45,95,ee),Et.g.attributes.iB.needsUpdate=!0}const M=Ft.iA,re=Ft.iB;for(let g=0;g<Pa;g++){const z=Zt[g],C=z[4],G=z[0]!==z[1],V=z[2]!==z[3],ee=g*4,ae=ms[g],W=ze((s-C)/Lt,0,1),S=G?ke(C-mo-.003,C-.003,s):1,Z=V?ke(C+Lt+.004,C+Lt+.004+vo,s):0,X=Math.max(1-ke(C-(G?mo+.008:.008),C-(G?mo+.003:.003),s),ke(C+Lt+.004+(V?vo:0),C+Lt+.01+(V?vo:0),s)),Y=ke(0,.12,W)*(1-ke(.88,1,W)),fe=S<1?z[0]:W<1?z[1]:z[2],pe=S<1?z[1]:W<1?z[2]:z[3],me=S<1?S:W<1?W:Z,Te=ke(C-.004,C,s)*(1-ke(0,.08,W))+ke(.92,1,W)*(1-ke(C+Lt,C+Lt+.006,s));M[ee]=N(fe[0],pe[0],me),M[ee+1]=N(fe[1],pe[1],me)+ae*N(.46,.09,X)+5.6*W*(1-W)-.12*ae*Te,M[ee+2]=N(fe[2],pe[2],me),M[ee+3]=N(s<C?.5:-.5,1.5708,1-X),re[ee+1]=Y,re[ee+2]=(.6-1.25*W)*Y,re[ee+3]=X}pn.needsUpdate=!0,wn.needsUpdate=!0},dispose(){de.dispose?.(),Q.dispose?.()}}}};export{u0 as default};
