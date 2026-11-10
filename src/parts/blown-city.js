import*as e from"three";import{clamp as Z,lerp as V,smoothstep as R}from"../kit/core.js";const ke=["#EDE7DC","#8EC9B8","#1E4FA8","#C2183A","#F2A62E","#FF6A1A","#7B4BB0"],B=95,$=75,N=1.9,K=7,ue=175,he=`
float h11(float n){ return fract(sin(n * 127.1) * 43758.5453); }
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float h31(vec3 p){ p = fract(p * vec3(0.1031, 0.1130, 0.0973)); p += dot(p, p.yzx + 33.33); return fract((p.x + p.y) * p.z); }
float vn3(vec3 p){
  vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  float a = mix(mix(h31(i), h31(i + vec3(1,0,0)), f.x), mix(h31(i + vec3(0,1,0)), h31(i + vec3(1,1,0)), f.x), f.y);
  float b = mix(mix(h31(i + vec3(0,0,1)), h31(i + vec3(1,0,1)), f.x), mix(h31(i + vec3(0,1,1)), h31(i + vec3(1,1,1)), f.x), f.y);
  return mix(a, b, f.z);
}
float vn2(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1,0)), f.x), mix(h21(i + vec2(0,1)), h21(i + vec2(1,1)), f.x), f.y);
}
// caustic net: bright thin lines where two voronoi cells meet
float caustNet(vec2 p){
  vec2 i = floor(p), f = fract(p); float d1 = 8., d2 = 8.;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y)); float n = h21(i + g);
    vec2 o = g + vec2(n, fract(n * 57.31)) - f; float d = dot(o, o);
    if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; }
  }
  float e = sqrt(d2) - sqrt(d1);
  return 1. - smoothstep(0.0, 0.22, e);
}
float caustic2(vec2 p, float t){
  float a = caustNet(p * 0.55 + vec2(t * 0.11, t * 0.07));
  float b = caustNet(p * 0.83 + vec2(-t * 0.09, t * 0.13) + 3.7);
  return a * b * 2.6 + (a + b) * 0.22;
}
// hot glass: 0 cold .. 1 white-orange
vec3 heatRamp(float h, vec3 amber, vec3 orange){
  vec3 c = vec3(0.55, 0.05, 0.01) * smoothstep(0.0, 0.25, h);
  c = mix(c, amber * 1.9, smoothstep(0.18, 0.5, h));
  c = mix(c, orange * 3.1, smoothstep(0.4, 0.78, h));
  c = mix(c, vec3(1.0, 0.72, 0.42) * 5.0, smoothstep(0.78, 1.0, h));
  return c;
}
`,tt=`
uniform sampler2D uHouse;
uniform vec4 uQ;        // q0, 1 / range, tan(sun elevation), half width of the bridge wash
uniform vec4 uSunPH;    // xy: unit vector across the light in plan, zw: unit vector along the light in plan
uniform vec4 uBridge;   // xz of both ends of the great bridge
uniform vec3 uBridgeCol;
uniform vec4 uBoat;     // xz of our boat, xz of its heading
uniform vec4 uWave;     // x: radius of the beams-on wave from the canal mouth, y: strength before it, z: wake gain, w: overall gain
uniform vec2 uMouth;
uniform sampler2D uShaft;   // per cell two texels: (q, Y, radius, where it starts along the light) and (colour, how far it reaches)
uniform vec4 uShaftQ;       // q0, 1 / q range, Y0, 1 / Y range
uniform vec4 uShaftN;       // rows of cells, cos(sun elevation) of the harp's own sun, strength, how far the sun has climbed (0: side canal, 1: grand canal)
vec4 cityLight(vec3 P){
  float q = P.x * uSunPH.x + P.z * uSunPH.y;
  float t = clamp((q - uQ.x) * uQ.y, 0.002, 0.998);
  vec4 a = texture2D(uHouse, vec2(t, 0.25));
  vec4 b = texture2D(uHouse, vec2(t, 0.75));
  float d = P.x * uSunPH.z + P.z * uSunPH.w - b.r;
  float yb = P.y + d * uQ.z;
  float reach = mix(b.g, b.b, uShaftN.w);
  float m = smoothstep(0.5, 4., d) * (1. - smoothstep(a.a - 5., a.a, yb)) * smoothstep(1., 6., a.a) * (1. - smoothstep(reach * 0.75, reach, d));
  return vec4(a.rgb, m);
}
float cityOn(vec3 P){
  float dm = distance(P.xz, uMouth);
  return mix(uWave.y, 1., smoothstep(uWave.x, uWave.x - 40., dm)) * uWave.w;
}
float bridgeWash(vec3 P){
  vec2 pa = P.xz - uBridge.xy, ba = uBridge.zw - uBridge.xy;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-3), 0., 1.);
  return (1. - smoothstep(uQ.w * 0.35, uQ.w, length(pa - ba * h))) * (1. - smoothstep(8., 10., P.y));
}
// The harp: the light of every pane that throws a string across the grand canal, as a disc in the plane across the light (the
// pool it lays on the water is that disc's foot; the string seen in the air is only its bright core). A point knows its place
// across the light (q) and the height its own ray of light had at the plane al = 0 (Y); the lookup holds, per cell of (q, Y),
// the one pane that can reach it. Returns the pane's colour and how deep the point stands in its light: whatever glass or
// water is there takes the colour (the water, a gondola, a pole): full over the inner two thirds, a soft rim outside.
vec4 shaftLight(vec3 P){
  float ce = clamp(uShaftN.y, 0.05, 1.), te = sqrt(1. - ce * ce) / ce;          // (the harp stands along the sun of the grand canal, wherever the sun is now)
  float q = P.x * uSunPH.x + P.z * uSunPH.y, al = P.x * uSunPH.z + P.z * uSunPH.w, Y = abs(P.y) + al * te;
  vec2 t = vec2((q - uShaftQ.x) * uShaftQ.y, (Y - uShaftQ.z) * uShaftQ.w);
  float row = floor(clamp(t.y, 0., 0.999) * uShaftN.x), tx = clamp(t.x, 0.001, 0.999);
  vec4 a = texture2D(uShaft, vec2(tx, (row * 2. + 0.5) / (uShaftN.x * 2.)));
  vec4 b = texture2D(uShaft, vec2(tx, (row * 2. + 1.5) / (uShaftN.x * 2.)));
  vec2 dv = vec2(q - a.x, (Y - a.y) * uShaftN.y) / max(a.z, 0.5);
  float m = clamp(1. - dot(dv, dv), 0., 1.) * step(0.5, a.z) * step(abs(t.x - 0.5), 0.5) * step(abs(t.y - 0.5), 0.5);
  float d = al - a.w;
  m = smoothstep(0., 0.5, m) * smoothstep(0.6, 3., d) * (1. - smoothstep(b.a - 2.5, b.a, d));
  m *= (1. - smoothstep(uWave.x - 40., uWave.x, distance(P.xz, uMouth))) * uShaftN.z;
  return vec4(b.rgb, clamp(m, 0., 1.));
}
float wakeLadder(vec3 P, float t){
  vec2 rel = P.xz - uBoat.xy;
  float al = dot(rel, uBoat.zw), la = abs(rel.x * uBoat.w - rel.y * uBoat.z);
  float k = (al - 9.) / 13.;
  float wk = exp(-k * k) * exp(-la * 0.06) * exp(-max(P.y, 0.) * 0.9);
  float lad = smoothstep(0.94, 0.995, sin(P.y * 4.4 - t * 3.3 + al * 0.6 + 1.6 * sin(al * 0.5 + t * 0.7)));
  return wk * lad * smoothstep(0.35, 0.65, vn2(vec2(al * 0.9 - t * 1.5, P.y * 0.7)));
}
`,ot=`
void cityPattern(float pid, vec2 uv, float aa, out float pT, out float pane, out float white, out float gold, out vec2 pN, out float pGrad){
  pT = 0.; pane = 0.; white = 0.; gold = 0.; pN = vec2(0.); pGrad = 0.;
  if (pid < 0.5) return;
  if (pid < 1.5) {                                    // 1: bullseye rondels set in lead
    vec2 c = fract(uv / 0.8) - 0.5; float r = length(c), k = aa / 0.8;
    float disc = 1. - smoothstep(0.43 - k, 0.43 + k, r);
    pT = (1. - disc) * 0.85 + disc * 0.3 * (1. - smoothstep(0.02, 0.13, r));
    pN = c / max(r, 1e-3) * disc * sin(r * 46.) * 0.3 * (1. - smoothstep(0.02, 0.2, k));
    pane = disc;
  } else if (pid < 2.5 || (pid > 3.5 && pid < 4.5)) {  // 2: pointed windows, 4: pointed arcade
    bool arc = pid > 3.;
    vec2 cell = arc ? vec2(3.4, 5.2) : vec2(2.6, 4.2);
    vec2 p = vec2((fract(uv.x / cell.x) - 0.5) * cell.x, fract(uv.y / cell.y) * cell.y);
    float w = arc ? 1.15 : 0.72, ys = arc ? 2.7 : 2.25, y0 = arc ? -1. : 0.85;
    float ax = abs(p.x);
    float dBox = max(ax - w, max(y0 - p.y, p.y - ys));
    float dArc = max(length(vec2(ax + w, p.y - ys)) - 2. * w, ys - p.y);
    float d = min(dBox, dArc);
    float fw = arc ? 0.14 : 0.085;
    float frame = 1. - smoothstep(fw - aa, fw + aa, abs(d));
    float inside = 1. - smoothstep(-aa, aa, d);
    float lat = min(abs(fract((p.x + p.y) / 0.9) - 0.5), abs(fract((p.x - p.y) / 0.9) - 0.5)) * 0.9;      // the arcade's panes are leaded in diamonds
    float mull = arc ? inside * (1. - smoothstep(0.055 - aa, 0.055 + aa, lat)) * (1. - smoothstep(0.2, 0.7, aa)) : inside * (1. - smoothstep(0.035 - aa, 0.035 + aa, min(ax, abs(p.y - ys))));
    vec2 e = vec2(ax - cell.x * 0.5, p.y - (ys + w * 1.15));
    float re = length(e);
    float eye = 1. - smoothstep(0.06 - aa, 0.06 + aa, abs(re - 0.3));              // the roundel in each spandrel: a thick frame, so it is a window and not a drawn circle
    float eyeIn = 1. - smoothstep(0.3 - aa, 0.3 + aa, re);
    white = 1. - smoothstep(0.05 - aa, 0.05 + aa, abs(p.y - (cell.y - 0.2)));
    pT = max(frame, max(mull, eye)) * 0.9 + (1. - inside) * (1. - eyeIn) * 0.26;
    pane = max(inside * (1. - mull), eyeIn);
    if (arc) { pT += inside * 0.3 * (1. - mull); pane = inside * (1. - mull) * 0.6; }
    else pT -= pane * (1. - frame) * 0.2;                                      // the pane is the thinnest glass of the wall: lighter, and seen through
    pGrad = inside * clamp((ys + w - p.y) / (ys + w - y0), 0., 1.);           // 0 at the head of the window, 1 at its sill
    // seeds: small bubbles caught in the wall, each a bright ring
    vec2 bg = uv / 0.9, bi = floor(bg), bf = fract(bg) - 0.5; float bh = h21(bi + 5.1);
    bf -= (vec2(bh, fract(bh * 13.7)) - 0.5) * 0.5;
    float br = length(bf) * 0.9, bk = (1. - smoothstep(0.1, 0.3, aa)) * step(0.7, bh) * (1. - inside) * (1. - frame);
    float bring = (1. - smoothstep(0.014, 0.02 + aa, abs(br - 0.095))) * bk;
    white = max(white, bring * 0.05); pN += bf / max(length(bf), 1e-3) * bring * 0.3;      // a seed is a glint on its rim, not a drawn circle
    pT -= (1. - smoothstep(0.07, 0.095, br)) * bk * 0.12;
  } else if (pid < 3.5) {                             // 3: reeded
    float f = fract(uv.x / 0.42) - 0.5;
    pN.x = f * 1.3 * (1. - smoothstep(0.1, 0.5, aa / 0.42)); pT = abs(f) * 0.5;
  } else if (pid < 6.5) {                             // 5: white-thread cane, 6: barber stripes
    float s = uv.x + uv.y * (pid < 5.5 ? 0.9 : 0.55);
    float f = abs(fract(s) - 0.5), ka = aa * 1.2;
    float wdt = pid < 5.5 ? 0.14 : 0.25;
    white = 1. - smoothstep(wdt - ka, wdt + ka, f);
    white = mix(white, pid < 5.5 ? 0.28 : 0.5, smoothstep(0.15, 0.6, ka));
  } else if (pid < 7.5) { gold = 1.; }                // 7: gold leaf
  else if (pid < 8.5) {                               // 8: ribs and gold flecks
    vec2 g = floor(uv / 0.7), c = fract(uv / 0.7) - 0.5; float h = h21(g + 3.3);
    c -= (vec2(h, fract(h * 7.3)) - 0.5) * 0.55;
    gold = (1. - smoothstep(0.10, 0.12 + aa / 0.7, length(c))) * step(0.5, h) * (1. - smoothstep(0.2, 0.7, aa / 0.7));
    pN.x = sin(uv.x * 3.1416) * 0.35; pT = 0.1 * (0.5 + 0.5 * cos(uv.x * 3.1416));
  } else if (pid < 9.5) {                             // 9: glass handkerchief, flashing as it swings
    vec2 c = abs(uv - 0.5); float e = max(c.x, c.y);
    pT = smoothstep(0.36, 0.42, e) * 0.8;
    pN = 0.55 * vec2(sin(uTime * 2.3 + vWP.x * 1.3 + vWP.z * 0.7), cos(uTime * 1.7 + vWP.x * 0.9 + vWP.z));
  }
}
`,at=`
#include <common>
#include <fog_pars_vertex>
attribute float thick;
uniform float uTime, uClip, uSteel;
#ifdef CITY
attribute vec3 uvp;               // x, y: surface coordinates in metres, z: pattern id (+20 = absolute colour, no instance tint)
attribute float sway;             // metres of wind sway (hanging things); negative = fast tremble (leaves, beads)
varying vec3 vUvP;
#endif
#ifdef MORPH
attribute vec3 aMorph;            // x: height 0 foot .. 1 pipe, y: radius / outer radius, z: 1 on the bottom cap
uniform float uU, uLen, uBlobR, uBreath, uSwell, uCool, uTopY, uHeatMax;
float blobR(float t){ float tb = 1. - clamp(t, 0., 1.); return uBlobR * (0.3 + 0.7 * smoothstep(0., 0.85, tb)); }
#endif
varying vec3 vWP, vN, vTint;
varying float vThick, vHeat, vT, vRD, vNy;
varying vec2 vAx;
void main(){
  vec3 p = position, n = normal;
  float heat = 0.; vT = 0.; vRD = 0.; vAx = vec2(1., 0.);
  #ifdef MORPH
    float t = aMorph.x, k = aMorph.y, cap = aMorph.z;
    float form = smoothstep(0.48 + 0.25 * t, 0.66 + 0.20 * t, uU);
    float rf = length(p.xz);
    vec2 d = rf > 1e-4 ? p.xz / rf : vec2(1., 0.);
    float tb = 1. - t, bx = (tb - uBreath) * 4.5;
    float swell = 1. + uSwell * (0.13 * exp(-bx * bx) + 0.035 * sin(uBreath * 6.2832)) * (0.35 + 0.65 * (1. - form * 0.6));
    float b0 = blobR(t);
    float r = mix(b0 * k, rf, form) * swell;
    float y = uTopY - (uTopY - p.y) * uLen;
    float hemi = sqrt(max(1. - k * k, 0.));
    y -= cap * hemi * blobR(0.) * 0.85 * (1. - form);
    p = vec3(d.x * r, y, d.y * r);
    float slope = (blobR(t + 0.01) - blobR(t - 0.01)) / 0.02 / max(uTopY * uLen, 1.) * k;
    vec3 nb = normalize(vec3(d.x, -slope, d.y));
    nb = normalize(mix(nb, vec3(d.x * k, -hemi - 0.02, d.y * k), cap));
    n = normalize(mix(nb, n, form) + vec3(0., 1e-3, 0.));
    heat = uHeatMax * smoothstep(uCool - 0.2, uCool + 0.2, t + 0.03 * sin(atan(d.y, d.x + 1e-5) * 3. + t * 31.)) * (0.86 + 0.14 * smoothstep(0.5, 1., t));
    vT = t; vAx = d;
  #endif
  vTint = vec3(1.);
  #ifdef USE_COLOR
    vTint *= color;
  #endif
  vec4 lp = vec4(p, 1.);
  #ifdef USE_INSTANCING
    lp = instanceMatrix * lp;
    n = mat3(instanceMatrix) * n;
  #endif
  #ifdef USE_INSTANCING_COLOR
    #ifdef CITY
      if (uvp.z < 19.5) vTint *= instanceColor;
    #else
      vTint *= instanceColor;
    #endif
  #endif
  vec4 wp = modelMatrix * lp;
  if (uSteel > 0.5) {
    vec3 nw = normalize(mat3(modelMatrix) * n + vec3(0., 1e-5, 0.)); wp.xyz += nw * clamp(distance(cameraPosition, wp.xyz) * 0.0042 - 0.4, 0., 1.6);
    vT = length(position.xz) > 4. ? max(position.y, 0.6) : 0.;                 // the pontil (off the tower's axis): its height, so it can melt into the fog well inside the frame
    vRD = distance(position.xz, vec2(0., 75.));                                 // how far from the ring it has leaned: its mirror image is kept only beside the ring
  }
  #ifdef CITY
    vUvP = uvp;
    float sph = (wp.x + wp.z) * 0.35, sAmp = abs(sway), sRate = sway < 0. ? 3.7 : 1.;
    float gust = 0.55 + 0.45 * sin(uTime * 0.41 + sph * 0.23);
    wp.xyz += sAmp * gust * vec3(sin(uTime * 1.9 * sRate + sph), 0.25 * sin(uTime * 2.7 * sRate + sph * 1.7), cos(uTime * 1.55 * sRate + sph * 1.3));
  #endif
  #ifdef SELFMIRROR
    if (wp.y < 0.) { float dq = clamp(-wp.y * 0.12, 0., 1.5); wp.x += sin(wp.y * 1.9 + uTime * 1.7 + wp.z) * 0.16 * dq; wp.z += sin(wp.y * 2.3 - uTime * 1.3 + wp.x) * 0.12 * dq; }
  #endif
  // ripples in the mirrored copy
  if (uClip > 1.5) { float dp = clamp(-wp.y * 0.08, 0., 1.5) * (1. - 0.7 * uSteel); wp.x += sin(wp.y * 0.9 + uTime * 1.7) * 0.28 * dp; wp.z += sin(wp.y * 1.3 - uTime * 1.3) * 0.2 * dp; }
  vWP = wp.xyz;
  vN = normalize(mat3(modelMatrix) * n + vec3(0., 1e-5, 0.));
  vThick = thick; vHeat = heat;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  vNy = gl_Position.y / max(gl_Position.w, 1e-3);          // height in the frame, -1..1
  #include <fog_vertex>
}`,it=`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uTint, uFogCol, uLagoon, uSunDir, uSunCol, uCausticCol, uAmber, uOrange;
uniform float uTime, uClip, uLid, uThick, uInterior, uCore, uHeatAll, uCausticAmp, uCausticGain, uOpacity, uSteel, uLift, uRim, uSpec;
varying vec3 vWP, vN, vTint;
varying float vThick, vHeat, vT, vRD, vNy;
varying vec2 vAx;
${he}
#ifdef MORPH
uniform float uHotCap;
#endif
#ifdef CITY
varying vec3 vUvP;
uniform float uInner;
uniform vec3 uRake;
${tt}
${ot}
#endif
void main(){
  #ifdef CITY
    float pid = vUvP.z > 19.5 ? vUvP.z - 20. : vUvP.z;
    float paa = (abs(dFdx(vUvP.x)) + abs(dFdy(vUvP.x)) + abs(dFdx(vUvP.y)) + abs(dFdy(vUvP.y))) * 0.7 + 1e-4;
  #endif
  #ifdef CITY
    if (pid > 9.5 && pid < 10.5 && paa < 0.1) {                                // 10: balustrade of drawn rod: the gaps are cut out
      float bar = abs(fract(vUvP.x / 0.26) - 0.5);
      if (bar < 0.32 && vUvP.y > 0.09 && vUvP.y < 0.9) discard;
    }
  #endif
  if (uClip > 1.5) { if (vWP.y > -0.02) discard; } else if (uClip > 0.5) { if (vWP.y < -0.12) discard; }
  // the mirror image of the far pipes would be fogged by its own distance and lie on the near water as a pale hairline: let it go
  if (uSteel > 0.5 && uClip > 1.5 && h21(gl_FragCoord.xy * 0.37 + 1.5) < max(smoothstep(60., 140., distance(cameraPosition, vWP)), vT > 0.5 ? smoothstep(12., 30., vRD) : 0.)) discard;
  float lidOut = smoothstep(uLid + 12., uLid + 62., abs(vWP.y));
  if (uSteel > 0.5 && vT > 0.5) lidOut = max(lidOut, smoothstep(uLid * 0.15, uLid * 0.34, vT));        // the pontil comes down out of the fog: it is gone before it could leave the frame as a bare line
  // the blowpipe above the tower goes up into the fog before it can leave the frame as a bare line
  if (uSteel > 0.5 && uClip < 1.5 && vT < 0.5) {
    lidOut = max(lidOut, smoothstep(0.3, 0.8, vNy) * smoothstep(99., 116., vWP.y));
    lidOut = max(lidOut, smoothstep(240., 380., distance(cameraPosition, vWP)) * smoothstep(106., 136., vWP.y));   // and seen from far down the canal it is gone into the fog a little above the hot star: a dark stem, not a pale bar up the sky
  }
  if (lidOut > 0.02 && h21(gl_FragCoord.xy * 0.37 + 0.5) < lidOut) discard;
  vec3 V = normalize(cameraPosition - vWP + vec3(0., 1e-4, 0.));
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
  if (!gl_FrontFacing) N = -N;
  #ifdef CITY
    float pT, pane, white, gold, pGrad; vec2 pN;
    cityPattern(pid, vUvP.xy, paa, pT, pane, white, gold, pN, pGrad);
    if (pid > 0.5 && pid < 4.5 && !(pid > 2.5 && pid < 3.5)) pN += (vec2(vn2(vUvP.xy * 0.7), vn2(vUvP.xy * 0.7 + 17.)) - 0.5) * 0.16;   // hand-blown walls are reamy: the highlight and what is seen through them drift as we pass
    if (abs(N.y) < 0.92) {
      vec3 Tn = normalize(cross(vec3(0., 1., 0.), N) + vec3(1e-4, 0., 0.)), Bn = cross(N, Tn);
      N = normalize(N + Tn * pN.x + Bn * pN.y);
    }
  #endif
  float sgn = uClip > 1.5 ? -1. : 1.;                 // mirrored copy: light it as its upright self
  vec3 L = normalize(vec3(uSunDir.x, uSunDir.y * sgn, uSunDir.z));
  float ndv = min(abs(dot(N, V)), 1.);
  float fres = pow(1. - ndv, 4.);
  vec3 tint = clamp(uTint * vTint, 0.012, 1.);
  float depth = clamp(uThick + vThick + (1. - ndv) * (1. - ndv) * 0.55, 0., 1.6);
  float milky = 0.;
  #ifdef CITY
    // milk glass has an opal body: near-white tints turn celadon-blue where the glass is thick, and carry a stronger rim
    milky = smoothstep(0.42, 0.6, min(tint.r, min(tint.g, tint.b))) * step(vUvP.z, 19.5);
    tint = mix(tint, tint * vec3(0.56, 0.86, 1.0), milky * smoothstep(0.25, 1.0, depth + pT));
    tint = mix(tint, vec3(0.93, 0.91, 0.86), white);
    float ream = pid > 0.5 && pid < 4.5 && !(pid > 2.5 && pid < 3.5) ? (vn2(vUvP.xy * vec2(0.45, 0.22) + 5.) - 0.5) * 0.3 : 0.;     // and never one even thickness: the colour pools and thins in slow vertical drifts
    depth = clamp(mix(depth + pT + 0.12 * milky + ream, 0.12, white), 0., 1.7);
  #endif
  // what is seen through it: fog above, lagoon below
  vec3 T = normalize(-V - N * 0.45);
  float g = T.y * sgn + (vn3(vWP * 0.11) - 0.5) * 0.22;
  vec3 through = mix(mix(uLagoon, uFogCol, uLift), uFogCol, smoothstep(-0.2, 0.14, g)) * 0.86;
  #ifdef CITY
    // a flat wall a few metres from the eye keeps one depth of colour: the pearl-over-lagoon gradient would lie on it as pale see-through panes
    if (pid > 0.5 && pid < 4.5 && !(pid > 2.5 && pid < 3.5)) through = mix(through, mix(uLagoon, uFogCol, 0.4) * 0.86, 0.6 * (1. - smoothstep(9., 24., distance(cameraPosition, vWP))));
  #endif
  vec3 q = vWP - V * (2.6 / max(ndv, 0.3));
  float fl = smoothstep(0.40, 0.48, abs(fract(q.y / 4.2) - 0.5));
  float cm = smoothstep(0.41, 0.48, abs(fract((q.x + q.z) / 3.3) - 0.5));
  through *= 1. - uInterior * 0.4 * max(fl, cm) * smoothstep(0.1, 0.42, ndv);          // seen at a grazing angle the floors behind a wall would smear into pale blotches: let them go
  #ifdef CITY
    through = mix(through * (1. + 0.22 * pane), uLagoon * 0.74, pGrad * 0.6);     // each pane: fog pearl at its head, lagoon at its sill
    float lampK = 1.;
    if (pid > 3.5 && pid < 4.5) {                                                 // the arcade: a deeper head to every pane, and by lantern a warm pool low in its centre
      through *= mix(1., 0.75 + 0.25 * pGrad, pane);
      vec2 lp = vec2((fract(vUvP.x / 3.4) - 0.5) * 3.4, fract(vUvP.y / 5.2) * 5.2 - 1.2);
      lampK = 0.35 + 0.9 * exp(-dot(lp, lp) * 0.35);
    }
  #endif
  vec3 body = through * pow(tint, vec3(0.3 + 1.9 * depth));
  body *= mix(1., 0.42, uCore * ndv * ndv);
  float wrap = 0.5 + 0.5 * dot(N, L);
  body *= 0.72 + 0.4 * wrap;
  // light coming through it from the sun side
  float bl = max(dot(-V, L), 0.); bl = bl * bl; bl = bl * bl;
  vec3 col = body + pow(tint, vec3(0.55)) * uSunCol * bl * 1.4 * (1. - 0.3 * depth);
  // bright rim, sun glint, window streak
  float fr = fres;
  #ifdef CITY
    if (pid > 0.5 && pid < 4.5 && !(pid > 2.5 && pid < 3.5)) fr = min(fres, mix(0.6, 0.3, smoothstep(6., 12., distance(cameraPosition, vWP))));          // a flat wall seen along its length keeps its colour: the bright rim belongs to edges and curved glass
  #endif
  col += uFogCol * (0.03 + uRim * fr * (1. + 0.6 * milky));
  vec3 H = normalize(L + V + vec3(0., 1e-4, 0.));
  float nh = max(dot(N, H), 0.);
  col += uSunCol * (pow(nh, 700.) * 9. + pow(nh, 70.) * 0.35) * uSpec;
  vec3 Rv = reflect(-V, N);
  vec3 Wd = normalize(vec3(-L.z, 0.42, L.x));
  vec3 Wr = normalize(cross(vec3(0., 1., 0.), Wd)), Wu = cross(Wd, Wr);
  float wa = dot(Rv, Wr), wb = dot(Rv, Wu);
  float wob = vn3(vWP * 1.3) - 0.5; wa += wob * 0.03; wb += wob * 0.12;       // hand-blown glass: the window's reflection wavers, it is never a ruled pane
  float streak = step(0., dot(Rv, Wd)) * (1. - smoothstep(0.03, 0.045, abs(wa))) * (1. - smoothstep(0.33, 0.37, abs(wb))) * smoothstep(0.006, 0.014, abs(wb - 0.07));
  vec3 dN = fwidth(vN); streak *= mix(0.12, 1., clamp((dN.x + dN.y + dN.z) * 30., 0., 1.));       // the long streak belongs to curved glass (columns, domes, hulls): on a flat wall it would hang there as a ghost pane
  col += uFogCol * streak * 1.9 * uSpec;
  // caustics laid on it by glass up-sun
  float cz = caustic2(vec2(vWP.x + vWP.z, vWP.y * 1.2 + vWP.x * 0.3) * 0.5, uTime);
  #ifdef CITY
    vec4 cl = cityLight(vWP);
    float con = cityOn(vWP), cfull = smoothstep(uWave.y + 0.02, 1., con / max(uWave.w, 1e-3));   // 0 before the sun breaks, 1 once the wave has passed
    float cov = cl.a * con * uCausticGain;
    vec3 lc = pow(clamp(cl.rgb, 0.01, 1.), vec3(0.55));
    lc = mix(lc, lc * lc, 0.5);                                                 // milk houses do not throw white nets
    float clow = mix(1. - smoothstep(0.8, 5.5, vWP.y), 1., cfull);              // before that only the water's own light crawls up the foot of a wall
    float bw = bridgeWash(vWP) * min(uCausticGain, 1.);
    vec3 bc = pow(clamp(uBridgeCol, 0.01, 1.), vec3(0.9)) * 1.3;                  // the bridge's own colour at full strength: the boat is washed blue, not drained
    float rake = max(dot(N, L), 0.) * (1. - cl.a) * cfull * step(uClip, 1.5);       // the low sun rakes whatever faces it and stands clear of the coloured shade
    col = col * (1. + 0.6 * rake * dot(uRake, vec3(0.34))) + pow(tint, vec3(0.6)) * uRake * rake * 0.45;
    col = mix(col, col * (0.35 + lc), cov * mix(0.5, 0.3, smoothstep(6., 9., vWP.y)) * cfull);
    col += lc * (0.3 + 0.7 * pow(tint, vec3(0.4))) * cz * cov * 0.28 * clow * (1. - smoothstep(5., 10., vWP.y));        // the nets stay near the waterline
    vec4 sl = shaftLight(vWP);                                                     // standing in a shaft of the harp: the glass takes that pane's colour, and its net crawls on it
    if (sl.a > 0.003) {
      vec3 sc = pow(clamp(sl.rgb, 0.01, 1.), vec3(0.6)); float sk = sl.a * min(uCausticGain, 1.);
      col = mix(col, col * (0.3 + sc * 1.15), sk * 0.7);
      col += sc * (0.3 + 0.7 * pow(tint, vec3(0.4))) * (0.16 + 0.6 * min(cz, 1.6)) * sk;
    }
    float bwm = smoothstep(0., 0.5, bw);                                             // the wash comes on whole within a metre or two: half-washed amber under an aqua bridge is only grey
    col = mix(col, bc * min(dot(col, vec3(0.3, 0.5, 0.2)) * 1.1 + 0.06, 0.62), bwm * 0.93); col += bc * cz * bw * 0.17;
    col += uFogCol * fres * uRim * 0.5 * bwm;                                         // its bright rim stays: washed glass is still glass, and our bow still stands off the water
    col += mix(uFogCol, pow(tint, vec3(0.45)) * 1.25, 0.72) * wakeLadder(vWP, uTime) * uWave.z * min(uCausticGain, 1.);      // the wake's light takes the wall's own colour: never white scribble on dark glass
    if (gold > 0.001) {
      vec3 gc = vec3(1.0, 0.64, 0.17) * (0.3 + 0.55 * wrap) + uSunCol * pow(nh, 40.) * 2.2 + uFogCol * fres * 0.6;
      col = mix(col, gc, gold);
    }
    col += pow(tint, vec3(0.75)) * uInner * (0.2 + 1.5 * pane * lampK + 0.35 * step(2.5, pid) * step(pid, 3.5) * (1. - uLift)) * (0.85 + 0.15 * sin(uTime * 1.3 + vWP.x * 0.7 + vWP.z * 0.4));   // reeded glass (bridges, roofs) holds a little of the lantern light too
  #else
    col += uCausticCol * cz * uCausticAmp * uCausticGain;
  #endif
  #ifdef SELFMIRROR
    if (vWP.y < 0.) col = mix(col * 0.8, uLagoon * 0.46, clamp(0.4 + -vWP.y * 0.17, 0., 0.93));       // its own reflection: a dim wavering streak that sinks into the lagoon
  #endif
  // grey steel (the two pipes): the only things here that are not glass
  float steelKeep = 0.;
  if (uSteel > 0.5) {
    float streaks = vn2(vec2(atan(vWP.z, vWP.x + 1e-4) * 9., vWP.y * 0.06));
    float bands = vn2(vec2(vWP.y * 0.9, 3.7));
    vec3 st = mix(vec3(0.16, 0.17, 0.19), vec3(0.42, 0.44, 0.47), 0.35 + 0.4 * streaks + 0.25 * bands) * (0.5 + 0.6 * wrap);
    st *= mix(vec3(1.), vec3(0.75, 0.6, 0.5), vThick) * min(1., 0.3 + dot(uFogCol, vec3(0.45)));           // soot and heat tint toward the hot end
    col = st + uFogCol * fres * 0.5 + uSunCol * (pow(nh, 90.) * 1.2) + uFogCol * streak * 0.35;
    float sdist = distance(cameraPosition, vWP);
    col = mix(col, uFogCol * 0.86, smoothstep(50., 330., sdist) * 0.45);                                  // far off it pales into the fog
    if (uClip < 1.5 && vT < 0.5) {                                                                        // but the blowpipe seen from far down the canal stands over the hot star: dark steel against the glow, never a pale bar
      steelKeep = 0.95 * smoothstep(240., 380., sdist);
      col = mix(col, st * 0.42 + vec3(0.05, 0.02, 0.012), steelKeep);
    }
    if (uClip > 1.5) col = mix(col, uLagoon * 0.62, 0.35 + 0.6 * smoothstep(30., 150., sdist));           // and its mirror image sinks into the lagoon's own colour
    if (vT > 0.5) {                                                                                       // the pontil: dull red where it holds the hot ring, paler as it climbs into the fog
      col += heatRamp(0.5 * (1. - smoothstep(3., 34., vT)), uAmber, uOrange) * (uClip > 1.5 ? 0.3 : 0.8);
      col = mix(col, uFogCol * 0.97, smoothstep(uLid * 0.14, uLid * 0.45, vT) * 0.5);
    }
  }
  // heat
  float h = clamp(max(vHeat, uHeatAll), 0., 1.), hotKeep = 0., hk = h;
  if (h > 0.004) {
    float skin = vn3(vec3(vWP.x * 0.5, vWP.y * 0.07 - uTime * 0.12, vWP.z * 0.5));
    float limb = 0.6 + 0.4 * ndv * ndv;                 // deeper orange at the limb, white-orange in the core
    float hh = clamp(h * limb * (0.9 + 0.16 * skin) + 0.1 * h * clamp(uThick + vThick, 0., 1.), 0., 1.);
    #ifdef MORPH
      float capK = mix(uHotCap, 1., smoothstep(0.8, 0.97, vT));              // below its top fifth the lengthening gather stays a saturated orange, so it has a silhouette against pearl
      hh = min(hh, capK);
    #endif
    vec3 em = heatRamp(hh, uAmber, uOrange) * (uClip > 1.5 ? 0.5 : 1.);
    #ifdef MORPH
      float young = 1. - smoothstep(0.62, 1., capK);
      // the young gather has form: deep amber at the hanging tip, orange in its belly, white-hot under the pipe, nine ribs, a deeper limb
      float starK = smoothstep(210., 370., distance(cameraPosition, vWP));       // seen from far down the canal it is the orange star: one saturated orange, not a pale teardrop
      hk = mix(h, smoothstep(0., 0.3, h), starK);                                // from that far, whatever of it is warm at all burns as one
      vec3 yc = mix(vec3(0.75, 0.16, 0.02), uOrange * 1.6, smoothstep(0., 0.55, vT));
      yc = mix(yc, vec3(1., 0.8, 0.5) * 4., smoothstep(0.78, 1., vT) * (1. - starK));
      float rib = cos(atan(vAx.y, abs(vAx.x) < 1e-4 ? 1e-4 : vAx.x) * 9. + vT * 5.);
      yc *= (0.4 + 0.6 * ndv * ndv) * (0.6 + 0.4 * rib) * (0.88 + 0.24 * skin);
      yc = mix(yc, uOrange * vec3(1., 0.62, 0.5) * (0.9 + 0.3 * smoothstep(0., 0.7, vT)), starK * 0.94);
      em = mix(yc * hk * (uClip > 1.5 ? 0.5 : 1.), em, 1. - young);
      em += mix(vec3(1.0, 0.78, 0.5), uOrange * 0.12, starK) * fres * 2.0 * hk * young * (uClip > 1.5 ? 0.4 : 1.);
      hotKeep = hk * young * (uClip > 1.5 ? 0.65 : mix(0.38, 0.985, starK));      // hot glass shines through the fog: it keeps its orange at 300 m, and is the star at 450
    #endif
    col = col * (1. - 0.9 * smoothstep(0.1, 0.7, hk)) + em;
  }
  #ifdef MORPH
    #ifdef FOG_EXP2
      if (uClip > 1.5) {                                                          // the mirror image sinks into the lagoon, but hot glass keeps its heat: a wavering orange streak, never a white ghost
        float fq = fogDensity * vFogDepth * 1.3, fm = clamp(0.22 + 1.3 * (1. - exp(-fq * fq)), 0., 0.86);
        col = mix(col, mix(uLagoon, uFogCol, 0.4) * 0.84, fm * (1. - 0.7 * h));
        col = mix(col, uOrange * 0.5, smoothstep(0.3, 0.6, h) * fm * 0.6);
      }
    #endif
  #endif
  // into the fog lid
  col = mix(col, uFogCol, smoothstep(uLid - 14., uLid + 26., abs(vWP.y)) * 0.92 * (1. - steelKeep));
  gl_FragColor = vec4(max(col, 0.), uOpacity);
  #include <fog_fragment>
  gl_FragColor.rgb = mix(gl_FragColor.rgb, max(col, 0.), max(hotKeep, steelKeep));
}`;function De(t=ke,i={}){const a=t&&t.length>=7?t:ke,o=i.sunDir?i.sunDir.isVector3?i.sunDir.clone():new e.Vector3().fromArray(i.sunDir):new e.Vector3(-.8,.22,-.56);return{uTime:{value:0},uSunDir:{value:o.normalize()},uSunCol:{value:new e.Color(i.sunColor||"#fff0d2").multiplyScalar(1.15)},uFogCol:{value:new e.Color(a[0])},uLagoon:{value:new e.Color(a[1]).lerp(new e.Color(a[0]),.25)},uCausticCol:{value:new e.Color(a[3])},uCausticAmp:{value:0},uAmber:{value:new e.Color(a[4])},uOrange:{value:new e.Color(a[5])},uLid:{value:i.lid??110}}}function ae(t={}){const i=t.shared||De(t.palette,t),a=e.UniformsUtils.merge([e.UniformsLib.fog]);for(const n of Object.keys(i))a[n]=i[n];if(Object.assign(a,{uTint:{value:new e.Color(t.color??"#8EC9B8")},uThick:{value:t.thickness??.35},uInterior:{value:t.interior??0},uCore:{value:t.core??0},uHeatAll:{value:t.heat??0},uCausticGain:{value:t.caustic??1},uOpacity:{value:t.opacity??1},uClip:{value:t.clip??0},uSteel:{value:t.steel?1:0},uLift:{value:t.lift??0},uRim:{value:t.rim??1},uSpec:{value:t.spec??1}}),t.extraUniforms)for(const n of Object.keys(t.extraUniforms))a[n]=t.extraUniforms[n];if(t.city)for(const n of Object.keys(t.city))a[n]=t.city[n];const o={};return t.morph&&(o.MORPH=1),t.city&&(o.CITY=1),t.selfMirror&&(o.SELFMIRROR=1),new e.ShaderMaterial({uniforms:a,vertexShader:at,fragmentShader:it,fog:!0,vertexColors:!!t.vertexColors,side:t.side??e.FrontSide,transparent:!!t.transparent,depthWrite:!t.transparent,defines:o})}class Te{constructor(){this.p=[],this.c=[],this.th=[],this.m=[],this.i=[]}get n(){return this.p.length/3}v(i,a,o,s,n,r=0,y=1,d=0){return this.p.push(i,a,o),this.c.push(s.r,s.g,s.b),this.th.push(n),this.m.push(r,y,d),this.n-1}build(i){const a=new e.BufferGeometry;return a.setAttribute("position",new e.Float32BufferAttribute(this.p,3)),a.setAttribute("color",new e.Float32BufferAttribute(this.c,3)),a.setAttribute("thick",new e.Float32BufferAttribute(this.th,1)),i&&a.setAttribute("aMorph",new e.Float32BufferAttribute(this.m,3)),a.setIndex(this.i),a.computeVertexNormals(),a}async buildAsync(i,a){const o=new e.BufferGeometry;return o.setAttribute("position",new e.Float32BufferAttribute(this.p,3)),await a(),o.setAttribute("color",new e.Float32BufferAttribute(this.c,3)),o.setAttribute("thick",new e.Float32BufferAttribute(this.th,1)),await a(),i&&o.setAttribute("aMorph",new e.Float32BufferAttribute(this.m,3)),o.setIndex(this.i),await a(),o.computeVertexNormals(),o}}function ie(t,i,a=1){const o=[];for(let s=0;s<t.length-1;s++){const n=t[s],r=t[s+1],y=Math.hypot(r[0]-n[0],r[1]-n[1]),d=Math.max(1,Math.ceil(y/i));for(let x=0;x<d;x++){const u=x/d;o.push([V(n[0],r[0],u),V(n[1],r[1],u),V(n[2],r[2],u)])}}o.push(t[t.length-1].slice());for(let s=0;s<a;s++){const n=o.map(r=>r[1]);for(let r=1;r<o.length-1;r++)o[r][1]=n[r]*.5+(n[r-1]+n[r+1])*.25}return o}function Q(t,i,a,o={}){const s=t.n,n=o.cx||0,r=o.cz||0;for(let y=0;y<i.length;y++){const[d,x,u]=i[y],g=o.twist?o.twist(d):0;for(let f=0;f<a;f++){const c=f/a*Math.PI*2,l=o.mod?o.mod(c,d,x):x,p=n+Math.sin(c+g)*l,P=r+Math.cos(c+g)*l,S=o.mk?o.mk(p,d,P):[0,1,0];t.v(p,d,P,o.col?o.col(d,c,l):o.color,o.thick?o.thick(c,d,u):u,S[0],S[1],S[2])}}for(let y=0;y<i.length-1;y++)for(let d=0;d<a;d++){const x=s+y*a+d,u=s+y*a+(d+1)%a,g=x+a,f=u+a;t.i.push(x,u,g,u,f,g)}}function fe(t,i,a,o,s={}){const n=t.n,r=i.length,y=new e.Vector3,d=new e.Vector3,x=new e.Vector3,u=new e.Vector3,g=s.ref||new e.Vector3(0,1,0);for(let f=0;f<r;f++){const c=i[f],l=i[Math.max(0,f-1)],p=i[Math.min(r-1,f+1)];d.subVectors(p,l).normalize(),y.copy(g),Math.abs(y.dot(d))>.95&&y.set(1,0,0),x.crossVectors(y,d).normalize(),u.crossVectors(d,x).normalize();const P=f/(r-1),S=typeof a=="function"?a(P):a;for(let T=0;T<o;T++){const k=T/o*Math.PI*2+(s.twist?s.twist*P:0),z=Math.cos(k)*S,b=Math.sin(k)*S,_=c.x+x.x*z+u.x*b,m=c.y+x.y*z+u.y*b,v=c.z+x.z*z+u.z*b,h=s.mk?s.mk(_,m,v):[0,1,0];t.v(_,m,v,s.col?s.col(P,T):s.color,typeof s.thick=="function"?s.thick(P):s.thick??1,h[0],h[1],h[2])}}for(let f=0;f<r-1;f++)for(let c=0;c<o;c++){const l=n+f*o+c,p=n+f*o+(c+1)%o,P=l+o,S=p+o;t.i.push(l,p,P,p,S,P)}if(s.caps)for(const f of[0,r-1]){const c=i[f],l=s.mk?s.mk(c.x,c.y,c.z):[0,1,0],p=t.v(c.x,c.y,c.z,s.col?s.col(f?1:0,0):s.color,1,l[0],l[1],l[2]);for(let P=0;P<o;P++){const S=n+f*o+P,T=n+f*o+(P+1)%o;f?t.i.push(S,T,p):t.i.push(S,p,T)}}}function ne(t,i,a,o,s,n,r={}){const y=t.n,d=r.lat||5,x=r.lon||8,u=a.clone().normalize(),g=new e.Vector3(0,1,0).cross(u);g.lengthSq()<1e-6&&g.set(1,0,0),g.normalize();const f=new e.Vector3().crossVectors(u,g);for(let c=0;c<=d;c++){const l=c/d*Math.PI,p=Math.sin(l),P=Math.cos(l);for(let S=0;S<x;S++){const T=S/x*Math.PI*2,k=Math.cos(T)*p*o,z=Math.sin(T)*p*s,b=P*n,_=i.x+g.x*k+f.x*z+u.x*b,m=i.y+g.y*k+f.y*z+u.y*b,v=i.z+g.z*k+f.z*z+u.z*b,h=r.mk?r.mk(_,m,v):[0,1,0];t.v(_,m,v,r.color,r.thick??1,h[0],h[1],h[2])}}for(let c=0;c<d;c++)for(let l=0;l<x;l++){const p=y+c*x+l,P=y+c*x+(l+1)%x,S=p+x,T=P+x;t.i.push(p,S,P,P,S,T)}}async function nt(t,i,a,o){const s=new Te,{glass:n,deep:r,pale:y,milk:d}=i,x=a.nRib,u=a.twist,g=a.nCol,f=[[0,8],[1.2,7.8],[3.5,5.6],[5,6.5],[7,5.4],[57,4.8],[60.3,6.9],[62.4,5.7],[74,5.7],[76.6,6.7],[78.2,4.5],[83.3,4.7],[84.2,4],[92.5,1.3],[94.6,1.9],[97,1.9]],c=M=>{if(M<=0)return f[0][1];for(let C=0;C<f.length-1;C++)if(M<=f[C+1][0])return V(f[C][1],f[C+1][1],(M-f[C][0])/(f[C+1][0]-f[C][0]));return f[f.length-1][1]},l=(M,C,O)=>[Z(C/B,0,1),Z(Math.hypot(M,O)/c(C),0,1.12),0],p=(M,C,O)=>[0,Z(Math.hypot(M,O)/8,0,1),1],P=new e.Color,S=(M,C,O)=>{const q=.5+.5*Math.sin(C*3+M*.21)*Math.sin(C*7-M*.13);return P.copy(n).lerp(r,.25*q).lerp(y,.1*R(40,95,M)).clone()},T=M=>u*Math.PI*2*R(4,60,M),k=(M,C,O=1)=>(q,Y,W)=>{const D=.5+.5*Math.cos(q*C);return W+M(Y)*(Math.pow(D,O)-.35)};Q(s,[[0,.01,1],[0,1.4,1],[0,2.8,1],[0,4.2,1],[0,5.6,1],[0,6.7,1],[0,7.4,1]],48,{color:r,mk:p}),Q(s,ie([[0,7.4,.9],[.3,7.9,1],[.75,8,1],[1.15,7.7,.9],[1.5,7,.6],[2.2,6,.4],[3.2,5.4,.35],[4,5.3,.5],[4.4,6,.9],[5,6.45,1],[5.6,6,.9],[6,5.3,.5],[6.3,5.75,.9],[6.7,5.75,.9],[7,5.25,.3]],.4,1),72,{col:S,mk:l,mod:(M,C,O)=>O+.16*R(1.3,2.2,C)*(1-R(3,4,C))*Math.cos(M*x)}),await o();const b=a.bands,_=M=>5.25-.62*Math.pow(Z((M-7)/50,0,1),1.35),m=[];for(let M=7;M<=57.001;M+=1){let C=_(M),O=.12;for(const q of b){const Y=Math.abs(M-q);Y<.75&&(C+=.42*(1-Y/.75*(Y/.75)),O=.9)}m.push([Math.min(M,57),C,O])}const v=M=>b.some(C=>Math.abs(M-C)<.8);Q(s,m,96,{mk:l,twist:T,mod:(M,C,O)=>v(C)?O:k(()=>.26,x,1.6)(M,C,O),thick:(M,C,O)=>O+(v(C)?0:.5*Math.pow(.5+.5*Math.cos(M*x),2)),col:(M,C,O)=>v(M)?d.clone():S(M,C,O)}),await o();const h=(M,C,O,q)=>(Y,W,D)=>D+O*R(M,(M+C)/2,W)*(1-R((M+C)/2,C,W))*(Math.abs(Math.sin(Y*q*.5))-.4);Q(s,ie([[57,4.63,.3],[58,4.9,.6],[59,5.6,.8],[59.8,6.5,1],[60.3,6.75,1],[60.8,6.4,.9],[61.3,5.7,.6],[62,5.55,.5],[62.4,5.6,.6],[62.45,5.2,.5],[62.55,2.4,.4],[62.9,1.3,.7],[63.6,1,1],[64,.6,1],[64.2,.02,1]],.45,1),96,{col:S,mk:l,mod:h(58.8,61.6,.7,a.frill)}),await o();const U=4.95,F=62.4,H=70,X=73.7,me=ie([[F,.82,1],[F+.3,.86,1],[F+.6,.62,1],[F+.9,.5,1],[F+3.8,.56,1],[H-.9,.48,1],[H-.5,.62,1],[H-.15,.85,1],[H+.15,.85,1],[H+.4,.6,1]],.9,0);for(let M=0;M<g;M++){const C=M/g*Math.PI*2;Q(s,me,10,{cx:Math.sin(C)*U,cz:Math.cos(C)*U,mk:l,twist:W=>(W-F)*.9*a.dir,mod:(W,D,ee)=>ee+.07*Math.cos(W*5)*R(F+.8,F+1.4,D)*(1-R(H-1.2,H-.6,D)),col:(W,D)=>Math.cos(D*5)>.3&&W>F+.9&&W<H-.9?d.clone():r.clone()});const O=(M+1)/g*Math.PI*2,q=[],Y=[];for(let W=0;W<=14;W++){const D=W/14,ee=V(C,O,D),oe=Math.abs(2*D-1),de=H+.3+(X-H-.5)*Math.pow(Math.max(1-Math.pow(oe,1.7),0),.6);q.push(new e.Vector3(Math.sin(ee)*U,de,Math.cos(ee)*U))}fe(s,q,W=>.4-.1*Math.sin(W*Math.PI),7,{color:n,thick:.9,mk:l});for(let W=0;W<=5;W++){const D=V(C,O,W/5);Y.push(new e.Vector3(Math.sin(D)*(U+.25),F+1.55,Math.cos(D)*(U+.25)))}fe(s,Y,.15,5,{color:d,thick:.6,mk:l});for(let W=1;W<=3;W++){const D=V(C,O,W/4),ee=Math.sin(D)*(U+.25),oe=Math.cos(D)*(U+.25);Q(s,[[F,.16,1],[F+.5,.3,1],[F+1,.12,1],[F+1.5,.2,1]],5,{cx:ee,cz:oe,color:n,mk:l})}M%3===2&&await o()}await o();const ve=ie([[69.2,1.5,.6],[66.4,2.65,.7],[65.7,3,1],[65.6,3.2,1],[65.9,3.15,1],[66.6,2.75,.6],[68.6,2.1,.4],[70.4,1.85,.4],[71.3,1.35,.6],[71.7,.7,1],[72.2,.38,1],[X,.34,1]],.7,1);return Q(s,ve,28,{color:i.bell,mk:l}),ne(s,new e.Vector3(0,65.2,0),new e.Vector3(0,1,0),.55,.55,.7,{color:r,mk:l,lat:5,lon:8}),fe(s,[new e.Vector3(0,65.6,0),new e.Vector3(0,69.4,0)],.14,5,{color:r,mk:l,ref:new e.Vector3(1,0,0)}),{G:s,mk:l,envR:c,bodyCol:S,shaftTwist:T,shaftR:_,ribs:k,frill:h,yCeil:X}}async function st(t,i,a,o,s){const{G:n,mk:r,bodyCol:y,shaftTwist:d,shaftR:x,frill:u,yCeil:g}=t,{glass:f,deep:c,pale:l,milk:p}=a,P=[[g-.1,.5,.6],[g,5.3,.6],[74.3,5.65,.8],[75,5.6,.6],[75.6,5.9,.9],[76.2,6.4,1],[76.7,6.55,1],[77.1,6.1,.8],[77.6,5.2,.5],[78,4.6,.4],[78.2,4.3,.2],[82.5,4.1,.2],[82.8,4.5,.9],[83.3,4.65,1],[83.8,4.3,.8],[84.2,3.9,.4]];Q(n,ie(P,.5,1),96,{col:y,mk:r,mod:u(75.2,77.9,.6,o.frill)}),await s();const S=[];for(let v=0;v<=14;v++){const h=v/14,A=84.2+h*8.3;let U=1.15+2.75*Math.pow(1-h,o.onion?1:1.75);o.onion&&(U+=1.25*Math.sin(Math.min(h*1.6,1)*Math.PI)*(1-h)),S.push([A,U,.15+.5*h])}const T=Math.max(8,Math.round(o.nRib*.75));Q(n,S,72,{mk:r,twist:v=>-o.dir*(v-84.2)*.16,mod:(v,h,A)=>A+.2*(A/3.9)*(Math.pow(.5+.5*Math.cos(v*T),1.5)-.3),thick:(v,h,A)=>A+.5*Math.pow(.5+.5*Math.cos(v*T),2),col:(v,h,A)=>y(v,h,A).lerp(l,.12)}),Q(n,ie([[92.5,1.15,.8],[93,1,.9],[93.5,1.05,1],[93.9,1.4,1],[94.4,1.8,1],[94.9,1.95,1],[95.5,1.9,1],[96.2,1.75,1],[96.6,1.56,1]],.35,1),40,{color:c,mk:r,mod:(v,h,A)=>A+.06*Math.sin(v*5+h*3)}),await s();const z=new e.Vector3,b=new e.Vector3,_=o.pruntTiers,m=Math.max(4,Math.round(o.nRib/2));for(let v=0;v<_;v++){const h=12+(v+.5)*(44/_)+i.range(-.6,.6);if(!o.bands.some(A=>Math.abs(h-A)<1.6))for(let A=0;A<m;A++){const U=A/m*Math.PI*2+d(h)+v*.37,F=x(h)+.12;z.set(Math.sin(U),0,Math.cos(U)),b.copy(z).multiplyScalar(F),b.y=h;const H=(v+A)%2===0;ne(n,b,z,H?.62:.4,H?.9:.4,.3,{color:H?l:p,thick:.7,mk:r,lat:4,lon:8})}}await s();for(let v=0;v<8;v++){const h=v/8*Math.PI*2+.2;z.set(Math.sin(h),0,Math.cos(h)),b.copy(z).multiplyScalar(4.22),b.y=80.3,ne(n,b,z,.62,1.1,.26,{color:l,thick:.6,mk:r,lat:4,lon:8})}for(let v=0;v<o.nCol;v++){const h=(v+.5)/o.nCol*Math.PI*2;z.set(Math.sin(h),0,Math.cos(h)),b.copy(z).multiplyScalar(5.45),b.y=78.45,Q(n,[[77.75,.3,1],[78,.42,1],[78.3,.2,1],[78.6,.34,1],[78.9,.36,1],[79.3,.05,1]],6,{cx:b.x,cz:b.z,color:p,mk:r})}return await s(),await n.buildAsync(!0,s)}function rt(t,i,a){const o=new Te,s=c=>a,n=[[94.4,1.3,1],[95.2,1.5,.9],[97.4,1.5,.8],[97.5,2.5,.8],[97.9,2.7,.7],[98.3,2.5,.7],[98.4,1.5,.6]];let r=98.4;for(;r<ue-6;){const c=t.range(9,15),l=Math.min(r+c,ue-1),p=Z(.6-(r-98)/70,0,1);n.push([l-.9,1.5,p],[l-.85,1.82,p],[l-.3,1.82,p],[l-.25,1.62,p],[l+.25,1.62,p],[l+.3,1.5,p]),r=l+.3}n.push([ue,1.5,0]),Q(o,n,24,{color:a,mod:(c,l,p)=>p+(p>1.7&&p<2?.07*Math.cos(c*12):0)});const y=i.pontilTip,d=i.pontilDir,x=[],u=(ue-y.y)/d.y,g=new e.Vector3(0,0,1),f=72;for(let c=0;c<=f;c++)x.push(y.clone().addScaledVector(d,c/f*u));return fe(o,x,c=>{const l=c*u;return .95+(Math.abs((l+4)%13-6.5)>6?.16:0)*1.9+.3*Math.exp(-l*.5)},12,{color:a,thick:c=>Z(.8-c*3,0,1),ref:g,caps:!0}),o.build(!1)}function lt(t,i,a){const o=new Te,s=[],n=112,r=K+1.05,y=[];for(let u=0;u<7;u++)y.push([t.range(0,Math.PI*2),t.range(.1,.32),t.range(.15,.4)]);const d=u=>{let g=1+.05*Math.sin(u*9+1.3);for(const[f,c,l]of y){let p=Math.abs(u-f)%(Math.PI*2);p=Math.min(p,Math.PI*2-p),g+=c*Math.exp(-(p*p)/(l*l))}return g};for(let u=0;u<=n;u++){const g=-Math.PI/2+u/n*Math.PI*2;s.push(new e.Vector3(Math.cos(g)*r,N+Math.sin(g)*r,$))}fe(o,s,u=>d(u*Math.PI*2),14,{ref:new e.Vector3(0,0,1),twist:i.dir*Math.PI*6,col:(u,g)=>g%7===0?a.milk:a.ringGlass,thick:1});const x=i.pontilTip;ne(o,x.clone().addScaledVector(i.pontilDir,-.2),i.pontilDir,1.5,1.5,1.1,{color:a.ringGlass,lat:6,lon:10}),ne(o,x.clone().addScaledVector(i.pontilDir,1),i.pontilDir,.95,.95,1.3,{color:a.ringGlass,lat:5,lon:10});for(let u=0;u<9;u++){const g=t.range(.25,Math.PI-.25),f=t.range(.6,2.1),c=r+.3,l=new e.Vector3(Math.cos(g)*c,N+Math.sin(g)*c-1-f*.5,$+t.range(-.3,.3));u%3===0&&l.set(Math.cos(g)*(K+.2),N+Math.sin(g)*(K+.2)-f*.5,$),ne(o,l,new e.Vector3(0,-1,0),.26,.26,f*.6,{color:a.ringGlass,lat:5,lon:6})}return o.build(!1)}const pe=`
  float fogK = 1.;
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      fogK = exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      fogK = 1. - smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #endif
`;function ct(t,i){const s=[],n=[];for(let u=0;u<=7;u++)for(let g=0;g<=96;g++)s.push(g/96*Math.PI*2,u/7,0);for(let u=0;u<7;u++)for(let g=0;g<96;g++){const f=u*97+g,c=f+1,l=f+96+1,p=l+1;n.push(f,c,l,c,p,l)}const r=new e.BufferGeometry;r.setAttribute("position",new e.Float32BufferAttribute(s,3)),r.setIndex(n),r.boundingSphere=new e.Sphere(new e.Vector3(0,N,$),10);const y=e.UniformsUtils.merge([e.UniformsLib.fog]);Object.assign(y,{uTime:t.uTime,uAmber:t.uAmber,uOrange:t.uOrange,uHole:i.uHole,uSpin:i.uSpin});const d=new e.ShaderMaterial({uniforms:y,fog:!0,transparent:!0,depthWrite:!1,side:e.DoubleSide,forceSinglePass:!0,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      uniform float uTime, uHole, uSpin;
      varying vec2 vAF; varying vec3 vWP;
      void main(){
        float a = position.x, f = position.y;
        float wob = 1. + 0.035 * sin(a * 3. + uSpin * 2.) * (1. - f) + 0.02 * sin(a * 7. - uSpin * 3.) * (1. - f);
        float r = mix(uHole * wob, ${(K+.35).toFixed(2)}, f);
        vec3 p = vec3(cos(a) * r, ${N.toFixed(2)} + sin(a) * r, ${($+.35).toFixed(2)} + 0.25 * (1. - f) * sin(a * 2. + uSpin));
        vAF = vec2(a, f);
        vec4 wp = modelMatrix * vec4(p, 1.); vWP = wp.xyz;
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      uniform float uTime, uHole, uSpin; uniform vec3 uAmber, uOrange;
      varying vec2 vAF; varying vec3 vWP;
      ${he}
      void main(){
        if (vWP.y < -0.1) discard;
        float f = vAF.y, a = vAF.x;
        float lip = 1. - smoothstep(0.0, 0.16, f);
        float swirl = vn2(vec2(a * 4. + uSpin * 1.5 + f * 5., f * 6. - uSpin * 0.4));
        float swirl2 = 0.5 + 0.5 * sin(a * 23. + f * 16. + uSpin * 6.);
        float h = clamp(0.62 + 0.3 * lip + 0.2 * swirl - 0.08 * swirl2, 0., 1.);
        vec3 col = heatRamp(h, uAmber, uOrange);
        float width = max(${K.toFixed(1)} - uHole, 0.) / ${K.toFixed(1)};
        float alpha = clamp(0.5 + 0.5 * lip + 0.25 * swirl, 0., 1.) * smoothstep(0.0, 0.05, width + lip * 0.2);
        gl_FragColor = vec4(col, alpha);
        #include <fog_fragment>
      }`}),x=new e.Mesh(r,d);return x.frustumCulled=!1,x.renderOrder=6,x}function Ae(){const t=new e.InstancedBufferGeometry;return t.setAttribute("position",new e.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),t.setIndex([0,1,2,0,2,3]),t}function ut(t,i,a,o,s,n=1,r=1,y=1){const d=Math.round(26*s),x=Math.round(22*s),u=Math.round(90*s),g=Math.round(u*y),f=d+x+g,c=b=>{const _=Math.sin(b*91.7+13.3)*43758.5453;return _-Math.floor(_)},l=new Float32Array(f*3),p=new Float32Array(f*3),P=new Float32Array(f*4);for(let b=0;b<f;b++){const _=b<d?0:b<d+x?1:2;if(_===0){const m=t.range(0,6.283),v=Math.sqrt(t())*3.2;l.set([Math.sin(m)*v*n,t.range(0,.5),Math.cos(m)*v*n],b*3),p.set([t.range(-.3,.3),t.range(-2,0),t.range(-.3,.3)],b*3),P.set([t(),t.range(3.2,5.5),t.range(.55,1),0],b*4)}else if(_===1){const m=t.range(0,6.283);l.set([Math.sin(m)*6.7*n,59.6,Math.cos(m)*6.7*n],b*3),p.set([Math.sin(m)*.5,t.range(-1,0),Math.cos(m)*.5],b*3),P.set([t(),t.range(4.5,7.5),t.range(.45,.8),1],b*4)}else{const m=b>=d+x+u,v=[];for(let X=0;X<9;X++)v.push(m?c(b*9+X):t());const h=.05+v[0]*(Math.PI-.1),A=K+2,U=(7+8*v[1])*i.dir,F=1+4*v[3],H=1+4*v[4];l.set([Math.cos(h)*A,N+Math.sin(h)*A,$-.4+.8*v[2]],b*3),p.set([-Math.sin(h)*U+Math.cos(h)*F,Math.cos(h)*U+Math.sin(h)*H+2,-2.5+7*v[5]],b*3),P.set([v[6],2.2+2*v[7],(.26+.24*v[8])*r,2],b*4)}}const S=Ae();S.setAttribute("iO",new e.InstancedBufferAttribute(l,3)),S.setAttribute("iV",new e.InstancedBufferAttribute(p,3)),S.setAttribute("iS",new e.InstancedBufferAttribute(P,4)),S.instanceCount=f;const T=e.UniformsUtils.merge([e.UniformsLib.fog]);Object.assign(T,{uTime:a.uTime,uAmber:a.uAmber,uOrange:a.uOrange,uFootY:o.uFootY,uGate:o.uGate,uSpinA:o.uSpinA});const k=new e.ShaderMaterial({uniforms:T,fog:!0,transparent:!0,depthWrite:!1,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      attribute vec3 iO, iV; attribute vec4 iS;
      uniform float uTime, uFootY, uSpinA; uniform vec3 uGate;
      varying vec2 vUv; varying float vA;
      void main(){
        float kind = iS.w, per = iS.y;
        float ph = fract(uTime / per + iS.x), tt = ph * per;
        vec3 o = iO; float gate = uGate.z;
        if (kind < 0.5) { o.y += uFootY; gate = uGate.x; }
        else if (kind < 1.5) { float c = cos(uSpinA), s = sin(uSpinA); o.xz = vec2(c * o.x + s * o.z, -s * o.x + c * o.z); gate = uGate.y; }
        vec3 vel = iV + vec3(0., -9.81 * tt, 0.);
        if (kind < 1.5) { tt = max(tt - per * 0.3, 0.); vel = iV + vec3(0., -9.81 * tt, 0.); }   // hang, then let go
        vec3 p = o + iV * tt + vec3(0., -4.905 * tt * tt, 0.);
        float alive = step(0.0, p.y) * gate;
        float grow = kind < 1.5 ? smoothstep(0., 0.3, ph) : smoothstep(0., 0.04, ph);
        vec4 mv = viewMatrix * modelMatrix * vec4(p, 1.);
        vec3 vv = mat3(viewMatrix) * mat3(modelMatrix) * vel;
        vec2 dir = vv.xy; float dl = length(dir); dir = dl > 1e-3 ? dir / dl : vec2(0., -1.);
        float w = iS.z * grow * (1. + max(-mv.z - 120., 0.) * 0.006);     // stay about a pixel wide far away
        float len = w * (1.6 + min(length(vel) * 0.22, 5.));
        mv.xy += dir * position.y * len + vec2(dir.y, -dir.x) * position.x * w;   // right-handed, or the quad is culled
        vUv = position.xy; vA = alive;
        vec4 mvPosition = mv;
        gl_Position = projectionMatrix * mv;
        if (alive < 0.5) gl_Position = vec4(2., 2., 2., 1.);
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      uniform vec3 uAmber, uOrange;
      varying vec2 vUv; varying float vA;
      void main(){
        float x = vUv.x, y = vUv.y;
        float wdt = mix(0.25, 1.0, smoothstep(-1., 0.7, y)) * (1. - smoothstep(0.75, 1., y));   // teardrop: fat head, thin tail
        float a = (1. - smoothstep(0.3, 1., abs(x) / max(wdt, 0.05))) * step(abs(y), 1.);
        ${pe}
        vec3 col = mix(uOrange * 2.6, vec3(1., 0.72, 0.4) * 5.5, smoothstep(-0.1, 0.9, y) * (1. - abs(x)));
        gl_FragColor = vec4(col, a * vA * (0.3 + 0.7 * fogK));
        #include <fog_fragment>
      }`}),z=new e.Mesh(S,k);return z.frustumCulled=!1,z.renderOrder=8,z}function ht(t,i,a,o,s=1){const n=Math.round(64*o),r=Math.round(120*o),y=Math.round(18*o),d=n+r+y,x=new Float32Array(d*4);for(let l=0;l<d;l++){const p=l<n?0:l<n+r?1:2,P=p===1?(l-n)/r*6.2832+t.range(-.02,.02):t.range(0,6.2832);x.set([P,t(),t(),p],l*4)}const u=Ae();u.setAttribute("iD",new e.InstancedBufferAttribute(x,4)),u.instanceCount=d;const g=e.UniformsUtils.merge([e.UniformsLib.fog]);Object.assign(g,{uTime:i.uTime,uFogCol:i.uFogCol,uOrange:i.uOrange,uSunDir:i.uSunDir,uSteam:a.uSteam,uRing:a.uRing,uWarm:a.uWarm,uGirth:{value:s}});const f=new e.ShaderMaterial({uniforms:g,fog:!0,transparent:!0,depthWrite:!1,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      attribute vec4 iD;
      uniform float uTime, uGirth; uniform vec3 uSteam, uRing;      // uSteam: hiss, puffs, - ; uRing: radius, alpha, size
      varying vec2 vUv; varying vec4 vP;                     // vP: alpha, seed, warm, rot
      void main(){
        float a = iD.x, kind = iD.w; vec3 p; float size, alpha, warm = 0.;
        if (kind < 0.5) {
          float ph = fract(uTime * (0.07 + 0.05 * iD.y) + iD.z);
          float r = (7.2 + 3.5 * iD.y) * uGirth + ph * (5. + 6. * iD.z);
          p = vec3(sin(a) * r, 0.8 + ph * ph * (9. + 9. * iD.y), cos(a) * r);
          size = (2.6 + 6.5 * ph) * (0.7 + 0.3 * uGirth); alpha = uSteam.x * sin(ph * 3.1416) * 0.62; warm = (1. - ph) * 0.8;
        } else if (kind < 1.5) {
          float r = uRing.x * (0.94 + 0.12 * iD.y) + 3. * sin(a * 5. + iD.z * 6.);
          size = uRing.z * (0.75 + 0.5 * iD.z);
          p = vec3(sin(a) * r, size * (0.45 + 0.25 * sin(uTime * 0.6 + iD.y * 6.28)), cos(a) * r);
          alpha = uRing.y * (0.55 + 0.45 * iD.y);
        } else {
          float ph = fract(uTime * (0.3 + 0.2 * iD.y) + iD.z);
          float r = 3.4 * uGirth * sqrt(iD.y);
          p = vec3(sin(a) * r, 0.5 + ph * 5., cos(a) * r);
          size = 1.2 + 4.5 * ph; alpha = uSteam.y * sin(ph * 3.1416) * 0.7; warm = 0.5;
        }
        vec4 mv = viewMatrix * modelMatrix * vec4(p, 1.);
        alpha *= smoothstep(3., 16., -mv.z);
        mv.xy += position.xy * size;
        vUv = position.xy; vP = vec4(alpha, iD.z, warm, uTime * (0.1 + 0.15 * iD.y) * (iD.z > 0.5 ? 1. : -1.) + a);
        vec4 mvPosition = mv;
        gl_Position = projectionMatrix * mv;
        if (alpha < 0.004) gl_Position = vec4(2., 2., 2., 1.);
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      uniform vec3 uFogCol, uOrange; uniform float uWarm;
      varying vec2 vUv; varying vec4 vP;
      ${he}
      void main(){
        float r = length(vUv);
        float c = cos(vP.w), s = sin(vP.w); vec2 q = vec2(c * vUv.x - s * vUv.y, s * vUv.x + c * vUv.y);
        float nz = vn2(q * 1.7 + vP.y * 31.) * 0.65 + vn2(q * 3.9 + vP.y * 17.) * 0.35;
        float a = (1. - smoothstep(0.25, 1., r + (nz - 0.5) * 0.7)) * vP.x;
        if (a < 0.004) discard;
        vec3 col = uFogCol * (0.8 + 0.3 * vUv.y + 0.14 * nz) * mix(vec3(0.92, 0.96, 1.04), vec3(1.), smoothstep(-0.6, 0.6, vUv.y));   // lit from above, blue-grey underneath: it reads against the pearl
        col += uOrange * uWarm * vP.z * (0.35 + 0.5 * (1. - r)) * 0.9;
        ${pe}
        gl_FragColor = vec4(col, a * (0.45 + 0.55 * fogK));
        #include <fog_fragment>
      }`}),c=new e.Mesh(u,f);return c.frustumCulled=!1,c.renderOrder=7,c}function ft(t,i){const a=Ae(),o=new e.InstancedBufferAttribute(new Float32Array(i*4),4),s=new e.InstancedBufferAttribute(new Float32Array(i*4),4);o.setUsage(e.DynamicDrawUsage),s.setUsage(e.DynamicDrawUsage),a.setAttribute("iP",o),a.setAttribute("iC",s),a.instanceCount=i;const n=e.UniformsUtils.merge([e.UniformsLib.fog]),r=new e.ShaderMaterial({uniforms:n,fog:!0,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      attribute vec4 iP, iC;
      varying vec2 vUv; varying vec4 vC;
      void main(){
        vec4 mv = viewMatrix * modelMatrix * vec4(iP.xyz, 1.);
        float dist = max(length(mv.xyz), 1e-3);
        float pull = min(10., dist * 0.5);
        mv.xyz -= mv.xyz / dist * pull;                           // pull toward the eye so the glass does not cut the glow
        mv.xy += position.xy * iP.w * ((dist - pull) / dist);     // and keep its size on screen: close to, the ring's halo stays round the ring
        vUv = position.xy; vC = iC;
        vec4 mvPosition = mv;
        gl_Position = projectionMatrix * mv;
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      varying vec2 vUv; varying vec4 vC;
      void main(){
        float r = length(vUv);
        float star = exp(-r * r * 9.) * 0.9 + exp(-r * 3.2) * 0.22;
        float rr = (r - 0.6) / 0.2; float ring = exp(-rr * rr) * 0.8 + exp(-r * r * 3.) * 0.15;
        float a = mix(star, ring, vC.a) * (1. - smoothstep(0.8, 1., r));
        ${pe}
        gl_FragColor = vec4(vC.rgb * a * (0.25 + 0.75 * fogK), 1.);
      }`}),y=new e.Mesh(a,r);return y.frustumCulled=!1,y.renderOrder=9,{mesh:y,pos:o,col:s}}function pt(t,i,a,o,s=1){const n=[],r=[],y=[],d=new e.Vector3(-a.z,0,a.x).normalize(),x=(T,k)=>{const z=n.length/3,b=d.x*T*6.2*s,_=d.z*T*6.2*s,m=10;for(let v=0;v<=m;v++){const h=v/m;for(let A=0;A<=1;A++){const U=A*h;n.push(b*(1-.5*h)+a.x*o*U,h*B+a.y*o*U,_*(1-.5*h)+a.z*o*U),r.push(h,U,k?2:T)}}for(let v=0;v<m;v++){const h=z+v*2;y.push(h,h+1,h+2,h+1,h+3,h+2)}};for(const T of[-1,-.66,-.33,0,.33,.66,1])x(T,!1);const u=n.length/3,g=14;for(let T=0;T<g;T++){const k=(T+.4)/g*.92,z=n.length/3;for(const[b,_]of[[-1.3,k],[1.3,k],[1.3,1],[-1.3,1]]){const m=b*6.2*s*(1-.5*_);n.push(d.x*m+a.x*o*k,_*B+a.y*o*k,d.z*m+a.z*o*k),r.push(_,k,b)}y.push(z,z+1,z+2,z,z+2,z+3)}const f=new Float32Array(n.length/3);f.fill(1,u);const c=new e.BufferGeometry;c.setAttribute("position",new e.Float32BufferAttribute(n,3)),c.setAttribute("aHS",new e.Float32BufferAttribute(r,3)),c.setAttribute("aTyp",new e.Float32BufferAttribute(f,1)),c.setIndex(y);const l=e.UniformsUtils.merge([e.UniformsLib.fog]),p=new e.Vector3(a.x,0,a.z).normalize();Object.assign(l,{uTime:t.uTime,uTowerCol:i.uTowerCol,uLen:i.uLen,uCool:i.uCool,uShaft:i.uShaft,uHD:{value:p}});const P=new e.ShaderMaterial({uniforms:l,fog:!0,transparent:!0,depthWrite:!1,blending:e.MultiplyBlending,side:e.DoubleSide,forceSinglePass:!0,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      attribute vec3 aHS; attribute float aTyp; uniform vec3 uHD;
      varying vec3 vHS; varying vec2 vNear;
      void main(){
        vHS = aHS;
        vec4 wp = modelMatrix * vec4(position, 1.);
        vec4 mvPosition = viewMatrix * wp;
        vec3 toC = cameraPosition - wp.xyz;
        vec3 hdW = normalize(mat3(modelMatrix) * uHD + vec3(0., 1e-5, 0.));
        float along = abs(dot(toC, hdW)) / max(length(toC), 1e-3);
        float fade = smoothstep(4., 22., -mvPosition.z);
        vNear = vec2(fade * (aTyp > 0.5 ? smoothstep(0.55, 0.95, along) : 1.), aTyp);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      uniform float uTime, uLen, uCool, uShaft; uniform vec3 uTowerCol;
      varying vec3 vHS; varying vec2 vNear;
      ${he}
      void main(){
        float h = vHS.x, s = vHS.y, w = vHS.z;
        float foot = 1. - uLen;
        float m = smoothstep(foot - 0.02, foot + 0.14, h) * (1. - smoothstep(0.78, 1., h)) * smoothstep(0.0, 0.04, s);
        m *= exp(-s * 1.1) * (1. - 0.8 * smoothstep(0.7, 1., s / max(h, 1e-3)));
        float lat = vNear.y > 0.5 ? 1. - smoothstep(0.7, 1.3, abs(w)) : 1. - smoothstep(0.7, 1.0, abs(w)) * 0.85;
        float streaks = vn2(vec2(h * 26., w * 1.5 + 3.)) * 0.55 + vn2(vec2(h * 9. + 7., s * 6. - uTime * 0.03)) * 0.45;
        m *= lat * (0.45 + 1.1 * streaks);
        float arc = smoothstep(0.63, 0.68, h) * (1. - smoothstep(0.75, 0.80, h));
        float heat = smoothstep(uCool - 0.2, uCool + 0.2, h);
        // coloured shade, not added light: inside the shaft the fog is lit only through the tower's glass
        vec3 tc = pow(clamp(uTowerCol, 0.01, 1.), vec3(0.42));
        vec3 col = mix(tc, vec3(1., 0.6, 0.27), heat);                         // the cooled glass throws its own clean colour, the hot glass orange
        col = mix(col, vec3(1.), arc * 0.3);
        ${pe}
        float k = clamp(m * uShaft * (vNear.y > 0.5 ? 0.2 : 0.15) * vNear.x * (0.3 + 0.7 * fogK), 0., 1.);
        gl_FragColor = vec4(max(mix(vec3(1.), col, k), 0.), 1.);
      }`}),S=new e.Mesh(c,P);return S.frustumCulled=!1,S.renderOrder=5,S}function mt(t,i,a,o,s,n=1){const r=new e.CircleGeometry(a,72);r.rotateX(-Math.PI/2);const y=e.UniformsUtils.merge([e.UniformsLib.fog]),d=Math.hypot(s.x,s.z);Object.assign(y,{uTime:t.uTime,uSunDir:t.uSunDir,uSunCol:t.uSunCol,uFogCol:t.uFogCol,uLagoon:t.uLagoon,uOrange:t.uOrange,uTowerCol:i.uTowerCol,uLen:i.uLen,uCool:i.uCool,uShaft:i.uShaft,uU:i.uU,uGlow:i.uGlow,uRingHeat:i.uRingHeat,uShadow:{value:new e.Vector3(s.x/d,s.z/d,-s.y/d)},uD:{value:s.clone()},uRadius:{value:a},uDecal:{value:o?1:0},uGirth:{value:n}});const x=new e.ShaderMaterial({uniforms:y,fog:!0,transparent:!0,depthWrite:!1,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      varying vec3 vWP; varying vec2 vLP;
      void main(){
        vLP = position.xz;
        vec4 wp = modelMatrix * vec4(position, 1.); vWP = wp.xyz;
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      uniform float uTime, uLen, uCool, uShaft, uU, uRadius, uDecal, uRingHeat, uGirth;
      uniform vec3 uSunDir, uSunCol, uFogCol, uLagoon, uOrange, uTowerCol, uShadow, uD, uGlow;
      varying vec3 vWP; varying vec2 vLP;
      ${he}
      float wave(vec2 p){ return vn2(p * 0.33 + uTime * vec2(0.28, 0.17)) * 0.62 + vn2(p * 1.07 - uTime * vec2(0.22, 0.37)) * 0.38; }
      float towerR(float y){
        float r = mix(5.4, 4.8, smoothstep(7., 57., y));
        r = mix(8., r, smoothstep(0., 4.5, y));
        float a = (y - 60.3) / 1.3, b = (y - 76.5) / 1.3;
        r += 1.9 * exp(-a * a) + 1.8 * exp(-b * b);
        r = mix(r, 5.6, smoothstep(62., 63., y) * (1. - smoothstep(74., 75., y)));
        r = mix(r, 4.2, smoothstep(77.6, 78.6, y));
        r = mix(r, 1.3, smoothstep(84., 93., y));
        return r;
      }
      void main(){
        vec2 p = vLP;
        vec3 toCam = cameraPosition - vWP; float dist = length(toCam);
        vec3 V = toCam / max(dist, 1e-3);
        float k = 0.55 * (1. - smoothstep(50., 320., dist)) + 0.06;
        float w0 = wave(p), wx = wave(p + vec2(0.4, 0.)), wz = wave(p + vec2(0., 0.4));
        vec3 n = normalize(vec3((w0 - wx) * k, 1., (w0 - wz) * k));
        float ndv = clamp(dot(n, V), 0., 1.);
        float fres = pow(1. - ndv, 5.);
        vec3 R = reflect(-V, n);
        vec3 L = normalize(uSunDir);
        float sd = max(dot(R, L), 0.);
        vec3 sky = uFogCol * (0.86 + 0.08 * R.y);
        vec3 col = mix(uLagoon * 0.5, sky, 0.3 + 0.7 * fres) + uSunCol * (pow(sd, 260.) * 7. + pow(sd, 14.) * 0.22);
        // the tower's light on the water: its own shape laid down-sun, in its own colours, as a crawling net
        float s = dot(p, uShadow.xy), c = dot(p, vec2(-uShadow.y, uShadow.x));
        float hy = s * uShadow.z, yFoot = 95. * (1. - uLen);
        float Rt = mix(5.2, towerR(hy), smoothstep(0.5, 0.8, uU)) * uGirth;
        float m = (1. - smoothstep(Rt - 2.6, Rt + 3.2 + s * 0.015, abs(c) + (wave(p * 0.4) - 0.5) * 3.)) * smoothstep(0., 4., s) * smoothstep(yFoot - 1.5, yFoot + 1.5, hy) * (1. - smoothstep(92., 97., hy));
        float colm = 0.5 + 0.5 * cos(c * 2.1);
        m *= mix(1., 0.45 + 0.55 * colm, smoothstep(62.5, 63.5, hy) * (1. - smoothstep(72.5, 73.7, hy)));
        float heat = smoothstep(uCool - 0.17, uCool + 0.15, hy / 95.);
        vec3 lc = mix(pow(clamp(uTowerCol, 0.01, 1.), vec3(0.75)) * 1.6, uOrange * 1.8, heat);
        float net = caustic2(p * 0.3 + n.xz * 1.5, uTime);
        float cov = m * uShaft;
        vec3 tintC = mix(pow(clamp(uTowerCol, 0.01, 1.), vec3(0.6)), vec3(1., 0.55, 0.22), heat);
        col *= mix(vec3(1.), tintC, cov * 0.72);
        vec3 light = lc * net * cov * 0.75;
        // the ring's light: an ellipse of hot orange down-sun of it
        float dz = abs(uD.z) < 0.05 ? 0.05 : uD.z;
        float kk = (p.y - ${$.toFixed(1)}) / dz;
        vec2 q = vec2(p.x - uD.x * kk, -uD.y * kk - ${N.toFixed(1)});
        float rr = (length(q) - ${(K+1.05).toFixed(2)}) / 2.8;           // wide and soft: seen at a grazing angle a thin outline would be a hairline
        light += uOrange * 0.9 * exp(-rr * rr) * step(0., kk) * (0.3 + net) * uRingHeat * uShaft;
        // glow of hot glass close over the water
        float gd = dot(p, p) / max(uGlow.y * uGlow.y * uGirth * uGirth, 1.);
        light += uOrange * uGlow.x * exp(-gd) * (0.6 + 0.5 * w0);
        vec2 rq = p - vec2(0., ${$.toFixed(1)});
        light += uOrange * uRingHeat * 0.3 * exp(-dot(rq, rq) / 260.) * (0.6 + 0.5 * w0);
        float rim = 1. - smoothstep(uRadius * 0.82, uRadius * 0.99, length(p));
        ${pe}
        if (uDecal > 0.5) {
          float a = clamp(cov * 0.72 + dot(light, vec3(0.4)), 0., 1.) * rim;
          vec3 wcol = mix(uLagoon * 0.42, sky, 0.12 + 0.45 * fres);               // the water's own depth under the tint: coloured shade, never a pale wash
          gl_FragColor = vec4(max((wcol * tintC * cov * 0.72 + light) / max(a, 0.05), 0.), a * fogK);
        }
        else {
          float graze = 1. - clamp(V.y, 0., 1.); graze *= graze;
          float alpha = clamp(0.93 - 0.7 * graze, 0.2, 0.93) * rim;
          gl_FragColor = vec4(max(col + light, 0.), alpha);
          #include <fog_fragment>
        }
      }`}),u=new e.Mesh(r,x);return u.renderOrder=2,u.position.y=o?.03:0,u}async function dt(t,i={}){const a=t.rng.fork?t.rng.fork("blown-city-hero"):t.rng,o=i.palette&&i.palette.length>=7?i.palette:ke,s=t.quality?.detail??1,n=i.girth??1,r=w=>new e.Color(w),y=a(),d=i.towerColor||(y<.62?o[3]:y<.81?o[2]:"#0f8f5c"),x=a.sign(),u=a.pick([6,8,8,10]),g=a.int(2,4),f=[];for(let w=0;w<g;w++)f.push(Math.round(14+(w+.5)/g*38+a.range(-2.5,2.5)));const c=a.range(.92,1.08),l=a.range(.85,1.12),p={dir:x,nCol:u,bands:f,nRib:a.pick([12,16,16,20]),twist:x*a.range(.25,.7),frill:u*a.pick([2,3]),pruntTiers:a.int(3,5),onion:a.chance(.35),pontilTip:new e.Vector3(Math.cos(l)*(K+2.6),N+Math.sin(l)*(K+2.6),$),pontilDir:new e.Vector3(Math.cos(c),Math.sin(c),-.07).normalize()},P=r(d),S={glass:P,deep:P.clone().multiplyScalar(.55),pale:P.clone().lerp(r(o[0]),.45),milk:r(o[0]).multiplyScalar(.95),bell:r(o[4]),ringGlass:r(o[5]).lerp(r(o[4]),.4)},T=!i.shared,k=i.shared||De(o,i),z=i.sunDir?i.sunDir.isVector3?i.sunDir.clone():new e.Vector3().fromArray(i.sunDir):new e.Vector3(-.8,.22,-.56);z.normalize(),z.y<.08&&(z.y=.08,z.normalize());const b=z.clone().negate(),_=B/z.y,m={uU:{value:.74},uLen:{value:1},uBlobR:{value:5.5},uBreath:{value:0},uSwell:{value:0},uCool:{value:.5},uTopY:{value:B},uHeatMax:{value:1},uHotCap:{value:1},uHole:{value:K},uSpin:{value:0},uFootY:{value:0},uGate:{value:new e.Vector3},uSpinA:{value:0},uSteam:{value:new e.Vector3},uRing:{value:new e.Vector3},uWarm:{value:1},uTowerCol:{value:P.clone()},uShaft:{value:1},uGlow:{value:new e.Vector3(0,14,0)},uRingHeat:{value:1}},v={uU:m.uU,uLen:m.uLen,uBlobR:m.uBlobR,uBreath:m.uBreath,uSwell:m.uSwell,uCool:m.uCool,uTopY:m.uTopY,uHeatMax:m.uHeatMax,uHotCap:m.uHotCap},h=new e.Group;h.name="blown-city-hero";const A=new e.Group;A.name="mirror";const U=i.mirror!==!1,F=async()=>{await t.yield?.()},H=await nt(a,S,p,F);await F();const X=await st(H,a,S,p,F);await F(),X.boundingSphere=new e.Sphere(new e.Vector3(0,48,0),60);const me={shared:k,color:"#ffffff",vertexColors:!0,thickness:.3,core:.6,rim:.75,morph:!0,extraUniforms:v,caustic:0},ve=ae({...me,clip:1});await F();const M=new e.Mesh(X,ve);M.name="tower",M.scale.set(n,1,n),h.add(M);let C=null;U&&(C=new e.Mesh(X,ae({...me,clip:2})),C.scale.set(n,-1,n),C.frustumCulled=!1,A.add(C)),M.frustumCulled=!1,await F();const O=rt(a,p,r("#6d7178"));await F();const q={shared:k,color:"#777b82",steel:!0,vertexColors:!1,caustic:0},Y=new e.Mesh(O,ae({...q,clip:1}));if(Y.name="pipes",Y.frustumCulled=!1,h.add(Y),U){const w=new e.Mesh(O,ae({...q,clip:2}));w.scale.y=-1,w.frustumCulled=!1,A.add(w)}await F();const W=lt(a,p,S);await F();const D={shared:k,color:"#ffffff",vertexColors:!0,thickness:.5,core:.3,heat:.9,caustic:0},ee=ae({...D,clip:1}),oe=new e.Mesh(W,ee);oe.name="ring",h.add(oe);let de=null;if(U){de=ae({...D,clip:2});const w=new e.Mesh(W,de);w.scale.y=-1,w.frustumCulled=!1,A.add(w)}const Ne=ct(k,m);h.add(Ne),await t.yield?.();const He=ut(a,p,k,m,s,n,i.dropScale??1,i.dropCount??1);h.add(He),await F();const Ie=ht(a,k,m,s,n);h.add(Ie);const se=ft(k,4);h.add(se.mesh),await F();let be=null;i.shaft!==!1&&(be=pt(k,m,b,_,n),h.add(be));const Re=i.water===void 0?!0:i.water;let Me=null;Re&&(Me=mt(k,m,i.waterRadius??420,Re==="decal",b,n),h.add(Me)),U&&h.add(A),await t.yield?.();let ge=i.progress??.74,Be=0;const Ce=r(o[5]),Ve=r(o[4]),Ye=i.shaftGain??1,qe=i.haloGain??1,Pe=(w,G)=>{if(w<=G[0][0])return G[0][1];for(let I=0;I<G.length-1;I++)if(w<=G[I+1][0])return V(G[I][1],G[I+1][1],(w-G[I][0])/(G[I+1][0]-G[I][0]));return G[G.length-1][1]},Ke=[[0,22],[.3,30],[.45,36]],je=[[.6,-.4],[.655,-.15],[.7,.6],[.9,.86],[1,.93]],Ee=[[.42,1],[.6,.9],[.72,.8],[.92,.7]],re={footY:0,gatherY:80,hotLo:.5,len:1},we=(w,G,I,J,xe,le,ce,Se)=>{const j=se.pos.array,te=se.col.array,E=w*4;j[E]=G,j[E+1]=I,j[E+2]=J,j[E+3]=xe,te[E]=le.r*ce,te[E+1]=le.g*ce,te[E+2]=le.b*ce,te[E+3]=Se};function Fe(w,G){const I=(w<.45?Pe(w,Ke):w<.66?V(36,B,Math.pow((w-.45)/.21,1.25)):B)/B,J=Pe(w,je);m.uU.value=w,m.uLen.value=I,m.uCool.value=J,m.uHeatMax.value=Pe(w,Ee),m.uHotCap.value=V(.6,1,R(.6,.7,w)),m.uBlobR.value=5.2+.6*R(.3,.5,w);const xe=Z((w-.46)/.4,0,1)*5+G*.03,le=R(.44,.48,w)*(1-R(.84,.88,w));m.uBreath.value=xe-Math.floor(xe),m.uSwell.value=V(.45,1,le),m.uHole.value=V(1,K,R(.55,.78,w)),m.uSpin.value=G*1.1*p.dir;const ce=R(.48,.66,w),Se=m.uBlobR.value,j=Math.max(0,B*(1-I)-Se*.85*(1-ce));m.uFootY.value=j,m.uGate.value.set(1-R(.64,.66,w),R(.67,.7,w)*(1-R(.8,.9,w)),R(.5,.56,w)),m.uSteam.value.set(R(.6,.67,w)*(1-.45*R(.85,1,w)),R(.25,.4,w)*(1-R(.64,.68,w)),0);const te=Z((w-.66)/.17,0,1);m.uRing.value.set(9*n+175*Math.pow(te,.8),R(.655,.675,w)*(1-R(.7,.775,w))*.8,5+9*te),m.uShaft.value=R(.21,.29,w)*Ye;const E=R(J-.17,J+.15,0);m.uGlow.value.set(1.5*E*R(60,4,j)+.12,13+j*.35,0),m.uWarm.value=.25+.75*E;const et=Math.max(1-I,J-.02),Oe=Z(et,0,.97),_e=Math.max(B-(B-Oe*B)*1,j),ze=(_e+B)*.5,ye=B-_e,Le=1+5.5*(1-R(.3,.54,w)),Ge=R(.42,.5,w)*(1-R(.8,.9,w));we(0,0,ze,0,V(10+ye*.62,(25+ye*.9)*(.7+.3*n),Ge),Ce,V((.1+.1*Z(ye/60,0,1))*Le,V(.18,.3,R(.66,.72,w))*qe,Ge),0),we(1,0,V(ze,B-4,.5),0,(7+ye*.22)*(.6+.4*n),Ve,.16*Le,0),we(2,0,N,$,15.5,Ce,.3,1),we(3,0,Math.max(j,1.5),0,16*(.5+.5*n),Ce,.3*E*R(70,5,j),0),se.pos.needsUpdate=!0,se.col.needsUpdate=!0,re.footY=j,re.gatherY=ze,re.hotLo=Oe,re.len=I}Fe(ge,0);const We=new e.Quaternion;function $e(w,G,I){Be=G,k.uTime.value=G,T&&(h.getWorldQuaternion(We),k.uSunDir.value.copy(z).applyQuaternion(We));const J=G*.085*p.dir;M.rotation.y=J,C&&(C.rotation.y=J),m.uSpinA.value=J,Fe(ge,G)}const L=(w,G,I)=>new e.Vector3(w,G,I),Ue=L(b.x,0,b.z).normalize(),Qe={portalSeat:{position:L(0,N,$),facing:L(0,0,1),radius:K},flyThrough:[L(-42,N,218),L(-24,N,188),L(-8,N,164),L(0,N,148),L(0,N,110),L(0,N,$)],viewpoints:{basin:L(-34,N,205),approach:L(0,N,148),ring:L(0,N,96),side:L(120,30,70)},lookAt:L(0,46,0),towerTop:L(0,B,0),pipeTop:L(0,ue,0),gather:L(0,80,0),belfry:L(0,68,0),foot:L(0,0,0),pontil:{tip:p.pontilTip.clone(),direction:p.pontilDir.clone()},shaft:{from:L(0,B,0),to:Ue.clone().multiplyScalar(_*Math.hypot(b.x,b.z)),direction:b.clone()},steamRing:{center:L(0,0,0),maxRadius:184},bubbleDome:Ue.clone().multiplyScalar(98),flock:{center:L(0,70,0),radius:26}},Xe=54,Ze=16,Je=L(0,36,18);return{object:h,radius:Xe,height:Ze,center:Je,anchors:Qe,update:$e,setProgress(w){ge=Z(w,0,1)},getState:()=>({...re,progress:ge}),uniforms:{...k,...m},shared:k,mirror:A,water:Me,shaft:be,materials:{tower:ve,ring:ee},towerColor:"#"+P.getHexString(),variant:p,dispose(){},ground:!1,groundY:0}}export{tt as CITY_GLSL,dt as buildHero,ae as makeGlassMaterial,De as makeGlassUniforms};
