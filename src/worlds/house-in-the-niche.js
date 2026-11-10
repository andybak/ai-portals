import*as a from"three";import{makePath as X0,clamp as Ae,lerp as Je,smoothstep as le}from"../kit/core.js";import*as c0 from"../kit/fx.js";import{buildHero as ht,Acc as pt,M as y,ni as Te,niSmooth as Z0,bevelBox as I,archPath as ft,lathe as re,rosetteGeo as U0,quadGeo as u0}from"../parts/house-in-the-niche.js";const D0=["#F4F1E6","#2A4FA8","#B9B24A","#E58A7A","#1B2450","#3B2A20","#F2A33A"],xe=110,C=35,se=44,ie=160,J0=20,$0=30,B0=new a.Vector3(0,8.03+18/16,-113.2),Q0=new a.Vector3(0,18,-(xe+J0)),H0="#1B2450",Y0=0,ze=1,De=2,be=3,vt=4,y0=5,x0=6,et=7,mt=8,dt=9,P0=10,q0=11,F0=12,wt=13,V0=14,bt=1,yt=2,xt=3,gt=4,kt=5,zt=6,Mt=7,St=8,Lt=9,Pt=10,At=12,he=(e,t=1)=>new a.Color(e).multiplyScalar(t);function Tt(e){const t=[{name:"morning",caust:.5,sun:[.63,.27,-.73],sunC:["#fff1d6",10],sky:["#5682f0",.36],bounce:["#a4b4e8",.07],glow:["#c0d6ff",.7],haze:["#a8c0f0",3e-4],top:"#5f9ee6",hor:"#c4e2ee",water:"#7fd0b8",deep:"#3f9f96",wind:.14,dhow:-3.4,lace:1,slits:0,spill:0,gleam:0,areaK:280,wallFill:.15,lamp:0,stars:0,shaft:[2.4,.1,0,.6],cover:.12,lid:0,pose:0,door:["#fff6e2",2],hero:"morning",stain:["#ffd27a","#ff7a8a"],ceil:["#aab4e0",.12],pool:.7},{name:"noon",caust:.75,sun:[-.25,.94,-.22],sunC:["#ffeec4",4.6],sky:["#5e5058",.46],bounce:["#b8854e",.58],glow:["#fff1d4",.8],haze:["#5a4030",.0012],top:"#cfdcea",hor:"#f6f2e2",water:"#19b8b2",deep:"#0c8f9c",wind:.22,dhow:-1.6,lace:1,slits:0,spill:0,gleam:0,lamp:0,stars:0,shaft:[.1,.5,0,.12],cover:.3,lid:1.25,pose:1,door:["#ffe9b4",2.2],hero:"noon",stain:["#e0243a","#2fae4e"],ceil:["#b8854e",.17],pool:1},{name:"storm",caust:.55,sun:[.9,.3,-.3],sunC:["#ddd24a",2.5],sky:["#7266b6",.72],bounce:["#50407c",.4],glow:["#cfc840",2.7],haze:["#55508a",.0022],top:"#6c6a9e",hor:"#e6de6c",water:"#b6ba3c",deep:"#5e6e2a",wind:1,dhow:.5,lace:1,slits:0,spill:0,gleam:1,areaK:260,lamp:0,stars:0,shaft:[.7,.05,0,.2],cover:.5,lid:0,pose:2,door:["#bcbc74",1.7],hero:"storm",stain:["#d6c84a","#58b08a"],ceil:["#8676b4",.22],pool:1.25},{name:"sunset",caust:.5,sun:[-.88,.22,.42],sunC:["#ff8466",3.6],sky:["#4a3cc4",.64],bounce:["#7648b6",.44],glow:["#dc9cc4",.95],haze:["#3a2c78",.0018],top:"#5a4aa8",hor:"#f0a0a0",water:"#a86a9e",deep:"#5c4290",wind:.28,dhow:2.6,lace:1,slits:0,spill:.6,gleam:0,lamp:0,stars:.15,shaft:[0,0,1.1,0],bar:["#ffa462",4],barDir:[-1,.6,-.42],cover:.68,lid:0,pose:3,door:["#ff9a80",2],hero:"sunset",stain:["#a05cff","#ff5a9a"],ceil:["#b070a8",.2],pool:1.1},{name:"night",caust:.5,sun:[.3,.85,.42],sunC:["#d6e2ff",5.2],low:.3,lowFloor:.5,sky:["#8c9cf0",.15],bounce:["#8c9cf0",.08],glow:["#8c9cf0",1],haze:["#10173c",.002],top:"#080c2a",hor:"#2c4296",water:"#0c1638",deep:"#040714",wind:.12,laceDrift:.6,dhow:3,lace:1,slits:0,spill:0,gleam:0,lamp:1,stars:1,shaft:[.05,.4,0,.1],cover:.86,lid:0,pose:4,door:["#6f8cff",1.6],hero:"night",stain:["#4f7cff","#7fd0ff"],ceil:["#8c9cf0",.12],pool:1.3,nicheAmb:.8,rim:["#d6e2ff",.5],body:.5}];return e==="kaskazi"?(t[0].sunC=["#ffe2a0",10],t[0].sky=["#5a7ce6",.36],t[0].bounce=["#c8bcc0",.07],t[0].glow=["#e6e0f4",.62],t[0].haze=["#c0bcd4",4e-4],t[0].top="#7fa8d8",t[0].hor="#eedcaa",t[0].water="#5fb8a8",t[0].door=["#ffe4a8",2],t[1].sunC=["#ffdc90",5],t[1].bounce=["#c4904e",.62],t[1].top="#e8dcb8",t[1].hor="#fbf0cc",Object.assign(t[2],{name:"afternoon",sun:[.8,.5,-.2],sunC:["#fff0c0",4.4],sky:["#5b5570",.5],bounce:["#c79a62",.55],glow:["#ffe2a8",.75],haze:["#6a4a2a",.0015],top:"#e6dcc0",hor:"#fff4d0",water:"#2fb0a4",deep:"#148a90",wind:.3,slits:1,gleam:0,areaK:800,shaft:[.1,.1,0,.5],door:["#ffdf98",2.2],hero:"noon",pose:1,stain:["#ffb040","#ff6a3a"],ceil:["#c79a62",.17],reveal:2.6}),t[3].sunC=["#ff9a50",3.8],t[3].hor="#ffb070",t[3].water="#b8706a",t[3].deep="#6a4078",t[4].sunC=["#e4e0fa",5.4],t[4].low=.36,t[4].rim=["#e4e0fa",.5]):e==="wedding"&&(t[0].bounce=["#d8c0d8",.09],t[0].hor="#d4e0f0",t[3].sunC=["#ff9262",3.7]),t}const Ct=`
attribute vec3 color;
attribute vec2 aMH;
attribute vec4 aPiv;
uniform mat4 uToLocal;
uniform float uTime, uWind, uLevel, uLid, uCover, uParrot, uLampOn, uFrond;
uniform vec4 uJ[4];
uniform vec3 uGeck[2];
varying vec3 vCol, vN, vL, vV, vP0, vN0;
varying vec2 vMH;
varying vec4 vPv;
varying float vWD;
vec3 rotv(vec3 v, vec3 ax, float a) { float c = cos(a), s = sin(a); return v * c + cross(ax, v) * s + ax * dot(ax, v) * (1. - c); }
void main() {
  vec3 p = position, n = normal, pv = aPiv.xyz;
  float mat = aMH.x, k = aPiv.w;
  float id = fract(sin(dot(pv, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
  vP0 = position; vN0 = normal; vMH = aMH; vCol = color; vPv = vec4(pv, id);
  if (k > 0.5 && k < 1.5) {            // china: rocks in the wind; some pieces are missing or turned, differently in each room
    float gone = step(fract(id * 7.31 + uLevel * 0.37), 0.13);
    float turned = step(fract(id * 3.71 + uLevel * 0.61), 0.1) * 3.14159;
    float a = uWind * uWind * 0.2 * sin(uTime * (5. + 3. * id) + id * 40.);
    vec3 d = rotv(rotv(p - pv, vec3(0., 1., 0.), turned), vec3(0., 0., 1.), a);
    p = pv + d * (1. - gone); n = rotv(rotv(n, vec3(0., 1., 0.), turned), vec3(0., 0., 1.), a);
  } else if (k < 2.5 && k > 1.5) {     // pendulum
    float a = 0.32 * sin(uTime * 2.4 + id * 6.);
    p = pv + rotv(p - pv, vec3(0., 0., 1.), a); n = rotv(n, vec3(0., 0., 1.), a);
  } else if (k < 3.5 && k > 2.5) {     // chest lid, hinged along z
    p = pv + rotv(p - pv, vec3(0., 0., 1.), -uLid); n = rotv(n, vec3(0., 0., 1.), -uLid);
  } else if (k < 4.5 && k > 3.5) {     // cloth spilling from the open chest
    p = pv + (p - pv) * smoothstep(0.1, 1., uLid);
  } else if (k > 4.5 && k < 9.5) {     // the parrot: body, head, wings, tail
    if (k > 5.5) { vec4 j = uJ[int(k - 5.5)]; vec3 ax = normalize(j.xyz + vec3(1e-5, 0., 0.)); p = pv + rotv(p - pv, ax, j.w); n = rotv(n, ax, j.w); }
    vec3 feet = vec3(0., -26.8, 0.);
    p.y += (p.y - feet.y) * 0.02 * sin(uTime * 1.6);
    p = feet + (p - feet) * uParrot;
  } else if (k > 9.5 && k < 11.5) {    // geckos
    p += uGeck[int(k - 9.5)];
  } else if (k > 11.5) {               // the lamp flame: leans, and is not there by day
    float h = clamp((p.y - pv.y) / 1.4, 0., 1.);
    p.x += h * h * (0.28 * sin(uTime * 3.1) + 0.16 * sin(uTime * 7.3));
    p.z += h * h * 0.2 * sin(uTime * 4.7 + 1.);
    p = pv + (p - pv) * uLampOn * (0.92 + 0.08 * sin(uTime * 11.));
  }
  if (abs(mat - 5.) < 0.5) {           // cotton curtains: breathe, and stream into the room in the squall
    float w = aMH.y, ph = position.z * 0.33 + position.y * 0.2, dirx = -sign(position.x);
    float g = sin(uTime * 1.3 + ph) * 0.6 + sin(uTime * 2.9 + ph * 2.3) * 0.25;
    float wl = min(uWind, 0.4);
    p.x += dirx * w * (1.0 + 1.1 * g + wl * (9. + 3.5 * g));
    p.z += w * 0.4 * sin(uTime * 0.9 + position.y * 0.5) * (1. + 2. * wl);
    p.y += w * w * wl * 5.;
    n = normalize(n + vec3(0., 0., 0.4 * cos(uTime * 1.3 + ph) * w));
    // the squall: the two sea-door curtains stream flat, a third of the way across the room, as flags do
    float sw = smoothstep(0.5, 0.95, uWind) * step(32., position.x) * step(0.0005, w);
    if (sw > 0.001) {
      float s = pow(max(w, 0.), 0.6667), Lc = 22.9;
      float th0 = 0.78 + 0.1 * sin(uTime * 1.7 + position.z * 0.21), kk = 0.74 + 0.08 * sin(uTime * 2.3 + position.z * 0.13 + 1.);
      float a = th0 + kk * s;
      float rip = (0.2 + s) * s * (0.8 * sin(s * 9.5 - uTime * 7.3 + position.z * 0.7) + 0.4 * sin(position.z * 4.1 + s * 5. - uTime * 5.1));
      vec3 ps = vec3(position.x - Lc * (cos(th0) - cos(a)) / kk - cos(a) * rip, 23.4 - Lc * (sin(a) - sin(th0)) / kk + sin(a) * rip,
        position.z + s * 1.3 * sin(uTime * 2.1 + position.z * 1.3 + s * 5.) + (position.z < -80. ? 1. : -1.) * s * 1.6);
      float dr = (0.2 + s) * 0.9 * cos(s * 9.5 - uTime * 7.3 + position.z * 0.7);
      vec3 ns = vec3(cos(a) * normal.x - dr * sin(a) * normal.x, -sin(a) * normal.x - dr * cos(a) * normal.x, 0.);
      p = mix(p, ps, sw); n = normalize(mix(n, ns, sw) + vec3(0., 1e-4, 0.));
    }
  } else if (abs(mat - 9.) < 0.5) {    // the bed cover: thrown back further each hour, lifting in the wind
    float t = aMH.y, f = 1. - uCover * 0.82;
    if (t > f) { p.z = -72. + 12. * (2. * f - t); p.y = 5.75 + 0.5 * smoothstep(0., 0.2, t - f) + 0.2 * sin(position.x * 2.1); p.x = clamp(p.x, 11.9, 22.1); n = vec3(0., 1., 0.); }
    p.y += uWind * 0.7 * max(sin(uTime * 3.3 + position.x * 0.8), 0.) * smoothstep(0.2, 0.9, t);
  } else if (abs(mat - 10.) < 0.5) {   // leaves and fronds
    float w = aMH.y;
    p += vec3(sin(uTime * 1.7 + position.y * 0.8), 0.35 * sin(uTime * 2.3 + position.z), cos(uTime * 1.3 + position.x * 0.6)) * w * (0.22 + 1.5 * uWind);
    p.y -= uFrond * step(38., position.x) * 15. * smoothstep(-4., 14., position.y);      // the fronds outside the sea door, pressed down by the rare visitor
  }
  vec4 wp = modelMatrix * vec4(p, 1.);
  vec4 lp = uToLocal * wp;
  vL = lp.xyz;
  vN = mat3(uToLocal) * (mat3(modelMatrix) * n);
  vV = (uToLocal * vec4(cameraPosition, 1.)).xyz - vL;
  vWD = distance(cameraPosition, wp.xyz);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,N0=`
