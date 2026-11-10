import*as n from"three";const Na=["#B5472F","#D99A45","#EFE2C4","#9AAB8A","#5C728C","#B8935F","#2B2624"],R=-520,Me=520,we=-170,it=350,y=768,Q=272,na=Math.tan(38*Math.PI/180),Ia=1.38,kt=1100,pt=-530,V=1024,Nt=9,Zt=.36,ba=272,Je=14,Ft=1.4,ya=.58,xa=.4,Pe=ba+42,vt=xa/ya,ka=2.1,F=(v,L,u)=>{const oe=Math.min(1,Math.max(0,(u-v)/(L-v)));return oe*oe*(3-2*oe)},Xe=(v,L,u)=>v+(L-v)*u,It=`
uniform sampler2D uStrata, uBake1, uBake2, uPart, uRockH;      // uPart: 1 on every dark shale parting of the bed table; uRockH: the Ribbon's height over its own footprint (uRect)
uniform vec3 uNBed, uSun, uSunCol, uSkyCol, uBounce, uCream, uMud, uCam, uWash;
uniform vec4 uBed;      // b0, 1/span, snow, wetAll
uniform vec4 uRect;     // x0, z0, 1/width, 1/depth
uniform vec4 uShade;    // storm shadow trailing edge, leading edge, cloud dark level, storm dark level
uniform vec4 uShade2;   // sun patch strength, sunrise line height, rain amount, unused
uniform vec4 uLand;     // spring flush on the wash floors, puddles on, unused, bed scale of the land
uniform vec3 uLandBed;  // the land away from the Ribbon is another limb of the fold: its own bed normal
uniform vec4 uFinA;     // gap axis x, z (unit, toward the mouth), seat x, z
uniform vec4 uFinB;     // fin beds: weight of height, weight of distance along the gap, scale, phase
uniform vec4 uFallW, uFallE;   // where the falls of the west and east fin come down (in gully coordinates)
uniform vec4 uRing, uRingB;    // the exit ring: its centre and how strongly it lights the gap; its colour and radius
vec3 capSat(vec3 c, float cap) {          // hold a colour's saturation under a ceiling, keeping its lightness
  float mx = max(c.r, max(c.g, c.b)), mn = min(c.r, min(c.g, c.b)), sat = (mx - mn) / max(mx, 1e-4);
  return mix(vec3(dot(c, vec3(.2126, .7152, .0722))), c, min(1., cap / max(sat, 1e-4)));
}
uniform vec4 uFinC;     // floor half width, mouth distance, fill boost in the gap, moonlight
uniform vec2 uWetDir, uWind, uVeil;   // uVeil: how far the rain veils stand ahead of the wet line (virga), their opacity
uniform float uFront, uTime;
float hash21(vec2 p) { p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash21(i), hash21(i + vec2(1., 0.)), f.x), mix(hash21(i + vec2(0., 1.)), hash21(i + vec2(1., 1.)), f.x), f.y);
}
float fbm3(vec2 p) { return vnoise(p) * .55 + vnoise(p * 2.13 + 17.1) * .3 + vnoise(p * 4.37 + 5.7) * .15; }
// x: wetness 0..1 with the sharp ragged edge, y: signed distance behind the front in metres (positive = behind)
vec2 wetAt(vec3 p) {
  float w = dot(p.xz, uWetDir);
  // (ragged at every scale: metres wide under the hooves, tens of metres up the height of the face, so that from four hundred
  // metres off the line is a torn edge climbing the beds and never a ruled one)
  float rag = (fbm3(p.xz * .035) - .5) * 17. + (vnoise(p.xz * .23) - .5) * 4. + (vnoise(vec2(p.y * .052 + 3.7, dot(p.xz, vec2(.34, .94)) * .014)) - .5) * 30.;
  float d = uFront + rag - w;
  float wet = smoothstep(-.7, .7, d);
  // first drops ahead of the line: dark specks a hand across, to be told one from another only from near by. (Drawn on rock
  // far across the basin, where a speck is many times finer than anything that can be told there, the specks and the dry rock
  // between them lay over one another like two pictures on one plate, and the end of the Ribbon where the line stood looked as
  // if it could be seen through.) They are let go with our own distance from the rock: whole within 40 m, gone by 140 m, and
  // from further off the line is its one ragged edge
  float spat = step(.74, vnoise(p.xz * 2.7)) * smoothstep(-22., -1., d) * (1. - smoothstep(40., 140., length(p - uCam)));
  wet = max(max(wet, spat * .75), uBed.w);
  return vec2(wet, mix(d, 400., uBed.w));
}
// how surely the ray from p along the unit vector d ends in the Ribbon's rock within some five hundred metres: fourteen steps out
// along it, each a quarter as long again (near its crest the ridge is thin: longer steps strode through it). Rain drawn in front
// of rock is all but put out by it
float rockBehind(vec3 p, vec3 d) {
  float rock = 0., tr = 22.;
  for (int i = 0; i < 14; i++) {
    vec3 rp = p + d * tr;
    vec2 ruv = (rp.xz - uRect.xy) * uRect.zw;
    float inside = step(0., min(min(ruv.x, ruv.y), min(1. - ruv.x, 1. - ruv.y)));
    rock = max(rock, inside * smoothstep(-3., 3., textureLod(uRockH, clamp(ruv, 0., 1.), 0.).r - rp.y));
    tr *= 1.28;
  }
  return rock;
}
// the shower's own cloud over a place. x: how far the place stands under it (0 clear of it, 1 under it); y: how far it stands in
// the sun patch behind it
vec2 showerAt(vec3 p) {
  // the shower's own cloud hangs low over its rain, and its shadow stands where its rain falls: by a place's own position down
  // the storm's heading, the same at every height, as the wet line itself is. (Thrown down the rays of the low sun, as the high
  // cumulus' shadows are, the band lay three and a half metres further back for every metre a place stands above the wash:
  // 120 m behind its place on the Knife's crest and 350 to 700 m behind it up the Ribbon's face. So the freshly soaked face
  // stood in full sun while the cloud was over it, and went under the shadow as the sun broke)
  float wq = dot(p.xz, uWetDir), e = (vnoise(p.xz / 75. + 3.1) - .5) * 110. + (vnoise(p.xz / 21. + 8.7) - .5) * 40.;
  float ahead = smoothstep(uShade.x - 75. + e, uShade.x + 75. + e, wq);      // 0 behind the cloud's trailing edge, 1 ahead of it
  float storm = ahead * (1. - smoothstep(uShade.y - 34. + e * .4, uShade.y + 34. + e * .4, wq));
  // the sun patch is the 300 m of land behind the cloud's trailing edge (the design's breadth): it begins at the edge, with the
  // edge's own softness, and ends as softly 300 m behind it; no cumulus shadow crosses it
  float hole = smoothstep(uShade.x - 375. + e, uShade.x - 225. + e, wq) * (1. - ahead);
  return vec2(storm, hole);
}
// the key light's weather: racing cloud shadows, the storm's shadow over the line, the sun patch behind it
float keyAt(vec3 p) {
  vec2 q = p.xz - uSun.xz * (p.y / max(uSun.y, .08));
  float c = vnoise(q / 250. - uWind * (uTime / 250.)) * .62 + vnoise(q / 95. - uWind * (uTime / 80.) + 7.3) * .38;
  float cloud = mix(uShade.z, 1., smoothstep(.40, .60, c));
  vec2 sh = showerAt(p);
  cloud = mix(cloud, 1., max(sh.y * uShade2.x, sh.x * .75));
  float k = cloud * mix(1., uShade.w, sh.x);
  return k * smoothstep(uShade2.y - 14., uShade2.y + 14., p.y);
}
`,$t=`
#include <common>
#include <fog_pars_vertex>
varying vec3 vP;
#ifdef BLOCK
varying vec3 vN;
#endif
#if defined(LAND) || defined(FIN)
attribute vec2 aBake;
varying vec3 vN; varying vec2 vBk;
#endif
#ifdef STRIP
attribute vec2 aSL;
varying vec2 vSL;
#endif
#ifdef WING
attribute vec2 aWL;
varying vec2 vWL;
#endif
#ifdef FIN
attribute vec2 aFin;
varying vec2 vFin;
#endif
void main() {
  #if defined(LAND) || defined(FIN)
  vN = normal; vBk = aBake;
  #endif
  #ifdef WING
  vWL = aWL;
  #endif
  #ifdef FIN
  vFin = aFin;
  #endif
  #ifdef STRIP
  vSL = aSL;
  #endif
  #ifdef BLOCK
  vec4 lp = instanceMatrix * vec4(position, 1.);
  vN = normalize(mat3(instanceMatrix) * normal + vec3(0., 1e-4, 0.));
  #else
  vec4 lp = vec4(position, 1.);
  #endif
  vP = lp.xyz;
  vec4 mvPosition = modelViewMatrix * lp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Jt=`
