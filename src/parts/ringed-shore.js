import*as e from"three";import{clamp as ae,lerp as ne,smoothstep as Me}from"../kit/core.js";const nt=["#110838","#371d78","#22aea2","#ff7ab8","#dcae82","#1a1630","#b8fff0"],R=Math.PI/180,Ee=`
uniform vec3 uZen, uMid, uHor, uPink, uSand, uDark, uIce;
uniform vec3 uPC, uPR, uPU;          // planet centre direction and tangent basis (hero-local)
uniform float uPTan;                 // tan(angular radius)
uniform vec3 uAxis, uE1, uE2;        // planet axis and equatorial basis, planet frame
uniform vec3 uL1, uL2;               // key (blue-white) and afterglow (pink) light, planet frame
uniform vec3 uSunD;                  // second sun direction (hero-local)
uniform vec2 uGlowAz;                // azimuth of the afterglow (xz, unit)
uniform vec4 uMoon[2];               // xyz dir, w = cos(angular radius)
uniform float uTime, uBandSeed, uFull;
uniform vec4 uStorm;                 // lon, lat, size, strength
uniform vec3 uBandA, uBandB;         // the two band colours of this seed's planet
uniform vec2 uRing;                  // ring inner radius and width, in planet radii
uniform vec4 uMoonSh;                // a small moon in transit: shadow x, y on the disc, radius (0: none), drift per second

float h11(float p){ p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float h31(vec3 p){ p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float vn1(float x){ float i = floor(x), f = fract(x); f = f * f * (3. - 2. * f); return mix(h11(i), h11(i + 1.), f); }
float vn2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float fb2(vec2 p){ return vn2(p) * 0.55 + vn2(p * 2.07 + 7.1) * 0.3 + vn2(p * 4.3 + 3.7) * 0.15; }

vec3 skyGrad(vec3 d){
  float y = max(d.y, 0.);
  vec3 c = mix(uMid, uZen, smoothstep(0.04, 0.8, y));
  c = mix(c, uHor * 0.42, exp(-y * 6.0));
  float az = max(dot(normalize(d.xz + vec2(1e-5)), uGlowAz), 0.);
  c += uPink * (exp(-y * 5.5) * pow(az, 6.) * 0.46 + exp(-y * 14.) * pow(az, 2.5) * 0.3);
  c += uSand * exp(-y * 26.) * pow(az, 12.) * 0.3;
  // the set primary's afterglow: a soft pink band over the first six degrees, under the planet
  c += (uPink * 0.34 + uSand * 0.07) * exp(-y * y * 120.) * pow(az, 9.);
  return c;
}

float ringDensity(float rho){
  float x = (rho - uRing.x) / uRing.y;
  if (x <= 0. || x >= 1.) return 0.;
  float d = smoothstep(0., 0.03, x) * smoothstep(1., 0.94, x);
  d *= 0.42 + 0.58 * vn1(x * 26. + uBandSeed * 3.);
  d *= 0.75 + 0.25 * vn1(x * 90. + uBandSeed);
  d *= 1. - 0.93 * smoothstep(0.035, 0.008, abs(x - 0.6));
  d *= 1. - 0.7 * smoothstep(0.016, 0.003, abs(x - 0.31));
  d *= 1. - 0.6 * smoothstep(0.012, 0.002, abs(x - 0.84));
  d *= mix(0.3, 1., smoothstep(0.1, 0.19, x));
  return d;
}

// rgb = colour, a = coverage of bodies (planet, rings, sun, moons). d.y must be >= 0.
vec4 skyFigure(vec3 d, float withStars){
  vec3 grad = skyGrad(d);
  vec3 col = grad;
  float cov = 0.;
  // stars
  if (withStars > 0.5 && uFull > 0.5) {
    vec3 sp = d * 190.; vec3 ip = floor(sp); float h = h31(ip);
    float st = step(0.9945, h) * smoothstep(0.42, 0.05, length(fract(sp) - 0.5));
    st *= 0.6 + 0.4 * sin(uTime * (1.5 + h * 40.) + h * 300.);
    col += mix(uIce, uPink, fract(h * 91.)) * st * 2.2 * smoothstep(0.03, 0.3, d.y);
    // a second, finer and fainter layer behind the first, for depth
    vec3 sp2 = d * 420. + 17.; float h2 = h31(floor(sp2));
    float st2 = step(0.9945, h2) * smoothstep(0.45, 0.1, length(fract(sp2) - 0.5)) * (0.7 + 0.3 * sin(uTime * (1. + h2 * 30.) + h2 * 200.));
    col += mix(uIce, uHor * 1.6, fract(h2 * 57.)) * st2 * 1.1 * smoothstep(0.03, 0.3, d.y);
    // faint nebula: two soft bands of pink and teal in the upper sky
    float nb = fb2(d.xz * 2.2 / (0.35 + d.y) + 11.);
    col += (uPink * 0.07 + uHor * 0.05) * smoothstep(0.45, 0.85, nb) * smoothstep(0.15, 0.6, d.y);
  }
  // moons
  for (int i = 0; i < 2; i++) {
    vec3 m = uMoon[i].xyz; float md = dot(d, m), cr = uMoon[i].w;
    float k = sqrt(max(1. - md * md, 0.)) / sqrt(1. - cr * cr);
    if (md > 0. && k < 1.) {
      vec3 l = normalize(d - m * md + 1e-6);
      vec3 n = l * k - m * sqrt(1. - k * k);
      float df = smoothstep(-0.05, 0.3, dot(n, uSunD)) * (0.7 + 0.3 * vn2(n.xy * 9. + float(i) * 5.));
      float a = smoothstep(1., 0.86, k);
      col = mix(col, grad * 0.7 + mix(uSand, uIce, 0.3) * df * 1.3, a);
      cov = max(cov, a);
    }
  }
  // planet and rings
  float dz = dot(d, uPC);
  if (dz > 0.25) {
    vec2 q = vec2(dot(d, uPR), dot(d, uPU)) / (dz * uPTan);
    float r2 = dot(q, q);
    if (r2 < 5.8) {
      vec3 L1 = normalize(uL1 + uAxis * 0.16 * sin(uTime * 0.045));
      float zr = -(q.x * uAxis.x + q.y * uAxis.y) / uAxis.z;
      vec3 pr = vec3(q, zr);
      float rho = length(pr);
      float ra = ringDensity(rho);
      vec3 ringLit = vec3(0.);
      if (ra > 0.001) {
        float al1 = dot(pr, L1), al2 = dot(pr, uL2);
        float s1 = al1 < 0. ? smoothstep(1.03, 0.9, length(pr - al1 * L1)) : 0.;
        float s2 = al2 < 0. ? smoothstep(1.03, 0.9, length(pr - al2 * uL2)) : 0.;
        float side = smoothstep(-1.6, 1.6, q.x * sign(uL1.x));
        ringLit = mix(uSand * 1.35, uIce, 0.3) * (0.14 + 1.0 * side) * (1. - s1)
                + uPink * 1.25 * (1. - side) * (1. - s2 * 0.8) * (1. - s1 * 0.8)
                + uMid * 0.2;
        ringLit *= 0.7 + 0.5 * ra;
      }
      float rr = sqrt(r2);
      float pa = smoothstep(1.0, 0.985, rr);
      // back half of the rings
      if (zr < 0. || rr >= 1.) { col = col * (1. - ra * 0.8) + ringLit * ra; cov = max(cov, ra); }
      if (pa > 0.) {
        float nz = sqrt(max(1. - r2, 0.));
        vec3 n = vec3(q, nz);
        float lat = dot(n, uAxis);
        float lon = atan(dot(n, uE1), dot(n, uE2)) + uTime * 0.004;
        float turb = fb2(vec2(lon * 2.2, lat * 9.) + uBandSeed) - 0.5;
        float w = lat * 7.5 + turb * (0.55 + 0.5 * sin(lat * 5. + uBandSeed)) + uBandSeed;
        float b1 = 0.5 + 0.5 * sin(w * 2.0);
        float b2 = 0.5 + 0.5 * sin(w * 5.3 + 1.7 + turb * 2.);
        float b3 = vn1(lat * 34. + uBandSeed * 7. + turb * 3.);
        vec3 base = mix(uBandA, uBandB, b1);
        base = mix(base, uMid * 2.2 + uPink * 0.15, b2 * 0.5);
        base = mix(base, mix(uIce, uSand, 0.4) * 0.9, smoothstep(0.62, 0.95, b3) * 0.55);
        base = mix(base, uHor * 0.7 + uMid, smoothstep(0.72, 1., abs(lat)) * 0.7);
        base *= 0.5 + 0.5 * smoothstep(0.15, 0.85, 0.5 + 0.5 * sin(w * 2.0 + 0.9)) + 0.18 * (b3 - 0.5);
        vec2 sv = vec2(mod(lon - uStorm.x + 3.1416, 6.2832) - 3.1416, (lat - uStorm.y) * 2.4) / uStorm.z;
        float storm = exp(-dot(sv, sv));
        base = mix(base, uPink * 1.1 + uSand * 0.3, storm * uStorm.w * (0.6 + 0.4 * sin(length(sv) * 9. - atan(sv.y, sv.x) * 2.)));
        float df1 = smoothstep(-0.1, 0.6, dot(n, L1));
        float df2 = pow(max(dot(n, uL2), 0.), 2.4);
        // ring shadow on the globe
        float tl = -dot(n, uAxis) / (dot(L1, uAxis) + 1e-4);
        float rsh = tl > 0. ? ringDensity(length(n + tl * L1)) : 0.;
        df1 *= 1. - 0.82 * rsh;
        // a small moon in transit throws a round shadow that creeps across the bands
        vec2 ms = q - vec2(uMoonSh.x + uTime * uMoonSh.w, uMoonSh.y);
        float msr = max(uMoonSh.z, 1e-3);
        df1 *= 1. - 0.9 * step(0.001, uMoonSh.z) * smoothstep(msr, msr * 0.5, length(ms));
        vec3 lit = base * (mix(uIce, vec3(0.9, 0.93, 1.), 0.55) * 0.95 * df1 + uPink * 0.85 * df2 + uMid * 0.2 + uHor * 0.02);
        lit *= mix(0.5, 1., sqrt(nz));
        float rim = pow(1. - nz, 3.5);
        lit += (uPink * (0.25 + 1.5 * df2) + uIce * 0.45 * df1 + uHor * 0.12) * rim;
        col = mix(col, grad * 0.5 + lit, pa);
        cov = max(cov, pa);
        if (uMoonSh.z > 0.) {
          // the moon itself, sunward of its shadow
          vec2 mq = (ms - normalize(L1.xy + vec2(1e-4)) * msr * 3.4) / (msr * 0.72);
          float md2 = dot(mq, mq);
          vec3 mn = vec3(mq, sqrt(max(1. - md2, 0.)));
          vec3 mc = mix(uSand, uIce, 0.45) * (0.12 + 1.05 * smoothstep(-0.1, 0.5, dot(mn, L1))) + uPink * 0.1;
          col = mix(col, mc, smoothstep(1., 0.7, md2) * pa);
        }
      }
      // front half of the rings
      if (zr >= 0. && rr < 1.) { col = col * (1. - ra * 0.85) + ringLit * ra; cov = max(cov, ra); }
    }
  }
  // the small blue-white second sun
  float sd = max(dot(d, uSunD), 0.);
  float disc = smoothstep(0.99987, 0.99994, sd);
  vec3 sun = mix(uIce, vec3(0.7, 0.84, 1.), 0.7) * (disc * 4.5 + pow(sd, 5200.) * 0.55) + mix(uIce, vec3(0.55, 0.72, 1.), 0.8) * (pow(sd, 320.) * 0.045 + pow(sd, 28.) * 0.018);
  col += sun;
  cov = max(cov, clamp(disc + pow(sd, 2600.) + pow(sd, 320.) * 0.3, 0., 1.));
  // horizon haze sits in front of everything
  float hz = exp(-max(d.y, 0.) * 22.);
  col = mix(col, grad, hz * 0.75);
  cov *= 1. - hz * 0.75 * (1. - uFull);
  return vec4(col, cov);
}
`,it=`
vec3 skyLite(vec3 d){
  vec3 grad = skyGrad(d);
  vec3 col = grad;
  float dz = dot(d, uPC);
  if (dz > 0.25) {
    vec2 q = vec2(dot(d, uPR), dot(d, uPU)) / (dz * uPTan);
    float r2 = dot(q, q);
    if (r2 < 5.8) {
      float zr = -(q.x * uAxis.x + q.y * uAxis.y) / uAxis.z;
      float x = (length(vec3(q, zr)) - uRing.x) / uRing.y;
      float ra = (x > 0. && x < 1.) ? smoothstep(0., 0.05, x) * smoothstep(1., 0.9, x) * (0.6 + 0.4 * sin(x * 40. + uBandSeed)) * (1. - 0.9 * smoothstep(0.04, 0.01, abs(x - 0.6))) : 0.;
      float side = smoothstep(-1.6, 1.6, q.x * sign(uL1.x));
      vec3 ringLit = mix(uSand * 1.35, uIce, 0.3) * (0.14 + side) + uPink * 1.25 * (1. - side);
      float rr = sqrt(r2);
      float pa = smoothstep(1., 0.97, rr);
      if (zr < 0. || rr >= 1.) col = col * (1. - ra * 0.8) + ringLit * ra * 0.9;
      if (pa > 0.) {
        vec3 n = vec3(q, sqrt(max(1. - r2, 0.)));
        float w = dot(n, uAxis) * 15. + uBandSeed * 2.;
        vec3 base = mix(uBandA, uBandB, 0.5 + 0.5 * sin(w)) * (0.72 + 0.28 * sin(w + 0.9));
        vec3 lit = base * (vec3(0.72, 0.96, 0.94) * 0.95 * smoothstep(-0.1, 0.6, dot(n, uL1)) + uPink * 0.85 * pow(max(dot(n, uL2), 0.), 2.4) + uMid * 0.2);
        col = mix(col, grad * 0.5 + lit, pa);
      }
      if (zr >= 0. && rr < 1.) col = col * (1. - ra * 0.85) + ringLit * ra * 0.9;
    }
  }
  float sd = max(dot(d, uSunD), 0.);
  col += vec3(0.75, 0.9, 1.) * (pow(sd, 2600.) * 6. + pow(sd, 320.) * 0.07);
  return col;
}
`,He=`
uniform vec4 uRip[8];       // x, z, strength, phase
uniform float uRipGain;
uniform int uRipN;         // number of sources in use
vec2 rippleSlope(vec2 p, float t){
  vec2 g = vec2(0.);
  for (int i = 0; i < 8; i++) {
    if (i >= uRipN) break;
    if (uRip[i].z <= 0.) continue;
    vec2 dv = p - uRip[i].xy; float dist = length(dv) + 1e-3;
    if (dist > 85.) continue;
    float env = uRip[i].z * exp(-dist * 0.065) * smoothstep(0.5, 4., dist);
    g += (dv / dist) * cos(dist * 2.6 - t * 1.9 + uRip[i].w) * env * uRipGain;
  }
  // wind ripples in drifting patches ("cat's paws") with calm mirror between them
  float calm = 0.25 + 0.75 * smoothstep(-0.3, 0.9, sin(p.x * 0.023 + 1.7 * sin(p.y * 0.019 + t * 0.02)) + 0.6 * sin(p.y * 0.031 - p.x * 0.013 + t * 0.03));
  g += 0.36 * calm * vec2(sin(p.x * 0.83 + p.y * 0.31 + t * 1.3) + 0.5 * sin(p.x * 2.3 - p.y * 1.1 - t * 2.0),
                   sin(p.y * 1.07 - p.x * 0.4 + t * 1.1) + 0.5 * sin(p.y * 2.7 + p.x * 0.8 + t * 2.3));
  // slow swell: long low waves that make the whole reflection breathe
  g += (0.3 + 0.25 * calm) * vec2(sin(p.x * 0.19 + p.y * 0.07 + t * 0.9), sin(p.y * 0.23 - p.x * 0.05 + t * 1.05) + 0.6 * sin(p.y * 0.11 + t * 0.6));
  return g;
}
`,st=`
varying vec3 vDir;
void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }
`,rt=`
precision highp float;
varying vec3 vDir;
uniform vec3 uCamL;
${Ee}
${He}
void main(){
  vec3 d = normalize(vDir);
  vec4 s;
  if (d.y >= 0.) {
    s = skyFigure(d, 1.);
  } else {
    float h = max(uCamL.y, 0.5);
    float tHit = h / max(-d.y, 1e-4);
    vec2 hit = uCamL.xz + d.xz * tHit;
    float fade = 1. / (1. + tHit * 0.03);
    vec2 g = rippleSlope(hit, uTime) * 0.013 * fade;
    vec3 r = reflect(d, normalize(vec3(-g.x, 1., -g.y)));
    r.y = abs(r.y);
    s = skyFigure(normalize(r), 1.);
    float steep = smoothstep(0., 0.6, -d.y);
    s.rgb = mix(s.rgb * 0.88, s.rgb * 0.68 + uDark * 0.05, steep);
    s.a *= 0.9;
  }
  float seam = exp(-abs(d.y) * 42.);
  float az = max(dot(normalize(d.xz + vec2(1e-5)), uGlowAz), 0.);
  s.rgb = mix(s.rgb, uHor * 0.5 + uPink * 0.26 * pow(az, 3.) + uSand * 0.1 * pow(az, 14.), seam * 0.6 * uFull);
  gl_FragColor = vec4(s.rgb, mix(s.a, 1., uFull));
}
`,ct=`
attribute vec3 aData;   // x: 0 base .. 1 tip, y: per-crystal seed, z: glow strength
attribute vec3 color;
varying vec3 vP, vN, vData, vCol;
uniform float uMirror, uTime;
#include <fog_pars_vertex>
void main(){
  vP = position; vN = normal; vData = aData; vCol = color;
  vec3 p = position;
  if (uMirror > 0.5) {
    float dep = max(p.y, 0.);
    p.x += sin(p.y * 0.9 + uTime * 1.3 + p.z * 0.3) * 0.012 * dep;
    p.z += sin(p.y * 1.2 - uTime * 1.1 + p.x * 0.3) * 0.008 * dep;
  }
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,lt=`
precision highp float;
varying vec3 vP, vN, vData, vCol;
uniform vec3 uCamL;
uniform float uMirror, uArrive, uPulse;
uniform vec3 uGlowDir;
#include <fog_pars_fragment>
${Ee}
${it}
void main(){
  if (vP.y < 0.) discard;
  vec3 cam = uCamL; if (uMirror > 0.5) cam.y = -cam.y;
  vec3 V = normalize(cam - vP);
  vec3 N = normalize(vN);
  if (dot(N, V) < 0.) N = -N;
  float tip = vData.x, seed = vData.y, glowK = vData.z;
  // tertiary detail: growth striations and internal frost / fracture planes
  float dk = smoothstep(0.14, 0.11, max(vCol.r, max(vCol.g, vCol.b)));     // 1 on the dark teeth (body colour multiplied down by the builder)
  float stri = sin(tip * (150. + seed * 120.) + seed * 40.) * (1. - 0.8 * dk);
  float frost = fb2(vP.xy * 1.3 + vP.z * 0.9 + seed * 17.);
  vec3 fd = normalize(vec3(sin(seed * 31.), 0.6, cos(seed * 47.)));
  float frac = smoothstep(0.955, 1., abs(sin(dot(vP, fd) * (1.6 + seed * 2.) + frost * 5.)));
  N = normalize(N + (stri * 0.035 + (frost - 0.5) * 0.12) * normalize(cross(N, vec3(0.31, 0.9, 0.3)) + 1e-4));
  float ndv = max(dot(N, V), 0.);
  float fres = pow(1. - ndv, 3.);
  vec3 R0 = reflect(-V, N);
  vec3 R = vec3(R0.x, abs(R0.y), R0.z);
  vec3 T = refract(-V, N, 0.74); T.y = abs(T.y) * 0.6 + 0.05; T = normalize(T);
  vec3 refl = skyLite(R);
  vec3 thru = skyGrad(T) + (uPink * 0.45 + uSand * 0.3) * smoothstep(0.78, 0.96, dot(T, uPC));
  vec3 body = vCol * (0.75 + 0.5 * frost);
  body = mix(uMid * (1.1 + 1.6 * frost) + uPink * 0.03, body, smoothstep(-1., 15., vP.y + frost * 6.));
  float keyD = max(dot(N, uSunD), 0.);
  float glowD = max(dot(N, uGlowDir), 0.);
  vec3 keyC = mix(uIce, vec3(0.75, 0.86, 1.), 0.5);
  vec3 col = body * (keyC * keyD * 0.85 + uPink * glowD * 0.75 + uMid * 0.5 + uHor * 0.08);
  col += thru * (body * 2.0 + 0.07) * (1. - fres) * 0.6;
  col += refl * mix(0.09, 0.85, fres);
  // the arch (everything within 30 m of the origin) has a key side and a shadow side: faces turned from the small sun sink
  // toward dark violet, so the lancet is a dark frame with bright edges against the planet
  float archK = 1. - smoothstep(30., 40., length(vP.xz));
  col = mix(col, col * 0.2 + (uDark * 0.6 + uMid * 0.4) * 0.7, 0.9 * archK * smoothstep(0.35, -0.3, dot(N, uSunD)) * (1. - 0.6 * fres));
  // the dark teeth (body colour multiplied down by the builder) stay silhouettes: little sky shows through or on them
  col *= 1. - 0.6 * dk;
  col += mix(keyC, vCol * 3., 0.25) * min(pow(max(dot(R0, uSunD), 0.), 70.) * 5., 1.0);
  col += uPink * pow(max(dot(R0, uGlowDir), 0.), 12.) * 0.5;
  // spectral flashes: thin-film colour that swings with the view angle
  vec3 spec = 0.5 + 0.5 * cos(6.2832 * (ndv * 2.6 + seed * 3. + frost * 0.6 + vec3(0., 0.33, 0.67)));
  float flash = smoothstep(0.55, 0.95, sin(ndv * 23. + seed * 50. + dot(vP, fd) * 0.6) * 0.5 + 0.5);
  col += spec * flash * (0.16 + 0.4 * fres) * (0.5 + 0.7 * keyD) * (1. - 0.6 * dk);
  col += (uIce * 0.5 + spec * 0.3) * frac * 0.22 * (1. - 0.75 * dk);
  // inner light gathering toward the tips
  float pulse = 0.8 + 0.2 * sin(uTime * 0.9 + seed * 20.);
  float glow = pow(clamp(tip, 0., 1.), 5.) * glowK * pulse;   // clamped: multisampling extrapolates tip past its range on facets seen edge-on
  vec3 glowC = mix(uHor, uIce, 0.4 + 0.35 * tip) * (0.75 + 0.5 * spec);
  col += glowC * glow * (1.7 + 0.4 * uArrive);
  // arrival: one band of light climbing the whole arch
  float band = (vP.y - uPulse * 32.) * 0.42;
  col += glowC * exp(-band * band) * uArrive * 0.6;
  // waterline: wet dark band and a thin bright meniscus
  col *= 0.6 + 0.4 * smoothstep(0., 1.3, vP.y);
  col += uIce * 0.5 * smoothstep(0.14, 0.0, vP.y);
  if (uMirror > 0.5) col = col * 0.82 + uDark * 0.03;
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}
`,ut=`
varying vec3 vP;
#include <fog_pars_vertex>
void main(){
  vP = position;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,dt=`
precision highp float;
varying vec3 vP;
uniform vec3 uCamL, uSand, uDark, uMid, uIce, uPink, uHor, uSunD;
uniform float uTime, uSandR;
#include <fog_pars_fragment>
float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vn2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
${He}
void main(){
  vec3 toCam = uCamL - vP;
  float dist = length(toCam);
  vec3 V = toCam / dist;
  float ndv = clamp(V.y, 0., 1.);
  float look = smoothstep(0.22, 0.95, ndv);
  vec2 p = vP.xz;
  // rippled sand under the film: two crossing ripple trains, both bent by slow noise, shown only near the camera.
  // (Crests mostly run across the line of flight: crests along it turn into rays from the vanishing point.)
  float nearK = 1. - smoothstep(14., 60., dist);
  float wv = vn2(p * 0.045) * 6. + vn2(p * 0.013) * 9.;
  vec2 wq = vec2(vn2(p * 0.09 + 3.1), vn2(p * 0.09 + 17.7)) * 5.5;
  float phA = p.y * 2.05 + p.x * 0.38 + wq.x * 1.7 + wv * 1.2;
  float phB = (p.x * 0.866 + p.y * 0.5) * 1.33 + wq.y * 2.1 - wv * 0.9;
  float aaA = 1. - smoothstep(0.7, 2.4, fwidth(phA)), aaB = 1. - smoothstep(0.7, 2.4, fwidth(phB));
  float patch2 = smoothstep(0.3, 0.7, vn2(p * 0.031 + 40.));
  float rp = (sin(phA) * (0.75 - 0.35 * patch2) * aaA + sin(phB) * (0.2 + 0.5 * patch2) * aaB) * nearK;
  float rp2 = sin(p.x * 0.21 + p.y * 0.47 + wv * 1.7) * (1. - smoothstep(60., 220., dist));
  float tone = 0.5 + 0.36 * rp + 0.14 * rp2;
  vec3 sand = mix(uDark * 0.8, uSand * 0.17 + uMid * 0.22, tone);
  sand *= 0.78 + 0.5 * max(rp, 0.) + 0.25 * vn2(p * 0.3);
  sand += uHor * 0.035 * smoothstep(0.55, 1., vn2(p * 0.6 + 9.)) * nearK;        // wet teal pools between the ripples
  vec2 g = rippleSlope(p, uTime);
  float crest = smoothstep(0.85, 1.25, dot(g, normalize(uSunD.xz))) / (1. + dist * 0.018);
  float alpha = mix(0.06, 0.5, look);
  vec3 col = sand + mix(uHor, uIce, 0.5) * crest * 0.55;
  alpha = clamp(alpha + crest * 0.1, 0., 0.85);
  // glitter: sparks of the small sun on the wind ripples, drifting slowly with the breeze, only near the camera
  vec2 gp = (p + vec2(0.35, 0.12) * uTime) * 0.9, gi = floor(gp), gf = fract(gp) - 0.5;
  float gh = h21(gi), gk = step(0.9, gh);
  vec2 go = (vec2(h21(gi + 7.7), h21(gi + 31.3)) - 0.5) * 0.6;
  float tw = sin(uTime * (1.5 + gh * 37.) + gh * 80.); tw = max(tw, 0.); tw *= tw * tw;
  float gr = clamp(0.06 + dist * 0.005, 0.06, 0.3);                                   // a spark stays a pixel or two wide
  float spark = gk * tw * smoothstep(gr, gr * 0.25, length(gf - go * (1. - gr * 2.))) * (1. - smoothstep(20., 90., dist)) * smoothstep(3., 9., dist);
  col += mix(uIce, vec3(0.75, 0.88, 1.), 0.5) * spark * 1.2;
  alpha = clamp(alpha + spark * 0.4, 0., 0.9);
  alpha *= 1. - smoothstep(0.55, 1., length(p) / uSandR);
  gl_FragColor = vec4(col, alpha);
  #include <fog_fragment>
}
`,pt=`
attribute vec2 aCorner;
attribute vec4 aInfo;    // size, seed, kind (0 tip, 1 mote, 2 apex), mirror sign
uniform float uTime, uArrive, uBeacon;
varying vec2 vUv; varying vec3 vI;
void main(){
  vec3 c = position; float size = aInfo.x, seed = aInfo.y, kind = aInfo.z, inten = 1., minPx = 0.0016;
  if (kind > 0.5 && kind < 1.5) {
    float life = fract(seed * 7.3 + uTime * (0.014 + 0.018 * fract(seed * 13.)));
    float a = seed * 40. + uTime * 0.12 + life * 4.;
    c.y = 0.3 + life * 36.;
    c.x += sin(a) * 2.2; c.z += cos(a * 1.3) * 2.2;
    inten = sin(life * 3.1416) * (0.45 + 0.55 * sin(uTime * 2.1 + seed * 90.));
    minPx = 0.0;
  } else if (kind < 0.5) {
    inten = 0.55 + 0.45 * sin(uTime * (0.7 + fract(seed * 5.) * 1.7) + seed * 60.);
    inten *= inten * (1. + 0.15 * uArrive) * (0.25 + 0.75 * fract(seed * 9.7));
  } else if (kind < 2.5) {
    inten = 1.1 + 0.45 * uArrive + 7. * uBeacon * (0.85 + 0.15 * sin(uTime * 2.3));
    size *= 1. + 0.15 * uArrive + 0.07 * sin(uTime * 1.7);
    minPx = 0.006 + 0.026 * uBeacon;
  } else {
    // the far spark where the portal will hang: only seen from a distance
    inten = 5. * uBeacon * (0.8 + 0.2 * sin(uTime * 1.9 + 1.));
    minPx = 0.02;
    size *= uBeacon;
  }
  if (aInfo.w < 0.) { c.y = -c.y; inten *= 0.6; }
  vec4 mv = modelViewMatrix * vec4(c, 1.);
  size = max(size, -mv.z * minPx);
  mv.xy += aCorner * size;
  gl_Position = projectionMatrix * mv;
  vUv = aCorner; vI = vec3(inten, seed, kind);
}
`,ft=`
precision highp float;
varying vec2 vUv; varying vec3 vI;
uniform vec3 uIce, uPink, uHor;
void main(){
  float r = length(vUv);
  float core = exp(-r * r * 14.) + 0.25 * exp(-r * 3.2) * smoothstep(1., 0.6, r);
  float flare = 0.;
  if (vI.z > 1.5) {
    vec2 a = abs(vUv);
    flare = (exp(-a.y * 46.) * exp(-a.x * 3.2) + exp(-a.x * 46.) * exp(-a.y * 4.5)) * smoothstep(1., 0.5, r);
    core = exp(-r * r * 30.) * 1.6 + 0.3 * exp(-r * 4.) * smoothstep(1., 0.5, r);
  }
  vec3 c = mix(uIce, mix(uPink, uHor, step(0.5, fract(vI.y * 5.7))), fract(vI.y * 3.1) * 0.55);
  if (vI.z > 1.5) c = mix(uIce, vec3(1.), 0.4);
  gl_FragColor = vec4(c * (core + flare) * vI.x * 2.6, 1.);
}
`;function Fe(){const t=[],l=[],a=[],x=[],_=new e.Vector3,w=new e.Vector3,C=new e.Vector3,f=new e.Vector3,k=new e.Vector3,N=new e.Vector3,h=new e.Vector3;function r(s,c,p,B,y,I,D,z,M,j){if(k.subVectors(c,s),N.subVectors(p,s),f.crossVectors(k,N),f.lengthSq()<1e-10)return;f.normalize(),h.copy(s).add(c).add(p).multiplyScalar(1/3).sub(j);let U=c,H=p,E=y,X=I;f.dot(h)<0&&(f.negate(),U=p,H=c,E=I,X=y),t.push(s.x,s.y,s.z,U.x,U.y,U.z,H.x,H.y,H.z);for(let u=0;u<3;u++)l.push(f.x,f.y,f.z),x.push(M.r,M.g,M.b);a.push(B,D,z,E,D,z,X,D,z)}function S(s,c){const p=c.sides,B=c.rng,y=s.length,I=[],D=[];for(let o=0;o<p;o++)I.push((o+B.range(-.28,.28))/p*Math.PI*2+c.spin),D.push(B.range(.8,1.16));const z=new e.Vector3,M=new e.Vector3,j=new e.Vector3,U=new e.Vector3,H=[];for(let o=0;o<y;o++){const v=s[o].p;let L=o,V=o;for(;L>0&&s[L].p.distanceToSquared(v)<1e-8;)L--;for(;V<y-1&&s[V].p.distanceToSquared(v)<1e-8;)V++;z.subVectors(s[V].p,s[L].p).normalize(),o===0?(M.set(1,0,0),Math.abs(z.x)>.9&&M.set(0,0,1),M.addScaledVector(z,-M.dot(z)).normalize()):(M.addScaledVector(z,-M.dot(z)),M.lengthSq()<1e-8&&M.set(0,0,1),M.normalize()),j.crossVectors(z,M).normalize(),U.copy(z);const A=[];for(let b=0;b<p;b++){const P=s[o].r*D[b];A.push(new e.Vector3().copy(v).addScaledVector(M,Math.cos(I[b])*P).addScaledVector(j,Math.sin(I[b])*P))}H.push(A)}for(let o=0;o<y-1;o++){const v=H[o],L=H[o+1],V=s[o].t,A=s[o+1].t;h.copy(s[o].p).add(s[o+1].p).multiplyScalar(.5);const b=h.clone();s[o].p.distanceToSquared(s[o+1].p)<1e-8&&b.addScaledVector(z.subVectors(s[Math.min(y-1,o+2)].p,s[o].p).normalize(),s[o].r>s[o+1].r?-5:5);for(let P=0;P<p;P++){const O=(P+1)%p;r(v[P],v[O],L[O],V,V,A,c.seed,c.glow,c.color,b),r(v[P],L[O],L[P],V,A,A,c.seed,c.glow,c.color,b)}}const E=s[y-1],X=H[y-1];z.subVectors(E.p,s[y-2].p),z.lengthSq()<1e-8&&z.subVectors(E.p,s[Math.max(0,y-3)].p),z.normalize();const u=new e.Vector3().copy(E.p).addScaledVector(z,c.tipLen);u.addScaledVector(M,B.range(-.3,.3)*E.r).addScaledVector(j,B.range(-.3,.3)*E.r);for(let o=0;o<p;o++)r(X[o],X[(o+1)%p],u,E.t,E.t,1,c.seed,c.glow,c.color,E.p);return u}function d(){const s=new e.BufferGeometry;return s.setAttribute("position",new e.Float32BufferAttribute(t,3)),s.setAttribute("normal",new e.Float32BufferAttribute(l,3)),s.setAttribute("aData",new e.Float32BufferAttribute(a,3)),s.setAttribute("color",new e.Float32BufferAttribute(x,3)),s}return{prism:S,build:d,count:()=>t.length/9}}function he(t,l,a,x,_,w=.55){const C=[],f=a>2.5?_.int(1,2):0,k=[0];for(let h=0;h<f;h++)k.push(_.range(.3,.85));k.push(1),k.sort((h,r)=>h-r);let N=x;for(let h=0;h<k.length;h++){const r=k[h],S=new e.Vector3().copy(t).addScaledVector(l,a*r),d=x*(1-w*r)*(N/x);C.push({p:S,r:d,t:r*.85}),h>0&&h<k.length-1&&(N*=_.range(.78,.9),C.push({p:S.clone(),r:x*(1-w*r)*(N/x),t:r*.85}))}return C}function ht(t,l,a){const x=Fe(),_=[],w=a.H,C=a.X0,f=new e.Vector3,k=(r,S=1)=>{const d=l.violet.clone().lerp(l.teal,ae(.25+.5*r+t.range(-.15,.15),0,1)*a.tealBias);return t.chance(.14)?d.lerp(l.pink,.45):t.chance(.1)&&d.lerp(l.sand,.35),d.multiplyScalar(S*t.range(.8,1.25)),d},N=[];for(const r of[-1,1]){const S=r===a.tallSide,d=new e.Vector3(-r*(S?1.1:.2),S?w+.8:w-1.6,r*a.cross),s=a.pow*(S?1:t.range(.9,1.08)),c=t.range(-1.2,1.2),p=(u,o)=>{const v=Math.pow(ae(u,0,1),s);return o.set(ne(r*C,d.x,v),d.y*u,ne(0,d.z,v)+c*Math.sin(Math.PI*ae(u,0,1))*(1-u)),o},B=t.int(7,9),y=[-.05];for(let u=1;u<B;u++)y.push(ae(u/B+t.range(-.035,.035),.02,.97));y.push(1);const I=a.r0*(S?1:.94),D=u=>I*Math.pow(1-ae(u,0,1),.72)+.3,z=[];let M=1;for(let u=0;u<y.length;u++){const o=y[u],v=p(o,new e.Vector3);o<0&&v.set(r*C,-1.5,0),z.push({p:v,r:D(o)*M,t:Math.max(o,0)*.9}),u>0&&u<y.length-1&&t.chance(.6)&&(M*=t.range(.9,.96),z.push({p:v.clone(),r:D(o)*M,t:Math.max(o,0)*.9}))}const j=t(),U=x.prism(z,{sides:a.sides,rng:t,spin:t.range(0,6.28),seed:j,glow:1,color:k(.7,1),tipLen:t.range(2.2,3.4)});_.push({p:U,size:2.6,kind:0}),N.push({s:r,centre:p,rad:D,top:d,seed:j});const H=t.int(4,5);for(let u=0;u<H;u++){const o=t.range(-1.9,1.9),v=r*Math.cos(o),L=Math.sin(o),V=t.range(.28,.86),A=I*t.range(.42,.68),b=[],P=6;let O=1;for(let Y=0;Y<=P;Y++){const K=Y/P,se=ne(-.04,V,K);p(Math.max(se,0),f),se<0&&(f.y=-1.5);const ve=(D(se)+A)*.72*(1-.35*K)+2.4*K*K*K,W=new e.Vector3(f.x+v*ve,f.y,f.z+L*ve),be=A*(1-.6*K)*O;b.push({p:W,r:be,t:K*.85}),Y>0&&Y<P&&t.chance(.4)&&(O*=t.range(.85,.94),b.push({p:W.clone(),r:A*(1-.6*K)*O,t:K*.85}))}const me=x.prism(b,{sides:t.int(5,6),rng:t,spin:t.range(0,6.28),seed:t(),glow:.75,color:k(t(),.95),tipLen:t.range(1.2,2.6)});_.push({p:me,size:1.5,kind:0})}const E=t.int(6,9);for(let u=0;u<E;u++){const o=t.range(.12,.8);p(o,f);const v=t.range(-2,2),L=new e.Vector3(r*Math.cos(v)*t.range(.5,1.1),t.range(.5,1.2),Math.sin(v)*t.range(.5,1.1)).normalize(),V=f.clone().addScaledVector(L,D(o)*.35),A=t.range(1.6,4.6)*(1-.4*o),b=x.prism(he(V,L,A,A*t.range(.085,.13),t),{sides:t.int(5,6),rng:t,spin:t.range(0,6.28),seed:t(),glow:.6,color:k(t(),1.05),tipLen:A*.22});t.chance(.3)&&_.push({p:b,size:.7,kind:0})}const X=t.int(11,15);for(let u=0;u<X;u++){const o=t.range(-2.3,2.3),v=t.range(1.6,5.2),L=new e.Vector3(r*C+r*Math.cos(o)*v,-.8,Math.sin(o)*v*1.15),V=t.range(.15,.95)*(v/5.2+.35),A=new e.Vector3(r*Math.cos(o)*V,1,Math.sin(o)*V).normalize(),b=t.range(3.2,12.5)*(1.15-V*.6),P=x.prism(he(L,A,b,b*t.range(.07,.105)+.12,t),{sides:t.int(5,7),rng:t,spin:t.range(0,6.28),seed:t(),glow:.6,color:k(t(),1),tipLen:b*t.range(.14,.24)});t.chance(.55)&&_.push({p:P,size:.5+b*.08,kind:0})}}const h=a.shards;for(let r=0;r<h;r++){const S=t.sign(),d=Math.pow(t(),1.7),s=S*(C-2.2+d*20+t.range(0,2.5)),c=t.gauss()*(2.2+d*9);if(Math.abs(s)<8.6)continue;const p=t.chance(.12),B=p?t.range(2.5,6.5):t.range(.35,1.9),y=new e.Vector3(t.gauss()*.3,1,t.gauss()*.3).normalize(),I=new e.Vector3(s,-.3,c),D=x.prism(he(I,y,B+.3,B*t.range(.09,.16)+.05,t),{sides:t.int(4,6),rng:t,spin:t.range(0,6.28),seed:t(),glow:p?.6:.4,color:k(t(),1),tipLen:B*.3});(p?t.chance(.7):t.chance(.05))&&_.push({p:D,size:p?t.range(.6,1.1):.4,kind:0})}return{geometry:x.build(),tips:_,legs:N,triangles:x.count()}}function je(t,l,a,x){const _=l.length,w=[],C=[],f=[],k=[],N=[[-1,-1],[1,-1],[1,1],[-1,1]];let h=0;for(let S=0;S<_;S++){const d=l[S],s=t();for(const c of[1,-1]){for(const p of N)w.push(d.p.x,d.p.y,d.p.z),C.push(p[0],p[1]),f.push(d.size,s,d.kind,c);k.push(h,h+1,h+2,h,h+2,h+3),h+=4}}const r=new e.BufferGeometry;return r.setAttribute("position",new e.Float32BufferAttribute(w,3)),r.setAttribute("aCorner",new e.Float32BufferAttribute(C,2)),r.setAttribute("aInfo",new e.Float32BufferAttribute(f,4)),r.setIndex(k),r.boundingSphere=new e.Sphere(new e.Vector3(0,0,0),60),r}async function gt(t,l={}){const a=t.rng.fork?t.rng.fork("ringed-shore-hero"):t.rng,x=(l.palette&&l.palette.length>=7?l.palette:nt).map(i=>new e.Color(i)),_=a.range(-.03,.03);for(const i of x)i.offsetHSL(_,0,0);const w={zen:x[0],violet:x[1],teal:x[2],pink:x[3],sand:x[4],dark:x[5],ice:x[6]},C=l.sky??"full",f=l.portalY??8.5,k=l.sandRadius??2600,N=(l.planetElev??30)*R,h=(l.planetSize??38)*.5*R,r=(l.ringTilt??17)*R,S=(l.planetElev1??l.planetElev??30)*R,d=(l.planetElev0??l.planetElev??30)*R,s=(l.planetSize0??l.planetSize??38)*.5*R,c=new e.Vector3(0,Math.sin(d),-Math.cos(d)),p=new e.Vector3(1,0,0),B=new e.Vector3(0,Math.cos(d),Math.sin(d)),y=a.sign()*a.range(9,17)*R,I=new e.Vector3(-Math.sin(y)*Math.cos(r),Math.cos(y)*Math.cos(r),Math.sin(r)).normalize(),D=new e.Vector3(0,0,1).addScaledVector(I,-I.z).normalize(),z=new e.Vector3().crossVectors(I,D).normalize(),M=a.range(39,47)*R,j=12*R,U=new e.Vector3(Math.sin(M)*Math.cos(j),Math.sin(j),-Math.cos(M)*Math.cos(j)),H=new e.Vector3(.78,a.range(.15,.4),a.range(.3,.5)).normalize(),E=new e.Vector3(a.range(-.4,-.05),-.86,-.22).normalize(),X=new e.Vector3(0,.12,-1).normalize(),u=(i,n)=>new e.Vector3(Math.sin(i)*Math.cos(n),Math.sin(n),-Math.cos(i)*Math.cos(n)),o=1.4*R,v=l.look&&l.look.ring?l.look.ring[0]+Math.max(l.look.ring[1]-l.look.ring[0],.1):2.08,L=Math.max(h,s),V=Math.tan(L),A=Math.min(d,N,S),b=Math.max(d,N,S),P=Math.cos(y),O=Math.sin(y),me=Math.sin(r),Y=new e.Vector3,K=new e.Vector3,se=new e.Vector3,ve=i=>{let n=9;for(let g=0;g<=4;g++){const G=ne(A,b,g/4);Y.set(0,Math.sin(G),-Math.cos(G)),K.set(0,Math.cos(G),Math.sin(G)),n=Math.min(n,i.angleTo(Y)-L);for(let $=0;$<240;$++){const de=$/240*Math.PI*2,ee=Math.cos(de)*v*V,te=Math.sin(de)*v*me*V;n=Math.min(n,i.angleTo(se.copy(Y).addScaledVector(p,ee*P-te*O).addScaledVector(K,ee*O+te*P).normalize()))}}return n},W=(20+(a.range(62,78)-62)*(25/16))*R,be=(2+(a.range(16,28)-16)*(4/12))*R,Ue=-P*Math.cos(W)-O*Math.sin(W),Oe=-O*Math.cos(W)+P*Math.sin(W),re=new e.Vector3;for(let i=Math.atan(Math.max(1,v/Math.hypot(Math.cos(W),Math.sin(W)/me))*V);i<80*R&&(re.copy(c).addScaledVector(p,Ue*Math.tan(i)).addScaledVector(B,Oe*Math.tan(i)).normalize(),!(ve(re)>=o+be));i+=.2*R);const ke=u(a.range(-25,25)*R,a.range(74,81)*R),Ke=[new e.Vector4(re.x,re.y,re.z,Math.cos(o)),new e.Vector4(ke.x,ke.y,ke.z,Math.cos(.8*R))],J={H:a.range(29.5,31),X0:a.range(11.3,11.9),pow:a.range(2.1,2.9),r0:a.range(2.6,3),sides:a.int(5,7),tallSide:a.sign(),cross:a.range(.5,.9),tealBias:a.range(.75,1.3),shards:a.int(280,420)},Te=new e.Vector3(0,J.H-1.2,0),Se=[new e.Vector3(-J.X0,0,0),new e.Vector3(J.X0,0,0)],ce=[];for(let i=0;i<8;i++)ce.push(new e.Vector4(0,0,0,0));ce[0].set(Se[0].x,0,.6,a.range(0,6.28)),ce[1].set(Se[1].x,0,.6,a.range(0,6.28));const T={uZen:{value:w.zen},uMid:{value:w.violet},uHor:{value:w.teal},uPink:{value:w.pink},uSand:{value:w.sand},uDark:{value:w.dark},uIce:{value:w.ice},uPC:{value:c},uPR:{value:p},uPU:{value:B},uPTan:{value:Math.tan(s)},uAxis:{value:I},uE1:{value:z},uE2:{value:D},uL1:{value:H},uL2:{value:E},uSunD:{value:U},uGlowAz:{value:new e.Vector2(0,-1)},uGlowDir:{value:X},uMoon:{value:Ke},uTime:{value:0},uBandSeed:{value:a.range(0,40)},uFull:{value:C==="full"?1:0},uStorm:{value:new e.Vector4(a.range(-.9,.9),a.range(-.45,.45),a.range(.16,.28),a.range(.5,1))},uCamL:{value:new e.Vector3(0,10,100)},uRip:{value:ce},uRipGain:{value:1},uRipN:{value:2},uArrive:{value:0},uBeacon:{value:1},uPulse:{value:-1},uSandR:{value:k},uBandA:{value:w.sand.clone().multiplyScalar(.95)},uBandB:{value:w.pink.clone().multiplyScalar(.8).add(w.sand.clone().multiplyScalar(.15))},uRing:{value:new e.Vector2(1.24,.84)},uMoonSh:{value:new e.Vector4(0,0,0,0)}},F=l.look||{};F.bandA&&T.uBandA.value.copy(F.bandA),F.bandB&&T.uBandB.value.copy(F.bandB),F.ring&&T.uRing.value.set(F.ring[0],Math.max(F.ring[1]-F.ring[0],.1)),F.moon&&T.uMoonSh.value.set(F.moon[0],F.moon[1],F.moon[2],F.moon[3]);const Be=()=>e.UniformsUtils.clone(e.UniformsLib.fog),Z=new e.Group;Z.name="ringed-shore-hero";let Q=null;if(C!=="none"){const i=C==="full";Q=new e.Mesh(new e.SphereGeometry(1,64,48),new e.ShaderMaterial({uniforms:T,vertexShader:st,fragmentShader:rt,side:e.BackSide,depthWrite:!1,depthTest:!0,transparent:!i,fog:!1})),Q.renderOrder=i?-.9:-10,Q.frustumCulled=!1,Q.scale.setScalar(3e3),Z.add(Q)}await t.yield?.();const le=ht(a,w,J);le.geometry.boundingSphere=new e.Sphere(new e.Vector3(0,14,0),46),await t.yield?.();const De=i=>new e.ShaderMaterial({uniforms:Object.assign(Be(),T,{uMirror:{value:i}}),vertexShader:ct,fragmentShader:lt,side:e.DoubleSide,fog:!0}),Re=new e.Mesh(le.geometry,De(0)),Ve=new e.Mesh(le.geometry,De(1));Ve.scale.y=-1,Z.add(Re,Ve),await t.yield?.();let Pe=null;if(l.wetSand!==!1){const i=new e.CircleGeometry(k,96);i.rotateX(-Math.PI/2),Pe=new e.Mesh(i,new e.ShaderMaterial({uniforms:Object.assign(Be(),T),vertexShader:ut,fragmentShader:dt,transparent:!0,depthWrite:!1,fog:!0})),Pe.renderOrder=1,Z.add(Pe)}const ue=le.tips.slice();ue.push({p:Te.clone(),size:4.2,kind:2}),ue.push({p:new e.Vector3(0,f,0),size:3.4,kind:3});const Xe=a.int(90,130);for(let i=0;i<Xe;i++){const n=a.sign(),g=a();ue.push({p:new e.Vector3(n*J.X0*(1-g*g*.8)+a.gauss()*2.5,0,a.gauss()*3.5),size:a.range(.1,.24),kind:1})}const ge=new e.Mesh(je(a,ue),new e.ShaderMaterial({uniforms:T,vertexShader:pt,fragmentShader:ft,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,fog:!1}));ge.renderOrder=3,ge.frustumCulled=!1,Z.add(ge),await t.yield?.();const q=(i,n,g)=>new e.Vector3(i,n,g),Le={portalSeat:{position:q(0,f,0),facing:q(0,0,1),radius:7},flyThrough:[q(0,20,280),q(0,15.5,170),q(0,11.5,80),q(0,f+.6,25),q(0,f,0),q(0,f,-40)],approachDir:q(0,0,-1),apex:Te.clone(),feet:Se.map(i=>i.clone()),planetDir:c.clone(),planetMirrorDir:q(c.x,-c.y,c.z),sunDir:U.clone(),glowDir:X.clone(),keyLight:{dir:U.clone(),color:"#cfe4ff",intensity:2.2},fillLight:{dir:X.clone(),color:"#ff7ab8",intensity:.7},viewpoints:{figure:{position:q(0,4,300),target:q(0,4,0)},threeQuarter:{position:q(38,9,62),target:q(0,13,0)},under:{position:q(0,f,30),target:q(0,22,-10)}}};async function Ye(i,n,g){const G=Fe(),$=[],de=(m=1)=>{const oe=w.violet.clone().lerp(w.teal,ae(n.range(.1,.9),0,1)*J.tealBias);return n.chance(.14)?oe.lerp(w.pink,.45):n.chance(.1)&&oe.lerp(w.sand,.35),oe.multiplyScalar(m*n.range(.8,1.25))};let ee=1e9,te=-1e9,xe=1e9,we=-1e9,pe=1,$e=0;for(const m of i){g&&++$e%10===0&&await g(),ee=Math.min(ee,m.x),te=Math.max(te,m.x),xe=Math.min(xe,m.z),we=Math.max(we,m.z),pe=Math.max(pe,m.h);const oe=new e.Vector3(m.lean?m.lean[0]:0,1,m.lean?m.lean[1]:0).normalize(),Qe=new e.Vector3(m.x,-.8,m.z),qe=m.r??m.h*.048+.28,Je=G.prism(he(Qe,oe,m.h+.8,qe,n,.62),{sides:m.sides??n.int(5,7),rng:n,spin:n.range(0,6.28),seed:n(),glow:m.glow??.8,color:de(m.dark??1),tipLen:m.h*n.range(.1,.18)});(m.tip??m.h>7)&&$.push({p:Je,size:.45+m.h*.04,kind:0});const et=m.shards??n.int(2,5);for(let Ge=0;Ge<et;Ge++){const ze=n.range(0,6.283),_e=qe*n.range(.9,2.4),Ne=n.range(.12,.6),tt=new e.Vector3(Math.cos(ze)*Ne+oe.x,1,Math.sin(ze)*Ne+oe.z).normalize(),fe=m.h*n.range(.14,.55),ot=new e.Vector3(m.x+Math.cos(ze)*_e,-.6,m.z+Math.sin(ze)*_e),at=G.prism(he(ot,tt,fe+.6,fe*n.range(.06,.1)+.12,n),{sides:n.int(4,6),rng:n,spin:n.range(0,6.28),seed:n(),glow:.55,color:de(m.dark??1),tipLen:fe*n.range(.14,.24)});fe>7&&n.chance(.4)&&$.push({p:at,size:.4+fe*.04,kind:0})}}g&&await g();const ye=G.build();i.length?ye.boundingSphere=new e.Sphere(new e.Vector3((ee+te)/2,pe*.5,(xe+we)/2),Math.hypot((te-ee)/2,(we-xe)/2,pe*.5)+pe*.7+8):ye.computeBoundingSphere(),g&&await g();const Ze=new e.Mesh(ye,Re.material),Ce=new e.Mesh(ye,Ve.material);Ce.scale.y=-1;const Ie=new e.Group;return Ie.add(Ze,Ce),{object:Ie,tips:$,triangles:G.count()*2}}function We(i,n){const g=new e.Mesh(je(n,i),ge.material);return g.renderOrder=3,g.frustumCulled=!1,g}const Ae=T.uCamL.value;let ie=0;return{buildCrystals:Ye,buildTipGlints:We,colors:w,object:Z,radius:30,height:J.H+1,center:new e.Vector3(0,13,0),anchors:Le,ground:!1,groundY:0,uniforms:T,triangles:le.triangles*2+3072*2+96+ue.length*4,setProgress(i){ie=ae(i,0,1);const n=Me(.6,.97,ie);T.uArrive.value=n,T.uBeacon.value=1-Me(.12,.5,ie),T.uPulse.value=ie*14%1*1.2-.1,T.uRipGain.value=1+.5*n;const g=Me(0,.66,ie),G=ne(ne(d,N,g),S,Me(.7,.96,ie));c.set(0,Math.sin(G),-Math.cos(G)),B.set(0,Math.cos(G),Math.sin(G)),T.uPTan.value=Math.tan(ne(s,h,g)),Le.planetDir.copy(c),Le.planetMirrorDir.set(c.x,-c.y,c.z)},setRipple(i,n,g,G=1,$=0){i>=2&&i<8&&(ce[i].set(n,g,G,$),T.uRipN.value=Math.max(T.uRipN.value,i+1))},update(i,n,g){T.uTime.value=n,Z.updateWorldMatrix(!0,!1),Ae.setFromMatrixPosition(g.matrixWorld),Z.worldToLocal(Ae),Q&&(Q.position.copy(Ae),Q.scale.setScalar(Math.min((g.far||4e3)*.78,3200)))},dispose(){}}}export{gt as buildHero};