float h21(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float fbm(vec2 p) { return vn(p) * 0.58 + vn(p * 2.3 + 7.1) * 0.29 + vn(p * 5.1 + 3.7) * 0.13; }
float rect(vec2 p, vec2 lo, vec2 hi, float s) { vec2 a = smoothstep(lo - s, lo + s, p) * (1. - smoothstep(hi - s, hi + s, p)); return a.x * a.y; }
// pierced stars of the shutters and lozenges of the roof grille: 1 = open; w widens the edge with distance
float starHole(vec2 p, float w) {
  vec2 f = abs(fract(p / 1.15 + vec2(0., 0.5 * floor(p.x / 1.15))) - 0.5);
  float d = sqrt(f.x) + sqrt(f.y);
  return 1. - smoothstep(0.56 - w, 0.6 + w, d);
}
float lozenge(vec2 p, float w) {
  vec2 f = abs(fract(p / 0.8) - 0.5);
  return 1. - smoothstep(0.3 - w, 0.34 + w, f.x + f.y);
}
`,Gt=`
uniform vec3 uSunDir, uSunCol, uSky, uBounce, uGlowCol, uHaze, uLampPos, uLampCol, uStainA, uStainB, uBarDir, uBarCol, uLowFill;
uniform float uTime, uLevel, uHazeK, uStain, uSlits, uSpill, uLace, uGleam, uEmis, uGold, uCaust, uAreaK, uWallFill, uLaceDrift, uNicheSun, uReveal;
uniform vec3 uCeil, uWallTint, uBarDir2, uRim, uStone;
uniform float uNicheAmb, uBody, uLowFloor;
varying vec3 vCol, vN, vL, vV, vP0, vN0;
varying vec2 vMH;
varying vec4 vPv;
varying float vWD;
${N0}
float carve(vec2 p) {
  vec2 f = fract(p / 1.3) - 0.5;
  float r = length(f), a = atan(f.y, abs(f.x) + 1e-4);
  float pet = 0.5 + 0.5 * cos(a * 8.);
  float h = smoothstep(0.035, 0.1, r) * smoothstep(0.37, 0.3, r) * (0.35 + 0.65 * pet * pet);
  h += smoothstep(0.035, 0.0, abs(r - 0.415)) * 0.9;
  float d = abs(f.x) + abs(f.y);
  h += smoothstep(0.6, 0.68, d) * (0.55 + 0.45 * step(0.5, fract(d * 9.)));
  return clamp(h, 0., 1.);
}
// how much of the sun reaches p: trace to the room's box and ask whether the box is open there
float openMask(vec3 p, vec3 L) {
  p = clamp(p, vec3(-34.8, 0.02, -109.8), vec3(34.8, 43.9, -0.2));
  vec3 Ls = (step(0., L) * 2. - 1.) * max(abs(L), vec3(1e-3));
  vec3 tb = (mix(vec3(-35., 0., -110.), vec3(35., 44., 0.), step(0., L)) - p) / Ls;
  float t = min(tb.x, min(tb.y, tb.z));
  vec3 e = p + L * t;
  float soft = 0.2 + 0.012 * t, m = 0.;
  if (tb.x <= tb.y && tb.x <= tb.z) {
    if (L.x > 0.) {
      m = rect(e.zy, vec2(-90., 0.), vec2(-70., 24.), soft);
      float sh = rect(e.zy, vec2(-58., 9.), vec2(-46., 25.), soft) + rect(e.zy, vec2(-106., 9.), vec2(-96., 25.), soft);
      m += sh * starHole(e.zy, soft * 0.05) * (1. - uSlits);
      float sl = 1. - smoothstep(0.1, 0.16 + soft * 0.06, abs(fract(e.y / 1.5) - 0.5));
      m = max(m, uSlits * sl * rect(e.zy, vec2(-108., 2.), vec2(-36., 34.), soft) * (1. - 0.9 * rect(e.zy, vec2(-90., 0.), vec2(-70., 24.), soft)));
    } else {
      m = rect(e.zy, vec2(-100., 24.), vec2(-88., 40.), soft) + rect(e.zy, vec2(-82., 24.), vec2(-70., 40.), soft);
      m += uSpill * rect(e.zy, vec2(-108., 12.), vec2(-40., 42.), 5.);
    }
  } else if (tb.y <= tb.z) {
    m = rect(e.xz, vec2(-10., -70.), vec2(10., -40.), soft) * mix(1., lozenge(e.xz + uLaceDrift * uTime * vec2(1., 0.37), soft * 0.12), uLace);
  }
  return min(m, 1.);
}
// the low sun through the two high west windows as it falls across the room: two long bars, ruled by the window bars
float westBars(vec3 p, vec3 Lb) {
  float t = (p.x + 35.) / max(-Lb.x, 0.05);
  vec3 e = p + Lb * t;
  float soft = 0.22 + 0.012 * t;
  float m = rect(e.zy, vec2(-100., 24.), vec2(-88., 39.), soft) + rect(e.zy, vec2(-82., 24.), vec2(-70., 39.), soft);
  float bar = abs(fract(e.z * 0.5 + 0.5) - 0.5) * 2.;
  return m * (1. - 0.6 * smoothstep(0.5, 0.12, bar));
}
// a chain of oval links along x, each joined to the next by a link seen edge on, between two beads; 0 .. 1
float chainH(vec2 p) {
  float f = fract(p.x / 0.62) - 0.5, v = p.y / 0.26;
  float ring = smoothstep(0.2, 0.08, abs(length(vec2(f * 2.25, v)) - 0.72));
  float bar = smoothstep(0.34, 0.2, abs(v)) * smoothstep(0.26, 0.36, abs(f));
  return max(max(ring, bar) * smoothstep(1.3, 1.05, abs(v)), 0.75 * smoothstep(0.34, 0.12, abs(abs(v) - 2.05)));
}
// the reveal of the great arch through the 6 m wall: a chain moulding at its mouth, another at its back, cut flowers between
float revealH(vec2 q) {          // q = (metres into the wall, metres along the arch)
  float h = chainH(vec2(q.y, q.x - 0.9) / 1.5) + chainH(vec2(q.y, q.x - 5.1) / 1.5);
  return h + step(1.9, q.x) * step(q.x, 4.1) * carve(vec2(q.y, q.x - 1.7) * 1.18) * 0.9;
}
void main() {
  float mat = vMH.x;
  vec3 an = abs(vN0);
  vec2 pc = an.z > max(an.x, an.y) ? vP0.xy : (an.x > an.y ? vP0.zy : vP0.xz);
  vec3 T = an.z > max(an.x, an.y) ? vec3(1., 0., 0.) : (an.x > an.y ? vec3(0., 0., 1.) : vec3(1., 0., 0.));
  vec3 B = an.y > max(an.x, an.z) ? vec3(0., 0., 1.) : vec3(0., 1., 0.);
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
  vec3 L = normalize(uSunDir + vec3(0., 1e-5, 0.));
  vec3 V = normalize(vV + vec3(0., 1e-5, 0.));
  vec3 alb = vCol, ecol = vCol;
  float gloss = 0., emis = 0., thin = 0., occ = 1., rimP = 0.;
  vec2 bump = vec2(0.);
  if (mat < 0.5) {             // lime plaster: trowel marks, hairline cracks, damp near the floor, a worn dado
    float n1 = fbm(pc * 0.3), n2 = fbm(pc * 2.1 + 5.);
    alb *= 0.84 + 0.22 * n1;
    alb *= 1. - 0.1 * smoothstep(0.6, 0.95, vn(vec2(pc.x * 1.7, pc.y * 0.06 + 3.))) * (1. - an.y);
    float crack = smoothstep(0.012, 0.0, abs(fbm(pc * 0.16 + 9.) - 0.5)) * smoothstep(0.5, 0.65, vn(pc * 0.07 + 2.));
    alb *= 1. - 0.14 * crack;
    alb *= 1. - 0.2 * smoothstep(7., 0., vL.y) * (1. - an.y) * (0.4 + 0.6 * n2);
    bump = (vec2(fbm(pc * 2.1 + vec2(5.14, 5.)), fbm(pc * 2.1 + vec2(5., 5.14))) - n2) * 1.3;
    // the two long walls: a polished dado, a band of carved rosettes between chain borders at sill height, and the
    // same band again above the doors
    if ((an.x > 0.6 && abs(abs(vP0.x) - 35.) < 0.3) || (an.z > 0.6 && abs(vP0.z) < 0.3 && (abs(vP0.x) > 10.2 || vP0.y > 31.6))) {
      float y = vP0.y, yb = y < 18. ? 6.9 : 28.4, dy = abs(y - yb);
      if (dy < 1.3) {
        vec2 cq = vec2(pc.x, y - yb + 1.3);
        float h0 = carve(cq), hx = carve(cq + vec2(0.035, 0.)), hy = carve(cq + vec2(0., 0.035));
        bump += vec2(h0 - hx, h0 - hy) * 3.4;
        alb *= 0.56 + 0.62 * h0;
      } else if (dy < 1.9) {
        vec2 c = vec2(pc.x + pc.y, pc.x - pc.y) * 1.5;
        float lk = smoothstep(0.1, 0.2, abs(length(fract(c) - 0.5) - 0.3));
        bump += (fract(c) - 0.5) * (1. - lk) * 1.8;
        alb *= (0.7 + 0.34 * lk) * (1. - 0.3 * smoothstep(1.78, 1.9, dy) - 0.2 * smoothstep(1.42, 1.3, dy));
      } else if (y < 5.) {
        alb *= vec3(0.8, 0.71, 0.66) * (0.9 + 0.2 * n2);
      }
    }
    float hwA = vP0.y < 26. ? 10.4 : 10.6 * sqrt(max(1. - (vP0.y - 26.) * (vP0.y - 26.) / 108., 0.));
    if (vP0.z < -110.05 && an.z < 0.5 && abs(vP0.x) < hwA && vP0.y > 7.9) {
      bool jamb = an.x > an.y;
      vec2 q = vec2(-110. - vP0.z, jamb ? vP0.y : vP0.x);
      float h0 = revealH(q), hz = revealH(q + vec2(0.04, 0.)), hs = revealH(q + vec2(0., 0.04));
      // pc runs (z, y) on the jambs and (x, z) round the crown: turn the slope into that frame
      bump += (jamb ? vec2(hz - h0, h0 - hs) : vec2(h0 - hs, hz - h0)) * 3.2;
      alb *= 0.66 + 0.46 * min(h0, 1.);
    }
  } else if (mat < 1.5) {      // wood
    float g = vn(vec2(pc.x * 9., pc.y * 0.45)) * 0.6 + vn(vec2(pc.x * 23., pc.y * 1.1)) * 0.4;
    alb *= 0.68 + 0.6 * g;
    bump = vec2(g - vn(vec2(pc.x * 9. + 0.9, pc.y * 0.45)), 0.) * 0.5;
    gloss = 0.16;
  } else if (mat < 2.5) {      // chip-carved wood
    float h0 = carve(pc), hx = carve(pc + vec2(0.03, 0.)), hy = carve(pc + vec2(0., 0.03));
    bump = vec2(h0 - hx, h0 - hy) * 3.;
    alb *= (0.5 + 0.8 * h0) * (0.8 + 0.4 * vn(vec2(pc.x * 7., pc.y * 0.6)));
    gloss = 0.1 + 0.4 * h0;
  } else if (mat < 3.5) {      // brass
    gloss = 1.;
  } else if (mat < 4.5) {      // the floor: polished lime under woven palm mats
    vec2 q = vL.xz;
    float m1 = rect(q, vec2(-27., -99.), vec2(8.5, -20.), 0.05), m2 = rect(q, vec2(9.5, -58.), vec2(32., -40.), 0.05), m3 = rect(q, vec2(-30., -18.), vec2(30., -11.), 0.05);
    float onMat = max(m1, max(m2, m3));
    vec2 w = q / 0.55, wi = floor(w), wf = fract(w) - 0.5;
    float over = mod(wi.x + wi.y, 2.);
    float strand = over > 0.5 ? abs(wf.x) : abs(wf.y);
    vec3 palm = vec3(0.62, 0.52, 0.27) * (0.72 + 0.4 * h21(wi)) * (1. - 0.5 * smoothstep(0.3, 0.5, strand));
    float band = step(0.82, fract(q.y / 9.3)) + step(0.9, fract(q.x / 12.1 + 0.3));
    palm = mix(palm, mix(vec3(0.05, 0.08, 0.26), vec3(0.3, 0.08, 0.06), step(0.5, fract(q.y / 18.6))) * (0.8 + 0.4 * h21(wi + 3.)), clamp(band, 0., 1.) * 0.85);
    float edge = onMat * (1. - rect(q, vec2(-26., -98.), vec2(7.5, -21.), 0.05) - rect(q, vec2(10.5, -57.), vec2(31., -41.), 0.05) - rect(q, vec2(-29., -17.), vec2(29., -12.), 0.05));
    palm = mix(palm, vec3(0.07, 0.05, 0.035), clamp(edge, 0., 1.) * 0.8);
    float n1 = fbm(q * 0.22), n2 = fbm(q * 1.9 + 3.);
    vec3 lime = alb * (0.74 + 0.3 * n1) * (1. - 0.12 * smoothstep(0.05, 0.0, abs(fract(q.x / 7.) - 0.5) - 0.48));
    lime *= 1. - 0.25 * smoothstep(0.035, 0.0, abs(fbm(q * 0.13 + 4.) - 0.5));
    alb = mix(lime, palm, onMat);
    gloss = mix(0.55 + 0.25 * n2, 0.06, onMat);
    bump = mix((vec2(fbm(q * 1.9 + vec2(3.2, 3.)), fbm(q * 1.9 + vec2(3., 3.2))) - n2) * 0.25, vec2(wf.x, wf.y) * 0.5 * (over > 0.5 ? vec2(1., 0.) : vec2(0., 1.)), onMat);
    // contact shadow under the bed, the chest, the tray and the jasmine pot
    occ = 1. - 0.75 * rect(q, vec2(11.6, -72.4), vec2(22.4, -59.6), 1.6);
    occ *= 1. - 0.7 * rect(q, vec2(13.6, -52.4), vec2(20.4, -45.6), 1.4);
    occ *= 1. - 0.6 * smoothstep(5.5, 2.5, length(q - vec2(-6., -40.))) - 0.6 * smoothstep(5., 2., length(q - vec2(29., -64.)));
    occ = max(occ, 0.15);
  } else if (mat < 5.5) {      // cotton
    alb *= 0.88 + 0.12 * sin(pc.x * 7.) * sin(pc.y * 0.9); thin = 1.;
  } else if (mat < 6.5) {      // china: white glaze painted in the piece's colour
    vec3 d = vP0 - vPv.xyz; float R = max(vMH.y, 0.05), pat;
    if (vMH.y > 0.3) {
      vec2 c = (d.xy - vec2(0., R)) / R; float r = length(c), a = atan(c.y, c.x + 1e-4);
      pat = smoothstep(0.03, 0.0, abs(r - 0.9) - 0.05) + smoothstep(0.02, 0.0, abs(r - 0.56) - 0.012)
        + smoothstep(0.1, 0.0, abs(r - 0.72) - 0.02 - 0.09 * (0.5 + 0.5 * cos(a * (6. + floor(vPv.w * 5.) * 2.))))
        + smoothstep(0.34, 0.26, r) * (0.5 + 0.5 * cos(a * 5. + r * 20.)) * step(0.3, vPv.w);
      // the plate's turned lip (the outer 14 % of its radius) on the half toward the moon: see the rim at the end
      rimP = smoothstep(0.84, 0.9, r) * smoothstep(-0.3, 0.3, dot(c / max(r, 1e-3), normalize(L.xy + vec2(0., 1e-4))));
    } else {
      float a = atan(d.z, d.x + 1e-4);
      pat = step(0.82, fract(d.y * 1.6 + 0.1)) + step(0.55, fract(d.y * 0.8)) * smoothstep(0.2, 0.6, 0.5 + 0.5 * cos(a * 7.));
    }
    alb = mix(vec3(0.82, 0.84, 0.8), vCol, clamp(pat, 0., 1.) * 0.92);
    gloss = 0.6;
  } else if (mat < 7.5) {      // coloured glass: shaded below, once the light is known
    thin = 1.;
  } else if (mat < 8.5) {      // shutter pierced with stars
    if (starHole(pc, 0.0) > 0.5) discard;
    alb *= (0.75 + 0.35 * vn(vec2(pc.x * 6., pc.y * 0.5))) * (0.7 + 0.3 * smoothstep(0.0, 0.06, 0.5 - abs(fract(pc.x / 1.15) - 0.5)));
    alb = mix(alb, vec3(0.2, 0.13, 0.09), smoothstep(0.6, 0.72, fbm(pc * 1.1 + 2.)) * 0.6);
    gloss = 0.12;
  } else if (mat < 9.5) {      // the bed cover: red and indigo bands, or gold embroidery for a wedding
    vec2 q = vP0.xz;
    float st = fract(q.x / 2.5), w2 = sin(q.x * 40.) * sin(q.y * 40.);
    vec3 red = vec3(0.5, 0.045, 0.035), ind = vec3(0.04, 0.06, 0.22);
    alb = mix(red, ind, smoothstep(0.48, 0.52, st)) * (0.85 + 0.15 * w2);
    alb = mix(alb, vec3(0.75, 0.7, 0.55), smoothstep(0.03, 0.01, abs(st - 0.5)) + smoothstep(0.03, 0.01, min(st, 1. - st)));
    vec2 g = abs(fract(q / 1.25) - 0.5);
    float gd = smoothstep(0.05, 0.0, abs(g.x + g.y - 0.36)) + smoothstep(0.1, 0.05, length(g));
    alb = mix(alb, vec3(0.85, 0.55, 0.12), clamp(gd, 0., 1.) * uGold);
    gloss = 0.1 + 0.5 * uGold * clamp(gd, 0., 1.);
    bump = vec2(cos(q.x * 40.), cos(q.y * 40.)) * 0.08;
  } else if (mat < 10.5) {     // leaves
    alb *= 0.8 + 0.4 * vn(pc * 3.); thin = 0.6;
  } else if (mat < 11.5) {     // feathers: scalloped rows
    vec2 f = vec2(pc.x * 3.2 + 0.5 * floor(pc.y * 3.4), pc.y * 3.4);
    float sc = length(fract(f) - vec2(0.5, 0.9));
    alb *= 0.72 + 0.4 * smoothstep(0.3, 0.75, sc);
    bump = (fract(f) - 0.5) * 0.25;
  } else if (mat < 12.5) {     // things that shine by themselves
    emis = 1.;
    if (vMH.y > 1.5) {         // the lamp's flame: white-gold at the wick, amber at the tip, fading toward its outline
      float fh = clamp((vP0.y - vPv.y) / 1.4, 0., 1.), fe = max(dot(N, V), 0.);
      alb = vec3(0.);
      ecol = mix(vec3(1., 0.86, 0.56), vCol, smoothstep(0.05, 0.75, fh));
      emis = (0.2 + 0.8 * fe * fe) * mix(1.5, 0.6, fh);
    }
  } else if (mat < 13.5) {     // the roof grille: carved through in lozenges
    if (lozenge(vP0.xz, 0.0) > 0.5) discard;
    alb *= 0.7 + 0.4 * vn(pc * 2.);
  } else {                     // chain border in plaster
    float dm = vMH.y - 1.;
    if (dm > -0.5) {           // round a niche: a chain of links between two beads that follows the arch (see buildNicheWall)
      vec2 n2 = vPv.yz / max(length(vPv.yz), 1e-3), t2 = vec2(-n2.y, n2.x) * (n2.x < 0. ? -1. : 1.);
      vec2 q = vec2(vPv.x, dm - 0.27) / 0.44;
      float h0 = chainH(q), ha = chainH(q + vec2(0.07, 0.)), hb = chainH(q + vec2(0., 0.07));
      bump = ((h0 - ha) * t2 + (h0 - hb) * n2) * 2.4 * step(0.6, an.z);
      alb *= 0.72 + 0.38 * min(h0, 1.);
    } else {                   // round the great arch: a net of links
      vec2 c = vec2(pc.x + pc.y, pc.x - pc.y) * 1.3;
      float lk = smoothstep(0.12, 0.2, abs(length(fract(c) - 0.5) - 0.3));
      bump = (fract(c) - 0.5) * (1. - lk) * 1.6;
      alb *= 0.8 + 0.25 * lk;
    }
  }
  // The reveal of the stair doorway, where the passage meets the room: the inner faces of the room's own door frame (two jambs
  // at x = +-8, the lintel's soffit), one metre deep (z +0.05 .. -0.95). They are coral stone carrying one chain between two
  // beads on the flat of the face (0.56 m), as the great arch's reveal does at its own scale, and are lit by the room (below).
  float rvJ = step(abs(abs(vP0.x) - 8.11), 0.13) * step(an.z, an.x + 0.01) * step(6.9, vP0.y) * step(vP0.y, 29.9);
  float rvL = step(abs(vP0.y - 29.77), 0.14) * step(abs(vP0.x), 8.3) * step(an.z, an.y + 0.01) * step(vN0.y, 0.);
  float rv = step(1.5, mat) * step(mat, 2.5) * step(-1.05, vP0.z) * step(vP0.z, 0.1) * max(rvJ, rvL);
  if (rv > 0.5) {
    vec2 q = vec2(rvJ > 0.5 ? vP0.y : vP0.x, -vP0.z - 0.45) / 0.52;
    float h0 = chainH(q), ha = chainH(q + vec2(0.07, 0.)), hb = chainH(q + vec2(0., 0.07));
    // pc runs (z, y) on the jambs and (x, z) under the lintel: turn the slope into that frame
    bump = (rvJ > 0.5 ? vec2(h0 - hb, ha - h0) : vec2(ha - h0, h0 - hb)) * 2.6;
    alb = uStone * (0.7 + 0.42 * min(h0, 1.)) * (0.86 + 0.24 * fbm(pc * 0.9 + 3.));
    gloss = 0.;
  }
  N = normalize(N + T * bump.x + B * bump.y);
  float ndl = dot(N, L);
  float sun = openMask(vL + N * 0.25, L);
  float rec = smoothstep(0.05, 1.3, -110. - vL.z);
  sun *= mix(1., smoothstep(0.1, 0.5, L.z) * uNicheSun * smoothstep(-113.6, -111.6, vL.z), rec);
  sun *= 0.74 + 0.26 * smoothstep(0.3, 0.7, vn(vL.xz * 0.045 + vec2(uTime * 0.13, uTime * 0.05) * (1. + 6. * uLaceDrift)));   // cloud shade drifting over the pools
  // a wedding week: light that has passed the coloured bottles. Near the niche wall some of the sun arrives stained, in a
  // few sharp patches; and when the sun rakes the wall each bottle of the lowest tier throws a streak across the floor
  vec3 stainT = vec3(1.), thrown = vec3(0.);
  if (uStain > 0.001) {
    vec2 sc = (an.z > 0.5 ? vL.xy : vL.xz) / vec2(3.1, 3.7), ci = floor(sc), cf = fract(sc) - 0.5;
    float hh = h21(ci + 11.3), e = length((cf - (vec2(h21(ci + 3.1), h21(ci + 7.7)) - 0.5) * 0.4) * vec2(2.3, 1.));
    float nearK = an.z > 0.5 ? smoothstep(27., 15., vL.y) * step(vL.z, -100.) : smoothstep(-42., -64., vL.z) * step(0.5, an.y);
    float tw = 0.82 + 0.18 * sin(uTime * 0.9 + hh * 40.);
    float sunLum = dot(uSunCol, vec3(0.21, 0.72, 0.07));
    stainT = mix(vec3(1.), mix(uStainA, uStainB, step(0.5, h21(ci + 1.7))) * 1.5 * tw * sunLum / max(uSunCol, vec3(0.05)), smoothstep(0.36, 0.31, e) * step(0.66, hh) * nearK * uStain);
    float dz = vL.z + 109.4;
    if (an.y > 0.5 && dz < 14. && vL.y < 0.5) {
      float cx = (vL.x + 33.6) / 4.2, ix = floor(cx), h = h21(vec2(ix, 5.3)), len = 5. + 8. * h21(vec2(ix, 9.1));
      float fx = fract(cx) - 0.5 + dz * 0.03 * L.x, w = 0.17 * (1. - 0.7 * dz / len) + 0.02;
      float st = smoothstep(w, w - 0.03, abs(fx)) * smoothstep(0., 0.5, dz) * smoothstep(len, len - 1.2, dz) * step(0.34, h);
      st *= 0.6 + 0.9 * smoothstep(0.05, 0.0, abs(fx - 0.03 * sin(dz * 1.7 + h * 9.))) + 0.3 * sin(dz * 2.3 + uTime * 0.7 + h * 20.);
      thrown = mix(uStainA, uStainB, step(0.5, fract(h * 7.3))) * st * uStain * smoothstep(0.1, 0.4, L.z) * sunLum * 0.5 * tw;
    }
  }
  vec3 amb = mix(uBounce, uSky, 0.5 + 0.5 * N.y);
  amb *= (0.55 + 0.45 * smoothstep(-4., -60., vL.z)) * mix(1., 0.45, smoothstep(22., 44., vL.y)) * mix(1., uNicheAmb, rec) * (0.66 + 0.34 * smoothstep(35., 24., abs(vL.x)));
  vec3 toD = vec3(37., 12., -80.) - vL; float dd = dot(toD, toD);
  vec3 Ld = toD * inversesqrt(max(dd, 1.));
  float ndd = dot(N, Ld);
  // cloth takes the door's light from either side; the arch's two reveals take it alike
  float area = max(mix(mix(ndd, abs(ndd), thin), 0.35, rec) * 0.7 + 0.3, 0.) * uAreaK / (dd + uAreaK) * mix(1., 0.6, rec);
  // warm light thrown up from the sunlit floor
  float pool = openMask(vec3(vL.x, 0.1, vL.z), L) * max(L.y, 0.);
  // the niche wall takes the low sun warmer than the room does (sunset: rose-gold on every rim, violet in every niche)
  vec3 sunC = uSunCol * mix(vec3(1.), uWallTint, smoothstep(-104., -109.4, vL.z) * (1. - rec));
  vec3 lit = sunC * stainT * mix(max(ndl, 0.), abs(ndl) * 0.4 + 0.2, thin) * sun + (amb + uGlowCol * area) * occ + thrown;
  // the lit floor thrown up on the pole ceiling and the tops of the walls, so the grille is a hole in a ceiling and not in the night
  // (the poles and beams are dark wood: they are given more of it, or they would be a black lid in every dim hour)
  lit += uCeil * smoothstep(19., 40., vL.y) * (0.4 + 0.6 * max(-N.y, 0.)) * (0.7 + 0.3 * smoothstep(50., 12., length(vL.xz - vec2(0., -55.))))
    * mix(1., 4.5, step(0.5, mat) * step(mat, 2.5) * smoothstep(34., 40., vL.y));
  lit += uSunCol * uBounce * 0.9 * pool * max(-N.y * 0.6 + 0.4, 0.) * exp(-vL.y * 0.09);
  lit += uGlowCol * thin * 0.38 * smoothstep(28., 34., abs(vL.x));
  // the sea's light dancing on the ceiling and walls near the sea door
  float ca = vn(vL.xz * 0.3 + vec2(uTime * 0.45, uTime * 0.27)) * vn(vec2(vL.z * 0.27 - uTime * 0.38, vL.y * 0.3 + vL.x * 0.21 + uTime * 0.2));
  lit += uGlowCol * uCaust * smoothstep(0.18, 0.5, ca) * area * (0.3 + 0.7 * max(-N.y, 0.) + 0.3 * abs(N.x)) * 1.7;
  // one gleam crossing the niche wall under the squall
  float gx = (vL.x - 24. * sin(uTime * 0.41 - 1.07)) / 8.5;
  float glm = uGleam * exp(-gx * gx) * smoothstep(-96., -109., vL.z) * (0.75 + 0.25 * vn(vec2(vL.x * 0.35 - uTime * 0.9, vL.y * 0.22))) * mix(0.3, 1., smoothstep(8., 32., vWD));
  lit += uGlowCol * glm * max(N.z * 0.85 + 0.15, 0.) * (1. - 0.85 * rec);
  // the floor's sunlit pool thrown back on the niche wall
  lit += uSunCol * uWallFill * smoothstep(-90., -108., vL.z) * max(N.z, 0.) * (0.55 + 0.45 * smoothstep(34., 0., vL.y)) * (1. - rec);
  // sunset: two bars of the low sun from the west windows, across the floor, the bed and the chest
  vec3 Lb = normalize(uBarDir + vec3(0., 1e-5, 0.));
  float nb = dot(N, Lb);
  lit += uBarCol * mix(max(nb, 0.), abs(nb) * 0.5 + 0.2, thin) * westBars(vL + N * 0.25, Lb) * (0.3 + 0.7 * occ) * (1. - rec);
  // and two more that fall on the floor before the niche wall and climb its foot; its chain borders catch the same gold
  vec3 Lb2 = normalize(uBarDir2 + vec3(0., 1e-5, 0.));
  float nb2 = dot(N, Lb2);
  lit += uBarCol * 0.8 * mix(max(nb2, 0.), abs(nb2) * 0.5 + 0.2, thin) * westBars(vL + N * 0.25, Lb2) * (0.3 + 0.7 * occ) * (1. - rec) * step(1e-3, dot(uBarCol, vec3(1.)));
  lit += uBarCol * 0.13 * step(13.5, mat) * (1. - rec) * max(0.3 - N.x, 0.);
  // night: the chain round every niche takes a little of the moon, so each niche is outlined (uRim is nothing by day)
  lit += uRim * 0.35 * step(13.5, mat) * (1. - rec) * max(dot(N, L), 0.);
  // night: the moon's pool on the mat thrown back, faint and cool, up the lower walls
  vec2 pd = (vL.xz - vec2(0., -55.)) / vec2(46., 62.);
  lit += uLowFill * (1. - uLowFloor * abs(N.y)) * exp(-max(vL.y, 0.) * 0.085) / (1. + 2.2 * dot(pd, pd)) * (0.75 + 0.25 * occ) * (1. - rec);
  // the reveal of the arch takes the room's light at its mouth and falls into shade toward its back
  float mouth = smoothstep(-116.4, -110.2, vL.z);
  float hwL = vL.y < 26. ? 10.4 : 10.6 * sqrt(max(1. - (vL.y - 26.) * (vL.y - 26.) / 108., 0.));
  lit = mix(lit, lit * (0.42 + 0.58 * mouth * mouth) + (uGlowCol * 0.2 + uSky * 0.35 + uSunCol * 0.012) * uReveal * (0.24 + 0.76 * mouth) * (0.4 + 0.6 * max(abs(N.x), N.y)), rec * step(abs(vL.x), hwL) * step(7.9, vL.y));
  // the reveal of the stair doorway takes the room's light and nothing else: that level's ambient without the south wall's
  // corner falloff and a share of the sea door's glow, full at the room's edge and falling to 0.45 at the passage's edge a
  // metre back; it comes from the room, so the chain has a lit side. By night the moon's blue lies on its room edge.
  vec3 revE = 0.5 * (uSky + uBounce) + 0.22 * uGlowCol;
  float rvFall = 0.45 + 0.55 * smoothstep(0.05, -0.95, vP0.z);
  lit = mix(lit, revE * rvFall * (0.62 + 0.75 * max(dot(N, normalize(vec3(-sign(vL.x) * 0.3, 0.2, -1.))), 0.)) + uRim * 0.5 * smoothstep(-0.52, -0.73, vP0.z), rv);
  // its sill: the landing takes the same light inside the frame; beyond the frame it runs out to nothing at the landing's lip
  float sillK = step(mat, 0.5) * step(0.6, an.y) * step(abs(vP0.y - 7.), 0.03) * step(-3.5, vP0.z) * step(vP0.z, 0.1) * smoothstep(10.4, 8., abs(vP0.x));
  lit += revE * sillK * 0.62 * (vP0.z > -0.95 ? rvFall : smoothstep(-3.4, -0.95, vP0.z));
  // the lamp: 12 m and no more
  vec3 tl = uLampPos - vL; float dl = max(length(tl), 0.3), fl = max(1. - dl / 13., 0.);
  lit += uLampCol * (max(dot(N, tl / dl), 0.) * 0.8 + 0.2) * fl * fl * (0.86 + 0.1 * sin(uTime * 9.1) + 0.06 * sin(uTime * 15.7));
  vec3 col = alb * lit;
  vec3 R = reflect(-V, N), Hh = normalize(L + V + vec3(0., 1e-5, 0.));
  float brass = step(0.99, gloss);
  float sp = pow(max(dot(N, Hh), 0.), mix(14., 48., brass)) * sun * step(0., ndl);
  float dsp = pow(max(dot(R, Ld), 0.), mix(9., 30., brass)) * 1100. / (dd + 1100.);
  vec3 env = mix(uBounce, uSky, smoothstep(-0.4, 0.6, R.y)) * (0.45 + 1.1 * smoothstep(-0.3, 0.75, R.y) + 0.9 * smoothstep(0.25, 0., abs(R.y - 0.12))) + uGlowCol * (dsp * 2.5 + 0.25 * area) + uBarCol * 0.1 * smoothstep(0.2, 0.9, -R.x);
  // brass by lamplight mirrors the flame where it faces it and is dark where it does not: the lamp on the sill has a lit
  // shoulder and rim, one highlight and a side in shade
  float rl = max(dot(R, tl / dl), 0.), nlamp = dot(N, tl / dl), byLamp = smoothstep(0.7, 0.92, fl) * step(1e-3, uLampCol.r);
  env += uLampCol * fl * (0.04 + 0.5 * rl * rl * rl + 2.2 * pow(rl, 24.));
  col = mix(col, vCol * (env * 1.2 + lit * 0.35), brass * 0.85);
  col *= mix(1., 0.2 + 0.8 * smoothstep(-0.25, 0.7, nlamp), brass * byLamp);
  col += (uSunCol * sp * mix(vec3(0.3), vCol * 3., brass) + uGlowCol * dsp * mix(vec3(0.45), vCol * 2., brass)) * gloss * occ;
  col += uGlowCol * glm * gloss * (0.5 + 2.2 * pow(max(dot(R, vec3(0.42, 0.2, 0.88)), 0.), 6.));   // the china flashes as the gleam passes
  col += ecol * emis * (uEmis * step(11.5, mat) + (uSky + uGlowCol * area * 2.) * step(mat, 8.));
  if (mat > 6.5 && mat < 7.5) {
    // Blown glass, lit from behind and through. Where the eye looks along the wall of the bottle (its outline) the glass is
    // deep and dark; where it looks through, the colour is lighter and saturated and carries whatever light stands behind.
    // The tall sea door is mirrored as one narrow streak down shoulder and body; on the side away from the door runs the
    // thread of light a round bottle gathers. Some stand part full. aMH.y is the bottle's height (0: a flat pane).
    float nv = clamp(dot(N, V), 0., 1.), isB = step(0.05, vMH.y);
    vec3 sat = vCol / max(max(vCol.r, vCol.g), max(vCol.b, 0.02));
    vec3 dp = vP0 - vPv.xyz;
    vec2 dx = dp.xz / max(length(dp.xz), 1e-3);
    float hy = clamp(dp.y / max(vMH.y, 0.05), 0., 1.);
    float seedN = vn(vec2(dx.x * 1.7 + vPv.w * 31., dp.y * 1.3 + dx.y * 1.7));
    float core = smoothstep(0.05, 0.8, nv); core *= sqrt(core);
    float full = isB * step(0.5, fract(vPv.w * 9.7)), lvl = 0.22 + 0.45 * fract(vPv.w * 5.3);
    float wet = full * smoothstep(lvl + 0.01, lvl - 0.01, hy), men = full * smoothstep(0.014, 0.0, abs(hy - lvl));
    float tb = max(dot(-V, Ld), 0.);
    vec3 thru = lit * 1.15 + uSky * 0.3 + uGlowCol * (0.5 * area + 0.9 * tb * tb * tb * 900. / (dd + 900.));
    vec3 body = mix(vCol * 0.11, mix(vCol, sat, 0.55) * (0.56 + 0.3 * seedN + 0.42 * smoothstep(0.72, 1., nv) * isB), core);
    body *= (1. - 0.42 * wet) * (1. - 0.35 * isB * smoothstep(0.06, 0.0, hy));
    vec3 g = body * thru * (1. + 0.7 * men);
    vec2 Nh = N.xz / max(length(N.xz), 1e-3), Lh = Ld.xz / max(length(Ld.xz), 1e-3);
    float fo = max(-dot(Nh, Lh), 0.); fo *= fo; fo *= fo;
    g += sat * (uSky * 0.45 + uGlowCol * (0.2 + 2. * area)) * fo * core * isB * 0.5;
    vec3 Hd = normalize(Ld + V + vec3(0., 1e-5, 0.));
    vec2 Hx = Hd.xz / max(length(Hd.xz), 1e-3);
    float s1 = max(dot(Nh, Hx), 0.), s16 = s1 * s1; s16 *= s16; s16 *= s16; s16 *= s16;
    float farK = smoothstep(14., 70., vWD);                       // far off the streak is wider and fainter, so it does not sparkle
    float hl = pow(s16, mix(11., 2., farK)) * mix(1., 0.3, farK) * smoothstep(0.98, 0.55, abs(N.y)) * isB;
    float hp = (1. - isB) * pow(max(dot(N, Hd), 0.), 40.);
    g += (uGlowCol * 0.6 + uSky * 0.8 + 0.06) * (hl * 2.3 + hp * 0.8);
    // the same door seen again on the far wall of the bottle, through the glass: fainter, softer, in the bottle's colour
    vec2 Vh = V.xz / max(length(V.xz), 1e-3), Hm = 2. * dot(Hx, Vh) * Vh - Hx;
    float s2 = max(dot(Nh, Hm), 0.); s2 *= s2; s2 *= s2; s2 *= s2; s2 *= s2;
    g += mix(sat, vec3(1.), 0.25) * (uGlowCol * 0.5 + uSky * 0.6) * s2 * s2 * s2 * 0.55 * isB * core * (1. - 0.7 * farK);
    g += uSunCol * pow(max(dot(N, Hh), 0.), 80.) * sun * step(0., ndl) * 0.7 + uLampCol * fl * fl * pow(max(dot(R, tl / dl), 0.), 30.) * 0.5;
    g += uGlowCol * glm * (sat * 0.5 * core + 0.35 * pow(max(dot(R, vec3(0.42, 0.2, 0.88)), 0.), 6.));       // the squall's gleam, through it and on it
    col = g;
  }
  // night, by the moon: every plate, bowl, bottle and pot that stands in the wall has a dark body and a blue-white rim on the
  // moon's side: a plate's turned lip (rimP), a round piece where it turns more than 60 degrees from the eye, on the half that
  // faces the moon. (By day uBody is 1 and uRim nothing. The lamp on the arch's sill is by lamplight and is left out.)
  float piece = min(step(5.5, mat) * step(mat, 7.5) + brass, 1.) * step(vL.z, -109.6) * (1. - step(abs(vL.x), 10.4) * step(7.9, vL.y));
  float rimR = smoothstep(0.5, 0.2, clamp(dot(N, V), 0., 1.)) * smoothstep(-0.3, 0.3, dot(N, L));
  col = col * mix(1., uBody, piece) + uRim * max(rimP, rimR) * piece;
  col = mix(col, uHaze, 1. - exp(-vWD * uHazeK));
  gl_FragColor = vec4(col, 1.);
}`,Dt=`
uniform mat4 uToLocal;
varying vec3 vL, vC;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.);
  vL = (uToLocal * wp).xyz; vC = (uToLocal * vec4(cameraPosition, 1.)).xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,Bt=`
uniform vec3 uTop, uHor, uWater, uDeep, uSunDir, uSunCol, uSail, uGrey;
uniform vec4 uEye;       // z, y of the eye on the plane x = 62; presence; lid
uniform float uTime, uStars, uWind, uDhow, uFleet, uBats, uShimmer, uGain, uGlit, uSailK;
varying vec3 vL, vC;
${N0}
void main() {
  vec3 d = normalize(vL - vC + vec3(1e-5, 0., 0.));
  d.y += uShimmer * 0.003 * sin(d.z * 140. + uTime * 6.) * smoothstep(0.12, 0.0, abs(d.y));
  float el = d.y / max(length(d.xz), 1e-3);
  float east = step(0., d.x);
  // sky: gradient, drifting cloud streaks, the sun's glow
  vec3 col = mix(uHor, uTop, smoothstep(0., 0.6, sqrt(max(el, 0.))));
  vec2 cp = vec2(d.z / max(abs(d.x) + abs(d.y), 0.2) * 2.4 + uTime * 0.012 * (1. + 4. * uWind), el * 7.);
  float cl = smoothstep(0.48, 0.8, fbm(cp)) * smoothstep(0.0, 0.12, el);
  col = mix(col, mix(uHor * 1.15, uTop * 0.5, uWind * uWind), cl * (0.45 + 0.4 * uWind));
  vec3 S = normalize(uSunDir + vec3(0., 1e-5, 0.));
  float sd = max(dot(d, S), 0.), sd4 = sd * sd * sd * sd, sd16 = sd4 * sd4 * sd4 * sd4;
  col += uSunCol * (0.04 * sd4 + 0.12 * sd16 * sd16 + 1.4 * smoothstep(0.9993, 0.9997, sd)) * (1. - uStars);
  // stars turning about the pole, and the Milky Way
  float ca = cos(uTime * 0.012), sa = sin(uTime * 0.012);
  vec3 sdir = vec3(d.x, d.y * ca - d.z * sa, d.y * sa + d.z * ca), q = sdir * 70., ci = floor(q);
  float hs = h21(ci.xy + ci.z * 17.3), star = step(0.975, hs) * smoothstep(0.45, 0.05, length(fract(q) - 0.5));
  float mw = dot(sdir, vec3(0.42, -0.35, 0.84)); mw = exp(-mw * mw * 14.) * (0.35 + 0.65 * fbm(sdir.zy * 6. + sdir.x * 3.));
  vec3 night = vec3(0.75, 0.82, 1.) * star * (0.5 + 3. * fract(hs * 77.)) * (0.55 + 0.45 * sin(uTime * (2. + 5. * fract(hs * 31.)) + hs * 90.))
    + vec3(0.2, 0.24, 0.42) * mw * (0.6 + 2.2 * step(0.93, h21(floor(q.xy * 2.3) + floor(q.z * 2.3) * 7.1)));
  col += night * uStars * smoothstep(-0.01, 0.08, el);
  if (el < 0.) {
    float t = (vC.y + 34.) / max(-d.y, 1e-3);
    vec2 sp = vC.xz + d.xz * t;
    vec3 sea = mix(uDeep, uWater, exp(el * 7.));
    float w1 = vn(sp * vec2(0.035, 0.11) + vec2(uTime * 0.25, uTime * 0.06)), w2 = vn(sp * vec2(0.3, 0.7) + vec2(-uTime * 0.6, uTime * 0.3));
    sea *= 0.82 + 0.3 * w1;
    float glit = w2 * vn(sp * vec2(0.9, 2.2) + vec2(uTime * 1.4, -uTime * 0.8));
    sea += (uSunCol * 0.5 + uHor * 0.5) * smoothstep(0.42, 0.75, glit) * uGlit * (0.3 + 1.4 * exp(el * 5.));
    float foam = smoothstep(0.8 - 0.3 * uWind, 0.95, vn(sp * vec2(0.05, 0.22) + vec2(uTime * 0.7, 0.)) + 0.15 * w2) * uWind;
    sea = mix(sea, uHor * 1.1 + 0.1, foam * 0.85);
    sea = mix(sea, uHor, exp(el * 70.) * 0.7);
    col = mix(uDeep * 0.22 + uTop * 0.05, sea, east);      // west of the house: roofs in shade
  }
  // dhows working along the horizon
  float kx = 1. / max(d.x, 1e-3);
  // uDhow is where the sail stands in the sea door (metres along the door from its middle) as seen from wherever we are
  float lead = (560. - vC.x) / max(35. - vC.x, 4.);
  float z0 = vC.z + (-80. + uDhow + 1.6 * sin(uTime * 0.06) - vC.z) * lead;
  for (int i = 0; i < 7; i++) {
    float fi = float(i), on = step(fi, 0.5 + 6. * uFleet);
    vec3 D = vec3(560. + 55. * fi, -34., z0 + fi * 83. - 250. * uFleet * step(0.5, fi));
    float k = (D.x - vC.x) * kx;
    vec2 s = vec2(vC.z + d.z * k - D.z, vC.y + d.y * k - D.y) / uSailK;
    s.y -= 1.2 * sin(uTime * 1.1 + fi * 2.) * (1. + 2. * uWind); s.x -= s.y * (0.05 + uWind * 0.32 + 0.03 * sin(uTime * 0.8 + fi));
    float hull = rect(s, vec2(-30., 0.), vec2(38., 6.), 0.5) * step(-s.y, (s.x + 30.) * 0.5);
    float sail = step(8., s.y) * step(s.y, 8. + (s.x + 32.) * 2.3) * step(s.y, 8. + (38. - s.x) * 1.25);
    float mast = rect(s, vec2(-9., 5.), vec2(-6.6, 70.), 0.4);
    float shade = 0.5 + 0.5 * smoothstep(-30., 24., s.x) + 0.07 * sin(s.x * 0.9) - 0.12 * smoothstep(30., 8., s.y);
    col = mix(col, uDeep * 0.1, mast * on * east);
    col = mix(col, uSail * shade, sail * on * east);
    col = mix(col, uDeep * 0.12, hull * on * east);
  }
  // bats: six crossing the sea door, three passing the west windows against the last of the light
  float kb = (44. - vC.x) * kx, kw = (-40.5 - vC.x) / min(d.x, -1e-3);
  vec2 hb = vec2(vC.z + d.z * kb, vC.y + d.y * kb), hw = vec2(vC.z + d.z * kw, vC.y + d.y * kw);
  for (int i = 0; i < 9; i++) {
    float fi = float(i), tt = uTime * (7. + fi * 1.3) + fi * 23., wst = step(5.5, fi);
    vec2 pe = vec2(-97. + mod(tt, 34.), 14.5 + fi * 1.8 + 2.4 * sin(tt * 0.31 + fi * 2.1));
    vec2 pw = vec2(-108. + mod(tt * 0.8, 46.), 28. + (fi - 6.) * 3.6 + 2.4 * sin(tt * 0.27 + fi * 2.1));
    vec2 b = mix((hb - pe) / 3.1, (hw - pw) / 1.9, wst);
    float ax = abs(b.x), flap = 0.75 * sin(uTime * (15. + fi) + fi * 1.7);
    float wing = step(ax, 1.7) * smoothstep(0.34, 0.22, abs(b.y - flap * ax + 0.25 * ax * ax) / max(1.05 - ax * 0.5, 0.1));
    float body = smoothstep(0.42, 0.3, length(b * vec2(1.6, 1.)));
    col = mix(col, vec3(0.012, 0.008, 0.02), max(wing, body) * uBats * mix(east * (1. - uEye.z), 1. - east, wst));   // none before the visitor's face
  }
  // the rare visitor: a grey feathered head as big as the house fills the sea door, and one pale eye looks in
  float ke = (62. - vC.x) * kx;
  vec2 he = vec2(vC.z + d.z * ke, vC.y + d.y * ke) - uEye.xy;
  float pres = uEye.z * east;
  if (pres > 0.001) {
    // the head is a ball 23 m in radius whose middle stands below and behind the eye, so its crown shows against the sky
    vec2 hc = he - vec2(6., -8.);
    float hr = length(hc) / 23., hr1 = min(hr, 0.999), dome = sqrt(1. - hr1 * hr1);
    float r = length(he), ang = atan(he.y, he.x + 1e-4);
    // lit from the upper left by the last of the sun; the far side and the rim fall to shadow
    float ball = clamp(0.08 + 0.95 * dot(vec3(hc / 23., dome), vec3(-0.5, 0.48, 0.72)), 0.035, 1.) * (0.3 + 0.7 * dome);
    // scalloped feathers in offset rows laid over the ball, so they crowd together and darken toward its edge
    vec2 sp = hc * (asin(hr1) / max(hr1, 1e-3));
    vec2 f = vec2(sp.x / 3.7 + 0.5 * floor(sp.y / 2.35), sp.y / 2.35), ff = fract(f) - vec2(0.5, 1.);
    float fd = length(ff * vec2(1., 0.62));
    float feather = 0.4 + 0.8 * smoothstep(0.12, 0.5, fd) - 0.55 * smoothstep(0.5, 0.6, fd) - 0.08 * smoothstep(0.05, 0.0, abs(ff.x)) * step(fd, 0.5);
    vec3 head = (uGrey + 0.03) * mix(0.75, feather, 0.35 + 0.65 * dome) * (0.9 + 0.25 * fbm(sp * 0.07));
    // the bare pale face round the eye: creased outward from it, wrinkled in rings, sinking into a socket
    vec2 hn = he / max(r, 0.01);
    float skin = smoothstep(9.5, 6.2, length(he * vec2(0.85, 1.)));
    // creases that run with the line the lids close on, not rings
    float wr = sin((he.y + 0.5 + 0.055 * he.x * he.x) * 2.3 + 1.7 * vn(he * 0.6 + 1.)) * smoothstep(4.6, 6.4, r) * (0.45 + 0.55 * smoothstep(9.5, 5.5, r));
    vec3 skinC = (uGrey * 1.45 + 0.06) * (0.82 + 0.2 * vn(hn * 4.5 + 3.) + 0.1 * vn(he * 1.6) + 0.13 * wr);
    head = mix(head, skinC * (0.58 + 0.42 * smoothstep(4.6, 7.6, r)), skin);
    // the dark hooked beak under the eye, where the gap between the curtains shows it: a horn crescent with a pale ridge,
    // curving over and down to its point
    vec2 bk = he - vec2(-4.5, -13.);
    float bl = length(bk), beak = smoothstep(7.9, 7.4, bl) * smoothstep(4.9, 5.5, length(bk - vec2(3.7, -5.6))) * smoothstep(5.6, 5.0, bk.y);
    vec3 horn = vec3(0.022, 0.022, 0.028) + (uGrey + 0.05) * (0.34 * smoothstep(6.3, 7.5, bl) * smoothstep(-6., 5., bk.y) + 0.2 * smoothstep(0.3, 0.0, abs(bl - 6.6)));
    head = mix(head, horn, beak);
    head *= 1. - 0.55 * smoothstep(1.5, 0., bl - 7.9) * (1. - beak) * smoothstep(5.6, 5.0, bk.y);                           // the beak's shadow on the feathers
    // the lids: grey skin over the ball of the eye, closing from above and below onto one curved crease
    float shp = sqrt(max(1. - he.x * he.x / 21.2, 0.)), yc = -0.5 - 0.055 * he.x * he.x;
    float yHi = mix(4.5 * shp, yc, uEye.w), yLo = mix(-4.5 * shp, yc, uEye.w);
    float eyeOpen = smoothstep(0., 0.3, he.y - yLo) * smoothstep(0., 0.3, yHi - he.y) * step(abs(he.x), 4.6);
    float lidZone = smoothstep(5.9, 5.2, r), dl = he.y > yc ? he.y - yHi : yLo - he.y;
    vec3 lidC = skinC * (0.72 + 0.3 * sqrt(max(1. - r * r / 36., 0.))) * (0.93 + 0.07 * sin(dl * 3.4 + 1.) + 0.08 * vn(he * 2.2)) * (0.82 + 0.3 * smoothstep(-3.5, 3.5, he.y));
    lidC *= 1. - 0.7 * smoothstep(mix(0.45, 1.0, uEye.w), 0.0, abs(dl)) * step(abs(he.x), 4.9);                           // the dark edges of the lids
    // the eye: a pale yellow iris with fine fibres and a dark rim, a small pupil that tightens, a wet glint
    float pin = 1.2 + 0.36 * sin(uTime * 2.1) * sin(uTime * 0.83 + 1.);
    vec3 iris = vec3(1.0, 0.84, 0.3) * (0.8 + 0.2 * sin(ang * 43. + 2.5 * vn(he * 1.3))) * mix(1.15, 0.22, smoothstep(2.6, 4.3, r));
    iris = mix(iris, vec3(1.0, 0.93, 0.6), smoothstep(pin + 1.1, pin + 0.1, r) * 0.6);
    iris *= 0.7 + 0.3 * sqrt(max(1. - r * r / 23., 0.));
    vec3 eye = mix(iris, vec3(0.006, 0.006, 0.01), smoothstep(pin + 0.14, pin - 0.14, r));
    eye *= 0.4 + 0.6 * smoothstep(0.0, 2.4, yHi - he.y);                                                                  // the upper lid's shadow
    eye += vec3(0.95, 0.97, 1.) * (1.6 * smoothstep(0.62, 0.3, length((he - vec2(-1.2, 1.7)) * vec2(1., 1.5))) + 0.25 * smoothstep(0.5, 0.2, length(he - vec2(1.3, -1.5))));
    head = mix(head, lidC, lidZone) * ball;
    head = mix(head, eye * (1.2 + 0.7 * ball), eyeOpen * smoothstep(4.6, 4.4, r));
    float edge = smoothstep(1.0, 0.94, hr + 0.035 * vn(he * 0.35));
    col = mix(col, head * (uHor * 0.6 + 0.42), pres * edge);
  }
  gl_FragColor = vec4(col * uGain, 1.);
}`,Ht=`
attribute vec3 aInfo;       // t along the beam, opening id (0 sea door, 1 roof grille, 2 west windows, 3 shutters), s across the sheet
uniform mat4 uToLocal;
uniform vec3 uSunDir;
uniform vec4 uShaft;
varying vec3 vInfo, vL, vC;
varying vec2 vO;
varying float vStr, vWD;
void main() {
  vec3 L = normalize(uSunDir + vec3(0., 1e-5, 0.));
  float id = aInfo.y;
  float facing = id < 0.5 || id > 2.5 ? step(0.05, L.x) : (id < 1.5 ? step(0.05, L.y) : step(0.05, -L.x));
  float len = min(position.y / max(L.y, 0.12), 96.);
  vec3 p = position - L * len * aInfo.x;
  vStr = uShaft[int(id + 0.5)] * facing;
  vInfo = aInfo; vO = id > 0.5 && id < 1.5 ? position.xz : position.zy;
  vec4 wp = modelMatrix * vec4(p * step(0.001, vStr), 1.);
  vL = (uToLocal * wp).xyz; vWD = distance(cameraPosition, wp.xyz); vC = (uToLocal * vec4(cameraPosition, 1.)).xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,qt=`
