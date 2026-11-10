import*as i from"three";import{makePath as k0,clamp as Lt,lerp as Z,smoothstep as R}from"../kit/core.js";import{buildHero as B0}from"../parts/garden-carpet.js";const ct=-390,O0=[.9018,.3106,.3006],I={x:680,zc:240,hz:500,y0:120,y1:800,cell:18,bar:2.7},Pt={w:-640,e:680,s:890,n:-710,top:840},bt={zc:226.7,half:105,bay:130,post:15,transom:100,first:65,tHalf:5,south:108},qe=[[0,0,40,.8],[-60,-185,28,.36],[40,179,28,.5],[-80,259,28,.45]],h=(p,Y,$)=>new i.Vector3(p,Y,$),we="varying vec3 vP; varying vec3 vN; varying vec3 vCol; varying vec2 vUv; varying vec2 vMat;",Et=`
attribute vec3 aCol; attribute vec2 aMat; attribute float aSway;
uniform vec3 uOrigin; uniform float uTime;
${we}
#include <fog_pars_vertex>
void main(){
  vec3 P = (modelMatrix * vec4(position, 1.)).xyz - uOrigin;
  P += aSway * vec3(sin(uTime * 0.7 + P.z * 0.05) * 0.5, 0.5 + 0.5 * sin(uTime * 0.9 + P.x * 0.03), cos(uTime * 0.6 + P.x * 0.04) * 0.5);
  vP = P; vN = normalize(mat3(modelMatrix) * normal + vec3(0., 1e-5, 0.)); vCol = aCol; vUv = uv; vMat = aMat;
  vec4 mvPosition = viewMatrix * vec4(P + uOrigin, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,N0=`
