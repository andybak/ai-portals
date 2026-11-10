import*as l from"three";import{clamp as pe,lerp as D,smoothstep as de}from"../kit/core.js";const Ut=["#3A2A20","#C8A46A","#8B8277","#FFE6A8","#8A7A50","#E8DBBE","#3FC4BE"],ye=70,Te=-60,Pe=4.7,no=1.8,Re=2.6,Gt=[[6,24,85],[6.5,24,55],[9,24,25],[9.5,26,-5],[9.5,30,-35],[9.5,34,-65],[9.5,32.5,-125],[9.5,31,-190],[9.5,31.5,-250],[8,33,-300],[0,34,-345],[-7.5,34,-374],[-9.5,34,-392],[-9.5,34,-420],[-9.5,34,-446]],Et=[[6,42,100],[4.3,42.6,25],[2.2,52.6,-65],[-.7,49.6,-190],[-4.3,52.6,-345],[-6,52,-420]],kt=-446,je=`
uniform float uTime;
uniform vec3 uSunDir;
uniform vec3 uCoinCol;
uniform vec4 uRoof;
uniform vec3 uFillUp;
uniform vec3 uFillDown;
uniform vec3 uFillPort;
uniform vec3 uFillStar;
uniform float uWetAll;
uniform vec3 uGlaze;
uniform vec3 uEmber;
uniform vec3 uForm;
uniform vec4 uThinA;
uniform vec4 uThinB;
vec3 hifHash3(vec2 c) {
  vec3 p = fract(vec3(c.xyx) * vec3(0.1031, 0.1030, 0.0973) + 0.031);
  p += dot(p, p.yzx + 33.33);
  return fract((p.xxy + p.yzz) * p.zyx);
}
// pinhole of roof cell c: xy = centre in cell units (it sways), z = hole radius in metres, w = open (0..1, winks)
vec4 hifHole(vec2 c) {
  vec3 h = hifHash3(c);
  vec3 g = hifHash3(c + 71.7);
  float ph = g.x * 6.2832;
  // many small holes and a few big ones (the big ones sit nearer the middle of their cell and stir less)
  float big = fract(h.z * 17.31 + g.x * 5.77);
  big = big * big * big;
  float keep = 1. - 0.6 * big;
  vec2 ctr = c + 0.5 + (h.xy - 0.5) * 0.5 * keep
    + 0.3 * vec2(sin(uTime * (0.35 + 0.3 * g.y) + ph), cos(uTime * (0.27 + 0.25 * g.z) + ph * 1.7)) * (0.4 + 0.6 * g.y) * keep;
  float wink = g.z < 0.143 ? smoothstep(-0.25, 0.25, sin(uTime * (0.5 + g.x) + ph * 3.)) : 1.;
  // the thatch is denser in some places and thinner in others: the coins come in drifts
  float drift = 0.5 + 0.5 * sin(c.x * 0.37 + 1.9 * sin(c.y * 0.151 + 0.7)) * sin(c.y * 0.233 + 1.6 * sin(c.x * 0.117 + 2.1));
  float share = uRoof.w * mix(0.3, 1.75, drift * drift * (3. - 2. * drift));
  // two places where the thatch has worn thin (cell x, cell y, radius in cells, how much thinner): there nearly every
  // cell has its pinhole, so the coins and their pencils of light stand in a dense cluster
  vec2 dA = (c - uThinA.xy) / max(uThinA.z, 0.5), dB = (c - uThinB.xy) / max(uThinB.z, 0.5);
  share += uThinA.w * exp(-dot(dA, dA)) + uThinB.w * exp(-dot(dB, dB));
  return vec4(ctr, mix(0.07, 1.12, big), step(h.z, share) * wink);
}
// soft disc of sun from every roof pinhole whose ray passes through p (world space)
float hifCoin(vec3 p) {
  float sgn = p.x < 0. ? -1. : 1.;
  float den = max(uSunDir.y + uRoof.y * uSunDir.x * sgn, 0.25);
  float t = max((uRoof.x - uRoof.y * abs(p.x) - p.y) / den, 0.);
  vec3 q = p + uSunDir * t;
  float cell = max(uRoof.z, 0.1);
  vec2 uv = vec2(q.x * 1.25, q.z) / cell;
  vec2 base = floor(uv - 0.5);
  float grow = 0.0027 * t;
  float acc = 0.;
  for (int j = 0; j < 2; j++) {
    for (int i = 0; i < 2; i++) {
      vec4 hole = hifHole(base + vec2(float(i), float(j)));
      float r = min(hole.z + grow, 1.5) / cell;
      float d = length(uv - hole.xy);
      acc = max(acc, hole.w * (1. - smoothstep(r * 0.62, r * 1.08, d)));
    }
  }
  return acc;
}
// Form (uForm): nothing but the roof decides what is lit, so a face that looks up at it is the lit one; a face turned
// from the roof falls off (uForm.z); a timber's fore and aft flanks, which look only at the next timber, fall further
// into warm brown shade (uForm.x); the face that looks in at the nave takes the fills in full (uForm.y).
// hifFormK is the grey part of that, for cloth and mats that hang square to the nave and must not go dark.
float hifFormK(vec3 n) {
  float ay = min(abs(n.y), 1.);
  return (1. - uForm.z * (1. - ay * ay)) * (1. - 0.9 * uForm.x * min(n.z * n.z, 1.) * (1. - 0.6 * ay));
}
// the shade: dim brown from the thatch above, sand bounce from below, green from port, turquoise from starboard forward
vec3 hifShade(vec3 n, vec3 p) {
  float up = n.y * 0.5 + 0.5;
  vec3 c = mix(uFillDown, uFillUp, up * up * (3. - 2. * up));
  c += uFillPort * max(-n.x, 0.) * (0.55 + 0.45 * max(-n.x, 0.));
  float fwd = smoothstep(-60., -300., p.z);
  c += uFillStar * max(n.x, 0.) * (0.3 + 0.7 * fwd);
  float ay = min(abs(n.y), 1.);
  float inb = max(-n.x * (p.x < 0. ? -1. : 1.), 0.) * (1. - smoothstep(34., 50., abs(p.x)));
  c *= (1. - uForm.z * (1. - ay * ay)) * (vec3(1.) - uForm.x * min(n.z * n.z, 1.) * (1. - 0.6 * ay) * vec3(0.8, 0.9, 1.0)) * (1. + uForm.y * min(inb, 1.));
  // the bending fire astern: a low orange glow on whatever stands near the trough, strongest from below
  vec3 de = p - vec3(6., 0.6, clamp(p.z, 31., 73.));
  float ed = dot(de, de);
  c += uEmber * (0.35 + 0.65 * max(-dot(n, de) / sqrt(ed + 0.01), 0.)) / (1. + 0.008 * ed) * (1. - 0.85 * smoothstep(9., 42., p.y));
  return c;
}
`,St=`
#include <fog_pars_vertex>
attribute vec3 aCol;
uniform float uBend;
uniform float uBendOn;
uniform float uBelly;
varying vec3 vCol;
varying vec2 vUv;
varying vec3 vWp;
varying vec3 vWn;
varying vec3 vVp;
void main() {
  vec3 pos = position;
  vec3 nrm = normal;
  if (uBendOn > 0.5) {
    // the plank: local x runs along it (-20..20, +x forward), y through its thickness.
    // The forward end stands 4 m proud along y by a parabola that uBend draws in.
    float s = clamp((pos.x + 20.) / 40., 0., 1.);
    float k = (1. - uBend) * 4.0 * s * s;
    pos.y += k - uBelly * 4. * s * (1. - s);
    nrm.x -= ((1. - uBend) * 0.2 * s - uBelly * 0.1 * (1. - 2. * s)) * nrm.y;
    nrm = normalize(nrm);
  }
  #ifdef USE_INSTANCING
    vec4 wp = modelMatrix * instanceMatrix * vec4(pos, 1.);
    vWn = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * nrm);
  #else
    vec4 wp = modelMatrix * vec4(pos, 1.);
    vWn = normalize(mat3(modelMatrix) * nrm);
  #endif
  vCol = aCol;
  vUv = uv;
  vWp = wp.xyz;
  vec4 mvPosition = viewMatrix * wp;
  vVp = mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,Nt=`
