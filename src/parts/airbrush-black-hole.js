import*as e from"three";import{clamp as q,lerp as O,smoothstep as We}from"../kit/core.js";const Fe=96,ea=300,aa=1500,be=2.598*Fe,V=null,Be=null,E=7,ce=4,P=14,we=9,ke=`
uniform vec3 uInk[7];
uniform float uTime;
float abHash(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float abHash3(vec3 p){ p = fract(p * .1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float abNoise(vec3 p){
  vec3 i = floor(p), f = p - i; f = f * f * (3. - 2. * f);
  float a = mix(mix(abHash3(i), abHash3(i + vec3(1,0,0)), f.x), mix(abHash3(i + vec3(0,1,0)), abHash3(i + vec3(1,1,0)), f.x), f.y);
  float b = mix(mix(abHash3(i + vec3(0,0,1)), abHash3(i + vec3(1,0,1)), f.x), mix(abHash3(i + vec3(0,1,1)), abHash3(i + vec3(1,1,1)), f.x), f.y);
  return mix(a, b, f.z);
}
float abDots(vec2 key, float cell, float c, float salt){
  vec2 g = vec2(.8776 * key.x - .4794 * key.y, .4794 * key.x + .8776 * key.y) / cell;   // the grid is turned and its rows slip, so dots never line up
  float row = floor(g.y);
  g.x += abHash(vec2(row, salt + 5.3)) * 7.;
  vec2 id = vec2(floor(g.x), row); vec2 f = g - id - .5;
  vec2 sid = id + salt * 17.13;
  float h = abHash(sid);
  float rad = .25 + .2 * abHash(sid + 9.7) + .05 * c;
  vec2 j = (vec2(abHash(sid + 71.7), abHash(sid + 113.1)) - .5) * (1. - 2. * rad);
  float d = length(f - j);
  return step(h, c * 1.04) * (1. - smoothstep(rad * .6, rad, d));
}
float abSpeck(float c, vec2 key, float fp, float salt){     // dots alone: for mist and thin spray
  c = clamp(c, 0., 1.);
  float l = log2(max(fp, 1e-5) * 2.3);
  float l0 = floor(l), f = l - l0;
  float c0 = exp2(l0);
  return mix(abDots(key, c0, c, salt), abDots(key + 37.7, c0 * 2., c, salt + 3.), smoothstep(.2, .8, f));
}
float abSpray(float c, vec2 key, float fp, float salt){
  c = clamp(c, 0., 1.);
  float d = abSpeck(c, key, fp, salt);
  float w = smoothstep(.0, .12, c) * (1. - .8 * smoothstep(.62, 1., c));
  return clamp(mix(c, d * 1.7, .45 * w), 0., 1.);
}
vec3 abRamp(float t){
  t = clamp(t, 0., 1.) * 4.;
  vec3 c = mix(uInk[0], uInk[1], clamp(t, 0., 1.));
  c = mix(c, uInk[2], clamp(t - 1., 0., 1.));
  c = mix(c, uInk[3], clamp(t - 2., 0., 1.));
  return mix(c, uInk[4], clamp(t - 3., 0., 1.));
}
vec3 abRampS(float t, vec2 key, float fp, float salt){
  t = clamp(t, 0., .9999) * 4.; float k = floor(t);
  float g = abSpray(t - k, key, fp, salt + k * 7.);
  vec3 lo = k < .5 ? uInk[0] : (k < 1.5 ? uInk[1] : (k < 2.5 ? uInk[2] : uInk[3]));
  vec3 hi = k < .5 ? uInk[1] : (k < 1.5 ? uInk[2] : (k < 2.5 ? uInk[3] : uInk[4]));
  return mix(lo, hi, g);
}
float abFrisket(float d, float w){ return smoothstep(-.5 * w, .5 * w, d); }
float abHalo(float d, float size){ return .25 * exp(-max(d, 0.) / max(size * .03, 1e-4)) * step(0., d); }
vec3 abChrome(vec3 refl, vec2 key, float fp){
  float e = refl.y / max(length(refl), 1e-4);
  float g = abSpray(.5, key, fp, 0.) - .5;
  e += g * .035;
  vec3 umber = mix(uInk[0], uInk[3], .16);
  vec3 c = mix(umber * .6, umber, smoothstep(-.9, -.25, e));
  c = mix(c, uInk[3], step(-.2, e));
  c = mix(c, mix(uInk[3], uInk[4], .6), step(-.07, e));
  c = mix(c, vec3(1.), step(-.018, e));
  c = mix(c, mix(uInk[6], vec3(1.), .25), step(.02, e));
  c = mix(c, mix(uInk[6], uInk[1], .55), step(.2, e));
  c = mix(c, uInk[1], step(.4, e));
  c = mix(c, mix(uInk[1], uInk[0], .75), step(.66, e));
  return c;
}
`,ze=`
uniform vec4 uGap[${ce}];      // x radius, y half width (0 = unused)
uniform vec4 uCone[${E}];    // x cos, y sin of its angle, z radius, w strength (0 = off)
uniform vec4 uClump[${P}];  // x cos, y sin of its angle, z radius, w size (0 = off)
uniform vec4 uDiscA;                 // x warp height, y warp angle, z lane seed, w splash strength
uniform vec4 uDiscB;                 // x splash x, y splash z, z plate clump near fade (1 = fade them near the eye), w splash angle
float abWarp(vec2 p){
  float r = length(p); float m = smoothstep(850., 1500., r);
  float d = max(dot(p, vec2(cos(uDiscA.y), sin(uDiscA.y))) / max(r, 1.), 0.);
  return uDiscA.x * m * m * d * d;
}
float abRim(float r, float n){ return r < 1500. ? mix(1., .34, smoothstep(1290., 1500., r + (n - .5) * 150.)) : .26 * (1. - smoothstep(1500., 1720., r)); }
float abGaps(float r, float fpR, out float leak){
  float m = 1.; leak = 0.;
  for (int i = 0; i < ${ce}; i++){
    vec4 g = uGap[i];
    if (g.y > 0.){ float d = abs(r - g.x) - g.y; m = min(m, abFrisket(d, fpR)); leak = max(leak, .3 * exp(-max(-d, 0.) / (g.y * .45)) * step(d, 0.)); }
  }
  return m;
}
float abDiscMask(vec2 p, float fpR){
  float r = length(p); float leak;
  float a = abFrisket(r - 300., fpR) * abRim(r, .5);
  return a * max(abGaps(r, fpR, leak), leak);
}
float abWet(vec2 p, float r){
  float wet = 0.;
  for (int i = 0; i < ${E}; i++){
    vec4 c = uCone[i];
    vec2 l = vec2(c.x * p.x + c.y * p.y, -c.y * p.x + c.x * p.y);
    float ts = atan(l.y, abs(l.x) + 1e-3) * 6.3662;   // seconds since the cone passed (it travels toward -angle)
    ts = l.x > 0. ? ts : 99.;
    float tr = ts > 0. ? exp(-ts / 1.7) : smoothstep(-110., 0., ts * c.z * .15708);
    float dr = (r - c.z) / 105.;
    wet += c.w * tr * exp(-dr * dr);
  }
  return min(wet, 1.);
}
vec2 abClumps(vec2 p, float r, float fp){
  float cov = 0., head = 0.;
  for (int i = 0; i < ${P}; i++){
    vec4 c = uClump[i];
    if (c.w > 0.){
      vec2 l = vec2(c.x * p.x + c.y * p.y, -c.y * p.x + c.x * p.y);
      if (l.x > 0.){
        float arc = atan(l.y, l.x + 1e-3) * c.z;      // + = ahead of the knot
        float dr = r - c.z;
        float tl = max(-arc, 0.), L = c.w * 6.9;
        float k = clamp(1. - tl / L, 0., 1.);
        float wdt = c.w * (.2 + .34 * k);
        float body = k * k * (1. - smoothstep(.25, 1., abs(dr) / wdt)) * step(arc, 0.);
        float hd = length(vec2(dr, arc * .8)) - c.w * .5;
        float hm = 1. - abFrisket(hd, fp);
        float hal = abHalo(hd, c.w * 6.);
        cov = max(cov, max(body, max(hm, hal)));
        head = max(head, hm);
      }
    }
  }
  return vec2(cov, head);
}
vec4 abDisc(vec2 p, vec3 rd, float dist, float pxA){
  float r = length(p);
  vec2 er = p / max(r, 1.);
  // footprint of a pixel on the plane: long axis along the ray's ground track
  float sinI = max(abs(rd.y), .012);
  float fMin = dist * pxA, fMaj = fMin / sinI;
  vec2 gt = rd.xz / max(length(rd.xz), 1e-4);
  float cb = dot(gt, er);
  float fpR = sqrt(fMaj * fMaj * cb * cb + fMin * fMin * (1. - cb * cb));
  float fpG = fMin * sqrt(min(fMaj / fMin, 9.));
  // lanes: 40 rigid rings, each turning at its own Keplerian rate
  float fl = (r - 300.) / 30.;
  float li = clamp(floor(fl), -1., 46.);
  float rl = 315. + li * 30.;
  float om = 240. * sqrt(300. / rl) / rl;
  float a = om * uTime + li * 2.399;
  float ca = cos(a), sa = sin(a);
  vec2 q = vec2(ca * p.x + sa * p.y, -sa * p.x + ca * p.y);
  vec2 e = q / max(r, 1.) * rl;
  float seed = uDiscA.z;
  float laneV = abHash(vec2(li, seed));
  float n1 = abNoise(vec3(e / 330., li * 7.3 + seed));
  float f2 = 1. - smoothstep(2.5, 11., fpR), f3 = 1. - smoothstep(.5, 2.6, fpR);
  float n2 = abNoise(vec3(e / 170., r / 5.5 + seed));
  float n3 = f3 > 0. ? abNoise(vec3(e / 46., r / 1.25)) : .5;
  float laneFade = 1. - smoothstep(9., 34., fpR);
  // heat along the radius, pushed warmer on the flank that comes toward the eye
  float u = clamp((r - 300.) / 1200., 0., 1.);
  float T = mix(1.03, .33, pow(u, .7));
  float nb = abNoise(vec3(r / 170., seed, 2.)), nb2 = abNoise(vec3(r / 62., seed, 9.));
  T += (nb - .5) * .32 + (nb2 - .5) * .2;
  vec2 tng = vec2(-er.y, er.x);
  float flank = clamp(-(tng.x * rd.x + tng.y * rd.z), -1., 1.);
  T += .12 * flank;
  T += ((laneV - .5) * .2 + (n1 - .5) * .26) * mix(.3, 1., laneFade) + (n2 - .5) * .24 * f2 + (n3 - .5) * .16 * f3;
  // a darker seam where each lane shears against the next
  float lf = fl - floor(fl);
  T -= .1 * laneFade * (1. - smoothstep(0., .1 + fpR / 30., min(lf, 1. - lf))) * step(.35, abHash(vec2(li, seed + 4.)));
  // spray cones: wet trails brighten the lanes and coarsen the speckle
  float wet = abWet(p, r);
  T = r > 1500. ? .46 + (n1 - .5) * .2 : T;      // the blush off the rim is one ink step warmer than the last lanes
  T += .3 * wet;
  // splash on the rim
  vec2 sp = p - uDiscB.xy; float sd = dot(sp, sp);
  float spl = uDiscA.w * exp(-sd / 62000.);
  T += .75 * spl;
  // clumps
  vec2 ck = r < 640. ? abClumps(p, r, fpR) : vec2(0.);
  ck *= mix(1., smoothstep(380., 720., dist), uDiscB.z);
  T = max(T, mix(.5, 1.1, ck.x) * step(.02, ck.x));
  // opacity: razor inner edge, frisket gaps with a little under-spray, a rim that thins into separate specks
  float leak;
  float gm = abGaps(r, fpR, leak);
  float rim = abRim(r, n1) + spl * step(r, 1700.);
  float salt = step(.3, wet) * floor(uTime * 3.);
  float grainFp = fpG * (1. + 1.6 * wet);
  float alpha = abFrisket(r - 300., fpR) * (rim > .98 ? 1. : abSpray(rim, q, grainFp, salt));
  float lk = leak * abSpray(.5, q, grainFp, 0.);
  alpha *= max(gm, lk);
  alpha = max(alpha, ck.x * abFrisket(r - 300., fpR));
  // GRAIN: the heat itself is sprayed, so every gradient is specks
  float Tg = mix(T * .95, max(T, 1.), ck.y);
  vec3 col = abRampS(Tg, q, grainFp, salt + 5.);
  // teal threads carried round from the splash in the outer lanes
  float tn = abNoise(vec3(e / 420., r / 10. + seed * 3.));
  float tw = max(.035, fpR / 14.);
  float dth = atan(uDiscB.x * p.y - uDiscB.y * p.x, dot(uDiscB.xy, p) + 1e-3);
  dth = dth < 0. ? dth + 6.2832 : dth;
  float thr = (1. - smoothstep(0., tw, abs(tn - .5))) * (.035 / tw) * smoothstep(820., 1180., r) * (.3 + .7 * exp(-dth / 2.2));
  col = mix(col, uInk[5], clamp(thr * 1.1 + spl * .35 * step(Tg, .9), 0., .92));
  col = mix(col, mix(uInk[4], vec3(1.), .45), clamp(spl * 1.3 - .45, 0., .6));
  // flanks: 3:1 in value
  col *= mix(.4, 1.2, smoothstep(-1., 1., flank));
  return vec4(min(col, vec3(1.)), clamp(alpha, 0., 1.));
}
`,$e=`
uniform vec4 uGlint[${we}];   // xyz direction, w size
uniform vec3 uHazeCol;
uniform vec4 uSky;                // x haze amount, y star density, z spatter seed, w glint turn
vec2 abCube(vec3 d, out float face){
  vec3 a = abs(d);
  if (a.x >= a.y && a.x >= a.z){ face = d.x > 0. ? 0. : 1.; return d.yz / max(a.x, 1e-4); }
  if (a.y >= a.z){ face = d.y > 0. ? 2. : 3.; return d.xz / max(a.y, 1e-4); }
  face = d.z > 0. ? 4. : 5.; return d.xy / max(a.z, 1e-4);
}
vec3 abSky(vec3 d, float pa, float starFade){
  float face; vec2 uv = abCube(d, face);
  vec2 key = uv * 420. + face * 131.;
  // ink ground, ultramarine haze lying along the disc plane
  float hz = exp(-d.y * d.y / .045) * uSky.x;
  float band = abNoise(d * 2.3 + uSky.z) - .5;
  float cov = clamp(hz * (.5 + .5 * band), 0., 1.);
  vec3 col = mix(uInk[0], uHazeCol, mix(cov, abSpray(cov, key, pa * 420., 0.), .6) * .62);
  // toothbrush spatter: one dot per cell, thrown denser along three flicked arcs
  float N = 34.;
  vec2 g = uv * N * .5; vec2 id = floor(g); vec2 f = g - id;
  vec2 sid = id + face * 57. + uSky.z;
  float h = abHash(sid);
  float arcs = 0.;
  float a1 = (dot(d, vec3(.36, .8, .48)) - .1) / .07;
  float a2 = (dot(d, vec3(-.6, .64, -.48)) + .22) / .06;
  float a3 = (dot(d, vec3(.1, -.7, .7)) - .3) / .08;
  arcs += exp(-a1 * a1);
  arcs += exp(-a2 * a2);
  arcs += exp(-a3 * a3);
  float prob = uSky.y * (.5 + .5 * min(arcs, 1.));
  if (h < prob){
    float cls = abHash(sid + 3.1);
    float sr = cls < .62 ? .02 : (cls < .92 ? .034 : .055);            // radius in cells (a cell is ~3.4 degrees)
    vec2 c = .18 + .64 * vec2(abHash(sid + 11.3), abHash(sid + 23.9));
    float pr = pa * N * .5;                                             // one pixel in cells
    float rr = max(sr, pr * .8);
    float m = (1. - smoothstep(rr * .55, rr, length(f - c))) * min(1., (sr * sr) / (rr * rr) * 1.6);
    float tint = abHash(sid + 41.7);
    vec3 sc = tint < .1 ? uInk[5] : (tint < .2 ? uInk[2] : uInk[4]);
    col = mix(col, sc * (.55 + .45 * cls), m * starFade);
  }
  // nine ruled four-point glints: straight tapering rays
  for (int i = 0; i < ${we}; i++){
    vec4 gl = uGlint[i];
    vec3 dd = d - gl.xyz;
    float L = gl.w;
    if (dot(dd, dd) < L * L){
      vec3 t1 = normalize(cross(gl.xyz, vec3(0., 1., 0.)));
      vec3 t2 = cross(gl.xyz, t1);
      float cr = cos(uSky.w + float(i)), sr2 = sin(uSky.w + float(i));
      float x = dot(dd, t1), y = dot(dd, t2);
      vec2 xy = vec2(cr * x + sr2 * y, -sr2 * x + cr * y);
      vec2 ax = abs(xy);
      float w = L * .045;
      float r1 = (1. - smoothstep(0., w * max(1. - ax.x / L, 0.) + pa * .7, ax.y)) * max(1. - ax.x / L, 0.);
      float r2 = (1. - smoothstep(0., w * max(1. - ax.y / (L * .7), 0.) + pa * .7, ax.x)) * max(1. - ax.y / (L * .7), 0.);
      float core = 1. - smoothstep(w * .6, w * 1.6 + pa, length(xy));
      float halo = .25 * exp(-length(xy) / (L * .12));
      col = mix(col, mix(uInk[4], vec3(1.), .5), clamp(max(max(r1, r2), core) + halo, 0., 1.) * starFade);
    }
  }
  return col;
}
`,je=`
uniform mat4 uWorldInv;
varying vec3 vDir;
varying vec3 vCam;
void main(){
  vDir = position;
  vCam = (uWorldInv * vec4(cameraPosition, 1.)).xyz;
  vec4 p = projectionMatrix * vec4(mat3(viewMatrix) * (mat3(modelMatrix) * position), 1.);
  if (abs(p.w) < 1e-4) p.w = 1e-4;
  gl_Position = p.xyww;
}
`,qe=`
precision highp float;
#define STEPS 32
#define RS ${Fe.toFixed(1)}
#define BCRIT ${be.toFixed(2)}
uniform int uSteps;
uniform float uEinstein;
varying vec3 vDir;
varying vec3 vCam;
${ke}
${ze}
${$e}
void main(){
  vec3 ro = vCam;
  vec3 rd = normalize(vDir);
  // everything that needs derivatives is taken here, before the march
  float pxA = max(length(fwidth(rd)) * .7, 1e-5);
  vec3 hv = cross(ro, rd);
  float h2 = dot(hv, hv);
  float b = sqrt(h2);
  float bw = max(fwidth(b), 1e-3);
  float inward = step(dot(ro, rd), 0.);

  vec3 x = ro, v = rd;
  vec3 col = vec3(0.); float A = 0.;
  float r = max(length(x), 1.);
  float r2 = r * r;
  vec3 acc = -1.5 * RS * h2 * x / (r2 * r2 * r);
  float sPrev = x.y - abWarp(x.xz);
  float path = 0., captured = 0.;
  for (int i = 0; i < STEPS; i++){
    if (i >= uSteps) break;
    float dt = r * mix(.06, .18, smoothstep(RS * 1.5, RS * 4.2, r)) * (1. + .7 * smoothstep(1700., 3400., r));
    vec3 x0 = x;
    v += acc * (.5 * dt);
    x += v * dt;
    r = max(length(x), 1.); r2 = r * r;
    acc = -1.5 * RS * h2 * x / (r2 * r2 * r);
    v += acc * (.5 * dt);
    float s = x.y - abWarp(x.xz);
    if (s * sPrev < 0.){
      float k = sPrev / (sPrev - s);
      vec3 p = mix(x0, x, k);
      float rr = length(p.xz);
      if (rr > 290. && rr < 1730. && A < .995){
        vec4 d = abDisc(p.xz, v / max(length(v), 1e-4), path + k * dt, pxA);
        col += (1. - A) * d.a * d.rgb; A += (1. - A) * d.a;
      }
    }
    sPrev = s; path += dt;
    if (r < RS * 1.03){ captured = 1.; break; }
    if (r > 1760. && dot(x, v) > 0.) break;
  }
  // the shadow: a frisket mask from the impact parameter, razor sharp whatever the march did
  float lit = mix(1., abFrisket(b - BCRIT, bw * 1.2), inward) * (1. - captured);
  vec3 bent = v / max(length(v), 1e-4);
  float nearRing = smoothstep(BCRIT * 1.015, BCRIT * 1.22, b);
  float mag = 1. + inward * 2.2 * BCRIT * BCRIT / max(b * b - BCRIT * BCRIT, 400.);
  vec3 sky = abSky(bent, pxA * mag, mix(1., nearRing, inward));
  // hairline cream ring hugging the shadow, and its under-spray
  float dr = (b - BCRIT * 1.008) / (bw * 1.1);
  float ring = exp(-dr * dr) * inward;
  // (keyed on the angle round the shadow and the log of the impact parameter: a conformal pair, so a dot is a
  //  round speck at every distance; the angle's seam lies under the shadow, behind the floor of lanes)
  vec3 hk = hv / max(b, 1e-3);
  vec3 fw = -ro / max(length(ro), 1.);
  vec3 sx = normalize(cross(fw, vec3(0., 1., 0.)) + vec3(1e-4, 0., 0.));
  vec3 sy = cross(sx, fw);
  vec2 rkey = vec2(atan(dot(hk, sy), 1e-5 - dot(hk, sx)), log(max(b, 1.) / BCRIT)) * 160.;
  float hal = abSpray(abHalo(b - BCRIT, 500.) * 1.5, rkey, bw / max(b, 1.) * 160., 0.) * inward * step(BCRIT, b);
  sky = mix(sky, mix(uInk[3], uInk[4], .35), hal * .8);
  sky = mix(sky, mix(uInk[4], vec3(1.), .35), ring);
  // rare event: two images of a blue star run round the shadow and close into a ring
  if (uEinstein > 0.){
    float cx = abs(dot(hk, sy)) ;                      // 1 at the left and right of the shadow, 0 above and below
    float open = smoothstep(1. - uEinstein * 1.02, 1. - uEinstein * .9 + .02, cx);
    float de = (b - BCRIT * 1.085) / (bw * 1.6 + 1.5 * uEinstein);
    sky = mix(sky, mix(uInk[6], vec3(1.), .3), exp(-de * de) * open * inward * smoothstep(0., .06, uEinstein));
  }
  col += (1. - A) * sky * lit;
  gl_FragColor = vec4(clamp(col, 0., 1.), 1.);
}
`;function Oe(i){const t=i.uniforms;return{uInk:t.uInk,uTime:t.uTime,uGap:t.uGap,uCone:t.uCone,uClump:t.uClump,uDiscA:t.uDiscA,uDiscB:t.uDiscB}}function ta(i={}){const{hero:t,paint:r,vertex:D,disc:K=!1,uniforms:m={},...z}=i,T=t?Oe(t):{};return new e.ShaderMaterial({uniforms:{...T,...m},vertexShader:`
      uniform float uTime;
      varying vec2 vUv; varying vec3 vPos; varying vec3 vWorldPos; varying vec3 vNormal; varying vec3 vView;
      ${D||"vec3 abMove(vec3 p){ return p; }"}
      void main(){
        vUv = uv; vec3 p = abMove(position); vPos = p;
        vec4 w = vec4(p, 1.);
        #ifdef USE_INSTANCING
          w = instanceMatrix * w;
        #endif
        w = modelMatrix * w;
        vWorldPos = w.xyz;
        vNormal = normalize(mat3(modelMatrix) * normal + vec3(0., 1e-5, 0.));
        vView = normalize(w.xyz - cameraPosition + vec3(0., 1e-5, 0.));
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,fragmentShader:`
      precision highp float;
      varying vec2 vUv; varying vec3 vPos; varying vec3 vWorldPos; varying vec3 vNormal; varying vec3 vView;
      ${ke}
      ${K?ze:""}
      ${r||"vec4 abPaint(){ return vec4(abRamp(abSpray(vUv.y, vUv * 100., fwidth(vUv.x) * 100., 0.)), 1.); }"}
      void main(){ vec4 c = abPaint(); gl_FragColor = vec4(clamp(c.rgb, 0., 1.), clamp(c.a, 0., 1.)); }`,...z})}const Xe=["#04040C","#1C2B8F","#D4226B","#FF6A14","#FFE2A6","#18B8A6","#BFD4FF"],Ye=[[-2600,330,0],[-2540,330,0],[-2260,322,-10],[-2182,303,-26],[-1926,184,-138],[-1747,92,-227],[-1516,37,-322],[-1082,34,-440],[-784,31,-469],[-534,30,-454],[-346,30,-391],[-269,30,-328],[-204,30,-252],[-162,47,-200],[-79,117,-97]];function Je(i,t){return i==="violet"?{inks:[t[0],"#2A1670","#7B3FE4",t[2],t[4],"#FFB81C",t[6]],haze:.3,hazeCol:"#2A1670",starN:48,density:.95}:i==="verdigris"?{inks:["#1A0A20","#0B5440",t[5],"#9FE8C8",t[4],t[3],"#FF5A3C"],haze:.9,hazeCol:"#5A1846",starN:34,density:.9}:{inks:[t[0],t[1],t[2],t[3],t[4],t[5],t[6]],haze:1,hazeCol:t[1],starN:34,density:.95}}function Qe(i,t,r,D){let K=1e9;for(let m=0;m<i.length-1;m++){const z=i[m],T=i[m+1],F=T[0]-z[0],A=T[1]-z[1],B=T[2]-z[2],te=F*F+A*A+B*B||1,X=q(((t-z[0])*F+(r-z[1])*A+(D-z[2])*B)/te,0,1),oe=z[0]+F*X-t,U=z[1]+A*X-r,G=z[2]+B*X-D;K=Math.min(K,oe*oe+U*U+G*G)}return Math.sqrt(K)}async function oa(i,t={}){const r=i.rng.fork?i.rng.fork("airbrush-black-hole"):i.rng,D=i.quality?.detail??1,K=t.palette&&t.palette.length>=7?t.palette:Xe,m=t.path||Ye,z=t.duration??47,T=r();Be&&(t={...Be,...t});const F=t.edition||(T<.5?"cadmium":T<.76?"violet":"verdigris"),A=Je(F,K),B=q(Math.round(t.cones??r.int(3,7)),1,E),te=q(Math.round(t.gaps??r.int(1,4)),0,ce),X=r(),oe=r.range(40,60),U=r.range(-.9,.9),G=t.warp??(X<.35?oe:0),Me=r.range(.7,1),fe=q(Math.round(t.clumps??P*Me),0,P),Re=r.range(1,90),Pe=r.range(1,60),De=r.range(.8,1.1),ve=[];{const a=r.shuffle([640,790,930,1090,1230]);for(let f=0;f<ce;f++)ve.push(new e.Vector4(a[f]+r.range(-45,45),f<te?r.range(7,17):0,0,0))}const _=t.conePass||{u:.426,position:[-900,32,-458]},Ke=Math.hypot(_.position[0],_.position[2]),He=Math.atan2(_.position[2],_.position[0]),pe=[];for(let a=0;a<E;a++){const f=a===0?Ke:O(520,1330,(a-.5+r.range(-.3,.3))/(E-1));pe.push({r:f,phase:a/B*Math.PI*2+r.range(-.4,.4),strength:a<B?r.range(.75,1):0})}const L=[];for(let a=0;a<P;a++)L.push({r:O(338,512,(a+r())/P),phase:r.range(0,Math.PI*2),period:r.range(8,14),size:a<fe?r.range(25,40):0,seed:r()});r.shuffle(L);const Y=[];for(let a=0;a<we;a++){const f=r.range(0,Math.PI*2),p=r.range(-.75,.75),l=Math.sqrt(1-p*p);Y.push(new e.Vector4(Math.cos(f)*l,p,Math.sin(f)*l,r.range(.028,.06)))}Y[0].set(.93,.3,-.21,.06).setW(.06),Y[1].set(.9,.16,.4,.04);for(const a of Y){const f=a.w,p=Math.hypot(a.x,a.y,a.z);a.set(a.x/p,a.y/p,a.z/p,f)}const Ie=a=>new e.Color(a),I={uInk:{value:A.inks.map(Ie)},uTime:{value:0},uGap:{value:ve},uCone:{value:pe.map(()=>new e.Vector4(1,0,900,0))},uClump:{value:L.map(()=>new e.Vector4(1,0,400,0))},uDiscA:{value:new e.Vector4(G,U,Re,De)},uDiscB:{value:new e.Vector4(940,-1175,t.near===!1?0:1,0)},uGlint:{value:Y},uHazeCol:{value:Ie(A.hazeCol)},uSky:{value:new e.Vector4(A.haze,A.density,Pe,0)},uSteps:{value:Math.max(14,Math.round((t.steps??32)*D))},uEinstein:{value:0},uWorldInv:{value:new e.Matrix4}},H=new e.Group;H.name="airbrush-black-hole",await i.yield();const Ne=new e.ShaderMaterial({uniforms:I,vertexShader:je,fragmentShader:qe.replace("float N = 34.;",`float N = ${A.starN.toFixed(1)};`),depthWrite:!1,depthTest:!0,side:e.BackSide,fog:!1}),re=new e.Mesh(new e.IcosahedronGeometry(1,2),Ne);re.frustumCulled=!1,re.renderOrder=-.5,re.name="plate",H.add(re),await i.yield();const J=new e.Group;J.name="near",H.add(J);const de=t.near!==!1,W=`
    precision highp float;
    uniform mat4 uWorldInv;
    ${ke}
    ${ze}
    vec3 abCamLocal(){ return (uWorldInv * vec4(cameraPosition, 1.)).xyz; }
    // 1 when the hole does not stand between the eye and p (the plate cannot bend real geometry, so hide it there)
    float abClear(vec3 cam, vec3 p){
      vec3 d = p - cam; float t = clamp(-dot(cam, d) / max(dot(d, d), 1.), 0., 1.);
      float between = smoothstep(0., .02, t) * (1. - smoothstep(.9, 1., t));
      return mix(1., smoothstep(${(be*1.2).toFixed(1)}, ${(be*2).toFixed(1)}, length(cam + d * t)), between);
    }`;{const a=new e.IcosahedronGeometry(.5,3),f=a.attributes.position,p=i.noise,l=[],u=[],h=[],k=[],d=new e.Vector3;for(let c=0;c<f.count;c++){d.fromBufferAttribute(f,c).normalize();const s=1+.09*p.n3(d.x*2.1+7,d.y*2.1,d.z*2.1)+.035*p.n3(d.x*5.3,d.y*5.3+3,d.z*5.3),y=d.z<0?1+.9*d.z*d.z:1;u.push(d.x*.5*s,d.y*.5*s,d.z*.5*s*y),h.push(d.x,d.y,d.z),k.push(0,0),l.push(0),c%600===599&&await i.yield()}const M=18;for(let c=0;c<2;c++)for(let s=0;s<M;s++){const y=[[-1,s],[1,s],[1,s+1],[-1,s],[1,s+1],[-1,s+1]];for(const[o,n]of y){const v=n/M,w=-.1-v*6.75,g=.5*o;c===0?(u.push(g,0,w),h.push(0,1,0)):(u.push(0,g*.55,w),h.push(1,0,0)),k.push(o,v),l.push(1)}}const x=new e.InstancedBufferGeometry;x.setAttribute("position",new e.Float32BufferAttribute(u,3)),x.setAttribute("normal",new e.Float32BufferAttribute(h,3)),x.setAttribute("uv",new e.Float32BufferAttribute(k,2)),x.setAttribute("aKind",new e.Float32BufferAttribute(l,1)),x.setAttribute("aIdx",new e.InstancedBufferAttribute(new Float32Array(L.map((c,s)=>s)),1)),x.setAttribute("aSeed",new e.InstancedBufferAttribute(new Float32Array(L.map(c=>c.seed)),1)),x.instanceCount=P,a.dispose();const S=new e.ShaderMaterial({uniforms:I,transparent:!0,depthWrite:!1,side:e.DoubleSide,fog:!1,vertexShader:W+`
        attribute float aKind; attribute float aIdx; attribute float aSeed;
        varying vec3 vP; varying vec2 vUv2; varying vec4 vK;   // vK: kind, fade, facing, size
        void main(){
          vec4 c = uClump[int(aIdx + .5)];
          float size = c.w;
          vec3 p = position;
          p += normal * sin(uTime * 3.1 + aSeed * 40. + position.x * 9. + position.y * 7.) * .035 * (1. - aKind);
          p.x *= mix(.9, 1.15, aSeed); p.y *= mix(1.1, .85, aSeed);
          float arc = p.z * size;
          float ang = arc / c.z;
          float cs = cos(ang), sn = sin(ang);
          vec2 e = vec2(c.x * cs - c.y * sn, c.y * cs + c.x * sn);
          float rad = c.z + p.x * size;
          float y = size * (.27 + p.y * .5) + 1.5 + aKind * sin(arc / 23. + uTime * 5. + aSeed * 9.) * 1.6 * min(-p.z, 1.);
          vec3 lp = vec3(e.x * rad, y, e.y * rad);
          vec3 ln = vec3(e.x * normal.x - e.y * normal.z, normal.y, e.y * normal.x + e.x * normal.z);
          vec4 w = modelMatrix * vec4(lp, 1.);
          vec3 wn = normalize(mat3(modelMatrix) * ln + vec3(0., 1e-5, 0.));
          vec3 vw = normalize(w.xyz - cameraPosition + vec3(0., 1e-5, 0.));
          vec3 cam = abCamLocal();
          float dist = length(lp - cam);
          float fade = mix(1., 1. - smoothstep(380., 720., dist), uDiscB.z) * abClear(cam, lp);
          vP = p * size; vUv2 = uv; vK = vec4(aKind, fade, abs(dot(wn, vw)), size);
          gl_Position = size > 0. && fade > 0. ? projectionMatrix * viewMatrix * w : vec4(2., 2., 2., 1.);
        }`,fragmentShader:W+`
        varying vec3 vP; varying vec2 vUv2; varying vec4 vK;
        void main(){
          vec2 key = vec2(vP.z + vP.y * .6, vP.x - vP.y * .8);
          float fp = max(fwidth(key.x), fwidth(key.y));
          float size = max(vK.w, 1.);
          float T, a;
          if (vK.x < .5){
            if (!gl_FrontFacing) discard;
            float z = vP.z / size;                                   // + is the leading face
            float lump = abNoise(vP * .16 + 3.) - .5;
            float d = z - (.02 + lump * .08);                        // frisket: the leading cap, a round head
            float cap = abFrisket(d, max(fwidth(d), 1e-4));
            float back = exp(min(d, 0.) * 5.);                       // behind it spray only, thinning fast
            float limb = smoothstep(.0, .55, vK.z);                  // and the back half has no outline: it dissolves at the limb
            float cov = max(cap * (.45 + .55 * limb), back * .8 * limb);
            T = mix(mix(.42, .86, back), 1.04, cap) - (1. - vK.z) * .28 * (1. - cap) + lump * .1;
            a = max(cap, abSpray(cov, key, fp, 0.));
          } else {
            float s = 1. - abs(vUv2.x), k = 1. - vUv2.y;
            float streak = abNoise(vec3(vUv2.x * 5., vP.z * .05 + uTime * 2., 7.));
            float cov = k * sqrt(k) * smoothstep(0., .75, s) * (.55 + .7 * streak);
            T = mix(.45, .95, k) + (streak - .5) * .14;              // cream at the head, then orange, then magenta
            a = abSpray(cov * .9, key, fp, 0.) * smoothstep(0., .04, vUv2.y);
          }
          vec3 col = abRampS(T * .94, key + 91., fp, 3.);
          gl_FragColor = vec4(col, a * vK.y);
        }`}),b=new e.Mesh(x,S);b.frustumCulled=!1,b.renderOrder=3,b.name="clumps",b.visible=de&&fe>0,J.add(b)}await i.yield();{const p=[],l=[],u=[],h=[];for(let x=0;x<=12;x++){const S=x/12,b=100*Math.pow(S,.8),c=120*(1-S);for(let s=0;s<=44;s++){const y=s/44*Math.PI*2;p.push(Math.cos(y)*b,c,Math.sin(y)*b);const o=Math.hypot(120,100);l.push(Math.cos(y)*120/o,100/o,Math.sin(y)*120/o),u.push(s/44,S)}}for(let x=0;x<12;x++)for(let S=0;S<44;S++){const b=x*45+S,c=b+1,s=b+44+1,y=s+1;h.push(b,s,c,c,s,y)}const k=new e.InstancedBufferGeometry;k.setAttribute("position",new e.Float32BufferAttribute(p,3)),k.setAttribute("normal",new e.Float32BufferAttribute(l,3)),k.setAttribute("uv",new e.Float32BufferAttribute(u,2)),k.setIndex(h),k.setAttribute("aIdx",new e.InstancedBufferAttribute(new Float32Array([0,1,2,3,4,5,6]),1)),k.instanceCount=E;const d=new e.ShaderMaterial({uniforms:I,transparent:!0,depthWrite:!1,side:e.DoubleSide,fog:!1,vertexShader:W+`
        attribute float aIdx;
        varying vec2 vUv2; varying vec4 vK;   // facing, fade, index, distance
        void main(){
          vec4 c = uCone[int(aIdx + .5)];
          vec2 er = c.xy, et = vec2(-c.y, c.x);
          float h = uv.y;
          vec2 ctr = er * c.z;
          float lag = 55. * h * h;                               // the skirt trails behind the nozzle
          vec2 xz = ctr + er * position.x + et * (position.z + lag);
          vec3 lp = vec3(xz.x, position.y + abWarp(ctr) - 2., xz.y);
          vec3 ln = normalize(vec3(er.x * normal.x + et.x * normal.z, normal.y, er.y * normal.x + et.y * normal.z));
          vec4 w = modelMatrix * vec4(lp, 1.);
          vec3 wn = normalize(mat3(modelMatrix) * ln + vec3(0., 1e-5, 0.));
          vec3 vw = normalize(w.xyz - cameraPosition + vec3(0., 1e-5, 0.));
          vec3 cam = abCamLocal();
          float fade = abClear(cam, vec3(ctr.x, 40., ctr.y)) * smoothstep(0., .1, c.w);
          vUv2 = uv; vK = vec4(abs(dot(wn, vw)), fade, aIdx, length(lp - cam));
          gl_Position = fade > 0. ? projectionMatrix * viewMatrix * w : vec4(2., 2., 2., 1.);
        }`,fragmentShader:W+`
        varying vec2 vUv2; varying vec4 vK;
        void main(){
          float h = vUv2.y;
          vec2 key = vec2(vUv2.x * 628. * (.15 + h), h * 156.);
          float fp = max(fwidth(vUv2.x) * 628. * (.15 + h), fwidth(h) * 156.) * 2.1;   // speckle is coarse under a cone
          float n = abNoise(vec3(vUv2.x * 30., h * 3.2 - uTime * 1.1, vK.z * 9.));
          float n2 = abNoise(vec3(vUv2.x * 9., h * 1.4 - uTime * .5, vK.z * 5. + 4.));
          float rays = abNoise(vec3(vUv2.x * 70., vK.z * 3., floor(uTime * 3.) * .37));
          float cov = pow(vK.x, 1.4) * (.5 * (1. - h) + .14) * (.25 + .7 * n + .4 * n2 + .22 * rays);
          cov *= smoothstep(0., .04, h) * (1. - smoothstep(.72, 1., h));
          float a = abSpeck(cov * .5 * mix(.5, 1., smoothstep(60., 500., vK.w)), key, fp, floor(uTime * 3.) + vK.z) * .88;
          vec3 col = abRamp(mix(.74, 1.02, clamp(cov * 2.2, 0., 1.)));
          gl_FragColor = vec4(col, a * vK.y);
        }`}),M=new e.Mesh(k,d);M.frustumCulled=!1,M.renderOrder=4,M.name="cones",M.visible=de,J.add(M)}await i.yield();let ne=0;{const a=r.fork?r.fork("plumes"):r,f=(o,n)=>{const v=Math.hypot(o,n),w=We(850,1500,v),g=Math.max((o*Math.cos(U)+n*Math.sin(U))/Math.max(v,1),0);return G*w*w*g*g},p=[],l=[],u=(o,n,v,w)=>{const g=Math.hypot(o,n);if(g<345||g>1460)return!1;for(const C of ve)if(C.y>0&&Math.abs(g-C.x)<C.y+6)return!1;const R=v*a.range(1.3,2.3),Q=a.range(.3,1),ye=a.range(0,6.28),Z=a.range(2.6,5.2)*(.7+v/90),ee=a(),ae=o/g,$=n/g,se=-$,ie=ae,le=f(o,n);for(let C=0;C<=10;C++){const j=C/10,ge=Math.sin(Math.PI*j),Ce=R*(j-.5+Q*.35*ge*ge),Te=R*.1*Math.sin(6.283*j+ee*6),Ge=o+se*Ce+ae*Te,_e=n+ie*Ce+$*Te,Le=le+v*Math.pow(ge,.75)*1.06-1;if(Qe(m,Ge,Le,_e)<w+Z)return!1}return p.push(o,n,v,R),l.push(Q,ye,Z,ee),!0};let h=1,k=0;for(let o=0;o<m.length-1;o++){const n=m[o],v=m[o+1],w=Math.hypot(v[0]-n[0],v[1]-n[1],v[2]-n[2]);let g=k;for(;g<w;g+=36){const R=g/w,Q=O(n[0],v[0],R),ye=O(n[1],v[1],R),Z=O(n[2],v[2],R),ee=a.range(-12,12),ae=a.range(13,30);let $=a.range(20,62);if(ye>70)continue;const se=(v[0]-n[0])/w,ie=(v[2]-n[2])/w,le=Q+se*ee-ie*ae*h,C=Z+ie*ee+se*ae*h,j=(o+R)/(m.length-1);j>.5&&j<.62&&Math.hypot(le,C)<Math.hypot(Q,Z)&&($=Math.min($,30)),u(le,C,$,8),h=-h}k=g-w}await i.yield();const d=Math.round(150*D*O(.7,1,Me));for(let o=0;o<d;o++){const n=a.range(0,Math.PI*2),v=Math.sqrt(a.range(350*350,1450*1450)),w=a.range(20,70);u(Math.cos(n)*v,Math.sin(n)*v,w,10),o%40===39&&await i.yield()}ne=p.length/4;const M=22,x=[],S=[],b=[];for(let o=0;o<=M;o++)x.push(0,0,0,0,0,0),S.push(0,o/M,1,o/M);for(let o=0;o<M;o++){const n=o*2;b.push(n,n+1,n+2,n+1,n+3,n+2)}const c=new e.InstancedBufferGeometry;c.setAttribute("position",new e.Float32BufferAttribute(x,3)),c.setAttribute("uv",new e.Float32BufferAttribute(S,2)),c.setIndex(b),c.setAttribute("aA",new e.InstancedBufferAttribute(new Float32Array(p.length?p:[0,0,0,0]),4)),c.setAttribute("aB",new e.InstancedBufferAttribute(new Float32Array(l.length?l:[0,0,0,0]),4)),c.instanceCount=Math.max(ne,1);const s=new e.ShaderMaterial({uniforms:I,transparent:!0,depthWrite:!1,side:e.DoubleSide,fog:!1,vertexShader:W+`
        attribute vec4 aA; attribute vec4 aB;
        varying vec2 vUv2; varying vec4 vK;   // fade, phase, seed, metres along
        vec3 abCurve(float t){
          vec2 b0 = aA.xy; float r0 = max(length(b0), 1.); vec2 er = b0 / r0; vec2 et = vec2(-er.y, er.x);
          float s = max(sin(3.14159 * t), 0.);
          float along = aA.w * (t - .5 + aB.x * .35 * s * s);
          float bow = aA.w * .1 * sin(6.283 * t + aB.w * 6.);
          float flick = 1. + .06 * sin(uTime * 2.3 + aB.y + t * 5.);
          vec2 xz = b0 + et * along + er * bow;
          return vec3(xz.x, abWarp(b0) + aA.z * pow(s + 1e-4, .75) * flick - 1., xz.y);
        }
        void main(){
          float t = uv.y;
          vec3 c = abCurve(t);
          vec3 tg = abCurve(t + .02) - abCurve(t - .02);
          vec3 cam = abCamLocal();
          vec3 toC = c - cam; float dist = max(length(toC), 1.);
          vec3 sd = cross(tg, toC);
          sd = sd / max(length(sd), 1e-4);
          float s = max(sin(3.14159 * t), 0.);
          float sa = length(cross(tg / max(length(tg), 1e-4), toC / dist));   // a ribbon seen end-on thins and fades instead of fanning out
          float w = max(aB.z * (.28 + .72 * s) * (.3 + .7 * sa), dist * .0016);
          vec3 lp = c + sd * (uv.x * 2. - 1.) * w;
          float fade = (1. - smoothstep(1000., 1700., dist)) * smoothstep(5., 12., dist) * abClear(cam, c) * step(.5, aA.z) * smoothstep(.04, .3, sa);
          vUv2 = uv; vK = vec4(fade, aB.y, aB.w, t * aA.w);
          gl_Position = fade > 0. ? projectionMatrix * viewMatrix * modelMatrix * vec4(lp, 1.) : vec4(2., 2., 2., 1.);
        }`,fragmentShader:W+`
        varying vec2 vUv2; varying vec4 vK;
        void main(){
          float u = vUv2.x * 2. - 1., t = vUv2.y;
          vec2 key = vec2(u * 4., vK.w) + vK.z * 50.;
          float fp = max(fwidth(key.x), fwidth(key.y));
          float edge = abFrisket(.78 - u, fwidth(u));                    // frisket on one side
          float soft = smoothstep(-1., .35, u);                          // sprayed away on the other
          float pulse = .5 + .5 * sin(t * 11. - uTime * 3.4 + vK.y);
          float n = abNoise(vec3(vK.w * .22 - uTime * 2.2, u * 1.5, vK.z * 30.));
          float cov = edge * soft * (.38 + .4 * pulse + .4 * n) * smoothstep(0., .07, t) * (1. - smoothstep(.9, 1., t));
          float T = .34 + .2 * vK.z + .3 * soft * edge + .2 * pulse * n + .2 * sin(3.14159 * t);
          vec3 col = abRampS(T, key + 13., fp, 0.);
          gl_FragColor = vec4(col, max(abSpray(cov, key, fp, 0.), edge * soft * soft * .0) * vK.x);
        }`}),y=new e.Mesh(c,s);y.frustumCulled=!1,y.renderOrder=2,y.name="plumes",y.visible=de&&ne>0,J.add(y)}await i.yield();const N=a=>new e.Vector3(a[0],a[1],a[2]),me=N(m[m.length-1]),Ve=N(m[m.length-2]),Se=me.clone().sub(Ve).normalize(),Ee={holeCentre:new e.Vector3(0,0,0),splash:new e.Vector3(940,0,-1175),entry:N(m[0]),moonlet:new e.Vector3(-2250,125,70),companion:new e.Vector3(750,0,-2800),streamTip:new e.Vector3(660,0,-2310),flyThrough:m.map(N),portalSeat:{position:me.clone(),normal:Se.clone().negate(),radius:8.5},exitDir:Se,skim:new e.Vector3(-784,31,-469),inner:new e.Vector3(-269,30,-328),conePass:N(_.position),viewpoints:[{position:N(m[0]),target:new e.Vector3(0,60,0)},{position:new e.Vector3(-2182,303,-26),target:new e.Vector3(0,40,0)},{position:new e.Vector3(-784,31,-469),target:new e.Vector3(0,70,0)},{position:new e.Vector3(-300,30,-355),target:new e.Vector3(0,30,0)},{position:new e.Vector3(-120,82,-148),target:me.clone()}]};let ue=V?.44:-1;const Ue=new e.Matrix4,he=new e.Vector3,Ae=Math.PI*2/40,xe={object:H,radius:V?V.radius:1500,height:V?V.height:1500,center:V?N(V.center):new e.Vector3(0,0,0),anchors:Ee,uniforms:I,edition:F,ground:!1,groundY:0,info:{edition:F,cones:B,gaps:te,warp:G,clumps:fe,plumes:ne},setProgress(a){ue=q(a,0,1)},setEinstein(a){I.uEinstein.value=q(a,0,1)},update(a,f,p){I.uTime.value=f,H.updateWorldMatrix(!0,!1),I.uWorldInv.value.copy(Ue.copy(H.matrixWorld).invert());for(let l=0;l<E;l++){const u=pe[l];let h=u.phase-Ae*f;l===0&&ue>=0&&(h=He-Ae*(ue-_.u)*z),I.uCone.value[l].set(Math.cos(h),Math.sin(h),u.r,u.strength)}for(let l=0;l<P;l++){const u=L[l],h=u.phase+Math.PI*2/u.period*f;I.uClump.value[l].set(Math.cos(h),Math.sin(h),u.r,u.size)}p&&(he.setFromMatrixPosition(p.matrixWorld).applyMatrix4(I.uWorldInv.value),I.uSky.value.w=7e-4*(he.x+he.z*.7)+.04*f)},dispose(){}};return xe.update(0,0,null),H.userData.hero=xe,xe}export{be as B_CRIT,ze as DISC_GLSL,Fe as RS,ea as R_IN,aa as R_OUT,ke as STYLE_GLSL,oa as buildHero,ta as styleMaterial,Oe as styleUniforms};
