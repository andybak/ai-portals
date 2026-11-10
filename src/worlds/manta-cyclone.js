import*as e from"three";import{makePath as s0}from"../kit/core.js";import{buildHero as n0,NOISE_GLSL as i0,FOG_FADE_GLSL as r0,SHAFT_FN_GLSL as l0,BEAM_GLSL as De}from"../parts/manta-cyclone.js";const E=-28,P=(c,z,R)=>{const b=Math.min(1,Math.max(0,(R-c)/(z-c)));return b*b*(3-2*b)},Wt=`
varying vec3 vW;
varying vec3 vN;
varying vec3 vCol;
#include <fog_pars_vertex>
`,Pt=`
uniform float uTime;
uniform vec3 uAmbUp;
uniform vec3 uAmbDown;
uniform vec3 uKeyCol;
uniform vec3 uSunCol;
uniform float uSun;
uniform float uCaustic;
uniform float uShaft;
uniform vec3 uShaftB;
uniform float uShaftR;
uniform vec3 uFogUp;
uniform vec3 uFogDn;
uniform vec3 uSunW;
uniform float uTurn;
uniform vec3 uShaftA;
uniform vec3 uShaftCol;
uniform vec3 uFogFar;
uniform float uFogFarK;
varying vec3 vW;
varying vec3 vN;
varying vec3 vCol;
#include <fog_pars_fragment>
${i0}
${l0}
${De}
// a world point in the hero's local space (y above the sand; z mirrored when the column turns the other way)
vec3 toHero(vec3 w) { return vec3(w.x, w.y + 28.0, w.z * uTurn); }
// the broad shaft's light in the water between the lens and this fragment
vec3 wGlow() { return shaftGlow(toHero(cameraPosition), toHero(vW), 1.0); }
// the water a thing fades into: cyan-blue looking up, deep blue looking down, and deeper blue far from the lens
#ifdef USE_FOG
vec3 wFogCol(float h, float f) {
  return mix(fogColor, uFogFar, uFogFarK * smoothstep(0.3, 1.0, f)) * mix(vec3(1.0), uFogUp, smoothstep(0.0, 0.64, h)) * mix(vec3(1.0), uFogDn, smoothstep(0.0, 0.5, -h));
}
#endif
// clear scales the fog's thickness (a huge value: water at infinity, whatever the density); keep is how much of the
// blue stays behind the broad shaft (0.3 for water, sand, ceiling and animals, so the column runs unbroken from the
// water onto the ceiling); veil scales the shaft's own light laid over the thing (the sand inside the gold disc takes
// less of it: we look down the whole length of the column there, and a full veil would hide the shadows in the disc)
vec3 wFogKV(vec3 col, float clear, float keep, float veil) {
#ifdef USE_FOG
  #ifdef FOG_EXP2
    float fd = min(vFogDepth * fogDensity * clear, 30.0);
    float f = 1.0 - exp(-fd * fd);
  #else
    float f = smoothstep(fogNear, fogFar, vFogDepth);
  #endif
  float h = normalize(vW - cameraPosition + vec3(0.0, 1e-5, 0.0)).y;
  // the shaft is gold light, not white: where it glows it also takes the blue out of the water behind it
  vec3 g = wGlow() * veil;
  vec3 gold = uShaftWarm / max(max(uShaftWarm.r, uShaftWarm.g), 1e-3);
  return mix(col, wFogCol(h, f), f) * mix(vec3(1.0), keep + (1.0 - keep) * gold, clamp(max(g.r, g.g) * 2.2, 0.0, 1.0)) + g;
#else
  return col + wGlow() * veil;
#endif
}
vec3 wFogK(vec3 col, float clear, float keep) { return wFogKV(col, clear, keep, 1.0); }
vec3 wFog(vec3 col, float clear) { return wFogKV(col, clear, 0.3, 1.0); }
`,ve=`
${Wt}
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vW = wp.xyz; vN = vec3(0.0, 1.0, 0.0); vCol = vec3(1.0);
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,h0=`
${Pt}
void main() { gl_FragColor = vec4(wFog(vec3(0.0), 1000.0), 1.0); }
`,c0=`
${Pt}
uniform float uRain;
uniform float uRagged;
uniform float uGap;
uniform float uGapW;      // how wide the gap round the sun is (in q)
uniform vec2 uRiftQ;      // where the tear in the cloud ends: it runs from the sun's place (uMoonQ) to here
uniform float uMoon;
uniform float uBio;
uniform vec2 uMoonQ;
uniform vec3 uRing;       // xz of the cloud bank that stands behind the exit ring, strength
uniform vec4 uHole;       // the breach: xz, radius, strength
uniform vec3 uCloud;
uniform vec3 uCloudDark;
uniform vec3 uGapCol;
uniform vec3 uGapTint;    // the blaze outside its core (gold by day; only the core is white)
uniform vec3 uMirror;
// one hashed cell per octave: a ring is born anywhere in its cell, widens for 0.7 s and dies, then the cell rests. The
// line keeps its own width (1-3 cm) plus under a pixel of filter: where a pixel is wider than the line it DIMS, it does
// not grow, so a ring 15 m off is a faint hair, never a disc
vec3 ring(vec2 p, float cell, float t, float fw) {
  vec2 g = p / cell;
  vec2 id = floor(g), f = fract(g);
  float h = h21(id), rate = 0.55 + 0.35 * h21(id + 7.7);
  float ck = t * rate + h * 9.0;
  float life = fract(ck) * 2.4;
  float ep = floor(ck);
  float rmax = min(0.3, 0.3 * cell), m = 0.75 * rmax / cell + 0.02;
  vec2 c = m + (1.0 - 2.0 * m) * vec2(h21(id + ep * 0.37 + 3.1), h21(id - ep * 0.53 + 5.9));
  float on = step(life, 1.0);
  float rd = length(f - c) * cell;
  float d = abs(rd - min(0.05 + 0.24 * life * cell, rmax));                           // rings 0.1 to 0.6 m across
  float w = 0.01 + 0.018 * life;
  float edge = min(min(f.x, 1.0 - f.x), min(f.y, 1.0 - f.y)) * cell;
  float far = (1.0 - smoothstep(0.05, 0.2, fw / cell)) * smoothstep(0.0, 0.05, edge);
  float line = (1.0 - smoothstep(w, w + fw * 0.75 + 0.003, d)) * (w / (w + fw)) * (1.0 - life) * (1.0 - life) * on * far;
  float splash = (1.0 - smoothstep(0.0, 0.05 + fw * 0.75, rd)) * (0.05 / (0.05 + fw)) * (1.0 - life) * on * far;
  // the fringe: bubbles the drop drove down, a 10 cm band of beads round the ring that dips and comes back up (each
  // bead on its own beat); beads smaller than a pixel melt into a faint band
  vec2 bq = (f - c) * cell * 30.0;
  float bead = 1.0 - smoothstep(0.12, 0.42, length(fract(bq) - 0.5));
  float bh = h21(floor(bq) + id * 3.7);
  bead *= step(0.45, bh) * max(0.45 + 0.55 * sin(t * 5.0 + bh * 40.0), 0.0);
  float fringe = (1.0 - smoothstep(0.015, 0.06, d)) * mix(bead, 0.14, smoothstep(0.008, 0.03, fw)) * (1.0 - life) * on * far;
  return vec3(line, splash, fringe);
}
// beyond the reach of the rings: one soft spark in a cell a few pixels wide, each on its own clock
float spark(vec2 p, float cs, float t) {
  vec2 g = p / cs, id = floor(g), f = fract(g);
  float h = h21(id + 0.37);
  float ph = fract(t * (0.5 + 0.7 * h21(id + 4.1)) + h * 11.0);
  vec2 c = 0.3 + 0.4 * vec2(h21(id + 1.3), h21(id + 8.7));
  return (1.0 - smoothstep(0.1, 0.34, length(f - c))) * step(0.68, h) * smoothstep(0.0, 0.12, ph) * (1.0 - smoothstep(0.12, 0.5, ph));
}
void main() {
  vec3 V = normalize(vW - cameraPosition + vec3(0.0, 1e-5, 0.0));
  vec2 p = vW.xz;
  vec2 fwv = fwidth(p);
  float fw = max(fwv.x, fwv.y);
  float t = uTime;
  float n1 = vn(p * 0.35 + vec2(t * 0.11, -t * 0.07)), n2 = vn(p * 1.3 - vec2(t * 0.23, t * 0.17));
  float rip = (n1 - 0.5) + 0.5 * (n2 - 0.5);
  // three octaves on grids turned against one another, so no lattice shows
  vec2 p2 = vec2(p.x * 0.8 - p.y * 0.6, p.x * 0.6 + p.y * 0.8) + 13.7, p3 = vec2(p.x * 0.28 + p.y * 0.96, p.y * 0.28 - p.x * 0.96) - 29.1;
  vec3 rr = ring(p, 0.9, t, fw) + ring(p2, 1.3, t * 0.93, fw) + ring(p3, 1.9, t * 0.87, fw);
  float lod = log2(max(fw, 0.004) * 5.0), l0 = floor(lod);
  float shim = mix(spark(p, exp2(l0), t), spark(p + 31.7, exp2(l0 + 1.0), t), lod - l0) * smoothstep(0.035, 0.13, fw) * (1.0 - smoothstep(0.45, 1.3, fw));
  float rings = rr.x * uRain;
  float cosT = abs(V.y) + rip * uRagged + rings * 0.04;
  float win = smoothstep(0.60, 0.69, cosT);
  // the sky squeezed into the window: q is the horizontal part of the refracted ray (0 zenith .. 1 horizon)
  vec2 q = V.xz / 0.75;
  float ql = min(length(q), 1.0);
  vec2 c = q / max(sqrt(max(1.0 - ql * ql, 0.0)), 0.3) + p * 0.004 + vec2(t * 0.012, t * 0.007);
  float cl = vn(c * 1.7) * 0.55 + vn(c * 4.3 + 7.0) * 0.3 + vn(c * 9.7 - 3.0) * 0.15;
  vec3 sky = mix(uCloudDark, uCloud, smoothstep(0.3, 0.72, cl));
  // the squall's darkest bank stands over the exit, so the ring hangs on mirror-dark water, not on bright cloud; inside
  // the bank window and mirror are one tone, so the window's rim does not show there
  float bank = (1.0 - smoothstep(9.0, 27.0, length(p - uRing.xy) + (cl - 0.5) * 9.0)) * uRing.z;
  sky = mix(sky, uMirror * vec3(0.8, 1.0, 1.3) * (1.6 + 2.2 * cl), bank * 0.88);      // (the bank is slate blue, not neutral grey)
  win *= 1.0 - 0.9 * bank;
  // the tear: widest and brightest round the sun, running out from it along a ragged rift in the cloud
  vec2 ra = uRiftQ - uMoonQ;
  float rt = clamp(dot(q - uMoonQ, ra) / max(dot(ra, ra), 1e-4), 0.0, 1.0);
  float gd = length(q - uMoonQ - ra * rt) + (cl - 0.5) * 0.3 + (vn(c * 9.7 - 3.0) - 0.5) * 0.1 + 0.05 * rt * sin(rt * 9.0 + cl * 6.0);
  float gap = (1.0 - smoothstep(0.03 * (1.0 - rt), mix(uGapW, 0.15, rt), gd)) * uGap * (1.0 - 0.55 * rt);
  // a ragged blaze of pale gold, luminous through its whole body, with only its core (round the sun) white. Where the
  // tear is thin (its edge, the rift, the gap before the squall tears) it is the cloud itself lit from behind: silver,
  // brighter and a little warm, then cream, then gold. Never a dull orange laid over grey cloud, which reads as tan
  float core = smoothstep(0.94, 1.0, gap) * (1.0 - 0.6 * rt);
  float body = smoothstep(0.45, 0.85, gap);
  vec3 silver = sky * (1.0 + 2.2 * gap) + uGapCol * (0.22 * gap);
  vec3 gapLit = uGapCol * mix(uGapTint, vec3(1.0), core) * (0.88 + 1.3 * core) * body;
  sky = silver * (1.0 - body) + gapLit;
  // gold threads fan out from the tear across the window: the sun's rays in the water, seen from below, all running
  // out from where the sun stands (a sum of whole multiples of the bearing, so there is no seam), drifting and
  // flickering; they come with the tear and die away toward the window's rim
  vec2 dq = q - uMoonQ;
  float tb = atan(dq.y, dq.x + 1e-5), tr = length(dq);
  float th1 = 0.5 + 0.5 * sin(tb * 13.0 + 2.0 * sin(tb * 4.0 + t * 0.13) + t * 0.07);
  float th2 = 0.5 + 0.5 * sin(tb * 31.0 - t * 0.19 + 1.7 * sin(tb * 7.0 - t * 0.05));
  float threads = smoothstep(0.55, 1.0, th1) * (0.45 + 0.55 * th2) * smoothstep(0.05, 0.22, tr) * (1.0 - smoothstep(0.3, 0.95, tr)) * (0.6 + 0.4 * cl);
  sky += uGapCol * uGapTint * uGapTint * (threads * 0.62 * smoothstep(0.5, 1.0, uGap) * (1.0 - uMoon));
  sky *= mix(0.6, 1.0, 1.0 - smoothstep(0.55, 1.0, ql)) * (1.0 + 0.25 * rip);
  // night: a small hard moon (wobbling with the ripples) and its halo, where the sun would stand by day
  float md = length(q - uMoonQ + rip * 0.02);
  sky += uGapCol * uMoon * (6.0 * (1.0 - smoothstep(0.04, 0.052, md)) + 0.5 * exp(-md * 7.0) + 0.25 * cl * exp(-md * 2.5));
  vec3 mir = uMirror * (0.75 + 0.6 * n1 + 0.5 * rip);
  vec3 col = mix(mir, sky, win);
  col += gapLit * (1.0 - win) * 0.45 * smoothstep(0.52, 0.66, cosT);      // the blaze burns through the dark bank too: no hard edge where the bank begins
  float drops = rings * mix(0.8, 0.55, win) + (rr.y * 0.1 + rr.z * 0.3 + shim * 0.16) * uRain;
  col += uCloud * drops;
  col += vec3(0.12, 0.85, 0.7) * uBio * drops * 0.5 * (1.0 - smoothstep(8.0, 22.0, distance(vW, cameraPosition)));   // night: the nearest drops spark, a faint twinkle
  // the breach: a ragged hole of bright sky where the animal went through, ringed by a crown of white water; the sky
  // closes first (uHole.w under 0.5) and leaves a broken ring of foam that thins away
  float hd = length(p - uHole.xy) + (n2 - 0.5) * 0.7;
  float foam = vn(p * 5.0 + vec2(t * 0.3, -t * 0.2));
  float hole = (1.0 - smoothstep(uHole.z * 0.6, uHole.z, hd)) * smoothstep(0.5, 0.9, uHole.w);
  float crown = (1.0 - smoothstep(0.0, 0.5, abs(hd - uHole.z * 1.05))) * uHole.w;
  float froth = (1.0 - smoothstep(uHole.z * 0.3, uHole.z * 1.1, hd)) * uHole.w * smoothstep(0.5, 0.78, foam);
  col = mix(col, uCloud * 1.25 + uGapCol * 0.5, hole) + uCloud * (crown * (0.3 + 1.1 * n2) * (0.5 + foam) + froth * 0.5);
  gl_FragColor = vec4(wFog(col, 1.0), 1.0);
}
`,u0=`
${Pt}
uniform vec4 uBom[22];   // reef heads: x, z, radius, height
uniform vec3 uSand;
uniform vec3 uSandDark;
uniform vec3 uWheel;      // phase of the inner lane, its tiers, strength of the sand pool
uniform vec3 uDisc;       // x: how far the pool is a clear disc (the broad shaft stands), y: how far the sand round it is dimmed, z: the disc's light
uniform vec4 uShkA;       // the whale shark's body axis in the hero's space: nose (xyz), 1 while it is about
uniform vec3 uShkB;       // tail
uniform float uSandK;     // how far the sand's light is drawn toward warm white (day 0.7: pale coral sand; night 0.15: moonlit grey)
// diamond shadows in the gold disc. The top five tiers swim through the broad shaft on the sun's side, and their
// shadows come down it onto its foot: each tier's shadows ride a ring of the tier's own radius that passes through the
// disc (five rows 1.8 m apart, the middle one through its centre), thirteen to the ring, half a spacing out of step
// from row to row (so the diamonds nest and never merge), turning at the lane's rate and the way the animals above swim
float wingShade(vec2 pl) {
  float sh = 0.0;
  for (int k = 0; k < 5; k++) {
    float fk = float(k), tier = max(uWheel.y - 1.0 - fk, 0.0);
    float y = 3.2 + tier * 20.8 / max(uWheel.y - 1.0, 1.0), rk = 11.1 + 4.0 * clamp((y - 2.0) / 24.0, 0.0, 1.0);
    vec2 q = pl - uShaftB.xz - vec2(0.0, rk + 3.6 - 1.8 * fk);
    float rq = length(q);
    float ph = (atan(-q.y, q.x + 1e-4) - uWheel.x - 0.14 * uTime) * (13.0 / 6.2831853) + 0.5 * fk;
    float du = (fract(ph + 0.5) - 0.5) * (6.2831853 / 13.0) * rq, dv = rq - rk;
    float d = abs(dv) / 1.75 + abs(du) / 1.05 + 0.25 * du * du;
    // (soft, in metres of the sand: a shadow lands with an edge a tenth as wide as the height y it has fallen through
    // the water, the light under a ruffled surface being spread over some six degrees; soft is half that width on the
    // diamond's own measure d, which rises 1.11 for each metre across the diamond's edge. And the wider its edge the
    // paler the shadow, its whole darkness kept: under such an edge the diamond's area grows by soft * soft / 5)
    float soft = 0.5 * 0.1 * y * 1.11;
    sh = max(sh, (1.0 - smoothstep(1.0 - soft, 1.0 + soft, d)) * (1.0 - 0.07 * fk) / (1.0 + 0.2 * soft * soft));
  }
  return sh;
}
float crest(float ph) { return sin(ph) + 0.3 * sin(2.0 * ph + 1.0); }
void main() {
  vec2 p = vW.xz;
  vec2 fwv = fwidth(p);
  float fw = max(fwv.x, fwv.y);
  vec3 Vd = normalize(vW - cameraPosition + vec3(0.0, 1e-5, 0.0));
  float stretch = 1.0 / max(abs(Vd.y), 0.03);
  float flatK = mix(0.4, 1.0, 1.0 - smoothstep(2.6, 6.5, stretch));
  float big = vn(p * 0.07 + 3.0), mid = vn(p * 0.31 + 11.0), grain = vn(p * 19.0);
  // ripples: which set holds the sand here (wA, wB, wC sum to 1), and a short-range shear that makes the crests wander
  vec2 wv = vec2(vn(p * 0.47 + 7.0), vn(p * 0.47 + 31.0)) - 0.5;
  float wA = smoothstep(0.34, 0.62, vn(p * 0.09 + 21.0)), wB = (1.0 - wA) * smoothstep(0.38, 0.64, vn(p * 0.12 - 9.0)), wC = 1.0 - wA - wB;
  vec2 wv2 = vec2(vn(p * 1.3 + 17.0), vn(p * 1.3 - 23.0)) - 0.5;              // a finer shear: crests fork and rejoin every metre
  float phA = dot(p, vec2(0.97, 0.26)) * 14.5 + 4.0 * wv.x + 1.2 * mid + 1.5 * wv2.x;        // 0.43 m apart
  float phB = dot(p, vec2(0.64, 0.77)) * 19.0 + 4.2 * wv.y + 1.5 * wv2.y;                    // 0.33 m
  float phC = dot(p, vec2(0.87, -0.5)) * 11.5 + 3.6 * (wv.x - wv.y) - 1.5 * wv2.x;           // 0.55 m
  float rA = 1.0 - smoothstep(0.55, 1.5, fwidth(phA)), rB = 1.0 - smoothstep(0.55, 1.5, fwidth(phB)), rC = 1.0 - smoothstep(0.55, 1.5, fwidth(phC));
  // (a set of ripples seen along its own crests on foreshortened sand is a comb of parallel bars: each set fades where
  // the view lies within about twenty degrees of its crests, the more the flatter the sand is seen)
  vec2 Vh = normalize(Vd.xz + vec2(1e-5, 0.0));
  float endK = smoothstep(1.5, 3.5, stretch);
  rA *= mix(1.0, smoothstep(0.1, 0.4, abs(dot(Vh, vec2(0.97, 0.26)))), endK);
  rB *= mix(1.0, smoothstep(0.1, 0.4, abs(dot(Vh, vec2(0.64, 0.77)))), endK);
  rC *= mix(1.0, smoothstep(0.1, 0.4, abs(dot(Vh, vec2(0.87, -0.5)))), endK);
  float rip = (wA * rA * crest(phA) + wB * rB * crest(phB) + wC * rC * crest(phC)) * (1.0 - 0.6 * smoothstep(4.0, 10.0, stretch));
  float rAll = wA * rA + wB * rB + wC * rC;
  float shade = 1.0 + 0.14 * rip;
  vec3 alb = uSand * (0.8 + 0.26 * big + 0.12 * mix(0.5, mid, flatK)) * shade * (0.93 + 0.14 * grain * rAll);
  alb = mix(alb, uSandDark, smoothstep(0.52, 0.8, vn(p * 0.13 + 40.0)) * 0.3 * flatK);
  // every reef head stands in its own contact shade and throws a soft shadow away from the sun, as long as it is tall
  float dark = 0.0, castSh = 0.0;
  for (int i = 0; i < 22; i++) {
    vec2 bd = p - uBom[i].xy;
    float d = length(bd) + (mid - 0.5) * 1.6;
    dark = max(dark, 1.0 - smoothstep(uBom[i].z * 0.9, uBom[i].z * 2.1, d));
    vec2 sd2 = bd - vec2(0.0, uTurn * 0.45 * uBom[i].w);
    castSh = max(castSh, 1.0 - smoothstep(0.75, 1.25, length(sd2 * vec2(1.0, 0.8)) / max(uBom[i].z, 0.1) + (mid - 0.5) * 0.25));
  }
  alb = mix(alb, uSandDark * 0.6, dark * 0.8);
  float skip = smoothstep(0.9, 1.0, vn(vec2(p.x * 7.0 - uTime * 1.1, p.y * 7.0))) * max(sin(phA), 0.0) * rA * wA;   // grains skipping along the crests
  float r = length(p);
  float under = 1.0 - 0.12 * smoothstep(8.0, 13.0, r) * (1.0 - smoothstep(18.0, 30.0, r));     // the wall's own shade; the floor of the eye is open to the sky
  // caustics: the broad net with a finer, quicker one crawling through it (the troughs between the lines stay lit), and
  // near the lens a net of thin bright lines; each fades where a pixel is wider than its lines or the sand is foreshortened
  float fineK = 1.0 - smoothstep(0.12, 0.5, fw);
  float cau = mix(0.55, mix(caustic(p, uTime), caustic(p * 2.7 + 17.0, uTime * 1.35), 0.6 * fineK), flatK);
  float cline = smoothstep(1.3, 2.1, caustic(p * 6.1 - 5.0, uTime * 1.7)) * (1.0 - smoothstep(0.02, 0.1, fw)) * (1.0 - smoothstep(3.0, 7.0, stretch));
  float dapple = mix(1.0, 0.36 + 0.74 * cau, max(uCaustic, 0.85)) + 0.34 * cline;
  // the squall's cloud is broken: its light and shade drift over the sand in soft fields 20 m and more across (under
  // them the sand keeps its own colour and four fifths of its light), and each reef head's shadow lies in it
  float cloudSh = smoothstep(0.3, 0.7, vn(p * 0.05 + vec2(uTime * 0.021, -uTime * 0.013)) * 0.65 + vn(p * 0.13 - vec2(uTime * 0.03, uTime * 0.017)) * 0.35);
  float fieldK = mix(0.74, 1.06, cloudSh) * (1.0 - 0.4 * castSh);
  vec2 pl = vec2(p.x, p.y * uTurn);
  // the sand pool: a broad warm wash on the sand under the eye and, once the broad shaft stands, its foot: a gold disc
  // with a broken edge, the wing shadows of the top tiers turning through it
  float pd0 = length(pl - uShaftB.xz), pd = pd0 + (mid - 0.5) * 2.0;
  float pool = (1.0 - smoothstep(uShaftR * 0.5, uShaftR * 2.7, pd)) * uWheel.z;
  float disc = (1.0 - smoothstep(uShaftR * 0.92, uShaftR * 1.14, pd0 + (mid - 0.5) * 1.0 + (vn(p * 1.9 + 3.0) - 0.5) * 0.5)) * uDisc.x;
  float wings = disc > 0.004 ? wingShade(pl) : 0.0;
  float dim = uDisc.y * (1.0 - disc / max(uDisc.x, 1e-3));          // round the disc the sand is under the squall's cloud
  // coins of light where the narrow beams stand
  float coin = beamAt(vec3(pl.x, 0.0, pl.y));
  // the whale shark's shadow: a soft capsule carried down the sun's ray
  vec2 sa = uShkA.xz + vec2(0.0, 0.466) * uShkA.y, sb = uShkB.xz + vec2(0.0, 0.466) * uShkB.y, ab = sb - sa;
  float sh = 0.5 * (uShkA.y + uShkB.y);
  float sd = length(pl - sa - ab * clamp(dot(pl - sa, ab) / max(dot(ab, ab), 1e-4), 0.0, 1.0));
  float shk = (1.0 - smoothstep(0.35, 1.2 + 0.14 * sh, sd)) * uShkA.w / (1.0 + 0.09 * sh);
  // the sand keeps its own pale colour: its light is drawn toward a warm white as bright as the water's own (lit by the
  // plain blue of the water it goes olive and brown)
  vec3 ambS = mix(uAmbUp, dot(uAmbUp, vec3(0.3, 0.5, 0.2)) * vec3(1.06, 1.0, 0.93), uSandK);
  vec3 keyS = mix(uKeyCol, dot(uKeyCol, vec3(0.3, 0.5, 0.2)) * vec3(1.08, 1.0, 0.9), uSandK * 0.85);
  vec3 light = ambS * under * (0.55 + 0.45 * dapple) * (1.0 - 0.19 * dim) * (0.5 + 0.5 * fieldK) + keyS * uSun * under * dapple * (1.0 - 0.47 * dim) * fieldK
             + (uShaftWarm * 1.5 + uSunCol * 0.2) * pool * (0.4 + 0.75 * cau) * (1.0 - 0.5 * uDisc.x)
             + (uShaftWarm * 0.95 + keyS * 0.2) * uDisc.z * disc * (0.6 + 0.4 * min(cau, 1.6) + 0.25 * cline) * (1.0 - 0.92 * wings)
             + uSunCol * coin * (0.6 + 0.9 * cau);
  float inDisc = disc / max(uDisc.x, 1e-3);
  // (the disc is gold, not cream: the sand in it takes the shaft's own colour)
  vec3 col = alb * mix(vec3(1.0), vec3(1.06, 0.95, 0.7), inDisc) * light * (1.0 - 0.62 * shk) * (1.0 - 0.6 * wings * inDisc) + uKeyCol * skip * 0.12;
  // (inside the disc the column's own veil is thinned to two fifths, and under a wing shadow to a quarter: a shadow
  // in the disc is a hole in the lit water above it too)
  gl_FragColor = vec4(wFogKV(col, 0.7, 0.3, 1.0 - inDisc * (0.6 + 0.15 * wings)), 1.0);
}
`,f0=`
attribute vec3 color;
attribute vec2 aSway;
uniform float uTime;
${Wt}
void main() {
  vec3 wp = position;
  float s = sin(uTime * 0.8 + aSway.y + position.x * 0.25);
  wp.x += aSway.x * s; wp.z += aSway.x * 0.4 * sin(uTime * 0.6 + aSway.y * 1.7);
  wp += normal * 0.035 * step(5.0, aSway.y) * sin(uTime * 1.6 + aSway.y * 3.0);        // soft corals pulse
  vW = wp; vN = normal; vCol = color;
  vec4 mvPosition = viewMatrix * vec4(wp, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,d0=`
${Pt}
void main() {
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0));
  vec3 V = normalize(cameraPosition - vW + vec3(0.0, 1e-5, 0.0));
  if (dot(N, V) < 0.0) N = -N;
  float polyp = vn(vW.xz * 7.0 + vW.y * 5.0), fine = vn(vW.xz * 26.0 + vW.y * 19.0);
  float groove = smoothstep(0.42, 0.5, abs(vn(vW.xz * 1.7 + vW.y * 2.3) - 0.5) * 2.0 + 0.3);   // fissures in the heads
  vec3 alb = vCol * (0.7 + 0.45 * polyp) * (0.86 + 0.28 * fine) * mix(0.45, 1.0, groove);
  // (modelled by the light: tops and the sunward side lit, the side turned from the sun and everything near the sand
  // in a shade half as bright, so a head 30 m off is a lit dome with a dark side, not a flat patch)
  float hemi = smoothstep(-0.45, 1.0, N.y);
  float ao = mix(0.52, 1.0, smoothstep(0.0, 1.8, vW.y + 28.0));
  float cau = caustic(vW.xz + vW.y * 0.3, uTime);
  float sunSide = dot(N, uSunW);
  vec3 light = mix(uAmbDown * 0.46, uAmbUp * 0.9, hemi) * ao * (0.72 + 0.28 * smoothstep(-0.6, 0.5, sunSide))
             + uKeyCol * uSun * max(sunSide * 0.9 + 0.1, 0.0) * 1.3 * mix(1.0, cau, uCaustic) * ao;
  vec3 col = alb * light + uAmbUp * 0.08 * pow(max(1.0 - abs(dot(N, V)), 0.0), 3.0);
  gl_FragColor = vec4(wFog(col, 0.8), 1.0);
}
`,m0=`
attribute vec4 iEel;      // x, z, seed, height
uniform float uTime;
uniform float uTurn;
uniform vec2 uWheel;      // phase and angular rate of the bottom tier
uniform vec4 uShkA;
uniform vec3 uShkB;
${Wt}
void main() {
  float t = position.y, sd = iEel.z;
  vec2 b = iEel.xy;
  float r = length(b);
  float ang = atan(-b.y * uTurn, b.x + 1e-4);
  float sweep = pow(0.5 + 0.5 * sin(13.0 * (ang - uWheel.x - uWheel.y * uTime)), 3.0) * (1.0 - smoothstep(13.0, 23.0, r)) * smoothstep(6.0, 10.0, r);
  float near = 1.0 - smoothstep(1.6, 4.2, distance(cameraPosition, vec3(b.x, -28.0, b.y)));
  // the whale shark: the field sinks in a wave ahead of its shadow and rises again behind it
  vec2 pl = vec2(b.x, b.y * uTurn), ab = uShkB.xz - uShkA.xz;
  float along = dot(pl - uShkA.xz, ab) / max(dot(ab, ab), 1e-4);
  float sdist = length(pl - uShkA.xz - ab * clamp(along, -0.6, 1.0));
  float shark = (1.0 - smoothstep(2.5, 6.5, sdist)) * uShkA.w * (1.0 - smoothstep(4.0, 9.0, uShkA.y));
  float H = iEel.w * (1.0 - clamp(max(max(sweep * 0.9, near), shark), 0.0, 0.97));
  float ph = uTime * (0.8 + 0.5 * sd) + sd * 40.0;
  float hook = t * t;
  vec3 wp = vec3(b.x, -28.0 + t * H * (1.0 - 0.18 * hook), b.y);
  float fa = (fract(sd * 7.31) - 0.5) * 2.6; vec2 fd = vec2(cos(fa), sin(fa));
  float lean = 0.22 + 0.2 * fract(sd * 13.7);
  wp.x += H * 0.2 * t * sin(ph);
  wp.xz += fd * (H * (lean * hook * hook + 0.1 * hook * sin(ph * 1.7 + t * 3.0)));
  wp.z += H * 0.16 * t * cos(ph * 0.8 + sd * 9.0);
  float rad = max(0.02 * (1.0 - 0.3 * t), distance(wp, cameraPosition) * 0.0017);
  wp.xz += position.xz * rad;
  vW = wp; vN = vec3(position.x, 0.4, position.z);
  float dots = step(0.55, fract(t * 6.0 + sd * 3.0));
  vCol = mix(vec3(0.6, 0.53, 0.37), vec3(0.07, 0.07, 0.05), dots * 0.75) * (0.5 + 0.5 * t);
  vec4 mvPosition = viewMatrix * vec4(wp, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,qe=`
${Pt}
void main() {
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0));
  // (an eel is a pale cream animal: it takes the sky's light as the sand does, by its brightness and warm, so the
  // field never reads as blue grass)
  vec3 sky = mix(uAmbUp, vec3(dot(uAmbUp, vec3(0.3, 0.5, 0.2))) * vec3(1.12, 1.0, 0.8), 0.75);
  vec3 light = sky * (0.55 + 0.45 * N.y) + uKeyCol * uSun * mix(1.0, caustic(vW.xz, uTime), uCaustic) + uSunCol * beamAt(toHero(vW)) * 0.6;
  gl_FragColor = vec4(wFog(vCol * light, 0.7), 1.0);
}
`,p0=`
attribute vec4 iHome;
uniform float uTime;
${Wt}
void main() {
  float sd = iHome.w, t = uTime * (0.6 + 0.6 * sd);
  vec3 off = vec3(sin(t * 0.9 + sd * 40.0) + 0.4 * sin(t * 2.3 + sd * 11.0), 0.5 * sin(t * 1.3 + sd * 17.0), cos(t * 0.7 + sd * 29.0) + 0.4 * sin(t * 1.9 + sd * 7.0)) * (0.3 + 0.45 * fract(sd * 7.0));
  vec3 c = iHome.xyz + off;
  float duck = 1.0 - smoothstep(5.0, 10.0, distance(cameraPosition, c));
  c.y = mix(c.y, -28.0 + 0.6 * (c.y + 28.0), duck);
  float yaw = 0.5 * sin(t * 0.5 + sd * 23.0) + 0.9 * sin(sd * 60.0) + 0.6 * cos(t * 0.9 + sd * 40.0);
  vec3 f = vec3(cos(yaw), 0.12 * cos(t * 1.3 + sd * 17.0), sin(yaw)), r = vec3(-f.z, 0.0, f.x), u = vec3(0.0, 1.0, 0.0);
  vec3 q = position;
  q.x += 0.12 * sin(uTime * 9.0 + sd * 80.0 + q.z * 5.0) * (0.5 - q.z);
  float size = (0.15 + 0.08 * fract(sd * 13.0)) * max(1.0, distance(cameraPosition, c) * 0.05);
  vec3 wp = c + (r * q.x + u * q.y + f * q.z) * size;
  vW = wp; vN = normalize(r * position.x * 3.0 + u * (position.y * 2.0 + 0.5) + vec3(0.0, 1e-4, 0.0));
  // gold flank, darker back, a paler tail
  vCol = mix(vec3(0.95, 0.42, 0.07), vec3(1.0, 0.72, 0.16), fract(sd * 5.0)) * mix(0.55, 1.25, smoothstep(-0.1, 0.12, -position.y + 0.02)) * (0.9 + 0.5 * step(position.z, -0.25));
  vec4 mvPosition = viewMatrix * vec4(wp, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,v0=`
attribute vec4 iLeaf;
uniform float uTime;
${Wt}
void main() {
  float sd = iLeaf.z, weed = step(iLeaf.w, 0.0), t = position.z + 0.5;
  vec3 c = vec3(iLeaf.x + 0.4 * sin(uTime * 0.11 + sd * 31.0), -0.22 - 0.9 * fract(sd * 9.7) + 0.05 * sin(uTime * 0.9 + sd * 30.0), iLeaf.y + 0.4 * cos(uTime * 0.09 + sd * 17.0));
  float size = abs(iLeaf.w) * max(1.0, distance(cameraPosition, c) * 0.09);
  vec3 q = position;
  float prof = pow(max(sin(3.14159 * clamp(t, 0.0, 1.0)), 0.0), 0.8);
  q.x *= prof * mix(0.2, 0.13 * (0.65 + 0.45 * sin(t * 19.0 + sd * 40.0)), weed);
  q.y = mix(2.5 * q.x * q.x, 0.14 * sin(t * 5.0 + sd * 9.0 + uTime * 0.6), weed) - 0.1 * (t - 0.5) * (t - 0.5);
  float yaw = sd * 40.0 + uTime * (0.12 + 0.3 * fract(sd * 7.0)) * (fract(sd * 3.0) < 0.5 ? 1.0 : -1.0);
  float pit = 0.6 * sin(uTime * 0.37 + sd * 20.0), ro = sd * 9.0 + uTime * (0.15 + 0.35 * fract(sd * 13.0));
  vec3 f = vec3(cos(yaw) * cos(pit), sin(pit), sin(yaw) * cos(pit));
  vec3 r0 = normalize(vec3(-f.z, 0.0, f.x) + vec3(1e-5, 0.0, 0.0)), u0 = cross(r0, f);
  vec3 r = r0 * cos(ro) + u0 * sin(ro), u = cross(r, f);
  vec3 wp = c + (r * q.x + u * q.y + f * q.z) * size;
  vW = wp; vN = u;
  vCol = mix(mix(vec3(0.3, 0.3, 0.07), vec3(0.42, 0.24, 0.05), fract(sd * 5.0)), vec3(0.3, 0.23, 0.06), weed) * (0.55 + 0.45 * smoothstep(0.0, 0.25, abs(position.x)));
  vec4 mvPosition = viewMatrix * vec4(wp, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,w0=`
${Pt}
void main() {
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0));
  vec3 V = normalize(cameraPosition - vW + vec3(0.0, 1e-5, 0.0));
  if (dot(N, V) < 0.0) N = -N;
  float thru = smoothstep(0.0, 0.6, -V.y) * (0.4 + 0.6 * abs(N.y));        // seen from below: the sky's light through the blade
  vec3 light = uAmbUp * (0.45 + 0.4 * N.y) + uAmbDown * 0.3 + uKeyCol * uSun * (0.2 + 1.1 * thru);
  gl_FragColor = vec4(wFog(vCol * light, 1.0), 1.0);
}
`,g0=`
attribute vec4 iP;
uniform float uTime;
uniform float uTurn;
uniform float uPx;
uniform vec3 uBox;
uniform float uShaft;
uniform vec3 uShaftA;
uniform vec3 uShaftB;
uniform float uShaftR;
varying vec2 vC;
varying float vA;
varying float vG;
#include <fog_pars_vertex>
${De}
vec2 rot(vec2 v, float th) { float c = cos(th), s = sin(th) * uTurn; return vec2(v.x * c + v.y * s, v.y * c - v.x * s); }
void main() {
  vec3 cam = cameraPosition;
  float wheel = step(0.5, fract(iP.w * 7.0));
  float th = uTime * 0.15 * wheel;
  vec2 cr = rot(cam.xz, -th);
  vec3 base = iP.xyz * uBox + (1.0 - wheel) * vec3(0.35, 0.03, 0.12) * uTime + 0.25 * sin(uTime * 0.4 + iP.w * vec3(31.0, 47.0, 59.0));
  vec3 rel = mod(base - vec3(cr.x, cam.y, cr.y) + 0.5 * uBox, uBox) - 0.5 * uBox;
  vec3 pr = vec3(cr.x, cam.y, cr.y) + rel;
  vec2 wxz = rot(pr.xz, th);
  vec3 wp = vec3(wxz.x, pr.y, wxz.y);
  vec3 vel = mix(vec3(0.4, 0.03, 0.15), 0.15 * vec3(wp.z * uTurn, 0.0, -wp.x * uTurn), wheel);
  vec4 mvPosition = viewMatrix * vec4(wp, 1.0);
  vec3 vv = (viewMatrix * vec4(vel, 0.0)).xyz;
  float dist = max(-mvPosition.z, 0.1);
  float px = dist * 1.2 / max(uPx, 1.0);
  float size = max(0.011 + 0.012 * fract(iP.w * 13.0), px * 1.3);
  float sp = length(vv.xy);
  vec2 dir = sp > 1e-4 ? vv.xy / sp : vec2(1.0, 0.0);
  float len = size + sp * 0.11;
  mvPosition.xy += dir * position.x * len * 2.0 + vec2(-dir.y, dir.x) * position.y * size * 2.0;
  vec3 e = abs(rel) / (0.5 * uBox);
  float edge = 1.0 - smoothstep(0.82, 1.0, max(e.x, max(e.y, e.z)));
  vA = edge * smoothstep(0.35, 1.4, dist) * min(1.0, 0.02 / size) * (size / len) * (0.6 + 0.4 * sin(uTime * 1.3 + iP.w * 90.0))
     * step(wp.y, -0.3) * step(-27.8, wp.y);
  // motes inside the broad shaft or a narrow beam catch the light: brighter and gold
  vec3 lp = vec3(wp.x, wp.y + 28.0, wp.z * uTurn), ab = uShaftB - uShaftA;
  float tt = clamp(dot(lp - uShaftA, ab) / max(dot(ab, ab), 1e-4), 0.0, 1.0);
  vG = (1.0 - smoothstep(uShaftR * 0.45, uShaftR * 1.05, length(lp - (uShaftA + ab * tt)))) * uShaft + 2.5 * beamAt(lp);
  vC = position.xy * 2.0;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,b0=`
uniform vec3 uMote;
uniform vec3 uShaftWarm;
varying vec2 vC;
varying float vA;
varying float vG;
#include <fog_pars_fragment>
${r0}
void main() {
  float a = 1.0 - smoothstep(0.15, 1.0, length(vC));
  gl_FragColor = vec4((uMote + (uShaftWarm * 3.2 + uMote) * min(vG, 1.6)) * a * vA * fogFade(), 1.0);
}
`,y0=`
uniform float uTime;
uniform vec3 uPos;
uniform vec3 uFwd;
uniform vec3 uBend;
attribute float aFin;
attribute float aSeed;
varying vec3 vR;
varying float vFin;
${Wt}
void main() {
  vec3 q = position;
  if (aFin > 2.5) {
    q.z += 0.2 * sin(uTime * 0.23 + aSeed * 40.0);
    q.x += 0.035 * sin(uTime * 4.0 + aSeed * 60.0 + position.z * 9.0);
  } else if (aFin > 0.5 && aFin < 1.5) {
    q.y += 0.1 * max(abs(position.x) - 0.9, 0.0) * sin(uTime * 0.7 + position.z);      // pectorals trimming
  } else if (position.z > 3.9 && position.y < 0.0) {
    q.y *= 1.0 + 0.3 * sin(uTime * 0.6);                                              // the mouth working
  }
  float k = clamp((2.8 - q.z) / 7.3, 0.0, 1.0);
  q.x += 0.75 * k * k * sin(uTime * 1.2566 + q.z * 0.5) + 0.5 * uBend.x * q.z * q.z;
  q.y += 0.5 * uBend.y * q.z * q.z;
  q *= uBend.z;
  vec3 f = normalize(uFwd + vec3(0.0, 0.0, 1e-5));
  vec3 r = normalize(cross(vec3(0.0, 1.0, 0.0), f) + vec3(1e-5, 0.0, 0.0));
  vec3 u = cross(f, r);
  vec3 wp = uPos + r * q.x + u * q.y + f * q.z;
  vW = wp; vN = r * normal.x + u * normal.y + f * normal.z; vR = position; vFin = aFin; vCol = vec3(1.0);
  vec4 mvPosition = viewMatrix * vec4(wp, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,x0=`
varying vec3 vR;
varying float vFin;
uniform float uBioK;
${Pt}
void main() {
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0));
  vec3 V = normalize(cameraPosition - vW + vec3(0.0, 1e-5, 0.0));
  if (dot(N, V) < 0.0) N = -N;
  float fin = step(0.5, vFin) * step(vFin, 1.5), mouth = step(1.5, vFin) * step(vFin, 2.5), rem = step(2.5, vFin);
  float n1 = vn(vR.xz * 2.0 + vR.y * 1.3), n2 = vn(vR.zy * 7.0 + vR.x * 5.0);
  float head = smoothstep(2.7, 3.9, vR.z);
  // slate back and flanks; white below the lowest rib and under the head
  float belly = (1.0 - smoothstep(-0.36, -0.2, vR.y + 0.07 * (n1 - 0.5) + 0.14 * head)) * (1.0 - fin);
  // pale spots from a jittered hashed grid in body coordinates (length, girth): 3-8 cm, smaller and denser on the head
  float sc = mix(4.2, 7.5, head);
  vec2 gp = mix(vec2(vR.z, atan(vR.x, max(vR.y + 0.9, 0.05)) * 1.1), vec2(vR.z + vR.y * 0.6, vR.y * 1.2 + abs(vR.x) * 0.9), fin) * sc;
  vec2 id = floor(gp), f = fract(gp);
  vec2 c = 0.5 + 0.5 * (vec2(h21(id), h21(id + 7.7)) - 0.5);
  float rad = (0.016 + 0.024 * h21(id + 3.3)) * sc;
  float spot = 1.0 - smoothstep(rad * 0.6, rad, length(f - c));
  // pale vertical bars between the columns of spots on the flanks
  // (thin, wavering and broken into dashes down the flank: whole straight bars read as paint)
  float barId = floor(gp.x * 0.5 + 0.12 * (n1 - 0.5));
  float bar = (1.0 - smoothstep(0.02, 0.06, abs(fract(gp.x * 0.5 + 0.12 * (n1 - 0.5) + 0.07 * sin(gp.y * 1.7 + barId * 2.3)) - 0.5))) * (1.0 - head) * (1.0 - fin) * smoothstep(-0.3, 0.0, vR.y)
            * 0.42 * smoothstep(0.3, 0.62, vn(vec2(barId * 7.31, gp.y * 0.9 + barId * 3.7)));
  float pale = max(spot, bar) * (0.75 + 0.25 * n2);
  // (slate blue of its own, not a grey that only the water's light turns blue)
  vec3 alb = mix(vec3(0.15, 0.185, 0.222) * (0.75 + 0.5 * n1), vec3(0.72, 0.72, 0.66), pale * 0.92);
  alb = mix(alb, vec3(0.68, 0.7, 0.66) * (0.9 + 0.1 * n2), belly);
  // (the pectorals: slate and spotted above, the belly's pale tone on the face turned to the sand)
  float pecU = fin * step(0.8, abs(vR.x)) * smoothstep(0.9, 1.3, vR.z) * (1.0 - smoothstep(-0.25, 0.1, normalize(vN + vec3(0.0, 1e-5, 0.0)).y));
  alb = mix(alb, vec3(0.6, 0.62, 0.6), pecU * 0.85);
  // five gill slits over each pectoral, pumping
  float gz = (3.05 - vR.z) / 0.17, gi = floor(gz);
  float gw = 0.05 + 0.03 * sin(uTime * 1.3 - gi * 0.5);
  // (narrow folds on the lower two thirds of the flank, not five broad bands)
  float slit = (1.0 - smoothstep(gw * 0.5, gw + 0.2, abs(fract(gz) - 0.5))) * step(-0.5, gi) * step(gi, 4.5) * smoothstep(0.45, 0.6, abs(vR.x)) * (1.0 - smoothstep(0.2, 0.36, abs(vR.y + 0.06) + 0.05 * (n2 - 0.5))) * (1.0 - fin);
  alb = mix(alb, vec3(0.045, 0.05, 0.055), slit * 0.62);      // soft dark folds, not black bars
  float eye = (1.0 - smoothstep(0.035, 0.055, length(vec2(vR.y - 0.03, vR.z - 4.0)))) * step(0.6, abs(vR.x)) * (1.0 - fin);
  alb = mix(alb, vec3(0.008), eye);
  float occl = mix(1.0, 0.1 + 0.9 * smoothstep(3.5, 4.5, vR.z), mouth);
  alb = mix(alb, vec3(0.09, 0.06, 0.06), mouth);
  alb = mix(alb, vec3(0.045, 0.05, 0.055) + 0.16 * smoothstep(0.2, 0.9, -N.y), rem);
  float hemi = N.y * 0.5 + 0.5, top = smoothstep(-0.1, 0.6, N.y);
  vec3 hp = toHero(vW);
  float cau = caustic(vW.xz + vW.y * 0.3, uTime);
  // (the water's light on it is drawn a third of the way to grey, so the slate stays slate and not cobalt; the key
  // lights the back and upper flank plainly and leaves the under side to the sand's bounce)
  vec3 ambS = mix(uAmbDown * 0.8, uAmbUp, hemi);
  ambS = mix(ambS, vec3(dot(ambS, vec3(0.3, 0.5, 0.2))), 0.36) * mix(0.72, 1.0, top);
  vec3 light = ambS * occl
             + uKeyCol * uSun * max(dot(N, uSunW) * 0.85 + 0.15, 0.0) * mix(1.0, cau, uCaustic) * (0.3 + 1.15 * top) * occl
             + uSunCol * beamAt(hp) * (0.3 + 0.7 * top);
  vec3 col = alb * light * (0.72 + 0.28 * abs(dot(N, V))) + uAmbUp * 0.14 * pow(max(1.0 - abs(dot(N, V)), 0.0), 3.0) * occl;
  vec3 Hh = normalize(uSunW + V + vec3(0.0, 1e-5, 0.0));
  col += uKeyCol * uSun * 0.1 * pow(max(dot(N, Hh), 0.0), 14.0) * occl * (1.0 - rem);        // wet skin: a soft sheen along the back and upper flank
  // night: its bow wave and its tail shed blue-green sparks
  float spark = smoothstep(0.72, 0.9, vn(vR.xz * 9.0 + vec2(vR.y * 5.0, uTime * 1.5)));
  col += vec3(0.12, 0.85, 0.7) * uBioK * (spark * 1.6 * (smoothstep(3.4, 4.5, vR.z) + 1.0 - smoothstep(-4.4, -2.2, vR.z)) + 0.012);
  gl_FragColor = vec4(wFog(col, 1.0), 1.0);
}
`,M0={squall:{water:"#406b94",far:"#3b5175",cloud:"#86b8d6",cloudDark:"#557488",mirror:"#3a4354",sun:"#e9b952",gapCol:"#fff0c0",sand:"#d2bc8e",fogUp:[.8,1.8,2.1],fogDn:[.93,.42,.32],rain:1,ragged:.1,gap:[.35,1],gapW:.34,rift:[.2,1],shaft:[0,1],ease:.32,beams:.35,beamMix:[.35,.3],pool:.45,poolK:1,dim:1,gapTint:[1,.82,.5],sandK:.7,shaftTint:[1,1,1],sunK:.5,amb:1,bio:0,moon:0,dens:.014,exposure:1.1,tint:"#f6fbff",sat:1.02},golden:{water:"#3f7296",far:"#3a5a7c",cloud:"#7fa9c6",cloudDark:"#4f7d9c",mirror:"#34485e",sun:"#f0b24a",gapCol:"#fff2c8",sand:"#d6bd8e",fogUp:[.8,1.78,2.2],fogDn:[.93,.45,.36],rain:0,ragged:.015,gap:[1,1],gapW:.24,rift:[.35,1],shaft:[1,1],ease:.5,beams:.3,beamMix:[.3,.45],pool:1,poolK:.6,dim:.6,gapTint:[1,.82,.5],sandK:.7,shaftTint:[1,1,1],sunK:.75,amb:1,bio:0,moon:0,dens:.012,exposure:1.1,tint:"#fff8ea",sat:1.02},dawn:{water:"#497392",far:"#44607c",cloud:"#c9b6bd",cloudDark:"#84788a",mirror:"#3c4553",sun:"#f0d2c2",gapCol:"#ffd9cc",sand:"#cebdaa",fogUp:[.95,1.5,1.65],fogDn:[.9,.5,.42],rain:.45,ragged:.06,gap:[.3,.7],gapW:.3,rift:[.2,.95],shaft:[0,.55],ease:.2,beams:.22,beamMix:[.5,.25],pool:.3,poolK:1,dim:.8,gapTint:[1,.84,.76],sandK:.7,shaftTint:[1.05,.95,1],sunK:.3,amb:.85,bio:0,moon:0,dens:.016,exposure:1.1,tint:"#fff5f6",sat:.98},night:{water:"#373d4b",far:"#33363f",cloud:"#4a5f78",cloudDark:"#1f2d40",mirror:"#16181d",sun:"#c9d8e6",gapCol:"#dfeaf5",sand:"#d8c8a2",sandLift:1.5,fogUp:[.9,1.5,1.8],fogDn:[.95,.7,.6],rain:1,ragged:.1,gap:[.35,.6],gapW:.34,rift:[.15,.7],shaft:[.15,.55],ease:.32,beams:.3,beamMix:[.5,.25],pool:.3,poolK:1,dim:.7,gapTint:[.8,.9,1],sandK:.8,shaftTint:[.7,.95,1.5],sunK:.5,amb:.8,bio:1,moon:1,dens:.018,exposure:1.25,tint:"#eef6ff",sat:1}};function S0(){const c=[],z=[],R=[],b=[],D=[];return{v:(p,V,X,I,x,O,M)=>(c.push(p,V,X),z.push(0,1,0),R.push(I[0]*x,I[1]*x,I[2]*x),b.push(O,M),c.length/3-1),grid:(p,V,X)=>{const I=c.length/3;for(let x=0;x<p;x++)for(let O=0;O<V;O++)X(x/(p-1),O/(V-1));for(let x=0;x<p-1;x++)for(let O=0;O<V-1;O++){const M=I+x*V+O,v=M+1,C=M+V,T=C+1;D.push(M,C,v,v,C,T)}},build:async p=>{const V=new e.BufferGeometry;return V.setAttribute("position",new e.Float32BufferAttribute(c,3)),await p.yield(),V.setAttribute("normal",new e.Float32BufferAttribute(z,3)),V.setAttribute("color",new e.Float32BufferAttribute(R,3)),await p.yield(),V.setAttribute("aSway",new e.Float32BufferAttribute(b,2)),V.setIndex(D),await p.yield(),V.computeVertexNormals(),V}}}const Ft=[[4.5,.63,.13,.17],[4.42,.75,.2,.22],[4.25,.81,.26,.26],[3.9,.85,.33,.33],[3.4,.88,.42,.42],[2.8,.89,.54,.52],[2.05,.87,.68,.62],[1.35,.81,.78,.66],[.65,.71,.76,.62],[-.05,.59,.65,.52],[-.75,.46,.52,.41],[-1.4,.34,.39,.3],[-1.95,.25,.27,.21],[-2.4,.21,.19,.16],[-2.75,.12,.14,.12]],Qt=c=>{const z=Ft.length,R=Math.min(z-2,Math.max(0,Math.floor(c))),b=c-R,D=Y=>{const it=Ft[Math.max(0,R-1)][Y],n=Ft[R][Y],p=Ft[R+1][Y],V=Ft[Math.min(z-1,R+2)][Y];return .5*(2*n+(p-it)*b+(2*it-5*n+4*p-V)*b*b+(3*n-it-3*p+V)*b*b*b)};return[D(0),D(1),D(2),D(3)]},St=c=>{let z=0,R=Ft.length-1;for(let b=0;b<24;b++){const D=.5*(z+R);Qt(D)[0]>c?z=D:R=D}return Qt(.5*(z+R))};async function k0(c){const z=[],R=[],b=[],D=[],Y=[0,10,19,24,28,32,40,47,52,57,64,71,76,81,90,101,113,126,140,154,167,180],it=Y.concat(Y.slice(1,-1).reverse().map(v=>360-v)).map(v=>v*Math.PI/180),n=it.length,p=(v,C,T)=>{const g=Math.min(1,Math.max(0,(T-v)/(C-v)));return g*g*(3-2*g)},V=(v,C,T)=>{const g=v[0],q=p(2.6,4.2,g),S=.85-.3*q,_=1-.2*q,k=(1-p(2.3,3.2,g))*(.45+.55*p(-2.75,-1.6,g)),B=1-p(-2.6,-1.7,g);for(let at=0;at<n;at++){const N=it[at],K=Math.sin(N),L=Math.cos(N),j=Math.min(N,Math.PI*2-N)*57.2958;let y=Math.sign(K)*Math.pow(Math.abs(K),S)*v[1],st=L>0?Math.pow(L,_)*v[2]:-Math.pow(-L,_)*v[3],dt=0;for(const ht of[28,52,76])dt+=Math.exp(-((j-ht)/5.5)*((j-ht)/5.5));const Z=.055*dt*k*(T?0:1);y+=Math.sign(K)*Math.abs(K)*Z+Math.sign(K)*.16*B*Math.exp(-((j-90)/22)*((j-90)/22)),st+=L*Z,z.push(y*C,st*C,g-.2*p(4,4.5,g)*K*K),R.push(T),b.push(0)}},X=(v,C)=>{for(let T=0;T<C-1;T++)for(let g=0;g<n;g++){const q=v+T*n+g,S=v+T*n+(g+1)%n,_=q+n,k=S+n;D.push(q,S,_,S,k,_)}},I=44;for(let v=0;v<I;v++)V(Qt(v/(I-1)*(Ft.length-1)),1,0);X(0,I);{const v=Qt(Ft.length-1),C=z.length/3;z.push(0,0,v[0]-.12),R.push(0),b.push(0);const T=(I-1)*n;for(let g=0;g<n;g++)D.push(T+g,C,T+(g+1)%n)}await c.yield();{const v=z.length/3,C=Qt(0),T=[[4.5,1],[4.36,.93],[4.05,.8],[3.6,.5],[3.35,.04]];for(const g of T)V([g[0],C[1],C[2],C[3]],g[1],2);X(v,T.length)}const x=(v,C,T,g,q,S,_,k=1.3,B=0)=>{const at=z.length/3,N=B?18:12,K=B?9:6,L=2*(K-1),j=Math.hypot(C[0],C[1],C[2])||1,y=C[0]/j,st=C[1]/j,dt=C[2]/j,Z=Math.hypot(st,y)||1,ht=-st/Z,kt=y/Z;for(let rt=0;rt<N;rt++)for(let tt=0;tt<L;tt++){const H=rt/(N-1),et=(tt<K?tt:L-tt)/(K-1),$=tt<K?1:-1,mt=B?B*Math.pow(Math.max(0,1-H/.2),2):0,pt=et*g*(1-.86*Math.pow(H,k))*(1+.3*mt)-.12*mt*g+q*H*H*T,zt=S*Math.sin(Math.PI*et)*(B?1-.55*H:1-H),Kt=$*_*2.6*Math.sqrt(et)*(1-et)*(1-H*H)*(1+1.4*mt);z.push(v[0]+y*T*H+zt*st+ht*Kt,v[1]+st*T*H-zt*Math.abs(y)+kt*Kt,v[2]+dt*T*H-pt),R.push(1),b.push(0)}for(let rt=0;rt<N-1;rt++)for(let tt=0;tt<L;tt++){const H=at+rt*L+tt,et=at+rt*L+(tt+1)%L,$=H+L,mt=et+L;D.push(H,$,et,et,$,mt)}};x([0,St(.95)[2]-.14,.95],[0,1,0],1.08,1.25,.8,0,.09),x([0,St(-1.45)[2]-.05,-1.45],[0,1,0],.45,.6,.7,0,.045);for(const v of[-1,1])x([v*.74,-.3,2.65],[v*.9,-.38,-.2],1.95,1.2,.78,.17,.095,1.5,1);for(const v of[-1,1])x([v*.2,-.3,-.9],[v*.7,-.7,0],.5,.55,.5,0,.04);x([0,-St(-1.85)[3]+.05,-1.85],[0,-1,0],.4,.5,.5,0,.035),x([0,.03,-2.5],[0,.94,-.34],2.69,1.7,.5,0,.1,.9),x([0,-.03,-2.5],[0,-.8,-.6],1.58,1.25,.3,0,.085,.85);const O=(v,C,T,g,q)=>{const S=z.length/3,_=[.5,.36,.12,-.14,-.38],k=[.012,.055,.062,.045,.014],B=6;for(let N=0;N<_.length;N++)for(let K=0;K<B;K++){const L=K/B*Math.PI*2;z.push(v+Math.sin(L)*k[N]*g,C+Math.cos(L)*k[N]*.8*g,T+_[N]*g),R.push(3),b.push(q)}for(let N=0;N<_.length-1;N++)for(let K=0;K<B;K++){const L=S+N*B+K,j=S+N*B+(K+1)%B,y=L+B,st=j+B;D.push(L,j,y,j,st,y)}const at=z.length/3;z.push(v,C,T-.36*g,v,C+.075*g,T-.5*g,v,C-.075*g,T-.5*g),R.push(3,3,3),b.push(q,q,q),D.push(at,at+1,at+2)};O(.28,-St(3.5)[3]*.94-.05,3.5,.7,.13),O(-.3,-St(3.3)[3]*.93-.045,3.3,.6,.41),O(.3,-St(1)[3]*.93-.06,1,.9,.67),O(-.26,-St(-.2)[3]*.93-.055,-.2,.75,.29),O(.2,St(.1)[2]*.95+.04,.1,.6,.83),O(-.17,St(-.45)[2]*.95+.045,-.45,.65,.55),await c.yield();const M=new e.BufferGeometry;return M.setAttribute("position",new e.Float32BufferAttribute(z,3)),M.setAttribute("aFin",new e.Float32BufferAttribute(R,1)),M.setAttribute("aSeed",new e.Float32BufferAttribute(b,1)),M.setIndex(D),M.computeVertexNormals(),M}const _t=[[0,33,-26.6,-2.6],[.1,27,-26.6,-2.6],[.19,20.5,-26.6,-3],[.25,14.8,-26.6,-4.1],[.29,11.4,-26.5,-5.4],[.31,9,-26.3,-5.8],[.325,7,-25.7,-5.5],[.34,4.8,-24.4,-4],[.355,3.3,-23.5,-2],[.37,2.2,-22.85,.4],[.385,.2,-22,2.2],[.4,-3.3,-21.3,2.2],[.415,-6.3,-20.8,1.4],[.43,-9.2,-20.3,.4],[.447,-13.4,-19.8,-1.2],[.471,-18,-19.3,-3.4],[.53,-24,-18.9,-6.4],[.6,-30.5,-18.7,-10],[.7,-38,-18.5,-14]];function z0(c){const z=new e.CatmullRomCurve3(c,!1,"centripetal"),R=z.getLength();let b=z.getSpacedPoints(Math.round(R/.5));const D=c[0],Y=c[c.length-1],it=c[c.length-4],n=Y.distanceTo(it),p=b.map((X,I)=>I*.5<6||I*.5>R-12.5);b.forEach((X,I)=>{const x=I*.5;x<6&&(X.x=D.x+.1*(x/6),X.y=D.y),x>R-12.5&&X.lerpVectors(it,Y,Math.max(0,1-(R-x)/n))});for(let X=0;X<4;X++){const I=b.map(x=>x.clone());for(let x=2;x<b.length-2;x++)p[x]||I[x].copy(b[x-2]).add(b[x-1]).add(b[x]).add(b[x+1]).add(b[x+2]).multiplyScalar(.2);b=I}const V=new e.CatmullRomCurve3(b,!1,"centripetal");return V.getSpacedPoints(Math.round(V.getLength()/1.5))}var R0={id:"manta-cyclone",name:"The Cyclone of Wings",category:"ocean",weirdness:.3,media:["underwater"],async build(c){const z=c.rng,R=c.vary||{},b=c.quality?.detail??1,D=R.hour||"any",Y=z(),it=D==="golden"?"golden":D==="dawn"?"dawn":D==="night"?"night":D==="day"||Y<.4?"squall":Y<.65?"golden":Y<.85?"dawn":"night",n=M0[it],p=z()<.3?-1:1,V=Math.min(1.3,Math.max(.7,R.density??1)),X=V<.85?8:V>1.12?10:9,I=z.range(.65,1.35)*V,x=z.pick([0,.05,.085,.14,.22,.33]),O=z.fork("plankton"),M=z.fork("bommies"),v=z.fork("eels"),C=c.core.makeRng(c.core.hashSeed("manta-reef-fish:"+c.seed)),T=!!R.rare,g=(t,o,a)=>new e.Vector3(t,o,a*p),q=(t,o=1)=>new e.Color(t).multiplyScalar(o),S=await n0(c,{palette:[n.water,n.mirror,n.sun,"#EDF1E4","#0A1013",n.cloud,"#2E8FD8"],turn:p,tiers:X,melanistic:x,bio:n.bio,shaft:!1});await c.yield();const _=new e.Scene;S.object.position.y=E,_.add(S.object);const k=S.uniforms,B=S.anchors;k.uAmbUp.value.multiplyScalar(n.amb),k.uAmbDown.value.multiplyScalar(n.amb),k.uSun.value=n.sunK,S.setFogTint(new e.Color().fromArray(n.fogUp),new e.Color().fromArray(n.fogDn)),S.setShaftTint(new e.Color().fromArray(n.shaftTint)),S.setBeams(n.beams,q(n.sun,n.beamMix[0]).multiply(new e.Color().fromArray(n.shaftTint)).add(q(n.water,n.beamMix[1])));const at=q(n.water),N=q(n.far),K=.6,L=new e.FogExp2(at.clone(),n.dens);_.fog=L,_.background=at.clone().lerp(N,K),S.setFogFar(N,K),await c.yield();const j=z0(B.flyThrough).map(t=>g(t.x,t.y+E,t.z));await c.yield();const y=s0(j);await c.yield();const st=new e.Vector3(k.uSunDir.value.x,k.uSunDir.value.y,k.uSunDir.value.z*p),dt={uTime:k.uTime,uAmbUp:k.uAmbUp,uAmbDown:k.uAmbDown,uKeyCol:k.uKeyCol,uSunCol:k.uSunCol,uSun:k.uSun,uCaustic:k.uCaustic,uShaft:k.uShaft,uShaftA:k.uShaftA,uShaftB:k.uShaftB,uShaftR:k.uShaftR,uShaftCol:k.uShaftCol,uShaftWarm:k.uShaftWarm,uShaftT:k.uShaftT,uFogFar:k.uFogFar,uFogFarK:k.uFogFarK,uFogUp:k.uFogUp,uFogDn:k.uFogDn,uBeam:k.uBeam,uBeamLean:k.uBeamLean,uSunW:{value:st},uTurn:{value:p}},Z=(t,o,a,s,r)=>new e.ShaderMaterial({name:t,fog:!0,vertexShader:o,fragmentShader:a,uniforms:{...e.UniformsUtils.clone(e.UniformsLib.fog),...dt,...s},...r}),ht=new e.Mesh(new e.CylinderGeometry(300,300,28.8,48,1,!0),Z("manta-backdrop",ve,h0,{},{side:e.BackSide,depthWrite:!1}));ht.position.y=E/2,ht.frustumCulled=!1,ht.renderOrder=-2,_.add(ht),await c.yield();const kt=j[j.length-1],rt=n.moon?new e.Vector2(-.3,-.35*p):new e.Vector2(st.x/.75,st.z/.75),tt=new e.Vector2(n.moon?-.8:-.75,(n.moon?-.05:-.2)*p),H={uRain:{value:n.rain},uRagged:{value:n.ragged},uGap:{value:n.gap[0]},uGapW:{value:n.gapW},uRiftQ:{value:rt.clone().lerp(tt,n.rift[0])},uMoon:{value:n.moon},uBio:{value:n.bio},uMoonQ:{value:rt},uRing:{value:new e.Vector3(kt.x-1,kt.z,0)},uHole:{value:new e.Vector4(S.breachHole.x,S.breachHole.z*p,1.7,0)},uCloud:{value:q(n.cloud)},uCloudDark:{value:q(n.cloudDark)},uGapCol:{value:q(n.gapCol)},uGapTint:{value:new e.Color().fromArray(n.gapTint)},uMirror:{value:q(n.mirror)}},et=new e.Mesh(new e.PlaneGeometry(700,700).rotateX(Math.PI/2),Z("manta-ceiling",ve,c0,H,{side:e.DoubleSide,depthWrite:!1}));et.frustumCulled=!1,et.renderOrder=-1,_.add(et),await c.yield();const $=[[-30,14,3,3.6],[-20,-27,2.6,3],[-38,-12,2.2,2.6],[8,33,2.8,3.4],[-12,36,2.4,2.8],[30,22,3.4,4],[34,-11,2.6,3.2],[22,-30,2.9,3.4],[-27,-4,1.5,1.7],[25,10,1.4,1.6],[16,-24,1.5,1.7],[-33,28,1.6,1.8],[41,7,1.6,1.9],[-9,-31,1.5,1.6]];{const t=c.core.makeRng(c.core.hashSeed("manta-low-heads:"+c.seed)),o=(a,s,r,f)=>{const l=f[1]-r[1],d=f[3]-r[3],i=Math.min(1,Math.max(0,((a-r[1])*l+(s-r[3])*d)/Math.max(l*l+d*d,1e-6)));return Math.hypot(a-r[1]-l*i,s-r[3]-d*i)};for(let a=0;a<8;a++)for(let s=0;s<14;s++){const r=(a+t())/8*Math.PI*2,f=t.range(11.5,21),l=t.range(.9,1.3),d=Math.cos(r)*f,i=Math.sin(r)*f;let u=!(Math.abs(d-2)<6&&i<-3.5);for(let h=0;u&&h<j.length;h++){const m=j[h],F=m.x-d,A=m.y-(E+.5),W=m.z*p-i,lt=7+l;F*F+A*A+W*W<lt*lt&&(u=!1)}for(let h=0;u&&h<_t.length-1;h++)Math.min(_t[h][2],_t[h+1][2])<E+5&&o(d,i,_t[h],_t[h+1])<3.4+l&&(u=!1);for(let h=14;u&&h<$.length;h++)Math.hypot($[h][0]-d,$[h][1]-i)<5&&(u=!1);if(u){$.push([d,i,l,l*.77,.4+.08*l]);break}}}const mt=$.map(t=>new e.Vector4(t[0],t[1]*p,t[2],t[3]));for(;mt.length<22;)mt.push(new e.Vector4(900,900,.01,0));const pt={uBom:{value:mt},uSand:{value:q(n.sand,.96*(n.sandLift||1))},uSandDark:{value:q(n.sand,.4).lerp(q(n.mirror),.25)},uSandK:{value:n.sandK},uWheel:{value:new e.Vector3(S.info.wheelPhase,S.info.tiers,n.pool*n.poolK)},uDisc:{value:new e.Vector3(0,0,n.poolK)},uShkA:{value:new e.Vector4(0,60,0,0)},uShkB:{value:new e.Vector3(0,60,1)}},zt=new e.Mesh(new e.PlaneGeometry(700,700).rotateX(-Math.PI/2),Z("manta-sand",ve,u0,pt));zt.position.y=E,zt.frustumCulled=!1,_.add(zt),await c.yield();const Kt=[.2,.22,.08],Xt=[.44,.28,.07],Rt=[.6,.58,.44],We=[.46,.33,.08],_e=[.07,.08,.05],Ke=[.5,.17,.12],Yt=[.62,.32,.3],vt=(t,o,a)=>[t[0]+(o[0]-t[0])*a,t[1]+(o[1]-t[1])*a,t[2]+(o[2]-t[2])*a],nt=S0(),Gt=(t,o)=>c.noise.n2(t,o);for(const t of $){const o=t[0],a=t[1]*p,s=t[2],r=t[3],f=t[4]||1,l=M();nt.grid(9,17,(i,u)=>{const h=i*1.75,m=u*Math.PI*2,F=Math.sin(h)*Math.cos(m),A=Math.sin(h)*Math.sin(m),W=1+.2*Gt(o+F*1.6,a+A*1.6)+.08*Gt(o+F*5+9,a+A*5);nt.v(o+F*s*W,E-.1+Math.max(Math.cos(h),-.05)*r*.8*W,a+A*s*W,vt(vt(vt(Kt,Xt,.25+.5*l+.25*Gt(o+F*3,a+A*3+5)),Rt,.3*Math.max(0,Math.cos(h))+.25*Math.max(0,Gt(o+F*4+3,a+A*4-7))),l<.5?Yt:Ke,Math.min(.5,Math.max(0,2.4*(Gt(o*.7+F*2.2+31,a*.7+A*2.2)-.32)))),.55+.5*Math.cos(h),0,0)});const d=2+(M()<.5?1:0);for(let i=0;i<d;i++){const u=M()*6.283,h=s*M.range(.5,.85),m=o+Math.cos(u)*s*.6,F=a+Math.sin(u)*s*.6,A=E+r*(.5+.17*i);nt.grid(3,15,(W,lt)=>{const Q=lt*Math.PI*2,J=h*W*(1+.14*Math.sin(5*Q+i));nt.v(m+Math.cos(Q)*J,A+.22*W*W*h,F+Math.sin(Q)*J,vt(i===1?vt(Yt,Rt,.5):Rt,Xt,.2+.4*W),.5+.5*W,0,0)})}for(let i=0;i<4;i++){const u=M()*6.283,h=M.range(1.1,1.5),m=M.range(1.2,1.9)*f,F=M.range(-.5,.5),A=M()*4.5,W=o+Math.cos(u)*s*.7,lt=a+Math.sin(u)*s*.7,Q=E+r*.5;nt.grid(5,7,(J,Ct)=>{const $t=(Ct-.5)*2*h,Mt=J*m*(1-.12*Math.abs(Ct-.5));nt.v(W+Math.sin(F)*Math.sin($t)*Mt,Q+Math.cos($t)*Mt,lt+Math.cos(F)*Math.sin($t)*Mt,i===3?Yt:i%2?Xt:We,(.45+.6*J)*(Math.round(Ct*6)%2?.72:1)*(i%2?1.25:1),.16*J*J*m,A)})}for(let i=0;i<5;i++){const u=M()*6.283,h=M.range(.1,.6)*s,m=M.range(1.3,2.2)*f,F=M()*4.5,A=o+Math.cos(u)*h,W=a+Math.sin(u)*h,lt=E+r*.7;nt.grid(6,2,(Q,J)=>nt.v(A+.3*Q*Q*m,lt+Q*m,W+(J-.5)*.09*(1.2-Q),[.4,.2,.06],.5+.6*Q,.3*Q*Q*m,F))}for(let i=0;i<5;i++){const u=M()*6.283,h=s*M.range(.75,1),m=M.range(.28,.5)*Math.max(f,.7),F=5+M()*3,A=M(),W=A<.22?vt(Yt,Rt,A*3):A<.55?vt(Kt,Rt,(A-.1)*1.6):vt(Xt,Rt,A),lt=o+Math.cos(u)*h,Q=a+Math.sin(u)*h,J=E+r*M.range(.15,.45);nt.grid(5,8,(Ct,$t)=>{const Mt=Ct*2.4,pe=$t*Math.PI*2,Pe=1+.3*Math.sin(pe*3+i)*Math.sin(Mt*2);nt.v(lt+Math.sin(Mt)*Math.cos(pe)*m*Pe,J+Math.cos(Mt)*m*1.2,Q+Math.sin(Mt)*Math.sin(pe)*m*Pe,W,.6+.4*Math.cos(Mt),.03,F)})}for(let i=0;i<9;i++){const u=M()*6.283,h=s*M.range(1.05,1.9),m=M.range(.2,.55)*Math.max(f,.6),F=vt(_e,Rt,.25+M()*.5),A=o+Math.cos(u)*h,W=a+Math.sin(u)*h;nt.grid(3,7,(lt,Q)=>{const J=lt*1.5,Ct=Q*Math.PI*2;nt.v(A+Math.sin(J)*Math.cos(Ct)*m,E-.03+Math.cos(J)*m*.55,W+Math.sin(J)*Math.sin(Ct)*m,F,.7,0,0)})}await c.yield()}const Ge=await nt.build(c);await c.yield();const we=new e.Mesh(Ge,Z("manta-reef",f0,d0,{},{side:e.DoubleSide}));we.frustumCulled=!1,_.add(we),await c.yield();{const t=Math.max(8,Math.round(26*b)),o=$.length*t,a=new Float32Array(o*4);for(let d=0;d<$.length;d++)for(let i=0;i<t;i++){const u=C()*6.283,h=$[d][2]*(.2+.9*Math.sqrt(C())),m=(d*t+i)*4;a[m]=$[d][0]+Math.cos(u)*h,a[m+1]=E+$[d][3]*(.75+.9*C())+.3,a[m+2]=($[d][1]+Math.sin(u)*h)*p,a[m+3]=C()}const s=[0,0,.5,0,.17,.1,.07,0,.1,0,-.15,.1,-.07,0,.1,0,0,-.3,0,.2,-.5,0,-.2,-.5],r=[0,2,1,0,3,2,0,4,3,0,1,4,5,1,2,5,2,3,5,3,4,5,4,1,5,6,7],f=new e.InstancedBufferGeometry;f.setAttribute("position",new e.Float32BufferAttribute(s,3)),f.setIndex(r),f.setAttribute("iHome",new e.InstancedBufferAttribute(a,4)),f.instanceCount=o;const l=new e.Mesh(f,Z("manta-reef-fish",p0,qe,{},{side:e.DoubleSide}));l.frustumCulled=!1,_.add(l)}await c.yield();const Ee={uWheel:{value:new e.Vector2(S.info.wheelPhase,S.info.bottomRate)},uShkA:pt.uShkA,uShkB:pt.uShkB};{const t=Math.round(900*b),o=new Float32Array(t*4);for(let l=0;l<t;l++){const d=l%9,i=d<3?[0,0,0,9.5]:d<5?[0,0,8.5,21]:d<6?[1.5,3.5,0,5.5]:d<8?[-25,23,0,9]:[30,9,0,8],u=v()*6.283,h=i[2]+(i[3]-i[2])*Math.sqrt(v());o[l*4]=i[0]+Math.cos(u)*h,o[l*4+1]=(i[1]+Math.sin(u)*h)*p,o[l*4+2]=v(),o[l*4+3]=v.range(.32,.5)}const a=[],s=[];for(let l=0;l<6;l++)for(let d=0;d<4;d++){const i=d/4*6.283;a.push(Math.cos(i),l/5,Math.sin(i))}for(let l=0;l<5;l++)for(let d=0;d<4;d++){const i=l*4+d,u=l*4+(d+1)%4,h=i+4,m=u+4;s.push(i,h,u,u,h,m)}const r=new e.InstancedBufferGeometry;r.setAttribute("position",new e.Float32BufferAttribute(a,3)),r.setIndex(s),r.setAttribute("iEel",new e.InstancedBufferAttribute(o,4)),r.instanceCount=t;const f=new e.Mesh(r,Z("manta-eels",m0,qe,Ee,{side:e.DoubleSide}));f.frustumCulled=!1,_.add(f)}await c.yield();{const t=c.core.makeRng(c.core.hashSeed("manta-leaves:"+c.seed)),o=Math.max(24,Math.round(64*b)),a=new Float32Array(o*4);for(let i=0;i<o;i++){let u=0,h=0;for(let F=0;F<6;F++){const A=t()*6.283,W=19*Math.sqrt(t());if(u=Math.cos(A)*W,h=Math.sin(A)*W,Math.hypot(u-kt.x,h-kt.z)>7.5)break}const m=t()<.4;a[i*4]=u,a[i*4+1]=h,a[i*4+2]=t(),a[i*4+3]=m?-t.range(.24,.4):t.range(.1,.15)}const s=[],r=[],f=6;for(let i=0;i<=f;i++)for(let u=0;u<3;u++)s.push(u-1,0,i/f-.5);for(let i=0;i<f;i++)for(let u=0;u<2;u++){const h=i*3+u,m=h+1,F=h+3,A=F+1;r.push(h,F,m,m,F,A)}const l=new e.InstancedBufferGeometry;l.setAttribute("position",new e.Float32BufferAttribute(s,3)),l.setIndex(r),l.setAttribute("iLeaf",new e.InstancedBufferAttribute(a,4)),l.instanceCount=o;const d=new e.Mesh(l,Z("manta-leaves",v0,w0,{},{side:e.DoubleSide}));d.frustumCulled=!1,_.add(d)}await c.yield();const ge={uPx:{value:900},uBox:{value:new e.Vector3(38,24,38)},uMote:{value:q(n.sun,.16).add(q(n.cloud,.2))}};{const t=Math.round(7e3*b*I),o=new Float32Array(t*4);for(let f=0;f<t*4;f++)o[f]=O();await c.yield();const a=new e.PlaneGeometry(1,1),s=new e.InstancedBufferGeometry;s.setIndex(a.index),s.setAttribute("position",a.attributes.position),s.setAttribute("iP",new e.InstancedBufferAttribute(o,4)),s.instanceCount=t;const r=new e.Mesh(s,Z("manta-plankton",g0,b0,ge,{transparent:!0,depthWrite:!1,blending:e.AdditiveBlending}));r.frustumCulled=!1,r.renderOrder=9,_.add(r)}await c.yield();const wt=_t.map(t=>t.slice());let be=new e.CatmullRomCurve3(wt.map(t=>new e.Vector3(t[1],t[2],t[3])),!1,"centripetal");const ye=new e.Vector3,xe=new e.Vector3,ne=(t,o)=>{const a=wt.length;let s=0;for(;s<a-2&&t>wt[s+1][0];)s++;const r=Math.min(1,Math.max(0,(t-wt[s][0])/(wt[s+1][0]-wt[s][0])));return be.getPoint((s+r)/(a-1),o)},gt=(t,o)=>(ne(t-.004,ye),ne(t+.004,xe),ne(t,o),o.multiplyScalar(2).add(ye).add(xe).multiplyScalar(.25)),ut=new e.Vector3,ot=new e.Vector3(1,0,0),bt=new e.Vector3,Et=new e.Vector3,G=new e.Vector3,w=new e.Vector3;for(let t=0;t<3;t++){let o=99;for(let a=0;a<=70;a++){const s=.26+.24*(a/70);gt(s,ut),gt(s+.006,bt),gt(s-.006,Et),ot.subVectors(bt,Et).normalize(),y.pointAt(s,w),w.z*=p,G.subVectors(w,ut);const r=Math.max(-3,Math.min(4.5,G.dot(ot)));o=Math.min(o,G.addScaledVector(ot,-r).length())}if(o>=3.3)break;for(let a=5;a<=12;a++)wt[a][2]=Math.max(E+1.3,wt[a][2]-(3.4-o));be=new e.CatmullRomCurve3(wt.map(a=>new e.Vector3(a[1],a[2],a[3])),!1,"centripetal")}await c.yield();const Nt={uPos:{value:new e.Vector3(0,-90,0)},uFwd:{value:new e.Vector3(1,0,0)},uBend:{value:new e.Vector3(0,0,1e-4)},uBioK:{value:n.bio}};{const t=await k0(c);await c.yield();const o=new e.Mesh(t,Z("manta-whale-shark",y0,x0,Nt,{side:e.DoubleSide}));o.frustumCulled=!1,_.add(o)}await c.yield();const Ne=new e.Vector3,ct=new e.Vector3,Lt=new e.Vector3,Le=new e.Vector3,Dt=new e.Vector3,Ie=.9,He=.8,Me=B.eyeRadius(3.2)+2.1,Se=Math.PI*2/S.info.laneN,ke=(t,o)=>{y.pointAt(o,w);const a=Math.atan2(-w.z*p,w.x),s=.3+.2*P(.2,.24,o);let r=(a-s-S.info.wheelPhase-S.info.bottomRate*t)/Se;r-=Math.round(r);const f=s+.5*Se*(r-Math.sign(r)*.5*P(.08,.5,Math.abs(r))),l=a-f;return Ne.set(Math.cos(l)*Me,E+3,-Math.sin(l)*Me*p)},Ue=(t,o)=>{y.pointAt(o,w);const a=Math.atan2(-w.z*p,w.x)-Ie,s=Math.hypot(w.x,w.z)*He;return Le.set(Math.cos(a)*s,E,-Math.sin(a)*s*p)},Oe=(t,o)=>{gt(o,ct),gt(o+.006,Lt),gt(o-.006,G),Lt.sub(G).normalize(),ct.addScaledVector(Lt,3.5-1.5*P(.34,.37,o)-2.5*P(.37,.4,o)-2*P(.405,.435,o)),y.pointAt(o,w),w.z*=p,G.subVectors(w,ct),G.addScaledVector(Lt,-G.dot(Lt)),G.y=0,ct.addScaledVector(G,.7/Math.max(G.length(),.5)),ct.y-=.35;const a=Math.pow(P(.268,.352,o),1.7);if(a<1){y.pointAt(o,w),w.z*=p,y.tangentAt(o,G),G.z*=p;const s=Math.max(Math.hypot(G.x,G.z),1e-4),r=G.x/s,f=G.z/s,l=ct.x-w.x,d=ct.y-w.y,i=ct.z-w.z;let u=Math.atan2(r*i-f*l,r*l+f*i);u<-.35&&(u+=Math.PI*2);const h=.7+(Math.min(u,2.44)-.7)*a,m=-.21+(Math.max(-.52,Math.atan2(d,Math.hypot(l,i)))+.21)*a,F=Math.cos(m)*6;ct.set(w.x+(r*Math.cos(h)-f*Math.sin(h))*F,w.y+Math.sin(m)*6,w.z+(r*Math.sin(h)+f*Math.cos(h))*F)}return ct.z*=p,ct},At=B.shaftTop,U=B.shaftFoot,je=t=>{const o=(t-E)/(At.y-U.y);return g(U.x+(At.x-U.x)*o,t,U.z+(At.z-U.z)*o)},ze=t=>.58+.22*P(.05,.09,t)+.79*P(.12,.14,t)-.84*P(.175,.21,t)-.24*P(.262,.297,t)+.92*P(.46,.49,t)-.7*P(.53,.58,t)-.2*P(.63,.66,t)+.2*P(.69,.72,t)+.4*P(.72,.75,t)+.1*P(.79,.83,t)-.3*P(.84,.88,t),It=new Float32Array(401);for(let t=1;t<=400;t++)It[t]=It[t-1]+.0025/ze((t-.5)/400);const Ht=t=>{const o=Math.min(399.999,Math.max(0,t*400)),a=Math.floor(o);return It[a]+(It[a+1]-It[a])*(o-a)},Ae=Math.hypot(At.x-U.x,At.z-U.z),Ce=Math.hypot(U.x,U.z),Fe=B.eyeRadius(B.columnMid.y)+2.1,$e=[g(U.x/Ce*Fe,E+B.columnMid.y,U.z/Ce*Fe),g((At.x-U.x)/Ae*150,E+16+150*Math.tan(.663),(At.z-U.z)/Ae*150),kt],Zt=t=>(y.posAtDist(t,w),w.y-=E,w.z*=p,w),Jt=(t,o,a)=>{for(let s=t+o;s>0&&s<y.length;s+=o)if(a(s)>0){let r=s-o,f=s;for(let l=0;l<5;l++){const d=.5*(r+f);a(d)>0?f=d:r=d}return f}return t},Qe=t=>(Zt(t),Math.hypot(w.x-U.x,w.z-U.z)),ie=t=>(Zt(t).sub(U),w.addScaledVector(G.subVectors(At,U).normalize(),-w.dot(G)).length()),re=4,Ut=1,qt=Jt(0,.25,t=>Zt(t).y>B.columnMid.y&&Qe(t)<B.shaftRadius?1:-1),te=Jt(qt,-.25,t=>(Zt(t),w.z*U.x-w.x*U.z)),Ot=Jt(qt,.25,t=>ie(t)<B.shaftRadius&&ie(t+.05)>ie(t-.05)?1:-1),Tt=[[te,qt,0,0],[qt+Ut,Ot,1,.38],[Ot+Ut,y.length,0,0]].map(t=>[t[0]/y.length,t[1]/y.length,t[2],t[3]]),Xe=(t,o,a)=>{const s=Ht(t);return Math.min(1,Math.max(0,(Ht(a)-s)/(Ht(o)-s)))},Re=t=>t<.16?t*t/(2*.16*(1-.16)):t>1-.16?1-(1-t)*(1-t)/(2*.16*(1-.16)):(t-.16/2)/(1-.16),ee=t=>{const o=t.x-w.x,a=t.y-w.y,s=(t.z-w.z)*p;return[Math.atan2(s,o),Math.atan2(a,Math.hypot(o,s))]},oe=(t,o)=>{y.posAtDist(Math.min(y.length,o*y.length+9),Dt),y.pointAt(o,w);let[a,s]=ee(Dt);for(let f=0;f<Tt.length;f++){const l=Xe(Tt[f][0],Tt[f][1],o),d=Tt[f][3],i=Re(d>0?1-Math.pow(1-l,1.5):l);if(l<=0)break;const[u,h]=ee($e[f]);let m=u-a;m-=Math.PI*2*Math.round(m/(Math.PI*2)),Tt[f][2]>0&&m<0&&(m+=Math.PI*2),a+=m*i,s+=(h-s)*Re(Math.max(0,(l-d)/(1-d)))}const r=Math.cos(s)*16;return Dt.set(w.x+Math.cos(a)*r,w.y+Math.sin(s)*16,w.z+Math.sin(a)*r*p)},le=(t,o)=>{oe(0,t/y.length);let[a,s]=ee(Dt),r=0;for(let f=t;f<o-1e-6;f+=.25){const l=Math.min(f+.25,o);oe(0,l/y.length);const[d,i]=ee(Dt);let u=d-a;u-=Math.PI*2*Math.round(u/(Math.PI*2)),r=Math.max(r,Math.hypot(u,i-s)/(Ht(l/y.length)-Ht(f/y.length))),a=d,s=i}return r},Ye=Math.max(le(te,qt),le(qt+Ut,Ot)),Ze=Jt(Ot+Ut,.25,t=>(Tt[2][1]=t/y.length,Ye-le(Ot+Ut,t)));Tt[2][1]=Ze/y.length;const ft=[.632,.804,.15],Te=.2,jt=new e.Vector3,yt=new e.Vector3,ae=new e.Vector3,Vt=new e.Vector3,Je=Math.min(9*3.4,Math.max(9,y.length*.22)),t0=(t,o)=>{const a=(ft[1]-ft[0])*ft[2],s=.35*P(ft[0],ft[0]+a,o)*(1-P(ft[1]-a,ft[1],o)),r=1-s;oe(t,o),ae.copy(Dt).sub(w).normalize(),y.posAtDist(o*y.length+Je,yt).sub(w).normalize(),yt.y*=.55,yt.normalize(),Vt.copy(yt).multiplyScalar(1-Te).addScaledVector(ae,Te).normalize();const f=.35*Vt.dot(ae),l=f+Math.sqrt(Math.max(f*f-.1225+.4225,0));Vt.multiplyScalar(l).addScaledVector(ae,-.35).normalize();const d=r*Vt.dot(yt),i=d*d-r*r+s*s;return i>=0?jt.copy(Vt).multiplyScalar(d+Math.sqrt(i)).addScaledVector(yt,-r):jt.copy(Vt).addScaledVector(yt,-Vt.dot(yt)),jt.lengthSq()<1e-8&&jt.copy(yt),jt.normalize().multiplyScalar(16).add(w)},e0=[{at:g(-2.5,-6,-.5),from:.005,to:.13,weight:.8,fade:.5},{at:ke,from:.105,to:.215,weight:.9,fade:.3},{at:ke,from:.15,to:.28,weight:.9,fade:.5},{at:Ue,from:.205,to:.335,weight:.75,fade:.54},{at:Oe,from:.265,to:.465,weight:.9,fade:.2},{at:je(-16),from:.47,to:.57,weight:.4,fade:.3},{at:kt,from:.8,to:1,weight:.66,fade:.15},{at:t0,from:ft[0],to:ft[1],weight:1,fade:ft[2]},{at:oe,from:(te-re)/y.length,to:.905,weight:1,fade:re/(.905*y.length-te+re)}],he=new e.Vector3,se=new e.Vector3,o0=new e.Vector2,xt=new e.Vector3,Bt=new e.Vector3,ce=new e.Vector3,ue=new e.Vector3,Ve=new e.Vector3,fe=new e.Vector3,Be=new e.Vector3,de=y.pointAt(0,new e.Vector3),me=y.tangentAt(0,new e.Vector3),a0=new e.Vector3(0,1,0);return{scene:_,path:y,duration:50,ride:"none",pace:ze,camera:{fov:62,near:.2,far:700,lookAhead:9,sway:.5,bank:.35,nearThrough:.3},pois:e0,portal:{shape:"circle",radius:4.5,color:"#CFEFE2",glow:.45,tilt:!0,revealDistance:45,blendDistance:25},post:{exposure:n.exposure,bloom:{strength:.4,radius:.6,threshold:.92},grade:{saturation:n.sat,contrast:1.06,tint:n.tint,shadowTint:"#02091a",vignette:.34,grain:.02,aberration:0}},update(t,o,a,s){a.getWorldPosition(xt);const r=!!c.through,f=Math.max(0,(de.x-xt.x)*me.x+(de.y-xt.y)*me.y+(de.z-xt.z)*me.z);L.density=n.dens*(r?12/(12+f):1),S.setThrough(r);const l=P(.488,.545,s);he.copy(dt.uShaftA.value),se.copy(dt.uShaftB.value).sub(he),G.set(xt.x,xt.y-E,xt.z*p).sub(he);const d=G.addScaledVector(se,-Math.min(1,Math.max(0,G.dot(se)/se.lengthSq()))).length(),i=dt.uShaftR.value,u=(n.shaft[0]+(n.shaft[1]-n.shaft[0])*l)*(1-n.ease*(1-P(.25*i,.8*i,d)))*(1-.4*P(.86,.92,s));S.setShaft(u),S.setShadow(.56+.1*u),pt.uDisc.value.x=Math.min(1,(n.shaft[0]+(n.shaft[1]-n.shaft[0])*l)/Math.max(n.shaft[0],n.shaft[1])),pt.uDisc.value.y=l*n.dim;const h=P(.47,.545,s);H.uGap.value=n.gap[0]+(n.gap[1]-n.gap[0])*h,H.uRiftQ.value.copy(rt).lerp(tt,n.rift[0]+(n.rift[1]-n.rift[0])*h),H.uRing.value.z=P(.74,.84,s);const m=1-P(.6,.66,s);gt(s,ut),gt(s+.006,bt),gt(s-.006,Et),ot.subVectors(bt,Et);const F=Math.max(ot.length(),.001);if(ot.multiplyScalar(1/F),Bt.copy(ut).addScaledVector(ot,4.2),Bt.y-=E,ce.copy(ut).addScaledVector(ot,-4.2),ce.y-=E,ue.copy(ut).addScaledVector(ot,-5.2),ue.y-=E,S.setCapsule(Bt,ue,m>.01?6.3*m:0),Ve.copy(ot),S.setBow(Bt,Ve,m),pt.uShkA.value.set(Bt.x,Bt.y,Bt.z,m),pt.uShkB.value.copy(ce),bt.sub(ut).normalize(),G.subVectors(ut,Et).normalize(),bt.sub(G).multiplyScalar(2/F),ut.z*=p,ot.z*=p,bt.z*=p,fe.crossVectors(a0,ot).normalize(),Be.crossVectors(ot,fe),Nt.uPos.value.copy(ut),m<=.01&&(Nt.uPos.value.y=-90),Nt.uFwd.value.copy(ot),Nt.uBend.value.set(Math.max(-.12,Math.min(.12,bt.dot(fe))),Math.max(-.12,Math.min(.12,bt.dot(Be))),Math.max(m,1e-4)),T){const A=(s-.8)/.05,W=A>0&&A<1;S.setBreach(W?A:-1),H.uHole.value.w=W?P(.27,.33,A)*(1-P(.6,.98,A)):0}S.update(t,o,a),ht.position.x=et.position.x=zt.position.x=xt.x,ht.position.z=et.position.z=zt.position.z=xt.z,ge.uPx.value=c.renderer.getDrawingBufferSize(o0).y},dispose(){S.dispose()}}}};export{R0 as default};
