import*as d from"three";const ie=["#CDBE98","#4E9A6A","#E0562A","#6C3A78","#EFEAD9","#D9A93A","#1B1716"],ae={kx:.82,ky:.57,kq:.58};function le(n,u,e,r=1,a=new d.Vector3){return a.set(-r*ae.kx*n,e+ae.ky*n+ae.kq*u,u)}const ee=`
uniform float uHand, uTime, uGain, uLoss0;
uniform vec3 uFronts, uPaper, uInk, uWhite;
vec3 gShear(vec3 P){ return vec3(-uHand*0.82*P.x, P.y + 0.57*P.x + 0.58*P.z, P.z); }
// metres behind the furthest-advanced gust front (negative: the gust has not come yet)
float gBehind(float wz){ vec3 d = uFronts - vec3(wz); return max(d.x, max(d.y, d.z)); }
// 0..1 pulse while a front is passing (any of the three)
float gPulse(float wz){ vec3 d = uFronts - vec3(wz);
  vec3 b = smoothstep(vec3(-12.), vec3(8.), d) * (1. - smoothstep(vec3(30.), vec3(110.), d));
  return max(b.x, max(b.y, b.z)); }
vec2 gH2(vec2 p){ p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))); return fract(sin(p) * 43758.5453); }
// one cell of a seeded mosaic: x = distance to the nearest cell border (cell units), yz = the cell's hash
vec3 gCell(vec2 x){ vec2 n = floor(x), f = fract(x); float d1 = 8., d2 = 8.; vec2 id = vec2(0.), r1 = vec2(0.), r2 = vec2(1., 0.);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) { vec2 g = vec2(float(i), float(j)); vec2 o = gH2(n + g);
    vec2 r = g + o - f; float d = dot(r, r);
    if (d < d1) { d2 = d1; r2 = r1; d1 = d; r1 = r; id = n + g; } else if (d < d2) { d2 = d; r2 = r; } }
  vec2 dr = r2 - r1; float e = dot(0.5 * (r1 + r2), dr / max(length(dr), 1e-4));
  return vec3(e, gH2(id + 7.3)); }
`,ce=`
attribute vec3 aCol; attribute vec4 aA; attribute vec4 aB;
varying vec2 vUv; varying vec3 vCol; varying float vWz; varying float vLoss; varying vec4 vX;
${ee}
uniform float uDraw;
void main(){
  vec3 P = position; vUv = uv; vCol = aCol; vLoss = 0.; vX = vec4(0.);
#ifdef USE_INSTANCING
  P = (instanceMatrix * vec4(P, 1.)).xyz;
#endif
  float wz0 = (modelMatrix * vec4(gShear(P), 1.)).z;
#if ANIM == 1
  // blind: aA = (v 0 top..1 hem, length, max roll, seed), aB = (across 0..1, torn flag, top h, plane q)
  float d = gBehind(wz0), v = aA.x, L = aA.y;
  // negative max roll: rolled up from the start. Over 1: the hero's blind, which the gust's leading edge rolls up at once.
  // The others roll one after another outward from the line we fly (the front reaches the far bays of a wall later).
  float r = aA.z < 0. ? -aA.z : aA.z > 1. ? (aA.z - 1.) * smoothstep(-14., 40., d) : aA.z * smoothstep(18., 128., d - 0.3 * abs(P.x));
  float gust = gPulse(wz0);
  float bel = (gust * 6.5 + 0.5 * sin(uTime * 1.1 + aA.w * 6.3) + 0.35 * sin(uTime * 2.3 + aB.x * 5. + aA.w)) * sin(3.1416 * clamp(aB.x, 0., 1.)) ;
  float keep = 1. - r, vv = min(v, keep);
  float h = aB.z - vv * L, q = aB.w + bel * vv * (1.4 - 0.4 * vv) + 0.25 * sin(uTime * 1.7 + aA.w * 3.) * vv;
  float s = max(v - keep, 0.) * L;                       // length wound into the roll
  float R0 = 0.9 + 0.045 * r * L, ang = s / R0 * 1.6, Rs = R0 * (1. - 0.55 * s / max(r * L, 1e-3));
  q += Rs * cos(ang) - R0;
  h += -Rs * sin(ang);
  float torn = aB.y * smoothstep(40., 120., d);          // the torn top corner sags and swings
  float cw = (1. - smoothstep(0., 0.55, aB.x)) * (1. - smoothstep(0., 0.75, v));
  h -= torn * 9. * cw; q += torn * 5. * cw * (0.6 + 0.4 * sin(uTime * 1.9));
  P = vec3(P.x + torn * 3. * cw, h, q);
  vX = vec4(v, keep, aB.x, torn);
#elif ANIM == 2
  // hanging cloth, ribbons: aA = (free weight 0 fixed..1 loose, phase, stream weight, 0)
  float g2 = gPulse(wz0), w = aA.x;
  float rip = sin(uTime * 2.1 + aA.y + P.x * 0.21) * 0.5 + sin(uTime * 3.4 + aA.y * 1.7 + P.y * 0.3) * 0.3;
  P.z += w * (rip * (0.5 + 1.2 * g2 + aA.z * 0.8) + g2 * (2.5 + 9. * aA.z) * w + aA.z * 1.2 * w);
  P.y += w * w * g2 * aA.z * 5.;
  P.x += w * aA.z * (0.4 * sin(uTime * 2.7 + aA.y * 2.3) + 2.5 * g2);
#elif ANIM == 3
  // robes: aA = (drawn-in weight, breathing weight, seed, 0); uDraw 0..1 pulls the near sleeve 3 m in
  P.z += aA.x * uDraw * 3.4; P.y += aA.y * 0.12 * sin(uTime * 0.9 + aA.z);
  P.x += aA.x * uDraw * 0.8;
#endif
#if ANIM != 1
  vLoss = aB.x;
#endif
  vec4 wp = modelMatrix * vec4(gShear(P), 1.); vWz = wp.z;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,fe=`
varying vec2 vUv; varying vec3 vCol; varying float vWz; varying float vLoss; varying vec4 vX;
${ee}
uniform vec4 uUnder;      // underdrawing: (spacing along u, spacing along v, offset u, offset v) in metres; 0 = none
uniform vec2 uScale;      // (crackle cell, chip cell) in metres
uniform vec3 uGreen, uOchre;
uniform float uStrip;   // 0..1: the whole coat lets go in a wave running up the diagonal (the world's rare event); 0 = never
uniform float uPatch;   // size of an abraded patch, in chips (losses are gathered into patches; between them the coat is whole)
// the chip mosaic with what the loss needs: x = distance to the nearest border, yz = the chip's hash; nb = the hash of the chip
// across that border; ctr = the chip's own centre (cell units), so a chip is kept or lost whole
vec3 gCellN(vec2 x, out float nb, out vec2 ctr){ vec2 n = floor(x), f = fract(x); float d1 = 8., d2 = 8.; vec2 id = vec2(0.), id2 = vec2(1.), r1 = vec2(0.), r2 = vec2(1., 0.);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) { vec2 g = vec2(float(i), float(j)); vec2 o = gH2(n + g);
    vec2 r = g + o - f; float d = dot(r, r);
    if (d < d1) { d2 = d1; r2 = r1; id2 = id; d1 = d; r1 = r; id = n + g; } else if (d < d2) { d2 = d; r2 = r; id2 = n + g; } }
  vec2 dr = r2 - r1; float e = dot(0.5 * (r1 + r2), dr / max(length(dr), 1e-4));
  nb = gH2(id2 + 7.3).x; ctr = x + r1;
  return vec3(e, gH2(id + 7.3)); }
