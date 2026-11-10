import*as h from"three";import{clamp as it,lerp as ue,smoothstep as _}from"../kit/core.js";import{makeRng as Vt}from"../kit/core.js";const Ut=["#CDA96A","#4A3320","#2E8C6A","#1D4FA6","#E9C55A","#F1EADB","#C23B22"],x=480,$e=`
uniform float uTime;
uniform vec4 uGlance;      // xz: unit direction of travel in world space, z: position of the band centre along it, w: half width
uniform vec3 uCrease;      // three bearings (radians) of the old creases in the silk
uniform vec3 cSilk, cInk, cMal, cAzu, cGold, cShell, cVerm;
uniform float uWeave;      // weave contrast (0.05)
float h11(float p){ p = fract(p * .1031); p *= p + 33.33; p *= p + p; return fract(p); }
float h21(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
vec2 h22(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz) * q.zy); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float fbm(vec2 p){ return vn(p) * .5 + vn(p * 2.03 + 7.1) * .3 + vn(p * 4.11 + 3.7) * .2; }
// The weave of the cloth lives on the view direction, so sky, lake, mist, falls and thin pigment are one sheet.
// d: direction from the eye (need not be unit, never zero). Returns (weave -1..1, crease 0..1, rub 0..1).
vec3 silkTex(vec3 d){
  float lxz = max(length(d.xz), 1e-5);
  float az = atan(d.x, d.z + (abs(d.x) + abs(d.z) < 1e-6 ? 1e-5 : 0.));
  float el = atan(d.y, lxz);
  vec3 dn = d / max(length(d), 1e-5);
  float fw = (length(dFdx(dn)) + length(dFdy(dn))) * 200.;        // threads per pixel (thread pitch 1/200 rad)
  float fade = 1. - smoothstep(.22, .55, fw);
  fade *= smoothstep(.02, .2, lxz / max(length(d), 1e-5));         // no moire at the poles
  vec2 w = vec2(az, el) * 200. * 3.14159265;
  float weave = sin(w.x) * sin(w.y) * .7 + sin(w.y * 2.) * .3;     // plain weave, weft a little heavier
  weave += (h21(floor(vec2(az * 200., el * 23.))) - .5) * .5;      // slubs: uneven threads
  float cr = 0.;
  for (int i = 0; i < 3; i++) {
    float a = uCrease[i];
    float da = abs(atan(sin(az - a), cos(az - a))) + el * .004 * sin(el * 9. + float(i) * 2.);
    cr = max(cr, exp(-da * da * 60000.) + .35 * exp(-da * da * 2500.));
  }
  cr *= 1. - smoothstep(.30, .62, abs(el));                         // a crease is an upright seam: it is rubbed out before it can fan toward the zenith
  float rub = smoothstep(.62, .8, fbm(vec2(az * 2.2, el * 3.1) + 4.));
  return vec3(weave * fade, cr, rub);
}
vec3 silkCol(vec3 d){
  vec3 t = silkTex(d);
  return cSilk * (1. + uWeave * t.x + .07 * t.y + .045 * t.z);
}
// the glance: 0..1 inside the gleam band that crosses the world
float glanceAt(vec3 wp){
  float q = dot(wp.xz, uGlance.xy) - uGlance.z;
  float g = 1. - smoothstep(uGlance.w * .35, uGlance.w, abs(q));
  return g;
}
`,At=`
varying vec3 vW;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.);
  vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,rt=`
