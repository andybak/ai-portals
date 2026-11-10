import*as e from"three";import{mergeGeometries as Et,mergeVertices as mo}from"three/addons/utils/BufferGeometryUtils.js";import{makePath as po}from"../kit/core.js";import{buildHero as ho}from"../parts/ring-run.js";const qe=["#E8B46A","#B9762F","#F7E6C2","#E6F1FC","#6FA6E0","#04060C","#6FF2E0"],E=3830,Lt=96,ce=-80,Ge=(E+40-ce)/(Lt-1),it=`
float h21(vec2 p){ p = fract(p * vec2(234.34, 435.345)); p += dot(p, p + 34.23); return fract(p.x * p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float fbm(vec2 p){ float a = .5, s = 0.; for (int i = 0; i < 4; i++) { s += a * vn(p); p = p * 2.03 + 17.1; a *= .5; } return s / .9375; }
`,yt=`
uniform vec2 uPath[${Lt}];
vec2 pathXY(float z){ float f = clamp((z - (${ce.toFixed(1)})) / ${Ge.toFixed(4)}, 0., ${(Lt-1).toFixed(1)} - .001); int i = int(f); return mix(uPath[i], uPath[i + 1], f - float(i)); }
float ragF(float x){ return sin(x * .021) * 22. + sin(x * .0057 + 1.3) * 38. + sin(x * .13) * 6.; }
float waveF(float z){ float d = ${E.toFixed(1)} - z; return smoothstep(2180., 2420., d) * (1. - smoothstep(2850., 2925., d)); }
`,go=`
varying vec3 vD;
void main(){ vD = position; vec4 p = projectionMatrix * vec4(mat3(viewMatrix) * position, 1.); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }`,xo=`
uniform vec3 uSun, uPl, uPlR, uPlU, uC1, uC2, uC3, uC4, uSunCol, uM1, uM2;
uniform float uTime, uPlRad, uKind, uTilt, uShLat, uStormLon, uStormLat;
varying vec3 vD;
${it}
float stars(vec3 d, float n, float seed){
  vec3 a = abs(d); vec2 uv; float f;
  if (a.x > a.y && a.x > a.z) { uv = d.yz / a.x; f = sign(d.x) + 2.; }
  else if (a.y > a.z) { uv = d.xz / a.y; f = sign(d.y) + 5.; }
  else { uv = d.xy / max(a.z, 1e-4); f = sign(d.z) + 8.; }
  vec2 g = uv * n; float w = max(.07, 1.1 * max(fwidth(g.x), fwidth(g.y)));
  vec2 id = floor(g), fr = fract(g) - .5; float h = h21(id + f * 17.3 + seed);
  vec2 o = (vec2(h21(id + f * 3.1 + .5), h21(id + f * 7.7 + .9)) - .5) * .6;
  float b = max(h - .955, 0.) / .045; b = b * b;
  return b * (1. - smoothstep(w * .3, w, length(fr - o))) * min(1., .12 / w);
}
vec3 bead(vec3 d, vec3 c, float rad, vec3 tint){
  vec3 r = normalize(cross(c, vec3(0., 1., 0.)) + vec3(1e-5, 0., 0.)), u = cross(r, c);
  vec2 q = vec2(dot(d, r), dot(d, u)) / rad; float r2 = dot(q, q);
  if (dot(d, c) < 0. || r2 > 1.) return vec3(0.);
  vec3 n = r * q.x + u * q.y - c * sqrt(max(1. - r2, 0.));
  return tint * smoothstep(-.02, .12, dot(n, uSun)) * (.55 + .45 * vn(q * 5. + rad * 900.)) * (1. - smoothstep(.8, 1., r2));
}
void main(){
  vec3 d = normalize(vD);
  vec3 col = vec3(.0016, .0022, .0046);
  col += vec3(.9, .95, 1.) * stars(d, 90., 0.) * 1.5 + vec3(1., .9, .8) * stars(d, 190., 9.) * .7;
  // the sun: small, white, fierce
  float sd = max(dot(d, uSun), 0.);
  float s2 = sd * sd; s2 *= s2; s2 *= s2; s2 *= s2; float s64 = s2 * s2 * s2 * s2; float s1k = s64 * s64; s1k *= s1k; s1k *= s1k; s1k *= s1k;
  col += uSunCol * (smoothstep(.99995, .99998, sd) * 6. + s1k * 1.5 + s64 * .12 + s2 * .02);
  col += bead(d, uM1, .011, vec3(.8, .78, .72)) + bead(d, uM2, .0065, vec3(.7, .62, .5));
  // the giant
  vec2 q = vec2(dot(d, uPlR), dot(d, uPlU)) / uPlRad; float r2 = dot(q, q);
  if (dot(d, uPl) > 0. && r2 < 1.02) {
    float nz = sqrt(max(1. - r2, 0.));
    float ct = cos(uTilt), st = sin(uTilt);
    vec3 nt = vec3(q.x, q.y * ct - nz * st, q.y * st + nz * ct);
    float lat = asin(clamp(nt.y, -1., 1.)); float lon = atan(nt.x, nt.z + 1e-4);
    float shear = sin(lat * 9.) * .6 + sin(lat * 23. + 1.) * .3;
    float lo = lon + uTime * .02 * shear;
    float turb = fbm(vec2(lo * 3., lat * 9.) + 3.);
    float fine = fbm(vec2(lo * 9. + uTime * .03 * shear, lat * 40.));
    float b = .5 + .5 * sin(lat * 15. + 2.2 * vn(vec2(lat * 5., 1.7)) + (turb - .5) * 2.2);
    float b2 = .5 + .5 * sin(lat * 41. + (fine - .5) * 3. + 1.);
    vec3 pc = mix(uC2, uC1, smoothstep(.15, .8, b));
    pc = mix(pc, uC3, smoothstep(.5, .95, b * .6 + b2 * .5) * .8);
    pc *= .82 + .36 * fine;
    // the pale oval storm, turning
    vec2 sp = vec2(lon - uStormLon - uTime * .003, (lat - uStormLat) * 2.1); float sr = length(sp) / .17;
    float ang = atan(sp.y, sp.x + 1e-5) + (1. - sr) * 5. - uTime * .25;
    vec3 sc = mix(uC3, uC1, .25 + .25 * sin(ang * 2. + sr * 9.));
    pc = mix(pc, sc, (1. - smoothstep(.55, 1., sr)) * .9);
    pc = mix(pc, uC2 * .7, smoothstep(.75, 1., sr) * (1. - smoothstep(1., 1.25, sr)) * .5);
    // kind 1: a hexagonal polar storm tipped toward us
    float pd = acos(clamp(nt.y, -1., 1.)) / .42; float ha = atan(nt.x, nt.z + 1e-4);
    float hex = pd * (1. + .07 * cos(6. * ha + uTime * .04));
    vec3 pol = mix(uC4 * .55, uC4, .5 + .5 * sin(hex * 14. - uTime * .3 + ha));
    pc = mix(pc, pol, step(.5, uKind) * step(uKind, 1.5) * (1. - smoothstep(.85, 1., hex)));
    // the rings' own shadow: one thin dark stripe hugging the equator
    float sl = q.y - uShLat * nz; float sw = mix(.02, .008, step(1.5, uKind));
    pc *= 1. - .82 * (1. - smoothstep(sw * .5, sw, abs(sl)));
    vec3 nW = uPlR * q.x + uPlU * q.y - uPl * nz;
    float ndl = dot(nW, uSun);
    float lit = mix(smoothstep(-.1, .4, ndl), smoothstep(-.45, -.05, ndl), step(1.5, uKind));
    vec3 g = pc * lit * (.35 + .65 * sqrt(nz)) * .8;
    g += uC3 * .22 * (1. - nz) * (1. - nz) * lit;
    col = mix(col, g, 1. - smoothstep(.985, 1.02, r2));
  }
  gl_FragColor = vec4(col, 1.);
}`,_e=`
varying vec3 vW;
void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,Ie=`
uniform vec3 uSun, uPlanet, uSunCol, uShineCol, uFrost, uCream, uBlue, uShC;
uniform float uTime, uX0, uX1, uFar, uCombK, uCombT, uRose, uBraid;
varying vec3 vW;
${it}
${yt}
float pebble(vec2 cq, float cov, float rs, out float lit){
  cq.x += fract(sin(floor(cq.y) * 91.7) * 43758.5);            // every row slides by its own amount: no grid of dots
  vec2 ci = floor(cq); float ch = h21(ci), c2 = h21(ci + 71.3), c3 = h21(ci + 13.7);
  float r = (.2 + .28 * c3) * rs;
  float d = length(fract(cq) - .5 + (vec2(c2, c3) - .5) * .5) + (vn(cq * 3.1 + 5.) - .5) * .16 * rs;   // chipped outlines, not ovals
  lit = step(fract(c2 * 7.7), .64);
  return step(ch, cov) * (1. - smoothstep(r - .08 * rs, r, d));
}
void main(){
  float x = vW.x, z = vW.z; float dn = ${E.toFixed(1)} - z;
  float dither = h21(gl_FragCoord.xy * .7131);
  float rg = ragF(x) + (vn(vec2(x * .09, 7.)) - .5) * 26.;
  float cov;
  if (uFar < .5) {
    float e = z - (930. + rg);
    float strands = .5 + .5 * sin(e * .11 + sin(x * .013) * 3.);
    cov = smoothstep(-6., 40., e) * mix(1., smoothstep(.2, .55, strands) + smoothstep(120., 200., e), uBraid);
  } else {
    float side = max(1. - smoothstep(uX0 + 20., uX0 + 210., x), smoothstep(uX1 - 150., uX1 - 20., x));
    cov = max((1. - smoothstep(-40., 6., z - (300. + rg * .5))) * side, step(z, -620.));
  }
  if (cov < .08 + .84 * dither) discard;
  vec3 V = normalize(cameraPosition - vW + vec3(0., 1e-4, 0.)); float dist = length(cameraPosition - vW);
  vec2 q = vec2(x, z + uTime * 6.);
  vec2 fwq = fwidth(q); float px = max(fwq.x, fwq.y);
  float calm = 1. - smoothstep(6., 70., px);                 // the far sheet is perfectly calm
  vec2 qs = mat2(.94, -.34, .34, .94) * q;
  float sraw = fbm(vec2(qs.x * .021, qs.y * .0023));
  float streak = mix(.5, sraw, calm);
  float clump = mix(.5, fbm(q * .011 + 7.3), calm);
  float wv = waveF(z);
  float dens = clamp(.3 + .7 * smoothstep(.2, .6, streak) * (.6 + .9 * clump), 0., 1.);
  dens = mix(dens, 1., wv * .85);
  float a = .25 + .75 * dens;
  float up = step(0., V.y);
  vec2 qr = mat2(.8, -.6, .6, .8) * q;
  // mid-distance grain is combed along the streaks, so it never reads as a cell pattern
  float m1 = fbm(vec2(qs.x * .1, qs.y * .021) + 5.), m2 = vn(vec2(qs.x * .45, qs.y * .1) + 9.);
  float near = 1. - smoothstep(.35, 1.4, px * .43);
  float near3 = 1. - smoothstep(.2, .6, px * 1.3);
  // pebbles in three sizes, a steep power law: many small, few large
  // the two larger layers are stretched 3:1 along the streaks: combed grain, not round cells
  float litCell; float pm = pebble(vec2(qs.x * .62, qs.y * .21), a, .6, litCell);
  float lit2; float pm2 = pebble(vec2(qs.x * .41, qs.y * .14) + 31.7, a * .45, 1., lit2);
  if (pm2 > pm) { pm = pm2; litCell = lit2; }
  float lit3; float pm3 = pebble(qr.yx * 1.3 + 11.3, a * .8, .8, lit3) * near3;
  if (pm3 > pm) { pm = pm3; litCell = lit3; }
  if (up > .5 && px < .2 && pm < .5 && h21(floor(q * 2.6) + 5.) > a * .7 + .5) discard;   // close up the dust is a haze between stones
  float mid = 1. - smoothstep(1.5, 9., px);
  float pmix = mix(a * mix(.55, smoothstep(.34, .64, m1 * .6 + m2 * .4) * 1.1, mid), pm, near);
  float dustG = mix(.42, .68 + .14 * (m2 - .5), near);
  float grain = mix(dustG, mix(1.2, mix(.9, 1.03, litCell), near), pmix) * mix(1., .85 + .3 * vn(q * .3), mid);
  // comb: the long parallel shadows of the bergs, raked along the sun's ground track
  vec2 gd = normalize(-uSun.xz + vec2(1e-5, 0.));
  float ca = dot(q, gd), cc = dot(q, vec2(-gd.y, gd.x));
  float cn = fbm(vec2(ca * uCombK + 3.1, cc * .1));
  float comb = smoothstep(uCombT, uCombT + .06, cn) * .9 * (1. - smoothstep(4., 30., px)) * (1. - wv);
  vec3 refl = uFrost * uSunCol * (.4 + .6 * smoothstep(0., .5, uSun.y)) * (.6 + .4 * dens) * grain;
  refl *= mix(vec3(1.), uBlue * .28, comb);
  refl *= 1. + uRose * 1.1 * smoothstep(1650., 1720., dn) * (1. - smoothstep(1900., 1980., dn));   // rose ring: a bright white inner band
  float fw = max(dot(-V, uSun), 0.); float fwd = fw * fw; fwd *= fwd * fw;
  // from below: backlit frosted glass. Thin lanes bloom cream-white; the clumped rubble is a diagonal comb of blue streaks
  float calmB = 1. - smoothstep(40., 500., px);
  float sB = smoothstep(.36, .62, fbm(vec2(qs.x * .0045, qs.y * .0008) + 2.));
  float sN = smoothstep(.3, .55, sraw);
  float densU = mix(mix(.5, .2 + .65 * sB, calmB), sN * (.72 + .28 * sB), calm);
  densU = mix(densU, 1., wv * .9);
  float gU = 1. + (.5 * (m1 - .5) + .3 * (m2 - .5)) * mid + .25 * (vn(q * 1.7) - .5) * near;
  vec3 trans = uSunCol * mix(mix(uCream, vec3(1.), .3), uBlue * .85, densU * .85) * (.46 + .95 * fwd + .72 * uSun.y) * (1.38 - 1.02 * densU) * gU;
  trans *= mix(.3, 1., smoothstep(0., .22, abs(V.y))) * mix(1., 1.25, smoothstep(.3, .5, uSun.y));   // the high sun lights the ceiling brightest                    // seen edge-on the sheet is thick: the far ceiling dims to blue
  trans *= mix(vec3(1.), uBlue * .8, comb * .5) * mix(vec3(1.), vec3(.1, .15, .24), wv);
  vec3 col = mix(trans, refl, up);
  col += uShineCol * uFrost * (.12 + .4 * max(uPlanet.y * (up * 2. - 1.), 0.) + .25 * max(dot(V.xz, -uPlanet.xz), 0.)) * (1.2 - .5 * grain) * mix(.6, 1., up);
  // thin forward-scattering haze confined to the sheet: the vanishing line burns
  float gz = 1. - abs(V.y); gz *= gz; gz *= gz; gz *= gz; gz *= gz;
  col += uSunCol * mix(mix(uCream, uBlue, .75) * (.3 + .9 * fw * fw) * (.2 + .8 * sB) * .1 * (1. - .8 * wv), uFrost * (.1 + .5 * fw * fw), up) * gz;
  col *= mix((1. - .88 * smoothstep(1800., 6500., dist)) * mix(vec3(1.), uBlue * 1.15, smoothstep(700., 2400., dist) * .8), vec3(1.), up);              // the far ceiling sinks into deep blue: no grey bar on the horizon
  float gl = step(.9968, h21(floor(q * 1.3) + 3.)) * near * up;
  col += uSunCol * gl * 2.2;
  // the giant's shadow bites the ring off to black along a clean curved edge
  col *= mix(.015, 1., smoothstep(-260., 260., length(vec2(x, z) - uShC.xy + vec2(uTime * 5., 0.)) - uShC.z));
  gl_FragColor = vec4(col, 1.);
}`,Ee=`
vec3 rotAx(vec3 p, vec3 ax, float ca, float sa){ return p * ca + cross(ax, p) * sa + ax * dot(ax, p) * (1. - ca); }`,Le=`
attribute vec4 aP;   // x (m), z0 (0..1), y gauss, radius (m)
attribute vec4 aQ;   // spin phase, drift (m/s), glint, hash
uniform float uTime, uPix, uL, uAhead, uX0, uX1;
${yt}
float gWave;
vec3 stoneCentre(out float sc){
  float zb = cameraPosition.z - uL * uAhead;
  float rel = mod(aP.y * uL + aQ.y * uTime - zb, uL);
  float z = zb + rel; gWave = waveF(z);
  float x = aP.x * mix(1., .5, gWave);
  float y = aP.z * mix(4.5, 46., gWave);
  float rg = ragF(x);
  float side = max(1. - smoothstep(uX0 + 20., uX0 + 210., x), smoothstep(uX1 - 150., uX1 - 20., x));
  sc = max(step(936. + rg, z), step(z, 296. + rg * .5) * step(aQ.w, side * .999));
  float f = rel / uL; sc *= smoothstep(0., .07, f) * (1. - smoothstep(.93, 1., f));
  vec2 pc = pathXY(z); vec2 dv = vec2(x, y) - pc; float dl = length(dv);
  float minR = (aP.w < .7 ? 2.8 : 7.) + aP.w * 1.7;
  if (dl < minR) { dv = dl > 1e-3 ? dv / dl : vec2(0., -1.); x = pc.x + dv.x * minR; y = pc.y + dv.y * minR; }
  return vec3(x, y, z);
}`,wo=`
attribute vec3 aAxis; attribute vec3 color;
varying vec3 vN, vW, vCol, vO; varying float vGl, vBelow;
${Le}
${Ee}
void main(){
  float sc; vec3 c = stoneCentre(sc);
  float dist = length(cameraPosition - c);
  float s = max(aP.w, dist * uPix * .8) * sc;
  float ang = aQ.x + uTime * (.25 + fract(aQ.x * 7.31) * .8) * (aP.w > 6. ? .3 : 1.);
  vec3 ax = normalize(aAxis + vec3(1e-4, 0., 0.)); float ca = cos(ang), sa = sin(ang);
  vW = c + rotAx(position, ax, ca, sa) * s; vN = rotAx(normal, ax, ca, sa); vCol = color; vGl = aQ.z; vO = position;
  vBelow = (1. - smoothstep(-1.5, 1., vW.y)) * (1. - gWave);
  gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.);
}`,bo=`
attribute vec4 iP; attribute vec4 iQ; attribute vec3 iAxis; attribute vec3 color;
uniform float uTime;
varying vec3 vN, vW, vCol, vO; varying float vGl, vBelow;
${yt}
${Ee}
void main(){
  float ang = iQ.x + uTime * iQ.y; vec3 ax = normalize(iAxis + vec3(1e-4, 0., 0.)); float ca = cos(ang), sa = sin(ang);
  vec3 c = iP.xyz + vec3(0., 0., uTime * iQ.w);
  vW = c + rotAx(position, ax, ca, sa) * iP.w; vN = rotAx(normal, ax, ca, sa); vCol = color; vGl = iQ.z; vO = position;
  vBelow = (1. - smoothstep(-1.5, 1., vW.y)) * (1. - waveF(c.z));
  gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.);
}`,Oe=`
uniform vec3 uSun, uPlanet, uSunCol, uShineCol, uAmb, uCream, uBlue; uniform float uLitK;
varying vec3 vN, vW, vCol, vO; varying float vGl, vBelow;
#ifdef DETAIL
vec3 h33(vec3 p){ p = fract(p * vec3(.1031, .1030, .0973)); p += dot(p, p.yxz + 33.33); return fract((p.xxy + p.yxx) * p.zyx); }
// fracture cells: the nearest cell's own tilt, and the distance to the crack between cells
void facet(vec3 x, out vec3 cn, out float edge){
  vec3 ip = floor(x), fp = fract(x); float d1 = 8., d2 = 8.; vec3 best = vec3(.5);
  for (int k = -1; k <= 1; k++) for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec3 g = vec3(float(i), float(j), float(k)); vec3 o = h33(ip + g); vec3 r = g + o - fp; float d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; best = o; } else if (d < d2) { d2 = d; }
  }
  cn = best * 2. - 1.; edge = sqrt(d2) - sqrt(d1);
}
float vn3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  float a = mix(mix(h33(i).x, h33(i + vec3(1., 0., 0.)).x, f.x), mix(h33(i + vec3(0., 1., 0.)).x, h33(i + vec3(1., 1., 0.)).x, f.x), f.y);
  float b = mix(mix(h33(i + vec3(0., 0., 1.)).x, h33(i + vec3(1., 0., 1.)).x, f.x), mix(h33(i + vec3(0., 1., 1.)).x, h33(i + vec3(1., 1., 1.)).x, f.x), f.y);
  return mix(a, b, f.z); }