#include <fog_pars_fragment>
${je}
uniform float uWet;
uniform float uScallop;
uniform float uSlide;
uniform float uWrap;
uniform float uNode;
uniform float uGrainK;
uniform float uTwist;
varying vec3 vCol;
varying vec2 vUv;
varying vec3 vWp;
varying vec3 vWn;
varying vec3 vVp;
float wHash(vec2 p) { p = fract(p * vec2(0.1031, 0.1030) + 0.017); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.y); }
float wNoise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(wHash(i), wHash(i + vec2(1., 0.)), f.x), mix(wHash(i + vec2(0., 1.)), wHash(i + vec2(1., 1.)), f.x), f.y);
}
// adze scallops: shallow dishes in staggered rows along the timber; returns height, y = cell tone
vec2 wScallop(vec2 uv) {
  vec2 g = uv * vec2(0.62, 1.9);
  g += vec2(wNoise(uv * 0.83 + 3.1), wNoise(uv * 0.71 + 17.3)) * vec2(0.9, 0.7);
  float row = floor(g.y);
  g.x += wHash(vec2(row, 3.7)) * 3.1;
  vec2 c = floor(g), f = fract(g) - 0.5;
  float tone = wHash(c + 11.3);
  f += (vec2(tone, wHash(c + 5.1)) - 0.5) * 0.34;
  float d = dot(f, f) * 4.;
  return vec2(clamp(d, 0., 1.4), tone);
}
void main() {
  vec3 n = normalize(vWn);
  if (!gl_FrontFacing) n = -n;
  float dist = length(vVp);
  // bump from the scallops and the grain, faded where they would alias
  float fine = 1. - smoothstep(60., 190., dist);
  vec2 sc = wScallop(vUv);
  float grain = wNoise(vec2(vUv.x * 0.22, vUv.y * 6.5)) * 0.6 + wNoise(vec2(vUv.x * 0.9, vUv.y * 19.)) * 0.4;
  grain = mix(0.5, grain, uGrainK);                                      // pegs and ropes: plain, no figure
  // within a few metres of the eye: the fibre of the wood and the wandering lines of its growth, sharp, and the
  // adze's dishes cut deeper (not on bamboo, whose uv runs the other way)
  float nearK = (1. - smoothstep(9., 36., dist)) * (1. - uNode);
  float fib = wNoise(vec2(vUv.x * 1.9, vUv.y * 47.)) * 0.65 + wNoise(vec2(vUv.x * 5.3 + 3., vUv.y * 120.)) * 0.35;
  float ringL = abs(fract(vUv.y * 2.9 + 1.1 * wNoise(vec2(vUv.x * 0.31, vUv.y * 1.7 + 5.))) - 0.5);
  float ringK = smoothstep(0.41, 0.5, ringL);
  float hgt = (sc.x * 0.042 * uScallop * (1. + 1.4 * nearK) + grain * 0.035 * uGrainK + (fib * 0.014 - ringK * 0.012) * nearK * uGrainK) * fine;
  // sawn and adzed ends (their uv is the section's own, 1000 along): no scallops
  float endF = step(900., vUv.x);
  hgt *= 1. - endF;
  vec3 dpx = dFdx(vVp), dpy = dFdy(vVp);
  float hx = dFdx(hgt), hy = dFdy(hgt);
  vec3 vn = normalize(mat3(viewMatrix) * n);
  vec3 r1 = cross(dpy, vn), r2 = cross(vn, dpx);
  float det = dot(dpx, r1);
  vec3 grad = sign(det) * (hx * r1 + hy * r2);
  vec3 bn = abs(det) * vn - grad;
  float bl = length(bn);
  vn = bl > 1e-6 ? bn / bl : vn;
  n = normalize(mix(n, normalize((vec4(vn, 0.) * viewMatrix).xyz + n * 1e-4), fine));

  float wet = max(uWet, uWetAll);
  vec3 alb = vCol * (0.78 + 0.34 * grain) * (0.97 + 0.06 * sc.y * uScallop);
  alb *= 1. - 0.1 * uScallop * fine * smoothstep(0.8, 1.3, sc.x);       // dark ridge between scallops
  alb *= 1. + nearK * uGrainK * (0.28 * (fib - 0.5) - 0.13 * ringK);
  alb *= 1. + nearK * uScallop * (0.16 * (sc.y - 0.5) - 0.2 * smoothstep(0.84, 1., sc.x) * (1. - smoothstep(1., 1.28, sc.x)));
  alb *= mix(1., 0.86 + 0.28 * wNoise(vUv * 0.07 + vWp.zy * 0.013), 1.);  // broad staining
  alb *= 1. - uWrap * 0.45 * smoothstep(0.35, 0.5, abs(fract(vUv.y * 5.5) - 0.5));
  // rope: three strands laid up, a dark groove between them (uTwist = turns of the lay per unit of v; 0 for timber)
  alb *= 1. - min(uTwist, 1.) * 0.5 * smoothstep(0.3, 0.5, abs(fract(vUv.y * uTwist + vUv.x * 0.9) - 0.5));
  // bamboo: a thin dark ring at each node with a pale shoulder, and every internode its own tone and streaks
  float nd = abs(fract(vUv.y * 5.5) - 0.5);
  float ring = smoothstep(0.455, 0.49, nd);
  alb *= 1. + uNode * (0.3 * smoothstep(0.34, 0.45, nd) * (1. - ring) - 0.6 * ring);
  alb *= 1. + uNode * (0.5 * wHash(vec2(floor(vUv.y * 5.5 + 0.5), 3.1)) - 0.25 + 0.3 * (wNoise(vec2(vUv.x * 4.5, vUv.y * 0.7)) - 0.5));
  // end grain: growth rings round a heart that lies off the middle of the section, a few drying checks across them,
  // the saw's or the adze's fine tooth
  vec2 eu = vec2(vUv.x - 1000., vUv.y);
  float eh = fract(vCol.r * 91.7 + vCol.g * 57.3);
  vec2 ed = eu - (vec2(eh, fract(eh * 7.31)) - 0.5) * 3.4;
  float er = length(ed) * 1.7 + 0.5 * wNoise(eu * 1.4 + eh * 31.);
  float ringE = smoothstep(0.2, 0.5, abs(fract(er) - 0.5));
  float checkE = smoothstep(0.74, 0.88, wNoise(vec2(atan(ed.y, ed.x + 1e-3) * 3.5, er * 0.2 + eh * 9.)));
  float ringFar = 1. - smoothstep(40., 110., dist);
  vec3 endAlb = vCol * mix(0.84, 0.64 + 0.36 * ringE, ringFar) * (1. - 0.5 * checkE * ringFar) * (0.88 + 0.24 * wNoise(eu * 5.));
  alb = mix(alb, endAlb, endF);
  alb = mix(alb, alb * alb * 1.15 + alb * 0.1, wet * 0.9);

  vec3 cp = vWp + vec3(0., 0., uSlide);
  float coin = hifCoin(cp);
  float ndl = max(dot(n, uSunDir), 0.);
  float lit = coin * smoothstep(-0.28, -0.08, dot(normalize(vWn), uSunDir));
  // a grazing ray still makes a bright streak on a flank, and sunlit timber glows a little from within
  // (on dark ironwood the coin is a blazing oval: the black timber gives back more of it as a glow than as colour)
  float darkK = 1. - smoothstep(0.035, 0.2, max(vCol.r, max(vCol.g, vCol.b)));
  vec3 col = alb * (hifShade(n, vWp) + uCoinCol * lit * (0.52 + 0.58 * ndl)) + uCoinCol * lit * vec3(0.036, 0.021, 0.008) * (1. + 1.3 * darkK);
  // and its adzed faces keep a dull polish: each dish that tips toward the roof gives back a little of its light
  vec3 vS = normalize(cameraPosition - vWp);
  float sh8 = max(dot(n, normalize(vS + vec3(0., 1., 0.))), 0.);
  sh8 *= sh8; sh8 *= sh8; sh8 *= sh8;
  col += darkK * (uFillUp + uFillDown) * 0.03 * sh8 * fine * (1. - endF);
  // glaze: light that does not take the timber's own colour (moonlit indigo at night; zero by day)
  col += uGlaze * ((0.35 + 0.65 * (n.y * 0.5 + 0.5)) * (0.7 + 0.5 * grain) + coin * 5. * (0.25 + 0.75 * ndl));
  // wet sheen: the roof and its points of day mirrored in the film of water
  vec3 v = normalize(cameraPosition - vWp);
  float fres = 1. - max(dot(n, v), 0.);
  fres = fres * fres * fres;
  vec3 hv = normalize(v + uSunDir + vec3(0., 1e-4, 0.));
  float spec = max(dot(n, hv), 0.);
  spec = spec * spec; spec = spec * spec; spec = spec * spec; spec = spec * spec;
  col += wet * (uFillUp * 0.55 * fres * (0.4 + 0.6 * max(n.y, 0.)) + uCoinCol * coin * spec * 0.7);
  // lagoon light: a cool rim on whatever stands between the eye and the starboard side, forward of amidships
  float fwdR = smoothstep(-150., -300., vWp.z) * (1. - smoothstep(-410., -450., vWp.z)) * smoothstep(8., 26., vWp.x) * smoothstep(0.1, 0.6, -v.x);
  float fr = 1. - abs(dot(n, v));
  col += uFillStar * (0.25 + alb * 2.5) * fwdR * fr * fr * 1.7;
  gl_FragColor = vec4(max(col, vec3(0.)), 1.);
  #include <fog_fragment>
}
`,Bt=`
uniform float uFaceY;
uniform vec4 uBerth;
// The glints that lie on the face while the board stands on edge at the berth: one to each 2.2 m of its length, a
// few cells left dark, each a small round image of a pinhole that drifts a hand's breadth and now and then winks.
// s = metres along the berth (uBerth = its start (x, z) and heading). Returns the glint of that cell: x = its place
// along, y = its height above the face's middle line, z = its radius, w = lit (0..1).
vec4 hifOwnSpot(float s) {
  float i = floor(s / 2.2);
  vec2 h = fract(sin(vec2(i * 12.9898 + 3.1, i * 78.233 + 1.7)) * 43758.5453);
  float h3 = fract(h.x * 7.3 + h.y * 3.1);
  float cs = (i + 0.5 + (h.x - 0.5) * 0.45) * 2.2 + 0.14 * sin(uTime * (0.3 + 0.3 * h.y) + i * 2.1);
  float cy = (h.y - 0.5) * 1.5 + 0.07 * sin(uTime * (0.24 + 0.3 * h.x) + i * 1.3);
  float wink = h3 > 0.86 ? smoothstep(-0.25, 0.25, sin(uTime * (0.5 + h.x) + i * 3.)) : 1.;
  float sz = fract(h3 * 5.7);
  return vec4(cs, cy, 0.055 + 0.21 * sz * sz, step(0.28, h3) * wink * (0.5 + 0.7 * fract(h3 * 9.1)));
}
// one glint, d from its centre, radius r, aa = a pixel's width there: x = its crisp disc, y = the ring of standing
// water round it (out to 2.3 r), z = 1 at its heart falling to 0 at its edge
vec3 hifSpot(float d, float r, float aa, float on) {
  float e = max(aa, r * 0.07);
  return on * vec3(1. - smoothstep(r - e, r + e, d), 1. - smoothstep(r * 1.25, r * 2.3, d), clamp(1. - d / max(r, 1e-4), 0., 1.));
}
// the roof's pinholes as glints on the board: the same holes, places, sway and winks as hifCoin, drawn tight
vec3 hifRoofSpots(vec3 p, float aa) {
  float sgn = p.x < 0. ? -1. : 1.;
  float den = max(uSunDir.y + uRoof.y * uSunDir.x * sgn, 0.25);
  float t = max((uRoof.x - uRoof.y * abs(p.x) - p.y) / den, 0.);
  vec3 q = p + uSunDir * t;
  float cell = max(uRoof.z, 0.1);
  vec2 uv = vec2(q.x * 1.25, q.z) / cell;
  vec2 base = floor(uv - 0.5);
  float grow = 0.0027 * t;
  vec3 acc = vec3(0.);
  for (int j = 0; j < 2; j++) {
    for (int i = 0; i < 2; i++) {
      vec2 cc = base + vec2(float(i), float(j));
      vec4 hole = hifHole(cc);
      // (no two glints alike: each pinhole's image has its own size and strength)
      vec3 hv = hifHash3(cc + 5.3);
      float r = clamp(0.5 * (hole.z + grow) * (0.4 + 1.5 * hv.x * hv.x), 0.06, 0.46) / cell;
      acc = max(acc, hifSpot(length(uv - hole.xy), r, aa / cell, hole.w * (0.45 + 0.75 * hv.y)));
    }
  }
  return acc;
}
// On the upright face at the berth a pinhole's ray would only graze: there the face keeps its own glints (hifOwnSpot).
// nh = the face's level normal, k = how upright, aa = a pixel's width on the face in metres.
vec3 hifPlankSpots(vec3 p, vec3 nh, float k, float aa) {
  vec3 q = p + nh * ((p.y - uFaceY) * 0.9 * k);
  vec3 c = max(hifRoofSpots(q, aa), 0.9 * hifRoofSpots(q + vec3(1.7, 0., 2.3), aa));
  float s = dot(p.xz - uBerth.xy, uBerth.zw);
  vec4 o = hifOwnSpot(s);
  vec3 own = hifSpot(length(vec2(s - o.x, p.y - uFaceY - o.y)), o.z, aa, o.w);
  return mix(c, own, k);
}
`,qt=`
#include <fog_pars_fragment>
${je}
${Bt}
uniform vec3 uSheen;
uniform float uGloss;
uniform vec3 uEdge;
varying vec3 vCol;
varying vec2 vUv;
varying vec3 vWp;
varying vec3 vWn;
varying vec3 vVp;
float wHash(vec2 p) { p = fract(p * vec2(0.1031, 0.1030) + 0.017); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.y); }
float wNoise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(wHash(i), wHash(i + vec2(1., 0.)), f.x), mix(wHash(i + vec2(0., 1.)), wHash(i + vec2(1., 1.)), f.x), f.y);
}
void main() {
  vec3 n = normalize(vWn);
  if (!gl_FrontFacing) n = -n;
  vec3 v = normalize(cameraPosition - vWp);
  float px = vUv.x, pv = vUv.y;
  float edge = max(smoothstep(2.3, 2.42, pv) * (1. - smoothstep(2.86, 2.96, pv)), max(smoothstep(5.12, 5.24, pv), 1. - smoothstep(0.05, 0.15, pv)));
  // (the two sawn ends are flagged: their uv is the section's own, 1000 along)
  float capK = step(900., px);
  vec2 eu = vec2(px - 1000., pv);
  float endK = smoothstep(19.25, 19.5, abs(px - 20.)) * (1. - capK);
  float pale = max(edge * 0.8, endK * 0.4) * (1. - capK);
  float grain = wNoise(vec2(px * 0.3, pv * 7.)) * 0.6 + wNoise(vec2(px * 1.1, pv * 9.)) * 0.4;
  vec3 alb = vCol * (0.75 + 0.5 * grain);
  // close to the eye: the long straight grain of ironwood, and a dark line at each arris so the board's section reads
  float nearP = 1. - smoothstep(10., 36., length(vVp));
  float lg = wNoise(vec2(px * 0.33, pv * 27.)) * 0.6 + wNoise(vec2(px * 1.2, pv * 63.)) * 0.4;
  alb *= 1. + nearP * 1.1 * (lg - 0.45);
  alb = alb * alb * 2.4 + alb * 0.3;                                    // soaked: darker and richer
  float arris = max(1. - smoothstep(0.02, 0.09, abs(pv - 0.12)), 1. - smoothstep(0.02, 0.09, abs(pv - 2.34))) * (1. - capK);
  // (the pale edges keep the saw's tooth: fine cross marks)
  alb = mix(alb, uEdge * (0.8 + 0.4 * grain) * (1. + 0.5 * nearP * (lg - 0.5)) * (0.86 + 0.28 * wNoise(vec2(px * 7.5, pv * 2.3))), pale);
  // the sawn ends: dark ironwood end grain, soaked like the faces; growth rings round a heart that lies off the board,
  // a few checks across them, the saw's fine tooth, and a darker wet rim where the water stands along the arrises
  vec2 eg = vec2(eu.x * 1.3 - 2.6, eu.y * 0.34 + 0.5);
  float er = length(eg) * 3.4 + 0.45 * wNoise(eu * 2.1);
  float ringE = smoothstep(0.25, 0.5, abs(fract(er) - 0.5));
  float checkE = smoothstep(0.8, 0.9, wNoise(vec2(atan(eg.y, eg.x + 1e-3) * 9., er * 0.15)));
  float rimE = max(smoothstep(0.5, 0.72, abs(eu.x)), smoothstep(3.25, 3.52, abs(eu.y)));
  vec3 endAlb = (alb * 2.6 + vec3(0.05, 0.022, 0.012)) * (0.5 + 0.5 * ringE) * (1. - 0.5 * checkE) * (0.85 + 0.3 * wNoise(vec2(eu.x * 9., eu.y * 40.))) * (1. - 0.5 * rimE);
  alb = mix(alb, endAlb, capK);
  alb *= 1. - 0.55 * arris * nearP;
  float upright = 1. - smoothstep(0.3, 0.75, abs(n.y));
  vec3 nh = vec3(n.x, 0., n.z);
  float dist = length(vVp);
  // (every screen-space derivative this shader needs is taken here, before any loop)
  float aa = 0.75 * length(fwidth(vWp));
  // the film mirrors the shed. Up: the thatch and its points of day. Down: the sand and the coins that lie on it.
  vec3 rr = reflect(-v, n);
  rr.xz += (vec2(wNoise(vec2(px * 0.8, pv * 5.)), wNoise(vec2(px * 0.8 + 7.3, pv * 5. + 3.1))) - 0.5) * 0.012;
  float cellM = max(uRoof.z, 0.1);
  float dP = max(rr.y + uRoof.y * rr.x, 0.04), dM = max(rr.y - uRoof.y * rr.x, 0.04);
  float tP = (uRoof.x - uRoof.y * vWp.x - vWp.y) / dP, tM = (uRoof.x + uRoof.y * vWp.x - vWp.y) / dM;
  float tR = clamp(mix(tM, tP, step(0., vWp.x + rr.x * tP)), 0., 900.);
  vec3 qR = vWp + rr * tR;
  vec2 uvR = vec2(qR.x * 1.25, qR.z) / cellM;
  float aaR = clamp(length(fwidth(uvR)) * 1.1, 1e-4, 4.);
  vec2 bR = floor(uvR - 0.5);
  float accR = 0.;
  for (int j = 0; j < 2; j++) {
    for (int i = 0; i < 2; i++) {
      vec2 cR = bR + vec2(float(i), float(j));
      vec4 hole = hifHole(cR);
      // (no two of the mirrored points alike: half of them are lost in the grain, the rest differ in size and strength)
      vec3 hv = hifHash3(cR + 19.3);
      float r0 = (0.1 + 0.5 * hole.z) * (0.55 + 1.3 * hv.z) / cellM;
      float w = max(r0, aaR);
      accR = max(accR, hole.w * step(0.5, hv.x) * (0.2 + 1.7 * hv.y * hv.y) * (1. - smoothstep(w * 0.55, w * 1.15, length(uvR - hole.xy))) * min(1., (r0 * r0) / (w * w) * 2.5));
    }
  }
  accR *= smoothstep(0.06, 0.22, rr.y) * step(abs(qR.x), 96.) * step(-500., qR.z) * step(qR.z, 115.);
  float tG = clamp((vWp.y - 1.) / max(-rr.y, 0.05), 0., 400.);
  vec3 qG = vWp + rr * tG;
  float coinG = hifCoin(qG) * smoothstep(0.05, 0.2, -rr.y) * step(abs(qG.x), 86.) * exp(-tG * 0.006);
  // a coin of sun on the board: a tight glint, the standing water dark round it
  vec3 spot = hifPlankSpots(vWp, nh, upright, aa);
  float nds = dot(n, uSunDir);
  float ndl = max(nds, 0.);
  float faceK = mix(smoothstep(-0.28, -0.08, nds), 1., upright);
  float lit = spot.x * faceK;
  float rimK = spot.y * (1. - spot.x) * faceK;
  // the timber's own answer to a coin, eased where it is pale so the long edges never burn out
  vec3 cl = uCoinCol * lit * (0.42 + 0.58 * ndl);
  cl /= 1. + 0.5 * pale * max(cl.r, max(cl.g, cl.b));
  vec3 col = alb * (hifShade(n, vWp) * (0.55 + 0.45 * pale) + cl);
  col += uGlaze * 0.5 * ((0.35 + 0.65 * (n.y * 0.5 + 0.5)) + lit * 3. * (0.25 + 0.75 * ndl));
  // the film: a cool sheen at a glancing angle, broad slow streaks in it; close to the eye it breaks into thin bright
  // lines where the water stands on the ridges of the grain
  float f = 1. - max(dot(n, v), 0.);
  float f2 = f * f;
  float f5 = f2 * f2 * f;
  float fres = 0.035 + 0.965 * f5;
  float streak = wNoise(vec2(px * 0.055 - uTime * 0.06, pv * 0.9 + 3.)) * 0.65 + wNoise(vec2(px * 0.19 + uTime * 0.04, pv * 2.1 + 9.)) * 0.35;
  streak = smoothstep(0.2, 0.8, streak);
  float wetF = 1. - pale;
  float lines = smoothstep(0.38, 0.9, wNoise(vec2(px * 0.11 + 11., pv * 15.))) * (0.6 + 0.4 * smoothstep(0.3, 0.75, wNoise(vec2(px * 0.5 + 3., pv * 37.))));
  float lineK = mix(1., 0.5 + 1.35 * lines, 1. - smoothstep(12., 40., dist)) * (1. - capK);
  // (the highlights take the colour of the coins: warm on the black, never white scratches)
  vec3 warmS = uCoinCol / max(max(uCoinCol.r, uCoinCol.g), max(uCoinCol.b, 1e-3));
  vec3 sheenC = mix(uSheen, warmS * vec3(1., 0.9, 0.7) * dot(uSheen, vec3(0.4, 0.4, 0.2)) * 1.25, 0.6);
  col += sheenC * min(fres, 0.38) * (0.15 + 1.1 * streak * streak) * wetF * lineK * (1. - 0.6 * upright);
  // a few long warm reflections of the lit shed lie along the wet face and slide as the eye moves
  float longR = smoothstep(0.58, 0.84, wNoise(vec2(px * 0.04 + rr.x * 2.5 + 3.7, pv * 1.7 + 1.3))) * smoothstep(0.3, 0.7, wNoise(vec2(px * 0.21 - uTime * 0.05, pv * 0.6 + 7.)));
  col += warmS * vec3(1.0, 0.74, 0.42) * (0.045 + 0.3 * f2) * longR * wetF * (1. - capK) * (0.45 + 0.55 * lineK) * (1. + 1.6 * upright);
  // on edge it takes the shed's own warm shade: a soft glow in the wet, fuller toward its upper edge, broken only
  // by those few long reflections (never a field of fine pale lines)
  float hy = clamp((vWp.y - uFaceY) / 2.4 + 0.5, 0., 1.);
  col += uFillDown * vec3(1.0, 0.78, 0.5) * 0.085 * upright * wetF * (0.25 + 1.5 * hy * hy) * (0.45 + 0.55 * streak) * (0.7 + 0.3 * lineK);
  // seen from above (the hoist): the wet face gives back the pale light of the open sides, streaked along the grain
  col += uFillUp * 0.06 * max(n.y, 0.) * wetF * (0.35 + 1.1 * streak) * (0.4 + 0.6 * lineK);
  // the mirrored points of day and coins: small, sharp, sliding over the face as the eye moves
  // (the sand's coins come back dim and warm, broken into slivers by the grain: never as a second set of discs)
  col += wetF * (1. - capK) * uCoinCol * (accR * (0.15 + 0.5 * f5) + coinG * vec3(0.36, 0.3, 0.2) * (0.05 + 0.22 * f5) * (0.2 + 2.2 * lines)) * (0.75 + 0.5 * streak);
  // the ring of standing water round a glint drinks the sheen; then the glint itself, hot at its heart
  col *= 1. - 0.85 * rimK * wetF;
  vec3 warm = uCoinCol / max(max(uCoinCol.r, uCoinCol.g), max(uCoinCol.b, 1e-3));
  col += warm * vec3(1., 0.86, 0.6) * lit * uGloss * (0.66 + 1.4 * spot.z * spot.z) * (0.55 + 0.45 * wetF) * (0.8 + 0.4 * lg);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}
