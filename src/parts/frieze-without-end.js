import*as h from"three";import{mergeGeometries as He}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as xe,lerp as ze,smoothstep as Pe}from"../kit/core.js";import{makeRng as $e}from"../kit/core.js";const U=503,X=340,he=U/(2*Math.PI),ee=5,Z=4,I=U*Z,oe=X*Z,ue=57,Ee=["#7E6B55","#A68E6E","#D6C6A5","#E4D8BD","#1F3C88","#D1A640","#C9D8D6"],Ie={lapis:null,carnelian:["#A8321E","#E9B48C","#D1A640"],serpentine:["#2F5D4A","#B9CDB4","#C9CCD0"]},fe=`
uniform float uTime, uContact, uSunTan, uStart, uWind, uPixel;
uniform vec3 uFronts, uOrigin, uTone[4], uSky, uCream, uHaze, uCamPos; uniform vec4 uGhost;
uniform sampler2D uPic;
float fzH(vec4 t){ return t.r + (t.b - 0.5) * 0.00392157; }   // height 0..1: byte + residual, filters exactly
float fzHash(vec2 p){ p = fract(p * vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.x); }
float fzNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(fzHash(i), fzHash(i + vec2(1., 0.)), f.x), mix(fzHash(i + vec2(0., 1.)), fzHash(i + vec2(1., 1.)), f.x), f.y); }
float fzFbm(vec2 p){ return 0.5 * fzNoise(p) + 0.3 * fzNoise(p * 2.13 + 7.1) + 0.2 * fzNoise(p * 4.37 + 3.7); }
vec2 fzPicUv(vec2 xz){ return vec2((xz.y + ${ue}.) / ${U}., (xz.x + ${X/2}.) / ${X}.); }
vec3 fzToneOf(vec3 s){ return mix(mix(mix(uTone[0], uTone[1], s.x), uTone[2], s.y), uTone[3], s.z); }
// shaded clay: the SAME value at 0.6 leaned a tenth to the sky, worked out in DISPLAY terms (the flat switch shows
// linear colour as its sRGB hex, so 0.6 of the linear value would print at 0.8): #7E6B55 -> #584F43
vec3 fzShade(vec3 c, float sh){
  vec3 d = 0.39 * pow(max(c, vec3(0.)), vec3(0.4545)) + 0.08 * pow(max(uSky, vec3(0.)), vec3(0.4545));      // round seven: a deeper shade (0.45 before), one flat tone
  return mix(c, pow(d, vec3(2.2)), sh); }
vec3 fzHazed(vec3 c, vec3 wp){ float d = length(wp - uCamPos) / 2000.; return mix(c, uHaze, 1. - exp(-d * d * d)); }
`,Fe=`
uniform vec3 uSunDir; uniform float uRain;
// dryness 0 wet .. 3 chalk at course point xz, height h (m): three ragged lines, relief tops first
vec4 fzDry(vec2 xz, float h){
  float rag = (fzFbm(xz * 0.011) - 0.5) * 64. + (fzNoise(xz * 0.09) - 0.5) * 9.;
  // relief dries from its tops down: each line reaches a height h this many metres early (the long-dry line by
  // the most, so through the whole bone-dry stretch a figure stands chalk on bone, graded by its contours)
  vec3 z = vec3(xz.y + rag) - h * vec3(22., 26., 58.);
  vec3 w = clamp(fwidth(z) * 0.75, 0.15, 5.);           // hard lines: a pixel of filtering and no more
  vec3 s = 1. - smoothstep(uFronts - w, uFronts + w, z);   // x: past wet line, y: past leather line, z: past bone line
  return vec4(s, uFronts.z - xz.y - rag);              // w: metres behind the long-dry line (the ground's own age)
}
float fzVor(vec2 p){ vec2 i = floor(p), f = fract(p); float d1 = 8., d2 = 8.;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) { vec2 g = vec2(float(x), float(y));
    vec2 o = vec2(fzHash(i + g), fzHash(i + g + 17.3)); float d = length(g + o - f);
    if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d; }
  return d2 - d1; }
float fzSurface(vec2 xz, float age, float wet){
  float px = max(fwidth(xz.x), fwidth(xz.y));
  float m = 1.;
  float fine = 1. - smoothstep(0.05, 0.35, px);
  m -= 0.045 * fine * (fzNoise(vec2(xz.x * 5., xz.y * 0.16)) - 0.5) * 2.;            // drag striations, along Z
  vec2 pc = xz * 1.7; float ph = fzHash(floor(pc));
  m -= 0.07 * fine * step(0.9, ph) * (1. - smoothstep(0.1, 0.22, length(fract(pc) - 0.5)));   // pinholes
  float a = clamp(age, 0., 1.) * (1. - wet);
  m += 0.02 * (fzNoise(xz * 0.05) - 0.5);
  return m; }
// cracks of the drying clay, two scales of irregular plates; the line widens with age. Returned as a 0..1
// SHADE amount: a crack is drawn in the shadow tone like every other line of the style. Thin lines are
// weighted by their share of the pixel, so they fade with distance instead of sparkling.
// after rain the old clay is pocked with drop craters instead of cracking: drawn like the drilled balls in
// reverse, a hard crescent of shade under the sunward lip and the thin shade of the raised rim on the lee.
// Three sizes; each is dropped when its bowl is under a pixel and a half.
float fzCrater(vec2 xz, float px){
  float s = 0.;
  for (int k = 0; k < 3; k++) {
    float cell = k == 0 ? 9. : (k == 1 ? 3.7 : 1.5);
    vec2 q = xz / cell + float(k) * 17.3, ci = floor(q);
    vec2 o = (vec2(fzHash(ci + 2.1), fzHash(ci + 9.7)) - 0.5) * 0.3;
    float rr = 0.15 + 0.19 * fzHash(ci + 5.5), e = px / cell + 0.003;
    vec2 f = fract(q) - 0.5 - o;
    float on = step(0.16, fzHash(ci + 1.3)) * (1. - smoothstep(0.3 * rr, 0.75 * rr, e));
    float bowl = 1. - smoothstep(rr - e, rr + e, length(f));
    float lit = 1. - smoothstep(rr * 0.96 - e, rr * 0.96 + e, length(f - vec2(rr * 0.56, 0.)));
    float lee = (1. - smoothstep(rr * 1.07 - e, rr * 1.07 + e, length(f - vec2(rr * 0.2, 0.)))) * (1. - bowl);
    s = max(s, on * max(bowl * (1. - lit), 0.45 * lee * step(0.5, fzHash(ci + 7.7))));
  }
  return s; }
float fzCrack(vec2 xz, float age, float wet){
  float px = max(fwidth(xz.x), fwidth(xz.y));
  float a = clamp(age, 0., 1.) * (1. - wet);
  if (uRain > 0.5) return 0.9 * fzCrater(xz, px) * smoothstep(0.03, 0.3, a);
  float w1 = 0.018 + 0.022 * a, w2 = 0.035 + 0.04 * a, p1 = px * 0.11 + 1e-4, p2 = px * 0.45 + 1e-4;
  float c1 = clamp((w1 - fzVor(xz * 0.11)) / p1 + 0.5, 0., 1.) * clamp(2. * w1 / p1, 0., 1.) * (1. - smoothstep(1.2, 3.5, px));
  float c2 = clamp((w2 - fzVor(xz * 0.45 + 31.)) / p2 + 0.5, 0., 1.) * clamp(2. * w2 / p2, 0., 1.) * (1. - smoothstep(0.3, 1., px));
  return 0.6 * max(c1, 0.7 * c2) * smoothstep(0.03, 0.3, a); }      // a crack is a thin line of shade, held under the figures' own
`,Te=`
attribute float aTile; uniform float uTileZ;
#ifdef FZ_PATCH
  uniform vec4 uPatch;     // centre x, centre z, cell, half size
#endif
varying vec3 vL; varying vec3 vW;
${fe}
float fzH1(vec2 xz, float lod){        // the ground's height (metres), the ghost included
  float h = fzH(textureLod(uPic, fzPicUv(xz), lod)) * ${ee}.;
  #ifdef FZ_GHOST
    h = max(h, fzH(textureLod(uPic, fzPicUv(xz - uGhost.xy), lod)) * ${(ee/2).toFixed(2)} * uGhost.z * (1. - smoothstep(uGhost.w - 50., uGhost.w, xz.y)));
  #endif
  return h; }
// the height the grid carries: five taps over one cell (a tent two cells wide that does not sit on the mip
// lattice), so a chamfer always spans two cells and no ridge is combed or stepped by the grid
float fzHv(vec2 xz, float lod, float r){
  return 0.36 * fzH1(xz, lod) + 0.16 * (fzH1(xz + vec2(r, r), lod) + fzH1(xz + vec2(-r, r), lod) + fzH1(xz + vec2(r, -r), lod) + fzH1(xz - vec2(r, r), lod)); }
// Under the lens the grid carries the highest of nine taps within 0.85 of a cell instead: every flat crest is a
// true plateau that reaches a little past its chamfer, so the tone edge along a crest lies on level ground and
// stays a ruled line, and the grid's stepping is all on the wall below it, which CLAY_FRAG shades in one tone.
float fzHp(vec2 xz, float lod, float r){
  float a = 0.71 * r, h = fzH1(xz, lod);
  h = max(h, max(max(fzH1(xz + vec2(r, 0.), lod), fzH1(xz - vec2(r, 0.), lod)), max(fzH1(xz + vec2(0., r), lod), fzH1(xz - vec2(0., r), lod))));
  return max(h, max(max(fzH1(xz + vec2(a, a), lod), fzH1(xz - vec2(a, a), lod)), max(fzH1(xz + vec2(a, -a), lod), fzH1(xz + vec2(-a, a), lod)))); }
void main(){
  #ifdef FZ_PATCH
    vec3 p = vec3(clamp(position.x * uPatch.z + uPatch.x, -${X/2}., ${X/2}.), 0., position.z * uPatch.z + uPatch.y);
    float tap = max(0.85 * uPatch.z, 1.3), lod = log2(max(uPatch.z, 0.26) * ${Z}.) - 1.;
  #else
    vec3 p = position; p.z += uTileZ - aTile * ${U}.;
    float tap = position.x < -100. ? 1.1 : 1.4, lod = position.x < -100. ? 2.4 : (position.x < 0. ? 2.9 : 3.2);
  #endif
  vec4 wp = modelMatrix * vec4(p, 1.);
  vec3 L = wp.xyz - uOrigin;
  #ifdef FZ_PATCH
    // round four: the plateau reaches 1.3 m past every crest, to the FOOT of its chamfer, so the whole painted figure
    // (pale top, lit lip, shade line: all per pixel from the picture) lies on level ground and every edge of it is a
    // ruled line; the grid's stepping is all on the wall outside the foot, which is painted as the ground it stands
    // on (sun side) or as the shade it stands in (lee side) and so cannot be seen
    float h = fzHp(L.xz, lod, tap);
  #else
    float h = fzHv(L.xz, lod, tap);
  #endif
  wp.y += h + 0.07;          // the print lies a finger above its backing plain: the two never fight for depth
  vL = vec3(L.x, h, L.z); vW = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,Ae=`
varying vec3 vL; varying vec3 vW;
${fe}
${Fe}
uniform vec4 uHole; uniform float uHoleM, uCellF; uniform vec4 uInlay[16]; uniform vec3 uStone, uGold;
#ifdef FZ_GHOST
  uniform sampler2D uPic2;
#endif
// ROUND EIGHT: under the lens the picture is read through a cubic B-spline (four bilinear taps), so the height and
// everything cut from it (the pale top's contour, the lit lip, the shade) is a smooth field: a straight wheel-cut
// has ruled edges at any size. (A threshold on plain bilinear taps kinks at every texel: the teeth of a comb.)
vec4 fzPicC(vec2 uv){
  vec2 sz = vec2(${I}., ${oe}.), st = uv * sz - 0.5, i = floor(st), f = st - i, f2 = f * f, f3 = f2 * f;
  vec2 w0 = (1. - f) * (1. - f) * (1. - f) / 6., w1 = (3. * f3 - 6. * f2 + 4.) / 6., w3 = f3 / 6., w2 = 1. - w0 - w1 - w3;
  vec2 g0 = w0 + w1, g1 = w2 + w3;
  vec2 p0 = (i - 0.5 + w1 / max(g0, vec2(1e-4))) / sz, p1 = (i + 1.5 + w3 / max(g1, vec2(1e-4))) / sz;
  return g0.y * (g0.x * textureLod(uPic, p0, 0.) + g1.x * textureLod(uPic, vec2(p1.x, p0.y), 0.))
       + g1.y * (g0.x * textureLod(uPic, vec2(p0.x, p1.y), 0.) + g1.x * textureLod(uPic, p1, 0.)); }