uniform vec3 uShaftCol;
uniform float uTime, uLace;
varying vec3 vInfo, vL, vC;
varying vec2 vO;
varying float vStr, vWD;
${N0}
void main() {
  float t = vInfo.x, s = vInfo.z, id = vInfo.y;
  // where this line of sight meets the niche wall: inside the great arch there is only the dark, and the low sunset beams
  // from the west windows, which would lie across it as a haze with a hard edge, are not drawn over it
  vec3 dv = vL - vC;
  vec2 hit = vC.xy + dv.xy * ((-110. - vC.z) / min(dv.z, -1e-3));
  float hw = hit.y < 26. ? 10. : 10. * sqrt(max(1. - (hit.y - 26.) * (hit.y - 26.) / 100., 0.));
  float inArch = smoothstep(hw + 0.8, hw - 0.8, abs(hit.x)) * smoothstep(7.2, 8.8, hit.y) * step(dv.z, 0.) * step(-110., vC.z) * step(1.5, id) * step(id, 2.5);
  float a = vStr * (1. - t) * (0.35 + 0.65 * (1. - t)) * smoothstep(0., 0.1, s) * smoothstep(1., 0.9, s);
  float pencil = 0.5 + 0.5 * sin(vO.x * 2.9 + sin(vO.y * 1.7) * 0.8);
  a *= mix(1., 0.35 + 1.1 * pencil * pencil, (id > 0.5 && id < 1.5 ? uLace : max(step(2.5, id), 0.45)));
  a *= 0.6 + 0.55 * vn(vL.xy * 0.22 + vec2(uTime * 0.3, -uTime * 0.2)) * vn(vL.zy * 0.6 + uTime * 0.45);
  a *= smoothstep(1.5, 14., vWD) * smoothstep(-109.6, -107., vL.z) * smoothstep(35.4, 34., abs(vL.x)) * smoothstep(-0.3, 1.2, vL.y);
  gl_FragColor = vec4(uShaftCol * a * 0.085 * (1. - 0.94 * inArch), 1.);
}`,Ft=`
attribute vec3 aInfo;       // t along the beam, opening id (as the shafts), a random number
attribute vec2 aCorner;
uniform mat4 uToLocal;
uniform vec3 uSunDir;
uniform vec4 uShaft;
uniform float uTime;
varying vec2 vC;
varying float vA;
void main() {
  vec3 L = normalize(uSunDir + vec3(0., 1e-5, 0.));
  float id = aInfo.y, sd = aInfo.z;
  float facing = id < 0.5 || id > 2.5 ? step(0.05, L.x) : (id < 1.5 ? step(0.05, L.y) : step(0.05, -L.x));
  float len = min(position.y / max(L.y, 0.12), 96.);
  float t = fract(aInfo.x + uTime * 0.003 * (0.4 + sd));
  vec3 p = position - L * len * t;
  p += vec3(sin(uTime * 0.31 + sd * 40.), 0.6 * cos(uTime * 0.23 + sd * 17.), sin(uTime * 0.27 + sd * 29.)) * 0.7;
  float inRoom = smoothstep(-109.6, -107., p.z) * smoothstep(35.2, 33.5, abs(p.x)) * smoothstep(0.1, 1.2, p.y) * smoothstep(0.5, -1.5, p.z);
  vec4 wp = modelMatrix * vec4(p, 1.);
  float dist = distance(cameraPosition, wp.xyz);
  // never smaller than a pixel or so: a far mote is drawn larger and fainter instead of flickering
  float base = (0.05 + 0.07 * fract(sd * 7.7)) * length(modelMatrix[0].xyz), size = max(base, dist * 0.0021);
  float tw = 0.55 + 0.45 * sin(uTime * (1.5 + 3. * fract(sd * 3.3)) + sd * 60.);
  vA = min(uShaft[int(id + 0.5)] * facing * 1.4, 1.3) * inRoom * (1. - 0.6 * t) * tw * (base * base) / (size * size) * smoothstep(1., 4., dist);
  vC = aCorner;
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  wp.xyz += (right * aCorner.x + up * aCorner.y) * size * step(0.002, vA);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,Vt=`
uniform vec3 uShaftCol;
varying vec2 vC;
varying float vA;
void main() {
  gl_FragColor = vec4(uShaftCol * smoothstep(1., 0.15, dot(vC, vC)) * vA * 0.6, 1.);
}`,Nt=`
attribute vec3 aSeed;       // speed, phase, size (three random numbers)
attribute vec2 aCorner;
uniform float uTime;
uniform vec3 uRoomCol, uDoorCol;
uniform vec4 uDoorAt;       // the model's door: its centre in this room's metres, its width
varying vec2 vC;
varying vec3 vCol;
void main() {
  float sp = 0.6 + 1.4 * aSeed.x;
  float a = 6.5 + mod(position.z - uTime * sp, 13.5);        // metres behind the arch's face
  vec3 p = vec3(position.x + 0.6 * sin(uTime * 0.31 + aSeed.y * 40.), position.y + 0.4 * cos(uTime * 0.23 + aSeed.y * 17.), -110. - a);
  float ends = smoothstep(6.5, 8., a) * smoothstep(20., 18., a);
  float r = length(vec2(max(abs(p.x) - 10., 0.), max(p.y - 36., 0.) + max(8. - p.y, 0.)));
  float room = exp(-(a - 6.) / 9.) * exp(-r / (2. + 0.35 * a));
  vec3 dv = p - uDoorAt.xyz;
  float door = max(1. - length(dv) / max(1.5 * uDoorAt.w, 1e-3), 0.); door *= door;
  vec4 wp = modelMatrix * vec4(p, 1.);
  float sc = length(modelMatrix[0].xyz);
  vec3 toC = wp.xyz - cameraPosition; float dist = length(toC);
  vec3 vd = toC / max(dist, 1e-4), ax = normalize(modelMatrix[2].xyz + vec3(0., 0., 1e-6));
  vec3 right = cross(ax, vd); float rl = length(right);
  right = rl > 0.02 ? right / rl : normalize(cross(vec3(0., 1., 0.), vd) + vec3(1e-5, 0., 0.));
  vec3 up = cross(vd, right); up *= dot(up, ax) < 0. ? -1. : 1.;
  // never smaller than a pixel or so: a far mote is drawn larger and fainter instead of flickering
  float base = (0.045 + 0.05 * aSeed.z) * sc, size = max(base, dist * 0.0026);
  float tw = 0.6 + 0.4 * sin(uTime * (1.2 + 2.6 * fract(aSeed.y * 7.7)) + aSeed.y * 60.);
  vCol = (uRoomCol * room + uDoorCol * door) * ends * tw * (base * base) / (size * size) * smoothstep(1., 4., dist);
  vC = aCorner;
  float on = step(0.002, dot(vCol, vec3(1.)));
  wp.xyz += (right * aCorner.x * size + (ax * (0.25 * sp * sc) + up * size) * aCorner.y) * on;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,Rt=`
varying vec2 vC;
varying vec3 vCol;
void main() {
  gl_FragColor = vec4(vCol * smoothstep(1., 0.15, dot(vC, vC)), 1.);
}`,It=`
attribute vec3 color;
attribute vec4 aUV, aPiv;
uniform float uLevel;
varying vec3 vCol;
varying vec4 vUV;
varying float vK, vId, vWD;
void main() {
  // the same draw as the room shader makes for its china: the pool leaves with the bottle
  float id = fract(sin(dot(aPiv.xyz, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
  float gone = step(fract(id * 7.31 + uLevel * 0.37), 0.13);
  vec4 wp = modelMatrix * vec4(mix(position, aPiv.xyz, gone), 1.);
  vCol = color; vUV = aUV; vK = aPiv.w * (1. - gone); vId = id;
  vWD = distance(cameraPosition, wp.xyz);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,Et=`
uniform vec3 uPool;
uniform float uTime, uHazeK;
varying vec3 vCol;
varying vec4 vUV;
varying float vK, vId, vWD;
void main() {
  float r2 = dot(vUV.xy, vUV.xy);
  vec2 e = smoothstep(vec2(1.), vec2(0.6), abs(vUV.zw));
  float a = exp(-r2 * 2.7) * e.x * e.y;
  // the bright thread the round glass gathers, wavering a little
  float cx = vUV.x * 3.4 + 0.45 * sin(vUV.y * 3.1 + vId * 20. + 0.4 * sin(uTime * 0.7 + vId * 9.));
  float thread = exp(-cx * cx) * smoothstep(1.1, 0.1, abs(vUV.y));
  float tw = 0.86 + 0.14 * sin(uTime * 0.9 + vId * 40.);
  gl_FragColor = vec4(vCol * uPool * (a * (0.75 + 0.85 * thread)) * vK * tw * exp(-vWD * uHazeK), 1.);
}`;class R0 extends pt{constructor(t){super(t),this.piv=new Float32Array(t*12)}put(t,s,f,r={}){const u=this.n;if(this.add(t,s,f,r),r.piv)for(let i=u;i<this.n;i++)this.piv.set(r.piv,i*4);return this}build(){const t=super.build();return t.setAttribute("aPiv",new a.BufferAttribute(this.piv.slice(0,this.n*4),4)),t}}const $e=new a.Matrix4,ee=(e,t,s=.08)=>e.clone().multiplyScalar(1+(t()-.5)*2*s),Se=e=>{const t=new a.Shape;t.moveTo(e[0][0],e[0][1]);for(let s=1;s<e.length;s++)t.lineTo(e[s][0],e[s][1]);return t.closePath(),t},A0=(e,t,s,f,r)=>{const u=new a.Path;ft(u,e,t,s,r,6,!0);for(const i of u.curves)i.v1.x+=f,i.v2.x+=f;return u},g0=(e,t)=>Te(new a.ExtrudeGeometry(e,{depth:t,bevelEnabled:!1,curveSegments:1}));function tt(e,t,s,f,r,u,i,x,S,m){const g=I(1,S-x+1.4,1.5,.22),L=I(1,1.7,u-i+4.4,.25);for(const R of[u+.75,i-.75])e.put(g,y(f,(x+S+1.4)/2,R),ee(t.wood,s),{mat:De});e.put(L,y(f,S+1.5,(u+i)/2),ee(t.wood,s),{mat:De});const P=Math.max(3,Math.round((u-i)/3.4));for(let R=0;R<P;R++)e.put(m,y(f+r*.5,S+1.5,i+(R+.5)*(u-i)/P,0,r*Math.PI/2,0,.72),ee(t.woodLight,s),{mat:ze});g.dispose(),L.dispose()}async function _t(e,t,s,f,r){e.put(u0([-C,0,2],[C+3,0,2],[C+3,0,-xe-.5],[-C,0,-xe-.5]),$e,t.floor,{mat:vt});const u=Se([[-C,0],[C,0],[C,se],[-C,se]]);u.holes.push(Se([[-8,7],[-8,29],[8,29],[8,7]]));const i=Te(new a.ShapeGeometry(u));e.put(i,y(0,0,0,0,Math.PI,0),t.lime),i.dispose(),e.put(u0([8,0,0],[-8,0,0],[-8,7,0],[8,7,0]),$e,t.lime),await r();const x=Se([[0,0],[70,0],[70,24],[90,24],[90,0],[xe,0],[xe,se],[0,se]]);x.holes.push(A0(12,12,4,52,9),A0(10,12,4,101,9));const S=g0(x,2.4);e.put(S,y(C,0,0,0,Math.PI/2,0),t.lime,{ao:z=>z>C+.2?.7:1}),S.dispose(),await r();const m=Se([[0,0],[42,0],[42,18],[54,18],[54,0],[xe,0],[xe,se],[0,se]]);m.holes.push(A0(12,12,4,16,24),A0(12,12,4,34,24));const g=g0(m,2.4);e.put(g,y(-C,0,-xe,0,-Math.PI/2,0),t.lime,{ao:z=>z<-C-.2?.7:1}),g.dispose(),e.put(u0([-C-2.3,0,-56],[-C-2.3,0,-68],[-C-2.3,18,-68],[-C-2.3,18,-56]),$e,t.dark),await r();const L=Se([[-C,-xe],[C,-xe],[C,0],[-C,0]]);L.holes.push(Se([[-10,-70],[-10,-40],[10,-40],[10,-70]]));const P=Te(new a.ShapeGeometry(L));e.put(P,y(0,se,0,Math.PI/2,0,0),t.lime.clone().multiplyScalar(.55)),P.dispose(),e.put(u0([-10,se+.5,-40],[10,se+.5,-40],[10,se+.5,-70],[-10,se+.5,-70]),y(0,2*se+1,0,0,0,0,1,-1,1),t.wood,{mat:wt}),await r();const R=Te(new a.CylinderGeometry(.42,.5,2*C,6,1,!0)),B=Math.round(46*(.6+.4*f));for(let z=0;z<B;z++){const $=-(z+.5)*(xe/B),oe=$<-39&&$>-71,me=ee(t.pole,s,.22);if(!oe)e.put(R,y(0,se-.55,$,0,s()*.02,Math.PI/2+(s()-.5)*.02),me,{mat:ze});else for(const H of[-1,1])e.put(R,y(H*22.6,se-.55,$,0,0,Math.PI/2,1,.354,1),me,{mat:ze})}R.dispose();const V=I(1.6,2,xe,.3),X=I(21.6,1.3,1.3,.25),O=I(1.3,1.3,31.6,.25);for(const z of[-23,23])e.put(V,y(z,se-2,-xe/2),ee(t.wood,s,.1),{mat:De});for(const z of[-39.8,-70.2])e.put(X,y(0,se-.7,z),t.wood,{mat:De});for(const z of[-10.4,10.4])e.put(O,y(z,se-.7,-55),t.wood,{mat:De});V.dispose(),X.dispose(),O.dispose(),await r();for(let z=0;z<7;z++){const $=I(21-z*.2,1,z===0?3.4:1.5,.16);if(e.put($,y(0,6.5-z,z===0?-1.7:-3.4-(z-.5)*1.5),ee(z%2?t.stone:t.lime,s,.05)),$.dispose(),z>0){const oe=I(20.6,1,3.4+(z-1)*1.5,.1);e.put(oe,y(0,6.5-z,-(3.4+(z-1)*1.5)/2),t.stone),oe.dispose()}}const ne=I(.9,.16,2.3,.07),Y=I(.9,.5,.2,.08);for(const[z,$,oe]of[[5.2,-1.6,.3],[6.5,-1.2,-.15]])e.put(ne,y(z,7.08,$,0,oe,0),t.leather,{mat:ze}),e.put(Y,y(z-Math.sin(oe)*.4,7.3,$-.45,.5,oe,0),t.rose,{mat:ze});ne.dispose(),Y.dispose(),await r();const J=U0(8);tt(e,t,s,C-.2,-1,-70,-90,0,24,J),tt(e,t,s,-C+.2,1,-56,-68,0,18,J);const A=I(1.6,.8,14,.2);for(const z of[-52,-101])e.put(A,y(C-.3,8.7,z,0,0,0,1,1,z<-80?.86:1),ee(t.stone,s)),e.put(u0([C+1.2,8,z-7],[C+1.2,8,z+7],[C+1.2,26,z+7],[C+1.2,26,z-7]),$e,t.blue,{mat:mt});for(const z of[-94,-76])e.put(A,y(-C+.3,23.7,z),ee(t.stone,s));const te=re([[.16,0],[.22,.1],[.14,.2],[.14,.45],[.24,.5],[.14,.55],[.14,.9],[.2,1]],5);for(const z of[-94,-76])for(let $=-2;$<=2;$++)e.put(te,y(-C-1.2,24,z+$*2,0,0,0,1,12+4*(1-Math.abs($)/2.6),1),ee(t.wood,s,.15),{mat:ze});const Q=I(1.5,23.4,1,.22),ve=I(20.4,1.7,1,.25);for(const z of[-8.75,8.75])e.put(Q,y(z,18.7,-.45),ee(t.wood,s),{mat:De});e.put(ve,y(0,30.5,-.45),ee(t.wood,s),{mat:De});for(let z=0;z<5;z++)e.put(J,y(-6.8+z*3.4,30.5,-.95,0,Math.PI,0,.72),ee(t.woodLight,s),{mat:ze});Q.dispose(),ve.dispose(),A.dispose(),te.dispose(),J.dispose()}function k0(e,t,s,f,r=0,u=0,i=5){const x=[[t/2,0],[t/2,s]];if(e===2)x.push([t/3,s],[t/3,s+f*.5],[t/6,s+f*.5],[t/6,s+f]);else for(let m=1;m<i;m++){const g=m/i,L=e===1?.8+.2*Math.abs(Math.cos(g*Math.PI*1.5)):1-.18*Math.sin(g*Math.PI);x.push([t/2*Math.cos(g*Math.PI/2)*L,s+f*Math.pow(Math.sin(g*Math.PI/2),.85)])}const S=[[-t/2,0],...x];e!==2&&S.push([0,s+f]);for(let m=x.length-1;m>=1;m--)S.push([-x[m][0],x[m][1]]);return S.map(m=>[m[0]+r,m[1]+u])}async function Wt(e,t,s,f,r){const u=[],i=-xe,x=1.9,S=(n,c,M,b)=>u.push({x:n,y:c,w:M,hs:3+.5*s(),rise:1.9+.5*s(),kind:(b+Math.round(Math.abs(n)/4.3))%3,tier:b,near:n<-8&&b<=2,seg:n<-8&&b<=2?14:7});for(let n=0;n<16;n++)S(-31.5+n*4.2,1.5,3.1,0);for(let n=1;n<=4;n++)for(let c=0;c<5;c++)for(const M of[-1,1])S(M*(13.6+c*4.3),1.6+n*7.9,3.2+.5*((c+n)%2),n);S(-9.2,34.6,2.4,4),S(9.2,34.6,2.4,4),S(-3.6,37.6,2.8,5),S(3.6,37.6,2.8,5);const m=k0(0,20,18,10,0,8,12),g=m.findIndex(n=>Math.abs(n[0])<1e-6);for(const n of u)n.tier===5&&(n.hs=2.4,n.rise=1.5),n.tier===0&&(n.hs-=.5,n.rise-=.3);const L=[[[0,0],[C,0],[C,se],[0,se],...m.slice(1,g+1).reverse(),[0,8]],[[0,0],[0,8],m[0],...m.slice(g).reverse(),[0,se],[-C,se],[-C,0]]];for(let n=0;n<2;n++){const c=Se(L[n]);for(const b of u)b.x>0==(n===0)&&c.holes.push(Se(k0(b.kind,b.w,b.hs,b.rise,b.x,b.y,b.seg)));await r();const M=g0(c,x);await r(),e.put(M,y(0,0,i-x),t.lime,{ao:(b,T,ue)=>ue<i-.2?.5:1}),M.dispose(),await r()}const P=Se([[-C,0],[C,0],[C,se],[-C,se]]);P.holes.push(Se(m));const R=Te(new a.ShapeGeometry(P));e.put(R,y(0,0,i-x+.02),t.lime.clone().lerp(t.violet,.25).multiplyScalar(.62)),R.dispose();const B=Se([[-13,5],[13,5],[13,39],[-13,39]]);B.holes.push(Se(m));const V=g0(B,6-x);e.put(V,y(0,0,i-6),t.lime,{ao:(n,c,M)=>.3+.7*le(i-6,i-x,M)}),V.dispose(),await r();for(let n=0;n<u.length;n++){const c=u[n],M=k0(c.kind,c.w,c.hs,c.rise,c.x,c.y,c.seg),b=Se(k0(c.kind,c.w+1.1,c.hs+.35,c.rise+.5,c.x,c.y-.3,c.seg));b.holes.push(Se(M));const T=c.near?Te(new a.ExtrudeGeometry(b,{depth:.14,bevelEnabled:!0,bevelSize:.05,bevelThickness:.05,bevelOffset:-.05,bevelSegments:1,curveSegments:1})):g0(b,.22),ue=e.n,W=M.length,K=[0];for(let Z=0;Z<W;Z++){const de=M[Z],pe=M[(Z+1)%W];K.push(K[Z]+Math.hypot(pe[0]-de[0],pe[1]-de[1]))}e.put(T,y(0,0,c.near?i-.02:i),ee(t.lime,s,.04).multiplyScalar(1.05),{mat:V0}),T.dispose();for(let Z=ue;Z<e.n;Z++){const de=e.pos[Z*3],pe=e.pos[Z*3+1];let Ge=1e9,qe=0,We=0,Oe=1;for(let Ke=0;Ke<W;Ke++){const Ve=M[Ke],Xe=M[(Ke+1)%W],Ne=Xe[0]-Ve[0],je=Xe[1]-Ve[1],ge=Ne*Ne+je*je||1,Re=Ae(((de-Ve[0])*Ne+(pe-Ve[1])*je)/ge,0,1),Ie=de-Ve[0]-Ne*Re,Ze=pe-Ve[1]-je*Re,s0=Ie*Ie+Ze*Ze;if(s0<Ge){Ge=s0,qe=K[Ke]+Math.sqrt(ge)*Re;const Ye=Math.sqrt(s0);if(Ye>.001)We=Ie/Ye,Oe=Ze/Ye;else{const Ee=1/Math.sqrt(ge);We=je*Ee,Oe=-Ne*Ee}}}let Fe=qe-c.w/2;Fe>K[W]/2&&(Fe-=K[W]),e.mh[Z*2+1]=1+Math.sqrt(Ge),e.piv[Z*4]=Math.abs(Fe),e.piv[Z*4+1]=We,e.piv[Z*4+2]=Oe,e.piv[Z*4+3]=0}(n&7)===7&&await r()}for(const[n,c,M]of[[2.6,.5,V0],[1.2,.85,Y0]]){const b=Se(k0(0,20+n*2,18+n*.3,10+n,0,8-n*.5,12));b.holes.push(Se(m));const T=Te(new a.ExtrudeGeometry(b,{depth:c,bevelEnabled:!0,bevelSize:.16,bevelThickness:.16,bevelSegments:1,curveSegments:1}));e.put(T,y(0,0,i+.05),ee(t.lime,s,.03).multiplyScalar(M===V0?1.04:1.08),{mat:M}),T.dispose()}const X=I(22.8,.5,.8,.16),O=I(68,.5,.8,.16),ne=I(24,1,1.6,.3);e.put(O,y(0,1.1,i+.3),ee(t.stone,s,.04));for(let n=1;n<=4;n++)for(const c of[-1,1])e.put(X,y(c*22.6,1.2+n*7.9,i+.3),ee(t.stone,s,.04));e.put(ne,y(0,7.5,i+.5),ee(t.stone,s,.04)),X.dispose(),O.dispose(),ne.dispose(),await r();const Y=re([[0,.07],[.55,.05],[.8,.12],[1,.22],[.98,.14],[.78,.02],[0,0]],12);Y.rotateX(Math.PI/2),Y.translate(0,1,0);const J=re([[0,0],[.45,0],[.5,.08],[.95,.5],[1,.8],[.9,.86],[.6,1.1],[.2,1.2],[.24,1.36],[0,1.42]],8),A=[[0,.07],[.3,0],[.5,0],[.555,.06],[.57,.4],[.56,.9],[.53,1.1],[.45,1.28],[.33,1.43],[.22,1.55],[.17,1.68],[.16,2.02],[.2,2.06],[.235,2.12],[.21,2.2],[.16,2.24],[0,2.24]],te=[[0,.06],[.28,0],[.42,.02],[.57,.16],[.635,.4],[.64,.6],[.58,.84],[.44,1.04],[.28,1.2],[.165,1.36],[.125,1.6],[.12,1.96],[.17,2.02],[.2,2.08],[.16,2.15],[.1,2.18],[.17,2.3],[.12,2.42],[0,2.45]],Q=(n,c)=>n.filter((M,b)=>c.includes(b)),ve=Q(A,[0,2,3,5,7,9,11,13,16]),z=Q(te,[0,2,4,6,8,10,11,13,16,18]),$={big:[re(A,22),re(te,22)],small:[re(A,12),re(te,12)],far:[re(ve,8),re(z,8)]},oe=[2.24,2.45],me=[],H=re([[0,0],[.6,0],[.7,.2],[.42,.7],[.36,1.1],[.62,1.5],[.66,1.7],[.3,2],[.1,2.3],[.14,2.42],[0,2.5]],8),ce=Te(new a.ConeGeometry(.2,1.3,5));ce.translate(0,.65,0);const fe=["#9c1024","#1f7a3c","#2A4FA8","#c98a1e","#9c1024","#2A4FA8","#6a2a62"].map(n=>he(n,.8));let G=0,E=!1;const _=(n,c,M,b,T,ue=0)=>{const W=[c,M,b,bt];if(G++,n===0)e.put(Y,y(c,M,b,-.12,ue,0,T),s()<.82?ee(t.blue,s,.2):s.pick([t.green,t.rose]),{mat:x0,hinge:T,piv:W});else if(n===1)e.put(J,y(c,M,b,0,s()*6,0,T),s()<.85?ee(t.blue,s,.2):t.green,{mat:x0,hinge:.1,piv:W});else if(n===2){const K=s()*6,Z=T*(.75+.5*s()),de=s.pick(fe),pe=G%3===1?1:0,Ge=T>1;e.put($[E?Ge?"big":"small":"far"][pe],y(c,M,b,0,K,0,T*.8,Z,T*.8),de,{mat:et,hinge:oe[pe]*Z,piv:W}),me.push({x:c,y:M,z:b,r:(pe?.64:.57)*.8*T,h:oe[pe]*Z,c:de,back:b<i-.4,big:Ge})}else e.put(H,y(c,M,b,0,0,0,T),t.brass,{mat:be,piv:W}),e.put(ce,y(c+.55*T,M+1.25*T,b,0,0,-1.05,T),t.brass,{mat:be,piv:W})},Me=[];for(let n=0;n<u.length;n++){const c=u[n],M=i-1.25,b=i-.5,T=Math.min(c.w*.4,(c.hs+c.rise*.5)*.46);if(c.tier===2&&Math.abs(Math.abs(c.x)-17.9)<.1){Me.push(c);continue}E=c.near;const ue=f.wedding?2:s()<.72?0:1;ue===2?_(2,c.x,c.y,M,1.5+.5*s()):ue===0?_(0,c.x,c.y,M,T*(.82+.18*s())):_(1,c.x,c.y,M,1.2+.4*s());const W=f.wedding?2:s.pick([0,1,1,2]),K=n%19===7?3:f.wedding?s.pick([2,2,1]):s.pick([0,1,2]);_(W,c.x-c.w*.27,c.y,b,W===0?.62+.2*s():.5+.22*s(),.25),_(K,c.x+c.w*.27,c.y,b-.1,K===0?.6+.2*s():K===3?.62:.5+.22*s(),-.25),(c.w>3.3||s()<.5)&&_(f.wedding?2:1,c.x+(s()-.5)*.5,c.y,i-.25,.34+.12*s()),(n&7)===7&&await r()}Y.dispose(),J.dispose(),H.dispose(),ce.dispose();for(const n in $)$[n].forEach(c=>c.dispose());const Le=I(2,4.2,.9,.2),Be=re([[0,.08],[.7,.06],[.82,0]],12),Ce=I(.1,1.7,.08,.03),d=re([[0,.07],[.3,.04],[.34,0]],8);Be.rotateX(Math.PI/2),d.rotateX(Math.PI/2);for(const n of Me){const c=i-.9,M=[n.x,n.y+2.2,c+.52,yt];e.put(Le,y(n.x,n.y+2.1,c),ee(t.wood,s,.1),{mat:De}),e.put(Be,y(n.x,n.y+3.1,c+.46),t.lime.clone().multiplyScalar(1.1),{mat:x0,hinge:.82,piv:[n.x,n.y+2.28,c,0]}),e.put(Ce,y(n.x,n.y+1.35,c+.52),t.brass,{mat:be,piv:M}),e.put(d,y(n.x,n.y+.55,c+.52),t.brass,{mat:be,piv:M})}return Le.dispose(),Be.dispose(),Ce.dispose(),d.dispose(),{niches:u,pieces:G,pools:me}}function Ot(e){const t=[],s=[],f=[],r=[],u=-xe,i=u-1.9+.07,x=(m,g,L,P=-1,R=1,B=-1,V=1)=>{const X=[[-1,-1],[1,-1],[1,1],[-1,1]];for(const O of[0,1,2,0,2,3])t.push(...m[O]),s.push(X[O][0],X[O][1]<0?P:R,X[O][0],X[O][1]<0?B:V),f.push(g.r,g.g,g.b),r.push(...L)};for(const m of e){const g=Math.max(m.c.r,m.c.g,m.c.b,.001),L={r:m.c.r/g,g:m.c.g/g,b:m.c.b/g},P=1.5*m.r+.22,R=Math.max(m.z-.9*m.r,u-1.8),B=u+.13,V=m.x-.3*m.r,X=m.y+.035,O=m.big?1.3:.9,ne=.3*m.r;if(x([[V-P-ne,X,B],[V+P-ne,X,B],[V+P,X,R],[V-P,X,R]],L,[m.x,m.y,m.z,O],-.75,1.2,0,1),m.y<33&&x([[V-P-1.5*ne,X-.15,u+.68],[V+P-1.5*ne,X-.15,u+.68],[V+P-ne,X-.15,u+.2],[V-P-ne,X-.15,u+.2]],L,[m.x,m.y,m.z,O],-1.25,-.78,-1,0),m.back){const Y=(m.big?1.15:1.9)*m.r+.3,J=.58*m.h,A=m.x-(m.big?.35:.8)*m.r,te=m.y+.5*m.h;x([[A-Y,te-J,i],[A+Y,te-J,i],[A+Y,te+J,i],[A-Y,te+J,i]],L,[m.x,m.y,m.z,m.big?.75:.4])}}const S=new a.BufferGeometry;return S.setAttribute("position",new a.Float32BufferAttribute(t,3)),S.setAttribute("aUV",new a.Float32BufferAttribute(s,4)),S.setAttribute("color",new a.Float32BufferAttribute(f,3)),S.setAttribute("aPiv",new a.Float32BufferAttribute(r,4)),S.boundingSphere=new a.Sphere(new a.Vector3(0,22,-xe),50),S}function v0(e,t,s){const f=[],r=(i,x)=>s(i/e,x/t);for(let i=0;i<t;i++)for(let x=0;x<e;x++){const S=r(x,i),m=r(x+1,i),g=r(x+1,i+1),L=r(x,i+1);f.push(...S,...m,...g,...S,...g,...L)}const u=new a.BufferGeometry;return u.setAttribute("position",new a.Float32BufferAttribute(f,3)),u.computeVertexNormals(),u}function Kt(e){const t=e.attributes.position.array.slice(),s=e.attributes.normal.array.slice();for(let r=0;r<t.length;r+=9)for(let u=0;u<3;u++){let i=t[r+3+u];t[r+3+u]=t[r+6+u],t[r+6+u]=i,i=s[r+3+u],s[r+3+u]=s[r+6+u],s[r+6+u]=i}for(let r=0;r<s.length;r++)s[r]=-s[r];const f=new a.BufferGeometry;return f.setAttribute("position",new a.BufferAttribute(t,3)),f.setAttribute("normal",new a.BufferAttribute(s,3)),f}const h0=(e,t,s,f,r)=>{e.put(t,s,f,r);const u=Kt(t);e.put(u,s,f,r),u.dispose()},m0=(e,t=7,s=5)=>Z0(new a.SphereGeometry(e,t,s));async function jt(e,t,s,f,r){const m=[[re([[.75,0],[.8,.3],[.6,.5],[.62,3.2],[.8,3.5],[.8,4.6],[.62,4.9]],8),0,t.wood],[re([[.62,0],[.4,.3],[.56,.9],[.66,1.5],[.42,2.1],[.36,2.5],[.6,2.8]],8),4.9,t.red],[re([[.6,0],[.62,.25],[.4,.5],[.34,1.6],[.5,2.3],[.56,2.7],[.36,3.1]],8),7.7,t.indigo],[re([[.36,0],[.5,.2],[.3,.5],[.26,1.5],[.44,1.8],[.3,2.1],[.5,2.5],[.34,2.9],[.14,3.1],[0,3.2]],8),10.8,t.green]];for(const[A,te]of[[12+.5,-60-.5],[22-.5,-60-.5],[12+.5,-72+.5],[22-.5,-72+.5]])for(const[Q,ve,z]of m)e.put(Q,y(A,ve,te,0,s()*6,0),ee(z,s,.08),{mat:ze});m.forEach(A=>A[0].dispose()),await r();const g=I(.6,1.5,11,.15),L=I(9,1.5,.6,.15),P=U0(8);for(const A of[12+.5,22-.5])e.put(g,y(A,4,-66),ee(t.wood,s),{mat:De});for(const A of[-60-.5,-72+.5])e.put(L,y(17,4,A),ee(t.wood,s),{mat:De});const R=Se([[-4.5,0],[4.5,0],[4.5,4.6],[3.2,4.6],[2.4,5.6],[1,5.9],[0,7.2],[-1,5.9],[-2.4,5.6],[-3.2,4.6],[-4.5,4.6]]),B=Te(new a.ExtrudeGeometry(R,{depth:.45,bevelEnabled:!0,bevelSize:.12,bevelThickness:.12,bevelSegments:1,curveSegments:1}));e.put(B,y(17,4.7,-72+.3),t.wood,{mat:De}),B.dispose();for(let A=-2;A<=2;A++)e.put(P,y(17+A*1.7,7.2+(A===0?2.2:0),-72+.92,0,0,0,A===0?1:.7),A%2?t.red:t.brass,{mat:A%2?ze:be});const V=I(9,2.4,.45,.15);e.put(V,y(17,5.6,-60-.5),t.wood,{mat:De}),V.dispose(),g.dispose(),L.dispose(),P.dispose();const X=I(9.4,1.1,11,.3);e.put(X,y(17,5,-66),t.cotton,{mat:y0}),X.dispose();const O=m0(1,9,6);e.put(O,y(14.8,6,-70.2,0,.1,0,2,.6,1.2),t.cotton,{mat:y0}),e.put(O,y(19.2,6,-70.3,0,-.15,0,2,.65,1.2),t.rose,{mat:y0}),O.dispose();const ne=Te(new a.CircleGeometry(1.1,9)),Y=I(.14,.1,1.5,.04);h0(e,ne,y(16.9,6.42,-70,-Math.PI/2+.12,0,.4),t.palm,{mat:P0}),e.put(Y,y(17.5,6.36,-68.8,0,.45,0),t.wood,{mat:ze}),ne.dispose(),Y.dispose(),await r();const J=v0(12,12,(A,te)=>{const Q=A*15.2-2.5,ve=.16+.84*te,z=Ae(12-.1+Q,12-.1,22+.1),$=Math.max(0,-Q)+Math.max(0,Q-10.2);return[z+($>0?(Q<0?-1:1)*.12*Math.sin(te*21):0),5.62-$*.92+.06*Math.sin(A*23+te*17),-72+12*ve]});h0(e,J,$e,t.red,{mat:dt,w:(A,te,Q)=>Ae((Q- -72)/12,0,1)}),J.dispose()}async function Xt(e,t,s,f,r){const u=[20,4.1,-49,xt],i=I(6,3.6,6,.2),x=I(6.3,.9,6.3,.25),S=I(.9,.6,.9,.15),m=I(.12,3.7,.5,.05);e.put(i,y(17,2.3,-49),t.woodDark,{mat:De}),e.put(x,y(17,4.55,-49),ee(t.woodDark,s),{mat:ze,piv:u}),e.put(u0([14.3,4.08,-46.3],[19.7,4.08,-46.3],[19.7,4.08,-51.7],[14.3,4.08,-51.7]),$e,t.dark);for(const d of[14.5,19.5])for(const n of[-46.5,-51.5])e.put(S,y(d,.3,n),t.woodDark,{mat:ze});for(const d of[-46.9,-51.1])e.put(m,y(13.96,2.3,d),t.brass,{mat:be});const g=I(.1,1.2,.9,.04);e.put(g,y(13.95,3.4,-49),t.brass,{mat:be});const L=re([[.16,0],[.13,.07],[.07,.12],[0,.14]],5);L.rotateZ(Math.PI/2);const P=(d,n,c=1,M)=>e.put(L,y(13.98,d,n,0,0,0,c),ee(t.brass,s,.15),{mat:be,piv:M});for(let d=-1;d<=1;d++)for(let n=0;n<5;n++)for(let c=1;c<=4;c++){const M=(n-2)*.36;P(.9+Math.cos(M)*c*.52,-49+d*1.8+Math.sin(M)*c*.52,1.15-c*.1)}for(let d=0;d<15;d++)P(.62,-46.3-d*.386),P(4.55,-46.2-d*.4,.9,u);i.dispose(),x.dispose(),S.dispose(),m.dispose(),g.dispose(),L.dispose();const R=v0(5,6,(d,n)=>{const c=n*5.4;return[c<2.6?16.6-c:13.9-.25*Math.sin(d*9),c<2.6?4.3+.15*Math.sin(d*7):4.2-(c-2.6)*.95,-47.3-d*3.2+.2*Math.sin(n*8)]});h0(e,R,$e,t.rose,{mat:y0,hinge:.04,piv:[17.5,3.6,-49,gt]}),R.dispose(),await r();const B=re([[0,0],[1.3,0],[1.4,.2],[1,1],[1.4,1.9],[1.5,2.1],[0,2.1]],9),V=re([[0,.1],[.6,0],[1.3,.45],[1.5,.9],[1.42,.92],[1.2,.5],[0,.3]],10),X=m0(.5,7,5);e.put(B,y(15.5,0,-41.5),t.wood,{mat:De}),e.put(V,y(15.5,2.1,-41.5),t.blue,{mat:x0,hinge:.1,piv:[15.5,2.1,-41.5,0]});for(let d=0;d<7;d++){const n=d*1.05,c=d<5?.7:.2;e.put(X,y(15.5+Math.cos(n)*c,2.75+(d<5?0:.6),-41.5+Math.sin(n)*c,s(),s()*6,0,1,.82,.8),ee(f.limes?t.lime2:t.mango,s,.18).lerp(t.rose,f.limes?0:s()*.4),{mat:P0,hinge:0})}B.dispose(),V.dispose(),X.dispose();const O=re([[0,.05],[2.6,.05],[3,.3],[3.1,.32],[2.7,0],[0,0]],14),ne=re([[0,0],[.2,0],[.34,.45],[.36,.5],[.3,.45],[0,.12]],7),Y=re([[0,0],[.7,0],[.8,.25],[.45,.9],[.4,1.4],[.7,1.9],[.74,2.1],[.34,2.5],[.1,2.9],[.16,3.05],[0,3.15]],9),J=Te(new a.ConeGeometry(.22,1.5,5));e.put(O,y(-6,.08,-40),t.brass,{mat:be}),e.put(Y,y(-6.6,.15,-40.4),t.brass,{mat:be}),e.put(J,y(-5.85,2,-40.4,0,0,-1),t.brass,{mat:be});for(let d=0;d<4;d++){const n=.4+d*.85,c=-6+Math.cos(n)*1.7,M=-40+Math.sin(n)*1.7;e.put(ne,y(c,.15,M,0,0,0,1.25),t.blue,{mat:x0,hinge:.1,piv:[c,.15,M,0]})}O.dispose(),ne.dispose(),Y.dispose(),J.dispose(),await r();const A=re([[0,0],[1.1,0],[1.8,1],[2,2],[1.6,3],[1.2,3.3],[1.5,3.6],[1.3,3.7],[0,3.5]],10),te=Te(new a.OctahedronGeometry(1,0));e.put(A,y(29,0,-64),t.clay,{mat:Y0}),A.dispose();for(let d=0;d<70;d++){const n=s()*6.283,c=Math.sqrt(s())*2.8,M=3.8+s()*5.2*(1-c/4.5),b=.5+s()*.5,T=d%4===0;e.put(te,y(29+Math.cos(n)*c,M,-64+Math.sin(n)*c,s()*1.2-.6,n,s()*1.2-.6,T?.3:b*1.3,T?.3:b*.3,T?.3:b*.7),T?t.white:ee(t.leaf,s,.3),{mat:T?F0:P0,hinge:.12+.05*M})}const Q=v0(1,3,(d,n)=>[0,(d-.5)*.7*(1-n*.8),n]);for(let d=0;d<3;d++){const n=-92+d*9,c=-4+d*2,M=.5+d*.25;for(let b=0;b<22;b++){const T=b/21,ue=40.5-1.2*d,W=c+30*T-13*T*T,K=n+M*22*T;for(const Z of[-1,1])h0(e,Q,y(ue,W,K,Z*(.9+.5*T),.2*Z,0,1,1,5.5*(1-.6*T)),ee(t.leaf,s,.25),{mat:P0,hinge:.3+.9*T})}}te.dispose(),Q.dispose(),await r();const ve=re([[0,0],[.56,0],[.62,.07],[.52,.18],[.22,.32],[.16,.66],[.3,.8],[.3,.9],[.18,1.02],[.24,1.14],[.72,1.4],[.94,1.76],[.95,1.96],[.86,2.06],[.76,2],[.7,1.9],[0,1.9]],14),z=I(.12,1,.12,.04),$=re([[0,0],[.16,.08],[.24,.26],[.26,.45],[.21,.72],[.12,1.05],[.04,1.3],[0,1.4]],10),oe=-17,me=-36,H=I(.5,1.05,.16,.06);for(let d=0;d<14;d++)e.put(H,y(oe,43.5-d*.95,me,0,d%2*Math.PI/2+.3,0),t.brass.clone().multiplyScalar(d%2?.85:1.05),{mat:be});const ce=re([[1.55,-.08],[1.85,0],[1.8,.22],[1.2,.5],[.55,.95],[.3,1.35],[0,1.5]],10),fe=re([[0,-2],[.34,-1.72],[.2,-1.5],[.3,-1.15],[.75,-.95],[1.35,-.6],[1.8,-.2],[1.85,0]],10),G=I(.22,3.9,.22,.07),E=Te(new a.TorusGeometry(1.6,.09,4,12));E.rotateX(Math.PI/2),e.put(ce,y(oe,29.2,me),t.brass,{mat:be}),e.put(fe,y(oe,25.3,me),t.brass,{mat:be});for(const d of[25.4,27.25,29.1])e.put(E,y(oe,d,me),t.brass.clone().multiplyScalar(1.1),{mat:be});const _=["#b0182a","#2A4FA8","#2a8a46","#d89a22","#b0182a","#2A4FA8"].map(d=>he(d,.9));for(let d=0;d<6;d++){const n=d*Math.PI/3,c=n+Math.PI/3,M=1.56,b=oe+Math.cos(n)*M,T=me+Math.sin(n)*M,ue=oe+Math.cos(c)*M,W=me+Math.sin(c)*M;e.put(G,y(b,27.25,T,0,-n,0),t.brass,{mat:be});const K=u0([ue,25.4,W],[b,25.4,T],[b,29.1,T],[ue,29.1,W]);h0(e,K,$e,_[d],{mat:et}),K.dispose()}H.dispose(),ce.dispose(),fe.dispose(),G.dispose(),E.dispose(),e.put(ve,y(Qe[0],8,Qe[2],0,0,0,.8,1.08,.8),t.brass,{mat:be}),e.put($,y(Qe[0],10,Qe[2]),t.flame,{mat:F0,hinge:2,piv:[Qe[0],10,Qe[2],At]}),ve.dispose(),z.dispose(),$.dispose();const Me=(d,n,c,M,b)=>{const T=v0(7,10,(W,K)=>[d+b*.3*Math.sin(W*19)*(.4+.6*K),M-K*(M-.5),n+(c-n)*W]);h0(e,T,$e,t.cotton,{mat:y0,w:(W,K)=>Ae((M-K)/(M-.5),0,1)**1.5}),T.dispose();const ue=I(.3,.3,Math.abs(c-n)+1.5,.08);e.put(ue,y(d,M+.2,(n+c)/2),t.wood,{mat:ze}),ue.dispose()};Me(C-1,-70.4,-74.6,23.4,-1),Me(C-1,-85.4,-89.6,23.4,-1),Me(-C+1,-56.5,-67.5,17.4,1);const Le=m0(1,6,4),Be=Te(new a.ConeGeometry(.12,.9,4)),Ce=I(.42,.07,.07,.02);Zt.forEach((d,n)=>{const c=[d[0],d[1],-109.8,Pt+n],M={mat:q0,piv:c};e.put(Le,y(d[0],d[1],-109.86,0,0,0,.5,.17,.1),t.gecko,M),e.put(Le,y(d[0]+.52,d[1]+.02,-109.86,0,0,0,.2,.15,.09),t.gecko,M),e.put(Be,y(d[0]-.85,d[1]-.05,-109.88,0,0,Math.PI/2+.12),t.gecko,M);for(const[b,T,ue]of[[.3,.22,.7],[.3,-.22,-.7],[-.3,.22,2.3],[-.3,-.22,-2.3]])e.put(Ce,y(d[0]+b,d[1]+T,-109.9,0,0,ue),t.gecko,M)}),Le.dispose(),Be.dispose(),Ce.dispose()}const l0=-95,Qe=[5.6,10.6,-112.4],Zt=[[-11.6,15.6],[21.4,31.6]];function Ut(e,t,s){const f=new R0(7e3),r=-26.8,u=new a.Matrix4().makeRotationY(-Math.PI/2),i=(H,ce,fe,...G)=>new a.Matrix4().multiplyMatrices(u,y(H,r+ce,fe,...G)),x=(H,ce,fe,G)=>[-fe,r+ce,H,G],S=I(.16,1,.16,.05);for(let H=0;H<21;H++)f.put(S,y(0,-.5-H,0,0,H%2*Math.PI/2,0,H%2?1:1.6,1.05,1),ee(e.brass,t,.15),{mat:be});const m=Z0(new a.TorusGeometry(3,.2,6,28));f.put(m,y(0,-24,0),e.brass,{mat:be}),m.dispose(),S.dispose();const g=m0(.34,7,5);f.put(g,y(0,-21,0),e.brass,{mat:be}),g.dispose();const L=m0(1,12,9),P={mat:q0},R=x(0,0,0,kt),B=s.myna,V=e.feather,X=e.feather.clone().lerp(e.white,B?.1:.5),O=B?e.beak.clone().multiplyScalar(.95):e.white.clone().multiplyScalar(.92),ne=e.feather.clone().multiplyScalar(B?.8:.78),Y=e.feather.clone().multiplyScalar(B?.5:.42),J=B?he("#0c0b0e"):e.feather.clone().multiplyScalar(1.08);f.put(L,i(-.04,1.25,0,0,0,-.24,.66,1.05,.64),V,{...P,piv:R}),f.put(L,i(.2,1.05,0,0,0,-.1,.5,.78,.54),X,{...P,piv:R}),f.put(L,i(.02,.5,0,0,0,0,.42,.42,.46),V.clone().multiplyScalar(.92),{...P,piv:R});const A=x(.08,1.95,0,zt);f.put(L,i(.22,2.34,0,0,0,0,.58,.55,.52),J,{...P,piv:A}),f.put(L,i(.08,1.95,0,0,0,-.2,.46,.4,.46),V,{...P,piv:A});const te=I(.5,.2,.16,.06),Q=m0(1,8,6);for(const H of[-1,1]){f.put(L,i(.44,2.36,H*.36,0,0,0,.36,.34,.2),O,{...P,piv:A}),f.put(Q,i(.56,2.44,H*.5,0,0,0,.13,.13,.07),e.eye,{mat:F0,piv:A}),f.put(Q,i(.585,2.44,H*.545,0,0,0,.06,.06,.035),e.dark,{mat:ze,piv:A}),f.put(te,i(.1,.1,H*.24,0,0,-.15),e.beak,{mat:ze,piv:R}),f.put(te,i(-.12,.02,H*.24,0,0,.6,.7,1,1),e.beak,{mat:ze,piv:R});const ce=x(.08,1.92,H*.52,H>0?Mt:St);f.put(L,i(-.12,1.3,H*.62,0,0,-.26,.5,.92,.15),ne,{...P,piv:ce}),f.put(L,i(-.3,.95,H*.66,0,0,-.42,.34,.8,.1),ne.clone().multiplyScalar(.9),{...P,piv:ce});const fe=I(.3,1,.045,.02);fe.translate(0,-.5,0);for(let G=0;G<7;G++){const E=G/6,_=1.25+.55*Math.sin(E*Math.PI*.8+.4);f.put(fe,i(-.16-.12*E,1-.1*E,H*(.7+.012*G),H*.05,0,.12-.92*E,1-.25*E,_,1),(B&&G>3?e.white:Y).clone().multiplyScalar(.85+.3*(G%2)),{...P,piv:ce})}fe.dispose()}te.dispose(),Q.dispose();const ve=v0(6,5,(H,ce)=>{const fe=ce*1.75,G=.4,E=.24*Math.pow(1-ce,.7)+.004,_=H*Math.PI*2,Me=G*Math.sin(fe),Le=-G*(1-Math.cos(fe)),Be=E*Math.cos(_);return[Me+Math.sin(fe)*Be,Le+Math.cos(fe)*Be,E*.8*Math.sin(_)]});f.put(ve,i(.66,2.38,0,0,0,.25,1.15),e.beak,{mat:ze,piv:A}),ve.dispose();const z=Te(new a.ConeGeometry(.17,.4,6));z.translate(0,.2,0),f.put(z,i(.62,2.14,0,0,0,-2.25,1,1,.8),e.beak.clone().multiplyScalar(B?.85:1.6),{mat:ze,piv:A}),z.dispose();const $=x(-.34,.62,0,Lt),oe=I(.36,1.75,.06,.03);oe.translate(0,-.875,0);for(let H=-3;H<=3;H++)f.put(oe,i(-.34,.64,H*.06,H*.2,0,-.34,1,1-Math.abs(H)*.07,1),ee(B&&Math.abs(H)>1?e.white:e.tail,t,.12),{...P,piv:$});oe.dispose(),L.dispose();const me=f.build();return me.boundingSphere=new a.Sphere(new a.Vector3(0,-14,0),16),me}const d0=(e,t,s,f,r)=>e.set(-f,s,t,r);function Jt(e){const t=new R0(200),s=v0(2,5,(r,u)=>[(r-.5)*.5*Math.sin(Math.PI*Math.min(1,.15+u)),u*1.9-.95,.12*Math.sin(u*3)]);h0(t,s,$e,e.feather.clone().lerp(e.white,.35),{mat:q0}),s.dispose();const f=t.build();return f.boundingSphere=new a.Sphere(new a.Vector3,2),f}function $t(){const t=[],s=(r,u,i,x)=>t.push(...r,...u,...i,...r,...i,...x);s([43,-8,4],[43,-8,-118],[43,52,-118],[43,52,4]),s([-43,-8,-118],[-43,-8,4],[-43,52,4],[-43,52,-118]),s([-43,52,4],[43,52,4],[43,52,-118],[-43,52,-118]);const f=new a.BufferGeometry;return f.setAttribute("position",new a.Float32BufferAttribute(t,3)),f.boundingSphere=new a.Sphere(new a.Vector3(0,22,-57),90),f}function Qt(){const e=[],t=[],s=[],r=(i,x,S)=>{const m=e.length/3;for(let g=0;g<=4;g++)for(const[L,P]of[[i,0],[x,1]])e.push(...L),t.push(g/4,S,P);for(let g=0;g<4;g++){const L=m+g*2;s.push(L,L+1,L+3,L,L+3,L+2)}};for(let i=0;i<7;i++){const x=-71.5-i*2.83;r([C,.5,x],[C,23.5,x],0)}for(const i of[-48,-52,-56,-98,-101,-104])r([C,9.5,i],[C,24.5,i],3);for(const i of[-98,-94,-90,-80,-76,-72])r([-C,24.5,i],[-C,39.5,i],2);for(let i=0;i<9;i++){const x=-42-i*3.25;r([-10,se,x],[10,se,x],1)}const u=new a.BufferGeometry;return u.setAttribute("position",new a.Float32BufferAttribute(e,3)),u.setAttribute("aInfo",new a.Float32BufferAttribute(t,3)),u.setIndex(s),u.boundingSphere=new a.Sphere(new a.Vector3(0,22,-57),110),u}function Yt(e,t){const s=[],f=[],r=[],u=[[-1,-1],[1,-1],[1,1],[-1,1]],i=(S,m,g)=>{for(let L=0;L<Math.round(S*t);L++){const P=g(),R=Math.pow(e(),.8),B=e();for(const V of[0,1,2,0,2,3])s.push(P[0],P[1],P[2]),f.push(R,m,B),r.push(u[V][0],u[V][1])}};i(210,0,()=>[C,.8+22.4*e(),-70.5-19*e()]),i(90,3,()=>{const S=e()<.45;return[C,9.8+14.4*e(),S?-96.5-9*e():-46.5-11*e()]}),i(130,2,()=>[-C,24.8+14.4*e(),e()<.5?-88.5-11*e():-70.5-11*e()]),i(170,1,()=>[-9.5+19*e(),se,-40.5-29*e()]);const x=new a.BufferGeometry;return x.setAttribute("position",new a.Float32BufferAttribute(s,3)),x.setAttribute("aInfo",new a.Float32BufferAttribute(f,3)),x.setAttribute("aCorner",new a.Float32BufferAttribute(r,2)),x.boundingSphere=new a.Sphere(new a.Vector3(0,22,-57),110),x}function eo(e,t){const s=[],f=[],r=[],u=[[-1,-1],[1,-1],[1,1],[-1,1]];for(let x=0;x<t;x++){const S=-16+32*e(),m=2+40*e(),g=13.5*e(),L=e(),P=e(),R=e();for(const B of[0,1,2,0,2,3])s.push(S,m,g),f.push(L,P,R),r.push(u[B][0],u[B][1])}const i=new a.BufferGeometry;return i.setAttribute("position",new a.Float32BufferAttribute(s,3)),i.setAttribute("aSeed",new a.Float32BufferAttribute(f,3)),i.setAttribute("aCorner",new a.Float32BufferAttribute(r,2)),i.boundingSphere=new a.Sphere(new a.Vector3(0,25,-xe-13),42),i}const I0=(e,t,s,f,r,u,i,x)=>Array.from({length:u+1},(S,m)=>{const g=m/u,L=(f+(r-f)*g)*Math.PI/180;return[e-s*Math.cos(L),i+(x-i)*g,t-s*Math.sin(L)]}),z0=(e,t,s,f,r)=>[e-s*Math.cos(f*Math.PI/180),r,t-s*Math.sin(f*Math.PI/180)],to=[[0,18,6],[-3,17.6,-12],[-11,16.6,-34],[-20,15.4,-58],[-27.5,14.2,-80],[-30.6,13.2,-91],...I0(-26,-99.5,5,0,180,8,12.6,17.5),[-21,19.6,-96],[-21,20.5,-92.5],[-21,20.2,-84],...I0(-10.5,-76,10.5,360,180,8,19.6,18),[0,18,-78],[0,18,-80],[0,18,-84],[0,18,-96],[0,18,-120],[0,18,-140]],oo=[[0,18,10],[0,18,0],[-1,17.8,-12],[-3.5,16.6,-40],[-6,15,-70],[-7.6,13.2,-88],[-6.6,11.6,-98],[-4.6,10.4,-104.5],[-2.6,9.9,-107.9],[-.8,9.8,-109.3],[1,9.9,-109.7],[2.8,10.3,-108.9],[4.8,11.2,-106.6],[7.4,12.6,-103],[11,14.4,-98],[15,16,-93],[18.6,17.4,-88],[19.6,19.6,-76],[20,20,-58],[20,19.6,-42],[20,19.2,-32],...I0(10,-23,10,180,360,8,19,18),[0,18,-25.5]],ot={stair3:[0,18,0],turn3:z0(-26,-99.5,5,0,12.6),wall:z0(-26,-99.5,5,60,14.23),bird:z0(-26,-99.5,5,180,17.5),view:[-21,20.5,-92.5],leg:[-21,20.2,-84],uturn3:[0,18,-76]},at={stair4:[0,18,0],dn:[-6.6,11.6,-98],peek:[-2.6,9.9,-107.9],front:[-.8,9.8,-109.3],away:[11,14.4,-98],bed:[19.6,19.6,-76],back:z0(10,-23,10,180,19),uturn4:z0(10,-23,10,360,18)},ao=[["a0",0,0],["stair3",0,22],["stair3",30,36],["turn3",-40,36],["turn3",-2,7],["wall",-2,4.2],["wall",1,3.4],["wall",9,3.6],["bird",0,5.5],["view",-2,6.5],["view",2,7.5],["leg",0,11],["leg",14,11.5],["uturn3",0,11.5],["keep",0,13.5],["arch",0,24],["door",0,27],["stair4",0,29],["stair4",30,33],["dn",-34,32],["dn",-2,8.5],["peek",-1,4.2],["front",0,3],["front",4,4.6],["away",-6,11],["away",0,15],["bed",0,34],["back",-26,34],["back",0,14],["uturn4",-3,14],["a1",0,0]];async function so(e,t,s,f){const r=e.length,u=.38,i=.385,x=.66,S=u*r,m=x*r,g=le,L=e.pointAt(u).z,P=e.pointAt(x).z,R=-2*ie,B=-3*ie,V=new a.Vector3,X=new a.Vector3,O=o=>[o[0],o[1],R+o[2]],ne=o=>[o[0],o[1],B+o[2]],Y=X0([[0,18,L+20],[0,18,L+10],[0,18,L],[0,18,L-10],...to.map(O),...oo.map(ne),[0,18,P],[0,18,P-10],[0,18,P-20]],{samples:64});await f();const J=Y.length-40,A=S+J,te=r+J-(m-S),Q=(o,l)=>o<=S?e.posAtDist(o,l):o<A?Y.posAtDist(20+o-S,l):e.posAtDist(o-A+m,l),ve=(o,l)=>o<=S?e.tangentAtDist(o,l):o<A?Y.tangentAtDist(20+o-S,l):e.tangentAtDist(o-A+m,l),z=Math.ceil(J*3),$=new Float32Array(z+1),oe=new Float32Array(z+1),me=new Float32Array(z+1);for(let o=0;o<=z;o++)Y.posAtDist(20+o/z*J,V),$[o]=V.x,oe[o]=V.y,me[o]=V.z,(o&255)===255&&await f();let H=0;const ce=o=>{let l=1e9,w=H;for(let q=H;q<=z;q++){const N=($[q]-o[0])**2+(oe[q]-o[1])**2+(me[q]-o[2])**2;if(N<l&&(l=N,w=q),N>l+900)break}return H=w,w/z*J},fe=o=>{let l=ce([0,18,o])-1,w=l+2;for(let q=0;q<40;q++){const N=(l+w)/2;Y.posAtDist(20+N,V).z>o?l=N:w=N}return(l+w)/2},G={a0:0,a1:J};for(const o in ot)G[o]=ce(O(ot[o]));G.keep=fe(e.pointAt(.52).z),G.arch=ce(O([0,18,-104])),G.door=ce(O([0,18,-130]));for(const o in at)G[o]=ce(ne(at[o]));await f();const E=64,_=new Float32Array(E+1),Me=new Float32Array(E+1);let Le=0;for(let o=0;o<=E;o++)_[o]=Ae(t(o/E),.35,2.5);for(let o=0;o<E;o++)Le+=2/(_[o]+_[o+1]);const Be=Le/E,Ce=o=>{const l=Ae(o,0,1)*E,w=Math.min(E-1,Math.floor(l));return Math.min((_[w]+(_[w+1]-_[w])*(l-w))*Be*r/s,25)},d=ao.map(o=>[G[o[0]]+o[1],o[2]]);d[0][1]=d[d.length-1][1]=Ce(x);const n=o=>{let l=0;for(;l<d.length-2&&d[l+1][0]<o;)l++;return Je(d[l][1],d[l+1][1],g(d[l][0],d[l+1][0],o))},c=[.43,.475,.52,.61,x],M=[G.wall,G.view,G.keep,G.front,J],b=[3.8,11,7,8.5,4.2],T=c.length,ue=[0,0,0,0,0],W=[[.423,.431],[.46,.473],[.504,.518],[.594,.608]],K=o=>{if(o<=.35||o>=.664)return Ce(o);if(o<i)return Je(Ce(o),b[0],g(.35,.38,o));let l=b[0];for(let w=1;w<T;w++)l+=(b[w]-b[w-1])*g(W[w-1][0],W[w-1][1],o);return Je(l,Ce(o),g(.652,.664,o))},Z=2200,de=(x-i)/Z,pe=new Float32Array(Z+1),Ge=(i-u)*r,qe=1/60,We=1-Math.exp(-qe*1.4);let Oe=s,Fe=1,Ke=Ce(x);const Ve=()=>{let o=0;const l=640;for(let w=0;w<l;w++)o+=r/l/K((w+.5)/l);Oe=o,Le=0;for(let w=0;w<=E;w++)Me[w]=Ae(K(w/E)*o/r,.35,2.5);for(let w=0;w<E;w++)Le+=2/(Me[w]+Me[w+1]);Fe=Le/E},Xe=o=>{const l=Ae(o,0,1)*E,w=Math.min(E-1,Math.floor(l));return(Me[w]+(Me[w+1]-Me[w])*(l-w))*Fe*r/Oe},Ne=o=>{Ve();let l=.3,w=Xe(l),q=-1,N=0,ke=l,p0=0;for(;l<i;)w+=(Xe(l)-w)*We,l+=w*qe/r;for(q=Ge+(l-i)*r,d[0][1]=w,d[d.length-1][1]=Ke,pe[0]=Ge,ke=i,p0=Ge;ke<o&&q<J+400;){for(;N<Z&&i+(N+1)*de<=l;)N++,pe[N]=p0+(q-p0)*((i+N*de-ke)/Math.max(l-ke,1e-9));ke=l,p0=q,w+=(Xe(l)-w)*We,l+=w*qe/r,q+=n(Math.min(q,J))*qe}o>=x&&(Ke=w);const S0=(Math.min(o,x)-i)/de,n0=Math.min(Z-1,Math.floor(S0));return pe[n0]+(pe[Math.min(n0+1,N)]-pe[n0])*(S0-n0)};for(let o=0;o<4;o++)for(let l=0;l<T;l++){let w=2.5,q=40;for(let N=0;N<18;N++)b[l]=Math.sqrt(w*q),Ne(c[l])>M[l]?w=b[l]:q=b[l];await f()}Ne(x+.001);{let o=0,l=0;for(let w=0;w<T;w++){const q=Math.round((c[w]-i)/de),N=ue[w]=M[w]-pe[q];for(let ke=o+1;ke<=q;ke++)pe[ke]+=Je(l,N,(ke-o)/(q-o));o=q,l=N}}const je=o=>8*g(.12,.16,o)*(1-g(.16,.205,o))+3.8*g(.745,.79,o)*(1-g(.79,.83,o)),ge=o=>{if(o<=i)return o*r+je(o);if(o>=x)return A+(o-x)*r+je(o);const l=(o-i)/de,w=Math.min(Z-1,Math.floor(l));return S+pe[w]+(pe[w+1]-pe[w])*(l-w)},Re=o=>{const l=ge(o)-S;return l>G.stair3&&l<G.uturn3?R+(l<G.leg?Je(0,-50,(l-G.stair3)/(G.leg-G.stair3)):Je(-50,-76,(l-G.leg)/(G.uturn3-G.leg))):l>G.stair4&&l<G.uturn4?B+Je(0,-23,(l-G.stair4)/(G.uturn4-G.stair4)):Q(ge(o),X).z},Ie=o=>{let l=i,w=x;for(let q=0;q<30;q++){const N=(l+w)/2;ge(N)-S<o?l=N:w=N}return(l+w)/2},Ze=o=>g(.396,.408,o)*(1-g(.505,.518,o))+g(.564,.575,o)*(1-g(.644,.654,o)),s0=(o,l)=>Je(l,Math.min(l,15),Ze(o));let Ye=null,Ee=-1,e0=!1,_e=null;const Pe={curve:e.curve,length:r,points:e.points,start:e.start,end:e.end,startTangent:e.startTangent,endTangent:e.endTangent,realLength:te,posAtDist(o,l=new a.Vector3){if(o<=0||o>=r)return e0=!1,e.posAtDist(o,l);if(Ye!==null&&l===Ye)return Ee=o,e0=!0,Q(ge(o/r),l);const w=e0,q=Ee/r,N=o-Ee;return e0=!1,Ee>0&&q>i&&q<x&&N>0&&N<130?w&&_e?l.copy(_e(q)):Q(ge(q)+(w?s0(q,N):N),l):Q(ge(o/r),l)},tangentAtDist(o,l=new a.Vector3){if(o<=0||o>=r)return e.tangentAtDist(o,l);const w=Ee/r,q=o-Ee;if(Ee>0&&w>i&&w<x&&q>.5&&q<130){const N=ge(w);return ve(N,l),l.multiplyScalar(.86).addScaledVector(ve(N+5,X),.14).normalize()}return ve(ge(o/r),l)},pointAt(o,l=new a.Vector3){return o<=0||o>=1?e.pointAt(o,l):Q(ge(o),l)},tangentAt(o,l=new a.Vector3){return Pe.tangentAtDist(o*r,l)},nearestXZ:(o,l)=>e.nearestXZ(o,l),distanceTo:(o,l,w)=>Math.min(e.distanceTo(o,l,w),Y.distanceTo(o,l,w)),isClear:(o,l,w,q=0,N=4)=>Pe.distanceTo(o,l,w)>q+N,frameAt:(o,l,w)=>e.frameAt(o,l,w)},Ue=(o,l,w,q,N)=>g(l,w,o)*(1-g(q,N,o)),M0=o=>1+.15*(1-g(.33,.36,o))+.6*Ue(o,.356,.372,.381,.389)+.35*Ue(o,.442,.456,.468,.477)+.25*Ue(o,.477,.487,.508,.519)-.1*Ue(o,.516,.526,.544,.552)+.25*Ue(o,.577,.585,.596,.604)+.3*Ue(o,.64,.646,.655,.663)+.5*Ue(o,.655,.663,.672,.7)+.2*Ue(o,.66,.69,.85,.9);let i0=0;for(let l=0;l<640;l++){const w=(l+.5)/640;i0+=r/640/(K(w)*M0(w))}return{path:Pe,R:Q,RT:ve,Sof:ge,zProg:Re,uOf:Ie,m:G,d0:S,pace:o=>{const l=Ae(o,0,1);return K(l)*M0(l)*i0/r},duration:i0,loopK:Ze,ahead:s0,vnT:K,speed:n,c:b,err:ue,setAim(o){_e=o},setEye(o){Ye=o}}}var lo={id:"house-in-the-niche",name:"The House in the Niche",category:"domestic",weirdness:.5,media:["interior","air"],async build(e){const t=e.rng,s=e.vary||{},f=e.quality?.detail??1,r=Ae(s.density??1,.7,1.3),u=()=>e.yield(),i=t.fork("season-of-the-house");let x=i.pick(["rains","kaskazi","wedding"]);s.hour==="golden"&&(x="kaskazi");const S={wedding:x==="wedding",limes:i.chance(.5),rust:i.chance(.5),myna:i.chance(.3)},m=Tt(x),g=D0.map(v=>new a.Color(v)),L=new a.Color(H0),P=new a.Scene;P.background=L;const R=g[0].clone().multiplyScalar(.8),B={lime:R,stone:R.clone().lerp(g[3],.12).lerp(g[5],.14),floor:he("#d6d4ca",.78),wood:g[5].clone().lerp(he("#8a5636"),.5),woodLight:he("#a8744a"),woodDark:g[5].clone().multiplyScalar(1.15),pole:g[5].clone().lerp(he("#6a4a34"),.5),brass:g[6].clone().lerp(g[2],.18).multiplyScalar(.85),blue:g[1].clone(),green:g[2].clone().multiplyScalar(.8),rose:g[3].clone().multiplyScalar(.85),indigo:g[4].clone().multiplyScalar(1.3),red:he("#a8281f"),cotton:g[0].clone().multiplyScalar(.86),palm:he("#b9a45c"),leaf:g[2].clone().lerp(he("#2f6a2a"),.62),clay:g[3].clone().lerp(g[5],.4),flame:g[6].clone(),white:he("#f4f4ee"),dark:he("#05060c"),violet:he("#6a58b0"),leather:he("#5a3a24"),mango:he("#f0a030"),lime2:he("#8fb53a"),feather:S.myna?he("#3a2c24"):he("#8a8f98"),tail:S.myna?he("#e8e4d6"):he("#c8281e"),beak:S.myna?he("#f2b21a"):he("#16161a"),eye:he("#f8eaa0"),gecko:he("#6e6236")};await u();const V=await ht(e,{palette:D0,look:"morning",back:!1,impostor:!1,progress:0,plinth:!0}),X=[V];for(let v=1;v<6;v++)X.push(V.makeLevel()),await u();const O=new R0(13e4);await _t(O,B,t.fork("shell"),f,u),await u();const ne=await Wt(O,B,t.fork("wall"),S,u);await u(),await jt(O,B,t.fork("bed"),S,u),await u(),await Xt(O,B,t.fork("props"),S,u),await u();const Y=O.build();await u(),Y.boundingSphere=new a.Sphere(new a.Vector3(0,22,-57),92);const J=Ut(B,t.fork("perch"),S),A=Jt(B);await u();const te=$t();await u();const Q=ne.pools.length?Ot(ne.pools):null;await u();const ve=Yt(t.fork("motes"),f*r);await u();const z=Qt();await u();const $=eo(e.core.makeRng(e.core.hashSeed("gap-dust:"+e.seed)),Math.round(800*f*r));await u();const oe=new a.ShaderMaterial({vertexShader:Ct,fragmentShader:Gt,uniforms:{uToLocal:{value:new a.Matrix4},uTime:{value:0},uWind:{value:.1},uLevel:{value:0},uLid:{value:0},uCover:{value:0},uParrot:{value:1},uLampOn:{value:0},uJ:{value:[0,1,2,3].map(()=>new a.Vector4(0,1,0,0))},uGeck:{value:[new a.Vector3,new a.Vector3]},uSunDir:{value:new a.Vector3(0,1,0)},uSunCol:{value:new a.Color},uSky:{value:new a.Color},uBounce:{value:new a.Color},uGlowCol:{value:new a.Color},uHaze:{value:new a.Color},uLampPos:{value:new a.Vector3(...Qe)},uLampCol:{value:new a.Color(0,0,0)},uStainA:{value:new a.Color},uStainB:{value:new a.Color},uHazeK:{value:.002},uStain:{value:0},uSlits:{value:0},uSpill:{value:0},uLace:{value:1},uGleam:{value:0},uEmis:{value:0},uCaust:{value:0},uGold:{value:S.wedding?1:0},uAreaK:{value:800},uWallFill:{value:0},uLaceDrift:{value:0},uFrond:{value:0},uBarDir:{value:new a.Vector3(0,1,0)},uBarCol:{value:new a.Color(0,0,0)},uLowFill:{value:new a.Color(0,0,0)},uBarDir2:{value:new a.Vector3(0,1,0)},uCeil:{value:new a.Color(0,0,0)},uWallTint:{value:new a.Color(1,1,1)},uNicheSun:{value:.65},uReveal:{value:1},uRim:{value:new a.Color(0,0,0)},uStone:{value:B.stone.clone()},uNicheAmb:{value:.8},uBody:{value:1},uLowFloor:{value:.8}}}),me=new a.ShaderMaterial({vertexShader:Dt,fragmentShader:Bt,side:a.DoubleSide,uniforms:{uToLocal:{value:new a.Matrix4},uTime:{value:0},uTop:{value:new a.Color},uHor:{value:new a.Color},uWater:{value:new a.Color},uDeep:{value:new a.Color},uSunDir:{value:new a.Vector3(0,1,0)},uSunCol:{value:new a.Color},uSail:{value:new a.Color},uGrey:{value:B.feather.clone()},uEye:{value:new a.Vector4(-80,12,0,0)},uStars:{value:0},uWind:{value:0},uDhow:{value:0},uFleet:{value:x==="kaskazi"?1:0},uSailK:{value:1},uBats:{value:0},uShimmer:{value:0},uGain:{value:1},uGlit:{value:1}}}),H=new a.ShaderMaterial({vertexShader:Ht,fragmentShader:qt,side:a.DoubleSide,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,uniforms:{uToLocal:{value:new a.Matrix4},uSunDir:{value:new a.Vector3(0,1,0)},uShaft:{value:new a.Vector4},uShaftCol:{value:new a.Color},uTime:{value:0},uLace:{value:1}}}),ce=new a.ShaderMaterial({vertexShader:Ft,fragmentShader:Vt,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,uniforms:{}}),fe=new a.ShaderMaterial({vertexShader:Nt,fragmentShader:Rt,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,uniforms:{uTime:{value:0},uRoomCol:{value:new a.Color},uDoorCol:{value:new a.Color},uDoorAt:{value:new a.Vector4(0,0,0,1)}}}),G=new a.ShaderMaterial({vertexShader:It,fragmentShader:Et,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,uniforms:{uPool:{value:new a.Color},uTime:{value:0},uLevel:{value:0},uHazeK:{value:.002}}});await u();const E=new a.Vector3(0,18,$0),_=[],Me=[1,1,.8,1.5,.012],Le=[.9,1.2,1,1,1],Be=[1,1,1.15,2.4,1.5];for(let v=0;v<6;v++){const F=new a.Group,D=new a.Group,U=X[v],h=m[Math.min(v,4)];F.add(D),v===0?P.add(F):_[v-1].group.add(F),U.object.position.set(0,0,$0),D.add(U.object),U.setLook(m[Math.max(v-1,0)].hero),U.setImpostor(0),U.setProgress(0),U.setLight({door:v<5?h.door:["#9fd0ff",3.2],wind:m[Math.max(v-1,0)].wind});const He=U.uniforms,we={group:F,content:D,front:U,look:h,base:{sun:He.uSunCol.value.clone(),sky:He.uSky.value.clone(),bounce:He.uBounce.value.clone()},inv:new a.Matrix4};if(v<5){const ae=v===0?oe:oe.clone(),t0=v===0?me:me.clone(),k=v===0?H:H.clone(),p=ae.uniforms,j=t0.uniforms,ye=k.uniforms;p.uToLocal.value=j.uToLocal.value=ye.uToLocal.value=we.inv,p.uJ.value=[0,1,2,3].map(()=>new a.Vector4(0,1,0,0)),p.uGeck.value=[new a.Vector3,new a.Vector3],we.sun=new a.Vector3(...h.sun).normalize(),p.uSunCol.value.set(h.sunC[0]).multiplyScalar(h.sunC[1]),p.uSky.value.set(h.sky[0]).multiplyScalar(h.sky[1]),p.uBounce.value.set(h.bounce[0]).multiplyScalar(h.bounce[1]),p.uGlowCol.value.set(h.glow[0]).multiplyScalar(h.glow[1]),p.uHaze.value.set(h.haze[0]),p.uHazeK.value=h.haze[1],p.uWind.value=h.wind,p.uLevel.value=v+1,p.uLid.value=h.lid,p.uCover.value=h.cover,p.uSlits.value=h.slits,p.uSpill.value=h.spill,p.uLace.value=h.lace,p.uGleam.value=h.gleam,p.uEmis.value=h.lamp?4.5:0,p.uLampOn.value=h.lamp,p.uCaust.value=h.caust,p.uLampCol.value.copy(B.flame).multiplyScalar(h.lamp*5),p.uParrot.value=h.pose===3?0:1,p.uAreaK.value=h.areaK??800,p.uWallFill.value=h.wallFill??0,p.uLaceDrift.value=h.laceDrift??0,p.uStainA.value.set(h.stain[0]),p.uStainB.value.set(h.stain[1]),p.uStain.value=S.wedding?1:0,h.bar&&(p.uBarCol.value.set(h.bar[0]).multiplyScalar(h.bar[1]),p.uBarDir.value.set(...h.barDir).normalize(),we.barDir=p.uBarDir.value),h.low&&p.uLowFill.value.set(h.sunC[0]).multiplyScalar(h.low),h.bar&&(p.uBarDir2.value.set(-1,.62,.2).normalize(),p.uWallTint.value.setRGB(1.3,.92,.6),p.uNicheSun.value=.22),h.ceil&&p.uCeil.value.set(h.ceil[0]).multiplyScalar(h.ceil[1]),p.uReveal.value=h.reveal??1,p.uNicheAmb.value=h.nicheAmb??.8,p.uBody.value=h.body??1,p.uLowFloor.value=h.lowFloor??.8,h.rim&&p.uRim.value.set(h.rim[0]).multiplyScalar(h.rim[1]);{const b0=p.uAreaK.value,f0=.545*.6*b0/(1629+b0),ct=B.lime.clone().lerp(B.violet,.25).multiplyScalar(.62*.9),ut=p.uSky.value.clone().add(p.uBounce.value).multiplyScalar(.5*p.uNicheAmb.value).add(p.uGlowCol.value.clone().multiplyScalar(f0)).multiply(ct),j0=G0=>.2126*G0.r+.7152*G0.g+.0722*G0.b;we.dark=new a.Color(H0).multiplyScalar(Math.min(1,.8*j0(ut)/j0(L)))}j.uTop.value.set(h.top),j.uHor.value.set(h.hor),j.uWater.value.set(h.water),j.uDeep.value.set(h.deep),j.uSunCol.value.set(h.sunC[0]).multiplyScalar(Math.min(h.sunC[1],3)*(h.name==="storm"?.3:1)),j.uStars.value=h.stars,j.uWind.value=h.wind,j.uDhow.value=h.dhow,j.uSail.value.set(v===3?S.rust?"#ff7a4a":"#ffb894":S.rust?"#b4532a":"#f1ecdc").multiplyScalar(Me[v]),j.uSailK.value=Be[v],j.uBats.value=v>=3?1:0,j.uShimmer.value=h.name==="noon"||h.name==="afternoon"?1:0,j.uGain.value=Le[v]*(h.name==="storm"?1.7:1),j.uGlit.value=h.lamp?.9:h.wind>.8?.5:v===3?.6:1,ye.uShaft.value.set(...h.shaft),ye.uShaftCol.value.set(h.sunC[1]>.1?h.sunC[0]:h.glow[0]).multiplyScalar(h.lamp?.8:1.4),ye.uLace.value=h.lace;const o0=new a.Mesh(Y,ae),a0=new a.Mesh(te,t0),lt=new a.Mesh(z,k),L0=new a.Group;L0.position.set(-10,se,l0);const rt=new a.Mesh(J,ae);L0.add(rt),D.add(o0,a0,lt,L0),Object.assign(we,{mat:ae,sea:t0,shaft:k,room:o0,perch:L0,u:p,su:j,hu:ye});const E0=v===0?ce:ce.clone();E0.uniforms={uToLocal:ye.uToLocal,uSunDir:ye.uSunDir,uShaft:ye.uShaft,uTime:ye.uTime,uShaftCol:ye.uShaftCol};const _0=new a.Mesh(ve,E0);if(_0.renderOrder=2,D.add(_0),Q){const b0=v===0?G:G.clone(),f0=b0.uniforms;f0.uPool.value.copy(p.uGlowCol.value).multiplyScalar(.4).add(p.uSky.value).multiplyScalar(h.pool??1),f0.uLevel.value=v+1,f0.uHazeK.value=h.haze[1],D.add(new a.Mesh(Q,b0)),we.pu=f0}v===3&&(we.feather=new a.Mesh(A,ae),D.add(we.feather));const W0=v===0?fe:fe.clone(),C0=W0.uniforms,O0=v<4?m[v+1].door:["#9fd0ff",3.2];C0.uRoomCol.value.copy(p.uSky.value).add(p.uGlowCol.value.clone().multiplyScalar(.25)).add(p.uSunCol.value.clone().multiplyScalar(.02)).multiplyScalar(2.4),C0.uDoorCol.value.set(O0[0]).multiplyScalar(O0[1]*.35);const K0=new a.Mesh($,W0);K0.renderOrder=2,D.add(K0),we.gu=C0}v>0&&(we.archInv=new a.Matrix4,He.uArchInv.value=we.archInv,He.uDark.value=L,He.uDarkK.value=1),_.push(we),await u()}const Ce=X0([[0,18,-2],[0,17.4,-14],[3,13,-48],[4,12,-64],[0,18,-100],[0,18,-130],[0,18,-160],[0,18,-320],[0,18,-480],[0,18,-640],[0,18,-770]]),n=await so(Ce,v=>.6+.25*le(.14,.25,v)+.3*le(.25,.45,v)+.35*le(.45,.65,v)+.25*le(.65,.82,v)-.75*le(.82,.9,v),46,u),c=n.path,M=n.m,b=(v,F=0)=>n.uOf(M[v]+F);await u();const T=new a.Vector3,ue=new a.Vector3,W=new a.Vector3,K=400,Z=new Float32Array(K+1);for(let v=0;v<=K;v++)Z[v]=Ce.pointAt(v/K,T).z;const de=v=>{let F=0;for(;F<K&&Z[F+1]>v;)F++;const D=Z[F],U=Z[Math.min(F+1,K)];return Ae((F+(D-U>1e-6?(D-v)/(D-U):0))/K,0,1)},pe=new a.Vector3(0,18,Q0.z+1.5),Ge=c0.makeParticles({rng:t.fork("dust"),preset:"dust",count:Math.round(1700*f*r),follow:"xz",center:[0,8.6,0],box:[64,15,64],size:[.06,.2],colors:["#fff6e0","#f2e2c0","#dfe6ff"],intensity:.7});await u();const qe=c0.makeParticles({rng:t.fork("jasmine"),preset:"petals",follow:!1,center:[-2,9,-2*ie-56],box:[66,18,104],count:Math.round(620*f*r),velocity:[-12,-.2,1.5],size:[.4,.85],colors:["#ffffff","#f6f4ea","#eef4dc"],intensity:1.25,lightDir:[.9,.3,-.3]});await u();const We=c0.makeParticles({rng:t.fork("jasmine-streaks"),mode:"streak",shape:"streak",follow:!1,center:[0,13,-2*ie-52],box:[70,26,108],count:Math.round(360*f*r),velocity:[-21,-.5,2.2],velocityRandom:[9,2.5,5],turbulence:[1.3,.9,.8],size:[.15,.36],stretch:.12,colors:["#ffffff","#fbfbf0","#f2f6e2"],intensity:1.35,opacity:.95,additive:.25,near:[2.5,7]});We.setOpacity(0),qe.setOpacity(0),await u();const Oe=c0.makeGlow({position:[Qe[0],Qe[1],Qe[2]-4*ie+.6],color:D0[6],size:5.5,intensity:1.5,flicker:.25});Oe.object.visible=!1;const Fe=c0.makeGlow({position:[-9.5,19.6,l0-4*ie],color:"#ffe9a0",size:1.5,intensity:1.3});Fe.object.visible=!1;const Ke=[0,1,2,3].map(v=>new a.Vector3(0,B0.y-.05,B0.z+.5-ie*v)),Ve=[1,1,1,1],Xe=c0.makeGlows({positions:Ke,colors:[1,2,3,4].map(v=>m[v].door[0]),sizes:[1,1,1,1],size:2.7,intensity:2.3,flicker:.3}),Ne=[];for(let v=0;v<5;v++)for(const F of[16.5,4.5])for(const D of[-8.47,8.47])Ne.push([D,16.85,F-ie*v]);const je=[1,1,1,1,1],ge=c0.makeGlows({positions:Ne,color:"#ffb264",sizes:Ne.map(()=>1),size:2.6,intensity:1.15,flicker:.3});await u();const Re=new a.Mesh(new a.PlaneGeometry(60,60),new a.MeshBasicMaterial({color:H0,transparent:!0,opacity:1,fog:!1}));Re.position.set(0,18,-4*ie-xe-9),Re.renderOrder=-2,P.add(Ge.object,qe.object,We.object,Oe.object,Fe.object,Xe.object,ge.object,Re),await u();const Ie=[0,0,0,0,0],Ze=!!s.rare,s0=x!=="kaskazi",Ye=[.8,.7,.35,.4,.45],Ee=v=>[-10,19,l0-ie*v],e0=[{at:[17,6,-62],from:de(-10),to:de(-60),weight:.6}];for(let v=0;v<5;v++)e0.push({at:Ee(v),from:de((v===0?-58:-40)-ie*v),to:de(l0-1-ie*v),weight:v===3?Ze?0:.2:v===4?.2:.3});const _e=v=>de(v-3*ie),Pe={a:_e(-12),b:_e(-30),c:_e(-64.5),d:_e(-78.6),k1:_e(-42.6),k2:_e(-56.7)};Ze&&e0.push({at:[34,12,-80-3*ie],from:_e(-10),to:_e(-77),weight:.6});const Ue=[{at:new a.Vector3(-21.5,13,-111.5-2*ie),u:[b("turn3",-2),b("turn3",3),b("wall",4),b("wall",9)],w:1},{at:new a.Vector3(-10,18.9,l0-2*ie),u:[b("wall",4),b("wall",9),b("view",3),b("view",9)],w:.94},{at:new a.Vector3(33,10,-80-2*ie),u:[b("view",3),b("view",9),b("uturn3",-17),b("uturn3",-5)],w:1},{at:new a.Vector3(0,10.5,-113.2-3*ie),u:[b("dn",-16),b("dn",1),b("front",9),b("front",20)],w:1},{at:new a.Vector3(-12,19,-109-3*ie),u:[b("front",9),b("front",20),b("uturn4",-5),b("uturn4",3)],w:1}],M0=new a.Vector3,i0=new a.Vector3,w0=new a.Vector3,o=new a.Vector3;let l=12;const w=(v,F)=>{const D=n.Sof(F);n.R(D,i0),n.R(D+n.ahead(F,30),w0),w0.sub(i0).normalize();for(const U of Ue){const h=le(U.u[0],U.u[1],F)*(1-le(U.u[2],U.u[3],F))*U.w;h<=.001||(o.copy(U.at).sub(i0).normalize(),w0.multiplyScalar(1-h).addScaledVector(o,h).normalize())}return M0.copy(i0).addScaledVector(w0,30)};n.setAim(v=>w(l,v)),e0.unshift({at:w,from:.383,to:.662,weight:1,fade:.012});const q=[b("dn",-40),b("away",4)],N=new a.Quaternion,ke=new a.Quaternion,p0=new a.Vector3(1,0,0),S0=new a.Vector3(0,1,0),n0=(v,F,D,U)=>{N.setFromAxisAngle(S0,F*D),ke.setFromAxisAngle(p0,-F*U).multiply(N);const h=Math.sqrt(Math.max(1-ke.w*ke.w,1e-8));d0(v,ke.x/h,ke.y/h,ke.z/h,2*Math.acos(Ae(ke.w,-1,1)))},it=(v,F,D,U)=>{const h=v.u.uJ.value,He=v.look.pose;let we=.008*Math.sin(D*.9);if(h[0].set(0,1,0,0),h[1].set(0,0,1,0),h[2].set(0,0,1,0),h[3].set(0,0,1,0),He===0)d0(h[0],.12,1,.1,2.5+.04*Math.sin(D*1.6));else if(He===1){const ae=Math.max(0,Math.sin(D*.9))*Math.sin(D*9);d0(h[0],.4,1,.05,-2+.16*ae),n0(h[1],1,.5,.3+.12*Math.sin(D*.9)),d0(h[3],1,.2,0,-.8+.08*Math.sin(D*2.1)),we=.02*Math.sin(D*1.3)}else if(He===2){const ae=Math.sin(D*7.5);d0(h[0],0,0,1,-.3+.12*Math.sin(D*2.3)),n0(h[1],1,1.35,.62+.36*ae),n0(h[2],-1,1.35,.62+.36*Math.sin(D*7.5+.5)),d0(h[3],0,0,1,.3*Math.sin(D*3.1)),we=.24*Math.sin(D*1.45)+.06*Math.sin(D*3.9)}else if(He===3){const ae=Ae((10-(r0+ie*F))/110,0,1);we=(.02+.17*(1-le(0,.9,ae)))*Math.sin(D*1.5),v.feather&&(v.feather.position.set(-10+2.4*Math.sin(ae*9)+.3*Math.sin(D*.8),19.5-15.5*ae,l0+1+3*Math.sin(ae*5)),v.feather.rotation.set(ae*5+.3*Math.sin(D*1.1),0,ae*14+.5*Math.sin(D*.7)))}else{W.copy(U).applyMatrix4(v.inv);let ae=Math.atan2(-(W.z-l0),W.x+10)+Math.PI/2;ae>Math.PI&&(ae-=2*Math.PI),ae=Ae(ae,-2.4,2.4);const t0=ae-Math.PI/2,k=Math.cos(t0),p=Math.sin(t0),j=Math.abs(ae)<.2?1:-Math.sign(ae);h[0].set(0,1,0,ae),Fe.object.position.set(-10+.5*k+j*.52*p,se-26.8+2.44,l0+.08-.5*p+j*.52*k).applyMatrix4(v.content.matrixWorld)}v.perch.rotation.x=we};let r0=-2;const T0=[0,0],nt={shape:"circle",radius:7,color:"#9fd0ff",glow:1,revealDistance:1200,blendDistance:60};return{scene:P,path:c,duration:n.duration,pace:n.pace,camera:{fov:62,near:.3,far:1400,lookAhead:30,sway:.45,bank:.3},pois:e0,portal:nt,ride:"none",post:{exposure:1,bloom:{strength:.32,radius:.6,threshold:1},grade:{saturation:1,contrast:1.05,tint:"#ffffff",shadowTint:"#06081c",vignette:.3,grain:.02,aberration:0}},update(v,F,D,U=0){r0=n.zProg(Ae(U,0,1)),l=F,e.through||n.setEye(D.position);const h=Ae(Math.floor((20-r0)/ie),0,4);ue.setFromMatrixPosition(D.matrixWorld);for(let k=0;k<5;k++){const p=Ie[k]=le(56,104,-(r0+ie*k)),j=le(0,.62,p),ye=Math.pow(16,p-1),o0=_[k+1].group;o0.position.copy(B0).lerp(k===4?pe:Q0,j).addScaledVector(E,-ye),o0.scale.setScalar(ye)}const He=U>q[0]&&U<q[1];for(let k=0;k<6;k++)_[k].content.visible=k>=h&&k<=h+2&&(k<h+2||Ie[h]>.12||He);_[0].group.updateMatrixWorld(!0);{const k=Math.max(-r0,0),p=Math.min(Math.floor(k/ie),4);L.copy(_[p].dark).lerp(_[Math.min(p+1,4)].dark,le(xe+J0,ie,k-ie*p)),Re.material.color.copy(L)}for(let k=1;k<6;k++)_[k].archInv.copy(_[k-1].content.matrixWorld).invert();for(let k=0;k<2;k++){const p=F*.3+k*.5,j=Math.floor(p)+le(0,.12,p-Math.floor(p));T0[k]=(Math.abs((j+k*2)%6-3)-1.5)*1.1}for(let k=0;k<6;k++){const p=_[k],j=p.front,ye=j.uniforms;k>0&&j.setProgress(Ie[k-1]);const o0=k===h+1?Je(1,k===5?.75:.6,le(.3,.85,Ie[h])):k<=h?.6:1;if(ye.uSunCol.value.copy(p.base.sun).multiplyScalar(o0),ye.uSky.value.copy(p.base.sky).multiplyScalar(o0),ye.uBounce.value.copy(p.base.bounce).multiplyScalar(o0),j.update(v,F,D),!(!p.mat||!p.content.visible)){p.inv.copy(p.content.matrixWorld).invert(),p.u.uTime.value=p.su.uTime.value=p.hu.uTime.value=F,p.pu&&(p.pu.uTime.value=F);{const a0=_[k+1].group;p.gu.uTime.value=F,p.gu.uDoorAt.value.set(a0.position.x+a0.scale.x*E.x,a0.position.y+a0.scale.x*E.y,a0.position.z+a0.scale.x*E.z,16*a0.scale.x)}p.u.uSunDir.value.set(p.sun.x+.06*Math.sin(F*.21+k),p.sun.y,p.sun.z+.05*Math.cos(F*.17+k)).normalize(),p.hu.uSunDir.value.copy(p.barDir||p.u.uSunDir.value),p.su.uSunDir.value.copy(p.sun),p.u.uGeck.value[0].set(T0[0],0,0),p.u.uGeck.value[1].set(-T0[1],0,0),it(p,k,F,ue)}}const we=_[3].su.uEye.value;if(Ze){const k=le(Pe.a,Pe.b,U)*(1-le(Pe.c,Pe.d,U));W.copy(ue).applyMatrix4(_[3].inv);const p=27/Math.max(35-W.x,8);_[3].u.uFrond.value=le(.1,.6,k);const j=-80+Je(-3.2,2.6,le(Pe.a,Pe.d,U)),ye=60*(le(Pe.c,Pe.d,U)-(1-le(Pe.a,Pe.b,U)));we.set(j+(j-W.z)*p+ye,14.5+(14.5-W.y)*p-(1-k)*8,h===3?le(0,.25,k):0,Math.min(.9,st(U,Pe.k1,.0035)+st(U,Pe.k2,.0035)))}else we.z=0;Ge.setOpacity(Ye[h]*(.25+.75*le(1,-8,r0+ie*h))),Ge.update(v,F,D);const ae=h===2&&s0?1:0;qe.setOpacity(ae),qe.update(v,F,D),We.setOpacity(ae),We.update(v,F,D),Oe.object.visible=Fe.object.visible=h===4,Oe.update(v,F,D),Fe.update(v,F,D);for(let k=0;k<4;k++){const p=k===h?(1-le(.03,.3,Ie[k]))*le(12,34,ue.distanceTo(Ke[k])):0;(Math.abs(p-Ve[k])>.01||p===0&&Ve[k]!==0)&&(Ve[k]=p,Xe.setSize(k,p))}Xe.update(v,F,D);for(let k=0;k<5;k++){const p=k===0?1:le(.93,1,Ie[k-1]);if(p!==je[k]){je[k]=p;for(let j=0;j<4;j++)ge.setSize(k*4+j,p)}}ge.update(v,F,D);const t0=1-le(-4*ie+34,-4*ie+6,r0);Re.material.opacity=t0,Re.visible=t0>.004},dispose(){V.dispose()}}}};const st=(e,t,s)=>Math.exp(-((e-t)*(e-t))/(2*s*s));export{lo as default};
