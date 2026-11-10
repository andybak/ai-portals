import*as r from"three";import{makePath as Ue,makeRng as de,hashSeed as pe,clamp as Ut,lerp as gt,smoothstep as et}from"../kit/core.js";import*as Fe from"../kit/terrain.js";import*as It from"../kit/flora.js";import*as Ge from"../kit/fauna.js";import*as mt from"../kit/fx.js";import*as De from"../kit/water.js";import{buildHero as Oe}from"../parts/lanterns-under-ice.js";const Xe=100,Te=46,Le=.55,Ye=.63,ge=mt.GLSL_HASH+mt.GLSL_VALUE_NOISE+`
vec3 cell2(vec2 x) {
  vec2 n = floor(x), f = fract(x); float d1 = 8.0, d2 = 8.0, id = 0.0;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j)); vec2 o = hash22(n + g); vec2 r = g + o - f; float d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; id = o.x; } else if (d < d2) { d2 = d; }
  }
  d1 = sqrt(d1); d2 = sqrt(d2);
  return vec3(d1, (d2 - d1) * 0.5, id);
}
`,Ke=`
attribute vec4 aFx;                       // x bacterial mat, y hot (vent glow), z mineral crust, w brine frost
attribute vec2 aBake;                     // x light of all the vents, y light of the lantern-jellies that hang near: both summed once at build time (per vertex or per instance)
uniform vec3 uVentCol, uLevPos, uLevCol, uPortalPos, uPortalCol, uLanCol, uLampPos, uLampCol;
uniform float uTime, uLevFall;
varying vec3 vW, vN, vLight; varying vec4 vFx;
#include <fog_pars_vertex>
void main() {
  vec4 lp = vec4(position, 1.0); vec3 n = normal;
  #ifdef USE_INSTANCING
    lp = instanceMatrix * lp; n = mat3(instanceMatrix) * n;
  #endif
  vec4 wp = modelMatrix * lp;
  vW = wp.xyz; vN = normalize(mat3(modelMatrix) * n); vFx = aFx;
  // warm vent light, shimmering as the hot water wavers
  float bk = aBake.x * (0.84 + 0.16 * sin(uTime * 2.3 + vW.x * 0.23 + vW.z * 0.19 + vW.y * 0.31));
  vec3 L = uVentCol * bk + vec3(1.0, 0.7, 0.4) * (0.3 * bk * bk);   // hotter light is whiter
  // amber of the lanterns hanging near (baked), breathing slowly as they pulse and drift
  L += uLanCol * (aBake.y * (0.8 + 0.2 * sin(uTime * 1.3 + vW.x * 0.11 - vW.z * 0.13)));
  vec3 d = uLampPos - vW; float r2 = dot(d, d);            // and of the company of lanterns travelling beside the camera (live)
  L += uLampCol * (max(dot(vN, d * inversesqrt(r2 + 0.01)) * 0.6 + 0.4, 0.0) / (1.0 + r2 * 0.0035));
  d = uLevPos - vW; r2 = dot(d, d);
  L += uLevCol * (1.5 * max(dot(vN, d * inversesqrt(r2 + 0.01)) * 0.6 + 0.4, 0.0) / (1.0 + r2 * uLevFall * 0.6));
  d = uPortalPos - vW; r2 = dot(d, d);
  L += uPortalCol * (max(dot(vN, d * inversesqrt(r2 + 0.01)) * 0.6 + 0.4, 0.0) / (1.0 + r2 * 0.004));
  vLight = L;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ze=`
