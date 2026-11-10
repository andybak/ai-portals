import*as x from"three";const Ze=["#070D14","#1C3556","#0E3B33","#8FE3C0","#C9D6E2","#F2F8FF","#4A4640"],$=-.4,ye=-1.9,X=[-120,-60,0,60,120],Y=35,K=29,se=16,le=30,ge=27,He=26.9,me=31,Fe=31,pt=8,ue=9,Q=6,Be=22,De=27.5,et=150,Z=171,W=13,ee=1.3,Te=.8,he=31,re=(e,i,n,T)=>{const l=Math.min(Math.abs(e)/i,1);return n+(T-n)*(.55*Math.sqrt(1-l*l)+.45*(1-l))},qe=e=>re(e,Q,Be,De),tt=`
vec3 mmJewel(float h){ return h < .28 ? vec3(1.5, .09, .15) : (h < .56 ? vec3(.1, .28, 1.6) : (h < .78 ? vec3(.12, 1.15, .4) : vec3(1.6, .86, .14))); }
vec4 mmGlass(vec2 q, float s, float aa, float stain){
  vec2 c = floor(q), p = fract(q) - .5, a = abs(p);
  float sq = max(a.x, a.y), di = (a.x + a.y) * .7071;
  float star = min(sq, di) - .27, oct = max(sq, di) - .19, cor = (1. - a.x - a.y) * .7071 - .16;
  vec3 hs = fract(sin(vec3(dot(c + s * 7., vec2(127.1, 311.7)), dot(c + s * 7., vec2(269.5, 183.3)), dot(c + s * 7., vec2(419.2, 371.9)))) * 43758.5453);
  vec3 col; float d;
  if (oct < 0.) { col = mix(vec3(1., .98, .9), hs.z < .6 ? vec3(1.6, .86, .14) : vec3(1.), stain); d = -oct; }
  else if (star < 0.) { col = mix(mix(vec3(1.), vec3(.62, 1., .82), step(.5, hs.x)), mmJewel(hs.x), stain); d = min(-star, oct); }
  else if (cor < 0.) { vec2 k = floor(q + .5) + s * 3.1; float hk = fract(sin(dot(k, vec2(127.1, 311.7))) * 43758.5453);
    col = mix(vec3(.62, 1., .82), mmJewel(fract(hk * 1.7 + .1)), stain); d = -cor; }
  else { float side = step(a.y, a.x);
    vec2 k = c + .5 * (side > .5 ? vec2(p.x > 0. ? 1. : -1., 0.) : vec2(0., p.y > 0. ? 1. : -1.));
    float hk = fract(sin(dot(k * 2. + s * 5.3, vec2(269.5, 183.3))) * 43758.5453);
    col = hk < .3 ? vec3(.7, 1., .84) : (hk < .55 ? mix(vec3(1.), vec3(1.15, .95, .62), stain) : vec3(1.));
    d = min(min(star, cor), abs(a.x - a.y) * .7071); }
  return vec4(col, smoothstep(.03 - aa, .03 + aa, d)); }
`,Ne=`
uniform float uTime;
uniform vec3 uCamL;
uniform vec4 uFlame;        // rgb flame colour, a = HDR gain
uniform vec4 uLit;          // great chandelier rings low, mid, top; lesser chandeliers
uniform vec3 uWinTop, uWinBot;
uniform vec2 uWinGain;      // west (-x) and east (+x) windows
uniform float uStain;
uniform vec3 uCausCol;
uniform vec3 uPortalCol;
uniform vec3 uBurstPos[2];
uniform vec3 uBurstCol[2];
uniform vec3 uBody;
uniform vec4 uCh[3];        // chandelier base centres, w = scale
uniform vec3 uSpark;
uniform vec4 uVar;          // seed, caustic scale, facet tilt, rhombus share
uniform float uIgnite;      // z of the front of the opening swell
uniform vec4 uGlit;         // share of facets that blaze, share that hold a colour, glitter gain, pool band gain
uniform vec3 uGhost;        // what an unlit chandelier still gives back to a mirror (moonlight)
uniform vec3 uBeamDir[2]; uniform vec3 uBeamCol[2];
uniform float uDropSide;    // candles out: how far the bell is lit from the window side only (0 dusk .. 1 moonlight)
uniform vec3 uRoomLo, uRoomHi;   // what a mirror turned to the floor, and to the vault, gives back
uniform vec3 uJewel;        // gains: the windows' colours in the mirrors, the candles' gold round the bell's image, the second reflections
uniform vec4 uLamp;         // rgb of the lanterns in the pier alcoves, a = their reach (m, squared)
const vec3 PORTAL_C = vec3(0., 12., 180.);
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec2 h22(vec2 p){ return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
vec3 h23(vec2 p){ return fract(sin(vec3(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)), dot(p, vec2(419.2, 371.9)))) * 43758.5453); }
float h31(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
${tt}
float mmCell(vec2 p){ vec2 n = floor(p), f = fract(p); float d1 = 8., d2 = 8.;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j)); vec2 o = .5 + .4 * sin(uTime * .35 + 6.2831 * h22(n + g)); vec2 r = g + o - f; float d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; } }
  return sqrt(d2) - sqrt(d1); }
// the net of light thrown up from the pool, in hero-local space: soft threads, never hard veins
float caustic(vec3 P, vec3 N){
  vec2 p = (P.xz + N.xz * P.y) * uVar.y;
  p += .6 * vec2(sin(p.y * .9 + uTime * .21), cos(p.x * .8 - uTime * .17));
  float a = mmCell(p + uTime * vec2(.03, .05)), b = mmCell(p * 1.63 + vec2(7.1, 3.3) - uTime * vec2(.05, .02));
  float c = (1. - smoothstep(0., .3, a)) + .8 * (1. - smoothstep(0., .34, b));
  return c * c * .3; }
float chRow(float d, float h, float R, float H, float sg, float dots){
  float e = (h - H) / sg; float c = .5 + .5 * cos(d * 4.4 + H * 2. + uTime * .3); c *= c; c *= c;
  float Rw = R + 3. * (1. - dots);
  return exp(-e * e) * (1. - smoothstep(Rw - .5, Rw, abs(d))) * mix(.5, c * c * 3.4, dots); }
// what a ray from P along r sees of one chandelier: rows of flames (dots = 1) or a soft bell (dots = 0)
float chImage(vec3 P, vec3 r, vec4 c, vec3 lit, float dots){
  vec2 rx = r.xz; float l2 = max(dot(rx, rx), 1e-4); vec2 d0 = P.xz - c.xz;
  float t = -dot(d0, rx) / l2;
  float d = (d0.x * rx.y - d0.y * rx.x) * inversesqrt(l2) / c.w;
  float h = (P.y + t * r.y - c.y) / c.w; float refl = 1.;
  if (h < 0. && c.w > .9) { h = -h; refl = .6; }
  float sg = mix(2.2, .65, dots);
  float I = lit.x * chRow(d, h, 9., 2.9, sg, dots) + lit.y * chRow(d, h, 7., 7.4, sg, dots) + lit.z * chRow(d, h, 4., 10.9, sg, dots);
  float env = sqrt(max(100. - h * h, 0.));
  float lg = max(lit.x, max(lit.y, lit.z));
  I += mix(.1, .025, dots) * lg * (1. - smoothstep(env - 2., env, abs(d))) * step(h, 10.);
  I += .3 * lg * dots * (1. - smoothstep(.12, .4, abs(d))) * step(12.5, h) * step(h, 61.);
  return I * refl * step(0., t) * mix(.55, 1., dots); }
// the windows as seen along a ray: the true image, lattice and all (near plates, marble, silver)
vec3 winEnv(vec3 P, vec3 r){
  float s = r.x >= 0. ? 1. : -1.; float ax = max(abs(r.x), 1e-3);
  float t = max(35. - s * P.x, 0.) / ax; vec3 H = P + r * t;
  float zb = mod(H.z + 30., 60.) - 30.; float hd = 27.5 - 5.5 * (zb * zb / 36.);
  float m = (1. - smoothstep(5.5, 6., abs(zb))) * smoothstep(9., 9.5, H.y) * (1. - smoothstep(hd - .5, hd, H.y)) * step(abs(H.z), 149.) * smoothstep(.02, .08, abs(r.x));
  vec4 g = mmGlass(vec2(zb / 2.4 + .5, (H.y - 9.) / 2.4), s, .02 + t * .0015, uStain);
  vec3 col = mix(uWinBot, uWinTop, clamp((H.y - 9.) / 18., 0., 1.)) * g.rgb * mix(.3, 1., g.a);
  return col * (m * (s > 0. ? uWinGain.y : uWinGain.x)); }
// the windows as a field of small mirrors takes them up: a glow far wider than the opening, in big quarries of the
// glass's own colours, so whole patches of facets turn ruby, sapphire, emerald and amber and slide as the eye moves
vec3 winGlow(vec3 P, vec3 r){
  float s = r.x >= 0. ? 1. : -1.; float ax = max(abs(r.x), 1e-3);
  float t = max(35. - s * P.x, 0.) / ax; vec3 H = P + r * t;
  float zb = mod(H.z + 30., 60.) - 30.; float hd = 27.5 - 5.5 * (zb * zb / 36.);
  float dz = max(abs(zb) - 6., 0.), dy = max(max(9. - H.y, H.y - hd), 0.);
  float m = exp(-(dz * dz + dy * dy) / 38.) * step(abs(H.z), 153.) * smoothstep(.02, .1, abs(r.x));
  vec2 c = floor(vec2(zb / 2.4 + .5, (H.y - 9.) / 2.4) * .72);
  vec3 col = mix(uWinBot, uWinTop, clamp((H.y - 9.) / 18., 0., 1.));
  float lum = dot(col, vec3(.3, .5, .2));
  col = mix(col, mmJewel(h21(c + s * 7.)) * (lum * 1.25), uStain);
  return col * (m * (s > 0. ? uWinGain.y : uWinGain.x)); }
// light falling through the window of side s towards P (D points at the light): the glass's pattern laid on what it strikes
vec3 winPool(vec3 P, vec3 D, float s){
  float ax = s * D.x; if (ax < .05) return vec3(0.);
  float t = max(35. - s * P.x, 0.) / ax; vec3 H = P + D * t;
  float zb = mod(H.z + 30., 60.) - 30.; float hd = 27.5 - 5.5 * (zb * zb / 36.); float sf = .3 + t * .035;
  float m = (1. - smoothstep(6. - sf, 6., abs(zb))) * smoothstep(9., 9. + sf, H.y) * (1. - smoothstep(hd - sf, hd, H.y)) * step(abs(H.z), 149.);
  if (m < .001) return vec3(0.);
  vec4 g = mmGlass(vec2(zb / 2.4 + .5, (H.y - 9.) / 2.4), s, .03 + t * .003, uStain);
  return g.rgb * (m * mix(1., g.a, clamp(1.4 - t * .02, .25, 1.))); }
float missGlow(vec3 P, vec3 r, vec3 C, float rad){ vec3 L = C - P; float t = max(dot(L, r), 0.); vec3 m = L - r * t; return exp(-dot(m, m) / (rad * rad)) * step(.001, t); }
// everything a mirror can see
vec3 envMirror(vec3 P, vec3 r, float dots, float h){
  vec3 c = mix(uRoomLo, uRoomHi, smoothstep(-.35, .45, r.y)) * (.5 + h);
  float I = chImage(P, r, uCh[0], uLit.xyz, dots) + uLit.w * (chImage(P, r, uCh[1], vec3(1.), dots) + chImage(P, r, uCh[2], vec3(1.), dots));
  c += uFlame.rgb * (uFlame.a * I * (.86 + .14 * sin(uTime * (4. + 7. * h) + h * 40.)));
  // the candles' gold: a wide field of facets round each bell's image takes it up
  float lg = max(uLit.x, max(uLit.y, uLit.z));
  float gold = lg * missGlow(P, r, uCh[0].xyz + vec3(0., 7., 0.), 17.) + .6 * uLit.w * (missGlow(P, r, uCh[1].xyz + vec3(0., 5., 0.), 11.) + missGlow(P, r, uCh[2].xyz + vec3(0., 5., 0.), 11.));
  c += uFlame.rgb * (uJewel.y * gold * (.35 + 1.3 * h));
  if (dots < .98) c += winGlow(P, r) * (uJewel.x * (1. - dots) * (.45 + 1.1 * h));
  if (dots > .02) c += winEnv(P, r) * (dots * 1.2);
  // the sun's quarries on the floor, seen from above
  if (r.y < -.08) { float tf = P.y / -r.y; vec3 Fp = vec3(P.x + r.x * tf, 0., P.z + r.z * tf);
    c += uBeamCol[0] * winPool(Fp, uBeamDir[0], -1.) * (.07 * uJewel.x * step(abs(Fp.x), 35.)); }
  c += uPortalCol * (missGlow(P, r, PORTAL_C, 6.5) * (.1 + 1.8 * h * h) * (1. - smoothstep(148.5, 150.5, P.z)));
  for (int i = 0; i < 2; i++) { vec3 L = uBurstPos[i] - P; float l = max(length(L), 1e-3); float lb = max(dot(r, L) / l, 0.);
    lb *= lb; c += uBurstCol[i] * (missGlow(P, r, uBurstPos[i], 20.) * .9 + lb * lb * (.02 + .75 * h * h * h)); }
  return c; }
`,Me=`
const float WATER_Y = -0.4;
vec2 mmRipple(vec3 p, float t){ return vec2(sin(p.z * .55 + p.y * .9 + t * 1.3) + .6 * sin(p.x * .83 - t * 1.7 + p.y * 1.7), sin(p.x * .47 - p.y * 1.1 + t * 1.1) + .6 * sin(p.z * .91 + t * 1.9)); }
`,Ge=`
float mmFogF(){
#ifdef USE_FOG
  #ifdef FOG_EXP2
    return 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  #else
    return smoothstep(fogNear, fogFar, vFogDepth);
  #endif
#else
  return 0.;
#endif
}
`,at=`
attribute vec2 aUv; attribute vec3 aEdge; attribute vec4 aMat; attribute vec3 aCol;
uniform float uTime, uMirror; uniform vec3 uSpin; uniform vec4 uCh[3];
varying vec3 vP, vN, vCol, vEdge; varying vec2 vUv; varying vec4 vMat;
#include <fog_pars_vertex>
${Me}
void main(){
  vec3 p = position, n = normal, e = aEdge;
  #ifdef MM_FRAME
    float ci = aEdge.y; float a = ci < .5 ? uSpin.x : (ci < 1.5 ? uSpin.y : uSpin.z);
    vec4 ch = ci < .5 ? uCh[0] : (ci < 1.5 ? uCh[1] : uCh[2]);
    float cs = cos(a), sn = sin(a); vec2 q = p.xz - ch.xz;
    p.xz = ch.xz + vec2(q.x * cs - q.y * sn, q.x * sn + q.y * cs);
    n.xz = vec2(n.x * cs - n.z * sn, n.x * sn + n.z * cs);
    e = vec3(99.);
  #endif
  #ifdef MM_PROP
    // the world's props: aEdge = (sway weight in metres, phase, bob weight)
    p.xz += aEdge.x * vec2(sin(uTime * 1.3 + aEdge.y) + .4 * sin(uTime * 2.9 + aEdge.y * 1.7), cos(uTime * 1.1 + aEdge.y * 1.3));
    p.y += aEdge.z * (.5 + .5 * sin(uTime * 2.3 + aEdge.y * 3.1)) * step(aEdge.z, 50.);
    e = vec3(99.);
  #endif
  vP = p; vN = n; vCol = aCol; vEdge = e; vUv = aUv; vMat = aMat;
  #ifdef MM_PROP
    // a prop that the world moves (a walking bird, a drifting tray) is lit where it stands: world space == hero space
    vP = (modelMatrix * vec4(p, 1.)).xyz; vN = mat3(modelMatrix) * n;
  #endif
  vec3 pw = p;
  if (uMirror > .5) { float dep = max(p.y - WATER_Y, 0.); pw.y = 2. * WATER_Y - p.y; pw.xz += mmRipple(p, uTime) * (.08 + .22 * min(dep, 10.) / 10.); }
  vec4 mvPosition = modelViewMatrix * vec4(pw, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ot=`
