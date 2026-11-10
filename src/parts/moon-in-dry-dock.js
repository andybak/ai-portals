import*as h from"three";import{mergeGeometries as qo}from"three/addons/utils/BufferGeometryUtils.js";import{makePath as Xo,makeRng as To}from"../kit/core.js";const ue=Math.PI*2,Zo=["#E9C98A","#C8643C","#EEF1F4","#F8FBFF","#3E6FA8","#2B3A4A","#8FD3E8"],N=120,Y=128,Ma=134,Je=96,G=ue/Je,Fe=131,Re=6,Bt=6,Yo=21,Be=[-2.25,.62],et=[-.2,.82],Zt=.6,je=.16,Lo=-.64,pt=110,xt=40,Vt=r=>Math.min(1,Math.max(0,r)),Qe=(r,v,f)=>{const g=Vt((f-r)/(v-r));return g*g*(3-2*g)},Ce=r=>r-ue*Math.round(r/ue),ct=`
vec3 hash33(vec3 p){ p = fract(p * vec3(.1031, .1030, .0973)); p += dot(p, p.yxz + 33.33); return fract((p.xxy + p.yxx) * p.zyx); }
float hash13(vec3 p){ p = fract(p * .1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float vnoise(vec3 p){
  vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  float a = mix(mix(hash13(i), hash13(i + vec3(1,0,0)), f.x), mix(hash13(i + vec3(0,1,0)), hash13(i + vec3(1,1,0)), f.x), f.y);
  float b = mix(mix(hash13(i + vec3(0,0,1)), hash13(i + vec3(1,0,1)), f.x), mix(hash13(i + vec3(0,1,1)), hash13(i + vec3(1,1,1)), f.x), f.y);
  return mix(a, b, f.z);
}
float fbm3(vec3 p){ return vnoise(p) * .55 + vnoise(p * 2.07 + 7.1) * .29 + vnoise(p * 4.3 + 3.7) * .16; }
`,tt=`
uniform vec3 uSunDir, uSunCol, uSkyCol, uGndCol, uMoonC;
float moonShadow(vec3 p){
  vec3 oc = p - uMoonC; float b = dot(oc, uSunDir); float c = dot(oc, oc) - ${(N*N).toFixed(1)};
  float disc = b * b - c;
  return 1. - smoothstep(0., 900., disc) * step(b, 0.) * step(0., c);
}
vec3 lightIt(vec3 alb, vec3 n, vec3 p, float ao){
  float nl = max(dot(n, uSunDir), 0.);
  float sh = moonShadow(p);
  float up = n.y * .5 + .5;
  return alb * (uSunCol * nl * sh + uSkyCol * (.35 + .65 * up) * ao + uGndCol * (1. - up) * ao);
}
`,yt=`
uniform float uProg, uSecs;
vec3 rotAx(vec3 v, vec3 k, float a){ float c = cos(a), s = sin(a); return v * c + cross(k, v) * s + k * dot(k, v) * (1. - c); }
vec3 leanSector(vec3 p, inout vec3 n, float az, float rel){
  float t = max(uProg - rel, 0.) * uSecs;
  if (t <= 0.) return p;
  vec3 o = vec3(sin(az), 0., cos(az));
  vec3 tang = vec3(o.z, 0., -o.x);
  float e = 1. - exp(-t * .55);
  float ang = (.13 + .08 * fract(az * 3.7 + .3)) * e * e + .01 * sin(t * 1.3 + az * 5.) * e;
  n = rotAx(n, tang, ang * step(abs(n.y), .5));
  return vec3(p.x, p.y * cos(ang), p.z) + o * (p.y * sin(ang));
}
`,_o=`
attribute vec4 aFx;   // sector azimuth, release u, random, kind (0 pole, 1 deck, 2 loose, 3 plain)
vec3 cradle(vec3 p, inout vec3 n, vec3 ctr){
  if (aFx.w > 1.5 && aFx.w < 2.5) {
    // loose: ballistic fall with tumble, coming to rest on the floor
    float t = max(uProg - aFx.y, 0.) * uSecs;
    if (t <= 0.) return p;
    vec3 o = vec3(sin(aFx.x), 0., cos(aFx.x));
    vec3 tang = vec3(o.z, 0., -o.x);
    float tt = min(t, sqrt(max(ctr.y - .25, 0.) / 2.75));
    vec3 axis = normalize(vec3(aFx.z - .5, .35, fract(aFx.z * 7.3) - .5));
    float ang = tt * (1.5 + aFx.z * 2.5);
    vec3 q = ctr + rotAx(p - ctr, axis, ang);
    n = rotAx(n, axis, ang);
    q += o * (2. + 5. * aFx.z) * tt + tang * (fract(aFx.z * 13.7) - .5) * 3. * tt;
    q.y -= 2.75 * tt * tt;
    return q;
  }
  return leanSector(p, n, aFx.x, aFx.y);
}
`,Yt=`
uniform sampler2D uCrTab;
float prof(float t, float pk){
  float w = smoothstep(.5, 1., t);
  float wt = w + .1 * sin(w * 18.85) * (1. - w) * w;
  float h = t < 1. ? mix(-.17, .05, wt) : .05 * exp(-(t - 1.) * 5.) * (1. - smoothstep(1.2, 1.5, t));
  return h + pk * .07 * exp(-t * t * 28.);
}
vec4 crTab(vec3 p, float row, float cellM, out float ray){
  vec3 b = floor(p - .5); vec4 acc = vec4(0.); ray = 0.;
  for (int i = 0; i < 8; i++) {
    vec3 c = b + vec3(float(i & 1), float((i >> 1) & 1), float((i >> 2) & 1));
    vec3 m = mod(c, 8.);
    vec4 tx = textureLod(uCrTab, (vec2(m.x + 8. * m.y, m.z + row) + .5) / vec2(64., 16.), 0.);
    float rad = .16 + .17 * tx.a;
    vec3 dv = p - (c + tx.rgb); float r = length(dv); float t = r / rad;
    if (t < 1.5) {
      float pk = step(.5, tx.a);
      acc.w += prof(t, pk) * rad * cellM;
      acc.xyz += (prof(t + .02, pk) - prof(t - .02, pk)) * 25. * dv / max(r, 1e-4);
    }
    // rays of thrown dust round the younger craters
    if (t > .75 && r < .5 && fract(tx.r * 7.31 + tx.g * 3.17) > .62) {
      vec3 dn = dv / max(r, 1e-4);
      float streak = vnoise(dn * 9. + tx.rgb * 40.) * vnoise(dn * 23. + 5.);
      ray += smoothstep(.16, .5, streak) * smoothstep(.75, 1.05, t) * (1. - smoothstep(.2, .5, r)) * 2.2;
    }
  }
  return acc;
}
vec4 crHash(vec3 p, float seed){
  vec3 b = floor(p - .5); vec4 acc = vec4(0.);
  for (int i = 0; i < 8; i++) {
    vec3 c = b + vec3(float(i & 1), float((i >> 1) & 1), float((i >> 2) & 1));
    vec3 h = hash33(c + seed);
    float rad = .14 + .19 * h.x * h.y * 2.;
    rad = min(rad, .33);
    vec3 dv = p - (c + h.yzx); float r = length(dv); float t = r / rad;
    if (t < 1.5) {
      acc.w += prof(t, 0.) * rad;
      acc.xyz += (prof(t + .03, 0.) - prof(t - .03, 0.)) * 16.67 * dv / max(r, 1e-4);
    }
  }
  return acc;
}
`,Ro=`
#include <common>
#include <fog_pars_vertex>
uniform mat4 uMoonMat;
uniform float uRad, uMode, uLuneLat;
uniform vec3 uLune;   // centre azimuth, half-width (rad), extra creep in metres
varying vec3 vDir, vHp, vLoc; varying vec2 vEdge;
${ct}
${Yt}
void main(){
  vEdge = uMode > .5 ? uv : vec2(0.);
  vec3 d = normalize(position);
  vec3 P = d * uRad;
  float ray;
  vec4 c1 = crTab(P / ${pt.toFixed(1)}, 0., ${pt.toFixed(1)}, ray);
  vec4 c2 = crTab(P / ${xt.toFixed(1)}, 8., ${xt.toFixed(1)}, ray);
  float h = c1.w + c2.w;
  float rho = uRad * sqrt(max(1. - d.y * d.y, 0.));
  float phi = (abs(d.x) + abs(d.z) < 1e-5) ? 0. : atan(d.x, d.z);
  float a = phi - uLune.x; a -= 6.2831853 * floor(a / 6.2831853 + .5);
  float s = max((abs(a) - uLune.y + ${je.toFixed(3)} - ${(je+Zt).toFixed(3)} * smoothstep(-.42, .02, d.y)) * rho, (uLuneLat - asin(clamp(d.y, -1., 1.))) * uRad) - uLune.z;
  if (uMode < .5) h *= smoothstep(-7., 1.5, s);     // the silvered lune is a true sphere
  else h *= .35;
  vec3 p = position + d * h;
  vDir = d; vLoc = position;
  vHp = (uMoonMat * vec4(p, 1.)).xyz;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Bo=`
