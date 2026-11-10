import*as e from"three";import{clamp as ye,lerp as Z,smoothstep as X}from"../kit/core.js";import*as j from"../kit/fx.js";const Ye=["#121620","#3C4A66","#B9B2A6","#FFF6E0","#D9A441","#6E2A3A","#E07A3A"],O=130,re=130,Ge=26.4,qe=6,Ce=9,K=re+Math.sqrt(O*O-729),U=Math.PI/180,se=28,Le=new e.Vector3(0,re,0),ze=(t,i,o=new e.Vector3)=>o.set(-Math.sin(t)*Math.cos(i),Math.sin(i),Math.cos(t)*Math.cos(i)),ie=(t,i,o,f=new e.Vector3)=>ze(t,i,f).multiplyScalar(o).add(Le);function Xe(t,i){const o=i==="april"?58:76;let f,n;if(t<=.52){const d=(t-.09)/.43;f=75+105*d,n=12+(o-12)*d}else{const d=(t-.52)/.48;f=180+106*d,n=o-(o-14)*Math.pow(d,.6)}return{az:f,el:Math.max(n,5)}}function Ze(t,i){const o=s=>new e.Color(s),f=o(t[1]).lerp(o("#9aa2dc"),.6),n=o(t[3]),d=o(t[6]).lerp(o("#ffd9b0"),.15),a=o(t[4]).lerp(o("#fff0d0"),.3);if(i==="night"){const s=o("#d2dbf2"),y=o("#5b627a");return[[0,s,.5,y,.8,o("#0a1230"),.5],[.09,s,1.25,y,.9,o("#0c1638"),.6],[.52,o("#e4e9f6"),1.9,o("#666c82"),.95,o("#101c44"),.7],[1,o("#d6dcf2"),1.5,y,.9,o("#0c1638"),.6]]}const x=[[0,o("#ffa878"),2.2,f.clone(),1.05,o("#2a3266"),.7],[.09,o("#ffbc84"),3.7,f.clone(),1.45,o("#4a5aa6"),1.2],[.25,o("#ffdcae"),4.2,o("#8a93ae"),1.15,o("#4d86d6"),1.9],[.4,o("#ffeed6"),4.3,o("#95a6c0"),1.05,o("#5592e4"),2.2],[.52,n.clone(),4.3,o("#9db2cf"),1,o("#5a9cf0"),2.4],[.6,o("#ffe6b4"),4.3,o("#97a4c6"),1,o("#6a9ee8"),2.3],[.7,a,4.2,o("#8c8fb2"),1.05,o("#7fa0dc"),2],[.82,d.clone(),3.5,o("#807aa8"),1.4,o("#d98a78"),1.8],[1,d.clone().lerp(o(t[6]),.4),3.3,o("#6c6494"),1.3,o("#e0855a"),1.7]];if(i==="snow")for(const s of x)s[1]=s[1].clone().lerp(o("#e8eef8"),.75),s[2]*=.25,s[3]=s[3].clone().lerp(o("#aab4c6"),.6),s[4]*=1.15,s[5]=o("#c9d0dc"),s[6]=1.3;if(i==="april")for(const s of x)s[1]=s[1].clone().lerp(o("#fff4e4"),.25),s[2]*=.92,s[5]=s[5].clone().lerp(o("#bcd4f2"),.3);return x}function Je(t,i,o){let f=0;for(;f<t.length-2&&i>t[f+1][0];)f++;const n=t[f],d=t[f+1],a=X(0,1,ye((i-n[0])/(d[0]-n[0]),0,1));return o.sun.copy(n[1]).lerp(d[1],a),o.power=Z(n[2],d[2],a),o.fill.copy(n[3]).lerp(d[3],a).multiplyScalar(Z(n[4],d[4],a)),o.sky.copy(n[5]).lerp(d[5],a).multiplyScalar(Z(n[6],d[6],a)),o}function Ie(t,i){const f=K/Math.max(t.y,.001),n=t.x,d=t.z,a=Math.hypot(n,d),x=a>1e-4?129.2/a:1e9;if(f<=x)return i.set(-t.x*f,0,-t.z*f),"floor";const s=K-t.y*x;if(s<=re)return i.set(-t.x*x,s,-t.z*x),"drum";const y=K-re,G=-t.y*y,A=y*y-129.2*129.2,E=-G+Math.sqrt(Math.max(G*G-A,0));return i.set(-t.x*E,K-t.y*E,-t.z*E),"dome"}const be=j.GLSL_HASH+j.GLSL_VALUE_NOISE+`
#ifndef OCULUS_GLSL
#define OCULUS_GLSL
uniform vec3 uSunDir, uSunColor, uFill, uAmbient, uBouncePos, uBounceCol, uSky, uCandle;
uniform vec3 uLamp;       // lamp light welling up the drum at dusk (zero by day)
uniform float uBounceK;   // 1 / (reach of the bounce squared)
uniform float uHalo;      // strength of the glow round the disc of sun
uniform float uOuter;     // how bright the porch and the square stand next to the hall (1; lower once the eye is inside at night)
uniform vec4 uEye;     // x: y of the eye plane, y: clear radius, z: throat depth, w: cloud texture amount
uniform vec4 uCloud;   // xy: scroll (m), z: overall transmission 0..1, w: time
// cloud shadows crossing the eye, in eye-plane metres: 1 = clear
float ocCloudTex(vec2 h){
  vec2 q = (h + uCloud.xy)*0.021;
  float n = vnoise(q)*0.65 + vnoise(q*2.3 + 3.7)*0.35;
  return 1. - uEye.w*smoothstep(0.42, 0.74, n);
}
// 0..1: does the ray from p toward the sun pass through the bottom and the top of the throat?
float oculusSun(vec3 p){
  float sy = max(uSunDir.y, 0.02);
  vec2 k = uSunDir.xz/sy;
  vec2 h = p.xz + k*max(uEye.x - p.y, 0.);
  vec2 h2 = p.xz + k*max(uEye.x + uEye.z - p.y, 0.);
  float d = max(length(h), length(h2));
  return (1. - smoothstep(uEye.y - 6., uEye.y + 1.5, d))*ocCloudTex(h)*uCloud.z;
}
// the glow round the disc of sun: light scattered out of the shaft by its dust and thrown back by the lit stone, so the
// ellipse has no cut edge but a warm halo that dies away over some twenty metres
float ocHalo(vec3 p){
  float sy = max(uSunDir.y, 0.02);
  vec2 k = uSunDir.xz/sy;
  float d = max(length(p.xz + k*max(uEye.x - p.y, 0.)), length(p.xz + k*max(uEye.x + uEye.z - p.y, 0.)));
  float hl = 1. - smoothstep(uEye.y - 9., uEye.y + 30., d);
  return hl*hl*uCloud.z;
}
// soft light from the disc of sun: xyz direction to it, w strength
vec4 ocBounce(vec3 p){
  vec3 L = uBouncePos - p; float d2 = dot(L, L); float dl = sqrt(d2 + 1.);
  return vec4(L/dl, (1./(1. + d2*uBounceK))*(1. - smoothstep(120., 210., dl)));
}
// candle light on the stones round the drum: two tall candelabra inside each exedra, two small ones in each shrine,
// two in the portico. Positions repeat every 45 degrees, so the point is folded into one bay.
float ocCandleAt(vec3 d, vec3 n){ float d2 = dot(d, d); return (0.35 + 0.65*max(dot(n, -d)/sqrt(d2 + 1e-3), 0.))*30./(d2 + 14.); }
vec3 ocCandles(vec3 p, vec3 n){
  float r = length(p.xz);
  // at dusk the lamps of the exedrae throw their light up the wall above them: warm on the entablature and the attic,
  // dying away into the lowest coffers, strongest over the middle of each bay
  vec3 up = vec3(0.);
  if (r > 92. && p.y > 56. && p.z < 150.) {
    float bay = 0.6 + 0.4*cos(8.*atan(-p.x, p.z + 1e-5));
    up = uLamp*(smoothstep(56., 66., p.y)*exp(-max(p.y - 64., 0.)/30.)*bay*(0.5 + 0.5*max(-n.y, 0.)));
  }
  if (r < 92. || p.y > 76.) return up;
  float e = 0.;
  if (p.z > 150.) {
    e = ocCandleAt(p - vec3(18.2, 18.2, 174.), n) + ocCandleAt(p - vec3(-18.2, 18.2, 174.), n);
  } else {
    float az = atan(-p.x, p.z + 1e-5);
    float a1 = az - 0.7853982*floor(az/0.7853982 + 0.5);
    float c1 = cos(a1), s1 = sin(a1), sA = (-p.x*c1 - p.z*s1)/r, cA = (p.z*c1 - p.x*s1)/r;
    // bay frame: x runs clockwise along the wall, z outward through it
    vec3 q = vec3(s1*r, p.y, c1*r), nq = vec3(-n.x*cA - n.z*sA, n.y, -n.x*sA + n.z*cA);
    float door = step(0.3927, abs(az));
    e += door*(ocCandleAt(q - vec3(12.6, 21.2, 134.5), nq) + ocCandleAt(q - vec3(-12.6, 21.2, 134.5), nq));
    float a2 = az - 0.3926991; a2 -= 0.7853982*floor(a2/0.7853982 + 0.5);
    float c2 = cos(a2), s2 = sin(a2); sA = (-p.x*c2 - p.z*s2)/r; cA = (p.z*c2 - p.x*s2)/r;
    q = vec3(s2*r, p.y, c2*r); nq = vec3(-n.x*cA - n.z*sA, n.y, -n.x*sA + n.z*cA);
    e += 0.3*(ocCandleAt(q - vec3(5.4, 13.6, 124.1), nq) + ocCandleAt(q - vec3(-5.4, 13.6, 124.1), nq));
  }
  return uCandle*e + up;
}
// shadows of the big projecting mouldings on the drum wall, so that the disc of sun models the wall it lands on.
// One ring: a point at radius r and height y, under a moulding whose lip stands at radius ro between yb and yt, is in
// shadow when its ray toward the sun (which climbs k metres for every metre it travels inward) meets that lip.
float ocBand(float y, float r, float k, float yb, float yt, float ro){
  float yh = y + max(r - ro, 0.)*k;
  return 1. - smoothstep(yb - 0.6, yb + 0.6, yh)*(1. - smoothstep(yt - 0.5, yt + 2.5, yh))*step(y, yb + 0.6)*step(ro + 0.2, r);
}
// a slab standing out from the wall (the entablature of a shrine, the cornice over the door) in the frame of its bay:
// q = (along the wall, height, metres out from the wall), sl = the sun in that frame (along, out)
float ocSlab(vec3 q, vec2 sl, float ys, float hx, float zo){
  float t = (ys - q.y)/max(uSunDir.y, 0.05);
  float lx = abs(q.x + sl.x*t), lz = q.z + sl.y*t;
  return 1. - (1. - smoothstep(hx - 0.5, hx + 0.5, lx))*smoothstep(-0.9, -0.2, lz)*(1. - smoothstep(zo - 0.5, zo + 0.5, lz))*step(q.y, ys - 0.2);
}
float ocMould(vec3 p){
  float r = length(p.xz);
  if (r < 116. || p.y > 122. || p.z > 131.) return 1.;
  vec2 ni = -p.xz/r;
  float k = uSunDir.y/max(dot(uSunDir.xz, ni), 0.05);
  float s = ocBand(p.y, r, k, 64., 72., 127.6)*ocBand(p.y, r, k, 71.5, 79.6, 126.9)*ocBand(p.y, r, k, 121.5, 132.6, 125.8)*ocBand(p.y, r, k, 46.6, 48., 129.3);
  float az = atan(-p.x, p.z + 1e-5);
  // the shrine in the middle of every pier
  float a2 = az - 0.3926991; a2 -= 0.7853982*floor(a2/0.7853982 + 0.5);
  float mid = az - a2, sm = sin(mid), cm = cos(mid);
  vec2 sl = vec2(-cm*uSunDir.x - sm*uSunDir.z, sm*uSunDir.x - cm*uSunDir.z);
  s *= ocSlab(vec3(r*sin(a2), p.y, 130. - r*cos(a2)), sl, 31., 11.2, 7.);
  // the cornice over the door
  s *= ocSlab(vec3(-p.x, p.y, 130. - p.z), vec2(-uSunDir.x, -uSunDir.z), 48.6, 19., 4.2);
  return s;
}
// the portico (z 166..266, roofed at 84 m, open at both sides and in front) in the low sun: a point is lit when its ray
// toward the sun leaves under the roof beams by an open side, and does not meet one of the sixteen columns on the way
float ocPorchCol(vec3 p, vec2 sd, float xc){
  float t = (xc - p.x)/sd.x;
  if (t < 0. || abs(xc - p.x) < 6.5) return 1.;
  float zc = p.z + sd.y*t, dz = abs(mod(zc - 167.5, 25.) - 12.5);
  float inRow = step(168., zc)*step(zc, 267.);
  return 1. - inRow*(1. - smoothstep(3.6, 5.6, dz*abs(sd.x)/max(length(sd), 1e-3)));
}
// (the low sun is taken to stand in front of the porch, on the side it really is: it rakes across the door wall and
// the bronze leaves, and the columns lay their shadows over them)
vec3 ocPorchDir(){ return normalize(vec3(uSunDir.x + 0.25*sign(uSunDir.x + 1e-4), uSunDir.y*0.8, abs(uSunDir.z) + 0.5)); }
float ocPorch(vec3 p){
  if (p.z < 160.) return 0.;
  vec3 S = ocPorchDir();
  float sg = sign(S.x), t = min((62.*sg - p.x)/S.x, (266. - p.z)/S.z);
  float yE = p.y + S.y*t;
  float lit = 1. - smoothstep(78., 86., yE);
  vec2 sd = S.xz;
  return lit*ocPorchCol(p, sd, 56.*sg)*ocPorchCol(p, sd, 21.5*sg)*ocPorchCol(p, sd, -21.5*sg);
}
// diffuse light on a stone surface: sun through the eye (times your own shadow term), fill from the eye, bounce.
// In the sun a coloured stone keeps its depth: its albedo is pulled toward its own hue and held down against the
// white stone beside it (the eye is exposed for the white), so porphyry stays purple and giallo stays gold under a
// light that would otherwise bleach them.
vec3 oculusLightS(vec3 p, vec3 n, vec3 albedo, float ao, float shadow){
  float ndl = max(dot(n, uSunDir), 0.);
  vec3 toE = vec3(0., uEye.x, 0.) - p; toE /= max(length(toE), 1e-3);
  float fe = 0.16 + 0.84*max(dot(n, toE)*0.55 + 0.45, 0.);
  vec4 b = ocBounce(p);
  float bw = max(dot(n, b.xyz), 0.)*0.85 + 0.15;
  float mxa = max(albedo.r, max(albedo.g, albedo.b)), mna = min(albedo.r, min(albedo.g, albedo.b));
  vec3 deep = albedo*mix(vec3(1.), albedo/max(mxa, 0.04), 0.45)*(1. - 0.46*(1. - mna/max(mxa, 0.04)));
  return deep*(uSunColor*(ndl*shadow*oculusSun(p))) + albedo*((uFill*fe + uAmbient*(1.05 - 0.6*n.y))*ao + uBounceCol*(bw*b.w*ao) + ocCandles(p, n)*ao
    + uSunColor*vec3(1., 0.86, 0.66)*(ocHalo(p)*uHalo*(0.4 + 0.6*bw)*(0.5 + 0.5*ao)));
}
vec3 oculusLight(vec3 p, vec3 n, vec3 albedo, float ao){ return oculusLightS(p, n, albedo, ao, 1.); }
#endif
`,$e=j.GLSL_FOG_PARS_VERT+`
#ifdef COFFER
attribute vec4 aCofA; attribute vec4 aCofB; attribute vec2 aMisc;
varying vec4 vCofA; varying vec4 vCofB; varying vec2 vMisc;
#endif
varying vec3 vW; varying vec3 vN; varying vec3 vCol;
void main(){
  vec4 wp = vec4(position, 1.); vec3 n = normal;
  #ifdef USE_INSTANCING
  wp = instanceMatrix*wp; n = mat3(instanceMatrix)*n;
  #endif
  wp = modelMatrix*wp; vW = wp.xyz; vN = mat3(modelMatrix)*n;
  vCol = vec3(1.);
  #ifdef USE_COLOR
  vCol *= color.rgb;
  #endif
  #ifdef USE_INSTANCING_COLOR
  vCol *= instanceColor;
  #endif
  #ifdef COFFER
  vCofA = aCofA; vCofB = aCofB; vMisc = aMisc;
  #endif
  vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
`+j.GLSL_FOG_VERT+"}",We=`
uniform vec3 uPorph, uGold, uWhite, uGrey, uGreen; uniform float uSeed;
float ocVein(vec2 p, float f){ return 1. - smoothstep(0., 0.11, abs(sin(dot(p, vec2(.31, .23)) + f*6.))); }
vec3 mPorphyry(vec2 p){ float f = fbmLo(p*0.33); float sp = vnoise(p*8.), s2 = vnoise(p*3.1 + 4.);
  vec3 c = uPorph*(0.62 + 0.8*f); c = mix(c, c*vec3(0.55, 0.5, 0.75), smoothstep(.45, .8, s2)*.6);
  return c + vec3(.22, .13, .16)*smoothstep(.74, .92, sp)*0.3; }
vec3 mGiallo(vec2 p){ float f = fbmLo(p*0.2); float v = ocVein(p*1.3, f);
  vec3 c = uGold*(0.72 + 0.5*f); c = mix(c, c*vec3(1.1, .72, .55), smoothstep(.5, .85, vnoise(p*0.8 + 3.))*.55);
  // giallo antico: pale clasts in a deeper, redder ground, the whole crossed by rust veins
  float cl = vnoise(p*1.15 + 13.) - 0.3*vnoise(p*3.7);
  c = mix(c*vec3(0.9, 0.78, 0.66), c*vec3(1.07, 1.05, 0.98) + vec3(.02, .02, .012), smoothstep(.24, .44, cl));
  return mix(c, c*vec3(.5, .34, .32), clamp(v*.7 + ocVein(p.yx*2.1 + 4., f)*.4, 0., 1.)*.7); }
vec3 mWhite(vec2 p){ float f = fbmLo(p*0.17);
  float v = 1. - smoothstep(0., 0.34, abs(sin(dot(p, vec2(.31, .23)) + f*6.))), v2 = 1. - smoothstep(0., 0.3, abs(sin(dot(p.yx*1.7 + 9., vec2(.31, .23)) + f*6.)));
  return mix(uWhite*(0.84 + 0.2*f), uWhite*vec3(0.5, 0.46, 0.56), clamp(v*.6 + v2*.35, 0., 1.)*(0.3 + 0.5*fbmLo(p*0.6 + 3.))); }
vec3 mGranite(vec2 p){ float sp = vnoise(p*7.), s2 = vnoise(p*17. + 5.);
  return uGrey*(0.6 + 0.3*fbmLo(p*.3))*(0.8 + 0.35*sp) + vec3(.05)*step(.8, s2); }
vec3 mGreen(vec2 p){ float f = fbmLo(p*0.3); float sp = vnoise(p*5.), v = ocVein(p*1.1 + 5., f), v2 = ocVein(p.yx*2.3 + 2., f);
  vec3 c = uGreen*(0.55 + 0.85*f); c = mix(c, c*vec3(0.3, 0.42, 0.4), smoothstep(.4, .75, vnoise(p*1.7 + 8.))*.7);
  c = mix(c, vec3(.3, .36, .3), clamp(v*.5 + v2*.3, 0., 1.)*.6);
  return c + vec3(.16, .2, .15)*smoothstep(.76, .92, sp)*.4; }
float ocBox(vec2 p, vec2 b){ vec2 d = abs(p) - b; return max(d.x, d.y); }
float ocLine(float d, float w){ float aa = max(fwidth(d), 1e-4); return (1. - smoothstep(w, w + aa*1.5, abs(d)))*clamp(w*2.5/aa, 0., 1.); }
`,eo=j.GLSL_NOISE+j.GLSL_FOG_PARS_FRAG+be+`
uniform vec3 uColor; uniform float uGloss;
#ifdef OC_OPEN
uniform vec2 uOpen;    // gain of the sun and of the sky on what stands in the open square
#endif
varying vec3 vW; varying vec3 vN; varying vec3 vCol;
#ifdef COFFER
varying vec4 vCofA; varying vec4 vCofB; varying vec2 vMisc;
#endif
`,oo=`
void surface(vec3 p, inout vec3 n, float dist, out vec3 alb, out float ao, out float sh, out float gloss, out vec3 tint){
  vec3 q = p - vec3(0., 130., 0.); float ql = max(length(q), 1e-3); q /= ql;
  float fine = 1. - smoothstep(50., 200., dist);
  float az1 = atan(q.x, q.z + 1e-5), az2 = atan(-q.x, -q.z + 1e-5);
  float el = asin(clamp(q.y, -1., 1.));
  float sw = smoothstep(2.0, 2.9, abs(az1));
  vec2 c1 = vec2(az1*130., el*130.), c2 = vec2(az2*130. + 77., el*130.);
  vec2 w1 = c1 + 3.2*vec2(vnoise(c1*0.3), vnoise(c1*0.3 + 7.)), w2 = c2 + 3.2*vec2(vnoise(c2*0.3), vnoise(c2*0.3 + 7.));
  float trowel = mix(vnoise(w1*vec2(0.8, 2.3)), vnoise(w2*vec2(0.8, 2.3)), sw);
  float streak = mix(vnoise(c1*vec2(0.33, 0.035)), vnoise(c2*vec2(0.33, 0.035)), sw);
  float crk = mix(vnoise(w1*0.1), vnoise(w2*0.1), sw);
  float big = fbm(p*0.045);
  float pm = fbm(p*0.085 + 3.);
  float fine2 = 1. - smoothstep(18., 70., dist);
  float pits = vnoise(p*2.7), pit2 = smoothstep(0.78, 0.9, vnoise(p*5.3));
  // the smooth band round the eye (above the fifth ring) is seen close as we leave. No grain there: a broad soft tone,
  // trowel courses in rings, stains running down from the rim, and a little more light toward the eye
  float bandK = smoothstep(0.985, 1.03, el), bt = clamp((1.361 - el)/0.384, 0., 1.);
  alb = uColor*vCol*mix(0.7 + 0.55*big, 0.84 + 0.2*big, bandK);
  // old stucco still clinging in patches over the darker, cooler bare concrete
  float stucco = smoothstep(0.5, 0.54, pm);
  alb = mix(alb, mix(alb*vec3(0.86, 0.88, 0.92), alb*vec3(1.06, 1.03, 0.97), stucco), 1. - 0.75*bandK);
  // rain streaks only low on the dome (they would crowd into scratches round the eye); up there, soft broad stains
  float hi = smoothstep(0.62, 1.0, el);
  alb *= 1. - 0.38*smoothstep(0.48, 0.8, streak)*(0.4 + 0.6*big)*(1. - hi);
  alb *= 1. - 0.3*hi*smoothstep(0.42, 0.75, mix(vnoise(c1*vec2(0.035, 0.05) + 9.), vnoise(c2*vec2(0.035, 0.05) + 9.), sw))*(0.5 + 0.5*pm)*(1. - bandK);
  alb *= 1. + fine*((trowel - 0.5)*0.36 + (pits - 0.5)*0.22)*(1. - 0.92*bandK);
  alb *= 1. - 0.4*pit2*fine2*(1. - bandK);
  if (bandK > 0.001) {
    vec2 hq = q.xz/max(length(q.xz), 1e-4);
    float crs = el*130./0.85, cj = abs(fract(crs) - 0.5), cwd = 0.06 + dist*0.0025;
    float course = (0.95 + 0.1*hash12(vec2(floor(crs + 0.5), 7.)))*(1. - 0.14*(1. - smoothstep(cwd, cwd*2.2 + 0.04, cj))*clamp(0.2/cwd, 0., 1.));
    course = mix(1., course, 1. - smoothstep(90., 180., dist));
    float sa = vnoise(hq*13. + 3.), sb = vnoise(hq*37. + 11.), sl = 0.15 + 0.7*vnoise(hq*23. + 20.);
    float stain = smoothstep(0.56, 0.8, sa*0.6 + sb*0.4)*(1. - smoothstep(sl*0.3, sl, bt))*(0.6 + 0.4*smoothstep(0., 0.08, bt));
    float spill = (1. - bt)*(1. - bt);      // light from the sky in the eye spills a little way down the band
    alb *= mix(vec3(1.), course*(1. - 0.26*stain)*(0.74 + 1.25*spill)*mix(vec3(1.), vec3(1.22, 1.0, 0.82), spill), bandK);
    alb = mix(alb, alb*vec3(0.9, 0.97, 0.92), stain*0.4*bandK);     // a green-grey tinge where the water runs
  }
  // formwork: broad rings 2.7 m high, each pour a slightly different tone, with a soft lip between them
  float fb = el*130./2.7, fj = abs(fract(fb) - 0.5), fw = 0.05 + dist*0.0012;
  alb *= (0.94 + 0.12*hash12(vec2(floor(fb + 0.5), 3.)))*(1. - 0.1*(1. - smoothstep(fw, fw*2.5 + 0.03, fj))*clamp(0.16/fw, 0., 1.));
  // old settlement cracks: no more than a soft seam of darker stone, and nothing at all close to
  float cw = 0.035 + dist*0.0003;
  alb *= 1. - 0.13*(1. - smoothstep(0., cw, abs(crk - 0.5)))*smoothstep(0.45, 0.6, big)*smoothstep(20., 70., dist)*(1. - smoothstep(160., 320., dist));
  ao = 1.; sh = 1.; gloss = uGloss; tint = vec3(1.);
  #ifdef COFFER
  if (vMisc.y > 0.5) {
    // local frame of the sphere here: tA along azimuth, tE up the dome, -q into the room
    vec2 hz = q.xz/max(length(q.xz), 1e-4);
    vec3 tA = vec3(-hz.y, 0., hz.x);
    float ce = length(q.xz);
    vec3 tE = vec3(-hz.x*q.y, ce, -hz.y*q.y);
    float sn = dot(uSunDir, -q);
    vec2 shift = vec2(dot(uSunDir, tA), dot(uSunDir, tE))/max(sn, 0.06);
    if (vMisc.y < 1.5) {
      vec2 a = abs(vCofA.xy + shift) - vCofA.zw;            // wall of this step, 1 m high
      vec2 b = abs(vCofB.xy + shift*vMisc.x) - vCofB.zw;    // mouth of the coffer
      float m = max(max(a.x, a.y), max(b.x, b.y));
      sh = 1. - smoothstep(-0.35, 0.1, m);
      vec2 e = vCofA.zw - abs(vCofA.xy);
      ao = 0.62 + 0.38*smoothstep(0., 1.6, min(e.x, e.y));
      alb *= 1. - 0.22*(1. - smoothstep(0., 0.9, min(e.x, e.y)))*(0.5 + pits);
      alb *= 1. - 0.16*smoothstep(-0.3, 1., vCofA.y/max(vCofA.w, 0.1));        // soot gathers under the upper lip
    } else {
      ao = 0.62 + 0.38*(1. - fract(vMisc.x));               // risers darken toward the tread they stand on
      float fr = fract(vMisc.x);
      alb *= 1. + 0.38*(1. - smoothstep(0., 0.16, fr))*(0.3 + 1.1*trowel);   // worn, chipped arris
      alb *= 1. - 0.25*smoothstep(0.65, 1., fr);
      vec2 b = abs(vCofB.xy + shift*vMisc.x) - vCofB.zw;
      sh = 1. - smoothstep(-0.35, 0.1, max(b.x, b.y));
    }
    ao *= 1. - 0.15*floor(vMisc.x + 0.01);
    // far away the steps would alias: lean the normal toward the smooth sphere
    n = normalize(mix(n, -q, smoothstep(220., 380., dist)*0.4));
  }
  #endif
}
`,to=`
void surface(vec3 p, inout vec3 n, float dist, out vec3 alb, out float ao, out float sh, out float gloss, out vec3 tint){
  ao = 1.; sh = 1.; gloss = uGloss; tint = vec3(1.);
  float fine = 1. - smoothstep(40., 180., dist);
  #if defined(K_MARBLE)
  float f = fbm(p*0.11); float v = 1. - smoothstep(0., 0.2, abs(sin(p.y*0.27 + p.x*0.11 + p.z*0.13 + f*7.)));
  float v2 = 1. - smoothstep(0., 0.12, abs(sin(p.y*0.61 - p.x*0.37 + f*9. + 2.)));
  alb = uColor*vCol*(0.82 + 0.3*f);
  alb = mix(alb, alb*vec3(0.5, 0.36, 0.44) + vec3(0.03, 0.01, 0.03), clamp(v*0.7 + v2*0.4*fine, 0., 1.)*0.55);
  alb *= 1. + fine*(vnoise(p*1.9) - 0.5)*0.12;
  #elif defined(K_BRONZE)
  vec3 q = p - vec3(0., 130., 0.);
  float az = atan(q.x, q.z + 1e-5), rr = length(p.xz);
  vec2 pc = vec2(az*max(rr, 1.)/2.2, p.y/2.2); vec2 pf = fract(pc) - 0.5;
  float stud = 1. - smoothstep(0.12, 0.17, length(pf));
  float seam = 1. - smoothstep(0.015, 0.05, min(abs(pf.x), abs(pf.y)) + 0.0);
  float f = fbm(p*0.35);
  float drip = vnoise(vec2(az*rr*0.6, p.y*0.07));
  alb = uColor*vCol*(0.6 + 0.7*f);
  alb = mix(alb, vec3(0.19, 0.42, 0.34)*(0.5 + 0.7*f), smoothstep(0.52, 0.8, drip*0.7 + f*0.5)*0.55);
  #ifdef OC_RIM
  // the rim of the eye: cast plates of aged bronze, each a little darker or lighter than its neighbour, and verdigris
  // only where the rain runs down from the plants on its top
  float plate = hash12(floor(pc) + 5.);
  alb = uColor*vCol*(0.56 + 0.5*f)*(0.7 + 0.42*plate);
  alb = mix(alb, vec3(0.085, 0.2, 0.15)*(0.6 + 0.6*f), smoothstep(0.5, 0.8, drip*0.6 + f*0.5)*0.6*smoothstep(uEye.x + 2.5, uEye.x + 8.5, p.y));
  #endif
  #ifdef OC_LEAF
  // cast panels: a warm polish on what stands proud, verdigris and soot where the relief turns in
  float rub = vnoise(p*vec3(1.7, 0.5, 1.7));
  alb = uColor*vCol*(0.7 + 0.6*f)*(0.85 + 0.3*rub);
  alb = mix(alb, vec3(0.17, 0.36, 0.3)*(0.5 + 0.7*f), smoothstep(0.55, 0.85, drip*0.6 + f*0.5)*0.4*(1. - smoothstep(0.9, 1.3, max(vCol.r, vCol.g)*2.2)));
  gloss = uGloss*(0.9 + 0.7*rub); tint = vec3(1., 0.74, 0.44);
  #else
  float sfade = fine*(1. - smoothstep(30., 110., dist));
  alb *= 1. - 0.45*seam*(1. - stud)*sfade;
  alb = mix(alb, alb*1.9 + vec3(0.05, 0.035, 0.01), stud*sfade*0.8);
  gloss = uGloss*(0.6 + 0.6*stud*sfade + 0.4*f); tint = vec3(1., 0.72, 0.42);
  #endif
  #elif defined(K_GILT)
  float f = fbm(p*0.5), w = vnoise(p*1.3 + 4.), g2 = vnoise(p*7.);
  alb = uColor*vCol*(0.7 + 0.5*f);
  alb = mix(alb, vec3(0.2, 0.11, 0.05)*(0.7 + 0.6*f), smoothstep(0.56, 0.86, w)*0.4);    // gilding worn to bronze
  alb = mix(alb, vec3(0.16, 0.3, 0.24), smoothstep(0.7, 0.9, vnoise(p*0.6 + 11.))*0.3);  // a little verdigris
  alb *= 0.85 + 0.3*g2*fine;
  gloss = uGloss*(1. - 0.6*smoothstep(0.52, 0.8, w)); tint = vec3(1., 0.78, 0.36);
  #elif defined(K_EXTERIOR)
  float rr = length(p.xz);
  float f = fbm(p*0.05), s = vnoise(vec2(atan(p.x, p.z + 1e-5)*40., rr*0.05));
  alb = uColor*vCol*(0.65 + 0.5*f)*(1. - 0.25*smoothstep(0.5, 0.8, s));
  alb *= 1. - 0.3*(1. - smoothstep(0.03, 0.1, abs(fract(rr/3.4) - 0.5)))*fine;
  #elif defined(K_REVET)
  // marble revetment: white fields with grey-violet veins; coloured slabs (told by the chroma of the vertex colour) are
  // breccias: clouded, with dark veins and pale flecks, so they read as stone in shade and not as paint
  float f = fbm(p*0.11), f2 = fbm(p*0.37 + 7.3);
  float wv = f*7. + f2*2.2;
  float v = 1. - smoothstep(0., 0.1, abs(sin(p.y*0.27 + p.x*0.11 + p.z*0.13 + f*7.)));
  float v2 = 1. - smoothstep(0., 0.07, abs(sin(p.y*0.61 - p.x*0.37 + f*9. + 2.)));
  float v3 = 1. - smoothstep(0., 0.13, abs(sin(p.y*1.3 + p.x*0.7 - p.z*0.9 + wv*1.6)));
  float sp = vnoise(p*2.7 + 1.3), sp2 = vnoise(p*6.1 + 4.);
  vec3 base = uColor*vCol;
  float mx = max(base.r, max(base.g, base.b)), mn = min(base.r, min(base.g, base.b));
  float chroma = smoothstep(0.16, 0.34, (mx - mn)/max(mx, 1e-3));
  vec3 wht = base*(0.8 + 0.34*f);
  float sv = 1. - smoothstep(0., 0.36, abs(sin(p.y*0.27 + p.x*0.11 + p.z*0.13 + f*7.)));
  wht = mix(wht, wht*vec3(0.56, 0.5, 0.6), clamp(sv*0.7 + v2*0.25*fine, 0., 1.)*(0.25 + 0.5*f2));
  vec3 brc = base*(0.5 + 0.5*f + 0.4*f2);
  brc = mix(brc, mix(base, vec3(mx), 0.5)*1.25, smoothstep(0.56, 0.7, f2)*0.45);                 // paler clouds
  brc = mix(brc, base*vec3(0.34, 0.3, 0.36), clamp(v*0.8 + (v2*0.5 + v3*0.6)*fine, 0., 1.)*0.8);  // dark veins
  brc = mix(brc, mix(base, vec3(mx), 0.45)*1.35, smoothstep(0.62, 0.86, sp)*smoothstep(0.3, 0.7, sp2)*0.3*fine*smoothstep(8., 60., dist));   // pale clasts: none in a close look, where the veins carry it
  brc *= 1. + 0.5*(fbm(p*0.9 + 11.) - 0.5)*fine*(1. - smoothstep(30., 90., dist));
  alb = mix(wht, brc, chroma);
  float rr = length(p.xz), sa = atan(p.x, p.z + 1e-5)*max(rr, 1.);
  float crs = floor(p.y/5.8);
  vec2 sj = vec2(fract(sa/8.6 + 0.5*mod(crs, 2.)), fract(p.y/5.8));
  vec2 dj = (0.5 - abs(sj - 0.5))*vec2(8.6, 5.8);
  float jw = 0.05 + dist*0.0014;
  float jl = (1. - smoothstep(jw, jw*2.2, min(dj.x, dj.y)))*clamp(0.14/jw, 0., 1.);
  float wallF = abs(n.y) < 0.7 ? 1. : 0.;
  alb *= 1. - 0.3*jl*wallF;
  alb *= 1. + wallF*fine*(0.1*(1. - smoothstep(0.2, 1.2, (1. - sj.y)*5.8)) - 0.13*(1. - smoothstep(0.2, 1.0, sj.y*5.8)));
  alb *= (0.9 + 0.18*hash12(floor(vec2(sa/8.6 + 0.5*mod(crs, 2.), crs)) + 7.))*(1. + fine*(vnoise(p*1.9) - 0.5)*0.14);
  gloss = uGloss*(0.7 + 0.6*f);
  #elif defined(K_GRANITE)
  float f = fbm(p*0.06), sp = vnoise(p*5.5), s2 = vnoise(p*13. + 5.), s3 = vnoise(p*1.1 + 9.);
  float streak = vnoise(vec3(p.x*0.5, p.y*0.035, p.z*0.5));
  alb = uColor*vCol*(0.62 + 0.5*f)*(0.78 + 0.4*sp*mix(0.4, 1., fine));
  alb = mix(alb, alb*vec3(1.16, 0.96, 0.9), smoothstep(0.45, 0.8, s3)*0.5);
  alb += vec3(0.06, 0.055, 0.05)*step(0.82, s2)*fine;
  alb *= 1. - 0.3*smoothstep(0.5, 0.85, streak);
  gloss = uGloss*(0.6 + 0.8*sp);
  #ifdef OC_OUTER
  if (p.z > 166.2 && p.y < 84.) {
    // the porch: column shafts built of drums, the door wall of big blocks on a darker base course; light comes in by
    // the open front and sides, so what turns toward the door wall falls into shade
    float ax = abs(p.x), cz = mod(p.z - 167.5, 25.) - 12.5;
    float dcol = length(vec2(ax - (ax < 38.75 ? 21.5 : 56.), cz));
    float jf = 1. - smoothstep(60., 200., dist);
    if (dcol < 5.6 && p.z > 170.) {
      float jy = (p.y - 6.)/11.1, dj = (0.5 - abs(fract(jy) - 0.5))*11.1;
      alb *= (0.86 + 0.26*hash12(vec2(floor(jy), floor(p.x/30.) + 7.*floor(p.z/25.))))*(1. - 0.55*(1. - smoothstep(0.03, 0.14 + dist*0.002, dj))*jf);
      alb *= 1. + 0.12*(1. - smoothstep(0.1, 0.9, dj))*jf;
      ao *= 0.42 + 0.58*smoothstep(-0.95, 0.5, n.z);
    } else if (abs(n.y) < 0.5) {
      float crs = floor(p.y/7.);
      vec2 bq = vec2(fract((p.x + p.z)/14. + 0.5*mod(crs, 2.)), fract(p.y/7.)), bd = (0.5 - abs(bq - 0.5))*vec2(14., 7.);
      alb *= (0.88 + 0.22*hash12(vec2(floor((p.x + p.z)/14. + 0.5*mod(crs, 2.)), crs)))*(1. - 0.5*(1. - smoothstep(0.04, 0.16 + dist*0.002, min(bd.x, bd.y)))*jf);
      alb *= 1. - 0.3*(1. - smoothstep(6.6, 7.2, p.y));
      ao *= 0.6 + 0.4*smoothstep(0., 30., p.y);
    }
  }
  #endif
  #elif defined(K_PAVING)
  vec2 x = p.xz; float f = fbm(x*0.03);
  vec2 sl = x/6.; float st = hash12(floor(sl) + 3.), st2 = hash12(floor(sl)*1.7 + 9.);
  vec2 dj = (0.5 - abs(fract(sl) - 0.5))*6.;
  float jw = 0.05 + dist*0.0016;
  float jl = (1. - smoothstep(jw, jw*2.2, min(dj.x, dj.y)))*clamp(0.16/jw, 0., 1.);
  vec2 bd = abs(fract(x/18. + 0.5) - 0.5)*18.;
  float band = 1. - smoothstep(1.4, 1.5, min(bd.x, bd.y));
  vec3 trav = uColor*vCol*(0.74 + 0.34*st)*(0.8 + 0.4*f);
  trav = mix(trav, trav*vec3(1.08, 0.97, 0.86), step(0.6, st2));
  vec3 gran = uColor*vCol*vec3(0.42, 0.43, 0.47)*(0.7 + 0.5*vnoise(x*4.));
  alb = mix(trav, gran, band);
  alb *= 1. - 0.5*jl;
  alb *= 1. + fine*(vnoise(x*2.1) - 0.5)*0.2;
  alb *= 1. - 0.25*smoothstep(0.55, 0.85, vnoise(x*0.11 + 4.));
  gloss = uGloss*(0.5 + 0.8*st);
  #else
  alb = uColor*vCol*(0.85 + 0.3*fbm(p*0.13));
  alb *= 1. + fine*(vnoise(p*2.3) - 0.5)*0.14;
  #endif
}
`,ao=`
void surface(vec3 p, inout vec3 n, float dist, out vec3 alb, out float ao, out float sh, out float gloss, out vec3 tint){
  ao = 1.; sh = 1.; gloss = uGloss; tint = vec3(1.);
  float az = atan(p.x, -p.z + 1e-5);               // seam on the door axis
  float s = az*130., y = p.y;
  vec2 m = vec2(s, y);
  float bayW = 6.2831853*130./16.;
  float bi = floor(s/bayW + 8.);
  float bx = (fract(s/bayW + 8.) - 0.5)*bayW;
  float alt = mod(bi, 2.);
  float h1 = hash12(vec2(bi, 3. + uSeed)), fine = 1. - smoothstep(60., 260., dist);
  vec3 col = mWhite(m*0.5); float ln = 0.;
  if (y < 78.) {
    float pil = smoothstep(21.2, 21.5, abs(bx))*step(6., y)*step(y, 64.);
    col = mix(col, mGiallo(m*0.6)*(0.8 + 0.2*sin(bx*3.9)), pil);
    float dP = ocBox(vec2(bx, y - 35.), vec2(18., 25.));
    col = mix(col, mGiallo(m*0.45), 1. - smoothstep(-0.1, 0.1, dP));
    ln += ocLine(dP, 0.14) + ocLine(dP + 1.6, 0.1);
    float dM = alt < 0.5 ? length(vec2(bx, y - 35.)) - 9.5 : ocBox(vec2(bx, y - 35.), vec2(8., 14.));
    col = mix(col, mWhite(m*0.7), 1. - smoothstep(-0.1, 0.1, dM - 1.5));
    col = mix(col, h1 < 0.3 ? mGreen(m*0.6) : mPorphyry(m*0.6), 1. - smoothstep(-0.1, 0.1, dM));
    ln += ocLine(dM, 0.12) + ocLine(dM - 1.5, 0.1);
    col = mix(col, mGranite(m*0.5), 1. - smoothstep(5.9, 6.1, y));
    if (y > 64.) {
      col = mWhite(m*0.4)*(0.92 + 0.08*step(0.5, fract((y - 64.)/1.4)));
      col = mix(col, mPorphyry(m*0.5), step(68., y)*step(y, 73.));
      float teeth = step(75., y)*step(y, 76.6)*step(0.5, fract(s/1.7));
      col *= 1. - 0.45*teeth*fine;
      ln += ocLine(y - 68., 0.12) + ocLine(y - 73., 0.12) + ocLine(y - 64.1, 0.14);
      ao *= 0.8 + 0.2*smoothstep(64., 67., y);
    }
    ln += ocLine(y - 6., 0.12);
    ln += ocLine(abs(bx) - 21.4, 0.12)*step(6., y)*step(y, 64.);
    // slab joints
    vec2 sj = abs(fract(m/vec2(8.5, 6.)) - 0.5);
    ln += 0.35*(ocLine(sj.x*8.5, 0.05) + ocLine(sj.y*6., 0.05))*fine;
  } else {
    float yy = y - 78.;
    // slabs of the white field, each a little different, with drafted joints
    vec2 sq = vec2(s/8.6 + 0.5*mod(floor(yy/5.5), 2.), yy/5.5), sd = (0.5 - abs(fract(sq) - 0.5))*vec2(8.6, 5.5);
    col *= 0.8 + 0.28*hash12(floor(sq) + 3. + uSeed);
    ln += 0.7*(1. - smoothstep(0.06, 0.22 + dist*0.002, min(sd.x, sd.y)))*fine;
    // each slab is a little pillowed: its upper arris catches the light from the eye, its lower one is in shade
    float sfy = fract(sq.y)*5.5;
    col *= 1. + fine*(0.16*(1. - smoothstep(0.2, 1.3, 5.5 - sfy)) - 0.2*(1. - smoothstep(0.2, 1.1, sfy)));
    // where a ray toward the sun gets to for every metre of relief: (along the wall, up)
    vec2 tg = vec2(cos(az), sin(az));
    vec2 shf = vec2(dot(uSunDir.xz, tg), uSunDir.y)/max(dot(uSunDir.xz, vec2(-tg.y, tg.x)), 0.06);
    vec2 pw = vec2(bx, yy - 22.);
    // blind window with a pediment
    float dW = ocBox(vec2(bx, yy - 22.), vec2(6.6, 10.4));
    float dI = ocBox(vec2(bx, yy - 22.), vec2(5.0, 8.8));
    vec3 grille = vec3(0.13, 0.135, 0.16)*(0.6 + 0.8*step(0.25, abs(fract(bx/1.25) - 0.5))*step(0.25, abs(fract(yy/1.25) - 0.5)));
    col = mix(col, mWhite(m*0.9)*1.05, 1. - smoothstep(-0.1, 0.1, dW));
    col = mix(col, grille, 1. - smoothstep(-0.1, 0.1, dI));
    float ped = max(abs(bx)*0.62 + (yy - 39.), 33.2 - yy);
    col = mix(col, mWhite(m*0.9)*1.08, 1. - smoothstep(-0.1, 0.1, ped));
    ln += ocLine(dW, 0.12) + ocLine(dI, 0.16) + ocLine(ped, 0.12);
    ao *= 1. - 0.5*(1. - smoothstep(-0.1, 0.1, dI))*smoothstep(26., 31., yy);
    // the grille stands 1.6 m back in its frame; the frame and the pediment stand proud and throw their shadows down the wall
    sh *= 1. - (1. - smoothstep(-0.1, 0.1, dI))*smoothstep(-0.3, 0.2, ocBox(pw + shf*1.6, vec2(5.0, 8.8)));
    vec2 pp = vec2(bx, yy) + shf*1.3;
    sh *= 1. - (1. - smoothstep(-0.25, 0.25, max(abs(pp.x)*0.62 + (pp.y - 39.), 33.2 - pp.y)))*smoothstep(-0.1, 0.1, ped);
    sh *= 1. - 0.85*(1. - smoothstep(-0.2, 0.2, ocBox(pw + shf*0.6, vec2(6.6, 10.4))))*smoothstep(-0.1, 0.1, dW)*smoothstep(-0.1, 0.1, ped);
    // coloured panels either side
    float px = abs(bx);
    float pc = px < 16.8 ? 12.7 : 21.2;
    float dC = ocBox(vec2(px - pc, yy - 22.), vec2(3.3, 12.5));
    // up here in the shade the porphyry is a paler, redder slab than the bands below, or it goes out to a black opening;
    // it and the green are polished slabs and take a sheen of the eye's light
    vec3 pcol = px < 16.8 ? (alt < 0.5 ? mPorphyry(m*0.6)*vec3(1.9, 3.6, 1.3) + vec3(0.007) : mGreen(m*0.6)) : mGiallo(m*0.6);
    col = mix(col, pcol, 1. - smoothstep(-0.1, 0.1, dC));
    gloss = mix(gloss, 0.5, (1. - smoothstep(-0.1, 0.1, dC))*step(px, 16.8));
    ln += ocLine(dC, 0.12) + ocLine(dC - 0.9, 0.08);
    // the panels are let 0.5 m into the wall inside a raised fillet
    sh *= 1. - (1. - smoothstep(-0.1, 0.1, dC))*smoothstep(-0.2, 0.15, ocBox(vec2(px - pc + shf.x*sign(bx)*0.5, yy - 22. + shf.y*0.5), vec2(3.3, 12.5)));
    sh *= 1. - 0.8*(1. - smoothstep(-0.15, 0.15, ocBox(vec2(px - pc + shf.x*sign(bx)*0.3, yy - 22. + shf.y*0.3), vec2(4.2, 13.4))))*smoothstep(0.8, 1.0, dC);
    sh *= 1. - 0.9*smoothstep(43.6, 44.2, yy + shf.y*1.1)*(1. - smoothstep(43.9, 44.1, yy));
    // base band and upper cornice bands
    col = mix(col, mGranite(m*0.5)*1.15, 1. - smoothstep(4.9, 5.1, yy));
    col = mix(col, mWhite(m*0.4)*(0.9 + 0.1*step(0.5, fract(yy/1.5))), smoothstep(43.9, 44.1, yy));
    col = mix(col, mPorphyry(m*0.5), step(45.5, yy)*step(yy, 47.5));
    ln += ocLine(yy - 5., 0.12) + ocLine(yy - 44., 0.14);
    ao *= 0.75 + 0.25*(1. - smoothstep(46., 52., yy));
  }
  alb = col*vCol*(1. - 0.55*clamp(ln, 0., 1.));
  alb *= 1. + fine*(vnoise(m*2.1) - 0.5)*0.1;
}
`,so=`
uniform float uFloorSun;           // how much of the sun the paving takes (the eye stops down on the disc)
uniform float uFloorLift;          // extra soft light on the paving while the hall is held dark, so its inlays keep their colour
// wet stone draws a bright thing out into a long streak toward the eye: how much of a source standing at src (xz), hw
// metres wide, the mirror ray R from the floor point x picks up
float wetStreak(vec2 x, vec3 R, vec2 src, float hw){
  vec2 to = src - x; float rl = max(length(R.xz), 1e-3); vec2 rh = R.xz/rl;
  float miss = abs(rh.x*to.y - rh.y*to.x);
  return (1. - smoothstep(hw, hw*2.4 + 2., miss))*step(0., dot(rh, to))*smoothstep(0.02, 0.12, R.y)*(1. - smoothstep(0.45, 0.9, R.y));
}
uniform vec4 uWet, uMop, uSnow;    // wet circle (x, z, radius, amount); mop stripe (x0, z0, x1, z1); snow (radius, amount, mop amount, -)
void surface(vec3 p, inout vec3 n, float dist, out vec3 alb, out float ao, out float sh, out float gloss, out vec3 tint){
  ao = 1.; sh = uFloorSun; tint = vec3(1.);
  vec2 x = p.xz; float fine = 1. - smoothstep(60., 240., dist);
  vec2 g = x/18.; vec2 c = floor(g + 0.5); vec2 f = (g - c)*18.;
  float par = mod(c.x + c.y, 2.), h = hash12(c + uSeed), h2 = hash12(c*1.7 + 5. + uSeed);
  float bx = max(abs(f.x), abs(f.y));
  vec3 col; float ln = 0.;
  float dIn;
  if (par < 0.5) {
    dIn = length(f) - 6.3;
    vec3 disc = h < 0.6 ? mPorphyry(x*0.7) : mGranite(x*0.6);
    col = mix(disc, mGiallo(x*0.5), smoothstep(-0.05, 0.05, dIn));
    float dR = abs(dIn - 0.45) - 0.45;                      // white ring round the disc
    col = mix(col, mWhite(x*0.8), 1. - smoothstep(-0.05, 0.05, dR));
    ln += ocLine(dIn, 0.05) + ocLine(dIn - 0.9, 0.05);
  } else {
    dIn = bx - 4.9;
    vec3 sq = h < 0.5 ? mGiallo(x*0.5) : mPorphyry(x*0.7);
    col = mix(sq, mGranite(x*0.6)*1.1, smoothstep(-0.05, 0.05, dIn));
    float dR = abs(dIn - 0.4) - 0.4;
    col = mix(col, mWhite(x*0.8), 1. - smoothstep(-0.05, 0.05, dR));
    ln += ocLine(dIn, 0.05) + ocLine(dIn - 0.8, 0.05);
    // a small disc in the middle of every other square
    float dd = length(f) - 2.1;
    col = mix(col, h2 < 0.5 ? mGreen(x*0.8) : mPorphyry(x*0.8), (1. - smoothstep(-0.05, 0.05, dd))*step(0.4, h2));
    ln += ocLine(dd, 0.05)*step(0.4, h2);
  }
  col = mix(col, mWhite(x*0.6 + 31.), smoothstep(7.55, 7.65, bx));
  ln += ocLine(bx - 7.6, 0.05) + ocLine(bx - 9., 0.06);
  // slabs: slight tone steps and joints inside the bands and fields
  vec2 sl = x/3.; float st = hash12(floor(sl) + 11.);
  col *= 0.94 + 0.12*st*fine;
  vec2 sj = abs(fract(sl) - 0.5)*3.;
  ln += 0.3*fine*(ocLine(1.5 - sj.x, 0.03) + ocLine(1.5 - sj.y, 0.03))*smoothstep(7.5, 7.7, bx);
  // drains: bronze rosette of holes at the centre of the inner circle cells
  float rc = length(c)*18.;
  if (par < 0.5 && rc < 62.) {
    float r = length(f); float a5 = atan(f.y, f.x + 1e-5);
    float petal = length(vec2(r - 0.62, (fract(a5/1.0472) - 0.5)*0.65)) - 0.13;
    float hole = min(r - 0.2, petal);
    col = mix(col, vec3(0.3, 0.2, 0.09), (1. - smoothstep(0.95, 1.0, r)));
    col = mix(col, vec3(0.006), 1. - smoothstep(-0.02, 0.03, hole));
    ln += ocLine(r - 1.0, 0.04);
  }
  alb = col*(1. - 0.6*clamp(ln, 0., 1.));
  alb *= 1. + fine*(vnoise(x*3.1) - 0.5)*0.08;
  // wet: the shower's circle and the mopped stripe
  float wn = vnoise(x*0.13)*6. + vnoise(x*0.9)*1.2;
  float wet = uWet.w*(1. - smoothstep(uWet.z - 3., uWet.z + 0.5, length(x - uWet.xy) + wn - 3.));
  vec2 pa = x - uMop.xy, ba = uMop.zw - uMop.xy; float hm = clamp(dot(pa, ba)/max(dot(ba, ba), 1e-3), 0., 1.);
  float dm = length(pa - ba*hm);
  wet = max(wet, uSnow.z*(1. - smoothstep(3.2, 4.4, dm + wn*0.25))*(0.75 + 0.25*sin(dm*5. + x.x)));
  gWet = clamp(wet, 0., 1.);
  alb *= mix(1., 0.52, gWet);
  // rain landing in the circle under the eye: rings that open and fade
  float rainK = uSnow.w*(1. - smoothstep(uEye.y - 4., uEye.y + 1., length(x)))*(1. - smoothstep(45., 110., dist));
  if (rainK > 0.01) {
    vec2 ra = x/2.3, rb = x/3.1 + 5.37; vec2 ia = floor(ra), ib = floor(rb);
    float ha = hash12(ia + 17.), hb = hash12(ib + 41.);
    float ta = fract(uCloud.w*(1.0 + 0.7*ha) + ha*7.), tb = fract(uCloud.w*(0.8 + 0.6*hb) + hb*5.);
    vec2 ca = (fract(ra) - 0.5 - (vec2(hash12(ia + 3.), hash12(ia + 9.)) - 0.5)*0.4)*2.3, cb = (fract(rb) - 0.5 - (vec2(hash12(ib + 5.), hash12(ib + 13.)) - 0.5)*0.4)*3.1;
    float da = length(ca), db = length(cb), wdt = 0.07 + dist*0.004;
    float ga = (1. - smoothstep(0., wdt + 0.12*ta, abs(da - ta*0.95)))*(1. - ta)*(1. - ta), gb = (1. - smoothstep(0., wdt + 0.14*tb, abs(db - tb*1.3)))*(1. - tb)*(1. - tb);
    alb += vec3(0.42, 0.46, 0.52)*((ga + gb)*rainK*0.5); gRing = (ga + gb)*rainK;
    n = normalize(n + vec3(ca.x, 0., ca.y)*(ga*0.3*rainK/max(da, 0.08)) + vec3(cb.x, 0., cb.y)*(gb*0.3*rainK/max(db, 0.08)));
  }
  float sn = uSnow.y*(1. - smoothstep(uSnow.x*0.82, uSnow.x + 0.5, length(x) + (vnoise(x*0.22) - 0.5)*7. + (vnoise(x*1.3) - 0.5)*2.));
  gSnow = clamp(sn, 0., 1.);
  alb = mix(alb, vec3(0.8, 0.84, 0.9)*(0.9 + 0.1*vnoise(x*2.)), gSnow);
  gloss = mix(mix(0.55, 1., gWet), 0.05, gSnow);
}
`,lo=`
void main(){
  vec3 V = cameraPosition - vW; float dist = length(V); V /= max(dist, 1e-3);
  vec3 n = normalize(vN + vec3(0., 1e-6, 0.)); if (!gl_FrontFacing) n = -n;
  vec3 alb, tint; float ao, sh, gloss; vec3 gOpen = vec3(0.); float gOw = 0., gPorch = 0.;
  surface(vW, n, dist, alb, ao, sh, gloss, tint);
  #if defined(K_EXTERIOR)
  vec3 col = alb*(uSunColor*(max(dot(n, uSunDir), 0.)*uCloud.z*0.5) + uSky*(0.24 + 0.2*n.y) + uAmbient);
  #elif defined(OC_OPEN)
  // out in the square, in the open sun: seen from the hall through the door it is a glare
  vec3 col = alb*(uSunColor*((max(dot(n, uSunDir), 0.)*0.92 + 0.08)*(0.25 + 0.75*uCloud.z)*uOpen.x) + (uSky*(0.6 + 0.4*n.y) + uAmbient*2.)*uOpen.y)*uOuter;
  #else
  #if !defined(K_FLOOR) && !defined(K_CONCRETE)
  if (oculusSun(vW) > 0.003) sh *= ocMould(vW);
  #endif
  #ifdef OC_OUTER
  // beyond the door wall (z > 130): the sun only reaches in through the doorway, and the open sky lights the portico
  if (vW.z > 130.) {
    float sz = min(uSunDir.z, -0.02);
    vec3 dq = vW + uSunDir*((130. - vW.z)/sz);
    sh *= (1. - smoothstep(10.5, 12., abs(dq.x)))*(1. - smoothstep(42., 44., dq.y))*step(uSunDir.z, -0.02);
  }
  #endif
  vec3 col = oculusLightS(vW, n, alb, ao, sh);
  #ifdef K_BRONZE
  // the rim of the eye stands in the open sky: its inner face takes a sheen of it all the way round
  col += alb*uSky*(0.14*smoothstep(246., 258., vW.y)*(0.6 + 0.4*abs(n.y)));
  #endif
  #ifdef OC_OUTER
  {
    gOw = smoothstep(126., 172., vW.z);
    vec3 os = uSky*(0.62 + 0.3*n.y) + uSunColor*0.035;
    gOpen = (os*(1./(dot(os, vec3(0.3, 0.5, 0.2)) + 0.16)) + uAmbient)*uOuter;      // the eye adapts in the shade of the porch
    vec3 pd = ocPorchDir(); float pnl = max(dot(n, pd), 0.);
    float porch = ocPorch(vW)*(0.3 + 0.7*uCloud.z)*uOuter;
    gPorch = porch*step(0.001, pnl);
    vec3 psun = uSunColor*vec3(1., 1.12, 0.86)/(dot(uSunColor, vec3(0.3, 0.5, 0.2)) + 0.6);     // the eye adapts in the porch
    col = mix(col, alb*(uSunColor*(max(dot(n, uSunDir), 0.)*sh*oculusSun(vW)) + psun*(pnl*porch*1.5) + gOpen*ao*(1. - 0.3*(1. - porch)*smoothstep(160., 172., vW.z))), gOw);
  }
  #endif
  vec3 R = reflect(-V, n);
  float lit = oculusSun(vW)*sh*step(0., dot(n, uSunDir));
  vec4 b = ocBounce(vW);
  float fr = 1. - max(dot(V, n), 0.); float F = 0.1 + 0.9*fr*fr*fr*fr*fr;
  float sg = pow(max(dot(R, uSunDir), 0.), mix(10., 160., gloss))*lit;
  float bg = pow(max(dot(R, b.xyz), 0.), mix(3., 30., gloss));
  float sg2 = pow(max(dot(R, uSunDir), 0.), 9.)*lit;
  col += tint*gloss*(uSunColor*(sg*0.6 + sg2*0.22*gloss) + uBounceCol*(bg*b.w*1.5) + uFill*(0.5*smoothstep(-0.2, 0.8, R.y)*ao))*(0.35 + 0.65*F);
  #ifdef OC_OUTER
  col += tint*gloss*gOpen*(gOw*(0.2 + 0.8*F));
  col += tint*gloss*uSunColor*(pow(max(dot(R, ocPorchDir()), 0.), mix(8., 60., gloss))*gPorch*gOw*0.35);
  #endif
  #ifdef K_FLOOR
  float Ry = max(R.y, 0.03);
  vec2 hE = vW.xz + R.xz*((uEye.x - vW.y)/Ry);
  float blur = mix(15., 5., gWet);
  float eyeRef = 1. - smoothstep(uEye.y - blur, uEye.y + blur, length(hE));
  col += (uSky*(eyeRef*mix(0.75, 1.1, gWet)) + uFill*0.3)*F*(1. - gSnow);
  col += uSky*(eyeRef*gWet*0.07) + (uSky*0.35 + uFill*0.9)*(gRing*0.5);     // the wet circle mirrors the eye; each ring of a drop glints
  if (gWet > 0.01) {
    // and it doubles the bright doorway and the lamps of the exedrae either side of it as long streaks
    float fw = (0.2 + 0.8*fr*fr)*gWet*(1. - gSnow)*clamp(uWet.w*2., 0., 1.);      // (the shower's water only: the mopped stripe is a film)
    float cs = wetStreak(vW.xz, R, vec2(-104., 86.2), 1.2) + wetStreak(vW.xz, R, vec2(-86.2, 104.), 1.2) + wetStreak(vW.xz, R, vec2(104., 86.2), 1.2) + wetStreak(vW.xz, R, vec2(86.2, 104.), 1.2);
    col += ((uSky*0.45 + uFill*2.2)*(wetStreak(vW.xz, R, vec2(0., 130.), 8.)*uOuter) + uCandle*(cs*0.22) + vec3(1., 0.5, 0.2)*(cs*0.25))*fw;
  }
  col += alb*(uFill*1.7 + uAmbient*1.3 + uSky*0.03)*uFloorLift;
  #endif
  #endif
  #ifdef OC_RIM
  {
    // aged bronze under a coloured sky: copper where the low sun strikes it, brown-violet in the shade (the red of the
    // evening on brown metal would otherwise come out as paint)
    float l = dot(col, vec3(0.3, 0.5, 0.2));
    float warm = clamp((uSunColor.r - uSunColor.b)/max(uSunColor.r, 1e-3)*2., 0., 1.);
    float w = smoothstep(0.02, 0.3, oculusSun(vW)*max(dot(n, uSunDir), 0.)*sh)*warm;
    col = mix(col, l*mix(vec3(1.36, 0.83, 0.62), vec3(1.6, 0.82, 0.36), w), 0.8)*mix(2.1, 1.5, w);
  }
  #endif
  gl_FragColor = vec4(fxApplyFog(col), 1.);
}
`;function ce(t,i,o={}){const f={};f["K_"+i.toUpperCase()]=1,o.coffer&&(f.COFFER=1),o.outer&&(f.OC_OUTER=1),o.open&&(f.OC_OPEN=1);const n=i==="concrete"?oo:i==="drum"?We+ao:i==="floor"?`float gWet = 0.; float gSnow = 0.; float gRing = 0.;
`+We+so:to;return new e.ShaderMaterial({defines:f,fog:!0,vertexColors:!!o.vertexColors,side:o.side??e.FrontSide,uniforms:{...t,...j.fogUniforms(),uColor:{value:new e.Color(o.color??"#ffffff")},uGloss:{value:o.gloss??.1},...o.uniforms||{}},vertexShader:$e,fragmentShader:eo+n+lo})}const ue=[3,15.2,27,38,47.8,56],no=.105,ro=.12,io=.075,co=.8,De=.105;function fo(t,i){const o=Math.PI/se,f=ue[t]*U,n=ue[t+1]*U,d=n-f,a=f+d*De,x=n-d*De,s=x-a;return{hw:o*(co-no*i),eb:a+s*ro*i,et:x-s*io*i}}function Ne(t,i,o){const f=[];for(let n=0;n<i;n++)f.push([Z(-t.hw,t.hw,n/i),t.eb]);for(let n=0;n<o;n++)f.push([t.hw,Z(t.eb,t.et,n/o)]);for(let n=0;n<i;n++)f.push([Z(t.hw,-t.hw,n/i),t.et]);for(let n=0;n<o;n++)f.push([-t.hw,Z(t.et,t.eb,n/o)]);return f}function ho(t){const f=[],n=[],d=[],a=[],x=[],s=[],y=ue[t]*U,G=ue[t+1]*U,A=(y+G)/2,E=Math.cos(A),m=[0,1,2,3].map(l=>fo(t,l)),r=l=>l*O*E,R=l=>(l-A)*O,P=m.map(l=>({cy:R((l.eb+l.et)/2),hx:l.hw*O*E,hy:(l.et-l.eb)/2*O})),p=new e.Vector3,I=new e.Vector3,W=new e.Vector3,D=new e.Vector3,g=new e.Vector3,T=new e.Vector3,V=new e.Vector3,h=(l,b,w,B,v)=>{f.push(b.x,b.y,b.z),n.push(V.x,V.y,V.z);const F=r(l[0]),q=R(l[1]),H=P[w],Q=P[0];d.push(F,q-H.cy,H.hx,H.hy),a.push(F,q-Q.cy,Q.hx,Q.hy),x.push(l[3],B),s.push(v)},u=(l,b,w,B,v,F,q)=>{ie(l[0],l[1],l[2],p),ie(b[0],b[1],b[2],I),ie(w[0],w[1],w[2],W),ie(B[0],B[1],B[2],D),g.subVectors(I,p),T.subVectors(W,p),V.crossVectors(g,T),V.lengthSq()<1e-10&&(g.subVectors(W,p),T.subVectors(D,p),V.crossVectors(g,T)),V.normalize(),h(l,p,v,F,q),h(b,I,v,F,q),h(w,W,v,F,q),h(l,p,v,F,q),h(w,W,v,F,q),h(B,D,v,F,q)},L=(l,b,w,B,v,F,q,H,Q)=>{const ee=l.length;for(let N=0;N<ee;N++){const Y=(N+1)%ee;u([l[N][0],l[N][1],b,w],[l[Y][0],l[Y][1],b,w],[B[Y][0],B[Y][1],v,F],[B[N][0],B[N][1],v,F],q,H,Q)}},C={hw:Math.PI/se,eb:y,et:G},S=m.map(l=>Ne(l,4,3));L(Ne(C,4,3),O,0,S[0],O,0,0,0,1.06);for(let l=0;l<4;l++)L(S[l],O+l,l,S[l],O+l+1,l+.999,l,2,.97),l<3&&L(S[l],O+l+1,l+1,S[l+1],O+l+1,l+1,l,1,1);const M=m[3];for(let l=0;l<4;l++)for(let b=0;b<3;b++){const w=Z(-M.hw,M.hw,l/4),B=Z(-M.hw,M.hw,(l+1)/4),v=Z(M.eb,M.et,b/3),F=Z(M.eb,M.et,(b+1)/3);u([w,v,O+4,4],[B,v,O+4,4],[B,F,O+4,4],[w,F,O+4,4],3,1,.94)}return{P:f,N:n,A:d,B:a,M:x,T:s,panel:{el:(M.eb+M.et)/2,hx:P[3].hx,hy:P[3].hy}}}function ke(t,i,o,f){const n=t.length,d=new Float32Array(n*i*3),a=new Float32Array(n*i*3),x=[];for(let y=0;y<i;y++){const G=y/i*Math.PI*2,A=Math.cos(G),E=Math.sin(G);for(let m=0;m<n;m++){const r=(y*n+m)*3,R=(t[m][2]??1)*(f?f(y,m):1);d[r]=t[m][0]*E,d[r+1]=t[m][1],d[r+2]=t[m][0]*A,a[r]=o.r*R,a[r+1]=o.g*R,a[r+2]=o.b*R}}for(let y=0;y<i;y++){const G=(y+1)%i;for(let A=0;A<n-1;A++){const E=y*n+A,m=G*n+A;x.push(E,m,E+1,m,m+1,E+1)}}const s=new e.BufferGeometry;return s.setAttribute("position",new e.BufferAttribute(d,3)),s.setAttribute("color",new e.BufferAttribute(a,3)),s.setIndex(x),s.computeVertexNormals(),s}async function uo(t,i,o){const f=[];for(let h=0;h<5;h++)f.push(ho(h)),await t.yield();let n=0;for(const h of f)n+=h.P.length/3*se;const d=112,a=[[0,ue[0],1],[ue[5],78,7]];let x=0;for(const h of a)x+=d*h[2]*6;const s=[[130.4,121.5,.8],[128.7,122.6,1.02],[128.7,124.6,1.1],[127.3,125.5,.85],[127.3,127.8,1.12],[125.8,128.7,.9],[125.8,130.5,1.16],[127.6,131,.95],[129.3,131.3,1],[130.2,132.6,1]],y=d*(s.length-1)*6,G=n+x+y,A=new Float32Array(G*3),E=new Float32Array(G*3),m=new Float32Array(G*3),r=new Float32Array(G*4),R=new Float32Array(G*4),P=new Float32Array(G*2);let p=0;const I=new e.Color;for(let h=0;h<5;h++){const u=f[h],L=u.P.length/3;for(let C=0;C<se;C++){(C&3)===0&&await t.yield();const S=(C+.5)/se*Math.PI*2,M=Math.cos(S),l=Math.sin(S),b=.9+.2*i(),w=i.range(-.05,.05),B=i.chance(.12)?i.range(.82,1.14):1;for(let v=0;v<L;v++,p++){const F=u.P[v*3],q=u.P[v*3+1],H=u.P[v*3+2],Q=u.N[v*3],ee=u.N[v*3+1],N=u.N[v*3+2];A[p*3]=F*M-H*l,A[p*3+1]=q,A[p*3+2]=H*M+F*l,E[p*3]=Q*M-N*l,E[p*3+1]=ee,E[p*3+2]=N*M+Q*l;const Y=u.T[v]*b*(u.M[v*2+1]>.5?B:1);m[p*3]=o.r*Y*(1+w),m[p*3+1]=o.g*Y,m[p*3+2]=o.b*Y*(1-w),r.set([u.A[v*4],u.A[v*4+1],u.A[v*4+2],u.A[v*4+3]],p*4),R.set([u.B[v*4],u.B[v*4+1],u.B[v*4+2],u.B[v*4+3]],p*4),P[p*2]=u.M[v*2],P[p*2+1]=u.M[v*2+1]}}}await t.yield();const W=new e.Vector3,D=new e.Vector3,g=(h,u,L)=>{ie(h,u,O,W),D.copy(Le).sub(W).normalize(),A[p*3]=W.x,A[p*3+1]=W.y,A[p*3+2]=W.z,E[p*3]=D.x,E[p*3+1]=D.y,E[p*3+2]=D.z,m[p*3]=o.r*L,m[p*3+1]=o.g*L,m[p*3+2]=o.b*L,p++};for(const[h,u,L]of a)for(let C=0;C<L;C++)for(let S=0;S<d;S++){const M=S/d*Math.PI*2,l=(S+1)/d*Math.PI*2,b=Z(h,u,C/L)*U,w=Z(h,u,(C+1)/L)*U,B=L>1?1.08:1.02;g(M,b,B),g(l,b,B),g(l,w,B),g(M,b,B),g(l,w,B),g(M,w,B)}const T=(h,u)=>{const L=h/d*Math.PI*2,C=s[u],S=Math.min(u+1,s.length-1),M=Math.max(u-1,0),l=s[S][0]-s[M][0],b=s[S][1]-s[M][1],w=Math.hypot(l,b)||1,B=-b/w,v=l/w,F=1;A[p*3]=-Math.sin(L)*C[0],A[p*3+1]=C[1],A[p*3+2]=Math.cos(L)*C[0],E[p*3]=-Math.sin(L)*B*F,E[p*3+1]=v*F,E[p*3+2]=Math.cos(L)*B*F;const q=C[2]*1.25;m[p*3]=o.r*q*1.04,m[p*3+1]=o.g*q,m[p*3+2]=o.b*q*.94,p++};for(let h=0;h<d;h++)for(let u=0;u<s.length-1;u++)T(h,u),T(h+1,u),T(h+1,u+1),T(h,u),T(h+1,u+1),T(h,u+1);const V=new e.BufferGeometry;return V.setAttribute("position",new e.BufferAttribute(A,3)),V.setAttribute("normal",new e.BufferAttribute(E,3)),V.setAttribute("color",new e.BufferAttribute(m,3)),V.setAttribute("aCofA",new e.BufferAttribute(r,4)),V.setAttribute("aCofB",new e.BufferAttribute(R,4)),V.setAttribute("aMisc",new e.BufferAttribute(P,2)),{geometry:V,panels:f.map(h=>h.panel)}}async function mo(t,i,o,f){const d=[[.09,.09,.97,.97,1.35,1.35],[.17,.17,.72,.72,1.05,1.05],[.2,.2,.42,.42,.45,.45],[.3,.34,.42,.68,.32,1.25],[.36,.6,.36,.5,.3,1.3],[.4,.63,.33,.28,.32,.4],[.72,.66,.58,.2,1.25,.28],[1,.7,.34,.1,1.35,.26],[1.12,1.12,.02,.02,.5,.5],[1.18,1.18,.2,.2,1.1,1.1],[1.3,1.3,.2,.2,1.2,1.2],[1.36,1.36,0,0,.55,.55]],a=1+d.length*16,x=new Float32Array(a*3),s=new Float32Array(a),y=[];x.set([0,0,1]),s[0]=1.4;for(let h=0;h<d.length;h++)for(let u=0;u<16;u++){const L=u/16*Math.PI*2,C=u&1,S=1+h*16+u,M=d[h][C],l=d[h][2+C];x[S*3]=Math.cos(L)*M,x[S*3+1]=Math.sin(L)*M,x[S*3+2]=l,s[S]=d[h][4+C]}for(let h=0;h<16;h++){const u=(h+1)%16;y.push(0,1+h,1+u)}for(let h=0;h<d.length-1;h++)for(let u=0;u<16;u++){const L=(u+1)%16,C=1+h*16+u,S=1+h*16+L,M=C+16,l=S+16;y.push(C,M,S,S,M,l)}const G=new e.BufferGeometry;G.setAttribute("position",new e.BufferAttribute(x,3)),G.setIndex(y),G.computeVertexNormals();const A=G.attributes.normal.array;G.dispose();const E=5*se,m=new Float32Array(E*a*3),r=new Float32Array(E*a*3),R=new Float32Array(E*a*3),P=[],p=new e.Vector3,I=new e.Vector3,W=new e.Vector3,D=new e.Vector3;let g=0,T=0;for(let h=0;h<5;h++)for(let u=0;u<se;u++){(u&7)===0&&await t.yield();const L=(u+.5)/se*Math.PI*2,C=o[h].el;ie(L,C,O+3.95,p),I.copy(Le).sub(p).normalize(),W.set(-Math.cos(L),0,-Math.sin(L)),D.crossVectors(W,I).normalize(),D.y<0&&D.negate();const S=Math.min(o[h].hx,o[h].hy)*.6,M=S*.62,l=i.range(.8,1.15),b=i.range(0,Math.PI),w=Math.cos(b),B=Math.sin(b);for(let v=0;v<a;v++,g++){const F=x[v*3]*w-x[v*3+1]*B,q=x[v*3]*B+x[v*3+1]*w,H=x[v*3+2];m[g*3]=p.x+(W.x*F+D.x*q)*S+I.x*H*M,m[g*3+1]=p.y+(W.y*F+D.y*q)*S+I.y*H*M,m[g*3+2]=p.z+(W.z*F+D.z*q)*S+I.z*H*M;const Q=A[v*3]*w-A[v*3+1]*B,ee=A[v*3]*B+A[v*3+1]*w,N=A[v*3+2]*1.6,Y=W.x*Q+D.x*ee+I.x*N,oe=W.y*Q+D.y*ee+I.y*N,de=W.z*Q+D.z*ee+I.z*N,fe=Math.hypot(Y,oe,de)||1;r[g*3]=Y/fe,r[g*3+1]=oe/fe,r[g*3+2]=de/fe;const te=s[v]*l;R[g*3]=f.r*te,R[g*3+1]=f.g*te,R[g*3+2]=f.b*te}for(let v=0;v<y.length;v++)P.push(y[v]+T);T+=a}await t.yield();const V=new e.BufferGeometry;return V.setAttribute("position",new e.BufferAttribute(m,3)),V.setAttribute("normal",new e.BufferAttribute(r,3)),V.setAttribute("color",new e.BufferAttribute(R,3)),V.setIndex(P),V}const po=`
// distance along -S from a point Q of the eye plane to the first room surface (floor, drum, dome)
float ocBeamHit(vec3 Q, vec3 S){
  const float K = 129.4;
  float tf = Q.y/max(S.y, 0.02);
  float a = dot(S.xz, S.xz), b = -dot(Q.xz, S.xz), c = dot(Q.xz, Q.xz) - K*K;
  float tc = a > 1e-6 ? (-b + sqrt(max(b*b - a*c, 0.)))/a : 1e6;
  float yc = Q.y - S.y*tc;
  vec3 q = Q - vec3(0., 130., 0.); float bs = -dot(q, S), cs = dot(q, q) - K*K;
  float ts = -bs + sqrt(max(bs*bs - cs, 0.));
  return min(tf, yc > 130. ? ts : tc);
}
`;function Te(t,i=!1){const n=[],d=[];for(let m=0;m<=8;m++)for(let r=0;r<48;r++){const R=r/48*Math.PI*2;n.push(Math.cos(R),m/8,Math.sin(R))}for(let m=0;m<8;m++)for(let r=0;r<48;r++){const R=(r+1)%48,P=m*48+r,p=m*48+R;d.push(P,p,P+48,p,p+48,P+48)}const a=n.length/3;for(let m=0;m<48;m++){const r=m/48*Math.PI*2;n.push(Math.cos(r)*.5,1,Math.sin(r)*.5)}const x=n.length/3;n.push(0,1,0);const s=x+1;n.push(0,0,0);for(let m=0;m<48;m++){const r=(m+1)%48,R=384+m,P=384+r;d.push(R,P,a+m,P,a+r,a+m,a+m,a+r,x,r,m,s)}const y=new e.BufferGeometry;y.setAttribute("position",new e.Float32BufferAttribute(n,3)),y.setIndex(d),y.boundingSphere=new e.Sphere(new e.Vector3(0,130,0),200);const G={...t,...j.fogUniforms(),uBeamCol:{value:new e.Color(1,1,1)},uBeam:{value:new e.Vector4(.017,1,.12,120)},uBeam2:{value:new e.Vector4(1.1,1.35,.66,250)}};i&&(G.uSunDir={value:new e.Vector3(0,1,0)});const A=new e.ShaderMaterial({uniforms:G,defines:i?{OC_VEIL:1}:{},fog:!0,side:e.BackSide,transparent:!0,depthWrite:!1,depthTest:!0,blending:e.AdditiveBlending,vertexShader:j.GLSL_FOG_PARS_VERT+`uniform vec3 uSunDir; uniform vec4 uEye;
`+po+`
      varying vec3 vW;
      void main(){
        float rb = uEye.y*1.016 + 0.3;
        vec3 Q = vec3(position.x*rb, uEye.x, position.z*rb);
        vW = Q - uSunDir*(ocBeamHit(Q, uSunDir)*position.y);
        #ifdef OC_VEIL
        vW.y += 0.06*position.y;     // the veil's foot stands a hair over the paving: laid in the floor's own plane, the two fought for each pixel
        #endif
        vec4 mvPosition = viewMatrix*vec4(vW, 1.); gl_Position = projectionMatrix*mvPosition;
      `+j.GLSL_FOG_VERT+"}",fragmentShader:j.GLSL_NOISE+j.GLSL_FOG_PARS_FRAG+be+`
      uniform vec3 uBeamCol; uniform vec4 uBeam2;   // knee, gain after the knee, how much is left at the foot, length of the shaft
      uniform vec4 uBeam;   // density, gain, how much a long look down the beam is held back, metres over which it thins toward the camera
      varying vec3 vW;
      vec2 ocSeg(vec2 h0, vec2 hd, float r){
        float a = dot(hd, hd), b = dot(h0, hd), c = dot(h0, h0) - r*r;
        if (a < 1e-7) return c < 0. ? vec2(-1e6, 1e6) : vec2(1., -1.);
        float disc = b*b - a*c; if (disc <= 0.) return vec2(1., -1.);
        float sq = sqrt(disc); return vec2((-b - sq)/a, (-b + sq)/a);
      }
      void main(){
        // only the far side of the volume is shaded (it hugs the room, so the scene's depth cuts it correctly)
        vec3 O = cameraPosition; vec3 d = vW - O; float dl = length(d); d /= max(dl, 1e-3);
        float sy = max(uSunDir.y, 0.02); vec2 k = uSunDir.xz/sy;
        vec2 h0 = O.xz + k*(uEye.x - O.y), hd = d.xz - k*d.y;
        vec2 i1 = ocSeg(h0, hd, uEye.y), i2 = ocSeg(h0 + k*uEye.z, hd, uEye.y);
        float t0 = max(max(i1.x, i2.x), 0.), t1 = min(min(i1.y, i2.y), dl);
        float L = max(t1 - t0, 0.), tm = t0 + L*0.5;
        vec3 pm = O + d*tm;
        vec2 hm = h0 + hd*tm;            // where the middle of the lit stretch stands in the eye
        // cloud dimmings and thin rays run down the beam: both live in the plane of the eye, so they lie along the axis
        float cl = (ocCloudTex(h0 + hd*(t0 + L*0.2)) + ocCloudTex(hm) + ocCloudTex(h0 + hd*(t0 + L*0.8)))/3.;
        float ray = vnoise(hm*0.2 + uCloud.xy*0.004)*0.6 + vnoise(hm*0.57 + 3. - uCloud.xy*0.007)*0.4;
        float hz = fbm(pm*0.017 + vec3(uCloud.w*0.05, -uCloud.w*0.1, uCloud.w*0.04));
        float hz2 = vnoise(pm*0.09 + vec3(uCloud.w*0.22, -uCloud.w*0.34, uCloud.w*0.1));
        float r2 = min(dot(hm, hm)/(uEye.y*uEye.y), 1.);
        float core = 1.3 - 0.6*r2;
        #ifdef OC_VEIL
        // rain: curtains of streaks falling through the column, thick and thin with the gusts; silver, no sun in it
        float fl = uCloud.w*1.6;
        float s1 = vnoise(vec3(hm*0.4, pm.y*0.03 + fl)), s2 = vnoise(vec3(hm*1.2 + 7., pm.y*0.08 + fl*2.3));
        float gust = fbm(vec3(hm*0.05, pm.y*0.012 + uCloud.w*0.25));
        float Iv = 1. - exp(-L*(0.3 + 0.9*s1 + 0.5*s2)*(0.45 + 1.1*gust)*core*uBeam.x);
        Iv *= 1. - uBeam.z*Iv;
        vec3 cv = uBeamCol*(Iv*uBeam.y*(0.05 + 0.95*smoothstep(uBeam.w*0.2, uBeam.w*0.8, tm)));
        gl_FragColor = vec4(cv*(1. - 0.5*fxFog()), 1.);
        #else
        // the shaft has a soft shoulder (the lit dust thins toward its edge) and is combed into rays along its axis
        float soft = pow(max(1. - r2, 0.), 0.6);
        float dens = (0.28 + 1.1*hz + 0.4*hz2)*(0.32 + 2.5*ray*ray)*1.3*soft;
        float mu = dot(d, uSunDir);
        float m1 = max(mu, 0.), m2 = max(-mu, 0.);
        float phase = 0.62 + 0.8*m1*m1*m1 + 0.12*m2*m2;
        float I = 1. - exp(-L*dens*uBeam.x);
        I *= 1. - uBeam.z*I;
        phase = mix(phase, 0.75, uBeam.z);
        // lit air close to the camera is no more than a thin gold veil: the eye is stopped down on the disc, and it is
        // the motes that blaze. Far off, the same air stands as a column.
        float nk = 0.03 + 0.97*smoothstep(uBeam.w*0.28, uBeam.w*0.84, tm);
        vec3 bc = mix(uBeamCol, uBeamCol*uBeamCol/max(max(uBeamCol.r, uBeamCol.g), max(uBeamCol.b, 0.01)), 0.75);   // the look's own tint, deepened
        vec3 col = mix(bc*vec3(1.08, 0.84, 0.56), bc, nk)*(0.78*I*phase*cl*uCloud.z*uBeam.y*nk);
        // a long look up or down the beam would saturate into a flat wedge: there the core stands brighter than the
        // edge, the thin rays and the drifting haze show through, and the edge is a little soft
        float lw = max(smoothstep(45., 160., L), smoothstep(0.5, 0.86, abs(mu)));
        vec2 ha = h0 + hd*(t0 + L*0.25), hb = h0 + hd*(t0 + L*0.75);
        float ray3 = (ray + vnoise(ha*0.2 + uCloud.xy*0.004)*0.6 + vnoise(ha*0.57 + 3. - uCloud.xy*0.007)*0.4 + vnoise(hb*0.2 + uCloud.xy*0.004)*0.6 + vnoise(hb*0.57 + 3. - uCloud.xy*0.007)*0.4)/3.;
        float drift = vnoise(vec3(hm*0.075, tm*0.012 - uCloud.w*0.35))*0.6 + vnoise(vec3(hm*0.21 + 5., tm*0.03 - uCloud.w*0.7))*0.4;
        // light, never a solid: however strong the shaft, it goes through a soft knee (the wall behind always shows through
        // it), is brightest along its axis and dies away to nothing at its edge, is combed into rays, brightens where the
        // dust drifts through it, and thins from the eye down to its foot
        float pr = max(1. - r2, 0.), shp = pr*pr*(3. - 2.*pr);
        col *= mix(1., 1.9*pow(pr, 0.75), lw);
        float lum = max(col.r, max(col.g, col.b));
        float kn = uBeam2.y/(1. + lum*uBeam2.x*mix(1., 0.3, lw));
        col *= kn; lum *= kn;
        col = mix(col, col*col/max(lum, 1e-3), 0.4);       // lit dust keeps the colour of the hour
        float along = (uEye.x - pm.y)/sy;
        float tail = mix(1., uBeam2.z, smoothstep(0.2, 1.05, along/max(uBeam2.w, 1.)));
        float shim = 0.72 + 0.56*vnoise(vec3(hm*0.3 + 9., uCloud.w*1.2 + tm*0.02));      // dust turning over in the light
        col *= (0.04 + 0.96*mix(pr, shp, 0.6))*(0.45 + 1.1*ray3)*(0.5 + 1.0*drift)*shim*tail;
        col *= 1. - 0.5*fxFog();
        gl_FragColor = vec4(col, 1.);
        #endif
      }`}),E=new e.Mesh(y,A);return E.frustumCulled=!1,E.renderOrder=2,{mesh:E,uniforms:G}}async function je(t,i,o){const f=new Float32Array(i*12),n=new Float32Array(i*16),d=new Uint32Array(i*6),a=[-1,1,1,-1],x=[-1,-1,1,1];for(let y=0;y<i;y++){(y&1023)===0&&await t.yield();const G=o(),A=o(),E=o(),m=o();for(let r=0;r<4;r++)f.set([a[r],x[r],0],y*12+r*3),n.set([G,A,E,m],y*16+r*4);d.set([y*4,y*4+1,y*4+2,y*4,y*4+2,y*4+3],y*6)}const s=new e.BufferGeometry;return s.setAttribute("position",new e.BufferAttribute(f,3)),s.setAttribute("aSeed",new e.BufferAttribute(n,4)),s.setIndex(new e.BufferAttribute(d,1)),s.boundingSphere=new e.Sphere(new e.Vector3(0,130,0),300),s}async function vo(t,i,o,f){const n={...i,uBox:{value:new e.Vector3(76,52,76)},uMoteCol:{value:new e.Color(1,1,1)}},d=new e.ShaderMaterial({uniforms:n,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,vertexShader:be+`
      attribute vec4 aSeed; uniform vec3 uBox; varying vec2 vUv; varying float vI;
      void main(){
        float t = uCloud.w;
        vec3 drift = vec3(sin(t*0.21 + aSeed.w*40.), 0.35*t*(aSeed.w - 0.35) + cos(t*0.17 + aSeed.w*70.), sin(t*0.19 + aSeed.w*90.))*1.3;
        vec3 P = mod(aSeed.xyz*uBox + drift - cameraPosition + uBox*0.5, uBox) - uBox*0.5 + cameraPosition;
        float lit = oculusSun(P)*step(0.3, P.y);
        vec4 mv = viewMatrix*vec4(P, 1.); float dist = max(-mv.z, 0.01);
        float s0 = 0.035 + 0.1*aSeed.w*aSeed.w, size = max(s0, dist*0.0019);
        mv.xy += position.xy*size; gl_Position = projectionMatrix*mv;
        vec3 e = (uBox*0.5 - abs(P - cameraPosition))/uBox;
        float edge = smoothstep(0., 0.12, min(e.x, min(e.y, e.z)));
        float tw = 0.55 + 0.45*sin(t*(1.5 + aSeed.w*4.) + aSeed.w*200.);
        float q = s0/size;
        vI = lit*edge*tw*smoothstep(3., 14., dist)*min(1., q*q*9.);
        vUv = position.xy;
      }`,fragmentShader:`
      uniform vec3 uMoteCol; varying vec2 vUv; varying float vI;
      void main(){ float a = 1. - smoothstep(0.15, 1., length(vUv)); gl_FragColor = vec4(uMoteCol*(a*a*vI), 1.); }`}),a=new e.Mesh(await je(t,f,o),d);return a.frustumCulled=!1,a.renderOrder=3,{mesh:a,uniforms:n}}async function yo(t,i,o,f){const n={...i,...j.fogUniforms(),uFall:{value:new e.Vector4(0,0,0,60)},uFallCol:{value:new e.Color(1,1,1)}},d=new e.ShaderMaterial({uniforms:n,fog:!0,transparent:!0,depthWrite:!1,side:e.DoubleSide,blending:e.CustomBlending,blendSrc:e.OneFactor,blendDst:e.OneMinusSrcAlphaFactor,blendSrcAlpha:e.OneFactor,blendDstAlpha:e.OneMinusSrcAlphaFactor,vertexShader:j.GLSL_FOG_PARS_VERT+be+`
      attribute vec4 aSeed; uniform vec4 uFall; uniform vec3 uFallCol;
      varying vec2 vUv; varying vec4 vC; varying float vR;
      void main(){
        float t = uCloud.w, mode = uFall.x, H = uEye.x + 8.;
        float soft = step(0.5, mode);
        float y = H - fract(aSeed.z + t*uFall.w/H*(0.75 + 0.5*aSeed.w))*H;
        float ang = aSeed.y*6.2831853 + soft*(t*0.22*(aSeed.w - 0.3) + y*0.011);
        float rr = sqrt(aSeed.x)*uEye.y*0.97 + soft*sin(t*0.6 + aSeed.w*50.)*1.6;
        vec3 P = vec3(cos(ang)*rr, y, sin(ang)*rr);
        float show = step(fract(aSeed.w*7.31), uFall.y)*step(uFall.z, y)*step(0.001, uFall.y);
        vec4 mvPosition = viewMatrix*vec4(P, 1.); float dist = max(-mvPosition.z, 0.01);
        vec2 off;
        float fade = 1., tumble = 1.;
        if (mode < 0.5) {                      // rain: short streaks along world up, of every length and brightness
          float w = max(0.045 + 0.05*aSeed.w, dist*0.0013), ln = min(0.5 + 2.8*aSeed.w*aSeed.w, dist*0.045);
          fade = min(1., 0.07/w*2.2)*(0.25 + 0.75*fract(aSeed.w*23.7))*smoothstep(5., 18., dist);
          vec2 up = (viewMatrix*vec4(0., 1., 0., 0.)).xy; up /= max(length(up), 1e-3);
          off = vec2(up.y, -up.x)*position.x*w + up*position.y*ln;
        } else if (mode < 1.5) {               // snow: small soft flakes, and a few large faint ones out of focus near the lens
          float big = step(0.93, fract(aSeed.w*13.7));
          float s = clamp(0.34 + 0.4*aSeed.w, dist*0.0024, dist*0.012);
          s = mix(s, min(1.4 + 1.8*aSeed.x, dist*0.045), big);
          fade = mix(smoothstep(5., 16., dist), 0.2*smoothstep(5., 14., dist)*(1. - smoothstep(34., 64., dist)), big);
          off = position.xy*s;
        } else {                               // petals: tumbling
          float big = fract(aSeed.w*17.3);
          float s = max(0.38 + 1.15*big*big, dist*0.0022), sp = t*(1.5 + 2.5*aSeed.w) + aSeed.w*60.;
          float cs = cos(sp*0.6), sn = sin(sp*0.6);
          tumble = cos(sp);
          vec2 q = vec2(position.x*tumble, position.y*0.8);
          off = vec2(q.x*cs - q.y*sn, q.x*sn + q.y*cs)*s;
        }
        mvPosition.xy += off*show; gl_Position = projectionMatrix*mvPosition;
        float lit = oculusSun(P);
        vec3 light = uFill*1.5 + uAmbient*2. + uSunColor*(lit*0.55) + uSky*(0.5*(1. - soft));   // rain carries the sky down with it
        vec3 c = uFallCol*light*(0.75 + 0.5*aSeed.w);
        if (mode > 1.5) {
          // rose petals: three reds, deep crimson in the shade, glowing copper-rose where they turn in the beam
          float h = fract(aSeed.x*91.7 + aSeed.w*5.3);
          vec3 pc = h < 0.4 ? vec3(0.34, 0.012, 0.045) : (h < 0.8 ? vec3(0.62, 0.03, 0.075) : vec3(0.8, 0.1, 0.16));
          float face = 0.35 + 0.65*abs(tumble);
          c = pc*((uFill*1.3 + uAmbient*2.)*face + uSunColor*(lit*(0.25 + 0.75*face)*0.6))
            + vec3(1., 0.42, 0.24)*uSunColor*(lit*(1. - 0.6*abs(tumble))*0.14);
        }
        float alpha = mode < 0.5 ? 0.0 : (mode < 1.5 ? 0.25*fade : 1.0);
        float gain = mode < 0.5 ? 0.9*fade : (mode < 1.5 ? 1.5*fade : 1.0);
        vC = vec4(c*gain, alpha)*show*smoothstep(1., 5., dist);
        vUv = position.xy; vR = aSeed.w;
      `+j.GLSL_FOG_VERT+"}",fragmentShader:j.GLSL_FOG_PARS_FRAG+`
      uniform vec4 uFall; varying vec2 vUv; varying vec4 vC; varying float vR;
      void main(){
        float a; vec3 col = vC.rgb;
        if (uFall.x < 0.5) a = (1. - abs(vUv.x))*(1. - vUv.y*vUv.y);
        else if (uFall.x < 1.5) { a = 1. - smoothstep(0., 1., length(vUv)); a *= a; }
        else {
          // a rose petal by its own outline and surface: a broad rounded top with a shallow cleft, narrowing to its pale claw;
          // a crease up the middle, one cheek cupped toward the light, a rim that curls and catches it
          float tt = clamp((vUv.y + 0.95)/1.9, 0., 1.), ax = abs(vUv.x);
          float hw = 0.98*pow(max(sin(3.14159*pow(tt, 1.35)), 0.), 0.62), e = ax/max(hw, 0.05);
          a = smoothstep(0., 0.1, hw - ax)*smoothstep(0., 0.07, 0.95 - 0.2*exp(-vUv.x*vUv.x*25.) - vUv.y);
          float sh = (1. - 0.24*exp(-vUv.x*vUv.x*200.)*smoothstep(0.08, 0.3, tt)*(1. - smoothstep(0.6, 0.92, tt)))
            *(1. + 0.2*(vR > 0.5 ? 1. : -1.)*vUv.x/max(hw, 0.05))*(1. + 0.22*smoothstep(0.55, 1., e));
          col = mix(col*sh, vec3(col.r)*vec3(1.05, 0.8, 0.7), 0.6*(1. - smoothstep(0., 0.22, tt)));
        }
        if (a*vC.r + a*vC.a < 0.002) discard;
        float f = 1. - fxFog()*0.7;
        gl_FragColor = vec4(col*(a*f), vC.a*a);
      }`}),a=new e.Mesh(await je(t,f,o),d);return a.frustumCulled=!1,a.renderOrder=3,{mesh:a,uniforms:n}}async function wo(t,i={}){const o=t.rng,f=i.palette??Ye,n=t.quality?.detail??1,d=t.vary||{};let a=i.look;a||(a=o.pick(["summer","summer","april","shower","snow","night"]),d.hour==="night"?a="night":d.hour&&d.hour!=="any"&&a==="night"&&(a="summer"));let x=i.rare??!!d.rare;const s=c=>new e.Color(c),y={},G=c=>y[c]??(y[c]=Ze(f,c)),A=i.sunAt??(c=>Xe(c,a)),E=o.range(0,Math.PI*2),m=new e.Vector2(Math.cos(E),Math.sin(E)).multiplyScalar(o.range(22,30)),r={uSunDir:{value:new e.Vector3(0,1,0)},uSunColor:{value:new e.Color(1,1,1)},uFill:{value:new e.Color(.2,.25,.35)},uAmbient:{value:new e.Color(.01,.012,.02)},uBouncePos:{value:new e.Vector3(0,2,0)},uBounceCol:{value:new e.Color(0,0,0)},uSky:{value:new e.Color(.3,.5,1)},uEye:{value:new e.Vector4(K,Ge,qe,a==="snow"?.2:a==="night"?.4:a==="april"?.6:.55)},uCloud:{value:new e.Vector4(o.range(0,500),o.range(0,500),1,0)},uCandle:{value:new e.Color(0,0,0)},uLamp:{value:new e.Color(0,0,0)},uBounceK:{value:1/3600},uOuter:{value:1},uHalo:{value:.16}},R={uPorph:{value:s(f[5]).lerp(s("#4c1e58"),.38).multiplyScalar(1.04)},uGold:{value:s(f[4]).lerp(s("#ead9b0"),.24).multiplyScalar(.85)},uWhite:{value:s("#bdb6a8")},uGrey:{value:s(f[2]).multiplyScalar(.8)},uGreen:{value:s("#44705a").multiplyScalar(.95)},uSeed:{value:o.range(0,60)}},P={uWet:{value:new e.Vector4(0,0,0,0)},uMop:{value:new e.Vector4(o.range(-20,-8),o.range(-66,-52),o.range(4,16),o.range(-14,2))},uSnow:{value:new e.Vector4(0,0,0,0)},uFloorSun:{value:.5},uFloorLift:{value:0}},p=new e.Group;p.name="oculus-day-hero";const I=(c,z,k)=>{const _=new e.Mesh(c,z);return _.name=k,_.frustumCulled=!1,p.add(_),_},W=s(f[2]).multiplyScalar(.86).lerp(s("#8d8f96"),o.range(.1,.3)),D=await uo(t,o.fork("dome"),W);I(D.geometry,ce(r,"concrete",{coffer:!0,vertexColors:!0,side:e.DoubleSide,gloss:.05,color:new e.Color(1.32,1.32,1.32)}),"dome"),await t.yield(),I(await mo(t,o.fork("ros"),D.panels,s(f[4]).lerp(s("#ffd070"),.3).multiplyScalar(.72)),ce(r,"gilt",{vertexColors:!0,side:e.DoubleSide,gloss:.75}),"rosettes"),await t.yield();const g=K,T=s("#7a5026").lerp(s(f[4]),.12),V=[[31,g-1.1,.7],[29.2,g-1.9,1.1],[27.8,g-2.2,.8],[26.4,g-1.6,1.25],[26.4,g+.4,1],[27,g+1,.75],[27,g+3.4,.9],[26.6,g+3.7,1.2],[26.6,g+4.3,1.2],[27,g+4.6,.8],[27,g+7.4,.9],[27.5,g+8.2,1.1],[28.6,g+Ce,1.2],[31.2,g+Ce,1],[31.8,g+8,.8]],h=ce(r,"bronze",{vertexColors:!0,side:e.DoubleSide,gloss:.5});if(h.defines.OC_RIM=1,I(ke(V,112,T,()=>1),h,"rim"),await t.yield(),i.exterior!==!1){const c=[[31.8,g+8,.8],[33.5,g+4.5,1]];for(const _ of[40,52,64,76,88,99])c.push([_,re+Math.sqrt(19321-_*_),1]);let z=re+Math.sqrt(9520),k=99;for(let _=0;_<7;_++)k+=1.2,z-=7.2,c.push([k,z,.82]),k+=5.6,z-=.8,c.push([k,z,1.05]);c.push([k+3.5,z-1.5,1.1],[k+3.5,z-5,.9],[k+.5,z-7,.8],[k+.5,60,.75]),I(ke(c,96,s("#8f8a84")),ce(r,"exterior",{vertexColors:!0,side:e.DoubleSide}),"shell")}await t.yield();let u=null;i.floor!==!1&&(u=ce(r,"floor",{uniforms:{...R,...P}}),I(new e.CircleGeometry(131,96).rotateX(-Math.PI/2),u,"floor")),await t.yield();const L=i.drum??!0;if(L){const c=ce(r,"drum",{side:e.DoubleSide,gloss:.3,uniforms:R});L===!0&&I(new e.CylinderGeometry(O,O,72,112,1,!0).translate(0,36,0),c,"drum-lower"),I(new e.CylinderGeometry(O,O,43,112,1,!0).translate(0,100.5,0),c,"drum-attic"),I(ke([[130.3,71.5],[128.4,72.4],[128.4,75.2],[126.9,76],[126.9,78.2],[128.6,78.8],[130.3,79.6]],112,s("#ffffff")),c,"drum-cornice")}await t.yield();const C=Te(r);p.add(C.mesh);const S=Te(r,!0);S.mesh.visible=!1,S.mesh.renderOrder=2,S.uniforms.uBeam.value.set(.02,0,.1,70),p.add(S.mesh),await t.yield();const M=await vo(t,r,o.fork("motes"),Math.round(2800*n));p.add(M.mesh),await t.yield();const l=await yo(t,r,o.fork("fall"),Math.round((x?7e3:a==="shower"?9e3:3600)*n));p.add(l.mesh),await t.yield();const b={u:0,look:a,rare:x,sunDir:r.uSunDir.value,sunColor:new e.Color,power:1,cloud:1,fill:new e.Color,sky:new e.Color,fog:new e.Color,disc:new e.Vector3,discOn:"dome",open:1},w={sun:new e.Color,fill:new e.Color,sky:new e.Color,power:1},B=new e.Color,v=new e.Vector3,F=s(f[0]),q=s("#9aa0aa").multiplyScalar(.55),H=s("#9aa0aa").multiplyScalar(1.2),Q={floor:s("#ffc9a0"),drum:s("#ffdca4"),dome:s("#e6e0d6")},ee=new e.Vector3(0,K,0);let N=0,Y=!1,oe=0,de=1,fe=1,te=null,Fe=0;const Pe=(c,z=new e.Vector3)=>{const k=A(c);return ze(k.az*U,Math.max(k.el,3)*U,z)},Oe=(c,z=new e.Vector3)=>(Ie(Pe(c,v),z),z),Ue={rain:[0,70,s("#c4cfdf")],snow:[1,7,s("#f4f6fb")],petals:[2,11,s("#ffffff")]};function me(c){b.u=c;const z=A(c);ze(z.az*U,Math.max(z.el,3)*U,r.uSunDir.value),Je(G(a),c,w),r.uEye.value.w=(a==="snow"?.2:a==="night"?.4:a==="april"?.6:.55)*(.45+.55*X(.15,.4,c)),oe=a==="shower"?X(.33,.4,c)*(1-X(.445,.5,c)):0,a==="shower"&&(w.fill.lerp(q,oe*.7),w.sky.lerp(H,oe*.9)),b.power=w.power,b.sunColor.copy(w.sun).multiplyScalar(w.power),b.fill.copy(w.fill),b.sky.copy(w.sky),b.fog.copy(w.fill).multiplyScalar(.55).lerp(w.sky,.12);const k=Math.max(z.el,3)*U,_=qe/Math.tan(k),J=ye(_/(2*Ge),0,1);b.open=2/Math.PI*(Math.acos(J)-J*Math.sqrt(1-J*J)),b.discOn=Ie(r.uSunDir.value,b.disc),r.uFill.value.copy(w.fill).multiplyScalar(.34),B.copy(r.uFill.value),r.uAmbient.value.copy(w.fill).multiplyScalar(.15).add(he.copy(F).multiplyScalar(.3)),r.uSky.value.copy(w.sky),P.uWet.value.w=0,a==="shower"&&P.uWet.value.set(0,0,30*X(.34,.45,c)*(1-.55*X(.66,1,c)),X(.35,.42,c)*(1-.6*X(.66,1,c))),P.uSnow.value.set(a==="snow"?9+19*X(0,.9,c):0,a==="snow"?1:0,a==="snow"?0:1-X(.4,.52,c),oe);let $="none",ne=0,Be=0;a==="shower"&&($="rain",ne=oe),a==="snow"&&($="snow",ne=1),x&&c>.55&&($="petals",ne=X(.55,.6,c),Be=Math.max(0,K-(c-.55)/.11*K)),te&&($=te[0],ne=te[1],Be=0);const ve=Ue[$];ve?(l.uniforms.uFall.value.set(ve[0],ne,Be,ve[1]),l.uniforms.uFallCol.value.copy(ve[2])):l.uniforms.uFall.value.y=0,l.mesh.visible=!!ve&&ne>.001;const Ve=$==="rain"?ne:0;S.mesh.visible=Ve>.001,S.uniforms.uBeam.value.y=Ve*1.25,S.uniforms.uBeamCol.value.copy(w.sky).multiplyScalar(.5).add(he.copy(w.fill).multiplyScalar(.5))}const he=new e.Color,Re=new e.Vector2(r.uCloud.value.x,r.uCloud.value.y);function Ee(c){const z=(a==="snow"||a==="night"?.3:.4)*(.45+.55*X(.15,.4,b.u)),k=t.noise?t.noise.n2(c*.42,3.7):Math.sin(c*1.3),_=(1-z*X(.1,.6,k))*(1-oe);b.cloud=_,r.uCloud.value.set(Re.x+m.x*c,Re.y+m.y*c,_,c),r.uSunColor.value.copy(b.sunColor),r.uFill.value.copy(B).multiplyScalar(.84+.16*_),r.uBounceCol.value.copy(b.sunColor).multiply(Q[b.discOn]).multiplyScalar(.105*_*b.open),r.uBouncePos.value.copy(b.disc),b.discOn==="floor"&&(r.uBouncePos.value.y=2.5);const J=Math.max(w.sun.r,w.sun.g,w.sun.b,.001);C.uniforms.uBeamCol.value.copy(w.sun).multiplyScalar(1/J),a!=="night"&&a!=="snow"&&C.uniforms.uBeamCol.value.lerp(he.setRGB(1,.78,.42),.5*(1-X(.22,.45,b.u))),C.uniforms.uBeamCol.value.lerp(he.set(1,1,1),.12).multiplyScalar(ye(.25+.15*w.power,.3,1)*(a==="snow"?.5:1)),C.uniforms.uBeam.value.y=de,C.uniforms.uBeam2.value.w=Math.max(b.disc.distanceTo(ee),60),M.uniforms.uMoteCol.value.copy(w.sun).multiplyScalar(1.5/J*Math.min(1,w.power/3.5)*fe).multiply(a==="night"?he.setRGB(.9,.95,1):he.setRGB(1,.86,.6))}me(.1),Ee(0);const le=ze(16*U,66*U),pe=new e.Vector3(0,K+Ce+5,0),ae=pe.clone().addScaledVector(le,-60),we=new e.Vector2(le.x,le.z).normalize(),Ke=new e.Vector2(-we.y,we.x),xe=new e.Vector2(ae.x,ae.z).addScaledVector(Ke,50),ge=new e.Vector2(ae.x-xe.x,ae.z-xe.y),Se=(c,z,k)=>{const _=c*U*k,J=Math.cos(_),$=Math.sin(_);return new e.Vector3(xe.x+ge.x*J-ge.y*$,z,xe.y+ge.x*$+ge.y*J)},_e=Se(5,ae.y,1),Ae=(ae.x-_e.x)*we.x+(ae.z-_e.z)*we.y>0?1:-1,He=[Se(100,190,Ae),Se(60,199,Ae),Se(28,208,Ae),ae,pe.clone().addScaledVector(le,-40),pe.clone().addScaledVector(le,-20),pe.clone()],Me=(c,z,k=0)=>ie(c*U,z*U,O-k),Qe={eye:new e.Vector3(0,K,0),eyeRadius:Ge,rimTop:K+Ce,portalSeat:{position:pe,normal:le.clone().negate(),radius:7},exitDir:le,flyThrough:He,reveal:{position:new e.Vector3(5,17,106),lookAt:Oe(.1).lerp(new e.Vector3(0,K,0),.5)},closePass:{position:Me(60,23.6,12),lookAt:Me(84,25,0),ring:2,y:182},viewpoints:[{name:"reveal",position:new e.Vector3(5,17,106),lookAt:new e.Vector3(60,215,-20)},{name:"acrossFromApse",position:new e.Vector3(-20,22,-68),lookAt:new e.Vector3(0,90,60)},{name:"noonCrossing",position:new e.Vector3(0,14,-10),lookAt:new e.Vector3(0,8,64)},{name:"underTheEye",position:new e.Vector3(10,200,-30),lookAt:new e.Vector3(0,K+6,0)}],door:{az:0,position:new e.Vector3(0,0,O)},apse:{az:180,position:new e.Vector3(0,0,-O)},size:{drumRadius:O,springing:re,crown:260,eyeY:K,outerRadius:168}};return{object:p,radius:40,height:275,center:new e.Vector3(0,70,0),anchors:Qe,ground:!1,groundY:0,uniforms:r,state:b,GLSL:be,sunAt:Pe,discAt:Oe,domePoint:Me,mop:P.uMop.value,wind:m.clone().normalize(),makeStoneMaterial:(c={})=>ce(r,{marble:"marble",concrete:"concrete",bronze:"bronze",gilt:"gilt",exterior:"exterior",revet:"revet",granite:"granite",paving:"paving"}[c.kind]??"plain",{side:e.DoubleSide,...c}),setProgress(c){Y=!0,N=ye(c,0,1),me(N),Ee(Fe)},setBeamGain(c,z,k){de=c,z!==void 0&&(C.uniforms.uBeam.value.z=z),k!==void 0&&(C.uniforms.uBeam.value.w=k)},setBeamShape(c,z,k){C.uniforms.uBeam2.value.x=c,C.uniforms.uBeam2.value.y=z,C.uniforms.uBeam2.value.z=k},setMoteGain(c){fe=c},floorSun:P.uFloorSun,floorLift:P.uFloorLift,setLook(c,z=x){a=c,x=z,b.look=a,b.rare=x,me(N)},setFall(c,z=1){te=c&&c!=="auto"?[c,z]:null,me(N)},update(c,z,k){if(Fe=z,!Y&&k){const _=k.matrixWorld.elements,J=Math.atan2(_[12],_[14]),$=ye(((J+.3)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)/(Math.PI*1.5),0,1);me(.1+.85*$)}Ee(z)},dispose(){}}}export{wo as buildHero};
