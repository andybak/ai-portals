import*as n from"three";import{clamp as Ke,lerp as xe,smoothstep as m,makeRng as rt}from"../kit/core.js";const we=Math.PI*2,lt=Math.PI/180,zt=["#1B4FA8","#EEF1F6","#1A1B3A","#4A4668","#F2EEE4","#E8823A","#FF5C8A"],ct=`
uniform vec4 uUmbra;   // x front F, y trailing edge, z lean (cot of sun elevation), w open (exposure 0..1 in totality)
uniform vec3 uSunDir;  // toward the sun (world)
uniform float uTime;
uniform vec3 uOrg;     // world position of the piece's origin (s is measured in the piece's frame)
float umbraS(vec3 p){ return (p.z - uOrg.z) + uUmbra.z * (p.y - uOrg.y); }
vec2 umbra2(vec3 p){   // x light 0..1, y 1 where that light is the returning (post-totality) sun
  float s = umbraS(p);
  float a = smoothstep(-130., 130., s - uUmbra.x) * (0.65 + 0.35 * smoothstep(0., 1500., s - uUmbra.x));
  float b = smoothstep(-130., 130., uUmbra.y - s) * (0.65 + 0.35 * smoothstep(0., 1500., uUmbra.y - s));
  return vec2(max(a, b), step(a + 1e-4, b));
}
float umbra(vec3 p){ return umbra2(p).x; }
// shadow bands: stripes 2 m apart drifting 4 m/s for ~900 m ahead of each edge; px = metres per pixel at p
float umbraBands(vec3 p, float px){
  float s = umbraS(p);
  float w = max(1. - abs(s - uUmbra.x - 420.) / 520., 1. - abs(uUmbra.y - s - 420.) / 520.);
  w = clamp(w * 1.6, 0., 1.) * (1. - smoothstep(0.3, 0.8, px));
  float ph = dot(p, vec3(0.42, 0.17, 0.89)) * 3.14159 - uTime * 12.566 + 3.6 * sin(dot(p, vec3(-0.11, 0.03, 0.07)) + uTime * 0.7) + 2.4 * sin(dot(p, vec3(0.085, -0.15, 0.036)) - uTime * 0.4);
  float bpat = 0.55 + 0.45 * sin(dot(p, vec3(0.031, 0.02, -0.027)) + uTime * 0.9);   // they come and go in patches
  return 1. + 0.085 * w * bpat * sin(ph);
}
`,et=`
float h31(vec3 p){ p = fract(p * vec3(0.1031, 0.1030, 0.0973)); p += dot(p, p.yzx + 33.33); return fract((p.x + p.y) * p.z); }
vec3 h33(vec3 p){ p = fract(p * vec3(0.1031, 0.1030, 0.0973)); p += dot(p, p.yxz + 33.33); return fract((p.xxy + p.yxx) * p.zyx); }
// cellular lobes with a smooth minimum: 1 on a lobe's crown, falling into soft curved creases (cauliflower)
float cell(vec3 p){
  vec3 i = floor(p), f = fract(p); float acc = 0.;
  for (int x = -1; x <= 1; x++) for (int y = -1; y <= 1; y++) for (int z = -1; z <= 1; z++) {
    vec3 o = vec3(float(x), float(y), float(z));
    vec3 r = o + h33(i + o) * 0.8 + 0.1 - f;
    acc += exp(-12. * dot(r, r));
  }
  return 1. - clamp(-log(acc + 1e-6) * 0.185, 0., 1.);
}
float vn3(vec3 p){
  vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(mix(h31(i), h31(i + vec3(1,0,0)), f.x), mix(h31(i + vec3(0,1,0)), h31(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(h31(i + vec3(0,0,1)), h31(i + vec3(1,0,1)), f.x), mix(h31(i + vec3(0,1,1)), h31(i + vec3(1,1,1)), f.x), f.y), f.z);
}
`,st=`
uniform vec3 uSkyA[4];   // before: zenith, cobalt at 30 deg, silver horizon, indigo wall
uniform vec3 uSkyB[5];   // totality: zenith, slate-violet at 12, rose-peach at 6, copper at 0, thin line at 1
uniform vec4 uCam;       // x camIn (camera inside the umbra 0..1), y pre-dimming at the camera, z gold (after C3), w spare
vec3 skyBefore(float el, float saz){
  vec3 c = mix(uSkyA[2], uSkyA[1], smoothstep(0., 30., el));
  c = mix(c, uSkyA[0], smoothstep(30., 85., el));
  c += uSkyA[2] * 0.3 * pow(max(saz, 0.), 8.) * (1. - smoothstep(0., 32., el));
  c = mix(c, uSkyA[2] * vec3(0.52, 0.6, 0.74), 1. - smoothstep(-14., 0., el));
  return c;
}
vec3 skyTotal(float el, float saz){
  vec3 c = mix(uSkyB[3], uSkyB[2], smoothstep(1.2, 6., el));
  c = mix(c, uSkyB[1], smoothstep(5., 12., el));
  c = mix(c, uSkyB[0], smoothstep(12., 50., el));
  float d = (el - 1.) / 0.8;
  c += uSkyB[4] * 0.55 * exp(-d * d);
  c *= 0.86 + 0.14 * saz;
  c = mix(c, uSkyB[1] * 0.42, 1. - smoothstep(-9., 0.3, el));
  return c;
}
vec3 skyDark(float el, float saz){   // what the shadow looks like: an indigo bank from outside, the copper ring from inside
  vec3 wall = uSkyA[3] * (1.0 + 0.6 * (1. - smoothstep(0., 12., abs(el))));
  return mix(wall, skyTotal(el, saz) * mix(0.5, 1., uUmbra.w), uCam.x);
}
vec3 skyLitC(float el, float saz){   // sunlit air: from inside the umbra it is far away, dim and reddened
  vec3 c = skyBefore(el, saz) * uCam.y;
  vec3 far = skyTotal(el, saz) * 1.12 * mix(0.5, 1., uUmbra.w);
  return mix(c, mix(far, c * 0.3, smoothstep(8., 50., el)), uCam.x);
}
`,ut=`
uniform vec3 uKey, uGold, uShade, uWarm, uCool, uPearl, uBoltCol;
uniform vec4 uBolt[3];   // xyz world position of a lightning core, w its level 0..1
uniform vec4 uSeat;      // xyz world position of the portal seat, w level of its pearl light inside the cloud
uniform vec4 uOwn;       // shoulder tower: axis x, z (world), radius
uniform vec4 uHgt;       // x world y of the base, y 1/height, z deck y (world), w haze mix
uniform vec4 uOccA;      // shoulder tower as a sun occluder: xyz world, w radius
uniform vec4 uOccB;      // anvil plate as a sun occluder: x,z world centre, y underside (world), w downwind reach
vec3 hazeAt(vec3 P, vec3 dir, float lit){
  vec3 dn = dir / max(length(dir), 1e-3);
  float el = min(degrees(asin(clamp(dn.y, -1., 1.))), 2.5);
  float saz = dot(normalize(dir.xz + vec2(1e-5, 0.)), normalize(uSunDir.xz));
  vec3 steel = mix(vec3(1.), vec3(0.6, 0.7, 0.88), smoothstep(-6., 1., el));
  vec3 dark = skyDark(el, saz) + uSkyB[1] * 0.95 * (1. - uCam.x) * (1. - smoothstep(-10., 0., el));
  return mix(dark, skyLitC(el, saz) * mix(steel, vec3(1.), uCam.x), lit);
}
// how much of the sun reaches P past the shoulder tower and the anvil plate (soft analytic shadows)
float sunOcc(vec3 P){
  float o = 1.;
  vec3 d = uOccA.xyz - P;
  float t = dot(d, uSunDir);
  if (t > 0.) o *= smoothstep(uOccA.w * 0.72, uOccA.w * 1.2, length(d - uSunDir * t));
  d.y -= 150.; t = dot(d, uSunDir);
  if (t > 0.) o *= smoothstep(uOccA.w * 0.9, uOccA.w * 1.45, length(d - uSunDir * t));
  d += vec3(-40., 450., 0.); t = dot(d, uSunDir);        // the shoulder's boiling top, 300 m up: only what stands close behind it
  if (t > 0.) o *= mix(1., smoothstep(uOccA.w * 1.2, uOccA.w * 2.05, length(d - uSunDir * t)), 1. - smoothstep(430., 640., t));
  float ty = (uOccB.y - P.y) / max(uSunDir.y, 0.05);
  if (ty > 0.) {
    vec2 q = P.xz + uSunDir.xz * ty - uOccB.xz;
    float rho = length(q) + 1e-3;
    float R = 380. + uOccB.w * pow(max(q.x / rho, 0.) + 1e-4, 1.3);
    o *= smoothstep(R - 110., R + 30., rho);
  }
  return o;
}
// N shading normal (with the fine cauliflower), Ng smooth normal (for the soft linings), V toward the eye
vec3 cloudShade(vec3 P, vec3 N, vec3 Ng, vec3 V, float ao, float px, float thin){
  vec2 um = umbra2(P);
  float lit = um.x * umbraBands(P, px);
  float ndl = dot(N, uSunDir);
  float fg = 1. - max(dot(Ng, V), 0.); fg *= fg;
  float toSun = max(dot(-V, uSunDir), 0.);
  float up = N.y * 0.5 + 0.5;
  float hRel = clamp((P.y - uHgt.x) * uHgt.y, 0., 1.);
  // sunlit state: thin hard key, cobalt shadow sides, silver lining toward the sun
  float sunward = dot(Ng, uSunDir);
  float own = (1. - smoothstep(uOwn.z * 1.15, uOwn.z * 1.4, length(P.xz - uOwn.xy))) * smoothstep(0.05, 0.4, sunward);
  own *= smoothstep(-0.5, 0., dot(P.xz - uOwn.xy, normalize(uSunDir.xz)) / uOwn.z + 0.9 * smoothstep(uOccA.y + 40., uOccA.y + 130., P.y));
  vec3 key = mix(uKey, uGold, um.y) * mix(sunOcc(P), 1., own);
  float dif = smoothstep(-0.15, 0.78, ndl);
  vec3 sh = uShade * (0.2 + 0.19 * up + 0.25 * up * up + 0.5 * max(dot(N, vec3(-0.45, 0.35, 0.82)), 0.)) * (0.7 + 0.45 * hRel) * ao;
  vec3 cl = sh * (1. - 0.55 * dif * dot(key, vec3(0.33))) + key * 0.56 * dif * (0.5 + 0.5 * ao);
  cl += key * (fg * (0.7 * toSun * toSun + 0.07 + 0.5 * um.y * smoothstep(-0.2, 0.3, sunward)) + 0.32 * thin * toSun * toSun * toSun);
  // umbra state: slate-violet lobes, copper on every flank that faces the horizon ring, dark creases, pearl rim from
  // the corona. The fine normal N carries it, so the cauliflower relief reads in the dark as it does in sunlight.
  float k = smoothstep(0.22, 0.85, up * 0.7 + hRel * 0.5);
  float hor = 1. - abs(N.y); hor *= hor;
  vec3 cd = mix(uWarm * 0.85, uCool, k) * (0.5 + 0.62 * ao) * (0.8 + 0.5 * (1. - up) * (1. - hRel));
  float mn = max(ndl * 0.6 + 0.4, 0.);
  cd += uPearl * (0.15 * mn * mn * ao + 0.3 * fg * toSun + 0.04 * fg);
  cd += mix(uWarm, uCool, 0.5) * 0.3 * max(dot(N, vec3(-0.45, 0.35, 0.82)), 0.) * ao;
  cd += uSkyB[3] * 0.3 * hor * ao * (0.55 + 0.45 * smoothstep(-0.5, 0.3, N.y));
  cd *= (0.42 + 0.78 * ao) * (0.8 + 0.2 * smoothstep(-0.7, 0.1, N.y));
  cd *= mix(0.5, 1., uUmbra.w);
  // from outside the shadow is indigo, no copper yet; crowns stay a paler violet so near turrets never go to black holes
  vec3 co = mix(uSkyA[3] * 2.0, uSkyB[1] * 1.25 + uSkyA[2] * 0.035, up * up) * (0.5 + 0.6 * ao);
  cd = mix(co, cd, uCam.x);
  vec3 col = mix(cd, cl, clamp(lit, 0., 1.2));
  // light inside the cloud: lightning cores, and the portal's pearl. Both show where the cloud is thin (creases and
  // the folds between lobes) and are broken by a lobe-scale field, so they light relief instead of sitting as a disc
  float crs = 0.03 + 1.5 * thin + 0.5 * (1. - ao) * (1. - ao);
  float pat = 0.3 + 0.7 * smoothstep(0.25, 0.75, vn3(P / 37. + vec3(0., uTime * 0.05, 0.)));
  float g = 0.;
  for (int i = 0; i < 3; i++) { vec3 d = P - uBolt[i].xyz; g += uBolt[i].w * exp(-dot(d, d) / 13000.); }
  col += uBoltCol * g * (0.18 * (1. - 0.7 * um.x) + crs) * pat * 1.8 * mix(1., 0.45, um.x);
  vec3 ds = uSeat.xyz - P;
  float sl = length(ds) + 1e-3;
  float fw = max(dot(-V, ds / sl), 0.);
  float gs = min(uSeat.w * (exp(-sl / 170.) * 1.5 + exp(-sl * sl / 2600.) * 0.9), 1.6) * (0.22 + 0.78 * fw * fw) * smoothstep(15., 60., sl);
  col += mix(uPearl, vec3(0.72, 0.8, 1.), 0.45) * gs * (0.1 + crs) * (0.45 + 0.55 * pat);
  col += mix(uPearl, vec3(0.72, 0.8, 1.), 0.3) * (max(dot(N, ds / sl), 0.) * 0.7 / (1. + sl * sl / 260.)) * (0.35 + 0.65 * ao);
  return col;
}
`,ft=`
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      float fogF = 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      float fogF = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
    col = mix(col, mix(fogColor, hz, uHgt.w), fogF);
  #endif
`,Tt={NOISE_GLSL:et,SKY_GLSL:st,CLOUD_GLSL:ut,FOG_APPLY:ft},St=`
attribute float aO, aBoil;
uniform float uTime;
varying vec3 vW, vN; varying float vAO;
#include <fog_pars_vertex>
${et}
void main(){
  vec3 p = position;
  // crowns boil and roll outward: two slow noise fields climbing through the cloud push lobes along their normals
  float b1 = vn3(p * 0.019 + vec3(0., -uTime * 0.12, uTime * 0.03)) - 0.5;
  float b2 = vn3(p * 0.047 + vec3(uTime * 0.07, -uTime * 0.18, 0.)) - 0.5;
  p += normal * (b1 * 18. + b2 * 6.) * aBoil;
  vec4 wp = modelMatrix * vec4(p, 1.);
  vW = wp.xyz; vN = mat3(modelMatrix) * normal; vAO = aO;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,kt=`
