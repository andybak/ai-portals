import*as d from"three";import{makePath as Et}from"../kit/core.js";import{buildHero as Nt,addHeron as Lt}from"../parts/knotted-river.js";const _=Math.PI*2,ye=Math.PI/180,$e=-750,rt={dawn:{pal:["#F6C9A8","#FBEEDC","#2E8C8A","#0F4C5C","#7FD6C8","#D9482B","#6B7FB8"],az:80,el:9,sunCol:"#ffe2b8",sunI:2.4,disc:9,discSize:1.25,zen:"#5f73b4",mid:"#f3dcc6",hor:"#f2bd97",haze:"#f4c7a4",lit:"#f6c9a2",shade:"#8f8fc4",bay:"#74779f",deckLit:"#f1bb95",deckShade:"#8a86b8",fog:"#eebf9f",fogD:31e-5,k:.74,stars:0,exposure:1,bloom:[.5,.7,.86],sat:1.08,tint:"#fff6ee",shadowTint:"#0a0a1c",glow:1,limb:.35,glowFar:2,caust:[.45,.6,.3],netK:.5,streak:1.4},day:{pal:["#DCE9EE","#FFFFFF","#149FA8","#07566E","#78ECE0","#D9482B","#3C78C8"],az:80,el:31,sunCol:"#fff3df",sunI:2.7,disc:10,discSize:1,zen:"#2f6ec4",mid:"#9fc8ea",hor:"#dbe9f0",haze:"#d6e6ef",lit:"#f4f4f0",shade:"#8ba2c6",bay:"#6f86ad",deckLit:"#f1f2ee",deckShade:"#8ea6c8",fog:"#cfe0ec",fogD:27e-5,k:.7,stars:0,exposure:.98,bloom:[.42,.6,.9],sat:1.1,tint:"#ffffff",shadowTint:"#04101c",glow:1,limb:.35,glowFar:1.8,caust:[.45,.5,.3],netK:.5,streak:1.4},golden:{pal:["#F2A27E","#FDE0B8","#1F6488","#211E5A","#6FD8DC","#D9482B","#7666B2"],az:-100,el:7,sunCol:"#ffbe84",sunI:2.6,disc:9,discSize:1.3,zen:"#6a5cac",mid:"#f0c4a4",hor:"#f29a72",haze:"#f2a680",lit:"#f7a67a",shade:"#8a6cae",bay:"#6d5c98",deckLit:"#f39a70",deckShade:"#8468ac",fog:"#ec9f7c",fogD:33e-5,k:.72,stars:0,exposure:1,bloom:[.5,.7,.87],sat:1.1,tint:"#fff2e6",shadowTint:"#120a22",glow:.85,limb:.7,glowFar:2.2,farCore:"#342e96",caust:[.45,.7,.3],netK:.5,streak:1.4,refl:[.42,.8],glitter:.75},night:{pal:["#4A5884","#A9BCE0","#2C8A78","#0B4048","#86EBC0","#58302E","#0E1A40"],az:-22,el:5.5,sunCol:"#cddcff",sunI:1.5,disc:5,discSize:2,zen:"#1b2554",mid:"#2a3564",hor:"#414c74",haze:"#38446a",lit:"#a4b4d8",shade:"#1e2748",bay:"#2c3660",deckLit:"#9aa9ce",deckShade:"#1f2950",fog:"#2c3a66",fogD:28e-5,k:.62,stars:1,exposure:1.22,bloom:[.5,.7,.86],sat:1.05,tint:"#eef2ff",shadowTint:"#02040e",glow:.62,limb:1,glowFar:2.6,limbPale:.6,netK:1,streak:1.9,glitW:1,body:.54,fill:.25,glitter:3,caust:[.2,1,.5],moonAmb:[.3,.38,.56],hazeAqua:.1,hazeD:36e-5,lamp:1,underLit:1,puffShade:"#2b376a",puffTop:.8,deckLow:.52,deckRoll:74,towShadow:700}},qt=(t,h)=>new d.Vector3(Math.sin(t*ye)*Math.cos(h*ye),Math.sin(h*ye),Math.cos(t*ye)*Math.cos(h*ye)),_t=`
varying vec3 vDir;
void main() {
  vDir = position;
  vec4 p = projectionMatrix * viewMatrix * vec4(position + cameraPosition, 1.0);
  if (abs(p.w) < 1e-4) p.w = 1e-4;          // a pole vertex exactly beside a level camera
  gl_Position = p.xyww;
}`,Vt=`
precision highp float;
uniform sampler2D uNoise;
uniform float uTime, uMist, uStars, uDeckY, uDisc, uDiscCos, uRain, uGap, uLowK; uniform vec2 uRoll;
uniform vec3 uZen, uMid, uHor, uHaze, uLit, uShade, uBay, uSunDir, uSunCol, uDeckLit, uDeckShade;
varying vec3 vDir;
uniform vec4 uTow[4];             // the four placed cumulus towers: x, z, half-width, shadow length
// the shadow a tower lays on the deck, down-sun of it, and the shade round its foot
float towShade(vec2 p, vec4 tw, vec2 s2) {
  vec2 v = p - tw.xy; float al = dot(v, -s2), ac = dot(v, vec2(-s2.y, s2.x));
  float wd = tw.z * (1.0 + 0.3 * clamp(al / max(tw.w, 1.0), 0.0, 1.0));
  return (1.0 - smoothstep(0.5, 1.2, abs(ac) / max(wd, 1.0))) * smoothstep(-1.1 * tw.z, 0.2 * tw.z, al) * (1.0 - smoothstep(0.3 * tw.w, tw.w, al));
}
// one tier of the rampart: rgb = colour, a = cover
vec4 tier(float a, float e, float i, float hmax, float sideK, float bayA, float gap) {
  float k = 2.0 + i, u = a * 0.15915494;
  float n1 = texture2D(uNoise, vec2(u * k + 0.37 * i, 0.13 + 0.21 * i)).b;
  float n2 = texture2D(uNoise, vec2(u * k * 2.5 + 0.11 * i, 0.5 + 0.17 * i + uTime * 0.0004)).b;
  float n3 = texture2D(uNoise, vec2(u * k * 7.0 + 0.5 * i, 0.3 + 0.4 * i - uTime * 0.0006)).b;
  float lobes = sqrt(abs(2.0 * n2 - 1.0)), small = sqrt(abs(2.0 * n3 - 1.0));
  // in the bay the back wall stands tall and the nearer tiers drop away, so it reads as a deep shadowed cove
  float top = hmax * (0.45 + 0.75 * n1) * (1.0 + bayA * (i < 0.5 ? 0.3 : -0.5)) + 0.075 * lobes + 0.022 * small - 0.07;
  top = mix(top, min(top, 0.012 + 0.03 * n1 + 0.02 * lobes * n1 - 0.008 * i), gap);     // by night the wall opens in a pass where the low moon stands
  vec4 nb = texture2D(uNoise, vec2(u * k * 2.2 + i * 0.3 + uTime * 0.0003, e * k * 0.35 + i * 0.4));
  float cov = 1.0 - smoothstep(top - 0.003, top + 0.003, e);
  float depth = clamp((top - e) / 0.2, 0.0, 1.0);
  float lit = 0.5 + (nb.b - 0.5) * 0.7 - (nb.r - 0.5) * 1.5 * sideK - (nb.g - 0.5) * 0.5;
  lit = lit * (1.0 - 0.55 * depth) + 0.55 * (1.0 - smoothstep(0.0, 0.055, top - e));
  vec3 c = mix(uShade, uLit, clamp(lit, 0.0, 1.0));
  c = mix(c, uHaze, 0.46 - 0.12 * i);                       // far tiers sit deeper in the haze
  return vec4(c, cov);
}
void main() {
  vec3 d = normalize(vDir);
  float h = d.y, lxz = max(length(d.xz), 1e-4);
  float a = atan(d.x, d.z + (abs(d.x) + abs(d.z) < 1e-5 ? 1e-5 : 0.0));
  float e = asin(clamp(h, -1.0, 1.0));
  float sunA = atan(uSunDir.x, uSunDir.z + 1e-5);
  float sideK = sin(sunA - a);
  float cs = clamp(dot(d, uSunDir), -1.0, 1.0);
  // clear sky
  vec3 col = mix(uHor, uMid, smoothstep(0.0, 0.2, h));
  col = mix(col, uZen, smoothstep(0.1, 0.72, h));
  float warm = 0.5 + 0.5 * dot(d.xz / lxz, uSunDir.xz / max(length(uSunDir.xz), 1e-4));
  col += uSunCol * 0.035 * warm * warm * (1.0 - smoothstep(0.0, 0.45, h));
  if (uStars > 0.01) {
    vec3 sp = d * 110.0, sc = floor(sp), sf = fract(sp) - 0.5;
    float hsh = fract(sin(dot(sc, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
    float tw = 0.7 + 0.3 * sin(uTime * (1.0 + hsh * 3.0) + hsh * 40.0);
    col += vec3(0.8, 0.88, 1.0) * step(0.972, hsh) * (1.0 - smoothstep(0.0, 0.34, length(sf))) * 1.6 * tw * uStars * smoothstep(0.02, 0.3, h);
  }
  float cs2 = max(cs, 0.0); float g8 = cs2 * cs2; g8 *= g8; g8 *= g8; float g64 = g8 * g8; g64 *= g64; g64 *= g64;
  col += uSunCol * (0.05 * g8 + 0.22 * g64 * g64) * (1.0 - 0.6 * uMist);
  col += uSunCol * uDisc * smoothstep(uDiscCos, uDiscCos + 0.00012, cs) * (1.0 - 0.85 * uMist);
  // the rampart: four tiers, tallest between azimuth -70 and +30, low heaps everywhere else
  float bump = 1.0 - smoothstep(0.5, 1.3, abs(a + 0.35));
  float hmax = mix(0.085, 0.4, bump);
  float cover = 0.0;
  float da = abs(a - sunA); da = min(da, 6.2831853 - da);
  float gap = uGap * (1.0 - smoothstep(0.16, 0.5, da));
  float bayA = 1.0 - smoothstep(0.27, 0.72, abs(a + 0.5236));
  vec4 t0 = tier(a, e, 0.0, hmax, sideK, bayA, gap); col = mix(col, t0.rgb, t0.a); cover = max(cover, t0.a);
  vec4 t1 = tier(a, e, 1.0, hmax * 0.78, sideK, bayA, gap); col = mix(col, t1.rgb, t1.a); cover = max(cover, t1.a);
  vec4 t2 = tier(a, e, 2.0, hmax * 0.56, sideK, bayA, gap); col = mix(col, t2.rgb, t2.a); cover = max(cover, t2.a);
  vec4 t3 = tier(a, e, 3.0, hmax * 0.36, sideK, bayA, gap); col = mix(col, t3.rgb, t3.a); cover = max(cover, t3.a);
  // the shadowed bay dead behind the portal (azimuth -30)
  float bayN = texture2D(uNoise, vec2(a * 0.8 + 0.2, e * 1.5 + 0.4)).b;
  float bayK = 1.0 - smoothstep(0.55, 0.98, length(vec2((a + 0.5236) / 0.7, (e - 0.05) / 0.5)) + (bayN - 0.5) * 0.4);     // a cove of shade with a ragged edge
  col = mix(col, uBay * (0.7 + 0.6 * dot(col, vec3(0.33))), bayK * cover * 0.9);
  col += uSunCol * 0.1 * g8 * cover;
  // the cloud sea
  {
    float t = (cameraPosition.y - uDeckY) / max(-h, 2e-3);
    vec2 q = cameraPosition.xz + d.xz * t + vec2(uTime * 6.0, 0.0);
    q = vec2(q.x * uRoll.x + q.y * uRoll.y, -q.x * uRoll.y + q.y * uRoll.x);          // the rolls lie across the light: a lit flank and a shadowed trough to every one
    // a deck of stratocumulus: rolls 300 m apart with round crests and creased troughs, bent by slow noise, swelling
    // and dying along their length, their flanks scalloped by billows. Nothing here repeats in under 900 m.
    vec2 qr = vec2(q.x * 0.8 - q.y * 0.6, q.x * 0.6 + q.y * 0.8);
    vec4 nA = texture2D(uNoise, q * 0.00021);
    vec4 nB = texture2D(uNoise, qr * vec2(0.00105, 0.00074) + 0.31);
    vec4 nC = texture2D(uNoise, q * vec2(0.00057, 0.00043) + nB.rg * 0.03 + 0.7);
    float dB = 2.0 * nB.b - 1.0, dC = 2.0 * nC.a - 1.0;
    float bB = sqrt(dB * dB + 0.05) - 0.12, bC = sqrt(dC * dC + 0.05) - 0.12;          // billows: round where they swell, and a rounded trough (never a crease) where two meet
    float r = (q.x + (nA.b - 0.5) * 460.0 + (nC.b - 0.5) * 120.0 + (bB - 0.4) * 80.0 + q.y * 0.22) / 300.0;      // the bend is kept under one roll's width per roll's width, so a roll bends and never closes on itself as a ring
    float keep = smoothstep(0.003, 0.02, 300.0 * (-h) / max(t, 1.0));      // rolls fade before they alias
    float fB = 1.0 - smoothstep(5000.0, 11000.0, t);
    float x = 2.0 * fract(r) - 1.0;
    float crest = 0.5 + 0.5 * cos(3.14159265 * x); crest = mix(crest, sqrt(max(crest, 1e-4)), 0.5);     // a broad soft crest, a soft rounded trough between rolls
    float amp = 0.3 + 0.7 * smoothstep(0.28, 0.62, nC.b);
    float H = mix(0.62, crest, keep) * mix(0.75, amp, keep) * (0.62 + 0.38 * mix(0.5, bB, fB)) + 0.26 * mix(0.5, bC, fB);
    // (the lean of a billow passes through zero where two billows meet, so their crease is a soft trough, never a drawn line)
    vec2 gB = clamp((nB.b - 0.5) * 7.0, -1.0, 1.0) * (nB.rg - 0.5);
    vec2 gC = clamp((nC.a - 0.5) * 7.0, -1.0, 1.0) * (nC.rg - 0.5);
    // which way the cloud top leans: down the roll's flank, and down the side of each billow
    vec2 lean = vec2(0.976, 0.215) * 1.5 * sin(3.14159265 * x) * amp * keep * 0.42          // (level on the crest and in the trough: no line where two rolls meet)
      - vec2(0.8 * gB.x + 0.6 * gB.y, -0.6 * gB.x + 0.8 * gB.y) * 1.9 * fB - gC * 0.9 * fB;
    vec2 s2 = uSunDir.xz / max(length(uSunDir.xz), 1e-4);
    vec2 s2r = vec2(s2.x * uRoll.x + s2.y * uRoll.y, -s2.x * uRoll.y + s2.y * uRoll.x);          // the light, in the rolls' own frame
    float low = (1.0 - 0.6 * clamp(uSunDir.y * 2.0, 0.0, 1.0)) * uLowK;
    float lit = 0.3 + 0.42 * smoothstep(0.1, 0.95, H) + dot(lean, s2r) * 0.6 * low;
    vec2 pw = cameraPosition.xz + d.xz * t + vec2(6.0 * min(uTime, 600.0), 0.0);          // the towers ride the same drift
    float shd = max(max(towShade(pw, uTow[0], s2), towShade(pw, uTow[1], s2)), max(towShade(pw, uTow[2], s2), towShade(pw, uTow[3], s2)));
    lit = clamp(lit * (1.0 - 0.45 * shd), 0.0, 1.0);
    vec3 dk = mix(uDeckShade, uDeckLit, lit);
    float wk = max(dot(d.xz / lxz, s2), 0.0); wk *= wk; wk *= wk; wk *= wk; wk *= wk; wk *= wk;
    dk += uSunCol * uDeckLit * (0.55 * wk * wk + 0.12 * wk) * smoothstep(0.3, 0.8, lit) * low * (1.0 - smoothstep(0.02, 0.5, -h));   // the light's road across the cloud tops
    dk = mix(dk, uDeckShade * 0.82, 0.62 * shd);
    dk = mix(dk, mix(uDeckShade, uBay, 0.6), bayK * 0.6 * (1.0 - smoothstep(0.03, 0.3, -h)));
    float fk = 1.0 - exp(-t * t / 1.5e8);
    dk = mix(dk, uHaze * (1.0 - 0.4 * bayA), fk);
    dk = mix(dk, uHaze * (0.93 + 0.1 * nB.b), uMist * 0.9);
    col = mix(dk, col, smoothstep(-0.012, 0.006, h));
  }
  col = mix(col, uHaze * (1.0 - 0.35 * bayA), 0.5 * exp(-abs(e) / 0.035) * (1.0 - 0.72 * bayA));                         // a band of glowing haze on the horizon
  vec3 pearl = mix(uHaze * 1.08, mix(uShade, uHaze, 0.45), smoothstep(-0.05, -0.75, h)) + uSunCol * 0.1 * g8;
  col = mix(col, pearl, uMist * (0.94 - 0.72 * smoothstep(0.04, 0.5, h)));
  col *= mix(vec3(1.0), vec3(0.74, 0.72, 0.84), uMist * bayA * (1.0 - smoothstep(0.1, 0.5, abs(e))));   // the bay still shows as a soft shadow in the pearl
  col = mix(col, vec3(dot(col, vec3(0.3, 0.5, 0.2))) * vec3(0.8, 0.86, 0.96), uRain * 0.7);
  gl_FragColor = vec4(col, 1.0);
}`,It=`
attribute vec4 aC; attribute vec4 aD; attribute float aE;
uniform float uTime; uniform vec3 uSunDir;
varying vec2 vUv; varying vec3 vSunV; varying float vSeed, vFog, vH, vSunward, vSoft, vTop;
void main() {
  float r = aC.w * (1.0 + 0.045 * sin(uTime * 0.23 + aD.z));
  vec3 c = aC.xyz + vec3(-6.0 * min(uTime, 600.0), aC.w * 0.035 * sin(uTime * 0.17 + aD.z * 1.7), 0.0);
  vec4 mv = viewMatrix * vec4(c, 1.0);
  mv.xy += position.xy * r;
  gl_Position = projectionMatrix * mv;
  vUv = position.xy; vSeed = aD.x; vH = aD.y; vSunward = aD.w; vSoft = aE;
  vSunV = mat3(viewMatrix) * uSunDir;
  float dist = length(mv.xyz);
  vFog = 1.0 - exp(-dist * dist / 3.2e7);
  vTop = clamp((cameraPosition.y - c.y) / max(dist, 1.0), 0.0, 1.0);          // how steeply the head is seen from above
}`,Ut=`
precision highp float;
uniform sampler2D uNoise; uniform float uTime, uMist, uTopLit;
uniform vec3 uLit, uShade, uHaze, uSunCol;
varying vec2 vUv; varying vec3 vSunV; varying float vSeed, vFog, vH, vSunward, vSoft, vTop;
void main() {
  float r2 = dot(vUv, vUv);
  if (r2 > 1.0) discard;
  vec2 sd = vec2(vSeed * 3.1, vSeed * 7.7);
  vec4 n1 = texture2D(uNoise, vUv * 0.2 + sd + uTime * 0.0011);
  vec4 n2 = texture2D(uNoise, vUv * 0.52 + sd.yx * 1.7 - uTime * 0.0018);
  // billows: round where they swell, creased where they meet. They push the lobe's edge in and out, so the outline
  // is ragged cauliflower and no two lobes are the same disc
  vec4 n3 = texture2D(uNoise, vUv * 1.25 + sd * 0.7);
  float b1 = abs(2.0 * n1.b - 1.0), b2 = abs(2.0 * n2.b - 1.0), b3 = abs(2.0 * n3.b - 1.0);
  float rad = min(0.55 + 0.27 * b1 + 0.14 * b2 + 0.07 * b3, 1.0);
  float body = rad * rad - r2;
  float alpha = smoothstep(0.0, mix(0.05, 0.3, vSoft), body);
  alpha *= 1.0 - smoothstep(-0.05, -0.6, vUv.y) * (1.0 - vH) * 0.85 * vSoft;   // base lobes melt into the deck
  vec2 gr = (n1.b < 0.5 ? -1.0 : 1.0) * (n1.rg - 0.5) * 2.0 + (n2.b < 0.5 ? -1.0 : 1.0) * (n2.rg - 0.5) * 1.3 + (n3.b < 0.5 ? -1.0 : 1.0) * (n3.rg - 0.5) * 0.6;
  // the lobe is only gently domed: the relief comes from the billows and from where the lobe sits in its tower,
  // so a tower reads as one heaped mass with a sun side and a lee side, not as a pile of balls
  vec3 n = normalize(vec3(vUv * 0.6 / rad - gr, sqrt(max(1.0 - r2 / (rad * rad), 0.0)) * 0.7 + 0.5));
  float lit = 0.36 + 0.46 * dot(n, vSunV) + 0.1 * n.y + 0.56 * vSunward;
  lit += 0.22 * (b1 - 0.45) + 0.12 * (b2 - 0.4);                              // creases hold shadow
  lit += uTopLit * (0.2 + 0.8 * smoothstep(-0.35, 0.85, n.y)) * (0.55 + 0.9 * b1);   // light from the sky overhead rounds every billow when the moon is low behind the heads
  lit += vTop * (0.16 + 0.34 * n.z) * (0.6 + 0.6 * b1);                       // seen from above, what faces the lens is a cloud top under the open sky: lit, its creases shaded
  lit *= 0.45 + 0.55 * smoothstep(0.0, 0.45, vH + 0.2 * vUv.y + 0.5 * vTop);   // a broad darker base (seen from the side)
  lit = smoothstep(0.06, 0.94, lit);
  // a lining of light on the sunward lobes when the sun is beyond the tower (never a ring round every lobe)
  float rim = (1.0 - smoothstep(0.0, 0.28, body)) * max(-vSunV.z, 0.0) * smoothstep(0.3, 0.9, vSunward) * (1.0 - vSoft);
  vec3 col = mix(uShade * 0.8, uLit, lit) + uSunCol * 0.05 * lit * lit + uLit * uSunCol * 0.4 * rim;
  col = mix(col, uHaze, clamp(vFog, 0.0, 1.0));
  gl_FragColor = vec4(col, alpha * (1.0 - 0.15 * vFog) * (1.0 - 0.45 * uMist));
}`,Ht=t=>`
attribute vec3 color; attribute vec2 aW;
#ifndef FREE
attribute vec4 aA; attribute vec4 aB;
#endif
uniform float uClock, uTime, uFlapRate, uFlapAmp;
varying vec3 vN, vCol, vWPos; varying float vWing;
${t}
#include <fog_pars_vertex>
void main() {
#ifdef FREE
  float ph = float(gl_InstanceID) * 1.7 + 0.3, scl = 1.0;
#else
  float ph = aB.z, scl = aA.w;
#endif
  vec3 p = position * scl, n = normal;
  float beat = sin(uTime * (6.5 + fract(ph * 3.3) * 2.0) * uFlapRate + ph * 9.0 - aW.x * 0.9);
  float glide = smoothstep(0.5, 0.9, sin(uTime * 0.37 + ph * 5.0)) * step(0.9, uFlapRate);
  float ang = (uFlapAmp * beat * (1.0 - 0.85 * glide) + 0.14) * aW.x;
  float ca = cos(ang), sa = sin(ang), sg = position.x < 0.0 ? -1.0 : 1.0, ax = abs(p.x);
  p = vec3(sg * ax * ca, p.y + ax * sa, p.z);
  n = vec3(n.x * ca - sg * n.y * sa, n.y * ca + sg * n.x * sa, n.z);
  float bank = 0.3 * sin(uTime * 0.53 + ph * 2.0) * step(0.9, uFlapRate), cb = cos(bank), sb = sin(bank);
  p.xy = vec2(p.x * cb - p.y * sb, p.x * sb + p.y * cb); n.xy = vec2(n.x * cb - n.y * sb, n.x * sb + n.y * cb);
#ifdef FREE
  vec4 wp = modelMatrix * instanceMatrix * vec4(p, 1.0);
  vec3 wn = mat3(modelMatrix) * mat3(instanceMatrix) * n;
#else
  float keyed = abs(aB.x) > 1e-5 ? 1.0 : 0.0;                 // birds staged on the journey clock keep their place at a given u
  float th = aA.y + aB.x * uClock + aB.y * uTime;
  float s = aA.x + aB.w * mix(uTime, uClock, keyed) + (2.5 - 2.0 * keyed) * sin(uTime * 0.23 + ph * 4.0);
  float vt = (aB.x + aB.y) * (uTubeR + aA.z);
  float yaw = atan(vt, aB.w + (abs(vt) + abs(aB.w) < 1e-4 ? 1.0 : 0.0));
  float hh = aA.z + (1.3 - 0.9 * keyed) * sin(uTime * 0.7 + ph * 3.0);
  vec3 C, T, R, Fw, S; radialBasis(s, th, yaw, C, T, R, Fw, S);
  vec4 wp = modelMatrix * vec4(C + R * (uTubeR + hh + p.y) + S * p.x + Fw * p.z, 1.0);
  vec3 wn = mat3(modelMatrix) * (S * n.x + R * n.y + Fw * n.z);
#endif
  vN = wn; vCol = color; vWPos = wp.xyz; vWing = aW.x;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Gt=t=>`
