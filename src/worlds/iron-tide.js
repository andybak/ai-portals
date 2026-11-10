import*as e from"three";import{makePath as $t}from"../kit/core.js";import*as Fe from"../kit/fx.js";import{buildHero as Xt,IRON_TIDE_SKY_GLSL as _e,IRON_TIDE_FOG_GLSL as de,IRON_TIDE_ARM_GLSL as Jt,IRON_TIDE_SPIRE_FRAG as vt,IRON_TIDE_SOLID_VERT as yt,IRON_TIDE_SOLID_FRAG as wt,IRON_TIDE_FILING_FRAG as Zt,IRON_TIDE_RIBBON_FRAG as Qt}from"../parts/iron-tide.js";const O=Math.PI*2,oe=10,gt=9,se=20,eo={gold:{palette:["#EFE2B0","#D9B95A","#9A8440","#D4D7DC","#1B1A17","#0A0A0C","#2FD6C0"],lamp:"#2FD6C0",bole:"#5e1f10",tint:"#fff8e6",title:"The Iron Tide"},rose:{palette:["#F1D3B4","#CF9468","#8C5438","#E6DAD2","#1C1716","#0B0909","#35D8C4"],lamp:"#F4F6FF",bole:"#4a1420",tint:"#fff1e8",title:"The Iron Tide, Red-Gold Leaf"},silver:{palette:["#C9D1DC","#66748C","#49556B","#F1F5FB","#15181D","#08090C","#5AA6F0"],lamp:"#8CC4FF",bole:"#101a36",tint:"#eef3ff",title:"The Iron Tide, Silver Nocturne"}},xt=`
uniform vec4 uMag[${oe}];
uniform float uField;
vec4 itBloom(vec2 p, out float capM, out float qMin){
  float F = 0.0, S = 0.0, fr = 0.0;
  capM = 200.0; qMin = 1000.0;
  for (int k = 0; k < ${oe}; k++) {
    vec4 m = uMag[k];
    float st = abs(m.z);
    float sym = step(m.z, 0.0);
    vec2 d = (p - m.xy) / max(m.w, 0.1);
    float ahead = -d.y, lat = d.x;
    float gl = exp(-lat * lat / 2700.0);
    float ef = ahead / 36.0, eb = max(-ahead, 0.0) / mix(42.0, 30.0, sym);
    float lon = ahead > 0.0 ? exp(-ef * ef) : exp(-eb * sqrt(eb));
    float h = st * gl * lon;
    float sk = mix(ahead > -8.0 ? 1.0 : max(0.6, exp((ahead + 8.0) / 80.0)), 0.85, sym);
    F += h; S += h * sk;
    float e2 = (ahead - 33.0) / 10.0;
    fr += st * gl * exp(-e2 * e2) * (1.0 - sym);
    float q = length(vec2(lat, ahead * 0.5));
    if (st > 0.001) { capM = min(capM, mix(8.0 * m.w, 200.0, smoothstep(7.0, 24.0, q))); qMin = min(qMin, q * m.w); }
  }
  return vec4(F, S / max(F, 1e-4), fr, 0.0);
}
`,to=`
varying vec3 vD;
void main(){
  vD = position;
  vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  if (abs(p.w) < 1e-4) p.w = 1e-4;
  gl_Position = p;
}
`,oo=`
varying vec3 vD;
${_e}
void main(){
  vec3 d = normalize(vD);
  vec3 col = itSky(d, 1.0);
  if (d.y < 0.0) col *= 0.9;
  gl_FragColor = vec4(col, 1.0);
}
`,ao=`
varying vec3 vW;
#include <fog_pars_vertex>
void main(){
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vW = wp.xyz;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,io=`
uniform vec3 uBlack, uChrome, uTeal;
uniform float uRim, uLatK, uDir, uBloomK, uRain, uTime, uLaneX, uBeam;
varying vec3 vW;
${_e}
${Jt}
${de}
${xt}
vec2 hexGrad(vec2 p, float k){
  vec2 k1 = vec2(1.0, 0.0) * k, k2 = vec2(0.5, 0.8660254) * k, k3 = vec2(-0.5, 0.8660254) * k;
  return -(k1 * sin(dot(k1, p)) + k2 * sin(dot(k2, p)) + k3 * sin(dot(k3, p)));
}
void main(){
  vec3 V = normalize(cameraPosition - vW);
  vec2 p = vW.xz;
  float r = length(p);
  float fwp = max(fwidth(p.x), fwidth(p.y));
  vec2 g = vec2(0.0);
  // the Crown's lattice runs out past the rim
  float mask = (1.0 - smoothstep(uRim - 20.0, uRim + 190.0, r)) * uField;
  vec2 arm = itArm(atan(p.x, p.y + 1e-4) * uDir, r);
  float fw = fwp * uLatK;
  g += hexGrad(p, uLatK) * mask * mask * (0.12 + 0.75 * arm.x) / (1.0 + fw * fw * 6.0);
  // the blooms' weak fringe
  float capM, qMin;
  vec4 b = itBloom(p, capM, qMin);
  float fringe = smoothstep(0.004, 0.05, b.x) * (1.0 - 0.5 * smoothstep(0.1, 0.4, b.x)) * uField;
  // under a bloom the whole surface is drawn up and ruffled, and gives the sky back: a pool of gold on the lacquer
  float pool = smoothstep(0.02, 0.5, b.x) * clamp(uField, 0.0, 1.0);
  float fb = fwp * uBloomK;
  g += hexGrad(p - vec2(uLaneX, 0.0), uBloomK) * fringe * 0.16 / (1.0 + fb * fb * 6.0);
  // iron rain: every drop raises a spikelet that sinks again
  vec2 q = p / 1.9;
  vec2 id = floor(q), f = fract(q) - 0.5;
  float h = itHash(id);
  float ph = fract(uTime * (0.7 + 0.5 * h) + h * 9.0);
  vec2 dd = f - (vec2(itHash(id + 1.7), itHash(id + 5.3)) - 0.5) * 0.5;
  float fq = fwp / 1.9;
  float drop = exp(-dot(dd, dd) * 130.0) * sin(ph * 3.14159) * step(h, 0.7) * uRain / (1.0 + fq * fq * 40.0);
  g += dd * drop * 34.0;
  // field reversal: the fluid the Crown has let go of rings outward across the mirror
  float calm = 1.0 - clamp(uField, 0.0, 1.0);
  float rp = r * 0.12 - uTime * 6.0;
  float fr2 = fwp * 0.12;
  float ringK = calm / (1.0 + fr2 * fr2 * 6.0);
  g += (p / max(r, 1.0)) * (cos(rp) * 0.12 + cos(rp * 3.7 + 1.3) * 0.04) * ringK;
  float crest = 0.5 + 0.5 * sin(rp);
  // travelling ripple rings: every lodestone that passes tugs the mirror, and the rings run out from under it
  vec2 gr = vec2(0.0);
  for (int k = 0; k < ${oe}; k++) {
    vec4 m = uMag[k];
    vec2 dv = p - m.xy;
    float dl = length(dv);
    float ph = dl * 0.5 - uTime * 2.6 + float(k) * 1.7;
    float amp = abs(m.z) * m.w * exp(-dl / 150.0) * smoothstep(3.0, 26.0, dl);
    gr += dv / max(dl, 1.0) * (sin(ph) + 0.35 * sin(ph * 2.3 + 1.0)) * amp;
  }
  float fwr = fwp * 0.5;
  gr *= 0.05 / (1.0 + fwr * fwr * 5.0);
  // and a long slow swell, so the leaf squares in the mirror are never quite still
  gr += vec2(sin(p.y * 0.043 + uTime * 0.5 + sin(p.x * 0.021) * 2.0), cos(p.x * 0.037 - uTime * 0.4)) * 0.006 / (1.0 + fwp * fwp * 0.02);
  g += gr;
  vec3 N = normalize(vec3(-g.x, 1.0, -g.y));
  float F = clamp(itSeaFresnel(dot(N, V)) + crest * crest * crest * ringK * 0.5 + pool * 0.2, 0.0, 1.0);
  vec3 R = reflect(-V, N);
  R.y = abs(R.y) + 1e-4;
  // the mirror gives back the whole leaf sky, squares and seams and all
  // (the big squares of the high vault come back soft at the camera's feet, so ripples never marble them)
  vec3 sky = itSkyMirror(R, mix(1.0, 0.4, smoothstep(0.3, 0.8, R.y))) * 0.96;
  // the one light lays a long path on the mirror, from the horizon under it toward the eye, broken by every ripple
  vec2 sxz = normalize(uSkySun.xz + vec2(0.0, -1e-4));
  float daz = 1.0 - dot(normalize(R.xz + vec2(1e-5, 0.0)), sxz);
  float glit = 0.6 + 0.4 * sin(p.x * 0.83 + p.y * 1.27 + uTime * 2.3 + sin(p.y * 0.21 - uTime * 0.9) * 3.0) / (1.0 + fwp * fwp * 3.0);
  float sunPath = (exp(-daz * 1500.0) * 1.5 + exp(-daz * 110.0) * 0.3) * exp(-R.y * 2.4) * glit;
  sky += vec3(1.0, 0.9, 0.68) * sunPath;
  // away from the light the mirror keeps less of the sky: lacquer
  // (a broad river of gold under the light, lacquer either side of it, even at a glance)
  F *= mix(0.36, 1.0, itNearSun(R)) * mix(1.0, 0.6, smoothstep(0.15, 0.7, R.y)) * mix(0.34, 1.0, exp(-daz * 4.5));
  // lacquer shows on the back of a ripple, the side that leans away from the eye
  float back = dot(gr, normalize(V.xz + vec2(1e-5, 0.0)));
  F *= 1.0 - 0.6 * smoothstep(0.012, 0.07, -back);
  // no cast shadows in this world except the soft dark patch under a levitating slab
  sky *= 1.0 - 0.3 * exp(-qMin * qMin / 260.0);
  vec3 col = uBlack * 0.6 * (1.0 - F) + sky * F;
  // the lacquer carries the leaf: what the mirror does not keep of the vault (1 - F) still gives back the leaf's seams and
  // its glints whole, thin gold lines and single lit squares on the black, by the same reflected ray (so every ripple
  // breaks them like the rest of the image, and the high vault comes back soft at the feet as it does above); the flat
  // tone between them stays lacquer. One rule on every bearing: where the mirror keeps the vault (F near 1) it adds nothing
  vec2 leafLn = itLeafLines(R) * mix(1.0, 0.4, smoothstep(0.3, 0.8, R.y));
  col += mix(uSkyHor, uSkyTop, 0.62) * (leafLn.x + leafLn.y) * (1.0 - F) * (1.0 - 0.3 * exp(-qMin * qMin / 260.0));
  // the fresh film lights the mirror round the feet of the spikes it stands on
  col += uTeal * (clamp(b.z, 0.0, 1.0) * 0.3 * pool + arm.y * mask * mask * 0.2) * clamp(uField, 0.0, 1.0);
  col += uChrome * drop * drop * 0.5;
  // the field column on the Crown's axis lays a cool pool on the mirror round the Crown, broken by every ripple
  col += uTeal * (0.5 * exp(-r * r / 160000.0) + 0.1 * exp(-r / 800.0)) * (0.55 + 0.45 * glit) * clamp(uField, 0.0, 1.0) * uBeam * mix(0.35, 1.0, F);
  // far off the mirror goes into the haze at the foot of the vault in that direction: bronze and verdigris on the dark
  // side, bright under the light, so the horizon is a line in the picture and never a blank pale band
  #ifdef USE_FOG
    vec3 foot = itSky(normalize(vec3(-V.x, 0.035, -V.z) + vec3(1e-5, 0.0, 0.0)), 0.0);
    col = mix(col, mix(fogColor, min(foot, vec3(1.6)), 0.7), itFog());
  #endif
  gl_FragColor = vec4(col, 1.0);
}
`,Mt=`
attribute vec4 aC;   // x, z, seed, height limit from the camera corridor
uniform float uFlip, uPixH, uTime, uHmax, uR0;
uniform vec3 uLean;  // xz direction, y amount
varying vec3 vN, vW;
varying float vFresh, vT, vS, vSeed;
#include <fog_pars_vertex>
${xt}
float prof(float t, float s){
  float dome = 0.88 * sqrt(max(1.0 - t * t, 0.0)) + 0.12 * exp(-t * 14.0);
  float nd = 0.52 * pow(max(1.0 - t, 0.0), 3.4) + 0.48 * (1.0 - t) * exp(-t * 10.0);
  return mix(dome, nd, s);
}
void main(){
  float t = position.y;
  float a = 0.5235988 + position.x * 6.2831853;
  float capM, qMin;
  vec4 b = itBloom(aC.xy, capM, qMin);
  float rnd = 0.6 + 0.4 * fract(aC.z * 7.31);
  float breathe = 1.0 + 0.08 * sin(uTime * (1.1 + aC.z) + aC.z * 40.0);
  float H = uHmax * pow(min(b.x, 1.3), 1.35) * rnd * breathe - 1.3;
  H = min(min(H, capM), aC.w) * uField;
  float live = step(0.3, H);
  H = max(H, 0.3);
  float s = clamp(b.y * (0.62 + 0.38 * smoothstep(1.5, 13.0, H)), 0.0, 1.0);
  float fresh = clamp(b.z * 0.85, 0.0, 1.0) * smoothstep(0.5, 6.0, H) * clamp(uField, 0.0, 1.0);
  float t0 = min(t, 0.985);
  float R0 = uR0 * mix(0.42, 1.0, smoothstep(2.0, 17.0, H)) * smoothstep(0.3, 2.5, H);
  float r = prof(t, s) * R0;
  float dr = (prof(t0 + 0.012, s) - prof(t0, s)) * R0 / 0.012;
  float hx = 0.8660254 / cos(mod(a + 0.5235988, 1.0471976) - 0.5235988);
  r *= mix(hx, 0.9, smoothstep(0.0, 0.22, t));
  vec3 dir = vec3(sin(a), 0.0, cos(a));
  vec3 lp = vec3(aC.x, t * H, aC.y) + dir * r;
  lp.xz += uLean.xz * (uLean.y * t * t * H);
  vec3 n = normalize(vec3(dir.x * H, -dr, dir.z * H) + vec3(0.0, 1e-4, 0.0));
  lp.y *= uFlip; n.y *= uFlip;
  vec4 wp = vec4(lp, 1.0);
  vec4 cp0 = projectionMatrix * viewMatrix * wp;
  float pix = cp0.w / (projectionMatrix[1][1] * uPixH * 0.5);
  float want = max(r, 0.45 * pix * step(t, 0.999));
  wp.xyz += dir * (want - r);
  if (live < 0.5) wp.xyz = vec3(aC.x, -3.0, aC.y);
  vW = wp.xyz;
  vN = n;
  vFresh = fresh; vT = t; vS = s; vSeed = aC.z;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,bt=`
uniform float uFlip;
varying vec3 vN, vW;
#include <fog_pars_vertex>
void main(){
  vec3 lp = position; lp.y *= uFlip;
  vec4 wp = modelMatrix * vec4(lp, 1.0);
  vW = wp.xyz;
  vN = normalize(mat3(modelMatrix) * vec3(normal.x, normal.y * uFlip, normal.z));
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,kt=`
uniform vec3 uBlack, uMatte, uChrome;
uniform float uFlip, uTime;
varying vec3 vN, vW;
${_e}
${de}
void main(){
  if (vW.y * uFlip < 0.03) discard;
  vec3 V = normalize(cameraPosition - vW);
  vec3 N = normalize(vN);
  float up = abs(N.y);
  float hemi = 0.3 + 0.7 * (up * 0.5 + 0.5);
  float fwr = max(fwidth(vW.x), fwidth(vW.z));
  float rip = sin(vW.x * 2.1 + sin(vW.z * 0.31) * 2.4 + abs(vW.y) * 5.0);
  rip *= 1.0 / (1.0 + fwr * fwr * 6.0);
  vec3 col = uMatte * (2.3 + 0.9 * rip) * hemi * uSkyHor;
  float nv = clamp(abs(dot(N, V)), 0.0, 1.0);
  col += itSky(reflect(-V, N), 0.0) * 0.07 * pow(1.0 - nv, 3.0);
  vec2 gid = floor(vW.xz * 5.0);
  float gh = itHash(gid);
  float tw = step(0.988, gh) * pow(0.5 + 0.5 * sin(uTime * (2.0 + gh * 5.0) + gh * 80.0 + dot(V.xz, vec2(31.0, 17.0))), 6.0);
  col += uChrome * tw * 0.9 / (1.0 + fwr * fwr * 30.0);
  if (uFlip < 0.0) {
    float F = itSeaFresnel(abs(V.y));
    vec3 behind = itSky(vec3(V.x, abs(V.y), V.z) * -1.0, 0.0);
    gl_FragColor = vec4(itMirrorFog(col * 0.6, vec3(0.0), behind, uBlack * 0.6, F, cameraPosition.y, vW.y), 1.0);
  } else {
    gl_FragColor = vec4(itApplyFog(col), 1.0);
  }
}
`,zt=`
uniform float uWhip, uTime;
vec3 chArc(float u, vec4 A, vec2 Y, float seed){
  float sn = pow(max(sin(u * 3.14159265), 0.0), 0.8);
  vec3 p = vec3(0.0, mix(Y.x, Y.y, u), mix(A.x, A.y, u));
  p.x += sin(A.w) * A.z * sn; p.y += cos(A.w) * A.z * sn;
  p.x += sin(uTime * 1.3 + u * 5.0 + seed * 6.0) * uWhip * sn * 14.0;
  p.y += cos(uTime * 1.7 + u * 4.0 + seed * 9.0) * uWhip * sn * 5.0;
  return p;
}
`,no=`
attribute vec4 aA;
attribute vec2 aY;
attribute vec4 aB;   // phase, speed, size, seed
uniform float uPixH;
varying vec2 vUv;
varying float vI, vSeed;
#include <fog_pars_vertex>
${zt}
void main(){
  float u = fract(aB.x + uTime * aB.y);
  float sd = aB.w;
  vec3 p = chArc(u, aA, aY, floor(sd * 8.0) / 8.0);
  vec3 j = vec3(sin(sd * 91.7 + uTime * 0.6), sin(sd * 57.3 + uTime * 0.45), cos(sd * 33.1 + uTime * 0.5));
  p += j * (0.8 + 3.2 * fract(sd * 7.31)) * sin(u * 3.14159);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  float pix = -mvPosition.z / (projectionMatrix[1][1] * uPixH * 0.5);
  float size = max(aB.z, 1.25 * pix);
  float dim = clamp((aB.z * aB.z) / (size * size), 0.2, 1.0);
  mvPosition.xy += position.xy * size;
  vUv = position.xy;
  float tw = pow(0.5 + 0.5 * sin(uTime * (5.0 + 9.0 * fract(sd * 3.7)) + sd * 100.0), 5.0);
  vI = (0.3 + 2.6 * tw) * dim * smoothstep(0.0, 0.07, u) * smoothstep(1.0, 0.93, u) * smoothstep(0.6, 4.0, -mvPosition.z);
  vSeed = sd;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,so=`
attribute vec4 aA;
attribute vec2 aY;
attribute vec3 aU;   // u along the arc, side, seed
uniform float uPixH;
varying float vU, vSide, vSeed;
#include <fog_pars_vertex>
${zt}
void main(){
  vec3 p = chArc(aU.x, aA, aY, aU.z), p2 = chArc(aU.x + 0.012, aA, aY, aU.z);
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vec3 tg = normalize(p2 - p + vec3(0.0, 0.0, 1e-5));
  vec3 vd = normalize(cameraPosition - wp.xyz);
  vec3 sdir = normalize(cross(tg, vd) + vec3(1e-5, 0.0, 0.0));
  vec4 cp0 = projectionMatrix * viewMatrix * wp;
  float pix = cp0.w / (projectionMatrix[1][1] * uPixH * 0.5);
  wp.xyz += sdir * aU.y * max(0.3, 1.0 * pix);
  vU = aU.x; vSide = aU.y; vSeed = aU.z;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,ro=`
attribute vec4 aE;   // lateral offset, start z, speed, seed
attribute vec2 aF;   // hops in a chain, lane wobble
uniform float uTime, uPixH, uRay, uHop, uBaseY, uHopH, uBody;
varying float vS, vSide, vSeed, vY;
#include <fog_pars_vertex>
vec3 eelAt(float ph, float N){
  // eels leap; rays lift off and settle over three hops, so their kite stays near level
  float ew = mix(0.5, 3.0, uRay);
  float env = smoothstep(0.0, ew, ph) * (1.0 - smoothstep(N - ew, N, ph));
  float y = (uBaseY + uHopH * pow(abs(sin(ph * 3.14159265)), 0.8)) * env - 3.0 * (1.0 - env);
  return vec3(aE.x + sin(ph * 0.9 + aE.w * 20.0) * aF.y, y, aE.y - ph * uHop);
}
void main(){
  float N = aF.x, s = position.x, side = position.y;
  float ph = mod(uTime * aE.z + aE.w * 37.0, N + 2.0) - 1.0 - s * uBody;
  vec3 p = eelAt(ph, N), p2 = eelAt(ph + 0.03, N);
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vec3 tg = normalize(p2 - p + vec3(0.0, 0.0, -1e-5));
  vec3 vd = normalize(cameraPosition - wp.xyz);
  // a ray keeps its wings level even when it leaps, so it is always a kite and never a blade on edge
  vec3 th = normalize(vec3(tg.x, 0.0, tg.z) + vec3(0.0, 0.0, -1e-4));
  vec3 sdir = normalize(mix(cross(tg, vd), cross(th, vec3(0.0, 1.0, 0.0)), uRay) + vec3(1e-5, 0.0, 0.0));
  vec4 cp0 = projectionMatrix * viewMatrix * wp;
  float pix = cp0.w / (projectionMatrix[1][1] * uPixH * 0.5);
  float sn = max(sin(s * 3.14159265), 0.0);
  float w = mix(max(0.34 * sqrt(sn) + 0.05, 0.8 * pix), 3.0 * sn * sqrt(sn) + 0.04, uRay);
  wp.xyz += sdir * side * w;
  wp.y += uRay * abs(side) * sin(uTime * 3.2 + aE.w * 30.0 - s * 2.0) * w * 0.45;
  vS = s; vSide = side; vSeed = aE.w; vY = wp.y;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,lo=`
uniform vec3 uBlack, uChrome, uSkyHor, uTeal;
uniform float uTime, uRay;
varying float vS, vSide, vSeed, vY;
${de}
void main(){
  if (vY < 0.05) discard;
  float glint = pow(0.5 + 0.5 * sin(vS * 18.0 - uTime * 9.0 + vSeed * 40.0), 6.0);
  float edge = abs(vSide);
  vec3 eel = uBlack * 0.4 + uSkyHor * 0.45 * (1.0 - edge * edge) + uChrome * (0.3 + 1.5 * glint) * (1.0 - 0.6 * edge);
  vec3 ray = uBlack * 0.55 + uSkyHor * 0.05 * (1.0 - edge) + (uChrome * 0.6 + uSkyHor * 0.7) * smoothstep(0.8, 1.0, edge)
    + uTeal * (1.4 * glint + 0.25) * (1.0 - smoothstep(0.0, 0.16, edge));
  gl_FragColor = vec4(itApplyFog(mix(eel, ray, uRay)), 1.0);
}
`,co=`
attribute vec4 aP;   // offset in the sheet, seed
attribute float aS;  // sheet index
uniform vec4 uSheet[9];   // centre, yaw
uniform float uTime, uPixH, uJelly;
varying vec3 vW;
varying vec2 vMark;    // bird: x = 1 on the outline, y = 1 on the spine; jelly: x = 1 on the bell's rim, y = 1 on the needle it carries
varying float vAlong;  // place along the body: the nose is at -z
#include <fog_pars_vertex>
void main(){
  vec4 sh = uSheet[int(aS + 0.5)];
  float seed = aP.w;
  float yaw = sh.w + (seed - 0.5) * 0.3 + 0.1 * sin(uTime * 1.3 + seed * 30.0);
  vec2 f = vec2(sin(yaw), cos(yaw));
  vec3 c = sh.xyz + aP.xyz;
  c.y += sin(uTime * (0.7 + seed) + seed * 50.0) * 0.6;
  c.xz += vec2(sin(uTime * 0.31 + seed * 17.0), cos(uTime * 0.27 + seed * 23.0)) * 0.8;
  vec4 cp0 = projectionMatrix * viewMatrix * vec4(c, 1.0);
  float pix = cp0.w / (projectionMatrix[1][1] * uPixH * 0.5);
  // the sheets over the Crown fly close past the lens: larger there
  float sc = max(1.0 + mix(1.7, 0.9, uJelly) * step(3.5, aS), 2.2 * pix) * (0.8 + 0.5 * fract(seed * 9.1));
  vec3 lp = position;
  float pulse = 1.0 + 0.2 * sin(uTime * 2.2 + seed * 40.0);
  lp.xz *= mix(1.0, mix(1.0, pulse, step(0.0, lp.y)), uJelly);
  lp *= sc;
  vec3 wp = c + vec3(-f.y, 0.0, f.x) * lp.x + vec3(0.0, 1.0, 0.0) * lp.y - vec3(f.x, 0.0, f.y) * lp.z;
  vW = wp;
  vMark = uv;
  vAlong = position.z;
  vec4 mvPosition = viewMatrix * vec4(wp, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,uo=`
uniform vec3 uBlack, uChrome, uTeal;
uniform float uJelly;
varying vec3 vW;
varying vec2 vMark;
varying float vAlong;
${_e}
${de}
void main(){
  vec3 dx = dFdx(vW), dy = dFdy(vW);
  vec3 N = normalize(cross(dx, dy) + vec3(0.0, 1e-6, 0.0));
  vec3 V = normalize(cameraPosition - vW);
  if (dot(N, V) < 0.0) N = -N;
  float nv = clamp(dot(N, V), 0.0, 1.0), fr = 1.0 - nv;
  // a made thing of this world: lacquer black with a mirror sheen that gives the gold vault back, facet by facet
  vec3 R = reflect(-V, N);
  float sg = max(dot(R, uSkySun), 0.0), sg4 = sg * sg * sg * sg;
  vec3 col = uBlack * 0.3 + itSky(R, 0.0) * (0.06 + 0.5 * fr * fr * fr) + uChrome * 0.9 * sg4 * sg4 * sg4;
  // a fine bright edge all round and a thinner line down the spine (never wider than a sixth of a facet, so a far
  // bird stays a dark dart)
  vec2 fw = fwidth(vMark);
  float rim = smoothstep(1.0 - clamp(2.2 * fw.x, 0.05, 0.17), 1.0, vMark.x);
  float spine = smoothstep(1.0 - clamp(1.6 * fw.y, 0.03, 0.1), 1.0, vMark.y);
  // the marked end of the needle: teal, lit from inside like the lamps
  float tip = 1.0 - smoothstep(-1.08, -0.84, vAlong);
  vec3 edgeCol = uSkyHor * 0.75 + uChrome * 0.45;
  vec3 bird = col + edgeCol * (0.85 * rim + 0.4 * spine * (1.0 - rim));
  bird = mix(bird, uTeal * (0.9 + 1.5 * fr + 1.2 * rim), tip);
  // the jelly: a dark glossy bell with a teal rim that glows up into the glass, and under it the needle it carries
  // (black, a bright edge, its marked end teal)
  float lipJ = smoothstep(0.55, 1.0, vMark.x);
  vec3 bell = col + uTeal * (1.7 * lipJ * lipJ + 0.3 * vMark.x * fr);
  vec3 needle = mix(col + edgeCol * 0.5 * smoothstep(0.6, 1.0, vMark.x), uTeal * (1.2 + 1.2 * fr), 1.0 - smoothstep(-0.9, -0.3, vAlong));
  vec3 jelly = mix(bell, needle, step(0.5, vMark.y));
  gl_FragColor = vec4(itApplyFog(mix(bird, jelly, uJelly)), 1.0);
}
`,fo=`
attribute vec4 aG;   // base x, y, z, seed
uniform float uTime, uPixH, uFloatY;
uniform vec3 uLean;
uniform vec4 uMag[${oe}];
varying vec3 vW, vD;
varying float vT;
#include <fog_pars_vertex>
void main(){
  vec3 base = aG.xyz;
  float seed = aG.w;
  vec3 f = vec3(0.0, 1e-4, 0.0);
  for (int k = 0; k < ${oe}; k++) {
    vec4 m = uMag[k];
    vec3 d = vec3(m.x, uFloatY * m.w, m.y) - base;
    f += abs(m.z) * d / (dot(d, d) + 500.0);
  }
  f /= max(length(f), 1e-5);
  vec3 D = f + vec3(0.0, 0.2, 0.0) + vec3(uLean.x, 0.0, uLean.z) * uLean.y * 3.0;
  D += vec3(sin(uTime * 2.3 + seed * 60.0), 0.0, cos(uTime * 1.9 + seed * 47.0)) * (0.05 + 0.25 * uLean.y);
  D += (vec3(fract(seed * 13.7), fract(seed * 29.3), fract(seed * 41.1)) - 0.5) * 0.22;
  D = normalize(D);
  D.y = abs(D.y) + 0.06; D = normalize(D);
  float len = 0.7 + 1.0 * fract(seed * 5.3);
  float t = position.y;
  vec3 wp = base + D * (len * t);
  vec3 vd = normalize(cameraPosition - wp);
  vec3 sdir = normalize(cross(D, vd) + vec3(1e-5, 0.0, 0.0));
  vec4 cp0 = projectionMatrix * viewMatrix * vec4(wp, 1.0);
  float pix = cp0.w / (projectionMatrix[1][1] * uPixH * 0.5);
  wp += sdir * position.x * max(0.035, 0.6 * pix) * (1.0 - t);
  vW = wp; vD = D; vT = t;
  vec4 mvPosition = viewMatrix * vec4(wp, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,po=`
uniform vec3 uBlack, uMatte, uChrome, uSkyHor, uSkySun;
varying vec3 vW, vD;
varying float vT;
${de}
void main(){
  vec3 V = normalize(cameraPosition - vW);
  vec3 Hh = normalize(V + uSkySun);
  float dh = dot(normalize(vD), Hh);
  float spec = pow(max(1.0 - dh * dh, 0.0), 36.0);
  vec3 col = uBlack * 0.5 + uMatte * uSkyHor * (1.0 + 2.6 * vT) + uChrome * spec * (0.25 + 0.75 * vT) * 0.85;
  gl_FragColor = vec4(itApplyFog(col), 1.0);
}
`,ho=`
attribute vec4 aG;   // x, y, z, seed
uniform vec4 uMag[${oe}];
uniform float uTime;
varying float vR, vOpen;
#include <fog_pars_vertex>
void main(){
  float open = 0.0;
  for (int k = 0; k < ${oe}; k++) {
    vec2 d = uMag[k].xy - aG.xz;
    open += abs(uMag[k].z) * exp(-dot(d, d) / 4200.0);
  }
  open = clamp(open * 1.4 + 0.08 * sin(uTime * 0.9 + aG.w * 40.0), 0.0, 1.0);
  float rad = length(position.xz);
  float sz = 0.55 + 0.5 * fract(aG.w * 7.7);
  float ca = cos(aG.w * 6.28), sa = sin(aG.w * 6.28);
  vec3 lp = vec3(position.x * ca - position.z * sa, 0.0, position.x * sa + position.z * ca);
  lp.xz *= mix(0.3, 1.0, open);
  lp.y = rad * rad * mix(1.7, 0.16, open) + 0.12;
  vec3 wp = aG.xyz + lp * sz;
  vR = rad; vOpen = open;
  vec4 mvPosition = viewMatrix * vec4(wp, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,mo=`
uniform vec3 uSkySeam, uSkyHor;
varying float vR, vOpen;
${de}
void main(){
  vec3 col = uSkySeam * (0.5 + 0.75 * vR) * (0.6 + 0.6 * vOpen) * mix(vec3(1.0), uSkyHor, 0.5);
  gl_FragColor = vec4(itApplyFog(col), 1.0);
}
`,St=`
attribute vec2 aK;
uniform float uFlip, uField;
varying vec2 vK;
varying vec3 vWp;
#include <fog_pars_vertex>
void main(){
  // (a tip is a spike's: in the field reversal it drops flat with every other spike in the world)
  vec3 lp = position; lp.y *= uFlip * mix(1.0, clamp(uField, 0.02, 1.3), step(0.99, aK.x));
  vec4 wp4 = modelMatrix * vec4(lp, 1.0);
  vWp = wp4.xyz;
  vec4 mvPosition = viewMatrix * wp4;
  vK = aK;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,Ft=`
uniform vec3 uBlack, uSkyTop, uSkyHor, uSkySun, uLamp, uTeal;
uniform float uFlip;
varying vec2 vK;
varying vec3 vWp;
${de}
void main(){
  float k = clamp(vK.x, 0.0, 1.0), k2 = k * k;
  // lacquer black, the leaf's gold caught toward every tip
  vec3 col = uBlack * 0.7 + uSkyTop * uSkyTop * 0.3 * k2 + uSkyHor * 0.5 * k2 * k2 * k2 * k2;
  // every facet is lacquer: gold where it turns away from the eye, a hot line where it faces the light
  vec3 N = normalize(cross(dFdx(vWp), dFdy(vWp)) + vec3(0.0, 1e-6, 0.0));
  vec3 V = normalize(cameraPosition - vWp);
  float nv = abs(dot(N, V)), rim = 1.0 - nv;
  float toSun = max(dot(N, uSkySun) * sign(dot(N, V) + 1e-6), 0.0);
  col += (uSkyTop * 0.9 * rim * rim * rim + uSkyHor * 0.8 * toSun * toSun * toSun * toSun) * mix(0.3, 1.0, smoothstep(0.1, 0.5, k));
  float film = clamp(vK.y, 0.0, 0.5) * 2.0 * step(vK.y, 0.6);
  col += uTeal * film * (0.25 + 0.9 * rim * rim);
  col = mix(col, uLamp * 3.6, step(0.9, vK.y));
  if (uFlip < 0.0) col *= 0.6;
  #ifdef USE_FOG
    // they stand a kilometre off: the haze takes them slowly, so they stay shapes on the horizon line
    col = mix(col, fogColor, itFogAt(vFogDepth * 0.4) * 0.9);
  #endif
  gl_FragColor = vec4(col, 1.0);
}
`;function Ue(u,l){const L=[],I=[],H=l.length;for(let s=0;s<H;s++)for(let T=0;T<u;T++)L.push(T/u,l[s],0);for(let s=0;s<H-1;s++)for(let T=0;T<u;T++){const N=s*u+T,F=s*u+(T+1)%u,V=N+u,x=F+u;s===H-2?I.push(N,F,V):I.push(N,F,V,F,x,V)}return{pos:L,idx:I}}function Ke(u,l,L,I){const H=new e.InstancedBufferGeometry;H.setAttribute("position",new e.Float32BufferAttribute(u.pos,3)),H.setIndex(u.idx);const s=new Float32Array(l.length*4);for(let T=0;T<l.length;T++){const N=l[T];s.set([N.x,N.z,N.seed,N.cap],T*4)}return H.setAttribute("aC",new e.InstancedBufferAttribute(s,4)),H.instanceCount=l.length,H.boundingSphere=new e.Sphere(new e.Vector3(l.cx,0,L),I),H}function At(){const u=[],l=[],L=[],I=[],H=new e.Vector3;return{add(s,T,N,F,V,x){const B=s.index?s.toNonIndexed():s,w=B.attributes.position;for(let _=0;_<w.count;_++){H.fromBufferAttribute(w,_),T&&H.applyMatrix4(T),x&&x(H),u.push(H.x,H.y,H.z),l.push(N),L.push(typeof F=="function"?F(Math.floor(_/3)):F);const o=V?V(H):null;o?I.push(o[0],o[1],o[2],o[3]):I.push(0,0,0,0)}B!==s&&B.dispose(),s.dispose()},build(){const s=new e.BufferGeometry;return s.setAttribute("position",new e.Float32BufferAttribute(u,3)),s.setAttribute("aGlow",new e.Float32BufferAttribute(l,1)),s.setAttribute("aTone",new e.Float32BufferAttribute(L,1)),s.setAttribute("aSw",new e.Float32BufferAttribute(I,4)),s.computeVertexNormals(),s.computeBoundingSphere(),s}}}async function $e(u,l,L,I,H=!1){const s=At(),T=new e.Matrix4,N=[],F=(o,p,c)=>T.makeTranslation(o,p,c),V=o=>{const p=Math.max(0,(-o.y-2)/7)*.22;return[p,0,p*.35,0]},x=o=>{const p=Math.sin(o*127.1+31.7)*43758.5453;return p-Math.floor(p)};s.add(new e.BoxGeometry(10,4,30,5,2,14),null,0,o=>x(o)>.92?.85:.04+.2*x(o+9),null,o=>{const p=Math.abs(o.z)/15,c=p*p*p,b=o.z<0?.5:.28;o.x*=1-b*c,o.y*=1-.3*c;const A=l.n3(o.x*.23+9.1,o.y*.3,o.z*.23),C=l.n3(o.x*.7,o.y*.7+4,o.z*.7),P=Math.hypot(o.x,o.y*2.5,o.z*.33)||1,q=A*.6+C*.22;o.x+=o.x/P*q,o.y+=o.y*2.5/P*q*.6,o.z+=o.z*.33/P*q}),await I();for(const o of[-1,1])for(const p of[-1,1])s.add(new e.BoxGeometry(.3,3.4,.3),F(o*1.9,-3.5,p*3),0,.9,V);s.add(new e.BoxGeometry(.8,.7,25),F(0,-2.55,.5),0,.82,null);for(const o of[-1,1])s.add(new e.BoxGeometry(.14,.14,21),F(o*.62,-2.8,.5),1,.3,null);for(let o=0;o<7;o++){const p=-11+o*3.7,c=Math.abs(p)/15,b=4.3*(1-(p<0?.5:.28)*c*c*c);s.add(new e.BoxGeometry(b*2,.5,.42),F(0,-2.5,p),0,.7,null);for(const A of[-1,1])s.add(new e.OctahedronGeometry(.24),F(A*(b-.1),-2.9,p),2.2,.5,null)}if(L){const o=new e.Matrix4().makeRotationY(Math.PI/4);for(let p=0;p<3;p++){const c=5.6-1.3*p,b=-5.7-1.75*p;if(s.add(new e.BoxGeometry(c,1.1,c),F(0,b,0),0,.3,V),s.add(new e.BoxGeometry(c+.08,.3,c+.08),F(0,b,0),1,.3,V),s.add(new e.CylinderGeometry(c*.98,c*.5,.55,4,1),F(0,b-.82,0).multiply(o),0,.75,V),p===0)for(const A of[-1,1])for(const C of[-1,1])s.add(new e.OctahedronGeometry(.3),F(A*c*.7,b-1.2,C*c*.7),2,.5,V),N.push([A*c*.7,b-1.2,C*c*.7])}s.add(new e.ConeGeometry(.5,1.7,4),F(0,-11.4,0).multiply(new e.Matrix4().makeRotationX(Math.PI)),0,.9,V)}else{s.add(new e.BoxGeometry(4.4,3,7.5),F(0,-6.5,0),0,.3,V),s.add(new e.BoxGeometry(5.3,.3,8.5),F(0,-4.95,0),0,.75,V),s.add(new e.BoxGeometry(4.9,.25,8),F(0,-8.1,0),0,.75,V);for(const o of[-1,1])for(const p of[-2.4,0,2.4])s.add(new e.BoxGeometry(.1,.55,1.5),F(o*2.21,-6.4,p),1,.3,V);for(const o of[-1,1])s.add(new e.BoxGeometry(1.7,.55,.1),F(0,-6.4,o*3.76),1,.3,V);for(const o of[-2.6,0,2.6])s.add(new e.OctahedronGeometry(.42),F(0,-8.8,o),2,.5,V),N.push([0,-8.8,o])}await I();{const o=-(se+2);for(const p of[-1,1])for(const c of[-10.5,-3.5,3.5,10.5]){const b=[];for(let C=0;C<=12;C++){const P=C/12*Math.PI/2;b.push(new e.Vector3(p*(4+8.5*Math.sin(P)),-1.6+(o+9.6)*(1-Math.cos(P)),c*(1+.3*Math.sin(P))+4*Math.sin(P)))}const A=C=>{const P=Math.min(1,Math.max(0,(-C.y-2)/14));return[P*.25,0,P*.7,c*.4+p]};s.add(new e.TubeGeometry(new e.CatmullRomCurve3(b),9,.09,3),null,.13,.9,A)}}if(await I(),H)return{geometry:s.build(),lamps:N};const B=-(se+2),w=[];for(let o=0;o<=10;o++){const p=o/10;w.push(new e.Vector3(0,-2+(B+2.4)*(1-Math.pow(1-p,1.8)),14.5+40*p))}const _=o=>{const p=Math.min(1,Math.max(0,(o.z-14.5)/40));return[Math.sin(p*Math.PI)*.6,0,0,1.3]};s.add(new e.TubeGeometry(new e.CatmullRomCurve3(w),14,.17,4),null,0,.85,_),s.add(new e.OctahedronGeometry(.42),F(0,B+.5,54.6),1.2,1,null);for(let o=0;o<12;o++){const p=4.4*(1-o/13)*u.range(.8,1.15);s.add(new e.ConeGeometry(.34,p,5,1,!0),F(u.range(-.15,.15),B+p/2,57.2+o*3.1),0,1,null)}{const o=new e.CatmullRomCurve3(w),p=o.getLength(),c=6*.34,b=Math.round(p/c*6),A=o.computeFrenetFrames(b,!1),C=[],P=[],q=[],E=new e.Vector3,D=new e.Vector3;for(let m=0;m<=b;m++){const U=m/b*p/c*O;q.push(A.normals[m].clone().multiplyScalar(Math.cos(U)).addScaledVector(A.binormals[m],Math.sin(U))),P.push(o.getPointAt(m/b).addScaledVector(q[m],.2))}const $=[];for(let m=0;m<=b;m++)D.subVectors(P[Math.min(m+1,b)],P[Math.max(m-1,0)]).cross(q[m]).normalize().multiplyScalar(.05),$.push([P[m].clone().sub(D),P[m].clone().add(D)]);for(let m=0;m<b;m++)for(const U of[$[m][0],$[m][1],$[m+1][0],$[m][1],$[m+1][1],$[m+1][0]])C.push(U.x,U.y,U.z);const j=new e.BufferGeometry;j.setAttribute("position",new e.Float32BufferAttribute(C,3)),s.add(j,null,0,2,_);for(let m=1;m*3.7<p;m++)o.getPointAt(m*3.7/p,E),s.add(new e.OctahedronGeometry(.24),F(E.x,E.y,E.z),2.2,.5,_)}return await I(),{geometry:s.build(),lamps:N}}function Rt(u,l){const L=(s,T)=>{const N=(s-l.cx)/l.hw,F=(T-l.cz)/l.hl,V=1-(N*N+F*F)-.22*u.n2(s/70+l.cx,T/70);if(V<=0)return V*5;const x=Math.min(1,V/.6),B=x*x*(3-2*x);return l.peak*B*(.74+.26*u.n2(s/26+3,T/26))+.35*Math.sin(s*.42+T*.13)*B},I=new e.PlaneGeometry(l.hw*2.5,l.hl*2.4,l.nx,l.nz);I.rotateX(-Math.PI/2);const H=I.attributes.position;for(let s=0;s<H.count;s++){const T=H.getX(s)+l.cx,N=H.getZ(s)+l.cz;H.setXYZ(s,T,Math.max(L(T,N),-.8),N)}return I.computeVertexNormals(),I.computeBoundingSphere(),{h:L,geometry:I}}function vo(u){const l=new e.InstancedBufferGeometry;return l.setAttribute("position",new e.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),l.setIndex([0,1,2,0,2,3]),l.instanceCount=u,l}const ae=(u,l,L,I)=>u.setAttribute(l,new e.InstancedBufferAttribute(L,I));function Tt(u,l,L){const I=[],H=[],s=(x,B,w,_,o,p,c)=>{I.push(x[0],x[1],x[2],B[0],B[1],B[2],w[0],w[1],w[2]),H.push(_,c,o,c,p,c)},T=(x,B,w,_,o=0)=>{for(let p=0;p<5;p++){const c=p/5*O,b=(p+1)/5*O;s([x+Math.cos(c)*w,0,B+Math.sin(c)*w],[x+Math.cos(b)*w,0,B+Math.sin(b)*w],[x,_,B],0,0,1,o)}},N=(x,B,w,_,o,p,c,b,A=1)=>{const C=[];for(let P=0;P<8;P++){const q=P&4?1:-1;C.push([x+(P&1?_:-_)*(q<0?A:1),B+(P&2?o:-o),w+q*p])}for(const P of[[0,1,3,2],[4,6,7,5],[0,4,5,1],[2,3,7,6],[0,2,6,4],[1,5,7,3]])s(C[P[0]],C[P[1]],C[P[2]],c,c,c,b),s(C[P[0]],C[P[2]],C[P[3]],c,c,c,b)},F=(x,B,w,_,o)=>{for(let p=0;p<_;p++){const c=Math.abs(w),b=u.range(-.45,1)*o*w,A=u.gauss()*13*c;let C=(7+36*Math.exp(-(b*b)/(2600*c*c)))*c*u.range(.55,1.1)*Math.exp(-(A*A)/(700*c*c));Math.abs(A)<8*c&&Math.abs(b)<20*c&&(C=Math.min(C,9*c)),C>2&&T(x+A,B+b,(2.2+C*.09)*1.3,C,b*Math.sign(w)<-.1*o*Math.abs(w)?.45:.08)}};for(const x of l)for(const B of x.zs){const w=x.s*u.range(.9,1.1),_=x.dir;N(x.x,22*w,B,5*w,2*w,15*w,.16,0,.55),N(x.x,15.6*w,B,2.2*w,1.5*w,3.8*w,.1,0),N(x.x,13.2*w,B,.7*w,.7*w,3*w,0,1);for(const o of[-1,1])N(x.x,24.3*w,B+o*13.5*w,.5*w,.4*w,.5*w,0,1);for(const o of[34,52,76]){const p=o*w,c=p+(1.2+o*.03)*w;for(let b=0;b<20;b++){const A=b/20*O,C=(b+1)/20*O,P=B+_*10*w,q=(E,D)=>[x.x+Math.cos(D)*E*.8,.4,P+Math.sin(D)*E];s(q(p,A),q(c,A),q(c,C),0,0,0,0),s(q(p,A),q(c,C),q(p,C),0,0,0,0)}}F(x.x,B+_*6*w,w*_,34,84)}for(const x of L)F(x.x,x.z,x.s,x.n,70);const V=new e.BufferGeometry;return V.setAttribute("position",new e.Float32BufferAttribute(I,3)),V.setAttribute("aK",new e.Float32BufferAttribute(H,2)),V.computeBoundingSphere(),V}var go={id:"iron-tide",name:"The Iron Tide",category:"alien",weirdness:.75,media:["air","open"],async build(u){const{rng:l,noise:L}=u,{clamp:I,lerp:H,smoothstep:s}=u.core,T=u.vary||{},N=u.quality?.detail??1,F=I(T.density??1,.7,1.3),V=!!T.rare,x=l.fork("look");let B=x.pick(["gold","gold","gold","rose","rose","rose","silver","silver"]);T.hour==="day"?B="gold":T.hour==="golden"||T.hour==="dawn"?B="rose":T.hour==="night"&&(B="silver");const w=x.pick(["calm","calm","rain","storm"]),_=x.chance(.4),o=x.chance(.35),p=x.chance(.28),c=eo[B],b=44,A=new e.Scene,C=new e.Color(c.palette[0]).lerp(new e.Color(c.palette[1]),.8).multiplyScalar(.62);w==="rain"&&C.multiplyScalar(.9);const P=w==="calm"?.0019:.0022,q=64e-5;A.fog=new e.FogExp2(C,P),A.background=C.clone(),await u.yield();const E=await Xt(u,{palette:c.palette,bole:c.bole,sky:!1,sea:!1});A.add(E.object);const D=E.anchors,$=E.skyUniforms;await u.yield();const j=D.lattice.laneX,m=j+18,U=$t([[m-8.5,2.2,1650],[m-8.5,2.2,1592],[m-4.5,2.6,1553],[m-1.5,3.2,1518],[m-4,4.2,1482],[m-11,5.4,1442],[m-17,7.5,1398],[m-15,9.5,1338],[m-17.5,9,1270],[m-19,8.5,1185],[m-18.5,10.5,1095],[m-16.5,12.5,1005],[m-9.5,10.5,915],[m-7,9.5,845],[m-7,9.8,770],[m-9.5,12.5,728],[m-15,19,690],...D.flyThrough.slice(1)],{samples:640});await u.yield();const Bt=U.nearestXZ(D.lanePoint.x,D.lanePoint.z).u,he=new e.Vector3,Ge=t=>{for(let a=0;a<=400;a++)if(U.pointAt(a/400,he).z<=t)return a/400;return 1},Ct=Ge(500),Ae=8*b,Xe=940,we=t=>Xe-Ae*t,W=[];if(p)W.push({o:0,s:1},{o:148,s:1},{o:200,s:2.4},{o:410,s:1},{o:600,s:1});else{const t=[0,66,152,218,282,348,410];for(let a=0;a<7;a++)W.push({o:t[a]+(a?l.range(-7,7)*.5:0),s:1});W.push({o:600,s:1})}const Re=(Xe-1650)/(Ae-U.length),re=I(Re+.05,.4,Ct-.085);await u.yield();const ge=Rt(L,{cx:j-96,cz:1175,hw:36,hl:125,peak:6,nx:30,nz:84});await u.yield();const Pt=Rt(L,{cx:j+540,cz:l.range(820,1e3),hw:l.range(60,85),hl:l.range(170,230),peak:l.range(7,11),nx:14,nz:34});await u.yield();const le=1180+l.range(-25,25);let ee=j-96;for(;ge.h(ee,le)>.3&&ee<j-40;)ee+=.5;const De=[{x:ee+10,z:le-6},{x:ee+27,z:le+9}],te=[];for(let t=0;t<oe;t++)te.push(new e.Vector4(0,0,0,1));const Je=l.range(0,O),Ie={uMag:{value:te},uLean:{value:new e.Vector3(Math.sin(Je),0,Math.cos(Je))},uWhip:{value:0},uRain:{value:w==="rain"?1:0},uFloatY:{value:se+2}},xe=new e.Color(c.lamp),_t=new e.Color(c.palette[0]).lerp(new e.Color("#ffffff"),.35),K=(t,a,r={},v={})=>new e.ShaderMaterial({vertexShader:t,fragmentShader:a,fog:!0,uniforms:{...e.UniformsUtils.clone(e.UniformsLib.fog),...$,...Ie,...r},...v}),Q=(t,a=0,r=!1)=>(t.frustumCulled=r,t.renderOrder=a,A.add(t),t),Gt=Q(new e.Mesh(new e.SphereGeometry(4200,32,16),new e.ShaderMaterial({vertexShader:to,fragmentShader:oo,uniforms:$,side:e.BackSide,depthWrite:!1,depthTest:!1,fog:!1})),-1);{const t=new e.CircleGeometry(4300,64);t.rotateX(-Math.PI/2),Q(new e.Mesh(t,K(ao,io,{uRim:{value:E.radius},uLatK:{value:4*Math.PI/(Math.sqrt(3)*D.lattice.spacing)},uDir:{value:D.spin.dir},uBloomK:{value:4*Math.PI/(Math.sqrt(3)*gt)},uLaneX:{value:m}},{depthWrite:!1})),-.5)}await u.yield();const Dt=K(bt,kt,{uFlip:{value:1}}),It=K(bt,kt,{uFlip:{value:-1}},{side:e.DoubleSide});for(const t of[ge.geometry,Pt.geometry])Q(new e.Mesh(t,Dt),0,!0),Q(new e.Mesh(t,It),-.4,!0);const Ze=()=>({uGrain:{value:.45},uGlowAmp:{value:3.2},uTeal:{value:xe},uBounce:{value:1}}),Me=K(yt,wt,{uRefl:{value:0},...Ze()},{side:e.DoubleSide}),Ht=K(yt,wt,{uRefl:{value:1},...Ze()},{side:e.DoubleSide}),He=(t,a)=>{const r=new e.Mesh(t.geometry,Ht);return r.position.copy(t.position),r.position.y*=-1,r.scale.copy(t.scale),r.scale.y*=-1,r.renderOrder=-.4,a.add(r),r};{const t=At(),a=new e.Matrix4,r=d=>{const M=Math.sin(d*91.3+7.7)*43758.5453;return M-Math.floor(M)};for(let d=0;d<10;d++)for(const M of[-1,1]){const S=l.range(6.4,8.6),y=ee-3+d*4.5+l.range(-.3,.3),R=le+M*2.7+l.range(-.3,.3);t.add(new e.CylinderGeometry(.62,.78,S,6,1),a.makeTranslation(y,S/2,R),0,n=>.04+.22*r(n+d*31))}const v=new e.Mesh(t.build(),Me);A.add(v),He(v,A)}await u.yield();const Ne=()=>u.yield(),be=await $e(l.fork("barge"),L,!1,Ne);await u.yield();const Ve=p?await $e(l.fork("giant"),L,!0,Ne):null;await u.yield();const ie=new e.Group;A.add(ie);const ce=[],Qe=[],ue=[],fe=[],et=(t,a,r,v,d,M,S=1)=>{for(const y of t)for(const R of[1,-1])M.push([a+y[0]*d,(r+y[1]*d)*R,v+y[2]*d]),ue.push(xe.clone().multiplyScalar((R>0?1:.5)*S)),fe.push((d>1?1.7:1)*(S>1?1.25:1)),M.push([a+y[0]*d,(r+y[1]*d)*R,v+y[2]*d]),ue.push(_t.clone().multiplyScalar(R>0?2.2:1.1)),fe.push(.3*(d>1?1.7:1))};for(const t of W){const a=t.s>1?Ve:be,r=new e.Mesh(a.geometry,Me);r.position.set(0,(se+2)*t.s,t.o),r.scale.setScalar(t.s),ie.add(r),ce.push({mesh:r,mirror:He(r,ie),y:r.position.y,ph:l.range(0,O)}),t===W[W.length-1]&&(ce[ce.length-1].mirror.visible=!1),et(a.lamps,0,r.position.y,t.o,t.s,Qe,t===W[W.length-1]?1.8:1)}const me={value:0},tt=Fe.makeGlows({rng:l.fork("lamps"),positions:Qe,colors:ue.slice(),sizes:fe.slice(),size:2.4,intensity:2.2,flicker:.22,time:me});tt.object.frustumCulled=!1,ie.add(tt.object),await u.yield();const Te=[];ue.length=0,fe.length=0;for(const t of De){const a=new e.Mesh(be.geometry,Me);a.position.set(t.x,se+2,t.z),a.rotation.y=l.range(-.12,.12),A.add(a),ce.push({mesh:a,mirror:He(a,A),y:a.position.y,ph:l.range(0,O),moored:!0}),et(be.lamps,t.x,se+2,t.z,1,Te)}{const t=l.fork("rim");for(const[r,v,d,M]of[[-44,80,386,2.2],[43,84,380,2.2],[-122,106,322,2],[124,103,328,2]]){const S=new e.Mesh(be.geometry,Me);S.position.set(j+r,v,d),S.scale.setScalar(M),S.rotation.y=t.range(-.2,.2)+(r>0?-.25:.25),A.add(S),ce.push({mesh:S,mirror:new e.Object3D,y:v,ph:t.range(0,O),moored:!0});for(const y of be.lamps){const R=Math.cos(S.rotation.y),n=Math.sin(S.rotation.y);Te.push([S.position.x+(y[0]*R+y[2]*n)*M,v+y[1]*M,d+(-y[0]*n+y[2]*R)*M]),ue.push(xe.clone().multiplyScalar(1.4)),fe.push(2.2)}}const a=await $e(t.fork("pagoda"),L,!0,Ne,!0);await u.yield();{const d=new e.Mesh(a.geometry,Me);d.position.set(D.orbit*178,290,104),d.scale.setScalar(3.4),d.rotation.y=D.orbit*.5,A.add(d),ce.push({mesh:d,mirror:new e.Object3D,y:290,ph:t.range(0,O),moored:!0});const M=Math.cos(d.rotation.y),S=Math.sin(d.rotation.y);for(const y of a.lamps)Te.push([d.position.x+(y[0]*M+y[2]*S)*3.4,290+y[1]*3.4,d.position.z+(-y[0]*S+y[2]*M)*3.4]),ue.push(xe.clone().multiplyScalar(1.6)),fe.push(2.6)}}const ot=new e.Group,at=new e.Group;{const t=l.fork("far"),a=D.orbit,r=(n,h,f)=>{const i=[];let g=n;for(let k=0;k<h;k++)i.push(g),g+=f*t.range(.8,1.25);return i},v=(n,h,f,i,g)=>{const k=[];for(let G=0;G<n;G++)k.push({x:t.range(h,f),z:t.range(i,g),s:t.range(1.2,2.2),n:16});return k},d=Tt(t,[{x:a*640,zs:r(-210,5,150),s:3,dir:1},{x:-a*780,zs:r(430,6,96),s:1.9,dir:1}],[...v(4,a*380,a*1e3,500,1500),...v(4,-a*420,-a*1100,900,1700)]);await u.yield();const M=Tt(t,[{x:a*430,zs:r(-1280,6,104),s:2,dir:-1},{x:-a*540,zs:r(-1400,6,110),s:2.1,dir:-1}],[...v(4,-900,900,-1900,-1e3),...v(3,a*700,a*1200,-700,-100)]),S=()=>({uLamp:{value:xe}}),y=K(St,Ft,{uFlip:{value:1},...S()},{side:e.DoubleSide}),R=K(St,Ft,{uFlip:{value:-1},...S()},{side:e.DoubleSide});for(const[n,h]of[[ot,d],[at,M]]){const f=new e.Mesh(h,y),i=new e.Mesh(h,R);f.frustumCulled=i.frustumCulled=!1,i.renderOrder=-.4,n.add(f,i),A.add(n)}}await u.yield();const Nt=Fe.makeGlows({rng:l.fork("lamps2"),positions:Te,colors:ue,sizes:fe,size:2.4,intensity:2.2,flicker:.22,time:me});A.add(Nt.object),await u.yield();const pe=470,Le=1700,Be=6,ke=(Le-pe)/Be,it=[];{const t=gt,a=t*.8660254,r=Math.ceil(88/a),v=[],d=[];for(let i=0;i<Be;i++)v.push([]),d.push([]);const M=Math.floor(pe/t);for(let i=-r;i<=r;i++)for(let g=M;g<=Math.ceil(Le/t);g++){g===M&&await u.yield();const k=m+i*a,G=(g+(i&1?.5:0))*t;if(G<pe||G>=Le||ge.h(k,G)>-.7||k>ee-5&&k<ee+44&&Math.abs(G-le)<5.5)continue;const z=U.nearestXZ(k,G);let Y=200;if(z.y<60){if(z.dist<8.5)continue;Y=z.dist<15?(z.dist-8.5)*3+.5:z.dist<35?20+(z.dist-15)*2.6:Math.min(200,72+(z.dist-35)*5)}const J={x:k,z:G,seed:l(),cap:Y},X=Math.min(Be-1,Math.floor((G-pe)/ke));(z.dist<27?v[X]:d[X]).push(J)}await u.yield();const S=Ue(10,[0,.04,.12,.26,.5,.75,.93,1]),y=Ue(6,[0,.1,.45,.85,1]),R=Ue(4,[0,.12,.5,1]),n={uHmax:{value:38},uR0:{value:t/Math.sqrt(3)},uSheen:{value:.5}},h=K(Mt,vt,{uFlip:{value:1},uRefl:{value:0},...n}),f=K(Mt,vt,{uFlip:{value:-1},uRefl:{value:1},...n},{side:e.DoubleSide});for(let i=0;i<Be;i++){const g=pe+(i+.5)*ke,k=Math.hypot(110,ke/2+10,50),G=v[i].concat(d[i]);v[i].cx=d[i].cx=G.cx=m;const z=[];v[i].length&&z.push(Q(new e.Mesh(Ke(S,v[i],g,k),h),0,!0)),d[i].length&&z.push(Q(new e.Mesh(Ke(y,d[i],g,k),h),0,!0)),G.length&&z.push(Q(new e.Mesh(Ke(R,G,g,k),f),-.4,!0)),it.push({a:pe+i*ke,b:pe+(i+1)*ke,meshes:z}),await u.yield()}}await u.yield();{const t=[];for(let z=0;z+1<W.length;z++){const Y=W[z],J=W[z+1],X=J.o-Y.o,Z=Math.round(9*Math.min(1.25,Math.max(.8,X/90)));for(let Ye=0;Ye<Z;Ye++){const mt=H(-1.08,1.08,(Ye+l.range(.15,.85))/Z),Kt=l.range(58,90)*Math.pow(X/78,.55)*(.75+.25*Math.cos(mt));t.push({A:[Y.o+7*Y.s,J.o-7*J.s,Kt,mt],Y:[(se+4)*Y.s,(se+4)*J.s],seed:l()})}}const a=Math.round(72*F*N),r=t.length*a,v=vo(r),d=new Float32Array(r*4),M=new Float32Array(r*2),S=new Float32Array(r*4);for(let z=0;z<r;z++){const Y=t[z%t.length];d.set(Y.A,z*4),M.set(Y.Y,z*2),S.set([l(),-(.05+.035*Y.seed)*l.range(.85,1.15),l.range(.4,.95)*(l.chance(.08)?2.1:1),(Math.floor(Y.seed*8)+l())/8],z*4)}ae(v,"aA",d,4),ae(v,"aY",M,2),ae(v,"aB",S,4);const y=new e.Mesh(v,K(no,Zt,{},{transparent:!0,depthWrite:!1,blending:e.AdditiveBlending}));y.frustumCulled=!1,y.renderOrder=3,ie.add(y),await u.yield();const R=30,n=[],h=[],f=[],i=[],g=[];for(const z of t){const Y=n.length/3,J=Math.floor(z.seed*8)/8;for(let X=0;X<=R;X++)for(const Z of[-1,1])n.push(0,0,0),h.push(...z.A),f.push(...z.Y),i.push(X/R,Z,J);for(let X=0;X<R;X++){const Z=Y+X*2;g.push(Z,Z+1,Z+2,Z+1,Z+3,Z+2)}}const k=new e.BufferGeometry;k.setAttribute("position",new e.Float32BufferAttribute(n,3)),k.setAttribute("aA",new e.Float32BufferAttribute(h,4)),k.setAttribute("aY",new e.Float32BufferAttribute(f,2)),k.setAttribute("aU",new e.Float32BufferAttribute(i,3)),k.setIndex(g);const G=new e.Mesh(k,K(so,Qt,{},{transparent:!0,depthWrite:!1,side:e.DoubleSide}));G.frustumCulled=!1,G.renderOrder=2,ie.add(G)}await u.yield();{const t=Math.round((_?40:72)*F),a=12,r=[],v=[];for(let f=0;f<=a;f++)for(const i of[-1,0,1])r.push(f/a,i,0);for(let f=0;f<a;f++){const i=f*3;v.push(i,i+1,i+3,i+1,i+4,i+3,i+1,i+2,i+4,i+2,i+5,i+4)}const d=new e.InstancedBufferGeometry;d.setAttribute("position",new e.Float32BufferAttribute(r,3)),d.setIndex(v),d.instanceCount=t;const M=new Float32Array(t*4),S=new Float32Array(t*2),y=l.fork("eels"),R=_?2:6;let n=null;for(let f=0;f<t;f++){const i=f%R;if(i===0){const g=y.chance(.62);n=[_?g?y.range(-84,-52):y.range(16,48):g?y.range(-44,-33):y.range(9,17),y.range(90,640),y.range(.5,.8),y(),y.int(8,12),_?y.range(2,6):y.range(.5,2)]}M.set([n[0]+(_?i*7:0),n[1],n[2],n[3]-i*(_?.011:1/37)],f*4),S.set([n[4],n[5]],f*2)}ae(d,"aE",M,4),ae(d,"aF",S,2);const h=new e.Mesh(d,K(ro,lo,{uRay:{value:_?1:0},uHop:{value:_?24:18},uBaseY:{value:_?31:21},uHopH:{value:_?4:10},uBody:{value:_?.22:.34}},{side:e.DoubleSide}));h.frustumCulled=!1,ie.add(h)}await u.yield();const ve=[{c:[j-36,23,1248],crown:!1},{c:[j-78,27,1085],crown:!1},{c:[m+62,38,1e3],crown:!1},{c:[D.orbit*112,231,129],crown:!0},{c:[j-9,76,432],crown:!0},{c:[j+11,197,268],crown:!0},{c:[D.orbit*86,262,4],crown:!0},{c:[-D.orbit*12,306,-30],crown:!0},{c:[j-30,30,600],crown:!0}],nt=ve.map(t=>new e.Vector4(t.c[0],t.c[1],t.c[2],0));{const t=[],a=[],r=(R,n,h)=>{for(const f of[R,n,h])t.push(f[0],f[1],f[2]),a.push(f[3],f[4])};if(o){for(let h=0;h<7;h++){const f=h/7*O,i=(h+1)/7*O,g=(k,G,z)=>[Math.cos(k)*G,z,Math.sin(k)*G,z<.1?1:0,0];r([0,.55,0,0,0],g(f,.75*.7,.36),g(i,.75*.7,.36)),r(g(f,.75*.7,.36),g(f,.75,.02),g(i,.75,.02)),r(g(f,.75*.7,.36),g(i,.75,.02),g(i,.75*.7,.36))}r([-.07,-.25,.7,1,1],[.07,-.25,.7,1,1],[0,-.25,-1.5,.5,1]),r([0,-.18,.7,1,1],[0,-.32,.7,1,1],[0,-.25,-1.5,.5,1])}else{const R=[0,0,-1.45,1,1],n=[0,0,1,1,1],h=[-.26,0,-.2,1,0],f=[.26,0,-.2,1,0],i=[0,.2,-.25,0,1];r(R,h,i),r(R,i,f),r(h,n,i),r(i,n,f);const g=[0,0,-1.45,1,0],k=[0,0,1,1,0],G=[0,-.11,-.25,0,0];r(g,h,G),r(g,G,f),r(h,k,G),r(G,k,f);for(const z of[-1,1])r([z*.1,.04,.12,0,0],[z*.86,.2,1.16,1,0],[z*.07,.04,.84,1,0]);r([0,.12,.36,0,0],[0,.56,1.18,1,0],[0,.05,.96,1,0])}const v=Math.round(50*F),d=v*ve.length,M=new e.InstancedBufferGeometry;M.setAttribute("position",new e.Float32BufferAttribute(t,3)),M.setAttribute("uv",new e.Float32BufferAttribute(a,2)),M.instanceCount=d;const S=new Float32Array(d*4),y=new Float32Array(d);for(let R=0;R<d;R++){const n=R%ve.length,h=l.range(-4,4),f=l.range(-9,9)*(1+.3*l.gauss()*.3),i=l.range(-24,24),g=n>=4;S.set([g?i:h,f,g?h*2:i,l()],R*4),y[R]=n}ae(M,"aP",S,4),ae(M,"aS",y,1),Q(new e.Mesh(M,K(co,uo,{uSheet:{value:nt},uJelly:{value:o?1:0}},{side:e.DoubleSide})))}await u.yield();{const t=Math.round(3e4*Math.min(1,F)*N),a=new Float32Array(t*4),r=l.fork("grass");let v=0,d=0;for(;v<t&&d++<t*6;){const f=j-96+r.range(-46,46),i=1175+r.range(-150,150),g=ge.h(f,i);g<.12||(a.set([f,g-.05,i,r()],v*4),v++,(d&4095)===0&&await u.yield())}const M=new e.InstancedBufferGeometry;M.setAttribute("position",new e.Float32BufferAttribute([-1,0,0,1,0,0,0,1,0],3)),ae(M,"aG",a,4),M.instanceCount=v,M.boundingSphere=new e.Sphere(new e.Vector3(j-96,3,1175),165),Q(new e.Mesh(M,K(fo,po,{},{side:e.DoubleSide})),0,!0),await u.yield();const S=Math.round(340*F),y=new Float32Array(S*4),R=[];for(let f=0;f<6;f++){const i=f/6*O,g=.42,k=(G,z)=>[Math.cos(G)*z,0,Math.sin(G)*z];R.push(0,0,0,...k(i-g,.6),...k(i,1),0,0,0,...k(i,1),...k(i+g,.6))}let n=0;for(d=0;n<S&&d++<S*40;){const f=j-96+r.range(-10,46),i=1175+r.range(-140,140),g=ge.h(f,i);g<.35||g>4.2||(y.set([f,g,i,r()],n*4),n++)}const h=new e.InstancedBufferGeometry;h.setAttribute("position",new e.Float32BufferAttribute(R,3)),ae(h,"aG",y,4),h.instanceCount=n,h.boundingSphere=new e.Sphere(new e.Vector3(j-96,3,1175),165),Q(new e.Mesh(h,K(ho,mo,{},{side:e.DoubleSide})),0,!0)}await u.yield();const st=Fe.makeParticles({rng:l.fork("motes"),preset:"dust",time:me,count:Math.round(2400*N*F),box:[80,36,120],size:[.035,.11],colors:[c.palette[3],c.palette[0],c.lamp],intensity:1.5,velocity:[.3,.05,.6]});A.add(st.object),await u.yield();let Ce=null;w==="rain"&&(Ce=Fe.makeParticles({rng:l.fork("rain"),preset:"rain",time:me,count:Math.round(5200*N),box:[70,44,90],colors:["#15161a","#2b2c31",c.palette[3]],additive:.1,opacity:.85,intensity:.7,size:[.02,.04],velocity:[1.2,-30,.6]}),A.add(Ce.object)),await u.yield();const ne=W.length,Vt=W.map(t=>t.s>1?1.25:l.range(.86,1.08)),rt=new e.Vector2,Lt=new e.Vector3,Ee=D.spin.period,We=D.spin.arms,qe=.042;let ze=D.spin.phi0,lt=!1;const ct=Ge(150),ut=Math.min(.9,ct+.1),Et=ct-.02;U.pointAt(ut,he);const Wt=Math.atan2(he.x,he.z)*D.spin.dir+D.spin.twist*36+.02*O/We,ft=w==="storm";function qt(t,a,r,v=0){me.value=a;const d=we(v);ie.position.set(m,0,d),ot.position.z=-Ae*v,at.position.z=Ae*v;let M=1,S=0;if(V){const n=(v-(re+qe))/.012;M=n>0?1-Math.exp(-3*n)*Math.cos(5*n):1-s(re,re+.006,v),S=s(re-.008,re+qe,v)}$.uField.value=M;for(let n=0;n<oe;n++)n<ne?te[n].set(m,d+W[n].o,Vt[n],W[n].s>1?1.7:1):n<ne+2?te[n].set(De[n-ne].x,De[n-ne].z,-.5,1):te[n].set(0,0,0,1);Ie.uLean.value.y=ft?.52+.07*Math.sin(a*.7)+.04*Math.sin(a*2.3):.02*Math.sin(a*.5),Ie.uWhip.value=ft?1.6:.14;for(const n of ce){const h=n.mesh,f=n.moored?.6:1;h.rotation.z=.028*f*Math.sin(a*.5+n.ph),h.rotation.x=.013*f*Math.sin(a*.37+n.ph*2),h.position.y=n.y+.25*Math.sin(a*.6+n.ph),n.mirror.rotation.set(-h.rotation.x,h.rotation.y,-h.rotation.z),n.mirror.position.y=-h.position.y}for(const n of it){let h=!1;for(let f=0;f<ne+2&&!h;f++){const i=te[f];h=i.y-85*i.w<n.b&&i.y+145*i.w>n.a}for(const f of n.meshes)f.visible=h}const y=v<Et?D.spin.phiLane+(v-Bt)*O*b/Ee:Wt+(v-ut)*O*b/Ee;if(!lt||t>.5||t<0)ze=y,lt=!0;else{const n=O/We,h=((y-ze)%n+n*1.5)%n-n*.5;ze+=t*(O/Ee)*I(1+h*1.6,.6,1.9)}E.setSpin(ze),E.update(t,a,r);const R=v>.2;for(const n of E.detailMeshes)n.visible=R;E.lodestoneReflection&&(E.lodestoneReflection.visible=v>Re-.13),u.renderer.getDrawingBufferSize(rt),$.uPixH.value=rt.y,$.uSkyShift.value.x+=a*.16,E.lodestone&&(E.lodestone.rotation.z=S*Math.PI),E.lodestoneReflection&&(E.lodestoneReflection.rotation.z=-S*Math.PI);for(let n=0;n<ve.length;n++){const h=ve[n].c;let f;if(ve[n].crown){const i=Math.hypot(h[0],h[2]),g=(Math.atan2(h[0],h[2])*D.spin.dir+D.spin.twist*i-ze)*We/O,k=Math.floor(g);f=-(k+s(.3,.7,g-k))*(Math.PI/2)*D.spin.dir}else{let i=0,g=0;for(let k=0;k<ne+2;k++){const G=te[k].x-h[0],z=te[k].y-h[2],Y=G*G+z*z+400,J=Math.abs(te[k].z)/(Y*Y);i+=G*J,g+=z*J}f=Math.atan2(i,g-1e-9)}nt[n].w=f+S*Math.PI}A.fog.density=H(P,q,s(Re-.21,Re-.035,v)),Gt.position.copy(r.getWorldPosition(Lt)),st.update(t,a,r),Ce&&Ce.update(t,a,r)}const jt=W[ne-1],je=Ge(le),Pe=new e.Vector3,pt=(t,a)=>{for(let r=0;r<=400;r++)if(U.pointAt(r/400,Pe),Pe.z<=we(r/400)+t.o+a)return r/400;return .34},Se=[];let Ot=.34;{const t=p?[[W[2],140,50,.05,.75,.06],[W[1],42,17,.035,.7,.02]]:[[W[Math.min(2,ne-1)],42,17,.055,.7,.02]];for(const[a,r,v,d,M,S]of t){const y=I(pt(a,r),.15,.5),R=new e.Vector3;Se.push({at:(n,h)=>R.set(m-2,v,we(h)+a.o-4),from:y-d,to:y+S,weight:M}),Ot=y}}const Oe=I(pt(W[0],4),.36,.5),dt=p?Se[0].to-.01:je-.03,ht=Se[Se.length-1].from+.01,ye=D.portalSeat.position,Yt=new e.Vector3,Ut=Fe.makeGlows({rng:l.fork("halo"),positions:[[ye.x,ye.y,ye.z]],color:c.lamp,size:20,intensity:.55,core:.15,flicker:.12,time:me});return A.add(Ut.object),await u.yield(),{scene:A,path:U,duration:b,pace:t=>1-.28*s(.37,.45,t)*(1-s(.53,.6,t))+.22*s(.58,.65,t)*(1-s(.7,.78,t)),title:c.title,ride:"none",style:"none",camera:{fov:62,near:.4,far:9e3,lookAhead:38,bank:.45},pois:[{at:(t,a)=>he.set(m,13,we(a)+jt.o),from:.012,to:.08,weight:.4},{at:[ee+12,15,le],from:je-.1,to:je-.035,weight:.4},{at:(t,a)=>U.pointAt(Math.min(1,a+.035),Pe).set(m+4,15,Pe.z),from:dt,to:ht,weight:ht>dt+.02?.5:0},...Se,{at:(t,a)=>he.set(m-1.5,17,we(a)-3),from:Oe-.07,to:Oe-.004,weight:.62,fade:.35},{at:[0,70,0],from:Oe-.01,to:.575,weight:.5},{at:[j*.5,50,160],from:.55,to:.665,weight:.85},{at:[0,270,0],from:.635,to:.755,weight:.8},{at:[D.orbit*178,262,104],from:.725,to:.835,weight:.78,fade:.35},{at:D.lodestoneCenter.clone(),from:.8,to:.9,weight:.6},{at:(t,a)=>Yt.set(ye.x,ye.y+(76*s(.83,.87,a)-30*s(.885,.945,a))*(1-s(.955,.99,a)),ye.z),from:.8,to:1,weight:.85,fade:.12},...V?[{at:D.lodestoneCenter.clone(),from:re-.01,to:re+qe+.02,weight:.5}]:[]],portal:{shape:"circle",radius:7,color:c.lamp,glow:1.6,tilt:!0,revealDistance:320},post:{exposure:B==="silver"?.88:.94,bloom:{strength:.32,radius:.6,threshold:1},grade:{saturation:1.1,contrast:1.1,tint:c.tint,shadowTint:"#0a0907",vignette:.3,grain:.02,aberration:0}},update:qt,dispose(){Ve&&Ve.geometry.dispose()}}}};export{go as default};
