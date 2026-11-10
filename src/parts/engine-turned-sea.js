import*as e from"three";import{mergeGeometries as Se}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as me,smoothstep as re}from"../kit/core.js";const Z=Math.PI*2,St=["#8FA8E0","#F1C9C4","#F2E3A0","#B79AD6","#A9D6A0","#D9B25A","#F7F8FF"],Nt=`
uniform vec3 uSunDir;
uniform vec3 uZenith, uBelt, uUnder, uSeaAvg;
vec3 etsSky(vec3 d){
  float h = clamp(d.y, -1., 1.);
  float el = h * 1.5708 * (1.0 + 0.2146 * (1.0 - h * h));          // cheap asin, radians
  float up = smoothstep(-0.012, 0.012, h);
  float belt = smoothstep(-0.02, 0.105, el) * (1.0 - smoothstep(0.105, 0.34, el));   // brightest ~6 deg, gone by ~19
  belt = belt * 0.82 + 0.18 * (1.0 - smoothstep(0.0, 0.5, el));
  vec3 c = mix(uZenith, uBelt, belt);
  // three faint cirrus bars across the zenith, so a top coat has something crisp to mirror
  float bx = d.x / max(0.25, h + 0.25);
  float bars = 0.0;
  bars += (1.0 - smoothstep(0.035, 0.05, abs(bx + 0.42)));
  bars += (1.0 - smoothstep(0.05, 0.07, abs(bx - 0.05)));
  bars += (1.0 - smoothstep(0.03, 0.045, abs(bx - 0.55)));
  c += uBelt * 0.16 * bars * smoothstep(0.45, 0.8, h);
  c = mix(mix(uSeaAvg, uUnder, smoothstep(0.0, 0.6, -h)), c, up);
  return c;
}
float etsSun(vec3 d, float soft){                                    // 3 degree disc (cos 1.5 deg = 0.99966)
  float m = dot(d, uSunDir);
  return smoothstep(0.99966 - soft, 0.99966 + soft * 0.25, m) * step(0.0, d.y);
}
// the sea's own body colour, glass over bright silver: the palette's own periwinkle where the eye looks steeply down, deepening by path length to
// ultramarine at grazing angles (the tint raised to 2.8 and dimmed, so #8FA8E0 lands near #2E418F on screen), where it meets the sky at a hard line
uniform vec3 uSeaTint;
uniform float uTravel;                                               // metres flown, plus the swell's own 0.6 m/s
vec3 etsSeaBase(float nv, vec2 p, float t){
  float gr = smoothstep(0.02, 0.4, nv);
  return exp(log(max(uSeaTint, vec3(0.02))) * mix(2.8, 1.0, gr)) * mix(0.47, 1.1, gr);
}
// THE SEA'S ENGINE TURNING. No derivatives anywhere: d is the rate of a family's phase per pixel, worked out by the caller from the cut's own
// gradient, the range, N.V and uPixelAngle (the brief's w = p N.V / (distance uPixelAngle), taken along and across the line of sight).
// A line is never under two pixels wide; a family whose pitch falls under about six pixels fades out to the satin average.
vec2 etsHair(float f, float dl, float df){                           // x: the lines; y: how far the family has gone to satin
  // dl: the phase's rate per pixel along the family's mean run (it picks the pitch, so a line keeps its pitch along its whole length and never
  // breaks into dashes); df: the rate just here (it holds the width). The cut is re-cut at twice the pitch as it recedes (1.75 m lines up to the
  // 14 m swell cut), so the near and middle sea stay crisp and regular.
  float lv = clamp(log2(max(dl, 1e-5) / 0.5), -5.0, 2.0), n = floor(lv), fr = lv - n;
  float sc = exp2(-n), d0 = df * sc, m0 = dl * sc;
  float keepA = 1.0 - smoothstep(0.97, 1.8, m0 * 0.5), keepB = (1.0 - fr) * (1.0 - smoothstep(0.97, 1.8, m0));
  float la = 1.0 - smoothstep(0.2 * d0, 0.35 * d0, abs(sin(0.25 * f * sc))), lb = 1.0 - smoothstep(0.4 * d0, 0.7 * d0, abs(sin(0.5 * f * sc)));
  // where the wave of the cut crowds the lines locally (seen end on at a grazing angle it is a zigzag finer than the pixels) a two-pixel line would
  // close into a blob: there the line gives way to the satin average instead
  float sA = smoothstep(1.6, 2.6, d0), sB = smoothstep(0.8, 1.3, d0);
  return vec2(max(la * keepA * (1.0 - sA), lb * keepB * (1.0 - sB)), max(1.0 - keepA, sA));
}
// SWELL BANDS OF LIGHT: three bands where the groove families catch the pearl belt. Each is 0.06 of the sine of the depression wide (6.6 percent of
// the frame's height), has a clean edge (px: about a pixel and a half), is born underfoot and races out to the horizon with every metre flown.
float etsBand1(float wv, float c, float px){
  float ctr = 0.045 + 0.96 * (1.0 - c) * (1.0 - c) * (1.0 - c);
  return (1.0 - smoothstep(0.03 - px, 0.03 + px, abs(wv - ctr))) * smoothstep(0.0, 0.05, c) * (1.0 - smoothstep(0.9, 1.0, c));
}
float etsSeaBands(vec3 V, float nv, float px){
  float wv = nv + 0.07 * V.x - 0.045 * V.z, c0 = fract(uTravel / 150.0);
  px = max(px, 1e-4);
  return max(etsBand1(wv, c0, px), max(etsBand1(wv, fract(c0 + 0.3333), px), etsBand1(wv, fract(c0 + 0.6667), px)));
}
// the sea with its cut gone to satin (the far sea, and all of it that the dome draws beyond the sheet's rim): the bands survive in it
vec3 etsSeaSatin(vec3 body, vec3 V, float nv, float px, float cut, float sat){
  float k = cut + 0.13 * sat;                                         // 0.13: the mean cover of the lines where they can still be seen
  vec3 c = body * mix(vec3(1.0), vec3(0.42, 0.5, 0.78), k);           // every cut is a deeper channel of glass: darker and bluer
  // A band is light caught on the engraving, never a sheet over it: inside a band the cut lines themselves turn pearl and run on unbroken over the
  // sea's own colour, whichever way they lie; where the cut has gone to satin the lines too fine to see give their share (0.15, their cover) as a
  // soft sheen through which the sea keeps its enamel colour.
  return mix(c, uBelt * 0.72, (cut + 0.15 * sat) * etsSeaBands(V, nv, px));
}
vec3 etsClamp(vec3 c){                                               // soft clamp at 1.4 linear, hue kept
  float m = max(c.r, max(c.g, c.b));
  float k = m < 1.0 ? 1.0 : (1.0 + 0.4 * (1.0 - exp(-(m - 1.0) / 0.4))) / max(m, 1e-4);
  return c * k;
}
// ENGINE TURNING UNDER THE GLASS at the point p of the sheet (world x, z): one family of long wavy lines, the wave cut. Returns (line, satin).
// Every line is two pixels wide or more; the family is re-cut at twice the pitch as it recedes, and beyond that it fades into the satin average.
// V: unit vector to the eye, nv: its y, dist: range, t: time, pa: the angle one pixel covers. No derivatives.
vec2 etsSeaCut(vec2 p, vec3 V, float nv, float dist, float t, float pa){
  float q1 = 0.21 * p.y - t * 0.126;                               // the cut re-cuts itself: its wave travels along the lines at 0.6 m/s under a surface that never moves
  // the rate of the phase per pixel, analytically: a pixel covers dist * pa metres across the line of sight and that over N.V along it
  vec2 hv = -V.xz; float hl = sqrt(dot(hv, hv) + 1e-8); vec2 fwd = hv / hl, lat = vec2(-fwd.y, fwd.x);
  float fl = dist * pa, fa = fl / max(nv, 0.01);
  // where the wave itself is foreshortened to a few pixels a turn (the lines seen end on, far off) it cannot be drawn: a waving line would break
  // into beads there, so the wave flattens out and the lines run on straight
  float ww = 1.0 - smoothstep(0.35, 0.8, 0.21 * sqrt(lat.y * lat.y * fl * fl + fwd.y * fwd.y * fa * fa + 1e-12));
  float f1 = 3.59 * p.x + 2.4 * ww * sin(q1);
  float gz = 0.504 * ww * cos(q1);
  float a1 = (3.59 * lat.x + gz * lat.y) * fl, b1 = (3.59 * fwd.x + gz * fwd.y) * fa;
  float am = 3.59 * lat.x * fl, bm = 3.59 * fwd.x * fa, aw = 0.356 * ww * lat.y * fl, bw = 0.356 * ww * fwd.y * fa;   // the mean run, and the wave's share of it (rms)
  return etsHair(f1, sqrt(am * am + bm * bm + aw * aw + bw * bw + 1e-12), sqrt(a1 * a1 + b1 * b1 + 1e-12));
}
// the sheet's ground before anything stands mirrored in it: the enamel's body and a little of the tent in the top coat
vec3 etsSeaGround(vec3 V, float nv, float dist){
  float fr = 1.0 - clamp(nv, 0.0, 1.0), f5 = fr * fr; f5 = f5 * f5 * fr;
  return etsSeaBase(nv, vec2(0.0), 0.0) + etsSky(vec3(-V.x, V.y, -V.z)) * 0.05 * mix(0.04 + 0.96 * f5, 1.0, smoothstep(900.0, 2600.0, dist));
}
// a lesser egg standing mirrored in the glass: where the mirrored ray R from the point P of the sheet meets the egg e (x, z, height), the egg upside
// down in its own deep enamel with its gold girdle a bright line; .a is its cover (0 where the ray misses)
vec4 etsEggImage(vec3 P, vec3 R, vec3 e, vec3 tint){
  float eh = max(e.z, 1.0);
  vec3 ir = vec3(1.0 / (0.335 * eh), 1.0 / (0.53 * eh), 1.0 / (0.335 * eh));
  vec3 o = (P - vec3(e.x, 0.47 * eh, e.y)) * ir, dd = R * ir;
  float qa = max(dot(dd, dd), 1e-8), qb = dot(o, dd), qc = dot(o, o) - 1.0, disc = qb * qb - qa * qc;
  if (disc > 0.0 && qb < 0.0 && qc > 0.0) {
    float tt = (-qb - sqrt(max(disc, 0.0))) / qa;
    vec3 hp = o + dd * tt;
    float hy = hp.y * 0.53 + 0.47, facing = clamp(-dot(hp, dd) / max(sqrt(qa), 1e-4), 0.0, 1.0);
    vec3 et = clamp(tint, vec3(0.02), vec3(1.0));
    vec3 ec = et * et * (0.1 + 0.34 * facing) + et * et * 0.12 * smoothstep(0.2, 0.9, hy);
    ec = mix(ec, vec3(0.62, 0.45, 0.16), 1.0 - smoothstep(0.012, 0.022, abs(hy - 0.36)));
    return vec4(ec * mix(vec3(1.0), vec3(0.62, 0.7, 1.0), 0.45), smoothstep(0.0, 0.05, disc / qa));
  }
  return vec4(0.0);
}
// one of the gangway's gold piers standing mirrored in the glass: where the mirrored ray R from the point P of the sheet passes the column e (x, z,
// height), the column upside down in its own gold, a shaft with a wider capital and foot; .a is its cover, soft over one pixel (pa: a pixel's angle).
// The piers rise out of the sea: 'sunk' is how far the column still stands under it, so the image shows what stands above the water and no more
vec4 etsPierImage(vec3 P, vec3 R, vec3 e, float dist, float pa, float sunk){
  vec2 o = P.xz - e.xy, d = R.xz;
  float a = max(dot(d, d), 1e-6), t = -dot(o, d) / a;
  if (t <= 0.0) return vec4(0.0);
  float ys = t * R.y, y = ys + sunk, h = max(e.z, 8.0);            // ys: height above the sea; y: height on the column, which is still sunk by 'sunk'
  vec2 q = o + d * t; float s = sqrt(dot(q, q) + 1e-8);            // the ray's least distance from the column's axis, in plan
  float rad = 1.5 + 1.8 * smoothstep(h - 5.0, h - 1.4, y) + 2.0 * (1.0 - smoothstep(0.2, 3.4, y));   // (the lathe's own profile: shaft 1.5, capital 3.3, foot 3.5)
  float w = max(0.5 * (dist + t) * pa, 0.01);
  float cov = (1.0 - smoothstep(rad - w, rad + w, s)) * smoothstep(-w, w, ys) * (1.0 - smoothstep(h - w, h + w, y));
  float sc = min(s, rad), facing = sqrt(max(1.0 - sc * sc / (rad * rad), 0.0));   // (the coordinate across the column, held to the column before it is squared)
  return vec4(vec3(0.62, 0.45, 0.16) * (0.45 + 0.55 * facing) * mix(vec3(1.0), vec3(0.62, 0.7, 1.0), 0.45), cov);
}
`,kt=`
attribute vec4 aG;      // gore index, da (rad from gore centre), s (m along the meridian from the hinge), spare
attribute vec3 aM;      // closed meridian point: radius, height, psi (lean of the tangent toward the axis)
uniform vec4 uEgg;      // hinge radius, hinge y, gore count, azimuth of gore 0
uniform vec4 uPoseG, uPoseF, uPoseN;   // open pose (theta, straight length, curvature, cross keep): general, front, neighbour
uniform vec3 uE;        // eased opening 0..1: general, front, neighbour
uniform float uHalf;    // 1 = this egg stands half a gore round, so a GAP between two gores faces the front (no lowered front gore: the two beside the gap take the neighbour pose)
uniform vec4 uFan;      // the petals behind the portal stand as a fan: theta, straight length, curvature, amount (0 = all alike)
uniform float uSeed, uTime;
varying vec3 vWPos, vN, vT, vB;
varying vec4 vPat;      // absolute longitude (rad), s, closed radius, gore index
varying vec3 vLoc;      // da, offset.out, front weight
float eh(float n){ return fract(sin(n * 127.1 + uSeed * 31.7) * 43758.5453); }
void etsPose(vec3 off, vec3 nloc, out vec3 P, out vec3 Nn, out vec3 Tt, out vec3 Bb){
  float gi = aG.x, da = aG.y, s = aG.z, n = uEgg.z;
  float wF = (1.0 - uHalf) * (1.0 - step(0.5, gi));
  float wN = mix(step(0.5, gi) * (1.0 - step(1.5, gi)), 1.0 - step(0.5, gi), uHalf) + step(n - 1.5, gi);
  vec4 pp = uPoseG;
  pp.x += (eh(gi + 3.0) - 0.5) * 0.16; pp.z *= 0.8 + 0.4 * eh(gi + 7.0);
  float wB = uFan.w * smoothstep(0.2, 0.8, 0.5 - 0.5 * cos((gi + 0.5 * uHalf) * 6.2831853 / n));
  pp.xyz = mix(pp.xyz, uFan.xyz * vec3(1.0 + (eh(gi + 5.0) - 0.5) * 0.3, 1.0, 1.0), wB);
  pp = mix(pp, uPoseN, wN); pp = mix(pp, uPoseF, wF);
  float e = mix(mix(uE.x, uE.z, wN), uE.y, wF);
  float lag = (eh(gi + 11.0) - 0.5) * 0.12 * (1.0 - wF);
  e = clamp(e * (1.0 + abs(lag)) - max(lag, 0.0), 0.0, 1.0) * step(0.0, s);
  // petals breathe a little once they are out (never the lowered front gore: the camera flies it)
  pp.x += 0.016 * sin(uTime * 0.45 + gi * 1.7) * e * (1.0 - wF);
  pp.z *= 1.0 + 0.06 * sin(uTime * 0.31 + gi * 2.3) * (1.0 - wF);
  float sp = max(s, 0.0);
  // closed pose (exact lathe), in the hinge frame x across, u out, v up
  float psi = aM.z, sd = sin(da), cd = cos(da);
  vec3 Pc = vec3(aM.x * sd, aM.x * cd - uEgg.x, aM.y - uEgg.y);
  vec3 Nc = vec3(cos(psi) * sd, cos(psi) * cd, sin(psi));
  vec3 Bc = vec3(-sin(psi) * sd, -sin(psi) * cd, cos(psi));
  vec3 Tc = vec3(cd, -sd, 0.0);
  float phi = pp.x * e, cph = cos(phi), sph = sin(phi);
  #define ROTX(q) vec3(q.x, q.y * cph + q.z * sph, -q.y * sph + q.z * cph)
  vec3 Pr = ROTX(Pc), Nr = ROTX(Nc), Br = ROTX(Bc), Tr = ROTX(Tc);
  // open pose: a straight run, then a constant-curvature curl
  float sa = min(sp, pp.y), sb = max(sp - pp.y, 0.0), kq = max(pp.z, 2e-4);
  float th = pp.x, th2 = pp.x + kq * sb;
  vec2 c = sa * vec2(sin(th), cos(th)) + vec2(cos(th) - cos(th2), sin(th2) - sin(th)) / kq;
  vec2 t2 = vec2(sin(th2), cos(th2)), n2 = vec2(cos(th2), -sin(th2));
  float dk = da * pp.w, sag = aM.x * (cd - 1.0) * pp.w;
  vec3 No = vec3(sin(dk), n2 * cos(dk));
  vec3 To = vec3(cos(dk), -n2 * sin(dk));
  vec3 Bo = vec3(0.0, t2);
  vec3 Po = vec3(aM.x * sd, c + n2 * sag);
  float m = smoothstep(0.12, 1.0, e);
  vec3 Ph = mix(Pr, Po, m);
  vec3 Nh = mix(Nr, No, m), Bh = mix(Br, Bo, m), Th = mix(Tr, To, m);
  Nh /= max(length(Nh), 1e-4); Bh /= max(length(Bh), 1e-4); Th /= max(length(Th), 1e-4);
  Ph += Th * off.x + Bh * off.y + Nh * off.z;
  vec3 nn = Th * nloc.x + Bh * nloc.y + Nh * nloc.z;
  float az = uEgg.w + gi * 6.2831853 / n;
  vec3 er = vec3(sin(az), 0.0, cos(az)), et = vec3(cos(az), 0.0, -sin(az)), ey = vec3(0.0, 1.0, 0.0);
  #define TOL(q) (et * q.x + er * q.y + ey * q.z)
  P = TOL(Ph) + er * uEgg.x + ey * uEgg.y;
  Nn = TOL(nn); Tt = TOL(Th); Bb = TOL(Bh);
  vPat = vec4(az + da, s, aM.x, gi);
  vLoc = vec3(da, off.z, wF);
}
`,Lt=`
#include <common>
#include <fog_pars_vertex>
POSE_CHUNK
attribute vec4 aUv;     // gold relief: l along, w across (-1..1), spare, spare / gems: stone hash in .x
uniform float uLift;
varying vec4 vUv4;
void main(){
  vec3 off = position;
  // laurel leaves lift in waves that run along each band (real leaves only: uLift > 0)
  off.z += uLift * max(position.y, 0.0) * 0.105 * (0.6 + 0.4 * sin(aG.w * 0.31 - uTime * 2.5));
  vec3 P, Nn, Tt, Bb;
  etsPose(off, normal, P, Nn, Tt, Bb);
  vec4 wp = modelMatrix * vec4(P, 1.0);
  vWPos = wp.xyz;
  mat3 m3 = mat3(modelMatrix);
  vN = m3 * Nn; vT = m3 * Tt; vB = m3 * Bb;
  vUv4 = aUv;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Gt=`