#include <common>
#include <fog_pars_fragment>
${It}
varying vec3 vP;
#ifdef BLOCK
varying vec3 vN;
#endif
#if defined(LAND) || defined(FIN)
varying vec3 vN; varying vec2 vBk;
#endif
#ifdef STRIP
varying vec2 vSL;
#endif
#ifdef WING
varying vec2 vWL;       // the Wing's wall in its own coordinates: metres along its foot, metres up its face from the toe
#endif
#ifdef FIN
varying vec2 vFin;      // gully coordinate (a rivulet runs where its fraction is one half), 0 on the wall rising to 1 at the outer edge of the shoulder
#endif
#ifdef LAND
// one size of desiccation polygon: x how far this point is from the nearest crack (in cells), y the plate's own number
vec2 crackCell(vec2 q) {
  vec2 ci = floor(q), cf = fract(q);
  float d1 = 9., d2 = 9., pid = 0.;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j));
    vec2 o = vec2(hash21(ci + g), hash21(ci + g + 17.3));
    vec2 r = g + o - cf; float dd = dot(r, r);
    if (dd < d1) { d2 = d1; d1 = dd; pid = o.x; } else if (dd < d2) d2 = dd;
  }
  return vec2(sqrt(d2) - sqrt(d1), pid);
}
#endif
// rills: dark threads down the fall line. Each family keeps one fixed bearing, chosen from eight by the fall line: steered by the
// fall line itself they swirl like wood grain wherever a gully turns the slope.  x: thread, y: slope of the noise across it, zw: that bearing
// (each thread is an open line: the level f = k + 1/2 of a coordinate that only ever grows across the slope. The contours of a
// noise close on themselves, and drew arcs and rings over the rock.)   one family: x thread, y slope across it
vec2 rillFam(vec3 p, vec2 dA) {
  float al = dot(p.xz, dA) * .42, yy = p.y * .11;
  float f = al + (vnoise(vec2(al * .33, yy)) - .5) * 1.2 + (vnoise(vec2(al * .9 + 7., yy * 2.7)) - .5) * .15;
  float w = min(fwidth(f), 1.), id = floor(f), c = fract(f) - .5, ac = abs(c);
  float on = step(.40, hash21(vec2(id, 7.3))) * smoothstep(.30, .52, vnoise(vec2(id * 3.17, yy * .7 + 5.)));      // not every hollow holds one, and each starts and gives out
  float keep = 1. - smoothstep(.10, .30, w);
  float crisp = (1. - smoothstep(.03 + w * .4, .05 + w * 1.5, ac)) * clamp(.07 / max(w, 1e-4), .35, 1.);
  float hollow = 1. - smoothstep(0., .24, ac);
  return vec2((.36 * hollow + .8 * crisp) * on * keep, -clamp(c * 7., -1., 1.) * (1. - smoothstep(.10, .32, ac)) * on * keep * .32);
}
vec4 rills(vec3 p, vec2 sd) {
  float ang = atan(sd.y, sd.x + 1e-5) * 1.2732395, a0 = floor(ang), af = smoothstep(.3, .7, ang - a0);
  vec2 dA = vec2(-sin(a0 * .7853982), cos(a0 * .7853982)), dB = vec2(-sin((a0 + 1.) * .7853982), cos((a0 + 1.) * .7853982));
  vec2 rA = rillFam(p, dA), rB = rillFam(p, dB);
  return vec4(mix(rA, rB, af), mix(dA, dB, af));
}
#ifdef LAND
// a bed table read crisply: at arm's length every texel is a lamina with a sharp contact, not a gradient a hand wide
vec4 strataAt(float tc) {
  float x = tc * ${V}. - .5, i = floor(x), f = x - i, fw = fwidth(x), w = clamp(fw * .7, 1e-3, .5);
  return textureLod(uStrata, vec2((i + .5 + smoothstep(.5 - w, .5 + w, f)) / ${V}., .5), max(0., log2(max(fw, 1e-4))));
}
#endif
void main() {
  #if defined(LAND) || defined(FIN)
  vec2 uv = vec2(.5);
  vec4 t1 = vec4(0., 0., vBk.x, vBk.y);
  vec4 t2 = vec4(0.);
  #else
  vec2 uv = (vP.xz - uRect.xy) * uRect.zw;
  vec4 t1 = texture2D(uBake1, uv);
  vec4 t2 = texture2D(uBake2, uv);
  #endif
  vec3 toCam = uCam - vP;
  float dist = length(toCam) + 1e-3;
  vec3 V = toCam / dist;
  float near = 1. - smoothstep(25., 260., dist);
  float mid = 1. - smoothstep(200., 900., dist);
  #ifdef BLOCK
  vec3 n = normalize(vN);
  float ao = t1.b * (.55 + .45 * smoothstep(-.4, .6, n.y));
  float riv = 0.;
  #elif defined(LAND) || defined(FIN)
  vec3 n = normalize(vN + vec3(0., 1e-4, 0.));
  #ifdef FIN
  {
    // slivers of tread and notch thinner than a pixel take the wall's own facing and an average shade, or they sparkle as dotted lines
    float sgW = sign(dot(vP.xz - uFinA.zw, vec2(uFinA.y, -uFinA.x)));
    float thinK = smoothstep(.3, 1., fwidth(vBk.x) + fwidth(vBk.y)) * (1. - smoothstep(.03, .2, vFin.y));
    n = normalize(mix(n, normalize(vec3(-uFinA.y * sgW, .35, uFinA.x * sgW)), thinK * .85));
    t1.b = mix(t1.b, .8, thinK);
  }
  #endif
  #ifdef FIN
  {
    // from across the mouth of the gap the steps and gullies of a flank are smaller than the eye can sort: lit facet by facet they
    // were a crumple of zigzags. Far off each flank is shaded more nearly as one surface, and its beds carry the picture
    float sgF = sign(dot(vP.xz - uFinA.zw, vec2(uFinA.y, -uFinA.x)));
    float farN = smoothstep(35., 120., dist);
    vec3 nFlat = normalize(mix(vec3(0., 1., 0.), vec3(-uFinA.y * sgF, .35, uFinA.x * sgF), 1. - smoothstep(.03, .30, vFin.y)));
    n = normalize(mix(n, nFlat, mix(.58, .70, smoothstep(.06, .3, vFin.y)) * farN));
  }
  #endif
  float ao = min(t1.b, 1.);
  float riv = 0.;
  #else
  vec3 n = vec3(t1.r * 2. - 1., 0., t1.g * 2. - 1.);
  n.y = sqrt(max(1. - dot(n.xz, n.xz), .03));
  float ao = t1.b;
  vec2 ed = min(uv, 1. - uv) * vec2(1040., 520.);
  if (min(ed.x, ed.y) < 4. + 34. * fbm3(vP.xz * .021)) discard;
  float riv = smoothstep(.20, .55, max(t2.r, texture2D(uBake2, uv, 1.6).r * 1.4 * (1. - near))) * smoothstep(.22, .5, n.y);
  #endif
  vec2 sp = vP.xz + vP.y * vec2(.41, .67);
  float steep = 1. - n.y;
  vec2 sd = n.xz / max(length(n.xz), 1e-3);                 // the fall line, before any detail normal
  // gap coordinates: along the gap toward its mouth, across toward the east fin
  vec2 gq = vP.xz - uFinA.zw;
  float gT = dot(gq, uFinA.xy), gL = dot(gq, vec2(uFinA.y, -uFinA.x));
  vec3 nBed = uNBed;
  float shK = 0., riserS = 1., gul = 0., ledgeSh = 0., kEn = 0.;      // ledgeSh: how far a point lies in the shade of a ledge or a gully wall (it takes the key light off: a blue shadow)
  float veil = 0., wallK = 0., stainK = 0., jDs = 9., jBlk = 0.;
  // bed coordinate, wavy contacts
  #ifdef FIN
  // the flanks of the gap are cut along the strike: their own thinner beds climb the walls diagonally, the same on both sides
  nBed = normalize(vec3(uFinA.x * uFinB.y, uFinB.x, uFinA.y * uFinB.y));
  vec2 wq = vec2(gT, vP.y);
  float bFine = (vnoise(wq * .8) - .5) * .3 * near;
  // master joints cross the gap every few metres: the beds step a hand or two at each (as the built rows do), so no band runs the length of a wall
  float jk = floor(gT / ${Nt.toFixed(1)}), tj0 = (jk + .28 * sin(jk * 2.4)) * ${Nt.toFixed(1)}, tj1 = (jk + 1. + .28 * sin((jk + 1.) * 2.4)) * ${Nt.toFixed(1)};
  float jA0 = ${Zt.toFixed(2)} * sin((jk - 1.) * 1.7), jA1 = ${Zt.toFixed(2)} * sin(jk * 1.7), jA2 = ${Zt.toFixed(2)} * sin((jk + 1.) * 1.7);
  float js0 = smoothstep(tj0 - .7, tj0 + .7, gT), js1 = smoothstep(tj1 - .7, tj1 + .7, gT);
  float jfo = (jA0 + (jA1 - jA0) * js0 + (jA2 - jA1) * js1) * (1. - .85 * smoothstep(26., 64., dist));      // (from across the mouth the beds run on over the joints)
  bool jn = abs(gT - tj0) < abs(gT - tj1);
  jDs = jn ? gT - tj0 : gT - tj1;
  jDs += (vnoise(vec2(vP.y * .8, (jn ? jk : jk + 1.) * 3.1)) - .5) * .7;
  jBlk = gT >= tj1 ? jk + 1. : gT >= tj0 ? jk : jk - 1.;
  float b = (uFinB.x * (vP.y + jfo) + uFinB.y * gT) * uFinB.z + uFinB.w + (vnoise(wq * .07) - .5) * .5 + bFine;
  float bRidge = dot(vP, uNBed) + (vnoise(sp * .07) - .5) * 2.6;
  float bl = b / 6.5;
  bFine /= 6.5;
  {
    // rivulets. ON THE WALL one comes through every gully notch in the rim and runs straight down the wall, jogging at each ledge.
    // ON THE SHOULDER the water runs the way the dip slope falls, down the face toward the gap's mouth: thin red-brown threads a few
    // metres apart, each an open line (the level of a coordinate that only grows across the slope) that wanders a little, starts and
    // gives out, and is held between a pixel and a half and two pixels wide however near or far it lies. (Round 10 drew the
    // shoulder's threads along its built gullies, which run ACROSS the fall line into the gap, three and a half times as wide as the
    // wall's and in a pale colour: straps laid over the beds like a net.)
    wallK = 1. - smoothstep(.03, .42, vFin.y);
    float rs = vFin.x, rwp = fwidth(rs), rc = abs(fract(rs) - .5);
    float braid = (vnoise(vec2(rs * 37., vP.y * .9 - uTime * 1.3)) - .5) * .014;
    float rw = max(.012 + .007 * vnoise(vec2(gT * .4, vP.y * .2)), rwp * 1.1);
    float rivW = (1. - smoothstep(rw * .45, rw, abs(rc + braid))) * step(.25, hash21(vec2(floor(rs), 7.)));
    float rc2 = abs(fract(rs + .41) - .5), rw2 = max(.006, rwp * .9);
    rivW = max(rivW, (1. - smoothstep(rw2 * .45, rw2, abs(rc2 - braid))) * step(.5, hash21(vec2(floor(rs + .41), 3.))) * .85);
    rivW *= clamp(.014 / max(rwp, 1e-5), .3, 1.) * (.55 + .45 * vnoise(vec2(rs * 9., vP.y * .5 - uTime * 2.2))) * smoothstep(.55, .92, wallK);
    float fs = gL / 8.5 + (vnoise(vec2(gT * .043, gL * .05)) - .5) * 1.2 + (vnoise(vec2(gT * .17 + 3., gL * .11)) - .5) * .24;
    float fsw = clamp(fwidth(fs), 1e-4, 1.), sid = floor(fs), scs = abs(fract(fs) - .5);
    float son = step(.20, hash21(vec2(sid, 5.7))) * smoothstep(.26, .44, vnoise(vec2(sid * 3.17, gT * .019 + 2.)));
    float shw = clamp(.014, fsw * 1.05, fsw * 1.4);
    float rivS = (1. - smoothstep(shw * .45, shw, scs)) * son * (1. - smoothstep(.20, .45, fsw)) * clamp(.03 / fsw, .55, 1.)
      * (.80 + .20 * vnoise(vec2(fs * 9., gT * .5 - uTime * 2.2))) * (1. - smoothstep(.55, .92, wallK));
    // nothing of either comes near the lens: a thread thins to nothing as the eye comes within a few metres of the rock it runs on
    riv = max(rivW, rivS) * smoothstep(5., 26., dist);
    stainK = (1. - smoothstep(rw * 1.2, rw * 9., abs(rc + braid * 3.))) * step(.25, hash21(vec2(floor(rs), 7.))) * wallK * smoothstep(5., 26., dist);      // the rock either side of a wall's thread is stained dark by it
    // the falls: a braided veil poured down the wall from a gully notch, stepping over every ledge, widening and tearing toward its foot
    vec4 fq = gL < 0. ? uFallW : uFallE, dv = vec4(rs) - fq;
    float fd = dv.x;
    fd = abs(dv.y) < abs(fd) ? dv.y : fd; fd = abs(dv.z) < abs(fd) ? dv.z : fd; fd = abs(dv.w) < abs(fd) ? dv.w : fd;
    float big = (gL < 0. && abs(dv.z) <= min(abs(dv.x), abs(dv.y))) ? 2.5 : 1.;                 // the third fall of the west fin is the great one
    float low = 1. - smoothstep(2., 34., vP.y), fx = clamp(fd / (mix(.075, .25, low) * big), -1.5, 1.5), fy = vP.y + gT * .35, ft = uTime * 5.2;
    float wdt = .20 + .13 * low;
    float c0 = -.42 + .20 * sin(fy * .31 + 1.), c1 = .04 + .24 * sin(fy * .23 + 2.), c2 = .46 + .18 * sin(fy * .37 + 4.);
    float q0 = (fx - c0) / wdt, q1 = (fx - c1) / (wdt * 1.25), q2 = (fx - c2) / wdt;
    float s0 = vnoise(vec2(fx * 5. + 31., fy * .55 + ft)), s1 = vnoise(vec2(fx * 7. + 7., fy * .8 + ft * 1.2)), s2 = vnoise(vec2(fx * 13. + 3., fy * 1.7 + ft * 1.7));
    float va = exp(-q0 * q0 * 2.2) * (.45 + .55 * s0) + exp(-q1 * q1 * 2.2) * (.55 + .45 * s1) + exp(-q2 * q2 * 2.2) * (.40 + 1.2 * s0 * s1);
    va *= .62 + .6 * s2 * s2;
    float spray = vnoise(vec2(fx * 3.3 + 11., fy * .33 + ft * .6)) * vnoise(vec2(fx * 9. - 5., fy * .9 + ft));
    va = mix(va, va * smoothstep(.08, .40, spray) * 1.6 + .25, low * low);
    float fe = max(1. - fx * fx, 0.);
    veil = clamp(va * 1.15, 0., 1.) * smoothstep(0., .3, fe) * (1. - smoothstep(.04, .22, vFin.y)) * max(step(0., gL), smoothstep(uLand.z - 2.5, uLand.z + 1., vP.y));      // (the east fin's falls stay on their wall all the way down)
  }
  #else
  float bFine = (vnoise(sp * .8) - .5) * .7 * near;
  float b = dot(vP, uNBed) + (vnoise(sp * .07) - .5) * 2.6 + (vnoise(vec2(vP.x * .31, vP.z * .028)) - .5) * 2.0 * (1. - steep) * (1. - steep) + bFine;
  float bl = b;
  #endif
  float fineK = 0., ledgeL = 0., kth = 0., jlL = 0., jtone = 0., wingSh = 0., wingLip = 0., landPart = 0., wingHard = .5, wingTop = 0., wingId = 0.;
  float tc = (b - uBed.x) * uBed.y;
  vec4 st = texture2D(uStrata, vec2(tc, .5));
  #ifdef FIN
  // from across the mouth of the gap a wall is read in beds four times as thick, each running unbroken over the joints: its
  // metre-thick beds, every one of its own colour and stepped at every joint, made a quilt of tiles
  float tcC = ((uFinB.x * vP.y + uFinB.y * gT) * (uFinB.z * .27) + uFinB.w * .27 + 311. + (vnoise(wq * .05) - .5) * .6 - uBed.x) * uBed.y;
  vec4 stC = texture2D(uStrata, vec2(tcC, .5));
  float farC = smoothstep(26., 64., dist);
  st.rgb = mix(st.rgb, stC.rgb, .92 * farC);
  #endif
  float ha = texture2D(uStrata, vec2(tc + 1.3 * uBed.y, .5)).a;
  #ifndef LAND
  #ifndef BLOCK
  // beside the water gap the Ribbon is cut in thinner beds (its shoulders, the fins' noses and the stump east of the gap)
  float kg = (1. - smoothstep(95., 170., abs(gL))) * smoothstep(-70., -10., gT);
  // (their contacts lie nearly straight: a thin bed warped as far as the thick ones are swirls like wood grain)
  float bT = dot(vP, uNBed) * ${ka.toFixed(1)} + (vnoise(sp * .07) - .5) * 1.5;
  float tct = (bT - uBed.x) * uBed.y;
  vec4 stT = texture2D(uStrata, vec2(tct, .5));
  float haT = texture2D(uStrata, vec2(tct + 1.3 * uBed.y, .5)).a;
  #ifndef FIN
  {
    // the stump east of the gap is the Ribbon's own rock, cut through by the water: it keeps the Ribbon's own beds, the same
    // planes and the same thicknesses as the face west of the gap, dipping as they dip there. (Drawn in the shoulders' thin
    // beds every step of it was a tile of its own colour, a quilt; drawn in level beds it was another hill. In its own beds
    // each is thicker than a step, so one bed's colour runs on across every step it crosses)
    float kE = (1. - smoothstep(150., 250., gL)) * smoothstep(-70., -10., gT) * smoothstep(0., 14., gL) * .92;
    float kgT = kg * (1. - kE);
    st = mix(st, stT, kgT); ha = mix(ha, haT, kgT); bl = mix(bl, bT, kgT);
    // (a slate bed or a shale parting of the stump is a grey line between the others, never a black belt across it in the rain)
    st.rgb = mix(st.rgb, max(st.rgb * (1. + .9 * (1. - smoothstep(.10, .30, dot(st.rgb, vec3(.3333))))), vec3(.135, .108, .092)), kE);
    kEn = kE;
  }
  {
    // and at a stone's throw each of those is seen to be made of thinner ones still, every one of its own colour and hardness:
    // no band of the shoulder is left broad and smooth beside the stepped walls under it
    // (only within a stone's throw: further off they are hairlines, and the shoulder reads as wood grain)
    fineK = kg * (1. - smoothstep(22., 64., dist));
    float tcn = (bT * 3.3 + 53. - uBed.x) * uBed.y;
    vec4 stN = texture2D(uStrata, vec2(tcn, .5));
    float haN = texture2D(uStrata, vec2(tcn + 1.3 * uBed.y, .5)).a;
    ledgeL = mix(haT - stT.a, haN - stN.a, fineK) * kg;
    st = mix(st, vec4(mix(st.rgb, stN.rgb, .68), stN.a), fineK * .85);
    ha = mix(ha, haN, fineK * .85);
  }
  #endif
  #endif
  #endif
  #ifdef FIN
  {
    // toward its outer edge the shoulder takes the Ribbon's own thick beds, so that it meets the ridge in the same colour
    // above the rim the shoulder shows the Ribbon's own dip in thin beds (the wall's beds lie parallel to the face there)
    float kt = smoothstep(.10, .20, vFin.y), tcr = (bRidge - uBed.x) * uBed.y;
    st = mix(st, mix(texture2D(uStrata, vec2(tcr, .5)), stT, kg), kt);
    ha = mix(ha, mix(texture2D(uStrata, vec2(tcr + 1.3 * uBed.y, .5)).a, haT, kg), kt);
    bl = mix(bl, mix(bRidge, bT, kg) / 6.5, kt);
    {
      // the east fin's nose is the end of the stump behind it: the Ribbon's own dipping beds, the same planes and thicknesses
      // as the stump's and the face's, run out to it unbroken (drawn in its thin beds every step of it was a tile of its own colour)
      float kE = kt * smoothstep(0., 14., gL) * .92;
      vec4 stE = texture2D(uStrata, vec2(tcr, .5));
      stE.rgb = max(stE.rgb * (1. + .9 * (1. - smoothstep(.10, .30, dot(stE.rgb, vec3(.3333))))), vec3(.135, .108, .092));      // (a slate bed of the nose is a grey parting between the others, never a black belt)
      st = mix(st, stE, kE);
      ha = mix(ha, texture2D(uStrata, vec2(tcr + 1.3 * uBed.y, .5)).a, kE);
      bl = mix(bl, bRidge / 6.5, kE);
      kEn = kE;
    }
    st.rgb = mix(vec3(dot(st.rgb, vec3(.2126, .7152, .0722))), st.rgb, 1. - .26 * wallK);          // brick stays brick under gold light
    // a slab of the shoulder that lies along the beds is the top of one bed: weathered ochre sandstone, mottled, with the
    // colours of the beds showing only as thin stripes where the surface steps across them
    shK = smoothstep(.06, .14, vFin.y) * max(kg, .85);
    // (how squarely the surface cuts its beds, from the smooth normal: measured per triangle it made every facet a tile of one flat colour)
    riserS = mix(mix(1., smoothstep(.20, .52, length(cross(normalize(vN + vec3(0., 1e-4, 0.)), uNBed))), shK), 1., kEn * .8);      // (the nose's beds show in their own colours on every face of it)
    vec3 tread = mix(vec3(.60, .37, .16), uCream, .25) * (.80 + .40 * vnoise(sp * .31 + 2.)) * (.90 + .20 * vnoise(sp * 1.7 + 4.));
    // a dip slope is crossed by the edges of the thin beds under it: straight stripes of their colours, a stride apart, never a broad band
    float cs = vP.y * 2.4 + gT * .33 + (vnoise(sp * .21) - .5) * .5, cw = fwidth(cs);
    float stripe = (1. - smoothstep(.09 + cw * .6, .15 + cw * 1.3, abs(fract(cs) - .5))) * (1. - smoothstep(.12, .3, cw)) * (1. - smoothstep(20., 55., dist));
    tread = mix(tread, texture2D(uStrata, vec2((floor(cs) * 7.3 - uBed.x) * uBed.y, .5)).rgb * .9, stripe * .7);
    {
      // where the shoulder cuts across its beds each is made of thinner ones still, every one of its own colour and hardness: no band is
      // left broad and smooth above the stepped wall
      float nkF = shK * kg * (1. - smoothstep(22., 64., dist));
      float tcn = (bT * 3.3 + 53. - uBed.x) * uBed.y;
      vec4 stN = texture2D(uStrata, vec2(tcn, .5));
      float haN = texture2D(uStrata, vec2(tcn + 1.3 * uBed.y, .5)).a;
      st = mix(st, vec4(mix(st.rgb, stN.rgb, .68), stN.a), nkF * .85);
      ha = mix(ha, haN, nkF * .85);
    }
    st.rgb = mix(tread, st.rgb, .58 + .42 * riserS);
    // and gullied: a dark thread down the fall line every few metres (near: far off the threads and the beds would weave a tartan),
    // and the floor of every built gully in shade
    float gph = vFin.x * 3., gc = abs(fract(gph) - .5), gwp = fwidth(gph);
    gul = (1. - smoothstep(.07 + gwp * .5, .30 + gwp * 1.4, gc)) * shK * (1. - smoothstep(.12, .3, gwp)) * step(.25, hash21(vec2(floor(gph), 2.))) * (1. - smoothstep(30., 90., dist));
    ledgeSh = .62 * (1. - smoothstep(.03, .26, abs(fract(vFin.x) - .5))) * shK * (1. - smoothstep(.3, .7, fwidth(vFin.x))) * (1. - .7 * smoothstep(30., 95., dist));      // (from across the gap's mouth the built gullies are broad hollows, not bands of shade across the beds)
  }
  #endif
  #ifdef LAND
  {
    // away from the Ribbon the land is another limb of the fold: thinner beds on their own dip, their contacts nearly straight, so
    // that the banks, the spur we climb and the crest under the hooves are ruled in colour and never swirled like wood grain
    float inh = min(min(vP.x + 520., 520. - vP.x), min(vP.z + 170., 350. - vP.z));
    kth = 1. - smoothstep(-90., -10., inh);
    // (every bed runs unbroken: blocks slipped at joints kinked the bands sideways in stair-steps, and the joints drew a tartan over them)
    float bS = (dot(vP, uLandBed) + (vnoise(sp * .045) - .5) * .6 + (vnoise(sp * .29) - .5) * .16 + bFine * .05
      + ((vnoise(sp * 1.9 + 3.) - .5) * .20 + (vnoise(sp * 5.3 + 8.) - .5) * .07) * (1. - smoothstep(.10, .30, steep))) * uLand.w;      // (on gentle ground a contact is a ragged edge a stride long, not a ruled stripe drawn out along the slope)
    float tcs = (bS - uBed.x) * uBed.y;
    vec4 stL = strataAt(tcs);
    float haL = texture2D(uStrata, vec2(tcs + 1.3 * uBed.y, .5)).a;
    // a steep face of the land shows each bed split in two or three, every one of its own colour, as far off as the eye can count them
    float stK = (.7 + .3 * smoothstep(.10, .26, steep)) * (1. - smoothstep(260., 520., dist));
    float tcm = (bS * 1.9 + 91. - uBed.x) * uBed.y;
    vec4 stM = strataAt(tcm);
    float haM = texture2D(uStrata, vec2(tcm + 1.3 * uBed.y, .5)).a;
    stL = mix(stL, vec4(mix(stL.rgb, stM.rgb, .8), stM.a), stK);
    haL = mix(haL, haM, stK);
    // and among the reds, creams and ochres a soft slate shale comes round every few beds
    float slb = smoothstep(.62, .67, vnoise(vec2(bS * .16, 5.)));
    stL = mix(stL, vec4(vec3(.17, .20, .28) * (.85 + .3 * vnoise(vec2(bS * 1.3, 9.))), .25), slb * .85);
    // under a low gold sun every bed leans to orange: the dark beds are held darker and the pale ones paler, so that red, cream, ochre and slate still part
    float lL = dot(stL.rgb, vec3(.2126, .7152, .0722));
    stL.rgb = max(mix(vec3(lL), stL.rgb, 1.2), vec3(0.)) * mix(1., min(.5 + 1.6 * lL, 1.3), .65 * stK);
    {
      // the dark shale between the land's beds, at every contact of its thin-bed table: a crisp parting held a pixel and a half wide
      // on every bank and wall that cuts across the beds (and let go where they crowd, or on the level floor)
      float fwW = fwidth(tcm) * ${V}.;
      float pfW = textureLod(uPart, vec2(tcm, .5), max(0., log2(max(fwW, 1e-4)))).r;
      landPart = min(1., pfW * clamp(fwW * 1.5, 1., 4.5)) * (1. - smoothstep(4., 9., fwW)) * kth;
      #ifndef WING
      landPart *= smoothstep(.06, .22, steep);
      #endif
    }
    // within a stone's throw every bed is seen to be made of thinner ones, each of its own colour
    fineK = (1. - smoothstep(14., 70., dist)) * kth;
    float tcf = (bS * 3.4 + 217. - uBed.x) * uBed.y;
    vec4 stF = strataAt(tcf);
    float haF = texture2D(uStrata, vec2(tcf + 1.3 * uBed.y, .5)).a;
    #ifdef WING
    {
      // the Wing is read from across the wash: under every harder bed a band of shade half a metre deep, along its top a lit lip
      float aUp = texture2D(uStrata, vec2(tcm + 4. * uBed.y, .5)).a, aDn = texture2D(uStrata, vec2(tcm - 3. * uBed.y, .5)).a;
      wingSh = smoothstep(.05, .22, aUp - stM.a) * kth; wingLip = smoothstep(.05, .22, stM.a - aDn) * kth;
      // (round 11, for the cut of the wall below: how hard this bed is, whether this is the top hand of a hard bed with a softer one
      // over it, and a number that is the bed's own)
      wingHard = stM.a; wingId = floor(stM.a * 41. + .5);
      wingTop = smoothstep(.05, .22, stM.a - texture2D(uStrata, vec2(tcm + 1.6 * uBed.y, .5)).a) * kth;
    }
    ledgeL = (haL - stL.a) * kth;                            // on the Wing's wall every bed is one clean band with its own ledge: no thinner beds are ruled inside it
    stL = mix(stL, vec4(mix(stL.rgb, stF.rgb, .40), stL.a), fineK);       // (and near at hand each band is seen to be made of thinner beds of its own colours)
    #else
    ledgeL = mix(haL - stL.a, (haF - stF.a) * 1.3, fineK * .7) * kth;       // positive just under a harder bed: its shade; negative on its lip
    stL = mix(stL, vec4(mix(stL.rgb, stF.rgb, .72), stF.a), fineK * .8 * (1. - .45 * stK) * (1. - .7 * slb));
    #endif
    // (the level floor of the basin, seen from a few hundred metres, keeps the Ribbon's own broad beds: the land's thin ones are
    // finer than a pixel there and average to one mud)
    float kthF = kth * (1. - smoothstep(110., 300., dist) * smoothstep(.88, .97, n.y));
    st = mix(st, stL, kthF);
    ha = mix(ha, haL, kthF);
    bl = mix(b, bS, kthF);
    nBed = normalize(mix(uNBed, uLandBed, kth));
  }
  #endif
  vec3 base = st.rgb;
  float riser = 1.;
  float wash = (1. - smoothstep(1.2, 8., vP.y)) * smoothstep(.80, .96, n.y);
  {
    // thin dark partings between the beds, held to a pixel and a half and let go when they crowd
    #ifdef FIN
    float pl = (bl - bFine * .7) * 2.3 + vnoise(vec2(bl * .9, 2.)) * .5;                 // laminae inside the stepped beds (the steps themselves are built)
    float pk = step(.45, hash21(vec2(floor(pl + .5), 3.1))) * (.3 + .4 * hash21(vec2(floor(pl + .5), 8.7)));
    #else
    float pl = (bl - bFine * .75) * .8 + vnoise(vec2(bl * .31, 2.)) * 1.3;
    float pk = (1. - wash) * step(.36, hash21(vec2(floor(pl + .5), 3.1))) * (.5 + .5 * hash21(vec2(floor(pl + .5), 8.7)));
    #endif
    #ifdef FIN
    // a tread or a dip slope is the top of one bed: its partings and laminae would be drawn out across it like the grain of a plank
    riser = mix(1., smoothstep(.3, .8, fwidth(bl) / max(length(fwidth(vP)), 1e-4)), wallK);
    pk *= riser * riserS;
    #endif
    float pw = fwidth(pl), pc = abs(fract(pl + .5) - .5);
    float parting = (1. - smoothstep(.035 + pw * .6, .06 + pw * 1.3, pc)) * (1. - smoothstep(.22, .5, pw)) * pk;
    base *= 1. - .66 * parting;
    #if !defined(LAND) && !defined(FIN) && !defined(BLOCK)
    {
      // from across the basin the face keeps the dark shale between its beds: each parting is held a pixel and a half wide however
      // thin it stands, and let go only where they crowd
      float fwT = fwidth(tc) * ${V}.;
      float pf = textureLod(uPart, vec2(tc, .5), max(0., log2(max(fwT, 1e-4)))).r;
      float partFar = min(1., pf * clamp(fwT * 1.5, 1., 4.5)) * smoothstep(.5, 1.4, fwT) * (1. - smoothstep(4., 9., fwT));
      base *= 1. - .60 * partFar * (1. - kg);
    }
    #endif
    #ifdef LAND
    base *= 1. - .64 * landPart;
    {
      // the thin beds inside each: a dark line at every other contact, and every lamina of its own tone
      float plf = bl * 1.7 + vnoise(vec2(bl * 1.1, 7.)) * .8;
      float pwf = fwidth(plf), pcf = abs(fract(plf + .5) - .5), idf = floor(plf + .5);
      float pkf = (1. - wash) * step(.30, hash21(vec2(idf, 5.3))) * (.45 + .55 * hash21(vec2(idf, 1.7)));
      base *= 1. - .6 * (1. - smoothstep(.04 + pwf * .6, .07 + pwf * 1.3, pcf)) * (1. - smoothstep(.22, .5, pwf)) * pkf * fineK;
      base *= 1. + (hash21(vec2(floor(plf), 9.1)) - .5) * .26 * fineK * (1. - smoothstep(.25, .6, pwf)) * (1. - wash);
    }
    #endif
  }
  // laminae inside the beds, weathering streaks down the fall line, mottling
  #ifdef FIN
  // (no lamina runs unchanged the length of a wall: they swell and pinch out every few metres, or the beds read as planks)
  float lam = vnoise(vec2(bl * 1.4, gT * .33 + 3.3)) * .6 + vnoise(vec2(bl * 5.5, gT * 1.1 + 9.1)) * .4;
  #else
  float lam = vnoise(vec2(bl * 1.4, 3.3)) * .6 + vnoise(vec2(bl * 5.5, 9.1)) * .4;
  #endif
  float jointK = 0.;
  #ifdef FIN
  base *= .80 + .40 * mix(vnoise(sp * 1.1 + 5.) * .6 + vnoise(sp * 3.1) * .4, lam, riser * riserS);      // a wall at arm's length is all laminae, a tread is mottled
  {
    // the joints: a dark crack down each, the rock beside it shaded where the wall is let in, and every block between two of its own tone
    float wj = max(.045, fwidth(gT) * .9);
    float crack = (1. - smoothstep(wj, wj * 2.2, abs(jDs))) * (1. - .75 * smoothstep(50., 150., dist));
    float bh = hash21(vec2(jBlk, 11.));
    base *= (1. + (bh - .5) * .13 * wallK * (1. - smoothstep(50., 150., dist))) * (1. - .6 * crack * wallK) * (1. - .2 * (1. - smoothstep(.15, 1.5, abs(jDs))) * wallK);
    jointK = (bh - .5) * wallK;
  }
  {
    // at a few metres every bed is ruled in fine laminae: crisp thin lines and plates of slightly different tone
    float fl = bl * 6.7 + vnoise(vec2(bl * 1.9, 5.)) * .7, fwl = fwidth(fl), lid = floor(fl + .5), lh = hash21(vec2(lid, 4.7));
    float keepL = 1. - smoothstep(.18, .5, fwl);
    float ln = (1. - smoothstep(.04 + fwl * .6, .08 + fwl * 1.3, abs(fract(fl + .5) - .5))) * step(.3, lh) * (.3 + .5 * lh) * (.3 + .7 * smoothstep(.35, .6, vnoise(vec2(lid * 3.7, gT * .23))));
    float plate = hash21(vec2(floor(fl), 1.3));
    base *= (1. - .55 * ln * keepL * riser * riserS) * (1. + (plate - .5) * .22 * keepL * riser * riserS);
  }
  {
    // at a horse-length a wall is cut stone, not a band drawn out toward the ring: every bed is laid in courses a forearm thick,
    // each course broken by joints into blocks of its own tone, and the sandstone courses are cross-bedded, leaning one way in
    // one course and the other way in the next
    float sc = bl * 1.6 + vnoise(vec2(bl * .7, gT * .11)) * .35, sid = floor(sc), sf = fract(sc), sw = fwidth(sc);
    float hs = hash21(vec2(sid, 2.9)), hs2 = hash21(vec2(sid, 6.1));
    float jx = gT / (.8 + 1.5 * hs) + hs * 31. + (vnoise(vec2(vP.y * 1.3, sid)) - .5) * .22, jw2 = min(fwidth(jx), 1.), jf = fract(jx);
    float keepS = (1. - smoothstep(.14, .42, sw)) * riser * riserS * wallK;
    float keepJ = keepS * (1. - smoothstep(.14, .42, jw2));
    float bedLine = 1. - smoothstep(.015 + sw * .6, .04 + sw * 1.4, min(sf, 1. - sf));
    float crkJ = 1. - smoothstep(.010 + jw2 * .6, .025 + jw2 * 1.4, min(jf, 1. - jf));
    float toneJ = hash21(vec2(floor(jx), sid * 1.7 + 4.));
    base *= (1. - .40 * bedLine * keepS) * (1. - .24 * crkJ * keepJ) * (1. + (toneJ - .5) * .20 * keepJ);      // (the joints are faint and no cross-bed is ruled: drawn strongly a wall read as brickwork under a hatch of thin lines)
    ledgeSh = max(ledgeSh, .35 * bedLine * keepS);
  }
  {
    // on the shoulders every hard bed throws a line of shade on the soft one under it and takes the light on its own lip
    float shk = step(.05, vFin.y) * (1. - smoothstep(180., 420., dist)), shF = smoothstep(30., 95., dist);
    base *= (1. - mix(.22, .34, shF) * shk * smoothstep(.05, .30, ha - st.a)) * (1. + mix(.18, .34, shF) * shk * smoothstep(.05, .30, st.a - ha));
    ledgeSh = max(ledgeSh, mix(.58, .72, shF) * shk * smoothstep(.05, .30, ha - st.a));
  }
  #else
  base *= mix(1., .80 + .40 * lam, .35 + .65 * mid);
  #endif
  #ifdef FIN
  float streak = vnoise(vec2(gT * .5 + vnoise(vec2(gT * .13, vP.y * .2)) * 1.5, vP.y * .2));        // weathering runs down the wall, not along it
  #else
  float streak = vnoise(vec2(vP.x * .55, vP.z * .035 + vP.y * .05));
  #endif
  base *= (.90 + .20 * streak) * (1. - .30 * gul);      // (a gully on the shoulder is a soft hollow of shade, never a hairline)
  #ifdef FIN
  // no facet of a shoulder is left one flat colour: soft hollows with a dark thread down each, a stride or two apart, and broad weathering blotches
  vec4 rlS = rills(vP * 1.1, sd);
  base *= (1. - .26 * shK * rlS.x) * mix(1., .80 + .40 * vnoise(sp * .09 + 7.), shK);
  #endif
  #ifdef FIN
  float softb = (1. - smoothstep(.3, .62, st.a)) * near;
  vec2 rq = vec2(gT * 2.1 + vnoise(vec2(gT * .45, vP.y * .3)) * 1.6, vP.y * .13);
  float rl0 = vnoise(rq), rl1 = vnoise(rq + vec2(.3, 0.));
  base *= 1. - .30 * softb * smoothstep(.48, .78, rl0);                  // soft beds weather into rills down the fall line
  #endif
  base *= .93 + .14 * vnoise(sp * 1.9);
  base *= .84 + .32 * fbm3(sp * .013 + 4.);
  #if !defined(LAND) && !defined(FIN) && !defined(BLOCK)
  // the Ribbon's own slope close beside us is weathered rock, not a band of colour drawn out along it: pitted and mottled at arm's length
  // (the broad mottle carries to the far side of the gap, where the shoulders are seen a hundred metres off down the drop; the pitting only close by)
  base *= 1. + (vnoise(sp * 2.9 + 3.) - .5) * .30 * (1. - smoothstep(50., 150., dist)) + (vnoise(sp * 8.3 + 1.) - .5) * .20 * (1. - smoothstep(25., 80., dist))
    + (vnoise(sp * .9 + 6.) - .5) * .22 * (1. - smoothstep(110., 260., dist));
  #endif
  vec2 wt = wetAt(vP);
  float wet = wt.x;
  float washK = wash * .85, rivF = 0.;
  #ifdef LAND
  {
    // far off, the soaked floor of the basin is not one pale sheet of wash sand: the beds it is cut across show through it as broad
    // bands of their own colour, and behind the line red-brown threads run over it. (A thread is an open line, the level of a
    // coordinate that only grows across the flow: it wanders, braids with its neighbour and gives out, and is drawn a pixel and a
    // half wide however far off it lies.)
    float farF = smoothstep(60., 210., dist) * smoothstep(.86, .97, n.y);
    washK *= 1. - .64 * wet * farF;
    vec2 fdr = vec2(.3396, .9406);
    float al = dot(vP.xz, fdr), ac = dot(vP.xz, vec2(fdr.y, -fdr.x));
    float fr0 = ac / 31. + (vnoise(vec2(al / 85., ac / 120.)) - .5) * 2.6 + (vnoise(vec2(al / 19. + 3., ac / 47.)) - .5) * .42;
    float fwr = min(fwidth(fr0), 1.), rid = floor(fr0), rc = abs(fract(fr0) - .5);
    float ron = step(.26, hash21(vec2(rid, 4.1))) * smoothstep(.30, .50, vnoise(vec2(rid * 3.17, al / 140. + 2.)));
    float rhw = max(.026 + .022 * vnoise(vec2(al / 30., rid * 1.7)), fwr * .8);
    rivF = (1. - smoothstep(rhw * .55, rhw * 1.15, rc)) * ron * (1. - smoothstep(.22, .55, fwr)) * clamp(.045 / max(rhw, 1e-4), .4, 1.)
      * smoothstep(.88, .97, n.y) * smoothstep(40., 110., dist) * (1. - smoothstep(5., 14., vP.y));
  }
  #endif
  base = mix(base, uWash * (.85 + .3 * vnoise(vP.xz * .21)), washK);
  // detail normal: cracked crust and rills near, bedding micro-ledges
  vec2 dp = vP.xz * .9 + vP.y * .43;
  float e0 = vnoise(dp), ex = vnoise(dp + vec2(.35, 0.)), ez = vnoise(dp + vec2(0., .35));
  vec2 dq = vP.xz * vec2(.33, .08);
  float f0 = vnoise(dq), fx = vnoise(dq + vec2(.3, 0.));
  float near2 = 1. - smoothstep(6., 55., dist);
  vec2 gp = sp * 3.3;
  float g0 = vnoise(gp), gx = vnoise(gp + vec2(.4, 0.)), gz = vnoise(gp + vec2(0., .4));
  base *= 1. + (g0 - .5) * .22 * near2;
  #ifdef FIN
  base *= 1. - .2 * smoothstep(.58, .8, vnoise(sp * 6.1 + 3.)) * near2 * wallK;      // pitted, at arm's length
  #endif
  n.xz += (vec2(ex, ez) - e0) * (.55 * near) + vec2(fx - f0, 0.) * (.38 * mid * (1. - n.y * n.y)) + (vec2(gx, gz) - g0) * (.5 * near2);
  n += nBed * ((lam - .5) * .5 * near + (st.a - .5) * .12 + (st.a - ha) * (.35 + 1.5 * steep) * mid);
  #ifdef FIN
  float farS = smoothstep(30., 95., dist) * shK;          // a shoulder seen from across the mouth of the gap
  n.xz += (vec2(vnoise(sp * .37 + 1.7), vnoise(sp * .37 + 9.3)) - .5) * (.55 * shK * (1. - .8 * farS)) + (vec2(vnoise(sp * 1.3 + 4.1), vnoise(sp * 1.3 + 7.7)) - .5) * (.35 * shK * near);
  // from there it is a stepped hill: every hard bed a riser that stands up to the light, every soft one a tread lying back under the sky
  // (the lumps of a slab at arm's length are let go: lit lump by lump the hill was a crumple)
  n = normalize(n + (vec3(sd.x, 0., sd.y) * .75 - vec3(0., .45, 0.)) * ((st.a - .5) * 1.1 * farS));
  base *= 1. - .22 * shK * smoothstep(.55, .8, vnoise(sp * 2.3 + 6.)) * near;
  n += vec3(uFinA.x, 0., uFinA.y) * ((rl1 - rl0) * 1.6 * softb + jointK * .22) + vec3(rlS.z, 0., rlS.w) * (rlS.y * 1.3 * shK);
  #endif
  n = normalize(n);
  float pud = 0., gmul = 1., pebK = 0., gapK = 0., printK = 0., damp = 0., crk2ring = 1., plateG = 1.;
  #ifdef LAND
  {
    gapK = (1. - smoothstep(uFinC.y - 16., uFinC.y + 14., gT)) * (1. - smoothstep(uFinC.x + 4., uFinC.x + 9., abs(gL))) * step(-260., gT);
    // the ground at the lens: cracked popcorn crust on the flats, a lag of dark varnished pebbles, drift lines in the wash
    float flatg = smoothstep(.84, .97, n.y);
    float fine = 1. - smoothstep(6., 46., dist);
    vec2 cq = vP.xz * 3.1 + vec2(vnoise(vP.xz * 1.3), vnoise(vP.zx * 1.3 + 3.)) * 1.1;
    // metres a pixel covers on the ground: the mean of its long and its short side. (Judged by the long side alone, everything drawn
    // on the ground was let go a few strides ahead of the hooves, and the crest ran on bare and smooth)
    vec2 gdx = dFdx(vP.xz), gdy = dFdy(vP.xz);
    float fpa = length(gdx), fpb = length(gdy), fwc = sqrt(max(fpa, fpb) * min(fpa, fpb) + 1e-9);
    float keepP = 1. - smoothstep(.035, .12, fwc), keepH = 1. - smoothstep(.10, .34, fwc);
    // the clay cracks in polygons of three sizes (a hand, a stride, a horse-length): each is drawn as wide as a pixel needs and let
    // go only where its own cracks crowd, so the cracks that run away from us still rule the ground far ahead of the hooves
    vec2 wq2 = vec2(vnoise(vP.xz * 1.3), vnoise(vP.zx * 1.3 + 3.));
    vec2 wq3 = vec2(vnoise(vP.xz * .45 + 1.), vnoise(vP.zx * .45 + 5.));          // a slow bend only: clay breaks in straight-sided plates
    vec2 c1 = crackCell(cq), c2 = crackCell(vP.xz * .78 + wq3 * .55 + 7.);
    float f1 = fwc * 3.1, f2 = fwc * .78, f3 = fwc * .23;
    float keepC = 1. - smoothstep(.22, .6, f1), keep2 = 1. - smoothstep(.11, .32, f2), keep3 = 1. - smoothstep(.20, .55, f3);      // (a stride-sized plate is let go while it is still four pixels across: beyond that its cracks would be lone thin arcs on the ground)
    float crk = 1. - (1. - smoothstep(.035, .06 + f1 * 1.1, c1.x)) * clamp(.12 / (f1 + 1e-4), .3, 1.), pid = c1.y;      // (crisp, like the larger plates: drawn as a soft dark band it was a blurred net)
    // a crack keeps its own width; where a pixel is wider than the crack the line thins to grey instead of swelling into a black band
    float crk2 = 1. - (1. - smoothstep(.028, .043 + f2 * 1.1, c2.x)) * clamp(.10 / (f2 + 1e-4), .30, 1.);
    float crk3 = 1.;                                             // (the horse-length polygons drew thin dark arcs across whole slopes: no line is drawn for them any more)
    float crust = flatg * (1. - wash) * fine * (1. - gapK);
    float clay = flatg * max(1. - wash, gapK) * (1. - smoothstep(30., 120., dist));
    base = mix(base, mix(base, uCream, .10) * (.9 + .2 * vnoise(vP.xz * .9 + 31.)), crust);
    gmul *= mix(1., (.52 + .48 * crk) * (.86 + .28 * pid), max(crust, gapK * flatg * fine * .8) * keepC);
    float cdk = mix(.50, .34, gapK);
    gmul *= mix(1., (cdk + (1. - cdk) * crk2) * (.84 + .32 * c2.y + .22 * gapK * (c2.y - .5)) * (1. + .12 * (1. - smoothstep(.08, .32, c2.x))), clay * keep2);       // plates curl: a pale lip beside each crack
    crk2ring = mix(1., crk2 * crk3, clay);
    // every plate dries at its own pace: some shine with the sky, their neighbours are already matt, and no crack shines at all
    plateG = mix(1., (.12 + .88 * smoothstep(.35, .65, c2.y)) * crk2, clay * keep2);
    float drift = vnoise(vec2(dot(vP.xz, vec2(.28, .12)), dot(vP.xz, vec2(-1.3, 3.1))));
    base *= 1. + (drift - .5) * .3 * wash * (1. - smoothstep(10., 90., dist));
    float flush = uLand.x * max(wash, flatg * .35) * smoothstep(.34, .62, fbm3(vP.xz * .03 + 9.));
    base = mix(base, vec3(.17, .26, .10) * (.7 + .6 * vnoise(vP.xz * .55)), flush * .8);
    float patchy = .30 + .70 * vnoise(vP.xz * .4 + 5.);
    // the lag gathers along the strike of the beds: bands of dark gravel cross the crest as striped scree
    float lagB = .45 + .55 * smoothstep(.35, .65, vnoise(vec2(bl * 1.9, 4.2)));
    pebK = max(smoothstep(.74, .82, vnoise(vP.xz * 7.3 + 2.)) * keepP, smoothstep(.80, .86, vnoise(vP.xz * 2.9 + 9.)) * keepC * .8) * flatg * fine * patchy * lagB * (1. - .5 * gapK);
    n = normalize(n + vec3(1., 0., 1.) * ((crk - .7) * .16 * crust + (crk2 - .8) * .22 * clay * keep2));
    #ifdef STRIP
    {
      // hoof prints and churned trails where the herd runs
      float lane = 1. - smoothstep(8., 15., abs(vSL.y));
      vec2 hq = vec2(vSL.y * 1.7, vSL.x * 1.05), hi = floor(hq);
      vec2 hc = (fract(hq) - vec2(.28 + .44 * hash21(hi + 9.1), .28 + .44 * hash21(hi + 5.3))) / vec2(1.7, 1.05);
      float rr = length(hc * vec2(1., .82));
      float hk = step(hash21(hi + 3.7), lane * .52) * keepH * fine * flatg;
      rr *= .8 + .5 * hash21(hi + 1.9);
      printK = (1. - smoothstep(.06, .10, rr)) * hk;
      float rim = smoothstep(.09, .12, rr) * (1. - smoothstep(.12, .17, rr)) * hk;
      float trail = smoothstep(.42, .7, vnoise(vec2(vSL.y * 1.2, vSL.x * .3))) * lane * flatg * (1. - smoothstep(14., 40., dist));      // (short scuffs, close by: drawn 30 m long they were streaks stretched along the slope)
      gmul *= (1. - .5 * printK) * (1. + .14 * rim) * (1. - .10 * trail);
      n = normalize(n + vec3(hc.x, 0., hc.y) * (printK * 1.7));
    }
    #endif
    // puddles lie in the hollows of the big polygons, with a sharp shore and a dark damp margin
    // (standing water only round us, within about a hundred metres, and gathered in the lower hollows as a few pools of unequal
    // size: drawn to the horizon at one size the pools were a field of dark dashes over the whole basin)
    float pfar = 1. - smoothstep(52., 112., dist);
    float plf = vnoise(vP.xz * .13 + 3.7), pgate = mix(smoothstep(.47, .60, plf), 1., gapK);       // (pools gather where the floor lies lowest: a few, of unequal size, with a wavering shore)
    float pn = vnoise(vP.xz * .42 + 11.) + (c2.y - .5) * .10 * clay - .07 * gapK + ((plf - .5) * .07 + (vnoise(vP.xz * 1.9 + 5.) - .5) * .03) * (1. - gapK);
    pud = smoothstep(.672, .70, pn) * smoothstep(.93, .985, n.y) * (1. - uBed.z) * pfar * pgate;
    damp = smoothstep(.60, .672, pn) * flatg * pfar * pgate;
  }
  #endif
  #ifdef LAND
  {
    // rills down the fall line of every gentle slope of the land (never the Ribbon: its baked normals are too coarse to steer them)
    // (slopes only: on the flats the fall line wanders, and the threads swung round into arcs across the crest)
    float rk = smoothstep(.10, .30, steep) * (1. - smoothstep(.5, .72, steep)) * (1. - smoothstep(80., 420., dist));
    #ifdef WING
    rk = 0.;
    #endif
    vec4 rl = rills(vP, sd);
    base *= 1. - rk * .50 * rl.x;
    n = normalize(n + vec3(rl.z, 0., rl.w) * (rl.y * 1.5 * rk));
  }
  #endif
  #if !defined(LAND) && !defined(FIN) && !defined(BLOCK)
  {
    // the shoulders of the gap at a stone's throw: a line of shade under every hard thin bed, light on its lip, a gully thread every few metres
    vec4 rl = rills(vP, sd);
    float rk = fineK * smoothstep(.08, .30, steep);
    float lkR = kg * (1. - smoothstep(120., 380., dist));
    base *= (1. - .30 * lkR * smoothstep(.04, .24, ledgeL)) * (1. + .24 * lkR * smoothstep(.04, .24, -ledgeL)) * (1. - rk * .50 * rl.x);
    ledgeSh = .60 * lkR * smoothstep(.04, .24, ledgeL) * smoothstep(.08, .30, steep);
    n = normalize(n + vec3(rl.z, 0., rl.w) * (rl.y * 1.2 * rk));
  }
  #endif
  float relief = clamp((st.a - ha) * 2.2, -1., 1.) * steep * mid * (1. - .72 * kEn);      // (under the lip of a bed of the stump and of the nose the shade is a soft line: drawn at full depth it was a ruled black one from end to end)
  float joint = smoothstep(.60, .72, vnoise(vec2((vP.x + vP.z) * .8, vP.y * .05))) * smoothstep(.45, .8, steep) * mid;
  base *= (1. + relief * .9) * (1. - .14 * joint);      // (faint: drawn dark, these streaks crossed the beds of the gap's shoulders as a hatch of hairlines)
  #ifdef LAND
  {
    // every harder bed of the land stands a hand proud of the one under it: a line of shade below its lip, light on the lip itself
    float lk = (1. - smoothstep(90., 300., dist)) * (1. - wash) * (1. - gapK);
    #ifdef WING
    lk = 1. - smoothstep(240., 520., dist);                  // the Wing's ledges are read from across the wash
    base = mix(base, base * vec3(.66, .84, 1.24), .85 * lk * wingSh) * (1. - .20 * lk * wingSh) * (1. + .40 * lk * wingLip);
    ledgeSh = max(ledgeSh, .9 * lk * wingSh * smoothstep(.05, .22, steep));
    {
      // THE WALL IS CUT ROCK, not painted cloth. Every hard bed stands proud as a ledge: its face is a riser turned up to the low
      // sun, its top hand a lit lip, and the soft bed under it lies back in its shade (above); the hard beds are broken by joints
      // into blocks a stride or two long, each of its own tone. All of it in the wall's own coordinates (metres along its foot,
      // the bed's own number), so nothing is drawn out down the dip
      float hk = smoothstep(.38, .62, wingHard);
      n = normalize(n + (vec3(sd.x, 0., sd.y) * .8 - vec3(0., .5, 0.)) * ((wingHard - .5) * 1.5 * lk * kth));
      base *= (1. + .55 * lk * wingTop) * mix(.87, 1.07, hk);
      float jx = vWL.x / (1.7 + 2.6 * hash21(vec2(wingId, 3.3))) + hash21(vec2(wingId, 9.1)) * 23. + (vnoise(vec2(vWL.y * .9, wingId)) - .5) * .25;
      float jw = min(fwidth(jx), 1.), jf = fract(jx), jc = min(jf, 1. - jf), jkeep = (1. - smoothstep(.15, .45, jw)) * hk * lk * kth;
      float crackJ = (1. - smoothstep(.012 + jw * .6, .03 + jw * 1.4, jc)) * jkeep;
      base *= (1. - .5 * crackJ) * (1. + (hash21(vec2(floor(jx), wingId * 1.7 + 4.)) - .5) * .18 * jkeep);
    }
    {
      // and the wall is gullied: every fifteen to twenty metres along its foot a cleft two to three metres wide runs down the face,
      // one side of it turned to the sun and the other away, its floor in shade (in the wall's own metres; it wanders a little
      // as it comes down, and the seam of the count lies midway between two clefts, where nothing is drawn)
      float gq = vWL.x / 17.5 + (vnoise(vec2(vWL.y * .06, 3.)) - .5) * .22 + (vnoise(vec2(vWL.y * .31, 7.)) - .5) * .05;
      float gcl = fract(gq) - .5, gwd = .055 + .05 * hash21(vec2(floor(gq), 6.1));
      float ga = clamp(gcl / gwd, -1., 1.), gin = (1. - smoothstep(.45, 1., abs(ga))) * lk * kth * smoothstep(1., 5., vWL.y);
      n = normalize(n + vec3(sd.y, 0., -sd.x) * (sin(ga * 3.1416) * .85 * gin));
      float gfl = (1. - smoothstep(0., .55, abs(ga))) * gin;
      base *= 1. - .22 * gfl;
      ledgeSh = max(ledgeSh, .78 * gfl);
    }
    {
      // at a stone's throw the wall is weathered clay and not silk. Three things, all in the wall's own coordinates and each let go
      // where a pixel grows wider than it: the wall is fluted by rain into soft runnels down the fall line, half a metre apart,
      // each with a lit and a shaded side (shading, never a drawn line: hairlines over the beds read as a net laid on the picture);
      // a crumbled crust of clods two hands across, each of its own tone; and the grain of the clay itself. The beds keep their
      // colours and their clean edges
      vec2 wf = fwidth(vWL);
      float wpx = max(wf.x, wf.y);
      float gk = 1. - smoothstep(40., 160., dist);
      // (round 11: the runnels are cut in the SOFT beds only, each bed's its own and none longer than the bed is thick: run from the
      // crest to the toe across every bed, a hand apart and nine metres long, they were a grain drawn out down the dip)
      vec2 rq = vec2(vWL.x * 1.7 + wingId * 3.7 + (vnoise(vWL * vec2(.23, .15)) - .5) * 1.6, vWL.y * .36);
      float rfade = gk * (1. - smoothstep(.22, .60, wf.x * 1.7)) * (.35 + .65 * smoothstep(.30, .60, vnoise(vWL * vec2(.05, .07) + 13.))) * (1. - smoothstep(.38, .62, wingHard));
      float r0 = vnoise(rq) + .45 * vnoise(rq * vec2(2.3, 1.7) + 5.), r1 = vnoise(rq + vec2(.22, 0.)) + .45 * vnoise((rq + vec2(.22, 0.)) * vec2(2.3, 1.7) + 5.);
      float flute = clamp((r1 - r0) * 4.2, -1., 1.) * rfade;      // the slope across a runnel: one side turned to the light
      float hollow = (1. - smoothstep(.25, .55, r0 / 1.45)) * rfade;      // and its floor a little darker and damper
      vec2 cc = crackCell(vWL * vec2(2.3, 1.9) + 3.);
      float ck = gk * (1. - smoothstep(.10, .34, wpx * 2.3));
      float grn = (vnoise(vWL * 11.) - .5) * (1. - smoothstep(.04, .10, wpx)) + (vnoise(vWL * vec2(1.1, .7) + 9.) - .5) * .8;
      base *= (1. + .26 * flute) * (1. - .16 * hollow) * mix(1., .93 + .14 * cc.y, ck) * (1. + .12 * grn * gk);
      n = normalize(n + vec3(sd.y, 0., -sd.x) * (flute * .5));
    }
    #else
    base *= (1. - .30 * lk * smoothstep(.04, .24, ledgeL)) * (1. + .26 * lk * smoothstep(.04, .24, -ledgeL));
    ledgeSh = max(ledgeSh, .62 * lk * smoothstep(.04, .24, ledgeL) * smoothstep(.05, .22, steep));
    #endif
  }
  #endif
  // weather
  float kW = keyAt(vP);
  float key = kW * t1.a;
  #ifdef FIN
  key = mix(kW, 1., .75) * t1.a;
  #endif
  key *= 1. - ledgeSh;
  #ifdef SHADOWPASS
  key = 0.;
  #endif
  pud *= smoothstep(20., 80., wt.y) * uLand.y;
  damp *= smoothstep(20., 80., wt.y) * uLand.y * (1. - pud);
  float reveal = smoothstep(105., 135., wt.y);
  float run = riv * reveal;
  // dry is ONE state, the same at every moment of the flight: each bed in its own pastel (brick, ochre, cream, sage, slate), lifted
  // toward chalk but with its dark partings kept. wet: the same bed, darker and far more saturated
  float lum = dot(base, vec3(.2126, .7152, .0722));
  float lumK = smoothstep(.015, .09, lum);
  vec3 dry = mix(max(mix(vec3(lum), base, 1.22), vec3(0.)), uCream, .08 + .40 * lumK);
  #if !defined(LAND) && !defined(FIN) && !defined(BLOCK)
  {
    // the far face: the chalk it is lifted toward is nearly white (a yellow chalk turned every bed tan), and each bed keeps more of its own hue
    vec3 chalkC = mix(uCream, vec3(dot(uCream, vec3(.2126, .7152, .0722))) * 1.03, .46);
    dry = mix(max(mix(vec3(lum), base, 1.52), vec3(0.)), chalkC, .05 + .37 * lumK);
  }
  #endif
  // wet rock is darker and deeper in colour, but never past brick, ochre, sage and slate
  // (ONE state, the same under the cloud and in the sun: a soaked bed is no deeper for standing in shadow. Under the cloud the
  // grey light leaves it dim and cool; behind the cloud's edge the same colour stands in the warm key, brighter and deeper)
  vec3 wetc = capSat(max(mix(vec3(lum), base, 1.33), vec3(0.)) * .64, .70);
  #ifdef LAND
  wetc = capSat(max(mix(vec3(lum), base, 1.22), vec3(0.)) * .70, .59);        // the ground under the hooves keeps a quieter colour than the Ribbon
  dry = mix(max(mix(vec3(lum), base, 1.30), vec3(0.)), uCream, .05 + .24 * lumK);      // and the land is bolder than the far face: its colour is there from the first stride
  {
    // within a stone's throw the wetted crust is the mud of the beds it lies on: brick, and sage in the hollows
    float fk = smoothstep(.84, .97, n.y) * (1. - smoothstep(50., 150., dist));
    vec3 bs = mix(vec3(.31, .105, .068), vec3(.165, .205, .125), smoothstep(.50, .66, vnoise(vP.xz * .085 + 4.)));
    float fresh = 1. - smoothstep(40., 140., wt.y);          // just behind the line the crust is at its darkest and deepest; the sheen comes later
    wetc = mix(wetc, bs * mix(.8 + lum, .62 + .7 * lum, fresh), mix(.36, .72, fresh) * fk);
  }
  #endif
  #ifdef FIN
  wetc = mix(capSat(wetc, .74), capSat(base * .56, .56), wallK);
  #endif
  vec3 alb = mix(dry, wetc, wet);
  #ifdef LAND
  // churned wet mud between the fins; pebbles and crust cracks keep their own darkness in the dry state
  // (wet clay the colour of the beds it was washed from: brick-brown plates, each of its own tone, sage and ochre silt in the hollows)
  vec3 mudc = mix(vec3(.215, .112, .070), mix(vec3(.20, .13, .06), vec3(.12, .13, .10), smoothstep(.4, .6, vnoise(vP.xz * .11 + 2.))), smoothstep(.52, .70, vnoise(vP.xz * .19 + 8.)) * .7);
  alb = mix(alb, mudc * (.88 + .12 * vnoise(vP.xz * .35 + 5.) + .2 * vnoise(vP.xz * 2.3)) * (1. + (vnoise(vP.xz * 8.) - .5) * .7 * near2 * near2), gapK * smoothstep(.8, .95, n.y));
  alb *= gmul * (1. - .32 * damp);
  alb = mix(alb, vec3(.075, .062, .055) * (1. + 1.2 * vnoise(vP.xz * 23.)), pebK * .82);
  #endif
  alb = mix(alb, vec3(dot(alb, vec3(.3333))) * vec3(.80, .90, 1.12), .5 * uFinC.w);       // moonlight keeps little of the colour
  float flow = .55 + .45 * sin(vP.y * 1.7 + vnoise(vP.xz * .6) * 9. + uTime * 7.);
  #ifdef FIN
  alb *= 1. - .28 * stainK * reveal;
  alb = mix(alb, uMud * (mix(.44, .50, wallK) + .20 * flow), run * .92);           // a rivulet is a dark wet thread of the red mud it carries, darker than any bed it crosses
  alb = mix(alb, mix(uMud * 2.1, vec3(.88, .89, .87), clamp(.5 + .7 * veil, 0., 1.)), veil * reveal);
  #else
  alb = mix(alb, alb * .42 + uMud * (.22 + .12 * flow), run * .85);        // on the face a rivulet is the rock's own colour, darker and redder
  #endif
  #ifdef LAND
  float runF = rivF * reveal * (1. - uBed.z);
  alb = mix(alb, uMud * (.44 + .13 * vnoise(vP.xz * .7 + vec2(0., uTime * .6))), runF * .86);      // the threads on the flats carry the red mud of the beds
  #endif
  // snow squall: the line rules every upward ledge in white
  float snow = uBed.z * smoothstep(-.7, .7, wt.y) * smoothstep(.80, .93, n.y + (st.a - .5) * .12) * (1. - run);
  alb = mix(alb, vec3(.80, .84, .90), snow);
  float gloss = max(wet * (1. - snow) * (.35 + .65 * st.a), run) * (1. - veil);
  #ifdef LAND
  gloss *= (.4 + .6 * max(gapK, printK * wet)) * plateG * (1. - .45 * gapK);
  gloss = max(gloss, runF * .34);
  #endif
  // light
  float ndl = max(dot(n, uSun), 0.);
  float wrap = max(dot(n, uSun) * .5 + .5, 0.);
  vec3 sunc = uSunCol;
  vec3 sky = uSkyCol * (.30 + .70 * (n.y * .5 + .5)) * ao;
  vec3 bounce = uBounce * (1. - n.y) * (.35 + .65 * key) * ao * wrap;
  #if !defined(LAND) && !defined(FIN) && !defined(BLOCK)
  float dryK = (1. - wet) * (1. - uFinC.w) * (1. - snow);
  // the dry face in the low sun: a flute's sunward side is the SAME bed, lighter (the key is rounded off, so no wall of a flute goes
  // out to a pale wedge), the light on it is whiter than the sun itself (a deep orange sun turned brick, ochre and sage into one
  // tan), and the shadow in every flute is the slate-blue of the sky, not the brown of the wall opposite
  ndl = mix(ndl, .60 * (1. - exp(-2.5 * ndl)), dryK);
  sunc = mix(sunc, vec3(dot(sunc, vec3(.2126, .7152, .0722))) * vec3(1.03, 1., .95), .60 * dryK) * mix(1., .50, dryK);
  // (the face looks away from the low sun: most of it stands in open shade. That shade is bright and nearly white, so brick is
  // brick and sage is sage in it; only deep in a flute does it go to slate-blue)
  float fluteSh = (1. - key) * dryK, deepSh = fluteSh * (1. - smoothstep(.40, .85, ao));
  sky = mix(sky, vec3(dot(sky, vec3(.3333))) * vec3(.95, .98, 1.07), .75 * dryK) * (1. + .85 * dryK);
  sky = mix(sky, vec3(dot(sky, vec3(.3333))) * vec3(.60, .84, 1.30), .70 * deepSh);
  alb = mix(alb, vec3(dot(alb, vec3(.3333))) * vec3(.66, .86, 1.24), .40 * deepSh);
  // in a wet flute the shaded wall shines with the light of the sunlit wall opposite: the soaked bands blaze in the sun patch
  bounce += uSunCol * vec3(1., .80, .58) * (mix(.025, .15, wet) * kW * (1. - t1.a) * ao * (1. - uFinC.w));
  #endif
  #ifdef FIN
  {
    // open shade between the fins: more sky, and warm light thrown back by the sunlit wall opposite
    float away = (1. - smoothstep(-.15, .25, dot(normalize(vec3(-uFinA.y, .35, uFinA.x) * vec3(sign(gL), 1., sign(gL))), uSun))) * wallK;      // one answer for a whole wall
    alb = mix(alb, vec3(dot(alb, vec3(.3333))) * vec3(.56, .80, 1.30), .64 * away * (1. - uFinC.w));    // the shaded wall cools toward slate-blue but keeps every bed's own colour
    alb = mix(alb, max(mix(vec3(dot(alb, vec3(.3333))), alb, 1.45), vec3(0.)), away * (1. - uFinC.w)) + vec3(.012, .014, .02) * away;
    float up = n.y * .5 + .5;
    sky = mix(sky, uSkyCol * ((.14 + .86 * up * up) * ao * uFinC.z * 1.3), wallK) + uSunCol * vec3(1., .80, .58) * (.085 * ao * away * (1. - uFinC.w));      // treads take the sky, risers much less
    sunc *= mix(vec3(1.), vec3(.97, .86, .70), (1. - uFinC.w) * wallK);                                              // and the lit one to gold
    sky += uSkyCol * (veil * reveal * .55);
  }
  #endif
  #ifdef LAND
  sky = sky * mix(1., uFinC.z, gapK) * (1. + .30 * wet * (1. - gapK)) + uSunCol * (.10 * gapK * (1. - uFinC.w));      // wet ground under the cloud holds the grey light of the sky: never black
  #endif
  // whatever stands in deep shade is still reached by the glow of the sky and of the lit land around it: a floor under the light, in a
  // warm neutral that keeps each bed's own colour, and none of it where the rock is lit already (it would wash the Ribbon to pastel)
  vec3 irr = sunc * (ndl * key) + sky * (1. + .45 * ledgeSh) + bounce;
  float fillK = 1. - smoothstep(.10, .38, dot(irr, vec3(.3333)));
  #ifdef FIN
  fillK *= 1. - wallK;
  #endif
  #ifdef LAND
  fillK = max(fillK, wet * .8 * (1. - ndl * key)) * (1. - gapK);      // (soaked ground is dark in itself: it takes the glow wherever the sun is off it)
  #endif
  fillK *= (.45 + .55 * ao) * (1. - .6 * uFinC.w);
  // (the glow is thrown by lit land, and under the shower's own cloud no land round a place is lit: there the cloud's grey sky is
  // the one lamp (uSkyCol carries it), and of the glow only the sixth is left that the sunlit land beyond the shadow's edges sends
  // in under it. So the land under the cloud is dim and cool, and what the sun reaches behind the cloud's edge stands out of it)
  fillK *= 1. - .85 * showerAt(vP).x;
  vec3 fillC = dot(uSkyCol, vec3(.3333)) * vec3(.62, .55, .47) + uSkyCol * .25 + uSunCol * vec3(.050, .040, .029);
  #if !defined(LAND) && !defined(FIN) && !defined(BLOCK)
  fillC = mix(fillC, dot(uSkyCol, vec3(.3333)) * vec3(.60, .62, .68) + uSkyCol * .15, .85 * dryK);
  #endif
  irr += fillC * fillK;
  vec3 col = alb * irr;
  vec3 hv = normalize(uSun + V + vec3(0., 1e-3, 0.));
  float ndh = max(dot(n, hv), 1e-4);
  float glk = 1. - smoothstep(60., 240., dist);                 // far off a thread is a dark line; its glints are for the near ones
  float spec = pow(ndh, 42.) * 1.5 + pow(ndh, 200.) * 2.4 * run * smoothstep(.86, .97, flow) * glk;
  float fres = 1. - max(dot(n, V), 0.);
  fres = fres * fres * fres;
  col += uSunCol * (spec * key * gloss * step(1e-3, ndl));
  #ifdef FIN
  col += uSkyCol * ((fres * gloss * .26 + run * (.03 + .10 * smoothstep(mix(.93, .90, wallK), .99, flow))) * ao);        // the thread glints the sky in short dashes
  #else
  col += uSkyCol * ((fres * gloss * .9 + run * (.04 + .45 * smoothstep(.88, .98, flow) * glk)) * ao);
  #endif
  #ifdef LAND
  {
    // puddles on the flats behind the line: sky, rain rings, a low sun glint; between the fins they hold the walls too
    vec2 rq = vP.xz * 1.9, rc = fract(rq) - .5, rid = floor(rq);
    float rl = length(rc), rph = fract(uTime * .8 + hash21(rid) * 7.);            // one drop a cell: its ring widens and dies
    float ring = (1. - smoothstep(.02, .10, abs(rl - .42 * rph))) * (1. - rph) * step(.35, hash21(rid + 3.1)) * uShade2.z * (1. - smoothstep(.015, .05, max(fwidth(vP.x), fwidth(vP.z))));
    vec3 pcol = uSkyCol * (mix(.50, .24, gapK) + .55 * ring + mix(.40, .16, gapK) * fres) + uSunCol * (key * pow(max(dot(normalize(vec3(ring * .04, 1., 0.)), hv), 0.), 90.) * 1.2);
    vec3 R = reflect(-V, normalize(vec3(ring * .03, 1., ring * .02)));
    vec2 acr = vec2(uFinA.y, -uFinA.x);
    float sdr = dot(R.xz, acr);
    float dwl = max(uFinC.x + 1. - gL * sign(sdr), .5);
    float hh = dwl / max(abs(sdr), 1e-3) * max(R.y, 0.);
    float hit = (1. - smoothstep(26., 46., hh)) * gapK;
    float lit = (1. - smoothstep(-.14, .14, sdr * dot(uSun.xz, acr))) * smoothstep(3., 10., hh);
    vec3 wcol = mix(uSkyCol * vec3(.40, .42, .50) * uFinC.z, uSunCol * vec3(.36, .21, .09) + uSkyCol * .2, lit) * (.8 + .4 * vnoise(vec2(gT * .3, hh * .4)));
    pcol = mix(pcol * (1. + .7 * gapK), wcol, hit * .5);
    col = mix(col, pcol * (.5 + .5 * ao), max(pud * (.84 + .14 * fres), gapK * smoothstep(.8, .95, n.y) * (.03 + .14 * fres) * plateG));
  }
  #endif
  #if defined(LAND) || defined(FIN)
  {
    // the exit ring lights the gap: gold on the ledges that face it, and on the wet floor its own image drawn out toward us as a path of glints
    vec3 toR = uRing.xyz - vP; float dR = length(toR) + 1e-3; vec3 Lr = toR / dR;
    float att = uRing.w / (1. + dR * dR / 520.);
    col += alb * uRingB.rgb * (att * (.22 + .78 * max(dot(n, Lr), 0.)));
    #ifdef LAND
    vec3 Rr = reflect(-V, vec3(0., 1., 0.));
    vec2 Rh = Rr.xz / max(length(Rr.xz), 1e-3), Lh = Lr.xz / max(length(Lr.xz), 1e-3);
    float da = Rh.x * Lh.y - Rh.y * Lh.x, sa = uRingB.w / dR * .75 + .03, de = Rr.y - Lr.y;
    float gl = exp(-da * da / (sa * sa) - de * de / .12) * step(0., dot(Rh, Lh));
    float spark = .30 + .70 * smoothstep(.35, .75, vnoise(vP.xz * 4.7 + vec2(uTime * .35, -uTime * .5))) * (.6 + .4 * crk2ring);
    col += uRingB.rgb * (gl * spark * uRing.w * (.55 * pud + (.10 + .30 * gapK) * wet * smoothstep(.85, .97, n.y)));
    #endif
  }
  #endif
  gl_FragColor = vec4(max(col, vec3(0.)), 1.);
  #include <fog_fragment>
}`,Da=`
#include <common>
#include <fog_pars_vertex>
${It}
attribute vec4 aTop;     // xyz of the lip, w = drop height
attribute vec4 aPar;     // width, seed, outward x, outward z
varying vec2 vUv; varying float vKey, vGrow, vSeed, vH;
void main() {
  float y = uv.y;                                   // 0 at the lip, 1 at the foot
  vec3 p = aTop.xyz;
  p.y -= y * aTop.w;
  p.xz += aPar.zw * (y * y * aTop.w * .22 + y * .6);
  vec3 toCam = uCam - p;
  float dist = length(toCam) + 1e-3;
  vec2 side = normalize(vec2(toCam.z, -toCam.x) + vec2(1e-4, 0.));
  float w = max(aPar.x * (.75 + 1.5 * y * y), dist * .0046);            // a veil that spreads into spray toward its foot
  p.xz += side * (position.x * w);
  vec2 wt = wetAt(aTop.xyz);
  vGrow = smoothstep(105., 150., wt.y) * 1.25;       // the fall runs down from its lip
  vKey = keyAt(aTop.xyz) * (1. - step(1.5, aPar.y));
  vUv = vec2(position.x + .5, y); vSeed = fract(aPar.y); vH = aTop.w;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ra=`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uSunCol, uSkyCol, uMud;
uniform float uTime;
varying vec2 vUv; varying float vKey, vGrow, vSeed, vH;
float hash21(vec2 p) { p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash21(i), hash21(i + vec2(1., 0.)), f.x), mix(hash21(i + vec2(0., 1.)), hash21(i + vec2(1., 1.)), f.x), f.y);
}
void main() {
  // a braided veil: three strands that wander and cross, streaked by the falling water, torn into spray over the lower third
  float fall = vUv.y * vH, y = vUv.y, x = vUv.x * 2. - 1.;
  float sp = 4.5 + vSeed * 2.;
  float wdt = .17 + .30 * y;
  float c0 = -.40 + .20 * sin(fall * .31 + vSeed * 6.3), c1 = .04 + .24 * sin(fall * .23 + vSeed * 17. + 2.), c2 = .44 + .18 * sin(fall * .37 + vSeed * 29. + 4.);
  float d0 = (x - c0) / wdt, d1 = (x - c1) / (wdt * 1.25), d2 = (x - c2) / wdt;
  float s0 = vnoise(vec2(x * 5. + vSeed * 31., fall * .55 - uTime * sp)), s1 = vnoise(vec2(x * 7. + vSeed * 7., fall * .8 - uTime * sp * 1.2)), s2 = vnoise(vec2(x * 13. + vSeed * 3., fall * 1.7 - uTime * sp * 1.7));
  float a = exp(-d0 * d0 * 2.2) * (.45 + .55 * s0) + exp(-d1 * d1 * 2.2) * (.55 + .45 * s1) + exp(-d2 * d2 * 2.2) * (.40 + .60 * s0 * s1 * 2.);
  a *= .62 + .55 * s2 * s2;
  float tear = smoothstep(.55, 1., y);                               // the foot breaks up
  float spray = vnoise(vec2(x * 3.3 + vSeed * 11., fall * .33 - uTime * sp * .6)) * vnoise(vec2(x * 9. - vSeed * 5., fall * .9 - uTime * sp));
  a = mix(a, a * smoothstep(.10, .42, spray) * 1.5 + .11 * (1. - x * x), tear);
  float edge = 1. - x * x; edge *= edge;
  a *= smoothstep(0., .035, y) * (1. - smoothstep(.90, 1., y)) * smoothstep(0., .25, edge) * (1. - .45 * tear);
  a *= 1. - smoothstep(vGrow - .12, vGrow, y);
  if (a < .012) discard;
  vec3 col = mix(uMud * 2.0, vec3(.90, .90, .88), clamp(.45 + .5 * s2 + .3 * tear, 0., 1.)) * (uSkyCol * 1.9 + uSunCol * (vKey * .95));
  gl_FragColor = vec4(max(col, vec3(0.)), min(a, .88));
  #include <fog_fragment>
}`,Wa=`
#include <common>
#include <fog_pars_vertex>
${It}
attribute vec4 aPos;     // xyz, w = size
attribute vec4 aPar;     // seed, type (0 fall mist, 1 vapour, 2 dry dust), rise, rate
varying vec2 vUv; varying float vA, vKey, vType;
void main() {
  float life = fract(uTime * aPar.w + aPar.x);
  vec3 p = aPos.xyz;
  vec2 wt = wetAt(p);
  float key = keyAt(p);
  float kind = aPar.y;
  float gate = (kind < .5 || kind > 2.5) ? smoothstep(110., 160., wt.y)
             : kind < 1.5 ? smoothstep(60., 110., wt.y) * smoothstep(.55, .95, key)
             : (1. - wt.x) * (.35 + .65 * key);
  p.y += life * aPar.z;
  p.xz += uWind * (life * aPar.z * ((kind > 1.5 && kind < 2.5) ? .22 : .035)) + vec2(sin(aPar.x * 40. + life * 5.), cos(aPar.x * 27. + life * 4.)) * (aPos.w * .12);
  float size = aPos.w * (.45 + 1.1 * life);
  vA = sin(3.14159 * sqrt(life)) * gate;
  vKey = key; vType = kind; vUv = position.xy * 2.;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  mvPosition.xy += position.xy * size * (vA > .002 ? 1. : 0.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,qa=`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uSunCol, uSkyCol, uCream;
varying vec2 vUv; varying float vA, vKey, vType;
void main() {
  float r = dot(vUv, vUv);
  float a = exp(-r * 4.5) * (1. - smoothstep(.6, 1., r));
  a = a * vA * (vType > 2.5 ? .30 : vType > 1.5 ? .14 : vType > .5 ? .17 : .20);
  if (a < .004) discard;
  vec3 tint = (vType > 1.5 && vType < 2.5) ? uCream * .8 : vec3(.82, .84, .86);
  vec3 col = tint * (uSkyCol * 1.3 + uSunCol * (vKey * (vType > 2.5 ? .12 : (vType > .5 && vType < 2.5) ? .75 : .55)));      // the mist between the fins hangs in their shade
  gl_FragColor = vec4(max(col, vec3(0.)), a);
  #include <fog_fragment>
}`,Ha=`
#include <common>
#include <fog_pars_vertex>
uniform vec2 uWetDir, uVeil; uniform float uFront;
attribute vec2 aLayer;   // metres behind the front, seed
varying vec2 vSt; varying float vSeed; varying vec3 vP;
void main() {
  float w = uFront - aLayer.x + uVeil.x;
  vec2 perp = vec2(-uWetDir.y, uWetDir.x);
  vec3 p = vec3(uWetDir * w + perp * position.x, position.y);
  p = p.xzy;
  p.x += position.y * .16;                         // the rain leans downwind
  vSt = vec2(position.x, position.y); vSeed = aLayer.y; vP = p;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ea=`
#include <common>
#include <fog_pars_fragment>
${It}
varying vec2 vSt; varying float vSeed; varying vec3 vP;
void main() {
  float s = vSt.x, y = vSt.y;
  // the rain falls in shafts with clear air between, each shaft combed into crisp leaning streaks
  // (one slow noise, eased over its whole range: thresholded hard, or with a finer octave on the same lattice, the sheets seen
  // from below broke into columns of round lit blobs. The edge is ragged by a slanted second noise, never stacked on the first)
  float dens = vnoise(vec2(s * .0065 + vSeed * 9., y * .003 + uTime * .01)) * .78 + vnoise(vec2(s * .013 + y * .011 + vSeed * 5., y * .004 - s * .006 - uTime * .013)) * .22;
  dens = smoothstep(.34, .74, dens);
  // (seen from far off or along its own plane a sheet's metre-wide streaks are finer than a pixel: sampled there they beat into
  // columns of round blobs. The streaks are let go as they shrink, and the sheet is then a ragged grey curtain)
  float fs = fwidth(s) * 1.1 + fwidth(y) * .022, sk = 1. - smoothstep(.22, .7, fs);
  float streak = mix(.40, smoothstep(.52, .74, vnoise(vec2(s * 1.1 + vSeed * 50., y * .022 + uTime * 2.1))), sk);
  float fine = mix(.5, vnoise(vec2(s * 2.3 + vSeed * 11., y * .09 + uTime * 5.5)), 1. - smoothstep(.10, .34, fs));
  // ragged virga: not every shaft reaches the ground
  float reach = vnoise(vec2(s * .012 + vSeed * 3., 1.7)) * 150. - 40.;
  float foot = smoothstep(reach - 60., reach + 70., y) * .9 + .1;
  float top = 1. - smoothstep(250., 400., y);
  float sides = 1. - smoothstep(250., 460., abs(s));
  // (a curtain is a thing seen across the basin: within a few hundred metres its sheets would hang over the Ribbon's wet beds as a grey veil)
  vec3 toP = vP - uCam; float dP = length(toP) + 1e-3;
  // (and a sheet is never looked up through from under it: overhead it thins away)
  float a = dens * (.035 + .21 * streak * (.55 + .45 * fine)) * foot * top * sides * max(uShade2.z, uVeil.y) * smoothstep(170., 430., dP) * (1. - smoothstep(.22, .55, toP.y / dP));
  a *= 1. + 1.2 * smoothstep(500., 1100., dP);           // from across the basin the shower is a grey curtain that stands out of the sky: the first frame shows it at the Ribbon's west end
  if (a < .003) discard;
  a *= mix(1., .10, rockBehind(vP, toP / dP));           // against the Ribbon's own rock a sheet thins to almost nothing: no streak reads as passing through the face
  if (a < .003) discard;
  float key = keyAt(vP);
  vec3 col = uSkyCol * .62 + uSunCol * (key * (.03 + .21 * streak * sk));
  gl_FragColor = vec4(max(col, vec3(0.)), min(a, .6));
  #include <fog_fragment>
}`;function bt(v){const L=new n.Color(v);return[L.r,L.g,L.b]}function _a(v,L){const u=[bt(L[0]),bt(L[1]),bt(L[2]).map(C=>C*.74),bt(L[3]),bt(L[4]),bt(L[5])],oe=[.3,.74,.95,.22,.42,.66],ce=[1.5,1.2,.8,.5,.5,.65],Be=bt(L[6]),se=new Uint8Array(V*4),Ke=new Float32Array(V),ot=kt/V;let le=0,Ye=-1,Ae=-1;const Qe=new Uint8Array(V*4),m=(C,j,Ie)=>{const H=C*4;se[H]=Math.round(Math.min(1,j[0])*255),se[H+1]=Math.round(Math.min(1,j[1])*255),se[H+2]=Math.round(Math.min(1,j[2])*255),se[H+3]=Math.round(Ie*255),Ke[C]=Ie};for(;le<V;){let C=0,j=0;do{let $=v()*5.15,B=0;for(;B<5&&$>ce[B];)$-=ce[B],B++;C=B,j++}while((C===Ye||C===Ae)&&j<12);Ae=Ye,Ye=C;const Ie=v.range(6,25)*(C===2?.6:C===3||C===4?.55:1),H=Math.max(3,Math.round(Ie/ot)),ne=u[v.chance(.5)?2:5],b=v.range(0,.3),W=v.range(.84,1.06),Fe=u[C].map(($,B)=>Xe($,ne[B],b)*W),ge=Math.min(1,Math.max(0,oe[C]+v.range(-.1,.1))),Ee=v.range(-.12,.12),_e=v.chance(.6)?v.int(3,5):0,Ve=u[2];for(let $=0;$<H&&le<V;$++,le++){const B=$/H;let P=1+Ee*(B-.5);const E=_e>0&&$>1&&$<H-2&&v()<.55/_e;m(le,Fe.map((Ze,_)=>(E?Xe(Ze,Ve[_],.45):Ze)*P),ge)}const yt=v.chance(.3)?2:1;for(let $=0;$<yt&&le<V;$++,le++)m(le,Be.map((B,P)=>Xe(B,Fe[P],.22)),.3),Qe[le*4]=255,Qe[le*4+3]=255}const he=new Float32Array(V);for(let C=0;C<V;C++){let j=0;for(let Ie=-3;Ie<=3;Ie++)j+=Ke[(C+Ie+V)%V];he[C]=j/7}Ke.set(he);const O=new n.DataTexture(se,V,1,n.RGBAFormat);O.wrapS=n.RepeatWrapping,O.wrapT=n.ClampToEdgeWrapping,O.magFilter=n.LinearFilter,O.minFilter=n.LinearMipmapLinearFilter,O.generateMipmaps=!0,O.needsUpdate=!0;const Ne=new n.DataTexture(Qe,V,1,n.RGBAFormat);return Ne.wrapS=n.RepeatWrapping,Ne.wrapT=n.ClampToEdgeWrapping,Ne.magFilter=n.LinearFilter,Ne.minFilter=n.LinearMipmapLinearFilter,Ne.generateMipmaps=!0,Ne.needsUpdate=!0,{tex:O,hard:Ke,partTex:Ne}}function Va(v,L,u){const oe=Me-R+1,ce=new Float32Array(oe),Be=new Float32Array(oe),se=new Float32Array(oe),Ke=v.range(0,900),ot=v.range(0,900),le=v.range(0,900);let Ye=0;for(let b=0;b<oe;b++){const W=R+b,Fe=.9+.1*L.fbm2(W/300+Ke,3.7,2)+.045*L.n2(W/60+ot,9.1),ge=1-Math.abs(L.n2(W/17+le,1.3)),Ee=Math.pow(F(R+6,R+150,W)*(1-F(Me-120,Me-6,W)),.6);ce[b]=(Fe+ge*ge*.035+.02*L.n2(W/6,4.4))*Ee,ce[b]>Ye&&(Ye=ce[b]),Be[b]=30*L.fbm2(W/420+ot,6.2,2)+7*L.n2(W/85+Ke,2.2)+2.2*L.n2(W/19,7.7),se[b]=Xe(4,14,.5+.5*L.n2(W/170+le,5.5))}for(let b=0;b<oe;b++)ce[b]*=u.height/Ye;const{lam:Ae,gx:Qe,gTan:m,gCos:he,nb:O,hard:Ne,ledge:C}=u,j=1/Ae,Ie=1/(Ae*.37);let H=0;function ne(b,W){const Fe=Math.min(oe-1.001,Math.max(0,b-R)),ge=Fe|0,Ee=Fe-ge,_e=ce[ge]+(ce[ge+1]-ce[ge])*Ee,Ve=W-(Be[ge]+(Be[ge+1]-Be[ge])*Ee),yt=se[ge],$=L.n2(b*.011+Ke,W*.013),B=Math.abs(b-Qe-(W-u.gz)*m)*he;let P,E,Ze,_=-1;if(Ve>=0){const ue=Math.max(_e,6)/na,J=Ve/ue;if(P=J<1?_e*Math.pow(1-J,1.13):0,E=F(0,.13,J)*(1-.8*F(.82,1.3,J)),Ze=F(.1,.4,J)*(1-F(.95,1.5,J)),B<190){const Re=(1-F(105,190,B))*F(.02,.13,J)*(1-F(.98,1.16,J));.72*Re>E&&(_=E,E=.72*Re),Ze=Math.max(Ze,.8*Re)}P+=5.5*Math.exp(-Math.max(Ve-ue,0)/80)*F(.8,1.05,J)*(.55+.45*$)}else{const ue=Math.max(_e,6)/Ia,J=-Ve/ue;P=J<1?_e*Math.pow(1-J,.86):0,E=.75*F(0,.2,J)*(1-.8*F(.8,1.3,J)),Ze=E*.7,P+=4*Math.exp(-Math.max(-Ve-ue,0)/60)*F(.8,1.05,J)*(.55+.45*$)}const Oe=Math.min(1,_e/60),fe=Math.abs(L.n2(b*j+$*.6+ot,W/320+(Ve<0?40:0))),St=1-Math.min(1,fe*2.1);{const ue=yt*E*Oe*St*Math.sqrt(St);P-=_<0?ue:Math.min(ue,Math.max(ue*_/E,.45*P))}const de=Math.abs(L.n2(b/105+$*.5+Ke,W/520+9)),ae=1-Math.min(1,de*2.6);P-=9*E*Oe*ae*ae;const zt=Math.abs(L.n2(b*Ie-$*.8+le,W/150));P-=yt*.3*Ze*Oe*(1-Math.min(1,zt*2.3));let De=(O.x*b+O.y*P+O.z*W-pt)/kt*V;De-=Math.floor(De/V)*V;const rt=De|0,Dt=De-rt,Mt=Ne[rt]+(Ne[(rt+1)%V]-Ne[rt])*Dt;if(P+=(Mt-.5)*C*Math.min(1,E*1.4+.25)*Math.min(1,Math.max(0,P)*.12),H=0,B<230&&P>.1){const ue=((b-Qe)*m+(W-u.gz))*he,J=B-u.wob(ue)-u.back(ue);let Re;if(J<=u.gapHalf)Re=.25*(.5+.5*$);else if(J<u.gapHalf+9)Re=u.finH*Math.pow((J-u.gapHalf)/9,.55)+(Mt-.5)*1.6;else{const $e=J-u.gapHalf-9,lt=b-Qe-(W-u.gz)*m<0;Re=u.finH+(lt?Math.min($e,75)*.36+Math.max($e-75,0)*1.15:$e*.95)+(Mt-.5)*3.2*Math.min(1,$e*.2)}Re<P&&(H=P-Re,P=Re)}P<.2&&(P=.2+.1*$);const Rt=Math.min(F(R,R+40,b)*(1-F(Me-40,Me,b)),F(we,we+30,W)*(1-F(it-45,it,W)));return P*Rt-(1-Rt)*1.2}return{height:ne,crestH:ce,crestZ:Be,carved:()=>H}}const Fa={evening:{elev:16,sun:"#FFD9A0",sunI:2.15,sky:[.3,.42,.6],skyI:.62,bounce:[.5,.33,.2],cloud:.3,storm:.27},golden:{elev:5,sun:"#FFB468",sunI:2.3,sky:[.36,.36,.6],skyI:.66,bounce:[.56,.32,.21],cloud:.26,storm:.25},day:{elev:35,sun:"#FFF2DA",sunI:2.7,sky:[.34,.5,.72],skyI:.7,bounce:[.45,.36,.26],cloud:.36,storm:.3},dawn:{elev:9,sun:"#FFB9A0",sunI:2.2,sky:[.4,.42,.62],skyI:.5,bounce:[.5,.3,.24],cloud:.5,storm:1},night:{elev:30,sun:"#B9CCFF",sunI:1.15,sky:[.1,.16,.3],skyI:1,bounce:[.05,.06,.1],cloud:.62,storm:.62}};async function Ua(v,L={}){const u=v.rng.fork?v.rng.fork("ribbon"):v.rng,oe=v.noise,ce=L.palette&&L.palette.length>=7?L.palette:Na,Be=Fa[L.hour]?L.hour:"evening",se=Fa[Be],Ke=L.weather||"shower",ot=v.quality?.detail??1,le=_a(u,ce);await v.yield();const Ye=u.range(-.06,.06),Ae=new n.Vector3(-.66+Ye,.58,-.48-Ye*.5).normalize(),Qe=-u.range(.42,.54),m={height:200,lam:u.range(24,32),ledge:u.range(3,4),nb:Ae,hard:le.hard,gx:u.range(300,350),gz:0,gTan:Math.tan(Qe),gCos:Math.cos(Qe),gapHalf:11,finH:45,wob:e=>Math.max(.3,1.5+1.3*oe.n2(e/41+5.1,2.7)+.5*oe.n2(e/12+1.3,8.8)),back:e=>5.5*F(14,40,e)},he=Va(u,oe,m);await v.yield();const O=he.height,Ne=Math.round(m.gx-R);m.gz=he.crestZ[Ne];const C=L.sunDir?L.sunDir.clone().normalize():new n.Vector3(-Math.sin(1.222)*Math.cos(se.elev*Math.PI/180),Math.sin(se.elev*Math.PI/180),Math.cos(1.222)*Math.cos(se.elev*Math.PI/180));await v.yield();const j=new n.Vector3(m.gTan,0,1).normalize(),Ie=(e,t)=>Math.abs(e-m.gx-(t-m.gz)*m.gTan)*m.gCos,H=j.z,ne=-j.x,b=Math.round((Pe-Je)/Ft)+1,W=[new Float32Array(b),new Float32Array(b)],Fe=e=>9*Math.pow(Math.max(0,e)/m.finH,1/.55),ge=(e,t)=>{const a=Math.min(b-1.001,Math.max(0,(Pe-t)/Ft)),r=a|0;return W[e][r]+(W[e][r+1]-W[e][r])*(a-r)},Ee=e=>m.gapHalf+m.wob(e)+2.6*(1-F(14,34,e)),_e=[[.25,1.2,2.4,3.8,5.4,7.2,9.2,11.5,14,16.8,19.9,23.3,27,31,35.5,40.5,46,52,58.5,65.5,73],[.25,1.2,2.4,3.8,5.4,7.2,9.2,11.5,14,16.8,19.9,23.3,27,31,35.5,40.5,46,52]];for(let e=0;e<2;e++){const t=e?1:-1,a=new Float32Array(b);for(let r=0;r<b;r++){const s=Pe-r*Ft,c=m.gapHalf+m.wob(s),o=m.gx+j.x*s,l=m.gz+j.z*s,f=c+5.5+9+1.2,p=O(o+H*t*f,l+ne*t*f),h=c+5.5+Fe(Math.min(p,m.finH))+1.4;a[r]=Math.min(m.finH+.5,Math.max(0,Math.min(p,O(o+H*t*h,l+ne*t*h))))}for(let r=0;r<b;r++)W[e][r]=(a[Math.max(0,r-2)]+a[Math.max(0,r-1)]*2+a[r]*3+a[Math.min(b-1,r+1)]*2+a[Math.min(b-1,r+2)])/9}const Ve=(e,t)=>t/13+.35*oe.n2(t/37+e*11,4.4)+e*.37,yt=6.5,$=(e,t)=>{const a=e-m.gx,r=t-m.gz,s=a*j.x+r*j.z;if(s<Je+2||s>Pe-3)return 0;const c=a*H+r*ne,o=c>0?1:0,l=_e[o][_e[o].length-1],f=Math.abs(c)-Ee(s)-Fe(ge(o,s));return f<-3||f>l-6?0:yt*F(-3,0,f)*(1-F(l-17,l-7,f))*F(Je+2,Je+10,s)*(1-F(Pe-13,Pe-4,s))};await v.yield();const B=new Float32Array(y*Q),P=(Me-R)/y,E=(it-we)/Q;for(let e=0;e<Q;e++){const t=we+(e+.5)*E,a=e*y;for(let r=0;r<y;r++){const s=R+(r+.5)*P;B[a+r]=O(s,t)-$(s,t),(r&255)===255&&await v.yield()}}const Ze=(e,t)=>{const a=e<0?0:e>=y?y-1:e|0,r=t<0?0:t>=Q?Q-1:t|0;return B[r*y+a]},_=y>>1,Oe=Q>>1,fe=new Float32Array(_*Oe);{const e=Math.max(.001,Math.hypot(C.x,C.z)),t=C.x/e/P,a=C.z/e/E,r=Math.max(C.y/e,.2126);for(let o=0;o<Oe;o++){for(let l=0;l<_;l++){const f=l*2+1,p=o*2+1,h=Ze(f,p)+.5,g=Math.abs(R+(f+.5)*P-m.gx-(we+(p+.5)*E-m.gz)*m.gTan)*m.gCos,M=g<45?2.4:g>95?9:2.4+(g-45)*.132;let i=1,S=2.2;for(let A=0;A<22;A++){const z=h+S*r;if(z>215)break;const N=M*(z-Ze(f+t*S,p+a*S))/S+.25;if(N<i&&(i=N,i<=0)){i=0;break}S*=1.23}fe[o*_+l]=g<70?-1-i:i}(o&0)===0&&await v.yield()}const s=new Uint8Array(_*Oe);for(let o=0;o<_*Oe;o++)fe[o]<0&&(fe[o]=-1-fe[o],s[o]=1);const c=fe.slice();for(let o=1;o<Oe-1;o++)for(let l=1;l<_-1;l++){const f=o*_+l;s[f]&&(fe[f]=(c[f]*2+c[f-1]+c[f+1]+c[f-_]+c[f+_]+(c[f-_-1]+c[f-_+1]+c[f+_-1]+c[f+_+1])*.5)/8)}}await v.yield();const St=new Float32Array(y*Q);{const e=new Float32Array(y*Q),t=7,a=1/(2*t+1);for(let s=0;s<Q;s++){const c=s*y;let o=B[c]*(t+1);for(let l=1;l<=t;l++)o+=B[c+l];for(let l=0;l<y;l++){e[c+l]=o*a;const f=l+t+1,p=l-t;o+=B[c+(f<y?f:y-1)]-B[c+(p>0?p:0)]}(s&15)===15&&await v.yield()}await v.yield();const r=new Float32Array(y);for(let s=0;s<y;s++)r[s]=e[s]*(t+1);for(let s=1;s<=t;s++){const c=s*y;for(let o=0;o<y;o++)r[o]+=e[c+o]}for(let s=0;s<Q;s++){const c=s*y,o=(s+t+1<Q?s+t+1:Q-1)*y,l=(s-t>0?s-t:0)*y;for(let f=0;f<y;f++)St[c+f]=r[f]*a,r[f]+=e[o+f]-e[l+f];(s&15)===15&&await v.yield()}}await v.yield();const de=new Uint8Array(y*Q*4);{const e=1/(2*P),t=1/(2*E);for(let a=0;a<Q;a++){const r=(a>0?a-1:0)*y,s=(a<Q-1?a+1:Q-1)*y,c=a*y;let o=(a-1)*.5;o<0?o=0:o>Oe-1.001&&(o=Oe-1.001);const l=o|0,f=o-l,p=l*_,h=p+_;for(let i=1;i<y-1;i++){const S=c+i,A=(B[S+1]-B[S-1])*e,z=(B[s+i]-B[r+i])*t,N=127.5/Math.sqrt(A*A+z*z+1);let D=.82+(B[S]-St[S])*.07;D<.42?D=.42:D>1&&(D=1);let pe=(i-1)*.5;pe>_-1.001&&(pe=_-1.001);const ee=pe|0,Ce=pe-ee,Tt=fe[p+ee],Pt=fe[h+ee],Ht=Tt+(fe[p+ee+1]-Tt)*Ce,ea=Pt+(fe[h+ee+1]-Pt)*Ce;let je=Ht+(ea-Ht)*f;je<0?je=0:je>1&&(je=1);const gt=S*4;de[gt]=128-A*N,de[gt+1]=128-z*N,de[gt+2]=D*255,de[gt+3]=je*255}const g=c*4,M=(c+y-1)*4;for(let i=0;i<4;i++)de[g+i]=de[g+4+i],de[M+i]=de[M-4+i];(a&3)===3&&await v.yield()}}const ae=new Float32Array(y*Q),zt=[],ia=540,De=[[1,0,P],[-1,0,P],[0,1,E],[0,-1,E],[1,1,Math.hypot(P,E)],[-1,1,Math.hypot(P,E)],[1,-1,Math.hypot(P,E)],[-1,-1,Math.hypot(P,E)]];for(let e=0;e<ia;e++){let t,a;if(e<40){const p=u.range(-70,110),h=u.sign()*u.range(16,60);t=m.gx+p*m.gTan+h,a=m.gz+p}else e>=440?(t=m.gx-u.range(40,330),a=he.crestZ[Math.round(t-R)]+u.range(3,60)):(t=u.range(R+30,Me-30),a=he.crestZ[Math.round(t-R)]+(u.chance(.8)?u.range(4,150):-u.range(4,60)));let r=Math.round((t-R)/P-.5),s=Math.round((a-we)/E-.5),c=0,o=-1,l=0,f=0;for(let p=0;p<520&&!(r<1||s<1||r>=y-1||s>=Q-1);p++){const h=s*y+r,g=B[h];if(g<.6)break;ae[h]+=1;let M=0,i=-1;for(let A=0;A<8;A++){const z=(g-B[h+De[A][1]*y+De[A][0]])/De[A][2];z>M&&(M=z,i=A)}if(i<0)break;const S=M*De[i][2];M>1.9?(o<0&&(o=h,l=0,f=0,c=0),c+=S,l+=De[i][0],f+=De[i][1]):o>=0&&(c>=3.6&&zt.push({idx:o,drop:c,ox:l,oz:f,w:ae[h]}),o=-1),r+=De[i][0],s+=De[i][1]}(e&15)===15&&await v.yield()}const rt=new Uint8Array(y*Q*4);for(let e=1;e<Q-1;e++){for(let t=1;t<y-1;t++){const a=e*y+t;if(rt[a*4+3]=255,ae[a]+ae[a-1]+ae[a+1]+ae[a-y]+ae[a+y]+ae[a-1-y]+ae[a+1-y]+ae[a-1+y]+ae[a+1+y]===0)continue;const r=ae[a]*.36+(ae[a-1]+ae[a+1]+ae[a-y]+ae[a+y])*.11+(ae[a-1-y]+ae[a+1-y]+ae[a-1+y]+ae[a+1+y])*.05;rt[a*4]=Math.round(Math.min(1,Math.sqrt(r)*.46)*255)}(e&3)===3&&await v.yield()}await v.yield();const Dt=e=>{const t=new n.DataTexture(e,y,Q,n.RGBAFormat);return t.magFilter=n.LinearFilter,t.minFilter=n.LinearMipmapLinearFilter,t.generateMipmaps=!0,t.wrapS=t.wrapT=n.ClampToEdgeWrapping,t.anisotropy=4,t.needsUpdate=!0,t},Mt=Dt(de),Rt=Dt(rt),ue=160,J=80,Re=new Uint16Array(ue*J);for(let e=0;e<J;e++){(e&3)===3&&await v.yield();for(let t=0;t<ue;t++)Re[e*ue+t]=n.DataUtils.toHalfFloat(O(R+(t+.5)/ue*(Me-R),we+(e+.5)/J*(it-we)))}const $e=new n.DataTexture(Re,ue,J,n.RedFormat,n.HalfFloatType);$e.minFilter=$e.magFilter=n.LinearFilter,$e.wrapS=$e.wrapT=n.ClampToEdgeWrapping,$e.needsUpdate=!0,await v.yield();const lt=(e,t=1)=>{const a=new n.Color(e);return new n.Vector3(a.r*t,a.g*t,a.b*t)},mt=new n.Vector2(.94,-.34).normalize(),Sa=lt(ce[2],.76),za=lt(ce[0]).lerp(lt(ce[6]),.35).multiplyScalar(.55),U={uStrata:{value:le.tex},uPart:{value:le.partTex},uRockH:{value:$e},uBake1:{value:Mt},uBake2:{value:Rt},uNBed:{value:Ae},uSun:{value:C.clone()},uSunCol:{value:lt(se.sun,se.sunI)},uSkyCol:{value:new n.Vector3(...se.sky).multiplyScalar(se.skyI)},uBounce:{value:new n.Vector3(...se.bounce).multiplyScalar(.34)},uCream:{value:Sa},uMud:{value:za},uWash:{value:lt(ce[2]).lerp(lt(ce[5]),.5).multiplyScalar(.8)},uCam:{value:new n.Vector3(0,60,900)},uBed:{value:new n.Vector4(pt,1/kt,Ke==="snow"?1:0,Be==="dawn"?1:0)},uRect:{value:new n.Vector4(R,we,1/(Me-R),1/(it-we))},uShade:{value:new n.Vector4(-9e3,-8e3,se.cloud,se.storm)},uShade2:{value:new n.Vector4(0,-1e3,0,0)},uLand:{value:new n.Vector4(0,0,0,3.1)},uLandBed:{value:Ae.clone()},uFinA:{value:new n.Vector4(m.gTan*m.gCos,m.gCos,m.gx,m.gz)},uFinB:{value:new n.Vector4(ya,xa,16,u.range(0,300))},uFallW:{value:new n.Vector4(1e4,1e4,1e4,1e4)},uFallE:{value:new n.Vector4(1e4,1e4,1e4,1e4)},uRing:{value:new n.Vector4(0,2.3,0,0)},uRingB:{value:new n.Vector4(1,.82,.58,6)},uFinC:{value:new n.Vector4(m.gapHalf,275,Be==="night"?1.6:1.55,Be==="night"?1:0)},uWetDir:{value:mt},uWind:{value:new n.Vector2(19,-6)},uFront:{value:-9e3},uTime:{value:0},uVeil:{value:new n.Vector2(0,0)}},xt=(e,t,a={})=>new n.ShaderMaterial({uniforms:{...n.UniformsUtils.clone(n.UniformsLib.fog),...U},vertexShader:e,fragmentShader:t,fog:!0,...a}),et=new n.Group,Xt=new n.Group;Xt.name="the-ribbon",Xt.add(et),L.mirror&&(et.scale.x=-1);const Ma=(e,t)=>{let a=(e-R)/P-.5,r=(t-we)/E-.5;a<0?a=0:a>y-1.001&&(a=y-1.001),r<0?r=0:r>Q-1.001&&(r=Q-1.001);const s=a|0,c=r|0,o=a-s,l=r-c,f=c*y+s,p=B[f]+(B[f+1]-B[f])*o,h=B[f+y]+(B[f+y+1]-B[f+y])*o;return p+(h-p)*l};{const e=[];for(let i=R;i<Me-.5;)e.push(i),i+=i-m.gx>-112&&i-m.gx<62?1.3:2.6;e.push(Me);const t=[],a=[1.2,2.6,4.5,7,10];for(let i=17;i<=112;i+=7)a.push(i);const r=[1.2,2.6,4.5,7,10];for(let i=14.4;i<=282;i+=4.4)r.push(i);for(let i=0;i<3;i++)t.push([-1,i/3,1]);for(let i=a.length-1;i>=0;i--)t.push([-1,a[i],0]);t.push([0,0,0]);for(const i of r)t.push([1,i,0]);for(let i=1;i<=4;i++)t.push([1,i/4,1]);const s=e.length,c=t.length,o=new Float32Array(s*c*3),l=a[a.length-1],f=r[r.length-1];for(let i=0;i<c;i++){const[S,A,z]=t[i];for(let N=0;N<s;N++){const D=e[N],pe=he.crestZ[Math.round(D-R)];let ee;S<0?ee=z?Xe(we,pe-l,A):pe-A:S>0?ee=z?Xe(pe+f,it,A):pe+A:ee=pe,ee=Math.min(it,Math.max(we,ee));const Ce=(i*s+N)*3;o[Ce]=D,o[Ce+1]=!z&&A<=10.5?O(D,ee)-$(D,ee):Ma(D,ee),o[Ce+2]=ee}(i&1)===1&&await v.yield()}await v.yield();const p=new Uint32Array((s-1)*(c-1)*6);let h=0;for(let i=0;i<c-1;i++)for(let S=0;S<s-1;S++){S===0&&(i&15)===15&&await v.yield();const A=i*s+S,z=A+1,N=A+s,D=N+1;S+i&1?(p[h++]=A,p[h++]=N,p[h++]=z,p[h++]=z,p[h++]=N,p[h++]=D):(p[h++]=A,p[h++]=N,p[h++]=D,p[h++]=A,p[h++]=D,p[h++]=z)}await v.yield();const g=new n.BufferGeometry;g.setAttribute("position",new n.BufferAttribute(o,3)),g.setIndex(new n.BufferAttribute(p,1)),g.boundingSphere=new n.Sphere(new n.Vector3(0,80,90),640);const M=new n.Mesh(g,xt($t,Jt));M.name="ribbon-face",et.add(M)}await v.yield();const ra=[];{const e=U.uFinB.value,t=le.tex.image.data,a=kt/V,r=e.x*e.z,s=x=>-.55+2.5*F(.24,.96,x),c=vt*Je-2,o=vt*Pe+m.finH+2,l=[];{const x=Math.floor((r*c+e.w-pt)/a),T=Math.ceil((r*o+e.w-pt)/a),Z=G=>t[(G%V+V)%V*4+3];let X=x;for(let G=x+1;G<=T+1;G++)(G>T||Z(G)!==Z(X))&&(l.push({c0:(pt+X*a-e.w)/r,c1:(pt+G*a-e.w)/r,p:s(Z(X)/255)}),X=G)}const f=x=>{let T=0,Z=l.length-1;for(;T<Z;){const X=T+Z>>1;l[X].c1<=x?T=X+1:Z=X}return l[T].p},p=[],h=[],g=[],M=[],i=[],S=[],A=[];l.forEach((x,T)=>{const Z=l[T-1],X=l[T+1],G=x.c1-x.c0,I=Z?x.p-Z.p:0,be=X?X.p-x.p:0,Ge=x.p+(I<-.25?Math.min(.45,-I*.4):0),We=x.p-(be>.25?.22:0),tt=I<-.25?.66:I>.25?.82:.86,at=be<-.25?1:be>.25?.4:.86;if(G<.35){p.push((x.c0+x.c1)*.5),h.push(x.p),g.push(.5),M.push(.5),i.push(0),S.push(T),A.push(0);return}const Le=Math.max(0,Math.ceil(G/1.7)-1);for(let ie=0;ie<=Le+1;ie++){const dt=ie/(Le+1),qe=Math.min(.09,G*.25);p.push(ie===0?x.c0+qe:ie===Le+1?x.c1-qe:x.c0+G*dt),h.push(Xe(Ge,We,dt)+(x.p>.6?.14:.05)*Math.sin(Math.PI*dt)+(G>1.7&&ie>0&&ie<=Le?ie&1?.26:-.16:0)),g.push(ie===0?tt:ie===Le+1?at:Math.min(1,Xe(tt,at,dt)+.5*Math.sin(Math.PI*dt))),M.push(ie===Le+1&&be>.25?.12:ie===Le&&Le>0&&be>.25?.6:1),i.push(ie===0?I<-.25?1.1:I>.25?-.3:0:ie===Le+1?be<-.25?.85:be>.25?-.5:0:0),S.push(T),A.push(ie===0?1:ie===Le+1?2:0)}});const z=p.length,N=(x,T,Z)=>{let X=((Ae.x*x+Ae.y*T+Ae.z*Z)*ka-pt)/kt*V;return X-=Math.floor(X/V)*V,t[(X|0)*4+3]/255},D=x=>{const T=Math.sin(x)*43758.5453;return T-Math.floor(T)},pe=x=>(x+.28*Math.sin(x*2.4))*Nt,ee=x=>Zt*Math.sin(x*1.7),Ce=new Float32Array(b),Tt=new Float32Array(b);for(let x=0;x<b;x++){const T=Pe-x*Ft,Z=Math.floor(T/Nt),X=pe(Z),G=pe(Z+1);Ce[x]=ee(Z-1)+(ee(Z)-ee(Z-1))*F(X-.7,X+.7,T)+(ee(Z+1)-ee(Z))*F(G-.7,G+.7,T),Tt[x]=Math.min(Math.abs(T-X),Math.abs(T-G))}const Pt=C.x*H+C.z*ne,Ht=C.x*j.x+C.z*j.z,ea=xt($t,Jt,{defines:{FIN:1},side:n.DoubleSide}),je=x=>Pe-x*Ft,gt=(x,T)=>{const Z=Math.min(_-1.001,Math.max(0,((x-R)/P-1.5)*.5)),X=Math.min(Oe-1.001,Math.max(0,((T-we)/E-1.5)*.5)),G=Z|0,I=X|0,be=Z-G,Ge=X-I,We=I*_+G;return Math.min(1,Math.max(0,(fe[We]+(fe[We+1]-fe[We])*be)*(1-Ge)+(fe[We+_]+(fe[We+_+1]-fe[We+_])*be)*Ge))};for(let x=0;x<2;x++){const T=x?1:-1,Z=-T*H,X=-T*ne,G=_e[x],I=G.length+1,be=G[G.length-1],Ge=W[x],We=new Float32Array(b),tt=new Float32Array(b),at=new Float32Array(b),Le=new Float32Array(b),ie=new Int32Array(b);for(let d=0;d<b;d++){const w=je(d);We[d]=Ee(w),tt[d]=m.gx+j.x*w,at[d]=m.gz+j.z*w,Le[d]=Ve(x,w)}for(let d=b-1,w=0;d>=0;d--){for(;w<z-1&&p[w+1]<=vt*je(d)+Ce[d];)w++;ie[d]=w}const dt=(d,w,k,K,Y,q)=>{if(-T*Pt<=.05)return q&&C.y<.42?0:gt(K,Y);const ve=(d+m.gapHalf+1.5)/Math.abs(Pt),Se=k+ve*Ht,ye=Se>Pe||Se<Je?0:ge(1-x,Se);return q?F(-1.5,3,w+ve*C.y-.3*ye):1},qe=[0,0,0],Et=[0,0,0],_t=[0,0,0],Vt=[0,0,0],Ot=[0,0,0],Bt=(d,w,k)=>{const K=je(d),Y=Ge[d],q=p[w]-vt*K-Ce[d],ve=q<0?0:q>Y?Y:q,Se=F(.15,1.8,ve)*(1-F(Y-1.7,Y-.15,ve)),ye=S[w],Te=.78+.22*(1+oe.n2(K/9.3+ye*3.1,ye*1.7+x*40)),me=.5*(1-F(.2,1.5,Tt[d])),xe=l[ye].p<.3?.42*Math.abs(oe.n2(K/3.4+ye*5.3,x*7+ye)):0,He=We[d]+Fe(ve)-(h[w]*Te-me-xe+.6*oe.n2(K/23+x*9,p[w]/9))*Se;return k[0]=tt[d]+H*T*He,k[1]=ve,k[2]=at[d]+ne*T*He,q<0?-1:q>Y?1:0},Ct=[],ta=[],aa=[],oa=[],jt=[],va=new Map,Gt=(d,w)=>{const k=d*4096+w;let K=va.get(k);if(K!==void 0)return K;const Y=Bt(d,w,qe),q=je(d),ve=A[w];Bt(Math.max(0,d-1),w,Et),Bt(Math.min(b-1,d+1),w,_t),Bt(d,ve===1?w:w-1,Vt),Bt(d,ve===2?w:w+1,Ot);const Se=_t[0]-Et[0],ye=_t[1]-Et[1],Te=_t[2]-Et[2],me=Ot[0]-Vt[0],xe=Ot[1]-Vt[1],He=Ot[2]-Vt[2];let te=ye*He-Te*xe,re=Te*me-Se*He,ke=Se*xe-ye*me;te*Z+ke*X+re*.6<0&&(te=-te,re=-re,ke=-ke);let ze=Math.hypot(te,re,ke);(ze<1e-6||Y!==0)&&(te=Z,re=Y>0?.9:.3,ke=X,ze=Math.hypot(te,re,ke)),te/=ze,re/=ze,ke/=ze,Y===0&&(re+=i[w],ze=Math.hypot(te,re,ke),te/=ze,re/=ze,ke/=ze),K=Ct.length/3,va.set(k,K),Ct.push(qe[0],qe[1],qe[2]),ta.push(te,re,ke);const nt=(qe[0]-tt[d])*H*T+(qe[2]-at[d])*ne*T;return aa.push(Math.min(1,(Y===0?g[w]:.9)*(.55+.45*F(0,7,qe[1]))),dt(nt,qe[1],q,qe[0],qe[2],!0)*(Y===0?M[w]:1)),oa.push(Le[d]+(D(S[w]*3.3+x)-.5)*.05,0),K};let sa=Math.ceil((Pe-((L.ringT??110)-12))/Ft);sa+=sa&1;for(let d=0,w=0;d<b-1;w++){const k=Math.min(b-1,d+(d>=sa?2:1));if(!(Ge[d]<.7&&Ge[k]<.7)){const K=je(d),Y=je(k);for(let q=Math.min(ie[d],ie[k]);q<z-1;q++){const ve=p[q]-vt*K-Ce[d],Se=p[q+1]-vt*K-Ce[d],ye=p[q]-vt*Y-Ce[k],Te=p[q+1]-vt*Y-Ce[k];if(ve>Ge[d]&&ye>Ge[k])break;if(Se<0&&Te<0)continue;const me=Gt(d,q),xe=Gt(k,q),He=Gt(d,q+1),te=Gt(k,q+1);jt.push(me,xe,te,me,te,He)}}d=k,await v.yield()}const Ca=jt.length,ja=Ct.length/3,Ue=new Float32Array(b*I),ct=new Float32Array(b*I),ft=new Float32Array(b*I),ma=new Float32Array(b*I);for(let d=0;d<b;d++){const w=je(d),k=Ge[d],K=We[d]+Fe(k),Y=Le[d],q=Y-Math.floor(Y),ve=1-Math.abs(2*q-1),Se=F(Je+2,Je+12,w)*(1-F(Pe-16,Pe-5,w)),ye=3.2*(1-F(Je,Je+3,w)*(1-F(Pe-4,Pe-1,w)));for(let Te=0;Te<I;Te++){const me=Te?G[Te-1]:0,xe=K+me,He=xe+m.back(w)*(1-F(8,34,me))+.5;let te=O(tt[d]+H*T*He,at[d]+ne*T*He),re=he.carved();{const ga=O(tt[d]+H*T*xe,at[d]+ne*T*xe);ga>te&&(te=ga,re=he.carved())}const ke=F(.5,5,re),ze=1-F(be-22,be-9,me),nt=(.4+Math.min(me*.12,1.15))*(.5-.5*Math.cos(Math.PI*ve))*ke,Ka=s(N(tt[d]+H*T*xe,te,at[d]+ne*T*xe));let Kt=te+(0-nt)*ze*Se;Kt=Xe(k+.02,Kt,F(0,1.6,me))-3*F(be-7,be,me)-ye,k<.7&&me<3&&(Kt=Math.min(Kt,te-.4));const Ut=d*I+Te;ct[Ut]=tt[d]+H*T*xe,Ue[Ut]=Kt,ft[Ut]=at[d]+ne*T*xe,ma[Ut]=Math.min(1,Math.max(.42,.95-.15*nt*ze*Se+.1*Ka))}(d&1)===1&&await v.yield()}{const d=new Float32Array(b*I);for(let w=0;w<b;w++)for(let k=0;k<I;k++){const K=w*I+k;d[K]=k<2||k===I-1?Ue[K]:.27*Ue[K-1]+.46*Ue[K]+.27*Ue[K+1]}await v.yield();for(let w=0;w<b;w++)for(let k=0;k<I;k++){const K=w*I+k;Ue[K]=k<2||w===0||w===b-1?d[K]:.25*d[K-I]+.5*d[K]+.25*d[K+I]}await v.yield()}for(let d=0;d<b;d++)for(let w=0;w<I;w++){w===0&&(d&15)===15&&await v.yield();const k=d*I+w,K=Math.max(0,d-1)*I+w,Y=Math.min(b-1,d+1)*I+w,q=d*I+Math.max(0,w-1),ve=d*I+Math.min(I-1,w+1),Se=ct[Y]-ct[K],ye=Ue[Y]-Ue[K],Te=ft[Y]-ft[K],me=ct[ve]-ct[q],xe=Ue[ve]-Ue[q],He=ft[ve]-ft[q];let te=ye*He-Te*xe,re=Te*me-Se*He,ke=Se*xe-ye*me;re<0&&(te=-te,re=-re,ke=-ke);const ze=Math.hypot(te,re,ke)||1,nt=w?G[w-1]:0;Ct.push(ct[k],Ue[k],ft[k]),ta.push(te/ze,re/ze,ke/ze),aa.push(ma[k],Math.min(gt(ct[k],ft[k])+.25*(1-F(0,30,nt)),dt(We[d]+Fe(Ge[d])+nt,Ue[k],je(d),ct[k],ft[k],!1))),oa.push(Le[d],.1+.4*F(0,9,nt)+.5*F(be*.55,be-9,nt))}for(let d=0;d<b-1;d++)for(let w=0;w<I-1;w++){const k=ja+d*I+w,K=k+I,Y=k+1,q=K+1;jt.push(k,K,q,k,q,Y)}await v.yield();const ut=new n.BufferGeometry;ut.setAttribute("position",new n.Float32BufferAttribute(Ct,3)),ut.setAttribute("normal",new n.Float32BufferAttribute(ta,3)),await v.yield(),ut.setAttribute("aBake",new n.Float32BufferAttribute(aa,2)),await v.yield(),ut.setAttribute("aFin",new n.Float32BufferAttribute(oa,2)),await v.yield(),ut.setIndex(jt),await v.yield(),ut.computeBoundingSphere();const wa=new n.Mesh(ut,ea);wa.name=x?"fin-east":"fin-west",et.add(wa),ra.push({g:ut,wall:Ca,all:jt.length}),await v.yield()}}{const e=new n.IcosahedronGeometry(1,1),t=e.attributes.position;for(let g=0;g<t.count;g++){let M=t.getX(g),i=t.getY(g),S=t.getZ(g);const A=1+.24*oe.n3(M*1.3+3,i*1.3,S*1.3)+.1*oe.n3(M*3.1,i*3.1+7,S*3.1);M*=A,i*=A,S*=A,i=Math.round(i*2.6)/2.6*.6+i*.4,i<-.45&&(i=-.45+(i+.45)*.2),t.setXYZ(g,M*1.15,i*.72,S)}e.computeVertexNormals(),await v.yield();const a=Math.round(210*(.6+.4*ot)),r=new n.InstancedMesh(e,xt($t,Jt,{defines:{BLOCK:1}}),a),s=new n.Matrix4,c=new n.Quaternion,o=new n.Euler,l=new n.Vector3,f=new n.Vector3;let p=0,h=0;for(;p<a&&h++<a*8;){(h&15)===0&&await v.yield();let g,M;const i=.45+2.4*Math.pow(u(),2.2),S=u();if(S<.3){const N=u.range(-150,190),D=(m.gapHalf-1.2+u.range(0,3.2))*u.sign();g=m.gx+N*m.gTan+D/m.gCos,M=m.gz+N}else{g=u.range(R+40,Me-40);const N=Math.round(g-R),D=he.crestH[N]/na;M=he.crestZ[N]+D*(S<.8?u.range(.86,1.22):u.range(.45,.9))}if(M>it-30||M<we+20)continue;const A=S<.3?.35+(i-.45)*.3:i;if(Ie(g,M)<9.2+A*1.2)continue;const z=O(g,M);if(!(S<.3&&z>3)&&!(S>=.3&&Math.abs(O(g,M+1.5)-O(g,M-1.5))+Math.abs(O(g+1.5,M)-O(g-1.5,M))>1.35)){{const N=m.gx+j.x*255-(m.gx-185),D=m.gz+j.z*255-410,pe=N*N+D*D,ee=Math.min(1.25,Math.max(-.2,((g-(m.gx-185))*N+(M-410)*D)/pe));if(Math.hypot(g-(m.gx-185)-N*ee,M-410-D*ee)<15+A*2)continue}f.set(g,z+A*.12,M),o.set(u.range(-.3,.3),u.range(0,6.283),u.range(-.3,.3)),c.setFromEuler(o),l.set(A*u.range(.8,1.3),A*u.range(.6,1.1),A*u.range(.8,1.3)),r.setMatrixAt(p++,s.compose(f,c,l))}}r.count=p,r.instanceMatrix.needsUpdate=!0,r.frustumCulled=!1,r.name="ribbon-talus",et.add(r)}await v.yield();const Aa=e=>{const t=e%y,a=e/y|0;return[R+(t+.5)*P,B[e],we+(a+.5)*E]};zt.sort((e,t)=>t.drop*(1+.2*t.w)-e.drop*(1+.2*e.w));const ht=[];for(const e of zt){const[t,a,r]=Aa(e.idx),s=Ie(t,r)<34||$(t,r)>.01;if(s||ht.reduce((l,f)=>l+(Math.abs(f.x-t)<16&&Math.abs(f.z-r)<16?1:0),0)>0||s&&ht.filter(l=>l.inGap).length>=7)continue;const o=Math.hypot(e.ox*P,e.oz*E)||1;if(ht.push({x:t,y:a,z:r,drop:Math.min(e.drop,46),ox:e.ox*P/o,oz:e.oz*E/o,w:e.w,inGap:s}),ht.length>=84)break}await v.yield();{const e=L.ringT??110,t=[0,0];let a=1e3;const r=-(C.x*H+C.z*ne);for(const[s,c,o]of[[e+100,-1,2.8],[e+52,-1,2.6],[e+6,-1,4.4],[e-34,1,2.2],[e+66,1,2]]){const l=c>0?1:0;let f=s,p=9;for(let z=s-7;z<=s+7;z+=.25){const N=Ve(l,z),D=Math.abs(N-Math.floor(N)-.5);D<p&&(p=D,f=z)}if(f>ba-4||f<Je+20)continue;const h=ge(l,f);if(h<12)continue;const g=Ee(f)+Fe(h)-.6,M=m.gx+j.x*f,i=m.gz+j.z*f;(l?U.uFallE:U.uFallW).value.setComponent(t[l]++,Ve(l,f));const S=Math.min(.62*h,26),A=Ee(f)+Fe(S)-2.6-.2*o;c<0&&(a=Math.min(a,S)),ht.unshift({x:M+H*c*g,y:h-.5,z:i+ne*c*g,drop:h-.6,ox:-H*c,oz:-ne*c,w:9,inGap:!0,fin:!0,wd:o,t:f,side:c,bx:M,bz:i,leap:c<0?{x:M+H*c*A,y:S,z:i+ne*c*A,drop:S-.15,shade:c*r>.05?0:1}:null})}U.uLand.value.z=a>900?0:a}{const t=[],a=[],r=[];for(let h=0;h<=8;h++)t.push(-.5,0,0,.5,0,0),a.push(0,h/8,1,h/8);for(let h=0;h<8;h++){const g=h*2;r.push(g,g+2,g+1,g+1,g+2,g+3)}const s=new n.InstancedBufferGeometry;s.setAttribute("position",new n.Float32BufferAttribute(t,3)),s.setAttribute("uv",new n.Float32BufferAttribute(a,2)),s.setIndex(r);const c=ht.filter(h=>!h.fin||h.leap),o=Math.max(1,c.length),l=new Float32Array(o*4),f=new Float32Array(o*4);c.forEach((h,g)=>{if(h.fin){l.set([h.leap.x,h.leap.y,h.leap.z,h.leap.drop],g*4),f.set([h.wd,u()*.98+(h.leap.shade?2:0),h.ox*.42,h.oz*.42],g*4);return}l.set([h.x+h.ox*.4,h.y-.15,h.z+h.oz*.4,h.drop+.8],g*4),f.set([h.wd||Math.min(2.6,.7+.16*h.w+h.drop*.035),u()*.98,h.ox,h.oz],g*4)}),s.setAttribute("aTop",new n.InstancedBufferAttribute(l,4)),s.setAttribute("aPar",new n.InstancedBufferAttribute(f,4)),s.instanceCount=c.length;const p=new n.Mesh(s,xt(Da,Ra,{transparent:!0,depthWrite:!1,side:n.DoubleSide}));p.frustumCulled=!1,p.renderOrder=2,p.name="ribbon-falls",et.add(p)}await v.yield();{const e=[],t=[];for(const o of ht)for(let l=0;l<(o.fin?8:3);l++){const f=o.drop*.22+1+u.range(0,2);if(o.fin){const p=u(),h=u(),g=u(),M=u(),i=u(),S=u(),A=(o.wd||1)>2?1.3:1;for(let z=0;z<3;z++){const N=z===0?.6+1.6*M:z===1?2+.3*o.drop*i:1+4*g,D=((z===0?h:z===1?S:p)*2-1)*(z===0?5.5:z===1?2.2:3.6)*A,pe=Ee(o.t+D)+Fe(N)-(z===0?2.2+2.5*g:z===1?1.6:3.5+2*i);e.push(o.bx+j.x*D+H*o.side*pe,N,o.bz+j.z*D+ne*o.side*pe,(z===0?7+5*p:z===1?4+3.5*g:5+4*h)*A),t.push(z===0?i:z===1?h:S,3,z===0?3+4*S:z===1?2+3*M:5+5*p,.12+.12*(z===0?h:z===1?p:M))}continue}e.push(o.x+o.ox*f+u.range(-1,1),o.y-o.drop+u.range(0,1.5),o.z+o.oz*f+u.range(-1,1),5+o.drop*.5+u.range(0,3)),t.push(u(),0,u.range(5,11)+o.drop*.2,u.range(.13,.24))}const a=Math.round(300*ot),r=Math.round(80*ot);for(let o=0;o<a+r;o++){const l=o>=a,f=u.range(R+50,Me-50),p=Math.round(f-R),h=he.crestH[p]/na,g=he.crestZ[p]+h*(l?u.range(-.02,.35):u.range(.06,.92)),M=O(f,g);M<4||(e.push(f,M+(l?2:5),g,l?u.range(16,34):u.range(20,44)),t.push(u(),l?2:1,l?u.range(8,18):u.range(16,34),l?u.range(.05,.09):u.range(.03,.055)))}const s=new n.InstancedBufferGeometry;s.setAttribute("position",new n.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),s.setIndex([0,1,2,0,2,3]),s.setAttribute("aPos",new n.InstancedBufferAttribute(new Float32Array(e),4)),s.setAttribute("aPar",new n.InstancedBufferAttribute(new Float32Array(t),4)),s.instanceCount=e.length/4;const c=new n.Mesh(s,xt(Wa,qa,{transparent:!0,depthWrite:!1}));c.frustumCulled=!1,c.renderOrder=3,c.name="ribbon-vapour",et.add(c)}if(await v.yield(),L.rain!==!1&&Ke!=="clear"&&Be!=="dawn"){const e=[22,105,230,390],t=[],a=[],r=[];e.forEach((o,l)=>{const f=u();t.push(-470,0,0,470,0,0,470,400,0,-470,400,0);for(let p=0;p<4;p++)a.push(o,f);r.push(l*4,l*4+1,l*4+2,l*4,l*4+2,l*4+3)});const s=new n.BufferGeometry;s.setAttribute("position",new n.Float32BufferAttribute(t,3)),s.setAttribute("aLayer",new n.Float32BufferAttribute(a,2)),s.setIndex(r);const c=new n.Mesh(s,xt(Ha,Ea,{transparent:!0,depthWrite:!1,side:n.DoubleSide}));c.frustumCulled=!1,c.renderOrder=4,c.name="ribbon-rain",et.add(c)}await v.yield();const At=L.mirror?-1:1,st=(e,t,a)=>new n.Vector3(e*At,t,a),la=new n.Vector3(m.gx,2.3,m.gz),wt=(e,t)=>st(la.x+j.x*e,t,la.z+j.z*e),Lt=[st(m.gx-330,2.3,800),st(m.gx-250,42.3,600),st(m.gx-185,42.3,410),wt(255,16),wt(150,6),wt(60,2.3),wt(0,2.3),wt(-60,2.3)],ha=[];for(let e=R+40;e<=Me-40;e+=40){const t=Math.round(e-R);ha.push(st(e,O(e,he.crestZ[t]),he.crestZ[t]))}const La={portalSeat:{position:wt(0,2.3),facing:st(j.x,0,j.z)},flyThrough:Lt,viewpoints:{wash:Lt[0],knifeMid:Lt[1],underFace:Lt[2],gapMouth:Lt[5]},gap:{center:wt(0,0),axis:st(j.x,0,j.z),halfWidth:m.gapHalf,finHeight:m.finH},crest:ha,falls:ht.map(e=>st(e.x,e.y,e.z)),strike:st(1,0,0),faceNormal:new n.Vector3(0,Math.cos(38*Math.PI/180),Math.sin(38*Math.PI/180))},Ta=mt.x*(R+20)+mt.y*110,Pa=mt.x*(Me-20)+mt.y*110,da=e=>{const t=(e-.38)/.34;return Xe(Ta,Pa,t<0?-(1-Math.exp(2.5*t))/2.5:Math.min(2.2,t))},ca=L.rain===!1?0:1,Ba=6;let fa=190,ua=!1,pa=0;function Wt(e){if(pa=e,Be==="dawn"){U.uFront.value=-9e3,U.uShade.value.x=-9e3,U.uShade.value.y=-8e3,U.uShade2.value.set(0,Xe(225,-40,F(.04,.72,e)),0,0);return}if(Ke==="clear"){U.uFront.value=-9e3,U.uShade.value.x=-9e3,U.uShade.value.y=-8e3,U.uShade2.value.set(0,-1e3,0,0);return}const t=da(e);U.uFront.value=t,U.uShade.value.x=t-fa,U.uShade.value.y=t+Ba,U.uShade2.value.set(1,-1e3,ca*F(.33,.4,e)*(1-F(.8,.92,e)),0),U.uVeil.value.set(430*(1-F(.04,.38,e)),ca*.9*(1-F(.8,.92,e)))}Wt(0);const Yt=new n.Matrix4,qt=new n.Vector3;let Qt=null;return{object:Xt,radius:440,height:200,center:new n.Vector3(0,85,70),anchors:La,ground:!0,groundY:-.6,uniforms:U,wet:{dir:new n.Vector2(mt.x*At,mt.y),frontAt:da},strata:{texture:le.tex,nBed:new n.Vector3(Ae.x*At,Ae.y,Ae.z),b0:pt,span:kt},heightAt:(e,t)=>O(e*At,t),bakeAt(e,t,a){const r=Math.min(y-1.001,Math.max(0,(e*At-R)/(Me-R)*y-.5)),s=Math.min(Q-1.001,Math.max(0,(t-we)/(it-we)*Q-.5)),c=r|0,o=s|0,l=r-c,f=s-o,p=(o*y+c)*4,h=p+y*4;return a[0]=((de[p+2]*(1-l)+de[p+6]*l)*(1-f)+(de[h+2]*(1-l)+de[h+6]*l)*f)/255,a[1]=((de[p+3]*(1-l)+de[p+7]*l)*(1-f)+(de[h+3]*(1-l)+de[h+7]*l)*f)/255,a},setProgress(e){ua=!0,Wt(e)},setCloudBreadth(e){e>0&&(fa=e,Wt(pa))},setLight({sunDir:e,sunColor:t,sunIntensity:a,skyColor:r,skyIntensity:s}={}){if(e&&(Qt=e.clone().normalize()),t){const c=new n.Color(t),o=a??se.sunI;U.uSunCol.value.set(c.r*o,c.g*o,c.b*o)}if(r){const c=new n.Color(r),o=s??se.skyI;U.uSkyCol.value.set(c.r*o,c.g*o,c.b*o)}},update(e,t,a){U.uTime.value=t,et.updateWorldMatrix(!0,!1),Yt.copy(et.matrixWorld).invert(),a&&U.uCam.value.setFromMatrixPosition(a.matrixWorld).applyMatrix4(Yt),Qt&&(qt.copy(Qt).transformDirection(Yt),qt.y<.03&&(qt.y=.03),U.uSun.value.copy(qt.normalize())),ua||Wt(.33+.45*((t+10)/30%1));const r=(U.uCam.value.x-m.gx)*j.x+(U.uCam.value.z-m.gz)*j.z>560;for(const s of ra)s.g.setDrawRange(r?s.wall:0,r?s.all-s.wall:s.all)},dispose(){}}}export{It as GLSL_COMMON,Jt as ROCK_FS,$t as ROCK_VS,Ua as buildHero};