uniform vec3 uAmb, uWinFill, uStucco, uInlay;
uniform float uMirror, uFacetPx;
uniform vec3 uGain;         // candle light on matt surfaces, caustics on matt surfaces, plate curvature
varying vec3 vP, vN, vCol, vEdge; varying vec2 vUv; varying vec4 vMat;
#include <fog_pars_fragment>
${Me}
${Ne}
vec3 lightMatt(vec3 P, vec3 N, float ao, float caus){
  vec3 L = uAmb * (.4 + .6 * ao) * (.8 + .2 * N.y) * (1. - .3 * smoothstep(147., 153., P.z));
  vec3 d = uCh[0].xyz + vec3(0., 5.5 * uCh[0].w, 0.) - P; float d2 = dot(d, d);
  float lg = max(uLit.x, max(uLit.y, uLit.z));
  L += uFlame.rgb * (uGain.x * lg * (max(dot(N, d) * inversesqrt(d2 + 1e-3), 0.) * .75 + .25) / (1. + d2 / 900.));
  for (int i = 1; i < 3; i++) { d = uCh[i].xyz + vec3(0., 4., 0.) - P; d2 = dot(d, d);
    L += uFlame.rgb * (uGain.x * .5 * uLit.w * (max(dot(N, d) * inversesqrt(d2 + 1e-3), 0.) * .75 + .25) / (1. + d2 / 420.)); }
  float bay = .6 + .4 * cos(P.z * .10472);
  L += uWinFill * (bay * (uWinGain.y * max((N.x + .3 * N.y) * .958, 0.) / (1. + (35. - P.x) * .03) + uWinGain.x * max((-N.x + .3 * N.y) * .958, 0.) / (1. + (35. + P.x) * .03)));
  L += uBeamCol[0] * max(dot(N, uBeamDir[0]), 0.) * winPool(P, uBeamDir[0], -1.);
  L += uBeamCol[1] * max(dot(N, uBeamDir[1]), 0.) * winPool(P, uBeamDir[1], 1.);
  vec3 dq = vec3(clamp(P.x, -11., 11.), WATER_Y, clamp(P.z, -126., 126.)) - P; float q2 = dot(dq, dq);
  float nq = max(dot(N, dq) * inversesqrt(q2 + 1e-3), 0.);
  L += uCausCol * (uGain.y * caus * sqrt(nq) / (1. + q2 / 2500.));
  // a lantern hangs in the alcove on either flank of every pier (x = +-32, 0.85 m proud of the flank): a pool of warm
  // light on the alcove, its roses and the floor before it
  { float zl = clamp(floor((P.z + 120.) / 60.), 0., 3.) * 60. - 90.;
    vec3 ld = vec3(P.x >= 0. ? 32. : -32., 10.4, zl + (P.z >= zl ? 3.85 : -3.85)) - P; float l2 = dot(ld, ld);
    float fk = .9 + .1 * sin(uTime * 9.3 + zl) * sin(uTime * 5.1 + zl * .7);
    L += uLamp.rgb * (fk * (max(dot(N, ld) * inversesqrt(l2 + 1e-3), 0.) * .8 + .2) / (1. + l2 / max(uLamp.a, 1.))); }
  // a firework outside the windows washes every matt surface that faces it
  for (int i = 0; i < 2; i++) { vec3 bd = uBurstPos[i] - P; L += uBurstCol[i] * (.022 * (max(dot(N, bd) * inversesqrt(dot(bd, bd) + 1e-3), 0.) * .8 + .2)); }
  // the portal lights its niche: an emerald pool on dado, floor and ribs that dies away towards the arch
  vec3 pd = vec3(0., 12., 179.) - P; float p2 = dot(pd, pd);
  L += uPortalCol * (.26 * smoothstep(138., 151., P.z) * (max(dot(N, pd) * inversesqrt(p2 + 1e-3), 0.) * .8 + .2) / (1. + p2 / 75.));
  #ifdef MM_FRAME
  // candles out: the bell takes the day or the moon from the window side, so one half reads and the other falls away
  vec3 Dh = uBeamDir[0] * vec3(1., 0., 1.) + vec3(0., .45, 0.); Dh /= max(length(Dh), 1e-3);
  L += min(uBeamCol[0], vec3(1.4)) * ((1. - lg) * uDropSide * (.05 + .7 * max(dot(N, Dh), 0.)));
  #endif
  return L * (.55 + .45 * ao); }
// the tiny chandelier a near plate holds: three rows of flames, their reflection, the globe's glow (q: bell units, y up from the waterline)
float icRow(vec2 q, float y, float hw, float n){
  float sp = 2. * hw / (n - 1.); float xi = floor((clamp(q.x, -hw, hw) + hw) / sp + .5) * sp - hw;
  vec2 d = q - vec2(xi, y); return exp(-dot(d, d) * 70.); }
float chIcon(vec2 q){
  vec2 a = vec2(q.x, abs(q.y));
  float I = icRow(a, .12, .86, 6.) + icRow(a, .47, .66, 5.) + icRow(a, .78, .36, 3.);
  I *= q.y < 0. ? .55 : 1.;
  vec2 t = q - vec2(0., 1.03); I += .6 * exp(-dot(t, t) * 60.);
  I += .1 * exp(-dot(q, q) * 1.4);
  return I; }
// one level of the mirror mosaic. Half the facets lie nearly true and hold a piece of the room's image (envMirror: the
// windows' stained colours, the candles' gold, the sun's quarries on the floor), the rest are well out of true and
// scatter it. Besides that every facet carries the hall's second and third reflections: a share of them (uGlit.y, more
// where the smooth vault would mirror a light: sheet) holds one clear colour of the glass, chosen by a slow field (jt)
// so that whole patches of ruby, sapphire, emerald and amber slide over the vaults with the eye; a few (uGlit.x) hold
// a soft point of the light itself; band (the net and the slow rings thrown up from the pool) lights more in its colour.
vec3 facet(vec2 uv, float s, vec3 P, vec3 V, vec3 N, vec3 T, vec3 B, float px, float band, float sheet, float jt, vec3 grout){
  vec2 p = uv / s + uVar.x;
  vec2 q = vec2(p.x - p.y * .57735, p.y * 1.1547);
  vec2 ic = floor(q), f = fract(q);
  float up = step(1., f.x + f.y);
  float mg = step(h21(ic * 1.37 + 5.), uVar.w);
  vec2 id = ic + (1. - mg) * up * vec2(.37, .61);
  vec3 hs = h23(id + 11.1);
  float eT = mix(min(min(f.x, f.y), 1. - f.x - f.y), min(min(1. - f.x, 1. - f.y), f.x + f.y - 1.), up);
  float eR = min(min(f.x, 1. - f.x), min(f.y, 1. - f.y));
  float e = mix(eT, eR, mg) * s * .866;
  vec2 cc = mix(mix(vec2(1. / 3.), vec2(2. / 3.), up), vec2(.5), mg);
  vec2 lq = f - cc; vec2 l = vec2(lq.x + lq.y * .5, lq.y * .866);
  float near = smoothstep(10., 34., s / px);
  float big = smoothstep(5., 13., s / px);                         // from here up a plate holds its glint as a soft point
  vec3 hv = hs * 2. - 1.;
  float tl = uVar.z * (hs.z < .5 ? .1 + .5 * hs.z : .25 + 1.6 * hs.z * hs.z);
  vec3 nc = N + tl * (hv - N * dot(hv, N));
  vec3 n = nc + (uGain.z * near * 2.) * (T * l.x + B * l.y);
  n /= max(length(n), 1e-3);
  vec3 r = reflect(V, n);
  vec3 c = envMirror(P, r, near, hs.y);
  float nk = smoothstep(148.5, 150.5, P.z);                        // 1 inside the apse niche
  c *= mix(1., .4, nk);
  float lg = max(uLit.x, max(uLit.y, uLit.z));
  // what decides whether a facet is lit is taken at the middle of a large plate, so the whole plate lights or stays
  // dark and no streak crosses it
  vec3 rp = r;
  if (near > .02) { vec3 Vc = P - (T * l.x + B * l.y) * s - uCamL; Vc /= max(length(Vc), 1e-3);
    rp = mix(r, reflect(Vc, nc / max(length(nc), 1e-3)), smoothstep(.02, .4, near)); }
  float ph = fract(hs.x * 9.73 + dot(rp, vec3(1.31, .87, 1.13)) * 1.15 + uTime * (.01 + .025 * hs.z));
  float dph = abs(ph - .5) * 2.;
  float wH = uGlit.x * (.45 + 1.7 * sheet) * (1. + 1.5 * near), wW = uGlit.y * (.55 + 1.1 * sheet);
  float hot = 1. - smoothstep(wH * .5, wH, dph), warm = 1. - smoothstep(wW * .6, wW, dph);
  float pw = fract(hs.y * 31.7 + hs.x * 3.1);
  vec2 sq = l - (hs.xy - .5) * .2;
  float spot = mix(1., 2.2 * exp(-dot(sq, sq) * 20.), big);
  vec3 jw = mmJewel(fract(jt + (hs.x - .5) * .22));
  c += mix(uSpark, uPortalCol * vec3(.5, 1., .8), nk) * (hot * (.4 + 2.4 * pw * pw * pw) * spot * (1. - nk) * uGlit.z);
  c += jw * (warm * (.1 + .3 * hs.z) * (.7 + .5 * min(sheet, 1.6)) * (1. - nk) * uJewel.z);
  c += uCausCol * (uGlit.w * band * (.2 + 2.2 * hs.y * hs.y) * step(fract(hs.x * 5.3 + hs.z * 2.7), .45) * mix(1., .45, big) * (1. - .95 * nk));
  if (nk > .001) {
    // the niche: the portal repeated as hard emerald points, one small disc to a facet. They crowd in a halo round the
    // portal's rim and thin to nothing towards the arch; which facets hold one slides with the reflected ray, and slow
    // rings of brightness run outward from the rim.
    vec3 dp = P - PORTAL_C; float rho = length(dp) / 7.;
    float hx = max(rho - 1.25, 0.) / 1.5; float halo = exp(-hx * hx);
    float pp = fract(hs.z * 13.7 + hs.x * 5.1 + dot(rp, vec3(.9, 1.3, .7)) * 1.3 + uTime * .013);
    float share = .06 + .6 * halo;
    float on = 1. - smoothstep(share * .75, share, abs(pp - .5) * 2.);
    float pu = px / s; float rad = max(.105 + .1 * hs.x, 1.1 * pu);
    vec2 sq2 = l - (hs.yz - .5) * .14; float rr = length(sq2);
    float disc = 1. - smoothstep(rad - pu, rad + pu, rr);
    float rim = mix(1., .4 + 1.1 * smoothstep(rad * .45, rad * .95, rr), smoothstep(2.5, 6., rad / max(pu, 1e-4)));
    float wave = .72 + .28 * sin(rho * 5. - uTime * 1.7 + hs.x * 2.);
    float fl = .85 + .15 * sin(uTime * (2.5 + 5. * hs.y) + hs.x * 40.);
    vec3 pc = uPortalCol * vec3(.45, 1., .76);
    c += pc * (nk * (on * disc * rim * (.3 + 1.8 * halo) * (.45 + 1.3 * hs.y * hs.y) * wave * fl + (.012 + .05 * halo) * (.2 + 1.3 * hs.z * hs.z)));
  }
  if (near > .02 && nk < .999) {
    // its own tiny chandelier, slipping across the plate as the eye moves
    vec3 ncn = nc / max(length(nc), 1e-3); vec3 rc = reflect(V, ncn);
    vec3 D = uCh[0].xyz - P; D /= max(length(D), 1e-3);
    vec3 dd = D - rc; vec2 o = vec2(dot(dd, T), dot(dd, B)) * .15; o /= 1. + 3. * length(o);
    vec2 up2 = vec2(T.y, B.y); float ul = length(up2); up2 = ul > .15 ? up2 / ul : vec2(0., 1.);
    vec2 d2 = l - o; vec2 qi = vec2(d2.x * up2.y - d2.y * up2.x, dot(d2, up2)) / .19;
    c += (uFlame.rgb * (uFlame.a * lg) + uGhost) * (chIcon(qi) * near * (1. - nk) * step(.5, fract(hs.y * 7.7)));
  }
  float gw = max(.022 * sqrt(s), px * .6);
  return mix(grout, c, smoothstep(gw * .5, gw * 1.5, e)); }