precision highp float;
uniform vec3 uBirdTint; uniform float uBirdFloor;
varying vec3 vN, vCol, vWPos; varying float vWing;
${t}
#include <fog_pars_fragment>
void main() {
  vec3 V = normalize(cameraPosition - vWPos + vec3(0.0, 1e-5, 0.0));
  vec3 n = normalize(vN + vec3(0.0, 1e-5, 0.0));
  vec3 nf = dot(n, V) < 0.0 ? -n : n;
  float ndl = max(dot(nf, uSunDir), 0.0), back = max(dot(-nf, uSunDir), 0.0) * step(0.02, vWing);
  vec3 col = vCol * uBirdTint * (skyAmbient(nf) * 0.95 + uSunCol * (ndl * 0.42 + back * 0.3) + uBirdFloor * vec3(0.78, 0.84, 1.0));   // (by night a white bird keeps a floor of sky-glow: never a dark cut-out)
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,Wt=t=>`
attribute vec3 color; attribute vec4 aA; attribute vec4 aB;
uniform float uTime;
varying vec3 vN, vCol, vWPos, vUp;
${t}
#include <fog_pars_vertex>
void main() {
  float cyc = uTime / aB.x + aB.y, k = floor(cyc), p = fract(cyc), air = 0.3;
  float hsh = fract(sin(k * 12.9898 + aB.y * 78.233) * 43758.5453);
  float q = clamp(p / air, 0.0, 1.0);
  float s = aA.x + (hsh - 0.5) * 26.0, th = aA.y + (fract(hsh * 7.3) - 0.5) * 0.2;
  vec3 C, T, R, Fw, S; radialBasis(s, th, aA.z, C, T, R, Fw, S);
  float h = aB.w * 4.0 * q * (1.0 - q) - 0.5;
  float slope = aB.w * 4.0 * (1.0 - 2.0 * q) / max(aB.z, 0.1);
  float il = inversesqrt(1.0 + slope * slope), cp = il, sp = slope * il;
  vec3 m = position * aA.w * (p < air ? 1.0 : 0.0);
  m.x += 0.1 * aA.w * sin(uTime * 19.0 + position.z * 5.0 + aB.y * 30.0) * (0.5 - position.z);
  vec3 pr = vec3(m.x, m.y * cp + m.z * sp, m.z * cp - m.y * sp);
  vec3 nr = vec3(normal.x, normal.y * cp + normal.z * sp, normal.z * cp - normal.y * sp);
  vec4 wp = modelMatrix * vec4(C + R * (uTubeR + h + pr.y) + Fw * (aB.z * (q - 0.5) + pr.z) + S * pr.x, 1.0);
  vN = mat3(modelMatrix) * (S * nr.x + R * nr.y + Fw * nr.z); vCol = color; vWPos = wp.xyz; vUp = mat3(modelMatrix) * R;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ot=t=>`
precision highp float;
varying vec3 vN, vCol, vWPos, vUp;
${t}
#include <fog_pars_fragment>
void main() {
  vec3 V = normalize(cameraPosition - vWPos + vec3(0.0, 1e-5, 0.0));
  vec3 n = normalize(vN + vec3(0.0, 1e-5, 0.0));
  if (dot(n, V) < 0.0) n = -n;
  float ndl = max(dot(n, uSunDir), 0.0);
  vec3 hv = normalize(V + uSunDir + vec3(0.0, 1e-5, 0.0));
  float sp = max(dot(n, hv), 0.0); float s8 = sp * sp; s8 *= s8; s8 *= s8; float s32 = s8 * s8; s32 *= s32;
  vec3 col = vCol * (skyAmbient(n) * 0.9 + uSunCol * ndl * 0.5) + uSunCol * (s32 * 1.6 + s8 * 0.12) + skyCol(reflect(-V, n)) * 0.18;
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,Kt=`
attribute vec3 aP0; attribute vec3 aP1; attribute vec4 aS;     // aS = (size m, kind 0 bead / 1 smoke, phase, rate)
uniform float uTime, uPixAng; uniform vec3 uSunDir;
varying vec2 vUv; varying vec4 vS; varying float vLife, vDim, vSunK, vP;
#include <fog_pars_vertex>
void main() {
  float p = fract(aS.z + uTime * aS.w);
  vec3 d = aP1 - aP0;
  vec3 pos = mix(aP0, aP1, p);
  float wob = aS.y > 0.5 ? 0.6 + 2.2 * p : 0.5;
  pos += vec3(sin(uTime * 0.37 + aS.z * 40.0), sin(uTime * 0.29 + aS.z * 23.0), cos(uTime * 0.23 + aS.z * 31.0)) * wob;
  vec4 wc = modelMatrix * vec4(pos, 1.0);
  float dist = distance(cameraPosition, wc.xyz);
  float size = aS.x * (aS.y > 0.5 ? 0.45 + 1.6 * p : 1.0), minS = dist * uPixAng * 1.3;
  vDim = aS.y > 0.5 ? smoothstep(4.0, 12.0, dist) : min(1.0, (size * size) / max(minS * minS, 1e-6)) * smoothstep(1.5, 5.0, dist);
  size = max(size, aS.y > 0.5 ? size : minS);
  vec4 mvPosition = viewMatrix * wc;
  mvPosition.xy += position.xy * size;
  gl_Position = projectionMatrix * mvPosition;
  vUv = position.xy; vS = aS; vP = p;
  vLife = smoothstep(0.0, 0.12, p) * (1.0 - smoothstep(aS.y > 0.5 ? 0.45 : 0.86, 1.0, p));
  vSunK = max(dot(normalize(wc.xyz - cameraPosition + vec3(0.0, 1e-4, 0.0)), uSunDir), 0.0);
  #include <fog_vertex>
}`,jt=`
precision highp float;
uniform sampler2D uNoise; uniform float uTime;
uniform vec3 uSunCol, uPeach, uCream, uLilac, uAqua;
varying vec2 vUv; varying vec4 vS; varying float vLife, vDim, vSunK, vP;
#include <fog_pars_fragment>
void main() {
  float r2 = dot(vUv, vUv);
  vec2 q = vUv * 0.5 + 0.5;
  float n1 = texture2D(uNoise, q * 0.5 + vec2(vS.z * 5.0, vS.z - uTime * 0.02)).b;
  if (r2 > 1.0) discard;
  vec3 col; float alpha;
  if (vS.y < 0.5) {
    float core = exp(-r2 * 5.5), spark = exp(-r2 * 40.0);
    float tw = 0.7 + 0.3 * sin(uTime * 1.3 + vS.z * 60.0);
    col = (mix(uAqua, uCream, 0.3 + 0.4 * fract(vS.z * 9.7)) * core * 0.9 + uCream * uSunCol * spark * (0.7 + 2.0 * vSunK)) * tw * vLife * vDim;
    alpha = 0.0;
  } else {
    float soft = (1.0 - r2); soft *= soft;
    alpha = soft * smoothstep(0.25, 0.75, n1) * 0.42 * vLife * vDim;
    col = mix(uLilac * 0.7, mix(uPeach, uCream, 0.6), 0.45 + 0.4 * n1 + 0.3 * vSunK) * 0.85 * alpha;
  }
  float keep = 1.0;
#ifdef USE_FOG
  #ifdef FOG_EXP2
  keep = exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  #else
  keep = 1.0 - smoothstep(fogNear, fogFar, vFogDepth);
  #endif
#endif
  gl_FragColor = vec4(col * keep, alpha * keep);
}`,Yt=t=>`
attribute vec4 aA;
uniform float uTime, uPixAng, uCamS, uWin, uHmax;
varying float vA; varying vec2 vUv;
${t}
void main() {
  float so = fract(aA.x - uCamS / uWin + 0.5) - 0.5;
  float fall = fract(aA.z + uTime * aA.w / uHmax);
  float h = uHmax * (1.0 - fall) * (1.0 - fall * 0.2);
  vec3 C, T, R, Fw, S; radialBasis(uCamS + so * uWin, aA.y, 0.0, C, T, R, Fw, S);
  float len = 3.0 + aA.w * 0.14;
  vec4 wc = modelMatrix * vec4(C + R * (uTubeR + h + position.y * len) + T * position.y * 0.5, 1.0);
  vec3 toC = wc.xyz - cameraPosition; float dist = length(toC);
  vec3 side = normalize(cross(mat3(modelMatrix) * R, toC) + vec3(1e-5, 0.0, 0.0));
  float hw = max(0.014, dist * uPixAng * 0.7);
  wc.xyz += side * position.x * hw;
  vA = min(1.0, 0.014 / hw * 2.5) * smoothstep(0.0, 0.06, fall) * (1.0 - smoothstep(0.92, 1.0, fall)) * smoothstep(1.0, 4.0, dist) * (1.0 - smoothstep(0.4, 0.5, abs(so)));
  vUv = position.xy;
  gl_Position = projectionMatrix * viewMatrix * wc;
}`,Xt=`
precision highp float;
uniform vec3 uRainCol;
varying float vA; varying vec2 vUv;
void main() {
  float a = vA * (1.0 - abs(vUv.x)) * smoothstep(0.0, 0.3, vUv.y) * (1.0 - smoothstep(0.6, 1.0, vUv.y));
  gl_FragColor = vec4(uRainCol * a * 0.55, a * 0.55);
}`;function it(t,h){const O=[],m=[],H=[],L=[],R=new d.Color,Q=g=>(R.set(g),[R.r,R.g,R.b]),T=Q(t?"#4a4452":"#e9e9e4"),F=Q(t?"#3a3542":"#c3cad2"),n=Q("#101216"),k=Q(t?"#2a2630":"#5a606a"),V=Q(t?"#222":"#d2502a"),S=(g,s,a,l,v=l,p=l,i=0,o=0,f=0)=>{const x=s[0]-g[0],y=s[1]-g[1],U=s[2]-g[2],c=a[0]-g[0],E=a[1]-g[1],$=a[2]-g[2];let C=y*$-U*E,ae=U*c-x*$,N=x*E-y*c;const Se=Math.hypot(C,ae,N)||1;C/=Se,ae/=Se,N/=Se;for(const[pe,me,Te]of[[g,l,i],[s,v,o],[a,p,f]])O.push(...pe),m.push(C,ae,N),H.push(...me),L.push(Te,0)};if(h){const g=[[.085,.05],[-.04,.052]].map(([p,i])=>[[0,i*1.05,p],[i*.9,-i*.1,p],[0,-i*.95,p],[-i*.9,-i*.1,p]]),s=[0,.004,.215],a=[0,.012,-.2];for(let p=0;p<4;p++){const i=(p+1)%4,o=p===0||p===3;S(s,g[0][p],g[0][i],o?n:T),S(g[0][p],g[1][p],g[1][i],o?F:T),S(g[0][p],g[1][i],g[0][i],o?F:T),S(g[1][p],a,g[1][i],o?F:T)}S([.014,.004,.2],[-.014,.004,.2],[0,-.006,.305],V);for(const p of[1,-1])S([0,.01,-.14],[p*.032,.01,-.19],[p*.09,.012,-.43],T,T,F);const l=t?.8:1,v=t?F:T;for(const p of[1,-1]){const i=[p*.035,.022,.11],o=[p*.035,.02,-.075*l],f=[p*.38,.03,.06],x=[p*.36,.027,-.075*l],y=[p*.53,.016,-.18];S(i,f,x,F,F,k,.06,.76,.76),S(i,x,o,F,k,v,.06,.76,.06),S(f,y,x,k,k,k,.76,1,.76)}}else{const g=(i,o,f)=>[[0,o*1.05+f,i],[o*.9,o*.35+f,i],[o*.75,-o*.6+f,i],[0,-o*.95+f,i],[-o*.75,-o*.6+f,i],[-o*.9,o*.35+f,i]],s=[[.165,.03,.006],[.085,.05,0],[-.04,.052,0],[-.15,.026,.004]].map(([i,o,f])=>g(i,o,f)),a=[0,.004,.215],l=[0,.012,-.2];for(let i=0;i<6;i++){const o=(i+1)%6,f=i===0||i===5,x=i===2||i===3;S(a,s[0][i],s[0][o],f?n:T);for(let y=0;y<3;y++){const U=f?y===0?n:F:x||y===0?T:t?F:T;S(s[y][i],s[y+1][i],s[y+1][o],U),S(s[y][i],s[y+1][o],s[y][o],U)}S(s[3][i],l,s[3][o],f?F:T)}S([.014,.004,.2],[-.014,.004,.2],[0,-.006,.305],V),S([0,.018,.2],[0,-.012,.2],[0,-.005,.305],V);for(const i of[1,-1])S([0,.01,-.14],[i*.032,.01,-.19],[i*.09,.012,-.43],T,T,F);S([0,.01,-.14],[.032,.01,-.19],[-.032,.01,-.19],T);const v=t?.8:1,p=t?F:T;for(const i of[1,-1]){const o=[i*.035,.022,.11],f=[i*.035,.02,-.075*v],x=[i*.23,.04,.155],y=[i*.22,.034,-.03*v],U=[i*.38,.03,.06],c=[i*.36,.027,-.075*v],E=[i*.53,.016,-.18];S(o,x,y,F,F,p,.06,.46,.46),S(o,y,f,F,p,p,.06,.46,.06),S(x,U,c,F,F,k,.46,.76,.76),S(x,c,y,F,k,p,.46,.76,.46),S(U,E,c,k,k,k,.76,1,.76)}}const w=new d.BufferGeometry;return w.setAttribute("position",new d.Float32BufferAttribute(O,3)),w.setAttribute("normal",new d.Float32BufferAttribute(m,3)),w.setAttribute("color",new d.Float32BufferAttribute(H,3)),w.setAttribute("aW",new d.Float32BufferAttribute(L,2)),w}function $t(t){const h=[],O=[],m=[],H=[],L=new d.Color,R=l=>(L.set(l),[L.r,L.g,L.b]),Q=R(t?"#eeeee8":"#aab2b8"),T=R(t?"#f6f6f0":"#d9dcdc"),F=R(t?"#e6e6e0":"#8e99a4"),n=R(t?"#d2d2cc":"#3f4955"),k=R("#dcae3a"),V=R(t?"#2c2c2a":"#6f6245"),S=R(t?"#eeeee8":"#23272d"),w=(l,v,p,i,o=i,f=i,x=0,y=0,U=0)=>{const c=v[0]-l[0],E=v[1]-l[1],$=v[2]-l[2],C=p[0]-l[0],ae=p[1]-l[1],N=p[2]-l[2];let Se=E*N-$*ae,pe=$*C-c*N,me=c*ae-E*C;const Te=Math.hypot(Se,pe,me)||1;Se/=Te,pe/=Te,me/=Te;for(const[Oe,Me,Pe]of[[l,i,x],[v,o,y],[p,f,U]])h.push(...Oe),O.push(Se,pe,me),m.push(...Me),H.push(Pe,0)},g=[[.78,0,.03,.03],[.66,.02,.05,.055],[.52,.07,.05,.05],[.4,.06,.08,.09],[.2,0,.12,.13],[-.15,-.01,.11,.11],[-.42,.01,.03,.03]],s=l=>[[0,l[1]+l[3],l[0]],[l[2],l[1],l[0]],[0,l[1]-l[3],l[0]],[-l[2],l[1],l[0]]];for(let l=0;l<g.length-1;l++){const v=s(g[l]),p=s(g[l+1]);for(let i=0;i<4;i++){const o=(i+1)%4,f=i===0||i===3,x=l<1?f?S:Q:f?Q:T;w(v[i],p[i],p[o],x),w(v[i],p[o],v[o],x)}}w([.014,.01,.78],[-.014,.01,.78],[0,-.01,1.04],k),w([0,.03,.78],[0,-.012,.78],[0,-.01,1.04],k);for(const l of[1,-1]){w([l*.03,-.03,-.38],[l*.05,-.05,-.4],[l*.035,-.06,-1.12],V);const v=[l*.09,.05,.32],p=[l*.09,.04,-.2],i=[l*.5,.07,.36],o=[l*.5,.05,-.17],f=[l*.86,.06,.28],x=[l*.84,.05,-.16],y=[l*1.05,.05,.12],U=[l*1,.05,-.12];w(v,i,o,F,F,n,.08,.47,.47),w(v,o,p,F,n,F,.08,.47,.08),w(i,f,x,F,F,n,.47,.82,.82),w(i,x,o,F,n,n,.47,.82,.47),w(f,y,U,n,n,n,.82,1,1),w(f,U,x,n,n,n,.82,1,.82)}const a=new d.BufferGeometry;return a.setAttribute("position",new d.Float32BufferAttribute(h,3)),a.setAttribute("normal",new d.Float32BufferAttribute(O,3)),a.setAttribute("color",new d.Float32BufferAttribute(m,3)),a.setAttribute("aW",new d.Float32BufferAttribute(H,2)),a}function lt(){const t=[],h=[],O=[],m=new d.Color,H=w=>(m.set(w),[m.r,m.g,m.b]),L=H("#4c5f70"),R=H("#c4ccd0"),Q=H("#e6e6e0"),T=H("#6f7f8c"),F=(w,g,s,a,l,v)=>{const p=g[0]-w[0],i=g[1]-w[1],o=g[2]-w[2],f=s[0]-w[0],x=s[1]-w[1],y=s[2]-w[2];let U=i*y-o*x,c=o*f-p*y,E=p*x-i*f;const $=Math.hypot(U,c,E)||1;for(const[C,ae]of[[w,a],[g,l],[s,v]])t.push(...C),h.push(U/$,c/$,E/$),O.push(...ae)},n=[[.24,.05,.085],[-.1,.055,.1],[-.36,.02,.04]].map(([w,g,s])=>[[0,s,w],[g,0,w],[0,-s,w],[-g,0,w]]),k=[L,R,Q,R],V=[0,0,.5];for(let w=0;w<4;w++){const g=(w+1)%4;F(V,n[0][w],n[0][g],R,k[w],k[g]);for(let s=0;s<2;s++)F(n[s][w],n[s+1][w],n[s+1][g],k[w],k[w],k[g]),F(n[s][w],n[s+1][g],n[s][g],k[w],k[g],k[g])}F([0,0,-.34],[0,.15,-.52],[0,-.15,-.52],R,T,T),F([0,.09,.02],[0,.17,-.12],[0,.085,-.2],L,T,L);const S=new d.BufferGeometry;return S.setAttribute("position",new d.Float32BufferAttribute(t,3)),S.setAttribute("normal",new d.Float32BufferAttribute(h,3)),S.setAttribute("color",new d.Float32BufferAttribute(O,3)),S}function Zt(t,h,O,m,H,L,R,Q){const T=Math.cos(H),F=Math.sin(H),n=(o,f,x)=>[O+o*T+x*F,f,m-o*F+x*T],k=(o,f,x,y,U,c,E)=>{const $=C=>n(C&1?f:o,C&2?y:x,C&4?c:U);for(const C of[[0,1,3,2],[4,5,7,6],[0,1,5,4],[2,3,7,6],[0,2,6,4],[1,3,7,5]])t.quad($(C[0]),$(C[1]),$(C[2]),$(C[3]),E)},V=["#b8a068","#aa945c","#c4ae74","#a08a56"],S=["#d0b468","#c0a45a","#dcc278","#b4984e"],w="#6a5238",g="#2a2119",s=1.7,a=3.45,l=5.3;if(!L){k(-1.7,1.7,.3,s,-1.3,1.3,t.rgb("#3a3026",.1)),k(-1.7,1.7,s,a,-1.4,1.4,t.rgb(h.pick(V),.08));for(const o of[1,-1])t.quad(n(-2.1,a-.2,o*2),n(2.1,a-.2,o*2),n(2.1,l,0),n(-2.1,l,0),t.rgb(h.pick(S),.08));for(const o of[1,-1])t.tri(n(o*1.7,a,-1.4),n(o*1.7,a,1.4),n(o*1.7,l-.1,0),t.rgb(V[1],.08));t.quad(n(2.5,2.5,-.7),n(2.5,2.5,.9),n(2.5,1.3,.9),n(2.5,1.3,-.7),t.rgb(R,.05).map(o=>o*.9),[2,0,0,0],[2,1,0,0],[2,1,1,1],[2,0,1,1]);return}for(const o of[-1.5,0,1.5])for(const f of[-1.2,2])t.spar(n(o+h.range(-.08,.08),.1,f),n(o,s,f),.08,.07,4,t.rgb(w,.15));k(-1.9,1.9,s-.1,s+.04,-1.5,2.3,t.rgb("#8a7355",.1));for(let o=0;o<6;o++){const f=-1.9+o*.633;t.quad(n(f+.03,s+.05,1.4),n(f+.6,s+.05,1.4),n(f+.6,s+.05,2.3),n(f+.03,s+.05,2.3),t.rgb("#97805e",.14))}for(const o of[1,-1])for(let f=0;f<6;f++){const x=-1.7+f*.5667,y=x+.5667,U=o>0&&(f===2||f===3);t.quad(n(x,U?3:s,o*1.4),n(y,U?3:s,o*1.4),n(y,a,o*1.4),n(x,a,o*1.4),t.rgb(h.pick(V),.07)),U&&t.quad(n(x,s,1.36),n(y,s,1.36),n(y,3,1.36),n(x,3,1.36),t.rgb(g,.1))}for(const o of[1,-1]){for(let f=0;f<4;f++){const x=-1.4+f*.7;t.quad(n(o*1.7,s,x),n(o*1.7,s,x+.7),n(o*1.7,a,x+.7),n(o*1.7,a,x),t.rgb(h.pick(V),.07))}t.tri(n(o*1.7,a,-1.4),n(o*1.7,a,1.4),n(o*1.7,l-.15,0),t.rgb(V[3],.08)),t.quad(n(o*1.72,2.5,-.35),n(o*1.72,2.5,.35),n(o*1.72,3.05,.35),n(o*1.72,3.05,-.35),t.rgb(g,.1))}for(const o of[1,-1])for(let f=0;f<5;f++){const x=-2.15+f*.86,y=x+.86,U=h.range(-.08,.08),c=h.range(-.08,.08);t.quad(n(x,a-.32+U,o*2.05),n(y,a-.32+c,o*2.05),n(y,4.3,o*1.02),n(x,4.3,o*1.02),t.rgb(h.pick(S),.07).map(E=>E*.86)),t.quad(n(x,4.22+c,o*1.16),n(y,4.22+U,o*1.16),n(y,l,0),n(x,l,0),t.rgb(h.pick(S),.07))}t.spar(n(-2.3,l+.03,0),n(2.3,l+.03,0),.1,.1,4,t.rgb("#7a6234",.1),!0);for(const o of[.62,1.12])t.spar(n(o,.1,3.25),n(o,s+.5,2.25),.04,.04,3,t.rgb(w,.1));for(let o=1;o<=4;o++){const f=o/5;t.spar(n(.62,.1+f*1.6,3.25-f*.95),n(1.12,.1+f*1.6,3.25-f*.95),.03,.03,3,t.rgb(w,.1))}const v=2.75,p=2.7;t.spar(n(v,.15,-1),n(v,p+.15,-1),.05,.04,3,t.rgb(w,.1)),t.spar(n(v,.15,1.7),n(v,p+.15,1.7),.05,.04,3,t.rgb(w,.1)),t.ribbon(n(v,p,-1),n(v,p,1.7),.02,t.rgb("#3b3028"));const i=[[-.85,.75,1.5,R],[0,.7,1.15,Q],[.85,.8,1.7,R]];for(const[o,f,x,y]of i){const U=t.rgb(y,.06).map($=>$*.88),c=.35+o-f/2,E=c+f;t.quad(n(v,p,c),n(v,p,E),n(v,p-x,E),n(v,p-x,c),U,[2,0,0,0],[2,1,0,0],[2,1,1,1],[2,0,1,1])}for(let o=0;o<6;o++){const f=h.range(-1.7,1.7),x=h.range(-1.3,2.1),y=h.range(.5,1.1),U=t.rgb(h.pick(["#3f5e36","#4a6a3a","#5a5a34"]),.1);t.tri(n(f-.1,s-.1,x),n(f+.1,s-.1,x),n(f,s-.1-y,x),U,[4,0,0,0],[4,0,0,0],[4,0,0,.25])}}function ct(t,h,O,m,H,L=.02){const R=Math.cos(H),Q=Math.sin(H),T=(n,k,V)=>[O+n*R+V*Q,L+k,m-n*Q+V*R],F=[-2.2,-1.3,-.3,.7,1.6,2.2].map(n=>{const k=n/2.25,V=.62*Math.pow(Math.max(0,1-k*k),.6)+.02;return{z:n,w:V,sh:.4+.24*k*k,ke:-.08+.36*k*k*k*k}});for(let n=0;n<F.length-1;n++)for(const k of[1,-1]){const V=F[n],S=F[n+1];t.quad(T(0,V.ke,V.z),T(0,S.ke,S.z),T(k*S.w*.85,(S.ke+S.sh)/2,S.z),T(k*V.w*.85,(V.ke+V.sh)/2,V.z),t.rgb("#3a2c25",.15)),t.quad(T(k*V.w*.85,(V.ke+V.sh)/2,V.z),T(k*S.w*.85,(S.ke+S.sh)/2,S.z),T(k*S.w,S.sh,S.z),T(k*V.w,V.sh,V.z),t.rgb("#b9ad98",.06))}for(const n of[-.9,.6])t.quad(T(-.55,.3,n-.12),T(.55,.3,n-.12),T(.55,.3,n+.12),T(-.55,.3,n+.12),t.rgb("#8a6a4a",.1))}function _0(t,h,O){const m=s=>[4,0,0,s],L=[];for(let s=0;s<20;s++)L.push(11+4.5*h());const R=[0,.3,.55,.75,.9,1],Q=R.map(()=>L.map(()=>h())),T=(s,a)=>{const l=s%20/20*_,v=R[a],p=L[s%20]*v;return[Math.cos(l)*p,a===5?-.15:.5*(1-v*v)+.1+.22*Q[a][s%20],Math.sin(l)*p]},F=["#7c7648","#867e4c","#74764a","#807850"],n=["#506248","#58684a"],k=s=>t.norm([s[0]*.05,1,s[2]*.05]);for(let s=0;s<20;s++)for(let a=0;a<5;a++){const l=t.rgb(h.pick(a>=3?n:F),.06),v=T(s,a),p=T(s,a+1),i=T(s+1,a+1),o=T(s+1,a);if(a===0){const f=[0,.75,0];t.tri(f,p,i,l,void 0,void 0,void 0,[k(f),k(p),k(i)]);continue}t.tri(v,p,i,l,void 0,void 0,void 0,[k(v),k(p),k(i)]),t.tri(v,i,o,l,void 0,void 0,void 0,[k(v),k(i),k(o)])}const V=[],S=h()*_;for(let s=0;s<4;s++){const a=S+s*_/4+h.range(-.12,.12),l=6.6,v=Math.cos(a)*l,p=Math.sin(a)*l;if(V.push([v,p]),Zt(t,h,v,p,Math.atan2(-Math.cos(a),-Math.sin(a)),O.full,O.cloth,O.cream),O.full){const i=-Math.cos(a),o=-Math.sin(a),f=-o,x=i,y=.45,U=1.66,c=t.rgb("#93805e",.1),E=($,C)=>[v+i*$+f*y*C,U,p+o*$+x*y*C];t.quad(E(2.3,-1),E(2.3,1),E(5.2,1),E(5.2,-1),c),t.spar([v+i*3.7,.1,p+o*3.7],[v+i*3.7,U,p+o*3.7],.06,.06,3,t.rgb("#6a5238",.1))}}if(O.full){t.spar([0,1.56,0],[0,1.68,0],2.1,2.1,8,t.rgb("#8a7355",.08),!0);for(let a=0;a<4;a++){const l=S+.785+a*_/4;t.spar([Math.cos(l)*1.6,.1,Math.sin(l)*1.6],[Math.cos(l)*1.6,1.56,Math.sin(l)*1.6],.08,.07,4,t.rgb("#6a5238",.1))}t.spar([.5,1.68,-.4],[.5,2.15,-.4],.26,.36,7,t.rgb("#b08a4e",.1)),t.spar([-.6,1.68,.5],[-.6,1.95,.5],.6,.4,8,t.rgb("#47686a",.1),!0);const s=S+.6;ct(t,h,Math.cos(s)*14.2,Math.sin(s)*14.2,s+.4),t.ribbon([Math.cos(s)*14.2,.4,Math.sin(s)*14.2],[Math.cos(s)*10.5,.5,Math.sin(s)*10.5],.02,t.rgb("#3b3028"))}for(let s=0;s<(O.full?18:6);s++){const a=h()*_,l=L[Math.floor(a/_*20)%20]+h.range(.4,3.4),v=Math.cos(a)*l,p=Math.sin(a)*l,i=h.range(.42,.66);t.spar([v,.02,p],[v,.06,p],i,i*.96,7,t.rgb(h.pick(["#3a6236","#46703c","#34583a"]),.08),!0,m(.02)),h.chance(.5)&&t.spar([v+.1,.06,p],[v+.1,.3,p],.05,.17,5,t.rgb("#a9a99c",.05),!1,m(.02),m(.04))}const w=[[-10.6,-4.2,-1.9,1.05,1],[-9.2,-1.4,-1.2,.95,.3],[-11.2,1.3,-2.2,1,.8],[-9.6,3.6,-1.5,.9,.1]].slice(0,O.herons||0);for(const s of w)Lt(t,s[0],s[1],s[2],s[3]*1.15,s[4],.42,O.white);const g=O.full?1:3.2;for(let s=0;s<O.tufts;s++){const a=s>=O.tufts*.7,l=h()*_,v=L[Math.floor(l/_*20)%20],p=a?v*h.range(.82,1):Math.sqrt(h())*(v-1.5),i=Math.cos(l)*p,o=Math.sin(l)*p;if(V.some(C=>Math.hypot(C[0]-i,C[1]-o)<2.5)||Math.hypot(i,o)<2.4)continue;const f=w.length>0&&i<-7.2&&Math.abs(o)<6.5;if(f&&w.some(C=>Math.hypot(C[0]-i,C[1]-o)<.9))continue;const x=.45*(1-(p/14)**2)+.15,y=f?h.range(.3,.7):a?h.range(.9,1.9):h.range(2.2,3.8),U=O.full?a||f?4:5+(h()<.4?1:0):3,c=t.rgb(h.pick(["#3f6a2a","#4a7630","#547a2e"]),.1),E=t.rgb(h.pick(["#c2b050","#cdb85a","#b4aa48"]),.1),$=[(c[0]*1.3+E[0])/2.1,(c[1]*1.5+E[1])/2.1,(c[2]*1.3+E[2])/2.1];for(let C=0;C<U;C++){const ae=y*h.range(.7,1),N=h()*Math.PI,Se=h.range(.06,.1)*g,pe=Math.cos(N)*Se,me=Math.sin(N)*Se,Te=h()*_,Oe=h.range(.15,.3)*ae,Me=Math.cos(Te)*Oe,Pe=Math.sin(Te)*Oe,Ee=i+h.range(-.25,.25)*g,ze=o+h.range(-.25,.25)*g,se=[Ee+Me*.35,x+ae*.58,ze+Pe*.35],ve=[Ee+Me,x+ae,ze+Pe],Ce=.33*(ae/3),De=ae/3;if(t.quad([Ee-pe,x,ze-me],[Ee+pe,x,ze+me],[se[0]+pe*.75,se[1],se[2]+me*.75],[se[0]-pe*.75,se[1],se[2]-me*.75],c,m(0),m(0),m(Ce),m(Ce)),t.tri([se[0]-pe*.75,se[1],se[2]-me*.75],[se[0]+pe*.75,se[1],se[2]+me*.75],ve,$,m(Ce),m(Ce),m(De)),C===0&&!a&&!f&&h.chance(O.garden?.8:.45)){const Ue=t.rgb(O.plume,.08),Fe=(O.garden?.16:.07)*g,Ne=O.garden?.4:.7;t.quad([ve[0],ve[1]-.1,ve[2]],[ve[0]+Fe,ve[1]+Ne*.36,ve[2]+Fe],[ve[0]+Me*.12,ve[1]+Ne,ve[2]+Pe*.12],[ve[0]-Fe,ve[1]+Ne*.36,ve[2]-Fe],Ue,m(De),m(De*1.1),m(De*1.25),m(De*1.1))}}}}function Qt(t,h,O){const m=Q=>[4,0,0,Q],H=["#5c9e44","#6aae4a","#4f9248","#7ab850","#48884c"];let L=-O*.75,R=0;for(let Q=0;Q<O;Q++){L+=h.range(1,2),R=R*.75+h.range(-.9,.9);const T=h.range(.45,.72),F=t.rgb(h.pick(H),.1),n=F.map(w=>w*1.25),k=h.range(.03,.07),V=h()*_,S=m(k);for(let w=0;w<7;w++){const g=V+w*_/7.6,s=g+_/7.6;t.tri([R,.05,L],[R+Math.cos(s)*T,.1,L+Math.sin(s)*T],[R+Math.cos(g)*T,.1,L+Math.sin(g)*T],w&1?F:n,S,S,S)}if(h.chance(.42)){const w=R+h.range(-.15,.15),g=L+h.range(-.15,.15),s=t.rgb("#f2efe4",.04),a=h.range(.26,.36);for(let l=0;l<5;l++){const v=l*_/5+V;t.tri([w+Math.cos(v-.6)*.07,.11,g+Math.sin(v-.6)*.07],[w+Math.cos(v+.6)*.07,.11,g+Math.sin(v+.6)*.07],[w+Math.cos(v)*a,.36,g+Math.sin(v)*a],s,S,S,S)}t.spar([w,.1,g],[w,.2,g],.05,.03,4,t.rgb("#d9a83a",.05),!0,S)}}}var sa={id:"knotted-river",name:"The River Tied in a Knot",category:"bizarre",weirdness:.9,media:["air","open","water"],async build(t){const h=t.rng,O=t.vary||{},m=d.Vector3,H=e=>new d.Color(e),L=(e,r,u)=>Math.min(u,Math.max(r,e)),R=L(t.quality?.detail??1,.5,1),Q=L(O.density??1,.7,1.3),T=46,F=(e,r,u)=>{const M=L((u-e)/(r-e),0,1);return M*M*(3-2*M)},n=h(),k=h(),V=h(),S=h(),w=h(),g=rt[O.hour]?O.hour:n<.22?"night":n<.48?"golden":n<.6?"day":"dawn";let s=k<.6?"clear":k<.82?"mist":"rain";(g==="night"||g==="golden"&&s==="rain")&&(s="clear");const a=rt[g],l=s==="mist"?1:0,v=s==="rain"?1:0,p=V>.72&&g!=="night",i=S>.7,o=w>.6,f=qt(a.az,a.el),x=a.sunI*(l?.55:v?.6:1),y=new d.Scene,U=H(a.fog);l&&U.lerp(H(a.mid),.45),v&&U.lerp(H("#9aa4b4"),.45),y.fog=new d.FogExp2(U,a.fogD*(l?2.3:v?1.8:1)),y.background=U.clone();const c=await Nt(t,{palette:a.pal,detail:R,sunDir:f.toArray(),sunColor:a.sunCol,sunIntensity:x,duration:T,glow:a.glow,glowFar:a.glowFar??1,limbTight:a.limb,body:a.body??1,farCore:a.farCore,caust:a.caust,fill:a.fill??1,glitter:a.glitter??1,refl:a.refl,lamp:a.lamp??0,underLit:a.underLit??0,density:Q,streak:a.streak??1,glitterWide:a.glitW??0,limbPale:a.limbPale??0,netContrast:a.netK??0,moonAmb:a.moonAmb?new d.Color().fromArray(a.moonAmb):null});y.add(c.object);const E=c.uniforms,$=c.tubeRadius,C=c.anchors,ae=()=>d.UniformsUtils.clone(d.UniformsLib.fog);await t.yield();const N=Et(C.flyThrough),Se=new m().fromArray(C.portalSeat.position),pe=N.tangentAt(1,new m),me=C.portalSeat.position,Te={},Oe=c.place(C.entryS+330,c.crownTheta(C.entryS+330),0).position.toArray(),Me=[];for(let e=0;e<c.length;e+=10)Me.push(c.frameAt(e,{}).C.clone());const Pe=e=>{let r=1e18;for(const u of Me)r=Math.min(r,u.distanceToSquared(e));return Math.sqrt(r)-$};await t.yield();let Ee=0,ze=0;{const e=new m;let r=-1e9;for(let u=0;u<=N.length;u+=3)N.posAtDist(u,e).y>r&&(r=e.y,Ee=u);for(ze=Ee;ze<N.length&&Pe(N.posAtDist(ze,e))>20;ze+=3);}const se=C.under.u*N.length,ve=C.bridge.u*N.length;let Ce=0,De=0,Ue=0,Fe=0,Ne=N.length;{const e=new m,r=new m;let u=-1e9,M=1e9,B=1e9;for(let A=0;A<=se;A+=3)N.posAtDist(A,e).y>u&&(u=e.y,De=A);for(;Ce<N.length&&Pe(N.posAtDist(Ce,e))<=20;)Ce+=3;M=1e9;for(let A=De;A<=se;A+=3)N.posAtDist(A,e).y<M&&(M=e.y,Ue=A);for(let A=De;A<=Ue;A+=3)N.tangentAtDist(A,e).y<B&&(B=e.y,Fe=A);for(const A of C.hoops){let z=1e18,I=0;r.fromArray(A.centre);for(let D=0;D<=N.length;D+=3){const q=N.posAtDist(D,e).distanceToSquared(r);q<z&&(z=q,I=D)}Ne=Math.min(Ne,I)}}const v0=new m;for(const e of Me)v0.add(e);v0.multiplyScalar(1/Me.length);const V0=(C.under.s+C.crossing.lowerS-c.length)/2,I0=c.place(V0,c.crownTheta(V0)+Math.PI,0).position,be=e=>e/N.length,g0=(e,r)=>{const u=new m().copy(r).sub(N.posAtDist(e,new m));return["d",Math.atan2(u.x,u.z)/ye,Math.asin(u.y/u.length())/ye]},Ke=[[0,null],[be(Ce),Oe],[be(De),v0.toArray()],[be(Fe),g0(Fe,I0)],[be(Ue),g0(Ue,I0)],[be(se),g0(se,new m().fromArray(C.landmarks.eye))],[be(Ee),me],[be(Ne),me],[1,null]],ut=L(N.length*.05,8,40),a0=new m,w0=new m,ft=[new m,new m,new m,new m],o0=(e,r)=>{const u=Ke[L(e,0,Ke.length-1)][1];return u?u[0]==="d"?r.set(Math.sin(u[1]*ye)*Math.cos(u[2]*ye),Math.sin(u[2]*ye),Math.cos(u[1]*ye)*Math.cos(u[2]*ye)):r.set(u[0],u[1],u[2]).sub(a0).normalize():r.copy(w0)},n0=e=>Ke[L(e,0,Ke.length-1)][0],dt=(e,r)=>{const u=L(e,0,1)*N.length;N.posAtDist(u,a0),N.posAtDist(u+ut,w0),w0.sub(a0).normalize();let M=1;for(;M<Ke.length-1&&Ke[M][0]<e;)M++;const B=n0(M-1),A=n0(M),z=Math.max(1e-6,A-B),I=L((e-B)/z,0,1),D=I*I,q=D*I,[Y,G,K,P]=ft;o0(M-2,Y),o0(M-1,G),o0(M,K),o0(M+1,P);const j=z/Math.max(1e-6,A-n0(M-2)),W=z/Math.max(1e-6,n0(M+1)-B),X=2*q-3*D+1,Z=q-2*D+I,te=-2*q+3*D,re=q-D;return r.set(0,0,0).addScaledVector(G,X-re*W).addScaledVector(K,te+Z*j).addScaledVector(Y,-Z*j).addScaledVector(P,re*W),r.lengthSq()<1e-6&&r.copy(G),r.normalize()},s0={},y0=new m,je={},ht={},U0=e=>{let r=1e18,u=0;for(let B=0;B<Me.length;B++){const A=Me[B].distanceToSquared(e);A<r&&(r=A,u=B)}let M=u*10;for(let B=u*10-9;B<u*10+10;B++){const A=c.frameAt(B,s0).C.distanceToSquared(e);A<r&&(r=A,M=B)}return M},b0=Math.ceil(N.length/12),H0=new Float32Array(b0+1);for(let e=0;e<=b0;e++)H0[e]=U0(N.posAtDist(Math.min(N.length,e*12),y0)),(e&31)===31&&await t.yield();const Jt=e=>H0[Math.round(L(e,0,1)*b0)],pt=C.entryS,ea=C.under.s,ta=C.arm.s;await t.yield();const G0=3,Ze=[];for(let e=0;e<=N.length;e+=G0)Ze.push(N.posAtDist(e));const x0=e=>{let r=1e18;for(const u of Ze)r=Math.min(r,u.distanceToSquared(e));return Math.sqrt(r)},S0=C.crossing.upperS,mt=new m().fromArray(C.crossing.position);await t.yield();const Le={uNoise:E.uNoise,uTime:E.uTime,uMist:{value:l},uRain:{value:v},uStars:{value:a.stars},uDeckY:{value:$e},uGap:{value:g==="night"?1:0},uLowK:{value:a.deckLow??1},uRoll:{value:new d.Vector2(Math.cos((a.deckRoll??0)*ye),Math.sin((a.deckRoll??0)*ye))},uDisc:{value:a.disc},uDiscCos:{value:Math.cos(a.discSize*ye)},uZen:{value:H(a.zen).multiplyScalar(a.k)},uMid:{value:H(a.mid).multiplyScalar(a.k)},uHor:{value:H(a.hor).multiplyScalar(a.k)},uHaze:{value:H(a.haze).multiplyScalar(a.k)},uLit:{value:H(a.lit).multiplyScalar(a.k)},uShade:{value:H(a.shade).multiplyScalar(a.k*.8)},uBay:{value:H(a.bay).multiplyScalar(a.k*.5)},uDeckLit:{value:H(a.deckLit).multiplyScalar(a.k*.95)},uDeckShade:{value:H(a.deckShade).multiplyScalar(a.k*.74)},uSunDir:E.uSunDir,uSunCol:{value:H(a.sunCol)},uTow:{value:[new d.Vector4,new d.Vector4,new d.Vector4,new d.Vector4]}},r0=new d.Mesh(new d.SphereGeometry(10,40,24),new d.ShaderMaterial({vertexShader:_t,fragmentShader:Vt,uniforms:Le,side:d.BackSide,depthWrite:!1,fog:!1}));r0.frustumCulled=!1,r0.renderOrder=-10,r0.name="sky",y.add(r0),y.fog.color.copy(Le.uHaze.value),v&&y.fog.color.lerp(H("#7f8894"),.4),y.background.copy(y.fog.color),E.uHaze.value.copy(y.fog.color).lerp(E.uAqua.value,a.hazeAqua??.55),E.uHazeK.value.set((a.hazeD??18e-5)*(l?1.5:v?1.3:1),.75);const vt={uNoise:E.uNoise,uTime:E.uTime,uSunDir:E.uSunDir,uMist:Le.uMist,uLit:Le.uLit,uShade:a.puffShade?{value:H(a.puffShade)}:Le.uShade,uTopLit:{value:a.puffTop??0},uHaze:Le.uHaze,uSunCol:Le.uSunCol};{const e=h.fork("puffs"),r=[],u=f.x/Math.max(.001,Math.hypot(f.x,f.z)),M=f.z/Math.max(.001,Math.hypot(f.x,f.z)),B=(P,j,W,X,Z)=>{const te=X-$e,re=[],ie=[],fe=(oe,J,de,le,ge,we)=>{const t0=[oe,J,de,le,e(),L((J-$e)/te,0,1),e()*_,L(((oe-P)*u+(de-j)*M)/W,-1,1),ge];r.push(t0),we&&we.push(t0)},Ae=Z?7:4,Ge=Z?12:6,P0=Math.round((Z?34:12)*(.6+.4*R)),p0=Math.round((Z?26:6)*(.6+.4*R));for(let oe=0;oe<Ae;oe++){const J=(oe+e())/Ae*_,de=W*e.range(.3,.72),le=W*e.range(.42,.62);fe(P+Math.cos(J)*de,$e+le*.25,j+Math.sin(J)*de*.8,le,1)}for(let oe=0;oe<Ge;oe++){const J=(oe+.5)/Ge,de=e()*_,le=W*(1-.55*J)*e.range(.05,.8),ge=W*e.range(.3,.45)*(1-.3*J);fe(P+Math.cos(de)*le,$e+te*(.25+.6*J)-ge*.4,j+Math.sin(de)*le*.8,ge,.3,re)}for(let oe=0;oe<P0;oe++){const J=e.pick(re),de=e()*_,le=e.range(.05,1.35),ge=J[3]*e.range(.28,.5),we=J[3]*.85;fe(J[0]+Math.cos(de)*Math.cos(le)*we,J[1]+Math.sin(le)*we,J[2]+Math.sin(de)*Math.cos(le)*we*.6,ge,.12,ie)}for(let oe=0;oe<p0&&ie.length;oe++){const J=e.pick(ie),de=e()*_,le=e.range(0,1.3),ge=J[3]*e.range(.34,.6),we=J[3]*.85;fe(J[0]+Math.cos(de)*Math.cos(le)*we,J[1]+Math.sin(le)*we,J[2]+Math.sin(de)*Math.cos(le)*we*.6,ge,0)}},A=[[330,2260,450,-80],[-1400,1935,300,-250],[-2850,3853,380,-140],[707,6024,430,-150]];for(const[P,j,W,X]of A)B(P,j,W,X,!0);const z=Math.max(.12,f.y/Math.max(.001,Math.hypot(f.x,f.z)));Le.uTow.value=A.map(([P,j,W,X])=>new d.Vector4(P,j,W*1.05,Math.min(a.towShadow??2800,(X-$e)/z)));const I=Math.max(16,Math.round(30*R));for(let P=0,j=0;P<I&&j<300;j++){const W=e.range(-2.4,2.4),X=e.range(600,4400),Z=200+Math.sin(W)*X,te=700+Math.cos(W)*X*1.1,re=e()<.25,ie=re?e.range(190,300):e.range(80,170),fe=re?e.range(-360,-230):e.range(-560,-400);A.some(Ae=>Math.hypot(Ae[0]-Z,Ae[1]-te)<2.2*(Ae[2]+ie))||(B(Z,te,ie,fe,re),P++)}r.sort((P,j)=>j[2]-P[2]);const D=new d.InstancedBufferGeometry;D.setAttribute("position",new d.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),D.setIndex([0,1,2,0,2,3]);const q=new Float32Array(r.length*4),Y=new Float32Array(r.length*4),G=new Float32Array(r.length);r.forEach((P,j)=>{q.set([P[0],P[1],P[2],P[3]],j*4),Y.set([P[4],P[5],P[6],P[7]],j*4),G[j]=P[8]}),D.setAttribute("aC",new d.InstancedBufferAttribute(q,4)),D.setAttribute("aD",new d.InstancedBufferAttribute(Y,4)),D.setAttribute("aE",new d.InstancedBufferAttribute(G,1)),D.instanceCount=r.length;const K=new d.Mesh(D,new d.ShaderMaterial({vertexShader:It,fragmentShader:Ut,uniforms:vt,transparent:!0,depthWrite:!1,fog:!1}));K.frustumCulled=!1,K.renderOrder=-5,K.name="cumulus",y.add(K)}await t.yield();const W0=a.pal[5],gt=i?"#d2452c":"#e2d6b4",ke=h.fork("islets"),i0=[],M0=(e,r,u,M=1)=>({s:e,th:r,yaw:u,scale:M,mir:1,vs:0,vth:0,phase:ke()*_,seed:ke()});i0.push(c.place(C.under.islet.s,C.under.islet.th,0).position.clone());const aa=e=>c.crownTheta(e)+Math.PI;let qe=null;for(const e of C.berths)(!qe||e.upY-e.d/60>qe.upY-qe.d/60)&&(qe=e);const Re=qe?M0(qe.s,qe.th,0):null,l0=[],A0=[];for(const e of C.berths)i0.push(c.place(e.s,e.th,0).position.clone()),e!==qe&&l0.push(M0(e.s,e.th,ke()*_,ke.range(.9,1.08)));await t.yield();const wt=Math.round(27*Q*(.6+.4*R));for(let e=0;A0.length<wt&&e<400;e++){const r=ke()*c.length,u=ke()*_,M=c.place(r,u,0,je).position;x0(M)<130||i0.some(B=>B.distanceTo(M)<60)||(A0.push(M0(r,u,ke()*_,ke.range(.95,1.5))),i0.push(M.clone()),(e&15)===15&&await t.yield())}await t.yield();const k0=c.standMaterial({WRAP:1}),z0={cloth:W0,cream:a.pal[1],garden:i,plume:gt,white:o};if(Re){const e=c.builder();_0(e,ke,{...z0,tufts:Math.round(250*(.7+.3*R)),full:!0,herons:3}),await t.yield();const r=e.geometry();await t.yield(),c.add(c.instanced(r,[Re]),k0,3,"heron-islet")}await t.yield();{const e=c.builder();_0(e,ke,{...z0,tufts:Math.round(230*(.7+.3*R)),full:!0,herons:2}),await t.yield();const r=e.geometry();await t.yield(),c.add(c.instanced(r,l0),k0,3,"islets")}await t.yield();{const e=c.builder();_0(e,ke,{...z0,tufts:46,full:!1,herons:0}),c.add(c.instanced(e.geometry(),A0),k0,3,"far-islets")}await t.yield();{const e=h.fork("leaves"),r=[],u=c.builder();Qt(u,e,12);const M=[Re,...l0].filter(Boolean).map(z=>c.place(z.s,z.th,0).position.clone()),B=Math.round(190*Q*R);for(let z=0;r.length<B&&z<5e3;z++){(z&255)===255&&await t.yield();const I=e()*c.length,D=e()*_;if(!(e()<.03)&&x0(c.place(I,D,0,je).position)>95)continue;const Y=c.place(I,D,0,je).position;M.some(G=>G.distanceToSquared(Y)<361)||r.push({s:I,th:D,yaw:e.range(-.35,.35)+(e.chance(.5)?Math.PI:0),scale:e.range(.9,1.5),mir:e.sign(),vs:e.range(.5,1.1),vth:0,phase:e()*_,seed:e()})}const A=c.standMaterial({WRAP:1});A.uniforms.uFarShrink.value=1,c.add(c.instanced(u.geometry(),r),A,3,"float-leaves")}await t.yield();const C0={...ae(),...E,uBirdTint:{value:H(g==="night"?"#b4c2e2":"#ffffff")},uFlapRate:{value:1},uFlapAmp:{value:.8},uBirdFloor:{value:g==="night"?.5:0}},O0=it(p),D0=(e,r)=>new d.ShaderMaterial({vertexShader:Ht(c.radialGLSL),fragmentShader:Gt(c.skyGLSL),uniforms:r||C0,fog:!0,side:d.DoubleSide,defines:e||{}});{const e=h.fork("terns"),r=[],u=(D,q,Y,G,K,P,j=0)=>r.push(D,q,Y,G,K,P,e()*_,j);{const q=N.posAtDist(ze,new m),Y=U0(q),G=Math.max(7,c.frameAt(Y,s0).C.distanceTo(q)-$-7),K=.12*e.sign(),P=e()*_;for(let j=0;j<30;j++)u(Y+e.range(-3,3),P+j/30*_+e.range(-.05,.05),G+e.range(-1,1),1.6,K,0)}const M=(D,q)=>{const Y=c.frameAt(D,s0);for(const G of Ze){const K=y0.subVectors(G,Y.C).dot(Y.T);if(Math.abs(K)>11)continue;const P=Math.sqrt(Math.max(0,y0.lengthSq()-K*K));if(Math.abs(P-$-q)<13)return!1}return!0},B=Math.max(12,Math.round(19*(.6+.4*R)));for(let D=0,q=0;D<B&&q<200;q++){const Y=e()*c.length,G=e.range(14,30);if(!M(Y,G))continue;const K=e.sign()*e.range(.09,.15),P=30,j=e()*_;for(let W=0;W<P;W++)u(Y+e.range(-4,4),j+W/P*_+e.range(-.06,.06),G+e.range(-2.5,2.5),e.range(1.25,1.7),0,K);D++}const A=D0(),z=it(p,!0),I=(D,q,Y,G)=>{const K=Y-q,P=new d.InstancedBufferGeometry;for(const X in D.attributes)P.setAttribute(X,D.attributes[X]);const j=new Float32Array(K*4),W=new Float32Array(K*4);for(let X=0;X<K;X++){const Z=(q+X)*8;j.set(r.slice(Z,Z+4),X*4),W.set(r.slice(Z+4,Z+8),X*4)}P.setAttribute("aA",new d.InstancedBufferAttribute(j,4)),P.setAttribute("aB",new d.InstancedBufferAttribute(W,4)),P.instanceCount=K,c.add(P,A,3,G)};I(O0,0,30,"tern-ring"),I(z,30,r.length/8,"terns")}const Ye=new d.InstancedMesh(O0,D0({FREE:1},{...C0,uBirdTint:{value:H(g==="night"?"#d2dcf4":"#ffffff")}}),9);Ye.frustumCulled=!1,Ye.renderOrder=3,Ye.name="eyelet-terns",y.add(Ye);const B0=new m().crossVectors(pe,new m(0,1,0)).normalize(),K0=new m().crossVectors(B0,pe).normalize(),c0=t.core.makeRng(t.core.hashSeed("knotted-river-eyelet-terns:"+t.seed)),yt=c0()*_,j0=[];for(let e=0;e<9;e++)j0.push([c0()*_,c0()*_,c0()*_]);await t.yield();{const e=h.fork("fish"),r=Math.round(300*R),u=new d.InstancedBufferGeometry,M=lt();for(const z in M.attributes)u.setAttribute(z,M.attributes[z]);const B=new Float32Array(r*4),A=new Float32Array(r*4);for(let z=0;z<r;z++){const I=pt+e.range(-25,170),D=e.sign()*(z%3===0?e.range(3,10):e.range(8,34));B.set([I,c.crownTheta(I)+D/$,(e.chance(.5)?0:Math.PI)+e.range(-.7,.7),e.range(.85,1.35)],z*4),A.set([e.range(3.2,8),e(),e.range(2.6,5.2),e.range(1,2.7)],z*4)}u.setAttribute("aA",new d.InstancedBufferAttribute(B,4)),u.setAttribute("aB",new d.InstancedBufferAttribute(A,4)),u.instanceCount=r,c.add(u,new d.ShaderMaterial({vertexShader:Wt(c.radialGLSL),fragmentShader:Ot(c.skyGLSL),uniforms:{...ae(),...E},fog:!0,side:d.DoubleSide}),3,"leaping-fish")}const T0=6,bt=1.25,xt=130,St=.25,Mt=12,Y0=[],Qe=[],X0=[],He=new d.InstancedMesh($t(o),D0({FREE:1},{...C0,uFlapRate:{value:.5},uFlapAmp:{value:.62}}),T0);He.frustumCulled=!1,He.renderOrder=3,He.name="herons",y.add(He);let $0=1e9;const Z0=new m(0,1,0);if(Re){const e=h.fork("herons"),r=c.place(Re.s,Re.th,0,je).position.clone();Z0.copy(je.up);let u=1e9,M=0,B=-1;for(let z=0;z<Ze.length;z++){const I=Ze[z].distanceTo(r);I<u&&(u=I,M=z),B<0&&I<xt&&(B=z)}$0=(B>=0?B:M)*G0;const A=e()*_;for(let z=0;z<T0;z++){const I=-e.range(8.5,11.5),D=-5+z*2+e.range(-.6,.6),q=Re.s+D,Y=Re.th-I/$;let G=null;for(let K=0;K<40&&!G;K++){const P=A+e.range(-.4,.4),j=e.range(.14,.3),W=Math.cos(P),X=Math.sin(P),Z=[c.place(q,Y,1.2).position.clone(),c.place(q,Y,4.5).position.clone()];for(const ie of[14,36,70,115,170,235]){const fe=6+j*ie+e.range(-1.5,1.5);Z.push(c.place(q+ie*W,Y+ie*X/($+fe),fe).position.clone())}const te=new d.CatmullRomCurve3(Z,!1,"centripetal",.5);let re=!0;for(const ie of te.getSpacedPoints(80))if(x0(ie)<Mt){re=!1;break}re&&(G=te),(K&3)===3&&await t.yield()}Y0.push(G),Qe.push(G?G.getLength():0),X0.push(z*9+e.range(0,6)),await t.yield()}}const Q0=new m,u0=new m,Be=new m,f0=new m,Je=new m,J0=new d.Matrix4,At=new m,kt=e=>{const r=e*N.length-$0;for(let u=0;u<T0;u++){const M=Y0[u],B=M?(r-X0[u])*St:-1;if(!M||B<=0||B>=Qe[u]){He.setMatrixAt(u,J0.makeScale(0,0,0));continue}const A=B/Qe[u];M.getPointAt(A,Q0),M.getTangentAt(A,Je),M.getTangentAt(Math.min(1,A+3/Qe[u]),u0),Be.crossVectors(Z0,Je),Be.lengthSq()<1e-4&&Be.set(1,0,0),Be.normalize(),f0.crossVectors(Je,Be);const z=L(u0.sub(Je).dot(Be)/3*30,-.6,.6),I=Math.cos(z),D=Math.sin(z);u0.copy(Be).multiplyScalar(I).addScaledVector(f0,-D),f0.multiplyScalar(I).addScaledVector(Be,D),Be.copy(u0);const q=bt*Math.min(1,B/2)*Math.min(1,(Qe[u]-B)/8);He.setMatrixAt(u,J0.makeBasis(Be,f0,Je).scale(At.set(q,q,q)).setPosition(Q0))}He.instanceMatrix.needsUpdate=!0};await t.yield();{const e=h.fork("motes"),r=[],u=[],M=[],B=[Re,...l0].filter(Boolean);for(const I of B)for(let D=0;D<2;D++){const q=e.range(-7,7),Y=e.range(-7,7)/$,G=c.place(I.s+q,I.th+Y,5.6,je),K=c.place(I.s+q+e.range(-8,8),I.th+Y,e.range(24,34),ht),P=Math.round(7*(.6+.4*R)),j=1/e.range(8,12),W=e();for(let X=0;X<P;X++)r.push(G.position.x,G.position.y,G.position.z),u.push(K.position.x,K.position.y,K.position.z),M.push(e.range(1.5,2.3),1,W+X/P,j)}const A=new d.InstancedBufferGeometry;A.setAttribute("position",new d.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),A.setIndex([0,1,2,0,2,3]),A.setAttribute("aP0",new d.InstancedBufferAttribute(new Float32Array(r),3)),A.setAttribute("aP1",new d.InstancedBufferAttribute(new Float32Array(u),3)),A.setAttribute("aS",new d.InstancedBufferAttribute(new Float32Array(M),4)),A.instanceCount=M.length/4;const z=new d.Mesh(A,new d.ShaderMaterial({vertexShader:Kt,fragmentShader:jt,uniforms:{...ae(),...E},fog:!0,transparent:!0,depthWrite:!1,blending:d.CustomBlending,blendSrc:d.OneFactor,blendDst:d.OneMinusSrcAlphaFactor}));z.frustumCulled=!1,z.renderOrder=7,z.name="smoke",y.add(z)}if(v){const e=h.fork("rain"),r=(u,M,B,A,z,I)=>{const D=new d.InstancedBufferGeometry;D.setAttribute("position",new d.Float32BufferAttribute([-1,0,0,1,0,0,1,1,0,-1,1,0],3)),D.setIndex([0,1,2,0,2,3]);const q=new Float32Array(u*4);for(let K=0;K<u;K++)q.set([e(),I?e.gauss()*I:e()*_,e(),e.range(26,42)],K*4);D.setAttribute("aA",new d.InstancedBufferAttribute(q,4)),D.instanceCount=u;const Y=new d.ShaderMaterial({vertexShader:Yt(c.radialGLSL).replace("aA.y, 0.0, C","aA.y + uThC, 0.0, C").replace("uniform float uTime,","uniform float uThC, uTime,"),fragmentShader:Xt,uniforms:{uFrames:E.uFrames,uLen:E.uLen,uTubeR:E.uTubeR,uTime:E.uTime,uPixAng:E.uPixAng,uCamS:{value:A},uThC:{value:z},uWin:{value:M},uHmax:{value:B},uRainCol:{value:H("#cfe0ee").multiplyScalar(.8)}},transparent:!0,depthWrite:!1,blending:d.CustomBlending,blendSrc:d.OneFactor,blendDst:d.OneMinusSrcAlphaFactor}),G=new d.Mesh(D,Y);return G.frustumCulled=!1,G.renderOrder=8,G.name="rain",y.add(G),Y};{const u=r(Math.round(23600*R),c.length,46,c.length/2,0,0);u.vertexShader=u.vertexShader.replace(" * (1.0 - smoothstep(0.4, 0.5, abs(so)))","")}r(Math.round(2200*R),300,60,S0,c.thetaToward(S0,mt),.9)}let F0=null;if(O.rare){const e=C.bridge.u*N.length,r=h.fork("splice"),u=N.tangentAtDist(e,new m),M=new m(-u.z,0,u.x).normalize(),B=N.posAtDist(e,new m).addScaledVector(M,25),A=b=>{let ee=1e18,he=b;for(let ue=b-90;ue<=b+90;ue+=2){const ne=c.frameAt(ue,s0).C.distanceToSquared(B);ne<ee&&(ee=ne,he=ue)}return c.place(he,c.thetaToward(he,B),-1.5).position.clone()},z=A(C.crossing.lowerS),I=A(S0),D=I.clone().sub(z),q=D.length(),Y=D.clone().normalize(),G=new m().crossVectors(Y,u).normalize(),K=new m().crossVectors(Y,G).normalize(),P=(b,ee)=>{const he=2.6*Math.PI*b+.5,ue=Math.sin(Math.PI*b),ne=9*ue*ue;return ee.copy(z).addScaledVector(D,b).addScaledVector(G,Math.cos(he)*ne).addScaledVector(K,Math.sin(he)*ne)},j=b=>2+5*(Math.exp(-b*q/4.5)+Math.exp(-(1-b)*q/4.5)),W=110,X=14,Z=[],te=[],re=[],ie=[],fe=[],Ae=[0];for(let b=0;b<=W;b++)Z.push(P(b/W,new m));for(let b=0;b<=W;b++)te.push(Z[Math.min(W,b+1)].clone().sub(Z[Math.max(0,b-1)]).normalize()),fe.push(j(b/W)),b&&Ae.push(Ae[b-1]+Z[b].distanceTo(Z[b-1]));let Ge=G.clone();for(let b=0;b<=W;b++)Ge.addScaledVector(te[b],-Ge.dot(te[b])).normalize(),re.push(Ge.clone()),ie.push(new m().crossVectors(te[b],Ge));const P0=Ae[W],p0=[],oe=[],J=[],de=[],le=[];for(let b=0;b<=W;b++)for(let ee=0;ee<=X;ee++){const he=ee/X*_+Ae[b]*.09,ue=Math.cos(he),ne=Math.sin(he),Ve=re[b].x*ue+ie[b].x*ne,Ie=re[b].y*ue+ie[b].y*ne,xe=re[b].z*ue+ie[b].z*ne;p0.push(Z[b].x+Ve*fe[b],Z[b].y+Ie*fe[b],Z[b].z+xe*fe[b]),oe.push(Ve,Ie,xe),J.push(te[b].x,te[b].y,te[b].z),de.push(Ae[b],ee/X*_)}for(let b=0;b<W;b++)for(let ee=0;ee<X;ee++){const he=b*(X+1)+ee,ue=he+1,ne=he+X+1,Ve=ne+1;le.push(he,ue,ne,ue,Ve,ne)}const ge=new d.BufferGeometry;ge.setAttribute("position",new d.Float32BufferAttribute(p0,3)),ge.setAttribute("normal",new d.Float32BufferAttribute(oe,3)),ge.setAttribute("aT",new d.Float32BufferAttribute(J,3)),ge.setAttribute("aST",new d.Float32BufferAttribute(de,2)),ge.setIndex(le);const we=new d.Mesh(ge,c.waterMaterial(P0,{radius:2,glow:1.9,flow:1.6,tiles:3,ripple:.6,bulge:.18}));we.frustumCulled=!1,we.renderOrder=1,we.name="splice",y.add(we);const t0=b=>new d.ShaderMaterial({fog:!0,side:d.DoubleSide,uniforms:{...ae(),...E,uSpec:{value:b}},vertexShader:`
attribute vec3 color; varying vec3 vN, vCol, vWPos;
#include <fog_pars_vertex>
void main() {
#ifdef USE_INSTANCING
  mat4 im = instanceMatrix;
#else
  mat4 im = mat4(1.0);
#endif
  vec4 wp = modelMatrix * im * vec4(position, 1.0);
  vN = mat3(modelMatrix) * mat3(im) * normal; vCol = color; vWPos = wp.xyz;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
precision highp float; uniform float uSpec; varying vec3 vN, vCol, vWPos;
${c.skyGLSL}
#include <fog_pars_fragment>
void main() {
  vec3 V = normalize(cameraPosition - vWPos + vec3(0.0, 1e-5, 0.0)), n = normalize(vN + vec3(0.0, 1e-5, 0.0));
  if (dot(n, V) < 0.0) n = -n;
  float sp = max(dot(n, normalize(V + uSunDir + vec3(0.0, 1e-5, 0.0))), 0.0); float s8 = sp * sp; s8 *= s8; s8 *= s8; float s32 = s8 * s8; s32 *= s32;
  vec3 col = vCol * (skyAmbient(n) + uSunCol * max(dot(n, uSunDir), 0.0) * 0.7) + uSunCol * s32 * uSpec;
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`}),E0=18,Xe=new d.InstancedMesh(lt(),t0(1.4),E0);Xe.frustumCulled=!1,Xe.renderOrder=3,Xe.name="splice-fish",y.add(Xe);const at=[];for(let b=0;b<E0;b++)at.push([r(),r()*_,r.range(.03,.05),r.range(1,1.5)]);const ce=c.builder();ct(ce,r,0,0,0,0),ce.spar([0,.3,-1.25],[0,1.45,-1.3],.2,.13,6,ce.rgb("#b9a47c",.05),!0),ce.spar([0,1.45,-1.3],[0,1.68,-1.3],.1,.1,6,ce.rgb("#8a6248",.05),!0),ce.spar([0,1.6,-1.3],[0,1.86,-1.3],.44,.03,9,ce.rgb("#d8bf7c",.05),!0),ce.spar([.3,2.9,-.75],[.62,-1.9,-1.9],.035,.03,4,ce.rgb("#7a5c40",.05)),ce.spar([.15,1.2,-1.15],[.36,1.3,-1],.05,.045,4,ce.rgb("#b9a47c",.05)),ce.spar([-.1,.3,.5],[-.1,.72,.5],.24,.33,7,ce.rgb("#b08a4e",.1)),ce.spar([-.1,.66,.5],[-.1,.8,.5],.3,.1,7,ce.rgb(W0,.06),!0),ce.spar([.12,.3,1.3],[.12,.5,1.3],.3,.2,7,ce.rgb("#47686a",.1),!0);const We=new d.Mesh(ce.geometry(),t0(0));We.frustumCulled=!1,We.renderOrder=3,We.name="splice-skiff",y.add(We);const ot=new d.Matrix4,nt=new m,m0=new m,N0=new m,L0=new m,Ft=new m,Rt=r()*_,Pt=r()*_,st=(b,ee,he,ue,ne,Ve)=>{const Ie=L(b,0,1)*W,xe=Math.min(W-1,Math.floor(Ie)),q0=Ie-xe;return L0.copy(Z[xe]).lerp(Z[xe+1],q0),N0.copy(te[xe]).lerp(te[xe+1],q0).normalize().multiplyScalar(ue),m0.copy(re[xe]).multiplyScalar(Math.cos(ee)).addScaledVector(ie[xe],Math.sin(ee)),nt.crossVectors(m0,N0).normalize(),L0.addScaledVector(m0,fe[xe]+(fe[xe+1]-fe[xe])*q0+he),Ve.makeBasis(nt,m0,N0).scale(Ft.set(ne,ne,ne)).setPosition(L0)};F0=b=>{for(let ee=0;ee<E0;ee++){const[he,ue,ne,Ve]=at[ee],Ie=.06+.88*((he+b*ne)%1);st(Ie,ue+Ie*5,.1,1,Ve,ot),Xe.setMatrixAt(ee,ot)}Xe.instanceMatrix.needsUpdate=!0,st(.47+.2*Math.sin(b*.1+Pt),Rt,.02,1,1.35,We.matrix),We.matrixAutoUpdate=!1,We.matrixWorldNeedsUpdate=!0}}await t.yield();const zt=new m(3.4,3.4,3.4),R0=new d.Matrix4,_e=new m,d0=new m,e0=new m,h0=new m,Ct=(e,r,u,M)=>{c.setProgress(M||0),c.update(e,r,u),kt(M||0);for(let B=0;B<9;B++){const A=j0[B],z=r*.5+yt+B*_/9+.35*Math.sin(r*.21+A[0]),I=13.6+.9*Math.sin(r*.6+A[1]);d0.copy(B0).multiplyScalar(Math.cos(z)).addScaledVector(K0,Math.sin(z)),e0.copy(B0).multiplyScalar(-Math.sin(z)).addScaledVector(K0,Math.cos(z)),_e.set(0,1,0).addScaledVector(d0,-.35),_e.addScaledVector(e0,-_e.dot(e0)),_e.lengthSq()<.01&&_e.copy(d0).negate(),_e.normalize(),h0.crossVectors(_e,e0),R0.makeBasis(h0,_e,e0).scale(zt),h0.copy(Se).addScaledVector(d0,I).addScaledVector(pe,-1.5+1.6*Math.sin(r*.43+A[2])),R0.setPosition(h0),Ye.setMatrixAt(B,R0)}Ye.instanceMatrix.needsUpdate=!0,F0&&F0(r),c.eyelet.uniforms.uOffD.value.x=-(r*.042%1)},Dt=new m,et=new m,Bt=(e,r)=>(dt(e,et),r.copy(N.posAtDist(L(e,0,1)*N.length,a0)).addScaledVector(et,1e3)),tt=(e,r,u)=>{const M=(u-r)*.35;return F(r,r+M,e)*(1-F(u-M,u,e))},Tt={exposure:a.exposure*(l?.96:1),bloom:{strength:a.bloom[0]*(l?.8:1),radius:a.bloom[1],threshold:a.bloom[2]},grade:{saturation:a.sat*(l?.9:v?.88:1),contrast:1.05,tint:a.tint,shadowTint:a.shadowTint,vignette:.3,grain:.02,aberration:0}};return{scene:y,path:N,duration:T,pace:e=>1.1-.36*tt(e,be(Ce),be(Fe))-.3*tt(e,be(Ue),be(se))-.16*F(be(ve),be(Ne),e),camera:{fov:62,near:.5,far:9e3,sway:.2,bank:0},pois:[{at:(e,r)=>Bt(r,Dt),from:-1,to:2,weight:.9}],portal:{shape:"circle",radius:7,color:"#FBEEDC",glow:1,revealDistance:500,tilt:!0},post:Tt,ride:"none",update:Ct,dispose(){c.dispose()}}}};export{sa as default};
