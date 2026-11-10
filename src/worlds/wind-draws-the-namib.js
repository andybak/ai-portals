import*as n from"three";import{makePath as ja}from"../kit/core.js";import{buildHero as Ya,SAND_GLSL as pe,GLASS_GLSL as oa,COMB_GLSL as Ja,addGlassMarks as eo,addFiles as to}from"../parts/wind-draws-the-namib.js";const At=["#FFF1CF","#F6B85A","#D9772B","#9E4420","#4A2212","#150A07","#A9C3CC"],I=210,Te=300,lt=-240,Ke=50,sa=22*Math.PI/180,Be=-Math.cos(sa),Re=-Math.sin(sa),Ye=Re,Je=-Be,et=131,tt=366,p=(l,d,q)=>{const P=Math.min(1,Math.max(0,(q-l)/(d-l)));return P*P*(3-2*P)},U=(l,d,q)=>l+(d-l)*q,ft=l=>l.toFixed(3),na=`
// four finger lanes run on from where our furrow ends: bare glass, a lip of displaced sand heaped along each edge
float fingerLanes(vec2 xz, float fw, out float lip, out float grp){
  float x = xz.x, lz = xz.y - ${ft(I)} - (3.4 + 1.6 * sin(x * 0.023 + 0.7) + 0.4 * sin(x * 0.09 + 2.));
  float fz = lz / 2.4 - 0.5, fk = floor(fz + 0.5);
  float fing = abs((fz - fk) * 2.4 - 0.34 * sin(x * 0.05 + fk * 1.9) - 0.2 * sin(x * 0.13 + fk * 4.1));      // each finger wanders by itself
  float w = 0.22 + 0.2 * h11(fk + 2.) + 0.1 * sin(x * 0.07 + fk * 2.3);
  float on = step(abs(lz), 4.8) * smoothstep(-95., -45., x) * (1. - smoothstep(62., 90., x));
  grp = (1. - smoothstep(4.7, 5.9, abs(lz))) * smoothstep(-95., -45., x) * (1. - smoothstep(62., 90., x));      // the whole hand's width
  on *= smoothstep(0.16, 0.36, vn2(vec2(x * 0.045 + fk * 9.1, 4.)));              // a finger lifts here and there
  lip = smoothstep(w - 0.05, w + 0.07, fing) * (1. - smoothstep(w + 0.1, w + 0.42 + fw, fing)) * on;
  return (1. - smoothstep(w, w + 0.09 + fw * 0.6, fing)) * on;
}
// glass a palm has wiped: a breath of dust, the long streaks its fingers left, and here and there the ghost of the old ripples
float wipedFilm(vec2 xz, float fw, float n1, float n2, float crest, float rpF){
  float wz = xz.y + 0.16 * xz.x + 9. * vn2(vec2(xz.x * 0.015, 3.)) + 2.4 * vn2(vec2(xz.x * 0.055, 11.));      // the strokes swing and wander together
  float s1 = smoothstep(0.6, 0.82, vn2(vec2(xz.x * 0.013 + 3., wz * 0.42))) * (1. - clamp(fw * 0.3, 0., 1.));
  float s2 = smoothstep(0.62, 0.86, vn2(vec2(xz.x * 0.027, wz * 1.7 + 9.))) * (1. - clamp(fw * 1.0, 0., 1.));
  float s3 = smoothstep(0.68, 0.86, vn2(vec2(xz.x * 0.05 + 5., wz * 4.3))) * (1. - clamp(fw * 2.6, 0., 1.));
  float nL = vn2(vec2(xz.x * 0.085 + 2., wz * 0.7 + 4.));      // (a streak thickens and thins along its own length, never on a lattice)
  float gp = smoothstep(0.5, 0.7, vn2(vec2(xz.x * 0.05 + 3., wz * 0.09) + 1.2 * n1));      // a ghost survives as a patch of whole arcs
  float ghost = crest * rpF * smoothstep(0.55, 0.8, vn2(xz * 0.06 + 7.)) * gp;
  return 0.0035 + 0.007 * n1 + 0.06 * s1 * (0.3 + 0.7 * nL) + 0.03 * s2 + 0.026 * s3 * nL + 0.014 * ghost * (1. - s2) * (1. - s3);
}
// the ripple fields: sand combed on the lit glass. Broad patches a palm has wiped almost bare, films of sand between them,
// and wind ripples whose crests stand as dark lines near the eye and thin to a wash with distance
float fieldFilm(vec2 xz, float fw, float farK, float n1, float n2, float n3, out float rp, out float rpF){
  float big = fbm2(xz * 0.006 + uSeed * 1.7);
  float bare = 1. - smoothstep(0.3, 0.4, big + 0.14 * (n1 - 0.5));
  vec2 pa = (xz - vec2(42., ${ft(I+19)})) / vec2(74., 12.5);                  // the smear the ostriches run along
  bare = max(bare, 1. - smoothstep(0.78, 1.04, length(pa) + 0.4 * (n1 - 0.5) + 0.12 * (n3 - 0.5)));
  float film = mix(0.04 + 0.3 * n1 * n1, 0.015 + 0.2 * smoothstep(0.42, 0.72, fbm2(xz * 0.0035 + uSeed)), farK);
  film *= 0.55 + 1.3 * smoothstep(0.4, 0.8, big);
  rpF = (1. - clamp(fw * 0.9, 0., 1.)) * (1. - farK);
  // wind ripples: two sets of crests, one twice as far apart as the other and lying at another angle, each ruling its own patches;
  // where the patches meet the crests fork and die out, and a slow warp makes every crest wander
  float wm = vn2(xz * 0.31 + 5.);
  float ph1 = dot(xz, vec2(4.9, 1.2)) + 9. * n1 + 3. * n3 + 1.5 * n2 + 3.6 * wm;
  float ph2 = dot(xz, vec2(2.7, -1.25)) + 6. * n1 + 4. * n3 + 2.2 * wm;
  float pb = smoothstep(0.38, 0.62, vn2(xz * 0.055 + 21.));
  rp = mix(sin(ph1), sin(ph2), pb);
  float c = 0.5 + 0.5 * rp, crest = c * c; crest *= crest;                        // narrow crests, broad troughs
  float lip, grp, ln = fingerLanes(xz, fw, lip, grp);
  // (here and there the ripples sink back into the film; and the hand that drew the four lanes smoothed them away between its fingers)
  crest *= (0.25 + 0.75 * smoothstep(0.22, 0.6, vn2(xz * 0.21 + 31.))) * (1. - grp);
  film *= 0.45 + (1.5 + 0.8 * uStill) * mix(0.375, crest, rpF);                   // (a windless day keeps its ripples crisp)
  float lineF = (1. - clamp(fw * 2.4, 0., 1.)) * (1. - farK);
  // one crest in three or four is heaped into a strong umber line, and that line breaks along its length; the rest stay sienna
  float cid = floor(mix(ph1, ph2, step(0.5, pb)) / 6.2832 + 0.25);
  float strong = step(0.68, h11(cid * 1.31 + 3.)) * smoothstep(0.3, 0.6, vn2(vec2(dot(xz, vec2(-0.24, 0.97)) * 0.25 + cid * 3.7, cid)));
  film += (0.22 + (1.0 + 2.2 * n1) * strong) * crest * crest * lineF * smoothstep(0.03, 0.2, film);
  film += 0.05 * smoothstep(0.6, 0.95, rp) * rpF * (0.3 + n1);
  film = mix(film, wipedFilm(xz, fw, n1, n2, crest, rpF), bare * (1. - farK));
  film += lip * (0.45 + 0.9 * n2) * (1. - clamp(fw * 0.5, 0., 1.)) * (1. - 0.7 * bare);
  return mix(film, 0.002 + 0.004 * n2, ln);
}
// what a fingertip dragged over glass leaves across its own track: hairline chatter marks of dust, unevenly spaced, short and broken
float chatter(float lat, float s, float fq){
  float sb = s + 0.012 * lat * lat;
  float q = sb / 2.6 + 0.6 * vn2(vec2(sb * 0.09, 4.)), k = floor(q), f = fract(q) - 0.5;
  float on = step(0.4, h11(k + 5.)) * smoothstep(0.38, 0.6, vn2(vec2(lat * 1.5 + k * 7.3, k)));
  float w = 0.005 + 0.014 * h11(k + 9.);
  return (1. - smoothstep(w, w + 0.012 + fq, abs(f + 0.25 * (h11(k) - 0.5)))) * on * (1. - smoothstep(0.1, 0.35, fq));
}
// what a fingertip leaves on wiped glass: a few streaks of unequal width that wander, taper, break and smudge
float roadStreaks(float lat, float sx, float nA, float nB, float fw){
  float strk = 0.;
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float c = (fi - 2.) * 1.5 + 1.1 * (h11(fi + 3.) - 0.5) + 1.2 * sin(sx * (0.085 + 0.021 * fi) + fi * 2.4) + 0.55 * sin(sx * 0.27 + fi * 5.1) + 3.4 * (vn2(vec2(sx * 0.031 + fi * 7.7, 2.)) - 0.5);
    float wd = (0.06 + 0.3 * h11(fi + 9.) * h11(fi + 9.)) * (0.2 + 1.6 * vn2(vec2(sx * 0.047 + fi * 3.1, 5.)));
    float on = smoothstep(0.34, 0.52, vn2(vec2(sx * 0.06 + fi * 11.3, 8.)));
    float e = abs(lat - c) + (0.5 * (nA - 0.5) + 0.25 * (nB - 0.5)) * (0.3 + wd);
    strk = max(strk, (1. - smoothstep(wd * 0.3, wd + 0.5 * fw, e)) * on * (0.4 + 0.6 * h11(fi + 1.)));
  }
  return strk * (1. - clamp(fw * 0.9, 0., 1.));
}
`,ao=`
varying vec3 vW;
#include <fog_pars_vertex>
void main(){
  vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,oo=`
uniform vec4 uRect; uniform vec4 uPan; uniform vec3 uHead; uniform vec4 uAdder; uniform float uStill; uniform vec2 uShDir;
varying vec3 vW;
${pe}
${oa}
${na}
${Ja}
#include <fog_pars_fragment>
float sdRect(vec2 p){ vec2 c = 0.5 * (uRect.xy + uRect.zw), h = 0.5 * (uRect.zw - uRect.xy); vec2 q = abs(p - c) - h; return length(max(q, 0.)) + min(max(q.x, q.y), 0.); }
void main(){
  vec2 xz = vW.xz;
  if (xz.x > uRect.x && xz.x < uRect.z && xz.y > uRect.y && xz.y < uRect.w) discard;
  vec3 V = normalize(cameraPosition - vW);
  float fw = fwidth(xz.x) + fwidth(xz.y);
  vec3 glass = glassLook(xz, V, fw);
  float lat = xz.y - ${ft(I)}, dA = ${ft(Te)} - xz.x;
  float n1 = fbm2(xz * 0.021 + uSeed), n2 = vn2(xz * 0.9), n3 = vn2(xz * 0.17 + 3.);
  // Deadvlei: an oval of bare glass; its edge is one line
  vec2 pq = (xz - uPan.xy) / uPan.zw;
  float pe = length(pq) - 1. + 0.1 * (fbm2(xz * 0.012 + uSeed) - 0.5);
  float pan = 1. - smoothstep(-0.012, 0.012, pe);
  float mR = smoothstep(1., 18., sdRect(xz));                  // the dune stands on bare glass
  float farK = smoothstep(230., 700., abs(lat - 40.));
  // the ripple fields: combed films, gold in the troughs, sienna on the crests
  float rp, rpF;
  float film = fieldFilm(xz, fw, farK, n1, n2, n3, rp, rpF);
  // comb strokes: four fingers at a time cross the fields and leave clean lines that refill behind them
  float comb = 0., combLip = 0., fwz = fw * 0.6;
  for (int i = 0; i < 8; i++) {
    float fi = float(i);
    float zr = h11(fi * 3.1 + uSeed) - 0.5; float zc = ${ft(I)} + sign(zr) * (11. + abs(zr) * 160.);
    float hx = 340. - mod(uTime * (24. + 14. * h11(fi + 7.)) * (1. - 0.6 * uStill) + fi * 97., 560.);
    float back = xz.x - hx;
    float lz = xz.y - zc - 3. * sin(xz.x * 0.02 + fi) - 0.5 * sin(xz.x * 0.13 + fi * 2.);
    float fing = abs(fract(lz / 2.4) - 0.5) * 2.4, wd = 0.3 + 0.13 * h11(fi * 5.3 + floor(lz / 2.4));
    float cut = smoothstep(0., 2.5, back) * (1. - smoothstep(40., 300., back)) * step(abs(lz), 4.8);      // bare behind the head, refilling far behind
    comb = max(comb, (1. - smoothstep(wd, wd + 0.1 + fwz, fing)) * cut);
    combLip = max(combLip, smoothstep(wd - 0.05, wd + 0.07, fing) * (1. - smoothstep(wd + 0.1, wd + 0.42 + fwz, fing)) * cut * (1. - smoothstep(90., 260., back)));
  }
  film += combLip * (0.4 + 0.9 * n2) * (1. - clamp(fw * 0.5, 0., 1.)) * smoothstep(0.01, 0.06, film);     // displaced sand heaped along each finger
  film = mix(film, 0.002 + 0.005 * n2, comb * (1. - clamp(fw * 0.12, 0., 1.)));
  float cr0 = 0.5 + 0.5 * rp; cr0 *= cr0; cr0 *= cr0;
  film = mix(wipedFilm(xz, fw, n1, n2, cr0, rpF), film, smoothstep(26., 80., sdRect(xz))) * (1. - pan);      // the dune stands in a wiped margin
  // (added) behind the palm's front the fingers' combed strokes run on out of the dune's footprint over the glass beside it
  film += 0.05 * combStreaks(xz, fwidth(xz.y)) * wipeGone(xz) * (1. - smoothstep(45., 70., sdRect(xz)));
  // Deadvlei's floor is never bare white: clay plates under a breath of sand. The dunes' long shadows lie across it, drawn in
  // sand as bands of deeper film running away from the sun-print; wind ripples stand in that film; every plate has a tone of
  // its own, and a drift of darker sand is heaped against the lee of its cracks
  float sAl = dot(xz, uShDir), sAc = dot(xz, vec2(-uShDir.y, uShDir.x));
  float sbN = fbm2(vec2(sAc * 0.021, sAl * 0.0031) + uSeed * 2.) + 0.06 * (n3 - 0.5);
  float shade = smoothstep(0.53, 0.63, sbN), shadeC = smoothstep(0.68, 0.8, sbN);
  float pF = 1. - clamp(fw * 0.8, 0., 1.);
  float pc = 0.5 + 0.5 * sin(dot(xz, vec2(5.7, 2.2)) + 5. * n3 + 2.5 * n1 + 3. * vn2(xz * 0.31 + 5.)); pc *= pc;
  float pRip = (pc - 0.375) * pF * smoothstep(0.3, 0.62, vn2(xz * 0.11 + 17.));
  vec2 cg = xz / 1.35 + 0.3 * vec2(n3, n2), ci = floor(cg), cf = fract(cg); float d1 = 8., d2 = 8., pid = 0.5; vec2 q1 = vec2(0.), q2 = vec2(1., 0.);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 o = vec2(float(i), float(j)); vec2 r = o + vec2(h21(ci + o), h21(ci + o + 17.3)) - cf; float dd = dot(r, r);
    if (dd < d1) { d2 = d1; q2 = q1; d1 = dd; q1 = r; pid = h21(ci + o + 41.7); } else if (dd < d2) { d2 = dd; q2 = r; }
  }
  float edge = sqrt(d2) - sqrt(d1);
  float crack = (1. - smoothstep(0.012, 0.04 + fw * 0.7, edge)) * (1. - clamp(fw * 0.55, 0., 1.));
  vec2 en = q2 - q1; en /= max(length(en), 1e-4);                  // across the nearest crack, out of this plate
  float leeD = smoothstep(0.05, 0.85, dot(en, vec2(-0.93, -0.37))) * (1. - smoothstep(0.03, 0.4 + 0.3 * n2, edge * 0.7)) * pF;
  float pfilm = 0.006 + 0.007 * (pid - 0.5) * pF + 0.003 * (n1 - 0.5) + 0.011 * pRip * (0.5 + shade);
  pfilm += shade * (0.006 + 0.006 * n2) + shadeC * (0.018 + 0.022 * n1) + leeD * (0.022 + 0.04 * n2) * (1. + 0.6 * shade);
  pfilm += crack * (0.05 + 0.06 * n3);
  film += pan * mR * max(pfilm, 0.003);
  // our furrow: a road of bare glass; ahead of the stroke head a film of dust still lies on it
  float fur = (1. - smoothstep(4.2, 6.0, abs(lat) + 0.5 * (n3 - 0.5) + 0.9 * (vn2(vec2(xz.x * 0.4, 3.)) - 0.5))) * (1. - smoothstep(165., 265., dA)) * (1. - pan);
  float ahead = smoothstep(-3., 5., uHead.x - xz.x) * uHead.z;      // 0 behind the head (clean), 1 in front of it
  float fing = roadStreaks(lat, xz.x, n2, vn2(xz * 3.3), fw);      // streaks left by the fingertip
  float smudge = smoothstep(0.62, 0.9, vn2(vec2(lat * 0.45 + 7., xz.x * 0.045))) * (1. - clamp(fw * 0.5, 0., 1.));
  float dust = (0.003 + 0.006 * n1) * mix(0.6, 1.4, ahead) + 0.07 * fing * (0.35 + 0.65 * n3) + 0.014 * smudge * n2;
  dust += 0.015 * chatter(lat, xz.x, fw / 2.6) * (0.4 + 0.6 * n3);
  // (ahead of the stroke head the road has not been swept yet: a breath of dust lies on it in faint ripples)
  float dr = 0.5 + 0.5 * sin(xz.x * 6.4 + 2.5 * n3 + 3. * vn2(xz * 0.4)); dr *= dr;
  dust += ahead * (0.004 + 0.012 * n1 + 0.016 * dr * (1. - clamp(fw * 1.6, 0., 1.)) * smoothstep(0.3, 0.6, vn2(xz * 0.12 + 9.)));
  // beetle stitches: a faint wandering line of paired dots here and there across the furrow floor
  float sc = dA / 19. + 0.5 * n1, sk = floor(sc);
  float sd = (fract(sc) - 0.5) * 19. - lat * (h11(sk) - 0.5) * 2.6 - 1.4 * sin(lat * 0.8 + sk * 2.1) - 0.5 * sin(lat * 2.3 + sk);
  float dots = 1. - smoothstep(0.1, 0.25, abs(fract(lat / 0.17 + 0.4 * sin(lat * 3.7 + sk) + 0.5 * step(0., sd)) - 0.5));
  float stitch = (1. - smoothstep(0.015, 0.04 + fw, abs(abs(sd) - 0.06))) * dots * step(0.5, h11(sk + 4.)) * (1. - clamp(fw * 7., 0., 1.));
  dust += 0.06 * stitch;
  film = mix(film, dust, fur);
  // the adder's ladder: parallel J marks written one after another across a ripple slope
  vec2 ar = xz - uAdder.xy; vec2 ad = vec2(cos(uAdder.z), sin(uAdder.z));
  float aq = dot(ar, ad), ap = dot(ar, vec2(-ad.y, ad.x));
  float qh = mod(uTime * 0.9, 31.);
  float inL = step(0., aq) * step(aq, min(qh, 25.)) * (1. - smoothstep(0.75, 0.85, abs(ap)));
  float am = abs(fract((aq - 0.4 * ap + 0.25 * ap * ap) / 1.05) - 0.5) * 1.05;
  float mark = (1. - smoothstep(0.03, 0.07 + fw * 0.6, am)) * inL * (1. - clamp(fw * 1.2, 0., 1.));
  float lipA = (1. - smoothstep(0.08, 0.2 + fw * 0.6, am)) * inL * (1. - clamp(fw * 1.2, 0., 1.));
  float snake = (1. - smoothstep(0.035, 0.07, abs(ap - 0.3 * sin((aq - qh) * 14. + uTime * 6.)))) * step(qh, aq) * step(aq, qh + 0.5) * step(qh, 25.);
  film = mix(film * (1. + 0.9 * lipA), 0.01, mark) + snake * 1.5 * (1. - pan);
  // sand snakes: wisps of loose grains skimming the surface on the wind
  vec2 wq = vec2(dot(xz, vec2(0.93, 0.37)) + uTime * 9., dot(xz, vec2(-0.37, 0.93)));
  float wisp = smoothstep(0.58, 0.78, vn2(vec2(wq.x * 0.03, wq.y * 0.85) + 2. * n1)) * smoothstep(0.3, 0.7, vn2(vec2(wq.x * 0.012 + 5., wq.y * 0.05)));
  wisp *= (1. - clamp(fw * 0.12, 0., 1.)) * (1. - 0.6 * uStill) * mR * (1. - 0.85 * fur);      // (our furrow is swept clean: bare cream)
  film = film * (1. - 0.4 * wisp) + 0.035 * wisp;
  // grain: still, world-anchored, faded to its mean before it can crawl
  float n4 = vn2(xz * 7.3), n5 = vn2(xz * 23.);
  film *= 1. + 0.5 * (n2 - 0.5) * (1. - clamp(fw * 0.9, 0., 1.)) + 0.55 * (n4 - 0.5) * (1. - clamp(fw * 6., 0., 1.)) + 0.5 * (n5 - 0.5) * (1. - clamp(fw * 18., 0., 1.));
  film += 0.012 * smoothstep(0.78, 0.95, n4) * n5 * (1. - clamp(fw * 8., 0., 1.));
  vec3 col = sandRamp(max(film, 0.), glass);
  gl_FragColor = vec4(max(col, 0.), 1.);
  #include <fog_fragment>
}`,so=`
attribute vec2 aD; attribute float aG; attribute vec2 aC; attribute vec3 aN2; attribute vec4 aW;
uniform vec4 uLeg; uniform vec3 uFur;
varying vec3 vW; varying vec3 vN; varying vec2 vD; varying float vG; varying vec2 vC; varying vec4 vWl;
${pe}
#include <fog_pars_vertex>
void main(){
  vec3 n = normal;
#ifdef USE_INSTANCING
  vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.); n = mat3(instanceMatrix) * n;
