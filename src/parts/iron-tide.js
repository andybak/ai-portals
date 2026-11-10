import*as e from"three";const We=["#EFE2B0","#D9B95A","#9A8440","#D4D7DC","#1B1A17","#0A0A0C","#2FD6C0"],W=Math.PI*2,ve=`
uniform vec3 uSkyHor, uSkyTop, uSkySeam, uSkySun, uSkyBole;
uniform vec2 uSkyShift;
float itHash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
// the smooth vault: gold deepening overhead; ONE light in it (uSkySun, a low white-gold disc ahead to one side),
// the leaf brightest round it and tarnishing to red bronze and umber away from it, so every view has a bright
// side and a dark side
float itNearSun(vec3 d){ return smoothstep(-0.12, 0.95, dot(d, uSkySun)); }
vec3 itSkyBase(vec3 d, float e){
  // three stops: pale leaf low down, full gold a third of the way up, deep bronze overhead (the metal's own
  // colour multiplied by itself, so every look deepens toward its own bronze)
  vec3 deep = uSkyTop * uSkyTop * 1.2;
  vec3 col = mix(mix(uSkyHor, uSkyTop, 0.62), uSkyTop, smoothstep(0.0, 0.26, e));
  col = mix(col, deep, 0.84 * smoothstep(0.1, 0.66, e));
  float lit = itNearSun(d);
  // the side away from the light goes to bronze, the side round it is brighter and warmer
  col = mix(mix(col, deep, 0.62) * 0.56, col * 1.04, lit);
  // leaf is laid on bole: far from the light and high overhead the clay under the gold shows through
  float far = clamp(0.6 * smoothstep(0.3, 1.0, e) + 0.42 * (1.0 - lit) * smoothstep(0.03, 0.4, e), 0.0, 0.86);
  col = mix(col, uSkyBole * (0.8 + 0.5 * lit), far);
  // the vault deepens overhead and away from the light: a rule of elevation and of nearness to the light over the whole dome
  col *= 1.0 - (0.26 * smoothstep(0.2, 0.8, e) + 0.08 * smoothstep(0.03, 0.3, e)) * (1.0 - 0.8 * lit);
  return col;
}
// smooth value noise, 0..1 (four hashes)
float itVN(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(itHash(i), itHash(i + vec2(1.0, 0.0)), f.x), mix(itHash(i + vec2(0.0, 1.0)), itHash(i + vec2(1.0, 1.0)), f.x), f.y);
}
// gold leaf on a vault: hand-laid squares a little off the grid, large overhead and shrinking steeply toward the
// horizon (the perspective of a ceiling: hundreds of small squares in the last degrees). Every square is BEATEN METAL,
// never one flat tone: its own tilt lays a sheen across it that moves with the eye, it is crinkled and creased, it
// overlaps its neighbour with a dark thread and a bright lip, it rubs through to the bole in ragged patches that start
// at corners and seams, and tarnish lies over it in soft clouds that cross several squares and break at the seams.
vec3 itLeaf(vec3 col, vec3 d, float e, float amt){
  vec2 uv = d.xz / (max(d.y, 0.0) + 0.2) * 7.6;
  vec2 fwv = fwidth(uv);
  float wv = max(fwv.x, fwv.y);
  vec2 c0 = floor(uv), f = fract(uv);
  float jl = (itHash(c0 + vec2(0.0, 0.37)) - 0.5) * 0.16, jr = (itHash(c0 + vec2(1.0, 0.37)) - 0.5) * 0.16;
  vec2 id = c0;
  id.x += step(1.0 + jr, f.x) - step(f.x, jl);
  float jb = (itHash(vec2(id.x, c0.y) + vec2(0.61, 0.0)) - 0.5) * 0.16, jt = (itHash(vec2(id.x, c0.y) + vec2(0.61, 1.0)) - 0.5) * 0.16;
  id.y += step(1.0 + jt, f.y) - step(f.y, jb);
  float dl = abs(f.x - jl), dr = abs(1.0 + jr - f.x), db = abs(f.y - jb), dt = abs(1.0 + jt - f.y);
  float gx = step(0.4, itHash(vec2(c0.x + step(dr, dl), c0.y) + 1.7));
  float gy = step(0.4, itHash(vec2(id.x, c0.y + step(dt, db)) + 4.3));
  float h = itHash(id);
  vec2 pu = uv / 5.0, pi = floor(pu), pf = fract(pu);
  pf = pf * pf * (3.0 - 2.0 * pf);
  float pn = mix(mix(itHash(pi + 11.3), itHash(pi + vec2(1.0, 0.0) + 11.3), pf.x),
                 mix(itHash(pi + vec2(0.0, 1.0) + 11.3), itHash(pi + vec2(1.0, 1.0) + 11.3), pf.x), pf.y);
  // what the pixel can still resolve: soft = a whole square, mid = a quarter of one, fine = a tenth
  float soft = clamp(0.3 / (wv + 1e-4), 0.0, 1.0), mid = clamp(0.11 / (wv + 1e-4), 0.0, 1.0), fine = clamp(0.04 / (wv + 1e-4), 0.0, 1.0);
  float lit = itNearSun(d);
  vec2 q = uv - id - 0.5;                       // the place inside this leaf, -0.5..0.5
  float ex = min(dl, dr), ey = min(db, dt), ed = min(ex, ey), cd = length(vec2(ex, ey));
  vec2 tilt = vec2(itHash(id + 3.1), itHash(id + 7.7)) - 0.5;      // each leaf's own slight tilt
  float ph = h * 40.0 + dot(uSkyShift, tilt) * 6.0;
  // crinkle: long buckles that run one way across each leaf (its own way), with a crease along each (a bright side
  // and a dark side), and fine beating marks; the pattern belongs to the leaf, so it breaks at every seam
  vec2 grainDir = tilt / max(length(tilt), 1e-3);
  vec2 qg = vec2(dot(q, grainDir), dot(q, vec2(-grainDir.y, grainDir.x)));
  float c1 = itVN(vec2(qg.x * 6.5, qg.y * 1.5 + 0.9 * sin(qg.x * 5.0 + h * 9.0)) + h * 37.0 + 3.0), c2 = itVN(uv * 12.3 + h * 31.0);
  float cr = c1 - 0.5;
  float crease = smoothstep(0.0, 0.035, cr) * (1.0 - smoothstep(0.035, 0.13, cr)) - 0.8 * smoothstep(0.0, 0.035, -cr) * (1.0 - smoothstep(0.035, 0.1, -cr));
  vec3 leaf = col * (1.0 + ((h - 0.5) * 0.36 + (pn - 0.5) * 0.4) * soft);
  // (sheen) one side of the square brighter than the other, by the leaf's tilt; it swings as the eye moves
  float cr2 = c2 - 0.5;
  float dimple = smoothstep(0.0, 0.05, cr2) * (1.0 - smoothstep(0.05, 0.16, cr2)) - smoothstep(0.0, 0.05, -cr2) * (1.0 - smoothstep(0.05, 0.16, -cr2));
  leaf *= 1.0 + (1.25 * dot(q, tilt) * (1.0 + 0.7 * cos(ph)) + 0.3 * cr + 0.36 * crease) * mid + (0.3 * cr2 + 0.2 * dimple) * fine;
  // tarnish lies in soft clouds that cross several squares; each leaf takes it a little differently (the cloud breaks
  // at the seams) and it gathers in the creases. Darker, a little green-blue, and it never glints. Low on the side
  // away from the light it has gone to verdigris in whole pools: the cool side of every view
  float cool = (1.0 - lit) * (1.0 - smoothstep(0.06, 0.46, e));
  vec3 verd = (vec3(0.07, 0.34, 0.31) + uSkyTop * 0.1) * (0.55 + 0.9 * h);
  leaf = mix(leaf, verd, 0.3 * cool * (1.0 - soft));
  float cloud = itVN(uv / 2.7 + 40.3) + (itHash(id + 21.7) - 0.5) * 0.34 - 0.2 * cr * mid + (0.5 - 2.0 * ed) * 0.07;
  float tThr = 0.73 - 0.13 * (1.0 - lit) - 0.5 * cool * (0.4 + 0.9 * pn);
  float tarn = smoothstep(tThr, tThr + 0.1 + 0.3 * wv, cloud) * soft;
  vec3 tcol = mix(leaf * vec3(0.4, 0.62, 0.6), verd * (0.75 + 0.5 * c2 + 0.5 * dot(q, tilt)), clamp(0.15 + 0.8 * cool, 0.0, 1.0));
  leaf = mix(leaf, tcol, tarn * (0.6 + 0.4 * itHash(id + 2.9)));
  // wear: the leaf rubs through to the bole in ragged patches that begin at the corners and seams and eat into the
  // square, more on one side of each leaf; a few squares are mostly gone, most are only nicked. More of it high on the
  // vault, away from the light and in patches
  float wearAmt = (0.02 + 0.34 * smoothstep(0.45, 0.95, e) + 0.24 * (1.0 - lit) * smoothstep(0.06, 0.4, e)) * (0.35 + 1.3 * pn);
  float hw = itHash(id + 33.3);
  float reach = mix((0.05 + 0.3 * hw * hw) * (0.7 + 1.5 * wearAmt), 0.72 + 0.6 * itHash(id + 5.5), step(1.0 - wearAmt, hw));
  vec2 wdir = vec2(itHash(id + 14.1), itHash(id + 27.3)) - 0.5;
  float rag = 0.7 * itVN(uv * 2.9 + 17.0) + 0.3 * c1 + 0.25 * (c2 - 0.5) * fine;
  float wedge = reach * (0.1 + 1.8 * rag) - min(ed * 2.8, cd * 1.4) - 0.9 * dot(q, wdir);
  float ww = 0.02 + 1.5 * wv;
  float worn = smoothstep(-ww, ww, wedge) * soft * (1.0 - 0.6 * tarn);
  // the bole has its own tone, with flecks of leaf left on it; the torn edge of the leaf lifts and catches the light
  vec3 bole = uSkyBole * (0.5 + 0.6 * h + 0.5 * (c2 - 0.5) * fine + 0.3 * cr * mid);
  bole = mix(bole, leaf, 0.55 * smoothstep(0.74, 0.8, c2) * fine);
  float torn = smoothstep(-ww, ww, wedge + 0.045) * (1.0 - smoothstep(-ww, ww, wedge)) * mid * soft;
  leaf = mix(leaf, bole, worn * 0.84) * (1.0 + 0.5 * torn * (1.0 - tarn));
  // squares of fresh leaf stand out bright against the old, most of them round the light
  float freshSq = step(0.95 - 0.07 * lit, itHash(id + 51.9)) * soft * (1.0 - tarn) * (1.0 - worn);
  leaf = mix(leaf, leaf * 1.22 + uSkyHor * 0.14, freshSq);
  // the glint: a leaf catches the light as the eye moves, in a highlight that lies where its tilt puts it
  float gl = sin(ph);
  float hot = mix(1.0, 0.3 + 1.5 * exp(-7.0 * dot(q - tilt * 0.7, q - tilt * 0.7)), mid);
  leaf *= 1.0 + mix(0.16, 0.6, step(0.9, itHash(id + 9.2))) * smoothstep(0.55, 1.0, gl) * hot * soft * (1.0 - tarn) * (1.0 - 0.8 * worn);
  // seams, where one leaf overlaps the next: a dark thread with the bole in it, a thin bright lip on the upper leaf's
  // edge and a soft shadow on the leaf beneath
  float wl = 0.012 + wv * 0.8;
  float sx = dl < dr ? f.x - jl : f.x - 1.0 - jr, sy = db < dt ? f.y - jb : f.y - 1.0 - jt;
  float seamFade = clamp(0.05 / (wv + 1e-4), 0.0, 1.0);
  float kx = mix(0.3, 1.0, gx), ky = mix(0.3, 1.0, gy);
  float lip = max(smoothstep(0.7 * wl, 1.3 * wl, sx) * (1.0 - smoothstep(2.0 * wl, 3.4 * wl, sx)) * kx,
                  smoothstep(0.7 * wl, 1.3 * wl, sy) * (1.0 - smoothstep(2.0 * wl, 3.4 * wl, sy)) * ky);
  float under = max(smoothstep(-9.0 * wl, 0.0, sx) * step(sx, 0.0) * kx, smoothstep(-9.0 * wl, 0.0, sy) * step(sy, 0.0) * ky);
  leaf *= 1.0 + (0.42 * lip * (1.0 - 0.7 * worn) - 0.2 * under) * seamFade * mid;
  float seam = max((1.0 - smoothstep(0.0, wl, ex)) * kx, (1.0 - smoothstep(0.0, wl, ey)) * ky);
  leaf = mix(leaf, mix(uSkySeam * 0.62, uSkyBole, 0.55), seam * 0.62 * seamFade);
  return mix(col, leaf, amt * smoothstep(0.004, 0.03, e));
}
// the leaf's seams and glints alone, for the lacquer of the mirror: the same squares, the same seam hairlines and the same
// glint (its phase, its one-in-ten bright squares, the place of its highlight) as itLeaf above, read without the leaf's
// tone, tarnish or wear. Returns (seam, glint), each weighed as itLeaf weighs it and faded where a pixel cannot resolve it
vec2 itLeafLines(vec3 d){
  d.y = abs(d.y); d = normalize(d);
  float e = d.y;
  vec2 uv = d.xz / (max(d.y, 0.0) + 0.2) * 7.6;
  vec2 fwv = fwidth(uv);
  float wv = max(fwv.x, fwv.y);
  vec2 c0 = floor(uv), f = fract(uv);
  float jl = (itHash(c0 + vec2(0.0, 0.37)) - 0.5) * 0.16, jr = (itHash(c0 + vec2(1.0, 0.37)) - 0.5) * 0.16;
  vec2 id = c0;
  id.x += step(1.0 + jr, f.x) - step(f.x, jl);
  float jb = (itHash(vec2(id.x, c0.y) + vec2(0.61, 0.0)) - 0.5) * 0.16, jt = (itHash(vec2(id.x, c0.y) + vec2(0.61, 1.0)) - 0.5) * 0.16;
  id.y += step(1.0 + jt, f.y) - step(f.y, jb);
  float dl = abs(f.x - jl), dr = abs(1.0 + jr - f.x), db = abs(f.y - jb), dt = abs(1.0 + jt - f.y);
  float gx = step(0.4, itHash(vec2(c0.x + step(dr, dl), c0.y) + 1.7));
  float gy = step(0.4, itHash(vec2(id.x, c0.y + step(dt, db)) + 4.3));
  float h = itHash(id);
  float soft = clamp(0.3 / (wv + 1e-4), 0.0, 1.0), mid = clamp(0.11 / (wv + 1e-4), 0.0, 1.0);
  vec2 q = uv - id - 0.5;
  float ex = min(dl, dr), ey = min(db, dt);
  vec2 tilt = vec2(itHash(id + 3.1), itHash(id + 7.7)) - 0.5;
  float ph = h * 40.0 + dot(uSkyShift, tilt) * 6.0;
  float hot = mix(1.0, 0.3 + 1.5 * exp(-7.0 * dot(q - tilt * 0.7, q - tilt * 0.7)), mid);
  float glint = mix(0.16, 0.6, step(0.9, itHash(id + 9.2))) * smoothstep(0.55, 1.0, sin(ph)) * hot * soft;
  float wl = 0.012 + wv * 0.8;
  float seamFade = clamp(0.05 / (wv + 1e-4), 0.0, 1.0);
  float kx = mix(0.3, 1.0, gx), ky = mix(0.3, 1.0, gy);
  float seam = max((1.0 - smoothstep(0.0, wl, ex)) * kx, (1.0 - smoothstep(0.0, wl, ey)) * ky) * seamFade;
  return vec2(seam, glint) * smoothstep(0.004, 0.03, e);
}
// the foot of the vault: a band of deeper bronze and tarnish in the last degrees (a dark horizon line), three thin
// strata in it, and the light itself: a low white-gold disc in its own bloom
vec3 itSkyFinish(vec3 col, vec3 d, float e){
  float sd2 = max(dot(d, uSkySun), 0.0);
  float s2 = sd2 * sd2, s4 = s2 * s2, s16 = s4 * s4 * s4 * s4, s64 = s16 * s16 * s16 * s16;
  float low = 1.0 - smoothstep(0.0, 0.085, e);
  float fb = fract(e * 60.0);
  float strata = smoothstep(0.25, 0.4, fb) * (1.0 - smoothstep(0.6, 0.75, fb)) * low;
  vec3 bronze = mix(uSkyBole, uSkyTop * uSkyTop, 0.45);
  // away from the light the foot of the vault has gone to verdigris: a cool band on the dark side of every view
  bronze = mix(bronze, vec3(0.05, 0.3, 0.29) + uSkyTop * 0.12, 0.7 * (1.0 - itNearSun(d)));
  float band = low * sqrt(low) * (1.0 - 0.8 * s64);
  col = mix(col, col * 0.2 + bronze * 0.3, band * 0.94);
  col *= 1.0 + 0.22 * strata;
  float disc = smoothstep(0.99915, 0.99945, sd2);
  col += vec3(1.0, 0.95, 0.84) * (2.8 * disc + 0.7 * s64 * s64 * s64 * s64 + 0.16 * s64 + 0.03 * s4) + vec3(1.0, 0.7, 0.3) * (0.2 * s16 + 0.05 * s2 * sd2);
  return col;
}
// detail = 1.0: leaf tiles with seams and glints (sky dome); 0.0: smooth (curved reflectors). Pass a constant.
vec3 itSky(vec3 d, float detail){
  d.y = abs(d.y); d = normalize(d);
  float e = d.y;
  vec3 col = itSkyBase(d, e);
  if (detail > 0.5) col = itLeaf(col, d, e, 1.0);
  return itSkyFinish(col, d, e);
}
// for the flat mirror: amt may vary from pixel to pixel
vec3 itSkyMirror(vec3 d, float amt){
  d.y = abs(d.y); d = normalize(d);
  float e = d.y;
  return itSkyFinish(itLeaf(itSkyBase(d, e), d, e, amt), d, e);
}
// the sea is a mirror: it gives the sky back at every angle, most of all at a glance; it is black only as
// lacquer is, in the images of dark things and on the back of a ripple
float itSeaFresnel(float nv){
  float k = 1.0 - clamp(nv, 0.0, 1.0);
  return 0.32 + 0.68 * k * k;
}
`,te=`
#include <fog_pars_fragment>
uniform vec4 uFogTint;
uniform float uSeaY;
float itFogAt(float d){
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      return 1.0 - exp(-fogDensity * fogDensity * d * d);
    #else
      return smoothstep(fogNear, fogFar, d);
    #endif
  #else
    return 0.0;
  #endif
}
float itFog(){
  #ifdef USE_FOG
    return itFogAt(vFogDepth);
  #else
    return 0.0;
  #endif
}
// a mirror image: haze the object over the whole folded path toward what the mirror shows behind it
// (so a reflection is never crisper than its object), weight it by the mirror's fresnel over lacquer
// black, then haze the surface point itself. glow = the object's own light, which the black still returns.
vec3 itMirrorFog(vec3 body, vec3 glow, vec3 behind, vec3 lacquer, float F, float camY, float fragY){
  #ifdef USE_FOG
    // the image is hazed over its whole folded path toward the haze the mirror itself fades into, so far off the
    // image and the sea round it meet in one tone (never a pale ghost on a darker sea)
    vec3 fc = mix(fogColor, uFogTint.rgb, uFogTint.a);
    float fo = itFogAt(vFogDepth);
    vec3 seen = mix(lacquer, mix(body, behind, 0.25 * fo), F) + glow * (1.0 - fo) * max(F, 0.3);
    return mix(seen, fc, fo);
  #else
    return mix(lacquer, body, F) + glow * max(F, 0.3);
  #endif
}
vec3 itApplyFog(vec3 c){
  #ifdef USE_FOG
    return mix(c, mix(fogColor, uFogTint.rgb, uFogTint.a), itFog());
  #else
    return c;
  #endif
}
`,Se=`
uniform float uPhi, uTwist, uArms;
vec2 itArm(float theta, float rad){
  float q = (theta + uTwist * rad - uPhi) * uArms / 6.2831853;
  float tau = fract(-q);                       // 0 just after the arm front passed, 1 just before the next
  float rise = smoothstep(0.87, 1.0, tau);
  float s = max(rise, exp(-tau * 4.2));
  float fresh = max(rise * rise * rise, exp(-tau * 24.0));
  return vec2(s, fresh);
}
`,Pe=`
attribute vec4 aI;   // x, z, base height, base circumradius
attribute vec4 aJ;   // seed, lock (always needle), theta * dir, radius from centre
uniform float uFlip, uPixH, uField, uSeaY, uTime;
varying vec3 vN, vW;
varying float vFresh, vT, vS, vSeed;
#include <fog_pars_vertex>
${Se}
float prof(float t, float s){
  float dome = 0.88 * sqrt(max(1.0 - t * t, 0.0)) + 0.12 * exp(-t * 14.0);
  float nd = 0.52 * pow(1.0 - t, 3.4) + 0.48 * (1.0 - t) * exp(-t * 10.0);
  return mix(dome, nd, s);
}
void main(){
  float t = position.y;
  float a = 0.5235988 + position.x * 6.2831853;
  vec2 arm = itArm(aJ.z, aJ.w);
  float s = mix(arm.x, 1.0, aJ.y);
  float fld = clamp(uField, 0.0, 1.3);
  float fresh = arm.y * (1.0 - 0.75 * aJ.y) * min(fld, 1.0);
  // attendant columns (lock strictly between 0 and 1) keep a tapering body even as needles; every free
  // spire breathes a little, so the lattice is never quite still
  float sat = step(0.01, aJ.y) * step(aJ.y, 0.99);
  float br = 1.0 + 0.03 * sin(uTime * (0.8 + aJ.x) + aJ.x * 40.0) * step(aJ.y, 0.005);
  float H = aI.z * mix(0.5, 1.5, s) * max(fld, 0.015) * br;
  float R0 = aI.w * smoothstep(0.0, 0.25, fld);
  float t0 = min(t, 0.985);
  float r = (prof(t, s) + sat * 0.2 * pow(max(1.0 - t, 0.0), 0.6)) * R0;
  float dr = (prof(t0 + 0.012, s) - prof(t0, s)) * R0 / 0.012 - sat * 0.12 * R0 * pow(max(1.0 - t0, 1e-3), -0.4);
  float hx = 0.8660254 / cos(mod(a + 0.5235988, 1.0471976) - 0.5235988);   // hexagon -> circle with height
  float m = mix(hx, 0.9, smoothstep(0.0, 0.22, t));
  r *= m;
  vec3 dir = vec3(sin(a), 0.0, cos(a));
  vec3 lp = vec3(aI.x, t * H, aI.y) + dir * r;
  vec3 n = normalize(vec3(dir.x * H, -dr, dir.z * H));
  lp.y *= uFlip; n.y *= uFlip;
  vec4 wp = modelMatrix * vec4(lp, 1.0);
  // keep needles at least ~0.9 px wide so they never crawl
  vec4 cp0 = projectionMatrix * viewMatrix * wp;
  float pix = cp0.w / (projectionMatrix[1][1] * uPixH * 0.5);
  float want = max(r, 0.45 * pix * step(t, 0.999) * step(0.02, fld));
  wp.xyz += mat3(modelMatrix) * dir * (want - r);
  if (fld < 0.02) wp.y = uSeaY - 3.0;           // the field has let go: nothing stands on the mirror
  vW = wp.xyz;
  vN = normalize(mat3(modelMatrix) * n);
  vFresh = fresh; vT = t; vS = s; vSeed = aJ.x;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,Fe=`