#endif
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)); vec3 V = normalize(cameraPosition - vW + vec3(0., 1e-5, 0.));
  vec3 alb = vCol; float hoar = 0.;
#ifdef DETAIL
  float fwO = length(fwidth(vO));
  float dk = 1. - smoothstep(.03, .14, fwO), gk = 1. - smoothstep(.006, .02, fwO);
  vec3 cn; float ed; facet(vO * vec3(2.2, 3.3, 2.6) + .25 * sin(vO.yzx * 6.3 + 1.7) + 7., cn, ed);
  vec3 cn2; float ed2; facet(vO * 6.3 + .3 * sin(vO.zxy * 11.) + 3., cn2, ed2);
  N = normalize(N + (cn * .4 + cn2 * .22 * gk) * dk);                     // fractured planes, finer than the mesh
  float cr = abs(vn3(vO * 2.4 + 11.) - .5), cr2 = abs(vn3(vO * 5.7 + 4.) - .5);
  float crack = (1. - smoothstep(.004, .022, cr)) * dk * .75 + (1. - smoothstep(.006, .03, cr2)) * gk * .45;   // a few long cracks
  vec3 gh = h33(floor(vO * 52.));
  alb *= (.94 + .12 * fract(cn.x * 7.3 + cn.y * 3.1)) * mix(1., .86 + .28 * gh.x, gk);   // facet tone and fine frost grain
  alb = mix(alb, uBlue * .4, min(crack, 1.) * .7);
  hoar = step(.985, gh.y) * gk;                                           // feathered hoar: glints that flash as the berg turns
