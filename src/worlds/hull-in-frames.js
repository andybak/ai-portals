import*as d from"three";import{makePath as at,clamp as $0,lerp as R,smoothstep as he}from"../kit/core.js";import{buildHero as nt}from"../parts/hull-in-frames.js";import*as U0 from"../kit/fauna.js";import*as R0 from"../kit/fx.js";const qo=["#3A2A20","#C8A46A","#8B8277","#FFE6A8","#8A7A50","#E8DBBE","#3FC4BE"],H0=118,Ce=.75,pe=115,ee=-500,c=(k,G,T0)=>new d.Vector3(k,G,T0),st={noon:{fog:"#93a8bc",dens:.0026,bg:"#cfd8d2",out:[1,1,1],sunOut:.3,exposure:1.09,tint:"#fff6ea",shadow:"#0a0603",sat:1.08,fauna:{sunColor:"#ffe6a8",sunIntensity:.55,sky:"#b89a70",skyIntensity:.9,ground:"#e0c08a",groundIntensity:.8},dust:[1,.86,.55],smoke:"#cdb692",portal:"#ffe6a8"},amber:{fog:"#98a4b4",dens:.0025,bg:"#d2d6cc",out:[1.02,.98,.9],sunOut:.3,exposure:1.09,tint:"#fff5e6",shadow:"#0a0604",sat:1.06,fauna:{sunColor:"#ffdc9a",sunIntensity:.6,sky:"#b89a70",skyIntensity:.9,ground:"#e0be88",groundIntensity:.8},dust:[1,.8,.46],smoke:"#cdb692",portal:"#ffe0a0"},rain:{fog:"#7f8a88",dens:.0027,bg:"#aebdc2",out:[.62,.74,.78],sunOut:.16,exposure:1.15,tint:"#eef6ff",shadow:"#04070a",sat:1,fauna:{sunColor:"#d8ecff",sunIntensity:.45,sky:"#8ea2a8",skyIntensity:.9,ground:"#9a9a8c",groundIntensity:.6},dust:[.8,.92,1],smoke:"#aab4b4",portal:"#cfeaff"},night:{fog:"#141c38",dens:.0021,bg:"#070b1c",out:[.035,.06,.13],sunOut:.05,exposure:1.25,tint:"#e6ecff",shadow:"#030512",sat:1,fauna:{sunColor:"#b8ccff",sunIntensity:1.15,sky:"#4a5a9a",skyIntensity:1.25,ground:"#2a3460",groundIntensity:.9},dust:[.6,.72,1],smoke:"#3c4a7c",portal:"#9fc0ff"}},it=`
#include <fog_pars_vertex>
attribute vec3 aCol;
uniform float uTime;
uniform float uStir;
varying vec3 vCol; varying vec2 vUv; varying vec3 vWp; varying vec3 vWn;
void main() {
  vec3 pos = position;
  // uStir: hanging things (mats, fringe) breathe; uv.y = 0 at the fixed edge
  float k = uStir * uv.y;
  pos.z += k * (0.5 * sin(uTime * 0.7 + position.x * 0.07) + 0.25 * sin(uTime * 1.3 + position.x * 0.19 + position.y * 0.1));
  pos.x += k * 0.3 * sin(uTime * 0.9 + position.z * 0.11);
  vec4 wp = modelMatrix * vec4(pos, 1.);
  vWn = normalize(mat3(modelMatrix) * normal);
  vCol = aCol; vUv = uv; vWp = wp.xyz;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,j0=`