`;function ce(){return{pos:[],nrm:[],col:[],uv:[],idx:[],n:0}}function ve(t){const e=new l.BufferGeometry;return e.setAttribute("position",new l.Float32BufferAttribute(t.pos,3)),e.setAttribute("normal",new l.Float32BufferAttribute(t.nrm,3)),e.setAttribute("aCol",new l.Float32BufferAttribute(t.col,3)),e.setAttribute("uv",new l.Float32BufferAttribute(t.uv,2)),e.setIndex(t.n>65535?new l.Uint32BufferAttribute(t.idx,1):new l.Uint16BufferAttribute(t.idx,1)),e.computeBoundingSphere(),e.computeBoundingBox(),e}function Ae(t,e,o){const u=[[t-o,-e],[t,-e+o],[t,e-o],[t-o,e],[-t+o,e],[-t,e-o],[-t,-e+o],[-t+o,-e]],g=[];let i=0;for(let d=0;d<8;d++){const E=u[d],F=u[(d+1)%8],P=F[0]-E[0],_=F[1]-E[1],x=Math.hypot(P,_)||1;g.push({a:E[0],b:E[1],na:_/x,nb:-P/x,v:i},{a:F[0],b:F[1],na:_/x,nb:-P/x,v:i+x}),i+=x}return g.pairs=!0,g}function it(t,e,o=1){const u=[];for(let g=0;g<=e;g++){const i=g/e*Math.PI*2;u.push({a:Math.cos(i)*t,b:Math.sin(i)*t*o,na:Math.cos(i),nb:Math.sin(i),v:i*t})}return u.pairs=!1,u}const Z=new l.Vector3,so=new l.Vector3,ro=new l.Vector3,Qe=new l.Vector3;function Ze(t,e){const o=[],u=[];for(let g=0;g<t.length;g++){Z.copy(t[Math.min(g+1,t.length-1)]).sub(t[Math.max(g-1,0)]).normalize();const i=new l.Vector3().copy(e).addScaledVector(Z,-e.dot(Z));i.lengthSq()<1e-6&&i.set(1,0,0).addScaledVector(Z,-Z.x),i.normalize();const d=new l.Vector3().crossVectors(i,Z).normalize();o.push(d),u.push(i)}return{A:o,B:u}}function me(t,e,o,u,g,i={}){const d=g.length,E=t.n;let F=i.u0||0;const P=[0,0,0];for(let z=0;z<e.length;z++){z>0&&(F+=e[z].distanceTo(e[z-1]));const b=i.sa?i.sa(z):1,A=i.sb?i.sb(z):1,c=e[z],h=o[z],p=u[z],n=typeof i.nT=="function"?i.nT(z):i.nT||0;n&&Z.crossVectors(h,p);for(let m=0;m<d;m++){const B=g[m];t.pos.push(c.x+h.x*B.a*b+p.x*B.b*A,c.y+h.y*B.a*b+p.y*B.b*A,c.z+h.z*B.a*b+p.z*B.b*A);let C=h.x*B.na+p.x*B.nb,a=h.y*B.na+p.y*B.nb,f=h.z*B.na+p.z*B.nb;if(n){C+=Z.x*n,a+=Z.y*n,f+=Z.z*n;const w=Math.hypot(C,a,f)||1;C/=w,a/=w,f/=w}t.nrm.push(C,a,f);const r=typeof i.col=="function"?i.col(z,m,P):i.col;t.col.push(r[0],r[1],r[2]),t.uv.push(F,B.v+(i.v0||0))}}const _=g.pairs?2:1,x=g.pairs?d:d-1;for(let z=0;z<e.length-1;z++)for(let b=0;b<x;b+=_){const A=E+z*d+b,c=A+1,h=A+d,p=h+1;t.idx.push(A,c,h,c,p,h)}if(t.n+=e.length*d,i.caps!==!1)for(let z=i.caps==="end"?1:0;z<2;z++){const b=z?e.length-1:0,A=e[b],c=o[b],h=u[b],p=i.sa?i.sa(b):1,n=i.sb?i.sb(b):1;Z.crossVectors(c,h).multiplyScalar(z?1:-1);const m=i.capCol||(typeof i.col=="function"?i.col(b,0,P):i.col),B=i.capCol?1:i.capTone??1.25,C=i.capFlag?1e3:0,a=t.n;let f=0;for(let r=0;r<d;r+=_){const w=g[r];t.pos.push(A.x+c.x*w.a*p+h.x*w.b*n,A.y+c.y*w.a*p+h.y*w.b*n,A.z+c.z*w.a*p+h.z*w.b*n),t.nrm.push(Z.x,Z.y,Z.z),t.col.push(m[0]*B,m[1]*B,m[2]*B),t.uv.push(w.a*p*3+C,w.b*n*3),f++}for(let r=1;r<f-1;r++)z?t.idx.push(a,a+r,a+r+1):t.idx.push(a,a+r+1,a+r);t.n+=f}}function De(t,e,o,u,g,i,d,E,F={}){const P=[e,o],_=Ze(P,E||Qe.set(0,1,0));me(t,P,_.A,_.B,Ae(u,g,i),{col:d,u0:F.u0||0,caps:F.caps,capTone:F.capTone})}function ae(t,e,o,u,g,i={}){const d=Ze(e,i.up||Qe.set(.13,1,.21));me(t,e,d.A,d.B,it(o,u),{col:g,sa:i.taper,sb:i.taper,u0:i.u0||0,caps:i.caps,nT:i.nT,capTone:i.capTone,capFlag:i.capFlag})}const s=(t,e,o)=>new l.Vector3(t,e,o);function ct(t,e,o,u,g,i,d,E,F=4,P=0){const _=Math.min(u,g)*.34,x=[[u-_,-g],[u,-g+_],[u,g-_],[u-_,g],[-u+_,g],[-u,g-_],[-u,-g+_],[-u+_,-g],[u-_,-g]],z=x.map(([n,m])=>s(e.x+o.x*m,e.y+o.y*m,e.z+n)),b=[],A=[],c=z.length-1;for(let n=0;n<=c;n++){const m=n%c,[B,C]=x[m],a=Math.pow(Math.abs(B)/u,3)*Math.sign(B),f=Math.pow(Math.abs(C)/g,3)*Math.sign(C),r=s(o.x*f,o.y*f,a+o.z*f).normalize();Z.copy(z[(m+1)%c]).sub(z[(m+c-1)%c]).normalize(),b.push(r),A.push(new l.Vector3().crossVectors(Z,r).normalize())}const h=[],p=8;for(let n=0;n<=p;n++){const m=n/p*Math.PI*2;h.push({a:Math.cos(m),b:Math.sin(m),na:Math.cos(m)*.8+.2,nb:Math.sin(m)*.75,v:Math.sin(m)*i*.5*F})}h.pairs=!1,me(t,z,b,A,h,{sa:()=>d,sb:()=>i*.5,col:E,caps:!1,u0:P})}function At(t){const e=new l.Color(t);return[e.r,e.g,e.b]}const $=(t,e,o)=>[t[0]+(e[0]-t[0])*o,t[1]+(e[1]-t[1])*o,t[2]+(e[2]-t[2])*o],V=(t,e)=>[t[0]*e,t[1]*e,t[2]*e];function Ke(t,e={}){return new l.ShaderMaterial({vertexShader:St,fragmentShader:Nt,fog:!0,side:e.side??l.FrontSide,uniforms:{...l.UniformsUtils.clone(l.UniformsLib.fog),...t,uWet:{value:e.wet||0},uScallop:{value:e.scallop??1},uSlide:{value:0},uWrap:{value:e.wrap||0},uNode:{value:e.node||0},uGrainK:{value:e.grainK??1},uTwist:{value:e.twist||0},uBend:{value:1},uBelly:{value:0},uBendOn:{value:0}}})}const Ft=6.7;function ht(t){const e=t>-220?pe((t+220)/160,0,1.3):pe((-220-t)/165,0,1.3);return t>-220?37-17*Math.pow(e,2.1):37-20*Math.pow(e,2.1)}function tt(t){const e=t>-220?pe((t+220)/160,0,1.3):pe((-220-t)/165,0,1.3);return t>-220?64+12*e*e:64+14*e*e}function at(t,e=0,o=null){const u=t>-220?pe((t+220)/160,0,1):pe((-220-t)/165,0,1),g=ht(t)+Re*.5,i=2/D(2.7,1.45,u*u),d=tt(t)+e,E=D(-1.6,3.2,u),F=[],P=40,_=22;for(let x=0;x<=P;x++){const z=x/P*Math.PI*.5,b=g*Math.pow(Math.sin(z),i),A=Ft+(34-Ft)*(1-Math.pow(Math.cos(z),i));F.push([b,A])}for(let x=1;x<=_;x++){const z=x/_,b=34+(d-34)*z,A=(b-34)/(tt(t)-34);F.push([g+E*A*A,b])}if(o)for(let x=3;x<F.length;x++){const z=x/F.length;F[x][0]+=o.a*Math.sin(z*o.f+o.p)*Math.min(1,(x-3)/6)}return F}function Ie(t,e){const o=at(t,8);for(let u=o.length-1;u>0;u--)if((o[u-1][1]-e)*(o[u][1]-e)<=0&&o[u][1]!==o[u-1][1]){const g=(e-o[u-1][1])/(o[u][1]-o[u-1][1]),i=o[u][0]-o[u-1][0],d=o[u][1]-o[u-1][1],E=Math.hypot(i,d)||1;return D(o[u-1][0],o[u][0],g)-Re*.5*Math.abs(d/E)-Re*.5*0}return ht(t)}function ft(t,e,o,u,g,i,d){const E=[],F=e[e.length-1];let P=0;for(let _=0;_<=g;_++){const x=D(o,u,_/g)*F;for(;P<e.length-2&&e[P+1]<x;)P++;const z=pe((x-e[P])/Math.max(e[P+1]-e[P],1e-6),0,1);E.push(s(i*D(t[P][0],t[P+1][0],z),D(t[P][1],t[P+1][1],z),d))}return E}function Dt(t){const e=[0];for(let o=1;o<t.length;o++){const u=t[o][0]-t[o-1][0],g=t[o][1]-t[o-1][1];let i=0;if(o<t.length-1){const d=Math.atan2(g,u),E=Math.atan2(t[o+1][1]-t[o][1],t[o+1][0]-t[o][0]);i=Math.abs(E-d)}e.push(e[o-1]+Math.hypot(u,g)+9*i)}return e}const Vt=new l.Vector3(0,0,1);function Kt(t){const e=[],o=[];for(let u=0;u<t.length;u++)Z.copy(t[Math.min(u+1,t.length-1)]).sub(t[Math.max(u-1,0)]).normalize(),e.push(Vt),o.push(new l.Vector3().crossVectors(Z,Vt).normalize());return{A:e,B:o}}async function It(t){const{rng:e,C:o,group:u,mats:g}=t;t.headLash=ce();const i=5,d=[];for(let x=0;x<i;x++)d.push(ce());const E=Math.max(e.int(5,11),10),F=Math.max(t.newRibs||0,E),P=t.teak,_=Ae(.55,Re*.5,.2);t.ribs=[];for(let x=0;x<ye;x++){const z=Te-Pe*x,b=d[Math.min(i-1,Math.floor(x/(ye/i)))],A=x>=ye-F,c=e.range(.82,1.18),h={z,dense:[],ext:[]};for(let p=0;p<2;p++){const n=p?1:-1,m=e.chance(.14)?e.range(-9,-3):e.range(.5,6.5),B={a:e.range(.1,.42),f:e.range(5,11),p:e.range(0,6.28)};x>=ye-10&&n<0&&(B.a*=.35);const C=at(z,m,B),a=Dt(C);h.dense[p]=C,h.ext[p]=m;const f=e.range(.25,.33)+(x&1)*.05,r=.034;let w=e.range(.6,.68)-(x&1)*.05;const k=x>=ye-10&&n<0;if(k){const R=35.4+1.5*(x*5%3);let K=1;for(;K<C.length-1&&C[K][1]<R;)K++;w=Math.max(a[K]/a[a.length-1],f+.14),(t.rankScarf||(t.rankScarf=[])).push({z,x:C[K][0],y:C[K][1]})}const T=[[0,f+r,6],[f-r,w+r,8],[w-r,1,8]],M=x+p&1?1:-1,N=[!1,!1,!1];for(let R=0;R<3;R++){const[K,I,L]=T[R],te=ft(C,a,K,I,L,n,z+(R===1?-.46:.46)*M*(x>=ye-10&&n<0?.6:1)),H=Kt(te);let Q=A?e.chance(.85):e.chance(P?.2:.045);P&&(Q=!Q);const v=x>=ye-10&&n<0;v&&(Q=!0);const U=Math.abs(Math.sin(x*12.9898+p*78.233+R*37.719)*43758.5453)%1;t.paleRibs&&(Q=!0),N[R]=Q;const G=v?D(1.12,c*e.range(.85,1.15),.3):c*e.range(.85,1.15),q=e(),re=t.paleRibs&&!A&&!v&&U<.11?V($(o.iron,o.newWood,.62),G*.95):Q?V($(o.newWood,o.pale,t.paleRibs?.54+.3*q:q*.3),G*(t.paleRibs?A||v?.88:.76+.08*U:P&&!A&&!v?.64:t.day?.84:.76)):V($(o.iron,o.ash,q*.22),G*(t.day?1.62:1)),ge=R===0?1:R===1?.93:.86,ze=R===2?.8:1;if(me(b,te,H.A,H.B,_,{sb:oe=>ge*(R===2?D(1,ze,oe/L):1),u0:e.range(0,40),v0:e.range(0,9),capTone:Q?1.15:2.1,capFlag:!0,col:(oe,ee,ie)=>{const ne=.9+.2*Math.sin(oe*1.7+x+R*2.1);return ie[0]=re[0]*ne,ie[1]=re[1]*ne,ie[2]=re[2]*ne,ie}}),R===2){const oe=te.length-1,ee=te[oe],ie=H.A[oe],ne=H.B[oe],le=new l.Vector3().crossVectors(ie,ne).normalize(),ke=Math.abs(Math.sin(x*12.9898+p*78.233)*43758.5453)%1,fe=ke*7.31%1,Se=ke*23.7%1,xe=ge*ze,Ee=V($(V(re,Q?1.25:2.6),o.pale,Q?.3:.55),.85+.3*Se),be=$(V(re,1.25),o.newWood,Q?.1:.3);if(ke<.26){const Ne=fe<.5?1:-1,Ce=1+1.5*Se,Fe=Re*.25*xe,Le=ee.clone().addScaledVector(ne,Ne*Fe),Je=Le.clone().addScaledVector(le,Ce*.82),dt=Le.clone().addScaledVector(le,Ce);me(b,[Le,Je,dt],[ie,ie,ie],[ne,ne,ne],Ae(.55,Fe,.14),{col:be,u0:3+ke*30,caps:"end",capFlag:!0,capCol:Ee,sa:Oe=>Oe===2?.78:1,sb:Oe=>Oe===2?.78:1,nT:Oe=>Oe?.9:0})}else{const Ne=.45+.45*Se,Ce=.6+.14*fe;me(b,[ee,ee.clone().addScaledVector(le,Ne)],[ie,ie],[ne,ne],_,{col:be,u0:3+ke*30,caps:"end",capFlag:!0,capCol:Ee,sa:Fe=>Fe?Ce:1,sb:Fe=>xe*(Fe?Ce:1),nT:.9})}if(fe>.3){const Ne=1.5+1.6*Se,Ce=ee.clone().addScaledVector(le,-Ne),Fe=.75+.7*ke;ct(t.headLash,Ce,ne,.56,Re*.5*xe+.01,Fe,.06,V($(o.rattan,o.ash,.15+.3*Se),.5+.3*fe),2.2,x*3.1+p)}}}for(let R=0;R<2;R++){const K=R?w:f;for(let I=0;I<2;I++){const L=ft(C,a,K+(I?.018:-.018),K+.05,1,n,z)[0];if(n<0&&x>=50){const te=N[R]||N[R+1],H=te?V($(o.iron,o.newWood,.22),1.5):V($(o.peg,o.iron,.4),.9),Q=.55+.46*(x>=ye-10?.6:1);ae(b,[-Q-.17,-Q-.15,-Q-.1,-Q-.03,-Q,Q,Q+.03,Q+.1,Q+.15,Q+.17].map(v=>s(L.x,L.y,z+v)),1,10,(v,U,G)=>{const q=v<5?v:9-v,O=q===4?.5:U===3&&q<3?.45:[1.05,1,.9,.62][q];return G[0]=H[0]*O,G[1]=H[1]*O,G[2]=H[2]*O,G},{up:Qe.set(0,1,0),u0:1e3,capFlag:!0,taper:v=>[.07,.16,.23,.22,.15,.15,.22,.23,.16,.07][v],nT:v=>[-2.4,-1.2,-.4,.6,0,0,-.6,.4,1.2,2.4][v],capTone:1})}else ae(b,[s(L.x,L.y,z-1.35),s(L.x,L.y,z+1.35)],1,5,o.peg,{up:Qe.set(0,1,0),taper:()=>.2})}if(k&&R){const I=V($(o.iron,o.newWood,.16),1.45),L=.55+.46*.6;for(let te=0;te<2;te++){const H=ft(C,a,K+(te?.0118:-.0118),K+.05,1,n,z)[0],Q=(te-.5)*.1;ae(b,[-L-.22,-L-.2,-L-.14,-L-.04,-L,L,L+.04,L+.14,L+.2,L+.22].map(v=>s(H.x,H.y,z+v+Q)),1,12,(v,U,G)=>{const q=v<5?v:9-v,O=q===4?.5:U===4+te*5&&q<3?.42:[1.08,1,.88,.6][q];return G[0]=I[0]*O,G[1]=I[1]*O,G[2]=I[2]*O,G},{up:Qe.set(0,1,0),u0:1e3,capFlag:!0,taper:v=>[.09,.22,.32,.31,.2,.2,.31,.32,.22,.09][v],nT:v=>[-2.4,-1.2,-.4,.6,0,0,-.6,.4,1.2,2.4][v],capTone:1})}}}}t.ribs.push(h),(x&1)===1&&await t.ctx.yield()}for(let x=0;x<i;x++){const z=new l.Mesh(ve(d[x]),g.wood);z.name="ribs"+x,u.add(z),await t.ctx.yield()}}const Ge=.185,$e=1.4,Wt=6,Rt=-6,Lt={left:4,down:5,ahead:10};function ut(t,e=new l.Vector3){const o=95*t,u=o/95,g=-430-40*u-22.5*u*(1-u);return e.set(0,o,g+3.4*Math.sin(u*Math.PI))}async function Ot(t){const{rng:e,C:o,group:u,mats:g}=t,i=ce(),d=s(0,1,0),E=s(0,0,1),F=s(1,0,0);for(let a=-6;a>-428;a-=e.range(13,17)){const f=e.range(.8,1.15),r=V($(o.iron,o.ash,.45),f);De(i,s(-2.6,.7,a),s(2.6,.7,a),.8,.7,.14,r,E,{u0:e.range(0,30)}),De(i,s(-1.1,2,a-1.3),s(-1.1,2,a+1.3),.75,.6,.14,V(r,1.15),d,{u0:e.range(0,30)}),De(i,s(1.1,2,a-1.3),s(1.1,2,a+1.3),.75,.6,.14,V(r,.9),d,{u0:e.range(0,30)})}const P=(a,f,r,w,k,T,M)=>{const N=(f-a)/r;for(let R=0;R<r;R++){const K=a+N*R+(R?.12:0),I=a+N*(R+1)-(R<r-1?.12:0),L=[];for(let Q=0;Q<=4;Q++)L.push(s(0,w,D(K,I,Q/4)));const te=e.range(.8,1.2),H={A:L.map(()=>F),B:L.map(()=>d)};L.reverse(),me(i,L,H.A,H.B,Ae(k*e.range(.96,1.04),T,.22),{col:(Q,v,U)=>{const G=te*(.92+.16*Math.sin(Q*2.3+R));return U[0]=M[0]*G,U[1]=M[1]*G,U[2]=M[2]*G,U},u0:e.range(0,50),capTone:1.8})}};P(2,-431,3,4,1.15,1.4,o.iron),P(-50,-394,5,9,1.25,1,$(o.iron,o.newWood,.18));const _=(a,f,r,w,k,T=7,M=.82,N=null)=>{const R=[];for(let I=0;I<=T;I++){const L=D(f,r,I/T);R.push(s(0,L,a+Ge*(L-f)))}const K={A:R.map(()=>F),B:[]};for(let I=0;I<=T;I++)Z.copy(R[Math.min(I+1,T)]).sub(R[Math.max(I-1,0)]).normalize(),K.B.push(new l.Vector3().crossVectors(Z,F).normalize());me(i,R,K.A,K.B,Ae(w,w*1.08,.32),{sa:I=>D(1,M,I/T),sb:I=>D(1,M,I/T),u0:N??e.range(0,30),capTone:N===null?2.2:1,col:(I,L,te)=>{const H=.9+.2*Math.sin(I*1.9+a);return te[0]=k[0]*H,te[1]=k[1]*H,te[2]=k[2]*H,te}})},x=t.day?1.3:t.teak?.56:.86;_(0,2.6,72,$e,V(o.iron,x));const z=[[.6,.04,.03],[.8,.77,.68],[.03,.13,.55]];for(let a=0;a<3;a++){const f=33.2+a*2.3,r=$e*D(1,.82,(f-2.6)/69.4)+.09;_(Ge*(f-2.6),f,f+2.2,r,z[a],1,1,7+a*3)}{const a=[];for(let r=0;r<=8;r++){const w=r/8,k=w*Math.PI*.5;a.push(s(0,6.6+24*(1-Math.cos(k)),-26+26.6*Math.sin(k)+Ge*24*(1-Math.cos(k))-2.3*w))}const f={A:a.map(()=>F),B:[]};for(let r=0;r<=8;r++)Z.copy(a[Math.min(r+1,8)]).sub(a[Math.max(r-1,0)]).normalize(),f.B.push(new l.Vector3().crossVectors(Z,F).normalize());me(i,a,f.A,f.B,Ae(1.5,1.3,.25),{col:V($(o.iron,o.ash,.2),1.1),sb:r=>1+.5*Math.sin(r/8*Math.PI),u0:7,capTone:1.9})}const b=[];for(let a=-2;a<=2;a++){const f=[],r=a*7.2;for(let T=0;T<=6;T++){const M=T/6;f.push(s(r*(.12+.88*Math.sin(M*1.35)),60+9*M+5*M*M+Math.abs(a)*.8*M,9.5+34*M-5*M*M))}const w=Ze(f,d),k=V(a===0||e.chance(.3)?$(o.newWood,o.iron,.25):o.iron,e.range(.85,1.15));me(i,f,w.A,w.B,Ae(.9,1.25,.2),{col:k,sb:T=>D(1.15,.7,T/6),u0:e.range(0,30),capTone:1.7}),b.push(f[6].clone(),f[4].clone())}for(let a=0;a<2;a++){const f=[];for(let w=0;w<5;w++)f.push(b[w*2+a].clone().add(s(0,a?-1.9:1.6,0)));const r=Ze(f,d);me(i,f,r.A,r.B,Ae(a?.6:.75,.55,.15),{col:V($(o.newWood,o.iron,a?.6:.1),.9),u0:3})}t.counter={left:b[2].clone(),right:b[6].clone()},await t.ctx.yield();for(let a=0;a<2;a++){const f=a?7:14,r=[];for(let M=0;M<=f;M++){const N=a?D(.07,.29,M/f):D(.028,1,M/f);ut(N,Z),r.push(s(0,Z.y,Z.z+(a?D(3.6,2.5,M/f):0)))}a&&r.unshift(s(0,6.6,-402),s(0,6.4,-414));const w=r.length-1,k={A:r.map(()=>F),B:[]};for(let M=0;M<=w;M++)Z.copy(r[Math.min(M+1,w)]).sub(r[Math.max(M-1,0)]).normalize(),k.B.push(new l.Vector3().crossVectors(Z,F).normalize());const T=a?V($(o.iron,o.newWood,.1),.95):V(o.iron,1.05);me(i,r,k.A,k.B,Ae(a?1.55:2,a?1.5:2.3,a?.42:.3),{u0:e.range(0,20),capTone:a?1.15:2,sa:M=>a?D(1,.55,de(.45,1,M/w)):D(1,.72,M/w),sb:M=>a?D(.9,.16,de(.35,1,M/w)):D(1,.7,M/w),col:(M,N,R)=>{const K=.88+.24*Math.sin(M*1.3+a);return R[0]=T[0]*K,R[1]=T[1]*K,R[2]=T[2]*K,R}})}for(const a of[15.4,20.2,31]){const f=$e*D(1,.82,(a-2.6)/69.4)+.07;_(Ge*(a-2.6),a,a+.75,f,V(o.ash,.66),1,1,3+a)}for(let a=0;a<9;a++)ut(.1+a*.045,Z),ae(i,[s(-2.25,Z.y,Z.z+1.6),s(2.25,Z.y,Z.z+1.6)],1,5,o.peg,{taper:()=>.24});for(let a=0;a<6;a++){const f=9+a*4.2;ae(i,[s(-$e-.3,f,Ge*f-1),s($e+.3,f,Ge*f-1)],1,5,o.peg,{taper:()=>.24})}const A=s(0,65.5,16+Ge*62.5);for(const a of[t.counter.left,t.counter.right]){const f=[];for(let r=0;r<=5;r++){const w=r/5;f.push(s(D(A.x,a.x,w),D(A.y,a.y-1,w)-1.2*Math.sin(w*Math.PI),D(A.z,a.z,w)))}ae(i,f,.24,6,o.rope)}const c=new l.Mesh(ve(i),g.wood);c.name="backbone",u.add(c),await t.ctx.yield();const h=ce(),p=new l.Group;p.name="rudder",De(h,s(0,0,0),s(0,62.5,0),1.15,1.15,.34,V(o.iron,x*(t.day?.78:1.08)),E,{u0:4,capTone:2.2});let n=1.1;const m=[3,3.4,5.6,8.4,10.6];for(let a=0;a<5;a++){const f=[2.5,2.4,2.3,2.1,1.9][a],r=22.4-a*a*.5-e.range(0,.8),w=m[a],k=e.range(.8,1.2),T=V(a===2||e.chance(.25)?$(o.iron,o.ash,.16):o.iron,k*x*(t.day?.7:1.05));De(h,s(0,w,n+f*.5),s(0,r,n+f*.5),f*.5-.05,.55-a*.05,.12,T,F,{u0:e.range(0,30),capTone:1.9}),n+=f}for(const a of[5.4,10.2,15.6])for(const f of[-1,1]){const r=a<7?5.9:a<13?10.2:n-4.4,w=a<13&&a>7?.5:.8;De(h,s(f*.72,a,-.6),s(f*.66,a-w,r),.13,.42,.05,V(o.ash,.62),d,{u0:a});for(let k=0;k<6;k++){const T=(k+.5)/6,M=D(-.6,r,T),N=a-w*T;ae(h,[s(f*.6,N,M),s(f*.98,N,M)],1,6,V(o.peg,1.1),{up:d,taper:R=>R?.2:.14})}}for(let a=0;a<5;a++)for(const f of[7.4,12.9,18.4]){const r=1.1+[1.25,3.7,6.05,8.25,10.25][a]+.5*Math.sin(a*2.1+f),w=22.4-a*a*.5;f<w-3&&f>m[a]+1&&ae(h,[s(-.7,f,r),s(.7,f,r)],1,5,$(o.peg,o.iron,.25),{up:d,taper:()=>.15})}const B=ce();for(const[a,f]of[[13.3,0],[18.9,-4.6]]){const r=n+.3+f,w=[];for(const[k,T,M]of[[1,0,-1.45],[1,-.5,r*.5],[1,-1.2,r],[0,-1.35,r+.45],[-1,-1.2,r],[-1,-.5,r*.5],[-1,0,-1.45],[0,.1,-1.6],[1,0,-1.45]])w.push(s(k*(M<0?1.4:.88),a+T,M));ae(B,w,.2,6,V(o.rope,1.5),{up:d,caps:!1}),ae(B,[s(.95,a-.3,r*.3),s(1.15,a-1.6,r*.3+.3),s(1,a-4.2,r*.3+.1),s(1.1,a-5.6,r*.3+.5)],.17,6,V(o.rope,1.4),{up:d})}ae(h,[s(0,62.5,0),s(0,63.4,0)],1.5,8,o.rope);const C=new l.Mesh(ve(h),g.wood);p.add(C),p.add(new l.Mesh(ve(B),g.rope(.2,3))),p.position.set(0,3,16),t.rudder=p,t.rudderRake=Math.atan(Ge),p.rotation.set(t.rudderRake,0,0),t.rudderPose={yaw:-.46},u.add(p),await t.ctx.yield()}function nt(t,e){const o=at(t,8);for(let u=o.length-1;u>0;u--)if((o[u-1][1]-e)*(o[u][1]-e)<=0&&o[u][1]!==o[u-1][1]){const g=(e-o[u-1][1])/(o[u][1]-o[u-1][1]),i=o[u][0]-o[u-1][0],d=o[u][1]-o[u-1][1],E=Math.hypot(i,d)||1,F=d/E,P=-i/E;return{x:D(o[u-1][0],o[u][0],g)+F*Re*.5,y:e+P*Re*.5,nx:F,ny:P}}return{x:ht(t)+Re,y:e,nx:1,ny:0}}const Ct=new l.Vector3,Tt=new l.Vector3,Pt=new l.Vector3;function Xt(t,e,o,u,g,i,d,E,F,P,_){Ct.subVectors(o,e),Tt.subVectors(g,e),Pt.crossVectors(Ct,Tt);const x=Pt.dot(i)<0,z=t.n;t.pos.push(e.x,e.y,e.z,o.x,o.y,o.z,u.x,u.y,u.z,g.x,g.y,g.z);for(let b=0;b<4;b++)t.nrm.push(i.x,i.y,i.z),t.col.push(d[0],d[1],d[2]);t.uv.push(E,P,F,P,F,_,E,_),x?t.idx.push(z,z+2,z+1,z,z+3,z+2):t.idx.push(z,z+1,z+2,z,z+2,z+3),t.n+=4}async function jt(t){const{rng:e,C:o,group:u,mats:g}=t,i=ce(),d=12,E=.07,F=[];for(let h=-1;h<=ye;h++){const p=Te-Pe*pe(h,-.45,ye-.55),n=at(p,0),m=[0];let B=n.length-1;for(let r=1;r<n.length;r++)m.push(m[r-1]+Math.hypot(n[r][0]-n[r-1][0],n[r][1]-n[r-1][1])),n[r][1]>=14.6&&B===n.length-1&&(B=r);const C=1.6,a=m[B],f=[];for(let r=0;r<=d;r++){const w=D(C,a,r/d);let k=1;for(;k<B&&m[k]<w;)k++;const T=pe((w-m[k-1])/Math.max(m[k]-m[k-1],1e-5),0,1),M=n[k][0]-n[k-1][0],N=n[k][1]-n[k-1][1],R=Math.hypot(M,N)||1,K=N/R,I=-M/R,L=Re*.5+.3;f.push({x:D(n[k-1][0],n[k][0],T)+K*L,y:D(n[k-1][1],n[k][1],T)+I*L,nx:K,ny:I,tx:M/R,ty:N/R})}F.push({z:p,edges:f})}await t.ctx.yield();for(let h=-1;h<=1;h+=2){for(let p=0;p<d;p++){const n=Math.max(0,p-(d-4)),m=n?e.int(2,7)*n:0,B=F.length-1-(n?e.int(2,8)*n:0);let C=e.range(.75,1.2),a=m+e.int(5,11),f=e.chance(.22+.2*n),r=e.range(0,60);for(let w=m;w<B;w++){w===a&&(C=e.range(.75,1.2),a=w+e.int(6,12),f=e.chance(.22+.2*n),r=e.range(0,60));const k=F[w],T=F[w+1],M=k.edges[p],N=k.edges[p+1],R=T.edges[p],K=T.edges[p+1],I=V(f?$(o.newWood,o.pale,.15):$(o.iron,o.newWood,t.paleRibs?.72:.3),C*(f?.8:1)),L=Qe.set(h*(M.nx+N.nx)*.5,(M.ny+N.ny)*.5,0).normalize().clone(),te=w===a-1||w===B-1?.06:0,H=0;Xt(i,s(h*(M.x+M.tx*E),M.y+M.ty*E,k.z-H),s(h*(R.x+R.tx*E),R.y+R.ty*E,T.z+te),s(h*(K.x-K.tx*E),K.y-K.ty*E,T.z+te),s(h*(N.x-N.tx*E),N.y-N.ty*E,k.z-H),L,I,r-k.z,r-T.z,p*2.7,p*2.7+2.4)}}await t.ctx.yield()}const P=new l.Mesh(ve(i),g.woodDouble);P.name="strakes",u.add(P);const _=ce(),x=ce(),z=[21,31.5,42,52];for(let h=-1;h<=1;h+=2){for(let p=0;p<z.length;p++){const n=[],m=[],B=[],C=z[p]+e.range(-1.2,1.2),a=p===3?e.int(0,3):-1,f=h<0&&p===1?31:35+(p===3?-e.int(0,4):0);for(let k=a;k<=f;k++){const T=Math.max(Te-Pe*(k*2+0)+(k===-1?-3:0),Te-Pe*(ye-1)-2.2),M=nt(T,C);n.push(s(h*(M.x+M.nx*.42),M.y+M.ny*.42,T)),B.push(s(h*M.nx,M.ny,0))}for(let k=0;k<n.length;k++)Z.copy(n[Math.min(k+1,n.length-1)]).sub(n[Math.max(k-1,0)]).normalize(),m.push(new l.Vector3().crossVectors(B[k],Z).normalize()),B[k].crossVectors(Z,m[k]).normalize();const r=e.range(.8,1.1),w=V($($(o.newWood,o.bamboo,e.range(.3,.7)),o.ash,.5),r*.7);me(_,n,m,B,Ae(.68,.42,.1),{u0:e.range(0,40),capTone:1.3,col:(k,T,M)=>{const N=.85+.3*Math.sin(k*.9+p*2+h);return M[0]=w[0]*N,M[1]=w[1]*N,M[2]=w[2]*N,M}})}await t.ctx.yield()}const b=(h,p,n,m,B,C,a=.12,f=.32,r=x)=>{const w=[];for(let T=0;T<=4;T++){const M=[1,1,-1,-1,1][T],N=[-1,1,1,-1,-1][T];w.push(s(h.x+n.x*B*N,h.y+n.y*B*N,h.z+M*m))}const k=Ze(w,p);me(r,w,k.A,k.B,it(1,4),{sa:()=>a,sb:()=>f,col:C,caps:!1,u0:h.z})};if(t.lash=b,t.lashAcc=x,t.headLash){const h=t.headLash,p=x.n;for(const n of["pos","nrm","col","uv"])for(let m=0;m<h[n].length;m++)x[n].push(h[n][m]);for(let n=0;n<h.idx.length;n++)x.idx.push(h.idx[n]+p);x.n+=h.n}const A=Math.max(.5,t.detail);for(let h=0;h<ye;h++){const p=Te-Pe*h;for(let n=-1;n<=1;n+=2)for(let m=0;m<z.length;m++){if(A<1&&(h+m)%2&&m!==1)continue;const B=nt(p,z[m]),C=Math.hypot(B.ny,B.nx)||1,a=Z.set(-B.ny*n/C,B.nx/C,0).clone(),f=s(n*B.nx,B.ny,0),r=s(n*(B.x-B.nx*.9),B.y-B.ny*.9,p),w=V($(o.rattan,o.ash,e.range(.1,.5)),e.range(.6,.95)*.78);n<0&&m===1&&h>62||(n<0&&h>=50?ct(x,r,f,1.16,1.95,.72,.075,w,4,p+m):b(r,a,f,1.16,1.95,w))}(h&15)===15&&await t.ctx.yield()}for(let h=1;h<ye;h+=e.int(3,5)){const p=t.ribs[h],n=Math.min(tt(p.z)+p.ext[0],tt(p.z)+p.ext[1])-e.range(1.5,3.2),m=nt(p.z,n),B=m.x-m.nx*Re-.2+3,C=p.z+1.5*(h&1?1:-1),a=V($($(o.newWood,o.bamboo,e.range(.2,.6)),o.ash,.3),e.range(.6,.85)),f=t.spallSkip&&p.z<t.spallSkip[0]&&p.z>t.spallSkip[1];De(f?ce():_,s(-B,n,C),s(B,n+e.range(-.5,.5),C),.42,.62,.1,a,s(0,1,0),{u0:e.range(0,30),capTone:1.3});for(const r of[-1,1])b(s(r*(B-3.6),n,p.z+.75*(h&1?1:-1)),s(0,1,0),s(r,0,0),1.75,1.5,V(o.rattan,e.range(.7,1)),.12,.32,f?ce():x)}const c=new l.Mesh(ve(_),g.wood);c.name="ribbands",u.add(c),await t.ctx.yield()}const Yt=`
#include <fog_pars_vertex>
${je}
${Bt}
attribute vec4 aSeed;
uniform float uSteam;
uniform float uWisp;
uniform float uBend;
uniform float uBelly;
varying float vX;
varying float vA;
varying vec3 vWp;
varying float vLit;
vec3 hifThread(float t, vec3 wb, vec3 aft, vec3 nW, float len, float ph) {
  vec3 p = wb + nW * (0.04 + 0.35 * t * mix(0.4, 1., uWisp)) + aft * (t * len * mix(0.75, 0.05, uWisp));
  p.y += t * len * mix(0.55, 1., uWisp);
  // (carried, the threads lie back in long easy curls; at the berth they climb and curl tighter)
  float amp = (0.07 + 0.42 * t) * t * mix(1.1, 1., uWisp), fq = mix(0.55, 1., uWisp);
  p.x += amp * sin(t * 6.3 * fq + ph - uTime * 1.6);
  p.z += amp * cos(t * 4.9 * fq + ph * 1.7 - uTime * 1.25);
  p.y += amp * 0.5 * sin(t * 5.1 * fq + ph * 2.3 - uTime * 1.4);
  return p;
}
void main() {
  float t = position.y;
  float cyc = aSeed.x + uTime * (0.16 + 0.12 * aSeed.y);
  float life = fract(cyc), gen = floor(cyc);
  float x0 = mix(-19., 19.5, fract(aSeed.z + gen * 0.618 * (1. - uWisp)));
  float zAc = (aSeed.w - 0.5) * 2.0;
  // at the berth every thread rises from one of the glints that lie on the face (hifOwnSpot's own places)
  vec3 w0 = (modelMatrix * vec4(x0, 0.3, 0., 1.)).xyz;
  float sB0 = dot(w0.xz - uBerth.xy, uBerth.zw);
  vec4 own = hifOwnSpot(sB0);
  float zs = (modelMatrix * vec4(0., 0., 1., 0.)).y;
  // (a sheaf of fine threads to each glint, their feet spread over it and a little beyond)
  x0 += (own.x - sB0 + (aSeed.y - 0.5) * 0.9) * uWisp;
  zAc = mix(zAc, own.y * (zs < 0. ? -1. : 1.) + (aSeed.w - 0.5) * 0.4, uWisp);
  // it leaves the face where the board is (bent or not)
  float sB = clamp((x0 + 20.) / 40., 0., 1.);
  float yB = (1. - uBend) * 4.0 * sB * sB - uBelly * 4. * sB * (1. - sB);
  vec3 wb = (modelMatrix * vec4(x0, 0.27 + yB, zAc, 1.)).xyz;
  vec3 nW = normalize(mat3(modelMatrix) * vec3(0., 1., 0.));
  vec3 aft = -normalize(mat3(modelMatrix) * vec3(1., 0., 0.));
  float len = mix(2.6, 5.0, uWisp) * (0.6 + 0.8 * aSeed.y);
  float ph = aSeed.x * 40.;
  vec3 p0 = hifThread(t, wb, aft, nW, len, ph);
  vec3 p1 = hifThread(t + 0.03, wb, aft, nW, len, ph);
  vec4 mvPosition = viewMatrix * vec4(p0, 1.);
  vec3 tv = (viewMatrix * vec4(p1 - p0, 0.)).xyz;
  vec2 sd = vec2(-tv.y, tv.x);
  float sl = length(sd);
  sd = sl > 1e-5 ? sd / sl : vec2(1., 0.);
  float dist = -mvPosition.z;
  float hw = max((0.02 + 0.055 * t) * (0.7 + 0.6 * aSeed.w) * mix(1.6, 8. + 24. * t, uWisp), 0.0021 * dist * (1. + 1.2 * uWisp));
  mvPosition.xy += sd * position.x * hw;
  // a wisp climbs the thread and thins out as it goes
  float c = life * 1.5 - 0.2;
  float wisp = 1. - smoothstep(0.22, 0.5, abs(t - c));
  float thin = smoothstep(0., 0.07, t) * (1. - t) * (1. - 0.6 * t);
  // at the berth a thread is vapour, not a hair: brightest at its foot on the glint, gone within a few metres
  thin *= mix(1., 0.3 * (1. - 0.6 * t), uWisp);
  float shown = mix(0.8, own.w * step(fract(aSeed.x * 7.31 + aSeed.w * 3.7), 0.62), uWisp);
  vA = min(uSteam, mix(1.5, 4., uWisp)) * mix(1.9, 1., uWisp) * wisp * thin * shown * smoothstep(2.5, 7., dist) * (0.6 + 0.4 * aSeed.w);
  vLit = own.w * uWisp * (1. - 0.7 * t);
  vX = position.x;
  vWp = p0;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,Qt=`
#include <fog_pars_fragment>
${je}
varying float vX;
varying float vA;
varying vec3 vWp;
varying float vLit;
void main() {
  float prof = 1. - vX * vX;
  prof *= prof;
  // lit from the pinhole rays it drifts through: a thread inside a coin's pencil is the brightest thing on the board
  float coin = max(max(hifCoin(vWp), 0.9 * hifCoin(vWp + vec3(1.7, 0., 2.3))), vLit);
  vec3 col = (uFillUp + uFillDown) * 0.34 + uCoinCol * coin * 0.2;
  gl_FragColor = vec4(col, min(vA * prof * (0.15 + 0.2 * coin), 0.42));
  #include <fog_fragment>
}
`,Zt=`
#include <fog_pars_vertex>
attribute vec4 aSeed;
uniform float uTime;
uniform float uDrip;
uniform float uWisp;
uniform float uBend;
uniform float uBelly;
varying vec2 vQ;
varying float vA;
varying vec3 vWp;
void main() {
  float cyc = aSeed.x + uTime * (0.5 + 0.45 * aSeed.y);
  float life = fract(cyc), gen = floor(cyc);
  float x0 = mix(-19.6, 19.6, fract(aSeed.z + gen * 0.618));
  float sB = clamp((x0 + 20.) / 40., 0., 1.);
  float yB = (1. - uBend) * 4.0 * sB * sB - uBelly * 4. * sB * (1. - sB);
  float zs = (modelMatrix * vec4(0., 0., 1., 0.)).y;
  vec3 lp = vec3(x0, mix(-0.27, (aSeed.w - 0.5) * 0.4, uWisp) + yB, mix((aSeed.w - 0.5) * 2.2, zs < 0. ? 1.22 : -1.22, uWisp));
  vec4 wp = modelMatrix * vec4(lp, 1.);
  float tf = max(life - 0.3, 0.) * 1.5;
  wp.y -= 0.06 * smoothstep(0., 0.3, life) + 7. * tf * tf;
  vec4 mvPosition = viewMatrix * wp;
  float dist = -mvPosition.z;
  float w = max(0.03 + 0.014 * aSeed.y, 0.0023 * dist);
  float lenK = w + clamp(tf * 0.3, 0., 0.2);
  vec2 upV = (viewMatrix * vec4(0., 1., 0., 0.)).xy;
  float ul = length(upV);
  upV = ul > 1e-4 ? upV / ul : vec2(0., 1.);
  mvPosition.xy += vec2(upV.y, -upV.x) * position.x * w + upV * position.y * lenK;
  vQ = position.xy;
  vA = uDrip * smoothstep(0., 0.25, life) * (1. - smoothstep(0.72, 1., life)) * smoothstep(3.5, 9., dist);
  vWp = wp.xyz;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,$t=`
#include <fog_pars_fragment>
${je}
varying vec2 vQ;
varying float vA;
varying vec3 vWp;
void main() {
  float a = vA * (1. - smoothstep(0.45, 1., abs(vQ.x))) * (1. - smoothstep(0.55, 1., abs(vQ.y)));
  // a bead holds the shed's light; one that falls through a pinhole's ray flashes
  vec3 col = (uFillUp + uFillDown) * 0.42 * (0.6 + 0.4 * vQ.y) + uCoinCol * hifCoin(vWp) * 0.3 + uGlaze * 6.;
  gl_FragColor = vec4(col, a * 0.85);
  #include <fog_fragment>
}
`;function lo(t,e){for(let o=0;o<t.length-1;o++){const u=t[o],g=t[o+1];if(e<=u[2]&&e>=g[2])return D(u[1],g[1],de(0,1,(u[2]-e)/Math.max(u[2]-g[2],1e-4)))}return e>t[0][2]?t[0][1]:t[t.length-1][1]}async function Jt(t){const{rng:e,C:o,group:u,mats:g,shared:i}=t,d=s(1,0,0),E=s(0,1,0),F=s(0,0,1),P=ce(),_=[],x=t.ropePts,z=(v,U)=>{let G=0;for(;G<x.length-2&&v<x[G+1][2];)G++;const q=x[G],O=x[G+1],re=pe((q[2]-v)/Math.max(q[2]-O[2],1e-4),0,1);return D(q[U],O[U],re)-(U===1?1.6*Math.sin(re*Math.PI):0)};t.ropeY=v=>z(v,1),t.ropeX=v=>z(v,0);for(let v=100;v>=-420;v-=10)_.push(s(t.ropeX(v),t.ropeY(v),v));ae(P,_,.3,6,V(o.rope,.62));const b=new l.Mesh(ve(P),g.rope(.3,4));b.name="ridgeRope",u.add(b);const A=new l.Group;A.name="carried",A.visible=!1,u.add(A);const c=new l.Group;c.name="plank",A.add(c);const h=ce(),p=[];for(let v=0;v<=80;v++)p.push(s(-20+v*.5,0,0));const n=V(o.iron,.9),m=$(o.iron,o.newWood,.6);e.range(0,60),me(h,p,p.map(()=>E),p.map(()=>F),Ae(.25,1.2,.07),{u0:0,capTone:1,capFlag:!0,capCol:n,sb:v=>1-.035*Math.pow(Math.abs(v-40)/40,3),col:(v,U,G)=>{const q=.8+.3*Math.sin(v*.37+1.3)*Math.sin(v*.11)+(v%80===0?.6:0),O=v===0||v===80?1:0;return G[0]=D(n[0]*q,m[0],O),G[1]=D(n[1]*q,m[1],O),G[2]=D(n[2]*q,m[2],O),G}});const B=new l.Mesh(ve(h),g.plank);B.frustumCulled=!1,c.add(B);const C=ce();{const v=$(o.iron,[.39,.14,.05],.62),U=V(v,.42),G=V(v,.85),q=V(v,.3),O=V(v,1.12),re=V($(v,o.newWood,.55),1.5),ge=V(v,.8),ze=V(v,.25),oe=[-1.5,-1.18,1.14,1.2,1.25,1.3,1.32,1.34,1.36,1.39,1.42,1.42,1.52,1.52,1.57,1.57,1.6,1.6,1.618,1.618,1.63,1.63],ee=[.08,.2,.2,.24,.27,.24,.2,.185,.2,.31,.36,.36,.36,.36,.31,.31,.225,.225,.135,.135,.05,.05],ie=[-.3,0,0,-.9,0,.9,.5,0,-.9,-1.6,-.7,0,0,1,1,3,3,4,4,5,5,6],ne=[U,U,U,G,G,G,q,q,q,O,O,O,O,re,re,ge,ge,V(ge,.8),V(ge,1.06),V(ge,.84),ge,ze];ae(C,oe.map(le=>s(0,le,0)),1,16,(le,ke,fe)=>{const Se=ne[le],xe=le>=9&&le<=18&&ke===5?.84:le<3?.9+.2*((ke*5+le*3)%4)/3:1;return fe[0]=Se[0]*xe,fe[1]=Se[1]*xe,fe[2]=Se[2]*xe,fe},{up:F,taper:le=>ee[le],nT:le=>ie[le],capTone:1})}const a=new l.InstancedMesh(ve(C),g.peg,9);a.frustumCulled=!1,c.add(a),t.pegX=[];for(let v=0;v<9;v++)t.pegX.push(-17.6+v*4.4+e.range(-.5,.5));t.pegZ=t.pegX.map((v,U)=>(U&1?.45:-.45)+e.range(-.12,.12));const f=Math.round(150*Math.max(.6,t.detail)),r=Math.round(f*1.8),w=new l.InstancedBufferGeometry;{const U=[],G=[];for(let q=0;q<=9;q++)U.push(-1,q/9,0,1,q/9,0);for(let q=0;q<9;q++){const O=q*2;G.push(O,O+1,O+3,O,O+3,O+2)}w.setAttribute("position",new l.Float32BufferAttribute(U,3)),w.setIndex(G)}const k=new Float32Array(r*4);for(let v=0;v<r*4;v++){const U=Math.sin(v*12.9898+4.1)*43758.5453;k[v]=v<f*4?e():U-Math.floor(U)}w.setAttribute("aSeed",new l.InstancedBufferAttribute(k,4)),w.instanceCount=Math.round(f*1.2),g.steam=new l.ShaderMaterial({vertexShader:Yt,fragmentShader:Qt,fog:!0,transparent:!0,depthWrite:!1,side:l.DoubleSide,uniforms:{...l.UniformsUtils.clone(l.UniformsLib.fog),...i,uSteam:{value:1},uFlow:{value:9},uRise:{value:1},uWisp:{value:0},uBend:g.plank.uniforms.uBend,uBelly:g.plank.uniforms.uBelly,uFaceY:g.plank.uniforms.uFaceY,uBerth:g.plank.uniforms.uBerth}});const T=new l.Mesh(w,g.steam);T.frustumCulled=!1,T.renderOrder=3,c.add(T);{const v=Math.round(56*Math.max(.6,t.detail)),U=new l.InstancedBufferGeometry,G=new Float32Array(v*4);U.setAttribute("position",new l.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),U.setIndex([0,1,2,0,2,3]);for(let O=0;O<v*4;O++){const re=Math.sin(O*78.233+9.7)*43758.5453;G[O]=re-Math.floor(re)}U.setAttribute("aSeed",new l.InstancedBufferAttribute(G,4)),U.instanceCount=v,g.drip=new l.ShaderMaterial({vertexShader:Zt,fragmentShader:$t,fog:!0,transparent:!0,depthWrite:!1,side:l.DoubleSide,uniforms:{...l.UniformsUtils.clone(l.UniformsLib.fog),...i,uDrip:{value:1},uWisp:g.steam.uniforms.uWisp,uBend:g.plank.uniforms.uBend,uBelly:g.plank.uniforms.uBelly}});const q=new l.Mesh(U,g.drip);q.name="drips",q.frustumCulled=!1,q.renderOrder=3,c.add(q)}await t.ctx.yield();const M=ce(),N=new l.Group;N.name="traveller";for(let v=0;v<3;v++){const U=[-.5,.5,0][v],G=[-1.9,-1.9,-1.1][v],q=15+e.range(-1,1.5),O=[],re=22;for(let ee=0;ee<=re;ee++)O.push(s(U,G+.25*Math.sin(ee/re*Math.PI),-q+2*q*ee/re));const ge=V($(o.bamboo,o.newWood,e.range(.1,.5)),e.range(.8,1.05));ae(M,O,.5,7,[0,0,0],{up:E,taper:ee=>(ee%3===0?1.13:1)*(.86+.14*ee/re)});const ze=(re+1)*8+14,oe=M.col.length-ze*3;for(let ee=0;ee<ze;ee++){const ie=Math.floor(ee/8),ne=ie<=re&&ie%3===0?.6:1;M.col[oe+ee*3]=ge[0]*ne,M.col[oe+ee*3+1]=ge[1]*ne,M.col[oe+ee*3+2]=ge[2]*ne}}for(const v of[-13,-7,0,7,13]){const U=[];for(let G=0;G<=8;G++){const q=G/8*Math.PI*2;U.push(s(Math.cos(q)*1.15,-1.6+Math.sin(q)*1,v))}ae(M,U,.15,4,V(o.rattan,.8),{up:F,caps:!1})}for(const v of[-11,11]){const U=[];for(let G=0;G<=8;G++){const q=G/8*Math.PI*2;U.push(s(Math.cos(q)*.55,-.4+Math.sin(q)*.95,v))}ae(M,U,.2,5,o.rope,{up:F,caps:!1})}for(const v of[-14,14])ae(M,[s(0,-2.3,v),s(0,-3.6,v)],.3,6,V(o.iron,.8),{up:F});N.add(new l.Mesh(ve(M),g.plain)),A.add(N);const R=ce();ae(R,[s(0,0,0),s(0,-.25,0),s(0,-.5,0),s(0,-.75,0),s(0,-1,0)],.2,6,V(o.rope,.82),{up:F});const K=ve(R),I=[],L=g.rope(.2,3);for(let v=0;v<4;v++){const U=new l.Mesh(K,L);U.frustumCulled=!1,A.add(U),I.push(U)}const te=[];for(let v=0;v<3;v++){const U=new l.Mesh(K,L);U.frustumCulled=!1,U.visible=!1,A.add(U),te.push(U)}const H=ce();ae(H,[s(0,-2.4,0),s(0,-2.1,0),s(0,2.1,0),s(0,2.4,0)],1,6,$(o.bamboo,o.newWood,.4),{up:F,taper:v=>[.12,.2,.17,.1][v]});const Q=new l.InstancedMesh(ve(H),g.plain,5);Q.frustumCulled=!1,u.add(Q),Object.assign(t,{carried:A,node:c,plank:B,pegs:a,steam:T,trav:N,slings:I,hauls:te,sticks:Q,rope:b}),await t.ctx.yield()}const Ht=`
#include <fog_pars_vertex>
${je}
attribute vec2 aCell;
varying vec2 vQ;
varying float vA;
varying vec3 vWp;
void main() {
  vec4 hole = hifHole(aCell);
  float cell = max(uRoof.z, 0.1);
  vec3 q = vec3(hole.x * cell / 1.25, 0., hole.y * cell);
  q.y = uRoof.x - uRoof.y * abs(q.x);
  float tEnd = q.y / max(uSunDir.y, 0.2);
  float t = position.y * tEnd;
  vec3 wp = q - uSunDir * t;
  vec3 toCam = cameraPosition - wp;
  float dist = length(toCam);
  vec3 sideV = cross(uSunDir, toCam / max(dist, 1e-3));
  float sl = length(sideV);
  sideV = sl > 1e-4 ? sideV / sl : vec3(1., 0., 0.);
  // From high on the hoist the pencils would stand in an even curtain between the eye and the ship: there only a few
  // of them are kept, broader and brighter (hiK = how high the eye is; it eases in and out as the eye rises and dives).
  float hiK = smoothstep(46., 62., cameraPosition.y);
  float pick = fract(sin(dot(aCell, vec2(12.9898, 78.233))) * 43758.5453);
  float th = mix(1.2, 0.05, hiK);
  float keep = 1. - smoothstep(th - 0.05, th + 0.05, pick);
  float w0 = (min(hole.z, 0.7) + 0.0027 * t) * (1. + 0.5 * hiK);
  float w = max(w0, 0.0019 * dist);
  wp += sideV * position.x * w;
  vQ = vec2(position.x, position.y);
  // the biggest holes make the brightest pencils; close to the eye a pencil thins out so it never veils the view
  // (a pencil seen nearly end-on, or within a few metres of the eye, would be a bright smear: it fades out)
  vA = hole.w * smoothstep(0.1, 0.55, hole.z) * smoothstep(8., 34., dist) * (w0 / max(w, 1e-3)) * smoothstep(0.1, 0.42, sl) * keep * (1. + 0.8 * hiK);
  vWp = wp;
  vec4 mvPosition = viewMatrix * vec4(wp, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,eo=`
#include <fog_pars_fragment>
uniform float uTime;
uniform vec3 uCoinCol;
uniform float uThread;
varying vec2 vQ;
varying float vA;
varying vec3 vWp;
void main() {
  float across = 1. - vQ.x * vQ.x;
  // smoke hangs in layers; they creep, so the pencils brighten and fade along their length
  float lay = 0.5 + 0.5 * sin(vWp.y * 0.21 + sin(vWp.z * 0.011 + uTime * 0.05) * 2.3 + vWp.x * 0.03);
  // the smoke of the bending fire hangs between 45 and 90 m: there a ray is a pencil of light; below it only a
  // faint thread of sawdust
  float high = smoothstep(36., 50., vWp.y) * (1. - smoothstep(86., 100., vWp.y));
  float smoke = 0.05 + 0.17 * smoothstep(12., 38., vWp.y) + 0.85 * high * (0.3 + 0.7 * lay * lay);
  float sparkle = 1. + 0.35 * sin(vWp.y * 0.31 + uTime * 1.7 + vWp.z * 0.2) * sin(vWp.y * 0.13 - uTime * 0.9 + vWp.x * 0.3);
  float a = vA * across * across * smoke * sparkle * uThread;
  // (light seen in smoke is paler and bluer than the coin it makes on timber)
  vec3 pc = mix(uCoinCol, vec3(dot(uCoinCol, vec3(0.3, 0.5, 0.2))) * vec3(0.9, 1.0, 1.14), 0.55);
  gl_FragColor = vec4(pc * a, 1.);
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      float ff = 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      float ff = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
    gl_FragColor.rgb *= 1. - ff * 0.85;
  #endif
}
`;function to(t){const{rng:e,shared:o,group:u}=t,g=Math.round(780*Math.max(.5,t.detail)),i=5,d=new l.InstancedBufferGeometry,E=[],F=[];for(let h=0;h<=i;h++)E.push(-1,h/i,0,1,h/i,0);for(let h=0;h<i;h++){const p=h*2;F.push(p,p+1,p+2,p+1,p+3,p+2)}d.setAttribute("position",new l.Float32BufferAttribute(E,3)),d.setIndex(F);const P=new Float32Array(g*2),_=new Set;for(let h=0;h<g;h++){let p,n,m=0;do p=e.int(-17,16),n=e.int(-154,8),m++;while(_.has(p*1e3+n)&&m<8);_.add(p*1e3+n),P[h*2]=p,P[h*2+1]=n}const x=[];for(const h of t.thin){const p=Math.ceil(h[2]*1.35);for(let n=-p;n<=p;n++)for(let m=-p;m<=p;m++){const B=Math.round(h[0])+m,C=Math.round(h[1])+n;m*m+n*n>p*p||_.has(B*1e3+C)||(_.add(B*1e3+C),x.push(B,C))}}const z=g+x.length/2,b=new Float32Array(z*2);b.set(P),b.set(x,g*2),d.setAttribute("aCell",new l.InstancedBufferAttribute(b,2)),d.instanceCount=z;const A=new l.ShaderMaterial({vertexShader:Ht,fragmentShader:eo,fog:!0,transparent:!0,depthWrite:!1,blending:l.AdditiveBlending,side:l.DoubleSide,uniforms:{...l.UniformsUtils.clone(l.UniformsLib.fog),...o,uThread:t.uThread}}),c=new l.Mesh(d,A);c.name="threads",c.frustumCulled=!1,c.renderOrder=4,u.add(c),t.threads=c}function oo(t){const{rng:e,C:o,group:u,mats:g}=t,i=ce(),d=new l.Group;d.name="garland";const E=ut(34/95),F=t.palmGarland,P=s(0,1,0),_=(b,A,c)=>{const h=new l.Vector3().crossVectors(P,A);h.lengthSq()<1e-4&&h.set(1,0,0),h.normalize();const p=new l.Vector3().crossVectors(A,h),n=e.range(0,6.28),m=F?4:5,B=e.range(.82,1),C=F?V(o.bamboo,1.1):[.86,.52,.05],a=F?V($(o.newWood,o.pale,.55),1.25*B):[.92*B,.9*B,.8*B];for(let f=0;f<m;f++){const r=F?n+f*1.571+e.range(-.2,.2):n+f/m*Math.PI*2,w=F?.24:.66,k=i.n,T=h.clone().multiplyScalar(Math.cos(r)).addScaledVector(p,Math.sin(r)),M=h.clone().multiplyScalar(-Math.sin(r)).addScaledVector(p,Math.cos(r)),N=F?c*1.7:c,R=[b.clone(),b.clone().addScaledVector(T,N*.6).addScaledVector(M,N*w*.5).addScaledVector(A,.14*N),b.clone().addScaledVector(T,N).addScaledVector(A,F?-.2:.3*N),b.clone().addScaledVector(T,N*.6).addScaledVector(M,-N*w*.5).addScaledVector(A,.14*N)];for(let K=0;K<4;K++){i.pos.push(R[K].x,R[K].y,R[K].z),i.nrm.push(A.x,A.y,A.z);const I=K===0?C:a;i.col.push(I[0],I[1],I[2]),i.uv.push(K,f)}i.idx.push(k,k+1,k+2,k,k+2,k+3),i.n+=4}},x=(b,A,c,h)=>{ae(i,b,.12,4,V(o.rattan,.7),{up:P,caps:!1});const p=b.length-1;for(let n=0;n<A;n++){const m=(n+.5)/A*p,B=Math.min(Math.floor(m),p-1),C=m-B,a=b[B].clone().lerp(b[B+1],C),f=h(a).normalize();a.addScaledVector(f,.25).add(s(e.range(-.12,.12),e.range(-.18,.18),e.range(-.12,.12))),f.add(s(e.range(-.3,.3),e.range(-.2,.45),e.range(-.3,.3))).normalize(),_(a,f,c*e.range(.85,1.2))}},z=b=>s(b.x,.15,b.z*.9);for(let b=0;b<2;b++){const A=[];for(let c=0;c<=24;c++){const h=c/24*Math.PI*2+b*.13;A.push(s(Math.sin(h)*2.5,(b?-.85:.2)-1.2*(.5+.5*Math.cos(h))+.4*Math.sin(h*2),Math.cos(h)*2.9))}x(A,F?18:30,.62,z)}{const b=[],A=s(-2.65,-.6,-.9),c=s(1.5,-1.6,2.75);for(let n=0;n<=12;n++){const m=n/12,B=Math.PI*.5*m;b.push(s(D(A.x,c.x,m)-.9*Math.sin(Math.PI*m),D(A.y,c.y,m)-4.2*4*m*(1-m),D(A.z,c.z,Math.sin(B))+.7*Math.sin(Math.PI*m)))}x(b,F?12:22,.7,n=>s(n.x-.4,.1,n.z+.6));const h=[],p=[];for(let n=0;n<=6;n++){const m=n/6;h.push(s(-2.75-.25*m,-1.2-6.2*m,.9+.5*Math.sin(m*2.5))),p.push(s(-.7+.3*Math.sin(m*3),-1.9-4.6*m,3.05+.25*m))}x(h,F?6:11,.66,n=>s(-1,.1,.45)),x(p,F?5:8,.62,n=>s(-.35,.1,1))}d.add(new l.Mesh(ve(i),g.cloth)),d.position.set(0,E.y+1.6,E.z+.3),d.rotation.x=-.36,u.add(d),t.garland=d}const pt={noon:{coin:[1,.86,.5],gain:5.7,up:[.55,.62,.6],down:[.86,.69,.44],port:[.2,.56,.2],star:[.12,.5,.58],wet:0,holes:.42,thread:.06,steam:1,ember:[3,.84,.14],form:[.62,.8,.34],sheen:[.05,.07,.075],gloss:.72},rain:{coin:[.8,.92,1],gain:4.4,up:[.34,.38,.4],down:[.62,.62,.56],port:[.14,.34,.2],star:[.1,.36,.4],wet:1,holes:.5,thread:.06,steam:1.9,ember:[2.4,.63,.09],form:[.4,.55,.14],sheen:[.07,.1,.12],gloss:.7},night:{coin:[.62,.74,1],gain:7,up:[.5,.65,1.3],down:[.4,.52,1],port:[.05,.14,.2],star:[.08,.2,.3],glaze:[.012,.02,.05],wet:0,holes:.42,thread:.026,steam:.8,ember:[8,1.9,.2],form:[.3,.3,.1],sheen:[.04,.06,.14],gloss:.5}};async function io(t,e={}){const o=t.rng,u=(e.palette&&e.palette.length>=7?e.palette:Ut).map(At),g=t.quality?.detail??1,i=new l.Group;i.name="hull-in-frames";const d={uTime:{value:0},uSunDir:{value:new l.Vector3(.1,.985,.14).normalize()},uCoinCol:{value:new l.Color},uRoof:{value:new l.Vector4(118,.75,3.2,.42)},uFillUp:{value:new l.Color},uFillDown:{value:new l.Color},uFillPort:{value:new l.Color},uFillStar:{value:new l.Color},uWetAll:{value:0},uGlaze:{value:new l.Color(0,0,0)},uEmber:{value:new l.Color(0,0,0)},uForm:{value:new l.Vector3(.34,.3,.3)},uThinA:{value:new l.Vector4(0,0,1,0)},uThinB:{value:new l.Vector4(0,0,1,0)}};e.sun&&d.uSunDir.value.set(e.sun[0],e.sun[1],e.sun[2]).normalize();const E=[];for(let S=0;S<Math.min(2,(e.thin||[]).length);S++){const[y,j,W,Y,J]=e.thin[S],se=d.uSunDir.value,Me=d.uRoof.value,Ue=Math.max(se.y+Me.y*se.x*(y<0?-1:1),.25),ue=Math.max((Me.x-Me.y*Math.abs(y)-j)/Ue,0),Ve=(y+se.x*ue)*1.25/Me.z,We=(W+se.z*ue)/Me.z,we=Y/Me.z;E.push([Ve,We,we,J]),(S?d.uThinB:d.uThinA).value.set(Ve,We,we,J)}const F={value:.07};let P=1,_=pt.noon;const x=S=>{const y=pt[S]||pt.noon;_=y,d.uCoinCol.value.setRGB(y.coin[0]*y.gain,y.coin[1]*y.gain,y.coin[2]*y.gain),d.uFillUp.value.setRGB(...y.up),d.uFillDown.value.setRGB(...y.down),d.uFillPort.value.setRGB(...y.port),d.uFillStar.value.setRGB(...y.star),d.uWetAll.value=y.wet,d.uGlaze.value.setRGB(...y.glaze||[0,0,0]),d.uRoof.value.w=y.holes,F.value=y.thread,P=y.steam,d.uEmber.value.setRGB(...y.ember||[0,0,0]),d.uForm.value.set(...y.form||[.34,.3,.3])};x(e.look||"noon");const z=e.teak??o.chance(.35),b={iron:$(V(u[0],z?2.4:1.75),V(u[2],.3),.2),newWood:V(u[1],.82),pale:V(u[5],.8),ash:V(u[2],.8),bamboo:V(u[4],1.05),rattan:V(u[1],.9),rope:V($(u[1],u[2],.55),.6),peg:V($(u[1],u[5],.4),.9),white:V(u[5],.92)},A={wood:Ke(d,{scallop:1}),woodDouble:Ke(d,{scallop:.6,side:l.DoubleSide}),plank:new l.ShaderMaterial({vertexShader:St,fragmentShader:qt,fog:!0,uniforms:{...l.UniformsUtils.clone(l.UniformsLib.fog),...d,uBend:{value:1},uBelly:{value:0},uBendOn:{value:1},uSheen:{value:new l.Color(0,0,0)},uGloss:{value:0},uFaceY:{value:30},uBerth:{value:new l.Vector4(-23.7,-354,.236,-.972)},uEdge:{value:new l.Color(...V($(b.newWood,b.pale,.35),.8))}}}),peg:Ke(d,{scallop:0,grainK:.3}),rope:(S,y)=>Ke(d,{scallop:0,grainK:.35,twist:y/(2*Math.PI*S)}),plain:Ke(d,{scallop:0}),lash:Ke(d,{scallop:0,wrap:1}),cloth:Ke(d,{scallop:0,side:l.DoubleSide})};A.plank.uniforms.uSheen.value.setRGB(..._.sheen),A.plank.uniforms.uGloss.value=_.gloss;const c={ctx:t,rng:o,C:b,group:i,mats:A,shared:d,detail:g,teak:z,uThread:F,thin:E,day:!!e.day,path:e.path||Gt,palmGarland:o.chance(.4),newRibs:e.newRibs||0,ropePts:e.rope||Et,spallSkip:e.spallSkip||null,paleRibs:!!e.paleRibs};e.garland&&(c.palmGarland=e.garland==="palm"),await t.yield(),await It(c),await Ot(c),await jt(c),await Jt(c),oo(c),e.threads!==!1&&to(c),await t.yield();const h=-354,p=-394,n=30,m=63,B=69,C=s(-Ie(h,n),n,h),a=s(-Ie(p,n),n,p),f=a.clone().sub(C).normalize(),r=s(-f.z,0,f.x).normalize(),w=new l.Vector3().crossVectors(f,r);r.x<0&&(r.multiplyScalar(-1),w.multiplyScalar(-1));const k=C.clone().add(a).multiplyScalar(.5),T=pe(Ie((h+p)/2,n)+k.x,0,2.5);let M=.3;for(let S=m;S<=B;S++){const y=Te-Pe*S,j=pe((y-k.z)/f.z,-20,20),W=(j+20)/40,Y=k.x+f.x*j,J=Ie(y,n)+Y;M=Math.max(M,.25+.08+T*4*W*(1-W)-J*Math.abs(r.x))}A.plank.uniforms.uFaceY.value=n;{const S=Math.hypot(a.x-C.x,a.z-C.z);A.plank.uniforms.uBerth.value.set(C.x,C.z,(a.x-C.x)/S,(a.z-C.z)/S)}const N=k.clone().addScaledVector(r,M),R=new l.Quaternion().setFromRotationMatrix(new l.Matrix4().makeBasis(f,r,w)),K=[],I=ce(),L=[63,64,64,65,66,67,67,68,69],te=[63,65,66,68,69];for(let S=0;S<9;S++){const y=Te-Pe*L[S],j=S>0&&L[S-1]===L[S];c.pegX[S]=pe((y-k.z)/f.z,-19.2,19.2)+(j?.12:-.05),c.pegZ[S]=(j?.62:L[S+1]===L[S]?-.62:S&1?.3:-.3)+c.pegZ[S]*.3}for(let S=0;S<5;S++){const y=Te-Pe*te[S],j=Ie(y,n),W=-(j+2.9),Y=-(j-1.35);for(let J=0;J<2;J++){const se=[],Ue=n+(J?-1.5:1.5),ue=.45,Ve=[[W+ue,-1.15],[Y-ue,-1.15],[Y,-1.15+ue],[Y,1.15-ue],[Y-ue,1.15],[W+ue,1.15],[W,1.15-ue],[W,-1.15+ue],[W+ue,-1.15]];for(const We of Ve)se.push(s(We[0],Ue+.06*Math.sin(We[0]*3+J),y+We[1]));ae(I,se,.1,6,V(b.rope,1.25-.2*J),{up:s(0,1,0),caps:!1})}for(const J of[.55,1])ae(I,[s(Y,n+1.5,y+J),s(Y+.12,n,y+.78+(J-.78)*.4),s(Y,n-1.5,y+J)],.095,6,V(b.rope,1.15),{up:s(0,0,1)});K.push(s(Y+.15,n+(S&1?.35:-.35),y+.78))}const H=[],Q=[18.6,.5,-18.6];for(const[S,y]of[[69,46.5],[66,49.5],[63,46.5]]){const j=Te-Pe*S,W=-(Ie(j,y)-.75),Y=j+1.15;H.push(s(W,y,Y)),ae(I,[s(W-.1,y+.9,Y),s(W,y+.55,Y),s(W,y-.55,Y),s(W-.1,y-.9,Y)],1,7,V(b.iron,1.5),{up:s(0,0,1),taper:J=>[.22,.5,.5,.22][J]}),ae(I,[s(W-1.2,y+1,j-1.2),s(W+.1,y+1,j-1.2),s(W+.1,y+1,j+1.2),s(W-1.2,y+1,j+1.2)],.1,5,V(b.rope,1.2),{up:s(0,1,0),caps:!1})}const v=new l.Mesh(ve(I),A.rope(.1,3));v.name="windlasses",i.add(v);for(const S of c.rankScarf||[]){const y=nt(S.z,S.y),j=Math.hypot(y.nx,y.ny)||1,W=s(y.ny/j,y.nx/j,0),Y=s(-y.nx,y.ny,0),J=Math.abs(Math.sin(S.z*12.9898)*43758.5453)%1,se=J*7.3%1,Me=(se-.5)*.7,Ue=1.05+1*J,ue=1.3,Ve=s(-S.x+W.x*Me,S.y+W.y*Me,S.z),We=.42+.2*se;ct(c.lashAcc,Ve,Y,.9,ue,Ue,.06,(Be,Xe,Ye)=>{const He=We*(.86+.28*((Xe*5+(Be&1)+Math.floor(J*9))%4)/3);return Ye[0]=b.rattan[0]*He,Ye[1]=b.rattan[1]*He,Ye[2]=b.rattan[2]*He,Ye},4.2,S.z);const we=s(Ve.x+W.x*Ue*.3-Y.x*(ue+.07),Ve.y+W.y*Ue*.3-Y.y*(ue+.07),S.z+.25+.45*J);ae(c.lashAcc,[we,we.clone().add(s(.1,-.35,.08)),we.clone().add(s(.2,-.9-.5*J,.2)),we.clone().add(s(.22,-1.5-.8*J,.16))],.05,5,V(b.rattan,.62),{taper:Be=>1-.18*Be}),ae(c.lashAcc,[we.clone().add(s(0,.09,-.08)),we.clone().add(s(.03,0,0)),we.clone().add(s(0,-.09,.08))],1,7,V(b.rattan,.5),{taper:Be=>[.05,.1,.05][Be],nT:Be=>[-1.2,0,1.2][Be]})}for(const S of[10.3,26.7,43.5])for(let y=0;y<6;y++){const j=S+y*.4,W=$e*D(1,.82,(j-2.6)/69.4);c.lash(s(0,j,Ge*(j-2.6)),s(0,1,0),s(1,0,0),W*1.08+.11,W+.11,V($(b.rattan,b.iron,.45),.5+.09*((y*3+(S|0))%3)),.1,.21)}const U=new l.Mesh(ve(c.lashAcc),A.lash);U.name="lashings",i.add(U),await t.yield();let G=null,q=null;const O={...Lt,...e.ride||{}},re=new l.Vector3(1,1,1),ge=e.demoU??.42,ze=new l.Vector3,oe=new l.Vector3,ee=new l.Vector3,ie=new l.Vector3(0,1,0),ne=new l.Vector3,le=new l.Quaternion,ke=new l.Quaternion,fe=new l.Matrix4,Se=new l.Euler,xe=new l.Vector3,Ee=new l.Vector3,be=new l.Vector3,Ne=new l.Vector3,Ce=new l.Vector3(0,-1,0),Fe=new l.Vector3,Le=new l.Vector3,Je=new l.Vector3,dt=new l.Vector3(1,1,1),Oe=new l.Quaternion,_e=[0];for(let S=1;S<c.path.length;S++)_e.push(_e[S-1]+Math.hypot(c.path[S][0]-c.path[S-1][0],c.path[S][1]-c.path[S-1][1],c.path[S][2]-c.path[S-1][2]));const vt=(S,y)=>{const j=pe(S,0,1)*_e[_e.length-1];let W=0;for(;W<_e.length-2&&_e[W+1]<j;)W++;const Y=(j-_e[W])/Math.max(_e[W+1]-_e[W],1e-4),J=c.path[W],se=c.path[W+1];return y.set(D(J[0],se[0],Y),D(J[1],se[1],Y),D(J[2],se[2],Y))},mt=.8065,st=.0075,gt=(S,y)=>pe((S-(mt+y*st))/st,0,1)*3;let wt=1,xt=0;const rt=(S,y,j)=>{const W=pe((S+20)/40,0,1);return(1-y)*4*W*W-j*4*W*(1-W)},yt=A.plank.uniforms;function bt(S,y,j){d.uTime.value=y,c.rudder.rotation.set(c.rudderRake,c.rudderPose.yaw+.07*Math.sin(y*.23)+.03*Math.sin(y*.61+1),0),c.garland.rotation.set(-.36+.025*Math.sin(y*.8),.03*Math.sin(y*.53+2),.02*Math.sin(y*1.1));const W=G===null?ge:G;if(G===null||!j)vt(W,ze),vt(Math.min(W+.01,1),oe),oe.sub(ze),oe.lengthSq()<1e-8&&oe.set(0,0,-1);else{const X=j.matrixWorld.elements;ze.set(X[12],X[13],X[14]),oe.set(-X[8],-X[9],-X[10]),q&&oe.copy(q)}oe.y=0,oe.lengthSq()<1e-6&&oe.set(0,0,-1),oe.normalize(),ee.crossVectors(oe,ie).normalize(),c.carried.visible=W>.12;const Y=de(.12,.24,W),J=Math.sin(y*.698),se=de(.69,.765,W),Me=de(.205,.285,W);ne.copy(ze).addScaledVector(ee,-D(O.rise??4,O.left,Me)).addScaledVector(oe,O.ahead-34*(1-Y)),ne.y+=-D(5,O.down,Me)-16*(1-Y)*(1-Y);const Ue=ne.z,ue=ne.x,Ve=.0524*Math.sin(y*.31+.7)*Y;ne.addScaledVector(ee,-(.6*(1+J)+O.ahead*Math.sin(Ve))*Y),ne.y-=.45*Math.pow(Math.sin(y*.37),2)+.12*J*J,fe.makeBasis(oe,ie,ee),le.setFromRotationMatrix(fe),Se.set(-.05*J,Ve,.012*Math.sin(y*.53)+.12*(1-de(.215,.315,W))),ke.setFromEuler(Se),le.multiply(ke),c.node.position.copy(ne).lerp(N,se),c.node.position.y+=1*Math.sin(se*Math.PI)*(se<1?1:0),c.node.position.addScaledVector(ee,-4.5*Math.sin(se*Math.PI)*(1-se)),c.node.quaternion.copy(le).slerp(R,se),c.node.updateMatrixWorld(!0);const We=de(.8,.87,W),we=Math.max(1-de(.705,.765,W),We),Be=T*We;yt.uBend.value=we,yt.uBelly.value=Be,wt=we,xt=Be,A.steam.uniforms.uSteam.value=P*(1-.35*de(.86,.95,W))*(.45+.55*Y+.6*(1-Y))*(1+1*se),A.steam.uniforms.uFlow.value=D(16,1,se),A.steam.uniforms.uRise.value=D(1,1.45,se),A.steam.uniforms.uWisp.value=se,A.drip.uniforms.uDrip.value=.7+.3*P;for(let X=0;X<9;X++){const he=gt(W,X),qe=Math.min(Math.floor(he),3),ot=he-Math.floor(he),et=Math.min(1,(qe+(qe<3?de(0,.35,ot):0))/3),zt=de(.7,.76,W);re.set(1,D(.3,1,zt),1),be.set(c.pegX[X],D(-.14,1.35,zt)-2.3*et+rt(c.pegX[X],we,Be),c.pegZ[X]),fe.compose(be,Oe,re),c.pegs.setMatrixAt(X,fe)}c.pegs.instanceMatrix.needsUpdate=!0;const Xe=Math.max(Ue,-338),Ye=c.ropeX(Xe);c.trav.position.set(Ye,c.ropeY(Xe),Xe),c.trav.rotation.set(0,(Wt-Rt)/520,.03*J);const He=de(.718,.745,W),Mt=1-de(.8,.97,W);for(let X=0;X<4;X++){const he=X<2?1:-1,qe=X&1?1:-1;xe.set(c.ropeX(Xe-14*he),c.trav.position.y-3.6,Xe-14*he),Ee.set(14*he,-.2,1.22*qe).applyMatrix4(c.node.matrixWorld),Ne.set(xe.x+qe*.5+1.6*Mt*Math.sin(y*.9+he),xe.y-6.5,xe.z+2*Mt*Math.sin(y*.7+he*2+1)),Ee.lerp(Ne,He),be.subVectors(Ee,xe);const ot=Math.max(be.length(),.01);be.multiplyScalar(1/ot);const et=c.slings[X];et.position.copy(xe),et.quaternion.setFromUnitVectors(Ce,be),et.scale.set(1,ot,1)}for(let X=0;X<5;X++){const he=.6+X*1.1+de(.795+X*.004,.865+X*.002,W)*Math.PI*4+.05*Math.sin(y*1.3+X);Le.copy(w).multiplyScalar(Math.cos(he)).addScaledVector(f,Math.sin(he)),Je.copy(r),Fe.crossVectors(Le,Je),fe.makeBasis(Fe,Le,Je),fe.setPosition(K[X]),c.sticks.setMatrixAt(X,fe)}c.sticks.instanceMatrix.needsUpdate=!0;const lt=de(.688,.712,W);for(let X=0;X<3;X++){const he=c.hauls[X];if(he.visible=lt>.01,!he.visible)continue;Ee.set(Q[X],-.3+rt(Q[X],we,Be),X===1?1.1:0).applyMatrix4(c.node.matrixWorld),be.subVectors(Ee,H[X]);const qe=Math.max(be.length(),.01);be.multiplyScalar(1/qe),he.position.copy(H[X]),he.quaternion.setFromUnitVectors(Ce,be),he.scale.set(lt,qe,lt)}}bt(0,0,null);const _t={portalSeat:{position:s(-9.5,34,kt),facing:s(0,0,1)},flyThrough:c.path.map(S=>s(S[0],S[1],S[2])),ridgeRope:[s(Wt,c.ropeY(100),100),s(Rt,c.ropeY(-420),-420)],sternMark:s(0,30,10),towerSite:s(24,0,-150),coilSite:s(-8.5,36,-200),berth:{from:C.clone(),to:a.clone()},stemGarland:c.garland.position.clone(),gantry:{uprightX:-18,barY:43.5,z:kt},counter:[c.counter.left.clone(),c.counter.right.clone()],haulBlocks:H.map(S=>S.clone()),ribAt:(S,y,j,W=new l.Vector3)=>{const Y=Te-Pe*pe(Math.round(S),0,ye-1);return W.set(y*Ie(Y,j),j,Y)},halfBreadth:Ie,sheer:tt};return{object:i,radius:130,height:96,center:new l.Vector3(0,36,-215),anchors:_t,ground:!0,groundY:0,carried:c.carried,ride:O,rudder:c.rudderPose,light:{uniforms:d,glsl:je,apply:x,threadGain:F},materials:A,setProgress(S,y){G=S,q=y||null},setLook:x,update:bt,dispose(){},tools:{makeAcc:ce,accGeometry:ve,sweep:me,beam:De,bar:ae,profRect:Ae,profRound:it,framesFrom:Ze,makeWood:Ke,hexLin:At,mixC:$,mulC:V,C:b,berthPos:N,bX:f,bY:r,bZ:w,pegX:c.pegX,knock:gt,PEG_U0:mt,PEG_DU:st,plankAt:(S,y,j,W)=>W.set(S,y,j).applyMatrix4(c.node.matrixWorld),pegAt:(S,y)=>y.copy(N).addScaledVector(f,c.pegX[S]).addScaledVector(r,.3+rt(c.pegX[S],wt,xt)).addScaledVector(w,c.pegZ[S])}}}export{io as buildHero};