attribute vec3 aCol; attribute vec2 aMat; attribute vec3 aAnim; attribute vec3 aSweep;
uniform vec3 uOrigin; uniform float uTime; uniform vec4 uTail; uniform float uShell;
${we}
#include <fog_pars_vertex>
void main(){
  vec3 p = position;
  float br = sin(uTime * 2.1) * 0.8 + sin(uTime * 4.2 + 0.6) * 0.15;
  p += normal * aAnim.x * (1.5 + 1.5 * br);
  // fur: the same skin drawn again a little further out, combed back and down along the lie of the coat as it goes
  vec3 lie = vec3(-0.9, -0.7, 0.3); lie -= normal * dot(lie, normal) * 0.8;
  p += normal * uShell * 2.2 + lie * uShell * uShell * 1.2;
  float s = aAnim.y;
  float tip = smoothstep(0.5, 1., s);
  float tw = max(sin(uTime * 1.1) * sin(uTime * 2.7 + 1.3), 0.); tw *= tw;
  p.y += tip * tip * (3.5 + 13. * tw * (1. + uTail.w) + 3. * sin(uTime * 0.7));
  p.xz += uTail.xy * tip * tip * (5. * tw * sin(uTime * 6.1) + 2. * sin(uTime * 0.9));
  // the sweep (rare): the whole tail swings out behind the cat, lifted, over the west border, and lashes there
  float all = smoothstep(0.08, 1., s);
  p += aSweep * uTail.z + normal * (smoothstep(0.03, 0.3, s) * uTail.z * 8.);
  p.y += all * uTail.z * 5. * sin(uTime * 5. + s * 4.);
  p.z += all * uTail.z * 8. * sin(uTime * 3.1 + s * 3.);
  float fl = max(sin(uTime * 0.83 + 2.), 0.); fl = fl * fl * fl * fl * sin(uTime * 17.);
  p.x += aAnim.z * fl * 2.2; p.y -= aAnim.z * abs(fl) * 1.2;
  vec3 P = (modelMatrix * vec4(p, 1.)).xyz - uOrigin;
  vP = P; vN = normalize(mat3(modelMatrix) * normal + vec3(0., 1e-5, 0.)); vCol = aCol; vUv = uv; vMat = aMat;
  vec4 mvPosition = viewMatrix * vec4(P + uOrigin, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,W0=`
attribute vec4 aRoot;    // x, z, yaw, phase
attribute vec4 aShape;   // length, arch height, radius, tint
uniform vec3 uOrigin; uniform float uTime; uniform vec3 uIvory; uniform vec3 uCam;
${we}
#include <fog_pars_vertex>
vec3 cordC(float s){
  float L = aShape.x, H = aShape.y;
  vec2 d = vec2(sin(aRoot.z), cos(aRoot.z));
  float reach = L * (0.82 * s + 0.18 * s * s);
  float a = min(s / 0.8, 1.);
  float sn = max(sin(3.14159 * sqrt(a) * a), 0.);
  float arch = sn * sqrt(sn);
  float y = 1.4 * (1. - smoothstep(0., 0.4, s)) + H * 0.8 * arch + aShape.z * 2.;
  float wig = sin(s * 7. + aRoot.w * 6.283) * 1.3 * s * (1. - s) * 4. + sin(uTime * 0.8 + aRoot.w * 40. + s * 3.) * 0.9 * arch;
  vec2 side = vec2(d.y, -d.x);
  return vec3(aRoot.x + d.x * reach + side.x * wig, y, aRoot.y + d.y * reach + side.y * wig);
}
void main(){
  float s = position.y;
  vec3 c0 = cordC(s), c1 = cordC(s + 0.02);
  vec3 T = normalize(c1 - c0 + vec3(0., 0., 1e-5));
  vec3 Bn = normalize(cross(T, vec3(0., 1., 0.)) + vec3(1e-4, 0., 0.));
  vec3 Nn = cross(Bn, T);
  // a soft cord of two plies, as thick as a finger is to a hand: an overhand knot where it leaves the carpet, a second small one
  // near its end, and the end itself cut blunt and a little frayed (not drawn out to a point)
  float kn = (s - 0.07) / 0.035, kn2 = (s - 0.9) / 0.022;
  float th = uv.x * 6.28318;
  float rr = aShape.z * 2.15;
  float tw = s * aShape.x / max(rr, 0.05);
  float fray = smoothstep(0.93, 1., s);
  float rad = rr * (1. + 0.75 * exp(-kn * kn) + 0.4 * exp(-kn2 * kn2) + 0.3 * fray) * (1. - 0.55 * smoothstep(0.992, 1., s)) * (1. + 0.27 * sin(th * 2. + tw * 1.1) + 0.2 * fray * sin(th * 5. + aRoot.w * 30.));
  rad = max(rad, length(c0 - uCam) * 0.0008);   // far cords keep a pixel and a half of width
  vec3 n = Bn * position.x + Nn * position.z;
  vec3 P = c0 + n * rad;
  vP = P; vN = normalize(n + vec3(0., 1e-5, 0.)); vCol = uIvory * aShape.w; vUv = vec2(uv.x, tw * 0.5); vMat = vec2(4., 1.);
  vec4 mvPosition = viewMatrix * vec4(P + uOrigin, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,d={PLAIN:0,WOOD:1,FLOOR:2,WALL:3,CORD:4,BRASS:5,VELVET:6,FUR:7,SPIRAL:8,HOLLOW:9,GLASS:10,DOOR:11,CEIL:12,PICTURE:13,EMBER:14,LAMP:15,BOOK:16,IRON:17,PILE:18},C0=p=>`
${p.common}
${p.light}
uniform vec3 uCam;
uniform vec3 uWallA, uWallB, uPaint, uOak, uGlare, uFurDark;
uniform vec4 uRoom;     // ambient gain, tabby stripes, night, dust
uniform float uWallK;   // how much of the warm bounce and haze the walls keep (1 = all)
uniform float uShell;   // 0 = skin; above: a fur shell this far out (0..1)
uniform vec2 uGlowK;    // how hot the stove's coals glow, how bright the lantern burns
uniform vec3 uCordWarm; // the warm light of the room (lamp, stove, oak boards) that the pale cords of the fringe pick up
uniform vec4 uBlob[4];   // what stands on the boards (centre x, z, half sizes): the floor is dark under and close round it
${we}
#include <fog_pars_fragment>
float rmFbm(vec2 p){ return 0.57 * gcNoise(p) + 0.29 * gcNoise(p * 2.03 + 7.1) + 0.14 * gcNoise(p * 4.1 + 3.3); }
// light of the window seen along R from P (for polish on wood, floor, brass and glass)
vec3 rmWin(vec3 P, vec3 R, float rough){
  float t = (uWin.x - P.x) / max(R.x, 0.02);
  vec3 h = P + R * t;
  return uGlare * gcLattice(vec2(h.z, h.y), 1. + t * rough) * smoothstep(0.02, 0.2, R.x);
}
// a recessed panel: pd = distance from its centre, hf = half size of the sunk field; returns shade
float rmPanel(vec2 pd, vec2 sg, vec2 hf){
  vec2 e = pd - hf;
  float inset = max(e.x, e.y);
  float bev = smoothstep(-7., -1., inset) * (1. - smoothstep(0., 2.5, inset));
  float lit = e.x > e.y ? 0.16 * sg.x : -0.3 * sg.y;
  return (1. + bev * lit) * (1. - 0.1 * (1. - smoothstep(-7., 0., inset)));
}
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.));
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(uCam - vP + vec3(0., 1e-4, 0.));
  float ndv = clamp(dot(N, V), 0., 1.);
  vec3 R = reflect(-V, N);
  float id = floor(vMat.x + 0.5), par = vMat.y;
  vec2 fwU = fwidth(vUv); float fwu = max(fwU.x, fwU.y);
  vec2 fwP2 = fwidth(vP.xz); float fwp = max(max(fwP2.x, fwP2.y), 1e-4);
  float fwS = fwidth(vUv.y * 0.55 + vUv.x * 3.);
  vec3 alb = vCol; float wrap = 0., rimK = 0., gloss = 0., rough = 0.06, sunK = 1., metal = 0., flatK = 0., hazeK = 0., poolK = 0., wallK = 0., polish = 0.; vec3 emis = vec3(0.); float cordK = 0.;
  if (id < 0.5) {
    alb *= 0.9 + 0.2 * gcNoise(vUv * 0.6) * (1. - smoothstep(0.5, 2., fwu));
  } else if (id < 1.5) {                                   // wood: grain along uv.y (metres); finer fibres and open pores come in as the pixel footprint shrinks
    float w1 = rmFbm(vUv * vec2(0.05, 0.012));
    float g = rmFbm(vec2(vUv.x * 1.1 + w1 * 6., vUv.y * 0.06));
    float ring = 0.5 + 0.5 * sin(vUv.x * 2.2 + w1 * 26. + g * 4.);
    float fA = 1. - smoothstep(0.14, 0.5, fwu), fB = 1. - smoothstep(0.05, 0.2, fwu);
    float f1 = gcNoise(vec2(vUv.x * 2.7 + w1 * 4., vUv.y * 0.24));
    float f2 = gcNoise(vec2(vUv.x * 7., vUv.y * 0.55));
    float pore = smoothstep(0.6, 0.86, gcNoise(vec2(vUv.x * 4.4 + 3. + w1 * 3., vUv.y * 0.13)));
    float k = (0.76 + 0.34 * g) * (0.86 + 0.22 * ring) * (1. + (f1 - 0.5) * 0.4 * fA) * (1. + (f2 - 0.5) * 0.24 * fB) * (1. - 0.32 * pore * fA);
    alb *= mix(0.9, k, 1. - smoothstep(0.3, 1.6, fwu));
    gloss = 0.5; rough = 0.1; polish = 0.32;
  } else if (id < 2.5) {                                   // oak floorboards 36 m wide, running north to south
    vec2 p = vP.xz;
    float bi = floor(p.x / 36. + 0.5), bf = fract(p.x / 36. + 0.5);
    float jz = p.y / 330. + gcHash(vec2(bi, 3.)) * 9.;
    float ji = floor(jz), jf = fract(jz);
    float tone = gcHash(vec2(bi, ji));
    vec3 oak = uOak * (0.8 + 0.36 * tone); flatK = 1.;
    oak = mix(oak, oak * vec3(1.1, 0.95, 0.8), gcHash(vec2(ji, bi + 5.)));
    float w1 = rmFbm(vec2(p.x * 0.03 + tone * 20., p.y * 0.004));
    float g = rmFbm(vec2(p.x * 0.5 + w1 * 14., p.y * 0.02 + tone * 9.));
    float ring = 0.5 + 0.5 * sin(p.x * 0.9 + w1 * 40. + tone * 6.);
    float pores = gcNoise(vec2(p.x * 5., p.y * 0.35));
    oak *= mix(0.9, (0.72 + 0.4 * g) * (0.84 + 0.24 * ring) * (0.86 + 0.28 * pores), 1. - smoothstep(0.25, 1.6, fwp));
    float dx = min(bf, 1. - bf) * 36., dz = min(jf, 1. - jf) * 330.;
    float aa = fwp * 1.2 + 0.05;
    float gap = max(1. - smoothstep(0.38, 0.38 + aa, dx), 1. - smoothstep(0.34, 0.34 + aa, dz));
    float thin = clamp(0.9 / aa, 0., 1.);
    oak *= 1. - 0.22 * smoothstep(3.2, 0.5, dx);
    float dn = rmFbm(p * 0.021 + 11.);
    float dust = smoothstep(5., 0.6, dx) * smoothstep(0.3, 0.7, dn) + 0.3 * smoothstep(0.5, 0.9, rmFbm(p * 0.006 + 3.));
    alb = mix(oak, mix(uPal[0], vec3(0.5), 0.5) * 0.62, clamp(dust, 0., 1.) * uRoom.w);
    alb *= 1. - 0.85 * gap * thin;
    vec2 lc = floor(p / 9.), lf = p - (lc + 0.5) * 9.; float lh = gcHash(lc + 17.);
    vec2 la = (vec2(lh, fract(lh * 13.7)) - 0.5) * 5.;
    vec2 ld = vec2(cos(lh * 31.), sin(lh * 31.)) * (1. + 2. * fract(lh * 5.3));
    float lint = (1. - smoothstep(0.07, 0.07 + aa, gcSeg(lf, la - ld, la + ld))) * step(0.6, lh) * clamp(0.2 / aa, 0., 1.);
    alb = mix(alb, uPal[0] * 0.8, lint * 0.45);
    // the carpet's edge and the fringe lying on the boards
    float dcar = max(abs(p.x) - 241., abs(p.y) - 390.);
    alb *= mix(0.45, 1., smoothstep(0., 11., dcar));
    for (int i = 0; i < 4; i++) {
      vec2 bd = abs(p - uBlob[i].xy) - uBlob[i].zw;
      float db = length(max(bd, 0.)) + min(max(bd.x, bd.y), 0.);
      alb *= mix(0.3, 1., smoothstep(-6., 30., db));
    }
    float inF = step(abs(p.x), 246.) * step(390., abs(p.y)) * (1. - smoothstep(416., 428., abs(p.y)));
    float streak = gcNoise(vec2(dot(p, vec2(0.316, -0.949)) * 0.8, dot(p, vec2(0.949, 0.316)) * 0.05));
    sunK *= mix(1., 0.5 + 0.5 * smoothstep(0.35, 0.7, streak), inF);
    gloss = 0.75 * (0.55 + 0.45 * tone) * (1. - 0.6 * clamp(dust, 0., 1.)); rough = 0.045;
  } else if (id < 3.5) {                                   // wall: paper above a panelled dado (uv = along, height)
    float h = vUv.y;
    float aa = fwu + 0.05;
    vec2 q = vUv / vec2(110., 160.); q.x += 0.5 * floor(q.y);
    vec2 f = fract(q) - 0.5;
    float og = abs(abs(f.x) - 0.25 * (1. + cos(f.y * 6.28318)));
    float line = 1. - smoothstep(0.05, 0.05 + aa / 110., og);
    float bud = 1. - smoothstep(0.11, 0.11 + aa / 110., abs(f.x) * 1.5 + abs(f.y));
    float leaf = 1. - smoothstep(0.06, 0.06 + aa / 110., abs(abs(f.x) + abs(abs(f.y) - 0.3) - 0.07));
    float fill = smoothstep(0., 0.06 + aa / 110., 0.25 * (1. + cos(f.y * 6.28318)) - abs(f.x));
    float pat = max(line * 0.85, max(bud, leaf * 0.7)) * clamp(26. / aa, 0., 1.);
    alb = vCol * mix(uWallA * (0.9 + 0.2 * fill), uWallB * 1.22, pat) * (0.9 + 0.2 * rmFbm(vUv * 0.012));
    // the wall thins into the haze toward the ceiling; on the far wall one soft pool of sun thrown back off the carpet
    wallK = 1.; hazeK = 0.62 * smoothstep(230., 800., h) * (0.5 + 0.5 * uWallK);
    float pwx = (vP.x + 60.) / 330., pwy = (h - 120.) / 250.;
    poolK = step(0.5, N.z) * exp(-pwx * pwx - pwy * pwy);
    alb *= 0.93 + 0.07 * step(0.5, fract(vUv.x / 55.)) * (1. - smoothstep(6., 40., aa));
    if (h < 300.) {
      float pf = fract(vUv.x / 180.) - 0.5;
      vec2 pc = vec2(pf * 180., h - 172.);
      float sh = rmPanel(abs(pc), sign(pc), vec2(64., 84.));
      float rail = smoothstep(280., 284., h);
      sh = mix(sh, 1.12 - 0.3 * smoothstep(290., 300., h), rail);
      alb = vCol * uPaint * sh * (0.94 + 0.12 * rmFbm(vUv * vec2(0.05, 0.4)));
      gloss = 0.25; rough = 0.2;
    }
  } else if (id < 4.5) {                                   // twisted wool cord: uv.x round it, uv.y along it in radii
    float s = vUv.y * 0.55 + vUv.x * 3.;
    float strand = abs(fract(s) - 0.5) * 2.;
    float fib = 0.8 + 0.4 * gcNoise(vec2(s * 22., vUv.y * 1.4 - vUv.x * 7.));
    alb *= mix(0.84, (0.66 + 0.34 * smoothstep(0., 0.75, strand)) * fib, 1. - smoothstep(0.35, 1.1, fwS));
    wrap = 0.3 + 0.2 * par; rimK = 0.3 + 0.5 * par; cordK = 1.;                // (par 1: the fringe, softer and fuzzier at its edge)
  } else if (id < 5.5) {                                   // brass
    alb *= 0.9 + 0.2 * gcNoise(vec2(vUv.x * 40., vUv.y * 2.));
    alb *= 1. - 0.35 * par * (0.5 + 0.5 * sin(vUv.y * 2.4)) * (1. - smoothstep(0.4, 1.4, fwu));
    metal = 1.; rough = 0.03;
  } else if (id < 6.5) {                                   // velvet, with gold embroidery where par > 0
    vec2 e = vUv / 7.; vec2 ef = fract(e) - 0.5;
    float aaE = fwu / 7. + 0.01;
    float dia = abs(ef.x) + abs(ef.y);
    float th = max(1. - smoothstep(0.045, 0.045 + aaE, abs(dia - 0.36)), 1. - smoothstep(0.09, 0.09 + aaE, length(ef)));
    th = max(th, (1. - smoothstep(0.03, 0.03 + aaE, abs(length(ef - vec2(0.18, 0.)) - 0.09))) * step(0.5, fract(floor(e.x) * 0.5 + floor(e.y) * 0.5) + 0.3));
    alb *= 0.86 + 0.28 * gcNoise(vUv * vec2(2.4, 0.35));
    alb = mix(alb, uPal[4] * 1.15, th * max(par, 0.) * clamp(0.06 / aaE, 0., 1.));
    wrap = 0.2; rimK = 0.8;
    if (par < -0.5) { flatK = 0.55; rimK = 0.3; }           // a hanging curtain: the light comes through the cloth
  } else if (id < 7.5) {                                   // fur: uv.x along the body, uv.y round it (metres)
    float cl = gcNoise(vUv * 0.33);
    float st = 0.86 + 0.28 * gcNoise(vec2(vUv.x * 1.1 + cl * 2., vUv.y * 2.3));
    // a tabby's bands run over the back: narrow, wandering, broken and forked
    float band = sin(vUv.x * 0.5 + vUv.y * 0.035 + 9. * gcNoise(vUv * vec2(0.034, 0.024)) + 1.5 * sin(vUv.y * 0.055));
    float stripe = smoothstep(0.35, 0.8, band) * (0.3 + 0.7 * smoothstep(0.3, 0.55, gcNoise(vUv * vec2(0.07, 0.1) + 4.)));
    alb = mix(alb, alb * uFurDark, stripe * uRoom.y * (1. - 0.6 * par));
    alb = mix(alb, alb * 1.5 + 0.08, par * 0.35);
    alb *= st * (0.85 + 0.3 * cl);
    wrap = 0.5; rimK = 1.2;
    if (uShell > 0.001) {
      // a shell of fur: tufts of hair that taper as the shells go out, paler toward their tips
      vec2 fc = vUv / 1.05; float fr = gcHash(floor(fc) + 3.7);
      float fd = length(fract(fc) - 0.5 - (vec2(fr, fract(fr * 13.3)) - 0.5) * 0.5);
      if (fd > 0.62 * (1. - uShell * (0.45 + 0.5 * fr))) discard;
      // toward the silhouette the shells are seen edge on, and tufts would show as rows of flat dashes: there each tuft is cut
      // into fine hairs (the same small dot kept from shell to shell, so the dots stack into a strand along the lie of the
      // coat), and fewer of them reach the outer shells: a soft halo of hairs of uneven length
      float graze = 1. - smoothstep(0.16, 0.5, ndv);
      vec2 hc = vUv / 0.4; float hr = gcHash(floor(hc) + 9.1);
      float hd = length(fract(hc) - 0.5 - (vec2(hr, fract(hr * 7.7)) - 0.5) * 0.3);
      if (hd > mix(0.9, 0.34 - 0.1 * uShell, graze) || hr < graze * (0.3 + 0.55 * uShell)) discard;
      alb *= 0.9 + 0.22 * uShell; rimK = 1.2 + 2. * uShell;
    } else alb *= 0.86;
  } else if (id < 8.5) {                                   // the roll's end: pile fringe on the inside, ivory foundation outside
    float fd = 1. - smoothstep(0.15, 0.6, fwU.x);
    float k = floor(vUv.x / 0.6), kf = fract(vUv.x / 0.6);
    float run = floor(vUv.x / 3.6 + 2. * gcNoise(vec2(vUv.x * 0.05, 1.)));
    float hs = gcHash(vec2(run, 5.));
    vec3 pile = hs < 0.22 ? uGround : hs < 0.4 ? uPal[1] : hs < 0.54 ? uPal[2] : hs < 0.7 ? uPal[4] : hs < 0.84 ? uBedC : uPal[3];
    float t = vUv.y;
    float slot = smoothstep(0.3, 0.5, abs(kf - 0.5)) * fd;
    vec3 pc = pile * mix(1.3, 0.55, smoothstep(0.0, 0.5, t)) * (1. - 0.55 * slot) * mix(1., 0.8 + 0.4 * gcHash(vec2(k, 1.)), fd);
    pc *= 0.85 + 0.45 * smoothstep(0.55, 1., sin(vUv.x * 0.045 - uTime * 0.6));   // the nap of the cut edge turning, turn after turn
    float bead = (0.88 + 0.12 * sin(t * 56.)) * (0.94 + 0.06 * sin(vUv.x * 10.47));
    vec3 fc = uPal[0] * 1.02 * mix(0.92, bead, fd) * (0.82 + 0.18 * smoothstep(0.5, 0.75, t));
    alb = mix(fc, pc, 1. - smoothstep(0.47, 0.53, t));
    wrap = 0.5;
  } else if (id < 9.5) {                                   // the hollow of the roll: no sun
    sunK = 0.;
    alb *= 0.8 + 0.4 * gcNoise(vUv * 0.5);
  } else if (id < 10.5) {                                  // tea in a glass
    float back = clamp(dot(-V, uSunDir) * 0.5 + 0.5, 0., 1.);
    alb *= 0.55 + 1.5 * back * back + 0.5 * pow(1. - ndv, 2.);
    gloss = 1.; rough = 0.02; wrap = 0.6;
  } else if (id < 11.5) {                                  // the door in the far wall (uv in metres)
    vec2 dq = vec2(abs(vUv.x - 120.), vUv.y);
    float row = dq.y < 250. ? 0. : (dq.y < 470. ? 1. : 2.);
    vec2 ctr = vec2(60., row < 0.5 ? 140. : (row < 1.5 ? 360. : 545.));
    vec2 hf = vec2(38., row < 0.5 ? 86. : (row < 1.5 ? 86. : 44.));
    vec2 pc = vec2(dq.x - ctr.x, dq.y - ctr.y);
    alb = vCol * uPaint * rmPanel(abs(pc), sign(pc), hf) * (0.94 + 0.12 * rmFbm(vUv * vec2(0.4, 0.05)));
    alb *= 1. - 0.5 * (1. - smoothstep(0., 2.5, abs(vUv.x - 120.) - 0.));
    gloss = 0.3; rough = 0.2;
  } else if (id < 12.5) {                                  // ceiling: joists
    alb *= 0.8 + 0.2 * smoothstep(0.4, 0.5, abs(fract(vUv.x / 150.) - 0.5));
  } else if (id < 13.5) {                                  // the picture on the far wall: a small landscape in the carpet's dyes
    vec2 q = vUv;
    vec3 skyc = mix(uPal[0] * 1.1, uPal[3], smoothstep(0.35, 1., q.y));
    float h1 = 0.42 + 0.14 * gcNoise(vec2(q.x * 3., 1.));
    float h2 = 0.28 + 0.12 * gcNoise(vec2(q.x * 5. + 3., 4.));
    alb = mix(skyc, mix(uPal[3], uPal[2], 0.5), 1. - smoothstep(-0.01, 0.01, q.y - h1));
    alb = mix(alb, uPal[5] * 0.85, 1. - smoothstep(-0.01, 0.01, q.y - h2));
    alb = mix(alb, uPal[4] * 1.1, 1. - smoothstep(0.05, 0.06, length((q - vec2(0.68, 0.74)) * vec2(1.45, 1.))));
    alb = mix(alb, uPal[1], 1. - smoothstep(0., 0.012, abs(q.y - 0.15 - 0.035 * sin(q.x * 9.)) - 0.03));
    alb = mix(uPal[0] * 1.08, alb, step(0.07, min(min(q.x, 1. - q.x) * 1.47, min(q.y, 1. - q.y))));
  } else if (id < 14.5) {                                  // the stove's door: coals behind mica panes in iron glazing bars (uv in panes)
    vec2 gf = abs(fract(vUv) - 0.5);
    float bar = smoothstep(0.37, 0.45, max(gf.x, gf.y));
    float h = clamp(vUv.y / 3., 0., 1.);
    float fl = 0.5 * gcNoise(vec2(vUv.x * 2.3 + uTime * 0.7, vUv.y * 1.7 - uTime * 1.9)) + 0.5 * gcNoise(vec2(vUv.x * 5.1 - uTime * 1.1, vUv.y * 3.3 - uTime * 3.1));
    float coal = smoothstep(0.75, 0.1, h) * (0.6 + 0.4 * gcNoise(vUv * 6. + floor(uTime * 0.5)));
    float flame = smoothstep(0.25, 0.75, fl + 0.35 - h * 0.6);
    emis = vCol * uGlowK.x * (1. - bar) * (0.2 + 1.1 * coal + 0.9 * flame * vec3(1., 1.35, 1.8));
    alb = vec3(0.012); gloss = 0.5; rough = 0.2;
  } else if (id < 15.5) {                                  // the lantern's glass: uv.y = 0 at the burner, 1 at the cap. A small flame behind dark, clear glass
    float fl = 0.86 + 0.1 * sin(uTime * 9. + 2. * sin(uTime * 3.7)) + 0.04 * sin(uTime * 23.);
    float sway = 0.03 * sin(uTime * 5.3) + 0.02 * sin(uTime * 11.);
    float cy = (vUv.y - 0.27 - 0.04 * fl) / 0.15;
    float n6 = ndv * ndv * ndv; n6 *= n6;
    float tip = clamp(1.2 - cy * 0.5, 0.3, 1.6);                     // the flame narrows upward
    float flame = exp(-cy * cy) * clamp(n6 * n6 * tip + sway * cy, 0., 1.);
    float halo = exp(-cy * cy * 0.22) * ndv * ndv;
    emis = uGlowK.y * fl * (vCol * (0.06 + 0.3 * halo + 4.6 * flame) + vec3(2.2, 1.6, 0.7) * flame * flame);
    alb *= 0.1; gloss = 1.; rough = 0.02;
  } else if (id < 16.5) {                                  // a book's spine: gilt bands and a label (uv 0..1 on each face)
    float bands = step(abs(vUv.y - 0.84), 0.02) + step(abs(vUv.y - 0.2), 0.02) + step(abs(vUv.y - 0.13), 0.012);
    float lab = step(abs(vUv.y - 0.64), 0.07) * step(abs(vUv.x - 0.5), 0.36) * step(0.45, par);
    float fadeB = 1. - smoothstep(0.02, 0.07, fwu);
    alb *= 0.84 + 0.3 * gcNoise(vUv * vec2(3., 40.) + par * 30.);
    alb = mix(alb, uPal[4] * 0.95, clamp(bands, 0., 1.) * 0.85 * fadeB);
    alb = mix(alb, uPal[0] * 0.85, lab * 0.8 * fadeB);
    gloss = 0.2; rough = 0.15;
  } else if (id < 17.5) {                                  // cast iron, blackleaded: a dull sheen
    alb *= 0.75 + 0.5 * gcNoise(vUv * 0.3);
    gloss = 1.; rough = 0.3; rimK = 0.6;
  } else {                                                 // knotted pile on the things that stand up out of the carpet: uv in metres, a knot 1.2 m; par picks the design
    vec2 kq = vUv / 1.2; vec2 kc = floor(kq), kf = fract(kq) - 0.5;
    vec2 cc = (kc + 0.5) * 1.2;
    float fadeK = 1. - smoothstep(0.3, 0.9, fwu);
    vec3 pI = uPal[0], pM = uPal[1], pN = uPal[2], pS = uPal[4], pG = uPal[5];
    if (par < 0.5) {                                       // a cypress: feathers of indigo and sage in columns, a saffron seam between them, a saffron hem
      float lx = abs(mod(cc.x + 0.6, 9.6) - 4.8);
      float chev = fract((cc.y - lx * 1.3) / 4.8);
      float fe = step(0.3, abs(chev - 0.5));
      vec3 body = mix(mix(pN * 0.95, mix(pN, uPal[3], 0.22), uWinter), mix(pG, pN, 0.35), uNight);
      vec3 feather = mix(mix(pG * 1.1, mix(pG, uPal[3], 0.55) * 1.2, uWinter), mix(pG, pI, 0.4), uNight);
      alb = mix(body, feather, fe * (1. - smoothstep(0.5, 1.6, fwu) * 0.5));
      alb = mix(alb, pM * 1.15, uWinter * step(0.86, gcHash(kc + 7.)) * (1. - fe) * fadeK);          // winter: madder berries, a knot here and there
      alb = mix(alb, pS, max(step(4.5, lx), step(cc.y, 3.6) * step(2.4, cc.y)));
    } else if (par < 1.5) {                                // the fountain's basin: rings of the rosette's dyes, scalloped
      float ring = floor(cc.y / 2.4), sc = step(0.5, fract(cc.x / 7.2 + 0.5 * mod(ring, 2.)));
      float rm = mod(ring, 4.);
      alb = rm < 0.5 ? pM : rm < 1.5 ? mix(pI, pS, sc) : rm < 2.5 ? mix(pN, pM, sc) : pI;
    }
    alb *= mix(1., 0.9 + 0.2 * gcHash(kc + 3.), fadeK);
    float tuftEdge = max(abs(kf.x), abs(kf.y));
    if (uShell > 0.001) {
      if (tuftEdge > mix(0.6, 0.47 - 0.19 * uShell, fadeK)) discard;
      alb *= mix(1., (0.55 + 0.6 * uShell) * (0.85 + 0.3 * gcNoise(vUv * 9.)), fadeK);
    } else alb *= mix(0.85, 0.34, fadeK);
    wrap = 0.35; rimK = 0.7;
  }
  float sun = gcSun(vP) * sunK;
  float ndl = mix(clamp((dot(N, uSunDir) + wrap) / (1. + wrap), 0., 1.), 0.8, flatK);
  float up = 0.5 + 0.5 * N.y;
  // sky light enters by the window wall and dies toward the corners and the ceiling
  float open = (0.62 + 0.38 * N.x) * mix(0.42, 1., smoothstep(-640., 560., vP.x)) * mix(1., 0.35, smoothstep(220., 840., vP.y));
  float wk = mix(1., uWallK, wallK);
  vec3 amb = (uSkyCol * (0.25 + 0.6 * up) * open * 1.3 * (0.4 + 0.6 * wk) + uBounceCol * (0.75 - 0.6 * up) * wk * mix(1. + 0.9 * wallK, 0.45 - 0.2 * wallK, smoothstep(40., 520., vP.y))) * gAO * uRoom.x;
  vec3 warm = gcWarm(vP, N) * gAO;
  vec3 c = alb * (uSunCol * sun * ndl + amb + warm + uCordWarm * cordK * (0.45 + 0.55 * ndl) * gAO + uSunCol * (uGround * 1.6 + 0.2) * poolK * 0.75 * wk);
  float rim = 1. - ndv; rim = rim * rim * rim;
  c += alb * rimK * rim * (amb * 1.5 + uSunCol * sun * 0.45);
  float F = 0.04 + 0.96 * rim * (1. - ndv);
  vec3 wl = rmWin(vP, R, rough);
  float sd = max(dot(R, uSunDir), 0.); sd *= sd; sd *= sd; sd *= sd;
  c += gloss * F * wl + gloss * uSunCol * sun * sd * sd * 0.5;
  if (metal > 0.5) {
    vec3 env = mix(uBounceCol * 1.5, uSkyCol * 1.5 * open, smoothstep(-0.3, 0.5, R.y)) * gAO * uRoom.x + wl * 0.5;
    c = alb * (env * 0.95 + uSunCol * sun * (0.2 * ndl + 1.6 * sd * sd) + warm * 0.6 + gcWarm(vP, R) * 1.3);
  }
  c += gloss * F * gcWarm(vP, R) * 2.;
  c += (alb * 1.6 + 0.02) * polish * gcWarm(vP, R) * gAO;       // polish: turned rings and edges catch the stove and the lantern
  c += emis;
  #ifdef USE_FOG
    c = mix(c, fogColor * 1.5, hazeK);
  #endif
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`,R0=`
uniform vec3 uOrigin; varying vec3 vP;
#include <fog_pars_vertex>
void main(){
  vP = (modelMatrix * vec4(position, 1.)).xyz - uOrigin;
  vec4 mvPosition = viewMatrix * vec4(vP + uOrigin, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,T0=p=>`
${p.common}
${p.light}
uniform vec3 uCam, uSkyLo, uSkyHi, uHedge, uLeaf, uBar, uGlow;
uniform vec4 uOut;      // snow, stars, hedge height, sun glow
varying vec3 vP;
#include <fog_pars_fragment>
void main(){
  vec2 w = vec2(vP.z, vP.y);
  vec2 fw = fwidth(w); float aa = max(max(fw.x, fw.y), 1e-3);
  gcLattice(w, aa * 0.7 + 0.2);
  float bars = gBars, dbr = gBrD;
  float v = clamp((w.y - uWin2.x) / max(uWin2.y - uWin2.x, 1.), 0., 1.);
  vec3 sky = mix(uSkyLo, uSkyHi, smoothstep(0.05, 0.85, v));
  // stars before dawn
  vec2 sc = floor(w / 13.); float sh = gcHash(sc);
  float star = step(0.93, sh) * (1. - smoothstep(0.8, 2.2, length(w - (sc + 0.5) * 13.) / max(aa, 0.6)));
  sky += uOut.y * star * (0.6 + 0.4 * sin(uTime * (1. + sh * 3.) + sh * 40.)) * vec3(0.9, 0.95, 1.2) * smoothstep(0.2, 0.6, v);
  // a far hedge and nearer shrubs, soft, stirring
  float h1 = uOut.z * (0.16 + 0.07 * gcNoise(vec2(w.x * 0.006, 2.)) + 0.02 * gcNoise(vec2(w.x * 0.05, 5.)));
  float h2 = uOut.z * (0.07 + 0.09 * gcNoise(vec2(w.x * 0.013 + 0.06 * sin(uTime * 0.5 + w.x * 0.01), 9.)));
  sky = mix(sky, mix(uHedge, uSkyLo, 0.55), 1. - smoothstep(-0.02, 0.03, v - h1));
  sky = mix(sky, uHedge, 1. - smoothstep(-0.012, 0.02, v - h2));
  // the branch: a soft swaying silhouette with paler leaves at its edge
  float sil = 1. - smoothstep(-5., 5. + aa, dbr);
  vec3 lf = mix(uLeaf, uLeaf * 2.2 + uSkyLo * 0.1, smoothstep(-9., 2., dbr) * gcNoise(w * 0.12));
  sky = mix(sky, lf, sil * 0.94);
  // snow falling beyond the lattice
  vec2 sp = vec2(w.x + 6. * sin(uTime * 0.4 + w.y * 0.02), w.y + uTime * 7.);
  vec2 si = floor(sp / 17.); vec2 so = (vec2(gcHash(si + 3.), gcHash(si + 11.)) - 0.5) * 11.;
  float fl = 1. - smoothstep(0.9, 1.9 + aa, length(sp - (si + 0.5) * 17. - so));
  sky = mix(sky, vec3(1.9, 1.95, 2.1) * max(uSkyHi.b, 0.4), fl * uOut.x * 0.8);
  // the sun (or the moon) low behind the bars
  vec3 d = normalize(vP - uCam + vec3(1e-4, 0., 0.));
  float sd = max(dot(d, uSunDir), 0.);
  float s8 = sd * sd; s8 *= s8; s8 *= s8; float s64 = s8 * s8; s64 *= s64; s64 *= s64;
  sky += uGlow * uOut.w * (0.5 * s8 * s8 + 5. * s64 * s64 * s64);
  // bars: dark wood, a thread of light on their edges
  float edge = bars * (1. - bars) * 4.;
  vec3 bar = uBar * (uBounceCol * 0.9 + uSkyCol * 0.25) + sky * 0.1 * edge;
  vec3 c = mix(bar, sky, bars);
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`,F0=`
#define NBEAM 4
uniform vec4 uBeam[NBEAM];   // where each shaft lands (hero-local x, z), its radius, its strength
float rmBeam(vec3 P){
  float s = 0.;
  for (int i = 0; i < NBEAM; i++) {
    vec3 d = P - vec3(uBeam[i].x, 0., uBeam[i].y);
    vec3 q = d - uSunDir * dot(d, uSunDir);
    s += uBeam[i].w * exp(-dot(q, q) / max(uBeam[i].z * uBeam[i].z, 1.));
  }
  return s;
}`,U0=p=>`
${p.common}
attribute vec4 aBeam;
uniform vec3 uOrigin, uCamW;
varying vec3 vP; varying vec4 vB;
void main(){
  float R = aBeam.z;
  float len = (uWin.x - aBeam.x) / max(uSunDir.x, 0.05);
  float s = mix(-3. * R, len, position.y);
  vec3 c = vec3(aBeam.x, 0., aBeam.y) + uSunDir * s;
  vec3 sideV = normalize(cross(uSunDir, uCamW - uOrigin - c) + vec3(0., 1e-4, 0.));
  vec3 P = c + sideV * (position.x * R * 2.3);
  vP = P; vB = vec4(position.x, s, aBeam.w, R);
  gl_Position = projectionMatrix * viewMatrix * vec4(P + uOrigin, 1.);
}`,L0=p=>`
${p.common}
uniform float uShaft, uFogD; uniform vec3 uOrigin, uCamW;
varying vec3 vP; varying vec4 vB;
void main(){
  vec3 toP = vP - (uCamW - uOrigin);
  float dist = length(toP);
  vec3 V = toP / max(dist, 1e-3);
  float sn = max(length(cross(V, uSunDir)), 0.62);
  float a = exp(-vB.x * vB.x * 5.3) / sn;
  a *= smoothstep(14., 14. + 3.4 * vB.w, vP.y);                  // it thins out well above the wool, so what it lands on (and the cat and the roll behind it) stays clear
  a *= 1. - smoothstep(uWin.x - 190., uWin.x - 20., vP.x);       // and into the glare of the window
  a *= smoothstep(60., 300., dist);                              // and thins toward the eye, so it never lies on the lens as a veil
  float n = 0.6 + 0.52 * gcNoise(vec2(vB.y * 0.011 - uTime * 0.035, vB.x * 1.3 + uTime * 0.02)) + 0.16 * gcNoise(vec2(vB.y * 0.045 + uTime * 0.05, vB.x * 3.1 - uTime * 0.03));
  float ff = exp(-uFogD * uFogD * dist * dist);
  gl_FragColor = vec4(uSunCol * (a * n * vB.z * uShaft * ff), 1.);
}`,I0=p=>`
${p.common}
${p.light}
${F0}
attribute vec4 aSeed;
uniform vec3 uOrigin, uCamW;
varying vec2 vQ; varying vec3 vC;
void main(){
  vec3 box = vec3(190., 90., 190.);
  float k = aSeed.w;
  vec3 base = aSeed.xyz * box + vec3(sin(uTime * 0.11 + k * 6.) * 7. - uTime * 0.5, sin(uTime * 0.17 + k * 31.) * 4. - uTime * 0.3 * (0.4 + k), cos(uTime * 0.09 + k * 9.) * 7.);
  vec3 rel = mod(base - uCamW + 0.5 * box, box) - 0.5 * box;
  vec3 Pw = uCamW + rel;
  vec3 P = Pw - uOrigin;
  float dist = length(rel);
  float sz = mix(0.05, 0.17, fract(k * 7.3));
  float szA = max(sz, dist * 0.0013);
  float e = sz / szA; e *= e;
  float lit = gcLat(P);
  float tw = 0.35 + 0.65 * abs(sin(uTime * (0.5 + k) + aSeed.x * 40.));
  float fade = smoothstep(5., 22., dist) * (1. - smoothstep(0.4 * box.x, 0.5 * box.x, dist)) * step(3.4, P.y) * step(abs(P.x), 640.);
  vC = (uSunCol * lit * (0.45 + 2.6 * min(rmBeam(P), 1.2)) + uSkyCol * 0.08) * tw * e * fade;
  float a = uTime * (0.3 + k) + k * 20.;
  vec2 q = position.xy;
  vec2 r = vec2(q.x * cos(a) - q.y * sin(a), q.x * sin(a) + q.y * cos(a));
  vQ = q;
  vec4 mv = viewMatrix * vec4(Pw, 1.);
  mv.xy += r * szA * vec2(2.4, 1.);
  gl_Position = projectionMatrix * mv;
}`,D0=`
varying vec2 vQ; varying vec3 vC;
void main(){
  float d = dot(vQ, vQ);
  float a = max(1. - d, 0.); a *= a;
  gl_FragColor = vec4(vC * a, 1.);
}`,K0=p=>`
${p.common}
uniform float uShell;   // 0 = the ridge itself; above: a shell of loose tufts this far out (0..1)
varying vec3 vP; varying vec3 vN; varying vec2 vUv; varying vec2 vK;
#include <fog_pars_vertex>
void main(){
  float a = uv.x, z = position.z;
  float n1 = gcNoise(vec2(z * 0.045, uTime * 0.6)), n2 = gcNoise(vec2(z * 0.19 + 7., uTime * 1.3));
  float n3 = gcNoise(vec2(z * 0.61 + 3., uTime * 0.9));                      // the top is ragged: tufts thrown up unevenly
  float W = 20. + 6. * n1;
  float x = uWave.x + 3. + (a - 0.5) * W + (n1 - 0.5) * 9.;
  float endK = 1. - smoothstep(372., 389., abs(z));
  float H = uWave.w * endK * (7.5 + 5.5 * n1 + 2.5 * n2) * (0.84 + 0.32 * n3) * (1. - smoothstep(228., 239., abs(x)));
  float sn = max(sin(a * 3.14159), 0.);
  float h = H * sn * sqrt(sn), dh = H * 1.5 * sqrt(sn) * cos(a * 3.14159) * 3.14159;
  vec3 P = vec3(x + h * 0.55, 0.3 + 2.4 * uWave.w * endK + gcWaveLift(x) + gcLift(vec2(x, z)) + h, z);
  vec3 Nn = normalize(vec3(-dh, W + 0.55 * dh, 0.) + vec3(0., 1e-4, 0.));
  P += Nn * (uShell * 1.7 * uWave.w * endK);
  vP = P; vN = Nn; vUv = vec2(a, sn); vK = vec2(z, a * W) / 1.2;
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,V0=p=>`
${p.common}
${p.light}
${p.nap}
${p.dye}
uniform float uShell;
varying vec3 vP; varying vec3 vN; varying vec2 vUv; varying vec2 vK;
#include <fog_pars_fragment>
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.));
  if (!gl_FrontFacing) N = -N;
  vec2 fw2 = fwidth(vP.xz); float fwm = max(max(fw2.x, fw2.y), 1e-4);
  vec2 fwk2 = fwidth(vK); float fwk = max(max(fwk2.x, fwk2.y), 1e-4);
  float fine = 1. - smoothstep(0.3, 0.8, fwk);                 // 1 where the tufts of the ridge can be told apart
  vec2 kc = floor(vK), kf = fract(vK) - 0.5;
  float hk = gcHash(kc + 11.3);
  // the outer shells: loose tufts of turned pile standing out of the ridge, fewer and thinner the further out
  float te = max(abs(kf.x), abs(kf.y));
  if (uShell > 0.001 && (te > mix(0.6, 0.47 - 0.2 * uShell, fine) || hk < uShell * 0.5 * fine)) discard;
  vec2 q = mix((floor(vP.xz / 0.6) + 0.5) * 0.6, vP.xz, smoothstep(0.2, 0.38, fwm));
  gW = max(0.3, fwm * 1.6);
  vec4 dye = gcDye(q, uTime);
  // the rug's own pattern is carried up the ridge: whole on its dark lee side (the west, behind the front), washed toward
  // ivory on the face that has turned over to the sun, and palest along the top, where the pile shows its silky sides
  float front = smoothstep(0.44, 0.62, vUv.x), top = smoothstep(0.9, 1., vUv.y) * (1. - 0.6 * (1. - smoothstep(0.3, 0.5, vUv.x)));
  vec3 alb = mix(dye.rgb, uPal[0] * 1.1, max(mix(0.03, 0.3, front), 0.8 * top));
  // fibres combed over the ridge, and each tuft its own value
  float fib = 0.62 + 0.76 * gcNoise(vec2(vP.z * 2.6, vUv.x * 9.)) ;
  float streak = mix(0.95, fib * (0.8 + 0.4 * hk), fine) * (0.86 + 0.28 * gcNoise(vec2(vP.z * 0.23, vUv.x * 3. + 2.)));
  float tuftK = uShell > 0.001 ? mix(1., 0.72 + 0.5 * uShell, fine) : mix(1., 0.55 + 0.3 * smoothstep(0.5, 0.2, te), fine);   // dark roots between the tufts, paler tips
  float sun = gcSun(vP);
  float ndl = clamp(dot(N, uSunDir) * 0.8 + 0.34, 0., 1.);
  float up = 0.5 + 0.5 * N.y;
  vec3 amb = (uSkyCol * (0.3 + 0.6 * up) + uBounceCol * (0.7 - 0.5 * up)) * uAmbTint;
  vec3 c = alb * streak * tuftK * (uSunCol * sun * ndl * 1.2 + amb * gAO * mix(0.62, 1., max(front, top)) + gcWarm(vP, N));
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`,_0=`
varying vec2 vUv; varying vec3 vP;
#include <fog_pars_vertex>
void main(){
  vUv = uv; vP = position;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,G0=p=>`
${p.common}
${p.light}
uniform vec3 uOrigin2; varying vec2 vUv; varying vec3 vP;
void main(){
  float t = uTime * 0.16;
  float wob = (gcNoise(vec2(vUv.y * 3. - t * 2., vP.z * 0.05)) - 0.5) * 0.5 * vUv.y;
  float x = vUv.x - 0.5 + wob;
  float n = gcNoise(vec2(x * 5. + 3., vUv.y * 4. - t * 5.)) * 0.6 + gcNoise(vec2(x * 11., vUv.y * 9. - t * 8.)) * 0.4;
  float body = (1. - smoothstep(0.05, 0.16 + 0.22 * vUv.y, abs(x))) * smoothstep(0., 0.08, vUv.y) * (1. - smoothstep(0.45, 1., vUv.y));
  float a = body * smoothstep(0.3, 0.75, n) * 0.5;
  vec3 c = (uSunCol * gcLat(vP + uOrigin2) * 0.8 + uSkyCol * 0.5) * a;
  gl_FragColor = vec4(c, 1.);
}`,Ee=44,q0=`
#define NGO ${Ee}
attribute vec3 aCol; attribute vec2 aMat; attribute vec3 aAnim;
uniform vec3 uOrigin; uniform float uTime; uniform float uShell; uniform float uRise[NGO]; uniform vec4 uWave;
${we}
#include <fog_pars_vertex>
void main(){
  float r = uRise[int(aAnim.z + 0.5)];
  vec3 l = position - vec3(aAnim.x, 0., aAnim.y);
  float sx = mix(0.3, 1., smoothstep(0., 0.7, r));
  vec3 P = vec3(aAnim.x + l.x * sx, l.y * r, aAnim.y + l.z * sx);
  P += normal * (uShell * 1.3 * min(r, 1.));
  float sw = l.y * l.y * 0.00022 * min(r, 1.);
  P.x += sw * sin(uTime * 0.8 + aAnim.x * 0.05); P.z += sw * cos(uTime * 0.65 + aAnim.y * 0.04);
  float wq = (aAnim.x - uWave.x) / max(uWave.z, 1.);
  float wg = uWave.w * uWave.y * exp(-wq * wq * 2.2);             // the garden rides the rare wave of pile:
  P.x += P.y * wg * wq * 0.15;                                    // each tree tips away from the front as it comes, and back as it goes,
  P.y += wg * (1. + 0.25 * min(r, 1.));                           // and is heaved up on its crest
  vP = P; vN = normalize(normal + vec3(0., 1e-5, 0.)); vCol = aCol; vUv = uv; vMat = aMat;
  vec4 mvPosition = viewMatrix * vec4(P + uOrigin, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,E0=p=>`
#define NGO ${Ee}
${p.common}
${p.light}
attribute vec4 aFoot;   // foot x, foot z, index into uRise, kind (0 leaf, 1 blossom, 2 bed flower, 3 lamp, 4 a tuft of the gate's edge, 5 a lamp standing on a stem)
attribute vec4 aOff;    // offset from the foot when fully risen, radius
attribute vec4 aTint;   // colour, seed
attribute vec4 aCN;     // the direction this ball faces in its crown, how open it is (ao)
uniform vec3 uOrigin; uniform float uRise[NGO]; uniform vec3 uBloomA, uBloomB; uniform float uLampK;
varying vec2 vQ; varying vec3 vC; varying vec4 vL; varying vec3 vView; varying vec4 vS; varying vec3 vWarm; varying vec4 vZW;
#include <fog_pars_vertex>
void main(){
  float r = uRise[int(aFoot.z + 0.5)];
  float kind = aFoot.w, seed = aTint.w;
  float gateK = step(3.5, kind) * step(kind, 4.5);               // a tuft on the edge of the border gate: it rises with the arch, straight up
  float stemK = step(4.5, kind);                                 // a standing lamp: its card is drawn out downward for the stem, like a bed flower's
  float sx = mix(mix(0.3, 1., smoothstep(0., 0.7, r)), 1., gateK);
  vec3 C = vec3(aFoot.x + aOff.x * sx, aOff.y * r, aFoot.y + aOff.z * sx);
  float bed = step(1.5, kind) * step(kind, 2.5);
  float wqp = (aFoot.x - uWave.x) / max(uWave.z, 1.), wgp = gcWaveLift(aFoot.x);
  C.x += C.y * wgp * wqp * 0.15;
  C.y += bed * (gcLift(aFoot.xy) + 2.4) + wgp * (1. + 0.25 * min(r, 1.) * (1. - bed));
  float sw = aOff.y * aOff.y * 0.00022 * min(r, 1.) * (1. - gateK);
  C.x += sw * sin(uTime * 0.8 + aFoot.x * 0.05) + 0.3 * min(r, 1.) * sin(uTime * 1.3 + seed * 40.);
  C.z += sw * cos(uTime * 0.65 + aFoot.y * 0.04) + 0.3 * min(r, 1.) * cos(uTime * 1.1 + seed * 23.);
  float R = aOff.w * smoothstep(0.03, 0.6, r) * mix(1., smoothstep(0.25, 1., r), bed);
  // blossoms open and close in four stepped frames, a few at a time, as the woven ones do
  float fr = 3.;
  vec3 col = aTint.rgb;
  if (kind > 0.5 && kind < 1.5) {
    float tri = 1. - abs(2. * fract(uTime * 0.05 + seed) - 1.);
    fr = floor(clamp((tri - 0.1) / 0.7, 0., 0.999) * 4.);
    R *= 0.62 + 0.13 * fr;
    col = mix(uBloomA, uBloomB, max(step(1.5, fr), step(0.5, fract(seed * 5.3))) * step(0.3, fract(seed * 7.7)));
  }
  vec4 mvPosition = viewMatrix * vec4(C + uOrigin, 1.);
  vView = vec3(mvPosition.xyz);
  // a flower of the beds stands on a stem: its card is drawn out downward to the bed
  vec2 pq = vec2(position.x, position.y * mix(1., 2.7, max(bed, stemK * 0.93) * step(position.y, 0.)));
  mvPosition.xy += pq * R;
  gl_Position = projectionMatrix * mvPosition;
  vec4 c0 = projectionMatrix * vec4(vView, 1.), c1 = projectionMatrix * vec4(vView + vec3(0., 0., R * 0.85), 1.);
  vZW = vec4(c0.zw, c1.zw);
  vQ = pq;
  float sun = gcSun(C);
  vL = vec4(sun, gAO * aCN.w, clamp(dot(aCN.xyz, uSunDir) * 0.6 + 0.5, 0., 1.), R);
  vC = col; vS = vec4(seed, kind, fr, step(2.5, kind) * uLampK);
  vWarm = gcWarm(C, normalize(aCN.xyz + vec3(0., 0.4, 0.)));
  #include <fog_vertex>
}`,H0=p=>`
${p.common}
uniform vec3 uHeart;
varying vec2 vQ; varying vec3 vC; varying vec4 vL; varying vec3 vView; varying vec4 vS; varying vec3 vWarm; varying vec4 vZW;
#include <fog_pars_fragment>
void main(){
  float seed = vS.x, kind = vS.y;
  float rho = sqrt(max(dot(vQ, vQ), 1e-6));
  vec2 dq = vQ / rho;
  float fwq = fwidth(vQ.x) + fwidth(vQ.y);
  float isBed = step(1.5, kind) * step(kind, 2.5), isLamp = max(step(2.5, kind) * step(kind, 3.5), step(4.5, kind));
  if (isLamp > 0.5) {
    // a woven lamp of the night garden: a rosette of glowing knots, a saffron heart and stepped rings, that swells and
    // shrinks a knot at a time (five steps in three seconds)
    float snapL = 1. - smoothstep(0.1, 0.22, fwq);
    float KN = kind > 4.5 ? 6.5 : 4.5;                              // a standing lamp is seen from further off: more knots, a rounder ring
    vec2 kq = mix(vQ, (floor(vQ * KN) + 0.5) / KN, snapL);
    float rk = length(kq);
    float tri = abs(mod(floor(uTime * 1.6 + seed * 8.), 4.) - 2.);
    if (rk > 0.94 - 0.22 * tri) {
      // the stem of a standing lamp: plied saffron wool, lit from above by its own ring
      if (kind < 4.5 || vQ.y > -0.3 || abs(vQ.x + 0.02 * sin(vQ.y * 9. + seed * 20.)) > 0.085) discard;
      vec3 sc = mix(uPal[6], uPal[4], 0.45) * (0.75 + 0.5 * step(0.5, fract(vQ.y * 5.5 + vQ.x * 4.)));
      vec3 cst = sc * ((uSkyCol * 0.7 + uBounceCol * 0.45) * vL.y + vWarm * vL.y + uPal[4] * 1.1 * vS.w * smoothstep(-2.4, -0.7, vQ.y));
      gl_FragColor = vec4(cst, 1.);
      gl_FragDepth = clamp(vZW.x / max(vZW.y, 1e-4) * 0.5 + 0.5, 0., 1.);
      #include <fog_fragment>
      return;
    }
    float ring = floor(rk * 4.5 + 0.5);
    vec2 kf = abs(fract(vQ * KN) - 0.5);
    if (kind > 4.5 && snapL > 0.5 && dot(kf, kf) > 0.235) discard;   // a standing lamp's knots are round tufts, with the night between them
    float groove = mix(1., 1. - 0.5 * smoothstep(0.34, 0.5, max(kf.x, kf.y)), snapL);
    vec3 lc = ring < 0.5 ? uHeart * 1.1 + 0.1 : ring < 1.5 ? vC : ring < 2.5 ? uPal[1] * 1.25 : ring < 3.5 ? vC : uPal[0] * 0.9;
    float gl = ring < 0.5 ? 1.9 : ring < 1.5 ? 1.25 : ring < 2.5 ? 0.7 : ring < 3.5 ? 0.95 : 0.55;
    float flick = 0.88 + 0.12 * sin(uTime * 2.3 + seed * 40.);
    vec3 cl = lc * groove * (gl * flick * vS.w + 0.12);
    gl_FragColor = vec4(cl, 1.);
    gl_FragDepth = clamp(vZW.x / max(vZW.y, 1e-4) * 0.5 + 0.5, 0., 1.);
    #include <fog_fragment>
    return;
  }
  // the stem of a bed flower: a thread of sage wool that thickens to a dark tuft where it stands in the bed
  float sy = vQ.y;
  float stemW = 0.1 + 0.34 * smoothstep(-1.5, -2.7, sy);
  float inStem = isBed * step(sy, -0.3) * step(abs(vQ.x + 0.13 * sin(sy * 2.3 + seed * 9.)), stemW);
  // the edge: loose fibre ends; a blossom has five round petals
  float edge = 0.94 - 0.1 * gcNoise(vQ * 6. + seed * 31.) - 0.05 * gcNoise(vQ * 17. + seed * 7.);
  float isB = step(0.5, kind) * step(kind, 1.5);
  float pet = max(max(dot(dq, vec2(0., 1.)), dot(dq, vec2(0.951, 0.309))), max(max(dot(dq, vec2(-0.951, 0.309)), dot(dq, vec2(0.588, -0.809))), dot(dq, vec2(-0.588, -0.809))));
  float notch = smoothstep(0.81, 0.97, pet);
  edge *= mix(1., 0.7 + 0.3 * notch, isB);
  if (rho > edge) {
    if (inStem < 0.5) discard;
    vec3 stemC = mix(uPal[5], uPal[2], 0.35) * mix(0.3, 0.95, smoothstep(-2.7, -0.9, sy)) * (0.85 + 0.3 * gcNoise(vec2(vQ.x * 14., sy * 3.) + seed * 20.));
    vec3 cs = stemC * (uSunCol * vL.x * 0.6 + (uSkyCol * 0.7 + uBounceCol * 0.45) * vL.y + vWarm * vL.y);
    gl_FragColor = vec4(cs, 1.);
    gl_FragDepth = clamp(vZW.x / max(vZW.y, 1e-4) * 0.5 + 0.5, 0., 1.);
    #include <fog_fragment>
    return;
  }
  float rr = rho / edge;
  float nz = sqrt(max(1. - rr * rr, 0.));
  vec3 nv = normalize(vec3(dq * rr, nz + 0.08));
  vec3 N = normalize((vec4(nv, 0.) * viewMatrix).xyz + vec3(0., 1e-4, 0.));
  float ndl = clamp((dot(N, uSunDir) + 0.45) / 1.45, 0., 1.);
  float up = 0.5 + 0.5 * N.y;
  vec3 amb = (uSkyCol * (0.25 + 0.6 * up) * 1.1 + uBounceCol * (0.75 - 0.6 * up)) * vL.y;
  // wool: fibre ends seen end-on in the middle, strands combed out toward the edge
  float st = 0.8 + 0.36 * gcNoise(vQ * 10. + seed * 50.);
  float strand = 0.86 + 0.3 * gcNoise(vec2(rr * 5. + seed * 3., (dq.x * 2.3 + dq.y * 1.7) * 6. + seed * 11.));
  vec3 alb = vC * mix(st, strand, smoothstep(0.35, 0.85, rr));
  // a blossom: a saffron heart, petals a shade deeper toward it and between them
  alb = mix(alb, uHeart, isB * (1. - smoothstep(0.2, 0.3, rr)));
  alb *= 1. - 0.3 * isB * (1. - notch) * smoothstep(0.3, 0.9, rr);
  alb *= 1. - 0.45 * isBed * smoothstep(0.1, -0.9, vQ.y);
  vec3 c = alb * (uSunCol * vL.x * ndl * (0.3 + 0.7 * vL.z) + amb + vWarm * vL.y);
  float rim = 1. - nz;
  c += alb * rim * rim * (amb * 0.9 + uSunCol * vL.x * 0.3 * vL.z);
  gl_FragColor = vec4(c, 1.);
  vec2 zw = mix(vZW.xy, vZW.zw, nz);                       // the ball's own depth, so that balls cut into one another as balls
  gl_FragDepth = clamp(zw.x / max(zw.y, 1e-4) * 0.5 + 0.5, 0., 1.);
  #include <fog_fragment>
}`,j0=p=>`
${p.common}
${p.light}
attribute vec4 aJet;    // azimuth, radial speed, vertical speed, phase
attribute vec4 aJet2;   // start height, start radius, loop radius, loop turns
attribute vec4 aJet3;   // height it lands at, thickness, tint, rise delay
uniform vec3 uOrigin, uCamW; uniform float uFount;
varying vec3 vP; varying vec3 vN; varying vec4 vS; varying float vSun;
#include <fog_pars_vertex>
vec3 jet(float s, float k){
  float g = 18.;
  float vy = aJet.z * sqrt(k), vr = aJet.y * (0.35 + 0.65 * k);
  float y0 = aJet2.x * k, yEnd = min(aJet3.x, y0);
  float T = (vy + sqrt(vy * vy + 2. * g * max(y0 - yEnd, 0.))) / g;
  float t = s * T;
  vec3 dir = vec3(cos(aJet.x), 0., sin(aJet.x));
  vec3 P = dir * (aJet2.y + vr * t) + vec3(0., y0 + vy * t - 0.5 * g * t * t, 0.);
  float ca = s * 6.2832 * aJet2.w - uTime * 1.2 + aJet.w;
  float cr = aJet2.z * k * sin(3.14159 * min(s * 1.2, 1.)) * (0.4 + 0.6 * s);
  P += vec3(-dir.z, 0., dir.x) * (cos(ca) * cr) + (dir * 0.5 + vec3(0., 0.7, 0.)) * (sin(ca) * cr);
  return P;
}
void main(){
  float s = position.y;
  float k = clamp(uFount * 1.25 - aJet3.w * 0.25, 0.0004, 1.);
  k *= 0.93 + 0.07 * sin(uTime * 1.7 + aJet.w * 3.);          // the jets breathe
  vec3 c0 = jet(s, k), c1 = jet(s + 0.012, k);
  vec3 T = normalize(c1 - c0 + vec3(0., 1e-4, 0.));
  vec3 side = vec3(-sin(aJet.x), 0., cos(aJet.x));
  vec3 Bn = normalize(cross(T, side) + vec3(1e-4, 0., 0.));
  vec3 Nn = cross(Bn, T);
  float dist = length(c0 - (uCamW - uOrigin));
  float rad = max(aJet3.y * (1. - 0.4 * s), dist * 0.0018) * smoothstep(0.0, 0.03, s) * smoothstep(0., 0.06, uFount);
  vec3 n = Bn * position.x + Nn * position.z;
  vec3 P = c0 + n * rad;
  float wgs = gcWaveLift(0.);
  P.x += P.y * wgs * (-uWave.x / max(uWave.z, 1.)) * 0.15;
  P.y += wgs;
  vP = P; vN = normalize(n + vec3(0., 1e-5, 0.)); vS = vec4(s, uv.x, aJet3.z, aJet.w);
  vSun = gcSun(c0);
  vec4 mvPosition = viewMatrix * vec4(P + uOrigin, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,X0=p=>`
${p.common}
uniform vec3 uCamW, uOrigin, uSilkA, uSilkB; uniform float uSilkGlow;
varying vec3 vP; varying vec3 vN; varying vec4 vS; varying float vSun;
#include <fog_pars_fragment>
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.));
  vec3 V = normalize(uCamW - uOrigin - vP + vec3(0., 1e-4, 0.));
  float ndv = abs(dot(N, V));
  // silk: plies wound round the thread, a lustre that runs along it with the flow
  float ply = 0.75 + 0.25 * sin(vS.y * 12.566 + vS.x * 90.);
  float run = 0.5 + 0.5 * sin(vS.x * 46. - uTime * 3.2 + vS.w * 5.);
  vec3 alb = mix(uSilkA, uSilkB, vS.z) * ply;
  float ndl = clamp(dot(N, uSunDir) * 0.6 + 0.4, 0., 1.);
  float up = 0.5 + 0.5 * N.y;
  vec3 amb = uSkyCol * (0.3 + 0.7 * up) * 1.2 + uBounceCol * (0.7 - 0.5 * up);
  vec3 c = alb * (uSunCol * vSun * ndl * 1.15 + amb + gcWarm(vP, N));
  float sheen = (1. - ndv); sheen *= sheen;
  c += (uSkyCol * 1.3 + uSunCol * vSun * 0.9) * (0.25 * ndv * ndv * run * run + 0.5 * sheen) * mix(uSilkB, vec3(1.), 0.5);
  c += alb * uSilkGlow * (0.4 + 0.6 * run);
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`,Y0=p=>`
${p.common}
${p.light}
attribute vec4 aB1;   // where it is (hero-local), wing phase
attribute vec4 aB2;   // which way it flies (unit), size (0 = not out yet)
uniform vec3 uOrigin;
varying vec2 vLW; varying vec3 vN; varying vec4 vL; varying vec3 vWarm;
#include <fog_pars_vertex>
void main(){
  float l = position.x * 4.6, w = position.y * 5.8, aw = abs(w);
  float fl = sin(aB1.w);
  float ext = max(aw - 0.8, 0.);
  float th = 0.18 + 0.95 * fl - 0.5 * cos(aB1.w) * smoothstep(2., 5.8, aw);
  float y = ext * sin(th) + 0.5 * fl * (1. - smoothstep(0., 2., aw));
  float wy = sign(w) * (min(aw, 0.8) + ext * cos(th));
  // a woven bird is drawn in plan: it keeps its back turned most of the way to the eye, and flies along what the eye
  // sees of its heading (straight up the cloth when it flies straight away)
  vec3 toC = normalize(cameraPosition - uOrigin - aB1.xyz);
  vec3 n0 = normalize(toC + vec3(0., 0.45, 0.));
  vec3 fd = normalize(aB2.xyz + vec3(1e-4, 0., 0.));
  vec3 f = normalize(fd - n0 * dot(fd, n0) + (vec3(0., 1., 0.) - n0 * n0.y) * 0.35 + vec3(1e-4, 0., 0.));
  vec3 rt = normalize(cross(f, n0) + vec3(0., 0., 1e-4));
  vec3 upv = cross(rt, f);
  vec3 P = aB1.xyz + aB2.w * (f * l + rt * wy + upv * y);
  vLW = vec2(l, w);
  vN = normalize(upv * cos(th) - rt * sign(w) * sin(th) * step(0.8, aw) + vec3(0., 1e-4, 0.));
  float sun = gcSun(aB1.xyz);
  vL = vec4(sun, gAO, aB1.w, aB2.w);
  vWarm = gcWarm(aB1.xyz, vec3(0., 1., 0.));
  vec4 mvPosition = viewMatrix * vec4(P + uOrigin, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Z0=p=>`
${p.common}
uniform vec3 uBirdA, uBirdB, uBirdC; uniform float uBirdGlow;
varying vec2 vLW; varying vec3 vN; varying vec4 vL; varying vec3 vWarm;
#include <fog_pars_fragment>
float bEll(vec2 p, vec2 r){ return (length(p / r) - 1.) * min(r.x, r.y); }
void main(){
  vec2 fw2 = fwidth(vLW); float fw = max(max(fw2.x, fw2.y), 1e-4);
  float KN = 0.36;
  float snapK = 1. - smoothstep(0.1, 0.22, fw);
  vec2 kc = (floor(vLW / KN) + 0.5) * KN;
  vec2 p = mix(vLW, kc, snapK);
  float aw = abs(p.y), l = p.x;
  // a swallow in plan: a full body, a round head and a beak, two long wings swept back to a point, a forked tail
  float dB = bEll(vec2(l - 0.5, p.y), vec2(2.6, 1.15));
  float dH = length(vec2(l - 3.05, p.y)) - 0.95;
  float dK = max(abs(l - 4.1) - 0.5, abs(p.y) - 0.3 * (1. - (l - 3.6)));
  float tl = -l - 1.9;                                                 // along the tail, from its root
  float dT = max(abs(aw - 0.2 - tl * 0.5) - (0.5 - 0.1 * tl), max(-l - 4.6, l + 1.9));
  float wx = aw - 0.7;
  float lead = 1.95 - 0.5 * wx - 0.04 * wx * wx, trail = -1.05 - 0.2 * wx + 0.3 * abs(fract(wx / 1.25) - 0.5);
  float dW = max(max(l - lead, trail - l), max(aw - 5.7, 0.7 - aw)) * 0.9;
  float dd = min(min(dB, dH), min(min(dK, dT), dW));
  if (dd > 0.) discard;
  vec3 I = uPal[0], Nn = uPal[2], S = uPal[4];
  vec3 col = uBirdA;
  float onW = step(dW, 0.) * step(0., min(dB, dH));
  col = mix(col, uBirdB, onW);
  col = mix(col, uBirdC, onW * step(l, trail + 0.75));                 // the flight feathers along the trailing edge
  col = mix(col, uBirdA, onW * step(4.3, aw));                         // the wing tips in the body's dye
  col = mix(col, uBirdC, step(dT, 0.) * step(0., dB) * step(1.2, tl));
  col = mix(col, I, step(dB, -0.25) * step(l, 1.7) * step(abs(p.y), 0.5));
  col = mix(col, S, step(dK, 0.));
  col = mix(col, Nn, step(length(vec2(l - 3.3, aw - 0.42)), 0.24));
  col = mix(col, mix(Nn, col, 0.3), step(-0.3, dd) * (1. - step(dK, 0.)) * snapK);   // a dark edge, where the knots can be told apart
  vec2 kf = fract(vLW / KN) - 0.5;
  float knot = mix(1., 1.02 + 0.5 * dot(kf, vec2(0.7, 0.5)) - 0.4 * smoothstep(0.36, 0.5, max(abs(kf.x), abs(kf.y))), snapK);
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.));
  float ndl = 0.45 + 0.55 * abs(dot(N, uSunDir));
  vec3 amb = uSkyCol * 1.05 + uBounceCol * 0.6;
  vec3 c = col * knot * (uSunCol * vL.x * ndl + amb * vL.y + vWarm);
  c += col * uBirdGlow;
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`;function Nt(){const p=[],Y=[],$=[],E=[],ht=[],nt=[],_=[],F=[],Q=h(),T=h(),xt=new i.Color,at=new i.Matrix3,wt={get triangles(){return F.length/3},add(j,K={}){const A=K.m||null,St=p.length/3,yt=j.attributes.position,rt=j.attributes.normal,U=j.attributes.uv,k=j.attributes.sw,tt=j.attributes.cv;A&&at.getNormalMatrix(A);const Ht=xt.set(K.color??"#ffffff"),Wt=Ht.r,dt=Ht.g,gt=Ht.b,Ct=K.uvScale||[1,1],kt=K.mat??0,Rt=K.par??0;for(let X=0;X<yt.count;X++){if(Q.fromBufferAttribute(yt,X),T.fromBufferAttribute(rt,X),K.anim){const Tt=K.anim(Q.x,Q.y,Q.z,k?k.getX(X):0);_.push(Tt[0],Tt[1],Tt[2])}else _.push(0,0,0);A&&(Q.applyMatrix4(A),T.applyMatrix3(at).normalize()),p.push(Q.x,Q.y,Q.z),Y.push(T.x,T.y,T.z);let zt=1;K.shade&&(zt=K.shade(Q.x,Q.y,Q.z)),tt?$.push(tt.getX(X)*zt,tt.getY(X)*zt,tt.getZ(X)*zt):$.push(Wt*zt,dt*zt,gt*zt),K.uvSwap?E.push(U.getY(X)*Ct[0],U.getX(X)*Ct[1]):E.push(U?U.getX(X)*Ct[0]:0,U?U.getY(X)*Ct[1]:0),ht.push(kt,Rt),nt.push(k?k.getX(X)*(K.sway??1):0)}const ut=j.index;if(ut)for(let X=0;X<ut.count;X++)F.push(St+ut.getX(X));else for(let X=0;X<yt.count;X++)F.push(St+X);return j.dispose(),wt},build(j){const K=new i.BufferGeometry;return K.setAttribute("position",new i.Float32BufferAttribute(p,3)),K.setAttribute("normal",new i.Float32BufferAttribute(Y,3)),K.setAttribute("aCol",new i.Float32BufferAttribute($,3)),K.setAttribute("uv",new i.Float32BufferAttribute(E,2)),K.setAttribute("aMat",new i.Float32BufferAttribute(ht,2)),j?K.setAttribute("aAnim",new i.Float32BufferAttribute(_,3)):K.setAttribute("aSway",new i.Float32BufferAttribute(nt,1)),K.setIndex(F),K.computeBoundingSphere(),K}};return wt}const M=(p,Y,$,E=0,ht=0,nt=0,_=1,F=_,Q=_)=>new i.Matrix4().compose(h(p,Y,$),new i.Quaternion().setFromEuler(new i.Euler(E,ht,nt,"YXZ")),h(_,F,Q));function W(p,Y,$,E,ht=3){const nt=Math.max(2,ht*2),_=new i.BoxGeometry(p,Y,$,nt,nt,nt),F=_.attributes.position,Q=_.attributes.normal,T=_.attributes.uv,xt=p/2-E,at=Y/2-E,wt=$/2-E,j=h(),K=h();for(let A=0;A<F.count;A++){j.fromBufferAttribute(F,A),K.set(Lt(j.x,-xt,xt),Lt(j.y,-at,at),Lt(j.z,-wt,wt)),j.sub(K);const St=j.length();St>1e-6?j.multiplyScalar(1/St):j.fromBufferAttribute(Q,A),Q.setXYZ(A,j.x,j.y,j.z),F.setXYZ(A,K.x+j.x*E,K.y+j.y*E,K.z+j.z*E);const yt=Math.abs(Q.getX(A)),rt=Math.abs(Q.getY(A)),U=Math.abs(Q.getZ(A));rt>=yt&&rt>=U?T.setXY(A,F.getX(A),F.getZ(A)):yt>=U?T.setXY(A,F.getY(A),F.getZ(A)):T.setXY(A,F.getY(A),F.getX(A))}return _}function st(p,Y=20){const $=p.map(([F,Q])=>new i.Vector2(Math.max(F,.001),Q)),E=new i.LatheGeometry($,Y),ht=E.attributes.uv,nt=E.attributes.position;let _=0;for(const[F]of p)_=Math.max(_,F);for(let F=0;F<ht.count;F++)ht.setXY(F,ht.getX(F)*6.2832*_,nt.getY(F));return E}function At(p,Y,$=7,E={}){const ht=p.length,nt=[],_=[],F=[],Q=[],T=[],xt=h(),at=h(0,1,0),wt=h(),j=h(),K=new i.Quaternion,A=h();let St=0;for(let rt=0;rt<ht;rt++){const U=p[Math.max(rt-1,0)],k=p[Math.min(rt+1,ht-1)];if(xt.subVectors(k,U).normalize(),rt===0)at.set(0,1,0),Math.abs(xt.y)>.9&&at.set(1,0,0),wt.crossVectors(xt,at).normalize(),at.crossVectors(wt,xt).normalize();else{A.crossVectors(j,xt);const dt=A.length();dt>1e-6&&(K.setFromAxisAngle(A.multiplyScalar(1/dt),Math.asin(Math.min(dt,1))),at.applyQuaternion(K)),wt.crossVectors(xt,at).normalize(),at.crossVectors(wt,xt).normalize(),St+=p[rt].distanceTo(p[rt-1])}j.copy(xt);const tt=rt/(ht-1),Ht=Y(tt),Wt=Math.max(E.uvRadius??Y(.5),.05);for(let dt=0;dt<=$;dt++){const gt=dt/$*Math.PI*2+(E.twist?St/Wt*E.twist:0),Ct=Math.cos(gt),kt=Math.sin(gt),Rt=E.ply?1+E.ply*Math.sin(2*(dt/$*Math.PI*2)+St/Wt*.9):1,ut=wt.x*Ct+at.x*kt,X=wt.y*Ct+at.y*kt,zt=wt.z*Ct+at.z*kt;nt.push(p[rt].x+ut*Ht*Rt,p[rt].y+X*Ht*Rt,p[rt].z+zt*Ht*Rt),_.push(ut,X,zt),F.push(dt/$,St/Wt*.5),Q.push(E.sway?E.sway(tt):0)}}for(let rt=0;rt<ht-1;rt++)for(let U=0;U<$;U++){const k=rt*($+1)+U,tt=k+$+1;T.push(k,tt,k+1,k+1,tt,tt+1)}const yt=new i.BufferGeometry;return yt.setAttribute("position",new i.Float32BufferAttribute(nt,3)),yt.setAttribute("normal",new i.Float32BufferAttribute(_,3)),yt.setAttribute("uv",new i.Float32BufferAttribute(F,2)),yt.setAttribute("sw",new i.Float32BufferAttribute(Q,1)),yt.setIndex(T),yt}const Qt=(p,Y)=>new i.CatmullRomCurve3(p,!1,"centripetal").getSpacedPoints(Y);function Dt(p,Y,$,E,ht){const nt=new i.BufferGeometry,_=h().subVectors(Y,p).cross(h().subVectors(E,p)).normalize();return nt.setAttribute("position",new i.Float32BufferAttribute([p.x,p.y,p.z,Y.x,Y.y,Y.z,$.x,$.y,$.z,E.x,E.y,E.z],3)),nt.setAttribute("normal",new i.Float32BufferAttribute([_.x,_.y,_.z,_.x,_.y,_.z,_.x,_.y,_.z,_.x,_.y,_.z],3)),nt.setAttribute("uv",new i.Float32BufferAttribute(ht,2)),nt.setIndex([0,1,2,0,2,3]),nt}const Q0={spring:{fog:[.215,.187,.152],dens:6e-4,skyLo:[1.9,1.62,.98],skyHi:[.5,.9,1.8],hedge:[.3,.46,.2],leaf:[.05,.085,.035],glow:[3,2.4,1.4],glare:[1.25,1.15,.9],out:[0,0,1,1],leafK:.45,sway:1,branch:.3,lattice:.45,cloud:.08,shaft:.15,amb:1,wallK:.38,stove:.3,lamp:0,cordWarm:[.09,.055,.02],wallA:[.34,.38,.27],wallB:[.55,.5,.36],paint:[.62,.57,.45],portal:"#ffd9a0",post:{exposure:1,tint:"#fff5e4",shadowTint:"#0a1026",sat:1.06}},golden:{fog:[.27,.19,.125],dens:64e-5,skyLo:[2.5,1.45,.55],skyHi:[.85,.75,1.1],hedge:[.5,.33,.1],leaf:[.09,.06,.02],glow:[4,2.2,.8],glare:[1.6,1,.5],out:[0,0,1,1.2],leafK:.45,sway:1,branch:.3,lattice:.45,cloud:.08,shaft:.17,amb:1,wallK:.38,stove:.35,lamp:0,cordWarm:[.08,.045,.015],wallA:[.34,.38,.27],wallB:[.55,.5,.36],paint:[.62,.57,.45],portal:"#ffc27a",post:{exposure:1,tint:"#ffeed2",shadowTint:"#120b22",sat:1.08}},winter:{fog:[.2,.215,.25],dens:6e-4,skyLo:[1.55,1.62,1.75],skyHi:[.95,1.15,1.6],hedge:[1.25,1.35,1.55],leaf:[.07,.06,.06],glow:[2.2,2.2,2.4],glare:[1.1,1.2,1.4],out:[1,0,1.15,.8],leafK:.34,sway:.5,branch:.8,lattice:.55,cloud:.1,lampReach:165,shaft:.15,amb:1,wallK:.6,stove:1,lamp:1.15,cordWarm:[.33,.185,.055],wallA:[.27,.31,.22],wallB:[.6,.5,.3],paint:[.66,.6,.47],portal:"#ffe2b8",post:{exposure:.97,tint:"#f6f5f6",shadowTint:"#0c1836",sat:1.06}},night:{fog:[.034,.04,.085],dens:58e-5,skyLo:[.85,.46,.3],skyHi:[.03,.05,.15],hedge:[.02,.022,.05],leaf:[.008,.01,.022],glow:[1.3,1.6,2.3],glare:[.34,.27,.34],out:[0,1,1,.9],leafK:.45,sway:.7,branch:.52,cloud:.2,shaft:.12,amb:1.15,wallK:1,stove:.42,lamp:.46,cordWarm:[.2,.115,.04],wallA:[.32,.37,.3],wallB:[.52,.5,.4],paint:[.6,.57,.48],portal:"#ffcf80",post:{exposure:1.58,tint:"#ece8f6",shadowTint:"#0a0822",sat:1.02}}};var ea={id:"garden-carpet",name:"The Garden Underfoot",category:"domestic",weirdness:.45,media:["interior","tiny","air"],async build(p){const Y=p.rng.fork("garden-carpet-world"),$=p.quality?.detail??1,E=p.vary||{},ht=Lt(E.density??1,.7,1.3),nt=E.hour||"any",_=Y(),F=nt==="dawn"?"winter":nt==="night"?"night":nt==="day"||nt==="golden"||_<.46?"spring":_<.74?"winter":"night",Q=F==="spring"&&nt==="golden"?"golden":F,T=Q0[Q],xt=Y();let at=["tabby","white","black"][Math.floor(xt*400)%3];at==="black"&&F==="night"&&(at="tabby"),at==="black"&&E.rare&&(at="white");const wt=Y.chance(.6)?4:1,j=Y.chance(.4),K=!!E.rare,A=t=>new i.Color().setRGB(t[0],t[1],t[2]),St=new i.Scene,yt=A(T.fog);St.fog=new i.FogExp2(yt,T.dens),St.background=yt.clone();const rt=new i.Group;rt.position.set(0,0,ct),St.add(rt);const U=await B0(p,{variant:F,rare:K});U.object.position.set(0,0,0),rt.add(U.object),U.setLighting({sunDir:O0,window:I,branchLine:[560,130,330,300],leaf:T.leafK,posts:bt.bay,mullions:[bt.zc,bt.half,bt.post,bt.transom],transoms:[bt.first,bt.tHalf,bt.south],branch:T.branch,sway:T.sway,cloud:T.cloud,lattice:T.lattice??1}),Q==="golden"&&U.setLighting({sunColor:A([1.1,.68,.33]),skyColor:A([.25,.25,.36]),bounceColor:A([.42,.25,.12])}),F==="winter"&&U.setLighting({sunColor:A([.9,.845,.77]),skyColor:A([.195,.285,.53]),bounceColor:A([.24,.215,.21])}),F==="night"&&U.setLighting({sunColor:A([.42,.52,.82]),skyColor:A([.17,.215,.39]),bounceColor:A([.17,.12,.13])}),U.setLighting({ambTint:A(F==="winter"?[1.34,1.08,.74]:F==="night"?[1,1,1]:[1.12,1,.86])}),U.uniforms.uPenK.value=F==="winter"?1.05:1.5;const k=U.uniforms.uPal.value,tt=U.uniforms,Ht=tt.uLampC.value;await p.yield();const Wt={x:-116,z:-322,yaw:.22},dt={x:206,z:72,r:11},gt={x:-166,z:-60},Ct={x:-158,z:66,y:148},kt={x:-200,z:j?-92:-150},Rt={x:-520,z:-430},ut={hx:78,z0:400,z1:560,top:128},X={x0:-520,x1:-190,h:560,d:84},zt={x:205,z:-612},Tt={x:212,z:312,psi:-.349},re=[Math.sin(Tt.psi),-Math.cos(Tt.psi)],ye=[-re[1],re[0]],jt=(t,e,l=0)=>[Tt.x+re[0]*(64-t)+ye[0]*l,e,Tt.z+re[1]*(64-t)+ye[1]*l],ot={y:35,z0:-310,z1:-460,r:35,hollow:11},He=Math.cos(Wt.yaw),je=Math.sin(Wt.yaw),Oe=(t,e,l)=>[Wt.x+t*He+l*je,e,Wt.z-t*je+l*He];U.setOccluders([{a:[0,ot.y,ot.z0-4],b:[0,ot.y,ot.z1],r:ot.r},{a:Oe(-30,27,0),b:Oe(30,27,0),r:31},{a:Oe(44,34,-26),r:19},{a:[dt.x,dt.r+2,dt.z],r:dt.r},j?null:{a:[gt.x-24,9,gt.z-17],b:[gt.x+26,10,gt.z-21],r:10.5},j?null:{a:[gt.x-30,9,gt.z+20],b:[gt.x+20,10,gt.z+27],r:10.5},{a:[-212,0,140],b:[-212,100,140],r:7.5},{a:[-212,0,-10],b:[-212,100,-10],r:7.5},{a:[-ut.hx,0,ut.z0],b:[-ut.hx,110,ut.z0],r:7},{a:[ut.hx,0,ut.z0],b:[ut.hx,110,ut.z0],r:7},{a:[0,ut.top,ut.z0+30],b:[0,ut.top,ut.z1-30],r:72},{a:[kt.x,14,kt.z],b:[kt.x,74,kt.z],r:20},{a:jt(0,0,-78),b:jt(0,118,-78),r:6.2},{a:jt(0,0,78),b:jt(0,118,78),r:6.2}]);const be=[3.3,1.2,.32],xe=[2.7,1.42,.52];U.setLamps([{p:[Rt.x+96,82,Rt.z],reach:310,color:be.map(t=>t*T.stove),wrap:.6},{p:[kt.x,56,kt.z],reach:T.lampReach||250,color:xe.map(t=>t*T.lamp),wrap:.75}]);const Se=C0(U.glsl),Ft={uOrigin:{value:h(0,0,ct)},uWallA:{value:A(T.wallA)},uWallB:{value:A(T.wallB)},uPaint:{value:A(T.paint)},uOak:{value:A([.34,.225,.115])},uGlare:{value:A(T.glare)},uFurDark:{value:A([.36,.32,.3])},uWallK:{value:T.wallK},uRoom:{value:new i.Vector4(T.amb,at==="tabby"?1:0,F==="night"?1:0,1)},uTail:{value:new i.Vector4(.24,.97,0,0)},uGlowK:{value:new i.Vector2(T.stove,T.lamp)},uBlob:{value:[new i.Vector4(Rt.x,Rt.z,66,66),new i.Vector4((X.x0+X.x1)/2,Pt.n+X.d/2,(X.x1-X.x0)/2,X.d/2+2),new i.Vector4(zt.x,zt.z+2,70,62),new i.Vector4(366,Pt.n+22,86,10)]},uIvory:{value:k[0].clone().multiplyScalar(1.12)},uCordWarm:{value:new i.Color(0,0,0)}},oe={value:5},Kt=(t,e=[-1,-1],l={})=>new i.ShaderMaterial({uniforms:Object.assign(i.UniformsUtils.merge([i.UniformsLib.fog]),tt,Ft,{uOccSkip:{value:new i.Vector2(e[0],e[1])},uPenK:l.pen?{value:l.pen}:oe,uShell:{value:l.shell??0}},l.cordWarm?{uCordWarm:{value:A(l.cordWarm)}}:{}),vertexShader:t,fragmentShader:Se,fog:!0,side:l.side??i.FrontSide}),lt=(t,e,l,a=!0)=>{const s=new i.Mesh(t,e);return s.name=l,s.frustumCulled=a,rt.add(s),s},h0=Kt(Et,[-1,-1],{pen:9});{const t=Nt(),e=Pt,l=240.6,a=390.4,s=(c,P,w,m)=>t.add(Dt(h(c,0,m),h(P,0,m),h(P,0,w),h(c,0,w),[0,0,1,0,1,1,0,1]),{mat:d.FLOOR});s(e.w,e.e,a,e.s),s(e.w,e.e,e.n,-a),s(e.w,-l,-a,a),s(l,e.e,-a,a);const o=(c,P,w,m,u,S,g=0)=>{const B=Math.hypot(w-c,m-P);t.add(Dt(h(c,u,P),h(w,u,m),h(w,S,m),h(c,S,P),[g,u,g+B,u,g+B,S,g,S]),{mat:d.WALL})};o(e.w,e.n,e.e,e.n,0,e.top),o(e.e,e.s,e.w,e.s,0,e.top),o(e.w,e.s,e.w,e.n,0,e.top);const r=I.zc-I.hz,f=I.zc+I.hz;o(e.e,e.n,e.e,e.s,0,I.y0),o(e.e,e.n,e.e,e.s,I.y1,e.top),o(e.e,e.n,e.e,r,I.y0,I.y1),o(e.e,f,e.e,e.s,I.y0,I.y1,f-e.n),t.add(Dt(h(e.w,e.top,e.n),h(e.e,e.top,e.n),h(e.e,e.top,e.s),h(e.w,e.top,e.s),[e.w,e.n,e.e,e.n,e.e,e.s,e.w,e.s]),{mat:d.CEIL,color:A([.4,.36,.3])}),await p.yield();const b=A([.3,.17,.075]),v=A([1,1,1]),n={x0:300,x1:540,h:620},x=(c,P,w,m)=>t.add(W(c,60,9,3,1),{m:M(P,30,w,0,m,0),mat:d.WOOD,color:b});x(n.x0-26-e.w,(e.w+n.x0-26)/2,e.n+4.5,0),x(e.e-n.x1-26,(e.e+n.x1+26)/2,e.n+4.5,0),x(e.e-e.w,20,e.s-4.5,0),x(e.s-e.n,e.w+4.5,(e.s+e.n)/2,Math.PI/2),x(e.s-e.n,e.e-4.5,(e.s+e.n)/2,Math.PI/2),t.add(Dt(h(n.x0,0,e.n+3),h(n.x1,0,e.n+3),h(n.x1,n.h,e.n+3),h(n.x0,n.h,e.n+3),[0,0,240,0,240,n.h,0,n.h]),{mat:d.DOOR,color:v});const z=A(T.paint).multiplyScalar(1.05);t.add(W(26,n.h+13,12,4,1),{m:M(n.x0-13,(n.h+13)/2,e.n+6),mat:d.PLAIN,color:z}),t.add(W(26,n.h+13,12,4,1),{m:M(n.x1+13,(n.h+13)/2,e.n+6),mat:d.PLAIN,color:z}),t.add(W(292,30,14,4,1),{m:M(420,n.h+15,e.n+7),mat:d.PLAIN,color:z}),t.add(new i.SphereGeometry(7,12,8),{m:M(n.x0+24,300,e.n+14),mat:d.BRASS,color:A([.3,.215,.1])}),t.add(st([[.1,0],[12,0],[12,2],[4,3],[3.4,8]],12),{m:M(n.x0+24,300,e.n+3,Math.PI/2,0,0),mat:d.BRASS,color:A([.8,.55,.2])});{const u=e.n+3;t.add(Dt(h(-4-256/2,480-174/2,u),h(-4+256/2,480-174/2,u),h(-4+256/2,480+174/2,u),h(-4-256/2,480+174/2,u),[0,0,1,0,1,1,0,1]),{mat:d.PICTURE});const S=A([.17,.085,.04]),g=A([.6,.43,.16]);for(const B of[-1,1])t.add(W(300,22,12,4,1),{m:M(-4,480+B*(174/2+11),u+4),mat:d.WOOD,color:S}),t.add(W(22,178,12,4,1),{m:M(-4+B*(256/2+11),480,u+4),mat:d.WOOD,color:S}),t.add(W(260,4,13,1.5,1),{m:M(-4,480+B*(174/2+1.5),u+4),mat:d.BRASS,color:g}),t.add(W(4,178,13,1.5,1),{m:M(-4+B*(256/2+1.5),480,u+4),mat:d.BRASS,color:g})}await p.yield();const y=A([.2,.115,.05]);t.add(W(18,22,2*I.hz+44,4,1),{m:M(e.e-9,I.y1+11,I.zc),mat:d.WOOD,color:y}),t.add(W(34,12,2*I.hz+60,4,1),{m:M(e.e-15,I.y0-6,I.zc),mat:d.WOOD,color:y});for(const c of[r-11,f+11])t.add(W(18,I.y1-I.y0,22,4,1),{m:M(e.e-9,(I.y0+I.y1)/2,c),mat:d.WOOD,color:y});for(let c=-4;c<=4;c++){const P=bt.zc+Math.sign(c)*bt.half+(c-Math.sign(c))*bt.bay+(c>=3?bt.south:0);c!==0&&P>r+30&&P<f-30&&t.add(W(14,I.y1-I.y0,2*bt.post+2,4,1),{m:M(e.e-6,(I.y0+I.y1)/2,P),mat:d.WOOD,color:y})}for(let c=I.y0+bt.first;c<I.y1-20;c+=bt.transom)t.add(W(13,2*bt.tHalf+2,2*I.hz,3,1),{m:M(e.e-6,c,I.zc),mat:d.WOOD,color:y});await p.yield(),lt(t.build(),h0,"room",!1)}await p.yield();const Yt=()=>i.UniformsUtils.merge([i.UniformsLib.fog]);{const t=I.zc-I.hz,e=I.zc+I.hz,l=Pt.e-1.5,a=Dt(h(l,I.y0,t),h(l,I.y0,e),h(l,I.y1,e),h(l,I.y1,t),[0,0,1,0,1,1,0,1]),s=new i.ShaderMaterial({uniforms:Object.assign(Yt(),tt,{uOrigin:Ft.uOrigin,uSkyLo:{value:A(T.skyLo)},uSkyHi:{value:A(T.skyHi)},uHedge:{value:A(T.hedge)},uLeaf:{value:A(T.leaf)},uBar:{value:A([.22,.13,.06])},uGlow:{value:A(T.glow)},uOut:{value:new i.Vector4().fromArray(T.out)}}),vertexShader:R0,fragmentShader:T0(U.glsl),fog:!0});lt(a,s,"window")}const ze=h(0,9,62),v0={value:qe.map(t=>new i.Vector4(t[0],t[1],t[2],t[3]))};{const e=[],l=[];for(let r=0;r<=18;r++)e.push(-1,r/18,0,1,r/18,0);for(let r=0;r<18;r++){const f=r*2;l.push(f,f+1,f+2,f+1,f+3,f+2)}const a=new i.InstancedBufferGeometry;a.setAttribute("position",new i.Float32BufferAttribute(e,3)),a.setIndex(l),a.setAttribute("aBeam",new i.InstancedBufferAttribute(new Float32Array(qe.flat()),4)),a.instanceCount=qe.length;const s=new i.ShaderMaterial({uniforms:Object.assign({},tt,{uOrigin:Ft.uOrigin,uCamW:{value:ze},uShaft:{value:T.shaft},uFogD:{value:T.dens}}),vertexShader:U0(U.glsl),fragmentShader:L0(U.glsl),transparent:!0,depthWrite:!1,blending:i.AdditiveBlending,side:i.DoubleSide}),o=lt(a,s,"shafts",!1);o.renderOrder=2}{const t=Math.round(1700*$*ht),e=new i.InstancedBufferGeometry;e.setAttribute("position",new i.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),e.setIndex([0,1,2,0,2,3]);const l=new Float32Array(t*4),a=Y.fork("motes");for(let r=0;r<t*4;r++)l[r]=a();e.setAttribute("aSeed",new i.InstancedBufferAttribute(l,4)),e.instanceCount=t;const s=new i.ShaderMaterial({uniforms:Object.assign({},tt,{uOrigin:Ft.uOrigin,uCamW:{value:ze},uBeam:v0}),vertexShader:I0(U.glsl),fragmentShader:D0,transparent:!0,depthWrite:!1,blending:i.AdditiveBlending}),o=lt(e,s,"lint",!1);o.renderOrder=3}const Xe=[];if(K){const t=[],e=[],l=[];for(let r=0;r<=390;r++)for(let f=0;f<=8;f++)t.push(0,0,-390+r*2),e.push(f/8,r/390);for(let r=0;r<390;r++)for(let f=0;f<8;f++){const b=r*9+f,v=b+8+1;l.push(b,v,b+1,b+1,v,v+1)}const o=new i.BufferGeometry;o.setAttribute("position",new i.Float32BufferAttribute(t,3)),o.setAttribute("uv",new i.Float32BufferAttribute(e,2)),o.setIndex(l),await p.yield();for(let r=0;r<=2;r++){const f=lt(o,new i.ShaderMaterial({uniforms:Object.assign(Yt(),tt,{uOccSkip:{value:new i.Vector2(-1,-1)},uPenK:{value:1.5},uShell:{value:r/2}}),vertexShader:K0(U.glsl),fragmentShader:V0(U.glsl),fog:!0,side:i.DoubleSide}),r?"wave-crest-tufts"+r:"wave-crest",!1);f.visible=!1,Xe.push(f)}}await p.yield();{const t=(s,o)=>{const r=[],f=[],b=[];for(let v=0;v<=o;v++)for(let n=0;n<=s;n++){const x=n/s*Math.PI*2;r.push(Math.cos(x),v/o,Math.sin(x)),f.push(n/s,v/o)}for(let v=0;v<o;v++)for(let n=0;n<s;n++){const x=v*(s+1)+n,z=x+s+1;b.push(x,z,x+1,x+1,z,z+1)}return{pos:r,uv:f,idx:b}},e=Y.fork("fringe"),l=new i.ShaderMaterial({uniforms:Object.assign(Yt(),tt,Ft,{uOccSkip:{value:new i.Vector2(-1,-1)},uPenK:oe,uCordWarm:{value:A(T.cordWarm)}}),vertexShader:W0,fragmentShader:Se,fog:!0}),a=(s,o)=>{const r=[],f=[];for(let z=0;z<o;z++){const y=-239+478*(z+e())/o;if(s&&(Math.abs(y)<9.5||Math.abs(Math.abs(y)-ut.hx)<10))continue;const c=(Math.floor(z/3)%2?1:-1)*.12,P=s?Math.max(0,1-Math.abs(y)/55):0,w=(s?0:Math.PI)+c+e.range(-.42,.42)*(1-.6*P)+Math.sign(y)*.34*P;r.push(y,s?390.3:-390.3,w,e()),f.push(e.range(24,34),s?Z(e.range(6,14),e.range(3.5,7.5),P*P):e.range(3,10),e.range(.3,.43),e.range(.82,1.08))}const b=new i.InstancedBufferGeometry,{pos:v,uv:n,idx:x}=s?t(8,20):t(5,10);b.setAttribute("position",new i.Float32BufferAttribute(v,3)),b.setAttribute("uv",new i.Float32BufferAttribute(n,2)),b.setIndex(x),b.setAttribute("aRoot",new i.InstancedBufferAttribute(new Float32Array(r),4)),b.setAttribute("aShape",new i.InstancedBufferAttribute(new Float32Array(f),4)),b.instanceCount=r.length/4,b.boundingSphere=new i.Sphere(h(0,8,s?408:-408),250),lt(b,l,s?"fringe-south":"fringe-north")};a(!0,Math.round(250*(.5+.5*$))),await p.yield(),a(!1,Math.round(170*(.5+.5*$)))}await p.yield();const vt=2.5;{const t=Nt(),e=k[0].clone().multiplyScalar(1.15);for(const l of[-1,1]){const a=l<0?0:2.3,s=Qt([h(16*l,.8,395.6+a),h(14.3*l,8,395.3+a),h(10.2*l,15.4,395+a),h(4.4*l,20.8,394.8+a),h(-.5*l,24.3,394.6+a),h(-2.6*l,26.6,394.3+a)],46),o=r=>1.08*(1+.55*Math.exp(-(((r-.035)/.03)**2))+.5*Math.exp(-(((r-.9)/.02)**2))+.9*R(.93,1,r))*(1-.6*R(.985,1,r));t.add(At(s,o,10,{ply:.15,uvRadius:1.08,sway:r=>.5*R(.55,1,r)}),{mat:d.CORD,color:e})}lt(t.build(),Kt(Et,[-1,-1],{cordWarm:T.cordWarm.map(l=>l*1.25)}),"gate")}await p.yield();const et=A([.85,.6,.24]),$t=A([.2,.1,.045]);{const t=Nt(),e=k[5].clone().multiplyScalar(.9),l=e.clone().multiplyScalar(.8),a=[[3.6,13],[3.9,15],[4.7,19],[6.6,24],[7.4,30],[6.5,36],[4.5,40],[4,43],[5.3,45.3],[5.4,47.5],[4,50],[4.4,54],[6.1,62],[7.3,72],[7.5,80],[6.9,86],[5.4,90],[5,92],[6.5,94],[6.5,96.6],[5.3,99.5]],s=(o,r,f)=>{t.add(new i.CylinderGeometry(5,5,3.6,18,1),{m:M(o,5+vt*.3,r,Math.PI/2,f,0),mat:d.BRASS,color:et,par:0}),t.add(new i.TorusGeometry(4.2,.9,6,18),{m:M(o,5+vt*.3,r,0,f,0),mat:d.BRASS,color:et.clone().multiplyScalar(.7)});for(const b of[-1,1])t.add(W(1.2,8,5,.5,1),{m:M(o+Math.sin(f)*2.6*b,8.5,r+Math.cos(f)*2.6*b,0,f,0),mat:d.BRASS,color:et});t.add(st([[.1,11.5],[4.6,11.5],[4.8,13],[4.2,15.5],[3.7,16]],16),{m:M(o,0,r),mat:d.BRASS,color:et,par:1})};for(const[o,r,f]of[[-212,140,.5],[-212,-10,-.3]])t.add(st(a,22),{m:M(o,0,r),mat:d.WOOD,color:$t,shade:(b,v)=>.75+.25*R(8,40,v)}),t.add(W(15.5,30,15.5,1.6,1),{m:M(o,113.5,r),mat:d.WOOD,color:$t}),s(o,r,f);await p.yield();for(const[o,r,f]of[[-362,140,1.2],[-362,-10,.2]])t.add(W(13,92,13,2.2,1),{m:M(o-3,58,r,0,0,-.07,1,1,1),mat:d.WOOD,color:$t}),s(o-6,r,f);await p.yield(),t.add(W(10,24,150,2,1),{m:M(-208,116.5,65),mat:d.WOOD,color:$t}),t.add(W(10,24,150,2,1),{m:M(-366,116.5,65),mat:d.WOOD,color:$t});for(const o of[144,-14])t.add(W(158,24,10,2,1),{m:M(-287,116.5,o),mat:d.WOOD,color:$t});t.add(W(3,3,150,1.4,1),{m:M(-202.6,106.5,65),mat:d.WOOD,color:$t.clone().multiplyScalar(1.5)});for(const o of[149.6,-19.6])t.add(W(158,3,3,1.4,1),{m:M(-287,106.5,o),mat:d.WOOD,color:$t.clone().multiplyScalar(1.5)});for(let o=0;o<24;o++)t.add(new i.SphereGeometry(1.5,6,4),{m:M(-202.4,125.4,-6+o*6.2,0,0,0,1,1,1),mat:d.BRASS,color:et});for(const o of[149.6,-19.6])for(let r=0;r<25;r++)t.add(new i.SphereGeometry(1.5,6,4),{m:M(-364+r*6.4,125.4,o),mat:d.BRASS,color:et});t.add(Dt(h(-362,107,140),h(-362,107,-10),h(-212,107,-10),h(-212,107,140),[0,0,150,0,150,150,0,150]),{mat:d.PLAIN,color:A([.035,.03,.028])});for(let o=0;o<3;o++){const r=18+o*47,f=A([.26,.2,.12]);t.add(Dt(h(-362,106.3,r+8),h(-362,106.3,r-8),h(-212,106.3,r-8),h(-212,106.3,r+8),[0,0,16,0,16,150,0,150]),{mat:d.PLAIN,color:f}),t.add(Dt(h(-334+o*47-8,106,140),h(-334+o*47-8,106,-10),h(-334+o*47+8,106,-10),h(-334+o*47+8,106,140),[0,0,150,0,150,16,0,16]),{mat:d.PLAIN,color:f})}await p.yield(),t.add(W(178,46,180,17,3),{m:M(-286,147,65),mat:d.VELVET,color:e,uvScale:[1,1]});for(const o of[140,-10])t.add(W(164,92,38,15,3),{m:M(-292,206,o),mat:d.VELVET,color:l}),t.add(new i.CylinderGeometry(20,20,166,18,1),{m:M(-290,252,o,0,0,Math.PI/2),mat:d.VELVET,color:e,uvScale:[125,166]});t.add(W(46,250,182,19,3),{m:M(-364,276,65,0,0,.11),mat:d.VELVET,color:e}),await p.yield(),lt(t.build(),Kt(Et,[6,8]),"chair")}const Ye=(()=>{const t=Nt(),e=k[4].clone().multiplyScalar(1.1);t.add(At([h(0,0,0),h(.3,-7,0),h(-.2,-14,.2),h(0,-20,0)],()=>.75,7,{ply:.15}),{mat:d.CORD,color:e}),t.add(new i.SphereGeometry(3.5,14,10),{m:M(0,-23,0,0,0,0,1,1.15,1),mat:d.CORD,color:e,uvScale:[6,9]}),t.add(new i.TorusGeometry(2.6,.9,6,14),{m:M(0,-26.6,0,Math.PI/2,0,0),mat:d.CORD,color:k[1].clone(),uvScale:[5,2]}),t.add(st([[2.4,-43],[4.7,-42.5],[4.5,-38],[3.7,-32],[3,-28.5],[2.4,-26.5]],16),{mat:d.CORD,color:e,uvScale:[.5,.25]});const l=lt(t.build(),Kt(Et,[-1,-1],{side:i.DoubleSide}),"tassel",!1);return l.position.set(-201,105,96),l})();await p.yield();let Ze=null;{const t=Nt(),e=Y.fork("yarn"),l=k[wt].clone().multiplyScalar(wt===4?1.1:1.05),a=dt.x,s=dt.r+vt-.6,o=dt.z;t.add(new i.SphereGeometry(10.1,28,18),{m:M(a,s,o),mat:d.CORD,color:l.clone().multiplyScalar(.6),uvScale:[9,14]});const r=h(),f=h(),b=h(),v=h();for(let x=0;x<46;x++){r.set(e.gauss(),e.gauss()*.8,e.gauss()).normalize(),f.set(r.z,0,-r.x),f.lengthSq()<1e-4&&f.set(1,0,0),f.normalize(),b.crossVectors(r,f);const z=10.25+.035*x,y=e.range(-.3,.3)*z,c=e.range(1.6,2.8),P=e.range(.82,1.12),w=[],m=[],u=[],S=[],g=40;for(let N=0;N<=g;N++){const L=N/g*Math.PI*2,it=Math.cos(L),G=Math.sin(L);for(const q of[-1,1]){const D=y+q*c*.5,H=Math.sqrt(Math.max(z*z-D*D,.01));v.set(0,0,0).addScaledVector(f,it*H).addScaledVector(b,G*H).addScaledVector(r,D),w.push(a+v.x,s+v.y,o+v.z),v.normalize(),m.push(v.x,v.y,v.z),u.push((q+1)*.5*(c/1.5),L*z/1.4)}if(N<g){const q=N*2;S.push(q,q+2,q+1,q+1,q+2,q+3)}}const B=new i.BufferGeometry;B.setAttribute("position",new i.Float32BufferAttribute(w,3)),B.setAttribute("normal",new i.Float32BufferAttribute(m,3)),B.setAttribute("uv",new i.Float32BufferAttribute(u,2)),B.setIndex(S),t.add(B,{mat:d.CORD,color:l.clone().multiplyScalar(P)}),(x&15)===15&&await p.yield()}await p.yield();const n=Qt([h(a+3,vt+1.2,o-9),h(a+10,vt+.9,o-21),h(a-1,vt+.9,o-38),h(a+11,vt+.9,o-56),h(a+4,vt+.9,o-74),h(a+17,vt+.9,o-88),h(a+28,vt+1.4,o-97),h(a+36,2.2,o-103),h(a+43,.9,o-116),h(a+54,.9,o-130),h(a+59,.9,o-146)],90);t.add(At(n,x=>.85*(1-.5*R(.985,1,x)),7,{ply:.16,uvRadius:.85,sway:x=>5*R(.72,1,x)**2}),{mat:d.CORD,color:l}),Ze=lt(t.build(),Kt(Et,[3,4],{side:i.DoubleSide}),"yarn")}await p.yield();const pt=Y.fork("furniture"),It=A([.05,.05,.056]),Qe=A([.72,.36,.17]),Ne=(t,e,l,a,s,o,r,f,b)=>{const v=[],n=[],x=[],z=[],y=[];for(let P=0;P<=a;P++)for(let w=0;w<=l;w++){const m=w/l,u=P/a,S=.35+.65*u,g=(m-.5)*t*(.86+.14*u)+Math.sin(m*9.4+1.3)*3*u;v.push(g,-u*e,s*S*Math.sin(m*o*Math.PI*2)+s*.35*u*Math.sin(m*4.1+.7)),n.push(m*t,u*e),x.push(r*Math.pow(u,1.6));const N=(u>.845&&u<.895||u>.925&&u<.945?1:0)?b:f,L=.82+.18*Math.cos(m*o*Math.PI*2);z.push(N.r*L,N.g*L,N.b*L)}for(let P=0;P<a;P++)for(let w=0;w<l;w++){const m=P*(l+1)+w,u=m+l+1;y.push(m,u,m+1,m+1,u,u+1)}const c=new i.BufferGeometry;return c.setAttribute("position",new i.Float32BufferAttribute(v,3)),c.setAttribute("uv",new i.Float32BufferAttribute(n,2)),c.setAttribute("sw",new i.Float32BufferAttribute(x,1)),c.setAttribute("cv",new i.Float32BufferAttribute(z,3)),c.setIndex(y),c.computeVertexNormals(),c},p0=[[4.6,5],[6.3,7],[6.6,11],[5,14],[4.3,17],[5.6,21],[7.3,29],[7.7,38],[6.5,47],[5,52],[5.9,54.5],[5.9,57],[7.6,58],[7.6,63],[5.9,64],[5,68],[5.6,74],[7.1,86],[7.5,96],[6.5,102],[5.2,105],[6.7,106.5],[6.7,116]],g0=(t,e,l,a,s)=>{t.add(st(p0,20),{m:M(e,0,l,0,0,0,a),mat:d.WOOD,color:s,shade:(o,r)=>.72+.28*R(6,44,r)}),t.add(st([[.1,0],[6.2,0],[7,1.5],[6.8,4.5],[5.2,6.4],[4.4,6.6]],16),{m:M(e,vt*.25,l,0,0,0,a),mat:d.BRASS,color:et,par:1})},We=(t,e,l,a,s,o,r,f=null)=>{const b=Math.hypot(a-e,s-l),v=b/2,n=[[3.2,-v],[3.2,-v+6],[4.6,-v+9],[3.4,-v+13],[3.8,-v*.55],[5.4,-v*.2],[5.8,0],[5.4,v*.2],[3.8,v*.55],[3.4,v-13],[4.6,v-9],[3.2,v-6],[3.2,v]],x=M((e+a)/2,o,(l+s)/2,Math.PI/2,Math.atan2(a-e,s-l),0);t.add(st(n,12),{m:f?f.clone().multiply(x):x,mat:d.WOOD,color:r})},C={hf:78,hb:62,zf:-64,zb:60,sy:20},w0=[[4.4,6.4],[5.7,7],[6.7,9],[6.9,11.5],[5.7,13.5],[4.5,15],[4.2,17.5],[5.3,19],[5.7,20],[5.3,21],[4.6,22.5],[5.8,26],[7.2,32],[7.8,39],[7.2,46],[5.9,51],[5.2,53.5],[6.7,54.5],[7.1,55.8],[6.7,57],[5.4,58],[8,59],[8.2,61],[8,63],[5.4,64],[6.7,65],[7.1,66.2],[6.7,67.5],[5.2,68.5],[5,71],[5.6,75],[6.8,84],[7.6,94],[7.4,100],[6.2,104],[5.2,106],[6.9,107],[7.3,108.2],[6.9,109.5],[5.6,110.5],[5.6,112.5]],$e=async(t,e,l,a)=>{const s=n=>e.clone().multiply(n),o=1.0862068965517242,r=l.clone().multiplyScalar(1.25),f=(n,x)=>.72+.28*R(6,44,x);for(const n of[-1,1]){t.add(st(w0.map(([u,S])=>[u*.78,S]),a),{m:s(M(n*C.hf,0,C.zf,0,0,0,o)),mat:d.WOOD,color:l,shade:f}),t.add(st([[.1,0],[5.2,0],[6,1.5],[5.8,4.6],[4.4,6.5],[3.5,6.7]],a),{m:s(M(n*C.hf,vt*.25,C.zf,0,0,0,o)),mat:d.BRASS,color:et,par:1}),t.add(W(13.5,27,13.5,2.2,2),{m:s(M(n*C.hf,135,C.zf)),mat:d.WOOD,color:l,uvSwap:!0}),t.add(st([[4.8,0],[6.1,.7],[6.4,1.8],[6,2.9],[4.8,3.3]],a),{m:s(M(n*C.hf,119.6,C.zf)),mat:d.WOOD,color:r});const x=Qt([h(n*C.hb,1,C.zb-9),h(n*C.hb,70,C.zb-2),h(n*C.hb,140,C.zb),h(n*C.hb,230,C.zb+7),h(n*C.hb,318,C.zb+20)],18);t.add(At(x,u=>6.4-1.6*R(.5,1,u)+1.6*Math.exp(-(((u-.44)/.04)**2))+.9*Math.exp(-(((u-.2)/.012)**2)),12,{uvRadius:1}),{m:e,mat:d.WOOD,color:l,shade:f}),t.add(new i.SphereGeometry(6.2,10,8),{m:s(M(n*C.hb,322,C.zb+20.6)),mat:d.WOOD,color:l}),t.add(st([[.1,0],[6,0],[6.9,1.4],[6.7,4.2],[5.4,5.8]],12),{m:s(M(n*C.hb,vt*.25,C.zb-9)),mat:d.BRASS,color:et,par:1});const z=n*(C.hf-C.hb),y=C.zf-(C.zb-4),c=Math.hypot(z,y),P=Math.atan2(z,y),w=c/2,m=[[3.2,-w],[3.2,-w+6],[4.7,-w+8],[5,-w+9.5],[4.7,-w+11],[3.4,-w+13],[3.8,-w*.55],[5.4,-w*.2],[5.9,-3],[4.9,-1.6],[6.3,0],[4.9,1.6],[5.9,3],[5.4,w*.2],[3.8,w*.55],[3.4,w-13],[4.7,w-11],[5,w-9.5],[4.7,w-8],[3.2,w-6],[3.2,w]];t.add(st(m,Math.max(10,a-8)),{m:s(M(n*(C.hb+C.hf)/2,C.sy,(C.zb-4+C.zf)/2,Math.PI/2,P,0)),mat:d.WOOD,color:l}),t.add(W(6,16,c-10,1.5,1),{m:s(M(n*(C.hb+C.hf)/2,136,(C.zb+C.zf)/2,0,P,0)),mat:d.WOOD,color:l}),t.add(W(2.6,2.6,c-16,1.2,1),{m:s(M(n*((C.hb+C.hf)/2+3.4),127.5,(C.zb+C.zf)/2,0,P,0)),mat:d.WOOD,color:r}),await p.yield()}We(t,-C.hb,C.zb-5,C.hb,C.zb-5,70,l,e),t.add(W(2*C.hf-14,16,6,1.5,1),{m:s(M(0,136,C.zf)),mat:d.WOOD,color:l,uvSwap:!0}),t.add(W(2*C.hf-20,2.6,2.6,1.2,1),{m:s(M(0,127.5,C.zf-3.4)),mat:d.WOOD,color:r,uvSwap:!0}),t.add(W(2*C.hb-12,16,6,1.5,1),{m:s(M(0,136,C.zb)),mat:d.WOOD,color:l,uvSwap:!0});for(const[n,x,z]of[[196,20,4.5],[244,22,9.5],[296,30,16.5]])t.add(W(2*C.hb-8,x,5,2,1),{m:s(M(0,n,C.zb+z,.12,0,0)),mat:d.WOOD,color:r,uvSwap:!0});const b=W(2*C.hf+16,15,C.zb-C.zf+14,6,2),v=b.attributes.position;for(let n=0;n<v.count;n++)v.setX(n,v.getX(n)*Z(1,(C.hb+8)/(C.hf+8),Lt((v.getZ(n)+62)/124,0,1)));t.add(b,{m:s(M(0,152,(C.zf+C.zb)/2)),mat:d.VELVET,color:k[1].clone().multiplyScalar(1.05),par:1})},Je=Nt();{const t=Je,e=A([.24,.125,.05]),l=A([.3,.165,.07]);{const a=ut,s=(a.z0+a.z1)/2,o=a.z1-a.z0;for(const r of[-1,1])for(const f of[a.z0,a.z1])g0(t,r*a.hx,f,.9,e),t.add(W(15,24,15,1.6,1),{m:M(r*a.hx,a.top-12,f),mat:d.WOOD,color:e});await p.yield();for(const r of[a.z0,a.z1])We(t,-a.hx,r,a.hx,r,56,e),t.add(W(2*a.hx-15,18,7,1.5,1),{m:M(0,a.top-9,r),mat:d.WOOD,color:e}),t.add(W(2*a.hx-22,2.4,8.4,1,1),{m:M(0,a.top-17.5,r),mat:d.WOOD,color:l});for(const r of[-1,1])We(t,r*a.hx,a.z0,r*a.hx,a.z1,56,e),t.add(W(7,18,o-15,1.5,1),{m:M(r*a.hx,a.top-9,s),mat:d.WOOD,color:e});t.add(W(2*a.hx+44,9,o+44,3.5,2),{m:M(0,a.top+4.5,s),mat:d.WOOD,color:l,uvSwap:!0}),t.add(Dt(h(-a.hx,a.top-.5,a.z1),h(-a.hx,a.top-.5,a.z0),h(a.hx,a.top-.5,a.z0),h(a.hx,a.top-.5,a.z1),[0,0,o,0,o,156,0,156]),{mat:d.WOOD,color:e.clone().multiplyScalar(.6)})}await p.yield();{const a=Rt,s=a.x+75;t.add(W(270,3.5,250,1.5,1),{m:M(a.x+34,1.9,a.z),mat:d.BRASS,color:A([.5,.34,.15]),par:0});for(const v of[-1,1])for(const n of[-1,1])t.add(st([[8,0],[10.5,2],[10,6],[6.5,12],[6,20],[9,29],[12,36]],12),{m:M(a.x+v*58,3.5,a.z+n*58),mat:d.IRON,color:It});t.add(W(162,10,162,3,1),{m:M(a.x,43,a.z),mat:d.IRON,color:It}),t.add(W(150,186,150,9,2),{m:M(a.x,140,a.z),mat:d.IRON,color:It});for(const v of[-1,1])for(const[n,x]of[[92,62],[182,86]])t.add(W(112,x,5,2.2,1),{m:M(a.x,n,a.z+v*75.5),mat:d.IRON,color:It.clone().multiplyScalar(1.5)});t.add(W(168,11,168,4,1),{m:M(a.x,238,a.z),mat:d.IRON,color:It}),t.add(W(118,58,118,8,2),{m:M(a.x-6,272,a.z),mat:d.IRON,color:It}),t.add(W(132,9,132,3.5,1),{m:M(a.x-6,305,a.z),mat:d.IRON,color:It}),await p.yield(),t.add(W(6,112,104,2.5,1),{m:M(s+2,160,a.z),mat:d.IRON,color:It.clone().multiplyScalar(1.6)}),t.add(Dt(h(s+5.4,112,a.z+44),h(s+5.4,112,a.z-44),h(s+5.4,208,a.z-44),h(s+5.4,208,a.z+44),[0,0,3,0,3,3,0,3]),{mat:d.EMBER,color:A([4.2,1.15,.2])});for(const v of[128,192])t.add(W(9,12,7,2,1),{m:M(s+4,v,a.z+54),mat:d.IRON,color:It});t.add(new i.SphereGeometry(5.5,10,8),{m:M(s+9,160,a.z-49),mat:d.BRASS,color:et}),t.add(W(5,34,96,2,1),{m:M(s+2,76,a.z),mat:d.IRON,color:It.clone().multiplyScalar(1.6)});for(let v=-2;v<=2;v++)t.add(W(2,16,7,.8,1),{m:M(s+4.6,76,a.z+v*15),mat:d.EMBER,color:A([1.7,.4,.06])});t.add(new i.SphereGeometry(4.5,10,8),{m:M(s+8,90,a.z),mat:d.BRASS,color:et}),await p.yield();const o=Qt([h(a.x-28,306,a.z),h(a.x-28,420,a.z),h(a.x-28,548,a.z),h(a.x-40,588,a.z),h(a.x-76,602,a.z),h(Pt.w+2,604,a.z)],22);t.add(At(o,()=>20,14,{uvRadius:2}),{mat:d.IRON,color:It.clone().multiplyScalar(1.25)});for(const v of[312,470])t.add(new i.TorusGeometry(21,2.6,6,18),{m:M(a.x-28,v,a.z,Math.PI/2,0,0),mat:d.IRON,color:It});const r=a.x+26,f=a.z+8,b=309.5;t.add(st([[.1,0],[19,0],[24,5],[26,15],[23,27],[14,34],[9,36]],22),{m:M(r,b,f),mat:d.BRASS,color:Qe,par:0}),t.add(st([[9.6,35.4],[10,37.5],[4,39.5],[2.6,43],[4.4,46.5],[.1,48.5]],14),{m:M(r,b,f),mat:d.BRASS,color:et,par:0}),t.add(At(Qt([h(r+21,b+13,f),h(r+32,b+21,f),h(r+38,b+33,f),h(r+43,b+38,f)],8),v=>4.4-1.8*v,8),{mat:d.BRASS,color:Qe}),t.add(new i.TorusGeometry(23,1.9,6,20,Math.PI),{m:M(r,b+30,f),mat:d.BRASS,color:et})}}await p.yield();{const t=Je,e=A([.2,.105,.045]),l=A([.12,.062,.03]);{const s=X,o=Pt.n,r=Pt.n+s.d,f=(s.x0+s.x1)/2,b=s.x1-s.x0;for(const z of[s.x0+6,s.x1-6])t.add(W(12,s.h,s.d,2.5,1),{m:M(z,s.h/2,o+s.d/2),mat:d.WOOD,color:e});t.add(W(b+8,34,s.d+5,3,1),{m:M(f,17,o+s.d/2+2.5),mat:d.WOOD,color:e,uvSwap:!0}),t.add(W(b+26,20,s.d+16,5,1),{m:M(f,s.h+8,o+s.d/2+5),mat:d.WOOD,color:e,uvSwap:!0}),t.add(W(b+12,8,s.d+8,2.5,1),{m:M(f,s.h-6,o+s.d/2+3),mat:d.WOOD,color:e.clone().multiplyScalar(1.4),uvSwap:!0}),t.add(Dt(h(s.x0,30,o+5),h(s.x1,30,o+5),h(s.x1,s.h,o+5),h(s.x0,s.h,o+5),[0,0,b,0,b,s.h,0,s.h]),{mat:d.PLAIN,color:l});const v=[k[1],k[2],k[4],k[5],k[6],k[1].clone().lerp(k[2],.5),k[3],k[0].clone().multiplyScalar(.75),k[1]],n=104,x=5;for(let z=0;z<x;z++){const y=34+z*n;t.add(W(b-20,7,s.d-6,2,1),{m:M(f,y-3.5,o+s.d/2+1),mat:d.WOOD,color:e.clone().multiplyScalar(1.15),uvSwap:!0}),await p.yield();let c=s.x0+14;const P=s.x1-14;for(;c<P-8;){const w=pt();if(w<.1&&c<P-70){const m=2+Math.floor(pt()*3);let u=y;for(let S=0;S<m;S++){const g=9+pt()*8,B=52+pt()*12,N=v[Math.floor(pt()*v.length)].clone().multiplyScalar(.6+.5*pt());t.add(W(B,g,58,1.2,1),{m:M(c+32,u+g/2,r-34-pt()*6,0,(pt()-.5)*.2,0),mat:d.BOOK,color:N,par:pt(),uvScale:[1/58,1/B]}),u+=g}pt()<.6&&t.add(st([[.1,0],[8,0],[12,4],[14,10],[13.4,10.6],[11,5.5],[7,2],[.1,1.6]],14),{m:M(c+32,u,r-36),mat:d.BRASS,color:et,par:0}),c+=68}else if(w<.17)c+=10+pt()*16;else{const m=9+pt()*13,u=(.6+.3*pt())*(n-10),S=50+pt()*16,g=pt()<.12?pt()<.5?.14:-.14:0,B=v[Math.floor(pt()*v.length)].clone().multiplyScalar(.55+.6*pt()),N=W(m,u,S,Math.min(1.6,m*.16),1),L=N.attributes.uv,it=N.attributes.position;for(let G=0;G<L.count;G++)L.setXY(G,it.getX(G)/m+.5,it.getY(G)/u+.5);t.add(N,{m:M(c+m/2+Math.abs(g)*12,y+u/2,r-8-S/2,0,0,g),mat:d.BOOK,color:B,par:pt()}),c+=m+.8+Math.abs(g)*22}}}t.add(st([[.1,0],[22,0],[26,6],[20,14],[28,32],[34,58],[28,82],[16,94],[14,104],[20,108],[20,112],[.1,114]],20),{m:M(s.x0+92,s.h+18,o+46),mat:d.BRASS,color:et,par:1}),t.add(W(84,15,60,1.6,1),{m:M(s.x1-96,s.h+25.5,o+46,0,.2,0),mat:d.BOOK,color:k[1].clone().multiplyScalar(.9),par:.2,uvScale:[1/60,1/84]}),t.add(W(70,12,52,1.6,1),{m:M(s.x1-92,s.h+39,o+46,0,-.15,0),mat:d.BOOK,color:k[2].clone().multiplyScalar(1.3),par:.7,uvScale:[1/52,1/70]})}await p.yield(),await $e(t,M(zt.x,0,zt.z,0,Math.PI,0),e,16),await p.yield(),lt(t.build(),Kt(Et,[8,11]),"furniture",!1),await p.yield();const a=Nt();await $e(a,M(Tt.x,0,Tt.z,0,-Tt.psi,0),e.clone().multiplyScalar(1.9),28),await p.yield(),lt(a.build(),Kt(Et,[12,14]),"side-chair",!1)}await p.yield();{const t=Nt(),e=k[1].clone().multiplyScalar(2.1),l=k[4].clone().multiplyScalar(1.5),a=I.zc-I.hz,s=I.zc+I.hz;t.add(Ne(150,800,30,40,9,5.5,20,e,l),{m:M(Pt.e-34,836,a+22,0,-Math.PI/2,0),mat:d.VELVET,par:-1}),await p.yield(),t.add(Ne(150,800,30,40,9,5.5,20,e,l),{m:M(Pt.e-34,836,s-22,0,-Math.PI/2,0),mat:d.VELVET,par:-1}),await p.yield(),t.add(Ne(190,640,34,36,10,6.5,24,e,l),{m:M(366,664,Pt.n+30),mat:d.VELVET,par:-1}),await p.yield();const o=[h(256,668,Pt.n+30),h(584,668,Pt.n+30)];t.add(At(o,()=>3.6,8,{uvRadius:3.6}),{mat:d.BRASS,color:et});for(const r of[256,584])t.add(new i.SphereGeometry(7.5,10,8),{m:M(r,668,Pt.n+30),mat:d.BRASS,color:et});for(let r=0;r<9;r++)t.add(new i.TorusGeometry(6,1.5,5,12),{m:M(288+r*19.5,666,Pt.n+30,0,Math.PI/2,0),mat:d.BRASS,color:et});for(const r of[262,578])t.add(W(5,5,28,1.5,1),{m:M(r,668,Pt.n+16),mat:d.BRASS,color:et});lt(t.build(),Kt(Et,[-1,-1],{side:i.DoubleSide,pen:9}),"curtains",!1)}await p.yield();let Ce=null;if(!j){const t=Nt(),e=(F==="winter"?k[2]:k[1]).clone().multiplyScalar(F==="winter"?1.5:1),l=k[0].clone().multiplyScalar(.9),a=A([.2,.12,.06]),s=z=>z<.12?10.5*Math.sqrt(Math.max(1-(1-z/.12)**2,0)):z<.68?Z(10.5,14.5,R(.3,.68,z))-1.6*Math.exp(-(((z-.36)/.12)**2)):14.5*Math.cos((z-.68)/.32*Math.PI/2)**.8,o=z=>10*R(.72,1,z)**2,r=80,f=36,b=8,v=(z,y,c)=>{const P=[],w=[],m=[];for(let S=0;S<=y;S++)for(let g=0;g<=c;g++){const B=z(S/y,g/c);P.push(B[0],B[1],B[2]),w.push(B[3],B[4])}for(let S=0;S<y;S++)for(let g=0;g<c;g++){const B=S*(c+1)+g,N=B+c+1;m.push(B,B+1,N,B+1,N+1,N)}const u=new i.BufferGeometry;return u.setAttribute("position",new i.Float32BufferAttribute(P,3)),u.setAttribute("uv",new i.Float32BufferAttribute(w,2)),u.setIndex(m),u.computeVertexNormals(),u},n=3.6,x=(z,y)=>{const c=w=>w*z;t.add(v((w,m)=>[c((m*2-1)*s(w)*.96),o(w)+n,-w*r,(m*2-1)*s(w),w*r],f,b),{m:y,mat:d.VELVET,color:l,par:0,shade:(w,m,u)=>1});for(const w of[-1,1])t.add(v((m,u)=>[c(w*s(m)*(1-.04*u)),o(m)+n*u,-m*r,u*n,m*r],f,2),{m:y,mat:d.WOOD,color:a}),t.add(v((m,u)=>{const S=m*.47;return[c(w*s(S)*(1+.05*u)),o(S)+n+u*6.5,-S*r,u*6.5,S*r]},16,2),{m:y,mat:d.VELVET,color:e,par:0});t.add(v((w,m)=>{const u=.36+.2*Math.sin(m*Math.PI),S=u+w*(1-u),g=m*Math.PI,B=s(S)*1.03,N=11.5*(1-R(.5,1,S))+1.2;return[c(-Math.cos(g)*B),o(S)+n*.6+Math.sin(g)*N,-S*r,(m-.5)*44,S*r]},22,14),{m:y,mat:d.VELVET,color:e,par:1});const P=[];for(let w=0;w<=20;w++){const m=w/20*Math.PI,u=.36+.2*Math.sin(m),S=s(u)*1.03,g=11.5*(1-R(.5,1,u))+1.2;P.push(h(c(-Math.cos(m)*S),o(u)+n*.6+Math.sin(m)*g,-u*r).applyMatrix4(y))}t.add(At(P,()=>1.25,7,{ply:.12}),{mat:d.CORD,color:k[4].clone().multiplyScalar(1.1)})};x(1,M(gt.x-40,vt-.4,gt.z-17,0,-Math.PI/2+.08,0)),x(-1,M(gt.x-47,vt-.4,gt.z+20,0,-Math.PI/2-.14,0)),Ce=lt(t.build(),Kt(Et,[4,6],{side:i.DoubleSide}),"slippers")}await p.yield();let t0=null,Re=null;{const t=Nt(),e=Ct.y,l=Ct.x,a=Ct.z,s=A([.2,.105,.045]);for(const w of[-27,27]){for(const m of[-1,1]){const u=[h(l+m*39,vt-.4,a+w+m*1.6),h(l+m*20,e*.26,a+w+m*1.6),h(l,e*.52,a+w+m*1.6),h(l-m*20,e*.78,a+w+m*1.6),h(l-m*37,e-3,a+w+m*1.6)];t.add(At(u,S=>3.3+.9*Math.exp(-(((S-.5)/.06)**2))+1.1*Math.exp(-(((S-.07)/.03)**2)),8,{uvRadius:1}),{mat:d.WOOD,color:s,shade:(S,g)=>.7+.3*R(5,50,g)}),t.add(new i.SphereGeometry(4.6,10,8),{m:M(l+m*39.5,vt+2.2,a+w+m*1.6,0,0,0,1,.8,1),mat:d.BRASS,color:et})}t.add(new i.SphereGeometry(3.2,8,6),{m:M(l,e*.52,a+w+Math.sign(w)*4.4),mat:d.BRASS,color:et})}for(const w of[-1,1])t.add(W(5,5,66,1.6,1),{m:M(l+w*37,e-2.6,a),mat:d.WOOD,color:s});t.add(At([h(l,e*.52,a-29),h(l,e*.52,a+29)],()=>2.4,8,{uvRadius:1}),{mat:d.WOOD,color:s}),await p.yield();const o=(w,m,u,S)=>{const g=new i.RingGeometry(w,m,48,S),B=g.attributes.uv,N=g.attributes.position;for(let L=0;L<B.count;L++)B.setXY(L,0,Math.hypot(N.getX(L),N.getY(L)));return g};t.add(o(.1,42,0,6),{m:M(l,e+2.2,a,-Math.PI/2,0,0),mat:d.BRASS,color:et,par:1}),t.add(st([[41.5,2.2],[43.5,3.2],[45.5,6.5],[46.5,7],[46,5.4],[44.5,1.2],[42,0],[30,0],[.1,.4]],48),{m:M(l,e,a),mat:d.BRASS,color:et,par:0});const r=l+8,f=a-4,b=e+2.3;t.add(st([[5,0],[11.5,.3],[13,1.6],[13.2,2.4],[11.5,1.7],[5.5,1.3]],28),{m:M(r,b,f),mat:d.BRASS,color:A([.75,.72,.65]),par:0});const v=[[5.6,0],[7.3,.5],[7.6,2.2],[6.6,6.5],[5.7,11.5],[5.9,16],[7.1,21.5],[8.2,26]];t.add(st(v,26),{m:M(r,b+1.3,f),mat:d.GLASS,color:A([.85,.3,.05])}),t.add(st([[8.2,26],[8.6,29.5],[8.7,31]],26),{m:M(r,b+1.3,f),mat:d.GLASS,color:A([.5,.55,.55])}),t.add(new i.CircleGeometry(8.1,26),{m:M(r,b+27.2,f,-Math.PI/2,0,0),mat:d.GLASS,color:A([.6,.18,.03])});for(const[w,m,u]of[[-20,12,.3],[-25,6,1.1],[-21,5.5,.7]])t.add(W(4.6,4.6,4.6,.8,1),{m:M(l+w,e+4.5,a+m,0,u,0),mat:d.PLAIN,color:A([.75,.73,.68])});await p.yield();const n=kt.x,x=kt.z,z=vt-.5;t.add(st([[.1,0],[23,0],[25.5,3],[24.5,8],[17,12],[13.5,18],[16,22],[20.5,24],[20.5,27.5],[15,28.5]],24),{m:M(n,z,x),mat:d.BRASS,color:et,par:1}),t.add(st([[14.5,0],[20.5,7],[23.5,19],[22.5,31],[17.5,43],[12.5,51]],20),{m:M(n,z+28,x),mat:d.LAMP,color:A([1.45,.58,.14]),uvScale:[1,1/51]}),t.add(st([[12.5,78.5],[17,80.5],[18,85],[12,91],[7,96],[8,99],[3,102],[.1,102.5]],18),{m:M(n,z,x),mat:d.BRASS,color:et,par:0});for(let w=0;w<4;w++){const m=w*Math.PI/2+.6,u=Math.cos(m),S=Math.sin(m),g=Qt([h(n+u*20.5,z+26,x+S*20.5),h(n+u*26.5,z+40,x+S*26.5),h(n+u*27.5,z+55,x+S*27.5),h(n+u*23,z+70,x+S*23),h(n+u*16.5,z+80.5,x+S*16.5)],10);t.add(At(g,()=>1.5,6,{uvRadius:1.5}),{mat:d.BRASS,color:et})}t.add(new i.TorusGeometry(15,1.7,6,18,Math.PI),{m:M(n,z+99,x,0,.6,0),mat:d.BRASS,color:et}),t0=lt(t.build(),Kt(Et,[11,12],{side:i.DoubleSide}),"tray-and-lantern"),await p.yield();const y=(w,m,u,S,g,B)=>{const N=[],L=[],it=[];for(let q=0;q<B;q++){const D=q/B*Math.PI,H=N.length/3,J=Math.cos(D)*S,V=Math.sin(D)*S;N.push(w-J,m,u-V,w+J,m,u+V,w+J,m+g,u+V,w-J,m+g,u-V),L.push(0,0,1,0,1,1,0,1),it.push(H,H+1,H+2,H,H+2,H+3)}const G=new i.BufferGeometry;return G.setAttribute("position",new i.Float32BufferAttribute(N,3)),G.setAttribute("uv",new i.Float32BufferAttribute(L,2)),G.setIndex(it),G},c=new i.ShaderMaterial({uniforms:Object.assign(Yt(),tt,{uOrigin2:{value:h(0,0,0)}}),vertexShader:_0,fragmentShader:G0(U.glsl),fog:!0,transparent:!0,depthWrite:!1,blending:i.AdditiveBlending,side:i.DoubleSide});Re=lt(y(r,b+27,f,15,73,4),c,"steam"),Re.renderOrder=3;const P=lt(y(Rt.x+71,352,Rt.z+8,36,190,4),c,"kettle-steam");P.renderOrder=3}await p.yield();const de=(t,e,l)=>{const a=[],s=[],o=[],r=[];for(let b=0;b<=e;b++)for(let v=0;v<=l;v++){const n=t(b/e,v/l);a.push(n[0],n[1],n[2]),s.push(n[3],n[4]),o.push(n[5]||0)}for(let b=0;b<e;b++)for(let v=0;v<l;v++){const n=b*(l+1)+v,x=n+l+1;r.push(n,x,n+1,n+1,x,x+1)}const f=new i.BufferGeometry;return f.setAttribute("position",new i.Float32BufferAttribute(a,3)),f.setAttribute("uv",new i.Float32BufferAttribute(s,2)),f.setAttribute("sw",new i.Float32BufferAttribute(o,1)),f.setIndex(r),f.computeVertexNormals(),f},Me=(t,e,l)=>Math.exp(-(((t-e)/l)**2));{const t=Nt(),e=A(at==="black"?[.02,.019,.026]:at==="white"?[.56,.54,.5]:[.29,.225,.165]),l=(n,x)=>.55+.45*R(0,24,x),a=(n,x)=>{const z=x*Math.PI*2,y=Lt(2*n-1,-.992,.992),c=Math.pow(1-y*y,.42),P=30*c*(1+.1*Me(n,.27,.2)-.05*Me(n,.62,.15)),w=45*c*(1+.08*Me(n,.27,.22)),m=P-Math.cos(z)*P,u=m<5?.8+m*.25:m-2.95,S=5-20*y*y+Math.sin(z)*w*(1+.14*(1-R(0,16,m)));return[-64+128*n,u,S,-64+128*n,x*200,Me(n,.5,.28)*R(.15,.75,(1-Math.cos(z))/2)]},s=(n,x,z,y,c,P,w)=>(m,u)=>{const S=u*Math.PI*2,g=Lt(2*m-1,-.992,.992),B=Math.sqrt(1-g*g);return[n+g*y,x-Math.cos(S)*c*B,z+Math.sin(S)*P*B,n+g*y,u*w,0]},o=(n,x,z,y)=>[y,0,0];t.add(de(a,44,30),{mat:d.FUR,color:e,shade:l,anim:o}),await p.yield(),t.add(de(s(-37,30,15,31,31,36,150),18,16),{mat:d.FUR,color:e,shade:l,anim:(n,x,z)=>[.5*R(20,44,x),0,0]}),t.add(de(s(19,33,3,21,25,31,140),16,14),{mat:d.FUR,color:e,shade:l,anim:(n,x,z)=>[.7*R(20,44,x),0,0]}),t.add(de(s(44,36,-26,19,17,18.5,110),18,16),{mat:d.FUR,color:e,shade:(n,x)=>.7+.3*R(20,50,x)}),await p.yield();for(const[n,x,z]of[[35,-22,.24],[53,-31,-.2]]){const y=de((c,P)=>{const w=P*Math.PI*2,m=8.8*Math.pow(Math.max(1-c*c,0),.6)*(1-.15*c)+.3,u=3.4*(1-.6*c)+.3;return[Math.cos(w)*m,17*c,Math.sin(w)*u*(Math.sin(w)>0?.55:1),Math.cos(w)*m+n,c*30,0]},8,12);t.add(y,{m:M(n,49.5,x,-.12,.35,z),mat:d.FUR,color:e.clone().multiplyScalar(.85),anim:(c,P)=>[0,0,R(3,17,P)*(z>0?1:.5)]})}const r=Qt([h(-58,10,2),h(-66,6.8,24),h(-55,6.5,46),h(-28,6.4,59),h(6,6.3,63),h(36,6.3,59),h(58,6.3,47),h(71,6.3,31)],40),b=At(r,n=>6.3*(1-.2*n)*Math.sqrt(Math.max(1-R(.9,1,n)**2,.03)),10,{sway:n=>n,uvRadius:6});{const n=b.attributes.sw,x=new Float32Array(n.count*3),z=A(at==="black"?[.5,.48,.46]:at==="white"?[.42,.38,.34]:[.52,.44,.31]);for(let y=0;y<n.count;y++){const c=R(.7,.82,n.getX(y));x[y*3]=Z(e.r,z.r,c),x[y*3+1]=Z(e.g,z.g,c),x[y*3+2]=Z(e.b,z.b,c)}b.setAttribute("cv",new i.Float32BufferAttribute(x,3))}t.add(b,{mat:d.FUR,uvSwap:!0,uvScale:[12,36],anim:(n,x,z,y)=>[0,y,0],shade:(n,x)=>.7+.3*R(1,10,x)}),await p.yield();const v=t.build(!0);{const n=v.attributes.aAnim,x=new Float32Array(n.count*3);for(let z=0;z<n.count;z++){const y=n.getY(z);if(y<=0)continue;const c=r[Math.min(40,Math.round(y*40))];x[z*3]=-58-150*y-c.x,x[z*3+1]=10+66*Math.pow(y,.8)+18*R(.7,1,y)-c.y,x[z*3+2]=2+124*y*(1-.3*y)-c.z}v.setAttribute("aSweep",new i.Float32BufferAttribute(x,3))}await p.yield();for(let n=0;n<=6;n++){const x=new i.ShaderMaterial({uniforms:Object.assign(Yt(),tt,Ft,{uOccSkip:{value:new i.Vector2(1,3)},uPenK:oe,uShell:{value:n/6}}),vertexShader:N0,fragmentShader:Se,fog:!0}),z=lt(v,x,n?"cat-fur"+n:"cat",!1);z.position.set(Wt.x,vt-.7,Wt.z),z.rotation.y=Wt.yaw}}await p.yield();{const l=(ot.r-3.3-ot.hollow)/5,a=-Math.PI/2-.35,s=u=>ot.hollow+l*u/(2*Math.PI),o=u=>ot.hollow*u+l*u*u/(4*Math.PI),r=u=>1.3*Math.sin(u*.7+1)+.7*Math.sin(u*2.3),f=(u,S,g)=>[Math.cos(a+u)*S,ot.y+Math.sin(a+u)*S,g],b=10*Math.PI,v=(u,S,g,B)=>{const N=[],L=[],it=[],G=[],q=[];for(let H=0;H<=S;H++)for(let J=0;J<=g;J++){const V=u(H/S,J/g);N.push(V.p[0],V.p[1],V.p[2]),L.push(V.n[0],V.n[1],V.n[2]),it.push(V.uv[0],V.uv[1]);const ft=V.c||[1,1,1];G.push(ft[0],ft[1],ft[2])}for(let H=0;H<S;H++)for(let J=0;J<g;J++){const V=H*(g+1)+J,ft=V+g+1;B?q.push(V,ft,V+1,V+1,ft,ft+1):q.push(V,V+1,ft,V+1,ft+1,ft)}const D=new i.BufferGeometry;return D.setAttribute("position",new i.Float32BufferAttribute(N,3)),D.setAttribute("normal",new i.Float32BufferAttribute(L,3)),D.setAttribute("uv",new i.Float32BufferAttribute(it,2)),D.setAttribute("cv",new i.Float32BufferAttribute(G,3)),D.setIndex(q),D},n=(u,S=1)=>[Math.cos(a+u)*S,Math.sin(a+u)*S,0],x=v((u,S)=>{const g=b-(2*Math.PI+.3)*(1-u),B=ot.z0+r(g),N=Z(B,ot.z1,S);return{p:f(g,s(g)+3.3,N),n:n(g),uv:[240-(ot.z0-N),-330+o(g)]}},84,10,!1);lt(x,U.makeWeaveMaterial({back:!0,occSkip:[0,1],side:i.FrontSide,penumbra:5}),"roll-back").geometry.computeBoundingSphere(),await p.yield();const y=Nt(),c=300;y.add(v((u,S)=>{const g=b*u;return{p:f(g,s(g)+3.3*S,ot.z0+r(g)),n:[0,0,1],uv:[o(g),S]}},c,1,!1),{mat:d.SPIRAL});const P=[k[0].r*.5,k[0].g*.5,k[0].b*.5],w=[k[1].r*.55,k[1].g*.55,k[1].b*.55];y.add(v((u,S)=>{const g=b*u,B=ot.z0+r(g);return{p:f(g,s(g)+3.3,B-7*S),n:n(g),uv:[o(g),S*7],c:P}},c,1,!1),{mat:d.PLAIN}),y.add(v((u,S)=>{const g=b*u,B=ot.z0+r(g);return{p:f(g,s(g),B-7*S),n:n(g,-1),uv:[o(g),S*7],c:w}},c,1,!0),{mat:d.PLAIN});{const u=new i.RingGeometry(ot.hollow-.3,ot.r+.5,56,1);y.add(u,{m:M(0,ot.y,ot.z0-6.5),mat:d.HOLLOW,color:A([.012,.01,.01])})}{const u=new i.CircleGeometry(ot.hollow+5,24);y.add(u,{m:M(0,ot.y,ot.z0-80),mat:d.HOLLOW,color:A([.004,.004,.005])})}await p.yield(),y.add(v((u,S)=>{const g=(2*Math.PI+.25)*u,B=ot.z0+r(g),N=Z(B,ot.z0-82,S*S),L=Math.exp(-(B-N)/16);return{p:f(g,s(g),N),n:n(g,-1),uv:[o(g),B-N],c:[k[1].r*.5*L+.004,k[1].g*.5*L+.004,k[1].b*.5*L+.005]}},40,7,!0),{mat:d.HOLLOW}),await p.yield();const m=[];for(let u=0;u<=330;u++){const S=b*u/330,g=f(S,s(S)+3.3-.35,ot.z0+r(S)+.4);m.push(h(g[0],g[1],g[2]))}y.add(At(m,()=>.62,6,{uvRadius:.62}),{mat:d.CORD,color:k[1].clone().multiplyScalar(1.05)}),await p.yield(),lt(y.build(),Kt(Et,[0,1]),"roll-end")}await p.yield();const O=Y.fork("rising-garden"),le=new Float32Array(Ee),e0={value:le},a0=tt.uGT.value,Jt=[],te={basin:40,beds:41,gate:42,lamps:43};for(const[t,e]of[[1,1],[-1,1],[1,-1],[-1,-1]]){const l=(a,s)=>e>0?{up:.283+Math.hypot(a-190,s-252)/3e3,dr:O()}:{up:.425+(Math.abs(s)-150)/1500+O()*.01,dr:O()};for(const a of[27,153])for(const s of[160,200])Jt.push(Object.assign({kind:"cypress",x:t*a,z:e*s,h:a<90?66:56,r:a<90?7.8:7.4},l(t*a,e*s)))}for(const[t,e]of[[1,1],[-1,1],[1,-1],[-1,-1]]){const l=(a,s)=>e>0?{up:.283+Math.hypot(a-190,s-252)/3e3,dr:O()}:{up:.425+(Math.abs(s)-150)/1500+O()*.01,dr:O()};for(const a of[72,108])for(const s of[152.5,182.5,212.5])Jt.push(Object.assign({kind:"tree",x:t*a,z:e*s,h:44+O.range(-3,4),r:12.5},l(t*a,e*s)))}Jt.forEach((t,e)=>{t.i=e,t.ph=O()*6.28,a0[e].set(t.x,t.z,0,t.kind==="cypress"?t.r*.9:-t.r)});const Te=Jt.find(t=>t.kind==="tree"&&t.x===72&&t.z===212.5),me={x:100,z:248.5,nx:-1,nz:0,a:15,spring:34,wd:8,dp:7.5},Vt=[];{const t=me,e=1.35*t.a,l=Math.acos(.35/1.35);for(let a=0;a<=8;a++)Vt.push([-t.a,t.spring*a/8]);for(let a=1;a<=12;a++){const s=l*a/12;Vt.push([.35*t.a-e*Math.cos(s),t.spring+e*Math.sin(s)])}for(let a=11;a>=0;a--){const s=l*a/12;Vt.push([-.35*t.a+e*Math.cos(s),t.spring+e*Math.sin(s)])}for(let a=7;a>=0;a--)Vt.push([t.a,t.spring*a/8])}await p.yield();const o0=[];{const t=Nt(),e=Nt(),l=A([.2,.115,.055]);for(const o of Jt){const r=()=>[o.x,o.z,o.i];if(o.kind==="cypress"){const f=[[.2,3.2]],b=o.z>0?22:14;for(let c=0;c<=b;c++){const P=c/b,w=3.4+(o.h-3.4)*P,m=P<.26?.6+.4*Math.sin(P/.26*Math.PI/2):Math.pow(Math.max(1-Math.pow((P-.26)/.74,1.55),0),.85);f.push([Math.max(o.r*m*(1+.08*Math.sin(w*1.31+o.ph)),.25),w])}const v=o.z>0?14:10,n=st(f,v),x=n.attributes.uv,z=n.attributes.position,y=f.length;for(let c=0;c<x.count;c++)x.setXY(c,Math.floor(c/y)/v*57.6,z.getY(c));t.add(n,{m:M(o.x,0,o.z,0,o.ph,0),mat:d.PILE,par:0,anim:r}),e.add(new i.CylinderGeometry(2.2,2.9,5,10,1),{m:M(o.x,2.5,o.z),mat:d.CORD,color:l,uvScale:[4,3],anim:r})}else{const f=[Math.cos(o.ph)*2.2,Math.sin(o.ph)*2.2],b=o.h-14,v=Qt([h(o.x,.5,o.z),h(o.x+f[0]*.5,b*.35,o.z+f[1]*.5),h(o.x+f[0],b*.7,o.z+f[1]),h(o.x+f[0]*.8,b,o.z+f[1]*.8)],10);e.add(At(v,n=>2.7-1*n+1.2*Math.exp(-((n/.08)**2)),8,{ply:.16,uvRadius:2.2}),{mat:d.CORD,color:l,anim:r});for(let n=0;n<4;n++){const x=o.ph+n*1.571+.4,z=Math.cos(x),y=Math.sin(x),c=Qt([h(o.x+f[0]*.75,b*.62,o.z+f[1]*.75),h(o.x+f[0]+z*3.4,b*.86,o.z+f[1]+y*3.4),h(o.x+f[0]+z*7.5,b+1.5,o.z+f[1]+y*7.5)],5);e.add(At(c,P=>1.5-.6*P,6,{ply:.16,uvRadius:1.3}),{mat:d.CORD,color:l,anim:r})}}(o.i&7)===7&&await p.yield()}await p.yield();{const o=st([[.2,.3],[21,.3],[21.6,2.6],[19.5,5.4],[10,6.8],[6.2,9.6],[6.4,13.6],[12.6,17.2],[15.2,20.4],[14.4,21.2],[11,18.8],[4.2,17.8],[3.3,22],[4.4,24],[3,25.6],[.2,26]],24),r=o.attributes.uv;for(let f=0;f<r.count;f++)r.setX(f,Math.floor(f/16)/24*144);t.add(o,{mat:d.PILE,par:1,anim:()=>[0,0,te.basin]})}const a=t.build(!0),s=e.build(!0);a.boundingSphere=new i.Sphere(h(0,30,0),420),s.boundingSphere=a.boundingSphere;for(let o=0;o<=4;o++){const r=new i.ShaderMaterial({uniforms:Object.assign(Yt(),tt,Ft,{uOccSkip:{value:new i.Vector2(-1,-1)},uPenK:oe,uShell:{value:o>3?0:o/3},uRise:e0,uCordWarm:{value:A(T.cordWarm.map(b=>b*.5))}}),vertexShader:q0,fragmentShader:Se,fog:!0}),f=lt(o>3?s:a,r,o>3?"garden-trunks":o?"garden-pile"+o:"garden",!1);f.visible=!1,o0.push(f)}}await p.yield();let Fe=null;{const t=[],e=[],l=[],a=[],s=(m,u,S,g,B,N,L,it,G,q,D,H,J)=>{t.push(m.x,m.z,u,S),e.push(g,B,N,L),l.push(it.r*G,it.g*G,it.b*G,O()),a.push(q,D,H,J)},o=F==="winter"?k[2].clone().lerp(k[3],.42).multiplyScalar(1.25):F==="night"?k[5].clone().lerp(k[2],.3).multiplyScalar(1.2):k[5].clone().multiplyScalar(1.05),r=F==="winter"?k[3].clone().lerp(k[0],.35):F==="night"?k[5].clone().lerp(k[3],.3):k[5].clone().lerp(k[4],.22),f=k[0].clone().multiplyScalar(1.1),b=k[4].clone().multiplyScalar(1.2),v=k[4].clone().multiplyScalar(1.15),n=new i.Color;for(const m of Jt){if(m.kind==="cypress"){s(m,m.i,0,0,m.h+.6,0,2.3,v,1,0,1,0,1);continue}const u=m.z>0&&m.x>0,S=u?50:32,g=u?40:22,B=Math.cos(m.ph)*1.8,N=Math.sin(m.ph)*1.8,L=m.h-12.5,it=m.r*.86,G=m.r*.7;s(m,m.i,0,B,L,N,m.r*.74,o,.62,0,1,0,.6);for(let q=0;q<S;q++){const D=(q+.5)/S,H=1-1.72*D,J=Math.sqrt(Math.max(1-H*H,0)),V=q*2.39996+m.ph,ft=Math.cos(V)*J,Ot=Math.sin(V)*J,qt=.9+.2*O();s(m,m.i,0,B+ft*it*qt,L+H*G*qt,N+Ot*it*qt,O.range(3.5,5.1),n.copy(o).lerp(r,O()*O()),O.range(.85,1.12),ft,H,Ot,.55+.45*R(-.7,.5,H))}for(let q=0;q<g;q++){const D=O.range(-.3,.95),H=Math.sqrt(1-D*D),J=O()*6.2832,V=Math.cos(J)*H,ft=Math.sin(J)*H,Ot=1.2+.1*O(),qt=!1;s(m,m.i,qt?3:1,B+V*it*Ot,L+D*G*Ot,N+ft*it*Ot,qt?4.3:O.range(3.2,4.3),qt?b:f,1,V,D,ft,.75+.25*R(-.4,.5,D))}}await p.yield();const x=[k[1].clone().multiplyScalar(1.15),k[4].clone().multiplyScalar(1.1),k[0].clone().multiplyScalar(1.05)],z={x:0,z:0},y=(m,u,S)=>{t.push(m,u,te.beds,2),e.push(0,O.range(1.6,4.6),0,O.range(1.45,2.15));const g=x[S],B=O.range(.88,1.12);l.push(g.r*B,g.g*B,g.b*B,O()),a.push(.25,.9,.1,.92)};for(const[m,u]of[[1,1],[-1,1],[1,-1],[-1,-1]]){for(let S=10;S<16;S++)for(let g=0;g<3;g++){const B=S*21.6+1.8+g*7.2;if(!(B<242||B>316))for(const N of[24,68,112])for(let L=N+2.2;L<N+36.5;L+=3.5)y(m*(L+O.range(-.6,.6)),u*(B+O.range(-.7,.7)),g)}for(let S=5;S<9;S++)for(let g=0;g<3;g++){const B=S*21.6+1.8+g*7.2;if(!(B<114||B>170))for(const N of[22,72])for(let L=N+2.2;L<N+42.5;L+=3.5)y(m*(B+O.range(-.7,.7)),u*(L+O.range(-.6,.6)),g)}await p.yield()}{const m=me,u=m.nz,S=-m.nx,g=Vt.length,B=[k[0].clone().multiplyScalar(1.05),k[1].clone().multiplyScalar(1.15),k[2].clone().multiplyScalar(1.3),k[4].clone().multiplyScalar(1.1)];let N=0,L=0,it=0;for(let G=0;G<g;G++){const q=Vt[G],D=Vt[Math.max(G-1,0)],H=Vt[Math.min(G+1,g-1)];let J=H[0]-D[0],V=H[1]-D[1];const ft=Math.hypot(J,V)||1;if(J/=ft,V/=ft,G>0&&(N+=Math.hypot(q[0]-Vt[G-1][0],q[1]-Vt[G-1][1])),!(N<L)){L=N+2.5,it++;for(const Ot of[-1,1])for(const qt of[-1,1]){const d0=q[0]-V*Ot*m.wd*.5,A0=q[1]+J*Ot*m.wd*.5,m0=qt*m.dp*.5;t.push(m.x,m.z,te.gate,4),e.push(u*d0+m.nx*m0,Math.max(A0,1.2),S*d0+m.nz*m0,O.range(1.2,1.6));const _e=B[(it+(Ot>0?0:2))%4],Ge=O.range(.9,1.1);l.push(_e.r*Ge,_e.g*Ge,_e.b*Ge,O()),a.push(m.nx*qt*.6-V*Ot*.6,.5+J*Ot*.5,m.nz*qt*.6,.9)}}}}if(F==="night"){const m=(u,S)=>{t.push(u,S,te.lamps,5),e.push(0,15.5+O.range(-.8,.8),0,6.3),l.push(b.r,b.g,b.b,O()),a.push(0,1,0,1)};for(const u of[-1,1])for(const S of[-1,1]){for(let g=S>0?1:0;g<6;g++)m(u*17.4,S*(126+36*g));for(let g=0;g<2;g++)m(u*(126+36*g),S*17.4)}}const c=new i.InstancedBufferGeometry;c.setAttribute("position",new i.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),c.setIndex([0,1,2,0,2,3]),c.setAttribute("aFoot",new i.InstancedBufferAttribute(new Float32Array(t),4)),c.setAttribute("aOff",new i.InstancedBufferAttribute(new Float32Array(e),4)),c.setAttribute("aTint",new i.InstancedBufferAttribute(new Float32Array(l),4)),c.setAttribute("aCN",new i.InstancedBufferAttribute(new Float32Array(a),4)),c.instanceCount=t.length/4;const P=F==="night"?k[4].clone().multiplyScalar(1.1):k[1].clone().multiplyScalar(F==="winter"?1.3:1.2),w=new i.ShaderMaterial({uniforms:Object.assign(Yt(),tt,{uOrigin:Ft.uOrigin,uOccSkip:{value:new i.Vector2(-1,-1)},uPenK:oe,uRise:e0,uBloomA:{value:f},uBloomB:{value:P},uHeart:{value:k[4].clone().multiplyScalar(1.25)},uLampK:{value:F==="night"?1:0}}),vertexShader:E0(U.glsl),fragmentShader:H0(U.glsl),fog:!0});Fe=lt(c,w,"garden-pompoms",!1),Fe.visible=!1}await p.yield();const s0={value:0};let Ue=null;{const l=[],a=[],s=[];for(let y=0;y<=44;y++)for(let c=0;c<=5;c++){const P=c/5*Math.PI*2;l.push(Math.cos(P),y/44,Math.sin(P)),a.push(c/5,y/44)}for(let y=0;y<44;y++)for(let c=0;c<5;c++){const P=y*6+c,w=P+5+1;s.push(P,w,P+1,P+1,w,w+1)}const o=[],r=[],f=[],b=(y,c,P,w,m,u,S,g,B,N)=>{o.push(y,c,P,O()*6.28),r.push(w,m,u,S),f.push(g,B,O(),N)};for(let y=0;y<10;y++)b(y*.6283+O.range(-.2,.2),O.range(1.4,3.4),O.range(41,49),25.5,.6,O.range(3,5),O.range(2.5,3.5),19.5,O.range(.85,1.1),.6+.4*O());for(let y=0;y<8;y++)for(let c=0;c<3;c++)b(y*.7854+(c-1)*.09,O.range(9.2,11),O.range(28,33),20.6,14.4,O.range(2.4,4.2),O.range(3,4.5),-2.8,O.range(.7,.95),O()*.6);for(let y=0;y<8;y++)for(let c=0;c<2;c++)b(y*.7854+.3927+(c-.5)*.12,O.range(5.5,6.6),O.range(35,38),20.6,13,O.range(2.5,4),O.range(3.5,5),-2.8,O.range(.65,.85),.3+O()*.5);for(let y=0;y<8;y++)b(y*.7854+.3927,O.range(4.5,5.5),O.range(12,14),5.6,20.4,O.range(1,1.6),O.range(2,3),-2.8,.6,O()*.3);const v=new i.InstancedBufferGeometry;v.setAttribute("position",new i.Float32BufferAttribute(l,3)),v.setAttribute("uv",new i.Float32BufferAttribute(a,2)),v.setIndex(s),v.setAttribute("aJet",new i.InstancedBufferAttribute(new Float32Array(o),4)),v.setAttribute("aJet2",new i.InstancedBufferAttribute(new Float32Array(r),4)),v.setAttribute("aJet3",new i.InstancedBufferAttribute(new Float32Array(f),4)),v.instanceCount=o.length/4;const n=k[3].clone().lerp(k[0],.35).multiplyScalar(1.45),x=k[0].clone().multiplyScalar(1.2),z=new i.ShaderMaterial({uniforms:Object.assign(Yt(),tt,{uOrigin:Ft.uOrigin,uCamW:{value:ze},uOccSkip:{value:new i.Vector2(-1,-1)},uPenK:oe,uFount:s0,uSilkA:{value:n},uSilkB:{value:x},uSilkGlow:{value:F==="night"?.3:0}}),vertexShader:j0(U.glsl),fragmentShader:X0(U.glsl),fog:!0,side:i.DoubleSide});Ue=lt(v,z,"fountain-silk",!1),Ue.visible=!1}await p.yield();const ie=14,he=new Float32Array(ie*4),ce=new Float32Array(ie*4),Le=[];let Ie=null,Pe=null,Ae=null;{const l=[],a=[];for(let f=0;f<=12;f++)for(let b=0;b<=8;b++)l.push(-1+2*b/8,-1+2*f/12,0);for(let f=0;f<12;f++)for(let b=0;b<8;b++){const v=f*9+b,n=v+8+1;a.push(v,v+1,n,v+1,n+1,n)}const s=new i.InstancedBufferGeometry;s.setAttribute("position",new i.Float32BufferAttribute(l,3)),s.setIndex(a),Pe=new i.InstancedBufferAttribute(he,4),Pe.setUsage(i.DynamicDrawUsage),Ae=new i.InstancedBufferAttribute(ce,4),Ae.setUsage(i.DynamicDrawUsage),s.setAttribute("aB1",Pe),s.setAttribute("aB2",Ae),s.instanceCount=ie;for(let f=0;f<ie;f++){const b=O()*6.28,v=O.range(.1,.9),n=Math.sqrt(1-v*v);Le.push({perch:h(Te.x+Math.cos(b)*n*12,Te.h-12+v*10,Te.z+Math.sin(b)*n*12),u0:.39+f*.0042,orbR:O.range(8,17),orbW:O.range(.55,.95)*(f%3?1:-1),orbPh:O()*6.28,hgt:O.range(-4,6),flapW:O.range(7.5,10),size:[.78,1.08,1.5][f%3]*O.range(.94,1.06),land:2.2+O()*2.9})}const o=F==="winter"?[k[0].clone().multiplyScalar(1.08),k[3].clone().lerp(k[0],.5),k[1].clone().multiplyScalar(1.25)]:F==="night"?[k[0].clone(),k[3].clone().lerp(k[0],.5),k[4].clone()]:[k[0].clone().multiplyScalar(1.1),k[3].clone().lerp(k[0],.55),k[4].clone().multiplyScalar(1.1)],r=new i.ShaderMaterial({uniforms:Object.assign(Yt(),tt,{uOrigin:Ft.uOrigin,uOccSkip:{value:new i.Vector2(-1,-1)},uPenK:oe,uBirdA:{value:o[0]},uBirdB:{value:o[1]},uBirdC:{value:o[2]},uBirdGlow:{value:F==="night"?.55:0}}),vertexShader:Y0(U.glsl),fragmentShader:Z0(U.glsl),fog:!0,side:i.DoubleSide});Ie=lt(s,r,"woven-birds",!1),Ie.visible=!1}await p.yield();const n0=[];{const t=me,e=t.nz,l=-t.nx,a=Vt,s=[],o=[],r=[],f=[],b=a.length,v=[[1,0,45.6,14.4,3.9],[-1,0,45.6,14.4,3.9],[0,1,3,12.6,1.5],[0,-1,26.2,33.8,1.5]];for(const[x,z,y,c,P]of v){const w=s.length/3;let m=0;for(let u=0;u<b;u++){const S=a[u],g=a[Math.max(u-1,0)],B=a[Math.min(u+1,b-1)];let N=B[0]-g[0],L=B[1]-g[1];const it=Math.hypot(N,L)||1;N/=it,L/=it;const G=-L,q=N;u>0&&(m+=Math.hypot(S[0]-a[u-1][0],S[1]-a[u-1][1]));for(let D=0;D<2;D++){const H=D?1:-1,J=x!==0?H*t.wd*.5:z*t.wd*.5,V=x!==0?x*t.dp*.5:H*t.dp*.5,ft=S[0]+G*J,Ot=S[1]+q*J;s.push(t.x+e*ft+t.nx*V,Ot,t.z+l*ft+t.nz*V),x!==0?o.push(t.nx*x,0,t.nz*x):o.push(e*G*z,q*z,l*G*z),r.push(240-Z(y,c,D),-262+m*P)}if(u<b-1){const D=w+u*2;f.push(D,D+1,D+2,D+1,D+3,D+2)}}}const n=new i.BufferGeometry;n.setAttribute("position",new i.Float32BufferAttribute(s,3)),n.setAttribute("normal",new i.Float32BufferAttribute(o,3)),n.setAttribute("uv",new i.Float32BufferAttribute(r,2)),n.setIndex(f),n.boundingSphere=new i.Sphere(h(t.x,34,t.z),60);for(let x=0;x<=3;x++){const z=lt(n,U.makeWeaveMaterial({back:!1,occSkip:[-1,-1],side:i.DoubleSide,penumbra:5,shell:x/3,pile:1.1,fill:1}),x?"border-gate-pile"+x:"border-gate",!1);z.visible=!1,n0.push(z)}}await p.yield();const r0=K?[31,34,50,68,82,87,88,88,88,82,76,71,68,67,69]:null,y0=[[124,31,246.5],[100,28.5,249],[78,26,261],[54,24,276],[29,22.5,288],[8,21.5,281],[.5,21,258],[0,21,218],[0,21,175],[.5,22,150],[5,26,134],[18,34,125],[36,44,127],[56,56,136],[76,65,145]],Mt=k0([[0,9,466],[0,9,446],[0,9,425],[0,9,404],[1,9,386],[4,9.1,366],[13,9.2,348],[28,9.3,335],[50,9.4,328],[76,9.5,327],[102,9.9,331],[126,27,339],jt(72,52,-75),jt(80,68,-50),jt(84,79,-27),jt(82,87,-10),jt(70,93,-1),[208,84,292],[198,69,271],[181,54,257],[150,36,246]].concat(y0.map((t,e)=>[t[0],r0?r0[e]:t[1],t[2]]),[[95,72,144],[107,77,128],[103,80,107],[86,80,88],[63,76,64],[42,69,42],[23,58,20],[9,45,-11],[0,31,-56],[-6,19,-98],[-8,14,-121],[-11,10.4,-146],[-11,10.4,-172],[-10,11.3,-192],[-5,13.8,-210],[-1,16.7,-224],[0,21,-245.33],[0,28,-280.67],[0,35,-316]]).map(([t,e,l])=>[t,e,l+ct])),Ut=Mt.nearestXZ(-8,-121+ct).u,b0=Mt.nearestXZ(-13.5,-160+ct).u,l0=jt(82,87,-10),fe=Mt.nearestXZ(126,339+ct).u,De=Mt.nearestXZ(l0[0],l0[2]+ct).u,x0=Mt.nearestXZ(183,252+ct).u,mt=Mt.nearestXZ(.5,150+ct).u,ee=Mt.nearestXZ(103,107+ct).u,Bt=Mt.nearestXZ(23,20+ct).u,ke=Mt.nearestXZ(me.x,me.z+ct).u,se=.597,ve=.847,Ke=t=>t<=mt?t*(se/mt):t>=Ut?1-(1-t)*((1-ve)/(1-Ut)):se+(t-mt)/(Ut-mt)*(ve-se),pe=t=>t<=se?t*(mt/se):t>=ve?1-(1-t)*((1-Ut)/(1-ve)):mt+(t-se)/(ve-se)*(Ut-mt);Jt.forEach(t=>{const e=Lt((Math.abs(t.z)-150)/62.5,0,1);t.z>0?(t.down=ee+.008+t.dr*.016,t.fall=.07):e>.7||t.kind==="cypress"&&Math.abs(t.x)<90?(t.down=Bt+.004+t.dr*.008,t.fall=.1,t.slow=!0):(t.down=Bt-.012+e*.02+t.dr*.012,t.fall=.07+.03*e)});const Xt=(t,e,l)=>Math.exp(-(((t-e)/l)**2)),S0=h(),z0=h(),_t=h(),M0=h(),Be=[[.3,104,30,247],[.37,84,29,243],[.41,80,27,226],[.45,74,30,218],[.5,0,30,150],[.53,0,34,50],[.6,0,40,0],[.64,0,36,0]],ne=[[.345,88],[.36,94],[.372,94],[.376,91],[.38,80],[.385,64],[.39,46],[.4,20],[.41,4],[.42,-5],[.43,-9]].map(([t,e])=>{Mt.pointAt(t+(ke-.3812),_t);const l=e*Math.PI/180;return[t,_t.x-Math.sin(l)*70,_t.y+Z(-4,5,R(.378,.42,t)),_t.z-ct-Math.cos(l)*70]}),Zt=(t,e)=>{const l=R(fe-.012,fe+.016,e),a=R(De-.05,De+.05,e),s=64+Z(50,300,a),o=6*(1-a);Mt.pointAt(e,_t);let r=Z(-150,Tt.x+re[0]*s+ye[0]*o,l),f=Z(-330,Tt.z+re[1]*s+ye[1]*o,l),b=Z(_t.y-18,_t.y*.7*(1-a)-25*a,l);const v=Ke(e),n=R(.283,.328,v);if(n>0){let y=0;for(;y<Be.length-2&&v>Be[y+1][0];)y++;const c=Be[y],P=Be[y+1],w=R(c[0],P[0],v);r=Z(r,Z(c[1],P[1],w),n),b=Z(b,Z(c[2],P[2],w),n),f=Z(f,Z(c[3],P[3],w),n)}const x=e-(ke-.3812),z=R(.345,.365,x)*(1-R(.415,.43,x));if(z>0){let y=0,c=0,P=0;for(let w=-1;w<=1;w++){const m=Lt(x+w*.003,ne[0][0],ne[ne.length-1][0]),u=w?.25:.5;let S=0;for(;S<ne.length-2&&m>ne[S+1][0];)S++;const g=ne[S],B=ne[S+1],N=(m-g[0])/(B[0]-g[0]);y+=u*Z(g[1],B[1],N),c+=u*Z(g[2],B[2],N),P+=u*Z(g[3],B[3],N)}r=Z(r,y,z),b=Z(b,c,z),f=Z(f,P,z)}return S0.set(r,b,ct+f)},i0=(t,e)=>{Mt.pointAt(e,_t);const l=2750*(e-.535),a=R(.455,.482,e);return M0.set(Z(-235,Lt(l,-230,150),a),Z(44,0,a),ct+Z(-285,_t.z-ct-100,a))},Ve=t=>{const e=Lt(t,0,1)-1;return 1+2.2*e*e*e+1.2*e*e},c0=(t,e,l,a,s=.07,o=!1)=>Ve((l-t)/.05)*(o?Math.pow(1-Lt((a-e)/s,0,1),1.15):1-R(e,e+s,a)),ge=h(),Gt=h(),ae=h(),ue=h(),f0=(t,e,l,a,s)=>{const o=Le[t],r=R(o.u0,o.u0+.034,e),f=R(.447+t*.002,.5+t*.002,e),b=R(mt-.034+t*.0012,mt+.03,l),v=R(mt-.002,mt+.016,l)*(1-R(mt+.035,mt+.085,l)),n=R(Bt-.04+t*.0015,Bt+.012,l),x=R(Bt+.03+t*.002,Ut-.012,l),z=a*o.orbW+o.orbPh;ae.set(78+Math.cos(z)*o.orbR*1.5,34+o.hgt*.6+t%3*3.5+2*Math.sin(a*1.3+t),223+Math.sin(z)*o.orbR*1.05),Mt.pointAt(Math.min(l+.028+t%7*.006,mt+.004),ue),ue.z-=ct;const y=t/(ie-1)-.5;ue.x+=y*30+Math.cos(z)*o.orbR*.3,ue.y+=17+15*(1-4*y*y)+o.hgt*.7+1.5*Math.sin(a*1.3+t),ue.z+=Math.sin(z)*o.orbR,s.copy(o.perch).lerp(ae,r).lerp(ue,f);const c=14+o.orbR*2.1;return ae.set(Z(-92,-30,v)+Math.cos(z*.55)*c*(1-.45*v),27+44*v+o.hgt*2.4+2.5*Math.sin(a*.9+t),Z(-34,-20,v)+Math.sin(z*.55)*c*.75),s.lerp(ae,b),ae.set(-96+Math.cos(z*.6)*c*1.1,31+o.hgt*1.8+2.5*Math.sin(a*.9+t),-172+Math.sin(z*.6)*c*.8),s.lerp(ae,n),ae.set(-92+Math.cos(o.land)*42,3.4,-178+Math.sin(o.land)*36),s.lerp(ae,x),o.size*R(0,.22,r)*(1-x*x)};let u0=-1;const P0=(t,e,l)=>{const a=Ke(e);let s=0;for(const c of Jt){let P=l?c0(c.up,c.down,a,e,c.fall,c.slow):0;P<.004?P=0:P*=1+.012*Math.sin(t*1.4+c.ph),le[c.i]=P,a0[c.i].z=c.h*Math.min(P,1),P>s&&(s=P)}const o=l?c0(.425,ee+.045,a,e):0,r=l?R(.44,.53,a)*(1-R(ee-.006,ee+.075,e)):0,f=l?R(.285,.37,a)*(1-R(Ut-.06,Ut-.004,e)):0,b=l?R(.35,.45,a)*(1-R(Ut-.047,Ut+.001,e)):0;le[te.basin]=o<.004?0:o,le[te.beds]=f<.004?0:Math.min(f*1.15,1)*(1+.02*Math.sin(t*1.1));const v=s>0||o>.004;for(const c of o0)c.visible=v;s0.value=r,Ue.visible=r>.004;let n=l?Ve((a-.262)/.05)*(1-R(ke+.007,ke+.037,e)):0;n=n<.004?0:n*(1+.008*Math.sin(t*1.2)),le[te.gate]=n;const x=l?Ve((a-.33)/.05)*(1-R(Bt+.02,Bt+.09,e)):0;le[te.lamps]=x<.004?0:x;for(const c of n0)c.visible=n>0,c.scale.y=Math.max(n,.004);Fe.visible=v||f>.004||n>0||x>.004;const z=Math.max(Math.min(s,1),f,b);z!==u0?(u0=z,U.setGarden({water:b,beds:f,shadow:Math.min(s*4,1),tufts:1-.5*R(0,.5,z)})):U.setGarden({water:b,beds:f});let y=!1;for(let c=0;c<ie;c++){const P=l?f0(c,a,e,t,ge):0,w=c*4;if(P<.004){ce[w+3]=0;continue}y=!0,f0(c,Ke(e-.0012),e-.0012,t-.06,Gt),Gt.subVectors(ge,Gt);const m=Gt.length();m<.001?Gt.set(-.6,.3,-.7):Gt.multiplyScalar(1/m),Gt.y=Lt(Gt.y,-.6,.6),he[w]=ge.x,he[w+1]=ge.y,he[w+2]=ge.z,he[w+3]=t*Le[c].flapW+c*1.7,ce[w]=Gt.x,ce[w+1]=Gt.y,ce[w+2]=Gt.z,ce[w+3]=P}Ie.visible=y,y&&(Pe.needsUpdate=!0,Ae.needsUpdate=!0)};return{scene:St,path:Mt,duration:55,pace:t=>.9-.05*Xt(t,pe(.105),.05)+.24*Xt(t,fe+.008,.028)-.24*Xt(t,De+.005,.045)+.1*Xt(t,x0+.03,.03)-.2*Xt(t,pe(.43),.04)-.08*Xt(t,pe(.57),.04)+.12*Xt(t,mt+.04,.03)-.22*Xt(t,ee+.035,.05)+.2*Xt(t,Bt+.03,.035)-.22*Xt(t,b0-.015,.04)+.12*R(.9,.96,t),title:Q==="winter"?"The Garden Underfoot, in Winter":Q==="night"?"The Garden Underfoot, before Dawn":"The Garden Underfoot",camera:{fov:62,near:1,far:2600,lookAhead:22,sway:.5,bank:.6},pois:[{at:Zt,from:.032,to:pe(.34),weight:.85,fade:.1},{at:Zt,from:.028,to:fe+.04,weight:1,fade:.18},{at:Zt,from:.03,to:fe+.02,weight:1,fade:.2},{at:Zt,from:.034,to:fe,weight:1,fade:.22},{at:Zt,from:.037,to:pe(.36),weight:.8,fade:.12},{at:Zt,from:.042,to:mt+.07,weight:.85,fade:.12},{at:Zt,from:.084,to:mt+.06,weight:.8,fade:.14},{at:Zt,from:.12,to:mt+.05,weight:.75,fade:.16},{at:Zt,from:.176,to:mt+.04,weight:.85,fade:.18},{at:[190,18,ct+170],from:mt+.004,to:ee-.022,weight:.7,fade:.3},{at:[-90,0,ct-140],from:ee-.04,to:Bt+.012,weight:.8,fade:.2},{at:[-90,0,ct-140],from:ee-.03,to:Bt+.004,weight:.5,fade:.2},{at:[-30,24,ct-316],from:Bt-.018,to:Ut+.045,weight:.6,fade:.25},{at:[-70,-12,ct-262],from:Bt-.001,to:Ut-.007,weight:.9,fade:.3},{at:(t,e)=>(Mt.pointAt(e,_t),z0.set(U.pacer.x-6,2.6,Math.min(U.pacer.z+ct,_t.z-30))),from:Ut-.03,to:.925,weight:.5}].concat(K?[{at:i0,from:.4,to:.612,weight:.9,fade:.13},{at:i0,from:.408,to:.606,weight:.6,fade:.14}]:[]),portal:{shape:"circle",radius:7,color:T.portal,glow:.6,revealDistance:300},post:{exposure:T.post.exposure,bloom:{strength:.22,radius:.6,threshold:1},grade:{saturation:T.post.sat,contrast:1.05,tint:T.post.tint,shadowTint:T.post.shadowTint,vignette:.25,grain:.02,aberration:0}},ride:"none",style:"none",update(t,e,l,a){U.setProgress(a),P0(e,a,!p.through),U.update(t,e,l),l.getWorldPosition(ze),Ye.rotation.z=.2*Math.sin(e*1.25)+.06*Math.sin(e*3.3+1),Ye.rotation.x=.12*Math.sin(e*1.05+.7);const s=K?R(.395,.435,a)*(1-R(.49,.55,a)):0;Ft.uTail.value.z=s*(.86+.14*Math.sin(e*2.4)),Ft.uTail.value.w=R(Bt,Bt+.1,a)*(1-R(.93,1,a));const o=tt.uWave.value;for(const v of Xe)v.visible=o.w>.002;const r=v=>{const n=(v-o.x)/Math.max(o.z,1);return o.w*o.y*Math.exp(-n*n*2.2)};Ce&&(Ce.position.y=r(gt.x)),Ze.position.y=r(dt.x),t0.position.y=Re.position.y=r(Ct.x);const f=.84+.1*Math.sin(e*1.7)+.06*Math.sin(e*5.3+1)+.05*Math.sin(e*11.7),b=.93+.05*Math.sin(e*9+2*Math.sin(e*3.7))+.02*Math.sin(e*23);Ht[0].set(be[0]*T.stove*f,be[1]*T.stove*f,be[2]*T.stove*f,.6),Ht[1].set(xe[0]*T.lamp*b,xe[1]*T.lamp*b,xe[2]*T.lamp*b,.75),Ft.uGlowK.value.set(T.stove*(.5+.5*f),T.lamp)},dispose(){U.dispose()}}}};export{ea as default};