varying vec3 vW, vN; varying float vAO;
uniform float uSoftK;   // 0 = crisp cauliflower, 1 = smooth: how far the fine relief is blended back to the soft body
#include <fog_pars_fragment>
${ct}${et}${st}${ut}
void main(){
  vec3 dpx = dFdx(vW), dpy = dFdy(vW);
  float px = max(length(dpx), length(dpy));
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
  vec3 Vv = cameraPosition - vW;
  vec3 V = Vv / max(length(Vv), 1e-3);
  // third and fourth scale of cauliflower: creased value noise as a height field, faded out before it can alias
  vec3 q = vW - uOrg + vec3(0., -uTime * 1.2, uTime * 0.5);
  float f0 = 1. - smoothstep(2.6, 7., px), f1 = 1. - smoothstep(0.7, 2., px), f2 = 1. - smoothstep(0.12, 0.4, px);
  vec3 qw = q + (vec3(vn3(q / 31.), vn3(q / 31. + 5.2), vn3(q / 31. + 9.7)) - 0.5) * 18.;
  vec3 q0 = qw + (vec3(vn3(q / 9.7 + 1.7), vn3(q / 9.7 + 4.1), vn3(q / 9.7 + 8.3)) - 0.5) * 7. * f1;
  float l0 = cell(q0 / 26.), l1 = cell(qw / 9. + 3.1), l2 = 1.;
  #if LOBE3 > 0
  if (f2 > 0.01) l2 = cell(qw / 3.3 + 7.3);
  float f3 = 1. - smoothstep(0.035, 0.12, px), l3 = 1.;
  if (f3 > 0.01) l3 = cell(qw / 1.15 + 2.9);          // the last scale, only within ~40 m (the collar, the skimmed crown)
  #else
  float f3 = 0., l3 = 1.;
  #endif
  float h = l0 * 9.5 * f0 + l1 * 3.0 * f1 + l2 * 0.75 * f2 + l3 * 0.26 * f3;
  vec3 r1 = cross(dpy, N), r2 = cross(N, dpx);
  float det = dot(dpx, r1);
  vec3 sg = sign(det) * (dFdx(h) * r1 + dFdy(h) * r2);
  vec3 Ng = N;
  N = normalize(abs(det) * N - sg + N * 1e-7);
  float cr = mix(1., smoothstep(0., 0.7, l0), f0 * 0.8) * mix(1., smoothstep(0., 0.7, l1), f1 * 0.6) * mix(1., smoothstep(0., 0.7, l2), f2 * 0.4) * mix(1., smoothstep(0., 0.7, l3), f3 * 0.3);
  N = normalize(mix(N, Ng, uSoftK) + Ng * 1e-5);
  float ao = mix(mix(0.66, 1.05, vAO) * (0.56 + 0.44 * cr), 0.97, uSoftK * 0.55);
  float thin = (1. - vAO) * (1. - vAO) * 0.4 + (1. - cr) * 0.45;
  vec3 col = cloudShade(vW, N, Ng, V, ao, px, thin);
  vec3 hz = hazeAt(vW, -Vv, umbra(vW));
  float fz = 1. - max(dot(Ng, V), 0.);
  col = mix(col, hz, 0.4 * fz * fz * fz * (0.25 + 0.75 * smoothstep(50., 420., length(Vv))));   // soft far silhouettes; near walls keep their relief
  col = mix(col, hz, 1. - smoothstep(uHgt.z + 15., uHgt.z + 140., vW.y));
  ${ft}
  gl_FragColor = vec4(col, 1.);
}`,At=`
attribute vec3 aPos, aNrm; attribute vec2 aSz;
uniform float uTime;
varying vec2 vUv; varying vec3 vC, vRt, vUpv, vSn; varying vec4 vZ;
#include <fog_pars_vertex>
void main(){
  vec4 c = modelMatrix * vec4(aPos, 1.);
  vRt = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  vUpv = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  float r = aSz.x * (1. + 0.07 * sin(uTime * 0.35 + aSz.y * 40.));
  vec3 wp = c.xyz + (vRt * position.x + vUpv * position.y) * r;
  vUv = position.xy; vC = c.xyz; vSn = mat3(modelMatrix) * aNrm;
  vec4 mvPosition = viewMatrix * vec4(wp, 1.);
  vZ = vec4(mvPosition.z, r, projectionMatrix[2][2], projectionMatrix[3][2]);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ct=`
varying vec2 vUv; varying vec3 vC, vRt, vUpv, vSn; varying vec4 vZ;
#include <fog_pars_fragment>
${ct}${et}${st}${ut}
void main(){
  float r = length(vUv);
  float sd = fract(vC.x * 0.137 + vC.z * 0.291);
  vec3 sp = vec3(vUv * 1.5, sd * 17.) + vec3(0., -uTime * 0.02, uTime * 0.015);
  float n = vn3(sp * 1.4) * 0.6 + vn3(sp * 3.3 + 5.) * 0.4;
  float edge = r + (n - 0.5) * 0.75;
  float al = 1. - smoothstep(0.66, 0.8, edge);
  if (al < 0.5) discard;
  float nz = sqrt(max(1. - r * r, 0.03));
  vec3 Vv = cameraPosition - vC;
  vec3 fw = Vv / max(length(Vv), 1e-3);
  float gx = vn3(sp * 1.4 + vec3(0.35, 0., 0.)) - vn3(sp * 1.4), gy = vn3(sp * 1.4 + vec3(0., 0.35, 0.)) - vn3(sp * 1.4);
  vec3 Ng = normalize(vRt * vUv.x + vUpv * vUv.y + fw * nz);
  float nl = length(vSn), ball = 1. - smoothstep(0.7, 0.9, nl);
  vec3 Nb = normalize(Ng - (vRt * gx + vUpv * gy) * 1.3 + vSn * 0.9);
  vec3 Ns = normalize(vSn / max(nl, 1e-3) + Ng * 0.35 - (vRt * gx + vUpv * gy) * 0.8);
  vec3 N = normalize(mix(Ns, Nb, ball) + Ng * 1e-4);
  vec3 P = vC + N * vZ.y * 0.7;
  float px = -vZ.x * 0.0026;
  float cr = smoothstep(0.1, 0.6, abs(n * 2. - 1.));
  vec3 col = cloudShade(P, N, mix(N, Ng, 0.3 + 0.7 * ball), fw, mix(0.72 + 0.22 * cr, 0.8 + 0.28 * cr, ball), px, smoothstep(0.35, 0.8, edge) * mix(0.15, 0.5, ball));
  vec3 hz = hazeAt(P, -Vv, umbra(P));
  col = mix(col, hz, mix(0.12, 0.3, ball) * smoothstep(0.3, 0.8, edge));
  col = mix(col, hz, 1. - smoothstep(uHgt.z + 15., uHgt.z + 140., P.y));
  ${ft}
  float zv = min(vZ.x + nz * vZ.y * 0.7, -0.5);
  gl_FragDepth = clamp(((vZ.z * zv + vZ.w) / (-zv)) * 0.5 + 0.5, 0., 1.);
  gl_FragColor = vec4(col, 1.);
}`,Dt=`
varying vec3 vDir;
void main(){
  vDir = position;
  vec4 p = projectionMatrix * vec4(mat3(viewMatrix) * position, 1.);
  if (abs(p.w) < 1e-4) p.w = 1e-4;     // a vertex exactly beside a level camera (the pole): keep it off w = 0
  gl_Position = vec4(p.xy, p.w * 0.99999, p.w);
}`,Vt=`
varying vec3 vDir;
uniform vec2 uDomeE;   // front and trail as the dome sees them (the far edge is pushed away while the camera is outside)
${ct}${st}
void main(){
  vec3 rd = normalize(vDir);
  float el = degrees(asin(clamp(rd.y, -1., 1.)));
  float saz = dot(normalize(rd.xz + vec2(1e-5, 0.)), normalize(uSunDir.xz));
  // share of the air along this ray that stands in the shadow: the exact integral of umbra() along the ray under
  // exponential extinction (thinner air upward), so the wall of night is one soft arched edge with no steps
  float s0 = umbraS(cameraPosition);
  float ds = rd.z + uUmbra.z * rd.y;
  ds = abs(ds) < 1e-4 ? 1e-4 : ds;
  float k = 0.00012 + max(rd.y, 0.) / 1100.;
  float sf = 0.;
  for (int i = 0; i < 5; i++) {
    float e = (float(i) - 2.) * 75.;
    float ta = (uDomeE.y - e - s0) / ds, tb = (uDomeE.x + e - s0) / ds;
    float t1 = max(min(ta, tb), 0.), t2 = min(max(max(ta, tb), 0.), 1e6);
    sf += 0.2 * (exp(-k * t1) - exp(-k * t2));
  }
  float lit = smoothstep(0.3, 0.85, 1. - sf);
  lit = mix(lit, 1., 1. - smoothstep(-0.28, -0.015, rd.y));   // below the horizon belongs to the world's cloud decks
  vec3 col = mix(skyDark(el, saz), skyLitC(el, saz), lit);
  // a breath of shimmer along the copper line, and 1/255 of dither against banding in the dark dome
  float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col *= 1. + (n - 0.5) * 0.03;
  gl_FragColor = vec4(col, 1.);
}`,Ot=`
uniform vec3 uSunDir, uSunR, uSunU; uniform float uSkyDist;
varying vec2 vUv;
void main(){
  vUv = position.xy;
  vec3 wp = cameraPosition + (uSunDir + (uSunR * position.x + uSunU * position.y) * 0.4663) * uSkyDist;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
}`,Ft=`
uniform vec4 uSunA;    // x Moon's offset in degrees along uCdir, y corona visibility, z disc opacity, w chromosphere (+C2, -C3)
uniform vec4 uDia;     // xy diamond position (deg), z its level, w crescent glow
uniform vec2 uCdir;
uniform vec4 uStr[9];  // streamers: angle, length (solar radii), half width (rad), strength
uniform vec4 uProm[5]; // prominences: limb angle, kind (0 loop, 1 hedge, 2 detached arch), height (deg), level
uniform vec3 uPearl, uRose;
uniform float uTime;
varying vec2 vUv;
${et}
float angd(float a, float b){ return atan(sin(a - b), cos(a - b)); }
float tnoise(float x, float y, float per){
  float i = floor(x), f = fract(x), j = floor(y), g = fract(y);
  f = f * f * (3. - 2. * f); g = g * g * (3. - 2. * g);
  float i0 = mod(i, per), i1 = mod(i + 1., per);
  return mix(mix(h31(vec3(i0, j, 3.)), h31(vec3(i1, j, 3.)), f), mix(h31(vec3(i0, j + 1., 3.)), h31(vec3(i1, j + 1., 3.)), f), g);
}
void main(){
  vec2 p = vUv * 25. + vec2(1.3e-5, 0.);
  float r = length(p), th = atan(p.y, p.x);
  float aa = max(fwidth(r), 1e-4);
  const float RS = 3.;
  vec2 pn = p / r;
  vec2 pm = p - uCdir * uSunA.x + vec2(0., 1.7e-5);
  float rm = length(pm), thm = atan(pm.y, pm.x);
  float RM = 3.1 + 0.035 * (sin(thm * 23. + 1.3) * 0.5 + sin(thm * 41. + 4.) * 0.3 + sin(thm * 67. + 2.) * 0.2);
  float outside = smoothstep(RM - aa, RM + aa, rm);
  // photosphere: what the Moon has not covered yet (the notched limb breaks the last sliver into beads)
  float sun = (1. - smoothstep(RS - aa, RS + aa, r)) * outside;
  vec3 col = vec3(6., 5.6, 4.9) * sun;
  float side = 0.5 + 0.5 * dot(pn, -uCdir * sign(uSunA.x));
  col += vec3(1., 0.95, 0.86) * uDia.w * exp(-abs(r - RS) / 0.8) * side * side * mix(1., outside, uSunA.z);
  // corona: inner ring + streamer envelopes, both carried by threads that follow the bending field lines
  float rho = r / RS;
  float vis = uSunA.y;
  if (vis > 0.002 && rho < 8.4) {
    float S = 0., warp = 0.;
    for (int i = 0; i < 9; i++) {
      vec4 st = uStr[i];
      float d = angd(th, st.x);
      float w = st.z * mix(1., 0.16, smoothstep(1., st.y, rho));
      float tp = (1. - smoothstep(0.72 * st.y, st.y, rho)) / pow(rho, 0.6);
      S += st.w * exp(-(d * d) / (w * w)) * tp;
      warp += sin(d) * exp(-(d * d) / (st.z * st.z * 6.)) * (st.y > 3.3 ? 0.34 : -0.5) * step(0.001, st.w);
    }
    float tc = (th + warp * min(rho - 1., 4.5)) / 6.28318;
    float t1 = tnoise(tc * 110., rho * 0.5 - uTime * 0.012, 110.);
    float t2 = tnoise(tc * 260., rho * 1.1 + 3. - uTime * 0.02, 260.);
    float f2 = 1. - smoothstep(0.45, 1.1, aa / max(r * 0.0242, 1e-4));
    float thr = 0.22 + 1.25 * t1 * t1;
    thr = mix(thr, thr * (0.4 + 1.2 * t2), f2);
    float breathe = 0.93 + 0.07 * sin(uTime * 0.5 + th * 2.);
    float inner = 1.0 * exp(-(rho - 1.) * 3.) * (0.72 + 0.28 * t1);
    float cor = (inner + S * thr * 1.25 * breathe) * (1. - smoothstep(7.2, 8.3, rho));
    col += mix(uPearl, vec3(0.74, 0.82, 1.), 0.4 * smoothstep(1.5, 6., rho)) * min(cor, 1.1) * vis * outside;
  }
  // prominences and the chromosphere arc: the one rose accent
  float pv = max(vis, abs(uSunA.w));
  if (pv > 0.002 && rho < 1.6) {
    float prom = 0.; float y = r - RS;
    for (int i = 0; i < 5; i++) {
      vec4 pr = uProm[i];
      float x = angd(th, pr.x) * RS, H = max(pr.z, 0.05), I = 0.;
      if (pr.y < 0.5) { float q = length(vec2(x, y * 0.85)) / H - 1.; I = exp(-q * q / 0.04) * step(-0.06, y); }
      else if (pr.y < 1.5) { float top = H * (0.5 + 0.5 * (0.5 + 0.5 * sin(x * 11. + uTime * 1.3 + pr.x * 7.))); I = exp(-(x * x) / (H * H * 2.4)) * (1. - smoothstep(top * 0.55, top, y)) * step(-0.06, y); }
      else { float q = length(vec2(x, (y - 0.3 * H) * 1.4)) / (0.75 * H) - 1.; I = exp(-q * q / 0.035) * smoothstep(0.15 * H, 0.4 * H, y); }
      prom += I * pr.w * (0.82 + 0.18 * sin(uTime * 2.3 + pr.x * 11.));
    }
    float dc = (r - RS - 0.07) / 0.1;
    float arc = exp(-dc * dc) * smoothstep(0.35, 0.92, dot(pn, -uCdir * sign(uSunA.w))) * abs(uSunA.w);
    col = mix(col, vec3(0.), min(prom, 1.) * pv * outside * 0.7) + uRose * (2.2 * min(prom, 1.2) * pv + 2.4 * arc) * outside;
  }
  // the diamond: a small six-rayed star on the limb, no ghosts
  if (uDia.z > 0.002) {
    vec2 q = p - uDia.xy + vec2(2.1e-5, 0.);
    float dq = length(q), an = atan(q.y, q.x);
    float star = 6. * exp(-dq * dq / 0.12) + 0.8 / (1. + dq * dq * 3.5) + 1.5 * pow(abs(cos(an * 3. + 0.5)), 26.) * exp(-dq / 1.2);
    col += vec3(1., 0.97, 0.92) * star * uDia.z;
  }
  float a = (1. - outside) * uSunA.z;
  gl_FragColor = vec4(col + vec3(0.0015, 0.0015, 0.003) * a, a);
}`,Rt=`
attribute vec3 aS;   // size in px at 450 lines, brightness, seed (planets have seed < 0: no twinkle)
uniform float uTime, uSkyDist, uPx, uStar;
varying float vI;
void main(){
  float tw = aS.z < 0. ? 1. : 0.72 + 0.28 * sin(uTime * (2.5 + aS.z * 4.) + aS.z * 60.);
  vI = aS.y * tw * uStar * smoothstep(0.02, 0.2, position.y);
  gl_Position = projectionMatrix * viewMatrix * vec4(cameraPosition + position * uSkyDist, 1.);
  gl_PointSize = max(2., aS.x * uPx);
}`,Bt=`
uniform vec3 uPearl; varying float vI;
void main(){
  vec2 c = gl_PointCoord * 2. - 1.;
  float d = dot(c, c);
  gl_FragColor = vec4(mix(vec3(0.8, 0.88, 1.), uPearl, 0.5) * vI * exp(-d * 2.6) * (1. - smoothstep(0.6, 1., d)), 1.);
}`,it=u=>Math.sqrt(u*u+.012)-.11;function Xe(u,s,i){const P=i?s:s+1,v=(u+1)*P;return{ni:u,nj:s,wrap:i,cols:P,nv:v,pos:new Float32Array(v*3),cw:new Float32Array(v),mam:new Float32Array(v),boil:new Float32Array(v),ao:new Float32Array(v),nor:new Float32Array(v*3)}}async function ht(u,s){const{ni:i,nj:P,wrap:v,cols:A,pos:D,nor:he}=s;for(let k=0;k<=i;k++){(k&7)===7&&await u.yield();const R=Math.max(k-1,0),V=Math.min(k+1,i);for(let p=0;p<A;p++){const X=v?(p+P-1)%P:Math.max(p-1,0),_=v?(p+1)%P:Math.min(p+1,P),te=(k*A+X)*3,de=(k*A+_)*3,j=(R*A+p)*3,J=(V*A+p)*3,le=D[de]-D[te],Se=D[de+1]-D[te+1],ce=D[de+2]-D[te+2],ge=D[J]-D[j],Pe=D[J+1]-D[j+1],g=D[J+2]-D[j+2];let ke=Pe*ce-g*Se,me=g*le-ge*ce,ae=ge*Se-Pe*le;const N=Math.hypot(ke,me,ae),ve=(k*A+p)*3;N<1e-6?(ke=0,me=1,ae=0):(ke/=N,me/=N,ae/=N),he[ve]=ke,he[ve+1]=me,he[ve+2]=ae}}}function Pt(u){const s=u.length;return(i,P,v,A)=>{let D=1e18;for(let he=0;he<s-1;he++){const k=u[he],R=u[he+1],V=R.x-k.x,p=R.y-k.y,X=R.z-k.z;let _=((i-k.x)*V+(P-k.y)*p+(v-k.z)*X)/(V*V+p*p+X*X);_=_<0?0:_>1?1:_;const te=k.x+V*_,de=k.y+p*_,j=k.z+X*_,J=(i-te)*(i-te)+(P-de)*(P-de)+(v-j)*(v-j);J<D&&(D=J,A&&(A.x=te,A.y=de,A.z=j))}return Math.sqrt(D)}}async function tt(u,s,i){const{N:P,off:v,lobes:A,mcell:D,mseed:he,lineDist:k,minClear:R}=i,V=i.band??48,p=i.fine??1,{nv:X,pos:_,nor:te,cw:de,mam:j,ao:J}=s,le=R+V,Se=le+55;let ce=0,ge=0,Pe=0,g=0,ke=0,me=0;const ae=b=>k(ce+g*b,ge+ke*b,Pe+me*b);await ht(u,s);const N=(b,O)=>{let Q=b*374761393+O*668265263+he|0;return Q=Math.imul(Q^Q>>>13,1274126177),((Q^Q>>>16)>>>0)/4294967296},ve=b=>Math.sqrt(b*b+.012)-.11;for(let b=0;b<X;b++){(b&255)===255&&await u.yield();const O=b*3,Q=_[O],G=_[O+1],Ce=_[O+2],je=te[O],Ge=te[O+1],Ie=te[O+2],I=de[b],be=ve(P.n3(Q/170+v,G/112,Ce/170)),Le=ve(P.n3(Q/62,G/43+v,Ce/62)),pe=ve(P.n3(Q/30,G/22,Ce/30+v));let W=be*48+Le*18+pe*5*p,ne=be*.95+Le*.6+pe*.38;if(I>.4)for(let $=0;$<A.length;$++){const K=A[$],q=Q-K.x,L=(G-K.y)*1.25,E=Ce-K.z,e=(q*q+L*L+E*E)/(K.r*K.r);if(e<1){const t=Math.sqrt(1-e);W+=K.r*.55*t,ne+=.25*t}}W*=I;const Y=Math.abs(W),ue=W<0?-1:1;let Ve=W;if(G-Y<640&&G+Y>60){const $=k(Q,G,Ce);if($-Y<Se){ce=Q,ge=G,Pe=Ce,g=je*ue,ke=Ge*ue,me=Ie*ue;let K=$,q=0;for(let a=1;a<=8;a++){const r=ae(Y*a/8);r<K&&(K=r,q=a)}let L=Y*Math.max(q-1,0)/8,E=Y*Math.min(q+1,8)/8;for(let a=0;a<5;a++){const r=L+(E-L)/3,f=E-(E-L)/3;ae(r)<ae(f)?E=f:L=r}const e=q===8&&ae(Y)<=ae((L+E)*.5)?Y:(L+E)*.5;K=ae(e);let t=Y;if(K<Se&&(t=e+(Y-e)*m(le,Se,K),K<le)){let a=0,r=$;if($>=le){let d=0,x=e;for(let C=0;C<7;C++){const w=(d+x)*.5;ae(w)<le?x=w:d=w}a=d,r=le}const f=Math.min(Math.max(r-R,0),V)*.88,l=e-a,c=Math.min(l/105,1);t=a+(l>0?Math.min(f*(1-(1-c)*(1-c)),l):0)}Ve=ue*t,ne*=.72+.28*Math.min(1,t/Math.max(Y,.001))}}let Oe=Q+je*Ve,Me=G+Ge*Ve,Fe=Ce+Ie*Ve;if(ne=Math.min(1,ne),j[b]>0){const $=Oe/D,K=Fe/D,q=Math.floor($),L=Math.floor(K);let E=9;for(let a=-1;a<=1;a++)for(let r=-1;r<=1;r++){const f=q+a+.15+.7*N(q+a,L+r),l=L+r+.15+.7*N(L+r+91,q+a-37),c=($-f)*($-f)+(K-l)*(K-l);c<E&&(E=c)}const e=Math.sqrt(Math.max(0,1-E/.34));let t=e*.36*D*j[b];Me-t<560&&(t=Math.min(t,Math.max(0,k(Oe,Me,Fe)-R-6))),Me-=t,ne=xe(ne,.18+.82*e,Math.min(1,j[b]*1.2))}_[O]=Oe,_[O+1]=Me,_[O+2]=Fe,J[b]=Math.pow(Math.max(ne,0),.75)}await ht(u,s)}function Ut(u){let s=0,i=0;for(const[P,v,A]of u)s+=(P+1)*(A?v:v+1),i+=P*v*2;return{pos:new Float32Array(s*3),nor:new Float32Array(s*3),ao:new Float32Array(s),boil:new Float32Array(s),cw:new Float32Array(s),idx:new Uint32Array(i*3),nv:0,ni:0}}async function ot(u,s,i,P){const v=i.nv,{ni:A,nj:D,wrap:he,cols:k}=s;i.pos.set(s.pos,v*3),i.nor.set(s.nor,v*3),i.ao.set(s.ao,v),i.boil.set(s.boil,v),i.cw.set(s.cw,v),i.nv+=s.nv;const R=i.idx;let V=i.ni;for(let p=0;p<A;p++){(p&7)===7&&await u.yield();for(let X=0;X<D;X++){if(P&&P(p,X))continue;const _=he?(X+1)%D:X+1,te=v+p*k+X,de=v+(p+1)*k+X,j=v+p*k+_,J=v+(p+1)*k+_;R[V++]=te,R[V++]=de,R[V++]=j,R[V++]=de,R[V++]=J,R[V++]=j}}i.ni=V}async function Nt(u,s){const i=u.noise,P=s.rng,v={N:i,off:P.range(0,40),lobes:s.lobes,mcell:s.mcell,mseed:P.int(1,1e6),lineDist:s.lineDist,minClear:44,band:48},A=P.range(0,50),D=P.range(0,50),he=s.lineDist,k=[],R=(e,t,a)=>{for(let r=0;r<t;r++)k.push([e,a?r/(t-1):r/t])};R(0,Math.round(84*s.res)),R(1,22),R(2,34),R(3,8),R(4,10,!0);const V=Math.round(20*s.res)*16,p=Xe(k.length-1,V,!0),X=Math.round(80*s.res),_=Math.round(48*s.res),te=Math.round(144*s.res),de=Math.round(74*s.res*s.res),j=14,J=Math.round(84*s.res),le=Math.round(V*.305),Se=Math.round(V*.86),ce=Se-le,ge=44,Pe=[[k.length-1,V,!0],[52,128,!0],[X,_,!1],[ge,ce,!1],[Math.round(32*s.res),te,!0]];for(let e=0;e<de;e++)Pe.push([10,16,!0]);for(let e=0;e<j;e++)Pe.push([9,14,!0]);const g=Ut(Pe),ke=s.yUnder,me=46,ae=(e,t,a)=>(252+100*Math.exp(-Math.max(e,0)/150))*(1+.08*i.n3(t*1.2+A,e/210,a*1.2))*(1-.1*m(.7,.92,-a)*m(120,260,e)),N=e=>s.shear*Math.pow(Ke(e/560,0,1),1.6);for(let e=0;e<V;e++){(e&3)===3&&await u.yield();const t=e/V*we,a=Math.cos(t),r=Math.sin(t),f=Math.max(a,0),l=(400+s.reach*Math.pow(f,1.3)+80*Math.max(-r,0)*(1-f))*(1+.06*i.n3(a*1.7,r*1.7,D))+55*f*i.n3(a*5,r*5,D+9),c=ae(400,a,r),d=Math.min(210,(l-c-30)*.8),x=Math.max(50,d*.95),C=ke-x,w=ke+40+me/2;for(let M=0;M<k.length;M++){const Z=k[M][0],y=k[M][1],F=M*V+e;let z,S,re,oe=0,se;if(Z===0)S=y<.1?xe(-150,0,y/.1):xe(0,C,(y-.1)/.9),z=xe(ae(S,a,r),c,m(300,C,S))+Math.max(-S,0)*.9,re=1,se=.35+.5*m(60,320,S);else if(Z===1){const fe=y*Math.PI/2;z=c+d*(1-Math.cos(fe)),S=C+x*Math.sin(fe),re=xe(1,.3,y),oe=m(.55,1,y)*.7,se=.5}else if(Z===2)z=xe(c+d,l-me/2,Math.pow(y,.9)),S=ke+40*y,re=.2,oe=(.7+.3*m(0,.3,y))*(1-m(.82,1,y)),se=.2;else if(Z===3){const fe=-Math.PI/2+y*Math.PI;z=l-me/2+me/2*Math.cos(fe),S=w+me/2*Math.sin(fe),re=.45,se=.35}else z=(l-me/2)*(1-y),S=w+me/2+24*(1-z/l*(z/l))+s.overshoot*Math.exp(-(z*z)/28900),re=.45*(1-m(.9,1,y))+.05,se=.3;const ie=N(S);p.pos[F*3]=ie+z*a,p.pos[F*3+1]=S,p.pos[F*3+2]=z*r,p.cw[F]=re,p.mam[F]=oe,p.boil[F]=se}}await u.yield(),await tt(u,p,v),await ot(u,p,g,(e,t)=>e>=J&&e<J+22&&t>=le&&t<Se),await u.yield();const ve=Xe(52,128,!0),b=s.shoulder;for(let e=0;e<128;e++){(e&15)===15&&await u.yield();const t=e/128*we,a=Math.cos(t),r=Math.sin(t),f=1+.09*i.n3(a*1.4,r*1.4,A+20);for(let l=0;l<=52;l++){const c=l*128+e;let d,x;if(l<=28){const C=l/28;x=xe(15,b.y0,C),d=b.r*xe(1.28,1,Math.pow(C,.7))}else{const C=(l-28)/24*Math.PI/2;d=b.r*Math.cos(C),x=b.y0+(b.crest-b.y0-30)*Math.sin(C)}d*=f,ve.pos[c*3]=b.x+.07*(x-80)+d*a,ve.pos[c*3+1]=x,ve.pos[c*3+2]=b.z+d*r,ve.cw[c]=l===52?.3:1,ve.boil[c]=.45+.55*m(200,b.y0+40,x)}}await u.yield(),await tt(u,ve,{...v,off:v.off+13}),await ot(u,ve,g),await u.yield();const O=s.portal.x+8,Q=s.portal.y-44,G=s.portal.z;let Ce=0;{const e=Xe(76,34,!1);for(let t=0;t<=76;t++){const a=xe(-240,480,t/76);let r=a<O?Q-150*Math.pow(m(0,440,O-a),1.2):Q-130*m(0,180,a-O);r-=330*m(-60,-220,a)+290*m(340,470,a);const f=1-.6*Math.pow(Math.max(m(-90,-240,a),m(350,480,a)),1.6);for(let l=0;l<=34;l++){const c=l/34,d=t*35+l,x=2*c-1,C=Math.abs(x);e.pos[d*3]=a,e.pos[d*3+1]=r-14+40*x*x-390*Math.pow(m(.62,1,C),1.5),e.pos[d*3+2]=-345+(xe(-170,b.z+40,c)+345)*f,e.cw[d]=.75,e.boil[d]=.5}}await tt(u,e,{...v,off:v.off+29,minClear:32,band:22});for(let t=0;t<e.nv;t++)e.ao[t]>.6&&e.pos[t*3+1]>70&&e.pos[t*3+1]<600&&Ce++}await u.yield();const je=rt("umbra-floor:"+(u.seed??1)),Ge=(e,t)=>{let a=e<O?Q-150*Math.pow(m(0,440,O-e),1.2)-35*m(0,50,O-e):Q-130*m(0,180,e-O);a-=200*m(-40,-240,e)+290*m(340,470,e);const r=t/120*(t/120),f=Math.max(Math.abs(t)-125,0);return a-14+40*Math.min(r,1.5)-1.5*f*f/(f+45)},Ie=[];for(let e=0;e<14;e++){const t=xe(-75,228,(e+je())/14),a=(e&1?1:-1)*je.range(16,96),r=je.range(24,44);Ie.push({x:t,y:Ge(t,a)-r*.1,z:G+a,r})}Ie.push({x:O-8,y:Q-22,z:G+17,r:31},{x:O-4,y:Q-22,z:G-19,r:29});const I=e=>e+.5*Math.sin(we*e)/we,be=Xe(X,_,!1);for(let e=0;e<=X;e++){const t=xe(-240,480,I(e/X)),a=1-.6*Math.pow(Math.max(m(-90,-240,t),m(350,480,t)),1.6);for(let r=0;r<=_;r++){const f=r/_,l=e*(_+1)+r,c=xe(200,-330,I(f))*a,d=Math.abs(2*f-1);be.pos[l*3]=t,be.pos[l*3+1]=Ge(t,c)-140*Math.pow(m(.86,1,d),1.5),be.pos[l*3+2]=G+c,be.cw[l]=.75,be.boil[l]=.5}}await u.yield(),await tt(u,be,{...v,lobes:[...s.lobes,...Ie],off:v.off+29,minClear:32,band:22,fine:2.2}),await ot(u,be,g),await u.yield();const Le=g.nv,pe=Xe(ge,ce,!1);for(let e=0;e<=ce;e++){const t=(le+e)/V*we,a=Math.cos(t),r=Math.sin(t),f=Math.max(a,0),l=(400+s.reach*Math.pow(f,1.3)+80*Math.max(-r,0)*(1-f))*(1+.06*i.n3(a*1.7,r*1.7,D))+55*f*i.n3(a*5,r*5,D+9),c=ae(400,a,r),d=Math.min(210,(l-c-30)*.8),x=Math.max(50,d*.95),C=ke-x;for(let w=0;w<=ge;w++){const M=w/ge,Z=M*Math.PI/2,y=c+d*(1-Math.cos(Z)),F=C+x*Math.sin(Z),z=w*(ce+1)+e;pe.pos[z*3]=N(F)+y*a,pe.pos[z*3+1]=F,pe.pos[z*3+2]=y*r,pe.cw[z]=xe(1,.3,M),pe.mam[z]=m(.55,1,M)*.7,pe.boil[z]=.5}}await u.yield(),await tt(u,pe,v);for(let e=0;e<=ge;e++)for(let t=0;t<=ce;t+=e===0||e===ge?1:ce){const a=e*(ce+1)+t,r=(le+t)%V,f=J+(e>>1),l=J+(e+1>>1),c=f*V+r,d=l*V+r;for(let x=0;x<3;x++)pe.pos[a*3+x]=(p.pos[c*3+x]+p.pos[d*3+x])*.5,pe.nor[a*3+x]=(p.nor[c*3+x]+p.nor[d*3+x])*.5;pe.ao[a]=(p.ao[c]+p.ao[d])*.5,pe.boil[a]=(p.boil[c]+p.boil[d])*.5}await ot(u,pe,g),await u.yield();const W=s.portal,ne=Math.cos(s.climb),Y=Math.sin(s.climb),ue=-Y,Ve=ne,Oe=Math.round(32*s.res),Me=Xe(Oe,te,!0),Fe=rt("umbra-collar:"+(u.seed??1)),$=[],K=e=>{const t=Math.cos(e),a=Math.sin(e),r=Math.max(0,-a);return{ca:t,sa:a,low:r,Rm:17+2.4*r+1.3*i.n3(t*1.6+A,a*1.6,D),rt:5+2.6*r+.8*i.n3(t*2.3,a*2.3+D,A),back:2.5+2.5*r}};for(let e=0;e<46;e++){const t=K((e+Fe())/46*we),a=Fe.range(.2,1.25)*Math.PI,r=Math.cos(a),f=Math.sin(a),l=ue*t.sa,c=Ve*t.sa,d=Fe.range(2.1,4.4)*(1+.35*t.low),x=ne*r+l*f,C=Y*r+c*f,w=t.ca*f,M=t.rt*1.08;$.push({x:W.x+ne*t.back+l*t.Rm+x*M,y:W.y+Y*t.back+c*t.Rm+C*M,z:W.z+t.ca*t.Rm+w*M,r:d})}for(let e=0;e<(s.ring?te:0);e++){(e&7)===7&&await u.yield();const t=K(e/te*we),a=t.ca,r=t.sa,f=t.Rm,l=t.rt,c=t.back,d=ue*r,x=Ve*r,C=a,w=W.x+ne*c+d*f,M=W.y+Y*c+x*f,Z=W.z+C*f;for(let y=0;y<=Oe;y++){const F=y/Oe*we,z=Math.cos(F),S=-Math.sin(F),re=ne*z+d*S,oe=Y*z+x*S,se=C*S,ie=w+re*l,fe=M+oe*l,Re=Z+se*l,Ue=it(i.n3(ie/7.5+A,fe/7.5,Re/7.5)),ye=it(i.n3(ie/3.6,fe/3.6+A,Re/3.6));let De=l*(.34*Ue+.17*ye),Ee=Ue*.95+ye*.7+.1;for(let Te=0;Te<$.length;Te++){const o=$[Te],h=ie-o.x,U=fe-o.y,ze=Re-o.z,B=(h*h+U*U+ze*ze)/(o.r*o.r);if(B<1){const H=Math.sqrt(1-B);De+=o.r*.62*H,Ee+=.3*H}}De*=xe(.3,1,m(-.6,.3,S));let Ne=ie+re*De,T=fe+oe*De,We=Re+se*De;const at=Ne-W.x,Ae=T-W.y,nt=We-W.z,He=at*ne+Ae*Y,Ye=at-ne*He,Be=Ae-Y*He,qe=Math.max(Math.hypot(Ye,Be,nt),.001),Ze=(10.9+Math.log(1+Math.exp(Math.min((qe-10.9)*2,40)))/2)/qe;Ne=W.x+ne*He+Ye*Ze,T=W.y+Y*He+Be*Ze,We=W.z+nt*Ze;const $e=y*te+e;Me.pos[$e*3]=Ne,Me.pos[$e*3+1]=T,Me.pos[$e*3+2]=We,Me.ao[$e]=.22+.78*Math.pow(Ke(Ee,0,1),.75),Me.boil[$e]=.05}}s.ring&&(await ht(u,Me),await ot(u,Me,g,e=>e<4||e>=Oe-4)),await u.yield();const q=rt("umbra-heads:"+(u.seed??1)),L=[];for(let e=0;e<9e3&&L.length<de;e++){(e&511)===511&&await u.yield();const t=Math.floor(q()*Le),a=t*3,r=g.pos[a],f=g.pos[a+1],l=g.pos[a+2],c=q(),d=q(),x=q();if(g.cw[t]<.4||r<-165||r>W.x+30||Math.abs(l-G)>175)continue;const C=s.lineY(r);if(f<C-125||f>C+80)continue;const w=he(r,f,l);if(w<44||w>160)continue;let M=xe(9,14,c)+11*m(60,135,w)*d,Z=0,y=0,F=0,z=!1;for(let S=0;S<4;S++){if(Z=r-g.nor[a]*M*.35,y=f-g.nor[a+1]*M*.35+M*.08,F=l-g.nor[a+2]*M*.35,he(Z,y,F)-M*1.42>=36){z=!0;break}M*=.82}if(z){for(const S of L){const re=.62*(M+S.R),oe=Z-S.x,se=y-S.y,ie=F-S.z;if(oe*oe+se*se+ie*ie<re*re){z=!1;break}}z&&L.push({x:Z,y,z:F,R:M,off:x*50,ni:w<95||M>15?10:8,nj:w<95||M>15?16:13,boil:.22})}}for(let e=0;e<(s.ring?j:0);e++){const t=e<4,a=t?-Math.PI/2+(e-1.5)*.44+q.range(-.08,.08):q.range(0,we),r=Math.sin(a),f=Math.max(0,-r),l=t?q.range(8.5,11):q.range(3,5.2),c=t?18+l*1.05:17+2.4*f+(5+2.6*f)*q.range(.7,1.15)+l*.25,d=t?q.range(3,9):2.5+2.5*f+q.range(-1.5,3.5);L.push({x:W.x+ne*d+ue*r*c,y:W.y+Y*d+Ve*r*c,z:W.z+Math.cos(a)*c,R:l,off:q.range(0,50),ni:9,nj:14,boil:t?.12:.05})}for(let e=0;e<L.length;e++){const t=L[e],a=1/t.R,r=g.nv,f=t.ni,l=t.nj,c=g.pos,d=g.nor;for(let w=0;w<=f;w++){const M=xe(-.8,Math.PI/2,w/f),Z=Math.cos(M),y=Math.sin(M);for(let F=0;F<l;F++){const z=F/l*we,S=Z*Math.cos(z),re=Z*Math.sin(z),oe=r+w*l+F,se=t.x+S*t.R,ie=t.y+y*t.R*.94,fe=t.z+re*t.R,Re=it(i.n3(se*a*.95+t.off,ie*a*1.2,fe*a*.95)),Ue=it(i.n3(se*a*2.1,ie*a*2.5+t.off,fe*a*2.1)),ye=t.R*(.36*Re+(l>14?.15:.08)*Ue);c[oe*3]=se+S*ye,c[oe*3+1]=ie+y*ye,c[oe*3+2]=fe+re*ye,g.ao[oe]=.3+.7*Math.pow(Ke(Re*.95+Ue*.7+.12,0,1),.75)*(.66+.34*m(-.5,.45,y)),g.boil[oe]=t.boil}}for(let w=0;w<=f;w++){const M=Math.max(w-1,0),Z=Math.min(w+1,f);for(let y=0;y<l;y++){const F=(r+w*l+(y+l-1)%l)*3,z=(r+w*l+(y+1)%l)*3,S=(r+M*l+y)*3,re=(r+Z*l+y)*3,oe=(r+w*l+y)*3,se=c[z]-c[F],ie=c[z+1]-c[F+1],fe=c[z+2]-c[F+2],Re=c[re]-c[S],Ue=c[re+1]-c[S+1],ye=c[re+2]-c[S+2];let De=Ue*fe-ye*ie,Ee=ye*se-Re*fe,Ne=Re*ie-Ue*se;const T=Math.hypot(De,Ee,Ne);T<1e-6?(De=0,Ee=1,Ne=0):(De/=T,Ee/=T,Ne/=T),d[oe]=De,d[oe+1]=Ee,d[oe+2]=Ne}}let x=g.ni;const C=g.idx;for(let w=0;w<f;w++)for(let M=0;M<l;M++){const Z=(M+1)%l,y=r+w*l+M,F=r+(w+1)*l+M,z=r+w*l+Z,S=r+(w+1)*l+Z;C[x++]=y,C[x++]=F,C[x++]=z,C[x++]=F,C[x++]=S,C[x++]=z}g.ni=x,g.nv+=(f+1)*l,(e&7)===7&&await u.yield()}const E=new n.BufferGeometry;return E.setAttribute("position",new n.BufferAttribute(g.pos.subarray(0,g.nv*3),3)),E.setAttribute("normal",new n.BufferAttribute(g.nor.subarray(0,g.nv*3),3)),E.setAttribute("aO",new n.BufferAttribute(g.ao.subarray(0,g.nv),1)),E.setAttribute("aBoil",new n.BufferAttribute(g.boil.subarray(0,g.nv),1)),E.setIndex(new n.BufferAttribute(g.idx.subarray(0,g.ni),1)),E.boundingSphere=new n.Sphere(new n.Vector3(350,330,-40),1300),{geo:E,cw:g.cw,nvOld:Le-be.nv,ghost:Ce,heads:L}}async function _t(u,s={}){const i=u.rng,P=u.quality?.detail??1,v=(Array.isArray(s.palette)&&s.palette.length>=7?s.palette:zt).map(o=>new n.Color(o)),A=(o,h=1)=>new n.Color(o).multiplyScalar(h),D=(s.sunElev??26)*lt,he=(s.sunAz??8)*lt,k=1/Math.tan(D),R=new n.Vector3(-Math.sin(he)*Math.cos(D),Math.sin(D),-Math.cos(he)*Math.cos(D)),V=new n.Vector3().crossVectors(R,new n.Vector3(0,1,0)).normalize(),p=new n.Vector3().crossVectors(V,R).normalize(),X=s.contactS??940,_=s.frontPerU??7700,te=s.skyDist??3600,de=s.deckY??10,j=new n.Vector3(250,405+i.range(-6,6),-335),J=20*lt,le=new n.Vector3(-17,j.y-267*Math.tan(J),-335),Se=[],ce=[];for(let o=0;o<=6;o++)Se.push(new n.Vector3().lerpVectors(le,j,o/6));const ge=le.y-53;for(let o=0;o<=9;o++){const h=o/9,U=Math.PI*(1+.5*h);ce.push(new n.Vector3(-17+345*Math.cos(U),ge+53*Math.pow(h,3.2),10+345*Math.sin(U)))}const g=[...[new n.Vector3(-362,ge-50,560),new n.Vector3(-362,ge-26,300)],...ce,...Se.slice(1)],ke=j.clone().add(new n.Vector3(Math.cos(J),Math.sin(J),0).multiplyScalar(90)),me=Pt([...g,ke]),ae=i.range(90,130),N={rng:i,lineDist:me,portal:j,shear:ae,climb:J,ring:s.portalRing!==!1,lineY:o=>le.y+(o-le.x)*Math.tan(J),res:Math.sqrt(Ke(P,.5,1)),reach:i.range(640,760),yUnder:540,overshoot:i.range(35,65),mcell:i.range(72,96),shoulder:{x:115+i.range(-12,12),z:-578,r:150*i.range(.95,1.05),y0:330,crest:i.range(455,480)},lobes:[]},ve=i.int(7,10);for(let o=0;o<ve;o++){const h=i.range(0,we),U=i.range(110,470);N.lobes.push({x:ae*Math.pow(U/560,1.6)+Math.cos(h)*262,y:U,z:Math.sin(h)*262,r:i.range(70,115)})}for(let o=0;o<3;o++){const h=i.range(0,we),U=i.range(290,400);N.lobes.push({x:N.shoulder.x+Math.cos(h)*118,y:U,z:N.shoulder.z+Math.sin(h)*118,r:i.range(60,90)})}const b=o=>Math.PI/2-o*(Math.PI/6),O=o=>i.range(-o,o),Q=s.corona||i.pick(["minimum","minimum","maximum","skewed"]),G=[];if(Q==="maximum"){const o=i.int(7,9),h=i.range(0,we);for(let U=0;U<o;U++)G.push([h+U/o*we+O(.16),i.range(3.6,6.2),i.range(.2,.3),i.range(.7,1)])}else Q==="skewed"?(G.push([b(3.5)+O(.1),6.6,.4,1],[b(9)+O(.1),5.2,.36,.9],[b(12.6)+O(.1),4.4,.3,.8]),G.push([b(6.2)+O(.1),2.7,.5,.5],[b(1.8)+O(.1),2.5,.35,.4])):(G.push([b(4)+O(.07),6,.42,1],[b(10)+O(.07),6.67,.42,.95],[b(1)+O(.08),3.9,.3,.72]),G.push([b(12.1)+O(.08),2.8,.5,.55],[b(6.9)+O(.08),2.8,.55,.6]));for(;G.length<9;)G.push([0,4,1,0]);const Ce=[],je=Ke(s.prominences??i.int(2,5),0,5),Ge=i.range(0,we);for(let o=0;o<5;o++)Ce.push(o<je?[Ge+o/je*we+O(.45),[0,1,2,1,0][o],i.range(.55,.9),1]:[0,0,.5,0]);const Ie=o=>new n.Vector4(o[0],o[1],o[2],o[3]),I={uUmbra:{value:new n.Vector4(-1e5,-2e5,k,0)},uSunDir:{value:R},uTime:{value:0},uOrg:{value:new n.Vector3},uSkyA:{value:[A("#0E2A66"),v[0].clone(),A("#9DB4D6"),v[2].clone()]},uSkyB:{value:[A("#1C1B38"),v[3].clone(),A("#C9705A"),v[5].clone(),A("#FFB36B")]},uCam:{value:new n.Vector4(0,1,0,0)},uDomeE:{value:new n.Vector2},uKey:{value:new n.Color(1,1.03,1.1)},uGold:{value:new n.Color(1.05,.8,.48)},uShade:{value:A("#4E6FA8")},uWarm:{value:A("#8A5A4E")},uCool:{value:A("#5A5880")},uPearl:{value:v[4].clone()},uBoltCol:{value:A("#C9C4FF",1.5)},uBolt:{value:[new n.Vector4,new n.Vector4,new n.Vector4]},uSeat:{value:new n.Vector4},uOwn:{value:new n.Vector4(0,0,1,0)},uHgt:{value:new n.Vector4(0,1/640,de,s.hazeMix??1)},uOccA:{value:new n.Vector4},uOccB:{value:new n.Vector4},uSunR:{value:V},uSunU:{value:p},uSkyDist:{value:te},uSunA:{value:new n.Vector4(.7,0,0,0)},uDia:{value:new n.Vector4(0,0,0,0)},uCdir:{value:new n.Vector2(-.7071,.7071)},uStr:{value:G.map(Ie)},uProm:{value:Ce.map(Ie)},uRose:{value:v[6].clone()},uPx:{value:1},uStar:{value:0},uSoftK:{value:s.soft??.2}},be=(...o)=>{const h={};for(const U of o)h[U]=I[U];return h},Le=["uUmbra","uSunDir","uTime","uOrg","uSkyA","uSkyB","uCam"],pe=[...Le,"uKey","uGold","uShade","uWarm","uCool","uPearl","uBoltCol","uBolt","uSeat","uOwn","uHgt","uOccA","uOccB","uSoftK"],W=o=>Object.assign(n.UniformsUtils.clone(n.UniformsLib.fog),o),ne=(o={})=>{const h=W(be(...pe));return o.hgt&&(h.uHgt={value:o.hgt}),o.soft!=null&&(h.uSoftK={value:o.soft}),o.override&&Object.assign(h,o.override),h},Y=(o={})=>new n.ShaderMaterial({vertexShader:St,fragmentShader:kt,uniforms:ne(o),fog:!0,defines:{LOBE3:P>=.99&&o.lobe3!==!1?1:0}}),ue=new n.Group;ue.name="the-umbra";const Ve=new n.Mesh(new n.IcosahedronGeometry(1,3),new n.ShaderMaterial({vertexShader:Dt,fragmentShader:Vt,uniforms:be(...Le,"uDomeE"),side:n.BackSide,depthTest:!1,depthWrite:!1}));Ve.renderOrder=-.5,Ve.frustumCulled=!1,ue.add(Ve);const Oe=58,Me=new Float32Array((Oe+2)*3),Fe=new Float32Array((Oe+2)*3),$=new n.Vector3;for(let o=0;o<Oe+2;o++){if(o===0)$.copy(R).addScaledVector(V,.187).addScaledVector(p,-.165).normalize(),Fe.set([5.5,5,-1],0);else if(o===1)$.copy(R).addScaledVector(V,-1.1).addScaledVector(p,.2).normalize(),Fe.set([4.2,2.6,-1],3);else{do{const U=i.range(0,we),ze=i.range(.1,.98),B=Math.sqrt(1-ze*ze);$.set(Math.cos(U)*B,ze,Math.sin(U)*B)}while($.dot(R)>.955);const h=Math.pow(i(),2.2);Fe.set([2+1.6*h,.3+1.5*h,i()],o*3)}Me.set([$.x,$.y,$.z],o*3)}const K=new n.BufferGeometry;K.setAttribute("position",new n.BufferAttribute(Me,3)),K.setAttribute("aS",new n.BufferAttribute(Fe,3));const q=new n.Points(K,new n.ShaderMaterial({vertexShader:Rt,fragmentShader:Bt,uniforms:be("uTime","uSkyDist","uPx","uStar","uPearl"),transparent:!0,depthWrite:!1,blending:n.AdditiveBlending}));q.renderOrder=-6,q.frustumCulled=!1,ue.add(q);const L=new n.Mesh(new n.PlaneGeometry(2,2),new n.ShaderMaterial({vertexShader:Ot,fragmentShader:Ft,uniforms:be("uSunDir","uSunR","uSunU","uSkyDist","uSunA","uDia","uCdir","uStr","uProm","uPearl","uRose","uTime"),transparent:!0,depthWrite:!1,side:n.DoubleSide,blending:n.CustomBlending,blendEquation:n.AddEquation,blendSrc:n.OneFactor,blendDst:n.OneMinusSrcAlphaFactor}));L.renderOrder=-5,L.frustumCulled=!1,ue.add(L),await u.yield();const{geo:E,cw:e,nvOld:t,ghost:a,heads:r}=await Nt(u,N),f=Y(),l=new n.Mesh(E,f);l.frustumCulled=!1,ue.add(l),await u.yield();const c=E.attributes.position,d=E.attributes.normal,x=E.attributes.aO,C=[],w=(s.fringe??0)>0;let M=a;await u.yield();for(let o=0;o<t;o++)(o&8191)===8191&&await u.yield(),e[o]>=.45&&x.getX(o)>.6&&c.getY(o)>70&&c.getY(o)<600&&(M++,w&&C.push(o));if(w){for(let o=0;o<a;o++)C.push(-1);i.shuffle(C)}else for(let o=M-1;o>0;o--)i();await u.yield();const Z=Math.round((s.fringe??0)*P),y=[],F=[],z=[],S=rt("umbra-fringe:"+(u.seed??1));for(let o=0;o<C.length&&y.length/3<Z;o++){(o&255)===255&&await u.yield();const h=C[o];if(h<0)continue;const U=c.getX(h),ze=c.getY(h),B=c.getZ(h),H=me(U,ze,B);if(H>420||H>190&&S()>.3)continue;const _e=H<110?S.range(5,10):H<300?S.range(9,16):S.range(14,24);H-_e*.85<40||(y.push(U+d.getX(h)*_e*.1,ze+d.getY(h)*_e*.1,B+d.getZ(h)*_e*.1),F.push(_e,S()),z.push(d.getX(h),d.getY(h),d.getZ(h)))}const re=new n.Vector3(-Math.cos(J),-Math.sin(J),0);if(s.portalRing!==!1)for(let o=0;o<220;o++)i();F.length||(y.push(0,120,0),F.push(1,0),z.push(0,1,0));function oe(o,h,U,ze={}){const B=new n.InstancedBufferGeometry;B.setAttribute("position",new n.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),3)),B.setIndex([0,1,2,0,2,3]),B.setAttribute("aPos",new n.InstancedBufferAttribute(new Float32Array(o),3)),B.setAttribute("aNrm",new n.InstancedBufferAttribute(new Float32Array(h),3)),B.setAttribute("aSz",new n.InstancedBufferAttribute(new Float32Array(U),2)),B.instanceCount=U.length/2;const H=new n.Mesh(B,new n.ShaderMaterial({vertexShader:At,fragmentShader:Ct,uniforms:ne(ze),fog:!0}));return H.frustumCulled=!1,H}const se=oe(y,z,F);ue.add(se);const ie=[new n.Vector3(-150,290,-110),new n.Vector3(ae*.5+30,470,150),new n.Vector3(120,385,-170)],fe=new n.Vector3(N.shoulder.x+26,N.shoulder.crest,N.shoulder.z),Re=new n.Vector3(60,330,-60),Ue={portalSeat:{position:j.clone(),normal:re.clone(),radius:10,tilt:20},canyonLine:Se,flankArc:ce,flyThrough:g,sunDir:R.clone(),sunPoint:R.clone().multiplyScalar(3e3).add(new n.Vector3(-362,260,200)),bolts:ie.map(o=>o.clone()),crest:fe,cruiseY:300,viewpoints:[{position:new n.Vector3(-395,300,1370),target:new n.Vector3(-330,290,0),phase:0},{position:new n.Vector3(-395,225,710),target:new n.Vector3(-380,215,0),phase:.3},{position:new n.Vector3(-375,232,270),target:new n.Vector3(-375,232,270).addScaledVector(R,900).add(new n.Vector3(60,-120,0)),phase:.5},{position:ce[5].clone(),target:ce[7].clone().add(new n.Vector3(30,20,25)),phase:.74},{position:Se[2].clone(),target:j.clone(),phase:.93}]},ye={d2:3e3,d3:-6400,camIn:0,open:0,light:1},De=new n.Color,Ee=A("#9DB4D6"),Ne=v[5].clone().lerp(A("#C9705A"),.5).multiplyScalar(.55),T=new n.Vector3,We=new n.Vector3,at=new n.Vector2,Ae=[0,0,0],nt=i.int(1,1e9),He=o=>{let h=Math.imul(o^nt,2654435761);return h^=h>>>15,h=Math.imul(h,2246822519),h^=h>>>13,(h>>>0)/4294967296};let Ye=!1,Be=0,qe=-3400;const Ze=o=>m(-130,130,o)*(.65+.35*m(0,1500,o));function $e(o,h,U){ue.updateWorldMatrix(!0,!1),T.setFromMatrixPosition(ue.matrixWorld),We.setFromMatrixPosition(U.matrixWorld).sub(T);const ze=We.z+k*We.y;if(!Ye){const ee=(h/40+.15)%1;Be=ze-(3e3-8400*ee),qe=Be-3400}const B=ze-Be,H=qe-ze,_e=m(600,-300,B)*m(600,-300,H),Je=m(-135,-700,B)*m(-40,-420,H),wt=.65+.35*m(0,1500,Math.max(B,H));I.uOrg.value.copy(T),I.uTime.value=h,I.uUmbra.value.set(Be,qe,k,Je),I.uCam.value.set(_e,wt,H>-200?1:0,0),I.uDomeE.value.set(Be+4e4*m(-1500,300,H),qe-4e4*m(-1500,300,B)),I.uHgt.value.x=T.y,I.uHgt.value.z=T.y+de,I.uOccA.value.set(N.shoulder.x+T.x,N.shoulder.y0+T.y,N.shoulder.z+T.z,N.shoulder.r),I.uOccB.value.set(ae+T.x,N.yUnder+T.y,T.z,N.reach),I.uSkyDist.value=Math.min(te,(U.far||6e3)*.78),I.uPx.value=u.renderer?u.renderer.getDrawingBufferSize(at).y/450:1,I.uStar.value=_e*Je;const dt=B>0?.1+.62*Math.min(B,3500)/3500:H>0?-(.1+.62*Math.min(H,3500)/3500):.1*(1-2*Ke(-B/Math.max(Be-qe,1),0,1)),gt=m(160,-220,B)*m(430,-220,H)*(.45+.55*Je),bt=m(40,-40,B)*(1-m(-200,-300,B))-m(40,-40,H)*(1-m(-200,-300,H)),mt=m(300,110,B)*(1-m(-50,-140,B)),vt=m(-130,-30,H)*(1-m(170,420,H));I.uSunA.value.set(dt,gt,Math.pow(_e,.6),bt);const pt=vt>mt?3:-3;I.uDia.value.set(I.uCdir.value.x*pt,I.uCdir.value.y*pt,Math.max(mt,vt),Ke((Math.abs(dt)-.1)/.62,0,1)),Ae[0]=Ae[1]=Ae[2]=0;const yt=Math.floor(h/.5);for(let ee=yt-1;ee<=yt;ee++){if(He(ee)>.62)continue;const Qe=h-(ee+.1+.3*He(ee*13+5))*.5;if(Qe<=0||Qe>=.42)continue;const Mt=Qe<.1?m(0,.1,Qe):1-m(.1,.4,Qe),xt=Math.floor(He(ee*7+3)*3);Ae[xt]=Math.max(Ae[xt],Mt*(.55+.45*He(ee*3+1)))}if(Te.boltOverride)for(let ee=0;ee<3;ee++)Ae[ee]=Te.boltOverride[ee]??Ae[ee];for(let ee=0;ee<3;ee++)I.uBolt.value[ee].set(ie[ee].x+T.x,ie[ee].y+T.y,ie[ee].z+T.z,Ae[ee]);I.uOwn.value.set(N.shoulder.x+14+T.x,N.shoulder.z+T.z,N.shoulder.r,0),I.uSeat.value.set(j.x+T.x,j.y+T.y,j.z+T.z,Te.seatGlow),ye.d2=B,ye.d3=H,ye.camIn=_e,ye.open=Je,ye.light=Math.max(Ze(B),Ze(H)),Te.flash=Math.max(Ae[0],Ae[1],Ae[2]),De.copy(Ne).multiplyScalar(.5+.5*Je).lerp(Ee,ye.light)}const Te={object:ue,radius:620,height:700,center:Re,anchors:Ue,update:$e,ground:!1,groundY:0,uniforms:I,state:ye,haze:De,heads:r.length,flash:0,boltOverride:null,seatGlow:s.seatGlow??.35,makePuffs:oe,makeCloudMaterial:Y,cloudUniforms:ne,material:f,setPhase(o){Ye=!0,Be=X+_*(o-.39),qe=Be-3400},setFront(o,h){Ye=!0,Be=o,qe=h??o-3400},release(){Ye=!1},dispose(){}};return ue.userData.hero=Te,Te}export{Tt as UMBRA_CHUNKS,ct as UMBRA_GLSL,_t as buildHero};