#include <common>
#include <fog_pars_fragment>
uniform mat4 uMoonMat, uRootInv;
uniform float uRad, uMode, uTime, uOpen, uSurveyY, uLuneLat;
uniform vec3 uLune, uSeedV, uChalk, uSilver, uOchre, uTerra, uSea, uZen, uHor;
uniform vec2 uStruck, uGap;
uniform vec3 uSelf, uGlow;
uniform sampler2D uPits;     // p1: the pit sheet (one channel, tileable, mip-mapped; 128 is its mean)
varying vec3 vDir, vHp, vLoc; varying vec2 vEdge;
${ct}
${tt}
${Yt}
float angDiff(float a, float b){ float x = a - b; return x - 6.2831853 * floor(x / 6.2831853 + .5); }
float sectorOn(float az){
  float m = step(uStruck.y, abs(angDiff(az, uStruck.x)));
  return m * step(uGap.y, abs(angDiff(az, uGap.x)));
}
// where a ray from P along dir meets the scaffold shell (a cylinder of radius rc):
// x = pole and deck lines, y = tarpaulin, z = that bay's hash
vec3 scaf(vec3 P, vec3 dir, float rc, float wPole, float wDeck, float aa){
  float a = dot(dir.xz, dir.xz);
  if (a < 1e-5) return vec3(0.);
  float b = dot(P.xz, dir.xz), c = dot(P.xz, P.xz) - rc * rc;
  if (c > 0.) return vec3(0.);
  float t = (-b + sqrt(max(b * b - a * c, 0.))) / a;
  vec3 Q = P + dir * t;
  float az = atan(Q.x, Q.z);
  float ca = az / ${G.toFixed(6)};
  float fa = abs(fract(ca) - .5) * ${(G*128).toFixed(3)};
  float fy = abs(fract(Q.y / 6. + .5) - .5) * 6.;
  float ln = max(1. - smoothstep(wPole, wPole + aa, fa), 1. - smoothstep(wDeck, wDeck + aa, fy));
  float m = step(0., Q.y) * (1. - smoothstep(${(Y-1).toFixed(1)}, ${(Y+1).toFixed(1)}, Q.y)) * sectorOn(az);
  float th = hash13(vec3(floor(ca + .5), floor(Q.y / 6.), rc));
  float u = fract(ca + .5), v = fract(Q.y / 6.);
  float tp = step(.84, th) * step(20., Q.y) * smoothstep(.03, .08, u) * smoothstep(.97, .92, u) * smoothstep(.04, .09, v) * smoothstep(.95, .9, v);
  return vec3(ln * m, tp * m, th);
}
// the gallery as the mirror shows it: one standard in three, one deck in two, the odd tarpaulin (x lines, y tarp, z hash)
vec4 scafM(vec3 P, vec3 dir, float aa){
  float a = dot(dir.xz, dir.xz);
  if (a < 1e-5) return vec4(0.);
  float b = dot(P.xz, dir.xz), c = dot(P.xz, P.xz) - 17161.;
  if (c > 0.) return vec4(0.);
  float t = (-b + sqrt(max(b * b - a * c, 0.))) / a;
  vec3 Q = P + dir * t;
  float az = (abs(Q.x) + abs(Q.z) < 1e-4) ? 0. : atan(Q.x, Q.z);
  float ca = az / ${(G*3).toFixed(6)};
  float fa = abs(fract(ca) - .5) * ${(G*3*131).toFixed(3)};
  float ln = 1. - smoothstep(.2, .2 + aa, fa);
  float m = step(0., Q.y) * (1. - smoothstep(${(Y-1).toFixed(1)}, ${(Y+1).toFixed(1)}, Q.y)) * sectorOn(az);
  float c1 = az / ${G.toFixed(6)};
  float th = hash13(vec3(floor(c1 + .5), floor(Q.y / 6.), 131.));
  float u = fract(c1 + .5), v = fract(Q.y / 6.);
  float tu = (u - .22) / .56, tv = (v - .14) / .72;
  float tin = step(20., Q.y) * step(0., tu) * step(tu, 1.) * step(0., tv) * step(tv, 1.);
  float sx = abs(fract(tu * 3. + .5) - .5), sy = abs(fract(tv * 2. + .5) - .5);
  float seam = 1. - smoothstep(.02, .06, min(sx, sy * 1.4));
  float tp = tin * max((.74 + .26 * sin(tu * 8. + th * 40. + uTime * 2.2)) * (1. - .5 * seam) * (.7 + .3 * tv), .25);   // seamed, bellying, darker at the foot
  float cb = az / ${(G*6).toFixed(6)}, bid = floor(cb), bx = (fract(cb) - .5) * ${(G*6*131).toFixed(3)};
  float by = Q.y - (18. + mod(uTime * 3. + hash13(vec3(bid, 1., 2.)) * 80., 80.));
  float bk = exp(-(bx * bx + by * by) * .22) * m;
  return vec4(ln * m, tp * m, th, bk);
}
// The mirror's picture of the harbour. A true reflection from under the overhang is the ochre dock below us,
// which reads as a tan wall, so the lune carries one continuous authored panorama by bearing and elevation:
// sky, drifting cloud and one sun star over a clean horizon; under it the town climbing its hill (seaward:
// the sea, glittering), then the pale quay, the ground squeezed up toward the horizon as a ball squeezes it.
uniform vec3 uMirSun; uniform float uMirTip;
vec3 envSky(vec3 r){
  float y = max(r.y, 0.);
  vec3 c = mix(uHor, uZen, min(sqrt(y) * 1.08, 1.));
  vec2 q = r.xz / (y + .16) * 1.3 + vec2(uTime * .012, 0.);
  float cl = fbm3(vec3(q, 2.5)) * smoothstep(.02, .2, y);
  c = mix(c, vec3(1.08, 1.05, 1.02), smoothstep(.47, .7, cl) * .9);
  float sd = max(dot(r, uMirSun), 0.);
  float s2 = sd * sd; float s8 = s2 * s2 * s2 * s2; float s64 = s8 * s8 * s8 * s8 * s8 * s8 * s8 * s8;
  c += uSunCol * (smoothstep(.9992, .9998, sd) * 16. + s64 * s64 * s64 * s64 * s64 * s64 * 1.1 + s64 * .05);
  return c;
}
// gulls crossing the panorama: x = mask, y = 1 toward the wing tips
vec2 gullM(float phi, float el, float k){
  float pb = -2.6 - .55 * k + .4 * sin(uTime * .23 + k * 1.7);
  float eb = .13 + .09 * k + .05 * sin(uTime * .37 + k * 4.);
  float x = angDiff(phi, pb) / .1;
  float ax = min(abs(x), 1.);
  float flap = sin(uTime * 5.5 + k * 2.);
  float y = (el - eb - ax * (.03 * flap + .034) + ax * ax * .046) / (.017 * (1.4 - ax) * (2.2 - 1.2 * smoothstep(0., .3, ax)));
  return vec2((1. - smoothstep(.8, 1., ax)) * (1. - smoothstep(.55, 1., abs(y))), smoothstep(.12, .3, ax) * .45 + smoothstep(.6, .9, ax) * .55);
}
vec3 env(vec3 P, vec3 r){
  float hl = max(length(r.xz), 1e-3);
  float el = r.y / hl;
  vec2 b = r.xz / hl;
  float phi = (abs(b.x) + abs(b.y) < 1e-4) ? 0. : atan(b.x, b.y);
  vec3 lightG = uSunCol * .72 + uSkyCol * .75;
  float townW = smoothstep(-.34, -.06, dot(b, vec2(.707, -.707)) + .1 * (vnoise(vec3(b * 2.5, 4.)) - .5));
  vec3 roofC = (uTerra * .72 + uOchre * .06) * lightG, wallC = (uOchre * .66 + vec3(.1, .095, .085)) * lightG;
  // above the horizon: sky; the town's upper rows on their hill (roofs over pale walls); the bell tower as one spike
  float hc = phi / .02 + .4 * sin(phi * 53.) + .25 * sin(phi * 131.), hf = fract(hc), hh = hash13(vec3(floor(hc), 3., 1.));
  float sk = (.008 + .026 * vnoise(vec3(b * 5., 1.)) + .03 * hh * hh) * townW * step(.1 + .3 * step(.8, hh), hf);      // a ragged roofline: houses of unequal height and width, a few taller, gaps between
  vec3 col = envSky(normalize(vec3(r.x, max(r.y, 0.), r.z) + vec3(0., 1e-4, 0.)));
  vec3 upTown = mix(wallC * (.8 + .3 * hh), roofC * (.8 + .35 * hh) * (hf < .55 ? 1.05 : .78), smoothstep(.26, .32, el / max(sk, 1e-3)));
  col = mix(col, mix(upTown, uHor, .1), smoothstep(sk + .003, sk - .003, el));
  float tw = dot(b, vec2(.866, -.5)), twOn = step(0., dot(b, vec2(-.5, -.866)));
  float tWid = .0085 * (1. - smoothstep(.085, .12, el));                                  // the shaft, then the pyramid roof tapering to a point
  float tMask = (1. - smoothstep(tWid - .002, tWid, abs(tw))) * twOn * step(el, .12);
  vec3 tCol = el > .085 ? roofC : wallC * (tw > 0. ? 1.08 : .72) * (1. - .55 * step(abs(el - .07), .007) * step(abs(tw), .004));
  col = mix(col, tCol, tMask);
  if (el < 0.) {
    float e = -el;
    // town side: three stepped rows of small houses close under the horizon, each a terracotta roof over a pale wall
    float rowA = e / .078 * 3.;
    float hcA = phi / .017, hA = hash13(vec3(floor(hcA), 2., 7.));
    float rowf = rowA + (hA - .5) * .34;                                                   // every house steps up or down from its neighbour
    float row = clamp(floor(rowf), 0., 3.);
    float hc2 = (phi + row * .041) / (.0125 + .005 * row) + .34 * sin(phi * 61. + row * 2.1) + .22 * sin(phi * 173. + row);   // party walls unevenly spaced
    float i2 = floor(hc2), f2 = fract(hc2);
    float h2 = hash13(vec3(i2, row, 7.)), h3 = hash13(vec3(i2, row, 11.)), h4 = hash13(vec3(i2, row, 19.));
    float v = fract(rowf) + (h3 - .5) * .3;                                                // some stand taller than their neighbours
    float roofF = .3 + .16 * h2;
    vec3 wallT = h4 < .42 ? uOchre * .74 + vec3(.06, .05, .03) : (h4 < .72 ? vec3(.74, .68, .55) : vec3(.72, .47, .4));   // ochre, cream, rose
    vec3 wall = wallT * lightG * (f2 < .62 ? 1.04 : .6) * (.92 + .16 * fract(h2 * 7.3));
    float wv = (v - roofF) / max(1. - roofF, .1);
    float win = step(.3, fract(wv * 2.2)) * step(fract(wv * 2.2), .68) * step(.32, fract(f2 * 3.)) * step(fract(f2 * 3.), .68) * step(roofF + .04, v);
    wall *= 1. - .58 * win;                                                                // dark window dots, two storeys
    vec3 roof = roofC * (.82 + .4 * h2) * (f2 < .5 ? 1.1 : .78);
    roof *= 1. - .3 * smoothstep(roofF - .07, roofF, v);                                   // the eaves' shade
    vec3 house = v < roofF ? roof : wall;
    house = v < 0. ? wallC * vec3(.5, .54, .66) : house;                                   // the shaded wall of the row above shows over a low roof
    house *= mix(.36, 1., smoothstep(0., .1, f2));                                         // slots of shadow between them
    house = mix(house, uHor * .8, .07);                                                    // set back a little in the morning haze
    // seaward: smooth blue, the glitter gathered into one lane under the sun star
    float sunPhi = (abs(uMirSun.x) + abs(uMirSun.z) < 1e-4) ? 0. : atan(uMirSun.x, uMirSun.z);
    float dph = angDiff(phi, sunPhi);
    float lane = exp(-dph * dph * 420.) * smoothstep(0., .02, e);
    float gl = vnoise(vec3(phi * 330., e * 240. - uTime * 1.1, uTime * .9)); gl *= gl;
    vec3 sea = uSea * (.62 + .16 * vnoise(vec3(b * 5., e * 14. + uTime * .05))) * (uSkyCol * 1.5 + uSunCol * .25) + uSunCol * lane * (.3 + 2.4 * gl * gl);
    sea = mix(sea, uHor * .92, smoothstep(.05, 0., e) * .7);
    vec3 farC = mix(sea, house, townW);
    float eQ = mix(.16, .08, townW);                                                       // where the pale quay begins
    vec3 quay = (uOchre * .24 + vec3(.2, .225, .26)) * (.92 + .14 * vnoise(vec3(b * 24., 1.))) * lightG;
    quay *= 1. - .16 * max(step(fract(e * 55.), .1), step(fract(phi * 30. + .5 * floor(e * 55.)), .1));   // slab joints: lines a tenth of a slab wide, the slabs breaking joint row by row
    quay = mix(quay, quay * vec3(.5, .58, .78), smoothstep(.7, .9, vnoise(vec3(phi * 26., e * 5., 2.))) * .85);          // long shadows of the cradle's poles across it
    quay = mix(quay, uChalk * .66 * lightG, smoothstep(.62, .7, vnoise(vec3(phi * 9. + 4., e * 30., 7.))));             // chalk spilt and swept
    float eR = .18 + .01 * (vnoise(vec3(b * 9., 6.)) - .5);                        // the lip of the dock
    vec3 dockC = (uOchre * .2 + vec3(.1, .115, .15)) * (uSkyCol * 2.3 + uGndCol * .9) * (.95 + .05 * step(.5, fract(e * 7.))) * (.9 + .2 * vnoise(vec3(b * 3., e * 2.)));
    vec3 g = mix(farC, quay, smoothstep(eQ - .004, eQ + .004, e));
    g *= 1. - .5 * smoothstep(.016, 0., abs(e - eQ + .009)) * townW;                      // the arcades' shade at the foot of the town
    g = mix(g, vec3(.06, .075, .105), smoothstep(eR - .005, eR, e));                      // the dark rim
    float bd = max(e - eR - .014, 0.) / .022;                                               // five altars as stepped bands, then the floor
    float sf = fract(bd);
    vec3 alt = dockC * mix(vec3(.62, .7, .86) * (.75 + .5 * sf), vec3(2.3, 2.1, 1.75), step(.78, sf));
    vec3 flr = dockC * 1.25 * (.85 + .3 * step(.5, fract(bd * 2.3)));
    flr = mix(flr, uChalk * .62 * (uSkyCol * 1.3 + uSunCol * .3), smoothstep(.5, .66, fbm3(vec3(b * 7., bd * .8))));
    flr = mix(flr, mix(uHor, uZen, .6) * 1.05, smoothstep(.6, .66, vnoise(vec3(b * 5. + 3., bd * .55))));
    g = mix(g, bd < 5. ? alt : flr, smoothstep(eR + .008, eR + .014, e));               // the basin below it, in the Moon's shade
    g = mix(g, uSilver * (uSkyCol * 1.45 + uSunCol * .22), .2);                           // silver, not stone
    col = mix(col, g, smoothstep(0., .006, e));
  }
  vec2 g0 = gullM(phi, el, 0.), g1 = gullM(phi, el, 1.), g2 = gullM(phi, el, 2.);
  vec2 gm = g0.x > g1.x ? g0 : g1; gm = gm.x > g2.x ? gm : g2;
  col = mix(col, mix(vec3(.92, .92, .9), vec3(.3, .32, .36), gm.y) * (uSunCol * .5 + uSkyCol * .95), gm.x);
  return col;
}
// metres outside the silver at azimuth ph and height yy (object space); latK = 1 where the lower (latitude) edge is the nearer one.
// The seam leans: at gallery height it stands SEAM_LEAN rad further round than on the dome, so the dome shows a broad blade of
// mirror from the quay and the gallery still crosses from chalk into silver in front of the lens
float luneS(float ph, float yy, out float latK){
  float yc = clamp(yy / uRad, -1., 1.); float clc = sqrt(max(1. - yc * yc, 0.));
  vec3 dc = vec3(sin(ph) * clc, yc, cos(ph) * clc);
  float hw = uLune.y - ${je.toFixed(3)} + ${(je+Zt).toFixed(3)} * smoothstep(-.42, .02, yc);
  float sa = (abs(angDiff(ph, uLune.x)) - hw) * uRad * clc, sb = (uLuneLat - asin(yc)) * uRad;
  latK = step(sa, sb);
  return max(sa, sb) - uLune.z + (fbm3(dc * uRad * .11 + 3.) - .5) * 9.;
}
void main(){
  vec3 d = normalize(vDir);
  vec3 camL = (uRootInv * vec4(cameraPosition, 1.)).xyz;
  vec3 toCam = camL - vHp; float dist = length(toCam);
  vec3 V = toCam / max(dist, 1e-3);
  vec3 P = d * uRad;
  float ray1, ray2;
  vec4 c1 = crTab(P / ${pt.toFixed(1)}, 0., ${pt.toFixed(1)}, ray1);
  vec4 c2 = crTab(P / ${xt.toFixed(1)}, 8., ${xt.toFixed(1)}, ray2);
  vec4 c3 = crHash(P / 13., 1.7);
  float f4 = 1. - smoothstep(160., 420., dist), f5 = 1. - smoothstep(35., 100., dist);
  vec4 c4 = vec4(0.), c5 = vec4(0.), c6 = vec4(0.);
  if (f4 > 0.) { c4 = crHash(P / 3.6, 5.3); c6 = crHash(P / 6.7, 3.1); if (dist < 140.) c6 += crHash(P / 5.1 + 17., 8.9) * (1. - smoothstep(70., 140., dist)); }
  if (f5 > 0.) { c5 = crHash(P / .95, 9.1); if (dist < 24.) c5 += crHash(P / .34 + 9., 4.4) * (1. - smoothstep(11., 24., dist)) * .85; }
  vec3 g = c1.xyz + c2.xyz + c3.xyz + (c4.xyz * 1.15 + c6.xyz * 1.25) * f4 + c5.xyz * 1.1 * f5;
  // chalk tooth: a little fine relief from noise
  if (dist < 260.) {
    float e1 = fbm3(P * .9), e2 = fbm3(P * .9 + vec3(.25, 0., 0.)), e3 = fbm3(P * .9 + vec3(0., .25, 0.)), e4 = fbm3(P * .9 + vec3(0., 0., .25));
    g += vec3(e2 - e1, e3 - e1, e4 - e1) * 1.9 * (1. - smoothstep(60., 260., dist));
  }
  float hsum = c1.w * .04 + c2.w * .09 + c3.w * 1.6 + (c4.w * 1.3 + c6.w * 1.5) * f4 + c5.w * 1.5 * f5;
  // ---- silvered lune
  float rho = uRad * sqrt(max(1. - d.y * d.y, 0.));
  float phi = (abs(d.x) + abs(d.z) < 1e-5) ? 0. : atan(d.x, d.z);
  float rq = max(floor(rho / 9. + .5) * 9., 9.);
  vec2 lid = floor(vec2(phi * rq, P.y) / .6);
  vec2 lc = (lid + .5) * .6;
  float latK = 0.;
  float sc = luneS(lc.x / rq, lc.y, latK);
  float lh = hash13(vec3(lid, 2.));
  float lhFar = .5, looseFar = 0.;
  float arcW = phi * rho;
  float silver, fresh, wet;
  vec2 lidU = lid;
  if (uMode < .5) {
    float latX = 0.; float scX = luneS(phi, P.y, latX);                // the same distance at this very point (not per square)
    float loose = step(.9, hash13(vec3(lid, 7.))) * step(.35, fract(lh * 9.3)) * 3.6 * (1. - latK);
    silver = step(sc + (lh - .5) * 3.2 - loose, 0.);
    // the lower edge, under the overhang, is trimmed to a clean line: no squares there
    silver = mix(silver, step(scX, 0.), latX);
    latK = max(latK, latX);
    // close to, the leaf is laid in hand-sized squares: the same edge worked out per 0.2 m square, cross-faded in by distance
    float nearW = 1. - smoothstep(30., 55., dist);
    if (nearW > 0.) {
      vec2 lidF = floor(vec2(phi * rq, P.y) / .2);
      float lhF = hash13(vec3(lidF, 2.));
      float scN = scX;
      float looseF = step(.93, hash13(vec3(lidF, 7.))) * step(.3, fract(lhF * 9.3)) * 2.8;
      silver = mix(silver, mix(step(scN + (lhF - .5) * 1.5 - looseF, 0.), step(scX, 0.), latX), nearW);
      sc = mix(sc, scN, nearW); lh = mix(lh, lhF, nearW);
      if (nearW > .5) lidU = lidF;
    }
    // from the quay and the street the leaf is too fine to see: there the same edge is drawn in 5 m squares, a few of them
    // loose in the chalk ahead of the seam, so the dome's silver blade has a ragged, glittering edge at 300 m
    float farW = smoothstep(90., 170., dist);
    if (farW > 0.) {
      vec2 lidB = floor(vec2(phi * rq, P.y) / 5.); vec2 lcB = (lidB + .5) * 5.;
      float lkB = 0.; float scB = luneS(lcB.x / rq, lcB.y, lkB);
      float lhB = hash13(vec3(lidB, 2.));
      float looseB = step(.84, hash13(vec3(lidB, 7.))) * (7. + 11. * fract(lhB * 9.3)) * (1. - lkB);
      float silB = step(scB + (lhB - .5) * 7. * (1. - .7 * lkB) - looseB, 0.);
      silver = mix(silver, mix(silB, step(scX, 0.), latX), farW); lhFar = lhB; looseFar = step(.5, looseB) * step(2., scB);
    }
    fresh = smoothstep(-4., 0., sc) * (1. - latK);              // p2: only the working seam is fresh; above the trimmed lower edge the leaf is one smooth face
    wet = smoothstep(3.8, 2., sc + (vnoise(vec3(arcW * .35, P.y * .3, 5.)) - .5) * 1.6) * (1. - silver);
  } else {
    // spare crescent: the inner (concave-side) edge is still silvered
    float edge = smoothstep(.911, .919, vEdge.x + (fbm3(P * .15) - .5) * .06);      // p2: a crisp, narrower band along the inner edge (the shell's own uv)
    silver = uMode > 1.5 ? 1. : max(edge, step(.5, vEdge.y)); fresh = 0.; wet = 0.;
  }
  g *= 1. - silver;
  g -= dot(g, d) * d;
  vec3 nObj = normalize(d - g);
  if (uMode > .5 && vEdge.y > .5) nObj = -d;
  mat3 m3 = mat3(uMoonMat);
  vec3 n = normalize(m3 * nObj);
  vec3 dW = normalize(m3 * d);
  if (uMode > .5 && vEdge.y > .5) dW = -dW;
  // ---- chalk
  float mfield = fbm3(d * 1.6 + uSeedV) - c1.w * .014;
  float maria = smoothstep(.565, .61, mfield);
  // one broad mare high on the town side, so the disc reads as the Moon from the far end of the street
  if (uMode < .5) maria = max(maria, smoothstep(.9, .93, dot(d, vec3(.741, .561, .37)) + (fbm3(d * 5. + uSeedV) - .5) * .13));
  float wear = smoothstep(.3, .46, fbm3(P * .16 + 11.) + .07 * (vnoise(P * 1.7) - .5) + .5 * smoothstep(.6, .68, mfield));
  if (uMode < .5) maria = max(maria, smoothstep(.972, .982, dot(d, vec3(.9, -.39, .19)) + (fbm3(d * 9. + uSeedV) - .5) * .05));
  maria *= wear;
  if (uMode < .5) maria *= smoothstep(8., 42., sc);          // the chalk is cleaned back to white before the leaf goes on
  float a = .615 + .11 * (fbm3(P * .45) - .5) + (ray1 * .09 + ray2 * .07) + c3.w * .25;
  a *= .93 + .12 * vnoise(vec3(P.y * 1.3 + fbm3(P * .07) * 7., 1., 2.));     // the beds of the chalk
  a *= 1. + clamp(c1.w * .034, -.17, .07) + clamp(c2.w * .034, -.1, .05);     // big crater floors a little darker, rims lighter: rings that read from afar
  a *= 1. + clamp((c3.w * 1.6 + (c4.w * 1.3 + c6.w * 1.6) * f4 + c5.w * 1.5 * f5) * 2.6, -.24, .1);       // dust lies darker in every pit, the rims are scuffed pale: the wall reads even with the sun full on it
  // p1 THE PIT SHEET: small crisp pits (a dark wall under the upper rim, a pale lip over it) from one tileable picture, laid on by the surface's
  // own place alone: round the flanks by azimuth and height (78 and 328 tiles to the round, 9.67 m and 2.30 m each; the picture's up is the Moon's
  // up), on the belly and the crown by P.zx. There is no lens term and no fade of its own: where a pit is smaller than a pixel the sampler's
  // mip-maps hand back the sheet's mean, which is nought here, so from afar the chalk is as it was. The spare crescents (uMode 1, 2) do not take it.
  float pit = 0.;
  if (uMode < .5) {
    vec3 dPx = dFdx(P), dPy = dFdy(P); float rr2 = max(P.x * P.x + P.z * P.z, 1.);
    vec2 gx = vec2((P.z * dPx.x - P.x * dPx.z) / rr2, dPx.y), gy = vec2((P.z * dPy.x - P.x * dPy.z) / rr2, dPy.y);      // what one pixel spans in azimuth and height (for the sampler; whole across the +-180 degree line)
    vec2 wv = (vec2(vnoise(P * .07 + 31.), vnoise(P * .07 + 47.)) - .5) * 1.2;                                        // the rows of tiles bent a little (metres), so they do not stand in ranks
    vec2 k1 = vec2(12.41409, .103451), k2 = vec2(52.20282, .435023), qf = vec2(phi, P.y);
    float wb = smoothstep(.62, .82, abs(d.y));
    float s1 = mix(textureGrad(uPits, qf * k1 + wv * k1.y, gx * k1, gy * k1).r, texture2D(uPits, (P.zx + wv) * k1.y).r, wb);
    float s2 = mix(textureGrad(uPits, qf * k2 + wv * k2.y + vec2(.37, .61), gx * k2, gy * k2).r, texture2D(uPits, (P.zx + wv) * k2.y + vec2(.53, .19)).r, wb);
    pit = ((s1 + s2) * 2.55 - 2.56) * (.6 + .8 * smoothstep(.3, .7, vnoise(P * .06 + 71.)));                    // the pits gather in fields
  }
  float thin = 1. - smoothstep(50., 170., dist);
  vec3 Pk = P * .21 + 3. + (vec3(vnoise(P * 1.9), vnoise(P * 1.9 + 7.), vnoise(P * 1.9 + 13.)) - .5) * .5 + (vec3(vnoise(P * 7.), vnoise(P * 7. + 5.), vnoise(P * 7. + 11.)) - .5) * .12;
  float ck = abs(vnoise(Pk) - .5);
  a *= 1. - .3 * (1. - smoothstep(.0, .006, ck)) * smoothstep(.52, .66, vnoise(P * .045 + 20.)) * thin * (1. - smoothstep(25., 70., dist));
  // two big old craters low on the town-facing side, drawn broad so they can be counted from the far end of the street
  if (uMode < .5) {
    float farK = smoothstep(110., 250., dist) * (1. - silver);
    float tA = sqrt(max(1. - dot(d, vec3(.941, -.242, .235)), 0.) / .00745), tB = sqrt(max(1. - dot(d, vec3(.997, -.07, -.035)), 0.) / .0038);
    float rimA = exp(-(tA - 1.) * (tA - 1.) * 40.), rimB = exp(-(tB - 1.) * (tB - 1.) * 40.);
    a *= 1. + farK * (.1 * (rimA + rimB) - .15 * (1. - smoothstep(.5, .95, tA)) - .15 * (1. - smoothstep(.5, .95, tB)));
  }
  a = clamp(a, .3, .70);
  a = clamp(a * (1. + .42 * pit), .3, .70);                                    // p1: the pits, laid on under the same cap (a lip is never paler than the chalk may be)
  vec3 alb = uChalk * a;
  // drips of size running down from the wet band; red-chalk survey line with ticks
  float wline = max(.05, dist * .0012);
  float sv = P.y - uSurveyY; float arc = phi * rho;
  float tick = step(abs(fract(arc) - .5), .46) < .5 ? 1. : 0.;
  float tick5 = step(abs(fract(arc / 5.) - .5), .492) < .5 ? 1. : 0.;
  float mark = 1. - smoothstep(wline, wline * 1.6, abs(sv));
  mark = max(mark, tick * step(-.4 - .7 * tick5, sv) * step(sv, 0.) * thin);
  alb = mix(alb, uTerra * .75, mark * .75 * (1. - silver) * step(uMode, .5) * (.6 + .4 * vnoise(P * 6.)));
  float macro = smoothstep(-.16, .34, dot(dW, uSunDir));
  float micro = clamp(dot(n, uSunDir) * .95 + .1, 0., 1.);
  float ao = clamp(1. + hsum, .5, 1.12);
  // plank and pole shadows from the scaffold on the sunward flank
  float aaS = .25 + dist * .004;
  vec3 shv = scaf(vHp, uSunDir, 128., .5, .9, aaS);
  float dkf = fract(vHp.y / 6. + .02 * sin(vHp.x * .21 + vHp.z * .17));
  float dband = smoothstep(.5, .56, dkf) * (1. - smoothstep(.97, 1., dkf));                  // the deck above shades the upper part of each lift
  float sq = dkf * 4.3 + .35 * vnoise(vec3(vHp.x * .05, vHp.z * .05, floor(vHp.y / 6.)));
  float slit = (1. - smoothstep(.015, .05, abs(fract(sq) - .5))) * (1. - smoothstep(18., 70., dist)) * step(.4, vnoise(vec3(vHp.x * .16, floor(sq) * 3.1, vHp.z * .16)));
  dband *= 1. - .7 * slit;                                                                   // slits of sun between the planks, here and there
  float dOn = step(6., vHp.y) * (1. - smoothstep(${(Y-8).toFixed(1)}, ${(Y-2).toFixed(1)}, vHp.y)) * sectorOn((abs(vHp.x) + abs(vHp.z) < 1e-4) ? 0. : atan(vHp.x, vHp.z));
  float stripe = max(max(shv.x, shv.y * .85) * .5, dband * dOn * .9) * (1. - uOpen) * (1. - smoothstep(190., 285., dist));
  float up = n.y * .5 + .5;
  float low = smoothstep(-.8, -.985, dW.y);
  vec3 sideL = normalize(vec3(uSunDir.x, -.3, uSunDir.z) + vec3(1e-4, 0., 0.));
  float rake = clamp(dot(n, sideL) * 2.2 - .35, 0., 1.4) * smoothstep(-.3, -.75, dW.y) * mix(.4, 1., smoothstep(12., 55., dist));
  float belly = smoothstep(-.34, -.74, dW.y);                // 0 on the flanks, 1 under the overhang
  float keelG = smoothstep(-.992, -.9998, dW.y);                                // the bounce off the dock floor gathers on the lowest part: one pool under the keel, the rest of the belly stays chalk in shade
  vec3 skyF = uSkyCol * (.3 + .7 * up) * mix(vec3(1.), vec3(.9, .97, 1.1), belly) * mix(1., 1.8, belly) * (1. - .85 * keelG);
  vec3 bounce = uGndCol * mix(vec3(1.), vec3(1.1, .96, .7), belly);
  // under a frontal sun craters show only by tone, as at full Moon: give every pit one lit lip and one shaded
  vec3 sunO = uSunDir * m3;
  vec3 tO = sunO - d * dot(sunO, d) + (vec3(0., 1., 0.) - d * d.y) * .3;
  tO /= max(length(tO), .25);
  float relief = clamp(-dot(g, tO) * 1.9, -.62, .55);
  vec3 tU = vec3(0., 1., 0.) - d * d.y; tU /= max(length(tU), .3);
  float reliefU = clamp(-dot(g, tU) * 2.3, -.55, .55) * (1. - belly);
  vec3 lit = uSunCol * micro * macro * (1. + relief) * (1. - stripe) * mix(.75, 1., ao) + skyF * ao * (1. + reliefU)
    + bounce * (1. - up) * (1. - up) * mix(1.6, .2 + 1.6 * keelG, belly) * ao + (uGndCol * 1.5 + uSkyCol * .25) * rake * mix(1., .5, belly) * ao;
  // the sunlit half of the dock floor throws warm light back up onto the sunward side of the belly
  vec2 sx = sunO.xz / max(length(sunO.xz), .2), dx2 = d.xz / max(length(d.xz), .2);
  lit += uSunCol * vec3(.46, .36, .22) * belly * (1. - keelG) * smoothstep(-.35, .85, dot(sx, dx2)) * (1. + relief * .9) * ao;
  vec3 col = alb * (lit + uSelf * (.75 + .25 * ao));
  // ---- old tarnished silver of the maria: satin, grey-gold, worn through
  vec3 rr = reflect(-V, n);
  vec3 blur = mix(uOchre * .14 + vec3(.1, .105, .115), mix(uHor, uZen, .45), smoothstep(-.35, .45, rr.y));
  float tn = fbm3(P * .06 + 5.);
  vec3 tarn = mix(vec3(.42, .44, .46), vec3(.56, .5, .36), smoothstep(.35, .7, tn));
  tarn = mix(tarn, vec3(.24, .26, .31), smoothstep(.5, .72, fbm3(P * .2 + 9.)) * .45);
  tarn *= max(1. + .4 * pit, .3);                                                                                        // p1: the same pits in the worn silver
  float sheen = max(dot(rr, uSunDir), 0.); sheen *= sheen; sheen *= sheen; sheen *= sheen;
  vec3 mcol = tarn * (blur * .72 + lit * .3 + uSunCol * sheen * sheen * .5 * macro);
  col = mix(col, mcol, maria * (1. - silver) * .92);
  // ---- wet seam: size brushed on ahead of the leaf, glossy and dark, with drips
  float drip = smoothstep(.72, .9, vnoise(vec3(arc * 2.2, P.y * .22 + uTime * .05, 1.))) * smoothstep(7., 1., sc) * (1. - silver) * step(uMode, .5);
  float wetAmt = max(wet, drip * .8);
  float fres0 = 1. - max(dot(n, V), 0.); float fres = fres0 * fres0; fres *= fres * fres0;
  vec3 rw = reflect(-V, normalize(mix(dW, n, .1)));        // the size lies smooth over the chalk's tooth: one calm reflection, no sparkle
  col = mix(col, col * vec3(.42, .48, .58) + min(env(vHp, rw), vec3(1.1)) * (.05 + .4 * fres), wetAmt);
  // ---- mirror
  if (silver > .001) {
    float nearK = 1. - smoothstep(25., 110., dist);
    vec3 tint = mix(uSilver, vec3(1.), fres0 * fres0);
    vec3 mir;
    if (uMode > .5) {
      // a spare crescent: one smooth blade. The view ray is bounced off the shell itself (an analytic sphere normal), so the
      // sky's gradient, its clouds, the town and the quay lie along it unbroken, and the sun star rides along the edge as we pass
      vec3 rc = normalize(reflect(-V, dW) + vec3(1e-5, 0., 0.));
      vec3 e = env(vHp, rc);
      float sdc = max(dot(rc, uMirSun), 0.); float c2 = sdc * sdc, c4 = c2 * c2, c8 = c4 * c4, c16 = c8 * c8;
      e += uSunCol * (c16 * c16 * c16 * .55 + c8 * .06);
      mir = e * tint * 1.06 + uSilver * uSkyCol * .1;
    } else {
    vec3 jit = (hash33(vec3(lidU, 5.)) - .5) * .07 * smoothstep(-1.3, 0., sc) * nearK * (1. - latK);      // faceted leaf in the last metres before the seam; 
    // the picture is the harbour, not the dock under us: below the equator the glass is taken as a wall leaning back by a
    // constant amount, so the bent horizon runs through the middle of the silver wherever we stand beside it
    // The bearing is the true one (the view ray bounced off the ball, so the harbour is squeezed sideways and slides as we
    // move); the elevation is the view ray's own, as in a wall of glass leaning back a little, so the horizon stands
    // uMirTip below the real one all along the silver, and a ball's squeeze is put back as a scale.
    float hlW = max(length(dW.xz), 1e-3);
    vec3 nH = normalize(vec3(dW.x, 0., dW.z) / hlW + m3 * jit);
    vec3 rH = reflect(-V, nH);
    float rl = max(length(rH.xz), 1e-3);
    float hV = clamp(-V.y / max(length(V.xz), .05), -3., 3.);
    float elM = 1.6 * (hV + uMirTip) + .15 * (.4 - max(dot(dW, V), 0.)) + jit.y * .8;
    elM *= elM < 0. ? .75 : 1.;                                          // the ground squeezed up toward the horizon
    vec3 rB = vec3(rH.x / rl, elM, rH.z / rl);
    vec3 rA = reflect(-V, normalize(dW + vec3(0., .5, 0.) + m3 * jit));
    vec3 r = normalize(mix(rB, rA, smoothstep(-.2, .35, dW.y)) + vec3(1e-5, 0., 0.));
    vec3 e = env(vHp, r);
    // our own gallery in the glass: a few standards, a tarpaulin here and there (no deck lines: with them it read as a glazed dome)
    float aaM = .12 + dist * .012;
    vec4 s1 = scafM(vHp, r, aaM);
    float tk = fract(s1.z * 37.);
    vec3 tc = tk < .4 ? uTerra * .5 + vec3(.16, .13, .1) : (tk < .7 ? vec3(.5, .47, .4) : mix(uSea, vec3(.7), .3));
    e = mix(e, tc * s1.y * (uSunCol * .6 + uSkyCol * 1.1), step(.001, s1.y) * step(.972, s1.z) * (1. - uOpen) * .8);
    vec3 wood = vec3(.2, .14, .09) * (uSunCol * .45 + uSkyCol * .8);
    e = mix(e, wood, s1.x * (1. - uOpen) * .8);
    e += uGlow * 2.6 * s1.w * (1. - uOpen);
    float nv = max(dot(normalize(dW), V), 0.);
    float mote = exp(-(1. - nv) / .0035);
    e += vec3(1.3, 1.2, 1.0) * mote * 1.6;
    // ---- the dome seen from the quay and the street. A true reflection at the limb is the pale horizon behind the Moon, the
    // colour of sunlit chalk, so from afar nothing said mirror. Here the blade above the top rail carries its own bent sky:
    // zenith blue at the crown paling to the rail, cloud squeezed thin along the limb, one sun star; all of it slides as we come on
    float farM = smoothstep(60., 150., dist) * smoothstep(-.04, .1, dW.y);
    if (farM > 0.) {
      float hgt = clamp(dW.y, 0., 1.);
      float nvF = max(dot(dW, V), 0.);
      vec3 fm = mix(mix(uHor, uZen, .7) * .66, uZen * vec3(.2, .22, .27), smoothstep(.04, .62, hgt));       // a deep sky, darker than the one behind the Moon       // darker and bluer than the sky behind it
      // three long clouds, one above another, drawn thin along the limb; they climb down the blade as we come on
      float slide = (305. - camL.x) * .0026 + uTime * .004;
      float ph = (hgt + slide) / .46, cf = fract(ph) - .5, cid = floor(ph);
      float nearK = smoothstep(170., 300., dist); float across = clamp(nvF / mix(.2, .45, nearK), 0., 1.);
      float ca = .3 + .36 * hash13(vec3(cid, 3., 8.));
      float cm = exp(-(across - ca) * (across - ca) * 70.) * exp(-cf * cf * 7.);
      cm = smoothstep(.26, .5, cm * (.62 + .76 * fbm3(vec3(nvF * 14., hgt * 5. + slide * 5., 3.7))));
      fm = mix(fm, vec3(1.02, 1., .97) * (uSkyCol * .95 + uSunCol * .56), cm * .95);
      fm *= .92 + .16 * lhFar;                                           // each square of leaf holds a slightly different piece of sky
      fm = mix(fm, uHor * 1.1 + uSunCol * .3, looseFar * .75);           // the loose squares out in the chalk catch the light
      float azS = uLune.x - uLune.y - .36 + (camL.x - 290.) * .0012, laS = clamp(.5 + (camL.x - 290.) * .0022, .14, .95);
      vec3 nS = vec3(sin(azS) * cos(laS), sin(laS), cos(azS) * cos(laS));
      float qS = 1. - max(dot(d, nS), 0.);
      fm += uSunCol * (exp(-qS * 9000.) * 14. + exp(-qS * 1100.) * 1.3 + exp(-qS * 150.) * .1);
      fm += (uHor * .55 + uSunCol * .22) * (1. - smoothstep(0., .02 + .07 * nearK, nvF));          // the limb itself, a bright edge against the sky
      e = mix(e, fm, farM);
    }
    mir = e * tint * 1.12 * mix(1., .86 + .28 * lh, fresh * nearK) * (1. + (lh - .5) * .07 * nearK);
    mir += uSilver * uSkyCol * .1 + uSunCol * fres0 * fres0 * fres0 * .42 * (1. - nearK) * (1. - farM);       // seen from afar the limb flashes
    }
    col = mix(col, mir, silver);
  }
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,Vo=`
#include <common>
#include <fog_pars_vertex>
attribute vec3 aCol;
uniform mat4 uMoonMat, uRootInv;
varying vec3 vCol, vN, vP, vL; varying vec2 vK;
${yt}
${_o}
void main(){
  vec3 c0 = instanceMatrix[0].xyz, c1 = instanceMatrix[1].xyz, c2 = instanceMatrix[2].xyz;
  vec3 s2 = max(vec3(dot(c0, c0), dot(c1, c1), dot(c2, c2)), vec3(1e-6));
  vec3 n = normalize(mat3(instanceMatrix) * (normal / s2));
  vec3 p = (instanceMatrix * vec4(position, 1.)).xyz;
  vec3 camL = (uRootInv * vec4(cameraPosition, 1.)).xyz;
  float fl = fract(aFx.w);
  // the bays that face the street are dressed only as we come near: from the far end of the street (and through the portal before it) the Moon's face stands bare over the roofs
  if (aFx.w < .1) {   // poles never go thinner than about a pixel and a half
    float k = max(1., length(camL - p) * .0098);
    p += (c0 * position.x + c2 * position.z) * (k - 1.);
  }
  if (fl > .02 && fl < .06) p = mix(instanceMatrix[3].xyz, p, (1. - smoothstep(228., 300., length(camL - instanceMatrix[3].xyz))));
  #ifdef MOONSPACE
    vec3 pr = (uMoonMat * vec4(p, 1.)).xyz; n = normalize(mat3(uMoonMat) * n);
  #else
    p = cradle(p, n, instanceMatrix[3].xyz); vec3 pr = p;
  #endif
  vL = position * sqrt(s2); vCol = aCol; vN = n; vP = pr; vK = vec2(aFx.w, aFx.z);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Go=`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uRope, uChalk;
varying vec3 vCol, vN, vP, vL; varying vec2 vK;
${ct}
${tt}
void main(){
  vec3 n = normalize(vN);
  vec3 alb = vCol; float kind = vK.x; float ao = 1.;
  if (kind < .5) {
    alb *= .74 + .5 * vnoise(vL * vec3(26., 1.4, 26.) + vK.y * 40.);
    float nd = abs(fract(vL.y / 6. + .5) - .5) * 6.;
    float lash = 1. - smoothstep(.2, .26, nd);
    alb = mix(alb, uRope * (.7 + .3 * step(.5, fract(vL.y * 14. + vL.x * 9.))), lash);
  } else if (kind < 2.5) {
    float px = vL.x / .3; float gx = abs(fract(px) - .5);
    alb *= .7 + .55 * hash13(vec3(floor(px), vK.y * 91., 3.));
    alb *= .78 + .4 * vnoise(vL * vec3(24., 24., 1.3) + vK.y * 40.);
    alb *= 1. - .7 * smoothstep(.43, .5, gx);
    float dustK = smoothstep(.5, .8, vnoise(vec3(vL.x * 1.1, vK.y * 17., vL.z * 1.1))) * step(.5, n.y);
    alb = mix(alb, uChalk * .52, dustK * .5);
  } else if (kind > 3.5) {
    // old oak baulks (the keel cribs): grain along the length, rings and drying checks on the ends, arrises worn pale, chalk dust on top
    vec3 nL = normalize(cross(dFdx(vL), dFdy(vL)) + vec3(1e-6, 2e-6, 3e-6));
    vec3 an = abs(nL);
    float endF = step(.6, an.z), topF = step(.6, an.y), seedK = vK.y * 37.;
    float grain = vnoise(vec3(vL.x * 30. + seedK, vL.y * 30., vL.z * 1.2));
    float fig = .7 + .55 * grain * (.6 + .4 * vnoise(vec3(vL.x * 7., vL.y * 7., vL.z * .35 + seedK)));
    vec2 rc = vec2(vL.x - .4 - .14 * (fract(seedK * .37) - .5), vL.y - .12 * (fract(seedK * .73) - .5));
    float rr = length(rc);
    float rings = .58 + .42 * smoothstep(-.3, .3, sin(rr * 80. + 3. * vnoise(vec3(rc * 6., seedK))));
    float ang = (abs(rc.x) + abs(rc.y) < 1e-4) ? 0. : atan(rc.y, rc.x);
    float chk = smoothstep(.9, .97, vnoise(vec3(ang * 2.4 + seedK, rr * 1.5, 2.))) * smoothstep(.03, .16, rr);
    alb *= mix(fig, rings * (1. - .65 * chk) * .9, endF);
    alb *= 1. - .5 * smoothstep(.78, .9, vnoise(vec3(vL.x * 9. + seedK, vL.y * 9., vL.z * .45))) * (1. - endF);
    float ex = min(vL.x, .8 - vL.x), ey = .455 - abs(vL.y);
    float eg = topF > .5 ? ex : (endF > .5 ? min(ex, ey) : ey);
    if (kind < 4.5) alb = mix(alb, alb * 1.8 + .035, (1. - smoothstep(0., .07, eg)) * .55);
    float dust = topF * step(0., n.y) * smoothstep(.3, .6, vnoise(vec3(vL.x * 3. + seedK, 1., vL.z * 1.3)) + (kind > 4.5 ? .4 : 0.));
    alb = mix(alb, uChalk * .62, dust * .85);
    alb *= mix(1., .6 + .4 * smoothstep(-.45, .15, vL.y), (1. - topF) * step(kind, 4.5));
  } else {
    alb *= .8 + .4 * vnoise(vL * 2.5 + vK.y * 30.);
  }
  #ifndef MOONSPACE
    float dM = length(vP - uMoonC) - ${N.toFixed(1)};
    ao = mix(.5, 1., smoothstep(0., 12., dM));
  #endif
  gl_FragColor = vec4(lightIt(alb, n, vP, ao), 1.);
  #include <fog_fragment>
}`,Jo=`
#include <common>
#include <fog_pars_vertex>
attribute vec3 aCol, aPh;   // aPh: phase, amplitude (m), type (0 tarpaulin pinned top and bottom, 1 pennant)
uniform float uTime;
uniform mat4 uRootInv;
varying vec3 vCol, vN, vP; varying vec3 vUv;
${yt}
${_o}
vec3 flap(vec2 q){
  if (aPh.z < .5) {
    float pin = sin(3.14159 * q.y);
    float w = sin(q.y * 5. + q.x * 2.5 - uTime * (2.4 + aPh.x * .15) + aPh.x) * .5 + sin(q.x * 8. + q.y * 3. - uTime * 3.7 + aPh.x * 2.) * .22 + .45;
    return vec3(q.x, q.y, pin * aPh.y * w * (.55 + .45 * q.x));
  }
  float w = sin(q.x * 8. - uTime * 7.5 + aPh.x) + .4 * sin(q.x * 15. - uTime * 11. + aPh.x * 3.);
  return vec3(q.x, q.y + w * .1 * q.x - q.x * q.x * .18, w * aPh.y * q.x);
}
void main(){
  vec2 q = position.xy;
  vec3 a = (instanceMatrix * vec4(flap(q), 1.)).xyz;
  vec3 b = (instanceMatrix * vec4(flap(q + vec2(.04, 0.)), 1.)).xyz;
  vec3 c = (instanceMatrix * vec4(flap(q + vec2(0., .04)), 1.)).xyz;
  vec3 n = normalize(cross(b - a, c - a) + vec3(0., 1e-6, 0.));
  float fl = fract(aFx.w);
  if (fl > .02 && fl < .06) a = mix(instanceMatrix[3].xyz, a, (1. - smoothstep(228., 300., length((uRootInv * vec4(cameraPosition, 1.)).xyz - instanceMatrix[3].xyz))));
  vec3 p = cradle(a, n, instanceMatrix[3].xyz);
  vCol = aCol; vN = n; vP = p; vUv = vec3(uv, aFx.z + aPh.z * 2.);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ea=`
#include <common>
#include <fog_pars_fragment>
varying vec3 vCol, vN, vP; varying vec3 vUv;
${ct}
${tt}
void main(){
  vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;
  float rnd = fract(vUv.z); vec2 uv = vUv.xy;
  vec3 alb = vCol * (.88 + .16 * vnoise(vec3(uv * 46., rnd * 9.)));
  if (vUv.z < 1.5) {
    vec2 pu = uv * vec2(3., 2.4) + rnd * 7.; vec2 pc = floor(pu), pf = fract(pu);
    float ph = hash13(vec3(pc, rnd * 31.));
    float edge = min(min(pf.x, 1. - pf.x), min(pf.y, 1. - pf.y));
    if (ph > .7) { alb = alb * vec3(.74, .72, .7) + vec3(.06, .05, .03) * ph; alb *= .72 + .28 * smoothstep(.02, .06, edge) + .2 * step(edge, .09) * step(.5, fract((pf.x + pf.y) * 24.)); }
    alb *= mix(.68, 1., smoothstep(0., .4, uv.y)) * (.85 + .15 * smoothstep(.5, .46, abs(uv.x - .5)));
    alb *= .9 + .1 * step(.03, abs(fract(uv.x * 3.) - .5));
  }
  float ao = mix(.6, 1., smoothstep(0., 12., length(vP - uMoonC) - ${N.toFixed(1)}));
  vec3 col = lightIt(alb, n, vP, ao) + alb * uSunCol * max(dot(-n, uSunDir), 0.) * .42 * moonShadow(vP);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,ta=`
#include <common>
#include <fog_pars_vertex>
attribute vec3 aA, aB;
attribute vec4 aR;    // mooring: release u, sag (m), width (m), 0     hoist: sector azimuth, release u, width, 1 or -1 (run direction)
attribute vec2 aK;    // cure c1, a mooring's whip: its size as a share of the first version's (1), and how far to one side its swing is centred, in whole reaches (0); set by the law at the end of buildHero. m4: a size below 0 is the law's last resort, the rope is not drawn at all, at any frame
uniform mat4 uMoonMat, uRootInv;
uniform float uTime;
varying vec3 vP; varying vec3 vUv;
${yt}
vec3 ropeAt(float s, vec3 A, vec3 B){
  vec3 ab = B - A; float L = max(length(ab), 1e-3);
  if (abs(aR.w) > .5) return A + ab * s;
  float taut = smoothstep(aR.x - .03, aR.x, uProg);
  vec3 p = A + ab * s; p.y -= aR.y * 4. * s * (1. - s) * (1. - taut * .92);
  float t = max(uProg - aR.x, 0.) * uSecs;
  if (aK.x < 0.) return aR.z < .32 ? B : A;      // m4, the law's last resort, taken at every frame of the flight, before the rope's moment and after: every station at the end the rope would keep, so its ribbon has no area; no other rope takes this line
  if (t > 0.) {
    vec3 d0 = ab / L;
    float e = 1. - exp(-t * .7) * cos(t * 1.4);
    bool fromB = aR.z < .32;
    float q = fromB ? 1. - s : s;
    vec3 d1 = fromB ? -d0 : d0;
    vec3 dir = normalize(mix(d1, vec3(0., -1., 0.), clamp(e * (.55 + .4 * q), 0., 1.12)) + vec3(1e-4, 0., 0.));
    vec3 side = normalize(cross(d0, vec3(0., 1., 0.)) + vec3(1e-4));
    float amp = 4.5 * exp(-t * .28) * q;
    if (!fromB) { float haul = 1. - smoothstep(.795, .85, uProg); L *= haul; amp *= haul; }      // the belly ropes are hauled up as the Moon gathers way
    p = (fromB ? B : A) + dir * L * q + side * sin(q * 7. - t * 1.4 - uTime * 1.6) * amp + d1 * sin(q * 5. - t * 1.1 - uTime * 1.1) * amp * .4;
    p += (side * (aK.y + (aK.x - 1.) * sin(q * 7. - t * 1.4 - uTime * 1.6)) + d1 * ((aK.x - 1.) * sin(q * 5. - t * 1.1 - uTime * 1.1) * .4)) * amp;      // cure c1: with aK = (1, 0) this adds nothing; else the two sines above are sized by aK.x and the swing is centred aK.y reaches to the side
    p.y = max(p.y, .25);
  }
  return p;
}
void main(){
  float s = position.x;
  vec3 A = aA, B = aB;
  if (abs(aR.w) < .5) A = (uMoonMat * vec4(aA, 1.)).xyz;
  vec3 p = ropeAt(s, A, B);
  vec3 tg = ropeAt(s + .012, A, B) - ropeAt(s - .012, A, B);
  vec3 nn = vec3(0., 1., 0.);
  if (abs(aR.w) > .5) { vec3 p1 = leanSector(p + tg, nn, aR.x, aR.y); p = leanSector(p, nn, aR.x, aR.y); tg = p1 - p; }
  vec3 camL = (uRootInv * vec4(cameraPosition, 1.)).xyz;
  vec3 tc = camL - p; float dist = length(tc);
  vec3 sd = normalize(cross(tg, tc) + vec3(1e-5, 2e-5, 0.));
  p += sd * position.y * max(aR.z, dist * .0017) * .5;
  vP = p; vUv = vec3(s * length(B - A), position.y, aR.w);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,oa=`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uRope; uniform float uTime;
varying vec3 vP; varying vec3 vUv;
${tt}
void main(){
  float c = sqrt(max(1. - vUv.y * vUv.y, 0.));
  float run = vUv.z * uTime * 1.1;
  float tw = step(.5, fract(vUv.x * 2.2 + vUv.y * .4 - run));
  vec3 alb = uRope * (.62 + .38 * tw);
  vec3 col = alb * (uSunCol * .6 * moonShadow(vP) + uSkyCol * .85 + uGndCol * .4) * (.45 + .55 * c);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,Uo=`
attribute vec4 aH;    // foot x, foot z, hoist height, phase
attribute vec4 aH2;   // sector azimuth, release u, rope speed m/s, random
uniform float uTime;
vec4 hoistAt(out float fade){
  float cyc = fract(uTime * aH2.z / (2. * aH.z) + aH.w) * 2.;
  float up = step(cyc, 1.);
  float f = fract(cyc);
  fade = smoothstep(0., .02, f) * smoothstep(1., .98, f);
  float y = (up > .5 ? cyc : 2. - cyc) * aH.z;
  vec2 o = aH.xy / max(length(aH.xy), 1e-3);
  vec2 tg = vec2(o.y, -o.x);
  vec2 xz = aH.xy + tg * (up > .5 ? -.8 : .8) + tg * sin(uTime * 1.7 + aH.w * 40.) * .1 + o * sin(uTime * 1.3 + aH.w * 23.) * .07;
  return vec4(xz.x, y, xz.y, up);
}
`,aa=`
#include <common>
#include <fog_pars_vertex>
varying vec3 vN, vP, vUv;
${yt}
${Uo}
void main(){
  float fade; vec4 h = hoistAt(fade);
  float a = aH2.w * 6.283 + sin(uTime * .9 + aH.w * 17.) * .5; float c = cos(a), s = sin(a);
  vec3 lp = position * fade; lp = vec3(c * lp.x + s * lp.z, lp.y, -s * lp.x + c * lp.z);
  vec3 n = vec3(c * normal.x + s * normal.z, normal.y, -s * normal.x + c * normal.z);
  vec3 p = leanSector(h.xyz + lp, n, aH2.x, aH2.y);
  vN = n; vP = p; vUv = vec3(uv, h.w);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,sa=`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uGlow; uniform float uTime;
varying vec3 vN, vP, vUv;
${ct}
${tt}
void main(){
  vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;
  vec3 col;
  if (vUv.x < .5) {
    float band = step(.86, vUv.y) + step(abs(vUv.y - .12), .04) + step(abs(vUv.y - .5), .025);
    vec3 alb = vec3(.47, .52, .57) * (.82 + .3 * vnoise(vP * 9.)) * (1. - .28 * min(band, 1.));
    col = lightIt(alb, n, vP, 1.);
    col += uGlow * .9 * vUv.z * smoothstep(.72, 1., vUv.y);      // the light spills over the brim
  } else if (vUv.x < 1.5) {
    float sl = .8 + .35 * vnoise(vec3(vP.xz * 5., uTime * 1.6));
    col = mix(vec3(.03, .04, .05), uGlow * 3.4 * sl, vUv.z);
  } else col = lightIt(vec3(.12, .11, .1), n, vP, 1.);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,na=`
#include <common>
#include <fog_pars_vertex>
varying vec3 vUv;
${yt}
${Uo}
void main(){
  float fade; vec4 h = hoistAt(fade);
  vec3 n = vec3(0., 1., 0.);
  vec3 p = leanSector(h.xyz + vec3(0., -.8, 0.), n, aH2.x, aH2.y);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  mvPosition.xy += position.xy * 5.2 * fade;
  vUv = vec3(position.xy * 2., h.w * fade);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ra=`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uGlow;
varying vec3 vUv;
void main(){
  float r2 = dot(vUv.xy, vUv.xy);
  float a = exp(-r2 * 7.) * .5 + exp(-r2 * 40.) * .5;
  a *= 1. - smoothstep(.7, 1., r2);
  vec3 col = uGlow * a * .62 * vUv.z;
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      col *= exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      col *= 1. - smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #endif
  gl_FragColor = vec4(col, 1.);
}`,ia=`
#include <common>
#include <fog_pars_vertex>
attribute vec4 aD;    // x, top y, z, phase
attribute vec3 aD2;   // fall range, speed, size
uniform float uTime;
varying vec3 vP, vUv;
void main(){
  float f = fract(uTime * aD2.y / max(aD2.x, .1) + aD.w);
  vec3 p = aD.xyz; p.y -= f * aD2.x;
  p.xz += vec2(sin(uTime * .7 + aD.w * 30.), cos(uTime * .5 + aD.w * 50.)) * .4;
  p.z += f * 2.2;
  p.y = max(p.y, .1);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  float dz = max(-mvPosition.z, .1);
  mvPosition.xy += position.xy * vec2(1., 3.2) * min(aD2.z, dz * .0085);
  vP = p; vUv = vec3(position.xy * 2., smoothstep(0., .12, f) * smoothstep(1., .7, f) * smoothstep(2.5, 8., dz));
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,la=`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uChalk;
varying vec3 vP, vUv;
${tt}
void main(){
  float r2 = dot(vUv.xy, vUv.xy);
  float a = (1. - smoothstep(.1, 1., r2)) * vUv.z * .5;
  vec3 col = uChalk * (uSunCol * 1.1 * moonShadow(vP) + uSkyCol * .7);
  gl_FragColor = vec4(col, a);
  #include <fog_fragment>
}`;function ca(r,v){const f=Qe(.5,1,r),g=f+.1*Math.sin(f*18.85)*(1-f)*f;return(r<1?-.17+(.05+.17)*g:.05*Math.exp(-(r-1)*5)*(1-Qe(1.2,1.5,r)))+v*.07*Math.exp(-r*r*28)}function Oo(r,v,f,g,T,L){const _=v/L,H=f/L,$=g/L,b=Math.floor(_-.5),S=Math.floor(H-.5),U=Math.floor($-.5);let V=0;for(let F=0;F<8;F++){const re=b+(F&1),O=S+(F>>1&1),Q=U+(F>>2&1),W=(re%8+8)%8,B=(O%8+8)%8,X=(((Q%8+8)%8+T)*64+W+8*B)*4,ie=.16+.17*r[X+3]/255,de=_-(re+r[X]/255),le=H-(O+r[X+1]/255),ee=$-(Q+r[X+2]/255),Xe=Math.sqrt(de*de+le*le+ee*ee)/ie;Xe<1.5&&(V+=ca(Xe,r[X+3]>=128?1:0)*ie*L)}return V}function He(r,v){return r?r.isVector3||r.isColor?v.copy(r):v.set(r[0],r[1],r[2]):v}function Ae(r,v,f,g){r.setAttribute(v,new h.InstancedBufferAttribute(f,g))}function ha(r,v,f,g,T,L,_,H){const $=Math.max(.9/T,.02),b=Math.cos(_),S=Math.sin(_),U=1/H,V=Math.ceil(T*1.3*H)+1,F=Math.floor(f),re=Math.floor(g);for(let O=re-V;O<=re+V;O++){const Q=O+.5-g,W=(O&v-1)*v;for(let B=F-V;B<=F+V;B++){const q=B+.5-f,X=(b*q+S*Q)*U,ie=(b*Q-S*q)*H,de=Math.sqrt(X*X+ie*ie)/T;if(de>=1.3)continue;const le=Q/(Math.sqrt(q*q+Q*Q)||1),ee=Math.min(1,Math.max(0,(de-.45)/.45)),Xe=ee*ee,Gt=Math.min(1,Math.max(0,(de-1+$)/(2*$))),ke=-(.3+.25*Xe)-.45*Xe*le,be=(1.3-de)/.3*(.55+.4*le),Te=W+(B&v-1);r[Te]+=((ke+(be-ke)*Gt)*L-r[Te])*Math.min(1,(1.3-de)/.18)}}}function fa(r){let v=0;for(let g=0;g<r.length;g++)v+=r[g];v/=r.length;const f=new Uint8Array(r.length);for(let g=0;g<r.length;g++)f[g]=Math.max(0,Math.min(255,Math.round(128+(r[g]-v)*100)));return f}function ua(r,v,f=-Math.PI/2,g=Math.PI/2,T=0,L=ue,_=!0,H=N){const $=W=>1+(_?1.5*Qe(-1.25,-.9,W)*(1-Qe(-.2,.1,W)):0),b=[0],S=400;for(let W=1;W<=S;W++)b.push(b[W-1]+$(f+(g-f)*(W-.5)/S));const U=[];for(let W=0,B=0;W<=v;W++){const q=b[S]*W/v;for(;B<S-1&&b[B+1]<q;)B++;U.push(f+(g-f)*(B+(q-b[B])/Math.max(b[B+1]-b[B],1e-6))/S)}const V=Math.abs(L-T-ue)<1e-6,F=V?r:r+1,re=new Float32Array((v+1)*F*3);for(let W=0,B=0;W<=v;W++){const q=Math.cos(U[W]),X=Math.sin(U[W]);for(let ie=0;ie<F;ie++){const de=T+(L-T)*ie/r;re[B++]=Math.sin(de)*q*H,re[B++]=X*H,re[B++]=Math.cos(de)*q*H}}const O=new Uint32Array(v*r*6);for(let W=0,B=0;W<v;W++)for(let q=0;q<r;q++){const X=W*F+q,ie=W*F+(q+1)%F,de=X+F,le=ie+F;O[B++]=X,O[B++]=ie,O[B++]=de,O[B++]=ie,O[B++]=le,O[B++]=de}const Q=new h.BufferGeometry;return Q.setAttribute("position",new h.BufferAttribute(re,3)),Q.setIndex(new h.BufferAttribute(O,1)),Q}function Do(){const r=new h.CylinderGeometry(.078,.095,1,5,1,!0);return r.translate(0,.5,0),r}function gt(r,v,f,g,T,L){const _=new h.BoxGeometry(v-r,g-f,L-T);return _.translate((r+v)/2,(f+g)/2,(T+L)/2),_}function da(r){const v=new h.IcosahedronGeometry(1,0),f=v.attributes.position,g=new Map;for(let T=0;T<f.count;T++){const L=Math.round(f.getX(T)*10)+":"+Math.round(f.getY(T)*10)+":"+Math.round(f.getZ(T)*10);g.has(L)||g.set(L,[.62+r()*.7,(r()-.5)*.3,(r()-.5)*.3]);const _=g.get(L);f.setXYZ(T,f.getX(T)*_[0]+_[1],f.getY(T)*_[0]*.62,f.getZ(T)*_[0]+_[2])}return v.computeVertexNormals(),v}function va(){const r=gt(-.32,.32,-.32,.32,-.05,.07),v=new h.TorusGeometry(.16,.05,3,3,Math.PI);v.rotateY(Math.PI/2),v.rotateX(-Math.PI/2),v.translate(0,0,.07);const f=new h.TorusGeometry(.36,.06,3,7);f.rotateY(.5),f.translate(0,-.34,.2);const g=[r,v,f].map(L=>L.toNonIndexed()),T=qo(g);return g.forEach(L=>L.dispose()),r.dispose(),v.dispose(),f.dispose(),T}function ma(){const r=[gt(-.3,-.22,0,6.6,-.04,.04),gt(.22,.3,0,6.6,-.04,.04)];for(let f=0;f<6;f++)r.push(gt(-.24,.24,.7+f*1,.76+f*1,-.03,.03));const v=qo(r);return r.forEach(f=>f.dispose()),v}function pa(){const v=[],f=[],g=[],T=[],L=[[.34,-2,0],[.47,-.86,.9],[.52,-.8,1]];for(let b=0;b<L.length;b++)for(let S=0;S<=8;S++){const U=S/8*ue;v.push(Math.sin(U)*L[b][0],L[b][1],Math.cos(U)*L[b][0]),f.push(Math.sin(U)*.98,.12,Math.cos(U)*.98),g.push(0,L[b][2])}for(let b=0;b<L.length-1;b++)for(let S=0;S<8;S++){const U=b*9+S,V=U+1,F=U+8+1,re=F+1;T.push(U,V,F,V,re,F)}let _=v.length/3;for(const[b,S,U,V]of[[.34,-2,0,-1],[.45,-.92,1,1]]){v.push(0,S,0),f.push(0,V,0),g.push(U,.5);for(let F=0;F<=8;F++){const re=F/8*ue;v.push(Math.sin(re)*b,S,Math.cos(re)*b),f.push(0,V,0),g.push(U,.5)}for(let F=0;F<8;F++)V>0?T.push(_,_+1+F,_+2+F):T.push(_,_+2+F,_+1+F);_=v.length/3}const H=6;for(let b=0;b<=H;b++){const S=b/H*Math.PI,U=Math.cos(S)*.5,V=-.82+Math.sin(S)*.82;if(v.push(U,V,-.035,U,V,.035),f.push(Math.cos(S),Math.sin(S),0,Math.cos(S),Math.sin(S),0),g.push(2,0,2,1),b<H){const F=_+b*2;T.push(F,F+1,F+2,F+1,F+3,F+2)}}const $=new h.BufferGeometry;return $.setAttribute("position",new h.Float32BufferAttribute(v,3)),$.setAttribute("normal",new h.Float32BufferAttribute(f,3)),$.setAttribute("uv",new h.Float32BufferAttribute(g,2)),$.setIndex(T),$}function Ho(r,v,f){const g=[],T=[],L=[];for(let H=0;H<=v;H++)for(let $=0;$<=r;$++){const b=$/r,S=H/v;g.push(b,f?(S-.5)*(1-b*.9):S,0),T.push(b,S)}for(let H=0;H<v;H++)for(let $=0;$<r;$++){const b=H*(r+1)+$,S=b+1,U=b+r+1,V=U+1;L.push(b,S,U,S,V,U)}const _=new h.BufferGeometry;return _.setAttribute("position",new h.Float32BufferAttribute(g,3)),_.setAttribute("uv",new h.Float32BufferAttribute(T,2)),_.setIndex(L),_}function Ee(){const r=[],v=[],f=[],g=new h.Vector3,T=new h.Vector3,L=new h.Vector3,_=new h.Matrix4;return{count:()=>f.length/4,add(H,$,b,S,U,V){_.makeBasis(g.copy($),T.copy(b),L.copy(S)).setPosition(H);for(let F=0;F<16;F++)r.push(_.elements[F]);v.push(U[0],U[1],U[2]),f.push(V[0],V[1],V[2],V[3])},build(H,$){const b=f.length/4,S=new h.InstancedMesh(H,$,Math.max(b,1));return S.count=b,S.instanceMatrix.array.set(r),S.instanceMatrix.needsUpdate=!0,Ae(H,"aCol",new Float32Array(b?v:[0,0,0]),3),Ae(H,"aFx",new Float32Array(b?f:[0,9,0,3]),4),S.frustumCulled=!1,S.matrixAutoUpdate=!1,S}}}const xa=r=>{const v=Vt(r);return v*v*v*(v*(v*6-15)+10)},Eo=(r,v)=>2*Math.PI/180*v*Math.max(r-.7,0)*xa((r-.68)/.08),Jt=(r,v=43)=>{const f=Math.max(r-.74,0)*v,g=4.6,T=25,L=T/g;return f<L?.5*g*f*f:.5*g*L*L+T*(f-L)},ya=10;async function za(r,v={}){const f=r.rng.fork?r.rng.fork("moon-in-dry-dock"):r.rng,g=Math.min(1,Math.max(.6,v.detail??r.quality?.detail??1)),T=(v.palette&&v.palette.length>=7?v.palette:Zo).map(e=>new h.Color(e)),[L,_,H,$,b,S,U]=T,V=(e,t=1)=>[e.r*t,e.g*t,e.b*t],F=v.job||(f.chance(.72)?"third":"half"),re=v.journeySeconds||43,O=new h.Group;O.name="moon-in-dry-dock";const Q=new h.Group;Q.position.set(0,Y,0),O.add(Q);const W=[[450,37,20],[350,37,20],[200,64,26],[140,86,12],[120,90,-10],[81,75,-81],[0,60,-107],[-60,32,-80],[-25,18,0],[0,18,62],[0,18,112],[0,18,165]],B=Xo(W,{samples:600}),q=[];{const e=new h.Vector3,t=Math.ceil(B.length/1.5);for(let a=0;a<=t;a++)B.pointAt(a/t,e),e.x*e.x+e.z*e.z<30625&&q.push(e.x,e.y,e.z)}const X=(e,t,a)=>{let s=1e12;for(let n=0;n<q.length;n+=3){const i=q[n]-e,l=q[n+1]-t,u=q[n+2]-a,o=i*i+l*l+u*u;o<s&&(s=o)}return Math.sqrt(s)};await r.yield?.();const ie=6.3,de=He(v.sunDir,new h.Vector3(.861,.454,-.231)).normalize(),le=H.clone();{const e=Math.max(le.r,le.g,le.b);le.multiplyScalar(1/e)}const ee={uSunDir:{value:de},uMirTip:{value:.26},uMirSun:{value:new h.Vector3(-.78,.31,-.545).normalize()},uSunCol:{value:new h.Color("#FFE9C4").multiplyScalar(1.22)},uSkyCol:{value:new h.Color("#7F9CC4").multiplyScalar(.62)},uGndCol:{value:L.clone().multiplyScalar(.2)},uZen:{value:b.clone().multiplyScalar(.9)},uHor:{value:b.clone().lerp(new h.Color("#EAF2F8"),.72)},uMoonC:{value:new h.Vector3(0,Y,0)},uMoonMat:{value:new h.Matrix4},uRootInv:{value:new h.Matrix4},uTime:{value:0},uProg:{value:0},uSecs:{value:re},uOpen:{value:0},uChalk:{value:le},uSilver:{value:$.clone().lerp(new h.Color("#dfe8f2"),.4)},uOchre:{value:L},uTerra:{value:_},uSea:{value:b.clone().multiplyScalar(.8)},uGlow:{value:U},uRope:{value:new h.Color(.4,.31,.19)},uSelf:{value:new h.Color(0,0,0)},uStruck:{value:new h.Vector2(Be[0],Be[1])},uGap:{value:new h.Vector2(et[0],et[1])}},Xe=h.UniformsLib.fog,Gt=[],ke=(e,t,a={},s={})=>{const n=new h.ShaderMaterial({vertexShader:e,fragmentShader:t,fog:!0,uniforms:{...h.UniformsUtils.clone(Xe),...ee,...a},...s});return Gt.push(n),n},be=new Uint8Array(1024*4);for(let e=0;e<be.length;e+=4){be[e]=f.int(0,255),be[e+1]=f.int(0,255),be[e+2]=f.int(0,255);const t=f();be[e+3]=Math.floor(255*t*t*(e<512*4?1:.95)+12)}const Te=new h.DataTexture(be,64,16,h.RGBAFormat,h.UnsignedByteType);Te.minFilter=Te.magFilter=h.NearestFilter,Te.generateMipmaps=!1,Te.colorSpace=h.NoColorSpace,Te.needsUpdate=!0,ee.uCrTab={value:Te},await r.yield?.();const Ke=1024,eo=new Float32Array(Ke*Ke);{const e=To("moon-pits:"+r.seed);for(let t=0;t<500;t++){const a=e()*Ke,s=e()*Ke,n=e(),i=e(),l=e()*Math.PI,u=e();ha(eo,Ke,a,s,Ke*.005*Math.pow(12,n*n*n*n),.55+.45*i,l,1+.11*u),t%32===31&&await r.yield?.()}}await r.yield?.();const Le=new h.DataTexture(fa(eo),Ke,Ke,h.RedFormat,h.UnsignedByteType);Le.wrapS=Le.wrapT=h.RepeatWrapping,Le.minFilter=h.LinearMipmapLinearFilter,Le.magFilter=h.LinearFilter,Le.generateMipmaps=!0,Le.anisotropy=8,Le.colorSpace=h.NoColorSpace,Le.needsUpdate=!0,ee.uPits={value:Le},await r.yield?.();const Ko=139.5+f.range(-3,3)/4,ht=(F==="half"?90:60)*Math.PI/180,bt=Ce(Ko*Math.PI/180+ht),to={value:new h.Vector3(bt,ht,0)},Ut=(e,t,a)=>{const s=N*Math.sqrt(Math.max(1-t*t,0));return Math.max((Math.abs(Ce(Math.atan2(e,a)-bt))-ht+je-(je+Zt)*Qe(-.42,.02,t))*s,(Lo-Math.asin(Math.max(-1,Math.min(1,t))))*N)},ft=(e,t,a)=>{const s=Oo(be,e*N,t*N,a*N,0,pt)+Oo(be,e*N,t*N,a*N,8,xt);return N+s*Qe(-7,1.5,Ut(e,t,a))},oo={uLuneLat:{value:Lo},uRad:{value:N},uMode:{value:0},uLune:to,uSurveyY:{value:-44+f.range(-3,3)},uSeedV:{value:new h.Vector3(f.range(0,40),f.range(0,40),f.range(0,40))}};await r.yield?.();const Io=ke(Ro,Bo,oo),ao=new h.Mesh(ua(220,98),Io);ao.frustumCulled=!1,Q.add(ao),await r.yield?.();const so=ke(Vo,Go,{},{defines:{MOONSPACE:1}}),k=new h.Vector3,wt=new h.Vector3,qe=new h.Vector3,Mt=new h.Vector3,No=new h.Vector3(0,1,0),Ot=(e,t,a)=>a.set(Math.sin(e)*Math.cos(t),Math.sin(t),Math.cos(e)*Math.cos(t));{const e=f.fork?f.fork("stones"):f,t=Ee(),a=Math.round(540*g),s=bt-ht+je;for(let n=0,i=0;n<a&&i<a*6;i++){const l=e();let u,o;if(l<.62?(u=s-e.range(.03,1.1),o=Math.asin((e.range(50,100)-Y)/N)):l<.8?(u=e.range(0,ue),o=-Math.PI/2+Math.sqrt(e())*.62):(u=e.range(0,ue),o=Math.asin(e.range(-1,1))),Ot(u,o,k),Ut(k.x,k.y,k.z)<11)continue;const c=ft(k.x,k.y,k.z),d=.09+Math.pow(e(),3)*.42;wt.copy(k).multiplyScalar(c+d*e.range(-.15,.2)),qe.set(e()-.5,e()-.5,e()-.5).cross(k).normalize(),Mt.crossVectors(qe,k);const y=e.chance(.13),x=y?e.range(.1,.16):e.range(.42,.58),z=y?[x,x,x*1.12]:[le.r*x,le.g*x,le.b*x];t.add(wt,qe.multiplyScalar(d*e.range(.8,1.5)),k.clone().multiplyScalar(d*e.range(.6,1)),Mt.multiplyScalar(d),z,[0,9,e(),3]),n++}await r.yield?.(),Q.add(t.build(da(e),so))}await r.yield?.();const Ie=[],Ne=[],we=[],zt=[];{const e=f.fork?f.fork("bolts"):f,t=Ee(),a=(n,i)=>{wt.copy(n).multiplyScalar(i+.02),qe.copy(No).addScaledVector(n,-n.y).normalize(),Mt.crossVectors(qe,n);const l=e.range(.1,.17);t.add(wt,Mt.clone(),qe.clone(),n.clone(),[l*1.1,l,l*.9],[0,9,e(),3])},s=[];for(let n=0;n<40;n++)for(let i=0;i<10;i++){const l=(n+e.range(-.3,.3)+i*.37)/40*ue,u=e.range(-.2,.13);Ot(l,u,k);const o=ft(k.x,k.y,k.z),c=Math.sin(l),d=Math.cos(l),y=e.pick([12,18,24,30,30]),x=1.2*(y/6-1)+.6,z=Math.min((136+x)/Math.max(Math.abs(c),.001),((d>0?154:140)+x)/Math.max(Math.abs(d),.001));let w=c*z,M=d*z;M>150&&Math.abs(w)<22&&(w=w<0?-22:22);const R=k.x*(o+.3),ne=k.y*(o+.3)+Y,p=k.z*(o+.3);let K=!0;const C=e.range(2,5);for(let j=0;j<=20&&K;j++){const I=j/20;X(R+(w-R)*I,ne+(y-ne)*I-C*4*I*(1-I),p+(M-p)*I)<9&&(K=!1)}if(K){s.push({az:l,a:[k.x*(o+.3),k.y*(o+.3),k.z*(o+.3)],b:[w,y,M],sag:C}),a(k,o);break}}s.sort((n,i)=>Math.abs(Ce(n.az-Be[0]))-Math.abs(Ce(i.az-Be[0]))),s.forEach((n,i)=>{Ie.push(...n.a),Ne.push(...n.b),we.push(.62+.12*i/Math.max(s.length-1,1),n.sag,.3,0),zt.push({position:new h.Vector3(...n.b)})});{const n=new h.Vector3,i=new h.Vector3;for(let l=0;l<9;l++){const u=.748+l*.0125,o=u-.088+.006*(l%3),c=l%2===0?[-27,-31,-35,-23,-39,11,13.5,16]:[10.5,13,16,19,-27,-33];B.pointAt(u,n),B.pointAt(u+.004,i),i.sub(n),i.y=0,i.normalize();for(let d=0;d<c.length;d++){const y=c[d],x=n.x+i.z*y+i.x*4,z=n.z-i.x*y+i.z*4-Jt(u),w=-Eo(u,re),M=x*Math.cos(w)+z*Math.sin(w),R=-x*Math.sin(w)+z*Math.cos(w),ne=M*M+R*R;if(ne>7056||ne<81)continue;{let A=!1;for(let P=.72;P<u-.012&&!A;P+=.01){B.pointAt(P,qe);const he=z+Jt(P),me=Math.atan2(x-qe.x,he-qe.z),ze=Math.atan2(0-qe.x,165-qe.z);Math.abs(Ce(me-ze))<.06&&(A=!0)}if(A)continue}k.set(M,-Math.sqrt(N*N-ne),R).normalize();const p=ft(k.x,k.y,k.z),K=Math.sqrt(ne),C=k.x*(p+.3),j=k.y*(p+.3),I=k.z*(p+.3),ce=7+2*(l%3),Z=M+M/K*ce,te=R+R/K*ce;let D=!0;for(let A=0;A<=12&&D;A++){const P=A/12;X(C+(Z-C)*P,j+Y+(.4-j-Y)*P,I+(te-I)*P)<8.5&&(D=!1)}if(D){Ie.push(C,j,I),Ne.push(Z,.4,te),we.push(o,1.2,.46,0),zt.push({position:new h.Vector3(Z,0,te)}),a(k,p);break}}}}for(const[n,i,l]of[[-28.5,11,.728],[-37,-8,.716]]){const u=n*n+i*i,o=Math.sqrt(u);k.set(n,-Math.sqrt(N*N-u),i).normalize();const c=ft(k.x,k.y,k.z);Ie.push(k.x*(c+.3),k.y*(c+.3),k.z*(c+.3)),Ne.push(n+n/o*6,.4,i+i/o*6),we.push(l,1,.31,0),zt.push({position:new h.Vector3(n+n/o*6,0,i+i/o*6)}),a(k,c)}for(let n=0,i=0;n<70&&i<600;i++)Ot(e.range(0,ue),Math.asin(e.range(-.95,.5)),k),!(Ut(k.x,k.y,k.z)<3)&&(a(k,ft(k.x,k.y,k.z)),n++);Q.add(t.build(va(),so))}await r.yield?.();const ut=ke(Vo,Go),kt=Ee(),Pt=Ee(),Dt=Ee(),m=f.fork?f.fork("scaffold"):f,no=(e,t)=>Math.abs(Ce(e-t[0]))<t[1],Ve=e=>!no(e,Be)&&!no(e,et),ro=ue/16,St=e=>Math.round(e/ro)*ro,Ht=e=>.62+.13*Math.pow(Math.abs(Ce(St(e)-Be[0]))/Math.PI,.8),We=(e,t)=>[St(e),Ht(e),m(),t],Ze=(e,t)=>Math.abs(Ce(e-Math.PI/2))<.46&&t>=46?.04:0,io=e=>Math.sqrt(Math.max(N*N-(e-Y)*(e-Y),0)),ot=()=>{const e=m.range(.8,1.2),t=m.range(0,.25);return[(.4-.1*t)*e,(.28-.02*t)*e,(.16+.06*t)*e]},lo=()=>{const e=m.range(.82,1.18);return[.47*e,.385*e,.26*e]},ye=new h.Vector3,ga=new h.Vector3,ae=new h.Vector3,se=new h.Vector3,Me=new h.Vector3,Ft=(e,t,a,s,n,i,l,u,o,c=kt)=>{ye.set(e,t,a),se.set(s-e,n-t,i-a),!(se.length()<.3)&&(ae.set(se.z,0,-se.x),ae.lengthSq()<1e-6&&ae.set(1,0,0),ae.normalize(),Me.crossVectors(ae,se).normalize(),c.add(ye,ae.multiplyScalar(l),se,Me.multiplyScalar(l),u,o))},dt=(e,t,a,s,n,i,l=3,u=ie)=>{for(let o=0;o<=l;o++){const c=o/l;if(X(e+(s-e)*c,t+(n-t)*c,a+(i-a)*c)<u)return!1}return!0},Ct=[];for(let e=1;e<=Yo;e++){const t=e*Bt,a=Math.max(io(t),io(t+2.4))+1;if(a<36)continue;const s=Math.floor((Fe-(a+2.6))/Re);Ct.push({k:e,y:t,e:a,j:s,out:Fe-Re*s})}const co=16,Ye=new Float32Array(co);Ye[0]=Y+1.4;for(const e of Ct)Ye[e.j]=Math.max(Ye[e.j],e.y+1.2),e.j+1<6&&Fe-Re*(e.j+1)>=e.e+.2&&(Ye[e.j+1]=Math.max(Ye[e.j+1],e.y));const At=[];for(let e=0;e<Je;e++){e%4===0&&await r.yield?.();const t=e*G;if(!Ve(t))continue;const a=Math.sin(t),s=Math.cos(t),n=-s,i=a;for(const o of Ct){const c=o.out-o.e,d=(o.out+o.e)/2,y=G*d*1.015;for(const[C,j]of[[-.5,.5]]){const I=(ce,Z)=>{let te=!0;for(let A=0;A<3&&te;A++)for(let P=0;P<3&&te;P++){const he=o.e+c*A/2,me=(ce+(Z-ce)*P/2)*y;X(a*he+n*me,o.y,s*he+i*me)<ie&&(te=!1)}if(!te)return!1;const D=(ce+Z)/2*y;return ye.set(a*o.e+n*D,o.y,s*o.e+i*D),Dt.add(ye,ae.set(a*c,0,s*c),se.set(0,1,0),Me.set(n*y*(Z-ce),0,i*y*(Z-ce)),lo(),We(t,1+Ze(t,o.y))),At.push({az:t,y:o.y,e:o.e,out:o.out,k:o.k,x:a*d+n*D,z:s*d+i*D}),!0};I(C,j)||(I(-.5,0),I(0,.5))}const x=t-G/2,z=t+G/2,w=o.out,M=Math.sin(x)*w,R=Math.cos(x)*w,ne=Math.sin(z)*w,p=Math.cos(z)*w,K=X(a*w,o.y,s*w)<45;(o.k>=9||K)&&(K||m()<.4+.6*g)&&dt(M,o.y+1.05,R,ne,o.y+1.05,p)&&Ft(M,o.y+1.05+m.range(-.06,.06),R,ne,o.y+1.05+m.range(-.06,.06),p,.8,ot(),We(t,Ze(t,o.y)),K?kt:Pt)}const l=t-G/2,u=t+G/2;for(let o=0;o<2;o++){const c=Fe-o*Re,d=Math.sin(l)*c,y=Math.cos(l)*c,x=Math.sin(u)*c,z=Math.cos(u)*c;for(let w=o===0?1:22;w<=22;w++){const M=w===22?Y+1.1:w*Bt+.1;dt(d,M,y,x,M,z)&&Ft(d,M,y,x,M,z,.85,ot(),We(t,Ze(t,M)),X((d+x)/2,M,(y+z)/2)<40?kt:Pt)}if(o===0&&e%3===0)for(let w=1;w<20;w+=3){const M=w*Bt,R=M+18;dt(d,M,y,x,R,z,6)&&Ft(d,M,y,x,R,z,.8,ot(),We(t,Ze(t,R)),Pt)}}}const Et=[];for(let e=0;e<Je;e++){e%4===0&&await r.yield?.();const t=(e+.5)*G;if(!Ve(t-G/2)&&!Ve(t+G/2))continue;const a=Ve(t-G/2)?t-G/2:t+G/2;for(let s=0;s<co;s++){if(Ye[s]<=0)continue;const n=Fe-Re*s;if(n<96&&e&1||n<96&&m()>.55+.45*g)continue;const i=Math.sin(t)*n+m.range(-.12,.12),l=Math.cos(t)*n+m.range(-.12,.12),u=s===0&&m()<.85?m.range(2.2,4.2):0,o=Ye[s]+u,c=m.range(-.004,.004),d=m.range(-.004,.004);let y=-1;for(let x=0;x<=o+.001;x+=1){const z=X(i,x,l)>ie;z&&y<0&&(y=x);const w=x+1>o+.001;if((!z||w)&&y>=0){const M=z?o:x-1;M-y>.8&&Ft(i+c*y,y,l+d*y,i+c*M,M,l+d*M,1,ot(),We(a,Ze(t,99))),y=-1}}s===0&&Et.push({position:new h.Vector3(i,Y+1.2,l),staff:u?o:0,az:t})}}await r.yield?.();const Wo=()=>{const e=m.range(.8,1.15);return[.3*e,.215*e,.135*e]},ve=(e,t,a,s,n,i,l,u,o,c)=>{Me.copy(l).multiplyScalar(u),ae.copy(s).multiplyScalar(n),se.crossVectors(l,s).normalize().multiplyScalar(i/.08),ye.set(e,t,a).addScaledVector(s,-n/2),Dt.add(ye,ae,se,Me,o,c)},at=new h.Vector3(1,0,0),st=new h.Vector3(0,0,1),E=new h.Vector3,xe=new h.Vector3,vt=()=>{const e=m.range(.8,1.2);return[.215*e,.15*e,.092*e]},ho=new h.Vector3(0,1,0),fo=[.06,.06,.07];for(const e of[-1,1])ve(e*2.9,.3,0,at,.7,.6,st,66,vt(),[0,9,m(),5]);const uo=[];for(let e=-28;e<=28.01;e+=7){const t=Y-Math.sqrt(N*N-e*e)-.45;if(X(0,t,e)<7.5)continue;const a=.6,s=.95,n=Math.max(2,Math.floor((t-a-.5)/s));for(let u=0;u<n;u++){const o=a+(u+.5)*s,c=u/n;if(u%2===0)for(const d of[-1,0,1])ve(m.range(-.12,.12),o,e+d*(2.05-.75*c),st,.8,s-.04,at,8.2-3.6*c+m.range(-.25,.25),vt(),[0,9,m(),4]);else for(const d of[-1,0,1])ve(d*(2.9-1.5*c),o,e+m.range(-.1,.1),at,.8,s-.04,st,5.6-1.9*c+m.range(-.2,.2),vt(),[0,9,m(),4]);uo.push([u,o,c,e])}const i=a+n*s,l=Math.max(t-i,.3);ve(0,i+l/2,e,st,1.5,l,at,3,vt(),[0,9,m(),5]);for(const u of[-1,1])for(const o of[-1,1])ve(u*1.85,i+.22,e+o*.5,st,.42,.44,at,1.3,[.4,.31,.19],[0,9,m(),3]);for(let u=0;u<4;u++){const o=m.range(0,ue),c=m.range(.35,.9),d=m.range(-1,1)*5.5,y=e+m.range(-3.2,3.2);if(E.set(Math.sin(o),0,Math.cos(o)),xe.set(E.z,0,-E.x),Math.abs(d)<2.2||X(d,c,y)<7.5)continue;const x=m.range(.5,.62);ve(d,c*.35,y,xe,c,c*.7,E,c*m.range(.8,1.5),[le.r*x,le.g*x,le.b*x],[0,9,m(),3])}}{const e=To(1+be[0]+be[1]*256+be[2]*65536);for(const[t,a,s,n]of uo){if(t===0)continue;const i=t%2===0;for(const l of[-1,1])for(const u of[-1,1]){const o=i?(8.2-3.6*s)/2-.55:(5.6-1.9*s)/2-.5,c=i?2.05-.75*s+.42:2.9-1.5*s+.42;i?ve(l*o,a-.47,n+u*c,at,.1,.05,ho,.6,fo,[0,9,e(),3]):ve(u*c,a-.47,n+l*o,st,.1,.05,ho,.6,fo,[0,9,e(),3])}}for(let t=0;t<7;t++){const a=e.range(6,33),s=-e.range(5.5,12)*(t%3===2?-1:1),n=e.range(-.5,.5)+(t%2?.9:0),i=e.range(6.5,9.5);X(s,.3,a)<7.5||(E.set(Math.sin(n),0,Math.cos(n)),xe.set(E.z,0,-E.x),ve(s,.23+(t===3?.42:0),a,xe,.42,.42,E,i,vt().map(l=>l*1.25),[0,9,e(),4]))}for(let t=0;t<26;t++){const a=e.range(2,34),s=e.range(4.2,10.5)*(e()<.7?-1:1),n=e.range(0,ue);E.set(Math.sin(n),0,Math.cos(n)),xe.set(E.z,0,-E.x);const i=e.range(.8,1.2);ve(s,.12,a,xe,.38,.22,E,e.range(.8,1.3),[.4*i,.31*i,.19*i],[0,9,e(),3])}}await r.yield?.();for(let e=0;e<22;e++){const t=(e+.5)/22*ue+m.range(-.05,.05),a=m.range(40,50),s=a+m.range(14,20),n=Y-Math.sqrt(N*N-a*a)-.25,i=Math.sin(t),l=Math.cos(t);E.set(i*(s-a),-n,l*(s-a));const u=E.length();E.normalize(),xe.set(l,0,-i);let o=.655+.05*m();{const c=i*(a+s)/2,d=l*(a+s)/2;let y=1e9,x=0;for(let z=0;z<=36;z++){const w=.68+z*.005;B.pointAt(w,ye);const M=Math.hypot(ye.x-c,ye.z-d);M<y&&(y=M,x=w)}y>15&&y<75&&(o=Math.min(.8,Math.max(.67,x-.05+.012*(e%3))))}ve(i*(a+s)/2,n/2,l*(a+s)/2,xe,.5,.5,E,u,Wo().map(c=>c*1.55),[t,o,m(),2])}for(const e of At){await r.yield?.();const t=Math.abs(Ce(e.az-Be[0]))<Be[1]+.75,a=Math.abs(Ce(e.az-et[0]))<et[1]+.45;if((t||a)&&e.y<=66&&m()<.6){const n=m.int(1,3);for(let i=0;i<n;i++){const l=e.az+Math.PI/2+m.range(-.5,.5);E.set(Math.sin(l),0,Math.cos(l)),xe.set(E.z,0,-E.x);const u=m.range(e.e+.6,e.out-.3),o=Math.sin(e.az),c=Math.cos(e.az);ve(o*u+E.x*m.range(-1.5,1.5),e.y+.085+i*.07,c*u+E.z*m.range(-1.5,1.5),xe,.3,.06,E,m.range(3.2,4.4),lo(),[e.az,.63+.14*m(),m(),2])}}const s=X(e.x,e.y,e.z);if(s<12.5&&s>ie){const n=Math.sin(e.az),i=Math.cos(e.az),l=m.int(2,4);for(let u=0;u<l;u++){const o=m.range(0,ue);E.set(Math.sin(o),0,Math.cos(o)),xe.set(E.z,0,-E.x);const c=m.range(e.e+.4,e.out-.4),d=m.range(-3,3),y=n*c-i*d,x=i*c+n*d,z=m(),w=[St(e.az),Ht(e.az),m(),3];z<.3?ve(y,e.y+.075,x,xe,.36,.07,E,.46,[.74,.77,.82],w):z<.55?ve(y,e.y+.21,x,xe,.3,.34,E,.3,[.4,.44,.48],w):z<.8?ve(y,e.y+.08,x,xe,.14,.07,E,1.4,[.2,.15,.1],w):ve(y,e.y+.1,x,xe,.7,.12,E,.7,[.3,.24,.15],w)}}}const vo=Ee();for(let e=0,t=0;e<Math.round(36*g)&&t<900;t++){const a=At[m.int(0,At.length-1)];if(a.k<3||a.k>20||a.out-a.e<2.2)continue;const s=Math.sin(a.az),n=Math.cos(a.az),i=a.out-.45,l=m.range(-2.5,2.5),u=s*i-n*l,o=n*i+s*l;X(u-s*.6,a.y+3,o-n*.6)<7.5||(se.set(-s*1.3,6.2,-n*1.3).normalize(),ae.set(-n,0,s),Me.crossVectors(ae,se).normalize(),vo.add(ye.set(u,a.y,o),ae,se,Me,ot(),We(a.az,.25)),e++)}await r.yield?.(),O.add(kt.build(Do(),ut)),await r.yield?.();{const e=new h.CylinderGeometry(.09,.1,1,3,1,!0);e.translate(0,.5,0),O.add(Pt.build(e,ut))}await r.yield?.(),O.add(Dt.build(gt(0,1,-.04,.04,-.5,.5),ut)),await r.yield?.(),O.add(vo.build(ma(),ut)),await r.yield?.();const mo=ke(Jo,ea,{},{side:h.DoubleSide}),po=Ee(),Kt=[],xo=Ee(),qt=[],It=[.74,.68,.54],yo=V(_.clone().lerp(new h.Color("#7a5238"),.5),.78),go=V(b.clone().lerp(new h.Color("#b9c4cf"),.5),.95),$o=()=>{const e=m.pick([It,It,It,yo,yo,go,go]),t=m.range(.82,1.1);return[e[0]*t,e[1]*t,e[2]*t]},bo=(e,t,a,s)=>{const n=(e-.5)*G+.008,i=(e+.5)*G-.008,l=Math.sin(n)*t,u=Math.cos(n)*t,o=Math.sin(i)*t,c=Math.cos(i)*t;return dt(l,a+s/2,u,o,a+s/2,c,4,ie+.9)?(ae.set(o-l,0,c-u),se.set(0,s,0),Me.set(Math.sin(e*G),0,Math.cos(e*G)),po.add(ye.set(l,a,u),ae,se,Me,$o(),We(e*G,3+Ze(e*G,99))),Kt.push(m.range(0,30),m.range(.5,1.1),0),!0):!1},mt=new Set;for(let e=0;e<Je;e++){e%8===0&&await r.yield?.();const t=e*G;if(!Ve(t))continue;let a=1e9,s=0,n=0;for(let l=0;l<q.length;l+=3){const u=Math.abs(Ce(Math.atan2(q[l],q[l+2])-t)),o=Math.hypot(q[l],q[l+2]);o<128&&o>95&&u<a&&(a=u,s=o,n=q[l+1])}if(a>G)continue;const i=Fe-Re*Math.floor((Fe-(s+ie+.4))/Re);if(!(i>Fe))for(const l of[-8.6,-2.8,3])m()<.8&&bo(e,i+.14,n+l,5.4)&&mt.add(e+":"+Math.round((n+l)/6))}for(let e=0,t=0;e<Math.round(105*g)&&t<2e3;t++){t%40===0&&await r.yield?.();const a=m.int(0,Je-1),s=m.int(4,20);if(!Ve(a*G)||mt.has(a+":"+s))continue;const n=m()<.72,i=s<20&&m()<.3&&!mt.has(a+":"+(s+1));bo(a,n?Fe+.14:Fe-Re+.14,s*Bt+.35,i?11.3:5.3)&&(mt.add(a+":"+s),i&&mt.add(a+":"+(s+1)),e++)}const jo=[V(_),V(b),V(L),[.8,.8,.78],V(_,.8)];for(const e of Et){if(!e.staff||qt.length/3>=Math.round(80*g))continue;const t=m.range(2.8,4.4);ae.set(m.range(-.25,.25),0,1).normalize(),Me.set(-ae.z,0,ae.x),se.set(0,m.range(.9,1.3),0),xo.add(ye.set(e.position.x,e.staff-.7,e.position.z),ae.multiplyScalar(t),se,Me,m.pick(jo),We(e.az,3+Ze(e.az,99))),qt.push(m.range(0,30),m.range(.3,.5),1)}{const e=Ho(6,5,!1),t=Ho(8,1,!0),a=po.build(e,mo),s=xo.build(t,mo);Ae(e,"aPh",new Float32Array(Kt.length?Kt:[0,0,0]),3),Ae(t,"aPh",new Float32Array(qt.length?qt:[0,0,1]),3),O.add(a,s)}await r.yield?.(),await r.yield?.();const wo=[],Nt=[],Mo=[];{const e=f.fork?f.fork("hoists"):f,t=(o,c,d,y)=>{const x=Math.sin(o)*c,z=Math.cos(o)*c,w=Math.cos(o),M=-Math.sin(o),R=St(o),ne=Ht(o),p=e.range(2.6,3.6),K=e();for(let C=0;C<y;C++)Nt.push(x,z,d,(K+C/y)%1),Mo.push(R,ne,p,e());for(const C of[-1,1])Ie.push(x+w*.8*C,.2,z+M*.8*C),Ne.push(x+w*.8*C,d+1.3,z+M*.8*C),we.push(R,ne,.085,-C);zo(Math.sin(o)*(c-3.2),d+1.5,Math.cos(o)*(c-3.2),Math.sin(o)*(c+.7),d+1.5,Math.cos(o)*(c+.7),1.3,[R,ne,e(),0]),zo(x-w*1.1,d+1.3,z-M*1.1,x+w*1.1,d+1.3,z+M*1.1,2.4,[R,ne,e(),0]),wo.push({position:new h.Vector3(x,0,z),top:d+1.3})},a=Ee();var zo=(o,c,d,y,x,z,w,M)=>{ye.set(o,c,d),se.set(y-o,x-c,z-d),ae.set(se.z,0,-se.x).normalize(),Me.crossVectors(ae,se).normalize(),a.add(ye,ae.multiplyScalar(w),se,Me.multiplyScalar(w),ot(),M)};const s=16+e.int(0,3);for(let o=0;o<s;o++){const c=(Math.round((o+.5)/s*Je)+.5)*G;!Ve(c-G)||!Ve(c+G)||dt(Math.sin(c)*133.7,0,Math.cos(c)*133.7,Math.sin(c)*133.7,126,Math.cos(c)*133.7,40,7.5)&&t(c,133.7,122+e.range(0,4),4)}for(let o=0;o<Je;o+=2){const c=(o+.5)*G;if(!Ve(c))continue;let d=1e9,y=0,x=0;for(let R=0;R<q.length;R+=3){const ne=Math.abs(Ce(Math.atan2(q[R],q[R+2])-c)),p=Math.hypot(q[R],q[R+2]);p<126&&p>95&&ne<d&&(d=ne,y=p,x=q[R+1])}if(d>G)continue;let z=y+6.7;const w=Math.round((Fe-z)/Re)*-Re+Fe;Math.abs(w-z)<.9&&(z=w+.9);let M=Math.min(x+22,120);for(const R of Ct)R.y<M&&R.e-.9<z&&R.out+.9>z&&(M=Math.min(M,R.y-2.2));M<x+6||t(c,z,M,Math.max(4,Math.round(M/11)))}const n=pa(),i=Nt.length/4,l=(o,c)=>{const d=new h.InstancedMesh(o,c,Math.max(i,1));return d.count=i,Ae(o,"aH",new Float32Array(i?Nt:[0,1,1,0]),4),Ae(o,"aH2",new Float32Array(i?Mo:[0,9,1,0]),4),d.frustumCulled=!1,d.matrixAutoUpdate=!1,d};O.add(l(n,ke(aa,sa,{},{side:h.DoubleSide})));const u=l(new h.PlaneGeometry(1,1),ke(na,ra,{},{transparent:!0,depthWrite:!1,blending:h.AdditiveBlending}));u.renderOrder=3,O.add(u),O.add(a.build(Do(),ut))}await r.yield?.();{const t=[],a=[];for(let i=0;i<=24;i++)t.push(i/24,-1,0,i/24,1,0);for(let i=0;i<24;i++){const l=i*2;a.push(l,l+1,l+2,l+1,l+3,l+2)}const s=new h.InstancedBufferGeometry;s.setAttribute("position",new h.Float32BufferAttribute(t,3)),s.setIndex(a),Ae(s,"aA",new Float32Array(Ie),3),Ae(s,"aB",new Float32Array(Ne),3),Ae(s,"aR",new Float32Array(we),4),Ae(s,"aK",Float32Array.from({length:we.length/2},(i,l)=>1-(l&1)),2),s.instanceCount=we.length/4;const n=new h.Mesh(s,ke(ta,oa,{},{side:h.DoubleSide}));n.frustumCulled=!1,O.add(n)}await r.yield?.();{const e=f.fork?f.fork("dust"):f,t=Math.round(640*g),a=new Float32Array(t*4),s=new Float32Array(t*3),n=[];for(let u=0;u<q.length;u+=3)Math.hypot(q[u],q[u+2])<126&&q[u+1]>40&&n.push(u);for(let u=0;u<t;u++)if(u<t*.6&&n.length){const o=n[e.int(0,n.length-1)],c=Math.hypot(q[o],q[o+2]),d=c+e.range(-5.2,6),y=Math.atan2(q[o],q[o+2])+e.range(-.02,.02);a.set([Math.sin(y)*d,q[o+1]+e.range(4,6.2),Math.cos(y)*d,e()],u*4),s.set([e.range(9,13),e.range(.8,1.7),e.range(.06,.2)],u*3)}else{const o=e.range(0,ue),c=e.range(30,112),d=Y-Math.sqrt(N*N-c*c)+e.range(0,14);a.set([Math.sin(o)*c,d,Math.cos(o)*c,e()],u*4),s.set([d,e.range(1.2,2.4),e.range(.1,.32)],u*3)}const i=new h.InstancedBufferGeometry;i.setAttribute("position",new h.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),i.setIndex([0,1,2,0,2,3]),Ae(i,"aD",a,4),Ae(i,"aD2",s,3),i.instanceCount=t;const l=new h.Mesh(i,ke(ia,la,{},{transparent:!0,depthWrite:!1}));l.frustumCulled=!1,l.renderOrder=2,O.add(l)}await r.yield?.();const ge=(e,t,a)=>new h.Vector3(e,t,a),ko=bt-ht+je,Qo={worldOffset:[0,-30,0],flyThrough:W.map(e=>ge(e[0],e[1],e[2])),portalSeat:{position:ge(0,18,165),normal:ge(0,0,-1)},moonCenter:ge(0,Y,0),keel:ge(0,Y-N,0),seamPoint:ge(Math.sin(ko)*108,75,Math.cos(ko)*108),reveal:ge(290,64,24),bollards:zt,hoists:wo,topRail:Et.map(e=>({position:e.position})),struckSector:{azimuth:Be[0],halfWidth:Be[1]},gateGap:{azimuth:et[0],halfWidth:et[1]},viewpoints:{reveal:{position:ge(290,64,24),target:ge(0,Y+10,0)},gallery:{position:ge(81,75,-81),target:ge(40,70,-75)},belly:{position:ge(-25,18,0),target:ge(0,20,60)}}};let Wt=!1,Ge=0;const Po=e=>(e=Vt(e),e*e*e*(e*(e*6-15)+10)),Ue={object:O,radius:150,height:248,center:ge(0,Y-8,0),anchors:Qo,moon:Q,lift:0,job:F,ground:!0,groundY:0,uniforms:ee,glsl:{noise:ct,light:tt,crater:Yt},setProgress(e){Wt=!0,Ge=Vt(e)},crescentMaterial(e,t,a=1){return ke(Ro,Bo,{...oo,uRad:{value:e},uMode:{value:a},uMoonMat:{value:t}})},setLight(e={}){e.sunDir&&He(e.sunDir,ee.uSunDir.value).normalize(),e.sunColor&&He(e.sunColor,ee.uSunCol.value),e.skyColor&&He(e.skyColor,ee.uSkyCol.value),e.groundColor&&He(e.groundColor,ee.uGndCol.value),e.zenith&&He(e.zenith,ee.uZen.value),e.horizon&&He(e.horizon,ee.uHor.value),e.self&&He(e.self,ee.uSelf.value),e.mirrorSun&&He(e.mirrorSun,ee.uMirSun.value).normalize()},update(e,t){Wt||(Ge=t%40/40),ee.uTime.value=t,ee.uProg.value=Ge,ee.uOpen.value=Qe(.62,.76,Ge);const a=Po((Ge-.66)/.1),s=Jt(Ge),n=20*a+ya*Po((Ge-.8)/.12)+.5*Math.sin(t*.9)*a;Ue.lift=n,Q.position.y=Y+n,Q.position.z=s,Ue.drift=s,Q.rotation.y=Eo(Ge,re),Q.updateMatrix(),ee.uMoonMat.value.copy(Q.matrix),ee.uMoonC.value.set(0,Y+n,s),to.value.z=Math.min(t*.09,5.5),O.updateWorldMatrix(!0,!1),ee.uRootInv.value.copy(O.matrixWorld).invert()},dispose(){Te.dispose()}};await r.yield?.();{let e=null;O.traverse(p=>{p.geometry&&p.geometry.attributes.aK&&(e=p.geometry)});const t=e.attributes.aK.array,a=e.attributes.position,s=[],n=.2,i=.05,l=Math.ceil(B.length/1.5),u=new h.Vector3,o=[];for(let p=0;p<a.count;p++)s.includes(a.getX(p))||s.push(a.getX(p));s.sort((p,K)=>p-K);const c=s.length,d=new Float64Array(c*3),y=new Float64Array(c*3),x=new Float64Array(c),z=new Float64Array(c),w=p=>{Ue.setProgress(p),Ue.update(0,Math.PI/1.8);const K=Q.matrix.elements.slice();Ue.update(0,Math.PI/.6);const C=Q.matrix.elements.slice();return B.pointAt(p,u),{u:p,c:[u.x,u.y,u.z],mm:K[13]-C[13]>1e-9?[K,C]:[K]}},M=p=>o[p]||(o[p]=w(p/l)),R=(p,K,C,j,I)=>{const ce=Ie[p*3],Z=Ie[p*3+1],te=Ie[p*3+2],D=C[0]*ce+C[4]*Z+C[8]*te+C[12],A=C[1]*ce+C[5]*Z+C[9]*te+C[13],P=C[2]*ce+C[6]*Z+C[10]*te+C[14],he=Ne[p*3],me=Ne[p*3+1],ze=Ne[p*3+2],Pe=we[p*4+2]<.32,$e=Pe?he:D,Oe=Pe?me:A,nt=Pe?ze:P;let fe=Math.max(Math.sqrt((he-D)*(he-D)+(me-A)*(me-A)+(ze-P)*(ze-P)),.001);if(j&&(j[0]-$e)*(j[0]-$e)+(j[1]-Oe)*(j[1]-Oe)+(j[2]-nt)*(j[2]-nt)>(fe+I)*(fe+I))return null;const J=(he-D)/fe,De=(me-A)/fe,rt=(ze-P)/fe,it=(K-we[p*4])*re,lt=1-Math.exp(-it*.7)*Math.cos(it*1.4);let Se=4.5*Math.exp(-it*.28);if(!Pe){const pe=1-Qe(.795,.85,K);fe*=pe,Se*=pe}const _e=Math.hypot(-rt+1e-4,1e-4,J+1e-4);return[(-rt+1e-4)/_e,1e-4/_e,(J+1e-4)/_e,$e,Oe,nt,fe,Se,J,De,rt,lt,Pe]},ne=(p,K,C)=>{const j=p[12]?-1:1;for(let I=0;I<c;I++){const ce=p[12]?1-s[I]:s[I],Z=Math.min(Math.max(p[11]*(.55+.4*ce),0),1.12),te=j*p[8]*(1-Z)+1e-4,D=j*p[9]*(1-Z)-Z,A=j*p[10]*(1-Z),P=p[6]*ce/Math.hypot(te,D,A);K[I*3]=p[3]+P*te,K[I*3+1]=Math.max(p[4]+P*D,.25),K[I*3+2]=p[5]+P*A,C[I]=p[7]*ce}};for(let p=0;p*4<we.length;p++){if(Math.abs(we[p*4+3])>.5)continue;const K=we[p*4],C=2+we[p*4+2]/2+n,j=[],I=(A,P,he)=>{const me=A.c[0],ze=A.c[1],Pe=A.c[2],$e=Math.hypot(P.c[0]-me,P.c[1]-ze,P.c[2]-Pe),Oe=[];for(let fe=0;fe<A.mm.length;fe++){const J=R(p,A.u,A.mm[fe],A.c,4.85*he+C+$e+3);if(!J)continue;const De=R(p,P.u,P.mm[Math.min(fe,P.mm.length-1)]),rt=1.571*Math.hypot(De[3]-J[3],De[4]-J[4],De[5]-J[5]),it=1.571*Math.hypot(De[0]-J[0],De[1]-J[1],De[2]-J[2]),lt=rt+it*(Math.hypot(me-J[3],ze-J[4],Pe-J[5])+$e+rt),Se=(me-J[3])*J[0]+(ze-J[4])*J[1]+(Pe-J[5])*J[2],_e=Se+(P.c[0]-me)*J[0]+(P.c[1]-ze)*J[1]+(P.c[2]-Pe)*J[2];if(!(Se*_e>0&&Math.min(Math.abs(Se),Math.abs(_e))-lt-J[7]*he>=C)){ne(J,d,x),ne(De,y,z);for(let pe=0;pe+1<c;pe++){const oe=pe*3,$t=Math.max(x[pe],x[pe+1]);if(Se*_e>0&&Math.min(Math.abs(Se),Math.abs(_e))-lt-$t*he>=C)continue;const Tt=d[oe+3]-d[oe],Lt=d[oe+4]-d[oe+1],_t=d[oe+5]-d[oe+2],So=Tt*Tt+Lt*Lt+_t*_t,jt=So>0?Math.min(1,Math.max(0,((me-d[oe])*Tt+(ze-d[oe+1])*Lt+(Pe-d[oe+2])*_t)/So)):0,Rt=Math.hypot(me-d[oe]-Tt*jt,ze-d[oe+1]-Lt*jt,Pe-d[oe+2]-_t*jt),Qt=$e+1.571*Math.max(Math.hypot(y[oe]-d[oe],y[oe+1]-d[oe+1],y[oe+2]-d[oe+2]),Math.hypot(y[oe+3]-d[oe+3],y[oe+4]-d[oe+4],y[oe+5]-d[oe+5]));if(Rt-Qt-1.077*$t*he>=C)continue;const Xt=Math.max(0,Math.sqrt(Math.max(Rt*Rt-Se*Se,0))-Qt-.4*$t-2*it*(Rt+2*Qt));if(Xt>=C)continue;const Fo=Math.sqrt(C*C-Xt*Xt),Co=Math.min(Se,_e)-lt-Fo,Ao=Math.max(Se,_e)+lt+Fo;Oe.push(Math.min(x[pe]>1e-6?Co/x[pe]:-1e9,x[pe+1]>1e-6?Co/x[pe+1]:-1e9),Math.max(x[pe]>1e-6?Ao/x[pe]:1e9,x[pe+1]>1e-6?Ao/x[pe+1]:1e9))}}}if(!Oe.length)return;if($e<=i){for(let fe=0;fe<Oe.length;fe+=2)j.push([Oe[fe],Oe[fe+1]]);return}const nt=w((A.u+P.u)/2);I(A,nt,he),I(nt,P,he)},ce=A=>{j.length=0;for(let P=Math.floor(K*l);P<l;P++)I(P/l>K?M(P):w(K+1e-9),M(P+1),A);j.sort((P,he)=>P[0]-he[0])};ce(1);let Z=-1,te=-1,D=-1;for(const A of j)Math.min(A[0],1)-D>te-Z&&(Z=D,te=Math.min(A[0],1)),D=Math.max(D,A[1]);if(1-D>te-Z&&(Z=D,te=1),te>Z)(Z>-1||te<1)&&(t[p*2]=(te-Z)/2,t[p*2+1]=(Z+te)/2);else{ce(3);let A=1e9;D=-1e9;for(const P of j)P[0]>D&&(Math.abs(D)<Math.abs(A)&&(A=D),Math.abs(P[0])<Math.abs(A)&&(A=P[0])),D=Math.max(D,P[1]);Math.abs(D)<Math.abs(A)&&(A=D),Math.abs(A)<=3?(t[p*2]=0,t[p*2+1]=A):t[p*2]=-1}await r.yield?.()}Wt=!1,Ge=0}Ue.update(0,0);{const e=Ue.dispose;Ue.dispose=()=>{e(),Le.dispose()}}return Ue}export{za as buildHero};
