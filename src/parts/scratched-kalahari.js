import*as f from"three";const U=Math.PI*2,_=Math.PI/180,Ee=.89,Ie=`
uniform float uPx, uPlane, uSoft, uStar, uMoonLvl, uTime, uInk;
uniform vec3 uMoonDir, uOwlSun;
uniform vec4 uOwl; uniform vec2 uOwlDir; uniform vec2 uFar; uniform vec2 uStarFar; uniform vec4 uTilt, uTiltX; uniform vec3 uHill; uniform float uMoonFull;
// the moon edge is a plane that may lean along the street: height measured against it (uTilt = slope, z0, zmin, zmax).
// On the street (north of uTiltX.w) the edge is also a line that sweeps over the ground: uTiltX = (slope along z, z1, slope along x, gate z)
float kEff(vec3 lp){ return lp.y + uTilt.x * (clamp(lp.z, uTilt.z, uTilt.w) - uTilt.y) + smoothstep(uTiltX.w, uTiltX.w + 16., lp.z) * (uTiltX.x * (lp.z - uTiltX.y) + uTiltX.z * lp.x) + (1. - smoothstep(uTiltX.w, uTiltX.w + 16., lp.z)) * (uHill.x * lp.x + uHill.y * (lp.z - 100.) + uHill.z); }
float kh(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
// the flying owl's shadow: signed distance in wingspans (negative inside; 9 when there is none). p world position.
float kOwlSd(vec3 p){
  if (uOwl.w < .01) return 9.;
  vec3 q = p - uOwl.xyz; float along = dot(q, uOwlSun);      // uOwlSun: the direction our shadow is thrown from (the moon's side, raised, so it lands a few wingspans ahead)
  q -= uOwlSun * along;
  // The shape lies across the beam with its wings level and its head up: we fly at the head of the beam, so from
  // where we are the gap on the ground is always this plan of an owl, whatever it falls on.
  vec3 rt = vec3(-uOwlSun.z, 0., uOwlSun.x); rt /= max(length(rt), 1e-3);
  vec3 fw = cross(rt, uOwlSun);
  vec2 s = vec2(dot(q, rt), dot(q, fw)) / uOwl.w;
  float body = length(vec2(s.x, s.y + .02) / vec2(.22, .32)) - 1.;
  float head = length(vec2(s.x, s.y - .34) / vec2(.2, .17)) - 1.;
  // broad round-tipped wings, swept a little back, the trailing edge scalloped between the feather tips
  float ax = abs(s.x), chord = .36 - .12 * ax + .025 * cos(ax * 31.) * step(s.y, .08 - .2 * ax * ax);
  float wing = length(vec2(s.x, s.y - .08 + .2 * ax * ax) / vec2(1., chord)) - 1.;
  float tail = length(vec2(s.x, s.y + .38) / vec2(.15 + .24 * clamp(-s.y - .22, 0., .4), .19)) - 1.;
  float sd = min(min(body, head), min(wing, tail));
  return along < 0. ? sd : 9.;
}
float kOwlShadow(vec3 p){ return 1. - smoothstep(-.25, .05, kOwlSd(p)); }
`,qe=Ie+`
// level (0..3) -> share of strokes kept in the first set
float kFrac(float L){ return L < 1. ? .25 * max(L, 0.) : mix(.25, 1., clamp(L - 1., 0., 1.)); }
// one octave: isolines of h at spacing S, cut into tapered strokes along a. w = screen gradient of h.
float kPat(float h, float a, float S, float w, float ks, float km, float grow, float seed, float len){
  float q = h / S; float k = floor(q + .5); float d = abs(q - k) * S / w;
  float ac = a / (S * len) + kh(vec2(k, seed)) * 7.31; float c = floor(ac); float t = ac - c;
  float r = kh(vec2(k * 1.37 + seed * 17., c + 3.));
  float tp = smoothstep(0., .3, t) * (1. - smoothstep(.5, 1., t));
  float star = step(r, ks);
  float moon = step(r, km) * (1. - smoothstep(grow - .1, grow, t));
  float hw = uPx * (.14 + .68 * tp);
  return (1. - smoothstep(hw - .55, hw + .55, d)) * max(star, moon) * smoothstep(0., .1, tp);
}
// a hatch set at constant screen density
float kSet(float h, float a, float S0, float ks, float km, float grow, float seed, float len){
  float w = max(length(vec2(dFdx(h), dFdy(h))), 1e-6);
  float L = log2(4.5 * uPx * w / S0); float o = floor(L); float f = L - o; float Sa = S0 * exp2(o);
  return mix(kPat(h, a, Sa, w, ks, km, grow, seed, len), kPat(h, a, Sa * 2., w, ks, km, grow, seed + 5., len), smoothstep(.2, .8, f));
}
// kMF scales how far moonlight lifts a sparse surface to the full hatch (a shader sets it below 1 for flat sand before calling kScratch)
float kMF = 1.;
// Wind ripples on flat sand: short broken dashes along wavy crests that run across the wind, in small lens-shaped patches
// with feathered edges, close to the eye only (further off a stroke across the view is foreshortened into a long ruled
// line). p = world xz, dens = share of the dashes kept (0..1).
float kRipple(vec2 p, float dens){
  float rh = p.y + .24 * sin(p.x * 1.5 + 2.1 * sin(p.y * .37)) + .12 * sin(p.x * .53 + p.y * 1.3);
  float rw = max(length(vec2(dFdx(rh), dFdy(rh))), 1e-6);
  float rL = max(log2(10. * uPx * rw / .12), 0.); float ro = floor(rL); float rS = .12 * exp2(ro);
  return mix(kPat(rh, p.x, rS, rw, dens, 0., 0., 3.7, 1.9), kPat(rh, p.x, rS * 2., rw, dens, 0., 0., 8.7, 1.9), smoothstep(.2, .8, rL - ro));
}
// where the ripples lie: patches a few metres across, densest at their middles, a quarter of the sand
float kRipMask(vec2 p, vec2 ph){
  float m = sin(p.x * .47 + 1.3 * sin(p.y * .21 + ph.x)) * sin(p.y * .33 + 1.1 * sin(p.x * .29 + ph.y));
  return smoothstep(-.02, .85, m);
}
// the flat sand's own strokes run down the street with the wind, a little aslant (x = across them, y = along them): seen
// from low over the ground they are short ticks near the eye and dots further off, never long ruled lines
vec2 kFlatHatch(vec2 p){
  float fa = p.x * .24 + p.y * .97;
  return vec2(.32 * (p.x * .97 - p.y * .24) + .04 * sin(fa * 1.1 + 1.7 * sin(p.x * .6)), fa);
}
// the whole scratch shade. hatch = (h, a, h2, a2), surf = (pale, toneScale, diamonds, seed), S0 base spacing (m),
// len = stroke length in spacings. Returns ink coverage 0..1.
float kScratch(vec4 hatch, vec4 surf, vec3 wp, vec3 N, vec3 V, float localY, float S0, float len){
  float ndv = dot(N, V);
  float nm = dot(N, uMoonDir);
  float rev = clamp((localY - uPlane) / uSoft, 0., 1.);
  float dist = length(cameraPosition - wp);
  float far = 1. - .7 * smoothstep(uFar.x, uFar.y, dist);
  float sfar = 1. - smoothstep(uStarFar.x, uStarFar.y, dist);      // starlight cannot draw what is far off: it stays a black shape until the moon
  float up = smoothstep(.1, .55, N.y);
  float Ls = uStar * up * (1. + .6 * surf.x) * surf.y * sfar;
  float Lm = (2. * smoothstep(-.06, .1, nm) + smoothstep(.42, .62, nm)) * uMoonLvl;
  float osd = kOwlSd(wp), osh = 1. - smoothstep(-.25, .05, osd), lit0 = step(1., Lm);
  Lm = mix(Lm, 0., osh);
  // moonlight is the full hatch whatever the surface's starlight tone (bare markings stay bare)
  Lm = (Lm + surf.x * smoothstep(.4, 1., Lm)) * mix(surf.y, max(surf.y, 1.), uMoonFull * kMF * smoothstep(.03, .25, surf.y));
  // round our own shadow the ground keeps every stroke, so the owl-shaped gap reads on the sparsest floor
  Lm = mix(Lm, max(Lm, 1.5), (1. - smoothstep(.08, .75, osd)) * (1. - osh) * lit0);
  float grow = rev * 1.25;
  float guard = smoothstep(.08, .3, ndv);
  float ks = kFrac(Ls) * far * (1. - osh), km = kFrac(Lm) * far * step(.001, rev);      // our shadow is a bare black gap: not even starlight strokes
  float ink = kSet(hatch.x, hatch.y, S0, ks, km, grow, surf.w, len) * guard;
  float k2 = clamp(Lm - 2., 0., 1.) * far * step(.001, rev);
  ink = max(ink, kSet(hatch.z, hatch.w, S0 * 1.15, 0., k2, grow, surf.w + 11., len * .8) * guard);
  // diamond bark plates
  vec2 u = vec2(hatch.x + hatch.y * .5, hatch.x - hatch.y * .5) / .26;
  vec2 wv = max(vec2(length(vec2(dFdx(u.x), dFdy(u.x))), length(vec2(dFdx(u.y), dFdy(u.y)))), vec2(1e-6));
  if (surf.z > .01) {
    vec2 k = floor(u + .5); vec2 dd = abs(u - k) / wv;
    vec2 cu = floor(u.yx);
    float r1 = kh(vec2(k.x + surf.w * 3., cu.x)), r2 = kh(vec2(k.y + 71. + surf.w * 3., cu.y));
    vec2 tt = fract(u.yx);
    float l1 = (1. - smoothstep(uPx * .7 - .5, uPx * .7 + .6, dd.x)) * step(r1, .62) * (1. - smoothstep(grow - .1, grow, tt.x));
    float l2 = (1. - smoothstep(uPx * .7 - .5, uPx * .7 + .6, dd.y)) * step(r2, .62) * (1. - smoothstep(grow - .1, grow, tt.y));
    float fine = 1. - smoothstep(.1, .22, max(wv.x, wv.y));
    float lit = max(smoothstep(-.1, .2, nm) * step(.001, rev) * uMoonLvl, .35 * uStar * up * sfar);
    ink = max(ink, max(l1, l2) * fine * guard * surf.z * step(.3, lit) * mix(.0, 1., lit) * (1. - osh));
  }
  // contour
  float gw = max(length(vec2(dFdx(ndv), dFdy(ndv))), 1e-5);
  float rim = 1. - smoothstep(uPx * 1.25, uPx * 1.25 + 1.3, ndv / gw);
  float rimGate = max(uStar * sfar * smoothstep(.15, .45, N.y) * min(surf.y, 1.), smoothstep(-.02, .16, nm) * smoothstep(0., .5, rev) * uMoonLvl);
  ink = max(ink, rim * rimGate * (1. - osh));
  return clamp(ink, 0., 1.);
}
`,Ke=`
attribute vec4 aHatch; attribute vec4 aSurf;
varying vec4 vHatch; varying vec4 vSurf; varying vec3 vWPos; varying vec3 vWN; varying float vLY;
uniform mat4 uInvHero; uniform vec4 uTilt, uTiltX; uniform vec3 uHill;
#include <common>
#include <fog_pars_vertex>
void main(){
  vHatch = aHatch; vSurf = aSurf;
  vec4 wp = modelMatrix * vec4(position, 1.);
  vec3 lp = (uInvHero * wp).xyz;
  vWPos = wp.xyz; vLY = lp.y + uTilt.x * (clamp(lp.z, uTilt.z, uTilt.w) - uTilt.y) + smoothstep(uTiltX.w, uTiltX.w + 16., lp.z) * (uTiltX.x * (lp.z - uTiltX.y) + uTiltX.z * lp.x) + (1. - smoothstep(uTiltX.w, uTiltX.w + 16., lp.z)) * (uHill.x * lp.x + uHill.y * (lp.z - 100.) + uHill.z);
  vWN = mat3(modelMatrix) * normal;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,$e=`