vec4 fzPicN(vec2 uv, float bs, float kC){
  vec4 t = texture2D(uPic, uv, bs);
  #ifdef FZ_PATCH
    t = mix(t, fzPicC(uv), kC);
  #endif
  return t; }
void main(){
  if (vL.z > uContact || vL.z < uStart) discard;
  if (uHole.w > 0. && max(abs(vL.x - uHole.x), abs(vL.z - uHole.y)) < uHole.w - uHoleM) discard;   // a finer patch has this ground
  vec2 xz = vL.xz, uv = fzPicUv(xz);
  // a level sharper under the lens (shadows stay a drawing at grazing angles), the true level far off: a mask taken
  // sharper than the pixel there breaks into speckle, and the far band must be a line drawing
  float cd = length(vW - uCamPos), far = smoothstep(300., 700., cd), bs = -1. + smoothstep(220., 520., cd) + 0.8 * smoothstep(450., 1000., cd);     // far off a level blurrier still: only the big shapes and their shade stay
  float kC = 1. - smoothstep(75., 112., cd), nearK = 1. - smoothstep(70., 120., cd);
  vec4 t = fzPicN(uv, bs, kC);
  // ROUND EIGHT, the far band as a clean drawing: beyond 400 m the picture is read once more at the level of the
  // pixel's LONG side (the anisotropic lookup above is sharper than the pixel grid there, and a threshold on it
  // breaks into ragged blotches): only shapes larger than a pixel are left, and their shade is cut on that smooth
  // field, so every far edge is a curve and what is too small to draw is not drawn
  vec2 tq = uv * vec2(${I}., ${oe}.);
  float lodF = log2(max(max(length(dFdx(tq)), length(dFdy(tq))), 1.)), farK = smoothstep(380., 620., cd);
  vec4 tF = textureLod(uPic, uv, lodF + 0.3);
  float h0 = fzH(t), h = h0 * ${ee}.;
  // the slope, taken across three texels and centred: the chamfer of a thin wheel-cut is only two and a half
  // texels wide, and a one-sided difference draws its shade line as texel stairs (a comb down every limb)
  float e = 1. / ${I}., ez = 1.5 / ${I}., ex = 1.5 / ${oe}.;
  float hzp = fzH(fzPicN(uv + vec2(ez, 0.), bs, kC)), hzm = fzH(fzPicN(uv - vec2(ez, 0.), bs, kC));
  float hxp = fzH(fzPicN(uv + vec2(0., ex), bs, kC)), hxm = fzH(fzPicN(uv - vec2(0., ex), bs, kC));
  float hz = hzp - hzm, hx = hxp - hxm;
  vec3 N = normalize(vec3(-hx * ${(ee*Z/3).toFixed(3)}, 1., -hz * ${(ee*Z/3).toFixed(3)}));
  float hsm = (0.5 * h0 + 0.125 * (hzp + hzm + hxp + hxm)) * ${ee}.;      // the height the drying lines read: smooth across a chamfer
  // ROUND FIVE: every tone and every shade on the print is read from the PICTURE at the pixel and from nothing else.
  // (Round four also shaded "the wall", wherever the ground grid stood above the picture; the grid's height changes
  // cell by cell, so the terminator of every drilled scale was a comb and the limbs had ragged lips.) The grid only
  // gives the relief its parallax; its plateau reaches past every chamfer, so each painted edge lies on level grid.
  // far off the mask is cut over the whole width its value changes in a pixel, so the shade of a figure too small for
  // the pixel grid is a grey of its true cover and never a flipping dot (the far band is a line drawing, not dither)
  float sw = clamp(fwidth(t.g) * 0.8, 0.006, mix(0.03, 0.5, far));
  float sh = smoothstep(0.052 - min(sw, 0.05), 0.052 + sw, t.g);
  #ifdef FZ_GHOST
  {   // the second roll: a first impression a little out of true, half as high, ironed out by the fresh print
    float gm = uGhost.z * (1. - smoothstep(uGhost.w - 50., uGhost.w, xz.y));
    vec2 gu = fzPicUv(xz - uGhost.xy);
    float g0 = fzH(texture2D(uPic, gu, bs)) * 0.5 * gm;
    if (g0 > h0) {
      hz = (fzH(texture2D(uPic, gu + vec2(e * 2., 0.), -1.)) * 0.5 * gm - g0); hx = (fzH(texture2D(uPic, gu + vec2(0., e * ${(I/oe*2).toFixed(4)}), -1.)) * 0.5 * gm - g0);
      N = normalize(vec3(-hx * ${(ee*Z/2).toFixed(1)}, 1., -hz * ${(ee*Z/2).toFixed(1)}));
      h0 = g0; h = h0 * ${ee}.; hsm = h;
    }
    // its own shade, baked like the picture's (the same horizon sweep at half height, uPic2): a ruled hard
    // edge, half as long, and only where the ghost's horizon stands above the ground that is really there
    float g2 = texture2D(uPic2, gu, -1.).r, gw = clamp(fwidth(g2) * 0.35, 0.004, 0.02);
    float gs = smoothstep(0.04 - gw, 0.04 + gw, g2 * 0.4 * gm + g0 - h0);
    sh = max(sh, gs);
  }
  #endif
  // the facing says shade too: clay turned from the sun, and the steep flanks of a wheel-cut that the raking
  // sun only grazes (less than half the light flat ground takes), so a limb lying along the light is still
  // drawn, by a hard line down each side of its crest
  float nls = dot(N, uSunDir), fnl = fwidth(nls) * 0.7 + 0.008;
  // (round eight: under the lens only what is turned AWAY from the sun is shade; the flanks of a cut lying along the
  // light were a rim of a third tone down both sides of every limb)
  float thrN = mix(0.5 * uSunDir.y, -0.04, nearK);
  sh = max(sh, 1. - smoothstep(thrN - fnl, thrN + fnl, nls));
  { float wF = clamp(fwidth(tF.g) * 0.9, 0.012, 0.2);
    sh = mix(sh, smoothstep(0.09 - wF, 0.09 + wF, tF.g), farK);
    hsm = mix(hsm, fzH(tF) * ${ee}., farK); }
  vec4 d = fzDry(xz, hsm);
  float wet = 1. - d.x, age = (d.w + 320.) / 320.;
  // THE PICTURE IS A PICTURE: whatever stands above a metre is one whole tone drier than the ground it stands on
  // (pale figures on dark clay, cut by a hard contour), except in the fresh print right behind the seal
  float fl = fwidth(hsm) * 0.7 + 0.03;
  float lift = smoothstep(0.9 - fl, 0.9 + fl, hsm) * (1. - smoothstep(uContact - 5., uContact - 1.5, xz.y));      // round eight: a fresh figure has its paler top from the contact line on (three tones the moment it comes out from under the drum)
  // round eight: under the lens the shaded FLANK of a cut (steep clay turned from the sun) takes the ground's shade
  // tone, the same as the cast shade lying beside it, so no limb has a rim of a third tone; broad shade on a figure's
  // top (the lee half of a drilled dome, a shadow falling across a body) keeps the figure's own
  float steep = smoothstep(1.1, 2., length(vec2(hx, hz)) * ${(ee*Z/3).toFixed(3)});
  vec3 dl = mix(d.xyz, vec3(1., d.x, d.y), lift * (1. - sh * nearK * steep));
  vec3 col = fzToneOf(dl) * fzSurface(xz, age, wet);
  sh = max(sh, fzCrack(xz, age, wet));
  // the lit lip: the flank of every cut that faces the raking sun prints in the palest tone, hard-edged
  float lipM = smoothstep(0.56 - fnl, 0.56 + fnl, nls) * (1. - sh) * (1. - wet) * (1. - far);        // round five: no lit lip on wet clay (its one highlight is the satin streak)
  col = mix(col, mix(uTone[3], uCream, 0.6), lipM);
  // round seven: gold and lapis set into the print (flat, a cut edge, shaded by the same baked shade as the clay)
  float ipx = max(fwidth(xz.x), fwidth(xz.y)) * 0.7 + 0.02, inG = 0., inL = 0.;
  vec2 pq = vec2(fract(uv.x) * ${U}., xz.x);
  for (int i = 0; i < 16; i++) {
    vec4 s = uInlay[i]; float dz = pq.x - s.x; dz -= ${U}. * floor(dz / ${U}. + 0.5);
    float m = 1. - smoothstep(s.z - ipx, s.z + ipx, length(vec2(dz, pq.y - s.y)));
    inG = max(inG, m * step(0.5, s.w) * step(s.w, 1.5)); inL = max(inL, m * step(1.5, s.w));
  }
  { vec2 sq = pq - uInlay[0].xy; sq.x -= ${U}. * floor(sq.x / ${U}. + 0.5);            // the sun's ring of twelve drilled dots, lapis
    float sa = floor(atan(sq.y, sq.x + (sq.x >= 0. ? 1e-4 : -1e-4)) / 0.5235988 + 0.5) * 0.5235988;
    inL = max(inL, (1. - smoothstep(2.5 - ipx, 2.5 + ipx, length(sq - 18.5 * vec2(cos(sa), sin(sa))))) * step(0.5, uInlay[0].w)); }
  col = mix(mix(col, uGold, inG), uStone, inL);
  // water lying in the river grooves of the wet stretch, running back toward -Z and sinking away at its end.
  // It lies only where a ridge of the river band stands on BOTH sides of it, so every edge of it is a ridge.
  float lvl = 0.75 * clamp((xz.y - uFronts.x) / 70., 0., 1.), fwh = fwidth(h) + 0.02, water = 0.;
  if (xz.x > -155.8 && xz.x < -112. && wet > 0.01 && lvl > 0.01 && h < lvl + 0.3) {      // its outer bank is the ruled line inside the rope (x -156.3), whole
    float hl = 0., hr = 0.;
    for (int k = 1; k <= 9; k++) {
      float dd = float(k) * ${(1.5/X).toFixed(6)};
      hl = max(hl, max(fzH(textureLod(uPic, uv - vec2(0., dd), 2.)), 1. - step(${(14.2/X).toFixed(5)}, uv.y - dd)));     // (that thin line was found by some taps and missed by others: a comb of dark strokes)
      hr = max(hr, fzH(textureLod(uPic, uv + vec2(0., dd), 2.)) * step(uv.y + dd, ${(56.5/X).toFixed(5)}));
    }
    water = step(lvl + 0.12, min(hl, hr) * ${ee}.) * wet * (1. - smoothstep(lvl - fwh, lvl + fwh, h));
  }
  float thr = fzNoise(vec2(xz.x * 1.3, xz.y * 0.07 + uTime * 0.9)) * 0.6 + fzNoise(vec2(xz.x * 3.1, xz.y * 0.19 + uTime * 1.7)) * 0.4;
  float fthr = fwidth(thr) * 0.7 + 0.004;
  vec3 wcol = mix(uTone[0], uCream, 0.7 * smoothstep(0.64 - fthr, 0.64 + fthr, thr));       // round seven: the clay's own tones, wet and dark, with thin running threads of cream
  col = mix(col, wcol, water);
  col = fzShade(col, sh * (1. - 0.5 * water));
  // one satin streak of sky cream on wet clay: a hard-edged band down the sunward flank of every
  // crest (it slides a little with the eye, as satin does), capped at 1
  vec3 V = normalize(uCamPos - vW + vec3(0., 1e-3, 0.));
  vec3 Sg = normalize(uSunDir + vec3(0., 0.45, 0.) + 0.2 * vec3(V.x, 0., V.z));
  float sp = dot(N, Sg), fs = fwidth(sp) * 0.7 + 0.006;
  float streak = smoothstep(0.7 - fs, 0.7 + fs, sp) * wet * (1. - sh) * (1. - water) * (1. - lift * (1. - smoothstep(uContact - 70., uContact - 45., xz.y))) * (1. - max(inG, inL));     // and the streak only on clay that is still dark: a fresh figure is three tones
  col = min(col + uCream * 0.4 * streak, vec3(1.));
  float seam = abs(fract(uv.x + 0.5) - 0.5) * ${U}.;
  col *= 1. - 0.16 * (1. - smoothstep(0.12, 0.12 + fwidth(xz.y) * 1.2 + 0.05, seam));
  gl_FragColor = vec4(fzHazed(col, vW), 1.);
}`,Se=`
varying vec3 vL; varying vec3 vW; varying vec3 vN;
uniform vec3 uOrigin;
void main(){
  vec4 p = vec4(position, 1.); vec3 n = normal;
  #ifdef USE_INSTANCING
    p = instanceMatrix * p; n = mat3(instanceMatrix) * n;
  #endif
  vec4 wp = modelMatrix * p; vW = wp.xyz; vL = wp.xyz - uOrigin; vN = mat3(modelMatrix) * n;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,Ne=`
varying vec3 vL; varying vec3 vW; varying vec3 vN;
uniform float uDryBias;
${fe}
${Fe}
void main(){
  vec3 N = vN * (gl_FrontFacing ? 1. : -1.); float ln = length(N); N = ln > 1e-5 ? N / ln : vec3(0., 1., 0.);
  vec4 d = fzDry(vL.xz + vec2(0., uDryBias), 0.);
  vec3 col = fzToneOf(d.xyz) * fzSurface(vL.xz + vL.y * 0.7, (d.w + 260.) / 380., 1. - d.x);
  float nl = dot(N, uSunDir), fn = fwidth(nl) + 0.01, sh = 1. - smoothstep(-fn, fn, nl);
  col = fzShade(col, sh);
  // wet clay keeps its one satin streak of sky cream here too: a hard band down the sunward shoulder
  vec3 V = normalize(uCamPos - vW + vec3(0., 1e-3, 0.));
  vec3 Sg = normalize(uSunDir + vec3(0., 0.45, 0.) + 0.2 * vec3(V.x, 0., V.z));
  float sp = dot(N, Sg), fs = fwidth(sp) * 0.7 + 0.006;
  col = min(col + uCream * 0.4 * smoothstep(0.9 - fs, 0.9 + fs, sp) * (1. - d.x) * (1. - sh), vec3(1.));
  gl_FragColor = vec4(fzHazed(col, vW), 1.);
}`,Ge=`
attribute vec4 aPlate; uniform float uPlateAll, uLoft, uPlateRate;
varying vec3 vL; varying vec3 vW; varying vec3 vN;
${fe}
void main(){
  float seed = aPlate.w, size = aPlate.z;
  float ph = fract(uTime * uWind * uPlateRate * (0.03 + 0.03 * fract(seed * 7.13)) + seed);
  float lift = smoothstep(0.6, 1., ph), curl = smoothstep(0., 0.6, ph) * 0.8 + lift * 0.5;
  float live = max(uPlateAll, step(aPlate.y, uFronts.z - 15.)) * (1. - smoothstep(0.93, 1., ph)) * smoothstep(0., 0.04, ph);
  float ry = seed * 39.7, cy = cos(ry), sy = sin(ry);
  // round eight (FZ_PLATE_BIG): a plate the size of one cell of the cracked plain curls only a little (its shade lies
  // right beside it) and draws in as it curls, so the darker bed it is leaving shows round it (FZ_PLATE_BED: that bed,
  // a flat patch of bone-dry clay that opens as the plate curls and closes when the skin has formed again)
  #ifdef FZ_PLATE_BIG
    float shrink = 1. - 0.3 * curl, ck = 0.1;
  #else
    float shrink = 1., ck = 0.3;
  #endif
  #ifdef FZ_PLATE_BED
    shrink = smoothstep(0.02, 0.2, ph) * (1. - smoothstep(0.9, 1., ph)); live = 1.; curl = 0.; lift = 0.;
  #endif
  vec3 p = vec3(position.x * cy - position.z * sy, 0., position.x * sy + position.z * cy) * size * live * shrink;
  float r2 = dot(position.xz, position.xz) * 4.;
  p.y = curl * r2 * size * ck;
  vec3 n = normalize(vec3(-(position.x * cy - position.z * sy) * curl * 8. * ck, 1., -(position.x * sy + position.z * cy) * curl * 8. * ck));
  float a = lift * (5. + 9. * fract(seed * 3.7)), ca = cos(a), sa = sin(a);
  p = vec3(p.x * ca - p.y * sa, p.x * sa + p.y * ca, p.z); n = vec3(n.x * ca - n.y * sa, n.x * sa + n.y * ca, n.z);
  float ground = fzH(textureLod(uPic, fzPicUv(aPlate.xy), 2.)) * ${ee}.;
  vec3 L = vec3(aPlate.x, ground + 0.06, aPlate.y) + p;
  L += lift * lift * vec3(50. + 60. * fract(seed * 5.3), (3. + 12. * fract(seed * 9.1)) * uLoft, 14. * (fract(seed * 2.9) - 0.3)) + vec3(0., sin(lift * 3.14159) * 5. * min(1., uLoft), 0.);
  #ifdef FZ_PLATE_SHADE
    // round eight: the plate's own shade, laid on the ground where the raking sun puts it (a line here is a shadow)
    L.x += max(L.y - ground - 0.06, 0.) / max(uSunTan, 0.05); L.y = ground + 0.09; n = vec3(0., 1., 0.);
  #endif
  #ifdef FZ_PLATE_BED
    L.y = ground + 0.03;
  #endif
  vec4 wp = modelMatrix * vec4(L, 1.);
  vW = wp.xyz; vL = wp.xyz - uOrigin; vN = n;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,Re=`
varying vec3 vL; varying vec3 vW; varying vec3 vN;
${fe}
void main(){
  #ifdef FZ_PLATE_BED
    gl_FragColor = vec4(fzHazed(uTone[2], vW), 1.);
  #else
    gl_FragColor = vec4(fzHazed(fzShade(uTone[3], 1.), vW), 1.);
  #endif
}`,Oe=`
varying vec3 vL; varying vec3 vW; uniform vec3 uOrigin;
void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vL = wp.xyz - uOrigin; gl_Position = projectionMatrix * viewMatrix * wp; }`,Be=`
varying vec3 vL; varying vec3 vW;
${fe}
${Fe}
void main(){
  vec2 xz = vL.xz;
  // the prepared bed ahead of the seal: smooth damp clay inside the strip, ragged at its edges
  float rag = (fzNoise(xz * 0.03) - 0.5) * 14.;
  float ew = fwidth(xz.x) + 0.3;
  float bed = (1. - smoothstep(${X/2+22}. - ew, ${X/2+22}. + ew, abs(xz.x) + rag)) * smoothstep(uContact - 2., uContact + 2., xz.y)
            * (1. - smoothstep(uContact + 700., uContact + 1100., xz.y + rag * 6.));
  vec3 col = mix(uTone[3] * fzSurface(xz, 1., 0.), uTone[1] * fzSurface(xz, 0., 1.), bed);
  col = fzShade(col, fzCrack(xz, 1., 0.) * (1. - bed));
  // under the printed strip the plain is only a backing (polygon offset): same tone, so no seam can show
  if (abs(xz.x) < ${X/2}. && xz.y <= uContact && xz.y > uStart) col = fzToneOf(fzDry(xz, 0.).xyz);
  gl_FragColor = vec4(fzHazed(col, vW), 1.);
}`,Ue=`
varying vec3 vW; varying vec2 vUv; varying float vPhi;
${fe}
void main(){
  float phi = position.y;
  vUv = vec2((uContact - ${he.toFixed(4)} * phi + ${ue}.) / ${U}., (position.x + ${X/2}.) / ${X}.);
  float h = fzH(textureLod(uPic, vUv, 3.)) * ${ee}.;
  float r = ${he.toFixed(4)} - h;
  vec4 wp = modelMatrix * vec4(position.x, ${he.toFixed(4)} - r * cos(phi), uContact - r * sin(phi), 1.);
  vW = wp.xyz; vPhi = phi;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,Ce=`
uniform vec3 uStone, uVein, uGold, uSunDir;
float fzN3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  float n = i.x + i.y * 57. + i.z * 113.;
  vec4 a = fract(sin(vec4(n, n + 1., n + 57., n + 58.)) * 43758.5453), b = fract(sin(vec4(n + 113., n + 114., n + 170., n + 171.)) * 43758.5453);
  vec4 m = mix(a, b, f.z); vec2 m2 = mix(m.xy, m.zw, f.y); return mix(m2.x, m2.y, f.x); }
vec3 fzGold3g(vec3 N, float g){     // g 0..1: the granule is catching the sun (its third tone spreads; eased by the caller)
  float nl = dot(N, uSunDir), f = fwidth(nl) + 0.02;
  float hi = dot(N, normalize(uSunDir + vec3(0., 0.6, 0.))), fh = fwidth(hi) + 0.01, th = 0.93 - 0.22 * g;
  vec3 c = mix(uGold * 0.56, uGold, smoothstep(0.12 - f, 0.12 + f, nl));
  return mix(c, mix(uGold, uCream, 0.5 + 0.4 * g), smoothstep(th - fh, th + fh, hi)); }
vec3 fzGold3(vec3 N){ return fzGold3g(N, 0.); }
vec3 fzLapisV(vec3 q, float lit, float veins){   // q: a point fixed in the stone (metres); lit 0..1; veins 0 | 1
  float mott = fzN3(q * 0.035) - 0.5;
  vec3 c = uStone * (1. + 0.16 * mott);
  // calcite: flat veins cutting through the block, so on the drum they run as broken arcs
  vec3 wq = q + 20. * (vec3(fzN3(q * 0.017), fzN3(q * 0.017 + 5.), fzN3(q * 0.017 + 11.)) - 0.5);
  float t1 = dot(wq, vec3(0.0085, 0.0062, 0.0071)), t2 = dot(wq, vec3(-0.0041, 0.0093, -0.0057)) + 0.37;
  float px = length(fwidth(q)) + 1e-4, vw = max(0.16, 0.45 * px);
  float d1 = abs(fract(t1) - 0.5) / max(fwidth(t1), 1e-6) * px, d2 = abs(fract(t2) - 0.5) / max(fwidth(t2), 1e-6) * px;
  float m1 = smoothstep(0.5, 0.62, fzN3(q * 0.016 + floor(t1) * 7.3)), m2 = smoothstep(0.54, 0.66, fzN3(q * 0.016 + floor(t2) * 5.1 + 30.));
  float vein = max((1. - smoothstep(vw, vw + px * 0.8, d1)) * m1, (1. - smoothstep(vw, vw + px * 0.8, d2)) * m2);
  c = mix(c, uVein, vein * 0.6 * veins);
  return mix(mix(c * 0.52, uSky * 0.4, 0.06), c, lit); }
vec3 fzLapis(vec3 q, float lit){ return fzLapisV(q, lit, 1.); }
`,We=`
varying vec3 vW; varying vec2 vUv; varying float vPhi;
${fe}
${Ce}
void main(){
  vec4 t = texture2D(uPic, vUv);
  float e = 2. / ${I}.;
  float h0 = fzH(t);
  float hz = (fzH(texture2D(uPic, vUv + vec2(e, 0.))) - h0) * ${(ee*Z/2).toFixed(1)};
  float hx = (fzH(texture2D(uPic, vUv + vec2(0., e * ${(I/oe).toFixed(4)}))) - h0) * ${(ee*Z/2).toFixed(1)};
  float cp = cos(vPhi), sp = sin(vPhi);
  vec3 N = normalize(vec3(0., -cp, -sp) + hx * vec3(1., 0., 0.) - hz * vec3(0., sp, -cp));
  float nl = dot(N, uSunDir);
  float lit = smoothstep(-0.05, 0.09, nl);
  float cw = clamp(fwidth(t.a) * 0.8, 0.006, 0.03);
  lit *= 1. - smoothstep(0.052 - cw, 0.052 + cw, t.a);      // shade cast into the hollows, hard-edged, wherever the sun reaches (the sunward walls of the shaded flank too)
  float pz = fract(vUv.x) * ${U}., psi = fract(vUv.x) * 6.2831853;
  float x = (vUv.y - 0.5) * ${X}.;
  vec3 q = vec3(x, cos(psi) * ${he.toFixed(2)}, sin(psi) * ${he.toFixed(2)});
  vec3 col = fzLapis(q, lit);
  // pyrite: thresholded cells; each catches the sun as its turn comes (a glint lasts seconds, eased)
  vec2 pc = vec2(x / 2.3, fract(vUv.x) * 220.); vec2 ci = floor(pc), cf = fract(pc) - 0.5;
  float hh = fzHash(ci + 3.7);
  vec2 off = (vec2(fzHash(ci + 11.), fzHash(ci + 23.)) - 0.5) * 0.5;
  float rad = 0.06 + 0.1 * fzHash(ci + 5.1), dd = length(cf - off), fp = fwidth(dd) + 0.01;
  float fleck = step(0.93, hh) * (1. - smoothstep(rad - fp, rad + fp, dd)) * (1. - smoothstep(0.12, 0.5, fwidth(pc.x)));
  float ang = vPhi + hh * 62.83 + uTime * 0.16;
  float gl = smoothstep(0.86, 0.985, cos(ang));
  col = mix(col, mix(uGold * (0.45 + 0.4 * lit), mix(uGold, uCream, 0.6), gl * (0.35 + 0.65 * lit)), fleck);
  // wet clay left in the hollows of the rising flank: ONE flat opaque clay tone with a cut edge. It fills a
  // hollow to the brim at the contact line, keeps only to the deep parts as the flank climbs, and slides down
  // and out (the edge creeps by a scrolling noise). Two tones by the sun, like all clay.
  float h = h0 * ${ee}.;
  float creep = fzNoise(vec2(x * 0.16, pz * 0.16 - uTime * 0.45)) - 0.5 + 0.5 * (fzNoise(vec2(x * 0.5, pz * 0.5 - uTime * 0.9)) - 0.5);
  float lvlc = mix(0.55, 5.4, smoothstep(0.12, 2.5, vPhi + creep * 0.7)) + creep * 0.8;
  float mask = h - lvlc - hz * 0.9;                       // it hangs toward the lower lip of each hollow
  float fm = fwidth(mask) * 0.7 + 0.01;
  float clay = smoothstep(-fm, fm, mask) * step(0., vPhi) * (1. - step(3.2, vPhi));
  float fc = fwidth(vPhi) + 0.002;
  clay = max(clay, 1. - smoothstep(0.045 - fc, 0.045 + fc, vPhi + creep * 0.05));        // the smear along the contact line itself
  col = mix(col, fzShade(uTone[0], 1. - smoothstep(0.4, 0.6, lit)), clay);
  // ROUND SEVEN: in the figure field (never the river band or the rope by the rim) clay has dried in every hollow, so each
  // figure rides round the drum as its own crisp silhouette in two flat tones: leather clay, and the hard shade the
  // hollow's sunward wall throws into it (the same baked sweep as on the print)
  float ff = fwidth(h) * 0.7 + 0.03, fx = fwidth(x) + 0.05;
  float figm = smoothstep(0.9 - ff, 0.9 + ff, h) * smoothstep(-110. - fx, -110. + fx, x);
  col = mix(col, fzShade(uTone[1], 1. - smoothstep(0.4, 0.6, lit)), figm);
  gl_FragColor = vec4(fzHazed(col, vW), 1.);
}`,ge=16,ve=11.5,De=`
varying vec3 vL; varying vec3 vW; varying vec3 vN;
${fe}
${Ce}
uniform float uRoll;
void main(){
  vec3 N = vN; float ln = length(N); N = ln > 1e-5 ? N / ln : vec3(0., 1., 0.);
  // the granules catch the sun in their turn, like the pyrite: each of 26 sectors of each ring spreads its palest
  // tone for a second or so every eight (eased; the sectors are fixed in the cap, so it is the same turning or at rest)
  vec2 gp = vec2(vL.y - ${he.toFixed(4)}, vL.z - uContact); float gr = length(gp), ga = atan(gp.y, gp.x + 1e-5) - uRoll;
  float gph = fzHash(vec2(floor(gr / 6.5), floor(fract(ga / 6.2831853) * 26.)) + 3.1);
  float glint = smoothstep(0.5, 1., sin(uTime * 0.8 + gph * 6.2831853)) * step(abs(vL.x), 176. + ${ge.toFixed(1)});
  #ifdef FZ_CAP
    glint = 0.;                 // the granules only: the flat of the cap keeps its tone
  #endif
  vec3 col = fzGold3g(N, glint);
  #ifdef FZ_CAP
    vec2 rp = vec2(vL.y - ${he.toFixed(4)}, vL.z - uContact); float r = length(rp), fr = fwidth(r) + 0.03;
    float lit = smoothstep(-0.05, 0.09, dot(N, uSunDir));
    if (abs(N.x) > 0.8) {
      float k = (r - 18.) / 13.; float bandC = abs(fract(k) - 0.5) * 13.;     // granule rings at r 18, 31, 44, 57, 70
      float inlay = (1. - smoothstep(3.4 - fr, 3.4 + fr, bandC)) * step(18., r) * step(r, 80.2);
      float a = atan(rp.y, rp.x + 1e-5) - uRoll;
      vec3 lap = fzLapisV(vec3(r * cos(a), r * sin(a), 7.), lit, 0.);      // round eight: no calcite in the inlay (a vein cut by five gold rings read as a scratch across the cap)
      // pyrite in the inlay: each fleck catches the sun in its turn, slowly (a glint lasts seconds)
      vec2 pc = vec2(r * cos(a), r * sin(a)) / 1.9 + 40., ci = floor(pc); float hh = fzHash(ci + 3.7);
      float pd = length(fract(pc) - 0.5 - (vec2(fzHash(ci + 11.), fzHash(ci + 23.)) - 0.5) * 0.5), fp = fwidth(pd) + 0.01;
      float fleck = step(0.9, hh) * (1. - smoothstep(0.1 + 0.1 * fzHash(ci + 5.1) - fp, 0.1 + 0.1 * fzHash(ci + 5.1) + fp, pd)) * (1. - smoothstep(0.15, 0.6, fwidth(pc.x)));
      lap = mix(lap, mix(uGold * 0.7, mix(uGold, uCream, 0.6), smoothstep(0.8, 0.98, cos(hh * 62.83 + uTime * 0.5))), fleck);
      col = mix(col, lap, inlay);
      if (N.x > 0.) {                     // far cap: its granule rings are drawn, not built
        float rk = clamp(floor(k + 0.5), 0., 4.) * 13. + 18., n = floor(6.2832 * rk / 3.3);
        vec2 g = vec2(r - rk, (fract(a / 6.2832 * n) - 0.5) * 3.3);
        float gd = length(g), fg = fwidth(r) + 0.03;
        float dot1 = 1. - smoothstep(1.45 - fg, 1.45 + fg, gd);
        float hiS = 1. - smoothstep(0.7 - fg, 0.7 + fg, length(g - vec2(0.3, 0.)));
        col = mix(col, mix(uGold * 0.56, mix(uGold, uCream, 0.5), hiS), dot1);
      }
    }
    if (r < 7.6) col = fzLapis(vec3(vL.x, rp), 0.) * (0.55 + 0.45 * smoothstep(-170., -120., -abs(vL.x)));   // inside the bore
    float dp = clamp((-172. - vL.x) / ${ge.toFixed(1)}, 0., 1.), fd = fwidth(dp) * 1.2 + 0.003;        // inside the collar: 0 at the bottom, 1 at the mouth
    if (vL.x < -172.03 && r < ${(ve+.2).toFixed(1)} && dot(N.yz, rp) < 0.) {      // the drill's wall inside the collar
      float sunl = smoothstep(-0.22, 0.22, -rp.x / max(r, 1e-3));                                       // the lower wall is in the sun, the upper in the lip's shade
      float tone = 0.5 + 0.24 * smoothstep(0.333 - fd, 0.333 + fd, dp) + 0.26 * smoothstep(0.667 - fd, 0.667 + fd, dp);   // three steps, darker toward the bottom
      col = fzLapisV(vec3(vL.x, rp), sunl, 0.) * tone;
      float dr = min(abs(dp - 0.333), abs(dp - 0.667)), wr = max(0.016, fd * 1.3);                      // a gold line where the drill stepped
      col = mix(col, uGold * (0.5 + 0.5 * sunl), (1. - smoothstep(wr - fd, wr + fd, dr)) * 0.9);
    }
  #endif
  gl_FragColor = vec4(fzHazed(col, vW), 1.);
}`,qe="varying vec3 vD; void main(){ vD = position; vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.); gl_Position = p; }",Ve=`varying vec3 vD; uniform vec3 uSky, uHaze, uSunDir, uSkyGlow, uTone[4]; uniform float uTime;
float skHash(vec2 p){ p = fract(p * vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.x); }
float skNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(skHash(i), skHash(i + vec2(1., 0.)), f.x), mix(skHash(i + vec2(0., 1.)), skHash(i + vec2(1., 1.)), f.x), f.y); }
void main(){ float l = length(vD); vec3 d = l > 1e-4 ? vD / l : vec3(0., 1., 0.);
  vec3 c = mix(uHaze, uSky, smoothstep(0.0, 0.5, d.y));
  vec2 s = uSunDir.xz; float sl = length(s); s = sl > 1e-4 ? s / sl : vec2(-1., 0.);
  float hl = length(d.xz); vec2 dh = hl > 1e-4 ? d.xz / hl : vec2(0., 1.); float side = dot(dh, s);
  float glow = smoothstep(0.1, 1., side) * (1. - smoothstep(0.02, 0.42, abs(d.y)));
  c = mix(c, uSkyGlow, glow * 0.75);
  // DUST DRAWN IN THE STYLE: flat banks of afternoon dust lying in strata over the plain, each one tone with a cut,
  // scalloped edge, drifting slowly downwind; darker and denser toward the ground
  float az = atan(dh.x, dh.y), el = d.y / max(hl, 0.05), fe = fwidth(el) * 1.2 + 1e-4;       // the seam of az lies astern (-Z), where no view looks
  vec3 dustA = mix(uHaze, uTone[1], 0.5), dustB = mix(uHaze, uTone[1], 0.26);
  for (int i = 0; i < 3; i++) {
    float fi = float(i), e0 = 0.05 + 0.075 * fi, th = 0.022 - 0.004 * fi;
    float q = az * (5. + 2. * fi) + uTime * (0.045 + 0.015 * fi) + fi * 3.7;
    float n = skNoise(vec2(q, fi * 7.3)) * 0.65 + skNoise(vec2(q * 2.7 + 5., fi * 3.1)) * 0.35;
    float w = th * (0.2 + 1.6 * n) * smoothstep(0.28, 0.5, skNoise(vec2(q * 0.31 + 9., fi)) + 0.25 * n);
    float dd = abs(el - e0 - 0.012 * sin(q * 0.7)) - w;
    c = mix(c, i == 0 ? dustA : dustB, (1. - smoothstep(-fe, fe, dd)) * (0.9 - 0.2 * fi));
  }
  // the low sun: a pale flat disc and one cut ring, the sun disc of the frieze itself
  float sd = acos(clamp(dot(d, normalize(uSunDir)), -1., 1.)), fs = fwidth(sd) + 1e-4;
  float disc = 1. - smoothstep(0.036 - fs, 0.036 + fs, sd), ring = (1. - smoothstep(0.004 - fs, 0.004 + fs, abs(sd - 0.062)));
  c = mix(c, mix(uSkyGlow, vec3(1.), 0.5), max(disc, 0.8 * ring));
  gl_FragColor = vec4(c, 1.); }`,Ze=`varying vec2 vUv; varying vec3 vW;
void main(){ vUv = uv; vec4 p = vec4(position, 1.);
  #ifdef USE_INSTANCING
    p = instanceMatrix * p;
  #endif
  vec4 wp = modelMatrix * p; vW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }`,je=`varying vec2 vUv; varying vec3 vW; uniform float uOpacity;
${fe}
void main(){ float a = sin(clamp(vUv.y, 0., 1.) * 3.14159) * smoothstep(0., 0.12, vUv.x) * (1. - vUv.x);
  a *= 0.55 + 0.45 * fzNoise(vec2(vUv.x * 9. - uTime * 0.35, vUv.y * 3. + vW.x * 0.01));
  gl_FragColor = vec4(uHaze, clamp(a * uOpacity, 0., 1.)); }`;function Ye(L,u={}){const v=(u.palette&&u.palette.length>=7?u.palette:Ee).slice(),g=L.rng.fork("frieze-style"),z=u.stone||(g()<.76?"lapis":g.pick(["carnelian","serpentine"])),b=Ie[z],x=M=>new h.Color(M),c={wet:x(v[0]),leather:x(v[1]),bone:x(v[2]),chalk:x(v[3]),stone:x(b?b[0]:v[4]),gold:x(b?b[2]:v[5]),sky:x(v[6]),cream:x(u.cream||"#EDE4CF"),haze:x(u.haze||u.cream||"#EDE4CF"),glow:x(u.glow||"#F8F2E2"),vein:x(b?b[1]:"#E9EEF0"),stoneName:z};c.shadeOf=M=>{const k=new h.Color,y=(H,$)=>Math.pow(.39*Math.pow(Math.max(H,0),.4545)+.08*Math.pow(Math.max($,0),.4545),2.2);return k.setRGB(y(M.r,c.sky.r),y(M.g,c.sky.g),y(M.b,c.sky.b))},u.night&&(b&&(c.stone.multiplyScalar(.55),c.gold.multiplyScalar(.68)),c.vein.multiplyScalar(.62));const T=(u.sunElevation??12)*Math.PI/180,F=new h.Vector3(-Math.cos(T),Math.sin(T),0),l=new h.DataTexture(null,I,oe,h.RGBAFormat,h.UnsignedByteType);l.wrapS=h.RepeatWrapping,l.wrapT=h.ClampToEdgeWrapping,l.magFilter=h.LinearFilter,l.minFilter=h.LinearMipmapLinearFilter,l.generateMipmaps=!0,l.anisotropy=8;const o=u.ghost?new h.DataTexture(null,I,oe,h.RedFormat,h.UnsignedByteType):null;o&&(o.wrapS=h.RepeatWrapping,o.wrapT=h.ClampToEdgeWrapping,o.magFilter=h.LinearFilter,o.minFilter=h.LinearMipmapLinearFilter,o.generateMipmaps=!0,o.anisotropy=8);const s={uTime:{value:0},uContact:{value:-60},uFronts:{value:new h.Vector3(-230,-390,-680)},uOrigin:{value:new h.Vector3},uCamPos:{value:new h.Vector3(0,30,-700)},uTone:{value:[c.wet,c.leather,c.bone,c.chalk]},uSky:{value:c.sky},uCream:{value:c.cream},uHaze:{value:c.haze},uSunTan:{value:Math.tan(T)},uSunDir:{value:F},uPic:{value:l},uPic2:{value:o},uTileZ:{value:-563},uStart:{value:-563},uRoll:{value:0},uWind:{value:u.weather==="breeze"?2:1},uRain:{value:u.weather==="rain"?1:0},uSkyGlow:{value:c.glow},uPixel:{value:.0024},uStrLive:{value:1},uInlay:{value:Array.from({length:16},()=>new h.Vector4(0,0,0,0))},uGhost:{value:new h.Vector4(-5,-7.5,u.ghost?1:0,-560)},uStone:{value:c.stone},uVein:{value:c.vein},uGold:{value:c.gold}},n=M=>Object.assign({},s,M||{}),f=(M,k,y={})=>new h.ShaderMaterial(Object.assign({uniforms:n(y.extra),vertexShader:M,fragmentShader:k},y.props||{})),w={clay:f(Te,Ae,{extra:{uHole:{value:new h.Vector4},uHoleM:{value:4},uCellF:{value:0}},props:{defines:u.ghost?{FZ_GHOST:1}:{},polygonOffset:!0,polygonOffsetFactor:0,polygonOffsetUnits:2}}),clayFree:f(Se,Ne,{extra:{uDryBias:{value:0}},props:{side:h.DoubleSide}}),plain:f(Oe,Be,{props:{polygonOffset:!0,polygonOffsetFactor:1,polygonOffsetUnits:6}}),stone:f(Ue,We),gold:f(Se,De),goldCap:f(Se,De,{props:{defines:{FZ_CAP:1}}}),sky:f(qe,Ve,{props:{side:h.BackSide,depthWrite:!1,depthTest:!1}}),dust:f(Ze,je,{extra:{uOpacity:{value:.5}},props:{transparent:!0,depthWrite:!1,side:h.DoubleSide}})};w.clayFreeBiased=M=>{const k=w.clayFree.clone();return k.uniforms=n({uDryBias:{value:M}}),k};const m={cast:u.creature===void 0?null:u.creature<.5?"ibex":u.creature<.75?"oryx":"stag",palette:c,uniforms:s,materials:w,sunDir:F,glsl:{common:fe,surface:Fe,stone:Ce},data:null,height:null,pic:l,pic2:o,figures:null,repeats:1,contactZ:-60,rollAngle:0,progress:null};m.sealZ=M=>{const k=42*M;if(k<=27)return-300+10*k;const y=xe((k-27)/9,0,1);return-30+30*(1-(1-y)*(1-y)*(1-y))};const G=U/201;m.setProgress=(M,k=!1)=>{m.progress=M,k||(m.driven=!0);const y=m.sealZ(M),H=-300+420*M;m.contactZ=y,m.rollAngle=(y+300)/he,s.uContact.value=y,s.uRoll.value=m.rollAngle;const $=H-190<-205?H-190:-205+.15*(H-190+205),R=Pe(.7,.86,M);s.uFronts.value.set(Math.min($,y-12),Math.min(H-660+140*R,y-24),Math.min(H-840+200*R,y-36));const _=Math.ceil(y/G)*G-U;s.uTileZ.value=_,s.uStart.value=_-(m.repeats-1)*U};const N=new h.Vector3;let S=null;const p=[],C=new h.Vector2;m.update=(M,k,y,H)=>{if(s.uTime.value=k,y&&L.renderer&&(s.uPixel.value=2/Math.max(1,y.projectionMatrix.elements[5]*L.renderer.getDrawingBufferSize(C).y)),y&&(s.uCamPos.value.setFromMatrixPosition(y.matrixWorld),S&&(S.position.copy(s.uCamPos.value),S.parent&&S.parent.worldToLocal(S.position))),H&&(H.updateWorldMatrix(!0,!1),s.uOrigin.value.setFromMatrixPosition(H.matrixWorld)),y)for(const $ of p){const R=y.matrixWorld.elements,_=$.u.value.z*2,O=Math.hypot(R[8],R[10])||1,A=s.uCamPos.value.x-s.uOrigin.value.x-R[8]/O*$.ahead,a=s.uCamPos.value.z-s.uOrigin.value.z-R[10]/O*$.ahead;$.u.value.x=Math.round(A/_)*_,$.u.value.y=Math.round(a/_)*_}},m.makeSky=(M=2600)=>(S=new h.Mesh(new h.SphereGeometry(M,24,12),w.sky),S.renderOrder=-.5,S.frustumCulled=!1,S),m.makeNearPatches=(M=2,k=144,y=.7)=>{const H=new h.BufferGeometry,$=k+1,R=new Float32Array($*$*3),_=new Uint32Array(k*k*6);for(let a=0,e=0;a<$;a++)for(let t=0;t<$;t++)R[e++]=t-k/2,R[e++]=0,R[e++]=a-k/2;for(let a=0,e=0;a<k;a++)for(let t=0;t<k;t++){const i=a*$+t,d=i+1,r=i+$,P=r+1;_[e++]=i,_[e++]=r,_[e++]=d,_[e++]=d,_[e++]=r,_[e++]=P}H.setAttribute("position",new h.BufferAttribute(R,3)),H.setIndex(new h.BufferAttribute(_,1));const O=[];let A=null;for(let a=0;a<M;a++){const e=y*(1<<a),t=k*e/2,i={value:new h.Vector4(0,-1e5,e,t)},d=f(Te,Ae,{extra:{uPatch:i,uHole:{value:A?A.value:new h.Vector4},uHoleM:{value:e*2},uCellF:{value:(Math.max(.85*e,1.3)+e-.1)/1.35}},props:{defines:u.ghost?{FZ_PATCH:1,FZ_GHOST:1}:{FZ_PATCH:1},polygonOffset:a>0,polygonOffsetFactor:0,polygonOffsetUnits:a}}),r=new h.Mesh(H,d);r.frustumCulled=!1,O.push(r),p.push({u:i,ahead:t*.62}),A=i}return w.clay.uniforms.uHole.value=A.value,O},m.makePlates=(M,k,y,H,$,R=g,_=0,O=1,A=!1)=>{const a=new h.InstancedBufferGeometry,e=new h.PlaneGeometry(1,1,2,2);e.rotateX(-Math.PI/2);const t=e.attributes.position;for(let r=0;r<t.count;r++)(Math.abs(t.getX(r))>.4||Math.abs(t.getZ(r))>.4)&&t.setXYZ(r,t.getX(r)*(.75+R()*.5),0,t.getZ(r)*(.75+R()*.5));a.setAttribute("position",t),a.setIndex(e.index);const i=new Float32Array(M*4);for(let r=0;r<M;r++)i[r*4]=ze(k,y,R()),i[r*4+1]=ze(H,$,R()),i[r*4+2]=2.2+R()*R()*5,i[r*4+3]=R();a.setAttribute("aPlate",new h.InstancedBufferAttribute(i,4)),a.instanceCount=M;const d=new h.Mesh(a,f(Ge,Ne,{extra:{uDryBias:{value:_?-4e3:0},uPlateAll:{value:_},uLoft:{value:O},uPlateRate:{value:A?2.2:1}},props:{side:h.DoubleSide,defines:A?{FZ_PLATE_BIG:1}:{}}}));return d.frustumCulled=!1,d},m.makePlateShade=(M,k=!1)=>{const y=M.material.uniforms,H=new h.Mesh(M.geometry,f(Ge,Re,{extra:{uPlateAll:y.uPlateAll,uLoft:y.uLoft,uPlateRate:y.uPlateRate},props:{side:h.DoubleSide,defines:Object.assign({},M.material.defines,k?{FZ_PLATE_BED:1}:{FZ_PLATE_SHADE:1}),polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:k?-1:-2}}));return H.frustumCulled=!1,H},m.friezeGeometry=(M=1,k=136,y=201)=>{m.repeats=M;const H=new h.InstancedBufferGeometry,$=k+1,R=y+1,_=new Float32Array($*R*3),O=new Uint32Array(k*y*6);for(let A=0,a=0;A<R;A++)for(let e=0;e<$;e++){const t=e/k;_[a++]=t<.37?-170+t/.37*70:t<.66?-100+(t-.37)/.29*100:(t-.66)/.34*170,_[a++]=0,_[a++]=A/y*U}for(let A=0,a=0;A<y;A++)for(let e=0;e<k;e++){const t=A*$+e,i=t+1,d=t+$,r=d+1;O[a++]=t,O[a++]=d,O[a++]=i,O[a++]=i,O[a++]=d,O[a++]=r}return H.setAttribute("position",new h.BufferAttribute(_,3)),H.setIndex(new h.BufferAttribute(O,1)),H.setAttribute("aTile",new h.InstancedBufferAttribute(Float32Array.from({length:M},(A,a)=>a),1)),H.instanceCount=M,m.setProgress(m.progress??.6,!0),H},m.sealGeometry=(M=136,k=176)=>{const y=new h.BufferGeometry,H=M+1,$=k+1,R=new Float32Array(H*$*3),_=new Uint32Array(M*k*6);for(let O=0,A=0;O<$;O++)for(let a=0;a<H;a++)R[A++]=-X/2+a/M*X,R[A++]=O/k*Math.PI*2,R[A++]=0;for(let O=0,A=0;O<k;O++)for(let a=0;a<M;a++){const e=O*H+a,t=e+1,i=e+H,d=i+1;_[A++]=e,_[A++]=i,_[A++]=t,_[A++]=t,_[A++]=i,_[A++]=d}return y.setAttribute("position",new h.BufferAttribute(R,3)),y.setIndex(new h.BufferAttribute(_,1)),y},m.heightAt=(M,k)=>{const y=(Math.round((k+ue)*Z)%I+I)%I,H=xe(Math.round((M+X/2)*Z),0,oe-1);return m.height?m.height[H*I+y]/255*ee:0};let W=null;return m.picture=()=>W||(W=Je(L,m,g.fork("picture"))),m.setProgress(.6,!0),m}async function Je(L,u,v){await L.yield();const g=u.height=new Float32Array(I*oe);await L.yield(),u.data=u.pic.image.data=new Uint8Array(I*oe*4),await L.yield();const z=a=>{const e=new Float32Array(258);for(let t=0;t<258;t++)e[t]=a(Math.min(1,Math.sqrt(t/256)));return e},b=z(a=>Math.sqrt(1-a*a)*(1-.13*Math.exp(-((a-.62)**2)/.004))),x=z(a=>Math.min(1,(1-a)/.42)),c=z(a=>Math.pow(Math.cos(a*Math.PI/2),.8)),T=[],F=async()=>{for(let a=0;a<T.length;a++)T[a](),a%3===2&&await L.yield();T.length=0,await L.yield()},l=(a,e,t,i,d)=>{const r=e*Z,P=(t+X/2)*Z,D=i*Z,V=D*D,B=256/V,J=d*255,le=Math.max(0,Math.ceil(P-D)),de=Math.min(oe-1,Math.floor(P+D));for(let Q=le;Q<=de;Q++){const ie=Q-P,re=ie*ie,j=Math.sqrt(Math.max(0,V-re)),K=Q*I;for(let q=Math.ceil(r-j),ae=Math.floor(r+j);q<=ae;q++){const Y=q-r,te=J*a[(Y*Y+re)*B|0],se=K+(q<0?q+I:q>=I?q-I:q);te>g[se]&&(g[se]=te)}}},o=(a,e,t=1)=>{const i=a[0],d=a[1];T.push(()=>l(b,i,d,e,t))},s=(a,e,t,i=t,d=.8,r=d)=>{const P=[a[0],a[1]],D=[e[0],e[1]];T.push(()=>n(P,D,t,i,d,r))},n=(a,e,t,i,d,r)=>{const P=a[0]*Z,D=(a[1]+X/2)*Z,V=e[0]*Z,B=(e[1]+X/2)*Z,J=V-P,le=B-D,de=Math.max(J*J+le*le,1e-6),Q=t/2*Z,ie=i/2*Z,re=Math.max(Q,ie),j=Math.max(0,Math.ceil(Math.min(D,B)-re)),K=Math.min(oe-1,Math.floor(Math.max(D,B)+re)),q=Math.ceil(Math.min(P,V)-re),ae=Math.floor(Math.max(P,V)+re);for(let Y=j;Y<=K;Y++){const te=Y-D,se=Y*I;for(let ne=q;ne<=ae;ne++){const pe=ne-P;let ce=(pe*J+te*le)/de;ce=ce<0?0:ce>1?1:ce;const Me=pe-ce*J,be=te-ce*le,we=Q+(ie-Q)*ce,ye=(Me*Me+be*be)/(we*we);if(ye>=1)continue;const ke=(d+(r-d)*ce)*255*x[ye*256|0],me=se+(ne<0?ne+I:ne>=I?ne-I:ne);ke>g[me]&&(g[me]=ke)}}},f=(a,e,t,i=.8,d=i)=>{const r=D=>a[xe(D,0,a.length-1)],P=a.length-1;for(let D=0;D<P;D++){const V=r(D-1),B=r(D),J=r(D+1),le=r(D+2),de=Math.hypot(J[0]-B[0],J[1]-B[1]),Q=Math.max(2,Math.ceil(de*Z/Math.max(.25,Math.min(e,t)*Z*.024))),ie=(j,K,q,ae)=>.5*(2*B[j]+(J[j]-V[j])*K+(2*V[j]-5*B[j]+4*J[j]-le[j])*q+(3*B[j]-V[j]-3*J[j]+le[j])*ae),re=Q+(D===P-1?1:0);for(let j=0;j<re;j+=48)T.push(()=>{for(let K=j;K<Math.min(re,j+48);K++){const q=K/Q,ae=q*q,Y=ae*q,te=(D+q)/P;l(x,ie(0,q,ae,Y),ie(1,q,ae,Y),ze(e,t,te)/2,ze(i,d,te))}})}},w=(a,e,t,i,d)=>{const r=[a[0],a[1]];T.push(()=>E(r,e,t,i,d))},E=(a,e,t,i,d)=>{const r=a[0]*Z,P=(a[1]+X/2)*Z,D=e*Z,V=t*Z,B=Math.max(D,V),J=Math.cos(i),le=Math.sin(i),de=d*255;for(let Q=Math.max(0,Math.ceil(P-B)),ie=Math.min(oe-1,Math.floor(P+B));Q<=ie;Q++){const re=Q-P,j=Q*I;for(let K=Math.ceil(r-B),q=Math.floor(r+B);K<=q;K++){const ae=K-r,Y=(ae*J+re*le)/D,te=(re*J-ae*le)/V,se=Y*Y+te*te;if(se>=1)continue;const ne=de*c[se*256|0],pe=j+(K<0?K+I:K>=I?K-I:K);ne>g[pe]&&(g[pe]=ne)}}},m=(a,e=1,t=1,i=-113)=>{const d=(r,P)=>[a+e*r*t,i+P*t];return d.s=t,d.dir=e,d.rot=r=>Math.atan2(Math.sin(r),e*Math.cos(r)),d},G=a=>(v()-.5)*2*a,N={ball:o,wheel:s,sweep:f,graver:w,frame:m,J:G,rng:v,disc:(a,e,t,i,d)=>{T.push(()=>l(a,e,t,i,d))},LW:x},S={pitch:U,seam0:ue};for(const a of[-1,1])for(let e=0;e<21;e+=3)Ke(N,S,a,e,e+3),await F();const p=Qe(N,S);for(let a=0;a<6;a++)p(a),await F();const C=u.cast;(C==="stag"?et:Xe)(N,S,60+G(4)),await F();const W=236+G(3),M=99+G(2),k=v()<.72?0:1,y=C==="stag"?2:C==="oryx"?1:C==="ibex"?0:k;_e(N,S,W-M,1,!0,y),await F(),tt(N,S,W),await F(),_e(N,S,W+M,-1,!1,y),await F();const H=430+G(4);at(N,S,H,C==="stag"||C==="oryx"),await F(),ot(N,S,H+27),await F();for(let a=0;a<6;a++)st(N,S,a),await F();nt(N,S),await F();const $=u.data;for(let a=0;a<14;a++){const e=Math.max(0,(a-2)/11);for(const t of[a*I,(oe-1-a)*I])for(let i=0;i<I;i++)g[t+i]*=e}await L.yield();const R=u.uniforms.uSunTan.value*(255/ee)/Z,_=R*.7,O=new Float32Array(I),A=new Float32Array(I).fill(-1e3);for(let a=0;a<oe;a++){for(let e=0,t=a*I,i=t*4;e<I;e++,i+=4){const d=g[t+e];let r=O[e]-_;r<d&&(r=d),O[e]=r;const P=d+.5|0,D=(r-d)*1.25;let V=A[e]-R;V<-d&&(V=-d),A[e]=V;const B=(V+d)*1.25;$[i]=P,$[i+1]=D>255?255:D,$[i+2]=(d-P+.5)*255,$[i+3]=B>255?255:B}a%24===23&&await L.yield()}if(u.pic.needsUpdate=!0,u.pic2){await L.yield();const a=u.pic2.image.data=new Uint8Array(I*oe);O.fill(0);for(let e=0;e<oe;e++){for(let t=0,i=e*I;t<I;t++){const d=g[i+t]*.5;let r=O[t]-_;r<d&&(r=d),O[t]=r;const P=(r-d)*2.5;a[i+t]=P>255?255:P}e%24===23&&await L.yield()}u.pic2.needsUpdate=!0}{const a=u.uniforms.uInlay.value;let e=0;const t=(i,d,r)=>{i&&e<a.length&&a[e++].set(i[0],i[1],d,r)};t(S.sun&&S.sun.at,11.4,1);for(const i of S.ibex||[])t(i.head,2.5,2);t(S.bull&&S.bull.eye,2.2,2);for(const i of S.file||[])t([i.at[0]+32.49,i.at[1]+24.48],2,2);for(const i of S.fillers||[])(i.kind==="star"||i.kind==="rosette")&&t(i.at,i.kind==="star"?3.7:5.5,1);for(const i of S.mountain&&S.mountain.tips||[])t(i,2.6,1)}return S.toCourse=(a,e=0)=>a-ue-e*U,u.figures=S,u.pic}function Ke(L,u,v,g=0,z=21){const{wheel:b,sweep:x,J:c}=L,T=(U+1.5)/21,F=(o,s,n)=>o+(s-o)*n;{const o=v*166.2,s=v*160.2;for(let n=g;n<z;n++){const f=3+n*T+c(.5),w=6.3+c(.4),E=150;for(let m=0;m<=E;m++){const G=m/E,N=Math.sin(Math.PI*G),S=(o+s)/2+(o-s)*.73*Math.cos(Math.PI*G);L.disc(L.LW,f+G*26,S,(2.7+(w+.7-2.7)*N)/2,.78*(.5+.5*Math.sqrt(N)))}}z===21&&b([0,v*156.3],[U,v*156.3],1.3,1.3,.3)}if(v>0||z<21)return;const l=[];for(let o=0;o<=12;o++)l.push([.4+c(.5),-154+o*25.6]);x(l,1.5,1.5,.16,.16),u.rope={pitch:T,width:12}}function Qe(L,u){const{ball:v,wheel:g,sweep:z,graver:b,J:x,rng:c}=L,T=5,F=-151.5,l=8.4,o=6,s=[],n=[];for(let m=0;m<T;m++)s.push(c()*6.283),n.push(1.6+c()*1.1);const f=(m,G)=>F+m*l+n[m]*Math.sin(G/U*6.2832*o+s[m])+.7*Math.sin(G/U*6.2832*17+s[m]*3),w=[];for(let m=0;m<T;m++)w.push(.34+c()*.1);u.fish=[];const E=()=>{const G=U/7;for(let N=0;N<7;N++){const S=(N*2+1)%(T-1),p=26+N*G+x(7),C=(f(S,p)+f(S+1,p))/2,W=18;b([p,C],W*.42,2.5,0,.62),v([p+W*.27,C+.55],.75,.95),g([p-W*.36,C],[p-W*.5,C+2.3],1.5,.7,.6,.45),g([p-W*.36,C],[p-W*.5,C-2.3],1.5,.7,.6,.45),g([p+W*.02,C+2],[p-W*.1,C+3.3],1.1,.6,.5,.4),u.fish.push([p,C])}};return u.river={x0:-158,x1:-113},m=>{if(m>=T)return E();const G=w[m],N=[];for(let S=0;S<=U+.01;S+=U/96)N.push([S,f(m,S)]);z(N,2.6,2.6,G,G)}}function Xe(L,u,v){const{ball:g,wheel:z,sweep:b,frame:x,J:c,rng:T}=L,F=x(v,1,1),l=c(3),o=97+c(3);g(F(0,3),8.5,.8),g(F(-9,2.5),4,.7),g(F(9,2.5),4,.7),z(F(0,4),F(l,o),12.5,7.5,.72,.8);for(let n=12,f=0;n<o-6;n+=7.2,f++){const w=n/o,E=f%2?1:-1;g(F(l*w+E*(2.3-w*.8),n),1.9-w*.5,1)}const s=[l,o+1];g(F(s[0],s[1]),6.2,1);for(let n=0;n<9;n++){const f=(n-4)/4*1.42+c(.04),w=52-Math.abs(n-4)*2.2+c(2),E=Math.sign(f)*(.25+Math.abs(f)*.3),m=[];for(let G=0;G<=4;G++){const N=G/4,S=f+E*N*N,p=w*N;m.push(F(s[0]+Math.sin(S)*p,s[1]+Math.cos(S)*p*1))}b(m,5.4,1.3,.95,.6)}u.dates=[];for(const n of[-1,1]){const f=[s[0]+n*(15+c(1.5)),s[1]-15+c(1.5)];z(F(s[0]+n*3,s[1]-3),F(f[0],f[1]+6),2.2,1.4,.7,.6);for(let w=0,E=1;w<5;w++){E=[2,3,3,2,1][w];for(let m=0;m<E;m++)g(F(f[0]+(m-(E-1)/2)*2.6,f[1]+5-w*2.3),1.3,1)}u.dates.push(F(f[0],f[1]))}u.palm={z:v,root:F(0,0),crown:F(s[0],s[1])}}function et(L,u,v){const{ball:g,wheel:z,frame:b,J:x}=L,c=b(v,1,1);g(c(0,3),8,.8),g(c(-8,2.5),4,.7),g(c(8,2.5),4,.7);const T=[];for(let F=0;F<7;F++){const l=(F-3)/3*.44+x(.03),o=142-Math.abs(F-3)*9+x(4),s=[Math.sin(l)*o,4+Math.cos(l)*o];z(c(Math.sin(l)*4,5),c(s[0],s[1]),5.6,2.4,.9,.72);for(let n=0;n<4;n++)g(c(Math.sin(l)*(o-2-n*4.4),4+Math.cos(l)*(o-2-n*4.4)),3.3-n*.3,1);for(const[n,f]of[[.34,1],[.58,-1]]){const w=[Math.sin(l)*o*n,4+Math.cos(l)*o*n],E=l+f*.5;z(c(w[0],w[1]),c(w[0]+Math.sin(E)*19,w[1]+Math.cos(E)*19),3.4,1.1,.8,.55)}T.push(c(s[0],s[1]))}u.dates=[T[1],T[5]],u.palm={z:v,root:c(0,0),crown:T[3]}}function _e(L,u,v,g,z,b){const{ball:x,wheel:c,sweep:T,graver:F,frame:l,J:o}=L,s=l(v,g,1),n=C=>s(C[0],C[1]),f=[3+o(1),29+o(1)],w=[31+o(1),77+o(1)],E=Math.atan2(w[1]-f[1],w[0]-f[0]);F(s((f[0]+w[0])/2+1.5,(f[1]+w[1])/2-1),35,13,s.rot(E),.64),x(n(f),10.5,.84),x(n(w),9.5,.84);const m=[[-7+o(1),15],[9+o(1),14.5]],G=[[-2,2.4],[15,2.4]];for(let C=0;C<2;C++)c(n(f),n(m[C]),6.4,4.2,.8),c(n(m[C]),n(G[C]),3.8,3,.8),x(n(m[C]),3.3,1),x(n(G[C]),3.2,1);const N=[z?[49+o(1),52+o(1)]:[49+o(1),69+o(1)],[50+o(1),87+o(1)]],S=[[61,58],[69,80.5]];for(let C=0;C<2;C++){c(n(w),n(N[C]),5.6,3.8,.8);let W=N[C];if(z&&C===0){const M=W[0]-S[C][0],k=W[1]-S[C][1],y=Math.hypot(M,k);W=[W[0]+M/y*16,W[1]+k/y*16],u.slip=n(N[C]),u.slipTip=n(W),c(n(N[C]),n(W),3.4,.9,.8,.66)}c(n(S[C]),n(N[C]),3,3.4,.8),x(n(N[C]),4.3,1),x(n(S[C]),3.1,1)}const p=[38+o(1),100+o(.8)];if(c(s(w[0]+1,w[1]+4),n(p),10,6.6,.78),x(n(p),6.4,.94),c(s(p[0]+3,p[1]-1),s(p[0]+13,p[1]-5.5),5.2,3.3,.86),x(s(p[0]+13.6,p[1]-5.8),2.2,1),c(s(p[0]-4,p[1]+2.5),s(p[0]-11.5,p[1]-.5),2.8,1.2,.72),c(s(p[0]+8,p[1]-6.5),s(p[0]+6.5,p[1]-14),2.3,1,.7),b===0){const C=1+o(.08),W=[[p[0]-1,p[1]+5],[p[0]-7*C,p[1]+16],[p[0]-21*C,p[1]+19.6],[p[0]-36*C,p[1]+11],[p[0]-44*C,p[1]-3]];T(W.map(n),5.6,1.7,.96,.7);for(let M=1;M<8;M++){const k=M/8.5,y=.25+k*2.4,H=21.5;x(s(p[0]-21*C+Math.cos(y+.35)*-H*C*-1*1,p[1]-2+Math.sin(y+.35)*H*1.03),1.9-k*.7,1)}}else if(b===2){const C=[[p[0]-1,p[1]+5],[p[0]-9,p[1]+17],[p[0]-23,p[1]+25],[p[0]-39,p[1]+27]];T(C.map(n),5,2,.96,.75);const W=[[-3,9,9,12],[-10,18,5,14],[-18,22.5,3,13],[-27,26,0,12],[-36,27,-5,9]];for(const[M,k,y,H]of W){const $=s(p[0]+M+y+o(.8),p[1]+k+H+o(.8));c(s(p[0]+M,p[1]+k),$,3.2,1.3,.9,.7),x($,1.5,1)}}else c(s(p[0]-1,p[1]+5),s(p[0]-30,p[1]+20),4.4,1.4,.95,.7),c(s(p[0]-3,p[1]+3.5),s(p[0]-33,p[1]+13),3.6,1.2,.85,.6);c(s(f[0]-8,f[1]+6),s(f[0]-14.5,f[1]+13),3.2,1.4,.76),(u.ibex||(u.ibex=[])).push({z:v,dir:g,hooves:n(G[0]),head:n(p)})}function tt(L,u,v){const{ball:g,wheel:z,frame:b,J:x}=L,c=b(v,1,1),T=10,F=11.6;for(let s=0;s<T;s++){const n=9+s*F,f=47*Math.pow(1-s/(T-.4),.82),w=Math.max(1,Math.round(2*f/14.6)+1);for(let E=0;E<w;E++)g(c(w===1?0:(E/(w-1)-.5)*2*f+x(.5),n+x(.4)),8,1)}const l=9+(T-1)*F+7;z(c(0,l),c(0,l+10),3.4,2.6,.85);const o=[];for(const s of[-1,0,1]){const n=c(s*(6.5+x(.6)),l+17+(s===0?2:0));z(c(0,l+9),n,2.4,1.4,.8,.7),g(n,2.1,1),o.push(n)}u.mountain={z:v,peak:c(0,l+19),tips:o}}function at(L,u,v,g=!1){const{ball:z,wheel:b,sweep:x,graver:c,frame:T,J:F}=L,l=T(v-6,1,.9),o=f=>l(f[0],f[1]);c(l(-2,35),33,14.5,l.rot(.05),.66),g||z(l(17,50),10.5,.86),z(l(-25,37),10,.82),z(l(21,32),9.5,.82);const s=[[[22,27],[31+F(1),14.5],[35,2.6]],[[19,27],[14+F(1),14],[9,2.6]],[[-23,28],[-15+F(1),14],[-11,2.6]],[[-26,28],[-33+F(1),14.5],[-39,2.6]]];for(const[f,w,E]of s)b(o(f),o(w),6.2,4.2,.8),b(o(w),o(E),3.8,3.1,.8),z(o(w),3.3,1),z(o(E),3.4,1);b(l(27,42),l(40,41),12,9,.76);const n=[43,40];if(z(o(n),7.4,.9),b(l(46,37),l(53,30.5),6.2,4.4,.84),z(l(53.8,29.6),2.6,1),z(l(n[0]+3.4,n[1]+3.6),1.7,1),g){for(let f=0;f<9;f++){const w=.5+f/8*3.5;z(l(36+Math.cos(w)*11.5,41.5+Math.sin(w)*11.5),3.3,.98)}for(let f=0;f<5;f++){const w=1+f/4*2.4;z(l(31+Math.cos(w)*17,41+Math.sin(w)*15),2.6,.92)}z(l(39.5,46.5),2.1,1),x([l(-34,42),l(-45,47),l(-53,58),l(-49,69),l(-41,71)],2.8,1.8,.82,.74),z(l(-39,70.5),3,1)}else x([l(40,46),l(42,55),l(50,60),l(58,57)],3.6,1.3,.95,.75),b(l(38,44),l(31,47.5),2.8,1.3,.72),x([l(-34,42),l(-41,36),l(-43,24),l(-42,13)],2.6,1.6,.8,.7),z(l(-42,10.5),2.7,1);u.bull={z:v,eye:l(n[0]+3.4,n[1]+3.6)}}function ot(L,u,v){const{ball:g,wheel:z}=L,b=[v,2];g(b,12.5,1);for(let x=0;x<12;x++){const c=x/12*6.2832;g([b[0]+Math.cos(c)*18.5,b[1]+Math.sin(c)*18.5],2.8,.95)}for(let x=0;x<8;x++){const c=(x+.5)/8*6.2832;z([b[0]+Math.cos(c)*23.5,b[1]+Math.sin(c)*23.5],[b[0]+Math.cos(c)*35.5,b[1]+Math.sin(c)*35.5],5.4,1.6,.92,.6)}u.sun={at:b}}function st(L,u,v){const{ball:g,wheel:z,sweep:b,graver:x,frame:c,J:T,rng:F}=L;u.fileShift===void 0&&(u.fileShift=Math.floor(F()*3),u.file=[]);const l=44+v*U/6+T(1.5),o=c(l,1,.9,44),s=m=>o(m[0],m[1]),n=(v+u.fileShift)%3,f=T(2.2);x(o(-1,45),29,12.5,o.rot(.04),.7),g(o(-20,46),9.6,.84),g(o(18,47),9.8,.84);const w=[[[19,40],[25+f,22.5],[21+f*1.6,3.4]],[[15,40],[9-f,21.5],[12-f*1.5,3.4]],[[-18,40],[-11+f,22],[-15+f*1.6,3.4]],[[-22,40],[-29-f,22.5],[-25-f*1.5,3.4]]];for(const[m,G,N]of w)z(s(m),s(G),5.8,4.2,.8),z(s(G),s(N),3.8,3.1,.8),g(s(G),3.2,1),g(s(N),3.4,1);z(o(22,52),o(32,67),10,6.6,.78);const E=[34.5,70];if(g(s(E),6.4,.92),z(o(38,69),o(45.5,63.5),5.4,3.4,.84),g(o(46.3,62.9),2.3,1),g(o(E[0]+1.6,E[1]+2.2),1.5,1),z(o(31.5,74),o(25.5,78.5),2.8,1.3,.74),b([o(-28,50),o(-34.5,47),o(-36.5,39)],2.6,1.5,.8,.68),n===0)b([o(35,75.5),o(32,87),o(23,93),o(13,90),o(8,82)],3.4,1.3,.92,.7);else if(n===1)z(o(35.5,75.5),o(39.5,95),3,1.2,.9,.65),z(o(33,75.5),o(29,94),3,1.2,.9,.65);else{const m=[];for(let G=0;G<=8;G++){const N=1.9-G/8*4.6,S=9.5-G*.55;m.push(o(27.5+Math.cos(N)*S,76+Math.sin(N)*S))}b(m,3.6,1.6,.92,.74),g(o(27.5,76),2.4,1)}u.file.push({at:o(0,45),kind:n})}function nt(L,u){const{ball:v,wheel:g,sweep:z,J:b,rng:x}=L,c={star:(l,o)=>{v([l,o],4.2,1);for(let s=0;s<8;s++){const n=s/8*6.2832+.2,f=s%2?11:17;g([l+Math.cos(n)*3,o+Math.sin(n)*3],[l+Math.cos(n)*f,o+Math.sin(n)*f],4,1.3,.9,.6)}},rosette:(l,o)=>{v([l,o],6.2,1);for(let s=0;s<8;s++){const n=s/8*6.2832;v([l+Math.cos(n)*12.6,o+Math.sin(n)*12.6],4.4,.95)}},crescent:(l,o)=>{for(const s of[-1,1]){const n=[];for(let f=0;f<=5;f++){const w=-1.5708+s*f/5*1.85;n.push([l+Math.cos(w)*13,o+Math.sin(w)*13+4])}z(n,6.4,1.4,.92,.6)}},dots:(l,o)=>{for(let s=0;s<7;s++)v([l+(s<4?(s-1.5)*9:(s-5)*9),o+(s<4?4.2:-4.2)],3.9,1)}},T=[[100,-72],[367,-30],[24,-72]],F=x.shuffle(["star","rosette","crescent","dots"]);u.fillers=T.map(([l,o],s)=>{const n=[l+b(3),o+b(3)];return c[F[s]](n[0],n[1]),{kind:F[s],at:n}});for(let l=0;l<21;l++){const o=12+l*U/21,s=149.5;v([o,s],2.6,.95);for(let n=0;n<6;n++){const f=n/6*6.2832+.3;v([o+Math.cos(f)*5.1,s+Math.sin(f)*5.1],2.2,.9)}}g([0,140.5],[U,140.5],1.5,1.5,.34),g([0,42],[U,42],2.2,2.2,.4)}const it=`
attribute vec3 aStr;      // x along the seal, phase 0..1, snap point 0..1
uniform float uStrLive;   // 1 while the seal rolls, 0 at rest (every thread has parted and drawn back by then)
varying vec3 vW; varying float vShade;
${fe}
void main(){
  // round eight: a thread is drawn out for 50 m of the seal's travel (the gap it spans grows to 17 m), fixed where it
  // stands on the print; it necks, parts between 35 and 50 m and each half draws back to its own end
  float ph = fract(aStr.y + uContact / 50.);
  float d = 4. + ph * 50.;                                    // metres behind the contact line
  float zc = uContact - d;
  float ground = fzH(textureLod(uPic, fzPicUv(vec2(aStr.x, zc)), 0.)) * ${ee}.;
  float gap = ${he.toFixed(2)} - sqrt(max(${(he*he).toFixed(1)} - d * d, 1.));    // the drum's own rise at that distance
  float top = ground + gap + 0.3;
  float t = position.y;                                       // 0 at the print, 1 at the drum
  float snap = 0.45 + 0.5 * aStr.z;
  float cut = step(snap, ph);                                 // parted: each half draws back to its own end and is gone
  float back = clamp((ph - snap) * 7., 0., 1.) * cut;
  float tt = mix(t, t < 0.5 ? t * (1. - back) : 1. - (1. - t) * (1. - back), cut);
  float mid = 1. - abs(2. * t - 1.);                          // 0 at the two roots, 1 in the middle
  float thin = mix(1., 0.16, mid * (0.4 + 0.6 * clamp(ph / snap, 0., 1.)));        // it necks as it stretches
  float wdt = (1.1 + 0.7 * fract(aStr.z * 7.3)) * mix(thin, 1. - 0.75 * mid, cut) * (1. - back) * uStrLive * smoothstep(0., 0.04, ph);
  vec3 L = vec3(aStr.x, mix(ground - 0.2, top, tt), zc - sin(t * 3.14159) * 0.5 * (1. - cut));
  float px = length((modelMatrix * vec4(L, 1.)).xyz - uCamPos) * uPixel;
  wdt = max(wdt, px * mix(3.6, 1.8, mid) * step(0.02, wdt));  // never under a pixel and a half, and still thicker at the roots
  L.x += position.x * wdt;
  vec4 wp = modelMatrix * vec4(L, 1.);
  vW = wp.xyz; vShade = 0.35 + 0.65 * t;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,rt=`
varying vec3 vW; varying float vShade;
${fe}
// round eight: a thread of wet clay drawn out in the sun that shines along the gap: the wet tone with its satin streak
// of sky cream (the palest thing under the drum, so it shows against the dark), in shade only in its last metre under the stone
void main(){ gl_FragColor = vec4(fzHazed(mix(min(uTone[0] + uCream * 0.4, vec3(1.)), fzShade(uTone[0], 1.), step(0.93, vShade)), vW), 1.); }`;async function ht(L,u={}){const v=u.style||Ye(L,u),g=xe(u.detail??L.quality?.detail??1,.6,1),z=L.rng.fork("frieze-hero"),b=new h.Group;b.name="frieze-without-end";const x=v.materials,c=he;await v.picture(),await L.yield(),u.sky!==!1&&b.add(v.makeSky()),await L.yield();let T=null;u.plain!==!1&&(T=new h.Mesh(new h.PlaneGeometry(7e3,7e3),x.plain),T.rotation.x=-Math.PI/2,T.position.set(0,0,-300),T.frustumCulled=!1,b.add(T)),await L.yield();const F=new h.Mesh(v.friezeGeometry(u.repeats??1),x.clay);F.frustumCulled=!1,b.add(F),await L.yield();const l=u.nearPatch??0;if(l)for(const e of v.makeNearPatches(l===!0?2:l,Math.round(72*(.5+.5*g))*2))b.add(e),await L.yield();await L.yield();const o=new h.Mesh(v.sealGeometry(),x.stone);o.frustumCulled=!1,b.add(o),await L.yield();const s=[],n=(e,t,i)=>{const d=t>0?new h.RingGeometry(t,c+.7,96,1):new h.CircleGeometry(c+.7,96);return d.rotateY(i*Math.PI/2),d.translate(e,0,0),d},f=(e,t,i,d=96)=>{const r=new h.CylinderGeometry(i,i,Math.abs(t-e),d,1,!0);return r.rotateZ(Math.PI/2),r.translate((e+t)/2,0,0),r};s.push(n(-172,7,-1),f(-172,-169.6,c+.7),n(172,0,1),f(169.6,172,c+.7)),s.push(f(-172,-112,7,48));const w=new h.CircleGeometry(7,32);w.rotateY(-Math.PI/2),w.translate(-112,0,0),s.push(w);{const e=(i,d,r,P,D)=>{const V=new h.CylinderGeometry(d,P,r-i,72,1,!0);if(V.rotateZ(Math.PI/2),V.translate((i+r)/2,0,0),D){const B=V.attributes.normal;for(let J=0;J<B.count;J++)B.setXYZ(J,-B.getX(J),-B.getY(J),-B.getZ(J))}return V},t=new h.RingGeometry(ve,ve+2.4,72,1);t.rotateY(-Math.PI/2),t.translate(-172-ge,0,0),s.push(e(-172-ge,ve,-172,7.5,!0),t,e(-172-ge,ve+2.4,-172,ve+4.5,!1))}const E=new h.Mesh(He(s.map(e=>e.index?e.toNonIndexed():e)),x.goldCap);x.goldCap.side=h.DoubleSide,E.frustumCulled=!1,b.add(E),await L.yield();const m=[[18,1.5],[31,1.5],[44,1.5],[57,1.5],[70,1.5],[79.3,1.1],[ve+1.2,.6,-172-ge]],G=[];for(const[e,t,i=-172]of m){const d=t===.6?44:Math.floor(2*Math.PI*e/(t*2.1)),r=z()*6.283;for(let P=0;P<d;P++)G.push([e,r+P/d*6.2832,t,i])}const N=new h.Matrix4,S=new h.Quaternion().setFromAxisAngle(new h.Vector3(0,0,1),Math.PI/2),p=new h.Vector3,C=new h.Vector3;for(const e of[!0,!1]){const t=G.filter(([r])=>r<35===e),i=e&&g>=.8,d=new h.InstancedMesh(new h.SphereGeometry(1,i?12:8,i?4:3,0,Math.PI*2,0,Math.PI/2),x.gold,t.length);t.forEach(([r,P,D,V],B)=>{d.setMatrixAt(B,N.compose(p.set(V,r*Math.cos(P),r*Math.sin(P)),S,C.set(D,D*.85,D)))}),d.frustumCulled=!1,E.add(d)}await L.yield();const W=[],M=[[176.6,4.9,6.1],[183.4,3.1,4.3],[188.7,1.9,3.1],[192.8,1,2.1]];for(const e of[-1,1]){for(let t=0;t<M.length;t++){const[i,d,r]=M[t],P=46,D=12,V=[],B=[],J=z()*6.283,le=z()*6.283,de=z()*6.283,Q=-56+t*7,ie=36-t*6.5,re=r*1.25,j=.62;for(let q=0;q<=P;q++){const ae=q/P,Y=Q+(ie-Q)*(.5-.5*Math.cos(Math.PI*ae)),te=Math.min(1,Math.min(Y-Q,ie-Y)/re),se=Math.sqrt(Math.max(0,1-(1-te)*(1-te))),ne=(j+(1-j)*Pe(Q+6,Q+46,Y))*(1-(1-j)*Pe(ie-30,ie-4,Y)),pe=1+.13*Math.sin(Y*.2+J)+.06*Math.sin(Y*.47+le),ce=ne*pe,Me=172.4+(i-172.4)*Pe(0,.75,ce)*(.6+.4*ce)+.5*Math.sin(Y*.17+de)*ce,be=d*ce,we=Math.max(r*ce*se,.02),ye=-Math.asin(Math.min(1,d/r))-.15,ke=Math.PI-ye;for(let me=0;me<=D;me++){const Le=ze(ye,ke,me/D);V.push(e*Math.max(172.4,Me+we*Math.cos(Le)),be*(.35+.65*se)+we*Math.sin(Le)-.3,Y)}}for(let q=0;q<P;q++)for(let ae=0;ae<D;ae++){const Y=q*(D+1)+ae,te=Y+1,se=Y+D+1,ne=se+1;e<0?B.push(Y,se,te,te,se,ne):B.push(Y,te,se,te,ne,se)}const K=new h.BufferGeometry;K.setAttribute("position",new h.Float32BufferAttribute(V,3)),K.setIndex(B),K.computeVertexNormals(),W.push(K)}await L.yield()}const k=new h.Mesh(He(W),x.clayFreeBiased(3e3));k.frustumCulled=!1,k.position.y=.02,b.add(k);const y=Math.round(30*g),H=new h.InstancedBufferGeometry;{const e=[],t=[];for(let r=0;r<=8;r++)e.push(-.5,r/8,0,.5,r/8,0);for(let r=0;r<8;r++){const P=r*2;t.push(P,P+1,P+2,P+1,P+3,P+2)}H.setAttribute("position",new h.Float32BufferAttribute(e,3)),H.setIndex(t);const d=new Float32Array(y*3);for(let r=0;r<y;r++){const P=z.range(-168,168);d[r*3]=r%5<3?-112+(P+168)/336*112:P,d[r*3+1]=z(),d[r*3+2]=z.range(.35,.95)}H.setAttribute("aStr",new h.InstancedBufferAttribute(d,3)),H.instanceCount=y}const $=new h.Mesh(H,new h.ShaderMaterial({uniforms:v.uniforms,vertexShader:it,fragmentShader:rt,side:h.DoubleSide}));$.frustumCulled=!1,b.add($);{const e=Math.round(60*g),t=new h.InstancedBufferGeometry,i=$e("frieze-without-end:threads:"+(L.seed??0));t.setAttribute("position",H.attributes.position),t.setIndex(H.index);const d=new Float32Array(e*3);for(let P=0;P<e;P++)d[P*3]=i.range(-166,166),d[P*3+1]=i(),d[P*3+2]=i.range(.35,.95);t.setAttribute("aStr",new h.InstancedBufferAttribute(d,3)),t.instanceCount=e;const r=new h.Mesh(t,$.material);r.frustumCulled=!1,b.add(r)}await L.yield();const R=()=>{const e=v.contactZ,t=v.progress??.6;E.position.set(0,c,e),E.rotation.x=v.rollAngle;const i=(v.sealZ(t+.004)-v.sealZ(t-.004))/(.008*42);k.position.z=e,k.scale.y=.42+.58*xe(i/10,0,1),v.uniforms.uStrLive.value=xe(i/2.5,0,1)};R(),await L.yield();const _=v.figures,O=[1,2,3],A=(e,t,i)=>new h.Vector3(e,t,i),a={portalSeat:{position:A(-172,c,0),facing:A(-1,0,0),radius:7},bore:{position:A(-172,c,0),direction:A(1,0,0),radius:7,depth:60},capCentre:A(-172,c,0),flyThrough:[[-150,30,-1e3],[-150,30,-880],[-110,26,-670],[-150,22,-500],[-120,14,-350],[-165,13,-200],[-250,36,-130],[-310,66,-70],[-290,78,-22],[-240,c,0],[-172,c,0]].map(e=>A(...e)),viewpoints:{entry:A(-150,30,-1e3),flank:A(-120,14,-350),rope:A(-165,13,-200),cap:A(-310,66,-70)},slip:O.map(e=>A(_.slip[1],4,_.toCourse(_.slip[0],e))),seams:[-ue,-ue-U,-ue-2*U],sealAxisAt:e=>A(0,c,v.sealZ(e)),figures:_};return{object:b,radius:190,height:160,center:A(0,70,-60),anchors:a,style:v,ground:!1,groundY:0,setProgress(e){v.setProgress(e),R()},update(e,t,i){v.driven||v.setProgress(.52+.4*(t/70%1),!0),R(),v.update(e,t,i,b)},dispose(){for(const e in x)x[e].dispose?.();v.pic.dispose(),v.pic2?.dispose()}}}export{U as PITCH,ee as RELIEF,he as SEAL_R,X as WIDTH,ht as buildHero,Ye as makeStyle};
