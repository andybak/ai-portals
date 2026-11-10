import*as d from"three";import{HOLE as t,HOLE_DIR as r,WAVE as D,crestZ as p,holeGrow as E}from"./knee-deep-under-the-wave-law.js";const e=s=>{const n=String(s);return/[.e]/.test(n)?n:n+"."};function y(){const s={uKdCrestZ:{value:p(0)},uKdTime:{value:0},uKdGrow:{value:1}},n=`
uniform float uKdCrestZ; uniform float uKdTime;
const vec3 KD_HOLE_DIR = vec3(${e(r[0])}, ${e(r[1])}, ${e(r[2])});
const vec3 KD_HOLE_UP = vec3(0., ${e(-r[2])}, ${e(r[1])});      // "up" on the sky at the hole
const vec3 KD_GOLD = vec3(1.0, 0.80, 0.52);
const vec3 KD_DEEP = vec3(0.018, 0.060, 0.075);
const float KD_WAVE_H = ${e(D.height)};
const float KD_HAZE = 0.00016;

// ---- THE SKY BUILDER'S (down to kdCloud): the air, the hole and the high cloud. The hole is a thin disc of glowing
// gas round a black hole, seen almost edge-on, drawn from that physics: its near half is seen straight (the band
// that crosses in front of the dark), the light of its far half is bent over the top (the upper arch, one piece
// with the band) and, from its underside, the other way round under the hole (the lower arch: a mirror image);
// the light that has circled the hole stands as a thin ring at its edge. Every ring of gas turns at its own
// orbit's speed by the clock (an ambient loop that never winds up). The dark disc is KD_HOLE_SH degrees in radius.
${(()=>{const a=Math.PI/180,o=Math.sin(t.tilt*a),h=Math.cos(t.tilt*a),v=.4,_=.2,f=(i,l)=>.5*(i*o+Math.sqrt(i*i*o*o+4*l*h*i)),H=t.archTop**2-(t.ring+v)**2;let m=.05,u=40;for(let i=0;i<60;i++){const l=.5*(m+u);f(t.band,l)**2-f(t.bandInner,l)**2<H?m=l:u=l}const w=.5*(m+u),K=(t.archTop**2-f(t.band,w)**2)/(h*h);return`const float KD_HOLE_SH = ${e(t.shadow)}, KD_HOLE_RING = ${e(t.ring)}, KD_HOLE_TOP = ${e(t.archTop)}, KD_HOLE_BOT = ${e(t.archBottom)};
const float KD_HOLE_BAND = ${e(t.band)}, KD_HOLE_IN = ${e(t.bandInner)}, KD_HOLE_TAU = ${e(o)}, KD_HOLE_CT = ${e(h)}, KD_HOLE_TILT = ${e(t.tilt*a)};
const float KD_HOLE_K = ${e(w*(h+_)/h)}, KD_HOLE_A = ${e(K)}, KD_HOLE_C0 = ${e(_)}, KD_HOLE_GAP = ${e(v)};`})()}
uniform float uKdGrow;                 // the hole's growth (the law's holeGrow): every angle about its centre times this
// about a pixel's width in radians in the direction d (in a vertex shader, where it cannot be asked: a usual one)
#ifdef gl_FragColor
#define KD_PIXEL(d) (length(fwidth(d)) * 0.8)
#else
#define KD_PIXEL(d) 0.003
#endif
float kdSkyHash(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }

// THE AIR: indigo overhead, steel blue at mid height, a clear blue-grey horizon that warms toward the hole, and
// pale gold round the hole. Smooth (no pattern): the haze takes its colour.
vec3 kdAir(vec3 d) {
  vec3 h = vec3(d.x, max(d.y, 0.), d.z);                     // below the horizon: the horizon's air at that bearing
  h *= inversesqrt(max(dot(h, h), 1e-6));
  float mu = dot(h, KD_HOLE_DIR), k = 1. - h.y, k2 = k * k, k4 = k2 * k2;
  float warm = 0.5 + 0.5 * mu; warm *= warm; warm *= warm; warm *= warm;
  vec3 col = mix(vec3(0.014, 0.022, 0.075), vec3(0.095, 0.15, 0.26), k2 * k);
  col = mix(col, mix(vec3(0.19, 0.26, 0.35), vec3(0.36, 0.31, 0.25), warm), k4 * k4 * k4 * k2);
  float g = max(mu, 1e-3), g2 = g * g, g4 = g2 * g2, g8 = g4 * g4, g16 = g8 * g8;
  col = mix(col, vec3(0.56, 0.43, 0.27), 0.26 * g4 * g2);                 // the wide soft glow round the hole
  float gr = max(uKdGrow, 1.);
  col = mix(col, vec3(0.64, 0.50, 0.31), 0.68 * exp(-40. * (1. - g) / (gr * gr)));   // and the tighter one, which grows with the hole
  return col;
}

// THE HOLE. q is degrees right and up from its centre; rho a radius on the disc of gas in the same degrees; turn
// a place round an orbit in turns (0 at the right, a quarter behind the hole, minus a quarter in front of it).
const float KD_HOLE_SPIN = 0.09;                        // turns a second of the gas at the disc's inner rim (seen to flow)
// the radius of the place on the disc that is seen at q: the near half straight, the far half bent over the top
float kdHoleRho(vec2 q) {
  vec2 e = vec2(q.x, q.y / KD_HOLE_TAU);
  float e2 = max(dot(e, e), 1e-4);
  if (q.y <= 0.) return sqrt(e2);
  float c2 = e.y * e.y / e2 * (KD_HOLE_CT * KD_HOLE_CT), c = sqrt(c2), s = sqrt(max(1. - c2, 0.));
  float W = max(dot(q, q) - KD_HOLE_A * c2, 0.);
  return W / max(s * sqrt(W) + KD_HOLE_K * c2 / (c + KD_HOLE_C0), 1e-3);
}
// one ring of gas, its brightness along its length: ring i, the place a in turns, n cells to the turn
float kdHoleRow(float i, float a, float n) {
  float x = fract(a) * n, c = floor(x), t = x - c; t = t * t * (3. - 2. * t);
  return mix(kdSkyHash(vec2(i, c)), kdSkyHash(vec2(i, mod(c + 1., n))), t);
}
// the gas at (rho, turn): k rings to the degree, n cells round each; every ring turns at its own orbit's speed
float kdHoleGas(float rho, float turn, float k, float n, float salt) {
  float x = rho * k, i = floor(x), t = x - i; t = t * t * (3. - 2. * t);
  vec2 r = max(vec2(i + 0.5, i + 1.5) / k, KD_HOLE_IN) / KD_HOLE_IN;       // (nothing turns quicker than the inner rim)
  vec2 w = KD_HOLE_SPIN / (r * sqrt(r));
  return mix(kdHoleRow(i + salt, turn - w.x * uKdTime, n), kdHoleRow(i + 1. + salt, turn - w.y * uKdTime, n), t);
}
vec4 kdHole(vec3 d) {
  float gr = max(uKdGrow, 1.), fw = KD_PIXEL(d) * 57.3 / gr;   // about a pixel's width in degrees of the hole's own measure
  float cc = dot(d, KD_HOLE_DIR);
  if (cc < cos(radians(min(25.8 * gr, 89.)))) return vec4(0.);
  vec2 tq = vec2(d.x, dot(d, KD_HOLE_UP));
  float sn = max(length(tq), 1e-5);
  vec2 q = tq * (degrees(atan(sn, cc)) / (sn * gr));          // (all the hole's measures below are its first ones: q is told in them)
  float r = length(q);
  if (r > KD_HOLE_TOP + 0.4 && (q.y < -(KD_HOLE_TAU + 0.015) * KD_HOLE_BAND || q.y > 0.3 + 0.42 * (KD_HOLE_BAND + 0.3 - abs(q.x)))) return vec4(0.);
  float dark = 1. - smoothstep(KD_HOLE_SH - 0.5 * fw - 0.03, KD_HOLE_SH + 0.5 * fw + 0.03, r);
  if (r < 0.8 * KD_HOLE_IN * KD_HOLE_TAU) return vec4(0., 0., 0., dark);
  // the light that has circled the hole: a thin ring at its edge and a fainter, thinner one inside that
  float side = -q.x / r;                           // 1 at the left, the side that turns toward the eye
  float sg = max(0.07, 0.6 * fw), x1 = (r - KD_HOLE_RING) / sg, x2 = (r - mix(KD_HOLE_SH, KD_HOLE_RING, 0.38)) / max(0.03, 0.6 * fw);
  float ring = exp(-x1 * x1) * sqrt(0.07 / sg) + 0.3 * exp(-x2 * x2) * (0.03 / max(0.03, 0.6 * fw));
  vec3 rgb = vec3(1.0, 0.93, 0.80) * (ring * 1.25 * (1. + 0.25 * side) * smoothstep(KD_HOLE_SH - 0.05, KD_HOLE_SH + 0.12, r));
  // the disc of gas: which place of it is seen here, and how finely a pixel reads it
  vec2 e = vec2(q.x, q.y / KD_HOLE_TAU);
  float el = max(length(e), 1e-3), turn = atan(e.y, e.x) / 6.2832, rho = kdHoleRho(q);
  float fr = fw * 20. * length(vec2(kdHoleRho(q + vec2(0.05, 0.)) - rho, kdHoleRho(q + vec2(0., 0.05)) - rho));
  float u = (rho - KD_HOLE_IN) / (KD_HOLE_BAND - KD_HOLE_IN), soft = 0.5 * fr / (KD_HOLE_BAND - KD_HOLE_IN) + 0.012;
  float rim = smoothstep(-soft, soft, u);          // 1 on the disc, 0 inside its inner rim
  // inside the rim the gas falls in toward the hole and goes dim and red as it falls
  float env = mix(0.42 * exp(min(u, 0.) * (KD_HOLE_BAND - KD_HOLE_IN) / 1.1), 1., rim) * (1. - smoothstep(0.6, 1., u));
  dark = max(dark, 1. - rim);                      // and no air shines through the gap that it leaves round the ring
  float along = -e.x / el;                         // 1 where the gas comes toward the eye
  // under the hole: the far half's underside, its light bent the other way round (a mirror image)
  // (it is thickest straight under the hole; the further round the hole its light has to go, the thinner it lies
  // and the closer to the ring, until over the top it is one with the ring)
  if (r < (q.y < 0. ? KD_HOLE_BOT + 0.3 : KD_HOLE_RING + 0.6)) {
    float sw = acos(clamp(abs(e.y) / el * KD_HOLE_CT, 0., 1.));
    float thin = exp(KD_HOLE_TILT - (q.y < 0. ? sw : 3.1416 - sw)), T = (KD_HOLE_BOT - KD_HOLE_RING - KD_HOLE_GAP) * thin;
    float u2 = (r - KD_HOLE_RING - KD_HOLE_GAP * thin) / T, s2 = 0.06 + 0.5 * fw / T;
    float env2 = 0.72 * smoothstep(-s2, s2, u2) * (1. - smoothstep(0.45, 1., u2)) * min(1., T / max(fw, 1e-4));
    if (env2 > env) { env = env2; u = clamp(u2, 0., 1.); rho = mix(KD_HOLE_IN, KD_HOLE_BAND, u); turn += 0.5; along = -along; fr = fw * (KD_HOLE_BAND - KD_HOLE_IN) / T; rim = 1.; }
  }
  if (env > 0.001) {
    float beta = 0.12 * inversesqrt(max(rho / KD_HOLE_IN, 0.3));
    float dop = 1. / (1. - beta * along); dop = dop * dop * dop;
    float heat = clamp(1. - u, 0., 1.), hc = clamp(heat + 1.4 * beta * along - 0.5 * (1. - rim), 0., 1.);
    vec3 gc = mix(vec3(0.78, 0.13, 0.02), vec3(1.0, 0.44, 0.09), smoothstep(0., 0.36, hc));       // deep orange-red, amber,
    gc = mix(gc, vec3(1.0, 0.69, 0.29), smoothstep(0.3, 0.66, hc));                                 // gold,
    gc = mix(gc, vec3(1.0, 0.94, 0.84), smoothstep(0.66, 1., hc));                                  // white-hot
    float w0 = 1. - smoothstep(0.35, 1., fr * 0.12), w1 = 1. - smoothstep(0.35, 1., fr * 0.33), w2 = 1. - smoothstep(0.35, 1., fr * 1.1);
    float w3 = 1. - smoothstep(0.35, 1., fr * 0.6), w4 = 1. - smoothstep(0.35, 1., fr * 2.4);      // (finer layers show as the hole grows)
    // (the streaks do not lie on perfect circles: two slow spiral waves bend them a little, and turn slowly themselves)
    float rw = rho + 0.34 * sin(6.2832 * fract(2. * turn - 0.011 * uKdTime) + 0.55 * rho) + 0.17 * sin(6.2832 * fract(5. * turn - 0.016 * uKdTime) - 1.3 * rho + 1.7);
    // long streaks with finer streaks in them, and broad knots of brighter and darker gas (0.4 to 1.6, 1 in the
    // mean, so the whole keeps its brightness): all go round with their orbits, the inner quicker
    float v3 = w3 > 0.01 ? kdHoleGas(rw, turn, 0.6, 43., 210.) : 0.5, v2 = w2 > 0.01 ? kdHoleGas(rw, turn, 1.1, 17., 40.) : 0.5, v4 = w4 > 0.01 ? kdHoleGas(rw, turn, 2.4, 29., 90.) : 0.5;
    float pat = 0.44 * mix(0.5, kdHoleGas(rw, turn, 0.33, 7., 0.), w1) + 0.24 * mix(0.5, v3, w3) + 0.20 * mix(0.5, v2, w2) + 0.12 * mix(0.5, v4, w4);
    float knot = 0.4 + 1.2 * smoothstep(0.24, 0.76, mix(0.5, kdHoleGas(rw, turn, 0.12, 16., 150.), w0));
    // GROWN, the gas is seen at up to the law's HOLE.grow times the size and shows what was too fine to see before:
    // thin threads of brighter gas along the orbits (where each of four layers of the pattern crosses its middle
    // value, the finest a fifth of a degree apart) and smaller knots. None of it at growth 1, all of it from 2 on.
    float fine = min(gr - 1., 1.), thread = 1.;
    if (fine > 0.01) {
      float w5 = 1. - smoothstep(0.35, 1., fr * 5.2), w6 = 1. - smoothstep(0.35, 1., fr * 0.3);
      vec4 th = 1. - smoothstep(0.02, 0.09, abs(vec4(v3, v2, v4, w5 > 0.01 ? kdHoleGas(rw, turn, 5.2, 61., 300.) : 0.5) - 0.5));
      th = (th - 0.2) * vec4(w3, w2, w4, w5) * fine;
      thread = (1. + 0.9 * th.x) * (1. + 0.8 * th.y) * (1. + 0.7 * th.z) * (1. + 0.6 * th.w);
      knot *= 1. + 0.4 * fine * w6 * (2. * smoothstep(0.3, 0.7, kdHoleGas(rw, turn, 0.3, 37., 400.)) - 1.);
    }
    float streak = 0.45 + 1.1 * smoothstep(0.3, 0.7, pat);
    float lx = rw * 0.8, li = floor(lx), lt = lx - li; lt = lt * lt * (3. - 2. * lt);                  // dark lanes that follow the orbits
    float lane = mix(kdSkyHash(vec2(li, 7.)), kdSkyHash(vec2(li + 1., 7.)), lt);
    streak *= mix(1., 0.5 + 0.62 * smoothstep(0.15, 0.6, lane), 1. - smoothstep(0.35, 1., fr * 0.8));
    vec3 gas = gc * (0.8 * (0.3 + 0.7 * heat * sqrt(sqrt(max(heat, 1e-4)))) * streak * dop * env);
    // the gas stays under the brightness that the picture's glow spreads (or a veil would lie on the dark); only
    // its white-hot inner rim goes over it, as a fine line
    float lum0 = dot(gas, vec3(0.3, 0.59, 0.11)), over = max(lum0 - 0.6, 0.), lum = lum0 - over + 0.3 * (1. - exp(-over / 0.3));
    float kt = knot;
    if (fine > 0.01) {                                             // (the threads may glow, but must not flood the picture)
      gas *= mix(vec3(1.), vec3(1.0, 0.80, 0.58), 0.7 * fine * clamp(1.15 - thread, 0., 1.));   // (deeper fire between the threads)
      float lt = lum * knot * thread * (1. - 0.25 * fine), o2 = max(lt - 1., 0.);
      kt = mix(knot, (lt - o2 + 0.45 * (1. - exp(-o2 / 0.45))) / max(lum, 1e-4), min(4. * fine, 1.));
    }
    gas *= kt * lum / max(lum0, 1e-4);
    dark = max(dark, min(lum / 0.9, 1.));          // bright gas hides the air behind it, so the two never add up to a glare
    float hw = max(0.06, 0.9 * fr / (KD_HOLE_BAND - KD_HOLE_IN)), hx = max(u, 0.) / hw;
    rgb += gas + vec3(1.0, 0.94, 0.84) * (0.85 * exp(-hx * hx) * (0.06 / hw) * (0.5 + 0.5 * streak) * knot * min(dop, 1.5) * env * rim);
  }
  return vec4(rgb, dark) * smoothstep(-0.005, 0.021, d.y);    // (grown, its foot sinks into the far haze at the level horizon)
}

// THE CLOUD: a few long streaks of ice cloud on one level sheet far overhead, drawn out east-west, drifting east by
// the clock on a lattice that wraps; they lie finer and closer the lower they stand. None before the dark, the ring
// or the arches.
float kdCloudNoise(vec2 p) {                               // smooth noise on a lattice that wraps east-west
  vec2 i = floor(p), t = p - i; t = t * t * (3. - 2. * t);
  float x0 = mod(i.x, 64.), x1 = mod(i.x + 1., 64.);
  return mix(mix(kdSkyHash(vec2(x0, i.y)), kdSkyHash(vec2(x1, i.y)), t.x), mix(kdSkyHash(vec2(x0, i.y + 1.)), kdSkyHash(vec2(x1, i.y + 1.)), t.x), t.y);
}
vec4 kdCloud(vec3 d) {
  float fw = KD_PIXEL(d);                          // about a pixel's width in radians
  if (d.y < 0.04) return vec4(0.);
  float mu = dot(d, KD_HOLE_DIR);
  // (none stands before the hole or its band: a wide flat oval round them is kept clear)
  vec2 hq = vec2(d.x, dot(d, KD_HOLE_UP)) / (max(uKdGrow, 1.) * vec2(sin(radians(KD_HOLE_BAND + 4.)), sin(radians(KD_HOLE_TOP + 2.6))));
  // (the oval grows with the hole; past twice the size it would reach the sky at the hole's side, so there it lets go by degrees)
  float clear = mix(1., smoothstep(0.7, 1.25, dot(hq, hq)), smoothstep(0., 0.3, mu));
  if (clear <= 0.) return vec4(0.);
  vec2 p = d.xz / d.y;                             // the place on the sheet, in its heights (x east, y south)
  float px = p.x + uKdTime * 0.016, fp = fw / (d.y * d.y);                     // the sheet drifts east, slowly
  float n1 = kdCloudNoise(vec2(px * 0.3 + 7.3, p.y * 2.9 + 3.1));
  float cov = smoothstep(0.74, 0.92, n1) * smoothstep(0.04, 0.14, d.y) * (1. - smoothstep(0.35, 1., fp * 2.9)) * clear;
  if (cov <= 0.002) return vec4(0.);
  float n2 = mix(0.5, kdCloudNoise(vec2(px * 1.7, p.y * 11.)), 1. - smoothstep(0.3, 0.9, fp * 11.));   // its fibres
  cov *= 0.2 + 1.5 * n2 * n2;
  cov = min(cov, 1.);
  float near = max(mu, 0.); near *= near; near *= near; near *= near;        // how near the hole it stands
  float edge = 4. * cov * (1. - cov);                                          // its thin parts
  vec3 col = mix(vec3(0.20, 0.26, 0.35), vec3(1.0, 0.82, 0.56) * (0.42 + 0.55 * edge), near);
  return vec4(col, cov * mix(0.30, 0.55, near));
}

vec3 kdSky(vec3 d) { vec4 h = kdHole(d); vec4 c = kdCloud(d); return mix(kdAir(d) * (1. - h.a) + h.rgb, c.rgb, c.a); }

float kdOpen(vec3 p, vec3 d) {
  float xi = p.z - uKdCrestZ;
  if (xi <= 0. || d.z > -1e-4) return 1.;
  return smoothstep(-6., 16., p.y + d.y * xi / -d.z - KD_WAVE_H);
}

float kdLit(vec3 p) {
  float xi = p.z - uKdCrestZ;
  if (xi <= 0.) return 1.;
  return 1. - smoothstep(${e(t.lightLow)}, ${e(t.lightHigh)}, degrees(atan(KD_WAVE_H - p.y, xi)));
}

vec3 kdHaze(vec3 col, vec3 p) {
  vec3 v = p - cameraPosition; float dist = length(v); vec3 d = v / max(dist, 1e-3);
  vec3 air = kdAir(normalize(vec3(d.x, 0.03 + 0.25 * max(d.y, 0.), d.z)));
  return mix(col, air, 1. - exp(-dist * KD_HAZE));
}
`;function x(a){return a.onBeforeCompile=o=>{Object.assign(o.uniforms,s),o.vertexShader=o.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vKdW;`).replace("#include <project_vertex>",`#include <project_vertex>
{ vec4 kdW = vec4(transformed, 1.0);
#ifdef USE_INSTANCING
 kdW = instanceMatrix * kdW;
#endif
 vKdW = (modelMatrix * kdW).xyz; }`),o.fragmentShader=o.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vKdW;
`+n).replace("#include <lights_fragment_end>",`#include <lights_fragment_end>
{ float kdK = kdLit(vKdW); reflectedLight.directDiffuse *= kdK; reflectedLight.directSpecular *= kdK; }`)},a.customProgramCacheKey=()=>"knee-deep-hole-light",a}const g=new d.Group,c=new d.DirectionalLight(new d.Color(1,.8,.52),3.2);c.position.set(r[0],r[1],r[2]).multiplyScalar(1e3);const k=new d.HemisphereLight(new d.Color(.3,.4,.58),new d.Color(.2,.24,.26),1.1);return g.add(c,c.target,k),{uniforms:s,GLSL:n,patch:x,rig:g,set:(a,o)=>{s.uKdCrestZ.value=p(a),s.uKdTime.value=o,s.uKdGrow.value=E(a)}}}export{y as makeHoleLight};
