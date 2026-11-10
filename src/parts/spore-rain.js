import*as r from"three";import{makeRng as Ot,hashSeed as Wt}from"../kit/core.js";const Ht=["#B5622B","#5A2E17","#4E7A2E","#C9D4C2","#F1E6C8","#FFD27A","#D8281C"],G=Math.PI*2,tt=`
uniform float uTime;
uniform vec3 uSunDir, uSunCol, uSkyCol, uGroundCol, uShaftP, uCapC, uCapN, uCamL;
uniform float uShaftR, uCoreR, uCapR, uWet, uFrost, uDomeH;
float h31(vec3 p){ p = fract(p * 0.3183099 + vec3(0.11, 0.23, 0.37)); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float vnoise(vec3 x){
  vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(h31(i), h31(i + vec3(1,0,0)), f.x), mix(h31(i + vec3(0,1,0)), h31(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(h31(i + vec3(0,0,1)), h31(i + vec3(1,0,1)), f.x), mix(h31(i + vec3(0,1,1)), h31(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float fbm3(vec3 p){ return 0.5 * vnoise(p) + 0.3 * vnoise(p * 2.03 + 7.1) + 0.2 * vnoise(p * 4.1 + 13.7); }
// 1 inside the sunbeam, soft edge
float shaftMask(vec3 p){
  vec3 d = p - uShaftP; float along = dot(d, uSunDir);
  float dist = length(d - uSunDir * along);
  return 1.0 - smoothstep(uShaftR * 0.78, uShaftR * 1.06, dist);
}
// 1 inside the bar that is seen in the air (the shaft's core: hero.shaft.core, the whole shaft unless a world narrows it)
float coreMask(vec3 p){
  vec3 d = p - uShaftP; float along = dot(d, uSunDir);
  float dist = length(d - uSunDir * along);
  return 1.0 - smoothstep(uCoreR * 0.8, uCoreR * 1.04, dist);
}
// 1 where the cap does not shadow the point
float capLit(vec3 p){
  float dn = max(dot(uSunDir, uCapN), 0.02);
  float t = dot(uCapC - p, uCapN) / dn;
  vec3 h = p + uSunDir * t - uCapC;
  float rr = length(h - uCapN * dot(h, uCapN));
  if (t > 0.0) return smoothstep(uCapR - 1.6, uCapR + 0.5, rr);
  // above the rim plane: lit only outside the dome's own volume (the vault under it stays in shade)
  vec3 e = p - uCapC; float hp = dot(e, uCapN);
  float q = min(length(e - uCapN * hp) / max(uCapR, 1.0), 1.0);
  float domeY = uDomeH * (1.0 - q * q) - 0.9;
  return smoothstep(domeY, domeY + 0.5, hp);
}
`,$t=`
attribute vec3 aCol;
attribute vec2 aux;
uniform mat4 uPart;
uniform vec3 uSway, uWave;
uniform float uCapRad;
varying vec3 vL, vN, vP, vCol;
varying vec2 vAux;
#include <fog_pars_vertex>
${tt}
void main(){
  vec3 p = position; vec3 n = normal;
  #if KIND == 2
    // blades waver a little along their length
    p.z += sin(p.x * 0.9 + float(gl_InstanceID) * 2.4) * 0.05 * aux.x * p.x * 0.12;
  #endif
  #if KIND == 6
    // litter leaves rock on their keel
    float rk = sin(uTime * (0.7 + fract(float(gl_InstanceID) * 0.37)) + float(gl_InstanceID)) * 0.05;
    p.y += p.x * rk;
  #endif
  #ifdef USE_INSTANCING
    p = (instanceMatrix * vec4(p, 1.0)).xyz; n = mat3(instanceMatrix) * n;
  #endif
  #if KIND == 2
    // follow the cap's scalloped margin (same wave as the cap top, see makeShape.waveAt)
    float wr = min(length(p.xz) / uCapRad, 1.05); float wth = atan(p.z, abs(p.x) + abs(p.z) < 1e-4 ? 1.0 : p.x);
    p.y += uWave.x * wr * wr * wr * (0.6 * sin(wth * 3.0 + uWave.y) + 0.4 * sin(wth * 5.0 + uWave.z));
  #endif
  vP = p;
  vec4 lp = uPart * vec4(p, 1.0);
  float hh = clamp(lp.y / 36.0, 0.0, 1.2);
  lp.xyz += uSway * hh * hh;
  vL = lp.xyz; vN = mat3(uPart) * n; vCol = aCol; vAux = aux;
  #ifdef USE_INSTANCING_COLOR
    vCol *= instanceColor;
  #endif
  #if KIND == 2
    vCol *= 0.8 + 0.35 * fract(float(gl_InstanceID) * 0.618);
  #endif
  vec4 mvPosition = modelViewMatrix * lp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Xt=`
