import*as n from"three";import{clamp as fe,lerp as Ae,smoothstep as vt}from"../kit/core.js";import{Geo as At}from"../kit/fauna.js";const Wt=["#B9B45A","#6E9440","#1F4E7A","#9CC3E0","#FFF1CF","#A85A2A","#22301F"],P=m=>new n.Color(m),U={front:{z:.36,y:.78,l1:.4,l2:.38},hind:{z:-.38,y:.86,l1:.44,l2:.42}};function dt(m,o){const e=new At,w=m.coat.clone().multiplyScalar(.8),g=m.coat.clone().multiplyScalar(.52),c=P("#efe6d2"),h=P("#16110d"),B=m.coat.clone().multiplyScalar(.8).lerp(P("#d9b98a"),.25),j=P("#3a3029"),L=P("#8a7a66"),d=P("#241a14"),b=o?12:6,pe=o?[{z:-.66,y:.93,rx:0,ry:0},{z:-.59,y:.915,rx:.1,ry:.13},{z:-.44,y:.88,rx:.165,ry:.205},{z:-.22,y:.862,rx:.165,ry:.19},{z:.03,y:.826,rx:.178,ry:.208},{z:.27,y:.8,rx:.168,ry:.226},{z:.45,y:.825,rx:.132,ry:.196},{z:.57,y:.86,rx:.08,ry:.125},{z:.63,y:.87,rx:0,ry:0}]:[{z:-.66,y:.93,rx:0,ry:0},{z:-.47,y:.885,rx:.16,ry:.2},{z:-.1,y:.845,rx:.172,ry:.2},{z:.3,y:.805,rx:.165,ry:.222},{z:.52,y:.845,rx:.1,ry:.15},{z:.63,y:.87,rx:0,ry:0}],A=e.loft(pe,{sides:b,top:w,belly:c,shade:o?[-.82,-.28]:[-.98,-.62]});e.paint(A,(s,u,a,p)=>{const W=vt(.93,1.06,u);p.lerp(g,W*.55),a<-.52&&u<.95&&p.lerp(c,.75),a>.4&&u<.82&&p.lerp(c,.6)});const H=(s,u,a,p)=>{const W=u*.105,F=o?[0,.5,1,1.5,1.86,2]:[0,1,2],T=o?p?[.062,.042,.03,.021,.02,.03]:[.085,.052,.03,.022,.021,.03]:p?[.058,.03,.026]:[.078,.03,.026],q=F.map(x=>[W,a.y-(x<=1?x*a.l1:a.l1+(x-1)*a.l2),a.z]),E=e.tube(q,T,o?6:3,w,B,{flatten:p?1.25:1.6}),we=o?6:3;for(let x=E[0];x<E[1];x++){const D=Math.floor((x-E[0])/we),X=F[D],_=x*4;e.a[_]=s,e.a[_+1]=X,e.a[_+2]=1,e.a[_+3]=0,e.pv[x*3]=W,e.pv[x*3+1]=a.y,e.pv[x*3+2]=a.z}e.paint(E,(x,D,X,_)=>{D<.05?_.copy(h):p&&X>a.z+.004&&D<a.y-.12?_.lerp(h,.9):!p&&D<.3&&X>a.z&&_.lerp(h,.5),D>a.y-.2&&Math.abs(x)<.1&&_.lerp(c,.35)})};H(0,-1,U.front,!0),H(1,1,U.front,!0),H(2,-1,U.hind,!1),H(3,1,U.hind,!1);const Pe=e.n,S=[0,.9,.45],k=[0,1.33,.73],Q=[],f=[],ce=o?4:2;for(let s=0;s<=ce;s++){const u=s/ce,a=Math.sin(u*Math.PI)*.035;Q.push([0,Ae(S[1],k[1],u)+a*.4,Ae(S[2],k[2],u)-a]),f.push(Ae(.125,.066,Math.pow(u,.75)))}const me=e.tube(Q,f,o?8:4,w,w,{flatten:.8});e.paint(me,(s,u,a,p)=>{(a-S[2])*.84-(u-S[1])*.55>.035&&p.lerp(c,.85)});const J=e.n,y=.31,l=.074,R=.5,he=e.loft(o?[{z:-.28*y,y:0,rx:0,ry:0},{z:-.12*y,y:.004,rx:l*.86,ry:l*.95},{z:.18*y,y:.004,rx:l,ry:l*1.02},{z:.55*y,y:-.012,rx:l*.66,ry:l*.7},{z:.86*y,y:-.02,rx:l*.46,ry:l*.5,top:d,belly:c},{z:y,y:-.024,rx:0,ry:0,top:d}]:[{z:-.28*y,y:0,rx:0,ry:0},{z:.1*y,y:.004,rx:l,ry:l*1.02},{z:.8*y,y:-.02,rx:l*.5,ry:l*.54,top:d,belly:c},{z:y,y:-.024,rx:0,ry:0,top:d}],{sides:o?8:4,top:w,belly:c,shade:[-.7,-.1]});o&&e.paint(he,(s,u,a,p)=>{Math.abs(s)>l*.6&&u>0&&a>.1*y&&a<.36*y&&p.copy(Math.abs(a-.23*y)<.035*y*2?h:c)});const ye=e.n;for(const s of[-1,1]){const u=e.fan([[s*l*.55,l*.7,-.1*y],[s*(l*.9+.11),l*.8+.1,-.2*y],[s*(l*1+.05),l*.55,-.05*y]],w,c);if(e.anim(u,()=>[1,0,4,0]),!o&&s<0)break}const M=e.n;for(const s of[-1,1]){const u=s*l*.42,a=l*.86,p=0,W=o?[[0,0,0],[.05,.11,-.13],[.12,.24,-.24],[.165,.37,-.27],[.15,.48,-.2],[.115,.56,-.09]]:[[0,0,0],[.11,.22,-.23],[.165,.4,-.26],[.115,.56,-.09]],F=o?[.027,.025,.022,.018,.012,0]:[.03,.026,.02,0];e.tube(W.map(T=>[u+s*T[0],a+T[1],p+T[2]]),F,o?5:3,j,L)}e.anim([M,e.n],()=>[1,0,2,2]),e.move([J,e.n],s=>{const u=s.y,a=s.z;s.y=u*Math.cos(R)-a*Math.sin(R)+k[1]+.035,s.z=u*Math.sin(R)+a*Math.cos(R)+k[2]+.02});for(let s=Pe;s<e.n;s++){const u=fe(((e.p[s*3+2]-S[2])*.55+(e.p[s*3+1]-S[1])*.84)/.3,0,1),a=s*4,p=e.a[a+2];e.a[a]=s>=J?1:u,e.a[a+1]=p===4?1:0,e.a[a+2]=2,e.pv[s*3]=0,e.pv[s*3+1]=S[1],e.pv[s*3+2]=S[2]}const C=[0,1.02,-.6],ue=e.n;e.tube([[0,C[1],C[2]],[0,C[1]-.13,C[2]-.07],[0,C[1]-.27,C[2]-.08],[0,C[1]-.36,C[2]-.06]],[.022,.018,.028,0],3,w,h),e.anim([ue,e.n],(s,u)=>[0,fe((C[1]-u)/.36,0,1),3,0]),e.pivot([ue,e.n],C[0],C[1],C[2]);const ee=e.build();return ee.userData.triangles=e.triangles,ee}const ve=`
uniform vec4 uHerd;   // x centre z, y treadmill distance, z window length, w treadmill weight (1 running, 0 frozen)
uniform vec4 uPool;   // x z, y lateral offset, z push radius (0 = no pool), w length of the parting
uniform vec4 uLane;   // x arc curvature, y speed m/s, z water surface y, w half width the push dies out over
uniform vec4 uEnv;    // x head taper m, y tail taper m, z lateral offset of the leaders, w half width
uniform vec4 uWheel;  // x centre z, y sigma m (never 0), z how far (m) the whole river swings toward -X there (the rare wheel), w unused
uniform float uTime;
float h11(float n){ return fract(sin(n * 127.1) * 43758.5453); }
float wrapS(float s){ float L = uHerd.z; return mod(s + uHerd.y + L * .5, L) - L * .5; }
// x of the lane with lateral offset d at z, and its slope dx/dz
vec2 laneX(float z, float d){
  float dd = d - uPool.y, sg = dd < 0. ? -1. : 1., q = (z - uPool.x) / uPool.w, g = exp(-q * q);
  float push = uPool.z * max(1. - abs(dd) / uLane.w, 0.);
  float qw = (z - uWheel.x) / uWheel.y, gw = uWheel.z * exp(-qw * qw);
  return vec2(.5 * uLane.x * z * z + d + sg * push * g - gw, uLane.x * z + sg * push * g * (-2. * q / uPool.w) + gw * 2. * qw / uWheel.y);
}
// how far (m) the window position w of lane d lies inside the herd's outline: tapered head, ragged tail
float inside(float w, float d, float seed){
  float hl = uHerd.z * .5, k = (d - uEnv.z) / uEnv.w, k2 = d / uEnv.w;
  float head = hl - uEnv.x * k * k - 9. * h11(seed + 3.), tail = -hl + uEnv.y * k2 * k2 * (.4 + 1.2 * h11(floor(d * .25) + 7.));
  return min(head - w, w - tail);
}
float visOf(float e){ return mix(step(2., e), smoothstep(0., 7., e), uHerd.w); }
`,Pt=`
#include <common>
#include <fog_pars_vertex>
attribute vec4 aAnim; attribute vec3 aPivot; attribute vec4 iA, iB; attribute vec3 iTint;
uniform vec4 uGait;   // x leap height m, y high leap height m, z stance share of the stride, w crouch m
varying vec3 vColor, vN, vWorld; varying float vWet;
${ve}
vec2 rot(vec2 yz, float a){ float c = cos(a), s = sin(a); return vec2(yz.x * c + yz.y * s, yz.y * c - yz.x * s); }
float leapOf(float n, float seed, float per){ return mod(n + floor(seed * 37.), per) < .5 ? uGait.y : uGait.x * (.8 + .4 * h11(n * .37 + seed)); }
void main(){
  vec3 p = position, n = normal;
  float sc = iB.x, seed = iB.z;
  float w = wrapS(iA.x), zw = uHerd.x + w;
  vec2 lx = laneX(zw, iA.y); float len = sqrt(1. + lx.y * lx.y);
  float lam = iA.w, ph = (zw + iA.z) / lam, nS = floor(ph), f = ph - nS;
  float f0 = uGait.z, H1 = leapOf(nS, seed, iB.w), H0 = leapOf(nS - 1., seed, iB.w);
  float psi = clamp((f - f0) / (1. - f0), 0., 1.), fl = f < f0 ? 0. : 1.;
  float yb = (fl > .5 ? H1 * 4. * psi * (1. - psi) : -uGait.w * sin(3.14159 * f / f0)) / sc;
  float t0a = .55 * atan(4. * H0 / ((1. - f0) * lam)), t0b = .55 * atan(4. * H1 / ((1. - f0) * lam));
  float pitch = fl > .5 ? .55 * atan(4. * H1 * (1. - 2. * psi) / ((1. - f0) * lam)) : mix(-t0a, t0b, smoothstep(0., f0, f));
  float air = fl * sin(3.14159 * psi);
  vec3 B = vec3(0., .8, 0.);
  if(aAnim.w > 1.5 && iB.y < .5) p = aPivot + vec3(0., .1, .1);          // ewes carry no horns
  float part = aAnim.z;
  if(part > .5 && part < 1.5){
    bool front = aAnim.x < 1.5; float side = fract(aAnim.x * .5) > .25 ? 1. : -1.;
    float L1 = front ? ${U.front.l1.toFixed(3)} : ${U.hind.l1.toFixed(3)}, L2 = front ? ${U.front.l2.toFixed(3)} : ${U.hind.l2.toFixed(3)};
    float fq = fract(f - side * .012 + 1.);                               // the lead leg lands a touch earlier
    float sw = f0 * .62, c0 = front ? sw * .5 : f0 - sw * .5;              // stance: fore first (chest first), then hind
    float fs = (front && fq > .5) ? fq - 1. : fq;
    float wS = smoothstep(c0 - sw * .5 - .035, c0 - sw * .5, fs) * (1. - smoothstep(c0 + sw * .5, c0 + sw * .5 + .035, fs));
    // joint in the lane frame (model units), after body pitch and height
    vec2 jr = rot(vec2(aPivot.y - B.y, aPivot.z), pitch);
    vec2 st = vec2((c0 - fs) * lam * len / sc + aPivot.z - jr.y, -(B.y + jr.x + yb));   // (z, y) hoof on the bed, from the joint
    vec2 stb = vec2(st.x * cos(pitch) + st.y * sin(pitch), st.y * cos(pitch) - st.x * sin(pitch));
    vec2 swg;                                                             // (z, y) swing target in the body frame
    if(front) swg = mix(mix(vec2(-.34, -.6), vec2(.11, -.4), smoothstep(c0 + sw * .5, .36, fq)), vec2(.34, -.68), smoothstep(.72, .97, fq));
    else swg = fq < c0 - sw * .5 ? vec2(.28, -.72) : mix(mix(mix(vec2(-.42, -.7), vec2(-.66, -.5), smoothstep(c0 + sw * .5, .34, fq)), vec2(-.06, -.52), smoothstep(.5, .8, fq)), vec2(.28, -.72), smoothstep(.8, 1., fq));
    vec2 d = mix(swg, stb, wS);
    float Lt = L1 + L2, D = clamp(length(d), .3 * Lt, .995 * Lt), al = atan(d.x, max(-d.y, .001));
    float A = acos(clamp((L1 * L1 + D * D - L2 * L2) / (2. * L1 * D), -1., 1.));
    float th1 = al + (front ? A : -A);
    vec2 knee = L1 * vec2(-cos(th1), sin(th1));                           // (y, z)
    vec2 foot = D * vec2(-cos(al), sin(al)), kv = foot - knee;
    float th2 = atan(kv.y, -kv.x + (abs(kv.x) + abs(kv.y) < 1e-4 ? 1e-3 : 0.));
    vec3 r = p - aPivot; float t = aAnim.y;
    if(t < .99){ r.yz = rot(r.yz, th1); n.yz = rot(n.yz, th1); }
    else { float a2 = t < 1.01 ? .5 * (th1 + th2) : th2; vec2 q = rot(vec2(r.y + L1, r.z), a2); r.yz = knee + q; n.yz = rot(n.yz, a2); }
    p = aPivot + r;
  } else if(part > 1.5 && part < 2.5){
    float a = (-.8 * pitch - .16 * air + .05 * sin(uTime * 1.3 + seed * 9.)) * aAnim.x;
    vec3 dd = p - aPivot; dd.yz = rot(dd.yz, a); n.yz = rot(n.yz, a); p = aPivot + dd;
    if(aAnim.y > .5) p.x += sign(p.x) * .02 * sin(uTime * 7. + seed * 31.);
  } else if(part > 2.5){
    float a = -(.35 + 1.5 * air + .25 * sin(uTime * 9. + seed * 17.)) * aAnim.y;
    vec3 dd = p - aPivot; dd.yz = rot(dd.yz, a); p = aPivot + dd;
  }
  p.yz = rot(vec2(p.y - B.y, p.z), pitch) + vec2(B.y, 0.); n.yz = rot(n.yz, pitch);
  p.y += yb;
  float vis = visOf(inside(w, iA.y, seed));
  p *= sc * vis;
  vec3 Z = vec3(lx.y, 0., 1.) / len, X = vec3(Z.z, 0., -Z.x);
  vec3 lp = vec3(lx.x, 0., zw) + X * p.x + vec3(0., p.y, 0.) + Z * p.z;
  vec3 ln = X * n.x + vec3(0., n.y, 0.) + Z * n.z;
  vec4 wp = modelMatrix * vec4(lp, 1.);
  vWorld = wp.xyz; vN = mat3(modelMatrix) * ln;
  vColor = color * iTint;
  vWet = 1. - smoothstep(.3, .78, position.y);
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Lt=`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uSunDir, uSunCol, uSkyCol, uBounce; uniform float uWaterW;
varying vec3 vColor, vN, vWorld; varying float vWet;
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)); if(!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vWorld + vec3(0., 1e-5, 0.));
  float ndl = dot(N, uSunDir), nv = max(dot(N, V), 0.);
  float wet = vWet * .75;
  vec3 alb = vColor * (1. - .4 * wet);
  vec3 hemi = mix(uBounce, uSkyCol, smoothstep(-.7, .7, N.y)) * .6;
  vec3 c = alb * (hemi + uSunCol * (max(ndl, 0.) * .85 + .15 * max(ndl * .5 + .5, 0.))) * .3183;
  float fr = 1. - nv; fr *= fr; fr *= fr;
  float toSun = smoothstep(-.15, .85, dot(-V, uSunDir));
  c += uSunCol * (.3 + alb) * (fr * toSun * smoothstep(-.55, .2, ndl) * .75);        // lit rim along back and horns
  c += uSkyCol * (fr * .12);
  vec3 Hv = normalize(V + uSunDir + vec3(0., 1e-4, 0.));
  float sp = max(dot(N, Hv), 0.); sp *= sp; sp *= sp; sp *= sp; sp *= sp;
  c += uSunCol * sp * (.06 + .55 * wet);                                             // wet hide
  float under = 1. - smoothstep(uWaterW - .2, uWaterW + .02, vWorld.y);                   // legs under the surface
  c = mix(c, uBounce * .09 + c * .25, under);
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`,We=`
uniform vec3 uSunDir, uSunCol, uSkyCol, uSprayCol; uniform vec4 uSprayK;   // uSprayK: x sun gain on the curtain, y on crowns and foam, z curtain top raggedness, w unused
float vh(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(vh(i), vh(i + vec2(1., 0.)), f.x), mix(vh(i + vec2(0., 1.)), vh(i + vec2(1., 1.)), f.x), f.y); }
// round drops: one soft disc to a cell, a third of the cells empty
float spDrops(vec2 p){ vec2 i = floor(p), f = fract(p) - .5; vec2 o = (vec2(vh(i + 3.7), vh(i + 11.3)) - .5) * .56; float rad = .07 + .11 * vh(i + 5.1);
  return (1. - smoothstep(rad * .45, rad, length(f - o))) * step(.5, vh(i + 17.9)); }
