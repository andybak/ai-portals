import*as n from"three";import{clamp as Q,lerp as ae,smoothstep as T,makeRng as ma,hashSeed as pa}from"../kit/core.js";const ga=["#010208","#141B4D","#4A3F8C","#3F8CFF","#CFEAFF","#FF7A2A","#B8203A"],He=22.5,wa=6.5,Ne=.1345,H=9,Wa=5.5,Ke=-1.7,te=`
uniform float uTime, uBandPos, uBandGap, uWaveS, uWaveAmp, uBreath, uPxScale, uOwnS, uOwnAmp;
uniform vec3 uDown;
// the rare startle: one eased front running head -> core, a sharp leading edge and a 30 m tail behind it
float waveAt(float s) {
  float w = s - uWaveS;
  return uWaveAmp * exp(-w * w / (w > 0.0 ? 14.0 : 900.0));
}
// the travelling light: a bright band every uBandGap metres and a weaker one (half as bright) half-way between,
// plus the one band a world may place itself (setBand: arc length uOwnS, strength uOwnAmp, half as long again)
float bandW(float s, float w2) {
  float x = (s - uBandPos) / uBandGap;
  float d = (fract(x) - 0.5) * uBandGap, dh = (fract(x + 0.5) - 0.5) * uBandGap, o = s - uOwnS;
  float b = exp(-d * d / w2) + 0.5 * exp(-dh * dh / w2) + uOwnAmp * exp(-o * o / (w2 * 2.4));
  return min(b + waveAt(s), 1.25);
}
float bandAt(float s) { return bandW(s, 2.6); }
vec3 coilWarp(vec3 p, float s) {
  vec2 rd = p.xz / max(length(p.xz), 1e-3);
  vec2 tg = vec2(rd.y, -rd.x);
  float lon = 0.085 * sin(s * 0.8 - uTime * 1.4) + 0.04 * sin(s * 2.1 + uTime * 0.9);
  float bob = 0.09 * sin(s * 0.23 - uTime * 0.45) + 0.04 * sin(s * 0.71 + uTime * 0.8);
  p.xz = p.xz * uBreath + tg * lon;
  p.y += bob;
  return p;
}
`,fe=`
#ifdef USE_FOG
  uniform vec3 fogColor;
  #ifdef FOG_EXP2
    uniform float fogDensity;
  #else
    uniform float fogNear; uniform float fogFar;
  #endif
#endif
float fogAmount(float depth) {
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      return 1.0 - exp(-fogDensity * fogDensity * depth * depth);
    #else
      return smoothstep(fogNear, fogFar, depth);
    #endif
  #else
    return 0.0;
  #endif
}
`,ya=`
uniform float uHaul;
vec3 tentaclePos(vec3 root, float v, float len, float seed, float s, out float L) {
  float ph = seed * 6.2832;
  float haul = 1.0 - 0.33 * (0.5 + 0.5 * sin(uTime * (0.32 + 0.3 * fract(seed * 7.31)) + ph));
  haul = mix(haul, 0.28, uHaul);
  L = len * haul;
  vec2 rd = root.xz / max(length(root.xz), 1e-3);
  vec3 tg = vec3(rd.y, 0.0, -rd.x), ro = vec3(rd.x, 0.0, rd.y);
  vec3 off = tg * (0.22 * sin(uTime * 0.6 + s * 0.35 - v * 2.2) + 0.07 * sin(uTime * 1.3 + ph - v * 5.0))
           + ro * (0.16 * sin(uTime * 0.47 + s * 0.5 + ph * 0.3 - v * 1.7));
  vec3 lean = tg * sin(ph * 3.0) + ro * cos(ph * 5.0);
  return root + uDown * (L * v) + off * (v * v * L * 0.5) + lean * (0.045 * L * v * (0.4 + 0.6 * v));
}
`,ba=`
attribute vec3 iPos; attribute vec4 iQuat; attribute vec4 iData;   // iData: s, length (m), seed, pulse depth
attribute float aPart;                                            // 0 outer wall, 1 inner cavity
uniform float uPulseHz, uPulseK, uBandNear, uNearGain, uNearWide;
varying vec3 vLocal, vN, vView, vL; varying float vPart, vGlow, vEnergy, vSeed, vPulse, vFogDepth, vNear;
${te}
vec3 qrot(vec4 q, vec3 v) { return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v); }
void main() {
  float s = iData.x;
  float th = uTime * 6.2832 * uPulseHz - s * uPulseK + iData.z * 0.9;
  float pulse = 0.5 + 0.5 * sin(th); pulse = pulse * pulse * pulse;
  vec3 lp = position;
  lp.xz *= 1.0 - iData.w * pulse * smoothstep(0.08, 1.0, lp.y);
  lp.y *= 1.0 + 0.12 * iData.w * pulse;
  vec3 c = coilWarp(iPos, s);
  vec4 mc = modelViewMatrix * vec4(c, 1.0);
  float dist = max(length(mc.xyz), 0.05);
  float px = iData.y * uPxScale / dist;                 // bell length in pixels
  float grow = max(1.0, 2.2 / max(px, 1e-3));           // never smaller than ~2 px: no sub-pixel sparkle
  vEnergy = mix(0.45, 1.0, smoothstep(1.5, 8.0, px)) / (grow * grow);
  // far bells seen edge-on stack up along the line of sight: dim them there so the far arm keeps its tint
  vec3 nView = normalMatrix * vec3(0.0, 1.0, 0.0);
  float face = abs(dot(mc.xyz / dist, nView / max(length(nView), 1e-4)));
  vEnergy *= mix(min(1.0, 0.08 + 1.5 * face + 4.0 * face * face), 1.0, smoothstep(6.0, 22.0, px));
  vec3 wp = c + qrot(iQuat, lp * iData.y * grow);
  vec4 mv = modelViewMatrix * vec4(wp, 1.0);
  gl_Position = projectionMatrix * mv;
  vN = normalMatrix * qrot(iQuat, normal);
  vL = normalMatrix * (qrot(iQuat, vec3(0.9, -0.3, 0.0)) - uDown * 0.6);     // toward the neighbours' light bodies
  vView = mv.xyz; vFogDepth = -mv.z;
  vLocal = vec3(position.x * 2.5, position.y, position.z * 2.5);
  vPart = aPart; vSeed = iData.z; vPulse = pulse;
  vNear = smoothstep(9.0, 28.0, px);                    // large on screen: the wall clears and the cavity, canals and lip carry it
  // a band on bells a metre from the lens keeps its tint (no white-out). Per cast: uBandNear is how much of the band a
  // large bell gives up (0.6; gold 0.9), uNearGain what is left of a large bell's own light (1; gold 0.72: champagne is
  // three times as luminous as the same amount of blue), uNearWide 1 starts both from 4 px instead of 9 (gold)
  float nearB = mix(vNear, smoothstep(4.0, 13.0, px), uNearWide);
  vGlow = (1.0 + 1.7 * bandAt(s) * (1.0 - uBandNear * nearB)) * mix(1.0, uNearGain, nearB);
}`,xa=`
uniform vec3 uBell, uRim, uCore, uCav;
uniform float uGain, uCavNear;
varying vec3 vLocal, vN, vView, vL; varying float vPart, vGlow, vEnergy, vSeed, vPulse, vFogDepth, vNear;
${fe}
${te}
void main() {
  vec3 N = vN / max(length(vN), 1e-4);
  vec3 V = -vView / max(length(vView), 1e-4);
  float ndv = abs(dot(N, V));
  float fres = pow(max(1.0 - ndv, 0.0), 2.4);
  float fwl = fwidth(vLocal.x) + fwidth(vLocal.z) + fwidth(vLocal.y) + 1e-5;
  vec3 col; float a;
  float rho = length(vLocal.xz) / 2.5;                 // radius in bell lengths
  float f3 = fres * sqrt(max(1.0 - ndv, 0.0));         // a tighter edge term
  if (vPart < 0.5) {
    // thick glass wall: clear face-on, a line of light where the view grazes it
    float mouth = smoothstep(0.9, 0.95, vLocal.y);
    float onVelum = mouth * (1.0 - smoothstep(0.298, 0.31, rho));
    float lip = onVelum * smoothstep(0.262, 0.274, rho);                 // a round lit lip drawn on the mouth membrane
    float wall = mix(0.022 + 0.8 * f3, 0.009 + 0.1 * f3 + 0.62 * f3 * f3, vNear) * (1.0 - onVelum) * (1.0 - 0.6 * smoothstep(0.9, 1.0, vLocal.y));
    // four radial canals from apex to rim
    float cd = min(abs(vLocal.x), abs(vLocal.z));
    float canal = (1.0 - smoothstep(0.026, 0.026 + fwl, cd)) * smoothstep(0.02, 0.2, vLocal.y) * (1.0 - onVelum);
    // the light body: a blue-white organ in the wall on the keeled back
    vec3 q = vLocal - vec3(0.86, 0.36, 0.0);
    float lb = exp(-dot(q, q * vec3(9.0, 22.0, 12.0)));
    float speck = 0.75 + 0.25 * sin(vSeed * 40.0 + uTime * (1.0 + fract(vSeed * 3.7)));
    vec3 H = V + vL / max(length(vL), 1e-4);
    float sp = abs(dot(N, H / max(length(H), 1e-4)));
    float glint = pow(sp, 110.0) * (1.0 - onVelum);      // the wet-glass highlight
    vec3 wcol = mix(uBell * 0.85, mix(uBell, uRim, 0.4), smoothstep(0.25, 1.0, vLocal.y));   // deeper at the apex, paler at the mouth
    col = wcol * wall + uRim * (canal * mix(0.3, 0.6, vNear) + lip * (mix(0.55, 0.95, vNear) + 0.5 * vPulse) + glint * 0.65) + uCore * lb * 1.5 * speck;
    a = clamp(0.02 + mix(0.22, 0.14, vNear) * f3 * (1.0 - onVelum) + mix(0.12, 0.2, vNear) * canal + 0.3 * lip + 0.6 * lb + 0.4 * glint + 0.03 * onVelum, 0.0, 0.85);
  } else {
    // inner cavity: darker water held inside the bell, its own wall catching a thinner edge of light
    col = uCav * (0.2 + 0.5 * fres) + uBell * (0.3 * f3);
    a = mix(0.34, uCavNear, vNear) + 0.22 * fres;       // uCavNear 0.15; gold holds its cavity darker so it reads against champagne
  }
  col *= vGlow * uGain * vEnergy;
  a *= mix(vEnergy, 1.0, 0.0);
  float ff = fogAmount(vFogDepth);
  #ifdef USE_FOG
    col = col * (1.0 - ff) + fogColor * ff * a;
  #endif
  gl_FragColor = vec4(col, a);
}`,_a=`
attribute vec3 aRel; attribute float aS; attribute float aKind;   // kind 0 stem, 1 polyp, 2 float
uniform mat3 uHang;
varying vec3 vColor, vN, vView, vNl; varying float vGlow, vKind, vFogDepth;
${te}
void main() {
  float k = step(0.5, aKind) * (1.0 - step(1.5, aKind));
  vec3 rel = aRel, n = normal;
  if (k > 0.5) {
    // polyps hang with gravity and nod as the stem works
    float sw = 0.25 * sin(uTime * 1.7 + aS * 3.1) * clamp(-aRel.y * 14.0, 0.0, 1.0);
    rel.xz += rel.y * sw * vec2(0.6, 0.8);
    rel = uHang * rel; n = uHang * n;
  }
  vec3 wp = coilWarp(position, aS) + rel;
  vec4 mv = modelViewMatrix * vec4(wp, 1.0);
  gl_Position = projectionMatrix * mv;
  vN = normalMatrix * n; vNl = n; vView = mv.xyz; vFogDepth = -mv.z;
  vColor = color; vKind = aKind;
  vGlow = bandAt(aS);
}`,Ia=`
uniform vec3 uLight;
varying vec3 vColor, vN, vView, vNl; varying float vGlow, vKind, vFogDepth;
${fe}
${te}
void main() {
  vec3 N = vN / max(length(vN), 1e-4);
  vec3 V = -vView / max(length(vView), 1e-4);
  float fres = pow(max(1.0 - abs(dot(N, V)), 0.0), 2.0);
  // lit only by the bells that sit above it: brighter on the side turned to them, never by a lamp
  float up = 0.5 - 0.5 * dot(vNl / max(length(vNl), 1e-4), uDown);
  float lit = vKind < 0.5 ? 0.14 + 0.3 * up + 0.95 * fres : 0.2 + 0.5 * up + 1.0 * fres;
  vec3 col = vColor * lit * (0.75 + 1.5 * vGlow) + uLight * fres * (0.12 + 0.4 * vGlow);
  if (vKind > 1.5) col = vColor * (0.9 + 1.2 * fres);
  float ff = fogAmount(vFogDepth);
  #ifdef USE_FOG
    col = mix(col, fogColor, ff);
  #endif
  gl_FragColor = vec4(col, 1.0);
}`,Oa=`
attribute vec3 iRoot; attribute vec4 iData;     // s, length, seed, bead count
uniform float uBeadR, uTentW;
varying float vX, vV, vL, vThread, vGlow, vPx, vEnergy, vSeed, vNb, vFogDepth;
${te}
${ya}
void main() {
  float s = iData.x, L, L2;
  vec3 root = coilWarp(iRoot, s) + uDown * 0.075;
  vec3 p = tentaclePos(root, position.y, iData.y, iData.z, s, L);
  vec3 p2 = tentaclePos(root, position.y + 0.03, iData.y, iData.z, s, L2);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vec3 tv = (modelViewMatrix * vec4(p2 - p, 0.0)).xyz;
  vec3 c = cross(tv, mv.xyz);
  vec3 side = c / max(length(c), 1e-6);
  float dist = max(length(mv.xyz), 0.05);
  float trueHw = uBeadR * 1.7;
  float thread = max(trueHw, 0.9 * dist / uPxScale);      // the far thread: never under ~1.8 px
  float hw = max(uTentW, thread);                         // near: room for the side branches
  mv.xyz += side * (position.x * hw);
  gl_Position = projectionMatrix * mv;
  vX = position.x * hw; vV = position.y; vL = L; vThread = thread; vSeed = iData.z; vNb = iData.w;
  vPx = uBeadR * uPxScale / dist;
  vEnergy = trueHw / thread;
  vGlow = bandAt(s);
  vFogDepth = -mv.z;
}`,qa=`
uniform vec3 uBead, uLine, uTip;
uniform float uBeadR, uTentW;
varying float vX, vV, vL, vThread, vGlow, vPx, vEnergy, vSeed, vNb, vFogDepth;
${fe}
void main() {
  float yM = vV * vL;
  float cell = vL / vNb;
  float idx = floor(vV * vNb);
  float dy = (fract(vV * vNb) - 0.5) * cell;
  float h = fract(sin(idx * 12.9898 + vSeed * 78.233) * 43758.5453);
  float on = step(0.5, idx);
  float br = uBeadR * (0.7 + 0.6 * h) * on;
  float aaX = fwidth(vX) + 1e-6;
  // the side branch: leaves the thread above the bead and hangs out and down to it, left and right in turn
  float sg = mod(idx, 2.0) * 2.0 - 1.0;
  vec2 B = vec2(sg * uTentW * (0.38 + 0.3 * h), 0.12 * cell);
  vec2 A = vec2(0.0, -0.34 * cell);
  vec2 q = vec2(vX, dy);
  vec2 ba = B - A;
  float t = clamp(dot(q - A, ba) / max(dot(ba, ba), 1e-8), 0.0, 1.0);
  float dseg = length(q - A - ba * t);
  float branch = (1.0 - smoothstep(0.0008, 0.0008 + aaX, dseg)) * on;
  vec2 e = (q - B) * vec2(1.0, 0.72);                     // the bead is a little longer than wide
  float d = length(e) / max(br, 1e-4);
  float aa = aaX / max(br, 1e-4);
  float bead = (1.0 - smoothstep(1.0 - aa, 1.0 + aa, d)) * step(1e-4, br);
  float z = sqrt(max(1.0 - d * d, 0.0));
  float shade = 0.22 + 0.95 * pow(max(1.0 - z, 0.0), 1.4) + 0.5 * pow(z, 10.0);
  float line = max(1.0 - smoothstep(0.0011, 0.0011 + aaX, abs(vX)), branch * 0.8);
  // a warm stinging tip under every bead (the brief's rose-orange, in miniature)
  vec2 tq = q - B - vec2(0.0, br * 1.25);
  float tip = exp(-dot(tq, tq) / max(br * br * 0.16, 1e-8)) * step(1e-4, br);
  vec3 col = uBead * shade * bead + uLine * line * (1.0 - bead) + uTip * tip * (1.0 - bead);
  float a = max(max(bead * 0.75, line * 0.5), tip * 0.5);
  // far away the beads merge into an even thread
  float detail = smoothstep(0.5, 1.5, vPx);
  float fa = 0.42 * (1.0 - smoothstep(0.25, 1.0, abs(vX) / max(vThread, 1e-5)));
  col = mix(uBead * 0.4 * fa, col, detail); a = mix(fa, a, detail);
  float fall = 0.2 + 1.0 / (1.0 + yM * yM * 0.8);      // lit by the bells above, dimmer down the curtain
  col *= fall * (0.8 + 1.7 * vGlow) * vEnergy; a *= vEnergy;
  float ff = fogAmount(vFogDepth);
  #ifdef USE_FOG
    col = col * (1.0 - ff) + fogColor * ff * a;
  #endif
  gl_FragColor = vec4(col, a);
}`,Ha=`
attribute vec3 iRoot; attribute vec4 iData;     // s, length, seed, position along the tentacle (0..1)
varying vec2 vP; varying float vI, vDetail, vFogDepth;
${te}
${ya}
void main() {
  float s = iData.x, L, seed = iData.z;
  vec3 root = coilWarp(iRoot, s) + uDown * 0.075;
  vec3 c = tentaclePos(root, iData.w, iData.y, seed, s, L);
  float tw = uTime * 2.1 + seed * 17.0;
  float k = floor(tw / 3.14159);
  float jerk = pow(abs(sin(tw)), 10.0);
  c += vec3(sin(k * 2.4 + seed * 9.0), cos(k * 3.7 + seed * 5.0), sin(k * 5.1 + seed * 3.0)) * (0.04 * jerk);
  vec4 mv = modelViewMatrix * vec4(c, 1.0);
  float dist = max(length(mv.xyz), 0.05);
  float hs = max(0.07, 2.0 * dist / uPxScale);
  float roll = 0.6 * sin(uTime * 0.9 + seed * 30.0) + 2.5 * jerk * sin(k * 7.0);
  float cr = cos(roll), sr = sin(roll);
  mv.xy += position.xy * hs;
  gl_Position = projectionMatrix * mv;
  vec2 q = position.xy * hs;
  vP = vec2(cr * q.x - sr * q.y, sr * q.x + cr * q.y);
  vDetail = smoothstep(2.0, 6.0, 0.02 * uPxScale / dist);       // body size in pixels
  float e = 0.07 / hs;
  vI = e * e * (0.8 + 0.2 * sin(uTime * 3.0 + seed * 50.0)) * (1.0 + 0.5 * bandAt(s));
  vFogDepth = -mv.z;
}`,Ka=`
uniform vec3 uEmber, uEmberHot;
varying vec2 vP; varying float vI, vDetail, vFogDepth;
${fe}
float seg(vec2 p, vec2 a, vec2 b) { vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-8), 0.0, 1.0); return length(pa - ba * h); }
void main() {
  vec2 p = vP;
  float r = length(p);
  float body = exp(-(p.x * p.x * 2.6 + p.y * p.y) / 0.00022);
  float tail = exp(-(p.x * p.x * 9.0 + (p.y + 0.02) * (p.y + 0.02)) / 0.00016) * 0.5;
  float da = min(seg(p, vec2(0.0, 0.012), vec2(0.028, 0.02)), seg(p, vec2(0.0, 0.012), vec2(-0.028, 0.02)));
  float ant = exp(-da * da / 0.000009) * 0.45;
  float halo = exp(-r / 0.02) * 0.2 * (1.0 - smoothstep(0.045, 0.07, r));
  float soft = exp(-r * r / 0.0007);
  float shape = mix(soft, body + tail + ant, vDetail);
  vec3 col = uEmberHot * (2.5 * shape) + uEmber * halo;
  col *= vI * (1.0 - fogAmount(vFogDepth));
  gl_FragColor = vec4(col, 1.0);
}`,Be=`
attribute vec3 iPos; attribute vec4 iData;      // s, diameter, seed, gain
uniform float uFadeA, uFadeB, uFadeSize, uBase, uBandGain, uBandWidth, uDrift, uTwinkle, uMinE, uFar, uEdge, uEdgeMin, uFarBase, uWaveK;
varying vec2 vUv; varying float vI, vFogDepth;
${te}
void main() {
  vec3 c = coilWarp(iPos, iData.x);
  float ph = fract(uTime * uDrift * 0.25 + iData.z);       // dust sinks 4 m, fading in and out, and starts again
  float live = step(1e-5, uDrift);
  c += uDown * ((ph - 0.5) * 4.0 * live);
  vec4 mv = modelViewMatrix * vec4(c, 1.0);
  float dist = max(length(mv.xyz), 0.05);
  float k = uFadeA + uFadeSize * iData.y;
  float fade = smoothstep(k, k + uFadeB + uFadeSize * iData.y * 1.4, dist);
  float hs = max(iData.y * 0.5, 1.5 * dist / uPxScale);
  float e = iData.y * 0.5 / hs;
  hs *= 1.0 + uFar * smoothstep(40.0, 110.0, dist);
  mv.xy += position.xy * hs * step(0.002, fade);
  gl_Position = projectionMatrix * mv;
  vUv = position.xy;
  // seen edge-on the far arm stacks dozens of sprites on one line of sight: keep the tint, not a white wedge
  vec3 nView = (modelViewMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz;
  float face = abs(dot(mv.xyz / dist, nView / max(length(nView), 1e-4)));
  float bandCap = mix(1.0, 0.2 + 0.8 * smoothstep(0.1, 0.35, face), uEdge);
  vI = fade * max(e * e, uMinE) * iData.w * (uBase * (1.0 + uFarBase * smoothstep(40.0, 110.0, dist)) + uBandGain * bandCap * bandW(iData.x, uBandWidth)) * (1.0 - uTwinkle + uTwinkle * sin(uTime * (0.7 + 2.0 * uTwinkle * fract(iData.z * 9.0)) + iData.z * 40.0)) * mix(1.0, sin(3.14159 * ph), live);
  // (uEdgeMin: what is left edge-on within ~25 m of the lens: 0.03 keeps the far arm's tint; gold's haze holds 0.5 there,
  // so the water behind the rope glows on the close passes, where the lens flies in the disc's own plane)
  vI *= mix(1.0, min(1.0, mix(0.03, uEdgeMin, 1.0 - smoothstep(16.0, 34.0, dist)) + 0.9 * face + 3.2 * face * face), uEdge);
  vI *= 1.0 + uWaveK * waveAt(iData.x);                  // the startle: carriers and halo swell behind the front
  vFogDepth = -mv.z;
}`,Me=`
uniform vec3 uCol, uTail;
uniform float uSoft, uSharp;
varying vec2 vUv; varying float vI, vFogDepth;
${fe}
void main() {
  float r2 = dot(vUv, vUv);
  float hard = max(exp(-r2 * 3.6) - 0.027, 0.0) * (1.0 - smoothstep(0.75, 1.0, r2));
  float w = max(1.0 - r2, 0.0);
  float soft = exp(-r2 * uSharp) * w * w;                // the halo: no shoulder and no edge, so sprites merge into one haze
  float g = mix(hard, soft, uSoft);
  vec3 c = mix(uTail, uCol, smoothstep(0.0, 0.35, g));   // the dim skirt may be paler than the core (gold: amber, not maroon)
  gl_FragColor = vec4(c * (g * vI * (1.0 - fogAmount(vFogDepth))), 1.0);
}`,Ua=`
attribute float aS; attribute float aV;
varying float vS, vV, vI, vFogDepth;
${te}
uniform float uHaul;
void main() {
  vec3 p = coilWarp(position, aS);
  float L = 2.75 * (0.84 + 0.08 * sin(uTime * 0.4 + aS * 0.6)) * mix(1.0, 0.3, uHaul);
  p += uDown * (aV * L);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float dist = length(mv.xyz);
  vS = aS; vV = aV; vFogDepth = -mv.z;
  vec3 nView = (modelViewMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz;
  float face = abs(dot(mv.xyz / max(dist, 1e-3), nView / max(length(nView), 1e-4)));
  vI = smoothstep(24.0, 60.0, dist) * (0.8 + 1.6 * bandAt(aS)) * min(1.0, 0.03 + 0.9 * face + 3.2 * face * face);
}`,Xa=`
uniform vec3 uBead, uEmber;
varying float vS, vV, vI, vFogDepth;
${fe}
void main() {
  float streak = 0.6 + 0.4 * sin(vS * 23.0 + 2.0 * sin(vS * 5.3));
  float fall = 0.08 + 0.55 * pow(max(1.0 - vV, 0.0), 1.6);
  float edge = smoothstep(0.0, 0.05, vV) * (1.0 - smoothstep(0.9, 1.0, vV));
  float fringe = smoothstep(0.7, 0.9, vV) * (1.0 - smoothstep(0.9, 1.0, vV));
  float dots = 0.5 + 0.5 * sin(vS * 31.0 + 3.0 * sin(vS * 3.1)); dots = 0.25 + 0.75 * dots * dots;
  vec3 col = uBead * (0.2 * streak * fall * edge) + uEmber * (0.7 * fringe * dots);
  gl_FragColor = vec4(col * vI * (1.0 - fogAmount(vFogDepth)), 1.0);
}`,$a=`
attribute vec3 aDir; attribute float aS; attribute float aSide;
uniform float uW, uBase, uBand, uWaveK;
uniform vec2 uFade;
varying float vX, vI, vFogDepth;
${te}
void main() {
  vec3 p = coilWarp(position, aS);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vec3 tv = (modelViewMatrix * vec4(aDir, 0.0)).xyz;
  vec3 c = cross(tv, mv.xyz);
  vec3 side = c / max(length(c), 1e-6);
  float dist = max(length(mv.xyz), 0.05);
  float hw = max(uW, 1.5 * dist / uPxScale);
  mv.xyz += side * (aSide * hw);
  gl_Position = projectionMatrix * mv;
  vX = aSide;
  vI = (uW / hw) * (1.0 - smoothstep(uFade.x, uFade.y, dist)) * (uBase + uBand * bandW(aS, 3.4)) * (1.0 + uWaveK * waveAt(aS));
  vFogDepth = -mv.z;
}`,ja=`
uniform vec3 uCol;
varying float vX, vI, vFogDepth;
${fe}
void main() {
  float g = max(1.0 - vX * vX, 0.0);
  gl_FragColor = vec4(uCol * (g * g * vI * (1.0 - fogAmount(vFogDepth))), 1.0);
}`;function Qa(m,y,o){const x=m==="tight"?Math.PI*4:9.23,w=m==="tail"?Ke:0,A=x+Math.PI*2-.06,B=3e3,V=(A-w)/B,M=i=>T(4.1,4.9,i),P=i=>1-T(x-.45,x+.45,i);let a=0,c=0;for(let i=0;i<4e3;i++){const f=(i+.5)*(A/4e3);a+=Ne*(1-M(f))*P(f)*(A/4e3),c+=M(f)*P(f)*(A/4e3)}const b=(Math.log(He/wa)-a)/c,v=i=>i<0?Ne+.2*T(0,Ke,i):(Ne*(1-M(i))+b*M(i))*P(i),X=Math.round(-w/V),E=new Float64Array(B+1);E[X]=Math.log(He);for(let i=X+1;i<=B;i++)E[i]=E[i-1]-v(w+(i-.5)*V)*V;for(let i=X-1;i>=0;i--)E[i]=E[i+1]+v(w+(i+.5)*V)*V;const z=new Float32Array((B+1)*3),D=new Float32Array(B+1),F=new Float32Array((B+1)*3);for(let i=0;i<=B;i++){const f=w+i*V,G=T(4.2,5.3,f),L=T(x-.6,x,f),R=T(0,Ke,f),$=ae(.05,.34,G)*(1-.62*L)+.5*R,ye=ae(.04,.42,G)*(1-.7*L)+.4*R,j=T(4.7,5.3,f),oe=.05*(1-.62*L),ne=.04*(1-.7*L),he=Math.exp(E[i])+o*(ae($,oe,j)*y.fbm2(f*1.15+11.3,3.7,3)+($-oe)*j*1.8*y.n2(f*.55+11.3,3.7)),De=o*(ae(ye,ne,j)*y.fbm2(f*.9-4.1,17.9,3)+(ye-ne)*j*1.8*y.n2(f*.45-4.1,17.9))-6*R*R;z[i*3]=he*Math.sin(f),z[i*3+1]=De,z[i*3+2]=he*Math.cos(f);const K=Math.exp(E[i])+$*o*y.fbm2(f*1.15+11.3,3.7,3),Te=ye*o*y.fbm2(f*.9-4.1,17.9,3)-6*R*R;F[i*3]=K*Math.sin(f),F[i*3+1]=Te,F[i*3+2]=K*Math.cos(f),i>0&&(D[i]=D[i-1]+Math.hypot(F[i*3]-F[i*3-3],F[i*3+1]-F[i*3-2],F[i*3+2]-F[i*3-1]))}const W=D[B],O=(i,f)=>{const G=Q(Math.floor(i),0,B-1),L=Q(i-G,0,1),R=G*3;return f.set(ae(z[R],z[R+3],L),ae(z[R+1],z[R+4],L),ae(z[R+2],z[R+5],L))},ie=i=>{let f=0,G=B;for(;G-f>1;){const L=f+G>>1;D[L]<=i?f=L:G=L}return f+Q((i-D[f])/Math.max(D[G]-D[f],1e-6),0,1)},se={length:W,tA:w,tB:A,T1:x,b2:b,coil:m,pointAtS(i,f=new n.Vector3){return O(ie(Q(i,0,W)),f)},pointAtT(i,f=new n.Vector3){return O((Q(i,w,A)-w)/V,f)},sOfT(i){const f=(Q(i,w,A)-w)/V,G=Math.min(Math.floor(f),B-1);return ae(D[G],D[G+1],f-G)},tOfS(i){return w+ie(Q(i,0,W))*V},frame(i,f){const G=se.pointAtS(i-.06,Sa),L=se.pointAtS(i+.06,Aa);return f.T.subVectors(L,G).normalize(),f.B.crossVectors(f.T,Ya).normalize(),f.U.crossVectors(f.B,f.T).normalize(),se.pointAtS(i,f.P),f}};return se}const Sa=new n.Vector3,Aa=new n.Vector3,Fe=new n.Vector3,Ya=new n.Vector3(0,1,0),Za=()=>({P:new n.Vector3,T:new n.Vector3,U:new n.Vector3,B:new n.Vector3});function Ue(m,y,o,x,w,A){const B=[],V=[],M=[],P=(c,b,v,X)=>{const E=B.length/3;B.push(0,v,0),V.push(X);for(let z=0;z<b.length;z++)for(let D=0;D<c;D++){const F=D/c*Math.PI*2,W=b[z][0],O=b[z][1]*(X?1:A(F,W));B.push(Math.cos(F)*O,W,Math.sin(F)*O),V.push(X)}for(let z=0;z<c;z++)M.push(E,E+1+(z+1)%c,E+1+z);for(let z=0;z<b.length-1;z++)for(let D=0;D<c;D++){const F=E+1+z*c+D,W=E+1+z*c+(D+1)%c,O=F+c,ie=W+c;M.push(F,W,O,W,ie,O)}};x&&P(o,x,w,1),P(m,y,0,0);const a=new n.BufferGeometry;return a.setAttribute("position",new n.Float32BufferAttribute(B,3)),a.setAttribute("aPart",new n.Float32BufferAttribute(V,1)),a.setIndex(M),a.computeVertexNormals(),a}const Xe=(m,y)=>(o,x)=>(1+m*Math.pow(Math.max(0,Math.cos(o)),6)*(1-.55*x))*(1+y*Math.cos(2*o));function Y(m,y,o){const x=new n.InstancedBufferGeometry;x.index=m.index;for(const w in m.attributes)x.setAttribute(w,m.attributes[w]);for(const w in o)x.setAttribute(w,new n.InstancedBufferAttribute(o[w].array,o[w].size));return x.instanceCount=y,x.boundingSphere=new n.Sphere(new n.Vector3,1),x}function we(){const m=new n.BufferGeometry;return m.setAttribute("position",new n.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),m.setIndex([0,1,2,0,2,3]),m}function Ja(m){const y=[],o=[];for(let w=0;w<=m;w++){const A=Math.pow(w/m,.85);y.push(-1,A,0,1,A,0)}for(let w=0;w<m;w++){const A=w*2;o.push(A,A+1,A+2,A+1,A+3,A+2)}const x=new n.BufferGeometry;return x.setAttribute("position",new n.Float32BufferAttribute(y,3)),x.setIndex(o),x}function et(m,y){const o=c=>new n.Color(y[c]||ga[c]),x=o(0),w=o(1),A=o(2),B=o(3),V=o(4),M=o(5),P=o(6),a=(c,b,v)=>c.clone().lerp(b,v);if(m==="ghost"){const c=a(V,A,.25);return{wall:a(c,w,.1).multiplyScalar(.55),rim:a(A,V,.2).multiplyScalar(2),core:a(V,A,.25),cav:a(x,A,.35),bead:a(V,A,.3),glow:a(V,A,.5).multiplyScalar(.62),halo:a(A,P,.12).multiplyScalar(1.5),stem:a(V,A,.3),polyp:a(a(M,P,.5),V,.15),ember:M,red:P,black:x,gain:1,haloGain:.9,lures:2}}if(m==="gold"){const c=new n.Color(1,.8,.48),b=new n.Color(1,.62,.2),v=new n.Color(1,.9,.7);return{wall:c.clone().multiplyScalar(.62),rim:a(c,b,.3).multiplyScalar(1),core:v.clone(),cav:new n.Color(.05,.035,.02),bead:a(v,c,.4),glow:c.clone().multiplyScalar(.92),halo:new n.Color(.08,.036,.18),haloEdge:1,bandNear:.9,nearGain:.72,nearWide:1,cavNear:.28,carrier:v.clone().multiplyScalar(1.15),carrierBase:1.7,farBase:1.6,bandX:1.6,cord:v.clone(),cordGain:.7,waveK:.2,headCore:2.1,haloEdgeMin:.5,dustGain:3,pool:.11,stem:a(v,c,.3),polyp:a(a(M,P,.3),v,.15),ember:M,red:P,black:x,gain:.85,haloGain:1.5,lures:1}}return{wall:B.clone(),rim:a(B,V,.45),core:V.clone(),cav:a(x,w,.7),bead:a(V,B,.3),glow:a(B,V,.12),halo:a(B,A,.3),stem:a(V,B,.3),polyp:a(a(M,P,.25),V,.22),ember:M,red:P,black:x,gain:1,haloGain:1,lures:1}}async function tt(m,y={}){const o=m.rng,x=m.noise,w=Q(m.quality?.detail??1,.4,1),A=Array.isArray(y.palette)&&y.palette.length>=7?y.palette:ga,B=o(),V=o(),M=y.cast||(B<.5?"blue":B<.75?"ghost":"gold"),P=y.coil||(V<.6?"open":"tight"),a=et(M,A);await m.yield?.();const c=Qa(P,x,y.wobble??1);await m.yield?.();const b=c.length,v=Za(),X=c.sOfT(Math.max(c.tA,-.1)),E=c.sOfT(4.35),z=c.sOfT(c.T1),D=c.sOfT(5.3),F=e=>e>=X&&e<=E,W=1.1*o.range(.9,1.1),O=o.range(26,34),ie=16*o.range(.92,1.08),se=o.range(.94,1.1),i=o.range(.95,1.2),f=o.range(.35,.6),G=o.range(.9,1.1),L=o.range(.9,1.5),R=M==="gold"?22:14,$=new n.Group;$.name="longest-animal";const ye=new n.Matrix4,j=new n.Quaternion,oe=new n.Vector3,ne=new n.Vector3,he=new n.Vector3,De=new n.Vector3,K={near:{p:[],q:[],d:[]},far:{p:[],q:[],d:[]},head:{p:[],q:[],d:[]}},Te=(e,t,r,l,s,d,u,p)=>{c.frame(t,v),oe.copy(v.U).multiplyScalar(Math.cos(s)).addScaledVector(v.B,r*Math.sin(s)),ne.copy(oe).addScaledVector(v.T,d).normalize(),he.copy(v.T).multiplyScalar(-1).addScaledVector(ne,v.T.dot(ne)).normalize(),De.crossVectors(he,ne),j.setFromRotationMatrix(ye.makeBasis(he,ne,De)),e.p.push(v.P.x+oe.x*p,v.P.y+oe.y*p,v.P.z+oe.z*p),e.q.push(j.x,j.y,j.z,j.w),e.d.push(t,l,o(),u)};for(let e=0;e<64;e++){const t=e>>1,r=e&1?-1:1,l=.36+t*((H-.5)/32)+(r<0?.135:0),s=.5+.5*T(0,2.6,l);Te(K.head,l,r,.22*se*s*o.range(.94,1.08),1.35+o.range(-.1,.1),.7+o.range(-.08,.08),.3,.035)}await m.yield?.();let Ce=0;const Le=P==="tail",za=Le?.19:.16,$e=Math.max(.2,(b-H-(E-Math.max(X,H)))*2/(Le?760:860));for(let e=H+.15;e<b-.05;){const t=F(e),r=t?za:$e;for(let l=0;l<2;l++){const s=e+l*r*.5+o.range(-.02,.02),d=l?-1:1,u=.88+.2*(.5+.5*Math.sin(s/L*Math.PI*2)),p=(t?o.range(.11,.172):o.range(.135,.19)*($e/.2))*se*u;Te(t||e>E&&e<=D?K.near:K.far,Math.min(s,b),d,p,i+o.range(-.28,.24),f+o.range(-.12,.12),.2,.028),Ce++}e+=r,(Ce&127)===0&&await m.yield?.()}await m.yield?.();const Va=Ue(12,[[.1,.23],[.5,.4],[1,.33],[.965,.2]],4,[[.5,.2],[.93,.25]],.3,Xe(.2,0)),Ba=Ue(5,[[.1,.24],[.6,.4],[1,.31]],0,null,0,Xe(.15,0)),Ma=Ue(12,[[.05,.15],[.2,.32],[.5,.41],[.8,.4],[1,.3],[.955,.17]],8,[[.42,.21],[.7,.29],[.93,.235]],.24,Xe(.2,.1)),N=e=>new Float32Array(e),Re=e=>({iPos:{array:N(e.p),size:3},iQuat:{array:N(e.q),size:4},iData:{array:N(e.d),size:4}}),k={uTime:{value:0},uBandPos:{value:0},uBandGap:{value:O},uWaveS:{value:-500},uWaveAmp:{value:0},uBreath:{value:1.01},uPxScale:{value:480},uDown:{value:new n.Vector3(0,-1,0)},uHaul:{value:0},uOwnS:{value:-500},uOwnAmp:{value:0}},q=(e,t,r,l)=>new n.ShaderMaterial({uniforms:Object.assign(n.UniformsUtils.merge([n.UniformsLib.fog]),k,r),vertexShader:e,fragmentShader:t,fog:!0,...l}),ke={transparent:!0,premultipliedAlpha:!0,depthWrite:!1,side:n.DoubleSide},re={transparent:!0,depthWrite:!1,blending:n.AdditiveBlending,side:n.DoubleSide},je=(e,t,r)=>({uBell:{value:a.wall},uRim:{value:a.rim},uCore:{value:a.core},uCav:{value:a.cav},uGain:{value:r},uPulseHz:{value:e},uPulseK:{value:t},uBandNear:{value:a.bandNear??.6},uNearGain:{value:a.nearGain??1},uNearWide:{value:a.nearWide??0},uCavNear:{value:a.cavNear??.15}}),Qe=q(ba,xa,je(W,1.6,a.gain),ke),Ye=q(ba,xa,je(W*.75,1.15,a.gain*1.1),ke);a.headCore&&(Ye.uniforms.uCore={value:a.core.clone().multiplyScalar(a.headCore)});const _=(e,t,r,l)=>{const s=new n.Mesh(e,t);return s.frustumCulled=!1,s.renderOrder=r,s.name=l,$.add(s),s};_(Y(Ba,K.far.d.length/4,Re(K.far)),Qe,4,"bells-far"),_(Y(Va,K.near.d.length/4,Re(K.near)),Qe,5,"bells-near"),_(Y(Ma,64,Re(K.head)),Ye,6,"bells-head"),await m.yield?.();const be=[],Ze=[],Je=[],ea=[],aa=[],ta=[],ue=[],me=(e,t,r,l,s,d)=>(be.push(e.x,e.y,e.z),Ze.push(t.x,t.y,t.z),Je.push(r.x,r.y,r.z),ea.push(l.r,l.g,l.b),aa.push(s),ta.push(d),be.length/3-1),xe=new n.Vector3,U=new n.Vector3,h=new n.Vector3,pe=new n.Color,Se=5;let Pe=-1,Ae=0;for(let e=0;e<=b+.001;){const t=Math.min(e,b);c.frame(t,v);const l=(.0165+.012*(1-T(H-1.5,H+.5,t)))*(Ae&1?1.5:.72)*(.4+.6*T(0,.4,t))*(.35+.65*T(0,.6,b-t)),s=be.length/3;for(let d=0;d<Se;d++){const u=d/Se*Math.PI*2+Ae*.31;U.copy(v.U).multiplyScalar(Math.cos(u)).addScaledVector(v.B,Math.sin(u)),h.copy(v.P).addScaledVector(U,l),pe.copy(a.stem).multiplyScalar(.2+.14*(Ae&1)),me(h,xe,U,pe,t,0)}if(Pe>=0)for(let d=0;d<Se;d++){const u=Pe+d,p=Pe+(d+1)%Se,S=s+d,g=s+(d+1)%Se;ue.push(u,S,p,p,S,g)}if(Pe=s,Ae++,e>=b)break;e+=F(e)?.15:.36,(Ae&255)===0&&await m.yield?.()}await m.yield?.();const ce={r:[],d:[]},Z={r:[],d:[]},We=[[-.016,.014],[-.047,.0165],[-.078,.0075]],oa=new n.Vector3,Fa=a.polyp.clone().lerp(a.core,.3),na=(e,t,r,l,s,d)=>{c.frame(e,v);const u=o.range(0,6.28);h.copy(v.P).addScaledVector(v.U,-.012);const p=a.polyp.clone().lerp(a.red,l);pe.copy(p).multiplyScalar(r*.7);const S=me(h,xe,U.set(0,1,0),pe,e,1);for(let g=0;g<We.length;g++)for(let C=0;C<s;C++){const ee=u+C/s*Math.PI*2,ge=We[g][1]*t*(g===1?1+.25*Math.sin(ee*2+u):1),qe=We[g][0]*t;oa.set(Math.cos(ee)*ge+d*qe*Math.cos(u),qe,Math.sin(ee)*ge+d*qe*Math.sin(u)),U.set(Math.cos(ee),g===2?-.7:.15-g*.2,Math.sin(ee)).normalize(),pe.copy(p).lerp(Fa,g/2).multiplyScalar(r*(.8+.3*g)),me(h,oa,U,pe,e,1)}for(let g=0;g<s;g++)ue.push(S,S+1+g,S+1+(g+1)%s);for(let g=0;g<2;g++)for(let C=0;C<s;C++){const ee=S+1+g*s+C,ge=S+1+g*s+(C+1)%s;ue.push(ee,ee+s,ge,ge,ee+s,ge+s)}};for(let e=H+.3,t=0;e<b-.1;){++t%120===0&&await m.yield?.(),na(e,o.range(.65,1.25),o.range(.4,.7),o.range(0,.3),4,o.range(-.3,.3)),F(e)&&o.chance(Le?.3:.62)&&na(e+o.range(.04,.2),o.range(.4,.75),o.range(.3,.55),o.range(.1,.6),3,o.range(-.5,.5)),c.frame(e,v),h.copy(v.P).addScaledVector(v.U,-.012);const r=e>z,l=o(),s=(r?2.1:3)*G*o.range(.78,1.1);ce.r.push(h.x,h.y,h.z),ce.d.push(e,s,l,R),Z.r.push(h.x,h.y,h.z),Z.d.push(e,s,l,.985);const d=a.lures>1?1+(o.chance(.4)?1:0):o.chance(.35)?1:0;for(let u=0;u<d;u++)Z.r.push(h.x,h.y,h.z),Z.d.push(e,s,l,o.range(.45,.85));e+=(F(e)?.25:r?.34:.5)*o.range(.9,1.1)}{c.frame(.02,v);const e=a.ember.clone().lerp(a.core,.35).multiplyScalar(.9),t=be.length/3,r=8,l=[-.8,-.3,.3,.8],s=h.copy(v.P).addScaledVector(v.T,-.1).clone();me(Fe.copy(s).addScaledVector(v.T,.1),xe,U.copy(v.T),e,0,2);for(const u of l)for(let p=0;p<r;p++){const S=p/r*Math.PI*2,g=.05*Math.sqrt(1-u*u)*(1+.25*u);U.copy(v.U).multiplyScalar(Math.cos(S)).addScaledVector(v.B,Math.sin(S)),Fe.copy(s).addScaledVector(v.T,u*.1).addScaledVector(U,g),me(Fe,xe,U.clone().addScaledVector(v.T,u).normalize(),e,0,2)}const d=me(Fe.copy(s).addScaledVector(v.T,-.105),xe,U.copy(v.T).multiplyScalar(-1),e,0,2);for(let u=0;u<r;u++)ue.push(t,t+1+u,t+1+(u+1)%r),ue.push(d,t+1+3*r+(u+1)%r,t+1+3*r+u);for(let u=0;u<3;u++)for(let p=0;p<r;p++){const S=t+1+u*r+p,g=t+1+u*r+(p+1)%r;ue.push(S,S+r,g,g,S+r,g+r)}}const le=new n.BufferGeometry;le.setAttribute("position",new n.Float32BufferAttribute(be,3)),le.setAttribute("aRel",new n.Float32BufferAttribute(Ze,3)),le.setAttribute("normal",new n.Float32BufferAttribute(Je,3)),le.setAttribute("color",new n.Float32BufferAttribute(ea,3)),le.setAttribute("aS",new n.Float32BufferAttribute(aa,1)),le.setAttribute("aKind",new n.Float32BufferAttribute(ta,1)),le.setIndex(ue);const ra=new n.Matrix3,Da=q(_a,Ia,{uHang:{value:ra},uLight:{value:a.glow}},{vertexColors:!0,side:n.DoubleSide});_(le,Da,0,"stem-polyps"),await m.yield?.();{const e=ma(pa((m.seed??1)+":longest-animal:curtain"));for(let t=H+.42;t<E+6;t+=.25*e.range(.9,1.1)){c.frame(t,v),h.copy(v.P).addScaledVector(v.U,-.012);const r=e(),l=3*G*e.range(.62,1);ce.r.push(h.x,h.y,h.z),ce.d.push(t,l,r,R),e.chance(.45)&&(Z.r.push(h.x,h.y,h.z),Z.d.push(t,l,r,.985))}}await m.yield?.();const la=ce.d.length/4,ia=Z.d.length/4,Ta=M==="gold"?.0115:.0095,Pa=q(Oa,qa,{uBead:{value:a.bead},uLine:{value:a.bead.clone().multiplyScalar(.55)},uBeadR:{value:Ta},uTentW:{value:M==="gold"?.05:.042},uTip:{value:a.polyp.clone().lerp(a.ember,.5).multiplyScalar(1.1)}},ke);_(Y(Ja(6),la,{iRoot:{array:N(ce.r),size:3},iData:{array:N(ce.d),size:4}}),Pa,7,"tentacles");const Ga=a.ember.clone().lerp(a.red,.12),Ea=q(Ha,Ka,{uEmber:{value:a.ember},uEmberHot:{value:Ga}},re);_(Y(we(),ia,{iRoot:{array:N(Z.r),size:3},iData:{array:N(Z.d),size:4}}),Ea,8,"lures");const sa=(e,t,r,l,s)=>{const d=[],u=[];for(let p=0;p<e;p++){const S=Q((p+o())/e*b,0,b);c.pointAtS(S,h),d.push(h.x+o.range(-l,l),h.y+s+o.range(-l,l)*.6,h.z+o.range(-l,l));const g=T(z-6,z,S);u.push(S,o.range(t,r)*(1-.35*g*(r>4?1:0)),o(),o.range(.8,1.2)*(1+.25*g)*(.72+.5*(.5+.5*x.n2(S*.11,41.7))))}return{iPos:{array:N(d),size:3},iData:{array:N(u),size:4}}},ua=Math.round(620*w*b/160),ca=Math.round(58*w*b/160),ze=(e,t,r,l,s,d,u,p,S,g)=>({uCol:{value:e},uFadeA:{value:t},uFadeB:{value:r},uFadeSize:{value:l},uBase:{value:s},uBandGain:{value:d},uBandWidth:{value:u},uDrift:{value:p},uTwinkle:{value:S},uMinE:{value:g},uFar:{value:0},uEdge:{value:0},uEdgeMin:{value:.03},uFarBase:{value:0},uTail:{value:e},uSoft:{value:0},uSharp:{value:2.6},uWaveK:{value:0}}),va=.041*a.haloGain/Math.sqrt(w),ve=q(Be,Me,ze(a.halo,5,13,0,va,va,70,0,.08,0),re);ve.uniforms.uSoft.value=1,ve.uniforms.uTail.value=a.tail||a.halo,ve.uniforms.uSharp.value=a.haloSharp||2.6,ve.uniforms.uEdge.value=a.haloEdge||0,ve.uniforms.uEdgeMin.value=a.haloEdgeMin??.03;const J=q(Be,Me,ze(a.glow,14,34,0,.1/w,.34/w,3.2,0,.08,0),re);J.uniforms.uFar.value=.7,J.uniforms.uEdge.value=1,J.uniforms.uFarBase.value=a.farBase??0,a.carrier&&(J.uniforms.uCol.value=a.carrier,J.uniforms.uTail.value=a.carrier,J.uniforms.uBase.value*=a.carrierBase??1,J.uniforms.uBandGain.value*=(a.bandX??1)*(a.carrierBase??1)),J.uniforms.uWaveK.value=2*(a.waveK??1),ve.uniforms.uWaveK.value=1.6*(a.waveK??1),sa(ca,11,25,1.6,-.6);{const e=ma(pa((m.seed??1)+":longest-animal:halo")),t=Math.round(ca*1.5),r=[],l=[];for(let s=0;s<t;s++){const d=Q((s+e())/t*b,0,b),u=T(z-6,z,d);c.pointAtS(d,h),r.push(h.x+e.range(-1.6,1.6),h.y-.6+e.range(-1,1),h.z+e.range(-1.6,1.6)),l.push(d,e.range(13,24)*(1-.35*u),e(),e.range(.85,1.15)*(1+.25*u)*(.72+.5*(.5+.5*x.n2(d*.11,41.7))))}_(Y(we(),t,{iPos:{array:N(r),size:3},iData:{array:N(l),size:4}}),ve,1,"halo")}if(a.pool){const e=[],t=[];for(const[l,s,d]of[[1.5,12,1],[6.5,14,.9],[12,15,.6]])c.pointAtS(l,h),e.push(h.x,h.y-.5,h.z),t.push(l,s,.31+l*.07,d);const r=q(Be,Me,ze(a.halo.clone().multiplyScalar(1.2),.8,3.4,0,a.pool,a.pool*.5,70,0,.06,0),re);r.uniforms.uSoft.value=1,r.uniforms.uSharp.value=2.2,_(Y(we(),3,{iPos:{array:N(e),size:3},iData:{array:N(t),size:4}}),r,1,"head-pool")}if(_(Y(we(),ua,sa(ua,.95,1.45,.05,.06)),J,3,"carriers"),y.dust!==!1){const e=Math.round(1500*w*(y.dustDensity??1)),t=[],r=[];for(let s=0;s<e;s++){const d=o()*b;c.pointAtS(d,h);const u=o.gauss()*2.6,p=o.gauss()*1.7-.6,S=o.gauss()*2.6,g=u*u+p*p+S*S;t.push(h.x+u,h.y+p,h.z+S),r.push(d,o.range(.03,.07),o(),o.range(.35,1)/(1+g/9))}const l=q(Be,Me,ze(a.glow.clone().lerp(a.core,.35),0,.001,0,.55*(a.dustGain??1),1.5,26,.06,.45,.5),re);l.uniforms.uWaveK.value=1.2*(a.waveK??1),_(Y(we(),e,{iPos:{array:N(t),size:3},iData:{array:N(r),size:4}}),l,3,"dust")}{const e=[],t=[],r=[],l=[];let s=0;for(let u=H;u<=b;u+=.45,s++)if(c.pointAtS(u,h),e.push(h.x,h.y-.05,h.z,h.x,h.y-.05,h.z),t.push(u,u),r.push(0,1),s>0){const p=(s-1)*2;l.push(p,p+1,p+2,p+1,p+3,p+2)}const d=new n.BufferGeometry;d.setAttribute("position",new n.Float32BufferAttribute(e,3)),d.setAttribute("aS",new n.Float32BufferAttribute(t,1)),d.setAttribute("aV",new n.Float32BufferAttribute(r,1)),d.setIndex(l),_(d,q(Ua,Xa,{uBead:{value:a.bead},uEmber:{value:a.ember}},re),2,"veil")}await m.yield?.();{const e=[],t=[],r=[],l=[],s=[];let d=0;for(let g=0;g<=b;g+=.3,d++){c.frame(Math.min(g,b),v);for(const C of[-1,1])e.push(v.P.x,v.P.y,v.P.z),t.push(v.T.x,v.T.y,v.T.z),r.push(g),l.push(C);if(d>0){const C=(d-1)*2;s.push(C,C+1,C+2,C+1,C+3,C+2)}}const u=new n.BufferGeometry;u.setAttribute("position",new n.Float32BufferAttribute(e,3)),u.setAttribute("aDir",new n.Float32BufferAttribute(t,3)),u.setAttribute("aS",new n.Float32BufferAttribute(r,1)),u.setAttribute("aSide",new n.Float32BufferAttribute(l,1)),u.setIndex(s);const p=a.cordGain??1;_(u,q($a,ja,{uCol:{value:a.cord||a.core.clone().lerp(a.rim,.25)},uW:{value:.04},uBase:{value:.5*p},uBand:{value:3.4*p},uWaveK:{value:1},uFade:{value:new n.Vector2(30,60)}},re),1,"stem-light");const S=q(Be,Me,ze(a.halo,40,50,0,(y.farGlow??.16)*a.haloGain,0,70,0,.05,0),re);S.uniforms.uSoft.value=1,S.uniforms.uSharp.value=3.4,S.uniforms.uEdge.value=1,S.uniforms.uWaveK.value=0,_(Y(we(),1,{iPos:{array:N([0,0,0]),size:3},iData:{array:N([b*.5,y.farGlowSize??120,.37,1]),size:4}}),S,0,"far-glow")}await m.yield?.();const I=(e,t,r)=>new n.Vector3(e,t,r),_e=(e,t=new n.Vector3)=>c.pointAtT(e,t),Na=(e,t=new n.Vector3)=>t.subVectors(c.pointAtT(e+.01,Aa),c.pointAtT(e-.01,Sa)).normalize(),Ve=(e,t=1.8,r=1,l=new n.Vector3)=>{c.pointAtT(e,l);const s=Math.hypot(l.x,l.z)||1;return l.x-=l.x/s*t,l.z-=l.z/s*t,l.y-=r,l},da=[];for(let e=0;e<11;e++)da.push(Ve(.15+e/10*3.8));const Ca={normal:I(0,1,0),portalSeat:{position:I(0,0,0),normal:I(0,1,0),radius:Wa,ringRadius:wa},head:c.pointAtS(H*.5),headTip:c.pointAtS(0),headEnd:c.pointAtS(H),rimHigh:_e(Math.PI),liftOff:Ve(3.95),armPoint:_e,armTangent:Na,armInboard:Ve,flyThrough:da,dive:[I(0,66,0),I(0,48,0),I(0,32,0),I(0,16,0),I(0,0,0)],viewpoints:[{name:"galaxy",position:I(0,100,46),target:I(0,0,0)},{name:"arm",position:Ve(2),target:_e(2.42)},{name:"head",position:Ve(.02,2.4,.4),target:c.pointAtS(H*.55)},{name:"over-the-top",position:I(0,70,0),target:I(0,0,0)}]},fa=new n.Quaternion,ha=new n.Quaternion,La=new n.Matrix4,Ra=new n.Vector2,Ge=new n.Vector3(0,-1,0);let Ie=-1,de=-1,Oe=0;const ka=e=>{if(!(e>0)||e>=1){k.uWaveAmp.value=0,k.uHaul.value=0,Oe=0;return}const t=T(0,.2,e);k.uWaveS.value=ae(-10,b+30,t),k.uWaveAmp.value=T(0,.02,e)*(1-T(.2,.5,e)),k.uHaul.value=T(.01,.1,e)*(1-T(.25,1,e)),Oe=T(0,.2,e)*(1-T(.2,1,e))},Ee={object:$,radius:P==="tail"?36:24,height:24,center:I(0,0,0),anchors:Ca,ground:!1,groundY:-4,info:{cast:M,coil:P,length:b,turns:c.T1/(Math.PI*2),bells:Ce+64,tentacles:la,lures:ia,bandGap:O,bandSpeed:ie,pitch:Ne,rim:He},colors:{bell:a.wall,glow:a.glow,halo:a.halo,ember:a.ember},uniforms:k,setStartle(e){Ie=e,de=-1},startle(){de=0},setProgress(e){y.rare&&Ee.setStartle((e-(y.startleAt??.8))/(1-(y.startleAt??.8)))},setDown(e){y.down=e},setBand(e,t){k.uOwnS.value=e,k.uOwnAmp.value=t},armS(e){return c.sOfT(e)},update(e,t,r){if(k.uTime.value=t,k.uBandPos.value=t*ie%O,de>=0&&(de+=e/10,Ie=de,de>=1&&(de=-1)),ka(Ie),k.uBreath.value=(1.01+.01*Math.sin(t*.33))*(1-.06*Oe),r){let l=720;m.renderer?.getDrawingBufferSize&&(l=m.renderer.getDrawingBufferSize(Ra).y||l),k.uPxScale.value=r.projectionMatrix.elements[5]*l*.5}y.down?Ge.copy(y.down).normalize():($.updateWorldMatrix(!0,!1),$.getWorldQuaternion(fa).invert(),Ge.set(0,-1,0).applyQuaternion(fa)),k.uDown.value.copy(Ge),ha.setFromUnitVectors(Fe.set(0,-1,0),Ge),ra.setFromMatrix4(La.makeRotationFromQuaternion(ha))},dispose(){}};return $.userData.hero=Ee,Ee.update(0,0,null),Ee}export{tt as buildHero};
