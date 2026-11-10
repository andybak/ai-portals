import*as p from"three";import{makePath as Vt,clamp as M0,lerp as _,smoothstep as y0}from"../kit/core.js";import{buildHero as Xt,buildPetalRoad as Zt,heroKit as x,makeCandleSet as vt,makeHeadSet as yt,makeLoosePetalSet as jt,makeFlagSet as Nt}from"../parts/marigold-way-home.js";const l0=Math.PI*2,B0=["#0B1230","#1F47A8","#FF9A1F","#FFD98A","#7A4FB0","#D6336C","#A8492E"],k0=30,Ut=12,K0=-80,Y0=-190,S0=-260,Z0=-390,re=-376,m0=2,J=11,ye=34,P0=48,R=36,Q=22,ge=32,$=30,Q0=46,Z={x:0,z:-135,r:9},e0={x:-22,z:-157},ca=22,gt=7,le=(d,a,q)=>{const v0=M0((d-a)/q,-1,1),d0=Math.cos(v0*Math.PI/2);return d0*d0},$0=d=>17*le(d,-135,50),wt=d=>-2.4*le(d,-44,34)+27*le(d,-132,54)+7.4*y0(-200,-220,d)*y0(-258,-239,d)-5.4*le(d,-294,24),Et=d=>gt+3.4*le(d,-46,36)+4.4*le(d,-130,56)+2*y0(-266,-298,d),ie=d=>d<S0?_(15,5,y0(0,42,d+362)):_(_(1.7,3,y0(6,-6,d-K0)),5,y0(6,-6,d-Y0)),Yt={rain:{zen:"#1a3fa6",hor:"#2d4fae",east:"#0b1230",glow:"#c9577a",glowK:.5,stars:.7,moon:.25,full:0,key:"#3f62d8",keyK:.22,sky:"#3c63d6",skyK:.62,amb:1,skyGain:1.9,wet:1,wind:.06,burn:0,petal:.9,warm:"#ffb45a",fog:"#1c1a4c",fogD:.0024,rockets:.8,exposure:1.12,moths:1,tint:"#fff4ea",shadow:"#0a0f3a",side:1,room:[1,1,1],back:"#3f62d8",backK:.1,winK:0,shaft:0,wetIn:.92,blaze:.85},moon:{zen:"#0c1a52",hor:"#16286c",east:"#060a22",glow:"#30407a",glowK:.25,stars:1,moon:1.6,full:1,key:"#aebfff",keyK:3.6,elev:.36,sky:"#2c46a8",skyK:.5,amb:.85,skyGain:1.5,wet:.3,wind:.04,burn:0,petal:1,warm:"#ffb04e",fog:"#12143c",fogD:.0021,rockets:1.4,exposure:1.18,moths:1.5,tint:"#f4f1ff",shadow:"#080c36",side:-1,room:[.26,.32,.5],back:"#aebfff",backK:.2,winK:1.2,shaft:.33,wetIn:.22,blaze:.5},dawn:{zen:"#5a6fc0",hor:"#f0a48c",east:"#3a3f8a",glow:"#ffcf8a",glowK:1.1,stars:.12,moon:0,full:0,key:"#ff9c8a",keyK:1.15,sky:"#8b86d0",skyK:.7,amb:1.05,skyGain:1,wet:.25,wind:.4,burn:.6,petal:.8,warm:"#ffa850",fog:"#4a3a70",fogD:.0023,rockets:0,exposure:1.05,moths:.5,tint:"#fff0ee",shadow:"#1a1240",side:-1,room:[1.7,1.15,1.1],back:"#ff9c8a",backK:.65,winK:1.3,paneK:.36,shaft:.42,wetIn:.2,blaze:.62},dusk:{zen:"#274aa8",hor:"#ff8f3a",east:"#141a52",glow:"#ffae3c",glowK:1.3,stars:.3,moon:.2,full:0,key:"#ff9a3c",keyK:1.1,sky:"#5a66c8",skyK:.62,amb:1,skyGain:1.25,wet:.2,wind:0,burn:0,petal:.85,warm:"#ffb252",fog:"#33265e",fogD:.0022,rockets:.6,exposure:1.08,moths:.8,tint:"#fff2e2",shadow:"#150f3c",side:1,room:[1.3,1,.78],back:"#ff9a3c",backK:.3,winK:1.3,paneK:.45,shaft:.45,wetIn:.2,blaze:.8}},Ze=`
#define TREE_X ${e0.x.toFixed(1)}
#define TREE_Z ${e0.z.toFixed(1)}
float bumpf(float z, float c, float h){ float t = clamp((z - c) / h, -1., 1.); float k = cos(t * 1.5707963); return k * k; }
float pathX(float z){ return 17. * bumpf(z, -135., 50.); }
// the camera's own line from the kitchen on (the rare gust rides it)
float camX(float z){ return 7.4 * (1. - smoothstep(-220., -200., z)) * smoothstep(-258., -239., z) - 5.4 * bumpf(z, -294., 24.); }
float camY(float z){ return 7. + 2. * (1. - smoothstep(-298., -266., z)); }
float roadHW(float z){
  float a = mix(1.7, 3., 1. - smoothstep(-86., -74., z)); a = mix(a, 5., 1. - smoothstep(-196., -184., z));
  return z < -260. ? mix(15., 5., smoothstep(0., 42., z + 362.)) : a; }
float openAt(vec3 p){
  float inP = step(p.z, -81.9) * step(-188.1, p.z);
  float o = inP * mix(1., 0.38, smoothstep(33., 37., abs(p.x)));
  float dz = min(abs(p.z + 80.), abs(p.z + 190.));
  o = max(o, 0.6 * exp(-dz / 12.) * (1. - smoothstep(8., 20., abs(p.x))));
  return max(o, 0.13); }
// petal-road light on a surface point (the road glows on its own account)
float roadLight(vec3 p, vec3 n){
  float hw = roadHW(p.z); float dx = max(abs(p.x - pathX(p.z)) - hw, 0.);
  float d = sqrt(dx * dx + p.y * p.y) / 5.;
  float e = sqrt(hw / 3.) / (1. + d * sqrt(d) * 1.05);
  return e * mix(0.5, 1.2, 0.5 - 0.5 * n.y) * (1. - smoothstep(-372., -362., p.z) * 0.6); }
// the altar's blaze as one big soft light in the best room, spilling through the door
float blazeLight(vec3 p, vec3 n){
  vec3 L = vec3(0., 15., -372.) - p; float d = length(L); L /= max(d, 1e-3);
  float m = p.z < -260. ? 1. : (1. - smoothstep(6., 9. + (p.z + 260.) * 0.12, abs(p.x))) * exp(-(p.z + 260.) / 70.);
  return m * (0.3 + 0.7 * clamp(dot(n, L) * 0.6 + 0.4, 0., 1.)) / (1. + d * d / 2200.); }
// the charcoal along the bench stove as one soft line of light for the kitchen's ceiling timber, 26 to 28 m over it
float stoveLight(vec3 p, vec3 n){
  vec3 L = vec3(17., 4., clamp(p.z, -247., -205.)) - p; float d = length(L); L /= max(d, 1e-3);
  return (0.3 + 0.7 * clamp(dot(n, L) * 0.6 + 0.4, 0., 1.)) / (1. + d * d / 2200.); }
// what the hour does indoors: uRoom tints and scales the sky ambient under a roof, uBackCol comes in at the street door
uniform vec3 uRoom, uBackCol, uWinCol; uniform float uSide;
vec3 roomAmb(float open){ return mix(uRoom, vec3(1.), smoothstep(0.13, 0.38, open)); }
float backLight(vec3 p, vec3 n){ return smoothstep(-82., -76., p.z) * (0.3 + 0.7 * max(n.z, 0.)) * exp(-(30. - p.z) / 75.); }
// hard key light (moon / low sun) from the left and a little ahead; a shadow falls KSH metres across the floor per metre of height
uniform vec2 uKsh;
#define KSH uKsh
const vec2 KSHW = vec2(1.256, 0.256);   // the window shaft keeps one slope so it matches its dusty sheets
// 1 where a ray that crosses an arcade's column line at height y, position z passes through an arch
float arcadeOpen(float y, float z){
  float c = abs(fract((-82. - z) / 21.2) - 0.5) * 21.2;
  return smoothstep(0., 0.8, 8.9 - c) * smoothstep(0., 0.8, 12.5 + sqrt(max(82.8 - c * c, 0.)) - y); }
float keyShade(vec3 p){
  if (p.z > -81.9 || p.z < -188.1) return 0.;
  p.x *= uSide;      // the light comes from -x here; the house is mirror-symmetric apart from the tree
  float lit = step(26.2, p.y);
  // through the left arcade's arches (pools of light and long column shadows on the open floor) or over its roof
  if (p.x > -36.) { float h = (p.x + 36.) / KSH.x;
    lit = max(lit, max(arcadeOpen(p.y + h, p.z - h * KSH.y), smoothstep(0., 1.5, p.y + (p.x + 48.) / KSH.x - 34.5))); }
  // into the right arcade: arch-shaped pools on its floor and back wall
  if (p.x > 36. && p.y < 26.) { float h = (p.x - 36.) / KSH.x; lit *= arcadeOpen(p.y + h, p.z - h * KSH.y); }
  lit *= smoothstep(-0.6, 0.6, (p.z + 188.) - (36. - p.y) * KSH.y);
  // the fountain: upper bowl, basin rim, stem and finial
  vec2 d = p.xz - vec2(0., -135.);
  float sh = (1. - smoothstep(4.2, 5.6, length(d - KSH * max(8.5 - p.y, 0.)))) * step(p.y, 8.3);
  sh = max(sh, (1. - smoothstep(9.2, 10.4, length(d - KSH * max(3. - p.y, 0.)))) * step(p.y, 2.6));
  float al = dot(d, vec2(0.98, 0.2)), ac = abs(dot(d, vec2(-0.2, 0.98)));
  sh = max(sh, step(0., al) * (1. - smoothstep(11.6, 12.4, al / length(KSH) + p.y)) * (1. - smoothstep(0.7, 1.5, ac)));
  lit *= 1. - 0.9 * sh;
  // the tree: a dappled crown and its trunk
  vec2 t = p.xz - vec2(TREE_X * uSide, TREE_Z); vec2 tc = t - KSH * (25. - p.y);
  float tr = length(vec2(dot(tc, vec2(0.98, 0.2)) / 17.5, dot(tc, vec2(-0.2, 0.98)) / 13.)) + 0.2 * sin(p.x * 0.9 + p.z * 0.35) * sin(p.z * 0.8 - p.x * 0.3) + 0.1 * sin(p.x * 2.3 + 1.) * sin(p.z * 2.1);
  float ts = (1. - smoothstep(0.78, 1.05, tr)) * step(p.y, 14.);
  float al2 = dot(t, vec2(0.98, 0.2)), ac2 = abs(dot(t, vec2(-0.2, 0.98)));
  ts = max(ts, step(0., al2) * step(al2 / length(KSH) + p.y, 16.) * (1. - smoothstep(1.2, 2.2, ac2)));
  lit *= 1. - 0.85 * ts;
  return lit; }
// the key light through the best room's left window (x = -30, z -322 +- 3.2, y 9..30): a long slatted patch on the floor
float winLight(vec3 p){
  p.x *= uSide;
  if (p.z > -262. || p.x < -29.8) return 0.;
  float h = (p.x + 30.) / KSHW.x; float y = p.y + h, z = p.z - h * KSHW.y + 322.;
  float m = smoothstep(0., 0.5, 3.2 - abs(z)) * smoothstep(0., 0.6, y - 9.) * smoothstep(0., 0.6, 30. - y);
  float slat = 0.5 + 0.5 * smoothstep(0.16, 0.4, abs(fract(y / 1.9) - 0.5));
  return m * slat * smoothstep(0.06, 0.3, abs(z)) * smoothstep(0.15, 0.45, abs(y - 19.5)); }
`;function Qt(d,a){return x.shader(d,{uniforms:a,vertexShader:x.FOG_V+`
      attribute vec3 aCol; attribute vec4 aAux; varying vec3 vCol, vN, vL, vW; varying vec4 vAux;
      void main(){ vCol = aCol; vAux = aAux; vL = position; vec3 P = position;
        vN = normalize(mat3(modelMatrix) * normal + vec3(0., 1e-5, 0.));
        ${x.V_WORLD} }`,fragmentShader:x.FOG_F+x.GLSL_COMMON+Ze+`
      uniform vec3 uDadoA, uDadoB, uTileBlue, uTileYel, uTileWhite, uMoss, uKeyDir, uKeyCol, uPathCol, uBlazeCol, uReflZen, uReflHor;
      uniform float uWet, uWetIn, uPathGain, uWinK;
      varying vec3 vCol, vN, vL, vW; varying vec4 vAux;
      float herring(vec2 p, out vec2 id){
        vec2 c = floor(p), f = fract(p); float k = mod(c.x - c.y, 4.);
        float l = f.x, r = 1. - f.x, b = f.y, t = 1. - f.y, e;
        if (k < 0.5) { e = min(l, min(b, t)); id = c; }
        else if (k < 1.5) { e = min(r, min(b, t)); id = c - vec2(1., 0.); }
        else if (k < 2.5) { e = min(min(l, r), t); id = c + vec2(0.37, 0.); }
        else { e = min(min(l, r), b); id = c + vec2(0.37, 1.); }
        return e; }
      void main(){
        vec3 n = normalize(vN + vec3(0., 1e-4, 0.));
        vec3 V = normalize(cameraPosition - vW + vec3(0., 1e-4, 0.));
        float id = vAux.w, gloss = vAux.z;
        vec2 fl = vW.xz, wl = abs(n.x) > 0.6 ? vec2(vW.z, vW.y) : vec2(vW.x, vW.y);
        float aaF = fwidth(fl.x) + fwidth(fl.y), aaW = fwidth(wl.x) + fwidth(wl.y);
        vec2 lw = abs(n.y) > 0.6 ? fl : wl;      // noise in the surface's own plane (sheared coordinates drew a diagonal hatch on the walls)
        float n1 = vnoise(lw * 0.23 + 3.7), n2 = vnoise(lw * 1.7 + 11.), n3 = vnoise(lw * 6.1);
        vec3 alb = vCol; float grout = 0., wetK = 0.;
        if (id < 0.5 || id > 7.5) {
          if (id > 7.5) {
            vec3 dd = id > 8.5 ? uDadoB : uDadoA; float y = vW.y + 0.25 * sin(wl.x * 0.9) * 0.;
            float band = step(y, 8.6) * step(8.0, y);
            float inD = step(y, 8.0);
            float dq = abs(fract(wl.x / 2.6) - 0.5) * 2. + abs((y - 6.3) / 0.85);
            float sten = (step(dq, 1.) - step(dq, 0.62)) + step(abs(y - 4.9), 0.11) + step(dq, 0.22);
            float brush = vnoise(vec2(wl.x * 0.35, y * 1.6)) * 0.5 + vnoise(vec2(wl.x * 2.1, y * 0.25)) * 0.5;
            dd *= 0.62 + 0.55 * brush;
            dd = mix(dd, (id > 8.5 ? uTileBlue * 0.9 : uTileYel * 0.7), sten * 0.75 / (1. + aaW * 2.5));
            alb = mix(alb, dd, inD); alb = mix(alb, uTileYel * 0.55, band);
            alb *= 1. - 0.25 * (1. - smoothstep(0., 2.2, y)) * (0.5 + 0.5 * n2);
          }
          float streak = vnoise(vec2(wl.x * 0.9, wl.y * 0.08));
          alb *= 0.74 + 0.3 * n1 + 0.16 * n2 + 0.08 * n3 - 0.12 * streak;
          alb = mix(alb, alb * vec3(1.15, 1.02, 0.9), smoothstep(0.55, 0.9, vnoise(wl * 0.11 + 7.)) * 0.5);
        } else if (id < 1.5) {
          vec2 tid; float e = herring(fl / 2., tid); float h = hash21(tid);
          grout = (1. - smoothstep(0.03, 0.03 + aaF * 0.8, e)) / (1. + aaF * 5.);
          alb *= 0.72 + 0.42 * h + 0.14 * n3; alb = mix(alb, alb * vec3(0.7, 0.62, 0.7), step(0.86, h));
          alb = mix(alb, vec3(0.05, 0.035, 0.04), grout * 0.8); wetK = 1.;
        } else if (id < 2.5) {
          vec2 q = fl / vec2(5.2, 3.6); float row = floor(q.y); q.x += hash21(vec2(row, 3.)) * 0.8 + row * 0.37;
          vec2 c = floor(q), f = fract(q); float w = 0.7 + 0.3 * hash21(c + 11.);
          float e = min(min(f.x, 1. - f.x) * 5.2, min(f.y, 1. - f.y) * 3.6) + (n2 - 0.5) * 0.25; float h = hash21(c);
          grout = (1. - smoothstep(0.14, 0.3 + aaF * 0.8, e)) / (1. + aaF * 2.);
          alb *= (0.45 + 0.7 * h * w) * (0.78 + 0.34 * n1 + 0.14 * n3);
          alb = mix(alb, uMoss * (0.3 + 0.6 * n2), grout * 0.92 + 0.4 * smoothstep(0.55, 0.85, n1) * (1. - grout));
          wetK = 1.;
        } else if (id < 3.5) {
          vec2 q = wl / 4.; vec2 c = floor(q), t = fract(q) - 0.5; float odd = mod(c.x + c.y, 2.);
          float r = length(t); float a = r > 1e-3 ? atan(t.y, t.x) : 0.;
          vec3 col = uTileWhite * (0.9 + 0.1 * n2);
          if (vW.y < 20.) {
            if (odd < 0.5) { float st = 0.37 * (0.58 + 0.42 * cos(a * 4.)); col = mix(col, uTileBlue, step(r, st)); col = mix(col, uTileWhite, step(r, st - 0.07) * step(0.16, r)); col = mix(col, uTileYel, step(r, 0.11)); }
            else { float d = abs(t.x) + abs(t.y); col = mix(col, uTileBlue, step(d, 0.36)); col = mix(col, uTileYel, step(d, 0.24)); col = mix(col, uTileBlue, step(d, 0.11)); }
            float cr = length(abs(t) - 0.5); col = mix(col, uTileYel, step(cr, 0.22)); col = mix(col, uTileBlue, step(cr, 0.22) * step(0.15, cr));
            float e = 0.5 - max(abs(t.x), abs(t.y)); col = mix(col, vec3(0.2, 0.2, 0.26), (1. - smoothstep(0.012, 0.012 + aaW * 0.3, e)) / (1. + aaW * 2.));
            alb = col * (0.85 + 0.15 * hash21(c)); gloss = max(gloss, 0.7);
          } else if (vW.y < 22.) { float s = fract(wl.x / 2.); alb = mix(uTileBlue, uTileYel, step(0.5, s) * step(vW.y, 21.4) * step(20.6, vW.y)); gloss = max(gloss, 0.5); }
          else alb *= 0.76 + 0.3 * n1 + 0.14 * n2;
        } else if (id < 4.5) {
          float g = vnoise(vec2(vW.x * 0.35 + vW.z * 0.35, (vW.y * 1.3 + vW.z + vW.x) * 4.));
          alb *= 0.6 + 0.5 * g + 0.2 * n3;
        } else if (id < 5.5) {
          vec2 q = fl / 3.2; vec2 c = floor(q), f = fract(q); float e = min(min(f.x, 1. - f.x), min(f.y, 1. - f.y)); float h = hash21(c);
          vec2 k = abs(f - 0.5); float ins = step(0.84, k.x + k.y);
          grout = (1. - smoothstep(0.018, 0.018 + aaF * 0.4, e)) / (1. + aaF * 3.);
          alb *= 0.74 + 0.36 * h + 0.14 * n3; alb = mix(alb, uTileBlue * (0.6 + 0.5 * h), ins);
          alb = mix(alb, vec3(0.06, 0.04, 0.05), grout * 0.8); wetK = 1.;
        } else if (id < 6.5) {
          vec2 q = vec2(abs(n.x) > 0.25 ? vW.z : vW.x, vW.y * 2.4 + abs(vW.x) * 0.9) / vec2(1.7, 2.6); q.x += 0.5 * mod(floor(q.y), 2.);
          vec2 c = floor(q), f = fract(q); float rnd = sqrt(max(1. - (2. * f.x - 1.) * (2. * f.x - 1.), 0.));
          alb *= (0.45 + 0.6 * rnd) * (0.55 + 0.45 * f.y) * (0.75 + 0.45 * hash21(c)) / (1. + min(aaW, 4.) * 0.6) + min(aaW, 2.) * 0.12;
        } else {
          float sp = vnoise(vW.xy * 3.1 + vW.z * 2.7);
          alb *= 0.7 + 0.28 * n1 + 0.22 * sp + 0.1 * n3;
          if (abs(n.y) < 0.5) { float row = floor(vW.y / 3.); float dy = (0.5 - abs(fract(vW.y / 3.) - 0.5)) * 3.;
            float xx = wl.x / 4.6 + 0.5 * mod(row, 2.); float dx = (0.5 - abs(fract(xx) - 0.5)) * 4.6;
            float jt = 1. - smoothstep(0.03, 0.1 + aaW, min(dx, dy)); alb *= (1. - 0.5 * jt / (1. + aaW * 3.)) * (0.86 + 0.28 * hash21(vec2(floor(xx), row))); }
        }
        float open = openAt(vW), up = n.y * 0.5 + 0.5;
        vec3 light = uSky * uAmb * roomAmb(open) * (0.25 + 0.75 * up) * mix(1.1, 1.25, open) + uGround * (0.2 + 0.55 * (1. - up));
        light += uWarm * vAux.x * flick(vL);
        light += uPathCol * roadLight(vW, n) * uPathGain * (0.92 + 0.08 * flick(vL * 0.3));
        float bz = blazeLight(vW, n);
        // the best room's side walls take a warm wash from the altar, strongest low and near the blaze
        if (vW.z < -262. && abs(n.x) > 0.6) bz += (0.2 + 0.8 * smoothstep(-268., -350., vW.z)) * exp(-max(vW.y - 7., 0.) / 27.) * 0.72;
        light += uBlazeCol * bz * (0.9 + 0.1 * flick(vec3(3., 2., 1.)));
        // the kitchen's cross beams and the ceiling between them take the stove's glow from below by the altar blaze's own law, in the blaze's
        // own colour and hour strength, at 0.9: the beam right over the stove never takes more light than the best room's brightest beam takes
        // by the altar, in any of the four hours, at any flicker. No blue is added: the hour's blue reaches this timber only by the ambient
        // line above. The walls take none of it and stay dark at the beams. (The baked candle glow ends 20 m from a flame, so this timber drew black.)
        if (vW.y > 29.5 && vW.z < -191.9 && vW.z > -258.1 && ((id > 3.5 && id < 4.5) || (id < 0.5 && n.y < -0.5))) light += uBlazeCol * stoveLight(vW, n) * 0.9 * (0.9 + 0.1 * flick(vec3(17., 4., -226.)));
        light += uKeyCol * max(dot(n, uKeyDir), 0.) * (keyShade(vW) * open + winLight(vW) * uWinK);
        light += uBackCol * backLight(vW, n);
        vec3 col = alb * light + vCol * vAux.y;
        if (wetK > 0.5 && n.y > 0.8) {
          float pud = open > 0.5 ? smoothstep(0.42, 0.62, vnoise(fl * 0.055) + 0.3 * vnoise(fl * 0.19)) : uWetIn;
          float gl = uWet * gloss * (0.3 + 0.7 * pud) * (1. - grout * 0.6);
          vec3 R = reflect(-V, normalize(n + vec3(n2 - 0.5, 0., n3 - 0.5) * 0.05 * (1. - pud * 0.8)));
          float fr = 1. - max(V.y, 0.); fr = 0.06 + 0.94 * fr * fr * fr * fr;
          vec3 skyR = mix(uReflHor, uReflZen, clamp(R.y, 0., 1.)) * open;
          vec3 Lb = normalize(vec3(0., 16., -372.) - vW); float sb = max(dot(R, Lb), 0.); sb *= sb; sb *= sb; sb *= sb; sb *= sb;
          float axis = 1. - smoothstep(3., 13., abs(vW.x - pathX(vW.z) * 0.3));
          col = col * (1. - 0.6 * gl) + gl * (fr * skyR * 1.3 + uBlazeCol * sb * axis * 2.2 * (0.4 + 0.6 * fr));
          // the altar mirrored in the wet tiles of the best room: rows of flame, the petal aisle, the lit arch
          if (vW.z < -262. && R.z < -0.05) {
            float tt = (-368. - vW.z) / R.z; vec2 hp = vec2(vW.x + R.x * tt, R.y * tt) + (vec2(n2, n3) - 0.5) * (0.6 + tt * 0.035);
            float hw = 22. - hp.y / 3., ax = abs(hp.x);
            float rows = (0.35 + 0.65 * smoothstep(0.25, 0.0, abs(fract(hp.y / 3.) - 0.72))) * (0.75 + 0.25 * sin(hp.x * 5.2));
            float tiers = step(ax, hw) * step(7.4, ax) * step(0.4, hp.y) * step(hp.y, 21.5) * rows;
            float aisle = step(ax, 7.) * step(0., hp.y) * step(hp.y, 21.5) * 0.55;
            float bow = step(21.5, hp.y) * (1. - smoothstep(9.5, 10.8, length(vec2(hp.x, max(hp.y - 31., 0.))))) * step(ax, 10.6) * 0.8;
            col += gl * (0.25 + 0.75 * fr) * (uWarm * tiers * 1.25 + uPathCol * aisle * uPathGain + uWarm * bow) * (1. - smoothstep(60., 130., tt));
          }
        } else if (gloss > 0.01) {
          vec3 R = reflect(-V, n); float fr = 1. - max(dot(n, V), 0.); fr = fr * fr * fr;
          vec3 Lb = normalize(vec3(pathX(vW.z), 2., vW.z - 14.) - vW); float sb = max(dot(R, Lb), 0.); sb *= sb; sb *= sb; sb *= sb;
          col += gloss * (uPathCol * sb * 0.5 * uPathGain + uSky * fr * 0.5 * open + uWarm * fr * vAux.x * 0.6);
        }
        gl_FragColor = vec4(clamp(col, 0., 40.), 1.);
        #include <fog_fragment>
      }`})}function $t(d,a){return x.shader(d,{uniforms:a,side:p.DoubleSide,vertexShader:x.FOG_V+`
      attribute vec3 aCol; attribute vec4 aAux; uniform float uTime, uWind;
      varying vec3 vCol, vN, vL, vW; varying vec4 vAux;
      void main(){ vCol = aCol; vAux = aAux; vec3 P = position; float k = aAux.w;
        if (k > 1.) { float ph = k * 37.; float jb = max(sin(uTime * 9. + ph) * sin(uTime * 2.1 + ph * 1.7), 0.); P.y += jb * (0.42 + 0.16 * sin(P.z * 1.3 + ph)); P.x += sin(uTime * 13. + ph) * 0.04; }
        else if (k > 0.) { float ph = P.x * 0.21 + P.z * 0.17 + P.y * 0.05;
          P.xz += vec2(sin(uTime * (1.1 + uWind * 2.) + ph), cos(uTime * 0.83 + ph * 1.3)) * k * (0.8 + 2.4 * uWind); }
        vL = P; vN = normalize(mat3(modelMatrix) * normal + vec3(0., 1e-5, 0.));
        ${x.V_WORLD} }`,fragmentShader:x.FOG_F+x.GLSL_COMMON+Ze+`
      uniform vec3 uKeyDir, uKeyCol, uPathCol, uBlazeCol; uniform float uPathGain, uWinK;
      varying vec3 vCol, vN, vL, vW; varying vec4 vAux;
      void main(){
        vec3 n = normalize(vN + vec3(0., 1e-4, 0.)); if (!gl_FrontFacing) n = -n;
        vec3 V = normalize(cameraPosition - vW + vec3(0., 1e-4, 0.));
        float nz = vnoise(vL.xz * 1.9 + vL.y * 1.3), nz2 = vnoise(vL.xy * 7. + vL.z * 5.);
        vec3 alb = vCol * (0.8 + 0.26 * nz + 0.14 * nz2);
        // the tree's crown (sway id 0.31): small glossy leaves. A leaf-scale pattern tilts the normal and breaks the colour,
        // the outline goes ragged, and the hard key light only silvers the edge instead of flooding the mass
        float leaf = step(abs(vAux.w - 0.31), 0.006), keyK = 1., frl = 1. - abs(dot(n, V));
        if (leaf > 0.5) {
          vec3 lp = vL * 1.5;
          float l1 = vnoise(lp.xz + lp.y * vec2(0.7, -0.6)), l2 = vnoise(lp.xy * 2.3 + lp.z * vec2(1.1, 0.8) + 7.), l3 = vnoise(lp.zy * 4.7 + lp.x * 2.1);
          if (frl > 0.66 && l3 * 0.7 + l1 * 0.5 < (frl - 0.66) * 3.6) discard;
          n = normalize(n + (vec3(l1, l2, l3) - 0.5) * 1.2);
          alb = vCol * (0.4 + 1.1 * l2 * (0.45 + l3));
          keyK = 0.22;
        }
        float creature = step(1.5, vAux.z); float open = openAt(vW), up = n.y * 0.5 + 0.5, gloss = mix(min(vAux.z, 1.), 0.12, creature);
        vec3 light = uSky * uAmb * roomAmb(open) * (0.25 + 0.75 * up) * mix(1.1, 1.25, open) + uGround * (0.2 + 0.55 * (1. - up));
        light += uWarm * vAux.x * flick(vL) + uPathCol * roadLight(vW, n) * uPathGain + uBlazeCol * blazeLight(vW, n);
        light += uKeyCol * keyK * max(dot(n, uKeyDir), 0.) * (keyShade(vW) * open + winLight(vW) * uWinK) + uBackCol * backLight(vW, n);
        vec3 col = alb * light + leaf * uKeyCol * vCol * 0.5 * frl * frl * clamp(dot(n, uKeyDir) + 0.25, 0., 1.);
        vec3 R = reflect(-V, n); float fr = 1. - max(dot(n, V), 0.);
        vec3 Lp = normalize(vec3(pathX(vW.z), 1., vW.z - 6.) - vW); float sp = max(dot(R, Lp), 0.); sp *= sp; sp *= sp; sp *= sp;
        col += gloss * (uPathCol * sp * 0.9 * uPathGain * mix(vec3(1.), vCol * 1.8, 0.6) + uSky * fr * fr * fr * 0.6 * mix(0.4, 1.3, open) + uWarm * vCol * fr * fr * (0.2 + vAux.x));
        if (creature > 0.5) {
          // the dog and the cat: matte slate, no highlights; only a thin gold rim from the candles behind them
          col = vCol * (0.9 + 0.2 * nz) * (uSky * uAmb * (0.4 + 0.8 * up) * mix(0.9, 1.6, open) + uWarm * vAux.x * 0.07 + uKeyCol * max(dot(n, uKeyDir), 0.) * keyShade(vW) * open * 0.45);
          float rim = smoothstep(0.5, 0.95, fr); rim *= rim;
          col += uWarm * (vAux.z - 1.5) * rim * (0.3 + 0.7 * clamp(dot(n, vec3(-0.82, 0.29, -0.5)) * 0.6 + 0.55, 0., 1.)) * 1.25;
        }
        col += vCol * vAux.y * (0.8 + 0.2 * flick(vL * 3.));
        gl_FragColor = vec4(clamp(col, 0., 40.), 1.);
        #include <fog_fragment>
      }`})}function bt(d,a=!1,q=1){return new p.ShaderMaterial({uniforms:{...d,uPane:{value:a?1:0},uPaneK:{value:q}},depthWrite:a,depthTest:!0,side:p.DoubleSide,fog:!1,vertexShader:`varying vec3 vDir; varying vec2 vH; uniform float uPane;
      void main(){ vec4 w = modelMatrix * vec4(position, 1.); vec4 p = projectionMatrix * viewMatrix * w; vH = vec2((w.y - 9.) / 21., (w.z + 322.) / 3.2);
        if (uPane > 0.5) { vDir = w.xyz - cameraPosition; gl_Position = p; }
        else { vDir = position; if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; } }`,fragmentShader:`
      uniform vec3 uZen, uHor, uEast, uGlowC, uMoonDir; uniform float uGlowK, uStars, uMoon, uFull, uTime, uRockets, uBurst, uSide, uPane, uPaneK;
      varying vec3 vDir; varying vec2 vH;
      float hash21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
      vec3 burst(vec3 d, vec3 c, float age, float size, vec3 tint, float seed){
        vec3 rt = normalize(cross(vec3(0., 1., 0.), c) + vec3(1e-4, 0., 0.)); vec3 upv = cross(c, rt);
        vec2 q = vec2(dot(d, rt), dot(d, upv)) / size; q.y += age * age * 0.28;
        float r = length(q); float a = r > 1e-3 ? atan(q.y, q.x) : 0.;
        float R = 1. - (1. - age) * (1. - age) * (1. - age);
        float ray = 0.5 + 0.5 * cos(a * 16. + seed * 6.); ray *= ray; ray *= ray;
        float ring = exp(-(r - R) * (r - R) * 60.) * (0.35 + 0.9 * ray);
        float trail = exp(-max(R - r, 0.) * 5.) * step(r, R) * ray * 0.5;
        float core = exp(-r * r * 9.) * (1. - age) * (1. - age);
        float fade = (1. - age) * (1. - age) * smoothstep(0., 0.08, age);
        float tw = 0.75 + 0.25 * sin(uTime * 17. + a * 9.);
        return tint * ((ring + trail) * tw * fade * 1.6 + core * 0.8 + exp(-r * r * 1.4) * fade * 0.12) * step(0., dot(d, c));
      }
      void main(){
        vec3 d = normalize(vDir + vec3(0., 1e-5, 0.)); float y = max(d.y, 0.);
        vec3 col = mix(uHor, uZen, pow(y, 0.5));
        float east = clamp(d.x * uSide * 0.5 + 0.5, 0., 1.); col = mix(col, uEast, east * east * 0.8 * (0.35 + 0.65 * y));
        float west = clamp(-d.x * uSide, 0., 1.), low = (1. - y); low *= low; low *= low;
        col += uGlowC * uGlowK * low * low * (0.2 + 0.8 * west * west) * 0.9;
        vec2 sp = d.xz / (0.4 + y) * 22.; vec2 sc = floor(sp), sf = fract(sp) - 0.5; float sh = hash21(sc);
        vec2 so = (vec2(hash21(sc + 3.7), hash21(sc + 9.1)) - 0.5) * 0.6; float sd = length(sf - so);
        col += vec3(0.8, 0.86, 1.) * step(0.9, sh) * (1. - smoothstep(0.03, 0.11, sd)) * uStars * (0.7 + 0.5 * sin(uTime * (1.5 + sh * 3.) + sh * 50.)) * smoothstep(0.08, 0.3, y) * 1.6;
        float md = 1. - dot(d, uMoonDir), mr = mix(0.00035, 0.0011, uFull);
        float disc = 1. - smoothstep(mr * 0.8, mr, md);
        float md2 = 1. - dot(d, normalize(uMoonDir + vec3(0.016, 0.01, 0.)));
        float cres = disc * smoothstep(mr * 0.55, mr * 0.8, md2);
        col += vec3(0.86, 0.9, 1.) * uMoon * (mix(cres, disc, uFull) * 2.2 + exp(-md * 260.) * 0.35 * uFull + exp(-md * 28.) * 0.1 * (0.3 + uFull));
        if (uRockets > 0.01) {
          for (int i = 0; i < 4; i++) {
            float fi = float(i), per = 6.3 + fi * 1.7, tt = uTime / per + fi * 0.31, id = floor(tt), t = fract(tt);
            float az = (hash21(vec2(id, fi)) - 0.5) * 2.6 + 3.14159, el = 0.42 + 0.3 * hash21(vec2(id + 7., fi));
            vec3 c = normalize(vec3(sin(az) * cos(el), sin(el), cos(az) * cos(el)));
            vec3 tint = hash21(vec2(id, fi + 3.)) < 0.6 ? vec3(1., 0.72, 0.3) : vec3(0.95, 0.93, 1.);
            float age = clamp((t - 0.12) / 0.6, 0., 1.);
            col += burst(d, c, age, 0.045 + 0.025 * hash21(vec2(id, fi + 5.)), tint, id) * uRockets * 0.8 * step(0.12, t) * step(t, 0.72);
            vec3 cr = normalize(c - vec3(0., 0.22 * (1. - t / 0.12), 0.)); float dr = 1. - dot(d, cr);
            col += tint * exp(-dr * 60000.) * step(t, 0.12) * uRockets;
          }
          vec3 c2 = normalize(vec3(-0.515, 0.326, -0.793));
          col += burst(d, c2, clamp(uBurst, 0., 1.), 0.085, vec3(1., 0.66, 0.24), 3.) * uRockets * step(0.001, uBurst) * step(uBurst, 0.999) * 0.75;
          col += vec3(1., 0.7, 0.4) * exp(-(1. - dot(d, c2)) * 9.) * 0.1 * uRockets * (1. - uBurst) * step(0.001, uBurst) * smoothstep(0., 0.2, uBurst);
        }
        // a window pane: the sky graded up its height (glow low, zenith high) so it never reads as one flat slab
        if (uPane > 0.5) { float g = clamp(vH.x, 0., 1.); col = mix(col, mix(uHor + uGlowC * uGlowK * 0.3, uZen, g * g * (3. - 2. * g)), 0.7) * uPaneK;
          // dark glazing bars: a mullion, a transom and small panes, so the opening reads as a window at any hour
          float bar = max(step(abs(vH.y), 0.05), step(0.44, abs(fract(vH.x * 6.) - 0.5)));
          bar = max(bar, step(0.43, abs(fract(vH.y * 1.5 + 0.5) - 0.5)));
          col = mix(col, vec3(0.035, 0.022, 0.02), bar); }
        gl_FragColor = vec4(col, 1.);
      }`})}function xt(d,a,q){return x.shader(d,{uniforms:a,transparent:q,depthWrite:!q,side:p.DoubleSide,vertexShader:x.FOG_V+`
      varying vec2 vUv; varying vec3 vN, vL, vW;
      void main(){ vUv = uv; vL = position; vec3 P = position; vN = normalize(mat3(modelMatrix) * normal + vec3(0., 1e-5, 0.));
        ${x.V_WORLD} }`,fragmentShader:x.FOG_F+x.GLSL_COMMON+`
      uniform vec3 uReflZen, uReflHor, uPathCol; varying vec2 vUv; varying vec3 vN, vL, vW;
      void main(){
        vec3 V = normalize(cameraPosition - vW + vec3(0., 1e-4, 0.));
        ${q?`
        float s = vnoise(vec2(vUv.x * 46., vUv.y * 2.2 - uTime * 2.6)) * 0.6 + vnoise(vec2(vUv.x * 120., vUv.y * 5. - uTime * 4.1)) * 0.4;
        float gap = smoothstep(0.1, 0.55, abs(sin(vUv.x * 37.699)));
        float a = (0.03 + 0.45 * smoothstep(0.45, 0.85, s)) * gap * smoothstep(0., 0.06, vUv.y) * (1. - 0.4 * vUv.y);
        float fr = 1. - abs(dot(normalize(vN), V));
        vec3 col = uReflZen * (0.3 + 0.6 * s) + uReflHor * fr * 0.4 + uWarm * (0.12 + 0.5 * smoothstep(0.7, 0.95, s)) * flick(vL);
        gl_FragColor = vec4(clamp(col, 0., 20.), clamp(a, 0., 1.));`:`
        vec2 p = vL.xz; float r = length(p);
        float h1 = sin(r * 2.1 - uTime * 2.4) * 0.5 + sin((r - 4.2) * 3.3 + uTime * 1.9) * 0.3 * step(r, 5.5);
        float h2 = vnoise(p * 1.3 + uTime * 0.4) - 0.5;
        vec3 n = normalize(vec3((h1 * p.x / max(r, 0.2)) * 0.16 + h2 * 0.2, 1., (h1 * p.y / max(r, 0.2)) * 0.16 + (vnoise(p * 1.3 - uTime * 0.35 + 9.) - 0.5) * 0.2));
        vec3 R = reflect(-V, n); float fr = 1. - max(dot(n, V), 0.); fr = 0.08 + 0.92 * fr * fr * fr;
        vec3 col = vec3(0.012, 0.03, 0.07) + mix(uReflHor, uReflZen, clamp(R.y, 0., 1.)) * fr * 0.85;
        float gl = vnoise(p * 2.6 + R.xz * 5. + uTime * 0.7); gl = smoothstep(0.62, 0.9, gl);
        col += uWarm * gl * 0.55 * flick(vL) + uPathCol * 0.06;
        gl_FragColor = vec4(clamp(col, 0., 20.), 1.);`}
        #include <fog_fragment>
      }`})}function Jt(d,a){return x.shader(d,{uniforms:a,transparent:!0,depthWrite:!1,blending:p.AdditiveBlending,vertexShader:x.FOG_V+`
      attribute vec4 iPos; varying vec2 vQ; varying float vPh, vK;
      void main(){
        vec3 b = iPos.xyz; vec2 toC = cameraPosition.xz - b.xz; float dist = length(toC); toC /= max(dist, 1e-3);
        vec2 rt = vec2(-toC.y, toC.x);
        float h = max(cameraPosition.y - b.y, 0.5), len = clamp(dist * 0.4, 2.5, 26.) * (0.7 + 0.5 * iPos.w), w = (0.45 + dist * 0.006) * (0.8 + 0.4 * iPos.w);
        vec3 wp = b + vec3(rt.x, 0., rt.y) * position.x * w + vec3(toC.x, 0., toC.y) * (position.y * len + 0.2);
        vQ = position.xy; vPh = iPos.w * 31.; vK = clamp(dist / (h * 5.), 0., 1.);
        vec4 mvPosition = viewMatrix * vec4(wp, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:x.FOG_F+x.GLSL_COMMON+`
      uniform float uWet; varying vec2 vQ; varying float vPh, vK;
      void main(){
        float x = abs(vQ.x), y = vQ.y;
        float rip = 0.6 + 0.4 * sin(y * 34. + vPh + sin(uTime * 1.7 + vPh) * 1.5) * sin(y * 13. - uTime * 0.9 + vPh * 2.);
        float a = (1. - smoothstep(0.2, 1., x * (0.6 + rip * 0.6))) * exp(-y * (3.6 - 2.2 * uWet)) * smoothstep(0., 0.04, y) * rip;
        vec3 col = uWarm * a * uWet * (0.25 + 0.75 * vK) * 1.15 * (0.85 + 0.15 * sin(uTime * 3.1 + vPh));
        ${x.FOG_ADD}
        gl_FragColor = vec4(col, 1.);
      }`})}function ea(d,a){return x.shader(d,{uniforms:a,transparent:!0,depthWrite:!1,side:p.DoubleSide,vertexShader:x.FOG_V+`
      attribute vec3 aBase; attribute vec4 aDim; attribute float aPh; uniform float uTime, uWind; uniform vec3 uWindDir;
      varying vec2 vUv; varying float vPh; varying vec4 vDim;
      void main(){
        float h = uv.y, ph = aPh, H = aDim.x;
        vec3 c = aBase + vec3(sin(uTime * 0.5 + ph * 9. + h * 3.) * 0.09 * H * h + sin(uTime * 0.23 + h * 7. + ph) * 0.06 * H * h * h, h * H,
          cos(uTime * 0.4 + ph * 5. + h * 2.6) * 0.07 * H * h) + uWindDir * uWind * h * h * H * 0.55;
        float pot = step(0.55, aDim.w); c.x -= pot * h * h * H * (0.42 + 0.1 * sin(uTime * 0.31 + ph * 20.)); c.y -= pot * h * h * H * 0.3;
        vec3 cw = (modelMatrix * vec4(c, 1.)).xyz;
        vec3 right = normalize(cross(vec3(0., 1., 0.), cameraPosition - cw) + vec3(1e-4, 0., 0.));
        vec3 wp = cw + right * uv.x * aDim.y * (0.25 + 1.3 * h);
        vUv = uv; vPh = ph; vDim = aDim;
        vec4 mvPosition = viewMatrix * vec4(wp, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:x.FOG_F+x.GLSL_COMMON+`
      uniform vec3 uViolet; varying vec2 vUv; varying float vPh; varying vec4 vDim;
      void main(){
        float h = vUv.y;
        vec2 q = vec2(vUv.x * 1.1 + vPh * 13., h * 3.6 - uTime * vDim.z + vPh * 7.);
        float n = vnoise(q) * 0.6 + vnoise(q * 2.3 + 3.1) * 0.4;
        float wisp = smoothstep(0.2, 0.8, n + 0.25 * sin(h * 9. - uTime * 0.6 + vUv.x * 3.));
        float a = (1. - smoothstep(0.1, 1., abs(vUv.x))) * smoothstep(0., 0.07, h) * pow(max(1. - h, 0.), 1.2) * (0.3 + 0.7 * wisp) * 0.6;
        float pot = step(0.55, vDim.w); a = min(a * (1. + 0.75 * pot), 0.9);
        vec3 col = mix(uWarm * (0.35 + 0.9 * vDim.w), uViolet * 0.6 + uSky * 0.5 + uWarm * (0.1 * vDim.w + 0.4 * pot), smoothstep(0., 0.6, h));
        gl_FragColor = vec4(col, a);
        #include <fog_fragment>
      }`})}function ta(d,a){return x.shader(d,{uniforms:a,transparent:!0,depthWrite:!1,side:p.DoubleSide,blending:p.AdditiveBlending,vertexShader:x.FOG_V+`
      attribute vec3 aK; varying vec2 vUv; varying vec3 vK, vW;
      void main(){ vUv = uv; vK = aK; vec3 P = position; ${x.V_WORLD} }`,fragmentShader:x.FOG_F+x.GLSL_COMMON+`
      uniform vec3 uViolet; varying vec2 vUv; varying vec3 vK, vW;
      void main(){
        vec2 p = vUv * 2. - 1.; float edge = (1. - smoothstep(0.55, 1., abs(p.x))) * (1. - smoothstep(0.5, 1., abs(p.y)));
        vec2 q = vW.xz * 0.035 + vW.y * 0.05 + vK.z * 17.;
        float n = vnoise(q + vec2(uTime * 0.03, uTime * 0.017)) * 0.6 + vnoise(q * 2.7 - uTime * 0.04) * 0.4;
        float near = smoothstep(vK.x * 0.25, vK.x, distance(cameraPosition, vW));
        float a = edge * smoothstep(0.25, 0.85, n) * near * vK.y;
        vec3 col = (uViolet * 0.55 + uWarm * 0.3 * flick(vW * 0.2)) * a;
        ${x.FOG_ADD}
        gl_FragColor = vec4(col, 1.);
      }`})}function aa(d){return x.shader(d,{transparent:!0,depthWrite:!1,side:p.DoubleSide,blending:p.AdditiveBlending,vertexShader:x.FOG_V+`
      attribute float aW; varying vec2 vUv; varying vec3 vW; varying float vWt;
      void main(){ vUv = uv; vWt = aW; vec3 P = position; ${x.V_WORLD} }`,fragmentShader:x.FOG_F+x.GLSL_COMMON+`
      uniform vec3 uWinCol; varying vec2 vUv; varying vec3 vW; varying float vWt;
      void main(){
        float ac = clamp(vUv.x, 0., 1.), al = clamp(vUv.y, 0., 1.);
        float across = sin(3.14159 * ac); across *= across;
        float along = smoothstep(0., 0.14, al) * (1. - smoothstep(0.62, 1., al)) * (1. - 0.4 * al);
        vec2 q = vW.xy * 0.15 + vec2(vW.z * 0.13, vWt * 3.);
        float dust = vnoise(q + vec2(uTime * 0.035, -uTime * 0.05)) * 0.6 + vnoise(q * 3.1 - vec2(uTime * 0.06, uTime * 0.02)) * 0.4;
        float fingers = 0.84 + 0.16 * sin(ac * 13. + 2.5 * vnoise(vec2(al * 2.5, vWt * 9.)));
        float near = smoothstep(2.5, 17., distance(cameraPosition, vW));
        vec3 col = uWinCol * across * along * (0.4 + 0.8 * dust) * fingers * near * vWt * 0.062;
        ${x.FOG_ADD}
        gl_FragColor = vec4(col, 1.);
      }`})}function oa(d){return x.shader(d,{side:p.DoubleSide,vertexShader:x.FOG_V+`
      attribute vec4 iA, iB; attribute vec3 iC; uniform float uTime; varying vec3 vCol; varying float vMode, vSh;
      vec3 orbit(float a, float ph, float mode){
        if (mode < 0.5) return iA.xyz + vec3(cos(a), 0.45 * sin(a * 1.7 + ph * 6.), sin(a)) * iA.w * (0.75 + 0.25 * sin(a * 0.37 + ph * 3.));
        return iA.xyz + vec3(sin(a) * iA.w, 5. * sin(a * 2.3 + ph * 5.), sin(a * 0.63 + ph * 4.) * iA.w * 1.1); }
      void main(){
        float ph = iB.y, mode = iB.w, a = uTime * iB.x + ph * 6.2832;
        vec3 c = orbit(a, ph, mode), fwd = normalize(orbit(a + 0.06, ph, mode) - c + vec3(1e-4, 0., 1e-5));
        vec3 rt = normalize(cross(fwd, vec3(0., 1., 0.)) + vec3(1e-4, 0., 0.)), upv = cross(rt, fwd);
        float fl = sin(uTime * (mode < 0.5 ? 19. : 9.) + ph * 40.) * (mode < 0.5 ? 1.0 : 0.75);
        vec3 l = position * iB.z;
        vec3 P = c + rt * l.x * cos(fl) + upv * (abs(l.x) * sin(fl) + l.y) + fwd * l.z;
        vCol = iC; vMode = mode; vSh = 0.7 + 0.3 * abs(position.x);
        vec4 mvPosition = modelViewMatrix * vec4(P, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:x.FOG_F+`
      uniform vec3 uSky, uWarm; uniform float uAmb; varying vec3 vCol; varying float vMode, vSh;
      void main(){
        vec3 col = vMode < 0.5 ? vCol * vSh * (uWarm * 1.05 + uSky * 0.35) : vCol * uSky * uAmb * 0.35;
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`})}function na(d,a){return x.shader(d,{uniforms:a,side:p.DoubleSide,vertexShader:x.FOG_V+Ze+`
      attribute vec4 iA, iB; uniform float uTime, uCamZ, uGustK; varying vec3 vCol; varying vec2 vQ; varying float vShade;
      void main(){
        float ph = iA.w, sp = fract(iA.x + uTime * (0.08 + 0.05 * fract(ph * 7.3)));
        float z = uCamZ + 30. - sp * 200., side = sign(iA.y);
        float climb = max(-320.9 - z, 0.) * 0.3443;
        float squeeze = mix(0.3, 1., smoothstep(-386., -305., z));
        // two streams, one either side of the path, weaving a little and closing on the arch
        float weave = sin(z * 0.055 + uTime * 0.8 + side * 1.3) * 1.3, wob = sin(z * 0.13 + ph * 30. + uTime * 0.9), wob2 = cos(z * 0.09 + ph * 17. - uTime * 0.6);
        vec3 c = vec3(camX(z) + (iA.y + weave + wob * 0.5) * squeeze, camY(z) - 0.4 + climb + 2.6 * (1. - smoothstep(-322., -274., z)) + (iA.z + wob2 * 0.5 + 0.8 * sin(z * 0.04 + side * 2.)) * mix(0.55, 1., squeeze), z);
        float lift = smoothstep(0., 1., uGustK * 1.6 - fract(ph * 3.1) * 0.6);
        c.y = mix(0.3, c.y, lift);
        float size = iB.w * lift * step(-386.5, z) * smoothstep(0., 0.04, sp) * (1. - smoothstep(0.94, 1., sp));
        vec3 l = position * size; l.y += (position.x * position.x * 1.1 + position.z * position.z * 0.18) * size;      // cupped and curled
        float tilt = uTime * (2. + 3. * fract(ph * 5.1)) + ph * 40., yaw = uTime * 1.7 + ph * 20.;
        float cs = cos(tilt), sn = sin(tilt); l = vec3(l.x, l.y * cs - l.z * sn, l.y * sn + l.z * cs);
        cs = cos(yaw); sn = sin(yaw); l = vec3(l.x * cs + l.z * sn, l.y, -l.x * sn + l.z * cs);
        vCol = iB.rgb; vQ = position.xz; vShade = 0.8 + 0.25 * sn;
        vec4 mvPosition = viewMatrix * vec4(c + l, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:x.FOG_F+`
      uniform vec3 uSky; uniform float uPetal; varying vec3 vCol; varying vec2 vQ; varying float vShade;
      void main(){
        float z = vQ.y, x = vQ.x;
        float w = 0.58 * sqrt(max(1. - z * z, 0.)) * (0.72 + 0.28 * z);      // a petal: narrow claw, broad ruffled lip
        w *= 1. - 0.12 * step(0.3, z) * abs(sin(x * 14.));
        if (abs(x) > w) discard;
        vec3 col = mix(vCol * vec3(0.72, 0.42, 0.3), vCol * vec3(1.12, 1.02, 0.78), smoothstep(-0.8, 0.75, z));
        col *= (1. - 0.3 * exp(-x * x * 40.)) * vShade * (uPetal * 1.25 + 0.3);
        gl_FragColor = vec4(col + uSky * 0.05, 1.);
        #include <fog_fragment>
      }`})}function sa(d){return x.shader(d,{transparent:!0,depthWrite:!1,blending:p.AdditiveBlending,vertexShader:x.FOG_V+`
      attribute vec4 iA, iB; attribute vec3 iC; uniform float uTime, uWind; varying vec2 vQ; varying vec3 vCol; varying float vKind, vPh;
      void main(){
        float ph = iB.y, kind = iB.w, t = fract(uTime * iB.x + ph), size = iB.z; vec3 c = iA.xyz; vec2 st = vec2(1.);
        if (kind < 0.5) { c += vec3(sin(t * 9. + ph * 20.) * 0.12, 1., cos(t * 7. + ph * 31.) * 0.1) * t * iA.w; size *= (1. - t) * smoothstep(0., 0.05, t); }
        else if (kind < 1.5) { c.y -= t * t * iA.w; st = vec2(0.5, 2. + 7. * t); size *= step(t, 0.97); }
        else if (kind < 2.5) { c.xz += vec2(sin(uTime * 1.1 + ph * 9.), cos(uTime * 0.9 + ph * 7.)) * iA.w * (0.25 + uWind); size *= 0.86 + 0.14 * sin(uTime * 5.3 + ph * 30.) * sin(uTime * 2.1 + ph * 11.); }
        else { c += vec3(sin(uTime * 0.21 + ph * 9.), sin(uTime * 0.16 + ph * 5.) * 0.4, cos(uTime * 0.18 + ph * 13.)) * iA.w; size *= 0.6 + 0.4 * sin(uTime * 1.3 + ph * 40.); }
        vec3 rt = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), upv = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
        if (kind > 0.5 && kind < 1.5) upv = vec3(0., 1., 0.);
        vec3 P = c + (rt * position.x * st.x + upv * position.y * st.y) * size;
        vQ = position.xy; vCol = iC; vKind = kind; vPh = ph;
        vec4 mvPosition = viewMatrix * vec4(P, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:x.FOG_F+`
      varying vec2 vQ; varying vec3 vCol; varying float vKind, vPh;
      void main(){
        float r2 = dot(vQ, vQ); float a = exp(-r2 * 5.) * (1. - smoothstep(0.7, 1., r2));
        if (vKind > 1.5 && vKind < 2.5) { float cr = exp(-abs(vQ.x) * 14.) * exp(-abs(vQ.y) * 2.6) + exp(-abs(vQ.y) * 14.) * exp(-abs(vQ.x) * 2.6); a = a * 0.55 + exp(-r2 * 40.) * 1.2 + cr * 0.35; }
        vec3 col = vCol * a;
        ${x.FOG_ADD}
        gl_FragColor = vec4(col, 1.);
      }`})}const b=(d,a,q)=>new p.Vector3(d,a,q);function Ke(d,a,q,v0=5){const d0=a.length(),T0=q.length(),i0=Math.max(1,Math.ceil(d0/v0)),U=Math.max(1,Math.ceil(T0/v0)),z=[],t0=[];for(let A=0;A<=U;A++)for(let v=0;v<=i0;v++)z.push(d.x+a.x*v/i0+q.x*A/U,d.y+a.y*v/i0+q.y*A/U,d.z+a.z*v/i0+q.z*A/U);for(let A=0;A<U;A++)for(let v=0;v<i0;v++){const K=A*(i0+1)+v,w=K+1,c0=K+i0+1,j=c0+1;t0.push(K,w,c0,w,j,c0)}const y=new p.BufferGeometry;return y.setAttribute("position",new p.Float32BufferAttribute(z,3)),y.setIndex(t0),y.computeVertexNormals(),y}function g0(d,a,q,v0=!1){const d0=[],T0=[];for(let U=0;U<=a;U++)for(let z=0;z<=d;z++){const t0=q(z/d,U/a);d0.push(t0[0],t0[1],t0[2])}for(let U=0;U<a;U++)for(let z=0;z<d;z++){const t0=U*(d+1)+z,y=t0+1,A=t0+d+1,v=A+1;v0?T0.push(t0,A,y,y,A,v):T0.push(t0,y,A,y,v,A)}const i0=new p.BufferGeometry;return i0.setAttribute("position",new p.Float32BufferAttribute(d0,3)),i0.setIndex(T0),i0.computeVertexNormals(),i0}const H=new p.Matrix4;var fa={id:"marigold-way-home",name:"The Marigold Way Home",category:"domestic",weirdness:.15,media:["interior"],async build(d){const a=d.rng.fork("marigold-house"),q=d.quality?.detail??1,v0=d.vary||{},d0=M0(v0.density??1,.7,1.3),T0=!!v0.rare,i0=Math.abs(Math.floor(Number(d.seed)||0)),U=v0.hour==="dawn"?"dawn":v0.hour==="night"?"moon":v0.hour==="golden"?"dusk":["moon","rain","dawn","dusk","moon","rain","dawn"][i0%7],z=Yt[U],t0={orangeTree:a.chance(.4),dogPair:a.chance(.35),catFar:a.chance(.5),flagScheme:a.int(0,2),swallows:U==="dusk"||U==="dawn"},y=x.hex,A=x.mixc,v=x.M,K=x.lathe,w={indigo:y(B0[0]),cobalt:y(B0[1]),orange:y(B0[2]),gold:y(B0[3]),violet:y(B0[4]),magenta:y(B0[5]),terra:y(B0[6])};w.deep=A(w.orange,w.terra,.6);const c0=()=>(a()<.28?A(w.gold,w.orange,a.range(0,.35)):A(w.orange,w.deep,a.range(0,.45))).multiplyScalar(a.range(.8,1.05)),j=new p.Scene,je=y(z.fog);j.fog=new p.FogExp2(je,z.fogD),j.background=je.clone().multiplyScalar(.5),await d.yield();const r0=await Xt(d,{palette:B0,road:102,roadWidth:10,wall:{width:$*2,height:Q0},burn:z.burn});r0.object.position.set(0,0,re),r0.object.updateMatrixWorld(!0),j.add(r0.object);const E=r0.uniforms,zt=y(z.sky).multiplyScalar(z.skyK),Ne=y(z.warm);r0.setLight({sky:zt,warm:Ne,ambient:z.amb,petal:z.petal,flame:1-.1*z.burn}),r0.setWind(.25,-1,z.wind);const Te=z.elev||.78,Mt=b(-.98*z.side,Te,-.2).normalize();Object.assign(E,{uDadoA:{value:A(w.cobalt,y("#5f86e8"),.2).multiplyScalar(.85)},uDadoB:{value:w.terra.clone().multiplyScalar(.75)},uTileBlue:{value:A(w.cobalt,w.indigo,.15)},uTileYel:{value:A(w.gold,w.orange,.45)},uTileWhite:{value:y("#d9d3c4")},uMoss:{value:y("#3d5a2c")},uKeyDir:{value:Mt},uKeyCol:{value:y(z.key).multiplyScalar(z.keyK)},uPathCol:{value:A(w.orange,w.gold,.15).multiplyScalar(1)},uPathGain:{value:.95*z.petal},uBlazeCol:{value:Ne.clone().multiplyScalar(z.blaze)},uReflZen:{value:y(z.zen).multiplyScalar(.9)},uReflHor:{value:A(y(z.hor),y(z.glow),.3).multiplyScalar(.8)},uKsh:{value:new p.Vector2(.98/Te,.2/Te)},uSide:{value:z.side},uWet:{value:z.wet},uWetIn:{value:z.wetIn},uWinK:{value:z.winK},uRoom:{value:b(z.room[0],z.room[1],z.room[2])},uBackCol:{value:y(z.back).multiplyScalar(z.backK)},uWinCol:{value:y(z.key).multiplyScalar(z.keyK*z.shaft)},uViolet:{value:w.violet.clone()},uCamZ:{value:0},uGustK:{value:0}});const kt=Qt(E),F0=$t(E);await d.yield();const Fe=[],Ue=[],Le=[],De=[],w0=[],we=[],ce=[],G0=[],L0=[],Ee=[y("#efe3c8"),y("#f3ead6"),y("#e8c98a"),A(w.orange,y("#ffffff"),.25),A(w.magenta,y("#ffffff"),.2)],Ye=[A(w.orange,w.gold,.4),w.magenta.clone(),A(w.cobalt,y("#6fa0ff"),.4),w.violet.clone(),w.orange.clone()];function f0(t,o,r,h,c=1,i=!0){let e,s,n,l;h===0?(e=a.range(.11,.15),s=Math.max(.45,a.range(1.3,2.5)*c*(1-1.15*z.burn)),n=Ee[a()<.75?a.int(0,1):a.int(2,4)],l=.32):h===1?(e=a.range(.26,.4),s=Math.max(.38,a.range(.6,1.3)*c*(1-.75*z.burn)),n=Ee[a.int(0,2)],l=.36):(e=a.range(.28,.34),s=a.range(.7,.85),n=Ye[a()<.5?0:a.int(0,4)],l=.27);const u={x:t,y:o,z:r,r:e,h:s,kind:h,col:n,fs:l*a.range(.9,1.15)*(1+.08*z.burn),fy:o+(h===2?s*.55:s+e*.5)};return Fe.push(u),i&&o<.5&&De.push([t,o+.2,r,a()]),u}const D0=(t,o,r,h,c,i,e,s,n=.6,l=1)=>Ue.push({x:t,y:o,z:r,nx:h,ny:c,nz:i,r:e,col:s,em:n,tall:l}),St=y("#1d3a24"),Pt=y("#5a0c2c");function _e(t,o,r,h,c,i,e=!1){if(t.add(new p.IcosahedronGeometry(1,1),v(o,r+.1*c,h,.86*c,.7*c,.86*c,a.range(0,l0)),(s,n,l,u)=>{u.copy(St).multiplyScalar(.7+.5*Math.abs(Math.sin(s*9+l*7+n*5)))},[0,.3,.12]),e){const s=Math.max(5,Math.round(i*.55));for(let n=0;n<s;n++){const l=a.range(0,l0),u=n===0?1.45:a.range(.45,1.3),f=c*a.range(.5,.8),m=c*a.range(.55,.8),g=c*a.range(.95,1.35),M=a.range(0,6),W=A(w.magenta,y("#ff5a8e"),a.range(0,.35)),C=Math.cos(l)*Math.cos(u),F=Math.sin(u),L=Math.sin(l)*Math.cos(u);t.add(g0(14,4,(T,D)=>{const I=T*2-1,o0=m*(.25+.75*Math.sqrt(D)),n0=D*D;return[I*o0,D*g*(1-.22*I*I)+.1*c*Math.sin(T*31+M)*n0,(.2*Math.sin(T*23+M)*n0+.1*Math.sin(T*7+M*2)*D)*c]}),v(o+C*f,r+F*f*.9,h+L*f,1,1,1,Math.PI/2-l+a.range(-.5,.5),(Math.PI/2-u)*.8),(T,D,I,o0)=>{o0.copy(Pt).lerp(W,M0(D/g,0,1)).multiplyScalar(.75+.35*Math.abs(Math.sin(T*17/c+M)))},[.22,.12,.1])}return}i=Math.round(i*2.2);for(let s=0;s<i;s++){const n=a.range(0,l0),l=s===0?1.5:a.range(.1,1.4),u=c*(.6+.45*Math.sqrt(a())),f=Math.cos(n)*Math.cos(l),m=Math.sin(l),g=Math.sin(n)*Math.cos(l);D0(o+f*u,r+m*u*.9,h+g*u,f,m+.35,g,.33*c*a.range(.8,1.2),c0(),.55,1)}}function Wt(t,o,r,h,c=.5){for(let i=0;i<=h;i++){const e=i/h,s=r*4*e*(1-e);D0(_(t[0],o[0],e)+a.range(-.1,.1),_(t[1],o[1],e)-s+a.range(-.08,.08),_(t[2],o[2],e)+a.range(-.1,.1),a.range(-.4,.4),a.range(-.2,.6),a.range(-.4,.4)+.5,c*a.range(.8,1.2),c0(),.6)}}let fe=null;function Gt(){const t=new Map,o=(r,h,c,i)=>{const e=Math.round(r/2.5)+","+Math.round(h/3)+","+Math.round(c/2.5);let s=t.get(e);s||t.set(e,s=[0,0,0,0]),s[0]+=r*i,s[1]+=h*i,s[2]+=c*i,s[3]+=i};for(const r of Fe)o(r.x,r.fy,r.z,1);for(const r of L0)o(r[0],r[1],r[2],r[3]);for(const r of r0.anchors.candleGroups)o(r.position.x,r.position.y,r.position.z+re,r.count);fe=new Map;for(const r of t.values()){const h=Math.floor(r[2]/r[3]/20);let c=fe.get(h);c||fe.set(h,c=[]),c.push(r[0]/r[3],r[1]/r[3],r[2]/r[3],r[3])}}const j0=(t,o,r,h,c,i)=>{fe||Gt();let e=0;const s=Math.floor(r/20);for(let n=s-1;n<=s+1;n++){const l=fe.get(n);if(l)for(let u=0;u<l.length;u+=4){const f=l[u]-t,m=l[u+1]-o,g=l[u+2]-r,M=f*f+m*m+g*g;if(M>400)continue;const W=(f*h+m*c+g*i)/Math.sqrt(M+.3)*.62+.38;if(W<=0)continue;const C=1+M*.16;e+=l[u+3]*W/(C*Math.sqrt(C))}}return Math.min(e*.34,1.25)},k={pas:x.makeBatch(),pat:x.makeBatch(),kit:x.makeBatch(),best:x.makeBatch()},_0={pas:x.makeBatch(),pat:x.makeBatch(),kit:x.makeBatch(),best:x.makeBatch()},J0=(t,o,r,h,c,i,e,s,n,l=5)=>t.add(Ke(b(o,c,e>0?Math.max(r,h):Math.min(r,h)),b(0,0,-e*Math.abs(h-r)),b(0,i-c,0),l),H,s,n),be=(t,o,r,h,c,i,e,s,n,l=5)=>t.add(Ke(b(e>0?Math.min(r,h):Math.max(r,h),c,o),b(e*Math.abs(h-r),0,0),b(0,i-c,0),l),H,s,n),W0=(t,o,r,h,c,i,e,s,n,l=5)=>t.add(Ke(b(Math.min(o,r),i,e>0?Math.min(h,c):Math.max(h,c)),b(0,0,e*Math.abs(c-h)),b(Math.abs(r-o),0,0),l),H,s,n),P=(t,o,r,h,c,i,e,s,n,l=0,u=1)=>t.add(new p.BoxGeometry(c,i,e,u,1,u),v(o,r,h,1,1,1,l),s,n),B={hw:8,spring:18},Ct=t=>B.spring+Math.sqrt(Math.max(B.hw*B.hw-t*t,0)),Y=y("#8c8478"),u0=y("#5a3a22"),b0=y("#35221a");function ee(t,o,r,h,c,i,e){be(t,o,-h,-B.hw,0,c,r,i,e),be(t,o,B.hw,h,0,c,r,i,e),t.add(g0(16,5,(n,l)=>{const u=(n*2-1)*B.hw;return[u,_(Ct(u),c,l),o]},r<0),H,i,e);const s=n=>{const l=n*(2*B.spring+Math.PI*B.hw);if(l<B.spring)return[-1,0,-B.hw,l];if(l>B.spring+Math.PI*B.hw)return[1,0,B.hw,2*B.spring+Math.PI*B.hw-l];const u=Math.PI-(l-B.spring)/B.hw;return[Math.cos(u),Math.sin(u),Math.cos(u)*B.hw,B.spring+Math.sin(u)*B.hw]};t.add(g0(48,2,(n,l)=>{const u=s(n),f=l*1.7;return[u[2]+u[0]*f,u[3]+u[1]*f,o+r*(.5-.2*Math.abs(l-.5))]},r<0),H,(n,l,u,f)=>{f.copy(Y).multiplyScalar(.8+.25*(Math.floor(Math.atan2(l-B.spring,n)*5+l*.33)%2?1:.6))},[0,.1,7])}function Ie(t,o,r){const h=c=>{const i=2*B.spring+Math.PI*B.hw,e=c*i;if(e<B.spring)return[-B.hw,e];if(e>i-B.spring)return[B.hw,i-e];const s=Math.PI-(e-B.spring)/B.hw;return[Math.cos(s)*B.hw,B.spring+Math.sin(s)*B.hw]};t.add(g0(2,40,(c,i)=>{const e=h(i);return[e[0],e[1],o+m0+.5-c*(2*m0+1)]}),H,Y.clone().multiplyScalar(.8),[0,.1,7]);for(const c of[-1,1]){const i=o+r*(m0+.45),e=c*13.2;P(t,e,9.6,i,8.2,19.2,.5,b0,[0,.15,4]);for(let s=0;s<3;s++)for(let n=0;n<2;n++)P(t,e+(n-.5)*3.7,3.8+s*6,i+r*.32,3,5,.3,u0.clone().multiplyScalar(.9+.2*((s+n)%2)),[0,.25,4]);for(let s=0;s<4;s++)for(const n of[-3.75,0,3.75])t.add(new p.SphereGeometry(.22,6,4),v(e+n,.8+s*6,i+r*.36),y("#2a2422"),[0,.8,0])}}const Re=(t,o,r,h,c,i)=>{P(t,o-r*.85,h-.16,c,1.7,.32,i,Y,[0,.15,7],0,3),t.add(new p.CylinderGeometry(.2,.2,i,8,3).rotateX(Math.PI/2),v(o-r*1.7,h-.2,c),Y.clone().multiplyScalar(1.1),[0,.15,7]),P(t,o-r*.7,h-.5,c,1.3,.3,i-.7,Y.clone().multiplyScalar(.75),[0,.1,7]);for(const e of[-i*.32,i*.32])t.add(new p.SphereGeometry(1,10,8),v(o-r*.55,h-1.15,c+e,.75,.75,.3),Y.clone().multiplyScalar(.85),[0,.15,7]),t.add(new p.SphereGeometry(1,8,6),v(o-r*.3,h-1.95,c+e,.42,.5,.26),Y.clone().multiplyScalar(.7),[0,.15,7])},Oe=(t,o,r,h,c,i,e,s)=>{for(const n of o)P(t,(r+h)/2,c-e/2,n,Math.abs(h-r),e,i,s.clone().multiplyScalar(a.range(.8,1.1)),[0,.05,4],0,6)},I0=A(w.terra,y("#b98a6a"),.32).multiplyScalar(.9),xe=y("#a25336"),ze=y("#2b1d1e"),Me=y("#c9a455"),R0=K0+m0;W0(k.pas,-J,J,k0,R0,0,1,xe,[0,1,1],4);for(const t of[-1,1])J0(k.pas,t*J,k0,R0,0,ye,-t,I0,[0,0,8]);W0(k.pas,-J,J,k0,R0,ye,-1,ze,[0,0,0],8),await d.yield(),Oe(k.pas,Array.from({length:18},(t,o)=>24-o*6),-J,J,ye,1.5,2.4,u0),await d.yield();for(const t of[-1,1])P(k.pas,t*(J-.9),ye-3.2,(k0+R0)/2,1.8,1.6,k0-R0,b0,[0,.05,4],0,10);ee(k.pas,R0,1,J,ye,I0,[0,0,8]),await d.yield(),Ie(k.pas,K0,-1),await d.yield();for(let t=0;t<7;t++)for(const o of[-1,1]){const r=18-t*14-(o>0?7:0),h=o*J;Re(k.pas,h,o,9.43,r,4.8),k.pas.add(g0(12,1,(c,i)=>{const e=Math.PI*c,s=2.9+i*.7;return[h-o*.08,9.45+3.2+Math.sin(e)*s*1.25-3.2*(1-Math.min(1,Math.sin(e)*3)),r+Math.cos(e)*s*o]},!0),H,w.gold.clone().multiplyScalar(.55),[0,.2,0]);for(let c=0;c<4;c++)f0(h-o*a.range(.5,1.2),9.43,r+(c-1.5)*1.05+a.range(-.2,.2),c%3===0?2:a.int(0,1),.9,!1);G0.push([h-o*1.2,11.5,r,2.2]),await d.yield()}for(const t of[-1,1])for(let o=k0-3;o>R0+3;o-=a.range(3,3.9))f0(t*a.range(3.3,3.9),0,o,a.chance(.55)?1:0,1.15);{const t=_0.pas,o=-34,r=-J+2.2;P(t,r,3.5,o,3.2,.5,15,u0,[0,.25,0],0,4);for(const e of[-6.6,0,6.6])P(t,r-1.2,1.65,o+e,.6,3.3,.7,b0,[0,.1,0]),P(t,r+1.2,1.65,o+e,.6,3.3,.7,b0,[0,.1,0]),P(t,r,2.9,o+e,2.6,.5,.5,b0,[0,.1,0]);P(t,r-1.4,6.6,o,.4,1.3,15,u0,[0,.25,0],0,4),P(t,r-1.4,5,o,.35,.6,15,b0,[0,.2,0]);for(const e of[-7.2,-2.4,2.4,7.2])P(t,r-1.45,5.3,o+e,.45,3.4,.55,b0,[0,.1,0]);t.add(K([[.02,.9],[1.1,.95],[1.35,.5],[1.5,.12],[2.9,0],[3,.06],[1.5,.3],[1.3,.9],[1,1.3],[.02,1.4]],18),v(r+.2,3.76,o+3.4,1,1,1,.4,.06),(e,s,n,l)=>{l.copy(Me).multiplyScalar(.75+.3*Math.abs(Math.sin(Math.hypot(e,n)*14))),s>.28&&s<.6&&Math.hypot(e,n)<1.6&&l.copy(w.magenta).multiplyScalar(.7)},[0,.15,0]);const h=J-2.6,c=-52,i=y("#6f7f86");t.add(K([[.02,0],[1.5,0],[1.6,.15],[1.45,3.2],[1.55,3.35],[1.4,3.4],[1.3,3.2],[.02,3.1]],14),v(h,0,c),(e,s,n,l)=>{l.copy(i).multiplyScalar(s>1.3&&s<1.5||s>2.6&&s<2.75?.6:1)},[0,.7,0]),t.add(x.tubeGeo([b(0,1,-1.3),b(0,2,-2.6),b(0,3.2,-3.7),b(0,3.9,-4.2)],e=>.34-.14*e,7),v(h,0,c),i,[0,.7,0]),t.add(K([[.02,0],[.5,.05],[.62,.3],[.02,.36]],9),v(h,3.85,c-4.3,1,1,1,0,-.9),i.clone().multiplyScalar(.8),[0,.7,0]),t.add(new p.TorusGeometry(1.25,.14,5,12,Math.PI),v(h,2.3,c+1.4,1,1,1,Math.PI/2,0,-Math.PI/2),i,[0,.7,0]),await d.yield();for(const[e,s,n]of[[-J+2.4,6,1.5],[J-2.3,-4,1.3],[-J+2.3,-58,1.4],[J-2.4,-24,1.6],[-J+2.6,-70,1.2],[J-2.5,-68,1.5]])t.add(K([[.02,0],[.5,0],[.56,.06],[.86,.6],[1,1.3],[.8,1.9],[.5,2.2],[.62,2.45],[.5,2.4],[.4,2.15]],11),v(e,0,s,n),(l,u,f,m)=>{m.copy(w.terra).multiplyScalar(u>1&&u<1.5?.5:.85)},[0,.35,0],.1,a),_e(t,e,2.6*n,s,1.1*n,13,a.chance(.25))}const O0=[[w.magenta,w.violet],[y("#e9dcc4"),w.orange],[w.magenta,w.orange,w.violet,w.cobalt]][t0.flagScheme];for(let t=0;t<11;t++)ce.push({x0:-J+.3,x1:J-.3,y:23.5+t%2*1.2,z:16.4-t*8.4,sag:2.2,n:6,w:3.1,h:3.7,colors:t%2?O0.slice().reverse():O0});await d.yield();const N=K0-m0,O=Y0+m0,te=36,C0=(N-O)/5,Qe=y("#5f5953");W0(k.pat,-P0,P0,N,O,0,1,Qe,[0,1,2],6),ee(k.pat,N,-1,P0,te,I0,[0,0,8]),ee(k.pat,O,1,P0,te,I0,[0,0,8]),Ie(k.pat,Y0,-1);for(const[t,o]of[[k.pat,K0],[k.pat,Y0],[k.kit,S0]])W0(t,-8.6,8.6,o+m0+.6,o-m0-.6,.03,1,Qe,[0,1,2],3);for(const t of[N-1,O+1])P(k.pat,0,te+.6,t,P0*2,1.4,3.4,w.terra.clone().multiplyScalar(.7),[0,.1,6],0,12);await d.yield();for(const t of[-1,1]){J0(k.pat,t*P0,N,O,0,33,-t,I0,[0,0,8]),W0(k.pat,t>0?R-1:-P0,t>0?P0:-R+1,N,O,25.6,-1,ze,[0,0,4],6);for(let o=0;o<=10;o++)P(k.pat,t*(R+6),24.9,N-o*C0/2,12,1.4,1.1,u0,[0,.05,4]);for(let o=0;o<5;o++){const r=N-o*C0,h=r-C0/2,c=C0/2-1.5,i=e=>Math.abs(e)>=c?12.5:12.5+Math.sqrt(c*c-e*e);for(const e of[-1,1])k.pat.add(g0(26,3,(s,n)=>{const l=(s-.5)*C0;return[t*(R+e*1.1),_(i(l),27,n),h+l]},t*e>0),H,I0,[0,0,0]);k.pat.add(g0(24,1,(e,s)=>{const n=Math.PI*e;return[t*(R-1.1+s*2.2),12.5+Math.sin(n)*c,h+Math.cos(n)*c]},t<0),H,I0.clone().multiplyScalar(.8),[0,0,0])}await d.yield();for(let o=0;o<=5;o++){const r=N-o*C0;k.pat.add(K([[1.95,0],[1.95,.7],[1.7,.9],[1.75,1.2],[1.5,1.5],[1.52,5.5],[1.4,10.4],[1.55,10.7],[1.42,10.95],[1.6,11.3],[1.95,12],[1.95,12.5]],14),v(t*R,0,r),Y,[0,.12,7],.08,a),P(k.pat,t*R,12.75,r,4.3,.6,4.3,Y.clone().multiplyScalar(.85),[0,.1,7]),P(k.pat,t*R,.25,r,4.4,.5,4.4,Y.clone().multiplyScalar(.7),[0,.1,7])}await d.yield(),k.pat.add(g0(8,24,(o,r)=>[t*_(R-3,P0,o),_(26.6,32,o),_(N,O,r)],t<0),H,w.terra.clone().multiplyScalar(.8),[0,0,6]),P(k.pat,t*(R-2.6),26.2,(N+O)/2,.8,1,N-O,b0,[0,.05,4],0,12);for(let o=0;o<36;o++)P(k.pat,t*(R-1.9),25.9,N-1.5-o*2.95,2.4,.6,.5,u0,[0,.05,4]);J0(k.pat,t*(P0-.1),N,O,32,34.5,-t,I0.clone().multiplyScalar(.7),[0,0,6]),await d.yield()}const ae=new p.Group;ae.position.set(Z.x,0,Z.z);{const t=k.pat,o=v(Z.x,0,Z.z),r=l=>[0,.25,7],h=(l,u,f,m)=>{m.copy(Y).multiplyScalar(.72+.3*Math.abs(Math.sin(Math.atan2(f,l)*8))*(u>1.2&&u<2?1:.35))};t.add(K([[9.6,0],[9.6,.6],[9.2,.75],[9.25,1.4],[9,1.6],[9.05,2.3],[9.35,2.6],[9.3,2.95],[8.5,3],[8.3,2.6],[8.2,.9],[.02,.8]],40),o,h,r()),t.add(K([[2.4,.8],[2.4,1.6],[1.5,2],[1.1,3.4],[1.5,4.3],[1,4.9],[.9,6.3],[1.6,6.9],[3.4,7.5],[4.6,8.2],[4.75,8.55],[4.4,8.6],[3.2,8],[.02,7.9]],28),o,h,r()),t.add(K([[1,7.9],[.7,8.9],[1.05,9.5],[.6,10.2],[.75,10.9],[.3,11.5],[.42,11.9],[.02,12.2]],14),o,Y,r()),await d.yield();for(let l=0;l<8;l++){const u=l/8*l0;t.add(new p.SphereGeometry(.55,7,5),v(Z.x+Math.cos(u)*9.3,3.2,Z.z+Math.sin(u)*9.3,1,.8,1),Y.clone().multiplyScalar(.9),[0,.2,7])}const c=new p.Mesh(new p.CircleGeometry(8.5,40).rotateX(-Math.PI/2),xt(E,void 0,!1));c.position.set(Z.x,2.45,Z.z),c.name="basin",j.add(c);const i=new p.CircleGeometry(4.4,24).rotateX(-Math.PI/2);i.translate(0,8.5-2.45,0);const e=new p.Mesh(i,c.material);e.position.copy(c.position),j.add(e);const s=[],n=(l,u,f,m,g)=>g0(40,6,(M,W)=>{const C=M*l0,F=_(l,u,W)+g*Math.sin(W*Math.PI*.5);return[Math.cos(C)*F,_(f,m,W*W),Math.sin(C)*F]});for(const[l,u]of[[n(4.72,5.5,8.55,2.5,.5),0],[n(.3,1.9,11.9,8.5,.9),.3]]){const f=new Float32Array(l.attributes.position.count*2);for(let m=0;m<=6;m++)for(let g=0;g<=40;g++)f[(m*41+g)*2]=g/40+u,f[(m*41+g)*2+1]=m/6;l.setAttribute("uv",new p.BufferAttribute(f,2)),s.push(l)}for(const l of s){const u=new p.Mesh(l,ae.userData.sheetMat||(ae.userData.sheetMat=xt(E,void 0,!0)));u.position.set(Z.x,0,Z.z),u.renderOrder=2,j.add(u)}L0.push([Z.x,3.5,Z.z,14]);for(let l=0;l<14;l++)w0.push([Z.x+a.range(-5,5),2.6,Z.z+a.range(-5,5),a.range(1.2,2.6),a.range(.6,1.1),a(),.16,0,.6,.75,1])}await d.yield();const $e=[],Je=[];for(let t=0;t<16;t++){const o=t/16*l0+a.range(-.15,.15),r=a.range(5.6,7.9);$e.push({x:Math.cos(o)*r,y:2.4,z:Math.sin(o)*r,r:.42,h:.45,kind:2,col:Ye[a.int(0,4)],fs:.3,fy:2.9})}for(let t=0;t<46;t++){const o=a.range(0,l0),r=a.range(5.2,8.2);Je.push({x:Math.cos(o)*r,y:2.46,z:Math.sin(o)*r,nx:a.range(-.15,.15),ny:1,nz:a.range(-.15,.15),r:a.range(.4,.62),col:c0(),em:.8})}{const t=_0.pat,o=y("#3a2c26"),r=y("#173626"),h=y("#2a5a36"),c=t0.orangeTree?y("#ff8a1c"):y("#f2dc6a"),i=(l,u,f)=>t.add(x.tubeGeo(l,m=>_(u,f,m),8),H,(m,g,M,W)=>{W.copy(o).multiplyScalar(.7+.5*Math.abs(Math.sin(g*1.3+m*2.1+M*1.7)))},[0,.05,0]);i([b(e0.x,0,e0.z),b(e0.x+.4,5,e0.z-.3),b(e0.x-.5,10,e0.z+.4),b(e0.x,15,e0.z)],1.9,1.3),t.add(K([[4.2,0],[4.2,1.6],[3.9,1.9],[3.7,1.8],[3.7,.4],[.02,.4]],20),v(e0.x,0,e0.z),Y.clone().multiplyScalar(.8),[0,.1,0]),await d.yield();const e=[];for(let l=0;l<7;l++){const u=l/7*l0+a.range(-.3,.3),f=l===0?1.5:a.range(.35,1),m=a.range(8,12),g=b(e0.x+Math.cos(u)*Math.cos(f)*m,15+Math.sin(f)*m,e0.z+Math.sin(u)*Math.cos(f)*m);i([b(e0.x,13.5,e0.z),b(_(e0.x,g.x,.4),_(14,g.y,.55),_(e0.z,g.z,.4)),g],.9,.3),e.push(g)}await d.yield();const s=[];for(let l=0;l<46;l++){const u=e[l%e.length],f=a.range(0,6.5),m=a.range(0,l0),g=a.range(-.5,1.2),M=a.range(3.2,5.6),W=b(u.x+Math.cos(m)*Math.cos(g)*f,u.y+Math.sin(g)*f*.9+1,u.z+Math.sin(m)*Math.cos(g)*f);s.push([W,M]);const C=new p.IcosahedronGeometry(1,2),F=C.attributes.position;for(let L=0;L<F.count;L++){const T=F.getX(L),D=F.getY(L),I=F.getZ(L),o0=1+.32*d.noise.n3(T*2.3+l*7,D*2.3,I*2.3)+.14*d.noise.n3(T*6+l,D*6,I*6);F.setXYZ(L,T*o0,D*o0*.82,I*o0)}{const L=C.attributes.normal;for(let T=0;T<F.count;T++){const D=Math.hypot(F.getX(T),F.getY(T)*1.2,F.getZ(T))||1;L.setXYZ(T,F.getX(T)/D,F.getY(T)*1.2/D,F.getZ(T)/D)}}t.add(C,v(W.x,W.y,W.z,M,M,M,a.range(0,l0)),(L,T,D,I)=>{I.copy(r).lerp(h,M0(T*.6+.4+.5*d.noise.n3(L*1.5,T*1.5,D*1.5+l),0,1))},[0,.55,.31]),await d.yield()}const n=Math.round(170*_(.7,1,q));for(let l=0;l<n;l++){(l&15)===0&&await d.yield();const u=a.pick(s),f=a.range(0,l0),m=a.range(-1.1,.5),g=u[1]*.98;t.add(new p.SphereGeometry(a.range(.34,.46),5,4),v(u[0].x+Math.cos(f)*Math.cos(m)*g,u[0].y+Math.sin(m)*g*.82,u[0].z+Math.sin(f)*Math.cos(m)*g,1,1.25,1),c.clone().multiplyScalar(a.range(.75,1.05)),[.1,.5,.3])}await d.yield();for(let l=0;l<11;l++){const u=s[(l*4+1)%s.length],f=u[0].x+a.range(-2,2),m=u[0].z+a.range(-2,2),g=Math.max(13,u[0].y-u[1]*.82-a.range(1.5,4.5));t.add(new p.OctahedronGeometry(.75,0),v(f,g,m,1,1.3,1,a.range(0,3)),A(w.gold,w.orange,.3),[2.2,.3,.6]),P(t,f,(g+u[0].y)/2+.5,m,.09,Math.max(.5,u[0].y-g-1),.09,y("#2a2422"),[0,0,.6]),w0.push([f,g,m,.35,.2,a(),2.6,2,1,.62,.25]),L0.push([f,g,m,5])}G0.push([e0.x+6,14,e0.z+4,3.5])}await d.yield();const G={x:-1,z:-155.5,ry:-.526,s:1.32,bx:-.86,bz:-.5},A0=x.makeBatch(),ke=x.makeBatch();{const t=y("#39404f"),o=y("#2a2f3c"),r=[0,2.7,0],h=(n,l,u,f,m,g,M,W=0,C=0,F=0,L=t)=>n.add(new p.SphereGeometry(1,14,10),v(l,u,f,m,g,M,C,W,F),L,r),c=new p.CatmullRomCurve3([b(0,.62,-3.55),b(0,.92,-3.1),b(.05,1.06,-2.4),b(.03,.98,-1.3),b(0,1.1,-.2),b(0,1.28,.9),b(0,1.4,1.7),b(0,1.52,2.3)]),i=[.22,.74,1.02,.8,.96,1.16,1,.62],e=n=>{const l=n*(i.length-1),u=Math.min(i.length-2,Math.floor(l)),f=l-u,m=f*f*(3-2*f);return _(i[u],i[u+1],m)};A0.add(x.tubeGeo(c.getPoints(36),n=>e(n),18),v(0,.04,0,.86,.95,1),(n,l,u,f)=>{f.copy(o).lerp(t,M0(l*.7,0,1))},r),h(A0,0,1.5,2.25,.56,.6,.42);for(const n of[-1,1])A0.add(x.tubeGeo([b(n*.62,1,1.75),b(n*.7,.5,1.6),b(n*.72,.3,2.2),b(n*.68,.27,3),b(n*.66,.24,3.75)],l=>.42-.17*l,10),H,t,r),h(A0,n*.66,.22,3.85,.3,.2,.44,0,0,0,o),h(A0,n*.72,.74,-2.1,.42,.74,1.05,.2),A0.add(x.tubeGeo([b(n*.86,.36,-2.75),b(n*.98,.26,-2),b(n*1.02,.22,-1.1)],l=>.24-.06*l,8),H,t,r),h(A0,n*1.02,.19,-.95,.22,.16,.36,0,0,0,o);A0.add(x.tubeGeo([b(0,.66,-3.45),b(.25,.42,-4),b(.95,.24,-4.05),b(1.6,.18,-3.5),b(1.85,.15,-2.8)],n=>.17-.12*n,7),H,t,r),await d.yield(),ke.add(x.tubeGeo([b(0,-.2,-.1),b(0,.6,.3),b(0,1.3,.7),b(0,1.75,1.05)],n=>.6-.2*n,12),H,t,r);{const n=new p.CatmullRomCurve3([b(0,1.86,.72),b(0,1.97,1.2),b(0,1.93,1.75),b(0,1.84,2.35),b(0,1.77,2.9),b(0,1.72,3.35),b(0,1.7,3.56)]),l=[.3,.55,.5,.33,.25,.19,.03],u=f=>{const m=f*(l.length-1),g=Math.min(l.length-2,Math.floor(m)),M=m-g,W=M*M*(3-2*M);return _(l[g],l[g+1],W)};ke.add(x.tubeGeo(n.getPoints(22),f=>u(f),14),v(0,0,0,.94,1,1),t,r)}for(const n of[-1,1])ke.add(K([[.02,0],[.44,.1],[.56,.6],[.44,1.35],[.16,2],[.02,2.1]],10),v(n*.46,2.3,1,1,1,.26,n*.55,-.12,-n*.3),t,r);const s=t0.dogPair?10:5.6;for(let n=0;n<21;n++){const l=(n+a.range(-.3,.3))/20*2-1,u=s+a.range(-.9,1.3)-1.6*l*l;f0(G.x+G.bx*u-G.bz*l*8.4,0,G.z+G.bz*u+G.bx*l*8.4,n%3===2?1:0,1.45)}for(let n=0;n<4;n++)f0(G.x+Math.sin(G.ry)*6.6-G.bx*(.6+n*1.2)+a.range(-.4,.4),0,G.z+Math.cos(G.ry)*6.6-G.bz*(.6+n*1.2)+a.range(-.4,.4),a.int(1,2),1.1);L0.push([G.x+G.bx*(s+1),2.5,G.z+G.bz*(s+1),16]),G0.push([G.x+G.bx*s,4.5,G.z+G.bz*s,3.4])}await d.yield();const He={x:t0.catFar?15:-15,y:te+1.3,z:O+1},he=x.makeBatch(),et=x.makeBatch();{const t=y("#16161f"),o=[0,2.2,0];he.add(K([[.02,0],[1.05,.08],[1.2,.7],[1,1.7],[.62,2.5],[.4,2.9],[.02,3]],12),v(0,0,0,1,1,1.15),t,o),he.add(new p.SphereGeometry(.62,10,8),v(0,3.15,.25,1.05,.92,1),t,o);for(const r of[-1,1])he.add(new p.ConeGeometry(.3,.62,4),v(r*.36,3.82,.2,1,1,.55,r*.3,0,-r*.2),t,o),he.add(new p.SphereGeometry(.3,6,5),v(r*.4,.3,.95,.9,1,1.5),t,o);et.add(x.tubeGeo([b(0,0,0),b(0,-.5,-.5),b(0,-1.6,-.75),b(0,-2.6,-.6),b(0,-3.2,-.2)],r=>.2-.06*r,6),H,t,o)}await d.yield();{const t=_0.pat,o=y("#221d1c"),r=w.terra.clone().multiplyScalar(.8),h=y("#2f5f33"),c=[w.magenta,y("#e8402a"),A(w.magenta,w.violet,.4)];for(const f of[-1,1])for(let m=0;m<=5;m++){const g=N-m*C0,M=M0(g,O+2.4,N-2.4),W=f*(R-2.5);P(t,f*(R-1.9),10.6,M,1.3,.16,.16,o,[0,.4,0]),t.add(K([[.02,0],[.42,.1],[.55,.2],[.55,1.3],[.42,1.4],[.6,1.5],[.25,1.95],[.02,2]],6),v(W,8.5,M),(D,I,o0,n0)=>{I>.25&&I<1.3?n0.copy(A(w.gold,w.orange,.35)):n0.copy(o)},[0,.4,.25]),t.add(new p.CylinderGeometry(.46,.46,1,6,1,!0),v(W,9.3,M),A(w.gold,w.orange,.3),[2.4,.3,.25]),w0.push([W,9.3,M,.12,.2,a(),3.4,2,1,.6,.22]),L0.push([W-f*.6,9.3,M,9]),m<5&&Wt([f*(R-1.75),11.9,g-1.3],[f*(R-1.75),11.9,g-C0+1.3],2.7,Math.round(36*_(.8,1.1,d0-.2)),.4);const C=f*(R-4.2),F=M+(m%2?2.8:-2.8),L=a.range(1,1.3),T=(m+(f>0?1:0))%2===0;if(t.add(K([[.02,0],[.8,0],[.86,.1],[1.25,1.6],[1.42,1.75],[1.42,2],[1.2,2],[1.15,1.75],[.02,1.7]],12),v(C,0,F,L),(D,I,o0,n0)=>{n0.copy(r).multiplyScalar(I>1.7?.75:.9+.1*Math.sin(I*9))},[0,.3,0],.1,a),T)for(let D=0;D<11;D++){const I=D/11*l0+a.range(-.2,.2),o0=a.range(3.2,4.6)*L,n0=a.range(1.8,3)*L,h0=h.clone().multiplyScalar(a.range(.7,1.2));t.add(g0(7,2,(z0,X0)=>{const S=.5+z0*o0,s0=1.9*L+n0*Math.sin(z0*2.2)-z0*z0*1.4,a0=(X0-.5)*1.3*L*Math.sin(Math.min(1,z0*1.15+.08)*Math.PI);return[C+Math.cos(I)*S-Math.sin(I)*a0,s0-Math.abs(X0-.5)*.5,F+Math.sin(I)*S+Math.cos(I)*a0]}),H,h0,[0,.3,.35])}else{const D=new p.IcosahedronGeometry(1.7*L,1);t.add(D,v(C,2.9*L,F,1,.8,1),(o0,n0,h0,z0)=>{z0.copy(h).multiplyScalar(.6+.5*a())},[0,.3,.2]);const I=a.pick(c);for(let o0=0;o0<9;o0++){const n0=a.range(0,l0),h0=a.range(.2,1.4);D0(C+Math.cos(n0)*Math.cos(h0)*1.75*L,2.9*L+Math.sin(h0)*1.5*L,F+Math.sin(n0)*Math.cos(h0)*1.75*L,Math.cos(n0),1,Math.sin(n0),.5*L,I.clone().multiplyScalar(a.range(.7,1)),.3,1.3)}}if(m%2===1)for(let D=0;D<3;D++)f0(f*(R-3.6+a.range(-.8,.8)),0,M-2.6+a.range(-1.2,1.2),a.int(0,2),1.1);await d.yield()}for(const f of[-1,1])for(let m=N-3;m>O+3;m-=a.range(3.4,4.6)){const g=$0(m)+f*(ie(m)+a.range(1.7,2.4));Math.hypot(g-Z.x,m-Z.z)>Z.r+2.2&&Math.hypot(g-G.x,m-G.z)>6.2&&f0(g,0,m,a.chance(.5)?1:0,1.15)}const i=R-2.1,e=N-3*C0+2.6;t.add(x.tubeGeo([b(i-2.2,.9,e+.5),b(i-.6,10.5,e)],()=>.17,6),H,Me.clone().multiplyScalar(.6),[0,.2,0]),t.add(K([[1.25,0],[1.3,.3],[.55,2.5],[.28,2.9],[.02,2.95]],9),v(i-2.35,0,e+.55,1,1,.5,0,0,.12),(f,m,g,M)=>{M.copy(Me).multiplyScalar(.55+.4*Math.abs(Math.sin(Math.atan2(g,f)*9+m*3)))},[0,.1,0]);for(const[f,m,g,M]of[[-13,O+5,1.7,!1],[-10.6,O+7.4,1.2,!0],[13.5,O+5,1.5,!1],[-12.5,N-4.4,1.4,!1],[13,N-4.2,1.6,!0]])t.add(K([[.02,0],[.5,0],[.56,.06],[.86,.6],[1,1.3],[.8,1.9],[.5,2.2],[.62,2.45],[.5,2.4],[.4,2.15]],11),v(f,0,m,g),(W,C,F,L)=>{L.copy(w.terra).multiplyScalar(C>1&&C<1.5?.5:.85)},[0,.35,0],.1,a),_e(t,f,2.6*g,m,1.1*g,14,M);await d.yield();for(let f=0;f<Math.round(170*d0);f++){const m=a(),g=-150-a.range(0,30)+a.gauss()*2,M=a.chance(.4),W=M?-(R-3.1):-_(R-3,R+6,m*m),C=M?26.4-a.range(0,5.5)*a():_(26.6,32,(-W-(R-3))/(P0-R+3))+.3;D0(W+(M?a.range(0,.5):0),C,g,M?1:.3,M?.2:1,a.range(-.3,.3),a.range(.45,.8),A(w.magenta,w.violet,a.range(0,.45)).multiplyScalar(a.range(.6,.95)),.22,1.2)}await d.yield();for(const f of[-93,-106,-119,-178,-184])ce.push({x0:-(R-1.2),x1:R-1.2,y:25.2,z:f,sag:4.6,n:15,w:3.5,h:4.1,cord:.16,colors:f%2?O0.slice().reverse():O0});const s=A(w.indigo,w.terra,.25).multiplyScalar(.55),n=k.pat;n.add(K([[3.4,0],[3.5,5],[3.2,5.3],[.02,5.8]],12),v(-29,te+2.6,O-12),s.clone().multiplyScalar(1.2),[0,.2,7]);for(const f of[.8,2.4,3.9,5.5])P(n,-29+Math.cos(f)*2.6,te+1.3,O-12+Math.sin(f)*2.6,.5,2.8,.5,s,[0,0,7]);for(const[f,m,g,M,W]of[[-70,38,-120,34,60],[-66,44,-175,26,40],[70,40,-150,36,70],[66,46,-100,24,30],[-40,41,-215,30,30],[44,43,-212,34,26]])P(n,f,m/2,g,M,m,W,s,[0,0,0]),P(n,f,m+.7,g,M+2,1.4,W+2,s.clone().multiplyScalar(1.3),[0,0,6]);const l=44,u=-292;P(n,l,43,u,13,86,13,s,[0,0,7],0,2);for(const f of[-1,1])for(const m of[-1,1])P(n,l+f*5.2,94,u+m*5.2,2.6,16,2.6,s,[0,0,7]);for(const f of[86.6,102.6])P(n,l,f,u,14.8,1.6,14.8,s.clone().multiplyScalar(1.2),[0,0,7]);n.add(new p.ConeGeometry(10,16,4),v(l,111.4,u,1,1,1,Math.PI/4),s.clone().multiplyScalar(.9),[0,0,6]),n.add(new p.SphereGeometry(.9,6,5),v(l,120,u),s,[0,0,7]),n.add(K([[.02,5.6],[1,5.5],[1.8,4.3],[2.5,1.8],[3.6,.4],[3.8,0]],10),v(l,89.5,u),y("#6a5a30"),[0,.8,7]),we.push([-72,40,-168,70,7,.1,.4],[64,42,-236,60,6,.1,.4])}await d.yield();const H0=Y0-m0,q0=S0+m0,oe=y("#b39a72"),N0=(t,o,r,h,c,i=13,e=!1)=>{t.add(K([[.02,0],[.5,0],[.56,.06],[.86,.6],[1,1.3],[.8,1.9],[.5,2.2],[.62,2.45],[.5,2.4],[.4,2.15]],11),v(o,r,h,c),(s,n,l,u)=>{u.copy(w.terra).multiplyScalar(n>1&&n<1.5?.5:.85)},[0,.35,0],.1,a),i&&_e(t,o,r+2.6*c,h,1.1*c,i,e)},At=(t,o,r,h,c)=>{const i=y("#c98a3c"),e=y("#8a4f1c"),s=y("#f1e2c0"),n=a.range(0,l0),l=(u,f,m,g)=>{g.copy(e).lerp(i,M0(f*1.4+.45,0,1)),a()<.3&&g.lerp(s,.6)};t.add(new p.SphereGeometry(1,12,8),v(o,r+.5*c,h,c*.9,c*.56,c*.9,n),l,[0,.15,0]);for(let u=0;u<2;u++)t.add(new p.SphereGeometry(1,8,5),v(o,r+.86*c,h,c*.92,c*.2,c*.17,n+u*Math.PI/2),l,[0,.15,0]);t.add(new p.SphereGeometry(1,7,5),v(o,r+1.08*c,h,c*.22),l,[0,.15,0])};W0(k.kit,-Q,Q,H0,q0,0,1,xe,[0,1,5],4);for(const t of[-1,1])J0(k.kit,t*Q,H0,q0,0,ge,-t,oe,[0,.3,3]);ee(k.kit,H0,-1,Q,ge,oe,[0,.3,3]),ee(k.kit,q0,1,Q,ge,oe,[0,.3,3]),Ie(k.kit,S0,-1),W0(k.kit,-Q,Q,H0,q0,ge,-1,ze,[0,0,0],8),Oe(k.kit,Array.from({length:12},(t,o)=>H0-3-o*5.5),-Q,Q,ge,1.5,2.4,u0),await d.yield();const Bt=[-205,-215.5,-226,-236.5,-247],V=15,X=3.4;{const t=k.kit,o=_0.kit,r=y("#221d1c"),h=y("#7a3a26"),c=y("#b8642e");J0(t,V,-196,-252,0,X,-1,oe,[0,.4,3],3),be(t,-196,V,Q,0,X,1,oe,[0,.4,3]),be(t,-252,V,Q,0,X,-1,oe,[0,.4,3]),W0(t,V,Q,-196,-252,X,1,xe.clone().multiplyScalar(1.1),[0,.5,5],3),P(t,V-.25,X+.1,-224,.9,.7,56.6,A(w.cobalt,w.indigo,.15).multiplyScalar(.9),[0,.5,7],0,8);for(const[i,e]of Bt.entries()){t.add(g0(10,1,(f,m)=>{const g=Math.PI*f,M=1.5+m*.55;return[V-.12,1+Math.sin(g)*M*.92,e+Math.cos(g)*M]}),H,Y,[0,.1,7]);for(const f of[-1.78,1.78])P(t,V-.12,.5,e+f,.2,1,.55,Y,[0,.1,7]);t.add(g0(8,2,(f,m)=>{const g=Math.PI*f;return[V-.06,_(0,1+Math.sin(g)*1.38,m),e+Math.cos(g)*1.5]}),H,y("#0a0606"),[0,0,0]);for(let f=0;f<12;f++)o.add(new p.IcosahedronGeometry(a.range(.22,.4),0),v(V-.25-a.range(0,.5),.25+a.range(0,.9)*a(),e+a.range(-1.2,1.2),1,.8,1,a.range(0,3)),new p.Color(1,a.range(.16,.42),.03),[a.range(1.2,3.4),0,0]);for(const f of[-.9,-.3,.3,.9])P(o,V-.7,.95,e+f,.12,1.9,.12,r,[0,.5,0]);P(o,V-.7,.12,e,.3,.24,2.6,r,[0,.5,0]),L0.push([V-2.2,1,e,13],[V+3.4,X+.6,e,9]),w0.push([V-.9,1.1,e,.12,.3,a(),4.6,3,1,.36,.07],[V+3.4-2.6,X+.7,e,.1,.4,a(),3.6,3,.9,.3,.05]);for(let f=0;f<22;f++){const m=a.range(0,l0),g=a.range(1.5,2.5);o.add(new p.IcosahedronGeometry(a.range(.16,.32),0),v(V+3.4+Math.cos(m)*g,X+.2,e+Math.sin(m)*g,1,.7,1,a.range(0,3)),new p.Color(1,a.range(.14,.4),.03),[a.range(.8,3.2),0,0])}o.add(K([[1.46,.14],[2.36,.9],[2.66,1.35]],22),v(V+3.4,X+.02,e,1.02),(f,m,g,M)=>{M.setRGB(1,.34,.06).multiplyScalar(.55*(1-(m-.14)/1.3))},[.75,0,0]);for(let f=0;f<9;f++)w0.push([V-.6+a.range(-.3,.3),.8,e+a.range(-1,1),a.range(4,10),a.range(.12,.3),a(),a.range(.14,.24),0,1.6,.55,.12]);const s=V+3.4,n=a.range(.95,1.08),l=i===2,u=[w.cobalt,y("#e8dcc0"),w.gold][i%3];o.add(K([[.02,0],[1.2,0],[1.4,.15],[2.3,.9],[2.75,1.8],[2.6,2.6],[2.05,3.1],[1.9,3.3],[2.1,3.55],[1.95,3.6],[1.75,3.35],[1.7,3.1]],22),v(s,X,e,n),(f,m,g,M)=>{M.copy(h).multiplyScalar((.7+.25*m/3.6)*(.9+.12*Math.sin(m*17))),m<1&&M.lerp(y("#140c0c"),.75-m*.6),m>2.45&&m<2.75&&M.copy(u).multiplyScalar(Math.sin(Math.atan2(g,f)*10)>0?.75:.4)},[0,.55,0],.08,a);for(const f of[-1,1])o.add(new p.TorusGeometry(.62,.17,6,10),v(s,X+2.75*n,e+f*2.45*n,1,1,1,0,0,Math.PI/2),h.clone().multiplyScalar(.9),[0,.5,0]);if(o.add(new p.CircleGeometry(1.85*n,18).rotateX(-Math.PI/2),v(s,X+3.4*n,e),y("#3a1408"),[.12,1,0]),!l)o.add(K([[.02,.62],[.3,.6],[.36,.35],[.2,.28],[.5,.2],[1.7,.05],[2.05,-.05],[2,-.14],[.02,-.1]],18),v(s,X+3.68*n,e,n),(f,m,g,M)=>{M.copy(h).multiplyScalar(.95+.2*Math.sin(Math.hypot(f,g)*6))},[0,.55,1.1+i*.1]);else{o.add(x.tubeGeo([b(s-.6,X+3,e+.3),b(s-1.6,X+5.4,e-.8),b(s-2.3,X+7.4,e-1.5)],f=>.16+.04*f,6),H,u0.clone().multiplyScalar(1.4),[0,.3,0]);for(let f=0;f<11;f++)o.add(new p.SphereGeometry(a.range(.24,.52),8,6),v(s+a.range(-1.2,1.2),X+3.4*n,e+a.range(-1.2,1.2),1,.5,1),y("#5a2410"),[.2,1,1.5+f*.07])}we.push([s-.3,X+3.5,e,l?28:22,l?8.5:6.5,.5,.8],[s+.5,X+3.5,e-.9,17,5,.7,.7],[s-.4,X+3.5,e+1,20,6,.6,.75]),P(t,s,X+.06,e,4.4,.12,4.4,y("#1a1414"),[0,0,0]),await d.yield()}o.add(K([[.02,.3],[2.7,.3],[2.9,.42],[2.85,.2],[.02,.12]],20),v(V+3.4,X+.8,-198.9),r,[0,.6,0]);for(const i of[.5,2.6,4.7])o.add(new p.IcosahedronGeometry(.75,1),v(V+3.4+Math.cos(i)*1.8,X+.45,-198.9+Math.sin(i)*1.8,1,.75,1),Y.clone().multiplyScalar(.6),[0,.1,0]);for(const[i,e]of[[-.9,.6],[1,.2],[0,-1.1]])o.add(new p.CylinderGeometry(.85,.85,.07,12),v(V+3.4+i,X+1.26,-198.9+e),y("#e2cf9a"),[.03,.1,0]);o.add(x.tubeGeo([b(Q-1.6,17.5,-197),b(Q-1.6,17.5,-251)],()=>.22,6),H,u0,[0,.2,0]);for(let i=0;i<19;i++){await d.yield();const e=-198.5-i*2.85,s=Q-1.6,n=i%4;if(n===0){const l=a.range(1.1,1.5);o.add(K([[.02,0],[l,0],[l+.15,.45],[l+.05,.45],[l-.08,.1],[.02,.1]],14),v(s+.3,15.3-l,e,1,1,1,0,0,Math.PI/2-.12),c,[.02,1,.3]),P(o,s+.2,16.4,e,.22,2.2,.12,c.clone().multiplyScalar(.6),[0,.8,.3])}else if(n===2)o.add(K([[.02,0],[.42,0],[.52,.5],[.5,.95],[.44,.95],[.44,.1],[.02,.08]],9),v(s,15.3,e,1.25),[w.terra,w.cobalt,y("#d9cdb0")][i%3].clone().multiplyScalar(.8),[0,.5,.35]),o.add(new p.TorusGeometry(.34,.09,5,8),v(s,16,e+.78,1,1,1,Math.PI/2),w.terra.clone().multiplyScalar(.7),[0,.5,.35]),P(o,s,16.95,e+.8,.07,1.1,.07,r,[0,0,.35]);else{const l=n===3,u=l?12:22,f=l?4.2:5.6;for(let m=0;m<u;m++){const g=m/u,M=m*2.4,W=l?.42:.3+.25*Math.sin(g*Math.PI);o.add(new p.SphereGeometry(l?.36:.2,5,4),v(s+Math.cos(M)*W,17.1-g*f,e+Math.sin(M)*W,1,l?.85:2.6,1,0,Math.cos(M)*.5,Math.sin(M)*.5),l?y("#d8cdb8").multiplyScalar(a.range(.8,1)):A(y("#a3121a"),w.magenta,a.range(0,.3)).multiplyScalar(a.range(.6,1)),[.02,.7,.25+.5*g])}}}}await d.yield();{const t=_0.pat,o=y("#221d1c"),r=A(w.gold,w.orange,.3);for(const h of[-1,1]){const c=h*23,i=O+2.3;P(k.pat,c,2.9,i,13,.7,3.6,Y,[0,.15,7],0,4),P(k.pat,c,2.4,i,12.2,.4,3,Y.clone().multiplyScalar(.7),[0,.1,7]);for(const e of[-4.8,0,4.8])P(k.pat,c+e,1.1,i,1.6,2.2,2.8,Y.clone().multiplyScalar(.85),[0,.1,7]);for(let e=0;e<12;e++)f0(c+(e-5.5)*.98+a.range(-.2,.2),3.25,i+a.range(-1.1,1),e%4===1?2:a.int(0,1),1,!1);N0(t,c-h*4.6,3.25,i-.2,.8,9,!1),N0(t,c+h*5.2,3.25,i,.7,8,h>0),G0.push([c,6,i+.5,3.6]);for(const e of[h*12.6,h*27]){const n=O+1.7,l=1.9;P(t,e,15.5+2.25*l,O+.95,.22,.22,1.9,o,[0,.4,0]),t.add(K([[.02,0],[.42,.1],[.55,.2],[.55,1.3],[.42,1.4],[.6,1.5],[.25,1.95],[.02,2]],6),v(e,15.5,n,l),(u,f,m,g)=>{f>.25&&f<1.3?g.copy(r):g.copy(o)},[0,.4,.25]),t.add(new p.CylinderGeometry(.46,.46,1,6,1,!0),v(e,15.5+.8*l,n,l),r,[2.4,.3,.25]),w0.push([e,15.5+.8*l,n+.3,.12,.2,a(),5.4,2,1,.6,.22]),L0.push([e,15.5,n+1.2,24],[e,21,n+5,14])}for(const[e,s,n]of[[13,7,6],[20,12.5,7],[29,8.5,6],[9,15.5,5],[26,18,5],[16,21,5]])for(let l=0;l<n;l++){const u=a.range(0,l0),f=a.range(.3,2.3);f0(h*e+Math.cos(u)*f,0,O+s+Math.sin(u)*f,a.int(0,2),1.25)}}}await d.yield();function tt(t,o,r){const h=u0.clone().multiplyScalar(1.25),c=(i,e,s,n)=>t.add(i,o.clone().multiply(e),s,n);for(const i of[-1,1]){c(K([[.26,0],[.3,1.2],[.22,1.5],[.32,2.2],[.26,3.2],[.3,4.4],[.2,5.3],[.02,5.4]],8),v(i*2,.25,1.8),h,[0,.35,0]),c(K([[.26,0],[.3,1.4],[.24,3.3],[.3,5],[.22,8.6],[.3,9],[.34,9.3],[.02,9.6]],8),v(i*2,.25,-1.9,1,1,1,0,-.07),h,[0,.35,0]),c(x.tubeGeo([b(i*2,5.4,1.9),b(i*2.05,5.5,0),b(i*2,5.3,-2.1)],e=>.26+.1*Math.sin(e*Math.PI),7),H,h,[0,.4,0]);for(const e of[1.5,2.6])c(new p.CylinderGeometry(.13,.13,3.7,6).rotateX(Math.PI/2),v(i*2,e,0),h,[0,.3,0]);r&&c(x.tubeGeo(Array.from({length:9},(e,s)=>{const n=s/8*2-1;return b(i*2,.28+1.5*n*n-.05,n*4.3-.3)}),()=>.24,7),H,h,[0,.4,0])}for(const i of[1.3,2.4])for(const e of[1.8,-1.85])c(new p.CylinderGeometry(.13,.13,4,6).rotateZ(Math.PI/2),v(0,i,e),h,[0,.3,0]);c(new p.BoxGeometry(4.4,.35,4.1,10,1,10),v(0,3.45,0),(i,e,s,n)=>{const l=Math.sin(i*7)*Math.sin(s*7);n.copy(Me).multiplyScalar(.6+.3*(l>0?1:.4))},[0,.2,0]);for(let i=0;i<4;i++)c(new p.BoxGeometry(4,.8,.22,6,1,1),v(0,5.3+i*1.15,-2.02-i*.08,1,1,1,0,-.07),h.clone().multiplyScalar(.9),[0,.35,0])}function qe(t,o){const r=Math.round(46*d0);for(let h=0;h<=r;h++){const c=Math.PI*(-.12+1.24*h/r),i=B.hw+1.25+.25*Math.sin(h*.9);D0(Math.cos(c)*i,B.spring+Math.sin(c)*i,t+o*.75,a.range(-.3,.3),a.range(-.2,.4),o,a.range(.5,.78),c0(),.65)}for(const h of[-1,1])for(let c=0;c<9;c++)D0(h*(B.hw+1.4+.2*Math.sin(c)),B.spring-1.2-c*.95,t+o*.75,h*.3,0,o,a.range(.45,.65),c0(),.65)}qe(R0,1),qe(O,1),qe(q0,1),await d.yield();{const t=_0.kit,o=-12.5,r=-224,h=6,c=u0.clone().multiplyScalar(1.2);t.add(new p.BoxGeometry(8.4,.7,23,4,1,12),v(o,h-.35,r),(i,e,s,n)=>{n.copy(c).multiplyScalar(.8+.25*Math.abs(Math.sin(i*2.2))+.1*Math.sin(s*9))},[0,.35,0]),P(t,o,h-1.3,r,7.2,1,21.6,c.clone().multiplyScalar(.7),[0,.2,0]);for(const i of[-1,1])for(const e of[-1,1])t.add(K([[.5,0],[.55,.6],[.36,1],[.5,2.2],[.34,3.6],[.55,4.2],[.55,4.9]],9),v(o+i*3.3,0,r+e*10.3),c.clone().multiplyScalar(.85),[0,.3,0]);for(const i of[-1,1])P(t,o,1.2,r+i*10.3,6.6,.5,.5,c.clone().multiplyScalar(.7),[0,.2,0]);P(t,o,1.2,r,.5,.5,20.6,c.clone().multiplyScalar(.7),[0,.2,0]);for(const[i,e,s]of[[1.6,7.6,1.5],[-1.4,5.6,1.35],[1.8,3.4,1.4],[-.6,8.9,1.2],[.4,5.9,1.25]])At(t,o+i,h,r+e,s);t.add(K([[.02,0],[1.2,0],[2.2,.4],[2.45,.56],[2.3,.62],[1.2,.26],[.02,.22]],14),v(o+.8,h,r-.6),w.cobalt.clone().multiplyScalar(.7),[0,.6,0]);for(let i=0,e=3;e>=1;e--,i++)for(let s=0;s<e;s++)for(let n=0;n<e;n++)t.add(new p.SphereGeometry(.62,9,7),v(o+.8+(s-(e-1)/2)*1.2,h+.95+i*.95,r-.6+(n-(e-1)/2)*1.2,1,.94,1),y("#ff8a1c").multiplyScalar(a.range(.75,1.05)),[.06,.4,0]);await d.yield(),t.add(new p.BoxGeometry(3.2,.5,5,3,1,5),v(o-.6,h+1.2,r-6.2,1,1,1,.3,.2),y("#4a4744"),[0,.15,0],.15,a);for(const[i,e,s]of[[-1.1,-1.8,1.5],[1.1,-1.8,1.5],[0,1.9,.7]])t.add(new p.CylinderGeometry(.3,.2,s,6),v(o-.6+i*.9+e*.25,h+s/2,r-6.2+e*.9,1,1,1),y("#3f3c3a"),[0,.1,0]);t.add(new p.CylinderGeometry(.42,.42,3.6,8).rotateZ(Math.PI/2),v(o-.5,h+1.95,r-6.6,1,1,1,.3),y("#57534f"),[0,.2,0]);for(const[i,e]of[[-2.9,9.6],[2.6,.9],[-2.6,-2.4],[2.9,-9.4],[-.2,-9.9]])f0(o+i,h,r+e,a.int(0,1),1.2,!1);N0(t,o-2.4,h,r+1.6,.9,11),G0.push([o,h+3.5,r+2,3.2],[o,h+3,r-7,2.6]),await d.yield();for(const i of[11,16.5]){P(t,-Q+1.1,i,-224,2.2,.4,36,c,[0,.3,0],0,6);for(let e=0;e<13;e++){const s=-207.5-e*2.75,n=[w.cobalt,y("#d9cdb0"),w.gold,w.terra][(e+(i>12?1:0))%4];t.add(K([[.02,0],[.5,.02],[1,.16],[1.15,.2],[1.1,.26],[.5,.1],[.02,.08]],12),v(-Q+.75,i+1.35,s,1,1,1,0,0,-Math.PI/2+.22),(l,u,f,m)=>{const g=Math.hypot(l,f);m.copy(g>.85?n:g>.55?y("#d9cdb0"):n).multiplyScalar(.8)},[0,.8,0])}await d.yield()}for(const[i,e,s,n]of[[-9.2,-197.5,1.5,!1],[-9.5,-199,1.2,!0],[-19,-247,1.7,!1],[-14.5,-251.5,1.3,!1],[12.5,-254.5,1.4,!0],[-9,-253.5,1.25,!1]])N0(t,i,0,e,s,14,n);await d.yield();for(const i of[-1,1])for(let e=H0-4;e>q0+3;e-=a.range(3.6,4.8)){const s=$0(e)+i*(ie(e)+a.range(1.6,2.2));s<V-2.5&&f0(s,0,e,a.chance(.5)?1:0,1.15)}}await d.yield();const x0=S0-m0,Kt=A(A(A(w.indigo,w.cobalt,.55),y("#8a8aa0"),.14),w.violet,.42).multiplyScalar(1.25),at=(t,o,r,h)=>{h.copy(Kt).multiplyScalar(1-.45*M0(o/Q0,0,1))};W0(k.best,-$,$,x0,Z0,0,1,xe.clone().multiplyScalar(.9),[0,1,5],4);for(const t of[-1,1])J0(k.best,t*$,x0,Z0,0,Q0,-t,at,[0,0,9]);await d.yield(),ee(k.best,x0,-1,$,Q0,at,[0,0,9]),W0(k.best,-$,$,x0,Z0,Q0,-1,ze,[0,0,0],10),await d.yield(),Oe(k.best,Array.from({length:20},(t,o)=>x0-3-o*6.5),-$,$,Q0,1.8,2.8,u0);for(const t of[-1,1])P(k.best,t*12,Q0-3.6,(x0+Z0)/2,2.2,1.8,x0-Z0,b0,[0,.05,4],0,10);await d.yield();const ot=[],Se=x.makeBatch(),V0={x:-15.5,z:-297,ry:Math.PI-.5};{const t=k.best,o=_0.best;for(const e of[-1,1]){const s=e*$,n=-322,l=y("#a8763a"),u=y("#4a2c1a");if(ot.push(Ke(b(s-e*.12,9,e>0?n-3.2:n+3.2),b(0,0,e*6.4),b(0,21,0),8)),z.wet>.8)for(let f=0;f<14;f++)w0.push([s-e*.3,30,n+a.range(-3,3),21,a.range(.5,.9),a(),.17,1,.5,.66,1]);for(const f of[-4.9,4.9])P(o,s-e*.5,19.5,n+f,1,22.6,.9,l,[0,.3,0]);for(const f of[8.4,30.6])P(o,s-e*.5,f,n,1,.9,10.7,l,[0,.3,0]);P(o,s-e*.9,7.7,n,1.8,.5,12,Y,[0,.1,0]);for(const f of[-1,1]){const m=f*(.55+.12*f*e),g=n+f*4.4,M=v(s-e*.7,19.5,g,1,1,1,(e>0?Math.PI:0)+m*e),W=(C,F,L,T)=>o.add(C,M.clone().multiply(F),L,T);for(const C of[.25,2.6])W(new p.BoxGeometry(.3,21.4,.5),v(0,0,-f*C*e),u,[0,.3,.04]);for(const C of[-10.4,0,10.4])W(new p.BoxGeometry(.3,.6,2.85),v(0,C,-f*1.42*e),u,[0,.3,.04]);for(let C=0;C<16;C++)W(new p.BoxGeometry(.12,.85,2.3),v(0,-9.5+C*1.27+(C>7?.3:0),-f*1.42*e,1,1,1,0,0,.5),u.clone().multiplyScalar(.8+.3*(C%2)),[0,.3,.04])}for(const f of[-276,-300,-346,-366]){Re(t,s,e,10.43,f,5.4);for(let m=0;m<5;m++)f0(s-e*a.range(.5,1.3),10.43,f+(m-2)*1+a.range(-.2,.2),m%2?2:a.int(0,1),.9,!1);G0.push([s-e*1.6,12.6,f,2.4])}for(const f of[-288,-356]){Re(t,s,e,21.43,f,4.2);for(let m=0;m<4;m++)f0(s-e*a.range(.5,1.2),21.43,f+(m-1.5)*.95,m%2?0:2,.9,!1)}for(const[f,m,g,M]of[[-266,-288,28,3.4],[-288,-310,28,3.4],[-311,-333,35,2.2],[-334,-356,28,3.4],[-356,-378,28,3.4]]){const W=Math.round(24*_(.8,1.1,d0-.2));for(let C=0;C<=W;C++){const F=C/W;D0(s-e*a.range(.35,.6),g-M*4*F*(1-F)+a.range(-.1,.1),_(f,m,F),-e,a.range(-.2,.4),.45,(C===0||C===W?.85:.6)*a.range(.85,1.15),c0(),.6)}}await d.yield()}for(const[e,s]of[[-282,-Math.PI/2+.1],[-291,-Math.PI/2-.08],[-338,-Math.PI/2+.05]])tt(o,v($-5.2,0,e,1,1,1,s),!1),o.add(K([[.02,0],[.24,0],[.26,.03],[.31,.74],[.325,.76],[.29,.74],[.25,.1],[.02,.08]],9),v($-5.6,3.63,e+.6,1.5),y("#9fc4e6"),[.12,1,0]),await d.yield();tt(Se,H,!0);const r=[w.magenta,w.violet,w.indigo,w.magenta,w.orange];Se.add(new p.BoxGeometry(1.5,.22,4.6,3,1,14),v(2.05,5.72,-.2),(e,s,n,l)=>{const u=Math.floor((n+3)*2.2);l.copy(r[(u%5+5)%5]).multiplyScalar(u%2?.85:.6)},[0,0,0]);for(const e of[-1,1])Se.add(new p.BoxGeometry(.16,2.6,4.4,1,4,14),v(2.05+e*.72,4.5,-.2+e*.1),(s,n,l,u)=>{const f=Math.floor((l+3)*2.2);u.copy(r[(f%5+5)%5]).multiplyScalar((f%2?.85:.6)*(.7+.1*n))},[0,0,0]);await d.yield();const h=v(-$+.75,17,-304,1,1,1,Math.PI/2,0,.3),c=y("#b06a2c"),i=(e,s,n,l)=>o.add(e,h.clone().multiply(s),n,l);i(new p.CylinderGeometry(2.5,2.5,1.1,20).rotateX(Math.PI/2),v(0,-2.2,0),c,[0,.8,0]),i(new p.CylinderGeometry(1.9,1.9,1.1,18).rotateX(Math.PI/2),v(0,.9,0),c,[0,.8,0]),i(new p.CylinderGeometry(1.6,1.6,1.08,14).rotateX(Math.PI/2),v(0,-.5,0),c,[0,.8,0]),i(new p.CircleGeometry(.85,16),v(0,.1,.57),y("#120a08"),[0,0,0]),i(new p.BoxGeometry(.62,6.6,.4),v(0,5.6,.35),b0,[0,.5,0]),i(new p.BoxGeometry(.95,1.7,.4),v(0,9.6,.25,1,1,1,0,-.12),u0,[0,.5,0]),i(new p.BoxGeometry(1.7,.3,.2),v(0,-3,.62),b0,[0,.4,0]);for(let e=0;e<5;e++)i(new p.BoxGeometry(.05,11.6,.05),v((e-2)*.1,3,.68),y("#d8c9a0"),[.15,1,0]);await d.yield();for(const e of[-1,1]){o.add(K([[.02,0],[1.3,0],[1.4,.2],[.65,.55],[.45,1.4],[.75,1.95],[1.55,2.55],[1.9,3.4],[1.8,3.8],[1.58,3.75],[1.5,3.35],[.02,3.25]],14),v(e*20.5,0,-333),(s,n,l,u)=>{u.copy(y("#2a1a18")).lerp(w.terra,.4),n>2.7&&n<3.1&&u.copy(e>0?w.cobalt:w.magenta).multiplyScalar(.8)},[0,.45,0]),o.add(new p.CircleGeometry(1.5,12).rotateX(-Math.PI/2),v(e*20.5,3.5,-333),new p.Color(1,.3,.05),[2.6,0,0]),we.push([e*20.5,3.7,-333,34,6.5,.28,.25],[e*20.5+.6,3.7,-332.5,26,4.5,.36,.2]),N0(o,e*13.5,0,x0-5,1.7,15,e>0),N0(o,e*17.5,0,x0-4.2,1.2,12,!1);for(let s=0;s<7;s++)f0(e*(22+a.range(-2.4,2.4)),0,-333+a.range(-3.5,3.5)+(s<3?6:0),a.int(0,2),1.2);await d.yield()}for(const e of[-1,1])for(const[s,n]of[[-287,1.7],[-311,1.4],[-352,1.8]]){N0(o,e*26.4,0,s,n,14,s===-311);for(let l=0;l<4;l++)f0(e*(24+a.range(-1.5,1.2)),0,s+a.range(-4,4),a.int(0,2),1.1)}await d.yield();for(const e of[-1,1])for(const[s,n]of[[-266,-310],[-334,-378]]){ce.push({zrow:!0,x0:e>0?s:n,x1:e>0?n:s,y:34.6,z:e*($-.55),face:-e,sag:1.5,n:12,w:3,h:3.5,cord:.13,colors:e>0?O0:O0.slice().reverse()});for(const l of[.25,.75])L0.push([e*($-3.2),30.5,_(s,n,l),7])}for(let e=0;e<4;e++)ce.push({x0:-$+.4,x1:$-.4,y:37.5,z:-272-e*11.5,sag:4.2,n:14,w:3.3,h:3.9,cord:.15,colors:e%2?O0.slice().reverse():O0});for(const e of r0.anchors.candleGroups)G0.push([e.position.x*.92,e.position.y+1.2,e.position.z+re+.6,3.6],[e.position.x*.6+a.range(-2,2),e.position.y+2.4,e.position.z+re+.5,2.6])}await d.yield();const nt=[];for(let t=k0;t>=S0-.01;t-=3)nt.push([$0(t),t,2*ie(t)]);const st=Zt(d,{points:nt,y:.15,palette:B0,uniforms:E});st.object.frustumCulled=!1,j.add(st.object),await d.yield();for(const t of[-1,1])for(let o=k0-.5;o>S0;o-=a.range(.8,1.6)/Math.max(q*d0,.6))D0($0(o)+t*(ie(o)+a.range(-.25,.55)),.2,o,a.range(-.3,.3),1,a.range(-.3,.3),a.range(.32,.52),c0(),.9);await d.yield();const Tt=Math.round((U==="dawn"?2600:1500)*q);for(let t=0;t<Tt;t++){(t&511)===0&&await d.yield();const o=a.range(S0,k0),r=U==="dawn"&&t%3===0,h=c0(),c=(ie(o)-.4+Math.abs(a.gauss())*(r?6:1.8))*a.sign(),i=$0(o)+c;Math.hypot(i-Z.x,o-Z.z)<Z.r+.8||o<K0&&o>K0-2*m0-1&&Math.abs(i)>B.hw-.5||Le.push([i,.07,o,a.range(.17,.32),h.r,h.g,h.b])}for(let t=0;t<Math.round(3400*q);t++){(t&511)===0&&await d.yield();const o=a.range(S0,k0),r=c0();Le.push([$0(o)+a.range(-1,1)*ie(o)*.97,.25,o,a.range(.2,.36),r.r,r.g,r.b])}if(z.wet>.8)for(const t of[-1,1])for(let o=N-1;o>O+1;o-=a.range(1.6,3))w0.push([t*(R-3.05),26.2,o,26,a.range(.45,.8),a(),.13,1,.45,.62,1]);for(let t=0;t<Math.round(150*q);t++){const o=a.range(Z0+30,k0);o<N&&o>O||w0.push([$0(o)+a.range(-9,9),a.range(2.5,15),o,a.range(1.5,4),.1,a(),a.range(.07,.13),3,.9,.55,.22])}const ne=(t,o,r,h)=>{const c=new p.Mesh(t,o);return c.name=r,h!==void 0&&(c.renderOrder=h),j.add(c),c};for(const t of["pas","pat","kit","best"])ne(await k[t].build(j0,d),kt,"shell-"+t),await d.yield(),ne(await _0[t].build(j0,d),F0,"props-"+t),await d.yield();const rt=vt(E,Fe,j0,a,z.burn);j.add(rt.body,rt.flames),await d.yield(),j.add(await yt(E,Ue,j0,a,d)),await d.yield(),j.add(jt(E,Le,a)),await d.yield(),j.add(Nt(E,ce,j0,a)),await d.yield();const lt=(t,o,r)=>(h,c,i,e,s,n)=>j0(h+t,c+o,i+r,e,s,n);{const t=lt(Z.x,0,Z.z),o=vt(E,$e,t,a,0);ae.add(o.body,o.flames,await yt(E,Je,t,a,d)),j.add(ae)}await d.yield();const U0=new p.Group,Pe=new p.Group;U0.position.set(G.x,0,G.z),U0.rotation.y=G.ry,U0.scale.setScalar(G.s);const it=(t,o,r,h,c,i)=>{const e=Math.cos(G.ry),s=Math.sin(G.ry);return j0(G.x+(t*e+r*s)*G.s,o*G.s,G.z+(-t*s+r*e)*G.s,h*e+i*s,c,-h*s+i*e)},ct=await A0.build(it,d),ft=await ke.build((t,o,r,h,c,i)=>it(t,o+1.5,r+2,h,c,i),d);U0.add(new p.Mesh(ct,F0)),Pe.position.set(0,1.5,2),Pe.add(new p.Mesh(ft,F0)),U0.add(Pe),j.add(U0);let E0=null;if(t0.dogPair){const t=new p.Group;t.position.set(G.x-2.8,0,G.z-4),t.rotation.y=G.ry+.3,t.scale.setScalar(G.s*.84),E0=new p.Group,E0.position.set(0,1.5,2),E0.rotation.set(.62,.5,0),E0.add(new p.Mesh(ft,F0)),t.add(new p.Mesh(ct,F0),E0),j.add(t)}const de=new p.Group,We=new p.Group;de.position.set(He.x,He.y,He.z),de.scale.setScalar(1.4),de.add(new p.Mesh(await he.build(()=>.05,d),F0)),We.position.set(.5,.2,2.05),We.add(new p.Mesh(await et.build(()=>.05,d),F0)),de.add(We),j.add(de);const se=new p.Group;se.position.set(V0.x,0,V0.z),se.rotation.order="YXZ",se.rotation.y=V0.ry,se.add(new p.Mesh(await Se.build(lt(V0.x,0,V0.z),d),F0)),j.add(se),await d.yield();const Ge=(t,o,r,h,c,i)=>{const e=new p.InstancedBufferGeometry;t.index&&(e.index=t.index),e.setAttribute("position",t.attributes.position);for(const n in o)e.setAttribute(n,new p.InstancedBufferAttribute(new Float32Array(o[n][0]),o[n][1]));e.instanceCount=r;const s=ne(e,h,c,i);return s.frustumCulled=!1,s};{const t=new p.PlaneGeometry(2,1);t.translate(0,.5,0),Ge(t,{iPos:[De.flat(),4]},De.length,Jt(E),"wet-streaks",1);const o=new p.PlaneGeometry(2,2),r=[],h=[],c=[];for(const S of w0)r.push(S[0],S[1],S[2],S[3]),h.push(S[4],S[5],S[6],S[7]),c.push(S[8],S[9],S[10]);Ge(o,{iA:[r,4],iB:[h,4],iC:[c,3]},w0.length,sa(E),"sparkles",4);const i=new p.BufferGeometry;i.setAttribute("position",new p.Float32BufferAttribute([0,0,.5,0,0,-.5,-1,0,.1,1,0,.1,-.75,0,-.5,.75,0,-.5],3)),i.setIndex([0,2,1,0,1,3,1,2,4,1,5,3]);const e=[],s=[],n=[],l=Math.round(72*z.moths*q);for(let S=0;S<l;S++){const s0=G0[S%G0.length];e.push(s0[0],s0[1]+a.range(-.6,1.2),s0[2],s0[3]*a.range(.5,1.1)),s.push(a.range(.7,1.6)*a.sign(),a(),a.range(.3,.46),0);const a0=a.range(.75,1);n.push(a0,a0*.92,a0*.74)}const u=t0.swallows?6:2;for(let S=0;S<u;S++)e.push(a.range(-6,6),45+S*2.2,Z.z+a.range(-8,8),a.range(26,36)),s.push(a.range(.3,.45)*(S%2?1:-1),a(),t0.swallows?1.1:1.5,1),n.push(.08,.08,.14);Ge(i,{iA:[e,4],iB:[s,4],iC:[n,3]},l+u,oa(E),"moths-and-bats"),await d.yield();const f=12,m=[],g=[],M=[],W=[],C=[],F=[];let L=0;for(const S of we){const s0=a();for(let a0=0;a0<=f;a0++)for(const p0 of[-1,1])m.push(S[0],S[1],S[2]),g.push(p0,a0/f),M.push(S[0],S[1],S[2]),W.push(s0),C.push(S[3],S[4],S[5],S[6]);for(let a0=0;a0<f;a0++){const p0=L+a0*2;F.push(p0,p0+1,p0+2,p0+1,p0+3,p0+2)}L+=(f+1)*2}const T=new p.BufferGeometry;T.setAttribute("position",new p.Float32BufferAttribute(m,3)),T.setAttribute("uv",new p.Float32BufferAttribute(g,2)),T.setAttribute("aBase",new p.Float32BufferAttribute(M,3)),T.setAttribute("aPh",new p.Float32BufferAttribute(W,1)),T.setAttribute("aDim",new p.Float32BufferAttribute(C,4)),T.setIndex(F),ne(T,ea(E),"steam",2).frustumCulled=!1;const D=[],I=[],o0=[],n0=[];let h0=0;const z0=(S,s0,a0,p0,Be)=>{for(const[ve,Xe]of[[S,[0,0]],[s0,[1,0]],[a0,[1,1]],[p0,[0,1]]])D.push(...ve),I.push(...Xe),o0.push(...Be);n0.push(h0,h0+1,h0+2,h0,h0+2,h0+3),h0+=4};[9.5,15,22,31].forEach((S,s0)=>z0([-$,S,x0-4],[$,S,x0-4],[$,S,Z0+6],[-$,S,Z0+6],[16,.15-s0*.02,s0+1]));for(const[S,s0]of[[K0,.2],[Y0,.34],[S0,.42]])z0([-9,0,S],[9,0,S],[9,27,S],[-9,27,S],[34,s0,S*.1]);z0([-Q,13,H0-3],[Q,13,H0-3],[Q,13,q0+3],[-Q,13,q0+3],[14,.14,7]);const X0=new p.BufferGeometry;if(X0.setAttribute("position",new p.Float32BufferAttribute(D,3)),X0.setAttribute("uv",new p.Float32BufferAttribute(I,2)),X0.setAttribute("aK",new p.Float32BufferAttribute(o0,3)),X0.setIndex(n0),ne(X0,ta(E),"haze",5).frustumCulled=!1,T0){const S=new p.PlaneGeometry(1.2,2,2,1).rotateX(-Math.PI/2),s0=[],a0=[],p0=Math.round(7600*q);for(let Be=0;Be<p0;Be++){const ve=c0(),Xe=a.sign(),mt=a.chance(.05);s0.push(a(),Xe*Math.max(3.6,5.6+a.gauss()*(mt?2.2:.55)),a.gauss()*(mt?2.2:.6)-.3,a()),a0.push(ve.r,ve.g,ve.b,a.range(.13,.24))}Ge(S,{iA:[s0,4],iB:[a0,4]},p0,na(E),"gust-ribbon")}}await d.yield();const Ft=b(-.52*z.side,.44,-.73).normalize(),Ce={uZen:{value:y(z.zen).multiplyScalar(z.skyGain)},uHor:{value:y(z.hor).multiplyScalar(z.skyGain)},uEast:{value:y(z.east).multiplyScalar(z.skyGain)},uGlowC:{value:y(z.glow)},uGlowK:{value:z.glowK},uStars:{value:z.stars},uMoon:{value:z.moon},uFull:{value:z.full},uMoonDir:{value:Ft},uTime:{value:0},uRockets:{value:z.rockets},uBurst:{value:0},uSide:{value:z.side}},ue=new p.Mesh(new p.SphereGeometry(100,24,12),bt(Ce));ue.frustumCulled=!1,ue.renderOrder=-1,ue.name="sky",j.add(ue);{const t=[];for(const h of ot){const c=h.toNonIndexed();t.push(...c.attributes.position.array),c.dispose(),h.dispose()}const o=new p.BufferGeometry;o.setAttribute("position",new p.Float32BufferAttribute(t,3));const r=new p.Mesh(o,bt(Ce,!0,z.paneK??1));if(r.name="window-sky",j.add(r),z.shaft>0){const h=[],c=[],i=[],e=[];for(let l=0;l<9;l++){const u=l/8*2-1,f=-322+u*3.4,m=1-.6*u*u;h.push(-29.8*z.side,31.5,f,-29.8*z.side,7.5,f,-17*z.side,.1,f+2.6,9.6*z.side,.1,f+8.1),c.push(0,0,1,0,1,1,0,1),i.push(m,m,m,m),e.push(l*4,l*4+1,l*4+2,l*4,l*4+2,l*4+3)}const n=new p.BufferGeometry;n.setAttribute("position",new p.Float32BufferAttribute(h,3)),n.setAttribute("uv",new p.Float32BufferAttribute(c,2)),n.setAttribute("aW",new p.Float32BufferAttribute(i,1)),n.setIndex(e),ne(n,aa(E),"window-shaft",5).frustumCulled=!1}}await d.yield();const Ae=[];Ae.push([0,gt,Ut]);for(let t=0;t>=-310.01;t-=10)Ae.push([wt(t),Et(t),t]);r0.anchors.flyThrough.slice(3).forEach(t=>Ae.push([t.x,t.y,t.z+re]));const Ve=Vt(Ae),pe=t=>Ve.nearestXZ(wt(t),t).u,ht=pe(G.z+1),dt=pe(-226),ut=pe(V0.z),Lt=pe(S0),ra=pe(K0),Dt=r0.anchors.lookAt.clone().add(b(0,-4,re)),_t=b(0,15,Z.z),It=b(-5,9.5,-153),Rt=b(-1,15,Y0+m0),Ot=new p.Vector3,Ht=[{at:(t,o)=>Ot.copy(_t).lerp(It,y0(.27,.34,o)).lerp(Rt,y0(.37,.45,o)),from:.17,to:.5,weight:.8},{at:b(V+3.4,6.4,-228),from:dt-.085,to:dt+.03,weight:.5},{at:b(V0.x,6,V0.z),from:ut-.07,to:ut+.02,weight:.3},{at:Dt,from:Lt-.03,to:.9,weight:.5}],pt=new p.Vector3,me=new p.Vector3,qt=1-.1*z.burn;return{scene:j,path:Ve,duration:38,title:"The Marigold Way Home",camera:{fov:62,near:.3,far:2600,lookAhead:22,sway:.4,bank:0},pois:Ht,portal:{shape:"arch",width:14,height:17,color:"#ffd9a0",glow:1,tilt:!0,revealDistance:300},post:{exposure:z.exposure,bloom:{strength:.42,radius:.7,threshold:1},grade:{saturation:U==="dawn"?1:U==="dusk"?1.04:1.1,contrast:1.05,tint:z.tint,shadowTint:z.shadow,vignette:.36,grain:.02,aberration:0}},ride:"none",update(t,o,r,h){const c=M0(h??0,0,1);Ve.tangentAt(c,pt),r0.setTravel(pt,1),r0.setProgress(y0(.62,1,c));const i=T0?y0(.55,.68,c):0;r0.setGust(i*.85),E.uGustK.value=i,r0.setWind(.25,-1,Math.max(z.wind,i*.7)),r0.setLight({flame:qt*(1+.15*i)}),r0.update(t,o,r),r.getWorldPosition(me),E.uCamZ.value=me.z,ue.position.copy(me),Ce.uTime.value=o,Ce.uBurst.value=M0((c-.285)/.1,0,1),ae.rotation.y=o*.07;const e=y0(.295,.345,c)*(1-y0(ht+.03,ht+.075,c)),s=me.x-G.x,n=me.z-G.z,l=Math.cos(G.ry),u=Math.sin(G.ry),f=M0(Math.atan2(s*l-n*u,s*u+n*l),-1.75,1.75);Pe.rotation.set(_(.72,-.12,e)+.02*Math.sin(o*1.6),_(.08,f*.92,e),.07*e*Math.sin(o*.9),"YXZ"),U0.scale.set(G.s,G.s*(1+.014*Math.sin(o*1.4)),G.s),E0&&(E0.rotation.x=.62+.02*Math.sin(o*1.2+1)),We.rotation.z=.55*Math.sin(o*1.25)+.15*Math.sin(o*2.9),se.rotation.x=.12*Math.sin(o*1.55)*(.75+.25*Math.sin(o*.21))},dispose(){r0.dispose()}}}};export{fa as default};
