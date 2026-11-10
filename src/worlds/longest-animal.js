import*as u from"three";import{makePath as mo,clamp as W,lerp as X,smoothstep as m}from"../kit/core.js";import{buildHero as po}from"../parts/longest-animal.js";const ue=["#010208","#141B4D","#4A3F8C","#3F8CFF","#CFEAFF","#FF7A2A","#B8203A"],A0=-54,xt=-107,E0=-62,go=-.37,yo=.91,wo=-.21,X0=52,Mt=10,d0=.8,Q0=1.2,ba=.6;function bo(i){return i<=.135?120:i<=.283?X(120,300,m(.135,.283,i)*.6+.4*(i-.135)/.148):i<=.457?X(300,620,(i-.283)/.174):620}const xa=(i,r)=>{if(i<=r[0][0])return r[0][1];for(let F=1;F<r.length;F++)if(i<=r[F][0])return X(r[F-1][1],r[F][1],(i-r[F-1][0])/(r[F][0]-r[F-1][0]));return r[r.length-1][1]},Ae=`
uniform vec3 uGlowCol, uMidCol, uLowCol, uKeyCol, uColonyCol, uColonyPos, uDeepDir, uDeepCol, uDeepCol2;
uniform float uGlowK, uFogD, uColonyI, uColonyR2, uTime, uPxScale, uEntry, uRays, uShaft;
// the water's own colour in direction d (what fog fades to): the glow overhead, and round the helix THE COLONY'S
// GLOW IN THE WATER: a wide, edgeless lobe of dim indigo about the direction of the colony (uDeepDir: lens -> core),
// brightest round the galaxy, under the grade's black point 48-52 degrees from it and gone altogether by 70 (the
// lobe is steep, pow 1.4: at 0.55 it sat just under the black point across the whole frame, and the least light added
// to it, a brighter cast, a blizzard, lifted the far water to an even navy), plus a tighter blue one
vec3 deepGlow(vec3 d) {
  float w = max(0.5 + 0.5 * dot(d, uDeepDir), 1e-4), w3 = w * w * w;
  return uDeepCol * pow(w, 1.4) + uDeepCol2 * (w3 * w3);
}
vec3 domeCol(vec3 d) {
  float up = clamp(d.y, -1.0, 1.0);
  vec3 c = mix(uLowCol, uMidCol, smoothstep(-0.95, 0.45, up));
  float g = exp(-(1.0 - up) / max(uGlowK, 0.004));
  float wide = up * 0.5 + 0.5; wide = wide * wide * wide;
  return c + uGlowCol * (g + 0.22 * wide * wide + uEntry * 0.22 * smoothstep(-0.6, 0.5, up)) + deepGlow(d);
}
float fogF(float dist) { float x = uFogD * dist; return 1.0 - exp(-x * x); }
vec3 colonyLight(vec3 wp, vec3 N, float wrap) {
  vec3 toC = uColonyPos - wp; float d2 = dot(toC, toC);
  vec3 l = toC / sqrt(max(d2, 1e-4));
  float nl = clamp((dot(N, l) + wrap) / (1.0 + wrap), 0.0, 1.0);
  return uColonyCol * (uColonyI * nl / (1.0 + d2 / uColonyR2));
}
vec3 keyLight(vec3 N) { float t = clamp(N.y * 0.75 + 0.25, 0.0, 1.0); return uKeyCol * (t * t) + uMidCol * 0.4; }
vec4 qmul(vec4 a, vec4 b) { return vec4(a.w * b.xyz + b.w * a.xyz + cross(a.xyz, b.xyz), a.w * b.w - dot(a.xyz, b.xyz)); }
vec3 qrot(vec4 q, vec3 v) { return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v); }
float h11(float x) { return fract(sin(x * 127.1) * 43758.5453); }
// The dome itself: domeCol plus the SHAFTS of the last light. Seen from inside the water every shaft is an arc from
// straight overhead to straight below, so they fan out of the top of the level entry and, on the descent, converge
// under the lens beyond the galaxy; under them the water keeps a floor of blue that goes out with the glow (uRays
// scales both). Soft, wide bars (uShaft 1) over a floor of blue with no black gaps; as uShaft goes to 0 the bars melt
// into the floor at the same mean brightness, so the galaxy comes to sit in even dark-blue water.
vec3 waterCol(vec3 d) {
  float az = atan(d.z, abs(d.x) < 1e-5 ? 1e-5 : d.x), pol = sqrt(max(1.0 - d.y * d.y, 0.0));
  float a = 0.5 + 0.5 * sin(az * 9.0 + 1.7 * sin(az * 4.0 + uTime * 0.07) + uTime * 0.05);
  float b = 0.5 + 0.5 * sin(az * 23.0 - 2.3 * sin(az * 5.0 - uTime * 0.09) + 1.3);
  float shafts = (a * a * 0.85 + a * b * 0.15) * smoothstep(0.04, 0.34, pol);
  float body = 0.3 + 0.7 * smoothstep(-1.0, 0.8, d.y);
  return domeCol(d) + uGlowCol * (uRays * body * (0.085 + 0.045 * (1.0 - uShaft) + 0.125 * uShaft * shafts));
}
`,xo=`
varying vec3 vDir;
void main() { vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,Mo=`
varying vec3 vDir;
${Ae}
void main() {
  vec3 d = vDir / max(length(vDir), 1e-4);
  gl_FragColor = vec4(waterCol(d), 1.0);
}`,Co=`
attribute vec3 iBase; attribute vec4 iData;          // iData: size (m), seed, brightness, string (0 round .. 1 long)
uniform vec3 uCenter, uBox, uOffset, uStreak, uColA, uColB, uSelf, uHeroPos, uHaloCol, uTop;
uniform mat3 uHeroInv;
uniform float uWrap, uMinPx, uGain, uLit, uBlink, uDart, uTwinkle, uBandPos, uBandGap, uOwnS, uOwnAmp, uB2, uT1, uHaloR2, uHaloK, uMinE, uBroad, uFar;
uniform vec2 uNear;
varying vec2 vUv; varying vec3 vCol;
${Ae}
float armHalo(vec3 wp, out float band) {
  vec3 lp = uHeroInv * (wp - uHeroPos);
  float r = max(length(lp.xz), 0.05);
  float phi = atan(lp.x, abs(lp.z) < 1e-4 ? 1e-4 : lp.z);
  float lnr = log(22.5 / clamp(r, 6.5, 22.5));
  float tr = lnr <= 0.60525 ? lnr / 0.1345 : 4.5 + (lnr - 0.60525) / max(uB2, 0.01);
  float k = floor((tr - phi) / 6.28318 + 0.5);
  float t0 = phi + 6.28318 * k;
  if (t0 < 0.0) t0 += 6.28318;
  float t = min(t0, uT1);
  float ra = 22.5 * exp(-(0.1345 * min(t, 4.5) + uB2 * max(t - 4.5, 0.0)));
  float dr = r - ra, drr = r - 6.5;
  float d2 = min(dr * dr, drr * drr) + lp.y * lp.y;
  float s = 168.8 * (1.0 - exp(-0.1345 * t));
  float bx = (s - uBandPos) / max(uBandGap, 1.0);
  float d = (fract(bx) - 0.5) * uBandGap, dh = (fract(bx + 0.5) - 0.5) * uBandGap;
  band = exp(-d * d / 40.0) + 0.5 * exp(-dh * dh / 40.0) + uOwnAmp * exp(-(s - uOwnS) * (s - uOwnS) / 60.0);
  return 1.0 / (1.0 + d2 / uHaloR2);
}
void main() {
  float seed = iData.y;
  vec3 p = iBase + uOffset;
  p += vec3(sin(uTime * 0.71 + seed * 40.0), sin(uTime * 0.53 + seed * 71.0), cos(uTime * 0.63 + seed * 53.0)) * (0.2 * uTwinkle);
  float kk = floor(uTime * 1.3 + seed * 10.0), fr = fract(uTime * 1.3 + seed * 10.0);
  vec3 j0 = vec3(h11(kk + seed), h11(kk * 1.7 + seed * 3.0), h11(kk * 2.3 + seed * 5.0)) - 0.5;
  vec3 j1 = vec3(h11(kk + 1.0 + seed), h11((kk + 1.0) * 1.7 + seed * 3.0), h11((kk + 1.0) * 2.3 + seed * 5.0)) - 0.5;
  p += mix(j0, j1, smoothstep(0.0, 0.22, fr)) * uDart;
  float edge = 1.0;
  if (uWrap > 0.5) {
    vec3 q = mod(p - uCenter + uBox * 0.5, uBox);
    vec3 e = min(q, uBox - q) / (uBox * 0.12);
    edge = clamp(min(e.x, min(e.y, e.z)), 0.0, 1.0);
    p = uCenter + q - uBox * 0.5;
  }
  // the pillar's top: the column thins into scattered points and fades with no edge (uTop: from y, to y, amount)
  float tp = smoothstep(uTop.x, uTop.y, p.y) * uTop.z;
  p.xz = uCenter.xz + (p.xz - uCenter.xz) * (1.0 + 2.2 * tp * tp);
  edge *= 1.0 - 0.88 * tp;
  vec4 mv = viewMatrix * vec4(p, 1.0);
  float dist = max(length(mv.xyz), 0.05);
  float sz = iData.x;
  float hs = max(sz * 0.5, uMinPx * (1.0 + uFar * smoothstep(45.0, 110.0, dist)) * dist / uPxScale);   // uFar: the far end of a layer is drawn larger
  float e0 = sz * 0.5 / hs;
  float energy = max(e0 * e0, uMinE);
  // a streak from where the mote is to where it was a shutter ago (plus the length of a string of dead plankton)
  float ang = seed * 50.0;
  vec3 sv = (viewMatrix * vec4(uStreak, 0.0)).xyz + vec3(cos(ang), sin(ang), 0.0) * (hs * 3.0 * iData.w);
  float al = length(sv);
  vec3 dirv = al > 1e-5 ? sv / al : vec3(0.0, 1.0, 0.0);
  vec3 cr = cross(dirv, mv.xyz); float cl = length(cr);
  vec3 side = cl > 1e-5 ? cr / cl : vec3(1.0, 0.0, 0.0);
  float tt = position.y * 0.5 + 0.5;
  vec3 vp = mv.xyz - sv * tt + dirv * (-position.y * hs) + side * (position.x * hs);
  gl_Position = projectionMatrix * vec4(vp, 1.0);
  vUv = position.xy;
  energy *= pow(2.0 * hs / (al + 2.0 * hs), 0.32);
  float band;
  float halo = armHalo(p, band);
  vec3 toC = uColonyPos - p;
  vec3 broad = uColonyCol * (uColonyI * 0.26 * uBroad / (1.0 + dot(toC, toC) / 1200.0));
  vec3 light = (uKeyCol * 1.3 + uMidCol * 0.8 + uHaloCol * (halo * uHaloK * (0.55 + 1.5 * band)) + broad) * uLit;
  float bl = 0.5 + 0.5 * sin(uTime * (1.5 + 3.0 * fract(seed * 9.0)) + seed * 60.0);
  float blink = mix(1.0, pow(bl, 10.0) * 3.0, uBlink);
  vec3 col = mix(uColA, uColB, fract(seed * 7.13)) * light + uSelf * blink;
  col *= 1.0 - uTwinkle * (0.3 + 0.3 * sin(uTime * (1.6 + 2.6 * fract(seed * 5.3)) + seed * 90.0));
  float nf = smoothstep(uNear.x, uNear.y, dist);
  vCol = col * (iData.z * energy * edge * nf * uGain * (1.0 - fogF(dist)));
}`,So=`
varying vec2 vUv; varying vec3 vCol;
void main() {
  float r2 = dot(vUv, vUv);
  float g = max(exp(-r2 * 3.2) - 0.04, 0.0) * (1.0 - smoothstep(0.7, 1.0, r2));
  gl_FragColor = vec4(vCol * g, 1.0);
}`,zo=`
attribute vec3 iBase; attribute vec3 iDir; attribute vec4 iData;    // size, seed, speed, school phase
attribute vec2 aFish;                                               // tail weight, -
uniform vec3 uCenter, uBox;
uniform float uWrap, uSign, uVis;
uniform vec2 uFar;
varying vec3 vLocal, vN, vWorld, vSide; varying float vSeed, vFar, vGain, vVis, vTiny;
${Ae}
void main() {
  float seed = iData.y, edge = 1.0;
  vGain = 1.0;
#ifdef HATCHET
  vGain = 1.0 + iData.z;
  float yaw = uTime * 0.45 + iData.w * 6.28318 + 1.1 * sin(uTime * 0.6 + iData.w * 20.0);
  float cy = cos(yaw), sy = sin(yaw);
  vec3 c = iBase + uCenter + vec3(cy * iDir.x + sy * iDir.z, iDir.y + 0.1 * sin(uTime * 0.8 + seed * 30.0), -sy * iDir.x + cy * iDir.z);   // uCenter: (0,0,0) for the standing schools
  vec3 F = vec3(-sy * iDir.x + cy * iDir.z, 0.0, -cy * iDir.x - sy * iDir.z) + vec3(sin(seed * 40.0), 0.0, cos(seed * 40.0)) * 0.25;
  F = F / max(length(F), 1e-4);
#else
  vec3 F = vec3(iDir.x, iDir.y * uSign, iDir.z);
  vec3 c = iBase + vec3(0.0, F.y * iData.z * uTime, 0.0);      // they rise (or pour down) in place: the pillar keeps its shape
  c += vec3(sin(uTime * 0.7 + seed * 31.0), 0.0, cos(uTime * 0.6 + seed * 17.0)) * 0.12;
  if (uWrap > 0.5) {
    vec3 q = mod(c - uCenter + uBox * 0.5, uBox);
    vec3 e = min(q, uBox - q) / (uBox * 0.1);
    edge = clamp(min(e.x, min(e.y, e.z)), 0.0, 1.0);
    c = uCenter + q - uBox * 0.5;
  }
#endif
  vec3 X = cross(vec3(0.0, 1.0, 0.0), F); X = X / max(length(X), 1e-4);
  vec3 U = cross(F, X);
#ifdef HATCHET
  // a fish swims upright: it banks up to 23 degrees about its own line of travel as the school wheels, out of step
  // with its neighbours, so its mirror flank tilts through the light. (It rolled 75 degrees either way, a thrown
  // coin: half of a school lay on its side or showed the lens a flat pane, and it read as shards.)
  float roll = 0.3 * sin(uTime * (0.8 + 0.7 * fract(seed * 5.7)) + seed * 37.0) + 0.1 * sin(uTime * 2.1 + seed * 11.0);
  float cr = cos(roll), sr = sin(roll);
  vec3 X0 = X; X = X0 * cr + U * sr; U = U * cr - X0 * sr;
#endif
  vSide = X;
  float dcam = distance(c, cameraPosition);
  // a school gathers and thins fish by fish (uVis 1: all of it). A fish arrives WHOLE: at 60% of its size and in the
  // water's own colour (vVis, in the fragment shader), then grows and takes its light. (Scaled up from nothing it
  // was a stipple of dark and light pixels for its first second.)
  float vis = smoothstep(seed * 0.8, seed * 0.8 + 0.2, uVis);
  vVis = vis;
  float sc = iData.x * edge * (vis > 0.0 ? 0.6 + 0.4 * vis : 0.0) * smoothstep(0.3, 0.9, dcam) * (1.0 - smoothstep(uFar.x, uFar.y, dcam));
  vec3 lp = position;
  float ph = uTime * (8.0 + 5.0 * fract(seed * 3.3)) + seed * 40.0;
  lp.x += sin(ph + lp.z * 5.0) * (0.015 + 0.1 * aFish.x);
  vec3 wp = c + (X * lp.x + U * lp.y + F * lp.z) * sc;
  vN = X * normal.x + U * normal.y + F * normal.z;
  vWorld = wp; vLocal = position; vSeed = seed;
  vFar = 1.0 - smoothstep(9.0, 26.0, iData.x * uPxScale / max(dcam, 0.05));
  vTiny = 1.0 - smoothstep(3.0, 8.0, sc * uPxScale / max(dcam, 0.05));
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
}`,ko=`
uniform vec3 uPhoto;
varying vec3 vLocal, vN, vWorld, vSide; varying float vSeed, vFar, vGain, vVis, vTiny;
${Ae}
void main() {
  vec3 Vv = cameraPosition - vWorld; float dist = length(Vv); vec3 V = Vv / max(dist, 1e-4);
  vec3 N = vN / max(length(vN), 1e-4);
  if (dot(N, V) < 0.0) N = -N;
  float ndv = clamp(dot(N, V), 0.0, 1.0);
  float fres = pow(1.0 - ndv, 3.0);
#ifdef HATCHET
  // a fish, not a shard: it takes the water's light as the other animals here do. A dark back over a silver flank
  // and a pale belly, at every size (under 9 px that is all there is of it). The glow overhead lights it from above
  // and the colony from where the colony lies: its school's share of that light (vGain) through a knee that tops
  // out at 0.36, so it is never brighter than the lit helmets beside it, whatever the colony throws at it; the
  // light wraps round a body with thickness (and half of it is the water's own scatter, which reaches every side:
  // seen from above, the colony under it, a fish is a grey-blue back and not a black sliver), so the side turned
  // to the colony is the bright one and the back the dark one. THE FLASH IS THE MIRROR'S, not the whole fish's: the flank shows what lies along the reflected ray,
  // the water's own colour there (the glow overhead when the fish banks up to it) and the colony's glow where the
  // ray comes within 60 degrees of the colony, so as a school wheels a few fish at a time catch it, each across the
  // curve of its flank. (One flash for the whole flank, on a light multiplied up to the knee, drew every fish as
  // one flat pale tone: cut-out paper.) Close up (near): a dark eye in a pale ring, the plates of the mirror, a row
  // of lights along the keel. Under 8 px (vTiny) the fish sinks into the water's own colour (four fifths of the way
  // at 3 px), so a far school is soft flecks and not a stipple of dark and light pixels.
  float near = 1.0 - vFar;
  vec3 toC = uColonyPos - vWorld; float d2 = dot(toC, toC);
  vec3 Lc = toC / sqrt(max(d2, 1e-4)), R = reflect(-V, N);
  float glow = uColonyI * vGain / (1.0 + d2 / uColonyR2);
  glow = glow / (1.0 + glow / 0.36);
  float wrapL = clamp((dot(N, Lc) + 0.6) / 1.6, 0.0, 1.0), mirror = smoothstep(0.15, 0.95, dot(R, Lc));
  float back = smoothstep(0.03, 0.13, vLocal.y), belly = 1.0 - smoothstep(-0.17, -0.06, vLocal.y), fin = 1.0 - smoothstep(-0.42, -0.36, vLocal.z);
  vec3 alb = mix(mix(vec3(0.6, 0.66, 0.76), vec3(0.84, 0.88, 0.94), belly), vec3(0.24, 0.28, 0.38), back) * (1.0 - 0.5 * fin);
  alb *= 1.0 - near * (1.0 - back) * (0.08 - 0.08 * sin(vLocal.z * 52.0 + 4.0 * vLocal.y));      // the mirror is plates: upright bands
  vec3 lit = keyLight(N) * 2.0 + uColonyCol * (glow * (0.5 + 0.5 * wrapL));
  vec3 col = alb * lit + vec3(0.7, 0.78, 0.9) * (domeCol(R) + uColonyCol * (glow * 0.45 * mirror)) * ((1.0 - 0.7 * back) * (1.0 - fin))
    + (uColonyCol * (glow * 0.3) + uKeyCol + uMidCol * 0.5) * (fres * 0.4);
  float ed = length(vec2(vLocal.z - 0.36, vLocal.y - 0.04));
  col *= 1.0 - near * (0.94 - 0.94 * smoothstep(0.03, 0.04, ed));
  col += lit * (0.4 * near * smoothstep(0.04, 0.045, ed) * (1.0 - smoothstep(0.052, 0.06, ed)));
  col += uPhoto * ((0.1 + 0.08 * sin(vLocal.z * 70.0)) * near * (1.0 - fin)) * (1.0 - smoothstep(-0.21, -0.13, vLocal.y));
  col = mix(col, waterCol(-V), 0.8 * vTiny);
#else
  float flank = smoothstep(-0.085, -0.035, vLocal.y) * (1.0 - smoothstep(0.0, 0.06, vLocal.y));     // dark back, silvered flank, dark belly
  vec3 alb = mix(vec3(0.012, 0.016, 0.03), vec3(0.3, 0.36, 0.5), flank);
  vec3 lit = keyLight(N) + colonyLight(vWorld, N, 0.6);
  vec3 col = alb * lit * 2.2 + (uKeyCol + uMidCol * 0.5) * (fres * 0.55);
  float ed = length(vec2(vLocal.z - 0.36, vLocal.y - 0.028));
  col *= smoothstep(0.026, 0.036, ed);
  col += lit * (0.35 * smoothstep(0.036, 0.042, ed) * (1.0 - smoothstep(0.048, 0.056, ed)));
  float hh = 0.12 * clamp(1.0 - abs(vLocal.z - 0.12) * 1.75, 0.17, 1.0);
  float zc = (vLocal.z + 0.33) / 0.63 * 7.0;
  float inR = step(0.0, zc) * step(zc, 7.0);
  float cz = (fract(zc) - 0.5) * 0.09;
  float dy = vLocal.y + 0.62 * hh;
  float ph = exp(-(cz * cz + dy * dy) / 0.00095) * inR;
  float tw = 0.7 + 0.3 * sin(uTime * 3.0 + vSeed * 50.0 + floor(zc) * 1.7);
  float broad = exp(-dy * dy / 0.003) * inR;
  col += uPhoto * (ph * tw * (1.0 - vFar) + (broad * 0.4 + 0.25 + 0.6 * smoothstep(0.03, -0.05, vLocal.y)) * vFar);
  // seen from over its back a lanternfish was a black bar: the lamp before the eye, the gland on the tail stalk and
  // the glow of the belly row wrapping up the flank show from any side, and the wet back takes a thread of rim light
  float lamp = exp(-((vLocal.z - 0.44) * (vLocal.z - 0.44) + (vLocal.y - 0.012) * (vLocal.y - 0.012)) / 0.0011);
  float gland = exp(-((vLocal.z + 0.3) * (vLocal.z + 0.3) + (vLocal.y - 0.03) * (vLocal.y - 0.03)) / 0.0016);
  col += uPhoto * ((0.55 * lamp + 0.7 * gland) * tw + 0.07 * smoothstep(0.07, -0.04, vLocal.y)) * (1.0 - vFar) + uPhoto * (0.09 * fres);
#endif
  col = mix(col, domeCol(-V), fogF(dist));
  col = mix(waterCol(-V), col, vVis * vVis * (3.0 - 2.0 * vVis));
  gl_FragColor = vec4(col, 1.0);
}`,Ao=`
attribute vec3 iPos; attribute vec4 iQuat; attribute vec4 iData;    // radial scale, length scale, kind, seed
varying vec3 vLocal, vN, vWorld; varying float vKind, vSeed, vDisturb;
${Ae}
void main() {
  float kind = iData.z, seed = iData.w, sx = iData.x, sy = iData.y;
  vec3 lp = position;
  if (kind < 0.5) { lp.xz *= (0.82 + 0.18 * lp.y) * (1.0 + 0.05 * sin(uTime * 1.3 + seed * 30.0 + lp.y * 2.0)); }
  else if (kind < 1.5) { lp *= 1.0 + 0.07 * sin(lp.x * 4.0 + seed * 9.0) * sin(lp.y * 3.0 + seed * 5.0) * sin(lp.z * 5.0 + seed * 3.0); }
  else { lp.xz *= (1.0 + 0.18 * (1.0 - lp.y * lp.y)) * (1.0 + 0.07 * sin(uTime * 2.2 + seed * 20.0)); }
  vec3 sp = vec3(lp.x * sx, lp.y * sy, lp.z * sx);
  vec3 n = normalize(vec3(normal.x / sx, normal.y / sy, normal.z / sx) + vec3(0.0, 1e-5, 0.0));
  float tum = kind < 0.5 ? 0.25 : (kind < 1.5 ? 1.0 : 0.0);
  float ang = uTime * (0.08 + 0.2 * fract(seed * 3.1)) * tum + (kind < 0.5 ? 0.35 * sin(uTime * 0.4 + seed * 9.0) : 0.0);
  vec3 axis = normalize(vec3(sin(seed * 17.0), 0.4, cos(seed * 23.0)));
  vec4 q = qmul(vec4(axis * sin(ang * 0.5), cos(ang * 0.5)), iQuat);
  vec3 c = iPos + vec3(sin(uTime * 0.2 + seed * 12.0), sin(uTime * 0.27 + seed * 7.0), cos(uTime * 0.23 + seed * 5.0)) * 0.08;
  vec3 wp = c + qrot(q, sp);
  vN = qrot(q, n); vWorld = wp; vLocal = position; vKind = kind; vSeed = seed;
  vDisturb = 1.0 - smoothstep(1.5, 7.0, distance(c, cameraPosition));
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
}`,Eo=`
uniform vec3 uEmber;
varying vec3 vLocal, vN, vWorld; varying float vKind, vSeed, vDisturb;
${Ae}
void main() {
  vec3 Vv = cameraPosition - vWorld; float dist = length(Vv); vec3 V = Vv / max(dist, 1e-4);
  vec3 N = vN / max(length(vN), 1e-4);
  if (dot(N, V) < 0.0) N = -N;
  float ndv = clamp(dot(N, V), 0.0, 1.0);
  float fres = pow(1.0 - ndv, 2.2);
  vec3 lit = keyLight(N) + colonyLight(vWorld, N, 1.0) + uMidCol * 0.6;
  float lon = atan(vLocal.z, abs(vLocal.x) < 1e-4 ? 1e-4 : vLocal.x), lat = vLocal.y;
  float rowD = abs(sin(lon * 4.0));
  float bd = abs(sin(lat * 9.0));
  float fw = fwidth(rowD) + 1e-4, fwBd = fwidth(bd) + 1e-4;   // derivatives before any branch
  vec3 col; float a;
  if (vKind < 0.5) {
    // comb jelly: eight comb rows running as beads of the down-light (cyan to violet only), canals that flare
    float ends = 1.0 - smoothstep(0.72, 0.93, abs(lat));
    float row = (1.0 - smoothstep(0.09, 0.09 + fw, rowD)) * ends;
    float bead = 0.5 + 0.5 * sin(lat * 40.0 - uTime * 7.0 + floor(lon * 1.2732 + 4.0) * 1.3);
    bead = bead * bead;
    vec3 hue = mix(vec3(0.1, 0.85, 1.0), vec3(0.5, 0.25, 1.0), 0.5 + 0.5 * sin(lat * 5.0 - uTime * 2.4 + lon * 2.0));
    float amb = 0.32 + 1.6 * dot(uKeyCol, vec3(0.33)) + 0.3 * dot(colonyLight(vWorld, N, 1.0), vec3(0.33));
    float canal = (1.0 - smoothstep(0.2, 0.55, rowD)) * ends * vDisturb * (0.45 + 0.55 * sin(lat * 5.0 - uTime * 6.0 + vSeed * 20.0));
    canal = max(canal, 0.0);
    col = vec3(0.5, 0.75, 0.9) * lit * (0.1 + 1.3 * fres) + hue * (row * (0.25 + 1.1 * bead) * amb) + vec3(0.1, 0.95, 0.7) * (canal * 1.3);
    float gut = exp(-dot(vLocal.xz, vLocal.xz) * 30.0) * (1.0 - smoothstep(0.3, 0.8, abs(lat)));
    col += vec3(0.35, 0.5, 0.8) * lit * gut * 0.6;
    a = clamp(0.03 + 0.45 * fres + 0.4 * row + 0.3 * canal + 0.12 * gut, 0.0, 0.9);
  } else if (vKind < 1.5) {
    // mucus house: a ghost-balloon, brightest at its limb, with a faint veil of filter folds
    float edge = smoothstep(0.0, 0.32, ndv);
    float inner = pow(ndv, 5.0) * (0.6 + 0.4 * sin(lon * 3.0 + lat * 4.0 + vSeed * 20.0));
    float veil = 0.5 + 0.5 * sin(lon * 5.0 + 3.0 * sin(lat * 3.0 + vSeed * 10.0));
    col = (vec3(0.7, 0.72, 0.8) * lit + vec3(0.02, 0.022, 0.03)) * (0.03 + 0.42 * fres * sqrt(fres) + 0.07 * inner + 0.035 * veil);
    a = (0.02 + 0.16 * fres + 0.05 * inner + 0.02 * veil) * edge;
    col *= edge;
  } else {
    // salp: a glass barrel with muscle bands and a warm gut nucleus
    float band = (1.0 - smoothstep(0.2, 0.2 + fwBd, bd)) * (1.0 - smoothstep(0.8, 0.95, abs(lat)));
    vec3 g = vLocal - vec3(0.0, -0.62, 0.0);
    float gut = exp(-dot(g, g) * 14.0);
    col = vec3(0.45, 0.7, 1.0) * lit * (0.12 + 1.4 * fres + 0.45 * band) + uEmber * gut * 1.4;
    a = clamp(0.05 + 0.5 * fres + 0.25 * band + 0.7 * gut, 0.0, 0.9);
  }
  float ff = fogF(dist);
  // (the glow in the water lies between a glass animal and the lens as much as behind it: what its alpha takes
  // out of the glow is put back, or a mucus house 40 m above the colony was a dark disc on the indigo)
  gl_FragColor = vec4(col * (1.0 - ff) + domeCol(-V) * (ff * a) + deepGlow(-V) * (a * (1.0 - 0.6 * ff) * (1.0 - ff)), a * (1.0 - 0.6 * ff));
}`,To=`
attribute vec4 aA;        // v along the body 0..1, wave weight, part id, metres along a ray / arm
attribute vec4 aThin;     // centre-line point and a flag: thin parts never draw under ~1.6 px
#ifdef INSTANCED
attribute vec3 iPos; attribute vec4 iQuat; attribute vec4 iData;   // scale, seed, light gain, late (1 = shown only from u 0.5)
#endif
uniform float uPhase, uFlick, uFlickT, uLate;
varying vec3 vN, vWorld, vColor, vLocal; varying vec4 vA; varying float vWave, vGain;
${Ae}
#if MODE == 0
// the oarfish hangs in a slow S: a two-node wave travelling tailward, a lazy sway of the whole ribbon, the rare flick
vec2 sBend(float v, float seed) {
  float z = sin(v * 5.0 - uTime * 0.7 + seed) * 1.05 * smoothstep(0.05, 0.4, v) + sin(v * 2.1 - uTime * 0.45 + seed * 1.7) * 0.35 * v;
  z += uFlick * sin(v * 5.0 - uFlickT * 12.0) * (0.25 + 0.75 * v);
  float x = sin(v * 3.4 - uTime * 0.5 + seed * 2.3) * 0.45 * smoothstep(0.1, 0.7, v);
  return vec2(x, z);
}
#endif
vec3 disp(vec3 p, vec4 a, float seed, inout vec3 n, out float wave) {
  vec3 d = vec3(0.0);
  wave = 0.0;
#if MODE == 0
  d.xz += sBend(a.x, seed);
  vec2 db = (sBend(a.x + 0.004, seed) - sBend(a.x - 0.004, seed)) * (-125.0 / 8.0);    // slope along y (the body is 8 m)
  n.y -= db.x * n.x + db.y * n.z;
  // the dorsal sail runs waves from head to tail (1.2 m/s); plumes and oars trail and sway from their roots
  float ph = a.x * 27.0 - uTime * 4.2 + seed;
  d.z += (sin(ph) + 0.4 * sin(a.x * 61.0 - uTime * 6.0)) * 0.15 * a.y;
  d.x += cos(ph) * 0.05 * a.y;
  wave = cos(ph) * a.y;
  n.y += cos(ph) * 0.5 * a.y * n.z;
  d.z += sin(uTime * 1.1 - a.w * 1.5 + p.x * 3.0 + seed) * 0.13 * a.w;
  d.x += sin(uTime * 0.8 - a.w * 1.2 + p.z * 5.0 + seed) * 0.08 * a.w;
#elif MODE == 1
  float w2 = a.w * a.w;
  d.x += sin(uTime * 0.8 + a.w * 0.9 + p.z * 4.0 + seed) * 0.035 * w2 + uFlick * sin(a.w * 1.2 - uFlickT * 9.0) * 0.12 * a.w;
  d.z += cos(uTime * 0.65 + a.w * 0.8 + p.x * 4.0 + seed) * 0.035 * w2;
  d.z += sin(uTime * 2.0 + p.y * 5.0) * 0.1 * a.y;
  d.xz += p.xz * (0.05 * sin(uTime * 1.1) * (1.0 - step(0.5, a.z)) * (1.0 - a.x));
#else
  float pulse = 0.5 + 0.5 * sin(uTime * 2.513 + seed);
  pulse *= pulse;
  d.xz -= p.xz * (0.26 * pulse * a.y);
  d.y += 0.06 * pulse * a.y;
  d.xz += vec2(sin(uTime * 1.1 + a.w * 3.0 + seed), cos(uTime * 0.9 + a.w * 2.0 + seed)) * (0.02 * a.w);
#endif
  return d;
}
void main() {
  float seed = uPhase;
#ifdef INSTANCED
  seed = iData.y * 6.28318;
#endif
  vec3 n = normal;
  float wave;
  vGain = 1.0;
#ifdef INSTANCED
  vGain = iData.z;
#endif
  vec3 d = disp(position, aA, seed, n, wave);
  vec3 p = position + d, c = aThin.xyz + d;
#ifdef INSTANCED
  vec3 ip = iPos + vec3(0.0, 0.3 * sin(uTime * 0.25 + seed), 0.0);
  float isc = iData.x * mix(1.0, uLate, iData.w);        // the climb's own jellies arrive while the lens rides the arm
#if MODE == 2
  isc *= 1.0 - smoothstep(60.0, 78.0, distance(ip, cameraPosition));   // 80 m off and seen from over the crown a helmet was a 1 % black block: they grow in from 78 m
#endif
  p = ip + qrot(iQuat, p * isc); c = ip + qrot(iQuat, c * isc); n = qrot(iQuat, n);
#else
  p = (modelMatrix * vec4(p, 1.0)).xyz; c = (modelMatrix * vec4(c, 1.0)).xyz; n = mat3(modelMatrix) * n;
#endif
  if (aThin.w > 0.5) {
    float r = max(length(p - c), 1e-5);
    float dist = length((viewMatrix * vec4(c, 1.0)).xyz);
#if MODE == 2
    p = c + (p - c) * max(1.0, 1.25 * dist / (uPxScale * r));     // a helmet's tentacles: never under 2.5 px (at 1.6 they broke into dotted lines at 20 m)
#else
    p = c + (p - c) * max(1.0, 0.8 * dist / (uPxScale * r));
#endif
  }
  vN = n; vWorld = p; vColor = color; vLocal = position; vA = aA; vWave = wave;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
}`,Do=`
uniform vec3 uSheen, uColonyN;
uniform float uReach2, uCut, uMemb;
varying vec3 vN, vWorld, vColor, vLocal; varying vec4 vA; varying float vWave, vGain;
${Ae}
// the colony as its neighbours take it: a disc of light 54 m wide under them. Its strength falls with HEIGHT above
// the disc (and with distance outside the rim), not with distance from the core, so a jelly beside the bells is
// scarlet and one 25 m up is a black shape; the light arrives from below and from the core's side.
float discAtt(vec3 wp, out vec3 l) {
  vec3 lc = uColonyPos - wp;
  float h = -dot(lc, uColonyN);
  vec3 rv = lc + uColonyN * h;
  float rex = max(length(rv) - ${(17*Q0).toFixed(1)}, 0.0), hh = max(h, 0.0);
  l = lc / max(length(lc), 1e-3) * 0.55 - uColonyN;
  l = l / max(length(l), 1e-4);
  return uColonyI / (1.0 + (hh * hh + rex * rex) / uReach2) * (1.0 - uCut * smoothstep(11.0, 26.0, hh));
}
void main() {
  vec3 Vv = cameraPosition - vWorld; float dist = length(Vv); vec3 V = Vv / max(dist, 1e-4);
  vec3 N = vN / max(length(vN), 1e-4);
  if (dot(N, V) < 0.0) N = -N;
  float ndv = clamp(dot(N, V), 0.0, 1.0), fres = pow(1.0 - ndv, 2.5);
  // (with antialiasing a pixel half-covered by a sliver of a triangle, the oarfish's sail where its body bends, is
  // shaded OUTSIDE the triangle, where the vertex colour and the sail's wave run off to huge values: one such pixel
  // was a white square with a glow round it. Both are clamped, and so is the result.)
  vec3 vc = clamp(vColor, 0.0, 1.0), alb = vc;
  float fq = fwidth(vA.x), fx = fwidth(vLocal.x);          // derivatives before any branch
  vec3 L;
  float att = discAtt(vWorld, L) * vGain;
  float nl = clamp((dot(N, L) + 0.15) / 1.15, 0.0, 1.0);
  vec3 col;
#if MODE == 0
  if (vA.z < 0.5) {
    // mirror-silver flank: dusky oblique bars breaking into blotches, fine spots, the lateral line, the gill cover
    float soft = 1.0 - smoothstep(0.003, 0.012, fq);
    float bars = smoothstep(0.25, 0.95, sin(vA.x * 46.0 + vLocal.x * 5.0 + 1.6 * sin(vA.x * 13.0))) * (0.6 + 0.4 * sin(vLocal.x * 19.0 + vA.x * 29.0));
    float spots = smoothstep(0.75, 0.95, sin(vA.x * 230.0) * sin(vLocal.x * 60.0 + vA.x * 40.0));
    alb *= 1.0 - (0.5 * bars + 0.3 * spots) * soft * smoothstep(0.03, 0.08, vA.x);
    alb *= 1.0 - 0.3 * (1.0 - smoothstep(0.0, 0.012 + fx, abs(vLocal.x - 0.02))) * soft;
    float gy = (vA.x - 0.03) * 8.0;
    float gd = abs(length(vec2(vLocal.x + 0.04, gy + 0.04)) - 0.31);
    alb *= 1.0 - 0.3 * (1.0 - smoothstep(0.0, 0.02 + fx, gd)) * smoothstep(0.1, 0.18, gy) * soft;
    // lit from below: a face turned down to the disc takes its light, a face turned up goes dark, and the mirror
    // picks up the glow under it; the head end, furthest from the light, is the darkest
    float under = clamp(0.45 - 1.15 * N.y, 0.0, 1.3) * (0.35 + 0.65 * nl);
    vec3 R = reflect(-V, N);
    float mirror = smoothstep(0.25, -0.75, R.y);
    float topDark = mix(0.42, 1.1, smoothstep(0.0, 0.6, vA.x)) * (1.0 - 0.65 * smoothstep(0.7, 1.0, vA.x));   // and the thin tail takes little
    float glint = mirror * under;
    float Lm = att * topDark * (0.05 + 0.36 * under + 0.24 * mirror * (0.4 + under));
    Lm = 1.25 * Lm / (1.0 + 0.6 * Lm);                        // a soft knee: the flank never burns out to white
    col = alb * (uColonyCol * Lm + keyLight(N) * 0.6 + domeCol(R) * 1.2) + uColonyCol * (min(att * topDark, 1.2) * 0.08 * glint * glint * glint) + uSheen * ((0.02 + 0.25 * fres) * (0.3 + 0.4 * att));
  } else if (vA.z < 1.5) {
    // crimson sail, plumes and oars: thin membranes. They ride the back, in the body's shadow, so from the lit side
    // they are nearly black; seen against the light (from above, looking down past the fish) they glow through.
    // fin rays: fine ones close up, bundles of four at a distance (they were faded out beyond a few metres, which
    // left the sail one flat sheet); the membrane glows at its root and falls to dark red at its free edge and tips
    float sail = step(vA.w, 0.001), fine = 1.0 - smoothstep(0.6, 2.2, fq * 240.0), coarse = (1.0 - smoothstep(0.6, 2.2, fq * 60.0)) * (1.0 - 0.6 * fine);
    float rays = mix(1.0, 0.72 + 0.28 * sin(vA.x * 240.0), fine * sail) * mix(1.0, 0.62 + 0.38 * sin(vA.x * 60.0 + 0.8 * sin(vA.x * 17.0)), coarse * sail);
    float tip = mix(clamp(vA.w / 1.9, 0.0, 1.0), vA.y, sail);
    rays *= mix(0.82 + 0.18 * sin(vA.w * 30.0), 1.0, sail);                     // the plumes and oars are barred along their length
    // ... and each is a RAY with a vane: a bright rib down its middle, the membrane either side of it darker (the
    // part id runs 1.0 to 1.4 across a plume), so the crest reads as rays at 15 m and not as red blades
    float across = clamp((vA.z - 1.0) * 2.5, 0.0, 1.0);
    rays *= mix(mix(0.42, 1.7, 1.0 - smoothstep(0.1, 0.36, abs(across - 0.5))), 1.0, sail);
    float ripple = 0.8 + 0.5 * clamp(vWave, -1.0, 1.0);
    float through = smoothstep(0.0, 0.75, -dot(V, L));
    float oar = step(0.001, vA.w) * step(vLocal.x, 0.0);                       // the pelvic oars hang under the head, in the light
    float memb = (0.07 + 0.5 * through + 0.4 * oar * nl) * uMemb;
    col = alb * (uColonyCol * (att * memb * ripple) + keyLight(N) * 1.3) * rays * mix(1.35, mix(0.2, 0.26, sail), tip * tip * (3.0 - 2.0 * tip)) + (alb + uColonyCol * 0.25) * (fres * 0.16 * att * (1.0 - 0.5 * tip));
  } else {
    col = alb * (uColonyCol * (att * 0.4 * (0.3 + nl)) + keyLight(N)) + uColonyCol * (att * 0.5 * pow(ndv, 24.0) * step(2.5, vA.z));
  }
#else
  // red animals: black until the colony's light falls on them. Lit underside, dark crown, a thread of rim light.
#if MODE == 1
  float below = clamp(0.38 - 1.15 * N.y, 0.03, 1.35);      // the squid: its underside takes the light, its upper faces almost none
#else
  // the helmet jelly: a thick dark crown, a thin pleated skirt below the groove and a margin of lappets. The light
  // comes up from the disc, so the underside and the skirt take it (a wide wrap: the flesh scatters), the crown none
  float below = clamp(0.56 - 0.86 * N.y, 0.03, 1.25);
  float bellK = step(vA.w, 0.001), marg = smoothstep(0.88, 1.0, vA.x) * bellK;
  nl = clamp((dot(N, L) + 0.6) / 1.6, 0.0, 1.0);
  alb *= mix(0.34, 1.0, smoothstep(0.05, 0.68, vA.x));
#endif
  att = 1.3 * att / (1.0 + 0.5 * att);                     // a soft knee: scarlet, never a flat clipped red
#if MODE == 1
  att *= 0.9 * mix(1.15, 0.2, smoothstep(0.6, 3.3, vLocal.y));   // ... and the light dies up the mantle: lit arms and head, a dark crown
#endif
  vec3 lit = keyLight(N) + uColonyCol * (att * nl * below);
#if MODE == 1
  // the squid: chromatophores mottle the mantle, the arms nearest the light are the brightest, the mantle tip the darkest
  vec3 mq = vLocal * vec3(13.0, 8.0, 13.0);
  mq += 2.2 * sin(mq.yzx * 0.83 + vec3(0.0, 2.1, 4.2)) + 1.1 * sin(mq.zxy * 1.9 + vec3(1.7, 0.3, 5.1));
  float mott = 0.5 + 0.5 * sin(mq.x + 1.3 * sin(mq.z * 0.7)) * sin(mq.y * 1.3 + mq.z * 0.6);
  vec3 bq = vLocal * vec3(4.1, 2.3, 4.1); bq += 1.6 * sin(bq.zxy * 1.1 + vec3(2.0, 0.0, 4.0));
  float blot = 0.5 + 0.5 * sin(bq.x) * sin(bq.y + bq.z);
  alb *= (0.55 + 0.55 * smoothstep(0.25, 0.75, mott) + 0.35 * blot * blot) * mix(1.25, 0.7, smoothstep(-1.5, 3.4, vLocal.y));
#endif
  float through = smoothstep(0.1, 0.9, -dot(V, L));         // seen against the light the flesh glows through
#if MODE == 2
  // glow-through follows thickness: little through the crown or face-on, most at the limb and in the skirt. Seen
  // from above (the helix) this is the whole of a helmet's light, the lit underside being turned away: a lantern
  through *= 0.5 * (mix(0.24, 0.85, smoothstep(0.42, 0.95, vA.x)) + 0.8 * pow(1.0 - ndv, 1.5) * mix(0.45, 1.0, smoothstep(0.2, 0.9, vA.x)));
#else
  through *= 0.6;
#endif
  col = alb * lit * 1.2 + alb * uColonyCol * (att * through) + (alb * 0.6 + uSheen * 0.25) * (fres * (lit + 0.01)) + uColonyCol * (att * fres * fres * 0.14);
#if MODE == 1
  // the rim: the wet skin's edge catches the colony's light all round, brightest on the limb turned to it
  col += (uColonyCol * 0.55 + alb * uColonyCol * 1.6) * (att * fres * (0.25 + 0.75 * nl) * 0.5);
  // the eye: a pale ring that takes the colony's light whichever way it faces, and a point of light in the pupil
  float eye = step(1.5, vA.z);
  col = mix(col, vc * uColonyCol * (0.12 + 0.75 * att) + uColonyCol * (0.9 * att * pow(ndv, 40.0)), eye);
#endif
#if MODE == 2
  // the lappets are thin enough to glow: a bright scalloped margin; and the wet skin's edge takes the last of the
  // glow overhead, so a helmet far above the colony is a rimmed animal, not a black blot
  col += (alb * 1.7 + uColonyCol * 0.07) * uColonyCol * (att * marg * (0.5 + 0.5 * nl));
  // the flesh scatters what reaches it (a dark maroon crown, never a black hole in black water) and the limb of
  // the bell takes a red thread of the colony's light
  col += (alb * 0.05 + vc * (0.05 + 0.42 * fres)) * uColonyCol * (att * bellK) + uColonyCol * (att * marg * marg * 0.12);
  col *= 1.3;
  col += (uKeyCol * 0.8 + uMidCol * 0.45) * (fres * fres * 0.5);
#endif
#endif
  col = clamp(col, 0.0, 6.0);
  col = mix(col, domeCol(-V), fogF(dist));
  gl_FragColor = vec4(col, 1.0);
}`,Fo=`
uniform vec3 uEyePos; uniform float uEyeSize, uEyePull;
varying vec3 vWorld; varying vec4 vClip;
void main() {
  vec3 toCam = cameraPosition - uEyePos; float dC = max(length(toCam), 1e-3);
  vec3 fwd = toCam / dC;
  vec3 rt = cross(vec3(0.0, 1.0, 0.0), fwd); rt = rt / max(length(rt), 1e-4);
  vec3 up = cross(fwd, rt);
  vec3 wp = uEyePos + fwd * min(uEyePull, dC * 0.6) + (rt * position.x + up * position.y) * uEyeSize;   // it stands in front of the whole window
  vWorld = wp;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
  vClip = gl_Position;
}`,Vo=`
uniform vec3 uEyePos, uEyeN, uEyeCol, uEyeFill; uniform float uEyeGain, uEyeA, uEyeB, uEyeR, uTime;
varying vec3 vWorld; varying vec4 vClip;
// the line integral of a Gaussian lens (a wide, b thick) along the ray o + d t: 1 through the middle, edge-on
float lens(vec3 o, vec3 d, float dn, float on, float a, float b, out float tm) {
  float ia = 1.0 / (a * a), ib = 1.0 / (b * b);
  float A = max((1.0 - dn * dn) * ia + dn * dn * ib, 1e-6);
  float B = (dot(o, d) - on * dn) * ia + on * dn * ib;
  float Cq = (dot(o, o) - on * on) * ia + on * on * ib;
  tm = -B / A;
  return sqrt(3.14159 / A) * exp(-max(Cq - B * B / A, 0.0)) / (1.7725 * a);
}
void main() {
  vec3 o = cameraPosition - uEyePos, dv = vWorld - cameraPosition;
  vec3 d = dv / max(length(dv), 1e-4);
  float dn = dot(d, uEyeN), on = dot(o, uEyeN), tm, t2;
  // (1) the plug over the window
  float th = -on / (abs(dn) > 1e-5 ? dn : 1e-5);
  vec3 hp = o + d * th;
  float plug = th > 0.0 ? 1.0 - smoothstep(uEyeR, uEyeR + 2.6, length(hp)) : 0.0;
  plug = max(plug, 1.0 - exp(-6.0 * lens(o, d, dn, on, 5.0, 0.42, t2)));
  // (2) the haze: measured where the ray passes nearest the middle of the cloud
  float I = lens(o, d, dn, on, uEyeA, uEyeB, tm);
  vec3 qm = o + d * tm; float hq = dot(qm, uEyeN); vec3 q = qm - uEyeN * hq;
  float w1 = sin(q.x * 0.9 + 1.6 * sin(q.z * 0.55 + uTime * 0.21) + uTime * 0.13) * sin(q.z * 0.8 - uTime * 0.17 + 1.3 * sin(q.x * 0.4));
  float w2 = sin(q.x * 2.7 - q.z * 1.9 + hq * 4.6 + 1.2 * sin(q.z * 1.3 - uTime * 0.19) + uTime * 0.23) * sin(q.z * 2.3 + q.x * 1.1 - hq * 3.1 + uTime * 0.11);
  float wisp = 1.0 + 0.3 * w1 + 0.25 * w2;
  vec2 ndc = vClip.xy / max(vClip.w, 1e-4);
  float edgeF = (1.0 - smoothstep(0.5, 0.96, abs(ndc.x))) * (1.0 - smoothstep(0.72, 1.0, abs(ndc.y))), lensF = smoothstep(4.0, 10.0, tm);
  float e = 1.3 * (1.0 - exp(-2.0 * I)) * wisp * edgeF * lensF * uEyeGain;
  // what the plug hides it gives back: the animal's own halo, at about the level it has round the eye (uEyeFill), so
  // the window is not a dark blade in the halo either
  float fill = plug * uEyeGain * (0.8 + 0.2 * w1) * lensF * mix(1.0, edgeF, 0.6) * (1.0 - 0.6 * min(e / 1.3, 1.0));
  gl_FragColor = vec4(uEyeCol * e + uEyeFill * fill, min(max(plug * 0.97, 0.22 * min(e, 1.0)) * uEyeGain, 1.0));
}`,Po=`
attribute vec3 iBase; attribute vec4 iData;          // iData: size factor, seed, brightness, -
uniform vec3 uCenter; uniform vec2 uNear, uWrapH; uniform float uRise, uGain, uAng, uSign;
varying vec2 vUv; varying float vA, vSeed, vPx;
${Ae}
void main() {
  float seed = iData.y, H = mix(uWrapH.x, uWrapH.y, iData.w);
  vec3 p = iBase;
  float y = mod(p.y - uCenter.y + uRise * (0.75 + 0.5 * fract(seed * 7.3)) + H * 0.5, H);
  float edge = clamp(min(y, H - y) / (H * 0.12), 0.0, 1.0);
  p.y = uCenter.y + y - H * 0.5;
  p.xz += vec2(sin(uTime * 0.5 + seed * 40.0), cos(uTime * 0.43 + seed * 23.0)) * 0.3;
  float a1 = (fract(seed * 13.7) - 0.5) * 0.8 + 0.14 * sin(uTime * (2.0 + 2.0 * fract(seed * 5.1)) + seed * 60.0), a2 = fract(seed * 29.3) * 6.2832;
  vec3 ax = vec3(sin(a1) * cos(a2), cos(a1) * uSign, sin(a1) * sin(a2));
  vec4 mv = viewMatrix * vec4(p, 1.0);
  float dist = max(length(mv.xyz), 0.05);
  vec2 a2d = (viewMatrix * vec4(ax, 0.0)).xy; float al = length(a2d);
  a2d = al > 1e-4 ? a2d / al : vec2(0.0, 1.0);
  // half its length: an angle (uAng times its size factor) while it is far, a true 26-34 cm once that is larger, never under 1.5 px
  float hl = max(max(min(0.13 * iData.x, 0.17), uAng * dist * iData.x) * max(al, 0.6), 1.5 * dist / uPxScale), hw = hl * 0.3;
  vec3 vp = mv.xyz + vec3(a2d * (position.y * hl) + vec2(a2d.y, -a2d.x) * (position.x * hw), 0.0);
  gl_Position = projectionMatrix * vec4(vp, 1.0);
  vUv = vec2(position.x * (fract(seed * 3.7) < 0.5 ? 1.0 : -1.0), position.y);
  vPx = hl * uPxScale / dist;
  vA = iData.z * edge * smoothstep(uNear.x, uNear.y, dist) * uGain * (1.0 - 0.75 * fogF(dist));
  vSeed = seed;
}`,No=`
uniform vec3 uPhoto, uBodyCol;
varying vec2 vUv; varying float vA, vSeed, vPx;
${Ae}
void main() {
  float x = vUv.x, y = vUv.y;
  float w = 0.92 * pow(max(1.0 - y * y, 0.0), 0.6) * (0.5 + 0.5 * smoothstep(-1.0, 0.25, y)) * (0.78 + 0.4 * fract(vSeed * 11.3));     // a spindle, fuller toward the head (+y); slim fish and deep ones
  w = max(w, (1.0 - smoothstep(-1.0, -0.6, y)) * (0.3 + 0.6 * abs(x)));                             // the forked tail
  float body = 1.0 - smoothstep(w - 0.3, w + 0.12, abs(x));
  float bx = x - 0.62 * w;                                                                          // the belly's edge
  float big = smoothstep(7.0, 10.0, vPx);                                                           // over 14-20 px long: six beads, half as bright again
  float row = exp(-bx * bx / mix(0.035, 0.05, big)) * (1.0 - smoothstep(0.6, 0.85, abs(y + 0.05)));
  float bc = 0.5 + 0.5 * cos(y * mix(12.0, 23.0, big) + vSeed * 6.0);
  float bead = mix(0.75, 0.15 + 1.25 * bc * bc, smoothstep(3.0, 6.0, vPx)) * (1.0 + 0.55 * smoothstep(5.0, 9.0, vPx));   // a thread of light when small, beads when large
  float tw = 0.72 + 0.28 * sin(uTime * 3.0 + vSeed * 50.0);
  float lamp = exp(-((x + 0.15) * (x + 0.15) * 5.0 + (y - 0.7) * (y - 0.7) * 34.0));
  vec3 col = uBodyCol * body + uPhoto * (row * bead * tw + (0.15 + 0.7 * fract(vSeed * 17.9)) * lamp) * smoothstep(0.0, 0.35, body + row);
  gl_FragColor = vec4(col * vA, body * 0.9 * min(vA * 1.5, 1.0));
}`;function Lo(){const i=new u.BufferGeometry;return i.setAttribute("position",new u.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),i.setIndex([0,1,2,0,2,3]),i}function T0(i,r,F){const H=new u.InstancedBufferGeometry;H.index=i.index;for(const B in i.attributes)H.setAttribute(B,i.attributes[B]);for(const B in F)H.setAttribute(B,new u.InstancedBufferAttribute(F[B][0],F[B][1]));return H.instanceCount=r,H.boundingSphere=new u.Sphere(new u.Vector3,1e5),H}function Ma(i,r,F){const H=[],B=[],q=[],U=[],x=l=>{const V=W((.15-l)/.65,0,1);return V*V};for(const[l,V,f,G=0]of i)for(let M=0;M<r;M++){const D=M/r*Math.PI*2,N=Math.cos(D),S=Math.sin(D);H.push(N*f,G+S*V,l);const v=N/Math.max(f,.001),j=S/Math.max(V,.001),J=Math.hypot(v,j);B.push(v/J,j/J,0),q.push(x(l),0)}for(let l=0;l<i.length-1;l++)for(let V=0;V<r;V++){const f=l*r+V,G=l*r+(V+1)%r,M=f+r,D=G+r;U.push(f,G,M,G,D,M)}for(const l of F){const V=H.length/3;for(const f of l)H.push(0,f[0],f[1]),B.push(1,0,0),q.push(x(f[1])*1.3,1);for(let f=1;f<l.length-1;f++)U.push(V,V+f,V+f+1)}const d=new u.BufferGeometry;return d.setAttribute("position",new u.Float32BufferAttribute(H,3)),d.setAttribute("normal",new u.Float32BufferAttribute(B,3)),d.setAttribute("aFish",new u.Float32BufferAttribute(q,2)),d.setIndex(U),d}function qo(i,r){const F=[],H=[];for(let q=0;q<=r;q++)for(let U=0;U<i;U++){const x=q/r*Math.PI,d=U/i*Math.PI*2,l=Math.max(Math.sin(x),.02);F.push(Math.cos(d)*l,Math.cos(x),Math.sin(d)*l)}for(let q=0;q<r;q++)for(let U=0;U<i;U++){const x=q*i+U,d=q*i+(U+1)%i,l=x+i,V=d+i;H.push(x,d,l,d,V,l)}const B=new u.BufferGeometry;return B.setAttribute("position",new u.Float32BufferAttribute(F,3)),B.setAttribute("normal",new u.Float32BufferAttribute(F.slice(),3)),B.setIndex(H),B}function Ct(){const i=[],r=[],F=[],H=[],B=[],q=[],U={v(x,d,l,V,f){return i.push(x[0],x[1],x[2]),r.push(d[0],d[1],d[2]),F.push(l.r,l.g,l.b),H.push(V[0],V[1],V[2],V[3]),f?B.push(f[0],f[1],f[2],1):B.push(0,0,0,0),i.length/3-1},tri(x,d,l){q.push(x,d,l)},loft(x,d,l=!1){const V=i.length/3;for(const f of x)for(let G=0;G<d;G++){const M=G/d*Math.PI*2,D=Math.cos(M),N=Math.sin(M),S=D/Math.max(f.rx,1e-4),v=N/Math.max(f.rz,1e-4),j=[f.ax[0]*S+f.az[0]*v,f.ax[1]*S+f.az[1]*v,f.ax[2]*S+f.az[2]*v],J=Math.hypot(j[0],j[1],j[2])||1;U.v([f.c[0]+f.ax[0]*D*f.rx+f.az[0]*N*f.rz,f.c[1]+f.ax[1]*D*f.rx+f.az[1]*N*f.rz,f.c[2]+f.ax[2]*D*f.rx+f.az[2]*N*f.rz],[j[0]/J,j[1]/J,j[2]/J],typeof f.col=="function"?f.col(M):f.col,f.a,l?f.c:null)}for(let f=0;f<x.length-1;f++)for(let G=0;G<d;G++){const M=V+f*d+G,D=V+f*d+(G+1)%d,N=M+d,S=D+d;q.push(M,D,N,D,S,N)}},ribbon(x,d,l,V,f,G,M,D=!1){const N=i.length/3;for(let S=0;S<x.length;S++){const v=D?[(x[S][0]+d[S][0])/2,(x[S][1]+d[S][1])/2,(x[S][2]+d[S][2])/2]:null;U.v(x[S],l,V,G(S),v),U.v(d[S],l,f,M(S),v)}for(let S=0;S<x.length-1;S++){const v=N+S*2;q.push(v,v+1,v+2,v+1,v+3,v+2)}},disc(x,d,l,V,f,G,M,D){const N=U.v(x,d,G,D);for(let S=0;S<10;S++){const v=S/10*Math.PI*2;U.v([x[0]+(l[0]*Math.cos(v)+V[0]*Math.sin(v))*f,x[1]+(l[1]*Math.cos(v)+V[1]*Math.sin(v))*f,x[2]+(l[2]*Math.cos(v)+V[2]*Math.sin(v))*f],d,M,D)}for(let S=0;S<10;S++)q.push(N,N+1+S,N+1+(S+1)%10)},build(){const x=new u.BufferGeometry;return x.setAttribute("position",new u.Float32BufferAttribute(i,3)),x.setAttribute("normal",new u.Float32BufferAttribute(r,3)),x.setAttribute("color",new u.Float32BufferAttribute(F,3)),x.setAttribute("aA",new u.Float32BufferAttribute(H,4)),x.setAttribute("aThin",new u.Float32BufferAttribute(B,4)),x.setIndex(q),x.boundingSphere=new u.Sphere(new u.Vector3,12),x}};return U}const D0=[1,0,0],F0=[0,0,1];function Ca(i,r=8){const F=Ct(),H=r/2,B=new u.Color(.8,.83,.88),q=new u.Color(.2,.27,.42),U=new u.Color(.92,.95,.98),x=new u.Color(.006,.008,.015),d=new u.Color(.95,.97,1),l=new u.Color(.5,.56,.66),V=i.clone().multiplyScalar(1.15),f=i.clone().lerp(new u.Color(1,.25,.2),.35).multiplyScalar(1.5),G=[[-.013,.03,.012,-.07],[-.009,.1,.036,-.06],[-.002,.165,.055,-.04],[.01,.245,.072,-.015],[.03,.31,.084,0],[.07,.345,.088,0],[.15,.335,.08,0],[.35,.275,.062,0],[.6,.185,.042,0],[.82,.1,.024,0],[.95,.04,.011,0],[1,.012,.004,0]],M=(A,p)=>{for(let C=1;C<G.length;C++)if(A<=G[C][0])return X(G[C-1][p],G[C][p],W((A-G[C-1][0])/(G[C][0]-G[C-1][0]),0,1));return G[G.length-1][p]},D=[-.013,-.009,-.002,.004,.01,.02];for(let A=0;A<=50;A++)D.push(.03+.97*Math.pow(A/50,1.15));const N=D.map(A=>({c:[M(A,3),H-r*A,0],ax:D0,az:F0,rx:M(A,1),rz:M(A,2),a:[Math.max(A,0),0,0,0],col:p=>{const C=Math.cos(p);return B.clone().lerp(q,m(.5,1,C)).lerp(U,m(-.55,-1,C))}}));F.loft(N,12);for(const A of[1,-1]){const p=A*M(.027,2)*.985;F.disc([-.04,H-r*.027,p],[0,0,A],[1,0,0],[0,1,0],.05,d,l,[.027,0,2,0]),F.disc([-.04,H-r*.027,p+A*.004],[0,0,A],[1,0,0],[0,1,0],.026,x,x,[.027,0,3,0])}const S=[],v=[],j=[],J=300;for(let A=0;A<=J;A++){const p=A/J,C=X(.006,.985,p),pe=(C<.08?X(.95,.72,(C-.006)/.074):X(.72,.16,Math.pow((C-.08)/.905,.8)))*m(0,.012,p)*(1-m(.965,1,p))*(.93+.07*Math.abs(Math.sin(A*Math.PI/8))),de=M(C,3)+M(C,1)*.9;S.push([de,H-r*C,0]),v.push([de+pe,H-r*C-.12*pe,0]),j.push(C)}F.ribbon(S,v,[0,0,1],V,f,A=>[j[A],0,1,0],A=>[j[A],1,1,0]);const Y=(A,p,C,K,pe,de)=>{const oe=[],Oe=[],Ee=[],_e=Math.hypot(p[0],p[1],p[2])||1,ge=[-p[1],p[0],0],Te=Math.hypot(ge[0],ge[1])||1;for(let De=0;De<=12;De++){const ye=De/12,Ze=ye*C,Pe=K+(pe-K)*m(.58,.8,ye)*(1-.9*m(.9,1,ye)),Ne=[A[0]+p[0]/_e*Ze+de[0]*ye*ye*C,A[1]+p[1]/_e*Ze+de[1]*ye*ye*C,A[2]+p[2]/_e*Ze+de[2]*ye*ye*C];oe.push([Ne[0]-ge[0]/Te*Pe,Ne[1]-ge[1]/Te*Pe,Ne[2]]),Oe.push([Ne[0]+ge[0]/Te*Pe,Ne[1]+ge[1]/Te*Pe,Ne[2]]),Ee.push(Ze)}F.ribbon(oe,Oe,[0,0,1],V,f,De=>[.02,0,1,Ee[De]],De=>[.02,0,1.4,Ee[De]],!0)};for(let A=0;A<8;A++){const p=A/7,C=X(.08,1.2,p);Y([.06+.11*p,H+.03-.22*p,0],[Math.sin(C),Math.cos(C),(A%2?1:-1)*.07],X(2.7,1.3,p),.02,.13,[.28,-.1,(A%3-1)*.14])}for(const A of[1,-1])Y([-.24,H-r*.07,A*.04],[-.36,-.92,A*.18],2.6,.016,.17,[-.22,.12,A*.2]);return F.build()}function Sa(i){const r=Ct(),F=i.clone().multiplyScalar(1.1),H=i.clone().multiplyScalar(.55),B=new u.Color(.005,.005,.01),q=new u.Color(.8,.82,.75),U=[[3.5,.02],[3.3,.14],[2.9,.25],[2.3,.31],[1.8,.29],[1.5,.25],[1.46,.2],[1.3,.2],[1.1,.17],[1,.13]];r.loft(U.map(([d,l],V)=>({c:[0,d,0],ax:D0,az:F0,rx:l*1.3,rz:l*1.2,a:[V/(U.length-1),0,0,0],col:f=>F.clone().lerp(H,.5+.5*Math.sin(f*3+d*5))})),10);for(const d of[1,-1]){const l=[],V=[];for(let f=0;f<=6;f++){const G=f/6,M=X(3.45,2.5,G);l.push([d*.12*Math.sin(G*3.14),M,0]),V.push([d*(.12+.36*Math.sin(Math.pow(G,.8)*3.14)),M,0])}r.ribbon(l,V,[0,0,1],F,H,()=>[.1,0,0,0],()=>[.1,1,0,0])}for(const d of[1,-1])r.disc([0,1.2,d*.262],[0,0,d],[1,0,0],[0,1,0],.13,B,q,[.5,0,2,0]);const x=(d,l,V,f,G,M)=>{const D=[],N=l>3?14:8,S=Math.cos(d),v=Math.sin(d);for(let j=0;j<=N;j++){const J=j/N,Y=J*l,A=.1+M*Math.sin(Math.min(J*2.2,1.57)),p=X(V,f,J)*(G&&J>.82?3.2*Math.sin((J-.82)/.18*3.14)+1:1);D.push({c:[S*A,1.02-Y,v*A],ax:D0,az:F0,rx:p,rz:p,a:[.6,0,0,Y],col:J>.5?H:F})}r.loft(D,5,!0)};for(let d=0;d<8;d++)x(d/8*Math.PI*2+.2,2.2+.3*(d%2),.078,.013,!1,.26);return x(1.2,4.6,.032,.02,!0,.1),x(4.4,4.4,.032,.02,!0,.1),r.build()}function Bo(i){const r=Ct(),F=i.clone().multiplyScalar(1.2),H=i.clone().multiplyScalar(.5),B=[[.56,.012,0],[.5,.1,.05],[.38,.18,.2],[.22,.235,.45],[.12,.25,.6],[.095,.215,.65],[.05,.25,.8],[-.04,.275,.92],[-.13,.27,1]],q=[];for(const[M,D,N]of B)q.push({c:[0,M,0],ax:D0,az:F0,rx:D,rz:D,a:[N,N,0,0],col:S=>H.clone().lerp(F,N*(.75+.25*Math.cos(S*16)))});const U=q[q.length-1];r.loft(q.slice(0,-1),32);const x=128,d=[[],[],[]],l=[[],[],[]],V=H.clone().multiplyScalar(.55),f=F.clone().multiplyScalar(1.45);for(let M=0;M<=x;M++){const D=M/x*Math.PI*2,N=Math.pow(Math.abs(Math.sin(D*8)),.55),S=Math.cos(D),v=Math.sin(D),j=.275,J=U.rx+.006*N,Y=U.rx-.034*N;d[0].push([S*j,-.04,v*j]),d[1].push([S*J,-.055-.06*N,v*J]),d[2].push([S*Y,-.062-.125*N,v*Y]),l[0].push(F.clone().lerp(V,.5*(1-N))),l[1].push(F.clone().lerp(V,1-N)),l[2].push(f.clone().lerp(V,1-N))}for(let M=0;M<2;M++)for(let D=0;D<x;D++){const N=(D+.5)/x*Math.PI*2,S=[Math.cos(N),.1-.35*M,Math.sin(N)],v=.92+.04*M,j=.96+.04*M,J=r.v(d[M][D],S,l[M][D],[v,v,0,0]),Y=r.v(d[M][D+1],S,l[M][D+1],[v,v,0,0]),A=r.v(d[M+1][D],S,l[M+1][D],[j,j,0,0]),p=r.v(d[M+1][D+1],S,l[M+1][D+1],[j,j,0,0]);r.tri(J,Y,A),r.tri(Y,p,A)}for(let M=0;M<12;M++){const D=M/12*Math.PI*2+.13,N=Math.cos(D),S=Math.sin(D),v=[],j=Math.sin(M*12.9898+4.1)*43758.5453,J=j-Math.floor(j),Y=Math.sin(M*78.233+1.7)*24634.6345,A=Y-Math.floor(Y),p=1.28+.34*J,C=.11+.08*A,K=(J-.5)*.32,pe=.05+.1*A;for(let de=0;de<=7;de++){const oe=de/7*p,Oe=.225+.4*oe-C*oe*oe,Ee=K*oe*oe;v.push({c:[N*Oe-S*Ee,.1+.92*oe-pe*oe*oe*oe/p,S*Oe+N*Ee],ax:D0,az:F0,rx:X(.016,.004,de/7),rz:X(.016,.004,de/7),a:[.6,.15,0,oe],col:de<3?F:H})}r.loft(v,3,!0)}const G=r.build();return G.computeVertexNormals(),G}var Wo={id:"longest-animal",name:"The Longest Animal",category:"ocean",weirdness:.25,media:["underwater"],async build(i){const r=i.rng,F=i.vary||{},H=i.core.bell,B=W(i.quality?.detail??1,.5,1),q=W(F.density??1,.7,1.3),U=F.mood??.5,x=new u.Scene,d=e=>new u.Color(e),l=(e,t,a)=>new u.Vector3(e,t,a),V=["ghost","gold","blue"],f=[{weather:"blizzard, deep halo",snow:1.35,haloR2:24,haloK:1,fog:1,houses:9},{weather:"a drift of mucus houses",snow:.9,haloR2:11,haloK:.95,fog:.94,houses:44},{weather:"thin snow, crisp halo",snow:.72,haloR2:5,haloK:1.25,fog:.84,houses:7}],G=["pair","squid","oarfish"],M={ghost:["#c9c4e6","#8e86c8"],gold:["#d6d9e2","#a0a8c0"],blue:["#cfd6e6","#93a2c4"]},D=V[Math.min(2,Math.floor(r()*3))],N=r.chance(.6)?"open":"tight",S=i.core.makeRng(i.core.hashSeed((i.seed??1)+":longest-animal:look")),v={cast:D,...f[Math.min(2,Math.floor(S()*3))],figure:G[Math.min(2,Math.floor(S()*3))],snowTint:M[D]};v.haloR2*=X(.75,1.4,U);const j=F.hour==="dawn"||F.hour==="day"||F.hour==="night"?F.hour:"dusk",Y={dusk:{glow:"#6E4FA6",deep:"#2B3FA8",gain:1,reach:1,fishSign:1,pillar:"fish"},dawn:{glow:"#8E3F84",deep:"#4A3F9C",gain:1,reach:1,fishSign:-1,pillar:"fish"},day:{glow:"#2658CC",deep:"#1F48B8",gain:1.3,reach:.85,fishSign:1,pillar:"salp"},night:{glow:ue[2],deep:"#2B3FA8",gain:0,reach:1,fishSign:1,pillar:"fish"}}[j],A=!!F.rare,p=await po(i,{palette:ue,cast:v.cast,coil:N,rare:A,startleAt:d0,farGlow:.22,dustDensity:W(q*v.snow,.6,1.4)});await i.yield();const C=l(A0,xt,E0),K=l(go,yo,wo).normalize(),pe=l(-73,-116,-83).sub(C);pe.addScaledVector(K,-pe.dot(K)).normalize();const de=new u.Matrix4().makeBasis(new u.Vector3().crossVectors(K,pe).normalize(),K,pe);p.object.quaternion.setFromRotationMatrix(de),p.object.position.copy(C),p.object.scale.setScalar(Q0),x.add(p.object),p.object.updateMatrixWorld(!0);const oe=e=>e.clone().applyMatrix4(p.object.matrixWorld),Oe=new u.Matrix3().setFromMatrix4(de.clone().transpose()).multiplyScalar(1/Q0),Ee=p.info.coil==="tight",Ce=l(0,1,0),_e=(e,t,a)=>oe(p.anchors.armInboard(e,-t,-a)),ge=e=>oe(p.anchors.armPoint(e)),Te=(e,t,a)=>{const o=ge(e),s=l(0,0,0).crossVectors(Ce,ge(e+.02).sub(ge(e-.02))).normalize();return s.dot(C.clone().sub(o))<0&&s.negate(),o.addScaledVector(s,t).add(l(0,-a,0))},De={len:104.4,l1:24,l2:10,pc:.5,over:40,pe:.5,lev:16,axis:36},ye=Math.atan2(-K.x,-K.z),Ze=Math.asin(-K.y),Pe=(e,t,a,o,s,n=0)=>{const h=y=>{y=W(y,0,1);const Z=1/(1-.22);return y<.22?.5*Z*y*y/.22:y>.78?1-.5*Z*(1-y)*(1-y)/.22:.5*Z*.22+Z*(y-.22)};let w=ye-t;for(;w<0;)w+=Math.PI*2;for(;w>Math.PI*2;)w-=Math.PI*2;const b=320,k=o.len/b,T=y=>m(o.l1-6,o.l1+6,y)*(1-m(o.len-o.l2-6,o.len-o.l2+6,y));let I=0;for(let y=0;y<b;y++)I+=T((y+.5)*k)*k;const z=y=>n*(1-m(0,9,y));let te=0;for(let y=0;y<b;y++)te+=z((y+.5)*k)*k;const $=(w-te)/Math.max(I,1e-6),g=e.clone(),L=[];let R=t;for(let y=0;y<b;y++){const Z=(y+.5)*k;R+=(T(Z)*$+z(Z))*k;const _=a+(o.pc-a)*h(Z/12)+(o.pe-o.pc)*h((Z-(o.len-o.over-o.lev))/o.lev)+(Ze-o.pe)*h((Z-(o.len-o.over))/o.over);g.x+=Math.sin(R)*Math.cos(_)*k,g.z+=Math.cos(R)*Math.cos(_)*k,g.y+=Math.sin(_)*k,s&&L.push(g.clone())}return{run:L,miss:C.clone().addScaledVector(K,o.axis).sub(g)}},Ne=async(e,t,a,o,s)=>{const n={...De},c=["l1","l2","pc"],h=[.5,.5,.01],w=[6,6,.1],b=[[2,40],[-10,60],[.2,.86]],k=new u.Matrix3,T=l(0,0,0);for(let L=0;L<30;L++){L%4===3&&await i.yield();const R=Pe(e,t,a,n,!1,s).miss;if(R.length()<.02)break;const y=[];for(let _=0;_<3;_++){const se={...n};se[c[_]]+=h[_],y.push(Pe(e,t,a,se,!1,s).miss.sub(R).multiplyScalar(1/h[_]))}if(k.set(y[0].x,y[1].x,y[2].x,y[0].y,y[1].y,y[2].y,y[0].z,y[1].z,y[2].z),Math.abs(k.determinant())<1e-9)break;T.copy(R).negate().applyMatrix3(k.invert());const Z=[T.x,T.y,T.z];for(let _=0;_<3;_++)n[c[_]]=W(n[c[_]]+W(Z[_],-w[_],w[_])*.6,b[_][0],b[_][1])}const{run:I,miss:z}=Pe(e,t,a,n,!0,s),te=I.length,$=Math.round(n.len/o),g=[];for(let L=1;L<$;L++){const R=L*te/$-1,y=Math.min(te-2,Math.floor(R));g.push(I[y].clone().lerp(I[y+1],R-y).addScaledVector(z,(R+1)/te))}for(const L of[1,.72,.48,.24,0])g.push(C.clone().addScaledVector(K,n.axis*L));return{pts:g,P:n,miss:z.length()}},St=3.4,za=1.25,ka=1.35,Aa=[[.3,.47,.5],[.6,.3,1.35],[.9,-.7,2.7]],Ea=[1.2,-2.7,4.6],Je=[0,0,0,0,-1.15,.65,-1.35,0,-1.6,-.7],Se=[[-21,-13],[-22,-25],[-23,-37],[-40,-50],[-70,-52]],Y0=async(e,t,a)=>{const o=za+t,s=_e(.14,Je[4]-e,Je[5]+.5*e),n=(ne,He,u0,Ve)=>{const k0=u0*Math.PI/180,bt=Ve*Math.PI/180;return ne.clone().add(l(-Math.sin(k0)*Math.cos(bt)*He,-Math.sin(bt)*He,-Math.cos(k0)*Math.cos(bt)*He))},c=n(s,4.7,Se[0][0],Se[0][1]),h=n(c,4.5,Se[1][0],Se[1][1]),w=n(h,7.2,Se[2][0],Se[2][1]),b=n(w,14.6,Se[3][0],Se[3][1]),k=n(b,18.7,Se[4][0],Se[4][1]),T=[[0,0,0],[0,0,-31],[0,-3,-62],[-6,-19,-81],[-20,-41,-97],k,b,w,h,c,s,_e(.32,Je[6]-e,Je[7]),_e(.5,Je[8],Je[9]),Te(.72,o+.85,.7),Te(.95,o+.4,1.1)].map(ne=>ne.isVector3?ne:l(ne[0],ne[1],ne[2])),I=T[T.length-1];for(let ne=0;ne<=8;ne++)T.push(Te(X(1.2,St,ne/8),o+.4*m(5,8.5,ne),ka-.35*m(6,8.3,ne)));const z=T[T.length-1],te=T[T.length-1].y,$=([ne,He,u0])=>{const Ve=Te(St+ne,o+He,0);return Ve.y=te+u0,Ve};for(const ne of Aa)T.push($(ne));const g=$(Ea),L=g.clone().sub(T[T.length-1]),R=T[T.length-1].clone().sub(T[T.length-2]);let y=Math.atan2(L.x,L.z)-Math.atan2(R.x,R.z);y=W(Math.atan2(Math.sin(y),Math.cos(y)),0,.4);const Z=L.length();L.normalize();const _=await Ne(g,Math.atan2(L.x,L.z)+.5*y,Math.asin(L.y),a,y/Z);await i.yield();const se=mo([...T,g,..._.pts]);await i.yield();const he=ne=>{let He=1e9,u0=0;for(let Ve=0;Ve<=800;Ve++){const k0=se.pointAt(Ve/800,Z0).distanceToSquared(ne);k0<He&&(He=k0,u0=Ve/800)}return u0},Ie=he(c),wt=he(I);return await i.yield(),se.marks={tip:Ie,ride:wt,rideEnd:he(z),lift:he(g),join:1-_.P.axis/se.length,helix:_.P,miss:_.miss},se},Ta=.41,zt=[],$0=[],Z0=l(0,0,0);for(let e=0;e<=6.4;e+=.02)for(const t of[1,1.02]){const a=p.anchors.armPoint(e);a.x*=t,a.z*=t,zt.push(e),$0.push(oe(a))}const J0=async e=>{let t=0,a=0,o=1e9;const s=e.marks.tip-.035,n=Math.round((e.marks.lift+.03-s)/.001);for(let c=0;c<=n;c++){c%40===39&&await i.yield(),e.pointAt(s+c*.001,Z0);let h=1e9,w=0;for(let T=0;T<$0.length;T++){const I=$0[T].distanceToSquared(Z0);I<h&&(h=I,w=zt[T])}const b=Math.sqrt(h),k=(w<Ta?1.05:1.6)-b;b<o&&(o=b),k>0&&(w<.6?t=Math.max(t,k):a=Math.max(a,k))}return{head:t,ride:a,min:o}};let f0=2.5,V0=0,P0=0,P=await Y0(0,0,f0);await i.yield();let We=await J0(P);for(let e=0;e<8&&(We.head>0||We.ride>0);e++)We.head>0&&(V0+=.15),We.ride>0&&(P0+=.15),await i.yield(),P=await Y0(V0,P0,f0),await i.yield(),We=await J0(P);await i.yield();const N0=l(0,0,0),v0=l(0,0,0),kt=e=>{let t=0,a=1e9,o=-1e9;const s=e.marks.rideEnd-.02,n=Math.round((e.marks.join-.004-s)/.001);for(let c=0;c<=n;c++){const h=s+c*.001;e.tangentAt(h,N0),e.tangentAt(h+.001,v0),t=Math.max(t,N0.angleTo(v0)*180/Math.PI/(.001*X0)),e.tangentAtDist(h*e.length+14,v0);const w=N0.z*v0.x-N0.x*v0.z;a=Math.min(a,w),o=Math.max(o,w)}return{rate:t,lo:a,hi:o,ok:t<56&&(a>=0||o<=0)}};let m0=kt(P);for(let e=0;e<2&&!m0.ok;e++)f0*=.6,await i.yield(),P=await Y0(V0,P0,f0),await i.yield(),We=await J0(P),m0=kt(P);const p0=P.length,E=P.marks,et={ride:.36,desc:.3,top:.2},Da=e=>m(E.ride-.03,E.ride+.03,e)*(1-m(E.lift+.075,E.lift+.135,e)),Fa=e=>m(E.lift+.075,E.lift+.135,e)*(1-m(E.join-.015,E.join+.025,e)),Va=e=>m(.1,.14,e)*(1-m(.195,.235,e)),L0=e=>(1-et.ride*Da(e)-et.top*Fa(e))*(1-et.desc*Va(e));let At=0;for(let e=0;e<64;e++)At+=2/(L0(e/64)+L0((e+1)/64))/64;const Et=(e,t)=>t*X0/(L0(e)*At);P.guard={min:We.min,headUp:V0,sideUp:P0,topRate:m0.rate,topTurn:[m0.lo,m0.hi],topStep:f0,marks:E},P.stage={hero:p,toWorld:oe,C:l(A0,xt,E0),look:v},await i.yield();const Tt=459.73,ze=e=>e*Tt/p0,we=[];for(let e=0;e<=72;e++)we.push(oe(p.anchors.armPoint(.05+e/72*5)));const be=l(0,0,0),Le=l(0,0,0),e0=l(0,0,0),Pa=(e,t)=>{P.posAtDist(e,be);let a=1e9;for(let o=0;o<we.length-1;o++){Le.subVectors(we[o+1],we[o]);const s=W(e0.subVectors(be,we[o]).dot(Le)/Math.max(Le.lengthSq(),1e-6),0,1);e0.copy(we[o]).addScaledVector(Le,s);const n=e0.distanceToSquared(be);n<a&&(a=n,t.copy(e0))}return t},Na=e=>{P.pointAt(e,be);let t=1e9,a=0;for(let o=0;o<we.length-1;o++){Le.subVectors(we[o+1],we[o]);const s=W(e0.subVectors(be,we[o]).dot(Le)/Math.max(Le.lengthSq(),1e-6),0,1),n=e0.copy(we[o]).addScaledVector(Le,s).distanceToSquared(be);n<t&&(t=n,a=.05+(o+s)/72*5)}return p.armS(a)},q0=l(0,0,0),le=l(0,0,0),Dt=(e,t,a)=>{const o=W((a-e)/(t-e),0,1),s=xe.E,n=1/(1-s);return o<s?.5*n*o*o/s:o>1-s?1-.5*n*(1-o)*(1-o)/s:.5*n*s+n*(o-s)},xe={E:.25,l:24,r:24,a0:.725,a1:.775,b0:.787,b1:.855,c0:.872,c1:.912},Ft=(e,t)=>{const a=m(E.tip-.004,E.tip+.045,e);return Pa(e*p0+X(4.2,5.6,a),t),t.y-=.6*a,t.lerp(C,1-m(E.tip-.075,E.tip-.004,e))},O={a:E.rideEnd-.08,b:E.lift+.15,du:5e-4,cap:37,acc:22,capP:14,accP:16,gain:1.6,H:null,P:null,end:0};{const e=g=>Math.atan2(g.x,g.z)*180/Math.PI,t=g=>Math.asin(W(g.y/Math.max(g.length(),1e-6),-1,1))*180/Math.PI,a=(g,L)=>L.copy(C).sub(P.pointAt(g,be)),o=(g,L)=>(Ft(g,L),L.sub(P.pointAt(g,be))),s=Math.round((O.b-O.a)/O.du),n=new Float32Array(s+1),c=new Float32Array(s+1),h=O.du,w=g=>(g=((g+60)%360+360)%360-60,g);let b=e(o(O.a,le)),k=t(le);const T=Et(O.a,h);let I=w(b-e(o(O.a-h,le)))/T,z=(k-t(le))/T,te=e(a(O.a-h,le)),$=t(le);I=W(I,0,O.cap),O.end=O.b;for(let g=0;g<=s;g++){const L=O.a+g*h,R=Et(L,h),y=e(a(L,le)),Z=t(le),_=w(y-te)/R,se=(Z-$)/R;te=y,$=Z,n[g]=b,c[g]=k;const he=w(y-b),Ie=Z-k,wt=W(_+O.gain*he,0,O.cap),ne=W(se+O.gain*Ie,-O.capP,O.capP);I+=W(wt-I,-O.acc*R,O.acc*R),z+=W(ne-z,-O.accP*R,O.accP*R),b+=I*R,k+=z*R}O.H=n,O.P=c,O.miss=[w(e(a(O.b,le))-b),t(le)-k]}await i.yield();const La=(e,t)=>{if(t<O.a)return Ft(t,q0);if(P.pointAt(t,be),le.copy(C).sub(be).normalize(),t<O.b){const o=(t-O.a)/O.du,s=Math.min(O.H.length-2,Math.floor(o)),n=o-s,c=X(O.H[s],O.H[s+1],n)*Math.PI/180,h=X(O.P[s],O.P[s+1],n)*Math.PI/180;q0.set(Math.sin(c)*Math.cos(h),Math.sin(h),Math.cos(c)*Math.cos(h)),le.lerp(q0,1-m(O.b-.03,O.b,t)).normalize()}const a=(xe.l*m(xe.a0,xe.a1,t)-(xe.l+xe.r)*Dt(xe.b0,xe.b1,t)+xe.r*Dt(xe.c0,xe.c1,t))*Math.PI/180;if(a!==0){const o=Math.max(Math.hypot(le.x,le.z),.001),s=Math.asin(W(Math.sin(a)/o,-.97,.97)),n=le.y/o/Math.cos(s),c=Math.atan2(le.x,le.z)-s,h=1/Math.hypot(1,n);le.set(Math.sin(c)*h,n*h,Math.cos(c)*h)}return q0.copy(be).addScaledVector(le,16)},B0=[];for(let e=0;e<3;e++)B0.push({at:C,from:ze(.13),to:E.tip-.006,weight:.65,fade:.2});for(let e=0;e<5;e++)B0.push({at:La,from:E.tip-.11,to:E.join+.012,weight:.9,fade:.06});const t0=l(0,0,0),g0=l(0,0,0),tt=l(0,0,0),a0=(e,t,a=0)=>{P.pointAt(e,t0),P.posAtDist(e*p0+14*(1+2.4*a),g0),t.subVectors(g0,t0).normalize(),a>0&&(t.y*=1-.45*a,t.normalize());const o=m(0,.04,e)*(1-m(.93,.985,e));for(const s of B0){const n=H(e,s.from,s.to,s.fade)*s.weight*o*(1-.65*a);n<=.001||(tt.copy(typeof s.at=="function"?s.at(0,e):s.at).sub(t0).normalize(),t.multiplyScalar(1-n).addScaledVector(tt,n).normalize())}return t},fe=(e,t,a,o,s=0)=>{const n=a0(e,l(0,0,0),s),c=P.pointAt(e),h=l(0,0,0).crossVectors(n,Ce).normalize(),w=l(0,0,0).crossVectors(h,n);return c.addScaledVector(n,t).addScaledVector(h,a).addScaledVector(w,o)},at=e=>{const t=a0(e,l(0,0,0)),a=l(0,0,0).crossVectors(t,Ce).normalize();P.tangentAt(e,t0),P.tangentAtDist(e*p0+14,g0);const o=W(-(t0.z*g0.x-t0.x*g0.z)*.55,-.28,.28)*ba,s=l(0,1,0).addScaledVector(a,o);return s.addScaledVector(t,-s.dot(t)).normalize(),a.crossVectors(t,s),{g:t,right:a,upv:s}},Fe=(e,t,a,o)=>{const s=at(e);return P.pointAt(e).addScaledVector(s.g,t).addScaledVector(s.right,a).addScaledVector(s.upv,o)},Vt=(e,t,a,o)=>{const s=at(e);return l(0,0,0).addScaledVector(s.right,t).addScaledVector(s.upv,a).addScaledVector(s.g,-o).normalize()},qa=e=>{const t=W(e.clone().sub(C).dot(K),0,46);return e.distanceTo(C.clone().addScaledVector(K,t))},re=(e,t,a=8)=>{const o=(s,n,c)=>Math.min(P.distanceTo(s,n,c)-t,qa(tt.set(s,n,c))-a);for(let s=0;s<24&&o(e.x,e.y,e.z)<0;s++){const n=o(e.x+.4,e.y,e.z)-o(e.x-.4,e.y,e.z),c=o(e.x,e.y+.4,e.z)-o(e.x,e.y-.4,e.z),h=o(e.x,e.y,e.z+.4)-o(e.x,e.y,e.z-.4),w=Math.hypot(n,c,h)||1;e.x+=n/w*.6,e.y+=c/w*.6,e.z+=h/w*.6}return e};E.fig=.79;const G0=v.figure==="squid"?.22:.5,ot=v.figure==="squid"?4.8:4,Pt=v.figure==="squid"?15:14,Nt=P.pointAt(E.fig),Ba=e=>{const t=C.clone().sub(e);return t.y=0,t.normalize(),l(0,Math.cos(G0),0).addScaledVector(t,Math.sin(G0))},Ga=(e,t)=>{const a=Ba(e);for(let o=-ot;o<=ot+.01;o+=ot/8)if(P.distanceTo(e.x+a.x*o,e.y+a.y*o,e.z+a.z*o)<t)return!1;return!0},Lt=e=>fe(E.fig,e,e*.45,-.02*e);let o0=Lt(Pt);for(let e=.4;e<6&&!Ga(o0,8.2);e+=.4)o0=Lt(Pt+e);await i.yield();const qt=p.colors.glow.clone().lerp(d(ue[4]),.6).multiplyScalar(1.3),Bt={value:0},Gt={value:1},Rt=.905,It={blue:[[.052,.053,.066],[0,.002,.018]],ghost:[[.0545,.053,.066],[.003,0,.018]],gold:[[.052,.053,.07],[.001,.001,.02]]}[v.cast],Ra=new u.Color(...It[0]).multiplyScalar(Rt),Ia=new u.Color(...It[1]).multiplyScalar(Rt),ae={uDeepDir:{value:l(0,-1,0)},uDeepCol:{value:new u.Color(0,0,0)},uDeepCol2:{value:new u.Color(0,0,0)},uRays:Bt,uShaft:Gt,uGlowCol:{value:new u.Color},uMidCol:{value:new u.Color},uLowCol:{value:d(ue[0])},uKeyCol:{value:new u.Color},uColonyCol:{value:qt},uColonyPos:{value:C.clone()},uGlowK:{value:.17},uFogD:{value:.012},uColonyI:{value:1.6},uColonyR2:{value:700},uEntry:{value:1},uTime:{value:0},uPxScale:{value:400}},Ht=d(Y.glow).offsetHSL((U-.5)*.05,0,0),Ot=d(Y.deep),Ha=d(ue[1]),Oa=d(ue[0]),st=new u.FogExp2(0,.012);x.fog=st;const _a=3,Wa=2.4,ja=.8,nt={value:1};function _t(e){const t=bo(e),a=120+(t-120)*Y.reach,o=1-m(0,.05,e);nt.value=o,ae.uEntry.value=1-m(0,.022,e);const s=xa(a,[[120,1],[300,.3],[450,.06],[550,0]])*Y.gain*(1+.5*o),n=m(120,420,a);ae.uGlowCol.value.copy(Ht).lerp(Ot,n).multiplyScalar(_a*s),ae.uKeyCol.value.copy(Ht).lerp(Ot,n).multiplyScalar(Wa*s/(1+.3*o)),ae.uGlowK.value=X(.3,.045,m(120,520,a))+.06*o;const c=xa(a,[[120,1],[300,.34],[450,.08],[560,0]])*(Y.gain>0?Math.min(Y.gain,1.1):.1);ae.uMidCol.value.copy(Ha).multiplyScalar(c*ja*(1+.4*o)).add(Oa),ae.uFogD.value=X(.012,.009,m(120,620,t))*v.fog,st.density=ae.uFogD.value,st.color.copy(ae.uMidCol.value),Bt.value=X(.45,1,m(.05,.14,e))*(1+1.3*m(150,300,a)),Gt.value=1-m(.15,.21,e)}_t(0);const R0=new u.Mesh(new u.SphereGeometry(600,32,20),new u.ShaderMaterial({uniforms:{...ae},vertexShader:xo,fragmentShader:Mo,side:u.BackSide,depthWrite:!1,depthTest:!1,fog:!1}));R0.renderOrder=-1,R0.frustumCulled=!1,x.add(R0);const lt=Lo(),y0=d(ue[3]).lerp(d(ue[4]),.18),Wt={value:l(0,0,0)},it={uB2:{value:Ee?.0789:.1346},uT1:{value:Ee?Math.PI*4:9.23},uHaloR2:{value:v.cast==="gold"?Math.min(v.haloR2,8):v.haloR2},uHaloK:{value:v.haloK*(v.cast==="gold"?1.35:1.05)}},Ka=v.cast==="gold"?new u.Color(1,.7,.36).multiplyScalar(3):p.colors.glow,Ua=it.uHaloK.value,Xa=v.cast==="gold"?.45:1,ke=async(e,t,a)=>{const o=new Float32Array(e*3),s=new Float32Array(e*4),n=[0,0,0],c=[0,0,0,0];for(let k=0;k<e;k++)t(k,n,c),o.set(n,k*3),s.set(c,k*4),k%2500===2499&&await i.yield();const h={...ae,...it,uStreak:a.streak===!1?{value:l(0,0,0)}:Wt,uCenter:{value:(a.center||l(0,0,0)).clone()},uBox:{value:(a.box||l(1,1,1)).clone()},uOffset:{value:l(0,0,0)},uColA:{value:d(a.colA||"#ffffff")},uColB:{value:d(a.colB||a.colA||"#ffffff")},uSelf:{value:a.self||new u.Color(0,0,0)},uHeroPos:{value:C},uHaloCol:{value:Ka},uHeroInv:{value:Oe},uWrap:{value:a.box?1:0},uMinPx:{value:a.minPx??1.1},uGain:{value:a.gain??1},uLit:{value:a.lit??1},uBlink:{value:a.blink??0},uDart:{value:a.dart??0},uTwinkle:{value:a.steady?0:1},uBroad:{value:Xa},uFar:{value:a.far??0},uMinE:{value:a.minE??.3},uNear:{value:new u.Vector2(...a.near||[.35,1.4])},uBandPos:p.uniforms.uBandPos,uBandGap:p.uniforms.uBandGap,uOwnS:p.uniforms.uOwnS,uOwnAmp:p.uniforms.uOwnAmp,uTop:{value:a.top||l(0,1,0)}},w=new u.ShaderMaterial({uniforms:h,vertexShader:Co,fragmentShader:So,transparent:!0,depthWrite:!1,blending:u.AdditiveBlending,fog:!1}),b=new u.Mesh(T0(lt,e,{iBase:[o,3],iData:[s,4]}),w);return b.frustumCulled=!1,b.renderOrder=a.order??10,x.add(b),{mesh:b,u:h}},jt=q*v.snow*B,Kt=v.cast==="gold"&&v.snow>1.2?.7:1,rt=e=>(t,a,o)=>{a[0]=r.range(-.5,.5)*e.x,a[1]=r.range(-.5,.5)*e.y,a[2]=r.range(-.5,.5)*e.z;const s=r();o[0]=.008+.04*s*s*s,o[1]=r(),o[2]=r.range(.45,1),o[3]=r.chance(.16)?r.range(.6,1.6):0},Ut=new u.Color(.1,.13,.25),ct=l(38,30,38),ht=l(84,44,84),I0=await ke(Math.round(8200*jt),rt(ct),{box:ct,colA:v.snowTint[0],colB:v.snowTint[1],self:Ut,minE:.55,minPx:1.2});await i.yield();const Xt=await ke(Math.round(6200*jt),rt(ht),{box:ht,center:C,colA:v.snowTint[0],colB:v.snowTint[1],self:Ut.clone().multiplyScalar(.6),minE:.5,minPx:1.2,gain:Kt});await i.yield();const ve=l(-2+(U-.5)*3,8,-75),je=Y.pillar==="fish",H0=130,Qa=d(ue[3]).lerp(d(ue[4]),.05).multiplyScalar(3.9),ce=i.core.makeRng(i.core.hashSeed((i.seed??1)+":longest-animal:pillar")),w0=await ke(Math.round((je?4700:650)*W(q,.8,1.2)*B),(e,t,a)=>{const o=7.5*Math.pow(ce(),.56)*(ce()<.3?1+.9*ce():1),s=ce.range(0,6.2832);t[0]=ve.x+Math.cos(s)*o,t[1]=ve.y+ce.range(-65,65),t[2]=ve.z+Math.sin(s)*o,a[0]=.075,a[1]=ce(),a[2]=ce.range(.3,1),a[3]=.3},{box:l(400,H0,400),center:ve,self:Qa,lit:0,minPx:1.25,minE:.45,near:[3,9],streak:!1,blink:.25,top:l(12,68,1)});await i.yield();const Qt=e=>1-m(6,52,e),Ya=await ke(38,(e,t,a)=>{t[0]=ve.x+ce.range(-2.6,2.6),t[1]=-56+e/37*108,t[2]=ve.z+ce.range(-.8,.8),a[0]=ce.range(14,25),a[1]=ce(),a[2]=ce.range(.85,1.05)*Qt(t[1]),a[3]=0},{self:d(ue[3]).multiplyScalar(je?.028:.01),lit:0,minE:1,near:[7,30],streak:!1,order:2,steady:1}),$a=await ke(30,(e,t,a)=>{t[0]=ve.x+ce.range(-2.4,2.4),t[1]=-56+e/29*108,t[2]=ve.z+ce.range(-.6,.6),a[0]=ce.range(12,23),a[1]=ce(),a[2]=ce.range(.85,1.05)*Qt(t[1]),a[3]=0},{self:d(ue[3]).multiplyScalar((je?.3:.05)*(j==="night"?.5:1)),lit:0,minE:1,near:[36,80],streak:!1,order:2,steady:1});for(let e=0,t=(Math.round((je?3600:500)*W(q,.8,1.2)*B)+60)*5;e<t;e++)r();await i.yield();let b0=null;if(je){w0.mesh.geometry.instanceCount=Math.round(w0.mesh.geometry.instanceCount*.67);const e=i.core.makeRng(i.core.hashSeed((i.seed??1)+":longest-animal:pfish")),t=Math.round(300*W(q,.8,1.2)*B),a=Math.round(130*B),o=70,s=t+a+o,n=new Float32Array(s*3),c=new Float32Array(s*4);let h=0,w=0,b=0,k=0,T=0,I=0;for(let $=0;$<s;$++){let g,L,R,y,Z,_=-1;if($<t){const se=e.range(-1.95,1.95),he=e()<.65?e.range(5.2,8.8):e.range(1.5,6);g=Math.sin(se)*he,R=Math.cos(se)*he,L=e.range(-65,65),y=X(1,1.6,e()),Z=e.range(.7,1.1)}else if($<t+a){const se=e()<.5?1:-1,he=se*e.range(.9,1.8),Ie=e.range(6.6,10.5);g=Math.sin(he)*Ie,R=Math.cos(he)*Ie,L=e.range(-65,65),y=X(2,3.2,e()),Z=e.range(.85,1.15)}else{if(h===0){h=e()<.45?3:2;const Ie=e()<.5?1:-1;T=6.5*Math.pow(e(),1.4),w=Ie*(1.45-.08*T)*e.range(.7,1.3),b=(9.6+2.1*T)*e.range(.8,1.3),k=e.range(-65,65),I=e()}h--;const se=w+e.range(-.08,.08),he=b+e.range(-1.2,1.2);g=Math.sin(se)*he,R=Math.cos(se)*he,L=k+e.range(-2.4,2.4),y=Math.min((2+3*Math.pow(e(),1.5))*(1+.03*T),4.9),Z=e.range(.85,1.2),_=(I+.013*h)%1}n.set([ve.x+g,ve.y+L,ve.z+R],$*3),c.set([y,_<0?e():_,Z,0],$*4)}const z={...ae,uCenter:{value:ve.clone()},uNear:{value:new u.Vector2(9,18)},uWrapH:{value:new u.Vector2(H0,H0)},uRise:{value:0},uGain:{value:1},uAng:{value:.0083},uSign:{value:Y.fishSign},uPhoto:{value:y0.clone().multiplyScalar(2.6)},uBodyCol:{value:new u.Color(.004,.006,.016)}},te=new u.Mesh(T0(lt,s,{iBase:[n,3],iData:[c,4]}),new u.ShaderMaterial({uniforms:z,vertexShader:Po,fragmentShader:No,transparent:!0,premultipliedAlpha:!0,depthWrite:!1,fog:!1}));te.frustumCulled=!1,te.renderOrder=11,x.add(te),b0={mesh:te,u:z}}await i.yield();const O0=l(0,0,0),Za=p.info.turns*Math.PI*2+6,Go=await ke(Math.round(600*q*B),(e,t,a)=>{p.anchors.armPoint(r()*Za,O0).applyMatrix4(p.object.matrixWorld),t[0]=O0.x+r.gauss()*.7,t[1]=O0.y-r.range(.2,3.3),t[2]=O0.z+r.gauss()*.7,a[0]=.016,a[1]=r(),a[2]=r.range(.5,1.2),a[3]=0},{self:y0.clone().lerp(d(ue[4]),.35).multiplyScalar(1.6),blink:1,dart:.5,minPx:1.2,minE:.5,near:[.6,2],streak:!1,colA:"#9fb6d8"}),Yt=l(22,16,22),$t=j==="night"?await ke(Math.round(1400*B),rt(Yt),{box:Yt,self:y0.clone().multiplyScalar(1.3),lit:0,blink:1,minE:.5,minPx:1.2}):null;await i.yield();const Q=i.core.makeRng(i.core.hashSeed((i.seed??1)+":longest-animal:deep")),qe={y:xt-2,h:20,r0:26,r1:44,R:175},_0=[];for(let e=0;e<90;e++){const t=Q.range(0,6.2832),a=X(40,150,Math.pow(Q(),.8));_0.push([A0+Math.cos(t)*a,qe.y+Q.range(-.3,.3)*qe.h,E0+Math.sin(t)*a,Q.range(4,10)])}const Ja=await ke(Math.round(5e3*W(q,.85,1.2)*B),(e,t,a)=>{for(let s=0;s<6;s++){if(Q()<.75){const n=_0[Math.floor(Q()*_0.length)%_0.length];t[0]=n[0]+Q.gauss()*n[3],t[1]=n[1]+Q.gauss()*n[3]*.35,t[2]=n[2]+Q.gauss()*n[3]}else{const n=Q.range(0,6.2832),c=X(qe.r0,qe.R,Math.pow(Q(),.75));t[0]=A0+Math.cos(n)*c,t[1]=qe.y+Q.range(-.5,.5)*qe.h,t[2]=E0+Math.sin(n)*c}if(Math.hypot(t[0]-A0,t[2]-E0)>X(qe.r0,qe.r1,Q()))break}const o=Q();a[0]=.06+.07*o,a[1]=Q(),a[2]=.35+.65*o*o,a[3]=0},{self:y0.clone().multiplyScalar(1.8),lit:0,minPx:1.2,minE:.75,near:[16,42],streak:!1,blink:.22,gain:0,order:3,far:.5});await i.yield();const Zt=new u.Color(...{blue:[.042,.054,.14],ghost:[.066,.05,.14],gold:[.06,.052,.13]}[v.cast]),eo=await ke(34,(e,t,a)=>{const o=6.4*Math.sqrt(Q()),s=Q.range(0,6.2832),n=oe(l(Math.cos(s)*o,Q.gauss()*.42*(1-.1*o),Math.sin(s)*o));t[0]=n.x,t[1]=n.y,t[2]=n.z,a[0]=Q.range(4.2,7.2)*(1-.05*o),a[1]=Q(),a[2]=Q.range(.7,1.1),a[3]=0},{self:Zt.clone().multiplyScalar(.5),lit:0,minE:1,near:[7,16],streak:!1,order:6,steady:1,gain:0});await i.yield();const x0=p.colors.glow.clone().lerp(d(ue[4]),.4),to=Math.max(x0.r,x0.g,x0.b,.001);x0.multiplyScalar(1/to);const Jt={uTime:ae.uTime,uEyePos:{value:C},uEyeN:{value:K},uEyeSize:{value:21},uEyePull:{value:9},uEyeA:{value:6.4},uEyeB:{value:1.15},uEyeR:{value:5.9},uEyeGain:{value:0},uEyeCol:{value:Zt},uEyeFill:{value:p.colors.halo.clone().multiplyScalar({blue:.33,ghost:.4,gold:.85}[v.cast])}},M0=new u.Mesh(lt,new u.ShaderMaterial({uniforms:Jt,vertexShader:Fo,fragmentShader:Vo,transparent:!0,premultipliedAlpha:!0,depthWrite:!1,fog:!1}));M0.frustumCulled=!1,M0.renderOrder=6.5,M0.visible=!1,x.add(M0);const ao=await ke(Math.round(460*B),(e,t,a)=>{const o=5.6*Math.sqrt(Q()),s=Q.range(0,6.2832),n=oe(l(Math.cos(s)*o,Q.gauss()*.4*(1-.09*o),Math.sin(s)*o));t[0]=n.x,t[1]=n.y,t[2]=n.z,a[0]=Q.range(.02,.045),a[1]=Q(),a[2]=Q.range(.5,1.2),a[3]=Q.chance(.2)?Q.range(.5,1.2):0},{self:x0.clone().lerp(new u.Color(1,1,1),.3).multiplyScalar(1.5),lit:0,minPx:1.15,minE:.5,near:[3,8],streak:!1,blink:.3,gain:0});await i.yield();const s0=(e,t,a,o)=>{const s=new Float32Array(e*3),n=new Float32Array(e*3),c=new Float32Array(e*4),h=[0,0,0],w=[0,0,0],b=[0,0,0,0];for(let z=0;z<e;z++)a(z,h,w,b),s.set(h,z*3),n.set(w,z*3),c.set(b,z*4);const k={...ae,uCenter:{value:(o.center||l(0,0,0)).clone()},uBox:{value:(o.box||l(1,1,1)).clone()},uWrap:{value:o.box?1:0},uSign:{value:Y.fishSign},uVis:{value:1},uFar:{value:new u.Vector2(...o.far)},uPhoto:{value:y0.clone().multiplyScalar(o.photo??3)}},T=new u.ShaderMaterial({uniforms:k,vertexShader:zo,fragmentShader:ko,side:u.DoubleSide,fog:!1,defines:o.hatchet?{HATCHET:1}:{}}),I=new u.Mesh(T0(t,e,{iBase:[s,3],iDir:[n,3],iData:[c,4]}),T);return I.frustumCulled=!1,x.add(I),{mesh:I,u:k}},ut=Ma([[.5,.012,.01],[.42,.085,.05],[.22,.12,.068],[-.02,.105,.055],[-.26,.052,.026],[-.4,.028,.012]],6,[[[0,-.38],[.12,-.53],[.03,-.47],[0,-.45],[-.03,-.47],[-.12,-.53]],[[.105,.06],[.175,-.04],[.085,-.12]]]),dt=e=>{const t=r.range(1.08,1.4),a=r.range(0,6.2832);e[0]=Math.cos(t)*Math.cos(a),e[1]=Math.sin(t),e[2]=Math.cos(t)*Math.sin(a)},oo=l(60,34,60),W0=l(ve.x,-12,-73),Ro=je?s0(Math.round(350*W(q,.8,1.2)*B),ut,(e,t,a,o)=>{const s=7.5*Math.pow(r(),.6),n=r.range(0,6.2832);t[0]=W0.x+Math.cos(n)*s,t[1]=W0.y+r.range(-17,17),t[2]=W0.z+Math.sin(n)*s,dt(a),o[0]=r.range(.11,.15),o[1]=r(),o[2]=r.range(.6,1.3),o[3]=0},{box:oo,center:W0,far:[24,36]}):null;await i.yield();const ea=l(9,7,9),ta=(e,t,a,o,s)=>{const n=t+(Math.asin(W(e[1],-1,1))-1.08)/.32*(a-t),c=o+Math.atan2(e[2],e[0])/Math.PI*s;e[0]=Math.cos(n)*Math.cos(c),e[1]=Math.sin(n),e[2]=Math.cos(n)*Math.sin(c)},n0=je?s0(Math.round(250*W(q,.8,1.2)*B),ut,(e,t,a,o)=>{t[0]=r.range(-2.5,2.5)*1.8,t[1]=r.range(-3.5,3.5),t[2]=r.range(-2.5,2.5)*1.8,dt(a),ta(a,.12,.62,-Math.PI/2,.6),o[0]=r.range(.17,.24)*1.45,o[1]=r(),o[2]=r.range(.6,1.3),o[3]=0},{box:ea,far:[7.5,9.5],photo:4}):null;await i.yield();const so=l(19,16,19),aa=s0(Math.round(280*q*B),ut,(e,t,a,o)=>{t[0]=r.range(-9.5,9.5),t[1]=r.range(-8,8),t[2]=r.range(-9.5,9.5),dt(a),ta(a,.35,.95,0,1),o[0]=r.range(.11,.15)*1.35,o[1]=r(),o[2]=r.range(.6,1.3),o[3]=0},{box:so,far:[40,50]});await i.yield();const ft=Ma([[.5,.015,.008,.02],[.44,.095,.036,.015],[.32,.165,.062,0],[.16,.2,.075,-.02],[-.02,.185,.068,-.025],[-.17,.115,.045,-.005],[-.3,.05,.022,.015],[-.4,.03,.009,.02]],6,[[[.02,-.38],[.16,-.56],[.02,-.47],[-.12,-.56]],[[.15,.2],[.25,.02],[.1,-.14]]]),Ke=(Y.pillar==="salp"?[.1,.13,.15,.17,.2,.24,.29,.33,.38,.69,.73,.78]:[.075,.15,.2,.235,.27,.305,.34,.375,.41,.685,.725,.775]).slice(0,9).map((e,t)=>{const a=ze(e),o=P.pointAt(a),s=P.tangentAt(a),n=a0(a,l(0,0,0)),c=n.clone().addScaledVector(s,-n.dot(s)).add(l(r.range(-.25,.25),r.range(-.25,.25),r.range(-.25,.25)));return c.addScaledVector(s,-c.dot(s)),c.length()<.05&&c.set(s.z,.3,-s.x),o.addScaledVector(c.normalize(),r.range(3.6,7.2)).addScaledVector(s,r.range(2,8))});for(const[e,t,a,o]of[[E.lift+.012,8,3.2,-1.8],[.815,7,-3,1.7],[.842,9,7,4.6],[.9,10,-8.5,1]])Ke.push(re((e>.83?Fe:fe)(e,t,a,o),3.2));const oa=30;await i.yield();const sa=i.core.makeRng(i.core.hashSeed((i.seed??1)+":longest-animal:steady"));Ke.push(re(fe(ze(.33),7.5,2.6,.6,1),3.2));const no=i.core.makeRng(i.core.hashSeed((i.seed??1)+":longest-animal:school79"));Ke.push(re(Fe(.79,5.6,-.25,-2.15),3.2));const Ue=i.core.makeRng(i.core.hashSeed((i.seed??1)+":longest-animal:polish")),na=[[.82,5,-1.65,-.55,5.5],[.9,8,4.5,-1.2,7],[.02,9.5,3.3,-1.7,0]];for(const[e,t,a,o]of na)Ke.push(re((e>.5?Fe:fe)(e,t,a,o),2.6,4.5));const Ho=s0(Ke.length*oa,ft,(e,t,a,o)=>{const s=Math.floor(e/oa),n=Ke[s],c=s>=15?Ue:s===14?no:s>=13?sa:r,h=1*Math.sqrt(c()),w=c.range(0,6.2832);t[0]=n.x,t[1]=n.y,t[2]=n.z,a[0]=Math.cos(w)*h,a[1]=c.range(-.3,.3),a[2]=Math.sin(w)*h,o[0]=s>=15?c.range(.2,.27):s>=9&&s<13||s===14?c.range(.15,.2):c.range(.11,.15)*1.5,o[1]=c(),o[2]=s>=15?na[s-15][4]:s===14?7:s>=10&&s<13?2:0},{far:[34,48],photo:2,hatchet:!0});await i.yield();const j0=[[.28,9,4.6,-1.6],[.31,7,3,-1.5],[.34,5.4,1.7,-1.35],[.37,5.4,.5,-1.6],[.4,5.6,-1.1,-1.7],[.43,7,-4.2,-1.3]],lo=new u.CatmullRomCurve3(j0.map(([e,t,a,o])=>Fe(e,t,a,o))),la=(e,t)=>lo.getPoint(W((e-j0[0][0])/(j0[5][0]-j0[0][0]),0,1),t),l0=s0(Math.round(170*W(q,.8,1.2)*B),ft,(e,t,a,o)=>{const s=e%5,n=.5+.47*s+Ue.range(-.24,.24),c=Ue.range(0,6.2832);t[0]=0,t[1]=0,t[2]=0,a[0]=Math.cos(c)*n,a[1]=Ue.range(-1,1)*(1.2-.13*s),a[2]=Math.sin(c)*n,o[0]=Ue.range(.2,.3),o[1]=Ue(),o[2]=3,o[3]=s*.21+.07},{far:[30,42],photo:2,hatchet:!0});l0.u.uVis.value=0;const K0=[[.28,8,5.6,-.3],[.31,4.4,2.5,-.3],[.34,3.3,1.6,-.25],[.37,3.3,1.55,-.5],[.4,4.6,2.7,-1.3],[.43,8,5.4,-1.8]],io=new u.CatmullRomCurve3(K0.map(([e,t,a,o])=>Fe(e,t,a,o))),ro=(e,t)=>io.getPoint(W((e-K0[0][0])/(K0[5][0]-K0[0][0]),0,1),t),Xe=i.core.makeRng(i.core.hashSeed((i.seed??1)+":longest-animal:outriders")),i0=s0(16,ft,(e,t,a,o)=>{const s=e/16*6.2832+Xe.range(-.2,.2),n=e%2?Xe.range(1,1.45):Xe.range(.45,.9);t[0]=0,t[1]=0,t[2]=0,a[0]=Math.cos(s)*n,a[1]=Xe.range(-.5,.5),a[2]=Math.sin(s)*n,o[0]=Xe.range(.3,.4),o[1]=Xe(),o[2]=6,o[3]=Xe.range(0,.1)},{far:[30,42],photo:2,hatchet:!0});i0.u.uVis.value=0,P.stage.probe={travel:e=>e>.27&&e<.42?la(e,l(0,0,0)):null},await i.yield();const vt=l(0,1,0),me={p:[],q:[],d:[]},Be=new u.Quaternion,mt=new u.Euler,Me=(e,t,a,o,s,n=r)=>{s||(s=Be.setFromEuler(mt.set(n.range(-.9,.9),n.range(0,6.28),n.range(-.9,.9)))),me.p.push(e.x,e.y,e.z),me.q.push(s.x,s.y,s.z,s.w),me.d.push(a,o,t,n())},co=e=>{const t=W(e.clone().sub(C).dot(K),0,70);return e.distanceTo(C.clone().addScaledVector(K,t))};for(const[e,t,a,o]of[[.25,2.1,.8,-.35],[.265,3,-1,.3],[.283,2.6,1.1,.5],[.3,2.2,-.8,-.3],[.318,3.2,1.2,-.5],[.335,2.8,-1.1,.45],[.36,3,.9,.2],[.4,2.3,.85,-.3]]){const s=ze(e),n=a0(s,l(0,0,0)),c=P.pointAt(s),h=l(0,0,0).crossVectors(n,vt).normalize(),w=l(0,0,0).crossVectors(h,n);Me(c.addScaledVector(n,t).addScaledVector(h,a).addScaledVector(w,o),0,.125,.2)}const r0=i.core.makeRng(i.core.hashSeed((i.seed??1)+":longest-animal:jellies"));for(const e of[.15,.16,.172,.185,.198,.21,.222,.236,.34,.348,.372,.385,.412,.425,.44]){const t=r0.range(.9,1.35),a=r0.chance(.5)?1:-1;Me(re(fe(ze(e),r0.range(2.5,3.6),a*r0.range(.8,1.7),r0.range(-.7,.6)),1.2),0,.12*t,.19*t,null,r0)}await i.yield();for(let e=0;e<7;e++){const t=ze(r.range(.15,.44)),a=a0(t,l(0,0,0)),o=P.pointAt(t);Me(o.addScaledVector(a,r.range(5,10)).add(l(r.range(-3,3),r.range(-3,3),r.range(-3,3))),0,.1,.155)}for(const[e,t,a]of[[.6,15.5,2.2],[1.6,13.5,1.8],[2.7,11.5,2.4]])Me(oe(l(Math.sin(e)*t,a,Math.cos(e)*t)),0,.1,.155);for(const[e,t,a,o]of[[.24,2.6,.5,.2],[.27,3.2,-.9,-.4],[.3,2.5,.7,.35],[.33,3,-.6,.1],[.36,2.6,.8,-.3]])Me(re(fe(ze(e),t,a,o,1),1.3),0,.09,.14,null,sa);const ia=i.core.makeRng(i.core.hashSeed((i.seed??1)+":longest-animal:helix"));Me(re(fe(.47,2.4,-1.25,-.75),1.2),0,.16,.26,null,ia);for(const[e,t,a,o,s]of[[.79,3,1.95,-1.37,1.3],[.84,3,-.58,.93,1.25],[.853,3.4,1.9,.7,1.1],[.87,2.6,-.37,.75,1.6],[.87,3.7,-3.1,1.48,1.45],[.872,4.6,-.9,-1.9,1.1]])Me(re(Fe(e,t,a,o),1.3),0,.125*s,.2*s,null,ia);for(const[e,t,a,o,s]of[[.43,2.4,1.3,-.8,1.4],[.82,3.2,-2.4,.8,1.3],[.9,4.5,-2.4,1.3,1.8],[.02,5,-2,-.9,1.8]])Me(re((e>.5?Fe:fe)(e,t,a,o),1.3,3.5),0,.125*s,.2*s,null,Ue);for(let e=0,t=Math.round(v.houses*q);e<t;e++)for(let a=0;a<8;a++){const o=r.range(.03,.84),s=P.pointAt(o),n=P.tangentAt(o),c=l(r.range(-1,1),r.range(-1,1),r.range(-1,1));if(c.addScaledVector(n,-c.dot(n)),c.length()<.1||(s.addScaledVector(c.normalize(),r.range(2.6,9)),P.distanceTo(s.x,s.y,s.z)<2.4||co(s)<7.5))continue;const h=r.range(.16,.27);Me(s,1,h,h*r.range(1.05,1.5));break}if(Y.pillar==="salp"){const t=l(0,0,0);for(let a=0;a<118;a++){const o=a/117,s=o*Math.PI*2*7.5,n=2.3;t.set(-Math.sin(s)*n*47.1,30,Math.cos(s)*n*47.1).normalize(),Me(l(5.6+Math.cos(s)*n,-27+30*o,-77+Math.sin(s)*n),2,.2,.43,Be.setFromUnitVectors(vt,t))}}const ie={band:[4.4,6.3],per10:1.73,has:.36,t1:4.4,clear:[5,1.3],hem:4.4,sheet:[3,1.5],helmets:.74,cone:9,apart:3,seats:[]};{const e=i.core.makeRng(i.core.hashSeed("chain-company:"+i.seed)),t=[],a=[0],o=Math.round(ie.t1/.05);for(let z=0;z<=p.info.turns*Math.PI*2;z+=.05)t.push(ge(z));for(let z=1;z<=o;z++)a.push(a[z-1]+t[z].distanceTo(t[z-1]));const s=Math.round((ie.per10-ie.has)*a[o]/10),n=ie.band[0]*ie.band[0],c=ie.band[1]*ie.band[1],h=ie.apart*ie.apart,w=l(0,0,0),b=l(0,0,0),k=l(0,0,0),T=l(0,0,0),I=(z,te)=>{for(const g of t){if(g.distanceToSquared(z)<n)return!1;const L=g.y-W(g.y-z.y,0,ie.hem)-z.y,R=g.x-z.x,y=g.z-z.z;if(R*R+L*L+y*y<ie.sheet[te]*ie.sheet[te])return!1}const $=w.subVectors(z,C).dot(K);if(w.addScaledVector(K,-$).length()<ie.cone+Math.max($,0)||P.distanceTo(z.x,z.y,z.z)<ie.clear[te])return!1;for(const g of ie.seats)if(g.p.distanceToSquared(z)<h)return!1;for(let g=0;g<me.d.length;g+=4)if(me.d[g+2]===0&&w.set(me.p[g*.75],me.p[g*.75+1],me.p[g*.75+2]).distanceToSquared(z)<h)return!1;return!0};for(let z=0;z<s;z++){const te=e()<ie.helmets?0:1,$=(z+e())/s*a[o];let g=1;for(;g<o&&a[g]<$;)g++;const L=t[g-1].clone().lerp(t[g],($-a[g-1])/Math.max(a[g]-a[g-1],1e-6));T.subVectors(t[g],t[g-1]).normalize(),b.crossVectors(T,Ce).normalize(),k.crossVectors(b,T);for(let R=0;R<12;R++){const y=e.range(0,6.2832),Z=Math.sqrt(X(n,c,e())),_=L.clone().addScaledVector(b,Math.cos(y)*Z).addScaledVector(k,Math.sin(y)*Z);if(I(_,te)){if(te===0){const se=e.range(1,1.5),he=new u.Quaternion().setFromEuler(mt.set(e.range(-.3,.3),e.range(0,6.28),e.range(-.3,.3)));ie.seats.push({p:_,q:he,d:[se,e(),1,0]})}else{const se=e.range(.9,1.6);Me(_,0,.125*se,.2*se,null,e)}break}}}}const ho=me.d.length/4,pt=new u.Mesh(T0(qo(16,10),ho,{iPos:[new Float32Array(me.p),3],iQuat:[new Float32Array(me.q),4],iData:[new Float32Array(me.d),4]}),new u.ShaderMaterial({uniforms:{...ae,uEmber:{value:d(ue[5])}},vertexShader:Ao,fragmentShader:Eo,transparent:!0,premultipliedAlpha:!0,depthWrite:!1,side:u.DoubleSide,fog:!1}));pt.frustumCulled=!1,pt.renderOrder=9,x.add(pt),await i.yield(),await i.yield();const C0=d(ue[6]),S0=v.cast==="gold",ra=new u.Color(1,.9,.7),ca={value:0},ha={value:0},ua={value:4},da={value:0},fa=S0?p.colors.glow.clone().lerp(ra,.45).multiplyScalar(1.4):p.colors.glow.clone().lerp(d(ue[4]),.85).multiplyScalar(1.25),uo=S0?p.colors.glow.clone().lerp(ra,.3).multiplyScalar(.85):qt,fo=p.colors.glow.clone().multiplyScalar(.28).add(new u.Color(.06,.07,.085)),gt=(e,t,a,o,s,n)=>new u.ShaderMaterial({uniforms:{...ae,uColonyI:o,uColonyCol:{value:t?uo:e===1&&S0?fa.clone().multiplyScalar(1.1):fa},uColonyN:{value:K},uReach2:{value:s},uCut:{value:n},uPhase:{value:a},uFlick:ca,uFlickT:ha,uLate:da,uSheen:{value:fo},uMemb:{value:S0?.75:1}},vertexShader:To,fragmentShader:Do,vertexColors:!0,side:u.DoubleSide,fog:!1,defines:t?{MODE:e,INSTANCED:1}:{MODE:e}}),va=[],Qe=l(0,0,0),Ye=l(0,0,0),c0=l(0,0,0),ma=new u.Matrix4,pa=new u.Quaternion,yt=(e,t,a,o,s,n)=>{const c=new u.Mesh(e,gt(t,!1,s,ua,t===1?2e3:1600,0));c.scale.setScalar(o);const h=C.clone().sub(a);h.y=0,h.normalize(),Ye.copy(Ce).multiplyScalar(Math.cos(n)).addScaledVector(h,Math.sin(n)),Qe.copy(Ce).multiplyScalar(Math.sin(n)).addScaledVector(h,-Math.cos(n)),c0.crossVectors(Qe,Ye),c.quaternion.setFromRotationMatrix(ma.makeBasis(Qe,Ye,c0));const w=Nt.clone().sub(a);let b=Math.atan2(w.x,w.z)-Math.atan2(c0.x,c0.z);return b=Math.atan2(Math.sin(b),Math.cos(b)),Math.abs(b)>Math.PI/2&&(b-=Math.sign(b)*Math.PI),c.quaternion.premultiply(pa.setFromAxisAngle(Ce,.55*b)),c.position.copy(a),c.userData.baseY=a.y,c.frustumCulled=!1,x.add(c),va.push(c),c};if(v.figure==="squid")yt(Sa(C0),1,o0,1.2,1.3,G0);else{const e=Ca(C0);if(yt(e,0,o0,1,.7,G0),v.figure==="pair"){const t=o0.clone().sub(Nt);t.y=0,t.normalize();const a=o0.clone().addScaledVector(t,5.5).addScaledVector(l(0,0,0).crossVectors(t,Ce),4.4).add(l(0,-2.4,0));yt(e,0,re(a,6.5),.78,2.9,.42)}}await i.yield();const ga={value:0};{const e=ze(.25),t=a0(e,l(0,0,0)),a=re(fe(e,9.5,3.7,.3),5.5),o=v.figure!=="squid",s=new u.Mesh(o?Sa(C0):Ca(C0),gt(o?1:0,!1,2.1,ga,3e4,0)),n=l(t.x,0,t.z).normalize();Ye.copy(Ce).multiplyScalar(Math.cos(.44)).addScaledVector(n,Math.sin(.44)),Qe.crossVectors(Ye,n.negate()).normalize(),c0.crossVectors(Qe,Ye),s.quaternion.setFromRotationMatrix(ma.makeBasis(Qe,Ye,c0)),s.scale.setScalar(o?.85:1),s.position.copy(a),s.frustumCulled=!1,s.userData.half=4,x.add(s),P.stage.extras=[s]}await i.yield(),P.stage.figures=va;const ee={p:[],q:[],d:[]},U0=[],Ge=(e,t,a=.3,o=1,s=0,n=null,c=0)=>{U0.push(c),Be.setFromEuler(mt.set(r.range(-a,a),r.range(0,6.28),r.range(-a,a))),n&&Be.premultiply(pa.setFromUnitVectors(vt,n)),ee.p.push(e.x,e.y,e.z),ee.q.push(Be.x,Be.y,Be.z,Be.w),ee.d.push(t,r(),o,s)};Ge(l(6.6,3.9,-19),1.7,.2),Ge(l(-10,8.5,-50),1.4);for(const[e,t]of[[.2,6.8],[.33,-6.8]])Ge(re(fe(ze(e),10,t,4.4),4),e>.3?0:1.25);for(const[e,t,a,o]of[[.9,12.3,1.3,1.1],[1.9,11.2,2,1.25],[2.9,9.9,1.5,1],[4.3,27,3.5,1.3],[5.6,28.5,-1.5,1.2]])Ge(oe(l(Math.sin(e)*t,a,Math.cos(e)*t)),o);const h0=(e,t)=>{const a=C.clone().sub(e),o=-a.dot(K),s=Math.max(a.addScaledVector(K,o).length()-17*Q0,0),n=Math.max(o,0);return t/Math.max(1.6/(1+(n*n+s*s)/120)*(1-.93*m(11,26,n)),.001)};for(const[e,t,a,o,s,n]of[[.65,9.5,4.6,-4.6,1.15,.8],[.65,15,-6.2,-6.4,1.5,.5],[.65,22,7.5,-8.5,1.8,.7],[.65,13.5,8.6,-1.2,.9,.8],[.65,17,-10.5,1.5,1.3,.6],[.65,24,12.5,4.5,1.6,.8],[.65,19,-5.5,8.2,1,.7],[.65,27,6,11.5,1.4,.5],[.7,15,-8.2,3.6,1.5,.6],[.7,18,9.2,1.2,1.2,.8]]){const c=re(fe(e<.68?E.lift+.012:E.fig+.03,t,a,o),5);Ge(c,e<.68?s:s*1.25,n,e<.68?1:h0(c,.9),1)}for(const[e,t,a,o,s,n,c,h,w,b]of[[.84,9,-6.54,-1.7,2.6,.12,0,2.75,-.2,.82],[.87,5.2,-3.47,-2.09,1.4,.12,0,-.5,.3,.87],[.945,11,-7.3,-4.4,2.1,.2,2.2,-2.2,.25,.945],[.945,14.5,-9.8,-1.8,1.6,.25,2.6,-1.8,.2,.945]]){const k=re((e<.9?Fe:fe)(e,t,a,o),3.2);Ge(k,s,n,c||h0(k,1.05),1,Vt(b,Math.sin(h),Math.cos(h),w),e>.9?e:0)}{const e=re(fe(ze(.3),13,3.5,2.2,1),5.5);Ge(e,1.3,.5,Math.max(2.5,h0(e,.8)))}for(const[e,t,a,o,s,n,c,h,w]of[[.43,6.5,2.9,1.5,1.9,-.3,1.25,0,.1],[.43,10.5,5.8,.2,1.5,.35,1.2,0,0],[.43,13.5,1.9,3.7,1.3,.1,1.2,0,0]]){const b=re((e>.5?Fe:fe)(e,t,a,o),e>.5?3.2:4);Ge(b,s,.12,h0(b,c),h,Vt(e,Math.sin(n),Math.cos(n),w))}{const e=l(0,0,0),t=l(0,0,0),a=l(0,0,0),o=Math.tan(31*Math.PI/180),s=[];for(let h=.74;h<=.8901;h+=.01)s.push({cam:P.pointAt(h),...at(h)});const n=(h,w)=>{for(const b of s){t.subVectors(h,b.cam);const k=t.dot(b.g);if(k<14||Math.abs(t.dot(b.right))>k*o*1.9||Math.abs(t.dot(b.upv))>k*o*1.08)continue;const T=t.dot(K),I=a.subVectors(b.cam,C).dot(K);if(!(T>-1e-4||-I/T<1)&&a.copy(b.cam).addScaledVector(t,-I/T).sub(C).length()<6.5+1.3*w)return!0}return!1},c=[];for(let h=0;h<U0.length;h++){let w=ee.d[h*4],b=0;if(w<=0)continue;const k=e.set(ee.p[h*3],ee.p[h*3+1],ee.p[h*3+2]).clone(),T=w,I=U0[h]>0?P.pointAt(U0[h]):null;for(;b<18&&n(e,w);b++)if(I){const z=1+.05*(b+1);if(a.copy(I).addScaledVector(t.subVectors(k,I),z),t.subVectors(a,C).dot(K)<4)break;e.copy(a),w=T*z}else{const z=a.subVectors(e,C).dot(K);a.addScaledVector(K,-z),e.addScaledVector(a,.7/Math.max(a.length(),.001)).addScaledVector(K,-Math.min(.55,Math.max(z-4,0)))}b&&(I||re(e,3.2),ee.d[h*4]=w,ee.d[h*4+2]*=h0(e,1)/h0(k,1),ee.p[h*3]=e.x,ee.p[h*3+1]=e.y,ee.p[h*3+2]=e.z,c.push(h))}P.stage.movedHelmets=c}await i.yield();for(const e of ie.seats){let t=!0;for(let a=0;a<ee.d.length;a+=4)ee.d[a]>0&&e.p.distanceTo(Qe.set(ee.p[a*.75],ee.p[a*.75+1],ee.p[a*.75+2]))<ie.apart&&(t=!1);t&&(ee.p.push(e.p.x,e.p.y,e.p.z),ee.q.push(e.q.x,e.q.y,e.q.z,e.q.w),ee.d.push(...e.d))}const ya=new u.Mesh(T0(Bo(C0),ee.d.length/4,{iPos:[new Float32Array(ee.p),3],iQuat:[new Float32Array(ee.q),4],iData:[new Float32Array(ee.d),4]}),gt(2,!0,0,ae.uColonyI,120,.93));ya.frustumCulled=!1,x.add(ya),P.stage.props={helmets:ee,glass:me,schools:Ke},await i.yield();const vo=new u.Vector2,Re=l(0,0,0),z0=l(0,0,0),$e=l(0,0,0),wa=(e,t)=>{e.x%=t.x,e.y%=t.y,e.z%=t.z};return{scene:x,path:P,duration:X0,camera:{fov:62,near:.12,far:1500,lookAhead:14,sway:.3,bank:ba},pace:L0,pois:B0,portal:{shape:"circle",radius:5.5,color:"#9FE0FF",glow:.3,revealDistance:220,tilt:!0},post:{exposure:1.25,bloom:{strength:.55,radius:.6,threshold:.9},grade:{saturation:1.08,contrast:1.06,tint:"#f3f6ff",shadowTint:v.cast==="gold"?"#040404":"#03051a",vignette:.42,grain:.03,aberration:0}},ride:"none",update(e,t,a,o){ae.uTime.value=t;const s=i.renderer?.getDrawingBufferSize?i.renderer.getDrawingBufferSize(vo).y:720;ae.uPxScale.value=a.projectionMatrix.elements[5]*(s||720)*.5;const n=o*p0/Tt;_t(n),$e.setFromMatrixPosition(a.matrixWorld),R0.position.copy($e);const c=1-m(.3,.42,n);$a.u.uGain.value=(1+3*nt.value)*c,b0&&(b0.u.uRise.value+=.9*Y.fishSign*e,b0.u.uGain.value=c*(1-.3*ae.uEntry.value),b0.mesh.visible=c>.001),w0.u.uGain.value=(1+.5*nt.value)*c*(1-.45*m(.06,.1,n)*(1-m(.12,.15,n))),Ya.u.uGain.value=c,ga.value=2.2*m(.09,.17,n)*(1-m(.3,.37,n)),da.value=m(E.tip-.02,E.tip+.045,o),p.setProgress(o);const h=m(E.tip+.004,E.tip+.032,o),w=m(E.rideEnd-.012,E.lift,o);p.setBand(Na(o)+X(-5,3,h)+2.2*W((o-E.tip-.03)/(E.rideEnd-E.tip-.03),0,1)+16*w,h*(1-w)),p.update(e,t,a);const b=A?(o-d0)/(1-d0):-1,k=b>0?m(0,.03,b)*(1-m(.2,.6,b)):0;ae.uColonyI.value=1.6*(1+.07*Math.sin(t*2.1))*(1+1.1*k),ua.value=4*(1+.07*Math.sin(t*2.1))*(1+.45*k),it.uHaloK.value=Ua*(1+(S0?.6:1.5)*k),ca.value=A?H(o,d0-.025,d0+.06,.3):0,ha.value=(o-d0+.025)*X0;const T=m(E.rideEnd-.02,E.lift+.01,o)*(1-m(E.join-.045,E.join+.015,o)),I=m(E.join-.045,E.join+.015,o),z=X(-.06,5,m(.12,.16,n)*(1-m(.4,.47,n)))-.16*T;I0.u.uOffset.value.y+=z*e,wa(I0.u.uOffset.value,ct),Xt.u.uOffset.value.y-=.06*e,wa(Xt.u.uOffset.value,ht),w0.u.uOffset.value.y=(w0.u.uOffset.value.y+.9*Y.fishSign*e)%H0,P.tangentAt(o,Re);const te=.36+.64*m(.11,.17,n)*(1-m(.4,.47,n))-.14*m(.42,.48,n)*(1-m(E.rideEnd,E.lift,o))+.3*I;if(Wt.value.set(-Re.x*Mt,z-Re.y*Mt,-Re.z*Mt).multiplyScalar(.05*te),z0.set(0,0,-1).transformDirection(a.matrixWorld),I0.u.uCenter.value.copy($e).addScaledVector(z0,11),aa.u.uCenter.value.copy($e).addScaledVector(z0,7),aa.u.uVis.value=1-m(.46,.505,n)+.85*T*(1-m(E.join-.09,E.join-.04,o)),n0){const y=m(.1,.14,n);n0.u.uCenter.value.copy($e).addScaledVector(z0,X(3,4.2,y)),n0.u.uBox.value.copy(ea).multiplyScalar(X(.64,1,y)),n0.u.uVis.value=m(.004,.06,n)*(1-m(.27,.31,n)),n0.mesh.visible=n0.u.uVis.value>.001}I0.u.uGain.value=Kt*(1-.5*m(E.rideEnd-.03,E.lift,o)*(1-m(E.join-.025,E.join+.025,o)))*(1-.5*ae.uEntry.value),l0.u.uVis.value=m(.272,.315,o)*(1-m(.4,.425,o)),l0.mesh.visible=l0.u.uVis.value>.001,l0.mesh.visible&&la(o,l0.u.uCenter.value),i0.u.uVis.value=m(.283,.322,o)*(1-m(.385,.42,o)),i0.mesh.visible=i0.u.uVis.value>.001,i0.mesh.visible&&ro(o,i0.u.uCenter.value),Ja.u.uGain.value=2*m(E.lift,E.lift+.075,o)*(1-.6*I),Re.subVectors($e,C);const $=Math.max(Re.length(),.001),g=Math.abs(Re.dot(K))/$,L=m(E.lift-.01,E.lift+.075,o)*(1-.3*m(E.join-.045,E.join+.02,o));$>.5&&ae.uDeepDir.value.copy(Re).multiplyScalar(-1/$),ae.uDeepCol.value.copy(Ra).multiplyScalar(L),ae.uDeepCol2.value.copy(Ia).multiplyScalar(L);const R=(1-m(.14,.34,g))*m(9,15,$)*m(.3,.4,o);eo.u.uGain.value=.2*R,Jt.uEyeGain.value=R,M0.visible=R>.002,ao.u.uGain.value=R,$t&&$t.u.uCenter.value.copy($e).addScaledVector(z0,6)},dispose(){p.dispose()}}}};export{Wo as default};