varying vec3 vW;
#ifdef MIST
varying vec2 vUv;
uniform float uDrift;     // scallops slide sideways, in uv per second
uniform float uScal;      // scallops across the sheet (x pi)
uniform vec3 uEdge;       // softness of the scalloped top edge (0.42 soft .. 0.05 drawn), taper of the ends, fade of the foot
#endif
#ifdef FALL
varying vec2 vUv;
uniform vec3 uFall;        // x: thread count, y: fall height in metres, z: scroll speed m/s
#endif
#ifdef LAKE
uniform vec4 uBridge;      // x: world z of the bridge line, y: half length, z: trestle spacing, w: deck height above the lake
uniform vec4 uShore;       // x: world z of the far shore, y: +1/-1 side the land lies on, z: lake y, w: ripple reach (60)
uniform vec4 uRipple[6];   // xz: world centre, z: radius of a ripple patch (boats, pools); w: strength
#endif
${$e}
#ifdef LAKE
// fish-scale ripples: rows of overlapping arcs, ink-thin, lit row by row so that they step outward.
// k: size of the net (1 = arcs 3.2 m wide in rows 1.5 m apart); q: metres of water under one pixel. The line keeps the
// weight of a brush line at any size: it thins with distance and is never fatter than a couple of pixels.
float scales(vec2 p, float k, float q, float qt){
  vec2 c = p / (vec2(3.2, 1.5) * k);
  float fw = q / (1.5 * k);
  float row = floor(c.y);
  c.x += mod(row, 2.) * .5;
  vec2 f = vec2(fract(c.x) - .5, fract(c.y));
  float d = abs(length(vec2(f.x * 3.2, f.y * 1.5 + .9)) - 1.85);
  float aa = max(qt / k * 1.3, .004);
  float lw = clamp(qt / k * .75, .006, .05);
  float line = 1. - smoothstep(lw, lw + aa, d);
  float stepv = fract(row * .25 - floor(uTime * 2.5) * .25);
  float lit = step(stepv, .3);
  line = max(line, lit * (1. - smoothstep(lw * 1.7, lw * 1.7 + aa, d)));
  line *= .3 + .7 * lit;
  return line;
}
// THE WATER IS DRAWN: the fish-net wave pattern over the whole lake, in four sizes of net chosen by how much water lies
// under a pixel, so that rows stay 5 to 20 pixels apart from the bluff, from the dive and from 4 m up. Near the lens only the
// largest net is drawn (long slow swell lines), so nothing fine flickers under a fast camera.
float waveNet(vec2 p, float q, float qt){
  float r1 = q, r2 = q / 3.3, r3 = q / 11., r4 = q / 36.;
  float n = scales(p, 1., q, qt) * (1. - smoothstep(.22, .33, r1));
  n = max(n, scales(p + 3.7, 3.3, q, qt) * smoothstep(.06, .09, r2) * (1. - smoothstep(.22, .33, r2)));
  n = max(n, scales(p + 9.1, 11., q, qt) * smoothstep(.06, .09, r3) * (1. - smoothstep(.22, .33, r3)));
  n = max(n, scales(p + 21.3, 36., q, qt) * smoothstep(.06, .09, r4) * (1. - smoothstep(.24, .4, r4)));
  return n;
}
#endif
void main(){
  vec3 d = vW - cameraPosition;
  vec3 col = silkCol(d);
  float a = 1.;
#ifdef LAKE
  float m = 0.;
  float dz = abs(vW.z - uBridge.x);
  m = max(m, (1. - smoothstep(14., uShore.w, dz)) * step(abs(vW.x), uBridge.y + 30.));
  float sh = (uShore.x - vW.z) * uShore.y + (fbm(vW.xx * .013) - .5) * 60.;
  m = max(m, 1. - smoothstep(10., uShore.w, abs(sh)));
  for (int i = 0; i < 6; i++) {
    float r = length(vW.xz - uRipple[i].xy);
    m = max(m, uRipple[i].w * (1. - smoothstep(uRipple[i].z * .4, uRipple[i].z, r)));
  }
  m *= .55 + .45 * smoothstep(.35, .6, fbm(vW.xz * .045 + 3.));
  float wq = max(fwidth(vW.x), fwidth(vW.z));
  float hd = length(vW.xz - cameraPosition.xz);
  float wqt = wq;
  wq = max(wq, .9 * (1. - smoothstep(10., 34., hd)));
  float wpat = fbm(vW.xz * vec2(.011, .034) + 9.);          // long runs of drawn waves with quieter water between
  m = max(m, .44 + .46 * smoothstep(.3, .6, wpat));
  float sc = waveNet(vW.xz, wq, wqt);
  col = mix(col, mix(cSilk, cInk, .62), sc * m * .75);
  // the bridge mirrored as broken ink dashes: true planar reflection of posts and deck, drawn as dashes
  vec2 C = cameraPosition.xz; float camH = max(cameraPosition.y - uShore.z, .5);
  float den = vW.z - C.y; den = abs(den) < 1e-3 ? 1e-3 : den;
  float tt = (uBridge.x - C.y) / den;                       // ray from the eye's foot through this point reaches the bridge at tt
  {
    float msk = step(1.0001, tt); tt = max(tt, 1.0001);
    float xb = C.x + (vW.x - C.x) * tt;
    float tq = 1. - 1. / tt;                                // 0 at the eye's foot, 1 at the bridge
    float h = camH * (tt - 1.) + tq * 0.;                    // height of the thing mirrored at this point of the water
    float wob = sin(h * 2.3 + uTime * 1.7 + xb * .2) * .22 + sin(h * .9 - uTime * 1.1) * .15;
    float k = xb / uBridge.z; float dx = abs(k - floor(k + .5)) * uBridge.z + wob * (.3 + h * .06);
    float wpx = fwidth(xb) * 1.2;
    float gap = step(uBridge.z * .5 + .5, abs(xb));        // centre span: no trestle on the axis
    float post = (1. - smoothstep(.5, .5 + wpx + 1e-4, abs(dx - 1.6))) * step(h, uBridge.w) * gap;
    float hpx = fwidth(h) * 1.2;
    float deck = 1. - smoothstep(.7, .7 + hpx + 1e-4, abs(h - uBridge.w - .5 + wob * .8));
    float dash = step(.38, fract(h * .42 - uTime * .35 + h21(vec2(floor(k + .5), 3.)) ));
    float dashd = step(.3, fract(xb * .16 + sin(uTime * .8 + xb * .05) * .3));
    float inb = step(abs(xb), uBridge.y) * msk;
    float refl = max(post * dash, deck * dashd) * inb * (1. - smoothstep(.0, 1., max(wpx * .25, hpx * .4)));
    col = mix(col, mix(cSilk, cInk, .8), refl * .62);
  }
#endif
#ifdef FALL
  // forty threads of bare silk between ink lines: the lines are broken strokes that run down
  float u = vUv.x * uFall.x;
  float fu = fwidth(u);
  float id = floor(u);
  float y = vUv.y * uFall.y + uTime * uFall.z * (.8 + .4 * h11(id + 3.));
  float seg = fract(y / (9. + 8. * h11(id)) + h11(id * 7.1));
  float on = smoothstep(.0, .08, seg) * (1. - smoothstep(.55 + .3 * h11(id + 9.), .9, seg));
  on *= .35 + .65 * smoothstep(.12, .3, fract(y / 2.6 + h11(id * 3.3)));        // the stroke is laid in short running touches
  float lw = .09 + .05 * h11(id + 5.);
  float ln = 1. - smoothstep(lw, lw + max(fu, .02) * 1.3, abs(fract(u) - .5 + .12 * sin(y * .35 + id)));
  float edge = smoothstep(.0, .04, vUv.x) * (1. - smoothstep(.96, 1., vUv.x));
  ln *= on * (1. - smoothstep(.3, .7, fu));
  float u4 = vUv.x * uFall.x * .25, f4 = fu * .25, id4 = floor(u4);
  float y4 = vUv.y * uFall.y + uTime * uFall.z * (.8 + .4 * h11(id4 + 3.));
  float seg4 = fract(y4 / (16. + 9. * h11(id4)) + h11(id4 * 7.1));
  float ln4 = (1. - smoothstep(.1, .1 + max(f4, .02) * 1.3, abs(fract(u4) - .5))) * smoothstep(.0, .08, seg4) * (1. - smoothstep(.6, .9, seg4));
  ln = max(ln, ln4 * smoothstep(.3, .7, fu) * (1. - smoothstep(.5, 1.2, f4)));
  col = mix(col, mix(cSilk, cInk, .85), ln * .8 * edge);
  col = mix(col, cSilk * 1.06, (1. - ln) * .5);           // the unpainted threads: a breath lighter than the worn sheet
#endif
#ifdef MIST
  float mx = vUv.x + uDrift * uTime;
  // MIST IS DRAWN: bare silk below a crisp row of round-topped scallops, the row outlined with one ink line a pixel or two
  // wide and a broken second row of curls under it; no gradient anywhere (uEdge.x: height of a lobe, as a fraction of the sheet)
  float sc2 = abs(sin(mx * uScal + sin(mx * uScal * .325) * 2.));
  float top = .5 - uEdge.x * (1. - sc2);
  float ey = max(fwidth(vUv.y), 1e-5);
  a = 1. - smoothstep(top - ey, top + ey, vUv.y);
  float ln = 1. - smoothstep(ey * .9, ey * 2.2, abs(vUv.y - top));
  float mx2 = mx * uScal * 1.31 + 1.7;
  float sc3 = abs(sin(mx2 + sin(mx2 * .29) * 2.));
  float top2 = .5 - uEdge.x * 1.7 - uEdge.x * .8 * (1. - sc3);
  float ln2 = (1. - smoothstep(ey * .7, ey * 1.8, abs(vUv.y - top2))) * step(.4, fract(mx * uScal * .083));
  col = mix(col, mix(cSilk, cInk, .7), max(ln * .8, ln2 * .5));
  a = max(a, ln) * smoothstep(0., uEdge.y, vUv.x) * (1. - smoothstep(1. - uEdge.y, 1., vUv.x));
#endif
  gl_FragColor = vec4(col, a);
}`,ut=`
varying vec3 vW; varying vec2 vUv;
void main(){
  vUv = uv;
  vec4 w = modelMatrix * vec4(position, 1.);
  vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,Pt=`
varying vec3 vW;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.);
  vW = w.xyz;
  vec4 p = projectionMatrix * viewMatrix * w;
  if (abs(p.w) < 1e-4) p.w = 1e-4;
  gl_Position = p.xyww;
}`,Ot=`
attribute vec3 aCoat;
varying vec3 vW; varying vec3 vCoat;
#ifdef GORGE
attribute vec3 aFold; varying vec3 vFold; varying vec3 vL;
#endif
void main(){
  vCoat = aCoat;
#ifdef GORGE
  vFold = aFold; vL = position;
#endif
  vec4 w = modelMatrix * vec4(position, 1.);
  vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,_t=`
varying vec3 vW; varying vec3 vCoat;
uniform vec2 uRange;       // world y of the foot and of the summit of this range
uniform vec2 uBands;       // normalised heights where umber gives way to malachite and malachite to azurite
uniform vec2 uCoatT;       // seconds since the second / third coat was begun at the summit (negative: not yet)
uniform float uSpeed;      // metres per second the coat settles downhill
uniform float uCap;        // highest coat this range may ever wear (far ranges 2.6 .. 1.0)
uniform float uWinter;     // 1: third coat on the crown is shell white
uniform float uThin;       // strength of the first coat (1 = the stain of the brief, 0.15 = underdrawing only)
uniform float uFlake;      // how much more the paint has flaked (0 .. 0.08)
uniform float uStroke;     // strength of the ink texture strokes (1; 1.8 for the light colourway)
uniform vec4 uScar;        // xz: world centre, z: radius, w: 1 = bare silk (a plate has lifted), 0 = healed
uniform float uRun;        // far ranges: metres (of the range's own model) the coat front runs from summit to foot
uniform float uFlat;       // 1: a far range, a flat silhouette banded by height: no tone follows the mesh, folds are drawn lines only
#ifdef GORGE
varying vec3 vL;           // position in the mountain's own frame
varying vec3 vFold;        // x: fold coordinate (valley at whole numbers), y: weight, z: metres above the local foot
uniform vec4 uFalls[3];    // the falls, left unpainted: x: world x of the column, y: half width, z/w: world z where it begins and ends
uniform float uFallRun;    // metres per second the ink touches run down
uniform vec3 uFoot;         // the mountain's own z of the foot of each fall (spray is drawn there)
#endif
${$e}
#ifdef GORGE
// one set of n falling threads across the column: broken ink strokes, each running at its own speed
float fallThreads(float ux, float n, float run, float f1, float sd, float f0, float fk){
  float u = ux * n, id = floor(u) + sd * 13., fu = f1 * n;
  float y = run + uTime * uFallRun * (.55 + .9 * h11(id + 3.));
  float seg = fract(y / (9. + 12. * h11(id)) + h11(id * 7.1));
  float on = smoothstep(0., .08, seg) * (1. - smoothstep(.5 + .3 * h11(id + 9.), .92, seg));
  float lw = max((.05 + .04 * h11(id + 5.)) * min(1., n / 22.), fu * .55);          // every thread a few centimetres of ink, whatever its set
  float ln = (1. - smoothstep(lw, lw + max(fu, .01) * 1.3, abs(fract(u) - .5 + .16 * min(1., n / 22.) * sin(y * .21 + id)))) * on;
  return ln * (1. - fk * smoothstep(f0, f0 * 2.5, fu)) * clamp(.1 / lw, 0., 1.);
}
#endif
void main(){
  vec3 d = vW - cameraPosition;
  vec3 st = silkTex(d);
  vec3 silk = cSilk * (1. + uWeave * st.x + .07 * st.y + .045 * st.z);
  vec3 vC = vCoat;
#ifdef GORGE
  float gW = clamp(vFold.y, 0., 1.);
  float gF = fract(vFold.x);
  float gT = abs(gF - .5) * 2.;                             // 1 in the valley of a fold, 0 on its ridge
  vC.z = mix(vC.z, (1. - gT) * 26., gW);
  vC.y = mix(vC.y, gT * gT * .9 - .25, gW);
#endif
  float hollow = clamp(vC.y, 0., 1.);      // negative values mark carved floors: they keep to the lower band
  float hN = (vW.y - uRange.x) / max(uRange.y - uRange.x, 1.);
  float n1 = fbm(vW.xz * .021 + 5.), n2 = vn(vW.xz * .23 + vW.y * .11);
  float hd = hN + (n1 - .5) * .14 + (n2 - .5) * .035 + clamp(vC.y, -1., 1.) * .10 * (1. - uFlat);
  float e = clamp(fwidth(hd) * .9, 1e-5, .009);      // a band edge is a deckled EDGE: on a face seen at a grazing angle it must not widen into a soft gradient
#ifdef GORGE
  float bM = smoothstep(uBands.x - e, uBands.x + e, hd + .07 * gW);     // in the gorge every step has its own umber foot (below), so the green comes lower
#else
  float bM = smoothstep(uBands.x - e, uBands.x + e, hd);
#endif
  float bA = smoothstep(uBands.y - e, uBands.y + e, hd);
  vec3 foot = mix(cSilk, cInk, .6);
#ifdef GORGE
  // EVERY BUTTRESS IS A CRAG OF ITS OWN, banded by its own height as the scroll bands its stacked rocks: an umber foot, malachite,
  // a cap of azurite, then the next crag above it; each fold steps its bands against its neighbour's at the ink crease, and
  // every band edge is deckled and sags in the cleft.
  float cgId = floor(vFold.x * 2.);                           // each flank of each fold: the cap steps at the gold ridge and at the ink crease
  float cgQ = gW + (n2 - .5) * .35, cgQe = clamp(fwidth(cgQ), .01, .08);
  float cgW = smoothstep(.5 - cgQe, .5 + cgQe, cgQ);          // where the fold is drawn at all: it ends at a deckled edge, never in a fade
  float cgOq = vFold.y + (n2 - .5) * .08, cgOe = clamp(fwidth(cgOq), .004, .03);
    float cgO = smoothstep(1.27 - cgOe, 1.27 + cgOe, cgOq);                 // the hut's outcrop (weight 1.5): drawn like a lake rock, flat fills and ink creases
  float cgM = cgW * (1. - cgO);
  float cgIq = vFold.y + (n2 - .5) * .05, cgIe = clamp(fwidth(cgIq), .004, .02);
  float cgIn = smoothstep(1.06 - cgIe, 1.06 + cgIe, cgIq);    // weights above 1 mark the gorge proper
  // ONE CAP TO A SPUR: umber foot, malachite body, azurite on its top third and nowhere below; the height is the spur's own
  // (metres above the floor it stands on), the edge deckled and sagging in the cleft
  float cgZ = vFold.z + (n1 - .5) * 10. + (n2 - .5) * 4. - gT * 5.;
  float cgE = clamp(fwidth(cgZ) * .9, .03, .8);
  float cgTop = 31. + 8. * h11(cgId * 3.7 + 1.3);
  // the caps are laid as we come near (every range's coat advances as we approach): patch by patch, each with a crisp edge.
  // From the bluff, and through the portal before we arrive, the heart of the peak is one field of malachite under the blue crown.
  float cgNq = (1. - smoothstep(190., 360., length(d))) + (n1 - .5) * .5;
  float cgCap = smoothstep(cgTop - cgE, cgTop + cgE, cgZ) * cgM * smoothstep(.48, .52, cgNq);
  bA = max(bA, cgCap * cgIn);
  bM = max(bM, cgCap);
#endif
  vec3 pig = mix(foot, cMal, bM);
  pig = mix(pig, cAzu, bA);
#ifdef GORGE
  pig = mix(pig, mix(cMal, cInk, .4), cgCap * (1. - cgIn) * (1. - bA) * .9);      // on the open flank the caps are deep green, malachite over ink: the peak stays green from the bluff
#endif
#ifdef GORGE
  // every step of the gorge has its own foot: the umber wash shows through in the lower part of each cliff, deckled, lower in the folds
  float gz = vFold.z + (n1 - .5) * 12. + (n2 - .5) * 5. + gT * 6.;
  float gze = clamp(fwidth(gz), .04, .7);
  float gFoot = cgW * (1. - smoothstep(7. - gze, 7. + gze, gz));      // the umber foot stops at a deckled edge too
  pig = mix(pig, foot, gFoot);
  bA *= 1. - gFoot;                                                    // the umber foot takes no blue: the third coat lies on the crag above it, never on the wash (umber under azurite is a colour outside the seven)
#endif
  // where two bands meet the upper one ends in a darker bead, as wet pigment does
  float bead = (1. - smoothstep(.004 - e, .004 + e, hd - uBands.x)) * bM + (1. - smoothstep(.004 - e, .004 + e, hd - uBands.y)) * bA;
  // the coats
  vec2 gp = vW.xz + vW.y * vec2(.37, .61);
  float rag = (fbm(gp * .045 + 11.) - .5) * 26. + (vn(gp * .4) - .5) * 5.;
  rag += (fbm(gp * .0035 + 3.) - .5) * 110. * uFlat;         // on a far range the front is ragged at the size it is seen at
  float dist = max(mix(vC.x * (1. - .4 * hollow), (1. - hN) * uRun, uFlat) + rag, 0.);   // a far range takes its coat by height: the front is a ragged level line, no edge of the mesh shows
  float age2 = uCoatT.x - dist / max(uSpeed, .1);
  float age3 = uCoatT.y - dist / max(uSpeed, .1);
  float aw = clamp(fwidth(age2) * 1.2, .012, .22);             // the front of a coat is an edge of wet paint, a pixel or two wide at any distance, never a soft ramp
  float k2 = smoothstep(0., aw, age2) * clamp(uCap - 1., 0., 1.);
  float k3 = smoothstep(0., aw, age3) * clamp(uCap - 2., 0., 1.);
  // wet paint behind the front is a darker FLAT tone that ends at a deckled edge, and a darker lip at the front itself: never a ramp
  float wn = (vn(vW.xz * .23 + vW.y * .11) - .5), we = clamp(aw * 1.5, .02, .3);
  float wet = max(k2 * (1. - smoothstep(1.9 - we, 1.9 + we, age2 + wn * 1.3)), k3 * (1. - smoothstep(1.9 - we, 1.9 + we, age3 + wn * 1.3)));
  float lip = max(k2 * (1. - smoothstep(.45 - we, .45 + we, age2 + wn * .3)), k3 * (1. - smoothstep(.45 - we, .45 + we, age3 + wn * .3)));
  float valley = 1. - smoothstep(0., 16., vC.z);
  float grain = vn(gp * 2.6) * .6 + vn(gp * 6.3 + 3.) * .4;
  // pigment pools in the folds: a darker FLAT tone that ends at a deckled edge part way up each flank, never a ramp across the
  // fold (and never on a far range: there it would follow the mesh)
  float pz = vC.z + (n2 - .5) * 7. + (vn(gp * .19 + 2.) - .5) * 9.;
  float pze = clamp(fwidth(pz) * .9, .03, 1.2);
  float fold = mix(mix(.74, 1.03, smoothstep(8.5 - pze, 8.5 + pze, pz)), 1., uFlat);
  valley = (1. - smoothstep(3.5 - pze, 3.5 + pze, pz)) * (1. - uFlat);
  vec3 c1 = mix(silk, mix(pig, cMal, bA * .92) * mix(1., fold, .6) * (1. + uWeave * st.x), (.45 - .1 * (n2 - .5)) * uThin);
  float gf = fwidth(gp.x) + fwidth(gp.y);
  float speck = (vn(gp * 7.) * .6 + vn(gp * 17.) * .4 - .5) * (1. - smoothstep(.05, .35, gf));     // mineral grain, seen from near
  float tq = (hN + (n1 - .5) * .5) * 16.; float tf = fwidth(tq);
  float tide = (1. - smoothstep(.015, .015 + tf * 1.3 + 1e-4, abs(fract(tq) - .5))) * (1. - smoothstep(.12, .3, tf)) * step(.45, n2);   // drying lines of the wash
  vec3 c2 = pig * fold * (.97 + .06 * grain + .22 * speck) * (1. - .2 * tide);
  vec3 deep = mix(pig, uWinter > .5 ? cShell : cAzu * .8, bA * (uWinter > .5 ? .93 : .55));
  vec3 c3 = deep * mix(.60 + .34 * smoothstep(.25, .75, grain) + .4 * speck, .9 + .1 * smoothstep(.25, .75, grain) + .1 * speck, uWinter * bA) * fold * (1. - .12 * valley);
  c3 = mix(c2, c3, .35 + .65 * bA);                           // the third coat is the blue: lower bands only deepen a little
  vec3 col = mix(c1, c2, k2);
  col = mix(col, mix(cMal, cAzu, .62) * 1.12, bA * 4. * k2 * (1. - k2) * .8);    // a half-laid blue coat on tea silk stays a blue-green of azurite's own hue, never the grey-violet of a plain mix
  col = mix(col, c3, k3);
  col *= 1. - .12 * bead * (k2 * .7 + .3);
  col *= 1. - .16 * wet - .16 * lip;
#ifdef GORGE
  {
    // THE COAT MODELS THE FOLD, in flat tones with deckled edges: beside every gold ridge one flank was laid thin (the stain,
    // weave showing), the paint lies thick and dark in the crease, and the brush's upright strokes show between.
    float gpp = length(fwidth(vW));
    float nb = (vn(vec2(vFold.x * 2.3, vW.y * .13)) - .5) * .22 + (vn(vec2(vW.y * .8, vFold.x * 7.)) - .5) * .07;
    float fg = fwidth(gT) * 1.2 + .012;
    float gq = gW + nb * 1.3, ge = clamp(fwidth(gq), .01, .08);
    float gWe = smoothstep(.5 - ge, .5 + ge, gq);              // where the fold's drawing ends it ends at a deckled edge, never in a fade
    float pale = step(.5, gF) * (1. - smoothstep(.3 + nb, .3 + nb + fg, gT)) * gWe * (1. - cgO);
    vec3 stain = mix(silk, mix(pig, cMal, bA * .8) * (1. + uWeave * st.x), .5 * uThin);     // under the blue the first coat is green
    col = mix(col, stain, pale * .5 * (1. - k2));
    col *= 1. + .06 * pale * k2;
    float pool = smoothstep(.6 + nb, .6 + nb + fg, gT) * gWe * (1. - pale);
    col *= 1. - .17 * pool * k2;
    float q2 = vFold.x * 4. + (vn(vec2(vW.y * .08, vFold.x * .9)) - .5) * .9;
    float f2 = fwidth(q2), id2 = floor(q2);
    float bq2 = vn(vec2(id2 * 5.1, vW.y * .15 + id2 * 2.3)), be2 = clamp(fwidth(bq2) * 1.2, .004, .04);
    float brk2 = smoothstep(.6 - be2, .6 + be2, bq2);            // few, long, crisp: a wash of fine half-seen touches reads as blur
    float hemp = (1. - smoothstep(min(.07, f2 * 4.), min(.07, f2 * 4.) + f2 * 1.2 + 1e-4, abs(fract(q2) - .5))) * brk2 * (1. - smoothstep(.12, .28, f2)) * (1. - smoothstep(.2, .4, gpp)) * cgM;
    col = mix(col, mix(cInk, col, .25), clamp(hemp * (.5 + .25 * pale) * min(uStroke, 1.5), 0., 1.));
  }
#endif
  // flakes: thick paint has let go in patches and the silk shows, with a dark rim
  float fl = fbm(gp * .17 + 31.) + (vn(gp * .9) - .5) * .06 - .1 * (1. - smoothstep(.4, .6, vn(gp * .02 + 9.)));
  fl += uFlake;
  float fle = clamp(fwidth(fl), .0012, .005);
  float fk = smoothstep(.705 - fle, .705 + fle, fl) * k2;        // a flaked patch has a broken edge, sharp at any distance
  col = mix(col, silk * .97, fk * .9);
  col *= 1. - .25 * k2 * smoothstep(.685, .70, fl) * (1. - smoothstep(.705 - fle, .705 + fle, fl));
  // the scar where a plate of pigment lifted: bare silk with a dark rim, until the last coat fills it
  float sr = length(vW.xz - uScar.xy) / max(uScar.z, 1.) + (vn(gp * .12) - .5) * .25;
  float scar = (1. - smoothstep(.92, .96, sr + (1. - uScar.w) * .9)) * step(.001, uScar.w);
  col = mix(col, silk * .98, scar);
  col *= 1. - .3 * uScar.w * smoothstep(.86, .96, sr) * (1. - smoothstep(.96, 1.02, sr));
  // valley creases: an ink-umber line where two slopes meet
  float cw = fwidth(vC.z);
  float cz = vC.z + (n2 - .5) * .35, cze = fwidth(cz) * .9 + 1e-4;
  float cl = (1. - smoothstep(.9 - cze, .9 + cze, cz)) * (1. - uFlat);      // the crease is a drawn line with a deckled edge; a far range has the dry line below instead
  col = mix(col, mix(cInk, col, .25), cl * (.55 + .25 * k2) * (1. - smoothstep(3., 9., cw)) * smoothstep(.002, .008, cw));
  // on a far range the crease is a single dry ink line a pixel wide, broken where the brush lifted
  float clf = (1. - smoothstep(cw * .7, cw * 1.5 + 1e-4, vC.z)) * step(.38, vn(vW.xz * .012 + vW.y * .02)) * uFlat * smoothstep(.01, .05, cw);
  col = mix(col, mix(cInk, col, .3), clf * .6);
  // texture strokes: on steep faces the ink underdrawing shows as broken upright strokes, plainest under a thin coat
  vec3 fn = cross(dFdx(vW), dFdy(vW)); float fnl = length(fn);
  float ny = fnl > 1e-10 ? abs(fn.y) / fnl : 1.;
  float mpp = length(fwidth(vW));                               // metres under one pixel
  float sAx = abs(fn.x) > abs(fn.z) ? vW.z * 1.03 + vW.x * .2 : vW.x * 1.03 + vW.z * .2;      // strokes stand upright ACROSS the face they are on (a face lying along one fixed axis would be inked whole)
  float sc = sAx / 2.3 + (vn(vec2(vW.y * .06, sAx * .02)) - .5) * 1.6;
  float sf = fwidth(sc), sid = floor(sc);
  float bq = vn(vec2(sid * 7.3, vW.y * .085 + sid * 1.7)), be = clamp(fwidth(bq) * 1.2, .004, .04);
  float brk = smoothstep(.5 - be, .5 + be, bq);
  float um = 1. - bM;                                          // the umber foot is all drawing: its strokes are plainer and lie on gentler ground too
  float stroke = (1. - smoothstep(min(.05, sf * 3.), min(.05, sf * 3.) + sf * 1.2 + 1e-4, abs(fract(sc) - .5))) * brk * (1. - smoothstep(.36 + .34 * um, .6 + .34 * um, ny)) * (1. - smoothstep(.13, .3, sf)) * (1. - smoothstep(.3, .6, mpp)) * (1. - uFlat);
#ifdef GORGE
  stroke *= (1. - cgO) * (1. - .5 * cgW);
#endif
  col = mix(col, mix(cInk, col, .2), clamp(stroke * (.5 - .14 * k2 - .2 * k3 + .28 * um) * max(uStroke, um), 0., 1.));
#ifdef GORGE
  {
    // THE FALL'S GROUND IS NOT PAINTED (since the fifth version the main fall carries running threads of shell white, laid in the loop
    // below: a departure from the brief's letter, named in that version's notes). The pigment stops at a deckled edge and the bare silk of the sky shows; the water is drawn the
    // way the painter draws it: many fine broken ink threads running down at different speeds (a coarse set seen from the lake,
    // a fine set that appears as the eye comes near), and at the foot a mound of spray scallops, bare silk outlined in ink.
    float run = vL.y - vL.z * .45, fx = fwidth(vL.x) + 1e-4;
    float fv = fx + fwidth(vFold.z) + fwidth(vL.z);
    float face = smoothstep(2.3, 2.7, vFold.z + (n2 - .5) * 1.5);
    float v = -1e3;                                             // metres above the foot of the nearest fall, along the water
    for (int k = 0; k < 3; k++) { float dz = vL.z - uFoot[k]; if (dz > -18. && dz < 14.) v = vFold.z - max(dz, 0.); }
    for (int i = 0; i < 3; i++) {
      vec4 F = uFalls[i]; float fi = float(i);
      float hw = F.y * (1. + .3 * (vn(vec2(run * .045, fi * 7.3)) - .5));
      float xx = vL.x - F.x - sin(run * .043 + fi * 2.1) * F.y * .22;
      float sd = xx < 0. ? 3.7 : 8.3;
      float dk = (vn(vec2(run * .5, sd + fi)) - .5) * 1.6 + (vn(vec2(run * 2.1, sd * 2.3)) - .5) * .6;
      float ed = abs(xx) - hw - dk * min(1., F.y * .35);
      float inz = smoothstep(F.z - 3., F.z + 1., vL.z + dk * 2.) * (1. - smoothstep(F.w - 1., F.w + 3., vL.z + dk * 2.));
      if (i > 0) inz = step(.5, inz) * face * (1. - cgO) * cgW;                                   // a rill is a thread on the cliff, never a road across the ledge
      float m = (1. - smoothstep(-fx, fx, ed)) * inz;
      float ux = xx / max(hw, .1) * .5 + .5, f1 = fx / max(2. * hw, .2);
      float ln = i == 0 ? max(fallThreads(ux, 7., run, f1, 0., .5, .6) * (.6 + .4 * smoothstep(.2, .5, f1 * 31.)), fallThreads(ux, 31., run, f1, 5., .2, 1.)) : fallThreads(ux, 2., run, f1, 3. + fi, .5, .6);
      ln *= mix(.4, 1., smoothstep(.5, 3., vFold.z));           // on the level ledge the stream is nearly bare: the threads belong to the fall
      float bead = (1. - smoothstep(0., .9, ed)) * (1. - m) * inz;
      col *= 1. - .3 * bead;
      col = mix(col, mix(silk, mix(cSilk, cInk, .82), ln * .68), m);
      if (i == 0) { float wu = ux * 9., wid = floor(wu), wy = run + uTime * uFallRun * (.6 + .8 * h11(wid + 31.)), wsg = fract(wy / (14. + 10. * h11(wid + 7.)) + h11(wid * 3.3)); col = mix(col, cShell, m * .9 * smoothstep(0., .1, wsg) * (1. - smoothstep(.55, .9, wsg)) * (1. - smoothstep(.1, .11 + 1.3 * fwidth(wu), abs(fract(wu) - .5 + .14 * sin(wy * .21 + wid)))) * mix(.4, 1., smoothstep(.5, 3., vFold.z))); }   // over the bare silk and its ink threads (about a sixth of the white lies on an ink thread) the water itself runs in broken threads of shell white, nine to the fall's width, each at its own speed, matte; a thread is a fifth of its ninth wide and a pixel's soft edge more at any distance, so near the lens the threads are thin and far off they close toward a pale band
      if (i == 0) {
        float W = 1.9, cxs = floor(xx / W + .5), lx = xx / W - cxs, ex = cxs * W / max(F.y * 1.7, .1);
        float env = 1. - ex * ex;
        float topv = 5.4 * env + 1.3 * (h11(cxs + 2.) - .5);
        float fe = v - (topv + sqrt(max(.25 - lx * lx, 0.)) * W);
        float inf = step(0., env) * step(-7., v);
        float foam = (1. - smoothstep(-fv, fv, fe)) * inf;
        float rr = floor(v / 1.15), ly = v / 1.15 - rr;
        float lx2 = fract(xx / W + .5 * mod(rr, 2.) + .5) - .5;
        float lwm = max(.075, fv * .8);
        float arcs = (1. - smoothstep(lwm, lwm + fv, abs(length(vec2(lx2 * W, ly * 1.15)) - .5 * W))) * step(v, topv - .2);
        float rim = 1. - smoothstep(lwm, lwm + fv, abs(fe));
        float inkf = max(arcs * .55, rim * .8) * (1. - .7 * smoothstep(.35, 1.1, fv));
        col *= 1. - .3 * (1. - smoothstep(0., .9, fe)) * (1. - foam) * inf * (1. - m);
        col = mix(col, mix(silk, mix(cSilk, cInk, .82), inkf), max(foam, rim * inf));
      }
    }
  }
#endif
  // the glance: coarse azurite grains glint, slowly, inside the band
  float gl = glanceAt(vW);
  vec2 cell = floor(gp * .9); vec2 cf = fract(gp * .9) - .5 - (h22(cell) - .5) * .6;
  float gh = h21(cell + 17.);
  float pulse = sin(uTime * 1.9 + gh * 40.); pulse = max(pulse, 0.); pulse *= pulse;
  float pt = 1. - smoothstep(.0, .18 + fwidth(gp.x) * .9, length(cf));
  col += vec3(.55, .75, 1.) * pt * step(.82, gh) * pulse * gl * bA * max(k2, .0) * 1.1;
  gl_FragColor = vec4(col, 1.);
}`,Dt=`
attribute vec3 aDir; attribute vec2 aSide;       // aSide: x = -1/+1 across the ribbon, y = width factor (1 ridge .. 0.5 sub-spur)
uniform vec2 uRes; uniform float uGoldW; uniform vec4 uGlance;
varying vec3 vW; varying vec2 vS;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.);
  vec3 t = mat3(modelMatrix) * aDir;
  vec3 v = w.xyz - cameraPosition;
  float dist = max(length(v), .1);
  vec3 sd = cross(t, v);
  float l = length(sd);
  sd = l > 1e-5 ? sd / l : vec3(0., 1., 0.);
  float px = dist * 2. / max(projectionMatrix[1][1] * uRes.y, 1.);     // metres per pixel at this distance
  float want = uGoldW * aSide.y, least = px * 1.6;
  float wd = clamp(want, least, px * 3.);                              // GOLD IS A LINE: a hairline at any distance, never wider than three pixels; the glance lifts its colour, not its width
  w.xyz += sd * aSide.x * wd * .5;
  vW = w.xyz;
  vS = vec2(aSide.x, clamp(want / least, .0, 1.));
  vec3 wb = w.xyz - v / dist * min(1.2 + dist * .012, dist * .5);       // lifted toward the eye by a metre or two of real distance: a ribbon behind a spur stays behind it
  vec4 p = projectionMatrix * viewMatrix * w, pb = projectionMatrix * viewMatrix * vec4(wb, 1.);
  p.z = pb.z * p.w / max(pb.w, 1e-4);
  gl_Position = p;
}`,Nt=`
varying vec3 vW; varying vec2 vS;
uniform float uFarFade;    // metres beyond which sub-spur lines (width factor < .7) are dropped
${$e}
void main(){
  float gl = glanceAt(vW);
  vec3 dull = mix(cGold, cInk, .3) * .78;                               // unlit: a dull ochre, still plainly not the green beside it
  float tw = .86 + .14 * sin(vW.x * .9 + vW.z * .7 + uTime * 2.1);
  vec3 col = mix(dull, cGold * vec3(1.34, 1.1, .72) * tw, gl * gl);      // lit: warm gold, never lemon
  float a = (1. - smoothstep(.7, 1., abs(vS.x))) * mix(.6 + .4 * vS.y, 1., gl);
  gl_FragColor = vec4(col, a);
}`,jt=`
attribute vec4 aUV; attribute float aRule;
varying vec3 vW; varying vec3 vC; varying vec4 vUV; varying float vRule;
void main(){
  vC = color; vUV = aUV; vRule = aRule;
#ifdef USE_INSTANCING
  vec4 w = modelMatrix * (instanceMatrix * vec4(position, 1.));
#else
  vec4 w = modelMatrix * vec4(position, 1.);
#endif
  vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,Ht=`
varying vec3 vW; varying vec3 vC; varying vec4 vUV; varying float vRule;
uniform float uLine;       // ink line width in metres
${$e}
void main(){
  vec2 q = min(vUV.xy, vUV.zw - vUV.xy);
  vec2 fq = fwidth(vUV.xy);
  vec2 lw = max(vec2(uLine), fq * .9);
  vec2 ln2 = 1. - smoothstep(lw, lw + fq * 1.2 + 1e-4, q);
  float ln = max(ln2.x, ln2.y);
  ln *= 1. - smoothstep(.5, 1.6, max(fq.x, fq.y) / max(min(vUV.z, vUV.w), 1e-3) * 3.);    // far away: a face thinner than its own outline keeps its colour
  float sp = max(abs(vRule), 1e-3);
  float rc = vRule >= 0. ? vUV.y : vUV.x;
  float rf = fwidth(rc) / sp;
  float r = abs(fract(rc / sp) - .5);
  float rl = (1. - smoothstep(.035, .035 + rf * 1.2 + 1e-4, .5 - r)) * step(1e-3, abs(vRule)) * (1. - smoothstep(.25, .5, rf));
  vec3 ink = cInk * .9;
  vec3 col = mix(vC, ink, max(ln * .9, rl * .6));
  gl_FragColor = vec4(col, 1.);
}`,Qt=`
varying vec3 vW; varying vec2 vUv;
${$e}
void main(){
  vec2 p = vUv * 2. - 1.;
  float r = length(p), a = atan(p.y, p.x + (abs(p.x) + abs(p.y) < 1e-6 ? 1e-5 : 0.));
  float edge = .74 + .2 * sin(a * 3. + 1.3) * sin(a * 2. - .4) + (vn(p * 2.6 + 3.) - .5) * .34 + (vn(p * 9. + 1.) - .5) * .12;
  float crack = abs(vn(p * 3.1 + 17.) - .5);                       // it broke along old drying cracks
  if (r > edge || (crack < .012 && r > .32)) discard;
  vec3 st = silkTex(vW - cameraPosition);
  vec3 silk = cSilk * (1. + uWeave * st.x);
  vec2 gp = p * 15.;
  float grain = vn(gp * 2.6) * .6 + vn(gp * 6.3 + 3.) * .4, speck = vn(gp * 9.) * .6 + vn(gp * 21.) * .4 - .5;
  float rim = smoothstep(edge - .09, edge, r);
  vec3 face = cAzu * (.66 + .26 * smoothstep(.25, .75, grain) + .34 * speck) * (1. - .28 * rim);
  face = mix(face, silk * .97, smoothstep(.73, .74, fbm(p * 4. + 9.)));          // small losses
  float soak = smoothstep(.42, .68, fbm(p * 3.3 + 5.)) * .06 + smoothstep(edge - .04, edge, r) * .5;
  soak = max(soak, smoothstep(.49, .5, fbm(p * 2.7 + 5.) + (vn(p * 11.) - .5) * .08));      // the back: blue has soaked through the silk in deckled patches, so it is plainly the back of a blue leaf
  vec3 back = mix(silk * .9, cAzu * .8, soak);
  back = mix(back, mix(cSilk, cInk, .7), .55 * smoothstep(edge - .075, edge - .045, r) * (1. - smoothstep(edge - .03, edge - .01, r)));   // an ink-umber line inside the broken edge: the back is drawn, not a ghost                     // the back: the silk it came off, blue where the colour soaked through and along the broken edge
  vec3 col = gl_FrontFacing ? face : back;
  float gl = glanceAt(vW);
  vec2 cell = floor(gp * .8); float gh = h21(cell + 17.);
  float pulse = max(sin(uTime * 1.9 + gh * 40.), 0.); pulse *= pulse;
  float pt = 1. - smoothstep(.0, .22, length(fract(gp * .8) - .5));
  if (gl_FrontFacing) col += vec3(.55, .75, 1.) * pt * step(.8, gh) * pulse * gl;
  gl_FragColor = vec4(col, 1.);
}`,St=`
attribute vec4 iPos;        // xyz local position of the foot, w: size in metres
attribute vec2 iSeed;       // x: seed 0..1, y: kind (0 deep green, 1 vermilion, 2 shell blossom)
varying vec2 vQ; varying vec2 vSeed; varying vec3 vW;
uniform float uTime;
void main(){
  vQ = position.xy; vSeed = iSeed;
  vec4 w = modelMatrix * vec4(iPos.xyz, 1.);
  // every stamp stands a few decimetres nearer or farther along the ray from the eye, by its seed: two prints at the same
  // distance are otherwise in one plane and cut each other into stripes that flicker as the eye moves
  vec3 ray = w.xyz - cameraPosition; float rl = max(length(ray), 1e-3);
  w.xyz += ray / rl * (iSeed.x - .5) * (.7 + .004 * rl);
  vec3 r = normalize(vec3(viewMatrix[0][0], 0., viewMatrix[2][0]) + vec3(1e-5, 0., 0.));
  float s = iPos.w;
  float nod = sin(uTime * .9 + iSeed.x * 40.) * .05 * s * (position.y + .1);
  w.xyz += r * (position.x * s + nod) + vec3(0., (position.y + .32) * s, 0.);
  vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,Kt=`
varying vec2 vQ; varying vec2 vSeed; varying vec3 vW;
${$e}
void main(){
  float n = 5. + floor(vSeed.x * 4.99);
  float dmin = 1.;
  float top = 0.;
  for (int i = 0; i < 9; i++) {
    float fi = float(i);
    vec2 hsh = h22(vec2(fi * 3.7 + vSeed.x * 91., vSeed.x * 57. + fi));
    float ang = fi * 2.4 + hsh.x * 1.2;
    float rad = sqrt((fi + .3) / 9.) * .34;
    vec2 c = vec2(cos(ang) * rad * 1.15, sin(ang) * rad * .8 - .02);
    float rr = .13 + .05 * hsh.y;
    float dd = length((vQ - c) * vec2(1., 1.25)) - rr;
    if (fi < n && dd < dmin) { dmin = dd; top = hsh.y; }
  }
  if (dmin > 0.) discard;
  vec3 deep = mix(cMal, cInk, .52 + .16 * top);
  vec3 col = vSeed.y < .5 ? deep : (vSeed.y < 1.5 ? cVerm * .92 : cShell * .9);
  col *= 1. - .25 * smoothstep(-.035, 0., dmin);              // the stamp's rim prints darker
  gl_FragColor = vec4(col, 1.);
}`,Yt=`
varying vec2 vQ; varying vec2 vSeed; varying vec3 vW;
${$e}
void main(){
  vec2 q = vQ * 2.;
  float r = length(q);
  float fw = max(fwidth(q.x), fwidth(q.y));
  float a = atan(q.y, q.x + (abs(q.x) + abs(q.y) < 1e-5 ? 1e-5 : 0.)) / 6.2831853 * 14. + vSeed.x * 3.;
  float id = floor(a);
  float dA = abs(fract(a) - .5) * (6.2831853 / 14.) * r;                 // metres across the stroke, in wheel radii
  float len = .72 + .27 * h11(id + vSeed.x * 31.);
  float w = max(.05 * (1. - .55 * r / len), fw * .55);
  float on = (1. - smoothstep(w, w + fw * .8 + 1e-4, dA)) * step(.07, r) * (1. - smoothstep(len - .04, len, r));
  on = max(on, 1. - smoothstep(.06, .09, r));                          // the hub
  on = max(on, (1. - smoothstep(.55, .7, r)) * smoothstep(.12, .3, fw)); // far away the wheel prints as a dot
  if (on < .5) discard;
  vec3 col = mix(cMal, cInk, .5 + .35 * step(.6, h11(id * 3.1 + vSeed.x * 7.)));
  if (vSeed.y > .5) col = mix(cInk, cSilk, .08);
  gl_FragColor = vec4(col, 1.);
}`;function $t(i,m={}){const n=m.palette||Ut,b=(y,J=[1,1,1],ge=1)=>{const ee=new h.Color(y),he=(ee.r+ee.g+ee.b)/3;return ee.setRGB((he+(ee.r-he)*ge)*J[0],(he+(ee.g-he)*ge)*J[1],(he+(ee.b-he)*ge)*J[2]),ee},U={silk:b(n[0],[1.02,.91,.86]),ink:b(n[1]),malachite:b(n[2],[1,1,1],.78),azurite:b(n[3],[.95,1.5,1.15]),gold:b(n[4]),shell:b(n[5],[1.48,1.29,.975]),vermilion:b(n[6],[.76,1.12,1.55],1)},E=m.glanceDir||[-1,0],k=m.creases||[-.62,.21,1.37],g={uTime:{value:0},uGlance:{value:new h.Vector4(E[0],E[1],-1e4,80)},uCrease:{value:new h.Vector3(k[0],k[1],k[2])},cSilk:{value:U.silk},cInk:{value:U.ink},cMal:{value:U.malachite},cAzu:{value:U.azurite},cGold:{value:U.gold},cShell:{value:U.shell},cVerm:{value:U.vermilion},uWeave:{value:m.weave??.05},uRes:{value:new h.Vector2(1600,900)}},v={period:17,speed:60,start:-510,centre:m.glanceCentre??0},H=[],f=(y,J)=>{const ge=new h.ShaderMaterial({...y,uniforms:{...g,...J||{}}});return H.push(ge),ge};function p(y="plain",J={}){return y==="sky"?f({vertexShader:Pt,fragmentShader:rt,side:h.BackSide,depthWrite:!1,depthTest:!1}):y==="lake"?f({vertexShader:At,fragmentShader:rt,defines:{LAKE:1}},{uBridge:{value:new h.Vector4(1e5,500,10,10)},uShore:{value:new h.Vector4(1e5,1,0,60)},uRipple:{value:Array.from({length:6},()=>new h.Vector4(0,0,1,0))}}):y==="mist"?f({vertexShader:ut,fragmentShader:rt,defines:{MIST:1},transparent:!0,depthWrite:!1,side:h.DoubleSide},{uDrift:{value:J.drift??.002},uScal:{value:J.scallops??40},uEdge:{value:new h.Vector3(J.edge??.42,J.ends??.05,J.foot??.2)}}):y==="fall"?f({vertexShader:ut,fragmentShader:rt,defines:{FALL:1},side:h.DoubleSide},{uFall:{value:new h.Vector3(J.threads??40,J.height??50,J.speed??9)}}):f({vertexShader:At,fragmentShader:rt,side:J.side??h.FrontSide})}let P=null;function Y(y=5e3){return P=new h.Mesh(new h.SphereGeometry(y,24,12),p("sky")),P.renderOrder=-10,P.frustumCulled=!1,P}function D(y={}){const J=f({vertexShader:Ot,fragmentShader:_t,side:y.side??h.FrontSide,defines:y.gorge?{GORGE:1}:{}},{...y.gorge?{uFalls:{value:[0,1,2].map(()=>new h.Vector4(0,0,1e5,1e5))},uFallRun:{value:10},uFoot:{value:new h.Vector3(1e5,1e5,1e5)}}:{},uRange:{value:new h.Vector2(y.foot??0,y.top??280)},uBands:{value:new h.Vector2(y.green??.2,y.blue??.6)},uCoatT:{value:new h.Vector2(-1,-1)},uSpeed:{value:y.speed??14},uCap:{value:y.cap??3},uWinter:{value:y.winter?1:0},uThin:{value:y.thin??m.thin??1},uFlake:{value:y.flake??m.flake??0},uStroke:{value:y.stroke??m.stroke??1},uScar:{value:new h.Vector4(0,0,1,0)},uFlat:{value:y.flat??0},uRun:{value:y.run??300}});return J.setCoats=(ge,ee)=>{J.uniforms.uCoatT.value.set(ge,ee)},J}let S=null,Q=null,N=null,F=null;const K=()=>F||(F=f({vertexShader:St,fragmentShader:Yt,side:h.DoubleSide})),T=()=>S||(S=f({vertexShader:Dt,fragmentShader:Nt,transparent:!0,depthWrite:!1,side:h.DoubleSide},{uGoldW:{value:m.goldWidth??.5},uFarFade:{value:2e3}})),u=()=>Q||(Q=f({vertexShader:jt,fragmentShader:Ht,vertexColors:!0,side:h.DoubleSide},{uLine:{value:m.inkWidth??.07}})),C=()=>f({vertexShader:ut,fragmentShader:Qt,side:h.DoubleSide}),R=()=>N||(N=f({vertexShader:St,fragmentShader:Kt,side:h.DoubleSide})),$=new h.Vector2,X=new h.Vector3;function ze(y,J,ge){g.uTime.value=J;const ee=(J%v.period+v.period)%v.period;g.uGlance.value.z=v.centre+v.start+ee*v.speed,i.renderer&&i.renderer.getDrawingBufferSize&&(i.renderer.getDrawingBufferSize($),$.y>0&&g.uRes.value.copy($)),P&&ge&&(ge.getWorldPosition(X),P.position.copy(X))}const ve={palette:U,uniforms:g,glance:v,silk:p,sky:Y,pigment:D,gold:T,flat:u,flake:C,stamp:R,wheel:K,update:ze,wheels:y=>Ft(ve,y,K()),goldRibbon:y=>Zt(ve,y),batch:()=>Jt(ve),stamps:y=>Ft(ve,y),mountain:y=>Wt(i,ve,y),spurs:lt};return ve}function Zt(i,m){let n=0,b=0;for(const P of m)P.pts.length>1&&(n+=P.pts.length*2,b+=(P.pts.length-1)*6);const U=new Float32Array(n*3),E=new Float32Array(n*3),k=new Float32Array(n*2),g=new Uint32Array(b);let v=0,H=0;for(const P of m){const Y=P.pts,D=Y.length;if(!(D<2))for(let S=0;S<D;S++){const Q=Y[Math.max(0,S-1)],N=Y[Math.min(D-1,S+1)],F=Y[S];let K=N[0]-Q[0],T=N[1]-Q[1],u=N[2]-Q[2];const C=Math.hypot(K,T,u)||1;K/=C,T/=C,u/=C;const R=S===0||S===D-1?.35:1;for(let $=-1;$<=1;$+=2)U[v*3]=F[0],U[v*3+1]=F[1],U[v*3+2]=F[2],E[v*3]=K,E[v*3+1]=T,E[v*3+2]=u,k[v*2]=$,k[v*2+1]=(P.w??1)*R,v++;if(S<D-1){const $=v-2;g[H++]=$,g[H++]=$+1,g[H++]=$+2,g[H++]=$+1,g[H++]=$+3,g[H++]=$+2}}}const f=new h.BufferGeometry;f.setAttribute("position",new h.BufferAttribute(U,3)),f.setAttribute("aDir",new h.BufferAttribute(E,3)),f.setAttribute("aSide",new h.BufferAttribute(k,2)),f.setIndex(new h.BufferAttribute(g,1));const p=new h.Mesh(f,i.gold());return p.frustumCulled=!1,p.renderOrder=3,p}function Jt(i){const m=[],n=[],b=[],U=[],E=[];let k=0;const g=(f,p,P,Y,D,S,Q)=>(m.push(f[0],f[1],f[2]),n.push(p.r,p.g,p.b),b.push(P,Y,D,S),U.push(Q),k++),v=(f,p)=>Math.hypot(f[0]-p[0],f[1]-p[1],f[2]-p[2]),H={count:()=>E.length/3,quad(f,p,P,Y,D,S={}){const Q=S.rule||0;let N=S.uv,F,K;N?(F=S.size[0],K=S.size[1]):S.bare?(N=[[50,50],[50,50],[50,50],[50,50]],F=K=100):(F=Math.max(v(f,p),v(Y,P)),K=Math.max(v(f,Y),v(p,P)),N=[[0,0],[F,0],[F,K],[0,K]]);const T=g(f,D,N[0][0],N[0][1],F,K,Q),u=g(p,D,N[1][0],N[1][1],F,K,Q),C=g(P,D,N[2][0],N[2][1],F,K,Q),R=g(Y,D,N[3][0],N[3][1],F,K,Q);E.push(T,u,C,T,C,R)},tri(f,p,P,Y){const D=g(f,Y,50,50,100,100,0),S=g(p,Y,50,50,100,100,0),Q=g(P,Y,50,50,100,100,0);E.push(D,S,Q)},box(f,p,P,Y,D,S,Q,N={}){const F=Math.cos(N.rotY||0),K=Math.sin(N.rotY||0),T=Y/2,u=D/2,C=S/2,R=(ze,ve,y)=>[f+ze*F+y*K,p+ve,P-ze*K+y*F],$=N.skip||"",X=(ze,ve,y,J)=>H.quad(ze,ve,y,J,Q,N);X(R(-T,-u,C),R(T,-u,C),R(T,u,C),R(-T,u,C)),X(R(T,-u,-C),R(-T,-u,-C),R(-T,u,-C),R(T,u,-C)),X(R(T,-u,C),R(T,-u,-C),R(T,u,-C),R(T,u,C)),X(R(-T,-u,-C),R(-T,-u,C),R(-T,u,C),R(-T,u,-C)),$.includes("t")||X(R(-T,u,C),R(T,u,C),R(T,u,-C),R(-T,u,-C)),$.includes("b")||X(R(-T,-u,-C),R(T,-u,-C),R(T,-u,C),R(-T,-u,C))},geometry(){const f=new h.BufferGeometry;return f.setAttribute("position",new h.BufferAttribute(new Float32Array(m),3)),f.setAttribute("color",new h.BufferAttribute(new Float32Array(n),3)),f.setAttribute("aUV",new h.BufferAttribute(new Float32Array(b),4)),f.setAttribute("aRule",new h.BufferAttribute(new Float32Array(U),1)),f.setIndex(new h.BufferAttribute(new Uint32Array(E),1)),f.computeBoundingSphere(),f},mesh(){return new h.Mesh(H.geometry(),i.flat())},async geometryAsync(f){const p=new h.BufferGeometry;return p.setAttribute("position",new h.BufferAttribute(new Float32Array(m),3)),await f.yield(),p.setAttribute("color",new h.BufferAttribute(new Float32Array(n),3)),await f.yield(),p.setAttribute("aUV",new h.BufferAttribute(new Float32Array(b),4)),await f.yield(),p.setAttribute("aRule",new h.BufferAttribute(new Float32Array(U),1)),p.setIndex(new h.BufferAttribute(new Uint32Array(E),1)),await f.yield(),p.computeBoundingSphere(),p}};return H}function Ft(i,m,n){const b=new h.InstancedBufferGeometry;b.setAttribute("position",new h.BufferAttribute(new Float32Array([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0]),3)),b.setIndex([0,1,2,0,2,3]);const U=new Float32Array(m.length*4),E=new Float32Array(m.length*2);for(let g=0;g<m.length;g++){const v=m[g];U[g*4]=v[0],U[g*4+1]=v[1],U[g*4+2]=v[2],U[g*4+3]=v[3],E[g*2]=Math.abs(Math.sin(v[0]*12.9898+v[2]*78.233+v[1]*3.1)*43758.5453)%1,E[g*2+1]=v[4]||0}b.setAttribute("iPos",new h.InstancedBufferAttribute(U,4)),b.setAttribute("iSeed",new h.InstancedBufferAttribute(E,2)),b.instanceCount=m.length;const k=new h.Mesh(b,n||i.stamp());return k.frustumCulled=!1,k}function lt(i,m,n={}){const b=[],U=n.foot??0,E=n.n??i.int(6,9),k=n.from??0,g=n.to??Math.PI*2,v=Math.abs(g-k)>6.2,H=(f,p,P,Y,D,S,Q)=>{const N=[[f,p,P]],F=S===0?8:6;let K=0,T=i()*6.28,u=i.range(30,60);const C=[];let R=i.range(18,40),$=i.sign();for(;p>U-4&&K<Q;){Y+=(i()-.5)*(S===0?.22:.3);const X=.55+.75*(.5+.5*Math.sin(T+K/u*6.28)),ze=D*X*(S===0?1.75-1.15*Math.min(1,K/55)+.75*_(90,230,K):.7+.9*Math.min(1,K/160));f+=Math.sin(Y)*F,P+=Math.cos(Y)*F,p-=F*ze,K+=F,N.push([f,p,P]),S<2&&n.sub!==!1&&K>R&&p>U+12&&(C.push([f,p,P,Y+$*i.range(.85,1.35)]),$=-$,R=K+(S===0?i.range(22,46):i.range(18,30)))}b.push({pts:N,order:S,w:S===0?1:S===1?.75:.55});for(const X of C)H(X[0],X[1]-1.5,X[2],X[3],D*(S===0?1.5:1.9),S+1,S===0?i.range(50,110):i.range(18,40))};for(let f=0;f<E;f++){const p=k+(g-k)*((f+(v?0:.5)+(i()-.5)*.5)/E);H(m[0],m[1],m[2],p,(n.slope??.8)*i.range(.8,1.25),0,1e4)}return b}async function Wt(i,m,n){const b=n.foot??0,U=n.slope??1.25,E=(j,te,M)=>{const O=new Float32Array(M);for(let W=0;W<M;W++)O[W]=j+(te-j)*W/(M-1);return O},k=n.xs?Float32Array.from(n.xs):E(n.x0,n.x1,n.nx),g=n.zs?Float32Array.from(n.zs):E(n.z0,n.z1,n.nz),v=k.length,H=g.length,f=k[0],p=k[v-1],P=g[0],Y=g[H-1],D=(j,te)=>{let M=0,O=j.length-1;for(;M<O;){const W=M+O+1>>1;j[W]<=te?M=W:O=W-1}return M},S=(j,te)=>Math.min(j.length-1,D(j,te)+1),Q=v*H,N=b-8,F=new Float32Array(Q).fill(-1e4),K=new Float32Array(Q).fill(-1e4),T=new Float32Array(Q),u=new Float32Array(Q).fill(60),C=new Int16Array(Q),R=n.carve0?new Float32Array(Q):null;let $=0,X=-1e4;for(let j=0;j<n.ridges.length;j++){const te=n.ridges[j],M=te.pts,O=j+1,W=U*(te.order===0?1:te.order===1?1.15:1.3),l=te.reach??(te.order===0?1e4:te.order===1?62:32);for(let we=0;we<M.length-1;we++){const oe=M[we],ae=M[we+1],w=Math.max(oe[1],ae[1]);w>X&&(X=w);const de=Math.min(l,120,(w-N)/W+2);if(de<=0||Math.max(oe[0],ae[0])+de<f||Math.min(oe[0],ae[0])-de>p||Math.max(oe[2],ae[2])+de<P||Math.min(oe[2],ae[2])-de>Y)continue;const Re=D(k,Math.min(oe[0],ae[0])-de),le=S(k,Math.max(oe[0],ae[0])+de),Pe=D(g,Math.min(oe[2],ae[2])-de),ie=S(g,Math.max(oe[2],ae[2])+de),Te=ae[0]-oe[0],Ie=ae[2]-oe[2],Ee=Te*Te+Ie*Ie||1,nt=de*de;for(let re=Pe;re<=ie;re++){const Fe=g[re]-oe[2];for(let Qe=Re;Qe<=le;Qe++){const We=k[Qe]-oe[0];let xe=(We*Te+Fe*Ie)/Ee;xe=xe<0?0:xe>1?1:xe;const Ne=We-Te*xe,Xe=Fe-Ie*xe,ct=Ne*Ne+Xe*Xe;if(ct>nt)continue;const be=Math.sqrt(ct),fe=re*v+Qe;if(w-W*be<K[fe])continue;const ht=oe[1]+(ae[1]-oe[1])*xe,Ke=ht-W*be*(1+.85/(1+.04*be+.0022*be*be));Ke>F[fe]?(C[fe]!==O&&(K[fe]=F[fe]),F[fe]=Ke,C[fe]=O,T[fe]=ht,u[fe]=be):C[fe]!==O&&Ke>K[fe]&&(K[fe]=Ke)}$+=le-Re+1,$>2e4&&($=0,await i.yield())}}}X=n.top??X;const ze=new Float32Array(Q*3),ve=new Float32Array(Q*3),y=n.along??.3,J=i.noise,ge=n.fold?new Float32Array(Q*3):null;for(let j=0;j<H;j++){for(let te=0;te<v;te++){const M=j*v+te,O=k[te],W=g[j];let l=F[M],we=Math.min(40,l-K[M]);l<-9e3&&(l=N,we=40);const oe=u[M];l-=(.5+.5*J.n2(O*.021,W*.021))*Math.min(oe,45)*.2+J.n2(O*.09+9,W*.09)*Math.min(oe,9)*.3;const ae=n.carve?n.carve(O,W,l):l,w=l;if(ae<l-.5?we=Math.max(we,Math.min(40,(l-ae)*2)):ae>l+.5&&(we=40),R&&(R[M]=Math.max(n.carve0(O,W,l,ae),N)),l=Math.max(ae,N),F[M]=l,ge){const de=n.fold(O,W,l);de&&(ge[M*3]=de[0],ge[M*3+1]=de[1]*Math.max(de[3]||0,it((w-ae)/5,0,1)),ge[M*3+2]=de[2])}ze[M*3]=O,ze[M*3+1]=l,ze[M*3+2]=W,ve[M*3]=Math.max(0,(X-T[M])*y+Math.max(0,T[M]-l))*(n.coatK?n.coatK(O,W):1),ve[M*3+1]=w-ae>3?-.7:1-_(0,14,we),ve[M*3+2]=we}$+=v*(ge?6:1),$>1500&&($=0,await i.yield())}const ee=new Uint32Array((v-1)*(H-1)*6);let he=0;for(let j=0;j<H-1;j++){j%4===3&&await i.yield();for(let te=0;te<v-1;te++){const M=j*v+te,O=M+1,W=M+v,l=W+1;Math.max(F[M],F[O],F[W],F[l])<b-.6||(Math.abs(F[M]-F[l])<Math.abs(F[O]-F[W])?(ee[he++]=M,ee[he++]=W,ee[he++]=l,ee[he++]=M,ee[he++]=l,ee[he++]=O):(ee[he++]=M,ee[he++]=W,ee[he++]=O,ee[he++]=O,ee[he++]=W,ee[he++]=l))}}await i.yield();const Be=new h.BufferGeometry;Be.setAttribute("position",new h.BufferAttribute(ze,3)),Be.setAttribute("aCoat",new h.BufferAttribute(ve,3)),Be.setIndex(new h.BufferAttribute(ee.subarray(0,he),1)),ge&&Be.setAttribute("aFold",new h.BufferAttribute(ge,3)),Be.boundingSphere=new h.Sphere(new h.Vector3((f+p)/2,(b+X)/2,(P+Y)/2),Math.hypot(p-f,X-b,Y-P)/2);const De=m.pigment({foot:b,top:X,gorge:!!ge,...n.pigment||{}}),Je=new h.Mesh(Be,De),at=(j,te)=>{const M=Math.min(v-2,D(k,j)),O=Math.min(H-2,D(g,te)),W=O*v+M,l=it((j-k[M])/(k[M+1]-k[M]),0,1),we=it((te-g[O])/(g[O+1]-g[O]),0,1);return ue(ue(F[W],F[W+1],l),ue(F[W+v],F[W+v+1],l),we)};return{mesh:Je,material:De,heightAt:at,origAt:R?(j,te)=>{const M=Math.min(v-2,D(k,j)),O=Math.min(H-2,D(g,te)),W=O*v+M,l=it((j-k[M])/(k[M+1]-k[M]),0,1),we=it((te-g[O])/(g[O+1]-g[O]),0,1);return ue(ue(R[W],R[W+1],l),ue(R[W+v],R[W+v+1],l),we)}:at,goldLines:(j=5,te=.7,M=2)=>{const O=[];for(const W of n.ridges){if(W.order>M||W.noGold)continue;let l=[];for(let we=0;we<W.pts.length-1;we++){const oe=W.pts[we],ae=W.pts[we+1],w=Math.hypot(ae[0]-oe[0],ae[2]-oe[2]),de=Math.max(1,Math.round(w/j));for(let Re=we===0?0:1;Re<=de;Re++){const le=ue(oe[0],ae[0],Re/de),Pe=ue(oe[2],ae[2],Re/de),ie=at(le,Pe),Te=ue(oe[1],ae[1],Re/de);if(ie<b+1.5||ie<Te-9||ie>Te+4||le<f||le>p||Pe<P||Pe>Y){l.length>1&&O.push({pts:l,w:W.w}),l=[];continue}l.push([le,ie+te,Pe])}}l.length>1&&O.push({pts:l,w:W.w})}return O},top:X,tris:he/3}}const pe=[[385,55],[445,105],[510,158]],Ve=16,Me=-3,Se=-8,qe=638,et=625;function Ue(i){let m=1.2;for(const[n,b]of pe){const U=_(n-Ve,n,i);m=Math.max(m,ue(m,b,U*U*(3-2*U)*.35+U*.65))}return m}function tt(i){let m=17.5;for(const[n]of pe)m=Math.max(m,17.5+14.5*_(n,n+6,i)*(1-_(n+24,n+36,i)));return m+7*_(560,615,i)+15*(1-_(343,371,i))}const pt=6.4,Ze=9.5,ot=5.6,mt=i=>Math.abs(i-Math.floor(i)-.5)*2,Ge=i=>{const m=Math.sin(i*127.1+31.7)*43758.5453;return m-Math.floor(m)},Xt=(i,m)=>(i-Se)/pt+.22*Math.sin(m*.13+i*.05),gt=(i,m)=>5*Math.sin(i*.045+m*2)+3*Math.sin(i*.11+m),eo=(i,m,n)=>(m+gt(m,n))/Ze+.2*Math.sin(i*.15)+n*.37-i*.028,ft=i=>i*2.3+i*i*.02;function qt(i){for(let m=0;m<pe.length;m++)if(i>pe[m][0]-Ve&&i<pe[m][0]+6)return m;return-1}function je(i,m,n){const b=Math.min(m,qe),U=Math.max(0,m-qe),E=i>Me?1:-1,k=Math.abs(i-Me)-tt(b)-U*1.3;if(k<=0){const T=1-_(-4,-1,k),u=Math.abs(i-Se),C=_(ot-1,ot+2.5,u),R=Xt(i,b),$=mt(R),X=Math.round(R),ze=(5.4*$*Math.sqrt($)*C+3.2*(1-_(2.5,ot+2,u)))*T,ve=b-ze,y=qt(ve);let J=Ue(ve),ge=0,ee=0;if(y>=0){const he=y?pe[y-1][1]:1.2,Be=pe[y][1];if(Ge(X*3.1+y*17.3)>.3&&C>.5&&T>.5){const Je=he+(Be-he)*(.24+.5*Ge(X*7.7+y*5.1))-4*$;J>Je&&(J=Math.max(Je,Ue(ve-3.4)))}ge=_(pe[y][0]-Ve-1,pe[y][0]-Ve+3,ve)*(1-_(pe[y][0]-.5,pe[y][0]+3,ve))*C*T,ee=J-he}return[J-U*1.9,R,ge,ee,1,1]}const g=eo(k,b,E),v=mt(g),H=Math.round(g);let f=Math.max(0,k-(5+4*Ge(H*2.9+E*4.7))*v*Math.sqrt(v)*_(0,3,k));const p=Ge(H*5.3+E*11.1),P=4.5+7*Ge(H*9.7+E*3.3);p>.25&&f>P&&(f=Math.max(P,f-4.2));const Y=_(1.5,4,f)*(1-_(64,82,k))*_(338,347,m)*(1-_(104,120,Math.abs(i-Me))),D=n||E<0?0:_(533,562,b),S=(1-_(24,36,k))*(1-_(46,56,Math.abs(i-Me))),Q=qt(b),N=Q<0?0:(Ue(b)-(Q?pe[Q-1][1]:1.2))*(1-_(pe[Q][0]-1,pe[Q][0]+5,b)),F=n||E<0?0:Math.max(_(397,409,b)*(1-_(427,437,b)),_(447,459,b)*(1-_(486,498,b)));if(F>0&&D<=0){const T=62*(1-F)+F*(11+7*(1-v*Math.sqrt(v))-Math.max(0,Math.min(k,46)-12)*.45+Math.max(0,k-46)*2.5),u=Math.min(ft(f),T);return[Ue(b)+u-U*1.9,g,Y,u+N,1-_(13,25,k),S,N]}return D<=0?[Ue(b)+ft(f)-U*1.9,g,Y,ft(f)+N,1-_(13,25,k),S,N]:[Ue(b)+ft(f)*(1-D)-D*(35*_(1.5,13,f+1.5*_(0,3,k))+Math.max(0,k-8)*1-Math.max(0,k-55)*7)-U*1.9,g,Y,ue(ft(f),22,D),Math.max(1-_(13,25,k),D*(1-_(40,60,k))),S]}async function no(i,m={}){const n=i.rng,b=m.detail??i.quality?.detail??1,U=!m.style,E=m.style||$t(i,{palette:m.palette,glanceDir:[1,0]}),k=E.palette,g=new h.Group;g.name="thousand-li-hero";const v=(e,t,s)=>[e,t,x-s],H=[-110+n.range(-8,8),280,600+n.range(-8,8)],f=[105+n.range(-12,12),n.range(176,204),590+n.range(-10,14)],p=(e,t)=>e+n.range(-t,t),P=[[H[0],H[1],H[2]],[p(-84,5),p(252,5),560],[p(-64,4),p(222,5),522],[p(-55,3),p(184,5),482],[p(-50,3),p(146,4),442],[p(-47,3),p(104,4),402],[p(-44,2),p(62,4),372],[-41,22,352],[-38,-6,338]],Y=[[f[0],f[1],f[2]],[p(80,5),f[1]-p(12,4),552],[p(59,4),p(186,4),516],[p(47,3),p(152,4),478],[p(41,3),p(114,4),440],[p(37,2),p(80,4),402],[p(35,2),p(42,3),370],[33,6,349],[31,-6,339]],D=e=>{const t=[];for(let s=0;s<e.length-1;s++)for(let o=0;o<4;o++){const a=o/4;t.push(v(ue(e[s][0],e[s+1][0],a),ue(e[s][1],e[s+1][1],a),ue(e[s][2],e[s+1][2],a)))}return t.push(v(...e[e.length-1])),t},S=[{pts:D(P),order:0,w:1},{pts:D(Y),order:0,w:1}],Q=[];for(let e=352;e<=qe;e+=4)Q.push(v(Me,Ue(e)+50,e));S.push({pts:Q,order:0,w:1,noGold:!0});const N=Math.atan2(P[2][0]-H[0],-(P[2][2]-H[2])),F=Math.atan2(Y[2][0]-f[0],-(Y[2][2]-f[2]));for(const e of lt(n,v(...H),{n:n.int(6,8),foot:-4,slope:1.05,from:N+.55,to:N+Math.PI*2-.6}))S.push(e);for(const e of lt(n,v(...f),{n:n.int(5,6),foot:-4,slope:1.08,from:F+.7,to:F+Math.PI*2-.55}))S.push(e);await i.yield();for(const[e,t]of[[P,-1],[Y,1]])for(let s=1;s<e.length-2;s++){const o=v(...e[s]);for(const a of lt(n,[o[0],o[1]-2,o[2]],{n:1,foot:-4,slope:1.25,from:t*n.range(.5,1.1),to:t*n.range(1.2,1.7)}))a.order=Math.min(2,a.order+1),a.w*=.8,S.push(a)}await i.yield();const K=n.int(3,4),T=n.int(2,3);for(let e=0;e<K+T;e++){const t=e<K,s=t?H:f,o=t?n.range(-2.7,.15)-.2:n.range(.1,2.6),a=n.range(55,105),r=s[0]+Math.sin(o)*a,d=s[2]-Math.cos(o)*a*(t?1:.9),A=s[1]*n.range(.58,.86)-(a-55)*.5;if(!(Math.abs(r-Me)<58&&d<qe+20))for(const c of lt(n,v(r,A,d),{n:n.int(4,5),foot:-4,slope:1.05}))S.push(c)}await i.yield();const u=[21,67,422],C=(e,t,s)=>{const o=Math.hypot(e-u[0],(t-u[2])*1.15);return o<14?ue(u[1],s,_(6.2,14,o)):s},R=(e,t)=>Math.atan2((t-u[2])*1.15,u[0]-e)/6.2832*9+.3,$=(e,t,s)=>{const o=Math.hypot(e-u[0],(t-u[2])*1.15);if(o>=14)return s;const a=mt(R(e,t)),r=o+2.6*a*Math.sqrt(a)*_(6.2,8,o);return ue(u[1],s,_(6.5,12.6,r))};let X=NaN,ze=NaN,ve=null;const y=(e,t)=>((e!==X||t!==ze)&&(X=e,ze=t,ve=je(e,t)),ve),J=(e,t,s)=>{if(Math.abs(e-Me)>150||x-t<330)return s;const o=y(e,x-t);return $(e,x-t,ue(Math.min(s,o[0]),o[0],o[4]))},ge=(e,t,s,o)=>{const a=x-t;if(Math.abs(e-Me)>150||a<330||!(e>Me&&a>395||Math.hypot(e-u[0],(a-u[2])*1.15)<15))return o;const r=je(e,a,!0);return C(e,a,ue(Math.min(s,r[0]),r[0],r[4]))},ee=(e,t,s)=>{if(Math.abs(e-Me)>150||x-t<330)return null;const o=x-t,a=y(e,o),r=Math.hypot(e-u[0],(o-u[2])*1.15);if(r<13&&a[0]<u[1]+3)return[R(e,o),1.5*_(6.3,7.4,r)*(1-_(11.5,12.7,r))*(1-_(61,68,a[0])),Math.max(0,$(e,o,a[0])-pe[0][1])*1.6*_(6,7,r),1];const d=a[4]>=1?a[3]:Math.min(a[3],Math.max(0,s-Ue(Math.min(o,qe))+(a[6]||0)));return[a[1],a[2]*_(13,16,r)*(1+.15*(a[5]||0)),d,1]},he=(e,t)=>{const s=x-t;return s<330||s>qe+30?1:ue(.5,1,_(26,60,Math.abs(e-Me)-tt(Math.min(s,qe))))},Be=b<1?1.2:1,De=(e,t,s,o,a,r)=>{const d=[];let A=e;for(;A<t-.01;)d.push(A),A+=(A>=s&&A<o?a:r)*Be;return d.push(t),d},Je=De(-400,380,Me-62,Me+62,1.3,3.6),at=De(x-880,x-644,0,0,1,3.2).slice(0,-1).concat(De(x-644,x-524,0,0,1,1.9).slice(0,-1),De(x-524,x-322,x-524,x-344,1.3,3.2)),se=await Wt(i,E,{ridges:S,xs:Je,zs:at,foot:0,top:280,slope:1.6,carve:J,carve0:ge,fold:ee,coatK:he,pigment:{green:.055,blue:.53,winter:m.winter}});g.add(se.mesh),await i.yield();const He=se.goldLines(5,.7);await i.yield();{const e=se.material.uniforms.uFalls.value;e[0].set(Se,ot,x-514,x-352),e[1].set(-20.5,.6,x-512,x-366),e[2].set(11.5,.5,x-511,x-364),se.material.uniforms.uFoot.value.set(x-(pe[0][0]-Ve+3.2),x-(pe[1][0]-Ve+3.2),x-(pe[2][0]-Ve+3.2)),pe.forEach(([t],s)=>{for(let o=-4;o<=6;o++){const a=[];for(let r=t-Ve+1;r<=t+4;r+=1.5){let d=Se+pt*(o+.5);for(let c=0;c<3;c++)d=Se+pt*(o+.5-.22*Math.sin(r*.13+d*.05));if(je(d,r)[2]<.35||Math.abs(d-Se)<ot+2.5){a.length>1&&He.push({pts:a.slice(),w:.7}),a.length=0;continue}a.push([d,se.heightAt(d,x-r)+.5,x-r])}a.length>1&&He.push({pts:a,w:.7})}}),await i.yield();for(const t of[-1,1])for(let s=Math.floor(346/Ze);s<=Math.ceil(qe/Ze)+1;s++){const o=[];for(let a=2.5;a<=76;a+=2.5){const r=Ze*(s+.5-.2*Math.sin(a*.15)-t*.37+a*.028);let d=r;for(let L=0;L<5;L++)d=r-gt(d,t);if(d<350||d>qe)break;const A=Me+t*(tt(d)+a),c=je(A,d),z=se.heightAt(A,x-d);if(z<c[0]-2.5||c[2]<.3||Math.hypot(A-u[0],d-u[2])<12)break;o.push([A,z+.5,x-d])}o.length>2&&He.push({pts:o,w:.7})}for(let t=0;t<9;t++){const s=(t+.3)/9*6.2832,o=[];for(let a=6.7;a<=13.2;a+=.8){const r=u[0]+Math.cos(s)*a,d=u[2]+Math.sin(s)*a/1.15,A=se.heightAt(r,x-d);if(A>u[1]+.6||A<pe[0][1]+.5||je(r,d)[0]>u[1]+3){if(o.length>1)break;o.length=0;continue}o.push([r,A+.45,x-d])}o.length>2&&He.push({pts:o,w:.7})}}await i.yield();const j=[],te=Math.round(1500*b),M=m.vermilion??1/12;for(let e=0;e<te;e++){const t=n.range(-390,370),s=n.range(x-860,x-330),o=se.origAt(t,s),a=i.noise.n2(t*.013+40,s*.013)*.5+.5,r=o<8?1:o<150?.75:o<215?.3:.06,d=o>1.2&&n()<r*(.12+1.5*a*a),A=n.int(3,9),c=n.range(7,24),z=n()*3.14;for(let L=0;L<A;L++){const q=n.range(-c,c),V=n.range(-c,c)*.35,G=t+Math.cos(z)*q-Math.sin(z)*V,B=s+Math.sin(z)*q+Math.cos(z)*V,I=n()<M?1:0,Z=n.range(7,12.5)*(I?.6:1);if(!d)continue;const ke=se.heightAt(G,B),ne=x-B,ce=Math.abs(se.heightAt(G+3,B)-se.heightAt(G-3,B))/6+Math.abs(se.heightAt(G,B+3)-se.heightAt(G,B-3))/6;ke>1.2&&ce<2.6&&!(Math.abs(G-Me)<tt(ne)+3&&ne<qe+6)&&j.push([G,ke-.5,B,Z,I])}e%25===24&&await i.yield()}for(let e=0;e<Math.round(140*b);e++){const t=n.range(-330,330),s=343+n.range(-4,10)+40*Math.abs(i.noise.n2(t*.01,3)),o=se.heightAt(t,x-s);o>.8&&o<14&&Math.abs(t-Me)>26&&j.push([t,o-.3,x-s,n.range(6,10),n()<.1?1:0])}for(const[e]of pe)for(let t=Me-30;t<=Me+30;t+=2.1){if(Math.abs(t-Se)<ot+3||Math.abs(t)<4.5||Ge(t*3.3+e)>.75*b)continue;let s=je(t,e-Ve)[0];for(let o=e-Ve+.7;o<e+2;o+=.7){const a=je(t,o);if(a[4]===1&&a[2]>.4&&a[0]-s<.25&&a[3]>6){j.push([t+n.range(-.6,.6),se.heightAt(t,x-o-1)-.2,x-o-1,n.range(2.6,4.2),n()<M?1:0]);break}s=a[0]}}await i.yield();for(const e of[-1,1])for(let t=352;t<qe-4;t+=2.6){if(Ge(t*1.7+e)>.7*b)continue;let s=0;for(let o=2;o<26;o+=.8){const a=Me+e*(tt(t)+o),r=je(a,t,!0);if(o>4&&r[3]-s<.3&&Math.hypot(a-u[0],t-u[2])>11){const d=a+e*1.2,A=se.origAt(d,x-t),c=se.heightAt(d,x-t);if(A>r[0]-2){const z=n.range(3.2,5.6),L=n()<M?1:0;Math.abs(c-A)<1.5&&j.push([d,c-.2,x-t,z,L])}break}s=r[3]}}for(let e=0;e<9;e++){const t=(e-.2)/9*6.2832,s=11.2+2*Ge(e*3.7),o=u[0]+Math.cos(t)*s,a=u[2]+Math.sin(t)*s/1.15,r=se.heightAt(o,x-a);Ge(e*9.1)>.25&&r<pe[0][1]+6&&r>pe[0][1]-.5&&o>Se+20&&j.push([o,r-.2,x-a,2.4+1.6*Ge(e*5.3),Ge(e*2.3)<M?1:0])}{const e=Vt((i.seed??0)+":thousand-li crest trees"),t=Math.min(1,b+.2),s=1500,o=(q,V)=>V>=pe[1][0]&&(V<=pe[2][0]||q<0&&V<=et),a=[];let r=0;for(const q of[-1,1])for(let V=Math.floor(346/Ze);V<=Math.ceil(qe/Ze)+1;V++){const G=[];let B=!1;for(let I=2.5;I<=76;I+=2.5){const Z=Ze*(V+.5-.2*Math.sin(I*.15)-q*.37+I*.028);let ke=Z;for(let ce=0;ce<5;ce++)ke=Z-gt(ke,q);if(ke<350||ke>qe)break;const ne=Me+q*(tt(ke)+I);if(Math.hypot(ne-u[0],ke-u[2])<12)break;G.push([ne,se.heightAt(ne,x-ke),x-ke,I]),o(q,ke)&&(B=!0)}if(G.length>2&&B){a.push([q,V,G]);for(let I=1;I<G.length;I++)r+=Math.hypot(G[I][0]-G[I-1][0],G[I][1]-G[I-1][1],G[I][2]-G[I-1][2])}}await i.yield();const d=Math.max(1,r/11*3.3/(s*.9)),A=q=>q<30?e.range(2.6,4.2):e.range(3.4,6);let c=0,z=1;const L=(q,V,G)=>{const B=e()<M?1:0,I=A(G),Z=se.heightAt(q,V);Math.abs(se.heightAt(q+3,V)-se.heightAt(q-3,V))/6+Math.abs(se.heightAt(q,V+3)-se.heightAt(q,V-3))/6>=2.6||Z>1.2&&c<s&&(j.push([q,Z-.2,V,B?Math.max(2.6,I*.75):I,B]),c++)};for(let q=0;q<a.length;q++){const[V,G,B]=a[q];let I=0,Z=e.range(3,9);for(let ne=1;ne<B.length;ne++){const ce=B[ne-1],Ae=B[ne],ye=Math.hypot(Ae[0]-ce[0],Ae[1]-ce[1],Ae[2]-ce[2]),Le=Ae[0]-ce[0],Ce=Ae[2]-ce[2],Oe=Math.hypot(Le,Ce)||1,_e=Le/Oe,Ye=Ce/Oe;for(;Z<=I+ye;){const st=(Z-I)/Math.max(ye,.001),Et=ue(ce[0],Ae[0],st),yt=ue(ce[2],Ae[2],st),Lt=ue(ce[3],Ae[3],st);Z+=e.range(8,14)*d/t;const kt=e.int(2,4);z=-z;for(let dt=0;dt<kt;dt++){const Mt=e.range(1.5,3)*z,zt=(dt-(kt-1)/2)*e.range(1.3,2.1);o(V,x-yt)&&L(Et-Ye*Mt+_e*zt,yt+_e*Mt+Ye*zt,Lt)}}I+=ye}const ke=a[q+1];if(ke&&ke[0]===V&&ke[1]===G+1){const ne=ke[2];let ce=0,Ae=e.range(6,18);for(let ye=1;ye<Math.min(B.length,ne.length);ye++){const Le=(B[ye][0]+ne[ye][0])/2,Ce=(B[ye][2]+ne[ye][2])/2,Oe=(B[ye-1][0]+ne[ye-1][0])/2,_e=(B[ye-1][2]+ne[ye-1][2])/2;ce+=Math.hypot(Le-Oe,(B[ye][1]+ne[ye][1]-B[ye-1][1]-ne[ye-1][1])/2,Ce-_e),!(ce<Ae)&&(Ae=ce+e.range(16,28)*d/t,o(V,x-Ce)&&L(Le+e.range(-.8,.8),Ce+e.range(-.8,.8),B[ye][3]))}}q%6===5&&await i.yield()}}await i.yield();const O=E.stamps(j);g.add(O),await i.yield();const W=265,l=x-W,we=9,oe=E.silk("lake"),ae=new h.Mesh(new h.PlaneGeometry(1500,1500,1,1),oe);ae.rotation.x=-Math.PI/2,ae.position.set(0,0,100),g.add(ae),oe.uniforms.uBridge.value.set(l,500,10,we+1),oe.uniforms.uShore.value.set(x-352,-1,0,60),oe.uniforms.uRipple.value[0].set(Se,x-366,34,1);const w=E.batch(),de=e=>k.silk.clone().lerp(k.ink,e),Re=de(.55),le=k.ink.clone().multiplyScalar(.95),Pe=de(.66),ie=k.vermilion,Te=k.shell,Ie=e=>we+2*(1-Math.min(1,e/500*(e/500))),Ee=7.6;for(let e=0;e<100;e++){const t=e<50?-1:1,s=e%50,o=t*(8+10*s),a=Ie(o),r=(n()-.5)*.02;for(let L=0;L<4;L++){const q=(L-1.5)*2.2;w.box(o+r*4,(a-2)/2,l+q,.5,a+2,.5,ie,{skip:"bt"})}w.box(o,a*.42,l,.26,.4,Ee+.6,le,{skip:""}),w.box(o,a-.55,l,.6,.5,Ee+1.2,le,{});const d=s<49?o+t*10:o+t*2,A=(o+d)/2,c=(a+Ie(d))/2,z=Math.abs(d-o);w.box(A,c-.05,l,z,.5,Ee,Re,{rule:-.55});for(const L of[-1,1]){w.box(A,c+1.25,l+L*(Ee/2-.15),z,.16,.16,ie,{bare:!0}),w.box(A,c+.75,l+L*(Ee/2-.15),z,.1,.1,ie,{bare:!0});for(const q of[.25,.75])w.box(ue(o,d,q),c+.72,l+L*(Ee/2-.15),.2,1.3,.2,ie,{skip:"b",bare:!0})}e%10===9&&await i.yield()}const nt=(e,t,s,o,a,r,d,A)=>{const c=(I,Z,ke)=>d?[e+I,Z,s+ke]:[e+ke,Z,s+I],z=Math.max(.4,o-a*.8),L=8,q=4,V=Math.hypot(a,r)*1.08,G=(I,Z)=>t+r*(.3*Z+.7*Z*Z)+A*Math.abs(I*I*I)*(1-Z)*(1-Z);for(const I of[-1,1]){const Z=(ne,ce)=>c(ue(ne*o,ne*z,ce),G(ne,ce),I*a*(1-ce)),ke=(ne,ce)=>c(I*ue(o,z,ce),G(ne,ce),ne*a*(1-ce));for(const[ne,ce]of[[Z,2*o],[ke,2*a]])for(let Ae=0;Ae<L;Ae++)for(let ye=0;ye<q;ye++){const Le=-1+2*Ae/L,Ce=-1+2*(Ae+1)/L,Oe=ye/q,_e=(ye+1)/q,Ye=st=>(st*.5+.5)*ce;w.quad(ne(Le,Oe),ne(Ce,Oe),ne(Ce,_e),ne(Le,_e),Pe,{uv:[[Ye(Le),Oe*V],[Ye(Ce),Oe*V],[Ye(Ce),_e*V],[Ye(Le),_e*V]],size:[ce,V],rule:-.75})}}const B=c(0,t+r+.05,0);w.box(B[0],B[1],B[2],d?2*z+.8:.5,.6,d?.5:2*z+.8,le,{bare:!0});for(const I of[-1,1]){const Z=c(I*(z+.35),t+r+.6,0);w.box(Z[0],Z[1],Z[2],d?.5:.6,1.3,d?.6:.5,le,{bare:!0})}},re=Ie(0)+.25,Fe=5;w.box(0,re-.2,l,26,.5,10,Re,{rule:-.55}),w.box(0,re-.2,l,16,.5,22,Re,{rule:.55});for(const e of[-1,1])for(const t of[-10.4,-6.2,6.2,10.4])w.box(e*8,(re-2)/2,l+t,.5,re+1.6,.5,ie,{skip:"bt"});for(const e of[-1,1])for(const t of[-4.4,4.4])w.box(e*12.6,(re-2)/2,l+t,.5,re+1.6,.5,ie,{skip:"bt"});{const e=re-.55,t=re-.95,s=re-1.38,o={bare:!0};for(const a of[-1,1]){w.box(a*8,t,l,.62,.5,21.8,le,o),w.box(a*12.6,t,l,.62,.5,9.8,le,o);for(const r of[-10.4,-6.2,6.2,10.4])w.box(a*8,s,l+r,.74,.45,2.3,ie,o),w.box(a*8,s,l+r,2,.45,.74,ie,o);for(const r of[-4.4,4.4])w.box(a*12.6,s,l+r,.74,.45,2.3,ie,o),w.box(a*12.6,s,l+r,2,.45,.74,ie,o);for(const r of[9.5,11.5])w.box(a*r,e,l,.24,.4,9.8,le,o);for(let r=14;r<28;r+=2)r!==18&&w.box(a*r,Ie(a*r)-.4,l,.24,.3,Ee+.4,le,o)}for(const a of[-10.4,-6.2,6.2,10.4])w.box(0,t,l+a,16.6,.5,.62,le,o);for(const a of[-4.4,4.4])w.box(0,t,l+a,25.8,.5,.62,le,o);for(let a=-7;a<=7;a+=2)w.box(a,e,l,.24,.4,21.8,le,o)}const Qe=[[12.6,4.6],[7.6,10.6]];for(let e=0;e<2;e++){const[t,s]=Qe[e],[o,a]=Qe[1-e],r=[],d=Math.round(t*2/4.2),A=Math.round(s*2/4.2);for(let c=0;c<=d;c++)r.push([-t+2*t*c/d,-s]),r.push([-t+2*t*c/d,s]);for(let c=1;c<A;c++)r.push([-t,-s+2*s*c/A]),r.push([t,-s+2*s*c/A]);for(const[c,z]of r)Math.abs(c)<o-.1&&Math.abs(z)<a-.1||w.box(c,re+Fe/2,l+z,.42,Fe,.42,ie,{skip:"bt"});for(const c of[-1,1])for(const z of[.55,1.05])e===0?(w.box(c*(t+o)/2,re+z,l-s,t-o,.12,.12,ie,{bare:!0}),w.box(c*(t+o)/2,re+z,l+s,t-o,.12,.12,ie,{bare:!0})):(w.box(-t,re+z,l+c*(s+a)/2,.12,.12,s-a,ie,{bare:!0}),w.box(t,re+z,l+c*(s+a)/2,.12,.12,s-a,ie,{bare:!0}));w.box(0,re+Fe-.25,l,t*2+.3,.5,s*2+.3,le,{skip:"tb",bare:!0})}w.box(0,re+Fe/2,l,11.4,Fe,7.4,Te,{rule:-1.9,skip:"tb"});for(const e of[-1,1]){w.box(0,re+1.7,l+e*3.72,2.6,3.4,.1,le,{bare:!0}),w.box(e*5.72,re+1.7,l,.1,3.4,2.2,le,{bare:!0});for(const t of[-5.7,-1.9,1.9,5.7])w.box(t,re+Fe/2,l+e*3.7,.36,Fe,.36,ie,{skip:"bt"})}nt(0,re+Fe,l,14.6,6.6,3.5,!0,1.25),nt(0,re+Fe,l,12.6,9.6,3.8,!1,1.25);const We=re+Fe+3.3,xe=4.3;w.box(0,We+.1,l,xe*2+2.6,.3,xe*2+2.6,le,{bare:!0}),w.box(0,We+2,l,xe*2,3.8,xe*2,Te,{rule:-1.72,skip:"tb"}),w.box(0,We+2.5,l,xe*2+.12,1.5,xe*2+.12,de(.3),{rule:-.34,skip:"tb"});for(const e of[-1,0,1])for(const t of[-1,0,1])(e||t)&&w.box(e*xe,We+2,l+t*xe,.4,3.8,.4,ie,{skip:"bt"});for(const e of[-1,1])for(const t of[.75,1.2])w.box(0,We+t,l+e*(xe+1.15),xe*2+2.4,.11,.11,ie,{bare:!0}),w.box(e*(xe+1.15),We+t,l,.11,.11,xe*2+2.4,ie,{bare:!0});for(const e of[-1,1])for(const t of[-1,1])w.box(e*(xe+1.15),We+.7,l+t*(xe+1.15),.2,1.2,.2,ie,{skip:"b",bare:!0});w.box(0,We+3.75,l,xe*2+.5,.5,xe*2+.5,le,{skip:"tb",bare:!0}),nt(0,We+3.9,l,8.4,6.9,re+19-1.4-(We+3.9),!0,1.5),await i.yield();const Ne=E.silk("lake");Ne.uniforms.uShore.value.set(1e5,1,0,60);const Xe=[[oe,0,Se,x-366,34,1]];{const e=[],t=[];let s=0;pe.slice(0,2).forEach(([r,d],A)=>{const c=Se+1,z=r+31,L=28,q=s;e.push(c,d+.35,x-z),s++;for(let V=0;V<L;V++){const G=V/L*6.2832,B=1+.12*Math.sin(G*3+A)+.08*Math.sin(G*5+1.3);e.push(c+Math.cos(G)*17*B,d+.35,x-z+Math.sin(G)*13*B),s++}for(let V=0;V<L;V++)t.push(q,q+1+(V+1)%L,q+1+V);Xe.push([Ne,A,c,x-z-9,30,1])});const o=22;for(let r=0;r<=o;r++){const d=r/o,A=ue(et-1,512,d),c=ue(0,Se,_(.25,.95,d))+1.4*Math.sin(d*9),z=2.2+1.6*d+.5*Math.sin(d*13);e.push(c-z,Ue(A)+.3,x-A,c+z,Ue(A)+.3,x-A),r<o&&t.push(s,s+2,s+1,s+1,s+2,s+3),s+=2,(r===1||r===8||r===15||r===21)&&Xe.push([Ne,2+(r===1?0:r===8?1:r===15?2:3),c,x-A,12,.9])}const a=new h.BufferGeometry;a.setAttribute("position",new h.Float32BufferAttribute(e,3)),a.setIndex(t),g.add(new h.Mesh(a,Ne))}await i.yield();const ct=158,be=ct+8,fe=x-et;if(m.gate!==!1){const r=c=>{const z=Math.cos(c),L=Math.sin(c),q=Math.min(13/Math.max(Math.abs(z),1e-4),(L>0?9:8.6)/Math.max(Math.abs(L),1e-4));return[z*q,L*q]};for(let c=0;c<56;c++){const z=c/56*6.2832,L=(c+1)/56*6.2832,q=r(z),V=r(L),G=[Math.cos(z),Math.sin(z)],B=[Math.cos(L),Math.sin(L)];for(const I of[-1,1]){const Z=fe+I*.7;w.quad([G[0]*7.8,be+G[1]*7.8,Z],[q[0],be+q[1],Z],[V[0],be+V[1],Z],[B[0]*7.8,be+B[1]*7.8,Z],Te,{bare:!0}),w.quad([G[0]*7,be+G[1]*7,Z+I*.06],[G[0]*7.8,be+G[1]*7.8,Z+I*.06],[B[0]*7.8,be+B[1]*7.8,Z+I*.06],[B[0]*7,be+B[1]*7,Z+I*.06],ie,{bare:!0})}w.quad([G[0]*7,be+G[1]*7,fe-.7],[G[0]*7,be+G[1]*7,fe+.7],[B[0]*7,be+B[1]*7,fe+.7],[B[0]*7,be+B[1]*7,fe-.7],ie,{bare:!0})}for(const c of[-1,1])w.box(c*13,be+(9-8.6)/2,fe,.3,9+8.6,.7*2+.1,le,{bare:!0});for(const c of[-1,1])w.box(c*8.4,be-8.6+.75,fe,9.4,1.5,.7*2+.3,de(.42),{rule:.5});const d=be+9,A=2.1;for(const c of[-1,1])w.quad([-13-.7,d,fe+c*A],[13+.7,d,fe+c*A],[13+.5,d+1.3,fe],[-13-.5,d+1.3,fe],Pe,{rule:-.6});for(const c of[-1,1])w.box(c*(13+.9),d+.5,fe,.5,1.5,A*2+.3,le,{bare:!0});w.box(0,d+1.4,fe,26+1.4,.4,.45,le,{bare:!0}),w.box(0,d-.12,fe,26+1.5,.24,A*2+.1,le,{bare:!0});for(const c of[-1,1]){const z=[];for(let L=0;L<=64;L++){const q=L/64*6.2832;z.push([Math.cos(q)*8.05,be+Math.sin(q)*8.05,fe+c*(.7+.12)])}He.push({pts:z,w:.8})}}await i.yield();const ht=await w.geometryAsync(i);await i.yield();const Ke=new h.Mesh(ht,E.flat());g.add(Ke),await i.yield();const vt=E.goldRibbon(He);g.add(vt),await i.yield();const me=(e,t,s)=>new h.Vector3(e,t,x-s),Rt=[me(0,56,0),me(0,56,60),me(0,4,190),me(0,4,W),me(0,4.5,335),me(0,7,345),me(0,63,379),me(0,63,405),me(0,113,438),me(0,113,470),me(0,166,503),me(0,166,520),me(0,166,et)],Tt={portalSeat:{position:me(0,be,et),normal:new h.Vector3(0,0,1),radius:7},flyThrough:Rt,entryEye:me(0,56,0),underSpan:me(0,4,W),pavilion:new h.Vector3(0,re+9,l),crown:me(H[0],H[1],H[2]),shoulder:me(f[0],f[1],f[2]),lips:pe.map(([e,t])=>me(Se,t,e)),pools:[me(Se+1,0,366),me(Se+1,55.35,416),me(Se+1,105.35,476)],hutSeat:me(u[0],u[1],u[2]),terracePines:[me(-13,158,590),me(11,158,596)],streamSource:me(0,158.3,et-1),bridge:{z:l,halfLength:500,spacing:10,deckWidth:Ee,deckY:Ie}};let wt=!1;const xt=(e,t)=>{wt=!0,se.material.setCoats(e,t)},Ct=(e,t=42)=>xt(e*t-2,e*t-27),Gt=new h.Vector3,bt=oe.uniforms;function Bt(e,t,s){if(U&&E.update(e,t,s),!wt){const c=t%44;se.material.setCoats(c-2,c-15)}const o=g.matrixWorld.elements,a=(c,z)=>o[2]*c+o[10]*z+o[14],r=(c,z)=>o[0]*c+o[8]*z+o[12],d=a(0,l),A=a(0,x-352);bt.uBridge.value.x=d,bt.uShore.value.set(A,Math.sign(A-d)||1,o[13],60),Ne.uniforms.uShore.value.z=o[13];for(const[c,z,L,q,V,G]of Xe)c.uniforms.uRipple.value[z].set(r(L,q),a(L,q),V,G)}const It=e=>Gt.copy(e).applyMatrix4(g.matrixWorld).clone();return{object:g,radius:210,height:280,center:new h.Vector3(-15,95,40),anchors:Tt,update:Bt,dispose(){},ground:!1,groundY:0,style:E,setCoats:xt,setProgress:Ct,toWorld:It,heightAt:se.heightAt,heightAt0:se.origAt,parts:{peak:se.mesh,gold:vt,trees:O,lake:ae,built:Ke},extent:{peak:420,bridgeHalf:500}}}export{Ut as PALETTE,no as buildHero,$t as makeStyle};
