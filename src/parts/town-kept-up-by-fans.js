import*as L from"three";import{clamp as nt,lerp as Gt,smoothstep as Ut}from"../kit/core.js";const qt=["#E5352B","#FFC928","#1F5FD0","#2FA85A","#F7F5EE","#F0509A","#6FA8E8"],I={RED:0,YELLOW:1,BLUE:2,GREEN:3,WHITE:4,PINK:5,WHITE_ON_BLUE:6,WEB:7},it=40,Kt=.86,Pt={x:0,z:300,ring:17},Xt=`
uniform float uTime; uniform vec3 uSun; uniform vec2 uWind; uniform vec4 uGust; uniform float uShadowY;
uniform float uClock; uniform float uGustT; uniform vec4 uOut;   // script clock (births), gust clock, the breath out: x = clock when every fan stops, y = seconds stopped, z = speed of the front that restarts them, w = where along the wind it starts
vec3 rotA(vec3 v, vec3 a, float ang){ float c = cos(ang), s = sin(ang); return v*c + cross(a, v)*s + a*dot(a, v)*(1.0 - c); }
// rel: rest position relative to the body's foot. H height, dir fold direction (unit xz), kh hinge height 0..1,
// sinkMin height kept at p = 0, mask which of x,z is "section" (1,1 tube; 0,1 or 1,0 wall), rs0 section scale at p = 0.
// st = (p, kink radians, lean radians, tip radians). Returns the deformed rel; nrm is turned with it.
vec3 inflate(vec3 rel, inout vec3 nrm, float H, vec2 dir, float kh, float sinkMin, vec2 mask, float rs0, vec4 st, float ph, out float soft){
  float p = st.x; soft = 1.0 - min(p, 1.0);
  float hn = clamp(rel.y / max(H, 1e-3), 0.0, 1.2);
  float breathe = 1.0 + 0.02 * sin(uTime * (1.3 + 0.7 * fract(ph * 0.37)) + ph * 6.283) * min(p, 1.0);
  float rs = mix(rs0, 1.0, min(p, 1.0)) * breathe * (1.0 + 2.0 * max(p - 1.0, 0.0));
  // under-inflation: the section goes slack toward the top first (tips sag)
  rs *= 1.0 - 0.35 * soft * hn * step(0.5, mask.x * mask.y);
  rel.xz *= mix(vec2(1.0), vec2(rs), mask);
  float sy = mix(sinkMin, 1.0, min(p, 1.0)) * (1.0 + 0.6 * max(p - 1.0, 0.0));
  rel.y *= sy; float Hs = H * sy;
  // deep wrinkles of a slumped skin: folds that travel across it as it sinks
  float wr = sin(rel.y * 0.9 + 2.5 * sin((rel.x + rel.z) * 0.21 + ph * 9.0) + ph * 40.0);
  // pushed along a direction that is the same on both sides of a seam (out from the spine), so panels never part
  vec2 rd = rel.xz * mask; vec3 wdir = mask.x + mask.y > 0.5 ? vec3(rd.x, 0.0, rd.y) / max(length(rd), 1.5) : vec3(0.0, 1.0, 0.0);
  rel += wdir * (soft * 1.1 * wr * smoothstep(0.0, 0.12, hn));
  nrm.y += soft * 0.9 * cos(rel.y * 0.9 + 2.5 * sin((rel.x + rel.z) * 0.21 + ph * 9.0) + ph * 40.0);
  vec3 ax = vec3(dir.y, 0.0, -dir.x);
  // tip droop: the last quarter hangs
  float t2 = smoothstep(0.77 * Hs, 0.91 * Hs, rel.y); float a2 = st.w * t2;
  vec3 pv2 = vec3(0.0, 0.83 * Hs, 0.0);
  rel = pv2 + rotA(rel - pv2, ax, a2); nrm = rotA(nrm, ax, a2);
  // the kink: a hinge at kh that turns everything above it and pinches the section to a quarter
  float hk = kh * Hs, w = 0.06 * Hs + 0.5;
  float t1 = smoothstep(hk - w, hk + w, rel.y); float a1 = st.y * t1;
  float e = (rel.y - hk) / w; float pinch = 1.0 - 0.75 * clamp(abs(st.y) * 1.2, 0.0, 1.0) * exp(-e * e);
  rel.xz *= mix(vec2(1.0), vec2(pinch), mask);
  vec3 pv1 = vec3(0.0, hk, 0.0);
  rel = pv1 + rotA(rel - pv1, ax, a1); nrm = rotA(nrm, ax, a1);
  // lean from the foot, a little more with height (a soft tower leans until it is pumped up)
  float a0 = st.z * (0.45 + 0.55 * hn);
  rel = rotA(rel, ax, a0); nrm = rotA(nrm, ax, a0);
  return rel;
}
// a gust front: straight lines moving downwind; 0 between fronts, rises to 1 as a front passes world xz, decays in ~1.6 s
float gustAt(vec2 xz, float t){
  float period = max(uGust.w, 1.0), speed = max(uGust.z, 1.0);
  float s = dot(xz, uGust.xy) / speed;            // seconds of delay at this place
  float tt = mod(t - s, period);
  return smoothstep(0.0, 0.25, tt) * (1.0 - smoothstep(0.5, 1.6, tt));
}
`,Yt=`
attribute vec2 aUV; attribute vec2 aSeam; attribute vec4 aInfo; attribute vec2 aPan;
uniform vec3 uLit[8]; uniform vec3 uShade[8]; uniform float uStream; uniform vec3 uStreamK;   // uStreamK: how far the ribbons fan apart, ripple and twist (1,1,1 streamers; 0,.2,0 bunting pennants)
#ifdef BODIES
uniform vec4 uBP[${it}]; uniform vec4 uBD[${it}]; uniform vec4 uBX[${it}]; uniform vec4 uBS[${it}];
#endif
#ifdef INSTANCED
attribute vec4 iBody; attribute vec4 iState; uniform vec4 uInst;
#endif
varying vec3 vN; varying vec3 vW; varying vec2 vUV; varying vec2 vSeam; varying vec3 vLit; varying vec3 vShade; varying vec2 vSoft; varying vec2 vPan; varying float vBand;
${Xt}
void main(){
  float clf = aInfo.y;
#ifdef INSTANCED
  // geometry cloth 0 = the instance's first cloth, 1 = its second: iState.w = first + 8 * second
  clf = aInfo.y < 0.5 ? mod(iState.w, 8.0) : (aInfo.y < 1.5 ? floor(iState.w / 8.0) : aInfo.y);
#endif
  int cl = int(clamp(clf, 0.0, 7.0) + 0.5);
  vLit = uLit[cl]; vShade = uShade[cl];
  // cloth 7.3: a tether or pole seen across the town, the webbing a mid tone instead of black (a hairline, not a scribble)
  if (aInfo.y > 7.2) { vLit = mix(uLit[7], uLit[4], 0.3); vShade = vLit; }
  if (aInfo.y > 7.5) { vLit = uLit[4]; vShade = vLit; }      // (small round) cloth 7.6, THE STRAP: every guy line, tether and pole is white webbing, one flat tone on both sides
  vec3 P = position; vec3 N = normal; float soft = 0.0;
#ifdef BODIES
  int id = int(clamp(aInfo.x, 0.0, ${it-1}.0) + 0.5);
  vec4 bp = uBP[id], bd = uBD[id], bx = uBX[id], st = uBS[id];
  if (aInfo.z >= 0.0) st.x = clamp((st.x - aInfo.z * 0.6) / 0.4, 0.0, 1.0) + max(st.x - 1.0, 0.0);   // panels fill in order (order < 0: no order)
  P = bp.xyz + inflate(P - bp.xyz, N, bp.w, bd.xy, bd.z, bd.w, bx.xy, bx.z, st, bx.w, soft);
#ifndef STREAMER
  P = mix(P, position, aInfo.w);          // aInfo.w = pin: a guy line's peg end stays in the ground
#endif
  vec4 wp = modelMatrix * vec4(P, 1.0);
  vec3 wn = mat3(modelMatrix) * N;
#endif
#ifdef INSTANCED
  vec3 io = (modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
  mat3 im = mat3(modelMatrix) * mat3(instanceMatrix);
  float g = gustAt(io.xz, uGustT);
  vec3 dl = vec3(uGust.x, 0.0, uGust.y) * im;                       // downwind, in the instance's frame
  float dll = max(length(dl.xz), 1e-4); vec2 dir = dl.xz / dll;
  // iState.x: 0 always up; > 0 born once at that script clock; < 0 lives on a 46 s cycle of world time (sags, lies down, is born again)
  float cyc = mod(uTime - iState.x, 46.0);
  float age = iState.x == 0.0 ? 9.0 : (iState.x > 0.0 ? (uClock - iState.x) / 6.0 : cyc / 6.0);   // a birth lasts six seconds
  float sag = iState.x < 0.0 ? smoothstep(39.0, 45.8, cyc) : 0.0;
  float born = clamp(age, 0.0, 1.0);
  float pb = smoothstep(0.15, 0.8, born) * 1.08 - 0.08 * smoothstep(0.82, 1.0, born);
  // the breath out: every fan stops, the town sinks together, then stands back up along a front running downwind
  float od = uClock - uOut.x, oup = od - uOut.y - max(dot(io.xz, uGust.xy) - uOut.w, 0.0) / max(uOut.z, 1.0);
  float outp = smoothstep(0.0, 1.8, od) * (1.0 - smoothstep(0.0, 0.9, oup));
  float obounce = oup > 0.0 ? 0.09 * exp(-oup * 2.2) * sin(oup * 7.0) : 0.0;
  float p = pb * (1.0 - 0.45 * iState.y) * (1.0 - 0.94 * sag) * (1.0 - 0.8 * outp) + obounce * step(0.99, born);
  vec4 st = vec4(p, (iBody.w * g + 2.5 * outp * uInst.z) * step(0.99, born), iState.z * iState.y + 0.12 * g + 0.5 * sag, 0.5 * iState.y + 0.6 * g * uInst.z + 0.8 * outp * uInst.z);
  // arms (aInfo.w = metres out from the shoulder, signed by side) flail, never in step, and drop in a gust
  float arm = aInfo.w, aa = abs(arm);
  float af = uTime * (3.1 + 1.7 * fract(iBody.z * 5.3)) + iBody.z * 40.0 + sign(arm) * 1.9;
  P.y += aa * (0.5 * sin(af) - 0.6 * g - 0.9 * iState.y) + aa * aa * (0.045 * sin(af - 1.1) - 0.035) + 0.9 * sin(aa * 0.42 - af * 1.3) * smoothstep(0.0, 4.0, aa);
  P.xz += dir * (aa * 0.3 * sin(uTime * 2.3 + iBody.z * 17.0 + sign(arm)) + 0.6 * sin(aa * 0.38 - uTime * 3.7 + iBody.z * 9.0) * smoothstep(0.0, 4.0, aa));
  P = inflate(P, N, iBody.x, dir, iBody.y, uInst.x, vec2(1.0, 1.0), uInst.y, st, iBody.z, soft);
  // the puddle: before it lumps up a body lies spread on the ground in low lumps
  float pud = 1.0 - smoothstep(0.0, 0.3, born);
  P.y += pud * 0.5 * (0.5 + 0.5 * sin(P.x * 0.9 + iBody.z * 20.0) * sin(P.z * 1.1 + iBody.z * 7.0));
  // the breath out: a house that has sunk is not a plate but puddled cloth, lumps a metre and more high with air still caught
  // under them, and the normal follows the lumps (so the three tones and the sheen show them)
  float lmp = outp * step(uInst.x, 0.1) * step(0.99, born) * smoothstep(0.3, 2.2, position.y);
  if (lmp > 0.001) { float ax = P.x * 0.8 + iBody.z * 20.0, az = P.z * 0.95 + iBody.z * 7.0;
    P.y += lmp * 1.7 * (0.55 + 0.45 * sin(ax) * sin(az) + 0.22 * sin(ax * 2.3 + 1.0) * sin(az * 1.9 + 0.5));
    N += lmp * vec3(-0.85 * cos(ax) * sin(az), 0.0, -0.85 * sin(ax) * cos(az)); }
  vec4 wp = modelMatrix * instanceMatrix * vec4(P, 1.0);
  vec3 wn = im * N;
  if (uInst.w > 0.5) {
    // a windsock: the geometry is a sock along +y from its hoop; it is laid out here downwind from the instance's
    // origin (the pole's top), hanging limp between gusts, filling and swimming as a front passes
    float sl = position.y, fill = clamp(0.5 + 0.6 * g + 0.18 * sin(uTime * 0.7 + iBody.z * 30.0) - 0.9 * outp - 0.5 * iState.y, 0.04, 1.0);
    float ang = mix(1.38, 0.1, fill);
    vec3 dwn = vec3(uGust.x, 0.0, uGust.y); dwn = dwn / max(length(dwn), 1e-4);
    vec3 axs = dwn * cos(ang) - vec3(0.0, 1.0, 0.0) * sin(ang);
    vec3 sde = vec3(-dwn.z, 0.0, dwn.x); vec3 upv = cross(sde, axs);
    float hang = smoothstep(0.0, 1.6, sl), rsk = mix(1.0, mix(0.3, 1.0, fill), hang) * iBody.x;
    float wig = sin(sl * 1.3 - uTime * (5.0 + 2.0 * fract(iBody.z * 7.0)) + iBody.z * 40.0) * 0.07 * sl * (0.3 + 0.7 * fill);
    vec3 q = io + iBody.x * (axs * sl + sde * wig) + sde * (position.x * rsk) + upv * (position.z * rsk * mix(0.45, 1.0, fill));
    wp = vec4(q, 1.0); wn = sde * normal.x + upv * normal.z + axs * normal.y;
    soft = (1.0 - fill) * 0.6;
  }
#endif
#ifdef STREAMER
  // position = the root on the body (already deformed above); the ribbon is laid out here, downwind and hanging
  float L = aInfo.w, s = aUV.x, sd = aUV.y, phs = aSeam.x;
  float k = clamp(uStream * (0.75 + 0.25 * sin(uTime * 1.7 + phs * 5.0)), 0.05, 0.98);
  vec3 dw = vec3(uWind.x, 0.0, uWind.y); dw = dw / max(length(dw), 1e-4);
  vec3 run = dw * k + vec3(0.0, -1.0, 0.0) * sqrt(1.0 - k * k);
  vec3 sideH = vec3(-dw.z, 0.0, dw.x);
  vec3 upS = cross(sideH, run);
  float rp = s * 11.0 - uTime * (6.0 + 2.0 * fract(phs * 3.1)) + phs * 6.283;
  vec3 c = run * (L * s) + (upS * (sin(rp) * 0.9 * s) + sideH * (sin(rp * 0.63 + 1.7) * 0.8 * s)) * uStreamK.y + (sideH * ((fract(phs * 7.3) - 0.5) * 7.0 * s) + upS * ((fract(phs * 3.7) - 0.5) * 6.0 * s)) * uStreamK.x;
  float tw = (s * 2.2 + phs * 9.0 + uTime * 1.1) * uStreamK.z;
  vec3 wv = sideH * cos(tw) + upS * sin(tw);
  wp.xyz += c + wv * (sd * aSeam.y);
  wn = cross(run + upS * (cos(rp) * 0.6 * uStreamK.y), wv);
  vUV = vec2(L * s, sd * aSeam.y); vSeam = vec2((1.0 - abs(sd)) * aSeam.y, 9.0);
#else
  vUV = aUV; vSeam = aSeam;
#endif
  // a hose keeps a width the eye can hold: far off its section is let out so that it never thins to a broken hair
  if (aInfo.z < -1.5) { float hr = -aInfo.z - 2.0; wp.xyz += wn / max(length(wn), 1e-4) * max(0.0017 * length(cameraPosition - wp.xyz) - hr * length(wn), 0.0); }
#ifdef SHADOW
  wp.xyz -= uSun * ((wp.y - uShadowY) / max(uSun.y, 0.2)); wp.y = uShadowY;
#endif
  vN = wn; vW = wp.xyz; vSoft = vec2(soft, aInfo.y > 6.5 ? 0.0 : 1.0); vPan = aPan; vBand = abs(clf - 6.0) < 0.5 ? 1.0 : 0.0;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,_t=`
