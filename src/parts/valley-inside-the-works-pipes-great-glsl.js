import{LIGHT as t,LIQUID as a,FOG_FRAG as i,GLASS_LINE as n}from"./valley-inside-the-works-pipes-glsl.js";const e={cell:10,tail:1.2,gap:1.5,more:1.3,cap:.85,slots:6},o=r=>r.toFixed(3),l=`
const float CELL = ${o(e.cell)}, TAIL = ${o(e.tail)}, GAP0 = ${o(e.gap)}, GAP1 = ${o(e.more)}, CAP = ${o(e.cap)};
// what is dealt to slug i of the stream: how far its tail line lies above its cell's foot, and its top short of its head
float slugTail(float i) { return TAIL * vh(vec3(i, 3.7, 1.0)); }
float slugGap(float i) { return GAP0 + GAP1 * vh(vec3(i, 9.1, 2.0)); }
// slugAt(q, fw): where the stream's place q (metres along the pipe, carried up it; fw: metres under one pixel)
// lies among the slugs. x: 1 where a slug's body lies against the glass (from its tail line up to the ring where
// its rounded top leaves the glass), else 0. y: metres under the tail line of the slug next above (it counts only
// outside a body). z: which slug that is.
vec3 slugAt(float q, float fw) {
  float i = floor(q / CELL), f = q - i * CELL, a = slugTail(i);
  float under = 1.0 - step(a, f);                             // 1 in the clear length under this cell's slug
  float soft = max(fw, 1e-4);                                 // (the two edges below are never equal)
  float body = (1.0 - under) * (1.0 - smoothstep(-soft, soft, f - (CELL - slugGap(i) - CAP)));
  return vec3(body, mix(CELL - f + slugTail(i + 1.0), a - f, under), i + 1.0 - under);
}
`,f=`
attribute vec4 aFlow; varying vec4 vFlow;
uniform float uSpeed, uTime; uniform vec3 uPipe;
varying vec3 vWorld, vN;
#ifdef USE_FOG
  varying float vFogDepth;
#endif
${t}
${l}
void main() {
  float dome = step(7.5, aFlow.w), rho = aFlow.x;
  float q0 = -uSpeed * uTime, i = floor(q0 / CELL) + aFlow.w - 8.0;
  float s = min((i + 1.0) * CELL - slugGap(i) - q0 - CAP * rho * rho, uPipe.y);
  vec3 p = vec3(position.x, mix(position.y, uPipe.x + s, dome), position.z);
  vec3 n = mix(normal, vec3(2.0 * CAP * rho * aFlow.y, uPipe.z, -2.0 * CAP * rho * aFlow.z), dome);
  vFlow = vec4(mix(aFlow.x, s, dome), aFlow.yzw);
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vWorld = wp.xyz; vN = mat3(modelMatrix) * n;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #ifdef USE_FOG
    vFogDepth = -mvPosition.z;
  #endif
}`,c=`
uniform float uSpeed, uTime; uniform vec3 uPipe;
varying vec3 vWorld, vN; varying vec4 vFlow;
${t}
${a}
${i}
${l}
// a strip's cover: 1 within hw of its middle line, 0 beyond it, softened over e either side (never over nothing:
// the two edges always differ)
float strip(float dist, float hw, float e) { float s = max(e, 1e-4); return 1.0 - smoothstep(hw - s, hw + s, dist); }
// WHAT HANGS UNDER THE TAIL of slug j: its cover d metres under the tail line, at the place round the bore that is
// turn (0 to 1) and rd (the same place as a unit pair); e: metres under one pixel
float hangs(float d, float turn, vec2 rd, float j, float e) {
  // the ragged edge: the liquid ends a hand to three quarters of a metre under the tail line, by a slow noise
  float cov = strip(d, 0.2 + 0.55 * vn(vec3(rd * 2.3 + j * 7.3, 0.5)), e);
  // DRIPS: nine lanes round the bore, and in two of three hangs a drip, 0.8 to 2.4 m long
  float al = fract(turn) * 9.0, lane = min(floor(al), 8.0);
  float h1 = vh(vec3(lane, j, 11.0)), h2 = vh(vec3(lane, j, 17.0)), h3 = vh(vec3(lane, j, 23.0));
  float len = (0.8 + 1.6 * h2) * step(0.34, h1), u = (al - lane - 0.5 - (h3 - 0.5) * 0.5) * 0.698 * uPipe.z;
  cov = max(cov, strip(abs(u), mix(0.21, 0.04, smoothstep(0.0, 0.45 * len + 0.01, d)), e) * (1.0 - step(len - 0.07, d)));
  cov = max(cov, strip(length(vec2(u, d - len + 0.07)), 0.07, e) * step(0.5, len));
  // RUNS: five lanes, and in three of five a thin run, 4.5 cm wide, 2 to 4.6 m long
  float bl = fract(turn + 0.37) * 5.0, lane2 = min(floor(bl), 4.0);
  float g1 = vh(vec3(lane2, j, 31.0)), g2 = vh(vec3(lane2, j, 37.0)), g3 = vh(vec3(lane2, j, 41.0));
  float u2 = (bl - lane2 - 0.5 - (g3 - 0.5) * 0.6) * 1.2566 * uPipe.z;
  float run = strip(abs(u2), 0.0225, e) * (1.0 - step(2.0 + 2.6 * g2, d)) * step(0.4, g1) * (1.0 - smoothstep(0.03, 0.09, e));
  return max(cov, run);
}
void main() {
  vec3 N = vN / max(length(vN), 1e-4);
  vec2 rd = vFlow.yz;                                         // the place round the bore: a unit pair, so no seam
  float s = vFlow.x, e = 0.7 * max(fwidth(s), length(fwidth(rd)) * uPipe.z);
  // the liquid's own coordinates, carried UP the pipe by the world's clock: the layer against the glass at uSpeed,
  // the core of the stream behind it a third faster
  float q = s - uSpeed * uTime, qc = s - 1.35 * uSpeed * uTime;
  float w = q * 0.36 + 2.0 * vn(vec3(rd * 0.9 + 3.1, q * 0.16)), wf = fwidth(w);
  // WHERE THE LIQUID IS: a slug's body, what hangs under its tail, a rounded top (aFlow.w over 7)
  float dome = step(7.5, vFlow.w), turn = atan(rd.y, rd.x + 1e-5) / 6.2832 + 0.5;
  vec3 sl = slugAt(q, 0.7 * fwidth(s));
  float hang = hangs(sl.y, turn, rd, sl.z, e) * (1.0 - sl.x) * (1.0 - dome);
  float cover = max(max(sl.x, hang), dome);
  if (cover < 0.25) discard;
  // FOLDS: w counts them up the pipe; f runs from a fold's lower edge (0) to its lap over the next (1)
  float f = fract(w);
  float bold = (0.25 + 0.75 * vn(vec3(rd * 0.7 + 11.0, q * 0.11))) * (1.0 - smoothstep(0.3, 0.8, wf));
  float crown = smoothstep(0.0, 0.7, f) - smoothstep(0.82 - wf, 1.0, f);       // light along its crown, dark at both edges
  // MASSES, and the DARKER CORE in patches (less of it where a fold's crown lies over it)
  float mass = vn(vec3(rd * 0.8, q * 0.17));
  float deep = smoothstep(0.42, 0.72, vn(vec3(rd * 1.1 - 5.0, qc * 0.21))) * (1.0 - 0.6 * crown * bold);
  vec3 col = uChoc * (0.88 + 0.24 * mass) * (1.0 - 0.32 * bold * (1.0 - crown));
  col = mix(col, uChoc * 0.58, 0.5 * deep);
  col = mix(col, lighter(col), 0.65 * bold * crown * crown);
  float glint = bold * crown * crown * crown * smoothstep(0.38, 0.72, vn(vec3(rd * 2.1 + 9.0, q * 0.7)));
  col = mix(col, lighter(lighter(col)), 0.7 * glint);
  // what hangs under a tail runs thin: the river's lighter tone; the inside of a slug lies in its own shade
  col = mix(col, lighter(uChoc * (0.9 + 0.2 * mass)), 0.6 * hang);
  float inside = 1.0 - float(gl_FrontFacing);
  N *= 1.0 - 2.0 * inside;
  gl_FragColor = vec4(mix(liquidLight(col * (1.0 - 0.45 * inside), N, vWorld), fogColor, fogAmount()), cover);
}`,d=`
uniform vec3 uGlass, uPipe, uJoint; uniform vec2 uTube; uniform float uSpeed, uTime;
varying vec3 vWorld, vN; varying vec4 vFlow;
${t}
${a}
${i}
${n}
${l}
// how much of a pixel f wide at x lies in the band from a to b
float inBand(float x, float a, float b, float f) { return clamp((min(x + 0.5 * f, b) - max(x - 0.5 * f, a)) / max(f, 1e-4), 0.0, 1.0); }
vec4 over(vec4 top, vec4 under) { return top + (1.0 - top.a) * under; }
void main() {
  vec3 N = vN / max(length(vN), 1e-4), T = vec3(0.0, 1.0, 0.0);
  vec3 E = cameraPosition - vWorld, V = E / max(length(E), 1e-4);
  float foot = clamp(length(fwidth(N)), 0.0, 1.5), fy = fwidth(vWorld.y);
  float back = 1.0 - float(gl_FrontFacing), front = 1.0 - back;   // the far wall, the near wall
  vec3 Nf = N * (1.0 - 2.0 * back);                            // the glass's face toward the eye
  // across the pipe as seen: 0 on its middle line, 1 at its edge (as in the rank's glass)
  vec3 Vp = V - T * dot(V, T); Vp /= max(length(Vp), 1e-3);
  float ndv = clamp(abs(dot(N, Vp)), 0.0, 1.0), x = sqrt(max(1.0 - ndv * ndv, 0.0)), fx = clamp(foot * ndv, 0.0, 0.5);
  float core = uTube.y, rw = 0.04 / uTube.x, bore = 1.0 - smoothstep(core - fx - 0.01, core, x);
  float bar = lightBar(vWorld);
  vec3 sky = uSky * 0.3183, sun = uSun * 0.3183, glare = sky * 0.95 + sun * bar * 1.2;
  // the film, in a clear length
  float q = vFlow.x - uSpeed * uTime;
  vec3 sl = slugAt(q, fy);
  float film = (1.0 - sl.x) * bore * mix(0.3, 0.1, smoothstep(0.3, 3.0, sl.y)) * (0.7 + 0.6 * vn(vec3(vFlow.yz * 3.1, q * 0.4)));
  vec4 c = vec4(liquidLight(lighter(uChoc), Nf, vWorld), 1.0) * ((2.0 * film - film * film) * front);
  // the far wall's own highlight
  float line = lineAcross(Nf, T, uLightDir, V, foot);
  c.rgb += glare * (0.5 * line * back * bore);
  // the near wall: the tint, the wall's band, the bore's edge, the rim, the cut ends at the flanges, the highlight
  float wall = smoothstep(core - 0.5 * fx, core + 0.04 + 0.5 * fx, x), edge = smoothstep(0.93, 1.0, x);
  c = over(vec4(sky * uGlass * 0.6, 1.0) * (0.06 * bore * front), c);
  c = over(vec4((sky * (0.8 - 0.3 * edge) + sun * bar * 0.05) * uGlass, 1.0) * (wall * (0.4 + 0.3 * edge) * front), c);
  c = over(vec4(sky * 0.9, 1.0) * (0.5 * inBand(x, core - 0.5 * rw, core + 0.5 * rw, fx) * front), c);
  c = over(vec4(sky * 1.15 + sun * bar * 0.4, 1.0) * (0.9 * inBand(x, 1.0 - rw, 1.0, fx) * front), c);
  float jd = abs(mod(vWorld.y - uJoint.x + 0.5 * uJoint.y, uJoint.y) - 0.5 * uJoint.y) - uJoint.z;
  c = over(vec4(sky * 1.15 + sun * bar * 0.4, 1.0) * ((0.5 + 0.4 * x * x) * inBand(jd, 0.0, 0.035, fy) * front), c);
  c = over(vec4(glare, 0.8) * (line * front), c);
  gl_FragColor = vec4(mix(c.rgb, fogColor * c.a, fogAmount()), c.a);
}`;export{d as GREAT_GLASS_FRAG,c as GREAT_LIQUID_FRAG,f as GREAT_VERT,e as SLUG,l as SLUGS};
