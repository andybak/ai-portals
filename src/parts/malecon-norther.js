import*as s from"three";import{clamp as ee,lerp as H,smoothstep as X}from"../kit/core.js";const K=9.8,Y=1.2,oe=1.5,$=10,be=2.4,xe=["#252C5E","#1D6E72","#F5F8F4","#E8929A","#9AD4B8","#E3A84B","#17B3AE"],te=`
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float fbm(vec2 p){ return 0.5 * vn(p) + 0.25 * vn(p * 2.03 + 11.) + 0.125 * vn(p * 4.1 + 23.) + 0.0625 * vn(p * 8.2 + 37.); }
// foam lace: thin veins where two noise fields cross their mid level
float veins(vec2 p){ float a = abs(fbm(p) - 0.47), b = abs(fbm(p * 1.9 + 17.3) - 0.47); return min((1. - smoothstep(0.0, 0.075, a)) * 0.8 + (1. - smoothstep(0.0, 0.05, b)) * 0.55, 1.); }
`,re=`
float lamp1(float ds, float q, float dy){ float r2 = ds * ds + q; return (1. - 0.85 * smoothstep(0., 0.7, dy * inversesqrt(r2 + 1e-4))) / (1. + 0.2 * r2); }
float wallLamps(float s, float l, float y){
  float dl = l - 1.3, dy = y - 5.55, q = dl * dl + dy * dy;
  float a = 8. + 16. * floor((s - 8.) / 16.), a1 = a + 16., b = clamp(288. + 32. * floor((s - 288.) / 32.), 288., 320.);
  float oa = (1. - step(262., a) * step(a, 358.)) * step(a, 604.), oa1 = (1. - step(262., a1) * step(a1, 358.)) * step(a1, 604.);
  return oa * lamp1(s - a, q, dy) + oa1 * lamp1(s - a1, q, dy) + lamp1(s - b, q, dy) + lamp1(s - b - 32., q, dy);
}
`,pe=`
uniform float uTear, uTau, uScale; uniform vec3 uVT;
// the frame the water's patterns are laid in: metres, riding a slow reference drop (thrown up at 16 m/s with the burst, then
// falling and drifting at terminal velocity). Emission order stretches fivefold where the water is fast, so a pattern laid in
// it is ruled lines and long shards near the root; in this frame the cells are round at every age and old water carries them
vec2 waterFrame(vec3 loc, float L){
  float t = max(uTau, 0.), E = (1. - exp(-${Y.toFixed(2)} * t)) / ${Y.toFixed(2)};
  vec3 Pm = loc / uScale - uVT * t - vec3(0., (16. - uVT.y) * E, 0.);
  return vec2(Pm.x, Pm.y + 0.7 * Pm.z) + L * vec2(17.3, 5.1);
}
float gEdge;      // how far inside the sheet's side limits a fragment is (0 at the limit), left by lace() for the caller
float lace(vec3 uv, float age, vec2 pw, out float n1, out float n2){
  float s = uv.x, e = uv.y, L = uv.z;
  vec2 q = pw * 0.9;
  q += 1.6 * vec2(vn(q * 0.33 + 3.), vn(q * 0.33 + 9.));
  n1 = fbm(q); n2 = fbm(q * vec2(2.6, 1.9) + 7.7);
  float streak = vn(vec2(s * 85. + L * 31., e * 2.2 + 1.3));
  float breakup = smoothstep(mix(2.5, 1.5, uTear), mix(5.2, 3.6, uTear), age);
  // no ruled edge anywhere: the side and trailing limits of the sheet wander with the lace's own noise
  // (the side limits come and go in lobes a few metres across, so the end of a sheet is never a ruled rising line)
  float nl = vn(pw * 0.22 + 31.);
  float edgeS = (1. - smoothstep(0.74 - 0.22 * n2 - 0.24 * nl, 1.02 - 0.1 * n2 - 0.12 * nl, abs(s)));
  gEdge = edgeS;
  float lead = smoothstep(0.0, 0.2, e);
  float trail = 1. - smoothstep(mix(0.9, 0.76, step(0.5, uTear)) - 0.3 * n1, 1.03 - 0.12 * n1, e);
  float dens = edgeS * trail * (0.5 + 0.5 * smoothstep(0.0, 0.5, e)) * (0.5 + 0.5 * lead) * (1. - mix(0.55, 0.8, uTear) * breakup);
  // streaks belong to old, falling, torn water: the young sheet has none, and its froth is round grain, not hair
  float torn = smoothstep(1.0, 2.2, age);
  float froth = mix(vn(pw * vec2(5.3, 5.9)), vn(vec2(s * 420. + L * 9., e * 70.)), torn);
  float h = 0.5 * n1 + 0.22 * n2 + (0.14 * torn + 0.5 * breakup) * streak + 0.2 * froth;
  // water just thrown is an unbroken wall for its first second: it tears into lace only as it ages
  // (but its leading rim is left to the lace: a ragged crest under the billows, never the straight edge of the sheet itself)
  float young = 0.6 * (1. - smoothstep(0.6, 2.0, age)) * edgeS * trail * smoothstep(0.0, 0.06, e);
  return dens * 1.08 + 0.03 + young - h - uTear * (0.12 * breakup + 0.05 * (1. - lead));
}
`,ve=`
uniform float uTau, uScale; uniform vec3 uVT;
attribute vec3 aV0, aDvs, aDve, aUv; attribute vec4 aT;
varying vec3 vW, vN, vUv, vLoc; varying float vAge, vBorn;
#include <fog_pars_vertex>
vec3 flight(out vec3 nrm){
  float born = uTau - aT.x, age = max(born, 0.), live = step(0., born);
  float ex = exp(-${Y.toFixed(2)} * age), E = (1. - ex) / ${Y.toFixed(2)};
  vec3 lp = position + ((aV0 - uVT) * E + uVT * age) * uScale;
  vec3 vel = (aV0 - uVT) * ex + uVT;
  vec3 dPs = vec3(aT.w, 0., 0.) + aDvs * E - vel * (aT.y * live);
  vec3 dPe = aDve * E - vel * (aT.z * live) + vec3(0., 1e-4, 0.);
  vec3 n = cross(dPs, dPe);
  nrm = n / max(length(n), 1e-6);
  vAge = age; vBorn = born; vUv = aUv; vLoc = lp;
  return lp;
}
`,de=`
float wetMask(vec2 p){ return smoothstep(0.30, 0.62, fbm(p * 0.085 + 3.3) * 0.75 + vn(p * 0.31 + 9.) * 0.3); }
`,ze=ve+`
void main(){
  vec3 n; vec3 lp = flight(n);
  vec4 wp = modelMatrix * vec4(lp, 1.);
  vW = wp.xyz; vN = normalize(mat3(modelMatrix) * n + vec3(0., 1e-5, 0.));
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Se=`
uniform vec3 uSun, uSunCol, uSky, uJade, uTeal, uLampGlow, uIndigo; uniform float uTransmit, uThroat, uDeepK, uRimW; uniform vec3 uLampP;
#ifdef CANOPY_DAY
uniform float uDay;
#endif
varying vec3 vW, vN, vUv, vLoc; varying float vAge, vBorn;
#include <fog_pars_fragment>
${te}${pe}${re}
// cauliflower: round heads with sharp creases between them
float billow(vec2 p){ return 0.65 * abs(2. * vn(p) - 1.) + 0.35 * abs(2. * vn(p * 2.3 + 5.) - 1.); }
void main(){
  if (vBorn < 0.) discard;
  if (vLoc.z > 0.05 && vLoc.y < 0.04) discard;
  if (vLoc.y < -4.4) discard;
  vec2 pw = waterFrame(vLoc, vUv.z);
  float n1, n2; float m = lace(vUv, vAge, pw, n1, n2);
  float dCam = length(cameraPosition - vW);
  // a torn sister seen from close by is lace and spray, never a hanging panel: its sheet thins as the viewer nears it
  m -= step(0.5, uTear) * 0.42 * (1. - smoothstep(12., 38., dCam));
  // and the low body and back plume of every fan open into lace within 18 m of the viewer: never a slab beside the car
  m -= step(0.5, vUv.z) * 0.5 * (1. - smoothstep(5., 18., dCam));
  // (the canopy itself too, once it is old: no hard-edged shard hangs over the viewer)
  m -= (1. - step(0.5, vUv.z)) * (1. - smoothstep(5., 20., dCam)) * max(0.2 * smoothstep(1.5, 3., vAge), 0.3 * smoothstep(0.45, 0.8, vUv.y));
  if (m < 0.) discard;
  // the rim of every hole breaks into grains of spray instead of a knife edge: wider on old water and close to the viewer
  float nearK = 1. - smoothstep(8., 30., dCam);
  float grainH = h21(floor(gl_FragCoord.xy) * 0.37 + floor(vAge * 14.));
  // (and the ends of a sheet thin out into the same grains)
  // (round 13: by lamplight, uRimW > 0, neither the ends nor the rims are cut into grains: they thin by opacity, at the foot of this shader)
  float rimG = 0.11 * max(uTear, 0.6) * (1. + 2.2 * smoothstep(2.0, 4.5, vAge) + 1.6 * nearK);
  if (uRimW <= 0. && gEdge < 0.8 * h21(floor(gl_FragCoord.xy) * 0.53 + 7.3 + floor(vAge * 14.))) discard;
  if (uRimW <= 0. && m < rimG * grainH) discard;
  vec3 V = normalize(cameraPosition - vW + vec3(0., 1e-5, 0.));
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
  if (dot(N, V) < 0.) N = -N;
  N = normalize(N + V * (0.75 * uTear));
  // billows: the face of the sheet is lumped like cauliflower, round heads and creases (strongest while it is young)
  float youngK = 1. - smoothstep(1.0, 2.4, vAge);
  vec2 bp = pw * vec2(0.3, 0.55);
  float b0 = billow(bp), bx = billow(bp + vec2(0.1, 0.)) - b0, by = billow(bp + vec2(0., 0.1)) - b0;
  vec3 T1 = normalize(cross(N, vec3(1., 0., 0.)) + vec3(0., 1e-4, 2e-4)), T2 = cross(N, T1);
  N = normalize(N - (T2 * bx + T1 * by) * (2.5 + 3.5 * youngK) + vec3(0., 1e-5, 0.));
  // grain: round froth cells in the water frame and a finer break fixed in the air, so no part of a sheet shades like silk
  float fr = vn(pw * vec2(4.3, 5.1));
  N = normalize(N + (vec3(n1, n2, fr) - 0.5) * 0.6 + (vec3(vn(vLoc.xz * 7.), vn(vLoc.xy * 7. + 3.), vn(vLoc.zy * 7. + 9.)) - 0.5) * 0.7 + vec3(0., 1e-5, 0.));
  float ndl = dot(N, uSun);
  float front = clamp(ndl * 0.5 + 0.5, 0., 1.);
  float back = clamp(-ndl * 0.85 + 0.15, 0., 1.);
  float root = smoothstep(0.3, 0.95, vUv.y);
  float thin = clamp(1. - m * 3.2, 0., 1.);
  float foam = 0.8 + 0.25 * n1;
  float glass = smoothstep(0.15, 0.85, vUv.y) * (1. - smoothstep(0.35, 1.7, vAge)) * (0.55 + 0.45 * n2);
  glass *= 1. - 0.7 * smoothstep(0.55, 0.75, vn(pw * 0.3 + 3.));
  vec3 alb = mix(vec3(0.93, 0.96, 0.95), uJade * 0.95, glass * 0.6) * foam * (0.9 + 0.2 * fr);
  float hollow = 0.72 + 0.28 * smoothstep(0.25, 0.6, n1);
  float tn = fbm(pw * 0.32 + 7.);
  hollow *= 0.82 + 0.36 * tn;
  vec3 col = alb * (uSunCol * front * front * 1.12 * hollow + uSky * 1.1 * (0.4 + 0.6 * front));
  float dense = clamp(0.1 + 1.25 * tn + 0.3 * root - 0.5 * thin, 0., 1.);
  vec3 deep = mix(uJade * uJade * 1.5, uTeal, 0.4);
  vec3 tcol;
  // seen from under, the sheet is not one tone: thin lace lets the light through, ribs of thick water hold it back as deep jade
  float v1 = veins(pw * 0.26 + 3.1);
  float v2 = veins(pw * 0.85 + 5.);
  float laceT = clamp(v1 * 0.75 + v2 * 0.5, 0., 1.);
  // (the ribs run down the fall: they belong to the hanging and falling water, not to the wall just thrown)
  float rib = smoothstep(0.42, 0.78, fbm(vec2(vUv.x * 17. + vUv.z * 5., vUv.y * 2.3 + 3.))) * (1. - 0.85 * youngK);
  dense = clamp(dense + 0.4 * rib - 0.3 * laceT, 0., 1.);
  tcol = mix(vec3(0.82, 1.0, 0.92), deep, smoothstep(0.42, 0.95, dense) * uDeepK);
  col += tcol * uSunCol * back * (1.6 - 0.9 * dense) * uTransmit * (0.55 + 1.0 * laceT) * (1. - 0.4 * rib);
  col *= (0.86 + 0.24 * laceT - 0.2 * rib) * (1. - 0.22 * rib * (1. - laceT) * back);      // veined foam on the lit side too
  // the thrown wall has weight: the creases between its billows are shaded and its heart is blue-grey under a bright crest
  col *= mix(1., 0.6 + 0.4 * smoothstep(0.0, 0.3, b0), 0.35 + 0.65 * youngK);
  col = mix(col, col * vec3(0.68, 0.77, 0.92), 0.55 * youngK * smoothstep(0.06, 0.4, vUv.y));
  // the hanging sheet is foam cells, bright threads round darker water, and so is any water seen from close by
  col *= mix(1., 0.75 + 0.5 * veins(pw * 2.2 + 9.), max(smoothstep(1.5, 2.2, vAge), 1. - smoothstep(10., 28., dCam)));
  // the crest catches the sun as a bright rim
  float rimF = 1. - abs(dot(normalize(vN + vec3(0., 1e-5, 0.)), V)); rimF = rimF * rimF * rimF;
  col += uSunCol * rimF * 1.5 * (1. - smoothstep(0.08, 0.15, vUv.y));
  // by lamplight the fan has a dark heart: the hollow under the arch and the foot of the wall fall to indigo shade, the
  // plumes above stay pale, and every edge that turns away from the eye takes the lamps' amber
  // (the young wall only: old, falling water is lace and keeps its own light)
  float throat = uThroat * (1. - smoothstep(1.5 * uScale, 13. * uScale, vLoc.y)) * (0.45 + 0.55 * root) * (0.55 + 0.45 * smoothstep(0.35, 0.65, tn)) * (1. - 0.75 * smoothstep(1.8, 3.2, vAge));
  // (seen from far off the heart is shallower: at a distance the fan is a pale tower, its dark heart is for the viewer under it)
  col = mix(col, col * (uIndigo * 2.2 + 0.06), mix(0.8, 0.4, smoothstep(22., 55., dCam)) * throat);
  // (round 13) the standards' light BY PLACE, in the fan's own frame: uLampP = the fan's station, its metres landward of the
  // wall's foot, and 1 where it stands along the wall's line (0 for the breakers past the last standards). The amber rim takes it
  float lampL = uLampP.z * wallLamps(uLampP.x - vLoc.x, uLampP.y + vLoc.z, vLoc.y);
  col += uLampGlow * rimF * 0.5 * uThroat * (0.4 + 0.6 * n2) * lampL;
  // seen from close by under the lamps the wall is not one pale mass: its thick water is slate-indigo and only the lace is bright
  float nearD = uThroat * (1. - smoothstep(40., 110., dCam));
  float body = nearD * smoothstep(0.3, 0.75, dense) * (1. - 0.6 * laceT);
  col = mix(col, col * vec3(0.3, 0.4, 0.75), 0.75 * body) * (1. - 0.18 * nearD);
  // (round 13: in place of one constant amber in three fixed pools) the water takes the lanterns' light where it is: strongest
  // low and by the wall under a standard, less between two, little above the lantern heads; faces turned toward the lanterns
  // (downward above their height, upward below it) take the most of it, and the bright lace more than the dark water
  float lampW = 0.62 + 0.38 * clamp(0.5 - 0.6 * N.y * clamp((vLoc.y - 5.55) / 5., -1., 1.), 0., 1.);
  col += alb * uLampGlow * lampL * lampW * (0.45 + 0.55 * tn) * (0.2 + 1.1 * laceT);      // (13b: the lace takes the lanterns' light, clear dark water little of it)
  col += uSunCol * thin * front * 0.45;
  float sp = max(dot(reflect(-uSun, N), V), 0.); sp *= sp; sp *= sp; sp *= sp; sp *= sp;
  col += uSunCol * sp * 0.9;
  col *= 1. - 0.3 * root * (1. - front) * (1. - back);
#ifdef CANOPY_DAY
  // BY DAY (opts.day; this block is compiled only for sunlit looks, the lamp-lit ones never see it) the water that hangs over the
  // viewer is seen from beneath with the sun beyond it. A low sun grazes that face, so the lit term above (front squared) and the
  // transmitted one (back) both come to little there and its roughened normal flips between them: what was left was skylight on
  // foam and a warm sun through jade, a grey-olive mottle like lichen on rock. Thrown water is a body of light, not a surface:
  // here it glows by its thickness alone, green-white where it is thin (the lip, the rims of the holes), pale aqua in the hang,
  // jade only in the throat by the wall, laced with white foam, and the roughened normal has no say in it
  if (uDay > 0.) {
    vec3 Ng = normalize(vN + vec3(0., 1e-5, 0.)); if (dot(Ng, V) < 0.) Ng = -Ng;
    float beyond = 1. - 0.5 * smoothstep(0.4, 0.95, dot(Ng, uSun));      // a wide wrap: scattering water has no terminator
    // hanging water, any of it looked up at, and all of it from close by (the young wall far off keeps its sunlit face)
    float seen = max(max(smoothstep(0.7, 1.6, vAge), smoothstep(0.1, 0.45, -V.y)), 1. - smoothstep(25., 45., dCam));
    float th = 0.2 + 0.5 * smoothstep(0.25, 0.95, vUv.y) + 0.35 * (1. - smoothstep(2. * uScale, 12. * uScale, vLoc.y)) * smoothstep(0.2, 0.6, vUv.y)
      + 0.3 * (tn - 0.45) + 0.22 * rib - 0.3 * thin;
    th = clamp(th, 0., 1.);
    vec3 sunW = mix(uSunCol, vec3(dot(uSunCol, vec3(0.3, 0.59, 0.11))), 0.7);      // water takes the red out of a warm sun: no olive
    vec3 wc = mix(vec3(0.74, 1.0, 0.88), vec3(0.42, 0.93, 0.80), smoothstep(0.1, 0.55, th));
    wc = mix(wc, vec3(0.08, 0.47, 0.40), smoothstep(0.5, 1.05, th));
    // (its grain: froth cells, and on old water the streaks of the fall, so no reach of it is a smooth pale panel)
    vec3 g = wc * (sunW * mix(1.0, 0.55, smoothstep(0.1, 1.0, th)) + uSky * 0.9) * (0.88 + 0.12 * fr + 0.12 * smoothstep(1.0, 2.2, vAge) * vn(vec2(vUv.x * 85. + vUv.z * 31., vUv.y * 2.2 + 1.3)));
    float fl = clamp(0.85 * v2 + 0.6 * v1 + 0.3 * veins(pw * 2.2 + 9.), 0., 1.);
    g = mix(g, vec3(0.95, 1.0, 0.98) * (sunW * 1.08 + uSky * 1.1), fl * (0.5 + 0.3 * th));
    g += sunW * (0.32 * (1. - smoothstep(0.02, 0.16, vUv.y)) + 0.22 * thin);      // the torn lip and the rim of every hole burn white
    col = mix(col, g, uDay * beyond * seen);
  }
#endif
  // (round 13) BY LAMPLIGHT THE SHEET THINS TO NOTHING AT ITS RIM (uRimW > 0; the material is then blended): its opacity is the
  // lace's own margin m, how far inside the water this point of the sheet is by the lace law, so thin water lets the dark through
  // and the young heart stays solid; the band is uRimW plus the width the day's grains break up (wider on old water and close
  // by); inside it the opacity breaks into the froth's own cells (0.23 m, in the water's frame) where the day cuts single grains;
  // the ends thin the same way, and the leading crest thins over the first 0.18 of the emission order (its points were hard);
  // (13b) old falling water is NOT thinned as a whole. By day uRimW is 0: opacity 1, the grains and the hard sunlit edge, as before
  float al = uRimW > 0. ? smoothstep(0., uRimW + rimG, m + 0.3 * (fr - 0.5)) * smoothstep(0., 0.8, gEdge) * smoothstep(-0.02, 0.18, vUv.y) : 1.;
  if (al < 0.02) discard;
  gl_FragColor = vec4(col, al);
  #include <fog_fragment>
}`,Ae=ve+`
uniform mat4 uInv; uniform float uRoadY, uTime;
varying vec3 vP;
void main(){
  vec3 n; vec3 lp = flight(n);
  vec4 wp = modelMatrix * vec4(lp, 1.);
  vec3 M = vec3(wp.x, 2. * uRoadY - max(wp.y, uRoadY + 0.3), wp.z), C = cameraPosition;
  float t = (C.y - uRoadY) / max(C.y - M.y, 1e-3);
  vec3 P = C + (M - C) * t;
  P.xz += 0.12 * vec2(sin(P.z * 1.9 + uTime * 2.3), sin(P.x * 1.6 - uTime * 1.9));
  P.y = uRoadY + 0.03;
  vP = (uInv * vec4(P, 1.)).xyz; vW = P; vN = n;
  vec4 mvPosition = viewMatrix * vec4(P, 1.);
  gl_Position = projectionMatrix * mvPosition;
  if (C.y < uRoadY + 0.2) gl_Position = vec4(2., 2., 2., 1.);
  #include <fog_vertex>
}`,Me=`
uniform vec3 uSunCol, uSky, uJade, uLampGlow, uLampP; uniform float uTime;
varying vec3 vW, vN, vUv, vLoc, vP; varying float vAge, vBorn;
#include <fog_pars_fragment>
${te}${pe}${de}${re}
void main(){
  if (vBorn < 0. || vLoc.y < 0.4 || vP.z < 5.25) discard;
  float n1, n2; float m = lace(vUv, vAge, waterFrame(vLoc, vUv.z), n1, n2);
  if (m < 0.) discard;
  vec3 V = normalize(cameraPosition - vW + vec3(0., 1e-5, 0.));
  float g = 1. - clamp(V.y, 0., 1.);
  float fres = 0.22 + 0.78 * g * g * g;
  float wet = 0.22 + 0.78 * wetMask(vP.xz);
  vec3 col = mix(vec3(0.93, 0.96, 0.95), uJade, 0.3 * smoothstep(0.3, 0.9, vUv.y)) * (0.8 + 0.3 * n1) * (uSunCol * 0.85 + uSky * 1.1 + uLampGlow * (uLampP.z * wallLamps(uLampP.x - vLoc.x, uLampP.y + vLoc.z, vLoc.y)));      // (round 13: the image carries the water's lamplight)
  float rip = (0.5 + 0.5 * vn(vec2(vP.x * 1.4 + uTime * 0.7, vP.z * 0.3 - uTime * 0.5))) * smoothstep(0., 0.3, m);
  gl_FragColor = vec4(col, 0.85 * fres * wet * rip * smoothstep(0.4, 2.5, vLoc.y));
  #include <fog_fragment>
}`,ce=[{speed:1,spread:.42,lean:.1,w0:13,z0:-1.6,ns:150,ne:84},{speed:.62,spread:.5,lean:-.12,w0:15,z0:-3,ns:84,ne:44},{speed:.9,spread:.34,lean:.04,w0:10,z0:-2.5,ns:84,ne:44}];function Te(t,e){return function(b,A,M,v){const m=ce[M],g=e.sd+M*13.7,f=.6*t.n2(b*1.6*e.lobes+g,M*3.1)+.32*t.n2(b*4.3+g,7.3+M),x=t.n2(b*13+g,A*1.4+M*5.1),k=Math.abs(b),L=1-Math.pow(k,2.4),W=e.v0*m.speed*(.55+.45*L)*(1+.25*f+.07*x)*(1-.55*Math.pow(A,1.3))*(1+.045*t.n2(b*5+g,A*4)),F=b*m.spread*e.spread+.05*t.n2(b*3-g,A*2),P=m.lean+e.lean+.09*t.n2(b*2.2+g*.7,2+M)+A*.1,n=Math.cos(F);return v[0]=b*m.w0+.5*t.n2(b*4,g),v[1]=-2.7+1.3*A,v[2]=m.z0+.35*t.n2(b*3,g+9),v[3]=W*Math.sin(F),v[4]=W*n*Math.cos(P),v[5]=W*n*Math.sin(P),v[6]=be*A+.3*Math.pow(Math.abs(b-e.s0),1.3)+.07*t.n2(b*6+g,3),v}}function ne(t,e,c,b,A,M,v){const m=Math.max(e,0),g=Math.exp(-c*m),f=(1-g)/c,x=-K/c;return v.x=t[0]+((t[3]-b)*f+b*m)*M,v.y=t[1]+((t[4]-x)*f+x*m)*M,v.z=t[2]+((t[5]-A)*f+A*m)*M,v}async function we(t,e,c,b){let A=0,M=0;const v=e.map(o=>{const a=c?c[0]:ce[o].ns,r=c?c[1]:ce[o].ne;return A+=(a+1)*(r+1),M+=a*r*6,[a,r]}),m=new Float32Array(A*3),g=new Float32Array(A*3),f=new Float32Array(A*3),x=new Float32Array(A*3),k=new Float32Array(A*3),L=new Float32Array(A*4),W=new Uint32Array(M),F=new Float64Array(7),P=new Float64Array(7),n=new Float64Array(7),l=.004;let h=0,i=0;for(let o=0;o<e.length;o++){const a=e[o],[r,d]=v[o],p=h;for(let T=0;T<=d;T++)for(let w=0;w<=r;w++,h++){w===0&&await b();const y=w/r*2-1,z=T/d;t(y,z,a,F),t(y+l,z,a,P),t(y,z+l,a,n),m[h*3]=F[0],m[h*3+1]=F[1],m[h*3+2]=F[2];for(let S=0;S<3;S++)g[h*3+S]=F[3+S],f[h*3+S]=(P[3+S]-F[3+S])/l,x[h*3+S]=(n[3+S]-F[3+S])/l;k[h*3]=y,k[h*3+1]=z,k[h*3+2]=a,L[h*4]=F[6],L[h*4+1]=(P[6]-F[6])/l,L[h*4+2]=(n[6]-F[6])/l,L[h*4+3]=(P[0]-F[0])/l}for(let T=0;T<d;T++)for(let w=0;w<r;w++){const y=p+T*(r+1)+w,z=y+r+1;W[i++]=y,W[i++]=y+1,W[i++]=z,W[i++]=y+1,W[i++]=z+1,W[i++]=z}}const u=new s.BufferGeometry;return u.setAttribute("position",new s.BufferAttribute(m,3)),u.setAttribute("aV0",new s.BufferAttribute(g,3)),u.setAttribute("aDvs",new s.BufferAttribute(f,3)),u.setAttribute("aDve",new s.BufferAttribute(x,3)),u.setAttribute("aUv",new s.BufferAttribute(k,3)),u.setAttribute("aT",new s.BufferAttribute(L,4)),u.setIndex(new s.BufferAttribute(W,1)),u.boundingSphere=new s.Sphere(new s.Vector3(0,10,8),60),u}const ke=`
uniform float uTau, uScale, uPix, uMist; uniform vec2 uWind, uBil, uNrR; uniform vec3 uLampP;
attribute vec3 aV0, aS; attribute vec4 aP; attribute vec2 aC;
varying vec2 vC, vAx, vLmp; varying float vA, vSoft, vSeed, vBil, vDis, vShade, vNear, vDk, vNr; varying vec3 vW;
#include <fog_pars_vertex>
${re}
void main(){
  float born = uTau - aP.x, age = max(born, 0.), k = aP.y, type = aP.w;
  vec3 vT = vec3(uWind.x, -9.8 / k, uWind.y);
  float ex = exp(-k * age), E = (1. - ex) / k;
  vec3 lp = position + ((aV0 - vT) * E + vT * age) * uScale;
  vec3 vel = (aV0 - vT) * ex + vT;
  // (round 13) the standards' light at this particle's own place (see the sheet), and how far above or below the lanterns it flies
  vLmp = vec2(uLampP.z * wallLamps(uLampP.x - lp.x, uLampP.y + lp.z, lp.y), clamp((lp.y - 5.55) / 5., -1., 1.));
  float life = aS.y;
  float fade = step(0., born) * (1. - smoothstep(life * 0.55, life, age)) * smoothstep(0., 0.08, age) * (type > 3.5 ? 1. : aS.z);
  float gy = lp.z > 0.05 ? (lp.z < 5.1 ? 0.15 : 0.) : -4.2;
  fade *= smoothstep(gy - 0.1, gy + 0.25, lp.y);
  float soft = step(0.5, type) * (1. - step(1.5, type)) + step(2.5, type);
  // a billow (type 4) is a round shaded puff of thrown water: the body and the cauliflower crest of the young wall
  float bil = step(3.5, type);
  float sz = aP.z * mix(1., 1. + age * (type > 2.5 ? 1.3 : 0.75), soft);
  sz = mix(sz, aP.z * uScale * 1.25 * (0.6 + 0.4 * smoothstep(0., 0.3, age) + 0.3 * age), bil);
  vec4 mvPosition = modelViewMatrix * vec4(lp, 1.);
  // (the billows are larger only from a distance, where they must close into one wall: close by they stay small and open, and the
  // lace of the sheet shows between them)
  vNr = 1. - smoothstep(uNrR.x, uNrR.y, -mvPosition.z);
  sz *= mix(1., mix(uBil.x, 1., vNr), bil);
  vec3 vv = (modelViewMatrix * vec4(vel, 0.)).xyz;
  fade *= mix(mix(smoothstep(3.0, 12.0, -mvPosition.z), smoothstep(6., 30., -mvPosition.z), soft), smoothstep(3., 10., -mvPosition.z), bil);
  fade *= mix(1., uMist, soft * (1. - bil));
  // ordinary drops (type 0) show only once the sheet starts to tear: the young burst is a wall, not a brush
  fade *= mix(1., smoothstep(0.5, 1.4, age), step(-0.5, type) * (1. - step(0.5, type)));
  float boost = max(1., max(-mvPosition.z, 0.1) * uPix / sz); sz *= boost; fade /= boost;
  vNear = 1. - smoothstep(12., 35., -mvPosition.z);
  vDk = 1. - smoothstep(30., 95., -mvPosition.z);
  // a soft puff is drawn in front of the sheet it rides in (pulled about its own radius toward the eye, at the same size on
  // screen): a billboard cut by the sheet shows as a ruled line across the water
  float pull = soft * min(1.2 * sz, 0.5 * max(-mvPosition.z - 1.5, 0.)), pk = 1. - pull / max(-mvPosition.z, 0.1);
  mvPosition.xyz *= pk; sz *= pk;
  float sp = length(vv.xy); vec2 ax = sp > 1e-3 ? vv.xy / sp : vec2(0., 1.);
  // a billow keeps the shape it was thrown with: a plume drawn out along the line from the root of the burst (uBil.y), so the
  // standing wall is a sheaf of radial lobes and streaks of water, never a heap of balls
  vec2 dv = (modelViewMatrix * vec4(lp - position, 0.)).xy; float dl = length(dv);
  float plume = bil * uBil.y * smoothstep(0.5, 3., dl) * smoothstep(0.5, 1., aP.z);      // (the fine fringe stays round: drawn out, it is splinters)
  ax = normalize(mix(ax, dv / max(dl, 1e-3), plume) + vec2(0., 1e-4));
  // a finger jet (type -1) is a file of drops down one trajectory, each stretched to overlap the next: a continuous thread
  float jet = 1. - step(-0.5, type);
  // a thread frays and dies in the air: gone before it can come down on the road as a rod
  // (and it is seen only while it is fast: once it slows at the top of its arc its links drift apart into a ladder of dashes)
  fade *= mix(1., (1. - smoothstep(1.2, 2.0, age)) * smoothstep(0.8, 2.5, lp.y - gy) * smoothstep(5., 11., length(vel)) * smoothstep(8., 22., -mvPosition.z), jet);
  float late = smoothstep(1.6, 2.6, age);
  float stretch = (1. - soft) * mix(min(sp * mix(0.022, 0.05, late), mix(0.6, 0.9, late)) * smoothstep(2., 16., -mvPosition.z), min(sp * 0.05, 1.1), jet);
  // a billow is drawn out along its flight while it is fast (a thrown plume) and rounds off as it slows
  stretch += bil * sz * max(min(sp * 0.028, 0.75), 0.85 * plume);
  // falling drops are drawn as short streaks of water, not balls: narrower across their flight than along it
  float wide = mix(1., mix(0.7, 0.5, late), (1. - soft) * (1. - jet) * smoothstep(2., 16., -mvPosition.z)) * mix(1., mix(0.4, 0.75, smoothstep(6., 30., -mvPosition.z)), jet);
  wide *= 1. - 0.22 * plume;
  mvPosition.xy += aC.x * sz * wide * vec2(ax.y, -ax.x) + aC.y * (sz + stretch) * ax;
  vC = aC; vA = fade; vSoft = soft; vSeed = aS.x; vBil = bil; vAx = ax; vShade = mix(aS.z * mix(0.7, 1., smoothstep(-3., 11., lp.y)), 1., 0.8 * vNear); vDis = smoothstep(life * 0.35, life, age); vW = (modelMatrix * vec4(lp, 1.)).xyz;
  gl_Position = projectionMatrix * mvPosition;
  if (fade < 0.004) gl_Position = vec4(2., 2., 2., 1.);
  #include <fog_vertex>
}`,Pe=`
uniform vec3 uSun, uSunCol, uSky, uJade, uLampGlow; uniform float uThroat, uScale, uVeil;
#ifdef CANOPY_DAY
uniform float uDay;
#endif
varying vec2 vC, vAx, vLmp; varying float vA, vSoft, vSeed, vBil, vDis, vShade, vNear, vDk, vNr; varying vec3 vW;
#include <fog_pars_fragment>
${te}
void main(){
  float r = length(vC);
  vec3 V = normalize(cameraPosition - vW + vec3(0., 1e-5, 0.));
  float fs = max(dot(-V, uSun), 0.); fs = fs * fs * fs;
  float a, lampW = 1.; vec3 col;
  if (vBil > 0.5) {
    // a lumped ball of white water: sunlit on one side, blue-grey on the other, creased like cauliflower, a lit rim;
    // as it ages its edge eats inward and holes open, so the wall tears into lace and then into mist
    vec2 p = vC * 1.9 + vSeed * 43.;
    float c1 = vn(p), c2 = vn(p * 2.6 + 7.), c3 = vn(p * 6.1 + 3.);
    float hgt = 0.5 * abs(2. * c1 - 1.) + 0.32 * abs(2. * c2 - 1.) + 0.18 * abs(2. * c3 - 1.);
    float d = r * 1.18 + 0.34 * (0.62 - c1) + 0.2 * (0.6 - c2) + 0.12 * (0.6 - c3);
    float e0 = 0.8 - 0.5 * vDis;
    // (round 13: by lamplight its edge follows the day's law, a band of 0.19, where it was 0.065: with the sheet behind it the hard
    // lobes fused into one pale block. And by lamplight, uVeil 1, a lobe is spray the lanterns shine through: 0.6 opaque at
    // its heart, 0.12 at its rim (13c: 0.28 and 0.056 stood, and a body of spray had too little form), so a body of water is many of them one behind another, with the sheet behind them, and its
    // outline thins. By day and at dawn uVeil is 0)
    a = (1. - smoothstep(e0 - 0.14, e0 + 0.05, d)) * (1. - 0.85 * vDis * smoothstep(0.35, 0.6, c2)) * (1. - smoothstep(0.88, 1., r));
    a *= mix(1., 0.6 * (1. - 0.8 * smoothstep(0.15, 0.85, r)), uVeil);
    // then into grains of spray (and from close by it is clumps of spray from the start, never a smooth ball)
    vec2 gq = mat2(0.8, -0.6, 0.6, 0.8) * vC * (8. + 9. * vNear) + 2.2 * vec2(c1, c2) + vSeed * 91.;
    a *= mix(1., smoothstep(0.3, 0.6, 0.62 * vn(gq) + 0.38 * vn(gq * 2.4 + 5.)), max(smoothstep(0.2, 0.85, vDis), 0.75 * vNear)) * (1. - 0.3 * vNear);
    vec2 gr = vec2(vn(p + vec2(0.2, 0.)) - c1, vn(p + vec2(0., 0.2)) - c1) + 0.4 * vec2(vn(p * 2.6 + vec2(7.3, 7.)) - c2, vn(p * 2.6 + vec2(7., 7.3)) - c2);
    vec2 nq = vC * 0.95 - gr * 3.4;
    vec3 Nv = normalize(vec3(nq.x * vec2(vAx.y, -vAx.x) + nq.y * vAx, sqrt(max(1. - r * r, 0.) + 0.05)));
    vec3 Lv = normalize((viewMatrix * vec4(uSun, 0.)).xyz + vec3(0., 1e-5, 0.));
    float lit = clamp(dot(Nv, Lv) * 0.5 + 0.5, 0., 1.);
    float skyl = 0.55 + 0.45 * dot(Nv, (viewMatrix * vec4(0., 1., 0., 0.)).xyz);
    // (round 13) the lanterns light the side of a lobe that is turned to them: its underside above their height, its top below it
    lampW = (0.62 + 0.38 * clamp(0.5 - 0.6 * dot(Nv, (viewMatrix * vec4(0., 1., 0., 0.)).xyz) * vLmp.y, 0., 1.)) * (0.66 + 0.34 * smoothstep(0., 0.28, hgt));
    // by lamplight the moon stands beyond the water and its light comes through the spray: every lobe is a solid pale body, bright
    // on its moonward shoulder and falling to blue shade on the other (wl: the same light wrapped round to the viewer's side)
    vec3 Lw = normalize(vec3(Lv.xy, 0.4 + 0.6 * abs(Lv.z)));
    float wl = clamp(dot(Nv, Lw) * 0.5 + 0.5, 0., 1.);
    float key = mix(0.16 + 0.96 * lit * lit, (0.17 + 0.6 * wl * wl) * (1. - 0.45 * vNr), uThroat);
    // (round 13: by lamplight the sky's fill is 1.3 where it was 2.2: with the standards lighting the water from below, a fan white
    // from foot to crest under the sky alone was the pale block)
    col = vec3(0.86, 0.88, 0.88) * (uSunCol * key + uSky * mix(1.2, 1.3, uThroat) * skyl) * (0.66 + 0.34 * smoothstep(0., 0.28, hgt)) * (0.9 + 0.2 * vSeed);
    // the heart of the wall is in its own shade: blue-grey under the white crest
    col *= mix(vec3(0.38, 0.5, 0.76), vec3(1.), clamp(vShade * (1. - 0.15 * uThroat) * (0.7 + 0.6 * vn(vW.xy * 0.13 + vW.z * 0.09)), 0., 1.));
    // by lamplight, from close by, the wall of spray is not one pale mass: whole reaches of it stand in slate-indigo shade
    col = mix(col, col * vec3(0.24, 0.32, 0.62), mix(0.3, 0.8, vNr) * uThroat * vDk * smoothstep(0.3, 0.7, vn(vW.xy * 0.11 + vW.z * 0.07 + 5.)));
    // its leading tip thins into spray, and close by the whole lobe is thinner: the veined sheet behind it is the picture there
    a *= (1. - 0.75 * uThroat * smoothstep(0.15, 0.95, vC.y)) * (1. - 0.8 * uThroat * vNr);
    // the lit rim: all round a lobe by day, by lamplight only on the shoulder that is turned to the moon
    col += uSunCol * (0.6 * fs * mix(1., 0.75 * wl * wl * wl, uThroat) + 0.3 * lit * vShade) * smoothstep(0.4, 0.9, d);
#ifdef CANOPY_DAY
    // by day a lobe of spray looked up at from under the arch has the sun beyond it and glows: white heads, pale aqua in the
    // creases, never the blue-grey shade and beige of a lump lit from one side (see the sheet's day block). The young wall keeps
    // its sunlit cauliflower: this is for lobes that have begun to thin, and for any lobe seen from right beneath
    if (uDay > 0.) {
      vec3 sunW = mix(uSunCol, vec3(dot(uSunCol, vec3(0.3, 0.59, 0.11))), 0.7);
      vec3 gb = mix(vec3(0.5, 0.93, 0.82), vec3(0.94, 1.0, 0.97), smoothstep(0.02, 0.35, hgt)) * (sunW * (0.45 + 0.55 * lit) + uSky * 1.0) * (0.92 + 0.16 * vSeed);
      float up = -V.y, kb = max(smoothstep(0.45, 0.8, up), smoothstep(0.1, 0.45, up) * smoothstep(0.05, 0.6, vDis));
      col = mix(col, gb, uDay * kb * (1. - 0.7 * smoothstep(28., 55., length(cameraPosition - vW))));
    }
#endif
  } else if (vSoft > 0.5) {
    a = exp(-r * r * 3.0) * (1. - smoothstep(0.7, 1., r)) * (0.55 + 0.7 * vn(vC * 1.6 + vSeed * 40.));
    col = mix(vec3(0.93, 0.96, 0.96), uJade, 0.25 * fs) * (uSunCol * (0.5 + 0.5 * fs) + uSky * 1.1) * (1. - 0.5 * uThroat);
  } else {
    a = (1. - smoothstep(0.15, 1., r)) * 0.7;
    col = vec3(0.95, 0.98, 0.97) * (uSunCol * (0.85 + 1.0 * step(0.95, vSeed) + 0.8 * fs) + uSky * 1.15);
  }
  // by lamplight the low water is in shade (indigo); the plumes above it stay pale
  float low = uThroat * (1. - smoothstep(1.5 * uScale, 16. * uScale, vW.y)) * step(-0.5, vW.y);
  col = mix(col, col * vec3(0.24, 0.3, 0.56), mix(0.7, mix(0.55, 0.6, vNr), vBil) * low);      // (round 13: billows 0.55 to 0.6, were 0.25 to 0.4: the low water is the lamps')
  // (round 13: in place of one constant amber on the low water) and every lobe, veil and drop takes the standards' light where it flies
  col += vec3(0.88) * uLampGlow * (vLmp.x * lampW) * mix(1., 0.3, step(0.5, vSoft) * (1. - step(0.5, vBil)));      // (13c: the fine soft mist takes three tenths of the lanterns' light: lit whole it stood as a pink fog at a fan's foot)
  a *= vA;
  if (a < 0.004) discard;
  gl_FragColor = vec4(col, a);
  #include <fog_fragment>
}`;async function Ce(t,e,c,b,A,M){const v=[],m=new Float64Array(7),g={x:0,y:0,z:0},f=()=>e.gauss(),x=(a,r,d,p,T,w,y,z,S,R,N,_)=>{v.push(a,r,d,p,T,w,y,z,S,R,e(),N,_)},k=()=>e()<.6?0:e()<.5?1:2;for(let a=0,r=Math.round(620*Math.max(A,.55));a<r;a++){(a&127)===0&&await M();const d=(-1+2*(a+e())/r)*.97,p=e()<.36,T=k(),w=p?e()*.05:.05+.5*Math.pow(e(),1.3);t(d,w,T,m);const y=p?1+e.range(-.03,.02):1+e.range(-.1,-.01),z=(p?.55+1.3*Math.pow(e(),1.6):e.range(.9,2.2))*(1-.35*Math.abs(d*d*d));x(m[0],m[1],m[2]+f()*.5,m[3]*y+f()*.5,m[4]*y,m[5]*y+f()*(p?.6:1.4),m[6]+e()*.04,Y*(p?1:e.range(1,1.2)),z,4,p?e.range(1.8,2.4):e.range(1.5,2.3),p?e.range(.8,1):e.range(.1,.7))}for(let a=0,r=Math.round(340*Math.max(A,.5));a<r;a++){(a&127)===0&&await M();const d=(-1+2*(a+e())/r)*.99,p=k();t(d,e()*.1,p,m);const T=1+e.range(-.02,.08);x(m[0],m[1],m[2]+f()*.4,m[3]*T+f()*1.1,m[4]*T+f()*.8,m[5]*T+f()*1.1,m[6]+e()*.06,Y*e.range(.95,1.3),e.range(.22,.6),4,e.range(1.3,2.2),1)}for(let a=0,r=Math.round(6500*b);a<r;a++){(a&255)===0&&await M(),t(e.range(-1,1),Math.pow(e(),1.25),k(),m);const d=1+e.range(-.1,.05);x(m[0]+f()*.3,m[1],m[2]+f()*.3,m[3]*d+f()*1.2,m[4]*d+f()*1.2,m[5]*d+f()*1.2,m[6]+e()*.05,Y*e.range(.9,1.25),.025+.09*Math.pow(e(),3),0,7.5,1)}for(let a=0,r=Math.round(48*A);a<r;a++){(a&15)===0&&await M();const d=e.range(-.95,.95),p=e()<.7?0:2,T=e()*.3,w=e.range(1.03,1.16),y=26,z=e.range(.005,.009);t(d,T,p,m);const S=f()*1.1,R=f()*1.1;for(let N=0;N<y;N++){const _=N/y,I=w*(1+f()*.006*_*_);x(m[0],m[1],m[2],m[3]*I+S*_,m[4]*I,m[5]*I+R*_,m[6]+(N+e.range(-.45,.45))*z,Y*.95*(1+.08*_),H(.11,.03,_)*e.range(.6,1.4),-1,2.8,H(.62,.15,_))}}for(let a=0,r=Math.round(2100*b);a<r;a++){(a&255)===0&&await M(),t(e.range(-1,1),a%3?Math.pow(e(),2.2)*.6:e(),k(),m);const d=e.range(2.4,4.2),p=a%3?e.range(.8,2):e.range(1.4,3.2),T=e.range(3.5,6),w=a%3?e.range(.06,.13):e.range(.04,.09);if(a%3===0){const y=e.range(.75,1);x(m[0],m[1],m[2],m[3]*y+f()*2,m[4]*y+f()*2,m[5]*y+f()*2,m[6]+e()*.3,d,p,1,T,w)}else{const y=e.range(.35,3.2),z=Math.exp(-Y*y),S=-K/Y;ne(m,y,Y,c.wx,c.wz,c.scale,g),x(g.x,g.y,g.z,((m[3]-c.wx)*z+c.wx)*.6+f(),((m[4]-S)*z+S)*.6+f(),((m[5]-c.wz)*z+c.wz)*.6+f(),m[6]+y,d,p,1,T*.8,w)}}await M();for(let a=0,r=Math.round(520*A);a<r;a++){const d=e.range(-1,1),p=.3*Math.pow(Math.abs(d-c.s0),1.3)+e()*.5;x(d*14.5,-3.2+e()*2.6,-2.2-e()*3.2,d*5+f()*3,e.range(9,25),f()*2-3,p+a%3*.7,e.range(2.2,3.4),e.range(1.6,3.4),3,e.range(1.2,2),e.range(.11,.21))}for(let a=0,r=Math.round(2e3*b);a<r;a++){(a&127)===0&&await M(),t(e.range(-1,1),e(),e()<.6?0:1,m);let d=.3,p=0;for(let y=0;y<130&&!p;y++)d+=.06,ne(m,d,Y,c.wx,c.wz,c.scale,g),(g.z>.3?g.y<(g.z<5.1?.2:.05):g.y<-4)&&(p=g.z>.3?1:2);if(!p||p===2&&e()<.6)continue;const T=p===1?g.z<5.1?.2:.05:-3.9,w=m[6]+d;e()<.68?x(g.x,T,g.z,f()*2.2,e.range(2,6.5),1.5+f()*1.8,w,1.3,e.range(.03,.09),2,1.1,1):x(g.x,T+.2,g.z,f(),e.range(1,3),1.5+e()*2,w,3,e.range(.7,1.8),3,.95,.24)}const L=v.length/13,W=new Float32Array(L*12),F=new Float32Array(L*12),P=new Float32Array(L*16),n=new Float32Array(L*12),l=new Float32Array(L*8),h=new Uint32Array(L*6),i=[-1,1,1,-1],u=[-1,-1,1,1];for(let a=0;a<L;a++){(a&255)===0&&await M();const r=a*13;for(let d=0;d<4;d++){const p=a*4+d;W[p*3]=v[r],W[p*3+1]=v[r+1],W[p*3+2]=v[r+2],F[p*3]=v[r+3],F[p*3+1]=v[r+4],F[p*3+2]=v[r+5],P[p*4]=v[r+6],P[p*4+1]=v[r+7],P[p*4+2]=v[r+8],P[p*4+3]=v[r+9],n[p*3]=v[r+10],n[p*3+1]=v[r+11],n[p*3+2]=v[r+12],l[p*2]=i[d],l[p*2+1]=u[d]}h.set([a*4,a*4+1,a*4+2,a*4,a*4+2,a*4+3],a*6)}const o=new s.BufferGeometry;return o.setAttribute("position",new s.BufferAttribute(W,3)),o.setAttribute("aV0",new s.BufferAttribute(F,3)),o.setAttribute("aP",new s.BufferAttribute(P,4)),o.setAttribute("aS",new s.BufferAttribute(n,3)),o.setAttribute("aC",new s.BufferAttribute(l,2)),o.setIndex(new s.BufferAttribute(h,1)),o.boundingSphere=new s.Sphere(new s.Vector3(0,10,8),70),o}const q=t=>{const e=new s.Color(t);return[e.r,e.g,e.b]},O=(t,e,c)=>[t[0]+(e[0]-t[0])*c,t[1]+(e[1]-t[1])*c,t[2]+(e[2]-t[2])*c],E=(t,e)=>[t[0]*e,t[1]*e,t[2]*e],Le=[[1,3,7,5],[0,4,6,2],[2,6,7,3],[0,1,5,4],[4,5,7,6],[0,2,3,1]],Fe=[.92,.92,1.08,.55,.97,.97];function We(){const t=[],e=[],c=[],b=[],A=new s.Matrix4,M=new s.Euler,v=new s.Vector3,m=new s.Matrix3,g=new Float64Array(24);return{box(f,x,k,L,W,F,P,n={}){const l=n.taper??1,h=n.ry||n.rx||n.rz;h&&A.makeRotationFromEuler(M.set(n.rx||0,n.ry||0,n.rz||0,"YXZ"));for(let i=0;i<8;i++){const u=i&2,o=u?l:1;v.set((i&1?.5:-.5)*L*o,(u?.5:-.5)*W,(i&4?.5:-.5)*F*o),h&&v.applyMatrix4(A),g[i*3]=v.x+f,g[i*3+1]=v.y+x,g[i*3+2]=v.z+k}for(let i=0;i<6;i++){const u=Le[i],o=u[0]*3,a=u[1]*3,r=u[2]*3,d=t.length/3,p=g[a]-g[o],T=g[a+1]-g[o+1],w=g[a+2]-g[o+2],y=g[r]-g[o],z=g[r+1]-g[o+1],S=g[r+2]-g[o+2];let R=T*S-w*z,N=w*y-p*S,_=p*z-T*y;const I=Math.hypot(R,N,_)||1;R/=I,N/=I,_/=I;const B=i===2&&n.top?n.top:P,j=Fe[i];for(let D=0;D<4;D++){const C=u[D]*3,V=i!==2&&i!==3&&!(u[D]&2)?.82:1;t.push(g[C],g[C+1],g[C+2]),e.push(R,N,_),c.push(B[0]*j*V,B[1]*j*V,B[2]*j*V)}b.push(d,d+1,d+2,d,d+2,d+3)}},geo(f,x,k){const L=f.attributes.position,W=f.attributes.normal,F=t.length/3;m.getNormalMatrix(x);for(let P=0;P<L.count;P++){const n=k(L.getX(P),L.getY(P),L.getZ(P),W.getY(P));v.fromBufferAttribute(L,P).applyMatrix4(x),t.push(v.x,v.y,v.z),v.fromBufferAttribute(W,P).applyMatrix3(m).normalize(),e.push(v.x,v.y,v.z),c.push(n[0],n[1],n[2])}if(f.index)for(let P=0;P<f.index.count;P++)b.push(F+f.index.getX(P));else for(let P=0;P<L.count;P++)b.push(F+P);f.dispose()},raw(f,x,k,L,W,F,P){return t.push(f,x,k),e.push(L,W,F),c.push(P[0],P[1],P[2]),t.length/3-1},tri(f,x,k){b.push(f,x,k)},async build(f){const x=new s.BufferGeometry;return x.setAttribute("position",new s.Float32BufferAttribute(t,3)),await f(),x.setAttribute("normal",new s.Float32BufferAttribute(e,3)),await f(),x.setAttribute("color",new s.Float32BufferAttribute(c,3)),await f(),x.setIndex(b),await f(),x.computeBoundingSphere(),x}}}const ue=[-44,-36,-28,-20,-12,-4,4,12,20,28,36,44],fe=[-40,-8,24];async function Ve(t,e,c,b){const A=q("#b3a58c"),M=q("#958d7e"),v=q("#d6d1c0"),m=q("#34502a"),g=q("#6f9a2c"),f=q("#7a3f1c"),x=q("#8a8d8b"),k=[.03,.03,.035],L=E(q(c[2]),.62),W=O(q(c[3]),L,.55),F=n=>H(.6,1,X(9,24,Math.abs(n))),P=n=>{let l=99;for(const h of ue)l=Math.min(l,Math.abs(n-h));return l};t.box(0,.535,-.45,96,.77,.78,k),t.box(0,-1.65,-.55,96,3.6,.5,k);for(let n=0;n<2;n++){let l=-48-e()*.9;for(;l<48;){const h=Math.min(e.range(1.1,2),48.02-l),i=l+h/2;if(l+=h,h<.15)continue;let u=O(A,M,e());u=E(u,e.range(.82,1.08)*F(i)),i>21&&i<28.5&&e()<.75&&(u=E(x,e.range(.8,1))),P(i)<.7&&(u=O(u,f,.3)),e()<.06&&(u=O(u,m,.35)),t.box(i,.315+n*.33,-.45,h-.03,.305,.9+e.range(-.035,.035),u,{top:E(u,.5)})}await b()}for(let n=0;n<64;n++){const l=-47.25+n*1.5;if(Math.abs(l-24.75)<.8)continue;const h=E(O(A,v,e.range(.35,.75)),e.range(.85,1.05)*H(.72,1,X(9,24,Math.abs(l))));t.box(l,.915+e.range(-.006,.006),-.45,1.47,.21,1.05,h,{taper:.95,ry:e.range(-.006,.006)})}await b(),t.box(24.75,.84,-.45,1.5,.07,.86,E(x,.7)),t.box(25.6,.27,1.45,1.47,.21,1.05,E(O(A,v,.4),.8),{taper:.95,ry:.5,rz:.07}),t.box(27.4,.31,.75,.8,.32,.5,E(x,.85),{ry:-.3}),t.box(27.6,.6,.8,.6,.26,.45,E(M,.8),{ry:.4});for(let n=0;n<6;n++){let l=-48-e()*1.2;const h=-.145-n*.59;for(;l<48;){const i=Math.min(e.range(1.5,2.4),48.02-l),u=l+i/2;if(l+=i,i<.2)continue;let o=E(O(M,A,e()*.5),e.range(.62,.85)*F(u));o=O(o,m,ee((n-1.5)/3,0,1)*e.range(.4,.8)),n>3&&(o=O(o,g,e()*.45)),P(u)<.6&&(o=O(o,m,.5)),t.box(u,h,-.68,i-.035,.56,.5+e.range(-.05,.05),o)}await b()}for(const n of ue)t.box(n,.245,.012,.56,.17,.035,[.012,.012,.015]),t.box(n,.345,.02,.68,.035,.05,E(f,.8)),t.box(n-.19,.245,.03,.025,.17,.02,E(f,.6)),t.box(n+.19,.245,.03,.025,.17,.02,E(f,.6)),t.box(n,.245,.03,.025,.17,.02,E(f,.6)),t.box(n,.08,-1.08,.34,.15,.4,E(M,.5),{rx:-.12}),t.box(n+e.range(-.05,.05),-1.45,-.94,.4,2.7,.03,E(m,.6));await b();for(let n=0;n<3;n++)for(let l=0;l<40;l++){l===0&&await b();const h=-46.8+l*2.4,i=.86+n*1.66,u=e()<.14;let o=E(l+n&1?L:W,e.range(.78,1)*H(.66,1,X(8,26,Math.abs(h))));u&&(o=E(o,.7)),e()<.04&&(o=E(x,.6)),t.box(h,.075+(u?e.range(-.02,.025):0),i,2.37,.15,1.63,o,{rz:u?e.range(-.014,.014):0,rx:u?e.range(-.012,.012):0})}await b();for(let n=0;n<48;n++)t.box(-47+n*2,.085,5.125,1.97,.17,.25,E(q("#7d7f84"),e.range(.75,1)),{taper:.96})}function Ne(t,e,c,b,A,M){const v=q("#1d2b27"),m=q("#7a3f1c"),g=q("#a9b0a6"),f=e()*50,x=new s.Matrix4().makeRotationFromEuler(new s.Euler(M.rx||0,e()*6.28,M.rz||0,"XZY")).setPosition(b,.15,A),k=[[0,0],[.46,0],[.46,.12],[.4,.16],[.4,.52],[.45,.58],[.33,.68],[.21,.95],[.16,1.05],[.2,1.1],[.13,1.2]];for(let l=1.3;l<4.56;l+=.36)k.push([H(.125,.082,(l-1.3)/3.3),l]);k.push([.082,4.6],[.15,4.64],[.15,4.72],[.09,4.78],[.075,5],[.19,5.06],[.2,5.12]);const L=new s.LatheGeometry(k.map(l=>new s.Vector2(l[0],l[1])),16),W=L.attributes.position;for(let l=0;l<W.count;l++){const h=W.getY(l);if(h>1.25&&h<4.58){const i=1+.08*Math.cos(8*Math.atan2(W.getZ(l),W.getX(l)));W.setX(l,W.getX(l)*i),W.setZ(l,W.getZ(l)*i)}}L.computeVertexNormals();const F=(l,h,i)=>{const u=c.n3(l*3+f,h*1.4,i*3)*.5+.5;let o=O(v,m,X(.35,.8,u+(h<.7?.25:0)-h*.03));return O(o,g,.3*X(.3,.9,c.n3(l*1.5,h*.6+f,i*1.5)*.5+.5))};t.geo(L,x,F);const P=M.broken?x.clone().multiply(new s.Matrix4().makeTranslation(.12,5.62,0)).multiply(new s.Matrix4().makeRotationZ(.5)).multiply(new s.Matrix4().makeTranslation(0,-5.74,0)):x;M.broken||t.geo(new s.LatheGeometry([new s.Vector2(.15,5.12),new s.Vector2(.27,5.74)],6),x,(l,h)=>E([.5,.58,.5],.7+.5*(h-5.12))),t.geo(new s.LatheGeometry([[.34,5.74],[.31,5.8],[.12,6.02],[.045,6.08],[.07,6.16],[0,6.3]].map(l=>new s.Vector2(l[0],l[1])),6),P,F);const n=new s.Vector3(0,4.87,0).applyMatrix4(x);t.box(n.x,n.y,n.z,.95,.05,.05,E(v,1.1)),t.box(n.x-.47,n.y,n.z,.1,.1,.1,m),t.box(n.x+.47,n.y,n.z,.1,.1,.1,v)}function Re(t,e,c,b){const A=q("#7a3f1c"),M=q("#1d2b27"),v=q("#6b4a2c"),m=E(q(b[5]),.6),g=new s.Matrix4,f=new s.Euler,x=new s.Vector3,k=new s.Quaternion,L=new s.Vector3,W=(n,l,h,i,u,o,a=1,r=a)=>g.compose(L.set(n,l,h),k.setFromEuler(f.set(i,u,o)),x.set(a,r,a)).clone(),F=[E(q(b[4]),.5),E(q(b[5]),.55),E(q(b[6]),.45),E(q(b[3]),.5)];let P=.15;for(let n=0;n<4;n++){const l=n<3?-21.5+e.range(-.06,.06):-20.4,h=E(e.pick(F),e.range(.8,1.1)),i=n<3?P+.2:.35,u=e.range(-.25,.25);t.box(l,i,.75,.82,.4,.56,h,{ry:u,top:[.03,.03,.03]}),t.box(l,i+.16,.75,.86,.06,.6,E(h,1.15),{ry:u,top:[.03,.035,.04]}),n<3&&(P+=.41)}for(let n=0;n<4;n++)t.geo(new s.TorusGeometry(.34-n*.03,.065,6,16),W(-19,.22+n*.11,1.4,Math.PI/2,0,n*.7),(l,h,i)=>E(m,.8+.4*c.n2(l*9,h*9+n)));t.geo(new s.TorusGeometry(.34,.13,8,18),W(31,.6,.32,.28,.3,0),()=>[.02,.02,.022]);for(const n of[-34,34,6])t.geo(new s.LatheGeometry([[0,0],[.2,0],[.2,.06],[.15,.1],[.13,.5],[.2,.56],[.22,.66],[.12,.74],[0,.75]].map(l=>new s.Vector2(l[0],l[1])),10),W(n,.15,4.4,0,0,0),(l,h,i)=>O(M,A,X(-.2,.6,c.n3(l*6+n,h*4,i*6))));for(const n of[-.25,.25])t.box(-30+n,-1.17,-1,.05,4.56,.05,A),t.box(-30+n,1.29,-.55,.05,.05,1,A),t.box(-30+n,1.17,-.08,.05,.3,.05,A);for(let n=0;n<12;n++)t.box(-30,.87-n*.36,-1,.5,.035,.035,E(A,.8));for(let n=0;n<8;n++)t.box(22.2+n*.3,.98,1.9,.3,.16,.035,n&1?E(v,1.5):[.3,.07,.04],{ry:0});for(const n of[22.3,24.3])t.box(n,.58,1.72,.05,.9,.05,v,{rx:.35}),t.box(n,.58,2.08,.05,.9,.05,v,{rx:-.35});t.box(26.6,.62,.2,.22,1.5,.04,E(v,.9),{rx:.2,rz:.1}),t.box(26.95,.58,.22,.22,1.35,.04,E(v,1.2),{rx:.22,rz:-.06})}async function Ee(t,e,c,b){const A=[.05,.052,.06],M=[.15,.14,.125],v=q("#5f7d2a"),m=q("#2c4724"),g=110,f=24,x=-60,k=60,L=-18.5,W=-.8,F=(o,a)=>{const r=10.5+4.5*c.n2(o*.03,5.1),d=Math.max(0,(W-a)/r),p=c.ridged2(o*.11+3,a*.17,4)*2.4*(.25+.75*Math.min(1,d*2.2))+.22*c.n2(o*.9,a*.9);return d<1?H(-3,-4.3,Math.pow(d,1.5))+p*(1-.6*d)-.5:-4.6-(d-1)*7+p*.3},P=[];for(let o=0;o<=f;o++)for(let a=0;a<=g;a++){a===0&&await b();const r=H(x,k,a/g)+(a>0&&a<g?e.range(-.3,.3):0),d=H(L,W,o/f)+(o>0&&o<f?e.range(-.2,.2):0),p=F(r,d),T=F(r-.4,d)-F(r+.4,d),w=F(r,d-.4)-F(r,d+.4),y=Math.hypot(T,.8,w);let z=E(A,.8+.5*e());z=O(z,M,X(-3,-2,p)*.8),.8/y>.9&&p<-3.25&&p>-3.95&&(z=O(z,v,.2+.3*e())),p<-3.7&&(z=O(z,m,.5)),P.push(t.raw(r,p,d,T/y,.8/y,w/y,z))}for(let o=0;o<f;o++)for(let a=0;a<g;a++){const r=P[o*(g+1)+a],d=r+1,p=P[(o+1)*(g+1)+a],T=p+1;t.tri(r,p,d),t.tri(d,p,T)}const n=new s.Matrix4,l=new s.Quaternion,h=new s.Euler,i=new s.Vector3,u=new s.Vector3;for(let o=0;o<22;o++){await b();const a=new s.IcosahedronGeometry(1,2),r=a.attributes.position,d=e()*90;for(let z=0;z<r.count;z++){const S=r.getX(z),R=r.getY(z),N=r.getZ(z),_=1+.34*c.n3(S*1.3+d,R*1.3,N*1.3)+.12*c.n3(S*3.7,R*3.7+d,N*3.7);r.setXYZ(z,S*_,R*_,N*_)}a.computeVertexNormals();const p=e.range(-56,56),T=-1.6-e()*e()*13,w=e.range(.7,2.3),y=e.range(.7,1.5);n.compose(i.set(p,F(p,T)+w*.25,T),l.setFromEuler(h.set(e()*6,e()*6,e()*6)),u.set(w*e.range(.9,1.5),w*e.range(.6,.9),w)),t.geo(a,n,(z,S,R)=>O(E(A,y),M,.35*X(-.2,.8,c.n3(z*2+d,S*2,R*2))))}}const ye=`
uniform vec3 uSun, uSunCol, uSky, uSkyTop, uSkyHor;
vec3 skyRefl(vec3 R){
  vec2 az = R.xz / max(length(R.xz), 1e-4), sz = uSun.xz / max(length(uSun.xz), 1e-4);
  float toward = smoothstep(-0.3, 0.9, dot(az, sz)) * (1. - smoothstep(0.02, 0.45, R.y));
  return mix(uSkyTop * (1. + 0.6 * (1. - smoothstep(0.0, 0.5, R.y))), uSkyHor, toward);
}`,ge=`
uniform float uTime, uTau, uSea;
varying vec3 vW, vL;
#include <fog_pars_vertex>
float swell(vec2 p, float t){ return 0.95 * sin(0.085 * (p.y * 0.95 + p.x * 0.31) - 0.9 * t) + 0.5 * sin(0.19 * (p.y - 0.42 * p.x) - 1.35 * t + 1.) + 0.22 * sin(0.41 * (p.y * 0.8 + p.x * 0.6) - 2.1 * t + 4.); }
void main(){
  vec3 lp = position;
  if (uSea > 0.5) {
    vec2 p = lp.xz;
    float zc = min(uTau, 0.) * 13. - 3.;
    float amp = 2.9 * smoothstep(-2.4, -0.6, uTau) * (1. - smoothstep(0., 0.7, uTau));
    float a = (p.y - zc) / 6.5, b = p.x / 22.;
    float damp = 0.3 + 0.7 * (1. - smoothstep(-24., -3., p.y));
    lp.y = -4. + swell(p, uTime) * damp + amp * exp(-a * a) * exp(-b * b);
  }
  vL = lp; vec4 wp = modelMatrix * vec4(lp, 1.); vW = wp.xyz;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,_e=`
uniform float uTau, uTime; uniform vec4 uShadow; uniform vec2 uShDir;
varying vec3 vW, vL;
#include <fog_pars_fragment>
${te}${de}${ye}
void main(){
  vec2 p = vL.xz;
  float rim = 1. - smoothstep(170., 255., length(p));
  vec3 V = normalize(cameraPosition - vW + vec3(0., 1e-5, 0.));
  vec3 col;
  if (vL.y < -0.02) {
    col = vec3(0.07, 0.068, 0.066) * (0.5 + 0.9 * fbm(vec2(p.x * 0.4, vL.y * 1.3))) * (uSunCol * 0.25 + uSky);
  } else {
    float a1 = fbm(p * 0.33), grain = vn(p * 21.);
    vec3 asph = mix(vec3(0.05, 0.052, 0.062), vec3(0.105, 0.1, 0.1), a1) * (0.8 + 0.4 * grain);
    asph *= 1. - 0.22 * smoothstep(0.55, 0.6, fbm(p * 0.37 + 31.));
    float lz = (p.y - 5.25) / 3.0;
    float seam = (1. - smoothstep(0.0, 0.03, abs(fract(lz + 0.5) - 0.5))) * step(5.2, p.y) * step(p.y, 23.4);
    asph *= 1. - 0.45 * seam * (0.4 + 0.6 * vn(p * vec2(0.5, 3.)));
    asph *= 0.72 + 0.28 * smoothstep(0.0, 0.018, abs(vn(p * 0.8 + 50.) - 0.5));
    float wet = 0.5 + 0.5 * wetMask(p);
    float cf = 1. / (1. + length(cameraPosition - vW) * 0.05);
    float env = smoothstep(1.4, 2.6, uTau) * (1. - smoothstep(5.6, 8.6, uTau));
    float reach = clamp((uTau - 1.5) * 6.2, 0., 25.) * (1. - smoothstep(11., 31., abs(p.x))) * (0.72 + 0.5 * fbm(vec2(p.x * 0.16, 3.7)));
    float inSheet = (1. - smoothstep(reach - 4., reach, p.y)) * env;
    float flowS = 5.5 * min(uTau, 5.2) - 2.2 * max(uTau - 5.2, 0.);
    float lacef = veins(vec2(p.x * 0.5, (p.y - flowS) * 0.3));
    float edge = (1. - smoothstep(0., 1.6, abs(p.y - reach))) * env * step(0.5, reach);
    float foam = clamp(inSheet * lacef * 0.8 + edge * (0.2 + 0.7 * lacef), 0., 1.);
    wet = max(wet, inSheet * 0.92);
    // ripples: five short wave trains crossing at odd angles on a slowly warped field, so no lattice shows in the mirror
    vec2 wq = p + 1.3 * vec2(vn(p * 0.21 + 3.), vn(p * 0.21 + 17.));
    float c1 = cos(dot(wq, vec2(0.80, 0.60)) * 2.3 + uTime * 1.9), c2 = cos(dot(wq, vec2(-0.45, 0.89)) * 3.1 - uTime * 2.3 + 1.7), c3 = cos(dot(wq, vec2(0.97, -0.24)) * 4.4 + uTime * 2.9 + 4.1);
    float c4 = cos(dot(wq, vec2(0.28, 0.96)) * 5.9 - uTime * 3.4 + 2.6), c5 = cos(dot(wq, vec2(-0.87, -0.50)) * 1.5 + uTime * 1.3 + 5.2);
    float m1 = smoothstep(0.3, 0.7, vn(p * 0.31 + 11.)), m2 = smoothstep(0.3, 0.7, vn(p * 0.27 + 23.)), m3 = smoothstep(0.3, 0.7, vn(p * 0.23 + 37.));
    c1 *= m1; c2 *= m2 * (1. - m1); c3 *= m3 * (1. - m2) * (1. - m1) * 0.7; c4 *= (1. - m1) * (1. - m2) * (1. - m3) * 0.6; c5 *= 0.5;
    float rx = 0.80 * c1 - 0.45 * c2 + 0.97 * c3 + 0.28 * c4 - 0.87 * c5, rz = 0.60 * c1 + 0.89 * c2 - 0.24 * c3 + 0.96 * c4 - 0.50 * c5;
    vec3 N = normalize(vec3(rx * 0.022 * wet * cf, 1., rz * 0.022 * wet * cf));
    vec3 R = reflect(-V, N); R.y = abs(R.y);
    float g = 1. - clamp(dot(N, V), 0., 1.); float F = 0.06 + 0.94 * g * g * g;
    vec2 d = p - uShadow.xy; float al = dot(d, uShDir); vec2 pe = d - al * uShDir;
    float sh = uShadow.w * exp(-(dot(pe, pe) + al * al * 0.3) / max(uShadow.z * uShadow.z, 1.));
    col = asph * (uSunCol * max(uSun.y, 0.) * (1. - 0.75 * sh) + uSky) * (1. - 0.45 * wet);
    col = mix(col, skyRefl(R), F * (0.3 + 0.7 * wet));
    float gl = pow(max(dot(R, uSun), 0.), 420.);
    col += uSunCol * gl * 1.1 * wet * (1. - sh);
    col = mix(col, vec3(0.92, 0.96, 0.95) * (uSunCol * (0.85 - 0.5 * sh) + uSky * 1.1), foam);
  }
  gl_FragColor = vec4(col, rim);
  #include <fog_fragment>
}`,De=`
uniform float uTau, uTime; uniform vec3 uJade, uTeal, uIndigo;
varying vec3 vW, vL;
#include <fog_pars_fragment>
${te}${ye}
float swell(vec2 p, float t){ return 0.95 * sin(0.085 * (p.y * 0.95 + p.x * 0.31) - 0.9 * t) + 0.5 * sin(0.19 * (p.y - 0.42 * p.x) - 1.35 * t + 1.) + 0.22 * sin(0.41 * (p.y * 0.8 + p.x * 0.6) - 2.1 * t + 4.); }
void main(){
  vec2 p = vL.xz;
  float rim = 1. - smoothstep(210., 315., length(p));
  vec3 V = normalize(cameraPosition - vW + vec3(0., 1e-5, 0.));
  float h = vL.y + 4.;
  float damp = 0.3 + 0.7 * (1. - smoothstep(-24., -3., p.y));
  float sx = (swell(p + vec2(0.6, 0.), uTime) - swell(p - vec2(0.6, 0.), uTime)) / 1.2 * damp;
  float sz = (swell(p + vec2(0., 0.6), uTime) - swell(p - vec2(0., 0.6), uTime)) / 1.2 * damp;
  vec2 rp = p * 0.7 + vec2(uTime * 0.5, uTime * 0.9), rq = p * 2.1 - vec2(uTime * 0.7, -uTime * 1.2);
  float chop = 0.5 * fbm(rp) + 0.25 * vn(rq);
  float cf = 1. / (1. + length(cameraPosition - vW) * 0.03);
  float cx = (fbm(rp + vec2(0.4, 0.)) - fbm(rp - vec2(0.4, 0.))) * cf, cz = (fbm(rp + vec2(0., 0.4)) - fbm(rp - vec2(0., 0.4))) * cf;
  vec3 N = normalize(vec3(-sx - cx * 0.9, 1., -sz - cz * 0.9));
  vec3 R = reflect(-V, N); R.y = abs(R.y);
  float g = 1. - clamp(dot(N, V), 0., 1.); float F = 0.04 + 0.96 * g * g * g * g;
  float ndl = clamp(dot(N, uSun), 0., 1.);
  vec3 body = mix(uIndigo * 0.55, uTeal * 0.5, smoothstep(-0.8, 1.4, h) * 0.8 + 0.2 * chop);
  body += uJade * 0.22 * smoothstep(0.7, 2.6, h);
  vec3 col = body * (uSunCol * (0.35 + 0.65 * ndl) + uSky * 1.2);
  col = mix(col, skyRefl(R), F);
  col += uSunCol * pow(max(dot(R, uSun), 0.), 240.) * 1.1;
  float shelf = smoothstep(-22., -7., p.y);
  float caps = smoothstep(0.52, 0.7, fbm(p * vec2(0.09, 0.42) + vec2(0.2 * uTime, -0.9 * uTime))) * smoothstep(0.35, 1.3, h) * 0.8;
  float lacef = veins(p * 0.32 + vec2(sin(uTime * 0.4) * 0.6, uTime * 0.3));
  float streaks = smoothstep(0.5, 0.7, fbm(p * vec2(0.45, 0.1) + vec2(0., -uTime * 0.25))) * 0.35;
  float rb = length((p - vec2(0., -6.)) * vec2(0.6, 1.));
  float bloom = (1. - smoothstep(5. + uTau * 2.2, 10. + uTau * 3.6, rb)) * smoothstep(-0.2, 0.5, uTau) * (1. - smoothstep(4.5, 9.5, uTau));
  float hump = smoothstep(1.6, 2.8, h) * 0.8;
  float foam = clamp(caps * (0.3 + 0.6 * lacef) + shelf * lacef * 0.8 + streaks * (0.25 + 0.75 * shelf) + bloom * (0.12 + 0.7 * lacef) + hump * lacef, 0., 1.);
  col = mix(col, uJade * 0.55 * (uSunCol + uSky), clamp(bloom * 0.6 + shelf * 0.2, 0., 1.));
  col = mix(col, vec3(0.92, 0.96, 0.95) * (uSunCol * (0.45 + 0.6 * ndl) + uSky * 1.15), foam);
  gl_FragColor = vec4(col, rim);
  #include <fog_fragment>
}`;function Ye(){const t=new s.BufferGeometry,e=260,c=-.4;return t.setAttribute("position",new s.Float32BufferAttribute([-e,0,c,e,0,c,e,0,e,-e,0,e,-e,0,c,e,0,c,e,-4.8,c,-e,-4.8,c],3)),t.setIndex([0,2,1,0,3,2,4,5,6,4,6,7]),t.boundingSphere=new s.Sphere(new s.Vector3(0,0,130),400),t}function Ge(){const t=new s.PlaneGeometry(2,1,110,60);t.rotateX(-Math.PI/2);const e=t.attributes.position;for(let c=0;c<e.count;c++){const b=e.getX(c),A=.5-e.getZ(c);e.setXYZ(c,Math.sign(b)*320*Math.pow(Math.abs(b),1.7),0,-.4-320*A*A)}return t.deleteAttribute("normal"),t.deleteAttribute("uv"),t.boundingSphere=new s.Sphere(new s.Vector3(0,-4,-160),480),t}async function qe(t,e={}){const c=t.rng,b=t.noise,A=t.quality?.detail??1,M=(e.palette&&e.palette.length>=7?e.palette:xe).slice(),v=e.twin?e.twin.shared:null,m=v?{...v.V,scale:e.scale??1}:{sd:c.range(0,100),s0:c.range(-.55,.55),v0:42*c.range(.95,1.1),lean:c.range(-.02,.03),spread:c.range(.9,1.12),lobes:c.range(.8,1.45),wx:c.range(-1.3,1.3),wz:e.wind??4.2,scale:e.scale??1},g=Te(b,m),f=new s.Group;f.name="malecon-norther-canopy";const x=C=>new s.Color(C),k={uTau:{value:2.6},uTime:{value:0},uScale:{value:m.scale},uPix:{value:.004},uRoadY:{value:0},uVT:{value:new s.Vector3(m.wx,-K/Y,m.wz)},uWind:{value:new s.Vector2(m.wx,m.wz)},uSun:{value:new s.Vector3(.68,.29,-.68).normalize()},uSunCol:{value:x("#FFE9C4").multiplyScalar(3/Math.PI)},uSky:{value:new s.Color(.2,.25,.4)},uJade:{value:x(M[4])},uTeal:{value:x(M[1])},uIndigo:{value:x(M[0])},uSkyTop:{value:e.skyTop?x(e.skyTop):x(M[0]).lerp(new s.Color(.06,.065,.075),.35).multiplyScalar(1.4)},uSkyHor:{value:e.skyHorizon?x(e.skyHorizon):x("#C9DDE6").multiplyScalar(.8)},uTear:{value:e.tear??0},uMist:{value:e.mist??1},uTransmit:{value:e.transmit??1},uThroat:{value:e.throat??0},uDeepK:{value:e.deep??1},uLampGlow:{value:e.lampGlow?new s.Color().copy(e.lampGlow):new s.Color(0,0,0)},uBil:{value:new s.Vector2(e.billow?e.billow[0]:1,e.billow?e.billow[1]:0)},uNrR:{value:new s.Vector2(e.nearFade?e.nearFade[0]:9,e.nearFade?e.nearFade[1]:24)},uShadow:{value:new s.Vector4(0,9,13,0)},uShDir:{value:new s.Vector2(1,0)},uInv:{value:new s.Matrix4},uLampP:{value:e.lampAt?new s.Vector3(e.lampAt[0],e.lampAt[1],e.lampAt[2]):new s.Vector3(0,0,0)},uRimW:{value:e.rim??0},uVeil:{value:e.veil??0}},L=()=>t.yield?.(),W=e.day!=null?{defines:{CANOPY_DAY:1}}:{};e.day!=null&&(k.uDay={value:e.day});const F=(C,V,G={},Z={})=>new s.ShaderMaterial({uniforms:{...s.UniformsUtils.clone(s.UniformsLib.fog),...k,...Z},vertexShader:C,fragmentShader:V,fog:!0,...G}),P=new s.Mesh(v?v.sheetGeo:await we(g,e.layers||[0,1,2],e.res||null,L),F(ze,Se,{side:s.DoubleSide,...W,...e.rim>0?{transparent:!0,depthWrite:!1}:{}}));if(P.frustumCulled=!1,e.rim>0&&(P.renderOrder=2.5),f.add(P),await t.yield?.(),e.mirror!==!1){const C=new s.Mesh(await we(g,[0],[56,30],L),F(Ae,Me,{side:s.DoubleSide,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-3}));C.frustumCulled=!1,C.renderOrder=3,f.add(C)}await L();const n=new s.Mesh(v?v.partGeo:await Ce(g,c,m,A*(e.particles??1),e.particles??1,L),F(ke,Pe,{transparent:!0,depthWrite:!1,...W}));n.frustumCulled=!1,n.renderOrder=4,f.add(n);const l=new s.Vector2;if(n.onBeforeRender=(C,V,G)=>{C.getDrawingBufferSize(l),k.uPix.value=3/Math.max(1,G.projectionMatrix.elements[5]*l.y)},await t.yield?.(),e.stage!==!1){const C=We();await Ve(C,c,M,L),await L();for(let U=0;U<fe.length;U++)Ne(C,c,b,fe[U],1.3,U===1?{rz:.03,rx:-.02}:U===2?{broken:!0,rz:-.012}:{rz:.008}),await L();Re(C,c,b,M),await t.yield?.(),await Ee(C,c,b,L),await L();const V=new s.MeshStandardMaterial({vertexColors:!0,roughness:.58,metalness:.04}),G={uLampK:{value:e.stageLamp?new s.Color().copy(e.stageLamp):new s.Color(0,0,0)},uNightAmb:{value:e.stageAmb?new s.Color().copy(e.stageAmb):new s.Color(0,0,0)}};V.onBeforeCompile=U=>{Object.assign(U.uniforms,G),U.vertexShader=U.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vStageP;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vStageP = position;`),U.fragmentShader=U.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vStageP; uniform vec3 uLampK, uNightAmb;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        { vec2 sd0 = vStageP.xz - vec2(-40., 1.3), sd1 = vStageP.xz - vec2(-8., 1.3), sd2 = vStageP.xz - vec2(24., 1.3);
          float pools = exp(-dot(sd0, sd0) / 40.) + exp(-dot(sd1, sd1) / 40.) + exp(-dot(sd2, sd2) / 40.);
          totalEmissiveRadiance += diffuseColor.rgb * (uLampK * pools * (1. - smoothstep(4.5, 6.5, vStageP.y)) * smoothstep(-2.5, 0., vStageP.y) + uNightAmb); }`)},V.customProgramCacheKey=()=>"malecon-stage-lamps";const Z=new s.Mesh(await C.build(L),V);f.add(Z),await t.yield?.()}if(e.sea!==!1){const C=new s.Mesh(Ge(),F(ge,De,{transparent:!0},{uSea:{value:1}}));C.renderOrder=1,C.frustumCulled=!1,f.add(C)}if(e.road!==!1){const C=new s.Mesh(Ye(),F(ge,_e,{transparent:!0},{uSea:{value:0}}));C.renderOrder=2,f.add(C)}const h=new Float64Array(7),i={x:0,y:0,z:0},u=new Float32Array(31).fill(99);if(!e.lite)for(let C=0;C<3;C++)for(let V=-30;V<=30;V++)for(let G=0;G<=16;G++){G===0&&(V&7)===0&&await L(),g(V/30,G/16,C,h);for(let Z=.7;Z<7;Z+=.08)if(ne(h,Z,Y,m.wx,m.wz,m.scale,i),i.y<2.2){const U=Math.round(i.x/2)+15;i.z>6.5&&i.z<11.5&&U>=0&&U<31&&(u[U]=Math.min(u[U],h[6]+Z));break}}const o=C=>{const V=ee(Math.round(C/2)+15,0,30);return u[V]>90?1/0:u[V]};let a=9;for(let C=11;C<=19;C++)a=Math.min(a,u[C]);a>8&&(a=4.8),await t.yield?.();const r=C=>ee((C+oe)/$,0,1);let d=null,p=null,T=null,w=0,y=2.6;const z=new s.Vector3,S=new s.Vector3,R=new s.Quaternion,N=new s.Vector3,_=new Float64Array(7),I=(C,V)=>{const G=_;return g(.05,.12,0,G),ne(G,C-G[6],Y,m.wx,m.wz,m.scale,i),V.set(i.x,Math.max(i.y,0),i.z)},B=e.sunDir?new s.Vector3().copy(e.sunDir).normalize():null;e.sunColor&&k.uSunCol.value.copy(e.sunColor),e.skyColor&&k.uSky.value.copy(e.skyColor);function j(C,V,G){if(d!=null?y=-oe+d*$:y=((V+(e.phase??2.1))%$+$)%$-oe,k.uTau.value=y,k.uTime.value=V,f.updateWorldMatrix(!0,!1),k.uInv.value.copy(f.matrixWorld).invert(),k.uRoadY.value=z.setFromMatrixPosition(f.matrixWorld).y,!p&&w<6){w++;let J=f;for(;J.parent;)J=J.parent;J.traverse(Q=>{Q.isDirectionalLight&&!p&&(p=Q),Q.isHemisphereLight&&!T&&(T=Q)})}B?k.uSun.value.copy(B):p&&(p.getWorldPosition(z),p.target.getWorldPosition(S),z.sub(S),z.lengthSq()>1e-8&&k.uSun.value.copy(z.normalize())),p&&!e.sunColor&&k.uSunCol.value.copy(p.color).multiplyScalar(p.intensity/Math.PI),T&&!e.skyColor&&k.uSky.value.copy(T.color).lerp(T.groundColor,.25).multiplyScalar(T.intensity/Math.PI),I(y,N),S.copy(k.uSun.value).applyQuaternion(f.getWorldQuaternion(R).invert());const Z=N.y/Math.max(S.y,.14),U=Math.hypot(S.x,S.z)||1;k.uShadow.value.set(N.x-S.x*Z*.6,N.z-S.z*Z*.6,12,X(.3,1.3,y)*(1-X(4,5.4,y))*.85),k.uShDir.value.set(S.x/U,S.z/U)}const D=(C,V,G)=>new s.Vector3(C,V,G);return{object:f,radius:20,height:22,center:D(0,8,4),ground:!1,groundY:0,life:$,timeline:{swell:0,erupt:r(0),apex:r(1.5),overhead:[r(2),r(a)],impact:r(a),drained:1},setProgress(C){d=C==null?null:ee(C,0,1)},tauAt:C=>-oe+ee(C,0,1)*$,uAt:r,impactTauAt:o,crestAt:(C,V=new s.Vector3)=>I(-oe+ee(C,0,1)*$,V),uniforms:k,shared:{V:m,sheetGeo:P.geometry,partGeo:n.geometry},anchors:{flyThrough:[D(60,1.25,9),D(30,1.25,9),D(0,1.25,9),D(-30,1.25,9),D(-60,1.25,9)],travelDir:D(-1,0,0),landward:D(0,0,1),erupt:D(0,-2.7,-1.6),crest:I(2.4,new s.Vector3),canopy:D(0,1.25,9),trigger:D(55,1.25,9),viewpoints:{approach:{position:D(55,1.25,9),target:D(0,12,4)},under:{position:D(5,1.25,9),target:D(-6,15,7)},seaward:{position:D(34,9,-62),target:D(0,10,2)}},lamps:fe.map(C=>D(C,.15,1.3)),scuppers:ue.map(C=>D(C,.25,0)),wallTop:1.02,seaLevel:-4,portalSeat:null},update:j,dispose(){}}}function Be(t,e){const c=t.object.children.find(w=>w.isMesh&&w.geometry===t.shared.partGeo),b=t.uniforms,A=b.uScale.value,M=b.uWind.value.x,v=b.uWind.value.y,m=t.anchors.crest.y,g=m/3,f=[],x=()=>e.gauss(),k=(w,y,z,S,R,N,_,I,B,j,D,C,V=e())=>{f.push(w,y,z,S,R,N,_,I,B,j,V,D,C)},L=(w,y)=>(1-Math.exp(-w*y))/w,W=(w,y)=>{const z=K/y,S=z/(w+z),R=Math.log(1/S)/y;return((w+z)*(1-S)/y-z*R)*A},F=(w,y)=>{let z=0,S=60;for(let R=0;R<28;R++){const N=(z+S)/2;W(N,y)<w?z=N:S=N}return(z+S)/2},P=(w,y,z,S)=>v+((S-w)/A-v*z)/L(y,z);for(let w=0,y=110;w<y;w++){const z=-1+2*(w+e())/y,S=e.range(.15,4.4),R=e.range(.9,1.5),N=e.range(.15,1.6),_=Y*e.range(1,1.2),I=e.range(1.25,1.7),B=e.range(.9,1.9)*(1-.3*Math.abs(z*z*z)),j=e.range(.45,1),D=x()*.8,C=e.range(-2.5,.5),V=e.range(.7,1),G=Math.max(.3,1.2+(g-1.2)*(.3+.7*S/4.4)*V-R);k(z*12.5,R,N,D,F(G,_),Math.min(C,P(N,_,I,4.8)),S,_,B,4,I,j)}for(let w=0,y=50;w<y;w++){const z=-1+2*(w+e())/y,S=e.range(.1,4.6),R=e.range(1.1,1.5),N=e.range(-.8,.6),_=e.range(2.2,3.4),I=e.range(1.3,2),B=e.range(1.6,3),j=e.range(.1,.2),D=x(),C=e.range(-1,1),V=e.range(.6,1),G=Math.max(.3,1.2+(g-1.2)*(.3+.7*S/4.6)*V-R);k(z*13.5,R,N,D,F(G,_),Math.min(C,P(N,_,I,4.8)),S,_,B,3,I,j)}for(let w=0,y=420;w<y;w++){const z=-1+2*(w+e())/y,S=e.range(.6,4.8),R=e.range(.4,.8)*m,N=x()*.8,_=e.range(-2,0),I=e.range(-1,.5),B=Y*e.range(.45,.6),j=e.range(.6,5.6),D=.05+.09*Math.pow(e(),2),C=e(),V=K/B,G=x()*2.2,Z=e.range(2,6.5),U=1.5+x()*1.2,J=e.range(.03,.09),Q=e();let ie=.1,le=8;for(let me=0;me<30;me++){const se=(ie+le)/2;R+((_+V)*L(B,se)-V*se)*A>.15?ie=se:le=se}const ae=(ie+le)/2,he=L(B,ae);k(z*13-((N-M)*he+M*ae)*A,R,S-((I-v)*he+v*ae)*A,N,_,I,j,B,D,0,ae/.55+.01,1),C<.45&&S<2.2&&k(z*13,.2,S,G,Z,U,j+ae,1.3,J,2,1.1,1,Q)}const n=f.length/13,l=new Float32Array(n*12),h=new Float32Array(n*12),i=new Float32Array(n*16),u=new Float32Array(n*12),o=new Float32Array(n*8),a=new Uint32Array(n*6),r=[-1,1,1,-1],d=[-1,-1,1,1];for(let w=0;w<n;w++){const y=w*13;for(let z=0;z<4;z++){const S=w*4+z;l[S*3]=f[y],l[S*3+1]=f[y+1],l[S*3+2]=f[y+2],h[S*3]=f[y+3],h[S*3+1]=f[y+4],h[S*3+2]=f[y+5],i[S*4]=f[y+6],i[S*4+1]=f[y+7],i[S*4+2]=f[y+8],i[S*4+3]=f[y+9],u[S*3]=f[y+10],u[S*3+1]=f[y+11],u[S*3+2]=f[y+12],o[S*2]=r[z],o[S*2+1]=d[z]}a.set([w*4,w*4+1,w*4+2,w*4,w*4+2,w*4+3],w*6)}const p=new s.BufferGeometry;p.setAttribute("position",new s.BufferAttribute(l,3)),p.setAttribute("aV0",new s.BufferAttribute(h,3)),p.setAttribute("aP",new s.BufferAttribute(i,4)),p.setAttribute("aS",new s.BufferAttribute(u,3)),p.setAttribute("aC",new s.BufferAttribute(o,2)),p.setIndex(new s.BufferAttribute(a,1)),p.boundingSphere=new s.Sphere(new s.Vector3(0,9,0),26);const T=new s.Mesh(p,c.material);return T.renderOrder=c.renderOrder,t.object.add(T),{object:T,count:n,triangles:n*2,cloudTop:g,crestY:m}}const Ue=`
uniform float uTauA, uTauB, uShade, uTime; uniform vec2 uOn; uniform vec4 uFans, uCar[14]; uniform vec3 uSunCol, uAmb, uLDir, uLamp;
varying vec3 vW;
#include <fog_pars_fragment>
${te}${re}
float tongue(float tau, float xc, float k, float sd){
  float x = vW.x, z = vW.z;
  float zmax = 27.25 + k * (3.5 + 1.5 * vn(vec2(x * 0.45, 7.3 + sd)));
  float ts = 1.5 + 31. / (6.2 * k);
  float back = 2.2 * max(tau - ts, 0.);
  float front = min(6.2 * k * (tau - 1.5), zmax) - back;
  float flowS = 5.5 * min(tau, ts) - back;
  float env = smoothstep(1.4, 2.6, tau) * (1. - smoothstep(5.6, 8.6, tau));
  float hw = mix(7.5, 4.6, smoothstep(14., 27.25, z)) + 1.2 * (vn(vec2(z * 0.35, sd + 3.)) - 0.5);
  float side = 1. - smoothstep(hw - 2.2, hw, abs(x));
  float feed = 1. - smoothstep(11. * k, 31. * k, abs(x - xc));
  float inS = 1. - smoothstep(front - 4., front, z);
  float lacef = veins(vec2(x * 0.5 + sd, (z - flowS) * 0.3));
  float edge = 1. - smoothstep(0., 1.6, abs(z - front));
  return clamp(inS * lacef * 0.8 + edge * (0.2 + 0.7 * lacef), 0., 1.) * env * side * feed * smoothstep(19., 23., z);
}
void main(){
  float foam = max(tongue(uTauA, uFans.x, uFans.y, 0.) * uOn.x, tongue(uTauB, uFans.z, uFans.w, 5.) * uOn.y);
  if (foam < 0.004) discard;
  vec2 p = vW.xz; float occ = 0.;
  for (int i = 1; i < 14; i++) { vec4 c = uCar[i]; vec2 fw = vec2(cos(c.z), sin(c.z)), rel = p - c.xy + uLDir.xz * 0.5;
    occ = max(occ, (1. - smoothstep(1.7, 2.9, abs(dot(rel, fw)))) * (1. - smoothstep(0.6, 1.25, abs(dot(rel, vec2(-fw.y, fw.x)))))); }
  float sun = (1. - step(23., vW.z)) * (1. - uShade * smoothstep(0.42, 0.62, fbm(p * 0.012 + uTime * vec2(0.1, 0.055)))) * (1. - 0.85 * occ);
  // (round 13: and the wall's standards light it by place; at the junction the station is -x and z is the metres landward of the wall)
  gl_FragColor = vec4(vec3(0.92, 0.96, 0.95) * (uSunCol * (0.8 * sun + 0.1) + uAmb * 1.1 + uLamp * wallLamps(-vW.x, vW.z, 0.)), foam);
  #include <fog_fragment>
}`;function Oe(t){const e=new s.BufferGeometry,c=.02;e.setAttribute("position",new s.Float32BufferAttribute([-9,c,18.5,9,c,18.5,9,c,33.5,-9,c,33.5],3)),e.setIndex([0,2,1,0,3,2]),e.computeBoundingSphere();const b=new s.ShaderMaterial({uniforms:{...s.UniformsUtils.clone(s.UniformsLib.fog),uTauA:t.tau[0],uTauB:t.tau[1],uOn:t.on,uFans:{value:new s.Vector4(t.fans[0][0],t.fans[0][1],t.fans[1][0],t.fans[1][1])},uSunCol:t.sunCol,uAmb:t.amb,uShade:t.shade,uTime:t.time,uLDir:t.ldir,uCar:t.car,uLamp:t.lamp||{value:new s.Color(0,0,0)}},vertexShader:`varying vec3 vW;
#include <fog_pars_vertex>
void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,fragmentShader:Ue,fog:!0,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),A=new s.Mesh(e,b);return A.renderOrder=1.6,A}async function je(t){const{flora:e,rng:c,H:b,depth:A}=t,M=t.matrix,v=new s.Vector3,m=(i,u,o)=>(v.set(i,u,o).applyMatrix4(M),[v.x,v.y,v.z]),g=b+.35,f=-Math.min(A-2.3,9.7),x=-.5,k=x-f,L=[],W={leaf:t.magenta[0],leafLight:t.magenta[1],leafDark:t.magenta[2],stem:"#4a3c2a"},F={leaf:"#3f7a30",leafLight:"#a0c050",leafDark:"#1f4526",stem:"#4a3c2a"},P=[],n=[];for(let i=0;i<2;i++)for(let u=0,o=18;u<o;u++){const a=f+k*(u+.5+c.range(-.3,.3))/o,r=(4.2+2*Math.sin(Math.PI*(u+.5)/o))*c.range(.9,1),d=.18+i*.32+c.range(0,.12),p=c.range(-.5,.5);((u+i*2)%4===3?n:P).push([m(-d*.6,g,a),m(-d-c.range(0,.2),g-r,a+p)])}L.push(e.vineGeometry({rng:c,spans:P,sag:.03,thickness:.05,leaves:1.25,hangers:1.3,detail:1,...W,flower:t.magenta[1]})),await t.pause?.(),L.push(e.vineGeometry({rng:c,spans:n,sag:.03,thickness:.05,leaves:1.25,hangers:.8,detail:1,...F,flower:t.magenta[0]})),await t.pause?.();for(const i of L){const u=i.attributes.position,o=i.attributes.wind;for(let a=0;a<u.count;a++)o.setX(a,.04+.46*Math.pow(Math.min(1,Math.max(0,g-u.getY(a))/9),1.4))}for(let i=0;i<5;i++){const u=e.bushGeometry({rng:c,size:c.range(1.5,2),detail:0,...W,bark:"#4a3c2a",flowers:1,flowerColor:t.magenta[1]}),o=m(c.range(.5,1.3),b-.1,f+k*(i+.5+c.range(-.25,.25))/5);u.applyMatrix4(new s.Matrix4().makeRotationY(c()*Math.PI*2).setPosition(o[0],o[1],o[2])),L.push(u)}await t.pause?.();{const i=[],u=[],o=[],a=[],r=[],d=[],p=new s.Color(t.magenta[0]),T=new s.Color(t.magenta[1]),w=new s.Color;for(let z=0,S=90;z<S;z++){const R=-.3-6*Math.pow(c(),1.6),N=c.range(-A+.5,1.5),_=c.range(.07,.13),I=c()*Math.PI*2,B=c(),j=c.range(.75,1.1),D=.25*c.range(.6,1.2),C=i.length/3;w.copy(p).lerp(T,B).multiplyScalar(j);for(let V=0;V<4;V++){const G=I+V*Math.PI/2,Z=V%2?_*.6:_,U=m(R+Math.cos(G)*Z,t.pavementY+.04,N+Math.sin(G)*Z);i.push(U[0],U[1],U[2]),u.push(0,1,0),o.push(w.r,w.g,w.b),a.push(D,1.2,1,0),r.push(.875,.75)}d.push(C,C+1,C+2,C,C+2,C+3)}const y=new s.BufferGeometry;y.setAttribute("position",new s.Float32BufferAttribute(i,3)),y.setAttribute("normal",new s.Float32BufferAttribute(u,3)),y.setAttribute("color",new s.Float32BufferAttribute(o,3)),y.setAttribute("wind",new s.Float32BufferAttribute(a,4)),y.setAttribute("uv",new s.Float32BufferAttribute(r,2)),y.setIndex(d),L.push(y)}const l=L.map(i=>i.index.count/3),h=t.merge(L);if(t.glow>0){const i=h.attributes.wind;for(let u=0;u<i.count;u++)i.setW(u,t.glow)}return h.computeBoundingSphere(),h.boundingSphere.radius+=1.5,{geometry:h,triangles:h.index.count/3,vines:l[0]+l[1],mound:l.slice(2,7).reduce((i,u)=>i+u,0),bracts:l[7],top:g,spans:P.length+n.length}}const Ze=(t,e)=>t.tauAt(t.timeline.erupt)-e,Xe=t=>t.tauAt(t.timeline.drained);function He(t,e={}){const c=t.shared.sheetGeo,b=c.attributes.position,A=c.attributes.aV0,M=c.attributes.aT,v=t.uniforms,m=v.uScale.value,g=v.uWind.value.x,f=v.uWind.value.y,x=e.above??1.02,k=-40,L=-8,W=80,F=40,P=new Uint8Array(W*F),n=new Float64Array(7),l={x:0,y:0,z:0},h=Math.max(1,Math.ceil(b.count/(e.samples||1400)));for(let u=0;u<b.count;u+=h){n[0]=b.getX(u),n[1]=b.getY(u),n[2]=b.getZ(u),n[3]=A.getX(u),n[4]=A.getY(u),n[5]=A.getZ(u),n[6]=M.getX(u);for(let o=.04;o<7&&(ne(n,o,Y,g,f,m,l),!(l.y<-4.4||l.z>.05&&l.y<.04));o+=.04){if(l.y<x)continue;const a=Math.floor(l.x-k),r=Math.floor(l.z-L);a>=0&&a<W&&r>=0&&r<F&&(P[r*W+a]=1)}}const i=(u,o)=>{const a=Math.floor(u-k),r=Math.floor(o-L);return a>=0&&a<W&&r>=0&&r<F&&P[r*W+a]===1};return{over(u,o,a=0){for(let r=-a;r<=a;r++)for(let d=-a;d<=a;d++)if(d*d+r*r<=a*a+.01&&i(u+d,o+r))return!0;return!1},strip(u){let o=null,a=null;for(let r=k;r<k+W;r++)i(r+.5,u)&&(o==null&&(o=r),a=r+1);return o==null?null:[o,a]}}}function $e(t,e){const c=t.attributes.position,b=t.attributes.normal,A=t.attributes.aAnim,M=e.len,v=e.girth,m=e.span,g=.16*M+e.chord*.35,f=-.5*M+.1*M-e.tail-.05*M,x=Math.cos(.314),k=Math.sin(.314);for(let o=0;o<c.count;o++){const a=A.getY(o);if(a){const w=Math.min(1,A.getX(o)/m),y=A.getZ(o);c.setXYZ(o,a*v*(.98-.8*w+.15*Math.sin(Math.PI*y)*(1-w)),v*(.82-.31*w)-y*1.25*v*(1-.75*w),g+(f-g)*w),b.setXYZ(o,a*.86,.5,0),A.setXYZW(o,0,0,0,0)}else c.getZ(o)>.29*M&&A.setW(o,-.7*Math.min(1,(c.getZ(o)-.29*M)/(.17*M)));const r=c.getY(o),d=c.getZ(o),p=b.getY(o),T=b.getZ(o);c.setY(o,r*x+d*k),c.setZ(o,d*x-r*k),b.setY(o,p*x+T*k),b.setZ(o,T*x-p*k)}const L=1.5*v,W=-.6*v,F=W-L,P=.11*v,n=new s.Color(e.legC),l=[],h=[],i=c.count;for(const o of[-1,1]){const a=o*.38*v,r=-.03*M,d=i+l.length;for(const T of[W+.3*v,F])for(let w=0;w<3;w++){const y=w*2.0944;l.push([a+Math.cos(y)*P,T,r+Math.sin(y)*P,Math.cos(y),0,Math.sin(y)])}for(let T=0;T<3;T++){const w=(T+1)%3;h.push(d+T,d+w,d+3+T,d+w,d+3+w,d+3+T)}const p=i+l.length;l.push([a-2.2*P,F+.004,r,0,1,0],[a+2.2*P,F+.004,r,0,1,0],[a,F+.004,r+.6*v,0,1,0]),h.push(p,p+1,p+2)}for(const o in t.attributes){const a=t.attributes[o];if(a.isInstancedBufferAttribute)continue;const r=a.itemSize,d=new Float32Array((i+l.length)*r);d.set(a.array),l.forEach((p,T)=>{const w=(i+T)*r;o==="position"?d.set(p.slice(0,3),w):o==="normal"?d.set(p.slice(3,6),w):o==="color"&&d.set([n.r,n.g,n.b].slice(0,r),w)}),t.setAttribute(o,new s.BufferAttribute(d,r))}const u=Array.from(t.index.array);return t.setIndex(u.concat(h)),-F}function Ke(t){return[[0,0,0],[.3,1,.9],[1.5,2.6,.6],[4,5,-3],[7,7.5,-8],[5,9.5,-17],[-2,10.5,-19],[-7,10,-13],[-4,9.5,-6.5],[3,9.5,-5.5],[7,9,-11],[4,8,-17.5],[-4,7,-15.5],[-12.8,4.95,.3],[-11.1,4.1,2.6],[-8.1,3.1,2.3],[-5.5,1.9,-.3],[-1.6,.5,-.3]].map(e=>[e[0]*t,e[1],e[2]])}function Je(t,e=[0,0]){t=Math.min(1,Math.max(0,t));const c=.8,b=2*Math.PI*t,A=Math.sin(b),M=.5+.5*Math.cos(b),v=(t+3*A/(2*Math.PI)+3*(t/2+Math.sin(2*b)/(8*Math.PI))+(A-A*A*A/3)/(2*Math.PI))/8;return e[0]=(t-c*v)/(1-c*5/16),e[1]=(1-c*M*M*M)/(1-c*5/16),e}function Qe(t,e={}){const c=t.uniforms,b=c.uWind.value.x,A=c.uWind.value.y,M=t.shared.sheetGeo.attributes,v=e.spray?t.shared.partGeo.attributes:null,m=M.position.count,g=.1,f=70,x=-K/Y,k=new Float32Array(f+1);for(let l=1;l<=f;l++)k[l]=(1-Math.exp(-Y*l*g))/Y;const L=l=>{let h=1e9;for(let i=0;i<m;i++){const u=M.aV0.getY(i);if(u<=0)continue;const o=Math.log((u-x)/-x)/Y,a=(u-x)*(1-Math.exp(-Y*o))/Y+x*o,r=(l-M.position.getY(i))/a;r<h&&(h=r)}return h},W=l=>{let h=-1e9;for(let i=0;i<m;i++){const u=M.aV0.getY(i),o=M.position.getY(i);if(u<=0){o>h&&(h=o);continue}const a=Math.log((u-x)/-x)/Y,r=o+((u-x)*(1-Math.exp(-Y*a))/Y+x*a)*l;r>h&&(h=r)}return h},F=l=>{for(let h=0;h<m;h++){const i=M.position.getX(h),u=M.position.getY(h),o=M.position.getZ(h),a=M.aV0.getX(h)-b,r=M.aV0.getY(h)-x,d=M.aV0.getZ(h)-A;for(let p=1;p<=f;p++){const T=p*g,w=k[p];l(i,u,o,a*w+b*T,r*w+x*T,d*w+A*T)}}if(v)for(let h=0,i=v.position.count;h<i;h+=4){const u=v.aP.getW(h);if(!(u<.5||u>3.5))continue;const o=v.aP.getY(h),a=v.aS.getY(h),r=-K/o,d=v.position.getX(h),p=v.position.getY(h),T=v.position.getZ(h),w=v.aV0.getX(h)-b,y=v.aV0.getY(h)-r,z=v.aV0.getZ(h)-A;for(let S=1;S<=f&&S*g<a;S++){const R=S*g,N=(1-Math.exp(-o*R))/o;l(d,p,T,w*N+b*R,y*N+r*R,z*N+A*R)}}};return{at:(l,h=1.02)=>{let i=-1e9,u=1e9,o=0;return F((a,r,d,p,T,w)=>{if(r+T*l<h)return;const y=d+w*l,z=Math.abs(a+p*l);y>i&&(i=y),y<u&&(u=y),z>o&&(o=z)}),{top:W(l),land:i,sea:u,half:o}},topAt:W,scaleForTop:L,scaleForLand:(l,h=1.02)=>{let i=1e9;return F((u,o,a,r,d,p)=>{if(p<=0||d<=0)return;const T=Math.max((l-a)/p,(h-o)/d);T<i&&(i=T)}),i}}}function et(t,e){return t.uniforms.uScale.value=e,t.shared.V.scale=e,e}export{re as LAMP_GLSL,je as buildCascade,Be as buildFootSpray,qe as buildHero,Oe as buildStreetTongue,Xe as fanDrained,Qe as fanExtent,He as fanFootprint,Ze as fanLiftCue,et as fanResize,$e as foldWings,Ke as gullLoop,Je as loopShare};