#endif
  float ndl = dot(N, uSun); float lit = smoothstep(-.02, .09, ndl) * (1. - .96 * vBelow);
  vec3 col = alb * uSunCol * lit * (.3 + .7 * clamp(ndl, 0., 1.)) * uLitK * mix(vec3(.5, .7, 1.), vec3(1.), smoothstep(0., .65, ndl));
  float pl = smoothstep(-.15, .7, dot(N, uPlanet));
  col += alb * uShineCol * pl * (1. - lit * .75) * 1.25 * (1. - .55 * vBelow) + alb * uAmb;
  col += alb * uCream * uSunCol * vBelow * .1 * smoothstep(.1, .9, N.y);          // lit softly by the glowing ceiling
  vec3 H = normalize(uSun + V + vec3(0., 1e-5, 0.));
  float g = max(dot(N, H), 0.); g = g * g; g = g * g; g = g * g; g = g * g; g = g * g; g = g * g;
  col += uSunCol * g * lit * vGl * 3.;
  float g16 = max(dot(N, H), 0.); g16 *= g16; g16 *= g16; g16 *= g16; g16 *= g16;
  col += uSunCol * hoar * g16 * lit * 4.;
  float back = max(dot(-V, uSun), 0.); back *= back; back *= back;
  float rim = 1. - abs(dot(N, V)); rim = rim * rim * rim;
  col += uSunCol * rim * (back * 1.6 + vBelow * 2.2 * smoothstep(-.2, .5, N.y));     // dark shapes rimmed in fire-white
  gl_FragColor = vec4(col, 1.);
}`,Ne=`
uniform vec3 uSun; uniform float uShLen;
varying vec3 vUA;
#ifdef FIXED
attribute vec4 iP; attribute vec4 iQ; uniform float uTime, uPix;
${yt}
#else
${Le}
#endif
void main(){
#ifdef FIXED
  vec3 c = iP.xyz + vec3(0., 0., uTime * iQ.w); float r = iP.w; float sc = step(abs(c.y), r * 1.2) * (1. - waveF(c.z)); float gW = 0.;
#else
  float sc; vec3 c = stoneCentre(sc); float r = aP.w; float gW = gWave;
#endif
  vec2 g = normalize(-uSun.xz + vec2(1e-5, 0.)); vec2 pp = vec2(-g.y, g.x);
  float len = min(r * uShLen, 500.);
  float dist = length(cameraPosition - c);
  float ys = (cameraPosition.y > 0. ? 1. : -1.) * (.25 + dist * .004);
  vec2 xz = c.xz + g * (position.x * len + r * .3) + pp * position.y * r * 1.9 * (1. - .55 * position.x);
  vUA = vec3(position.xy, sc * (1. - gW) * (1. - smoothstep(420., 640., dist)));
  gl_Position = projectionMatrix * viewMatrix * vec4(xz.x, ys, xz.y, 1.);
}`,We=`
uniform vec3 uShTint; varying vec3 vUA;
void main(){
  float a = vUA.z * (1. - smoothstep(.2, .5, abs(vUA.y))) * (1. - .7 * smoothstep(.5, 1., vUA.x)) * smoothstep(0., .04, vUA.x);
  gl_FragColor = vec4(mix(vec3(1.), uShTint, a), 1.);
}`,yo=`
attribute vec4 aM;
uniform float uTime, uPix, uFlow, uMoteK; uniform vec3 uBoxM, uVel;
varying vec2 vQ; varying float vI;
${yt}
void main(){
  vec3 b = aM.xyz * uBoxM; b.z += uTime * uFlow * (.6 + .8 * aM.w);
  vec3 o = cameraPosition - uBoxM * vec3(.5, .5, .72);
  vec3 rel = mod(b - o, uBoxM); vec3 c = o + rel;
  float wv = waveF(c.z); float sig = mix(7., 46., wv);
  float wy = exp(-c.y * c.y / (2. * sig * sig));
  float rg = ragF(c.x);
  float w = c.z > 936. + rg ? max(wy, .05) : (c.z < 330. ? .5 : 0.);
  float keep = step(fract(aM.w * 17.37), w * uMoteK);
  vec3 f = rel / uBoxM; keep *= smoothstep(0., .08, f.z) * (1. - smoothstep(.9, 1., f.z));
  vec3 toC = c - cameraPosition; float dist = length(toC);
  vec3 sd = normalize(cross(uVel, toC) + vec3(1e-5, 0., 0.));
  float wd = max(.035 + .08 * aM.w, dist * uPix * 1.5);
  vec3 P = c + uVel * (position.y - .5) + sd * position.x * wd;
  float tw = .5 + .5 * sin(uTime * (3. + aM.w * 9.) + aM.w * 40.); tw *= tw; tw *= tw;
  vI = keep * smoothstep(1.2, 3.5, dist) * (.35 + 2.4 * tw); vQ = position.xy;
  gl_Position = projectionMatrix * viewMatrix * vec4(P, 1.);
}`,So=`
uniform vec3 uSunCol; varying vec2 vQ; varying float vI;
void main(){ float a = (1. - smoothstep(.1, .5, abs(vQ.x))) * smoothstep(0., .25, vQ.y) * (1. - smoothstep(.75, 1., vQ.y)); gl_FragColor = vec4(uSunCol * vI * a * .45, 1.); }`,Co=`
attribute vec3 color; attribute float aE;
varying vec3 vN, vW, vC; varying float vE, vInst;
void main(){
  mat4 m = modelMatrix; vInst = 0.;
#ifdef USE_INSTANCING
  m = modelMatrix * instanceMatrix; vInst = 1.;
#endif
  vec4 w = m * vec4(position, 1.); vW = w.xyz; vN = mat3(m) * normal; vC = color; vE = aE;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,Mo=`
uniform vec3 uSun, uPlanet, uSunCol, uShineCol, uAmb, uMint; uniform float uUnder;
varying vec3 vN, vW, vC; varying float vE, vInst;
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)); vec3 V = normalize(cameraPosition - vW + vec3(0., 1e-5, 0.));
  float ndl = dot(N, uSun); float lit = smoothstep(-.02, .12, ndl) * (1. - .8 * uUnder);
  vec3 col = vC * uSunCol * lit * (.45 + .55 * clamp(ndl, 0., 1.));
  col += vC * uShineCol * smoothstep(-.2, .7, dot(N, uPlanet)) * 1.6 + vC * uAmb * 2.;
  float rim = 1. - abs(dot(N, V)); rim *= rim * rim;
  col += rim * (uSunCol * .05 * smoothstep(-.3, .4, ndl) + uShineCol * .22 * smoothstep(-.3, .5, dot(N, uPlanet)));
  col += uSunCol * uUnder * .03 * smoothstep(0., 1., N.y);
  col += uSunCol * rim * uUnder * vInst * .5 * smoothstep(-.3, .4, N.y);
  col += uMint * vE;
  gl_FragColor = vec4(col, 1.);
}`,Ao=`
attribute vec4 aC; attribute float aS; uniform float uPix; varying vec4 vC;
void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp(aS / max(-mv.z * uPix, 1e-4), 2.5, 72.); vC = aC; }`,zo=`
varying vec4 vC;
void main(){ float r = clamp(1. - length(gl_PointCoord - .5) * 2., 0., 1.); float g = r * r * r * .55 + smoothstep(.55, .9, r) * vC.a; gl_FragColor = vec4(vC.rgb * g, 1.); }`,Po=`
uniform float uTime; varying vec2 vUv;
void main(){ vUv = uv; vec3 p = position; float s = uv.x;
  p.x += sin(s * 9. - uTime * 15. + p.x * 3.) * .06 * s; p.y += sin(s * 7. - uTime * 11. + 1.7) * .05 * s;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.); }`,Fo=`
uniform float uTime; uniform vec3 uFrost; varying vec2 vUv;
${it}
void main(){ float s = vUv.x; float a = (1. - s) * sqrt(max(1. - s, 0.)) * smoothstep(0., .04, s) * (1. - abs(vUv.y - .5) * 2.);
  a *= .35 + .65 * vn(vec2(s * 14. - uTime * 10., vUv.y * 2.)); gl_FragColor = vec4(uFrost * a * .55, 1.); }`,To="varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",Vo=`
uniform float uAmt, uTime; uniform vec3 uFrost; varying vec2 vUv;
${it}
void main(){
  vec2 p = vUv * 2. - 1.; float ax = abs(p.x), ay = abs(p.y) * .92; float mx = max(abs(p.x), abs(p.y));
  float e = smoothstep(.72, .98, max(ax, ay)) * (1. - smoothstep(.97, 1., mx));
  // dendrites growing in from the nearest edge: needles pointing inward, feathered with barbs at an angle
  float sx = step(ay, ax);
  float al = mix(1. - abs(p.y), 1. - abs(p.x), sx), ac = mix(p.x, p.y, sx);
  float wob = vn(vec2(ac * 6., al * 5.) + 3.) - .5;
  float n1 = vn(vec2(ac * 34. + wob * 2.2, al * 5.));
  float needle = 1. - abs(n1 - .5) * 2.; needle *= needle; needle *= needle;
  float n2 = vn(vec2((ac + al * .7) * 90., (al - ac * .7) * 16.)), n3 = vn(vec2((ac - al * .7) * 90., (al + ac * .7) * 16.) + 7.);
  float barb = max(1. - abs(n2 - .5) * 2., 1. - abs(n3 - .5) * 2.); barb *= barb; barb *= barb; barb *= barb;
  float fe = max(needle, barb * smoothstep(.2, .7, needle + .3));
  float m = fe * e * min(uAmt * 1.6, 1.) * smoothstep(1. - uAmt, 1.25 - uAmt, e + .3 * fe);
  float sp = step(.985, h21(floor(vUv * vec2(260., 150.)) + floor(uTime * 3.))) * m;
  gl_FragColor = vec4(uFrost * (m * .3 + sp * 1.2), 1.);
}`,Bo=`varying vec2 vUv; varying vec3 vW;
void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,Uo=`
uniform vec4 uHole[6]; uniform vec3 uSunCol, uFrost; uniform float uTime;
varying vec2 vUv; varying vec3 vW;
${it}
void main(){
  float n = fbm(vec2(vUv.x * 12. + vUv.y * 3., vUv.y * 2.5 - uTime * .04));
  float st = fbm(vec2(vUv.x * 70. + vUv.y * 26., vUv.y * 1.4 - uTime * .08));
  float up = 1. - vUv.y;
  float fil = smoothstep(.3, .72, st);                         // sheared filaments of ejecta with dark lanes between, not a fog
  float a = smoothstep(0., .1, vUv.x) * (1. - smoothstep(.82, 1., vUv.x)) * up * up * smoothstep(0., .04, vUv.y) * (.3 + .7 * n) * (.14 + .86 * fil);
  vec2 gq = vec2(vUv.x * 2600. + vUv.y * 900., vUv.y * 420.);
  float gl = step(.97, h21(floor(gq) + floor(uTime * 5.))) * (1. - smoothstep(.3, 1., max(fwidth(gq.x), fwidth(gq.y))));
  for (int i = 0; i < 6; i++) { float r = max(uHole[i].w, .01); a *= smoothstep(r * .65, r * 1.2, length(vW - uHole[i].xyz) + step(uHole[i].w, .02) * 100.); }
  a *= .25 + .75 * smoothstep(40., 260., length(cameraPosition - vW));
  gl_FragColor = vec4(uSunCol * uFrost * a * (.55 + 2.2 * gl), 1.);
}`,ko="varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",qo=`
uniform vec3 uMint, uShineCol; uniform float uK, uTime; varying vec2 vUv;
${it}
void main(){
  vec2 p = (vUv - .5) * 100.; float r = length(p);
  float ray = .75 + .25 * vn(p / max(r, 1.) * 3. + vec2(r * .06 - uTime * .35, 7.));
  float g = smoothstep(6.7, 7.8, r) * exp(-max(r - 7., 0.) / 10.) * (1. - smoothstep(38., 50., r));
  vec3 col = mix(uMint, vec3(1.), .35) * g * ray * uK * .8;
  // the giant lights the right rim butterscotch
  float side = smoothstep(-.1, .8, p.x / max(r, 1.));
  col += uShineCol * 6. * side * smoothstep(6.6, 7.3, r) * (1. - smoothstep(7.5, 11., r)) * uK;
  gl_FragColor = vec4(col, 1.);
}`,Go=`
attribute vec4 aS;   // t (-1..1 along), side (-1..1), length, width
attribute float aH;
uniform vec3 uSun; varying vec3 vQ; varying float vF;
void main(){
  vec3 c = position; vec3 toC = c - cameraPosition;
  vec3 sd = normalize(cross(uSun, toC) + vec3(0., 1e-4, 0.));
  vec3 P = c - uSun * aS.x * aS.z + sd * aS.y * aS.w;
  vQ = vec3(aS.xy, aH);
  vF = smoothstep(30., 120., length(P - cameraPosition)) * (1. - smoothstep(520., 760., length(toC)));
  gl_Position = projectionMatrix * viewMatrix * vec4(P, 1.);
}`,_o=`
uniform vec3 uSunCol, uCream; uniform float uTime; varying vec3 vQ; varying float vF;
${it}
void main(){
  float e = 1. - vQ.y * vQ.y; e *= e * e;
  float l = smoothstep(-1., -.2, vQ.x) * (1. - smoothstep(-.2, 1., vQ.x));
  float n = .25 + .75 * vn(vec2(vQ.y * 5. + vQ.z * 31., vQ.x * 1.3 - uTime * .12 + vQ.z * 5.));   // rays within the shaft
  n *= .7 + .3 * vn(vec2(vQ.x * 9. - uTime * .3, vQ.z * 17.));
  gl_FragColor = vec4(uSunCol * mix(uCream, vec3(1.), .4) * e * l * n * vF * .034, 1.);
}`,vt=(r,i,A)=>{const S=Math.min(1,Math.max(0,(A-r)/(i-r)));return S*S*(3-2*S)};function Qe(r,i,A){const S=Math.sin(r*127.1+i*311.7+A*74.7)*43758.5453;return S-Math.floor(S)}function De(r,i,A,S,z){let l=r===0?new e.OctahedronGeometry(1,0):new e.IcosahedronGeometry(1,r===1?0:r===2?1:2);const I=l.attributes.position,h=new e.Vector3,J=r===3?[1.12,.8,.95]:[i.range(1.1,1.3),i.range(.55,.75),i.range(.8,1)],K=[];for(let b=0;b<[0,2,5,9][r];b++)K.push({n:new e.Vector3(i.gauss(),i.gauss(),i.gauss()).normalize(),d:i.range(.42,.72)});const mt=i.range(0,50),N=r===3?.32:.5;for(let b=0;b<I.count;b++){h.fromBufferAttribute(I,b);const P=.74+N*Qe(Math.round(h.x*100)+mt,Math.round(h.y*100),Math.round(h.z*100));h.multiplyScalar(P);for(const U of K){const q=h.dot(U.n)-U.d;q>0&&h.addScaledVector(U.n,-q*.92)}I.setXYZ(b,h.x*J[0],h.y*J[1],h.z*J[2])}if(l.deleteAttribute("uv"),r>=2){l.deleteAttribute("normal"),l=mo(l,.001),l.computeVertexNormals();const b=l.attributes.position.count,P=new Float32Array(b*3),U=new e.Color;for(let q=0;q<b;q++){const St=i.range(.58,.74),Ct=i();U.copy(A).lerp(Ct<.25?S:z,Ct<.25?.25:i.range(0,.22)).multiplyScalar(St),P[q*3]=U.r,P[q*3+1]=U.g,P[q*3+2]=U.b}return l.setAttribute("color",new e.BufferAttribute(P,3)),l}l.computeVertexNormals();const g=new Float32Array(I.count*3),D=new e.Color;for(let b=0;b<I.count/3;b++){const P=i.range(.5,.78),U=i();D.copy(A).lerp(U<.25?S:z,U<.25?.3:i.range(0,.25)).multiplyScalar(P);for(let q=0;q<3;q++)g.set([D.r,D.g,D.b],(b*3+q)*3)}return l.setAttribute("color",new e.BufferAttribute(g,3)),l}function B(r,i,A=0,S=null){r.index&&(r=r.toNonIndexed()),S&&r.applyMatrix4(S),r.deleteAttribute("uv"),r.computeVertexNormals();const z=r.attributes.position.count,l=new Float32Array(z*3),I=new Float32Array(z);for(let h=0;h<z;h++)l[h*3]=i[0],l[h*3+1]=i[1],l[h*3+2]=i[2],I[h]=A;return r.setAttribute("color",new e.BufferAttribute(l,3)),r.setAttribute("aE",new e.BufferAttribute(I,1)),r}const Re=new e.Quaternion,Io=new e.Matrix4,Eo=new e.Vector3(0,0,-1),Lo=new e.Vector3(1,1,1);function j(r,i,A,S,z,l=0,I=1){const h=new e.Vector3(...r),J=new e.Vector3(...i),K=h.distanceTo(J),mt=new e.BoxGeometry(A,S,K).translate(0,0,-K/2),N=mt.attributes.position;for(let g=0;g<N.count;g++)N.getZ(g)<-K/2&&N.setXY(g,N.getX(g)*I,N.getY(g)*I);return Re.setFromUnitVectors(Eo,J.clone().sub(h).normalize()),B(mt,z,l,Io.compose(h,Re,Lo).clone())}var Xo={id:"ring-run",name:"The Ring Run",category:"alien",media:["space"],weirdness:.3,async build(r){const{rng:i}=r,A=r.vary||{},S=r.quality&&r.quality.detail||1,z=Math.min(1.3,Math.max(.7,A.density??1)),l=new e.Scene;l.background=new e.Color("#020308"),l.fog=new e.FogExp2("#060a14",7e-5);const I=qe.map(t=>new e.Color(t)),[h,J,K,mt,N,,g]=I;let D=i.int(0,2);A.hour==="dawn"||A.hour==="golden"||A.hour==="night"?D=1:A.hour==="day"&&(D=2);const b=[14,4,30][D],P=i.int(0,2),U=i.pick(["ice","ice","rose","braid"]),q=i.pick(["potato","potato","walnut","pair"]),St=Math.max(0,Math.min(5,Math.round(i.pick([0,1,2,3,3,3,4,5])*z))),Ct=i.chance(.35),Ot=!!A.rare,Nt=new e.Vector3(.54,.09,-.8).normalize(),tt=await ho(r,{palette:qe,sunElevation:b,planetDir:Nt.toArray(),ring:U,moon:q,density:Math.min(1,z)});l.add(tt.object);const V=tt.uniforms,et=tt.anchors,Oo=et.sunDir.clone(),Xe=P===1?new e.Color("#E9D49A"):h;V.uShineCol.value.copy(Xe).multiplyScalar(P===2?.5:.42),await r.yield();const Mt=t=>t<2900?-40*Math.sin((t-2250)/400*Math.PI*2)*vt(2250,2330,t)*(1-vt(2770,2850,t))+22*Math.sin((t-300)/400*Math.PI*2)*vt(300,370,t)*(1-vt(630,700,t)):-25*Math.pow(Math.sin(Math.PI*Math.min(1,(t-2900)/480)),2),Wt=t=>20-90*vt(750,1050,t)+110*vt(2150,2800,t),Qt=[];for(let t=0;t<=3380;t+=26)Qt.push([Mt(t),Wt(t),E-t]);for(let t=2;t<et.flyThrough.length;t++)Qt.push(et.flyThrough[t].clone());const L=po(Qt,{samples:480}),At=L.length,ue=[];{const t=[],o=new e.Vector3;for(let a=0;a<=1600;a++)L.pointAt(a/1600,o),t.push(o.x,o.y,o.z);let n=1600;for(let a=0;a<Lt;a++){const c=ce+a*Ge;for(;n>0&&t[n*3+2]<c;)n--;ue.push(new e.Vector2(t[n*3],t[n*3+1]))}}await r.yield();const No=t=>Math.min(1,t/At),Wo=V.uSunCol.value,fe={uTime:V.uTime,uPix:V.uPix,uSun:V.uSun,uPlanet:V.uPlanet,uSunCol:V.uSunCol,uShineCol:V.uShineCol,uAmb:V.uAmb,uFrost:V.uFrost,uCream:V.uCream,uBlue:V.uBlue,uX0:V.uX0,uX1:V.uX1,uPath:{value:ue},uMint:{value:g.clone()},uUnder:{value:0},uLitK:{value:.5}},$=(t,o,n,a={})=>new e.ShaderMaterial(Object.assign({uniforms:Object.assign({},fe,n),vertexShader:t,fragmentShader:o},a)),ot=(t,o,n,a={})=>$(t,o,n,Object.assign({transparent:!0,depthWrite:!1,blending:e.AdditiveBlending},a));await r.yield();const dt=new e.Vector3(0,1,0),Dt=new e.Vector3(Nt.x,.035,Nt.z).normalize(),ve=new e.Vector3().crossVectors(Dt,dt).normalize(),He=new e.Vector3().crossVectors(ve,Dt).normalize(),zt=P===1?["#E9D49A","#5E7896","#F4ECD2","#7F9DBE"]:["#E8B46A","#B9762F","#F7E6C2","#B9762F"],je=$(go,xo,{uPl:{value:Dt},uPlR:{value:ve},uPlU:{value:He},uC1:{value:new e.Color(zt[0])},uC2:{value:new e.Color(zt[1])},uC3:{value:new e.Color(zt[2])},uC4:{value:new e.Color(zt[3])},uM1:{value:new e.Vector3(-.36,.3,-.88).normalize()},uM2:{value:new e.Vector3(.12,.42,-.9).normalize()},uPlRad:{value:Math.sin(e.MathUtils.degToRad(P===2?39:35))},uKind:{value:P},uTilt:{value:P===1?-.44:i.range(-.05,.05)},uShLat:{value:P===2?.05:.06+b*.004},uStormLon:{value:i.range(-.75,-.2)},uStormLat:{value:i.range(.2,.42)*(P===1?-.6:1)}},{depthTest:!1,depthWrite:!1,side:e.BackSide}),Rt=new e.Mesh(new e.IcosahedronGeometry(10,3),je);Rt.frustumCulled=!1,Rt.renderOrder=-10,l.add(Rt);const Ke=.011*Math.tan(e.MathUtils.degToRad(b))/Math.tan(e.MathUtils.degToRad(14)),me=t=>({uFar:{value:t},uCombK:{value:Math.max(.0035,Ke)},uCombT:{value:[.5,.42,.56][D]},uRose:{value:U==="rose"?1:0},uBraid:{value:U==="braid"?1:0},uShC:{value:new e.Vector3(9800,-5200,6200)}}),de=(t,o,n)=>new e.PlaneGeometry(3e4,o-t).rotateX(-Math.PI/2).translate(0,n,(t+o)/2),pe=new e.Mesh(de(840,14e3,0),$(_e,Ie,me(0),{side:e.DoubleSide})),he=new e.Mesh(de(-14e3,350,-1.5),$(_e,Ie,me(1),{side:e.DoubleSide}));pe.frustumCulled=he.frustumCulled=!1,l.add(pe,he),await r.yield();const ge=V.uFrost.value.clone().multiplyScalar(1/.66),xe=2/Math.tan(e.MathUtils.degToRad(Math.max(b,5))),we=N.clone().multiplyScalar(.3).lerp(new e.Color(1,1,1),.06),pt=new e.PlaneGeometry(1,1).translate(.5,0,0),G=i.fork("stones"),$e=[{kind:0,n:Math.round(9700*S*z),L:640,half:330,pw:2,rmin:.28,rmax:1.1,alpha:2.2,drift:[2,9],shadow:!1},{kind:1,n:Math.round(4200*Math.max(.8,S)*z),L:1300,half:620,pw:1.6,rmin:1.4,rmax:5.5,alpha:1.9,drift:[1,6],shadow:!0},{kind:2,n:Math.round(420*z),L:2400,half:1500,pw:1.25,rmin:6,rmax:15,alpha:2.2,drift:[.5,3],shadow:!0}];for(const t of $e){const o=De(t.kind,G,ge,N,K),n=new Float32Array(t.n*4),a=new Float32Array(t.n*4),c=new Float32Array(t.n*3);for(let v=0;v<t.n;v++)n[v*4]=G.sign()*t.half*Math.pow(G(),t.pw),n[v*4+1]=G(),n[v*4+2]=G.gauss(),n[v*4+3]=Math.min(t.rmax,t.rmin*Math.pow(1-G()*.985,-1/t.alpha)),a[v*4]=G.range(0,6.283),a[v*4+1]=G.range(t.drift[0],t.drift[1]),a[v*4+2]=G()<.35?G.range(.6,1.6):.1,a[v*4+3]=G(),c[v*3]=G.gauss(),c[v*3+1]=G.gauss(),c[v*3+2]=G.gauss();const f=new e.InstancedBufferAttribute(n,4),d=new e.InstancedBufferAttribute(a,4),u=new e.InstancedBufferGeometry;u.setAttribute("position",o.attributes.position),u.setAttribute("normal",o.attributes.normal),u.setAttribute("color",o.attributes.color),u.setAttribute("aP",f),u.setAttribute("aQ",d),u.setAttribute("aAxis",new e.InstancedBufferAttribute(c,3)),o.index&&u.setIndex(o.index),u.instanceCount=t.n;const y={uL:{value:t.L},uAhead:{value:.8}},M=new e.Mesh(u,$(wo,Oe,y,t.kind===2?{defines:{DETAIL:1}}:{}));if(M.frustumCulled=!1,l.add(M),t.shadow){const v=new e.InstancedBufferGeometry;v.setAttribute("position",pt.attributes.position),v.setIndex(pt.index),v.setAttribute("aP",f),v.setAttribute("aQ",d),v.instanceCount=t.n;const s=new e.Mesh(v,$(Ne,We,Object.assign({uShLen:{value:xe},uShTint:{value:we}},y),{transparent:!0,depthWrite:!1,blending:e.MultiplyBlending,side:e.DoubleSide}));s.frustumCulled=!1,s.renderOrder=1,l.add(s)}await r.yield()}const m=i.fork("bergs"),Xt=[],_=(t,o,n,a,c=!1)=>{const f=E-t;let d=Mt(Math.min(t,2899))+o,u=0;for(;L.distanceTo(d,n,f)<a*1.3+7.5&&u++<30;)d+=(o<0?-1:1)*2.5;const y=c?0:m.range(-1.2,1.2);f-a<962||Xt.push([d,n,f,a,y])};_(250,-62,2,12),_(520,96,-3,18),_(830,-140,3,22),_(1010,48,0,10),_(400,-29,6,16,!0),_(490,27,8,13,!0),_(522,-36,4,18,!0),_(600,28,6,17,!0),_(716,27,7,12,!0);for(let t=0;t<Math.round(20*z);t++){const o=m.range(8,20);_(m.range(80,1550),m.sign()*m.range(50,560),m.range(-.35,.35)*o,o)}await r.yield();for(let t=0;t<7;t++){const o=m.range(12,22);_(1380+t*118+m.range(-30,30),(t%2?1:-1)*(o*1.3+m.range(9,17)),-70+m.range(6,30),o,!0)}for(let t=0;t<Math.round(13*z);t++){const o=m.range(12,28);_(m.range(1330,2250),m.sign()*m.range(50,420),-o*m.range(.4,.7),o)}await r.yield();for(let t=2296,o=0;t<2885;t+=25,o++){const n=m.range(8,17);_(t,(o%2?1:-1)*(n*1.3+m.range(8.5,11.5)),Wt(t)+m.range(-.5,.5)*n,n,!0)}for(let t=0;t<Math.round(36*z);t++){const o=m.range(9,24);_(m.range(2270,2850),m.sign()*m.range(46,320),m.gauss()*36,o)}await r.yield();const Ht=[pt];{const t=De(3,m,ge,N,K);Ht.push(t);const o=Xt.length,n=new Float32Array(o*4),a=new Float32Array(o*4),c=new Float32Array(o*3);Xt.forEach((s,p)=>{n.set([s[0],s[1],s[2],s[3]],p*4),a.set([m.range(0,6.283),m.range(.03,.11)*m.sign(),m.range(.5,1.5),s[4]],p*4),c.set([m.gauss(),m.gauss(),m.gauss()],p*3)});const f=new e.InstancedBufferAttribute(n,4),d=new e.InstancedBufferAttribute(a,4),u=new e.InstancedBufferGeometry;u.setAttribute("position",t.attributes.position),u.setAttribute("normal",t.attributes.normal),u.setAttribute("color",t.attributes.color),u.setAttribute("iP",f),u.setAttribute("iQ",d),u.setAttribute("iAxis",new e.InstancedBufferAttribute(c,3)),u.instanceCount=o,t.index&&u.setIndex(t.index);const y=new e.Mesh(u,$(bo,Oe,{uLitK:{value:.42}},{defines:{DETAIL:1}}));y.frustumCulled=!1,l.add(y);const M=new e.InstancedBufferGeometry;M.setAttribute("position",pt.attributes.position),M.setIndex(pt.index),M.setAttribute("iP",f),M.setAttribute("iQ",d),M.instanceCount=o;const v=new e.Mesh(M,$(Ne,We,{uShLen:{value:xe},uShTint:{value:we}},{transparent:!0,depthWrite:!1,blending:e.MultiplyBlending,side:e.DoubleSide,defines:{FIXED:1}}));v.frustumCulled=!1,v.renderOrder=1,l.add(v)}await r.yield();const jt={uBoxM:{value:new e.Vector3(40,26,200)},uVel:{value:new e.Vector3(0,0,-2.6)},uFlow:{value:22},uMoteK:{value:1}};{const t=Math.round(2400*S),o=new Float32Array(t*4),n=i.fork("motes");for(let d=0;d<t*4;d++)o[d]=n();const a=new e.PlaneGeometry(1,1).translate(0,.5,0);Ht.push(a);const c=new e.InstancedBufferGeometry;c.setAttribute("position",a.attributes.position),c.setIndex(a.index),c.setAttribute("aM",new e.InstancedBufferAttribute(o,4)),c.instanceCount=t;const f=new e.Mesh(c,ot(yo,So,jt,{side:e.DoubleSide}));f.frustumCulled=!1,f.renderOrder=3,l.add(f)}await r.yield();const W=[.018,.02,.025],at=[.03,.033,.04],lt=[.008,.009,.012],Ye=[.1,.11,.13],ct=$(Co,Mo,{}),Q=new e.Group;l.add(Q);const be=[[-.7,-1.2,-6.3],[.7,-1.2,-6.3]];{const t=[];for(const a of[-1,1]){t.push(j([a*.7,-1.34,-.6],[a*.7,-1.2,-6.3],.2,.15,W,0,.28)),t.push(j([a*.7,-1.255,-2.2],[a*.7,-1.19,-5],.035,.02,at,.5,.6)),t.push(B(new e.OctahedronGeometry(.075,0),W,5,new e.Matrix4().makeTranslation(a*.7,-1.2,-6.32))),t.push(j([a*1.58,-1,-1.2],[a*1,1.25,-1.12],.017,.03,Ye)),t.push(j([a*1,1.25,-1.12],[0,1.32,-.6],.04,.07,W));let c=null;for(let f=0;f<=6;f++){const d=f/6*1.5,u=[a*Math.sin(d)*1.5,-1.02-.02*f,-.25-Math.cos(d)*1.75];c&&t.push(j(c,u,.16,.18,f%2?W:at)),c=u}}t.push(j([0,1.32,-.6],[0,1.36,1.2],.1,.12,W)),t.push(j([0,-1.2,-1.2],[0,-1.36,-3.4],1.7,.12,lt,0,.82));for(let a=-1;a<=1;a++)t.push(B(new e.BoxGeometry(.03,.03,.02),W,3.2,new e.Matrix4().makeTranslation(a*.09,-.905,-1.87)));const o=Et(t);t.forEach(a=>a.dispose());const n=new e.Mesh(o,ct);n.frustumCulled=!1,Q.add(n)}await r.yield();const Pt=new e.Mesh(B(new e.BoxGeometry(.46,.014,.014),W,3.4),ct);Pt.position.set(0,-.855,-1.98),Pt.frustumCulled=!1,Q.add(Pt);const ye=[-1,1].map(t=>{const o=B(new e.BoxGeometry(.5,.03,.6).translate(t*.25,0,0),at,0),n=new e.Mesh(o,ct);return n.position.set(t*1.6,-1,-1.75),n.frustumCulled=!1,Q.add(n),n}),Se=ot(Ao,zo,{});{const t=new e.BufferGeometry;t.setAttribute("position",new e.Float32BufferAttribute(be.flat(),3)),t.setAttribute("aC",new e.Float32BufferAttribute([g.r*2.2,g.g*2.2,g.b*2.2,1.2,g.r*2.2,g.g*2.2,g.b*2.2,1.2],4)),t.setAttribute("aS",new e.Float32BufferAttribute([.75,.75],1));const o=new e.Points(t,Se);o.frustumCulled=!1,o.renderOrder=6,Q.add(o);const n=[],a=[],c=[],f=14;be.forEach((y,M)=>{const v=M?1:-1,s=n.length/3;for(let p=0;p<=f;p++){const x=p/f,F=.02+.2*x,H=[y[0]+v*(.25*x+1.6*x*x),y[1]+.18*x+.5*x*x,y[2]+6.4*x];if(n.push(H[0]-F*.5,H[1],H[2],H[0]+F*.5,H[1]+F*.6,H[2]),a.push(x,0,x,1),p<f){const T=s+p*2;c.push(T,T+1,T+2,T+1,T+3,T+2)}}});const d=new e.BufferGeometry;d.setAttribute("position",new e.Float32BufferAttribute(n,3)),d.setAttribute("uv",new e.Float32BufferAttribute(a,2)),d.setIndex(c);const u=new e.Mesh(d,ot(Po,Fo,{},{side:e.DoubleSide}));u.frustumCulled=!1,u.renderOrder=5,Q.add(u)}const Ce={uAmt:{value:0}};{const t=new e.Mesh(new e.PlaneGeometry(2.3,1.3),ot(To,Vo,Ce,{depthTest:!1}));t.position.set(0,0,-.85),t.frustumCulled=!1,t.renderOrder=20,Q.add(t)}await r.yield();const Y=i.fork("cast"),Ze=Et([B(new e.ConeGeometry(.95,7,4).rotateX(-Math.PI/2).scale(1,.42,1).translate(0,0,-1.5),W),B(new e.ConeGeometry(.95,2.2,4).rotateX(Math.PI/2).scale(1,.42,1).translate(0,0,3.1),lt),j([-.3,0,1.2],[-2.3,.25,3.6],.5,.06,at,0,.3),j([.3,0,1.2],[2.3,.25,3.6],.5,.06,at,0,.3),B(new e.BoxGeometry(.7,.14,.1),W,4,new e.Matrix4().makeTranslation(0,0,4.15))]);await r.yield();const ht=new e.InstancedMesh(Ze,ct,5);ht.count=St,ht.frustumCulled=!1,l.add(ht);const Me=[];for(let t=0;t<5;t++)Me.push({ahead:t===0?205:Y.range(70,300),lat:Y.sign()*Y.range(7,20),amp:Y.range(5,11),f:Y.range(.45,.9),ph:Y.range(0,6.28),yo:Y.range(.75,1.15)});const gt=10,Ae=[];for(let t=0;t<gt;t++)Ae.push(120+150*t);const Je=Et([B(new e.CylinderGeometry(.1,.32,13,5).translate(0,6.5,0),at),B(new e.OctahedronGeometry(.42,0).translate(0,13.3,0),W,2.5)]),Kt=new e.InstancedMesh(Je,ct,gt);Kt.frustumCulled=!1,l.add(Kt);const to=Ae.map((t,o)=>{const n=t>840?-1:1,a=Mt(t)-13,c=new e.Matrix4().makeRotationX(n<0?Math.PI:0).setPosition(a,0,E-t);return Kt.setMatrixAt(o,c),new e.Vector3(a,13.3*n,E-t)}),$t=Ct?4:1,Yt=Et([B(new e.IcosahedronGeometry(13,1),[.5,.54,.6]),B(new e.TorusGeometry(13.3,.4,4,14),lt),B(new e.TorusGeometry(13.3,.4,4,14).rotateY(Math.PI/2),lt),B(new e.TorusGeometry(13.3,.4,4,14).rotateX(Math.PI/2),lt),j([0,0,0],[26,0,0],.5,.5,lt),B(new e.BoxGeometry(9,3,3.4).translate(30,0,0),at),B(new e.BoxGeometry(.5,.8,3.6).translate(34.6,0,0),W,3)]);{const t=Yt.attributes.position,o=new e.Vector3;for(let n=0;n<t.count;n++){o.fromBufferAttribute(t,n);const a=o.length();a<13.05&&a>12.9&&(o.multiplyScalar(.8+.3*Qe(Math.round(o.x*10),Math.round(o.y*10),Math.round(o.z*10))),t.setXYZ(n,o.x,o.y,o.z))}Yt.computeVertexNormals()}await r.yield();const Ft=new e.InstancedMesh(Yt,ct,$t);Ft.frustumCulled=!1,l.add(Ft);const eo=Y.range(560,700),oo=Y.range(-46,-22),ut=18,Tt=5+5*ut+gt+4+1,Vt=new Float32Array(Tt*3),xt=new Float32Array(Tt*4),ze=new Float32Array(Tt),nt=new e.BufferGeometry;nt.setAttribute("position",new e.BufferAttribute(Vt,3)),nt.setAttribute("aC",new e.BufferAttribute(xt,4)),nt.setAttribute("aS",new e.BufferAttribute(ze,1));const Zt=new e.Points(nt,Se);Zt.frustumCulled=!1,Zt.renderOrder=4,l.add(Zt);const wt=(t,o,n,a,c,f=1)=>{Vt[t*3]=o.x,Vt[t*3+1]=o.y,Vt[t*3+2]=o.z,xt[t*4]=n.r*a,xt[t*4+1]=n.g*a,xt[t*4+2]=n.b*a,xt[t*4+3]=f,ze[t]=c},st=new e.Vector3(-560,0,E-470),Jt=new e.Vector3(520,0,E-1010),Bt=new e.Vector3(-45,70,-26),R=new e.Vector3().subVectors(Jt,st).cross(Bt).normalize();R.z<0&&R.negate();const Ut=[];for(let t=0;t<6;t++)Ut.push(new e.Vector4(0,0,0,0));{const t=new e.PlaneGeometry(1,1,30,6),o=t.attributes.position,n=t.attributes.uv;for(let c=0;c<o.count;c++){const f=n.getX(c),d=n.getY(c);o.setXYZ(c,st.x+(Jt.x-st.x)*f+Bt.x*d,Bt.y*d,st.z+(Jt.z-st.z)*f+Bt.z*d)}const a=new e.Mesh(t,ot(Bo,Uo,{uHole:{value:Ut}},{side:e.DoubleSide}));a.frustumCulled=!1,a.renderOrder=2,a.visible=Ot,l.add(a)}await r.yield();const Pe={uK:{value:.5}};{const t=new e.Mesh(new e.PlaneGeometry(100,100),ot(ko,qo,Pe,{side:e.DoubleSide}));t.position.copy(et.portalSeat.position).addScaledVector(et.approachDir,.6),t.lookAt(t.position.clone().sub(et.approachDir)),t.frustumCulled=!1,t.renderOrder=7,l.add(t);const o=i.fork("shafts"),n=5,a=[],c=[],f=[],d=[];for(let M=0;M<n;M++){const v=2350+M*105+o.range(-20,20),s=M%2?1:-1,p=[Mt(v)+s*o.range(16,30),Wt(v)+o.range(10,22),E-v],x=o.range(130,200),F=o.range(2.5,5),H=o(),T=a.length/3;for(const re of[-1,1])for(const ie of[-1,1])a.push(p[0],p[1],p[2]),c.push(re,ie,x,F),f.push(H);d.push(T,T+1,T+2,T+1,T+3,T+2)}const u=new e.BufferGeometry;u.setAttribute("position",new e.Float32BufferAttribute(a,3)),u.setAttribute("aS",new e.Float32BufferAttribute(c,4)),u.setAttribute("aH",new e.Float32BufferAttribute(f,1)),u.setIndex(d);const y=new e.Mesh(u,ot(Go,_o,{},{side:e.DoubleSide}));y.frustumCulled=!1,y.renderOrder=3,l.add(y)}await r.yield();const{smoothstep:C,bell:kt,clamp:Fe}=r.core,O=L.nearestXZ(0,E-840).u,rt=L.nearestXZ(0,930).u,qt=L.nearestXZ(0,330).u,te=L.nearestXZ(0,E-2250).u,X=new e.Vector3,ee=new e.Quaternion,ao=new e.Vector3,oe=new e.Vector3,Te=new e.Vector3,Gt=new e.Quaternion,bt=new e.Quaternion,Z=new e.Matrix4,w=new e.Vector3,ft=new e.Vector3,_t=new e.Vector3,ae=new e.Vector3,Ve=new e.Vector3,no=new e.Vector3(0,0,1),Be=new e.Vector3,so=new e.Color(.75,.85,1),It=new e.Vector3,ne=new e.Vector3,ro=new e.Vector3,io=et.portalSeat.position,Ue=t=>{const o=E-t;return C(2180,2420,o)*(1-C(2850,2925,o))},se=tt.object.children.filter(t=>/^stones/.test(t.name)&&t.userData.full);function lo(t,o,n,a){a=a||0,tt.setProgress(.3+.35*C(rt-.03,qt,a)),V.uRise.value=.03+.97*C(O+.05,O+.17,a),Pe.uK.value=.5+.5*C(qt-.03,.93,a);const c=a>O+.03?1:.35;for(let s=0;s<se.length;s++)se[s].geometry.instanceCount=Math.floor(se[s].userData.full*c);tt.update(t,o,n),n.matrixWorld.decompose(X,ee,ao),fe.uUnder.value=C(3,-8,X.y)*(1-Ue(X.z)),L.tangentAt(a,oe),jt.uVel.value.copy(oe).multiplyScalar(2.8);const f=C(O-.012,O,a)*(1-C(O+.004,O+.02,a));jt.uMoteK.value=1+2.5*f,Ce.uAmt.value=C(O-.006,O+.004,a)*(1-C(O+.015,O+.05,a)),Z.lookAt(Ve,oe,dt),Gt.setFromRotationMatrix(Z).slerp(ee,.74),Q.quaternion.copy(Gt);const d=a>0?1:0,u=1-C(0,.006,a);Q.position.copy(X),Q.position.y+=Math.sin(o*37)*.004-u*2.2,Q.scale.setScalar(d?1:1e-4),Te.set(1,0,0).applyQuaternion(ee);const y=Math.asin(Fe(Te.y,-1,1));Pt.rotation.z=-y*1.6+Math.sin(o*1.7)*.012,ye[0].rotation.z=y*2.2+Math.sin(o*5.3)*.03+.12,ye[1].rotation.z=y*2.2+Math.sin(o*4.7+1)*.03-.12;const M=a*At;for(let s=0;s<5;s++){const p=Me[s],x=M+p.ahead,F=s<St&&x<At-2,H=x/At,T=1-C(.84,.95,H);L.posAtDist(x,w),L.tangentAtDist(x,ft),_t.crossVectors(ft,dt).normalize(),ae.crossVectors(_t,ft);const re=Math.sin(o*p.f+p.ph),ie=Math.cos(o*p.f+p.ph),le=Math.max(0,Math.sin(o*.37+p.ph*2)),co=(-.5*Fe(w.y,-18,24)*p.yo-6*le*le*le*Math.sign(w.y))*T,uo=1-.82*Math.max(kt(x,320,780,.15),kt(x,2250,2910,.08));w.addScaledVector(_t,(p.lat+p.amp*re)*T*uo).addScaledVector(ae,co),Z.lookAt(Ve,ft,dt),bt.setFromRotationMatrix(Z),Gt.setFromAxisAngle(no,-ie*.55*T),bt.multiply(Gt),Z.compose(w,bt,Be.setScalar(F?1.9:1e-4)),ht.setMatrixAt(s,Z),wt(s,It.copy(w).addScaledVector(ft,-8),g,F?2.6:0,4.5);const fo=F?C(9,3.5,Math.abs(w.y))*(1-Ue(w.z))*(w.z>930?1:0):0;for(let k=0;k<ut;k++){const vo=5+s*ut+k,ke=k/ut;It.copy(w).addScaledVector(ft,-(8+k*5.5)).addScaledVector(_t,Math.sin(k*1.9+s*2.1+o*2)*k*.3).addScaledVector(ae,k*.45*Math.sign(w.y||1)),wt(vo,It,so,fo*(1-ke)*(1-ke)*.7,1.4+k*.3,0)}if(Ot){const k=It.copy(w).sub(st).dot(R);Ut[s].set(w.x-R.x*k,w.y-R.y*k,w.z-R.z*k,F&&k<0?17*C(0,40,-k):0)}}if(Ot){const s=w.copy(X).sub(st).dot(R);Ut[5].set(X.x-R.x*s,X.y-R.y*s,X.z-R.z*s,s<30?22:0)}ht.instanceMatrix.needsUpdate=!0;for(let s=0;s<gt;s++){const p=to[s],x=Math.atan2(X.x-p.x,X.z-p.z)-o*.9-s*1.1;let F=.5+.5*Math.cos(x);F*=F,F*=F,wt(5+5*ut+s,p,g,.5+2.6*F,1.8+2.2*F)}const v=-620+900*C(.35,1,a)+o*4;for(let s=0;s<4;s++)w.set(v-s*150,oo+Math.sin(s*2.3)*14,eo+Math.sin(s*1.7)*40),s<$t&&(bt.setFromAxisAngle(dt,.08*Math.sin(o*.2+s)),Z.compose(w,bt,Be.setScalar(1)),Ft.setMatrixAt(s,Z)),w.x+=35.5,wt(5+5*ut+gt+s,w,g,s<$t?2.4:0,3.2);Ft.instanceMatrix.needsUpdate=!0,wt(Tt-1,io,g,3*C(te-.1,rt,a)*(1-C(.9,.96,a)),30),nt.attributes.position.needsUpdate=!0,nt.attributes.aC.needsUpdate=!0,nt.attributes.aS.needsUpdate=!0}return{scene:l,path:L,duration:39,pace:t=>1.04+.1*C(.2,.36,t)-.3*kt(t,te-.02,rt+.01,.3)-.12*kt(t,rt+.01,qt+.02,.3),ride:"none",style:"none",camera:{fov:70,near:.35,far:9e3,lookAhead:60,sway:.3,bank:1},pois:[{at:(t,o)=>(L.pointAt(Math.min(1,o+.05),ne),ne.y+=95,ne),from:O+.01,to:te+.02,weight:.5},{at:()=>tt.moon.getWorldPosition(ro),from:rt-.035,to:rt+.06,weight:.35},{at:[420,110,40],from:rt+.01,to:qt-.02,weight:.4}],portal:{shape:"circle",radius:7,color:"#DFFCF6",glow:1,revealDistance:1700,tilt:!0},post:{exposure:[1,1.15,.8][D],bloom:{strength:.5,radius:.6,threshold:.92},grade:{saturation:1.06,contrast:1.07,tint:"#ffffff",shadowTint:"#020308",vignette:.3,grain:.02,aberration:0}},update:lo,dispose(){for(const t of Ht)t.dispose()}}}};export{Xo as default};
