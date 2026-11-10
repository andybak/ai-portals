import*as z from"three";const k0=["#F4C21B","#F08A2C","#A9B45A","#6F9BC4","#FFF6DC","#2E2A1C","#C8281E"],a0=`
uniform float uCamS, uLead, uTime, uLen;
uniform vec3 uSun, uSunCol, uSkyCol, uShade, uCamL, uLamp;
uniform vec2 uGust, uHall, uFlower, uBridge, uBlue;
uniform vec4 uTree, uTree2, uPortal;
uniform vec4 uZone[8];
uniform float uRamp, uTintK;
uniform vec3 uHallLamp;
uniform vec3 uPortalCol;
uniform float uWet;
uniform vec3 uPal[4];
uniform vec2 uHold;
uniform vec4 uYard;
uniform vec4 uUmb[16];
uniform float uBandK;
uniform vec4 uAwn;     // the cloth's swing: (shut angle above level, swing, how much deeper the valance hangs shut, how much deeper the front skirt hangs shut)
uniform vec4 uClear;   // the clearance rule over the flight line: (least angle of a panel near the cab, metres ahead of the cab it holds for, metres over which it eases off, unused)
float fmH1(float n){ n = fract(n * 0.1031); n *= n + 33.33; n *= n + n; return fract(n); }
float fmH2(vec2 p){ vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float fmN2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(fmH2(i), fmH2(i+vec2(1.,0.)), f.x), mix(fmH2(i+vec2(0.,1.)), fmH2(i+vec2(1.,1.)), f.x), f.y); }
// ballast: irregular stones (jittered cells) with a finer octave, fading to their mean with distance so they never shimmer
float fmStone(vec2 w, float dist){
  vec2 j = vec2(fmN2(w * 9.0 + 3.0), fmN2(w * 9.0 + 41.0)) - 0.5;
  float a = fmH2(floor(w * 19.0 + j * 2.4)), b = fmH2(floor(w * 43.0 - j * 3.0 + 7.0));
  return mix(a * 0.62 + b * 0.2 + fmN2(w * 5.0) * 0.18, 0.5, clamp(dist / 40.0, 0.0, 0.85));
}
// the crossing road in front of the lane (lane w = (x, s), s = -45..-0.5): asphalt with darker repairs and cracks, a worn
// centre line, stop bars before the rails, a hatched keep-clear box either side of the track where the railcar comes in,
// and the planks between and beside the rails
vec3 fmRoad(vec2 w, float n1, float n2, float n3){
  float x = w.x, s = w.y, ax = abs(x);
  vec3 asph = vec3(0.115, 0.115, 0.12) * (0.75 + 0.5 * n3) * (0.85 + 0.3 * n2);
  asph *= 1.0 - 0.28 * smoothstep(0.56, 0.6, fmN2(w * 0.3 + 90.0)) - 0.2 * (1.0 - smoothstep(0.0, 0.03, abs(fmN2(w * 0.5 + 33.0) - 0.5)));
  float paint = (1.0 - smoothstep(0.07, 0.11, abs(s + 8.8))) * step(0.45, fract(x * 0.22)) + (1.0 - smoothstep(0.2, 0.26, abs(ax - 10.2))) * step(abs(s + 8.8), 7.2);
  float box = step(1.85, ax) * step(ax, 4.7) * step(-16.6, s) * step(s, -11.2);
  paint += box * max(step(0.8, fract((x + s) * 0.55)), max(step(4.52, ax), max(step(ax, 2.03), step(2.52, abs(s + 13.9)))));
  asph = mix(asph, vec3(0.55, 0.50, 0.30) * (0.5 + 0.5 * n1), clamp(paint, 0.0, 1.0) * (0.3 + 0.5 * n2));
  float plank = (1.0 - smoothstep(1.55, 1.6, ax)) * step(0.09, abs(ax - 0.5));
  vec3 pl = vec3(0.17, 0.125, 0.08) * (0.6 + 0.6 * fmN2(vec2(x * 30.0, s * 1.5))) * (0.55 + 0.45 * smoothstep(0.0, 0.02, abs(fract(x * 4.0) - 0.5)));
  return mix(asph, pl, plank);
}
// the station yard's packed earth: dark and gritty, with pale pebbles near the eye, and grass that creeps in with a crisp
// ragged edge and blade-scale light and dark (the fine structure fades with distance so it never shimmers)
vec3 fmEarth(vec2 w, float n1, float n2, float n3, float dist){
  float near = clamp(1.0 - dist / 34.0, 0.0, 1.0), near2 = clamp(1.0 - dist / 16.0, 0.0, 1.0);
  vec3 earth = vec3(0.145, 0.117, 0.078) * (0.7 + 0.45 * n2) * (0.8 + 0.4 * fmStone(w * 1.2 + 5.0, dist) * n1);
  float peb = fmH2(floor(w * 14.0 + vec2(n1, n3) * 1.5));
  earth = mix(earth, vec3(0.30, 0.275, 0.23) * (0.6 + 0.6 * n3), step(0.93, peb) * near2 * 0.8);
  earth *= 1.0 - 0.22 * (1.0 - smoothstep(0.0, 0.035, abs(fmN2(w * 0.7 + 51.0) - 0.5))) * smoothstep(0.45, 0.6, fmN2(w * 0.23 + 9.0)) * near;   // dried cracks
  float gk = smoothstep(0.58, 0.65, fmN2(w * 0.9 + 5.0) * 0.75 + n3 * 0.25);
  float blade = fmN2(w * vec2(38.0, 29.0)), tuft = fmN2(w * 6.5 + 17.0);
  vec3 grass = vec3(0.105, 0.20, 0.05) * (0.6 + 0.8 * n1) * mix(1.0, (0.62 + 0.76 * blade) * (0.8 + 0.4 * tuft), near);
  grass = mix(grass, vec3(0.26, 0.27, 0.09) * (0.7 + 0.6 * blade), smoothstep(0.62, 0.8, tuft) * 0.5 * near);   // dry, straw-coloured tufts among the green
  return mix(earth, grass, gk * 0.78);
}
// distance of an awning cell ahead of the cab, ragged per awning, sides half a beat apart
float fmCellD(float cell, float side){
  return (cell + 0.5) * 3.0 - uCamS + (fmH1(cell * 2.0 + side * 0.5 + 7.0) - 0.5) * 1.6 + side * 0.9; }
// the rooms of the lane, uZone[i] = (s0, s1, side, kind): side -1 left, +1 right, 0 both; kind 0 open ground (no shops, stalls or
// cloth), 1 stalls without cloth, 2 the roofed hall (no cloth), 3 the flower quarter (cloth, in one colour).
// Returns (no cloth left, no cloth right, no wall left, no wall right) for the awning cell whose centre is at lane distance cc
vec4 fmGap(float cc){
  vec4 g = vec4(0.0);
  for (int i = 0; i < 8; i++) { vec4 z = uZone[i];
    float k = step(z.x, cc) * step(cc, z.y) * step(z.w, 2.5), l = k * step(z.z, 0.5), r = k * step(-0.5, z.z), op = step(z.w, 0.5);
    g = max(g, vec4(l, r, l * op, r * op)); }
  return g; }
// the roofed hall: 1 under its roof (ridge 9.2 m over the rails, eaves 7.9 m at the house fronts), with a soft edge at the mouths
float fmHallK(vec3 P, float off){
  float s = uLen * 0.5 - P.z, xp = abs(P.x - off);
  return smoothstep(uHall.x - 0.5, uHall.x + 1.5, s) * (1.0 - smoothstep(uHall.y - 1.5, uHall.y + 0.5, s)) * step(xp, 5.4) * step(P.y, 9.2 - xp * 0.245); }
float fmOpenD(float d){ float o = (1.0 - smoothstep(uLead, uLead + uRamp, d)) * smoothstep(-14.0, -6.0, d);
  o = max(o, step(uHold.x, d + uCamS) * step(d + uCamS, uHold.y));   // rows that always stand raised (either side of the trestle's ramp)
  return max(o, uGust.y * (1.0 - smoothstep(uGust.x - 16.0, uGust.x, d + uCamS)) * step(-6.0, d)); }
// cloth angle above horizontal: closed slopes down 24 deg (so the cab looks onto a valley of cloth), open stands 70 deg up, with a snap overshoot
// (uAwn = -0.42, 1.642 as built; the design's own numbers, a free edge 2.7 m above the rail and a 75 degree swing, are -0.214, 1.309)
float fmAngle(float o){ float e = o*o*(3.-2.*o);
  return uAwn.x + uAwn.y * e + 0.10 * sin(3.14159 * smoothstep(0.55, 1.0, o)) * o; }
// THE CLEARANCE RULE, one for the whole line (uClear = least angle, metres ahead, metres of easing; the world works the angle out from a
// height above the flight line): within uClear.y metres ahead of the cab (and beside it, until the cloth falls behind), a lifted or lifting
// panel stands at least uClear.x above level, which is to say no part of its frame further than a stated distance from its own wall is
// lower than a stated height above the flight line (the hinge rail runs 1.15 m above the flight line everywhere, on the trestle too). A
// panel that would hang lower swings further up on its hinge; none is moved. Over the next uClear.z metres the rule eases off, so the rows
// further ahead lift exactly as the wave has them. d: the panel's distance ahead of the cab; a: the angle the wave gives it.
float fmClearK(float d){ return (1.0 - smoothstep(uClear.y, uClear.y + uClear.z, d)) * smoothstep(-14.0, -6.0, d); }
float fmAngleD(float o, float d){ float a = fmAngle(o); return mix(a, max(a, uClear.x), fmClearK(d)); }
vec3 fmClothCol(float cell, float side){
  float h = fmH1(cell * 3.7 + side * 11.3 + 2.0);
  vec3 c = uPal[0];
  c = mix(c, uPal[1], step(0.40, h)); c = mix(c, uPal[2], step(0.70, h)); c = mix(c, uPal[3], step(0.86, h));
  float cc = (cell + 0.5) * 3.0, fl = step(uFlower.x, cc) * step(cc, uFlower.y);   // the last straight: saffron, bleached green, white and faded blue, mixed
  c = mix(c, mix(mix(vec3(0.905, 0.539, 0.011), vec3(0.397, 0.456, 0.102), step(0.36, h)), mix(vec3(0.80, 0.78, 0.68), vec3(0.158, 0.328, 0.552), step(0.82, h)), step(0.62, h)), fl);
  float bw = step(uBlue.x, cc) * step(cc, uBlue.y);                                    // the run after the bridge: blue and white only
  c = mix(c, mix(vec3(0.115, 0.27, 0.56), vec3(0.80, 0.79, 0.72), step(0.5, h)), bw);
  return c * (0.82 + 0.3 * fmH1(cell * 9.1 + side * 3.0)); }
// a tree's shade on whatever lies under it: tr = (x, crown height, z, radius), 0 radius = no tree
float fmTreeShade(vec3 P, vec4 tr){
  vec3 Qt = P + uSun * (max(tr.y - P.y, 0.0) / max(uSun.y, 0.05)); float dt = length(Qt.xz - tr.xz) / max(tr.w, 0.01);
  float dap = fmN2(Qt.xz * 0.55 + vec2(sin(uTime * 0.6), cos(uTime * 0.47)) * 0.22) * 0.65 + fmN2(Qt.xz * 1.7 + vec2(cos(uTime * 0.9), sin(uTime * 0.8)) * 0.15) * 0.35;
  return 1.0 - step(1e-3, tr.w) * (1.0 - smoothstep(0.78, 1.05, dt + (dap - 0.5) * 0.3)) * (1.0 - 0.75 * smoothstep(0.42, 0.62, dap)) * 0.9; }
// sun visibility, cloth tint (zero where no cloth is overhead) and sky openness at local point P
// (off = lane-centre lateral offset there)
void fmSunEx(vec3 P, float off, out float vis, out vec3 tint, out float sky){
  float t = max(3.3 - P.y, 0.0) / max(uSun.y, 0.05);
  vec3 Q = P + uSun * t;
  float sq = uLen * 0.5 - Q.z, xq = Q.x - off, xp = abs(P.x - off);
  float cell = floor(sq / 3.0);
  float dL = fmCellD(cell, -1.0), dR = fmCellD(cell, 1.0);
  float oL = fmOpenD(dL), oR = fmOpenD(dR);
  float cc = (cell + 0.5) * 3.0; vec4 g = fmGap(cc);   // cells with no cloth, and with no wall either
  oL = max(oL, g.x); oR = max(oR, g.y);
  float cl = mix((xq + 3.5) - 4.0 * cos(fmAngleD(oL, dL)), 9.0, g.x);
  float cr = mix((3.5 - xq) - 4.0 * cos(fmAngleD(oR, dR)), 9.0, g.y);
  float f = fract(sq / 3.0) * 3.0;
  float slit = (1.0 - smoothstep(0.02, 0.07, min(f, 3.0 - f))) * 0.8;
  float inside = step(0.0, sq) * step(sq, uLen) * step(P.y, 3.3) * step(xp, 4.8);
  float v = max(smoothstep(-0.10, 0.10, min(cl, cr)), slit);
  float nowall = mix(g.w, g.z, step(xq, 0.0));
  v *= 1.0 - smoothstep(3.42, 3.6, abs(xq)) * (1.0 - nowall);
  vis = mix(1.0, v, inside);
  float pick = step(cl, cr), oc = mix(oR, oL, pick);
  vec3 mean = (uPal[0] + uPal[1] + uPal[2] + uPal[3]) * 0.25;
  tint = mix(mix(fmClothCol(cell, 1.0), fmClothCol(cell, -1.0), pick), mean, 0.45) * (1.0 - oc * oc) * inside * (1.0 - v);
  sky = mix(1.0, max(v, 0.5 * (oL + oR)) * (1.0 - 0.8 * smoothstep(3.5, 4.5, xp) * (1.0 - nowall)), inside);
  // the hall: no sun but through three slits in the roof and in at the two mouths; a little sky near the mouths
  float hk = fmHallK(P, off);
  vec3 Qr = P + uSun * (max(8.6 - P.y, 0.0) / max(uSun.y, 0.05));
  float sr = uLen * 0.5 - Qr.z, xr = abs(Qr.x - off), fsl = abs(fract((sr - uHall.x - 3.0) / 18.0) - 0.5) * 18.0;
  float hv = (1.0 - smoothstep(0.55, 0.8, fsl)) * (1.0 - smoothstep(2.3, 2.7, xr)) * step(uHall.x + 6.0, sr) * step(sr, uHall.y - 6.0);
  // the hall's roof is glazed between iron bars: whitewashed glass lets a quarter of the sun through, and the bars lay a lattice of shade
  float gbx = (0.5 - abs(fract(xr / 1.43) - 0.5)) * 1.43, gbs = (0.5 - abs(fract((sr - uHall.x) / 1.5) - 0.5)) * 1.5;
  hv = max(hv, 0.25 * smoothstep(0.05, 0.13, min(gbx, gbs)) * step(xr, 4.3) * step(uHall.x, sr) * step(sr, uHall.y));
  hv = max(hv, (1.0 - step(uHall.x, sr) * step(sr, uHall.y)) * step(xr, 5.0));
  float sp0 = uLen * 0.5 - P.z, mouth = exp(-max(min(sp0 - uHall.x, uHall.y - sp0), 0.0) * 0.16);
  vis = mix(vis, hv, hk); tint *= 1.0 - hk; sky = mix(sky, max(max(hv * 0.5, mouth * 0.7), 0.45), hk);
  vis *= fmTreeShade(P, uTree) * fmTreeShade(P, uTree2);
  // the open square: the house fronts on the sun's side lay their shade across its edge (uYard = s0, s1, front x, eaves height)
  float px0 = P.x - off, yk = step(uYard.x, sp0) * step(sp0, uYard.y) * step(abs(px0), uYard.z - 0.05);
  float eav = uYard.w + 3.2 * step(0.5, fmH1(floor((sp0 + 2.0 * uSun.z / max(uSun.y, 0.2)) / 7.5) + 3.0));
  float hr = P.y + (uYard.z - px0 * sign(uSun.x)) / max(abs(uSun.x), 0.02) * uSun.y;
  vis *= 1.0 - yk * (1.0 - smoothstep(eav - 0.5, eav + 0.5, hr));
  // slow cloud shadows drifting over the open square, its house fronts and its roofs
  vec2 cq = vec2(P.x * 0.8 + P.z * 0.6, P.z * 0.8 - P.x * 0.6);
  float cdk = 0.5 + 0.5 * sin(cq.x * 0.15 + 1.1 * sin(cq.y * 0.11 + 1.7) - uTime * 0.42);
  float ck = smoothstep(uYard.x - 14.0, uYard.x + 2.0, sp0) * (1.0 - smoothstep(uYard.y - 4.0, uYard.y + 10.0, sp0));
  vis *= 1.0 - 0.42 * ck * smoothstep(0.6, 0.86, cdk);
}
// market umbrellas standing in the square, uUmb[i] = (x, z, radius, rim height): x = how much sun they let through to the ground at P, y = the pools of their bulbs
vec2 fmUmb(vec3 P){
  float sh = 1.0, lamp = 0.0; vec2 so = uSun.xz / max(uSun.y, 0.25);
  for (int i = 0; i < 16; i++) { vec4 q = uUmb[i]; float on = step(0.5, q.z), r = max(q.z, 0.01);
    vec2 d = P.xz - q.xy + so * q.w, e = P.xz - q.xy;
    sh *= 1.0 - 0.85 * on * (1.0 - smoothstep(r * 0.8, r * 1.08, length(d)));
    lamp += on * exp(-dot(e, e) * 0.10); }
  return vec2(sh, lamp);
}
void fmSun(vec3 P, float off, out float vis, out vec3 tint){ float sky; fmSunEx(P, off, vis, tint, sky); }
vec3 fmShade(vec3 alb, vec3 N, vec3 P, float off){
  float vis, sky; vec3 tint; fmSunEx(P, off, vis, tint, sky);
  float ndl = max(dot(N, uSun), 0.0), up = N.y * 0.5 + 0.5;
  vec3 L = uSunCol * ndl * vis;
  L += tint * uSunCol * (0.07 + 0.17 * up) * uTintK;
  float hk = fmHallK(P, off);
  L += mix(uShade * mix(1.0, 0.8, hk), uSkyCol, 0.1 + 0.75 * sky) * (0.35 + 0.65 * up);
  L += uSunCol * vec3(0.20, 0.17, 0.12) * max(vis, sky * 0.55) * (0.3 + 0.7 * (1.0 - up));
  float xp = abs(P.x - off), sp = uLen * 0.5 - P.z;   // bare-bulb warmth deep in the shopfronts
  L += vec3(0.40, 0.25, 0.10) * smoothstep(3.55, 4.1, xp) * step(xp, 4.8) * step(P.y, 3.3) * step(0.0, sp) * step(sp, uLen) * (0.45 + 0.55 * up);
  float bx = (fract(sp / 3.0) - 0.5) * 3.0;            // lamp light pools round each stall's bulb, dim between stalls and over the rails
  float pool = (0.25 + 1.2 * exp(-bx * bx * 0.9)) * mix(0.5, 1.0, smoothstep(0.6, 2.4, xp)) * (1.0 - 0.5 * smoothstep(1.2, 3.3, P.y));
  float cellp = floor(sp / 3.0) + step(P.x, off) * 0.5;   // bare bulbs waver a little, each at its own pace
  pool *= 0.91 + 0.09 * sin(uTime * (4.0 + 5.0 * fmH1(cellp * 2.0 + 3.0)) + cellp * 4.7);
  float brK = step(uBridge.x - 2.0, sp) * step(sp, uBridge.y + 2.0) * step(xp, 2.9);   // the trestle's deck and rails, under their own bulbs
  L += uLamp * step(xp, 4.9) * max(step(P.y, 4.6), brK) * step(-1.0, sp) * step(sp, uLen + 1.0) * (0.4 + 0.6 * up) * pool * (1.0 + 2.2 * brK * smoothstep(1.0, 2.5, P.y));
  // the square: bulbs under the umbrellas and strings of bulbs across it, warm on the stalls and the house fronts
  float yk2 = smoothstep(uYard.x - 1.0, uYard.x + 3.0, sp) * (1.0 - smoothstep(uYard.y - 3.0, uYard.y + 1.0, sp));
  L += uLamp * yk2 * step(4.9, xp) * step(xp, uYard.z + 1.5) * (1.0 - smoothstep(3.4, 9.0, P.y)) * (0.4 + 0.6 * up) * (0.5 + 0.55 * exp(-(xp - 8.2) * (xp - 8.2) * 0.04));
  // the square's house fronts take the light of the bulb strings and of a bulb under each sign band; the corner houses that face the train too
  float fbx = (fract(sp / 3.2) - 0.5) * 3.2, frontK = smoothstep(uYard.z - 2.6, uYard.z - 0.4, xp) * step(xp, uYard.z + 1.5);
  L += uLamp * yk2 * frontK * (1.0 - smoothstep(2.5, 11.0, P.y)) * (0.55 + 0.75 * exp(-fbx * fbx * 0.8) * (1.0 - smoothstep(2.0, 6.0, P.y))) * 0.85;
  float cfx = (fract(xp / 3.2) - 0.5) * 3.2;
  L += uLamp * smoothstep(uYard.y - 3.6, uYard.y - 1.0, sp) * step(sp, uYard.y + 0.3) * step(4.9, xp) * step(xp, uYard.z) * (1.0 - smoothstep(2.5, 11.5, P.y)) * (0.42 + 0.8 * exp(-cfx * cfx * 0.8) * (1.0 - smoothstep(2.0, 6.0, P.y)));
  // the station: a row of lamps under the platform canopy, two lamp standards in the yard
  float px = P.x - off, stK = smoothstep(uLen + 6.0, uLen + 11.0, sp) * (1.0 - smoothstep(uLen + 58.0, uLen + 64.0, sp));
  float pk = (fract((sp - uLen - 10.5) / 7.0 + 0.5) - 0.5) * 7.0;
  L += uLamp * stK * smoothstep(1.0, 2.6, px) * (1.0 - smoothstep(8.6, 13.0, px)) * (1.0 - smoothstep(3.7, 4.6, P.y)) * (0.45 + 0.55 * up) * (0.5 + 1.2 * exp(-pk * pk * 0.14));
  vec2 dl1 = vec2(px + 5.6, sp - uLen - 27.0), dl2 = vec2(px + 5.6, sp - uLen - 42.5);
  L += uLamp * step(P.y, 5.0) * 1.5 * (exp(-dot(dl1, dl1) * 0.022) + exp(-dot(dl2, dl2) * 0.022)) * (0.4 + 0.6 * up);
  // the hall's paper lanterns: three rows under the trusses, warm on the stalls and the walls, fading into the roof
  float lrow = 0.7 + 0.3 * exp(-min(min(abs(P.x - off), abs(P.x - off - 2.4)), abs(P.x - off + 2.4)) * 0.9), lk = fract(sp / 6.0) - 0.5;
  L += max(uHallLamp - uLamp * 0.6, vec3(0.0)) * hk * (0.45 + 0.55 * up + 0.9 * (1.0 - up) * smoothstep(6.0, 7.6, P.y)) * lrow * (0.7 + 0.5 * exp(-lk * lk * 14.0)) * (1.0 - 0.42 * smoothstep(3.4, 5.0, xp))
    * (0.93 + 0.07 * sin(uTime * 2.3 + floor(sp / 6.0) * 2.1));
  L += uSunCol * vec3(0.055, 0.047, 0.035) * hk * (1.0 - 0.4 * up);   // daylight from the roof slits and the two mouths, thrown back up off the floor
  // the level crossing in front of the lane: a street-lamp pool on the road, and the two warning lamps winking in turn
  float rd = sp + 6.0, road = (1.0 - smoothstep(-0.6, 0.4, sp)) * (0.4 + 0.6 * up);
  L += uLamp * road * 1.1 * exp(-(rd * rd * 0.016 + xp * xp * 0.005)) * (1.0 - 0.7 * smoothstep(2.5, 9.0, P.y));
  vec2 dq = vec2(xp - 4.9, sp + 2.6);
  L += vec3(1.0, 0.07, 0.03) * (uLamp.r * 0.9 * road * (0.5 + 0.5 * sin(uTime * 4.4 + step(P.x, off) * 3.14159)) * exp(-dot(dq, dq) * 0.075));
  vec3 dp = P - uPortal.xyz;   // warm light spilling out of the portal onto the rails and ballast in front of it
  L += uPortalCol * (uPortal.w * exp(-length(dp.xz) * 0.085) * smoothstep(-1.0, 2.0, dp.z)) * (0.45 + 0.55 * up);
  return alb * L;
}
`,P0=[[3,2,6,7,0,0,1],[1,0,4,5,0,0,-1],[2,1,5,6,1,0,0],[0,3,7,4,-1,0,0],[7,6,5,4,0,1,0],[0,1,2,3,0,-1,0]],M0=[-1,1,1,-1,-1,1,1,-1],C0=[-1,-1,1,1,-1,-1,1,1];class n0{constructor(e,i){this.cap=2048,this.P=new Float32Array(this.cap*3),this.N=new Float32Array(this.cap*3),this.C=new Float32Array(this.cap*3),this.L=new Float32Array(this.cap*3),this.A=new Float32Array(this.cap*4),this.icap=8192,this.I=new Uint32Array(this.icap),this.ni=0,this.nv=0,this.off=e,this.len=i,this.mat=0,this.anim=[0,0,0,0],this.M=new z.Matrix4,this.aux=0}_grow(){const e=this.cap*2,i=(t,x)=>{const b=new Float32Array(e*x);return b.set(t),b};this.P=i(this.P,3),this.N=i(this.N,3),this.C=i(this.C,3),this.L=i(this.L,3),this.A=i(this.A,4),this.cap=e}vert(e,i,t,x,b,d,h,l,c){const s=this.M.elements,r=this.nv;r>=this.cap&&this._grow();let v=e,p=i,u=t,a=x,f=b,m=d;s[0]===1&&s[5]===1&&s[10]===1&&s[12]===0&&s[13]===0&&s[14]===0&&s[1]===0&&s[2]===0&&s[4]===0&&s[6]===0&&s[8]===0&&s[9]===0||(v=s[0]*e+s[4]*i+s[8]*t+s[12],p=s[1]*e+s[5]*i+s[9]*t+s[13],u=s[2]*e+s[6]*i+s[10]*t+s[14],a=s[0]*x+s[4]*b+s[8]*d,f=s[1]*x+s[5]*b+s[9]*d,m=s[2]*x+s[6]*b+s[10]*d);const g=1/(Math.sqrt(a*a+f*f+m*m)||1),A=this.off(this.len*.5-u),w=r*3,y=r*4,k=this.anim,M=this.P,q=this.N,K=this.C,N=this.L,C=this.A;return M[w]=v+A,M[w+1]=p,M[w+2]=u,q[w]=a*g,q[w+1]=f*g,q[w+2]=m*g,K[w]=h,K[w+1]=l,K[w+2]=c,N[w]=A,N[w+1]=this.mat,N[w+2]=this.aux,C[y]=k[0],C[y+1]=k[1],C[y+2]=k[2],C[y+3]=k[3],this.nv++}_idx(e){if(this.ni+e>this.icap){this.icap*=2;const i=new Uint32Array(this.icap);i.set(this.I),this.I=i}}tri(e,i,t){this._idx(3);const x=this.I,b=this.ni;x[b]=e,x[b+1]=i,x[b+2]=t,this.ni=b+3}quad(e,i,t,x){this._idx(6);const b=this.I,d=this.ni;b[d]=e,b[d+1]=i,b[d+2]=t,b[d+3]=e,b[d+4]=t,b[d+5]=x,this.ni=d+6}get tris(){return this.ni/3}box(e,i,t,x,b,d,h,l=1,c=1,s=.82){const r=x/2,v=b/2,p=d/2,u=h.r,a=h.g,f=h.b,m=u*s,g=a*s,A=f*s,w=v<0;for(let y=0;y<6;y++){const k=P0[y],M=k[4],q=k[5],K=k[6];let N=0;for(let C=0;C<4;C++){const H=k[C],R=H>3,G=R?l:1,S=R?c:1,F=R===w,j=this.vert(e+M0[H]*r*G,i+(R?v:-v),t+C0[H]*p*S,M,q,K,F?m:u,F?g:a,F?A:f);C===0&&(N=j)}this.quad(N,N+1,N+2,N+3)}}cyl(e,i,t,x,b,d,h,l,c=!0,s=.85,r=null){const v=this.nv,p=r||l;for(let u=0;u<=h;u++){const a=u/h*Math.PI*2,f=Math.cos(a),m=Math.sin(a),g=(x-b)/(d||1);this.vert(e+f*x,i,t+m*x,f,g,m,l.r*s,l.g*s,l.b*s),this.vert(e+f*b,i+d,t+m*b,f,g,m,p.r,p.g,p.b)}for(let u=0;u<h;u++){const a=v+u*2;this.quad(a,a+1,a+3,a+2)}if(c&&b>1e-4){const u=this.vert(e,i+d,t,0,1,0,p.r,p.g,p.b),a=this.nv;for(let f=0;f<=h;f++){const m=f/h*Math.PI*2;this.vert(e+Math.cos(m)*b,i+d,t+Math.sin(m)*b,0,1,0,p.r,p.g,p.b)}for(let f=0;f<h;f++)this.tri(u,a+f+1,a+f)}}blob(e,i,t,x,b,d,h,l=5,c=3,s=!1,r=null){const v=this.nv,p=r||h;for(let u=0;u<=c;u++){const a=s?u/c*Math.PI*.5:u/c*Math.PI-Math.PI/2,f=Math.cos(a),m=Math.sin(a),g=s?u/c:m*.5+.5,A=.72+.28*g;for(let w=0;w<=l;w++){const y=w/l*Math.PI*2+u*.3,k=Math.cos(y)*f,M=Math.sin(y)*f;this.vert(e+k*x,i+m*b,t+M*d,k/x,m/b,M/d,(h.r+(p.r-h.r)*g)*A,(h.g+(p.g-h.g)*g)*A,(h.b+(p.b-h.b)*g)*A)}}for(let u=0;u<c;u++)for(let a=0;a<l;a++){const f=v+u*(l+1)+a,m=f+l+1;this.quad(f,m,m+1,f+1)}}tube(e,i,t,x){const b=this.nv,d=e.length,h=new z.Vector3,l=new z.Vector3,c=new z.Vector3;for(let s=0;s<d;s++){const r=e[Math.max(0,s-1)],v=e[Math.min(d-1,s+1)];h.set(v[0]-r[0],v[1]-r[1],v[2]-r[2]).normalize(),l.set(0,1,0),Math.abs(h.y)>.9&&l.set(1,0,0),c.crossVectors(h,l).normalize(),l.crossVectors(c,h);for(let p=0;p<t;p++){const u=p/t*Math.PI*2,a=Math.cos(u),f=Math.sin(u),m=l.x*a+c.x*f,g=l.y*a+c.y*f,A=l.z*a+c.z*f;this.vert(e[s][0]+m*i,e[s][1]+g*i,e[s][2]+A*i,m,g,A,x.r,x.g,x.b)}}for(let s=0;s<d-1;s++)for(let r=0;r<t;r++){const v=b+s*t+r,p=b+s*t+(r+1)%t;this.quad(v,p,p+t,v+t)}}build(){const e=new z.BufferGeometry,i=this.nv;return e.setAttribute("position",new z.BufferAttribute(this.P.slice(0,i*3),3)),e.setAttribute("normal",new z.BufferAttribute(this.N.slice(0,i*3),3)),e.setAttribute("color",new z.BufferAttribute(this.C.slice(0,i*3),3)),e.setAttribute("aLane",new z.BufferAttribute(this.L.slice(0,i*3),3)),e.setAttribute("aAnim",new z.BufferAttribute(this.A.slice(0,i*4),4)),e.setIndex(i>65535?new z.BufferAttribute(this.I.slice(0,this.ni),1):new z.BufferAttribute(new Uint16Array(this.I.subarray(0,this.ni)),1)),e.computeBoundingSphere(),e.boundingSphere.radius+=3,e}}const i0=`#include <common>
#include <fog_pars_vertex>
`,l0=`#include <common>
#include <fog_pars_fragment>
`;function r0(n,e,i,t={}){return new z.ShaderMaterial({uniforms:{...z.UniformsUtils.clone(z.UniformsLib.fog),...n,...t.uniforms||{}},vertexShader:e,fragmentShader:i,fog:!0,vertexColors:!!t.vertexColors,side:t.side??z.FrontSide,transparent:!!t.transparent,depthWrite:t.depthWrite??!0,blending:t.blending??z.NormalBlending})}function c0(n,e){const i=i0+a0+`
attribute vec3 aLane; attribute vec4 aAnim; uniform vec3 uShift; uniform float uLocalTex;
varying vec3 vP, vN, vC, vL, vT;
void main(){
  vec3 p = position; vec3 n = normal;
  float d = aAnim.x - uCamS;
  if (aAnim.y > 0.5 && aAnim.y < 1.5) {
    float k = (1.0 - smoothstep(uLead + 5.0, uLead + 11.0, d + aAnim.w)) * smoothstep(-15.0, -9.0, d + aAnim.w);
    p.x += aAnim.z * k; p.y += 0.03 * sin(k * 3.14159) ;
  } else if (aAnim.y > 1.5 && aAnim.y < 2.5) {
    float A = d < 0.0 ? exp(d * 0.09) : (1.0 - smoothstep(0.0, 7.0, d)) ;
    float g2 = (aAnim.y - 2.0) * 10.0;   // kind 2.1 and so on: a wider pendulum sway of its own (the hall's lanterns)
    float an = 0.42 * A * sin(-d * 1.25 + aAnim.w) + 0.035 * (1.0 + g2) * sin(uTime * 1.9 + aAnim.w * 7.0) + 0.03 * g2 * sin(uTime * 3.3 + aAnim.w * 3.0);
    float amb = step(aAnim.x, 0.0);   // out at the lane mouth (anchor before the first awning) they hang in the open wind all the time
    an += amb * 0.07 * sin(uTime * 1.3 + aAnim.w * 3.0);
    float pz = uLen * 0.5 - aAnim.x; float c = cos(an), s = sin(an);
    vec2 q = vec2(p.z - pz, p.y - aAnim.z);
    p.z = pz + q.x * c - q.y * s; p.y = aAnim.z + q.x * s + q.y * c;
    n.yz = vec2(n.y * c + n.z * s, n.z * c - n.y * s);
    p.x += amb * max(aAnim.z - p.y, 0.0) * (0.15 * sin(uTime * 1.4 + aAnim.w * 3.0 + p.y * 1.5) + 0.06 * sin(uTime * 3.1 + aAnim.w * 11.0));
  } else if (aAnim.y > 2.5 && aAnim.y < 3.5) {
    float dist = length(uCamL - (p + uShift));
    p += n * max(dist * 0.0011 - aAnim.z, 0.0);
  } else if (aAnim.y > 3.5 && aAnim.y < 4.5) {   // cloth hanging below y = aAnim.z (laundry, bunting, lanterns)
    float w = max(aAnim.z - p.y, 0.0), A = d < 0.0 ? exp(d * 0.12) : (1.0 - smoothstep(0.0, 7.0, d));
    p.z += (sin(uTime * 2.6 + aAnim.w + p.x * 2.0) * 0.32 + 0.10 * sin(uTime * 5.3 + aAnim.w * 3.0) + A * 0.5 * sin(-d * 1.1 + aAnim.w)) * w;
    p.x += cos(uTime * 2.1 + aAnim.w) * 0.07 * w;
  } else if (aAnim.y > 4.5 && aAnim.y < 5.5) {   // flag flying along x from a pole at lane x = aAnim.z
    float w = abs(p.x - aLane.x - aAnim.z);
    p.z += sin(uTime * 5.0 + aAnim.w - w * 4.0) * 0.27 * w; p.y += sin(uTime * 3.7 + aAnim.w - w * 3.0) * 0.09 * w - 0.07 * w * w;
  } else if (aAnim.y > 6.5 && aAnim.y < 7.5) {   // a sparrow on a front tray: a hop or two on the spot, then off to the back of the stall as the nose comes (param = side)
    float k = 1.0 - smoothstep(6.0, 11.0, d), hp = max(sin(uTime * 7.0 + aAnim.w * 9.0), 0.0) * step(0.55, sin(uTime * 0.8 + aAnim.w * 5.0));
    p.y += 0.04 * hp * hp * (1.0 - k) + 0.5 * sin(k * 3.14159) + 0.25 * k; p.x += aAnim.z * 0.92 * k; p.z -= 0.45 * k;
  } else if (aAnim.y > 7.5 && aAnim.y < 8.5) {   // a pigeon feeding on the rails (param = the ground under it): it pecks, and is up and away as the flock bursts
    float pk = max(sin(uTime * (2.3 + 0.9 * fract(aAnim.w * 3.1)) + aAnim.w * 7.0), 0.0); pk *= pk; pk *= pk;
    float hd = smoothstep(0.10, 0.17, p.y - aAnim.z); p.y -= pk * 0.085 * hd;
    float k = 1.0 - smoothstep(14.0, 16.5, d); p.y += 0.9 * k * k - 60.0 * step(0.985, k);
  } else if (aAnim.y > 8.5 && aAnim.y < 9.5) {   // a sleeping cat's ear: now and then it flicks
    float fk = smoothstep(0.93, 1.0, sin(uTime * 1.1 + aAnim.w)) * sin(uTime * 31.0);
    p.x += 0.022 * fk * aAnim.z; p.y -= 0.008 * abs(fk);
  } else if (aAnim.y > 9.5 && aAnim.y < 10.5) {  // a drop of meltwater: it hangs on the bench's edge, lets go and falls (param = the drop to the ground)
    float ph = fract(uTime * (0.55 + 0.35 * fract(aAnim.w * 5.7)) + aAnim.w), f = max(ph - 0.35, 0.0) / 0.65;
    p.y -= f * f * aAnim.z;
  } else if (aAnim.y > 10.5 && aAnim.y < 11.5) { // a weed or a spray of morning glory between the sleepers (param = its root height): it stirs, and lies flat as the nose comes over
    float hgt = max(p.y - aAnim.z, 0.0), k = (1.0 - smoothstep(4.0, 8.5, d)) * (0.15 + 0.85 * smoothstep(-70.0, -25.0, d));
    p.x += hgt * 0.22 * sin(uTime * 2.1 + aAnim.w + p.z * 0.7) * (1.0 - k); p.z -= hgt * 1.5 * k; p.y -= hgt * 0.86 * k;
  }
  // a bulb's flex (matte, aux -1): a thin cord near the eye, kept a pixel and a half wide far off
  if (aLane.z < -0.5 && aLane.y < 0.5) p += normalize(n + vec3(0.0, 1e-5, 0.0)) * max(length(uCamL - (p + uShift)) * 0.0011 - 0.0075, 0.0);
  vP = p + uShift; vN = n; vC = color; vL = aLane;
  vT = uLocalTex > 0.5 ? position : vP;   // texture space: a moving mesh keeps its grain and glints fixed to itself
  if (aAnim.y > 5.5 && aAnim.y < 6.5) vC *= 0.12 + 0.88 * (0.5 + 0.5 * sin(uTime * 4.4 + aAnim.w));   // kind 6: a lamp that winks (phase aAnim.w)
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,t=l0+a0+`
uniform float uLocalTex, uLaneOff;
varying vec3 vP, vN, vC, vL, vT;
void main(){
  vec3 N = normalize(vN + vec3(0.0, 1e-4, 0.0)); if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(uCamL - vP + vec3(0.0, 1e-4, 0.0));
  float m = vL.y; vec3 alb = vC; vec3 col;
  float off = uLocalTex > 0.5 ? uLaneOff : vL.x;   // moving meshes (cab, boat, tuk-tuks) are told the lane offset where they are
  float vis; vec3 tint; fmSun(vP, off, vis, tint);
  vec3 H = normalize(uSun + V); float ndh = max(dot(N, H), 0.0);
  if (m > 0.5 && m < 1.5) {
    col = alb * vL.z * (0.94 + 0.06 * sin(uTime * 4.1 + vT.z * 0.9 + vT.x * 0.7) * sin(uTime * 2.7 + vT.z * 1.3));   // bulbs and paper lanterns waver a little
  } else if (m > 3.5 && m < 4.5) {
    // cellular heap of fruit: every cell a little lit sphere
    vec2 uv = (vP.xz + vP.y * vec2(0.7, 0.45)) * vL.z; vec2 ic = floor(uv), fc = fract(uv);
    float best = 9.0; vec2 bo = vec2(0.0); float bh = 0.0;
    for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j)); float h = fmH2(ic + g);
      vec2 o = g + vec2(h, fract(h * 17.3)) * 0.8 + 0.1 - fc; float dd = dot(o, o);
      if (dd < best) { best = dd; bo = o; bh = h; }
    }
    float r = clamp(1.0 - best * 2.2, 0.0, 1.0);
    alb *= (0.55 + 0.6 * fract(bh * 7.7)) * (0.25 + 0.85 * sqrt(r));
    alb = mix(alb, alb.grb * vec3(0.8, 1.0, 0.6), step(0.86, bh) * 0.8);
    vec3 n2 = normalize(N + vec3(-bo.x, 0.0, -bo.y) * 1.3);
    col = fmShade(alb, n2, vP, off);
    float sp = max(dot(n2, H), 0.0); sp *= sp; sp *= sp; sp *= sp; sp *= sp;
    col += uSunCol * sp * sp * 0.5 * vis;
  } else {
    if (m > 4.5 && m < 5.5) {
      // rain streaks run straight down the wall, strongest in the metre and a half under each floor line; a faint cloudiness besides
      float alw = vP.z * abs(N.x) + vP.x * abs(N.z), flr = fract((vP.y - 4.6) / 3.2 + 1.0);
      float st = mix(1.0, fmN2(vec2(alw * 1.4, vP.y * 0.12)), 0.45 + 0.55 * smoothstep(0.5, 1.0, flr));
      float bl = fmN2(vec2(alw, vP.y) * 0.9);
      float peel = smoothstep(0.74, 0.8, fmN2(vP.zy * 1.7 + vP.x + 13.0) + 0.25 * fmN2(vP.zy * 7.0));
      alb = mix(alb, vec3(0.42, 0.40, 0.36), peel * 0.5);
      alb *= 0.86 * (0.82 + 0.16 * st) * (0.9 + 0.14 * bl);
      alb *= 0.6 + 0.4 * smoothstep(0.0, 1.1, vP.y);
    } else {
      if (m > 6.5 && m < 7.5) alb = vL.z > 1.5 ? vec3(0.30, 0.06, 0.04) : vec3(0.06, 0.08, 0.10);   // glass: the colour channels carry (pane u, v, window hash)
      alb *= 0.86 + 0.28 * fmN2(vT.xz * 9.0 + vT.y * 9.0);
      if (m > 5.5 && m < 6.5) alb *= 1.0 - 0.6 * step(0.3, fract((vP.x + vP.z) * 10.0)) * step(0.32, fract(vP.y * 9.0)) * (1.0 - abs(N.y));
      if (m > 7.5 && m < 8.5) { float sf = fract(vP.y * 11.0);
        alb *= 0.5 + 0.5 * smoothstep(0.0, 0.12, sf) * (1.0 - 0.35 * smoothstep(0.5, 1.0, sf));
        float al = vP.z * abs(N.x) + vP.x * abs(N.z), bh = fmH1(floor(al / 3.0) * 3.7 + 1.3), band = step(1.72, vP.y) * step(vP.y, 2.38) * step(abs(N.y), 0.5) * step(0.25, bh);
        vec3 ink = bh < 0.5 ? vec3(0.50, 0.07, 0.05) : (bh < 0.75 ? vec3(0.08, 0.20, 0.42) : vec3(0.62, 0.50, 0.08));
        float edge = step(0.06, abs(vP.y - 2.05) - 0.24), let = step(0.42, fmH2(floor(vec2(al * 4.5, vP.y * 5.0)))) * step(abs(vP.y - 2.05), 0.2) * step(0.2, fract(al * 4.5));
        alb = mix(alb, mix(mix(vec3(0.60, 0.57, 0.46), ink, let), ink, 1.0 - edge) * (0.75 + 0.25 * smoothstep(0.0, 0.12, sf)), band * 0.85);
        N = normalize(N + vec3(0.0, (sf - 0.45) * 1.1, 0.0)); }
    }
    col = fmShade(alb, N, vP, off);
    { float sq = uLen * 0.5 - vP.z, xq = abs(vP.x - off);   // by day the square's shopfronts stand in the shade of their own awnings
      col *= 1.0 - 0.42 * step(uYard.x, sq) * step(sq, uYard.y) * step(uYard.z - 1.2, xq) * step(xq, uYard.z + 1.0) * (1.0 - smoothstep(2.5, 3.0, vP.y)) * smoothstep(0.5, 1.4, uSunCol.g); }
    if (m > 6.5 && m < 7.5) {
      float fr = 1.0 - abs(dot(N, V)); fr *= fr;
      vec2 wf = fract(vC.rg); float wid = floor(vC.r) * 7.3 + floor(vC.b * 1024.0 + 0.5) / 1024.0 * 37.0, h1 = fmH1(wid + 1.0), h2 = fmH1(wid + 5.0);
      float bar = smoothstep(0.035, 0.06, abs(wf.x - 0.5)) * smoothstep(0.02, 0.04, abs(wf.y - 0.62));       // mullion cross and frame
      bar *= smoothstep(0.03, 0.07, min(wf.x, 1.0 - wf.x)) * smoothstep(0.02, 0.05, min(wf.y, 1.0 - wf.y));
      vec3 cur = h1 < 0.5 ? vec3(1.0, 0.74, 0.42) : (h1 < 0.72 ? vec3(1.0, 0.56, 0.34) : (h1 < 0.9 ? vec3(0.78, 0.86, 0.5) : vec3(0.55, 0.75, 1.0)));   // curtain tint
      float drape = 0.45 + 0.55 * smoothstep(0.0, 0.05, abs(wf.x - (0.25 + 0.5 * h2)) - 0.1 - 0.16 * h1);    // a curtain drawn part of the way
      drape *= 0.62 + 0.38 * smoothstep(0.0, 0.5, wf.y) * (0.8 + 0.2 * sin(wf.x * 40.0 + h2 * 9.0));
      float litw = step(0.5, vL.z) * step(0.22 - uLamp.r * 0.4, fmH1(wid + 9.0));
      float tv = step(0.8, h2) * step(vL.z, 1.5);   // one lit room in five has a television on: a cool glow that wanders slowly
      cur = mix(cur, vec3(0.45, 0.68, 1.0) * (0.6 + 0.4 * sin(uTime * 2.1 + h1 * 40.0) * sin(uTime * 0.83 + h2 * 20.0)), tv * 0.85);
      vec3 frame = col * (vL.z > 1.5 ? vec3(2.2, 6.0, 3.0) : vec3(5.0, 3.5, 2.4));
      col = col * 0.6 + uSkyCol * (0.25 + 0.9 * fr) + uLamp * (vL.z > 1.5 ? vec3(2.4, 1.2, 0.5) : vec3(2.0, 1.45, 0.8) * cur) * litw * drape;
      col = mix(frame, col, bar);
    }
    if (m > 1.5 && m < 2.5) {
      float s2 = ndh * ndh; s2 *= s2; s2 *= s2; s2 *= s2; s2 *= s2;
      vec3 cq = floor(vT * 38.0);
      float fl = sin(fmH1(cq.x + cq.y * 57.0 + cq.z * 113.0) * 40.0 + dot(V, vec3(13.0, 7.0, 11.0)) * 5.0 + uTime * 0.7);
      fl = max(fl, 0.0); fl *= fl; fl *= fl; fl *= fl; fl *= fl; fl *= fl;
      col += uSunCol * (s2 * 1.2 + fl * mix(0.4, 1.3, vis) * vL.z * smoothstep(0.2, 0.9, vL.z)) * (0.03 + 0.97 * vis) + uSkyCol * 0.25 * (1.0 - abs(dot(N, V))) ;
      col += alb * (uSkyCol * 0.7 + uShade * 0.12 + tint * uSunCol * 0.12) * step(0.9, vL.z);   // crushed ice keeps a pale body in the shade
    } else if (m > 8.5) {
      float s9 = ndh * ndh; s9 *= s9; s9 *= s9;
      float nl9 = max(dot(N, uSun), 0.0);
      col = col * 0.55 + alb * uSunCol * (s9 * 0.9 + nl9 * nl9 * 0.35) * vis + alb * uLamp * (2.2 + 1.6 * (1.0 - N.y * N.y));
    } else if (m > 2.5 && m < 3.5) {
      float s3 = ndh * ndh; s3 *= s3; s3 *= s3; s3 *= s3;
      col = col * 0.55 + alb * uSunCol * s3 * 2.2 * (0.1 + 0.9 * vis) + alb * uSkyCol * 0.5 * (1.0 - abs(dot(N, V)));
    }
  }
  gl_FragColor = vec4(max(col, vec3(0.0)), 1.0);
  #include <fog_fragment>
}`;return r0(n,i,t,{vertexColors:!0,side:z.DoubleSide,uniforms:{uShift:{value:e||new z.Vector3},uLocalTex:{value:e?1:0},uLaneOff:{value:0}}})}function A0(n,e,i){const t=[],x=[],b=[];let d=0;const h=1.45,l=4;for(let a=0;a<=e;a++)for(let f=0;f<=n;f++)t.push(-h+2*h*f/n,0,l*a/e),x.push(0,0,0),d++;for(let a=0;a<e;a++)for(let f=0;f<n;f++){const m=a*(n+1)+f,g=m+n+1;b.push(m,g,g+1,m,g+1,m+1)}const c=n*2,s=d;for(let a=0;a<=c;a++){const f=-h+2*h*a/c;t.push(f,0,l),x.push(2,0,0),t.push(f,0,l),x.push(2,a%2?.34:.2,0),d+=2}for(let a=0;a<c;a++){const f=s+a*2;b.push(f,f+1,f+3,f,f+3,f+2)}const r=8,v=d;for(let a=0;a<=r;a++){const f=l*a/r,m=Math.min(1,a/2)*(a%2?.34:.27);t.push(-h,0,f),x.push(3,0,0),t.push(-h,0,f),x.push(3,m,0),d+=2}for(let a=0;a<r;a++){const f=v+a*2;b.push(f,f+1,f+3,f,f+3,f+2)}const p=(a,f,m,g,A)=>{const w=d,y=1;for(let k=0;k<=y;k++)for(let M=0;M<4;M++){const q=M/4*Math.PI*2+.785,K=k/y;A?t.push(-h+2*h*K,Math.sin(q)*g-g,f+Math.cos(q)*g):t.push(a+Math.cos(q)*g,Math.sin(q)*g-g,f+(m-f)*K),x.push(1,0,Math.sin(q)),d++}for(let k=0;k<y;k++)for(let M=0;M<4;M++){const q=w+k*4+M,K=w+k*4+(M+1)%4;b.push(q,K,K+4,q,K+4,q+4)}};p(-h+.05,-.15,l+.12,.03,!1),p(h-.05,-.15,l+.12,.03,!1),i||p(0,l-.03,0,.022,!0);for(const a of[-h+.06,h-.06]){const f=d;for(const m of[0,1])for(const g of[-1,1])t.push(a,0,l),x.push(4,m,g),d++;b.push(f,f+1,f+3,f,f+3,f+2)}const u=new z.InstancedBufferGeometry;return u.setAttribute("position",new z.Float32BufferAttribute(t,3)),u.setAttribute("aK",new z.Float32BufferAttribute(x,3)),u.setIndex(b),u}function z0(n){const e=i0+a0+`
attribute vec3 aK; attribute vec4 iA; attribute float iL;   // iL: how far this row's hinge is lifted (the rows that step down the trestle's ramp with the rails)
varying vec3 vP, vN, vN0; varying vec4 vUV; varying vec3 vI; varying float vSh, vO; varying vec3 vBase; varying vec4 vH;
float gD;   // this awning's distance ahead of the cab
vec3 awn(float u, float n, float v, float o, float ang, float cl){
  float sC = iA.x, side = iA.y, hsh = iA.w;
  float w = clamp(u / 1.45, -1.0, 1.0), mid = 1.0 - w * w, al = sin(3.14159 * clamp(v * 0.25, 0.0, 1.0));
  float mv = 4.0 * o * (1.0 - o);
  float v4 = clamp(v * 0.25, 0.0, 1.0), e2 = v4 * v4;
  float sag = -(0.30 + 0.14 * hsh) * mid * (0.3 + 0.7 * al) * (0.6 + 0.4 * hsh) * (1.0 - 0.6 * o) - uWet * 0.10 * mid * al * (1.0 - o);   // shut, the cloth hangs in a deep belly between its poles
  sag -= 0.15 * e2 * e2 * abs(sin(u * 3.25 + 1.57));                 // the free edge hangs in scallops between its ties
  float hq = 1.0 - 0.55 * step(uHold.x, sC) * step(sC, uHold.y);   // the rows that stand raised all the time hang smoother: taut cloth, not crumpled paper
  sag -= 0.45 * o * mid * e2 * hq;                                   // raised, the cloth bellies like a sail between its two poles
  sag += 0.12 * hq * o * sin(uTime * 3.77 + hsh * 40.0 + sC * 0.37) * mid * (0.25 + 0.75 * v4);   // and breathes slowly, each cell in its own time, so far rows are seen to move
  sag += 0.08 * o * exp(-max(uLead - gD, 0.0) / 9.0) * sin(uTime * 37.7 - v * 4.0 + u * 2.0 + hsh * 9.0) * mid * (0.3 + 0.7 * v4);   // a ripple runs down it after the snap and dies away
  sag += 0.022 * sin(u * 6.3 + hsh * 20.0) * (0.4 + 0.6 * al);       // soft folds running from hinge to edge
  float mouth = (1.0 - smoothstep(3.0, 20.0, sC)) * (1.0 - o);   // the first rows stand in the open wind off the crossing: shut, they luff harder
  sag += 0.09 * (1.0 + 0.9 * mouth) * sin(uTime * (1.3 + 0.8 * hsh) + hsh * 40.0) * mid * al * (1.0 - o);   // shut cloth breathes slowly
  float wind = 0.9 + 1.4 * o + 1.5 * mouth;
  float bil = (sin(uTime * (2.0 + hsh) - v * 1.7 + u * 0.8 + hsh * 40.0) * 0.06 * (0.3 + 0.7 * v4) + sin(uTime * 3.3 - v * 3.1 - u * 2.3 + hsh * 17.0) * 0.02) * wind;
  float shv = sin(uTime * 21.0 + v * 6.0 + u * 4.0 + hsh * 9.0) * 0.07 * mv;
  float nn = n + (sag + (bil + shv) * mid * (0.35 + al)) * cl;
  float r = v * cos(ang) - nn * sin(ang), h = v * sin(ang) + nn * cos(ang);
  return vec3(iA.z + side * (3.5 - r), 3.7 + iL + side * 0.08 + (hsh - 0.5) * 0.1 + h, uLen * 0.5 - (sC + u));
}
void main(){
  float side = iA.y, cell = floor(iA.x / 3.0);
  float d = fmCellD(cell, side), o = fmOpenD(d), ang = fmAngle(o); gD = d;
  float clearK = fmClearK(d);
  float xb = -14.0 - d; ang += -0.10 * sin(xb * 1.7) * exp(-max(xb, 0.0) * 0.4) * step(0.0, xb);
  ang += uGust.y * 0.13 * sin(uTime * 7.0 - iA.x * 0.5) * smoothstep(uLead + 8.0, uLead + 14.0, d) * (1.0 - smoothstep(uGust.x - 16.0, uGust.x, iA.x));
  ang += 0.035 * o * sin(uTime * 3.1 + iA.w * 40.0 + iA.x * 0.21);   // raised panels rock a little on their hinges
  ang = mix(ang, max(ang, uClear.x), clearK);   // the clearance rule (fmClearK): near the cab a panel that would hang too low over the line swings further up
  vSh = 0.0;
  float cl = aK.x > 0.5 && aK.x < 1.5 ? 0.0 : 1.0;
  vec3 p = awn(position.x, position.y, position.z, o, ang, cl);
  vec3 up = vec3(side * sin(ang), cos(ang), 0.0);
  vec3 n = up;
  if (aK.x < 0.5) {
    vec3 pu = awn(position.x + 0.12, position.y, position.z, o, ang, cl), pv = awn(position.x, position.y, position.z + 0.12, o, ang, cl);
    vec3 c = cross(pu - p, pv - p); n = normalize(c + up * 1e-5); if (dot(n, up) < 0.0) n = -n;
  } else if (aK.x > 3.5) {   // a pull-cord: taut from the cloth's corner to its ring on the house wall, widened with distance
    vec3 ring = vec3(iA.z + side * 5.02, 6.35 + iL + (iA.w - 0.5) * 0.5, p.z + position.x * 0.12);
    vec3 rd = ring - p; rd.z = 0.0; rd = normalize(rd + vec3(1e-4, 0.0, 0.0));
    p = mix(p, ring, aK.y); p += vec3(rd.y, -rd.x, 0.0) * aK.z * max(0.017, length(uCamL - p) * 0.0019);
    n = vec3(0.0, 1.0, 0.0); up = n;
  } else if (aK.x > 2.5) {
    float fl = sin(uTime * 3.1 + position.z * 3.0 + iA.w * 30.0);
    float drop = aK.y * (0.3 + uAwn.w * (1.0 - o));
    p.y -= drop; p.z += fl * 0.16 * drop + 0.25 * drop * sin(3.14159 * o); n = normalize(vec3(0.0, 0.3, 1.0));
    up = n;
  } else if (aK.x > 1.5) {
    float fl = sin(uTime * 4.3 + position.x * 5.0 + iA.w * 30.0);
    vSh = uWet * smoothstep(0.12, 0.3, o) * (1.0 - smoothstep(0.7, 0.9, o));   // sun-shower: water tips off the folding cloth in a bright sheet
    p.y -= aK.y * (1.6 + uAwn.z * (1.0 - o) + vSh * 8.0); p.x += fl * 0.12 * aK.y * (0.5 + o + 1.5 * (1.0 - o)); n = normalize(vec3(-side * 0.85, 0.5, 0.1 * fl));
    up = n;
  } else { n = normalize(up * (aK.z + 0.25) + vec3(0.0, 0.0, 0.3)); }
  vP = p; vN = n; vN0 = up; vO = o; vUV = vec4(position.x, position.z, aK.x, aK.y); vI = vec3(cell, side, iA.w);
  // the cloth colour and its two pattern hashes are worked out here, where cell, side and the instance hash are exact:
  // hashed per pixel from interpolated values they flipped colour pixel by pixel on some awnings
  float ccq = (cell + 0.5) * 3.0;
  vBase = fmClothCol(cell, side); vH = vec4(fmH1(iA.w * 91.0 + 3.0), fmH1(iA.w * 37.0 + 5.0), step(uFlower.x, ccq) * step(ccq, uFlower.y), step(uBlue.x, ccq) * step(ccq, uBlue.y));
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,i=l0+a0+`
varying vec3 vP, vN, vN0; varying vec4 vUV; varying vec3 vI; varying float vSh, vO; varying vec3 vBase; varying vec4 vH;
void main(){
  float u = vUV.x, v = vUV.y, kind = vUV.z, hsh = vI.z;
  vec3 N = normalize(vN + vec3(0.0, 1e-4, 0.0)), V = normalize(uCamL - vP + vec3(0.0, 1e-4, 0.0));
  vec3 col;
  if (kind > 3.5) {
    col = vec3(0.44, 0.37, 0.24) * (uSunCol * 0.3 + uSkyCol * 0.6 + uLamp * 1.0);
  } else if (kind > 0.5 && kind < 1.5) {
    vec3 alb = vec3(0.50, 0.40, 0.19) * (0.75 + 0.25 * step(0.08, fract(v * 2.3 + hsh)));
    col = alb * (uSunCol * (0.25 + 0.6 * max(dot(N, uSun), 0.0)) + uSkyCol * 0.4 + uLamp * 0.7);
  } else {
    vec3 base = vBase;
    float h2 = vH.x, h3 = vH.y, runK = max(vH.z, vH.w);
    // every panel is striped, each in its own way: broad even stripes, pin stripes, or wide bands with a fine line beside them. The second colour is
    // cream on a coloured cloth and one of the roof's colours on a pale one (in the last straight the brief's four cloths, after the bridge blue on white)
    float pale = smoothstep(0.42, 0.52, dot(base, vec3(0.3, 0.6, 0.1)));
    vec3 dk = h3 < 0.5 ? uPal[3] : uPal[1]; dk = mix(dk, vec3(0.158, 0.328, 0.552), smoothstep(0.42, 0.52, dot(dk, vec3(0.3, 0.6, 0.1))));
    dk = mix(dk, h3 < 0.4 ? vec3(0.158, 0.328, 0.552) : (h3 < 0.7 ? vec3(0.397, 0.456, 0.102) : vec3(0.905, 0.539, 0.011)), vH.z); dk = mix(dk, vec3(0.115, 0.27, 0.56), vH.w);
    vec3 sCol = mix(vec3(0.80, 0.78, 0.70), dk, pale);
    float us = kind > 2.5 ? v * 0.9 - 1.8 : u, pat = mix(h2, 0.2, vH.w);
    float stA = smoothstep(0.22, 0.27, abs(fract(us * mix(1.6, 1.25, vH.w) + 0.25) - 0.5));
    float stB = 1.0 - smoothstep(0.07, 0.11, abs(fract(us * 2.2 + h3) - 0.5));
    float fc = abs(fract(us * 0.86 + 0.5 * h3) - 0.5), stC = max(smoothstep(0.27, 0.31, fc), (1.0 - smoothstep(0.012, 0.03, abs(fc - 0.19))) * 0.9);
    float stripe = pat < 0.4 ? stA : (pat < 0.72 ? stB : stC);
    base = mix(base, sCol, stripe * 0.92);
    // a pale cloth set carries one broad band of its saturated colour across every panel, so that its folds read as cloth
    if (kind < 0.5) base = mix(base, uPal[3], uBandK * (1.0 - smoothstep(0.23, 0.26, abs(v - 2.75 - 0.5 * h3))) * (1.0 - runK));
    // the hem: a band of the second colour along the free edge with a pale piping, and the scalloped valance under it in alternate teeth of the two colours
    vec3 hemC = mix(sCol, vBase, 0.12) * 0.9;
    if (kind < 0.5) { base = mix(base, hemC, smoothstep(3.50, 3.55, v)); base = mix(base, vec3(0.82, 0.80, 0.72), (1.0 - smoothstep(0.0, 0.03, abs(v - 3.5))) * 0.8); }
    if (kind > 1.5 && kind < 2.5) base = mix(hemC, vBase, step(0.5, fract(u * 2.07 + 0.25)));
    // the skirt that faces the oncoming train carries a broad border in the second colour along its scallops, so a shut row reads as dressed cloth
    if (kind > 2.5) base = mix(base, hemC, smoothstep(0.17, 0.185, vUV.w) * 0.92);
    vec2 pc = vec2((h2 - 0.5) * 1.8, 1.0 + h3 * 2.2), ps = vec2(0.25 + h3 * 0.35, 0.3 + h2 * 0.4);
    vec2 pd = abs(vec2(u, v) - pc) - ps; float inP = step(max(pd.x, pd.y), 0.0) * step(0.35, h3);
    float edge = inP * step(-0.035, max(pd.x, pd.y));
    base = mix(base, mix(mix(uPal[3], uPal[1], step(0.6, h2)), mix(vBase, sCol, 0.5), runK) * 0.85, inP); base *= 1.0 - 0.3 * edge;
    base = mix(base, vec3(0.78, 0.74, 0.62), inP * step(-0.06, max(pd.x, pd.y)) * (1.0 - step(-0.045, max(pd.x, pd.y))) * step(0.45, fract((u + v) * 14.0)));   // the patch's stitches
    float seam = 1.0 - 0.3 * (1.0 - smoothstep(0.0, 0.025, abs(fract(u + 0.5) - 0.5)));
    float dirt = fmN2(vec2(u * 1.3 + hsh * 10.0, v * 0.7)), dist = length(uCamL - vP);
    float weave = 1.0 + 0.10 * sin(u * 150.0) * sin(v * 150.0) * clamp(1.0 - dist / 7.0, 0.0, 1.0) + 0.05 * (fmN2(vec2(u, v) * 23.0) - 0.5);
    float fold = 0.93 + 0.07 * sin(u * 6.3 + hsh * 20.0 + 0.5 * sin(v * 1.4 + hsh * 9.0)) + 0.03 * sin(u * 14.0 + v * 0.8 + hsh * 31.0);
    vec3 alb = base * 0.62 * seam * (0.74 + 0.28 * dirt) * weave * fold;
    alb = mix(alb, alb * 1.12 + 0.03, v * 0.2);
    alb *= 0.75 + 0.25 * smoothstep(0.0, 0.5, v);
    float hem = 1.0 - smoothstep(1.36, 1.45, abs(u));
    alb *= 0.7 + 0.3 * max(hem, step(2.5, kind));
    if (kind > 1.5) alb *= 1.0 - 0.45 * smoothstep(0.0, 0.3, vUV.w) * (1.0 - 0.75 * step(2.5, kind));   // skirts darken toward their scallops
    // which face is seen is decided by the panel as a whole, not by its ripples, so the lit and back-lit sides never mix in bands
    vec3 N0 = normalize(vN0 + vec3(0.0, 1e-4, 0.0)); float sd = dot(N0, V) >= 0.0 ? 1.0 : -1.0;
    float l = dot(N, uSun) * sd;
    vec3 thru = pow(max(base, vec3(0.0)) * 0.9 + 1e-4, vec3(1.45)) * seam * (0.7 + 0.3 * fold);   // back-lit cloth glows in its own colour
    float ribs = 1.0 - 0.24 * (1.0 - smoothstep(0.012, 0.045, min(abs(v - 1.34), abs(v - 2.67)))) * step(kind, 0.5);   // the bamboo battens under it show through as soft dark lines
    thru *= ribs; alb *= 0.5 + 0.5 * ribs;
    thru *= mix(1.0, 0.55, smoothstep(0.45, 0.75, dot(base, vec3(0.3, 0.6, 0.1))));   // pale cloth lets less through, so white sets never blow out
    // cloth is never a grey sheet: turned edge-on to a low sun, or seen on its sunny side at a grazing angle, it still glows through
    float back = smoothstep(0.0, 0.5, -l);
    float nightK = 1.0 - smoothstep(0.5, 1.4, uSunCol.g), topK = smoothstep(-0.2, 0.2, sd * N0.y);   // topK: the cloth's upper side is the one seen
    col = alb * uSunCol * (0.2 + 0.78 * max(l, 0.0)) * (1.0 - 0.5 * nightK * topK) + thru * uSunCol * (0.95 + 1.05 * (1.0 - vO)) * back * (0.75 + 0.4 * dirt) + alb * uSkyCol * 0.35;
    col += (alb * 0.6 + thru * 0.5) * uSunCol * ((0.5 + 0.2 * step(2.5, kind)) * (1.0 - max(l, 0.0)) * (1.0 - 0.7 * vO));   // light scattered in the weave: strongest on shut cloth that the sun only grazes
    col += pow(max(alb, vec3(0.0)) + 1e-4, vec3(1.2)) * uLamp * mix(0.5, 1.5, smoothstep(-0.2, 0.2, -sd * N0.y));
    col += thru * uLamp * 0.8 * topK * (1.0 - 0.6 * vO);   // seen from above by lamplight, shut cloth glows through in its own colour
    // the stall's bare bulb hangs under every cloth: a pool of its light on the underside, and the same pool glowing through the weave from above
    { vec2 bq = vec2(u - (h3 - 0.5) * 1.1, v - 1.55); float pool = exp(-dot(bq, bq) * 0.75) * step(kind, 0.5);
      col += (pow(max(alb, vec3(0.0)) + 1e-4, vec3(1.1)) * mix(0.25, 2.3, smoothstep(-0.2, 0.2, -sd * N0.y)) + thru * 1.5 * topK) * uLamp * pool; }
    col += (thru * uSunCol * 0.22 + alb * uLamp * 0.5) * smoothstep(3.0, 3.9, v) * step(kind, 0.5);   // the hem catches the light
    if (kind > 1.5 && vSh > 0.02) { float dr = fmH1(floor(u * 46.0) + floor(vI.x + 0.5) * 7.0), fall = fract(uTime * (1.6 + dr) + dr * 9.0 - vP.y * 1.3);
      float lit = step(0.22, dr) * smoothstep(0.0, 0.25, fall) * (1.0 - smoothstep(0.55, 1.0, fall));
      col = mix(col, uSunCol * 1.25 + uSkyCol * 1.5, clamp(vSh * 1.5, 0.0, 1.0) * lit * step(0.02, vUV.w)); if (vUV.w > 0.02 && lit < 0.2 && vSh > 0.3) discard; }
    else col = min(col, vec3(1.6));
  }
  gl_FragColor = vec4(max(col, vec3(0.0)), 1.0);
  #include <fog_fragment>
}`;return r0(n,e,i,{side:z.DoubleSide})}function L0(){const n=[],e=[],i=[];let t=0;const x=10,b=[.04,.55,1];for(let l=0;l<b.length;l++)for(let c=0;c<=x;c++){const s=c/x*Math.PI*2;n.push(Math.cos(s),b[l],Math.sin(s)),e.push(0,0,c%2),t++}for(let l=0;l<=x;l++){const c=l/x*Math.PI*2;n.push(Math.cos(c),1,Math.sin(c)),e.push(0,.16,l%2),t++}for(let l=0;l<3;l++)for(let c=0;c<x;c++){const s=l*(x+1)+c,r=s+x+1;i.push(s,r+1,r,s,s+1,r+1)}const d=t;for(let l=0;l<=1;l++)for(let c=0;c<4;c++){const s=c/4*Math.PI*2;n.push(Math.cos(s)*.028,l*2.12,Math.sin(s)*.028),e.push(1,0,0),t++}for(let l=0;l<4;l++){const c=d+l,s=d+(l+1)%4;i.push(c,c+4,s+4,c,s+4,s)}const h=new z.InstancedBufferGeometry;return h.setAttribute("position",new z.Float32BufferAttribute(n,3)),h.setAttribute("aK",new z.Float32BufferAttribute(e,3)),h.setIndex(i),h}function q0(n){const e=i0+a0+`
attribute vec3 aK; attribute vec4 iA; attribute vec3 iB;   // iB = (lateral x, base height, scale); side 0 = free-standing, always open
varying vec3 vP, vN, vD; varying vec3 vI; varying float vTr;
void main(){
  float side = iA.y, hsh = iA.w;
  float o = fmOpenD(fmCellD(floor(iA.x / 3.0), side) - 3.0) * abs(side);
  float e = o * o * (3.0 - 2.0 * o);
  vec3 q; vec3 n;
  if (aK.x < 0.5) {
    float t = position.y, R = (1.05 + 0.2 * hsh) * (1.0 - 0.4 * e) * (1.0 - 0.07 * aK.z * t);
    float droop = 0.26 + 0.85 * e;
    float flut = sin(uTime * 3.1 + hsh * 20.0 + position.x * 3.0) * 0.03 * t * (1.0 + 3.0 * e * (1.0 - e)) * (1.0 + 1.6 * (1.0 - abs(side))) + (1.0 - abs(side)) * 0.035 * t * sin(uTime * 1.7 + hsh * 31.0 + position.z * 2.0);
    q = vec3(position.x * t * R, 2.1 - t * t * droop - aK.y + flut, position.z * t * R);
    n = normalize(vec3(position.x * droop * 2.0, R, position.z * droop * 2.0));
  } else { q = position; n = normalize(vec3(position.x, 0.0, position.z) + vec3(1e-4)); }
  float th = 0.30 * e + 0.03 * sin(uTime * 1.3 + hsh * 9.0), c = cos(th), s = sin(th);
  vec3 p = vec3(q.x * c + side * q.y * s, q.y * c - side * q.x * s, q.z);
  n = vec3(n.x * c + side * n.y * s, n.y * c - side * n.x * s, n.z);
  p = p * iB.z + vec3(iA.z + iB.x, iB.y, uLen * 0.5 - iA.x);
  vP = p; vN = n; vD = vec3(position.x, position.z, aK.x); vI = vec3(hsh, aK.y, iA.z); vTr = position.y;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,i=l0+a0+`
uniform vec3 uRed; varying vec3 vP, vN, vD; varying vec3 vI; varying float vTr;
void main(){
  vec3 N = normalize(vN + vec3(0.0, 1e-4, 0.0)), V = normalize(uCamL - vP + vec3(0.0, 1e-4, 0.0));
  float off = vI.z; vec3 col;
  if (vD.z > 0.5) { col = fmShade(vec3(0.42, 0.42, 0.40), N, vP, off); }
  else {
    float ga = (atan(vD.y, vD.x + 1e-5) / 6.28318 + 0.5) * 10.0, g = floor(ga), gf = fract(ga);
    float skirt = vI.y / 0.16;                                  // 0 on the canopy, 1 at the hem of the skirt
    if (skirt > 0.5 + 0.5 * sin(gf * 3.14159)) discard;         // the hem hangs in a scallop under each gore
    float h = vI.x; vec3 a = h < 0.3 ? uRed : (h < 0.55 ? uPal[3] : (h < 0.8 ? uPal[0] : uPal[2]));
    vec3 alb = mix(a, vec3(0.80, 0.78, 0.70), step(0.5, fract(g * 0.5)) * step(0.25, fract(h * 7.0))) * 0.66;
    alb *= 0.8 + 0.25 * fmN2(vP.xz * 5.0 + h * 9.0);
    float rib = min(gf, 1.0 - gf);
    alb *= 0.62 + 0.38 * smoothstep(0.0, 0.14, rib);            // each gore darkens into its rib
    alb *= 0.9 + 0.16 * sin(gf * 3.14159);                      // and bellies between ribs
    alb *= 1.0 - 0.3 * (1.0 - smoothstep(0.0, 0.03, abs(vTr - 0.55))) - 0.35 * smoothstep(0.02, 0.25, skirt);   // a seam ring, a darker skirt
    alb = mix(alb, vec3(0.2, 0.19, 0.17), 1.0 - smoothstep(0.05, 0.09, vTr));   // the cap at the tip
    float vis; vec3 tint; fmSun(vP, off, vis, tint);
    float below = 1.0 - step(0.0, dot(N, V));
    col = fmShade(alb, mix(N, -N, below), vP, off);
    col += below * pow(alb, vec3(1.35)) * uSunCol * 0.5 * vis * max(dot(N, uSun), 0.0);
  }
  gl_FragColor = vec4(max(col, vec3(0.0)), 1.0);
  #include <fog_fragment>
}`;return r0(n,e,i,{side:z.DoubleSide,uniforms:{uRed:{value:n.uRed.value}}})}function N0(n){const e=i0+`
attribute float aOff; varying vec3 vP; varying float vOff;
void main(){ vP = position; vOff = aOff;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,i=l0+a0+`
varying vec3 vP; varying float vOff;
void main(){
  float s = uLen * 0.5 - vP.z, x = vP.x - vOff, ax = abs(x);
  vec2 w = vec2(x, s);
  float n1 = fmN2(w * 3.0), n2 = fmN2(w * 0.45 + 7.0), n3 = fmN2(w * 17.0);
  // ballast
  float cdist = length(uCamL - vP);
  vec3 bal = mix(vec3(0.13, 0.118, 0.10), vec3(0.34, 0.32, 0.275), fmStone(w, cdist)) * (0.7 + 0.5 * n1);
  bal = mix(bal, vec3(0.16, 0.27, 0.08), smoothstep(0.72, 0.85, fmN2(w * 2.6 + 3.0)) * 0.45 * step(0.0, s));
  float fsl = fract(s / 0.65);
  float sl = (1.0 - smoothstep(0.34, 0.38, fsl)) * smoothstep(0.0, 0.03, fsl) * (1.0 - smoothstep(0.92, 0.97, ax));
  vec3 wood = vec3(0.19, 0.14, 0.10) * (0.6 + 0.7 * fmN2(vec2(x * 3.0, s * 40.0))) ;
  vec3 col = mix(bal, wood, sl * (0.55 + 0.45 * smoothstep(0.3, 0.6, n2 + 0.2)));
  // concrete either side, ragged edge, slab joints, cracks, wet patches under the ice trays
  float edge = smoothstep(1.28, 1.42, ax + (n1 - 0.5) * 0.25);
  vec3 con = vec3(0.275, 0.262, 0.235) * (0.72 + 0.4 * n2) * (0.88 + 0.24 * n3);
  float joint = smoothstep(0.0, 0.03, abs(fract(s / 2.4) - 0.5) * 2.4 - 0.0) ;
  vec4 zg = fmGap(floor(s / 3.0) * 3.0 + 1.5); float openK = min(zg.z, zg.w);   // an open square: the same slabs as the ground around it
  con *= mix(0.65 + 0.35 * joint, 0.68 + 0.32 * smoothstep(0.0, 0.05, min(abs(fract(s / 3.0) - 0.5), abs(fract(x / 3.0) - 0.5)) * 3.0), openK);
  // the open square's paint and wear: old stains, a worn yellow line either side of the track
  float sqK = openK * step(uYard.x, s) * step(s, uYard.y);
  con *= 1.0 - 0.24 * sqK * smoothstep(0.45, 0.75, fmN2(w * 0.21 + 13.0));
  con = mix(con, vec3(0.50, 0.40, 0.10) * (0.6 + 0.4 * n3), sqK * (1.0 - smoothstep(0.06, 0.09, abs(ax - 2.2))) * (0.25 + 0.6 * n2));
  edge = max(edge, smoothstep(uBridge.x - 1.0, uBridge.x + 1.0, s) * (1.0 - smoothstep(uBridge.y - 1.0, uBridge.y + 1.0, s)));   // the rails are up on the trestle: no ballast under it
  float crack = smoothstep(0.0, 0.02, abs(fmN2(w * 0.55 + 20.0) - 0.5));
  con *= 1.0 - 0.2 * (1.0 - crack) * smoothstep(0.5, 0.7, fmN2(w * 0.3 + 60.0));
  float wet = smoothstep(0.55, 0.7, fmN2(w * vec2(0.9, 0.35) + 40.0)) * step(0.0, s) * step(s, uLen) * edge * (1.0 - openK);
  con *= 1.0 - 0.5 * wet;
  float yardK = smoothstep(uLen - 1.0, uLen + 3.0, s);
  float pud = uWet * smoothstep(0.62, 0.72, fmN2(w * vec2(0.8, 0.5) + 11.0)) * (1.0 - yardK);   // sun-shower: everything darker, puddles that mirror the sky (in the yard only its own puddles do)
  con *= 1.0 - 0.35 * uWet; col *= 1.0 - 0.3 * uWet;
  // the level crossing in front: planks by the rails, asphalt road beyond
  float road = 1.0 - smoothstep(-0.6, 0.0, s);
  con = mix(con, fmRoad(w, n1, n2, n3), road);
  float plank = road * (1.0 - smoothstep(1.55, 1.6, ax)) * step(0.09, abs(ax - 0.5));
  vec3 pl = vec3(0.17, 0.125, 0.08) * (0.6 + 0.6 * fmN2(vec2(x * 30.0, s * 1.5))) * (0.55 + 0.45 * smoothstep(0.0, 0.02, abs(fract(x * 4.0) - 0.5) - 0.0));
  // the station yard beyond the last awning: packed earth and gravel, grass creeping in, oil by the rails, a puddle or two
  vec3 earth = fmEarth(w, n1, n2, n3, cdist);
  earth *= 1.0 - 0.55 * smoothstep(0.6, 0.8, fmN2(w * vec2(1.7, 0.45) + 31.0)) * (1.0 - smoothstep(1.6, 3.2, ax));
  float pn = fmN2(w * 1.0 + 80.0), pudIn = yardK * smoothstep(1.5, 2.2, ax) * (1.0 - smoothstep(6.5, 8.5, ax));   // small puddles with a dark wet rim
  float pudY = smoothstep(0.765, 0.80, pn + (n3 - 0.5) * 0.02) * pudIn;
  earth *= 1.0 - 0.45 * smoothstep(0.66, 0.765, pn) * pudIn;
  con = mix(con, earth, yardK);
  col = mix(col, con, edge);
  col = mix(col, pl, plank);
  vec3 N = vec3(0.0, 1.0, 0.0);
  vec3 lit = fmShade(col, N, vP, vOff);
  if (s > uYard.x - 6.0 && s < uYard.y + 6.0) { vec2 um = fmUmb(vP);   // the umbrellas' shade by day, the pools of their bulbs by night
    lit *= 1.0 - 0.72 * (1.0 - um.x) * smoothstep(0.3, 1.2, uSunCol.g); lit += col * uLamp * 1.5 * um.y; }
  float vis, skyK; vec3 tint; fmSunEx(vP, vOff, vis, tint, skyK);
  lit += col * vec3(0.18, 0.26, 0.48) * skyK * (0.13 / (0.08 + dot(col, vec3(0.333)))) * (1.0 - smoothstep(0.5, 1.4, uSunCol.g));   // by night open ground lies in a wash of moonlight, never black
  vec3 V = normalize(uCamL - vP + vec3(0.0, 1e-4, 0.0)), H = normalize(uSun + V);
  float sp = max(H.y, 0.0); sp *= sp; sp *= sp; sp *= sp; sp *= sp; sp *= sp; sp *= sp;
  lit += wet * (uSunCol * sp * 1.5 * vis + mix(tint * 0.5, uSkyCol, vis) * 0.22 * (1.0 - V.y) );
  float fr = 1.0 - max(V.y, 0.0); fr *= fr; fr *= fr;
  float open2 = max(vis, 0.6 * (1.0 - step(1e-3, dot(tint, tint))));   // under shut cloth the wet ground mirrors the cloth, not the sky
  lit += (uWet * 0.09 + pud * 1.5) * (uSunCol * sp * 2.2 * vis + mix(tint * uSunCol * 0.35, uSkyCol * 1.3, open2) * (0.12 + 0.9 * fr));
  // the yard's puddles are water: the sky by fresnel, a muddy bottom seen from above, the rain tree's shade, ripples and sun glints
  float rp = fmN2(w * 5.0 + vec2(uTime * 0.45, -uTime * 0.3)), rp2 = fmN2(w * 13.0 - vec2(uTime * 0.6, uTime * 0.35));
  vec3 pw = mix(uSkyCol * 0.5, uSkyCol * 1.6 + uSunCol * 0.05, fr) * (0.8 + 0.4 * rp) * mix(0.5, 1.0, vis);
  pw += col * (uSkyCol * 0.5 + uSunCol * 0.12 * vis) * (1.0 - fr);
  pw += uSunCol * vis * (sp * mix(0.4, 2.0, smoothstep(0.5, 1.4, uSunCol.g)) * (0.3 + 0.7 * rp) * (0.6 + 0.4 * rp2) + smoothstep(0.80, 0.86, rp2) * smoothstep(0.5, 0.7, rp) * 0.45 * (0.5 + 0.5 * sin(uTime * 5.0 + rp * 40.0)));
  lit = mix(lit, pw, pudY);
  // by day the far rails swim in the heat: pale pools of sky that waver over the hot ballast well ahead of the cab, wherever the sun lies on it
  { float hot = smoothstep(1.5, 2.0, uSunCol.g) * (1.0 - uWet) * vis * smoothstep(12.0, 30.0, cdist) * (1.0 - edge);
    float wv = fmN2(vec2(x * 1.1 + 0.3 * sin(uTime * 1.3 + s * 0.4), s * 0.22 - uTime * 0.5));
    lit = mix(lit, uSkyCol * 3.2 + uSunCol * 0.16, hot * smoothstep(0.46, 0.62, wv) * (0.62 + 0.14 * sin(uTime * 9.0 + s * 2.0))); }
  gl_FragColor = vec4(max(lit, vec3(0.0)), 1.0);
  #include <fog_fragment>
}`;return r0(n,e,i)}function S0(n,e,i=30,t=null){const x=[],b=[],d=[];let h=0;const l=(s,r,v)=>{const p=Math.max(1,Math.round((r-s)/3)),u=h;for(let a=0;a<=p;a++){const f=s+(r-s)*a/p,m=e(f);x.push(-v+m,.02,n/2-f,v+m,.02,n/2-f),b.push(m,m),h+=2}for(let a=0;a<p;a++){const f=u+a*2;d.push(f,f+1,f+3,f,f+3,f+2)}};l(-48,0,9),t?(l(0,t[0],3.62),l(t[1],n,3.62)):l(0,n,3.62),l(n,n+i,9);const c=new z.BufferGeometry;return c.setAttribute("position",new z.Float32BufferAttribute(x,3)),c.setAttribute("aOff",new z.Float32BufferAttribute(b,1)),c.setIndex(d),c.computeBoundingSphere(),c}function T0(n){const e=i0+a0+`
attribute vec4 aSeed; attribute float aOff; uniform float uPx; varying vec4 vC;
void main(){
  vec3 p = position;
  p.x += sin(uTime * (0.2 + aSeed.x * 0.3) + aSeed.y * 40.0) * 0.5;
  p.y = 0.25 + mod(p.y + sin(uTime * 0.31 + aSeed.z * 30.0) * 0.4 - uTime * 0.05 * aSeed.w, 3.6);
  p.z += cos(uTime * (0.15 + aSeed.y * 0.3) + aSeed.x * 40.0) * 0.6;
  float d = (uLen * 0.5 - p.z) - uCamS;
  p.z -= 2.5 * exp(-d * d * 0.02) * (0.5 + aSeed.z);
  float vis; vec3 tint; fmSun(p, aOff, vis, tint);
  float petal = step(0.9, aSeed.w);
  float tw = 0.55 + 0.45 * sin(uTime * (2.0 + aSeed.x * 5.0) + aSeed.y * 50.0);
  vC = vec4(mix(vec3(1.0, 0.93, 0.78), vec3(1.0, 0.5, 0.05), petal) * uSunCol * (0.9 + 0.8 * petal), vis * tw * (0.5 + 0.5 * petal));
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = clamp(uPx * (0.012 + 0.02 * petal + 0.012 * aSeed.z) / max(-mvPosition.z, 0.5), 1.0, 9.0);
  #include <fog_vertex>
}`,i=l0+`
varying vec4 vC;
void main(){ vec2 q = gl_PointCoord - 0.5; float a = 1.0 - smoothstep(0.1, 0.5, length(q));
  gl_FragColor = vec4(max(vC.rgb * vC.a * a * 0.5, vec3(0.0)), 1.0);
}`;return r0(n,e,i,{transparent:!0,depthWrite:!1,blending:z.AdditiveBlending,uniforms:{uPx:n.uPx}})}const o=(n,e,i)=>({r:n,g:e,b:i}),L=(n,e)=>({r:n.r*e,g:n.g*e,b:n.b*e}),u0=(n,e,i)=>({r:n.r+(e.r-n.r)*i,g:n.g+(e.g-n.g)*i,b:n.b+(e.b-n.b)*i}),Z=n=>{const e=Math.sin(n*12.9898)*43758.5453;return e-Math.floor(e)},B0=[o(.7,.25,.4),o(.62,.6,.5),o(.2,.45,.65),o(.72,.5,.08),o(.6,.12,.08)],o0=[o(.5,.12,.08),o(.52,.38,.06),o(.14,.28,.44),o(.2,.36,.16),o(.5,.47,.38),o(.44,.24,.08),o(.4,.14,.26),o(.12,.34,.34),o(.54,.3,.1)];function h0(n,e,i,t,x,b,d,h,l,c=1,s=.72){const r=e*(i-b/2),v=e*(i+b/2),p=h/2,u=p*c,a=e*(i-b/2*c),f={r:l.r*s,g:l.g*s,b:l.b*s},m={r:l.r*1.1,g:l.g*1.1,b:l.b*1.1};let g=n.vert(r,t,x-p,-e,0,0,f.r,f.g,f.b),A=n.vert(r,t,x+p,-e,0,0,f.r,f.g,f.b),w=n.vert(a,t+d,x+u,-e,0,0,l.r,l.g,l.b),y=n.vert(a,t+d,x-u,-e,0,0,l.r,l.g,l.b);n.quad(g,A,w,y),g=n.vert(a,t+d,x-u,0,1,0,m.r,m.g,m.b),A=n.vert(a,t+d,x+u,0,1,0,m.r,m.g,m.b),w=n.vert(v,t+d,x+u,0,1,0,m.r,m.g,m.b),y=n.vert(v,t+d,x-u,0,1,0,m.r,m.g,m.b),n.quad(g,A,w,y),g=n.vert(r,t,x+p,0,0,1,f.r*.8,f.g*.8,f.b*.8),A=n.vert(v,t,x+p,0,0,1,f.r*.8,f.g*.8,f.b*.8),w=n.vert(v,t+d,x+u,0,0,1,l.r*.8,l.g*.8,l.b*.8),y=n.vert(a,t+d,x+u,0,0,1,l.r*.8,l.g*.8,l.b*.8),n.quad(g,A,w,y)}const H0={mat:0,aux:0,anim:[0,0,0,0],M:new z.Matrix4,nv:0,vert(){return 0},tri(){},quad(){},box(){},cyl(){},blob(){},tube(){}};function K0(n){let e=n>>>0;const i=()=>{e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296};return i.range=(t,x)=>t+(x-t)*i(),i.int=(t,x)=>Math.floor(t+(x-t+1)*i()),i.pick=t=>t[Math.floor(i()*t.length)],i.chance=t=>i()<t,i}function x0(n,e,i,t,x,b){e.anim=[0,0,0,0],e.mat=1,e.aux=n.tubeGain,e.box(i,t,x,.05,.04,b,o(.74,.9,1),1,1,.45),e.mat=0,e.aux=0}function p0(n,e,i,t,x,b,d){const h=n.Z(x),l=o(.36,.24,.13),c=o(.62,.56,.46),s=d>3.1?1:-1;e.anim=[x,7,b,d],e.mat=0,e.aux=0,e.blob(i,t+.045,h,.04,.038,.06,c,4,2,!1,l),e.blob(i,t+.085,h-s*.05,.027,.026,.03,L(l,.8),3,2,!1,o(.42,.22,.1));const r=e.vert(i-.014,t+.055,h+s*.05,0,1,0,l.r*.7,l.g*.7,l.b*.7);e.vert(i+.014,t+.055,h+s*.05,0,1,0,l.r*.7,l.g*.7,l.b*.7),e.vert(i,t+.06,h+s*.125,0,1,0,l.r*.6,l.g*.6,l.b*.6),e.tri(r,r+1,r+2),e.anim=[0,0,0,0]}function R0(n,e,i,t,x,b){const d=n.Z(x),h=b<.4?o(.6,.33,.1):b<.75?o(.3,.28,.26):o(.66,.63,.56),l=L(h,.6),c=i<0?1:-1,s=b*40;e.anim=[0,0,0,0],e.mat=0,e.aux=0,e.blob(i,t+.078,d,.15,.085,.2,l,6,3,!1,h),e.blob(i+c*.05,t+.082,d-.17,.068,.06,.072,h,5,3,!1,L(h,1.15)),e.tube([[i-c*.1,t+.03,d+.17],[i+c*.15,t+.028,d+.06],[i+c*.15,t+.03,d-.14]],.022,3,l);for(const r of[-1,1]){const v=i+c*.05+r*.036,p=t+.13,u=d-.17;e.anim=[x,9,r,s];const a=e.vert(v-.024,p,u+.01,0,.4,-1,l.r,l.g,l.b);e.vert(v+.024,p,u+.01,0,.4,-1,l.r,l.g,l.b),e.vert(v+r*.008,p+.058,u,0,.4,-1,h.r,h.g,h.b),e.tri(a,a+1,a+2)}e.anim=[0,0,0,0]}function b0(n,e,i,t,x,b,d=2){const h=i<0?-1:1,l=h*2.245;for(let c=0;c<d;c++){const s=Z(x*3.71+c*9.13+h),r=x+(s-.5)*b*.8,v=n.Z(r);e.anim=[r,10,.72,s*6.283],e.mat=2,e.aux=.9,e.tube([[l,t-.05,v],[l,t-.11,v]],.011,3,o(.66,.74,.82))}e.anim=[0,0,0,0],e.mat=0,e.aux=0}function d0(n,e,i,t,x,b,d,h){const l=n.R,c=n.Z(x),s=t+.045,r=i<0?-1:1;e.anim=[0,0,0,0],e.mat=2,e.aux=.25,e.box(i,t+.03,c,b,.06,d,h==="crab"?o(.16,.36,.62):h==="squid"?o(.6,.14,.1):o(.5,.52,.54),1.1,1.06,.7);const v=l.range(.06,.09);e.aux=.7,e.box(i,s+v/2,c,b*.9,v,d*.94,o(.6,.68,.76),.74,.9,.7);const p=(u,a,f,m,g,A)=>{const w=e.vert(-u,.004,f,0,1,0,g.r,g.g,g.b);e.vert(u,.004,f,0,1,0,g.r,g.g,g.b),e.vert(a,-.012,m,0,1,0,g.r*A,g.g*A,g.b*A),e.vert(-a,-.012,m,0,1,0,g.r*A,g.g*A,g.b*A),e.quad(w,w+1,w+2,w+3)};for(let u=0;u<3;u++){const a=c+((u+.5)/3-.5)*d*.8,f=i+l.range(-.04,.04),m=l.range(-.4,.4)+(r>0?0:Math.PI);e.M.makeRotationY(Math.PI/2+m).setPosition(f,s+v+.03,a),e.mat=2,e.aux=.6,h==="squid"?(e.blob(0,.01,-.04,.075,.05,.2,o(.7,.5,.56),4,2,!1,o(.52,.16,.34)),p(.04,.12,.13,.37,o(.7,.3,.4),.75)):h==="crab"?(e.blob(0,.01,0,.15,.055,.11,o(.56,.22,.1),4,2,!1,o(.9,.3,.04)),e.aux=.1,p(.2,.15,-.07,-.18,o(.84,.22,.03),.75)):e.blob(0,.01,0,.06,.032,.21,o(.5,.56,.62),4,2,!1,o(.05,.22,.38)),e.M.identity()}e.mat=0,e.aux=0,h!=="fish"&&b0(n,e,i,t,x,d,1)}function V0(n,e,i,t,x,b,d,h){const l=n.S3,c=l.R,s=n.Z(t),r=n.C,v=L(o(.33,.24,.14),c.range(.8,1.2)),p=o(.7,.69,.64),u=o(.21,.155,.1);e.anim=[0,0,0,0],e.mat=0,e.aux=0,h>.12&&(e.box(i*2.93,h-.05,s,1.62,.1,3,L(u,1.15),1,1,.7),e.box(i*3.6,(h+3.7)/2,s+1.5,.14,h+3.7,.14,u,1,1,.6),e.tube([[i*3.6,h+3.72,s-1.5],[i*3.6,h+3.72,s+1.5]],.055,3,L(u,1.2)),e.tube([[i*3.6,h+3.7,s+1.5],[i*5.02,h+6.5,s+1.5]],.035,3,o(.44,.36,.2))),e.box(i*2.87,h+.83,s,1.2,.05,2.72,v,1,1,.8),e.box(i*3.17,h+.98,s,.56,.25,2.62,L(v,.9));for(let A=0;A<4;A++){const w=A%2?L(r.blue,.7):p,y=i*2.262,k=s-1.3+A*.65,M=e.vert(y,h+.23,k,-i,0,0,w.r*.8,w.g*.8,w.b*.8);e.vert(y,h+.81,k,-i,0,0,w.r,w.g,w.b),e.vert(y,h+.81,k+.65,-i,0,0,w.r,w.g,w.b),e.vert(y,h+.23,k+.65,-i,0,0,w.r*.8,w.g*.8,w.b*.8),e.quad(M,M+1,M+2,M+3)}const a=(x+(i>0?1:0))%2;if(d0(l,e,i*2.56,h+.855,t-.67,.52,1.24,a?"squid":"crab"),d0(l,e,i*2.56,h+.855,t+.67,.52,1.24,a?"crab":"squid"),d0(l,e,i*3.17,h+1.105,t,.5,2.5,"fish"),e.mat=6,e.aux=0,e.box(i*2.85,h+.17,s+(a?-.6:.6),.42,.3,.58,L(a?r.blue:r.red,.7),1.06,1.04,.7),e.mat=0,d){e.mat=3;const A=n.len/2-d[0];e.cyl(i*2.2,h,A,.16,.2,.42,8,o(.3,.2,.15)),e.cyl(i*2.2,h+.42,A,.22,.24,.26,10,o(.62,.63,.64)),e.cyl(i*2.2,h+.68,A,.24,.05,.07,10,o(.66,.67,.68)),e.mat=0}if(Z(x*5.3+i*2.1)<.3&&p0(n,e,i*2.33,h+.905,t+(Z(x*1.9+i)-.5)*2.2,i,Z(x*7.7+i)*6.283),b)return;const f=i*2.3,m=h+c.range(2.9,3.08),g=L(o(.5,.41,.2),c.range(.8,1.15));for(const A of[-1.3,1.3])e.tube([[f,h+.85,s+A],[f,m,s+A]],.03,3,g);e.box(f,m,s,.045,.045,2.8,g,1,1,.9);{const A=m-.02,w=c.range(.35,.7),y=n.Z(t-.85);e.anim=[t-.85,2,A,c.range(0,6.28)],e.mat=0,e.aux=-1,e.tube([[f,A,y],[f,A-w,y]],.0075,3,o(.1,.065,.04)),e.mat=1,e.aux=c.range(4.5,7)*(n.bulbGain||1),e.blob(f,A-w-.07,y,.045,.062,.045,o(1,.72,.36),4,2),e.mat=0,e.aux=0,e.anim=[0,0,0,0]}if(a){const A=m-.32,w=n.Z(t+.8);e.anim=[t+.8,2,m-.02,c.range(0,6.28)],e.mat=0,e.aux=-1,e.tube([[f,m-.02,w],[f,A,w]],.0075,3,o(.1,.065,.04)),e.aux=0,e.mat=3,e.box(f,A,w,.03,.03,.5,o(.75,.56,.2));for(const y of[-.24,.24])e.tube([[f,A,w+y],[f,A-.42,w+y]],.012,3,o(.5,.38,.14)),e.cyl(f,A-.47,w+y,.07,.15,.05,6,o(.78,.58,.2),!1,.6);e.mat=0,e.anim=[0,0,0,0]}x0(n,e,f+i*.2,m-.14,s,1.3)}async function I0(n){const{R:e,B:i,Z:t,cells:x,C:b}=n,d=[o(.56,.36,.11),o(.33,.5,.4),o(.62,.6,.52),o(.6,.42,.2),o(.4,.5,.56)],h=[b.red,b.saffron,b.blue,b.green,o(.6,.58,.5),b.orange];for(const l of[-1,1]){let c=0;for(;c<x;){if(n.inGap(c*3+1.5,l)){c++;continue}const s=e.chance(.45)&&c+1<x&&!n.inGap(c*3+4.5,l)?2:1,r=c*3,v=(c+s)*3,p=(r+v)/2,u=v-r,a=i(p),f=e.range(4.45,5.15),m=L(e.pick(d),e.range(.85,1.1)),g=t(p);a.anim=[0,0,0,0],a.mat=5,a.aux=0,a.box(l*3.66,f/2,t(r+.22),.32,f,.44,m),a.box(l*3.66,f/2,t(v-.22),.32,f,.44,m),a.box(l*3.65,(2.8+f)/2,g,.28,f-2.8,u-.86,m,1,1,.9),a.box(l*4.86,f/2,g,.2,f,u,L(m,.9)),a.box(l*3.62,f-.1,g,.46,.16,u,L(m,.8));const A=n.detail<=.5;A||a.box(l*3.6,.18,g,.1,.36,u-.86,L(m,.55)),a.mat=0,a.box(l*4.26,f+.05,g,1.42,.1,u+.02,o(.33,.32,.31),1,1,1),a.box(l*4.72,1.4,g,.06,2.8,u-.86,o(.1,.085,.06)),a.box(l*4.2,.03,g,1.1,.06,u-.86,o(.16,.15,.13));for(let C=0,H=n.detail>.5?2+s*2:0;C<H;C++){const R=r+.7+(u-1.4)*(C+.5)/H,G=e.range(.5,1.9);a.box(l*4.48,G/2+.06,t(R),.4,G,(u-1.4)/H*.8,L(e.pick([b.blue,b.red,b.saffron,o(.45,.35,.2),b.green]),.55),.9,.95)}if(e.chance(.22)){a.mat=8,a.box(l*3.74,1.42,g,.05,2.76,u-.9,L(e.pick([o(.34,.4,.44),o(.26,.36,.3),o(.42,.38,.3),o(.24,.3,.42)]),e.range(.85,1.15))),a.mat=0,a.box(l*3.7,.5,g,.04,.07,u-1.1,o(.2,.22,.24));for(let C=0,H=e.int(1,3);C<H;C++){const R=g+e.range(-.4,.4)*(u-1.4),G=e.range(.35,.6),S=e.range(.45,.75),F=e.range(1.3,1.9),j=e.pick(h);a.box(l*3.705,F,R,.012,S,G,o(.66,.63,.52)),a.box(l*3.698,F+S*.16,R,.012,S*.42,G*.8,L(j,.6)),a.box(l*3.698,F-S*.3,R,.012,S*.1,G*.7,o(.12,.12,.14))}}else{a.box(l*3.72,2.62,g,.26,.34,u-.9,o(.12,.095,.07));const C=L(o(.33,.24,.14),e.range(.7,1.1)),H=e.chance(.3)?4:3,R=u-1.1,G=n.R2,S=Math.floor(G()*o0.length),F=[o0[S],o0[(S+1+Math.floor(G()*3))%o0.length],o0[(S+5+Math.floor(G()*3))%o0.length]],j=V=>F[o0.indexOf(V)%3];for(let V=0;V<H;V++){const O=.62+V*(H>3?.56:.7)+e.range(-.04,.04);a.mat=0,a.box(l*4.5,O,g,.36,.035,R,C,1,1,.8);const _=e.int(0,3),X=j(e.pick(o0)),E=Math.max(3,Math.round(R/e.range(.36,.5)));for(let D=0;D<E;D++){if(e.chance(.12))continue;const W=g-R/2+(D+.5)*R/E+e.range(-.03,.03),U=L(e.chance(.6)?X:j(e.pick(o0)),e.range(.75,1.1)),$=l*4.46,J=Z(D*7.13+V*3.71+c*1.37),P=.7+J,I=(H>3?.56:.7)-.1;if(_===0){const B=e.range(.16,.22),T=Math.min(I,e.range(.14,.25)*P),Y=Math.min(.26,R/E*.8);G()<.4?a.blob($,O+.018+T*.55,W,.11,T*.6,Math.min(.15,R/E*.42),L(u0(U,o(.5,.44,.3),.55),1.1),5,2):(h0(a,l,4.44,O+.018,W,B,T,Y,U,1),G(),h0(a,l,4.44-B/2-.002,O+.018+T*.26,W,.008,T*.5,Y*.74,o(.68,.64,.52),1,1),h0(a,l,4.44-B/2-.007,O+.018+T*.42,W+(J-.5)*Y*.2,.006,T*.2,Y*.4,L(U,.4),1,1))}else if(_===1){const B=Math.min(I,e.range(.2,.3)*(.8+.5*J)),T=.036+.014*Z(D*3.3+V),Y=O+.018;a.mat=2,a.aux=.04,a.cyl($,Y,W,T,T,B*.58,5,U,!1,.7,L(U,1.1)),a.cyl($,Y+B*.58,W,T,.014,B*.2,4,L(U,1.1),!1,1),a.cyl($,Y+B*.78,W,.014,.016,B*.22,4,L(U,1.2),!1,.9,J<.5?o(.62,.6,.5):o(.55,.1,.06)),a.mat=0,a.aux=0}else if(_===2){const B=Math.min(I-.05,(e.range(.12,.18)+.03)*P),T=.06+.03*Z(D*5.1+V*2.3);a.mat=2,a.aux=.04,a.cyl($,O+.018,W,T,T*.94,B,7,U,!1,.7,L(U,1.15)),a.mat=0,a.aux=0,a.cyl($,O+.018+B,W,T*.85,T*.7,.03,7,o(.5,.42,.2),!0,.8)}else{const B=e.int(1,2);if(G()<.5)for(let T=0;T<=B;T++)a.cyl($,O+.018+T*.045,W,.05,.105,.07,5,L(U,.7),!1,.8,T%2?o(.62,.6,.54):U);else for(let T=0;T<B;T++)h0(a,l,4.44+.02*T,O+.018+T*.13,W,.2,.12,Math.min(.24,R/E*.78),T?L(U,.8):U,1)}}}for(let V=0,O=s>1?3:2;V<O;V++){const _=Z(c*9.7+l*3.3+V*5.9),X=Z(_*91.7),E=g+((V+.5)/O-.5)*(u-1.6)+(_-.5)*.3,D=.1+.28*X,W=l*3.93,U=2.44;if(a.anim=[n.len/2-E,2,U,_*6.28],a.mat=0,a.aux=-1,a.tube([[W,U,E],[W,U-D,E]],.0075,3,o(.3,.26,.16)),a.aux=0,_<.4)a.mat=2,a.aux=.04,a.blob(W,U-D-.13,E,.085,.14,.085,B0[Math.floor(X*5)%5],5,3,!1,o(.7,.68,.6)),a.mat=0,a.aux=0;else if(_<.78){const $=X<.4?o(.74,.7,.6):X<.7?o(.5,.16,.2):o(.62,.36,.08);for(let J=0;J<4;J++)a.blob(W+(J%2?.03:-.03),U-D-.05-J*.085,E+(J%2?-.02:.025),.05,.048,.05,L($,.85+.1*J),4,2)}else a.cyl(W,U-D-.2,E,.06,.12,.2,6,o(.36,.27,.13),!1,.7,o(.56,.44,.22))}if(a.anim=[0,0,0,0],a.mat=0,a.aux=0,e.chance(.6)&&a.box(l*4.1,.5,g+e.range(-.3,.3),.5,.86,u*.45,L(e.pick([b.blue,o(.45,.33,.2),b.green,b.orange]),.4),1,1,.8),e.chance(.5)){a.mat=6;const V=g+e.range(-.35,.35)*u,O=L(e.pick([b.blue,b.red,b.green]),e.range(.55,.8));for(let _=0,X=e.int(1,3);_<X;_++)a.box(l*4.05,.17+_*.31,V,.42,.3,.58,O,1.06,1.04,.7)}a.mat=0}for(const C of[r+.22,v-.22])if(e.chance(.5)){const H=e.range(1.4,2.2),R=e.pick(h);e.chance(.7)?(a.box(l*3.495,H,t(C),.012,.44,.3,o(.66,.63,.52)),a.box(l*3.488,H+.07,t(C),.012,.2,.24,L(R,.6))):(a.box(l*3.47,H,t(C),.07,.3,.22,o(.42,.43,.42)),a.box(l*3.43,H+.03,t(C),.012,.1,.12,o(.07,.08,.09)))}const w=e.pick(h),y=u*e.range(.5,.82),k=e.range(3.02,3.3),M=g+e.range(-.2,.2),q=L(w,Math.min(.75,.55/Math.max(w.r,w.g,w.b))),K=u0(w,o(.75,.72,.6),.8);a.box(l*3.47,k,M,.06,.46,y,q,1,1,.9),a.box(l*3.435,k+.2,M,.02,.04,y,L(K,.8)),a.box(l*3.435,k-.2,M,.02,.04,y,L(K,.8));for(let C=0,H=Math.max(3,Math.round(y/(A?.62:.42))),R=y/H;C<H;C++){a.anim=[p,4,k-.23,C*1.7+c];const G=C%2?.2:.27;a.box(l*3.455,k-.23-G/2,M-y/2+(C+.5)*R,.014,G,R*.96,C%2?L(K,.75):L(q,.85),1,.55,.9)}a.anim=[0,0,0,0],A||a.box(l*3.43,k,g,.03,.13,y*.8,u0(w,o(.75,.72,.6),.75),1,1,1),a.mat=3,a.box(l*3.43,3.72,g,.05,.05,u,o(.4,.4,.42)),a.mat=0;const N=A&&e.chance(.55)?1:e();if(N<.3){const C=l*4.3,H=g+e.range(-.6,.6);a.cyl(C,f+.1,H,.42,.42,.85,9,L(b.blue,.75)),a.cyl(C,f+.95,H,.44,.1,.12,9,L(b.blue,.6))}else if(N<.62)for(let C=0,H=e.int(2,4);C<H;C++){const R=l*e.range(3.85,4.6),G=g+e.range(-u*.4,u*.4),S=e.range(.3,.6);a.cyl(R,f+.1,G,.13,.17,.26,6,o(.42,.2,.1)),a.blob(R,f+.36+S*.5,G,S*.7,S*.6,S*.7,o(.1,.26,.07),5,3,!1,e.chance(.6)?o(.62,.07,.3):o(.25,.42,.1))}else N<.8&&(a.box(l*4.3,f+.3,g,.6,.4,.9,o(.5,.5,.48)),a.box(l*4.3-l*.31,f+.3,g,.02,.3,.7,o(.15,.15,.15)));c+=s,await n.pause()}}}function f0(n,e,i,t,x,b,d,h,l){const{R:c,Z:s,C:r}=n,v=s(x),p=y=>l?Math.round(y*n.detail):0,u=n.detail>.6?6:5,a=n.detail>.5?3:2;e.mat=2,e.aux=.25,e.box(i,t+.025,v,b,.05,d,c.pick([o(.66,.66,.62),o(.62,.64,.66),o(.25,.42,.6),o(.5,.52,.5)]),1.08,1.05,.7);const f=t+.045,m=b*.44,g=d*.45,A=y=>{const k=c.range(0,6.283),M=Math.sqrt(c())*.92,q=Math.sqrt(Math.max(0,1-M*M));return[i+Math.cos(k)*M*m,f+y*q,v+Math.sin(k)*M*g]},w=(y,k,M,q)=>{e.mat=4,e.aux=q,e.blob(i,f,v,m,M,g,y,u,a,!0,k)};if(h==="lime"||h==="mango"||h==="tomato"){const y=h==="lime"?o(.3,.5,.06):h==="mango"?o(.17,.05,.13):o(.62,.09,.04),k=c.range(.14,.3),M=h==="lime"?.036:.043;w(L(y,.8),y,k,h==="lime"?15:12),e.mat=2,e.aux=.15;for(let q=0,K=p(9);q<K;q++){const N=A(k),C=L(y,c.range(.8,1.25));e.blob(N[0],N[1]+M*.5,N[2],M,M*.92,M,C,5,2),h==="mango"&&e.blob(N[0],N[1]+M*1.35,N[2],M*.5,M*.22,M*.5,o(.25,.4,.12),4,1,!0)}}else if(h==="chilliR"||h==="chilliG"){const y=h==="chilliR"?o(.66,.05,.03):o(.22,.46,.06),k=c.range(.08,.16);w(L(y,.75),y,k,26),e.mat=2,e.aux=.1;for(let M=0,q=p(8);M<q;M++){const K=A(k),N=c.range(0,3.14);e.M.makeRotationY(N).setPosition(K[0],K[1]+.012,K[2]),e.blob(0,0,0,.013,.013,.065,L(y,c.range(.85,1.3)),4,2),e.M.identity()}}else if(h==="papaya"){e.mat=0,e.box(i,f+.008,v,b*.95,.012,d*.95,o(.12,.33,.08),1,1,1);for(let y=0,k=3+p(3);y<k;y++){const M=v+((y+.5)/k-.5)*d*.85,q=i+c.range(-.04,.04);e.mat=2,e.aux=.2,e.blob(q,f+.01,M,b*.36,.06,d*.36/k*1.5,o(.2,.36,.08),6,2,!0,o(.8,.33,.04)),e.mat=4,e.aux=60,e.blob(q,f+.055,M,b*.22,.014,d*.1/k*1.5,o(.05,.04,.03),4,1,!0)}}else if(h==="fish"||h==="squid"){e.mat=2,e.aux=1,e.blob(i,f,v,m*1.02,c.range(.06,.1),g*1.02,o(.62,.67,.72),u,2,!0,o(.78,.8,.82));const y=3+p(4),k=h==="fish";for(let M=0;M<y;M++){const q=v+((M+.5)/y-.5)*d*.8,K=c.range(-.25,.25)+(i>0?0:Math.PI);e.M.makeRotationY(Math.PI/2+K).setPosition(i+c.range(-.03,.03),f+.085,q),e.aux=.6,k?(e.blob(0,0,0,.042,.022,.15,o(.52,.56,.6),5,3,!1,o(.1,.22,.3)),e.blob(0,0,-.17,.035,.006,.04,o(.12,.2,.26),4,2)):(e.blob(0,0,0,.035,.026,.1,o(.62,.5,.5),5,2,!1,o(.66,.4,.45)),e.blob(0,0,.13,.03,.012,.06,o(.6,.45,.5),4,2)),e.M.identity()}l&&t>.6&&e.anim[1]===0&&b0(n,e,i,t,x,d)}else if(h==="crab"){w(o(.36,.2,.1),o(.6,.3,.1),.1,9),e.mat=2,e.aux=.1;for(let y=0,k=p(5);y<k;y++){const M=A(.1);e.blob(M[0],M[1]+.02,M[2],.075,.03,.055,o(.62,.26,.07),5,2,!1,o(.42,.3,.2))}}else if(h==="orchid"){const y=c.range(.12,.24);w(o(.34,.07,.32),o(.62,.24,.6),y,17),e.mat=0;for(let k=0,M=p(7);k<M;k++){const q=A(y),K=c.chance(.35);e.blob(q[0],q[1]+.02,q[2],.045,.03,.045,K?o(.74,.7,.72):o(.6,.16,.56),5,2)}}else if(h==="marigold"){const y=c.range(.12,.26);w(o(.72,.36,.02),o(.86,.56,.04),y,19),e.mat=0;for(let k=0,M=p(7);k<M;k++){const q=A(y),K=c.chance(.3);e.blob(q[0],q[1]+.02,q[2],.04,.03,.04,K?o(.72,.7,.6):o(.88,.5,.03),5,2)}}else{w(o(.07,.22,.05),o(.2,.42,.1),c.range(.1,.2),8),e.mat=0;for(let y=0,k=p(5);y<k;y++){const M=A(.14);e.M.makeRotationY(c.range(-.4,.4)).setPosition(M[0],M[1]+.02,M[2]),e.blob(0,0,0,.16,.03,.04,o(.13,.36,.08),4,2,!1,o(.3,.5,.14)),e.M.identity()}}e.mat=0,e.aux=0}const g0={fruit:["lime","mango","papaya","tomato","lime","mango"],veg:["chilliR","chilliG","greens","lime","chilliR","tomato"],fish:["fish","squid","crab","fish","fish","squid"],flowers:["marigold","marigold","greens","marigold","lime","marigold"],quarter:["marigold","orchid","marigold","marigold","orchid","marigold"]};function v0(n,e,i,t,x,b){const{R:d,Z:h,C:l}=n,c=h(x);e.anim=[x,2,t,d.range(0,6.28)];const s=r=>{e.mat=0,e.aux=-1,e.tube([[i,t,c],[i,t-r,c]],.0075,3,o(.1,.065,.04)),e.aux=0};if(b==="bulbHigh"){const r=Math.min(d.range(.35,.75),.12);s(r),e.cyl(i,t-r-.05,c,.022,.022,.06,5,o(.08,.08,.08)),e.mat=1,e.aux=d.range(4.5,7)*(n.bulbGain||1),e.blob(i,t-r-.1,c,.045,.058,.045,o(1,.72,.36),5,3),e.anim=[0,0,0,0],e.mat=0,e.aux=0;return}if(b==="bulb"){const r=d.range(.35,.75);s(r),e.cyl(i,t-r-.05,c,.022,.022,.06,5,o(.08,.08,.08)),e.mat=1,e.aux=d.range(4.5,7)*(n.bulbGain||1),e.blob(i,t-r-.1,c,.045,.058,.045,o(1,.72,.36),5,3)}else if(b==="scale"){s(.3);const v=t-.3;e.mat=3,e.box(i,v,c,.03,.03,.5,o(.75,.56,.2));for(const p of[-.24,.24])e.tube([[i,v,c+p],[i-.11,v-.42,c+p]],.014,3,o(.5,.38,.14)),e.tube([[i,v,c+p],[i+.11,v-.42,c+p]],.014,3,o(.5,.38,.14)),e.cyl(i,v-.47,c+p,.07,.15,.05,8,o(.78,.58,.2),!0,.6)}else if(b==="bags")for(let r=0,v=n.detail>.5?d.int(2,4):2;r<v;r++){const p=c+(r-(v-1)/2)*.2,u=d.range(.25,.5);e.mat=0,e.aux=-1,e.tube([[i,t,p],[i,t-u,p]],.0075,3,o(.5,.5,.5)),e.aux=0,e.mat=2,e.aux=.04,e.blob(i,t-u-.11,p,.07,.115,.07,d.pick([o(.7,.25,.4),o(.62,.6,.5),o(.2,.45,.65),o(.72,.5,.08),o(.6,.12,.08)]),6,4,!1,o(.7,.68,.6))}else{const r=n.detail>.5;for(let v=0,p=r?d.int(3,5):2;v<p;v++){const u=c+(v-(p-1)/2)*.13,a=d.range(.5,.95),f=Math.round(a/(r?.074:.1)),m=d.range(.4,.54);e.mat=0;for(let g=0;g<f;g++){const A=t-.05-a*(g+.5)/f,w=g%5===4||g===0;e.blob(i,A,u,r?.037:.045,r?.036:.043,r?.037:.045,w?o(.74,.72,.62):o(.86,m+.04*(g%2),.03),r?5:4,3)}e.blob(i,t-a-.06,u,.022,.05,.022,o(.74,.72,.62),4,2),e.blob(i,t-a-.15,u,.034,.06,.034,l.red,5,3)}}e.anim=[0,0,0,0],e.mat=0,e.aux=0}function F0(n,e,i,t,x,b){const d=n.R2,h=n.Z(x),l=.16+.2*d();if(e.anim=[x,2,t,d()*6.28],e.mat=0,e.aux=0,e.tube([[i,t,h],[i,t-l,h]],.014,3,o(.3,.26,.16)),d()<(b?.3:.6)){const c=.4+.6*d(),s=t-l;e.cyl(i,s-.34,h,.02,.028,.36,4,o(.24,.3,.1),!1);for(let r=0;r<2;r++)for(let v=0;v<5;v++){const p=v/5*6.283+r*.6,u=.07+.012*r,a=u0(o(.36,.5,.08),o(.82,.62,.08),Math.min(1,c+.25*d()));e.blob(i+Math.cos(p)*u,s-.1-r*.14,h+Math.sin(p)*u,.03,.085,.03,L(a,.75),4,2,!1,a)}}else for(let c=0,s=2+Math.floor(d()*2);c<s;c++){const r=h+(c-(s-1)/2)*.17,v=l+.1+.25*d(),p=d(),u=b?p<.6?o(.86,.5,.04):o(.62,.2,.56):p<.35?o(.36,.56,.08):p<.7?o(.84,.42,.04):o(.3,.07,.2);e.mat=0,e.tube([[i,t,r],[i,t-v,r]],.012,3,o(.5,.5,.46)),e.mat=4,e.aux=16,e.blob(i,t-v-.13,r,.085,.15,.085,L(u,.7),5,3,!1,u)}e.anim=[0,0,0,0],e.mat=0,e.aux=0}async function G0(n){const{R:e,B:i,Z:t,cells:x,C:b}=n,d=o(.33,.24,.14),h=o(.5,.41,.2),l=[],c={};for(const s of[-1,1]){let r=e.pick(Object.keys(g0));for(let v=0;v<x;v++){const p=v*3+1.5,u=t(p),a=!!n.blue&&p>n.blue[0]&&p<n.blue[1],f=i(p),m=a?H0:f;if(n.inGap(p,s))continue;await n.pause();const g=l.length,A=n.pots.length;e:{e.chance(.55)||(r=e.pick(["fruit","veg","fish","flowers","fruit","veg"]));const w=n.inKind(p,3),y=!n.inKind(p,2);if(w&&(r="flowers"),m.anim=[0,0,0,0],m.mat=0,m.aux=0,e.chance(.09)){let S=null;for(let F=0,j=e.int(3,6);F<j;F++){const V=s*e.range(2.5,3.2),O=u+e.range(-1.1,1.1),_=e.int(1,3);(!S||_>S[2]||_===S[2]&&Math.abs(V)<Math.abs(S[0]))&&(S=[V,O,_]),m.mat=6;for(let X=0;X<_;X++)m.box(V,.17+X*.31,O,.42,.3,.58,L(e.pick([b.blue,b.blue,b.red,b.green]),e.range(.6,.9)),1.06,1.04,.7);m.mat=0}!a&&y&&p>6&&!c[s]&&(c[s]=1,R0(n,m,S[0],.32+(S[2]-1)*.31,n.len/2-S[1],Z(v*1.31+s*.77)),m.mat=0);for(let F=0;F<3;F++){const j=s*2.6,V=u+1.2-F*.02;m.cyl(j,.02+F*.1,V,.15,.13,.42,6,L(e.pick([b.red,b.blue]),.8))}break e}const k=L(d,e.range(.8,1.2));m.box(s*2.87,.83,u,1.2,.05,2.72,k,1,1,.8);const M=n.detail<=.5;for(const S of M?[]:[2.33,3.4])for(const F of[-1.28,1.28])m.box(s*S,.4,u+F,.06,.8,.06,L(k,.8));m.box(s*3.17,.98,u,.56,.25,2.62,L(k,.9)),(M||e.chance(.6))&&m.box(s*2.262,.52,u,.02,.58,2.6,L(e.pick([b.blue,b.green,b.red,o(.55,.53,.45),b.saffron]),e.range(.45,.7)),1,1,.75);const q=g0[w?"quarter":r],K=e.int(0,5);for(let S=0;S<3;S++)M?S<2&&f0(n,m,s*2.56,.855,p+(S-.5)*1.34,.52,1.24,q[(S+K)%6],y):f0(n,m,s*(2.56+e.range(-.02,.02)),.855,p+(S-1)*.9,.52,.82,q[(S+K)%6],y),M?S===1&&f0(n,m,s*3.17,1.105,p,.5,2.5,q[(S+K+3)%6],!1):f0(n,m,s*3.17,1.105,p+(S-1)*.88,.5,.8,q[(S+K+3)%6],!1);if(e.chance(.35+.5*n.detail))for(let S=0,F=e.int(1,3);S<F;S++){const j=s*e.range(2.6,3.1),V=u+(S-1)*.85+e.range(-.1,.1);e.chance(.5)?(m.mat=6,m.box(j,.17,V,.42,.3,.6,L(b.blue,e.range(.55,.85)),1.06,1.04,.7),m.mat=0):(m.cyl(j,.02,V,.2,.27,.3,7,o(.42,.31,.15),!1,.7),m.mat=4,m.aux=14,m.blob(j,.3,V,.25,.1,.25,L(e.pick([b.orange,b.green,b.red]),.6),5,2,!0),m.mat=0)}if(e.chance(.18)){l.push([p+e.range(-.5,.5),s,0]),!a&&y&&Z(v*5.3+s*2.1)<.2&&p0(n,m,s*2.33,.905,p+(Z(v*1.9+s)-.5)*2.2,s,Z(v*7.7+s)*6.283);break e}const C=s*2.3,H=e.range(2.9,3.08),R=L(h,e.range(.8,1.15));m.box(C,(.85+H)/2,u-1.3,.05,H-.85,.05,R,.9,.9),m.box(C,(.85+H)/2,u+1.3,.05,H-.85,.05,R,.9,.9),m.box(C,H,u,.045,.045,2.8,R,1,1,.9);const G=n.detail>.6?e.int(2,4):e.int(1,2);for(let S=0;S<G;S++){const F=p-1.1+2.2*(S+.5)/G+e.range(-.15,.15);v0(n,m,C,H-.02,F,S===0?"bulb":r==="flowers"?"garland":e.pick(["scale","bags","garland","bulb","bags"]))}if((p<66||w)&&n.R2()<.85&&F0(n,m,C,H-.02,p+(n.R2()<.5?-1:1)*(.95+.2*n.R2()),w),e.chance(.12)){m.mat=3;const S=u+e.range(-.9,.9);n.pots.push([n.len/2-S,s*2.2,.75]),m.cyl(s*2.2,0,S,.16,.2,.42,8,o(.3,.2,.15)),m.cyl(s*2.2,.42,S,.22,.24,.26,10,o(.62,.63,.64)),m.cyl(s*2.2,.68,S,.24,.05,.07,10,o(.66,.67,.68)),m.mat=0}a||(Z(v*3.7+s*1.3)<(w?.2:.34)&&x0(n,m,C+s*.2,H-.14,u+(Z(v*2.3+s)-.5)*.8,1.3),y&&Z(v*5.3+s*2.1)<.2&&p0(n,m,s*2.33,.905,p+(Z(v*1.9+s)-.5)*2.2,s,Z(v*7.7+s)*6.283))}if(a){const w=n.hAt(p),y=l.length>g,k=n.pots.length>A?n.pots[n.pots.length-1]:null;y&&(l[l.length-1][2]=w),k&&(k[2]+=w),V0(n,f,s,p,v,y,k,w)}}}return l}async function O0(n){const{R:e,B:i,Z:t,cells:x,C:b}=n;for(let d=1;d<x;d++){if(!e.chance(.42))continue;await n.pause();const h=e.chance(.5)?1:-1,l=d*3+e.range(.4,2.6),c=t(l),s=i(l),r=h*e.range(.62,.8);if(n.hAt(l)>.02||n.inGap(l,-1)||n.inGap(l,1)){e.range(0,1),e.range(0,1),e.pick([0,1,2,3,4]);continue}if(s.anim=[l,1,h*e.range(.92,1.05),e.range(-2,2)],s.mat=0,s.aux=0,n.detail>.5?s.box(r,.3,c,.74,.05,1,o(.3,.3,.32),1,1,.8):s.box(r,.19,c,.74,.27,1,o(.2,.2,.22),1,1,.5),n.detail>.5)for(const p of[-.31,.31])for(const u of[-.42,.42])s.box(r+p,.2,c+u,.04,.2,.04,o(.22,.22,.24)),s.M.makeRotationZ(Math.PI/2).setPosition(r+p+.03,.1,c+u),s.cyl(0,0,0,.07,.07,.04,6,o(.06,.06,.06)),s.M.identity();const v=e.pick([["mango","lime"],["fish","squid"],["chilliR","chilliG"],["papaya","tomato"],["marigold","greens"]]);f0(n,s,r,.325,l-.25,.66,.46,v[0],!0),f0(n,s,r,.325,l+.25,.66,.46,v[1],!0),s.anim=[0,0,0,0]}}async function j0(n,e){const{R:i,B:t,Z:x,cells:b,len:d}=n,h=n.detail<=.5,l=h?6:3;if(e)for(let c=-48;c<d+n.after;){const s=n.hAt(c)>.001||n.hAt(c+l)>.001,r=s?1.5:l,v=n.hAt(c),p=n.hAt(c+r),u=t(Math.min(Math.max(c+r/2,0),d-.01));u.anim=[0,0,0,0],u.M.makeRotationX(Math.atan2(p-v,r)).setPosition(0,(v+p)/2,x(c+r/2));const a=Math.hypot(r,p-v)+(s?.02:0);for(const f of[-.5,.5])u.mat=0,u.aux=0,u.box(f,.08,0,.035,.1,a,o(.17,.11,.08)),h||u.box(f,.045,0,.12,.03,a,o(.15,.1,.08)),u.mat=3,u.box(f,.135,0,.065,.035,a,o(.62,.62,.64),.8,1,.45);u.M.identity(),c+=r,await n.pause()}for(let c=1;c<b;c+=3){const s=c*3,r=x(s),v=t(s),p=4.95+i.range(-.15,.3),u=4.95+i.range(-.15,.3);v.anim=[0,0,0,0],v.mat=0,v.aux=0;const a=n.hAt(s)>.3||n.inGap(s,-1)||n.inGap(s,1),f=-3.72,m=h?2:3,g=[],A=[];for(let k=0;k<m;k++)g.push(i.range(.25,.6)),A.push(i.range(-.04,.04));let w=1e9;for(let k=0;k<m;k++)w=Math.min(w,(p+u)/2-g[k]+k*.04);const y=n.wireMin?Math.max(0,n.wireMin-w):0;a||(v.box(-3.72,4.7+y/2,r,.09,1.7+y,.09,o(.25,.2,.15),.8,.8),v.box(3.72,4.7+y/2,r,.09,1.7+y,.09,o(.25,.2,.15),.8,.8));for(let k=0;k<m;k++){const M=g[k],q=[],K=(k-1)*.03,N=A[k];if(!a){for(let C=0,H=h?6:8;C<=H;C++){const R=C/H;q.push([f+(3.72-f)*R,y+p+(u-p)*R-M*4*R*(1-R)+k*.04,r+K+N*Math.sin(R*6.28)])}v.anim=[s,3,.016,0],v.tube(q,.016,3,o(.03,.03,.035))}}i.chance(.7)&&!a&&(n.wireMin?v0(n,v,i.range(-.4,.4),w+y-.01,s,"bulbHigh"):v0(n,v,i.range(-.4,.4),Math.min(p,u)-.3,s,"bulb")),v.anim=[0,0,0,0],await n.pause()}if(e&&n.weeds)for(let c=-38,s=0;c<d+Math.min(n.after,96);c+=1.5){const r=Z(c*1.37+3.1);if(r>.4||n.hAt(c)>.02||n.hAt(c+2)>.02||n.inKind(c,2)||n.inGap(c,-1)&&n.inGap(c,1)||c>-14&&c<1.5)continue;const v=t(Math.min(Math.max(c,0),d-.01)),p=Z(c*2.91+7.7),u=Z(c*5.13+1.9),a=c+(p-.5),f=x(a),m=u<.55?(p-.5)*.66:(u<.78?-1:1)*(.68+.3*p),g=.035;v.anim=[a,11,g,r*40],v.mat=0,v.aux=0;const A=(w,y,k,M,q)=>{const K=v.vert(m+w-.022,g,f+y,0,.5,1,q.r*.6,q.g*.6,q.b*.6);v.vert(m+w+.022,g,f+y,0,.5,1,q.r*.6,q.g*.6,q.b*.6),v.vert(m+w+M,g+k,f+y-.03,0,.7,.7,q.r,q.g,q.b),v.tri(K,K+1,K+2)};if(r<.2){v.blob(m,g,f,.2+.1*p,.05,.26+.14*u,o(.07,.19,.05),5,1,!0,o(.16,.36,.09));for(let w=0;w<3;w++){const y=(Z(c+w*3.3)-.5)*.3,k=(Z(c*1.7+w*5.1)-.5)*.4,M=w===1?o(.7,.62,.74):o(.56,.3,.66),q=v.vert(m+y-.04,g+.075,f+k,0,1,.2,M.r,M.g,M.b);v.vert(m+y+.04,g+.075,f+k,0,1,.2,M.r,M.g,M.b),v.vert(m+y,g+.1,f+k-.07,0,1,.2,M.r*1.2,M.g*1.2,M.b*1.2),v.tri(q,q+1,q+2)}}else for(let w=0,y=3+Math.floor(u*3);w<y;w++){const k=Z(c*3.3+w*1.7);A((k-.5)*.16,(Z(c+w*2.3)-.5)*.14,.16+.24*Z(c*.7+w),(k-.5)*.22,w===0&&u>.5?o(.46,.42,.16):o(.16+.1*k,.36+.1*p,.08))}v.anim=[0,0,0,0],++s%40===0&&await n.pause()}}async function Y0(n,e){const{B:i,Z:t,hAt:x,len:b}=n,d=o(.2,.145,.1),h=o(.13,.22,.19),l=o(.4,.385,.35),c=r=>e&&r>e[0]+.5&&r<e[1]-.5;let s=0;for(let r=0;r<b;r+=.75){const v=x(r);if(v<.02)continue;const p=i(r);p.anim=[0,0,0,0],p.mat=0,p.aux=0,p.M.makeRotationX(Math.atan((x(r+.4)-x(r-.4))/.8)).setPosition(0,v,t(r)),p.box(0,-.02,0,2.3,.1,.24,L(d,.8+.5*(r*7.31%1)),1,1,.8),p.M.identity(),++s%24===0&&await n.pause()}for(let r=0;r<b;r+=3){const v=x(r),p=x(r+3),u=(v+p)/2;if(u<.04)continue;const a=i(r+1.5),f=Math.hypot(3,p-v)+.03;if(a.anim=[0,0,0,0],a.mat=0,a.aux=0,a.M.makeRotationX(Math.atan2(p-v,3)).setPosition(0,u,t(r+1.5)),!c(r+1.5))for(const m of[-.5,.5])a.box(m,-.26,0,.2,.38,f,d,1,1,.8);if(u<1)a.box(0,-.44-u/2,0,2.1,u+.1,f,o(.15,.13,.105),1,1,.7);else for(const m of[-1,1])a.box(m*1.5,0,0,.62,.05,f,L(d,1.3),1,1,.85),a.box(m*1.815,1.02,0,.07,.07,f,L(d,1.1)),a.box(m*1.815,.55,0,.04,.04,f,d),a.box(m*1.815,.5,1.2,.08,1.04,.08,d);a.M.identity(),await n.pause()}for(let r=0;r<=b;r+=6){const v=x(r);if(v<1||c(r))continue;const p=i(r),u=t(r),a=v-.45,f=1+.15*a;p.anim=[0,0,0,0],p.mat=0,p.aux=0,p.box(0,a-.15,u,2.8,.3,.32,d);for(const m of[-1,1])p.tube([[m*1,a-.3,u],[m*f,0,u]],.13,5,d);p.box(0,.12,u,f*2+.5,.24,.36,L(d,.8)),a>2&&(p.tube([[-f+.1,.3,u+.14],[.95,a-.5,u+.14]],.055,4,L(d,1.2)),p.tube([[f-.1,.3,u-.14],[-.95,a-.5,u-.14]],.055,4,L(d,1.2))),await n.pause()}if(e){const[r,v]=e,p=v-r,u=t((r+v)/2),a=x((r+v)/2),f=i((r+v)/2);f.anim=[0,0,0,0],f.aux=0,f.mat=3;for(const m of[-.95,.95]){f.box(m,a-.78,u,.12,1.2,p+1.6,h,1,1,.75),f.box(m,a-.17,u,.36,.06,p+1.6,L(h,1.3)),f.box(m,a-1.4,u,.36,.06,p+1.6,L(h,.9));for(let g=r+1;g<v;g+=2)f.box(m+Math.sign(m)*.09,a-.78,t(g),.07,1.14,.1,L(h,1.15))}for(let m=r+1.5;m<v;m+=3)f.box(0,a-.4,t(m),1.9,.1,.1,h),f.tube([[-.9,a-1.3,t(m)],[.9,a-.35,t(m)]],.04,4,h);f.mat=5;for(const[m,g]of[[r,-1],[v,1]]){const A=a-1.45;f.box(0,A/2-.2,t(m+g*.7),3.6,A+.4,1.5,l,.9,.86,.72),f.box(0,A+.11,t(m+g*.7),3.5,.22,1.5,L(l,1.15))}f.mat=0,await n.pause()}}function _0(n,e,i){const t=new n0(()=>0,0),x=i[0],b=i[1],d=o(.07,.07,.08),h=o(.05,.08,.1),l=2.9,c=9.2;t.box(0,.78,l,2.5,.36,c,d),t.box(0,1.58,l,2.8,1.3,c,x,1,1,.7),t.box(0,1.02,l,2.82,.2,c+.02,L(x,.45)),t.box(0,2.05,l,2.84,.17,c+.02,b,1,1,.95),t.mat=2,t.aux=.05,t.box(0,2.7,l,2.74,.95,c-.1,h,1,1,1),t.mat=0;for(let r=0;r<=6;r++)t.box(0,2.7,l-c/2+.12+r*(c-.24)/6,2.8,.95,r===0||r===6?.24:.16,x);t.box(0,3.26,l,2.8,.2,c,x,.97,1,.85),t.box(0,3.46,l,2.7,.22,c-.1,o(.42,.42,.4),.72,.98,.9);for(let r=0;r<4;r++)t.box(n.range(-.3,.3),3.62,l-3+r*2,.5,.14,.7,o(.33,.33,.32),.8,.8);const s=new z.Matrix4().makeRotationX(-Math.PI/2);t.M.copy(s).setPosition(0,1.58,-2.05),t.box(0,0,0,2.8,.7,1.3,x,.86,.92,1),t.M.copy(s).setPosition(0,2.05,-2.07),t.box(0,0,0,2.84,.72,.17,b,.86,1,1),t.M.copy(s).setPosition(0,2.7,-1.98),t.mat=2,t.aux=.05,t.box(0,0,0,2.7,.56,.9,h,.84,.9,1),t.mat=0,t.M.copy(s).setPosition(0,3.26,-2),t.box(0,0,0,2.8,.62,.2,x,.84,1,1),t.M.identity(),t.box(-1.3,2.7,-1.75,.14,.95,.14,x),t.box(1.3,2.7,-1.75,.14,.95,.14,x),t.box(0,2.7,-2.24,.1,.95,.1,x),t.box(0,3.2,-2.42,2.4,.06,.3,L(x,.7)),t.box(0,1.02,-2.42,2.5,.3,.14,b);for(const r of[-.78,.78])t.M.copy(s).setPosition(r,1.02,-2.5),t.mat=3,t.cyl(0,0,0,.06,.06,.26,6,o(.3,.3,.32),!1),t.M.copy(s).setPosition(r,1.02,-2.76),t.cyl(0,0,0,.2,.2,.06,10,o(.5,.5,.52)),t.M.identity(),t.mat=0;t.box(0,.98,-2.6,.1,.12,.3,d),t.cyl(0,1.94,-2.44,.17,.17,.02,10,o(.6,.6,.6)),t.M.copy(s).setPosition(0,2.32,-2.4),t.cyl(0,0,0,.17,.19,.1,10,o(.5,.5,.5),!1),t.M.identity(),t.mat=1,t.aux=6,t.blob(0,2.32,-2.5,.13,.13,.05,o(1,.9,.7),8,3),t.mat=0,t.aux=0;for(let r=0;r<13;r++){const v=r/12,p=(v-.5)*.9,u=1.5-.42*Math.sin(v*Math.PI);t.blob(p,u,-2.72-.05*Math.sin(v*Math.PI),.05,.05,.05,r%3===1?o(.75,.73,.62):o(.9,.5,.03),5,2)}for(const r of[-.3,6.1]){t.box(0,.45,r,1.9,.4,2.3,d,1,.9);for(const v of[-.75,.75])for(const p of[-.5,.5])t.M.makeRotationZ(Math.PI/2).setPosition(p+.05,.56,r+v),t.mat=3,t.cyl(0,0,0,.41,.41,.1,12,o(.2,.2,.21)),t.mat=0,t.M.identity()}return t.box(0,.65,2.9,2.2,.5,2.6,o(.1,.09,.08),1,1),t.box(0,1.95,l+c/2+.02,1,1.9,.06,L(x,.8)),t.build()}async function D0(n,e={}){const i=n.rng.fork?n.rng.fork("folding-market-hero"):n.rng,t=(e.palette&&e.palette.length>=7?e.palette:k0).map(P=>new z.Color(P)),x={saffron:t[0],orange:t[1],green:t[2],blue:t[3],sun:t[4],umber:t[5],red:t[6]},b=Math.max(6,Math.round((e.length??72)/3)),d=b*3,h=e.offsetAt||(()=>0),l=Math.min(1,Math.max(.25,e.detail??100/d))*(n.quality?.detail??1),c=P=>d/2-P,s=new z.Color(.82,.79,.68),r=[[x.saffron,x.green,s,x.blue],[x.green,x.saffron,x.blue,s],[x.saffron,s,x.green,x.orange],[s,x.blue,x.saffron,x.green],[x.orange,x.saffron,x.green,s]],v=r[i.chance(.45)?0:i.int(1,r.length-1)],p=new z.Vector3(...e.sunDir?e.sunDir.toArray?e.sunDir.toArray():e.sunDir:[.269+i.range(-.06,.06),.883,.385]).normalize(),u={uCamS:{value:0},uLead:{value:e.lead??9},uTime:{value:0},uLen:{value:d},uSun:{value:p},uSunCol:{value:x.sun.clone().multiplyScalar(2.4)},uSkyCol:{value:new z.Color(.3,.42,.62).multiplyScalar(.55)},uShade:{value:x.umber.clone().multiplyScalar(3.2)},uCamL:{value:new z.Vector3(0,5,100)},uPal:{value:v.map(P=>P.clone())},uRed:{value:x.red.clone()},uPx:{value:600},uLamp:{value:new z.Color(0,0,0)},uGust:{value:new z.Vector2(0,0)},uTree:{value:new z.Vector4(0,13,0,0)},uPortal:{value:new z.Vector4(0,0,0,0)},uPortalCol:{value:new z.Color(1,.8,.45)},uWet:{value:0},uZone:{value:[0,1,2,3,4,5,6,7].map(()=>new z.Vector4(-1e4,-1e4,0,9))},uHall:{value:new z.Vector2(-1e4,-1e4)},uFlower:{value:new z.Vector2(-1e4,-1e4)},uBridge:{value:new z.Vector2(-1e4,-1e4)},uTree2:{value:new z.Vector4(0,13,0,0)},uRamp:{value:e.ramp??9},uTintK:{value:1},uHallLamp:{value:new z.Color(.6,.34,.14)},uAwn:{value:new z.Vector4(...e.swing||[-.42,1.642,1.6,2.5])},uClear:{value:new z.Vector4(...e.clear?[Math.atan((e.clear[0]-1.15)/Math.max(e.clear[3],.05)),e.clear[1],Math.max(e.clear[2],.01),0]:[-9,0,1,0])},uBandK:{value:0},uHold:{value:new z.Vector2(...e.hold||[-1e4,-1e4])},uYard:{value:new z.Vector4(-1e4,-1e4,14,9.5)},uBlue:{value:new z.Vector2(...e.blue||[-1e4,-1e4])},uUmb:{value:Array.from({length:16},()=>new z.Vector4(0,0,0,0))}},a=new z.Group;a.name="folding-market-hero";const f=Math.max(1,Math.ceil(d/48)),m=[];for(let P=0;P<f;P++)m.push(new n0(h,d));const g=P=>m[Math.min(f-1,Math.max(0,Math.floor(P/48)))],A=(e.zones||(e.gaps||[]).map(P=>[P[0],P[1],P[2],0])).slice(0,8),w=(P,I,B)=>A.some(T=>P>=T[0]&&P<T[1]&&(T[2]===0||T[2]===I)&&B(T[3])),y=(P,I)=>w(P,I,B=>B===0),k=(P,I)=>w(P,I,B=>B<=2),M=(P,I)=>A.some(B=>P>=B[0]&&P<B[1]&&B[3]===I),q=e.heightAt||(()=>0);let K=Math.imul((Number(n.seed)||1)|0,2654435761)^6267331|0;const C={R:i,R2:()=>{K=K+1831565813|0;let P=Math.imul(K^K>>>15,1|K);return P=P+Math.imul(P^P>>>7,61|P)^P,((P^P>>>14)>>>0)/4294967296},B:g,Z:c,cells:b,len:d,C:x,detail:l,inGap:y,noCloth:k,inKind:M,hAt:q,pots:[],after:e.after??30,bulbGain:e.bulbGain??1,pause:()=>n.yield?.(),blue:e.blue||null,tubeGain:e.tubeGain??1.2,wireMin:e.wireMin??0,weeds:!!e.weeds};C.S3={...C,R:K0((Number(n.seed)||1)*2654435761^242165)},A.forEach((P,I)=>u.uZone.value[I].set(P[0],P[1],P[2],P[3]));{const P=A.find(B=>B[3]===2),I=A.find(B=>B[3]===3);P&&u.uHall.value.set(P[0],P[1]),I&&u.uFlower.value.set(I[0],I[1])}e.bridge&&u.uBridge.value.set(e.bridge[0],e.bridge[1]),e.walls!==!1&&await I0(C),await n.yield?.();const H=await G0(C);await n.yield?.(),await O0(C),await j0(C,e.rails!==!1),await n.yield?.(),e.heightAt&&await Y0(C,e.span||null),await n.yield?.();const R=c0(u),G=[];for(const[P,I]of m.entries()){if(!I.nv)continue;const B=new z.Mesh(I.build(),R);B.name="fm-street",B.userData.s0=P*48,a.add(B),G.push(B),await n.yield?.()}{const P=A0(l>.6?8:6,l>.6?12:7,l<=.5),I=new Float32Array(b*2*4),B=new Float32Array(b*2);let T=0;for(let e0=0;e0<b;e0++)for(const Q of[-1,1]){const t0=e0*3+1.5,s0=i();k(t0,Q)||(B[T/4]=q(t0),I[T++]=t0,I[T++]=Q,I[T++]=h(t0),I[T++]=s0)}P.setAttribute("iA",new z.InstancedBufferAttribute(I,4)),P.setAttribute("iL",new z.InstancedBufferAttribute(B,1)),P.instanceCount=T/4;const Y=new z.Mesh(P,z0(u));Y.frustumCulled=!1,Y.name="fm-awnings",a.add(Y)}await n.yield?.();const S=e.freeParasols||[];if(H.length+S.length){const P=H.length+S.length,I=L0(),B=new Float32Array(P*4),T=new Float32Array(P*3);let Y=0,e0=0;for(const[t0,s0,m0]of H)B[Y++]=t0,B[Y++]=s0,B[Y++]=h(t0),B[Y++]=i(),T[e0++]=s0*2.78,T[e0++]=.88+(m0||0),T[e0++]=1;for(const[t0,s0,m0,y0]of S)B[Y++]=t0,B[Y++]=0,B[Y++]=h(t0),B[Y++]=i(),T[e0++]=s0,T[e0++]=m0,T[e0++]=y0;I.setAttribute("iA",new z.InstancedBufferAttribute(B,4)),I.setAttribute("iB",new z.InstancedBufferAttribute(T,3)),I.instanceCount=P;const Q=new z.Mesh(I,q0(u));Q.frustumCulled=!1,Q.name="fm-parasols",a.add(Q)}if(await n.yield?.(),e.ground!==!1){const P=new z.Mesh(S0(d,h,C.after,e.waterCut||null),N0(u));P.frustumCulled=!1,P.name="fm-ground",a.add(P)}if(await n.yield?.(),e.dust!==!1){const P=Math.round(d*9*(n.quality?.detail??1)),I=new Float32Array(P*3),B=new Float32Array(P*4),T=new Float32Array(P);for(let Q=0;Q<P;Q++){const t0=i.range(0,d);T[Q]=h(t0),I[Q*3]=i.range(-3.1,3.1)+T[Q],I[Q*3+1]=i.range(0,3.6),I[Q*3+2]=c(t0),B[Q*4]=i(),B[Q*4+1]=i(),B[Q*4+2]=i(),B[Q*4+3]=i()}const Y=new z.BufferGeometry;Y.setAttribute("position",new z.BufferAttribute(I,3)),Y.setAttribute("aSeed",new z.BufferAttribute(B,4)),Y.setAttribute("aOff",new z.BufferAttribute(T,1));const e0=new z.Points(Y,T0(u));e0.frustumCulled=!1,e0.name="fm-dust",a.add(e0)}let F=null;const j=new z.Vector3;if(e.railcar!==!1){const P=[[o(.8,.52,.03),L(x.red,.85)],[o(.8,.52,.03),L(x.red,.85)],[o(.78,.33,.05),o(.72,.68,.55)],[o(.16,.3,.55),o(.74,.72,.64)]];F=new z.Mesh(_0(i,x,i.pick(P)),c0(u,j)),F.frustumCulled=!1,F.name="fm-railcar",a.add(F)}await n.yield?.();const V=(P,I=0,B=0,T=new z.Vector3)=>T.set(I+h(P),B,c(P)),O=2.55,_=[];for(let P=-30;P<=d+30.01;P+=6)_.push(V(P,0,O));const X={entry:{position:V(-16,0,O),direction:new z.Vector3(0,0,-1)},flyThrough:_,portalSeat:{position:V(d+65,0,O),normal:new z.Vector3(0,0,1),radius:7},waveFront:(P,I=new z.Vector3)=>V(P+u.uLead.value+5,0,3.2,I),viewpoints:{entryView:V(-16,0,O),sideHigh:new z.Vector3(24,11,0),exitBack:V(d+8,0,1.8)},hinges:{x:3.5,y:3.7,cell:3},railHeadY:.15,eyeY:O,clearBox:{w:3,h:3.8}};let E=null,D=0;const W=new z.Vector3,U=new z.Vector2,$=e.cullAhead??1e9,J={object:a,radius:Math.max(14,d*.265),height:7,center:new z.Vector3(0,2.6,0),anchors:X,uniforms:u,glsl:a0,laneToLocal:V,length:d,ground:!0,groundY:0,pots:C.pots,propMat:R,offsetAt:h,makeBatch:P=>new n0(P?()=>0:h,P?0:d),makePropMaterial:P=>c0(u,P),setProgress(P){E=P,P!=null&&(D=-30+(d+60)*Math.min(1,Math.max(0,P)))},setCamS(P){E=0,D=P},setLead(P){u.uLead.value=P},street:G,zones:A,heightAt:q,update(P,I,B){if(u.uTime.value=I,E==null){const T=d+50;D=-25+I*9%T}u.uCamS.value=D;for(let T=0;T<G.length;T++){const Y=G[T].userData.s0;G[T].visible=Y<D+$&&Y+48>D-80}B&&(a.updateWorldMatrix(!0,!1),u.uCamL.value.copy(a.worldToLocal(W.setFromMatrixPosition(B.matrixWorld))),n.renderer&&(n.renderer.getDrawingBufferSize(U),u.uPx.value=U.y/(2*Math.tan((B.fov||60)*Math.PI/360)))),F&&(j.set(h(D),.012*Math.sin(D*.52),c(D)),F.position.copy(j),F.rotation.z=.008*Math.sin(D*.52+1))},dispose(){}};return J.update(0,0,null),J}const w0=[[[.62,.4,.03],[.42,.06,.04]],[[.6,.26,.04],[.6,.56,.45]],[[.13,.25,.46],[.62,.6,.53]],[[.6,.56,.46],[.42,.06,.04]]];function U0(n,e,i=0){const t=n.uniforms,x=w0[i%w0.length],b=o(...x[0]),d=o(...x[1]),h=o(.05,.05,.055),l=o(.52,.52,.54),c=new z.Vector3,s=new z.Group;s.name="fm-cab";const r=new n0(()=>0,0),v=new z.Matrix4().makeRotationX(-Math.PI/2);r.box(0,-.86,-1,2.7,.06,.62,o(.085,.08,.075),1,1,.9),r.box(0,-.8,-1.32,2.8,.07,.07,h);const p=[[-1.34,-.845],[-1.56,-.872],[-1.78,-.905],[-1.98,-.945],[-2.16,-.992],[-2.3,-1.05],[-2.39,-1.13],[-2.43,-1.26],[-2.43,-1.44]],u=(N,C,H=0)=>{const R=Math.min(p.length-1.001,C*(p.length-1)),G=Math.floor(R),S=R-G,F=p[G][0]+(p[G+1][0]-p[G][0])*S,j=p[G][1]+(p[G+1][1]-p[G][1])*S,V=N*2-1,O=1.33-.17*Math.min(1,C*1.3),_=Math.abs(V),X=_>.78?((_-.78)/.22)**2:0,E=Math.min(1,(1-C)*4);return[V*O*(1-.03*X),j+(.075*(1-V*V)-.2*X)*(.35+.65*E)+H,F+.05*X*(1-E)]},a=(N,C,H,R)=>{const G=r.nv,S=.004;for(let F=0;F<=C;F++)for(let j=0;j<=N;j++){const V=j/N,O=F/C,_=H(V,O),X=H(Math.max(0,V-S),O),E=H(Math.min(1,V+S),O),D=H(V,Math.max(0,O-S)),W=H(V,Math.min(1,O+S)),U=E[0]-X[0],$=E[1]-X[1],J=E[2]-X[2],P=W[0]-D[0],I=W[1]-D[1],B=W[2]-D[2],T=R(V,O);r.vert(_[0],_[1],_[2],$*B-J*I,J*P-U*B,U*I-$*P+1e-9,T.r,T.g,T.b)}for(let F=0;F<C;F++)for(let j=0;j<N;j++){const V=G+F*(N+1)+j,O=V+N+1;r.quad(V,V+1,O+1,O)}};r.mat=2,r.aux=.03,a(14,16,(N,C)=>u(N,C),(N,C)=>{const H=Math.abs(N*2-1),R=(1-.3*C*C*C)*(.74+.26*(1-H*H))*(.8+.2*Math.min(1,C*9))*(C>.8?.62:1);return L(b,R)});const f=(N,C,H,R,G,S=.004,F=12)=>a(F,2,(j,V)=>u(H+(R-H)*j,N+(C-N)*V,S),()=>G);f(.47,.56,.02,.98,d),f(.585,.605,.04,.96,L(d,.8)),f(.86,.97,.03,.97,d),r.mat=0,r.aux=0;for(const N of[.27,.73])f(.03,.45,N-.0035,N+.0035,L(b,.3),.003,1);f(.2,.207,.27,.73,L(b,.3),.003,6),f(0,.03,0,1,h,.004);for(let N=-2;N<=2;N++){const C=u(.5+N*.035,.1,.012);r.M.makeRotationX(-.14).setPosition(C[0],C[1],C[2]-.16),r.box(0,0,0,.03,.014,.34,h)}r.M.identity();const m=u(.5,.6,0),g=new n0(()=>0,0);g.mat=3,g.M.copy(v).setPosition(0,.035,.06),g.cyl(0,0,0,.095,.112,.18,12,o(.34,.34,.36),!1,.8,l),g.cyl(0,.18,0,.128,.128,.03,12,o(.74,.74,.76),!1),g.M.identity(),g.blob(0,.035,.07,.095,.095,.06,o(.3,.3,.32),10,4),g.mat=1,g.aux=2.6,g.blob(0,.035,-.135,.108,.108,.025,o(1,.86,.6),10,3),r.mat=3;for(const N of[-.8,.8])r.M.copy(v).setPosition(N,-1.38,-2.42),r.cyl(0,0,0,.065,.065,.34,6,o(.3,.3,.32),!1),r.M.copy(v).setPosition(N,-1.38,-2.76),r.cyl(0,0,0,.21,.2,.07,12,l,!0,.7,o(.66,.66,.68)),r.M.identity();r.mat=0;for(const N of[-1,1])r.box(N*1.62,0,-1.25,.13,1.7,.1,b,1,1,.85),r.box(N*1.553,0,-1.25,.012,1.66,.08,h),r.tube([[N*.6,-.765,-1.3],[N*.07,-.72,-1.31]],.012,4,h),r.tube([[N*.52,-.742,-1.3],[N*.03,-.697,-1.31]],.008,3,o(.02,.02,.02)),r.mat=3,r.cyl(N*.6,-.79,-1.3,.03,.03,.05,6,l),r.mat=0;r.box(0,1.1,-1.12,2.86,.2,.56,L(b,.75),1,1,.55),r.box(0,.992,-1.38,2.6,.02,.1,h);const A=new z.Mesh(r.build(),c0(t,c));A.frustumCulled=!1,A.renderOrder=6,s.add(A);const w=g.build();w.scale(.74,.74,.74);const y=new z.Mesh(w,A.material);y.frustumCulled=!1,y.renderOrder=6,y.position.set(m[0],m[1]-.035,m[2]),s.add(y);const k=new n0(()=>0,0);for(let N=0;N<25;N++){const C=N/24,H=(C-.5)*1.5,R=Math.sin(C*Math.PI);k.blob(H,.035+.05*R-.02*Math.abs(Math.sin(C*Math.PI*3)),.11*R-.03,.043,.04,.043,N%4===2?o(.74,.72,.6):o(.86,e.range(.38,.52),.03),8,5)}for(const N of[-1,1])for(let C=0;C<3;C++)k.blob(N*(.76+.012*C),0-C*.07,-.04-.03*C,.04,.045,.04,C===2?o(.6,.08,.05):o(.74,.72,.6),8,5);const M=new z.Mesh(k.build(),A.material);M.frustumCulled=!1,M.renderOrder=6,M.position.set(0,-.985,-2.2),s.add(M);const q=r0(t,i0+`
varying vec2 vUv; void main(){ vUv = uv * 2.0 - 1.0; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,l0+a0+`
varying vec2 vUv;
void main(){
  float r = length(vUv); if (r > 1.0) discard;
  vec3 col = vec3(0.025);
  if (r < 0.87) {
    vec2 q = vUv / 0.87; q.x = -q.x; q *= 1.0 + 0.45 * dot(q, q);
    vec3 d = normalize(vec3(q.x * 1.1, q.y * 1.1 - 0.06, 1.0));
    float tf = d.y < -0.01 ? -2.4 / d.y : 1e4, tr = d.y > 0.01 ? 0.75 / d.y : 1e4, tw = 3.3 / max(abs(d.x), 1e-3);
    float t = min(min(tf, tr), tw); vec3 h = d * t;
    float cell = floor((uCamS - h.z) / 3.0), side = d.x > 0.0 ? -1.0 : 1.0;
    vec4 zg = fmGap((cell + 0.5) * 3.0);
    float oL = max(fmOpenD(fmCellD(cell, -1.0)), zg.x), oR = max(fmOpenD(fmCellD(cell, 1.0)), zg.y), o = side < 0.0 ? oL : oR;
    float dayK = smoothstep(0.5, 1.5, uSunCol.g); vec3 sky = uSkyCol * mix(1.2, 2.6, dayK) + uSunCol * 0.05 * dayK, lampF = uLamp * 0.35, cloth = fmClothCol(cell, side) * (uSunCol * 0.34 + uSkyCol * 0.5 + uLamp);
    float sun = min(oL, oR);
    float sM = uCamS - h.z, inLane = step(0.0, sM) * step(sM, uLen);   // behind the cab is the lane only while it is still in it
    sun = max(sun, 1.0 - inLane);
    if (t == tr) col = mix(uSkyCol * mix(1.2, 1.3, dayK), mix(cloth, sky, smoothstep(0.35, 0.6, o) * (1.0 - smoothstep(1.2, 3.3, abs(h.x)) * (1.0 - o))), inLane);
    else if (t == tf) { float rail = 1.0 - smoothstep(0.05, 0.11, abs(abs(h.x) - 0.5));
      col = mix(vec3(0.20, 0.18, 0.15), vec3(0.6), rail) * (mix(cloth * 0.9 + uShade * 0.2, uSunCol * 0.5, sun) + lampF) * (0.7 + 0.3 * step(0.5, fract(h.z / 0.65))); }
    else { float hsh = fmH1(cell * 5.3 + side * 3.0);
      col = mix(vec3(0.03, 0.025, 0.02), fmClothCol(cell + 3.0, side) * 0.5, step(h.y, -1.2) * step(0.3, hsh)) * (mix(cloth + uShade * 0.3, uSunCol * 0.45, sun) + lampF) + vec3(1.0, 0.6, 0.25) * (0.5 + uLamp.r) * step(0.8, hsh) * step(abs(h.y + 0.2), 0.12);
      vec3 yard = mix(vec3(0.10, 0.085, 0.06) * (uSunCol * 0.5 + uSkyCol + uLamp * 1.5), uSkyCol * mix(1.2, 1.3, dayK), smoothstep(-0.6, 0.3, h.y));   // open yard or road: dark earth below, sky above
      col = mix(yard, col, inLane); }
    col = mix(col, (uPal[0] + uPal[2]) * 0.5 * (uSunCol * 0.2 + uLamp) + uShade * 0.15, smoothstep(25.0, 80.0, h.z) * inLane * (1.0 - min(zg.x, zg.y)));
    col = mix(col, col * 0.22 + uHallLamp * 0.10, step(uHall.x, sM) * step(sM, uHall.y));
    col += (uSkyCol * 0.25 * r * r + vec3(0.9) * uSunCol * 0.08 * smoothstep(0.5, 0.85, q.y - q.x * 0.5)) * max(smoothstep(0.2, 1.2, uSunCol.g), 0.25) + uLamp * 0.05 * smoothstep(0.5, 0.85, q.y - q.x * 0.5);
    // by night the glass is dark blue, with the warm streaks of the bulbs falling behind
    float nk = 1.0 - smoothstep(0.5, 1.4, uSunCol.g), bs = fract(h.z / 3.0 + 0.5) - 0.5;
    col = mix(col, col * vec3(0.22, 0.28, 0.5) + uSkyCol * 0.35 + uLamp * 0.9 * exp(-bs * bs * 60.0) * step(abs(h.y + 0.1), 0.35) * step(t, 60.0), nk);
  }
  gl_FragColor = vec4(max(col, vec3(0.0)), 1.0);
  #include <fog_fragment>
}`,{side:z.DoubleSide}),K=new z.Mesh(new z.CircleGeometry(.1,20),q);return K.position.set(-1.2,-.2,-1.44),K.lookAt(0,0,0),K.frustumCulled=!1,K.renderOrder=6,s.add(K),{object:s,mesh:A,garland:M,mirror:K,lamp:y,shift:c}}export{n0 as Batch,w0 as CAB_LIVERIES,U0 as buildCab,D0 as buildHero,_0 as buildRailcar,c0 as propMaterial};