// how much of the coat is gone at a point (0 whole .. 0.92 the heart of a patch). amt = the sheet's loss; a patch opens from
// its heart outward as amt passes the patch's own hash, so a gust front leaves ragged abrasions and not pepper.
float gPatch(vec2 x, float amt){ vec3 pc = gCell(x + 31.7);
  return clamp((amt * 2.1 - pc.y) * 7., 0., 1.) * smoothstep(0.03, 0.2, pc.x + 0.05 * sin(x.x * 9.1 + x.y * 5.3)) * 0.92; }
float gLine(float dist, float w, float fw){ float hw = max(w, 0.75 * fw); return 1. - smoothstep(hw - 0.5 * fw, hw + 0.5 * fw, dist); }
void main(){
  vec2 fwv = fwidth(vUv); float fw = max(max(fwv.x, fwv.y), 1e-4);
  // a surface seen so edge-on that its marks would stretch more than about three to one keeps only its flat plate
  vec2 jx = dFdx(vUv), jy = dFdy(vUv); float jd = abs(jx.x * jy.y - jx.y * jy.x);
  float ja = dot(jx, jx) + dot(jy, jy), graze = smoothstep(3.0, 4.4, ja / max(jd, 1e-9));
  float fs = sqrt(max(ja, 1e-8));                            // metres per pixel along the most squeezed direction
  vec3 pig = vCol; float lossAdd = 0., ulx = 0.;
#ifdef FLOOR
  // mats 27 (u) by 13.5 (v), shell-white borders along the long sides with ink marks, rows staggered
  float row = floor(vUv.y / 13.5), fy = vUv.y - row * 13.5;
  float ux = vUv.x + mod(row, 2.) * 13.5 + 3. * sin(row * 12.9898);
  float fx = ux - floor(ux / 27.) * 27.;
  float wob = 0.12 * sin(vUv.x * 0.31 + row * 1.7) + 0.08 * sin(vUv.x * 0.83 + row);
  float bd = min(fy, 13.5 - fy) + wob;                      // distance to the long edge
  float fwb = max(fwv.y, 1e-4);                             // the border is ruled along u: its edge is filtered by v alone and stays crisp edge-on
  float border = 1. - smoothstep(0.95 - fwb * 0.5, 0.95 + fwb * 0.5, bd);
  lossAdd = 0.03 * (1. - smoothstep(0.5, 4., bd)) - 0.012;   // mats wear along their borders
  pig = mix(uGreen, uWhite, border);
  float mk = abs(fract(vUv.x / 2.4 + row * 0.37) - 0.5) * 2.4;  // ink marks on the border: a row of lozenges
  float loz = 1. - smoothstep(0.30 - fw, 0.30 + fw, mk * 0.55 + abs(bd - 0.47));
  pig = mix(pig, uInk, border * loz * (1. - smoothstep(0.26, 0.36, fs)) * (1. - graze));   // marks under about 3 px are left out, not greyed
  float seam = gLine(min(fx, 27. - fx), 0.05, max(fwv.x, 1e-4)) * (1. - border);   // mat ends: one thin ink line
  pig = mix(pig, uInk, seam * 0.85 * (1. - smoothstep(1.2, 1.8, fwv.x)));
  ulx = gLine(abs(fx - 1.1 - 0.5 * sin(row * 3.7)), 0.07, fw);          // the mat ends in the underdrawing, staggered like the mats and off by a metre
#endif
#ifdef PLANK
  // planks 4.5 m wide ruled along the beams, butt joints staggered row by row: thin ink lines, left out when under about 3 px apart
  float prow = floor(vUv.y / 4.5), py = vUv.y - prow * 4.5, fwp = max(fwv.y, 1e-4);
  float ps = gLine(min(py, 4.5 - py) + 0.1 * sin(vUv.x * 0.27 + prow * 2.3), 0.07, fwp) * (1. - smoothstep(1.0, 1.6, fwp));
  float pux = vUv.x + 61.7 * fract(prow * 0.618);
  float pj = gLine(abs(pux - floor(pux / 54.) * 54. - 27.), 0.06, max(fwv.x, 1e-4)) * (1. - smoothstep(0.5, 0.9, fwv.x));
  pig = mix(pig, uInk, 0.8 * max(ps, pj * (1. - ps)) * (1. - graze));
  pig = mix(pig, uInk, 0.06 * smoothstep(1.0, 1.6, fwp));
  lossAdd = -0.012;
#endif
#ifdef BLIND
  float v = vX.x, keep = vX.y, ac = vX.z, torn = vX.w;
  lossAdd = -0.045 + 0.06 * smoothstep(0.55, 1., v);       // blinds wear at the hem, where they drag
  float jag = 0.035 * sin(ac * 61. + v * 17.) + 0.05 * sin(ac * 23. - v * 31.) + 0.02 * sin(v * 140.);
  if (torn > 0.01 && ac + v * 0.55 + jag < 0.24 * torn) discard;                 // the bite torn out of the corner
  float reed = abs(fract(vUv.y / 0.9) - 0.5) * 0.9;                             // reeds ruled along the beam direction
  float isO = abs(vCol.r - uOchre.r) + abs(vCol.g - uOchre.g) < 0.03 ? 1. : 0.;
  if (v > 0.972 || v < 0.03) { pig = uGreen; isO = 0.; }                          // the green binding at head and hem: a hard edge, never a blend
  pig = mix(pig, uInk, isO * 0.8 * gLine(reed, 0.035, fw) * (1. - smoothstep(0.15, 0.3, fw)));
  pig = mix(pig, uInk, 0.14 * isO * smoothstep(0.15, 0.3, fw));                 // far off: the flat average of the ruling
  float rl = gLine(abs(v - keep) * 40., 0.12, fw * 1.2) * step(keep, 0.995);     // the ink line where the roll begins
  pig = mix(pig, uInk, rl);
#endif
  // crackle: hairline cracks between hand-sized plates; merged to the flat plate when finer than ~3 px
  vec3 ck = gCell(vUv / uScale.x + 17.);
  vec3 cz = gCell(vUv / (uScale.x * 11.) + 3.1);            // the crackle gathers in a few places; most of a plate is calm flat pigment
  float crk = step(cz.y, 0.24) * smoothstep(0.02, 0.3, cz.x) * (1. - graze) * gLine(ck.x * uScale.x, 0.011, fw) * clamp(0.02 / fw, 0., 1.) * (0.3 + 0.7 * smoothstep(0.02, 0.2, pig.g)) * (1. - smoothstep(uScale.x * 0.12, uScale.x * 0.3, fw));
  vec3 under = mix(uPaper, uInk, 0.45);
  vec3 col = mix(pig, mix(uPaper, under, 0.5), crk * 0.6);
  // losses: whole chips cut out of the coat to the paper below, gathered into a few ragged abraded patches; more open
  // once a gust front has passed. Between patches the coat is unbroken.
  float nb; vec2 ctr; vec3 ch = gCellN(vUv / uScale.y, nb, ctr);
  float d = gBehind(vWz);
  float sw = uStrip > 0. ? smoothstep(0., 70., uStrip * 1150. - (vUv.x + 430.) - 0.25 * (vUv.y + 300.)) : 0.;
  float amt = uLoss0 + vLoss + lossAdd + uGain * smoothstep(-5., 90., d);
  float th = max(gPatch(ctr / uPatch, amt), sw);             // the same for every pixel of a chip
  float thS = max(gPatch(vUv / (uScale.y * uPatch), amt), sw);  // the smooth patch, for far off
  float lost = step(ch.y, th), lostN = step(nb, th);
  float far = smoothstep(uScale.y * 0.13, uScale.y * 0.21, fs);   // chips under about 5 px across: only the patch remains
  vec2 g = vUv + vec2(0.35 * sin(vUv.y * 0.23) + 0.2 * sin(vUv.y * 0.71), 0.35 * sin(vUv.x * 0.19) + 0.2 * sin(vUv.x * 0.57));
  float ul = ulx;
  if (uUnder.x > 0.) { float gx = abs(fract((g.x + uUnder.z) / uUnder.x) - 0.5) * uUnder.x; ul = max(ul, gLine(min(gx, abs(gx - 0.8)), 0.09, fw)); }
  if (uUnder.y > 0.) { float gy = abs(fract((g.y + uUnder.w) / uUnder.y) - 0.5) * uUnder.y; ul = max(ul, gLine(min(gy, abs(gy - 0.95)), 0.09, fw)); }
  // a few loose strokes of the first drawing that the paint never followed
  float fr2 = abs(fract((g.x * 0.42 + g.y * 0.81) / 9.7) - 0.5) * 9.7; ul = max(ul, gLine(fr2, 0.08, fw) * step(0.5, fract(floor((g.x * 0.42 + g.y * 0.81) / 9.7) * 0.37)));
  vec3 pap = mix(uPaper, under, ul * (1. - smoothstep(0.5, 1.5, fw)));
  float edge = gLine(ch.x * uScale.y, 0.07, fw);        // the cut edge: one shell-white line for the coat's thickness, only where paint still stands beside it
  pap = mix(pap, uWhite, edge * (1. - smoothstep(0., 0.4, far)) * (1. - graze) * (1. - lostN) * step(ch.z, 0.8) * (1. - sw));
  float nearK = (1. - far) * (1. - graze);
  col = mix(col, pap, lost * nearK);
  float fp = max(fs / (uScale.y * uPatch), 1e-4) * 3.;       // far off a patch is one flat shape of bare paper with a hard edge; edge-on it is left out
  col = mix(col, uPaper, far * (1. - graze) * smoothstep(0.5 - fp, 0.5 + fp, thS) * (1. - smoothstep(0.1, 0.2, fp)));
  gl_FragColor = vec4(col, 1.);
}`;function ue(n={}){const u=(n.palette&&n.palette.length>=7?n.palette:ie).map(i=>new d.Color(i)),[e,r,a,f,l,o,s]=u,g=i=>i.clone().lerp(l,.5),p={uHand:{value:n.hand===-1?-1:1},uTime:{value:0},uGain:{value:n.worn?.2:.09},uLoss0:{value:n.worn?.12:.05},uFronts:{value:new d.Vector3(-1e4,-1e4,-1e4)},uPaper:{value:e},uInk:{value:s},uWhite:{value:l},uGreen:{value:r},uOchre:{value:o},uPx:{value:new d.Vector2(800,450)},uDraw:{value:0},uPatch:{value:n.worn?4.6:3.2}},A=[];function v(i={}){const h=new d.ShaderMaterial({uniforms:{...p,uUnder:{value:new d.Vector4(...i.under||[0,6,0,.6])},uScale:{value:new d.Vector2(i.crackle||.45,i.chip||2.4)},uStrip:{value:0},uPatch:p.uPatch},defines:{ANIM:i.anim|0,...i.floor?{FLOOR:1}:{},...i.blind?{BLIND:1}:{},...i.plank?{PLANK:1}:{}},vertexShader:ce,fragmentShader:fe,side:d.DoubleSide});return i.offset&&(h.polygonOffset=!0,h.polygonOffsetFactor=-i.offset,h.polygonOffsetUnits=-i.offset*2),A.push(h),h}return{uniforms:p,pal:{paper:e,green:r,red:a,purple:f,white:l,ochre:o,ink:s},tint:g,coatMaterial:v,mats:A}}function he(n,u={}){const e=new d.ShaderMaterial({uniforms:{...n.uniforms,uCol:{value:u.color||n.pal.ink}},vertexShader:`
attribute vec3 aDir; attribute vec4 aA; attribute float aDw;   // aA = (side -1/+1, width m, seed, fade key); aDw = drawn-in weight
uniform vec2 uPx; uniform float uDraw; ${ee}
varying float vK;
void main(){
  vec3 P = position; float sd = aA.z;
  P.z += aDw * uDraw * 3.4; P.x += aDw * uDraw * 0.8;
  P.x += 0.11 * sin(uTime * 1.3 + sd * 9.1) + 0.05 * sin(uTime * 3.1 + sd * 4.7 + P.y * 0.4);
  P.y += 0.09 * sin(uTime * 1.7 + sd * 5.3);
  vec4 a = projectionMatrix * viewMatrix * modelMatrix * vec4(gShear(P), 1.);
  vec4 b = projectionMatrix * viewMatrix * modelMatrix * vec4(gShear(P + aDir), 1.);
  float wa = max(abs(a.w), 1e-4), wb = max(abs(b.w), 1e-4);
  vec2 dir = (b.xy / wb - a.xy / wa) * uPx; float len = max(length(dir), 1e-5);
  vec2 n = vec2(-dir.y, dir.x) / len;
  float ppm = uPx.y * projectionMatrix[1][1] * 0.5 / wa;
  float px = max(aA.y * ppm, 1.6) * (aA.w > 0. ? smoothstep(2.5, 5., ppm * aA.w) : 1.);
  a.xy += n * aA.x * px / uPx * a.w;
  vK = aA.w; gl_Position = a;
}`,fragmentShader:"uniform vec3 uCol; varying float vK; void main(){ gl_FragColor = vec4(uCol, 1.); }",side:d.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-6});return n.mats.push(e),e}function de(n){const u=new d.ShaderMaterial({uniforms:{...n.uniforms},vertexShader:`
attribute vec3 aO; attribute vec4 aF; attribute vec3 aCol;
varying vec3 vCol; varying vec2 vQ; varying float vS;
${ee}
void main(){
  float sd = aF.x; vec3 O = aO;
  float wz0 = (modelMatrix * vec4(gShear(O), 1.)).z;
  vec3 fr = uFronts - vec3(wz0);
  float d = (aF.w < 0.5 ? fr.x : (aF.w < 1.5 ? fr.y : fr.z)) - aF.z;
  float life = 150. + 160. * fract(sd * 7.31);
  if (aF.w > 2.5) d = mod(uTime * 14. + sd * 53., life);     // index 3: always shedding, on the clock (the small loop)
  float on = step(0., d) * step(d, life);
  float t = max(d, 0.);
  float grow = smoothstep(0., 6., t) * (1. - smoothstep(life * 0.8, life, t));
  // lift, then run ahead (+q) and up the diagonal (+p), fluttering
  float k = 0.55 + 0.5 * fract(sd * 3.7);
  O.z += t * k * 0.92;
  O.x += t * k * (0.25 + 0.3 * fract(sd * 5.1)) + 1.8 * sin(t * 0.09 + sd * 20. + uTime * 1.3);
  O.y += 5. * smoothstep(0., 25., t) + t * (0.02 + 0.1 * fract(sd * 9.7)) + 1.5 * sin(t * 0.13 + sd * 11. + uTime * 1.9);
  float a1 = sd * 40. + t * 0.21 + uTime * (1.5 + 2. * fract(sd * 2.3)), a2 = sd * 17. + t * 0.13 + uTime * 1.1;
  vec3 ax = vec3(cos(a1), sin(a1) * cos(a2), sin(a1) * sin(a2));
  vec3 ay = vec3(-sin(a1) * 0.6, cos(a1) * cos(a2) + 0.2, cos(a1) * sin(a2) + 0.5);
  float sz = aF.y * on * (0.25 + 0.75 * grow);
  // no flake is ever wider than about 3.5 percent of the frame, however near it passes
  vec4 oc = projectionMatrix * viewMatrix * modelMatrix * vec4(gShear(O), 1.);
  sz = min(sz, 0.062 * max(oc.w, 0.) / max(projectionMatrix[0][0], 1e-4));
  vec3 P = O + (ax * position.x + ay * position.y) * sz;
  vCol = aCol; vQ = position.xy; vS = sd;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(gShear(P), 1.);
}`,fragmentShader:`
uniform vec3 uPaper, uInk; varying vec3 vCol; varying vec2 vQ; varying float vS;
void main(){
  // a chipped polygon: the quad with its corners cut by three seeded lines
  float c1 = dot(vQ, vec2(cos(vS * 31.), sin(vS * 31.))), c2 = dot(vQ, vec2(cos(vS * 57. + 2.), sin(vS * 57. + 2.)));
  float c3 = dot(vQ, vec2(cos(vS * 13. + 4.), sin(vS * 13. + 4.)));
  if (c1 > 0.36 || c2 > 0.40 || c3 > 0.33 || abs(vQ.x) + abs(vQ.y) > 0.72) discard;
  vec3 back = mix(uPaper, mix(uPaper, uInk, 0.45), 0.35);
  gl_FragColor = vec4((gl_FrontFacing || fract(vS * 1.37) > 0.12) ? vCol : back, 1.);
}`,side:d.DoubleSide});return n.mats.push(u),u}async function $(n,u,e){const r=n.length,a=new u(r);for(let f=0;f<r;f+=6e4){const l=Math.min(r,f+6e4);for(let o=f;o<l;o++)a[o]=n[o];await e()}return a}function Z(){const n=[],u=[],e=[],r=[],a=[],f=[],l={count:0,v(o,s,g,p,A,v,i,h){return n.push(o,s,g),u.push(p,A),e.push(v.r,v.g,v.b),i?r.push(i[0],i[1],i[2],i[3]):r.push(0,0,0,0),h?a.push(h[0],h[1],h[2],h[3]):a.push(0,0,0,0),l.count++},tri(o,s,g){f.push(o,s,g)},quad(o,s,g,p){f.push(o,s,g,o,g,p)},rows(o,s){for(let g=0;g+1<o.length;g++)l.quad(o[g],o[g+1],s[g+1],s[g])},build(){const o=new d.BufferGeometry;return o.setAttribute("position",new d.Float32BufferAttribute(n,3)),o.setAttribute("uv",new d.Float32BufferAttribute(u,2)),o.setAttribute("aCol",new d.Float32BufferAttribute(e,3)),o.setAttribute("aA",new d.Float32BufferAttribute(r,4)),o.setAttribute("aB",new d.Float32BufferAttribute(a,4)),o.setIndex(f),o.boundingSphere=new d.Sphere(new d.Vector3,1e5),o},async buildAsync(o){const s=new d.BufferGeometry;return s.setAttribute("position",new d.BufferAttribute(await $(n,Float32Array,o),3)),s.setAttribute("uv",new d.BufferAttribute(await $(u,Float32Array,o),2)),s.setAttribute("aCol",new d.BufferAttribute(await $(e,Float32Array,o),3)),s.setAttribute("aA",new d.BufferAttribute(await $(r,Float32Array,o),4)),s.setAttribute("aB",new d.BufferAttribute(await $(a,Float32Array,o),4)),s.setIndex(new d.BufferAttribute(await $(f,Uint32Array,o),1)),s.boundingSphere=new d.Sphere(new d.Vector3,1e5),s},tris(){return f.length/3}};return l}function pe(n){const u=[],e=[],r=[],a=[],f=[];let l=0;return{add(o,s=.12,g=.6,p=0){const A=o.length;if(A<2)return;const v=n()*100;for(let i=0;i<A;i++){const h=o[Math.max(i-1,0)],U=o[Math.min(i+1,A-1)],x=o[i],B=i/(A-1),R=s*(1-g+g*Math.sin(Math.PI*Math.min(1,B*1.15+.05)));for(const b of[-1,1])u.push(x[0],x[1],x[2]),e.push(U[0]-h[0],U[1]-h[1],U[2]-h[2]),r.push(b,R,v,p),a.push(x[3]||0);i&&f.push(l-2,l-1,l+1,l-2,l+1,l),l+=2}},build(){const o=new d.BufferGeometry;return o.setAttribute("position",new d.Float32BufferAttribute(u,3)),o.setAttribute("aDir",new d.Float32BufferAttribute(e,3)),o.setAttribute("aDw",new d.Float32BufferAttribute(a,1)),o.setAttribute("aA",new d.Float32BufferAttribute(r,4)),o.setIndex(f),o.boundingSphere=new d.Sphere(new d.Vector3,1e5),o},async buildAsync(o){const s=new d.BufferGeometry;return s.setAttribute("position",new d.BufferAttribute(await $(u,Float32Array,o),3)),s.setAttribute("aDir",new d.BufferAttribute(await $(e,Float32Array,o),3)),s.setAttribute("aDw",new d.BufferAttribute(await $(a,Float32Array,o),1)),s.setAttribute("aA",new d.BufferAttribute(await $(r,Float32Array,o),4)),s.setIndex(new d.BufferAttribute(await $(f,Uint32Array,o),1)),s.boundingSphere=new d.Sphere(new d.Vector3,1e5),s},tris(){return f.length/3}}}function Y(n,u,e,r,a,f,l,o,s,g,p=0,A=.14){const v=Math.max(2,Math.round((a-r)/7)),i=[[],[],[],[]];for(let h=0;h<=v;h++){const U=r+(a-r)*h/v,x=h===0||h===v?0:1,B=(u()-.5)*2*A*x,R=(u()-.5)*2*A*x,b=[[f+B,o],[l+R,o],[l+R,s],[f+B,s]];for(let P=0;P<4;P++){const[C,y]=b[P],S=e==="p"?[U,C,y]:[C,U,y];i[P].push([n.v(S[0],S[1],S[2],U,P*3.1+(P%2?y:C),g,null,[p,0,0,0]),n.v(S[0],S[1],S[2],U,P*3.1+2.2+(P%2?C:y),g,null,[p,0,0,0])])}}for(let h=0;h<4;h++){const U=i[h].map(B=>B[1]),x=i[(h+1)%4].map(B=>B[0]);n.rows(U,x)}for(const h of[0,v])n.quad(i[0][h][0],i[1][h][0],i[2][h][0],i[3][h][0])}function ve(n,u,e,r,a,f,l,o,s,g,p={}){const{green:A,ochre:v}=u.pal,i=e()*10,h=p.rows||40,U=[],x=1.7,B=1.1,R=(a-2*x-2*B)/3;let b=0;const P=(y,S,V)=>{for(let F=0;F<V;F++)U.push([b,b+y/V,S]),b+=y/V};P(x,A,1),P(R,v,3),P(B,A,1),P(R,v,3),P(B,A,1),P(R,v,3),P(x,A,1);const C=p.flip?1:0;for(const[y,S,V]of U){let F=null;for(let z=0;z<=h;z++){const N=z/h,q=V,T=k=>{const L=k/a;return n.v(r+k,f-N*l,o,k+i*41.3,N*l+Math.floor(i*7)*9,q,[N,l,s,i],[C?1-L:L,g,f,o])},O=[T(y),T(S)];F&&n.quad(F[0],F[1],O[1],O[0]),F=O}}}function*we(n,u,e,r,a){const{ink:f,white:l,green:o}=n.pal,s=[];for(let v=-3;v<=3;v++)s.push(a.bayP0+45*v);const g=s[0]-16,p=s[s.length-1]+16;Y(e,u,"p",g,p,0,1.3,-1.25,1.25,f,-.05),Y(e,u,"p",g,p,45,47.4,-1.2,1.2,f,-.05),Y(e,u,"p",g,p,55,58.2,-1.35,1.35,f,-.05);for(const v of s){const i=1+u.range(-.08,.08);Y(e,u,"h",0,60.5,v-i,v+i,-1,1,f,-.05,.1),Y(e,u,"h",0,2.2,v-i-.7,v+i+.7,-1.7,1.7,f,0,.05),Y(e,u,"p",v-3.2,v+3.2,58.2,59.6,-1.9,1.9,f,0,.05),yield}for(let v=0;v+1<s.length;v++){const i=s[v]+1,h=s[v+1]-1,U=v!==3&&u.chance(.3),x=[.08+u()*.1,0,0,0];if(!U){const y=e.v(i,47.4,.3,i,47.4,l,null,x),S=e.v(h,47.4,.3,h,47.4,l,null,x),V=e.v(h,55,.3,h,55,l,null,x),F=e.v(i,55,.3,i,55,l,null,x);e.quad(y,S,V,F)}const B=9;for(let y=1;y<B;y++){if(U&&u.chance(.5))continue;const S=i+(h-i)*y/B+u.range(-.25,.25);Y(e,u,"h",47.4,55,S-.32,S+.32,-.3,.5,f,0,.04)}const R=e.v(i,41.6,-1.6,i,0,o,null,x),b=e.v(h,41.6+u.range(-.3,.3),-1.6,h,0,o,null,x),P=e.v(h,45,-1.6,h,3.4,o,null,x),C=e.v(i,45,-1.6,i,3.4,o,null,x);e.quad(R,b,P,C),yield}const A=[];for(let v=0;v+1<s.length;v++){let i,h=0;v===3?(i=1.64,h=1):v===2?i=-.86:(i=u.pick([.15,.3,.55,.75]),h=u.chance(.35)?1:0),A.push({p0:s[v]+1,roll:i,torn:h}),ve(r,n,u,s[v]+1,43,45,40,-1.45,i,h,{flip:v===3?a.tearStarboard:u.chance(.5),pre:v===2}),yield}return{posts:s,plan:A}}function ge(n,u,e,r,a){const f=ne(n,u,e,r,a);let l=f.next();for(;!l.done;)l=f.next();return l.value}async function me(n,u,e,r,a,f){const l=ne(n,u,e,r,a);let o=l.next();for(;!o.done;)f&&await f(),o=l.next();return o.value}function*ne(n,u,e,r,a){const f=a.scale||1,l=a.bands,o=l.length,s=Math.cos(a.rot||0),g=Math.sin(a.rot||0),p=a.segs||160,A=e.pal.ink,v=a.flat||1,i=a.lift||0,h=[[r.range(-.08,.08),r.range(17,20),r.range(.3,.36)],[r.range(.66,.84),r.range(14,18),r.range(.2,.25)],[-r.range(.7,.9),r.range(15,18.5),r.range(.21,.26)]],U=a.lobes||h,x=U.map(t=>t[0]),B=U.map(t=>t[1]),R=U.map(t=>t[2]),b=[r()*6.28,r()*6.28,r()*6.28],P=t=>Math.atan2(Math.sin(t),Math.cos(t)),C=t=>{let c=13.5+.7*Math.sin(t*3+b[0])+.4*Math.sin(t*7+b[1]);for(let w=0;w<3;w++){const I=P(t-x[w])/R[w];c+=B[w]*Math.exp(-Math.abs(I*I*I))}return c-=2.2*Math.exp(-Math.pow(P(t-(x[0]+x[1])/2)/.1,2))+2.2*Math.exp(-Math.pow(P(t-(x[0]+x[2])/2)/.1,2)),c},y=(t,c)=>Math.min(1.05,Math.max(.42,c*.042)),S=l.map(()=>r.range(.8,1.2)),V=(t,c,w)=>{const I=t/8.6*(t/8.6)+c/7*(c/7);let Q=14.5*Math.exp(-Math.pow(I,1.25))+4.4*Math.exp(-(t*t+(c-.6)*(c-.6))/8.5);return Q+=8.6*Math.exp(-(Math.pow((t+9.6)/5.4,2)+Math.pow((c+1)/6.2,2)))+8.2*Math.exp(-(Math.pow((t-9.6)/5.4,2)+Math.pow((c+1)/6.2,2))),(Q+2.9*(1-w*w*w)+.5*Math.sin(t*.9+b[2])*Math.sin(c*.7+b[1])*(1-w))*v},F=(t,c)=>[a.p+f*(t*s-c*g),a.q+f*(t*g+c*s)],z=a.drapeQ===void 0?null:a.drapeQ,N=(t,c,w,I=0)=>{const Q=Math.sin(t)*c,M=-Math.cos(t)*c,[E,H]=F(Q,M);let X=f*V(Q,M,w)+I+i;z!==null&&(X=Math.max(X,1.95*Math.exp(-Math.pow((H-z)/2.3,2))+.35+I));const J=a.nearSide===0?0:Math.exp(-Math.pow(P(t-x[(a.nearSide||-1)<0?2:1])/.3,2))*Math.max(0,Math.min(1,(w-.42)/.4));return[E,X,H,J]},q=a.nm||15,T=[],O=[],k=[],L=[],_=[];for(let t=0;t<=p;t++){const c=-Math.PI+t/p*2*Math.PI;k.push(C(c))}for(let t=0;t<3;t++){const c=k.slice(0,p);for(let w=0;w<=p;w++)k[w]=.25*c[(w+p-1)%p]+.5*c[w%p]+.25*c[(w+1)%p]}for(let t=0;t<=p;t++)L.push(y(0,k[t]));for(let t=0;t<=o;t++){const c=[];for(let w=0;w<=p;w++)c.push(w===p?c[0]:r.range(-.16,.16));_.push(c)}const G=(t,c)=>{let w=k[c];for(let I=o-1;I>=t;I--)w-=L[c]*S[I];return w+_[t][c]*(t===o?1.6:1)},K=(t,c,w,I)=>{const Q=-Math.PI+t/p*2*Math.PI,M=Math.min(1,c/k[t]),E=N(Q,c,M),H=E[3];return n.v(E[0],E[1],E[2],Q*Math.max(2.5,I.rm)*f,I.s*f,w,[H,1-M,b[0],0],[a.loss||0,0,0,0])};let W=null,m=0,j=0;for(let t=0;t<=q;t++){const c=Math.pow(t/q,.8),w={s:c*16,rm:c*15},I=[];for(let Q=0;Q<=p;Q++)I.push(K(Q,Math.max(.02,G(0,Q)*c),a.top,w));W&&n.rows(W,I),W=I,p>100&&t%5===4&&(yield)}yield,m=16,j=15;for(let t=0;t<o;t++){const c=[],w=[],I={s:m,rm:j},Q={s:m+1.1,rm:j+1};for(let M=0;M<=p;M++)c.push(K(M,G(t,M),l[t],I)),w.push(K(M,G(t+1,M),l[t],Q));n.rows(c,w),m+=1.1,j+=1,(p>100?t%2===1:t%5===4)&&(yield)}if(yield,u)for(let t=0;t<=o;t++){let c=0;const w=r.range(.05,.15)*(r.chance(.5)?1:-1);for(;c<p;){const I=r.int(9,26),Q=[],M=w+r.range(-.05,.05);for(let E=c;E<=Math.min(p,c+I);E++){const H=-Math.PI+E/p*2*Math.PI,X=G(t,E)-_[t][E]*.7+M,J=N(H,X,Math.min(1,X/k[E]),.1);Q.push(J)}u.add(Q,t===o?.1:.07,.55,t===0||t===o?0:1),c+=I-(r.chance(.4)?2:-1)}(p>100?t%2===1:t%5===4)&&(yield)}return{heightAt:(t,c)=>{const w=(t-a.p)/f,I=(c-a.q)/f,Q=w*s+I*g,M=-w*g+I*s,E=Math.atan2(Q,-M),H=Math.hypot(Q,M),X=C(E);return H>X?-1:f*V(Q,M,H/X)},Rof:C,pt:N,tl:x,world:F,edgeR:G,Rs:k,NT:p,top:f*V(0,.6,0)}}function re(n,u,e,r,a,f={}){const l=e.pal.ink,o=e.pal.white,s=f.hairLen||19.5,g=.45,p=r()*6.28,A=(b,P,C)=>{const y=Math.atan2(b,-P),S=a.Rof(y),V=Math.min(S*.95,Math.max(.02,Math.hypot(b,P)));return a.pt(y,V,V/S,C)},v=b=>[.9*Math.sin(b*4.6+p)*b+(f.lean||0)*b*b*4,3-(b+.12)/1.12*(s+3)],i=b=>(b<.02?3.2+2.4*Math.sqrt(Math.max(0,(b+.12)/.14)):5.6-1.7*Math.min(1,(b-.02)/.3)+1.1*Math.max(0,b-.4))*(f.hairW||1),h=8,U=30,x=.72;let B=null;if(f.hair!==!1){for(let z=0;z<=U;z++){const N=-.12+(x+.12)*z/U,q=v(N),T=i(N),O=[];for(let k=0;k<=h;k++){const L=(k/h-.5)*T+(k===0||k===h?r.range(-.12,.12):0),_=A(q[0]+L,q[1],g);O.push(n.v(_[0],_[1],_[2],L,N*s,l,[0,.6,p,0],[-.3,0,0,0]))}B&&n.rows(B,O),B=O}const b=v(x),P=i(x);for(let z=0;z<h;z++){const N=((z+.5)/h-.5)*P,q=P/h*1.15,T=(z+.5-h/2)*r.range(.03,.08),O=r.range(4,9),k=r.range(-.35,.35);let L=null;for(let _=0;_<=7;_++){const G=_/7,K=G*O,W=T+k*G*G,m=b[0]+N+Math.sin(W)*K,j=b[1]-Math.cos(W)*K,D=q*.5*(1-G*G)+.02,t=A(m-D*Math.cos(W),j-D*Math.sin(W),g),c=A(m+D*Math.cos(W),j+D*Math.sin(W),g),w=[n.v(t[0],t[1],t[2],N,K,l,[0,.6,p,0],[-.3,0,0,0]),n.v(c[0],c[1],c[2],N+q,K,l,[0,.6,p,0],[-.3,0,0,0])];L&&n.quad(L[0],L[1],w[1],w[0]),L=w}}const C=.36,y=v(C),S=i(C)*.56,F=[A(y[0]-S,y[1]+.5,g+.2),A(y[0]+S,y[1]+.5,g+.2),A(y[0]+S,y[1]-.5,g+.2),A(y[0]-S,y[1]-.5,g+.2)].map((z,N)=>n.v(z[0],z[1],z[2],N%2,N>1?1:0,o,[0,.6,p,0],null));n.quad(F[0],F[1],F[2],F[3])}if(!u)return;for(const b of[-1,1])for(let P=0;P<3;P++){const C=[],y=4.6+P*1.9+r.range(-.3,.3),S=r.range(-.3,.1),V=Math.PI*r.range(.95,1.2);for(let F=0;F<=22;F++){const z=S+(V-S)*F/22;C.push(A(b*(9.6+Math.cos(z)*y*.95),-1-Math.sin(z)*y*1.15,.12))}u.add(C,.085,.6,4)}const R=f.folds||16;for(let b=0;b<R;b++){const P=-Math.PI+(b+r())/R*2*Math.PI,C=r.range(.28,.5),y=r.range(.8,.99),S=r.range(-.25,.25),V=[];if(!(Math.abs(P)<.22&&f.hair!==!1)){for(let F=0;F<=14;F++){const z=C+(y-C)*F/14,N=P+S*(z-C)*(z-C)*3,q=Math.round((N+Math.PI)/(2*Math.PI)*a.NT),T=a.edgeR(0,(q%a.NT+a.NT)%a.NT)*z;V.push(a.pt(N,T,Math.min(1,T/a.Rof(N)),.12))}u.add(V,.08,.75,2.5)}}}function xe(n,u,e,r,a,f,l,o=30,s={}){const g=e.pal.ink,p=s.col||e.pal.red,A=s.dot||e.pal.white,v=s.rib||e.pal.purple,i=s.np||5,h=.5,U=(f-a-h*(i-1))/i;s.hung||Y(u,r,"p",a-2.5,f+2.5,o-.2,o+1.2,l-.7,l+.7,g,0,.06);for(const x of s.hung?[]:[a+6,f-6])Y(u,r,"h",0,o,x-.6,x+.6,l-.6,l+.6,g,0,.05),Y(u,r,"p",x-4.5,x+4.5,0,1.5,l-2.6,l+2.6,g,0,.05);for(let x=0;x<i;x++){const B=a+x*(U+h),R=r()*6.28,b=r.range(1.6,3.2),P=4,C=12;let y=null;const S=T=>Math.pow(Math.max(0,(o-.6-T)/(o-.6)),1.3);for(let T=0;T<=C;T++){const O=o-.4-(o-.4-b)*T/C,k=[];for(let L=0;L<=P;L++){const _=B+U*L/P+(L===0||L===P?r.range(-.1,.1):0),G=O+(T===C?r.range(-.35,.35):0);k.push(n.v(_,G,l-.75,_,G,p,[S(G),R,0,0],[-.045,0,0,0]))}y&&n.rows(y,k),y=k}for(let T=0;T<(s.dots||3);T++){const O=B+U*(T%2?.27:.73),k=o-5.5-T*(s.step||8)-r.range(0,1.5),L=r.range(1.5,1.9)*(s.rr||1),_=12,G=n.v(O,k,l-.95,O,k,A,[S(k),R,0,0],[-.02,0,0,0]);let K=-1,W=-1;for(let m=0;m<_;m++){const j=m/_*6.2832,D=L*r.range(.92,1.06),t=k+Math.sin(j)*D,c=n.v(O+Math.cos(j)*D,t,l-.95,O+Math.cos(j)*D,t,A,[S(t),R,0,0],[-.02,0,0,0]);K<0?K=c:n.tri(G,W,c),W=c}n.tri(G,W,K)}const V=.75,F=B+U*.5,z=r.range(20,25)*(s.ribLen||1),N=14;let q=null;for(let T=0;T<=N;T++){const O=T/N,k=o-.2-z*O,L=V*(1-.3*O),_=[.25*S(k)+O*O*.9,R+1.3,O*O,0],G=[n.v(F-L,k,l-1.2,F-L,k,v,_,[-.3,0,0,0]),n.v(F+L,k,l-1.2,F+L,k,v,_,[-.3,0,0,0])];q&&n.quad(q[0],q[1],G[1],G[0]),q=G}}}function se(n,u,e){const{green:r,red:a,purple:f,white:l,ochre:o}=n.pal,s=n.tint;let g=f,p;if(u==="winter"?(g=l,p=[s(a),l,a,l,s(f),l,s(a),a,l,s(r),a]):u==="spring"?(g=s(a),p=[l,s(r),r,l,s(a),a,l,s(r),r,s(f),l]):p=[s(f),l,s(r),r,l,o,s(a),a,l,s(f),r],e.chance(.5)){const A=8+e.int(0,1),v=p[A];p[A]=p[A+1],p[A+1]=v}return{top:g,bands:p}}async function be(n,u={}){const e=n.rng,r=Math.min(1,Math.max(.6,u.detail??1)),a=u.style||ue(u),f=a.uniforms,l=new d.Group,o=-12,s=Z(),g=Z(),p=Z(),A=Z(),v=pe(e),i=(m,j,D=0)=>{const t=new d.Mesh(m,j);return t.frustumCulled=!1,t.renderOrder=D,l.add(t),t};{const m=Z(),j=a.pal.green,D=u.floorExtent||[-178,152,-70],t=(M,E,H,X)=>m.quad(m.v(M,0,H,M,H,j),m.v(E,0,H,E,H,j),m.v(E,0,X,E,X,j),m.v(M,0,X,M,X,j));u.floor!==!1&&t(D[0],D[1],D[2],1.2);const c=[7.6,10.4+e.range(-.6,.6),8.8+e.range(-.6,.6)],w=[-8.2,-11+e.range(-.6,.6),-9.2+e.range(-.6,.6)],I=[63,70,66],Q=[-72,-78,-75];for(let M=0;M<3;M++){const E=M===0?1.2:12*M,H=12*(M+1);t(c[M],Math.min(D[1],I[M]),E,H),M<2&&t(Math.max(D[0],Q[M]),w[M],E,Math.min(H,16.5));for(const X of[c[M],w[M]]){const J=[],oe=X<0?Math.min(H,16.5):H;for(let te=0;te<=6;te++)J.push([X+e.range(-.08,.08),.15,E+(oe-E)*te/6]);oe>E+1&&v.add(J,.09,.4)}if(M<2)for(const[X,J]of M===0?[[c[M],c[M+1]],[w[M],w[M+1]]]:[[c[M],c[M+1]]])v.add([[X,.15,H],[(X+J)/2,.15,H+.1],[J,.15,H]],.09,.3)}i(m.build(),a.coatMaterial({floor:!0,under:[0,13.5,0,.7],chip:3.2}))}await n.yield();let h;{const m=we(a,e,s,g,{bayP0:o,tearStarboard:!1});let j=m.next();for(;!j.done;)await n.yield(),j=m.next();h=j.value}await n.yield();const U=u.season||"autumn",x=.8,B={p:17.5+e.range(-.5,.5),q:7.5+e.range(-.8,.8)},R=se(a,U,e),b=await me(A,v,a,e,{p:B.p,q:B.q,scale:x,rot:-.3+e.range(-.05,.05),bands:R.bands,top:R.top,drapeQ:0,loss:.03,nearSide:-1,lobes:[[e.range(-.06,.06),e.range(17.5,20),e.range(.3,.36)],[e.range(.7,.86),e.range(14,18),e.range(.2,.25)],[-e.range(.52,.58),e.range(9.5,11.5),e.range(.19,.23)]]},n.yield);await n.yield(),re(A,v,a,e,b,{lean:e.range(-.2,.2),hairLen:24.5*x,hairW:1.3}),await n.yield();const P=se(a,U,e),C=ge(A,v,a,e,{p:49+e.range(-2,2),q:27+e.range(-1.5,1.5),scale:.5,rot:e.range(-.5,.5),segs:80,lift:.5,nearSide:0,bands:P.bands.slice(4),top:e.chance(.5)?a.pal.white:a.pal.green,loss:.03});await n.yield(),re(A,v,a,e,C,{folds:9,hairLen:17}),await n.yield(),xe(p,s,a,e,-64,-9,10+e.range(-1,1),30),await n.yield(),i(await s.buildAsync(n.yield),a.coatMaterial({under:[0,0,0,0]})),await n.yield(),i(await g.buildAsync(n.yield),a.coatMaterial({anim:1,blind:!0,under:[0,4.5,0,.7],chip:2.8})),await n.yield(),i(await p.buildAsync(n.yield),a.coatMaterial({anim:2,under:[5.2,0,.8,0],chip:2.2})),await n.yield(),i(await A.buildAsync(n.yield),a.coatMaterial({anim:3,under:[0,1.1,0,.55],chip:1.9,crackle:.42})),await n.yield(),i(await v.buildAsync(n.yield),he(a),2),await n.yield();const y=Math.round(1500*r),S=new Float32Array(y*3),V=new Float32Array(y*4),F=new Float32Array(y*3),z=a.pal,N=[R.top,R.top,...R.bands];for(let m=0;m<y;m++){const j=e();let D,t,c,w;if(j<.2){let I=0;do D=B.p+x*e.range(-30,30),c=B.q+x*e.range(-32,16),t=b.heightAt(D,c);while(t<0&&++I<8);t<0?(t=.3,w=z.green):w=e.pick(N),t+=.4}else j<.55?(D=o+1+e.range(0,43)+(e.chance(.3)?45:0),t=e.range(6,44),c=-1.8,w=e.chance(.8)?z.ochre:z.green):j<.66?(D=e.range(-64,-9),t=e.range(3,29),c=9,w=e.chance(.75)?z.red:z.white):(D=e.range(-90,80),c=e.range(-45,40),t=.3,w=e.chance(.85)?z.green:z.white);S.set([D,t,c],m*3),F.set([w.r,w.g,w.b],m*3),V.set([e()*10,e.range(.7,2.4)*(e.chance(.12)?1.6:1),e.range(-8,95)*e(),e.chance(.22)?3:0],m*4),(m&255)===255&&await n.yield()}const q=new d.InstancedBufferGeometry;q.setAttribute("position",new d.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),q.setIndex([0,1,2,0,2,3]),q.setAttribute("aO",new d.InstancedBufferAttribute(S,3)),q.setAttribute("aF",new d.InstancedBufferAttribute(V,4)),q.setAttribute("aCol",new d.InstancedBufferAttribute(F,3));for(let m=0;m<y;m++)V[m*4+1]*=.72;q.instanceCount=Math.max(1,Math.round(y*.5)),q.boundingSphere=new d.Sphere(new d.Vector3,1e5),i(q,de(a),3);let T=-1;const O=new d.Vector3,k=new d.Vector2,L=[.08,.4,.7],_=n.core?n.core.smoothstep:(m,j,D)=>{const t=Math.min(1,Math.max(0,(D-m)/(j-m)));return t*t*(3-2*t)};function G(m){l.getWorldPosition(O),f.uFronts.value.set(O.z-250+810*(2*m-L[0]),O.z-250+810*(2*m-L[1]),O.z-250+810*(2*m-L[2])),f.uDraw.value=_(.2,.3,m)}const K=f.uHand.value,W=(m,j,D)=>le(m,j,D,K);return{object:l,style:a,radius:62,height:62,center:W(10,6,20),ground:!1,groundY:0,anchors:{place:new d.Vector3(0,-10,250),flyThrough:[new d.Vector3(0,10,-250),new d.Vector3(0,10,-60),new d.Vector3(0,10,0),new d.Vector3(0,10,70)],threshold:new d.Vector3(0,10,0),lady:W(B.p,B.q,b.top*.5),ladyTop:W(B.p,B.q,b.top),curtainEnd:W(-9,9,15),blindHem:W(10.5,-1.5,25),bayPosts:[W(o,0,0),W(o+45,0,0)],wallPosts:h.posts.map(m=>W(m,0,0)),wallEnds:[W(h.posts[0]-16,0,0),W(h.posts[6]+16,0,0)],viewpoints:[new d.Vector3(0,10,-250),new d.Vector3(0,10,-75),new d.Vector3(0,10,-12)]},heightAt:b.heightAt,setProgress(m){T=m,G(m)},update(m,j,D){f.uTime.value=j,n.renderer&&n.renderer.getDrawingBufferSize&&(n.renderer.getDrawingBufferSize(k),k.x>0&&f.uPx.value.copy(k)),T<0&&G(.12+.22*(j/16%1))},dispose(){}}}export{ie as PALETTE,ae as SHEAR,ee as STYLE_GLSL,Y as addBar,ve as addBlind,xe as addCurtain,re as addHairAndFolds,ge as addRobeHeap,me as addRobeHeapAsync,se as bandsFor,be as buildHero,he as contourMaterial,ue as createStyle,de as flakeMaterial,Z as makeAcc,pe as makeLines,le as shearPoint};
