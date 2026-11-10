import*as n from"three";import{clamp as se,lerp as ae,smoothstep as qe}from"../kit/core.js";const Me=["#C4D6EC","#7FA3CF","#2F4A73","#EFF8FF","#17120E","#F0B35A","#0A1420"],Be=8,te=9.3,Z=1.3,le=16,Se=10,ne=30,Q=3,Ae=Math.tan(Math.PI/6),U=Math.sin(Math.PI/3),W=.5,Ce=`
uniform vec3 uSaFogHi, uSaFogLo, uSaKeyDir, uSaKeyCol, uSaGoldDir, uSaGoldCol, uSaSea, uSaCeil;
uniform float uSaBelow, uSaT;
vec3 saEnv(vec3 d){
  float up = d.y*0.5 + 0.5;
  float kd = max(dot(d, uSaKeyDir), 0.0);
  vec3 cloud = mix(uSaFogLo, uSaFogHi, smoothstep(0.08, 0.95, up));
  cloud += uSaKeyCol*(0.22*kd*kd + 0.30*kd*kd*kd*kd*kd*kd);
  float gd = max(dot(d, uSaGoldDir), 0.0);
  float band = exp(-abs(d.y - 0.07)*7.0);
  vec3 ceilc = uSaCeil*(0.55 + 0.25*sin(d.x*9.0 + d.z*7.0)) + uSaGoldCol*0.35*gd*gd;
  vec3 below = mix(uSaSea*1.6 + uSaGoldCol*0.10*gd*gd*smoothstep(-0.6, 0.0, d.y), ceilc, smoothstep(0.02, 0.30, d.y));
  below += uSaGoldCol*band*(0.45 + 1.1*gd*gd);
  below += uSaGoldCol*2.2*pow(max(gd, 0.0), 24.0);
  return mix(cloud, below, uSaBelow);
}
`,Ke=`
uniform vec4 uSaAtm;   // x fog density in the cloud, y haze density below it, z height of the cloud base, w radius of the tear in the base
uniform vec4 uSaHub;   // xyz crystal centre (world), w radius of the hollow it has eaten
uniform vec3 uSaAir, uSaFogMid;
vec3 saCloudCol(vec3 d){
  float kd = max(dot(d, uSaKeyDir), 0.0);
  vec3 c = mix(uSaFogLo, uSaFogMid, smoothstep(-0.8, 0.12, d.y));
  c = mix(c, uSaFogHi, smoothstep(0.0, 0.95, d.y)*0.75);
  return c + uSaKeyCol*(0.10*kd*kd + 0.16*kd*kd*kd*kd*kd*kd);
}
vec3 saAirCol(vec3 d){ return mix(uSaSea*2.2, uSaAir, smoothstep(-0.5, 0.03, d.y)); }
float saHole(vec2 p){ return 1.0 - smoothstep(uSaAtm.w*0.72, uSaAtm.w*1.08 + 0.01, length(p - uSaHub.xz)); }
// rgb: the fog colour for this point, a: how much of it lies over the point (0..1)
vec4 saFogCA(vec3 wpos){
  vec3 dv = wpos - cameraPosition; float dist = length(dv); vec3 d = dv/max(dist, 1e-4);
  float cy = cameraPosition.y - uSaAtm.z, wy = wpos.y - uSaAtm.z;
  float fr = clamp(max(cy, wy)/max(abs(cy - wy), 1e-3), 0.0, 1.0);
  float inH = (1.0 - smoothstep(uSaHub.w*0.8, uSaHub.w*1.3, length(wpos.xz - uSaHub.xz)))*smoothstep(-26.0, -9.0, wpos.y - uSaHub.y)*(1.0 - smoothstep(10.0, 24.0, wpos.y));
  float tb = clamp(cy/max(cy - wy, 1e-3), 0.0, 1.0);
  float thr = step(wy, 0.0)*step(0.0, cy)*saHole(cameraPosition.xz + dv.xz*tb);
  float lc = dist*fr*uSaAtm.x*mix(1.0, 0.40, max(inH, thr));
  float fc = 1.0 - exp(-lc*lc);
  float la = dist*(1.0 - fr)*uSaAtm.y;
  float fa = 1.0 - exp(-la*la);
  float a = 1.0 - (1.0 - fc)*(1.0 - fa);
  vec3 c = (saAirCol(d)*fa*(1.0 - fc) + saCloudCol(d)*fc)/max(a, 1e-4);
  return vec4(c, a);
}
vec3 saFog(vec3 col, vec3 wpos){ vec4 f = saFogCA(wpos); return mix(col, f.rgb, f.a); }
`;function Ee(l=Me){const e=a=>new n.Color(a);return{uSaT:{value:0},uSaBelow:{value:0},uSaClock:{value:0},uSaFogHi:{value:e(l[3]).multiplyScalar(.8)},uSaFogLo:{value:e(l[2]).multiplyScalar(.85)},uSaKeyDir:{value:new n.Vector3(-.55,.64,.5).normalize()},uSaKeyCol:{value:e(l[3])},uSaGoldDir:{value:new n.Vector3(.9,.1,-.35).normalize()},uSaGoldCol:{value:e(l[5])},uSaSea:{value:e(l[6])},uSaCeil:{value:e(l[2]).multiplyScalar(.55)},uSaPale:{value:e(l[3]).multiplyScalar(.78)},uSaMid:{value:e(l[1])},uSaCobalt:{value:e(l[2])},uSaOpen:{value:0},uSaDust:{value:e(l[4])},uSaHollow:{value:e(l[1]).multiplyScalar(.42)},uSaAtm:{value:new n.Vector4(0,0,-10,0)},uSaHub:{value:new n.Vector4(0,0,0,42)},uSaAir:{value:e(l[5]).lerp(e(l[2]),.45)},uSaFogMid:{value:e(l[0])}}}const Ge=`
attribute vec4 aOrg, aAx, aSeg;
attribute vec3 aPl;
uniform float uSaT;
varying vec3 vW, vL, vViewL, vUp, vPl;
varying vec2 vAxL;
varying vec4 vSeg, vInfo;
#include <common>
void main(){
  float age = uSaT - aOrg.z;
  float x = clamp(age/max(aOrg.w, 0.01), 0.0, 1.0);
  float g = 1.0 - (1.0 - x)*(1.0 - x)*(1.0 - x);
  float on = step(0.0005, g);
  vec2 ax = aAx.xy;
  vec2 rel = position.xz - aOrg.xy;
  float al = dot(rel, ax);
  vec2 ac = rel - ax*al;
  float wide = mix(0.35, 1.0, g)*on;
  vec3 p = position;
  if (aAx.w < 2.5) { p.xz = aOrg.xy + ax*al*g + ac*wide; p.y *= wide; }
  vL = p;
#ifdef USE_INSTANCING
  mat4 M = modelMatrix*instanceMatrix;
#else
  mat4 M = modelMatrix;
#endif
  vec4 w = M*vec4(p, 1.0);
  vW = w.xyz;
  mat3 R = mat3(normalize(M[0].xyz), normalize(M[1].xyz), normalize(M[2].xyz));
  vUp = R[1];
  vAxL = ax;
  vPl = aPl*g;
  vViewL = (w.xyz - cameraPosition)*R;
  vSeg = vec4(aSeg.x*g, aSeg.y, aSeg.z*wide, aSeg.w*wide);
  float fresh = on*(1.0 - smoothstep(0.0, 0.35, age - aOrg.w));
  vInfo = vec4(g, fresh, aAx.z, aAx.w);
  vec4 mvPosition = viewMatrix*w;
  gl_Position = projectionMatrix*mvPosition;
}
`,Oe=`
uniform vec3 uSaPale, uSaMid, uSaCobalt, uSaDust, uSaHollow;
uniform float uSaHubS, uSaRod, uSaOpen, uSaClock;
varying vec3 vW, vL, vViewL, vUp, vPl;
varying vec2 vAxL;
varying vec4 vSeg, vInfo;
#include <common>
${Ce}
${Ke}
float saHash(float n){ return fract(sin(n*91.345 + 1.7)*47453.5453); }
float saHash2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)))*43758.5453); }
float saNoise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
  return mix(mix(saHash2(i), saHash2(i + vec2(1.0, 0.0)), f.x), mix(saHash2(i + vec2(0.0, 1.0)), saHash2(i + vec2(1.0, 1.0)), f.x), f.y);
}
float saHex(vec2 p){ p = abs(p); return max(p.y*0.8660254 + p.x*0.5, p.x); }
float saLine(float v, float halfw, float fw){ return 1.0 - smoothstep(halfw, halfw + fw*1.5 + 1e-4, abs(v)); }
// lines drawn on a face: x = metres along, y = across in metres, hw = half width
float saTerrace = 0.0, saHair = 0.0, saWide = 1.0, saFloor = 0.25;
float saFaceLines(vec2 q, float hw, float seed, float lvl){
  float fwx = fwidth(q.x) + 1e-4, fwy = fwidth(q.y) + 1e-4;
  float chev = q.x - abs(q.y)*0.5774;
  float sp = min(max(lvl < 0.5 ? 0.8 : 0.55, hw*0.75), 1.0);
  saWide = clamp((hw/fwy - 2.5)/3.5, 0.0, 1.0);   // 0 where the face is only a few pixels across
  float c = chev/sp + seed*7.0;
  float fwc = fwidth(c) + 1e-4;
  float k = abs(fract(c) - 0.5);
  float gl = (1.0 - smoothstep(0.02, 0.02 + min(fwc, 0.06)*1.5, k))*clamp(0.12/fwc, 0.0, 1.0)*0.7;
  saTerrace = fract(c + 0.5)*clamp(0.35/fwc, 0.0, 1.0);
  float c2 = c*3.0 + 0.3;
  float fwc2 = fwc*3.0;
  float gl2 = (1.0 - smoothstep(0.05, 0.05 + min(fwc2, 0.06)*1.5, abs(fract(c2) - 0.5)))*clamp(0.12/fwc2, 0.0, 1.0)*0.35;
  float eg = lvl < 0.5 ? 0.86 : (lvl < 1.5 ? 0.75 : 0.56);
  float ribs = saLine(abs(q.y) - hw*0.55, 0.02*hw + 0.01, fwy)*0.8 + saLine(q.y, 0.03*hw + 0.01, fwy) + saLine(abs(q.y) - hw*eg, 0.035*hw + 0.012, fwy);
  ribs *= clamp(hw*0.25/fwy, 0.0, 1.0);
  saHair = (saLine(abs(q.y) - hw*(eg - 0.075), 0.012*hw + 0.004, fwy) + saLine(q.y - (lvl < 0.5 ? 0.17 : 0.26)*hw, 0.012*hw + 0.004, fwy))*clamp(hw*0.2/fwy, 0.0, 1.0);
  return max(max(gl, gl2), ribs);
}
// trapped air: sparse bubbles in cells of p; x = disc, y = its dark rim, z = one small highlight (aa = a pixel, in cells)
vec3 saBubble(vec2 p, float aa){
  vec2 i = floor(p), f = fract(p) - 0.5;
  float on = step(0.70, saHash2(i + 0.37));
  vec2 o = (vec2(saHash2(i + 3.7), saHash2(i + 9.1)) - 0.5)*0.5;
  float rr = 0.09 + 0.14*saHash2(i + 5.3), r = length(f - o);
  float disc = (1.0 - smoothstep(rr - aa, rr + aa, r))*on;
  float hi = (1.0 - smoothstep(rr*0.12, rr*0.34 + aa, length(f - o + vec2(rr*0.38, -rr*0.3))))*on;
  return vec3(disc, smoothstep(rr*0.42, rr*0.92, r)*disc, hi)*clamp(rr/(aa*1.5), 0.0, 1.0);
}
// What a clear pane shows: the world straight behind it. In the cloud that is the fog, the bluer hollow the crystal
// has eaten (the same chord the dome draws, with a floor so the glass always reads a tone deeper than the fog) and
// the dark sea through the tear; below the base it is the dusk sky and the sea.
vec3 saBehind(vec3 o, vec3 d){
  vec3 c = saCloudCol(d);
  vec3 sc = vec3(1.0, 2.0, 1.0);
  vec3 oc = (o - uSaHub.xyz)*sc, dd = d*sc; dd /= max(length(dd), 1e-4);
  float R = max(uSaHub.w*1.1, 1.0), bq = dot(oc, dd), h = bq*bq - (dot(oc, oc) - R*R), sq = sqrt(max(h, 0.0));
  float chord = max(-bq + sq, 0.0) - max(-bq - sq, 0.0);
  float cr = chord/R, hol = (1.0 - exp(-cr*cr*0.9))*smoothstep(0.0, 0.5, h/(R*R));
  // from inside the hollow the fog thins downward into deep blue (the dome draws the same), and the glass keeps a little of it
  float inside = 1.0 - smoothstep(0.7, 1.05, length(oc)/R);
  float down = 1.0 - smoothstep(-0.25, 0.08, d.y);
  c = mix(c, uSaHollow*mix(0.5, 1.0, smoothstep(-0.6, 0.0, d.y)), max(max(hol*0.92, inside*down*0.92), saFloor));
  float dn = min(d.y, -1e-3), tb = (o.y - uSaAtm.z)/(-dn);
  float th = saHole(o.xz + d.xz*tb)*step(uSaAtm.z, o.y)*step(d.y, 0.0);
  c = mix(c, uSaSea*1.6 + uSaCobalt*0.22, th*0.5);
  return mix(c, saEnv(d), uSaBelow);
}
void main(){
  vec3 dx = dFdx(vW), dy = dFdy(vW);
  vec3 Nf = cross(dx, dy);
  float nl2 = dot(Nf, Nf);
  vec3 V = normalize(cameraPosition - vW);
  vec3 N = nl2 > 1e-20 ? Nf*inversesqrt(nl2) : V;
  // (okN: 0 on a face seen so nearly edge-on that its normal, taken from screen derivatives, is noise from pixel to
  // pixel: such a face carries no white glint or key line, which would break up into a stipple)
  float okN = smoothstep(0.003, 0.03, nl2/max(dot(dx, dx)*dot(dy, dy), 1e-30));
  if (dot(N, V) < 0.0) N = -N;
  // level (0 spine, 1 branch, 2 twig, 3 hub plate) and how far into a spearhead cap this is (0 at its base ring, 1 at the point)
  float seed = vInfo.z, lvl = floor(vInfo.w + 0.01), cap = clamp((vInfo.w - lvl)*4.0, 0.0, 1.0), hubK = step(2.5, lvl);
  float flatness = abs(dot(N, vUp));
  // (on the hub the low ring ridges belong to the pane: they are lines in the glass, not steps)
  float slope = 1.0 - smoothstep(mix(0.55, 0.40, hubK), mix(0.98, 0.72, hubK), flatness);
  float topness = smoothstep(mix(0.80, 0.55, hubK), mix(0.97, 0.72, hubK), flatness);
  float wallK = 1.0 - smoothstep(0.15, 0.45, flatness);
  // near the eye (nearK 1) the ice is see-through glass: a flat top is a dark clear pane, a wall shows what is really
  // behind it; far off (0) a flat top keeps the fog's tone. cl = the close pass of the hero (never a companion rod)
  float dist = length(cameraPosition - vW), nearK = 1.0 - smoothstep(10.0, 28.0, dist), cl = nearK*(1.0 - uSaRod);
  float brB = step(0.5, lvl)*(1.0 - hubK)*(1.0 - uSaBelow), armB = (1.0 - hubK)*(1.0 - uSaBelow), bt = cl*brB;   // a branch or twig, an arm piece, in the cloud
  float paneK = lvl < 0.5 ? 0.42 : (lvl < 2.5 ? 0.20 : 0.88);   // how much of the hollow's dark a top near the eye keeps: arm, branch and twig tops are pale panes
  // (bgL: how bright the world straight behind this piece really is, before any floor: it decides how a companion is drawn)
  saFloor = 0.0; float bgL = uSaRod > 0.5 ? dot(saBehind(vW, -V), vec3(0.3333)) : 0.0;
  saFloor = mix(0.50, mix(mix(0.25, 0.62, 0.8*slope), mix(mix(paneK, mix(0.72, 0.36, brB), wallK), mix(0.78, 0.40, brB), slope*wallK), nearK), 1.0 - uSaRod);
  vec3 Nh = N - vUp*dot(N, vUp);   // which way the facet leans
  // each segment leans a hair off true so glints come one piece at a time
  vec3 jit = vec3(saHash(seed*13.0 + 0.5), saHash(seed*29.0 + 3.0), saHash(seed*53.0 + 7.0)) - 0.5;
  N = normalize(N + jit*0.08);
  float NV = clamp(dot(N, V), 0.0, 1.0);
  float side = dot(vUp, V) >= 0.0 ? 1.0 : -1.0;
  vec3 Nb = vUp*side;
  // a flat top is a pane: the view goes straight through. A bevel, rib or ridge bends it like a prism (no hard
  // switch anywhere, so nothing flips from pixel to pixel), and a slow waviness slides the picture as the eye moves.
  vec3 bend = N - Nb*dot(N, Nb);
  vec2 wv = vL.xz*0.8 + seed*5.0;
  vec3 D2 = normalize(-V - bend*0.55 + 0.10*vec3(saNoise(wv) - 0.5, 0.0, saNoise(wv + 7.3) - 0.5));
  vec3 e0 = saBehind(vW, D2);
  vec3 eR = saBehind(vW, normalize(D2 + N*0.10)), eB = saBehind(vW, normalize(D2 - N*0.10));
  e0 = mix(e0, vec3(eR.r, e0.g, eB.b), slope*0.7);
  float thick = min(2.0*max(vSeg.z, 0.15)/max(abs(dot(V, vUp)), 0.25), mix(1000.0, 1.0, uSaRod));   // (a companion is thin clear glass whatever its build)
  vec3 tint = mix(vec3(0.92), uSaMid*1.3, 1.0 - exp(-thick*0.35));
  tint = mix(tint, vec3(0.62, 0.74, 0.95), 0.6*wallK*cl);   // a wall near the eye is thin clear glass, not a saturated slab
  tint = mix(tint, vec3(0.78, 0.86, 0.98), 0.55*topness*cl*(1.0 - hubK));   // and a top seen along its length stays pale ice, never blue steel
  vec3 Lk = normalize(mix(uSaKeyDir, uSaGoldDir, uSaBelow)), lc = mix(uSaKeyCol, uSaGoldCol*1.25, uSaBelow);
  vec3 palK = mix(uSaPale, uSaGoldCol*0.9, uSaBelow);
  float nk = max(dot(N, Lk), 0.0);
  // body: the scene behind, tinted by the path through the ice, plus a breath of light scattered inside the plate
  vec3 col = e0*tint + uSaPale*(0.025*dot(saEnv(Nb), vec3(0.3333)) + 0.02*nk)*(1.0 - 0.6*slope)*(1.0 - 0.5*uSaBelow);
  // (near the eye a branch or twig top is a pale pane: a tone lighter than the hollow under it, darker than the fog)
  col += uSaPale*0.14*cl*topness*(1.0 - hubK)*(lvl > 0.5 ? 1.0 : 0.6)*(1.0 - uSaBelow);
  col += (uSaPale*0.07 + uSaMid*0.16)*cl*topness*armB;
  // below the base the body of the glass stays deep blue, never black
  col += (uSaCobalt*0.26 + uSaMid*0.08)*uSaBelow*(0.6 + 0.4*flatness);
  // local face coordinates (in a cap the half width runs to nothing, so the true distance across is taken from its base)
  // and the patterns in them
  // (a spearhead stays a cut gem a little further out than the rest of the close pass: 16 m, gone by 30)
  float capD = max(1.0 - cap, 0.03), capK = smoothstep(0.0, 0.05, cap)*(1.0 - uSaRod)*(1.0 - smoothstep(16.0, 30.0, dist));
  vec2 q = vec2(vSeg.x, vSeg.y*vSeg.w);
  // where the eye's ray, bent into the ice, leaves through the underside (local xz), along and across the segment
  vec3 vl = normalize(vViewL);
  vec2 par = vl.xz*(2.0*vSeg.z)*0.85*inversesqrt(max(1.72 - dot(vl.xz, vl.xz), 0.2));
  float pa = dot(par, vAxL), pc = dot(par, vec2(vAxL.y, -vAxL.x));
  float lines = 0.0, under = 0.0, ring = 0.0, nucleus = 0.0, hair = 0.0, inner = 0.0, innerLn = 0.0, wideK = 1.0, cLine = 0.0;
  vec3 grain = uSaDust;
  if (lvl < 2.5) {
    lines = saFaceLines(q, vSeg.w, seed, lvl);
    float terr = saTerrace; hair = saHair;
    // a companion's face that is only a few pixels wide carries no pattern (it would stipple): plain dark-edged glass
    float wide = mix(1.0, saWide, uSaRod); wideK = saWide;
    // one pale line down the middle of a companion's blade (its ridge), where the blade is wide enough to carry it
    float fwq = fwidth(q.y) + 1e-4;
    cLine = saLine(q.y, 0.035*vSeg.w + 0.004, fwq)*clamp(vSeg.w*0.3/fwq, 0.0, 1.0)*uSaRod;
    // the underside seen through the top: same pattern, shifted by parallax (a companion is one clear pane: no
    // underside pattern, and its ribs and growth lines only a breath)
    under = saFaceLines(q + vec2(pa, pc)*0.6 + 0.21, vSeg.w, seed + 0.37, lvl)*wide*(1.0 - uSaRod)*(1.0 - 0.65*cl*armB);
    lines *= wide*mix(1.0, 0.25, uSaRod); hair *= wide; terr *= 1.0 - uSaRod;
    // an end plate (the plate habit): a dark glass hexagon with a pale rim and one inner hexagon line, no growth stripes
    float wfL = (lvl < 0.5 ? 1.9 : 0.95)*mix(0.35, 1.0, vInfo.x);
    float dH = abs(q.y)/(capD*wfL) + max(abs(vPl.x) - vPl.y, 0.0)/max(vPl.z, 1e-3), fwh = fwidth(dH) + 1e-4;
    float inPl = step(1e-3, vPl.y)*(1.0 - smoothstep(0.98, 1.06, dH));
    float plLn = max(saLine(dH - 0.58, 0.018, fwh), 0.55*smoothstep(0.80, 0.90, dH))*clamp(0.3/fwh, 0.0, 1.0);
    lines *= 1.0 - inPl; under *= 1.0 - inPl; terr *= 1.0 - inPl; hair = mix(hair, plLn, inPl);
    col = mix(col, uSaCobalt*0.42, 0.5*inPl*topness*saLine(dH - 0.66, 0.02, fwh)*clamp(0.3/fwh, 0.0, 1.0));
    col *= 1.0 - mix(0.06, mix(0.15, 0.04, armB), cl)*terr*topness*wide;
    // the far wall seen from inside, through the top: a pale band of refracted fog along the far edge of every face,
    // with a dark line where it starts; it widens and slides as the eye moves (the thickness of the glass)
    float ayU = abs(q.y + clamp(pc, -0.42*vSeg.w, 0.42*vSeg.w))/max(vSeg.w, 0.02);
    float fwI = fwidth(ayU) + 1e-4, innK = (1.0 - smoothstep(0.0, 0.05, cap))*topness*cl*smoothstep(0.3, 0.7, vSeg.w)*clamp(0.05/fwI, 0.0, 1.0)*(1.0 - brB);
    inner = smoothstep(0.86 - fwI, 0.93 + fwI, ayU)*innK;
    innerLn = saLine(ayU - 0.86, 0.025, fwI)*innK;
    // in a spearhead near the eye the facets carry the picture, not the lines
    lines *= 1.0 - capK; under *= 1.0 - capK; hair *= 1.0 - capK;
  } else {
    vec2 h = vL.xz*uSaHubS;
    float hd = saHex(h.xy);   // constant along the plate's own outline: the rings run parallel to its edges
    float wob = saNoise(h*1.3 + seed*9.0)*0.35;
    float c = hd*2.7 + 0.30*sin(hd*4.3 + seed*20.0) + wob*0.6;   // (unevenly spaced, like tree rings; each line a seventh of its spacing)
    float fwc = fwidth(c) + 1e-4;
    // (a thin line, filtered as a box so a ring seen at a slant never swells into a band: a ninth of its spacing)
    ring = min(clamp((0.045 - abs(fract(c) - 0.5))/fwc + 0.5, 0.0, 1.0), clamp(0.09/fwc, 0.0, 1.0));
    float c2 = hd*11.0 + wob*2.0; float fw2 = fwidth(c2) + 1e-4;
    ring = max(ring, 0.4*(1.0 - smoothstep(0.08, 0.08 + fw2*1.5, abs(fract(c2) - 0.5)))*clamp(0.3/fw2, 0.0, 1.0)*(1.0 - 0.85*cl));   // (the fine set only from afar)
    // six faint radial seams to the corners
    float ang = atan(h.x, h.y + 1e-5);
    float seam = abs(fract(ang/1.0471976 + 0.5) - 0.5)*1.0471976*length(h);
    float seamL = 0.6*saLine(seam, 0.015, fwidth(seam) + 1e-4)*smoothstep(0.3, 0.6, length(h));
    ring = max(ring, seamL);
    vec2 hu = vL.xz*uSaHubS + par*0.9;
    float hdu = saHex(hu.xy), c3 = hdu*2.7 + 0.30*sin(hdu*4.3 + seed*20.0) + 0.5; float fw3 = fwidth(c3) + 1e-4;
    under = (1.0 - smoothstep(0.05, 0.05 + fw3*1.5, abs(fract(c3) - 0.5)))*clamp(0.4/fw3, 0.0, 1.0)*(1.0 - cl);
    // the modelled ring ridges: soft dark lines in the pane
    ring = max(ring, 0.8*(1.0 - smoothstep(0.80, 0.97, flatness))*cl);
    // the dust grain, seen at depth through the glass
    vec2 nq = vL.xz*uSaHubS + vl.xz/max(abs(vl.y), 0.35)*0.55;
    float nr = length(nq) + (saNoise(nq*14.0) - 0.5)*0.10 + (saNoise(nq*41.0) - 0.5)*0.04;
    nucleus = 1.0 - smoothstep(0.20, 0.27, nr);
    // (a rough brown-black grain, rounded: lit from the key's side, one small highlight, never a flat black blob)
    vec2 gn = nq/0.27; vec3 gN = normalize(vec3(gn.x, sqrt(max(1.0 - dot(gn, gn), 0.0)) + 0.15, gn.y));
    float gdf = max(dot(gN, normalize(vec3(uSaKeyDir.x, uSaKeyDir.y + 0.6, uSaKeyDir.z))), 0.0);
    grain = uSaDust*(1.1 + 2.4*saNoise(nq*26.0)) + (uSaDust*5.0 + uSaMid*0.12)*gdf*gdf + uSaPale*0.6*smoothstep(0.90, 0.97, dot(gN, normalize(vec3(-0.35, 0.8, 0.35))));
    float halo = 1.0 - smoothstep(0.25, 0.75, nr);
    col = mix(col, col*uSaMid*1.1, halo*0.5);
    // the opening: the tumbling plate is a pale pane catching the bright fog, its rings and rim drawn dark on it
    // (seen from 60 m: no fine rings, which would stipple, but one inner hexagon, the six seams and a dark rim)
    float hx = saHex(vL.xz)/(0.8660254*max(vSeg.w, 0.05)), fhx = fwidth(hx) + 1e-4;   // 0 at the centre, 1 on the outline
    // six sectors of slightly different tone (a cut crystal, not a card), brighter toward the rim where the light is thrown back
    vec3 pane = (uSaPale*1.14 + lc*0.25*nk)*(0.82 + 0.18*NV)*(0.90 + 0.16*saHash(floor(ang/1.0471976 + 3.0) + seed*7.0))*(0.88 + 0.20*smoothstep(0.3, 0.84, hx));
    pane = mix(pane, uSaMid*1.05 + uSaPale*0.22, 0.38*(1.0 - smoothstep(0.08, 0.62, hx)));   // clear in the middle: the blue of the well comes through
    col = mix(col, pane, uSaOpen*0.9*topness);
    float oR = max(max(saLine(hx - 0.34, 0.006, fhx), saLine(hx - 0.56, 0.008, fhx)), 0.8*saLine(hx - 0.74, 0.006, fhx));
    ring = mix(ring, max(seamL*0.7, oR), uSaOpen);
    under *= 1.0 - uSaOpen;
    col = mix(col, uSaCobalt*mix(0.36, 0.26, uSaOpen), smoothstep(mix(0.86, 0.90, uSaOpen), mix(0.92, 0.95, uSaOpen), hx)*max(uSaOpen, uSaRod)*0.92*topness);
    col += lc*0.25*saLine(hx - 0.86, 0.012, fhx)*uSaOpen*topness;
    lines = ring;
  }
  // air trapped in the plate: two sparse layers of bubbles at different depths, sliding against the surface lines
  float baa = dist*0.0034/max(NV, 0.2), bk = (1.0 - smoothstep(6.0, 11.0, dist))*topness*(1.0 - uSaRod)*smoothstep(0.30, 0.48, NV)*(1.0 - 0.9*brB);
  vec3 bub = max(saBubble((vL.xz + par*0.55)*2.3 + 3.1, baa*2.3), saBubble((vL.xz + par*1.25)*3.4 + 11.7, baa*3.4)*0.8)*bk;
  col = mix(col, col*1.12 + uSaPale*0.03, bub.x*0.6);
  col = mix(col, uSaCobalt*0.32, bub.y*0.8);
  col += lc*0.55*bub.z;
  // a breath of frost inside the pane: soft milky patches (the same on all six arms)
  vec2 fwL = fwidth(vL.xz);
  float fr = smoothstep(0.5, 0.82, saNoise(vL.xz*0.6 + 17.0))*mix(0.72, 0.45 + 0.55*saNoise(vL.xz*11.0 + 3.0), clamp(0.035/max(max(fwL.x, fwL.y), 1e-4), 0.0, 1.0));
  col += uSaPale*0.07*fr*topness*cl*(1.0 - uSaBelow);
  // the far wall through the top
  col = mix(col, mix(col*0.55 + min(saEnv(vUp), vec3(1.0))*0.30, col*0.72 + uSaMid*0.16, 1.0 - uSaBelow), inner*mix(0.85, 0.35, 1.0 - uSaBelow));
  col *= 1.0 - 0.4*innerLn;
  // ribs and growth lines: cobalt in the bright cloud, pale on the dark glass below the base
  // (under the lens the hub is a block of deep blue glass: its growth rings are pale lines in it, like tree rings)
  float hubC = hubK*cl*(1.0 - uSaOpen)*(1.0 - uSaBelow);
  col = mix(col, uSaHollow*1.1 + uSaCobalt*0.05, 0.55*hubC*topness);
  col = mix(col, mix(mix(uSaCobalt*0.45, uSaPale*0.62, hubC), uSaPale*0.3 + uSaGoldCol*0.1, uSaBelow), clamp(lines*mix(0.50, 0.8, max(hubC, max(uSaOpen, uSaRod)*hubK)) + under*mix(0.22, 0.4, nearK), 0.0, 0.8)*topness);
  // a bright hairline where each flat meets its bevel and along the ridge: the light caught in the edge of the pane.
  // Near the eye it is not a pinstripe but a glint that travels along the edge as the eye moves
  float hg = mix(1.0, 0.12 + 0.88*smoothstep(0.2, 0.9, sin(q.x*1.1 + dot(vViewL.xz, vec2(0.7, 0.5)) + seed*17.0 + uSaClock*0.3)), cl);
  // (in the cloud, under the lens, these lines are cobalt, as every edge of clear ice is in bright fog; only the facet
  // that holds the key's reflection carries a white one)
  float keyF = smoothstep(0.90, 0.985, max(dot(reflect(-V, N), Lk), 0.0))*okN, cobK = cl*(1.0 - uSaBelow);
  col = mix(col, mix(lc*0.85, mix(uSaCobalt*0.40, lc*0.9, keyF), cobK), hair*mix(hg, 1.0, cobK*(1.0 - keyF))*mix(0.75, 0.6, nearK)*topness*(1.0 - 0.65*uSaRod));
  // edges go dark where the facet turns from the eye; bevels, ribs and the ridge are cobalt until the key finds them
  float rim = 1.0 - NV; rim *= rim;
  // (a companion is drawn as glass is seen in bright fog: pale down the middle, a broad dark band toward each edge)
  float brightBg = smoothstep(0.30, 0.55, bgL)*uSaRod*(1.0 - uSaBelow);
  float ay = abs(vSeg.y), thinRod = 1.0 - smoothstep(0.2, 0.35, vSeg.w), rodEdge = uSaRod*smoothstep(mix(0.62, 0.18, thinRod) - 0.14*brightBg, mix(0.95, 0.72, thinRod) - 0.12*brightBg, ay)*(lvl < 2.5 ? 0.88 + 0.08*brightBg : 0.0);
  col = mix(col, uSaCobalt*0.5, clamp(rim*(0.15 + 0.5*slope) + slope*mix(0.3, 0.05, nearK), 0.0, 0.9)*(1.0 - 0.6*wallK*cl));
  col = mix(col, col*vec3(0.80, 0.88, 0.97), uSaRod);
  col = mix(col, col*vec3(0.70, 0.81, 0.97), 0.55*brightBg);   // against bright cloud the pane is a tone deeper and bluer than the fog
  // (as glass is seen under a microscope: against bright fog its edges are dark; against the dark of the hollow they
  // are the bright ones, and the pane takes a faint sheen)
  float darkBg = (1.0 - smoothstep(0.16, 0.34, bgL))*uSaRod*(1.0 - uSaBelow);
  col += uSaPale*0.07*darkBg*topness;
  col = mix(col, mix(uSaCobalt*mix(0.40, 0.33, brightBg), uSaPale*0.92 + lc*0.06, darkBg), rodEdge);
  col = mix(col, uSaCobalt*0.5 + uSaMid*0.12, 0.95*brightBg*thinRod);   // a thin blade against bright cloud is a cobalt line: lace drawn dark on the fog
  col *= mix(1.0, 0.80 + 0.40*saHash(seed*31.0 + 2.0), uSaRod);   // (each rod its own tone, so a bundle reads as separate needles)
  col += uSaPale*0.08*uSaRod*topness*(1.0 - smoothstep(0.0, 0.5, ay))*(1.0 - 0.8*brightBg*thinRod);   // a companion rod: pale down its middle, dark at its edges
  col = mix(col, palK*0.95 + lc*0.05, 0.75*cLine*topness);
  col += lc*slope*mix(0.35, 0.12, nearK)*smoothstep(mix(0.6, 0.85, nearK), mix(0.95, 0.98, nearK), nk)*(1.0 - 0.7*uSaRod)*(1.0 - 0.8*brightBg);
  // ---- the close pass. WALLS are clear panes standing on edge. Their own colour is the dark of the hollow (and the
  // true background comes through them: see the alpha at the end), lighter where they are turned to the key and
  // cobalt where they are turned away, with a dark line at the foot and a bright line along the top edge. Inside the
  // bar the eye's ray falls to the underside and is thrown back up at the bright fog, so the lower part of every wall
  // carries a pale band of fog: wider the steeper the eye looks, so it slides up and down the wall as we move
  vec3 LkP = Lk - vUp*dot(Lk, vUp); LkP /= max(length(LkP), 1e-3);
  float kwall = dot(N, LkP), wk = wallK*cl;
  float wallH = lvl > 2.5 ? 0.8 : (lvl < 0.5 ? 0.5 : (lvl < 1.5 ? 0.45 : 0.4));
  float hb = clamp(vL.y/max(vSeg.z*wallH, 0.02), -1.3, 1.3);
  float litK = min(smoothstep(0.55, 0.95, kwall), mix(1.0, 0.6, cl*(1.0 - uSaBelow)));
  vec3 wallC = mix(col, uSaHollow + uSaMid*0.20, 0.5)*(0.88 + 0.22*litK);
  float wallB = armB*(lvl < 0.5 ? 0.5 : 1.0);   // (a spine's wall goes half way: it keeps its band and a deeper tone)
  col = mix(col, mix(col*(0.62 + 0.50*litK) + palK*0.05*litK, wallC, wallB), wk);
  col = mix(col, uSaCobalt*0.30, mix(0.45, 0.12, wallB)*wk*(1.0 - smoothstep(-0.2, 0.6, kwall)));
  float fall = abs(vl.y)/max(length(vl.xz), 0.15)/1.31;
  float barW = lvl > 2.5 ? 1.2 : 2.0*vSeg.w/capD;
  float bandTop = -1.0 + 2.0*clamp(fall*barW/max(2.0*vSeg.z*wallH, 0.02), 0.08, 0.5) + 0.10*sin(vSeg.x*1.7 + seed*40.0 + uSaClock*0.25);
  float band = (1.0 - smoothstep(bandTop - 0.45, bandTop + 0.06, hb))*smoothstep(-1.0, -0.86, hb)*wk*(1.0 - brB);
  vec3 bandD = normalize(vec3(D2.x, abs(D2.y) + 0.3, D2.z));
  vec2 bq = vL.xz*0.45 + bandD.xz*2.0 + vec2(0.0, uSaClock*0.05);
  col = mix(col, min(saEnv(bandD), vec3(1.0))*(0.15 + 0.08*saNoise(bq) + 0.07*litK), band*0.85);
  col *= 1.0 - 0.6*wk*(1.0 - smoothstep(-1.0, -0.84, hb));
  float topLn = wk*smoothstep(0.82, 0.98, hb)*(0.35 + 0.65*smoothstep(0.2, 0.9, kwall));
  col += lc*0.45*topLn*mix(1.0, keyF, 1.0 - uSaBelow);
  col = mix(col, uSaCobalt*0.40, 0.5*topLn*(1.0 - keyF)*(1.0 - uSaBelow));
  // BEVELS turned to the key are bright, those turned away cobalt
  float bevK = slope*(1.0 - wallK)*cl;
  col += lc*0.16*bevK*smoothstep(0.55, 0.92, nk);
  col = mix(col, uSaCobalt*0.34, 0.35*bevK*(1.0 - smoothstep(0.05, 0.5, nk)));
  // A SPEARHEAD near the eye is a cut gem: six facets fan out to the point, each with its own tone (one white, its
  // neighbours cobalt or clear), and the white one moves from facet to facet as the eye passes
  float ac0 = clamp(vSeg.y/capD, -1.0, 1.0)*3.0, fi = floor(ac0), ff = ac0 - fi;
  float gv = sin(fi*2.4 + dot(vl.xz, vec2(vAxL.y, -vAxL.x))*3.0 + dot(vl.xz, vAxL)*1.3 + seed*6.28);
  vec3 gbody = e0*tint*1.1 + uSaMid*0.05*(1.0 - uSaBelow);
  vec3 gem = mix(uSaCobalt*0.30, gbody, smoothstep(-0.75, -0.25, gv));
  gem = mix(gem, gbody*0.45 + palK*0.40, smoothstep(0.15, 0.40, gv));
  gem = mix(gem, palK*1.05, smoothstep(0.62, 0.78, gv));
  gem = mix(gem, gem*0.5 + palK*0.3, (1.0 - smoothstep(0.5, 1.6, min(ff, 1.0 - ff)/max(fwidth(ac0), 1e-4)))*0.6);
  float gemK = capK*smoothstep(0.25, 0.55, flatness)*(1.0 - brB);
  col = mix(col, gem, gemK*0.9);
  float gemSee = smoothstep(-0.75, -0.25, gv)*(1.0 - smoothstep(0.15, 0.40, gv));   // the clear facets
  // a thin bright line along the outer edge of every bevel: white near the eye in the cloud; below the base a gold
  // rim on the edges that face the low sun or stand against it
  float fwe = fwidth(vSeg.y);
  float eline = (1.0 - smoothstep(0.6, 1.9, (1.0 - ay)/max(fwe, 1e-5)))*step(1e-5, fwe)*smoothstep(0.12, 0.3, flatness)*(1.0 - topness)*(lvl < 2.5 ? 1.0 : 0.0);
  float fire = max(dot(D2, uSaGoldDir), 0.0), sunFace = smoothstep(0.1, 0.6, dot(N, uSaGoldDir));
  eline *= mix(1.0, (0.2 + 0.8*hg)*(0.3 + 0.7*smoothstep(0.3, 0.85, nk)), cl);
  col = mix(col, mix(lc*0.9, mix(uSaCobalt*0.42, lc*0.9, keyF), cobK), eline*mix(mix(0.55, 1.0, nearK)*(1.0 - 0.85*uSaRod), max(sunFace, fire*fire)*0.9, uSaBelow));
  // mirror: fresnel, a soft sheen, and a hard glint when a facet catches the key (never wider than a facet)
  // (in a spearhead near the eye each facet mirrors its own piece of the fog: its lean is exaggerated)
  vec3 Nm = normalize(N + Nh*2.0*gemK);
  vec3 R = reflect(-V, Nm);
  float F = 0.03 + 0.97*pow(max(1.0 - NV, 0.0), 5.0);
  // a facet turned from the eye mirrors the bright fog above it; one turned to the eye shows the dark through it
  // (a flat top takes the whole grazing mirror, so the far end of an arm is a pale mirror of the fog; right under
  // the lens it stays a dark clear pane). The mirror holds the billows of the cloud, sliding as the eye moves
  float Ft = 0.03 + 0.97*pow(max(1.0 - NV, 0.0), 3.5);
  vec3 mir = mix(saBehind(vW, R), saEnv(R), smoothstep(-0.1, 0.3, R.y));
  vec2 mp = R.xz/max(R.y, 0.2)*1.5 + vec2(0.0, uSaClock*0.04);
  mp += vL.xz*0.22*cl;
  mir *= mix(1.0, 0.60 + 0.80*(saNoise(mp)*0.65 + saNoise(mp*2.6 + 4.0)*0.35), (1.0 - uSaRod)*(1.0 - 0.5*uSaBelow)*smoothstep(-0.1, 0.3, R.y));
  // (near the eye, in the cloud, a wall or bevel seen along its face never turns into a white mirror of the fog: a quarter at most)
  float mirK = mix(min(F*(0.36 + 0.59*slope), mix(1.0, 0.25, cl*armB)), Ft*0.9*mix(0.35, 1.0, smoothstep(3.0, 14.0, dist))*(1.0 - 0.25*cl)*mix(1.0, mix(1.0, 0.5, smoothstep(0.26, 0.42, NV)), cl), topness)*(1.0 - 0.95*gemK)*mix(1.0, 0.5 - 0.25*brightBg, uSaRod)*(1.0 - 0.5*bt*topness);
  col = mix(col, mir, mirK);
  float gk = max(dot(R, Lk), 0.0);
  float g8 = gk*gk; g8 *= g8; g8 *= g8; float g40 = g8*g8*g8*g8*g8;
  col += lc*0.4*g40*(0.15 + 0.85*slope)*(1.0 - 0.9*brightBg)*okN;
  // below the base: gold fire inside the bevels that are turned to the sun; the rest stays deep blue glass
  col += uSaGoldCol*uSaBelow*slope*(0.02 + 1.2*fire*fire*fire*sunFace);
  col = min(col, vec3(0.82));
  // (a companion on bright cloud is drawn dark: no stipple of sparks on its lace; its one glint is the world's sprite)
  col += lc*3.0*smoothstep(mix(0.990, 0.975, cl), 0.998, gk)*(0.03 + 0.97*slope)*(1.0 - 0.9*brightBg)*mix(1.0, smoothstep(5.0, 14.0, dist), 1.0 - uSaRod)*okN;   // (a softer edge near the eye)
  // (the opening plate's walls and bevels: blue glass, so the hexagon reads as a pale pane with a darker rim)
  col = mix(col, uSaMid*0.30 + uSaCobalt*0.25, uSaOpen*(1.0 - topness)*(lvl > 2.5 ? 0.8 : 0.0));
  // the dust nucleus sits under everything but the mirror
  col = mix(col, grain, nucleus*0.96);
  // fresh ice: frosted (never a white cut-out), with one soft flash on its bevels as it forms
  float g = vInfo.x, fresh = vInfo.y;
  vec3 frost = saEnv(N)*0.5 + lc*0.25*nk;
  frost = min(frost*(0.8 + 0.3*saNoise(vL.xz*22.0)), vec3(0.70));
  col = mix(col, frost, fresh*0.12);
  float pulse = 4.0*g*(1.0 - g);
  float tipward = smoothstep(0.35, 1.0, g);
  col += uSaKeyCol*(lvl < 0.5 ? 2.2 : 1.0)*pulse*tipward*slope*mix(0.35, 1.0, smoothstep(4.0, 10.0, dist));
  // near the eye the glass really is clear: what lies behind it (the hollow and its drifting billows, the arms beyond,
  // the sea through the tear) comes through walls, bevels and the steeply seen top; lines, bands, bubbles, the mirror
  // and every glint stay solid
  // (only the hub plate and the spine's top face are see-through; walls, bevels, branches and twigs are all but solid,
  // so where arm roots stand behind one another nothing blends in draw order and each reads as a clean pane)
  float see = 0.15*wallK*(1.0 - 0.8*band)*(1.0 - topLn) + 0.10*slope*(1.0 - wallK) + 0.36*topness*mix(1.0, gemSee*1.25, gemK)*(1.0 - 0.6*hubK)*mix(0.3, 1.0, clamp(step(lvl, 0.5) + hubK, 0.0, 1.0));
  see *= mix(1.0, max(hubK, gemK), 1.0 - uSaBelow);
  see *= max(cl, gemK)*(1.0 - mirK)*(1.0 - clamp(hair*hg + eline + bub.x + 0.6*lines + 0.6*inner + nucleus + fresh, 0.0, 1.0));
  // a companion's wide blade lets the cloud through its pane (never its edges, its centre line or its mirror)
  float seeRod = mix(0.5, 0.22, brightBg)*uSaRod*topness*wideK*(1.0 - rodEdge)*(1.0 - mirK)*(1.0 - clamp(cLine + hair + eline + 0.6*lines, 0.0, 1.0));
  float alpha = 1.0 - clamp(max(see, seeRod), 0.0, 0.6);
  vec4 fg = saFogCA(vW);   // (in the opening the plate stands in clear air: the well's fog hardly veils it)
  gl_FragColor = vec4(mix(col, fg.rgb, fg.a*(1.0 - 0.6*uSaOpen)*(1.0 - 0.5*brightBg*thinRod))*alpha, alpha);   // (dark lace on bright cloud keeps its tone through the fog)
}
`;function we(l){const e=new n.ShaderMaterial({vertexShader:Ge,fragmentShader:Oe,side:n.DoubleSide,transparent:!0,premultipliedAlpha:!0});return e.uniforms={...l},e.uniforms.uSaHubS||(e.uniforms.uSaHubS={value:1}),e.uniforms.uSaRod||(e.uniforms.uSaRod={value:0}),e.uniforms.uSaOpen||(e.uniforms.uSaOpen={value:0}),e}const Ue=[[[-1,.5],[-.88,.8],[-.64,.8],[-.55,.93],[-.46,.8],[-.14,.8],[0,1],[.14,.8],[.46,.8],[.55,.93],[.64,.8],[.88,.8],[1,.5]],[[-1,.45],[-.78,.78],[-.22,.78],[0,1],[.22,.78],[.78,.78],[1,.45]],[[-1,.4],[-.6,.8],[0,1],[.6,.8],[1,.4]]],Re=Ue.map(l=>{const e=l.map(a=>[a[0],a[1]]);for(let a=l.length-1;a>=0;a--)e.push([l[a][0],-l[a][1]]);return e});function*Ne(l){let e=0,a=0,y=0;for(const r of l){const m=Re[r.profile].length;e+=m*r.rings.length+(r.tip?1:0),a+=m*6*(r.rings.length-1)+(r.tip?m*3:0)}const C=new Float32Array(e*3),g=new Float32Array(e*4),z=new Float32Array(e*4),k=new Float32Array(e*4),h=new Float32Array(e*3),b=e>65535?new Uint32Array(a):new Uint16Array(a);let c=0,w=0;for(const r of l){++y%40===0&&(yield);const m=Re[r.profile],x=m.length,P=r.dz,s=-r.dx,o=c,S=(d,i,f,u,K)=>{C[c*3]=r.ox+r.dx*d+P*i*u,C[c*3+1]=f*K,C[c*3+2]=r.oz+r.dz*d+s*i*u,g[c*4]=r.ox,g[c*4+1]=r.oz,g[c*4+2]=r.birth,g[c*4+3]=r.dur,z[c*4]=r.dx,z[c*4+1]=r.dz,z[c*4+2]=r.seed,z[c*4+3]=r.level,k[c*4]=d,k[c*4+1]=i,k[c*4+2]=K,k[c*4+3]=u,r.plate?(h[c*3]=d-r.plate.xc,h[c*3+1]=r.plate.f,h[c*3+2]=r.plate.pt):h[c*3+2]=1,c++};for(const d of r.rings)for(let i=0;i<x;i++)S(d.a,m[i][0],m[i][1],d.w,d.h);for(let d=0;d<r.rings.length-1;d++)for(let i=0;i<x;i++){const f=o+d*x+i,u=o+d*x+(i+1)%x,K=f+x,L=u+x;b[w++]=f,b[w++]=K,b[w++]=u,b[w++]=u,b[w++]=K,b[w++]=L}if(r.tip){const d=r.rings[r.rings.length-1],i=c,f=o+(r.rings.length-1)*x;S(r.tip,0,0,1e-4,d.h),z[i*4+3]=r.level+.25;for(let u=0;u<x;u++)b[w++]=f+u,b[w++]=i,b[w++]=f+(u+1)%x}}const M=new n.BufferGeometry;return M.setAttribute("position",new n.BufferAttribute(C,3)),M.setAttribute("aOrg",new n.BufferAttribute(g,4)),M.setAttribute("aAx",new n.BufferAttribute(z,4)),M.setAttribute("aSeg",new n.BufferAttribute(k,4)),M.setAttribute("aPl",new n.BufferAttribute(h,3)),M.setIndex(new n.BufferAttribute(b,1)),M}function Xe(l){const e=Ne(l);for(;;){const a=e.next();if(a.done)return a.value}}async function Pe(l,e){const a=Ne(e);for(;;){const y=a.next();if(y.done)return y.value;await l.yield()}}const ve={fern:{wRoot:1.6,wTip:.7,flare:1.32,bw:.35,bLen:.8,bMax:8,bShort:.45,twigStep:1.1,twigLen:2.3,twigW:.2,endPlate:0,bFlare:1.35},sector:{wRoot:1.62,wTip:1.5,flare:1.42,bw:.52,bLen:.34,bMax:3.6,bShort:.6,twigStep:1.2,twigLen:1.2,twigW:.2,endPlate:0,bFlare:1.6},plate:{wRoot:1.35,wTip:.6,flare:1.3,bw:.27,bLen:.6,bMax:6,bShort:.4,twigStep:1.5,twigLen:1.3,twigW:.16,endPlate:1,bFlare:2.3}},Fe=28,He=8.5,me=Fe*.5,pe=Fe*Math.cos(Math.PI/6);function We(l){if(l<=te)return te;const e=Math.min(le-1,Math.ceil((l-te)/Z-1e-6));return te+e*Z}function Ve(l,e,a){const y=a.x1-a.x0,C=a.z1-a.z0,g=y*y+C*C,z=se(((l-a.x0)*y+(e-a.z0)*C)/Math.max(g,1e-6),0,1);return Math.hypot(l-a.x0-y*z,e-a.z0-C*z)}async function Ie(l,e,a){const y=[],C=[],g=[],z=[],k=s=>Math.min(ae(a.wRoot,a.wTip,se((s-Q)/(ne-Q),0,1)),Math.max(.4,s*Ae-.12)),h=s=>ae(.8,.3,se(s/ne,0,1)),b=[];for(let s=0;s<4;s++)b.push({r:Q+(Se-Q)*(s+1)/4,birth:Be+s*.12,dur:.42});const c=(ne-Se)/le;for(let s=0;s<le;s++)b.push({r:Se+c*(s+1),birth:te+s*Z,dur:.5});let w=1,M=Q;const r=[];for(let s=0;s<b.length;s++){const o=b[s],S=s===b.length-1,d=k(o.r),i=h(o.r),f=S&&a.endPlate,u=f?1.9:d*a.flare,K=(u-d)*.5774,L=u*(f?.5774:1.7321),Y=f?1.3:0,v=K+Y+L,F=s===0?1:w-.06,V=o.r-F,I=[{a:0,w:s===0?.45:k(F),h:h(F)}];s===0&&I.push({a:Q-.35-F,w:k(Q),h:h(Q)}),I.push({a:V-v,w:d,h:i}),I.push({a:V-v+K,w:u,h:i*(f?1:.92)}),f&&I.push({a:V-L,w:u,h:i}),y.push({ox:0,oz:F,dx:0,dz:1,rings:I,tip:V,profile:0,birth:o.birth,dur:o.dur,seed:e(),level:0,plate:f?{xc:V-L-Y*.5,f:Y*.5,pt:L}:null}),C.push({r0:F,L:V,birth:o.birth,dur:o.dur});for(let B=Math.max(F,Q+.3);B<o.r-v;B+=.5)g.push({x:0,z:B,y:h(B),birth:o.birth+o.dur,hw:k(B),ridge:1});s>=1&&r.push({r:M-.55*(M-w),birth:o.birth+.04,k:s,w:d}),w=o.r-v,M=o.r}const m=[],x=(s,o,S)=>s>S&&s<o*Ae-.16-S*.6&&Math.hypot(s,o)<ne+.2&&Math.hypot(s-me,o-pe)>He+S+.15,P=[];for(let s=0;s<r.length;s++){const o=r[s],S=s%2===0;let i=Math.min(a.bLen*o.r,a.bMax,(ne+.5-o.r)*.95+.8)*(S?e.range(.86,1):a.bShort*e.range(.8,1.1));const f=o.w*.5,u=o.r-o.w*.5*W/U,K=a.bw*(S?1:.85)*ae(1.1,.8,o.r/ne);for(let L=0;L<14&&i>.9&&!(x(f+U*i,u+W*i,K)&&x(f+U*i*.6,u+W*i*.6,K));L++)i*=.88;i<1||(P.push({nd:o,Lb:i,ox:f,oz:u,bw:K,long:S,seed:e()}),m.push({x0:f,z0:u,x1:f+U*i,z1:u+W*i,id:P.length-1}))}await l.yield();for(let s=0;s<P.length;s++){s%3===2&&await l.yield();const o=P[s],S=o.nd,d=h(S.r)*.82,i=Math.max(1,Math.ceil(o.Lb/2.7)),f=o.Lb/i,u=[];let K=0;for(let v=0;v<i;v++){const F=v<2?S.birth+v*.26:Math.min(S.birth+(v-1)*Z,te+(le-1)*Z+.04),V=v<2?.36:.5,I=v===i-1,B=I&&a.endPlate&&o.long&&o.Lb>3.5,_=o.bw*ae(1,.78,(v+1)/i),j=d*ae(1,.85,(v+1)/i),R=B?.95:_*a.bFlare*(a.endPlate?.62:1),q=(R-_)*.5774,$=R*(B?.5774:1.7321),J=B?.6:0,H=Math.min(q+J+$,f*.8+(v?.3:0)),D=H/(q+J+$),G=v===0?-.25:K-.05,X=f*(v+1),T=X-G,N=[{a:0,w:v===0?o.bw:o.bw*ae(1,.78,v/i),h:v===0?d:d*ae(1,.85,v/i)}];N.push({a:T-H,w:_,h:j}),N.push({a:T-H+q*D,w:R,h:j*(B?1:.92)}),B&&N.push({a:T-$*D,w:R,h:j}),y.push({ox:o.ox+U*G,oz:o.oz+W*G,dx:U,dz:W,rings:N,tip:T,profile:1,birth:F,dur:V,seed:e(),level:1,plate:B?{xc:T-($+J*.5)*D,f:J*.5*D,pt:$*D}:null}),u.push({a0:Math.max(G,0),a1:X,t:F+V});for(let ee=Math.max(G,.4);ee<X-H;ee+=.7)g.push({x:o.ox+U*ee,z:o.oz+W*ee,y:j,birth:F+V,hw:_,ridge:0});K=X-H}z.push({birth:S.birth,x:o.ox+U*o.Lb,z:o.oz+W*o.Lb,ox:o.ox,oz:o.oz,L:o.Lb,grown:u[u.length-1].t});let L=e.range(.9,1.3),Y=e.chance(.5);for(;L<o.Lb-.7;){const v=u.find(F=>L<=F.a1)||u[u.length-1];for(let F=0;F<2;F++){const V=F===0,I=V?0:U,B=V?1:-W;if(!V&&(Y=!Y))continue;const _=o.ox+U*L,j=o.oz+W*L;let R=a.twigLen*e.range(.55,1)*(V?1:.6)*(.6+.4*Math.sin(Math.PI*se(L/o.Lb,0,1)));const q=a.twigW*e.range(.85,1.15);for(let D=0;D<10&&R>.45;D++){const G=_+I*R,X=j+B*R;let T=x(G,X,q+.1);for(let N=0;T&&N<m.length;N++)m[N].id!==s&&(Ve(G,X,m[N])<.42+q||Ve(_+I*R*.5,j+B*R*.5,m[N])<.3+q)&&(T=!1);if(T)break;R*=.8}if(R<=.45)continue;const $=Math.min(We(v.t+.15)+(e.chance(.4)?Z:0),te+(le-1)*Z)+.08,J=Math.min(q*2.6,R*.6),H=d*.5;if(y.push({ox:_-I*.1,oz:j-B*.1,dx:I,dz:B,rings:[{a:0,w:q,h:H},{a:R+.1-J,w:q*.9,h:H*.95}],tip:R+.1,profile:2,birth:$,dur:.45,seed:e(),level:2}),R>1)for(let D=-1;D<=1;D+=2){const G=I*W+D*B*U,X=B*W-D*I*U,T=R*e.range(.4,.6),N=R*e.range(.3,.42),ee=_+I*T,de=j+B*T;x(ee+G*N,de+X*N,.1)&&y.push({ox:ee,oz:de,dx:G,dz:X,rings:[{a:0,w:q*.7,h:H*.8},{a:N*.5,w:q*.62,h:H*.76}],tip:N,profile:2,birth:Math.min($+Z,te+(le-1)*Z+.1),dur:.4,seed:e(),level:2})}}L+=a.twigStep*e.range(.8,1.25)*(o.long?1:.8)}}return{segs:y,spine:C,sites:g,branchInfo:z}}function De(l){const e=[];for(const a of l)e.push(a),a.level>.5&&e.push({...a,ox:-a.ox,dx:-a.dx});return e}function Te(l){const e=[[.012,.695],[.3,.695],[.42,.712],[.56,.712],[.64,.7]];let a=.64+l.range(.1,.25);for(;a<2.3;){const s=l.range(.14,.3);e.push([a,.7],[a+.07,.712],[a+.07+s,.712],[a+.14+s,.7]),a+=.14+s+l.range(.12,.34)}e.push([2.66,.7],[2.74,.73],[2.9,.73],[3,.6]);const y=e.map(s=>[s[0],s[1]]);for(let s=e.length-1;s>=0;s--)y.push([e[s][0],-e[s][1]]);const C=4,g=6*C,z=y.length,k=z*g,h=new Float32Array(k*3),b=new Float32Array(k*4),c=new Float32Array(k*4),w=new Float32Array(k*4),M=new Uint16Array((z-1)*g*6),r=l();let m=0,x=0;for(let s=0;s<z;s++){const o=y[s][0],S=y[s][1];for(let d=0;d<g;d++){const i=Math.floor(d/C),f=d%C/C,u=i*Math.PI/3,K=(i+1)*Math.PI/3,L=1-.07*Math.sin(Math.PI*f)*(o/3)*(o/3),Y=ae(Math.sin(u),Math.sin(K),f)*o*L,v=ae(Math.cos(u),Math.cos(K),f)*o*L;h[m*3]=Y,h[m*3+1]=S,h[m*3+2]=v,b[m*4+2]=-100,b[m*4+3]=1,c[m*4+1]=1,c[m*4+2]=r,c[m*4+3]=3,w[m*4+2]=.75,w[m*4+3]=3,m++}}for(let s=0;s<z-1;s++)for(let o=0;o<g;o++){const S=s*g+o,d=s*g+(o+1)%g,i=S+g,f=d+g;M[x++]=S,M[x++]=i,M[x++]=d,M[x++]=d,M[x++]=i,M[x++]=f}const P=new n.BufferGeometry;return P.setAttribute("position",new n.BufferAttribute(h,3)),P.setAttribute("aOrg",new n.BufferAttribute(b,4)),P.setAttribute("aAx",new n.BufferAttribute(c,4)),P.setAttribute("aSeg",new n.BufferAttribute(w,4)),P.setAttribute("aPl",new n.BufferAttribute(new Float32Array(k*3),3)),P.setIndex(new n.BufferAttribute(M,1)),P}const _e=`
attribute vec2 aBead;
uniform float uSaT;
varying vec3 vN, vW; varying vec2 vB;
#include <common>
void main(){
  float age = uSaT - aBead.x;
  float x = clamp(age/0.16, 0.0, 1.0);
  float s = x*(1.0 + 0.35*sin(x*3.14159));
  mat4 M = modelMatrix*instanceMatrix;
  vec3 p = position*s;
  vec4 w = M*vec4(p, 1.0);
  vW = w.xyz;
  vN = normalize(mat3(M)*normal + vec3(1e-6, 0.0, 0.0));
  vB = vec2(age, aBead.y);
  vec4 mvPosition = viewMatrix*w;
  gl_Position = projectionMatrix*mvPosition;
}
`,je=`
varying vec3 vN, vW; varying vec2 vB;
#include <common>
${Ce}
${Ke}
float rmHash(vec3 p){ return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719)))*43758.5453); }
void main(){
  vec3 N = normalize(vN), V = normalize(cameraPosition - vW);
  vec3 L = normalize(mix(uSaKeyDir, uSaGoldDir, uSaBelow));
  vec3 lc = mix(uSaKeyCol, uSaGoldCol*1.3, uSaBelow);
  float nl = dot(N, L);
  float grain = 0.86 + 0.28*rmHash(floor(vW*38.0 + vB.y*17.0));
  vec3 col = 0.70*grain*(saEnv(N)*0.62 + lc*(0.42*max(nl, 0.0) + 0.10*max(nl*0.5 + 0.5, 0.0)));
  float rim = 1.0 - max(dot(N, V), 0.0);
  col += saEnv(reflect(-V, N))*rim*rim*0.25;
  float sp = step(0.985, rmHash(floor(vW*55.0) + floor(dot(V, vec3(31.0, 17.0, 23.0)))));
  col += lc*sp*1.6*max(nl, 0.0);
  col += uSaKeyCol*1.4*exp(-max(vB.x, 0.0)*5.0)*step(0.0, vB.x);
  gl_FragColor = vec4(saFog(col, vW), 1.0);
}
`;async function Ye(l,e,a,y){const C=await Ie(l,e,ve[a]||ve.sector);await l.yield();const g=await Pe(l,De(C.segs));g.boundingSphere=new n.Sphere(new n.Vector3(0,0,15),34),await l.yield();const z={...y,uSaT:{value:99},uSaHubS:{value:1}},k=new n.Group,h=new n.InstancedMesh(g,we(z),6),b=new n.Matrix4;for(let w=0;w<6;w++)h.setMatrixAt(w,b.makeRotationY(w*Math.PI/3));h.instanceMatrix.needsUpdate=!0,h.frustumCulled=!1,k.add(h),await l.yield();const c=new n.Mesh(Te(e),we(z));return c.frustumCulled=!1,k.add(c),await l.yield(),k}async function Qe(l,e={}){const a=l.rng.fork?l.rng.fork("six-arms"):l.rng,y=e.palette&&e.palette.length>=7?e.palette:Me,C=l.quality?.detail??1,g=e.habit&&ve[e.habit]?e.habit:a.pick(["fern","fern","sector","plate"]),z=ve[g],k=e.rime?e.rime==="heavy":a.chance(.5),h=Ee(y),b={value:.6},c=new n.Group;c.name="six-arms";const w=await Ie(l,a,z);await l.yield();const M=await Pe(l,De(w.segs));M.boundingSphere=new n.Sphere(new n.Vector3(0,0,15),34),await l.yield();const r=we({...h,uSaHubS:b}),m=new n.InstancedMesh(M,r,6),x=new n.Matrix4,P=[];for(let t=0;t<6;t++){const p=t*Math.PI/3;m.setMatrixAt(t,x.makeRotationY(p)),P.push(new n.Vector3(Math.sin(p),0,Math.cos(p)))}m.instanceMatrix.needsUpdate=!0,m.frustumCulled=!1,c.add(m),await l.yield();const s=Te(a),o=new n.Mesh(s,we({...h,uSaHubS:b}));o.frustumCulled=!1,c.add(o),await l.yield();const S=40,d=Math.round((k?260:36)*C),i=S+d,f=new n.IcosahedronGeometry(1,1);f.scale(1,.82,1);const u=new Float32Array(i*2),K=new n.ShaderMaterial({vertexShader:_e,fragmentShader:je});K.uniforms={...h};const L=new n.InstancedMesh(f,K,i),Y=a.range(0,Math.PI*2),v=Math.sin(Y),F=Math.cos(Y),V=new n.Quaternion,I=new n.Euler,B=new n.Vector3,_=new n.Vector3,j=w.sites,R=j.filter(t=>t.ridge);for(let t=0;t<i;t++){t%60===59&&await l.yield();const p=t<S;let A,E,re,he,ce,O=0;do{A=t===0?R.reduce((Le,ze)=>Math.abs(ze.z-20)<Math.abs(Le.z-20)?ze:Le):p&&a.chance(.4)?a.pick(R):a.pick(j),E=t===0?0:a.int(0,5),re=a.sign();const xe=t===0?0:a.range(-.75,.75)*A.hw,ye=A.x*re+xe*(A.ridge?1:.5),ke=A.z-(A.ridge?0:xe*.5*re),ge=E*Math.PI/3;he=ye*Math.cos(ge)+ke*Math.sin(ge),ce=-ye*Math.sin(ge)+ke*Math.cos(ge),A._across=xe}while(!p&&k&&he*v+ce*F<-4&&++O<6);const oe=p?a.range(.15,.27):a.range(.055,.125),ue=A.ridge&&Math.abs(A._across)<A.hw*.14,fe=A.y*(ue?1:.8)+oe*.45;I.set(a.range(-.3,.3),a.range(0,6.28),a.range(-.3,.3)),V.setFromEuler(I),_.set(oe*a.range(.9,1.1),oe*a.range(.85,1.05),oe*a.range(.9,1.1)),L.setMatrixAt(t,x.compose(B.set(he,fe,ce),V,_)),u[t*2]=t===0?24:Math.max(A.birth+a.range(.8,3),p?a.range(13,33):a.range(11,34)),u[t*2+1]=a()}f.setAttribute("aBead",new n.InstancedBufferAttribute(u,2)),L.instanceMatrix.needsUpdate=!0,L.frustumCulled=!1,c.add(L),await l.yield();const q=t=>{const p=se(t,0,1);return 1-(1-p)*(1-p)*(1-p)},$=t=>.6+.2*q((t-1.4)/.5)+.2*q((t-3.4)/.5),J=t=>{let p=Q*$(t);for(const A of w.spine)t>A.birth&&(p=Math.max(p,A.r0+A.L*q((t-A.birth)/A.dur)));return p};let H=e.seconds??0,D=e.seconds!=null,G=!1;const X=(t=H,p=[])=>{const A=J(t);let E=null;for(const O of w.branchInfo)O.birth<=t&&(!E||O.birth>E.birth)&&(E=O);const re=E?se((t-E.birth)/Math.max(E.grown-E.birth,.1),0,1):0,he=E?E.ox+U*E.L*re:0,ce=E?E.oz+W*E.L*re:A;for(let O=0;O<6;O++){const oe=O*Math.PI/3,ue=Math.cos(oe),fe=Math.sin(oe);(p[O]||(p[O]=new n.Vector3)).set(A*fe,0,A*ue),(p[O+6]||(p[O+6]=new n.Vector3)).set(he*ue+ce*fe,0,-he*fe+ce*ue)}return p};let T=1;const N=()=>{h.uSaT.value=H;const t=$(H);b.value=t,o.scale.set(t*T,1+.12*(T-1),t*T)};N();const ee=new n.Vector3(me,0,pe),de=[Be];for(let t=0;t<le;t++)de.push(te+t*Z);const ie=(t,p)=>{p!=null&&(p.isColor?t.value.copy(p):t.value.set(p))},be=0;return{object:c,radius:[30.5,8,-3.3][be],height:[60,50,4][be],center:be===2?new n.Vector3(0,.6,17):new n.Vector3(0,0,0),habit:g,rime:k?"heavy":"clean",uniforms:h,burstTimes:de,tipRadius:J,getTips:X,anchors:{hub:new n.Vector3(0,.75,0),size:{radius:30.5,thickness:1.6},skimArm:P[0].clone(),armDirs:P,skim:[[0,4.5,-9],[0,2.9,-3],[0,2.75,0],[0,2.7,6],[0,2.55,14],[0,2.4,22],[0,2.35,29],[0,3.2,35]].map(t=>new n.Vector3(...t)),notch:{position:ee.clone(),normal:new n.Vector3(0,1,0),clear:He},flyThrough:[34,20,8,0,-8,-20,-40].map(t=>new n.Vector3(me,t,pe)),portalSeat:{position:new n.Vector3(me,-36,pe),normal:new n.Vector3(0,1,0),radius:7},viewpoints:{reveal:new n.Vector3(16,12,2),above:new n.Vector3(6,26,30),skimStart:new n.Vector3(0,2.9,-3),exitLook:new n.Vector3(me,30,pe)},tips:P.map(t=>t.clone().multiplyScalar(ne))},setSeconds(t){H=t,D=!0,N()},setProgress(t){H=t*56,D=!0,N()},setBelow(t){h.uSaBelow.value=se(t,0,1),G=!0},setHubBoost(t){T=Math.max(1,t),N()},hubRadius:(t=H)=>Q*$(t),setEnv(t={}){ie(h.uSaFogHi,t.fogHi),ie(h.uSaFogLo,t.fogLo),ie(h.uSaKeyCol,t.keyCol),ie(h.uSaGoldCol,t.goldCol),ie(h.uSaSea,t.sea),ie(h.uSaCeil,t.ceil),t.keyDir&&h.uSaKeyDir.value.copy(t.keyDir).normalize(),t.goldDir&&h.uSaGoldDir.value.copy(t.goldDir).normalize()},update(t,p){h.uSaClock.value=p,D||(H=p%56,N(),G||(h.uSaBelow.value=qe(40,43,H)))},dispose(){},ground:!1,groundY:-.8}}export{Ce as SIX_ARMS_ENV_GLSL,Ke as SIX_ARMS_FOG_GLSL,Qe as buildHero,Ye as makeCrystal,Ee as makeEnvUniforms,we as makeIceMaterial,Xe as makeSegmentGeometry,Pe as makeSegmentGeometryAsync};