uniform vec3 cCopper, cUmber, cMoss, cPearl, cCream, cGold;
uniform float uRingY, uCapRad, uSeed, uLitter, uFogK;
varying vec3 vL, vN, vP, vCol;
varying vec2 vAux;
#include <fog_pars_fragment>
${tt}
vec3 bumpN(vec3 N, vec3 p, float h, float k){
  vec3 dpx = dFdx(p), dpy = dFdy(p); float hx = dFdx(h), hy = dFdy(h);
  vec3 r1 = cross(dpy, N), r2 = cross(N, dpx); float det = dot(dpx, r1);
  vec3 g = sign(det) * (hx * r1 + hy * r2);
  return normalize(abs(det) * N - k * g + N * 1e-6);
}
void main(){
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0));
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(uCamL - vL + vec3(0.0, 1e-4, 0.0));
  vec3 alb = vCol; float gloss = 0.35, ao = 1.0, sss = 0.0, h = 0.0, bumpK = 0.0;
  #if KIND == 0
    // ---- stalk: brown felt cracked into snakeskin zigzag bands over cream
    float ang = vAux.y * 6.28318; vec3 q = vec3(cos(ang), 0.0, sin(ang));
    float y = vP.y;
    float above = smoothstep(uRingY - 0.4, uRingY + 0.8, y);
    float zig = y * 1.25 + 0.30 * sin(ang * 5.0 + y * 0.4) + 0.22 * sin(ang * 11.0 - y * 0.9)
              + 1.3 * fbm3(vec3(q.x * 1.6, y * 0.3, q.z * 1.6) + uSeed);
    float b = fract(zig), row = floor(zig);
    float pat = smoothstep(0.02, 0.14, b) * (1.0 - smoothstep(0.50, 0.66, b));
    float brk = vnoise(vec3(q.x * 4.0, row * 3.7 + uSeed, q.z * 4.0) + y * 0.25);
    pat *= smoothstep(0.24, 0.46, brk);
    pat *= mix(1.0, 0.22, above);
    float fib = vnoise(vec3(q.x * 22.0, y * 0.5, q.z * 22.0));
    float low = 1.0 - smoothstep(1.0, 7.0, y);
    vec3 felt = mix(cUmber, cCopper, 0.18 + 0.3 * brk) * (0.75 + 0.4 * fib);
    vec3 skin = mix(cCream * 0.92, cCream * vec3(0.9, 0.84, 0.72), fib * 0.6 + low * 0.3);
    float fleck = smoothstep(0.6, 0.74, vnoise(vec3(q.x * 9.0, y * 2.4, q.z * 9.0) + uSeed)) * (1.0 - pat) * (0.4 - 0.25 * above);
    alb = mix(skin, felt, clamp(pat * 0.9 + low * 0.12 + fleck, 0.0, 1.0));
    h = pat * 0.8 + fib * 0.15; bumpK = 0.07; gloss = mix(0.5, 0.28, pat);
    ao = 0.55 + 0.45 * smoothstep(0.0, 4.0, y);
    ao *= 1.0 - 0.5 * smoothstep(uCapC.y - 1.0, uCapC.y + 4.0, y);
  #elif KIND == 1
    // ---- cap top: cream fibrils, concentric shaggy brown scales, dark boss
    float r = length(vP.xz); float th = atan(vP.z, abs(vP.x) + abs(vP.z) < 1e-4 ? 1.0 : vP.x);
    float rn = r / uCapRad;
    float ringW = 1.02; float ri = floor(r / ringW); float rc = (ri + 0.5) * ringW;
    float nC = max(floor(6.28318 * rc / 1.3), 3.0);
    float a = (th / 6.28318 + 0.5) * nC + 0.5 * mod(ri, 2.0);
    vec2 cuv = vec2(fract(a) - 0.5, (r - rc) / ringW);
    float cid = mod(floor(a), nC);
    float big = vnoise(vec3(cid * 1.7, ri * 2.3, uSeed));
    float sz = mix(0.62, 0.24, smoothstep(0.15, 1.0, rn)) * (0.7 + 0.6 * big);
    float dd = length(vec2(cuv.x * 1.15, cuv.y + 0.12 - abs(cuv.x) * 0.5));
    float sc = 1.0 - smoothstep(sz * 0.72, sz, dd + 0.10 * vnoise(vP * 3.0));
    float boss = 1.0 - smoothstep(1.9, 3.3, r + 0.7 * vnoise(vP * 1.3 + uSeed));
    sc = max(sc, boss);
    float fibr = vnoise(vec3(th * 40.0, r * 0.35, uSeed));
    float fib2 = vnoise(vec3(th * 110.0, r * 0.8, 3.0));
    vec3 ground = mix(cCream * 0.86, cCream * vec3(0.84, 0.74, 0.58), fibr * 0.55 + 0.25 * (1.0 - rn));
    ground *= 0.86 + 0.2 * fib2;
    vec3 scale = mix(cUmber * 1.05, cCopper * 0.8, 0.5 * big + 0.3 * rn) * (0.7 + 0.5 * fib2);
    scale = mix(scale, cUmber * 0.55, boss * 0.8);
    alb = mix(ground, scale, sc);
    float split = smoothstep(0.86, 1.0, rn) * smoothstep(0.55, 0.9, vnoise(vec3(th * 26.0, 1.0, uSeed)));
    alb *= 1.0 - 0.35 * split;
    h = sc * 0.9 + fibr * 0.2; bumpK = 0.16; gloss = mix(0.42, 0.6, boss);
    sss = smoothstep(0.7, 1.0, rn) * 0.5;
  #elif KIND == 2
    // ---- gills: cream wedges, dark up in the slots, bright wet edge
    float v = vAux.x;
    ao = mix(0.16, 1.0, pow(max(v, 0.0), 0.75));
    float fl = vnoise(vec3(vP.x * 2.0, vP.y * 6.0, vP.z * 2.0));
    alb = mix(cCream * vec3(0.80, 0.70, 0.60), cCream * 0.9, v) * (0.9 + 0.14 * fl) * vCol;
    alb = mix(alb, cCream * vec3(0.78, 0.60, 0.44), 0.35 * smoothstep(0.55, 1.0, vAux.y) * (1.0 - v));
    gloss = 0.25 + 0.5 * smoothstep(0.86, 1.0, v); sss = 0.16 * v;
  #elif KIND == 3
    // ---- flesh, ring, sibling: vertex colour with felt fibres
    float f3 = vnoise(vP * vec3(7.0, 1.2, 7.0)); float g3 = vnoise(vP * 1.7 + uSeed);
    alb = vCol * (0.8 + 0.3 * f3) * (0.88 + 0.24 * g3);
    h = f3 * 0.6 + g3; bumpK = 0.025; gloss = 0.3; ao = 0.6 + 0.4 * vAux.x; sss = 0.12 * vAux.y;
  #elif KIND == 4
    // ---- shaggy scale flaps
    float f4 = vnoise(vP * vec3(9.0, 9.0, 9.0));
    alb = vCol * (0.7 + 0.5 * f4); gloss = 0.3; ao = 0.55 + 0.45 * vAux.y; sss = 0.3 * vAux.y;
  #elif KIND == 5
    // ---- mound: haircap moss turf over wet humus and leaf mould
    float m1 = fbm3(vP * 0.4 + uSeed), m2 = vnoise(vP * 1.3), m3 = fbm3(vP * 3.2);
    vec3 moss = mix(cMoss * 0.5, mix(cMoss, cGold, 0.2), m2) * (0.6 + 0.6 * m3);
    vec3 humus = mix(cUmber * 0.5, mix(cCopper * 0.7, cGold * 0.6, uLitter), m2 * m2) * (0.7 + 0.5 * m3);
    float mk = smoothstep(0.40, 0.58, m1 + 0.25 * vAux.x);
    alb = mix(humus, moss, mk);
    h = m3 * 0.6 + m2 * 0.6; bumpK = 0.22; gloss = mix(0.5, 0.2, mk); ao = 0.55 + 0.45 * (1.0 - vAux.x);
  #else
    // ---- beech leaves: copper plates with midrib and veins, amber when back-lit
    vec2 uv = vAux; float mid = 1.0 - smoothstep(0.0, 0.035, abs(uv.y));
    float vv = 1.0 - smoothstep(0.03, 0.09, abs(fract(uv.x * 7.0 - abs(uv.y) * 2.2) - 0.5));
    float bl = vnoise(vec3(uv * 9.0, vCol.r * 20.0));
    alb = vCol * (0.75 + 0.4 * bl) * (1.0 - 0.3 * vv) * (1.0 - 0.45 * mid);
    alb *= 0.72; gloss = 0.45; sss = 0.42; h = vv * 0.5 + mid; bumpK = 0.08;
  #endif
  if (bumpK > 0.0) N = bumpN(N, vL, h, bumpK);
  // ---- light: pearl skylight, copper bounce, the one shaft, wet sky highlights
  float beam = shaftMask(vL) * capLit(vL);
  float ndl = dot(N, uSunDir);
  float dif = clamp(ndl * 0.88 + 0.12, 0.0, 1.0);
  vec3 sky = mix(uGroundCol, uSkyCol, N.y * 0.5 + 0.5);
  vec3 col = alb * sky * ao;
  col += alb * uSunCol * dif * beam;
  // translucency: light through thin flesh and leaves, toward the bright side
  float back = max(dot(V, -uSunDir), 0.0); back = back * back;
  col += alb * mix(cCopper, uSunCol, 0.6) * sss * (0.25 + 1.3 * back) * shaftMask(vL) * (0.35 + 0.65 * clamp(-ndl + 0.4, 0.0, 1.0));
  #if KIND == 2
    // warm light bounced up into the vault from the lit stalk and floor
    float hub = 1.0 - smoothstep(2.0, 15.0, length(vP.xz));
    col += alb * mix(uSunCol, uSkyCol * 1.6, 0.45) * shaftMask(vL) * (0.02 + 0.3 * hub * hub) * (0.3 + 0.7 * vAux.x);
    // on a frosty morning the vault is the one warm place in the wood: the stalk's light goes up into it, amber at
    // the hub and cream out to the rim, so the gills stand paler and warmer than the mist behind them
    col += alb * vec3(1.0, 0.72, 0.4) * uFrost * (0.2 + 0.55 * hub * hub) * (0.4 + 0.6 * vAux.x);
  #endif
  vec3 R = reflect(-V, N);
  float fres = 0.04 + 0.96 * pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 5.0);
  float wet = gloss * uWet;
  col += uSkyCol * wet * (0.5 * fres * smoothstep(-0.2, 0.6, R.y) + 1.3 * pow(max(R.y, 0.0), 14.0) * 0.35) * ao;
  vec3 Hh = normalize(uSunDir + V + vec3(0.0, 1e-4, 0.0));
  col += uSunCol * wet * beam * 2.2 * pow(max(dot(N, Hh), 0.0), 60.0);
  // hoar frost: pale sparkle on up-facing edges
  float fr = uFrost * (0.2 + 0.32 * smoothstep(0.3, 0.8, fbm3(vL * 9.0))) * clamp(N.y * 0.7 + 0.5, 0.0, 1.0);
  col = mix(col, uSkyCol * 1.15 + uSunCol * beam * 0.6, fr * 0.6);
  #if KIND == 2
    // hoar along the blades' lower edges, thickest round the rim: a white fringe, its crystals catching the sky one
    // by one as the eye moves under them
    float rimK = smoothstep(0.78, 0.98, length(vP.xz) / uCapRad);
    float hoar = uFrost * smoothstep(0.8, 0.97, vAux.x) * (0.22 + 0.78 * rimK);
    col = mix(col, uSkyCol * 1.25, hoar * 0.55);
    col += uSkyCol * 2.6 * hoar * smoothstep(0.7, 0.86, vnoise(vL * 5.0 + V * 5.0));
  #endif
  gl_FragColor = vec4(col, 1.0);
  #if defined(USE_FOG) && defined(FOG_EXP2)
    // scene fog, thinned by uFogK (1 = as the scene; a world may let the parasol stand clearer of the haze)
    float fd = fogDensity * uFogK;
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, 1.0 - exp(-fd * fd * vFogDepth * vFogDepth));
  #else
    #include <fog_fragment>
  #endif
}`,jt=`
attribute vec4 iB;          // phase, kind (0 bead, 1 dripper, 2 staged dripper), fall height, period
uniform vec3 uSway;
uniform float uProgress;
varying vec3 vL, vN;
#include <fog_pars_vertex>
${tt}
void main(){
  vec3 c = instanceMatrix[3].xyz;
  float s = length(instanceMatrix[0].xyz);
  vec3 p = position; vec3 sc = vec3(1.0); float drop = 0.0;
  float tremble = sin(uTime * (4.0 + 5.0 * fract(iB.x * 7.3)) + iB.x * 40.0);
  if (iB.y < 0.5) {
    sc = vec3(1.0 - 0.05 * tremble, 0.82 + 0.07 * tremble, 1.0 - 0.05 * tremble);
  } else {
    float tf;                                  // seconds since letting go (negative: still hanging)
    float grow;
    if (iB.y < 1.5) { float t = fract(uTime / iB.w + iB.x); tf = (t - 0.72) * iB.w; grow = clamp(t / 0.72, 0.0, 1.0); }
    else { tf = (uProgress - iB.x) * 9.0; grow = 1.0; }
    float f = max(tf, 0.0);
    drop = min(15.0 * f * f, 25.0 * f);        // accelerates to the slowed 25 m/s
    float gone = step(iB.z, drop);
    float wob = sin(f * 15.0 + iB.x * 9.0) * 0.16 * step(0.001, f);
    float hang = mix(0.45, 1.0, grow);
    sc = hang * vec3(1.0 + wob, 1.0 + 0.25 * grow * (1.0 - step(0.001, f)) - wob * 1.4, 1.0 + wob) * (1.0 - gone);
    sc *= 1.0 + 0.04 * tremble * (1.0 - step(0.001, f));
  }
  vec3 lp = c + p * s * sc - vec3(0.0, drop, 0.0);
  float hh = clamp(c.y / 36.0, 0.0, 1.2);
  lp += uSway * hh * hh * (1.0 - step(0.001, drop));
  vL = lp; vN = normalize(position / max(sc, vec3(0.2)));
  vec4 mvPosition = modelViewMatrix * vec4(lp, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Qt=`
uniform vec3 cCopper, cUmber, cMoss, cPearl, cCream, cGold;
varying vec3 vL, vN;
#include <fog_pars_fragment>
${tt}
// the canopy dome as the drop sees it: copper, lemon and green mosaic with pearl gaps, dark floor below
vec3 envCol(vec3 d){
  float n = vnoise(d * 5.0 + 3.0), m = vnoise(d * 11.0);
  vec3 can = mix(cCopper, cGold * 0.9, smoothstep(0.35, 0.7, n));
  can = mix(can, cMoss * 1.2, smoothstep(0.55, 0.8, m) * 0.6);
  can = mix(can * 0.55, uSkyCol * 1.5, smoothstep(0.62, 0.8, vnoise(d * 7.0 + 9.0)));
  vec3 flo = mix(cCopper * 0.45, cGold * 0.5, n);
  return mix(flo, can, smoothstep(-0.15, 0.25, d.y));
}
void main(){
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0));
  vec3 V = normalize(uCamL - vL + vec3(0.0, 1e-4, 0.0));
  float nv = clamp(dot(N, V), 0.0, 1.0);
  vec3 R = reflect(-V, N);
  vec3 T = refract(-V, N, 0.75);
  float fres = 0.03 + 0.97 * pow(1.0 - nv, 4.0);
  vec3 col = mix(envCol(vec3(-T.x, -T.y, -T.z)), uSkyCol, 0.3) * 0.62;          // the wood upside down inside the drop
  col += envCol(R) * fres * 0.9;
  float beam = shaftMask(vL) * capLit(vL);
  vec3 skyD = normalize(vec3(0.25, 1.0, 0.3));
  col += uSkyCol * 5.0 * pow(max(dot(R, skyD), 0.0), 70.0);  // the sharp sky highlight
  col += uSkyCol * 0.8 * pow(max(dot(R, normalize(vec3(-0.5, 0.6, -0.4))), 0.0), 30.0);
  float hz = 1.0 - abs(R.y); hz *= hz; hz *= hz;
  col += uSkyCol * 1.1 * hz * hz;
  col += uSunCol * shaftMask(vL) * 1.6 * pow(max(-R.y, 0.0), 10.0);
  col += uSunCol * beam * (4.0 * pow(max(dot(R, uSunDir), 0.0), 30.0) + 1.4 * pow(max(dot(N, -uSunDir), 0.0), 3.0));
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,Zt=`
uniform float uGlitR;
uniform vec3 uGlitTint;
float glitMask(vec3 p){
  vec3 d = p - uShaftP; float along = dot(d, uSunDir);
  float dist = length(d - uSunDir * along);
  return 1.0 - smoothstep(uGlitR * 0.78, uGlitR * 1.06, dist);
}
// 1 on the sun's side of the stalk, 0 in its lee, with a soft ragged line between them that runs through the stalk:
// the half of the curtain that hangs in the lee of the stalk and the cap is grey smoke, the glitter is on the other half
float sunSide(vec3 p){
  vec2 b = normalize(uSunDir.xz + vec2(1e-4, 0.0));
  float s = dot(p.xz - uCapC.xz, b) + 2.4 * (vnoise(vec3(p.xz * 0.17, p.y * 0.11)) - 0.5);
  return smoothstep(-2.6, 2.6, s);
}`,Jt=`
attribute vec4 aS;
uniform mat4 uPart;
uniform vec3 uSway;
uniform float uPx, uFall, uCapRad, uArrive, uThick, uGroundDrop;
varying vec4 vC;
varying float vSoft, vFog;
${tt}
void main(){
  const float T = 46.0;
  float a = fract(aS.z + uTime / T) * T;
  float th = aS.x * 6.28318, r, y, fade;
  float h1 = fract(aS.w * 13.7), h2 = fract(aS.w * 71.3);
  if (aS.w < 0.64) {
    // the curtain: sifts straight out of the slots, bends outward with the air sliding off the cap
    float r0 = mix(2.6, uCapRad - 0.7, sqrt(aS.y));
    float y0 = mix(1.3, -0.15, smoothstep(3.0, 13.0, r0)) - 0.2;
    float sheet = floor(aS.x * 9.0), acr = fract(aS.x * 9.0) - 0.5;
    th = (sheet + 0.5) * 0.69813 + (r0 / uCapRad) * (0.7 + 0.5 * fract(sheet * 0.37)) + acr * abs(acr) * 1.1;
    r = r0 + (0.03 + 0.15 * r0 / uCapRad) * a * (1.0 + 0.008 * a);
    y = y0 - uFall * a;
    r += 0.55 * sin(a * 0.19 + aS.x * 31.0) * smoothstep(0.0, 8.0, a);
    y += 0.35 * sin(a * 0.13 + aS.y * 43.0) * smoothstep(0.0, 8.0, a);
    th += 0.035 * sin(a * 0.11 + h1 * 6.28) * smoothstep(0.0, 10.0, a);
    fade = smoothstep(0.0, 1.5, a) * (1.0 - smoothstep(T * 0.72, T, a));
    fade *= smoothstep(-uGroundDrop + 0.3, -uGroundDrop + 5.0, y);
    // each sheet thins and thickens as it falls, and no two sheets are equally thick: they hang apart as veils
    fade *= (0.5 + 0.5 * sin(a * 0.35 + sheet * 2.1 + r0 * 0.5)) * (0.55 + 0.9 * fract(sheet * 0.618 + 0.3));
  } else {
    // the rim eddy: falls a little, is drawn out past the lip, curls up and back over the cap
    float r0 = mix(uCapRad - 6.0, uCapRad - 0.6, aS.y);
    float y0 = mix(1.3, -0.15, smoothstep(3.0, 13.0, r0)) - 0.2;
    float t1 = 3.0 + 7.0 * h1;
    float a1 = min(a, t1), b = max(a - t1, 0.0);
    float r1 = r0 + 0.42 * t1, y1 = y0 - uFall * t1;
    float rho0 = max(uCapRad + 0.8 + 2.6 * h2 - r1, 1.3);
    float phi = min(b * 0.85 / rho0, 5.6);
    float rho = rho0 * (1.0 + 0.16 * phi);
    r = r0 + 0.42 * a1 + step(0.0001, b) * (rho0 - rho * cos(phi));
    y = y0 - uFall * a1 - step(0.0001, b) * rho * sin(phi) + 0.10 * b * smoothstep(3.0, 5.0, phi);
    r += 0.3 * sin(a * 0.23 + aS.x * 17.0); th += 0.025 * sin(a * 0.15 + h2 * 6.28);
    fade = smoothstep(0.0, 1.5, a) * (1.0 - smoothstep(4.2, 5.5, phi)) * (1.0 - smoothstep(T * 0.8, T, a));
    fade *= 0.6 + 0.4 * sin(th * 2.0 - uTime * 0.13 + 1.7);
  }
  vec4 lp = uPart * vec4(cos(th) * r, y, sin(th) * r, 1.0);
  float hh = clamp(lp.y / 36.0, 0.0, 1.2);
  lp.xyz += uSway * hh * hh * 1.6;
  float lit = coreMask(lp.xyz) * capLit(lp.xyz);
  float tw = 0.5 + 0.5 * sin(uTime * (3.0 + 9.0 * h2) + aS.w * 300.0);
  tw = tw * tw; tw = tw * tw;
  float glit = step(0.58, h1);                         // some stay dim dust even in the light
  vec3 gold = uSunCol * (0.4 + glit * (0.6 + 4.0 * tw));
  vec3 grey = uSkyCol * 0.62;
  float aGrey = 0.065 * uThick * (0.8 + 1.1 * uArrive * uArrive);       // as the eye comes under the vault the grey veils thicken into sheets
  float aGold = mix(0.10, 0.55, glit) * (0.8 + 0.4 * uArrive);
  float litS = smoothstep(0.45, 0.9, lit);          // only well-lit spores become crisp glitter
  float size = mix(1.5 + 1.1 * h1, 0.11 + 0.12 * h2 + 0.10 * (1.0 - glit), litS);
  vec4 mv = modelViewMatrix * lp;
  float px = size * projectionMatrix[1][1] * uPx * 0.5 / max(-mv.z, 0.5);
  float pmax = mix(30.0, 7.0, litS);
  float pc = clamp(px, 1.6, pmax);
  float cov = min(px / 1.6, 1.0); cov = mix(cov * cov, min(px / 0.6, 1.0), litS);       // glitter in the bar is still seen from the bank
  float al = mix(aGrey, aGold, litS) * fade * cov * (px > pmax ? pmax / px : 1.0) * smoothstep(1.5, 5.0, -mv.z);
  vC = vec4(mix(grey, gold, lit) * al, al * mix(1.0, 0.25, lit));
  vSoft = mix(0.0, 0.35, litS);
  vFog = -mv.z;
  gl_PointSize = pc;
  gl_Position = projectionMatrix * mv;
}`,Pt=`
uniform vec3 fogColor;
#ifdef FOG_EXP2
uniform float fogDensity;
#else
uniform float fogNear, fogFar;
#endif
varying vec4 vC;
varying float vSoft, vFog;
void main(){
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float s = 1.0 - smoothstep(vSoft, 1.0, d);
  s = mix(s * s, s, step(0.01, vSoft));
  vec4 c = vC * s;
  float f = 0.0;
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      f = 1.0 - exp(-fogDensity * fogDensity * vFog * vFog);
    #else
      f = smoothstep(fogNear, fogFar, vFog);
    #endif
  #endif
  c.rgb = mix(c.rgb, fogColor * c.a, f);
  gl_FragColor = c;
}`,te=`
attribute vec4 aS;
uniform float uPx, uFall, uGroundDrop;
uniform vec3 uSway;
varying vec4 vC;
varying float vSoft, vFog;
${tt}
${Zt}
void main(){
  float top = uGroundDrop + 1.5;
  float T = top / max(uFall * 0.7, 0.05);
  float a = fract(aS.z + uTime / T);
  float y = top * (1.0 - a) + 0.4;
  vec3 c = uShaftP + uSunDir * ((y - uShaftP.y) / max(uSunDir.y, 0.2));
  vec3 e1 = normalize(cross(uSunDir, vec3(0.0, 0.0, 1.0)) + vec3(1e-4, 1e-4, 0.0)), e2 = cross(uSunDir, e1);
  float th = aS.x * 6.28318 + 0.3 * sin(uTime * 0.07 + aS.w * 20.0), rr = uGlitR * 0.86 * sqrt(aS.y);
  vec3 p = c + (e1 * cos(th) + e2 * sin(th)) * rr;
  p.x += 0.4 * sin(uTime * 0.21 + aS.w * 31.0); p.z += 0.4 * sin(uTime * 0.17 + aS.w * 57.0);
  p.y = max(p.y, 0.3);
  float hh = clamp(p.y / 36.0, 0.0, 1.2);
  p += uSway * hh * hh * 1.6;
  float lit = glitMask(p) * sunSide(p) * capLit(p);
  // (where the look narrows the part of the shaft that glitters, the specks are thinned with its width, so that the
  // narrow bar is not packed with all that the whole shaft would hold: the rest are not drawn)
  lit *= step(fract(aS.w * 7.31 + aS.x * 3.17), uGlitR / max(uShaftR, 1.0));
  float h2 = fract(aS.w * 71.3);
  float tw = 0.5 + 0.5 * sin(uTime * (3.0 + 9.0 * h2) + aS.w * 300.0);
  tw = tw * tw; tw = tw * tw;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float size = 0.1 + 0.14 * h2;
  float px = size * projectionMatrix[1][1] * uPx * 0.5 / max(-mv.z, 0.5);
  float pc = clamp(px, 1.6, 4.5);
  // (a speck finer than a pixel is drawn a pixel and a half wide and that much fainter, so that from far off the
  // glitter is a faint shimmer in the bar and never a pale cloud in front of the cap)
  float cov = min(px, 1.0); cov *= sqrt(cov);
  float al = 0.5 * smoothstep(0.5, 0.95, lit) * cov * (px > 4.5 ? 4.5 / px : 1.0) * smoothstep(1.5, 5.0, -mv.z) * smoothstep(0.0, 0.06, a) * (1.0 - smoothstep(0.92, 1.0, a));
  vC = vec4(uSunCol * uGlitTint * (0.8 + 4.0 * tw) * al, al * 0.25);
  vSoft = 0.35;
  vFog = -mv.z;
  gl_PointSize = pc;
  gl_Position = projectionMatrix * mv;
}`,ee=`
uniform mat4 uPart;
varying vec3 vL;
void main(){ vec4 lp = uPart * vec4(position, 1.0); vL = lp.xyz; gl_Position = projectionMatrix * modelViewMatrix * lp; }`,ae=`
uniform float uStrength;
varying vec3 vL;
${tt}
void main(){
  vec3 ro = uCamL; vec3 rd = normalize(vL - uCamL + vec3(0.0, 1e-4, 0.0));
  vec3 oc = ro - uShaftP;
  vec3 rdp = rd - uSunDir * dot(rd, uSunDir), ocp = oc - uSunDir * dot(oc, uSunDir);
  float a = max(dot(rdp, rdp), 1e-4), b = dot(rdp, ocp), c = dot(ocp, ocp) - uCoreR * uCoreR;
  float disc = b * b - a * c;
  if (disc <= 0.0) discard;
  float sq = sqrt(disc);
  float t0 = max((-b - sq) / a, 0.0), t1 = max((-b + sq) / a, 0.0);
  float chord = max(t1 - t0, 0.0);
  float dmin = sqrt(max(c + uCoreR * uCoreR - b * b / a, 0.0)) / max(uCoreR, 1.0);
  float edge = 1.0 - smoothstep(0.35, 1.0, dmin);
  vec3 p1 = ro + rd * (t0 + chord * 0.2), p2 = ro + rd * (t0 + chord * 0.4), p3 = ro + rd * (t0 + chord * 0.6), p4 = ro + rd * (t0 + chord * 0.8);
  float lit = 0.45 + 0.55 * 0.25 * (capLit(p1) + capLit(p2) + capLit(p3) + capLit(p4));
  // above the floor only, and thinning toward the canopy
  float gy = 0.25 * (smoothstep(-1.0, 4.0, p1.y) + smoothstep(-1.0, 4.0, p2.y) + smoothstep(-1.0, 4.0, p3.y) + smoothstep(-1.0, 4.0, p4.y));
  vec3 pm = ro + rd * (t0 + chord * 0.5) - uShaftP;
  float along = dot(pm, uSunDir);
  float fadeA = 1.0 - smoothstep(60.0, 150.0, along);
  // leaf-gap streaks that slide as the canopy sways
  vec3 perp = pm - uSunDir * along;
  float streak = 0.72 + 0.28 * vnoise(vec3(perp.y * 0.35 + uTime * 0.05, perp.z * 0.35, uTime * 0.03))
               + 0.18 * vnoise(vec3(perp.y * 1.1, perp.z * 1.1 - uTime * 0.04, 2.0));
  float dens = 1.0 - exp(-chord * 0.011);
  vec3 col = uSunCol * uStrength * dens * edge * lit * gy * fadeA * streak;
  gl_FragColor = vec4(col, 1.0);
}`,B=(o,s,t)=>{const a=Math.min(1,Math.max(0,(t-o)/(s-o)));return a*a*(3-2*a)},M=(o,s,t)=>o+(s-o)*t;function Z(o,s,t,a){const n=Nt(o,s);return Tt(n,a,0,s+1),It(Gt(n),o,s,t)}async function Ft(o,s,t,a,n,l=8){const i=Nt(s,t);for(let h=0;h<=t;h+=l)Tt(i,n,h,Math.min(t+1,h+l)),await o.yield?.();const p=Gt(i);return await o.yield?.(),It(p,s,t,a)}function Nt(o,s){const t=(o+1)*(s+1);return{nu:o,nv:s,pos:new Float32Array(t*3),col:new Float32Array(t*3),aux:new Float32Array(t*2),o:{p:[0,0,0],c:[1,1,1],a:[0,0]}}}function Tt({nu:o,nv:s,pos:t,col:a,aux:n,o:l},i,p,h){const c=o+1;for(let g=p,e=p*c;g<h;g++)for(let f=0;f<c;f++,e++)i(f/o,g/s,l,f,g),t[e*3]=l.p[0],t[e*3+1]=l.p[1],t[e*3+2]=l.p[2],a[e*3]=l.c[0],a[e*3+1]=l.c[1],a[e*3+2]=l.c[2],n[e*2]=l.a[0],n[e*2+1]=l.a[1]}function Gt({nu:o,nv:s,pos:t,col:a,aux:n}){const l=o+1,i=l*(s+1),p=new(i>65535?Uint32Array:Uint16Array)(o*s*6);for(let c=0,g=0;c<s;c++)for(let e=0;e<o;e++){const f=c*l+e,b=f+1,C=f+l,E=C+1;p[g++]=f,p[g++]=b,p[g++]=C,p[g++]=b,p[g++]=E,p[g++]=C}const h=new r.BufferGeometry;return h.setAttribute("position",new r.BufferAttribute(t,3)),h.setAttribute("aCol",new r.BufferAttribute(a,3)),h.setAttribute("aux",new r.BufferAttribute(n,2)),h.setIndex(new r.BufferAttribute(p,1)),h}function It(o,s,t,a){if(o.computeVertexNormals(),a){const n=o.attributes.normal.array,l=s+1;for(let i=0;i<=t;i++){const p=i*l*3,h=(i*l+s)*3;let c=n[p]+n[h],g=n[p+1]+n[h+1],e=n[p+2]+n[h+2];const f=Math.hypot(c,g,e)||1;c/=f,g/=f,e/=f,n[p]=n[h]=c,n[p+1]=n[h+1]=g,n[p+2]=n[h+2]=e}}return o}function oe(o,s){const t=o.range(.97,1.03),a={S:t,Rc:17*t*o.range(.97,1.03),rimY:28*t,dome:o.range(4.9,5.9)*t,umbo:o.range(1.3,1.9)*t,umboR:o.range(2.3,3)*t,leanDir:o.range(0,G),lean:o.range(.5,2)*t,ringY:o.range(19.5,22.5)*t,wave:[o.range(.25,.5)*t,o.range(0,G),o.range(0,G)],seed:o.range(0,50),NG:200,rIn:2.15*t,stalkR:1.3*t,bulbR:2.5*t};return a.stalkTop=a.rimY+a.dome*.86,a.waveAt=(n,l)=>a.wave[0]*Math.pow(Math.min(n/a.Rc,1.05),3)*(.6*Math.sin(l*3+a.wave[1])+.4*Math.sin(l*5+a.wave[2])),a.topY=n=>{const l=Math.min(n/a.Rc,1);return .5*t+a.dome*Math.pow(1-Math.pow(l,2.3),.85)+a.umbo*Math.exp(-(n/a.umboR)*(n/a.umboR))},a.thick=n=>.5*t+1.9*t*(1-Math.pow(Math.min(n/a.Rc,1),1.5)),a.underY=n=>a.topY(n)-a.thick(n),a.depth=n=>2.5*t*B(a.rIn,a.rIn+2.6*t,n)*(1-.86*Math.pow(B(a.Rc*.6,a.Rc,n),1.4)),a.edgeY=n=>a.underY(n)-a.depth(n),a.axis=n=>{const l=Math.max(n,0)/a.stalkTop,i=a.lean*l*l;return[Math.cos(a.leanDir)*i,Math.sin(a.leanDir)*i]},a.stalkRad=n=>{const l=M(a.stalkR,a.stalkR*.84,Math.min(1,Math.max(0,n/a.stalkTop))),i=(a.bulbR-a.stalkR)*Math.exp(-Math.pow(Math.max(n-.6,0)/(3.1*t),2))*B(-1.2,.8,n),p=B(a.stalkTop-3.5*t,a.stalkTop,n);return(l+i+.75*t*p*p)*(n<0?.9+.1*B(-1.2,0,n):1)},a}function re(o,s,t,a){const l=s.stalkTop;return Ft(o,40,92,!0,(i,p,h)=>{const c=i*G,g=M(-1.2,l,Math.pow(p,.92)),e=s.axis(g),f=Math.cos(c),b=Math.sin(c);let C=s.stalkRad(g);C*=1+.035*t.fbm3(f*1.3,g*.22,b*1.3+s.seed,3)+.012*t.n3(f*5,g*1.3,b*5),h.p[0]=e[0]+f*C,h.p[1]=g,h.p[2]=e[1]+b*C,h.c[0]=a.cream.r,h.c[1]=a.cream.g,h.c[2]=a.cream.b,h.a[0]=p,h.a[1]=i})}function ne(o,s,t,a){const n=[[0,1,0],[.22,.8,0],[.9,1,.2],[1.8,1.35,.9],[2.05,1.2,1],[1.25,.6,.35],[.72,.15,.1],[1.3,-.3,.3],[2.2,-.8,.9],[2.3,-1.08,1],[1.45,-.78,.5],[.55,-.62,.15],[0,-.95,0]],l=s.range(0,G),i=s.range(0,G),p=s.range(-.12,.12),h=s.range(-.12,.12),c=s.int(6,9),g=s.int(11,15),e=o.S,f=o.stalkRad(o.ringY)-.06,b=o.axis(o.ringY),C=n.length-1;return Z(64,C*2,!0,(E,$,P)=>{const d=E*G,W=$*C,rt=Math.min(C-1,Math.floor(W)),_=W-rt,X=n[rt],nt=n[rt+1],O=M(X[2],nt[2],_);let it=M(X[0],nt[0],_)*e,N=M(X[1],nt[1],_)*e;const J=.06*Math.sin(d*c+l)+.05*Math.sin(d*g+i)+.16*t.n2(Math.cos(d)*1.9+o.seed,Math.sin(d)*1.9)+.05*t.n2(Math.cos(d)*6+3,Math.sin(d)*6);it*=1+J*O,N+=O*e*(.12*Math.sin(d*(c-2)+i)+.07*Math.sin(d*g+l)+.2*t.n2(Math.cos(d)*1.4+9,Math.sin(d)*1.4+o.seed));const et=f+it,q=Math.cos(d)*et,T=Math.sin(d)*et;P.p[0]=b[0]+q,P.p[1]=o.ringY+N+(q*p+T*h)*(.4+O),P.p[2]=b[1]+T;const at=O*O*O*.8,ot=0;P.c[0]=M(a.cream.r*.9,a.umber.r*1.3,at*.75+ot),P.c[1]=M(a.cream.g*.86,a.umber.g*1.3,at*.75+ot),P.c[2]=M(a.cream.b*.8,a.umber.b*1.3,at*.75+ot),P.a[0]=.5+.5*O,P.a[1]=O*.9})}function se(o,s,t){const i=.3*s.S;return Ft(o,112,35,!0,(p,h,c,g,e)=>{const f=p*G;let b,C;if(e<=30)b=s.Rc*Math.pow(e/30,.85),C=s.topY(b);else{const W=(e-30)/5*Math.PI*.95;b=s.Rc+i*Math.sin(W)*.9,C=s.topY(s.Rc)-i*(1-Math.cos(W))}const E=Math.cos(f),$=Math.sin(f),P=b/s.Rc;C+=s.waveAt(b,f)+.11*t.n3(E*b*.9,$*b*.9,s.seed)*Math.min(1,b*.4);const d=b*(1+.012*P*P*Math.sin(f*9+s.wave[1])+.008*P*P*t.n2(f*6,s.seed));c.p[0]=E*d,c.p[1]=C,c.p[2]=$*d,c.c[0]=c.c[1]=c.c[2]=1,c.a[0]=P,c.a[1]=p})}function ie(o,s){return Z(56,6,!0,(t,a,n)=>{const l=t*G,i=M(o.stalkR*.9,o.Rc+.05,a);n.p[0]=Math.cos(l)*i,n.p[1]=o.underY(i)+o.waveAt(i,l)+.02,n.p[2]=Math.sin(l)*i,n.c[0]=s.cream.r*.8,n.c[1]=s.cream.g*.72,n.c[2]=s.cream.b*.62,n.a[0]=.15+.5*(1-B(0,.25,a)),n.a[1]=.2})}function Lt(o,s,t,a,n,l){const i=Math.PI/o.NG;return Z(a,3,!1,(p,h,c,g,e)=>{const f=M(s,t,p);let b=o.depth(f);l&&(b*=B(s,s+2.2,f)*.82);const C=o.underY(f)+.12,E=o.underY(f)-b,$=l?1:M(.86,.5,B(o.Rc*.42,o.Rc*.56,f)),P=i*f*n*$*Math.min(1,b/.8+.15),d=e===0?P:e===1?.04:e===2?-.04:-P;c.p[0]=f,c.p[1]=e===0||e===3?C:E,c.p[2]=d,c.c[0]=c.c[1]=c.c[2]=1,c.a[0]=e===0||e===3?0:1,c.a[1]=f/o.Rc})}function le(o){return Z(3,2,!1,(s,t,a)=>{const n=(s-.5)*(1-.55*t*t);a.p[0]=n*1.25,a.p[1]=.03+.2*t*t*t+.1*(.25-n*n)*(1-t)+.05*Math.sin(s*9.4)*t,a.p[2]=t*.95-.3;const l=t*t;a.c[0]=M(o.umber.r*.95,o.copper.r*.9,l),a.c[1]=M(o.umber.g*.95,o.copper.g*.9,l),a.c[2]=M(o.umber.b*.95,o.copper.b*.85,l),a.a[0]=s,a.a[1]=t})}function ce(){return Z(12,6,!1,(o,s,t)=>{const a=o,n=(s-.5)*2,l=.33*Math.pow(Math.sin(Math.PI*Math.pow(a,.8)),.75)*(1+.035*Math.sin(a*44)),i=a-.5,p=n*l;t.p[0]=i,t.p[2]=p,t.p[1]=.1*Math.abs(n)*l*3+.16*i*i-.05*Math.sin(a*9)*Math.abs(n)+.02*Math.sin(a*22+n*3)*n,t.c[0]=t.c[1]=t.c[2]=1,t.a[0]=a,t.a[1]=n*l*3})}function ue(o,s){return Z(72,14,!0,(t,a,n)=>{const l=t*G,i=M(o.stalkR*.9,15.5,Math.pow(a,1.25)),p=Math.cos(l),h=Math.sin(l),c=p*i,g=h*i,e=B(9,15.5,i);let f=1.25*Math.exp(-(i/4.4)*(i/4.4))+(.32*s.fbm2(c*.22+o.seed,g*.22,3)+.1*s.n2(c*.9,g*.9))*(1-e)*Math.min(1,i/3);f=f*(1-e)-.55*e,n.p[0]=c,n.p[1]=f,n.p[2]=g,n.c[0]=n.c[1]=n.c[2]=1,n.a[0]=i/15.5,n.a[1]=t})}const Vt={afternoon:{el:17,side:-1,sun:null,sunI:2,sky:null,skyI:.52,ground:.2,shaft:.16},dawn:{el:12,side:1,sun:"#FFB9A6",sunI:1.5,sky:"#E6E2E0",skyI:.68,ground:.2,shaft:.26},day:{el:34,side:-1,sun:"#E9EEF2",sunI:1,sky:"#DCE2DC",skyI:.8,ground:.24,shaft:.1},night:{el:24,side:-1,sun:"#9DB6FF",sunI:1.35,sky:"#40507C",skyI:.36,ground:.06,shaft:.16}};async function fe(o,s={}){const t=o.rng.fork?o.rng.fork("spore-rain-hero"):o.rng,a=o.noise,n=o.quality?.detail??1,l=(s.palette&&s.palette.length>=6?s.palette:Ht).map(u=>new r.Color(u)),i={copper:l[0],umber:l[1],moss:l[2],pearl:l[3],cream:l[4],gold:l[5],scarlet:l[6]||new r.Color("#D8281C")},p=Vt[s.hour]?s.hour:"afternoon",h=Vt[p],c=s.weather==="shower"||s.weather==="frost"?s.weather:"drip",g=s.season==="early"||s.season==="late"?s.season:"october",e=oe(t,a),f=new r.Group;f.name="spore-rain-parasol";const b=r.MathUtils.degToRad(h.el),C=s.sunDir?new r.Vector3().copy(s.sunDir).normalize():new r.Vector3(h.side*Math.cos(b),Math.sin(b),p==="afternoon"?0:.12).normalize(),E=(h.sun?new r.Color(h.sun):i.gold.clone()).multiplyScalar(h.sunI),$=(h.sky?new r.Color(h.sky):i.pearl.clone()).multiplyScalar(h.skyI),P=(p==="night"?new r.Color("#222f4c"):i.copper.clone().lerp($.clone().multiplyScalar(1/h.skyI),.55)).multiplyScalar(p==="night"?1:h.ground*2.1),d={point:new r.Vector3(0,15,9),dir:C,radius:22.5,sway:1.5},W=e.axis(e.rimY),rt=Math.atan(2*e.lean*e.rimY/(e.stalkTop*e.stalkTop))*1.3+t.range(-.015,.03),_=new r.Matrix4().makeRotationAxis(new r.Vector3(Math.sin(e.leanDir),0,-Math.cos(e.leanDir)),rt);_.setPosition(W[0],e.rimY,W[1]);const X=new r.Matrix4,nt=new r.Vector3(0,1,0).transformDirection(_),O=new r.Vector3(0,.6,0).applyMatrix4(_),it=Math.min(1,Math.max(0,(E.r-E.b)/Math.max(E.r,.001)*2.5)),N={uTime:{value:0},uSunDir:{value:C},uSunCol:{value:E},uSkyCol:{value:$},uGroundCol:{value:P},uShaftP:{value:d.point.clone()},uShaftR:{value:d.radius},uCoreR:{value:d.radius},uCapC:{value:O},uCapN:{value:nt},uCapR:{value:e.Rc+.3},uDomeH:{value:e.dome},uCamL:{value:new r.Vector3(0,10,80)},uWet:{value:c==="frost"?.45:c==="shower"?1.25:1},uFrost:{value:c==="frost"?1:0},uSway:{value:new r.Vector3},uWave:{value:new r.Vector3(e.wave[0],e.wave[1],e.wave[2])},uCapRad:{value:e.Rc},uRingY:{value:e.ringY},uSeed:{value:e.seed},uLitter:{value:g==="early"?.8:g==="late"?0:.3},uProgress:{value:-1},uFogK:{value:1},uGlitR:{value:d.radius},uGlitTint:{value:p==="night"?new r.Vector3(1,1,1):new r.Vector3(1.05,.95,.76).lerp(new r.Vector3(1.12,.86,.45),it)},cCopper:{value:i.copper},cUmber:{value:i.umber},cMoss:{value:i.moss},cPearl:{value:i.pearl},cCream:{value:i.cream},cGold:{value:i.gold}},J=[],et=u=>({...r.UniformsUtils.clone(r.UniformsLib.fog),...N,...u}),q=(u,x)=>{const y=new r.ShaderMaterial({defines:{KIND:u},uniforms:et({uPart:{value:x}}),vertexShader:$t,fragmentShader:Xt,fog:!0,side:r.DoubleSide});return J.push(y),y},T=(u,x)=>(u.name=x,u.frustumCulled=!1,u.matrixAutoUpdate=!1,f.add(u),u);T(new r.Mesh(await re(o,e,a,i),q(0,X)),"stalk"),await o.yield?.(),T(new r.Mesh(ne(e,t,a,i),q(3,X)),"ring"),await o.yield?.(),T(new r.Mesh(ue(e,a),q(5,X)),"mound"),await o.yield?.(),T(new r.Mesh(await se(o,e,a),q(1,_)),"cap"),T(new r.Mesh(ie(e,i),q(3,_)),"flesh"),await o.yield?.();const at=q(2,_),ot=G/e.NG,gt=new Float32Array(e.NG),H=new r.Matrix4,j=new r.Vector3,wt=new r.Quaternion,ht=new r.Vector3,xt=new r.InstancedMesh(Lt(e,e.rIn,e.Rc-.22,14,.9,!1),at,e.NG),pt=new r.InstancedMesh(Lt(e,e.Rc*.5,e.Rc-.22,8,.4,!0),at,e.NG);for(let u=0;u<e.NG;u++){const x=(u+t.range(-.07,.07))*ot;gt[u]=x,xt.setMatrixAt(u,H.makeRotationY(-x)),pt.setMatrixAt(u,H.makeRotationY(-(x+ot*(.5+t.range(-.06,.06)))))}T(xt,"gills"),T(pt,"gills-short");const ft=[[pt,230]];await o.yield?.();{const u=[],y=Math.floor(e.Rc/1.02);for(let A=3;A<y;A++){const D=(A+.5)*1.02,z=Math.max(Math.floor(G*D/1.3),3),U=D/e.Rc;for(let v=0;v<z;v++)t.chance(M(.95,.5,U))&&u.push([D,((v+.5-.5*(A%2))/z-.5)*G,U])}const F=new r.InstancedMesh(le(i),q(4,_),u.length),k=new r.Vector3,I=new r.Vector3,S=new r.Vector3,L=new r.Color;u.forEach(([A,D,z],U)=>{const v=A+t.range(-.12,.12),w=Math.cos(D),m=Math.sin(D),R=(e.topY(v+.3)-e.topY(v-.3))/.6;S.set(w,R,m).normalize(),k.set(m,0,-w),I.crossVectors(S,k).normalize();const V=M(1.5,.62,B(.15,1,z))*t.range(.75,1.25)*e.S;H.makeBasis(k,I,S),H.multiply(new r.Matrix4().makeRotationY(t.range(-.3,.3))),H.scale(ht.set(V,V*t.range(.5,1.15),V)),H.setPosition(w*v,e.topY(v)+e.waveAt(v,D)+.01,m*v),F.setMatrixAt(U,H);const K=t.range(.75,1.25);F.setColorAt(U,L.setRGB(K,K*t.range(.92,1.05),K*t.range(.85,1)))}),T(F,"scales"),ft.push([F,270])}await o.yield?.();const mt=new r.Vector3;if(c!=="frost"){const u=Math.round(950*n),x=Math.round(260*n),y=c==="shower"?90:44,F=10,k=u+x+y+F,I=new r.IcosahedronGeometry(1,0),S=new Float32Array(k*4),L=new r.ShaderMaterial({uniforms:et({}),vertexShader:jt,fragmentShader:Qt,fog:!0});J.push(L);const A=new r.InstancedMesh(I,L,k),D=c==="shower"?.45:.12,z=(v,w,m,R,V,K,Q)=>(j.set(Math.cos(m)*w,R,Math.sin(m)*w).applyMatrix4(_),H.makeScale(V,V,V).setPosition(j),A.setMatrixAt(v,H),S[v*4]=Q,S[v*4+1]=K,S[v*4+2]=Math.max(j.y-.3,1),S[v*4+3]=c==="shower"?t.range(2.5,6):t.range(7,16),j);let U=0;for(let v=0;v<u;v++){const w=gt[t.int(0,e.NG-1)],m=M(e.rIn+1.6,e.Rc-.5,Math.sqrt(t())),R=t.range(.09,.21)*(t.chance(.12)?1.5:1);z(U++,m,w,e.edgeY(m)+e.waveAt(m,w)-R*.5,R,t.chance(D)?1:0,t())}for(let v=0;v<x;v++){const w=t.range(0,G),m=e.Rc*Math.sqrt(t.range(.02,.98)),R=t.range(.14,.4);z(U++,m,w,e.topY(m)+e.waveAt(m,w)+R*.45,R,0,t())}for(let v=0;v<y;v++){const w=t.range(0,G),m=e.Rc+.1,R=t.range(.32,.46);z(U++,m,w,e.topY(e.Rc)+e.waveAt(m,w)-.6*e.S-R*.4,R,1,t())}for(let v=0;v<F;v++){const w=Math.PI*M(.92,1.55,v/(F-1))+t.range(-.04,.04),m=e.Rc+.1,R=t.range(.42,.48),V=z(U++,m,w,e.topY(e.Rc)+e.waveAt(m,w)-.6*e.S-R*.4,R,2,.12+.075*v+t.range(-.02,.02));v===4&&mt.copy(V).setY(1.9)}I.setAttribute("iB",new r.InstancedBufferAttribute(S,4)),T(A,"water"),ft.push([A,125])}else mt.set(-e.Rc,1.9,-4);await o.yield?.();const bt=Math.round(9e3*n*(c==="frost"?1.25:1)),lt=et({uPart:{value:_},uPx:{value:900},uFall:{value:c==="shower"?1.5:c==="frost"?.32:.6},uArrive:{value:.35},uThick:{value:c==="frost"?1.7:1},uGroundDrop:{value:e.rimY},uGlitR:N.uGlitR,uGlitTint:N.uGlitTint});{const u=new Float32Array(bt*4);for(let k=0;k<u.length;k++)u[k]=t();const x=new r.BufferGeometry;x.setAttribute("position",new r.BufferAttribute(new Float32Array(bt*3),3)),x.setAttribute("aS",new r.BufferAttribute(u,4));const y=new r.ShaderMaterial({uniforms:lt,vertexShader:Jt,fragmentShader:Pt,fog:!0,transparent:!0,depthWrite:!1,blending:r.CustomBlending,blendEquation:r.AddEquation,blendSrc:r.OneFactor,blendDst:r.OneMinusSrcAlphaFactor,blendSrcAlpha:r.OneFactor,blendDstAlpha:r.OneMinusSrcAlphaFactor});J.push(y);const F=T(new r.Points(x,y),"spores");F.renderOrder=3;{const k=Math.round(4200*n),I=new Float32Array(k*4),S=Ot(Wt("spore-rain-glitter:"+o.seed));for(let z=0;z<I.length;z++)I[z]=S();const L=new r.BufferGeometry;L.setAttribute("position",new r.BufferAttribute(new Float32Array(k*3),3)),L.setAttribute("aS",new r.BufferAttribute(I,4));const A=new r.ShaderMaterial({uniforms:lt,vertexShader:te,fragmentShader:Pt,fog:!0,transparent:!0,depthWrite:!1,blending:r.CustomBlending,blendEquation:r.AddEquation,blendSrc:r.OneFactor,blendDst:r.OneMinusSrcAlphaFactor,blendSrcAlpha:r.OneFactor,blendDstAlpha:r.OneMinusSrcAlphaFactor});J.push(A);const D=T(new r.Points(L,A),"spore-glitter");D.renderOrder=3,D.frustumCulled=!1}}await o.yield?.();const yt=new r.Matrix4;let dt=null;if(s.shaft!==!1){const u=new r.ShaderMaterial({uniforms:{...N,uPart:{value:yt},uStrength:{value:h.shaft}},vertexShader:ee,fragmentShader:ae,side:r.BackSide,transparent:!0,depthWrite:!1,depthTest:!1,blending:r.AdditiveBlending});J.push(u),dt=T(new r.Mesh(new r.CylinderGeometry(1.1,1.1,1,28,1,!0),u),"shaft"),dt.renderOrder=4}{const x=(g==="early"?["#C9B13A","#9AA83A","#B5622B","#D9C25A"]:g==="late"?["#4A2A18","#5A2E17","#6B3A1C","#3A2114"]:["#B5622B","#9A4A1E","#C87A34","#7A3A18"]).map((S,L)=>L===0&&g==="october"?i.copper.clone():new r.Color(S)),y=t.int(6,8),F=new r.InstancedMesh(ce(),q(6,X),y),k=new r.Euler,I=new r.Color;for(let S=0;S<y;S++){const L=r.MathUtils.degToRad(M(-35,105,(S+t.range(.1,.9))/y)),A=S===0,D=A?4.6:t.range(7.5,11.5),z=t.range(10,13);k.set(t.range(-.1,.1),t.range(0,G),A?0:t.range(-.07,.07),"YXZ"),A&&(k.y=-L,k.z=.62),wt.setFromEuler(k),j.set(Math.cos(L)*D,A?3.4:.35+.5*Math.exp(-(D/4.4)*(D/4.4))+S*.06,Math.sin(L)*D),F.setMatrixAt(S,H.compose(j,wt,ht.set(z,z,z))),F.setColorAt(S,I.copy(t.pick(x)).multiplyScalar(t.range(.8,1.1)))}T(F,"leaves")}await o.yield?.();let ct=null;if(s.sibling??t.chance(.7)){const u=r.MathUtils.degToRad(t.range(20,70)),x=t.range(7.5,9.5),y=t.range(8.5,12),F=u+t.range(-.5,.5),k=t.range(.6,1.4);ct=new r.Vector3(Math.cos(u)*x,0,Math.sin(u)*x);const I=new r.Matrix4().makeTranslation(ct.x,.1,ct.z),S=v=>{const w=v/y,m=k*w*w;return[Math.cos(F)*m,Math.sin(F)*m]},L=Z(20,30,!0,(v,w,m)=>{const R=v*G,V=M(-.8,y+.6,w),K=S(Math.max(V,0)),Q=.72*(1-.16*w)+.75*Math.exp(-Math.pow(Math.max(V,0)/1.7,2));m.p[0]=K[0]+Math.cos(R)*Q,m.p[1]=V,m.p[2]=K[1]+Math.sin(R)*Q,m.c[0]=i.cream.r,m.c[1]=i.cream.g,m.c[2]=i.cream.b,m.a[0]=w,m.a[1]=v});T(new r.Mesh(L,q(0,I)),"sibling-stalk"),await o.yield?.();const A=S(y),D=t.range(2.1,2.6),z=D*t.range(1.15,1.4),U=Z(30,16,!0,(v,w,m)=>{const R=v*G,V=w*Math.PI*.87,K=Math.cos(R),Q=Math.sin(R),zt=D*Math.pow(Math.sin(V),.85)*(1+.03*a.n3(K*2,w*4,Q*2+e.seed)),qt=y+z*.85+z*Math.cos(V);m.p[0]=A[0]+K*zt,m.p[1]=qt,m.p[2]=A[1]+Q*zt;const Ut=B(.3,.75,w+.3*a.n3(K*3.3,w*7,Q*3.3+9)),Kt=.5+.5*Math.sin(w*38+3*a.n2(R*2,w*3)),vt=Math.min(1,Ut*(.55+.6*Kt));m.c[0]=M(i.umber.r*1.1,i.cream.r*.92,vt),m.c[1]=M(i.umber.g*1.1,i.cream.g*.88,vt),m.c[2]=M(i.umber.b*1.1,i.cream.b*.8,vt),m.a[0]=1-.6*B(.7,1,w),m.a[1]=.1});T(new r.Mesh(U,q(3,I)),"sibling-cap")}await o.yield?.();const Y=(u,x,y)=>new r.Vector3(u,x,y),ut=[Y(-7,1.9,44),Y(-9.5,1.9,26),Y(-10.5,1.9,12),Y(-10.2,1.9,0),Y(-7,1.9,-8.6),Y(.5,1.9,-13.6),Y(9.5,1.9,-19.8),Y(22,1.9,-33)],St=ut[7].clone().sub(ut[6]).normalize(),_t=Y(0,e.edgeY(e.rIn+2.5)+.4,0).applyMatrix4(_),st=new r.Vector3,Yt={hub:_t,flyThrough:ut,curtainLine:{position:Y(0,12,(u=>{const x=(u-d.point.y)*Math.abs(C.x);return d.point.z-Math.sqrt(Math.max(d.radius*d.radius-x*x,0))})(12)),goldSide:Y(0,0,1)},portalSeat:{position:ut[7].clone().addScaledVector(St,60).setY(7),facing:St.clone().negate()},viewpoints:{entry:Y(0,1.9,300),arc:Y(-8,1.9,150),vault:Y(-10.2,1.9,2)},rimDrip:mt,siblingBase:ct},Mt=new r.Matrix4,Ct=new r.Vector2,kt=new r.Vector3(0,1,0),Rt=new r.Quaternion,Bt=new r.Vector3(Math.cos(e.leanDir+1.1),0,Math.sin(e.leanDir+1.1));let At=-1;function Dt(u,x,y){if(N.uTime.value=x,y){Mt.copy(f.matrixWorld).invert(),N.uCamL.value.setFromMatrixPosition(y.matrixWorld).applyMatrix4(Mt);const k=N.uCamL.value.distanceTo(O);for(const I of ft)I[0].visible=k<I[1]}o.renderer&&(o.renderer.getDrawingBufferSize(Ct),lt.uPx.value=Ct.y),N.uSunDir.value=d.dir,N.uShaftR.value=d.radius,N.uCoreR.value=Math.min(d.core||d.radius,d.radius),st.crossVectors(d.dir,kt),st.lengthSq()<1e-6&&st.set(0,0,1),st.normalize();const F=d.sway*(.7*Math.sin(x*.21)+.3*Math.sin(x*.53+1.3));N.uShaftP.value.copy(d.point).addScaledVector(st,F),dt&&(Rt.setFromUnitVectors(kt,d.dir),j.copy(N.uShaftP.value).addScaledVector(d.dir,45),yt.compose(j,Rt,ht.set(d.radius,300,d.radius))),N.uSway.value.copy(Bt).multiplyScalar(.16*Math.sin(x*.43)+.06*Math.sin(x*1.13+2))}function Et(u){At=u,N.uProgress.value=u,lt.uArrive.value=.35+.65*B(0,.35,u)*(1-B(.8,1,u))}return Dt(0,0,null),{object:f,radius:e.Rc+1,height:e.rimY+e.dome+e.umbo+.5,center:new r.Vector3(W[0]*.5,e.rimY*.62,W[1]*.5),anchors:Yt,update:Dt,setProgress:Et,uniforms:N,shaft:d,shape:{capRadius:e.Rc,rimY:e.rimY,ringY:e.ringY,capMatrix:_},get progress(){return At},dispose(){},ground:!0,groundY:-.02}}export{Qt as BEAD_FRAG,tt as GLSL_COMMON,fe as buildHero,ce as buildLeaf,Z as gridGeo,Ft as gridGeoAsync};