// foam lace: thin curling lines along the contours of two noises, feathered, never a tile
float spLace(vec2 p){ float a = vnoise(p) + .5 * vnoise(p * 2.07 + 5.3), b = vnoise(p * 1.31 + 9.1) + .5 * vnoise(p * 2.9 - 3.7);
  return max(1. - smoothstep(0., .13, abs(a - .75)), .8 * (1. - smoothstep(0., .1, abs(b - .72)))); }
// forward scatter: bright only when the eye looks through the spray toward the sun
float scatter(vec3 world){ vec3 ray = normalize(world - cameraPosition + vec3(0., 1e-5, 0.)); float s = max(dot(ray, uSunDir), 0.), s2 = s * s, s4 = s2 * s2; return .08 + .2 * s2 + .72 * s4 * s4; }
// the hanging mist glows over a wide arc round the sun; drops, foam and wake rings only close to it
float scatterWide(vec3 world){ vec3 ray = normalize(world - cameraPosition + vec3(0., 1e-5, 0.)); float s = max(dot(ray, uSunDir), 0.), s2 = s * s; return .15 + .5 * s2 + .3 * s2 * s2 * s2; }
`,Mt=`
#include <common>
#include <fog_pars_vertex>
attribute float aK; attribute vec4 iA, iB;
uniform vec4 uGait, uCrown;   // uCrown: x width m, y height m, z launch speed m/s, w strides a crown lives
varying vec2 vP; varying vec3 vWorld; varying vec4 vInfo;   // vInfo: age s, seed, power, visibility
${ve}
void main(){
  float sc = iB.x, seed = iB.z, w = wrapS(iA.x), zw = uHerd.x + w, lam = iA.w;
  float ph = (zw + iA.z) / lam, nS = floor(ph), f = ph - nS, back = (f + aK) * lam;
  float age = back / max(uLane.y, .1), nL = nS - aK;
  float high = mod(nL - 1. + floor(seed * 37.), iB.w) < .5 ? 1. : 0.;
  float zl = zw - back + .062 * lam + .2 * sc;
  vec2 lx = laneX(zl, iA.y);
  float vis = visOf(inside(w - back, iA.y, seed)) * step(aK + .5, uCrown.w + .5);
  vec4 c = modelMatrix * vec4(lx.x, uLane.z, zl, 1.);
  vis *= smoothstep(2., 7., distance(cameraPosition, c.xyz));          // never a card across the lens
  float pw = (.7 + .45 * h11(nL * .71 + seed)) * (1. + .3 * high) * sqrt(sc);
  float W = uCrown.x * pw, Hq = uCrown.y * pw;
  vec2 tc = cameraPosition.xz - c.xz; tc /= max(length(tc), 1e-3);
  vec3 wp = c.xyz + vec3(tc.y, 0., -tc.x) * (position.x * W * vis) + vec3(0., position.y * Hq * vis, 0.);
  vP = vec2(position.x * W, position.y * Hq); vWorld = wp; vInfo = vec4(age, seed + nL * .137, sqrt(pw), vis);
  vec4 mvPosition = viewMatrix * vec4(wp, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,qt=`
#include <common>
#include <fog_pars_fragment>
uniform vec4 uCrown;
varying vec2 vP; varying vec3 vWorld; varying vec4 vInfo;
${We}
void main(){
  float t = max(vInfo.x, .02), seed = vInfo.y, pw = vInfo.z * vInfo.z, v0 = uCrown.z * vInfo.z;
  vec3 Vv = cameraPosition - vWorld; float dist = length(Vv), down = clamp(Vv.y / max(dist, 1e-3), 0., 1.);
  // every drop left the landing point at t = 0: the launch velocity that puts a drop HERE now
  vec2 vel = vec2(vP.x, vP.y + 4.9 * t * t) / t;
  float sp = length(vel) / max(v0, .1);
  float an = atan(vel.x, max(vel.y, 1e-3)) - (fract(seed * 3.71) - .5) * .5;        // every burst is thrown its own way
  // a broad low fan with a torn rim, not a jet: how fast the fastest water left in each direction
  float rim = .66 + .3 * vnoise(vec2(an * 2.1 + seed * 17., seed * 3.)) + .09 * vnoise(vec2(an * 7.3, seed * 9.));   // broad lobes, never spikes
  float fan = 1. - smoothstep(.85, 1.3, abs(an));
  float sheet = (1. - smoothstep(rim - .4, rim, sp)) * fan;
  float flung = smoothstep(rim - .2, rim, sp) * (1. - smoothstep(rim + .05, rim + .55, sp)) * fan;      // loose drops thrown clear of the rim
  // the sheet tears into soft ligaments as it flies; the pattern lives in launch space, so it rides with the water
  vec2 q = vel * .8 + seed * 13.;
  float lig = vnoise(q * vec2(1.7, .8)) * .5 + vnoise(q * 3.9 + 3.) * .3 + vnoise(q * 9.1 - 7.) * .2;
  float tear = smoothstep(.04, .7, t);
  float body = smoothstep(mix(.1, .42, tear), mix(.5, .8, tear), lig) * (.5 + .5 * smoothstep(.25, .95, sp / max(rim, .2)));
  // round drops, a few centimetres across: one to a cell of launch space, some cells empty; far away they melt into the mist
  float near = 1. - smoothstep(16., 42., dist);
  float beads = spDrops(q * 3.3 + 5.) * smoothstep(.15, .5, sp) * (.35 + .65 * tear) * near;
  float drops = spDrops(q * 2.3 + 9.) * flung * near + flung * .1 * (1. - near);
  float fade = 1. - smoothstep(.5, 1.1, t);
  // the froth where it struck: a low torn mound that hugs the water, no dome (seen from above the ring of foam carries it)
  vec2 fq = vec2(vP.x / (.6 + 1.5 * t), (vP.y - .05) / (.2 + .55 * t));
  float froth = exp(-dot(fq, fq) * 1.9) * (1. - smoothstep(.08, .55, t)) * (.35 + .65 * lig) * (1. - .75 * smoothstep(.2, .55, down));
  float dens = ((sheet * (body * .7 + beads * .9) + drops) * fade + froth * .45) * (.75 + .25 * pw);
  // the fine mist each landing leaves hanging: a soft ball that swells and thins
  float life = 1.9, mr = .55 + .7 * t; vec2 mq = (vP - vec2(0., .3 + .4 * t)) / vec2(mr * 1.4, mr);
  float mist = exp(-dot(mq, mq) * 1.6) * .07 * smoothstep(0., .12, t) * (1. - smoothstep(.45 * life, life, t)) * (.6 + .4 * vnoise(vP * 2.3 + seed * 5.));
  float hw = max(uCrown.x * pw * .5, .1), hh = max(uCrown.y * pw, .1);
  float inQuad = (1. - smoothstep(.8, 1., abs(vP.x) / hw)) * (1. - smoothstep(.85, 1., vP.y / hh)) * smoothstep(0., .3, vP.y + .12 * lig);
  float a = clamp(dens * .8 + mist, 0., .8) * vInfo.w * inQuad;
  if(a < .004) discard;
  float fs = scatter(vWorld), glint = (beads * sheet + drops) * fade;
  dens = min(dens, 1.);
  vec3 wet = uSprayCol * .6 + uSunCol * uSprayK.y * (.05 + fs * (.5 + .9 * glint)) + uSunCol * glint * .07;
  vec3 fog1 = uSprayCol * .5 + uSunCol * uSprayK.y * (.02 + fs * .22);
  vec3 c = mix(fog1, wet, dens / max(dens + mist, 1e-3));
  gl_FragColor = vec4(c, a);
  #include <fog_fragment>
  gl_FragColor.rgb *= gl_FragColor.a;
}`,_t=`
#include <common>
#include <fog_pars_vertex>
attribute float aK; attribute vec4 iA, iB;
uniform vec4 uGait; uniform vec3 uSunLocal; uniform float uRingLife;
varying vec2 vP; varying vec3 vWorld; varying vec4 vInfo;   // age s, seed, kind (0 ring, 1 shadow), visibility
${ve}
float leapOf(float n, float seed, float per){ return mod(n + floor(seed * 37.), per) < .5 ? uGait.y : uGait.x * (.8 + .4 * h11(n * .37 + seed)); }
void main(){
  float sc = iB.x, seed = iB.z, w = wrapS(iA.x), zw = uHerd.x + w, lam = iA.w;
  float ph = (zw + iA.z) / lam, nS = floor(ph), f = ph - nS, f0 = uGait.z;
  bool shadow = aK > uRingLife - .5;
  float back = shadow ? 0. : (f + aK) * lam, age = back / max(uLane.y, .1);
  float zl = shadow ? zw : zw - back + .062 * lam + .2 * sc;
  vec2 lx = laneX(zl, iA.y); float len = sqrt(1. + lx.y * lx.y);
  vec3 Z = vec3(lx.y, 0., 1.) / len, X = vec3(Z.z, 0., -Z.x);
  vec3 c = vec3(lx.x, uLane.z + .02, zl); vec2 size = vec2(8.) * sqrt(sc);
  float vis = visOf(inside(w - back, iA.y, seed));
  if(shadow){
    float psi = clamp((f - f0) / (1. - f0), 0., 1.), yb = f < f0 ? 0. : leapOf(nS, seed, iB.w) * 4. * psi * (1. - psi);
    float h = yb + .75 * sc; vec2 sh = -uSunLocal.xz / max(uSunLocal.y, .12);
    c.xz += sh * min(h, 6.);
    size = vec2(1.1, 2.3) * sc * (1. + .12 * yb); age = yb;
  }
  vec3 lp = c + (X * position.x * size.x + Z * position.z * size.y) * vis;
  vec4 wp = modelMatrix * vec4(lp, 1.);
  vP = position.xz * size; vWorld = wp.xyz; vInfo = vec4(age, seed + (nS - aK) * .137, shadow ? 1. : 0., vis);
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Bt=`
#include <common>
#include <fog_pars_fragment>
uniform float uRingT; uniform vec3 uHorizon;
varying vec2 vP; varying vec3 vWorld; varying vec4 vInfo;
${We}
void main(){
  float t = vInfo.x, seed = vInfo.y, r = length(vP);
  vec3 c; float a;
  if(vInfo.z > .5){                                   // shadow: slides away from the sun as the animal rises
    vec2 q = vP / vec2(.55, 1.15) / (1. + .12 * t); a = exp(-dot(q, q) * 3.) * .55 / (1. + .25 * t); c = vec3(.012, .02, .03);
  } else {
    float fade = 1. - smoothstep(.45 * uRingT, uRingT, t);
    float rf = .35 + 2.1 * pow(max(t, 0.), .72);
    float wgl = .1 + .12 * t, r1 = (r - rf) / wgl, r2 = (r - rf * .58) / wgl;
    float crest = exp(-r1 * r1) + .6 * exp(-r2 * r2);
    vec3 Vv = cameraPosition - vWorld; float dist = length(Vv); vec3 V = Vv / max(dist, 1e-3);
    // foam: lace that spreads and thins, a soft bloom at its heart, fine bubbles under the eye; no hard patch
    vec2 fp = vP * (1.5 / (1. + .5 * t)) + seed * 7.;
    float lace = spLace(fp) * .75 + spLace(fp * 2.7 + 3.) * .45 * (1. - smoothstep(8., 26., dist));
    float bub = vnoise(vP * 17. + seed * 3.) * vnoise(vP * 29. - seed * 5.) * (1. - smoothstep(4., 14., dist));
    float reach = 1. - smoothstep(.1 + .5 * t, .75 + 1.15 * t, r + .25 * (vnoise(vP * 1.9 + seed) - .5));
    float foam = reach * (lace * (.45 + .55 * reach) + smoothstep(.3, .46, bub) * .34 + .3 * exp(-r * r * 5. / (1. + 3. * t))) * (1. - smoothstep(.2, 1.25, t));
    float fs = scatter(vWorld);
    float graze = 1. - max(V.y, 0.); graze *= graze;
    a = clamp(crest * fade * (.07 + .26 * graze) + foam * .5, 0., .78);
    c = mix(mix(uSkyCol, uHorizon, .5) * 1.05 + uSunCol * fs * .8 * crest, uSprayCol * .62 + uSunCol * (.06 + fs * .3), smoothstep(0., .35, foam));
  }
  a *= vInfo.w;
  if(a < .004) discard;
  gl_FragColor = vec4(c, a);
  #include <fog_fragment>
  gl_FragColor.rgb *= gl_FragColor.a;
}`,Ht=`
#include <common>
#include <fog_pars_vertex>
attribute vec4 iC;            // x phase along the trail m, y lateral position 0..1, z seed, w width m
uniform vec4 uCurt;           // x trail period m, y seconds the mist outlives the herd, z full height m, w opacity
uniform vec4 uWind;           // xyz drift m/s (local), w build seconds
uniform vec4 uCurtB;          // x, y lateral band of the mist in the herd's frame (m), z height the newest mist starts at, w unused
varying vec2 vUv; varying vec3 vWorld; varying vec3 vInfo;   // density, seed, age
${ve}
void main(){
  float front = uHerd.x + uHerd.z * .5, back = mod(front - iC.x, uCurt.x), zq = front - back;
  float age = back / max(uLane.y, .1), tail = uHerd.z / max(uLane.y, .1), seed = iC.z;
  float tr = smoothstep(uHerd.z * .75, uHerd.z * 1.15, back);
  vec2 lx = laneX(zq, mix(mix(uCurtB.x, uCurtB.y, iC.y), mix(-uEnv.w + 4., uEnv.w + 6., iC.y), tr));
  float dens = smoothstep(0., uWind.w, age) * (1. - smoothstep(tail * .8, tail + uCurt.y, age * (.85 + .3 * seed)));
  float Hq = mix(uCurtB.z, uCurt.z, smoothstep(0., uWind.w * 1.4, age)) * (.72 + .56 * seed), W = iC.w * (1. + .012 * age);
  vec3 lp = vec3(lx.x, uLane.z, zq) + uWind.xyz * age * (.6 + .8 * h11(seed * 9.));
  vec4 c = modelMatrix * vec4(lp, 1.);
  vec2 tc = cameraPosition.xz - c.xz; float dc = length(tc); tc /= max(dc, 1e-3);
  dens *= smoothstep(5., 22., dc);                    // thins out round the lens instead of popping
  float show = step(.004, dens);
  vec3 wp = c.xyz + (vec3(tc.y, 0., -tc.x) * (position.x * W) + vec3(0., position.y * Hq, 0.)) * show;
  vUv = vec2(position.x * 2., position.y); vWorld = wp; vInfo = vec3(dens, seed, age);
  vec4 mvPosition = viewMatrix * vec4(wp, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,It=`
#include <common>
#include <fog_pars_fragment>
uniform vec4 uCurt; uniform float uTime; uniform vec3 uDust;
varying vec2 vUv; varying vec3 vWorld; varying vec3 vInfo;
${We}
void main(){
  float seed = vInfo.y, x = vUv.x, y = vUv.y;
  // one standing column of mist: big slow billows, fine ones that climb, a domed cauliflower head
  vec2 q = vec2(x * 1.5 + seed * 13., y * 1.9 - uTime * .07 + seed * 5.);
  float n = vnoise(q + vec2(uTime * .04, 0.)) * .6 + vnoise(q * 2.3 - vec2(uTime * .06, uTime * .03)) * .4;
  float n2 = vnoise(q * 5.1 + vec2(0., uTime * .2)) * .62 + vnoise(q * 11.7 - vec2(uTime * .11, -uTime * .27)) * .38;
  float top = .76 + .2 * n + uSprayK.z * (n2 - .5) * .45;                              // where this billow gives out
  float head = 1. - smoothstep(top - .1, top + .03, y + .24 * x * x);
  float side = 1. - smoothstep(.42, 1., abs(x) + .24 * (n - .5));
  float body = side * head * smoothstep(0., .035, y);
  float a = body * (.55 + .6 * n) * (.8 + .4 * n2) * vInfo.x * uCurt.w;
  if(a < .003) discard;
  float fs = scatterWide(vWorld);
  // thick mist shades itself: the heart of a billow is cooler and dimmer, its crest and its ragged rim burn
  float heart = smoothstep(.2, .9, body * (.5 + .7 * n));
  float crest = smoothstep(top - .3, top, y) * (.6 + .4 * n2);
  float lit = (.42 + .58 * (1. - heart)) * (.7 + .6 * n2) + .5 * crest;
  vec3 amb = mix(uSprayCol * (.3 + .12 * y), uDust, uDust.r > 0. ? .45 * (1. - y) : 0.);
  vec3 c = amb + uSunCol * uSprayK.x * (.03 + fs * lit * 1.05);
  gl_FragColor = vec4(c, min(a, .86));
  #include <fog_fragment>
  gl_FragColor.rgb *= gl_FragColor.a;
}`,Ft=`
#include <common>
#include <fog_pars_vertex>
varying vec3 vLocal, vWorld;
void main(){
  vLocal = position; vec4 wp = modelMatrix * vec4(position, 1.); vWorld = wp.xyz;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Tt=`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uHorizon, uDeep, uGrassA, uGrassB, uBed; uniform vec4 uWake;   // uWake: x trail length m, y pool radius m, z strength, w grass
varying vec3 vLocal, vWorld;
${ve}
${We}
void main(){
  vec2 p = vLocal.xz; float t = uTime;
  vec3 Vv = cameraPosition - vWorld; float dist = length(Vv); vec3 V = Vv / max(dist, 1e-3);
  // the wake: inside the herd's band, from its front back along the trail
  float qw = (p.y - uWheel.x) / uWheel.y; float d = p.x - .5 * uLane.x * p.y * p.y + uWheel.z * exp(-qw * qw), front = uHerd.x + uHerd.z * .5, behind = front - p.y;
  float q = (p.y - uPool.x) / uPool.w, g = exp(-q * q), hw = uEnv.w + 3. + uPool.z * .1 * g;
  float band = 1. - smoothstep(hw - 9., hw + 5., abs(d) + 4. * (vnoise(vec2(p.y * .05, d * .02)) - .5));
  float fresh = smoothstep(-6., 22., behind) * (1. - smoothstep(uHerd.z * .9, uHerd.z + uWake.x, behind));
  float inHerd = smoothstep(-6., 22., behind) * (1. - smoothstep(uHerd.z * .7, uHerd.z * 1.2, behind));
  float qp = (uPool.x - uWheel.x) / uWheel.y; vec2 pc = vec2(.5 * uLane.x * uPool.x * uPool.x + uPool.y - uWheel.z * exp(-qp * qp), uPool.x); float pr = length(p - pc);
  float pool = uPool.z > 0. ? 1. - smoothstep(uWake.y - 3., uWake.y + 1.5, pr + 2.5 * (vnoise(p * .12) - .5)) : 0.;
  float wake = band * fresh * (1. - pool) * uWake.z;
  float dw = d + 3. * (vnoise(p * .13) - .5) + 1.2 * (vnoise(p * .47 + 4.) - .5);
  float streak = (vnoise(vec2(dw * .8, p.y * .16 + 3.)) * .55 + vnoise(vec2(dw * 1.9, p.y * .41)) * .45) * (.72 + .56 * vnoise(p * 1.3 + 7.));
  float fnear = 1. - smoothstep(8., 30., dist);
  float flace = spLace(vec2(dw * 1.15, p.y * .62) + t * .03) * .7 + spLace(vec2(dw * 3.1, p.y * 1.9) + 7.) * .5 * fnear + smoothstep(.34, .52, vnoise(p * 15.) * vnoise(p * 27. + 3.)) * .22 * (1. - smoothstep(4., 13., dist));
  float foam = wake * smoothstep(.56 - .08 * inHerd, 1.02, streak + .18 * vnoise(p * 2.9 + t * .15)) * flace * (.25 + .5 * inHerd);
#ifdef WAKE_ONLY
  if(wake < .01) discard;
#endif
  // ripples: wind cat's paws plus the chop the herd leaves
  float amp = (.03 + .07 * wake) / (1. + dist * .012);
  vec2 rp = vec2(sin(p.x * 1.3 + t * 1.1 + 2. * sin(p.y * .7 - t * .6)), sin(p.y * 1.7 - t * 1.3 + 2. * sin(p.x * .9 + t * .5)));
  rp += 1.6 * (vec2(vnoise(p * 2.7 + t * .4), vnoise(p * 2.7 + 17. - t * .35)) - .5);
  vec3 N = normalize(vec3(rp.x * amp, 1., rp.y * amp));
  float nv = max(dot(N, V), 0.), fres = .025 + .975 * pow(clamp(1. - nv, 0., 1.), 5.);
  vec3 R = reflect(-V, N); R.y = abs(R.y);
  float toS = max(dot(normalize(R.xz + vec2(1e-4, 0.)), normalize(uSunDir.xz + vec2(1e-4, 0.))), 0.); toS *= toS * toS;
  vec3 sky = mix(mix(mix(uHorizon, uSkyCol, .72) * .84, uHorizon * .95, toS * .35), uSkyCol * .9, smoothstep(0., .26, R.y));   // a blue mirror; warm only down the sun's road
  float sr = max(dot(R, uSunDir), 0.), s8 = sr * sr; s8 *= s8; s8 *= s8;
  float spark = vnoise(p * 5. + vec2(t * 1.3, -t)) * vnoise(p * 9. - vec2(t, t * 1.7));
  float s64 = s8 * s8; s64 *= s64; s64 *= s64;
  float glit = s64 * s64 * smoothstep(.32, .5, spark) * .8;
  // looking down: clear tea-gold water over pale sand and dark weed; deep blue in the pool
  float weed = smoothstep(.45, .7, vnoise(p * .23 + 9.) * .6 + vnoise(p * .9) * .4);
  vec3 bed = mix(uBed, uBed * vec3(.35, .42, .24), weed * .6) * (uSunCol * max(uSunDir.y, 0.) * .3183 * .8 + uSkyCol * .25);
  bed = mix(bed, uDeep * .16, pool);
  vec3 stir = uBed * vec3(.5, .52, .34) * (uSunCol * max(uSunDir.y, 0.) * .3183 + uSkyCol * .35);
  bed = mix(bed, stir, wake);
  vec3 c = mix(bed, sky, fres * (1. - .4 * wake)) + uSunCol * glit;
  // grass and sedge tips standing through the water: more of them the lower the eye, bent flat in the wake
  float gn = vnoise(p * .17) * .45 + vnoise(p * .6) * .35 + vnoise(p * 2.4) * .2;
  float tips = mix(smoothstep(.4, .72, vnoise(p * vec2(13., 9.)) * .5 + vnoise(p * vec2(31., 37.)) * .5), .42, smoothstep(8., 55., dist));
  float cover = clamp(smoothstep(.3, .62, gn + .3 * vnoise(p * .04 + 3.)) * tips * (.5 + 1.1 * (1. - nv) * (1. - nv)), 0., .8) * uWake.w * (1. - pool) * (1. - .85 * wake);
  float toSun = max(dot(-V, uSunDir), 0.);
  vec3 grass = mix(uGrassB, uGrassA, smoothstep(.3, .8, vnoise(p * .31 + 5.))) * (uSkyCol * .5 + uSunCol * (.3 + 1.1 * toSun * toSun)) * .3183;
  c = mix(c, grass, cover);
  vec3 fc = uSprayCol * .55 + uSunCol * (.05 + .22 * scatter(vWorld));
  c = mix(c, fc, clamp(foam, 0., .8));
#ifdef WAKE_ONLY
  gl_FragColor = vec4(mix(mix(stir, sky, .3 + fres * .6) + uSunCol * glit, fc, clamp(foam, 0., .8)), clamp(wake * .34 + foam, 0., .85));   // the stirred water stays a mirror: the sky still lies on it
#else
  gl_FragColor = vec4(c, 1.);
#endif
  #include <fog_fragment>
}`,pt={afternoon:{elev:24,sun:"#fff1cf",sunI:3.1,skyI:1,horizon:"#eadfc6",spray:"#f3f6f8",bounce:.75},golden:{elev:9,sun:"#ffb25c",sunI:2.7,skyI:.8,horizon:"#f2c48e",spray:"#f6e2c8",bounce:.6},dawn:{elev:7,sun:"#ffb9a2",sunI:1.7,skyI:.7,horizon:"#e8c3bd",spray:"#e9dfe2",bounce:.55},night:{elev:32,sun:"#a9bde6",sunI:.42,skyI:.12,horizon:"#1c2a44",spray:"#aebdd8",bounce:.1}},Ge=(m,o)=>{const e=[],w=[],g=[];m.forEach((h,B)=>{for(const[j,L]of[[-.5,0],[.5,0],[.5,1],[-.5,1]])o?e.push(j,0,L-.5):e.push(j,L,0),w.push(h);g.push(B*4,B*4+1,B*4+2,B*4,B*4+2,B*4+3)});const c=new n.BufferGeometry;return c.setAttribute("position",new n.Float32BufferAttribute(e,3)),c.setAttribute("aK",new n.Float32BufferAttribute(w,1)),c.setIndex(g),c},de=(m,o,e)=>{const w=new n.InstancedBufferGeometry;w.index=m.index;for(const g in m.attributes)w.setAttribute(g,m.attributes[g]);for(const g in o)w.setAttribute(g,new n.InstancedBufferAttribute(o[g][0],o[g][1]));return w.instanceCount=e,w.boundingSphere=new n.Sphere(new n.Vector3,1e5),w};async function Gt(m,o={}){const e=m.rng,w=m.quality?.detail??1,g=(o.palette&&o.palette.length>=7?o.palette:Wt).map(P),c=o.cast==="buffalo",h=pt[o.hour]||pt.afternoon,B=o.weather||"clear",j=o.season||"flood",L={gold:g[0],sedge:g[1],deep:g[2],sky:g[3],cream:g[4],coat:c?P("#2b2622"):g[5],culm:g[6]},d=300,b=30,pe=b+2,A=o.waterY??.3,H=o.speed??(c?9:13),Pe=o.duration??42,S=o.travel??H*Pe;let k=o.zStart??-155-.56*S;const Q=o.arc??e.range(26e-5,42e-5),f=o.pool===!1?null:{z:o.pool?.z??40,d:o.pool?.d??e.range(-7,3),radius:o.pool?.radius??20,sigma:44},ce=f?f.radius+4:0,me=f?f.z:0,J=f?f.d:0,y=f?f.sigma:44,l=o.wheel?{z:o.wheel.z??0,sigma:Math.max(o.wheel.sigma??60,1),amp:o.wheel.amp??0}:{z:0,sigma:60,amp:0},R=t=>{const r=(t-l.z)/l.sigma;return l.amp*Math.exp(-r*r)},he=(t,r)=>{const i=r-J,v=(t-me)/y;return .5*Q*t*t+r+(i<0?-1:1)*ce*Math.max(1-Math.abs(i)/pe,0)*Math.exp(-v*v)},ye=(t,r)=>he(t,r)-R(t),M=t=>he(t,-b),C=t=>k+S*t,ue=e.range(-.12,.12),ee=h.elev*Math.PI/180,s=o.sunDir?new n.Vector3(...o.sunDir).normalize():new n.Vector3(Math.cos(ee)*Math.cos(ue),Math.sin(ee),Math.cos(ee)*Math.sin(ue)),u=B==="haze"?.6:1,a={uHerd:{value:new n.Vector4(0,0,d,1)},uPool:{value:new n.Vector4(me,J,ce,y)},uLane:{value:new n.Vector4(Q,H,A,pe)},uEnv:{value:new n.Vector4(e.range(36,56),e.range(22,40),e.range(-12,12),b)},uTime:{value:0},uWaterW:{value:A},uWheel:{value:new n.Vector4(l.z,l.sigma,l.amp,0)},uGait:{value:new n.Vector4(c?.3:.9,c?.5:1.6,.2,c?.05:.08)},uSunDir:{value:s.clone()},uSunLocal:{value:s.clone()},uSunCol:{value:P(h.sun).multiplyScalar(h.sunI*u)},uSkyCol:{value:L.sky.clone().multiplyScalar(h.skyI)},uHorizon:{value:P(h.horizon).multiplyScalar(h.skyI)},uBounce:{value:L.sky.clone().lerp(P(h.horizon),.5).multiplyScalar(h.skyI*h.bounce)},uSprayCol:{value:P(h.spray).multiplyScalar(.3+.5*h.skyI)},uSprayK:{value:new n.Vector4(o.curtainGain??1,o.crownGain??1,.3,0)}},p=()=>n.UniformsUtils.clone(n.UniformsLib.fog),W=(...t)=>{const r={};for(const i of t)r[i]=a[i];return r},F=["uHerd","uPool","uLane","uEnv","uTime","uWheel"],T=["uSunDir","uSunCol","uSkyCol","uSprayCol","uSprayK"],q=Math.round(fe(o.count??e.range(360,440),280,520)),E=Math.round(fe(o.nearLanes??3,3,6)),we=Math.min(o.nearMax??150,Math.round((q>460?111:120)*E/3),Math.round(q*.1*E)),x=q-we,D=o.rams??e.range(.3,.46),X=c?3.2:5,_=c?4:6.2,De=[-b,-b+e.range(2.7,3.2),-b+e.range(5.6,6.5)];for(let t=3;t<E;t++)De.push(-b+6.3+4.3*(t-2)+t*.37%.6-.3);const Re=e.int(10,12),Ne=[];for(let t=0;t<Re;t++)Ne.push(Ae(-b+10.6+4.45*(E-3),b,t/(Re-1))+e.range(-.7,.7));const Oe=(t,r,i)=>{const v=new Float32Array(r*4),V=new Float32Array(r*4),G=new Float32Array(r*3);let I=0;return t.forEach((Ce,re)=>{const nt=re===t.length-1?r-I:Math.round(r*(i?i[re]??1/t.length:1/t.length)),st=[],rt=!!i&&re===0;let it=0;for(let ie=0;ie<nt;ie++){const le=rt?e.range(.78,1.22):e.chance(.14)?e.range(1.8,3.2):e.range(.45,1.2);st.push(le),it+=le}let lt=e()*d;for(let ie=0;ie<nt;ie++,I++){lt+=st[ie]/it*d;const le=e.chance(rt?.86:i?Math.max(D,.6):D),ct=!le&&e.chance(.12),Ct=(c?1.45:1)*(le?e.range(.98,1.08)*(i?1.06:1):ct?e.range(.66,.76):e.range(.84,.95)),ut=e.range(X,_)*(ct?.92:1);v.set([lt%d-d/2,Ce+fe(e.gauss()*.6,-1.3,1.3),e()*ut,ut],I*4),V.set([Ct,le||c?1:0,e(),e.int(7,11)],I*4);const Ve=e.range(.82,1.14),ft=e.range(-.06,.06);G.set([Ve*(1+ft),Ve,Ve*(1-ft*1.5)],I*3)}}),{iA:v,iB:V,iT:G,n:r}},z=Oe(De,we,E===3?[.42,.3,.28]:null),N=Oe(Ne,x);await m.yield?.();const Le=dt(L,!0);await m.yield?.();const Me=dt(L,!1);await m.yield?.();const mt=()=>new n.ShaderMaterial({uniforms:{...p(),...W(...F,"uSunDir","uSunCol","uSkyCol","uBounce","uGait","uWaterW")},vertexShader:Pt,fragmentShader:Lt,vertexColors:!0,fog:!0,side:n.DoubleSide}),$=new n.Group;$.name="delta-in-flood-hero";const te=(t,r,i)=>{const v=new n.Mesh(t,r);return v.frustumCulled=!1,v.renderOrder=i,$.add(v),v},qe=mt();te(de(Le,{iA:[z.iA,4],iB:[z.iB,4],iTint:[z.iT,3]},z.n),qe,0),te(de(Me,{iA:[N.iA,4],iB:[N.iB,4],iTint:[N.iT,3]},N.n),qe,0),await m.yield?.();const O={iA:new Float32Array(q*4),iB:new Float32Array(q*4)};O.iA.set(z.iA,0),O.iA.set(N.iA,z.n*4),O.iB.set(z.iB,0),O.iB.set(N.iB,z.n*4);const ht=(X+_)/2/H,Ke=5,_e=c?1.35:1,Be=(t,r,i,v={})=>new n.ShaderMaterial({uniforms:{...p(),...i},vertexShader:t,fragmentShader:r,fog:!0,transparent:!0,depthWrite:!1,premultipliedAlpha:!0,side:n.DoubleSide,...v}),Ue={value:new n.Vector4(7*_e,3*_e,5.4*Math.sqrt(_e),3)},yt=te(de(Ge([0,1,2,3,4,5],!0),{iA:[O.iA,4],iB:[O.iB,4]},q),Be(_t,Bt,{...W(...F,...T,"uGait","uSunLocal","uHorizon"),uRingLife:{value:Ke},uRingT:{value:Ke*ht}},{polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-4}),1);await m.yield?.();const Z=B==="wind",oe=Math.max(160,Math.round(360*w)),je=new Float32Array(oe*4),Xe=Z?660:520;for(let t=0;t<oe;t++)je.set([(t+e())/oe*Xe,e(),e(),e.range(15,24)],t*4);const $e=o.curtainHeight??10.5,Ze={value:new n.Vector4(Xe,Z?24:15,Z?$e*.62:$e,(Z?.55:.8)*Math.min(360/oe,1.5))},Ye={value:new n.Vector4(o.curtainNear??-b+13,b+9,Z?3:5,0)},wt={value:new n.Vector4(Z?2.3:e.range(.35,.7),.03,Z?-1.3:e.range(-.4,-.1),c?6:8)},gt={value:j==="may"?new n.Color(.46,.37,.25):new n.Color(0,0,0)},xt=te(de(Ge([0],!1),{iC:[je,4]},oe),Be(Ht,It,{...W(...F,...T),uCurt:Ze,uCurtB:Ye,uWind:wt,uDust:gt}),2),zt=te(de(Ge([0,1,2,3],!1),{iA:[O.iA,4],iB:[O.iB,4]},q),Be(Mt,qt,{...W(...F,...T,"uGait"),uCrown:Ue}),3);await m.yield?.();const ae=o.water===!1?null:o.water==="wake"?"wake":"full";let ge=null;if(ae){const t=new n.BufferGeometry,r=ae==="wake"?-125:-1600,i=ae==="wake"?160:1600,v=k-d/2-460,V=ae==="wake"?k+S+d/2+20:1500;t.setAttribute("position",new n.Float32BufferAttribute([r,A,v,i,A,v,i,A,V,r,A,V],3)),t.setIndex([0,2,1,0,3,2]),t.boundingSphere=new n.Sphere(new n.Vector3,1e5);const G=ae==="wake";ge=te(t,new n.ShaderMaterial({uniforms:{...p(),...W(...F,...T,"uHorizon"),uDeep:{value:L.deep},uGrassA:{value:L.gold},uGrassB:{value:L.sedge},uBed:{value:P("#d9c9a2")},uWake:{value:new n.Vector4(420,f?f.radius:0,1,j==="may"?1.25:1)}},vertexShader:Ft,fragmentShader:Tt,fog:!0,defines:G?{WAKE_ONLY:1}:{},transparent:G,depthWrite:!G,side:n.DoubleSide,...G?{polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-2}:{}}),0)}const Y=A+3,He=[];for(let t=-215;t<=-5;t+=35)He.push([M(t)-18,Y,t]);const Qe=10*Math.PI/180,Ie=6*Math.PI/180,Fe=[M(70)-19,Y,70],ne=new n.Vector3(-Math.sin(Qe)*Math.cos(Ie),Math.sin(Ie),Math.cos(Qe)*Math.cos(Ie)),Te=[Fe[0]+ne.x*25,Y+.3,Fe[2]+ne.z*25],Je=[Te[0]+ne.x*60,A+9.5,Te[2]+ne.z*60],xe={flyThrough:[[M(-330)-44,Y+1.5,-330],[M(-270)-26,Y+.4,-270],...He,[M(35)-18.5,Y,35],Fe,Te,Je],paceLine:He,portalSeat:{position:Je,facing:[-ne.x,0,-ne.z],radius:7},pool:f?{position:[ye(f.z,f.d)-(f.d-J),A,f.z],radius:f.radius}:null,viewpoints:{pace:{from:[M(-60)-18,Y,-60],to:[M(-35)+14,2.2,-35]},far:{from:[M(-200)-150,26,-420],to:[0,3,-40]}},herd:{speed:H,length:d,width:b*2,zStart:k,travel:S,count:q},sunDir:s.toArray(),waterY:A};f&&(xe.pool.position[0]=.5*Q*f.z*f.z+f.d-R(f.z));let ze=new n.Vector3(0,3,0),be=190,Se=8;const Ee=o.focus;Ee==="pace"?(ze.set(M(-40)+1,1.3,-40),be=3,Se=5):Ee==="herd"?(ze.set(0,2.5,0),be=14,Se=8):Ee==="pool"&&f&&(ze.set(xe.pool.position[0],1.5,f.z),be=16,Se=9);let se=null,et=0,K=null,tt=0,ke=1;const ot=new n.Quaternion,bt=({sunDir:t,sunColor:r,skyColor:i,horizonColor:v}={})=>{t&&(s.set(t.x??t[0],t.y??t[1],t.z??t[2]).normalize(),a.uSunLocal.value.copy(s)),r&&a.uSunCol.value.copy(r),i&&a.uSkyCol.value.copy(i),v&&a.uHorizon.value.copy(v),(i||v)&&a.uBounce.value.copy(a.uSkyCol.value).lerp(a.uHorizon.value,.5).multiplyScalar(h.bounce)};function at(t,r){a.uTime.value=r,se==null||se<=0?(et=r,K=null,ke=1,a.uHerd.value.set(se==null?0:k,H*r%d,d,1)):(K==null&&(K=H*et%d,tt=K>d*.5?d-K:-K),ke=Math.max(0,ke-Math.max(t||0,0)/1.2),a.uHerd.value.set(k+S*se,o.settle===!1?K:K+tt*vt(.18,.45,se),d,ke)),$.updateWorldMatrix(!0,!1),$.getWorldQuaternion(ot),a.uSunDir.value.copy(s).applyQuaternion(ot).normalize(),a.uWaterW.value=$.matrixWorld.elements[13]+A}at(0,0);const St=(t,r,i={})=>{const v=z.iA[t*4],V=z.iA[t*4+1],G=r+v,I=a.uEnv.value,Ce=(V-I.z)/I.w,re=V/I.w;return i.x=ye(G,V),i.z=G,i.sc=z.iB[t*4],i.ram=z.iB[t*4+1]>.5,i.lane=V,i.inside=Math.min(d/2-I.x*Ce*Ce-9-v,v+d/2-I.y*re*re*1.6),i},kt=Le.userData.triangles*z.n+Me.userData.triangles*N.n+q*10*2+oe*2+(ge?2:0);return{object:$,radius:be,height:Se,center:ze,anchors:xe,update:at,dispose(){},ground:!ge||ae==="wake",groundY:0,setProgress(t){se=t},setRun(t={}){t.zStart!==void 0&&(k=t.zStart,xe.herd.zStart=k)},setLight:bt,laneX:ye,flankX:M,wheelAt:R,centerZ:C,nearAt:St,nearCount:z.n,zStartNow:()=>k,uniforms:a,parts:{herdMat:qe,flats:yt,curtain:xt,crowns:zt,sheet:ge,uCurt:Ze,uCurtB:Ye,uCrown:Ue},stats:{triangles:kt,drawCalls:$.children.length,animals:q,near:z.n,far:N.n,trisNear:Le.userData.triangles,trisFar:Me.userData.triangles}}}export{Gt as buildHero};