uniform float uTime; uniform vec3 uSun; uniform vec3 uWeb; uniform vec3 uTarp; uniform vec2 uSheen; uniform vec4 uHaze;
// THE AIR: every cloth, wash and the floor goes toward the low sky's tone by its distance (paler at the pale hours, deeper under the
// engine's night), none inside 150 m, so that the far town
// lies behind the near one in layers instead of at one strength (the same law in the tarpaulin's shader)
float airAt(float d){ return uHaze.w * smoothstep(150.0, 900.0, d); }
varying vec3 vN; varying vec3 vW; varying vec2 vUV; varying vec2 vSeam; varying vec3 vLit; varying vec3 vShade; varying vec2 vSoft; varying vec2 vPan; varying float vBand;
void main(){
#ifdef SHADOW
  // the wash of the caster's colour, LAID ON the pale cloth, not multiplied into it (multiplied into the green-grey tarpaulin red
  // went brick and peach went tan). The cloth's hue is mixed by eye (in display values) into a clean white as light as the floor,
  // just far enough to be a decided pastel: red throws rose, peach throws peach, green mint, yellow lemon; white casts a cool pale
  // wash; webbing, black or the white strap (cloth 7.6), a deeper tone of the floor. ONE WASH A PIXEL: the tarpaulin leaves 1 - WASH in the buffer's alpha where it is
  // bare; the wash is laid by that alpha (see skin(), the shadow's blend) and writes 1 there, so whatever is cast on a washed place
  // afterwards changes nothing. Each cloth throws one decided flat tone with the clean scalloped edge of its own outline, and where
  // two washes overlap the floor takes the first of them, never a third tone. (Beyond 150 m the air lies over wash and floor alike.)
  vec3 sS = pow(max(vLit, vec3(1e-4)), vec3(0.4545));
  float smx = max(sS.r, max(sS.g, sS.b)), smn = min(sS.r, min(sS.g, sS.b)), ssat = (smx - smn) / max(smx, 1e-3);
  float tmx = pow(clamp(1.08 * max(uTarp.r, max(uTarp.g, uTarp.b)), 1e-4, 1.0), 0.4545);
  vec3 tint = pow(mix(vec3(tmx), sS, clamp(0.37 / max(ssat, 0.05), 0.3, 0.95)), vec3(2.2));
  vec3 wash = mix(uTarp * vec3(0.86, 0.9, 0.96), tint, smoothstep(0.03, 0.14, ssat));
  gl_FragColor = vec4(mix(vSoft.y < 0.5 ? uTarp * vec3(0.72, 0.8, 0.7) : wash, uHaze.rgb, airAt(length(cameraPosition - vW))), 1.0);
#else
  vec3 n = vN; float n2 = dot(n, n); n = n2 > 1e-8 ? n * inversesqrt(n2) : vec3(0.0, 1.0, 0.0);
  if (!gl_FrontFacing) n = -n;
  vec3 tv = cameraPosition - vW; float dist = max(length(tv), 1e-3); vec3 v = tv / dist;
  float seam = min(vSeam.x, vSeam.y);
  float along = vSeam.x < vSeam.y ? vUV.y : vUV.x;
  float nearS = 1.0 - smoothstep(0.0, 0.3, seam);
  // three decided tones (beyond 150 m the air over all three). Shade: the same cloth made richer, one clean edge where the skin turns from the sun;
  // a soft skin wrinkles all over, a full one only drums a little
  float dsun = dot(n, uSun);
  float wrk = vSoft.x * 0.5 * sin(vUV.y * 2.3 + 2.0 * sin(vUV.x * 1.1));
  float drum = sin(vUV.x * 2.6 + vUV.y * 1.7 + uTime * 6.0) * (1.0 - nearS);
  float ndl = dsun + wrk * 0.3 + 0.012 * drum;
  float fn = clamp(fwidth(ndl), 1e-4, 0.05);
  float lit = smoothstep(-fn, fn, ndl);
  vec3 col = mix(vShade, vLit, lit);
  // one sheen bar per panel: a long bar a fifth of the way in from the seam on the side that faces the sun; it drums
  vec2 gs = vec2(dFdx(vPan.x), dFdy(vPan.x)), gd = vec2(dFdx(dsun), dFdy(dsun));
  float slope = dot(gs, gd) / max(dot(gs, gs), 1e-9);
  float s0 = 0.5 + 0.2 * clamp(slope * 5.0, -1.0, 1.0) + 0.012 * drum;
  float fb = max(fwidth(vPan.x), 1e-4);
  float bar = (1.0 - smoothstep(0.05, 0.05 + 1.5 * fb, abs(vPan.x - s0))) * smoothstep(0.1, 0.17, vPan.y) * (1.0 - smoothstep(0.83, 0.9, vPan.y));
  float sh = bar * step(0.0, vPan.x) * smoothstep(0.22, 0.34, dsun) * clamp(0.07 / fb, 0.0, 1.0) * vSoft.y * (1.0 - smoothstep(0.08, 0.4, vSoft.x));
  // white shows its swell by tint, not by tone: the side of each gore that turns from the sun takes the shade (a tenth of the
  // cloth behind it), fading out toward the gore's crown; the sheen bar stays whiter than the cloth
  float gside = slope > 0.0 ? 1.0 - vPan.x : vPan.x;
  col = mix(col, vShade * vec3(0.93, 0.95, 1.0), smoothstep(0.4, 0.95, gside) * step(0.0, vPan.x) * vBand * lit);
  col = mix(col, mix(vLit, vec3(1.0), 0.35 + 0.65 * vBand), sh);
  // pucker ticks: wrinkles a hand long either side of a seam, in the other tone; longer and denser as pressure falls
  float tickLen = 0.2 + 0.5 * vSoft.x;
  float tick = smoothstep(0.5, 0.8, sin(along * 31.0 + 1.3 * sin(along * 7.0))) * smoothstep(0.045, 0.07, seam) * (1.0 - smoothstep(tickLen * 0.6, tickLen, seam));
  col = mix(col, mix(mix(vLit, vShade, lit), vShade * vec3(0.84, 0.88, 1.0), vBand), tick * 0.75 * (1.0 - smoothstep(25.0, 70.0, dist)) * vSoft.y);
  // ripstop: a 2 cm grid at 5 percent with every fifth thread heavier (10 cm squares), gone where a cell is too small to draw
  vec2 g = vUV / 0.02; vec2 fg = fwidth(g); float cellpx = 1.0 / max(max(fg.x, fg.y), 1e-4);
  vec2 gq = abs(fract(g) - 0.5);
  col *= 1.0 - 0.05 * max(smoothstep(0.36, 0.5, gq.x), smoothstep(0.36, 0.5, gq.y)) * smoothstep(4.0, 8.0, cellpx);
  vec2 g5 = vUV / 0.1; float cell5 = cellpx * 5.0, lw = clamp(0.75 / cell5, 0.06, 0.3);
  vec2 gq5 = abs(fract(g5) - 0.5);
  col *= 1.0 - 0.085 * max(smoothstep(0.5 - lw, 0.5 - 0.4 * lw, gq5.x), smoothstep(0.5 - lw, 0.5 - 0.4 * lw, gq5.y)) * smoothstep(3.2, 6.0, cell5) * vSoft.y;
  // the seam: two rows of stitching, one either side of the join. 6 cm apart at arm's length, held apart on screen
  // further off (a seam pair), separate stitches up close, gone beyond 250 m; the join between them is the richer tone
  float fs = max(fwidth(seam), 1e-5);
  float panelPx = 1.0 / max(max(fwidth(vPan.x), fwidth(vPan.y)), 1e-4);          // a small panel on screen takes one line, not a pair
  float off = mix(0.03, clamp(1.7 * fs, 0.03, 0.32), smoothstep(16.0, 30.0, panelPx));
  float hw = max(0.008, 0.5 * fs);
  float row = 1.0 - smoothstep(hw, hw + fs, abs(seam - off));
  float fa = max(fwidth(along), 1e-5), da = clamp(fa / 0.12, 0.0, 0.2);
  float dash = 1.0 - smoothstep(0.3 - da, 0.3 + da, abs(fract(along / 0.12) - 0.5));
  dash = mix(dash, 0.8, smoothstep(0.025, 0.05, fa));
  float seamFade = (1.0 - smoothstep(170.0, 250.0, dist)) * vSoft.y * smoothstep(5.0, 13.0, panelPx);      // a panel a few pixels across is clean cloth
  col = mix(col, vShade, (1.0 - smoothstep(0.3 * off, 0.6 * off, seam)) * seamFade);
  col = mix(col, mix(vShade, uWeb, 0.72), row * dash * 0.9 * seamFade);
  gl_FragColor = vec4(mix(col, uHaze.rgb, airAt(dist)), 1.0);
#endif
}`;function Zt(){let e=16384,t=0,o=65536,r=0,h=new Float32Array(e*3),s=new Float32Array(e*3),c=new Float32Array(e*2),f=new Float32Array(e*2),y=new Float32Array(e*4),i=new Float32Array(e*2),l=new Uint32Array(o);const x=(u,p)=>{const m=new u.constructor(p);return m.set(u),m};return{get count(){return t},get tris(){return r/3},vert(u,p,m,g,W,M,S,k,B,A,F,U,D,K,O=-1,a=.5){return t>=e&&(e*=2,h=x(h,e*3),s=x(s,e*3),c=x(c,e*2),f=x(f,e*2),y=x(y,e*4),i=x(i,e*2)),i[t*2]=O,i[t*2+1]=a,h[t*3]=u,h[t*3+1]=p,h[t*3+2]=m,s[t*3]=g,s[t*3+1]=W,s[t*3+2]=M,c[t*2]=S,c[t*2+1]=k,f[t*2]=B,f[t*2+1]=A,y[t*4]=F,y[t*4+1]=U,y[t*4+2]=D,y[t*4+3]=K,t++},pinRange(u,p,m){for(let g=u;g<p;g++)y[g*4+3]=m(h[g*3],h[g*3+1],h[g*3+2])},tri(u,p,m){r+3>o&&(o*=2,l=x(l,o)),l[r++]=u,l[r++]=p,l[r++]=m},geometry(){const u=new L.BufferGeometry;return u.setAttribute("position",new L.BufferAttribute(h.slice(0,t*3),3)),u.setAttribute("normal",new L.BufferAttribute(s.slice(0,t*3),3)),u.setAttribute("aUV",new L.BufferAttribute(c.slice(0,t*2),2)),u.setAttribute("aSeam",new L.BufferAttribute(f.slice(0,t*2),2)),u.setAttribute("aInfo",new L.BufferAttribute(y.slice(0,t*4),4)),u.setAttribute("aPan",new L.BufferAttribute(i.slice(0,t*2),2)),u.setIndex(new L.BufferAttribute(l.slice(0,r),1)),u}}}const pt=[0,0,0],mt=[0,0,0],vt=[0,0,0],xt=[0,0,0],wt=[0,0,0];function Y(e,t){const o=t.nu,r=t.nv,h=t.su??4,s=t.sv??4,c=t.tuft!==!1,f=!!t.flip,y=t.uEdges,i=t.vEdges,l=t.P,x=.001,u=t.tuftK??1,p=new Int32Array((h+1)*(s+1));let m=0,g=1,W=0;const M=t.cols?t.cols[0]:0,S=t.cols?t.cols[1]:o;for(let k=M;k<S;k++)for(let B=0;B<r;B++){const A=y?y[k]:k/o,F=y?y[k+1]:(k+1)/o,U=i?i[B]:B/r,D=i?i[B+1]:(B+1)/r,K=typeof t.cloth=="function"?t.cloth(k,B):t.cloth??0,O=typeof t.order=="function"?t.order(k,B):t.order??-1,a=t.orderAt,n=typeof t.bulge=="function"?t.bulge(k,B):t.bulge??.5;for(let v=0;v<=s;v++)for(let d=0;d<=h;d++){const w=d/h,P=v/s,E=A+(F-A)*w,R=U+(D-U)*P;l(E,R,pt),l(Math.min(1,E+x),R,mt),l(Math.max(0,E-x),R,vt),l(E,Math.min(1,R+x),xt),l(E,Math.max(0,R-x),wt);const C=Math.min(1,E+x)-Math.max(0,E-x),q=Math.min(1,R+x)-Math.max(0,R-x);let N=(mt[0]-vt[0])/C,b=(mt[1]-vt[1])/C,H=(mt[2]-vt[2])/C,G=(xt[0]-wt[0])/q,X=(xt[1]-wt[1])/q,_=(xt[2]-wt[2])/q;const j=Math.hypot(N,b,H),Z=Math.hypot(G,X,_);let V=X*H-_*b,$=_*N-G*H,Q=G*b-X*N;f&&(V=-V,$=-$,Q=-Q);const J=Math.hypot(V,$,Q);J>1e-6*(j*Z+1e-9)&&J>1e-9?(V/=J,$/=J,Q/=J,m=V,g=$,W=Q):(V=m,$=g,Q=W);const ot=Math.max(j*(F-A),.001),ct=Math.max(Z*(D-U),.001),ht=Math.sin(Math.PI*w),at=2*P-1,Lt=c?1-u*at*at*at*at:1,Mt=n*ht*Lt,Tt=n*Math.PI*Math.cos(Math.PI*w)*Lt/ot,Wt=c?n*ht*u*(-8*at*at*at)/ct:0;let ft=V,ut=$,dt=Q;j>1e-9&&(ft-=N/j*Tt,ut-=b/j*Tt,dt-=H/j*Tt),Z>1e-9&&(ft-=G/Z*Wt,ut-=X/Z*Wt,dt-=_/Z*Wt);const zt=Math.hypot(ft,ut,dt)||1;p[v*(h+1)+d]=e.vert(pt[0]+V*Mt,pt[1]+$*Mt,pt[2]+Q*Mt,ft/zt,ut/zt,dt/zt,E*j,R*Z,h>1?Math.min(w,1-w)*ot:9,c&&s>1?Math.min(P,1-P)*ct:9,t.body??0,K,a?a(E,R):O,t.pin??0,t.sheen===!1?-1:w,c?P:(R-(t.bar0??0))/Math.max((t.bar1??1)-(t.bar0??0),.001))}for(let v=0;v<s;v++)for(let d=0;d<h;d++){const w=p[v*(h+1)+d],P=p[(v+1)*(h+1)+d],E=p[v*(h+1)+d+1],R=p[(v+1)*(h+1)+d+1];f?(e.tri(w,E,P),e.tri(E,R,P)):(e.tri(w,P,E),e.tri(E,P,R))}}}async function bt(e,t,o,r=4){for(let h=0;h<t.nu;h+=r)Y(e,{...t,cols:[h,Math.min(t.nu,h+r)]}),await o.yield()}function tt(e,t,o,r=I.WEB,h=0,s=null){const c=o*.5;for(let f=0;f<2;f++){let y=-1,i=-1,l=0;for(let x=0;x<t.length;x++){const u=t[x],p=t[Math.max(0,x-1)],m=t[Math.min(t.length-1,x+1)];let g=m[0]-p[0],W=m[1]-p[1],M=m[2]-p[2];const S=Math.hypot(g,W,M)||1;g/=S,W/=S,M/=S;let k=-M,B=0,A=g;const F=Math.hypot(k,A);F<1e-4?(k=1,A=0):(k/=F,A/=F);const U=B*M-A*W,D=A*g-k*M,K=k*W-B*g,O=f?U:k,a=f?D:B,n=f?K:A,v=f?k:U,d=f?B:D,w=f?A:K;x>0&&(l+=Math.hypot(u[0]-t[x-1][0],u[1]-t[x-1][1],u[2]-t[x-1][2]));const P=e.vert(u[0]-O*c,u[1]-a*c,u[2]-n*c,v,d,w,0,l,9,9,h,r,-1,s?s[x]:0),E=e.vert(u[0]+O*c,u[1]+a*c,u[2]+n*c,v,d,w,o,l,9,9,h,r,-1,s?s[x]:0);y>=0&&(e.tri(y,P,i),e.tri(i,P,E),e.tri(y,i,P),e.tri(i,E,P)),y=P,i=E}}}function St(e,t,o,r=I.WEB,h=0,s=4,c=1,f=null){const y=t.length,i=p=>t[Math.max(0,Math.min(y-1,p))],l=[];for(let p=0;p<y-1;p++)for(let m=0;m<c;m++){const g=m/c,W=i(p-1),M=i(p),S=i(p+1),k=i(p+2),B=[0,0,0,0];for(let A=0;A<3;A++)B[A]=.5*(2*M[A]+(S[A]-W[A])*g+(2*W[A]-5*M[A]+4*S[A]-k[A])*g*g+(3*M[A]-W[A]-3*S[A]+k[A])*g*g*g);B[3]=f?f[p]+(f[p+1]-f[p])*g:0,l.push(B)}l.push([t[y-1][0],t[y-1][1],t[y-1][2],f?f[y-1]:0]);let x=null,u=0;for(let p=0;p<l.length;p++){const m=l[p],g=l[Math.max(0,p-1)],W=l[Math.min(l.length-1,p+1)];let M=W[0]-g[0],S=W[1]-g[1],k=W[2]-g[2];const B=Math.hypot(M,S,k)||1;M/=B,S/=B,k/=B;let A=-k,F=M;const U=Math.hypot(A,F);U<1e-4?(A=1,F=0):(A/=U,F/=U);const D=-F*S,K=F*M-A*k,O=A*S;p>0&&(u+=Math.hypot(m[0]-l[p-1][0],m[1]-l[p-1][1],m[2]-l[p-1][2]));const a=[];for(let n=0;n<s;n++){const v=(n+.5)/s*Math.PI*2,d=Math.cos(v),w=Math.sin(v),P=A*d+D*w,E=K*w,R=F*d+O*w;a.push(e.vert(m[0]+P*o,m[1]+E*o,m[2]+R*o,P,E,R,n/s,u,9,9,h,r,-2-o,m[3]))}if(x)for(let n=0;n<s;n++){const v=(n+1)%s;e.tri(x[n],a[n],x[v]),e.tri(x[v],a[n],a[v])}x=a}}const It=.26,At=7.6;function Ot(e,t,o,r={}){const h=r.w??It,s=r.body??0,c=r.pins?r.pins[0]:0,f=r.pins?r.pins[1]:0;tt(e,[t,o],h,At,s,[c,f]);let y=o[0]-t[0],i=o[1]-t[1],l=o[2]-t[2];const x=Math.hypot(y,i,l)||1;y/=x,i/=x,l/=x;let u=y,p=l;const m=Math.hypot(u,p);if(m<.001?(u=1,p=0):(u/=m,p/=m),r.ring!==!1){const g=1.3*h,W=-i*u,M=m<.001?0:m,S=-i*p,k=[t[0]+y*g,t[1]+i*g,t[2]+l*g],B=[],A=[],F=m<.001?1:W,U=m<.001?0:S;for(let D=0;D<=4;D++){const K=D/4*Math.PI*2,O=Math.cos(K)*g,a=Math.sin(K)*g;B.push([k[0]-y*O+F*a,k[1]-i*O+M*a,k[2]-l*O+U*a]),A.push(c)}tt(e,B,.45*h,At,s,A)}r.peg!==!1&&tt(e,[[o[0]-u*.4*h,o[1]-.1,o[2]-p*.4*h],[o[0]+u*1.2*h,o[1]+3*h,o[2]+p*1.2*h]],1.6*h,At,s,[f,f])}const kt={"#E5352B":"#C41F2A","#FFC928":"#F5A800","#1F5FD0":"#1848C4","#2FA85A":"#1F9650","#F0509A":"#E0338A"};function jt(e){const t={};return e.getHSL(t,L.SRGBColorSpace),new L.Color().setHSL(t.h,Math.min(1,t.s*1.15+.03),t.l*.88,L.SRGBColorSpace)}function Vt(e,t={}){const o=(t.palette&&t.palette.length>=7?t.palette:qt).map(m=>String(m).toUpperCase()),r=m=>new L.Color(m),h=["red","yellow","blue","green","white","pink"],s={sky:r(o[6]),tarp:r("#DDE6D0"),web:r("#1B1B1F")},c=[],f=[];h.forEach((m,g)=>{s[m]=r(o[g]),c.push(s[m]),f.push(kt[o[g]]?r(kt[o[g]]):jt(s[m]))}),f[4]=s.white.clone().lerp(s.red,.1);for(let m=0;m<6;m++)m!==4&&o[m]===o[4]&&(f[m]=f[4]);c.push(s.white),f.push(s.white.clone().lerp(s.blue,.12)),c.push(s.web),f.push(s.web),h.forEach((m,g)=>{s[m+"Shade"]=f[g]});const y=(t.sun?new L.Vector3().copy(t.sun):new L.Vector3(.441,.883,.161)).normalize(),i={uTime:{value:0},uSun:{value:y},uWind:{value:new L.Vector2(-.2,.98)},uGust:{value:new L.Vector4(-.2,.98,60,9)},uShadowY:{value:.05},uStream:{value:.9},uStreamK:{value:new L.Vector3(1,1,1)},uClock:{value:0},uGustT:{value:0},uOut:{value:new L.Vector4(1e6,4,180,480)},uLaneB:{value:new L.Vector4(0,1e6,0,1)},uLit:{value:c},uShade:{value:f},uWeb:{value:s.web},uTarp:{value:s.tarp},uSheen:{value:new L.Vector2(.9,.945)},uHaze:{value:new L.Vector4(1,1,1,0)}},l=[];function x(m={}){const g={};m.instanced?g.INSTANCED=1:g.BODIES=1,m.shadow&&(g.SHADOW=1),m.streamer&&(g.STREAMER=1);const W={...i};if(m.streamer&&(W.uStream={value:.9},W.uStreamK={value:new L.Vector3(1,1,1)}),m.instanced)W.uInst={value:new L.Vector4(m.sinkMin??.03,m.rs0??1.4,m.tube?1:0,m.sock?1:0)};else{const S=(k,B,A,F)=>Array.from({length:it},()=>new L.Vector4(k,B,A,F));W.uBP={value:S(0,0,0,1)},W.uBD={value:S(0,1,.5,1)},W.uBX={value:S(1,1,1,0)},W.uBS={value:S(1,0,0,0)},m.share&&(W.uBP=m.share.uniforms.uBP,W.uBD=m.share.uniforms.uBD,W.uBX=m.share.uniforms.uBX,W.uBS=m.share.uniforms.uBS)}const M=new L.ShaderMaterial({uniforms:W,defines:g,vertexShader:Yt,fragmentShader:_t,side:m.streamer?L.DoubleSide:L.FrontSide});return m.shadow&&(M.transparent=!0,M.depthWrite=!1,M.side=L.DoubleSide,M.blending=L.CustomBlending,M.blendEquation=L.AddEquation,M.blendSrc=L.OneMinusDstAlphaFactor,M.blendDst=L.DstAlphaFactor,M.blendSrcAlpha=L.OneFactor,M.blendDstAlpha=L.ZeroFactor,M.polygonOffset=!0,M.polygonOffsetFactor=-2,M.polygonOffsetUnits=-8),l.push(M),M}function u(){return new L.ShaderMaterial({uniforms:{uTarp:i.uTarp,uWeb:i.uWeb,uTime:i.uTime,uGust:i.uGust,uGustT:i.uGustT,uLit:i.uLit,uLaneB:i.uLaneB,uHaze:i.uHaze},vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`uniform vec3 uTarp; uniform vec3 uWeb; uniform float uTime; uniform vec4 uGust; uniform float uGustT; uniform vec3 uLit[8]; uniform vec4 uLaneB; uniform vec4 uHaze; varying vec3 vW;
        float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float stitch(float d, float f){ float hw = max(0.009, 0.3 * f); return 1.0 - smoothstep(hw, hw + f, abs(d - 0.03)); }
        // a printed tint: the cloth c mixed by eye (in display values) into the white cloth wS, just far enough to be a decided pastel
        vec3 pastel(vec3 c, vec3 wS, float target){ vec3 q = pow(max(c, vec3(1e-4)), vec3(0.4545)); float mx = max(q.r, max(q.g, q.b)), mn = min(q.r, min(q.g, q.b));
          float k = clamp(target / max((mx - mn) / max(mx, 1e-3), 0.05), 0.3, 0.92); return pow(mix(wS, q, k), vec3(2.2)); }
        void main(){
          float dist = length(cameraPosition - vW); vec3 lightC = mix(uTarp, vec3(1.0), 0.42);
          float nearF = 1.0 - smoothstep(170.0, 250.0, dist), closeF = 1.0 - smoothstep(35.0, 90.0, dist);
          // panel seams: every 12 m along the course, a cross seam every 24 m (it passes under the lens about once a second)
          float sxs = (fract(vW.x / 12.0) - 0.5) * 12.0, sx = abs(sxs), sz = abs(fract((vW.z - 9.0) / 24.0 + 0.5) - 0.5) * 24.0;
          float fx = max(fwidth(vW.x), 1e-5), fz = max(fwidth(vW.z), 1e-5);
          float crossF = 1.0 - smoothstep(90.0, 190.0, dist);
          float lineM = max(stitch(sx, fx) * nearF, stitch(sz, fz) * nearF * crossF);
          // the long seams are laced as well as stitched: an eyelet every 75 cm either side and a cord zigzagging between them
          float laceF = 1.0 - smoothstep(7.0, 19.0, dist), lz = vW.z / 1.5, tri = abs(fract(lz) - 0.5) * 2.0, fl = max(fx, 0.4 * fz);
          float cord = (1.0 - smoothstep(0.011 + 0.4 * fl, 0.011 + 1.4 * fl, abs(sxs - (tri - 0.5) * 0.44) * 0.86)) * step(sx, 0.23);
          float ez = (fract(lz + (sxs > 0.0 ? 0.5 : 0.0)) - 0.5) * 1.5, er = length(vec2(sx - 0.22, ez));
          float eyelet = 1.0 - smoothstep(0.0, 1.2 * fl, abs(er - 0.05) - 0.02);
          // lane marks: tape sewn down the middle of both avenues and along their edges (continuous, never dashed across the travel)
          float rowx = 13.0 + 25.0 * smoothstep(140.0, 330.0, vW.z), inA = step(-60.0, vW.z) * (1.0 - smoothstep(371.0, 376.0, vW.z));
          vec2 rb = vW.xz - uLaneB.xy; float tb = dot(rb, uLaneB.zw), sb = rb.x * uLaneB.w - rb.y * uLaneB.z, inB = smoothstep(10.0, 14.0, tb) * (1.0 - smoothstep(194.0, 199.0, tb));
          float fpm = max(fx, fz), farM = 1.0 - smoothstep(260.0, 420.0, dist);
          float dMid = min(abs(vW.x) + (1.0 - inA) * 9.0, abs(sb) + (1.0 - inB) * 9.0), dEdge = min(abs(abs(vW.x) - (rowx - 5.6)) + (1.0 - inA) * 9.0, abs(abs(sb) - 8.4) + (1.0 - inB) * 9.0);
          float tapeMid = (1.0 - smoothstep(0.2 - fpm, 0.2 + fpm, dMid)) * farM, tapeEdge = (1.0 - smoothstep(0.26 - fpm, 0.26 + fpm, dEdge)) * farM;
          float tapeHem = max(stitch(0.2 - dMid + 0.03, fpm), stitch(0.26 - dEdge + 0.03, fpm)) * nearF * (1.0 - smoothstep(30.0, 70.0, dist));
          float sd = min(sx, sz), along = sx < sz ? vW.z : vW.x;
          float tick = smoothstep(0.5, 0.8, sin(along * 8.0 + 1.3 * sin(along * 1.9))) * smoothstep(0.07, 0.1, sd) * (1.0 - smoothstep(0.28, 0.5, sd)) * closeF;
          // sewn-on patches: a lighter square with its own hem
          vec2 cs = vec2(31.0, 43.0), cell = floor(vW.xz / cs); float hh = h21(cell);
          vec2 pc = (cell + 0.3 + 0.4 * vec2(h21(cell + 3.1), h21(cell + 7.7))) * cs, hs = vec2(0.5 + 0.9 * h21(cell + 1.3), 0.5 + 0.8 * h21(cell + 5.9));
          vec2 pd = abs(vW.xz - pc) - hs; float pdist = max(pd.x, pd.y), fp = max(fx, fz);
          float isP = step(hh, 0.22) * (1.0 - smoothstep(150.0, 260.0, dist));
          // two patches sewn into the lane where the flight comes in, each in a cloth colour
          vec2 e1 = abs(vW.xz - vec2(-3.3, 13.5)) - vec2(1.15, 0.85), e2 = abs(vW.xz - vec2(3.9, 30.5)) - vec2(0.9, 1.25);
          float d1 = max(e1.x, e1.y), d2 = max(e2.x, e2.y);
          if (min(d1, d2) < 0.5) { pdist = min(d1, d2); isP = 1.0; hh = 0.0; }
          float ptch = isP * (1.0 - smoothstep(-fp, fp, pdist));
          float hem = isP * stitch(-pdist - 0.06, fp) * nearF;
          // the wind on a taut sheet: ripples a hand deep ride each gust front
          vec2 wd = uGust.xy / max(length(uGust.xy), 1e-4); float aw = dot(vW.xz, wd), cw = dot(vW.xz, vec2(-wd.y, wd.x));
          float tt = mod(uGustT - aw / max(uGust.z, 1.0), max(uGust.w, 1.0));
          float g = smoothstep(0.0, 0.2, tt) * (1.0 - smoothstep(0.3, 1.5, tt));
          float rip = sin(aw * 1.1 - uTime * 5.0 + 2.2 * sin(cw * 0.21 + aw * 0.07) + 1.5 * sin(cw * 0.047));
          float bandW = smoothstep(0.55, 0.9, rip) * g * (1.0 - smoothstep(120.0, 420.0, dist));
          float calmW = smoothstep(0.93, 0.99, sin(aw * 0.33 - uTime * 0.8 + 3.0 * sin(cw * 0.05))) * closeF * 0.6;
          vec3 deep = uTarp * vec3(0.9, 0.93, 0.9);
          // a patch is a square of one of the cloths (the wrong colour), or of new pale tarpaulin
          float pk = h21(cell + 9.4); int pi = pk < 0.2 ? 0 : (pk < 0.4 ? 1 : (pk < 0.6 ? 3 : (pk < 0.8 ? 5 : 4)));
          vec3 pcol = hh < 0.09 ? uLit[pi] : lightC;
          if (d1 < 0.5) pcol = uLit[5]; else if (d2 < 0.5) pcol = uLit[3];
          // PRINT (the fairground's floor plan, painted on the sheet): a runner down each avenue with lane lines and one chevron every
          // 32 m, door paths and cross-street paths, alleys of the far quarter, pitch rings and two targets on the plaza. Everything
          // long runs along the travel; nothing alternates across it.
          float prF = 1.0 - smoothstep(520.0, 900.0, dist), a1 = fpm;
          float runA = (1.0 - smoothstep(6.4 - a1, 6.4 + a1, abs(vW.x))) * inA, runB = (1.0 - smoothstep(7.0 - a1, 7.0 + a1, abs(sb))) * inB;
          float laneA = (1.0 - smoothstep(0.13 - a1, 0.13 + a1, min(abs(abs(vW.x) - 3.2), abs(abs(vW.x) - 6.4)))) * inA;
          float laneB = (1.0 - smoothstep(0.13 - a1, 0.13 + a1, min(abs(abs(sb) - 3.5), abs(abs(sb) - 7.0)))) * inB;
          vec2 cvA = vec2(abs(vW.x) - 4.8, (fract(vW.z / 32.0) - 0.5) * 32.0), cvB = vec2(abs(sb) - 5.25, (fract(tb / 32.0 + 0.3) - 0.5) * 32.0);
          float chevA = (1.0 - smoothstep(0.3 - a1, 0.3 + a1, abs(cvA.y + 0.9 * abs(cvA.x)) * 0.74)) * step(abs(cvA.x), 1.15) * inA * step(40.0, vW.z);
          float chevB = (1.0 - smoothstep(0.3 - a1, 0.3 + a1, abs(cvB.y + 0.9 * abs(cvB.x)) * 0.74)) * step(abs(cvB.x), 1.3) * inB;
          // where the flight comes in: two rows of chevrons, one in each of the four lanes, 8 and 36 m in (the second beyond the lane numbers: whole in the first still, not cut by its bottom edge)
          float lxE = abs(abs(abs(vW.x) - 3.2) - 1.6), zE = min(abs(vW.z - 8.0 + 0.9 * lxE), abs(vW.z - 36.0 + 0.9 * lxE));
          float chevE = (1.0 - smoothstep(0.42 - a1, 0.42 + a1, zE * 0.74)) * step(lxE, 1.15) * step(abs(vW.x), 6.4) * inA;
          // door paths (a house every 14 m) and the cross streets every 72 m, outside the lane's edge tape
          float outA = smoothstep(rowx - 5.3, rowx - 4.9, abs(vW.x)) * inA;
          float doorA = (1.0 - smoothstep(0.75 - a1, 0.75 + a1, abs(fract((vW.z - 13.0) / 14.0 + 0.5) - 0.5) * 14.0)) * outA * (1.0 - step(rowx + 8.0, abs(vW.x))) * (1.0 - smoothstep(200.0, 215.0, vW.z));
          float strD = abs(fract((vW.z - 66.0) / 72.0 + 0.5) - 0.5) * 72.0;
          float strA = (1.0 - smoothstep(3.0 - a1, 3.0 + a1, strD)) * smoothstep(rowx - 5.3, rowx - 4.9, abs(vW.x)) * step(-10.0, vW.z) * (1.0 - step(380.0, vW.z)) * (1.0 - smoothstep(150.0, 170.0, abs(vW.x)));
          float strL = (1.0 - smoothstep(0.12 - a1, 0.12 + a1, abs(strD - 3.0))) * step(0.5, strA + 0.5 * step(strD, 3.3)) * smoothstep(rowx - 5.3, rowx - 4.9, abs(vW.x)) * step(-10.0, vW.z) * (1.0 - step(380.0, vW.z)) * (1.0 - smoothstep(150.0, 170.0, abs(vW.x)));
          // the far quarter: a path down every cross alley and along the two back lanes of each side
          float alD = abs(mod(tb - 63.5 + 40.5, 81.0) - 40.5), inQ = step(10.0, tb) * (1.0 - step(300.0, tb)) * step(abs(sb), 128.0) * step(8.6, abs(sb));
          float lnD = min(abs(abs(sb) - 55.25), abs(abs(sb) - 92.25));
          float pathQ = max(1.0 - smoothstep(3.0 - a1, 3.0 + a1, alD), 1.0 - smoothstep(2.4 - a1, 2.4 + a1, lnD)) * inQ;
          float pathQL = (1.0 - smoothstep(0.14 - a1, 0.14 + a1, min(alD, lnD))) * inQ;
          // the plaza before the keep: a centre circle and a box (pitch lines), and a target of five rings either side
          vec2 pz = vW.xz - vec2(${Pt.x.toFixed(1)}, ${Pt.z.toFixed(1)}); float rc = length(pz);
          float inP = step(205.0, vW.z) * (1.0 - step(388.0, vW.z));
          float ringP = (1.0 - smoothstep(0.2 - a1, 0.2 + a1, abs(rc - ${Pt.ring.toFixed(1)}))) * inP;
          vec2 bx = abs(pz) - vec2(27.0, 62.0); float boxP = (1.0 - smoothstep(0.2 - a1, 0.2 + a1, abs(max(bx.x, bx.y)))) * inP * step(6.4, abs(vW.x));
          float rt = length(vec2(abs(vW.x) - 23.0, vW.z - 326.0)), tgt = (1.0 - smoothstep(7.5 - a1, 7.5 + a1, rt)) * inP;
          int ti = rt < 1.5 ? 0 : (rt < 3.0 ? 4 : (rt < 4.5 ? 1 : (rt < 6.0 ? 4 : 5)));
          vec3 col = mix(uTarp, lightC, max(bandW, calmW) * 0.8);
          vec3 whiteP = mix(uTarp, vec3(1.0), 0.85);
          // the near runner: four lanes, each a clean pale tint of one cloth (lemon, rose, mint, white), long bands along the travel;
          // the far runner one clean lemon. Tints are mixed from the white cloth, never from the tarpaulin (that made putty).
          vec3 wS = pow(max(uLit[4], vec3(1e-4)), vec3(0.4545));
          vec3 laneC = vW.x > 3.2 ? pastel(uLit[1], wS, 0.38) : (vW.x > 0.0 ? pastel(uLit[5], wS, 0.38) : (vW.x > -3.2 ? pastel(uLit[3], wS, 0.38) : uLit[4]));
          col = mix(col, laneC, runA * prF);
          col = mix(col, pastel(uLit[1], wS, 0.3), runB * prF);
          col = mix(col, mix(uTarp, uLit[1], 0.34), max(doorA, strA) * prF);
          col = mix(col, mix(uTarp, uLit[3], 0.34), pathQ * prF);
          col = mix(col, uLit[ti], tgt * prF);
          col = mix(col, whiteP, max(max(max(laneA, laneB), max(max(chevA, chevE), chevB)), max(max(ringP, boxP), max(strL, pathQL))) * prF * farM);
          col = mix(col, mix(uTarp, vec3(1.0), 0.8), tapeEdge);
          col = mix(col, uLit[1], tapeMid);
          col = mix(col, pcol, ptch);
          col = mix(col, deep, tick * 0.8);
          col = mix(col, mix(uTarp, uWeb, 0.34), max(max(lineM, hem), tapeHem));
          col = mix(col, mix(uTarp, uWeb, 0.42), max(cord * 0.8, eyelet) * laceF * (1.0 - ptch));
          col = mix(col, uHaze.rgb, uHaze.w * smoothstep(150.0, 900.0, dist));      // THE AIR (the skin's law)
          gl_FragColor = vec4(col, ${(1-Kt).toFixed(2)}); }`})}return{pal:s,CLOTH:I,uniforms:i,skin:x,ground:u,web:()=>new L.MeshBasicMaterial({color:s.web,toneMapped:!1}),quilt:Y,quiltY:bt,ribbon:tt,hose:St,strap:Ot,STRAP:It,tube:lt,pillow:gt,ball:Et,airDancer:Nt,armTube:Dt,batch:Zt,MAXB:it,post:{flat:1,bloom:{strength:0},grade:{saturation:1,contrast:1,vignette:0,grain:0}},update(m,g,W){i.uTime.value=g,i.uClock.value=g,i.uGustT.value=g}}}const z={W:75,D:60,T:14,WALLH:45,TURH:62,TURR:10,CAPH:18,TOWX:30,TOWZ:8,TOWR:8,TOWH:100,TOWCAP:20,GATEW:10,GATEH:16,COURT:14,MARK:15},T={STATIC:0,FRONT:1,LINTEL:2,BACK:3,LEFT:4,RIGHT:5,TUR:6,TOWER:10,COURT:11,SOFTB:12,SLEEVE:13,N:14};async function rt(e,t,o,r){const{x0:h,z0:s,x1:c,z1:f,H:y,body:i}=t,l=t.T??z.T,x=t.y0??0,u=Math.hypot(c-h,f-s),p=(c-h)/u,m=(f-s)/u,g=m,W=-p,M=l/2,S=y-M,k=Math.PI*M,B=2*S+k,A=Math.max(1,Math.round(S/12.5)),F=[];for(let a=0;a<=A;a++)F.push(S*a/A/B);F.push((S+k/2)/B);for(let a=0;a<=A;a++)F.push((S+k+S*a/A)/B);const U=(a,n)=>{const v=a*B;if(v<S)n[0]=M*(1.1-.1*v/S),n[1]=v;else if(v<S+k){const d=(v-S)/M;n[0]=M*Math.cos(d),n[1]=S+M*Math.sin(d)}else{const d=S-(v-S-k);n[0]=-M*(1.1-.1*d/S),n[1]=d}},D=[0,0],K=Math.max(1,Math.round(u/6)),O=t.order??(()=>-1);await bt(e,{nu:K,nv:F.length-1,vEdges:F,su:o,sv:o,bulge:t.bulge??.75,body:i,cloth:t.cloth??I.RED,order:a=>O((a+.5)/K),orderAt:a=>O(a),P:(a,n,v)=>{U(n,D);const d=h+(c-h)*a,w=s+(f-s)*a;v[0]=d+g*D[0],v[1]=x+D[1],v[2]=w+W*D[0]}},r);for(let a=0;a<2;a++){if(t.caps&&!t.caps[a])continue;const n=a?c:h,v=a?f:s;Y(e,{nu:1,nv:F.length-1,vEdges:F,su:2,sv:o,bulge:.9,tuft:!0,body:i,cloth:t.cloth??I.RED,flip:a===1,order:O(a),P:(d,w,P)=>{U(w,D),P[0]=n+g*D[0]*d,P[1]=x+D[1]*(.5+.5*d)+(1-d)*S*.25,P[2]=v+W*D[0]*d}})}if((t.bat??-1)>=0)for(let a=0;a<K;a++){if((a+(t.batOdd?1:0))%2)continue;const n=(a+.5)/K;t.skipBat&&t.skipBat(a,K)||gt(e,{x:h+(c-h)*n,y:x+y-2.2,z:s+(f-s)*n,ax:p,az:m,hw:2.75,hd:4.9,h:7.6,body:i,cloth:t.bat,order:O(n),sub:o})}}function gt(e,t){const{x:o,y:r,z:h,ax:s,az:c,hw:f,hd:y,h:i}=t,l=c,x=-s;Y(e,{nu:4,nv:1,su:t.sub,sv:t.sub+2,tuft:!1,bulge:t.bulge??.5,body:t.body,cloth:t.cloth,order:t.order??-1,P:(u,p,m)=>{const g=Math.PI*2*u+Math.PI/4,W=Math.cos(g),M=Math.sin(g),S=Math.pow(Math.max(0,Math.sin(Math.PI*(.13+.87*p))),.5),k=.8,B=Math.sign(W)*Math.pow(Math.abs(W),k)*1.12,A=Math.sign(M)*Math.pow(Math.abs(M),k)*1.12,F=B*f*S,U=A*y*S;m[0]=o+s*F+l*U,m[1]=r+i*p,m[2]=h+c*F+x*U}})}function lt(e,t){Y(e,Rt(t))}function Rt(e){const{x:t,z:o,ys:r,rad:h}=e,s=r[0],c=r[r.length-1];return{nu:e.gores??12,nv:r.length-1,vEdges:r.map(f=>(f-s)/(c-s)),su:e.sub??4,sv:e.sv??e.sub??4,bulge:e.bulge??.6,tuft:e.tuft,tuftK:e.tuftK,body:e.body,cloth:e.cloth,order:e.order??-1,flip:e.flip,P:(f,y,i)=>{const l=s+(c-s)*y,x=h(l),u=Math.PI*2*f+(e.twist??0);i[0]=t+x*Math.cos(u),i[1]=l,i[2]=o+x*Math.sin(u)}}}function $t(e,t,o,r,h){const s=z.TURH,c=z.TURR,f=i=>c*(1.06-.06*i/s)+1.6*Math.exp(-((i-(s-4))*(i-(s-4)))/14);lt(e,{x:t,z:o,ys:[0,11,22,33,44,54,s-8,s],rad:f,body:r,cloth:I.BLUE,sub:h,bulge:.7});const y=i=>{const l=(i-s)/z.CAPH;return Math.max(.25,(c+3)*(1-l)*(1+.18*Math.sin(Math.PI*l)))};lt(e,{x:t,z:o,ys:[s,s+z.CAPH*.5,s+z.CAPH*.98],rad:y,body:r,cloth:I.PINK,sub:h,bulge:.5,tuft:!1}),Y(e,{nu:12,nv:1,su:h,sv:1,bulge:.3,tuft:!1,body:r,cloth:I.PINK,P:(i,l,x)=>{const u=Math.PI*2*i,p=c*.7+(c+3-c*.7)*l;x[0]=t+p*Math.cos(u),x[1]=s+.02,x[2]=o+p*Math.sin(u)}}),Et(e,t,s+z.CAPH+.6,o,1.7,r,I.YELLOW,h)}function Et(e,t,o,r,h,s,c,f){Y(e,{nu:6,nv:1,su:Math.max(2,f-1),sv:6,bulge:.12*h,tuft:!1,body:s,cloth:c,P:(y,i,l)=>{const x=Math.PI*2*y,u=Math.PI*(.03+.94*i),p=Math.sin(u);l[0]=t+h*p*Math.cos(x),l[1]=o-h*Math.cos(u),l[2]=r+h*p*Math.sin(x)}})}async function Ft(e,t,o,r,h){const{W:s,D:c,T:f,WALLH:y}=z,i=c-f/2,l=s-f/2,x=z.GATEW,u=I.YELLOW;await rt(e,{x0:l,z0:i,x1:x,z1:i,H:y,body:T.FRONT,bat:u,order:a=>a,caps:[0,1]},o,r),await rt(e,{x0:-x,z0:i,x1:-l,z1:i,H:y,body:T.FRONT,bat:u,order:a=>1-a,caps:[1,0],batOdd:1},o,r);{const a=Math.round((l-x)/6),n=(l-x)/a,v=t.patchPanel%a,d=t.patchSide*(l-n*(v+.5)),w=19,P=i+f/2*(1.1-.1*w/(y-f/2))+.75+.1;Y(e,{nu:1,nv:1,su:o,sv:o,bulge:.22,body:T.FRONT,cloth:t.patchCloth,order:1-(v+.5)/a,P:(E,R,C)=>{const q=(E-.5)*2,N=(R-.5)*2;C[0]=d-q*2.1,C[1]=w+N*2.1,C[2]=P-.6*(q*q+N*N*.3)}})}await r.yield();const p=(z.GATEH+y)/2,m=(y-z.GATEH)/2;Y(e,{nu:3,nv:8,su:o,sv:o,bulge:.7,body:T.LINTEL,cloth:(a,n)=>(n===1||n===2)&&a===1?t.crest:I.RED,order:1,P:(a,n,v)=>{const d=Math.PI*2*n-Math.PI/2,w=Math.cos(d),P=Math.sin(d);v[0]=x+.5-(2*x+1)*a,v[1]=p+m*Math.sign(P)*Math.pow(Math.abs(P),.6),v[2]=i+f/2*1.04*Math.sign(w)*Math.pow(Math.abs(w),.6)}}),gt(e,{x:0,y:y-2.2,z:i,ax:-1,az:0,hw:3.4,hd:4.8,h:10.5,body:T.LINTEL,cloth:t.crest,order:1,sub:o}),await rt(e,{x0:-l,z0:-i,x1:l,z1:-i,H:y,body:T.BACK,bat:u,order:a=>Math.abs(a-.5)*1.6,caps:[0,0],skipBat:(a,n)=>a===t.softPanel(n)},o,r),await r.yield(),await rt(e,{x0:-l,z0:i-f/2,x1:-l,z1:-i+f/2,H:y,body:T.LEFT,bat:u,order:a=>a,caps:[0,0]},o,r),await rt(e,{x0:l,z0:-i+f/2,x1:l,z1:i-f/2,H:y,body:T.RIGHT,bat:u,order:a=>1-a,caps:[0,0]},o,r),await r.yield();{const a=Math.round(2*l/6),n=(t.softPanel(a)+.5)/a;t.softX=-l+2*l*n,gt(e,{x:t.softX,y:y-2.2,z:-i,ax:1,az:0,hw:2.75,hd:4.9,h:7.6,body:T.SOFTB,cloth:u,sub:o})}const g=[[l,i],[-l,i],[l,-i],[-l,-i]];for(let a=0;a<4;a++)$t(e,g[a][0],g[a][1],T.TUR+a,o),await r.yield();const W=z.TOWH,M=z.TOWR,S=z.TOWCAP,k=[];for(let a=0;a<=W+.01;a+=W/10)k.push(a);await bt(e,Rt({x:z.TOWX,z:z.TOWZ,ys:k,rad:a=>M*(1.05-.07*a/W)+1.3*Math.exp(-((a-W+3)*(a-W+3))/10),gores:10,sub:o+2,body:T.TOWER,bulge:(a,n)=>n===t.band?1:.65,cloth:(a,n)=>n===t.band?I.WHITE_ON_BLUE:I.BLUE,twist:t.twist}),r,2);const B=t.cap==="onion"?a=>{const n=(a-W)/S;return Math.max(.3,M*1.5*Math.pow(Math.sin(Math.PI*(.16+.84*n)),.8)*(1-.3*n))}:t.cap==="crown"?a=>{const n=(a-W)/S;return Math.max(.3,n<.4?M*(1.15+.75*n/.4):M*1.2*(1-(n-.4)/.6))}:a=>{const n=(a-W)/S;return Math.max(.3,(M+3)*(1-n)*(1+.2*Math.sin(Math.PI*n)))};lt(e,{x:z.TOWX,z:z.TOWZ,ys:[W,W+S*.2,W+S*.4,W+S*.7,W+S*.985],rad:B,gores:10,sub:o+2,sv:4,body:T.TOWER,cloth:I.PINK,bulge:.45,tuft:!1,twist:t.twist}),Y(e,{nu:10,nv:1,su:o,sv:1,bulge:.25,tuft:!1,body:T.TOWER,cloth:I.PINK,P:(a,n,v)=>{const d=Math.PI*2*a+t.twist,w=M*.6+(B(W)-M*.6)*n;v[0]=z.TOWX+w*Math.cos(d),v[1]=W+.02,v[2]=z.TOWZ+w*Math.sin(d)}}),Et(e,z.TOWX,W+S+.8,z.TOWZ,2,T.TOWER,I.YELLOW,o),await r.yield();{const a=(d,w)=>{const P=((d-t.twist)/(Math.PI*2)%1+1)%1,E=P*10%1,R=2*(w/(W/10)%1)-1;return M*(1.05-.07*w/W)+(Math.floor(w/(W/10))===t.band?1:.65)*Math.sin(Math.PI*E)*(1-R*R*R*R)},n=(d,w,P)=>{const E=a(d,w)+P;return[z.TOWX+E*Math.cos(d),w,z.TOWZ+E*Math.sin(d)]},v=(d,w,P,E)=>{const R=P/(M+.6);if(Y(e,{nu:1,nv:1,su:o,sv:o,bulge:.1,body:T.TOWER,cloth:E,P:(b,H,G)=>{const X=n(d+(b-.5)*2*R,w+(H-.5)*2*P,.07);G[0]=X[0],G[1]=X[1],G[2]=X[2]}}),!h)return;const C=[],q=37,N=P+.07;for(let b=0;b<4;b++)for(let H=0;H<q;H++){const G=H/q*2-1,X=H%2?.055:-.055,_=b===0?G:b===1?1+X/N:b===2?-G:-1-X/N,j=b===0?-1-X/N:b===1?G:b===2?1+X/N:-G;C.push(n(d+_*N/(M+.6),w+j*N,.12))}C.push(C[0]),tt(e,C,.04,I.WEB,T.TOWER)};if(v(2.5,56.3,1.25,t.towerPatch??I.YELLOW),v(3.45,66.5,.95,I.WHITE),h)for(const[d,w]of[[2.78,62.6],[2.3,51.5],[3.1,53.5],[3.25,71.5],[2.05,67]]){const P=[];for(let C=0;C<=6;C++)P.push(n(d,w+.8-C*.27,.06));tt(e,P,.24,I.WEB,T.TOWER);const E=[];for(let C=0;C<=6;C++){const q=Math.PI*C/6;E.push(n(d,w+.2*Math.cos(q),.06+.2*Math.sin(q)))}tt(e,E,.2,I.WEB,T.TOWER);const R=[];for(let C=0;C<=10;C++){const q=Math.PI*2*C/10;R.push(n(d,w-.24+.24*Math.cos(q),.3+.2*Math.sin(q)))}tt(e,R,.08,I.WEB,T.TOWER),tt(e,[n(d,w-.46,.3),n(d+.012,w-1,.16),n(d+.02,w-1.7,.1),n(d+.016,w-2.5,.08)],.16,I.WEB,T.TOWER)}if(h){for(let R=1.66;R<4.9;R+=.26){if(Math.abs(R-2.3)<.14||Math.abs(R-3.1)<.15)continue;const C=.75/(M+.6);Y(e,{nu:1,nv:2,vEdges:[0,.6,1],su:2,sv:2,bulge:.1,body:T.TOWER,cloth:(q,N)=>N?I.YELLOW:I.PINK,P:(q,N,b)=>{const H=N>.6?Math.sqrt(Math.max(0,1-(N-.6)/.4*((N-.6)/.4))):1,G=n(R+(q-.5)*2*C*(.3+.7*H),51.2+2.7*N,.09);b[0]=G[0],b[1]=G[1],b[2]=G[2]}})}for(const R of[50,60])Y(e,{nu:20,nv:1,su:2,sv:3,bulge:0,tuft:!1,body:T.TOWER,cloth:C=>C%2?I.PINK:I.YELLOW,P:(C,q,N)=>{const b=Math.PI*2*C+t.twist,H=M*(1.05-.07*R/W)+.12+.5*Math.sin(Math.PI*q);N[0]=z.TOWX+H*Math.cos(b),N[1]=R-.75+1.5*q,N[2]=z.TOWZ+H*Math.sin(b)}});const d={4:[[.78,0],[.78,2],[0,.7],[1,.7]],7:[[0,2],[1,2],[.38,0]],1:[[.5,0],[.5,2],[.12,1.55]],2:[[0,1.6],[.25,2],[.75,2],[1,1.6],[1,1.25],[0,0],[1,0]]},w=t.number??"47",P=1.5,E=2.9+.5*(w.length*1.45-.45)*P/(M+.6);for(let R=0;R<w.length;R++){const C=d[w[R]]||d[7],q=.2;for(let N=0;N<C.length-1;N++){const b=C[N][0],H=C[N][1],G=C[N+1][0],X=C[N+1][1],_=Math.hypot(G-b,X-H)||1,j=(G-b)/_,Z=(X-H)/_;Y(e,{nu:1,nv:1,su:4,sv:Math.max(2,Math.round(_*2.5)),tuft:!1,bulge:.24,body:T.TOWER,cloth:I.BLUE,P:(V,$,Q)=>{const J=(V-.5)*2*q,ot=-q+(_+2*q)*$,ct=b+j*ot-Z*J,ht=H+Z*ot+j*J,at=n(E-(R*1.45+ct)*P/(M+.6),54.7+ht*P,.1);Q[0]=at[0],Q[1]=at[1],Q[2]=at[2]}})}}}}const A=Math.max(2,o-1);if(await bt(e,{nu:20,nv:16,su:A,sv:A,bulge:.8,body:T.COURT,cloth:I.YELLOW,P:(a,n,v)=>{v[0]=-(l-3)+2*(l-3)*a,v[1]=z.COURT,v[2]=-(i-3)+2*(i-3)*n}},r),h){const a=z.MARK,n=z.COURT+.75;Y(e,{nu:12,nv:1,su:3,sv:3,bulge:1,body:T.COURT,cloth:I.WHITE,flip:!0,P:(v,d,w)=>{const P=Math.PI*2*v,E=a*(.72+.28*d);w[0]=E*Math.cos(P),w[1]=n,w[2]=E*Math.sin(P)}}),Y(e,{nu:6,nv:1,su:3,sv:3,bulge:1.4,body:T.COURT,cloth:I.RED,flip:!0,P:(v,d,w)=>{const P=Math.PI*2*v,E=a*(.03+.42*d);w[0]=E*Math.cos(P),w[1]=n+.1,w[2]=E*Math.sin(P)}})}await r.yield();const F=t.fanX,U=5.6,D=5.2,K=c+10,O=c+17;if(Y(e,{nu:12,nv:1,su:2,sv:1,bulge:0,tuft:!1,body:T.STATIC,cloth:I.WEB,P:(a,n,v)=>{const d=Math.PI*2*a;v[0]=F+D*Math.cos(d),v[1]=U+D*Math.sin(d),v[2]=O-(O-K)*n}}),Y(e,{nu:12,nv:1,su:2,sv:1,bulge:0,tuft:!1,body:T.STATIC,cloth:I.WEB,P:(a,n,v)=>{const d=Math.PI*2*a;v[0]=F+D*n*Math.cos(d),v[1]=U+D*n*Math.sin(d),v[2]=O-1.2}}),Y(e,{nu:8,nv:2,su:o,sv:o,bulge:.5,body:T.SLEEVE,cloth:I.RED,P:(a,n,v)=>{const d=Math.PI*2*a,w=D*.86+1.4*n;v[0]=F+w*Math.cos(d),v[1]=Math.max(.1,U+w*Math.sin(d)+.8*n),v[2]=K+.3-(K+.3-(c-2))*n}}),h){for(const[n,v,d]of[[O-.2,D+.5,1.25],[K+.4,D+.3,.9]])Y(e,{nu:12,nv:3,su:2,sv:2,bulge:.3,tuft:!1,body:T.STATIC,cloth:u,flip:!0,P:(w,P,E)=>{const R=Math.PI*2*w,C=Math.PI*2*P,q=v+d*Math.cos(C);E[0]=F+q*Math.cos(R),E[1]=Math.max(.12,U+q*Math.sin(R)),E[2]=n+d*Math.sin(C)}});for(const n of[D*.36,D*.7]){const v=[];for(let d=0;d<=20;d++){const w=d/20*Math.PI*2;v.push([F+n*Math.cos(w),U+n*Math.sin(w),O+.35])}St(e,v,.16,I.WEB,T.STATIC,4)}for(let n=0;n<4;n++){const v=(n+.5)/4*Math.PI*2,d=Math.cos(v),w=Math.sin(v);St(e,[[F+.5*d,U+.5*w,O+.35],[F+D*d,U+D*w,O+.35]],.16,I.WEB,T.STATIC,4)}Y(e,{nu:8,nv:3,su:2,sv:2,bulge:.35,tuft:!1,body:T.SLEEVE,cloth:u,flip:!0,P:(n,v,d)=>{const w=Math.PI*2*n,P=Math.PI*2*v,E=D*.86+1.5+1.1*Math.cos(P);d[0]=F+E*Math.cos(w),d[1]=Math.max(.12,U+.6+E*Math.sin(w)),d[2]=c+1.2+1.1*Math.sin(P)}});const a=(n,v,d,w,P,E)=>Ot(e,[n,v,d],[n+w*17,.15,d+P*17],{body:E,pins:[0,1]});for(let n=-l+15;n<=l-15;n+=18)Math.abs(n)>x+6&&Math.abs(n-F)>9&&a(n,33,i+f/2+.6,0,1,T.FRONT),a(n,33,-i-f/2-.6,0,-1,T.BACK);for(let n=-i+17;n<=i-17;n+=18)a(-l-f/2-.6,33,n,-1,0,T.LEFT),a(l+f/2+.6,33,n,1,0,T.RIGHT);tt(e,[[F-4,.3,K+1],[F-4,.3,O-1]],1.2,I.WEB,T.STATIC),tt(e,[[F+4,.3,K+1],[F+4,.3,O-1]],1.2,I.WEB,T.STATIC)}}function Qt(e){const{W:t,D:o,T:r,WALLH:h}=z,s=o-r/2,c=t-r/2,f=20/45,y=[],i=(u,p,m,g)=>{y[u]={bp:p,bd:m,bx:g}};i(T.STATIC,[0,0,0,1],[0,1,.5,1],[0,0,1,0]),i(T.FRONT,[0,0,s,h+6],[0,1,.5,f],[0,1,1.22,.13]),i(T.LINTEL,[0,-27.5,s,78.5],[0,1,.5,.655],[0,1,1.15,.31]),i(T.BACK,[0,0,-s,h+6],[0,-1,.5,f],[0,1,1.22,.47]),i(T.LEFT,[-c,0,0,h+6],[-1,0,.5,f],[1,0,1.22,.59]),i(T.RIGHT,[c,0,0,h+6],[1,0,.5,f],[1,0,1.22,.71]);const l=[[c,s],[-c,s],[c,-s],[-c,-s]];for(let u=0;u<4;u++){const p=Math.hypot(l[u][0]*1.3,l[u][1]);i(T.TUR+u,[l[u][0],0,l[u][1],z.TURH+z.CAPH],[l[u][0]*1.3/p,l[u][1]/p,.45,.88],[1,1,.5,.2+u*.17])}const x=Math.hypot(e.foldX,1);return i(T.TOWER,[z.TOWX,0,z.TOWZ,z.TOWH+z.TOWCAP],[e.foldX/x,1/x,.33,.95],[1,1,.55,.83]),i(T.COURT,[0,0,0,z.COURT],[0,1,.5,.4],[0,0,1,.37]),i(T.SOFTB,[e.softX,h-2.2,-s,8.2],[e.softDir,0,.5,.55],[1,1,.75,.91]),i(T.SLEEVE,[e.fanX,5.6,o+4,8],[0,1,.5,.45],[1,0,.45,.66]),y}const et=Ut;function Bt(e,t,o){return e<=0?1:Math.exp(-t*e)*Math.cos(o*e)}const Ht=[12.8,13.7,14.6,15.5],Jt=[23.5,24.2,27,28],st=(e,t,o,r,h,s)=>{const c=e[t]||(e[t]=[0,0,0,0]);c[0]=o,c[1]=r,c[2]=h,c[3]=s},yt=(e,t,o,r,h)=>1-et(t,o,e)*(1-et(r,h,e)),te=(e,t)=>.05*(e>t?Math.exp(-(e-t)*2.2)*Math.sin((e-t)*7):0);function Ct(e,t,o,r={}){r.fan=1,r.stream=.9,r.softY=1,r.fan=1-et(12.2,13.6,e)+et(18,19.6,e)*(1+.35*(1-et(19.6,22,e)));const h=1-et(13,18,e)+(e>18.6?nt((e-18.6)/4.4,0,1):0);st(t,T.STATIC,1,0,0,0),st(t,T.FRONT,Math.min(h,1)+Math.max(0,te(e,23)),0,0,0),st(t,T.LINTEL,t[T.FRONT][0],0,0,0),st(t,T.LEFT,yt(e,13.4,18.2,21,25),0,0,0),st(t,T.RIGHT,yt(e,13.6,18.4,21.4,25.4),0,0,0),st(t,T.BACK,yt(e,13.9,18.6,24,27.4),0,0,0),st(t,T.COURT,yt(e,13.5,18,20,24),0,0,0),st(t,T.SLEEVE,nt(r.fan,.12,1.08),0,0,0);for(let p=0;p<4;p++){const m=et(Ht[p],Ht[p]+2.4,e),g=e-Jt[p],W=g>0?1-Bt(g,3.2,7):0,M=m*(1-W);st(t,T.TUR+p,1-.55*nt(M,0,1)+(g>0?.06*Math.exp(-g*2)*Math.sin(g*6):0),.6*M,o.wilt[p]*M,1*nt(M,0,1))}const s=et(12,14.8,e),c=et(19,23,e),f=e-23.45;let y=o.fold*s*(1-.36*c)+.05*s*Math.sin(e*1.3)*(1-c),i=1.15*et(12.6,15.2,e)*(1+.15*c),l=1-.5*et(12.3,15,e),x=.05*s;if(f>0){const p=Bt(f,2.3,4.6);y*=p,i*=Math.max(0,1-f/.5),x*=p,l=l+(1-l)*et(0,.6,f)+.06*Math.exp(-f*2)*Math.sin(f*6)}st(t,T.TOWER,l,y,x,i),r.stream=.9-.6*s*(f>0?Math.max(0,1-f/.8):1);const u=nt((t[T.BACK][0]-o.softOrder*.6)/.4,0,1);return r.softY=Gt(20/45,1,u),st(t,T.SOFTB,.5+.1*Math.sin(e*.9)-.3*(1-u),0,.5+.12*Math.sin(e*.7),.5),r}function Dt(e,t,o={}){const r=o.r??.74,h=8.3,s=e.count,c=o.gores??5,f=o.su??3;Y(e,{nu:c,nv:1,su:f,sv:o.sv??8,bulge:o.bulge??.13,tuft:!1,cloth:0,bar1:1.15,P:(y,i,l)=>{const x=Math.PI*2*y,u=r*(1-.28*i);l[0]=t*(.8+h*i),l[1]=16.5+1.2*i+u*Math.cos(x)*t,l[2]=u*Math.sin(x)}}),Y(e,{nu:c,nv:1,su:f,sv:o.tip??3,bulge:(o.bulge??.13)*.5,tuft:!1,cloth:0,sheen:!1,P:(y,i,l)=>{const x=Math.PI*2*y,u=i*Math.PI*.5,p=r*.72*Math.cos(u*.98);l[0]=t*(.8+h+.75*Math.sin(u)),l[1]=17.7+p*Math.cos(x)*t,l[2]=p*Math.sin(x)}}),e.pinRange(s,e.count,y=>t*Math.max(0,Math.abs(y)-.8))}function Nt(e,t=4){Y(e,{nu:8,nv:1,su:1,sv:1,bulge:0,tuft:!1,cloth:I.WEB,P:(r,h,s)=>{const c=Math.PI*2*r;s[0]=1.7*Math.cos(c),s[1]=1.6*h,s[2]=1.7*Math.sin(c)}}),lt(e,{x:0,z:0,ys:[1.2,5,9,13,17,21,25],rad:r=>1.1*(1+.25*Math.exp(-(r-1.2)*.8)),gores:4,sub:t,sv:3,bulge:.2,tuftK:.05,cloth:0});for(const r of[-1,1])Dt(e,r,{gores:5,su:2,sv:7,tip:2});for(let r=0;r<10;r++){const h=r/10*Math.PI*2,s=Math.cos(h),c=Math.sin(h);tt(e,[[s*1.05,24.8,c*1.05],[s*1.5,26.4,c*1.5],[s*2.3,27.6,c*2.3]],.5,0,0)}}async function se(e,t={}){const o=e.rng,r=!t.style,h=nt(t.detail??e.quality?.detail??1,.6,1),s=t.style??Vt(e,{palette:t.palette,sun:new L.Vector3(-.441,.883,-.161)});r&&(s.uniforms.uWind.value.set(.2,-.98),s.uniforms.uGust.value.set(.2,-.98,60,9));const c={cap:t.cap??o.pick(["cone","cone","onion","crown"]),band:(o.int(5,7),5),twist:o.range(0,6.28),crest:o.pick([I.YELLOW,I.PINK,I.YELLOW]),fanX:o.sign()*o.range(23,29),foldX:o.range(.28,.5),fold:o.range(1.84,1.9),wilt:[0,1,2,3].map(()=>o.range(.42,.6)),softR:o.range(.12,.88),softDir:o.sign(),softX:0,softOrder:0,patchPanel:o.int(2,6),patchSide:o.sign(),patchCloth:o.pick([I.GREEN,I.WHITE,I.GREEN,I.YELLOW])};c.softPanel=b=>2*Math.round(c.softR*(b-1)/2);{const b=Math.round(2*(z.W-z.T/2)/6);c.softOrder=Math.abs((c.softPanel(b)+.5)/b-.5)*1.6}c.towerPatch=s.pal.yellow.equals(s.pal.white)?I.PINK:I.YELLOW;const f=new L.Group;f.name="keep";const y=h>=.95?4:3,i=s.batch();await Ft(i,c,y,e,!0),await e.yield();const l=i.geometry();await e.yield();const x=s.batch();await Ft(x,c,2,e,!1),await e.yield();const u=x.geometry();await e.yield();const p=s.skin({bodies:T.N}),m=Qt(c),g=p.uniforms;for(let b=0;b<T.N;b++){const H=m[b];g.uBP.value[b].fromArray(H.bp),g.uBD.value[b].fromArray(H.bd),g.uBX.value[b].fromArray(H.bx)}const W=new L.Mesh(l,p);W.frustumCulled=!1,f.add(W);const M=new L.Mesh(u,s.skin({shadow:!0,share:p}));M.frustumCulled=!1,M.renderOrder=2,f.add(M);const S=s.batch(),k=z.TOWH+z.TOWCAP+2.2;for(let b=0;b<12;b++){const H=b/12*Math.PI*2,G=o(),X=15*o.range(.9,1.1),_=z.TOWX+.7*Math.cos(H),j=z.TOWZ+.7*Math.sin(H);let Z=-1,V=-1;for(let $=0;$<=14;$++){const Q=$/14,J=S.vert(_,k,j,0,1,0,Q,-1,G,.6,T.TOWER,I.YELLOW,-1,X),ot=S.vert(_,k,j,0,1,0,Q,1,G,.6,T.TOWER,I.YELLOW,-1,X);$&&(S.tri(Z,J,V),S.tri(V,J,ot)),Z=J,V=ot}}const B=new L.Mesh(S.geometry(),s.skin({streamer:!0,share:p}));B.frustumCulled=!1,f.add(B),await e.yield();const A=[],F=[];for(let b=0;b<=120;b++){const H=b/120*Math.PI*2,G=Math.abs(Math.cos(2.5*H)),X=4.7*(.17+.83*Math.pow(G,2.4)),_=H+.55*X/4.7;A.push(X*Math.cos(_),X*Math.sin(_),0)}A.push(0,0,0);for(let b=0;b<120;b++)F.push(121,b,b+1);const U=new L.BufferGeometry;U.setAttribute("position",new L.Float32BufferAttribute(A,3)),U.setIndex(F);const D=new L.Mesh(U,new L.MeshBasicMaterial({color:s.pal.white,side:L.DoubleSide,toneMapped:!1}));if(D.position.set(c.fanX,5.6,z.D+17-.9),f.add(D),t.apron??r){const b=new L.Mesh(new L.PlaneGeometry(2400,2400),s.ground());b.rotation.x=-Math.PI/2,b.renderOrder=-.5,f.add(b)}let K=null;if(t.dancers??r){const b=s.batch();Nt(b,y);const H=b.geometry(),G=s.skin({instanced:!0,tube:!0,sinkMin:.25,rs0:.5});K=new L.InstancedMesh(H,G,2),K.frustumCulled=!1;const X=new Float32Array(8),_=new Float32Array(8),j=new L.Matrix4;for(let Z=0;Z<2;Z++){const V=Z?-1:1;j.makeRotationY(o.range(-.3,.3)).setPosition(V*13,0,z.D+34),K.setMatrixAt(Z,j),X.set([27.6,o.range(.4,.55),o(),2.3],Z*4),_.set([0,0,.3,Z?I.PINK:I.YELLOW],Z*4)}H.setAttribute("iBody",new L.InstancedBufferAttribute(X,4)),H.setAttribute("iState",new L.InstancedBufferAttribute(_,4)),f.add(K)}await e.yield();const O=(b,H,G)=>new L.Vector3(b,H,G),a=z.D-z.T/2,n=z.W-z.T/2,v=Math.hypot(c.foldX,1),d={gate:O(0,0,z.D),fan:O(c.fanX,5.6,z.D+13.5),crest:O(0,z.WALLH,a),courtyard:O(0,z.COURT,0),courtMark:2*z.MARK,towerAxis:O(z.TOWX,0,z.TOWZ),towerTop:O(z.TOWX,z.TOWH+z.TOWCAP,z.TOWZ),towerFold:O(c.foldX/v,0,1/v),softBattlement:O(c.softX,z.WALLH+4,-a),flyThrough:[O(0,12,190),O(0,14,130),O(0,34,86),O(0,52,a),O(1,62,22),O(2,74,-14),O(2,86,-a),O(0,84,-100)],hoseSeats:[-50,-34,-18,18,34,50].map(b=>O(b,0,z.D+2)),fishSeats:[-42,-30,-18,-6,6,18,30,42].map(b=>O(b,z.WALLH+5,-a)),viewpoints:{entry:O(0,2.5,460),reveal:O(2,86,-a)},sunLocal:s.uniforms.uSun.value.clone()},w=[],P={};let E=null,R=0;const C=t.duration??41,q=m[T.SOFTB].bp[1];function N(b){const H=Ct(b,w,c,P);for(let G=0;G<T.N;G++)g.uBS.value[G].fromArray(w[G]);return g.uBP.value[T.SOFTB].y=q*H.softY,B.material.uniforms.uStream.value=H.stream,H}return N(0),{object:f,radius:100,height:121,center:O(0,50,0),anchors:d,style:s,ground:!1,groundY:0,setProgress(b){E=nt(b,0,1)*C},setTime(b){E=b},timeline:b=>Ct(b,[],c),update(b,H,G){r&&s.update(b,H,G);const X=E??H%34+2,_=N(X);R+=Math.min(b,.1)*_.fan*3.6,D.rotation.z=R},dispose(){}}}export{qt as PALETTE,Pt as PLAZA,It as STRAP,At as STRAP_CLOTH,se as buildHero,Vt as makeStyle};
