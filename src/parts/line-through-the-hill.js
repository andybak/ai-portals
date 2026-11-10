import*as l from"three";import"three/addons/utils/BufferGeometryUtils.js";import{clamp as fe,lerp as te,smoothstep as Ye}from"../kit/core.js";const u0=["#D8C39B","#B9A57C","#3B3937","#1F1D1C","#8C5C8E","#CF6A32","#DCAA3C"],Vt=["uTan","uTan2","uGraph","uBlack","uMauve","uOrange","uOchre"];function Zt(c){const d={uTime:{value:0},uOld:{value:0},uCross:{value:0}};return Vt.forEach((x,h)=>{d[x]={value:new l.Color(c&&c[h]||u0[h])}}),d}const yt=Zt();function U0(c){Vt.forEach((d,x)=>{c&&c[x]&&yt[d].value.set(c[x])})}const v0=`
attribute float aN; attribute float aWax;
uniform float uTime;
#ifdef LH_INST
attribute float aWaxI; attribute vec4 aTrain;
varying vec4 vTrain;
#endif
varying vec3 vP; varying vec2 vUv; varying float vN; varying float vWax;
#ifdef LH_SEED
attribute vec3 aSC; attribute vec4 aSA; varying vec3 vSC; varying vec4 vSA;   // a mound's own seed arch, the same at every vertex of the mound
#endif
void main(){
  vec4 p = vec4(position, 1.0);
  vWax = aWax;
#ifdef LH_SEED
  vSC = aSC; vSA = aSA;
#endif
#ifdef LH_RIB
  // the shiver inside a tunnel: every few seconds one ripple runs down the ribs, each drawn in a hand's breadth as it passes
  // (inward, so no rib is pushed through the pressed black behind it)
  float lhPh = fract((instanceMatrix[3].z + instanceMatrix[3].x * 0.3 - uTime * 40.0) / 240.0) - 0.5;
  p.xy *= 1.0 - 0.035 * exp(-lhPh * lhPh * 700.0);
#endif
#ifdef LH_INST
  p = instanceMatrix * p; vWax += aWaxI; vTrain = aTrain;
#endif
  vP = p.xyz; vUv = uv; vN = aN;
  gl_Position = projectionMatrix * modelViewMatrix * p;
}`,zt=`
uniform float uTime; uniform float uOld;
uniform vec3 uTan, uTan2, uGraph, uBlack, uMauve, uOrange, uOchre;
float lhHash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float lhNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(lhHash(i), lhHash(i+vec2(1,0)), f.x), mix(lhHash(i+vec2(0,1)), lhHash(i+vec2(1,1)), f.x), f.y); }
// a surface-fixed 2D coordinate for any mesh-local point (skewed so no wall is degenerate)
vec2 lhSuv(vec3 p){ return vec2(p.x + p.z * 0.73, p.y * 0.94 + p.z * 0.41 - p.x * 0.11); }
// paper tooth 0..1, filtered to its mean (0.5) when finer than about 3 px
float lhTooth(vec2 suv, float fw){
  float t = lhNoise(suv * 9.0) * 0.6 + lhNoise(suv * 23.0 + 7.1) * 0.4;
  return mix(t, 0.5, smoothstep(0.03, 0.11, fw)); }
// pasted sheets: returns xyz = paper colour, w = this sheet's line offset in metres (lines miss across a seam)
vec4 lhSheet(vec2 suv, float size, float fw){
  vec2 q = suv / size; q += 0.18 * vec2(lhNoise(q.yy * 0.7 + 3.0), lhNoise(q.xx * 0.7 + 9.0)) ;
  q.x += 0.37 * floor(q.y);
  vec2 id = floor(q), f = fract(q);
  float h = lhHash(id + 0.5), h2 = lhHash(id + 17.5);
  float e = min(min(f.x, 1.0 - f.x), min(f.y, 1.0 - f.y)) * size;      // metres to the seam
  float w = max(fw, 0.02);
  float stain = (1.0 - smoothstep(0.25, 0.75 + w, e)) * 0.75;
  float seam = (1.0 - smoothstep(0.0, 0.09 + w, e)) * 0.6 * clamp(0.14 / w, 0.0, 1.0);
  vec3 c = mix(uTan, uTan2, step(0.62, h) * (0.6 + 0.4 * h2));
  c = mix(c, uTan2, uOld * 0.55);
  // foxing and old creases: soft browner blots, and a fold line every 70 m or so running one way across the sheets
  float blot = smoothstep(0.56, 0.82, lhNoise(suv * 0.019 + 5.0)) * (0.3 + 0.25 * uOld);
  float cr = abs(fract(dot(suv, vec2(0.0127, 0.0061)) + 0.3 * lhNoise(suv * 0.004)) - 0.5) * 71.0;
  float crease = (1.0 - smoothstep(0.0, 0.25 + w, cr)) * 0.5 * clamp(0.5 / w, 0.0, 1.0);
  c = mix(c, uTan2, max(blot, crease));
  c = mix(c, uTan2, stain * (1.0 + uOld * 0.3)); c = mix(c, uGraph, seam);
  return vec4(c, (h - 0.5) * 0.16); }
// distance in metres from p to a D-shaped mouth arch standing in space (c = sill centre, a = nx, nz, half width, leg)
vec2 lhMouthSD(vec3 p, vec3 c, vec4 a){
  vec3 d = p - c; float w = d.x * a.x + d.z * a.y; float u = d.x * a.y - d.z * a.x; float v = d.y - a.w;
  float sd;
  if (v > 0.0) sd = length(vec2(u, v)) - a.z;
  else { vec2 b = vec2(abs(u) - a.z, -d.y); sd = (b.x > 0.0 && b.y > 0.0) ? length(b) : max(b.x, b.y); }
  return vec2(sd, w); }
float lhMouthN(vec3 p, vec3 c, vec4 a){ vec2 s = lhMouthSD(p, c, a); return length(vec2(max(s.x, 0.0), s.y)); }
float lhBand(float n, float sp, float fw, float run){
  float f = n / sp, fr = fract(f);
  float d = min(fr, 1.0 - fr) * sp;
  float lw = max(0.15, 0.8 * fw);
  float line = clamp((lw - d) / max(fw, 1e-4) + 0.5, 0.0, 1.0) * min(1.0, 0.24 / lw);
  float r = max(0.0, 1.0 - fr / 0.68);
  float rub = min(0.94, r * mix(r, 1.0, 0.45) * 0.93 * run);
  return max(line, rub); }
// THE MARK. n metres from the mouth arch (already wobbled, shivered); fw = fwidth(n); returns graphite cover 0..1
float lhEcho(float n, float fw, float tooth){
  float run = 0.6 + 0.75 * smoothstep(0.1, 0.95, sin((n - uTime * 9.0) * 0.052 + 1.7 * sin(n * 0.011)));
  float L = clamp(log2(max(fw, 1e-4) * 7.0 / 2.5), 0.0, 4.0);           // far fields keep their echoes: 20 and 40 m bands
  float l0 = min(floor(L), 3.0), k = smoothstep(0.2, 0.8, L - l0);
  float sp = 2.5 * exp2(l0);
  float c = mix(lhBand(n, sp, fw, run), lhBand(n, sp * 2.0, fw, run), k);
  float mean = 0.27 * run + 0.04;
  c = mix(c, mean, smoothstep(9.0, 14.0, fw));                          // 40 m band under ~4 px: one flat rubbed tone
  float fleck = smoothstep(0.2, 0.62, tooth + c * 0.55);                // tooth shows as tan flecks in the rub
  return c * mix(0.84, 1.0, max(fleck, smoothstep(0.45, 0.8, c))) * 1.06; }   // (never in the line itself: a line stays whole)
// graphite dragged over the sheet: a coarser grain the rub catches on, neutral (1.0) once finer than a few pixels
float lhDrag(vec2 suv, float fw){
  float d = lhNoise(suv * vec2(2.3, 4.1)) * 0.55 + lhNoise(suv * vec2(7.3, 5.1) + 3.3) * 0.45;
  float d2 = lhNoise(suv * vec2(0.55, 0.9) + 11.0);                      // and a broader unevenness of pressure along a band
  return 1.0 + 0.08 * (smoothstep(0.2, 0.8, d) - 0.5) * (1.0 - smoothstep(0.03, 0.1, fw))
             + 0.1 * (smoothstep(0.25, 0.75, d2) - 0.5) * (1.0 - smoothstep(0.12, 0.4, fw)); }
// wax crayon band: v 0..1 across the band, wd its width in metres, x metres along, wax colour; graphite both edges,
// rub on the v=0 side, paper flecks where the wax skipped
vec3 lhWax(vec3 wax, vec3 paper, float v, float wd, float x, vec2 suv, float fwv, float fws){
  float t = lhNoise(vec2(x * 0.9, v * wd * 7.0) + suv * 0.3) * 0.55 + lhNoise(vec2(x * 2.4, v * wd * 17.0) + 3.7) * 0.45;   // skips run along the stroke
  t = mix(t, 0.5, smoothstep(0.03, 0.1, fws));
  float run = smoothstep(0.1, 0.95, sin((x - uTime * 9.0) * 0.07 + suv.y * 0.02));   // the wax is still being pressed
  float skip = 1.0 - smoothstep(0.2 - 0.13 * run, 0.4 - 0.2 * run, t);
  vec3 c = mix(wax, paper, skip * mix(0.22, 0.7, smoothstep(8.0, 30.0, 1.0 / max(gl_FragCoord.w, 1e-4))));   // right beside the eye the wax lies closer
  float ev = min(v, 1.0 - v) * wd; float few = max(fwv * wd, 1e-4);
  float lw = max(0.07, 0.8 * few);
  float edge = clamp((lw - ev) / few + 0.5, 0.0, 1.0) * min(1.0, 0.12 / lw);
  float rub = max(0.0, 1.0 - v / (0.4 + 0.25 * run)); rub = rub * rub * (0.3 + 0.45 * run) * (0.6 + 0.4 * smoothstep(0.3, 0.6, t));
  return mix(c, uGraph, max(edge * 0.95, rub)); }
`,d0=`
varying vec3 vP; varying vec2 vUv; varying float vN; varying float vWax;
`+zt;function Ne(c,d={},x={}){return new l.ShaderMaterial({uniforms:{...d.un||yt,...x},vertexShader:v0,fragmentShader:d0+c,side:d.side??l.FrontSide,defines:{...d.instanced?{LH_INST:1}:{},...d.defines||{}}})}function kt(c={}){const d=(c.mouths||[]).slice(0,12),x=d.length,h={uSheet:{value:c.sheet??110},uShv1:{value:-1},uLift:{value:c.lift??0}};x&&(h.uMP={value:d.map(y=>new l.Vector3(y.p[0],y.p[1],y.p[2]))},h.uMA={value:d.map(y=>new l.Vector4(y.n[0],y.n[1],y.r??8,y.leg??2))},h.uShv={value:d.map(()=>-1)},h.uInk={value:d.map(y=>new l.Vector4(y.ink??0,y.bands??0,y.par??0,y.bw??2.5))});const b=Ne(`
#ifdef LH_MOUTHS
uniform vec3 uMP[LH_MOUTHS]; uniform vec4 uMA[LH_MOUTHS]; uniform float uShv[LH_MOUTHS]; uniform vec4 uInk[LH_MOUTHS];
#endif
uniform float uShv1; uniform float uSheet; uniform float uLift;
#ifdef LH_SEED
varying vec3 vSC; varying vec4 vSA;
#endif
void main(){
  vec2 suv = lhSuv(vP);
  float fws = length(fwidth(suv)) * 0.7;
  vec4 sh = lhSheet(suv, uSheet, fws);
  float tintV = vWax; vec4 ink = vec4(0.0, 0.0, 0.0, 2.5);
#ifdef LH_SEED
  // a seeded mound's aWax = sheet tan (0..1) + 2 * rub step (0..4) + 16 * crayon bands (0..4), the same at all its vertices
  float wv = vWax + 0.01; ink.y = floor(wv / 16.0); wv -= ink.y * 16.0; ink.x = floor(wv / 2.0); tintV = wv - ink.x * 2.0; ink.x *= 0.25;
  ink.z = step(0.5, fract(vSC.x * 0.137 + vSC.z * 0.071)); ink.w = max(2.5, floor(vSA.z * 0.3 / 2.5) * 2.5);
  if (vP.y < vSC.y) ink.y = 0.0;
#endif
  sh.rgb = mix(sh.rgb, uTan2, clamp(tintV, 0.0, 1.0) * 0.85);              // per-vertex sheet tan (aWax 0..1): the world's pasted ground sheets
  float n = vN; float shv = uShv1;
#ifdef LH_SEED
  n = lhMouthN(vP, vSC, vSA);                                            // round arcs however coarse the mound's mesh
#endif
#ifdef LH_MOUTHS
  n = 1e5;
  float hole = 0.0;
  for (int i = 0; i < LH_MOUTHS; i++) {
    vec2 s = lhMouthSD(vP, uMP[i], uMA[i]);
#ifdef LH_LEGS
    // below its sill a mouth's echoes do not wrap under it (an eye): its legs run straight down as ruled verticals, and
    // the strip under the sill is ruled inward from both legs (a pier), until another mouth's field takes over
    vec3 dd = vP - uMP[i];
    if (dd.y < 0.0) s.x = abs(abs(dd.x * uMA[i].y - dd.z * uMA[i].x) - uMA[i].z);
    else
#endif
    if (s.x < -0.05 && abs(s.y) < 5.0) hole = 1.0;                       // the D is a real opening in the sheet
    float d = length(vec2(max(s.x, 0.0), s.y));
    if (d < n) { n = d; shv = uShv[i]; ink = uInk[i]; if (vP.y < uMP[i].y) ink.y = 0.0; }   // the crayon stays above the sill: none under a raised mouth, none down its ruled legs, none on the ground
  }
#endif
  float fw = fwidth(n);
#ifdef LH_MOUTHS
  if (hole > 0.5) discard;
#endif
  float L = clamp(log2(max(fw, 1e-4) * 7.0 / 2.5), 0.0, 4.0);
  float nn = n + sh.w + (lhNoise(suv * 0.045) - 0.5) * 1.6 + (lhNoise(suv * 0.33) - 0.5) * 0.24
           + (lhNoise(suv * 0.011) - 0.5) * 0.06 * min(n, 220.0);
  float q = (nn - shv) / (5.0 + 3.0 * L);
  float bump = exp(-q * q) * step(0.0, shv) * clamp(1.0 - shv / 130.0, 0.0, 1.0);
  nn -= 0.5 * (1.0 + 1.6 * L) * bump;                                    // the shiver: arcs pushed outward
  float cover = lhEcho(max(nn, 0.0), fw, lhTooth(suv, fws));
  cover = min(1.0, cover * (1.0 + 0.5 * bump) * lhDrag(suv, fws));
#ifdef LH_SEED
  cover = min(1.0, cover * 1.45);                                        // the far ranks and the small hills are pressed harder
#endif
  // a field pressed hard: graphite laid over the whole band, the tube still showing through it, the tooth still tan
  float tt = lhTooth(suv, fws);
  float press = clamp(ink.x - uLift, 0.0, 1.0);
  // (the pencil is pressed over the whole band and one narrow line of bare paper is spared before the next echo)
  float l0 = min(floor(L), 3.0), sp = 2.5 * exp2(l0), ew = max(fw / sp, 1e-4);
  float f1 = fract(max(nn, 0.0) / sp), f2 = fract(max(nn, 0.0) / (2.0 * sp));
  float s1 = smoothstep(0.7 - ew, 0.7 + ew, f1) * (1.0 - smoothstep(0.96 - ew, 0.96 + ew, f1));
  float s2 = smoothstep(0.7 - 0.5 * ew, 0.7 + 0.5 * ew, f2) * (1.0 - smoothstep(0.96 - 0.5 * ew, 0.96 + 0.5 * ew, f2));
  float spare = mix(mix(s1, s2, smoothstep(0.2, 0.8, L - l0)), 0.26, smoothstep(9.0, 14.0, fw));
  cover = mix(cover, max(cover, (1.0 - 0.9 * spare) * mix(0.84, 0.97, tt)), press);
  vec3 col = mix(sh.rgb, mix(uGraph, uBlack, 0.5 * press), cover);
  // the mouth's crayon bands: the first echoes round a D are filled with wax, mauve and orange by turns
  float wb = max(nn, 0.0) / ink.w;
  if (wb < ink.y) {
    vec3 wx = mod(floor(wb) + ink.z, 2.0) < 0.5 ? uMauve : uOrange;
    wx = mix(wx, 0.5 * (uMauve + uOrange), smoothstep(0.33, 0.6, fw / ink.w));
    col = lhWax(wx, sh.rgb, fract(wb), ink.w, suv.x * 0.8 + suv.y, suv, fw / ink.w, fws);
  }
  gl_FragColor = vec4(col, 1.0);
}`,{...c,defines:x?c.legs?{LH_MOUTHS:x,LH_LEGS:1}:{LH_MOUTHS:x}:c.seed?{LH_SEED:1}:{}},h);return b.userData.shiver=(y,m)=>{x?y<x&&(h.uShv.value[y]=m):h.uShv1.value=m},b.userData.mouthCount=x,b.userData.ink=x?h.uInk.value:null,b.userData.lift=h.uLift,b}const p0=`
uniform float uCross; uniform float uShowD; uniform float uEyeZ;
vec3 lhPick(float w){ return w < 0.5 ? uMauve : (w < 1.5 ? uOrange : (w < 2.5 ? uTan : (w < 3.5 ? uOchre : uBlack))); }
`;function Yt(c={}){return Ne(p0+`
void main(){
  vec2 suv = lhSuv(vP);
  float fws = length(fwidth(suv)) * 0.7;
  float w = vWax;
  if (w > 4.5) {                                                          // a hall rib face: 5 mauve first, 6 orange first
    float t = abs(vUv.x - 247.0) / 247.0;                                 // 0 at the crown, 1 at the feet
    float k = smoothstep(0.0, 0.05, uCross * 1.12 - t - 0.05 * lhNoise(suv * 0.2));
    w = w < 5.5 ? k : 1.0 - k;
  }
  vec3 c = lhWax(lhPick(w), uTan, vUv.y, max(vN, 0.05), vUv.x, suv, fwidth(vUv.y), fws);
#ifdef LH_RIB
  if (w > 1.5 && w < 2.5) {       // a pencil rib between two of wax: bare paper rubbed dark from one edge, drawn only near the eye
    float v2 = 1.0 - vUv.y; c = mix(c, uGraph, 0.16 + 0.62 * v2 * v2);
    c = mix(c, uBlack, smoothstep(50.0, 110.0, 1.0 / max(gl_FragCoord.w, 1e-4)));
  }
#endif
  c = mix(uBlack, c, 1.0 - smoothstep(uShowD * 0.75, uShowD, vP.z - uEyeZ));   // wax too deep in the dark to be seen yet (the gate tunnel)
  gl_FragColor = vec4(c, 1.0);
}`,c.instanced?{...c,defines:{LH_RIB:1}}:c,{uShowD:{value:1e6},uEyeZ:{value:0}})}function Xt(c={}){return Ne(`
void main(){
  if (vWax > 2.5) { gl_FragColor = vec4(uBlack, 1.0); return; }          // pressed black standing behind every arch
  vec2 suv = lhSuv(vP);
  float fws = length(fwidth(suv)) * 0.7;
  float tooth = lhTooth(suv, fws);
  vec3 paper = mix(uTan, uTan2, 0.1 * smoothstep(0.45, 0.8, lhNoise(suv * 0.05)));
  float cover;
  if (vWax > 1.5) {
    float e = min(vUv.y, 1.0 - vUv.y) * 11.0, fe = max(fwidth(vUv.y) * 11.0, 1e-4);
    float f = (e + 0.2) / 0.95, fr = fract(f), d = min(fr, 1.0 - fr) * 0.95, lw = max(0.07, 0.8 * fe);
    float line = clamp((lw - d) / fe + 0.5, 0.0, 1.0) * min(1.0, 0.12 / lw);
    float r = max(0.0, 1.0 - fr / 0.7);                                   // the soffit is ruled right across, rubbed, still being pressed
    float runS = 0.7 + 0.5 * smoothstep(0.1, 0.95, sin((suv.x + suv.y - uTime * 7.0) * 0.06));
    cover = mix(max(line, r * r * 0.55 * runS), 0.22, smoothstep(0.25, 0.5, fe)) + 0.1;
    cover *= mix(0.6, 1.0, smoothstep(0.2, 0.6, tooth + cover * 0.5));
  }
  else {
    float sd = (vUv.y > 0.0 ? length(vUv) : abs(vUv.x)) - vN;
    float fw = fwidth(sd);
    float n = sd + 0.18 + (lhNoise(suv * 0.5) - 0.5) * 0.16;
    float f = n / 0.95, fr = fract(f);
    float d = min(fr, 1.0 - fr) * 0.95;
    float lw = max(0.07, 0.8 * fw);
    float line = clamp((lw - d) / max(fw, 1e-4) + 0.5, 0.0, 1.0) * min(1.0, 0.12 / lw);
    float run = 0.75 + 0.45 * smoothstep(0.1, 0.95, sin((suv.x + suv.y - uTime * 7.0) * 0.06));
    float r = max(0.0, 1.0 - fr / 0.7); float rub = r * r * 0.55 * run;
    float inb = vWax > 0.5 ? 1.0 : 1.0 - smoothstep(2.55, 2.75, n);        // three lines deep, then bare paper (aWax 1: the echoes fill the wall and meet in creases)
    float top = clamp((lw - abs(vUv.y - vN - 2.4)) / max(fw, 1e-4) + 0.5, 0.0, 1.0) * min(1.0, 0.12 / lw);
    cover = max(max(line, rub) * inb, top);
    cover = mix(cover, 0.22 * inb, smoothstep(0.25, 0.5, fw));
    cover *= mix(0.6, 1.0, smoothstep(0.2, 0.6, tooth + cover * 0.5));
  }
  gl_FragColor = vec4(mix(paper, uGraph, clamp(cover, 0.0, 1.0)), 1.0);
}`,c)}function m0(c={}){return Ne(`
uniform float uShowD; uniform float uEyeZ;
void main(){
  float fy = max(fwidth(vUv.y), 1e-4), fx = max(fwidth(vUv.x), 1e-4);
  float lw = max(0.07, 0.8 * fy);
  float ty = abs(abs(vUv.y) - vN);
  float rail = clamp((lw - abs(ty - 0.75)) / fy + 0.5, 0.0, 1.0) * min(1.0, 0.11 / lw);
  float sx = abs(fract(vUv.x) - 0.5);
  float sl = clamp((0.11 - sx) / fx + 0.5, 0.0, 1.0) * step(ty, 1.15);
  sl = mix(sl, 0.22 * step(ty, 1.15), smoothstep(0.12, 0.3, fx));
  // the bed beside the rails: ruled lines every 0.9 m, each rubbed on its outer side (no bare deck)
  float bq = (ty - 1.3) / 0.9, bf = fract(bq), bfw = max(fwidth(vUv.y) / 0.9, 1e-4);
  float bl = clamp((max(0.07, 0.8 * bfw) - min(bf, 1.0 - bf)) / bfw + 0.5, 0.0, 1.0) * min(1.0, 0.1 / max(0.07, 0.8 * bfw));
  float bed = step(1.3, ty) * mix(max(bl, (1.0 - bf) * (1.0 - bf) * 0.42), 0.2, smoothstep(0.3, 0.6, bfw));
  if (vWax > 3.5) {
    // inside a mouth nothing is left blank: the track pressed dark with its rails and sleepers spared as paper, the bed
    // either side in ruled bands each rubbed from its outer line; pressed black only far down the tunnel
    float see = (1.0 - smoothstep(60.0, 130.0, 1.0 / max(gl_FragCoord.w, 1e-4))) * (1.0 - smoothstep(uShowD * 0.75, uShowD, vP.z - uEyeZ));
    float fws = length(fwidth(vUv)) * 0.7, tooth = lhTooth(vUv * vec2(0.6, 1.0), fws);
    float band = mix(max(bl, 0.2 + 0.66 * (1.0 - bf)), 0.5, smoothstep(0.3, 0.6, bfw));
    float cov = ty < 1.3 ? 0.88 * (1.0 - max(rail, sl * 0.85)) : band;
    cov *= mix(0.86, 1.0, smoothstep(0.2, 0.62, tooth + cov * 0.5));
    vec3 cd = mix(uTan, mix(uGraph, uBlack, 0.3), clamp(cov, 0.0, 1.0));
    gl_FragColor = vec4(mix(uBlack, cd, see), 1.0); return;
  }
  float k = max(max(rail, sl * 0.8), bed);
  gl_FragColor = vec4(mix(uTan, uGraph, k), 1.0);
}`,c,{uShowD:{value:1e6},uEyeZ:{value:0}})}function w0(c={}){return Ne("void main(){ gl_FragColor = vec4(uBlack, 1.0); }",c)}function x0(c={}){return Ne(`
varying vec4 vTrain;
float lhRing(float r, float at, float w, float fr){ float lw = max(w, 0.8 * fr); return clamp((lw - abs(r - at)) / max(fr, 1e-4) + 0.5, 0.0, 1.0) * min(1.0, 1.6 * w / lw); }
void main(){
  vec2 suv = vUv * vec2(1.0, 3.0) + vTrain.w * 17.0;
  vec3 A = vTrain.y < 0.5 ? uMauve : (vTrain.y < 1.5 ? uOrange : uTan);
  vec3 Bc = vTrain.y < 0.5 ? uOrange : (vTrain.y < 1.5 ? uOchre : uTan);
  vec3 c = uTan;
  if (vWax > 5.5) {
    float r = length(vUv), fr = fwidth(r); if (r > 1.0) discard;
    float g = max(lhRing(r, 0.94, 0.06, fr), lhRing(r, 0.62, 0.05, fr));
    float rub = max(0.0, 1.0 - (r - 0.62) / 0.24) * step(0.62, r) * 0.5;
    c = mix(uTan, uGraph, max(g, rub));
    float lamp = 1.0 - clamp((r - 0.36) / max(fr, 1e-4) + 0.5, 0.0, 1.0);
    c = mix(c, uOchre, lamp); c = mix(c, uGraph, lhRing(r, 0.37, 0.045, fr));
  } else if (vWax > 4.5) {
    float r = length(vUv), fr = fwidth(r); if (r > 1.0) discard;
    vec2 q = vUv + vec2(1e-4 * step(abs(vUv.x) + abs(vUv.y), 1e-6), 0.0);
    float f = fract((atan(q.y, q.x) + vTrain.x) * 1.27324);
    float ds = min(f, 1.0 - f) * 0.7854 * r;
    float sw = max(0.055, 0.8 * fr);
    float spoke = clamp((sw - ds) / max(fr, 1e-4) + 0.5, 0.0, 1.0) * min(1.0, 0.09 / sw) * step(r, 0.84);
    float g = max(max(lhRing(r, 0.93, 0.07, fr), lhRing(r, 0.76, 0.035, fr)), spoke);
    g = max(g, 1.0 - clamp((r - 0.17) / max(fr, 1e-4) + 0.5, 0.0, 1.0));
    g = max(g, step(0.76, r) * 0.45);
    c = mix(uTan, uGraph, g);
  } else if (vWax > 3.5) { c = uGraph;
  } else if (vWax > 1.5) {
    vec2 e = min(vUv, 1.0 - vUv); vec2 fe = max(fwidth(vUv), vec2(1e-4));
    float g = max(clamp((0.035 - e.x) / fe.x + 0.5, 0.0, 1.0), clamp((0.05 - e.y) / fe.y + 0.5, 0.0, 1.0));
    c = mix(uTan, uGraph, max(g * 0.9, 0.42 * (1.0 - vUv.y) * (1.0 - vUv.y)));
  } else {
    float wd = 0.6, x = vUv.x / wd + 0.5, k = floor(x), fx = fwidth(vUv.x);
    float m = mod(k, 4.0);
    vec3 wx = vWax > 0.5 ? uTan : (m < 0.5 ? A : (m < 1.5 ? uTan : (m < 2.5 ? Bc : uTan)));
    float h = max(vN, 0.1);
    c = lhWax(wx, uTan, fract(x), wd, vUv.y * h, suv, fx / wd, fx);
    vec3 avg = mix((A + Bc + 2.0 * uTan) * 0.25, uGraph, 0.26);
    if (vWax > 0.5) avg = mix(uTan, uGraph, 0.26);
    c = mix(c, avg, smoothstep(0.15, 0.3, fx));
    float ey = min(vUv.y, 1.0 - vUv.y) * h, fy = max(fwidth(vUv.y) * h, 1e-4), lw = max(0.07, 0.8 * fy);
    c = mix(c, uGraph, clamp((lw - ey) / fy + 0.5, 0.0, 1.0) * min(1.0, 0.11 / lw) * (vWax > 0.5 ? 0.0 : 1.0));
  }
  gl_FragColor = vec4(c, 1.0);
}`,{...c,instanced:!0})}function b0(c={}){return new l.ShaderMaterial({uniforms:c.un||yt,side:l.DoubleSide,vertexShader:`varying vec2 vUv; void main(){ vUv = position.xy;
      vec4 mv = modelViewMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
      float s = length(instanceMatrix[0].xyz); mv.xy += position.xy * s; gl_Position = projectionMatrix * mv; }`,fragmentShader:"varying vec2 vUv;"+zt+`
    void main(){ vec2 q = vUv + vec2(1e-4 * step(abs(vUv.x) + abs(vUv.y), 1e-6), 0.0);
      float r = length(q), a = atan(q.y, q.x);
      float edge = 0.84 + 0.13 * abs(sin(a * 3.5));                        // seven scallops
      float d = edge - r, fr = max(fwidth(d), 1e-4); if (d < 0.0) discard;
      float lw = max(0.05, 0.8 * fr);
      float line = clamp((lw - d) / fr + 0.5, 0.0, 1.0) * min(1.0, 0.09 / lw);
      float rub = max(0.0, 1.0 - d / 0.3); rub = rub * rub * 0.42;
      float in2 = clamp((lw - abs(d - 0.42)) / fr + 0.5, 0.0, 1.0) * 0.5 * min(1.0, 0.07 / lw);
      gl_FragColor = vec4(mix(uTan, uGraph, max(max(line, rub), in2)), 1.0); }`})}function Xe(c,d,x,h=1){const b=[];let y=0;for(let m=0;m<h;m++)b.push([-c,d*m/h,d*m/h]);y=d;for(let m=0;m<=x;m++){const g=Math.PI*(1-m/x);b.push([Math.cos(g)*c,d+Math.sin(g)*c,y+Math.PI*c*m/x])}y+=Math.PI*c;for(let m=1;m<=h;m++)b.push([c,d*(1-m/h),y+d*m/h]);return b}class K{constructor(){this.p=[],this.u=[],this.n=[],this.w=[]}v(d,x,h,b=0,y=0,m=0,g=0){this.p.push(d,x,h),this.u.push(b,y),this.n.push(m),this.w.push(g)}quad(d,x,h,b){for(const y of[d,x,h,d,h,b])this.v(...y)}tri(d,x,h){this.v(...d),this.v(...x),this.v(...h)}build(){const d=new l.BufferGeometry;return d.setAttribute("position",new l.Float32BufferAttribute(this.p,3)),d.setAttribute("uv",new l.Float32BufferAttribute(this.u,2)),d.setAttribute("aN",new l.Float32BufferAttribute(this.n,1)),d.setAttribute("aWax",new l.Float32BufferAttribute(this.w,1)),d}}function ce(c,d,x,h,b,y,m,g,W,S,N,$,P){const ae=Xe(d,x,y,m),Be=(d-h)/d,ie=ae.map(R=>[R[0]*(R[1]>x?Be:(d-h)/d),R[1]>x?x+(R[1]-x)*Be:R[1],R[2]]),Z=S-b/2,he=S+b/2;for(let R=0;R<ae.length-1;R++){const F=ae[R],ee=ae[R+1],G=ie[R],I=ie[R+1];c.quad([g+G[0],W+G[1],Z,G[2],0,h,N],[g+F[0],W+F[1],Z,F[2],1,h,N],[g+ee[0],W+ee[1],Z,ee[2],1,h,N],[g+I[0],W+I[1],Z,I[2],0,h,N]),c.quad([g+G[0],W+G[1],he,G[2],0,b,$],[g+G[0],W+G[1],Z,G[2],1,b,$],[g+I[0],W+I[1],Z,I[2],1,b,$],[g+I[0],W+I[1],he,I[2],0,b,$]),c.quad([g+F[0],W+F[1],he,F[2],1,h,P],[g+G[0],W+G[1],he,G[2],0,h,P],[g+I[0],W+I[1],he,I[2],0,h,P],[g+ee[0],W+ee[1],he,ee[2],1,h,P])}}function Ie(c,d,x,h,b,y,m,g,W){const S=Xe(d,x,14,1);for(let N=0;N<S.length-1;N++){const $=S[N],P=S[N+1];c.quad([h+$[0],b+$[1],y],[h+P[0],b+P[1],y],[h+P[0],m+P[1],g],[h+$[0],m+$[1],g])}if(c.quad([h-d,b,y],[h+d,b,y],[h+d,m,g],[h-d,m,g]),W)for(let N=0;N<S.length-1;N++)c.tri([h,m+x,g],[h+S[N][0],m+S[N][1],g],[h+S[N+1][0],m+S[N+1][1],g])}function St(c,d,x,h,b,y){const m=Xe(d,x,y,4);for(let g=0;g<m.length-1;g++)c.tri([0,h+x*.5,b],[m[g][0],h+m[g][1],b],[m[g+1][0],h+m[g+1][1],b]);c.tri([0,h+x*.5,b],[m[m.length-1][0],h,b],[m[0][0],h,b])}const je=350,jt=300,ke=-280,Se=280,T=-186,E=120,se=100,H=-24,qe=66,J=[0,70,140],k=[-2,28,-40],ne=8,me=2,Ut=12,Kt=3,re=6,g0=13,Jt=6,Qt=3,Q=c=>55*(c/je)*(c/je),_=200,Ce=34,M0=24,Ke=7,ft=10;async function A0(c,d={}){const x=c.rng,h=fe(d.detail??c.quality?.detail??1,.6,1),b=d.uniforms||Zt(d.palette),y=new l.Group,m=new l.Group;m.rotation.y=Math.PI,y.add(m);const g=()=>x.range(-14,14),W=x.range(2,2.7),S=x.chance(.5)?1:0,N=e=>jt*Math.pow(Math.max(0,1-Math.pow(Math.abs(e)/je,W)),.6),$=[[-152+g(),k[0],148+g()],[-100+g(),k[1],142+g()],[-132+g(),k[2],66+g()]],P=[];for(let e=0;e<3;e++)for(let t=0;t<3;t++){const a=$[e][t];P.push({p:[a,J[e],ke+re*e+Q(a)],n:[0,-1],r:e>0?g0:t===1?ne:Ut,leg:e>0?Jt:t===1?me:Kt,line:t===1?e:-1})}const ae=70-Math.tan(8*Math.PI/180)*(Se-Q(k[1])-170);P.push({p:[k[1],ae,Se-Q(k[1])],n:[0,1],r:Ce,leg:Ke,line:1}),P.push({p:[k[0],0,Se-Q(k[0])],n:[0,1],r:ne,leg:me,line:0});const Be=-150+g();P.push({p:[Be,0,Se-Q(Be)],n:[0,1],r:Ut,leg:Kt,line:-1}),P.forEach((e,t)=>{const a=Math.floor(t/3),o=t%3;e.ink=t<9?(a+o)%2?.92:0:t===10?.9:0,e.bands=3,e.bw=t<9&&a>0?7.5:t===9?4:2.5,e.par=(t+S)%2});const ie=[],Z=(e,t,a,o,r)=>{for(let s=0;s<r;s++)ie.push([te(e,a,s/r),te(t,o,s/r)])};Z(-280,0,-280,70,5),Z(-280,70,-280+re,70,2),Z(-280+re,70,-280+re,140,5),Z(-280+re,140,-280+2*re,140,2),Z(-280+2*re,140,-245,200,5);const he=new l.SplineCurve([[-245,200],[-214,254],[-140,288],[-30,300],[90,293],[185,258],[243,196],[272,126],[280,80]].map(e=>new l.Vector2(e[0],e[1])));for(let e=0;e<30;e++){const t=he.getPoint(e/30);ie.push([t.x,t.y])}Z(280,80,280,0,5),ie.push([280,0]);const R=150,F=ie.length,ee=new Float32Array((R+1)*F*3),G=[];for(let e=0;e<=R;e++){const t=-1+2*e/R,a=je*Math.sign(t)*Math.pow(Math.abs(t),.9),o=N(a);for(let r=0;r<F;r++){const s=(e*F+r)*3,n=ie[r][0];if(ee[s]=a,ee[s+1]=Math.min(ie[r][1],o),ee[s+2]=n-Q(a)*(n/280),e<R&&r<F-1){const w=e*F+r,p=w+F;G.push(w,w+1,p,p,w+1,p+1)}}}const I=new l.BufferGeometry;I.setAttribute("position",new l.BufferAttribute(ee,3)),I.setAttribute("uv",new l.BufferAttribute(new Float32Array((R+1)*F*2),2)),I.setAttribute("aN",new l.BufferAttribute(new Float32Array((R+1)*F),1)),I.setAttribute("aWax",new l.BufferAttribute(new Float32Array((R+1)*F),1)),I.setIndex(G);const ct=x.range(85,130),Ue=kt({mouths:P,sheet:ct,side:l.DoubleSide,un:b,legs:!0}),$t=new l.Mesh(I,Ue);m.add($t),await c.yield();const ue=new K,we=[];for(let e=0;e<3;e++)we.push({x:k[e],y0:J[e],z0:ke+re*e+Q(k[e])-.5,y1:J[e],z1:T});we.push({x:k[0],y0:0,z0:E,y1:0,z1:Se-Q(k[0])+.5}),we.push({x:k[1],y0:70,z0:E,y1:70,z1:170});const e0=Math.tan(8*Math.PI/180),z=e=>70-(e-170)*e0,xe=Se-Q(k[1]);we.push({x:k[1],y0:70,z0:170,y1:z(_),z1:_});for(const e of we)Ie(ue,ne,me,e.x,e.y0,e.z0,e.y1,e.z1,!1);Ie(ue,Ce,Ke,k[1],z(_),_-.3,z(xe+.5),xe+.5,!1),Ie(ue,ne,me,k[2],140,E,140,E+34,!0);for(const e of P)e.line<0&&Ie(ue,e.r,e.leg,e.p[0],e.p[1],e.p[2]-e.n[1]*.5,e.p[1],e.p[2]-e.n[1]*(e.r>Ut?80:60),!0);for(const e of P.slice(0,9))e.line>0&&e.r>ne&&Ie(ue,e.r,e.leg,e.p[0],e.p[1],e.p[2]+.5,e.p[1],e.p[2]+52,!0);{const e=Xe(se,qe-H,40,2);for(let t=0;t<e.length-1;t++)ue.quad([e[t][0],H+e[t][1],T],[e[t+1][0],H+e[t+1][1],T],[e[t+1][0],H+e[t+1][1],E],[e[t][0],H+e[t][1],E]);ue.quad([-se,H,T],[se,H,T],[se,H,E],[-se,H,E])}const At=w0({side:l.DoubleSide,un:b});m.add(new l.Mesh(ue.build(),At));const Ae=[];for(let e=0;e<3;e++)Ae.push({p:[k[e],J[e],T],n:[0,1],r:ne,leg:me});for(let e=0;e<3;e++)Ae.push({p:[k[e],J[e],E],n:[0,-1],r:ne,leg:me});Ae.forEach((e,t)=>{e.ink=.92,e.bands=3,e.bw=2.5,e.par=(t+S)%2});const Pe={p:[-7,62,E],n:[0,-1],r:15,leg:12};Ae.push(Pe);const Je=kt({mouths:Ae,sheet:ct*.6,side:l.DoubleSide,un:b}),ht=new K;St(ht,se,qe-H,H,T,40),St(ht,se,qe-H,H,E,40),m.add(new l.Mesh(ht.build(),Je));const Pt={p:[k[1],z(_),_],n:[0,1],r:ne,leg:me,ink:0,bands:3,bw:2.5,par:S};{const e=new K;St(e,Ce,Ke,z(_)-.2,_,40);const t=k[1]-Ce-1,a=k[1]+Ce+1,o=8;for(let r=0;r<o;r++){const s=te(_,xe+.5,r/o),n=te(_,xe+.5,(r+1)/o);e.quad([t,z(s)+.04,s],[t,z(n)+.04,n],[a,z(n)+.04,n],[a,z(s)+.04,s])}m.add(new l.Mesh(e.build(),kt({mouths:[Pt],sheet:ct*.5,side:l.DoubleSide,un:b})))}await c.yield();const Dt=9,t0=[],Qe=new K;for(let e=0;e<Dt;e++){const t=T+(e+.5)*((E-T)/Dt);t0.push(t),ce(Qe,se,qe-H,6,5,48,3,0,H,t,5+S,2,1-S),ce(Qe,se-6,qe-H,1.4,2.2,48,3,0,H,t,6-S,2,S);for(const a of[-6.2,6.2])ce(Qe,se,qe-H,2.6,2.4,48,3,0,H,t+a,5+S,2,1-S)}const ut=Yt({side:l.DoubleSide,un:b});m.add(new l.Mesh(Qe.build(),ut)),await c.yield();const Ht=new K;ce(Ht,ne,me,.5,1.5,16,1,0,0,0,0,0,0);const _e=[],$e=[],We=new K,Y=new l.Matrix4;we.forEach((e,t)=>{const a=e.z1-e.z0,o=t===0||t>=4,r=o?5:5/h,s=(e.y1-e.y0)/a,n=Math.floor((a-2)/r)+(t>=4?1:0);for(let w=0;w<n;w++){const p=2.5+w*r;if(p>a-1)break;if((t===1||t===2)&&p<55)continue;const f=o?1.9:1;if(Y.set(1,0,0,e.x,0,1,s*f,e.y0+s*p,0,0,f,e.z0+p,0,0,0,1),_e.push(Y.clone()),$e.push((Math.floor((w+(t===5?10:0))/3)+S+t)%2),o&&(p+2.5<a-1||t===4)){const u=p+2.5,i=1.2;Y.set(1.035,0,0,e.x,0,1.035,s*i,e.y0+s*u,0,0,i,e.z0+u,0,0,0,1),_e.push(Y.clone()),$e.push(2)}}});const vt=(e,t,a)=>{const o=1.07*e.r/ne;Y.makeScale(o,o,.7).setPosition(e.p[0],e.p[1]-.05,e.p[2]+e.n[1]*a),_e.push(Y.clone()),$e.push((t+S)%2)};P.forEach((e,t)=>{t!==9&&(e.leg===Jt?ce(We,e.r*1.06,e.leg,.95,1,20,2,e.p[0],e.p[1]-.05,e.p[2]-.25,(t+Math.floor(t/3)+S)%2,(t+Math.floor(t/3)+S)%2,(t+Math.floor(t/3)+S)%2):vt(e,t+Math.floor(t/3),.25))});for(let e=0;e<3;e++){const t=(e+S)%2;ce(We,Pe.r+1.35+e*1.65,Pe.leg,1.35,.9-e*.2,28,3,Pe.p[0],Pe.p[1],E-.5+e*.1,t,t,t)}for(let e=0;e<ft;e++){const t=(xe-_)/ft,a=_+(e+.36)*t,o=te(M0,Ce,e/(ft-1)),r=(e+S)%2;ce(We,o,Ke,3,4.6,36,2,k[1],z(a)-.1,a,r,r,r),e<ft-1&&ce(We,o+1.3,Ke,2.2,t-4.3,36,2,k[1],z(a+t*.5)-.1,a+t*.5,2,2,2)}m.add(new l.Mesh(We.build(),ut)),vt(Pt,S+1,.3),Ae.forEach((e,t)=>{t<6&&vt(e,t,.3)});const et=new l.InstancedMesh(Ht.build(),Yt({instanced:!0,side:l.DoubleSide,un:b}),_e.length);_e.forEach((e,t)=>et.setMatrixAt(t,e)),et.geometry.setAttribute("aWaxI",new l.InstancedBufferAttribute(new Float32Array($e),1)),et.frustumCulled=!1,m.add(et),await c.yield();const Tt=14,le=(E-T)/Tt,D=7.6,X=23.5,C=X-2.6-D,U=5.5,Fe=new K;{const e=Math.atan2(X-C,le/2),t=[];for(let s=0;s<=12;s++)t.push(Math.PI*(1-s/12));t.push(e,Math.PI-e),t.sort((s,n)=>n-s);const a=t.map(s=>[Math.cos(s)*D,Math.sin(s)*D]),o=t.map(s=>{const n=Math.min(le/2/Math.abs(Math.cos(s)),(X-C)/Math.abs(Math.sin(s)));return[Math.cos(s)*n,Math.sin(s)*n]});for(const s of[-U,U]){for(const n of[-1,1])Fe.quad([s,0,n*le/2,n*le/2,-C,D,0],[s,0,n*D,n*D,-C,D,0],[s,C,n*D,n*D,0,D,0],[s,C,n*le/2,n*le/2,0,D,0]);for(let n=0;n<t.length-1;n++)Fe.quad([s,C+a[n][1],a[n][0],a[n][0],a[n][1],D,0],[s,C+o[n][1],o[n][0],o[n][0],o[n][1],D,0],[s,C+o[n+1][1],o[n+1][0],o[n+1][0],o[n+1][1],D,0],[s,C+a[n+1][1],a[n+1][0],a[n+1][0],a[n+1][1],D,0])}Fe.quad([0,0,-D,0,0,0,3],[0,0,D,0,0,0,3],[0,C+D,D,0,0,0,3],[0,C+D,-D,0,0,0,3]);const r=[[-D,-C],...a,[D,-C]];for(let s=0;s<r.length-1;s++)Fe.quad([-U,C+r[s][1],r[s][0],0,0,0,2],[U,C+r[s][1],r[s][0],0,1,0,2],[U,C+r[s+1][1],r[s+1][0],0,1,0,2],[-U,C+r[s+1][1],r[s+1][0],0,0,0,2])}const Et=[1,4,7],dt=[];for(let e=0;e<3;e++){const t=(J[e]-H)/Et[e]/X;for(let a=0;a<Et[e];a++)for(let o=0;o<Tt;o++)Y.makeScale(1,t,1).setPosition(k[e]-1,H+a*X*t,T+(o+.5)*le),dt.push(Y.clone())}const Rt=Xt({instanced:!0,side:l.DoubleSide,un:b}),pt=new l.InstancedMesh(Fe.build(),Rt,dt.length);dt.forEach((e,t)=>pt.setMatrixAt(t,e)),pt.frustumCulled=!1,m.add(pt),await c.yield();const De=new K,be=new K,oe=T+8.5*le,Oe=H+3*X;for(let e=0;e<3;e++){const t=k[e]-1,a=J[e]+.02;De.quad([t-U,a,T,T,-U,3,0],[t-U,a,E,E,-U,3,0],[t+U,a,E,E,U,3,0],[t+U,a,T,T,U,3,0])}for(const e of we){const t=e.x-1;De.quad([t-7.3,e.y0+.12,e.z0,e.z0,-7.3,3,4],[t-7.3,e.y1+.12,e.z1,e.z1,-7.3,3,4],[t+9.3,e.y1+.12,e.z1,e.z1,9.3,3,4],[t+9.3,e.y0+.12,e.z0,e.z0,9.3,3,4])}{const e=k[1]-1,t=z(_)+.12,a=z(xe+.5)+.12,o=xe+.5;De.quad([e-6.6,t,_,_,-6.6,3,4],[e-6.6,a,o,o,-6.6,3,4],[e+6.6,a,o,o,6.6,3,4],[e+6.6,t,_,_,6.6,3,4])}{const a=X-2.6-6.6,o=[-22,-3,16];for(let r=0;r<3;r++){const s=H+r*X;for(const n of o)for(const w of[-U,U]){const p=n===o[0]?-35.5:n-9.5,f=n===o[2]?21.5:n+19/2,u=oe+w,i=(M,L)=>[M,s+L,u,M-n,L-a,6.6,1];be.quad(i(p,0),i(n-6.6,0),i(n-6.6,a),i(p,a)),be.quad(i(n+6.6,0),i(f,0),i(f,a),i(n+6.6,a)),be.tri(i(p,a),i(n-6.6,a),i(p,X)),be.tri(i(n+6.6,a),i(f,a),i(f,X));for(let M=0;M<14;M++){const L=Math.PI*(1-M/14),v=Math.PI*(1-(M+1)/14),A=fe(n+19/2*fe(Math.cos(L)*1.5,-1,1),p,f),O=fe(n+19/2*fe(Math.cos(v)*1.5,-1,1),p,f);be.quad(i(n+6.6*Math.cos(L),a+6.6*Math.sin(L)),i(A,X),i(O,X),i(n+6.6*Math.cos(v),a+6.6*Math.sin(v)))}}for(const n of o){const w=[[-6.6,0]];for(let p=0;p<=14;p++){const f=Math.PI*(1-p/14);w.push([6.6*Math.cos(f),a+6.6*Math.sin(f)])}w.push([6.6,0]);for(let p=0;p<w.length-1;p++)be.quad([n+w[p][0],s+w[p][1],oe-U,0,0,0,2],[n+w[p][0],s+w[p][1],oe+U,0,1,0,2],[n+w[p+1][0],s+w[p+1][1],oe+U,0,1,0,2],[n+w[p+1][0],s+w[p+1][1],oe-U,0,0,0,2])}}m.add(new l.Mesh(be.build(),Xt({side:l.DoubleSide,un:b}))),De.quad([-41,Oe+.03,oe-U,-41,-U,0,0],[-41,Oe+.03,oe+U,-41,U,0,0],[27,Oe+.03,oe+U,27,U,0,0],[27,Oe+.03,oe-U,27,-U,0,0])}const ve=(e,t)=>ke+re*e-re/2+Q(t),Lt=[0,0,0];for(let e=1;e<3;e++){let t=je;for(;t>50&&N(t)<J[e]+9;)t-=4;Lt[e]=t;for(let a=0;a<48;a++){const o=te(-t,t,a/48),r=te(-t,t,(a+1)/48),s=J[e]+.25;De.quad([o,s,ve(e,o)-2.6,o,-1.5,0,0],[o,s,ve(e,o)+2.6,o,1.5,0,0],[r,s,ve(e,r)+2.6,r,1.5,0,0],[r,s,ve(e,r)-2.6,r,-1.5,0,0])}}const Nt=m0({side:l.DoubleSide,un:b});m.add(new l.Mesh(De.build(),Nt)),await c.yield();const tt=(e,t,a,o,r,s,n,w,p,f)=>{const u=r-o;for(const i of[t,a])e.quad([i,o,s,s,0,u,w],[i,o,n,n,0,u,w],[i,r,n,n,1,u,w],[i,r,s,s,1,u,w]);for(const i of[s,n])e.quad([t,o,i,0,0,u,p],[a,o,i,1,0,u,p],[a,r,i,1,1,u,p],[t,r,i,0,1,u,p]);f>=0&&e.quad([t,r,s,s,0,1,f],[t,r,n,n,0,1,f],[a,r,n,n,1,1,f],[a,r,s,s,1,1,f])},It=(e,t,a,o,r,s)=>{for(let w=0;w<5;w++){const p=w/5,f=(w+1)/5,u=[-t+2*t*p,a+o*Math.sin(Math.PI*p)],i=[-t+2*t*f,a+o*Math.sin(Math.PI*f)];e.quad([u[0],u[1],r,r,p,1,1],[u[0],u[1],s,s,p,1,1],[i[0],i[1],s,s,f,1,1],[i[0],i[1],r,r,f,1,1])}for(const w of[r,s])for(let p=0;p<5;p++){const f=p/5,u=(p+1)/5;e.tri([-t+2*t*f,a,w,0,0,0,4],[-t+2*t*f,a+o*Math.sin(Math.PI*f),w,0,0,0,4],[-t+2*t*u,a+o*Math.sin(Math.PI*u),w,0,0,0,4]),e.tri([-t+2*t*f,a,w,0,0,0,4],[-t+2*t*u,a+o*Math.sin(Math.PI*u),w,0,0,0,4],[-t+2*t*u,a,w,0,0,0,4])}},He=(e,t,a,o)=>{for(const r of[-t,t])e.quad([r,0,a-o,-1,-1,o,5],[r,0,a+o,1,-1,o,5],[r,2*o,a+o,1,1,o,5],[r,2*o,a-o,-1,1,o,5])},at=(e,t,a,o,r,s,n,w,p)=>{for(let f=0;f<w;f++){const u=f/w*6.2832,i=(f+1)/w*6.2832;e.quad([s+Math.cos(u)*t,o,n+Math.sin(u)*t,f/w,0,1,p],[s+Math.cos(i)*t,o,n+Math.sin(i)*t,(f+1)/w,0,1,p],[s+Math.cos(i)*a,r,n+Math.sin(i)*a,(f+1)/w,1,1,p],[s+Math.cos(u)*a,r,n+Math.sin(u)*a,f/w,1,1,p])}},Te=new K;tt(Te,-1.3,1.3,.72,3.25,-3.5,3.5,0,2,-1),It(Te,1.42,3.25,.34,-3.62,3.62),tt(Te,-.95,.95,.45,.72,-3.8,3.8,4,4,-1),He(Te,1.37,-2.1,.78),He(Te,1.37,2.1,.78);const B=new K;tt(B,-1.35,1.35,.95,3.5,-4.5,-1.9,0,2,-1),It(B,1.5,3.5,.5,-4.7,-1.6),tt(B,-1.4,1.4,.8,.98,-4.5,4.2,4,4,4);{for(let o=0;o<14;o++){const r=o/14*6.2832,s=(o+1)/14*6.2832;B.quad([Math.cos(r)*1.12,2.15+Math.sin(r)*1.12,-1.9,-1.9,o/14,1,1],[Math.cos(r)*1.12,2.15+Math.sin(r)*1.12,3.6,3.6,o/14,1,1],[Math.cos(s)*1.12,2.15+Math.sin(s)*1.12,3.6,3.6,(o+1)/14,1,1],[Math.cos(s)*1.12,2.15+Math.sin(s)*1.12,-1.9,-1.9,(o+1)/14,1,1])}B.quad([-1.3,2.15-1.3,3.64,-1,-1,1,6],[1.3,2.15-1.3,3.64,1,-1,1,6],[1.3,2.15+1.3,3.64,1,1,1,6],[-1.3,2.15+1.3,3.64,-1,1,1,6])}at(B,.3,.36,3.15,3.75,0,2.6,8,2),at(B,.36,.62,3.75,4.05,0,2.6,8,4),at(B,.5,.42,3.15,3.55,0,.5,8,2),at(B,.42,.05,3.55,3.72,0,.5,8,4),He(B,1.44,-3.1,.95),He(B,1.44,-.9,.95),He(B,1.44,1.1,.95),He(B,1.44,3,.62);for(const e of[-1,1])B.quad([e*1.5,.82,-3.3,0,0,0,4],[e*1.5,.82,1.3,0,0,0,4],[e*1.5,1.06,1.3,0,0,0,4],[e*1.5,1.06,-3.3,0,0,0,4]);B.quad([-1.3,.2,4.75,-1.3,0,.9,0],[1.3,.2,4.75,1.3,0,.9,0],[1.1,1,4.2,1.1,1,.9,0],[-1.1,1,4.2,-1.1,1,.9,0]);for(const e of[-1,1])B.tri([e*1.3,.2,4.75,0,0,0,4],[e*1.1,1,4.2,0,0,0,4],[e*1.25,.2,4.2,0,0,0,4]);await c.yield();const mt=Math.tan(8*Math.PI/180),wt=(e,t,a)=>({at(o,r){const s=t===1&&o>170?70-(o-170)*mt:J[t];r.p.set(e,s,o),r.f.set(0,t===1&&o>170?-mt*a:0,a).normalize()},dir:a,lo:t===0?-345:-212,hi:t===2?150:t===1?168:250}),qt=(e,t,a)=>{const o=P[t].p,r=P[a].p,s=Math.sign(r[0]-o[0]),n=[];for(let v=0;v<=10;v++)n.push([o[0],o[2]+70-v*7]);const w=o[0]+s*11,p=ve(e,w),f=r[0]-s*11,u=ve(e,f);for(let v=1;v<=8;v++){const A=v/8*Math.PI/2;n.push([o[0]+s*11*(1-Math.cos(A)),o[2]+(p-o[2])*Math.sin(A)])}const i=Math.ceil(Math.abs(f-w)/4);for(let v=1;v<=i;v++){const A=te(w,f,v/i);n.push([A,ve(e,A)])}for(let v=1;v<=8;v++){const A=v/8*Math.PI/2;n.push([f+s*11*Math.sin(A),u+(r[2]-u)*(1-Math.cos(A))])}for(let v=1;v<=10;v++)n.push([r[0],r[2]+v*7]);const M=[0];for(let v=1;v<n.length;v++)M.push(M[v-1]+Math.hypot(n[v][0]-n[v-1][0],n[v][1]-n[v-1][1]));const L=M[M.length-1];return{S:L,lo:4,hi:L-4,dir:1,sillA:70,sillB:L-70,ma:t,mb:a,at(v,A){const O=fe(v,0,L-.01);let q=1;for(;M[q]<O;)q++;const ye=(O-M[q-1])/Math.max(M[q]-M[q-1],1e-4),it=n[q-1],lt=n[q];A.p.set(te(it[0],lt[0],ye),J[e],te(it[1],lt[1],ye)),A.f.set(lt[0]-it[0],0,lt[1]-it[1]).normalize()}}},ge=d.wax==="ochre"?[1,1,0]:d.wax==="pencil"?[2,2,2]:[0,0,x.chance(.3)?1:0],Ct=Math.max(3,Math.round(4*h)),de=[{r:wt(k[0]-4,0,1),cars:10,sch:ge[0],wall:[0,3]},{r:wt(k[1]-4,1,-1),cars:10,sch:ge[1],wall:[1,4]},{r:wt(k[2]+2,2,1),cars:6,sch:ge[2],wall:[2,5]},{r:qt(1,3,5),cars:Ct,sch:ge[0],k:Qt},{r:qt(2,8,6),cars:Ct,sch:ge[1],k:Qt},{r:{at(e,t){t.p.set(27-e,Oe+.03,oe),t.f.set(-1,0,0)},lo:.5,hi:67.5,dir:1},cars:6,sch:ge[0],k:1.45,cross:!0}],a0=d.rare??x.chance(1/12),xt=[0,2,4,7],Ge=de.length+xt.length,Bt=de.reduce((e,t)=>e+t.cars,0),bt=x0({side:l.DoubleSide,un:b}),Ee=new l.InstancedMesh(B.build(),bt,Ge),ot=new l.InstancedMesh(Te.build(),bt,Bt),Me=new l.InstancedBufferAttribute(new Float32Array(Ge*4),4),Ve=new l.InstancedBufferAttribute(new Float32Array(Bt*4),4);Me.setUsage(l.DynamicDrawUsage),Ve.setUsage(l.DynamicDrawUsage);{let e=0;de.forEach((t,a)=>{Me.setXYZW(a,0,t.sch,0,x()),t.c0=e;for(let o=0;o<t.cars;o++)Ve.setXYZW(e++,0,t.sch,0,x())}),xt.forEach((t,a)=>Me.setXYZW(de.length+a,0,ge[a%3],0,x()))}for(const e of[Ee,ot])e.geometry.setAttribute("aTrain",e===Ee?Me:Ve),e.geometry.setAttribute("aWaxI",new l.InstancedBufferAttribute(new Float32Array(e.count),1)),e.instanceMatrix.setUsage(l.DynamicDrawUsage),e.frustumCulled=!1,m.add(e);const st=Math.round(9*h),o0=new l.PlaneGeometry(2,2),Re=new l.InstancedMesh(o0,b0({un:b}),Ge*st);Re.instanceMatrix.setUsage(l.DynamicDrawUsage),Re.frustumCulled=!1,m.add(Re),await c.yield();let Ze=-1,_t=null;const j={p:new l.Vector3,f:new l.Vector3},gt=new l.Vector3,Wt=new l.Vector3,s0=new l.Vector3(0,1,0),nt=[];for(let e=0;e<Ge;e++)nt.push({p:new l.Vector3,f:new l.Vector3(0,0,1),on:!1,v:1});const Ft=new l.Matrix4().makeScale(0,0,0),n0=new l.Vector3,Mt=(e,t,a,o=1)=>{if(!a){e.setMatrixAt(t,Ft);return}gt.crossVectors(s0,j.f).normalize(),Wt.crossVectors(j.f,gt),Y.makeBasis(gt.multiplyScalar(o),Wt.multiplyScalar(o),n0.copy(j.f).multiplyScalar(o)).setPosition(j.p),e.setMatrixAt(t,Y)},r0=(e,t)=>(e%t+t)%t,ze=e=>e>0&&e<130?e:-1,i0=x.int(0,1),l0=2+x.int(0,1),Ot=()=>_t??(Ze<0?-40:T+(Ze-.463)*1443);function Gt(e,t){b.uTime.value=t,b.uCross.value=Ye(-10,70,Ot());const a=Ze<0,o=a?.47+t*.008%.2:Ze,r=a?7.14+t*.8:o*42,s=Ot(),n=-324-s,w=62+34*Ye(-290,-190,s)+34*Ye(-262,-172,s)+.375*(Math.sqrt(n*n+400)+n),p=[fe(s+w,-345,330),fe(28-(s+6)*.5,-330,240),fe(s+30,-245,240)];de.forEach((f,u)=>{const i=f.r,M=f.k||1,L=(10+f.cars*7.9)*M;let v;u<3?(v=p[u],Je.userData.shiver(f.wall[0],ze((i.dir>0?v-T:T-v)*1.3)),Je.userData.shiver(f.wall[1],ze((i.dir>0?v-E:E-v)*1.3))):f.cross?v=62+(s+43)*1.7:(v=r0(i.sillA+40+(r-(u===3?7.14:9.2))*(u===3?26:22),i.S+L+40),Ue.userData.shiver(i.ma,ze((v-i.sillA)*1.4)),Ue.userData.shiver(i.mb,ze((v-i.sillB)*1.4)));const A=v>i.lo&&v<i.hi;i.at(v,j),Mt(Ee,u,A,M);const O=nt[u];O.p.copy(j.p),O.f.copy(j.f),O.on=A||!!f.cross&&v>=i.hi&&v<i.hi+70,O.v=1,O.k=M,Me.setX(u,v/(.95*M));for(let q=0;q<f.cars;q++){const ye=v-i.dir*(9+q*7.9)*M;i.at(ye,j),Mt(ot,f.c0+q,ye>i.lo&&ye<i.hi,M),Ve.setX(f.c0+q,ye/(.78*M))}}),xt.forEach((f,u)=>{const i=P[f],M=a0||u===i0||u===l0;let L=M?Ye(.19,.215,o)*(1-Ye(.3,.34,o)):0,v=M?(o-.19)*42*16:-1;a&&(L=.5+.5*Math.sin(t*.25+u*1.7),v=(t*14+u*37)%190);const A=(i.leg+i.r)/3.6,O=i.p[2]+3.64*A+te(5,u<2?-6:-2.5,L);j.p.set(i.p[0],i.p[1],O),j.f.set(0,0,-1),Mt(Ee,de.length+u,M||a,A),Me.setX(de.length+u,O/(.95*A));const q=nt[de.length+u];q.p.copy(j.p),q.f.copy(j.f),q.on=L>.02||a,q.v=.12,q.k=A*.8,Ue.userData.shiver(f,ze(v))});for(let f=0;f<Ge;f++){const u=nt[f];for(let i=0;i<st;i++){const M=(i/st+t*.2+f*.37)%1,L=f*st+i;if(!u.on){Re.setMatrixAt(L,Ft);continue}const v=u.k||1,A=v*(.7+4.6*M)*Math.min(1,(1-M)/.2,M/.06),O=v*(M*34*u.v-2.6);Y.makeScale(A,A,A).setPosition(u.p.x-u.f.x*O+Math.sin(M*9+f)*.8*M*v,u.p.y+v*(4.6+M*(9+16*M)+(1-u.v)*M*10),u.p.z-u.f.z*O),Re.setMatrixAt(L,Y)}}Ee.instanceMatrix.needsUpdate=!0,ot.instanceMatrix.needsUpdate=!0,Re.instanceMatrix.needsUpdate=!0,Me.needsUpdate=!0,Ve.needsUpdate=!0}Gt(0,0);const V=(e,t,a)=>new l.Vector3(-e,t,-a),pe=T+9.5*le,rt=Se-Q(k[1]),f0=[[0,4,-640],[0,4,-420],[0,4,ke],[0,4,T],[3,8,-138],[10,24,-84],[14,40,-24],[16,50,pe-18],[21,54.5,pe-3.5],[27,56,pe],[33,57.5,pe+3.5],[38.5,61,pe+14],[39,67.5,pe+36],[34.5,72.5,pe+62],[30,74,E],[30,74,170],[30,ae+4,rt],[30,ae+4-14*mt,rt+14]],c0={valleyView:V(0,4,-640),frontMouth:V(k[0],0,ke+Q(k[0])),hallEntry:V(0,4,T),hallCentre:V(0,60,-20),archPass:V(27,56,pe),hallExit:V(30,74,E),backMouth:V(k[1],ae,rt),backDir:new l.Vector3(0,-Math.sin(8*Math.PI/180),-Math.cos(8*Math.PI/180)),portalSeat:{position:V(30,ae+4.75,rt),facing:new l.Vector3(0,0,1)},flyThrough:f0.map(e=>V(e[0],e[1],e[2])),mouths:P.map(e=>({position:V(e.p[0],e.p[1],e.p[2]),facing:new l.Vector3(0,0,-e.n[1])})),ledges:[1,2].map(e=>({y:J[e],half:Lt[e],z:t=>-ve(e,-t)}))},Le=d.dbg||null,h0=Le==="hall"?{radius:22,height:50,center:V(0,52,-40),ground:!1}:Le==="mouth"?{radius:14,height:16,center:V(-2,6,ke-2),ground:!0}:Le==="train"?{radius:11,height:14,center:V(-6,3,12),ground:!1}:Le==="rib"?{radius:0,height:4,center:new l.Vector3(-20,73,-145),ground:!1}:Le==="engine"?{radius:4,height:8,center:V(-6,2.5,42),ground:!1}:Le==="face"?{radius:110,height:150,center:V(0,80,ke+40),ground:!0}:{radius:420,height:jt,center:new l.Vector3(0,130,0),ground:!0};return{object:y,course:m,...h0,groundY:-.05,anchors:c0,update:Gt,uniforms:b,setProgress(e,t){Ze=e,_t=t??null},materials:{paper:Ue,walls:Je,wax:ut,arcade:Rt,track:Nt,train:bt,black:At},geos:{engine:Ee.geometry,car:ot.geometry},mouths:P,altar:Pe,shiver:(e,t)=>Ue.userData.shiver(e,t),dispose(){}}}export{K as Geo,u0 as LH_PALETTE,v0 as LH_VERT,zt as STYLE_GLSL,ce as addRib,Ie as addTube,Xt as arcadeMaterial,w0 as blackMaterial,A0 as buildHero,Xe as dOutline,yt as lhUniforms,Zt as makeLhUniforms,kt as paperMaterial,U0 as setLhPalette,b0 as smokeMaterial,m0 as trackMaterial,x0 as trainMaterial,Yt as waxMaterial};