varying vec4 vHatch; varying vec4 vSurf; varying vec3 vWPos; varying vec3 vWN; varying float vLY;
uniform float uS0, uLen, uNearTone;
#include <common>
#include <fog_pars_fragment>
${qe}
void main(){
  vec3 N = vWN / max(length(vWN), 1e-5);
  vec3 Vv = cameraPosition - vWPos; vec3 V = Vv / max(length(Vv), 1e-5);
  vec4 sf = vSurf; sf.y *= 1. + uNearTone * (1. - smoothstep(5., 30., length(Vv)));      // ground earns more strokes close to the eye
  float ink = kScratch(vHatch, sf, vWPos, N, V, vLY, uS0, uLen);
  gl_FragColor = vec4(vec3(uInk * ink), 1.);
  #include <fog_fragment>
}`,Qe=`
attribute vec4 aSurf;
varying vec4 vSurf; varying vec3 vWPos; varying vec3 vWN; varying float vLY; varying vec3 vLP;
uniform mat4 uInvHero; uniform vec4 uTilt, uTiltX; uniform vec3 uHill;
#include <common>
#include <fog_pars_vertex>
void main(){
  vSurf = aSurf;
  vec4 wp = modelMatrix * vec4(position, 1.);
  vec3 lp = (uInvHero * wp).xyz; vLP = lp;
  vWPos = wp.xyz; vLY = lp.y + uTilt.x * (clamp(lp.z, uTilt.z, uTilt.w) - uTilt.y) + smoothstep(uTiltX.w, uTiltX.w + 16., lp.z) * (uTiltX.x * (lp.z - uTiltX.y) + uTiltX.z * lp.x) + (1. - smoothstep(uTiltX.w, uTiltX.w + 16., lp.z)) * (uHill.x * lp.x + uHill.y * (lp.z - 100.) + uHill.z);
  vWN = mat3(modelMatrix) * normal;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Je=`
varying vec4 vSurf; varying vec3 vWPos; varying vec3 vWN; varying float vLY; varying vec3 vLP;
uniform float uS0, uLen, uNearTone, uFlatMF; uniform vec4 uDome; uniform vec4 uRip; uniform vec2 uRipPh;
#include <common>
#include <fog_pars_fragment>
${qe}
void main(){
  vec3 N = vWN / max(length(vWN), 1e-5);
  vec3 Vv = cameraPosition - vWPos; vec3 V = Vv / max(length(Vv), 1e-5);
  vec2 q = vLP.xz - vec2(3., -20.);
  vec2 sc = vec2(mix(66., 62., smoothstep(-10., 10., q.x)), mix(44., 116., smoothstep(-12., 12., q.y)));
  float d = length(q / sc);
  float ang = atan(q.x, abs(q.y) < 1e-4 ? 1e-4 : q.y);                  // seam due south, behind the notch
  float ss = smoothstep(.2, .7, d);
  d *= 1. + uDome.x * sin(ang * 3. + uDome.y) * ss + .045 * sin(ang * 5. + uDome.z) * ss;
  float hd = 21.6 * (1. - pow(max(d, 1e-4), 1.2));
  hd = .5 * (hd + sqrt(hd * hd + 1.));                                  // the foot of the hill is a soft bend, not a crease
  hd += .45 * sin(vLP.x * .043 + uDome.y) * sin(vLP.z * .037 + uDome.z);
  float along = ang * 46. + .35 * (-vLP.x * .83 + vLP.z * .55);
  // on the flat sand round the hill the strokes turn to run down the street, as the street's own do, and moonlight lifts them less (uFlatMF)
  float fl = uRip.w * (1. - smoothstep(.5, 2.2, hd)); vec2 fh = kFlatHatch(vLP.xz);
  vec4 hatch = vec4(mix(hd * 2.5 + .32 * (vLP.x * .55 + vLP.z * .83), fh.x, fl), mix(along, fh.y, fl), hd * 1.9 + .3 * (vLP.x * .9 - vLP.z * .42), vLP.x * .42 + vLP.z * .9);
  vec4 sf = vSurf; sf.x -= (uDome.w + .12) * smoothstep(.7, 2.5, hd);
  sf.y *= 1. + uNearTone * (1. - smoothstep(5., 30., length(Vv)));      // ground earns more strokes close to the eye
  kMF = mix(1., uFlatMF, fl);
  float ink = kScratch(hatch, sf, vWPos, N, V, vLY, uS0, hd > 1.6 ? uLen : 4.);      // long contour strokes on the hill, the street's short ones on the sand
  float lit = smoothstep(0., .5, (vLY - uPlane) / uSoft) * uMoonLvl;
  float rip = kRipple(vLP.xz, mix(uRip.x, uRip.y, lit) * kRipMask(vLP.xz, uRipPh) * fl * step(.03, sf.y));
  ink = max(ink, rip * (1. - smoothstep(uRip.z * .55, uRip.z, length(Vv))) * smoothstep(.1, .3, dot(N, V)) * (1. - kOwlShadow(vWPos)));
  gl_FragColor = vec4(vec3(uInk * ink), 1.);
  #include <fog_fragment>
}`,Ze=`
attribute vec3 aRoot, aAxis, aNrm; attribute vec4 aRib, aRib2;
uniform vec2 uView; uniform vec3 uWindW; uniform float uThin, uGust; uniform mat4 uInvHero;
#include <common>
#include <fog_pars_vertex>
${Ie}
float kGust(vec2 xz, float t){
  float g = sin((xz.y + 6. * t) * .11 + sin(xz.x * .05) * 1.7) * .5 + .5;
  return g * (.6 + .4 * sin((xz.y + 6. * t) * .31 + xz.x * .13));
}
void main(){
  vec4 wr4 = modelMatrix * vec4(aRoot, 1.); vec3 wr = wr4.xyz;
  vec3 wP = (modelMatrix * vec4(position, 1.)).xyz;
  vec3 ax = mat3(modelMatrix) * aAxis;
  vec3 lr = (uInvHero * wr4).xyz;
  float t = aRib.x;
  float g = kGust(lr.xz, uTime);
  float sway = (g * .75 + .12 * sin(uTime * (2. + aRib2.y * 3.) + aRib2.y * 40.)) * aRib2.w * uGust;
  float L = length(ax);
  wP += uWindW * (sway * t * t * L); wP.y -= sway * sway * t * t * L * .35;
  vec3 n = mat3(modelMatrix) * aNrm; n /= max(length(n), 1e-5);
  float nm = dot(n, uMoonDir);
  float rev = clamp((kEff(lr) - uPlane) / uSoft, 0., 1.);
  float dist = length(cameraPosition - wr);
  float thin = min(1., uThin * uThin / max(dist * dist, 1.));
  float keepT = 1. - smoothstep(thin * .8, thin * 1.2, aRib2.z * .8);
  float ls = uStar * (.2 + .25 * aRib.w) * smoothstep(-.2, .6, n.y) * (1. - smoothstep(uStarFar.x, uStarFar.y, dist));
  float lm = (.22 + .78 * smoothstep(-.25, .35, nm)) * uMoonLvl;
  float grow = max(step(aRib.z, ls), step(aRib.z, lm) * rev) * keepT * (1. - kOwlShadow(wr));      // nothing is drawn inside our own shadow
  wP = mix(wr, wP, grow);
  vec4 mvPosition = viewMatrix * vec4(wP, 1.);
  vec4 c0 = projectionMatrix * mvPosition;
  vec4 c1 = projectionMatrix * viewMatrix * vec4(wP + ax * .25, 1.);
  vec2 s0 = c0.xy / max(abs(c0.w), 1e-4), s1 = c1.xy / max(abs(c1.w), 1e-4);
  vec2 d = (s1 - s0) * uView; float dl = length(d); d = dl > 1e-4 ? d / dl : vec2(1., 0.);
  float pxPerM = projectionMatrix[1][1] * uView.y * .5 / max(c0.w, .05);
  float hw = max(aRib2.x * .5 * pxPerM, .7 * uPx) * aRib.y;
  c0.xy += vec2(-d.y, d.x) * hw * 2. / uView * c0.w;
  if (grow < .02) c0 = vec4(2., 2., 2., 1.);
  gl_Position = c0;
  #include <fog_vertex>
}`,to=`
uniform float uInk;
#include <common>
#include <fog_pars_fragment>
void main(){
  gl_FragColor = vec4(vec3(uInk), 1.);
  #include <fog_fragment>
}`,eo=`
varying vec3 vDir;
void main(){ vDir = position; vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.); if (abs(p.w) < 1e-4) p.w = 1e-4; p.z = p.w * .99995; gl_Position = p; }`,oo=`
varying vec3 vDir;
uniform float uTime, uPx, uPixA, uInk, uSkyDim, uMeteor, uDawn, uMetW, uMetTail, uFoot, uBg;
uniform vec3 uMwA, uMwB, uMwN, uCoal, uLmc, uSmc, uMetA, uMetB, uDawnDir;
float h3(vec3 p){ p = fract(p * .1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float vn(vec3 p){
  vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(mix(h3(i), h3(i + vec3(1, 0, 0)), f.x), mix(h3(i + vec3(0, 1, 0)), h3(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(h3(i + vec3(0, 0, 1)), h3(i + vec3(1, 0, 1)), f.x), mix(h3(i + vec3(0, 1, 1)), h3(i + vec3(1, 1, 1)), f.x), f.y), f.z);
}
float dens(vec3 d){
  float lat = asin(clamp(dot(d, uMwN), -1., 1.));
  float lon = atan(dot(d, uMwB), dot(d, uMwA) + 1e-5);
  float n = vn(d * 7.) * .6 + vn(d * 19.) * .4;
  float core = exp(-lat * lat / .022), halo = exp(-lat * lat / .2);
  float l1 = (lon - .85) / .7;
  float b = (core * (.3 + 1.1 * n * n) + halo * .13) * (.7 + .6 * exp(-l1 * l1) + uFoot * exp(-lon * lon / .09));      // uFoot: the column stands densest on the horizon
  // the Coalsack: a ragged patch where the stipple thins to a third (a clean round hole read as a blot on the sky)
  float cs = 1. - smoothstep(.015, .1, length(d - uCoal) * (.5 + 1.3 * vn(d * 13.)));
  b *= 1. - .66 * cs;
  float rift = (1. - smoothstep(.012, .05, abs(lat - .04 * sin(lon * 4.2) - .012))) * smoothstep(.8, 1., lon) * (1. - smoothstep(2.2, 2.7, lon));
  b *= 1. - .93 * rift;
  vec3 a = d - uLmc, c = d - uSmc;
  b += .75 * exp(-dot(a, a) / .0035) + .65 * exp(-dot(c, c) / .0014);
  return (.016 * uBg + b * mix(.75, 1., uBg)) * uSkyDim;
}
float layer(vec3 d, float N, float rad, float mul, float seed){
  vec3 a = abs(d); vec2 uv; float face; float sg;
  if (a.x >= a.y && a.x >= a.z) { uv = d.yz / max(a.x, 1e-5); sg = d.x > 0. ? 1. : -1.; face = 0.; }
  else if (a.y >= a.z) { uv = d.xz / max(a.y, 1e-5); sg = d.y > 0. ? 1. : -1.; face = 1.; }
  else { uv = d.xy / max(a.z, 1e-5); sg = d.z > 0. ? 1. : -1.; face = 2.; }
  vec2 g = uv * N * .5; vec2 c = floor(g);
  float fs = face * 7. + sg * 2. + seed;
  float r1 = h3(vec3(c, fs)), r2 = h3(vec3(c.yx + 13.7, fs + 1.)), r3 = h3(vec3(c + 29.3, fs + 2.));
  vec2 cuv = (c + .5 + (vec2(r1, r2) - .5) * .78) / (N * .5);
  vec3 cd = face < .5 ? vec3(sg, cuv.x, cuv.y) : (face < 1.5 ? vec3(cuv.x, sg, cuv.y) : vec3(cuv.x, cuv.y, sg));
  cd = normalize(cd);
  float rr = rad * uPx * uPixA * (.78 + .38 * sin(uTime * (.5 + r3 * 1.3) + r3 * 40.));
  float keep = step(fract(r3 * 7.13 + r1), dens(cd) * mul);
  return keep * (1. - smoothstep(rr - .5 * uPixA, rr + .5 * uPixA, length(d - cd)));
}
void main(){
  vec3 d = normalize(vDir);
  float s = max(layer(d, 54., 1.5, .2, 1.), max(layer(d, 104., 1.05, .5, 5.), layer(d, 200., .76, 1., 9.)));
  s *= smoothstep(-.012, .004, d.y);
  float col = s * uInk;
  // first light (dawn variation): stacked horizontal lines up the eastern sky
  if (uDawn > .001) {
    float az = max(dot(normalize(vec3(d.x, 0., d.z) + vec3(1e-5, 0., 0.)), uDawnDir), 0.);
    float top = uDawn * (.1 + .45 * az * az);
    float el = asin(clamp(d.y, -1., 1.));
    float q = el / (9. * uPx * uPixA); float k = floor(q + .5);
    float ln = 1. - smoothstep(.6 * uPx * uPixA, 1.2 * uPx * uPixA, abs(q - k) * 9. * uPx * uPixA);
    float keep = step(h3(vec3(k, floor(atan(d.x, d.z + 1e-5) * 9. + k * 3.7), 3.)), .8) * step(0., el) * (1. - smoothstep(top * .6, top, el));
    col = max(col * (1. - .8 * uDawn * step(el, top)), ln * keep * uInk);
  }
  if (uMeteor > 0. && uMeteor < 1.) {
    float cab = clamp(dot(uMetA, uMetB), -.999, .999), th = acos(cab);
    vec3 e2 = (uMetB - uMetA * cab) / sqrt(1. - cab * cab);
    float t = clamp(atan(dot(d, e2), max(dot(d, uMetA), 1e-4)) / th, 0., 1.);
    float dd = length(d - (uMetA * cos(t * th) + e2 * sin(t * th)));
    float head = uMeteor * 1.45, tail = head - uMetTail;
    float al = smoothstep(tail, head, t) * step(t, head) * (1. - smoothstep(.75, 1., uMeteor));
    float wpx = uPx * uPixA * (.2 + 1.1 * al) * uMetW;
    col = max(col, (1. - smoothstep(wpx - .5 * uPixA, wpx + .5 * uPixA, dd)) * step(.02, al) * (uInk + .6 * smoothstep(.9, 1., al)));
  }
  gl_FragColor = vec4(vec3(col), 1.);
}`,ao=`
attribute vec2 aCorner; attribute vec4 aStar;
uniform vec2 uView; uniform float uPx, uTime, uStarDim;
varying vec2 vUv; varying float vKind; varying float vPx;
void main(){
  vec4 c = projectionMatrix * modelViewMatrix * vec4(position, 1.); if (abs(c.w) < 1e-4) c.w = 1e-4; c.z = c.w * .9999;
  float sz = aStar.x * uPx * (.8 + .3 * sin(uTime * aStar.z * 1.6 + aStar.y)) * mix(1., uStarDim, step(aStar.w, 1.5) * step(aStar.x, 5.5));
  c.xy += aCorner * sz * 2. / uView * c.w;
  if (normalize(position).y < -.005 || sz < .3) c = vec4(2., 2., 2., 1.);
  vUv = aCorner; vKind = aStar.w; vPx = sz;
  gl_Position = c;
}`,no=`
uniform float uInk; varying vec2 vUv; varying float vKind; varying float vPx;
void main(){
  vec2 a = abs(vUv); float aa = 1.2 / max(vPx, 1.);
  float core = 1. - smoothstep(.2 - aa, .2 + aa, length(a));
  float arm = max(1. - smoothstep(-aa, aa, a.y - .11 * (1. - a.x)), 1. - smoothstep(-aa, aa, a.x - .11 * (1. - a.y)));
  arm *= step(max(a.x, a.y), .98);
  float dotm = 1. - smoothstep(.42 - aa, .42 + aa, length(a));
  float m = vKind > .5 ? max(core, arm) : dotm;
  if (m < .02) discard;
  gl_FragColor = vec4(vec3(uInk * m), 1.);
}`,so=`
attribute vec4 aBat; attribute vec3 aWing;
uniform float uTime, uPx, uPixA; uniform vec3 uNotch;
#include <common>
#include <fog_pars_vertex>
vec3 batPos(float th, float sd){
  float rx = aBat.y, rz = aBat.z;
  vec3 p = uNotch + vec3(rx * (1. - cos(th)), 0., rz * sin(th));
  p.y += 6.5 + sd * 4.5 + (5. + sd * 12.) * (.5 - .5 * cos(th)) + 1.5 * sin(th * 3. + sd * 20.);      // over the top of the portal's disc, never across its centre
  p.x += (sd - .5) * 6. * cos(th);
  return p;
}
void main(){
  float sd = aBat.w;
  float sp = (11. + sd * 5.) / max(.5 * (abs(aBat.y) + aBat.z), 4.);
  float th = aBat.x + uTime * sp;
  vec3 p = batPos(th, sd), p2 = batPos(th + .03, sd);
  vec3 jk = vec3(sin(uTime * 5.3 + sd * 20.), sin(uTime * 7.1 + sd * 31.) * .7, sin(uTime * 4.1 + sd * 11.)) * .55;
  vec3 fw = p2 - p; fw /= max(length(fw), 1e-4);
  vec3 rt = cross(fw, vec3(0., 1., 0.)); rt /= max(length(rt), 1e-4);
  vec3 up = cross(rt, fw);
  float ph = sin(uTime * (13. + sd * 5.) + sd * 60.);
  float ang = ph * .95 * min(abs(aWing.x) * 4., 1.) + .15;
  float ax = abs(aWing.x);
  vec3 l = vec3(sign(aWing.x) * ax * cos(ang), ax * sin(ang), aWing.y);
  vec3 c = (modelMatrix * vec4(p + jk, 1.)).xyz;
  float dist = length(cameraPosition - c);
  float sc = max(1., dist * uPixA * uPx * 20. / .8);      // never under twenty design pixels across: a bat is a shape with two wings, not a tick
  vec3 wp = c + mat3(modelMatrix) * (rt * l.x + up * l.y + fw * l.z) * sc;
  vec4 mvPosition = viewMatrix * vec4(wp, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ro=`
uniform float uInk;
#include <common>
#include <fog_pars_fragment>
void main(){
  gl_FragColor = vec4(vec3(uInk), 1.);
  #include <fog_fragment>
}`;class de{constructor(){this.p=[],this.n=[],this.h=[],this.s=[],this.i=[],this.count=0}v(w,l,k,$,ut,Q,N,yt,et,ot,zt,F,ft,Ft){return this.p.push(w,l,k),this.n.push($,ut,Q),this.h.push(N,yt,et,ot),this.s.push(zt,F,ft,Ft),this.count++}tri(w,l,k){this.i.push(w,l,k)}build(){const w=new f.BufferGeometry;return w.setAttribute("position",new f.Float32BufferAttribute(this.p,3)),w.setAttribute("normal",new f.Float32BufferAttribute(this.n,3)),w.setAttribute("aHatch",new f.Float32BufferAttribute(this.h,4)),w.setAttribute("aSurf",new f.Float32BufferAttribute(this.s,4)),w.setIndex(this.count>65535?new f.Uint32BufferAttribute(this.i,1):new f.Uint16BufferAttribute(this.i,1)),w}}class io{constructor(){this.p=[],this.r=[],this.a=[],this.n=[],this.d=[],this.e=[],this.i=[],this.count=0}lance(w,l,k,$,ut,Q,N,yt,et,ot,zt,F,ft,Ft,Mt,ht,dt=.42){const at=$-w,Xt=ut-l,x=Q-k,A=w+at*dt+N,it=l+Xt*dt+yt,Z=k+x*dt+et,pt=ht(),Yt=ht(),O=ht(),vt=this.count,P=(G,V,_t,W,kt)=>{this.p.push(G,V,_t),this.r.push(w,l,k),this.a.push(at,Xt,x),this.n.push(zt,F,ft),this.d.push(W,kt,pt,Ft),this.e.push(ot,O,Yt,Mt),this.count++};P(w,l,k,0,0),P(A,it,Z,dt,-1),P(A,it,Z,dt,1),P($,ut,Q,1,0),this.i.push(vt,vt+1,vt+2,vt+1,vt+3,vt+2)}build(){const w=new f.BufferGeometry;return w.setAttribute("position",new f.Float32BufferAttribute(this.p,3)),w.setAttribute("aRoot",new f.Float32BufferAttribute(this.r,3)),w.setAttribute("aAxis",new f.Float32BufferAttribute(this.a,3)),w.setAttribute("aNrm",new f.Float32BufferAttribute(this.n,3)),w.setAttribute("aRib",new f.Float32BufferAttribute(this.d,4)),w.setAttribute("aRib2",new f.Float32BufferAttribute(this.e,4)),w.setIndex(new f.Uint32BufferAttribute(this.i,1)),w}}const Me=new Map;function Ce(p){if(Me.has(p))return Me.get(p);const w=new f.IcosahedronGeometry(1,p),l=w.getAttribute("position"),k=new Map,$=[],ut=[];for(let N=0;N<l.count;N++){const yt=l.getX(N),et=l.getY(N),ot=l.getZ(N),zt=Math.round(yt*4096)+"_"+Math.round(et*4096)+"_"+Math.round(ot*4096);let F=k.get(zt);F===void 0&&(F=$.length/3,k.set(zt,F),$.push(yt,et,ot)),ut.push(F)}w.dispose();const Q={pos:new Float32Array($),idx:new Uint16Array(ut),n:$.length/3};return Me.set(p,Q),Q}const X=(p,w,l)=>{const k=Math.min(1,Math.max(0,(l-p)/(w-p)));return k*k*(3-2*k)};function lo(p){let w=p>>>0;const l=()=>{w=w+1831565813>>>0;let k=Math.imul(w^w>>>15,1|w);return k=k+Math.imul(k^k>>>7,61|k)^k,((k^k>>>14)>>>0)/4294967296};return l.range=(k,$)=>k+($-k)*l(),l}function co(p,w,l,k,$,ut,Q,N,yt){const et=Ce(N),ot=et.n,zt=Q*l.range(.92,1.14),F=Q*yt,ft=Q*l.range(.92,1.14),Ft=l()*U,Mt=Math.cos(Ft),ht=Math.sin(Ft),dt=l()*60,at=l()*60,Xt=l()*40,x=l()*U,A=l.range(.05,.42),it=new f.Vector3(Math.sin(A)*Math.cos(x),Math.cos(A),Math.sin(A)*Math.sin(x)),Z=new f.Vector3(-1,0,.7);Z.addScaledVector(it,-Z.dot(it)).normalize();const pt=new f.Vector3().crossVectors(it,Z),Yt=Math.cos(65*_),O=Math.sin(65*_),vt=new f.Vector3().copy(it).multiplyScalar(Yt).addScaledVector(pt,O),P=new Float32Array(ot*3),G=new Float32Array(ot*3);let V=-1e9,_t=0;for(let S=0;S<ot;S++){const g=et.pos[S*3],T=et.pos[S*3+1],H=et.pos[S*3+2];let Y=1+.17*w.n3(g*1.1+dt,T*1.1+at,H*1.1)+.055*w.n3(g*3.1+at,T*3.1,H*3.1+dt);N>4&&(Y+=.018*w.n3(g*8+dt,T*8,H*8+at));const nt=g*Y*zt,b=(T<0?T*.8:T)*Y*F,j=H*Y*ft;P[S*3]=nt*Mt+j*ht,P[S*3+1]=b,P[S*3+2]=-nt*ht+j*Mt,b>V&&(V=b,_t=S)}const W=et.idx;for(let S=0;S<W.length;S+=3){const g=W[S]*3,T=W[S+1]*3,H=W[S+2]*3,Y=P[T]-P[g],nt=P[T+1]-P[g+1],b=P[T+2]-P[g+2],j=P[H]-P[g],lt=P[H+1]-P[g+1],st=P[H+2]-P[g+2],J=nt*st-b*lt,Rt=b*j-Y*st,Jt=Y*lt-nt*j;G[g]+=J,G[g+1]+=Rt,G[g+2]+=Jt,G[T]+=J,G[T+1]+=Rt,G[T+2]+=Jt,G[H]+=J,G[H+1]+=Rt,G[H+2]+=Jt}const kt=p.count;for(let S=0;S<ot;S++){const g=P[S*3],T=P[S*3+1],H=P[S*3+2];let Y=G[S*3],nt=G[S*3+1],b=G[S*3+2];const j=Math.hypot(Y,nt,b)||1;Y/=j,nt/=j,b/=j;const lt=g*it.x+T*it.y+H*it.z+Q*1.3,st=Math.atan2(g*pt.x+T*pt.y+H*pt.z,g*Z.x+T*Z.y+H*Z.z),J=g*vt.x+T*vt.y+H*vt.z+Q*1.3,Rt=g*Z.x+T*Z.y+H*Z.z+Q*1.3;p.v(k+g,$+T,ut+H,Y,nt,b,lt,st*Q*.8,J,Rt,0,1,0,Xt)}for(let S=0;S<W.length;S+=3)p.tri(kt+W[S],kt+W[S+1],kt+W[S+2]);return{top:$+V,tx:k+P[_t*3],tz:ut+P[_t*3+2]}}async function ho(p,w={}){const l=p.rng.fork?p.rng.fork("quiver-koppie"):p.rng,k=p.noise,$=p.quality?.detail??1,ut=w.palette||["#000000","#FFFFFF","#F2F2F2","#B4B4B4","#6A6A6A"],Q=Ee*new f.Color(ut[1]).r,N=w.hour||"night",yt=w.season||"winter",et=w.weather||"clear",ot=w.moonFrom??.5,zt=w.moonTo??.72,F=new f.Group;F.name="quiver-koppie";const ft=21,Ft=4.5,Mt=new f.Vector3(0,ft+Ft,-20),ht=new f.Vector3(Math.sin(10*_)*Math.cos(6*_),Math.sin(6*_),-Math.cos(10*_)*Math.cos(6*_)),dt=Mt.clone().addScaledVector(ht,-60),at=[new f.Vector3(-2,2.5,190),new f.Vector3(-4,2.5,155),new f.Vector3(-8,2.2,124),new f.Vector3(-14,3.5,99),new f.Vector3(-16.5,8.4,76),new f.Vector3(-14.3,13.8,57),dt,Mt.clone().addScaledVector(ht,-30),Mt.clone()],Xt=Mt.clone().addScaledVector(ht,60),x=[];{const t=at.concat([Mt.clone().addScaledVector(ht,26)]);let e=0;for(let a=0;a<at.length-1;a++)e+=at[a].distanceTo(at[a+1]);let o=0;for(let a=0;a<t.length-1;a++){const n=t[a],i=t[a+1],s=n.distanceTo(i),r=Math.ceil(s/2);for(let c=0;c<r;c++){const u=c/r,d=Math.abs(e-(o+s*u));x.push(n.x+(i.x-n.x)*u,n.y+(i.y-n.y)*u,n.z+(i.z-n.z)*u,4.5+2*X(4,24,d))}o+=s}}const A=(t,e,o)=>{let a=1e18;for(let n=0;n<x.length;n+=4){const i=x[n]-t,s=x[n+1]-e,r=x[n+2]-o,c=i*i+s*s+r*r;c<a&&(a=c)}return Math.sqrt(a)},it=l()*U,Z=l()*U,pt=l()*100,Yt=l.range(.05,.09),O=(t,e)=>{const o=t-3,a=e+20;let n=Math.hypot(o/(o<0?66:62),a/(a>0?116:44));const i=Math.atan2(a,o);if(n*=1+Yt*Math.sin(i*3+it)*X(.2,.7,n)+.045*Math.sin(i*5+Z)*X(.2,.7,n),n+=.05*k.n2(t*.021+pt,e*.021),n>=1)return 0;let s=21.6*(1-Math.pow(Math.max(n,0),1.2));s+=.7*k.fbm2(t*.07+pt,e*.07,3)*X(0,5,s);const r=Math.hypot(t,e+20);s=s+(ft-s)*X(11,5,r);let c=1e9;for(let u=0;u<x.length;u+=4){const d=x[u]-t,h=x[u+2]-e,v=d*d+h*h;if(v<900){const m=Math.max(0,Math.sqrt(v)-3),M=x[u+1]-x[u+3]+.05*m*m;M<c&&(c=M)}}return Math.max(0,Math.min(s,Math.max(0,c)))},vt=210,P=14;let G=null;{const t=new de,e=46,o=104,a=new Float32Array((e+1)*o),n=s=>{const r=s/e;return r<.72?100*(r/.72):100+(vt-100)*Math.pow((r-.72)/.28,1.6)};for(let s=0;s<=e;s++){for(let r=0;r<o;r++){const c=r/o*U,u=n(s);a[s*o+r]=O(Math.sin(c)*u,P+Math.cos(c)*u)}(s&3)===3&&await p.yield()}await p.yield();const i=l()*30;for(let s=0;s<=e;s++)for(let r=0;r<o;r++){const c=r/o*U,u=n(s),d=Math.sin(c)*u,h=P+Math.cos(c)*u,v=a[s*o+r];let m=0,M=1,y=0;if(s>0){const q=s-1,tt=Math.min(e,s+1),D=(r+o-1)%o,Vt=(r+1)%o,Lt=n(q),qt=n(tt),Nt=Math.sin(c)*(qt-Lt),Ct=a[tt*o+r]-a[q*o+r],Bt=Math.cos(c)*(qt-Lt),wt=D/o*U,C=Vt/o*U,Tt=(Math.sin(C)-Math.sin(wt))*u,xt=a[s*o+Vt]-a[s*o+D],K=(Math.cos(C)-Math.cos(wt))*u;m=Ct*K-Bt*xt,M=Bt*Tt-Nt*K,y=Nt*xt-Ct*Tt,M<0&&(m=-m,M=-M,y=-y);const gt=Math.hypot(m,M,y)||1;m/=gt,M/=gt,y/=gt}const z=X(0,1.5,v),B=w.apronTone??.17,E=B+(.92-B)*z-B*X(w.apronFade?w.apronFade[0]:70,w.apronFade?w.apronFade[1]:150,u)*(1-z);t.v(d,v,h,m,M,y,v*2.2+.32*(d*.55+h*.83),-d*.83+h*.55,v*1.6+.3*(d*.9-h*.42),d*.42+h*.9,0,Math.max(0,E),0,i)}for(let s=0;s<e;s++)for(let r=0;r<o;r++){const c=(r+1)%o,u=s*o+r,d=s*o+c,h=(s+1)*o+r,v=(s+1)*o+c;t.tri(u,h,d),t.tri(d,h,v)}G=t}await p.yield();const V=[],_t=new de,W=(t,e,o,a,n,i,s=l)=>{const r=co(_t,k,s,t,e,o,a,n,i),c={x:t,y:e,z:o,r:a,top:r.top,tx:r.tx,tz:r.tz};return V.push(c),c},kt=[];for(const t of[-1,1]){const e=l.range(3,3.4),o=t*(5.4+e*1.02),a=W(o,ft+e*.5,-20.5+l.range(-.6,.6),e,7,.86);await p.yield();const n=l.range(2,2.5);W(o+t*(e*.75),a.top+n*.2,-22.5+l.range(-1,1),n,7,.9),await p.yield(),W(t*(9.2+l.range(0,1.2)),O(t*10,-13.5)+1.2,-13.6,l.range(2.3,2.8),7,.82),await p.yield(),W(t*(8.6+l.range(0,1.5)),O(t*9,-27.5)+1.1,-27.4,l.range(2.4,3),7,.8),kt.push(new f.Vector3(o,a.top,a.z)),await p.yield()}await p.yield();const S=[];for(let t=0;t<8;t++){const e=(t+l.range(.2,.8))/8,o=96-e*66;let a=0;{let r=1e9;for(let c=0;c<x.length;c+=4){const u=Math.abs(x[c+2]-o);u<r&&(r=u,a=x[c])}}const n=l.range(1.7,3),i=a+7.4+n+l.range(0,2.5),s=O(i,o);A(i,s+n*.5,o)<n*1.15+6.6||(S.push(W(i,s+n*.5,o,n,5,l.range(.74,.92))),await p.yield())}await p.yield();{const t=Math.round((w.boulders??190)*(.7+.3*$))-V.length;let e=0,o=0;for(;e<t&&o++<6e3;){let a,n,i;if(e<t-14){if(a=3+l.range(-70,68),n=-20+l.range(-46,118),i=O(a,n),i<.4||l()>.2+.8*Math.pow(i/21,.6))continue}else{const y=l()*U,z=l.range(1,1.16);if(a=3+Math.cos(y)*66*z,n=-20+Math.sin(y)*(Math.sin(y)>0?116:44)*z,i=O(a,n),i>.5)continue}const s=l(),r=1+2.1*s*s*(.6+.4*X(0,14,i)),c=l.range(.7,.95),u=i+r*c*l.range(.3,.62);if(A(a,u,n)<r*1.2+6.6)continue;let d=!0;for(const y of V)if(Math.hypot(y.x-a,y.y-u,y.z-n)<.62*(y.r+r)){d=!1;break}if(!d)continue;const h=A(a,u,n),v=h<26,m=n>5&&h<75&&r>1.5,M=W(a,u,n,r,(v||m)&&r>1.5?4:r>2.1||v?3:2,c);if(e++,r>1.8&&l()<.45){const y=r*l.range(.5,.78),z=l()*U,B=a+Math.cos(z)*r*.45,E=n+Math.sin(z)*r*.45,q=M.top+y*.45;A(B,q,E)>y*1.2+6.6&&(W(B,q,E,y,v?3:2,l.range(.75,.95)),e++)}(e&1)===0&&await p.yield()}}await p.yield();const g=lo(7919+Math.floor(pt*1e3));for(const[t,e,o]of[[-6,92.5,1.5],[-22.6,88.5,1.25],[-4.2,83,1.9]]){const a=O(t,e)+o*.42;A(t,a,e)>o*1.2+6.3&&W(t,a,e,o,5,.82,g),await p.yield()}{let t=0;for(let e=4;e<x.length;e+=4){const o=x[e]-x[e-4],a=x[e+2]-x[e-2],n=Math.hypot(o,a)||1;if(t+=Math.hypot(o,x[e+1]-x[e-3],a),!(x[e+2]>74||x[e+2]<-3||t<4)){t=0;for(const i of[-1,1,0]){const s=i?i*g.range(2.5,7.5):g.range(-2.2,2.2),r=i?g.range(1.2,2.5):g.range(1,1.5),c=g.range(.74,.92),u=g.range(.35,.6),d=g(),h=r*g.range(.5,.75),v=g()*U,m=x[e]-a/n*s+g.range(-1,1),M=x[e+2]+o/n*s+g.range(-1,1),y=O(m,M)+r*c*u;if(A(m,y,M)<r*1.08+4.2)continue;let z=!0;for(const D of V)if(Math.hypot(D.x-m,D.y-y,D.z-M)<.62*(D.r+r)){z=!1;break}if(!z)continue;const B=W(m,y,M,r,r>1.5?4:3,c,g),E=m+Math.cos(v)*r*.5,q=M+Math.sin(v)*r*.5,tt=B.top+h*.4;i&&d<.66&&A(E,tt,q)>h*1.08+4.2&&W(E,tt,q,h,3,.85,g)}await p.yield()}}}let T=null;for(const t of V){if(Math.hypot(t.tx-6.6,t.tz+9.5)>2.2||t.tz>-8||t.top<21.5||t.top>25.5||T&&t.top<T.top)continue;let e=!0;for(const o of V)if(o!==t&&Math.hypot(o.x-t.tx,o.y-(t.top+.35),o.z-t.tz)<o.r*1.25){e=!1;break}e&&(T=t)}if(!T)for(const[t,e]of[[6.6,-9.5],[6.2,-11],[7.6,-10.4],[6.4,-8]]){const a=O(t,e)+.63;if(A(t,a,e)<1.4*1.2+6.3)continue;let n=!0;for(const i of V)if(Math.hypot(i.x-t,i.y-a,i.z-e)<.8*(i.r+1.4)){n=!1;break}if(n){T=W(t,a,e,1.4,4,.84,g);break}}await p.yield();const H=_t.build();await p.yield();{const t=G.s,e=G.p,o=G.count,a=-.819,n=.574;for(let i=0;i<o;i++){const s=e[i*3],r=e[i*3+1],c=e[i*3+2];if(Math.hypot(s-3,c+20)>135)continue;let u=0;for(const m of V){const M=m.x-s,y=m.z-c,z=M*a+y*n;if(z<-m.r*.35||z>m.r*2.9)continue;const B=Math.abs(M*n-y*a);if(B>m.r*1.15||r>m.top-.1*Math.max(0,z))continue;const E=(1-X(m.r*.6,m.r*1.15,B))*(1-X(m.r*1.6,m.r*2.9,z));E>u&&(u=E)}const d=.5+.5*k.fbm2(s*.05+pt*1.7,c*.05-pt,2),h=X(.3,.72,d),v=X(24,32,c)*(1-X(48,60,c));t[i*4]=-Math.max(u*2.4,X(0,1.5,r)*((.55+.45*h)*(.72+.4*X(80,52,c)+.24*v)+.7*v*h*h*h)*(1-.5*X(30,16,c))),(i&63)===0&&await p.yield()}await p.yield(),F.userData.groundGeo=G.build(),G=null}await p.yield();const Y=new de,nt=new io,b=f.Vector3,j=new b,lt=new b,st=new b,J=new b,Rt=(t,e,o,a,n,i,s,r,c,u,d)=>{st.subVectors(e,t);const h=st.length()||.001;st.divideScalar(h),J.set(.31,.2,-.93),Math.abs(st.dot(J))>.95&&J.set(1,0,0),j.crossVectors(J,st).normalize(),lt.crossVectors(st,j);const v=Y.count;for(let m=0;m<=i;m++){const M=m/i,y=(o+(a-o)*M)*(d?d(M):1),z=t.x+st.x*h*M,B=t.y+st.y*h*M,E=t.z+st.z*h*M,q=s+h*M;for(let tt=0;tt<=n;tt++){const D=tt/n*U,Vt=Math.cos(D),Lt=Math.sin(D),qt=j.x*Vt+lt.x*Lt,Nt=j.y*Vt+lt.y*Lt,Ct=j.z*Vt+lt.z*Lt,Bt=(tt/n-.5)*U*o;Y.v(z+qt*y,B+Nt*y,E+Ct*y,qt,Nt,Ct,Bt,q,q*.9+Bt*.42,Bt*.9-q*.42,1,1,r+(c-r)*M,u)}}for(let m=0;m<i;m++)for(let M=0;M<n;M++){const y=v+m*(n+1)+M,z=y+n+1;Y.tri(y,y+1,z),Y.tri(y+1,z+1,z)}},Jt=yt!=="summer",bt=[];let L=l;const Et=(t,e,o,a,n,i,s)=>{const r=L()*40,c=.5*Math.min(1.15,a/7.5)+.06,u=s===2?6:s?5:a>4.6?4:3,d=s?6:4,h=s?2:1,v=s?11:7,m=u===3?3:2,M=.42+.03*a,y=new b(t,e-.3,o),z=new b(t+n*a*.5,e+a*.42,o+i*a*.5),B=new b(z.x+n*a*.3,z.y+a*.2,z.z+i*a*.3),E=L()*6;Rt(y,z,c,c*.66,s?12:7,s?8:4,0,1,.8,r,wt=>1+.28*Math.pow(1-wt,6)+.035*Math.sin(wt*9+E));let q=z.y;const tt=new b(0,1,0),D=new b,Vt=new b,Lt=new f.Quaternion,qt=(wt,C)=>{for(let Tt=0;Tt<m;Tt++){let xt=wt.x,K=wt.y,gt=wt.z;if(Tt>0){D.set(L()-.5,L()*.3,L()-.5).normalize();const rt=M*.8;xt+=D.x*rt,K+=D.y*rt-.1,gt+=D.z*rt}const Ht=xt-B.x,jt=K-B.y,oe=gt-B.z,Ot=Math.hypot(Ht,jt,oe)||1;J.set(.3,.1,.9),j.crossVectors(J,C).normalize(),lt.crossVectors(C,j);const ye=L()*U;for(let rt=0;rt<v;rt++){const ae=.2+1.3*Math.sqrt((rt+.5)/v)+L.range(-.1,.1),Gt=ye+rt*2.39996,ne=Math.sin(ae),Ut=Math.cos(ae),se=C.x*Ut+(j.x*Math.cos(Gt)+lt.x*Math.sin(Gt))*ne,re=C.y*Ut+(j.y*Math.cos(Gt)+lt.y*Math.sin(Gt))*ne,ie=C.z*Ut+(j.z*Math.cos(Gt)+lt.z*Math.sin(Gt))*ne,he=M*L.range(.8,1.15);nt.lance(xt,K,gt,xt+se*he,K+re*he,gt+ie*he,0,-.02*he,0,.05,Ht/Ot*.75+se*.45,jt/Ot*.75+re*.45,oe/Ot*.75+ie*.45,.6,.07,L,.3)}if(Jt){const rt=s?2:1;for(let ae=0;ae<rt;ae++){const Gt=(L()-.5)*.3,ne=(L()-.5)*.3,Ut=L.range(.34,.55),se=xt+C.x*.12,re=K+C.y*.12+.05,ie=gt+C.z*.12;nt.lance(se,re,ie,se+(C.x*.35+Gt)*Ut,re+(.8+C.y*.2)*Ut,ie+(C.z*.35+ne)*Ut,0,0,0,.06,Ht/Ot*.5,jt/Ot*.5+.6,oe/Ot*.5,1,.3,L,.6)}}K+M>q&&(q=K+M)}},Nt=(wt,C,Tt,xt,K,gt,Ht)=>{const jt=new b().copy(wt).addScaledVector(C,Tt);if(Rt(wt,jt,xt,xt*.74,d,h,gt,K===1?.7:0,0,r+K),K>=u){qt(jt,C);return}J.set(.2,.9,.37),Math.abs(C.dot(J))>.9&&J.set(1,0,0),D.crossVectors(J,C).normalize(),Vt.crossVectors(C,D);const oe=new b().copy(D).multiplyScalar(Math.cos(Ht)).addScaledVector(Vt,Math.sin(Ht)),Ot=(K===1?.66:.56)*L.range(.88,1.14);for(const ye of[-1,1]){Lt.setFromAxisAngle(oe,ye*Ot*L.range(.85,1.15));const rt=new b().copy(C).applyQuaternion(Lt);rt.y+=K>=2?.2:.08,rt.normalize(),Nt(jt,rt,(K===1?a*.17:Tt*(u===6?.82:.88))*L.range(.88,1.1),xt*.72,K+1,gt+Tt,Ht+Math.PI/2+L.range(-.5,.5))}},Ct=new b(n*1.2,1,i*1.2).normalize();Nt(z,Ct,a*.11,c*.66,1,z.distanceTo(y),L()*U);const Bt={base:new b(t,e,o),top:new b(B.x,q,B.z),height:q-e,crown:B,crownR:a*.44,r0:c};return bt.push(Bt),Bt},be=[];for(let t=0;t<2;t++){const e=t===0?-1:1,o=kt[t],a=o.x-e*.5,n=o.z+1.2*(l()-.5);be.push(Et(a,o.y-.15,n,l.range(8.3,9.2),-e*l.range(.3,.36),l.range(-.04,.04),2))}await p.yield();const He=(t,e,o,a)=>A(t,e,o)>a,Kt=(t,e,o)=>{for(const a of V)if(Math.hypot(a.x-t,a.z-e)<a.r*.92&&o<a.top)return!0;return!1};let $t=null;for(let t=0;t<60&&!$t;t++){const e=55+l.range(-4,4),o=-14.4+7.7+l.range(-.2,1.6),a=O(o,e);Kt(o,e,a+.5)||!He(o,a+3,e,7.2)||($t=Et(o,a,e,7,l.range(-.05,.05),l.range(-.05,.05),2))}await p.yield();{const t=Math.max(12,Math.round(w.trees??60))-bt.length;let e=0,o=0,a=5;for(;e<t&&o++<5e3;){const n=3+l.range(-62,60),i=-20+l.range(-40,108),s=O(n,i);if(s<1.2||l()>.35+.65*(s/21))continue;const r=3.4+5.8*Math.pow(l(),1.25)*(.55+.45*X(2,16,s)),c=A(n,s+r*.5,i);if(c<7+.5||A(n,s+r*.75,i)<r*.42+4.5||Kt(n,i,s+.6))continue;let u=!0;for(const h of bt)if(Math.hypot(h.base.x-n,h.base.z-i)<3.2+.3*(h.height+r)){u=!1;break}if(!u)continue;const d=a>0&&c<22&&r>4.5;d&&a--,Et(n,s,i,r,l.range(-.08,.08),l.range(-.08,.08),d),e++,(e&1)===0&&await p.yield()}}await p.yield();for(const[t,e,o,a]of[[-27,64,9.2,2],[-24,44,9.6,1],[2,42,9.6,1],[4.5,68,9,2]]){for(let n=0;n<30;n++){const i=n*2.4,s=.9*Math.sqrt(n),r=t+Math.cos(i)*s,c=e+Math.sin(i)*s,u=O(r,c);if(Kt(r,c,u+.6)||A(r,u+o*.5,c)<8||A(r,u+o*.75,c)<o*.42+4.5)continue;let d=!0;for(const h of bt)if(Math.hypot(h.base.x-r,h.base.z-c)<5.5){d=!1;break}if(d){L=g,Et(r,u,c,o,g.range(-.05,.05),g.range(-.05,.05),a).setPiece=!0,L=l;break}}await p.yield()}{let t=0,e=1;for(let o=4;o<x.length;o+=4){const a=x[o]-x[o-4],n=x[o+2]-x[o-2],i=Math.hypot(a,n)||1;if(t+=Math.hypot(a,x[o+1]-x[o-3],n),!(x[o+2]>72||x[o+2]<2||t<9)){for(let s=0;s<10;s++){const r=e*g.range(4,9),c=g.range(3.6,5.2),u=x[o]-n/i*r,d=x[o+2]+a/i*r+g.range(-2,2),h=O(u,d);if(Kt(u,d,h+.6)||A(u,h+c*.78,d)<c*.44+2.8||A(u,h+c*.4,d)<4.4)continue;let v=!0;for(const m of bt)if(Math.hypot(m.base.x-u,m.base.z-d)<4){v=!1;break}if(v){L=g,Et(u,h,d,c,g.range(-.06,.06),g.range(-.06,.06),1).setPiece=!0,L=l,t=0,e=-e;break}}await p.yield()}}}{let t=6;for(let e=4;e<x.length;e+=4){const o=x[e]-x[e-4],a=x[e+2]-x[e-2],n=Math.hypot(o,a)||1;if(t+=Math.hypot(o,x[e+1]-x[e-3],a),!(x[e+2]>70||x[e+2]<4||t<11)){t=0;for(const i of[-1,1]){for(let s=0;s<8;s++){const r=i*g.range(7.5,12),c=g.range(5.5,8),u=x[e]-a/n*r,d=x[e+2]+o/n*r+g.range(-3,3),h=O(u,d);if(Kt(u,d,h+.6)||A(u,h+c*.5,d)<7.5||A(u,h+c*.75,d)<c*.42+4.5)continue;let v=!0;for(const m of bt)if(Math.hypot(m.base.x-u,m.base.z-d)<5){v=!1;break}if(v){L=g,Et(u,h,d,c,g.range(-.06,.06),g.range(-.06,.06),1).setPiece=!0,L=l;break}}await p.yield()}}}}{const t=Math.round(900*(.5+.5*$)),e=yt==="summer"?1.35:1;let o=0,a=0;for(;o<t&&a++<9e3;){let n,i;if(o<70)n=l.range(-9,9),i=-20+l.range(-12,16);else{const d=l()*U,h=20+150*Math.pow(l(),.8);n=Math.sin(d)*h,i=P+Math.cos(d)*h}const s=O(n,i);if(s>1&&o>=70&&l()<.55||Kt(n,i,s+.3))continue;const r=5,c=l.range(.6,.9)*e,u=l()*U;for(let d=0;d<r;d++){const h=u+d/r*U+l.range(-.4,.4),v=l.range(.12,.5)*c,m=c*l.range(.7,1.05),M=n+Math.cos(h)*.06,y=i+Math.sin(h)*.06;nt.lance(M,s-.03,y,M+Math.cos(h)*v,s+m,y+Math.sin(h)*v,Math.cos(h)*v*.22,m*.1,Math.sin(h)*v*.22,.035,Math.cos(h)*.25,1,Math.sin(h)*.25,.4,.6,l,.62)}o++,(o&31)===0&&await p.yield()}}await p.yield();const ze={profile:[],crowns:bt.filter(t=>!t.setPiece).map(t=>({base:t.base.clone(),top:t.top.clone(),center:t.crown.clone(),r:t.crownR}))};for(let t=-70;t<=72;t+=2.5){let e=0,o=14;for(let a=-62;a<=98;a+=3){const n=O(t,a);n>e&&(e=n,o=a)}for(const a of V){const n=Math.abs(a.x-t);if(n<a.r){const i=a.y+(a.top-a.y)*Math.sqrt(1-n/a.r*(n/a.r));i>e&&(e=i,o=a.z)}}ze.profile.push([t,e,o])}await p.yield();const le=(t,e,o,a,n,i,s,r,c,u)=>{const d=Ce(r),h=t.count;for(let v=0;v<d.n;v++){const m=d.pos[v*3],M=d.pos[v*3+1],y=d.pos[v*3+2];let z=m/n,B=M/i,E=y/s;const q=Math.hypot(z,B,E)||1;z/=q,B/=q,E/=q;const tt=Math.atan2(m,y)*n,D=M*i;t.v(e+m*n,o+D,a+y*s,z,B,E,tt,D,D*.9+tt*.42,tt*.9-D*.42,c,1,0,u)}for(let v=0;v<d.idx.length;v+=3)t.tri(h+d.idx[v],h+d.idx[v+1],h+d.idx[v+2])};let mt=T;const R=3.6;if(mt){for(const t of bt)if(Math.hypot(t.base.x-mt.tx,t.base.z-mt.tz)<1.6){mt=null;break}}if(!mt){let t=-1e9;for(let e=0;e<V.length;e++){const o=V[e];if(e===0||e===4||Math.hypot(o.tx,o.tz+18)>17||o.tz<-24)continue;let a=!0;for(const i of V)if(i!==o&&Math.hypot(i.x-o.tx,i.y-(o.top+.35),i.z-o.tz)<i.r*1.25){a=!1;break}for(const i of bt)Math.hypot(i.base.x-o.tx,i.base.z-o.tz)<1.6&&(a=!1);if(!a)continue;const n=(o.tx>3?20:0)+.5*o.top-.25*Math.abs(o.tz+12)-.3*Math.abs(Math.abs(o.tx)-8);n>t&&(t=n,mt=o)}mt||(mt=V[6]||V[0])}const St=new b(mt.tx,mt.top-.05,mt.tz);le(Y,St.x,St.y+.2*R,St.z,.15*R,.215*R,.118*R,3,.5,3.3),le(Y,St.x,St.y+.03*R,St.z-.09*R,.06*R,.05*R,.13*R,2,.3,5.1);const Qt=new f.Group;Qt.position.set(St.x,St.y+.43*R,St.z);const ke=mt===T?-.6:-.25,Pt=new de;le(Pt,0,0,0,.108*R,.08*R,.09*R,3,.7,7.7);for(const t of[-1,1]){const e=Pt.count,o=t*.066*R,a=.045*R,n=.032*R,i=t*.118*R,s=.19*R;Pt.v(o-n,a,.01,-t*.3,.5,.8,0,0,0,0,.6,1,0,1),Pt.v(o+n,a,.01,t*.6,.5,.6,n*2,0,.02,0,.6,1,0,1),Pt.v(o,a,-n*1.4,0,.4,-.9,n*4,0,.04,0,.6,1,0,1),Pt.v(i,s,-.005,t*.4,.9,0,n*2,.1,.05,.1,.6,1,0,1),Pt.tri(e,e+1,e+3),Pt.tri(e+1,e+2,e+3),Pt.tri(e+2,e,e+3)}await p.yield();const Zt=Math.max(...bt.map(t=>t.top.y),30)+1,ce=N==="day"||N==="golden"?new b(-.819*Math.cos(50*_),Math.sin(50*_),.574*Math.cos(50*_)):N==="dawn"?new b(-.975,.2,.1).normalize():new b(-.819*Math.cos(5*_),Math.sin(5*_),.574*Math.cos(5*_)),I={uPx:{value:1},uPlane:{value:-10},uSoft:{value:3},uStar:{value:1},uMoonLvl:{value:1},uTime:{value:0},uInk:{value:Q},uMoonDir:{value:ce.clone()},uOwlSun:{value:ce.clone()},uOwl:{value:new f.Vector4(0,0,0,0)},uOwlDir:{value:new f.Vector2(0,-1)},uFar:{value:new f.Vector2(260,520)},uStarFar:{value:new f.Vector2(1e5,2e5)},uTilt:{value:new f.Vector4(0,0,-1e4,1e4)},uTiltX:{value:new f.Vector4(0,0,0,1e5)},uHill:{value:new f.Vector3(0,0,0)},uMoonFull:{value:.8},uInvHero:{value:new f.Matrix4},uView:{value:new f.Vector2(800,450)},uPixA:{value:.0027}},Se={value:new f.Vector2(1e5,2e5)},te=(t,e,o,a={})=>new f.ShaderMaterial(Object.assign({uniforms:Object.assign(f.UniformsUtils.clone(f.UniformsLib.fog),I,{uStarFar:Se},o),vertexShader:t,fragmentShader:e,fog:!0},a)),Pe={value:0},Te=(t,e,o={value:0})=>te(Ke,$e,{uS0:{value:t},uLen:{value:e},uNearTone:o}),It=(t,e,o,a=F)=>{const n=new f.Mesh(t,e);return n.name=o,n.frustumCulled=!1,a.add(n),n},Fe={value:new f.Vector4(Yt,it,Z,0)},Ae={value:1},Ve={value:new f.Vector4(0,0,11,0)},Le={value:new f.Vector2(0,0)};It(F.userData.groundGeo,te(Qe,Je,{uS0:{value:.05},uLen:{value:9},uNearTone:Pe,uDome:Fe,uFlatMF:Ae,uRip:Ve,uRipPh:Le}),"ground"),delete F.userData.groundGeo;const Be=Te(.02,8);It(H,Be,"boulders"),await p.yield(),It(Y.build(),Te(.012,15),"bark"),await p.yield();const ee={uWindW:{value:new b(0,0,-1)},uThin:{value:95},uGust:{value:et==="wind"?1.9:1}};It(nt.build(),te(Ze,to,ee,{side:f.DoubleSide}),"ribbons"),await p.yield(),F.add(Qt),It(Pt.build(),Be,"owl-head",Qt);const _e={uGlow:{value:1.5},uBlink:{value:1}};{const t=new f.BufferGeometry,e=[],o=[];for(const a of[-1,1])for(const n of[[-1,-1],[1,-1],[1,1],[-1,1]])e.push(a*.04*R,.012*R,.075*R),o.push(n[0],n[1]);t.setAttribute("position",new f.Float32BufferAttribute(e,3)),t.setAttribute("aCorner",new f.Float32BufferAttribute(o,2)),t.setIndex([0,1,2,0,2,3,4,5,6,4,6,7]),It(t,te(`
      attribute vec2 aCorner; uniform vec2 uView; uniform float uPx, uBlink; varying vec2 vC; varying float vF;
      #include <common>
      #include <fog_pars_vertex>
      void main(){
        vec4 wp = modelMatrix * vec4(position, 1.);
        vec3 f = mat3(modelMatrix) * vec3(0., 0., 1.); vec3 v = cameraPosition - wp.xyz;
        vF = smoothstep(.05, .4, dot(f / max(length(f), 1e-5), v / max(length(v), 1e-5)));
        vec4 mvPosition = viewMatrix * wp; mvPosition.z += .06;
        vec4 c = projectionMatrix * mvPosition;
        float px = max(${(.028*R).toFixed(4)} * projectionMatrix[1][1] * uView.y * .5 / max(c.w, .05), 1.5 * uPx);
        c.xy += aCorner * vec2(1., uBlink) * px * 2. / uView * c.w;
        vC = aCorner; gl_Position = c;
        #include <fog_vertex>
      }`,`
      uniform float uGlow; varying vec2 vC; varying float vF;
      #include <common>
      #include <fog_pars_fragment>
      void main(){
        float d = length(vC); if (d > 1. || vF < .02) discard;
        gl_FragColor = vec4(vec3(uGlow * vF), 1.);
        #include <fog_fragment>
      }`,_e),"owl-eyes",Qt)}await p.yield();const je={uNotch:{value:new b(0,ft+2.5,-20).clone()}};{const t=Math.max(0,Math.round(w.bats??40)),e=new f.BufferGeometry,o=[],a=[],n=[],i=[],s=[[.02,.05],[.2,.1],[.42,-.02],[.24,-.07],[.1,-.1],[0,-.13]],r=[0,1,3,1,2,3,0,3,4,0,4,5];for(let c=0;c<t;c++){const u=l()*U,d=l.sign()*l.range(9,34),h=l.range(20,54),v=l();for(const M of[-1,1]){const y=n.length/3;for(const z of s)a.push(M*z[0]*1.4,z[1]*1.4,0),o.push(u,d,h,v),n.push(0,0,0);for(let z=0;z<r.length;z+=3)i.push(y+r[z],y+r[z+1],y+r[z+2])}const m=n.length/3;for(const M of[[-.04,.05],[.04,.05],[0,.18]])a.push(M[0],M[1],0),o.push(u,d,h,v),n.push(0,0,0);i.push(m,m+1,m+2)}e.setAttribute("position",new f.Float32BufferAttribute(n,3)),e.setAttribute("aBat",new f.Float32BufferAttribute(o,4)),e.setAttribute("aWing",new f.Float32BufferAttribute(a,3)),e.setIndex(i),t>0&&It(e,te(so,ro,je,{side:f.DoubleSide}),"bats")}await p.yield();const ue=new b(0,0,-1),pe=new b(Math.sin(15*_),Math.cos(15*_),0),Re=new b().crossVectors(ue,pe).normalize(),At=(t,e)=>{const o=t*_,a=e*_;return new b().addScaledVector(ue,Math.cos(a)*Math.cos(o)).addScaledVector(pe,Math.cos(a)*Math.sin(o)).addScaledVector(Re,Math.sin(a)).normalize()},Dt=(t,e)=>new b(-Math.sin(t*_)*Math.cos(e*_),Math.sin(e*_),-Math.cos(t*_)*Math.cos(e*_)),De=At(40,7.5),ct={uTime:I.uTime,uPx:I.uPx,uPixA:I.uPixA,uInk:I.uInk,uSkyDim:{value:N==="day"||N==="golden"?0:1},uMeteor:{value:-1},uDawn:{value:0},uMetW:{value:1},uMetTail:{value:.45},uFoot:{value:0},uBg:{value:1},uMwA:{value:ue},uMwB:{value:pe},uMwN:{value:Re},uCoal:{value:At(37,2.2)},uLmc:{value:Dt(40,19)},uSmc:{value:Dt(22,30)},uMetA:{value:Dt(-11,36)},uMetB:{value:Dt(-26,19)},uDawnDir:{value:new b(-1,0,0)}},ve={uView:I.uView,uPx:I.uPx,uTime:I.uTime,uInk:I.uInk,uStarDim:{value:1}};let Wt=null;if(w.sky!==!1){Wt=new f.Group,Wt.name="sky";const t=new f.Mesh(new f.SphereGeometry(2400,24,14),new f.ShaderMaterial({uniforms:ct,vertexShader:eo,fragmentShader:oo,side:f.BackSide,depthWrite:!1}));t.renderOrder=-.6,t.frustumCulled=!1,Wt.add(t);const e=[],o=[],a=[],n=[],i=l.fork?l.fork("stars"):l,s=(u,d,h)=>{const v=e.length/3,m=i()*U,M=i.range(.3,1.1);for(const y of[[-1,-1],[1,-1],[1,1],[-1,1]])e.push(u.x*2300,u.y*2300,u.z*2300),o.push(y[0],y[1]),a.push(d,m,M,h);n.push(v,v+1,v+2,v,v+2,v+3)};s(At(43.2,7.5),7.5,1),s(At(37,7.6),6.4,1),s(At(40.4,9.7),6.8,1),s(At(40,5.4),5.6,1),s(At(41.6,6.3),2.4,0),s(At(27.5,3.6),8.4,1),s(At(31.6,4.6),6.8,1),s(Dt(62,13),8.2,1),s(Dt(-70,24),6.5,1),s(Dt(8,62),6.2,1);for(let u=0;u<50;u++){const d=Math.asin(i.range(.03,.98))/_,h=i.range(-180,180),v=Dt(h,d),m=2.2+4*Math.pow(i(),2.2);v.distanceTo(De)<.14||s(v,m,m>4.4?1:0)}const r=new f.BufferGeometry;r.setAttribute("position",new f.Float32BufferAttribute(e,3)),r.setAttribute("aCorner",new f.Float32BufferAttribute(o,2)),r.setAttribute("aStar",new f.Float32BufferAttribute(a,4)),r.setIndex(n);const c=new f.Mesh(r,new f.ShaderMaterial({uniforms:ve,vertexShader:ao,fragmentShader:no,depthWrite:!1}));c.renderOrder=-.5,c.frustumCulled=!1,Wt.add(c),F.add(Wt)}await p.yield();let We=w.progress??1,me=null,we=null;const Ue=N==="day"||N==="golden",fe=()=>{const t=Math.min(1,Math.max(0,(We-ot)/Math.max(1e-4,zt-ot)));I.uPlane.value=me!==null?me:Ue?-10:t<=0?Zt+30:Zt+(-4-Zt)*t,N==="dawn"&&(ct.uDawn.value=t,ct.uSkyDim.value=1-.92*t,ve.uStarDim.value=1-t)};fe();const xe=V.reduce((t,e)=>e.top>t.top?e:t,V[0]),Xe={portalSeat:{position:Mt.clone(),facing:ht.clone().multiplyScalar(-1),radius:Ft,tilt:6*_},flyThrough:at.map(t=>t.clone()),beyond:Xt,notch:{saddle:new b(0,ft,-20),width:10,leftStack:kt[0].clone(),rightStack:kt[1].clone()},notchTrees:be.map(t=>({base:t.base.clone(),top:t.top.clone()})),heroTree:$t?{base:$t.base.clone(),top:$t.top.clone(),height:$t.height}:null,owl:St.clone().add(new b(0,.4*R,0)),summit:new b(xe.x,xe.top,xe.z),moonDir:ce.clone(),milkyWay:ue.clone(),cross:De.clone(),batCloud:{center:new b(0,ft+12,-20),radius:60},heightAt:O,skyline:ze,boulders:V.map(t=>({x:t.x,y:t.y,z:t.z,r:t.r,top:t.top})),trees:bt.map(t=>({x:t.base.x,y:t.base.y,z:t.base.z,top:t.top.y,r:t.crownR,cy:t.crown.y})),viewpoints:{entry:new b(-2,6,300),foot:at[2].clone(),climb:at[4].clone(),notch:dt.clone(),far:new b(-125,30,165)}},fo=new f.Matrix4,Ne=new b,ge=new f.Vector2,Ye=new b(.12,0,-1).normalize(),Oe=t=>{const e=Math.sin(t*127.1+31.7)*43758.5453;return e-Math.floor(e)},Ge=(t,e,o)=>{F.updateMatrixWorld(),I.uInvHero.value.copy(F.matrixWorld).invert(),I.uMoonDir.value.copy(ce).transformDirection(F.matrixWorld),ee.uWindW.value.copy(Ye).transformDirection(F.matrixWorld),I.uTime.value=e,p.renderer&&p.renderer.getDrawingBufferSize&&(p.renderer.getDrawingBufferSize(ge),ge.y>0&&I.uView.value.copy(ge)),I.uPx.value=Math.max(.6,I.uView.value.y/450),o&&(I.uPixA.value=2/(Math.max(.1,o.projectionMatrix.elements[5])*I.uView.value.y),Wt&&(Ne.setFromMatrixPosition(o.matrixWorld),Wt.position.copy(F.worldToLocal(Ne))));const a=e/2.6,n=Math.floor(a),i=X(0,.22,a-n),s=(Oe(n)-.5)*1.5+ke,r=(Oe(n+1)-.5)*1.5+ke;Qt.rotation.y=s+(r-s)*i,Qt.rotation.z=.12*Math.sin(e*.7);const c=(e+1.3)%4.7;_e.uBlink.value=1-.94*X(0,.07,c)*(1-X(.1,.22,c)),ct.uMeteor.value=we!==null?we:(e+4)%11/1.3,fe()};return Ge(0,0,null),{object:F,radius:42,height:Zt-1,center:new b(0,15,12),anchors:Xe,uniforms:Object.assign({},I,{uSkyDim:ct.uSkyDim,uGust:ee.uGust,uThin:ee.uThin,uWindW:ee.uWindW,uMeteor:ct.uMeteor,uMetA:ct.uMetA,uMetB:ct.uMetB,uMetW:ct.uMetW,uMetTail:ct.uMetTail,uHillStarFar:Se,uDawn:ct.uDawn,uStarDim:ve.uStarDim,uFoot:ct.uFoot,uBg:ct.uBg,uGroundNear:Pe,uDome:Fe,uFlatMF:Ae,uRip:Ve,uRipPh:Le}),sky:Wt,addBlob:le,topY:Zt,setProgress(t){We=t,fe()},setMoonPlane(t){me=t,fe()},setOwlShadow(t,e,o=1.6){I.uOwl.value.set(t.x,t.y,t.z,o),e&&I.uOwlDir.value.set(e.x,e.y??e.z??-1).normalize()},setMeteor(t){we=t},update:Ge,dispose(){},ground:!1,groundY:0}}export{Je as GROUND_FRAG,Qe as GROUND_VERT,to as RIB_FRAG,io as Ribs,Ie as SCRATCH_COMMON,qe as SCRATCH_GLSL,$e as SURF_FRAG,Ke as SURF_VERT,de as Surf,ho as buildHero,Ce as icoTemplate};