uniform vec3 uIceCol, uVentCol, uMatCol, uFrostCol;
uniform float uTime, uSun;
varying vec3 vW, vN, vLight; varying vec4 vFx;
${ge}
#include <fog_pars_fragment>
void main() {
  vec3 n = normalize(vN);
  vec2 p = vW.xz + vW.y * vec2(0.37, 0.29);
  float n1 = vnoise(p * 0.13), n2 = vnoise(p * 0.55 + 3.1), n3 = vnoise(p * 2.3);
  vec3 vo = cell2(p * 0.4 + n1 * 1.3);                     // pillow-lava lobes with dark creases
  float crease = smoothstep(0.0, 0.14, vo.y);
  vec3 rock = mix(vec3(0.028, 0.034, 0.046), vec3(0.12, 0.135, 0.16), n1 * 0.55 + n2 * 0.45);
  rock *= (0.5 + 0.5 * crease) * (0.7 + 0.6 * n3) * (0.75 + 0.5 * vo.z);
  vec3 mineral = mix(vec3(0.15, 0.1, 0.06), vec3(0.24, 0.225, 0.19), n2) * (0.65 + 0.7 * n3);
  vec3 alb = rock;
  if (vFx.z > 0.01) {                                        // mineral crust, running down the chimney walls
    float streak = vnoise(vec2(p.x * 1.3 + p.y * 0.4, vW.y * 0.22));
    float pores = vnoise(p * 4.1 + vW.y * 1.9);
    alb = mix(rock, mineral * (0.3 + 0.7 * crease) * (0.4 + 1.25 * streak), clamp(vFx.z * (0.2 + 0.8 * n2), 0.0, 0.85));
    alb *= mix(1.0, 0.35 + 1.3 * pores * (0.5 + n3), vFx.z);
    // on the steep chimney walls: beads of sulphide, dark runnels and pale mineral bands
    float steep = smoothstep(0.25, 0.75, 1.0 - n.y * n.y) * vFx.z;
    float h = dot(vW.xz, abs(n.x) > abs(n.z) ? vec2(0.22, 1.0) : vec2(1.0, 0.22));    // along the wall, whichever way it faces
    vec3 bd = cell2(vec2(h * 0.95, vW.y * 0.8) + 2.0 * n1);
    float bead = smoothstep(0.6, 0.1, bd.x);
    float knob = vnoise(vec2(h * 3.4, vW.y * 2.9) + 7.0);
    float runnel = vnoise(vec2(h * 1.7, vW.y * 0.1));
    float band = smoothstep(0.58, 0.8, vnoise(vec2(h * 0.2, vW.y * 0.75 + n2 * 1.5)));
    alb *= mix(1.0, (0.3 + 0.95 * bead * (0.45 + 0.55 * bd.z)) * (0.5 + 1.0 * knob) * (0.5 + 0.8 * smoothstep(0.25, 0.75, runnel)), steep);
    alb = mix(alb, alb * 0.5 + vec3(0.17, 0.16, 0.13) * (0.3 + 0.7 * knob), band * steep * 0.55);
  }
  // dim blue from the ice, flickering like caustics from the fissures
  float ca = vnoise(vW.xz * 0.09 + uTime * vec2(0.19, 0.13)) * vnoise(vW.xz * 0.21 - uTime * vec2(0.11, 0.17) + 5.0);
  vec3 ice = uIceCol * uSun * (0.22 + 0.78 * max(n.y, 0.0)) * (0.6 + 2.6 * ca);
  vec3 col = alb * (ice + vLight);
  // glowing bacterial mats
  float mm = vFx.x;
  float matN = vnoise(p * 0.6 + 9.0) * 0.55 + n3 * 0.3 + n2 * 0.15;
  float matP = smoothstep(0.55, 0.8, matN + mm * 0.3) * smoothstep(0.08, 0.5, mm);
  float pulse = 0.62 + 0.38 * sin(uTime * 0.7 + n1 * 12.0 + vW.x * 0.05);
  col += uMatCol * (matP * pulse * (0.75 + 0.25 * crease) * (0.25 + 0.75 * n3) * (0.35 + 0.65 * mm));
  // vent mouths and glowing lava in the creases near vents
  float hot = vFx.y;
  col += uVentCol * (smoothstep(0.8, 1.0, hot) * 4.0 + hot * (1.0 - smoothstep(0.0, 0.07, vo.y)) * (0.4 + 0.6 * n2) * 3.6) * (0.75 + 0.25 * sin(uTime * 2.3 + n1 * 20.0));
  // away from the vents too the pillow lava is young in patches: embers in the creases, breathing slowly
  float em = smoothstep(0.55, 0.78, vnoise(p * 0.043 + 17.0)) * (1.0 - vFx.z) * (1.0 - smoothstep(0.25, 0.7, hot)) * max(n.y, 0.0);
  col += uVentCol * (em * (1.0 - smoothstep(0.0, 0.045, vo.y)) * (0.25 + 0.75 * n2) * 1.4 * (0.7 + 0.3 * sin(uTime * 0.9 + n1 * 25.0 + vo.z * 6.0)));
  // brine frost creeping over the sea bed
  if (vFx.w > 0.002) {
    float fa = vnoise(p * 0.8 + 4.0), fb = vnoise(p * 3.3 + 1.3), fc = vnoise(p * 8.5 + 2.0);
    float frost = smoothstep(0.78 - 0.5 * vFx.w, 1.1 - 0.42 * vFx.w, fa * 0.5 + fb * 0.32 + fc * 0.18 + 0.3 * vFx.w);   // soft patches, denser at the foot
    vec3 f2 = cell2(p * 2.4 + 4.0 + fb);
    float feather = smoothstep(0.5, 0.0, f2.x) * (0.4 + 0.6 * fc);                                                 // rosettes of crystals
    float glint = smoothstep(0.78, 0.95, fc * (0.6 + 0.4 * sin(uTime * 1.3 + f2.z * 40.0)));
    col += uFrostCol * vFx.w * (frost * (0.22 + 0.55 * feather + 0.5 * glint) + 0.03 + 0.1 * n3 * n1);
  }
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,Je=`
varying vec3 vW, vN;
#include <fog_pars_vertex>
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vW = wp.xyz; vN = normalize(mat3(modelMatrix) * normal);
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,$e=`
uniform vec3 uIceCol, uCrackCol, uLevPos, uLevCol, uPortalPos, uPortalCol;
uniform float uTime, uSun, uLevFall, uSeed, uFis;
uniform vec2 uEntry;
varying vec3 vW, vN;
${ge}
#include <fog_pars_fragment>
void main() {
  vec2 p = vW.xz + uSeed;
  vec2 wq = vec2(vnoise(p / 55.0), vnoise(p / 55.0 + 7.3));
  vec2 q = p / 27.0 + 0.6 * wq;
  vec3 v1 = cell2(q);                                        // plates
  float crack = 1.0 - smoothstep(0.0, 0.02, v1.y);
  float leak = exp(-v1.y * 9.0);
  vec3 v2 = cell2(q * 3.1 + 11.0);                           // crazing inside the plates
  float fine = 1.0 - smoothstep(0.0, 0.03, v2.y);
  float act = smoothstep(0.2, 0.65, vnoise(p / 75.0 + 21.0)); // where sunlight finds its way down the cracks
  vec2 de = vW.xz - uEntry;
  float thin = exp(-dot(de, de) / 2600.0);                   // the dip of ice ahead of the entry is thin: always lit, and it glows through
  act = max(act, sqrt(thin));
  // the great fissures: two families of long wandering lines
  float s1 = (p.x * 0.97 + p.y * 0.26) / 170.0 + 0.2 * wq.x + uFis, s2 = (p.y * 0.87 - p.x * 0.5) / 260.0 + 0.4 * wq.y;
  float fz = min(abs(fract(s1) - 0.5), abs(fract(s2) - 0.5) * 1.5);
  float fissure = 1.0 - smoothstep(0.0, 0.007, fz);
  float fglow = exp(-fz * 45.0);
  float cell = v1.z;
  float flick = 0.7 + 0.3 * sin(uTime * (0.5 + cell) + cell * 40.0);
  float shimmer = 0.55 + 0.9 * vnoise(p * 0.12 + uTime * vec2(0.23, 0.17));
  float facing = 0.5 + 0.5 * abs(normalize(vN).y);
  vec3 col = uIceCol * uSun * (0.022 + 0.055 * cell) * facing * shimmer * (0.55 + 0.9 * act);
  col += uCrackCol * uSun * shimmer * ((crack * 1.3 + leak * 0.22) * flick * (0.2 + 0.8 * act) + fine * 0.08 * act + fissure * 3.0 + fglow * 0.5);
  col += uCrackCol * uSun * shimmer * thin * (0.05 + 0.45 * leak + 0.16 * cell);
  vec3 d = uLevPos - vW;
  col += uIceCol * uLevCol * (0.007 + 0.13 * leak + 0.4 * crack + 0.016 * cell) / (1.0 + dot(d, d) * uLevFall);
  d = uPortalPos - vW;
  col += uIceCol * uPortalCol * 0.3 / (1.0 + dot(d, d) * 0.004);
  #ifdef FOG_EXP2
    float fd = fogDensity * vFogDepth * 0.8;                 // the glow of the cracks carries a little further
    col = mix(col, fogColor, 1.0 - exp(-fd * fd));
  #endif
  gl_FragColor = vec4(col, 1.0);
}`,_e=`
attribute float aT;
varying float vT, vT2; varying vec3 vW, vN; varying vec2 vUv2;
#include <fog_pars_vertex>
void main() {
  vec4 lp = vec4(position, 1.0); vec3 n = normal;
  #ifdef USE_INSTANCING
    lp = instanceMatrix * lp; n = mat3(instanceMatrix) * n;
  #endif
  vec4 wp = modelMatrix * lp;
  vW = wp.xyz; vN = normalize(mat3(modelMatrix) * n); vT = fract(aT); vT2 = floor(aT) * 0.01; vUv2 = uv;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Be=`
uniform vec3 uIceCol, uCrackCol, uLevPos, uLevCol, uPortalPos, uPortalCol;
uniform float uTime, uSun, uLevFall, uFlow;
varying float vT, vT2; varying vec3 vW, vN; varying vec2 vUv2;
${ge}
#include <fog_pars_fragment>
void main() {
  vec3 n = normalize(vN), v = normalize(cameraPosition - vW);
  float fres = max(1.0 - abs(dot(n, v)), 0.0); fres *= fres;
  vec3 col = uCrackCol * uSun * (exp(-vT * 3.2) * 0.9 + 0.04) * (0.45 + 0.9 * fres);
  col += uIceCol * uSun * (0.03 + 0.2 * fres);
  if (uFlow > 0.0) {                                         // the brine column: light and dense brine sinking inside it
    float a = abs(vUv2.x - 0.5) * 6.2831853;                 // mirrored, so there is no seam
    float f1 = vnoise(vec2(a * 2.2 + sin(vW.y * 0.2), vW.y * 0.2 + uTime * 1.8));      // veins of dense brine sinking
    float f2 = vnoise(vec2(a * 5.0, vW.y * 0.7 + uTime * 2.6));
    float veins = f1 * f1 * f1 * f1 * (0.5 + f2);
    vec3 pl = cell2(vec2(a * 2.6, vW.y * 0.3) + 3.0);                                  // frozen plates with bright seams
    float seam = 1.0 - smoothstep(0.0, 0.06, pl.y);
    float flute = vT2;                                                                 // 1 in the grooves between the flutes
    col *= (0.16 + 0.42 * pl.z) * (1.0 - 0.6 * flute);
    col += uCrackCol * uFlow * (0.012 + 3.4 * veins * (0.35 + 0.65 * flute) + 0.3 * seam * (0.4 + 0.6 * f2) + 0.22 * flute * f2) * (0.75 + 0.25 * sin(uTime * 0.8 - vW.y * 0.15));
    col += uIceCol * uFlow * (0.9 * fres * fres + 0.05 * pl.z);
  }
  vec3 d = uLevPos - vW;
  col += uIceCol * uLevCol * (0.25 + 0.5 * fres) / (1.0 + dot(d, d) * uLevFall);
  d = uPortalPos - vW;
  col += uIceCol * uPortalCol * (0.25 + 0.5 * fres) / (1.0 + dot(d, d) * 0.004);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,Qe=`
attribute vec4 aHang;                     // depth 0..1, length m, phase, metres along the curtain
uniform float uTime; uniform vec2 uCur;
varying vec4 vHang;
#include <fog_pars_vertex>
void main() {
  float v = aHang.x, len = aHang.y;
  vec3 p = position;
  p.y -= v * len;
  float sw = v * v * (0.9 + 0.12 * len);
  p.x += sin(uTime * 0.55 + aHang.z + v * 2.2 + aHang.w * 0.35) * sw + uCur.x * v * len * 0.22;
  p.z += cos(uTime * 0.43 + aHang.z * 1.7 + v * 1.7 + aHang.w * 0.27) * sw + uCur.y * v * len * 0.22;
  vHang = aHang;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,to=`
uniform vec3 uAlgaeA, uAlgaeB; uniform float uTime, uSun;
varying vec4 vHang;
${mt.GLSL_HASH}
#include <fog_pars_fragment>
void main() {
  float v = vHang.x, s = vHang.w * 2.4 + vHang.z;               // strands a few decimetres wide
  float id = floor(s), f = fract(s);
  float h = hash11(id * 1.37 + 0.11), h2 = hash11(id * 2.91 + 5.0);
  float reach = 0.3 + 0.7 * h;
  float prof = (1.0 - abs(f - 0.5) * 2.0) * (1.0 - v / reach * 0.75);
  if (v > reach || prof < 0.22 + 0.25 * h2) discard;
  float sh = 0.55 + 0.45 * sin(uTime * 1.1 + id * 2.0 - v * 7.0);
  vec3 col = mix(uAlgaeA, uAlgaeB, smoothstep(0.1, 1.0, v / reach) * (0.5 + 0.5 * h2));
  col *= (0.22 + 0.5 * uSun) * (0.4 + 0.9 * prof) * (0.6 + 0.6 * sh) * (1.0 + 1.6 * exp(-v * 5.0));
  gl_FragColor = vec4(min(col, vec3(1.5)), 1.0);                 // a strand one pixel wide never outshines the bloom threshold by much
  #include <fog_fragment>
}`,eo=`
attribute vec4 aBase;                     // x, top y, z, length m
attribute vec4 aShaft;                    // width m, phase, kind, lean
uniform float uTime;
varying vec3 vS; varying float vKind, vFar;
#include <fog_pars_vertex>
void main() {
  float ph = aShaft.y, lean = aShaft.w;
  vec3 axis = normalize(vec3(sin(ph * 5.0) * lean, -1.0, cos(ph * 3.0) * lean));
  vec3 c = aBase.xyz + axis * (position.y * aBase.w);
  vec3 cr = cross(axis, cameraPosition - c);
  vec3 right = cr * inversesqrt(max(dot(cr, cr), 1e-6));
  vec3 w = c + right * (position.x * aShaft.x * (0.55 + 0.9 * position.y));
  vS = vec3(position.x, position.y, ph); vKind = aShaft.z;
  vFar = smoothstep(5.0, 22.0, distance(cameraPosition, w));
  vec4 mvPosition = viewMatrix * vec4(w, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,oo=`
uniform vec3 uShaftA, uShaftB; uniform vec2 uGain; uniform float uTime;
varying vec3 vS; varying float vKind, vFar;
${mt.GLSL_HASH+mt.GLSL_VALUE_NOISE}
#include <fog_pars_fragment>
void main() {
  float x = vS.x, v = vS.y, e = max(1.0 - x * x, 0.0);
  float streak = 0.45 + 0.9 * vnoise(vec2(x * 3.2 + vS.z * 9.0, uTime * 0.35 + vS.z)) * vnoise(vec2(x * 7.5 - vS.z * 4.0, v * 2.0 - uTime * 0.22));
  float top = smoothstep(0.0, 0.05, v) * (1.0 - v) * (1.0 - v) * (0.35 + 0.65 * (1.0 - v));
  float bot = smoothstep(1.0, 0.9, v) * v * v * smoothstep(0.0, 0.45, v);
  vec3 col = vKind < 0.5 ? uShaftA * (top * uGain.x) : uShaftB * (bot * uGain.y);
  col *= e * e * streak * vFar;
  #ifdef FOG_EXP2
    float fd = fogDensity * vFogDepth * 0.62;
    col *= exp(-fd * fd);
  #endif
  gl_FragColor = vec4(col, 1.0);
}`,ao=`
attribute vec4 aCfg;                      // part (0 bell, 1 core, 2 strand), a, b, c
attribute vec4 aPos;                      // x, base y, z, rise height
attribute vec4 aParm;                     // size, phase, rise speed, seed
uniform float uTime, uMinAng;
varying vec4 vCfg; varying vec2 vUv2; varying vec3 vNrm, vView; varying float vFade, vSeed, vNear;
#include <fog_pars_vertex>
void main() {
  float seed = aParm.w, size = aParm.x;
  float f = fract(aParm.y + uTime * aParm.z / aPos.w);
  vFade = smoothstep(0.0, 0.07, f) * (1.0 - smoothstep(0.9, 1.0, f));
  float ph = uTime * (1.5 + seed * 1.1) + seed * 40.0;
  float beat = 0.5 + 0.5 * sin(ph);                          // 1 = contracted
  vec3 c = vec3(aPos.x, aPos.y + f * aPos.w, aPos.z);
  c.x += sin(uTime * 0.21 + seed * 17.0) * 1.3; c.z += cos(uTime * 0.17 + seed * 29.0) * 1.3;
  c.y += size * 0.4 * sin(ph - 1.2);
  vec3 toCam = cameraPosition - c; float dist = length(toCam); vec3 vd = toCam / max(dist, 0.001);
  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), vd)); vec3 up = cross(vd, right);
  vec3 lp; vec3 nrm = vd;
  vNear = smoothstep(7.0, 34.0, dist);
  vec4 cc = projectionMatrix * viewMatrix * vec4(c, 1.0);    // a lantern close beside the lens dissolves as it slides out of the picture: no bell is cut by the frame
  if (cc.w > 0.05 && dist < 30.0) {
    float er = clamp(size * 1.3 / dist, 0.04, 0.6);
    vFade *= 1.0 - smoothstep(1.0 - er * 1.1, 1.0 + er * 0.25, max(abs(cc.x), abs(cc.y)) / cc.w) * (1.0 - smoothstep(18.0, 30.0, dist));
  }
  if (aCfg.x < 0.5) {                                        // bell
    float w = aCfg.y;
    float sq = 1.0 - 0.27 * beat * w * w;
    lp = vec3(position.x * sq, position.y * (1.0 + 0.12 * beat) - 0.12 * w * beat, position.z * sq);
    lp.xz *= 1.0 + 0.06 * w * w * sin(aCfg.z * 8.0 + ph * 1.5);
    nrm = normalize(vec3(position.x, position.y * 1.3 + 0.2, position.z));
    lp *= size;
  } else if (aCfg.x < 1.5) {                                 // core
    float s = max(size * 3.0, dist * uMinAng);
    lp = vec3(0.0, size * 0.3, 0.0) + (right * position.x + up * position.y) * s;
  } else {                                                   // trailing strand
    float v = aCfg.y; float L = size * (2.8 + 2.0 * fract(aCfg.w * 7.7 + seed * 3.0));
    vec3 root = vec3(position.x, 0.0, position.z) * size * (1.0 - 0.27 * beat);
    vec3 sway = vec3(sin(ph * 0.7 - v * 3.5 + aCfg.w * 9.0), 0.0, cos(ph * 0.6 - v * 3.0 + aCfg.w * 5.0)) * (0.4 * size * v);
    vec3 cp = root * (1.0 - 0.4 * v) + vec3(0.0, -v * L - 0.12 * size, 0.0) + sway;
    float wdt = max(size * 0.06, dist * 0.0011) * (1.0 - 0.5 * v);
    lp = cp + right * (aCfg.z * wdt);
  }
  vec3 w = c + lp;
  vCfg = aCfg; vUv2 = position.xy; vSeed = seed; vNrm = nrm; vView = cameraPosition - w;
  vec4 mvPosition = viewMatrix * vec4(w, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,no=`
uniform vec3 uCore, uBell, uBead; uniform float uTime;
varying vec4 vCfg; varying vec2 vUv2; varying vec3 vNrm, vView; varying float vFade, vSeed, vNear;
#include <fog_pars_fragment>
void main() {
  vec3 col; float a;
  if (vCfg.x < 0.5) {
    float w = vCfg.y;
    float ndv = abs(dot(normalize(vNrm), normalize(vView)));
    float fres = pow(max(1.0 - ndv, 0.0), 2.2);
    float rb = 0.5 + 0.5 * cos(vCfg.z * 14.0), ribs = rb * rb * rb;
    float inner = pow(max(1.0 - w, 0.0), 1.4);
    float rim = smoothstep(0.86, 1.0, w);
    col = uBell * ((0.05 + 0.5 * fres + 0.1 * ribs * w + 0.45 * rim) * (0.55 + 0.45 * vNear)) + uCore * (0.5 * inner + 0.1 + (0.16 + 0.2 * (1.0 - vNear)) * ribs * (1.0 - w * 0.6));
    a = 0.1 + 0.4 * fres + 0.2 * rim + 0.08 * ribs;
  } else if (vCfg.x < 1.5) {
    float r2 = dot(vUv2, vUv2);
    float k = max(0.0, 1.0 - r2);                            // the skirt reaches zero smoothly at the quad's edge
    float g = exp(-r2 * 17.0) * 1.25 * k + 0.085 * k * k * k;
    float pul = 0.8 + 0.2 * sin(uTime * (1.5 + vSeed * 1.1) + vSeed * 40.0 + 1.0);
    col = (uCore * g * pul + vec3(1.0, 0.86, 0.6) * exp(-r2 * 74.0) * 0.55) * (0.3 + 0.7 * vNear);
    a = 0.0;
  } else {
    float v = vCfg.y;
    float bead = smoothstep(0.5, 1.0, sin(v * 24.0 - uTime * 2.2 + vCfg.w * 12.0 + vSeed * 6.0));
    float acr = 1.0 - abs(vCfg.z);
    col = (uBell * 0.14 * (1.0 - v) + uBead * bead * 2.4 * (1.0 - v * 0.6)) * (0.35 + 0.65 * acr);
    a = 0.14 * (1.0 - v) * acr;
  }
  float fa = 1.0, fe = 1.0;
  #ifdef FOG_EXP2
    float fd = fogDensity * vFogDepth;
    fa = exp(-fd * fd); fe = exp(-fd * fd * 0.45);           // the lights carry further than the membranes
  #endif
  gl_FragColor = vec4(col * vFade * fe, a * vFade * fa);
}`;function so(){const w=[],G=[],B=[];for(let T=0;T<=5;T++){const L=T/5,H=L*Math.PI*.5*1.14;for(let X=0;X<=10;X++){const V=X/10*Math.PI*2;w.push(Math.sin(H)*Math.cos(V),Math.cos(H)*.86,Math.sin(H)*Math.sin(V)),G.push(0,L,V,0)}}for(let T=0;T<5;T++)for(let L=0;L<10;L++){const H=T*11+L,X=H+1,V=H+10+1,O=V+1;B.push(H,V,X,X,V,O)}let W=w.length/3;for(const[T,L]of[[-1,-1],[1,-1],[1,1],[-1,1]])w.push(T,L,0),G.push(1,0,0,0);B.push(W,W+1,W+2,W,W+2,W+3),W+=4;const $=5,Q=4;for(let T=0;T<$;T++){const L=T/$*Math.PI*2+.4,H=Math.cos(L)*.72,X=Math.sin(L)*.72;for(let V=0;V<=Q;V++)for(const O of[-1,1])w.push(H,0,X),G.push(2,V/Q,O,T/$+.07);for(let V=0;V<Q;V++){const O=W+V*2;B.push(O,O+2,O+1,O+1,O+2,O+3)}W+=(Q+1)*2}const P=new r.BufferGeometry;return P.setAttribute("position",new r.Float32BufferAttribute(w,3)),P.setAttribute("aCfg",new r.Float32BufferAttribute(G,4)),P.setIndex(B),P}const io=`
attribute vec4 aCfg;                      // part (0 bell, 1 heart glow, 2 tentacle, 3 oral arm), a, b, c
attribute vec4 gPos;                      // x, y, z of the bell, bell radius
attribute vec4 gParm;                     // phase, seed, length of the tentacles, light
uniform float uTime;
varying vec4 vCfg; varying vec2 vUv2; varying vec3 vNrm, vView; varying float vSeed, vGain, vEdge;
#include <fog_pars_vertex>
void main() {
  float size = gPos.w, seed = gParm.y;
  float ph = uTime * (0.6 + 0.25 * seed) + gParm.x * 6.2832;
  float beat = 0.5 + 0.5 * sin(ph); beat = beat * beat * (3.0 - 2.0 * beat);      // 1 = contracted
  vec3 c = gPos.xyz;
  c.y += 0.16 * size * sin(ph - 1.3); c.x += sin(uTime * 0.11 + seed * 17.0) * 1.4; c.z += cos(uTime * 0.09 + seed * 29.0) * 1.4;
  vec3 toCam = cameraPosition - c; float dist = length(toCam); vec3 vd = toCam / max(dist, 0.001);
  float hl = max(length(vd.xz), 0.001);
  vec3 right = vec3(vd.z, 0.0, -vd.x) / hl; vec3 up = cross(vd, right);
  vec3 lp; vec3 nrm = vd;
  float edgeFade = 1.0;
  vec4 cc = projectionMatrix * viewMatrix * vec4(c, 1.0);    // passing out of the picture it dims instead of being cut by the frame
  if (cc.w > 0.05) {
    float er = clamp(size * 1.3 / dist, 0.04, 0.8);
    edgeFade = 1.0 - smoothstep(1.0 - er * 0.7, 1.0 + er * 0.45, max(abs(cc.x), abs(cc.y)) / cc.w) * (1.0 - smoothstep(40.0, 60.0, dist));
  }
  if (aCfg.x < 0.5) {                                        // bell
    float w = aCfg.y, w2 = w * w;
    float sq = 1.0 - 0.2 * beat * w2;
    lp = vec3(position.x * sq, position.y * (1.0 + 0.1 * beat) - 0.1 * w2 * beat, position.z * sq);
    lp.xz *= 1.0 + w2 * w2 * (0.045 * cos(aCfg.z * 14.0) + 0.03 * sin(aCfg.z * 5.0 + ph * 2.0));
    nrm = normalize(vec3(position.x, position.y * 1.3 + 0.2, position.z));
    lp *= size;
  } else if (aCfg.x < 1.5) {                                 // heart glow and halo
    lp = vec3(0.0, size * 0.22, 0.0) + (right * position.x + up * position.y) * (size * aCfg.y);
  } else if (aCfg.x < 2.5) {                                 // tentacle from the margin
    float v = aCfg.y; float L = gParm.z * (0.62 + 0.38 * fract(aCfg.w * 7.7 + seed * 3.0));
    vec3 root = vec3(position.x, -0.1, position.z) * size * (1.0 - 0.2 * beat);
    vec3 sway = vec3(sin(ph * 0.8 - v * 4.0 + aCfg.w * 9.0), 0.0, cos(ph * 0.7 - v * 3.4 + aCfg.w * 5.0)) * (0.2 * size * v);
    vec3 cp = root * (1.0 - 0.3 * v * (1.0 - v)) + vec3(0.0, -v * L - 0.05 * L * v * sin(ph - v * 3.0), 0.0) + sway;
    float wdt = max(size * 0.03, dist * 0.0012) * (1.0 - 0.55 * v);
    lp = cp + right * (aCfg.z * wdt);
  } else {                                                   // frilled oral arm from under the heart
    float v = aCfg.y; float L = gParm.z * (0.5 + 0.2 * fract(aCfg.w * 5.3 + seed * 7.0));
    vec3 root = vec3(position.x, 0.0, position.z) * size;
    vec3 sway = vec3(sin(ph * 0.6 - v * 2.6 + aCfg.w * 7.0), 0.0, cos(ph * 0.5 - v * 2.2 + aCfg.w * 11.0)) * (0.24 * size * v);
    vec3 cp = root * (1.0 + 0.8 * v) + vec3(0.0, 0.1 * size - v * L, 0.0) + sway;
    float tw = v * 5.0 + aCfg.w * 6.2832 + ph * 0.25;
    vec3 across = right * cos(tw) + vec3(right.z, 0.0, -right.x) * sin(tw);         // the ribbon turns as it hangs
    float wdt = size * 0.17 * (1.0 - 0.75 * v) * (0.8 + 0.2 * sin(v * 26.0 - ph * 2.0));
    lp = cp + across * (aCfg.z * wdt);
  }
  vec3 w = c + lp;
  vCfg = aCfg; vUv2 = position.xy; vSeed = seed; vNrm = nrm; vView = cameraPosition - w; vGain = gParm.w * (0.85 + 0.15 * (1.0 - beat)); vEdge = edgeFade;
  vec4 mvPosition = viewMatrix * vec4(w, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ro=`
uniform vec3 uCore, uBell, uBead, uBead2; uniform float uTime;
varying vec4 vCfg; varying vec2 vUv2; varying vec3 vNrm, vView; varying float vSeed, vGain, vEdge;
#include <fog_pars_fragment>
void main() {
  vec3 col; float a;
  if (vCfg.x < 0.5) {
    float w = vCfg.y, ang = vCfg.z;
    float ndv = abs(dot(normalize(vNrm), normalize(vView)));
    float fres = 1.0 - ndv; fres = fres * fres;
    float cn = 0.5 + 0.5 * cos(ang * 16.0); cn = cn * cn; cn = cn * cn; cn = cn * cn;                 // sixteen radial canals
    float canal = cn * smoothstep(0.1, 0.3, w) * (0.55 + 0.45 * sin(w * 9.0 - uTime * 1.4 + vSeed * 9.0));   // light running out to the margin
    float ring = smoothstep(0.06, 0.0, abs(w - 0.86));                                                  // the ring canal
    float gon = smoothstep(0.1, 0.0, abs(w - 0.34 - 0.1 * cos(ang * 4.0))) * smoothstep(-0.2, 0.6, cos(ang * 4.0));   // four horseshoes round the heart
    float inner = max(1.0 - w, 0.0); inner = inner * sqrt(inner);
    float margin = smoothstep(0.93, 1.0, w);
    float bd = 0.5 + 0.5 * cos(ang * 32.0); bd = bd * bd * bd;
    float beads = bd * margin * (0.35 + 0.65 * (0.5 + 0.5 * sin(ang * 3.0 - uTime * 1.3 + vSeed * 20.0)));
    col = uBell * (0.02 + 0.3 * fres + 0.22 * margin) + uCore * ((0.1 * inner + 0.62 * canal * (1.0 - 0.4 * w) + 0.3 * ring + 0.7 * gon) * vGain) + uBead2 * (beads * 2.4);
    a = 0.07 + 0.36 * fres + 0.16 * margin + 0.14 * cn + 0.2 * gon;
  } else if (vCfg.x < 1.5) {
    float r2 = dot(vUv2, vUv2), k = max(0.0, 1.0 - r2);
    float g = vCfg.z < 0.5 ? exp(-r2 * 8.0) * 0.6 * k : 0.035 * k * k * k;
    col = (uCore * g + vec3(1.0, 0.88, 0.66) * (vCfg.z < 0.5 ? exp(-r2 * 40.0) * 0.3 : 0.0)) * vGain;
    a = 0.0;
  } else if (vCfg.x < 2.5) {
    float v = vCfg.y;
    float bead = smoothstep(0.55, 1.0, sin(v * 30.0 - uTime * 2.0 + vCfg.w * 12.0 + vSeed * 6.0));
    float acr = 1.0 - abs(vCfg.z);
    col = (uBell * 0.12 * (1.0 - v) + uCore * 0.22 * (1.0 - v) + mix(uBead, uBead2, smoothstep(0.15, 0.7, v)) * bead * 2.3 * (1.0 - v * 0.5)) * (0.35 + 0.65 * acr);
    a = 0.16 * (1.0 - v) * acr;
  } else {
    float v = vCfg.y, s = vCfg.z;
    float edge = smoothstep(0.55, 1.0, abs(s));
    float frill = 0.5 + 0.5 * sin(v * 60.0 + s * 5.0 - uTime * 1.6 + vCfg.w * 9.0);
    float fadeT = (1.0 - v) * smoothstep(0.0, 0.06, v);
    col = (uCore * (0.42 * (1.0 - edge) + 0.5 * edge * frill) + uBead * (0.9 * edge * frill * frill)) * fadeT * vGain + uBell * 0.05 * fadeT;
    a = (0.22 + 0.2 * edge * frill) * fadeT;
  }
  float fa = 1.0, fe = 1.0;
  #ifdef FOG_EXP2
    float fd = fogDensity * vFogDepth;
    fa = exp(-fd * fd); fe = exp(-fd * fd * 0.4);
  #endif
  gl_FragColor = vec4(col * (fe * vEdge), a * fa * vEdge);
}`;function lo(){const w=[],G=[],B=[];for(let P=0;P<=8;P++){const T=P/8,L=T*Math.PI*.5*1.18;for(let H=0;H<=28;H++){const X=H/28*Math.PI*2;w.push(Math.sin(L)*Math.cos(X),Math.cos(L)*.8,Math.sin(L)*Math.sin(X)),G.push(0,T,X,0)}}for(let P=0;P<8;P++)for(let T=0;T<28;T++){const L=P*29+T,H=L+1,X=L+28+1,V=X+1;B.push(L,X,H,H,X,V)}let W=w.length/3;for(const[P,T]of[[.9,0],[3.6,1]]){for(const[L,H]of[[-1,-1],[1,-1],[1,1],[-1,1]])w.push(L,H,0),G.push(1,P,T,0);B.push(W,W+1,W+2,W,W+2,W+3),W+=4}const $=(P,T,L,H,X)=>{for(let V=0;V<T;V++){const O=V/T*Math.PI*2+X,ft=Math.cos(O)*H,Wt=Math.sin(O)*H;for(let nt=0;nt<=L;nt++)for(const Y of[-1,1])w.push(ft,0,Wt),G.push(P,nt/L,Y,V/T+.031);for(let nt=0;nt<L;nt++){const Y=W+nt*2;B.push(Y,Y+2,Y+1,Y+1,Y+2,Y+3)}W+=(L+1)*2}};$(2,20,8,.93,.2),$(3,6,12,.2,.5);const Q=new r.BufferGeometry;return Q.setAttribute("position",new r.Float32BufferAttribute(w,3)),Q.setAttribute("aCfg",new r.Float32BufferAttribute(G,4)),Q.setIndex(B),Q}const me=(w,G,B)=>{const N=Ut(.5+.5*(G-w)/B,0,1);return gt(G,w,N)-B*N*(1-N)},Ie=(w,G,B)=>-me(-w,-G,B);function Re(w,G,B,N,E,W,$,Q,P,T,L={}){const H=G.range(-.1,.1),X=G.range(-.1,.1),V=G()*6.283,O=G.range(.4,1.6),ft=G.range(3.2,5.5),Wt=G()*6.283,nt=G.range(.85,1.2),Y=G()*50,Dt=w.pos.length/3,Rt=L.hot??1,Ot=L.crust??1;let Tt=N,wt=E,ut=Q;for(let tt=0;tt<=T;tt++){const I=tt/T,st=W-3+I*($+3),At=Q*(.3+.7*Math.pow(1-I,1.25))*(1+.95*Math.exp(-I*7))*(1+.16*Math.sin(I*8.5+Wt*1.7)*(1-I)),A=Math.pow(Math.max(0,Math.sin(I*$/ft*6.283+Wt)),4);Tt=N+H*I*$+Math.cos(V)*O*Math.sin(I*3.1)*Q*.5,wt=E+X*I*$+Math.sin(V)*O*Math.sin(I*3.1)*Q*.5;for(let Z=0;Z<P;Z++){const U=Z/P*6.283185,kt=Math.cos(U),_=Math.sin(U),it=B.fbm3(kt*1.4+Y,st*.16,_*1.4+Y,3),Lt=Math.max(0,B.n3(kt*3.1+Y,st*.45,_*3.1-Y)),vt=.09*Math.sin(U*7+it*4+Y)*(1-I*.5),q=B.n3(kt*5.5-Y,st*.85,_*5.5+Y),Et=At*(1+.5*A*(.3+.7*(.5+.5*it)))*(1+.42*it+.42*Lt*Lt+vt+.13*q);w.pos.push(Tt+kt*Et*nt,st,wt+_*Et),L.ledges&&A>.7&&I>.06&&I<.86&&G()<L.ledges&&w.ledges.push([Tt+kt*Et*nt*.93,st,wt+_*Et*.93,L.big?1:0]),w.ao.push(Ut((.42*it+.42*Lt*Lt+vt+.13*q+.3*A+.3)/.62,0,1));const Xt=Math.max(0,B.n3(kt*2.2-Y,st*.3,_*2.2+Y)-.5)*2.4*(1-I*.6);w.fx.push(0,Rt*Math.min(.7,Xt*Xt+(I>.965?.5:0)),Ot*Ut(.35+.5*it+.5*A+I*.3,0,1),0),ut=At}}const lt=W+$;for(let tt=0;tt<P;tt++){const I=tt/P*6.283185;w.pos.push(Tt+Math.cos(I)*ut*.55*nt,lt-1.6,wt+Math.sin(I)*ut*.55),w.fx.push(0,Rt,Ot,0),w.ao.push(1)}w.pos.push(Tt,lt-2.4,wt),w.fx.push(0,Rt,Ot,0),w.ao.push(1);for(let tt=0;tt<=T;tt++)for(let I=0;I<P;I++){const st=Dt+tt*P+I,At=Dt+tt*P+(I+1)%P,A=st+P,Z=At+P;w.idx.push(st,A,At,At,A,Z)}const Mt=Dt+(T+1)*P,Ct=Mt+P;for(let tt=0;tt<P;tt++)w.idx.push(Mt+tt,Ct,Mt+(tt+1)%P);return[Tt,lt,wt]}var vo={id:"lanterns-under-ice",name:"Lanterns under the Ice",category:"alien",weirdness:.55,async build(w){const G=w.rng,B=w.noise,N=new r.Scene,E=G.fork("variation"),W=E.pick(["polar night","twilight","noon above"]),$=W==="polar night"?.68:W==="twilight"?.92:1.2,Q=E.sign(),P=E.range(.8,1.2)*Q,T=E.range(-.035,.06),L=E.range(0,.4),H=Math.round(E.range(300,400)*(W==="polar night"?1.15:1)),X=E.range(.55,1.5),V=E.range(-.7,.7),O=E.range(.5,1.3),ft=new r.Vector3(-Math.cos(V),0,Math.sin(V)),Wt=E.chance(.6),nt=E.int(2,3),Y=E.sign(),Dt=E.range(.37,.42),Rt=E.range(.74,.8),Ot=E.range(34,46),Tt=E.int(2,4),wt=E.range(29,33),ut=["#9fe8ff","#1c6f8f","#0a2f4f","#04121f","#010409","#19ffd0","#ff7a3c"],lt=new r.Color(ut[0]).offsetHSL(T,0,0),Mt=new r.Color("#22e6d2").offsetHSL(T*1.6,0,0),Ct=new r.Color(ut[6]).lerp(new r.Color("#ff3f6c"),L),tt=new r.Color(ut[5]),I=new r.Color("#ffb060").lerp(new r.Color(E.chance(.5)?"#ff8f6a":"#ffcf6a"),E.range(0,.45)),st=new r.Color("#bfeeff"),At=new r.Color("#04192b").multiplyScalar(.72+.3*$);N.fog=new r.FogExp2(At,.0085),N.background=At.clone();const A=Ue([[-34*P,45,0],[-34*P,44.5,-55],[-27*P,38,-115],[-9*P,27.5,-178],[13*P,20.5,-245],[26*P,17.5,-320],[30*P,17,-400],[30*P,17,-470],[30*P,17.5,-540],[22*P,19,-610],[8*P,21,-678],[0,22,-740],[0,22,-770],[0,22,-800]]),Z=Fe.pathNearest(A),U=A.end.clone(),kt=300,_=await Oe(w,{palette:ut,lightPower:kt,progress:.15});{const e=A.pointAt(Le),n=A.tangentAt(Le);_.object.position.copy(e),_.object.rotation.y=Math.atan2(n.x,n.z)+Math.PI,_.object.updateMatrixWorld(!0),N.add(_.object),_.light&&(_.light.decay=1)}await w.yield();const it=[];for(let e=-600;e<=420;e+=12)it.push(_.trackPoint(e,new r.Vector3).applyMatrix4(_.object.matrixWorld));const Lt={dist:0,y:0},vt=(e,n)=>{let g=1e12,u=0;for(let v=0;v<it.length;v++){const s=it[v].x-e,l=it[v].z-n,p=s*s+l*l;p<g&&(g=p,u=v)}return Lt.dist=Math.sqrt(g),Lt.y=it[u].y,Lt},q=[],Et=A.pointAt(Rt),Xt=A.tangentAt(Rt),R={x:Et.x+Xt.z*19*Y*-1,z:Et.z-Xt.x*19*Y*-1};{const n=A.pointAt(.212),g=A.tangentAt(.212);q.push({x:n.x+g.z*14,z:n.z-g.x*14,H:Ot,R:4.4,active:!0,hero:!0,seg:44,rings:76});for(let s=0;s<6;s++){const l=(s+.5)/6*Math.PI*2;q.push({x:U.x+Math.sin(l)*wt,z:U.z+Math.cos(l)*wt,H:E.range(27,44),R:E.range(3,4),active:!0,ring:!0,seg:26,rings:40})}for(const[s,l,p]of[[.275,44,80],[.345,52,90],[.645,26,112],[.705,26,116],[.765,26,116],[.825,30,110]]){const t=A.pointAt(s),i=A.tangentAt(s);for(let a=l+E.range(0,6);a<=p;a+=5){const o=t.x+i.z*a,f=t.z-i.x*a;if(!(Z(o,f).dist<24||vt(o,f).dist<46)&&!(Math.hypot(o-R.x,f-R.z)<26||Math.hypot(o-U.x,f-U.z)<wt+24)&&!q.some(c=>Math.hypot(c.x-o,c.z-f)<24)){q.push({x:o,z:f,H:E.range(26,40),R:E.range(3,3.9),active:!0,far:!0,seg:22,rings:34,lat:a});break}}}const u=G.fork("chimneys");for(let s=0;s<400&&q.length<28;s++){const l=u.range(.04,.9),p=u.sign(),t=u.range(p>0?30:24,78),i=A.pointAt(l),a=A.tangentAt(l),o=i.x-a.z*t*p,f=i.z+a.x*t*p;if(Z(o,f).dist<23||Math.hypot(o-R.x,f-R.z)<30||Math.hypot(o-U.x,f-U.z)<wt+28||q.some(b=>Math.hypot(b.x-o,b.z-f)<24))continue;let c=u.range(20,50);const y=vt(o,f);y.dist<55&&(c=Math.min(c,y.y-30),c<14)||q.push({x:o,z:f,H:c,R:c*u.range(.085,.11),active:!1,seg:16,rings:22,lat:t})}{const s=A.pointAt(.385),l=A.tangentAt(.385),p=s.x-l.z*16,t=s.z+l.x*16,i=q.find(a=>Math.hypot(a.x-p,a.z-t)<20);i?i.fishy=!0:q.push({x:p,z:t,H:34,R:3.3,active:!0,far:!0,fishy:!0,seg:28,rings:44,lat:99})}q.filter(s=>!s.hero&&!s.ring&&!s.far).sort((s,l)=>s.lat-l.lat).slice(0,8).forEach(s=>{s.active=!0})}const re=(e,n)=>{const g=Z(e,n),u=g.dist,v=g.y;let s=1.5+2.6*B.fbm2(e*.011+3,n*.011,3);s+=9*Math.pow(Math.max(0,B.fbm2(e*.019+40,n*.019-17,3)),1.3);const l=et(46,150,u+16*B.n2(e*.009,n*.009));s+=l*(44+28*B.fbm2(e*.0075+9,n*.0075+2,3));const p=1-Math.abs(B.n2(e*.045,n*.045));s+=p*p*(1.4+4*l);const t=Math.hypot(e-U.x,n-U.z);return s=gt(3.5+.4*(s-3.5),s,et(34,75,t)),me(s,v-15+Math.max(0,u-8)*.6,6)},we=(e,n,g)=>{const u=vt(n,g);return u.dist<90?me(e,u.y-27+et(34,90,u.dist)*70,5):e};for(const e of q)e.y=we(re(e.x,e.z),e.x,e.z),e.far&&(e.H=Math.min(58,Math.max(e.H,Z(e.x,e.z).y+5-e.y)),e.R=Math.max(e.R,e.H*.085));let ye=0;const ht=(e,n)=>{let g=re(e,n);for(let v=0;v<q.length;v++){const s=q[v],l=e-s.x,p=n-s.z,t=l*l+p*p,i=s.R*3.6;t<i*i*6&&(g+=s.H*.13*Math.exp(-t/(i*i)))}const u=we(g,e,n);return ye=g-u,u},xt=A.pointAt(.135),dt=(e,n)=>{const g=Z(e,n),u=g.dist;let v=63+7*B.fbm2(e*.006+50,n*.006+20,3)-15*Math.pow(B.ridged2(e*.008+7,n*.008-3,3),2);const s=Math.hypot(e-R.x,n-R.z);v-=15*Math.exp(-s*s/500),v-=14*Math.exp(-((e-xt.x)*(e-xt.x)+(n-xt.z)*(n-xt.z))/2400),v=Ie(v,g.y+17-Math.max(0,u-12)*.5,4);const l=vt(e,n);return l.dist<95&&(v=Ie(v,l.y+24-et(32,95,l.dist)*70,5)),v},$t=[],le=(e,n,g,u,v,s)=>{let l=0;for(let p=0;p<$t.length;p++){const t=$t[p],i=t[0]-e,a=t[1]-n,o=t[2]-g,f=i*i+a*a+o*o;f>4e4||(l+=t[3]*Math.max(0,(u*i+v*a+s*o)/Math.sqrt(f+.01)*.65+.35)/(1+f*.006))}return l},rt={uTime:{value:0},uSun:{value:$},uVentCol:{value:Ct.clone().multiplyScalar(2.3)},uLevPos:{value:new r.Vector3(0,-500,0)},uLevCol:{value:new r.Color(0,0,0)},uLevFall:{value:1/9025},uPortalPos:{value:U.clone()},uPortalCol:{value:st.clone().multiplyScalar(.6)},uIceCol:{value:lt.clone().lerp(new r.Color(ut[1]),.35)},uCrackCol:{value:Mt},uMatCol:{value:tt.clone().multiplyScalar(.5)},uFrostCol:{value:lt.clone().lerp(Mt,.4).multiplyScalar(.9)},uSeed:{value:E.range(0,400)},uFlow:{value:0},uFis:{value:0},uEntry:{value:new r.Vector2(xt.x,xt.z)}};rt.uFis.value=.5-(((xt.x+rt.uSeed.value)*.97+(xt.z+rt.uSeed.value)*.26)/170+.1),rt.uLanCol={value:I.clone().multiplyScalar(1.5)},rt.uLampPos={value:new r.Vector3(0,-500,0)},rt.uLampCol={value:new r.Color(0,0,0)};const xe=[],Qt=[],_t=(e,n,g={},u={})=>new r.ShaderMaterial({uniforms:{...r.UniformsUtils.clone(r.UniformsLib.fog),...rt,...g},vertexShader:e,fragmentShader:n,fog:!0,...u}),ce=_t(Ke,Ze,{},{side:r.DoubleSide}),Nt={value:0},Bt=mt.fxGroup();N.add(Bt.object);const Yt=[],be=[];{const e={pos:[],fx:[],idx:[],ao:[],ledges:be},n=G.fork("spires"),g=(t,i,a,o)=>{$t.length<Xe&&$t.push([t,i,a,o])};for(const t of q){t.H=Math.max(7,Math.min(t.H,dt(t.x,t.z)-t.y-6));const i=t.active?1:.12,a=t.active?1:.55,o=Re(e,n,B,t.x,t.z,t.y,t.H,t.R,t.seg,t.rings,{hot:i,crust:a,ledges:t.hero?.13:.02,big:t.hero});if(t.top=o,t.hero){const m=A.pointAt(.2),x=m.x-t.x,C=m.z-t.z,h=Math.hypot(x,C);for(const[M,k]of[[.3,.5],[.6,.55],[.82,.38]])g(t.x+x/h*(t.R+4.5),t.y+t.H*M,t.z+C/h*(t.R+4.5),k)}t.active&&(Yt.push([o[0],o[1],o[2],t]),g(o[0],o[1]+1.5,o[2],t.ring?.6:n.range(1,1.5)));const f=Z(t.x,t.z),c=A.pointAt(f.u),y=Math.atan2(t.z-c.z,t.x-c.x),b=t.hero?Tt:t.ring?1:n.int(1,2);let z=y,d=t.R*1.5;for(let m=0;m<b;m++){const x=y+n.range(-1.3,1.3),C=t.R*n.range(1,1.9),h=t.H*n.range(.28,.62),M=t.x+Math.cos(x)*C,k=t.z+Math.sin(x)*C,S=Re(e,n,B,M,k,t.y,h,t.R*n.range(.45,.7),Math.max(10,Math.round(t.seg*.6)),Math.max(12,Math.round(t.rings*.6)),{hot:i,crust:a});m===0&&(z=x,d=C,t.hero&&Yt.push([S[0],S[1],S[2],null]))}g(t.x-Math.cos(z)*d*1.4,t.y+3.5,t.z-Math.sin(z)*d*1.4,t.ring?.3:t.active?n.range(.55,.9):.25),await w.yield()}const u=[];for(let t=-120;t>=-310;t-=38){const i=it[Math.round((t+600)/12)],a=i.x+n.range(-12,12),o=i.z+n.range(-8,8),f=i.y-27;re(a,o)-f<8||(g(a,f+5,o,1.5),u.push([a,f+4,o]))}u.length&&Bt.add(mt.makeGlows({rng:n.fork("rift"),time:Nt,positions:u,color:Ct.clone().lerp(new r.Color("#ffd0a0"),.2),size:34,sizeJitter:.3,intensity:.5,flicker:.3,halo:1,core:.12,fogAmount:.5}));const v=new r.BufferGeometry;v.setAttribute("position",new r.Float32BufferAttribute(e.pos,3)),v.setAttribute("aFx",new r.Float32BufferAttribute(e.fx,4)),v.setIndex(e.idx),await w.yield(),v.computeVertexNormals(),await w.yield();{const t=v.attributes.position,i=v.attributes.normal,a=new Float32Array(t.count*2);for(let o=0;o<t.count;o++)a[o*2]=le(t.getX(o),t.getY(o),t.getZ(o),i.getX(o),i.getY(o),i.getZ(o))*(.3+.7*e.ao[o]),o%4e3===3999&&await w.yield();v.setAttribute("aBake",new r.BufferAttribute(a,2)),Qt.push({bake:a,pos:t.array,nor:i.array,ao:e.ao})}const s=new r.Mesh(v,ce);s.frustumCulled=!1,s.name="chimneys",N.add(s),await w.yield();const l=G.fork("smoke");for(const[t,i,a,o]of Yt){if(!o)continue;const f=new r.Vector3(U.x-t,6,U.z-a).normalize(),c=mt.makeSmokeColumn({rng:l.fork("s"),time:Nt,position:[t,i-.5,a],count:o.hero?72:o.ring?64:46,height:Math.max(14,Math.min(o.hero?34:o.ring?50:40,dt(t,a)-i-1)),radius:[o.R*.3,o.R*(o.ring?1.2:1.7)],size:o.ring?[o.R*.7,o.R*3]:[o.R*.9,o.R*4.2],color:o.ring?"#0c1319":o.far?"#13232a":"#0d1218",colorTop:o.ring?"#17232d":o.far?"#1c373d":"#151d26",shadowColor:"#020407",ambient:"#03060a",sunDir:o.ring?f:[.2,1,.1],sunColor:o.ring?st.clone().multiplyScalar(.45):lt.clone().multiplyScalar(.35*$),hot:Ct.clone().multiplyScalar(o.hero?2.8:2.2),hotFalloff:15,opacity:o.far?.62:.82,rate:l.range(.04,.06),wind:[ft.x,0,ft.z],bend:(o.ring?.12:.3)*O,rim:.5});Bt.add(c),xe.push({amb:c.uniforms.uAmbient.value,amb0:c.uniforms.uAmbient.value.clone(),col:c.uniforms.uColor.value,col0:c.uniforms.uColor.value.clone(),top:c.uniforms.uColorTop.value,top0:c.uniforms.uColorTop.value.clone(),sh:c.uniforms.uShadow.value,sh0:c.uniforms.uShadow.value.clone()})}const p=Yt.map(t=>[t[0],t[1]+.6,t[2]]);Bt.add(mt.makeGlows({rng:l.fork("g"),time:Nt,positions:p,color:Ct.clone().lerp(new r.Color("#ffd0a0"),.25),size:9,sizeJitter:.3,intensity:1.5,flicker:.35,halo:1,core:.7,fogAmount:.55}))}await w.yield();const jt=-244,te=244,St=-984,ee=92,Pt=4,fe=[],ze=(e,n,g,u,v,s,l)=>{const p=Math.round(120/v);for(let t=0;t<u-1;t+=p){const i=Math.min(u-1,t+p),a=new r.BufferGeometry;for(const y in e)a.setAttribute(y,e[y]);a.setIndex(new r.BufferAttribute(n.subarray(t*(g-1)*6,i*(g-1)*6),1));const o=St+(t+i)*.5*v,f=(i-t)*.5*v;a.boundingSphere=new r.Sphere(new r.Vector3((jt+te)/2,30,o),Math.hypot((te-jt)/2,f,70));const c=new r.Mesh(a,s);c.name=l,N.add(c),fe.push({object:c,z:o,half:f,reach:l==="seabed"?265:350})}},K=Math.round((te-jt)/Pt)+1,pt=Math.round((ee-St)/Pt)+1;{const e=new Float32Array(K*pt),n=new Float32Array(K*pt);for(let t=0;t<pt;t++){for(let i=0;i<K;i++)e[t*K+i]=ht(jt+i*Pt,St+t*Pt),n[t*K+i]=ye;t%24===23&&await w.yield()}const g=new Float32Array(K*pt*3),u=new Float32Array(K*pt*3),v=new Float32Array(K*pt*4),s=new Float32Array(K*pt*2);for(let t=0;t<pt;t++){t%16===15&&await w.yield();for(let i=0;i<K;i++){const a=t*K+i,o=jt+i*Pt,f=St+t*Pt,c=e[a];g[a*3]=o,g[a*3+1]=c,g[a*3+2]=f;const y=e[t*K+Math.min(K-1,i+1)]-e[t*K+Math.max(0,i-1)],b=e[Math.min(pt-1,t+1)*K+i]-e[Math.max(0,t-1)*K+i],z=1/Math.hypot(y,2*Pt,b);u[a*3]=-y*z,u[a*3+1]=2*Pt*z,u[a*3+2]=-b*z;let d=Math.max(0,B.n2(o*.021+70,f*.021-30)-.45)*1.3,m=0,x=0;for(let h=0;h<q.length;h++){const M=q[h],k=o-M.x,S=f-M.z,F=k*k+S*S;if(F>3600)continue;const j=Math.exp(-F/(M.R*M.R*22));d+=j*.85,x+=Math.exp(-F/(M.R*M.R*9)),M.active&&(m+=Math.exp(-F/(M.R*M.R*4.5))*.75)}if(n[a]>3){const h=vt(o,f).dist,M=et(3,14,n[a]);d=Math.max(d,.9*M*et(24,40,h)*(1-et(64,84,h))),m+=.4*M*(1-et(10,40,h))*(.4+.6*et(-.3,.3,B.n2(o*.03+5,f*.03+8)))}const C=Math.hypot(o-R.x,f-R.z);v[a*4]=Math.min(1,d),v[a*4+1]=Math.min(.5,m),v[a*4+2]=Math.min(1,x),v[a*4+3]=Math.exp(-C*C/300),s[a*2]=le(o,c,f,u[a*3],u[a*3+1],u[a*3+2])}}await w.yield();const l=new Uint32Array((K-1)*(pt-1)*6);let p=0;for(let t=0;t<pt-1;t++)for(let i=0;i<K-1;i++){const a=t*K+i,o=a+1,f=a+K,c=f+1;l[p++]=a,l[p++]=f,l[p++]=o,l[p++]=o,l[p++]=f,l[p++]=c}ze({position:new r.BufferAttribute(g,3),normal:new r.BufferAttribute(u,3),aFx:new r.BufferAttribute(v,4),aBake:new r.BufferAttribute(s,2)},l,K,pt,Pt,ce,"seabed"),Qt.push({bake:s,pos:g,nor:u})}await w.yield();{const e=G.fork("rocks"),n=Fe.rockGeometry({rng:e,kind:"boulder",radius:1,detail:1});n.setAttribute("aFx",new r.BufferAttribute(new Float32Array(n.attributes.position.count*4),4));const g=240,u=new r.InstancedMesh(n,ce,g),v=new r.Matrix4,s=new r.Quaternion,l=new r.Euler,p=new r.Vector3,t=new r.Vector3,i=new Float32Array(g*2),a=new Float32Array(g*3),o=new Float32Array(g*3);let f=0;for(let c=0;c<g*8&&f<g;c++){const y=e.range(0,1),b=e.range(11,85)*e.sign(),z=A.pointAt(y),d=A.tangentAt(y),m=z.x-d.z*b,x=z.z+d.x*b,C=ht(m,x),h=.9+4.2*Math.pow(e(),2.2);C+h*1.2>Z(m,x).y-8||(l.set(e.range(-.3,.3),e()*6.283,e.range(-.3,.3)),s.setFromEuler(l),p.set(h*e.range(1,1.5),h*e.range(.55,.85),h*e.range(1,1.5)),t.set(m,C+h*.12,x),i[f*2]=le(m,C+h,x,0,1,0),a.set([m,C+h,x],f*3),o[f*3+1]=1,u.setMatrixAt(f++,v.compose(t,s,p)))}n.setAttribute("aBake",new r.InstancedBufferAttribute(i,2)),Qt.push({bake:i,pos:a.subarray(0,f*3),nor:o}),u.count=f,u.instanceMatrix.needsUpdate=!0,u.frustumCulled=!1,u.name="boulders",N.add(u)}await w.yield(),N.add(new r.HemisphereLight(lt.clone().lerp(new r.Color(ut[1]),.5),Ct.clone().multiplyScalar(.35),.5*$+.25));const Ht=q[0],Ft=new r.PointLight(Ct,300,110,1);{const e=A.pointAt(.212);Ft.position.set(gt(Ht.x,e.x,.45),Ht.y+10,gt(Ht.z,e.z,.45))}const Me=new r.PointLight(st,3200,150,2);Me.position.copy(U).add(new r.Vector3(0,2,6)),N.add(Ft,Me);const Ee=Ft.position.clone(),Ce=It.makeWind({direction:[ft.x,ft.z],speed:.4,strength:1.3*O,gustScale:.03,gustiness:.4}),qt=[];{const e=G.fork("flora");await w.yield();const n=It.windMaterial({wind:Ce,backlight:0,ambient:1.6,leafAmbient:1.6,detail:.1,glow:1}),g=(a,o)=>It.tendrilGeometry({rng:e.fork("w"),detail:a,height:3.4,curl:.22,flex:1.2,...o}),u=[{base:"#6a625c",mid:"#e9e2d6",tip:"#ff2f45",glow:1.25,count:9},{base:"#5a1a22",mid:"#c8283a",tip:"#ff6a5a",glow:1,count:8},{base:"#77706a",mid:"#f4efe6",tip:"#ffd9c8",glow:.9,count:10}],v=[],s=[];await w.yield();for(const a of u)v.push(g(1,a)),await w.yield();for(const a of u)s.push(g(0,a)),await w.yield();const l=[];for(const a of q){const o=a.hero?28:a.ring?6:a.active?9:5;for(let f=0;f<o;f++){const c=e()*6.283,y=a.R*e.range(1.5,a.hero?4.2:3.6),b=a.x+Math.cos(c)*y,z=a.z+Math.sin(c)*y,d=Z(b,z);d.dist<7.5||l.push({x:b,y:ht(b,z),z,s:e.range(.6,1.45)*(a.hero?1.25:1),rot:e()*6.283,d:d.dist,u:d.u,v:e.int(0,2)})}}const p=[];for(const a of be){const o=Z(a[0],a[2]);p.push({x:a[0],y:a[1],z:a[2],s:a[3]?e.range(.6,1.05):e.range(.4,.8),rot:e()*6.283,d:o.dist,u:o.u,v:e.int(0,2)})}for(let a=p.length-1;a>=0;a--){const o=p[a];Math.hypot(o.x-Ft.position.x,o.y-Ft.position.y,o.z-Ft.position.z)<7.5&&p.splice(a,1)}await w.yield();const t=[];for(const a of u)t.push(g(0,{...a,count:5})),await w.yield();qt.push(It.makeScatter({rng:e.fork("ledge"),points:p,variants:t,chunks:4,cullDistance:190,material:n,tint:.15,hue:.03,sink:.05,tilt:.3})),await w.yield(),qt.push(It.makeScatter({rng:e.fork("worms"),points:l,variants:v,farVariants:s,farDistance:15,chunks:5,cullDistance:205,material:n,tint:.15,hue:.03,sink:.05,tilt:.12})),await w.yield(),await w.yield();const i=(a,o,f)=>It.coralGeometry({rng:e.fork("f"),kind:"fan",size:2.6,detail:a,color:o,tip:f,shade:"#16324a",glow:.5});qt.push(It.makeScatter({rng:e.fork("fans"),path:A,heightAt:ht,radius:80,corridor:9,count:230,chunks:5,cullDistance:230,spacing:1.2,scale:[.6,1.9],falloff:.7,variants:[i(1,"#9fc8e8","#e8f6ff"),i(1,"#c8a8e8","#fff0ff"),i(2,"#8fd8d0","#f0fff8")],material:n,tint:.2,hue:.05,density:(a,o)=>.35+.65*et(-.2,.4,B.n2(a*.03+11,o*.03-5))})),await w.yield(),qt.push(It.makeAnemones({rng:e.fork("anem"),path:A,heightAt:ht,radius:46,corridor:8,count:50,chunks:4,cullDistance:240,scale:[1.2,3],material:n,glow:.9,colors:["#ff8a6a","#ffd0b0","#ff5a7a","#ffe8d0"]}));for(const a of qt)N.add(a.object)}await w.yield();{const n=Math.round((te-jt)/8)+1,g=Math.round((ee-St)/8)+1,u=new Float32Array(n*g*3),v=new Uint32Array((n-1)*(g-1)*6);for(let p=0;p<g;p++){p%20===19&&await w.yield();for(let t=0;t<n;t++){const i=(p*n+t)*3,a=jt+t*8,o=St+p*8;u[i]=a,u[i+1]=dt(a,o),u[i+2]=o}}let s=0;for(let p=0;p<g-1;p++)for(let t=0;t<n-1;t++){const i=p*n+t,a=i+1,o=i+n,f=o+1;v[s++]=i,v[s++]=a,v[s++]=o,v[s++]=a,v[s++]=f,v[s++]=o}const l=new r.BufferGeometry;l.setAttribute("position",new r.BufferAttribute(u,3)),l.setIndex(new r.BufferAttribute(v,1)),await w.yield(),l.computeVertexNormals(),await w.yield(),ze({position:l.attributes.position,normal:l.attributes.normal},v,n,g,8,_t(Je,$e,{},{side:r.DoubleSide}),"ice"),l.setIndex(null)}await w.yield();const Ne=_t(_e,Be);{const e=G.fork("stalactites"),n=new r.ConeGeometry(1,1,6,2,!0).rotateX(Math.PI).translate(0,-.5,0),g=new Float32Array(n.attributes.position.count);for(let y=0;y<g.length;y++)g[y]=Math.min(.995,-n.attributes.position.getY(y));n.setAttribute("aT",new r.BufferAttribute(g,1));const u=520,v=new r.InstancedMesh(n,Ne,u),s=new r.Matrix4,l=new r.Quaternion,p=new r.Euler,t=new r.Vector3,i=new r.Vector3;let a=0,o=0,f=0,c=0;for(let y=0;y<u*6&&a<u;y++){if(c<=0){const S=e.range(-.03,1)*e.range(.35,1),F=e.range(0,95)*e.sign(),j=A.pointAt(S),D=A.tangentAt(S);o=j.x-D.z*F,f=j.z+D.x*F,c=e.int(3,9)}c--;let b=o+e.gauss()*5,z=f+e.gauss()*5;const d=a<30,m=!d&&a<56;if(d){const S=e()*6.283,F=e.range(3.5,13);b=R.x+Math.cos(S)*F,z=R.z+Math.sin(S)*F}else m&&(b=xt.x+e.range(-20,20),z=xt.z+e.range(-16,16));const x=dt(b,z),C=Z(b,z);let h=d?e.range(5,15):m?e.range(6,12):2.5+12*Math.pow(e(),1.8);C.dist<11&&(h=Math.min(h,x-C.y-9));const M=vt(b,z);if(M.dist<45&&(h=Math.min(h,x-M.y-20)),h<1.5)continue;p.set(e.range(-.06,.06),e()*6.283,e.range(-.06,.06)),l.setFromEuler(p);const k=h*e.range(.05,.11)+.15;t.set(k,h,k),i.set(b,x+.6,z),v.setMatrixAt(a++,s.compose(i,l,t))}v.count=a,v.instanceMatrix.needsUpdate=!0,v.frustumCulled=!1,v.name="stalactites",N.add(v)}await w.yield();const je=_t(Qe,to,{uAlgaeA:{value:new r.Color("#4cae3a").multiplyScalar(1.05)},uAlgaeB:{value:new r.Color("#e8c24a").multiplyScalar(1.45)},uCur:{value:new r.Vector2(ft.x*O,ft.z*O)}},{side:r.DoubleSide}),Kt=[],ot=de(pe("lanterns-polish:"+w.seed));{const e=G.fork("algae"),n=[],g=[],u=[],v=54,s=12,l=6;for(let i=0;i<v;i++){const a=i<16?e.range(0,.2):e.range(0,.98),o=e.range(8,i<16?34:70)*e.sign(),f=A.pointAt(a),c=A.tangentAt(a);let y=f.x-c.z*o,b=f.z+c.x*o,z=e()*6.283;const d=i===0;d&&(y=R.x+10*Math.cos(z),b=R.z+10*Math.sin(z),z+=Math.PI/2);const m=d?52:e.range(12,30),x=m/s,C=e()*6.283,h=n.length/3,M=e.range(5,11.5);for(let k=0;k<=s;k++){const S=Z(y,b),F=dt(y,b),j=vt(y,b);let D=M*(.6+.4*Math.sin(k/s*Math.PI))*(.8+.2*Math.sin(k*1.7+C));S.dist<12&&(D=Math.min(D,F-S.y-8)),j.dist<45&&(D=Math.min(D,F-j.y-18)),D=Math.max(.5,D);for(let J=0;J<=l;J++)n.push(y,F+.4,b),g.push(J/l,D,C,k*x);z+=d?x/10:e.range(-.45,.45),y+=Math.cos(z)*x,b+=Math.sin(z)*x}for(let k=0;k<s;k++)for(let S=0;S<l;S++){const F=h+k*(l+1)+S,j=F+1,D=F+l+1,J=D+1;u.push(F,D,j,j,D,J)}}for(let i=0;i<8;i++){const a=.268+i*.0082+ot.range(-.002,.002),o=A.pointAt(a),f=A.tangentAt(a),c=ot.range(24,36),y=c/s,b=ot()*6.283,z=n.length/3,d=ot.range(17,25);let m=Math.atan2(f.x,-f.z)+ot.range(-.45,.45),x=-c*.5+ot.range(-9,9),C=o.x-f.z*x,h=o.z+f.x*x;for(let M=0;M<=s;M++){const k=Z(C,h),S=dt(C,h);let F=d*(.55+.45*Math.sin(M/s*Math.PI))*(.8+.2*Math.sin(M*1.7+b));k.dist<13&&(F=Math.min(F,S-k.y-6.5)),F=Math.max(.5,F);for(let j=0;j<=l;j++)n.push(C,S+.4,h),g.push(j/l,F,b,M*y);M%4===2&&Kt.push([C+ot.range(-2,2),S+1,h+ot.range(-2,2),Math.min(46,S-ht(C,h)-2),ot.range(3.2,6.5),0,.16]),m+=ot.range(-.3,.3),C+=Math.cos(m)*y,h+=Math.sin(m)*y}for(let M=0;M<s;M++)for(let k=0;k<l;k++){const S=z+M*(l+1)+k,F=S+1,j=S+l+1,D=j+1;u.push(S,j,F,F,j,D)}}const p=new r.BufferGeometry;p.setAttribute("position",new r.Float32BufferAttribute(n,3)),p.setAttribute("aHang",new r.Float32BufferAttribute(g,4)),p.setIndex(u);const t=new r.Mesh(p,je);t.frustumCulled=!1,t.name="algae",N.add(t)}await w.yield();const Zt=dt(R.x,R.z)+2,oe=ht(R.x,R.z)-1.5,Ae=new r.Vector2(1,0);{for(let s=0;s<5;s++){const l=ot()*6.283,p=ot.range(7,15);Kt.push([R.x+Math.cos(l)*p,Zt-3,R.z+Math.sin(l)*p,ot.range(24,36),ot.range(2.5,4.5),0,.14])}for(let s=-40;s>=-330;s-=24){const l=it[Math.round((s+600)/12)],p=l.x+ot.range(-11,11),t=l.z+ot.range(-9,9),i=l.y-27;Kt.push([p,i+45,t,47,ot.range(24,38),1,.1])}const e=Kt.length,n=new Float32Array(e*4),g=new Float32Array(e*4);Kt.forEach((s,l)=>{n.set([s[0],s[1],s[2],s[3]],l*4),g.set([s[4],ot()*6.283,s[5],s[6]],l*4)});const u=new r.InstancedBufferGeometry;u.setAttribute("position",new r.Float32BufferAttribute([-1,0,0,1,0,0,1,1,0,-1,1,0],3)),u.setIndex([0,1,2,0,2,3]),u.setAttribute("aBase",new r.InstancedBufferAttribute(n,4)),u.setAttribute("aShaft",new r.InstancedBufferAttribute(g,4)),u.instanceCount=e;const v=new r.Mesh(u,_t(eo,oo,{uShaftA:{value:Mt.clone().lerp(lt,.25).multiplyScalar(.8*(.6+.4*$))},uShaftB:{value:new r.Color(ut[5]).lerp(lt,.2).multiplyScalar(.8)},uGain:{value:Ae}},{transparent:!0,blending:r.AdditiveBlending,depthWrite:!1,side:r.DoubleSide}));v.frustumCulled=!1,v.renderOrder=1,v.name="light-shafts",N.add(v)}await w.yield();{const e=G.fork("brine"),n=32,g=76,u=[],v=[],s=[],l=[],p=e()*50;for(let o=0;o<=g;o++){const f=o/g,c=gt(Zt,oe,f),y=1.2+7.5*Math.exp(-f*8)+3.6*Math.exp(-(1-f)*9)+.45*Math.sin(f*21+p)+.55*Math.pow(Math.max(0,Math.sin(f*55+p*2)),3)*(1-f*.5),b=R.x+Math.sin(f*5.3+p)*1.3*Math.sin(f*Math.PI),z=R.z+Math.cos(f*4.1+p)*1.3*Math.sin(f*Math.PI);for(let d=0;d<=n;d++){const m=d/n*6.283185,x=d%n,C=x/n*6.283185,h=Math.abs(Math.sin(C*3.5+c*.09+p)),M=Math.abs(Math.sin(C*8-c*.05+p*3)),k=y*(1+.22*B.fbm3(Math.cos(C)*1.5+p,c*.12,Math.sin(C)*1.5,3))*(.82+.3*h+.09*M);u.push(b+Math.cos(m)*k,c,z+Math.sin(m)*k),v.push(d/n,f),s.push(Math.floor(Ut(1-h,0,1)*99)+.62+f*.3)}}for(let o=0;o<g;o++)for(let f=0;f<n;f++){const c=o*(n+1)+f,y=c+1,b=c+n+1,z=b+1;l.push(c,y,b,y,z,b)}const t=new r.BufferGeometry;t.setAttribute("position",new r.Float32BufferAttribute(u,3)),t.setAttribute("uv",new r.Float32BufferAttribute(v,2)),t.setAttribute("aT",new r.Float32BufferAttribute(s,1)),t.setIndex(l),t.computeVertexNormals();const i=new r.Mesh(t,_t(_e,Be,{uFlow:{value:1}},{side:r.DoubleSide}));i.name="brine-column",N.add(i);const a=[.12,.38,.64,.9].map(o=>[R.x,gt(Zt,oe,o),R.z]);Bt.add(mt.makeGlows({rng:e.fork("g"),time:Nt,positions:a,color:Mt,size:22,sizes:[1.3,.8,.8,1.2],intensity:.3,halo:1,core:.15,flicker:.12,fogAmount:.6}))}{const e=G.fork("jellies"),n=H,g=n+260,u=new Float32Array(g*4),v=new Float32Array(g*4),s=[],l=[],p=A.pointAt(Dt);let t=0;for(let c=0;c<36&&t<n;c++){const y=e.range(.05,.125),b=(9+10*e())*e.sign(),z=e.range(1.1,1.5),d=A.pointAt(y),m=A.tangentAt(y),x=d.x-m.z*b,C=d.z+m.x*b,h=d.y-e.range(9,16),M=Math.min(27,dt(x,C)-2.5-h);M<12||(u.set([x,h,C,M],t*4),v.set([z,e(),e.range(.45,.9),e()],t*4),t++,s.push([x,h+M*.4,C,.8*z]))}for(let c=0;c<n*10&&t<n;c++){const y=.5+1*Math.pow(e(),1.6),b=e();let z,d;if(b<.06){const h=e.range(.03,.14),M=(8+y+30*e())*e.sign(),k=A.pointAt(h),S=A.tangentAt(h);z=k.x-S.z*M,d=k.z+S.x*M}else if(b<.29){const h=e()*6.283,M=7+44*Math.pow(e(),.8);z=p.x+Math.cos(h)*M,d=p.z+Math.sin(h)*M*1.5}else if(b<.4){const h=e()*6.283,M=9+46*e();z=U.x+Math.cos(h)*M,d=U.z+Math.sin(h)*M}else if(b<.54){const h=it[e.int(24,46)];z=h.x+e.gauss()*20,d=h.z+e.gauss()*14}else{const h=e.range(-.02,1.02),M=(8+y+150*Math.pow(e(),1.7))*e.sign(),k=A.pointAt(h),S=A.tangentAt(h);z=k.x-S.z*M,d=k.z+S.x*M}const m=Z(z,d);if(m.dist<6.5+y*1.4||m.u<.045&&m.dist<17||q.some(h=>Math.hypot(h.x-z,h.z-d)<h.R*2+y)||Math.hypot(z-R.x,d-R.z)<9)continue;const x=ht(z,d)+1.5,C=dt(z,d)-2.5-x;C<12||(u.set([z,x,d,C],t*4),v.set([y,e(),e.range(.45,1.25),e()],t*4),t++,s.push([z,x+4,d,.4*y]))}{const c=de(pe("lanterns-company:"+w.seed)),y=(d,m,x,C,h,M,k)=>{t>=g||q.some(S=>Math.hypot(S.x-d,S.z-x)<S.R*2.2+h)||Math.hypot(d-R.x,x-R.z)<10||(u.set([d,m,x,C],t*4),v.set([h,c(),M,c()],t*4),t++,s.push([d,m+C*.5,x,k]))},b=(.6+.4*(w.quality?.detail??1))*Ut(w.vary?.density??1,.85,1.2),z=!!w.vary?.rare;for(let d=.132,m=c.sign();d<.975;d+=c.range(.009,.0135)/b){m=c.chance(.72)?-m:m;const x=c.range(1.15,2),C=(5.6+x+7.5*c()*c())*m,h=A.pointAt(d),M=A.tangentAt(d),k=h.x-M.z*C,S=h.z+M.x*C,F=c.range(10,14),j=Math.max(ht(k,S)+2,h.y-F*.5-c.range(-1.5,2.5));j+F>dt(k,S)-2||vt(k,S).dist<14||y(k,j,S,F,x,c.range(.22,.4),1*x)}for(let d=.115;d<.985;d+=c.range(.008,.0125)/b){const m=c.range(.85,1.5),x=c.range(7,36)*c.sign(),C=A.pointAt(d),h=A.tangentAt(d),M=C.x-h.z*x,k=C.z+h.x*x,S=ht(M,k)+1.4,F=c.range(7,11);S+F>C.y-2.5&&Math.abs(x)<11||y(M,S,k,F,m,c.range(.16,.32),1.7*m)}for(const[d,m,x]of z?[[.835,11.5,14],[.905,10,12],[.765,12.5,14],[.87,10.8,13]]:[[.835,11.5,14],[.905,10,12]]){const C=A.pointAt(d),h=A.tangentAt(d),M=c()*6.283;for(let k=0;k<x;k++){const S=M+k/x*6.283,F=Math.cos(S)*m,j=Math.sin(S)*m*.92;y(C.x-h.z*F,C.y+j-2.5,C.z+h.x*F,5,c.range(1,1.5),c.range(.1,.16),1.2)}}}{const c=de(pe("lanterns-greats:"+w.seed)),y=Math.sign(Y)||1;for(const[b,z,d,m,x]of[[.305,19,5,6.6],[.395,-21,2,7.4],[.47,23,-1,6.2],[Rt-.012,-25*y,3,6.4],[.842,22*y,2,7.2],[.925,-21*y,9,5.6],[.8,-60,-3,7.6,1],[.885,-46,-7,8.6,1]]){const C=A.pointAt(b),h=A.tangentAt(b);let M=!1;for(let k=0;k<6&&!M;k++){const S=z+Math.sign(z)*k*4,F=b+(k%2?.012:0)*(k>2?-1:1),j=k?A.pointAt(F):C,D=k?A.tangentAt(F):h,J=j.x-D.z*S,at=j.z+D.x*S,bt=ht(J,at),Gt=dt(J,at),ct=Math.min(j.y+d,Gt-m*.9-3);if(ct-bt<m*1.6||q.some(zt=>Math.hypot(zt.x-J,zt.z-at)<zt.R*2.4+m+2)||Math.hypot(J-R.x,at-R.z)<m+13)continue;const yt=vt(J,at);!x&&yt.dist<m+16&&yt.y-14<ct+m||(l.push([J,ct,at,m,c(),c(),Math.min(m*2.9,ct-bt-.6),c.range(.9,1.1)]),M=!0)}}}{const c=A.tangentAt(1),y=U.x+c.x*17,b=U.z+c.z*17,z=9.5,d=Math.min(U.y+17,dt(y,b)-z*.9-2),m=ht(y,b);l.push([y,d,b,z,.37,.61,Math.min(z*3.2,d-m-.6),1.15])}await w.yield();{const y=new Map,b=(d,m)=>d*4096+m;for(const d of s){const m=b(Math.floor(d[0]/30)+2048,Math.floor(d[2]/30)+2048);y.has(m)||y.set(m,[]),y.get(m).push(d)}let z=0;for(const d of Qt){const m=d.pos,x=d.nor,C=m.length/3;for(let h=0;h<C;h++){const M=m[h*3],k=m[h*3+1],S=m[h*3+2],F=Math.floor(M/30)+2048,j=Math.floor(S/30)+2048;let D=0;for(let J=-1;J<=1;J++)for(let at=-1;at<=1;at++){const bt=y.get(b(F+J,j+at));if(bt)for(let Gt=0;Gt<bt.length;Gt++){const ct=bt[Gt],yt=ct[0]-M,zt=ct[1]-k,he=ct[2]-S,ie=yt*yt+zt*zt+he*he;if(ie>900)continue;const Pe=1-ie/900;D+=ct[3]*Pe*Pe*Math.max(0,(x[h*3]*yt+x[h*3+1]*zt+x[h*3+2]*he)/Math.sqrt(ie+.01)*.6+.4)/(1+ie*.022)}}for(let J=0;J<l.length;J++){const at=l[J],bt=at[0]-M,Gt=at[1]-k,ct=at[2]-S,yt=bt*bt+Gt*Gt+ct*ct;if(yt>7e3)continue;const zt=1-yt/7e3;D+=3*at[7]*zt*zt*Math.max(0,(x[h*3]*bt+x[h*3+1]*Gt+x[h*3+2]*ct)/Math.sqrt(yt+.01)*.6+.4)/(1+yt*.0042)}d.bake[h*2+1]=d.ao?D*(.35+.65*d.ao[h]):D,++z%1200===0&&await w.yield()}}}await w.yield();const i=so(),a=_t(ao,no,{uCore:{value:I.clone().multiplyScalar(1.25)},uBell:{value:new r.Color("#ffe9d2").lerp(lt,.35)},uBead:{value:I.clone().lerp(new r.Color("#ff7a5a"),.35)},uMinAng:{value:.0076}},{transparent:!0,premultipliedAlpha:!0,depthWrite:!1,side:r.DoubleSide});if(l.length){const c=lo(),y=new r.InstancedBufferGeometry;y.index=c.index,y.setAttribute("position",c.attributes.position),y.setAttribute("aCfg",c.attributes.aCfg);const b=new Float32Array(l.length*4),z=new Float32Array(l.length*4);l.forEach((m,x)=>{b.set([m[0],m[1],m[2],m[3]],x*4),z.set([m[4],m[5],m[6],m[7]],x*4)}),y.setAttribute("gPos",new r.InstancedBufferAttribute(b,4)),y.setAttribute("gParm",new r.InstancedBufferAttribute(z,4)),y.instanceCount=l.length;const d=new r.Mesh(y,_t(io,ro,{uCore:{value:I.clone().multiplyScalar(1.2)},uBell:{value:new r.Color("#ffe9d2").lerp(lt,.45)},uBead:{value:I.clone().lerp(new r.Color("#ff7a5a"),.3)},uBead2:{value:Mt.clone().lerp(lt,.3)}},{transparent:!0,premultipliedAlpha:!0,depthWrite:!1,side:r.DoubleSide}));d.frustumCulled=!1,d.renderOrder=3,d.name="great-lanterns",N.add(d)}const o=6,f=(ee-St)/o;for(let c=0;c<o;c++){const y=St+c*f,b=[],z=[];for(let x=0;x<t;x++){const C=u[x*4+2];if(C>=y&&C<y+f||c===0&&C<St||c===o-1&&C>=ee)for(let h=0;h<4;h++)b.push(u[x*4+h]),z.push(v[x*4+h])}if(!b.length)continue;const d=new r.InstancedBufferGeometry;d.index=i.index,d.setAttribute("position",i.attributes.position),d.setAttribute("aCfg",i.attributes.aCfg),d.setAttribute("aPos",new r.InstancedBufferAttribute(new Float32Array(b),4)),d.setAttribute("aParm",new r.InstancedBufferAttribute(new Float32Array(z),4)),d.instanceCount=b.length/4;const m=new r.Mesh(d,a);m.frustumCulled=!1,m.renderOrder=3,m.name="lantern-jellies",N.add(m),fe.push({object:m,z:y+f/2,half:f/2,reach:300})}}await w.yield();const Vt=[];{const e=G.fork("fauna"),n={sunDir:[.1,1,.1],sunColor:"#3a86a8",sunIntensity:.22*$,sky:ut[1],skyIntensity:.3,ground:"#3a1408",groundIntensity:.25},g=v=>{const s=Ge.makeFishSchool({rng:e.fork("fish"),species:"glowfish",lod:"mid",count:280,size:2.7,spread:[6,3,22],speed:6,light:n,caustics:0,rim:0,spec:0,top:"#000000",belly:"#000000",fin:"#000000",glow:"#9fe8ff",glowIntensity:2.5,...v}),l=s.geometry,p=l.attributes.position,t=l.attributes.aAnim,i=l.attributes.aGlow;if(p&&t&&i){for(let f=0;f<p.count;f++){const c=t.getX(f)>.5;p.setY(f,p.getY(f)*(c?.55:.42)),p.setX(f,p.getX(f)*.6),i.setX(f,c?.1:1)}p.needsUpdate=!0,i.needsUpdate=!0}const a=s.material,o=a.uniforms;a.transparent=!0,a.blending=r.AdditiveBlending,a.depthWrite=!1;for(const f of["uRim","uSpec","uBack","uFill"])o[f]&&(o[f].value=0);return a.fragmentShader=a.fragmentShader.replace("#include <fog_fragment>",`
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      gl_FragColor.rgb *= exp(-fogDensity * fogDensity * vFogDepth * vFogDepth * 0.7);
    #endif
  #endif`),a.needsUpdate=!0,s.object.renderOrder=2,s};if(Vt.push(g({cross:{path:A,u:.3,lead:38,span:320,window:.22,angle:68,side:-Q,height:-1}})),await w.yield(),Vt.push(g({count:220,center:[R.x,gt(oe,Zt,.45),R.z],radius:26,height:9,speed:5})),await w.yield(),nt>2&&Vt.push(g({count:200,along:{path:A,side:10*Q,up:-4,lead:36,from:.74,to:.99}})),await w.yield(),Wt){const v=A.pointAt(.9);Vt.push(Ge.makeRibbonEels({rng:e.fork("eels"),count:e.int(5,8),length:22,width:.5,speed:7,color:"#d2f0ff",color2:I,intensity:1.5,hueVariety:.15,center:[v.x-28*Q,v.y+12,v.z],radius:48,height:14,spread:[10,6,50]}))}await w.yield();const u=[[0,.46],[.45,1],...nt>2?[[.68,1]]:[],[.55,1]];Vt.forEach((v,s)=>{v.span=u[s],N.add(v.object)});{const v=q.find(p=>p.fishy),s=Z(v.x,v.z),l=g({count:Math.round(200*(.6+.4*(w.quality?.detail??1))),center:[v.x,s.y+1,v.z],radius:12.5,height:7,speed:6.5,size:3,lod:"low"});l.span=[.16,.56],N.add(l.object),Vt.push(l)}}await w.yield();const co=Bt.add(mt.makeParticles({rng:G.fork("snow"),preset:"snow",time:Nt,count:Math.round(2600*X),box:[58,38,58],velocity:[ft.x*.55*O,-.32,ft.z*.55*O],velocityRandom:[.25,.2,.25],turbulence:[.45,.2,.5],size:[.035,.11],colors:["#d4ecff","#9fd2ea","#ffe2c4"],intensity:.85,opacity:.8,additive:.6,shape:"disc"}));await w.yield();const ae=De.makeUnderwater({rng:G.fork("uw"),light:"night",surfaceY:66,floorY:2,rays:!1,particles:{count:420,range:42,size:.06,color:"#7fb8d8",glowColor:I,glowFraction:.3,glowIntensity:2.2},bubbles:{count:240,size:.17,sources:Yt.map(e=>[e[0],e[1],e[2]])}});ae.surface&&(ae.surface.visible=!1),N.add(ae.object),Bt.add(mt.makeGlow({time:Nt,position:[U.x,U.y,U.z-2.5],color:st,size:60,intensity:.42,halo:1,core:.1,rays:0,flicker:.06,fogAmount:.22,depthBias:0}));const Jt=new r.Vector3,ne=new r.Vector3,ke=e=>et(.3,.48,e)*(1-et(.66,.79,e)),ue=new r.Vector3,se=new r.Vector3,Ve=Ee,Se=I.clone(),We=e=>{const n=A.pointAt(e),g=A.tangentAt(e);let u=58,v=0;for(let s=58;s>=-66;s-=6){_.bodyPosition(s,Jt);const l=(Jt.x-n.x)*g.x+(Jt.z-n.z)*g.z;if(l>=30){s<58&&_.bodyPosition(gt(u,s,Ut((30-v)/Math.max(.001,l-v),0,1)),Jt);break}u=s,v=l}return Jt},He=_.uniforms.uAmbTop.value.clone(),qe=_.uniforms.uAmbBot.value.clone(),ve=e=>{const n=et(.33,.45,e);_.setProgress(_.progressAt(e,Te,Ye)),_.setReveal(gt(-.3,.02,n)+.78*ke(e)),_.uniforms.uAmbTop.value.copy(He).multiplyScalar(.2+.8*n),_.uniforms.uAmbBot.value.copy(qe).multiplyScalar(.2+.8*n)};return ve(0),{scene:N,path:A,duration:Te,title:"Lanterns under the Ice",camera:{fov:64,near:.4,far:1400,lookAhead:34,sway:1,bank:.7},pois:[{at:[Ht.x,Ht.y+31,Ht.z],from:.07,to:.27,weight:.42},{at:(e,n)=>(ve(n),We(n)),from:.4,to:.675,weight:.68,fade:.35},{at:[R.x,gt(Zt,oe,.6),R.z],from:.66,to:.8,weight:.3}],portal:{shape:"circle",radius:7,color:"#bfeeff",glow:1.3,revealDistance:260},post:{exposure:1.1,bloom:{strength:.66,radius:.75,threshold:.85},grade:{saturation:1.12,contrast:1.05,tint:"#eef6ff",shadowTint:"#01060e",vignette:.42,grain:.03,aberration:0}},update(e,n,g,u){Nt.value=n,rt.uTime.value=n;const v=ke(u);if(Ae.y=1.5*et(.26,.42,u)*(1-et(.56,.68,u)),ve(u),_.update(e,n,g),_.light){_.light.intensity=v>.004?kt*v:0,ne.copy(_.light.position).applyMatrix4(_.object.matrixWorld);const t=et(.34,.42,u)*(1-et(.44,.5,u));rt.uLevFall.value=gt(1/9025,1/44e3,t),rt.uLevPos.value.copy(ne),rt.uLevCol.value.copy(_.light.color).multiplyScalar(1.3*v*(1+1.5*t))}for(const t of xe){const i=rt.uLevCol.value;t.amb.setRGB(t.amb0.r+i.r*.32,t.amb0.g+i.g*.32,t.amb0.b+i.b*.32),t.col.setRGB(t.col0.r+i.r*.3,t.col0.g+i.g*.3,t.col0.b+i.b*.3),t.sh.setRGB(t.sh0.r+i.r*.22,t.sh0.g+i.g*.22,t.sh0.b+i.b*.22),t.top.setRGB(t.top0.r+i.r*.4,t.top0.g+i.g*.4,t.top0.b+i.b*.4)}const s=et(.26,.34,u),l=et(.085,.2,u);A.pointAt(Math.min(1,u+.02),se),se.y-=4,rt.uLampPos.value.copy(se),rt.uLampCol.value.copy(Se).multiplyScalar(.7*l*(.9+.1*Math.sin(n*1.7))),Ft.position.lerpVectors(Ve,se,s),Ft.color.lerpColors(Ct,Se,s),Ft.intensity=gt(300,110,s)*(.82+(.12*Math.sin(n*3.1)+.06*Math.sin(n*7.7+1.3))*(1-.6*s)),ue.setFromMatrixPosition(g.matrixWorld);const p=ue.z;for(const t of fe)t.object.visible=Math.abs(p-t.z)<t.half+t.reach;_.centerPosition(ne);{const t=u>.41&&ne.distanceTo(ue)<340;for(const i of _.object.children)i!==_.light&&(i.visible=t)}Bt.update(e,n,g),ae.update(e,n,g),Ce.update(n);for(const t of qt)t.update(e,n,g);for(const t of Vt){const i=u>=t.span[0]&&u<=t.span[1];t.object.visible=i,i&&t.update(e,n,g,u)}},dispose(){_.dispose()}}}};export{vo as default};