#else
  vec4 wp = modelMatrix * vec4(position, 1.);
#endif
  if (aG > 1.5) wp.y += aD.y * 0.08 * sin(uTime * 3.1 + wp.x * 1.7 + wp.z * 2.3);   // frayed ribbons and thorn tremble
  if (aG > 0.5 && aG < 1.5) {      // the trench up the Great Dune is ploughed by the stroke head: ahead of it the arm is still whole
    float la = dot(wp.xz - uLeg.xy, uLeg.zw);
    float ah = smoothstep(uFur.x - 5., uFur.x + 3., la);
    wp.y += aC.x * ah; n = mix(n, aN2, ah);
  }
  vW = wp.xyz; vN = n + vec3(0., 1e-5, 0.); vD = aD; vG = aG; vC = aC; vWl = aW;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,no=`
uniform vec4 uLeg; uniform vec3 uFur; uniform float uStill, uHerdS; uniform vec3 uHT[17];
varying vec3 vW; varying vec3 vN; varying vec2 vD; varying float vG; varying vec2 vC; varying vec4 vWl;
${pe}
${oa}
${na}
#include <fog_pars_fragment>
void main(){
  vec2 xz = vW.xz;
  vec3 V = normalize(cameraPosition - vW);
  float fw = fwidth(xz.x) + fwidth(xz.y);
  vec3 glass = glassLook(xz, V, fw);
  float n1 = fbm2(xz * 0.08), n2 = vn2(xz * 0.9);
  vec3 N = normalize(vN);
  vec3 col;
  if (vG > 1.5) {
    float rim = 1. - abs(dot(N, V));
    float eg = abs(vD.x);      // (a welwitschia ribbon thins to a film at both edges, and frays there)
    float dRib = 7. * max(exp(-5.5 * rim * rim), 0.3) * (0.5 + n2) * (1. - 0.985 * smoothstep(0.35, 0.95, eg + 0.5 * (vn2(xz * 9.) - 0.5) * step(0.05, eg)));
    if (eg > 0.05 && eg + 0.45 * (vn2(xz * 13. + 3.) - 0.5) > 0.97) discard;
    col = sandRamp(dRib, glass * 0.9);
  } else if (vG < -0.5) {
    // the ridges our stroke heaps up beside the furrow: loose sand, a burning ragged crest, slumping on the
    // furrow side into fans that feather out onto the glass, melting on the far side into the ripple field
    float y = max(vW.y, 0.);
    float inner = 1. - smoothstep(-0.5, 0.5, vD.x);
    float f1n = fbm2(xz * 0.021 + uSeed), f3n = vn2(xz * 0.17 + 3.), rp, rpF;
    float ff = fieldFilm(xz, fw, 0., f1n, n2, f3n, rp, rpF);
    float hgtK = smoothstep(0.15, 1.2, vD.y);
    float furK = 1. - smoothstep(165., 265., ${ft(Te)} - xz.x);       // where the furrow ends, its swept glass ends with it
    float base = mix(ff * mix(1., 0.55, hgtK), 0.004 + 0.008 * f1n, inner * furK);
    float g4 = (vn2(xz * 7.3) - 0.5) * (1. - clamp(fw * 6., 0., 1.)), g5 = (vn2(xz * 23.) - 0.5) * (1. - clamp(fw * 18., 0., 1.));
    float nb = fbm2(xz * 0.37 + 5.);
    float d = y * (0.9 + 1.5 * nb);
    float wr = sin(dot(xz, vec2(7.5, 2.1)) + 5. * n2 + 2. * nb) * (1. - clamp(fw * 2.2, 0., 1.));      // wind ripples on the outer slope
    d *= 1. + 0.8 * g4 + 0.7 * g5 + 0.3 * wr * (1. - inner);
    float w = clamp(y / max(vD.y * 0.385, 0.2), 0., 1.);
    float cs = xz.x / 0.85 + 2.2 * n2; float ck = floor(cs); float cf = abs(fract(cs) - 0.5);
    float fanW = 0.08 + 0.34 * (1. - w);
    float fan = (1. - smoothstep(fanW * 0.6, fanW, cf)) * step(0.35, h11(ck + 9.)) * inner * (1. - clamp(fw * 2., 0., 1.));
    float flow = vn2(vec2(xz.x * 7., y * 9. + uTime * (1.2 + 1.6 * h11(ck))));
    d = mix(d, d * (0.18 + 0.5 * flow), fan * (0.6 + 0.4 * sin(uTime * (0.6 + h11(ck + 3.)) + 30. * h11(ck))));
    float dEff = base + d;
    float below = max(abs(vD.x) - fw * 1.3, 0.);
    float blade = 0.02 + 0.04 * n2 + below * (0.35 + 0.5 * nb) + below * below * 0.3;
    dEff = mix(dEff, min(dEff, blade), smoothstep(0.4, 2.2, vD.y));
    col = sandRamp(max(dEff, 0.), glass);
  } else {
    float y = max(vW.y, 0.);
    float d = y * (0.5 + n1);
    d *= 1. + 0.5 * (n2 - 0.5) * (1. - clamp(fw * 0.9, 0., 1.));
    // every crest is a thin blade: it burns along its rim
    float standing = smoothstep(1.0, 6., vD.y);
    float below = max(abs(vD.x) - fw * 1.3, 0.) * mix(1., 0.8, step(0., vD.x));
    float blade = 0.025 + 0.04 * n2 + below * (0.15 + 0.16 * n1) + below * below * 0.02;      // (thin for a couple of metres under the crest: gold, then orange)
    float dEff = mix(d, min(d, blade), standing);
    // the stroke's furrow up the Great Dune (the trench strip carries its own wall coordinates: metres past the toe,
    // sand standing above the trench floor, metres past the rim crest, and how much of a pouring chute this is)
    vec2 r = xz - uLeg.xy; float a = dot(r, uLeg.zw), bs = dot(r, vec2(uLeg.w, -uLeg.z));
    float isG = step(0.5, vG);
    float tipK = sqrt(clamp((uFur.x - a) / 9., 0., 1.));              // the head is a rounded fingertip
    float drawn = step(a, uFur.x) * smoothstep(uFur.y, uFur.y + 9., a) * isG;
    float deep = smoothstep(0.3, 1.6, vC.y);
    float sgn = bs < 0. ? 7. : 0.;
    // how far one pixel reaches over the ground and over the wall: grain fades on the mean of the two axes, so a wall
    // seen at a grazing angle keeps its grain; lines fade on the footprint of their own phase
    float gm = sqrt(abs(dFdx(xz.x) * dFdy(xz.y) - dFdx(xz.y) * dFdy(xz.x)) + 1e-9);
    float fa = fwidth(a), gmW = sqrt(fa * (fwidth(vWl.x) + fwidth(vWl.y)) + 1e-9);
    vec2 wq2 = vec2(a + sgn, vWl.x * 0.8 + vWl.y * 1.1);
    float gA = (vn2(wq2 * 9.) - 0.5) * (1. - clamp(gmW * 11. - 0.3, 0., 1.));
    float gB = (vn2(wq2 * 26. + 5.) - 0.5) * (1. - clamp(gmW * 31. - 0.3, 0., 1.));
    float gC = (vn2(wq2 * 61. + 3.) - 0.5) * (1. - clamp(gmW * 73. - 0.3, 0., 1.));
    float grainW = 0.55 * gA + 0.8 * gB + 0.9 * gC;
    float spk = h21(floor(wq2 * 30.)), spk2 = h21(floor(wq2 * 11.) + 31.);
    float speck = (step(0.84, spk) - step(spk, 0.16)) * (1. - clamp(gmW * 34. - 0.25, 0., 1.)) + 0.7 * (step(0.88, spk2) - step(spk2, 0.12)) * (1. - clamp(gmW * 12. - 0.25, 0., 1.));
    float sd = vWl.x + (1. - tipK) * 9.;
    float tw = clamp(vWl.x / max(vWl.x - vWl.z, 0.4), 0., 1.);        // 0 at the toe of the wall .. 1 at the crest of its rim
    // (the glass floor is the lamp: a wall glows orange at its foot and darkens through sienna to umber under its rim)
    float th = mix(2.5, min(max(vWl.y, 0.), 0.05 + 3.3 * tw * tw), tipK);
    // chutes: one every 5.6 m or so down each wall (the layout the mesh was scalloped with). A channel of thinner sand
    // sliding in tongues, and at its heart one thin thread of falling grains from rim to toe
    float cq = a / 5.6 + sgn * 0.37, ck = floor(cq);
    float da = a - (ck + 0.5 + 0.28 * sin(ck * 12.9898 + sgn) - sgn * 0.37) * 5.6;
    float wch = 0.8 + 0.3 * sin(ck * 78.233 + sgn), hk = h11(ck + sgn + 1.);
    float chan = (1. - smoothstep(0.3, 0.85, abs(da) / wch)) * deep;
    float slide = vn2(vec2(ck * 3.7 + sgn + da * 2.2, tw * 3.5 + uTime * (0.8 + 0.7 * hk)));
    float thN = th * (0.75 + 0.5 * vn2(vec2(a * 0.45 + sgn, 2.))) * exp2(2.0 * grainW + 0.9 * speck);
    thN *= mix(1., 0.22 + 0.6 * slide, chan * (0.75 + 0.25 * sin(uTime * (0.5 + hk) + 30. * hk)));
    float dash = smoothstep(0.3, 0.6, vn2(vec2(ck * 9.1 + sgn, tw * 12. + uTime * (3. + 2. * hk))));
    float thrW = 0.045 + 0.9 * fa, ends = smoothstep(0.0, 0.1, tw) * (1. - smoothstep(0.93, 1., tw)) * deep;
    float thread = (1. - smoothstep(thrW * 0.45, thrW, abs(da + 0.1 * sin(tw * 8. + ck * 3.)))) * (0.5 + 0.5 * dash) * ends;
    // lesser rills between the chutes, each with a fainter thread of its own
    float rq = a / 1.87 + sgn * 0.61, rk = floor(rq), rda = (fract(rq) - 0.5 - 0.25 * sin(rk * 7.1 + sgn)) * 1.87, rOn = step(0.3, h11(rk + sgn + 4.));
    float rdash = smoothstep(0.32, 0.62, vn2(vec2(rk * 5.3 + sgn, tw * 11. + uTime * (2.2 + 1.8 * h11(rk + 2.)))));
    thN *= mix(1., 0.6, (1. - smoothstep(0.08, 0.4, abs(rda))) * rOn * deep);
    thread = max(thread, (1. - smoothstep(thrW * 0.4, thrW * 0.85, abs(rda + 0.07 * sin(tw * 9. + rk)))) * (0.15 + 0.6 * rdash) * rOn * ends);
    thN *= mix(1., smoothstep(0.3, 0.62, 0.55 * vn2(xz * 17.) + 0.45 * vn2(xz * 41. + 5.) + 2.4 * thN), (1. - clamp(gm * 26. - 0.3, 0., 1.)) * deep);      // a fan's thin edge is single grains on the glass
    thN = mix(thN, 0.012 + 0.03 * dash, thread * 0.95);
    // the floor: fingertip streaks, dust, and where a chute comes down a spray of single grains thrown out over the glass
    float fst = roadStreaks(bs, a * 1.3 + 400., n2, vn2(xz * 3.3), fw);
    float floorFilm = 0.005 + 0.016 * n2 * n1 + 0.075 * fst * (0.35 + 0.65 * n2) + 0.02 * smoothstep(0.75, 0.95, vn2(xz * 7.3)) * (1. - clamp(gm * 9., 0., 1.));
    floorFilm += 0.02 * chatter(bs, a + 77., fw / 2.6) * (0.4 + 0.6 * n1) + 0.02 * smoothstep(0.55, 0.85, vn2(vec2(a * 0.11 + 3., bs * 0.5)));
    float spray = vWl.w * smoothstep(-1.5, 0.15, vWl.x) * (1. - clamp(gm * 40., 0., 1.));
    floorFilm += spray * (0.3 * smoothstep(0.62, 0.8, vn2(xz * 31.)) + 0.12 * smoothstep(0.7, 0.85, vn2(xz * 67. + 9.)));
    float wS = clamp(sd / 1.3, 0., 1.);
    float feather = 1. + (1.8 * gC + 1.2 * gB) * (1. - smoothstep(0.15, 0.9, thN));      // a fan's thin edge is grains, not a wash
    float dTr = floorFilm * (1. - wS) + mix(0.03 * wS + 0.45 * wS * wS, max(thN * feather, 0.), deep);
    // the rim is one thin ragged blade of heaped sand: it burns
    float rd = max(abs(vWl.z + 0.09 * vn2(vec2(a * 2.9 + sgn, 7.)) - 0.045) - fwidth(vWl.z) * 0.6, 0.);
    dTr = mix(dTr, min(dTr, 0.018 + 0.03 * n2 + rd * (1.1 + 1.0 * n2) + rd * rd * 2.5), deep);
    float trM = drawn * (1. - mix(smoothstep(0.8, 2.2, sd), smoothstep(0.4, 2.6, vWl.z), deep));
    col = sandRamp(dEff, glass);
    // form inside the darks: windward sienna, slip umber, heart umber-black, a 12 % rake from the sun-print
    float facing = smoothstep(-0.2, 0.6, dot(N, vec3(0.62, 0.2, 0.5)));
    float hgt = smoothstep(3., 85., y);
    float big = fbm2(xz * 0.012 + 3.);
    float camD = length(cameraPosition - vW);
    float farD = smoothstep(200., 1000., camD) * hgt;
    // wind ripples: sienna crests over orange troughs. They lie oblique to our line up the arm, so they still read at a
    // grazing angle, and each set fades on the footprint of its own phase
    float ph1 = (0.9 * a + 0.44 * abs(bs) + 0.2 * vW.y) * 3.93 + 5. * n1 + 2. * vn2(xz * 0.21);
    float ph2 = (0.5 * a - 0.87 * abs(bs) + 0.1 * vW.y) * 9. + 6. * n2 + 3. * n1;
    float r1F = 1. - smoothstep(0.7, 2.4, fwidth(ph1)), r2F = 1. - smoothstep(0.7, 2.4, fwidth(ph2));
    float c1 = 0.5 + 0.5 * sin(ph1), crest = c1 * c1; crest *= crest;
    float rip = (0.375 - crest) * r1F + 0.35 * sin(ph2) * r2F * (1. - crest);
    float g4 = (vn2(xz * 7.3) - 0.5) * (1. - clamp(gm * 9. - 0.3, 0., 1.)), g5 = (vn2(xz * 23.) - 0.5) * (1. - clamp(gm * 28. - 0.3, 0., 1.));
    vec3 form = mix(uUmber * 0.85, mix(uSienna, uOrange, 0.1 + 0.22 * big), facing) * mix(1.15, 0.7, sqrt(hgt)) * (0.75 + 0.5 * big) * mix(1., 0.55, farD);
    form *= 1. + (1.0 * rip + 0.4 * g4 + 0.45 * g5) * (0.45 + 0.55 * facing);
    form += (uOrange * 0.9 - form) * 0.75 * (0.375 - crest) * r1F * facing * (1. - 0.7 * hgt);
    form = mix(form, uBlack * 1.5 + uUmber * 0.3, smoothstep(0.3, 1., hgt) * mix(0.8, 0.12, facing));
    form += uOrange * 0.12 * max(dot(normalize(N + vec3(0.3 * (crest - 0.375) * r1F, 0., 0.)), uSun), 0.) * mix(1., 0.5, hgt);
    // loose sand streaming over the faces on the wind: thin amber skeins, never still
    vec2 wq = vec2(dot(xz, vec2(0.93, 0.37)) + uTime * 9., dot(xz, vec2(-0.37, 0.93)));
    float skF = 1. - clamp(fwidth(wq.y) * 3.5, 0., 1.);
    float st1 = smoothstep(0.66, 0.82, vn2(vec2(wq.x * 0.16, wq.y * 0.9) + 2. * n1));
    float st2 = smoothstep(0.68, 0.84, vn2(vec2(wq.x * 0.3 + 11., wq.y * 1.7 + 3.)));
    float skG = mix(smoothstep(0.35, 0.65, vn2(wq * vec2(5., 9.))) * (0.6 + 0.8 * vn2(wq * vec2(13., 21.) + 4.)), 0.5, clamp(gm * 9. - 0.3, 0., 1.));
    float strm = max(st1, 0.8 * st2) * skG * 1.5 * skF * (1. - smoothstep(260., 700., camD)) * (1. - 0.7 * uStill);
    form = mix(form, mix(uOrange, uGold, 0.45) * 0.95, strm * 0.5 * (0.35 + 0.65 * facing));
    // avalanche tongues slide down the slip faces
    float rpF = 1. - clamp(fw * 0.35, 0., 1.);
    float lee = step(vD.x, 0.);
    float cx = (xz.x * 0.45 - xz.y * 0.9) / 11. + 0.6 * vn2(vec2(xz.x * 0.03, 2.)); float ci = floor(cx);
    float hd = fract(uTime * (0.035 + 0.03 * h11(ci)) + h11(ci + 9.)) * 110.;
    float tongue = (1. - smoothstep(hd - 3., hd, -vD.x)) * smoothstep(hd - 46., hd - 6., -vD.x) * (1. - smoothstep(0.1, 0.45, abs(fract(cx) - 0.5))) * step(0.45, h11(ci + 3.));
    form = mix(form, mix(uSienna, uOrange, 0.5), lee * tongue * 0.7 * rpF);
    col = mix(col, form, smoothstep(1.6, 5., dEff));
    // the herd's scratched tracks where it left our furrow and went out over the arm: one clean line per animal, cut to the glass
    float best = 1e9, trS = 0., trL = 0., trWt = 0.;
    for (int i = 0; i < 16; i++) {      // (distances to neighbouring spans are blended, so the lines bend without a kink)
      vec2 p0 = uHT[i].xy, e = uHT[i + 1].xy - p0, q = vec2(a, bs) - p0;
      float el = max(length(e), 1e-3), pr = dot(q, e) / el, t = clamp(pr / el, 0., 1.); vec2 dv = q - e * t; float dd = dot(dv, dv);
      float wt = exp(-min(dd, 300.) / 22.);
      best = min(best, dd); trWt += wt; trS += wt * (uHT[i].z + pr); trL += wt * (e.x * q.y - e.y * q.x) / el;
    }
    trS /= max(trWt, 1e-12); trL /= max(trWt, 1e-12);
    float tl = trL + 0.45 * sin(trS * 0.07) + 0.3 * (n1 - 0.5), tcell = floor(tl / 1.45), tf = (fract(tl / 1.45) - 0.5) * 1.45;
    float tfw = fwidth(tl), tw2 = 0.03 + 0.03 * h11(tcell + 2.) + min(0.7 * tfw, 0.06);
    float tline = (1. - smoothstep(tw2 * 0.55, tw2, abs(tf - 0.6 * (h11(tcell) - 0.5) - 0.08 * sin(trS * 0.9 + tcell * 3.)))) * step(abs(tl), 6.6) * step(best, 60.);
    tline *= smoothstep(0., 4., uHerdS - trS - 26. * h11(tcell + 5.)) * step(uHT[0].z + 0.5, trS) * (1. - smoothstep(uHT[16].z - 12., uHT[16].z - 1., trS)) * (0.6 + 0.4 * n2);
    col = mix(col, glass * 0.96, tline * 0.92 * (1. - smoothstep(0.12, 0.45, tfw)));
    vec3 trC = sandRamp(max(dTr, 0.), glass);
    trC = mix(trC, trC * (0.8 + 0.5 * n2) + uOrange * 0.1 * max(dot(N, uSun), 0.), smoothstep(0.8, 2.4, dTr));
    trC *= 1. + (0.9 * grainW + 0.4 * speck) * smoothstep(0.03, 0.3, dTr) * deep;      // still grain, also where the ramp has gone dark
    col = mix(col, trC, trM);
  }
  gl_FragColor = vec4(max(col, 0.), 1.);
  #include <fog_fragment>
}`,io=`
varying vec3 vDir;
void main(){ vDir = position; vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.); gl_Position = p; }`,ro=`
uniform vec3 uSkyH, uSkyA, uSkyM, uSkyZ, uLip, uWipe, uSunC, uSunDir, uVeilCol, uHaze, uBand;
uniform vec4 uStops;
uniform float uTime, uVeil, uNight, uSeed, uHazeK, uStill;
varying vec3 vDir;
float hs(float p){ p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
float hs2(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float sn2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hs2(i), hs2(i + vec2(1., 0.)), f.x), mix(hs2(i + vec2(0., 1.)), hs2(i + vec2(1., 1.)), f.x), f.y); }
// value noise that closes on itself round the horizon (P cells to the full turn)
float snw(vec2 p, float P){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); float x0 = mod(i.x, P), x1 = mod(i.x + 1., P);
  return mix(mix(hs2(vec2(x0, i.y)), hs2(vec2(x1, i.y)), f.x), mix(hs2(vec2(x0, i.y + 1.)), hs2(vec2(x1, i.y + 1.)), f.x), f.y); }
// pinholes pricked through the sand: at most one to a cell, most cells empty, no two the same size
float pinhole(vec2 zp, float N, float dens, float r0, float r1, out float halo, out float id){
  vec2 g = zp * N, i = floor(g); id = hs2(i + 7.3);
  vec2 c = 0.5 + 0.5 * (vec2(hs2(i + 1.7), hs2(i + 3.1)) - 0.5);
  float q = hs2(i + 5.9), r = mix(r0, r1, q * q), dd = length(fract(g) - c), on = step(1. - dens, id);
  halo = on * exp(-dd * dd / (r * r * 3.));
  return on * (1. - smoothstep(r * 0.5, r, dd));
}
void main(){
  vec3 d = normalize(vDir); float e = d.y, eh = max(e, 0.);
  float az = atan(d.z, abs(d.x) < 1e-5 ? 1e-5 : d.x), azn = az / 6.2832 + 0.5;
  vec2 zp = d.xz / (1. + eh);                               // continuous all round the horizon
  float grain = sn2(zp * 260.) * 0.6 + sn2(zp * 70. + 9.) * 0.4;
  // the sand is sifted over the pane in long level passes: it lies in soft drifts many times longer than they are deep,
  // thicker and thicker upward, and only a breath of single grains shows
  float drift = 0.6 * snw(vec2(azn * 9., eh * 7. + uSeed), 9.) + 0.4 * snw(vec2(azn * 22. + 3., eh * 17. + uSeed * 1.7), 22.);
  float k = pow(clamp(e, 0., 1.), 0.8);
  k = clamp(k + (drift - 0.5) * 0.24 * smoothstep(0.0, 0.16, e) * (1. - 0.6 * smoothstep(0.5, 0.9, e)) + (grain - 0.5) * 0.03 * smoothstep(0., 0.1, e), 0., 1.);
  vec3 col = mix(uSkyH, uSkyM, smoothstep(uStops.x, uStops.y, k)); col = mix(col, uSkyZ, smoothstep(uStops.z, uStops.w, k));
  col = mix(col, uSkyA, uBand.z * smoothstep(uBand.x * 0.3, uBand.x, k) * (1. - smoothstep(uBand.x, uBand.y, k)));      // (by night: the amber where the sand begins)
  // six cirrus streaks wiped clean by fingertips: pointed at both ends, the lines of the fingers in them, a heaped lip on their lee side
  float wipe = 0., lip = 0., fringe = 0.;
  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    float a0 = fi * 1.047 + 0.7 * hs(fi + uSeed) + uTime * 0.006 * (0.5 + hs(fi + 3.)) * (1. - 0.7 * uStill);
    float e0 = mix(0.16, 0.1, uNight) + mix(0.34, 0.2, uNight) * hs(fi * 1.7 + 2. + uSeed);
    float da = az - a0; da -= 6.2832 * floor(da / 6.2832 + 0.5);
    float x = da / (0.22 + 0.2 * hs(fi + 9.));
    float tp = max(1. - x * x, 0.), taper = tp * sqrt(tp);
    float th = (mix(0.046, 0.02, uNight) + 0.02 * hs(fi + 11.)) * (0.2 + 0.8 * taper);
    float yy = (e - e0 - (hs(fi + 5.) - 0.5) * 0.12 * da - 0.014 * sin(da * 6. + fi) - 0.03 * (drift - 0.5)) / th;
    float life = 0.6 + 0.4 * sin(uTime * 0.06 + fi * 2.1), inx = step(abs(x), 1.) * life;
    float fing = 0.55 + 0.45 * smoothstep(-0.25, 0.25, sin(yy * 4.4 + fi * 1.7 + 3. * x));
    float lift = 0.5 + 0.5 * smoothstep(0.28, 0.5, snw(vec2(azn * 46. + fi * 5., fi * 3.3), 46.));
    wipe = max(wipe, (1. - smoothstep(0.6, 1., abs(yy))) * inx * fing * lift);
    fringe = max(fringe, smoothstep(0.5, 0.9, abs(yy)) * (1. - smoothstep(0.9, 1.35, abs(yy))) * inx * tp);
    float ly = (yy + 1.35) / 0.5;
    lip = max(lip, exp(-ly * ly) * tp * inx);
  }
  col = mix(col, uLip, lip * 0.6 * (1. - wipe));
  col = mix(col, uSkyA, fringe * uBand.z * 0.55 * (1. - wipe));
  col = mix(col, uWipe, wipe * 0.75);
  // pinhole stars, each with a breath of gold round it, and the print wiped clean: a thumbprint sun, or a crescent moon at night
  float h1, i1, h2, i2, deep = smoothstep(0.3, 0.62, k) * (1. - wipe) * uNight;
  float s1 = pinhole(zp, 21., 0.12, 0.05, 0.13, h1, i1), s2 = pinhole(zp + 0.37, 47., 0.07, 0.09, 0.17, h2, i2);
  col += deep * (s1 * vec3(1.5, 1.42, 1.25) * (0.7 + 0.3 * sin(uTime * 2. + i1 * 50.)) + h1 * 0.09 * vec3(1., 0.7, 0.4)
    + s2 * 0.55 * vec3(1.3, 1.25, 1.15) * (0.7 + 0.3 * sin(uTime * 2.6 + i2 * 50.)));
  float ang = acos(clamp(dot(d, uSunDir), -1., 1.)); float R = 0.052;
  float trem = sn2(zp * 420. + floor(uTime * 3.) * 0.37);
  float rim = (ang - R * 1.14) / (R * 0.17); rim = exp(-rim * rim);
  float disc = 1. - smoothstep(R * 0.9, R, ang + R * 0.05 * (grain - 0.5));
  vec3 off = normalize(uSunDir + vec3(0.03, 0.012, -0.02)); float ang2 = acos(clamp(dot(d, off), -1., 1.));
  disc *= mix(1., smoothstep(R * 0.85, R * 1.0, ang2), uNight);
  float whorl = 0.5 + 0.5 * sin(ang / R * 21. + 5. * sn2(d.xz * 30. + d.y * 17.));
  col += uSunC * 0.1 * exp(-ang * 7.) * (1. - uNight) + uSkyA * 0.16 * exp(-ang * 9.) * uNight;
  col = mix(col, mix(uLip, uSkyA * 0.8, uNight), rim * (0.45 + 0.3 * trem) * (1. - disc));
  col = mix(col, uSunC * (0.9 + 0.1 * whorl), disc);
  col = mix(col, uHaze, uHazeK * (1. - smoothstep(0.0, 0.3, e)));
  col = mix(col, uVeilCol, uVeil);
  gl_FragColor = vec4(max(col, 0.), 1.);
}`,ia=`
attribute vec3 aRad; attribute vec3 aT; attribute vec2 aS;
uniform float uPx, uCur, uCurK, uRare; uniform vec3 uShadow;
varying vec3 vW; varying vec3 vN; varying vec3 vT; varying float vProg; varying float vE;
${pe}
#include <fog_pars_vertex>
void main(){
  vec3 p = position, rad = aRad, n = normal;
  float prog = 2.;
  if (abs(aT.z - uCur) < 0.5) prog = uCurK;
  if (uRare > -0.5) prog = min(prog, uRare - aT.y * 0.14);
  vE = 0.;
#ifdef SHADOW
  // the shadow is drawn in sand: the same line laid on the glass as a stroke at least half a metre wide
  vec3 cl = p - rad; float hwS = max(2.2 * length(rad), 0.27);
  vE = length(aS);
  p = vec3(cl.x + uShadow.x * cl.y + aS.x * hwS, 0.05, cl.z + uShadow.y * cl.y + aS.y * hwS);
  rad = vec3(0.); n = vec3(0., 1., 0.);
#endif
#ifndef SHADOW
  if (max(aT.x, 0.) > prog) { p += rad * 0.9; rad *= 1.9; }      // a ghost is a wider, fainter scratch
#endif
  vec4 wp = modelMatrix * vec4(p, 1.);
  float rMin = 0.85 * length(cameraPosition - wp.xyz) / max(uPx, 1.), rl = length(rad);
  if (rl > 1e-5) wp.xyz += rad * (clamp(rMin / rl, 1., 8.) - 1.);
  vW = wp.xyz; vN = n + vec3(0., 1e-5, 0.); vT = aT; vProg = prog;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ra=`