#include <common>
#include <fog_pars_vertex>
attribute vec4 aUv;
attribute vec3 aTan;
varying vec3 vWPos, vN, vT, vB;
varying vec4 vPat; varying vec3 vLoc; varying vec4 vUv4;
void main(){
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWPos = wp.xyz;
  mat3 m3 = mat3(modelMatrix);
  vN = m3 * normal; vT = m3 * aTan; vB = cross(vT, vN);
  vPat = vec4(position.x, position.z, length(position.xz), 0.0);
  vLoc = vec3(0.0); vUv4 = aUv;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,zt=`
#include <common>
#include <fog_pars_fragment>
SKY_CHUNK
uniform float uPixelAngle, uTime;
uniform vec3 uRefC, uRefR, uRefTint;     // one neighbour egg mirrored analytically (radii 0 = none)
uniform float uRefOn;
varying vec3 vWPos, vN, vT, vB;
// MIRROR IMAGES. A copy of a mesh drawn reflected in a plane (the sea, or the lowered gore's gilt face) is shaded as the real thing it mirrors:
// uFlip is -1 on such a copy, uMir its plane in world space (unit normal, offset), uDim how dim the image is.
uniform vec4 uMir;
uniform float uFlip, uDim, uRampImg, uRampOn, uRampL;
uniform vec3 uRampH, uRampA, uRampX;     // the lowered gore in world space: a point on its hinge, the unit direction down it, the unit direction across it
uniform float uOut[17];                  // its half width at 17 stations along its length
vec3 gP;                                 // the shaded point in real space
vec3 mirP(vec3 p){ return p - (1.0 - uFlip) * (dot(uMir.xyz, p) + uMir.w) * uMir.xyz; }
vec3 mirD(vec3 v){ return v - (1.0 - uFlip) * dot(uMir.xyz, v) * uMir.xyz; }
// basketweave squares at three sizes (0.5 m for the close pass, the brief's 2 m, 8 m for the far range): the largest that the pixels still resolve is shown
void etsWeave(vec2 q, float pxm, out float P, out float gap, out float w0){
  float r0 = smoothstep(2.0, 4.5, 0.5 / pxm), r1 = smoothstep(2.0, 4.5, 2.0 / pxm), r2 = smoothstep(2.0, 4.5, 8.0 / pxm);
  w0 = r0; float w1 = (1.0 - r0) * r1, w2 = (1.0 - r0) * (1.0 - r1) * r2;
  vec2 q0 = q * 2.0, q1 = q * 0.5, q2 = q * 0.125;
  P = w0 * mod(floor(q0.x) + floor(q0.y), 2.0) + w1 * mod(floor(q1.x) + floor(q1.y), 2.0) + w2 * mod(floor(q2.x) + floor(q2.y), 2.0) + 0.5 * (1.0 - w0 - w1 - w2);
  vec2 c0 = abs(fract(q0) - 0.5), c1 = abs(fract(q1) - 0.5), c2 = abs(fract(q2) - 0.5);
  gap = w0 * smoothstep(0.42, 0.5, max(c0.x, c0.y)) + w1 * smoothstep(0.45, 0.5, max(c1.x, c1.y)) + w2 * smoothstep(0.47, 0.5, max(c2.x, c2.y));
}
// an image in the gilt ramp: kept only where the eye's ray reaches it through the gore's own outline, tinted gold and broken into the weave's squares
vec3 etsRampImage(vec3 wp, float pixelAngle){
  if (uRampImg < 0.5) return vec3(1.0);
  float sF = dot(uMir.xyz, wp) + uMir.w, sC = dot(uMir.xyz, cameraPosition) + uMir.w;
  if (uRampOn < 0.5 || sF > -0.05 || sC < 0.5) discard;
  vec3 hit = cameraPosition + (wp - cameraPosition) * (sC / max(sC - sF, 1e-3));
  vec3 hr = hit - uRampH; float sA = dot(hr, uRampA), xA = dot(hr, uRampX);
  float t = clamp(sA / max(uRampL, 1.0), 0.0, 1.0) * 16.0, fi = min(floor(t), 15.0); int i = int(fi);
  float hw = mix(uOut[i], uOut[i + 1], t - fi);
  if (sA < 1.0 || sA > uRampL - 0.5 || abs(xA) > hw - 4.3) discard;
  float dh = max(length(hit - cameraPosition), 0.05);
  float P, gap, w0; etsWeave(vec2(xA, sA), max(dh * pixelAngle / max(sC / dh, 0.05), 1e-4), P, gap, w0);
  return vec3(1.0, 0.8, 0.42) * mix(0.7, 1.12, P) * (1.0 - 0.5 * gap);
}
varying vec4 vPat; varying vec3 vLoc; varying vec4 vUv4;
uniform vec4 uPortal;                    // the portal's light: world centre, radius
uniform float uGlow;                     // 0 until the mauve egg cracks, 1 when the corolla is open
const vec3 PORTAL_C = vec3(1.0, 0.9, 0.68);
// the portal seen in a mirror of roughness sig (radians): a soft disc of light, never a hard edge
float etsGlow(vec3 ro, vec3 rd, float sig){
  vec3 oc = uPortal.xyz - ro; float t = dot(oc, rd);
  float d2 = max(dot(oc, oc) - t * t, 0.0);
  float r2 = uPortal.w * uPortal.w, rho2 = max(r2 + sig * sig * t * t, 1e-3);
  return uGlow * step(0.0, t) * (r2 / rho2) * exp(-min(d2 / rho2, 30.0));
}
// its light falling on a face near it (through the glass, so the caller tints it)
float etsNear(vec3 N){
  vec3 L = uPortal.xyz - gP; float d1 = max(sqrt(dot(L, L)), 1e-3); L /= d1;
  float dr = max(d1 - uPortal.w, 0.0);                 // metres out from the ring: the light lies along the edges nearest it and the colour beyond stays deep
  return uGlow * (1.0 / (1.0 + dr * dr / 80.0)) * (0.2 + 0.8 * max(dot(N, L), 0.0));
}
const float SUN_I = 26.0;
vec3 etsImage(){                         // the mirror image under the sea: dimmer, bluer, deepening toward its far end
  float far = smoothstep(10.0, 190.0, gP.y);
  return mix(vec3(1.0), uDim * mix(vec3(1.0), vec3(0.5, 0.56, 0.86), far * (1.0 - uRampImg)), step(uFlip, 0.0));
}
vec3 etsEnv(vec3 ro, vec3 rd){
  vec3 c = etsSky(rd);
  vec3 ir = 1.0 / max(uRefR, vec3(1e-3));
  vec3 o = (ro - uRefC) * ir, d = rd * ir;
  float a = max(dot(d, d), 1e-8), b = dot(o, d), cc = dot(o, o) - 1.0;
  float disc = b * b - a * cc;
  if (uRefOn > 0.5 && disc > 0.0 && b < 0.0 && cc > 0.0) {
    float t = (-b - sqrt(max(disc, 0.0))) / a;
    vec3 nn = (o + d * t) * ir; nn /= max(length(nn), 1e-5);
    vec3 r2 = rd - 2.0 * dot(rd, nn) * nn;
    float edge = smoothstep(0.0, 0.02, disc / a);
    c = mix(c, uRefTint * (0.25 + 0.5 * dot(etsSky(r2), vec3(0.33))) * mix(0.55, 1.0, max(dot(nn, -rd), 0.0)), edge);
  }
  c += PORTAL_C * 1.4 * etsGlow(ro, rd, 0.05);
  return c;
}
// the fine cut seen from afar: a broad pearly lobe, so enamel keeps its body colour away from the bands
vec3 etsWide(vec3 N, vec3 R){
  float t = smoothstep(-0.9, 0.6, 0.6 * R.y + 0.4 * N.y);
  return mix(vec3(0.38, 0.36, 0.45), vec3(0.98, 0.94, 0.86), t);
}
vec3 etsGold(vec3 mir, vec3 tint){
  float lum = dot(mir, vec3(0.3, 0.5, 0.2));
  vec3 warm = vec3(lum * 1.05, lum * 0.98, lum * 0.8);
  mir = mix(warm, mir, 0.45);                          // gold kills most of the tent's blue
  return mir * mix(tint * tint * 1.15, tint, smoothstep(0.1, 0.9, lum));
}
// G: unit groove gradient, S: slope vector (already scaled by line visibility k)
vec3 etsMirror(vec3 N, vec3 V, vec3 G, vec3 S, float k){
  vec3 I = -V;
  vec3 nb = N + 0.35 * S; nb /= max(length(nb), 1e-4);
  vec3 rs = reflect(I, nb);
  vec3 sharp = etsEnv(gP, rs) + SUN_I * etsSun(rs, 0.0012);
  vec3 n1 = N - 0.33 * G; n1 /= max(length(n1), 1e-4);
  vec3 n2 = N + 0.33 * G; n2 /= max(length(n2), 1e-4);
  vec3 r0 = reflect(I, N);
  vec3 satin = (etsEnv(gP, reflect(I, n1)) + etsEnv(gP, r0) + etsEnv(gP, reflect(I, n2))) * 0.3333;
  vec3 Tg = cross(N, G); Tg /= max(length(Tg), 1e-4);
  vec3 H = V + uSunDir; H /= max(length(H), 1e-4);
  float th = dot(Tg, H);
  float st = max(0.0, 1.0 - th * th);
  st *= st; st *= st; st *= st; st *= st; st *= st;
  satin += 1.6 * st * smoothstep(-0.1, 0.5, dot(N, uSunDir));
  return mix(satin, sharp, k);
}
// gilt cut with its groove gradient along Gd: the mirror smeared across the grooves, and the portal's light drawn out into a streak
vec3 etsGilt(vec3 N, vec3 V, vec3 R, vec3 Gd, vec3 e0){
  vec3 n1 = N - 0.3 * Gd; n1 /= max(length(n1), 1e-4);
  vec3 n2 = N + 0.3 * Gd; n2 /= max(length(n2), 1e-4);
  vec3 acc = (etsEnv(gP, reflect(-V, n1)) + e0 + etsEnv(gP, reflect(-V, n2))) * 0.3333;
  vec3 oc = uPortal.xyz - gP; float tt = dot(oc, R);
  vec3 dv = oc - tt * R;
  vec3 Gp = Gd - R * dot(Gd, R); Gp /= max(length(Gp), 1e-4);
  float da = dot(dv, Gp), db2 = max(dot(dv, dv) - da * da, 0.0);
  float r2 = uPortal.w * uPortal.w, tp = max(tt, 0.0);
  float ra2 = max(r2 + 0.5 * tp * tp, 1e-3), rb2 = max(r2 + 0.004 * tp * tp, 1e-3);
  float daw = 5.5 * sqrt(ra2), dac = clamp(da, -daw, daw);          // (the coordinate across the streak, held to the streak's own reach before it is squared)
  float streak = uGlow * step(0.0, tt) * sqrt(sqrt(max(r2 / ra2, 0.0))) * exp(-min(dac * dac / ra2 + db2 / rb2, 30.0));
  return acc + PORTAL_C * 1.5 * streak;
}
// authored line fields. kind: 0 sunburst, 1 barleycorn, 2 moire wave, 3 basketweave, 4 sea swell
// in: a longitude (or x), s meridian (or z), r metric radius, x across in metres. out: gradient (per metre, in T,B), slope, height, phase
void etsCut(float kind, float a, float s, float r, float x, out vec2 g, out vec2 sl, out float h, out float f){
  float ir = 1.0 / max(r, 0.6);
  if (kind < 0.5) {
    float q = s / 3.5;
    f = 96.0 * a + 2.2 * sin(q);
    g = vec2(96.0 * ir, 0.63 * cos(q));
    h = sin(f); sl = cos(f) * g / max(length(g), 1e-4);
  } else if (kind < 1.5) {
    // barleycorn: 48 wavy lines round the egg, alternate lines waving opposite ways, so they close into rows of grains
    float u = 24.0 * a, w = 0.9 * s, su = sin(u), cu = cos(u);
    f = 2.0 * (u + 0.9 * sin(w) * cu);
    g = 2.0 * vec2(24.0 * ir * (1.0 - 0.9 * sin(w) * su), 0.81 * cos(w) * cu);
    h = cos(f); sl = -sin(f) * g / max(length(g), 1e-4);
  } else if (kind < 2.5) {
    float q = 10.0 * a + 0.5 * sin(s * 0.4);
    f = 4.833 * s + 1.6 * sin(q);
    g = vec2(16.0 * cos(q) * ir, 4.833 + 0.32 * cos(q) * cos(s * 0.4));
    h = sin(f); sl = cos(f) * g / max(length(g), 1e-4);
  } else if (kind < 3.5) {
    float par = mod(floor(x * 2.0) + floor(s * 2.0), 2.0);
    f = 62.83 * mix(x, s, par);
    g = mix(vec2(62.83, 0.0), vec2(0.0, 62.83), par);
    // bevel between squares so the weave reads as relief
    vec2 cell = abs(fract(vec2(x, s) * 2.0) - 0.5);
    float gap = smoothstep(0.42, 0.5, max(cell.x, cell.y));
    h = mix(sin(f), -1.0, gap); sl = cos(f) * (1.0 - gap) * g / 62.83;
  } else {
    float q = 0.105 * a;
    f = 0.449 * s + 1.4 * sin(q) - uTime * 0.269;
    g = vec2(0.147 * cos(q), 0.449);
    h = sin(f); sl = cos(f) * g / max(length(g), 1e-4);
  }
}
`,fe=`
uniform vec3 uTint, uInTint;
uniform float uWide, uRim, uBand;                            // how much of the broad pearly lobe the silver ground takes (0.5 = satin, less = a sharper mirror); the top coat's mirror at the rim (1 = full)
uniform float uKind, uInKind, uInGlass, uSea, uCollarR;
uniform vec4 uLE[10];                                 // the lesser eggs that matter most to the eye now, for the sea's mirror: x, z, height, how much of the image shows
uniform vec3 uLT[10];                                 // their enamel
uniform vec3 uPier[4];                                // the gangway's four piers, for the sea's mirror: world x, z, height (kept by update())
uniform float uPierSunk;                              // how far the piers still stand under the sea (the piers' own state, kept by update())
uniform float uInPetal;                               // 1 = the inner faces of the gores that open as petals are enamel too (the lowered front gore and the cup stay gilt)
uniform vec3 uPetalTint;
uniform vec2 uDepth;                                  // glass depth (path multiplier): outer face, inner face
uniform float uFlat;                                  // 0..1: how little the glass deepens toward grazing angles (a pale enamel on broad petals: 0.4, so its rims still deepen)
uniform float uGround;                                // how much of the bright ground shows whatever the cut mirrors (0.35 deep glass .. 0.7 pale glass)
uniform vec2 uCoat;                                   // the top coat's mirror at normal incidence: outer face, inner face
uniform vec2 uLum;                                    // bright silver ground under the glass (0..1): outer face, inner face
void main(){
  float ff = gl_FrontFacing ? 1.0 : -1.0;
  vec3 rt = etsRampImage(vWPos, uPixelAngle);
  if (uRampImg > 0.5 && vLoc.z > 0.5) discard;        // the gore does not mirror itself
  gP = mirP(vWPos);
  vec3 N = mirD(vN) / max(length(vN), 1e-4) * ff;
  vec3 T = mirD(vT) / max(length(vT), 1e-4), B = mirD(vB) / max(length(vB), 1e-4);
  vec3 Vv = mirP(cameraPosition) - gP; float dist = max(length(Vv), 0.05); vec3 V = Vv / dist;
  float NV = max(dot(N, V), 0.0);
  float inner = 0.5 - 0.5 * ff;
  float lz = clamp(vLoc.z, 0.0, 1.0);                 // the front-gore weight, held to its own range (a multisampled edge may read it outside)
  float petal = uInPetal * inner * (1.0 - lz) * smoothstep(0.0, 1.5, vPat.y) * smoothstep(1.7, 2.1, (0.2618 - abs(vLoc.x)) * vPat.z);   // rose enamel inside a gilt margin along each laurel edge
  float kind = mix(mix(uKind, uInKind, inner), uKind, step(0.5, petal));
  vec2 g, sl; float h, f;
  float xm = vPat.z * vLoc.x;
  etsCut(kind, vPat.x, vPat.y, vPat.z, xm, g, sl, h, f);
  float bw = step(2.5, kind) * (1.0 - step(3.5, kind));          // gilt basketweave
  float kq = smoothstep(1.5, 5.0, 0.5 * NV / (dist * uPixelAngle));   // squares resolved on screen
  g = mix(g, mix(vec2(44.4, 44.4), g, kq), bw); sl *= mix(1.0, kq, bw);
  if (uSea > 0.5) {                                   // ripple collar at the waterline: f = range / p
    float rg = vPat.z, wc = 1.0 - smoothstep(uCollarR + 2.0, uCollarR + 11.0, rg);
    float f2 = rg * 4.19;
    vec2 gr = vPat.xy / max(rg, 1e-3);
    g = mix(g, gr * 4.19, wc); sl = mix(sl, cos(f2) * gr, wc); h = mix(h, sin(f2), wc); f = mix(f, f2, wc);
  }
  float gl = max(length(g), 1e-3);
  float w = (6.2832 / gl) * NV / (dist * uPixelAngle);
  float k = smoothstep(2.0, 6.0, w), k2 = smoothstep(2.0, 6.0, w / 9.0);
  vec3 G = T * g.x + B * g.y; G /= max(length(G), 1e-4);
  vec3 S = (T * sl.x + B * sl.y) * k + G * (0.45 * k2 * cos(9.0 * f));
  vec3 R = reflect(-V, N);
  vec3 mir = mix(etsMirror(N, V, G, S, k), etsWide(N, R), mix(uWide, 0.5, inner));
  float glass = mix(mix(1.0, uInGlass, inner), 1.0, petal);
  vec3 tint = mix(mix(uTint, uInTint, inner), uPetalTint, petal);
  float lum = mix(mix(uLum.x, uLum.y, inner), 0.56, petal);
  float cd = 0.5 - 0.5 * h, cd2 = cd * cd;                 // depth of the cut: on a pale enamel (uFlat) only the bottom of each cut deepens, as fine amber lines
  float path = (0.72 / max(mix(mix(0.25, 0.5, max(uSea, lum)), 0.72, uFlat), NV) + (0.5 + 0.9 * lum) * mix(cd, 0.3 * cd2 * cd2, uFlat) * k) * mix(uDepth.x, uDepth.y, inner);
  {                                                   // a bright silver ground that still turns with its own cut: light and dark lines, bands that sweep
    vec3 nL = N + 0.6 * S; nL /= max(length(nL), 1e-4);
    vec3 rL = reflect(-V, nL);
    float gt = smoothstep(-0.55, 0.65, 0.75 * rL.y + 0.25 * nL.y);
    mir = mix(mir, mix(vec3(0.3, 0.29, 0.36), vec3(0.8, 0.78, 0.73), mix(gt, 1.0, uGround)), lum);   // never black from below: the petals are glass, the sky comes through
  }
  vec3 body = exp(log(max(tint, vec3(0.02))) * path);
  vec3 enamel = mir * vec3(0.97, 0.97, 0.95) * body;
  enamel += PORTAL_C * exp(log(max(tint, vec3(0.02))) * min(path, 3.0)) * 0.55 * etsNear(N) * (0.55 + 0.45 * h * k) * (1.0 - uSea) * (1.0 - 0.7 * uFlat);   // (a pale enamel is thin glass: it takes less of the portal's light, or the petals by the ring would burn out)
  float fr = 1.0 - NV; float f5 = fr * fr; f5 = f5 * f5 * fr;
  float F0 = mix(uCoat.x, uCoat.y, inner);
  float F = min(F0 + (1.0 - F0) * f5, min(mix(1.0, 0.34, smoothstep(0.0, 0.4, max(lum, inner * glass))), mix(uRim, 1.0, inner)));   // petals keep their colour at grazing angles
  enamel = mix(enamel, etsEnv(gP, R), F) + F * SUN_I * 1.6 * etsSun(R, 0.0008) * (1.0 - 0.85 * uSea);
  enamel += uBand * (1.0 - inner) * uBelt * 0.3 * smoothstep(-0.04, 0.02, R.y) * (1.0 - smoothstep(0.2, 0.34, R.y)) * (0.7 + 0.3 * h * k);   // glass over silver: the pearl belt, unbent, as one crisp band in the top coat
  float soft = 1.0 - 0.85 * inner * (1.0 - glass);
  vec3 gold = etsGold(mix(etsMirror(N, V, G, S * soft, k), etsWide(N, R), 0.22), tint) * (0.86 + 0.08 * h * k * soft);
  if (bw > 0.5) {                                     // mirror gilt in basketweave: alternate squares are cut at right angles, and each smears the tent, the eggs and the portal's light across its own grooves
    float P, gap, w0; etsWeave(vec2(xm, vPat.y), max(dist * uPixelAngle / max(NV, 0.05), 1e-4), P, gap, w0);
    float kf = w0 * smoothstep(0.08, 0.3, NV);
    vec3 e0 = etsEnv(gP, R);
    vec3 gT = etsGilt(N, V, R, T, e0), gB = etsGilt(N, V, R, B, e0);
    float aT = dot(B, V), aB = dot(T, V);                // grooves that run toward the eye are bright, those across it dark: the squares flick as we move
    float dkS = mix(0.66, 0.38, lz), brS = mix(1.2, 1.0, lz);   // on the stair the squares turned from the light fall to deep gold
    gT *= mix(dkS, brS, clamp(aT * aT * 1.6, 0.0, 1.0)); gB *= mix(dkS, brS, clamp(aB * aB * 1.6, 0.0, 1.0));
    vec3 acc = mix(mix(gT, gB, P), etsWide(N, R), 0.3 - 0.2 * lz);   // with a broad warm lobe, so a face turned to the zenith is still bright gold
    float g5 = 1.0 - NV; g5 *= g5; g5 *= g5;
    vec3 gtint = mix(vec3(1.0, 0.74, 0.3), vec3(1.0), 0.04 + 0.3 * g5);     // gold whitens at grazing angles, so the sky stays blue in it
    float wg = NV + 0.2 * V.x;
    float pg = (wg - (0.3 + 0.1 * sin(uTime * 0.21 + 0.02 * gP.y))) / 0.045;
    pg = clamp(pg, -5.5, 5.5);                         // (across the band, held to the band's own reach before it is squared)
    float pb = exp(-min(pg * pg, 30.0));                // one pearl band that slides as we climb
    vec3 gm = acc * gtint * 1.2 + vec3(0.06, 0.034, 0.003);
    gm += PORTAL_C * vec3(1.0, 0.8, 0.42) * 0.45 * etsNear(N);
    gm += PORTAL_C * vec3(1.0, 0.82, 0.5) * 0.55 * uGlow * lz * exp(-min(min(abs(xm), 30.0) * min(abs(xm), 30.0) / 30.0, 30.0)) * (0.7 + 0.3 * P);   // the portal's light lying down the middle of the lowered gore
    gm += uBelt * vec3(1.0, 0.84, 0.5) * pb * (0.34 + 0.12 * kf * h);
    gm *= (1.0 + 0.16 * kf * h) * (1.0 - 0.55 * gap);
    gm *= mix(vec3(1.0), vec3(0.8, 0.66, 0.4), lz);   // the stair is the brief's gold #D9B25A, not pale cream: under a third of its block of the frame may pass 0.85
    // a chased border along both edges of the lowered gore: beads between two wires
    float ex = (0.5 * 0.5236 - abs(vLoc.x)) * vPat.z;    // metres in from the gore's edge
    float wire = (1.0 - smoothstep(0.0, 0.14, abs(ex - 2.4))) + (1.0 - smoothstep(0.0, 0.14, abs(ex - 3.6)));
    float bead = (1.0 - smoothstep(0.2, 0.34, length(vec2(ex - 3.0, (fract(vPat.y / 0.9) - 0.5) * 0.9)))) * smoothstep(1.5, 4.0, 0.9 * NV / (dist * uPixelAngle));
    gm = mix(gm, gm * 0.45 + vec3(0.02, 0.01, 0.0), clamp(wire, 0.0, 1.0) * 0.8 * smoothstep(1.0, 3.0, 0.3 * NV / (dist * uPixelAngle)));
    gm = mix(gm, acc * 0.4 + uBelt * vec3(1.0, 0.92, 0.7) * (0.5 + 0.5 * NV), bead * 0.9);
    gold = gm;
  }
  vec3 col = etsClamp(mix(gold, enamel, glass));
  float seaA = 1.0, zone = 0.0;
  if (uSea > 0.5) {                                   // engine turning under the glass: three wavy line families, sheen bands by view
    vec2 p = gP.xz;
    col = etsSeaBase(NV, p, uTime) + etsSky(R) * 0.05 * mix(F, 1.0, smoothstep(900.0, 2600.0, dist));   // (far off it is exactly what the dome draws beyond the sheet's rim: no seam under the horizon)
    {                                                 // the mirror: where the reflected ray meets the Egg (an ellipsoid round the whole flower) the glass shows the image standing under it
      vec3 ir = 1.0 / max(uRefR, vec3(1e-3));
      vec3 o = (gP - uRefC) * ir, d = R * ir;
      float qa = max(dot(d, d), 1e-8), qb = dot(o, d), qc = dot(o, o) - 1.0;
      float q = (qb * qb - qa * qc) / qa;
      zone = uRefOn * smoothstep(0.0, 0.3, q) * max(step(qb, 0.0), step(qc, 0.0));
    }
    // the lesser eggs stand mirrored in the glass too: each a crisp upside-down egg in its own enamel, its gold girdle a bright line (the cuts and the sheen cross it like everything else under the glass)
    for (int i = 0; i < 10; i++) { vec4 im = etsEggImage(gP, R, uLE[i].xyz, uLT[i]); col = mix(col, im.rgb, 0.85 * uLE[i].w * im.a); }
    // and the gangway's four piers, in the sheet's own shader like the ten eggs (nothing is laid out from the lens): as strong as the eggs' images
    // near by, thinning into the satin with range; where a pier's image falls the Egg's own image under the glass does not show through it
    for (int i = 0; i < 4; i++) { vec4 im = etsPierImage(gP, R, uPier[i], dist, uPixelAngle, uPierSunk); col = mix(col, im.rgb, 0.85 * im.a * (1.0 - 0.75 * smoothstep(700.0, 2600.0, dist))); zone *= 1.0 - im.a; }
    vec2 h1 = etsSeaCut(p, V, NV, dist, uTime, uPixelAngle);            // engine turning under the glass (the wave cut, in the sky chunk)
    float cut = h1.x, sat = h1.y;
    col = etsSeaSatin(col, V, NV, 1.5 * uPixelAngle, cut, sat);
    // the image is cut into by the engraved lines; the sheen lies on top of it
    seaA = 1.0 - zone * 0.78 * (1.0 - 0.55 * cut);
    col = etsClamp(col) * seaA;
  }
  gl_FragColor = vec4(col * etsImage() * rt, seaA * (1.0 - uRampImg));
  #include <fog_fragment>
}`,Bt=`
void main(){
  vec3 rt = etsRampImage(vWPos, uPixelAngle);
  gl_FragColor = vec4(PORTAL_C * 1.7 * uGlow * rt, 0.0);
  #include <fog_fragment>
}`,J=`
uniform vec3 uTint;
uniform float uMode;
void main(){
  vec3 rt = etsRampImage(vWPos, uPixelAngle);
  gP = mirP(vWPos);
  vec3 N = mirD(vN) / max(length(vN), 1e-4);
  if (!gl_FrontFacing) N = -N;
  vec3 T = mirD(vT) / max(length(vT), 1e-4), B = mirD(vB) / max(length(vB), 1e-4);
  vec3 Vv = mirP(cameraPosition) - gP; float dist = max(length(Vv), 0.05); vec3 V = Vv / dist;
  float NV = max(dot(N, V), 0.0);
  vec3 col;
  if (uMode > 3.5 && uMode < 4.5) {                   // pearl: a soft mirror with an orient
    vec3 R = reflect(-V, N);
    vec3 nu = N + vec3(0.0, 0.5, 0.0); nu /= max(length(nu), 1e-4);
    float fr = 1.0 - NV;
    col = uTint * (0.62 * etsWide(nu, nu) + 0.30 * etsEnv(gP, R));
    col += vec3(0.10, 0.02, 0.07) * fr * fr + vec3(-0.01, 0.03, 0.02) * NV * NV;
    col += SUN_I * 0.06 * etsSun(R, 0.004) + 0.5 * fr * fr * fr * etsEnv(gP, R);
  } else {
    vec3 D = T * vUv4.z + B * vUv4.w; D /= max(length(D), 1e-4);     // the mount's own long direction
    vec3 Wd = cross(N, D); Wd /= max(length(Wd), 1e-4);
    float l = vUv4.x, wv = vUv4.y, sg = wv < 0.0 ? -1.0 : 1.0;
    vec3 G; vec3 S; float per; float bead = 1.0;
    if (uMode < 1.5) {                                // laurel: paired leaves in chevron, a midrib, beaded edges
      float f = 5.712 * l - 3.3 * abs(wv);
      float edge = smoothstep(0.78, 0.9, abs(wv)), rib = 1.0 - smoothstep(0.03, 0.12, abs(wv));
      vec3 gd = D - 0.75 * sg * Wd; gd /= max(length(gd), 1e-4);
      float fb = 15.7 * l;
      G = mix(gd, D, edge); S = mix(cos(f) * gd * (1.0 - rib), 1.3 * cos(fb) * D, edge); per = mix(1.1, 0.4, edge);
      S *= 0.78 + 0.22 * sin(l * 0.31 - uTime * 2.5);      // the lift of the leaves runs along the band at 8 m/s
    } else if (uMode < 2.5) {                         // leaf: veins from the midrib
      float f = 22.0 * l - 5.0 * abs(wv);
      vec3 gd = D - 0.6 * sg * Wd; gd /= max(length(gd), 1e-4);
      G = gd; S = 0.8 * cos(f) * gd; per = 0.12;
    } else if (uMode < 3.5) {                         // chased veins along the piece
      float f = 31.4 * l + 2.0 * sin(6.0 * wv);
      G = D; S = 0.45 * cos(f) * D; per = 0.2;
    } else {                                          // mode 5, beaded wire: a row of gold beads along the rib
      float f = 7.854 * l;
      G = D; S = 1.5 * cos(f) * D; per = 0.8; bead = 0.5 + 0.5 * sin(f);
    }
    float w = per * NV / (dist * uPixelAngle);
    float k = smoothstep(2.0, 6.0, w);
    vec3 mir = mix(etsMirror(N, V, G, S * k, k), etsWide(N, reflect(-V, N)), 0.22);
    col = etsGold(mir, uTint) * 0.92;
    col *= mix(1.0, 0.5 + 0.6 * bead, k);              // the hollows between beads fall dark
    col += PORTAL_C * uTint * 0.8 * etsNear(N);
    float fr = 1.0 - NV;
    col += 0.25 * fr * fr * fr * etsSky(reflect(-V, N));
  }
  gl_FragColor = vec4(etsClamp(col) * etsImage() * rt, 1.0 - uRampImg);
  #include <fog_fragment>
}`,Ft=`
uniform float uCamSpeed;
void main(){
  vec3 rt = etsRampImage(vWPos, uPixelAngle);
  gP = mirP(vWPos);
  vec3 N = mirD(vN) / max(length(vN), 1e-4);
  vec3 T = mirD(vT) / max(length(vT), 1e-4), B = mirD(vB) / max(length(vB), 1e-4);
  vec3 Vv = mirP(cameraPosition) - gP; float dist = max(length(Vv), 0.05); vec3 V = Vv / dist;
  float NV = max(dot(N, V), 0.0);
  vec3 R = reflect(-V, N);
  float hs = vUv4.x, hf = vUv4.y;
  vec3 col = etsEnv(gP, R) * vec3(0.92, 0.95, 1.0) * (0.55 + 0.45 * hf);
  // inner light: what the pavilion throws back, cool and dim
  col += vec3(0.36, 0.40, 0.48) * (0.3 + 0.7 * fract(hf * 7.31)) * (0.4 + 0.6 * NV);
  float n = clamp(2.5 * dist / (uCamSpeed + 0.15 * dist + 1e-3), 1.0, 24.0);
  float ang = dot(V, T) * 0.9 + dot(V, B) * 0.6 + dot(V, N) * 0.3;
  float ph = 6.2832 * (n * ang * 0.5 + hf * 3.0 + hs) + uTime * (0.35 + 0.5 * hs);
  float lb = 0.5 + 0.5 * cos(ph);
  lb *= lb; lb *= lb; lb *= lb; lb *= lb;
  vec3 fire = mix(vec3(1.0, 0.97, 0.92), 0.5 + 0.5 * cos(6.2832 * (hf * 5.0 + vec3(0.0, 0.33, 0.67))), 0.35);
  col += fire * lb * (4.0 + 4.0 * fract(hs * 9.7 + hf * 3.1)) * step(0.35, fract(hf * 13.7 + hs * 5.0));
  col += SUN_I * 0.5 * etsSun(R, 0.002);
  gl_FragColor = vec4(col * etsImage() * rt, 1.0 - uRampImg);
  #include <fog_fragment>
}`;function Ne(a){const h={...a},y=(R,c)=>{const n=[[a.R,a.Y,0,0]];let d=0,v=a.R,k=a.Y;for(let V=1;V<=2048;V++){const T=V/2048*Math.PI/2,M=a.R*Math.cos(T),b=a.Y+c*R*Math.sin(T);d+=Math.hypot(M-v,b-k),v=M,k=b,n.push([M,b,c*Math.atan2(a.R*Math.sin(T),R*Math.cos(T)),d])}const q=d,w=new Float32Array(257*3);let x=0;for(let V=0;V<=256;V++){const T=V/256*q;for(;x<2047&&n[x+1][3]<T;)x++;const M=n[x],b=n[x+1],l=me((T-M[3])/Math.max(b[3]-M[3],1e-9),0,1);w[V*3]=M[0]+(b[0]-M[0])*l,w[V*3+1]=M[1]+(b[1]-M[1])*l,w[V*3+2]=M[2]+(b[2]-M[2])*l}return{L:q,tab:w}};return h.upT=y(a.up,1),h.dnT=y(a.dn,-1),h.L=h.upT.L,h.mer=R=>{const c=R>=0?h.upT:h.dnT,g=me(Math.abs(R)/c.L,0,1)*256,n=Math.min(255,Math.floor(g)),d=g-n,v=c.tab;return[v[n*3]+(v[n*3+3]-v[n*3])*d,v[n*3+1]+(v[n*3+4]-v[n*3+1])*d,v[n*3+2]+(v[n*3+5]-v[n*3+2])*d]},h.sAtY=R=>{let c=0,g=h.dnT.L;for(let n=0;n<30;n++){const d=(c+g)/2;h.mer(-d)[1]>R?c=d:g=d}return-c},h.sector=Z/a.n,h}class se{constructor(){this.p=[],this.n=[],this.g=[],this.m=[],this.u=[],this.idx=[],this.count=0,this.wave=0}v(m,h,y,R,c,g,n,d,v,k,q=0,w=0,x=0,V=1){const T=m.mer(R);return this.p.push(c,g,n),this.n.push(d,v,k),this.g.push(h,y,R,this.wave),this.m.push(T[0],T[1],T[2]),this.u.push(q,w,x,V),this.count++}quad(m,h,y,R){this.idx.push(m,h,y,m,y,R)}tri(m,h,y){this.idx.push(m,h,y)}geometry(m,h){const y=new e.BufferGeometry;return y.setAttribute("position",new e.Float32BufferAttribute(this.p,3)),y.setAttribute("normal",new e.Float32BufferAttribute(this.n,3)),y.setAttribute("aG",new e.Float32BufferAttribute(this.g,4)),y.setAttribute("aM",new e.Float32BufferAttribute(this.m,3)),y.setAttribute("aUv",new e.Float32BufferAttribute(this.u,4)),y.setIndex(this.count>65535?new e.Uint32BufferAttribute(this.idx,1):new e.Uint16BufferAttribute(this.idx,1)),y.boundingSphere=new e.Sphere(new e.Vector3(0,h,0),m),y}async geometryAsync(m,h,y){const R=new e.BufferGeometry;for(const[c,g,n]of[["position",this.p,3],["normal",this.n,3],["aG",this.g,4],["aM",this.m,3],["aUv",this.u,4]])R.setAttribute(c,new e.Float32BufferAttribute(g,n)),await m.yield();return R.setIndex(this.count>65535?new e.Uint32BufferAttribute(this.idx,1):new e.Uint16BufferAttribute(this.idx,1)),R.boundingSphere=new e.Sphere(new e.Vector3(0,y,0),h),await m.yield(),R}get tris(){return this.idx.length/3}}async function Qe(a,m,h,y,R,c,g,n,d=m.n){const v=new se,k=m.n,q=m.sector/2;for(let w=0;w<d;w++){const x=(V,T,M,b,l)=>{const P=v.count;for(let L=0;L<=T;L++){const G=L/T,F=M+(b-M)*(M<0?G:1-(1-G)*(1-G)*.35-(1-G)*.65);for(let U=0;U<=V;U++)v.v(m,w,(U/V*2-1)*l,F,0,0,0,0,0,1)}for(let L=0;L<T;L++)for(let G=0;G<V;G++){const F=P+L*(V+1)+G;v.quad(F,F+1,F+V+2,F+V+1)}};x(h,y,g,0,q),await a.yield(),x(R,c,0,m.L,q-n/m.R),await a.yield()}return v}function de(a,m,h,y,R,c=0,g=-1,n=!1){const d=m.n,v=m.sector,k=n?[[-1,0],[-.5,.87],[.5,.87],[1,0],[.5,-.87],[-.5,-.87],[-1,0]]:[[-1,0],[-.62,.74],[0,1],[.62,.74],[1,0]],q=k.length-1;let w=null,x=c;const V=M=>(Math.round((M-m.az0)/v)%d+d)%d,T=(M,b,l,P,L)=>{let G=b-m.az0-M*v;G-=Math.round(G/Z)*Z;const F=a.count,U=L,E=-P;for(const[I,W]of k){const z=n?W:W+.25,te=Math.hypot(I*.8,z)||1;a.v(m,M,G,l,U*I*y,E*I*y,(n?0:.03)+W*R,U*I*.8/te,E*I*.8/te,z/te,x,n?I*.7:I,P,L)}return F};for(let M=0;M<h.length;M++){const b=h[M],l=h[Math.min(M+1,h.length-1)],P=h[Math.max(M-1,0)],L=Math.max(m.mer(b.s)[0],.3);let G=L*(l.a-P.a),F=l.s-P.s;const U=Math.hypot(G,F)||1;G/=U,F/=U;const E=g>=0?g:V(b.a);if(w&&w.gi!==E){const W=m.az0+(w.gi+((E-w.gi+d)%d===1?.5:-.5))*v;let z=w.a-W;z-=Math.round(z/Z)*Z;let te=b.a-W;te-=Math.round(te/Z)*Z;const Pe=me(z/(z-te||1e-6),0,1),ne=w.s+(b.s-w.s)*Pe,ve=w.a+(b.a-w.a)*Pe;x+=Math.hypot(L*(ve-w.a),ne-w.s);const ke=T(w.gi,ve,ne,G,F);for(let B=0;B<q;B++)a.quad(w.base+B,w.base+B+1,ke+B+1,ke+B);w={gi:E,a:ve,s:ne,base:T(E,ve,ne,G,F)}}w&&(x+=Math.hypot(L*(b.a-w.a),b.s-w.s));const I=T(E,b.a,b.s,G,F);if(w)for(let W=0;W<q;W++)a.quad(w.base+W,w.base+W+1,I+W+1,I+W);w={gi:E,a:b.a,s:b.s,base:I}}return x}function De(a){const m=a.index?a.toNonIndexed():a,h={pos:Array.from(m.attributes.position.array),nrm:Array.from(m.attributes.normal.array),fh:null};return a.dispose(),m!==a&&m.dispose(),h}function qt(){const a=[],m=[0,0,.62],h=[],y=[];for(let n=0;n<6;n++){const d=n/6*Z;h.push([.52*Math.cos(d),.52*Math.sin(d),.42])}for(let n=0;n<12;n++){const d=(n-.5)/12*Z;y.push([Math.cos(d),Math.sin(d),.06])}for(let n=0;n<6;n++){const d=(n+1)%6;a.push([m,h[n],h[d]]),a.push([h[n],y[(2*n+1)%12],h[d]]),a.push([h[n],y[2*n],y[(2*n+1)%12]]),a.push([h[d],y[(2*n+1)%12],y[(2*n+2)%12]])}const R=[],c=[],g=[];return a.forEach((n,d)=>{const[v,k,q]=n,w=k[0]-v[0],x=k[1]-v[1],V=k[2]-v[2],T=q[0]-v[0],M=q[1]-v[1],b=q[2]-v[2];let l=x*b-V*M,P=V*T-w*b,L=w*M-x*T;const G=Math.hypot(l,P,L)||1;l/=G,P/=G,L/=G;const F=L<0,U=F?[v,q,k]:[v,k,q];for(const E of U)R.push(E[0],E[1],E[2]),c.push(F?-l:l,F?-P:P,F?-L:L),g.push(d*.61803%1)}),{pos:R,nrm:c,fh:g}}function It(){const a=[],h=[];for(let c=0;c<=5;c++){const g=c/5,n=.5*Math.pow(Math.sin(Math.PI*Math.min(.999,.06+g*.94)),.75)*(1-.25*g),d=.1+.34*g-.16*g*g;h.push([[-n,g,d+.13*n*2],[0,g,d+.05],[n,g,d+.13*n*2]])}const y=(c,g,n)=>a.push(...c,...g,...n);for(let c=0;c<5;c++)for(let g=0;g<2;g++){const n=h[c][g],d=h[c][g+1],v=h[c+1][g+1],k=h[c+1][g];y(n,d,v),y(n,v,k)}const R=new e.BufferGeometry;return R.setAttribute("position",new e.Float32BufferAttribute(a,3)),R.computeVertexNormals(),De(R)}function Ct(){const a=[new e.Vector2(1,0),new e.Vector2(1.22,.02),new e.Vector2(1.2,.16),new e.Vector2(1.06,.24),new e.Vector2(.98,.12)],m=new e.LatheGeometry(a,8);return m.rotateX(Math.PI/2),De(m)}function le(a,m,h,y,R,c,g,n,d,v,k,q){const w=Math.cos(n),x=Math.sin(n),V=m.mer(R),T=c.pos.length/3,M=a.count;for(let b=0;b<T;b++){const l=c.pos[b*3]*g[0],P=c.pos[b*3+1]*g[1],L=c.pos[b*3+2],G=c.nrm[b*3],F=c.nrm[b*3+1],U=c.nrm[b*3+2];a.p.push(l*w-P*x,l*x+P*w,L*g[2]+d),a.n.push(G*w-F*x,G*x+F*w,g[2]<0?-U:U),a.g.push(h,y,R,a.wave),a.m.push(V[0],V[1],V[2]),c.fh?a.u.push(v,c.fh[b],0,1):q?a.u.push(P,l*2,-x,w):a.u.push(v+P*.3,k+l,-x,w),a.idx.push(g[2]<0&&b%3?M+b+(b%3===1?1:-1):M+b)}a.count+=T}function ft(a,m,h,y,R,c,g,n,d){let v=-1;for(let k=R;k<=c+1e-6;k+=g){const q=a.count,w=y(k);for(let x=0;x<=6;x++){const V=x/6*Z,T=Math.cos(V),M=Math.sin(V);a.v(m,h,w,k,T*d,0,n+M*d,T,0,M,k,T,0,1)}if(v>=0)for(let x=0;x<6;x++)a.quad(v+x+1,v+x,q+x,q+x+1);v=q}}function dt(a,m,h,y){const[R,c,g]=a.mer(y);if(y<=0)return[R,c];const n=m[0]*h,d=R-a.R,v=c-a.Y,k=d*Math.cos(n)+v*Math.sin(n),q=-d*Math.sin(n)+v*Math.cos(n),w=Math.min(y,m[1]),x=Math.max(y-m[1],0),V=Math.max(m[2],2e-4),T=m[0],M=T+V*x,b=w*Math.sin(T)+(Math.cos(T)-Math.cos(M))/V,l=w*Math.cos(T)+(Math.sin(M)-Math.sin(T))/V,P=re(.12,1,h);return[a.R+k+(b-k)*P,a.Y+q+(l-q)*P,g]}function $e(a,m=1){const h=a.attributes.position,y=h.count,R=new Float32Array(y*3),c=new Float32Array(y*4),g=a.attributes.uv;for(let n=0;n<y;n++){const d=h.getX(n),v=h.getZ(n),k=Math.hypot(d,v);k>1e-4?(R[n*3]=v/k,R[n*3+2]=-d/k):R[n*3]=1,c[n*4]=Math.atan2(d,v+1e-9)*Math.max(k,.5)*m,c[n*4+1]=g?g.getY(n)*2-1:0,c[n*4+2]=1,c[n*4+3]=0}return a.setAttribute("aTan",new e.BufferAttribute(R,3)),a.setAttribute("aUv",new e.BufferAttribute(c,4)),a.deleteAttribute("uv"),a}async function _t(a,m={}){const h=a.rng,y=(m.palette&&m.palette.length>=7?m.palette:St).map(t=>new e.Color(t)),R=me(m.detail??a.quality?.detail??1,.6,1),c=(t,o=1)=>new e.Vector3(t.r*o,t.g*o,t.b*o),[g,n,d,v,,k,q]=y,w=h()<.5?-1:1,x=2.2+h()*.9,V=h()*10,T=.94+h()*.12,M=.85+h()*.3,b=h()*Z;await a.yield();const l=Ne({n:12,R:60,Y:62,up:108,dn:70,az0:0});await a.yield();const P=Ne({n:12,R:36,Y:68,up:80,dn:23,az0:0});await a.yield();const L=Ne({n:8,R:20,Y:77,up:5,dn:7.5,az0:0}),G=1.5,F=Ne({n:2,R:5.4,Y:119.6,up:31,dn:1.6,az0:130*Math.PI/180});await a.yield();const U=Ne({n:2,R:5.4,Y:119.6,up:31,dn:1.6,az0:230*Math.PI/180});await a.yield();const E={rose:{G:[.74*T,.36*l.L,M/50,1],F:[1.841,l.L,0,.22],N:[1,.42*l.L,M/62,1]},prim:{G:[.64*T,.5*P.L,M/70,1],F:[1.7,2,1/18,.6],N:[.95,.45*P.L,M/70,1],B:[.14,.75*P.L,1/90,1]},mauv:{G:[1,L.L,1/400,1],F:[1.75,1.5,1/9.6,.6],N:[1.3,L.L,1/400,1]},wing:{G:[.95,.7*F.L,1/46,.7],F:[.95,.7*F.L,1/46,.7],N:[.95,.7*F.L,1/46,.7]}},I={uSunDir:{value:new e.Vector3(0,.6157,.788)},uZenith:{value:c(new e.Color("#7F97D8"),.45)},uBelt:{value:c(new e.Color("#FFF3E0"),1.3)},uUnder:{value:c(new e.Color("#1B2550"),.5)},uSeaAvg:{value:c(new e.Color("#6E84CC"),.8)},uSeaTint:{value:c(g)},uPixelAngle:{value:.0015},uTime:{value:0},uTravel:{value:0},uCamSpeed:{value:10},uPortal:{value:new e.Vector4(0,94,0,17)},uGlow:{value:0},uLE:{value:Array.from({length:10},()=>new e.Vector4(0,0,1,0))},uLT:{value:Array.from({length:10},()=>new e.Vector3(1,1,1))},uPier:{value:Array.from({length:4},()=>new e.Vector3(0,0,0))},uPierSunk:{value:62},uRampOn:{value:0},uRampL:{value:1},uRampH:{value:new e.Vector3},uRampA:{value:new e.Vector3(0,0,1)},uRampX:{value:new e.Vector3(1,0,0)},uOut:{value:new Array(17).fill(0)}},W=(t,o)=>({uEgg:{value:new e.Vector4(t.R,t.Y,t.n,t.az0)},uPoseG:{value:new e.Vector4(...o.G)},uPoseF:{value:new e.Vector4(...o.F)},uPoseN:{value:new e.Vector4(...o.N)},uE:{value:new e.Vector3(0,0,0)},uSeed:{value:V},uFan:{value:o.B?new e.Vector4(...o.B):new e.Vector4(0,0,0,0)},uHalf:{value:t.az0?1:0}}),z={rose:W(l,E.rose),prim:W(P,E.prim),mauv:W(L,E.mauv),wingR:W(F,E.wing),wingL:W(U,E.wing)};z.mauv.uE.value.set(1,1,1),z.wingR.uE.value.set(1,1,1),z.wingL.uE.value.set(1,1,1);const te=new e.Vector4(0,1,0,0),Pe=new e.Vector4(0,1,0,0),ne=[],ve=(t,o,s)=>{const i={uRefC:{value:new e.Vector3},uRefR:{value:new e.Vector3},uRefTint:{value:s||new e.Vector3(1,1,1)},uRefOn:{value:t?1:0}};return t&&ne.push({u:i,c:t,r:o}),i},ke=[],B=(t,o,s,i,u=e.FrontSide)=>{const r=new e.ShaderMaterial({uniforms:{...e.UniformsUtils.clone(e.UniformsLib.fog),...I,...o||{},...ve(...i||[null]),uLift:{value:0},uFlat:{value:0},uDepth:{value:new e.Vector2(1,1)},uLum:{value:new e.Vector2(0,0)},uCoat:{value:new e.Vector2(.04,.04)},uGround:{value:.35},uInPetal:{value:0},uPetalTint:{value:new e.Vector3(1,1,1)},uWide:{value:.5},uRim:{value:1},uBand:{value:0},uFlip:{value:1},uDim:{value:1},uMir:{value:te},uRampImg:{value:0},...s},vertexShader:o?Lt.replace("POSE_CHUNK",kt):Gt,fragmentShader:zt.replace("SKY_CHUNK",Nt)+t,fog:!0,side:u});return ke.push(r),r},Ee=(t,o)=>c(t.clone().multiplyScalar(o)),et=.3*d.r+.5*d.g+.2*d.b,tt=me(et/.72,.45,1),pe=re(.4,.7,et),$=new e.Vector3(1,.74,.28),H=new e.Group;H.name="great-egg";const O=(t,o,s)=>{const i=new e.Mesh(t,o);return i.name=s,i.frustumCulled=!1,H.add(i),i};let K=0;const Le=m.apron!==!1,_e={uFlip:{value:-1},uDim:{value:.9}},Me=m.rampMirror===!0,Oe=()=>({uFlip:{value:-1},uDim:{value:.92},uMir:{value:Pe},uRampImg:{value:1}}),Ge=1.841,D=new e.Vector3(0,Math.sin(Ge),-Math.cos(Ge)),at=new e.Vector3(0,62,60),Ue=-D.dot(at),vt=new e.Matrix4().set(1-2*D.x*D.x,-2*D.x*D.y,-2*D.x*D.z,-2*Ue*D.x,-2*D.y*D.x,1-2*D.y*D.y,-2*D.y*D.z,-2*Ue*D.y,-2*D.z*D.x,-2*D.z*D.y,1-2*D.z*D.z,-2*Ue*D.z,0,0,0,1),We=(t,o,s)=>{if(!Me)return null;const i=O(t,o,s);return i.matrixAutoUpdate=!1,i.matrix.copy(vt),i.renderOrder=-7.5,K+=(t.index?t.index.count:t.attributes.position.count)/3,i},Ye=(t,o,s)=>{if(!Le)return null;const i=O(t,o,s);return i.scale.y=-1,i.renderOrder=-9,K+=(t.index?t.index.count:t.attributes.position.count)/3,i};await a.yield();const ae=l.sAtY(-1.5),ge=l.L*.93;{const t=await Qe(a,l,6,20,16,48,ae,.14);K+=t.tris,await a.yield();const o=()=>({uWide:{value:.42},uRim:{value:.5},uBand:{value:1},uInPetal:{value:1},uPetalTint:{value:c(n).lerp(new e.Vector3(1,.93,.9),.2)},uTint:{value:c(n)},uInTint:{value:$},uKind:{value:0},uInKind:{value:3},uInGlass:{value:0},uSea:{value:0},uCollarR:{value:0}}),s=[new e.Vector3(0,97,0),new e.Vector3(36,52,36),Ee(d,.9)],i=await t.geometryAsync(a,210,80),u=O(i,B(fe,z.rose,o(),s,e.DoubleSide),"rose-shell");if(Me){u.renderOrder=-7;const r=u.material;r.blending=e.CustomBlending,r.blendSrc=e.DstAlphaFactor,r.blendDst=e.OneMinusDstAlphaFactor,r.blendSrcAlpha=e.ZeroFactor,r.blendDstAlpha=e.OneFactor}Le&&Ye(i,B(fe,z.rose,{...o(),..._e},s,e.DoubleSide),"rose-shell-image")}await a.yield();const pt=qt(),gt=It(),wt=Ct(),yt=B(J,z.rose,{uTint:{value:$},uMode:{value:1}}),ot=B(J,z.rose,{uTint:{value:$},uMode:{value:2}},null,e.DoubleSide);ot.uniforms.uLift.value=1;const xt=B(J,z.rose,{uTint:{value:$},uMode:{value:3}}),bt=B(Ft,z.rose,{}),ce=[];{const t=new se,o=l.sector,s=r=>ae+r*(ge-ae);for(let r=0;r<2;r++){const f=r===0?w:-w;for(let S=0;S<12;S++){const p=S*o+o*.25,N=[],A=[];for(let C=ae;C<0;C+=2.1)N.push({a:p+f*x*(C-ae)/(ge-ae),s:C});N.push({a:p+f*x*(0-ae)/(ge-ae),s:-.02});for(let C=.02;C<ge;C+=1.75)A.push({a:p+f*x*(C-ae)/(ge-ae),s:C});A.push({a:p+f*x,s:ge}),t.wave=S*7.3+r*3.1,await a.yield();const Y=de(t,l,N,1,.4,S*3.7);await a.yield(),de(t,l,A,1,.4,Y),await a.yield()}await a.yield()}const i=Math.floor(12*x/Math.PI);for(let r=1;r<=i;r++){const f=s(r*Math.PI/(12*x));if(!(Math.abs(f)<2.2||l.mer(f)[0]<5))for(let S=0;S<12;S++){const p=S*o+o*.25+w*r*o*.5,N=(Math.round(p/o)%12+12)%12;let A=p-N*o;A-=Math.round(A/Z)*Z,ce.push([N,A,f,.8])}}for(let r=0;r<12;r++){for(const f of[-1,1]){const S=[];for(let p=.4;p<l.L-1.2;p+=2.3)S.push({a:r*o+f*Math.max(0,o/2-.16/Math.max(l.mer(p)[0],.16)),s:p});t.wave=r*5.1+f,de(t,l,S,.55,.5,r*1.3,r,!0),await a.yield()}ce.push([r,0,l.L-2.4,.9]);for(let f=1;f<=5;f++)ce.push([r,0,f/6*(l.L-9)*.55+l.L*.42,.42+.03*f]);await a.yield()}for(const r of[-1,1])for(let f=9;f<l.L-6;f+=11.5)ce.push([0,r*Math.max(0,l.sector/2-2.6/l.mer(f)[0]),f,-.5]);ce.push([0,0,l.L-3.2,-.8]),await a.yield(),K+=t.tris;const u=await t.geometryAsync(a,210,80);O(u,yt,"rose-trellis"),Le&&Ye(u,B(J,z.rose,{uTint:{value:$},uMode:{value:1},..._e}),"rose-trellis-image")}await a.yield();{const t=new se,o=new se;for(let s=0;s<ce.length;s++){const[i,u,r,f]=ce[s],S=s*.7548776662%1,p=Math.abs(f),N=Math.sign(f);le(t,l,i,u,r,pt,[p,p,f*1.15],b+s*.9,.3*N,S,0,!1),le(o,l,i,u,r,wt,[p,p,f*1.6],s*.5,.12*N,s*2.1,0,!1),s%6===5&&await a.yield()}await a.yield();{const s=De(new e.LatheGeometry([[.62,0],[.26,.12],[.24,.45],[.46,.58],[.24,.72],[.26,.93],[.58,1],[0,1.1]].map(([S,p])=>new e.Vector2(S,p)),6).rotateX(Math.PI/2)),i=5.2,u=3,r=l.L-16,f=20;for(const S of[-1,1]){const p=N=>S*Math.max(0,l.sector/2-1.9/Math.max(l.mer(N)[0],1.9));ft(o,l,0,p,u,r,(r-u)/34,-i,.42),await a.yield(),ft(o,l,0,p,u,r,(r-u)/34,-i*.5,.2),await a.yield();for(let N=0;N<=f;N++){const A=u+(r-u)*N/f,Y=N===0||N===f?1.7:1;le(o,l,0,p(A),A,s,[Y,Y,-i*(Y>1?1.22:1)],0,0,N*2.1,0,!1)}await a.yield()}}K+=t.tris+o.tris,await a.yield(),O(await t.geometryAsync(a,210,80),bt,"rose-diamonds"),O(await o.geometryAsync(a,210,80),xt,"rose-collets")}await a.yield();{const t=new se,o=l.sector,s=.62/R,i=Math.ceil(((l.L-2)*.5-1)/s),u=Math.ceil((l.L-3)/s);for(const r of[-1,1]){for(let f=0;f<u;f++){const S=1+f*s,p=r<0&&f>=i?f-i:f;if(S>=l.L-2)break;const N=r*Math.max(0,o/2-.9/Math.max(l.mer(S)[0],.9));t.wave=S;for(const A of[-1,1])le(t,l,0,N,S+(A>0?s*.5:0),gt,[.62,1.25,-1],A*.62+(p%2?.08:-.08),-.25,0,0,!0);f%4===3&&await a.yield()}await a.yield()}K+=t.tris,O(await t.geometryAsync(a,210,80),ot,"rose-laurel-leaves")}await a.yield();const Q=De(new e.IcosahedronGeometry(1,1));for(let t=0;t<Q.pos.length;t+=3){const o=Math.hypot(Q.pos[t],Q.pos[t+1],Q.pos[t+2])||1;Q.nrm[t]=Q.pos[t]/o,Q.nrm[t+1]=Q.pos[t+1]/o,Q.nrm[t+2]=Q.pos[t+2]/o}{const t=await Qe(a,P,4,12,12,36,P.sAtY(45.2),.1);K+=t.tris,await a.yield();const o=()=>({uTint:{value:c(d).lerp(new e.Vector3(.96,1,.5),.15*pe)},uInTint:{value:c(d).lerp(new e.Vector3(.96,1,.5),.15*pe)},uFlat:{value:.4*pe},uKind:{value:1},uInKind:{value:1},uInGlass:{value:1},uSea:{value:0},uCollarR:{value:0},uDepth:{value:new e.Vector2((1.8-.9*pe)*tt,(1.75-.5*pe)*tt)},uLum:{value:new e.Vector2(.75,.8)},uCoat:{value:new e.Vector2(.06,.22)},uGround:{value:.35+.45*pe}}),s=[new e.Vector3(0,95,0),new e.Vector3(20,28,20),Ee(v,.9)],i=await t.geometryAsync(a,150,90);O(i,B(fe,z.prim,o(),s,e.DoubleSide),"primrose-shell"),Me&&We(i,B(fe,z.prim,{...o(),...Oe()},s,e.DoubleSide),"primrose-shell-ramp-image");const u=new se,r=new se,f=P.sector,S=[-.5*P.dnT.L,.14*P.L,.3*P.L,.46*P.L,.62*P.L,.78*P.L];for(let p=0;p<12;p++){for(const A of[-1,1]){const Y=[];for(let C=.3;C<P.L-.8;C+=1.6)Y.push({a:p*f+A*Math.max(0,f/2-.4/Math.max(P.mer(C)[0],.4)),s:C});de(u,P,Y,.46,.4,p,p,!0),await a.yield()}const N=[];for(let A=P.sAtY(47);A<-.2;A+=1.6)N.push({a:(p+.5)*f,s:A});N.push({a:(p+.5)*f,s:-.1}),de(u,P,N,.26,.3,p,p),await a.yield();for(const A of S){const Y=[];for(let C=0;C<=6;C++)Y.push({a:p*f+(C/6-.5)*f*.985,s:A});de(u,P,Y,.24,.26,p*2,p,A>0),le(r,P,p,f/2-.6/P.mer(A)[0],A,Q,[.7,.7,.7],0,.1,0,0,!1),A>0&&le(r,P,p,0,A,Q,[.5,.5,.5],0,0,0,0,!1),await a.yield()}le(r,P,p,0,P.L-1.2,Q,[.5,.5,.5],0,.3,0,0,!1),await a.yield()}K+=u.tris+r.tris,await a.yield(),O(await u.geometryAsync(a,150,90),B(J,z.prim,{uTint:{value:$},uMode:{value:5}}),"primrose-ribs"),O(await r.geometryAsync(a,150,90),B(J,z.prim,{uTint:{value:c(q,.95)},uMode:{value:4}}),"primrose-pearls")}await a.yield();{const t=[new se,new se];for(let o=1;o<12;o++){for(let s=0;s<5;s++){const i=13+s*17,u=s<3?2.5:1.8;le(t[(o+s)%2],l,o,0,i,Q,[u,u,-u*.6],0,-.25,0,0,!1)}await a.yield()}K+=t[0].tris+t[1].tris,O(await t[0].geometryAsync(a,210,80),B(J,z.rose,{uTint:{value:new e.Vector3(.05,.1,.62)},uMode:{value:4}}),"rose-sapphires"),O(await t[1].geometryAsync(a,210,80),B(J,z.rose,{uTint:{value:c(y[4],.55).multiply(new e.Vector3(.45,1,.6))},uMode:{value:4}}),"rose-emeralds")}await a.yield();for(const[t,o,s,i,u,r,f,S,p,N]of[[L,z.mauv,"mauve",4,6,12,12,L.sAtY(70.25),1.1,8],[F,z.wingR,"wing-r",6,2,12,16,F.sAtY(F.Y-1.2),.9,1],[U,z.wingL,"wing-l",6,2,12,16,U.sAtY(U.Y-1.2),.9,1]]){const A=await Qe(a,t,i,u,r,f,S,.06,N);K+=A.tris,await a.yield();const Y=()=>({uDepth:{value:new e.Vector2(1.15,1.5)},uLum:{value:new e.Vector2(.45,.55)},uCoat:{value:new e.Vector2(.08,.1)},uTint:{value:c(v)},uInTint:{value:c(v)},uKind:{value:2},uInKind:{value:2},uInGlass:{value:1},uSea:{value:0},uCollarR:{value:0}}),C=await A.geometryAsync(a,t===L?80:40,t===L?90:126);O(C,B(fe,o,Y(),null,e.DoubleSide),s+"-shell"),Me&&t===L&&We(C,B(fe,o,{...Y(),...Oe()},null,e.DoubleSide),"mauve-shell-ramp-image");const Je=new se,ht=t.sector;for(let Ae=0;Ae<N;Ae++)for(const At of[-1,1]){const mt=[];for(let Ce=.2;Ce<t.L-.4;Ce+=p)mt.push({a:t.az0+Ae*ht+At*Math.max(0,ht/2-.26/Math.max(t.mer(Ce)[0],.26)),s:Ce});de(Je,t,mt,.3,.28,Ae,Ae,!0),await a.yield()}K+=Je.tris,await a.yield(),O(await Je.geometryAsync(a,t===L?80:40,t===L?90:126),B(J,o,{uTint:{value:$},uMode:{value:5}}),s+"-ribs")}await a.yield();const X=[],ze=[],Re=[],Be=new e.Vector3,_=(t,o,s)=>{if($e(o),s){o.applyMatrix4(s);const i=o.attributes.aTan;for(let u=0;u<i.count;u++)Be.fromBufferAttribute(i,u).transformDirection(s),i.setXYZ(u,Be.x,Be.y,Be.z)}t.push(o)},we=t=>t.map(([o,s])=>new e.Vector2(o,s)),ee=()=>new e.Matrix4;_(Re,new e.LatheGeometry(we([[59.6,60.2],[60.9,60.4],[61.5,61.1],[61.1,61.8],[61.7,62.5],[61.1,63.2],[61.4,63.8],[60.4,64.1],[59.7,63.6]]),120)),await a.yield(),_(Re,new e.LatheGeometry(we([[35.6,66.9],[36.6,67.1],[37,67.9],[36.6,68.7],[35.7,68.9]]),72)),await a.yield(),_(Re,new e.LatheGeometry(we([[19.7,76.3],[20.4,76.5],[20.6,77],[20.3,77.5],[19.8,77.6]]),48)),await a.yield();const Fe=l.mer(l.sAtY(0))[0];_(X,new e.LatheGeometry(we([[Fe+1.5,.35],[9.5,.9],[7,2.4],[4.4,6],[3.3,13.5],[4.7,16.5],[5.6,18.5],[4.5,20.5],[3.1,23.5],[2.7,34],[3.7,38],[7,41],[13,44.2],[17.8,48.2],[22.8,50.1],[24.9,51.3]]),40)),await a.yield(),_(X,new e.LatheGeometry(we([[3.4,45.3],[1.7,48],[1.25,62],[1.9,65],[1.3,66.5],[2.6,68.3],[8,70.2],[15,72.2],[17.9,73.7]]),24)),_(X,new e.TorusGeometry(Fe+.5,.5,6,96).rotateX(Math.PI/2).translate(0,.2,0)),await a.yield();for(let t=0;t<12;t++)for(let o=-1;o<=1;o++){const s=t*l.sector+o*l.sector*.3,i=new e.SphereGeometry(.62,10,6).scale(1,1,1);$e(i,1),i.scale(2.4,1,1),i.applyMatrix4(ee().makeRotationY(s).setPosition(Math.sin(s)*61.2,62.4,Math.cos(s)*61.2));const u=i.attributes.aTan;for(let r=0;r<u.count;r++)u.setXYZ(r,Math.cos(s),0,-Math.sin(s));X.push(i),await a.yield()}const Te=14*Math.PI/180,Pt=new e.Vector3(0,-Math.sin(Te),Math.cos(Te)),ye=new e.Vector3(0,94,0),ie=17,He=ee().makeRotationX(Te).setPosition(ye);_(X,new e.TorusGeometry(ie+.9,.4,8,72),He);for(let t=0;t<48;t++){const o=t/48*Z,s=t%3===0,i=s?.66:.4;_(s?ze:X,new e.SphereGeometry(i,s?12:8,s?8:5),ee().makeRotationX(Te).setPosition(ye).multiply(ee().makeTranslation(Math.cos(o)*(ie+.9),Math.sin(o)*(ie+.9),.4))),t%4===3&&await a.yield()}await a.yield();let ue=null;{const t=ee().makeTranslation(0,112,3.4).multiply(ee().makeScale(G,G,G)).multiply(ee().makeTranslation(0,-112,-4.3)),o=(r,f,S,p=0,N=0,A=0)=>t.clone().multiply(ee().makeRotationFromEuler(new e.Euler(p,N,A)).setPosition(r,f,S)),s=[],i=[],u=new e.Vector3(0,120.2,6).applyMatrix4(t);_(X,new e.SphereGeometry(1,16,10).scale(3.7,3.8,6.2),o(0,115.7,1.4,-.22)),_(s,new e.SphereGeometry(2.4,14,10),o(0,120.2,6)),_(s,new e.ConeGeometry(.85,4.2,8),o(0,119.9,9.6,Math.PI/2+.1));for(const r of[-1,1])_(i,new e.SphereGeometry(.6,10,7),o(r*1.72,120.9,7.4)),_(X,new e.SphereGeometry(.95,8,6).scale(1,.8,1.5),o(r*1.2,112.3,4.3)),_(X,new e.CylinderGeometry(.28,.28,2,6),o(r*1.2,113.1,3.8,.35)),await a.yield();await a.yield();for(let r=-2;r<=2;r++)_(X,new e.SphereGeometry(1,8,6).scale(1,.18,4.6).translate(0,0,-4.6),o(0,116.8,-3.4,-.62,r*.3,0));for(let r=-1;r<=1;r++)_(s,new e.ConeGeometry(.38,1.9,6),o(0,122.8-Math.abs(r)*.15,5.9+r*.9,-.5+r*.3));_(X,new e.CylinderGeometry(.26,.26,2,6),o(0,120.2,-1.2)),_(X,new e.TorusGeometry(1.2,.26,6,16).scale(1,1.25,1),o(0,122.6,-1.2,0,Math.PI/2,0)),await a.yield(),ue=new e.Group,ue.name="bird-head",ue.position.copy(u),H.add(ue);for(const[r,f,S,p]of[[s,$,3,"bird-head-gold"],[i,c(q,.95),4,"bird-eyes"]]){const N=Se(r).translate(-u.x,-u.y,-u.z);r.forEach(Y=>Y.dispose()),K+=N.index.count/3;const A=new e.Mesh(N,B(J,null,{uTint:{value:f},uMode:{value:S}}));A.name=p,A.frustumCulled=!1,ue.add(A)}await a.yield(),_(X,new e.TorusGeometry(29,.35,6,72).rotateX(Math.PI/2),ee().makeTranslation(0,70.2,0));for(let r=0;r<24;r++){const f=(r+.5)/24*Z;_(ze,new e.SphereGeometry(r%2?1:1.55,10,7),ee().makeTranslation(Math.sin(f)*29,70.6,Math.cos(f)*29)),r%3===2&&await a.yield()}}await a.yield();let xe=null;{const t=[];for(const s of[92,122,152,178]){const i=62-.2769*(s-60)-.5;_(t,new e.LatheGeometry(we([[2.6,-6],[3.5,.3],[3.1,1.6],[1.8,3.4],[1.55,i*.5],[2.2,i*.5+.9],[1.5,i*.5+1.8],[1.4,i-6],[2.1,i-4.4],[1.6,i-3.6],[2.8,i-1.6],[3.3,i-.5],[.3,i-.4]]),14),ee().makeTranslation(0,0,s)),await a.yield()}const o=Se(t);t.forEach(s=>s.dispose()),K+=o.index.count/3,xe=O(o,B(J,null,{uTint:{value:$},uMode:{value:3}}),"ramp-piers"),xe.position.y=-62}const Ke=[92,122,152,178],st=t=>62-.2769*(t-60)-.5;await a.yield();{const t=Se(X);await a.yield();const o=Se(ze);await a.yield();const s=Se(Re);await a.yield(),X.concat(ze,Re).forEach(i=>i.dispose()),K+=(t.index.count+o.index.count+s.index.count)/3,O(s,B(J,null,{uTint:{value:$},uMode:{value:1}}),"gold-girdles"),Le&&Ye(s,B(J,null,{uTint:{value:$},uMode:{value:1},..._e}),"gold-girdles-image"),O(t,B(J,null,{uTint:{value:$},uMode:{value:3}}),"gold-mounts"),O(o,B(J,null,{uTint:{value:c(q,.95)},uMode:{value:4}}),"portal-pearls")}await a.yield();const qe=new e.Mesh(new e.CircleGeometry(ie+.4,48).applyMatrix4(He),new e.MeshBasicMaterial({color:new e.Color("#FFF4D6").multiplyScalar(1.9),fog:!1}));if(qe.name="portal-glow",qe.visible=m.portalGlow!==!1,H.add(qe),Me){const t=$e(new e.CircleGeometry(ie,40)).applyMatrix4(He);We(t,B(Bt,null,Oe()),"portal-ramp-image");const o=new e.BufferGeometry;o.setAttribute("position",new e.Float32BufferAttribute([-1,-1,0,3,-1,0,-1,3,0],3));const s=new e.ShaderMaterial({vertexShader:"void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:"void main(){ gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); }",depthTest:!1,depthWrite:!1,fog:!1,blending:e.CustomBlending,blendSrc:e.ZeroFactor,blendDst:e.OneFactor,blendSrcAlpha:e.OneFactor,blendDstAlpha:e.ZeroFactor}),i=O(o,s,"alpha-restore");i.renderOrder=-6.5}let be=null,Ie=null;if(m.apron!==!1){const t=new e.CircleGeometry(m.apronRadius??2600,96).rotateX(-Math.PI/2),o=t.attributes.position.count,s=new Float32Array(o*3),i=new Float32Array(o*4);for(let u=0;u<o;u++)s[u*3]=1;t.setAttribute("aTan",new e.BufferAttribute(s,3)),t.setAttribute("aUv",new e.BufferAttribute(i,4)),t.deleteAttribute("uv"),be=O(t,B(fe,null,{uTint:{value:c(g)},uInTint:{value:$},uKind:{value:4},uInKind:{value:4},uInGlass:{value:1},uSea:{value:1},uCollarR:{value:Fe}},[new e.Vector3(0,80,0),new e.Vector3(66,98,66),Ee(n,.8)]),"sea-apron"),Ie=ne[ne.length-1],be.renderOrder=-8,be.material.blending=e.CustomBlending,be.material.blendSrc=e.OneFactor,be.material.blendDst=e.OneMinusSrcAlphaFactor,K+=96}let Xe=-1;const nt=t=>{if(t=me(t,0,1),t===Xe)return;Xe=t;const o=re(.02,.27,t),s=.065+.335*o+.6*re(.24,.46,t),i=.038+.2*o+.762*re(.2,.47,t);if(z.rose.uE.value.set(s,i,s),z.prim.uE.value.set(s,i,s),I.uGlow.value=re(.3,.5,t),I.uRampOn.value=t>.48?1:0,xe&&(xe.position.y=-62*(1-re(.2,.45,t))),Ie){const u=re(.03,.5,t);Ie.c.set(0,80-8*u,0),Ie.r.set(66+139*u,98+40*u,66+139*u)}};let Ve=null;try{Ve=new URLSearchParams(globalThis.location?.search||"").get("prog")}catch{Ve=null}nt(Ve!==null&&Ve!==""?parseFloat(Ve):m.progress??.56),await a.yield();const Mt=Math.tan(Te),he=dt(l,E.rose.F,1,l.L),rt=t=>new e.Vector3(0,ye.y-Mt*t,t),je=[];for(let t=0;t<=48;t++){const o=dt(l,E.rose.F,1,l.L*t/48);je.push([o[0],o[1]])}const Rt=t=>{if(t<l.R)return l.Y+.5+(ye.y-ie-3-l.Y)*re(l.R,6,t);for(let o=0;o<48;o++){const s=je[o],i=je[o+1];if(t>=s[0]&&t<=i[0])return s[1]+(i[1]-s[1])*(t-s[0])/Math.max(i[0]-s[0],1e-6)}return 0},it={portalSeat:{position:ye.clone(),facing:Pt.clone(),radius:ie,pitchDeg:14},flyThrough:[he[0]+90,he[0]+25,he[0],(he[0]+60)/2,60,25,10,0].map(rt),goreTip:new e.Vector3(0,he[1],he[0]),floorY:Rt,piers:Ke.map(t=>({z:t,top:st(t),shaft:1.5,cap:3.3,foot:3.5})),bird:{perch:new e.Vector3(0,112,3.4),crest:new e.Vector3(0,112+(123.75-112)*G,3.4+(5.9-4.3)*G)},hinges:{rose:new e.Vector3(0,62,60),primrose:new e.Vector3(0,68,36),mauve:new e.Vector3(0,77,20)},viewpoints:{flower:new e.Vector3(Math.sin(1.15)*250,14,Math.cos(1.15)*250),underGores:new e.Vector3(Math.sin(.45)*205,24,Math.cos(.45)*205),rampFoot:rt(he[0]+25)},waterline:{radius:Fe,y:0},sunDirLocal:new e.Vector3(0,Math.sin(38*Math.PI/180),Math.cos(38*Math.PI/180)),reflect:{center:new e.Vector3(0,78,0),radii:new e.Vector3(60,92,60)}};I.uRampL.value=l.L;for(let t=0;t<=16;t++)I.uOut.value[t]=l.mer(l.L*t/16)[0]*Math.sin(l.sector/2-.14/l.R);const oe=new e.Vector3,j=new e.Vector3,lt=new e.Vector3,Tt=new e.Vector2,Vt=new e.Vector3;let ct=!1,Ze=12;const ut=(t,o,s)=>{I.uTime.value=o;{const u=o*.62%1,r=u<.36?u/.36:1-(u-.36)/.64,f=r*r*(3-2*r),S=.48+.74*f;for(const p of[z.wingR,z.wingL])p.uPoseG.value.x=S,p.uPoseF.value.x=S,p.uPoseN.value.x=S;if(ue){const p=o*.19%1,N=(A,Y)=>{const C=me((Y-A)/.1,0,1);return C*C*(3-2*C)};ue.rotation.set(.07*Math.sin(o*2.3),.85*(1-2*N(.4,p)+2*N(.9,p)),0)}}H.updateWorldMatrix(!0,!1);const i=Vt.setFromMatrixScale(H.matrixWorld).x;m.sunDir?I.uSunDir.value.copy(m.sunDir).normalize():I.uSunDir.value.copy(it.sunDirLocal).transformDirection(H.matrixWorld),j.copy(ye).applyMatrix4(H.matrixWorld),I.uPortal.value.set(j.x,j.y,j.z,ie*i),oe.set(0,1,0).transformDirection(H.matrixWorld),j.setFromMatrixPosition(H.matrixWorld),te.set(oe.x,oe.y,oe.z,-oe.dot(j)),oe.copy(D).transformDirection(H.matrixWorld),j.copy(at).applyMatrix4(H.matrixWorld),Pe.set(oe.x,oe.y,oe.z,-oe.dot(j)),I.uRampH.value.copy(j),I.uRampA.value.set(0,Math.cos(Ge),Math.sin(Ge)).transformDirection(H.matrixWorld),I.uRampX.value.set(1,0,0).transformDirection(H.matrixWorld);for(const u of ne)u.u.uRefC.value.copy(u.c).applyMatrix4(H.matrixWorld),u.u.uRefR.value.copy(u.r).multiplyScalar(i);for(let u=0;u<4;u++)j.set(0,0,Ke[u]).applyMatrix4(H.matrixWorld),I.uPier.value[u].set(j.x,j.z,st(Ke[u])*i);if(I.uPierSunk.value=xe?-xe.position.y*i:0,s){if(s.getWorldPosition(j),ct&&t>1e-4){const f=Math.min(j.distanceTo(lt)/t,80);Ze+=(f-Ze)*Math.min(1,t*2)}lt.copy(j),ct=!0,I.uCamSpeed.value=Ze;const u=a.renderer?.getDrawingBufferSize?a.renderer.getDrawingBufferSize(Tt).y:720,r=s.isPerspectiveCamera?s.fov:60;I.uPixelAngle.value=2*Math.tan(r*Math.PI/360)/Math.max(u,64)}};return ut(0,0,null),{object:H,radius:150,height:170,center:new e.Vector3(0,78,0),anchors:it,update:ut,setProgress:nt,getProgress:()=>Xe,parts:{glow:qe,apron:be},skyUniforms:I,stats:{triangles:Math.round(K)},dispose(){},ground:!1,groundY:0}}export{Nt as SKY_GLSL,_t as buildHero};