float sHash(vec2 p) { p = fract(p * vec2(0.1031, 0.1030) + 0.019); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.y); }
float sNoise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(sHash(i), sHash(i + vec2(1., 0.)), f.x), mix(sHash(i + vec2(0., 1.)), sHash(i + vec2(1., 1.)), f.x), f.y);
}
float sFbm(vec2 p) { return sNoise(p) * 0.55 + sNoise(p * 2.3 + 7.1) * 0.3 + sNoise(p * 5.9 + 3.3) * 0.15; }
`,rt=k=>`
#include <fog_pars_fragment>
${k}
${j0}
uniform vec3 uSand; uniform vec3 uShaving; uniform float uSunOut; uniform float uPock; uniform vec4 uSpill; uniform vec3 uSpillCol; uniform float uPool;
varying vec3 vWp;
void main() {
  vec3 p = vWp;
  float dist = length(cameraPosition - p);
  float fine = 1. - smoothstep(70., 220., dist);
  float big = sFbm(p.xz * 0.02);
  float rph = p.x * 1.1 + sNoise(p.xz * 0.11) * 5. + p.z * 0.25;
  float rip = sin(rph) * 0.5 + 0.5;
  float relief = cos(rph) * fine * (0.6 + 0.4 * sNoise(p.xz * 0.37 + 5.));      // the side of each ripple that faces the light
  vec3 alb = uSand * (0.8 + 0.3 * big) * (1. - 0.12 * rip * fine);
  // footprints: an oval dimple in one cell out of three, in wandering trails
  vec2 g = p.xz / 2.6; vec2 c = floor(g); vec2 f = fract(g) - 0.5;
  float h = sHash(c + 3.1);
  float trail = smoothstep(0.52, 0.6, sNoise(c * 0.21 + 9.));
  float ang = sHash(c + 17.) * 6.2832;
  vec2 r = vec2(cos(ang) * f.x + sin(ang) * f.y, -sin(ang) * f.x + cos(ang) * f.y);
  float fl = length(r * vec2(2.6, 5.5));
  float foot = (1. - smoothstep(0.5, 1., fl)) * step(h, 0.55) * trail;
  float lip = smoothstep(0.7, 1., fl) * (1. - smoothstep(1., 1.4, fl)) * step(h, 0.55) * trail * (0.5 + 0.5 * r.y / max(fl, 0.2));
  alb *= 1. - 0.34 * foot * fine;
  relief += 1.1 * lip * fine;
  // rain pocks
  vec2 g2 = p.xz / 0.9; vec2 f2 = fract(g2) - 0.5;
  alb *= 1. - uPock * 0.25 * fine * (1. - smoothstep(0.1, 0.3, length(f2 + (sHash(floor(g2)) - 0.5) * 0.4)));
  // shavings: pale curls drifted along the keel and under the walks
  float inHull = smoothstep(46., 30., abs(p.x)) * smoothstep(20., -10., p.z) * smoothstep(-470., -440., p.z);
  float drift = smoothstep(0.42, 0.75, sFbm(p.xz * 0.045 + 31.)) * inHull;
  float curl = step(0.6, sNoise(p.xz * 1.7)) * step(0.45, sNoise(p.xz * 4.3 + 5.));
  alb = mix(alb, uShaving * (0.75 + 0.5 * sHash(floor(p.xz * 1.3))), clamp(drift * (0.35 + 0.65 * curl * fine), 0., 1.));
  alb = mix(alb, alb * alb * 0.9, uWetAll * 0.5);
  // contact shade: the hull overhead, the keel, the post rows
  float ao = 1. - 0.5 * inHull * smoothstep(40., 4., abs(p.x));
  float pz = abs(fract((p.z - 10.) / 30.) - 0.5) * 30.;
  float px = min(abs(abs(p.x) - 60.), abs(abs(p.x) - 88.));
  ao *= 1. - 0.5 * (1. - smoothstep(1.5, 6., length(vec2(px, pz))));
  float outside = max(smoothstep(87., 93., abs(p.x)), smoothstep(${pe}.0 + 2., ${pe}.0 + 8., p.z));
  float coin = hifCoin(p);
  vec3 nUp = vec3(0., 1., 0.);
  // beyond the eaves: white sand in full sun, dappled by the palms that stand over it, rippled
  vec3 sunW = mix(uCoinCol, vec3(dot(uCoinCol, vec3(0.3, 0.5, 0.2))) * vec3(1.05, 1.0, 0.92), 0.65);
  float palmSh = smoothstep(0.38, 0.62, sFbm(p.xz * 0.055 + vec2(0.7 * sin(uTime * 0.4 + p.z * 0.03), 0.))) ;
  float beach = step(0., p.x) * smoothstep(-140., -165., p.z);
  float dap = mix(1., 0.42 + 0.58 * palmSh, smoothstep(92., 104., abs(p.x)) * (1. - 0.6 * beach));
  vec3 col = alb * (hifShade(nUp, p) * ao * 0.62 * (1. + 0.1 * relief) + (uCoinCol * coin * (1. - outside) * (1. + 0.3 * relief) + sunW * outside * uSunOut * dap * (1. + 0.45 * relief)) * uSunDir.y);
  col += uGlaze * (1.0 + coin * 5.);
  // the gap in the mat screen: a soft cool pool on the sand in front of it
  float sp = smoothstep(uSpill.x - 9., uSpill.x + 4., p.x) * (1. - smoothstep(uSpill.y - 4., uSpill.y + 9., p.x)) * step(uSpill.z, p.z) * exp(-max(p.z - uSpill.z, 0.) * uSpill.w);
  col += alb * uSpillCol * sp;
  // the bending fire: a warm pool on the sand round the trough, breathing with the embers
  vec3 dE = p - vec3(6., 0., clamp(p.z, 27., 73.));
  col += alb * uEmber * uPool * exp(-dot(dE, dE) / 85.) * (0.82 + 0.18 * sin(uTime * 1.3 + sNoise(p.xz * 0.3) * 6.));
  vec3 v = normalize(cameraPosition - p);
  float fres = 1. - max(v.y, 0.); fres *= fres; fres *= fres;
  col += uWetAll * uFillUp * 0.5 * fres;
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}
`,lt=k=>`
#include <fog_pars_fragment>
${k}
${j0}
uniform vec3 uThatch; uniform float uHoleGain;
varying vec3 vWp; varying vec2 vUv;
void main() {
  vec3 p = vWp;
  float row = fract(vUv.y / 2.4);
  float fib = sNoise(vec2(p.z * 2.1, vUv.y * 0.6)) * 0.6 + sNoise(vec2(p.z * 0.31, vUv.y * 0.2)) * 0.4;
  vec3 alb = uThatch * (0.55 + 0.6 * fib) * (0.72 + 0.4 * row);
  alb *= 1. - 0.5 * smoothstep(0.42, 0.5, abs(fract(p.z / 7.5) - 0.5));          // rafter shadow lines
  float glow = 0.5 + 0.5 * smoothstep(60., 0., abs(p.x) - 30.);                   // bounce is strongest over the nave
  vec3 col = alb * uFillDown * 0.4 * glow;
  // light seeping through the thatch between rows
  col += uCoinCol * 0.012 * uThatch * smoothstep(0.75, 1., sNoise(vec2(p.z * 0.9, vUv.y * 0.42 + 3.)));
  float cell = max(uRoof.z, 0.1);
  vec2 uv = vec2(p.x * 1.25, p.z) / cell;
  vec2 base = floor(uv - 0.5);
  float aa = max(length(fwidth(uv)) * 1.1, 1e-4);
  float acc = 0.;
  for (int j = 0; j < 2; j++) {
    for (int i = 0; i < 2; i++) {
      vec4 hole = hifHole(base + vec2(float(i), float(j)));
      float rr = (0.12 + 0.42 * hole.z) / cell;
      float d = length(uv - hole.xy);
      // energy kept when a hole is under a pixel: wider and dimmer
      float w = max(rr, aa);
      acc = max(acc, hole.w * (1. - smoothstep(w * 0.55, w * 1.15, d)) * min(1., (rr * rr) / (w * w) * 2.5));
    }
  }
  col += uCoinCol * acc * uHoleGain;
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}
`,ct=`
#include <fog_pars_vertex>
attribute vec3 aCol;
uniform float uTime; uniform float uStir;
varying vec3 vCol; varying vec2 vUv; varying vec3 vWp; varying vec3 vWn; varying vec2 vWH;
void main() {
  vec3 pos = position;
  float id = aCol.g, front = 1. - aCol.b;
  float W = max(normal.x, 1.), Hh = max(normal.y, 1.);
  float gust = 0.6 * sin(uTime * 0.8 - position.x * 0.045 + id * 6.283) + 0.3 * sin(uTime * 1.7 + position.x * 0.11 + id * 17.);
  float amp = (normal.z + uStir * gust) * front;
  float su = sin(3.14159 * uv.x), cu = cos(3.14159 * uv.x);
  float prof = uv.y * (0.35 + 0.65 * uv.y);
  float flut = uStir * 0.22 * front * uv.y * sin(uTime * 1.9 + position.y * 0.6 + id * 9. + uv.x * 5.);
  pos.z += amp * su * prof + flut;
  vec3 nrm = normalize(vec3(-(amp * 3.14159 / W * cu * prof + flut * 0.5), amp * su * (0.35 + 1.3 * uv.y) / Hh, 1.));
  vec4 wp = modelMatrix * vec4(pos, 1.);
  vWn = normalize(mat3(modelMatrix) * nrm);
  vCol = aCol; vUv = uv; vWp = wp.xyz; vWH = vec2(W, Hh);
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,ft=k=>`
#include <fog_pars_fragment>
${k}
${j0}
uniform vec3 uOut; uniform vec3 uMat; uniform vec3 uSkyC; uniform vec4 uSlot; uniform vec3 uSpillCol; uniform float uMatGain;
varying vec3 vWp; varying vec2 vUv; varying vec3 vCol; varying vec3 vWn; varying vec2 vWH;
// one strip of an unevenly cut plait: x in strips -> (which strip, 0..1 across it); the edges are jittered by a hash
vec2 mStrip(float x, float salt) {
  float i = floor(x);
  float e0 = i + (sHash(vec2(i, salt)) - 0.5) * 0.56;
  float e1 = i + 1. + (sHash(vec2(i + 1., salt)) - 0.5) * 0.56;
  if (x < e0) { e1 = e0; i -= 1.; e0 = i + (sHash(vec2(i, salt)) - 0.5) * 0.56; }
  else if (x >= e1) { e0 = e1; i += 1.; e1 = i + 1. + (sHash(vec2(i + 1., salt)) - 0.5) * 0.56; }
  return vec2(i, clamp((x - e0) / max(e1 - e0, 1e-3), 0., 1.));
}
void main() {
  float tone = vCol.r, id = vCol.g, back = step(0.5, vCol.b), front = 1. - back;
  vec2 m = mix(vUv * vWH, vWp.xy, back);                       // metres across and down the mat (world metres on the backing)
  float hemD = mix(vWH.y - m.y, 9., back);                     // metres above the hem
  // the gap where two mats are tied back: the backing sheet is torn open there, its sides frayed
  float fy = floor(vWp.y * 2.6);
  float gl = uSlot.x + 0.4 + 2.2 * sNoise(vec2(vWp.y * 0.38, 3.)) + 0.9 * sHash(vec2(fy, 7.)) * sHash(vec2(fy, 13.));
  float gr = uSlot.y - 0.4 - 2.2 * sNoise(vec2(vWp.y * 0.38, 11.)) - 0.9 * sHash(vec2(fy, 19.)) * sHash(vec2(fy, 23.));
  if (back > 0.5 && vWp.x > gl && vWp.x < gr && vWp.y > uSlot.z && vWp.y < uSlot.w) discard;
  // the frayed hem: strands of different lengths, coarse enough to read from the nave
  float t1 = sHash(vec2(floor(m.x * 2.1), id * 91. + 3.)), t2 = sHash(vec2(floor(m.x * 7.3), id * 57. + 9.));
  if (hemD < 0.15 + 0.95 * t1 * t1 + 0.3 * t2) discard;
  // ragged sides: the outer strips have worked loose and broken off at different lengths
  float sideD = mix(min(m.x, vWH.x - m.x), 9., back);
  float t3 = sHash(vec2(floor(m.y * 1.9), id * 77. + 5.));
  if (sideD < 0.04 + 0.34 * t3 * t3) discard;
  // The plait: a twill of palm strips cut by eye, no two the same width, wandering a little, the lie of the weave
  // turning every few rows. Each strip has its own tone, is cupped (darker toward its edges) and shows its fibre,
  // so close to it is a soft pattern of uneven ribs and slanting steps, never of squares; it fades out with distance.
  vec2 wv = m + vec2(0.3 * sNoise(vec2(m.y * 0.4, id * 9. + 1.)), 0.36 * sNoise(vec2(m.x * 0.33, id * 7. + 4.)));
  vec2 ws = wv / vec2(0.34, 0.52);
  float wf = 1. - smoothstep(0.2, 0.7, fwidth(ws.x) + fwidth(ws.y));
  vec2 sx = mStrip(ws.x, id * 37. + 3.), sy = mStrip(ws.y, id * 53. + 11.);
  float lie = mod(floor(sy.x / 5. + sHash(vec2(id * 3.1, 5.)) * 5.), 2.) * 2. - 1.;
  float over = step(mod(sx.x + lie * sy.x, 4.), 1.5);
  over = abs(over - step(0.88, sHash(vec2(sx.x * 1.7 + 3., sy.x * 1.3) + id * 5.)));      // a strip missed here and there
  float across = mix(sy.y, sx.y, over);
  float cup = 1. - 0.24 * smoothstep(0.3, 1., abs(across - 0.5) * 2.);
  float stripTone = mix(0.95 + 0.12 * sHash(vec2(sy.x, id * 3. + 7.)), 0.86 + 0.28 * sHash(vec2(sx.x, id * 3. + 1.)), over);
  float fibre = 0.93 + 0.14 * sNoise(mix(vec2(wv.x * 1.1, wv.y * 17.), vec2(wv.x * 21., wv.y * 0.9), over));
  float big = sFbm(m * 0.13 + id * 37.);                         // stains, and where the weave is looser
  vec3 alb = uMat * (0.86 + 0.24 * tone) * (0.78 + 0.44 * big);
  alb = mix(alb, alb * vec3(0.84, 1.03, 0.76), step(0.72, sHash(vec2(id * 13.7, 2.))) * 0.6);      // a few fresher, greener mats
  alb *= mix(0.93, stripTone * cup * fibre, wf);
  // sun-bleached where it has hung longest, darker in the damp near the hem
  alb *= 1. + 0.2 * (sNoise(vec2(m.x * 0.21 + id * 5., m.y * 0.09)) - 0.5);
  float v01 = clamp(m.y / max(vWH.y, 1.), 0., 1.);
  float tuck = mix(0.4 + 0.6 * smoothstep(0., 0.2, v01), 0.5, back);     // each row is in the shade of the one above
  float high = 1. - 0.55 * smoothstep(30., 140., vWp.y);                // the gable falls away into the dark of the roof
  vec3 n = normalize(vWn);
  // hanging folds, lit from the port eave: each bellied mat is paler on the side that turns to the light
  n = normalize(n + vec3(0.2 * cos(m.x * 1.7 + id * 31.) * (0.3 + 0.7 * v01) * front, 0., 0.));
  vec3 col = alb * hifShade(n, vWp) / max(hifFormK(n), 0.3) * 0.5 * tuck * high * clamp(1. - 1.5 * n.x, 0.5, 1.6) * uMatGain;
  float coin = hifCoin(vWp);
  col += alb * uCoinCol * coin * (0.05 + max(dot(n, uSunDir), 0.)) * 0.7 * front;
  // daylight through the weave: cool where it is loose, warm at the thin hem
  float loose = smoothstep(0.42, 0.8, big);
  col += uSkyC * uOut * (0.007 + 0.02 * loose) * high * (1. - 0.5 * back);
  col += uCoinCol * uOut * alb * 0.07 * smoothstep(2.4, 0.4, hemD);
  // pricks of day where the weave gapes; they wink as the mat moves
  vec2 pg = m / 1.7; vec2 pc = floor(pg);
  float h = sHash(pc + id * 51. + 41.);
  vec2 off = (vec2(sHash(pc + 7.3), sHash(pc + 19.1)) - 0.5) * 0.6;
  float aa = max(length(fwidth(pg)) * 1.2, 1e-4);
  float rr = 0.05 + 0.07 * sHash(pc + 3.);
  float wr = max(rr, aa);
  float d = length(fract(pg) - 0.5 - off);
  float tw = 0.55 + 0.45 * sin(uTime * (0.7 + h * 9.) + h * 40. + vWp.z * 3.);
  float prick = step(0.9, h) * (1. - smoothstep(wr * 0.5, wr * 1.1, d)) * min(1., rr * rr / (wr * wr) * 3.);
  col += uCoinCol * uOut * prick * tw * 0.42;
  // the lagoon's light spilling round the edges of the gap onto the mats beside it
  vec2 dS = vec2(max(max(uSlot.x - vWp.x, vWp.x - uSlot.y), 0.), max(max(uSlot.z - vWp.y, vWp.y - uSlot.w), 0.));
  col += uSpillCol * (alb * 3. + 0.02) * exp(-length(dS) * 0.17) * (0.35 + 0.65 * front);
  col += uGlaze * 1.2;
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}
`,ut=k=>`
#include <fog_pars_fragment>
${k}
${j0}
uniform vec3 uOut; uniform vec3 uGreen; uniform vec3 uTurq; uniform vec3 uSkyC; uniform vec3 uSandC; uniform float uFogKeep; uniform float uSeaGain; uniform float uSlotGain; uniform float uRainSky;
varying vec3 vWp; varying vec2 vUv; varying vec3 vCol; varying vec3 vWn;
// The sky, by the direction looked in, so it is one sky behind the palms and beyond the lagoon: pale at the horizon,
// blue above, slow heaps of cloud standing on the horizon. Between showers (uRainSky) it is rinsed grey-white, and a
// dark shower hangs slanting from the cloud base out over the lagoon.
vec3 hifSkyAt(vec3 vd) {
  float el = vd.y / max(length(vd.xz), 1e-3);
  float az = atan(vd.x + 1e-5, -vd.z);
  float h = el * 1000.;
  vec3 s2 = mix(uSkyC * vec3(1.06, 1.03, 0.96), uSkyC * vec3(0.42, 0.68, 1.0), smoothstep(0., 330., h)) * 0.8;
  float cl = sFbm(vec2(az * 3.6 + uTime * 0.0035, h * 0.011)) * 0.7 + 0.3 * sFbm(vec2(az * 12. - uTime * 0.005, h * 0.03 + 4.));
  float heap = smoothstep(0.5, 0.7, cl + 0.22 * smoothstep(170., 30., h) - 0.25 * smoothstep(150., 330., h));
  s2 = mix(s2, mix(uSkyC * vec3(0.78, 0.82, 0.9), vec3(1.02, 1.0, 0.95), smoothstep(0.5, 0.9, cl + (h - 60.) * 0.002)) * 0.86, heap * 0.9);
  vec3 wash = vec3(1.36, 1.17, 1.12) * (0.84 + 0.2 * cl + 0.1 * smoothstep(0., 260., h));
  wash = mix(wash, vec3(0.92, 0.84, 0.84), heap * 0.55);
  float slant = az - el * 0.55;
  float fall = max(1. - smoothstep(0.1, 0.34, abs(slant - 0.62)), 0.7 * (1. - smoothstep(0.06, 0.2, abs(slant - 1.45))));
  fall *= (1. - smoothstep(70., 250., h)) * (0.7 + 0.3 * sNoise(vec2(slant * 46., h * 0.004 + uTime * 0.02)));
  wash = mix(wash, vec3(0.5, 0.5, 0.55), fall * 0.85);
  return mix(s2, wash, uRainSky);
}
void main() {
  vec2 uv = vUv;
  float lag = vCol.r;
  vec3 sky = hifSkyAt(normalize(vWp - cameraPosition));
  // the starboard palms end at a point: their canopy sinks to the sand over the wall's last hundred metres (uv.x 250
  // at its end), single palms standing on out of it. Where nothing grows the wall is not drawn, and the band of
  // glare painted on the wall behind it shows.
  float tk = 1.;
  if (uv.x > 240. && uv.x < 700. && lag < 0.5) tk = smoothstep(250., 345., uv.x + 26. * sNoise(vec2(uv.x * 0.045, 2.)));
  vec2 q = vec2(uv.x + 0.9 * sin(uTime * 0.5 + uv.x * 0.05) * uv.y * 0.02, uv.y);
  vec3 haze = uSkyC * vec3(0.62, 0.72, 0.62);
  // a far rank of palms, pale in the heat, behind the near one
  float topF = (74. + 12. * sFbm(vec2(uv.x * 0.021, 7.)) + 6. * abs(sin(q.x * 0.31 + 2. * sNoise(vec2(q.x * 0.04, 5.))))) * tk * tk;
  float cover = smoothstep(3., -3., uv.y - topF);
  vec3 c = mix(sky, mix(uGreen * vec3(0.5, 0.66, 0.4), haze, 0.48), cover);
  // the near canopy: masses of light and dark leaf, a soft hatching of fronds, sun-bleached, hazier with height
  float n1 = sFbm(q * vec2(0.05, 0.07) + 3.);
  float n2 = sFbm(q * vec2(0.21, 0.16) + 11.);
  float lightm = smoothstep(0.3, 0.8, n1 * 0.6 + n2 * 0.5);
  vec3 g = uGreen * mix(vec3(0.16, 0.22, 0.13), vec3(0.78, 0.86, 0.42), lightm);
  g *= 0.8 + 0.4 * sNoise(vec2(q.x * 0.9 + q.y * 0.6 * sign(n2 - 0.5), q.y * 0.25 + 0.3 * sin(uTime * 0.6 + q.x * 0.1)));
  g = mix(g * vec3(1.0, 1.08, 0.9), haze, 0.14 + 0.26 * smoothstep(30., 75., uv.y));
  float gap = smoothstep(0.6, 0.78, sFbm(q * vec2(0.06, 0.05) + 2.)) * smoothstep(34., 58., uv.y);
  float top = (58. + 13. * sFbm(vec2(uv.x * 0.018, 3.))) * tk;
  // palm heads standing out of the canopy: a burst of drooping fronds on each trunk
  float cellT = floor(q.x / 17.);
  float hx = sHash(vec2(cellT, 3.)), hx2 = sHash(vec2(cellT, 8.));
  float lean = (hx2 - 0.5) * 7.;
  float cx = cellT * 17. + 8.5 - (hx - 0.5) * 9. - lean * 1.24;
  float cy = mix(27. + 22. * hx, 58. + 13. * sFbm(vec2(cx * 0.018, 3.)), tk) + 2. + 5. * hx2;
  vec2 dq = vec2(q.x - cx, q.y - cy);
  float rr = length(dq);
  float ang = atan(dq.y + 0.035 * dq.x * dq.x, abs(dq.x) < 1e-3 ? 1e-3 : dq.x);
  // (no two heads alike and none a star: every frond its own length, their spacing uneven, the tuft's edge feathered)
  vec2 dirF = dq / max(rr, 1e-3);
  float flen = 0.5 + 0.55 * sNoise(dirF * 2.1 + hx * 17.);
  float feather = smoothstep(0.2, 0.75, abs(sin(ang * 6.5 + hx * 6.3 + 1.3 * sNoise(dirF * 1.6 + hx * 31.))));
  float frond = feather * smoothstep(11.5 * flen, 3. * flen, rr) * step(-0.6, ang + 0.2 * sin(hx * 40.));
  frond = max(frond, smoothstep(3.6, 1.4, rr * (0.8 + 0.4 * sNoise(dirF * 2.7 + hx * 5.)))) * step(0.04, tk);
  float edge = max(smoothstep(3., -3., uv.y - top), frond);
  // (a head that stands clear above the canopy is a far one: it sinks into the haze behind the real crowns)
  c = mix(c, mix(g * (1. - 0.25 * frond), mix(g, haze, 0.6), frond * smoothstep(-2., 4., uv.y - top)), edge * (1. - gap * (1. - frond)));
  cover = max(cover, edge * (1. - gap * (1. - frond)));
  // trunks: grey leaning lines under the crowns
  float tx = q.x - cellT * 17. - 8.5 + (hx - 0.5) * 9. + lean * (q.y / 50.);
  float trunk = (1. - smoothstep(0.45, 1.1, abs(tx))) * smoothstep(mix(cy + 1., 60., tk), mix(cy - 14., 40., tk), uv.y) * step(mix(2.5, 6., tk), uv.y) * step(0.04, tk);
  c = mix(c, uSandC * vec3(0.4, 0.37, 0.33) * (0.8 + 0.25 * sNoise(vec2(q.x * 0.4, q.y * 0.5))), trunk * mix(0.95, 0.6, tk));
  cover = max(cover, trunk);
  // banana leaves: big blades low down, some in the sun
  float bh = (21. + 12. * sFbm(vec2(uv.x * 0.05, 11.))) * tk;
  float bl = smoothstep(2., -2., uv.y - bh);
  cover = max(cover, bl);
  if (tk < 0.999 && cover < 0.5 && uv.y < 95. && uv.y > 2.5) discard;
  float blade = sNoise(vec2(q.x * 0.22 + q.y * 0.12, q.y * 0.07 + 4.)) * 0.7 + 0.3 * sNoise(vec2(q.x * 0.7 - q.y * 0.3, q.y * 0.2));
  c = mix(c, mix(uGreen * vec3(0.5, 0.86, 0.34) * (0.3 + 0.9 * blade), haze, 0.22), bl);
  // the lagoon side: LIGHT, never a view. White sand, a band of turquoise glare with moving glitter that melts upward
  // into a pale strip of sky: no line where water meets sky, no waves, no far shore
  float gl = sNoise(vec2(uv.x * 0.12 + uTime * 0.5, uv.y * 0.5)) * sNoise(vec2(uv.x * 0.07 - uTime * 0.3, uv.y * 0.4 + 9.));
  float deep = smoothstep(13., 38., uv.y);
  float melt = smoothstep(22., 47., uv.y + 4. * sNoise(vec2(uv.x * 0.021, 5.)));
  vec3 sea = mix(uTurq * (1.3 + 0.5 * deep), vec3(0.86, 1.0, 0.96), 0.3 + 0.3 * deep) * uSeaGain * 1.25 + vec3(1.0, 0.98, 0.9) * smoothstep(0.1, 0.8, gl) * 0.3 * (1. - melt);
  vec3 lc = mix(uSandC, sea, smoothstep(11., 14., uv.y + 2. * sNoise(vec2(uv.x * 0.05, 1.))));
  lc = mix(lc, mix(vec3(1.), uSkyC, 0.5) * 1.03, melt);
  c = mix(c, lc, lag);
  c = mix(c, uSandC, (1. - lag) * smoothstep(3.5, 1.5, uv.y));
  // (the wall's own sky takes no haze, like the far sky it stands for)
  float keep = uFogKeep * max(max(cover, lag), smoothstep(3.5, 1.5, uv.y));
  vec3 col = c * uOut * mix(1., uSlotGain, vCol.g);
  gl_FragColor = vec4(col, 1.);
  #ifdef USE_FOG
    float ff = 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, ff * keep);
  #endif
}
`,ht=`
#include <fog_pars_vertex>
attribute vec3 aCol;
attribute vec4 iA;        // phase, peck rate, tint, rooster flag
uniform float uTime; uniform float uWing;
varying vec3 vCol; varying vec3 vWp; varying vec3 vWn; varying float vTint; varying vec4 vOp;
void main() {
  vec3 pos = position; vec3 nrm = normal;
  float part = uv.x;       // 0 body, 1 head and neck, 2 wing, 3 tail
  vOp = vec4(position, iA.w + 2. * part);
  float t = uTime * (0.5 + iA.y) + iA.x * 6.2832;
  // peck: now and then the head goes down twice; otherwise it jerks about
  float cyc = fract(t * 0.13);
  float peck = smoothstep(0.55, 0.62, cyc) * (1. - smoothstep(0.9, 0.97, cyc)) * (0.5 + 0.5 * sin(t * 5.)) * (1. - iA.w);
  float look = 0.35 * sin(floor(t * 1.3) * 2.4 + iA.x * 9.) * (1. - peck);
  if (part > 0.5 && part < 1.5) {
    vec3 piv = vec3(0., 0.62, 0.22);
    vec3 d = pos - piv;
    float a = peck * 1.25 + 0.08 * sin(t * 2.1);
    float ca = cos(a), sa = sin(a);
    d = vec3(d.x, d.y * ca - d.z * sa, d.y * sa + d.z * ca);
    float cl = cos(look), sl = sin(look);
    d = vec3(d.x * cl + d.z * sl, d.y, -d.x * sl + d.z * cl);
    pos = piv + d;
  }
  // rooster: a wing unfolds and shakes
  if (part > 1.5 && part < 2.5) {
    float side = sign(pos.x);
    float open = uWing * iA.w * step(0., pos.x);
    vec3 piv = vec3(0.16 * side, 0.66, 0.05);
    vec3 d = pos - piv;
    float a = side * open * (0.85 + 0.22 * sin(uTime * 17.));
    float ca = cos(a), sa = sin(a);
    d = vec3(d.x * ca - d.y * sa, d.x * sa + d.y * ca, d.z);
    d.x *= 1. + open * 0.9; d.y *= 1. + open * 0.5;
    pos = piv + d;
  }
  if (part > 2.5) pos.y += 0.04 * sin(t * 2.1 + 1.) + peck * 0.12;
  pos.y += 0.02 * sin(t * 3.3) + uWing * iA.w * 0.05 * sin(uTime * 17.);
  vec4 wp = modelMatrix * instanceMatrix * vec4(pos, 1.);
  vWn = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * nrm);
  vCol = aCol; vWp = wp.xyz; vTint = iA.z;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,pt=k=>`
#include <fog_pars_fragment>
${k}
${j0}
uniform vec3 uCoatA; uniform vec3 uCoatB; uniform vec3 uCoatC;
varying vec3 vCol; varying vec3 vWp; varying vec3 vWn; varying float vTint; varying vec4 vOp;
void main() {
  vec3 n = normalize(vWn);
  if (!gl_FrontFacing) n = -n;
  float part = floor(vOp.w * 0.5 + 0.01), roo = vOp.w - 2. * part;
  // feathers: overlapping rows round the body, each row dark at its root and pale at its tip, the rows staggered
  vec2 fq = vec2(atan(vOp.x, vOp.y - 0.4) * 4.5, (vOp.z - vOp.y * 0.6) * (part > 2.5 ? 9. : 17.));
  fq.x += 0.5 * floor(fq.y);
  float row = fract(fq.y), across = abs(fract(fq.x) - 0.5) * 2.;
  float tip = smoothstep(0.55, 1., row + 0.3 * (1. - across * across) - 0.3);
  float feather = (0.66 + 0.2 * row + 0.34 * tip) * (0.9 + 0.1 * across);
  float fw = clamp(fwidth(fq.y), 0., 1.);
  feather = mix(feather, 0.86, smoothstep(0.25, 0.7, fw));
  // vCol: r = feather mask (1 = takes the coat colour), g = shade, b = comb red
  vec3 coat = vTint < 0.34 ? uCoatA : (vTint < 0.67 ? uCoatB : uCoatC);
  float sp = sNoise(vWp.xy * 3.1 + vWp.z * 2.7);
  coat *= 0.75 + 0.5 * sp;
  coat = mix(coat, vec3(0.035, 0.06, 0.05), smoothstep(0.7, 0.55, vCol.g) * 0.85);              // dark tail and wing tips
  coat = mix(coat, vec3(0.8, 0.76, 0.66), step(0.67, vTint) * step(0.62, sp) * 0.8);     // speckled hens
  // the rooster: a golden hackle down his neck, a green-black tail
  coat = mix(coat, vec3(0.9, 0.5, 0.1) * (0.7 + 0.5 * row), roo * step(0.5, part) * step(part, 1.5) * smoothstep(0.9, 0.62, vOp.y));
  coat = mix(coat, vec3(0.02, 0.07, 0.05), roo * step(2.5, part) * 0.9);
  vec3 alb = mix(vec3(0.75, 0.6, 0.25), coat * feather, vCol.r) * vCol.g;
  alb = mix(alb, vec3(0.75, 0.07, 0.05), vCol.b);
  float coin = hifCoin(vWp);
  float ndl = max(dot(n, uSunDir), 0.);
  // round form: the belly and the side turned from the roof fall away; a coin on a back is a hot patch of light
  float form = 0.5 + 0.5 * smoothstep(-0.7, 0.55, n.y);
  vec3 col = alb * (hifShade(n, vWp) * form + uCoinCol * coin * (0.45 + 0.75 * ndl)) + uGlaze * (0.6 + coin * 4.);
  // a dull gloss on feathers turned to the roof, green on the dark tail
  float upf = n.y * 0.5 + 0.5;
  col += vCol.r * (uFillUp * 0.06 * upf * upf * tip + step(2.5, part) * vec3(0.01, 0.05, 0.035) * upf);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}
`,vt=`
#include <fog_pars_vertex>
attribute vec3 aCol;
attribute vec4 iA;        // phase, rate, coat, lying flag
uniform float uTime;
varying vec3 vCol; varying vec3 vWp; varying vec3 vWn; varying float vTint; varying vec3 vOp;
void main() {
  vec3 pos = position; vec3 nrm = normal;
  float part = uv.x;
  float lying = iA.w;
  float t = uTime * (0.6 + 0.5 * iA.y) + iA.x * 40.;
  // now and then the head goes down to nose at the bark and comes up chewing; between times it looks about
  float cyc = fract(t * 0.045 + iA.x);
  float down = smoothstep(0.5, 0.6, cyc) * (1. - smoothstep(0.86, 0.96, cyc)) * (1. - lying);
  float look = 0.5 * sin(t * 0.31 + iA.x * 9.) * sin(t * 0.17 + 2.) * (1. - down);
  if (part > 0.5 && part < 1.5) {
    vec3 piv = vec3(0., 0.56, 0.3);
    vec3 d = pos - piv;
    float a = down * 1.0 + 0.035 * sin(t * 5.3) + 0.03 * sin(t * 0.7);
    float ca = cos(a), sa = sin(a);
    d = vec3(d.x, d.y * ca - d.z * sa, d.y * sa + d.z * ca);
    nrm = vec3(nrm.x, nrm.y * ca - nrm.z * sa, nrm.y * sa + nrm.z * ca);
    float cl = cos(look), sl = sin(look);
    d = vec3(d.x * cl + d.z * sl, d.y, -d.x * sl + d.z * cl);
    nrm = vec3(nrm.x * cl + nrm.z * sl, nrm.y, -nrm.x * sl + nrm.z * cl);
    pos = piv + d;
  }
  if (part > 2.5) pos.x += 0.04 * sin(t * 7.) * smoothstep(0.6, 1., sin(t * 0.9 + iA.x * 5.));
  if (part < 0.5) pos.x *= 1. + 0.025 * sin(t * 1.6);
  // lying: the legs folded flat under the body, which rests on the log
  float leg = step(1.5, part) * step(part, 2.5);
  pos.y = mix(pos.y, mix(pos.y - 0.235, pos.y * 0.2 + 0.03, leg), lying);
  vec4 wp = modelMatrix * instanceMatrix * vec4(pos, 1.);
  vWn = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * nrm);
  vCol = aCol; vWp = wp.xyz; vTint = iA.z; vOp = position;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,dt=k=>`
#include <fog_pars_fragment>
${k}
${j0}
varying vec3 vCol; varying vec3 vWp; varying vec3 vWn; varying float vTint; varying vec3 vOp;
void main() {
  vec3 n = normalize(vWn);
  if (!gl_FrontFacing) n = -n;
  // vCol: r = coat mask (0 = horn, hoof), g = shade, b = dark. Five coats: white, cream, tan, near black, pied.
  vec3 coat = vTint < 0.2 ? vec3(0.5, 0.47, 0.4) : (vTint < 0.4 ? vec3(0.5, 0.4, 0.28) : (vTint < 0.6 ? vec3(0.4, 0.26, 0.15) : (vTint < 0.8 ? vec3(0.12, 0.095, 0.08) : vec3(0.5, 0.47, 0.41))));
  float pied = smoothstep(0.5, 0.56, sNoise(vOp.zy * 4.2 + vTint * 37.));
  coat = mix(coat, vec3(0.1, 0.075, 0.06), pied * step(0.8, vTint));
  float eel = (1. - smoothstep(0.015, 0.04, abs(vOp.x))) * step(0.55, vOp.y) * step(0.2, vTint) * step(vTint, 0.6);
  coat = mix(coat, coat * 0.35, eel);
  // a marked face (dark cheeks either side of a pale blaze), dark stockings, a paler belly; long hair in locks
  float face = step(0.43, vOp.z) * step(0.69, vOp.y);
  coat = mix(coat, coat * 0.36, face * smoothstep(0.022, 0.045, abs(vOp.x)) * (1. - smoothstep(0.86, 0.9, vOp.y)) * step(vTint, 0.6) * 0.8);
  coat = mix(coat, vec3(0.5, 0.47, 0.4), face * (1. - smoothstep(0.012, 0.03, abs(vOp.x))) * step(0.6, vTint) * step(vTint, 0.8) * 0.8);
  coat = mix(coat, coat * 0.42, (1. - smoothstep(0.1, 0.24, vOp.y)) * step(0.2, vTint) * (1. - face));
  coat *= 0.72 + 0.56 * sNoise(vec2(vOp.z * 23. + vOp.x * 9., vOp.y * 4.5 + vOp.z * 2.));
  vec3 alb = mix(vec3(0.4, 0.36, 0.31), coat, vCol.r) * vCol.g;
  alb = mix(alb, vec3(0.045, 0.038, 0.034), vCol.b);
  float coin = hifCoin(vWp);
  float ndl = max(dot(n, uSunDir), 0.);
  // lit from above and from the open side: backs and flanks toward the eaves catch the day, bellies and far flanks fall off
  float form = mix(0.34, 1.12, smoothstep(-0.75, 0.5, n.y)) * (0.78 + 0.34 * max(n.x, 0.));
  vec3 col = alb * (hifShade(n, vWp) * form + uCoinCol * coin * (0.2 + 0.4 * ndl)) + uGlaze * (0.6 + coin * 4.);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}
`,mt=`
attribute vec4 aSeed;
uniform float uTime; uniform vec3 uCam; uniform vec3 uBox; uniform float uPx; uniform float uSize;
varying float vSeed; varying vec3 vWp; varying float vFade;
void main() {
  vec3 p = position * uBox;
  p += vec3(sin(uTime * 0.21 + aSeed.x * 40.), sin(uTime * 0.17 + aSeed.y * 40.) * 0.6 - uTime * 0.12 * (0.3 + aSeed.z), cos(uTime * 0.19 + aSeed.z * 40.)) * 1.6;
  p = mod(p - uCam + uBox * 0.5, uBox) - uBox * 0.5 + uCam;
  p.y = max(p.y, 0.3);
  vec4 mv = viewMatrix * vec4(p, 1.);
  float d = max(-mv.z, 0.1);
  vFade = smoothstep(1.5, 5., d) * (1. - smoothstep(uBox.z * 0.38, uBox.z * 0.5, d));
  vSeed = aSeed.w; vWp = p;
  gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp(uSize * (0.5 + aSeed.w) * uPx / d, 1.5, 9.);
}
`,gt=k=>`
${k}
uniform vec3 uDustCol; uniform float uDustGain;
varying float vSeed; varying vec3 vWp; varying float vFade;
void main() {
  vec2 q = gl_PointCoord - 0.5;
  float a = 1. - smoothstep(0.1, 0.5, length(q));
  float coin = hifCoin(vWp);
  float tw = 0.6 + 0.4 * sin(uTime * (2. + vSeed * 5.) + vSeed * 60.);
  vec3 col = uDustCol * (0.035 + coin * 1.5 * tw) * uDustGain;
  gl_FragColor = vec4(col * a * vFade, 0.);
}
`,xt=k=>`
#include <fog_pars_fragment>
${k}
uniform float uSunOut; uniform float uBack;
varying vec3 vCol; varying vec3 vWp; varying vec3 vWn; varying vec2 vUv;
void main() {
  vec3 n = normalize(vWn);
  if (!gl_FrontFacing) n = -n;
  float coin = hifCoin(vWp);
  float rib = 0.8 + 0.2 * smoothstep(0.02, 0.1, abs(fract(vUv.x * 6.) - 0.5));
  vec3 col = vCol * rib * (hifShade(n, vWp) + uCoinCol * coin * (0.35 + 0.65 * abs(dot(n, uSunDir))));
  float outside = smoothstep(86., 92., abs(vWp.x));
  col += vCol * uCoinCol * uSunOut * uBack * outside * 0.5;
  col += uGlaze * (0.8 + coin * 4.);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}
`,yt=k=>`
#include <fog_pars_fragment>
${k}
${j0}
uniform float uSunOut; uniform float uBack;
varying vec3 vCol; varying vec3 vWp; varying vec3 vWn; varying vec2 vUv;
void main() {
  vec3 n = normalize(vWn);
  if (!gl_FrontFacing) n = -n;
  float coin = hifCoin(vWp);
  float dist = length(vWp - cameraPosition);
  float h = vWp.x * 0.83 + vWp.z;
  float nearK = 1. - smoothstep(18., 60., dist);
  float weave = 0.5 + 0.25 * sin(vWp.y * 31.) + 0.25 * sin(h * 31.);
  float slub = sNoise(vec2(h * 0.7, vWp.y * 6.)) * 0.6 + sNoise(vec2(h * 8., vWp.y * 0.6)) * 0.4;
  float fold = 0.5 + 0.5 * sin(h * 3.9 + 2.6 * sNoise(vec2(h * 0.35, vWp.y * 0.12 + 3.)));
  float bleach = smoothstep(0.35, 0.8, sFbm(vec2(h * 0.09, vWp.y * 0.13) + 7.));
  vec3 alb = vCol * (0.8 + 0.36 * slub) * (1. + nearK * 0.24 * (weave - 0.5));
  float lum = dot(alb, vec3(0.3, 0.55, 0.15));
  alb = mix(alb, mix(alb, vec3(lum) * vec3(1.12, 1.04, 0.9), 0.55) * 1.3 + 0.025, bleach * 0.55);
  alb *= 0.62 + 0.48 * fold;
  vec3 col = alb * (hifShade(n, vWp) / max(hifFormK(n), 0.3) + uCoinCol * coin * (0.35 + 0.65 * abs(dot(n, uSunDir))));
  float outside = smoothstep(86., 92., abs(vWp.x));
  col += alb * uCoinCol * uSunOut * uBack * outside * 0.5;
  col += uGlaze * (0.8 + coin * 4.);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}
`;var At={id:"hull-in-frames",name:"Ribs of the Unfinished Ship",category:"interior",weirdness:.05,media:["interior","cable"],async build(k){const G=k.rng,T0=k.quality?.detail??1,Ke=k.vary||{},Xe=Ke.density??1,go=[],Fe=Ke.hour||"any",Oo=(k.seed>>>0)%9;let _0=["noon","amber","rain","noon","night","amber","rain","noon","night"][Oo];Fe==="night"?_0="night":Fe==="dawn"||Fe==="golden"?_0="amber":Fe==="day"&&_0==="night"&&(_0="noon");const L0=_0==="amber",x0=st[_0],B=_0==="night",o0=_0==="rain",Qe=G.fork("swaps"),ve=Qe.chance(.35),Uo=Qe.chance(.4),xo=L0,Ro=L0||B&&Uo&&!ve,q=qo.map(e=>new d.Color(e)),X=new d.Scene;X.background=new d.Color(x0.bg).multiplyScalar(B?1:.9),X.fog=new d.FogExp2(new d.Color(x0.fog),x0.dens);const C0=()=>d.UniformsUtils.clone(d.UniformsLib.fog),P0={value:0};await k.yield();const yo=[[6,24,85],[6.5,24,55],[9,24,25],[9.5,26,-5],[9.5,30,-35],[9.5,34,-65],[9.5,32.5,-125],[9.5,31,-190],[9.5,31.5,-250],[8,33,-300],[0,34,-345],[-7.5,34,-374],[-9.5,34,-392],[-9.5,34,-420],[-9.5,34,-446]],S0=at(yo),Ho=B&&Qe.chance(.5)?"palm":"frangipani",bo={palette:qo,path:yo,garland:Ho,rope:[[6,42,100],[4.3,42.6,25],[2.2,52.6,-65],[-.7,49.6,-190],[-4.3,52.6,-345],[-6,52,-420]],ride:{left:4,down:5,ahead:10,rise:4}},Ye=!(o0||B),Ze=Ye&&ve,We=[.46,.82,.32],wo=[[3,22,62,12,.5],[20,30,-258,10,.55]],f0=await nt(k,Ye?{...bo,look:"noon",teak:ve,paleRibs:ve,day:!0,newRibs:L0?19:0,thin:wo,sun:L0?We:null}:{...bo,look:_0,thin:wo});X.add(f0.object);const Io=f0.carried,H=f0.light.uniforms,M0=f0.light.glsl,w=f0.tools,t0=f0.anchors,N=w.C;H.uRoof.value.x=H0,H.uRoof.value.y=Ce,B&&(H.uGlaze.value.setRGB(.011,.018,.046),H.uFillUp.value.multiplyScalar(.62),H.uFillDown.value.multiplyScalar(.62)),o0&&(H.uFillUp.value.multiplyScalar(1.9),H.uFillDown.value.multiplyScalar(1.9),H.uWetAll.value=.7),L0&&(H.uSunDir.value.set(We[0],We[1],We[2]).normalize(),H.uCoinCol.value.setRGB(5.7,4.25,2.2)),L0&&(H.uFillUp.value.setRGB(.5,.6,.64),H.uFillDown.value.setRGB(.9,.68,.42)),Ye&&!ve&&(H.uFillUp.value.multiplyScalar(1.28),H.uFillDown.value.multiplyScalar(1.28));const Je=f0.materials.plain,wt=f0.materials.cloth,k0=(e,o=1)=>[e.r*o,e.g*o,e.b*o],_=(e,o)=>[e[0]*o,e[1]*o,e[2]*o],oe=(e,o,n)=>{const s=new d.Mesh(w.accGeometry(e),o);return s.name=n,X.add(s),s},Ae=(e,o,n={})=>new d.ShaderMaterial({vertexShader:it,fragmentShader:e,fog:!0,side:n.side??d.FrontSide,uniforms:{...C0(),...H,uStir:{value:n.stir||0},...o}});await k.yield();const i0={x0:21,x1:47,y0:22.4,y1:35.6},eo=B?new d.Color(.012,.03,.075):q[6].clone().multiplyScalar(o0?.17:.24);{const e=new d.PlaneGeometry(700,900,1,1).rotateX(-Math.PI/2).translate(0,0,-190),o=new d.ShaderMaterial({fog:!0,fragmentShader:rt(M0),vertexShader:`#include <fog_pars_vertex>
varying vec3 vWp;
void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vWp = wp.xyz; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,uniforms:{...C0(),...H,uSand:{value:q[5].clone().multiplyScalar(.6)},uShaving:{value:q[1].clone().lerp(q[3],.45).multiplyScalar(.8)},uSunOut:{value:x0.sunOut},uPock:{value:o0?1:0},uPool:{value:B?.85:o0?.26:.2},uSpill:{value:new d.Vector4(i0.x0,i0.x1,ee,.055)},uSpillCol:{value:eo}}}),n=new d.Mesh(e,o);n.name="sand",X.add(n)}const zo={uOut:{value:new d.Vector3(...x0.out)},uMat:{value:q[4].clone().lerp(q[2],.45).multiplyScalar(.56)},uGreen:{value:new d.Color("#62993a").multiplyScalar(.95)},uSeaGain:{value:B?3.2:1},uSlotGain:{value:B?.34:o0?.8:.72},uTurq:{value:q[6].clone().multiplyScalar(1.15)},uSkyC:{value:new d.Color(o0?"#b9cfd8":"#cfe6f2").multiplyScalar(1.15)},uRainSky:{value:o0?1:0},uSandC:{value:q[5].clone().multiplyScalar(1.25)}};{const e=w.makeAcc(),o=(s,t,l,a)=>{for(let h=0;h<t.length-1;h++){const f=e.n,r=t[h],g=t[h+1];for(const[p,i,u]of[[r,-2,l[h]],[g,-2,l[h+1]],[g,170,l[h+1]],[r,170,l[h]]])e.pos.push(s,i,p),e.nrm.push(s<0?1:-1,0,0),e.col.push(u,0,0),e.uv.push(p+(a?400:0),i);e.idx.push(f,f+1,f+2,f,f+2,f+3),e.n+=4}};o(-168,[220,-620],[0,0],!1),o(168,[220,-150,-215,-620],[0,0,1,1],!0),o(176,[-40,-620],[1,1],!0);{const s=e.n;for(const[t,l]of[[-168,-2],[176,-2],[176,200],[-168,200]])e.pos.push(t,l,220),e.nrm.push(0,0,-1),e.col.push(0,0,0),e.uv.push(t-1500,l);e.idx.push(s,s+1,s+2,s,s+2,s+3),e.n+=4}{const s=e.n;for(const[t,l]of[[-30,-2],[120,-2],[120,90],[-30,90]])e.pos.push(t,l,ee-40),e.nrm.push(0,0,1),e.col.push(1,1,0),e.uv.push(t+900,l-9.5);e.idx.push(s,s+1,s+2,s,s+2,s+3),e.n+=4}const n=Ae(ut(M0),{...zo,uFogKeep:{value:.38}},{side:d.DoubleSide});oe(e,n,"outside")}await k.yield();const u0=e=>H0-Ce*Math.abs(e);{const e=w.makeAcc();for(const n of[-1,1]){const s=e.n,t=98,l=Math.hypot(t,Ce*t);for(const[a,h,f]of[[0,pe+6,0],[0,ee-4,0],[n*t,ee-4,l],[n*t,pe+6,l]])e.pos.push(a,u0(a)+.6,h),e.nrm.push(-n*.6,-.8,0),e.col.push(1,1,1),e.uv.push(h,f);e.idx.push(s,s+1,s+2,s,s+2,s+3),e.n+=4}const o=Ae(lt(M0),{uThatch:{value:q[4].clone().lerp(q[0],.35)},uHoleGain:{value:B?.5:.62}},{side:d.DoubleSide});oe(e,o,"thatch")}const ko=(e,o)=>Ae(xt(M0),{uSunOut:{value:x0.sunOut},uBack:{value:o}},{side:d.DoubleSide,stir:e}),oo=[],to=[],So=[];{const e=w.makeAcc(),o=G.fork("fringe"),n=k0(q[4],.9),s=[.2,.34,.08],t=(i,u,m,x,y,b,A)=>{const S=e.n,W=o(),C=[R(n[0],s[0],W*.6),R(n[1],s[1],W*.6),R(n[2],s[2],W*.6)],T=.7+.5*o();e.pos.push(i-x*A,u,m-y*A,i+x*A,u,m+y*A,i+(o()-.5)*1.5*y,u-b,m+(o()-.5)*1.5*x);for(let F=0;F<3;F++)e.nrm.push(y,.2,x),e.col.push(C[0]*T,C[1]*T,C[2]*T);e.uv.push(0,0,1,0,.5,1),e.idx.push(S,S+1,S+2),e.n+=3};for(const i of[-1,1])for(let u=pe+6;u>ee;u-=1.5)t(i*(96+o()*2),u0(97)+1+o()*1.5,u+o(),0,1,3.5+o()*4.5,.8);for(let i=-96;i<96;i+=1.5)t(i+o(),u0(i)+.4,pe+6,1,0,3+o()*4,.8);await k.yield();const l=(i,u,m,x,y,b,A,S)=>{const C=-y,T=x;for(let F=1;F<=9;F++){const M=F/9,D=i+x*b*M,V=m+y*b*M,s0=u+b*(.28*M-A*M*M);for(const U of[-1,1]){const L=e.n,r0=b*.3*(1-.55*M)*(.8+.4*o()),m0=.7+.6*o(),E=.55;e.pos.push(D-x*E,s0,V-y*E,D+x*E,s0,V+y*E,D+U*C*r0+x*r0*.35,s0-r0*(.55+.5*M),V+U*T*r0+y*r0*.35);for(let Y=0;Y<3;Y++)e.nrm.push(U*C*.5,.8,U*T*.5),e.col.push(S[0]*m0,S[1]*m0,S[2]*m0);e.uv.push(0,.3*M,1,.3*M,.5,.4+.6*M),e.idx.push(L,L+1,L+2),e.n+=3}}};for(let i=0;i<22;i++){const u=i&1?1:-1,m=96-i*9-o()*6,x=u*(104+o()*6),y=.75+.5*o();l(x,36+o()*12,m,-u*(.75+.2*o()),(o()-.5)*.9,13+o()*6,.5+.3*o(),[.16*y,.36*y,.07*y])}const a=G.fork("palms"),h=B?[.3,.4,.6]:o0?[.42,.5,.5]:[.5,.6,.46],f=(i,u,m,x,y,b,A,S)=>{const C=-y,T=x,F=e.n;for(let M=0;M<=4;M++){const D=M/4,V=b*D*(1-.25*D),s0=A*Math.sin(Math.PI*(.1+.84*D));for(const U of[-1,0,1]){const L=U===0?1.2:.8+.3*a();e.pos.push(i+x*V+U*C*s0,u+b*(.8*D-.66*D*D)-Math.abs(U)*s0*.3,m+y*V+U*T*s0),e.nrm.push(U*C*.4,.9,U*T*.4),e.col.push(S[0]*L,S[1]*L,S[2]*L),e.uv.push(.5+U*.5,.15+.6*D)}}for(let M=0;M<4;M++)for(let D=0;D<2;D++){const V=F+M*3+D,s0=V+1,U=V+3,L=U+1;e.idx.push(V,U,s0,s0,U,L)}e.n+=15};for(let i=0;i<28;i++){const u=i&1?1:-1,m=(i>>1)%3,x=u*(106+m*15+a()*9),y=112-(i>>1)*24-a()*14,b=30+m*9+a()*14,A=.12+.2*m,S=.8+.5*a(),W=[.27*S,.45*S,.1*S],C=[R(W[0],h[0],A),R(W[1],h[1],A),R(W[2],h[2],A)],T=10,F=a()*6.28;for(let M=0;M<T;M++){const D=F+M/T*6.283+(a()-.5)*.3;l(x,b,y,Math.cos(D),Math.sin(D),15+a()*7,.55+.4*a(),C)}for(let M=0;M<3;M++){const D=a()*6.28;l(x,b+1,y,Math.cos(D)*.5,Math.sin(D)*.5,11+a()*4,.1,[C[0]*1.25,C[1]*1.2,C[2]*1.1])}oo.push([x+(a()-.5)*16,x,b,y,.7+.25*a()]),(i&3)===3&&await k.yield()}for(let i=0;i<22;i++){const u=i&1?1:-1,m=u*(99+a()*9),x=108-(i>>1)*21-a()*12,y=.8+.5*a();for(let b=0;b<6;b++){const A=a()*6.28;f(m,2+a()*5,x,Math.cos(A),Math.sin(A),9+a()*5,1.5+a()*.7,[.3*y,.56*y,.11*y])}}await k.yield();const r=k.core.makeRng("hif-beach:"+k.seed);for(let i=0;i<10;i++){const u=-166-i*34-r()*16,m=96+r()*20,x=36+r()*18,y=5+r()*9,b=.85+.4*r(),A=B?[.1*b,.2*b,.16*b]:[.3*b,.52*b,.12*b],S=r()*6.28;for(let W=0;W<11;W++){const C=S+W/11*6.283+(r()-.5)*.3;l(m+y,x,u,Math.cos(C),Math.sin(C),15+r()*7,.55+.4*r(),A)}oo.push([m,m+y,x,u,.8+.25*r()]),So.push([m+y,x-1.4,u])}await k.yield();const g=k.core.makeRng("hif-point:"+k.seed);for(let i=0;i<7;i++){const u=-84-i*9.5-g()*5,m=136+i%4*13+g()*10,x=30+g()*20,y=3+g()*9,b=.8+.4*g(),A=.1+.07*(i%4),S=B?[.1*b,.2*b,.16*b]:[.28*b,.48*b,.11*b],W=[R(S[0],h[0],A),R(S[1],h[1],A),R(S[2],h[2],A)],C=g()*6.28;for(let T=0;T<10;T++){const F=C+T/10*6.283+(g()-.5)*.3;l(m+y,x,u,Math.cos(F),Math.sin(F),14+g()*7,.55+.4*g(),W)}to.push([m,m+y,x,u,.75+.25*g(),.8+.4*g()])}await k.yield();for(let i=0;i<7;i++){const u=.5+.5*r(),m=-.5+r()*1;l(-70-r()*14,24+i*6.5+r()*4,-428-r()*52,Math.cos(m)*.95,Math.sin(m)*.6,15+r()*8,.45+.4*r(),B?[.03*u,.06*u,.07*u]:[.09*u,.2*u,.05*u])}for(let i=0;i<3;i++){const u=-66-r()*10,m=-436-i*16-r()*6,x=.6+.5*r();for(let y=0;y<6;y++){const b=r()*6.28;f(u,3+r()*6,m,Math.cos(b),Math.sin(b),10+r()*6,1.6+r()*.8,B?[.05*x,.1*x,.1*x]:[.16*x,.36*x,.07*x])}}const p=k.core.makeRng("hif-wall:"+k.seed);for(const i of[-1,1]){const u=i<0?-520:-62;for(let m=118;m>u;m-=18)for(let x=0;x<2;x++){const y=m-p()*13-x*8,b=i*(146+x*10+p()*6),A=i>0?he(-75,-10,y):1,S=(50+x*13+p()*14)*(.55+.45*A),W=.3+.2*x,C=.8+.45*p(),T=B?[.1*C,.2*C,.16*C]:[.27*C,.47*C,.11*C],F=[R(T[0],h[0],W),R(T[1],h[1],W),R(T[2],h[2],W)],M=p()*6.28;for(let D=0;D<9;D++){const V=M+D/9*6.283+(p()-.5)*.3;l(b,S,y,Math.cos(V),Math.sin(V),15+p()*7,.55+.4*p(),F)}to.push([b+(p()-.5)*10,b,S,y,.8+.25*p(),.75+.3*p()]),x===1&&await k.yield()}}await k.yield(),oe(e,ko(.5,1),"fringe"),await k.yield()}await k.yield();const Z=[],h0=Ze?[k0(q[4].clone().lerp(q[2],.55).lerp(q[0],.24),.5),k0(q[2].clone().lerp(q[4],.25).lerp(q[0],.34),.52),k0(q[2].clone().lerp(q[0],.42),.46),[.066,.092,.042],[.055,.04,.03]]:[k0(q[4].clone().lerp(q[2],.4),.66),k0(q[4].clone().lerp(q[2],.75),.6),k0(q[2],.52),[.12,.15,.06],[.075,.055,.04]],y0=(e,o,n,s,t=1.8)=>Z.push(e,o-t/2,n,e,o+t/2,n,s,.075,.055,.04),de=G.fork("bamboo"),P=(e,o,n,s,t,l,a,h)=>{const f=h0[h??(de()<.6?0:de()<.6?1:de()<.7?2:3)],r=.75+.5*de();Z.push(e,o,n,s,t,l,a,f[0]*r,f[1]*r,f[2]*r)},te=(e,o,n,s,t,l,a)=>{for(let h=0;h<3;h++){const f=h*2.094+.5,r=Math.cos(f)*a*.95,g=Math.sin(f)*a*.95;P(e+r,o,n+g,s+r,t+(h-1)*1.2,l+g,a)}};for(const[e,o,n,s,t]of oo)P(e,-1,s+1,o,n+.5,s,t,2);for(const[e,o,n,s,t,l]of to)Z.push(e,-1,s+1,o,n+.5,s,t,h0[2][0]*l,h0[2][1]*l,h0[2][2]*l);const z=w.makeAcc(),p0=Ze?k0(q[2].clone().lerp(q[0],.5).lerp(q[1],.12),.9):k0(q[2].clone().lerp(q[0],.45),1),w0=N.newWood,me=N.iron,ao=N.pale;{const e=G.fork("posts"),o=[0,0,0];let n=0;for(let s=100;s>=-500;s-=30)for(const t of[-88,-60,60,88]){const l=u0(t)-.5,a=[],h=(e()-.5)*2.4,f=(e()-.5)*2.4,r=1.35+e()*.35,g=.8+e()*.45,p=6;for(let m=0;m<=p;m++){const x=m/p;a.push(c(t+h*Math.sin(x*3.1)+(e()-.5)*.5,l*x-1,s+f*Math.sin(x*2.2+1)+(e()-.5)*.5))}w.bar(z,a,1,9,(m,x)=>{const y=m/p,b=g*(.55+.45*he(0,.25,y))*(.85+.3*((x*7+m*3)%5)/5);return o[0]=p0[0]*b,o[1]=p0[1]*b,o[2]=p0[2]*b,o},{taper:m=>r*(1.25-.35*m/p+(m===0?.35:0))});const i=Math.sign(t),u=Math.abs(t)<70?.62:1;w.beam(z,c(t-i*5*u,l-9*u,s),c(t+i*.5,l-1.5,s),.7,.7,.15,_(p0,.8*g),c(0,0,1)),(++n&7)===0&&await k.yield()}for(const s of[-88,-60,60,88])for(let t=100;t>-500;t-=30)w.beam(z,c(s,u0(s)-1.6,t+2),c(s,u0(s)-1.6,t-32),.9,.9,.2,_(p0,.75+.3*e()),c(0,1,0));for(let s=115;s>-500;s-=41)w.beam(z,c(0,H0-1.4,s+2),c(0,H0-1.4,s-43),1,1,.2,_(p0,.7),c(0,1,0))}await k.yield();for(let e=112.5;e>-500;e-=7.5)for(const o of[-1,1])P(o*.5,H0-.6,e,o*97,u0(97)-.4,e+(de()-.5),.55,0);for(const e of[-74,-44,-22,22,44,74])for(let o=114;o>-500;o-=61)P(e,u0(e)-1.3,o+3,e,u0(e)-1.3,o-64,.5,1);const l0=t0.gantry.z,v0=t0.gantry.uprightX,Te=t0.gantry.barY;te(v0,-1,l0,v0,52,l0,.46),y0(v0,Te+.6,l0+.2,1.12,2.4),y0(v0,39.5,l0-.3,1.08,1.4),y0(v0,50,l0-.3,1.08,1.4),y0(v0,12,l0-.4,1.08,1.4),te(v0-3.5,Te+.6,l0+.4,5.5,Te+.6,l0+.4,.4),P(v0-9,-1,l0-3,v0-.2,40,l0-.8,.38),P(v0,50,l0-.8,v0+10,Te+1.1,l0-.8,.34),P(v0+1,12,l0-1.2,v0+1,12,l0-40,.4);const K0=t0.ridgeRope[1].y,X0=t0.ridgeRope[1].x;for(const e of[-.45,.45])P(-58,-1,-420+e,X0-.4,K0+3.5,-420+e,.44,e<0?0:1),P(44,-1,-420+e,X0+.4,K0+3.5,-420+e,.44,e<0?1:0);y0(X0,K0+1.6,-420,1.25,3),P(X0-7.4,K0-3.6,-419,X0+7.2,K0-3.6,-419,.34,1),y0(X0-6.5,K0-3.6,-419.7,.95,1.2),y0(X0+6.4,K0-3.6,-419.7,.95,1.2);{const e=G.fork("mats"),o=w.makeAcc(),n=ee+.6,s=10.4;{const i=o.n;for(const[u,m]of[[-99,-1],[99,-1],[99,H0+2],[-99,H0+2]])o.pos.push(u,m,n-1.3),o.nrm.push(1,1,0),o.col.push(.5,.37,1),o.uv.push(0,0);o.idx.push(i,i+1,i+2,i,i+2,i+3),o.n+=4}let t=0;for(let i=0;i<15;i++){const u=12.2+s*i,m=Math.min(96,(H0-(u-12.5))/Ce);if(m<4)break;const x=Math.min(97,(H0-u)/Ce+5);P(-x,u+.25+(e()-.5)*.3,n+.5,x,u+.25+(e()-.5)*.3,n+.5,.42,2);let y=-m-e()*3;for(;y<m;){const b=(6.6+e()*3.2)*(e()<.16?1.7:e()<.15?.6:1),A=i===0?11.5+e()*.6:11.7+e()*2.2,S=e()<.2?.25+e()*.5:-.2-e()*.5,W=y+b/2,C=W>i0.x0-2&&W<i0.x1+2,T=i===2&&C,F=e(),M=e(),D=.35+e()*.95,V=.3+e()*1,s0=(e()-.5)*.09,U=e()<.3?e()*.9:0,L=t%3*.14+e()*.05,r0=.2+e()*.5;if(!T){const m0=o.n,E=6,Y=5,J=i===3&&C?9.1+.5*F:A;for(let K=0;K<=Y;K++)for(let j=0;j<=E;j++){const O=j/E,$=K/Y;o.pos.push(W+(O-.5)*b+s0*$*J,u-U-$*J-4*O*(1-O)*(r0*(1-$)+V*$),n+L),o.nrm.push(b,J,D),o.col.push(F,M,0),o.uv.push(O,$)}for(let K=0;K<Y;K++)for(let j=0;j<E;j++){const O=m0+K*(E+1)+j,$=O+1,e0=O+E+1,g0=e0+1;o.idx.push(O,e0,$,$,e0,g0)}o.n+=(E+1)*(Y+1)}y+=b+S,t++}(i&3)===3&&await k.yield()}const l=i=>new d.ShaderMaterial({vertexShader:ct,fragmentShader:ft(M0),fog:!0,side:d.DoubleSide,uniforms:{...C0(),...H,...zo,uStir:{value:.55},uMatGain:{value:i},uSlot:{value:new d.Vector4(i0.x0,i0.x1,i0.y0,i0.y1)},uSpillCol:{value:eo}}}),a=l(1.15),h=l(1.5),f=w.accGeometry(o);f.boundingSphere=new d.Sphere(c(0,60,n),140);const r=new d.Mesh(f,a);r.name="mats",X.add(r);{const i=k.core.makeRng("hif-port-mats:"+k.seed),u=-306,m=-389,x=M=>Math.max(t0.halfBreadth(Math.max(M,-385),26),t0.halfBreadth(Math.max(M,-385),47))+2.7+3.4+3.2;let y=x(u)+2.2;const A=(x(-385)+2.2-y)/(-385-u);let S=0;for(let M=u;M>=-385;M-=6)S=Math.max(S,x(M)+2-(y+A*(M-u)));y+=S;const W=c(-(y+A*(m-u)),0,m),C=.21,T=28.5,F=(M,D,V,s0)=>{const U=w.makeAcc(),L=M.distanceTo(D),r0=(D.x-M.x)/L,m0=(D.z-M.z)/L,E=(O,$,e0)=>c(M.x+r0*O-m0*e0,$,M.z+m0*O+r0*e0);let Y=0;for(let O=0;O<5;O++){const $=76.2-11.9*O,e0=E(-2,$+.25,.45),g0=E(L+2,$+.25+(i()-.5)*.4-V*.5*O,.45);P(e0.x,e0.y,e0.z,g0.x,g0.y,g0.z,.36,2);let b0=-i()*2;for(;b0<L-1;){let c0=(7+i()*3.4)*(i()<.16?1.5:1);const q0=12.9+i()*1.9-V*i()*2.5,Y0=i()<.12?.15+i()*.35:-.25-i()*.5;b0+c0>L-3.5&&(c0=Math.max(L-b0+.3,3.5));const ie=b0+c0/2,re=i(),le=i(),ce=.45+i()*1+V*.5,V0=.4+i()*1.1+V*.5,je=(i()-.5)*.1,Me=i()<.3?i()*.8:0,Qo=Y%3*.14+i()*.05,Yo=.25+i()*.65,Zo=i(),Jo=Zo<.22+.3*V?.5+i()*1.3:i()*0,et=i()<.5?1:0,ot=U.n,fe=6,Le=5;for(let Z0=0;Z0<=Le;Z0++)for(let J0=0;J0<=fe;J0++){const A0=J0/fe,O0=Z0/Le,ue=et?A0:1-A0;U.pos.push(ie+(A0-.5)*c0+je*O0*q0,$-Me-O0*q0-4*A0*(1-A0)*(Yo*(1-O0)+V0*O0)-Jo*ue*ue*(1-.4*O0),Qo),U.nrm.push(c0,q0,ce),U.col.push(re,le,0),U.uv.push(A0,O0)}for(let Z0=0;Z0<Le;Z0++)for(let J0=0;J0<fe;J0++){const A0=ot+Z0*(fe+1)+J0,O0=A0+1,ue=A0+fe+1,tt=ue+1;U.idx.push(A0,ue,O0,O0,ue,tt)}U.n+=(fe+1)*(Le+1),b0+=c0+Y0,Y++}}const J=Math.max(1,Math.round(L/15.5));for(let O=0;O<=J;O++){if(V&&O===0)continue;const $=2+(L-4)*O/J,e0=E($+(i()-.5)*2,-1,-.5-i()*1.5),g0=E($,79+i()*2,.9);P(e0.x,e0.y,e0.z,g0.x,g0.y,g0.z,.42);for(let b0=0;b0<5;b0++){const c0=E($,76.4-11.9*b0,.8);y0(c0.x,c0.y,c0.z,.62,1.2)}}const K=w.accGeometry(U);K.boundingSphere=new d.Sphere(c(L/2,40,0),L*.5+45);const j=new d.Mesh(K,h);j.name=s0,j.position.copy(M),j.rotation.y=Math.atan2(-m0,r0),X.add(j)};F(c(-y,0,u),W,0,"port-mats"),F(W.clone(),c(W.x-Math.sin(C)*T,0,W.z-Math.cos(C)*T),1,"port-mats-return")}for(const i of[-30,0,30]){const u=u0(i)-1,m=[];for(let x=0;x<=6;x++){const y=x/6;m.push(c(i+.8*Math.sin(y*3+i),u*y-1,n+1.6+.4*Math.sin(y*2.2+i)))}w.bar(z,m,1,9,_(p0,.62+.2*e()),{taper:x=>1.25*(1.2-.3*x/6)})}const g=k0(q[4].clone().lerp(q[2],.45),.42),p=[0,0,0];for(const[i,u,m]of[[i0.x0+.6,-1.5,1],[i0.x1-.8,1.9,.82]]){const x=[],A=22.9+.9*e();for(let T=0;T<=9;T++){const F=T/9;x.push(c(i+u*Math.sin(F*2.2)+.5*Math.sin(F*7+i),33-(33-A)*F,n+.9+.5*Math.sin(F*3.1)))}const S=w.framesFrom(x,c(0,0,1)),W=T=>{const F=T/9;return 2.7-2*he(0,.62,F)+1.5*he(.68,1,F)};w.sweep(z,x,S.A,S.B,w.profRound(1,9,.4),{sa:W,sb:T=>.55+.25*W(T),col:(T,F)=>{const M=m*(.62+.5*((F*5+T)%3)/2)*(.75+.25*(F&1));return p[0]=g[0]*M,p[1]=g[1]*M,p[2]=g[2]*M,p}});const C=x[6];{const T=[];for(let F=0;F<=10;F++){const M=F/10*6.2832;T.push(c(C.x+Math.cos(M)*1,C.y+.15*Math.cos(M),C.z+Math.sin(M)*.62))}w.bar(z,T,.13,5,_(N.rope,1.3),{caps:!1,up:c(0,1,0)})}w.bar(z,[c(C.x,C.y,C.z),c(C.x+u*2.2,C.y+2.6,n+.5)],.1,5,_(N.rope,1.2))}P(i0.x0-4,20.5,n+1.3,i0.x1-5,36.4,n+1,.42,1),P(40.5,-1,n+1.9,38.6,47,n+.8,.5,0),y0(39.9,22.6,n+1.5,1,1.4),P(24,37.2,n+1.1,46,34.6,n+1.2,.3,2),w.bar(z,[c(i0.x0+2,33.2,n+.7),c(29,31.6,n+.9),c(36,32.3,n+.8),c(i0.x1-2,33.3,n+.7)],.11,5,_(N.rope,1.2))}await k.yield();{const e=G.fork("stack");for(const o of[-441,-458,-475])w.beam(z,c(12,.8,o),c(31,.8,o+.6),.6,.6,.12,_(p0,.7),c(0,1,0));for(let o=0;o<3;o++)for(let n=0;n<5-o;n++){const s=14.2+n*2.75+o*1.2+(e()-.5)*.4,t=1.66+o*.52,l=(e()-.5)*1.2,a=e();w.beam(z,c(s,t,-435-e()*3),c(s+l,t,-479+e()*3),1.16,.24,.07,w.mixC(w0,ao,.25+.55*a),c(0,1,0),{capTone:1.2})}}await k.yield();const I0=w.makeAcc(),d0={red:[.43,.075,.05],saffron:[.6,.36,.07],indigo:[.06,.085,.23],magenta:[.34,.09,.075],turq:[.15,.2,.32],white:[.7,.66,.56],green:[.47,.3,.08],cobalt:[.15,.185,.27]},Mo={red:[.58,.04,.03],saffron:[.82,.46,.035]},_e=(e,o,n,s,t,l=(a,h)=>h)=>{const a=[c(),c(),c(),c()];for(let h=0;h<o;h++)for(let f=0;f<e;f++){const r=I0.n,g=s(f,h),p=[[f,h],[f+1,h],[f+1,h+1],[f,h+1]];for(let i=0;i<4;i++){const u=p[i][0]/e,m=p[i][1]/o;n(u,m,a[i]),I0.pos.push(a[i].x,a[i].y,a[i].z),I0.nrm.push(t.x,t.y,t.z),I0.col.push(g[0],g[1],g[2]),I0.uv.push(u,l(u,m))}I0.idx.push(r,r+1,r+2,r,r+2,r+3),I0.n+=4}},ae=(e,o,n,s,t,l=1)=>{const a=c(-(o.z-e.z),0,o.x-e.x).normalize(),h=e.distanceTo(o);_e(5,6,(f,r,g)=>g.set(R(e.x,o.x,f)+a.x*.5*r*Math.sin(f*3.1),R(e.y,o.y,f)-.06*h*4*f*(1-f)*(1-r)-r*n,R(e.z,o.z,f)+a.z*.5*r*Math.sin(f*3.1)),(f,r)=>_(r===5?d0.white:r===3||r===0?t:s,l*(.95+.1*((f*3+r*5)%4)/3)),a)},Pe=(e,o,n,s=2.6)=>{w.bar(z,[e,e.clone().lerp(o,.5).add(c(0,-.8,0)),o],.07,4,_(N.rope,1.3));const t=o.clone().sub(e),l=t.length()/n*.72,a=c(-t.z,0,t.x).normalize();for(let h=0;h<n;h++){const f=(h+.14)/n,r=h&1?Mo.saffron:Mo.red,g=p=>-.8*4*p*(1-p);_e(1,2,(p,i,u)=>{const m=f+(.5+(p-.5)*(1-i))*l/t.length();return u.set(e.x+t.x*m,e.y+t.y*m+g(m)-i*s,e.z+t.z*m)},()=>r,a,(p,i)=>.6*i)}},no=t0.ridgeRope[0].y;Pe(c(v0+.6,50.5,l0-.3),c(-1.6,49.2,-452.2),9,2.3),Pe(c(v0-.8,51,l0-.6),c(-57,30,-431),12,2.6);{let e=37.5;for(const[o,n]of[["indigo","saffron"],["red","white"],["saffron","magenta"],["turq","white"],["magenta","saffron"]])ae(c(60.2,17.5,e),c(60.2,17.5,e-4.6),6.4,d0[o],d0[n]),e-=5.3}w.bar(z,[c(60.2,17.7,40),c(60.2,17.2,25),c(60.2,17.7,10)],.09,4,_(N.rope,1.3)),Z.push(60.6,-1,9.6,60.1,21.5,10.1,.42,h0[0][0]*.95,h0[0][1]*.95,h0[0][2]*.95),Z.push(64.5,-1,4.5,60.3,15,9.9,.3,h0[1][0]*1.05,h0[1][1]*1.05,h0[1][2]*1.05),y0(60.2,15.2,10,.5,1.2),_e(5,6,(e,o,n)=>n.set(12.6+16.5*e,3.5-2.6*Math.pow(Math.abs(e-.5)*2,4)-2.2*Math.pow(Math.max(0,o-.6)/.4,2)+.12*Math.sin(e*19+o*7),-433.5-17*o),(e,o)=>_(d0.cobalt,.9+.14*((e*3+o*5)%4)/3),c(0,1,0),(e,o)=>.12),te(-9,-1,108,6,no+3,100.5,.75),te(21,-1,108,6,no+3,100.5,.75),te(6,-1,124,6,no+3,100.5,.75);{const e=G.fork("props"),o=Math.max(3,Math.round(5*Math.min(Xe,1.1)));for(let n=0;n<70;n++){const s=-60-4.7*n,t=n>45?T0:1;for(const l of[-1,1])for(let a=0;a<o;a++){if(e()>t)continue;const h=12+e()*20+(a===0?14:0),f=s+(e()-.5)*3.4,r=t0.halfBreadth(f,h)+2.7,g=7+(h-10)*(.55+e()*.5);P(l*(r+g),-.5,f+(e()-.5)*6,l*(r-.2),h,f,.38+e()*.2)}}}await k.yield();const a0=c(0,1,0),F0=(e,o,n,s,t,l,a)=>{const h=t.map(f=>c(o,n+f[1],s));w.bar(e,h,1,l,a,{taper:f=>Math.max(t[f][0],.01),up:c(1,0,.01)})},n0=(e,o,n,s,t,l,a=6,h=14,f=0)=>{const r=c(t.z+.01,.02,-t.x).normalize(),g=new d.Vector3().crossVectors(t,r).normalize(),p=[];for(let i=0;i<=h;i++){const u=i/h*Math.PI*2,m=n*(1+f*Math.sin(u*3));p.push(o.clone().addScaledVector(r,Math.cos(u)*m).addScaledVector(g,Math.sin(u)*m))}w.bar(e,p,s,a,l,{caps:!1,up:t})},Be=e=>Ze?_(w.mixC(w.mixC(w0,ao,.3+.5*e),N.ash,.62),.58):w.mixC(w0,ao,.3+.5*e),Q0=(e,o,n)=>{const s=n.clone().sub(o),t=o.clone().addScaledVector(s,.55).add(c(.15,.2,.1));w.bar(e,[o,t,n],.2,6,_(w0,.7));const l=c(-s.z,0,s.x).normalize();w.beam(e,n.clone().addScaledVector(l,-.2),n.clone().addScaledVector(l,1.5).add(c(0,-.5,0)),.42,.09,.03,[.1,.1,.11],s.clone().normalize())},ge=(e,o,n)=>{const s=Math.cos(n),t=Math.sin(n);w.bar(e,[o.clone(),o.clone().add(c(s*2.6,.5,t*2.6))],.16,6,_(w0,.75)),w.bar(e,[o.clone().add(c(s*2.6-t*.8,.5,t*2.6+s*.8)),o.clone().add(c(s*2.6+t*.8,.5,t*2.6-s*.8))],.5,8,_(me,1.5))},B0=(e,o,n,s,t,l,a)=>{F0(e,o,n,s,[[t*.7,0],[t*.95,l*.5],[t,l],[t*.85,l],[t*.6,l*.35]],10,(h,f,r)=>{const g=(h===3||h===4?.3:.8)*(.8+.4*(h+f&1));return r[0]=N.rattan[0]*g,r[1]=N.rattan[1]*g,r[2]=N.rattan[2]*g,r}),n0(e,c(o,n+l,s),t,.12,a0,_(N.rattan,1.1));for(let h=0;h<7;h++){const f=a()*6.28,r=a()*t*.6;w.bar(e,[c(o+Math.cos(f)*r,n+l*.4,s+Math.sin(f)*r),c(o+Math.cos(f)*r*1.5,n+l+.5+a()*.9,s+Math.sin(f)*r*1.5)],.14,5,_(N.peg,.8+a()*.4))}},D0=(e,o,n,s,t)=>F0(e,o,n+.09,s,[[t,0],[t*.9,.03],[.01,.035]],10,[.02,.015,.01]);{const e=G.fork("staging");for(const o of[-1,1]){for(const n of[26,47])for(let s=0;s<35;s++){const t=-60-9.4*s,l=t-9.4,a=t0.halfBreadth(t,n)+2.7+3.4,h=t0.halfBreadth(l,n)+2.7+3.4;for(let f=0;f<2;f++){const r=(f-.5)*2.3,g=(e()-.5)*.2,p=t+.6-e(),i=l-.6+e(),u=Be(e());o<0&&n<40&&s>=31||w.beam(z,c(o*(a+r),n+g,p),c(o*(h+r),n+g,i),1.08,.22,.07,u,a0)}P(o*(a-2.6),-.5,t,o*(a-2.4),n+(n>40?7:-.2),t,.36),P(o*(a+3.2),-.5,t+.4,o*(a+2.8),n+(n>40?6:-.2),t+.4,.36),P(o*(a-3.6),n-.6,t+.2,o*(a+4),n-.6,t+.2,.3),s%3===0&&n<40&&P(o*(a+3),2,t,o*(h+3),n-1,l,.28),n>40&&P(o*(a+2.9),n+5,t,o*(h+2.9),n+5,l,.25)}await k.yield()}{const o=[["red","saffron"],["indigo","white"],["saffron","magenta"],["turq","white"],["magenta","saffron"],["cobalt","saffron"],["green","saffron"]];let n=0;for(const[s,t]of[[1,[-70,-78,-104,-112,-121,-187,-196,-204,-238,-247]],[-1,[-96,-105,-150,-159,-168,-226,-235]]])for(const l of t){const a=s*(t0.halfBreadth(l,47)+2.7+3.4+2.95),h=s*(t0.halfBreadth(l-5.6,47)+2.7+3.4+2.95),f=o[n++%o.length];ae(c(a,52.1,l),c(h,52.1,l-5.6),5.2+e()*1.6,d0[f[0]],d0[f[1]],.85+.3*e())}}{const o=c(20,42.4,-174.4),n=-216,s=c(t0.halfBreadth(n,42)-.9,42,n),t=s.clone().sub(o),l=f=>-4*f*(1-f),a=f=>o.clone().addScaledVector(t,f).add(c(0,l(f),0));w.bar(z,[o,a(.25),a(.5),a(.75),s],.09,4,_(N.rope,1.3));const h=[["red","saffron"],["white","indigo"],["saffron","red"],["indigo","white"],["magenta","saffron"],["white","red"]];for(let f=0;f<6;f++)ae(a((f+.12)/6),a((f+.9)/6),7.2+1.5*(f*5%3)/2,d0[h[f][0]],d0[h[f][1]],1.4);Pe(c(20.3,55,-175),c(t0.halfBreadth(-240,39)-.7,39,-240),16,3.6)}{const o=k.core.makeRng("hif-fstage:"+k.seed),n=13.6,s=19.6,t=-267.6,l=-284.6,a=28,h=(f,r,g,p,i,u,m,x)=>{const y=h0[x],b=.8+.4*o();Z.push(f,r,g,p,i,u,m,y[0]*b,y[1]*b,y[2]*b)};for(let f=0;f<3;f++){const r=R(t-.5,l+.5,f/2);h(n+.2,7.6,r+.3,n+.1,a-.2,r,.34,f&1),h(s+.4,9,r-.3,s-.1,a+4.6,r,.34,1-(f&1)),h(n-.9,a-.6,r+.25,s+.9,a-.6,r+.25,.3,0),y0(n+.1,a-.7,r,.5,1.1),y0(s-.1,a-.7,r,.5,1.1),y0(s-.1,a+3.6,r,.46,.9)}h(s-.1,a+3.6,t+.6,s-.1,a+3.6,l-.6,.24,1),h(n+.2,9,t-.4,n+.1,a-1,(t+l)/2,.26,2),h(s+.3,10,l+.4,s,a-1,(t+l)/2,.26,2);for(let f=0;f<5;f++)for(let r=0;r<2;r++){const g=n+.62+f*1.19,p=R(t,l,r/2)+.3*o(),i=R(t,l,(r+1)/2)-.3*o();w.beam(z,c(g,a+(o()-.5)*.12,p),c(g+(o()-.5)*.2,a+(o()-.5)*.12,i),1.08,.22,.07,Be(o()),a0)}for(const f of[-.7,.7])h(16.4+f,7.8,t+5.6,16.4+f,a+1.6,t+.2,.2,0);for(let f=0;f<9;f++){const r=(f+.7)/10;Z.push(15.5,R(7.8,a+1.6,r),R(t+5.6,t+.2,r)-.2,17.3,R(7.8,a+1.6,r),R(t+5.6,t+.2,r)-.2,.13,h0[1][0],h0[1][1],h0[1][2])}B0(z,s-1.3,a+.11,t-2.2,1.25,1.7,o),B0(z,n+1.4,a+.11,l+1.6,1.05,1.4,o),n0(z,c(s-1.5,a+.45,l+3.4),1.3,.28,a0,_(N.rattan,.95),6,14,.05),n0(z,c(s-1.3,a+.95,l+3.2),1.2,.28,a0,_(N.rattan,1.1),6,14,.05),F0(z,s-1.2,a+.11,(t+l)/2-1,[[.5,0],[1,.6],[1.15,1.5],[.7,2.3],[.45,2.6],[.6,2.9]],10,_(N.rattan,.55)),Q0(z,c(n+2.4,a+.25,t-6.5),c(n+3.4,a+.5,t-9.4)),ge(z,c(n+.9,a+.3,t-11.5),.9),ae(c(s-.05,a+3.6,t-2.6),c(s-.05,a+3.6,t-7.2),3,d0.red,d0.saffron,1.3),ae(c(s-.05,a+3.6,t-10.4),c(s-.05,a+3.6,t-14.6),2.7,d0.white,d0.indigo,1.25)}{const n=-(t0.halfBreadth(-384.5,26)+2.7+3.4);B0(z,n+.4,26.22,-384.5,1.3,1.8,e),n0(z,c(n-.5,26.6,-384.5+3.4),1.3,.28,a0,_(N.rattan,.95),6,14,.05),n0(z,c(n-.3,27.1,-384.5+3.2),1.2,.28,a0,_(N.rattan,1.1),6,14,.05),ge(z,c(n+.6,26.7,-384.5-2.6),2.2)}for(const[o,n,s]of[[1,26,6],[1,26,17],[-1,26,11],[-1,26,24],[1,26,27],[-1,26,3]]){const t=-60-9.4*s-4,l=o*(t0.halfBreadth(t,n)+2.7+3.4);B0(z,l,n+.22,t,1.5,2,e),n0(z,c(l+.5,n+.6,t-4.5),1.5,.3,a0,_(N.rattan,.9),6,14,.05),n0(z,c(l+.3,n+1.1,t-4.3),1.4,.3,a0,_(N.rattan,1.1),6,14,.05)}}const v={x0:20,x1:28,z0:-142,z1:-174,deck:28.5,low:14,top:72.5,rail:34.2,hiRail:78.2,head:80.5},so=[];{const e=G.fork("tower");for(const t of[v.x0,v.x1])for(const l of[v.z0,-158,v.z1]){te(t,-1,l,t,v.head,l,.55);for(const a of[v.low-.55,v.deck-.55,44,58,v.top-.55,v.rail,v.hiRail,v.head-1.5])y0(t,a,l,1.22)}for(const t of[v.low,v.deck,v.top]){for(let l=0;l<5;l++){const a=v.x0-.6+(l+.5)*1.84,h=(e()-.5)*.12;w.beam(z,c(a,t+h,v.z0+1.5+e()),c(a+(e()-.5)*.2,t+h,v.z1-1.5-e()),.86,.2,.06,Be(e()),a0)}for(const l of[v.z0,-150,-158,-166,v.z1])P(v.x0-1.5,t-.55,l,v.x1+1.5,t-.55,l,.34);for(const l of[v.x0,v.x1])P(l,t-1.1,v.z0+1.5,l,t-1.1,v.z1-1.5,.34)}P(v.x1,1,v.z0,v.x1,v.low-1,v.z1,.3),P(v.x1,v.low+1,v.z1,v.x1,v.deck-1,v.z0,.3),P(v.x0,1,v.z1,v.x1,v.low-1,v.z1,.3),P(v.x0,v.low+1,v.z0,v.x1,v.deck-1,v.z0,.3);for(const t of[v.rail,v.hiRail])P(v.x1,t,v.z0+1,v.x1,t,v.z1-1,.3),P(v.x0-1,t,v.z0,v.x1+1,t,v.z0,.32),P(v.x0-1,t,v.z1,v.x1+1,t,v.z1,.3);P(v.x0,v.rail,v.z0+.6,v.x0,v.rail,v.z1-.6,.3),P(v.x0-1.2,44,v.z0,v.x1+1.2,44,v.z0,.3),P(v.x0-1.2,44,v.z1,v.x1+1.2,44,v.z1,.3),P(v.x1+3.5,-.5,v.z0-5,v.x1+.4,v.deck+3,v.z0-1.2,.3),P(v.x0-1.1,44.4,v.z0+1,v.x0-1.1,44.4,v.z1-1,.3);for(const t of[v.z0,-158,v.z1])P(v.x0-1.2,58,t,v.x1+1.2,58,t,.3);for(const t of[v.x0,v.x1])P(t,58,v.z0+1,t,58,v.z1-1,.3),P(t,30,v.z0,t,57,-158,.3),P(t,30,v.z1,t,57,-158,.3),P(t,59,-158,t,v.top-1.5,v.z0,.3),P(t,59,-158,t,v.top-1.5,v.z1,.3);P(v.x0,45,v.z0,v.x1,v.top-1.5,v.z0,.3),P(v.x1,45,v.z1,v.x0,v.top-1.5,v.z1,.3),P(v.x0-1.4,v.deck,v.z0+4,v.x0-1,v.top+3.5,v.z0+11,.3);for(const t of[v.z0,-158,v.z1])P(v.x0-1.2,v.head-1.5,t,v.x1+1.2,v.head-1.5,t,.3);for(const t of[v.x0,v.x1])P(t,v.head-1.2,v.z0+1.2,t,v.head-1.2,v.z1-1.2,.3);{const t=v.head-1.9,l=v.x0-1.6,a=v.x1+1.6,h=v.z0+1.2,f=-157.2;_e(6,6,(g,p,i)=>i.set(R(l,a,g),t-1.5*Math.sin(g*Math.PI)*Math.sin(p*Math.PI)-.5*p,R(h,f,p)),(g,p)=>_(d0.cobalt,(.9+.14*((g*5+p*3)%4)/3)*(g===0||g===5||p===0||p===5?.8:1)),c(0,1,0),(g,p)=>.5*Math.sin(g*Math.PI)*Math.sin(p*Math.PI));let r=-159.4;for(const[g,p]of[["red","saffron"],["saffron","indigo"],["magenta","white"]]){const i=3.9+e()*.8;ae(c(v.x0-.7,v.head-1.7,r),c(v.x0-.7,v.head-1.7,r-i),5.6+e()*1.2,d0[g],d0[p]),r-=i+.5}Pe(c(v.x1+1.2,v.head-1.3,v.z1),c(38.5,66,v.z1-26),8)}const o=v.deck+.2,n=23,s=-160.6;F0(z,n,o,s,[[.9,0],[1.1,.5],[1,1],[.75,1.1]],10,[.34,.16,.09]),F0(z,n,o+1.1,s,[[.6,0],[1,.35],[1.05,.9],[.7,1.35],[.35,1.45],[.3,1.6],[.01,1.62]],10,(t,l,a)=>{const h=(t>4?.5:.85)+.5*(l===2||l===3?1:0),f=t===4?1:0;return a[0]=R(.02,.8,f)*h,a[1]=R(.13,.78,f)*h,a[2]=R(.62,.72,f)*h,a}),w.bar(z,[c(n-.9,o+1.7,s),c(n-1.5,o+2.2,s),c(n-1.8,o+2.75,s)],.14,6,[.02,.12,.56]),n0(z,c(n,o+2.75,s),.75,.07,c(1,0,0),[.08,.08,.09],5,10),so.push([n-1.8,o+2.8,s,1]),w.beam(z,c(22.6,o+.12,-163.6),c(22.6,o+.12,-166.8),1.3,.1,.04,_(w0,.8),a0);for(let t=0;t<4;t++){const l=22.1+(t&1)*1,a=-164.4-(t>>1)*1.5;F0(z,l,o+.22,a,[[.26,0],[.3,.08],[.36,.95],[.3,.95],[.26,.7]],8,(h,f,r)=>{const g=h<3?1:.4;return r[0]=.78*g,r[1]=.4*g,r[2]=.1*g,r}),so.push([l,o+1.25,a,.5])}B0(z,26,o,-157.2,1.5,2,e),B0(z,25.6,o,-168,1.25,1.7,e),D0(z,26,o,-157.2,2),D0(z,25.6,o,-168,1.7),D0(z,n,o,s,1.6);for(let t=0;t<3;t++)n0(z,c(25.4,o+.3+t*.5,-161.6),1.35-t*.08,.26,a0,_(N.rattan,.85+.15*t),6,14,.06);ge(z,c(21.2,o+.45,-143.7),.5),ge(z,c(21.6,o+.45,-169),-1.2),Q0(z,c(27.2,o,-162.9),c(28,v.rail+.2,-163.3)),Q0(z,c(27,o,-165.6),c(28,v.rail+.2,-165.2)),Q0(z,c(24.3,o+.2,-164.6),c(25.7,o+.5,-167.2)),Q0(z,c(20.9,o,-165.4),c(20.1,v.rail+.2,-165.8)),Q0(z,c(21,o,-170.6),c(20.1,v.rail+.2,-170.2)),w.bar(z,[c(27.4,o,-158.9),c(27.9,o+2.6,-159.2),c(28,o+5.4,-158.9)],.13,5,_(w0,.8)),w.bar(z,[c(27.4,o,-158.9),c(28,o+5.4,-158.9)],.05,4,_(N.rope,1.3)),w.bar(z,[c(27.3,o,-160.3),c(27.9,o+4.2,-160.6)],.16,6,_(me,1.4));for(let t=0;t<4;t++)w.beam(z,c(23.4+(t&1)*.3,o+.22+t*.4,-145.2-(t&1)*.5),c(23.2,o+.22+t*.4,-153.6+(t&1)*.6),.95,.19,.06,Be(.2+.2*t),a0,{capTone:1.2});B0(z,26.2,o,-147,1.35,1.8,e),B0(z,26,o,-153.6,1.2,1.6,e),D0(z,26.2,o,-147,1.9),D0(z,26,o,-153.6,1.7),n0(z,c(26.2,o+.35,-150.4),1.4,.28,a0,_(N.rattan,.95),6,14,.05),n0(z,c(26.3,o+.85,-150.2),1.3,.28,a0,_(N.rattan,1.1),6,14,.05),n0(z,c(v.x1+.9,37,v.z1),2,.28,c(1,0,.1).normalize(),_(N.rattan,1),6,16,.04),n0(z,c(v.x1+1.2,36.6,-158),1.8,.28,c(1,0,-.1).normalize(),_(N.rattan,.8),6,16,.04),n0(z,c(v.x0-.9,31.4,-158),1.6,.28,c(1,0,.12).normalize(),_(N.rattan,1.05),6,16,.04),n0(z,c(v.x0-.95,36.2,v.z1),2.1,.3,c(1,0,-.1).normalize(),_(N.rattan,.95),6,16,.04),n0(z,c(v.x0-1,35.2,v.z1+.3),1.7,.28,c(1,0,.14).normalize(),_(N.rattan,1.15),6,16,.04)}await k.yield();const I={x:6,z0:74,z1:30,y:4.6,r:2.3};let xe=null,ye=null,io=null;{const e=G.fork("entry"),o=[0,0,0],n=[];for(let p=0;p<=11;p++)n.push(c(I.x+Math.sin(p*.9)*.25,I.y+Math.sin(p*1.7)*.15,I.z0-(I.z0-I.z1)*p/11));w.bar(z,n,1,10,(p,i)=>{const u=(.5+.35*((p*5+i*3)%4)/4)*(i>5?.45:1);return o[0]=me[0]*1.5*u+.02,o[1]=me[1]*1.3*u,o[2]=me[2]*1.2*u,o},{taper:p=>I.r*(1+.08*Math.sin(p*2.3))});for(let p=0;p<6;p++){const i=I.z0-3-p*7.6,u=_(k0(q[4],.5),.6+.5*e()),m=[];for(let y=0;y<=6;y++){const b=-1.25+2.5*y/6;m.push(c(I.x+Math.sin(b)*(I.r+.25),I.y+Math.cos(b)*(I.r+.25)+(y===3?.2:0),i))}const x=w.framesFrom(m,c(0,0,1));w.sweep(z,m,x.A,x.B,w.profRect(.1,2.9+e()*.6,.04),{col:u})}for(let p=0;p<5;p++){const i=I.z0-4-p*9;for(const u of[-1,1])F0(z,I.x+u*2.6,0,i,[[1.5,-.3],[1.7,.6],[1.3,1.9],[.6,2.4],[.01,2.45]],7,_(k0(q[2],.55),.7+.5*e()))}for(let p=0;p<16;p++){const i=I.z0-1-e()*42,u=I.x+(e()-.5)*5,m=e()*3.1;w.bar(z,[c(u-Math.cos(m)*2.2,.35,i-Math.sin(m)*2.2),c(u+Math.cos(m)*2.2,.6,i+Math.sin(m)*2.2)],.4,6,[.035,.028,.025])}await k.yield();const s={x:28,z:32,len:34};let t=0;for(const[p,i,u]of[[6,1.9,1.9],[5,5.2,1.9],[4,8.5,1.9]])for(let m=0;m<p;m++){const x=s.x+(m-(p-1)/2)*3.75,y=(e()-.5)*5,b=u*(.92+e()*.16),A=.75+.5*e(),S=e()<.15,W=[c(x,i,s.z+s.len/2+y),c(x+(e()-.5)*.4,i,s.z+y),c(x,i,s.z-s.len/2+y)];w.bar(z,W,1,10,(C,T)=>{const F=A*(.8+.3*((T*3+t)%4)/4),M=S?w0:p0;return o[0]=M[0]*F,o[1]=M[1]*F,o[2]=M[2]*F,o},{taper:C=>b*(1-.06*C)}),t++}for(const p of[s.z+9,s.z-9])w.beam(z,c(s.x-13,.2,p),c(s.x+13,.2,p),.5,.5,.1,_(p0,.6),a0);const l=-17,a=50;w.bar(z,[c(l,9.2,a+15),c(l,9.2,a-15)],1.7,10,(p,i)=>{const u=.8+.25*(i%3)/3;return o[0]=w0[0]*u,o[1]=w0[1]*u,o[2]=w0[2]*u,o});for(const p of[a+10,a-10])P(l-5,-.5,p,l-1.2,8,p,.45),P(l+5,-.5,p,l+1.2,8,p,.45),w.beam(z,c(l-3.4,7.3,p),c(l+3.4,7.3,p),.45,.45,.1,_(p0,.9),a0);F0(z,l,.04,a,[[7,0],[6.4,.05],[.01,.06]],12,_(w0,1));const h=w.makeAcc();w.beam(h,c(0,-7.5,0),c(0,6.5,0),.07,.75,.02,[.2,.2,.21],c(0,0,1));for(const p of[-7.9,6.9])w.bar(h,[c(-1.3,p,0),c(1.3,p,0)],.2,6,_(w0,.8));xe=new d.Mesh(w.accGeometry(h),Je),xe.name="saw",xe.position.set(l,9.2,a+3),X.add(xe);const f=(p,i,u,m,x,y)=>{const A=[],S=[],W=Math.cos(u),C=Math.sin(u);for(let F=0;F<=12;F++){const M=F/12-.5;A.push(c(p+C*M*m,x+1.5+2.2*Math.pow(Math.abs(M*2),3),i+W*M*m))}for(let F=0;F<=8;F++){const M=Math.PI*(1+F/8);S.push({a:Math.cos(M)*1.6,b:Math.sin(M)*1.5,na:Math.cos(M),nb:Math.sin(M),v:F*.5})}for(let F=0;F<=8;F++){const M=Math.PI*(2-F/8);S.push({a:Math.cos(M)*1.3,b:Math.sin(M)*1.2+.05,na:-Math.cos(M),nb:-Math.sin(M),v:5+F*.5})}S.push({...S[0],v:10}),S.pairs=!1;const T=w.framesFrom(A,a0);w.sweep(z,A,T.A,T.B,S,{col:(F,M)=>{const D=y*(M>8&&M<18?.45:.9)*(.85+.3*((F+M)%3)/3);return o[0]=p0[0]*D*1.2,o[1]=p0[1]*D*1.1,o[2]=p0[2]*D,o},sa:F=>.25+.75*Math.sin(Math.PI*(.06+.88*F/12)),sb:F=>.45+.55*Math.sin(Math.PI*(.06+.88*F/12))}),D0(z,p,0,i,4.5)};f(-34,26,.35,34,.1,1),f(-45,60,-.2,30,1.2,.8);for(const p of[52,68])w.bar(z,[c(-49,.7,p),c(-41,.7,p+1)],.7,7,_(p0,.7));for(const[p,i,u]of[[15,47,1],[17.5,49.5,.8],[15.5,52,.65],[-12,18,1],[-14.5,20,.75],[33,-128,.9],[35.4,-126.5,.7],[-12,-402,.9],[18,-330,.8],[9.5,-470,1],[12,-466.5,.7],[-27,-468,.9],[-24.5,-471,.65]]){const m=.7+e()*.5;F0(z,p,0,i,[[.9*u,0],[1.9*u,1.4*u],[2.1*u,2.6*u],[1.5*u,3.9*u],[.8*u,4.5*u],[1.05*u,4.9*u],[.75*u,4.9*u],[.6*u,4.2*u]],10,(x,y)=>{const b=m*(x>5?.3:.8+.25*(y%2));return o[0]=.42*b,o[1]=.2*b,o[2]=.11*b,o}),D0(z,p,0,i,2.6*u)}const r=new d.PlaneGeometry(10,46,1,1).rotateX(-Math.PI/2).translate(I.x,.25,(I.z0+I.z1)/2),g=new d.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,uniforms:{...C0(),uTime:H.uTime,uGain:{value:B?6.5:o0?3.6:3.2}},vertexShader:`#include <fog_pars_vertex>
varying vec3 vWp;
void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vWp = wp.xyz; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,fragmentShader:`#include <fog_pars_fragment>
${j0}
uniform float uTime; uniform float uGain; varying vec3 vWp;
void main(){ vec2 p = vWp.xz; float edge = smoothstep(4.7, 1.6, abs(p.x - ${I.x}.0)) * smoothstep(${I.z0}.0 + 1.5, ${I.z0}.0 - 2., p.y) * smoothstep(${I.z1}.0 - 1.5, ${I.z1}.0 + 2., p.y);
  float coal = sNoise(p * 1.3) * 0.6 + sNoise(p * 3.7 + 4.) * 0.4;
  float breath = 0.55 + 0.45 * sin(uTime * 1.3 + sNoise(p * 0.4) * 9.) * sin(uTime * 0.7 + p.y * 0.3);
  float hot = smoothstep(0.35, 0.8, coal) * (0.5 + 0.5 * breath);
  vec3 col = mix(vec3(0.03, 0.02, 0.02), vec3(1.0, 0.24, 0.03) * uGain, hot) + vec3(1.0, 0.7, 0.25) * uGain * smoothstep(0.8, 1., coal * breath);
  float al = smoothstep(4.9, 3.7, abs(p.x - ${I.x}.0)) * smoothstep(${I.z0}.0 + 2., ${I.z0}.0 + 0.5, p.y) * smoothstep(${I.z1}.0 - 2., ${I.z1}.0 - 0.5, p.y);
  gl_FragColor = vec4(col * edge + vec3(0.02, 0.015, 0.012) * (1. - edge), al);
  #include <fog_fragment>
}`});io=new d.Mesh(r,g),io.name="embers",X.add(io)}await k.yield();{const e=G.fork("hung");ye=new d.Group,ye.name="hung",X.add(ye);const o=(a,h,f,r,g)=>{const p=w.makeAcc();if(w.bar(p,[c(0,0,0),c(0,-r+3,0)],.14,5,_(N.rope,1.2)),g===0){for(let u=0;u<4;u++)n0(p,c((u-1.5)*.45,-r,(e()-.5)*.4),3.1-.25*e(),.3,c(1,0,(e()-.5)*.5).normalize(),_(N.rattan,.75+.4*e()),6,18,.03);n0(p,c(0,-r+3,0),.5,.16,c(0,0,1),_(N.rope,1.3),5,8);for(let u=0;u<6;u++)n0(p,c((u-2.5)*.5,-r-.5+(u&1)*.35,(u%3-1)*.3),3.75+.22*(u*3%4),.33,c(1,0,(u%3-1)*.16).normalize(),_(N.rattan,.7+.12*(u*5%4)),6,20,.035);for(let u=0;u<3;u++)w.bar(p,[c((u-1)*.7,-r-3.6,(u-1)*1.2),c((u-1)*.9,-r-5.5-u,(u-1)*1.5+.4),c((u-1)*.8+.3,-r-7.6-1.4*u,(u-1)*1.3)],.2,5,_(N.rattan,.95))}else w.bar(p,[c(-3.5,-r+3,0),c(3.5,-r+3,0)],.22,6,h0[0]),B0(p,-2.6,-r-.5,0,1.2,1.7,e),w.bar(p,[c(-2.6,-r+3,0),c(-2.6,-r+1.2,0)],.08,4,_(N.rope,1.2)),Q0(p,c(.4,-r-1.6,0),c(.2,-r+2.8,0)),ge(p,c(2.8,-r+2.8,0),-1.5);const i=new d.Mesh(w.accGeometry(p),Je);i.position.set(a,h,f),ye.add(i)};o(-6,u0(6)-2,-218,u0(6)-2-37.5,0),o(-22,u0(22)-2,-262,u0(22)-2-38,1);const n=v.x0-1.1,s=-151;w.bar(z,[c(n,44,s),c(n-.2,40,s),c(n,35.5,s)],.22,6,[.18,.22,.07]);for(let a=0;a<5;a++)for(let h=0;h<8;h++){const f=h/8*6.283+a*.4,r=40.3-a*1,g=.35,p=1-a*.06,i=.75+.5*e();w.bar(z,[c(n+Math.cos(f)*g,r,s+Math.sin(f)*g),c(n+Math.cos(f)*p,r-.35,s+Math.sin(f)*p),c(n+Math.cos(f)*p*1.05,r+.75,s+Math.sin(f)*p*1.05)],.24,5,[.2*i,.42*i,.07*i],{taper:u=>u===1?1.15:.7})}const t=w.makeAcc(),l=(a,h,f,r,g)=>{const p=t.n,i=-f,u=h;t.pos.push(a.x,a.y,a.z,a.x+(h*.5+i*.5)*r,a.y-.25*r,a.z+(f*.5+u*.5)*r,a.x+h*r,a.y-.8*r,a.z+f*r,a.x+(h*.5-i*.5)*r,a.y-.25*r,a.z+(f*.5-u*.5)*r);for(let m=0;m<4;m++)t.nrm.push(h,.5,f),t.col.push(g[0],g[1],g[2]);t.uv.push(.5,0,1,.4,.5,1,0,.4),t.idx.push(p,p+1,p+2,p,p+2,p+3),t.n+=4};for(const[a,h]of[[60,-230],[-60,-200],[60,40]]){const f=[],g=46+e()*14;for(let p=0;p<=40;p++){const i=p/40,u=i*3.2*6.283;if(f.push(c(a+Math.cos(u)*1.9,g*i,h+Math.sin(u)*1.9)),p%1===0&&p>2)for(let m=0;m<3;m++){const x=u+(e()-.5)*1.2,y=.6+.7*e();l(c(a+Math.cos(x)*2.1,g*i+e()*1.2,h+Math.sin(x)*2.1),Math.cos(x),Math.sin(x),1.3+e()*1.1,[.1*y,.3*y,.05*y])}}w.bar(z,f,.16,5,[.1,.13,.05])}if(B)for(let a=4;a<60;a+=10)for(const h of[-1,1]){const f=t0.ribAt(a,h,40);f.x-=h*.35;for(let r=0;r<7;r++)l(c(f.x,f.y-r*.75,f.z+(r&1?.5:-.5)),-h,r&1?.4:-.4,1.5,_(N.pale,.9+.2*(r&1)))}oe(t,ko(.25,.3),"leaves")}await k.yield();{const e=k.core.makeRng("hif-nuts:"+k.seed),o=[0,0,0],n=(s,t,l,a)=>{const h=.75+.5*e(),f=e();F0(z,s,t,l,[[.3*a,0],[.82*a,.3*a],[a,.95*a],[.8*a,1.6*a],[.3*a,1.95*a],[.01,2*a]],7,(r,g)=>{const p=h*(.75+.35*r/5)*(.85+.3*(g%2));return o[0]=R(.16,.42,f*f)*p,o[1]=.46*p,o[2]=.07*p,o})};for(const[s,t,l]of So)for(let a=0;a<6;a++){const h=a*1.047+e();n(s+Math.cos(h)*1.3,t-1.4-e()*.8,l+Math.sin(h)*1.3,.85+.2*e())}for(let s=0;s<16;s++){const t=s<9?0:s<14?1:2,l=s*2.4,a=(t===0?2.6:t===1?1.5:.5)*Math.sqrt(e());n(19.5+Math.cos(l)*a,t*1.25,42+Math.sin(l)*a,.8+.2*e())}D0(z,19.5,0,42,3.6);for(let s=0;s<5;s++)n(22+s%2*1.4,v.deck+.2,-154.8-(s>>1)*1.5,.75)}{const e=Ae(yt(M0),{uSunOut:{value:x0.sunOut},uBack:{value:.35}},{side:d.DoubleSide,stir:.55}),o=w.accGeometry(I0);o.boundingSphere=new d.Sphere(c(0,40,-190),420);const n=new d.Mesh(o,e);n.name="cloth",X.add(n)}oe(z,w.makeWood(H,{scallop:.45}),"timber"),await k.yield();{const n=[],s=[],t=[],l=[];for(let y=0;y<=3;y++)for(let b=0;b<=6;b++){const A=b/6*Math.PI*2,S=y/3,W=1-.18*S;n.push(Math.cos(A)*W,S,Math.sin(A)*W),s.push(Math.cos(A),0,Math.sin(A)),t.push(b/6*3,S*2)}for(let y=0;y<3;y++)for(let b=0;b<6;b++){const A=y*7+b,S=A+1,W=A+6+1,C=W+1;l.push(A,W,S,S,W,C)}const a=new d.BufferGeometry;a.setAttribute("position",new d.Float32BufferAttribute(n,3)),a.setAttribute("normal",new d.Float32BufferAttribute(s,3)),a.setAttribute("uv",new d.Float32BufferAttribute(t,2)),a.setIndex(l);const h=Z.length/10,f=new Float32Array(h*3),r=w.makeWood(H,{scallop:0,node:1}),g=new d.InstancedMesh(a,r,h);g.name="bamboo";const p=new d.Matrix4,i=new d.Quaternion,u=new d.Vector3,m=new d.Vector3,x=new d.Vector3;for(let y=0;y<h;y++){const b=y*10;m.set(Z[b],Z[b+1],Z[b+2]),u.set(Z[b+3]-Z[b],Z[b+4]-Z[b+1],Z[b+5]-Z[b+2]);const A=Math.max(u.length(),.01);u.multiplyScalar(1/A),i.setFromUnitVectors(a0,u),x.set(Z[b+6],A,Z[b+6]),p.compose(m,i,x),g.setMatrixAt(y,p),f[y*3]=Z[b+7],f[y*3+1]=Z[b+8],f[y*3+2]=Z[b+9],(y&255)===255&&await k.yield()}a.setAttribute("aCol",new d.InstancedBufferAttribute(f,3)),g.instanceMatrix.needsUpdate=!0,g.frustumCulled=!1,X.add(g)}await k.yield();let ro=null;const Eo=c(v.x0,v.rail+.3,-162.4);{const e=[],o=[],n=[],s=[],t=[];let l=0;const a=(C,T,F,M,D,V,s0,U,L=0)=>{const E=Math.cos(L),Y=Math.sin(L);for(let J=0;J<=5;J++)for(let K=0;K<=7;K++){const j=J/5*Math.PI,O=K/7*Math.PI*2;let $=Math.sin(j)*Math.cos(O),e0=Math.cos(j),g0=Math.sin(j)*Math.sin(O),b0=$*M,c0=e0*D,q0=g0*V,Y0=$/M,ie=e0/D,re=g0/V;const le=c0*E-q0*Y,ce=c0*Y+q0*E,V0=ie*E-re*Y,je=ie*Y+re*E,Me=Math.hypot(Y0,V0,je)||1;e.push(C+b0,T+le,F+ce),o.push(Y0/Me,V0/Me,je/Me),n.push(U[0],U[1]*(.8+.2*(e0*.5+.5)),U[2]),s.push(s0,0)}for(let J=0;J<5;J++)for(let K=0;K<7;K++){const j=l+J*8+K,O=j+1,$=j+7+1,e0=$+1;t.push(j,O,$,O,e0,$)}l+=48};a(0,.46,0,.19,.2,.3,0,[1,1,0],-.25),a(0,.42,.16,.16,.17,.17,0,[1,.9,0]),a(0,.68,.23,.075,.17,.085,1,[1,1.05,0],.25),a(0,.86,.29,.075,.08,.09,1,[1,1.1,0]),a(0,.85,.4,.022,.025,.06,1,[0,1.1,0]),a(0,.955,.29,.014,.06,.075,1,[0,1,1]),a(0,.775,.36,.02,.05,.03,1,[0,.9,1]);for(const C of[-1,1])a(C*.19,.5,-.02,.045,.13,.23,2,[1,.72,0],-.2),a(C*.07,.15,.02,.022,.16,.022,0,[0,.9,0]),a(C*.07,.012,.06,.035,.012,.09,0,[0,.8,0]);a(0,.66,-.33,.05,.22,.13,3,[1,.6,0],-.7),a(0,.56,-.27,.1,.12,.14,3,[1,.8,0],-.4);const h=new d.BufferGeometry;h.setAttribute("position",new d.Float32BufferAttribute(e,3)),h.setAttribute("normal",new d.Float32BufferAttribute(o,3)),h.setAttribute("aCol",new d.Float32BufferAttribute(n,3)),h.setAttribute("uv",new d.Float32BufferAttribute(s,2)),h.setIndex(t);const f=G.fork("hens"),r=(C,T)=>t0.halfBreadth(C,T)+2.7+3.4,g=v.deck+.2,p=[[.5,10.1,-88],[-.8,10.1,-131],[.3,10.1,-204],[-.7,10.1,-221],[.7,10.1,-229],[-.5,10.1,-262],[.6,10.1,-318],[21.3,g,-148.6],[25.5,v.low+.2,-150],[r(-120,26),26.25,-120],[r(-236,26)-.6,26.25,-236],[-r(-180,26),26.25,-180],[13,0,40],[14,0,29],[-9,0,24],[15,0,5],[18.5,2.95,-449],[23,2.95,-462],[3.5,0,-437],[-3,0,-462],[-19,0,-440],[15.3,28.25,-270.6],[17.4,28.25,-273.8],[14.9,28.25,-277.4],[16.6,28.25,-279.6],[15.6,28.25,-283.2]],i=p.length+1,u=new Float32Array(i*4);ro=new d.ShaderMaterial({vertexShader:ht,fragmentShader:pt(M0),fog:!0,side:d.DoubleSide,uniforms:{...C0(),...H,uWing:{value:0},uCoatA:{value:new d.Color(Ro?"#d8c8a0":"#b8521c")},uCoatB:{value:new d.Color("#1c1a1c")},uCoatC:{value:new d.Color("#7a7468")}}});const m=new d.InstancedMesh(h,ro,i);m.name="hens";const x=new d.Matrix4,y=new d.Quaternion,b=new d.Euler,A=new d.Vector3,S=new d.Vector3;for(let C=0;C<i;C++){const T=C===i-1,F=T?4.4:2.6+f()*.7;T?(S.copy(Eo),b.set(0,-.35,0)):(S.set(p[C][0],p[C][1],p[C][2]),b.set(0,f()*6.283,0)),y.setFromEuler(b),A.set(F,F,F),x.compose(S,y,A),m.setMatrixAt(C,x),u[C*4]=f(),u[C*4+1]=f(),u[C*4+2]=T?.1:f(),u[C*4+3]=T?1:0}h.setAttribute("iA",new d.InstancedBufferAttribute(u,4)),m.frustumCulled=!1,X.add(m);const W=w.makeAcc();for(const C of p)D0(W,C[0],C[1]-.05,C[2],1.3);oe(W,Je,"hen-shade")}if(await k.yield(),!xo){const e=[],o=[],n=[],s=[],t=[];let l=0;const a=(S,W,C,T,F,M,D,V,s0=0)=>{const r0=Math.cos(s0),m0=Math.sin(s0);for(let E=0;E<=5;E++)for(let Y=0;Y<=8;Y++){const J=E/5*Math.PI,K=Y/8*Math.PI*2,j=Math.sin(J)*Math.cos(K),O=Math.cos(J),$=Math.sin(J)*Math.sin(K),e0=j*T,g0=O*F,b0=$*M,c0=j/T,q0=O/F,Y0=$/M,ie=g0*r0-b0*m0,re=g0*m0+b0*r0,le=q0*r0-Y0*m0,ce=q0*m0+Y0*r0,V0=Math.hypot(c0,le,ce)||1;e.push(S+e0,W+ie,C+re),o.push(c0/V0,le/V0,ce/V0),n.push(V[0],V[1]*(.74+.26*(O*.5+.5)),V[2]),s.push(D,0)}for(let E=0;E<5;E++)for(let Y=0;Y<8;Y++){const J=l+E*9+Y,K=J+1,j=J+8+1,O=j+1;t.push(J,K,j,K,O,j)}l+=54};a(0,.47,-.02,.17,.19,.36,0,[1,1,0]),a(0,.41,-.04,.19,.17,.27,0,[1,.88,0]),a(0,.53,-.29,.15,.15,.14,0,[1,.97,0]),a(0,.5,.27,.135,.17,.13,0,[1,.95,0]),a(0,.66,.37,.078,.17,.09,1,[1,1,0],.6),a(0,.8,.5,.066,.074,.125,1,[1,1.05,0],.35),a(0,.745,.6,.042,.043,.06,1,[.55,.9,.25],.35),a(0,.665,.565,.017,.075,.026,1,[1,.72,0],-.2),a(0,.742,.652,.027,.02,.018,1,[0,.6,.9],.35),a(0,.6,-.4,.024,.065,.03,3,[1,.85,0],-.5);for(const S of[-1,1]){a(S*.1,.81,.43,.052,.02,.034,1,[1,.8,0],.3),a(S*.038,.915,.425,.022,.085,.03,1,[0,1,.72],-.7),a(S*.052,.968,.335,.018,.07,.024,1,[0,.9,.78],-1.2),a(S*.07,.975,.245,.012,.05,.016,1,[0,.8,.84],-1.65),a(S*.062,.828,.512,.014,.017,.021,1,[0,.5,1]);for(const W of[.25,-.27])a(S*.1,.29,W,.047,.13,.055,2,[1,.9,0]),a(S*.1,.11,W+.005,.025,.1,.028,2,[1,.8,.2]),a(S*.1,.02,W+.015,.031,.022,.038,2,[0,.7,1])}const h=new d.BufferGeometry;h.setAttribute("position",new d.Float32BufferAttribute(e,3)),h.setAttribute("normal",new d.Float32BufferAttribute(o,3)),h.setAttribute("aCol",new d.Float32BufferAttribute(n,3)),h.setAttribute("uv",new d.Float32BufferAttribute(s,2)),h.setIndex(t);const f=k.core.makeRng("hif-goats:"+k.seed),r=[[22.4,40.5,.35,0],[26.1,26.5,2.7,0],[29.9,36,.2,1],[33.6,30,-2.6,0],[22.4,21.5,-.4,0]],g=r.length,p=new Float32Array(g*4),i=new d.ShaderMaterial({vertexShader:vt,fragmentShader:dt(M0),fog:!0,side:d.DoubleSide,uniforms:{...C0(),...H}});go.push(h,i);const u=new d.InstancedMesh(h,i,g);u.name="goats";const m=new d.Matrix4,x=new d.Quaternion,y=new d.Euler,b=new d.Vector3,A=new d.Vector3;for(let S=0;S<g;S++){const W=(S===4?5.9:7.3)+f()*1.1;A.set(r[S][0]+(f()-.5)*.3,10.24,r[S][1]+(f()-.5)*2),y.set(0,r[S][2]+(f()-.5)*.4,0),x.setFromEuler(y),b.set(W*1.14,W*.92,W*1.06),m.compose(A,x,b),u.setMatrixAt(S,m),p[S*4]=f(),p[S*4+1]=f(),p[S*4+2]=(S+.5)/g,p[S*4+3]=r[S][3]}h.setAttribute("iA",new d.InstancedBufferAttribute(p,4)),u.frustumCulled=!1,X.add(u)}await k.yield();const lo=48,N0=U0.makeFauna(X,{light:{sunDir:H.uSunDir.value.clone(),...x0.fauna}});{xo?N0.add(U0.makeHerd({rng:G.fork("calf"),species:"bison",count:1,size:6.5,center:[22,0,4],radius:6,roam:.4,pause:.4,coat:"#8a7462",blobShadow:!0})):G.fork("goats"),await k.yield();const o=B?{body:"#080c18",wingC:"#0c1224",belly:"#3c4870"}:{body:"#10141c",wingC:"#141a24",belly:"#e8e0d0"};N0.add(U0.makeFlock({rng:G.fork("sw1"),species:"swifts",count:8,size:5,speed:24,spread:[16,8,20],...o,closed:!0,route:[[-52,38,-80],[0,44,-110],[50,40,-150],[0,50,-200],[-50,42,-250],[0,46,-300],[46,40,-340],[0,56,-280],[-40,52,-200],[10,58,-120]]})),N0.add(U0.makeFlock({rng:G.fork("sw2"),species:"swifts",count:8,size:9,spread:[7,3.5,11],...o,cross:{path:S0,u:.52,lead:17,angle:74,side:1,height:3.5,offset:2,span:150,duration:lo}})),N0.add(U0.makeFlock({rng:k.core.makeRng("hif-sw3:"+k.seed),species:"swifts",count:3,size:8.5,spread:[3.5,2,6],...o,cross:{path:S0,u:.61,lead:20,angle:60,side:-1,height:4,offset:8,span:130,duration:lo}})),await k.yield(),B?N0.add(U0.makeFireflies({rng:G.fork("ff"),path:S0,uFrom:.1,uTo:.98,count:Math.round(340*T0*Xe),spread:36,clear:6,lift:[-24,16],size:.95,halo:2.4,color:"#ffc860",color2:"#ffe9a0"})):N0.add(U0.makeButterflies({rng:G.fork("bf"),path:S0,uFrom:.39,uTo:.95,count:Math.round(30*Xe),spread:22,clear:7,lift:[-9,10],size:7,roam:[8,3.5,.45,.03],varieties:[["#ffd21a","#141008"],["#ffe45a","#2a1c08"],["#f6c010","#0c0a06"]]}))}{const e=G.fork("ring"),o=[];for(let n=0;n<16;n++){const s=n/16*6.283+e()*.3,t=8.6+e()*3.4;o.push([-9.5+Math.cos(s)*t,34+Math.sin(s)*t*.9,t0.portalSeat.position.z+1.5+e()*7])}B?N0.add(U0.makeFireflies({rng:G.fork("ffr"),positions:o,count:40,size:.9,halo:2.2,color:"#ffc860",color2:"#ffe9a0"})):N0.add(U0.makeButterflies({rng:G.fork("bfr"),positions:o,count:16,size:7,roam:[2.6,2,.5,.03],varieties:[["#ffd21a","#141008"],["#ffe45a","#2a1c08"],["#fff2c0","#2a1c08"]]}))}let z0=null,co=null;if(Ke.rare){const e=w.makeAcc(),o=[.032,.032,.042],n=[.92,.9,.82],s=(l,a,h,f=8)=>w.bar(e,l.map(r=>c(r[0],r[1],r[2])),1,f,h,{taper:r=>a[r],up:c(0,1,.01)});s([[0,.08,2.9],[0,.14,2.3],[0,.2,1.5],[0,.24,.6],[0,.27,-.3],[0,.31,-1.1],[0,.37,-1.7],[0,.44,-2.15]],[.16,.52,.86,1.03,1.02,.86,.66,.5],o,10);for(const l of[-1,1])s([[l*.5,.36,-1.3],[l*.95,.42,-.6],[l*1,.4,.5],[l*.6,.3,1.3]],[.3,.5,.46,.2],o,7);s([[0,.4,-1.8],[0,.75,-2.7],[0,.95,-3.3]],[.52,.45,.5],[.46,.25,.09]),s([[0,.95,-3.2],[0,1,-3.7],[0,.95,-4.05]],[.5,.56,.36],[.52,.3,.1]),s([[0,.9,-3.9],[0,.78,-4.9],[0,.45,-5.8],[0,.12,-6.2]],[.37,.31,.18,.04],[.95,.66,.1]),s([[0,1.36,-3.45],[0,1.56,-4.1],[0,1.34,-4.75]],[.2,.4,.12],[.8,.05,.035]),s([[0,.5,-3.6],[0,.3,-4.05]],[.3,.2],[.1,.2,.6],6);const t=(l,a,h,f)=>{const r=l.length,g=l[0].length,p=e.n;for(let i=0;i<r;i++)for(let u=0;u<g;u++){const m=l[i][u],x=a(i,u);e.pos.push(m[0],m[1],m[2]),e.nrm.push(0,1,0),e.col.push(x[0],x[1],x[2]),e.uv.push(h(i,u),f)}for(let i=0;i<r-1;i++)for(let u=0;u<g-1;u++){const m=p+i*g+u,x=m+1,y=m+g,b=y+1;e.idx.push(m,y,x,x,y,b)}e.n+=r*g};for(let l=-3;l<=3;l++){const a=l*.2,h=5.3-.22*l*l,f=Math.sin(a),r=Math.cos(a),g=[],p=.2-.035*Math.abs(l),i=[0,.26,.34,.7,.93,1],u=[.2,.36,.4,.47,.4,.12];for(let x=0;x<i.length;x++){const y=1.6+h*i[x],b=f*y,A=.4+r*y,S=[];for(const W of[-1,0,1])S.push([b+r*u[x]*W,p-.05*i[x]*h*.2+.03*Math.abs(W),A-f*u[x]*W]);g.push(S)}const m=.88+.12*((l+3)%2);t(g,(x,y)=>x<2?o:x===2?[.3,.3,.3]:[n[0]*m*(y===1?1:.86),n[1]*m*(y===1?1:.86),n[2]*m*(y===1?1:.84)],()=>0,0)}for(const l of[-1,1]){const a=[];for(let f=0;f<=7;f++){const r=f/7,g=l*(.7+5*r),p=-1.5+.9*r*r,i=1.7-.5*r-.7*r*r*r,u=[];for(let m=0;m<=3;m++)u.push([g,.35+.22*Math.sin(r*3.1)-.1*(m/3),p+(i-p)*(m/3)]);a.push(u)}t(a,(f,r)=>r===3?[.06,.06,.075]:o,f=>f/7,l);for(let f=0;f<5;f++){const r=-.55+f*.32,g=-1+f*.62,p=l*5.55,i=l*(6.75-.22*f),u=.17;t([[[p,.3,r-u],[p,.3,r+u]],[[i,.3,g-u*.6],[i,.3,g+u*.6]]],()=>o,m=>m?1.22:.97,l)}}co=new d.ShaderMaterial({fog:!0,side:d.DoubleSide,uniforms:{...C0(),...H,uFlap:{value:0},uSheenK:{value:B?.6:1}},vertexShader:`#include <fog_pars_vertex>
attribute vec3 aCol; uniform float uFlap;
varying vec3 vCol; varying vec3 vWp; varying vec3 vWn;
void main() {
  vec3 pos = position; vec3 nrm = normal;
  float w = uv.x, side = uv.y;
  if (abs(side) > 0.5) {
    // the arm follows the shoulder; the hand lags behind it and folds a little on the upstroke
    float ang = (0.08 + 0.4 * sin(uFlap)) * w + 0.24 * sin(uFlap - 0.9) * w * w;
    float r = abs(pos.x) - 0.7, ca = cos(ang), sa = sin(ang);
    pos.x = side * (0.7 + r * ca); pos.y += r * sa;
    nrm = vec3(-side * sa, ca, 0.);
  } else if (pos.z > 1.8) {
    pos.y += 0.1 * (pos.z - 1.8) * sin(uFlap - 1.6);
  }
  vec4 wp = modelMatrix * vec4(pos, 1.);
  vWn = normalize(mat3(modelMatrix) * nrm);
  vCol = aCol; vWp = wp.xyz;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`#include <fog_pars_fragment>
${M0}
uniform float uSheenK;
varying vec3 vCol; varying vec3 vWp; varying vec3 vWn;
void main() {
  vec3 n = normalize(vWn);
  if (!gl_FrontFacing) n = -n;
  float coin = hifCoin(vWp);
  float ndl = max(dot(n, uSunDir), 0.);
  float dark = 1. - smoothstep(0.04, 0.2, max(vCol.r, max(vCol.g, vCol.b)));
  // white feathers take only a quarter of a coin, so the tail flashes without burning out
  float wht = smoothstep(0.4, 0.75, min(vCol.r, vCol.g));
  vec3 col = vCol * (hifShade(n, vWp) * mix(1., 0.8, wht) + uCoinCol * coin * (0.3 + 0.7 * ndl) * mix(1., 0.24, wht));
  // glossy black feathers: a blue-grey sheen from above, and a flash where a coin lands
  float upf = n.y * 0.5 + 0.5;
  col += dark * (vec3(0.03, 0.037, 0.058) * upf * upf * uSheenK + uCoinCol * coin * 0.035 * (0.3 + 0.7 * ndl));
  col += uGlaze * (0.6 + coin * 4.);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`}),z0=new d.Mesh(w.accGeometry(e),co),z0.name="hornbill",z0.frustumCulled=!1,z0.visible=!1,X.add(z0)}await k.yield();const W0=R0.fxGroup();X.add(W0.object);let be=null;const fo={x:18.5,z:-126},Co={x:20,z:-250},E0=H.uSunDir.value.clone();let De=null;{const e=Math.round(2600*T0),o=new Float32Array(e*3),n=new Float32Array(e*4),s=G.fork("dust");for(let a=0;a<e;a++)o[a*3]=s()-.5,o[a*3+1]=s()-.5,o[a*3+2]=s()-.5,n[a*4]=s(),n[a*4+1]=s(),n[a*4+2]=s(),n[a*4+3]=s();const t=new d.BufferGeometry;t.setAttribute("position",new d.BufferAttribute(o,3)),t.setAttribute("aSeed",new d.BufferAttribute(n,4)),t.boundingSphere=new d.Sphere(new d.Vector3,1e5),De=new d.ShaderMaterial({vertexShader:mt,fragmentShader:gt(M0),transparent:!0,depthWrite:!1,blending:d.CustomBlending,blendEquation:d.AddEquation,blendSrc:d.OneFactor,blendDst:d.OneFactor,uniforms:{...H,uCam:{value:new d.Vector3},uBox:{value:new d.Vector3(96,60,96)},uPx:{value:400},uSize:{value:.16},uDustCol:{value:new d.Vector3(...x0.dust)},uDustGain:{value:B?.8:1}}});const l=new d.Points(t,De);l.name="motes",l.frustumCulled=!1,l.renderOrder=3,X.add(l)}await k.yield();{const e=[[fo.x,44,fo.z],[-15,38,-232],[Co.x,42,Co.z],[-13,38,-128]],o=B?["#8a9ac8","#6a78a8","#b8c4e8"]:["#f0d49a","#c8a46a","#fff0c8"];for(let t=0;t<4;t++)W0.add(R0.makeParticles({rng:G.fork("shav"+t),preset:"leaves",time:P0,follow:!1,center:e[t],box:t===0?[3.6,62,9]:t===2?[4.2,62,34]:[7,62,12],count:Math.round((t===0?560:t===2?1e3:190)*T0),colors:o,size:t===0?[.7,1.5]:t===2?[.75,1.6]:[.5,1.15],velocity:[0,-5.5,0],intensity:B?.8:t===0?1.5:t===2?1.6:1.15,lightDir:E0}));await k.yield(),W0.add(R0.makeMist({rng:G.fork("smoke"),time:P0,count:Math.round(64*Math.max(T0,.8)),area:[120,36,600],center:[0,68,-190],size:[34,70],color:x0.smoke,opacity:B?.1:.085,drift:[.5,0,.9],flatten:.32,follow:!1})),await k.yield();const n=o0?1.3:1,s=B?{color:"#7a86b8",colorTop:"#56608e",shadowColor:"#2a3058",ambient:"#1a2040"}:{color:"#efe4cc",colorTop:"#d8ccb4",shadowColor:"#9a8a70",ambient:"#6a5a46"};for(const[t,l,a,h,f]of[[56,6.5,.75,-.45,1.2],[44,8,.75,-.45,1.2],[33,8.5,.75,-.45,1.2],[31,23,-.62,-.5,-.8],[30.5,11,.12,-1,.5]]){const r=l>10,g=t===30.5,p=R0.makeSmokeColumn({rng:g?k.core.makeRng("hif-steamF:"+k.seed):G.fork("steam"+t),time:P0,position:[I.x+f,I.y+I.r,t],height:l*(o0?1.2:1),radius:[1.3,g?3.4:r?5.2:3.6],size:[2.2,g?5.5:r?7.4:5.2],count:Math.round((r?38:24)*n),...s,hot:B?"#ff6a1c":o0?"#ff7226":"#ff7a30",hotFalloff:B?3.6:o0?10:7,opacity:(B?.3:.2)*n*(r?.95:1),rate:.1,wind:[a,0,h],bend:g?3:.6,sunDir:E0,sunColor:B?"#8aa0ff":"#fff0c8",rim:.7,scatter:.6});B&&p.uniforms&&p.uniforms.uHot&&p.uniforms.uHot.value.multiplyScalar(1.7),W0.add(p)}be=R0.makeSmokeColumn({rng:k.core.makeRng("hif-pksteam:"+k.seed),time:P0,position:[5,4,40],height:4.4,radius:[1.3,3.3],size:[2.4,5.4],count:34,...s,opacity:0,rate:.24,wind:[-.14,0,1],bend:3.2,sunDir:E0,sunColor:B?"#8aa0ff":"#fff0c8",rim:.7,scatter:.6}),W0.add(be),W0.add(R0.makeSmokeColumn({rng:G.fork("kettle"),time:P0,position:so[0].slice(0,3),height:9,radius:[.25,1.8],size:[.9,3.4],count:26,...s,opacity:.5,rate:.16,wind:[.1,0,-.25],bend:.3,sunDir:E0})),W0.add(R0.makeSmokeColumn({rng:G.fork("tea"),time:P0,position:[22.6,v.deck+1.5,-165.2],height:4.5,radius:[.9,1.6],size:[.6,1.8],count:22,...s,opacity:.38,rate:.2,wind:[.05,0,-.15],bend:.3,sunDir:E0})),await k.yield(),o0&&W0.add(R0.makeParticles({rng:G.fork("beads"),preset:"rain",time:P0,count:Math.round(2200*T0),box:[90,60,90],velocity:[0,-34,0],velocityRandom:[.6,5,.6],colors:["#dff0ff","#b8d8f0","#ffffff"],size:[.07,.14],intensity:.9,stretch:.035}))}let Fo=null;{const e=w.makeAcc();for(let s=31;s<69;s++){const t=-60-4.7*(s+.5),l=t0.halfBreadth(t,33)+1.2,a=7+4*(s*7%5)/5,h=e.n,f=s*.37%1;for(const[r,g,p,i]of[[l-a,23,0,0],[l,23,1,0],[l,44,1,1],[l-a,44,0,1]])e.pos.push(r,g,t+(p?0:2.5)),e.nrm.push(0,0,1),e.col.push(f,he(31,40,s),0),e.uv.push(p,i);e.idx.push(h,h+1,h+2,h,h+2,h+3),e.n+=4}const o=Fo=new d.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,side:d.DoubleSide,blending:d.AdditiveBlending,uniforms:{...C0(),uTime:H.uTime,uFar:{value:new d.Vector2(55,135)},uGlare:{value:new d.Color(B?"#1c3a6a":o0?"#7fb8c0":"#69d8cf").multiplyScalar(B?.4:o0?.28:.39)}},vertexShader:`#include <fog_pars_vertex>
attribute vec3 aCol; varying vec2 vUv; varying vec3 vCol;
void main(){ vUv = uv; vCol = aCol; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,fragmentShader:`#include <fog_pars_fragment>
uniform float uTime; uniform vec3 uGlare; uniform vec2 uFar; varying vec2 vUv; varying vec3 vCol;
void main() {
  float y = 2. * vUv.y - 1.;
  float a = vUv.x * vUv.x * (1. - y * y) * (1. - y * y);
  a *= 0.6 + 0.4 * sin(uTime * 1.7 + vCol.r * 40.) * sin(uTime * 0.9 + vCol.r * 17. + vUv.y * 6.);      // the water's glitter, come indoors
  gl_FragColor = vec4((uGlare + vec3(0.2) * uGlare.g * vUv.x * vUv.x) * a * vCol.g, 1.);
  #ifdef USE_FOG
    float ff = 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    // light in the near air only: far off the blades would pile up into a beam
    gl_FragColor.rgb *= (1. - ff) * smoothstep(4., 16., vFogDepth) * (1. - smoothstep(uFar.x, uFar.y, vFogDepth));
  #endif
}`}),n=new d.Mesh(w.accGeometry(e),o);n.name="glare",n.renderOrder=2,X.add(n)}{const e=w.makeAcc(),o=(i0.x0+i0.x1)/2,n=(i0.x1-i0.x0)/2+13,s=ee+3.2;for(const a of[-1,1]){const h=e.n;for(const[f,r,g,p]of[[o+a*n,13,0,0],[o,13,1,0],[o,45,1,1],[o+a*n,45,0,1]])e.pos.push(f,r,s),e.nrm.push(0,0,1),e.col.push(a*.21+.4,1,0),e.uv.push(g,p);e.idx.push(h,h+1,h+2,h,h+2,h+3),e.n+=4}const t=Fo.clone();t.uniforms.uTime=H.uTime,t.uniforms.uFar.value.set(700,900),t.uniforms.uGlare.value.copy(eo).multiplyScalar(B?1.6:1.15);const l=new d.Mesh(w.accGeometry(e),t);l.name="gap-haze",l.renderOrder=2,X.add(l)}{const e=w.makeAcc();for(const s of[fo]){const t=c(s.x,10,s.z),l=(u0(t.x+9)-t.y)/E0.y,a=t.clone().addScaledVector(E0,l);for(const[h,f]of[[1,0],[0,1]]){const r=e.n,g=2.9;for(const[p,i,u]of[[t,-1,0],[t,1,0],[a,1,1],[a,-1,1]])e.pos.push(p.x+h*i*g,p.y,p.z+f*i*g),e.nrm.push(0,1,0),e.col.push(1,1,1),e.uv.push(i,u);e.idx.push(r,r+1,r+2,r,r+2,r+3),e.n+=4}}const o=new d.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,side:d.DoubleSide,blending:d.AdditiveBlending,uniforms:{...C0(),uTime:H.uTime,uShaft:{value:H.uCoinCol.value.clone().multiplyScalar(B?.016:.04)}},vertexShader:`#include <fog_pars_vertex>
varying vec2 vUv; varying vec3 vWp;
void main(){ vUv = uv; vec4 wp = modelMatrix * vec4(position, 1.); vWp = wp.xyz; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,fragmentShader:`#include <fog_pars_fragment>
uniform float uTime; uniform vec3 uShaft; varying vec2 vUv; varying vec3 vWp;
void main() {
  float x = vUv.x;
  float a = 1. - x * x; a *= a;
  float streak = 0.62 + 0.38 * sin(x * 9. + 2. * sin(uTime * 0.21 + vUv.y * 3.)) * sin(x * 4.3 - uTime * 0.13);
  float lay = 0.62 + 0.38 * sin(vWp.y * 0.19 + uTime * 0.07 + vWp.z * 0.02);
  float h = smoothstep(0., 0.22, vUv.y) * (1. - 0.3 * vUv.y);
  gl_FragColor = vec4(uShaft * a * streak * lay * h, 1.);
  #ifdef USE_FOG
    float ff = 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    gl_FragColor.rgb *= (1. - ff * 0.85) * smoothstep(5., 20., vFogDepth);
  #endif
}`}),n=new d.Mesh(w.accGeometry(e),o);n.name="shaft",n.renderOrder=4,X.add(n)}W0.add(R0.makeParticles({rng:G.fork("petals"),preset:"petals",time:P0,follow:!1,center:[-2.5,22,-441],box:[20,42,20],count:Math.round(120*T0),colors:B?["#aab8e8","#8090c8","#d0d8ff"]:["#fff6e0","#ffe9b0","#ffffff"],size:[.32,.62],velocity:[.2,-1.7,.5],intensity:B?.7:1.1,lightDir:E0}));const ne=12,se=new Float32Array(9*ne*4),Ne=new d.Vector3;let Ge=null;{const e=new d.InstancedBufferGeometry,o=G.fork("puffs"),n=new Float32Array(9*ne*4);e.setAttribute("position",new d.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),e.setIndex([0,1,2,0,2,3]);for(let l=0;l<n.length;l++)n[l]=o();for(let l=0;l<9*ne;l++)se[l*4+3]=-1;e.setAttribute("aSeed",new d.InstancedBufferAttribute(n,4)),Ge=new d.InstancedBufferAttribute(se,4),Ge.setUsage(d.DynamicDrawUsage),e.setAttribute("aPeg",Ge),e.instanceCount=9*ne,e.boundingSphere=new d.Sphere(w.berthPos.clone(),40);const s=new d.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,uniforms:{...C0(),...H,uBX:{value:w.bX.clone()},uBY:{value:w.bY.clone()},uPuffCol:{value:new d.Color(B?"#7c8cc4":o0?"#dfe6e4":"#f6d9a4").multiplyScalar(B?.42:o0?.5:.6)}},vertexShader:`#include <fog_pars_vertex>
attribute vec4 aSeed; attribute vec4 aPeg; uniform vec3 uBX; uniform vec3 uBY;
varying vec2 vQ; varying float vA; varying vec3 vWp; varying float vSeed;
void main() {
  // aPeg.w: progress of the knock now landing on this peg (below 0: none). The mallet lands at 0.16.
  float age = clamp((aPeg.w - 0.16) / 0.84, 0., 1.);
  float e = 1. - (1. - age) * (1. - age);
  vec3 c = aPeg.xyz + uBY * (0.3 + 1.5 * e * aSeed.x) + (uBX * (aSeed.y - 0.5) * 2. + vec3(0., (aSeed.z - 0.35) * 2., 0.)) * 1.5 * e;
  c.y -= 1.5 * age * age;
  vec4 mvPosition = viewMatrix * vec4(c, 1.);
  float size = max((0.035 + 0.045 * aSeed.w) * (1. - 0.3 * age), 0.0019 * -mvPosition.z);
  // (a chip tumbles: its quad turns and narrows)
  float tw = aSeed.w * 40. + age * (4. + 9. * aSeed.x);
  vec2 q2 = vec2(position.x * (0.45 + 0.55 * abs(cos(tw * 0.7))), position.y);
  mvPosition.xy += vec2(q2.x * cos(tw) - q2.y * sin(tw), q2.x * sin(tw) + q2.y * cos(tw)) * size;
  vQ = position.xy; vSeed = aSeed.w; vWp = c;
  vA = step(0.16, aPeg.w) * smoothstep(0., 0.05, age) * (1. - smoothstep(0.6, 1., age));
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`#include <fog_pars_fragment>
${M0}
uniform vec3 uPuffCol; varying vec2 vQ; varying float vA; varying vec3 vWp; varying float vSeed;
void main() {
  float a = vA * (1. - smoothstep(0.7, 1., max(abs(vQ.x), abs(vQ.y))));
  vec3 col = uPuffCol * (0.7 + 0.5 * vSeed) * (1. + 0.6 * hifCoin(vWp)) + uGlaze;
  gl_FragColor = vec4(col, a * 0.95);
  #include <fog_fragment>
}`}),t=new d.Mesh(e,s);t.name="peg-dust",t.frustumCulled=!1,t.renderOrder=3,X.add(t)}await k.yield();const Q=(e,o,n)=>he(e,o,n),Wo=new d.Vector3,Ao=new d.Vector2,uo=new d.Vector3(0,0,-1),ho=S0.length,qe=[[0,0],[.6,.6],[.715,.69],[.803,.765],[.806,.8],[.87,.868],[1,1]],Oe=[.402,.418,.448,.461],Vo=B?.34:o0?.46:.42,To=e=>{let o=0;for(;o<qe.length-2&&e>qe[o+1][0];)o++;const n=qe[o],s=qe[o+1];return R(n[1],s[1],$0((e-n[0])/(s[0]-n[0]),0,1))},$o=c(21,33,-152),jo=c(20,36,-251),po=c(-9.5,34,-446),Lo=46.85-3.4,Ko=7.6,G0=new d.Vector3,we=new d.Vector3,Xo=new d.Vector3,vo=new d.Vector3,_o=new d.Vector3,Ue=new d.Vector3,Re=new d.Vector3,He=new d.Vector3,ze=new d.Vector3,ke=new d.Vector3,Po=new d.Vector3,Se=new d.Vector3,Bo=new d.Matrix4,Do=new d.Quaternion,No=new d.Euler,mo=(e,o)=>{const n=$0((e-.38)/.24,0,1),s=R(54,26,Q(0,.3,n))+30*Q(.74,1,n),t=R(40,5.5,Q(0,.2,n))+1.5*Math.sin(n*17)*Q(.3,.4,n)*(1-Q(.7,.8,n))-52*Q(.74,1,n),l=R(21,-3.2,Q(.04,.42,n))+.8*Math.sin(n*29)+15*Q(.76,1,n),a=e*ho+s;S0.posAtDist(a,o),S0.tangentAtDist(a,ze);const h=Math.hypot(ze.x,ze.z)||1;return o.x+=-ze.z/h*t,o.z+=ze.x/h*t,o.y+=l,o},Ie=(e,o)=>{let n=Math.atan2(e.x-G0.x,-(e.z-G0.z))-o;return n>Math.PI&&(n-=2*Math.PI),n<-Math.PI&&(n+=2*Math.PI),n*57.29578},Ee=e=>(S0.posAtDist(e*ho,G0),S0.posAtDist(e*ho+26,we),we.sub(G0).normalize(),Math.atan2(we.x,-we.z)),Ve=(e,o)=>{const n=Ie(po,o),s=Math.max(Lo-Math.atan2(Ko,Math.hypot(po.x-G0.x,po.z-G0.z))*57.29578,0);return $0(e,n-s,n+s)},$e=(e,o,n)=>{const s=n+e*.017453,t=Math.asin($0(we.y,-1,1))+o*.017453,l=Math.cos(t);return Xo.set(G0.x+Math.sin(s)*l*60,G0.y+Math.sin(t)*60,G0.z-Math.cos(s)*l*60)},Go=e=>z0?1-.55*Q(.4,.44,e)*(1-Q(.57,.62,e)):1;return{scene:X,path:S0,duration:lo,pace:e=>1+.1*Q(.2,.3,e)-.45*Q(.72,.8,e)+.3*Q(.9,.97,e),title:o0?"Ribs of the Unfinished Ship, Between Showers":B?"Ribs of the Unfinished Ship, the Night Before the Feast":L0?"Ribs of the Unfinished Ship, Late Light":"Ribs of the Unfinished Ship",camera:{fov:62,near:.5,far:1800,lookAhead:26,sway:.5,bank:.4},pois:[{at:(e,o)=>{const n=Ee(o),s=Go(o);return $e(Ve($0(Ie($o,n),0,60),n)*s,(1.5+2.5*Q(.45,.49,o))*s,n)},from:.375,to:.505,weight:1,fade:.3},{at:(e,o)=>{const n=Ee(o),s=Go(o);return $e(Ve($0(Ie(jo,n),0,60),n)*s,0,n)},from:.545,to:.66,weight:1,fade:.3},{at:(e,o)=>{const n=Ee(o);return $e(Ve(0,n),-23,n)},from:.655,to:.75,weight:1,fade:.4},{at:(e,o)=>{const n=Ee(o),s=$0((To(o)-w.PEG_U0)/w.PEG_DU,0,8),t=Math.min(Math.floor(s),7);return w.pegAt(t,vo),w.pegAt(t+1,_o),vo.lerp(_o,Q(0,1,s-t)),$e(Ve($0(Ie(vo,n),-80,0),n),-5,n)},from:.745,to:.915,weight:1,fade:.265}],portal:{shape:"circle",radius:7,color:B?"#8fd8e8":"#6fd8d0",glow:B?.8:.9,revealDistance:430,blendDistance:60},post:{exposure:x0.exposure,bloom:{strength:.4,radius:.6,threshold:1},grade:{saturation:x0.sat,contrast:1.05,tint:x0.tint,shadowTint:x0.shadow,vignette:.3,grain:.02,aberration:0}},ride:"none",style:"none",companion:"none",update(e,o,n,s){P0.value=o;const t=s;s=To(s),f0.ride.left=4,f0.ride.down=5,f0.ride.rise=4,f0.ride.ahead=10,f0.rudder.yaw=-.46+.5*Q(.012,.075,t)-.38*Q(.12,.2,t),S0.tangentAt(t,uo),uo.y=0,f0.setProgress(s,uo),f0.update(e,o,n);{const a=Q(.11,.15,t)*(1-Q(.255,.33,t));w.plankAt(12.5,.2,0,be.uniforms.uBase.value),be.uniforms.uOpacity.value=Vo*a,be.object.visible=a>.004}if(Io.visible=s>.12&&!k.through,n.getWorldPosition(Wo),k.renderer.getDrawingBufferSize(Ao),De.uniforms.uCam.value.copy(Wo),De.uniforms.uPx.value=.5*Ao.y*n.projectionMatrix.elements[5],N0.update(e,o,n,t),W0.update(e,o,n),z0){const a=t>.378&&t<.622;if(z0.visible=a,a){mo(t-.004,Re),mo(t+.004,He),mo(t,Ue),Se.subVectors(Re,He).normalize(),ke.set(Se.z,0,-Se.x).normalize(),Po.crossVectors(Se,ke),Bo.makeBasis(ke,Po,Se),z0.quaternion.setFromRotationMatrix(Bo);const h=(Re.x+He.x-2*Ue.x)*ke.x+(Re.z+He.z-2*Ue.z)*ke.z;No.set(.05*Math.sin(o*5.2-1.2),0,-Math.atan(h)),Do.setFromEuler(No),z0.quaternion.multiply(Do),z0.position.copy(Ue),z0.position.y-=.3*Math.sin(o*5.2-.5);const f=Math.max(.02,Q(.378,.39,t)*(1-Q(.61,.622,t)));z0.scale.setScalar(f),co.uniforms.uFlap.value=o*5.2}}xe.rotation.set(.05*Math.sin(o*.9),0,.035*Math.sin(o*1.3+1));const l=ye.children;l[0].rotation.set(.018*Math.sin(o*.5),.25*Math.sin(o*.31),.015*Math.sin(o*.43+2)),l[1].rotation.set(.017*Math.sin(o*.47+1),.4*Math.sin(o*.23+2),.022*Math.sin(o*.55)),ro.uniforms.uWing.value=Q(Oe[0],Oe[1],t)*(1-Q(Oe[2],Oe[3],t));for(let a=0;a<9;a++){const h=w.knock(s,a),f=h>0&&h<3?h-Math.floor(h):-1;w.pegAt(a,Ne);for(let r=0;r<ne;r++){const g=(a*ne+r)*4;se[g]=Ne.x,se[g+1]=Ne.y,se[g+2]=Ne.z,se[g+3]=f}}Ge.needsUpdate=!0},dispose(){for(const e of go)e.dispose()}}}};export{At as default};