varying vec3 vW; varying vec3 vN; varying vec3 vT; varying float vProg; varying float vE;
${pe}
#include <fog_pars_fragment>
void main(){
  float order = max(vT.x, 0.);
#ifdef SHADOW
  if (order > vProg || vT.x < -0.5) discard;
  float n = vn2(vW.xz * 3.1), thin = 0.5 + 0.5 * sin(uTime * 0.35 + vT.y * 40.);
  float e = vE + 0.35 * (n - 0.5) + 0.2 * (vn2(vW.xz * 11.) - 0.5);
  if (e > 0.98 - 0.25 * thin * vn2(vW.xz * 0.7 + vT.y * 9.)) discard;              // a ragged edge that slowly thins and is redrawn
  vec3 col = sandRamp(mix(0.34, 0.012, smoothstep(0.25, 0.95, e)) * (0.7 + 0.6 * n), uGlass);
#else
  float fw = fwidth(vW.x) + fwidth(vW.y) + fwidth(vW.z);
  float gA = mix(vn3(vW * 30. + vT.y * 17.), 0.5, clamp(fw * 20. - 0.3, 0., 1.));
  if (order > vProg && h31(floor(vW * 9.) + 0.5) > 0.4) discard;      // a faint scratched ghost until it is drizzled again
  vec3 N = normalize(vN) * (gl_FrontFacing ? 1. : -1.), V = normalize(cameraPosition - vW);
  float rim = 1. - abs(dot(N, V)); rim = rim * rim * (0.35 + 0.65 * rim);
  float fringe = (1. - smoothstep(0., 0.06, vProg - order)) * step(order, vProg);      // the drawing point burns
  float k = clamp(rim * 1.05 + fringe * 1.0, 0., 1.);
  float dEq = 10. * exp(-7. * k) * (0.65 + 0.7 * gA);
  if (vT.x < -0.5) dEq = max(vW.y, 0.) * 5. * (0.6 + 0.8 * gA);            // the heap at the foot: feathered gold edge
  vec3 col = sandRamp(dEq, uGlass * 0.9);
  col += uSienna * 0.1 * max(dot(N, uSun), 0.);
#endif
  gl_FragColor = vec4(max(col, 0.), 1.);
  #include <fog_fragment>
}`,lo=`
attribute vec4 aB; attribute vec4 iG;
uniform float uPx, uWindK;
varying float vT; varying float vS;
${pe}
#include <fog_pars_vertex>
void main(){
  float t = aB.z, s = iG.z, seed = iG.w;
  float ca = cos(seed * 6.283), sa = sin(seed * 6.283);
  vec2 dir = vec2(aB.x * ca - aB.y * sa, aB.x * sa + aB.y * ca);
  float ph = seed * 6.283 + dot(iG.xy, vec2(0.07, 0.05));
  float gust = 0.5 + 0.5 * sin(uTime * 2.3 + ph) + 0.3 * sin(uTime * 5.3 + ph * 1.7 + t * 2.);
  vec2 wd = vec2(-0.93, -0.37);
  vec3 p = vec3(iG.x, 0., iG.y);
  p.xz += dir * (0.3 + 0.25 * fract(seed * 13.7 + aB.x)) * t * s + wd * uWindK * (0.22 + 0.3 * gust) * t * t * s;
  p.y = t * s * (1. - 0.3 * t * uWindK * gust) * (0.75 + 0.5 * fract(seed * 7.3 + aB.y));
  vec4 wp = modelMatrix * vec4(p, 1.);
  float w = max(0.014 * s * (1. - 0.8 * t), 0.8 * length(cameraPosition - wp.xyz) / max(uPx, 1.));
  wp.xz += vec2(-dir.y, dir.x) * aB.w * w;
  vT = t; vS = seed;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,fo=`
varying float vT; varying float vS;
${pe}
#include <fog_pars_fragment>
void main(){
  vec3 col = sandRamp(mix(3.2, 0.1, vT * vT) * (0.7 + 0.6 * fract(vS * 31.)), uGlass * 0.9);
  gl_FragColor = vec4(max(col, 0.), 1.);
  #include <fog_fragment>
}`,co=`
attribute vec4 iG;
varying vec2 vUv; varying float vS; varying float vA;
${pe}
#include <fog_pars_vertex>
void main(){
  vec3 p = vec3(iG.x + position.x * 1.25 * iG.z, 0.03, iG.y + position.y * 1.25 * iG.z);
  vUv = position.xy; vS = iG.w;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mvPosition;
  vA = 1. - smoothstep(60., 110., -mvPosition.z);
  #include <fog_vertex>
}`,ho=`
varying vec2 vUv; varying float vS; varying float vA;
${pe}
#include <fog_pars_fragment>
void main(){
  float r = length(vUv), fw = fwidth(r);
  float an = atan(vUv.y, abs(vUv.x) < 1e-4 ? 1e-4 : vUv.x);
  float sweep = smoothstep(-0.5, 0.3, cos(an - vS * 6.283 - 0.5 * sin(uTime * 2.3 + vS * 40.)));
  float r1 = 0.72 + 0.06 * sin(an * 3. + vS * 20.), r2 = 0.44 + 0.05 * sin(an * 2. + vS * 9.);
  float a = max((1. - smoothstep(0.012, 0.035 + fw, abs(r - r1))), 0.6 * (1. - smoothstep(0.01, 0.03 + fw, abs(r - r2)))) * sweep;
  a *= vA * (1. - clamp(fw * 4., 0., 1.));
  if (a < 0.02) discard;
  gl_FragColor = vec4(uSienna * 0.55, a * 0.85);
  #include <fog_fragment>
}`,la=`
attribute vec4 aPart; attribute vec3 aPaint; attribute vec4 iA;
uniform float uOstS, uPx; uniform vec3 uOstO, uOstL, uShadow;
varying vec3 vRest; varying vec3 vN; varying vec3 vW; varying vec3 vPaint; varying float vSeed;
${pe}
#include <fog_pars_vertex>
#define OSTR 3.3
#define ODUTY 0.3
#define OHIP 1.12
#define OL1 0.52
#define OL2 0.66
void main(){
  float sz = iA.z, seed = iA.w, stride = OSTR * sz;
  float s = uOstS + iA.x + 1.5 * sin(uOstS * 0.03 + seed * 6.283);
  float q = s / stride + seed * 3.;
  // the troop's line: down our road at first, then out to the left across the ridge's end to a lane of its own
  float lt = clamp((s - uOstL.x) / (uOstL.y - uOstL.x), 0., 1.), dl = uOstL.z * 6. * lt * (1. - lt) / (uOstL.y - uOstL.x);
  vec3 T = normalize(vec3(-1., 0., dl)), Nn = vec3(T.z, 0., -T.x), U = vec3(0., 1., 0.);
  vec3 O = uOstO + vec3(-s, 0., uOstL.z * lt * lt * (3. - 2. * lt)) + Nn * iA.y;
  float bob = 0.06 * sz * sin(12.566 * q + 1.), pitch = 0.035 * sin(12.566 * q + 0.4);
  float rMin = 0.8 * length(cameraPosition - (modelMatrix * vec4(O, 1.)).xyz) / max(uPx, 1.);
  float kind = aPart.x; vec3 lp = position * sz, ln = normal;
  if (kind > 0.5 && kind < 2.5) {
    float left = step(kind, 1.5), lx = mix(-0.14, 0.14, left), off = mix(0.5, 0., left);
    float ql = q - off, ph = fract(ql), n = floor(ql);
    float x = clamp((ph - ODUTY) / (1. - ODUTY), 0., 1.);
    float e = 0.5 * (x + x * x * (3. - 2. * x));
    float sF = (n + off - seed * 3.) * stride + 0.5 * ODUTY * stride + stride * e;   // the footfall: fixed for the whole stance
    float sx = sin(3.14159 * x);
    vec2 Ff = vec2(sF - s - 0.05 * sz, sz * 0.5 * sx * (0.55 + 0.45 * sx));
    vec2 Hh = vec2(-0.05 * sz, OHIP * sz + bob);
    vec2 dv = Ff - Hh; float dl0 = max(length(dv), 1e-3); vec2 dir = dv / dl0;
    float Lt = (OL1 + OL2) * sz, dl = min(dl0, Lt * 0.995);
    float l1 = Lt * OL1 / (OL1 + OL2), l2 = Lt - l1;
    float a1 = (l1 * l1 - l2 * l2 + dl * dl) / (2. * dl);
    float hk = sqrt(max(l1 * l1 - a1 * a1, 0.));
    vec2 K = Hh + dir * a1 - vec2(-dir.y, dir.x) * hk;
    vec2 Fe = Hh + dir * dl;
    float t = aPart.y;
    vec2 d1 = K - Hh; d1 /= max(length(d1), 1e-4); vec2 d2 = Fe - K; d2 /= max(length(d2), 1e-4);
    vec2 c = t < 0.5 ? mix(Hh, K, t * 2.) : mix(K, Fe, (t - 0.5) * 2.);
    vec2 bd = mix(d1, d2, smoothstep(0.4, 0.6, t)); bd /= max(length(bd), 1e-4);
    vec2 bp = vec2(-bd.y, bd.x);
    vec2 o = aPart.zw * sz; o *= clamp(rMin / max(length(o), 1e-4), 1., 3.);
    lp = vec3(lx * sz + o.x, c.y + bp.y * o.y, c.x + bp.x * o.y);
    ln = vec3(aPart.z, bp.y * aPart.w, bp.x * aPart.w) + vec3(1e-5, 0., 0.);
  } else {
    float w = aPart.y;
    if (kind > 5.5) {          // plumes shake
      lp.y += w * 0.07 * sz * sin(uTime * 17. + seed * 40. + lp.z * 9.);
      lp.x += w * 0.05 * sz * sin(uTime * 13. + seed * 20. + lp.y * 7.);
    } else if (kind > 4.5) {   // the neck pumps with every stride
      lp.z += w * 0.13 * sz * sin(12.566 * q + 0.6);
      lp.y -= w * 0.035 * sz * cos(12.566 * q + 0.6);
    }
    float y0 = lp.y - OHIP * sz, cp = cos(pitch), sp = sin(pitch);
    lp = vec3(lp.x, y0 * cp + lp.z * sp + OHIP * sz + bob, lp.z * cp - y0 * sp);
  }
  vec3 P = O + Nn * lp.x + U * lp.y + T * lp.z;
#ifdef SHADOW
  P = vec3(P.x + uShadow.x * max(P.y, 0.), 0.045, P.z + uShadow.y * max(P.y, 0.));      // its shadow, drawn in sand: the bird laid flat away from the sun-print
#endif
  vec4 wp = modelMatrix * vec4(P, 1.); vW = wp.xyz; vN = Nn * ln.x + U * ln.y + T * ln.z;
  vRest = position; vPaint = aPaint; vSeed = seed;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,fa=`
varying vec3 vRest; varying vec3 vN; varying vec3 vW; varying vec3 vPaint; varying float vSeed;
${pe}
#include <fog_pars_fragment>
void main(){
  float fw = fwidth(vRest.x) + fwidth(vRest.y) + fwidth(vRest.z);
#ifdef SHADOW
  {
    float fs = fwidth(vW.x) + fwidth(vW.z), sn = vn2(vW.xz * 2.3), sg = vn2(vW.xz * 19.);
    if (sg < 0.22 * (1. - clamp(fs * 12., 0., 1.))) discard;
    gl_FragColor = vec4(max(sandRamp((0.19 + 0.24 * sn) * (0.8 + 0.4 * sg) + 0.02, uGlass), 0.), 1.);
    #include <fog_fragment>
    return;
  }
#endif
  float gA = mix(vn3(vRest * 46. + vSeed * 17.), 0.5, clamp(fw * 30. - 0.3, 0., 1.));
  float gB = vn3(vRest * 8. + vSeed * 5.);
  vec3 N = normalize(vN + vec3(1e-5)) * (gl_FrontFacing ? 1. : -1.), V = normalize(cameraPosition - vW);
  float rim = 1. - abs(dot(N, V)); rim = rim * rim * (0.35 + 0.65 * rim);
  float k = clamp(rim * 1.05 + vPaint.y * 0.2 * (0.4 + rim), 0., 1.);
  vec3 col = sandRamp(10. * exp(-7. * k) * (0.65 + 0.7 * gA), uGlass * 0.9);
  float wiped = smoothstep(0.4, 0.62, vPaint.x + (gB - 0.5) * 0.4 + (gA - 0.5) * 0.2);
  col = mix(col, mix(uGlass * (0.72 + 0.14 * gA), mix(uGold, uOrange, 0.25 + 0.5 * rim) * (0.6 + 0.3 * gA), vPaint.z), wiped);
  col += uSienna * 0.12 * max(dot(N, uSun), 0.) * (1. - wiped);
  gl_FragColor = vec4(max(col, 0.), 1.);
  #include <fog_fragment>
}`,uo=`
attribute float aWg; attribute vec4 iA;
uniform vec3 uFlock, uFlockDir; uniform float uPx;
varying float vE;
${pe}
#include <fog_pars_vertex>
void main(){
  float seed = iA.w;
  vec3 F = normalize(uFlockDir + vec3(1e-5, 0., 0.)), R = normalize(vec3(F.z, 0., -F.x) + vec3(0., 0., 1e-5));
  vec3 off = iA.xyz + vec3(sin(uTime * 1.3 + seed * 40.), 0.6 * sin(uTime * 1.7 + seed * 23.), sin(uTime * 1.1 + seed * 31.)) * 0.9;
  vec3 C = uFlock + R * off.x + vec3(0., off.y, 0.) + F * off.z;
  float sc = max(1.45, 2.4 * length(cameraPosition - C) / max(uPx, 1.) / 0.3);
  float flap = sin(uTime * (17. + 6. * seed) + seed * 60.);
  vec3 p = position; p.y += aWg * abs(p.x) * 0.9 * flap; p.x *= 1. - 0.3 * aWg * flap * flap;
  vec3 P = C + (R * p.x + vec3(0., p.y, 0.) + F * p.z) * sc;
  vE = aWg;
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,po=`
uniform vec3 uTip;
varying float vE;
${pe}
#include <fog_pars_fragment>
void main(){
  vec3 col = sandRamp(mix(uTip.x, uTip.y, mix(vE * vE, sqrt(max(vE, 0.)), uTip.z)), uGlass * 0.9);      // (by night the wingtips thin to a burning film, so the flock reads on the deep sky)
  gl_FragColor = vec4(max(col, 0.), 1.);
  #include <fog_fragment>
}`,mo=`
attribute vec4 iP; attribute vec4 iQ;
uniform vec3 uHeadP, uHeadT, uCamP, uWind; uniform vec4 uLeg, uThread; uniform vec3 uFur;
uniform float uHeadV, uBow, uBowS, uPlume, uSmoke, uRareT, uRareK, uCap, uCurt;
varying vec2 vUv; varying vec4 vK; varying float vS;
${pe}
#include <fog_pars_vertex>
void main(){
  float kind = iQ.x, seed = iP.w; vec3 C = vec3(0.); float S = 1., A = 0., stretch = 1., nearA = 3., nearB = 18.; vec3 vel = vec3(0.);
  float r1 = h11(seed * 7.13 + 1.), r2 = h11(seed * 3.71 + 2.), r3 = h11(seed * 11.3 + 3.);
  if (kind < 0.5) {            // the bow wave: two curls of grains peeling off the stroke head, streaking back past us into the ridges
    float arm = step(1.5, uBowS);
    float life = mix(1.0 + 0.45 * r1, 0.9 + 0.6 * r1, arm), age = fract(uTime / life + seed) * life, f = age / life;
    vec3 perp = vec3(uHeadT.z, 0., -uHeadT.x) * iP.x;
    float lat0 = mix(1.1 + 0.9 * r2, 2.2 + 1.2 * r2, arm), lat1 = mix(2.5 + 1.7 * r3, 3.2 + 2. * r3, arm), kx = mix(2.6, 2.2, arm);
    float vy = mix(3.2 + 2.8 * r1, 5.5 + 3. * r1, arm), gy = mix(4.4, 5.2, arm), back = mix(0.5, 0.55, arm), sc = mix(1., 0.6 * uBowS, arm);
    C = uHeadP - uHeadT * (uHeadV * age * back) + perp * (lat0 + lat1 * (1. - exp(-kx * age))) * sc;
    C.y += (max(vy * age - gy * age * age, 0.) + 0.15) * sc;
    vel = -uHeadT * (uHeadV * back) + perp * (lat1 * kx * exp(-kx * age)) + vec3(0., vy - 2. * gy * age, 0.);
    A = smoothstep(0., 0.08, f) * (1. - f * f) * mix(0.62, 0.8, arm) * uBow;
    S = iQ.w * mix(0.065 + 0.1 * f, (0.07 + 0.11 * f) * sc, arm); stretch = mix(4., 4.5, arm); nearA = 0.6; nearB = mix(2.0, 4.5, arm);
  } else if (kind < 1.5) {     // crest smoke: every ridge streams grains to leeward
    float life = iQ.z, age = fract(uTime * iQ.y + seed) * life, f = age / life;
    C = iP.xyz + uWind * age * (9. + 8. * r1) + vec3(0., (6. + 4. * r2) * age - 0.5 * age * age + 0.8 * sin(age * 1.7 + seed * 6.), 0.);
    A = smoothstep(0., 0.1, f) * (1. - f) * 0.95 * uSmoke;
    S = iQ.w * (0.5 + 2.2 * f); stretch = 0.5; nearB = 40.;
  } else if (kind < 2.5) {     // the plume thrown off the lee side of the notch: up, to leeward and away to the left of the ring
    float life = 2.4 + 1.6 * r1, age = fract(uTime / life + seed) * life, f = age / life;
    vec3 lft = vec3(uLeg.w, 0., -uLeg.z), fwd = vec3(uLeg.z, 0., uLeg.w), hv = fwd * (5. + 6. * r2) + lft * (4. + 6. * r3);
    C = iP.xyz + hv * age + vec3(0., (9. + 9. * r1) * age - 1.6 * age * age, 0.);
    vel = hv + vec3(0., (9. + 9. * r1) - 3.2 * age, 0.);
    A = smoothstep(0., 0.08, f) * (1. - f * f) * 0.95 * uPlume;
    S = iQ.w * (0.5 + 1.3 * f); stretch = 1.3; nearB = 30.;
  } else if (kind < 3.5) {     // sand pouring down the furrow walls behind the head
    float life = 1.1 + 0.9 * r1, age = fract(uTime / life + seed) * life, f = age / life;
    float a = dot(iP.xz - uLeg.xy, uLeg.zw);
    C = iP.xyz - vec3(uLeg.w, 0., -uLeg.z) * iQ.y * f; C.y -= iQ.z * pow(f, 1.35) - 0.18;
    vel = -vec3(uLeg.w, 0., -uLeg.z) * iQ.y + vec3(0., -1.35 * iQ.z * pow(f, 0.35), 0.);
    A = smoothstep(0., 0.15, f) * (1. - f * f) * 0.9 * (1. - smoothstep(uFur.x - 9., uFur.x - 2., a));
    S = iQ.w * (0.07 + 0.08 * f); stretch = 4.5; nearA = 0.5; nearB = 1.6;
  } else if (kind < 4.5) {     // loose grains on the wind, wrapped round the camera
    vec3 B = vec3(64., 13., 64.);
    vec3 p = iP.xyz * B + uWind * uTime * (5. + 6. * r1);
    C = uCamP + mod(p - uCamP + 0.5 * B, B) - 0.5 * B;
    vel = uWind * (5. + 6. * r1) - uHeadT * uHeadV;
    A = 0.5; S = iQ.w; stretch = 2.4; nearA = 0.8; nearB = 3.;
  } else if (kind < 5.5) {     // sifting curtains: thin veils of falling grains that add sand back
    float fall = fract(uTime * (0.22 + 0.2 * r1) + seed);
    C = iP.xyz + vec3(0.7 * sin(uTime * 0.6 + seed * 9.), (1. - fall) * iQ.y, 0.5 * sin(uTime * 0.5 + seed * 5.));
    A = smoothstep(0., 0.15, fall) * (1. - smoothstep(0.8, 1., fall)) * 0.3 * uCurt * (0.5 + 0.5 * sin(uTime * 0.13 + iQ.z));
    S = iQ.w; stretch = 2.6; nearB = 30.;
  } else if (kind < 6.5) {     // rare: every tree blown off the glass into one long streamer downwind (the top goes first)
    float age = max(uRareT - 0.5 * iQ.y, 0.), sp = iQ.z;                // sp: 0 at the tree .. 1 at the streamer's far end
    float run = (2. + 17. * sp) * (1. - exp(-1.1 * age)) * 1.6;
    vec3 sway = vec3(uWind.z, 0., -uWind.x);
    C = iP.xyz + uWind * run + sway * (0.5 * sin(run * 0.33 + seed * 9.) + (r3 - 0.5) * 0.9 * sp);
    float top6 = iP.y / max(1. - iQ.y, 0.15);                         // (the streamer gathers toward one line as it trails)
    C.y = max(mix(C.y, 0.62 * top6, 0.55 * sp * (1. - exp(-1.5 * age))) + (0.9 * sp - 0.6 * sp * sp) * min(age, 2.) + 0.3 * sin(run * 0.5 + seed * 6.) - 0.25 * max(age - 1.5, 0.) * sp, 0.25);
    vel = uWind;
    A = step(0.001, uRareT - 0.5 * iQ.y) * smoothstep(0., 0.25, age) * (1. - smoothstep(1.9, 3.3, age + 0.6 * sp)) * 0.92;
    S = iQ.w * (0.42 + 0.4 * sp); stretch = 4.5; nearB = 6.;
  } else if (kind < 7.5) {     // the falling thread that drizzles a tree again
    float fall = fract(uTime * 1.5 + seed);
    C = uThread.xyz + vec3((r1 - 0.5) * 0.4, (1. - fall) * 7.5, (r2 - 0.5) * 0.4);
    A = uThread.w * 0.8; S = 0.14 + 0.1 * r3; stretch = 3.; nearB = 6.;
  } else if (kind < 8.5) {     // skeins of loose sand streaming up the Great Dune's arm beside our furrow
    float life = iQ.z, age = fract(uTime / life + seed) * life, f = age / life, v = 9. + 7. * r1;
    C = iP.xyz + uWind * (age * v) + vec3(0., iQ.y * v * age + 0.25 + 0.6 * age * f, 0.);
    vel = uWind * v + vec3(0., iQ.y * v, 0.);
    A = smoothstep(0., 0.15, f) * (1. - f) * 0.7 * uSmoke * (1. - 0.65 * smoothstep(60., 190., length(C - uCamP)));
    S = iQ.w * (0.3 + 0.4 * f); stretch = 3.2; nearB = 10.;
  } else if (kind > 9.5) {     // sand streaming off the Great Dune's knife crest: long bright skeins torn off to leeward, rising, then sinking behind it
    float life = iQ.z, age = fract(uTime / life + seed) * life, f = age / life, v = 8. + 6. * r1, vy = 8. + 7. * r3;
    vec3 lee = normalize(uWind + vec3(0., 0., 0.5 * (r2 - 0.4)));
    C = iP.xyz + lee * (age * v + 0.8 * age * age) + vec3(0., vy * age - 1.1 * age * age, 0.);
    vel = lee * (v + 1.6 * age) + vec3(0., vy - 2.2 * age, 0.);
    A = smoothstep(0., 0.1, f) * (1. - f) * (1. - f) * 1.8 * uSmoke;
    S = iQ.w * (0.3 + 0.8 * f); stretch = 6.; nearB = 60.;
  } else {                     // rare: the falling thread that drizzles each tree again (iP: the tree's foot and its height)
    float pr = uRareK - iQ.y, fall = fract(uTime * (1.1 + 0.5 * r1) + seed);
    float fray = iQ.z * clamp(pr * 1.7 - 0.6, 0., 1.);                  // the thread spreads as the limbs do
    C = vec3(iP.x + (r1 - 0.5) * (0.3 + 2. * fray), iP.y * clamp(pr, 0.03, 1.) + (1. - fall) * 15., iP.z + (r2 - 0.5) * (0.3 + 2. * fray));
    vel = vec3(0., -1., 0.);
    A = step(0.001, pr) * (1. - smoothstep(1.02, 1.2, pr)) * step(0., uRareK) * (0.45 + 0.55 * fall) * 0.95;
    S = iQ.w; stretch = 3.4; nearB = 6.;
  }
  vec4 mvPosition = modelViewMatrix * vec4(C, 1.);
  float dz = max(-mvPosition.z, 0.01);
  A *= smoothstep(nearA, nearB, dz);
  S = min(S, uCap * dz);
  // sprites that fly fast are drawn out along their motion past the camera
  vec2 sd = vec2(0., 1.);
  vec3 vv = mat3(viewMatrix) * vel; float vl = length(vv.xy);
  if (vl > 0.05) sd = vv.xy / vl;
  mvPosition.xy += (sd * (position.y * stretch) + vec2(sd.y, -sd.x) * position.x) * S;
  vUv = position.xy; vK = vec4(A, kind, seed, r3); vS = S;
  gl_Position = projectionMatrix * mvPosition;
  if (A <= 0.004) gl_Position = vec4(2., 2., 2., 1.);
  #include <fog_vertex>
}`,vo=`
varying vec2 vUv; varying vec4 vK; varying float vS;
${pe}
#include <fog_pars_fragment>
// thrown sand is grains: clumps a hand across, the same size in metres whatever the sprite's size, single grains at their
// edges; where a pixel covers many of them they go over to their mean
float thrown(vec2 uv, float size, float seed){
  vec2 g = uv * max(size, 0.02) * vec2(5.5, 4.5) + seed * vec2(7.3, 3.1);
  float fg = fwidth(g.x) + fwidth(g.y);
  float clump = smoothstep(0.42, 0.7, vn2(g) * 0.65 + vn2(g * 2.7 + 5.) * 0.35);
  float grit = step(0.55, h21(floor(g * 5.))) * (1. - clamp(fg * 5. - 0.3, 0., 1.));
  return mix(clump * (0.55 + 0.45 * grit), 0.3, clamp(fg * 0.9 - 0.25, 0., 1.));
}
void main(){
  float r2 = dot(vUv, vUv); if (r2 > 1.) discard;
  float soft = (1. - r2); soft *= soft;
  float n = fbm2(vUv * 1.6 + vK.z * 37.), n2 = vn2(vUv * vec2(15., 9.) + vK.z * 11.);
  float a = soft * (0.35 + 0.65 * n) * (0.55 + 0.6 * n2) * vK.x;
  if (vK.y > 3.5 && vK.y < 4.5) a = soft * vK.x;
  if (vK.y < 0.5 || (vK.y > 2.5 && vK.y < 3.5)) a = soft * smoothstep(0.3, 0.7, vn2(vUv * vec2(7., 2.2) + vK.z * 11.)) * (0.6 + 0.6 * n) * 1.3 * vK.x;
  vec3 col = mix(uGold * 0.85, uOrange * 0.8, clamp(smoothstep(0.02, 0.22, a) * 0.7 + vK.w * 0.45, 0., 1.));
  col = mix(col, uSienna * 0.9, smoothstep(0.18, 0.55, a) * (0.4 + 0.5 * vK.w));
  float thr = thrown(vUv, vS, vK.z);
  if (vK.y > 7.5 && vK.y < 8.5) { a = soft * smoothstep(0.3, 0.7, n) * thr * 2.2 * vK.x; col = mix(uGold * 0.95, uOrange * 0.9, 0.2 + 0.4 * vK.w); }      // skeins: wisps of amber grains
  if (vK.y > 0.5 && vK.y < 1.5) { col = mix(col, uSienna * 0.9, 0.4); a *= 1.3; }
  if (vK.y > 1.5 && vK.y < 2.5) { a = soft * smoothstep(0.2, 0.75, n) * thr * 2.4 * vK.x; col = mix(uGold, uOrange * 0.92, clamp(0.1 + 0.9 * a + 0.3 * vK.w, 0., 1.)); }      // the plume: thrown grains, gold where it thins
  if (vK.y > 5.5 && vK.y < 6.5) { a = soft * smoothstep(0.2, 0.65, n) * (0.6 + 0.6 * n2) * 1.6 * vK.x; col = mix(uSienna * 0.9, uUmber, 0.15 + 0.6 * vK.w); }
  if (vK.y > 8.5 && vK.y < 9.5) { a = soft * (0.6 + 0.6 * n2) * vK.x; col = mix(uSienna * 0.9, uUmber, 0.5); }
  if (vK.y > 9.5) { a = soft * smoothstep(0.3, 0.7, vn2(vec2(vUv.x * 3. + vK.z * 11., vUv.y * 0.7 + vK.z * 3.))) * (0.5 + 0.6 * n) * 1.3 * vK.x; col = mix(uGold * 1.05, uOrange * 0.95, clamp(0.15 + 0.5 * vK.w + 0.5 * (1. - a), 0., 1.)); }      // crest streamers: gold at the heart
  gl_FragColor = vec4(max(col, 0.), clamp(a, 0., 0.92));
  #include <fog_fragment>
}`,ca=()=>{const l=new n.BufferGeometry;return l.setAttribute("position",new n.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),l.setIndex([0,1,2,0,2,3]),l};function ct(l,d,q,P=4){const _=new n.InstancedBufferGeometry;_.index=l.index;for(const G in l.attributes)_.setAttribute(G,l.attributes[G]);for(const G in d)_.setAttribute(G,new n.InstancedBufferAttribute(d[G],P));return _.instanceCount=q,_.boundingSphere=new n.Sphere(new n.Vector3,1e5),_}function ha(){const l=[],d=[],q=[],P=[],_=[],G=[],j=[],N=[];return{async grid(W,X,m,T,R=!1,V=null){const E=l.length/3;for(let B=0;B<=X;B++){V&&B>0&&B*(W+1)%1200<W+1&&await V();for(let D=0;D<=W;D++){const S=T(D,B);l.push(S[0],S[1],S[2]),d.push(S[3],S[4],S[5]),q.push(S[6],S[7]),P.push(m),G.push(S[8]||0,S[9]||0),j.push(S[10]||0,S[11]??1,S[12]||0),N.push(S[13]||0,S[14]||0,S[15]||0,S[16]||0)}}for(let B=0;B<X;B++)for(let D=0;D<W;D++){const S=E+B*(W+1)+D,ee=S+1,Q=S+W+1,me=Q+1;R?_.push(S,ee,Q,ee,me,Q):_.push(S,Q,ee,ee,Q,me)}},build(){const W=new n.BufferGeometry;return W.setAttribute("position",new n.Float32BufferAttribute(l,3)),W.setAttribute("normal",new n.Float32BufferAttribute(d,3)),W.setAttribute("aD",new n.Float32BufferAttribute(q,2)),W.setAttribute("aG",new n.Float32BufferAttribute(P,1)),W.setAttribute("aC",new n.Float32BufferAttribute(G,2)),W.setAttribute("aN2",new n.Float32BufferAttribute(j,3)),W.setAttribute("aW",new n.Float32BufferAttribute(N,4)),W.setIndex(_),W.boundingSphere=new n.Sphere(new n.Vector3,1e5),W},get triangles(){return _.length/3}}}const So=(l,d,q,P=.6)=>{const _=(l(d+P,q)-l(d-P,q))/(2*P),G=(l(d,q+P)-l(d,q-P))/(2*P),j=Math.hypot(_,1,G);return[-_/j,1/j,-G/j]};function go(l,d,q,P,_,G,j){const{P:N,N:W,R:X,T:m,I:T,S:R,sh:V}=l;let E=-1;const B=new n.Vector3,D=new n.Vector3,S=new n.Vector3,ee=new n.Vector3;for(let Q=0;Q<d.length;Q++){ee.subVectors(d[Math.min(Q+1,d.length-1)],d[Math.max(Q-1,0)]).normalize(),B.set(.31,.2,.93),D.crossVectors(B,ee),D.lengthSq()<1e-4&&D.set(1,0,0),D.normalize(),S.crossVectors(ee,D);const me=N.length/3,ve=q[Q];let te=ee.x+V[0]*ee.y,Ce=ee.z+V[1]*ee.y;const Ae=Math.hypot(te,Ce);Ae<.001?(te=1,Ce=0):(te/=Ae,Ce/=Ae);const he=-Ce,L=te;for(let k=0;k<P;k++){const ie=k/P*Math.PI*2,ue=Math.cos(ie),Se=Math.sin(ie),Ne=D.x*ue+S.x*Se,re=D.y*ue+S.y*Se,Y=D.z*ue+S.z*Se;N.push(d[Q].x+Ne*ve,d[Q].y+re*ve,d[Q].z+Y*ve),W.push(Ne,re,Y),X.push(Ne*ve,re*ve,Y*ve),m.push(_[Q],G,j);const J=Math.max(-1,Math.min(1,(Ne+V[0]*re)*he+(Y+V[1]*re)*L));R.push(he*J,L*J)}if(E>=0)for(let k=0;k<P;k++){const ie=(k+1)%P;T.push(E+k,E+ie,me+k,E+ie,me+ie,me+k)}E=me}}function wo(l,d,q,P,_,G,j){const N=G?6:4,W=d(),X=[],m={n:0},T=[],R=(L,k,ie,ue,Se,Ne,re,Y)=>{const J=[L.clone()],ye=[Se],qe=k.clone().normalize(),He=L.clone(),St=ie/ue;for(let ze=1;ze<=ue;ze++)qe.x+=d.range(-.38,.38),qe.z+=d.range(-.38,.38),qe.y+=d.range(-.22,.3)+(re?.02:.12),qe.normalize(),He.addScaledVector(qe,St),J.push(He.clone()),ye.push(U(Se,Ne,Math.pow(ze/ue,.8)));if(T.push({pts:J,radii:ye,t0:Y,len:ie}),re<2){const ze=re===0?d.int(3,4)+(G?1:0):d.int(1,2);for(let Pt=0;Pt<ze;Pt++){const at=re===0?d.int(Math.max(1,ue-2),ue):d.int(1,ue-1),Ge=d.range(0,Math.PI*2),Gt=new n.Vector3(Math.cos(Ge),d.range(.25,.9),Math.sin(Ge)).lerp(qe,.25),Vt=ie*(re===0?d.range(.75,1.25):d.range(.4,.7));R(J[at],Gt,Vt,G?re===0?5:3:re===0?3:2,ye[at]*.72,re===0?.045:.022,re+1,Y+at/ue*ie)}}else X.push(He.clone())},V=new n.Vector3(q,0,P);R(V,new n.Vector3(d.range(-.25,.25),1,d.range(-.25,.25)),_*.42,G?4:3,_*.062+.05,_*.04+.03,0,0);let E=.001;for(const L of T)E=Math.max(E,L.t0+L.len);let B=0;for(const L of T){const k=L.pts.map((ie,ue)=>(L.t0+ue/(L.pts.length-1)*L.len)/E);go(l,L.pts,L.radii,N,k,W,j);for(const ie of L.pts)B=Math.max(B,ie.y)}const{P:D,N:S,R:ee,T:Q,I:me,S:ve}=l,te=D.length/3,Ce=_*.16+.35,Ae=G?10:6;D.push(q,_*.035+.12,P),S.push(0,1,0),ee.push(0,0,0),Q.push(-1,W,j),ve.push(0,0);for(let L=0;L<Ae;L++){const k=L/Ae*Math.PI*2,ie=Ce*d.range(.75,1.2);D.push(q+Math.cos(k)*ie,.012,P+Math.sin(k)*ie),S.push(Math.cos(k)*.5,.85,Math.sin(k)*.5),ee.push(0,0,0),Q.push(-1,W,j),ve.push(0,0)}for(let L=0;L<Ae;L++)me.push(te,te+1+(L+1)%Ae,te+1+L);const he=[];for(const L of T)for(const k of L.pts)k.y>.25*_&&he.push(k);return{tips:X,top:B,skel:he,seed:W}}function xo(){const l=[],d=[],q=[],P=[],_=(m,T,R)=>(l.push(m[0],m[1],m[2]),d.push(T[0],T[1],T[2],T[3]),q.push(R[0],R[1],R[2]),l.length/3-1),G=(m,T,R)=>{for(let V=0;V<R;V++){const E=(V+1)%R;P.push(m+V,m+E,T+V,m+E,T+E,T+V)}},j=(m,T,R,V,E,B,D,S=0)=>{const ee=l.length/3;for(let Q=0;Q<E;Q++){const me=Q/E*Math.PI*2,ve=Math.cos(me),te=Math.sin(me);_([R*ve,T+V*te*Math.cos(S),m-V*te*Math.sin(S)],B,D(ve,te))}return ee};let N=-1;[[-.62,1.3,.04,.05],[-.5,1.3,.2,.24],[-.25,1.28,.3,.36],[.05,1.25,.32,.4],[.3,1.27,.26,.33],[.47,1.33,.15,.2],[.56,1.38,.08,.1]].forEach(m=>{const T=j(m[0],m[1],m[2],m[3],10,[0,0,0,0],()=>[0,.03,0]);N>=0&&G(N,T,10),N=T}),N=-1,[[.5,1.4,.1,.05],[.6,1.6,.068,.3],[.645,1.85,.052,.6],[.68,2.05,.047,.85],[.71,2.17,.05,1]].forEach(m=>{const T=j(m[0],m[1],m[2],m[2],6,[5,m[3],0,0],()=>[.25,.5,1],1.25);N>=0&&G(N,T,6),N=T}),[[.7,2.2,.03],[.76,2.21,.062],[.85,2.2,.058],[.93,2.18,.034],[1.03,2.16,.01]].forEach(m=>{const T=j(m[0],m[1],m[2],m[2]*.8,6,[5,1,0,0],()=>[0,.25,0]);G(N,T,6),N=T});const W=(m,T,R,V)=>{for(let E=0;E<V;E++){const B=E/(V-1)-.5,D=[T[0]+R[0]*B,T[1]+R[1]*B,T[2]+R[2]*B],S=_(m,[6,0,0,0],[.3,.2,0]),ee=_([D[0]-R[0]*.3/V,D[1]+.05,D[2]-R[2]*.3/V],[6,1,0,0],[1,.4,0]),Q=_([D[0]+R[0]*.3/V,D[1]-.05,D[2]+R[2]*.3/V],[6,1,0,0],[1,.4,0]);P.push(S,ee,Q)}};for(const m of[-1,1])W([.27*m,1.45,.12],[.4*m,1.05,-.38],[.1*m,.1,.55],6);W([0,1.36,-.5],[0,1.18,-.98],[.5,0,.05],5),W([0,1.36,-.5],[0,1.3,-.95],[0,.42,.1],4);for(let m=0;m<2;m++){const T=m===0?.14:-.14;N=-1,[[0,.11,.16,0],[.25,.09,.12,0],[.47,.05,.06,0],[.55,.034,.04,0],[.9,.03,.034,0],[.95,.04,.07,.04],[1,.045,.12,.09]].forEach(R=>{const V=l.length/3;for(let E=0;E<6;E++){const B=E/6*Math.PI*2,D=R[1]*Math.cos(B),S=R[2]*Math.sin(B)+R[3];_([T+D,1.12*(1-R[0]),-.05+S],[m+1,R[0],D,S],[R[0]>.5?.7:0,.3,1])}N>=0&&G(N,V,6),N=V})}const X=new n.BufferGeometry;return X.setAttribute("position",new n.Float32BufferAttribute(l,3)),X.setAttribute("aPart",new n.Float32BufferAttribute(d,4)),X.setAttribute("aPaint",new n.Float32BufferAttribute(q,3)),X.setIndex(P),X.computeVertexNormals(),X}function da(l){const d=[],q=[];for(let _=0;_<l;_++){const G=_*(6.2832/l)+.4+.5*Math.sin(_*2.3),j=Math.cos(G),N=Math.sin(G),W=d.length/4;d.push(j,N,0,-1,j,N,0,1,j,N,.55,-1,j,N,.55,1,j,N,1,0),q.push(W,W+1,W+2,W+1,W+3,W+2,W+2,W+3,W+4)}const P=new n.BufferGeometry;return P.setAttribute("position",new n.Float32BufferAttribute(new Float32Array(d.length/4*3),3)),P.setAttribute("aB",new n.Float32BufferAttribute(d,4)),P.setIndex(q),P}function yo(){const l=new n.BufferGeometry;return l.setAttribute("position",new n.Float32BufferAttribute([0,0,.17,-.05,0,0,.05,0,0,0,.02,-.19,-.04,0,.07,-.04,0,-.05,-.36,0,-.03,.04,0,.07,.04,0,-.05,.36,0,-.03],3)),l.setAttribute("aWg",new n.Float32BufferAttribute([0,0,0,0,0,0,1,0,0,1],1)),l.setIndex([0,1,2,1,3,2,4,6,5,7,8,9]),l}const bo={wind:{hour:"morning",weather:"wind",skyH:"#FFE7B8",skyA:"#F6B85A",skyM:"#E8933C",skyZ:"#9E4420",stops:[.03,.42,.36,.95],band:[.1,.3,0],lip:"#4A2212",wipe:"#FFF1CF",sunC:[1.7,1.5,1.1],sunEl:19,fog:"#F2C582",fogNear:420,fogFar:8200,veil:"#F1AE4E",exposure:1,night:0,portal:"#ffe2a8",tint:"#fff6ea",shadow:"#0c0502"},golden:{hour:"golden",weather:"wind",skyH:"#F7B24E",skyA:"#F6B85A",skyM:"#A64C1B",skyZ:"#3a1a0e",stops:[.03,.42,.36,.95],band:[.1,.3,0],lip:"#1c0c06",wipe:"#FFCF7A",sunC:[1.8,1.2,.5],sunEl:9,fog:"#D98A34",fogNear:300,fogFar:5200,veil:"#E9983A",exposure:1,night:0,portal:"#ffd27a",tint:"#fff0dc",shadow:"#0e0502"},night:{hour:"night",weather:"wind",skyH:"#CDBE9C",skyA:"#D98B36",skyM:"#3A1A2A",skyZ:"#0D0A16",stops:[.05,.27,.2,.62],band:[.11,.3,.85],lip:"#06040A",wipe:"#C98A3E",sunC:[1.45,1.4,1.25],sunEl:17,fog:"#A8845A",fogNear:300,fogFar:5200,veil:"#B58A4E",exposure:1,night:1,portal:"#cfe0ea",tint:"#faf6f0",shadow:"#0a0612"},fog:{hour:"morning",weather:"fog",skyH:"#F3E6CC",skyA:"#F6B85A",skyM:"#DFA05C",skyZ:"#93502c",stops:[.03,.42,.36,.95],band:[.1,.3,0],lip:"#4A2212",wipe:"#FFF1CF",sunC:[1.5,1.4,1.15],sunEl:19,fog:"#EFCB92",fogNear:380,fogFar:6200,veil:"#F1AE4E",exposure:1,night:0,portal:"#ffe2a8",tint:"#f8f6f0",shadow:"#0a0808"}};var Po={id:"wind-draws-the-namib",name:"The Desert the Wind Draws",category:"wilderness",weirdness:.55,media:["air","open"],async build(l){const d=l.rng,q=l.vary||{},P=l.quality?.detail??1,_=q.density??1,G=d(),j=d(),N=d(),W=d();let X=G<.22?"night":G<.55?"golden":G<.82?"wind":"fog";q.hour==="golden"?X="golden":q.hour==="night"?X="night":(q.hour==="day"||q.hour==="dawn")&&(X==="night"||X==="golden")&&(X=j<.6?"wind":"fog");const m=bo[X],T=X!=="fog"&&j>.8,R=N>.78,V=W>.62?"calves":"gemsbok",E=!!q.rare,B=e=>new n.Color(e),D=64,S=d.range(300,365),ee=d.range(282,318),Q=d.range(12,22),me=d.range(22,40),ve=d.range(0,6.28),te=e=>{if(e>=0){if(e<=S){const t=Math.sin(.5*Math.PI*e/S);return D+(ee-D)*t*t}return ee*Math.pow(1-p(S,S+720,e),1.15)}if(e>-75){const t=Math.sin(.5*Math.PI*-e/75);return D+Q*t*t}return(D+Q)*Math.pow(1-p(75,340,-e),1.2)},Ce=e=>231*Math.pow(Math.max(e,.01)/D,.75),Ae=e=>Ce(te(e))*(1+.06*Math.sin(e*.05+ve)*p(30,100,Math.abs(e))),he=e=>et+Ce(te(e))+me*Math.sin(e/150)*p(0,80,Math.abs(e)),L=e=>25+1.45*te(e),k=he(0),ie=he(S),ue=.82*Ce(ee),Se=[-.95,.31],Ne=ee*.14,re=(e,t)=>{const a=e-ie,o=t-S,i=(a*Se[0]+o*Se[1])/ue,s=a*Se[1]-o*Se[0];if(i<=0||i>=1)return[0,s,0];const u=Ne*Math.pow(Math.sin(Math.PI*Math.pow(i,.8)),.8),h=Math.max(0,1-Math.abs(s)/(55+20*i));return[u*Math.pow(h,1.25),s,u]},Y=(e,t)=>{const a=te(t);if(a<.05)return 0;const o=he(t);if(e<=o){const s=(o-e)/Ae(t);return s>=1?0:a*Math.pow(1-s,1.3)+re(e,t)[0]}const i=(e-o)/L(t);return i>=1?0:a*Math.pow(1-i,1.25)},J=(e,t)=>[lt+e*Be+t*Ye,I+e*Re+t*Je],ye=(e,t)=>[(e-lt)*Be+(t-I)*Re,(e-lt)*Ye+(t-I)*Je],qe=(e,t,a)=>.5*(e+t+Math.sqrt((e-t)*(e-t)+a*a)),He=e=>2.4+2.2*p(105,160,e)-.9*p(175,230,e)+1.3*p(235,275,e)-1*p(400,480,e)+2*p(250,310,e)*(1-p(335,400,e))-.75*p(452,492,e)+.3*p(566,600,e),St=e=>3.2+6.4*p(28,110,e)+.125*Math.max(e-110,0),ze=tt-62,Pt=Y(k,0)-.7,at=e=>qe(St(e),Y(e,0)+.8,2.5),Ge=e=>e<ze?at(e):U(at(ze),Pt,(e-ze)/(tt-ze)),Gt=[[112,-1.5],[137,-10],[162,-19.5],[187,-20],[210,-12.5],[230,-4.2],[249,-.6]],Vt=(e,t)=>Math.max(Ge(e),qe(St(e),Y(e,t)+.8,2.5)),Ie=[];for(const e of[Te,240,180,150,120,90,50,10])Ie.push([e,He(Te-e),I]);const ht=85,h0=J(ht,0);for(const e of[[-25,I],[-50,207],[-75,196.5],[-100,185],[-124,174.5],[-150,169.3]])Ie.push([e[0],He(Te-e[0]),e[1]]);for(const e of[-190,-235,-280]){const t=U(169.3,h0[1],(-150-e)/(-150-h0[0])),a=ye(e,t)[0];Ie.push([e,Math.max(He(Te-e),a>10?Ge(a):0),t])}{const e=J(ht,0);Ie.push([e[0],Ge(ht),e[1]])}for(const e of Gt){const t=J(e[0],e[1]);Ie.push([t[0],Vt(e[0],e[1]),t[1]])}for(const e of[268,286,ze,ze+31,tt]){const t=J(e,0);Ie.push([t[0],Ge(e),t[1]])}const K=ja(Ie),ae=K.length,d0=ae/Ke;await l.yield();const Pe=new Float32Array(420).fill(-1);{const e=new n.Vector3;for(let t=0;t<=3e3;t++){K.pointAt(t/3e3,e);const a=ye(e.x,e.z),o=Math.round(a[0]);o>=0&&o<420&&Math.abs(a[1])<3&&(Pe[o]=e.y)}}{let e=4;for(let t=0;t<420;t++)Pe[t]<0&&(Pe[t]=t>tt?Pe[t-1]+(Pe[tt-2]-Pe[tt-12])/10:t>=100?Ge(t):e),e=Pe[t]}for(let e=100;e<=tt;e++)Pe[e]=U(Ge(e),Pe[e],p(252,270,e));const Lt=e=>{const t=Math.min(418,Math.max(0,e)),a=Math.floor(t);return U(Pe[a],Pe[a+1],t-a)},Ue=l.noise,ua=e=>3.4+5*p(k-32,k-6,e),be={sd:99,th:0,rim:99,bump:0},u0=e=>e>=et-4&&e<=k+14,pa=e=>u0(e)?Math.max(0,Y(e,0)-(Lt(e)-3.2))*(1-p(k+8,k+14,e)):0,Ve=(e,t,a)=>{const o=Y(e,t),i=Math.abs(t),s=t<0?-1:1;if(!u0(e)||i>22)return a&&(a.sd=99,a.th=0,a.rim=99,a.bump=0),o;const u=Lt(e)-3.2,h=1-p(k+8,k+14,e),f=Math.max(0,Y(e,0)-u)*h,c=p(0,1.2,f),v=ua(e),w=s<0?7:0,z=Math.floor(e/5.6+w*.37),M=e-(z+.5+.28*Math.sin(z*12.9898+w)-w*.37)*5.6,r=.8+.3*Math.sin(z*78.233+w),g=Math.exp(-(M*M)/(r*r))*c,y=.35*Ue.n2(e*.21,s*9.1),x=v+y-1.25*g+.2*Ue.n2(e*.7,s*8.8)*c,b=v+y+U(1.6,Math.max(3.6,1.4*f),c)+.45*Ue.n2(e*.11,s*3.3)+.2*g,A=U(.3*p(.4,2.5,o),(.66+.16*Ue.n2(e*.23,s*1.7)+.09*Ue.n2(e*.9,s*4.4))*(1-.14*g),c)*h,F=Math.max(0,o-u)*h;let H,O;if(i<b){const ne=Math.min(1,Math.max(0,(i-x)/(b-x))),oe=ne<=0?0:Math.pow(ne,1.15+.8*g);O=(F+A)*oe+(ne>0?c*(.2*Ue.n2(e*.45,t*.5)+.08*Ue.n2(e*1.1,t*1.2))*Math.sin(Math.PI*ne):0),O<0&&(O=0),H=o-F+O}else O=F+A*Math.exp(-Math.pow((i-b)/(1.5+.9*c),1.6)),H=o-F+O;return a&&(a.sd=i-x,a.th=O,a.rim=i-b,a.bump=g),H},Ot=(e,t)=>(Ve(e,t,be),t*(1-be.rim)),p0=(e,t)=>U(Y(e,t),Ve(e,t),p(k-75,k-45,e));await l.yield();const ma=406,ge=[],$=new n.Vector3,Z=new n.Vector3,Fe=new n.Vector3;let Ft=500;for(;Ft<ae&&(K.posAtDist(Ft,$),!(ye($.x,$.z)[0]>=ht));Ft+=.5);const dt=Ft-ht,de=dt-540,va=6.5,ga=e=>17-va*p(428+de,476+de,e)*(1-p(570+de,598+de,e))-1.2*p(500+de,540+de,e)*(1-p(572+de,596+de,e))+8.5*p(572+de,597+de,e)*(1-p(612+de,640+de,e));for(let e=ma;e<dt+60;e+=20){K.posAtDist(e,$),K.tangentAtDist(e,Z);const t=Math.hypot(Z.x,Z.z)||1,a=ga(e);ge.push([$.x-a*Z.z/t,0,$.z+a*Z.x/t])}for(const e of[[86,-15],[106,-8.5],[127,-2.5],[149,0],[175,.8],[200,1.6],[222,3],[237,10],[250,24],[262,45],[272,75],[282,115],[292,165],[302,230],[312,300]]){const t=J(e[0],e[1]);ge.push([t[0],Math.max(0,Y(e[0],e[1])-.05),t[1]])}const Nt=[0];for(let e=1;e<ge.length;e++)Nt.push(Nt[e-1]+Math.hypot(ge[e][0]-ge[e-1][0],ge[e][2]-ge[e-1][2]));const ut={s:0,dist:0,lat:0},pt=(e,t)=>{let a=1e18,o=0,i=1;for(let s=0;s<ge.length-1;s++){const u=ge[s][0],h=ge[s][2],f=ge[s+1][0]-u,c=ge[s+1][2]-h,v=f*f+c*c;let w=((e-u)*f+(t-h)*c)/v;s>0&&(w=Math.max(0,w)),s<ge.length-2&&(w=Math.min(1,w));const z=e-u-f*w,M=t-h-c*w,r=z*z+M*M;r<a&&(a=r,o=Nt[s]+w*Math.sqrt(v),i=z*c-M*f>=0?1:-1)}return ut.s=o,ut.dist=Math.sqrt(a),ut.lat=i*ut.dist,ut},Et=e=>(K.pointAt(e,Fe),pt(Fe.x,Fe.z).s),wa=.37,xa=wa*Ke,Kt=15.2,ya=d0*.99,Ht=.57,m0=.64,Qe=e=>{const t=(e-Ht)/(m0-Ht),a=t<=0?0:t<1?t*t*t-.5*t*t*t*t:.5+(t-1);return Kt*(e*Ke-xa)+(ya-Kt)*Ke*(m0-Ht)*a+24*p(.62,.76,e)},ba=4.2,v0=Math.min(3,Math.max(-60,Et(.61)+4.5-Qe(.61))),It=Math.min(v0-9,Math.max(-64,Et(.52)+4.5-Qe(.52))),za=[{a:It,lat:4.4,sz:1.06,seed:.31,gait:.15,birth:.55},{a:It-2.7,lat:3.1,sz:.66,seed:.33,gait:.6,birth:.6},{a:It+3.6,lat:1.6,sz:1,seed:.42,gait:.8,birth:.5}],ot=[[k-40,2.5],[k-27,2],[k-14,2.9]].map(e=>{const t=Ot(e[0],-1)-.3,a=J(e[0],t);return{pos:[a[0],Ve(e[0],t)-.05,a[1]],yaw:e[1]+d.range(-.3,.3),size:1.18}}),$e=216,Tt=2.7,Ct=6.7,Ma=new n.Vector3($e-1,Tt+1.5,I-Ct);ot.push({pos:[$e+1,Tt-.08,I-Ct],yaw:-Math.PI/2+.12,size:1.18},{pos:[$e-5.5,Tt-.08,I-Ct],yaw:Math.PI/2-.2,size:1});for(const e of[[k-84,2.75,1.24,.21],[k-68,2.2,1.08,.63]]){const t=Ot(e[0],-1)-.3,a=J(e[0],t);ot.push({pos:[a[0],Ve(e[0],t)-.05,a[1]],yaw:e[1],size:e[2],seed:e[3]})}const g0=40*Math.PI/180,Wt=m.sunEl*Math.PI/180,Ee=new n.Vector3(-Math.cos(g0)*Math.cos(Wt),Math.sin(Wt),Math.sin(g0)*Math.cos(Wt)),Dt=Math.min(1/Math.tan(Wt),3.2),w0=Math.hypot(Ee.x,Ee.z),Le=[-Ee.x/w0*Dt,-Ee.z/w0*Dt],we=await Ya(l,{palette:At,hour:m.hour,weather:T?"still":m.weather,cast:V,count:Math.round(U(45,70,(_-.7)/.6)),track:ge,sentinels:ot,duration:Ke,speed:Kt,lead:Qe,bullA:v0,bullLat:ba,flank:za,shadow:[Le[0],Le[1],1],wipeU:[.295,.42],glass:!1,wipeKeys:[[.295,255],[.33,60],[.345,0],[.36,-55],[.37,-86],[.38,-118],[.39,-150],[.405,-215],[.42,-305]],sunDir:[Ee.x,Ee.y,Ee.z]}),se=we.uniforms;se.uSheen.value*=1.7,X==="night"?(se.uGlass.value.set("#EBD8AE").multiplyScalar(.71),se.uGold.value.set(At[1]).multiplyScalar(.96),se.uOrange.value.set(At[2]).multiplyScalar(.86),se.uSienna.value.set(At[3]).lerp(new n.Color("#5A2238"),.4).multiplyScalar(.6),se.uUmber.value.set("#34172A").multiplyScalar(.85),se.uBlack.value.set("#0C0812"),se.uSheen.value*=.3):X!=="golden"?(se.uGlass.value.multiplyScalar(.93),se.uGlass.value.b*=1.2):(se.uGlass.value.copy(new n.Color("#F6B85A")).lerp(new n.Color("#EE9A32"),.35).multiplyScalar(.98),se.uGold.value.lerp(se.uOrange.value,.55),se.uOrange.value.lerp(se.uSienna.value,.45),se.uSienna.value.lerp(se.uUmber.value,.25),se.uUmber.value.multiplyScalar(.8)),await l.yield(),await eo(l,we);const zo=await(async()=>{const e=l.core.makeRng(l.core.hashSeed("namib-files:"+l.seed)),t=1.6,a=204,o=220;let i=250;for(;i<600&&(we.trackAt(i,$),!(ye($.x,$.z)[0]>=a));i+=.5);const s=(f,c)=>{let v=0;for(const w of[-6,-3,0,3,6])v+=Math.abs(Ot(Math.min(f+w,k+8),c));return v/5},u=(f,c)=>Math.max(Ve(f,c),0),h=[];for(const f of[1,-1]){const c=[];for(let r=i;r<i+60;r+=1.5){we.trackAt(r,$);const g=ye($.x,$.z);if(g[0]>o)break;c.push(g)}const v=c[c.length-1][0],w=c[c.length-1][1];for(let r=v+1.5;r<=k+30;r+=1.5)c.push([r,U(w,f*(s(r,f)+t),p(v,v+26,r))]);const z=c.map(r=>{const g=J(r[0],r[1]),y=u(r[0],r[1]);return[g[0],y,g[1],(u(r[0],r[1]+f*2.3)-y)/(f*2.3)]}),M=[];for(let r=0;r<7;r++)M.push({a:6-r*6.8+e.range(-1.2,1.2)-(f<0?3.4:0),lat:f*(r%2?e.range(1.5,2.3):e.range(0,.4)),sz:e.range(.94,1.08),seed:e(),gait:e()});h.push({pts:z,sAt:i,rows:M}),await l.yield()}return to(l,we,{lines:h,siftLen:12,lift:.05,duration:Ke,eye:(f,c)=>K.pointAt(f,c)})})();await l.yield();const ce=new n.Scene,Ut=B(m.fog),x0=B(m.veil),y0=B(At[6]).multiplyScalar(.85);ce.fog=new n.Fog(Ut.clone(),m.fogNear,m.fogFar),ce.background=Ut.clone(),ce.add(we.object);const We=(e,t,a={},o={})=>new n.ShaderMaterial({uniforms:{...n.UniformsUtils.clone(n.UniformsLib.fog),...se,...a},vertexShader:e,fragmentShader:t,fog:!0,...o}),mt={value:500},b0={value:new n.Vector4(lt,I,Be,Re)},Qt={value:new n.Vector3(-1e4,et-7,k)},vt={uSkyH:{value:B(m.skyH)},uSkyA:{value:B(m.skyA)},uStops:{value:new n.Vector4(...m.stops)},uBand:{value:new n.Vector3(...m.band)},uSkyM:{value:B(m.skyM)},uSkyZ:{value:B(m.skyZ)},uLip:{value:B(m.lip)},uWipe:{value:B(m.wipe)},uSunC:{value:new n.Vector3(...m.sunC)},uSunDir:{value:Ee},uVeilCol:{value:x0},uHaze:{value:y0},uHazeK:{value:0},uTime:se.uTime,uVeil:{value:0},uNight:{value:m.night},uSeed:{value:d.range(0,20)},uStill:{value:T?1:0}},_t=new n.Mesh(new n.SphereGeometry(7e3,48,24),new n.ShaderMaterial({uniforms:vt,vertexShader:io,fragmentShader:ro,side:n.BackSide,depthWrite:!1,depthTest:!1,fog:!1}));_t.renderOrder=-1,_t.frustumCulled=!1,ce.add(_t);const Ze=[-340,240,200,265],$t=(e,t,a=1)=>((e-Ze[0])/Ze[2])**2+((t-Ze[1])/Ze[3])**2<a,Me=we.anchors.footprint,Xe=[d.range(52,66)-26,I-d.range(13,16)+6.5,Math.PI+d.range(.5,.75)],z0={uRect:{value:new n.Vector4(Me.min[0]+.2,Me.min[1]+.2,Me.max[0]-.2,Me.max[1]-.2)},uPan:{value:new n.Vector4(...Ze)},uHead:{value:new n.Vector3(Te,0,1)},uShDir:{value:new n.Vector2(Le[0]/Dt,Le[1]/Dt)},uAdder:{value:new n.Vector4(Xe[0],Xe[1],Xe[2],0)},uStill:vt.uStill},M0=new n.PlaneGeometry(2e4,2e4,80,80);M0.rotateX(-Math.PI/2);const k0=new n.Mesh(M0,We(ao,oo,z0));k0.frustumCulled=!1,ce.add(k0);const A0=ha(),Zt=[],st=async(e,t,a,o)=>{const i=[];for(let h=0;h<=t;h++){for(let f=0;f<=e;f++)i.push(o(f,h));((h&3)===3||e>200)&&await l.yield()}const s=(h,f)=>i[Math.min(t,Math.max(0,f))*(e+1)+Math.min(e,Math.max(0,h))],u=(h,f,c)=>{const v=s(h-1,f),w=s(h+1,f),z=s(h,f-1),M=s(h,f+1),r=w[0]-v[0],g=w[c]-v[c],y=w[2]-v[2],x=M[0]-z[0],b=M[c]-z[c],A=M[2]-z[2],F=g*A-y*b,H=y*x-r*A,O=r*b-g*x,ne=Math.hypot(F,H,O)||1,oe=H<0?-1:1;return[oe*F/ne,oe*H/ne,oe*O/ne]};await A0.grid(e,t,a,(h,f)=>{const c=s(h,f),v=u(h,f,1);if(c.length>5){const w=u(h,f,5);return[c[0],c[1],c[2],v[0],v[1],v[2],c[3],c[4],c[5]-c[1],c[6],w[0],w[1],w[2],c[7],c[8],c[9],c[10]]}return[c[0],c[1],c[2],v[0],v[1],v[2],c[3],c[4]]},!1,()=>l.yield())};{const e=[0,21.5,22];let t=22,a=2.43;for(;t<S+760;)a=Math.min(a*1.22,t<S+150?12:34),t+=a,e.push(t);const o=[-21.5,-22];for(t=22,a=2.43;t<350;)a=Math.min(a*1.22,22),t+=a,o.push(-t);const i=o.reverse().concat(e),s=60,u=22,h=(r,g,y)=>{const x=he(r);let b,A;if(g<=s){const F=1.06*Math.pow(1-g/s,1.2);b=x-Ae(r)*F,A=F>1?-.5*(F-1)/.06:Y(b,r)}else{const F=1.06*(g-s)/u;b=x+L(r)*F,A=F>1?-.5:Y(b,r)}return te(r)<.3&&(A=Math.min(A,-.3)),y[0]=b,y[1]=A,y},f=[0,0];await st(i.length-1,s+u,0,(r,g)=>{const y=i[r],x=he(y),b=te(y);h(y,g,f);const A=f[0];let F=f[1];Math.abs(y)<21.9&&A>et-2&&A<k+13&&(F-=9);const H=J(A,y),O=re(A,y),ne=A<x&&O[2]>2&&Math.abs(O[1])<40;return[H[0],F,H[1],ne?Math.abs(O[1]):x-A,ne?20:b]}),await l.yield();const c=[];for(let r=et-3;r<200;r+=1.5)c.push(r);for(let r=200;r<=k+14.01;r+=.75)c.push(r);const v=[0,.8];for(let r=1.5;r<=12.01;r+=.5)v.push(r);for(let r=12.75;r<=18.01;r+=.75)v.push(r);v.push(19.2,20.5,22,22.6);const w=v.slice(1).reverse().map(r=>-r).concat(v),z=[-22,22].map(r=>{const g=[],y=[];for(let x=0;x<=s+u;x++)h(r,x,f),g.push(f[0]),y.push(f[1]);return{A:g,Y:y}}),M=(r,g)=>{const y=r.A;let x=0;for(;x<y.length-2&&y[x+1]<g;)x++;return U(r.Y[x],r.Y[x+1],Math.min(1,Math.max(0,(g-y[x])/(y[x+1]-y[x]))))};await st(w.length-1,c.length-1,1,(r,g)=>{const y=c[g],x=Math.abs(w[r])>21.9,b=Math.abs(w[r])>22.3,A=b?Math.sign(w[r])*22:w[r];let F=Ve(y,A,be),H=p0(y,A);x?F=H=M(z[A<0?0:1],y)-(b?.4:0):Y(y,A)<=.002&&(F=-.4,H=-.4);const O=J(y,w[r]);return[O[0],F,O[1],he(A)-y,te(A),H,pa(y),be.sd,be.th,be.rim,be.bump]});for(let r=0;r<520;r++){const g=d.range(-240,S+520),y=J(he(g),g),x=te(g);x>10&&Math.abs(g)>14&&Zt.push([y[0],x-.2,y[1],Math.min(1,.45+x/200)])}}await l.yield();const gt=177.5;{const e=[3.7,4.05,4.4,4.8,5.2,5.55,5.8,6,6.4,7,7.9,9,10.4,12.4],t=[-.15,.1,.34,.6,.82,.95,1,.92,.77,.6,.4,.22,.08,-.25],a=6,o=l.noise;for(const i of[-1,1]){const s=d.range(0,50);await st(464,13,-1,(u,h)=>{const f=352-u*.75,c=Te-f;let v=1.6*(i>0?1-p(122,148,c):1-p(150,240,c))*(.72+.5*(.5+.5*Math.sin(f*.11+s)*Math.sin(f*.037+s*1.7)));const w=i<0?p($e-14,$e-8,f)*(1-p($e+7,$e+13,f)):0;v=U(v,Tt,w),i<0&&(v*=(1-.75*p(220,232,f)*(1-p(268,280,f)))*(1-.8*p(gt-13,gt-6,f)*(1-p(gt+6,gt+13,f))));const z=U(.45*Math.sin(f*.09+s*.6)+.25*Math.sin(f*.31+s),Ct-5.8,w),M=o.n2(f*.9+s,i*3.1),r=o.n2(f*2.7+s,i*7.7),g=o.n2(f*.33+s,i*11.3),y=Math.exp(-((h-a)*(h-a))/6),x=h<a?1:0,b=Math.pow(Math.max(0,Math.sin(f*1.35+s+1.5*g)),2);let A=t[h]<0?t[h]:t[h]*v*(1+(.22*M+.12*r)*y*(1-w))*(1-.32*b*x*(1-Math.abs(h-3)/4))+.02;A-=.4*(1-p(.02,.3,v));const F=e[h]+z+.22*r*y*(1-w)-(x?.3*b*(1-h/a):0)+(h===13?1.2*M:h>=11?.6*M:0);return[f,A,I+i*F,e[h]-e[a],v*2.6]})}}await l.yield();const ka=[];{const e=[[330,640,.05,1e3,95],[-560,720,-.08,1100,120],[-1500,650,.1,1e3,100],[380,-560,-.04,900,85],[-520,-640,.07,1100,110],[-1450,-560,-.1,1e3,95],[-2300,380,1.35,1400,150],[-2900,-500,1.2,1500,170],[1300,60,1.5,1200,110]];for(const t of e){const a=t[0]+d.range(-70,70),o=t[1]+d.range(-50,50),i=t[2]+d.range(-.06,.06),s=t[3]*d.range(.9,1.1),u=t[4]*d.range(.85,1.15),h=d.range(0,6.28),f=d.range(30,70),c=Math.cos(i),v=Math.sin(i),w=o>0||Math.abs(i)>.8?-1:1,z=[1.06,1,.78,.56,.36,.19,.07,0,-.25,-.5,-.75,-1,-1.06];ka.push({cx:a,cz:o}),await st(44,12,0,(M,r)=>{const g=(M/44-.5)*s,y=Math.max(0,1-Math.pow(Math.abs(2*g/s),2.4)),x=u*Math.pow(y,.8)*(.78+.22*Math.sin(g*.011+h*2)),b=f*Math.sin(g/s*6.283+h),A=z[r],F=b+w*(A>=0?A*(50+1.9*x):A*(20+1.5*x)),H=Math.abs(A)>1||x<.5?-1.5:x*(A>=0?Math.pow(1-A,1.3):Math.pow(1+A,1.25));return r===7&&M%2===0&&x>25&&!T&&Zt.push([a+g*c-b*v,x,o+g*v+b*c,1.6]),[a+g*c-F*v,H,o+g*v+F*c,A*(50+1.9*x),x]})}}{const e=l.core.makeRng(l.core.hashSeed("namib-welwitschia:"+l.seed)),t=async(a,o,i,s,u=d.range(0,Math.PI))=>{const h=s*2-1,f=i>1,c=(v,w,z,M,r,g,y,x,b,A,F)=>st(12,2,2,(H,O)=>{const ne=H/12,oe=U(g,y,ne),rt=u+w*(.4+.6*oe)+M*oe*oe+A*(oe-g),ta=.25*i+z*oe,aa=U(x,b,Math.pow(ne,.8))*(1+.25*Math.sin(oe*17+w*9))*(O-1),Za=.1+.55*i*Math.sin(Math.min(oe*3.2,Math.PI*.5))*(1-.86*p(.25,.95,oe))+.35*r*oe*oe*oe,Xa=U(Za,.07,F*p(0,.6,ne))+(O===1?.05:0);return[a+v*(Math.cos(rt)*ta-Math.sin(rt)*aa),Xa,o+v*(Math.sin(rt)*ta+Math.cos(rt)*aa),O-1,.5*oe*oe]});for(const v of[-1,1]){const w=[];for(let z=0;z<h;z++){const M=z<s?d:e,r=(z-(h-1)/2)*(.9/(h-1))+M.range(-.1,.1),g=M.range(2.2,2.8)*i*(z<s?1:.8),y=M.range(-.5,.5),x=M.range(0,.5)*(i-1)+(z<s?0:e.range(0,.5));if(!f)await st(8,1,2,(b,A)=>{const F=b/8,H=u+r*F*.8+y*F*F,O=.15*i+g*F,ne=(.105-.07*F)*i*(A?1:-1),oe=.28*i+.75*i*Math.sin(Math.min(F*3.2,Math.PI*.5))*(1-.82*p(.25,1,F))+x*F*F*F;return[a+v*(Math.cos(H)*O-Math.sin(H)*(ne+r*.3*i)),oe+(A?.04:0),o+v*(Math.sin(H)*O+Math.cos(H)*(ne+r*.3*i)),0,1.4*F*F]});else if(z<s){const b={fr:(z-(s-1)/2)*.34+2*(r-(z-(h-1)/2)*(.9/(h-1))),ln:g,kink:y*.7,curl:x};w.push(b),await c(v,b.fr,b.ln,b.kink,b.curl,0,1,.19*i,.075,0,0)}}if(f)for(const z of w)for(let M=0;M<3;M++)M===2&&e()<.5||await c(v,z.fr,z.ln,z.kink,z.curl,e.range(.55,.78),e.range(1.05,1.3),.06,.02,(M-1)*e.range(.35,.8)+e.range(-.15,.15),1)}};for(let a=0;a<3;a++)await t(268-a*15+d.range(-3,3),I-d.range(10.5,13.5),1,3);await t(gt,I-8.8,1.7,5,d.range(-.3,.3))}await l.yield();const S0=[];{let e=0;for(;e<900&&(we.herdPoint(0,$,e-Qe(0)),!(ye($.x,$.z)[0]>224));e+=3);for(let t=0;t<17;t++){const a=e+t*9.5;we.herdPoint(0,$,a-Qe(0));const o=ye($.x,$.z);S0.push(new n.Vector3(o[0],o[1],a))}}const P0={value:0},F0=We(so,no,{uLeg:b0,uFur:Qt,uStill:vt.uStill,uHerdS:P0,uHT:{value:S0}},{side:n.DoubleSide}),Aa=A0.build();await l.yield();const T0=new n.Mesh(Aa,F0);T0.frustumCulled=!1,ce.add(T0),await l.yield();const le=d.fork("trees"),je={P:[],N:[],R:[],T:[],I:[],S:[],sh:Le},fe=[],wt=(e,t,a)=>{if(!$t(e,t,.86))return!1;const o=ye(e,t);if(Y(o[0],o[1])>0||Y(o[0]+3,o[1])>0||o[0]>200||e>Me.min[0]-14&&e<Me.max[0]+14&&t>Me.min[1]-14&&t<Me.max[1]+14)return!1;const i=pt(e,t);if(i.lat>-8.5&&i.lat<13.5||K.nearestXZ(e,t).dist<a)return!1;for(const s of fe)if((s.x-e)**2+(s.z-t)**2<64)return!1;return!0},C0=(e,t)=>{K.posAtDist(e,$),K.tangentAtDist(e,Z);const a=Math.hypot(Z.x,Z.z)||1;return[$.x-t*Z.z/a,$.z+t*Z.x/a]};{const e=C0(604+de,12.3);fe.push({x:e[0],z:e[1],h:9.6,near:!0,big:!0});for(let t=0;t<11;t++)for(let a=0;a<60;a++){const o=C0(468+de+t*18.5+le.range(-5,5),le.range(19,36)),i=pt(o[0],o[1]);if(i.lat<-8.8&&i.lat>-17&&wt(o[0],o[1],14)){fe.push({x:o[0],z:o[1],h:le.range(5.6,7.2),near:!0,row:!0});break}}}await l.yield();for(let e=0;fe.length<34&&e<4e3;e++){(e&63)===63&&await l.yield();const t=le.range(452+de,672+de),a=le.range(3.6,7),o=le.chance(.75)?1:-1,i=o>0?le.range(8.5,34)+.45*a:le.range(31,60);K.posAtDist(t,$),K.tangentAtDist(t,Z);const s=Math.hypot(Z.x,Z.z)||1,u=$.x+o*i*Z.z/s,h=$.z-o*i*Z.x/s;wt(u,h,8+.45*a)&&fe.push({x:u,z:h,h:a,near:!0})}for(let e=0;fe.length<64&&e<9e3;e++){(e&63)===63&&await l.yield();const t=le.range(-520,-150),a=le.range(40,330),o=pt(t,a);(o.lat<-8.5&&o.lat>-30||o.lat>13.5&&o.lat<30)&&o.s>50&&wt(t,a,9)&&fe.push({x:t,z:a,h:le.range(3.4,6.2),near:fe.length<50})}for(let e=0;fe.length<78&&e<9e3;e++){(e&63)===63&&await l.yield();const t=le.range(-545,-140),a=le.range(60,380),o=le.range(3,7);K.nearestXZ(t,a).dist<115&&wt(t,a,28)&&fe.push({x:t,z:a,h:o,near:!1})}for(let e=0;fe.length<90&&e<9e3;e++){(e&63)===63&&await l.yield();const t=le.range(-545,-140),a=le.range(-20,500),o=le.range(3,7);wt(t,a,30)&&fe.push({x:t,z:a,h:o,near:!1})}for(let e=0;e<fe.length;e++){const t=fe[e],a=wo(je,le,t.x,t.z,t.h,t.near,e);t.top=a.top,t.skel=a.skel,t.seed=a.seed,(e&7)===7&&await l.yield()}await l.yield(),await l.yield();const Oe=new n.BufferGeometry;Oe.setAttribute("position",new n.Float32BufferAttribute(je.P,3)),Oe.setAttribute("normal",new n.Float32BufferAttribute(je.N,3)),Oe.setAttribute("aRad",new n.Float32BufferAttribute(je.R,3)),Oe.setAttribute("aT",new n.Float32BufferAttribute(je.T,3)),Oe.setAttribute("aS",new n.Float32BufferAttribute(je.S,2)),Oe.setIndex(je.I),Oe.boundingSphere=new n.Sphere(new n.Vector3(Ze[0],0,Ze[1]),500);const nt={uPx:mt,uCur:{value:-1},uCurK:{value:2},uRare:{value:-1},uShadow:{value:new n.Vector3(Le[0],Le[1],0)}},Sa=new n.Mesh(Oe,We(ia,ra,nt,{side:n.DoubleSide})),Pa=new n.Mesh(Oe,We(ia,ra,nt,{side:n.DoubleSide,defines:{SHADOW:1},polygonOffset:!0,polygonOffsetFactor:0,polygonOffsetUnits:-2}));ce.add(Sa,Pa),await l.yield();const Bt=7,W0=142,Xt=170,Fa=(e,t)=>e>-95&&e<90&&Math.abs(t-(3.4+1.6*Math.sin(e*.023+.7)+.4*Math.sin(e*.09+2)))<5.5,D0=(e,t)=>((e-42)/74)**2+((t-19)/12.5)**2<1,Ta=(e,t)=>{const a=e-Xe[0],o=t-Xe[1],i=Math.cos(Xe[2]),s=Math.sin(Xe[2]),u=a*i+o*s;return u>-1.5&&u<26.5&&Math.abs(o*i-a*s)<1.7},_0=e=>{if(e>-25)return I;const t=K.nearestXZ(e,190);return K.pointAt(t.u,Fe),Fe.z},jt=(e,t,a)=>{const o=t-I;if(e>Me.min[0]-8&&e<Me.max[0]+8&&t>Me.min[1]-8&&t<Me.max[1]+8||e>76&&Math.abs(o)<13||e<=76&&K.nearestXZ(e,t).dist<(a?3.6:14)||e>-60&&e<Te-Xt+15&&o>Bt-3&&o<Bt+3||a&&(Fa(e,o)||Ta(e,t))||e<-40&&pt(e,t).dist<(a?12:18))return!1;const i=ye(e,t);return Y(i[0],i[1])<=0},xe=d.fork("grass"),Yt=Math.round(2600*_*P*(R?2.6:1)),B0=new Float32Array(Yt*4),xt=[],Jt=Math.round(520*Math.max(P,.8)),R0=new Float32Array(Jt*4);let yt=0,bt=0;for(let e=0;bt<Jt&&e<Jt*10;e++){(e&127)===127&&await l.yield();const t=xe.range(-78,104),a=(xe()<.5?-1:1)*(3.8+Math.pow(xe(),1.3)*12),o=_0(t)+a;if(!jt(t,o,!0)||D0(t,o-I)&&xe()<.7)continue;const i=xe.range(.6,1.25)*(R?.9:1),s=xe();R0.set([t,o,i,s],bt*4),bt++,xt.push(t,o,i,s)}await l.yield();for(let e=0;yt<Yt&&e<Yt*8;e++){(e&255)===255&&await l.yield();const t=xe.range(-150,335),a=(xe()<.5?-1:1)*(3+Math.pow(xe(),1.7)*100),o=(t<60?_0(t):I)+a;if(!jt(t,o,!0)||$t(t,o,1.02)&&xe()<.93||D0(t,o-I)&&xe()<.75)continue;const i=xe.range(.45,1.1)*(R?.85:1),s=xe();B0.set([t,o,i,s],yt*4),yt++,Math.abs(a)<50&&xt.length<5600&&xe()<.6&&xt.push(t,o,i,s)}const q0=We(lo,fo,{uPx:mt,uWindK:{value:T?.35:1}},{side:n.DoubleSide}),G0=new n.Mesh(ct(da(4),{iG:B0.subarray(0,yt*4)},yt),q0);G0.frustumCulled=!1,ce.add(G0);const V0=new n.Mesh(ct(da(11),{iG:R0.subarray(0,bt*4)},bt),q0);V0.frustumCulled=!1,ce.add(V0);const e0=new n.Mesh(ct(ca(),{iG:new Float32Array(xt)},xt.length/4),We(co,ho,{},{transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:0,polygonOffsetUnits:-2}));e0.frustumCulled=!1,e0.renderOrder=1,ce.add(e0);{const e=ha(),t=d.fork("nara"),a=12,o=6;e.grid(a,o,0,(w,z)=>{const M=w/a*Math.PI*2,r=z/o,g=2.3*(1+.9*Math.max(0,-Math.cos(M)))*(1+.12*Math.sin(3*M+1)),y=g*r,x=r*1.3,b=Math.hypot(x,1);return[Math.cos(M)*y,r>=1?-.15:1.9*Math.pow(1-r*r,1.1),Math.sin(M)*y*.8,Math.cos(M)*x/b,1/b,Math.sin(M)*x/b,(1-r)*g,.5]});for(let w=0;w<13;w++){const z=t.range(0,6.28),M=z+t.range(1.2,3.4),r=t.range(.25,1),g=t.range(.25,1),y=t.range(.5,1.1),x=t.range(-.4,.4);e.grid(6,1,2,(b,A)=>{const F=b/6,H=U(z,M,F),O=U(r,g,F),ne=Math.cos(H)*1.7*O+x*Math.sin(F*9),oe=Math.sin(H)*1.4*O,rt=1.9*Math.pow(Math.max(0,1-.3*O*O),1.1)*(1-.5*O)+y*Math.sin(Math.PI*F)+(A?.13:0)-.1;return[ne,rt,oe,Math.sin(H),.2,-Math.cos(H),0,.5]})}const i=40,s=new n.InstancedMesh(e.build(),F0,i),u=new n.Matrix4,h=new n.Quaternion,f=new n.Vector3,c=new n.Vector3;let v=0;for(const w of[[45,-10.8,1,.25],[14,22,1.15,-.3]])u.compose(c.set(w[0],0,I+w[1]),h.setFromAxisAngle(new n.Vector3(0,1,0),w[3]),f.set(w[2],w[2],w[2])),s.setMatrixAt(v++,u);for(let w=0;v<i&&w<4e3;w++){(w&63)===63&&await l.yield();const z=t.range(-135,330),M=(t()<.5?-1:1)*t.range(22,120),r=I+M;if(!jt(z,r,!1)||$t(z,r,1.06)||(z-45)**2+(M+10.8)**2<150||(z-14)**2+(M-22)**2<150)continue;const g=t.range(.7,1.25);u.compose(c.set(z,0,r),h.setFromAxisAngle(new n.Vector3(0,1,0),t.range(-.45,.45)),f.set(g,g*t.range(.85,1.15),g)),s.setMatrixAt(v++,u)}s.count=v,s.instanceMatrix.needsUpdate=!0,s.frustumCulled=!1,ce.add(s)}await l.yield(),await l.yield();const zt=d.fork("ostrich"),Rt=zt.int(6,9),L0=new Float32Array(Rt*4);for(let e=0;e<Rt;e++)L0.set([U(-7.5,7.5,(e+zt.range(.15,.85))/Rt),zt.range(-1.5,1.5)+(e%2?.5:-.5),zt.range(.98,1.2),zt()],e*4);const t0={uOstS:{value:0},uPx:mt,uOstO:{value:new n.Vector3(Te,0,I)},uOstL:{value:new n.Vector3(W0,Xt,Bt)},uShadow:{value:new n.Vector3(Le[0],Le[1],1)}},a0=new n.Mesh(ct(xo(),{iA:L0},Rt),We(la,fa,t0,{side:n.DoubleSide}));a0.frustumCulled=!1,ce.add(a0);const O0=new n.Mesh(a0.geometry,We(la,fa,t0,{side:n.DoubleSide,defines:{SHADOW:1},polygonOffset:!0,polygonOffsetFactor:0,polygonOffsetUnits:-2}));O0.frustumCulled=!1,ce.add(O0),await l.yield();const N0=((e,t)=>{const a=e.length,o=[],i=new Array(a);for(let s=0;s<a-1;s++)o.push((t[s+1]-t[s])/(e[s+1]-e[s]));i[0]=o[0],i[a-1]=o[a-2];for(let s=1;s<a-1;s++)i[s]=o[s-1]*o[s]<=0?0:2*o[s-1]*o[s]/(o[s-1]+o[s]);return s=>{if(s<=e[0])return t[0]+i[0]*(s-e[0]);if(s>=e[a-1])return t[a-1]+i[a-1]*(s-e[a-1]);let u=0;for(;s>e[u+1];)u++;const h=e[u+1]-e[u],f=(s-e[u])/h,c=f*f,v=c*f;return(2*v-3*c+1)*t[u]+(v-2*c+f)*h*i[u]+(-2*v+3*c)*t[u+1]+(v-c)*h*i[u+1]}})([0,.02,.08,.16,.25,.285,.34],[18,.02*ae+17,.08*ae+20,.16*ae+17,.25*ae+12,.285*ae+2,.285*ae+2+550*.055]),Ca=(e,t,a=0)=>{const o=N0(e)-a;return t.set(Te-o,1.4,I+Bt*p(W0,Xt,o))},qt=d.fork("grouse"),o0=Math.max(40,Math.round(80*P)),E0=new Float32Array(o0*4);for(let e=0;e<o0;e++){const t=qt.gauss(),a=qt.gauss(),o=qt.gauss();E0.set([t*4.5,Math.max(-2.2,a)*.6,o*5.5,qt()],e*4)}const s0={uFlock:{value:new n.Vector3},uFlockDir:{value:new n.Vector3(0,0,1)},uPx:mt,uTip:{value:new n.Vector3(m.night?1.4:9,m.night?.03:.5,m.night)}},K0=new n.Mesh(ct(yo(),{iA:E0},o0),We(uo,po,s0,{side:n.DoubleSide}));K0.frustumCulled=!1,ce.add(K0),await l.yield();const C=d.fork("grains"),n0=[],H0=[],ke=(e,t,a,o,i,s,u)=>{n0.push(e,t,a,C()*100),H0.push(o,i,s,u)},Wa=Math.round(1500*P);for(let e=0;e<Wa;e++)ke(e%2?1:-1,0,0,0,0,0,C.range(.5,1.3));const Da=(T?.3:1)*P;for(const e of Zt){const t=C()<Da?1:0;for(let a=0;a<t;a++){const o=C.range(3,6.5);ke(e[0],e[1],e[2],1,1/o,o,C.range(5,12)*e[3])}}for(let e=0;e<950;e++){const t=k+C.range(-2,8),a=C.range(13,33),o=J(t,a);ke(o[0],Y(t,a)+C.range(0,2),o[1],2,0,0,C.range(1.1,2.6))}const _a=Math.round(2800*P);for(let e=0;e<_a;e++){const t=C()<.5?-1:1,a=t<0?7:0,o=Math.floor(C.range(206,k+3)/5.6+a*.37),i=C.range(.35,1),s=C.range(.8,1.6),u=(o+.5+.28*Math.sin(o*12.9898+a)-a*.37)*5.6+.11*C.gauss();if((e&255)===255&&await l.yield(),t<0&&u>k-92&&u<k-6&&i>.6)continue;Ve(u,t,be);const h=1-be.sd,f=t*U(h,1-be.rim,i),c=Ve(u,f,be),v=J(u,f);be.th<.5||u<204||u>k+4||ke(v[0],c,v[1],3,t*(Math.abs(f)-h)*.95,be.th*.95,s)}await l.yield();const Mt=new n.Vector3(Be,0,Re).lerp(new n.Vector3(-1,0,0),.5).normalize();{const e=Mt.x*Be+Mt.z*Re,t=Mt.x*Ye+Mt.z*Je,a=Math.round((T?600:2e3)*P);for(let s=0;s<a;s++){const u=C.range(134,252),h=(C()<.5?-1:1)*(9+75*Math.pow(C(),1.6)),f=J(u,h),c=p0(u,h);(s&255)===255&&await l.yield(),!(c<.3)&&ke(f[0],c+.3,f[1],8,(Y(u+14*e,h+14*t)-Y(u,h))/14,C.range(2,3.6),C.range(.4,.95))}const o=Math.round((T?200:700)*P);for(let s=0;s<o;s++){(s&255)===255&&await l.yield();const u=70+650*Math.pow(C(),1.15),h=J(he(u),u),f=te(u);ke(h[0],f-.3,h[1],10,0,C.range(2.6,4.6),(1.4+.011*Math.hypot(he(u)-180,u+20))*C.range(.7,1.4))}const i=Math.round((T?60:280)*P);for(let s=0;s<i;s++){const u=(C()<.5?-1:1)*C.range(15,150),h=J(he(u),u),f=C.range(3,6.5);ke(h[0],te(u)-.2,h[1],1,1/f,f,C.range(7,15))}}const Ba=Math.round(900*P);for(let e=0;e<Ba;e++)ke(C(),C(),C(),4,0,0,C.range(.035,.075));for(let e=0;e<240;e++){const t=C.range(120,700),a=(C()<.5?-1:1)*C.range(16,95);K.posAtDist(t,$),K.tangentAtDist(t,Z);const o=Math.hypot(Z.x,Z.z)||1;ke($.x+a*Z.z/o,.3,$.z-a*Z.x/o,5,C.range(7,15),C.range(0,6.28),C.range(1.2,2.6))}if(E)for(let e=0;e<fe.length;e++){const t=fe[e],a=Math.round((t.big?240:t.row?120:t.near?18:7)*P),o=Math.round((t.big?64:t.row?28:t.near?6:3)*Math.max(P,.7));for(let i=0;i<a&&t.skel.length;i++){const s=t.skel[Math.floor(C()*t.skel.length)];ke(s.x,s.y,s.z,6,1-s.y/Math.max(t.top,.5),C(),(t.big?.55:t.row?.45:.4)*C.range(.7,1.3))}for(let i=0;i<o;i++)ke(t.x,t.top,t.z,9,t.seed*.14,t.h*.22,t.near?C.range(.11,.2):C.range(.2,.3));(e&15)===15&&await l.yield()}for(let e=0;e<26;e++)ke(0,0,0,7,0,0,.2);const De={uHeadP:{value:new n.Vector3},uHeadT:{value:new n.Vector3(-1,0,0)},uCamP:{value:new n.Vector3},uWind:{value:Mt},uLeg:b0,uFur:Qt,uThread:{value:new n.Vector4},uHeadV:{value:d0},uBow:{value:1},uBowS:{value:1},uPlume:{value:0},uSmoke:{value:1},uRareT:{value:-10},uRareK:{value:-1},uCap:{value:.3},uCurt:{value:m.night?.35:1}};await l.yield();const i0=new n.Mesh(ct(ca(),{iP:new Float32Array(n0),iQ:new Float32Array(H0)},n0.length/4),We(mo,vo,De,{transparent:!0,depthWrite:!1}));i0.frustumCulled=!1,i0.renderOrder=6,ce.add(i0),await l.yield();const r0=fe.map((e,t)=>e.near?t:-1).filter(e=>e>=0),I0=J(k,0),Ra=new n.Vector3(ot[1].pos[0],ot[1].pos[1]+1.4,ot[1].pos[2]),qa=e=>e*ae+9+(ae-19-.86*ae)*(.6*p(.655,.725,e)+.4*p(.76,.86,e)),Ga=(e,t,a,o)=>{if(e<.5){const i=e/.26;K.posAtDist(e*ae+40-8*Math.min(i,1.6)-10*(1-p(.02,.1,e)),a),K.tangentAtDist(e*ae+40,Z);const s=-16+133*e;a.x+=s*Z.z,a.z-=s*Z.x,a.y=11.5+.5*Math.sin(t*.7),o.set(Z.z*.9+Z.x*.45,0,-Z.x*.9+Z.z*.45)}else{const i=(e-.8)/.2,s=70-105*i;a.set(I0[0]+Ye*s-Be*6,Lt(k)+10+5*(1-i)+Math.sin(t*.7),I0[1]+Je*s-Re*6),o.set(-Ye*.9+Be*.4,0,-Je*.9+Re*.4)}},Va=new n.Vector3,kt=new n.Vector3,U0=new n.Vector3,Q0=new n.Vector3,La=new n.Vector2,l0=new n.Vector3,_e=new n.Vector3,it=new n.Vector3,Oa=e=>.6*p(.398,.416,e)*(1-p(.42,.445,e)),Na=e=>X==="fog"?1-p(.3,.5,e):0,Ea=Ut.clone(),f0=ce.fog;await l.yield();const c0=new Float32Array(421);for(let e=0;e<=420;e++)c0[e]=Math.max(Ve(e,0),0);const Ka=e=>1+.08*(1-p(.14,.26,e))-.3*p(.285,.335,e)*(1-p(.425,.475,e))-.04*p(.44,.48,e)*(1-p(.66,.74,e)),$0=(e,t,a,o)=>{o=o||0,we.setProgress(o),we.update(e,t,a),P0.value=Qe(o),a.getWorldPosition(l0),_t.position.copy(l0),De.uCamP.value.copy(l0);const i=l.renderer.getDrawingBufferSize(La).y;mt.value=.5*i*a.projectionMatrix.elements[5];const s=qa(o);K.posAtDist(Math.min(s,ae+30),_e),K.tangentAtDist(Math.min(s,ae),it);const u=(_e.x-lt)*Be+(_e.z-I)*Re,h=s>dt+20,f=Math.min(419,Math.max(0,u)),c=Math.floor(f);if(h){const b=p(95,115,u),A=((_e.x-lt)*Ye+(_e.z-I)*Je)*b;_e.x-=Ye*A,_e.z-=Je*A,it.set(U(it.x,Be,b),it.y,U(it.z,Re,b)).normalize()}_e.y=h?U(c0[c],c0[c+1],f-c)+.2:.1,De.uHeadP.value.copy(_e),De.uHeadT.value.copy(it);const v=o*ae,w=p(dt+et-10,dt+et+30,s);De.uBow.value=((1-.7*p(170,230,v))*(1-p(230,300,v))+w)*(1-p(ae-14,ae-4,s)),De.uBowS.value=1+1.8*w,z0.uHead.value.set(_e.x,0,h?0:1),Qt.value.x=h?s>=ae-10.5?1e4:u:-1e4,De.uPlume.value=p(.852,.874,o);const z=Oa(o),M=Na(o);f0.color.copy(Ea).lerp(y0,.75*M).lerp(x0,z),f0.near=U(U(m.fogNear,30,M),4,Math.min(1,z*1.4)),f0.far=U(U(m.fogFar,520,M),190,Math.min(1,z*1.4)),vt.uVeil.value=z*.93,vt.uHazeK.value=.85*M,t0.uOstS.value=N0(o),Ga(o,t,s0.uFlock.value,s0.uFlockDir.value);const r=t/7,g=r-Math.floor(r),y=r0.length?r0[(Math.floor(r)*7+3)%r0.length]:-1;nt.uCur.value=y,nt.uCurK.value=g<.2?1.25*(1-g/.2):1.3*(g-.2)/.62;const x=y>=0?fe[y]:null;if(x&&De.uThread.value.set(x.x,x.top*Math.min(1,nt.uCurK.value),x.z,g>.2&&g<.84?1:0),E){const b=(o-.585)*Ke,A=b<0?-1:b<.7?1.4*(1-b/.7):Math.max(0,(b-1.6)*.45);nt.uRare.value=A,De.uRareT.value=b<0?-10:b,De.uRareK.value=b<1.6?-1:A}},Z0=new n.Vector3,X0=new n.Vector3,j0=new n.Vector3,Y0=new n.Vector3,Ha=new n.Vector3,Ia=new n.Vector3,J0=J(532,327),Ua=new n.Vector3(J0[0],100,J0[1]),Qa=8,ea={from:.285,to:.86,weight:.68,fade:.13,at:(e,t)=>{const a=Qe(t),o=Math.min(a+2,Math.max(a-64,Et(t)+U(40,15,p(.36,.41,t))-Qa*p(.455,.505,t)*(1-p(.55,.59,t))+32*p(.64,.72,t)));return we.herdPoint(t,kt,o-a),we.herdPoint(t,U0,"bull"),kt.lerp(U0,.75*p(.55,.6,t)*(1-p(.66,.71,t))),K.pointAt(t,Fe),Q0.set(Math.max(-215,Math.min(se.uXf.value-20+28*p(.37,.39,t),Fe.x-50)),30,30),kt.lerp(Q0,1-p(.385,.412,t)),K.posAtDist(Math.min(ae,t*ae+45),Z0),kt.lerp(Z0,p(.745,.8,t)).lerp(Ua,p(.72,.77,t)*(1-p(.8,.85,t)))}},$a=[{from:.022,to:.125,weight:.55,fade:.3,at:(e,t)=>(K.posAtDist(t*ae+40,Y0),Ha.copy(Ma).lerp(Y0,p(.078,.097,t)))},{from:.105,to:.3,weight:.6,at:(e,t)=>Ca(t,Va,-3)},ea,{from:.288,to:.44,weight:.9,fade:.25,at:(e,t)=>(ea.at(e,t),K.pointAt(t,Fe),X0.copy(kt).sub(Fe).normalize(),K.posAtDist(t*ae+24,j0).sub(Fe).normalize(),j0.lerp(X0,p(.3,.352,t)).normalize().multiplyScalar(120).add(Fe))},{from:.54,to:.64,weight:.45,fade:.3,at:(e,t)=>we.herdPoint(t,Ia,"bull")},{from:.86,to:.99,weight:.3,at:Ra}];return $0(0,0,{getWorldPosition:e=>e.copy(K.start),projectionMatrix:{elements:[0,0,0,0,0,1.66]}},0),{scene:ce,path:K,duration:Ke,pace:Ka,pois:$a,update:$0,title:X==="night"?"The Desert the Wind Draws, by Night":"The Desert the Wind Draws",camera:{fov:62,near:.4,far:9e3,lookAhead:24,sway:.8,bank:.8},portal:{shape:"circle",radius:8.6,color:m.portal,glow:.9,tilt:!0,revealDistance:300},post:{exposure:m.exposure,bloom:{strength:.16,radius:.55,threshold:1.3},grade:{saturation:1.06,contrast:1.05,tint:m.tint,shadowTint:m.shadow,vignette:.3,grain:.03,aberration:0}},ride:"none",style:"none",dispose(){}}}};export{Po as default};