uniform vec3 uBlack, uChrome, uTeal;
uniform float uRefl, uSheen, uField, uBeam;
varying vec3 vN, vW;
varying float vFresh, vT, vS, vSeed;
${ve}
${te}
void main(){
  vec3 Ve = normalize(cameraPosition - vW);
  vec3 col;
  {
    // a mirror image under the sea plane is shaded as the spike itself, seen from the mirrored eye: the same gold
    // rim and film, upside down
    vec3 N = normalize(vN);
    vec3 V = Ve;
    if (uRefl > 0.5) { N.y = -N.y; V.y = -V.y; }
    float nv = clamp(dot(N, V), 0.0, 1.0);
    // the mirror copies are coarse (three or four sides), so their normals sweep too far for a rim: keep the sheen only
    if (uRefl > 0.5) nv = max(nv, 0.58);
    vec3 R = reflect(-V, N);
    float k1 = 1.0 - nv, k2 = k1 * k1, k4 = k2 * k2;
// liquid: the whole flank gives the sky back a little, the silhouette edge gives it back whole (a sharp gold rim)
    // a dome is a bead of liquid: its crown gives the leaf back, squares and all; a needle stays lacquer with a rim
    float bead = (1.0 - vS) * smoothstep(-0.1, 0.55, N.y);
    float fr = min(0.07 + 0.15 * bead + 0.25 * k2 + 0.68 * k4 * k1, 1.0);
    vec3 sky = itSky(R, 1.0);
    // black lacquer gives the leaf back as gold, never as white
    sky = min(sky, vec3(1.15)) * mix(vec3(1.0), uSkyTop * 1.35, 0.6);
    // low on a spire a sideways reflection sees the neighbours, not the sky
    float open = mix(mix(0.3, 1.0, smoothstep(0.0, 0.7, vT)), 1.0, smoothstep(0.15, 0.75, R.y));
    open *= mix(1.0, 0.45, smoothstep(0.0, -0.3, R.y));
    col = uBlack * 0.55 + sky * (fr + uSheen * k2 * 0.2) * open;
    // the skirt is the mirror it melts into: over the lowest eighth of its height a spike (dome or needle, bloom or Crown)
    // gives the vault back as the sea does, by the mirror's own fresnel on the mirror's own lacquer, with no neighbours'
    // shade; from an eighth to a quarter of its height that eases to the body's own black above. By the spike's height only
    float skirt = 1.0 - smoothstep(0.125, 0.25, vT);
    float Fs = itSeaFresnel(nv);
    col = mix(col, uBlack * 0.6 * (1.0 - Fs) + sky * Fs, skirt);
    col += (uSkyTop * 1.1 + uSkyHor * 0.45) * k4 * k4 * k2 * open * (0.35 + 0.6 * smoothstep(0.06, 0.4, vT));
    // the smear of light stands on every bead as one hot gold highlight, with a wide warm sheen round it
    float sg = max(dot(R, uSkySun), 0.0), sg2 = sg * sg, sg8 = sg2 * sg2 * sg2 * sg2;
    col += (uSkyHor * 1.25 + uChrome * 0.35) * (sg8 * sg8 * sg8 * 1.7 + sg8 * 0.1) * (0.2 + 0.8 * bead) * mix(0.5, 1.0, open);
    // chrome line down the lit edge: an anisotropic highlight that only cares about the normal's azimuth
    float w = clamp(length(fwidth(N)) * 5.0, 0.0, 1.0);
    vec3 Hh = normalize(V + uSkySun);
    float az = max(dot(normalize(N.xz + 1e-5), normalize(Hh.xz + 1e-5)), 0.0);
    float sp = pow(az, mix(700.0, 60.0, w)) * mix(1.0, 0.16, w) * smoothstep(0.02, 0.2, vT) * (1.0 - 0.6 * smoothstep(0.75, 1.0, N.y));
    col += (uChrome * 0.7 + uSkyHor * 0.6) * sp * 1.9 * mix(0.45, 1.0, open);
    // thin film: teal where the fluid is fresh, and wherever the skin thins toward a needle's tip a little of it
    // stays, turning violet as the film gets thinner still
    // every spike wears a little film: a cool rim inside the gold one, so a spike is a lit body and never a cut-out
    float thin = max(vFresh, 0.2 + 0.3 * vS * smoothstep(0.2, 0.95, vT));
    float film = pow(1.0 - nv, mix(1.9, 2.3, vFresh)) * thin;
    float irid = 0.85 + 0.15 * sin(vT * 30.0 + vSeed * 6.0);
    vec3 violet = vec3(0.5, 0.22, 1.0) * dot(uTeal, vec3(0.45, 0.45, 0.45));
    float vio = 0.42 * smoothstep(0.1, 0.9, 0.5 + 0.5 * sin(vT * 7.0 + nv * 5.0 + vSeed * 19.0)) * (1.0 - 0.5 * vFresh);
    col += mix(uTeal, violet, vio) * (film * 3.0 * irid + vFresh * 0.08);
    col += (uChrome * 0.5 + uSkyHor * 0.9) * smoothstep(0.92, 1.0, vT) * vS * vS * vS * 1.1;      // needle tips: white-gold glints
    // the field column at the Crown's axis lights every flank that is turned to it, cool against the gold
    float rAx = length(vW.xz);
    vec2 toAx = -vW.xz / max(rAx, 1.0);
    float ax = max(dot(N.xz, toAx), 0.0);
    col += uTeal * (ax * ax + 0.4 * k2) * (0.5 * exp(-rAx / 150.0) + 0.16 * exp(-rAx / 520.0)) * clamp(uField, 0.0, 1.0) * uBeam;
  }
  if (uRefl > 0.5) {
    float F = itSeaFresnel(abs(Ve.y));
    vec3 behind = itSky(vec3(Ve.x, abs(Ve.y), Ve.z) * -1.0, 0.0);
    gl_FragColor = vec4(itMirrorFog(col * 0.74, uTeal * vFresh * (0.2 + 0.5 * vT), behind, uBlack * 0.6, F, cameraPosition.y, vW.y), 1.0);
    return;
  }
  gl_FragColor = vec4(itApplyFog(col), 1.0);
}
`;function He(s,b,i){const z=new e.InstancedBufferGeometry,q=[],S=[],p=b.length;for(let F=0;F<p;F++)for(let w=0;w<s;w++)q.push(w/s,b[F],0);for(let F=0;F<p-1;F++)for(let w=0;w<s;w++){const D=F*s+w,L=F*s+(w+1)%s,C=D+s,N=L+s;F===p-2?S.push(D,L,C):S.push(D,L,C,L,N,C)}z.setAttribute("position",new e.Float32BufferAttribute(q,3)),z.setIndex(S);const P=i.length,E=new Float32Array(P*4),$=new Float32Array(P*4);for(let F=0;F<P;F++){const w=i[F];E.set([w.x,w.z,w.h,w.R0],F*4),$.set([w.seed,w.lock,w.theta,w.rad],F*4)}return z.setAttribute("aI",new e.InstancedBufferAttribute(E,4)),z.setAttribute("aJ",new e.InstancedBufferAttribute($,4)),z.instanceCount=P,z.boundingSphere=new e.Sphere(new e.Vector3(0,0,0),700),z}function $e(s,b,i,z,q){const S=s*(.5+z)*(q?1:1.03);if(q&&i<S)return((.88*Math.sqrt(Math.max(1-i/S*(i/S),0))+.12*Math.exp(-(i/S)*14))*(1-z)+(.52*Math.pow(1-i/S,3.4)+.48*(1-i/S)*Math.exp(-(i/S)*10))*z+.2*Math.pow(1-i/S,.6))*b;if(i>=S)return 0;const p=Math.max(0,i/S),P=.88*Math.sqrt(Math.max(1-p*p,0))+.12*Math.exp(-p*14),E=.52*Math.pow(1-p,3.4)+.48*(1-p)*Math.exp(-p*10);return(P+(E-P)*z)*b}const me=`
attribute float aGlow;
attribute float aTone;     // 0 matte magnetite .. 1 mirror fluid / polished chamfer
attribute vec4 aSw;        // sway direction * weight, phase
uniform float uTime;
varying vec3 vN, vW, vO;
varying float vGlow, vTone;
#include <fog_pars_vertex>
void main(){
  vec3 p = position + aSw.xyz * sin(uTime * 1.7 + aSw.w);
  vO = position;
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vW = wp.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  vGlow = aGlow; vTone = aTone;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,pe=`
uniform vec3 uBlack, uMatte, uChrome, uTeal;
uniform float uRefl, uTime, uGrain, uGlowAmp, uBounce;
varying vec3 vN, vW, vO;
varying float vGlow, vTone;
${ve}
${te}
float h3(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float vnoise(vec3 x){
  vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(h3(i), h3(i + vec3(1,0,0)), f.x), mix(h3(i + vec3(0,1,0)), h3(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(h3(i + vec3(0,0,1)), h3(i + vec3(1,0,1)), f.x), mix(h3(i + vec3(0,1,1)), h3(i + vec3(1,1,1)), f.x), f.y), f.z);
}
void main(){
  vec3 Ve = normalize(cameraPosition - vW);
  float pulse = 0.75 + 0.25 * sin(uTime * 1.3 + vO.y * 0.05);
  vec3 glow = uTeal * vGlow * uGlowAmp * pulse;
  vec3 col;
  {
    // a mirror image is shaded as the thing itself, seen from the mirrored eye
    vec3 N = normalize(vN);
    vec3 V = Ve;
    if (uRefl > 0.5) { N.y = -N.y; V.y = -V.y; }
    if (dot(N, V) < 0.0) N = -N;
    float nv = clamp(dot(N, V), 0.0, 1.0);
    vec3 R = reflect(-V, N);
    vec3 sky = itSky(R, 0.0) * mix(1.0, 0.45, smoothstep(0.0, -0.3, R.y));
    float n = vnoise(vO * uGrain) * 0.6 + vnoise(vO * uGrain * 3.7) * 0.4;
    float strata = 0.5 + 0.5 * sin(dot(vO, vec3(0.31, 0.83, 0.2)) * uGrain * 2.2 + n * 5.0);
    // matte magnetite: dome light on a rough dark stone, a weak blurred sheen that the grain breaks up
    float hemi = 0.35 + 0.65 * (N.y * 0.5 + 0.5);
    vec3 matte = uMatte * (0.5 + 0.9 * n) * hemi * uSkyHor * 1.6;
    matte += sky * (0.012 + 0.45 * pow(1.0 - nv, 3.5)) * (0.2 + 0.6 * strata * n);
    // the mirror sea throws the leaf's gold back up: a face that looks down is lit from below, warm, the grain and
    // strata of the stone showing in it (so the underside of a slab is a lit hull, never a flat black shape)
    float dn = clamp(0.45 - 0.55 * N.y, 0.0, 1.0);
    matte += (uSkyTop * 0.75 + uSkyHor * 0.25) * uSkyTop * dn * (0.35 + 0.65 * dn) * (0.3 + 0.9 * n) * (0.55 + 0.45 * strata) * uBounce;
    // mirror fluid / polished edge
    vec3 mir = uBlack * 0.55 + sky * (0.05 + 0.95 * pow(1.0 - nv, 3.4)) * 0.9;
    mir += uChrome * pow(max(dot(R, uSkySun), 0.0), 40.0) * 2.0;
    col = mix(matte, mir, vTone);
    // aTone 2 is chrome (a tether's wound strand, the portal ring's rim): polished metal, chrome white on the black it is
    // laid on, lit on the side turned to the one light and giving the vault back; aTone 0..1 is untouched by this line
    col = mix(col, uChrome * (0.5 + 0.5 * max(dot(N, uSkySun), 0.0)) + sky * 0.5, clamp(vTone - 1.0, 0.0, 1.0));
  }
  if (uRefl > 0.5) {
    float F = itSeaFresnel(abs(Ve.y));
    vec3 behind = itSky(vec3(Ve.x, abs(Ve.y), Ve.z) * -1.0, 0.0);
    gl_FragColor = vec4(itMirrorFog(col * 0.76, glow * 0.8, behind, uBlack * 0.6, F, cameraPosition.y, vW.y), 1.0);
    return;
  }
  gl_FragColor = vec4(itApplyFog(col + glow), 1.0);
}
`;function Je(s,b,i){const z=[],q=[],S=[],p=(o,l,f)=>new e.Vector3(o,l,f),P=p(),E=p(),$=p(),F=p(),w=(o,l,f,h,d)=>{if(P.subVectors(l,o),E.subVectors(f,o),$.crossVectors(P,E),F.copy(o).add(l).add(f),$.dot(F)<0){const m=l;l=f,f=m}z.push(o.x,o.y,o.z,l.x,l.y,l.z,f.x,f.y,f.z),q.push(h,h,h),S.push(d,d,d)},D=(o,l,f,h,d,m)=>{w(o,l,f,d,m),w(o,f,h,d,m)},L=b/75,C=s.int(2,3),N=[{f:.06,d:0}];let M=.15+s.range(0,.04),R=0;for(let o=0;o<C;o++){N.push({f:M,d:R});const l=(o%2===0?-1:1)*s.range(2.2,3.6)*L+(o%2===0?0:R);N.push({f:M+.012,d:l,riser:!0}),R=l,M+=s.range(.2,.27)}N.push({f:Math.min(M,.86),d:R});const _=R+s.range(3,7)*L,x={};for(const o of[1,-1])for(const l of[1,-1])for(const f of[1,-1]){const h=[p(o*b,0,0),p(0,l*i,0),p(0,0,f*b)],d=p().add(h[0]).add(h[1]).add(h[2]).multiplyScalar(1/3),m=p().crossVectors(p().subVectors(h[1],h[0]),p().subVectors(h[2],h[0])).normalize();m.dot(d)<0&&m.negate();const v=c=>h.map(A=>A.clone().lerp(d,c.f).addScaledVector(m,c.d));let T=v(N[0]);x[`${o},${l},${f}`]=T;for(let c=1;c<N.length;c++){const A=v(N[c]),J=N[c].riser?1:0,H=N[c].riser?.2:c%4===1?0:.12;for(let I=0;I<3;I++)D(T[I],T[(I+1)%3],A[(I+1)%3],A[I],J,H);T=A}const V=d.clone().addScaledVector(m,_);for(let c=0;c<3;c++)w(T[c],T[(c+1)%3],V,0,.35)}const G=o=>`${o[0]},${o[1]},${o[2]}`;for(let o=0;o<3;o++)for(let l=o+1;l<3;l++){const f=3-o-l;for(const h of[1,-1])for(const d of[1,-1]){const m=[0,0,0],v=[0,0,0];m[o]=v[o]=h,m[l]=v[l]=d,m[f]=1,v[f]=-1;const T=x[G(m)],V=x[G(v)];D(T[o],T[l],V[l],V[o],0,.9)}}for(let o=0;o<3;o++){const l=(o+1)%3,f=(o+2)%3;for(const h of[1,-1]){const d=[[1,1],[1,-1],[-1,-1],[-1,1]].map(([v,T])=>{const V=[0,0,0];return V[o]=h,V[l]=v,V[f]=T,x[G(V)][o]}),m=p();m.setComponent(o,h*(o===1?i:b)*.985);for(let v=0;v<4;v++)w(d[v],d[(v+1)%4],m,o===1?.7:0,.9)}}const k=new e.BufferGeometry;return k.setAttribute("position",new e.Float32BufferAttribute(z,3)),k.setAttribute("aGlow",new e.Float32BufferAttribute(q,1)),k.setAttribute("aTone",new e.Float32BufferAttribute(S,1)),k.setAttribute("aSw",new e.Float32BufferAttribute(new Float32Array(z.length/3*4),4)),k.computeVertexNormals(),k}async function Ke(s,b){const i=[],z=[],q=[],S=[],p=[],P=(x,G,k,o)=>(i.push(x.x,x.y,x.z),z.push(G),q.push(k),S.push(o[0],o[1],o[2],o[3]),i.length/3-1),E=[0,0,0,0],$=(x,G,k,o,l,f,h)=>{const d=i.length/3;for(let m=0;m<k;m++)for(let v=0;v<o;v++){const T=m/k*W,V=v/o*W,c=x+Math.cos(V)*G;P(new e.Vector3(Math.cos(T)*c,Math.sin(T)*c,Math.sin(V)*G*h),l,f,E)}for(let m=0;m<k;m++)for(let v=0;v<o;v++){const T=d+m*o+v,V=d+(m+1)%k*o+v,c=d+m*o+(v+1)%o,A=d+(m+1)%k*o+(v+1)%o;p.push(T,V,c,c,V,A)}},F=8.1,w=.62;$(F,w,72,10,0,1,1.25),await b();{const x=w+.08,G=Math.acos(1-.6/x),k=6,o=i.length/3;for(let l=0;l<72;l++)for(let f=0;f<=k;f++){const h=l/72*W,d=Math.PI+G*(2*f/k-1),m=F+Math.cos(d)*x;P(new e.Vector3(Math.cos(h)*m,Math.sin(h)*m,Math.sin(d)*x*1.25),1,1,E)}for(let l=0;l<72;l++)for(let f=0;f<k;f++){const h=o+l*(k+1)+f,d=o+(l+1)%72*(k+1)+f;p.push(h,d,h+1,h+1,d,d+1)}}await b();const D=s.sign(),L=150,C=new e.Vector3,N=new e.Vector3,M=new e.Vector3,R=new e.Vector3;for(let x=0;x<L;x++){(x&31)===31&&await b();const G=(x+s.range(-.35,.35))/L*W,k=s.gauss()*.75,o=Math.cos(k),l=Math.sin(k),f=new e.Vector3(Math.cos(G),Math.sin(G),0),h=new e.Vector3(-Math.sin(G),Math.cos(G),0),d=new e.Vector3(f.x*o,f.y*o,l),m=f.clone().multiplyScalar(F).add(new e.Vector3(d.x*w*.8,d.y*w*.8,d.z*w)),v=(.5+2.4*Math.pow(s(),1.6))*(.45+.55*Math.max(0,o)),T=.22+.1*s()+v*.05;M.copy(d).addScaledVector(h,D*.45).normalize(),C.crossVectors(M,new e.Vector3(0,0,1)).normalize(),N.crossVectors(M,C);const V=s()*W,c=5,A=[[0,1],[.16,.42],[.5,.14],[1,0]],J=i.length/3;for(let H=0;H<A.length;H++)for(let I=0;I<c;I++){const K=I/c*W,j=A[H][0],O=A[H][1]*T;R.copy(m).addScaledVector(M,j*v).addScaledVector(h,D*.25*v*j*j).addScaledVector(C,Math.cos(K)*O).addScaledVector(N,Math.sin(K)*O);const se=.07*v*j*j;P(R,0,1,[h.x*se,h.y*se,0,V])}for(let H=0;H<A.length-1;H++)for(let I=0;I<c;I++){const K=J+H*c+I,j=J+H*c+(I+1)%c,O=K+c,se=j+c;H===A.length-2?p.push(K,j,O):p.push(K,j,O,O,j,se)}}$(F+w,.125,72,4,0,2,1);const _=new e.BufferGeometry;return _.setAttribute("position",new e.Float32BufferAttribute(i,3)),_.setAttribute("aGlow",new e.Float32BufferAttribute(z,1)),_.setAttribute("aTone",new e.Float32BufferAttribute(q,1)),_.setAttribute("aSw",new e.Float32BufferAttribute(S,4)),_.setIndex(p),await b(),_.computeVertexNormals(),_}const Ne=`
uniform float uPhiC, uTopY;
// A = (azimuth, width, end height on the central spire, skew); u = 0 at the lodestone's upper point
vec3 itArc(float u, vec4 A){
  float th = u * 3.14159265;
  float sn = max(sin(th), 0.0);
  float y = mix(uTopY, A.z, 0.5 - 0.5 * cos(th));
  float rho = A.y * pow(sn, 1.25) * (1.0 + A.w * cos(th));
  float az = A.x + uPhiC;
  return vec3(sin(az) * rho, y, cos(az) * rho);
}
`,Xe=`
attribute vec4 aA;
attribute vec4 aB;   // phase, speed, size, seed
uniform float uTime, uPixH;
varying vec2 vUv;
varying float vI, vSeed;
#include <fog_pars_vertex>
${Ne}
void main(){
  float u = fract(aB.x + uTime * aB.y);
  vec3 p = itArc(u, aA);
  float sd = aB.w;
  vec3 j = vec3(sin(sd * 91.7 + uTime * 0.6), sin(sd * 57.3 + uTime * 0.45), cos(sd * 33.1 + uTime * 0.5));
  p += j * (1.5 + 5.0 * fract(sd * 7.31)) * sin(u * 3.14159);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  float pix = -mvPosition.z / (projectionMatrix[1][1] * uPixH * 0.5);
  float size = max(aB.z, 1.25 * pix);
  float dim = clamp((aB.z * aB.z) / (size * size), 0.2, 1.0);
  mvPosition.xy += position.xy * size;
  vUv = position.xy;
  float tw = pow(0.5 + 0.5 * sin(uTime * (5.0 + 9.0 * fract(sd * 3.7)) + sd * 100.0), 5.0);
  vI = (0.35 + 3.2 * tw) * dim * smoothstep(0.0, 0.07, u) * smoothstep(1.0, 0.95, u);
  vSeed = sd;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,je=`
uniform vec3 uChrome, uGold, uTeal;
varying vec2 vUv;
varying float vI, vSeed;
${te}
void main(){
  float d2 = dot(vUv, vUv);
  float core = exp(-d2 * 7.0);
  float star = exp(-abs(vUv.x) * 9.0) * exp(-abs(vUv.y) * 2.2) + exp(-abs(vUv.y) * 9.0) * exp(-abs(vUv.x) * 2.2);
  float a = (core + star * 0.55) * (1.0 - smoothstep(0.7, 1.0, d2));
  vec3 c = mix(uChrome, uGold, fract(vSeed * 13.7));
  c = mix(c, uTeal * 1.3, step(0.88, fract(vSeed * 5.3)));
  gl_FragColor = vec4(c * a * vI * 2.6 * (1.0 - itFog()), 1.0);
}
`,Ze=`
attribute vec4 aA;
attribute vec3 aU;   // u along the arc, side (-1 / +1), seed
uniform float uPixH;
varying float vU, vSide, vSeed;
#include <fog_pars_vertex>
${Ne}
void main(){
  vec3 p = itArc(aU.x, aA), p2 = itArc(aU.x + 0.012, aA);
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vec3 tg = normalize(mat3(modelMatrix) * (p2 - p));
  vec3 vd = normalize(cameraPosition - wp.xyz);
  vec3 sdir = normalize(cross(tg, vd));
  vec4 cp0 = projectionMatrix * viewMatrix * wp;
  float pix = cp0.w / (projectionMatrix[1][1] * uPixH * 0.5);
  wp.xyz += sdir * aU.y * max(0.7, 1.15 * pix);
  vU = aU.x; vSide = aU.y; vSeed = aU.z;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,qe=`
uniform vec3 uBlack;
uniform float uTime;
varying float vU, vSide, vSeed;
${te}
void main(){
  float dash = 0.5 + 0.5 * sin(vU * 150.0 - uTime * (5.0 + 3.0 * vSeed) + vSeed * 40.0);
  float a = (0.34 + 0.5 * dash) * (1.0 - vSide * vSide * 0.5) * smoothstep(0.0, 0.05, vU) * smoothstep(1.0, 0.93, vU);
  gl_FragColor = vec4(uBlack, a * (1.0 - itFog()));
}
`,Ce=`
uniform float uFlip, uTopY, uGapY;
varying vec2 vB;      // across (-1..1), height in metres
varying float vK, vAb;
#include <fog_pars_vertex>
void main(){
  float y = position.y;
  vec3 c = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
  vec2 toCam = cameraPosition.xz - c.xz;
  float dxz = length(toCam);
  vec2 f = toCam / max(dxz, 1e-3);
  float above = step(uTopY - 1.0, y);
  float W = mix(mix(170.0, 96.0, smoothstep(0.0, uGapY, y)), 34.0 + (y - uTopY) * 0.02, above);
  vAb = above;
  vec3 wp = c + vec3(-f.y * position.x * W, y * uFlip, f.x * position.x * W);
  vB = vec2(position.x, y);
  // flying up the axis into the portal the strip would turn edge-on and flare: it thins out as the eye comes to the axis
  vK = smoothstep(15.0, 130.0, dxz) * mix(0.5, 1.0, smoothstep(130.0, 520.0, dxz));
  vec4 mvPosition = viewMatrix * vec4(wp, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,Ee=`
uniform vec3 uTeal, uChrome;
uniform float uTime, uTopY, uGapY, uField, uBeam, uFlip;
varying vec2 vB;
varying float vK, vAb;
${te}
void main(){
  float x = vB.x, y = vB.y;
  float x2 = x * x;
  float sh = mix(3.2, 1.0, vAb);      // the strip is wide below the lodestone (a glow among the columns), narrow above it
  float core = exp(-x2 * 90.0 * sh * sh), mid = exp(-x2 * 14.0 * sh * sh), halo = exp(-x2 * 3.2) * (1.0 - x2) * (1.0 - x2);
  // filings ride up the shaft: bright threads that climb, never a flat bar of light
  float th = 0.5 + 0.5 * sin(x * 37.0 + sin(y * 0.021 + x * 5.0) * 2.2);
  float run = 0.5 + 0.5 * sin(y * 0.11 - uTime * 2.6 + th * 4.0 + x * 9.0);
  float flow = 0.62 + 0.38 * th * run + 0.25 * run * run * run * core;
  float gap = exp(-(y - uGapY - 30.0) * (y - uGapY - 30.0) / 2400.0);
  float low = smoothstep(-40.0, 120.0, y) * (0.55 + 0.45 * smoothstep(40.0, uGapY, y));
  float up = step(uTopY, y) * exp(-(y - uTopY) / 620.0);
  float body = mix(low, 0.85 * up + 0.3 * step(uTopY, y) * exp(-(y - uTopY) / 90.0), step(uTopY - 1.0, y));
  float I = (core * 1.25 + mid * 0.55 + halo * 0.34) * flow * body + gap * (mid * 0.7 + halo * 0.5 + core * 0.4);
  vec3 col = (uTeal * vec3(0.7, 1.0, 1.0) + uChrome * 0.22 * core) * I;
  float fo = itFogAt(vFogDepth * 0.55);
  float refl = uFlip < 0.0 ? 0.55 : 1.0;
  gl_FragColor = vec4(col * (1.0 - fo) * vK * refl * clamp(uField, 0.0, 1.0) * uBeam, 1.0);
}
`,Qe=`
varying vec3 vW, vL;
#include <fog_pars_vertex>
void main(){
  vL = position;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vW = wp.xyz;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,et=`
uniform vec3 uBlack;
uniform float uRim, uLatK, uDir;
varying vec3 vW, vL;
${ve}
${Se}
${te}
void main(){
  vec3 V = normalize(cameraPosition - vW);
  vec2 p = vL.xz;
  float r = length(p);
  // the lattice continues past the rim as hexagonal dimples where the field is weak but not zero;
  // the spiral arms run out onto the mirror as a swell in the dimples
  float mask = 1.0 - smoothstep(uRim - 20.0, uRim + 190.0, r);
  vec2 g = vec2(0.0);
  if (mask > 0.001) {
    vec2 arm = itArm(atan(p.x, p.y) * uDir, r);
    vec2 k1 = vec2(1.0, 0.0) * uLatK, k2 = vec2(0.5, 0.8660254) * uLatK, k3 = vec2(-0.5, 0.8660254) * uLatK;
    g = -(k1 * sin(dot(k1, p)) + k2 * sin(dot(k2, p)) + k3 * sin(dot(k3, p)));
    float fw = max(fwidth(p.x), fwidth(p.y)) * uLatK;
    g *= mask * mask * (0.12 + 0.75 * arm.x) / (1.0 + fw * fw * 6.0);
  }
  vec3 N = normalize(vec3(-g.x, 1.0, -g.y));
  float F = itSeaFresnel(dot(N, V));
  vec3 R = reflect(-V, N);
  vec3 col = uBlack * 0.6 * (1.0 - F) + itSkyMirror(R, smoothstep(0.45, 0.12, R.y)) * F;
  gl_FragColor = vec4(itApplyFog(col), 1.0);
}
`,tt=`
varying vec3 vD;
void main(){ vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`,ot=`
varying vec3 vD;
${ve}
void main(){
  vec3 d = normalize(vD);
  vec3 col = itSky(d, 1.0);
  if (d.y < 0.0) col *= 0.9;
  gl_FragColor = vec4(col, 1.0);
}
`;async function at(s,b={}){const i=s.rng.fork?s.rng.fork("iron-tide-crown"):s.rng,z=s.noise,q=(b.palette&&b.palette.length>=7?b.palette:We).map(t=>new e.Color(t)),[S,p,P,E,$,F,w]=q,D=b.sky!==!1,L=b.sea!==!1,C=b.period??24,N=b.armAtU??.8,M=500,R=i.range(23.8,25.4),_=i.sign(),x=i.sign(),G=i.chance(.12)?3:2,k=i.range(.0095,.0145)*i.sign(),o=i.range(1.45,1.95),l=i.range(112,124),f=i.range(240,265),h=i.range(0,W),d=75,m=75*i.range(.8,.98),v=360+d,T=v+d,V=R/Math.sqrt(3),c=x*R*Math.sqrt(3)/4,A=(t,a,u)=>{const n=t*Math.PI/180;return new e.Vector3(x*a*Math.sin(n),u,a*Math.cos(n))},J=330,H=200,I=55*Math.PI/180,K=Math.cos(I),j=Math.sin(I),O=[new e.Vector3(c,25,M+300),new e.Vector3(c,26,M+150),new e.Vector3(c,29,M+100),new e.Vector3(c,46,M+46),new e.Vector3(c,84,M-14),new e.Vector3(c,140,412),new e.Vector3(c,186,345),new e.Vector3(c+x*6,208,292),A(17,218,226),A(40,156,238),A(66,104,243),A(100,80,247),A(135,68,254),A(165,58,261),A(187,51,266),A(H,75*K,J-75*j),A(H,37.5*K,J-37.5*j),new e.Vector3(0,J,0)];await s.yield?.();const ne=new e.CatmullRomCurve3(O,!1,"centripetal").getSpacedPoints(420);await s.yield?.();const oe=[],Me=Math.ceil(M/(R*.8660254)),we=Math.ceil(M/R)+1;for(let t=-Me;t<=Me;t++)for(let a=-we;a<=we;a++){a===-we&&(t&1)===0&&await s.yield?.();const u=t*R*.8660254,n=(a+(t&1?.5:0))*R,r=Math.hypot(u,n);if(r>M||r>.1&&r<R*1.2)continue;const g={x:u,z:n,rad:r,theta:Math.atan2(u,n)*_,seed:i(),lock:0,R0:V,tier:2,h:20};if(r<.1)g.h=200,g.lock=1,g.R0=V*2.15,g.tier=0;else if(r<R*2.1)g.h=i.range(118,150),g.tier=0;else{const y=20+(f-20)*Math.pow(1-r/M,o),B=1-s.core.smoothstep(l-30,l,r),Z=z.n2(u/110+7.3,n/110-2.1);g.h=(y*(1-B)+(22+7*Z)*B)*(1+.1*Z*(1-B)+(g.seed-.5)*.06),g.h*=.3+.7*s.core.smoothstep(M,M-38,r),g.tier=r<160?1:2}oe.push(g)}{const t=i.fork?i.fork("satellites"):i,a=(n,r,g,y)=>{const B=r*Math.sin(n),Z=r*Math.cos(n);oe.push({x:B,z:Z,rad:r,theta:Math.atan2(B,Z)*_,seed:t(),lock:.72,R0:y,tier:0,h:g/1.5,sat:!0})},u=26;for(let n=0;n<u;n++){const r=n%2===1;a(n/u*W+t.range(-.08,.08),r?t.range(36,47):t.range(21,31),r?t.range(268,345):t.range(298,345),r?t.range(10,13):t.range(9,12))}for(let n=0;n<9;n++){const r=42+n*17.5+t.range(-5,5);a(x*r*Math.PI/180,t.range(92,110),t.range(290,392),t.range(8,11))}}await s.yield?.();let ge=1/0;const De=[0,.25,.5,.75,1];for(let t=0;t<oe.length;t++){const a=oe[t];(t&31)===31&&await s.yield?.();let u=1/0;for(let n=0;n<ne.length;n+=3){const r=ne[n],g=r.x-a.x,y=r.z-a.z,B=Math.sqrt(g*g+y*y);B<u&&(u=B)}if(a.tier===2&&u<62&&(a.tier=1),!(u>a.R0+16))for(let n=0;n<40;n++){let r=1/0;for(let g=0;g<ne.length;g++){const y=ne[g],B=y.x-a.x,Z=y.z-a.z,ue=Math.sqrt(B*B+Z*Z);if(ue>a.R0+10)continue;const ee=Math.max(0,y.y-6.5);for(const U of De){if(a.lock===1&&U<1)continue;const Ie=ue-$e(a.h,a.R0,ee,U+(1-U)*a.lock,a.sat);Ie<r&&(r=Ie)}}if(r>=(a.sat?9:6.8)||a.lock===1){r<ge&&(ge=r);break}a.h*=.9}}await s.yield?.();const ye=8.5*Math.PI/180,Ae=30*Math.PI/180,Le=new e.Vector3(-x*Math.sin(Ae)*Math.cos(ye),Math.sin(ye),-Math.cos(Ae)*Math.cos(ye)),Q={uSkyHor:{value:S},uSkyTop:{value:p},uSkySeam:{value:P},uSkySun:{value:Le},uSkyBole:{value:new e.Color(b.bole||"#5e1f10")},uSkyShift:{value:new e.Vector2},uFogTint:{value:new e.Vector4(S.r,S.g,S.b,b.fogTint??(D?1:0))},uPhi:{value:h},uTwist:{value:k},uArms:{value:G},uPhiC:{value:0},uTopY:{value:T},uTime:{value:0},uPixH:{value:720},uSeaY:{value:0},uField:{value:1},uSheen:{value:.3},uBeam:{value:1},uBounce:{value:.5},uBlack:{value:F},uMatte:{value:$},uChrome:{value:E},uTeal:{value:w},uGold:{value:S}},X=(t,a,u={},n={})=>new e.ShaderMaterial({vertexShader:t,fragmentShader:a,fog:!0,uniforms:{...e.UniformsUtils.clone(e.UniformsLib.fog),...Q,...u},...n}),ae=new e.Group;ae.name="iron-tide-crown";const Y=(t,a=0)=>(t.frustumCulled=!1,t.renderOrder=a,ae.add(t),t),Te=[];for(let t=0;t<=16;t++)Te.push(Math.pow(t/16,1.55));const ze=[{radial:24,ts:Te},{radial:12,ts:[0,.03,.08,.16,.3,.5,.75,.93,1]},{radial:8,ts:[0,.08,.5,.866,1]}],Ue=X(Pe,Fe,{uFlip:{value:1},uRefl:{value:0}}),Ve=[];for(let t=0;t<ze.length;t++){const a=ze[t],u=oe.filter(r=>r.tier===t);if(await s.yield?.(),!u.length)continue;const n=Y(new e.Mesh(He(a.radial,a.ts,u),Ue));t<2&&Ve.push(n)}await s.yield?.();const xe=b.reflection!==!1;if(xe){const t=X(Pe,Fe,{uFlip:{value:-1},uRefl:{value:1}},{side:e.DoubleSide});await s.yield?.(),Y(new e.Mesh(He(3,[0,.14,1],oe),t),-.4)}await s.yield?.();const Be=Je(i,m,d);await s.yield?.();const Oe=X(me,pe,{uRefl:{value:0},uGrain:{value:.09},uGlowAmp:{value:1}},{side:e.DoubleSide}),be=Y(new e.Mesh(Be,Oe));be.position.set(0,v,0);let ie=null;xe&&(ie=Y(new e.Mesh(Be,X(me,pe,{uRefl:{value:1},uGrain:{value:.09},uGlowAmp:{value:1}},{side:e.DoubleSide})),-.4),ie.position.set(0,-v,0),ie.scale.y=-1),await s.yield?.();const le=A(H,1,0).normalize().multiplyScalar(K);if(le.y=-j,le.normalize(),b.portalFrame!==!1){const t=await Ke(i,async()=>{await s.yield?.()});await s.yield?.();const a=Y(new e.Mesh(t,X(me,pe,{uRefl:{value:0},uGrain:{value:1.2},uGlowAmp:{value:3},uBounce:{value:.3}},{side:e.DoubleSide})));a.position.set(0,J,0),a.quaternion.setFromUnitVectors(new e.Vector3(0,0,1),le)}await s.yield?.();const Re=i.int(13,17),re=[];for(let t=0;t<2;t++)for(let a=0;a<Re;a++){const u=(a+(t?.5:0))/Re*W+i.range(-.05,.05);re.push(t===0?[u,i.range(125,165),i.range(255,296),i.range(.1,.25)]:[u,i.range(225,285),i.range(150,215),i.range(.15,.32)])}{const a=new e.InstancedBufferGeometry;a.setAttribute("position",new e.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),a.setIndex([0,1,2,0,2,3]);const u=new Float32Array(4400*4),n=new Float32Array(4400*4);for(let r=0;r<4400;r++){(r&1023)===1023&&await s.yield?.();const g=re[r%re.length];u.set(g,r*4);const y=(.05+.03*(r%re.length*.618%1))*(.9+.2*i());n.set([i(),y,i.range(.5,1.1)*(i.chance(.08)?2.2:1),i()],r*4)}a.setAttribute("aA",new e.InstancedBufferAttribute(u,4)),a.setAttribute("aB",new e.InstancedBufferAttribute(n,4)),a.instanceCount=4400,Y(new e.Mesh(a,X(Xe,je,{},{transparent:!0,depthWrite:!1,blending:e.AdditiveBlending})),3)}await s.yield?.();{const a=[],u=[],n=[],r=[];re.forEach((y,B)=>{const Z=a.length/3,ue=i();for(let ee=0;ee<=44;ee++)for(const U of[-1,1])a.push(0,0,0),u.push(...y),n.push(ee/44,U,ue);for(let ee=0;ee<44;ee++){const U=Z+ee*2;r.push(U,U+1,U+2,U+1,U+3,U+2)}});const g=new e.BufferGeometry;g.setAttribute("position",new e.Float32BufferAttribute(a,3)),g.setAttribute("aA",new e.Float32BufferAttribute(u,4)),g.setAttribute("aU",new e.Float32BufferAttribute(n,3)),g.setIndex(r),Y(new e.Mesh(g,X(Ze,qe,{},{transparent:!0,depthWrite:!1,side:e.DoubleSide})),2)}await s.yield?.();{const t=[],a=[],u=[];for(let y=0;y<=12;y++)u.push(-40+400*y/12);const n=u.length;for(let y=0;y<=10;y++)u.push(T+1700*(y/10)*(y/10));u.forEach(y=>{t.push(-1,y,0,1,y,0)});for(let y=0;y+1<u.length;y++){if(y+1===n)continue;const B=y*2;a.push(B,B+1,B+2,B+1,B+3,B+2)}const r=new e.BufferGeometry;r.setAttribute("position",new e.Float32BufferAttribute(t,3)),r.setIndex(a);const g={transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,side:e.DoubleSide};Y(new e.Mesh(r,X(Ce,Ee,{uFlip:{value:1},uGapY:{value:300}},g)),1),xe&&Y(new e.Mesh(r,X(Ce,Ee,{uFlip:{value:-1},uGapY:{value:300}},g)),.5)}await s.yield?.();let ke=null;if(L){const t=new e.CircleGeometry(2600,64);t.rotateX(-Math.PI/2),Y(new e.Mesh(t,X(Qe,et,{uRim:{value:M},uLatK:{value:4*Math.PI/(Math.sqrt(3)*R)},uDir:{value:_}},{depthWrite:!1})),-.5)}D&&(ke=Y(new e.Mesh(new e.SphereGeometry(2800,32,16),new e.ShaderMaterial({vertexShader:tt,fragmentShader:ot,uniforms:Q,side:e.BackSide,depthWrite:!1,depthTest:!1})),-.9));const Ye=new e.Vector3(c,0,300),_e=Math.atan2(c,300)*_+k*Math.hypot(c,300);let ce=null,he=null;const Ge=new e.Vector3,fe=new e.Vector3,de={object:ae,radius:M,height:T,center:new e.Vector3(0,200,0),ground:!1,groundY:0,skyUniforms:Q,spinAt:h,lodestone:be,lodestoneReflection:ie,detailMeshes:Ve,anchors:{portalSeat:{position:new e.Vector3(0,J,0),facing:le.clone(),tilt:55,radius:7},flyThrough:O,flyThroughClearance:ge,rimEntry:O[4].clone(),revealViewpoint:O[0].clone(),orbit:x,lanePoint:Ye,lodestoneCenter:new e.Vector3(0,v,0),lodestoneLowerPoint:new e.Vector3(0,v-d,0),lodestoneUpperPoint:new e.Vector3(0,T,0),centralTip:new e.Vector3(0,300,0),viewpoints:[new e.Vector3(c,25,M+300),new e.Vector3(-x*620,90,520),new e.Vector3(x*150,420,760)],lattice:{spacing:R,rows:"along Z",laneX:c},spin:{dir:_,arms:G,twist:k,period:C,phiLane:0,phi0:h}},setSpin(t){ce=t},setProgress(t){he=t,t==null&&(ce=null)},update(t,a,u){let n=h+a*W/C;he!=null&&(n=_e+(he-N)*(W*42)/C),ce!=null&&he==null&&(n=ce),de.spinAt=n,Q.uPhi.value=n,Q.uPhiC.value=_*n,Q.uTime.value=a,be.rotation.y=_*n,ie&&(ie.rotation.y=_*n);const r=s.renderer&&s.renderer.domElement;r&&r.height&&(Q.uPixH.value=r.height),Q.uSeaY.value=ae.getWorldPosition(Ge).y,u&&(u.getWorldPosition(fe),Q.uSkyShift.value.set(fe.x*.004,fe.z*.004),ke&&(ae.updateWorldMatrix(!0,!1),ke.position.copy(ae.worldToLocal(Ge.copy(fe)))))},dispose(){}};return de.anchors.spin.phiLane=_e,de.update(0,0,null),de}export{Se as IRON_TIDE_ARM_GLSL,je as IRON_TIDE_FILING_FRAG,te as IRON_TIDE_FOG_GLSL,qe as IRON_TIDE_RIBBON_FRAG,ve as IRON_TIDE_SKY_GLSL,pe as IRON_TIDE_SOLID_FRAG,me as IRON_TIDE_SOLID_VERT,Fe as IRON_TIDE_SPIRE_FRAG,at as buildHero};
