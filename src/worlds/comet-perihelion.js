import*as t from"three";import{mergeGeometries as Ie,mergeVertices as xo}from"three/addons/utils/BufferGeometryUtils.js";import{makePath as la,clamp as ue,lerp as k,smoothstep as Ae,makeNoise as ua}from"../kit/core.js";import{buildHero as ca}from"../parts/comet-perihelion.js";const yo=["#020308","#17130F","#8FA6C4","#FFE9B0","#FFF8E6","#EAD9B0","#3FA8FF"],ge=Math.PI/180,ce=`
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float h31(vec3 p){ p = fract(p * vec3(0.1031, 0.1030, 0.0973)); p += dot(p, p.yzx + 33.33); return fract((p.x + p.y) * p.z); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float fbm3(vec2 p){ return vn(p) * .5 + vn(p * 2.03 + 7.1) * .27 + vn(p * 4.1 + 3.3) * .15 + vn(p * 8.3 + 1.7) * .08; }
`,bo=`
uniform vec3 uSunDir, uAnti, uTailR, uTailU, uSunC, uIonC, uDustC, uSodC, uComaC;
uniform float uSunR, uCorR, uTime, uCorona, uIonI, uDustI, uSod, uComa, uDiscI, uProm, uNightK, uCrown, uSoft;
vec3 tails(vec3 d){
  float x = dot(d, uTailR), y = dot(d, uTailU), c = clamp(dot(d, uAnti), -1., 1.);
  float sr = sqrt(max(1. - c * c, 1e-6));                       // sine of the angle from the antisolar point
  float phi = atan(y, abs(x) < 1e-5 ? 1e-5 : x);                 // 0 right, pi/2 up, pi left (flying down-tail)
  float along = log(max((1. + c) / sr, 1e-3));                   // grows toward the vanishing point
  float reach = smoothstep(-0.55, 0.35, c);
  // ion fan: ruled rays on the upper left, kinks running down them
  float ph = phi < -1.6 ? phi + 6.2832 : phi;                    // unwrapped: the fan (0.25..3.72) never meets the atan seam
  float a = (ph - 0.25) / 0.115, id = floor(a), f = fract(a) - 0.5 + (h21(vec2(id, 3.)) - 0.5) * 0.5;
  // No ruled border: near the vanishing point any angular ramp collapses into a line, so the fan has no edge at all.
  // Its density thins over a third of a turn at each end, ray by ray, leaving stragglers that grow fewer, fainter and shorter.
  float lin = smoothstep(0., 18., a) * smoothstep(30.2, 22.2, a);
  float inFan = lin * smoothstep(0., 0.25, lin - 0.78 * h21(vec2(id, 13.)));
  float lenK = (0.22 + 0.78 * h21(vec2(id, 5.))) * mix(0.3, 1., lin);   // every ray ends at its own distance, the outer ones soonest: a feathered outline
  float tip = smoothstep(lenK * 1.35, lenK * 0.4, 1. - c);
  float w = (0.05 + 0.1 * h21(vec2(id, 7.))) * (1. + 5. * uSoft) / max(sr, 0.12);
  float ray = exp(-f * f / (w * w)) * (0.35 + 0.65 * h21(vec2(id, 11.))) / (1. + 2. * uSoft);
  float kink = 0.45 + 0.9 * vn(vec2(along * 5. - uTime * 0.9 + id * 13.7, id));
  vec3 col = uIonC * uIonI * ray * kink * inFan * reach * tip * (0.5 + 0.8 * smoothstep(0.9, 0.2, sr));
  col += uIonC * uIonI * 0.05 * lin * lin * reach * smoothstep(1.0, 0.15, 1. - c);   // the fan's own veil
  // dust tail: broad, cream, curving off to the lower right, combed into striae
  float pc = -0.55 - 0.5 * sr;
  float band = exp(-pow((phi - pc) / (0.55 + 0.35 * sr), 2.));
  float stri = vn(vec2(phi * 9. + along * 3.2, along * 1.3 - uTime * 0.02));
  stri = mix(0.35 + 1.1 * stri * stri + 0.5 * vn(vec2(phi * 31. + along * 9., 2.)), 0.8, uSoft * 0.8);
  col += uDustC * uDustI * band * stri * reach * (0.3 + 0.7 * smoothstep(1., 0.25, sr));
  // sodium thread between them
  float fs = (phi - 0.62) * max(sr, 0.12);
  col += uSodC * uSod * 0.6 * exp(-fs * fs / 0.00004) * reach * (0.6 + 0.6 * vn(vec2(along * 7. - uTime * 0.6, 5.)));
  return col;
}
vec3 sunSky(vec3 d){
  float c = clamp(dot(d, uSunDir), -1., 1.);
  float rho = acos(c);
  vec3 e1 = normalize(cross(uSunDir, vec3(0., 1., 0.)) + vec3(1e-5, 0., 0.)), e2 = cross(e1, uSunDir);
  vec2 q = vec2(dot(d, e1), dot(d, e2));
  vec2 qd = q / max(length(q), 1e-4);
  float r = rho / uSunR;
  // corona: a pearl crown with long wavering streamers
  float rc = max(rho, max(uSunR, uCorR * 0.75)) / uCorR;
  float st = vn(qd * 2.3 + vec2(uTime * 0.07, 3.) + 0.22 * sin(uTime * 0.45 + qd.yx * 5.));
  float fine = vn(qd * 9. + vec2(7., uTime * 0.16)) * 0.6 + vn(qd * 23. - vec2(uTime * 0.13, 1.)) * 0.4;
  float cor = pow(rc, -(3.1 - 2.0 * st * st)) * (0.22 + 1.3 * st * st) * (0.55 + 0.9 * fine) + 0.12 * pow(rc, -6.);
  vec3 pearl = mix(vec3(0.82, 0.88, 1.0), uSunC, 0.45);
  vec3 col = pearl * uCorona * cor * step(0., c) * (0.45 + 0.55 * smoothstep(1., 1.9, r));   // dimmer at the limb, so the disc keeps its edge
  // the crown that stands over the horizon before dawn: cool pearl (a dim warm white reads as olive), long streamers
  float st2 = vn(qd * 5.1 + vec2(1.7, uTime * 0.05));
  col += mix(vec3(0.74, 0.84, 1.0), uSunC, 0.22) * uCrown * (exp(-rho * rho / 0.2) * (0.26 + 1.25 * st * st + 0.5 * fine) + exp(-rho * rho / 0.5) * 0.5 * st2 * st2 * st2 * (0.4 + fine));
  // prominences: loops standing on the limb
  vec2 qn = q / sin(uSunR);
  for (int i = 0; i < 4; i++) {
    float fi = float(i), an = 0.9 + fi * 2.4 + 0.3 * sin(fi * 5.);
    float rad = (0.16 + 0.07 * fi) * (0.6 + uProm);
    vec2 cp = vec2(cos(an), sin(an)) * (1.0 + rad * 0.25);
    vec2 dp = qn - cp; float dl = length(dp);
    float ang = atan(dp.y, abs(dp.x) < 1e-5 ? 1e-5 : dp.x);
    float flow = 0.5 + 0.5 * sin(ang * 3. - uTime * (0.5 + 0.2 * fi) + fi * 2.);
    float th = 0.025 + 0.03 * flow;
    float ring = exp(-pow((dl - rad) / th, 2.)) * (0.12 + 0.88 * flow * flow) * smoothstep(-0.5, 0.4, sin(ang * 1.5 + fi * 1.9 + uTime * 0.07)) * step(fi, 1.5 + uProm * 2.);
    col += vec3(1.0, 0.72, 0.5) * uDiscI * 0.35 * ring * step(1., r) * step(0., c);
  }
  // the disc: hard edged, limb darkened, granulated
  float edge = 1. - smoothstep(1. - 0.0012 / uSunR, 1., r);
  float mu = sqrt(max(1. - r * r, 0.));
  float gran = 0.92 + 0.16 * vn(qn * 14. + uTime * 0.03);
  col = mix(col, uSunC * vec3(1., 0.92 + 0.08 * mu, 0.7 + 0.3 * mu) * uDiscI * (0.55 + 0.45 * mu) * gran, edge * step(0., c));
  return col;
}
`,da=`
varying vec3 vDir;
void main(){
  vDir = position;
  vec4 p = projectionMatrix * vec4(mat3(modelViewMatrix) * position, 1.);
  if (abs(p.w) < 1e-4) p.w = 1e-4;
  gl_Position = p.xyww;
}`,fa=`
precision highp float;
varying vec3 vDir;
uniform float uStars, uTailSky, uHaze, uBand, uNucR, uComaG;
uniform vec3 uBandN, uBandX, uNucDir;
${ce}
${bo}
float vn3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(mix(h31(i), h31(i + vec3(1., 0., 0.)), f.x), mix(h31(i + vec3(0., 1., 0.)), h31(i + vec3(1., 1., 0.)), f.x), f.y),
             mix(mix(h31(i + vec3(0., 0., 1.)), h31(i + vec3(1., 0., 1.)), f.x), mix(h31(i + vec3(0., 1., 1.)), h31(i + vec3(1., 1., 1.)), f.x), f.y), f.z); }
float starLayer(vec3 d, float sc, float thr){
  vec3 p = d * sc, i = floor(p), f = fract(p) - 0.5;
  float h = h31(i);
  vec3 j = (vec3(h31(i + 11.3), h31(i + 27.1), h31(i + 5.7)) - 0.5) * 0.5;
  float dd = length(f - j);
  float m = step(thr, h) * (h - thr) / (1. - thr);
  return (0.25 + 0.75 * m * m) * step(thr, h) * (1. - smoothstep(0.07, 0.2, dd));
}
void main(){
  vec3 d = normalize(vDir);
  vec3 col = vec3(0.0012, 0.0017, 0.0036);
  float s1 = starLayer(d, 70., 0.915), s2 = starLayer(d.zxy, 150., 0.94);
  float tint = h31(floor(d * 70.) + 3.);
  col += (s1 * 1.5 + s2 * 0.55) * mix(vec3(0.75, 0.85, 1.15), vec3(1.15, 1.0, 0.8), tint) * uStars * uNightK;
  // (polish 2) deep space is not flat black: the galaxy's band crosses the sky behind the tails, warm at its core, violet-blue
  // at its skirts, with dark lanes and a few rose knots; the stars crowd toward it
  vec3 gq = d * 3.2;
  float g1 = vn3(gq + 11.) * 0.55 + vn3(gq * 2.3 + 5.) * 0.3 + vn3(gq * 5.1 + 2.) * 0.15;
  float g2 = vn3(gq * 7. + 3.) * 0.6 + vn3(gq * 15. + 9.) * 0.4;
  float glat = dot(d, uBandN) + (g1 - 0.5) * 0.24;
  float gb = exp(-glat * glat / 0.03), gsk = exp(-glat * glat / 0.22);
  float gcore = exp(-(1. - dot(d, uBandX)) * 1.6);
  float glane = smoothstep(0.4, 0.62, vn3(gq * 1.7 + vec3(4., 9., 1.)) * 0.6 + g2 * 0.4) * exp(-glat * glat / 0.014);
  vec3 gcol = mix(vec3(0.34, 0.42, 1.0), vec3(1.0, 0.74, 0.5), gb * (0.3 + 0.7 * gcore));
  float gI = (0.02 * gsk + 0.1 * gb * (0.35 + 2.6 * g1 * g2)) * (0.4 + 0.6 * gcore) * (1. - 0.82 * glane);
  col += (gcol * gI + vec3(1.0, 0.28, 0.42) * 0.07 * smoothstep(0.7, 0.9, vn3(gq * 2.9 + 21.)) * gb) * uBand;
  col += s2 * (0.6 + 2.4 * gb) * gsk * vec3(0.95, 0.95, 1.1) * uBand * 0.8;
  col += tails(d) * uTailSky;
  col += sunSky(d);
  // (polish 2) the coma: a halo of gas round the nucleus, blue-white at the limb, combed down-sun into streamers. The rock is
  // drawn over it, so the body stands against light, not against black.
  float nc = clamp(dot(d, uNucDir), -1., 1.), na = acos(nc), nout = max(na - uNucR, 0.);
  vec3 nperp = d - uNucDir * nc; float nl = max(length(nperp), 1e-4);
  vec3 aperp = uAnti - uNucDir * dot(uAnti, uNucDir);
  float ndown = dot(nperp / nl, aperp);                              // +: the side of the halo that streams down-sun
  float nw = 0.2 + 0.42 * max(ndown, 0.) + 0.05 * max(-ndown, 0.);
  float nfan = vn3(nperp / nl * 4.5 + vec3(0., uTime * 0.07, 3.)) * 0.6 + vn3(nperp / nl * 13. + vec3(uTime * 0.12, 0., 7.)) * 0.4;
  float nflow = vn3(nperp / nl * 6. + vec3(nout * 7. - uTime * 0.8, 5., nout * 3.));                 // gas streaming outward, visibly
  float nglow = exp(-nout / nw) * (0.4 + 1.25 * nfan * nfan) * (0.45 + 1.1 * nflow) + 0.5 * exp(-nout / 0.07) + 0.3 * exp(-nout / 1.1) * (0.5 + 1.0 * nflow * nfan + 0.5 * nflow);
  col += mix(uIonC, vec3(0.7, 0.86, 1.0), 0.5 * exp(-nout / 0.12)) * uComaG * nglow;
  // (polish) the coma: the sun is seen through the comet's own gas and dust, a wide cool haze round it with slow streamers
  float cs = clamp(dot(d, uSunDir), -1., 1.), rh = acos(cs);
  vec3 hz1 = normalize(cross(uSunDir, vec3(0., 1., 0.)) + vec3(1e-5, 0., 0.)), hz2 = cross(hz1, uSunDir);
  float ha = atan(dot(d, hz2), abs(dot(d, hz1)) < 1e-5 ? 1e-5 : dot(d, hz1));
  float hs = vn(vec2(ha * 2.2 + 7., rh * 1.5 - uTime * 0.03)) * 0.6 + vn(vec2(ha * 6.5, rh * 4. - uTime * 0.06)) * 0.4;
  col += mix(uIonC, vec3(0.62, 0.78, 1.0), 0.55) * uHaze * (0.06 * exp(-rh * rh / 0.35) + 0.06 * exp(-rh * rh / 2.4)) * (0.45 + 1.1 * hs * hs);
  // coma glow: only on the teal variant, hugging the nucleus below
  col += uComaC * uComa * (0.004 + 0.022 * exp(-abs(d.y + 0.12) * 5.));
  gl_FragColor = vec4(col, 1.);
}`,st=`
attribute vec3 color;
varying vec3 vP, vN, vC, vQ;
uniform float uLocal;
void main(){
  #ifdef USE_INSTANCING
    vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.);
    vN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
  #else
    vec4 w = modelMatrix * vec4(position, 1.);
    vN = normalize(mat3(modelMatrix) * normal);
  #endif
  vP = w.xyz; vC = color;
  vQ = mix(w.xyz, position * uLocal, step(0.001, uLocal));       // texture space: the world for the nucleus, their own for things that tumble
  gl_Position = projectionMatrix * viewMatrix * w;
}`,lt=`
precision highp float;
varying vec3 vP, vN, vC, vQ;
uniform float uLineQ, uRc, uElevMax, uSunI, uIce, uTex, uBump, uTime, uComa, uNightK, uRim, uThread, uOct, uFill;
uniform vec2 uAway; uniform vec4 uThB;      // thread: distance from, to; height from, to
uniform vec3 uSunCol, uIonCol, uCrust, uFrostCol, uComaC;
uniform vec4 uBeacon;                       // xyz position, w intensity (0 for the lobes)
${ce}
// (polish) real marks at the size the camera sees: one bowl with a raised rim per cell, three sizes of them
float crat(vec2 p){
  vec2 i = floor(p), f = fract(p);
  float h = h21(i + 7.3);
  vec2 c = 0.5 + (vec2(h21(i + 1.7), h21(i + 9.2)) - 0.5) * 0.36;
  float r = 0.1 + 0.16 * h21(i + 4.4);
  float d = length(f - c) / r, dm = d - 1.;
  return step(0.6, h) * r * (-0.7 * max(1. - d * d, 0.) + 0.3 * exp(-dm * dm / 0.045));
}
float relief(vec2 q, float w1, float w2, float w3){
  return 190. * crat(q / 190.) * w1 + 62. * crat(q / 62. + 5.3) * w2 + 21. * crat(q / 21. + 11.7) * w3;
}
void main(){
  vec3 Ng = normalize(vN);
  vec3 Vv = cameraPosition - vP; float dist = length(Vv);
  vec2 q0 = vQ.xz + vQ.y * vec2(0.63, 0.41);
  vec2 p = q0 * uTex;
  float n0 = fbm3(p), nx = fbm3(p + vec2(0.31, 0.)), nz = fbm3(p + vec2(0., 0.31));
  float big = fbm3(p * 0.13 + 4.);
  vec3 g = uBump * vec3(n0 - nx, 0., n0 - nz);
  float tone = 0.6 + 0.8 * n0, detailShade = 1., detailTone = 1., frostLaid = 0.;
  if (uOct > 0.5) {
    // the lobes: two finer octaves, and the terrace's own soot patches, so the crown terrace is part of the body
    vec2 p1 = q0 * 0.05 + 3.1, p2 = q0 * 0.21 + 7.7;
    float n1 = fbm3(p1), n2 = fbm3(p2);
    float f1 = 1. - smoothstep(2500., 6000., dist), f2 = 1. - smoothstep(700., 2400., dist);
    g = g * 0.3 + 0.55 * f1 * vec3(n1 - fbm3(p1 + vec2(0.31, 0.)), 0., n1 - fbm3(p1 + vec2(0., 0.31)))
                + 0.3 * f2 * vec3(n2 - fbm3(p2 + vec2(0.31, 0.)), 0., n2 - fbm3(p2 + vec2(0., 0.31)));
    // close to: a third octave, so the slopes we climb past are not bare
    float f3 = 1. - smoothstep(180., 600., dist);
    vec2 p3 = q0 * 0.9 + 1.3; float n3 = fbm3(p3);
    g += 0.4 * f3 * vec3(n3 - fbm3(p3 + vec2(0.31, 0.)), 0., n3 - fbm3(p3 + vec2(0., 0.31)));
    // craters: crisp rims that take the low sun on one side and throw the other into shadow
    float w1 = 1. - smoothstep(2600., 5200., dist), w2 = 1. - smoothstep(700., 1500., dist), w3 = 1. - smoothstep(220., 480., dist);
    float cmask = smoothstep(0.38, 0.62, fbm3(q0 * 0.0035 + 13.)); w2 *= 0.25 + 0.75 * cmask; w3 *= cmask;   // craters come in fields, with plains between
    float ee = clamp(dist * 0.004, 0.6, 9.);
    float r0 = relief(q0, w1, w2, w3);
    vec3 gc = vec3(r0 - relief(q0 + vec2(ee, 0.), w1, w2, w3), 0., r0 - relief(q0 + vec2(0., ee), w1, w2, w3)) / ee;
    g += gc * 1.5;
    // layered terraces on every slope: a ledge every thirty-odd metres, its riser turned outward
    float steepG = smoothstep(0.1, 0.45, 1. - Ng.y) * (1. - smoothstep(1800., 4200., dist));
    float sy = vQ.y * 0.03 + big * 1.6 + 0.2 * n1, sf = fract(sy);
    float riser = smoothstep(0., 0.06, sf) * (1. - smoothstep(0.1, 0.24, sf));
    g += normalize(vec3(Ng.x, 0., Ng.z) + vec3(1e-4, 0., 0.)) * riser * steepG * 0.9; g.y -= riser * steepG * 0.5;
    float layerTone = mix(1., 0.72 + 0.56 * h21(vec2(floor(sy), 3.7)), steepG) * (1. - 0.4 * steepG * (1. - smoothstep(0., 0.05, sf)));
    // cracks, and boulder fields with their shadows thrown down-sun
    float ck = abs(fbm3(q0 * 0.021 + 5.) - 0.5), ckw = 0.006 + dist * 0.000012;
    float crack = (1. - smoothstep(ckw * 0.4, ckw, ck)) * (1. - smoothstep(900., 2200., dist));
    vec2 bp = q0 / 13., bi = floor(bp), bf = fract(bp) - 0.5 - (vec2(h21(bi + 2.1), h21(bi + 6.6)) - 0.5) * 0.5;
    float bh = h21(bi + 9.9), br = 0.07 + 0.1 * h21(bi + 3.3), bon = step(0.62, bh) * smoothstep(0.5, 0.62, fbm3(q0 * 0.006 + 2.)) * (1. - smoothstep(350., 800., dist));
    float bould = bon * (1. - smoothstep(br * 0.7, br, length(bf)));
    vec2 bs = bf - uAway * br * 2.2;
    float bshad = bon * (1. - smoothstep(br * 0.8, br * 2.6, length(bs * vec2(1., 1.) + uAway * dot(bs, uAway) * -0.55)));
    float soot = smoothstep(0.42, 0.62, fbm3(vQ.xz * 0.035 + 17.));
    // (polish 3) the face turned from the sun holds frost: in the hollows the design names (here the bowls of its craters, on gentle
    // ground by the slope alone) and, an addition, on the tread above some ledges; far off each breakup factor goes to its mean
    float bowl = -(crat(q0 / 190.) * w1 + crat(q0 / 62. + 5.3) * w2 + crat(q0 / 21. + 11.7) * w3);
    float tread = steepG * smoothstep(0.2, 0.28, sf) * (1. - smoothstep(0.3, 0.62, sf)) * smoothstep(0.25, 0.7, h21(vec2(floor(sy), 9.1))) * mix(0.63, smoothstep(0.34, 0.56, n1), f2);
    frostLaid = clamp(smoothstep(0.012, 0.06, bowl) * mix(0.9, 0.35 + 1.1 * n3, f3) * (1. - 0.85 * smoothstep(0.1, 0.45, 1. - Ng.y)) + 0.75 * tread * mix(0.85, 0.4 + 0.9 * n2, f2), 0., 1.);
    detailShade = (1. - 0.75 * bshad * (1. - bould)) * (1. - 0.6 * crack);
    detailTone = layerTone * (1. + 0.9 * bould) * (1. - 0.45 * crack);
    tone = (0.74 + 0.3 * n0) * mix(1., 0.62 + 0.75 * n1, f1) * mix(1., 0.7 + 0.6 * n2, f2) * mix(1., 0.7 + 0.6 * n3, f3) * mix(1., mix(0.36, 0.64, smoothstep(220., 800., dist)), soot);
  }
  vec3 N = normalize(Ng + g);
  float te = clamp((uLineQ - dot(vP.xz, uAway)) / uRc, -0.4, uElevMax);
  vec3 L = normalize(vec3(-uAway.x, max(te, 0.04), -uAway.y));
  float tq = te + 0.035 * uOct;                                  // the body lights where the terrace's flats do, 77 m ahead of the nominal line
  float lit = smoothstep(-0.014, 0.014, tq) * smoothstep(-0.02, 0.08, dot(Ng, L));
  float strata = 0.82 + 0.3 * vn(vec2(vQ.y * 0.045 + big * 2.2, 3.7));
  vec3 alb = uCrust * vC * tone * strata * detailTone;
  float farK = smoothstep(220., 800., dist) * uOct;             // from the air: burnt toast, not orange (the terrace does the same)
  alb = mix(alb, vec3(dot(alb, vec3(0.3, 0.5, 0.2))) * vec3(1.08, 0.96, 0.84), 0.3 * farK) * (1. - 0.18 * farK);
  float ice = uIce * smoothstep(0.62, 0.7, fbm3(p * 0.21 + 9.) + 0.12 * n0);
  alb = mix(alb, vec3(0.42, 0.45, 0.5), ice * 0.8);
  vec3 col = alb * uSunCol * uSunI * max(dot(N, L), 0.) * lit * detailShade;
  // the ruled line: the crust burns for a second where the light has just arrived
  float since = max(tq, 0.) * uRc / 30.;
  col += alb * uSunCol * uSunI * 0.9 * exp(-since / 1.5) * smoothstep(-0.0065, 0.0065, tq) * smoothstep(-0.25, 0.2, dot(Ng, L)) * (0.35 + 0.65 * max(N.y, 0.));
  col += alb * uSunCol * uSunI * 0.016 * smoothstep(0., 0.08, te) * (0.4 + 0.6 * max(N.y, 0.));
  col += alb * (uIonCol * 0.05 * max(N.y, 0.) + vec3(0.004, 0.005, 0.007)) * uNightK;
  col += mix(uIonCol, uFrostCol, 0.5) * 0.024 * max(N.y, 0.) * max(N.y, 0.) * (0.5 + n0) * uNightK;   // a breath of blue from the tail on upward faces
  col += alb * uComaC * uComa * 0.12;
  // (polish) the side turned from the sun is not black: the coma and the tails light it blue from down-sun and above, so its
  // craters and ledges read; frost patches hold more of it
  vec3 Lf = normalize(vec3(uAway.x, 0.75, uAway.y));
  float fillF = max(dot(N, Lf) * 0.8 + 0.2, 0.);
  float frostP = smoothstep(0.45, 0.7, fbm3(q0 * 0.004 + 31.) * 0.6 + 0.4 * n0);
  col += mix(uIonCol, uFrostCol, 0.55) * (0.5 + 0.5 * uNightK) * (1. - 0.85 * lit) * (0.14 + 1.0 * fillF * fillF) * (0.095 + 0.17 * frostP + 0.340 * frostLaid * (1. - lit)) * (0.6 + 0.8 * tone) * detailTone * step(0.5, uOct + uFill);
  col += alb * uIonCol * uFill * (0.35 + 0.65 * max(dot(N, vec3(uAway.x, 0.3, uAway.y)), 0.));   // tumbling fragments: the tail's blue on the side turned from the sun
  vec3 V = Vv / max(dist, 1e-3);
  float ndv = max(dot(Ng, V), 0.);
  float rim = pow(1. - ndv, 14.) * smoothstep(0.2, 0.75, dot(-V, L)) * smoothstep(-0.014, 0.014, te) * smoothstep(-0.14, 0.02, dot(Ng, L));
  col += uSunCol * rim * uRim;                                   // the backlit limb burns
  // before dawn: one white-gold thread along the summit of the far lobes, which already stand in the sun
  float th = pow(1. - ndv, 7.) * smoothstep(0.1, 0.45, Ng.y) * smoothstep(uThB.x, uThB.y, dist) * smoothstep(uThB.z, uThB.w, vP.y) * smoothstep(-0.05, 0.25, dot(-V.xz, -uAway)) * smoothstep(-0.12, 0.1, dot(Ng.xz, -uAway));
  col += mix(uSunCol, vec3(1.), 0.35) * uThread * th * (0.3 + 1.4 * n0);
  vec3 tb = uBeacon.xyz - vP; float db = dot(tb, tb);
  col += vC * vec3(0.8, 0.9, 1.0) * uBeacon.w * max(dot(Ng, tb / sqrt(max(db, 1e-4))), 0.15) / (1. + db * 0.12);
  gl_FragColor = vec4(col, 1.);
}`,So=`
attribute vec3 iBase, iUp; attribute vec4 iPar;      // height, base width, ignite s (<0: burning), seed
uniform float uS, uLineQ, uRc; uniform vec2 uAway;
varying vec2 vUv; varying float vSeed, vLit, vGrow, vAx; varying vec3 vW;
void main(){
  float grow = iPar.z < 0. ? 1. : smoothstep(iPar.z, iPar.z + 3.5, uS);
  float v = uv.y, h = iPar.x * (0.15 + 0.85 * grow);
  vec3 side = normalize(cross(iUp, vec3(0.3, 0.2, 1.)));
  if (position.z > 0.5) side = cross(iUp, side);
  float wd = iPar.y * 1.8 * (0.35 + 1.6 * v * v + 0.8 * v);
  vec3 w = iBase + iUp * (v * h) + side * (position.x * wd) + vec3(uAway.x, 0., uAway.y) * (v * v * h * 0.3);
  float te = (uLineQ - dot(iBase.xz, uAway)) / uRc + v * h * 0.0006;
  vLit = smoothstep(-0.02, 0.03, te) * grow;
  vUv = uv; vSeed = iPar.w; vGrow = grow; vW = w;
  vAx = abs(dot(normalize(w - cameraPosition + vec3(0., 1e-4, 0.)), iUp));     // seen along its axis a card is a bar: let it go
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
}`,Ao=`
precision highp float;
varying vec2 vUv; varying float vSeed, vLit, vGrow, vAx; varying vec3 vW;
uniform float uTime, uPlumeI; uniform vec3 uGrain, uSunDir;
${ce}
void main(){
  float x = abs(vUv.x * 2. - 1.), v = vUv.y;
  float prof = (1. - smoothstep(0.25, 1., x)) * (0.35 + 0.65 * smoothstep(0., 0.6, x)) * (1. - x * x);
  float n = vn(vec2(vUv.x * 7. + vSeed * 31., v * 9. - uTime * 0.45)) * 0.6 + vn(vec2(vUv.x * 19. + vSeed, v * 26. - uTime * 0.9)) * 0.4;
  float fade = pow(max(1. - v, 0.), 1.4) * smoothstep(0., 0.12, v) * smoothstep(0., 0.3, vGrow * 1.25 - v * 0.25);
  vec3 vd = normalize(vW - cameraPosition);
  float fwd = pow(max(dot(vd, uSunDir), 0.), 3.);
  float down = smoothstep(0.12, 0.6, -vd.y);                    // seen from above the forward scatter is lost: white fire against the black
  float a = prof * (0.35 + 1.1 * n * n) * fade * vLit * uPlumeI * (0.45 + 1.6 * fwd + 1.5 * down) * (1. - smoothstep(0.86, 0.985, vAx));
  gl_FragColor = vec4(mix(vec3(0.96, 0.97, 1.0), uGrain, smoothstep(0.02, 0.3, a)) * a, 1.);
}`,Co=`
uniform vec3 uSailP, uShD, uShR, uShU; uniform float uShOn, uShT;
float sdSeg(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; return length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0., 1.)); }
float sailShadow(vec3 P){
  vec3 r = P - uSailP; float al = dot(r, uShD);
  vec2 q = vec2(dot(r, uShR), dot(r, uShU));                     // q.y grows ahead of us on the dust
  float rp = min(1., max(al, 0.) * 0.02);
  q.x += (0.3 * sin(q.y * 0.9 + uShT * 2.3) + 0.15 * sin(q.y * 2.3 - uShT * 3.4)) * rp;     // it shimmers over the striae
  q.y += 0.2 * sin(q.x * 0.45 + uShT * 1.7) * rp;
  float pen = 0.35 + max(al, 0.) * 0.003;
  float ky = q.y > 0. ? q.y / 21. : -q.y / 7.7;                 // stretched ahead so that, foreshortened on the dust, it is a kite again
  float dk = (abs(q.x) / 13. + ky - 1.) * 7.;
  float ins = 1. - smoothstep(-pen, pen, dk);
  // the harness under the kite: two shrouds down to the sling bar, the bar, and the tether trailing below it
  vec2 qa = vec2(abs(q.x), q.y);
  float hd = min(min(sdSeg(qa, vec2(13., 0.), vec2(2.6, -11.5)), sdSeg(qa, vec2(0., -11.5), vec2(2.6, -11.5)) * 0.6), sdSeg(qa, vec2(0., -11.5), vec2(0., -19.)));
  float lw = 0.28 + max(al, 0.) * 0.0022;
  float har = (1. - smoothstep(lw * 0.5, lw * 1.5, hd)) * 0.75;
  return 1. - uShOn * step(6., al) * max(ins * 0.92, har) * smoothstep(2600., 1200., al);
}`,va=`
attribute vec3 aP0, aP1; attribute vec4 aPar; attribute float aBraid; attribute vec2 aRope;     // aPar: t, side, width, seed; aRope: strand phase, rope radius
uniform vec3 uLegO, uAnti, uTailR, uTailU; uniform float uTime, uLegLen;
varying float vX, vA, vSeed, vFade, vBr, vRope;
vec3 centre(float t){
  vec3 c = mix(aP0, aP1, t);
  float a = dot(c - uLegO, uAnti), ph = a - uTime * 400., sd = aPar.w;
  float k1 = sin(ph * 0.011 + sd * 40.) * pow(0.5 + 0.5 * sin(ph * 0.0021 + sd * 17.), 6.);
  float k2 = sin(ph * 0.019 + sd * 9.) * pow(0.5 + 0.5 * sin(ph * 0.0013 + sd * 5.), 8.);
  float br = abs(aBraid);
  c += (uTailR * k1 + uTailU * k2) * (aPar.z * 1.15 + aRope.y * 1.7) * (1. - br);
  // the rope: strands of one ray wound round each other, pinched into knots that run down-tail
  float ra = a * 0.062 + aRope.x - uTime * 0.8;
  float pin = 0.5 + 0.5 * sin(ph * 0.019 + sd * 23.);
  c += (uTailR * cos(ra) + uTailU * sin(ra)) * aRope.y * (0.22 + 0.95 * pin * pin);
  float w = smoothstep(uLegLen - 1500., uLegLen - 500., a) * br;
  float ang = a * 0.019 + uTime * 0.5 + (aBraid > 0. ? 0. : 3.14159);
  float rad = mix(17., 11.5, smoothstep(uLegLen - 700., uLegLen, a)) + 1.3 * sin(a * 0.006 + uTime * 0.5);
  return mix(c, uLegO + uAnti * a + (uTailR * cos(ang) + uTailU * sin(ang)) * rad, w);
}
void main(){
  float t = aPar.x;
  vec3 c0 = centre(t), c1 = centre(t + 0.003);
  vec3 dir = normalize(c1 - c0 + vec3(1e-5)), vd = c0 - cameraPosition;
  float dist = length(vd);
  vec3 side = normalize(cross(dir, vd / max(dist, 1e-3)) + vec3(0., 1e-5, 0.));
  float wd = max(aPar.z, dist * 0.0012);
  float graze = length(cross(dir, vd / max(dist, 1e-3)));
  vec3 p = c0 + side * aPar.y * wd;
  vX = aPar.y; vA = dot(c0 - uLegO, uAnti); vSeed = aPar.w; vBr = abs(aBraid); vRope = step(0.01, aRope.y);
  vFade = smoothstep(0., 0.05, t) * smoothstep(1., 0.7, t) * smoothstep(5., 22., dist) * min(1., aPar.z / wd * 1.5) * (0.06 + 0.94 * smoothstep(0.02, 0.45, graze));
  float fe = mix(750., 1700., fract(aPar.w * 7.31));              // each ray melts away at its own distance, well before the rays pile up over the vanishing point
  vFade *= mix(smoothstep(40., 260., dist), 1., vRope);          // (polish) a wide ray close to is a white wall: only the rope comes near
  vFade *= mix(smoothstep(fe, fe * 0.35, dist), smoothstep(2100., 900., dist) * smoothstep(uLegLen + 260., uLegLen + 60., vA) * smoothstep(uLegLen - 1900., uLegLen - 1300., vA), vBr);
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
}`,ma=`
precision highp float;
varying float vX, vA, vSeed, vFade, vBr, vRope;
uniform float uTime, uIonG; uniform vec3 uIonC;
${ce}
void main(){
  float x = vX * vX;
  float core = exp(-x * 18.) * 1.5 + exp(-x * 3.5) * 0.45 * (1. - x);
  float knots = 0.45 + 1.0 * vn(vec2(vA * 0.0045 - uTime * 1.6 + vSeed * 50., vSeed * 9.));
  float fine = 0.75 + 0.5 * vn(vec2(vA * 0.03 - uTime * 9., vSeed * 3.));
  vec3 col = mix(uIonC, vec3(0.75, 0.9, 1.0), exp(-x * 30.) * 0.55) * core * knots * fine * uIonG * (1. + 2.4 * vBr + 0.9 * vRope * knots);
  gl_FragColor = vec4(col * vFade, 1.);
}`,ha=`
attribute vec4 aPar; attribute vec3 aArm;
uniform vec3 uLegO, uAnti, uTailR, uTailU; uniform float uTime, uLegLen;
varying float vX, vA, vSeed, vFade, vHot;
vec3 centre(float t){
  float rim = step(aArm.z, 0.);
  float x = max(aArm.z, 0.) * (1. - t) * (1. - 0.6 * t);            // metres before the ring; denser sampling near it
  float fl = smoothstep(520., 1000., x);
  float R = (14.5 + 0.125 * x + 115. * fl * fl) * aArm.y;
  float ang = aArm.x + 3.3 * log(R / (14.5 * aArm.y)) + 1.5 * exp(-x / 30.) + uTime * 0.22;
  R += 1.6 * sin(x * 0.045 - uTime * 2.2 + aArm.x * 3.) * min(1., x / 60.);
  // rim strands: three circles round the opening, breathing
  float ar = aArm.x + t * 6.2832 * 1.02 + uTime * 0.55 * aArm.y;
  float Rr = 13.6 * aArm.y + 0.55 * sin(ar * 5. + uTime * 1.7);
  x = mix(x, 0.6 * sin(ar * 3. + aArm.x), rim); R = mix(R, Rr, rim); ang = mix(ang, ar, rim);
  return uLegO + uAnti * (uLegLen - x) + (uTailR * cos(ang) + uTailU * sin(ang)) * R;
}
void main(){
  float t = aPar.x;
  vec3 c0 = centre(t), c1 = centre(t + 0.004);
  vec3 dir = normalize(c1 - c0 + vec3(1e-5)), vd = c0 - cameraPosition;
  float dist = length(vd);
  vec3 side = normalize(cross(dir, vd / max(dist, 1e-3)) + vec3(0., 1e-5, 0.));
  float along = dot(c0 - uLegO, uAnti), x = uLegLen - along;
  float w0 = aPar.z * (0.45 + min(x, 700.) / 380.);
  float wd = max(w0, dist * 0.0016);
  vec3 p = c0 + side * aPar.y * wd;
  float rim = step(aArm.z, 0.);
  vX = aPar.y; vA = along + rim * t * 400.; vSeed = aPar.w;
  vHot = max(rim, 1. - smoothstep(0., 260., x));
  vFade = mix(smoothstep(0., 0.1, t), 1., rim) * smoothstep(5., 26., dist) * min(1., w0 / wd * 1.6) * smoothstep(3400., 1900., dist);
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
}`,pa=`
precision highp float;
varying float vX, vA, vSeed, vFade, vHot;
uniform float uTime, uVorG; uniform vec3 uIonC, uWarm;
${ce}
void main(){
  float x = vX * vX;
  float core = exp(-x * 16.) * 1.4 + exp(-x * 3.2) * 0.5 * (1. - x);
  float knots = 0.3 + 1.25 * vn(vec2(vA * 0.012 - uTime * 1.3 + vSeed * 50., vSeed * 9.));
  float fine = 0.7 + 0.6 * vn(vec2(vA * 0.07 - uTime * 6., vSeed * 3.));
  vec3 base = mix(uIonC, uWarm, step(0.78, fract(vSeed * 13.7)) * 0.8);
  vec3 col = mix(base, vec3(0.8, 0.92, 1.0), exp(-x * 26.) * 0.6 + 0.3 * vHot) * core * knots * knots * fine * uVorG * (1. + 1.6 * vHot);
  gl_FragColor = vec4(col * vFade, 1.);
}`,ga=`
uniform vec3 uLegO, uAnti, uTailR, uTailU; uniform float uTime, uLegLen;
varying vec3 vW, vN; varying vec2 vH;                       // vH: metres before the ring, angle round the axis
void main(){
  float x = 1050. * uv.y * uv.y, th = uv.x * 6.2832;
  float fl = smoothstep(520., 1000., x);
  float R = 13.4 + 0.122 * x + 112. * fl * fl + 1.2 * sin(x * 0.045 - uTime * 2.2 + th * 3.);
  vec3 rad = uTailR * cos(th) + uTailU * sin(th);
  vW = uLegO + uAnti * (uLegLen - x) + rad * R;
  vN = normalize(rad + uAnti * (0.122 + 0.3 * fl));
  vH = vec2(x, th);
  gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.);
}`,wa=`
precision highp float;
varying vec3 vW, vN; varying vec2 vH;
uniform float uTime, uHornG; uniform vec3 uIonC, uWarm;
${ce}
void main(){
  float x = vH.x, R = 13.4 + 0.122 * x;
  float sa = vH.y - 3.3 * log(R / 13.4) - 1.5 * exp(-x / 30.) - uTime * 0.22;      // constant along an arm of the braid
  vec2 c = vec2(cos(sa), sin(sa));
  float lx = log(1. + x / 40.);
  float st = vn(c * 2.6 + vec2(lx * 1.3 - uTime * 0.25, 4.)) * 0.55 + vn(c * 7.5 + vec2(9., lx * 3.5 - uTime * 0.5)) * 0.3 + vn(c * 19. + vec2(lx * 8. - uTime * 0.9, 2.)) * 0.15;
  vec3 V = vW - cameraPosition; float dist = length(V); V /= max(dist, 1e-3);
  float edge = 1. / (abs(dot(normalize(vN), V)) + 0.22);                           // the wall thickens toward its silhouette
  float hot = exp(-x / 170.);
  float body = (0.06 + 1.5 * st * st * st) * edge * (0.35 + 1.6 * hot);
  float fade = smoothstep(1050., 620., x) * smoothstep(0., 22., x) * smoothstep(8., 60., dist) * smoothstep(3600., 2200., dist);
  vec3 col = mix(mix(uIonC, vec3(0.5, 0.42, 1.0), 0.35 * (1. - hot)), vec3(0.85, 0.94, 1.0), 0.6 * hot) + uWarm * 0.3 * st * hot;
  gl_FragColor = vec4(col * body * fade * uHornG, 1.);
}`,xa=`
varying vec2 vQ; varying float vDist;
void main(){
  vQ = position.xy;
  vec4 w = modelMatrix * vec4(position, 1.);
  vDist = length(w.xyz - cameraPosition);
  gl_Position = projectionMatrix * viewMatrix * w;
}`,ya=`
precision highp float;
varying vec2 vQ; varying float vDist;
uniform float uTime, uWhirlG, uHole, uRad; uniform vec3 uIonC, uWarm;
${ce}
void main(){
  float r = length(vQ);
  float th = atan(vQ.y, abs(vQ.x) < 1e-4 ? 1e-4 : vQ.x);
  float lr = log(max(r, 1.) / uHole);
  float sp = th * 5. + lr * 7.5 + uTime * 0.9;
  float arms = 0.5 + 0.5 * sin(sp); arms *= arms;
  float sp2 = th * 13. - lr * 17. - uTime * 1.6;
  float fil = 0.5 + 0.5 * sin(sp2 + 3. * sin(sp * 0.5)); fil = fil * fil * fil;
  vec2 pn = vec2(cos(th), sin(th)) * 3.;
  float n = vn(pn + vec2(lr * 6. + uTime * 0.7, 3.)) * 0.6 + vn(pn * 3.1 + vec2(lr * 15. + uTime * 1.3, 9.)) * 0.4;
  float fall = pow(uHole / max(r, uHole), 0.85);
  float rimw = (r - uHole * 1.12) / (uHole * 0.11);
  float rim = exp(-rimw * rimw) * (0.75 + 0.5 * n);
  float edge = (1. - smoothstep(uRad * 0.55, uRad, r)) * smoothstep(uHole * 0.98, uHole * 1.08, r);
  float body = (0.1 + 1.0 * arms * (0.35 + n) + 0.55 * fil * n) * fall * 1.5;
  vec3 col = mix(uIonC, vec3(0.82, 0.93, 1.0), clamp(fall * 0.9 + rim, 0., 1.)) * (body + rim * 2.6);
  col += uWarm * 0.35 * fil * arms * fall;
  gl_FragColor = vec4(col * edge * uWhirlG * smoothstep(3., 30., vDist), 1.);
}`,ba=`
attribute vec3 aSheet;                                   // metres along, across -1..1, sheet index
uniform float uTime; uniform vec3 uTailU;
varying vec3 vS, vW;
void main(){
  vec3 p = position + uTailU * (sin(aSheet.x * 0.0035 + uTime * 0.25 + aSheet.y * 2. + aSheet.z) * 7. + sin(aSheet.x * 0.011 - uTime * 0.4) * 2.);
  vS = aSheet; vW = p;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
}`,Sa=`
precision highp float;
varying vec3 vS, vW;
uniform float uTime, uDustG, uA0, uA1; uniform vec3 uDustC, uAnti;
${ce}
${Co}
void main(){
  float a = vS.x, x = vS.y, k = vS.z;
  float edge = pow(max(1. - x * x, 0.), 1.6);
  float s1 = vn(vec2(a * 0.0042 + x * 2.0 - uTime * 0.02, x * 2.6 + k * 7.3));
  float comb = vn(vec2(a * 0.017 + x * 13. + k * 3., x * 1.9 - uTime * 0.035 * (1.5 + x)));
  float fine = vn(vec2(a * 0.06 + x * 47., k * 5. + uTime * 0.02));
  float hair = vn(vec2(x * 170. + a * 0.004 + k * 11., a * 0.016 - uTime * 0.25));       // hair-fine striae, read from close above
  float body = (0.3 + 1.15 * s1 * s1) * (0.4 + 1.1 * comb * comb) * (0.7 + 0.6 * fine) * (0.72 + 0.6 * hair);
  float fa = smoothstep(uA0, uA0 + 500., a) * smoothstep(uA1, uA1 - 1800., a);
  float near = smoothstep(5., 42., length(vW - cameraPosition));
  float k0 = 1. - step(0.5, k);                                   // the sheet we skim: brighter, creamier, visibly combed
  body *= mix(1., (0.6 + 1.2 * hair * hair) * 1.25, k0);
  vec3 dc = mix(uDustC, vec3(1., 0.95, 0.84), 0.45 * k0);
  body *= 1. - 0.8 * smoothstep(0.25, 0.8, dot(normalize(vW - cameraPosition + vec3(0., 1e-4, 0.)), -uAnti));   // (polish) looking back up-sun the sheets thin out, so the nucleus and its jets are not veiled
  gl_FragColor = vec4(dc * uDustG * body * edge * fa * near * mix(1., sailShadow(vW), k0), 1.);   // only the sheet we skim takes the shadow: one kite, not four
}`,Aa=`
attribute vec4 aLeg;                                     // along, left, up, seed (leg frame, metres)
uniform vec3 uLegO, uAnti, uTailR, uTailU; uniform float uTime, uA0, uA1; uniform vec2 uRes;
varying float vAl; varying vec3 vW;
void main(){
  float span = uA1 - uA0, a = uA0 + mod(aLeg.x + uTime * (10. + 25. * aLeg.w), span);
  vec3 w = uLegO + uAnti * a - uTailR * aLeg.y + uTailU * (aLeg.z + 6. * sin(uTime * 0.2 + aLeg.w * 40.));
  vec4 mv = viewMatrix * vec4(w, 1.);
  gl_Position = projectionMatrix * mv;
  float sz = (2. + 7. * fract(aLeg.w * 7.13)) * projectionMatrix[1][1] * uRes.y * 0.5 / max(-mv.z, 1.);
  vAl = smoothstep(0., 150., a - uA0) * smoothstep(0., 150., uA1 - a) * smoothstep(12., 60., -mv.z) * min(1., sz / 2.) * (0.4 + 0.6 * fract(aLeg.w * 3.7));
  vW = w;
  gl_PointSize = clamp(sz, 2., 56.);
}`,Ca=`
precision highp float;
varying float vAl; varying vec3 vW;
uniform vec3 uDustC; uniform float uMoteG;
${Co}
void main(){
  vec2 q = gl_PointCoord * 2. - 1.; float r = dot(q, q);
  float a = (1. - smoothstep(0., 1., r)); a *= a;
  gl_FragColor = vec4(uDustC * uMoteG * a * vAl * sailShadow(vW), 1.);
}`,Ta=`
attribute vec3 aSeed; attribute vec3 aCorner;            // corner: along 0..1, side -1..1, rnd
uniform vec3 uCam, uBox, uRel, uDrift; uniform float uAmt;
varying float vA; varying vec2 vQ;
void main(){
  vec3 c = mod(aSeed * uBox + uDrift - uCam, uBox) - 0.5 * uBox;
  vec3 e = abs(c) / (0.5 * uBox);
  float fade = (1. - smoothstep(0.75, 1., max(e.x, max(e.y, e.z))));
  float sp = length(uRel), dist = length(c);
  vec3 dir = uRel / max(sp, 1e-3);
  float len = clamp(sp * 0.018, 0.2, 3.5) * (0.5 + aCorner.z);
  vec3 side = normalize(cross(dir, c / max(dist, 1e-3)) + vec3(1e-5, 0., 0.));
  float wd = max(0.02, dist * 0.0011);
  vec3 p = uCam + c + dir * len * (aCorner.x - 0.5) + side * aCorner.y * wd;
  vA = fade * step(aCorner.z, uAmt) * smoothstep(1.2, 3., dist) * min(1., 0.02 / wd * 2.);
  vQ = aCorner.xy;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
}`,Ma=`
precision highp float;
varying float vA; varying vec2 vQ;
uniform vec3 uGrain; uniform float uGrainI;
void main(){
  float a = (1. - vQ.y * vQ.y) * smoothstep(0., 0.15, vQ.x) * (0.35 + 0.65 * vQ.x);
  gl_FragColor = vec4(uGrain * uGrainI * a * vA, 1.);
}`,Ra=`
attribute vec3 color; attribute vec3 aRig;               // shroud sag, sling weight, spar-tip weight
uniform float uSlack, uSway, uFlex, uTime;
varying vec3 vN, vC, vR;
void main(){
  vec3 p = position;
  p.y += aRig.z * uFlex;
  p.x += aRig.y * uSway; p.y += aRig.y * abs(uSway) * 0.12;
  p += vec3(sign(p.x) * 0.3, -0.55, 0.15) * aRig.x * uSlack * (1. + 0.25 * sin(uTime * 1.3 + p.y * 0.8));
  vN = normal; vC = color; vR = p;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
}`,za=`
precision highp float;
varying vec3 vN, vC, vR;
uniform vec3 uSunRig, uSunC, uIonC; uniform float uDay, uNightK, uIonRim;
void main(){
  vec3 N = normalize(vN);
  if (!gl_FrontFacing) N = -N;
  vec3 key = mix(uSunC, vec3(1.), 0.5);                                       // metal: a neutral key, not a khaki one
  float ndl = max(dot(N, uSunRig), 0.);
  vec3 col = vC * key * uDay * (1.5 * ndl + 0.2 * max(-N.y, 0.) + 0.05);
  vec3 R = reflect(-uSunRig, N);
  float sp = max(R.z, 0.), sp2 = sp * sp, sp8 = sp2 * sp2 * sp2 * sp2;
  col += key * uDay * (sp8 * sp8 * sp8 * sp8 * sp8 * 2.2 + sp8 * 0.12) * (0.4 + 4. * vC.g);   // a tight glint running along every tube
  col += uIonC * uIonRim * (0.05 + 1.2 * vC.b) * pow(max(-N.x * 0.85 + N.y * 0.35, 0.), 2.);   // the ion tail on the port side
  col += (uIonC * 0.02 * max(N.y, 0.) + vec3(0.014, 0.018, 0.03) * (0.6 + 0.4 * N.z)) * uNightK;
  col += uSunC * 0.035 * max(dot(N, uSunRig) + 0.3, 0.) * (1. - uDay);        // the corona on the rig
  // pale carbon: the spars carry a rim of light on both edges, so the frame of the sail reads against the foil
  float rimE = 1. - abs(dot(N, normalize(-vR + vec3(0., 0., 1e-4))));
  col += vC.b * rimE * rimE * (key * (0.07 + 0.85 * uDay) + uIonC * uIonRim * 0.6);
  col += vC.b * vec3(0.05, 0.06, 0.085) * uNightK;
  gl_FragColor = vec4(col, 1.);
}`,To=`
float disp(vec2 q){
  if (uGyro > 0.5) { float r = length(q); return sin(r * 0.35 - uTime * 1.4) * 0.012 * r - r * r * 0.0035 * uWr + sin(r * 1.3 + uTime * 2.3) * 0.05 * uWr; }
  float m = smoothstep(0., 1.2, abs(abs(q.x) - abs(q.y)) / 12.);          // four gores billowing between the spars, no crease at the spars
  float slack = sin(q.x * 0.9 + uTime * 0.7 + sin(q.y * 0.6 - uTime * 0.4) * 1.3) * 0.5
              + sin(q.y * 1.3 - uTime * 0.55 + q.x * 0.4) * 0.35 + sin((q.x + q.y) * 2.1 + uTime * 0.9) * 0.15;
  float trail = smoothstep(7., 12., q.y) * sin(q.x * 1.7 + uTime * 5.) * 0.1;
  return m * (uWr * (0.42 * slack - 0.4 * m) + (1. - uWr) * 0.4 * m) + trail + dot(q, q) / 288. * uFlex;
}`,ka=`
uniform float uWr, uTime, uFlex, uSpin, uGyro;
varying vec3 vN; varying vec2 vUv, vQ;
${To}
void main(){
  vec2 q = position.xz;
  float cs = cos(uSpin), sn = sin(uSpin);
  q = vec2(cs * q.x - sn * q.y, sn * q.x + cs * q.y);
  float d0 = disp(q), e = 0.3;
  vN = normalize(vec3(-(disp(q + vec2(e, 0.)) - d0) / e, 1., -(disp(q + vec2(0., e)) - d0) / e));
  vUv = q / 24. + 0.5; vQ = q;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(q.x, d0, q.y, 1.);
}`,Ia=`
precision highp float;
varying vec3 vN; varying vec2 vUv, vQ;
uniform vec3 uFoilTint, uSunRig; uniform float uDay, uWr, uHi, uFoilTail, uGyro, uGround, uScroll, uIonRim, uScal;
uniform float uFlex;
${ce}
${bo}
${To}
void main(){
  // a sail, not a slab: each edge is a catenary hem drawn in between two spar tips
  vec2 aq = abs(vQ); float mx = max(aq.x, aq.y), mn = min(aq.x, aq.y);
  float ed = 12. - uScal * (1. - mn * mn / 144.) - mx;          // metres inside the hem
  if (ed < 0. && uGyro < 0.5) discard;
  float px = 0.7 * length(fwidth(vQ));                           // metres per pixel on the foil
  // wrinkles per pixel, so reflections bend smoothly instead of breaking into facets
  float d0 = disp(vQ), e = 0.12;
  vec3 N = normalize(vec3(-(disp(vQ + vec2(e, 0.)) - d0) / e, 1., -(disp(vQ + vec2(0., e)) - d0) / e));
  // the mirror: the tails behind us, their vanishing point just under the leading hem, so the ion rays cross the foil as
  // separate straight blue strokes when it is taut and swim when it is slack; the cream tail shows at the starboard end
  float wk = mix(0.07, 0.3, clamp(uWr, 0., 1.));
  vec3 d = normalize(uAnti * 0.8 + uTailR * ((vUv.x - 0.44) * 1.9 + N.x * wk) + uTailU * ((vUv.y + 0.1) * 2.8 - (vUv.x - 0.5) * 0.9 + N.z * wk));
  vec3 mir = mix(vec3(1.), uFoilTint, 0.3);                     // a mirror keeps the colour of what it shows
  vec3 col = tails(d) * uFoilTail * mir;
  col += mir * vec3(0.016, 0.024, 0.044) * (0.25 + 2. * abs(N.x) + 2. * abs(N.z)) * uNightK;       // starlight on the creases
  // the crust below, mirrored: only a breath of toast, and a bright streak wherever a fountain stands
  float gs = vn(vec2(vUv.x * 6. + N.x * 4., vUv.y * 5. - uScroll));
  float jet = vn(vec2(vUv.x * 22. + N.x * 9., vUv.y * 2.5 - uScroll * 1.6)); jet *= jet; jet *= jet * jet;
  col += mir * uGround * (uSunC * vec3(0.008, 0.006, 0.004) * (0.25 + 1.5 * gs * gs) + vec3(1., 0.97, 0.9) * 0.4 * jet);
  // gore seams radiating from the hub: sixteen, four of them over the spars
  float ang = atan(vQ.x, abs(vQ.y) < 1e-4 ? 1e-4 : vQ.y);
  float sd = abs(fract(ang * 2.5465 + 0.5) - 0.5) * 0.3927 * length(vQ);
  float sw = max(px, 0.03);
  float seam = (1. - smoothstep(sw * 0.6, sw * 1.8, sd)) * (1. - uGyro) * min(1., 0.05 / sw);
  vec3 key = mix(uSunC, vec3(1.), 0.55) * uFoilTint;
  col *= 1. - 0.55 * seam;
  col += seam * (key * uDay * 0.035 + vec3(0.006, 0.008, 0.013) * uNightK);
  // lit: a taut sheet with one blazing glint sliding along it, drawn out into a streak (never a round lamp)
  vec2 hp = vec2(0.5 + 0.3 * sin(uHi * 0.9), 0.082 + 0.02 * cos(uHi * 1.3));
  vec2 dq = vUv - hp + N.xz * 0.25;
  float hi = exp(-dq.x * dq.x / 0.0016 - dq.y * dq.y / 0.00003) * 2.2 + exp(-dot(dq, dq) / 0.00011) * 4.;
  float sheen = 0.002 + 0.012 * pow(max(1. - abs(N.y), 0.), 0.5);
  col += key * uDay * sheen + mix(uFoilTint, vec3(1.), 0.7) * uDay * hi;
  // the hem cord: a pale line that catches whatever light there is
  float hw = max(0.11, px * 1.6);
  float hem = (1. - smoothstep(hw * 0.5, hw, ed)) * (1. - uGyro);
  vec3 hemC = vec3(0.1, 0.13, 0.2) * uNightK + key * uDay * 0.5 + uIonC * uIonRim * 0.45;
  col = mix(col, hemC, hem);
  gl_FragColor = vec4(col, 1.);
}`,Na=`
attribute vec4 aGlow;                                    // xyz centre, w size in metres
uniform vec2 uRes; uniform float uMinPx;
varying float vK;
void main(){
  vec4 mv = viewMatrix * vec4(aGlow.xyz, 1.);
  gl_Position = projectionMatrix * mv;
  float sz = aGlow.w * projectionMatrix[1][1] * uRes.y * 0.5 / max(-mv.z, 1.);
  vK = min(1., sz / uMinPx); vK = mix(1., vK * vK, step(sz, uMinPx));
  gl_PointSize = clamp(sz, uMinPx, 120.);
}`,Pa=`
precision highp float;
varying float vK; uniform vec3 uCol; uniform float uPulse;
void main(){
  vec2 q = gl_PointCoord * 2. - 1.; float r = length(q);
  float a = exp(-r * r * 22.) * 3. + pow(max(1. - r, 0.), 3.) * 0.5;
  gl_FragColor = vec4(uCol * a * uPulse * max(vK, 0.35), 1.);
}`;function Q(h,Z,B,G){const U=h.attributes.position.count,M=new Float32Array(U*3);for(let w=0;w<U;w++)M[w*3]=Z,M[w*3+1]=B,M[w*3+2]=G;return h.setAttribute("color",new t.BufferAttribute(M,3)),h}function te(h,Z){const B=h.attributes.position,G=new Float32Array(B.count*3),U=[0,0,0];for(let M=0;M<B.count;M++)Z(B.getX(M),B.getY(M),B.getZ(M),U),G[M*3]=U[0],G[M*3+1]=U[1],G[M*3+2]=U[2];return h.setAttribute("aRig",new t.BufferAttribute(G,3)),h}function Ne(h,Z,B,G,U,M){const w=new t.Vector3(...h),A=new t.Vector3(...Z),Ce=w.distanceTo(A),q=new t.CylinderGeometry(G,B,Ce,U,6,!0);return q.translate(0,Ce/2,0),q.applyQuaternion(new t.Quaternion().setFromUnitVectors(new t.Vector3(0,1,0),A.clone().sub(w).normalize())),q.translate(w.x,w.y,w.z),Q(q.toNonIndexed(),M[0],M[1],M[2])}var _a={id:"comet-perihelion",name:"Perihelion",category:"sky",media:["space"],weirdness:.3,async build(h){const{rng:Z}=h,B=h.vary||{hour:"any",rare:!1,density:1,mood:.5},G=h.quality?.detail??1,U=ue(B.density??1,.7,1.3),M=(U-.7)/.6,w=Z.fork("perihelion-looks"),A=["crown","grazer","small"][Math.floor(w()*3)],Ce=["twin","potato","rust"][Math.floor(w()*3)],q=["duo","sodium","coma"][Math.floor(w()*3)],Tt=["mirror","mirror","gold","gyro"][Math.floor(w()*4)],oe={night:11.2,day:6.4,dawn:8,golden:9.4}[B.hour]??w.pick([7.5,8.5,8.5,9.5]),de=ua(w.int(1,1e9)),ut=48,I=new t.Scene;I.background=new t.Color(0);const He=yo.map(e=>new t.Color(e)),Mt=15*ge,ct=5*ge,F=new t.Vector3(Math.sin(Mt)*Math.cos(ct),Math.sin(ct),Math.cos(Mt)*Math.cos(ct)),O=new t.Vector3().crossVectors(F,new t.Vector3(0,1,0)).normalize(),H=new t.Vector3().crossVectors(O,F).normalize(),Pe=[[0,14,325],[0,14,150],[0,14,-25],[0,21,-110],[0,37,-200],[0,52,-280],[0,60,-325]],dt=330,Mo=195*ge;for(let e=1;e<=13;e++){const o=e/13,a=o*Mo,n=60+580*(.15*o+.85*o*o*(3-2*o));Pe.push([-dt+dt*Math.cos(a),n,-325-dt*Math.sin(a)])}const Rt=new t.Vector3(...Pe[Pe.length-1]),Ve=900,Ge=650,we=Rt.clone().addScaledVector(O,Ve).addScaledVector(H,Ge),fe=2200,zt=e=>1-Ae(40,760,e),Ke=(e,o,a,n,r)=>Ae(o,a,e)*(1-Ae(n,r,e)),ft=e=>-Ve*zt(e)-42*Ae(780,980,e)-78*Ae(1150,1500,e)+120*Ae(1560,1900,e),vt=e=>-Ge*zt(e)+26*Ke(e,1150,1500,1560,1880);for(const e of[100,200,300,400,500,600,700,800,900,1050,1200,1350,1500,1640,1725,1810,1895,1980,2090,fe])Pe.push(we.clone().addScaledVector(F,e).addScaledVector(O,ft(e)).addScaledVector(H,vt(e)));await h.yield();const L=la(Pe,{samples:640});await h.yield();const R=L.length,kt=new t.Vector3;let je=.4;{let e=1e9;for(let o=600;o<=1400;o++){const a=L.pointAt(o/2e3,kt).distanceTo(Rt);a<e&&(e=a,je=o/2e3)}}const ae=je*R,mt=e=>e<=je?e*R-ae:L.pointAt(Math.min(e,1),kt).sub(we).dot(F),Ro=e=>{let o=je,a=1;for(let n=0;n<20;n++){const r=(o+a)/2;mt(r)<e?o=r:a=r}return(o+a)/2},v=Ae,It=e=>40+8*v(330,600,e)+82*v(600,ae,e)+10*v(ae-200,ae+500,e)+60*Ke(e-ae,100,400,800,1100)-40*Ke(e-ae,1050,1250,1500,1750)+34*v(ae+1600,ae+1900,e)-74*v(R-800,R-150,e),Nt=e=>It(ue(e,0,1)*R)/86,ve=512,xe=new Float32Array(ve+1);{const e=new Float32Array(65);for(let a=0;a<=64;a++)e[a]=ue(Nt(a/64),.35,2.5);const o=a=>{const n=a*64,r=Math.min(63,Math.floor(n));return e[r]+(e[r+1]-e[r])*(n-r)};for(let a=1;a<=ve;a++)xe[a]=xe[a-1]+1/ve/o((a-.5)/ve);for(let a=1;a<=ve;a++)xe[a]*=ut/xe[ve]}const ht=e=>{const o=ue(e,0,1)*ve,a=Math.min(ve-1,Math.floor(o));return xe[a]+(xe[a+1]-xe[a])*(o-a)},Xe=e=>{let o=0,a=1;for(let n=0;n<22;n++){const r=(o+a)/2;ht(r)<e?o=r:a=r}return(o+a)/2},$e=new t.Vector3,zo=new t.Vector3,ko=L.pointAt(Xe(oe),$e).z;let Pt=.1;for(let e=0;e<.3;e+=.002)if(L.pointAt(e,$e).z<-195){Pt=e;break}const me=Math.max(ht(Pt)-.6,oe+1.2);await h.yield();const re=A==="grazer"?1.32:A==="small"?.78:1,ne=await ca(h,{palette:yo,duration:ut,arriveTime:oe,arriveZ:ko,lineSpeed:30,cliffTime:me,vigor:re,vents:Math.round(k(22,28,M)),farVents:Math.round(k(26,60,M)),crust:Ce==="rust"?"rust":"charcoal",detail:G});I.add(ne.object);const pt=ne.uniforms,Fe=ne.anchors,Io=A==="grazer"?6:A==="small"?4.4:5.2,Te=pt.uAway.value,Ga=(e,o)=>e*Te.x+o*Te.y,No=(e,o)=>ne.lineTime(e,o);await h.yield();const Vt=He[6].clone(),Po=He[5].clone().multiply(new t.Color(1.03,.93,.9)),Vo=new t.Color("#3fe0b0");q==="coma"&&Vt.lerp(new t.Color("#bfe6ff"),.55);const Ye=(A==="grazer"?10:A==="small"?1.6:4.5)*ge,b={uTime:{value:0},uS:{value:0},uSunDir:{value:new t.Vector3(0,0,-1)},uAnti:{value:F},uTailR:{value:O},uTailU:{value:H},uSunC:{value:He[3].clone()},uIonC:{value:Vt},uDustC:{value:Po},uSodC:{value:new t.Color("#ffb040")},uComaC:{value:Vo},uSunR:{value:Ye},uCorR:{value:Math.max(Ye*.8,4.2*ge)},uCorona:{value:A==="grazer"?1.25:A==="small"?.8:1},uDiscI:{value:A==="small"?7:A==="grazer"?1.75:2.7},uProm:{value:A==="grazer"?1:A==="small"?0:.35},uIonI:{value:(A==="small"?1.7:1)*(q==="coma"?.7:1)},uDustI:{value:A==="grazer"?.5:A==="small"?.14:.24},uSod:{value:q==="sodium"?1.3:0},uComa:{value:q==="coma"?1:0},uNightK:{value:1},uCrown:{value:.3},uDay:{value:0},uRes:{value:new t.Vector2(800,450)},uLegO:{value:we},uLegLen:{value:fe},uSailP:{value:new t.Vector3},uShOn:{value:0},uShD:{value:F.clone().addScaledVector(H,-.32).addScaledVector(O,.1).normalize()},uShR:{value:new t.Vector3},uShU:{value:new t.Vector3},uShT:{value:0},uGrain:{value:He[4].clone()}};b.uShR.value.crossVectors(b.uShD.value,new t.Vector3(0,1,0)).normalize(),b.uShU.value.crossVectors(b.uShR.value,b.uShD.value).normalize();const K=(...e)=>{const o={};for(const a of e)o[a]=b[a]||pt[a];return o},Gt=["uSunDir","uAnti","uTailR","uTailU","uSunC","uIonC","uDustC","uSodC","uComaC","uSunR","uCorR","uTime","uCorona","uIonI","uDustI","uSod","uComa","uDiscI","uProm","uNightK","uCrown"],j={transparent:!0,depthWrite:!1,blending:t.AdditiveBlending,side:t.DoubleSide},Ft=F.clone().addScaledVector(O,-.47).addScaledVector(H,.21).normalize(),Go=new t.Vector3().crossVectors(Ft,H.clone().multiplyScalar(.75).addScaledVector(O,-.65)).normalize(),De=new t.ShaderMaterial({vertexShader:da,fragmentShader:fa,side:t.BackSide,depthWrite:!1,uniforms:{...K(...Gt),uStars:{value:.75},uTailSky:{value:.28},uSoft:{value:0},uHaze:{value:1},uBand:{value:1.5},uBandN:{value:Go},uBandX:{value:Ft},uNucDir:{value:new t.Vector3(0,-1,0)},uNucR:{value:1},uComaG:{value:.1}}}),gt=new t.Mesh(new t.IcosahedronGeometry(1,3),De);gt.renderOrder=-1,gt.frustumCulled=!1,I.add(gt);const Ze=(e,o,a)=>({...K("uLineQ","uRc","uElevMax","uSunI","uIce","uAway","uSunCol","uIonCol","uCrust","uFrostCol","uTime","uComa","uComaC","uNightK"),uTex:{value:e},uBump:{value:o},uRim:{value:e<.1?.4:0},uThread:{value:0},uOct:{value:e<.1?1:0},uLocal:{value:0},uFill:{value:0},uThB:{value:Ce==="potato"?new t.Vector4(650,950,-5,30):new t.Vector4(1250,1750,50,220)},uBeacon:{value:a||new t.Vector4(0,0,0,0)}}),X=Ce==="potato",Fo=new t.Vector3(0,-380,X?-330:125),Do=780,J=X?[{c:[0,-690,-330],r:[820,660,1680],sw:360,sh:230,amp:.05,f:1.6}]:[{c:[0,-690,125],r:[760,660,1250],sw:316,sh:202,amp:.05,f:1.6},{c:[-170,-360,-1190],r:[600,470,460],sw:154,sh:96,amp:.09,f:2.1},{c:[720,150,-1800],r:[760,740,800],sw:96,sh:60,amp:.085,f:2.4}],Dt=(e,o,a,n,r)=>{const s=de.fbm3(o*e.f+3.1,a*e.f,n*e.f+7.7,4),l=de.n3(o*e.f*.45,a*e.f*.45+5,n*e.f*.45),i=1+e.amp*(s+.8*l);let d=e.c[0]+o*e.r[0]*i,c=e.c[1]+a*e.r[1]*i,p=e.c[2]+n*e.r[2]*i;if(e===J[0]){const m=Math.hypot(d/300,p/500);if(m<1.3&&a>0){const u=ue(d,-300,300),y=ue(p,-500,500),g=Math.hypot(u/300,y/500),f=ne.heightAt(u,y)+Math.max(0,g-1)*260-k(30,3,v(.84,.99,m));c=k(k(Math.min(c,f),f,v(.84,.95,m)),c,v(1,1.3,m))}if(X&&a>0){const u=Math.hypot(d+60,p+800);c+=-150*(1-v(70,175,u))+95*Math.exp(-(((u-200)/60)**2))}}return r[0]=d,r[1]=c,r[2]=p,r[3]=s,r},$=[0,0,0,0],wt=J.reduce((e,o)=>e+(o.sw+1)*(o.sh+1),0),Bo=J.reduce((e,o)=>e+6*o.sw*(o.sh-1),0),S=new Float32Array(wt*3),V=new Float32Array(wt*3),Je=new Float32Array(wt*3),ee=new Uint32Array(Bo),qo=new t.Matrix4().makeRotationX(Math.PI/2),Lo=new t.Matrix4().makeRotationZ(Math.PI/2),Bt=Math.PI*2,_=new t.Vector3,qt=new t.Vector3,xt=new t.Vector3,Lt=new t.Vector3,Y=new t.Vector3,Ut=new t.Vector3;let et=0,Be=0;for(const e of J){const o=e.sw,a=e.sh,n=o+1,r=n*(a+1),s=6*o*(a-1);for(let l=0;l<r;l++){const i=l%n/o,d=Math.floor(l/n)/a,c=(et+l)*3;S[c]=-Math.cos(i*Bt)*Math.sin(d*Math.PI),S[c+1]=Math.cos(d*Math.PI),S[c+2]=Math.sin(i*Bt)*Math.sin(d*Math.PI),_.set(S[c],S[c+1],S[c+2]).applyMatrix4(qo),S[c]=_.x,S[c+1]=_.y,S[c+2]=_.z,_.set(S[c],S[c+1],S[c+2]).applyMatrix4(Lo),S[c]=_.x,S[c+1]=_.y,S[c+2]=_.z,Dt(e,S[c],S[c+1],S[c+2],$),S[c]=$[0],S[c+1]=$[1],S[c+2]=$[2];const p=.85+.35*$[3];Je[c]=p,Je[c+1]=p,Je[c+2]=p,l%400===399&&await h.yield()}await h.yield();for(let l=0,i=Be;l<a;l++){for(let d=0;d<o;d++){const c=et+l*n+d,p=c+1,m=c+n,u=m+1;l!==0&&(ee[i++]=p,ee[i++]=c,ee[i++]=u),l!==a-1&&(ee[i++]=c,ee[i++]=m,ee[i++]=u)}l%24===23&&await h.yield()}await h.yield();for(let l=Be;l<Be+s;l+=3){const i=ee[l]*3,d=ee[l+1]*3,c=ee[l+2]*3;qt.set(S[i],S[i+1],S[i+2]),xt.set(S[d],S[d+1],S[d+2]),Lt.set(S[c],S[c+1],S[c+2]),Y.subVectors(Lt,xt),Ut.subVectors(qt,xt),Y.cross(Ut),V[i]+=Y.x,V[i+1]+=Y.y,V[i+2]+=Y.z,V[d]+=Y.x,V[d+1]+=Y.y,V[d+2]+=Y.z,V[c]+=Y.x,V[c+1]+=Y.y,V[c+2]+=Y.z,(l-Be)%6e3===5997&&await h.yield()}await h.yield();for(let l=0;l<r;l++){const i=(et+l)*3;_.set(V[i],V[i+1],V[i+2]).normalize(),V[i]=_.x,V[i+1]=_.y,V[i+2]=_.z,l%4e3===3999&&await h.yield()}et+=r,Be+=s,await h.yield()}const qe=new t.BufferGeometry;qe.setIndex(new t.BufferAttribute(ee,1)),qe.setAttribute("position",new t.BufferAttribute(S,3)),qe.setAttribute("normal",new t.BufferAttribute(V,3)),qe.setAttribute("color",new t.BufferAttribute(Je,3)),await h.yield();const tt=new t.Mesh(qe,new t.ShaderMaterial({vertexShader:st,fragmentShader:lt,uniforms:Ze(.012,2.2)}));tt.frustumCulled=!1,I.add(tt),await h.yield();const yt=[],Me=(e,o,a,n,r,s,l)=>{const i=Math.hypot(o,a,n);Dt(e,o/i,a/i,n/i,$);const d=new t.Vector3(o/(i*e.r[0]),a/(i*e.r[1])+2.6/e.r[1],n/(i*e.r[2])).normalize();yt.push({p:[$[0],$[1]-6,$[2]],up:d,h:r,w:s,t0:l?-1:No($[0],$[2])+w.range(.5,1.6),seed:w()})},Le=Math.round(k(9,16,M));if(X){for(let e=0;e<Le;e++){const o=w.range(0,6.283),a=w.range(70,190),n=-60+Math.cos(o)*a,r=-800+Math.sin(o)*a;Me(J[0],n/820,.97,(r+330)/1680,w.range(260,620)*re,w.range(9,16),!0)}for(let e=0;e<Le;e++)Me(J[0],w.range(-.55,.55),.8,w.range(-.75,-.42),w.range(200,520)*re,w.range(10,18),!0)}else{for(let e=0;e<Le+6;e++)Me(J[1],w.range(-.8,.6),w.range(.55,1),w.range(-.7,.25),w.range(220,620)*re,w.range(9,17),!0);for(let e=0;e<Le;e++)Me(J[2],w.range(-1,-.2),w.range(-.1,.9),w.range(-.8,.5),w.range(300,700)*re,w.range(12,22),!0)}for(let e=0;e<Le+6;e++){const o=w.range(-.6,.6),a=w.range(.33,.8);Me(J[0],o,.85,X?a+.12:a,w.range(150,420)*re,w.range(7,13),!1)}for(let e=0;e<14;e++){const o=e&1?1:-1,a=o*w.range(.44,.74),n=w.range(-.3,.42);Me(J[0],a,Math.sqrt(Math.max(.05,1-a*a-n*n)),X?n+.2:n,w.range(170,420)*re,w.range(8,14),!1)}const Ot={value:.3*re};{const e=Ie([new t.PlaneGeometry(1,1,1,10),new t.PlaneGeometry(1,1,1,10).translate(0,0,1)]),o=new t.InstancedBufferGeometry;o.index=e.index,o.setAttribute("position",e.attributes.position),o.setAttribute("uv",e.attributes.uv);const a=yt.length,n=new Float32Array(a*3),r=new Float32Array(a*3),s=new Float32Array(a*4);yt.forEach((i,d)=>{n.set(i.p,d*3),r.set([i.up.x,i.up.y,i.up.z],d*3),s.set([i.h,i.w,i.t0,i.seed],d*4)}),o.setAttribute("iBase",new t.InstancedBufferAttribute(n,3)),o.setAttribute("iUp",new t.InstancedBufferAttribute(r,3)),o.setAttribute("iPar",new t.InstancedBufferAttribute(s,4)),o.instanceCount=a;const l=new t.Mesh(o,new t.ShaderMaterial({vertexShader:So,fragmentShader:Ao,...j,uniforms:{...K("uS","uLineQ","uRc","uAway","uTime","uGrain","uSunDir"),uPlumeI:Ot}}));l.name="far-plumes",l.frustumCulled=!1,l.renderOrder=2,I.add(l)}await h.yield();const ot=(e,o,a,n=new t.Vector3)=>n.copy(we).addScaledVector(F,e).addScaledVector(O,-o).addScaledVector(H,a),C=Z.fork("perihelion-tails"),_t={value:1},Wt={value:1},Et={value:0},at=(A==="small"?1.5:1)*(q==="coma"?.75:1),Qt=A==="grazer"?.34:A==="small"?.15:.2;{const e=[];for(let s=0;s<15;s++){const l=s/14,i=27+480*Math.pow(l,1.35)+(s?C.range(-10,10):0),d=s===0?6:C.range(-40,270),c=C.range(250,520),p=i+C.range(50,230),m=d-C.range(140,480);e.push({a0:c,l0:p+Ve*.8,h0:m-Ge*.8,l1:i,h1:d,w:s<3?C.range(2.5,4):C.range(5,13),braid:0,seg:150,seed:C()})}Object.assign(e[0],{a0:240,l0:72,h0:-12,l1:61,h1:5,w:6,seg:260}),q==="sodium"&&e.push({a0:300,l0:150+Ve*.8,h0:-250-Ge*.8,l1:-70,h1:50,w:1.3,braid:0,seg:150,seed:C(),sod:!0}),C(),C();const a=e[0].seed;Object.assign(e[0],{w:1.5,rope:[0,5.2],end:3e3,seg:560});for(let s=1;s<5;s++)e.push({...e[0],w:s&1?.9:1.3,rope:[s*1.2566,s&1?6.4:4.4],seed:a});const n=s=>{let l=0,i=0;for(const x of s)l+=(x.seg+1)*2,i+=x.seg*6;const d=new Float32Array(l*3),c=new Float32Array(l*3),p=new Float32Array(l*3),m=new Float32Array(l*4),u=new Float32Array(l),y=new Float32Array(l*2),g=new Uint32Array(i);let f=0,N=0;const z=new t.Vector3,T=new t.Vector3;for(const x of s){ot(x.a0,x.l0,x.h0,z);const D=((x.end||6300)-x.a0)/(fe-x.a0);ot(x.a0+(fe-x.a0)*D,x.l0+(x.l1-x.l0)*D,x.h0+(x.h1-x.h0)*D,T);for(let le=0;le<=x.seg;le++)for(let E=-1;E<=1;E+=2)d.set([z.x,z.y,z.z],f*3),c.set([z.x,z.y,z.z],f*3),p.set([T.x,T.y,T.z],f*3),m.set([le/x.seg,E,x.w,x.seed],f*4),u[f]=x.braid,x.rope&&y.set(x.rope,f*2),f++;const it=f-(x.seg+1)*2;for(let le=0;le<x.seg;le++){const E=it+le*2;g.set([E,E+1,E+2,E+1,E+3,E+2],N),N+=6}}const P=new t.BufferGeometry;return P.setAttribute("position",new t.BufferAttribute(d,3)),P.setAttribute("aP0",new t.BufferAttribute(c,3)),P.setAttribute("aP1",new t.BufferAttribute(p,3)),P.setAttribute("aPar",new t.BufferAttribute(m,4)),P.setAttribute("aBraid",new t.BufferAttribute(u,1)),P.setAttribute("aRope",new t.BufferAttribute(y,2)),P.setIndex(new t.BufferAttribute(g,1)),P},r=(s,l)=>{const i=new t.Mesh(n(s),new t.ShaderMaterial({vertexShader:va,fragmentShader:ma,...j,uniforms:{...K("uLegO","uAnti","uTailR","uTailU","uTime","uLegLen"),uIonC:l,uIonG:_t}}));i.frustumCulled=!1,i.renderOrder=3,I.add(i)};await h.yield(),r(e.filter(s=>!s.sod),b.uIonC),q==="sodium"&&r(e.filter(s=>s.sod),b.uSodC)}await h.yield();const Ht={value:0},Kt={value:0},jt={value:0};{const e=[],o=Z.fork("perihelion-braid"),a=Math.round(30*Math.max(.7,G));for(let f=0;f<a;f++){const N=f%5===4;e.push({ph:f*2.39996+o.range(-.2,.2),rf:N?o.range(.45,.75):o.range(.88,1.22),x0:N?o.range(380,700):o.range(820,1350),w:N?o.range(.9,1.5):o.range(1.3,3.2),seg:150,seed:o()})}for(let f=0;f<3;f++)e.push({ph:f*2.1,rf:1+f*.09,x0:-1,w:.75-f*.15,seg:96,seed:o()});let n=0,r=0;for(const f of e)n+=(f.seg+1)*2,r+=f.seg*6;const s=new Float32Array(n*3),l=new Float32Array(n*4),i=new Float32Array(n*3),d=new Uint32Array(r);let c=0,p=0;for(const f of e){const N=c;for(let z=0;z<=f.seg;z++)for(let T=-1;T<=1;T+=2)l.set([z/f.seg,T,f.w,f.seed],c*4),i.set([f.ph,f.rf,f.x0],c*3),c++;for(let z=0;z<f.seg;z++){const T=N+z*2;d.set([T,T+1,T+2,T+1,T+3,T+2],p),p+=6}}const m=new t.BufferGeometry;m.setAttribute("position",new t.BufferAttribute(s,3)),m.setAttribute("aPar",new t.BufferAttribute(l,4)),m.setAttribute("aArm",new t.BufferAttribute(i,3)),m.setIndex(new t.BufferAttribute(d,1));const u=new t.Mesh(m,new t.ShaderMaterial({vertexShader:ha,fragmentShader:pa,...j,uniforms:{...K("uLegO","uAnti","uTailR","uTailU","uTime","uLegLen","uIonC"),uVorG:Ht,uWarm:{value:new t.Color(1,.86,.62)}}}));u.frustumCulled=!1,u.renderOrder=3,I.add(u);const y=new t.Mesh(new t.PlaneGeometry(1,1,72,56),new t.ShaderMaterial({vertexShader:ga,fragmentShader:wa,...j,uniforms:{...K("uLegO","uAnti","uTailR","uTailU","uTime","uLegLen","uIonC"),uHornG:jt,uWarm:{value:new t.Color(1,.86,.62)}}}));y.geometry.translate(.5,.5,0),y.geometry.attributes.uv.needsUpdate=!0,y.name="horn-skin",y.frustumCulled=!1,y.renderOrder=2,I.add(y);const g=new t.Mesh(new t.RingGeometry(9,190,96,1),new t.ShaderMaterial({vertexShader:xa,fragmentShader:ya,...j,uniforms:{...K("uTime","uIonC"),uWhirlG:Kt,uHole:{value:9.4},uRad:{value:190},uWarm:{value:new t.Color(1,.86,.62)}}}));g.position.copy(we).addScaledVector(F,fe+.5),g.lookAt(we),g.frustumCulled=!1,g.renderOrder=3,I.add(g)}await h.yield();const ye=200,Xt=6500;{const a=[],n=[.05,.12,-.3,.26],r=new t.Vector3,s=new t.Vector3;for(let u=0;u<4;u++){const g=new Float32Array(3159),f=new Float32Array(1053*3),N=[],z=C.range(0,6.283);for(let P=0;P<=80;P++){const x=k(ye,Xt,Math.pow(P/80,1.25)),D=v(ye,1600,x),it=Math.max(0,x-2e3),le=k(400,u?-(175+75*u):-150,D)-it*.13*(1+.3*u)+30*Math.sin(x*.0016+z),E=u?k(-430,-(48+46*u),v(ye,1100,x))-it*.02*u:k(-430,-125,v(ye,1320,x))-40*v(1500,2400,x),sa=110+.12*(x-ye),go=1-v(ye,1400,x);s.copy(O).multiplyScalar(-Math.cos(n[u])).addScaledVector(H,Math.sin(n[u]));for(let Qe=0;Qe<=12;Qe++){const wo=Qe/12*2-1,pe=P*13+Qe;ot(x,le+Ve*go,E-Ge*go,r).addScaledVector(s,wo*sa),g.set([r.x,r.y,r.z],pe*3),f.set([x,wo,u],pe*3),P<80&&Qe<12&&N.push(pe,pe+1,pe+12+1,pe+1,pe+12+2,pe+12+1)}}const T=new t.BufferGeometry;T.setAttribute("position",new t.BufferAttribute(g,3)),T.setAttribute("aSheet",new t.BufferAttribute(f,3)),T.setIndex(N),a.push(T)}const l=new t.Mesh(Ie(a),new t.ShaderMaterial({vertexShader:ba,fragmentShader:Sa,...j,uniforms:{...K("uTime","uTailU","uAnti","uDustC","uSailP","uShD","uShR","uShU","uShOn","uShT"),uDustG:Wt,uA0:{value:ye},uA1:{value:Xt}}}));a.forEach(u=>u.dispose()),l.frustumCulled=!1,l.renderOrder=2,I.add(l),await h.yield();const i=Math.round(4200*G*U),d=new Float32Array(i*4),c=new Float32Array(i*3);for(let u=0;u<i;u++){let y=C.range(-430,240),g=C.range(-320,110);C.chance(.5)&&(y=C.range(-260,40),g=C.range(-170,20));const f=Math.hypot(y,g);f<16&&(y*=16/Math.max(f,.1),g*=16/Math.max(f,.1)),d.set([C.range(0,3600),y,g,C()],u*4)}const p=new t.BufferGeometry;p.setAttribute("position",new t.BufferAttribute(c,3)),p.setAttribute("aLeg",new t.BufferAttribute(d,4));const m=new t.Points(p,new t.ShaderMaterial({vertexShader:Aa,fragmentShader:Ca,...j,uniforms:{...K("uLegO","uAnti","uTailR","uTailU","uTime","uRes","uDustC","uSailP","uShD","uShR","uShU","uShOn","uShT"),uMoteG:Et,uA0:{value:-350},uA1:{value:3250}}}));m.name="motes",m.frustumCulled=!1,m.renderOrder=3,I.add(m)}await h.yield();const Ue={uCam:{value:new t.Vector3},uBox:{value:new t.Vector3(64,44,64)},uRel:{value:new t.Vector3(0,1,0)},uDrift:{value:new t.Vector3},uAmt:{value:0},uGrain:b.uGrain,uGrainI:{value:1.7}};{const e=Math.round(3e3*G),o=new Float32Array(e*12),a=new Float32Array(e*12),n=new Float32Array(e*12),r=new Uint32Array(e*6);for(let i=0;i<e;i++){const d=C(),c=C(),p=C(),m=C();for(let u=0;u<4;u++)o.set([d,c,p],i*12+u*3),a.set([u>>1,(u&1)*2-1,m],i*12+u*3);r.set([i*4,i*4+1,i*4+2,i*4+1,i*4+3,i*4+2],i*6)}const s=new t.BufferGeometry;s.setAttribute("position",new t.BufferAttribute(n,3)),s.setAttribute("aSeed",new t.BufferAttribute(o,3)),s.setAttribute("aCorner",new t.BufferAttribute(a,3)),s.setIndex(new t.BufferAttribute(r,1));const l=new t.Mesh(s,new t.ShaderMaterial({vertexShader:Ta,fragmentShader:Ma,...j,uniforms:Ue}));l.name="near-grains",l.frustumCulled=!1,l.renderOrder=4,I.add(l)}await h.yield();const he=new t.Group;he.matrixAutoUpdate=!1,he.frustumCulled=!1,I.add(he);const W=[0,7.7,2],bt=4*ge,Uo=(e,o)=>[W[0]+e*12,W[1]-o*12*Math.sin(bt),W[2]+o*12*Math.cos(bt)],ie={uSlack:{value:1},uSway:{value:0},uFlex:{value:0},uTime:b.uTime,uSunRig:{value:new t.Vector3(0,0,-1)},uSunC:b.uSunC,uIonC:b.uIonC,uDay:b.uDay,uNightK:b.uNightK,uIonRim:{value:0}};{const e=[.3,.31,.36],o=[.1,.105,.115],a=[.2,.2,.22],n=[],r=-2.75,s=-2.65,l=7.2;for(const[u,y]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const g=Uo(u,y),f=(z,T,P,x)=>{const D=Math.hypot(z-W[0],P-W[2])/17;x[0]=0,x[1]=0,x[2]=D*D};n.push(te(Ne([W[0],W[1]-.2,W[2]],[g[0],g[1]-.13,g[2]],.15,.075,6,e),f)),n.push(te(Q(new t.SphereGeometry(.17,8,6).translate(g[0],g[1]-.13,g[2]).toNonIndexed(),.34,.35,.4),f));const N=[u*l,r,s];n.push(te(Ne(N,g,.01,.03,5,a),(z,T,P,x)=>{const D=ue((T-r)/(g[1]-r),0,1);x[0]=Math.sin(Math.PI*D),x[1]=(1-D)*(1-D),x[2]=D*D}))}await h.yield();const i=(u,y,g,f)=>{f[0]=0,f[1]=1,f[2]=0},d=[.035,.037,.042],c=[.2,.205,.215],p=(u,y,g,f,N=16)=>te(Q(new t.CylinderGeometry(y,y,g,N).rotateZ(Math.PI/2).translate(u,r,s).toNonIndexed(),...f),i);n.push(te(Ne([-l-.15,r,s],[l+.15,r,s],.034,.034,10,o),i));for(const u of[-5.6,-2.9,2.9,5.6])n.push(p(u,.046,.08,d)),n.push(p(u-.05,.052,.016,c)),n.push(p(u+.05,.052,.016,c));for(const u of[-1,1])n.push(te(Q(new t.SphereGeometry(.05,10,8).translate(u*(l+.15),r,s).toNonIndexed(),...c),i)),n.push(p(u*l,.055,.05,d)),n.push(te(Q(new t.TorusGeometry(.05,.012,6,14).translate(u*l,r+.08,s).toNonIndexed(),...c),i));await h.yield(),n.push(p(0,.06,.3,d,18));for(let u=0;u<7;u++)n.push(p(-.105+u*.035,.074,.016,u&1?o:c,18));for(const u of[-1,1])n.push(p(u*.16,.1,.02,o,20)),n.push(p(u*.175,.04,.02,c,10));n.push(te(Q(new t.BoxGeometry(.04,.04,.24).translate(0,r-.08,s-.1).toNonIndexed(),...d),i)),n.push(te(Ne([0,r-.08,s-.22],[0,r-3.2,s-.5],.012,.012,5,a),i)),n.push(te(Q(new t.SphereGeometry(.4,10,8).translate(...W).toNonIndexed(),...e),(u,y,g,f)=>{f[0]=f[1]=f[2]=0}));for(const u of n)u.deleteAttribute("uv");await h.yield();const m=new t.Mesh(Ie(n),new t.ShaderMaterial({vertexShader:Ra,fragmentShader:za,uniforms:ie,side:t.DoubleSide}));n.forEach(u=>u.dispose()),m.frustumCulled=!1,m.renderOrder=6,he.add(m)}await h.yield();const Oe=Tt==="gyro",be={...K(...Gt),uSoft:{value:.1},uGround:{value:0},uScroll:{value:0},uWr:{value:1},uFlex:ie.uFlex,uSpin:{value:0},uGyro:{value:Oe?1:0},uSunRig:ie.uSunRig,uDay:b.uDay,uHi:{value:0},uIonRim:ie.uIonRim,uScal:{value:Oe?0:.95},uFoilTail:{value:.55},uFoilTint:{value:Tt==="gold"?new t.Color(1,.72,.3):new t.Color(.92,.95,1)}};{let e;if(Oe){const a=[];for(let n=0;n<6;n++)a.push(new t.PlaneGeometry(1.9,24,2,24).rotateX(-Math.PI/2).translate(0,0,-15).rotateY(n*Math.PI/3));e=Ie(a),a.forEach(n=>n.dispose())}else e=new t.PlaneGeometry(24,24,24,24).rotateX(-Math.PI/2);const o=new t.Mesh(e,new t.ShaderMaterial({vertexShader:ka,fragmentShader:Ia,uniforms:be,side:t.DoubleSide}));o.position.set(W[0],W[1]+(Oe?5.6:.02),W[2]+(Oe?3:0)),o.rotation.x=bt,o.frustumCulled=!1,o.renderOrder=5,he.add(o)}await h.yield();const se=Fe.landerSeat.position,Re=new t.Vector3(se[0]-.6,se[1]+3.3,se[2]+.4),$t=new t.Vector4(Re.x,Re.y,Re.z,0);{const e=[.85,.6,.22],o=[.55,.57,.6],a=[];a.push(Q(new t.CylinderGeometry(.9,1,.9,8).translate(0,1.15,0).toNonIndexed(),...e)),a.push(Q(new t.CylinderGeometry(.5,.78,.45,8).translate(0,1.82,0).toNonIndexed(),...o)),a.push(Q(new t.ConeGeometry(.6,.32,12,1,!0).rotateX(Math.PI).translate(.2,2.45,0).toNonIndexed(),.7,.72,.75)),a.push(Q(new t.BoxGeometry(1.9,.05,.85).translate(1.75,1.5,0).toNonIndexed(),.08,.12,.35));for(let s=0;s<3;s++){const l=s*2.094+.5,i=Math.cos(l),d=Math.sin(l);a.push(Ne([i*.8,.95,d*.8],[i*2.1,.05,d*2.1],.06,.05,5,o)),a.push(Ne([i*.8,.75,d*.8],[i*1.5,.5,d*1.5],.04,.04,4,o)),a.push(Q(new t.CylinderGeometry(.3,.3,.07,10).translate(i*2.1,.03,d*2.1).toNonIndexed(),...o))}for(const s of a)s.deleteAttribute("uv");const n=Ze(1.5,.25,$t);n.uCrust={value:new t.Color(.3,.3,.3)},n.uIce={value:0};const r=new t.Mesh(Ie(a),new t.ShaderMaterial({vertexShader:st,fragmentShader:lt,uniforms:n,side:t.DoubleSide}));a.forEach(s=>s.dispose()),r.scale.setScalar(1.5),r.position.set(se[0]+1.5,se[1]+1.5,se[2]),r.rotation.set(.25,.6,1.72),I.add(r)}await h.yield();const Yt=((e,o)=>new t.ShaderMaterial({vertexShader:Na,fragmentShader:Pa,...j,depthTest:!0,uniforms:{uRes:b.uRes,uMinPx:{value:o},uCol:{value:e},uPulse:{value:0}}}))(new t.Color(.75,.88,1).multiplyScalar(2.6),8);{const e=new t.BufferGeometry;e.setAttribute("position",new t.BufferAttribute(new Float32Array(3),3)),e.setAttribute("aGlow",new t.BufferAttribute(new Float32Array([Re.x,Re.y,Re.z,4.4]),4));const o=new t.Points(e,Yt);o.name="beacon",o.frustumCulled=!1,o.renderOrder=7,I.add(o)}const _e=new t.Mesh(new t.CircleGeometry(15,28).rotateX(-Math.PI/2),new t.MeshBasicMaterial({vertexColors:!0,...j}));{const e=_e.geometry.attributes.position.count,o=new Float32Array(e*3);o.set([.13,.165,.22],0),_e.geometry.setAttribute("color",new t.BufferAttribute(o,3)),_e.position.set(se[0],se[1]+.9,se[2]),I.add(_e)}const Zt=!!B.rare,Se=new t.Group;Se.visible=!1,I.add(Se);const St=[{value:0},{value:0}],Jt={value:new t.Vector3};if(Zt){const e=new t.IcosahedronGeometry(1,12);e.deleteAttribute("uv"),e.deleteAttribute("normal"),await h.yield();const o=xo(e);e.dispose(),await h.yield();const a=o.attributes.position,n=new Float32Array(a.count*3);for(let m=0;m<a.count;m++){const u=a.getX(m),y=a.getY(m),g=a.getZ(m),f=3.1*(1+.28*de.fbm3(u*1.3+9,y*1.3,g*1.3,3)+.07*de.n3(u*5,y*5,g*5));a.setXYZ(m,u*f*1.25,y*f*.85,g*f);const N=.8+.4*de.n3(u*3,y*3+4,g*3);n[m*3]=N,n[m*3+1]=N,n[m*3+2]=N,m%400===399&&await h.yield()}await h.yield(),o.computeVertexNormals(),await h.yield(),o.setAttribute("color",new t.BufferAttribute(n,3));const r=Ze(.35,1.6);r.uLineQ={value:1e7},r.uLocal={value:1},r.uFill={value:.5};const s=new t.Mesh(o,new t.ShaderMaterial({vertexShader:st,fragmentShader:lt,uniforms:r}));s.name="rock",s.frustumCulled=!1,Se.add(s);const l=Ie([new t.PlaneGeometry(1,1,1,10),new t.PlaneGeometry(1,1,1,10).translate(0,0,1)]),i=So.replace("uniform float uS,","uniform vec3 uOff; uniform float uS,").replace("vec3 w = iBase","vec3 w = uOff + iBase"),d=[F,F.clone().addScaledVector(O,.22).addScaledVector(H,-.16).normalize()],c=[b.uIonC,b.uDustC],p=[[210,5],[130,15]];for(let m=0;m<2;m++){const u=new t.InstancedBufferGeometry;u.index=l.index,u.setAttribute("position",l.attributes.position),u.setAttribute("uv",l.attributes.uv),u.setAttribute("iBase",new t.InstancedBufferAttribute(new Float32Array(3),3)),u.setAttribute("iUp",new t.InstancedBufferAttribute(new Float32Array([d[m].x,d[m].y,d[m].z]),3)),u.setAttribute("iPar",new t.InstancedBufferAttribute(new Float32Array([p[m][0],p[m][1],-1,.3+m*.4]),4)),u.instanceCount=1;const y=new t.Mesh(u,new t.ShaderMaterial({vertexShader:i,fragmentShader:Ao,...j,uniforms:{...K("uS","uRc","uAway","uTime","uSunDir"),uLineQ:{value:1e7},uGrain:c[m],uPlumeI:St[m],uOff:Jt}}));y.frustumCulled=!1,y.renderOrder=3,Se.add(y),y.matrixAutoUpdate=!1}}const Oo=new t.Vector3(Fe.cliff.top[0]+8,Fe.cliff.top[1]-6,Fe.cliff.top[2]+20),ze=new t.Vector3,eo=new t.Vector3,_o=(e,o,a)=>{const n=v(me+.8,me+6.5,e),r=o*R,s=k(58,150,v(R-1500,R-1e3,r))+330*v(R-1050,R-520,r);if(Se.visible=Zt&&e>me+.6&&r+s<R-6,!Se.visible)return;const l=v(R-560,R-60,r+s);L.posAtDist(r+s,ze),L.tangentAtDist(r+s,$e),eo.crossVectors($e,zo.set(0,1,0)).normalize(),ze.addScaledVector(eo,36*(1-l)).y+=-7*(1-l),ze.lerpVectors(Oo,ze,n);const i=Se.children[0];i.position.copy(ze),i.rotation.set(a*.23,a*.31,a*.17),Jt.value.copy(ze);const d=v(me+4,me+11,e);St[0].value=1.3*d,St[1].value=.5*d},to=1324,oo=.72,We=[],Wo=e=>[-ft(e),vt(e)];{const e=Z.fork("perihelion-fragments"),o=(s,l,i,d)=>{const c=to+s/(1-oo),p=Wo(Math.min(c,fe));return c<fe+200&&Math.hypot(l-p[0],i-p[1])<d+11?!1:(We.push({st:to,k:oo,off:s,l,h:i,r:d,ax:new t.Vector3(e.range(-1,1),e.range(-1,1),e.range(-1,1)).normalize(),w:e.range(.12,.5)/Math.sqrt(d)*(e.chance(.5)?1:-1)*2,ph:e.range(0,6.283),dl:e.range(-1.5,1.5),dh:e.range(-1.5,1.5)}),!0)};o(60,119,5,8.5),o(125,90,46,4.5),o(250,205,-22,13),o(34,52,-6,2.4),o(175,150,52,3.2),o(330,40,-48,6.5),o(98,156,-30,3.4),o(430,118,34,9.5),o(560,20,60,7);const a=Math.round(34*G);for(let s=0,l=0;s<a&&l<400;l++)o(e.range(15,520),84+e.range(-110,130),13+e.range(-60,60),e.range(.35,1.5))&&s++;const n=(s,l,i,d)=>We.push({st:0,k:1,off:i,l:-ft(s)+.585*l,h:vt(s)+.81*l,r:d,ax:new t.Vector3(e.range(-1,1),e.range(-1,1),e.range(-1,1)).normalize(),w:e.range(.12,.5)/Math.sqrt(d)*(e.chance(.5)?1:-1)*2,ph:e.range(0,6.283),dl:e.range(-1.5,1.5),dh:e.range(-1.5,1.5)});n(285,34,-22,14),n(316,-80,-50,8),n(262,-55,-40,7),n(238,80,10,16),n(302,-30,-12,3.5),n(312,24,-30,2.2),n(222,-98,-60,9),n(330,50,-8,4);const r=Math.round(16*G);for(let s=0;s<r;s++)n(e.range(190,335),(e.chance(.5)?1:-1)*e.range(18,115),e.range(-70,20),e.range(.4,1.7))}await h.yield();const ao=(()=>{const e=new t.IcosahedronGeometry(1,6);e.deleteAttribute("uv"),e.deleteAttribute("normal");const o=xo(e);e.dispose();const a=o.attributes.position,n=new Float32Array(a.count*3);for(let l=0;l<a.count;l++){let i=a.getX(l),d=a.getY(l),c=a.getZ(l);const p=1+.3*de.fbm3(i*1.2+31,d*1.2,c*1.2+5,3)+.06*de.n3(i*5,d*5+2,c*5);i*=p*1.2,d*=p*.8,c*=p;const m=i*.62+d*.5+c*.6;if(m>.7){const g=m-.7;i-=.62*g,d-=.5*g,c-=.6*g}const u=-i*.8+d*.3-c*.52;if(u>.62){const g=u-.62;i+=.8*g,d-=.3*g,c+=.52*g}a.setXYZ(l,i,d,c);const y=.9+.5*de.n3(i*2.2,d*2.2+4,c*2.2);n[l*3]=y,n[l*3+1]=y,n[l*3+2]=y}o.computeVertexNormals(),o.setAttribute("color",new t.BufferAttribute(n,3));const r=Ze(.8,2);r.uLineQ={value:1e7},r.uLocal={value:9},r.uFill={value:.55},r.uIce={value:.1};const s=new t.InstancedMesh(o,new t.ShaderMaterial({vertexShader:st,fragmentShader:lt,uniforms:r}),We.length);return s.instanceMatrix.setUsage(t.DynamicDrawUsage),s.frustumCulled=!1,I.add(s),s})(),ro=new t.Matrix4,no=new t.Quaternion,io=new t.Vector3,Eo=new t.Vector3,Qo=(e,o)=>{const a=v(-150,150,e);for(let n=0;n<We.length;n++){const r=We[n],s=r.st+r.off+(e-r.st)*r.k;ot(s,r.l+r.dl*Math.sin(o*.21+r.ph),r.h+r.dh*Math.sin(o*.17+r.ph*2),io),no.setFromAxisAngle(r.ax,r.ph+o*r.w),ro.compose(io,no,Eo.setScalar(r.r*a+1e-4)),ao.setMatrixAt(n,ro)}ao.instanceMatrix.needsUpdate=!0};await h.yield();const Ho=X?[-60,180,-800]:[640,760,-1700],so=new t.Vector3,At=new t.Vector3,lo=new t.Vector3,Ko=new t.Vector3(-170,-20,-230),jo=new t.Vector3(-10,-10,60),Xo=new t.Vector3(-170,-20,350),$o=new t.Vector3,uo=e=>L.pointAt(e,$o).addScaledVector(F,-600).addScaledVector(H,-265).addScaledVector(O,-255),Yo=(e,o)=>{const a=o*R,n=v(815,1020,a);L.pointAt(o,so),L.tangentAt(o,At);const r=Math.atan2(-At.x,-At.z)+2.3*n,s=k(.1,.4,n);return lo.set(-Math.sin(r)*Math.cos(s),-Math.sin(s),-Math.cos(r)*Math.cos(s)).multiplyScalar(650).add(so),lo.lerp(jo,v(970,1118,a)).lerp(Ko,Ke(a,1060,1160,1270,1420)).lerp(Xo,.6*v(1500,1800,a)).lerp(uo(o),v(1720,1930,a))},Zo=new t.Vector3,Ct=new t.Vector3,Ee=e=>e<0?(ae+e)/R:Ro(e),Da=new t.Vector3(-170,-20,350),Ba=new t.Vector3(-40,-120,820),Jo=new t.Vector3(-60,-160,X?-800:-700),ea=new t.Vector3(60,-500,X?-360:-220),qa=new t.Vector3,ta=(e,o)=>{const a=mt(o);return L.pointAt(o,Ct),Ct.addScaledVector(F,600).addScaledVector(O,-110).addScaledVector(H,-20),Zo.copy(uo(o)).lerp(Jo,v(190,320,a)).lerp(ea,v(400,720,a)).lerp(Ct,v(900,1200,a))},oa=we.clone().addScaledVector(F,fe-60),aa=[{at:Ho,from:0,to:Xe(Math.min(7,oe-1.5)),weight:.4},{at:Fe.cliff.poi,from:Xe(me-1.6),to:Xe(me+2.4),weight:.5},{at:X?[-60,-120,-800]:[-120,40,-1150],from:560/R,to:1010/R,weight:.6,fade:.3},{at:Yo,from:805/R,to:Ee(120),weight:.85,fade:.1},{at:ta,from:Ee(-40),to:Ee(1400),weight:.9,fade:.06},{at:oa,from:Ee(1380),to:Ee(2010),weight:.6,fade:.3}],ke=new t.Vector3,co=new t.Quaternion,ra=new t.Vector3,fo=new t.Quaternion,rt=new t.Vector3,vo=new t.Vector3,nt=new t.Vector3,mo=new t.Vector2,ho=(X?2.2:4.2)*ge,na=b.uCorona.value,ia=A==="grazer"?1.35:A==="small"?.7:1,po=(e,o,a,n)=>{const r=ht(n||0),s=r-oe,l=mt(n||0);ne.setScriptTime(r),ne.update(e,o,a),a.getWorldPosition(ke),a.matrixWorld.decompose(ke,co,ra),h.renderer&&(h.renderer.getDrawingBufferSize(mo),b.uRes.value.copy(mo)),b.uTime.value=o,b.uS.value=r;const i=v(-.3,.5,s);he.visible=!h.through,tt.material.uniforms.uRim.value=k(1.2,.4,i),tt.material.uniforms.uThread.value=2.6*(1-v(-1.5,2.5,s)),Ot.value=.3*re*k(1.9,1,i)*(1+1.7*v(11,14,r)*(1-v(17,20.5,r))),be.uGround.value=i*(1-v(20,27,r)),be.uScroll.value=(n||0)*R*.035%512,be.uFoilTail.value=k(.55,.8,i)+.5*v(24,29,r),ie.uIonRim.value=v(24,29.5,r),b.uShT.value=o,b.uDay.value=i,b.uNightK.value=k(1,.4,i),b.uCorona.value=na*k(1.5,.3,i),b.uCrown.value=ia*k(1,.01,i),pt.uSunI.value=Io*(1+1.3*Math.exp(-Math.max(s,0)/.7)*v(-.3,.2,s)),ne.sunDirAt(ke,rt);const d=rt.y/Math.max(Math.hypot(rt.x,rt.z),1e-4),c=Math.atan(d)+k(ho-Ye,ho+Ye+.6*ge,v(-.4,1.6,s))*(1-v(.04,.24,d));b.uSunDir.value.set(-Te.x*Math.cos(c),Math.sin(c),-Te.y*Math.cos(c)),he.matrix.copy(a.matrixWorld),he.matrixWorldNeedsUpdate=!0,fo.copy(co).invert(),ie.uSunRig.value.copy(b.uSunDir.value).applyQuaternion(fo);const p=s<0?1:1-.95*(1-Math.exp(-6*s)*Math.cos(8*s));be.uWr.value=p,ie.uSlack.value=ue(p,0,1),ie.uFlex.value=k(.32,-.3,ue(p,-.2,1))+.035*Math.sin(o*2.1)+.5*Math.exp(-Math.max(s,0)*2.2)*v(-.05,.15,s),ie.uSway.value=.5*v(17,20,r)*(1-v(25.5,29,r))+.05*Math.sin(o*.8)*(.4+.6*p),be.uSpin.value=o*.22,be.uHi.value=r*.5+o*.06,_t.value=at*(.24+.26*v(19,27,r)),Wt.value=Qt*v(oe+2,oe+8,r)*(.45+.55*v(18,26,r))*(1-.45*v(1150,1650,l)),Et.value=.35*Qt*v(oe+3,oe+9,r),b.uShOn.value=v(25,28.5,r),b.uSailP.value.copy(ke),L.tangentAt(n||0,vo);const m=r>22.5;m?nt.copy(F).multiplyScalar(70):nt.set(Te.x*14,38,Te.y*14),Ue.uAmt.value=m?(.2+.12*v(1e3,1500,l))*v(24.5,28.5,r):.22*v(.4,2.2,s)*(1-v(17.5,21,r)),Ue.uDrift.value.copy(nt).multiplyScalar(o%600),Ue.uRel.value.copy(nt).addScaledVector(vo,-It((n||0)*R)),Ue.uCam.value.copy(ke);const u=o*.5%1,y=v(0,.05,u)*(1-v(.05,.2,u));Yt.uniforms.uPulse.value=.3+y,$t.w=.4+2.4*y,_e.material.color.setScalar(.3+y),_o(r,n||0,o),Qo(l,o);const g=De.uniforms.uNucDir.value.copy(Fo).sub(ke),f=Math.max(g.length(),1);g.multiplyScalar(1/f),De.uniforms.uNucR.value=Math.atan(Do/f),De.uniforms.uComaG.value=(q==="coma"?.13:.105)*(1+.7*v(19,27,r)),De.uniforms.uTailSky.value=.28*(1-.88*v(1e3,1500,l)),Kt.value=at*1.1*v(200,1200,l),jt.value=at*.09*v(-300,500,l),Ht.value=at*.34*v(-300,500,l)*(1+.08*Math.sin(o*.9))};return po(0,0,{getWorldPosition:e=>e.set(0,14,325),matrixWorld:new t.Matrix4().makeTranslation(0,14,325)},0),{scene:I,path:L,duration:ut,pace:Nt,ride:"none",camera:{fov:72,near:.5,far:12e3,lookAhead:50,sway:.25,bank:7},pois:aa,portal:{shape:"circle",radius:9,tilt:!0,color:"#BFE4FF",glow:1,revealDistance:2300},post:{exposure:A==="grazer"?.92:1,bloom:{strength:.32,radius:.55,threshold:1},grade:{saturation:1.04,contrast:1.06,tint:"#ffffff",shadowTint:"#000000",vignette:.3,grain:.02,aberration:0}},update:po,dispose(){ne.dispose()}}}};export{_a as default};