float dadoH(vec2 c, float odd){
  float yy = (c.y + .2) / 2.4; float cyp = abs(c.x) - .8 * max(1. - yy * yy, 0.);
  float vase = min(length(c - vec2(0., -.9)) - 1., max(abs(c.x) - .3, abs(c.y - .5) - .9));
  vase = min(vase, max(abs(c.x) - .62, abs(c.y - 1.5) - .14)); vase = min(vase, max(abs(c.x) - .7, abs(c.y + 2.15) - .2));
  float d = mix(cyp, vase, odd);
  return 1. - smoothstep(-.3, .3, d); }
void main(){
  vec3 cam = uCamL; if (uMirror > .5) cam.y = 2. * WATER_Y - cam.y;
  vec3 P = vP; vec3 Vd = P - cam; float dist = max(length(Vd), 1e-3); vec3 V = Vd / dist;
  vec3 N = vN / max(length(vN), 1e-4);
  if (dot(N, V) > 0.) N = -N;
  float kind = vMat.x, ao = vMat.z;
  vec2 fw = fwidth(vUv); float px = max(max(fw.x, fw.y), 1e-4);
  vec3 dpx = dFdx(vP), dpy = dFdy(vP); vec2 dux = dFdx(vUv), duy = dFdy(vUv);
  float det = dux.x * duy.y - dux.y * duy.x; float sd = abs(det) > 1e-10 ? 1. / det : 0.;
  vec3 T = (dpx * duy.y - dpy * dux.y) * sd, B = (dpy * dux.x - dpx * duy.x) * sd;
  T /= max(length(T), 1e-3); B /= max(length(B), 1e-3);
  float caus = caustic(P, N);
  vec3 L = lightMatt(P, N, ao, caus);
  vec3 alb = vCol, extra = vec3(0.);
  vec2 u = vUv; float aa = px * 1.2 + .02;
  if (kind < .5) {
    alb *= .9 + .1 * vnoise(u * .9);
  } else if (kind > 1.5 && kind < 2.5) {
    float v1 = vnoise(u * .35 + 3. * vnoise(u * .09)); float vein = smoothstep(.46, .5, v1) * (1. - smoothstep(.5, .54, v1));
    alb *= .9 + .1 * vnoise(u * 1.7); alb = mix(alb, alb * vec3(.8, .76, .7), vein * .6);
    vec2 c = (fract(u / 7. + .5) - .5) * 7.; vec2 a2 = abs(c);
    float st = min(max(a2.x, a2.y) - 1.5, (a2.x + a2.y) * .7071 - 1.5);
    float line = 1. - smoothstep(.08, .08 + aa, abs(st)); float core = 1. - smoothstep(-.9, -.9 + aa, st);
    float hc = h21(floor(u / 7. + .5) + 3.7);
    vec3 inl = hc < .45 ? uInlay : (hc < .8 ? vec3(.05, .1, .38) : vec3(.4, .04, .07));
    alb = mix(alb, mix(vec3(.5, .36, .12), inl, core), clamp(line + core * .85, 0., 1.));
    vec2 j = (.5 - abs(fract(u / 3.5) - .5)) * 3.5;
    alb *= 1. - .35 * (1. - smoothstep(.02, .02 + aa, min(j.x, j.y)));
    vec3 r = reflect(V, N); float fr = 1. - max(dot(-V, N), 0.);
    extra = (uFlame.rgb * (uFlame.a * .05 * chImage(P, r, uCh[0], uLit.xyz, 0.)) + winEnv(P, r) * .22
      + uPortalCol * (missGlow(P, r, PORTAL_C, 6.) * .55 * smoothstep(120., 150., P.z))) * (.3 + .7 * fr * fr * fr);
  } else if (kind > 2.5 && kind < 3.5) {
    float v1 = vnoise(u * vec2(.3, .5) + 3. * vnoise(u * .11)); float vein = smoothstep(.46, .5, v1) * (1. - smoothstep(.5, .54, v1));
    alb *= .88 + .12 * vnoise(u * vec2(.8, 1.6)); alb = mix(alb, alb * vec3(.8, .74, .66), vein * .6);
    float pid = floor(u.x / 6.); float odd = mod(pid, 2.);
    vec2 c = vec2((fract(u.x / 6.) - .5) * 6., u.y - 4.2);
    vec2 dq = abs(c) - vec2(2.4, 3.); float frm = max(dq.x, dq.y);
    alb *= 1. - .3 * (1. - smoothstep(.03, .03 + aa * 2., abs(frm)));
    float dh0 = dadoH(c, odd);
    alb *= 1. + .55 * (dadoH(c - vec2(-.14, .14), odd) - dadoH(c + vec2(-.14, .14), odd)) + .1 * dh0;
    alb *= .8 + .2 * smoothstep(0., .6, u.y);
    if (P.z > 146.) {
      vec3 pd = PORTAL_C - P; float p2 = dot(pd, pd); vec2 o = vec2(dot(pd, T), dot(pd, B)); o *= .14 / max(length(o), 1e-3);
      float rimL = max(dadoH(c - o, odd) - dadoH(c + o, odd), 0.) + .1 * (1. - smoothstep(.0, .09 + aa * 2., abs(frm + .06)));
      extra = uPortalCol * (rimL * .8 / (1. + p2 / 200.));
    }
  } else if (kind > 3.5 && kind < 4.5) {
    vec3 r = reflect(V, N); float sk = vnoise(vec2(r.x * 4. + r.z * 3., r.y * 5.));
    extra = vCol * lightMatt(P, r, 1., caus) * (.5 + 1.8 * sk * sk) + winEnv(P, r) * .3;
    alb *= .4;
  } else if (kind > 4.5 && kind < 5.5) {
    vec2 j = (.5 - abs(fract(u / 1.6) - .5)) * 1.6;
    alb *= (.7 + .3 * h21(floor(u / 1.6))) * (1. + .5 * (1. - smoothstep(.03, .03 + aa, min(j.x, j.y))));
    extra = uCausCol * (caus * .12 * uGain.y);
    float bas = exp(-dot(P.xz, P.xz) / 380.);
    alb = mix(alb, alb * 3.4 + vec3(.035, .08, .07), bas);
  } else if (kind > 5.5 && kind < 6.5) {
    float id = vMat.w; float lit = id < .5 ? uLit.x : (id < 1.5 ? uLit.y : (id < 2.5 ? uLit.z : uLit.w));
    extra = uFlame.rgb * (lit * (.06 + .55 * u.y * u.y * u.y));
    L += (uWinFill * .6 + uAmb) * ((1. - lit) * .5);
  } else if (kind > 6.5 && kind < 7.5) {
    L = uAmb * .3;
  } else if (kind > 8.5) {
    // the glass of an alcove lantern: lit from within
    float fk = .9 + .1 * sin(uTime * 9.3 + P.z) * sin(uTime * 5.1 + P.z * .7);
    extra = uLamp.rgb * (fk * (.5 + .7 * u.y)); alb *= .15;
  } else if (kind > 7.5) {
    // kilim: bands of stepped diamonds in ruby, gold, cream and sapphire (vMat.y = half width of the runner)
    float hw = max(vMat.y, 1.); float st = .45;
    vec2 c = vec2(u.x, mod(u.y, 7.2) - 3.6); vec2 cs = (floor(c / st) + .5) * st;
    float d = abs(cs.x) * .8 + abs(cs.y); float ring = fract(d / 2.7);
    vec3 cream = vec3(.6, .55, .42), silver = vec3(.55, .36, .1), green = vec3(.4, .03, .05), deep = vec3(.035, .06, .26);
    vec3 kc = ring < .2 ? cream : (ring < .56 ? green : (ring < .74 ? silver : deep));
    float crs = step(abs(cs.x), st * .6) * step(abs(cs.y), st * 1.6) + step(abs(cs.y), st * .6) * step(abs(cs.x), st * 1.6);
    kc = mix(kc, cream, clamp(crs, 0., 1.));
    float bd = hw - abs(u.x);
    float zig = step(.5, fract((u.y + abs(fract(bd / .9) - .5) * 1.8) / 1.8));
    kc = bd < 1.35 ? (bd < .28 ? cream : (bd < .6 ? deep : mix(green, silver, zig))) : kc;
    float weave = .82 + .18 * mix(.5, vnoise(u * vec2(9., 26.)), clamp(.06 / px, 0., 1.));
    alb = kc * vCol * weave;
  }
  vec3 col = alb * L + extra;
  if (kind > .5 && kind < 1.5) {
    float size = max(vMat.y, .05);
    float lodf = log2(max(uFacetPx * px / size, 1.)); float l0 = floor(lodf); float lf = smoothstep(.5, 1., lodf - l0);
    float s0 = size * exp2(l0);
    vec3 grout = uStucco * L * .3;
    // where the smooth vault would mirror the globe or a window wall, more facets catch it; a slow field slides the rest
    vec3 rs = reflect(V, N);
    vec3 Lc = uCh[0].xyz + vec3(0., 6., 0.) - P; Lc /= max(length(Lc), 1e-3);
    float lgm = max(uLit.x, max(uLit.y, uLit.z));
    float lobe = max(dot(rs, Lc), 0.); lobe *= lobe; lobe *= lobe;
    float lw0 = max(dot(rs, uBeamDir[0]), 0.), lw1 = max(dot(rs, uBeamDir[1]), 0.); lw0 *= lw0; lw1 *= lw1;
    float sn = vnoise(rs.xz * 2.1 + rs.y * 1.6 + P.xz * .025 + uVar.x);
    float sheet = lgm * lobe + .3 * (uWinGain.x * lw0 * lw0 + uWinGain.y * lw1 * lw1) + 1.2 * smoothstep(.3, .8, sn);
    // the pool's light: the fine net, and slow rings that climb the walls and cross the domes
    vec3 dqm = vec3(clamp(P.x, -11., 11.), WATER_Y, clamp(P.z, -126., 126.)) - P;
    float wv = length(dqm) * .15 - uTime * .32 + 2.4 * vnoise(P.xz * .045 + P.y * .03 + 3.);
    float bw = .5 + .5 * sin(wv); bw *= bw; bw *= bw; bw *= bw;
    float band = bw * (.35 + .65 * min(caus * 1.3, 1.)) + .22 * min(caus, 1.);
    // far domes: every facet covers many plates, so more of them flash and the bands read as sheets, not specks
    float farK = smoothstep(30., 115., dist);
    sheet += .35 * farK; band *= 1. + .5 * farK;
    // which colour the second reflections hold: a slow field in the smooth vault's reflected direction, so patches of one colour slide
    float jt = vnoise(rs.xz * 2.3 + rs.y * 1.9 + P.xz * .045 + uVar.x) * 2.3 + vnoise(P.xz * .11 + P.y * .13 + 5.) * .8;
    vec3 m = facet(u, s0, P, V, N, T, B, px, band, sheet, jt, grout);
    #ifndef MM_LITE
    if (lf > .001) m = mix(m, facet(u, s0 * 2., P, V, N, T, B, px, band, sheet, jt, grout), lf);
    #endif
    m *= vCol * (mix(.5, 1., 1. - smoothstep(uIgnite - 40., uIgnite, P.z)) * (1. - .2 * smoothstep(120., 320., dist)));
    float rw = vMat.w; float ed = min(vEdge.x, min(vEdge.y, vEdge.z)); float ra = max(px * .8, .01);
    float rib = rw > .001 ? 1. - smoothstep(rw - ra, rw + ra, ed) : 0.;
    rib *= clamp(rw / ra, .22, 1.);          // a rib thinner than its pixel fades; it does not thicken into a cage
    float rp = clamp(ed / max(rw, 1e-3), 0., 1.);
    m *= mix(.45 + .55 * smoothstep(rw, rw + .3, ed), 1., farK);
    col = mix(m, uStucco * L * ((.62 + .2 * sin(rp * 3.1416)) * (1. - .45 * farK)), rib);
  }
  #ifdef MM_FRAME
  { // candles out: the half of the great bell turned away from the lit windows falls into shadow
    float lgf = max(uLit.x, max(uLit.y, uLit.z));
    float bsf = dot(P.xz - uCh[0].xz, uBeamDir[0].xz) / (max(length(uBeamDir[0].xz), 1e-3) * 9.5 * uCh[0].w);
    col *= mix(1., .1 + 1.9 * smoothstep(-.35, .8, bsf), uDropSide * (1. - lgf) * step(abs(P.z), 40.)); }
  #endif
  float alpha = 1.;
  if (uMirror > .5) { col *= .8; alpha = .35 + .55 * smoothstep(0., .8, 1. - abs(V.y)); }
  gl_FragColor = vec4(col, alpha);
  #include <fog_fragment>
}`,it=`
varying vec3 vP;
#include <fog_pars_vertex>
void main(){ vP = position; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,st=`
uniform vec3 uDeep;
varying vec3 vP;
#include <fog_pars_fragment>
${Ge}
${Me}
${Ne}
// a window in rippled water: a broken column of the glass's own colours, well under the window's brightness
vec3 winWater(vec3 P, vec3 r, vec2 rip){
  float s = r.x >= 0. ? 1. : -1.; float ax = max(abs(r.x), 1e-3);
  float t = max(35. - s * P.x, 0.) / ax; vec3 H = P + r * t;
  H.y += rip.y * t * .1; H.z += rip.x * t * .05;
  float zb = mod(H.z + 30., 60.) - 30.; float hd = 27.5 - 5.5 * (zb * zb / 36.);
  float m = (1. - smoothstep(4.8, 6.4, abs(zb))) * smoothstep(8.4, 10.4, H.y) * (1. - smoothstep(hd - 2., hd + .5, H.y)) * step(abs(H.z), 149.) * smoothstep(.02, .08, abs(r.x));
  if (m < .001) return vec3(0.);
  vec4 g = mmGlass(vec2(zb / 2.4 + .5, (H.y - 9.) / 2.4), s, .05 + t * .003, uStain);
  vec3 col = mix(uWinBot, uWinTop, clamp((H.y - 9.) / 18., 0., 1.)) * g.rgb * mix(.35, 1., g.a);
  return col * (m * (s > 0. ? uWinGain.y : uWinGain.x)); }
// the vaults in the water: a slow, soft mottle of the mirrors' colours
vec3 vaultMottle(vec3 r, vec3 P){
  vec2 g = r.xz / max(r.y, .08) * 1.4 + P.xz * .03;
  float a = vnoise(g * 1.3 + uVar.x), b = vnoise(g * 3.1 + 7.);
  return mmJewel(fract(a * 2.3 + uVar.x * .1)) * (smoothstep(.45, .8, b) * .6 + .1); }
void main(){
  vec3 P = vP; vec3 Vd = P - uCamL; float dist = max(length(Vd), 1e-3); vec3 V = Vd / dist;
  float calm = mix(.3, 1., smoothstep(18., 30., length(P.xz)));
  vec2 g = vec2(.9, .4) * cos(dot(P.xz, vec2(.9, .4)) * 1.1 + uTime * 1.2);
  g += vec2(-.5, .8) * (cos(dot(P.xz, vec2(-.5, .8)) * 1.7 - uTime * 1.5) * .7);
  g += vec2(.3, -.95) * (cos(dot(P.xz, vec2(.3, -.95)) * 2.9 + uTime * 2.1) * .45);
  g += (vec2(vnoise(P.xz * 1.3 + uTime * .3), vnoise(P.xz * 1.3 + 17. - uTime * .25)) - .5) * 1.2;
  g *= .035 * calm * (.35 + .65 / (1. + dist * .02));
  vec3 n = normalize(vec3(-g.x, 1., -g.y));
  vec3 r = reflect(V, n); r.y = abs(r.y) + .02; r = normalize(r);
  float cosv = clamp(dot(-V, n), 0., 1.); float f1 = 1. - cosv; float F = .03 + .97 * f1 * f1 * f1 * f1 * f1;
  vec3 refl = uBody * vec3(.3, .5, .6);
  vec2 rip = (vec2(vnoise(P.xz * vec2(1.7, 2.9) + uTime * vec2(.5, .3)), vnoise(P.xz * vec2(2.3, 1.1) - uTime * vec2(.3, .45) + 9.)) - .5) * (2. * calm);
  refl += winWater(P, r, rip) * .24;
  refl += uPortalCol * (missGlow(P, r, vec3(0., 12., 180.), 8.) * 1.2);
  for (int i = 0; i < 2; i++) refl += uBurstCol[i] * (missGlow(P, r, uBurstPos[i], 9.) * .22);
  float lg = max(max(uLit.x, uLit.y), max(uLit.z, uLit.w));
  refl += vaultMottle(r, P) * (uJewel.z * .06 * smoothstep(.04, .2, r.y)) + uSpark * .003;
  refl += uFlame.rgb * (uJewel.y * .07 * max(uLit.x, max(uLit.y, uLit.z)) * missGlow(P, r, uCh[0].xyz + vec3(0., 7., 0.), 17.));
  vec3 col = refl * mix(.4, 1., F) + uDeep * (1. - F);
  // sun or moon through the windows lies on the water as it does on the marble
  col += (uBeamCol[0] * winPool(P, uBeamDir[0], -1.) * max(uBeamDir[0].y, 0.) + uBeamCol[1] * winPool(P, uBeamDir[1], 1.) * max(uBeamDir[1].y, 0.)) * (.07 * (1. - F));
  float a = mix(.7, .97, F);
  float ff = mmFogF();
  #ifdef USE_FOG
    col = mix(col, fogColor * a, ff);
  #endif
  gl_FragColor = vec4(col, a);
}`,We=`
attribute vec4 iA, iB;
uniform float uTime, uPix; uniform vec3 uCamL, uSpin; uniform vec4 uCh[3], uLit;
#include <fog_pars_vertex>
${Me}
vec3 mmSpin(vec3 p, float ci, out vec4 ch){
  float a = ci < .5 ? uSpin.x : (ci < 1.5 ? uSpin.y : uSpin.z);
  ch = ci < .5 ? uCh[0] : (ci < 1.5 ? uCh[1] : uCh[2]);
  float cs = cos(a), sn = sin(a); vec2 q = p.xz - ch.xz;
  return vec3(ch.x + q.x * cs - q.y * sn, p.y, ch.z + q.x * sn + q.y * cs); }
vec3 mmSink(vec3 wp, float mir){
  if (mir < .5) return wp;
  float dep = max(wp.y - WATER_Y, 0.);
  return vec3(wp.x, 2. * WATER_Y - wp.y, wp.z) + vec3(1., 0., 0.) * mmRipple(wp, uTime).x * (.08 + .22 * min(dep, 10.) / 10.) + vec3(0., 0., 1.) * mmRipple(wp, uTime).y * (.08 + .22 * min(dep, 10.) / 10.); }
float mmReflGain(float mir, float ty){ float f = 1. - abs(ty); return mir > .5 ? .4 + .55 * smoothstep(0., .7, f) : 1.; }
`,lt=`
${We}
uniform float uDropLit, uDropSide; uniform vec3 uBeamDir[2];
varying vec2 vQ; varying vec3 vH, vV, vS; varying float vG;
void main(){
  vec4 ch; vec3 p = mmSpin(iA.xyz, iA.w, ch);
  float len = abs(iB.x), mir = step(iB.x, 0.), ph = iB.z;
  vec2 sw = vec2(sin(uTime * (1.1 + .5 * fract(ph * 7.13)) + ph * 6.283), cos(uTime * (.9 + .5 * fract(ph * 3.71)) + ph * 11.7)) * (.05 * iB.w + .012);
  vec3 top = p + vec3(sw.x, 0., sw.y);
  vec3 dn = normalize(vec3(sw.x * .8, -1., sw.y * .8));
  vec3 cam = uCamL; if (mir > .5) cam.y = 2. * WATER_Y - cam.y;
  vec3 tc = cam - (top + dn * (len * .5)); float dist = max(length(tc), 1e-3); tc /= dist;
  vec3 sd = cross(dn, tc); sd /= max(length(sd), 1e-3);
  float w = iB.y; float k = clamp(1.6 * dist * uPix / max(w, 1e-3), 1., 6.);
  vec3 wp = top + sd * (position.x * w * k) + dn * (-position.y * len * (1. + (k - 1.) * .3));
  float h = (p.y - ch.y) / ch.w; float w0 = 1. - smoothstep(2., 5., h), w2 = smoothstep(6., 9., h);
  float lit = iA.w < .5 ? dot(uLit.xyz, vec3(w0, 1. - w0 - w2, w2)) : uLit.w;
  // candles out: only the side turned to the lit windows glints, the other falls into shadow
  float bs = dot(p.xz - ch.xz, uBeamDir[0].xz) / (max(length(uBeamDir[0].xz), 1e-3) * 9.5 * ch.w);
  float sideK = mix(1., .03 + 2.6 * smoothstep(-.15, .75, bs), uDropSide * (1. - lit));
  vG = (uDropLit + (1. - uDropLit) * lit) * sideK / k * mmReflGain(mir, tc.y);
  vQ = vec2(position.x * 2., -position.y); vH = vec3(fract(ph * 1.37), fract(ph * 13.7), fract(ph * 29.3)); vV = -tc; vS = sd;
  vec4 mvPosition = modelViewMatrix * vec4(mmSink(wp, mir), 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,rt=`
uniform float uTime, uDropGain, uStain; uniform vec4 uFlame; uniform vec3 uCausCol;
varying vec2 vQ; varying vec3 vH, vV, vS; varying float vG;
#include <fog_pars_fragment>
${Ge}
void main(){
  float y = vQ.y, ax = abs(vQ.x);
  float prof = y < .3 ? y / .3 : (1. - y) / .7;
  float inside = 1. - smoothstep(prof - .16, prof, ax);
  if (inside < .01) discard;
  float fx = vQ.x > 0. ? 1. : -1., fy = y < .3 ? 1. : -1.;
  vec3 nf = normalize(vS * (fx * .75) + vec3(0., fy * .45, 0.) - vV * .55 + (vH - .5) * .5);
  vec3 r = reflect(normalize(vV), nf);
  vec3 l1 = normalize(vH * 2. - 1. + vec3(.01, .42, .03));
  float g1 = max(dot(r, l1), 0.), g2 = max(dot(r, vec3(l1.z, -l1.y, l1.x)), 0.);
  g1 *= g1; g1 *= g1; g1 *= g1; g1 *= g1; g2 *= g2; g2 *= g2; g2 *= g2; g2 *= g2;
  float tw = .65 + .35 * sin(uTime * (2. + 3. * vH.y) + vH.x * 40.);
  float edge = smoothstep(prof - .4, prof, ax) * .6 + (1. - smoothstep(0., .1, abs(y - .3))) * .3 + (1. - smoothstep(0., .12, ax)) * .25;
  vec3 tint = mix(uFlame.rgb, uCausCol * 1.6, step(.8, vH.z));
  float hj = fract(vH.x * 17.3 + vH.y * 5.1);
  vec3 jw = hj < .28 ? vec3(1.5, .09, .15) : (hj < .56 ? vec3(.1, .28, 1.6) : (hj < .78 ? vec3(.12, 1.15, .4) : vec3(1.6, .86, .14)));
  tint = mix(tint, jw, uStain * step(.62, fract(vH.z * 7.7)));
  vec3 col = uFlame.rgb * (.03 + .17 * edge) + tint * ((g1 + g2) * tw * uDropGain);
  gl_FragColor = vec4(col * (inside * vG * (1. - mmFogF())), 1.);
}`,nt=`
${We}
varying vec2 vQ; varying float vG, vK;
void main(){
  vec4 ch; vec3 p = mmSpin(iA.xyz, iA.w, ch);
  float size = abs(iB.x), mir = step(iB.x, 0.), ph = iB.y, ring = iB.z; vK = iB.w;
  float lit = ring < .5 ? uLit.x : (ring < 1.5 ? uLit.y : (ring < 2.5 ? uLit.z : uLit.w));
  vec3 cam = uCamL; if (mir > .5) cam.y = 2. * WATER_Y - cam.y;
  vec3 tc = cam - p; float dist = max(length(tc), 1e-3); tc /= dist;
  vec3 rt = cross(vec3(0., 1., 0.), tc); rt /= max(length(rt), 1e-3);
  vec3 upv = vK > .5 ? cross(tc, rt) : vec3(0., 1., 0.);
  float fl = .86 + .14 * sin(uTime * 11. * (.7 + .6 * fract(ph * 5.3)) + ph * 50.) * sin(uTime * 3.1 + ph * 17.);
  float w = vK > .5 ? size : size * .6, hg = vK > .5 ? size : size * fl;
  float k = vK > .5 ? 1. : clamp(1.8 * dist * uPix / max(w, 1e-3), 1., 8.);
  float sway = vK > .5 ? 0. : sin(uTime * 7.3 + ph * 31.) * .09 * position.y * position.y * size;
  vec3 wp = p + rt * (position.x * w * k + sway) + upv * ((vK > .5 ? position.y - .5 : position.y) * hg * k);
  vG = lit * (.8 + .2 * fl) / (k * k) * mmReflGain(mir, tc.y);
  if (vK > 1.5) vG = lit * smoothstep(40., 110., dist);      // the globe's far glow: gone by the time the camera is near
  vQ = vec2(position.x, position.y);
  vec4 mvPosition = modelViewMatrix * vec4(mmSink(wp, mir), 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ct=`
uniform vec4 uFlame; uniform float uHalo;
varying vec2 vQ; varying float vG, vK;
#include <fog_pars_fragment>
${Ge}
void main(){
  vec3 col;
  if (vK > 1.5) { float d = length(vQ - vec2(0., .5)) * 2.; col = uFlame.rgb * (max(exp(-d * d * 4.2) - .016, 0.) * .3); }
  else if (vK > .5) { float d = length(vQ - vec2(0., .5)) * 2.; col = uFlame.rgb * (max(exp(-d * d * 4.) - .018, 0.) * uHalo); }
  else {
    float y = vQ.y; float wd = 1.1 * sqrt(max(y, 0.)) * pow(max(1. - y, 0.), .8) + .02;
    float d = abs(vQ.x) / wd; float a = 1. - smoothstep(.55, 1., d); float core = exp(-d * d * 2.4);
    col = mix(uFlame.rgb, vec3(1.25, 1.05, .78), core) * (uFlame.a * a * (.15 + .85 * core));
    col *= mix(vec3(.5, .6, 1.2), vec3(1.), smoothstep(0., .22, y));
  }
  gl_FragColor = vec4(col * (vG * (1. - mmFogF())), 1.);
}`,L=(e,i,n)=>e+(i-e)*n;function Pe(e,i){return{n:0,ni:0,vcap:e,icap:i,P:new Float32Array(e*3),N:new Float32Array(e*3),U:new Float32Array(e*2),E:new Float32Array(e*3),M:new Float32Array(e*4),C:new Float32Array(e*3),I:new Uint32Array(i)}}const _e=[["P",3],["N",3],["U",2],["E",3],["M",4],["C",3]];function je(e,i,n){if(e.n+i>e.vcap){const T=Math.max(e.vcap*2,e.n+i);for(const[l,h]of _e){const m=new Float32Array(T*h);m.set(e[l]),e[l]=m}e.vcap=T}if(e.ni+n>e.icap){const T=Math.max(e.icap*2,e.ni+n),l=new Uint32Array(T);l.set(e.I),e.I=l,e.icap=T}}function Ee(e){const i=new x.BufferGeometry;return i.setAttribute("position",new x.BufferAttribute(e.P.slice(0,e.n*3),3)),i.setAttribute("normal",new x.BufferAttribute(e.N.slice(0,e.n*3),3)),i.setAttribute("aUv",new x.BufferAttribute(e.U.slice(0,e.n*2),2)),i.setAttribute("aEdge",new x.BufferAttribute(e.E.slice(0,e.n*3),3)),i.setAttribute("aMat",new x.BufferAttribute(e.M.slice(0,e.n*4),4)),i.setAttribute("aCol",new x.BufferAttribute(e.C.slice(0,e.n*3),3)),i.setIndex(new x.BufferAttribute(e.I.slice(0,e.ni),1)),i}async function ft(e,i){const n=new x.BufferGeometry,T=["position","normal","aUv","aEdge","aMat","aCol"];for(let l=0;l<_e.length;l++){const[h,m]=_e[l];n.setAttribute(T[l],new x.BufferAttribute(e[h].slice(0,e.n*m),m)),await i()}return n.setIndex(new x.BufferAttribute(e.I.slice(0,e.ni),1)),n}let E=new Float32Array(3*2048),q=new Float32Array(3*2048),ne=new Float32Array(2048),ce=new Float32Array(256),de=new Float32Array(256);const ze=[0,0,0],Re=[0,0],Ue=[1,1,1],Oe=[1,1,1],mt=[1,1,1,1],ut=[0,0,0,0];function U(e,i,n,T,l){const h=i+1,m=n+1,y=h*m;y*3>E.length&&(E=new Float32Array(y*3),q=new Float32Array(y*3),ne=new Float32Array(y)),m>de.length&&(de=new Float32Array(m),ce=new Float32Array(m));for(let o=0;o<m;o++)for(let a=0;a<h;a++){T(a/i,o/n,ze);const s=(o*h+a)*3;E[s]=ze[0],E[s+1]=ze[1],E[s+2]=ze[2]}for(let o=0;o<m;o++){let a=0;ne[o*h]=0;for(let s=1;s<h;s++){const f=(o*h+s)*3;a+=Math.hypot(E[f]-E[f-3],E[f+1]-E[f-2],E[f+2]-E[f-1]),ne[o*h+s]=a}de[o]=a}const w=i>>1;let P=0;ce[0]=0;for(let o=1;o<m;o++){const a=(o*h+w)*3,s=a-h*3;P+=Math.hypot(E[a]-E[s],E[a+1]-E[s+1],E[a+2]-E[s+2]),ce[o]=P}for(let o=0;o<m;o++)for(let a=0;a<h;a++){const s=(o*h+a)*3,f=(o*h+Math.max(a-1,0))*3,u=(o*h+Math.min(a+1,i))*3,z=(Math.max(o-1,0)*h+a)*3,R=(Math.min(o+1,n)*h+a)*3,V=E[u]-E[f],v=E[u+1]-E[f+1],F=E[u+2]-E[f+2],_=E[R]-E[z],B=E[R+1]-E[z+1],S=E[R+2]-E[z+2],I=v*S-F*B,H=F*_-V*S,N=V*B-v*_,j=Math.hypot(I,H,N);j<1e-9?q[s]=NaN:(q[s]=I/j,q[s+1]=H/j,q[s+2]=N/j)}for(let o=0;o<m;o++)for(let a=0;a<h;a++){const s=(o*h+a)*3;if(q[s]===q[s])continue;let f=-1;for(let u=1;u<m&&f<0;u++)for(const z of[o-u,o+u]){if(z<0||z>=m)continue;const R=(z*h+a)*3;if(q[R]===q[R]){f=R;break}}f<0?(q[s]=0,q[s+1]=1,q[s+2]=0):(q[s]=q[f],q[s+1]=q[f+1],q[s+2]=q[f+2])}je(e,y,i*n*6);const M=e.n,t=l.kind||0,A=l.size||.6,C=l.w!==void 0?l.w:l.rib||0,r=l.ribs||ut,p=l.col||Oe,d=l.uo||0,c=l.vo||0;for(let o=0;o<m;o++)for(let a=0;a<h;a++){const s=o*h+a,f=s*3,u=e.n++;e.P[u*3]=E[f],e.P[u*3+1]=E[f+1],e.P[u*3+2]=E[f+2],e.N[u*3]=q[f],e.N[u*3+1]=q[f+1],e.N[u*3+2]=q[f+2],l.uvFn?(l.uvFn(E[f],E[f+1],E[f+2],Re,a/i,o/n),e.U[u*2]=Re[0],e.U[u*2+1]=Re[1]):(e.U[u*2]=ne[s]-de[o]*.5+d,e.U[u*2+1]=ce[o]+c),l.ec!==void 0?(e.E[u*3]=99,e.E[u*3+1]=l.ec,e.E[u*3+2]=99):(e.E[u*3]=r[0]?ne[s]:99,e.E[u*3+1]=r[1]?de[o]-ne[s]:99,e.E[u*3+2]=Math.min(r[2]?ce[o]:99,r[3]?P-ce[o]:99)),e.M[u*4]=t,e.M[u*4+1]=A,e.M[u*4+2]=l.aoFn?l.aoFn(a/i,o/n):l.ao!==void 0?l.ao:1,e.M[u*4+3]=C;let z=p;l.colFn&&(l.colFn(a/i,o/n,Ue),z=Ue),e.C[u*3]=z[0],e.C[u*3+1]=z[1],e.C[u*3+2]=z[2]}const g=(o,a)=>Math.abs(E[o*3]-E[a*3])+Math.abs(E[o*3+1]-E[a*3+1])+Math.abs(E[o*3+2]-E[a*3+2])<1e-6;for(let o=0;o<n;o++)for(let a=0;a<i;a++){const s=o*h+a,f=s+1,u=s+h,z=u+1;!g(s,f)&&!g(f,z)&&!g(s,z)&&(e.I[e.ni++]=M+s,e.I[e.ni++]=M+f,e.I[e.ni++]=M+z),!g(s,z)&&!g(z,u)&&!g(s,u)&&(e.I[e.ni++]=M+s,e.I[e.ni++]=M+z,e.I[e.ni++]=M+u)}}function J(e,i,n,T,l,h,m,y){y.ribs=mt;for(let w=0;w<T;w++)for(let P=0;P<n;P++)y.uo=i()*40,y.vo=i()*40,y.sizes&&(y.size=y.sizes[i()*y.sizes.length|0]),y.kind===1&&(y.col=[.88+.22*i(),.94+.14*i(),.9+.2*i()]),U(e,l,h,(M,t,A)=>m((P+M)/n,(w+t)/T,A),y)}function ve(e,i,n,T,l,h){const m=i.length,y=t=>{const A=i[t],C=i[(t+1)%m],r=C[0]-A[0],p=C[1]-A[1],d=Math.hypot(r,p)||1;return[p/d*T,-r/d*T]},w=[];for(let t=0;t<m;t++){const A=n||t>0?y((t-1+m)%m):null,C=n||t<m-1?y(t):null,r=A||C,p=C||A,d=1+r[0]*p[0]+r[1]*p[1];w.push(d<.05?[r[0],r[1]]:[(r[0]+p[0])/d,(r[1]+p[1])/d])}const P=l.length-1,M=n?m:m-1;for(let t=0;t<M;t++){const A=i[t],C=i[(t+1)%m],r=w[t],p=w[(t+1)%m];U(e,1,P,(d,c,g)=>{const o=c*P,a=Math.min(P-1,Math.floor(o+1e-6)),s=o-a,f=L(l[a][0],l[a+1][0],s);g[0]=L(A[0]+r[0]*f,C[0]+p[0]*f,d),g[1]=L(l[a][1],l[a+1][1],s),g[2]=L(A[1]+r[1]*f,C[1]+p[1]*f,d)},h)}}function fe(e,i,n,T,l){const h=n?i.concat(n):i,m=M=>M.map(t=>new x.Vector2(t[0],t[1])),y=x.ShapeUtils.triangulateShape(m(i),n?[m(n)]:[]);je(e,h.length,y.length*3);const w=e.n,P=l.col||Oe;for(const M of h){const t=e.n++;e.P[t*3]=M[0],e.P[t*3+1]=T,e.P[t*3+2]=M[1],e.N[t*3]=0,e.N[t*3+1]=1,e.N[t*3+2]=0,e.U[t*2]=M[0],e.U[t*2+1]=M[1],e.E[t*3]=99,e.E[t*3+1]=99,e.E[t*3+2]=99,e.M[t*4]=l.kind||0,e.M[t*4+1]=.6,e.M[t*4+2]=l.ao!==void 0?l.ao:1,e.M[t*4+3]=0,e.C[t*3]=P[0],e.C[t*3+1]=P[1],e.C[t*3+2]=P[2]}for(const M of y)e.I[e.ni++]=w+M[0],e.I[e.ni++]=w+M[1],e.I[e.ni++]=w+M[2]}const Ye=84*Math.PI/180;async function Ke(e,i,n,T,l){const h=l.K,m=l.a0||0,y=l.span||Math.PI*2,w=m+y,P=o=>{const a=Ye*(1-Math.pow(1-o/h,1.35));return[l.R*Math.pow(Math.cos(a),.85),l.Y+l.H*Math.sin(a)]},M=o=>(1-Math.sqrt(1-.7569*o*o))*2,t=o=>1-Math.pow(1-o,1.5),A=(o,a,s,f)=>{l.clamp&&(o=Math.min(w,Math.max(m,o))),f[0]=n+a*Math.cos(o),f[1]=s,f[2]=T+a*Math.sin(o)},C={kind:1};let r=l.N,p=m;for(let o=0;o<h;o++){await l.tick(),o===l.halveAt&&(r=r/2);const[a,s]=P(o),[f,u]=P(o+1),z=y/r,R=z*a,V=Math.hypot(f-a,u-s),v=.24*Math.min(R,V*1.2),F=.05*R;C.rib=Math.min(.25,Math.max(.07,.055*R));for(let _=l.clamp?-1:0;_<(l.clamp?r+1:r);_++){const B=p+_*z,S=B+z*.5;C.size=Math.min(l.sizes[i()*l.sizes.length|0],R/3.2),C.col=[.88+.22*i(),.94+.14*i(),.9+.2*i()],C.ribs=[1,1,0,1],C.aoFn=null,C.ao=.95,C.uo=i()*40,C.vo=i()*40,U(e,2,3,(I,H,N)=>{const j=t(H),G=I*2-1;A(B+.5*z*G*M(j),L(a,f,j)-F*(1-G*G)*Math.sin(Math.PI*j),L(s,u,j),N)},C),C.ribs=[1,0,1,0],C.aoFn=(I,H)=>1-.6*Math.sin(I*Math.PI*.5)*Math.sin(Math.PI*t(H));for(let I=1;I>=-1;I-=2){const H=I>0?B:B+z;C.uo=i()*40,C.vo=i()*40,U(e,2,3,(N,j,G)=>{const te=t(j),ae=H+I*.5*z*M(te),oe=Math.sin(N*Math.PI*.5);A(L(ae,S,N),L(a,f,te)+v*oe*Math.pow(Math.sin(Math.PI*te),.8),L(s,u,te),G)},C)}}p+=z*.5}await l.tick();const[d,c]=P(h),g=l.R/27;if(C.ribs=[0,0,1,0],C.aoFn=null,C.ao=.8,C.size=.32,C.rib=.1,U(e,Math.max(6,Math.round(r*(l.clamp,1))),2,(o,a,s)=>A(m+o*y,L(d,.9*g,a),c+.6*g*Math.sin(a*Math.PI*.5),s),C),l.boss){const o=[[.9,.6],[1.15,.2],[.7,-.3],[.95,-.8],[.4,-1.5],[0,-2.3]];U(e,10,5,(a,s,f)=>{const u=s*5,z=Math.min(4,Math.floor(u+1e-6)),R=u-z;A(a*Math.PI*2,L(o[z][0],o[z+1][0],R)*g,c+L(o[z][1],o[z+1][1],R)*g,f)},{kind:0,col:[.8,.66,.42],ao:.8})}l.back!==!1&&U(e,l.clamp?10:20,5,(o,a,s)=>{const f=a*Math.PI*.49;A(m+o*y,(l.R+2.5)*Math.cos(f),l.Y-1+(l.H+3)*Math.sin(f),s)},{kind:7,col:[.04,.05,.06]})}const pe=[[11,126],[11,24.355],[25,10.355],[25,-10.355],[11,-24.355],[11,-126],[-11,-126],[-11,-24.355],[-25,-10.355],[-25,10.355],[-11,24.355],[-11,126]];async function ht(e,i,n){const T=[.8,.66,.42],l=[.7,.67,.6],h=r=>({kind:1,rib:r||.25,sizes:n.sizes,ao:.95}),m=r=>({kind:0,col:T,ao:r===void 0?1:r}),y=r=>re(r,K,se,le),w=r=>re(r,27,se,le),P=(r,p)=>{let d=i()*60;for(let c=0;c<r.length-1;c++){const g=r[c],o=r[c+1],a=Math.hypot(o[0]-g[0],o[1]-g[1]),s=d;U(e,1,1,(f,u,z)=>{z[0]=L(g[0],o[0],f),z[1]=u*7.6,z[2]=L(g[1],o[1],f)},{kind:3,col:l,uvFn:(f,u,z,R,V)=>{R[0]=s+V*a,R[1]=u}}),d+=a}ve(e,r,!1,p,[[0,7.6],[.3,7.75],[.3,8.25],[0,8.6]],m(.95))},M=Math.atan2(27,K);for(const r of X){await Ke(e,i,0,r,{R:He,Y:me,H:Fe,K:9,N:n.N,halveAt:n.halveAt,sizes:n.sizes,boss:!0,tick:n.tick}),await n.tick();const p=[];for(let d=0;d<48;d++){const c=d/48*Math.PI*2;p.push([ge*Math.cos(c),r+ge*Math.sin(c)])}ve(e,p,!0,-1,[[0,le],[.5,le+.2],[.5,le+.55],[.1,le+.75],[.1,me]],m(.9));for(let d=-1;d<=1;d+=2)for(let c=-1;c<=1;c+=2)await n.tick(),J(e,i,6,3,2,2,(g,o,a)=>{const s=g<.5?g*2*M:M+(g-.5)*2*(Math.PI/2-M),f=Math.cos(s),u=Math.sin(s);let z,R,V;g<=.5?(z=K,R=Math.min(27,K*u/Math.max(f,1e-6)),V=w(R)):(R=27,z=Math.min(K,27*f/Math.max(u,1e-6)),V=y(z));const v=Math.sin(o*Math.PI/2),F=1-Math.cos(o*Math.PI/2);a[0]=d*L(z,ge*f,F),a[1]=L(V,le,v),a[2]=r+c*L(R,ge*u,F)},h(.22));await n.tick()}for(const r of[-90,-30,30,90])await n.tick(),J(e,i,12,1,2,2,(p,d,c)=>{const g=K*Math.sin((p-.5)*Math.PI);c[0]=g,c[1]=y(g),c[2]=r-3+6*d},h(.22));for(const r of X)for(let p=-1;p<=1;p+=2){await n.tick(),J(e,i,10,2,2,2,(g,o,a)=>{const s=27*Math.sin((g-.5)*Math.PI);a[0]=p*(K+6*o),a[1]=w(s),a[2]=r+s},h(.2)),await n.tick();const d=p*Y,c=p*(Y+1.6);for(const[g,o]of[[-27,-20],[-20,-13],[-13,-6],[6,13],[13,20],[20,27]]){const a=Math.max(1,Math.round((w((g+o)/2)-8.6)/7));J(e,i,1,a,2,2,(s,f,u)=>{const z=L(g,o,s);u[0]=d,u[1]=L(8.6,w(z),f),u[2]=r+z},h())}J(e,i,2,1,3,2,(g,o,a)=>{const s=L(-Q,Q,g);a[0]=d,a[1]=L(qe(s),w(s),o),a[2]=r+s},h()),U(e,1,1,(g,o,a)=>{a[0]=d,a[1]=L(8.6,ue,o),a[2]=r+L(-Q,Q,g)},m()),U(e,1,1,(g,o,a)=>{a[0]=L(d,c,o),a[1]=ue,a[2]=r+L(-Q,Q,g)},m(.75));for(let g=-1;g<=1;g+=2)U(e,1,1,(o,a,s)=>{s[0]=L(d,c,a),s[1]=L(ue,Be,o),s[2]=r+g*Q},m(.6));U(e,8,1,(g,o,a)=>{const s=L(-Q,Q,g);a[0]=L(d,c,o),a[1]=qe(s),a[2]=r+s},m(.55))}for(let r=-1;r<=1;r+=2){const p=[[r*Y,-147]];for(const d of[-90,-30,30,90]){await n.tick();const c=[[r*Y,d-3],[r*K,d-3],[r*K,d+3],[r*Y,d+3]];p.push(...c);for(let g=0;g<3;g++){const o=c[g],a=c[g+1];J(e,i,1,1,1,2,(s,f,u)=>{u[0]=L(o[0],a[0],s),u[1]=L(8.6,14.9,f),u[2]=L(o[1],a[1],s)},h(.22))}ve(e,c,!1,-r,[[0,14.9],[.45,15.2],[.45,16.2],[.15,16.4],[0,16.6]],m(.9))}p.push([r*Y,147]),await n.tick(),P(p,-r)}for(let r=-1;r<=1;r+=2){await n.tick();const p=r*147,d=r<0?9:10,c=r*150,g=r<0?()=>26:a=>re(a,10,se,29),o=(K+d)/2;for(const[a,s]of[[-K,-o],[-o,-d],[d,o],[o,K]]){const f=Math.max(1,Math.round((y((a+s)/2)-8.6)/7));J(e,i,1,f,2,2,(u,z,R)=>{const V=L(a,s,u);R[0]=V,R[1]=L(8.6,y(V),z),R[2]=p},h())}for(let a=-1;a<=1;a+=2)J(e,i,1,1,1,2,(s,f,u)=>{u[0]=a*L(K,Y,s),u[1]=L(8.6,14.9,f),u[2]=p},h(.22)),ve(e,[[a*Y,p],[a*K,p]],!1,-r*a,[[0,14.9],[.45,15.2],[.45,16.2],[.15,16.4],[0,16.6]],m(.9)),J(e,i,1,2,1,2,(s,f,u)=>{u[0]=a*d,u[1]=L(8.6,g(d),f),u[2]=L(p,c,s)},h(.2));J(e,i,r<0?2:4,1,2,2,(a,s,f)=>{const u=L(-d,d,a);f[0]=u,f[1]=L(g(u),y(u),s),f[2]=p},h()),U(e,10,1,(a,s,f)=>{const u=L(-d,d,a);f[0]=u,f[1]=g(u),f[2]=L(p,c,s)},m(.6))}await n.tick(),P([[-Y,-147],[-9,-147],[-9,-150]],-1),P([[9,-150],[9,-147],[Y,-147]],-1),await n.tick();const t=[[Y,147],[10,147],[10,150],[W,150],[W,Z]];for(let r=1;r<12;r++){const p=r/12*Math.PI;t.push([W*Math.cos(p),Z+W*Math.sin(p)])}t.push([-W,Z],[-W,150],[-10,150],[-10,147],[-Y,147]),P(t,-1),await n.tick();const A={kind:1,rib:.18,sizes:[.35,.5,.7,.9],ao:.9};for(let r=-1;r<=1;r+=2)J(e,i,3,1,1,2,(p,d,c)=>{c[0]=r*W,c[1]=L(8.6,se,d),c[2]=L(150,Z,p)},A);J(e,i,8,1,2,2,(r,p,d)=>{const c=r*Math.PI;d[0]=W*Math.cos(c),d[1]=L(8.6,se,p),d[2]=Z+W*Math.sin(c)},A),J(e,i,8,2,2,2,(r,p,d)=>{const c=W*Math.sin((r-.5)*Math.PI);d[0]=c,d[1]=re(c,W,se,30),d[2]=L(150,Z,p)},A),await n.tick(),await Ke(e,i,0,Z,{R:W,Y:se,H:14,K:6,N:12,halveAt:-1,a0:0,span:Math.PI,clamp:!0,sizes:[.3,.42,.6],boss:!1,tick:n.tick}),await n.tick();const C=[[-.7,0],[-.5,.5],[.5,.5],[.7,0]];if(U(e,16,3,(r,p,d)=>{const c=W*Math.sin((r-.5)*Math.PI),g=re(c,W,se,30),o=C[Math.round(p*3)],a=-c,s=14-g,f=Math.hypot(a,s)||1;d[0]=c+a/f*o[1],d[1]=g+s/f*o[1],d[2]=Z+o[0]},m(.85)),await n.tick(),n.floor){const r={kind:2,col:l};fe(e,[[-Y,-147],[Y,-147],[Y,147],[-Y,147]],pe,0,r),fe(e,[[-9,-150],[9,-150],[9,-147],[-9,-147]],null,0,r),fe(e,[[-10,147],[10,147],[10,150],[-10,150]],null,0,r);const p=[[-W,150],[W,150]];for(let d=0;d<=12;d++){const c=d/12*Math.PI;p.push([W*Math.cos(c),Z+W*Math.sin(c)])}fe(e,p,null,0,r)}await n.tick(),ve(e,pe,!0,-1,[[0,ye],[0,.26],[.1,.38],[1.1,.38],[1.25,.26],[1.25,0]],{kind:0,col:l,ao:.9})}const O=Math.PI*2,be=[0,0,0],ke=[0,0,0],Le=[0,0,0];function Ie(e,i,n,T,l,h){let m=-1,y=0,w=0,P=0,M=0,t=0,A=0;U(e,l,n,(C,r,p)=>{if(r!==m){m=r,i(Math.max(0,r-.01),be),i(Math.min(1,r+.01),ke),i(r,Le);let o=ke[0]-be[0],a=ke[1]-be[1],s=ke[2]-be[2];const f=Math.hypot(o,a,s)||1;o/=f,a/=f,s/=f;const u=Math.abs(a)>.9?1:0,z=Math.abs(a)>.9?0:1;y=a*0-s*z,w=s*u-o*0,P=o*z-a*u;const R=Math.hypot(y,w,P)||1;y/=R,w/=R,P/=R,M=a*P-s*w,t=s*y-o*P,A=o*w-a*y}const d=C*O,c=Math.cos(d)*T,g=Math.sin(d)*T;p[0]=Le[0]+y*c+M*g,p[1]=Le[1]+w*c+t*g,p[2]=Le[2]+P*c+A*g},h)}function Se(e,i,n,T,l,h,m,y){const w=l.length-1;U(e,m,w,(P,M,t)=>{const A=l[Math.round(M*w)],C=P*O;t[0]=i+A[0]*h*Math.cos(C),t[1]=n+A[1]*h,t[2]=T+A[0]*h*Math.sin(C)},y)}function Je(e,i,n){const T=e.length-1,l=Math.min(Math.max(i,0),.99999)*T,h=Math.floor(l),m=l-h,y=e[Math.max(h-1,0)],w=e[h],P=e[h+1],M=e[Math.min(h+2,T)];for(let t=0;t<2;t++)n[t]=.5*(2*w[t]+(P[t]-y[t])*m+(2*y[t]-5*w[t]+4*P[t]-M[t])*m*m+(3*w[t]-y[t]-3*P[t]+M[t])*m*m*m)}const Qe=[[1.2,11.3],[2.6,10.6],[4,9.5],[5.6,8],[7,6],[8.3,3.8],[9,1.5],[9.75,.95],[10.25,1.55]],dt=[[0,.75],[.35,1],[.62,1.5],[.3,2],[.22,2.6],[.5,3.2],[.22,3.9],[.18,5.5],[.48,6],[.2,6.6],[.18,9],[.5,9.5],[.25,10.2],[.9,11],[1.35,11.4],[.9,11.9],[.35,12.6],[.52,13.2],[.2,13.8]],xe=[9,7,4],we=[1.5,6,9.5];async function $e(e,i,n,T,l,h,m,y){const w=T[0],P=T[1],M=T[2],t=l<.9?.72:1,A=n>0,C={kind:4,col:[.62,.66,.7],ec:n},r={kind:6,col:[.8,.82,.8],ec:n,w:0,uvFn:(v,F,_,B,S,I)=>{B[0]=S,B[1]=I}},p=(v,F,_,B)=>{B[0]=w+v*l*Math.cos(_),B[1]=P+F*l,B[2]=M+v*l*Math.sin(_)},d=[0,0],c=[0,0,0],g=()=>m.thin();for(let v=0;v<3;v++)U(e,A?32:48,6,(F,_,B)=>{const S=_*O;p(xe[v]+.62*Math.cos(S),we[v]+.15*Math.sin(S),F*O,B)},C);for(let v=0;v<3;v++){const F=m.candles[v],_=A?3:v;r.w=_;for(let B=0;B<F;B++){(B&15)===0&&await m.tick();const S=(B+.5*(v&1))/F*O;p(xe[v]+(B&1?.38:-.38),we[v]+.15,S,c);const I=c[0],H=c[1],N=c[2],j=(.8+.45*i())*t;Se(e,I,H,N,[[.1,0],[.38,.12],[.44,.3]],t,6,C),U(e,5,1,(G,te,ae)=>{const oe=(.135-.02*te)*t,Ae=G*O;ae[0]=I+oe*Math.cos(Ae),ae[1]=H+.1*t+te*j,ae[2]=N+oe*Math.sin(Ae)},r),y.flames.push(I,H+.1*t+j-.02,N,n,.62*t,i(),_,0),B%5===0&&y.flames.push(I,H+.1*t+j+.3,N,n,3.4*t,i(),_,1)}}for(let v=0;v<m.ribs;v++){const F=v/m.ribs*O;(v&3)===0&&await m.tick(),Ie(e,(_,B)=>{Je(Qe,_,d),p(d[0],d[1],F,B)},16,.11*t,4,C)}await m.tick(),Se(e,w,P,M,dt,l,10,C);for(let v=0;v<3;v++)for(let F=0;F<6;F++){const _=(F+.5*v)/6*O;Ie(e,(B,S)=>p(L(.2,xe[v]-.6,B),we[v],_,S),1,.07*t,4,C)}y.lowerEnd=e.ni,A||y.flames.push(w,P,M,n,44*l,.5,0,2),await m.tick();const o=P+13.8*l,a=1.3*t,s=Math.max(2,Math.floor((h-o)/a));for(let v=0;v<s;v++){const F=o+(v+.5)*(h-o)/s,_=v&1?0:1,B=v&1?1:0,S=(h-o)/s*.64;Ie(e,(I,H)=>{const N=I*O;H[0]=w+_*.34*t*Math.cos(N),H[1]=F+S*Math.sin(N),H[2]=M+B*.34*t*Math.cos(N)},8,.085*t,4,C)}Se(e,w,P+14.2*l,M,[[.2,-.3],[1.5,-.12],[1.6,.1],[.3,.42]],t,12,C),await m.tick();const f=(v,F,_,B,S,I)=>{g()?y.drops.push(v,F,_,n,B*t,S*t,i(),I):i()},u=.5,z=A?Math.round(m.strings*.45):m.strings;for(let v=0;v<z;v++){const F=(v+.5)/z*O,_=A?13:24;for(let B=0;B<_;B++)Je(Qe,.04+.71*(B+.5*(v&1))/_,d),p(d[0]*.985,d[1]+.1,F,c),f(c[0],c[1],c[2],u,.24,.25)}await m.tick();const R=A?[40,30,18]:[120,90,56];for(let v=0;v<3;v++)for(let F=0;F<R[v];F++){const _=(F+.25)/R[v]*O,B=v===0?A?2:3-(F&1):3+(F%4===0?3:F&1);p(xe[v]+(F&1?.62:-.62),we[v]-.14,_,c);for(let S=0;S<B;S++){const I=S===B-1&&F%4===0;f(c[0],c[1]-S*u*t*1.03,c[2],u*(v===0?.94:1),I?.36:.24,.4+S*.5)}}await m.tick();for(let v=0;v<3;v++)for(let F=0;F<m.ribs;F++)for(let _=0;_<2;_++){const B=v===2?6:9,S=(_?1.5:.8)*(v===2?.7:1);for(let I=0;I<B;I++){const H=(I+.5)/B;p(xe[v]+.66+_*.1,we[v]-.1-S*4*H*(1-H),(F+H)/m.ribs*O,c),f(c[0],c[1],c[2],u*.9,.22,.5+_*.3)}}await m.tick();const V=A?8:20;for(let v=0;v<V;v++)for(let F=0;F<(A?9:20);F++){const _=(F+.5)/(A?9:20);p(L(1.3,.62,_)+4.6*Math.pow(Math.sin(Math.PI*_),.9),L(11.1,1.7,_),(v+.5*(F&1))/V*O,c),f(c[0],c[1],c[2],u,.22,.35)}for(let v=0;v<8;v++)p(.5,1,v/8*O,c),f(c[0],c[1],c[2],.45,.24,.6);y.drops.push(w,P+1*l,M,n,.6*t,.5*t,i(),.6);for(let v=0;v<24;v++)p(1.36,11.35,v/24*O,c),f(c[0],c[1],c[2],u,.24,.5)}function Xe(e,i,n){const T=new x.PlaneGeometry(1,1);T.translate(0,i,0);const l=new x.InstancedBufferGeometry;l.index=T.index,l.setAttribute("position",T.getAttribute("position"));const h=e.length/8;let m=0;for(let M=0;M<h;M++)n(M)&&m++;const y=new Float32Array((h+m)*4),w=new Float32Array((h+m)*4);let P=0;for(let M=0;M<2;M++)for(let t=0;t<h;t++)if(!(M&&!n(t))){for(let A=0;A<4;A++)y[P*4+A]=e[t*8+A],w[P*4+A]=e[t*8+4+A];M&&(w[P*4]=-w[P*4]),P++}return l.setAttribute("iA",new x.InstancedBufferAttribute(y,4)),l.setAttribute("iB",new x.InstancedBufferAttribute(w,4)),l.instanceCount=P,l}function vt(e){const i=(w,P=1)=>{const M=new x.Color(e[w]);return[M.r*P,M.g*P,M.b*P]},n=(w,P,M,t=1)=>[L(w[0],P[0],M)*t,L(w[1],P[1],M)*t,L(w[2],P[2],M)*t],T=i(1),l=i(3),h=i(4),m=[1,.64,.28],y={flame:[m[0],m[1],m[2],3.1],lit:[1,1,1,1],winTop:i(1,3),winBot:n(l,h,.5,.45),winGain:[1,1],stain:.85,winFill:n(T,h,.03,.9),amb:n(T,h,.07,.62),beamDir:[[-1,.5,.15],[1,.5,-.15]],beamCol:[i(1,1.7),i(1,1.7)],caus:i(3,.5),gain:[.5,.18,.45],body:n(i(2),h,.05,.55),spark:[3,2.5,1.7],deep:i(2,.12),dropGain:4.5,halo:.04,portal:i(3,2.5),glit:[.022,.26,1,1.3],ghost:[0,0,0],dropLit:.12,dropSide:0,roomLo:[.1,.066,.038],roomHi:[.012,.022,.06],jewel:[1.6,.6,1],lamp:[2.1,1.2,.42,34]};return{dusk:y,noon:{...y,lit:[.85,.85,.85,.85],winTop:[.25,.45,.9],winBot:[.7,.8,.85],winGain:[2.4,.9],stain:1,winFill:[.22,.24,.26],amb:[.088,.084,.078],beamDir:[[-1,.62,.2],[1,.5,-.15]],beamCol:[[4.6,4.3,3.6],[.1,.14,.2]],caus:[.85,.8,.6],gain:[.5,.13,.45],body:[.03,.045,.045],spark:[2.7,2.4,1.8],dropGain:7,halo:.03,glit:[.022,.27,1,.9],dropLit:.5,dropSide:.4,roomLo:[.2,.145,.08],roomHi:[.02,.03,.07],jewel:[.55,.55,1]},moon:{...y,lit:[0,0,0,0],winTop:[.14,.22,.4],winBot:[.26,.36,.5],winGain:[1.8,.6],stain:.6,winFill:[.08,.12,.2],amb:[.034,.048,.075],beamDir:[[-1,.9,.3],[1,.5,-.15]],beamCol:[[.3,.4,.6],[0,0,0]],caus:[.12,.2,.3],spark:[1,1.3,1.9],dropGain:14,halo:0,glit:[.02,.26,1,2],ghost:[.34,.46,.72],dropLit:.5,dropSide:1,roomLo:[.04,.056,.1],roomHi:[.014,.028,.075],jewel:[1.3,0,1]},snow:{...y,lit:[1,0,0,.3],winTop:[.16,.2,.28],winBot:[.42,.46,.5],winFill:[.05,.065,.09],amb:[.028,.036,.048],beamCol:[[.09,.11,.15],[.09,.11,.15]],spark:[2.3,2,1.5],glit:[.02,.24,1,1.6],jewel:[1.5,.7,.9]}}}async function xt(e,i={}){const n=e.rng.fork?e.rng.fork("million-mirrors-hero"):e.rng,T=e.rng.fork?e.rng.fork("million-mirrors-thin"):e.rng,l=e.quality&&e.quality.detail||1,h=()=>e.yield?e.yield():Promise.resolve(),m=i.palette&&i.palette.length>=6?i.palette:Ze,y=vt(m),w={N:n.pick([28,32,32,36]),halveAt:n.pick([-1,7,8]),sizes:n.pick([[.5,.7,.95,1.3],[.6,.85,1.2,1.4],[.45,.6,.8,1.1,1.4]]),ribs:n.pick([10,12,16]),strings:n.int(36,44),spin:n.sign(),causScale:n.range(.19,.24),tilt:n.range(.26,.34),rhombus:n.range(.25,.6),seed:n.range(1,50)},P=k=>new x.Vector3(k[0],k[1],k[2]),M=i.lesser!==!1,t={uTime:{value:0},uCamL:{value:new x.Vector3(0,9,-200)},uPix:{value:.0026},uFlame:{value:new x.Vector4},uLit:{value:new x.Vector4(1,1,1,1)},uWinTop:{value:new x.Vector3},uWinBot:{value:new x.Vector3},uWinGain:{value:new x.Vector2(1,1)},uStain:{value:0},uCausCol:{value:new x.Vector3},uPortalCol:{value:new x.Vector3},uBurstPos:{value:[new x.Vector3(80,30,0),new x.Vector3(-80,30,0)]},uBurstCol:{value:[new x.Vector3,new x.Vector3]},uBody:{value:new x.Vector3},uSpark:{value:new x.Vector3},uCh:{value:[new x.Vector4(0,$,0,ee),new x.Vector4(0,he,X[0],Te),new x.Vector4(0,he,X[4],Te)]},uVar:{value:new x.Vector4(w.seed,w.causScale,w.tilt,w.rhombus)},uIgnite:{value:1e4},uAmb:{value:new x.Vector3},uWinFill:{value:new x.Vector3},uStucco:{value:new x.Vector3(.8,.63,.36)},uInlay:{value:P(new x.Color(m[3]).multiplyScalar(.55).toArray())},uBeamDir:{value:[new x.Vector3(-1,.5,0),new x.Vector3(1,.5,0)]},uBeamCol:{value:[new x.Vector3,new x.Vector3]},uGain:{value:new x.Vector3(.42,.5,.3)},uSpin:{value:new x.Vector3},uDeep:{value:new x.Vector3},uDropGain:{value:4},uHalo:{value:.16},uGlit:{value:new x.Vector4(.022,.26,1,1.3)},uGhost:{value:new x.Vector3},uDropLit:{value:.12},uDropSide:{value:0},uRoomLo:{value:new x.Vector3},uRoomHi:{value:new x.Vector3},uJewel:{value:new x.Vector3(1,1,1)},uLamp:{value:new x.Vector4(0,0,0,34)},uFacetPx:{value:6}};let A="dusk";const C=k=>{const b=typeof k=="string"?y[k]||y.dusk:{...y[A],...k};typeof k=="string"&&y[k]&&(A=k),t.uFlame.value.fromArray(b.flame),t.uLit.value.fromArray(b.lit),M||(t.uLit.value.w=0),t.uWinTop.value.fromArray(b.winTop),t.uWinBot.value.fromArray(b.winBot),t.uWinGain.value.fromArray(b.winGain),t.uStain.value=b.stain,t.uWinFill.value.fromArray(b.winFill),t.uAmb.value.fromArray(b.amb);for(let D=0;D<2;D++)t.uBeamDir.value[D].fromArray(b.beamDir[D]).normalize(),t.uBeamCol.value[D].fromArray(b.beamCol[D]);t.uCausCol.value.fromArray(b.caus),t.uGain.value.fromArray(b.gain),t.uBody.value.fromArray(b.body),t.uSpark.value.fromArray(b.spark),t.uDeep.value.fromArray(b.deep),t.uDropGain.value=b.dropGain,t.uHalo.value=b.halo,t.uPortalCol.value.fromArray(b.portal),t.uGlit.value.fromArray(b.glit),t.uGhost.value.fromArray(b.ghost),t.uDropLit.value=b.dropLit,t.uDropSide.value=b.dropSide||0,t.uRoomLo.value.fromArray(b.roomLo),t.uRoomHi.value.fromArray(b.roomHi),t.uJewel.value.fromArray(b.jewel),t.uLamp.value.fromArray(b.lamp)};C(i.look||"dusk");const r=()=>x.UniformsUtils.clone(x.UniformsLib.fog),p=(k,b,D)=>new x.ShaderMaterial({uniforms:{...r(),...t,uMirror:{value:b}},defines:k,vertexShader:at,fragmentShader:ot,fog:!0,side:x.DoubleSide,...D}),d=new x.Group;d.name="million-mirrors-hero";const c=(k,b,D)=>{const ie=new x.Mesh(k,b);return ie.frustumCulled=!1,ie.renderOrder=D||0,d.add(ie),ie},g=Pe(72e3,26e4);await ht(g,n,{N:w.N,halveAt:w.halveAt,sizes:w.sizes,floor:i.floor!==!1,tick:h}),await h();const o=e.quality&&e.quality.level==="low"?{MM_LITE:1}:{},a=p({...o},0);c(await ft(g,h),a,0),await h();const s=Pe(64,128);fe(s,pe,null,ye,{kind:5,col:[.03,.09,.085]}),c(Ee(s),p({},0,{depthWrite:!1}),-.5);const f=Pe(64,128);fe(f,pe,null,$,{kind:0});const u=new x.ShaderMaterial({uniforms:{...r(),...t},vertexShader:it,fragmentShader:st,fog:!0,transparent:!0,depthWrite:!1,premultipliedAlpha:!0,side:x.DoubleSide}),z=c(Ee(f),u,1);await h();const R=Pe(3e4,11e4),V={flames:[],drops:[],lowerEnd:0},v=()=>T()<.5+.5*l,F=me+Fe*Math.sin(Ye)-2.2;await $e(R,n,0,[0,$,0],ee,F,{candles:[120,80,40],ribs:w.ribs,strings:w.strings,thin:v,tick:h},V);const _=V.lowerEnd;if(await h(),M)for(let k=1;k<=2;k++)await $e(R,n,k,[0,he,k===1?X[0]:X[4]],Te,F,{candles:[44,30,16],ribs:10,strings:w.strings,thin:v,tick:h},V),await h();await h();const B=Ee(R),S=p({MM_FRAME:1},0);c(B,S,0),await h();const I=new x.BufferGeometry;for(const k of["position","normal","aUv","aEdge","aMat","aCol"])I.setAttribute(k,B.getAttribute(k));I.setIndex(B.getIndex()),I.setDrawRange(0,_),c(I,p({MM_FRAME:1},1,{transparent:!0}),2);const H=(k,b)=>new x.ShaderMaterial({uniforms:{...r(),...t},vertexShader:k,fragmentShader:b,fog:!0,transparent:!0,depthWrite:!1,blending:x.AdditiveBlending,side:x.DoubleSide}),N=H(lt,rt),j=H(nt,ct);await h(),c(Xe(V.drops,-.5,k=>V.drops[k*8+3]<.5),N,3),await h(),c(Xe(V.flames,.5,k=>V.flames[k*8+7]<1.5),j,4);const G=(k,b,D)=>new x.Vector3(k,b,D),te={offset:G(0,0,150),portalSeat:{position:G(0,12,180),normal:G(0,0,-1),radius:7},doors:{hingeL:G(-9,0,-150),hingeR:G(9,0,-150),width:9,height:26,z:-150},entry:G(0,9,-150),flyThrough:[[0,9,-212],[0,9,-190],[0,9,-168],[0,8.6,-150],[-.3,6.6,-136],[-1.8,5.6,-124],[-3.8,5.3,-113],[-5.3,7.2,-102],[-8.2,10.6,-92.5],[-11,14.5,-84],[-13,19,-76.5],[-14.6,22.8,-69],[-15.4,24.6,-61],[-14.6,24.8,-52],[-11.5,23.6,-42.5],[-7.5,21.4,-33.5],[-6,20.5,-25],[-12,23,-17],[-19,27,-8],[-20.6,30,3],[-15.6,32,14.6],[0,33,20.2],[14,30.5,15.6],[21,25.5,8],[25,19.5,.5],[27,13.6,-7],[26,10.2,-13.5],[20.5,8.2,-24],[11,6,-38.5],[0,3.6,-45],[-13.5,3.7,-39.5],[-22.5,5,-24],[-25.5,6.5,-4],[-22,5.6,16],[-14,5,36],[-5,4.6,54],[0,4.8,72],[0,7.5,94],[0,10.6,112],[0,12,130],[0,12,180]].map(k=>G(k[0],k[1],k[2])),orbit:{center:G(0,5,0),radius:25,yTop:25.5,yLow:3.6},globe:{center:G(0,$,0),radius:10.25*ee,height:11.3*ee,scale:ee},chandelier:{center:G(0,5*ee,0),top:G(0,$+13.8*ee,0),collar:G(0,$+14.2*ee,0),collarRadius:1.5,chainTop:G(0,F,0)},collar:G(0,$+14.2*ee+.4,0),perchY:$+14.2*ee+.52,cornice:[-90,-30,30,90].flatMap(k=>[G(-28.6,16.6,k),G(28.6,16.6,k)]),lesser:M?[G(0,he,X[0]),G(0,he,X[4])]:[],domes:X.map(k=>({center:G(0,me,k),rim:He,crownY:me+Fe})),closePass:G(16,44,-55),windows:X.flatMap(k=>[-1,1].map(b=>({position:G(b*Y,ue,k),normal:G(-b,0,0),width:Q*2,sill:ue,spring:Be,apex:De,depth:1.6}))),pool:{waterY:$,floorY:ye,halfWidth:11,zMin:-126,zMax:126,basin:25,outline:pe.map(k=>[k[0],k[1]]),rimHeight:.38,rimWidth:1.25,koiY:-1.1,koiRadius:[8,19]},niche:{z0:et,zCenter:Z,radius:W,archHalfWidth:10,archApex:29},viewpoints:{doors:{position:G(0,9,-142),target:G(0,8,0)},closePass:{position:G(16,44,-55),target:G(0,5,0)},above:{position:G(0,38,22),target:G(0,6,0)},waterline:{position:G(0,3.6,-45),target:G(0,$,0)},apse:{position:G(0,12,110),target:G(0,12,180)}},extent:{min:G(-36.6,ye,-150),max:G(36.6,63,184)}},ae=new x.Matrix4,oe=new x.Vector2;return{object:d,radius:13,height:24,center:G(0,8,0),anchors:te,ground:!1,groundY:0,uniforms:t,materials:{hall:a,frame:S,water:u,drops:N,flames:j},waterMesh:z,variant:w,looks:y,makeMaterial(k={},b={}){return p({...o,...k},0,b)},setLook:C,setProgress(k){const b=Math.min(1,Math.max(0,(k-.03)/.09));t.uIgnite.value=k>=.12?1e4:L(-170,260,b*b*(3-2*b))},setBurst(k,b,D,ie=1){const Ve=k?1:0;b&&t.uBurstPos.value[Ve].copy(b);const Ce=new x.Color(D||"#ffffff");t.uBurstCol.value[Ve].set(Ce.r*ie,Ce.g*ie,Ce.b*ie)},setPortalColor(k,b=2.5){const D=new x.Color(k);t.uPortalCol.value.set(D.r*b,D.g*b,D.b*b)},update(k,b,D){t.uTime.value=b,d.updateWorldMatrix(!0,!1),ae.copy(d.matrixWorld).invert(),t.uCamL.value.setFromMatrixPosition(D.matrixWorld).applyMatrix4(ae),e.renderer&&(e.renderer.getDrawingBufferSize(oe),t.uPix.value=2/(Math.max(D.projectionMatrix.elements[5],.001)*Math.max(oe.y,1)),t.uFacetPx.value=Math.max(2.3,.0135*oe.y)),t.uSpin.value.set(w.spin*b*O/90,-w.spin*b*O/140+1,w.spin*b*O/120+2)},dispose(){}}}export{tt as MM_GLASS,xt as buildHero};
