import*as e from"three";import{mergeGeometries as Ze}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as fe,lerp as te,smoothstep as ge}from"../kit/core.js";const ue=4.4,ze=140,U=25,oe=52,R=122.4,ne=62,ve=2.4,B=r=>te(32,8,fe((r-ue)/(ze-ue),0,1)),ae=r=>te(20,5,fe((r-ue)/(R-ue),0,1)),je=["#DCE6EA","#9FB4BE","#3E5560","#5A2A1C","#C9A04A","#F4E3B0","#1B2226"],_e=`
uniform vec3 uZen, uHor, uSlate, uSunCol, uSunDir, uDarkCol; uniform vec2 uDownwind; uniform float uMirror, uDim, uWaterY;
uniform mat4 uHeroInv;
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float fbm(vec2 p){ return vn(p) * .5 + vn(p * 2.03 + 7.1) * .3 + vn(p * 4.1 + 3.7) * .2; }
float hwB(float y){ return mix(32., 8., clamp((y - 4.4) / 135.6, 0., 1.)); }
// silver overcast: pearl horizon to silver zenith, a slate band low downwind, a soft sun; below the horizon the water
vec3 skyCol(vec3 d, float blur){
  float up = smoothstep(-.02, .55 + blur * .3, d.y);
  vec3 c = mix(uHor * .82, uZen * .78, up);
  // thin overcast: long soft streaks, and a band of slate cloud low on the downwind horizon
  vec2 sp = d.xz / (abs(d.y) + .22);
  c *= 1. + (fbm(sp * vec2(.9, 2.3) + 4.) - .5) * .34 * (1. - blur);
  float l2 = dot(d.xz, d.xz);
  float dw = l2 > 1e-6 ? dot(d.xz, uDownwind) / sqrt(l2) : 0.;
  float cloudBand = smoothstep(.17 + blur * .1, .03, d.y) * smoothstep(.15, .85, dw);
  c = mix(c, uSlate * 1.05, cloudBand * .72);
  float s = max(dot(d, uSunDir), 0.);
  c += uSunCol * (pow(s, mix(900., 14., blur)) * mix(5., .5, blur) + pow(s, 6.) * .22);
  vec3 w = mix(uSlate * .42, uHor * .46, .25 + .75 * clamp(1. + d.y * 2.2, 0., 1.));
  return mix(w, c, smoothstep(-.06 - blur * .25, .02 + blur * .1, d.y));
}
// 0 outside the case, 1 deep inside the works chamber (p in hero space)
float insideCase(vec3 p){
  float hw = hwB(p.y);
  float depth = min(hw - p.z, hw - abs(p.x));
  return smoothstep(.3, 7., depth) * (1. - smoothstep(136., 141., p.y));
}
// silver light bounced up off the water and in through the open front
vec3 bounce(vec3 n, vec3 p){
  float low = (1. - smoothstep(4., 70., p.y));
  float front = smoothstep(-26., 24., p.z);
  float dn = .5 - .5 * n.y;
  return uHor * (.03 + .40 * low * dn * dn + .11 * front * max(n.z * .7 + .3, 0.));
}
`,Te=`#include <fog_pars_vertex>
`,Ce=`#include <fog_pars_fragment>
`,Xe=`
attribute float aKind;            // 0 veneer panel, 1 moulding (no stringing), 2 interior dark
varying vec3 vW, vN, vH; varying vec2 vUv; varying float vKind;
${Te}
void main(){
  vec4 wp = modelMatrix * vec4(position, 1.);
  vW = wp.xyz; vH = (uHeroInv * wp).xyz; vH.y = abs(vH.y); vUv = uv; vKind = aKind;
  vN = normalize(mat3(modelMatrix) * normal);
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,$e=`
uniform vec3 uWood, uWoodHi, uInlay; uniform float uSeed;
varying vec3 vW, vN, vH; varying vec2 vUv; varying float vKind;
${Ce}
void main(){
  vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vW);
  N.y *= uMirror; V.y *= uMirror;                             // a mirrored copy is lit like the original
  vec3 nH = normalize(mat3(uHeroInv) * N);
  float across = vUv.x, along = vUv.y;
  // distance in metres from the panel's edges (and from the open front on kind 3): where the stringing runs
  float d = min(hwB(along) - abs(across), min(along - 10.6, 131.4 - along));
  if (vKind > 2.5) {
    float oh = mix(20., 5., clamp((along - 4.4) / 118., 0., 1.));
    d = min(d, max(abs(across) - oh, along - 122.4));
  }
  float panel = step(vKind, .5) + step(2.5, vKind);
  float w = max(fwidth(d), 1e-4);
  float band = smoothstep(.9 - w, .9 + w, d);                  // 0 in the cross-banded border, 1 in the field
  float s1 = smoothstep(.16 + w, .16 - w, abs(d - .9)) * min(1., .32 / w);
  float s2 = smoothstep(.05 + w, .05 - w, abs(d - 1.55)) * min(1., .10 / w);
  float inlay = clamp(s1 + s2, 0., 1.) * panel;
  // figure: ribbon stripe along the grain (40:1), a finer curl, pores; the border's grain runs across
  vec2 g = mix(vec2(along * .9, across * 3.), vec2(across, along), mix(step(1.5, vKind), band, panel));
  float seed = uSeed + floor(vKind + .5) * 3.1 + step(.5, abs(nH.x)) * 11. + step(0., nH.x + nH.z) * 5.;
  float warp = fbm(vec2(g.x * .12 + seed, g.y * .01)) * 2.2;
  float rib = smoothstep(.2, .8, vn(vec2(g.x * .8 + warp + seed, g.y * .0105)));
  float curl = fbm(vec2(g.x * 2.6 + seed, g.y * .065 + rib));
  float pore = vn(vec2(g.x * 34., g.y * .85)) * vn(vec2(g.x * 9., g.y * .22 + 3.));
  float px = max(fwidth(g.x), 1e-4);
  pore = mix(pore, .25, clamp(px * 20., 0., 1.));
  float fig = clamp(rib * .55 + curl * .5 - pore * .35, 0., 1.);
  float mouldK = step(.5, vKind) * step(vKind, 1.5), inK = step(1.5, vKind) * step(vKind, 2.5);
  fig = mix(fig, .40, mouldK); rib = mix(rib, .5, mouldK); curl = mix(curl, .5, mouldK);   // mouldings are run from plain stock: clean steps, no figure
  vec3 alb = mix(uWood * .85, uWoodHi, fig * .8) * mix(.7, 1., mix(1., band, panel));
  // light: low soft key, silver sky fill, slate where the sun misses
  vec3 L = uSunDir;
  float ndl = dot(N, L);
  float key = smoothstep(-.25, .9, ndl);
  vec3 amb = mix(uSlate * 1.4, uZen * 1.1, N.y * .5 + .5) + uHor * .22;
  vec3 col = alb * (uSunCol * key * .95 + amb + uHor * .30 * mouldK);     // (the mouldings' shaded steps stay wood, never black)
  // long polish highlight: anisotropic along the grain, shifted by the figure so it ripples over the ribbon
  vec3 up = vec3(0., 1., 0.);
  vec3 T = up - N * dot(up, N);
  T = dot(T, T) > 1e-4 ? normalize(T) : vec3(1., 0., 0.);
  vec3 Hh = L + V; Hh = dot(Hh, Hh) > 1e-6 ? normalize(Hh) : N;
  vec3 Ts = normalize(T + N * ((rib - .5) * .34 + (curl - .5) * .16));
  float th = dot(Ts, Hh);
  float sinTH = sqrt(max(1. - th * th, 0.));
  float aniso = pow(sinTH, 46.) * smoothstep(-.05, .35, ndl) * smoothstep(-.1, .3, dot(N, V));
  col += mix(uWoodHi, uSunCol, .5) * aniso * .42 * (.6 + .8 * fig) * mix(.35, 1., panel);
  // clear coat: cool sky sheen, strongest at grazing
  vec3 R = reflect(-V, N);
  float fr = .085 + .9 * pow(1. - clamp(dot(N, V), 0., 1.), 4.);
  col += skyCol(R, .22) * fr * .6;
  // brass stringing let into the veneer
  vec3 br = uInlay * (uSunCol * (.35 + .65 * key) + amb * .8) + uInlay * skyCol(R, .5) * .5
          + uSunCol * pow(max(dot(N, Hh), 0.), 60.) * 1.2;
  col = mix(col, br, inlay);
  // inside the case: dark, lit only by silver light off the water
  float ins = max(step(1.5, vKind) * step(vKind, 2.5), insideCase(vH));
  vec3 bn = bounce(nH, vH);
  // the works chamber is panelled in near-black wood: frames and fielded panels, a faint figure, no stripes
  vec2 pq = vec2(across / 7.5 + .5, along / 12.), pf = abs(fract(pq) - .5) * vec2(7.5, 12.);
  float pe = min(3.75 - pf.x, 6. - pf.y), pw = max(fwidth(pe), 1e-3);     // metres from the nearest panel joint
  float groove = smoothstep(.16 + pw, .16 - pw, abs(pe - .55)) * min(1., .5 / pw);
  float bead = smoothstep(.10 + pw, .10 - pw, abs(pe - .95)) * min(1., .3 / pw);
  float pnl = mix(1., (1. - .55 * groove) * (1. + .5 * bead) * mix(.86, 1.06, smoothstep(.5, 1.6, pe)), inK);
  vec3 dark = (uDarkCol * mix(1.25, 1.15, inK) + alb * mix(.07, .05, inK)) * (.75 + mix(9., 7.5, inK) * bn) * (.9 + .2 * fig * (1. - .7 * inK)) * pnl + uSlate * bn * .22 * (1. - .5 * inK);
  col = mix(col, dark, ins);
  gl_FragColor = vec4(col * uDim, 1.);
  #include <fog_fragment>
}`,We=`
attribute float aKind;
uniform float uPx;
varying vec3 vW, vN, vH, vC, vGc; varying vec2 vUv; varying float vKind;
${Te}
void main(){
  vec3 pos = position;
  vGc = vec3((uHeroInv * modelMatrix[3]).xy, (aKind - 3.) * 100.);   // a wheel's centre (hero space) and radius
  vGc.y = abs(vGc.y);
  if (aKind > 1.5 && aKind < 2.5) {                                         // the rod never falls under ~2 pixels wide
    float dist = length((modelViewMatrix * vec4(0., position.y, 0., 1.)).xyz);
    pos.x *= max(1., uPx * dist * 2. / 1.2);
  }
  vec4 wp = modelMatrix * vec4(pos, 1.);
  vW = wp.xyz; vH = (uHeroInv * wp).xyz; vH.y = abs(vH.y); vUv = uv; vKind = aKind; vC = color;
  vN = normalize(mat3(modelMatrix) * normal);
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Je=`
uniform float uPatina; uniform vec3 uPatinaCol;
varying vec3 vW, vN, vH, vC, vGc; varying vec2 vUv; varying float vKind;
${Ce}
void main(){
  vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vW);
  N.y *= uMirror; V.y *= uMirror;                             // a mirrored copy is lit like the original
  vec3 nH = normalize(mat3(uHeroInv) * N);
  vec3 tint = vC;
  float rough = .42;
  // brushed satin: fine streaks, a little cloudiness, optional verdigris in the hollows
  vec2 suv = vKind > 2.5 ? vec2(length(vUv) * .25, atan(vUv.y, vUv.x + 1e-5) * .12) : vUv;   // wheels are brushed in circles
  float streak = vn(vec2(suv.x * 3., suv.y * 90.)) * .5 + vn(suv * vec2(40., 4.)) * .5;
  float cloud = fbm(vH.xy * .22 + vH.z * .17);
  tint *= (.86 + .2 * streak) * (.8 + .32 * cloud);
  float pat = uPatina * smoothstep(.5, .8, cloud + streak * .2) * (abs(vKind - 1.) < .5 ? .3 : 1.);
  tint = mix(tint, uPatinaCol, pat); rough = mix(rough, .9, pat);
  float eng = 0.;
  if (vKind > .5 && vKind < 1.5) {                           // scale plate: tick marks only, long every 4 m
    float y = vUv.y, x = vUv.x;
    float wy = max(fwidth(y), 1e-4);
    float fy = abs(fract(y + .5) - .5);
    float f4 = abs(fract(y * .25 + .5) - .5) * 4.;
    float shortT = smoothstep(.07 + wy, .07 - wy, fy) * step(abs(x), .5) * step(.18, abs(x)) * step(x, 0.);
    float longT = smoothstep(.11 + wy, .11 - wy, f4) * step(abs(x), .78);
    float rule = smoothstep(.03 + wy, .03 - wy, abs(abs(x) - .9));
    eng = clamp(max(max(shortT, longT), rule) * min(1., .14 / wy), 0., 1.);
    rough = .3;
  }
  if (vKind > 1.5 && vKind < 2.5) {                           // the rod: tempo notches every 2 m above the pivot
    float y = vUv.y * 10.;
    float wy = max(fwidth(y), 1e-4);
    float f2 = abs(fract(y * .5 + .5) - .5) * 2.;
    eng = smoothstep(.09 + wy, .09 - wy, f2) * min(1., .18 / wy) * step(43., y) * step(vUv.x, .3) * .8;
    rough = .3;
  }
  vec3 R = reflect(-V, N);
  vec3 L = uSunDir;
  vec3 Hh = L + V; Hh = dot(Hh, Hh) > 1e-6 ? normalize(Hh) : N;
  float ndl = dot(N, L);
  float fr = pow(1. - clamp(dot(N, V), 0., 1.), 5.);
  vec3 env = mix(skyCol(R, rough), skyCol(N, 1.), .22);
  vec3 warm = mix(tint, tint * tint * 1.7, .4);
  vec3 col = warm * env * (.95 + streak * .2) + tint * tint * uSunCol * smoothstep(-.1, 1., ndl) * .5;
  col += mix(tint, vec3(1.), .25) * uSunCol * pow(max(dot(N, Hh), 0.), mix(90., 12., rough)) * mix(2.2, .5, rough) * step(0., ndl);
  col += skyCol(R, .1) * fr * .25;
  float ins = insideCase(vH);
  vec3 rHh = reflect(-normalize(mat3(uHeroInv) * V), nH);
  vec3 dark = tint * (bounce(nH, vH) * (1.5 + 2. * fr) + bounce(rHh, vH) * 1.5) + uDarkCol * .1;
  // in the works the only light is silver off the water, coming in low through the opening (+Z in hero space)
  // antique metal in the works: about half the tone of the polished bob, a little greyed
  vec3 ant = mix(tint, vec3(dot(tint, vec3(.3, .55, .15))), .22) * .62;
  if (vKind > 2.5) {                                          // a wheel: lit as a wheel, the light fixed while it turns
    float Rw = max(vGc.z, 1.);
    vec2 q = (vH.xy - vGc.xy) / Rw;
    float rl = length(vUv) / Rw, la = atan(vUv.y, vUv.x + 1e-5), aw = atan(q.y, q.x + 1e-5);
    float az = abs(nH.z);
    float face = smoothstep(.80, .95, az);                     // 1 on the two faces
    float chamf = smoothstep(.45, .62, az) * (1. - smoothstep(.78, .93, az));   // chamfers and beads: one bright line each
    float grad = (1. - smoothstep(-1., .75, q.y));                    // dark above, lit from the water below
    float cool = (1. - smoothstep(-.85, -.25, q.y));                  // the lower third washed cool silver
    float brush = .82 + .36 * vn(vec2(la * 9., rl * 6.));      // the turned finish goes round with the wheel
    float bw = abs(cos(aw - .55)); bw *= bw; bw *= bw;         // a bow-tie sheen that stays put as the brushing turns under it
    vec3 g = ant * uHor * (.09 + .50 * grad) * brush;
    g += ant * uHor * .50 * bw * bw * brush * smoothstep(.22, .5, rl) * (.3 + .7 * grad);
    // edges (tooth flanks and lands, rim wall, spoke sides): bright only where they look down at the water
    vec3 edge = ant * uHor * (.06 + .95 * (1. - smoothstep(-.85, .25, nH.y)) * (.45 + .55 * grad));
    g = mix(edge, g, face);
    g += mix(ant, uHor, .35) * uHor * (.85 * chamf * (.35 + .65 * grad) + .55 * face * smoothstep(.955, .985, rl));   // chamfer lines; the tooth tips
    g = mix(g, g * .55 + uHor * vec3(.72, .88, 1.) * .13, cool * (.55 + .45 * face));
    g *= mix(.34, 1., smoothstep(.15, .27, rl));               // the hub sits in a darker recess
    g += mix(ant, uHor, .5) * .42 * (1. - smoothstep(.05, .085, rl)) * face;   // with a bright boss
    dark = g + uDarkCol * .04;
  } else {
    float chamf = smoothstep(.42, .60, abs(nH.z)) * (1. - smoothstep(.80, .93, abs(nH.z))) * step(0., nH.z);
    vec3 dk = ant * (bounce(nH, vH) * (1.5 + 2. * fr) + bounce(rHh, vH) * 1.5) + uDarkCol * .1;
    dk = mix(dk, dark, abs(vKind - 1.) < .5 ? 1. : 0.);                          // the scale plate keeps its polish
    dark = dk * mix(.55, 1.05, (1. - smoothstep(2., 58., vH.y))) * (abs(vKind - 1.) < .5 ? 1.35 : .56) + mix(ant, uHor, .3) * uHor * .62 * chamf;
  }
  col = mix(col, dark, ins);
  col = mix(col, col * .14, eng);
  gl_FragColor = vec4(col * uDim, 1.);
  #include <fog_fragment>
}`,et=`
uniform float uT, uLock, uLineSpacing, uLineSpeed, uFogK, uMag;
uniform vec3 uWood;
varying vec3 vW, vN, vH, vC; varying vec2 vUv; varying float vKind;
${Ce}
vec3 marsh(vec3 ro, vec3 rd){
  float t = (ro.y - uWaterY) / max(-rd.y, 2e-3);
  vec2 P = ro.xz + rd.xz * t * uMag;          // the marsh is drawn magnified so its lines stay readable in the bob
  vec2 fw = fwidth(P);
  float foot = clamp((fw.x + fw.y) * .5, 0., 400.);
  vec3 water = skyCol(vec3(rd.x, -rd.y, rd.z), .12) * .82;
  float tuss = smoothstep(.38, .62, fbm(P * .028 + 3.));
  float lead = smoothstep(.3, .5, vn(P * .21));
  // the reed bed: lace from above, a solid dark comb at grazing angles, parted by the avenue that runs up to the case
  vec3 hp = (uHeroInv * vec4(ro.x + rd.x * t, uWaterY, ro.z + rd.z * t, 1.)).xyz;
  float avenue = (1. - smoothstep(7.5, 10., abs(hp.x)));
  float bed = mix(.6 + .4 * tuss, 1., (1. - smoothstep(.08, .5, -rd.y)) * .9) * mix(.45 + .55 * lead, 1., clamp(foot * .25, 0., 1.));
  float nap = bed * (1. - avenue);
  float zc = dot(P, uDownwind) + 30. * vn(P / 200.);
  float ph = uT * uLineSpeed / uLineSpacing - zc / uLineSpacing;
  float lineS = sin(6.2831853 * ph);
  vec2 cell = floor(P / 2.5);
  float own = sin(6.2831853 * ((.42 + .16 * h21(cell)) * uT + h21(cell + 17.3)));
  float lulls = smoothstep(.55, .8, vn(P / 110. - uT * .1 * uDownwind));
  float C = clamp(uLock - .6 * lulls * uLock, 0., 1.);
  float s = mix(own, lineS, C);
  float g = smoothstep(.72, .97, s);
  float lw = fwidth(ph);
  g = mix(g, .1, clamp(max(smoothstep(.3, .8, lw), foot * .3 * (1. - C)), 0., 1.));
  water *= 1. - .3 * C * (.5 + .5 * lineS) * (1. - smoothstep(.3, .8, lw));
  vec3 reed = uSlate * (.2 + .16 * vn(P * .5));
  vec3 col = mix(water, reed, nap * .92);
  col += vec3(1., .7, .26) * uSunCol * g * (.2 + .8 * nap) * 3.4;
  return mix(uHor * .8, col, exp(-t * uFogK));
}
void main(){
  vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vW);
  N.y *= uMirror; V.y *= uMirror;                             // a mirrored copy is lit like the original
  vec3 R = reflect(-V, N);
  vec3 env = R.y > 0. ? skyCol(R, .015) : vec3(0.);
  vec3 m = marsh(vec3(vW.x, uWaterY + abs(vW.y - uWaterY), vW.z), vec3(R.x, min(R.y, -2e-3), R.z));
  env = mix(m, skyCol(vec3(R.x, max(R.y, 0.), R.z), .015), smoothstep(-.012, .012, R.y));
  // the case behind the swing plane, as a dark trapezoid with its darker recess
  vec3 rh = mat3(uHeroInv) * R;
  if (rh.z < -.02) {
    float tz = (vH.z - 22.) / (-rh.z);
    vec3 q = vH + rh * tz;
    tz = (vH.z - hwB(q.y)) / (-rh.z); q = vH + rh * tz;
    float hw = hwB(q.y);
    float inC = smoothstep(.0, 1.2, hw - abs(q.x)) * smoothstep(4.2, 5., q.y) * (1. - smoothstep(139., 141., q.y));
    float oh = mix(20., 5., clamp((q.y - 4.4) / 118., 0., 1.));
    float inO = smoothstep(.0, .8, oh - abs(q.x)) * (1. - smoothstep(121.8, 122.6, q.y));
    float rib = vn(vec2(q.x * .42, q.y * .0105));
    vec3 cc = mix(uWood * (.5 + .5 * rib) * (uZen * .7 + uSunCol * .25) + skyCol(reflect(rh, vec3(0., .17, .985)), .3) * .12,
                  uDarkCol * (.5 + .7 * (1. - smoothstep(5., 60., q.y))), inO);
    env = mix(env, cc, inC * step(0., tz));
  }
  float ndv = clamp(dot(N, V), 0., 1.);
  float fr = pow(1. - ndv, 4.);
  vec3 tint = mix(vC, vec3(1., .93, .8), .12 + fr * .6);
  // faint lathe rings and a satin breath so it is polished metal, not a mirror ball
  float ring = .98 + .02 * sin(vUv.y * 260.) * (1. - clamp(fwidth(vUv.y) * 90., 0., 1.));
  vec3 col = tint * env * ring * 1.15 + vC * skyCol(N, 1.) * .06;
  float ins = insideCase(vH) * .55;
  col = mix(col, col * .45 + tint * bounce(normalize(mat3(uHeroInv) * N), vH) * 1.2, ins);
  gl_FragColor = vec4(col * uDim, 1.);
  #include <fog_fragment>
}`,tt=`
attribute vec3 aPos; attribute float aSize, aGain;
uniform float uPx;                         // world metres per pixel at 1 m (2 tan(fov/2) / viewport height)
varying vec2 vQ; varying float vI;
${Te}
void main(){
  vec4 mvPosition = modelViewMatrix * vec4(aPos, 1.);
  float dist = max(-mvPosition.z, .1);
  float size = max(aSize, uPx * dist * 5.);
  vI = aGain * (aSize * aSize) / (size * size) * step(.001, aGain);
  mvPosition.xy += position.xy * size;
  vQ = position.xy;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ot=`
uniform vec3 uGlintCol;
varying vec2 vQ; varying float vI;
${Ce}
void main(){
  float r = length(vQ);
  float core = exp(-r * r * 22.);
  float halo = exp(-r * 4.2) * .16;
  float star = (exp(-abs(vQ.x) * 30.) * exp(-abs(vQ.y) * 3.2) + exp(-abs(vQ.y) * 30.) * exp(-abs(vQ.x) * 3.2)) * .5;
  float a = (core + halo + star) * (1. - smoothstep(.7, 1., r));
  vec3 col = uGlintCol * a * vI;
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      col *= 1. - clamp(1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth), 0., 1.) * .8;
    #else
      col *= 1. - smoothstep(fogNear, fogFar, vFogDepth) * .8;
    #endif
  #endif
  gl_FragColor = vec4(col, 1.);
}`;function b(r,o,a=0,f=null){let t=r.index?r.toNonIndexed():r;t!==r&&r.dispose(),f&&t.applyMatrix4(f);const i=t.attributes.position.count;t.attributes.uv||t.setAttribute("uv",new e.BufferAttribute(new Float32Array(i*2),2));const n=new Float32Array(i*3),v=new Float32Array(i).fill(a);for(let h=0;h<i;h++)n[h*3]=o.r,n[h*3+1]=o.g,n[h*3+2]=o.b;t.setAttribute("color",new e.BufferAttribute(n,3)),t.setAttribute("aKind",new e.BufferAttribute(v,1));for(const h of Object.keys(t.attributes))["position","normal","uv","color","aKind"].includes(h)||t.deleteAttribute(h);return t}const Mt=new e.Matrix4,nt=new e.Quaternion,at=new e.Euler,rt=new e.Vector3,st=new e.Vector3;function S(r,o,a,f=0,t=0,i=0,n=1,v=n,h=n){return new e.Matrix4().compose(st.set(r,o,a),nt.setFromEuler(at.set(f,t,i)),rt.set(n,v,h))}function ce(r){const o=Ze(r,!1);for(const a of r)a.dispose();return o}function Z(r,o,a,f,t=r,i=o){const n=(l,s)=>{const p=l/2,u=s/2,d=Math.min(f,p*.45,u*.45);return[[-p+d,-u],[p-d,-u],[p,-u+d],[p,u-d],[p-d,u],[-p+d,u],[-p,u-d],[-p,-u+d]]},v=n(r,o),h=n(t,i),z=[],A=[],k=(l,s,p,u)=>{z.push(l[0],s,l[1]),A.push(p,u)};for(let l=0;l<8;l++){const s=(l+1)%8;k(v[s],0,s/8,0),k(v[l],0,l/8,0),k(h[l],a,l/8,a*.1),k(v[s],0,s/8,0),k(h[l],a,l/8,a*.1),k(h[s],a,s/8,a*.1)}for(let l=1;l<7;l++)k(v[0],0,0,0),k(v[l],0,0,0),k(v[l+1],0,0,0),k(h[0],a,0,0),k(h[l+1],a,0,0),k(h[l],a,0,0);const P=new e.BufferGeometry;return P.setAttribute("position",new e.BufferAttribute(new Float32Array(z),3)),P.setAttribute("uv",new e.BufferAttribute(new Float32Array(A),2)),P.computeVertexNormals(),P}class it{constructor(){this.pos=[],this.nor=[],this.uv=[],this.kind=[]}quad(o,a,f,t,i,n){const v=a[0]-o[0],h=a[1]-o[1],z=a[2]-o[2],A=t[0]-o[0],k=t[1]-o[1],P=t[2]-o[2];let l=h*P-z*k,s=z*A-v*P,p=v*k-h*A;const u=Math.hypot(l,s,p)||1;l/=u,s/=u,p/=u;let d=[o,a,f,o,f,t];l*i[0]+s*i[1]+p*i[2]<0&&(d=[o,f,a,o,t,f],l=-l,s=-s,p=-p);for(const g of d)this.pos.push(g[0],g[1],g[2]),this.nor.push(l,s,p),this.uv.push(g[3],g[4]),this.kind.push(n)}build(){const o=new e.BufferGeometry;return o.setAttribute("position",new e.BufferAttribute(new Float32Array(this.pos),3)),o.setAttribute("normal",new e.BufferAttribute(new Float32Array(this.nor),3)),o.setAttribute("uv",new e.BufferAttribute(new Float32Array(this.uv),2)),o.setAttribute("aKind",new e.BufferAttribute(new Float32Array(this.kind),1)),o}}function lt(r,o,a,f){const t=P=>new e.Color(P),i=new e.Vector3().fromArray(a.sunDir||[-.975,.21,.07]).normalize(),n={uZen:{value:t(r[1])},uHor:{value:t(r[0])},uSlate:{value:t(r[2])},uDarkCol:{value:t(r[6])},uSunCol:{value:t("#FFF0D2")},uSunDir:{value:i},uHeroInv:{value:new e.Matrix4},uWood:{value:o.wood},uWoodHi:{value:o.woodHi},uInlay:{value:o.metal},uSeed:{value:f.range(0,40)},uPatina:{value:o.patina},uPatinaCol:{value:t("#5FAE9A")},uT:{value:0},uLock:{value:1},uWaterY:{value:0},uMirror:{value:1},uDim:{value:1},uFogK:{value:.0011},uLineSpacing:{value:a.lineSpacing||120},uLineSpeed:{value:a.lineSpeed||60},uDownwind:{value:new e.Vector2().fromArray(a.downwind||[0,1]).normalize()},uPx:{value:.002},uMag:{value:a.bobMagnify||6},uGlintCol:{value:t(r[5]).lerp(o.metal,.35)}},v=(P,l,s,p={})=>{const u=e.UniformsUtils.clone(e.UniformsLib.fog);for(const d of["uZen","uHor","uSlate","uDarkCol","uSunCol","uSunDir","uHeroInv","uDownwind","uMirror","uDim","uWaterY",...s])u[d]=n[d];return new e.ShaderMaterial({uniforms:u,fog:!0,vertexShader:_e+P,fragmentShader:_e+l,...p})},h=v(Xe,$e,["uWood","uWoodHi","uInlay","uSeed"],{side:e.DoubleSide}),z=v(We,Je,["uPatina","uPatinaCol","uPx"],{vertexColors:!0}),A=v(We,et,["uT","uLock","uFogK","uLineSpacing","uLineSpeed","uWood","uMag","uPx"],{vertexColors:!0}),k=v(tt,ot,["uPx","uGlintCol"],{transparent:!0,depthWrite:!1,blending:e.AdditiveBlending});return{U:n,wood:h,metal:z,bob:A,glint:k}}const $=3.2;function ut(r){const o=[[4.4,1.7],[5.9,1.7],[6.3,1.35],[7,1.3],[7.5,1],[8.1,.55],[8.8,.3],[9.3,.3],[9.6,0]],a=[[131.4,0],[131.9,.35],[132.5,.4],[133.1,.8],[133.9,1.25],[134.5,1.7],[136.2,1.7],[136.6,1.3],[137.4,1.1],[138.2,.3],[139,-.9],[140,-3.2]],f=[];for(const[t,i]of o)f.push({y:t,hw:B(t)+i*r,kind:1});for(const t of[40,80,R])f.push({y:t,hw:B(t),kind:0});for(const[t,i]of a)f.push({y:t,hw:B(t)+(i>0?i*r:i),kind:1});f[8].kind=0;for(let t=9;t<12;t++)f[t].kind=0;return f}function ct(r){const o=new it,a=ut(r),f=[[0,0,1],[1,0,0],[0,0,-1],[-1,0,0]],t=(l,s,p,u,d=s,g=p)=>[l[0]*u+l[2]*s,p,l[2]*u-l[0]*s,d,g];for(let l=0;l<4;l++){const s=f[l];for(let F=0;F<a.length-1;F++){const w=a[F],C=a[F+1],j=w.kind===0?l===0?3:0:1,O=[s[0],(w.hw-C.hw)/Math.max(C.y-w.y,.01)*.5+.02,s[2]];if(l===0&&w.y<R-.01){const M=ae(w.y),m=ae(C.y);o.quad(t(s,-w.hw,w.y,w.hw),t(s,-M,w.y,w.hw),t(s,-m,C.y,C.hw),t(s,-C.hw,C.y,C.hw),O,j),o.quad(t(s,M,w.y,w.hw),t(s,w.hw,w.y,w.hw),t(s,C.hw,C.y,C.hw),t(s,m,C.y,C.hw),O,j);for(const y of[-1,1])o.quad([y*M,w.y,w.hw,w.hw*.3,w.y],[y*M,w.y,B(w.y)-$,w.hw*.3+3.4,w.y],[y*m,C.y,B(C.y)-$,C.hw*.3+3.4,C.y],[y*m,C.y,C.hw,C.hw*.3,C.y],[-y,0,0],1)}else o.quad(t(s,-w.hw,w.y,w.hw),t(s,w.hw,w.y,w.hw),t(s,C.hw,C.y,C.hw),t(s,-C.hw,C.y,C.hw),O,j)}const p=l===0?$:ve,u=ue,d=ne,g=B(u)-p,H=B(d)-p,L=B(u)-ve,V=B(d)-ve,x=a[0].hw;if(l===0){const F=ae(u),w=ae(d);o.quad(t(s,-L,u,g),t(s,-F,u,g),t(s,-w,d,H),t(s,-V,d,H),[0,0,-1],2),o.quad(t(s,F,u,g),t(s,L,u,g),t(s,V,d,H),t(s,w,d,H),[0,0,-1],2),o.quad(t(s,-x,u,x),t(s,-F,u,x),t(s,-F,u,g),t(s,-x,u,g),[0,-1,0],1),o.quad(t(s,F,u,x),t(s,x,u,x),t(s,x,u,g),t(s,F,u,g),[0,-1,0],1)}else o.quad(t(s,-L,u,g),t(s,L,u,g),t(s,V,d,H),t(s,-V,d,H),[-s[0],0,-s[2]],2),o.quad(t(s,-x,u,x),t(s,x,u,x),t(s,g,u,g),t(s,-g,u,g),[0,-1,0],1)}const i=a[a.length-1],n=B(ne)-ve;o.quad([-i.hw,i.y,i.hw,-i.hw,0],[i.hw,i.y,i.hw,i.hw,0],[i.hw,i.y,-i.hw,i.hw,9],[-i.hw,i.y,-i.hw,-i.hw,9],[0,1,0],1),o.quad([-n,ne,n,0,0],[n,ne,n,40,0],[n,ne,-n,40,40],[-n,ne,-n,0,40],[0,-1,0],2);const v=B(R),h=ae(R);o.quad([-h,R,v,0,0],[h,R,v,10,0],[h,R,v-$,10,3],[-h,R,v-$,0,3],[0,-1,0],1);const z=54,A=4;for(let l=0;l<A;l++){const s=te(z,R,l/A),p=te(z,R,(l+1)/A),u=B(s)-$,d=B(p)-$,g=ae(s)+.2,H=ae(p)+.2;o.quad([-g,s,u,-g,s],[g,s,u,g,s],[H,p,d,H,p],[-H,p,d,-H,p],[0,0,1],2)}const k=B(z)-$,P=ae(z)+.2;return o.quad([-P,z,k,-P,0],[P,z,k,P,0],[n,ne,k-9,n,12],[-n,ne,k-9,-n,12],[0,-1,.3],2),o.build()}async function ht(r,{R:o,teeth:a,toothH:f,escape:t=!1,spokes:i=5,hubR:n,rimW:v,depth:h,spokeW:z,color:A,hubColor:k}){const P=o-f,l=P-v,s=h/2,p=[],u=t?[[0,0],[.06,.25],[.72,1],[.8,1],[.86,0]]:[[0,0],[.16,1],[.46,1],[.62,0]],d=(M,m,y)=>p.push(M[0],M[1],M[2],m[0],m[1],m[2],y[0],y[1],y[2]),g=(M,m,y,D)=>{d(M,m,y),d(M,y,D)},H=(M,m,y)=>[Math.cos(M)*m,Math.sin(M)*m,y];for(let M=0;M<a;M++){const m=M/a*Math.PI*2,y=(M+1)/a*Math.PI*2,D=u.map(([T,Q])=>[(M+T)/a*Math.PI*2,P+f*Q]);D.push([y,P]);for(const T of[s,-s]){const Q=H(m,l,T),re=H(y,l,T);for(let J=0;J<D.length-1;J++){const ee=H(D[J][0],D[J][1],T),de=H(D[J+1][0],D[J+1][1],T);T>0?d(Q,ee,de):d(Q,de,ee)}const me=H(y,P,T);T>0?d(Q,me,re):d(Q,re,me)}for(let T=0;T<D.length-1;T++)g(H(D[T][0],D[T][1],-s),H(D[T+1][0],D[T+1][1],-s),H(D[T+1][0],D[T+1][1],s),H(D[T][0],D[T][1],s));g(H(y,l,-s),H(m,l,-s),H(m,l,s),H(y,l,s))}const L=new e.BufferGeometry;L.setAttribute("position",new e.BufferAttribute(new Float32Array(p),3)),L.computeVertexNormals(),await r.yield();const V=Math.PI/2,x=[b(L,A)];for(let M=0;M<i;M++){const m=(M+.5)/i*Math.PI*2,y=l-n*.8+v*.3,D=Z(z,h*.7,y,Math.min(z,h*.7)*.26,z*.8);x.push(b(D,A,0,S(Math.cos(m)*n*.8,Math.sin(m)*n*.8,0,0,0,m-Math.PI/2)))}const F=[[0,0],[n*.92,0],[n*.95,h*.5],[n*.7,h*.62],[n*.66,h*.95],[n*.42,h*1.05],[n*.4,h*1.5],[0,h*1.5]].map(([M,m])=>new e.Vector2(M,m));x.push(b(new e.LatheGeometry(F,20),k,0,S(0,0,0,V,0,0))),x.push(b(new e.LatheGeometry(F,20),k,0,S(0,0,0,-V,0,0))),x.push(b(new e.BoxGeometry(n*.42,n*.42,h*3.5),k,0,S(0,0,0,0,0,.6)));for(const M of[-1,1])x.push(b(new e.TorusGeometry(P-v*.5,Math.min(.22,v*.22),5,48),k,0,S(0,0,M*h*.5)));await r.yield();const w=ce(x),C=w.attributes.position,j=w.attributes.uv,O=w.attributes.aKind;for(let M=0;M<C.count;M++)j.setXY(M,C.getX(M),C.getY(M)),O.setX(M,3+o/100);return w}async function ft(r,o,a,f,t){const i=[],n=o.metal,v=o.metalDeep,h=Math.PI/2,z=[];for(let m=0;m<=14;m++){const y=te(-Math.PI/2,.87,m/14);z.push(new e.Vector2(Math.cos(y)*2.5,2+Math.sin(y)*2.5))}z.push(new e.Vector2(1.35,4),new e.Vector2(1.9,4.08),new e.Vector2(2,4.25),new e.Vector2(0,4.25));const A=[];for(const m of[-1,1])for(const y of[-1,1])i.push(b(new e.LatheGeometry(z,28),n,0,S(m*28,0,y*28))),i.push(b(Z(7.4,7.4,.42,.12),v,0,S(m*28.6,4.12,y*28.6))),A.push(new e.Vector3(m*28,4.6,y*28)),await r.yield();await r.yield();const k=[U-3.4,7.5],P=oe+1.2,l=13,s=Math.hypot(l,P+.4),p=Math.atan2(l,P+.4);for(const m of k){for(const T of[-1,1])i.push(b(Z(1.7,1.1,s,.22,1.2,.9),n,0,S(T*l,-.4,m,0,0,T*p))),i.push(b(new e.CylinderGeometry(1.5,2.1,.9,16),v,0,S(T*l,.25,m))),i.push(b(new e.CylinderGeometry(.34,.34,1.5,10),v,0,S(T*l*(1-30.4/(P+.4)),30,m,h,0,0)));const y=l*(1-30.4/(P+.4));i.push(b(Z(1,.8,y*2,.16),n,0,S(y,30,m,0,0,Math.PI/2)));const D=[[0,-.9],[2.4,-.9],[2.6,-.6],[2.6,.6],[1.5,.9],[1.4,1.3],[0,1.3]].map(([T,Q])=>new e.Vector2(T,Q));i.push(b(new e.LatheGeometry(D,24),n,0,S(0,oe,m,h,0,0)))}i.push(b(new e.CylinderGeometry(.75,.75,U+3.2-5.5,16),o.steel,0,S(0,oe,(U+3.2+5.5)/2,h,0,0))),await r.yield();const u=56,d=120,g=B(u)-$+.25,H=B(d)-$+.25,L=5,V=4.4,x=new e.BufferGeometry;x.setAttribute("position",new e.BufferAttribute(new Float32Array([-L,u,g,L,u,g,V,d,H,-L,u,g,V,d,H,-V,d,H]),3)),x.setAttribute("uv",new e.BufferAttribute(new Float32Array([-1,u,1,u,1,d,-1,u,1,d,-1,d]),2)),x.computeVertexNormals(),i.push(b(x,n,1));const F=Math.atan2(g-H,d-u),w=Math.hypot(d-u,g-H);for(const m of[-1,1])i.push(b(Z(.5,.5,w,.12),v,0,S(m*(L+.1),u,g+.1,-F,0,m*Math.atan2(L-V,w))));i.push(b(Z(.6,.6,L*2+.8,.12),v,0,S(L+.4,u-.2,g+.1,0,0,Math.PI/2))),i.push(b(Z(.6,.6,V*2+.8,.12),v,0,S(V+.4,d+.2,H+.1,0,0,Math.PI/2))),await r.yield();const C=t===0?[[0,0],[2.6,0],[2.6,.3],[1.2,.5],[.7,1],[.9,1.3],[1.6,1.9],[1.75,2.7],[1.4,3.5],[.6,3.95],[.25,4.3],[0,4.9]]:t===1?[[0,0],[2.4,0],[2.4,.35],[1,.6],[.8,1.2],[1.7,1.5],[1.9,2.4],[1.7,2.6],[1.5,3.6],[.9,4.6],[.3,5.2],[0,5.9]]:[[0,0],[2.6,0],[2.6,.3],[1.3,.55],[.6,1.1],[.6,1.9],[0,2]];i.push(b(new e.LatheGeometry(C.map(([m,y])=>new e.Vector2(m,y)),24),n,0,S(0,ze,0))),t===2&&i.push(b(new e.TorusGeometry(1.8,.42,10,28),n,0,S(0,ze+3.6,0,0,Math.PI/2,0))),await r.yield();const j=f*(B(38)+.05),O=Math.atan2(24,135.6)*f,M=[[0,0],[2.6,0],[2.6,.25],[2.2,.5],[1.3,.6],[1.2,1.1],[0,1.1]].map(([m,y])=>new e.Vector2(m,y));i.push(b(new e.LatheGeometry(M,24),n,0,S(j,38,0,0,0,-f*Math.PI/2+O)));for(const m of a){const y=-(B(m.y)-ve);i.push(b(new e.CylinderGeometry(.45,.45,m.z-y,10),o.steel,0,S(m.x,m.y,(m.z+y)/2,h,0,0))),i.push(b(new e.CylinderGeometry(1.5,1.9,.5,14),v,0,S(m.x,m.y,y+.25,h,0,0)))}return await r.yield(),{geometry:ce(i),feet:A}}function vt(r){const o=new e.Shape;o.moveTo(.55,2.2),o.bezierCurveTo(2.2,1.2,6.4,1.6,6,4.6),o.bezierCurveTo(5.8,7.6,2.6,7.9,.55,5.4),o.lineTo(-.55,5.4),o.bezierCurveTo(-2.6,7.9,-5.8,7.6,-6,4.6),o.bezierCurveTo(-6.4,1.6,-2.2,1.2,-.55,2.2),o.closePath();for(const t of[-1,1]){const i=new e.Path;i.moveTo(t*1.7,3.3),i.bezierCurveTo(t*2.8,2.5,t*5,2.7,t*4.8,4.6),i.bezierCurveTo(t*4.6,6.3,t*3,6.4,t*1.7,5),i.closePath(),o.holes.push(i)}const a=new e.ExtrudeGeometry(o,{depth:.7,bevelEnabled:!0,bevelThickness:.22,bevelSize:.22,bevelSegments:2,curveSegments:10});a.translate(0,0,-.35);const f=[[0,0],[.75,0],[.75,1.6],[1.05,1.75],[1.05,2.1],[.8,2.3],[.8,5.6],[.55,5.9],[0,5.95]].map(([t,i])=>new e.Vector2(t,i));return ce([b(a,r.metal),b(new e.LatheGeometry(f,16),r.metalDeep)])}function mt(r,o,a){const f=[],t=r.steel,i=r.metal,n=r.metalDeep,v=Math.PI/2;f.push(b(Z(1.2,.5,128,.16),t,2,S(0,-41.5,0))),f.push(b(Z(1.2,.5,1.5,.16,.25,.25),t,0,S(0,86.5,0)));const h=[[0,-.5],[2.3,-.5],[2.5,-.3],[2.5,.3],[1.5,.55],[1.35,.9],[.9,1],[.8,1.5],[0,1.6]].map(([p,u])=>new e.Vector2(p,u));f.push(b(new e.LatheGeometry(h,24),i,0,S(0,0,0,v,0,0)));const z=new e.Shape,A=1.7,k=a/2;z.moveTo(-A,0),z.lineTo(A,0),z.lineTo(k,8),z.lineTo(-k,8),z.closePath();const P=new e.ExtrudeGeometry(z,{depth:1.5,bevelEnabled:!0,bevelThickness:.3,bevelSize:.3,bevelSegments:2});P.translate(0,o,-.75),f.push(b(P,i)),f.push(b(new e.CylinderGeometry(.55,.7,.9,14),n,0,S(0,o+5.6,1.4,v,0,0))),f.push(b(Z(.5,.2,5.5,.06),t,0,S(0,o+.6,1.15)));const l=[new e.Vector2(0,-41.4)];for(let p=0;p<=52;p++)l.push(new e.Vector2(p%2?.9:.72,-41.4+p*.26));l.push(new e.Vector2(0,-41.4+53*.26)),f.push(b(new e.LatheGeometry(l,14),n));const s=[[0,-42.6],[.5,-42.4],[.95,-41.9],[1,-41.5],[.7,-41.35],[0,-41.3]].map(([p,u])=>new e.Vector2(p,u));return f.push(b(new e.LatheGeometry(s,14),i)),ce(f)}function dt(r){const o=[],f=n=>{const v=Math.sin(n/22*Math.PI/2);return[4.3*v,.32+1.18*Math.pow(Math.max(1-v*v,0),.72)]};for(let n=0;n<=22;n++){const[v,h]=f(n);o.push(new e.Vector2(v,h))}for(let n=1;n<8;n++){const v=te(Math.PI/2,-Math.PI/2,n/8);o.push(new e.Vector2(4.3+Math.cos(v)*.24,Math.sin(v)*.32))}for(let n=22;n>=0;n--){const[v,h]=f(n);o.push(new e.Vector2(v,-h))}const t=new e.LatheGeometry(o.reverse(),72),i=[[0,1.45],[1.25,1.45],[1.35,1.6],[1.2,1.78],[.5,1.84],[.45,2.25],[.3,2.35],[0,2.36]].map(([n,v])=>new e.Vector2(n,v));return ce([b(t,r.metalBright,0,S(0,0,0,Math.PI/2,0,0)),b(new e.LatheGeometry(i,20),r.metal,0,S(0,0,0,Math.PI/2,0,0))])}function pt(r){const o=new e.Shape,a=40;for(let n=0;n<a;n++){const v=n/a*Math.PI*2,h=n%2?1:.9;(n?o.lineTo:o.moveTo).call(o,Math.cos(v)*h,Math.sin(v)*h)}o.closePath();const f=new e.ExtrudeGeometry(o,{depth:.8,bevelEnabled:!0,bevelThickness:.14,bevelSize:.08,bevelSegments:1}),t=[b(f,r.metal,0,S(0,-.4,0,-Math.PI/2,0,0))],i=[[0,-.75],[.8,-.75],[.86,-.6],[.8,-.5],[.8,.5],[.86,.6],[.8,.75],[0,.75]].map(([n,v])=>new e.Vector2(n,v));t.push(b(new e.LatheGeometry(i,20),r.metalDeep));for(let n=0;n<4;n++)t.push(b(new e.CylinderGeometry(.11,.13,.75,8),r.steel,0,S(Math.cos(n*Math.PI/2)*1.3,0,Math.sin(n*Math.PI/2)*1.3,0,-n*Math.PI/2,Math.PI/2)));return ce(t)}const He=5;function wt(){const r=new e.BufferGeometry,o=[],a=[];for(let f=0;f<He;f++)o.push(-1,-1,0,1,-1,0,1,1,0,-1,1,0),a.push(f*4,f*4+1,f*4+2,f*4,f*4+2,f*4+3);return r.setAttribute("position",new e.BufferAttribute(new Float32Array(o),3)),r.setAttribute("aPos",new e.BufferAttribute(new Float32Array(He*12),3).setUsage(e.DynamicDrawUsage)),r.setAttribute("aSize",new e.BufferAttribute(new Float32Array(He*4).fill(1),1).setUsage(e.DynamicDrawUsage)),r.setAttribute("aGain",new e.BufferAttribute(new Float32Array(He*4),1).setUsage(e.DynamicDrawUsage)),r.setIndex(a),r}function yt(r,o){const a=new e.Shape,f=7.3,t=8.5,i=.74,n=14;for(let h=0;h<=n;h++){const z=-Math.PI/2+te(-i,i,h/n);(h?a.lineTo:a.moveTo).call(a,Math.cos(z)*t,Math.sin(z)*t)}a.lineTo(Math.cos(-Math.PI/2+i)*(f-1.5)+.5,Math.sin(-Math.PI/2+i)*(f-1.5));for(let h=n;h>=0;h--){const z=-Math.PI/2+te(-i,i,h/n);a.lineTo(Math.cos(z)*f,Math.sin(z)*f)}a.lineTo(Math.cos(-Math.PI/2-i)*(f-1.5)-.5,Math.sin(-Math.PI/2-i)*(f-1.5)),a.closePath();const v=new e.ExtrudeGeometry(a,{depth:.7,bevelEnabled:!0,bevelThickness:.12,bevelSize:.12,bevelSegments:1});return v.translate(0,0,o-.35),[b(v,r.steel),b(Z(.8,.6,7.6,.12,1.5,.6),r.metalDeep,0,S(0,-7.6,o))]}const Ue={mahogany:r=>({wood:new e.Color(r[3]),woodHi:new e.Color(r[3]).lerp(new e.Color("#B9562A"),.42),metal:new e.Color(r[4]),metalDeep:new e.Color(r[4]).multiplyScalar(.72),metalBright:new e.Color(r[4]).lerp(new e.Color(r[5]),.3),steel:new e.Color("#8FA3AD"),patina:0}),ebony:()=>({wood:new e.Color("#141216"),woodHi:new e.Color("#54464C"),metal:new e.Color("#B4BABF"),metalDeep:new e.Color("#868F96"),metalBright:new e.Color("#D5DADD"),steel:new e.Color("#77858F"),patina:0}),pearwood:()=>({wood:new e.Color("#6A4324"),woodHi:new e.Color("#A87647"),metal:new e.Color("#B9703F"),metalDeep:new e.Color("#955331"),metalBright:new e.Color("#DA9A68"),steel:new e.Color("#8FA3AD"),patina:.45})};async function zt(r,o={}){const a=r.rng.fork?r.rng.fork("maelzel"):r.rng,f=o.palette&&o.palette.length>=7?o.palette:je,t=fe(o.detail??r.quality?.detail??1,.6,1),i=o.duration||46,n=o.keySide===1?1:-1,v=o.swingSign===-1?-1:1,h=a(),z=Ue[o.cabinet]?o.cabinet:h<.62?"mahogany":h<.81?"ebony":"pearwood",A=Ue[z](f),k=a.range(.85,1.3),P=a.int(0,2),l=a.range(50,68),s=a.range(4.6,5.8),p=t<.8?.75:1,u=a.chance(.5)?1:-1,d=[],g=(c,G,K,I,N,E,W,X=!1)=>{I=Math.min(I,B(G)-ve-Math.abs(c)-.8),d.push({x:c,y:G,z:K,r:I,teeth:Math.round(N*p),spokes:E,speed:W,escape:X})};g(-u*a.range(10,12.5),a.range(29,33),a.range(12.5,15.5),a.range(11.5,13),a.int(56,72),a.int(5,6),.11),g(u*a.range(11.5,14),a.range(24.5,28),a.range(1,4),a.range(9.6,11),a.int(44,56),a.int(4,6),-.15),g(u*a.range(3,8),a.range(43,46.5),-a.range(2,6),a.range(10,11.5),a.int(48,60),a.int(5,7),.07);const H=a.range(5.6,6.2),L=a.int(24,32);d.push({x:0,y:oe-4.1-H,z:18.3,r:H,teeth:L,spokes:4,speed:0,escape:!0});for(const c of[-1,1])d.push({x:c*19.2,y:9.4,z:-9.5,r:8.1,teeth:Math.round(34*p),spokes:5,speed:c*.2,escape:!1,low:!0});const V=lt(f,A,o,a),x=V.U,F=new e.Group;F.name="maelzel";const w=(c,G,K=F)=>{const I=new e.Mesh(c,G);return I.frustumCulled=!1,K.add(I),I};await r.yield(),w(ct(k),V.wood),await r.yield();const C=await ft(r,A,d,n,P);w(C.geometry,V.metal),await r.yield();const j=[];for(const c of d){const G=c.escape?c.r*.2:Math.min(1.1,c.r*6.5/c.teeth*.55),K=await ht(r,{R:c.r,teeth:c.teeth,toothH:G,escape:c.escape,spokes:c.spokes,hubR:c.r*(c.escape?.2:.16),rimW:c.r*.085,depth:c.escape?.7:1.3,spokeW:c.r*.11,color:c.escape?A.metalBright:A.metal,hubColor:A.metalDeep}),I=w(K,V.metal);I.position.set(c.x,c.y,c.z),j.push(I),await r.yield()}const O=new e.Quaternion().setFromEuler(new e.Euler(0,0,-n*Math.PI/2+Math.atan2(24,135.6)*n)),M=new e.Vector3(0,1,0).applyQuaternion(O),m=w(vt(A),V.metal);m.position.set(n*B(38),38,0).addScaledVector(M,.9),await r.yield();const y=new e.Group;y.position.set(0,oe,U),F.add(y);const D=mt(A,l,s);await r.yield(),w(ce([D,...yt(A,18.3-U)]),V.metal,y),await r.yield();const T=w(dt(A),V.bob,y);await r.yield();const Q=w(pt(A),V.metal,y),re=wt(),me=w(re,V.glint);me.renderOrder=5,await r.yield();const J=[];let ee=null;if(o.reflection){const c=typeof o.reflection=="number"?o.reflection:.6,G=new Map,K=N=>{if(!G.has(N)){const E=N.clone();for(const W of Object.keys(E.uniforms))x[W]&&(E.uniforms[W]=x[W]);E.uniforms.uMirror={value:-1},E.uniforms.uDim={value:c},G.set(N,E)}return G.get(N)};ee=new e.Group,ee.name="maelzel-reflection",ee.scale.y=-1;const I=(N,E)=>{for(const W of N.children){if(W===me)continue;const X=W.isMesh?new e.Mesh(W.geometry,K(W.material)):new e.Group;X.frustumCulled=!1,X.position.copy(W.position),X.quaternion.copy(W.quaternion),E.add(X),J.push([W,X]),I(W,X)}};I(F,ee),F.add(ee),await r.yield()}const de=28*Math.PI/180;let Y=0,pe=-1;const be=c=>Math.floor(c)+ge(0,.14,c-Math.floor(c)),Ge=c=>{const G=(c-Math.floor(c))*2;return ge(0,.12,G)*(1-ge(.12,.55,G))},ke=o.beat||2,Pe=c=>v*de*Math.sin(Math.PI*2*(c-43.8)/(2*ke)),Ae=x.uHeroInv.value,xe=new e.Vector3,he=new e.Vector3,we=new e.Vector3,q=new e.Vector3,se=new e.Vector3,Ee=new e.Matrix3,Ie=new e.Vector2,gt=new e.Vector3(0,0,1),Re=new e.Quaternion,Fe=new e.Vector3(0,1,0),Ve=re.attributes.aPos,De=re.attributes.aSize,Ne=re.attributes.aGain,ye=(c,G,K,I)=>{for(let N=0;N<4;N++)Ve.setXYZ(c*4+N,G.x,G.y,G.z),De.setX(c*4+N,K),Ne.setX(c*4+N,I)},Me=(c,G,K,I,N)=>N.set(c*Math.cos(I)+G*Math.sin(I),oe-c*Math.sin(I)+G*Math.cos(I),U+K),Be=()=>pe>=0?3*fe(pe,0,1):1.5-1.5*Math.cos(Y*.07);function Ke(c,G,K){pe<0&&(Y=G),F.updateWorldMatrix(!0,!1),Ae.copy(F.matrixWorld).invert(),x.uT.value=Y;const I=Pe(Y),N=(Y-43.8-ke/2)/ke,E=Be();y.rotation.z=-I,T.position.y=-35+E,Q.position.y=-40.45+E,Q.rotation.y=be(N)*Math.PI*2/10;for(let ie=0;ie<d.length;ie++){const le=d[ie];j[ie].rotation.z=le.escape?-be(N)*Math.PI/le.teeth:Y*le.speed+.012*Ge(N)*Math.sign(le.speed)}m.quaternion.copy(O).multiply(Re.setFromAxisAngle(Fe,-be(N)*Math.PI*2/12));for(const[ie,le]of J)le.position.copy(ie.position),le.quaternion.copy(ie.quaternion);if(!K)return;const W=K.projectionMatrix.elements;r.renderer&&(r.renderer.getDrawingBufferSize(Ie),x.uPx.value=2/Math.max(W[5],.05)/Math.max(Ie.y,1)),xe.setFromMatrixPosition(K.matrixWorld).applyMatrix4(Ae),he.copy(x.uSunDir.value).applyMatrix3(Ee.setFromMatrix4(Ae)).normalize();const X=I/de*(he.x>=0?1:-1),Le=ge(.82,.98,X),qe=Ge(N);Me(0,-35+E,0,I,se),q.copy(xe).sub(se);const Qe=Math.max(q.length(),1);q.multiplyScalar(1/Qe),we.copy(q).add(he);const Se=Math.hypot(we.x,we.y),Ye=ge(.05,.3,Math.abs(q.z));Se>.001?q.set(se.x+we.x/Se*4.42,se.y+we.y/Se*4.42,se.z+Math.sign(xe.z-se.z)*.3):q.copy(se),ye(0,q,2.4,(1.6+2.6*Le)*Ye),Me((he.x>=0?1:-1)*s*.5,l+8,.8*Math.sign(xe.z-U),I,q),ye(1,q,2,3.2*Le),q.set(0,3,0).applyAxisAngle(Fe,-be(N)*Math.PI*2/12),q.x+=5.6,q.applyQuaternion(O).add(m.position),ye(2,q,1.8,2.6*qe),q.set(0,ze+(P===2?5.4:P===1?2.2:2.9),0).addScaledVector(he,1.7),ye(3,q,1.6,1.3+.3*Math.sin(Y*.7)),Me(.95*Math.sign(he.x||1),-40.45+E,.5,I,q),ye(4,q,1.2,1.8*qe),Ve.needsUpdate=!0,De.needsUpdate=!0,Ne.needsUpdate=!0}Ke(0,0,null);const _=(c,G,K)=>new e.Vector3(c,G,K),Oe={portalSeat:{position:_(0,7.5,U-30),facing:_(0,0,1),radius:7},flyThrough:[_(0,7.5,260),_(0,7.5,140),_(0,7.5,60),_(0,7.5,U),_(0,7.5,8),_(0,7.5,U-30)],viewpoints:{long:_(0,7,330),threshold:_(0,7.5,60),moon:_(0,7.5,U+29)},pivot:_(0,oe,U),swingPlaneZ:U,armTipRadius:88,bobRest:_(0,oe-35,U),key:m.position.clone(),wheels:d.map(c=>({position:_(c.x,c.y,c.z),radius:c.r})),feet:C.feet,roosts:[...C.feet,m.position.clone().add(_(0,6,0)),_(-9,30.6,U-3.4),_(9,30.6,U-3.4)],opening:{halfWidthBottom:20,halfWidthTop:5,bottom:ue,top:R,frontZ:B(ue)},reflectionHint:"clone object with scale.y = -1 under the water; materials and uniforms are shared"};return{object:F,radius:75,height:146,center:_(0,64,8),anchors:Oe,ground:!0,groundY:0,cabinet:z,update:Ke,setProgress(c){pe=c,Y=c*i},setTime(c){Y=c,pe=fe(c/i,0,1)},setLock(c){x.uLock.value=fe(c,0,1)},setSun(c,G){x.uSunDir.value.copy(c).normalize(),G&&x.uSunCol.value.set(G)},setSky(c,G,K){x.uZen.value.set(c),x.uHor.value.set(G),K&&x.uSlate.value.set(K)},setFogK(c){x.uFogK.value=c},armAngle:()=>Pe(Y),bobCenter:(c=new e.Vector3)=>Me(0,-35+Be(),0,Pe(Y),c),uniforms:x,reflection:ee,dispose(){}}}export{_e as GLSL_COMMON,zt as buildHero};
