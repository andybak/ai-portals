import*as v from"three";import{clamp as St,lerp as ve,smoothstep as ja,makeRng as Oa,hashSeed as Ra}from"../kit/core.js";const Ya=["#F6E9D2","#F4B8C6","#CDE6A5","#A9D4EF","#C68A55","#E3207F","#D8281C"],m=(h,f,l)=>new v.Vector3(h,f,l),H=h=>new v.Color(h),Ut=h=>h.isVector3?h.clone():m(h[0],h[1],h[2]);function bt(h,f,l,b){let N=1e9;for(let A=0;A<b.length-1;A++){const C=b[A],L=b[A+1],Y=L.x-C.x,rt=L.y-C.y,B=L.z-C.z,ut=Y*Y+rt*rt+B*B||1e-6,T=St(((h-C.x)*Y+(f-C.y)*rt+(l-C.z)*B)/ut,0,1),F=C.x+Y*T-h,_=C.y+rt*T-f,g=C.z+B*T-l,k=F*F+_*_+g*g;k<N&&(N=k)}return Math.sqrt(N)}function Ht(h,f,l){let b=Math.imul(h|0,374761393)+Math.imul(f|0,668265263)+Math.imul(l|0,1274126177)|0;return b=Math.imul(b^b>>>13,1274126177),b^=b>>>16,(b>>>0)/4294967296}const Ma=`
uniform float uTime, uCutAt, uCutClock, uPx, uGust;
uniform vec3 uCam;
attribute vec3 iA;   // roof anchor
attribute vec4 iL;   // azimuth, elevation, line length, kite half size
attribute vec4 iP;   // phase, speed, azimuth swing, elevation swing
attribute vec2 iM;   // mode (0 flying, 1 cut and drifting, 2 cut at the great cut), hash
vec3 flyAt(float t){
  float w = iP.y, ph = iP.x;
  float s1 = sin(t*w + ph), s2 = sin(t*w*2. + ph*1.7);
  float f = fract(t*w*0.11 + ph*0.37);
  float st = smoothstep(0., .07, f)*(1. - smoothstep(.09, .26, f))*step(.55, iM.y);
  float gust = iP.w*.9*sin(t*.31 + iA.z*.021 + iA.x*.013);
  float az = iL.x + iP.z*(s1 + .35*sin(t*w*.37 + ph*2.3)) + st*iP.z*1.4*sin(ph*5.);
  float el = clamp(iL.y + iP.w*s2 - st*iP.w*3. + gust, .15, 1.5);
  float ce = cos(el);
  return iA + iL.z*vec3(sin(az)*ce, sin(el), -cos(az)*ce);
}
vec3 driftFrom(vec3 s0, float ts){
  float fall = 3.0 + 1.8*iM.y;
  float tl = clamp(ts, 0., max(s0.y - iA.y - .4, 0.)/fall);
  return s0 + vec3(sin(tl*.9 + iP.x)*5.*smoothstep(0., 3., tl), -fall*tl, -(4.5 + 3.*iM.y)*tl);
}
// returns position; vis = 0 hides (cut kites fade in and out of their loop)
vec3 kiteAt(float t, out float vis, out float cut){
  vis = 1.; cut = 0.;
  vec3 p = flyAt(t);
  if (iM.x > 1.5) {
    if (uCutClock >= 0.) { p = driftFrom(flyAt(uCutAt), uCutClock + (t - uTime)); cut = 1.; }
  } else if (iM.x > .5) {
    float ts = fract(t/46. + iM.y*7.)*46.;
    p = driftFrom(flyAt(iP.x*9.), ts); cut = 1.;
    vis = smoothstep(0., 1.5, ts)*(1. - smoothstep(43., 45.5, ts));
  }
  return p;
}
`,wa=`
vec3 trainWave(float s, float t){
  float e = sin(3.14159*clamp(s, 0., 1.)); e = e*sqrt(max(e, 0.));
  float a = .55 + .75*uGust;
  return e*a*vec3(2.2*sin(s*21. - t*1.7) + .6*sin(s*47. - t*2.9), .7*sin(s*17. - t*1.3 + 1.), 0.);
}
`,Ie=`
uniform vec3 uSunDir, uSun, uSky, uGnd;
// translucent paper: lit face, plus stained-glass transmission when the sun is behind it
vec3 paper(vec3 base, vec3 N, vec3 V, float bone){
  if (dot(N, V) < 0.) N = -N;
  float ndl = dot(N, uSunDir);
  float front = max(ndl, 0.), back = max(-ndl, 0.);
  float vds = max(dot(-V, uSunDir), 0.);
  vec3 sat = base*base*1.25 + base*.35;
  vec3 amb = mix(uGnd, uSky, .5 + .5*N.y);
  vec3 c = base*(amb*1.15 + uSun*front*(1. - .45*bone));
  c += sat*uSun*back*1.6*(.5 + .5*vds*vds)*(1. - .85*bone);
  return c;
}
`,za=`
#include <common>
#include <fog_pars_vertex>
${Ma}
${wa}
attribute vec3 aN; attribute vec2 aPT; attribute vec3 iC1; attribute vec3 iC2; attribute float iPat;
uniform float uGrow, uTanH;
varying vec3 vN; varying vec3 vP; varying vec3 vC1; varying vec3 vC2; varying vec3 vUv; varying float vPat; varying vec2 vSH;
void main(){
  float vis = 1., cut = 0.;
#ifdef TRAIN
  vec3 P = iA + trainWave(iP.x, uTime);
  vec3 vel = (iA + trainWave(iP.x, uTime + .12) - P)/.12;
  vec3 n = normalize(-normalize(iL.xyz)*.55 + vec3(.5*sin(iM.y*6.283 + uTime*.9), -.4, .75));          // each kite of the chain yaws on the line
  float dist = length(P - uCam);
  // from far off the chain is drawn as a ribbon a fiftieth of the frame's half height across, whatever the resolution, so
  // the one red line of the sky reads from the far end of the city; it comes down to its true size as we near it
  float sz = max(max(iP.y*(1. + min(dist/150., .8)), 2.*dist*uPx), .02*dist*uTanH);
  vSH = vec2(smoothstep(170., 420., dist), iM.y);
  vec3 raw = vec3(0., 1., 0.) + vel*.14;
  float tailLen = 1.6, has = 1.;
#else
  vec3 P = kiteAt(uTime, vis, cut);
  float v2, c2;
  vec3 vel = (kiteAt(uTime + .12, v2, c2) - P)/.12;
  vec3 n = -normalize(P - iA + vec3(0., 1e-3, 0.));
  n = normalize(mix(n, vec3(.3*sin(uTime*.8 + iP.x), .55, .75), cut*.8));
  float dist = length(P - uCam);
  float sz = iL.w*(1. + min(dist/uGrow, 1.2));
  float big = step(1.2, iL.w);
  // far out the sky is fewer and larger: by 380 m one field kite in eight is left, each a diamond six or seven pixels
  // across, so the distance reads as separate kites with blue between them and not as a band of specks (the great
  // kites are all kept). A kite of size 0 was taken out of a sight line by the world (opts.clearLanes).
  float keep = max(step(.88*smoothstep(110., 380., dist), iM.y), big)*step(.05, iL.w);
  sz = max(sz, mix(3.2, 1.4, big)*dist*uPx)*keep;
  vec3 raw = vec3(1e-3, 3., 0.) + vel*(1. - .7*cut);
  float tailLen = 3.4 + 1.6*big, has = max(step(.3, fract(iM.y*13.7)), big)*mix(1. - smoothstep(240., 320., dist), 1., big);
  vSH = vec2(iL.w, iM.y);
#endif
  vec3 nose = normalize(raw - n*dot(raw, n) + vec3(1e-4, 0., 1e-4));
  vec3 rt = normalize(cross(nose, n));
  vec3 lp; vec3 nl;
  float part = aPT.x;
  if (part < 1.5) {
    float rip = sin(uTime*19. + iP.x*7. + position.y*5.)*.03*(.3 + abs(position.x));
    lp = P + sz*(rt*position.x + nose*position.y + n*(position.z + rip));
    nl = rt*aN.x + nose*aN.y + n*aN.z;
  } else {
    float t = aPT.y*has;
    vec3 td = normalize(-nose*.45 + vec3(0., -.75, -.6) - vel*.05);
    float wa = uTime*7. - t*5.5 + iP.x*3.;
    float wv = (sin(wa)*.24 + sin(uTime*11.3 - t*9. + iP.x)*.09)*t;
    lp = P + sz*(-nose*1.15 + td*t*tailLen + rt*(position.x*has + wv) + n*wv*.5);
    nl = normalize(n + rt*cos(wa)*.6);
  }
  lp = mix(P, lp, vis);
  vN = nl; vP = lp; vUv = vec3(position.xy, part); vC1 = iC1; vC2 = iC2; vPat = iPat;
  vec4 mvPosition = modelViewMatrix*vec4(lp, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
#if defined(TRAIN) && defined(USE_FOG)
  vFogDepth *= .45;                       // the one red chain keeps its colour from the far end of the city
#endif
#if !defined(TRAIN) && defined(USE_FOG)
  vFogDepth *= mix(1.35, 1., big);        // the field kites sink into the haze a little sooner than the roofs: the paper has depth and keeps its colour
#endif
}`,Aa=`
#include <common>
#include <fog_pars_fragment>
${Ie}
uniform vec3 uCam; uniform float uLamp;
varying vec3 vN; varying vec3 vP; varying vec3 vC1; varying vec3 vC2; varying vec3 vUv; varying float vPat; varying vec2 vSH;
float kh1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)))*43758.5453); }
float kvn(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
  return mix(mix(kh1(i), kh1(i + vec2(1., 0.)), f.x), mix(kh1(i + vec2(0., 1.)), kh1(i + vec2(1., 1.)), f.x), f.y);
}
void main(){
  float x = vUv.x, y = vUv.y, part = vUv.z;
  float aa = fwidth(y)*1.5 + fwidth(x)*1.5 + 1e-4;
  float big = step(1.2, vSH.x);
  vec3 base; float bone = 0.;
  if (part < .5) {
    float m;
#ifdef TRAIN
    if (vPat < .5) m = smoothstep(.86, .86 + aa, abs(x) + abs(y - .18)*.82);
#else
    if (vPat < .5) m = smoothstep(.74, .74 + aa, abs(x) + abs(y - .18)*.82);
#endif
    else if (vPat < 1.5) m = smoothstep(-aa, aa, x);
    else if (vPat < 2.5) m = smoothstep(.18 - aa, .18 + aa, y);
    else if (vPat < 3.5) m = smoothstep(.5 - aa*2., .5 + aa*2., abs(fract((y + x*.6)*2.1) - .5)*2.);
    else if (vPat < 4.5) { float d = length(vec2(x, y - .2)), d2 = length(vec2(x - .15, y - .28)); m = (1. - smoothstep(.44, .44 + aa, d))*smoothstep(.37, .37 + aa, d2); }
    else if (vPat < 5.5) m = smoothstep(-aa*.3, aa*.3, x*(y - .18));
    else m = 1. - smoothstep(.33, .33 + aa, length(vec2(x, y - .2)));
    base = mix(vC1, vC2, m);
    base *= .93 + .07*sin(x*41.)*sin(y*37.);
    float spine = 1. - smoothstep(.02, .02 + aa, abs(x));
    float bw = .2 + .78*sqrt(max(1. - x*x/.9025, 0.));
    float bow = 1. - smoothstep(.022, .022 + aa, abs(y - bw));
    bone = max(spine, bow)*.9;
    if (big > .5) {                                      // the great kites near the route: real paper
      float e = 1. - abs(x)/.95 - (y > .2 ? (y - .2)/.8 : (.2 - y)/1.2);                  // 0 on the rim of the diamond
      float fib = kvn(vec2(x*52., y*5.)), fib2 = kvn(vec2(x*8. + 3., y*19.));
      base *= mix(1., .8 + .24*fib + .12*fib2, 1. - smoothstep(.03, .12, aa));              // long fibres in the tissue (gone before they can alias)
      float seam = max(1. - smoothstep(.012, .012 + aa, abs(abs(x) - .44)), 1. - smoothstep(.012, .012 + aa, abs(y + .34)));
      base *= 1. - .26*seam;                                                               // creases where the sheets are pasted
      vec3 edgeC = mix(mix(vC2, vC1, m), vec3(.93, .88, .76), .35);
      base = mix(base, edgeC, 1. - smoothstep(.055, .055 + aa, e));                         // a pasted border in the other colour
      base = mix(base, vC2*.8 + .1, (1. - smoothstep(.09, .09 + aa, length(vec2(x, y - .2))))*.9);   // the bridle patch
    }
#ifdef TRAIN
    base *= .82 + .36*vSH.y;                             // three hundred sheets of paper, no two quite the same red
    base = mix(base, base*vec3(.5, .3, .3), bone);
#endif
  } else if (part < 1.5) {
    base = vC2;
    if (big > .5) {                                      // a fringed paper tassel
      float st = fract(x*13.);
      base = mix(vC2, vC1, step(.5, st));
      if (y < -1.08 && abs(st - .5) > .3) discard;
    }
  } else base = mix(vC1, vC2, step(.5, fract(vPat*.37 + .2 + big*floor(y*6. + .001)*.5)));
  vec3 c = paper(base, normalize(vN), normalize(uCam - vP), bone);
#ifdef TRAIN
  c += base*uLamp*.3;
  c *= 1. + .4*vSH.x;                                    // far off the chain is a little brighter than its paper
#endif
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`,Ca=h=>`
#include <common>
#include <fog_pars_vertex>
${h?"uniform float uTime, uPx, uGust; uniform vec3 uCam; attribute vec3 aTan; attribute vec3 aSW; attribute vec3 aCol;"+wa:Ma+"attribute vec3 iC1;"}
uniform float uLineW, uAFloor, uBigA;
varying vec3 vT; varying vec3 vP; varying vec3 vCol; varying float vA; varying float vM; varying float vG;
${h?"":`
vec3 ptAt(float s, vec3 K){
  vec3 c = mix(iA, K, s);
  float sag = (.02 + .03*(.5 + .5*sin(uTime*iP.y*.6 + iP.x*2.)))*iL.z;
  float q = pow(clamp(s, 0., 1.), .8);
  c.y -= sag*4.*q*(1. - q);
  return c;
}`}
void main(){
#ifdef STATIC_LINE
  float s = aSW.y, side = aSW.x, hide = 0.;
  vec3 c = position;
  if (aSW.z < .5) c += trainWave(s, uTime);
  else c += sin(3.14159*s)*vec3(sin(uTime*.7 + aSW.z*5.), .5*sin(uTime*.9 + aSW.z*3.), 0.)*(.25 + .4*uGust);
  vec3 T = normalize(aTan);
  vCol = aCol; vM = s*240. + aSW.z*50.;
#else
  float vis, cut;
  vec3 K = kiteAt(uTime, vis, cut);
  float s = position.x, side = position.y, hide = max(cut, 1. - vis);
  vec3 c = ptAt(s, K);
  vec3 T = normalize(ptAt(s + .03, K) - ptAt(s - .03, K));
  vM = s*iL.z + iM.y*200.;
  hide = max(hide, 1. - step(.05, iL.w));
#endif
  vec3 toC = uCam - c; float dist = length(toC);
  vec3 sd = normalize(cross(T, toC) + vec3(1e-5, 0., 0.));
#ifdef STATIC_LINE
  float bigL = 0.;
#else
  float kd = length(K - uCam);
  float bigL = step(1.75, iL.w)*(1. - smoothstep(85., 170., kd));       // the string of a great kite near us: read all the way down to its flyer
  vCol = mix(vec3(.92, .9, .86), iC1, .4 + .32*bigL);                   // and it takes more of its kite's colour, so it reads as that kite's string
#endif
  float px = (1.5 + .3*bigL)*dist*uPx;
  float w = max(uLineW, px);
  float nr = 40./max(dist, 40.);
  vA = clamp(max(uLineW/max(px, 1e-5), uAFloor*pow(nr, .62)), 0., 1.)*(1. - hide);
  vG = pow(nr, .6)*(1. - hide);
#ifndef STATIC_LINE
  float stub = smoothstep(45., 150., dist), sTop = 1. - 40./max(iL.z, 41.);          // far off, only the last 40 m under the kite
  vA *= mix(mix(1., smoothstep(sTop - .12, sTop + .12, s), stub), 1., bigL);
  vA *= mix(1. - .92*smoothstep(-.015, .045, toC.y/max(dist, 1e-3))*smoothstep(18., 55., dist), 1., bigL);   // looked down on from aloft, the lines over the roofs are faint threads, not a veil
  float keepL = max(step(.88*smoothstep(110., 380., kd), iM.y), step(1.2, iL.w));          // no stub hangs where its kite has dropped away
  vA *= mix(1. - .8*smoothstep(90., 320., dist), 1., bigL)*keepL;                          // far field lines fall back: no white hairline fan
  // the bright floor of a great kite's string is for the string seen out in the air. Where it passes close by the eye it
  // falls back to a thread (a wide half-clear band across the foreground read as a smear), and any string looked down
  // on from aloft, against the roofs, is drawn at four tenths: it still runs to its flyer, as a line and not as a veil
  float nearEye = smoothstep(10., 34., dist), below = smoothstep(.04, .3, toC.y/max(dist, 1e-3));
  vA = max(vA, bigL*uBigA*(1. - hide)*(1. - smoothstep(70., 190., dist))*nearEye);
  vA *= 1. - .6*below*smoothstep(4., 20., dist);
#endif
  vec3 lp = c + sd*side*w*.5*(1. - hide);
  vT = T; vP = lp;
  vec4 mvPosition = modelViewMatrix*vec4(lp, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Pa=`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uCam, uSunDir, uSun, uSky; uniform float uTime;
varying vec3 vT; varying vec3 vP; varying vec3 vCol; varying float vA; varying float vM; varying float vG;
void main(){
  vec3 T = normalize(vT), V = normalize(uCam - vP);
  vec3 H = normalize(V + uSunDir + vec3(0., 1e-4, 0.));
  float th = dot(T, H), k = max(1. - th*th, 0.);
  float band = pow(max(sin(vM*.21 + dot(V, vec3(31., 17., 23.))), 0.), 24.);
  float glint = pow(k, 260.)*band;
  float cell = floor(vM*1.3 - uTime*2.5);
  float spark = step(.9, fract(sin(cell*12.9898)*43758.5453))*pow(k, 30.);
  float g = (glint + spark*.15)*vG;
  vec3 col = vCol*(uSky*1.2 + uSun*.42) + uSun*g*2.0;
  gl_FragColor = vec4(col, clamp(vA*(1. + g*1.5) + g*.2, 0., 1.));
  #include <fog_fragment>
}`;function De(h=3,f=!1){const l=[],b=[],N=[],A=[0,1,0],C=[0,-1,0],L=[0,.18,.05],Y=[.95,.2,-.2],rt=[-.95,.2,-.2],B=(F,_,g,k,X=0,Tt=0,Q=0)=>{const W=[_[0]-F[0],_[1]-F[1],_[2]-F[2]],lt=[g[0]-F[0],g[1]-F[1],g[2]-F[2]];let I=[W[1]*lt[2]-W[2]*lt[1],W[2]*lt[0]-W[0]*lt[2],W[0]*lt[1]-W[1]*lt[0]];const te=Math.hypot(I[0],I[1],I[2])||1;I=I.map(Mt=>Mt/te),I[2]<0&&(I=I.map(Mt=>-Mt)),l.push(...F,..._,...g),b.push(...I,...I,...I),N.push(k,X,k,Tt,k,Q)};B(A,rt,L,0),B(rt,C,L,0),B(A,L,Y,0),B(L,C,Y,0),f?B([0,-.82,0],[-.27,-1.3,0],[.27,-1.3,0],1):B([0,-.84,0],[-.2,-1.2,0],[.2,-1.2,0],1);const ut=f?.085:.06;for(let F=0;F<h;F++){const _=F/h,g=(F+1)/h,k=ut-ut*.5*_,X=ut-ut*.5*g;B([-k,_,0],[k,_,0],[X,g,0],2,_,_,g),B([-k,_,0],[X,g,0],[-X,g,0],2,_,g,g)}const T=new v.InstancedBufferGeometry;return T.setAttribute("position",new v.Float32BufferAttribute(l,3)),T.setAttribute("aN",new v.Float32BufferAttribute(b,3)),T.setAttribute("aPT",new v.Float32BufferAttribute(N,2)),T}function $a(h){const f=[],l=[];for(let N=0;N<=h;N++)if(f.push(N/h,-1,0,N/h,1,0),N<h){const A=N*2;l.push(A,A+1,A+2,A+1,A+3,A+2)}const b=new v.InstancedBufferGeometry;return b.setAttribute("position",new v.Float32BufferAttribute(f,3)),b.setIndex(l),b}async function Za(h,f={}){const l=h.rng.fork?h.rng.fork("kite-sky"):h.rng,b=(f.palette&&f.palette.length>=7?f.palette:Ya).map(H),N=h.quality?.detail??1,A=new v.Group;A.name="thousand-kite-roofs-hero";const C=500,L=12,Y=l.int(1,9999),rt=(t,e)=>{const a=Math.floor(t/L),n=Math.floor(e/L);return{i:a,j:n,h:9+6*Ht(a,n,Y),cx:(a+.5)*L,cz:(n+.5)*L}},B=typeof f.roofY=="function"?f.roofY:(t,e)=>rt(t,e).h,ut=Ut(f.sunDir||[-.91,.37,-.16]).normalize(),T={uTime:{value:0},uCutAt:{value:0},uCutClock:{value:-1},uPx:{value:2/(1.73*1080)},uGust:{value:.3},uCam:{value:m(0,60,400)},uGrow:{value:220},uLamp:{value:f.lamp??0},uTanH:{value:.6},uSunDir:{value:ut},uSun:{value:H(f.sunColor||"#FFE9C4").multiplyScalar((f.sunIntensity??3.6)/Math.PI)},uSky:{value:H(f.skyColor||"#9CC4EE").multiplyScalar((f.hemiIntensity??1.9)/Math.PI)},uGnd:{value:H(f.groundColor||"#D9B48C").multiplyScalar((f.hemiIntensity??1.9)/Math.PI)}},F=(t,e,a={},n={})=>new v.ShaderMaterial({uniforms:{...v.UniformsUtils.clone(v.UniformsLib.fog),...T,...a},vertexShader:t,fragmentShader:e,fog:!0,side:v.DoubleSide,...n}),_=(f.ringTilt??35)*Math.PI/180,g=m(-20,f.ringY??96,-405),k=m(0,Math.sin(_),-Math.cos(_)),X=m(0,Math.cos(_),Math.sin(_)),Tt=m(1,0,0),Q=(t,e,a=0)=>g.clone().addScaledVector(Tt,t*Math.cos(e)).addScaledVector(X,t*Math.sin(e)).addScaledVector(k,a),W=10,lt=7.4,I=m(-20,B(-20,-170)+3.4,-170),te=Q(W,-Math.PI/2),Mt=I.z-te.z,Vt=.05,me=Math.tan(_),de=(me-Vt)/Math.max((te.y-I.y)/Mt-Vt,.05),ee=(t,e=m())=>e.set(-20,I.y+Vt*t*Mt+(me-Vt)*Mt*Math.pow(t,de)/de,I.z-t*Mt),Be=(t,e=m())=>e.set(0,Vt+(me-Vt)*Math.pow(t,de-1),-1).normalize(),Kt=[];for(let t=0;t<=32;t++)Kt.push(ee(t/32));const jt=[],Ve=g.clone().addScaledVector(k,-60);for(let t=0;t<=12;t++){const e=t/12*.8,a=ee(e),n=Be(e);a.y+=7*-n.z,a.z+=7*n.y,a.z>Ve.z+8&&jt.push(a)}jt.push(Ve,g.clone().addScaledVector(k,-30),g.clone(),g.clone().addScaledVector(k,30));const Ge=[[0,14.5,350],[0,14.5,290],[-4,30,262],[-12,52,236],[-24,78,198],[-30,91,170],[-31,90,125],[-29,90,80],[-27,72,42],[-25,48,5],[-22,26,-35],[-20,14.5,-70],[-20,13.5,-150]].map(Ut).concat(jt),Ot=t=>m(t.z,t.y,350-t.x),Ne=t=>m(350-t.z,t.y,t.x),We=f.pathFn?f.pathFn({flyThrough:jt,toLocal:Ot,toWorld:Ne}):f.path,ft=We?We.map(Ut).map(t=>f.pathSpace==="world"?Ot(t):t):Ge,et=H("#F59A12"),Ee=H("#8FD033"),qe=H("#17B3B9"),Rt=b[0].clone().multiplyScalar(.9),Ft=b[5],E=b[6],ka=H("#4A1F5C"),Sa=H("#2B2E7A"),Ue=[Ft,et,Ee,qe,Rt,E,b[1],b[3],ka,Sa],He=f.scheme||l.pick(["all","all","magenta-saffron","turquoise-white"]),pe=He==="magenta-saffron"?[7,6,1.2,1,2,2,1.5,.5,.3,.3]:He==="turquoise-white"?[1.2,1.5,1.5,7,6,1,.6,2,.3,.6]:[4,3.5,3,3,3,2.2,1,1,.4,.5],Ta=pe.reduce((t,e)=>t+e,0);let P=l;const Ke=()=>{let t=P()*Ta;for(let e=0;e<pe.length;e++)if(t-=pe[e],t<=0)return Ue[e];return Ue[0]},at=Math.max(f.minCount??2500,Math.round((f.count??l.int(4300,5200))*N)),je=Array.isArray(f.fixed)?f.fixed:[],Yt=Math.round((f.farKites??0)*Math.min(1,N+.2)),ae=Math.round((f.beyondKites??0)*N),Lt=at+Yt+ae+je.length,Oe=Math.round(at*.023),Re=Math.min(460,Math.max(300,Math.round(at*.095))),Ye=f.greatCut?Math.min(300,Math.round(at*.15)):0,ye=Math.min(f.heroEscorts??36,Math.round(at*.05)),$e=Math.min(f.pathEscorts??70,Math.round(at*.06)),Xe=Math.min(f.midKites??240,Math.round(at*.1)),Ze=Math.min(f.ringHalo??70,Math.round(at*.05)),Z=new Float32Array(Lt*3),K=new Float32Array(Lt*4),ot=new Float32Array(Lt*4),wt=new Float32Array(Lt*2),$t=new Float32Array(Lt*3),oe=new Float32Array(Lt*3),ne=new Float32Array(Lt),Fa=f.windLean??l.range(-.1,.1),La=l.range(.82,.98),Je=f.elevation??La;let zt=0;const ie=f.meanY??80,_a=[ft[0],g];let Xt=C+4,ge=C+4,se=null;const Qe=typeof f.anchorFix=="function"?f.anchorFix:null,At=(t,e,a,n,o,i,c,r=0)=>{const s=St(Je+P.gauss()*.14,Math.min(.6,Je-.08),1.25),u=Fa+P.gauss()*.16,d=(e-13)/Math.tan(s);let x=t-d*Math.sin(u),p=a+d*Math.cos(u);if(Math.abs(x)>Xt||p>C+4||p<-ge||se&&se(x,p))return!1;if(Qe){const R=Qe(x,p);x=R[0],p=R[1]}let w=B(x,p)+1.3;const y=P(),D=t-x,U=a-p;if(c===1){const R=3+1.8*y,st=4.5+3*y,Pt=(e-12)/R;w=B(t,a-st*Pt)+.2;for(let xt=0;xt<=Pt;xt+=2.5){const kt=e-R*xt,ct=a-st*xt;if(bt(t,kt,ct,ft)<16||Math.hypot(t-g.x,kt-g.y,ct-g.z)<45||bt(t,kt,ct,Kt)<12)return!1}}const V=e-w,M=Math.hypot(D,V,U);if(r){const R=Math.min(1,r/(M*Math.hypot(2.75*o,4.9*i)));o*=R,i*=R}const G=M*Math.hypot(2.75*o,4.9*i)+n*1.5;if(Math.hypot(t-g.x,e-g.y,a-g.z)<60+G||bt(t,e,a,_a)<22)return!1;if(c!==1)for(let R=1;R<=10;R++){const st=R/10,Pt=x+D*st,xt=w+V*st,kt=p+U*st,ct=G*st+.03*M*4*st*(1-st);if(bt(Pt,xt,kt,ft)<6.5+ct||Math.hypot(Pt-g.x,xt-g.y,kt-g.z)<26+ct||bt(Pt,xt,kt,Kt)<5+ct||xt<52&&Math.abs(kt+180)<6+ct&&(Math.abs(Pt+32)<6+ct||Math.abs(Pt+8)<6+ct))return!1}const z=zt++;Z[z*3]=x,Z[z*3+1]=w,Z[z*3+2]=p,K[z*4]=Math.atan2(D,-U),K[z*4+1]=Math.asin(St(V/M,-1,1)),K[z*4+2]=M,K[z*4+3]=n,ot[z*4]=P.range(0,6.283),ot[z*4+1]=P.range(.5,1.5),ot[z*4+2]=o,ot[z*4+3]=i,wt[z*2]=c,wt[z*2+1]=y;const $=Ke();let J=P.chance(.3)?Rt:Ke();return J===$&&(J=$===Rt?Ft:Rt),$t.set([$.r,$.g,$.b],z*3),oe.set([J.r,J.g,J.b],z*3),ne[z]=P.pick([0,0,1,1,2,3,3,4,4,5,6]),!0},ta=[],Ia=t=>{const e=V=>{const M=Ut(V);return f.pathSpace==="world"?Ot(M):M},a=e(t.a),n=e(t.k),o=t.size??2.2,i=n.x-a.x,c=n.y-a.y,r=n.z-a.z,s=Math.hypot(i,c,r);if(s<4||c/s<.16)return!1;let u=t.ampAz??.03,d=t.ampEl??.008;const x=Math.max(Math.min(bt(n.x,n.y,n.z,ft)-7-o*1.5,t.maxEnv??99),.4),p=Math.min(1,x/(s*Math.hypot(2.75*u,4.9*d)));u*=p,d*=p;const w=s*Math.hypot(2.75*u,4.9*d)+o*1.5;for(let V=1;V<=10;V++){const M=V/10,G=a.x+i*M,z=a.y+c*M,$=a.z+r*M,J=w*M+.03*s*4*M*(1-M);if(bt(G,z,$,ft)<6.5+J||Math.hypot(G-g.x,z-g.y,$-g.z)<26+J||bt(G,z,$,Kt)<5+J)return!1}const y=zt++;Z[y*3]=a.x,Z[y*3+1]=a.y,Z[y*3+2]=a.z,K[y*4]=Math.atan2(i,-r),K[y*4+1]=Math.asin(St(c/s,-1,1)),K[y*4+2]=s,K[y*4+3]=o,ot[y*4]=t.phase??y*2.399%6.283,ot[y*4+1]=t.speed??.9,ot[y*4+2]=u,ot[y*4+3]=d,wt[y*2]=0,wt[y*2+1]=t.hash??.2;const D=H(t.c1||"#F59A12"),U=H(t.c2||"#F6E9D2");return $t.set([D.r,D.g,D.b],y*3),oe.set([U.r,U.g,U.b],y*3),ne[y]=t.pat??6,!0};for(const t of je)ta.push(Ia(t));const Ct=[],ht=[];let Zt=0;for(let t=0;t<ft.length-1;t++){const e=ft[t],a=ft[t+1],n=e.distanceTo(a);for(let o=Zt;o<n;o+=3){const i=e.clone().lerp(a,o/n),c={p:i,t:a.clone().sub(e).normalize()};i.y>36&&i.distanceTo(g)>110&&i.z>-150&&Ct.push(c),i.distanceTo(g)>34&&ht.push(c)}Zt=(Zt-n)%3,Zt<0&&(Zt+=3)}const S=m(),j=m();for(let t=0;ht.length&&t<$e;t++){for(let e=0;e<14;e++){const a=ht[Math.min(ht.length-1,Math.floor((t+l())/$e*ht.length))],n=l.range(1.8,2.6)*(a.p.z<-185?f.finaleScale??1:1),o=l.chance(.5)?1:-1;S.crossVectors(a.t,m(0,1,0)).normalize(),j.crossVectors(S,a.t);let i,c,r,s;if(a.p.y<30){const u=o*l.range(7.5,17),d=l.range(10,25);s=Math.hypot(u,d),i=a.p.x+S.x*u,c=a.p.y+d,r=a.p.z+S.z*u}else{s=l.range(12,19)+e*.5;const u=l.range(-.3,1.15),d=Math.max(Math.cos(u),7.5/s)*o,x=Math.sin(u);i=a.p.x+s*(d*S.x+x*j.x),c=a.p.y+s*(d*S.y+x*j.y),r=a.p.z+s*(d*S.z+x*j.z)}if(!(c<23)&&At(i,c,r,n,l.range(.03,.06),l.range(.008,.016),0,Math.max(s-7-n*1.5,.6)))break}(t&7)===7&&await h.yield?.()}for(let t=0;ht.length&&t<Xe;t++){for(let e=0;e<8;e++){const a=ht[Math.min(ht.length-1,Math.floor((t+l())/Xe*ht.length))],n=l.range(1.3,1.9),o=25+55*Math.pow(l(),1.4),i=l.range(-.35,Math.PI+.35);S.crossVectors(a.t,m(0,1,0)).normalize(),j.crossVectors(S,a.t);const c=a.p.x+o*(Math.cos(i)*S.x+Math.sin(i)*j.x)+a.t.x*l.range(-3,3),r=a.p.y+o*(Math.cos(i)*S.y+Math.sin(i)*j.y*.8),s=a.p.z+o*(Math.cos(i)*S.z+Math.sin(i)*j.z)+a.t.z*l.range(-3,3);if(!(r<27)&&At(c,r,s,n,l.range(.025,.07),l.range(.008,.02),0,Math.max(o-8-n*1.5,1)))break}(t&15)===15&&await h.yield?.()}for(let t=0,e=0;t<Ze&&e<Ze*14;e++){const a=l.range(-.5,Math.PI+.5),n=l.range(-25,200),o=l.range(64,125)+Math.max(n-85,0)*.25,i=l.range(1.5,2.4)*(1+Math.max(n-60,0)/200),c=g.x+Tt.x*Math.cos(a)*o+k.x*n,r=g.y+X.y*Math.sin(a)*o*.8+k.y*n*.6,s=g.z+X.z*Math.sin(a)*o+k.z*n;r<40||r>215||At(c,r,s,i,l.range(.02,.05),l.range(.006,.014),0,9)&&t++}const Gt=zt;await h.yield?.();for(let t=0,e=0;Ct.length&&t<Re&&e<Re*12;e++){(e&31)===31&&await h.yield?.();const a=l.pick(Ct),n=l.range(0,6.283),o=8.8+31*Math.pow(l(),1.3),i=l.range(.75,.98);S.crossVectors(a.t,m(0,1,0)).normalize(),j.crossVectors(S,a.t);const c=a.p.x+o*(Math.cos(n)*S.x+Math.sin(n)*j.x)+a.t.x*l.range(-2,2),r=a.p.y+o*(Math.cos(n)*S.y+Math.sin(n)*j.y*.8),s=a.p.z+o*(Math.cos(n)*S.z+Math.sin(n)*j.z)+a.t.z*l.range(-2,2);r<30||At(c,r,s,i,l.range(.02,.05),l.range(.005,.012),0,Math.max(o-6.8-i*1.5,.3))&&t++}const re=Ct.filter(t=>t.p.z>60);for(let t=0,e=0;re.length&&t<ye&&e<ye*40;e++){const a=re[Math.floor((t+l())/ye*re.length)%re.length],n=l.range(1.3,1.7),o=l.range(10.6,15),i=l.range(-1,.3),c=l.chance(.5)?i:Math.PI-i;S.crossVectors(a.t,m(0,1,0)).normalize(),j.crossVectors(S,a.t);const r=a.p.x+o*(Math.cos(c)*S.x+Math.sin(c)*j.x),s=a.p.y+o*(Math.cos(c)*S.y+Math.sin(c)*j.y),u=a.p.z+o*(Math.cos(c)*S.z+Math.sin(c)*j.z);s<30||At(r,s,u,n,l.range(.02,.04),l.range(.005,.01),0,Math.max(o-6.9-n*1.5,.5))&&t++}const ea=zt;await h.yield?.();for(let t=0;zt<at&&t<at*8;t++){const e=at-zt,a=e<=Oe?1:e<=Oe+Ye?2:0,n=l.range(-C,C),o=l.range(-C-50,C-30),i=St(ie+l.gauss()*26*ie/80,30,150),c=l.chance(.12);At(n,i,o,c?l.range(1.25,1.7):l.range(.8,1.15),l.range(.018,.085),l.range(.006,.028),a),(t&255)===255&&await h.yield?.()}const aa=zt;if(Yt||ae){P=Oa(Ra("kite-sky-more:"+Y));for(let a=0,n=0;Ct.length&&a<Yt&&n<Yt*14;n++){(n&15)===15&&await h.yield?.();const o=Ct[Math.floor((a+P())/Yt*Ct.length)%Ct.length],i=P.range(70,250),c=P.range(-.25,Math.PI+.25),r=P.range(2.8,4.6),s=P.range(-40,130);S.crossVectors(o.t,m(0,1,0)).normalize();const u=o.p.x+i*Math.cos(c)*S.x+o.t.x*s,d=o.p.z+i*Math.cos(c)*S.z+o.t.z*s,x=St(o.p.y*.6+30+i*Math.sin(c)*.45+P.range(-10,25),42,175);bt(u,x,d,ft)<58||At(u,x,d,r,P.range(.012,.03),P.range(.004,.01),0)&&a++}await h.yield?.();const t=f.beyond||{},e=t.reach??C+400;Xt=t.halfX??C+150,ge=e,se=t.noAnchor||null;for(let a=0,n=0;a<ae&&n<ae*10;n++){(n&31)===31&&await h.yield?.();const o=P.range(-Xt,Xt),i=-P.range(C+10,e-20),c=St(ie+P.gauss()*26*ie/80,30,150),r=P.chance(.3);At(o,c,i,r?P.range(2.2,4.2):P.range(.9,1.5),P.range(.018,.07),P.range(.006,.022),0)&&a++}Xt=ge=C+4,se=null,P=l}const Nt=zt;let oa=0;if(Array.isArray(f.clearLanes)&&f.clearLanes.length){const t=f.clearLanes.map(e=>{const a=n=>{const o=Ut(n);return f.pathSpace==="world"?Ot(o):o};return{a:a(e.a),b:a(e.b),r0:e.r0??12,r1:e.r1??e.r0??12}});for(let e=ea;e<Nt;e++){(e&1023)===1023&&await h.yield?.();const a=K[e*4],n=K[e*4+1],o=K[e*4+2],i=Math.cos(n),c=Z[e*3]+o*Math.sin(a)*i,r=Z[e*3+1]+o*Math.sin(n),s=Z[e*3+2]-o*Math.cos(a)*i;for(const u of t){const d=u.b.x-u.a.x,x=u.b.y-u.a.y,p=u.b.z-u.a.z,w=St(((c-u.a.x)*d+(r-u.a.y)*x+(s-u.a.z)*p)/(d*d+x*x+p*p||1e-6),0,1);if(Math.hypot(u.a.x+d*w-c,u.a.y+x*w-r,u.a.z+p*w-s)<ve(u.r0,u.r1,w)){K[e*4+3]=0,oa++;break}}}}const q=(t,e)=>new v.InstancedBufferAttribute(t,e),na={iA:q(Z,3),iL:q(K,4),iP:q(ot,4),iM:q(wt,2),iC1:q($t,3)},ia=F(za,Aa),vt=De();vt.instanceCount=Nt-Gt;const _t=(t,e)=>q(t.subarray(Gt*e,Nt*e),e),It=(t,e)=>q(t.subarray(0,Math.max(Gt,1)*e),e);vt.setAttribute("iA",_t(Z,3)),vt.setAttribute("iL",_t(K,4)),vt.setAttribute("iP",_t(ot,4)),vt.setAttribute("iM",_t(wt,2)),vt.setAttribute("iC1",_t($t,3)),vt.setAttribute("iC2",_t(oe,3)),vt.setAttribute("iPat",_t(ne,1));const xe=new v.Mesh(vt,ia);xe.frustumCulled=!1,xe.name="kites",A.add(xe),await h.yield?.();const mt=De(6,!0);mt.instanceCount=Gt,mt.setAttribute("iA",It(Z,3)),mt.setAttribute("iL",It(K,4)),mt.setAttribute("iP",It(ot,4)),mt.setAttribute("iM",It(wt,2)),mt.setAttribute("iC1",It($t,3)),mt.setAttribute("iC2",It(oe,3)),mt.setAttribute("iPat",It(ne,1));const le=new v.Mesh(mt,ia);le.frustumCulled=!1,le.name="great-kites",le.visible=Gt>0,A.add(le);let Dt=aa;for(;Dt>0&&wt[(Dt-1)*2]===1;)Dt--;const be=$a(3);be.instanceCount=Nt>aa?Nt:Dt;for(const t in na)be.setAttribute(t,na[t]);const ce=new v.Mesh(be,F(Ca(!1),Pa,{uLineW:{value:.03},uAFloor:{value:f.lineOpacity??.45},uBigA:{value:f.bigLineOpacity??.6}},{transparent:!0,depthWrite:!1}));ce.frustumCulled=!1,ce.renderOrder=3,ce.name="kite-lines",A.add(ce),await h.yield?.();const nt=300,sa=new Float32Array(nt*3),ra=new Float32Array(nt*4),la=new Float32Array(nt*4),ca=new Float32Array(nt*2),ua=new Float32Array(nt*3),Me=new Float32Array(nt*3),fa=new Float32Array(nt),dt=m(),ue=new v.Color,we=E.clone().lerp(et,.8),Da=H("#9E0F22"),Ba=H("#F2501E"),ze=b[0].clone().multiplyScalar(.9);for(let t=0;t<nt;t++){const e=.012+.976*t/(nt-1);ee(e,dt),sa.set([dt.x,dt.y,dt.z],t*3),Be(e,dt),ra.set([dt.x,dt.y,dt.z,0],t*4),la.set([e,.62+.1*l(),0,0],t*4),ca.set([0,l()],t*2);const a=l.range(.7,1.15),n=l();ue.copy(E).lerp(n<.5?Da:Ba,Math.abs(n-.5)*1.1).multiplyScalar(a),ua.set([ue.r,ue.g,ue.b],t*3),t%5===2?Me.set([ze.r,ze.g,ze.b],t*3):Me.set([we.r*a,we.g*a,we.b*a],t*3),fa[t]=t%25===12?6:0}const pt=De();pt.instanceCount=nt,pt.setAttribute("iA",q(sa,3)),pt.setAttribute("iL",q(ra,4)),pt.setAttribute("iP",q(la,4)),pt.setAttribute("iM",q(ca,2)),pt.setAttribute("iC1",q(ua,3)),pt.setAttribute("iC2",q(Me,3)),pt.setAttribute("iPat",q(fa,1));const Ae=new v.Mesh(pt,F(za,Aa,{},{defines:{TRAIN:1}}));Ae.frustumCulled=!1,Ae.name="red-train",A.add(Ae),await h.yield?.();const it={pos:[],tan:[],sw:[],col:[],idx:[]},ha=(t,e,a)=>{const n=it.pos.length/3,o=t.length;for(let i=0;i<o;i++){const c=t[i],r=dt.subVectors(t[Math.min(i+1,o-1)],t[Math.max(i-1,0)]).normalize();for(const s of[-1,1])it.pos.push(c.x,c.y,c.z),it.tan.push(r.x,r.y,r.z),it.sw.push(s,i/(o-1),e),it.col.push(a.r,a.g,a.b);if(i<o-1){const s=n+i*2;it.idx.push(s,s+1,s+2,s+1,s+3,s+2)}}},va=[];for(let t=0;t<=120;t++)va.push(ee(t/120));ha(va,0,b[1].clone().lerp(E,.35));const Ce=[],ma=[];for(let t=0;t<12;t++){const e=t<6?1:-1,a=t%6,n=e*(22+18*a+l.range(-4,4))*Math.PI/180,o=l.range(150,250)-a*8,i=rt(g.x+o*Math.sin(n),g.z+o*Math.cos(n)),c=f.roofY?g.x+o*Math.sin(n):i.cx,r=f.roofY?g.z+o*Math.cos(n):i.cz,s=m(c,B(c,r)+2.7,r);Ce.push(s);const u=ve(-.9,1,a/5),d=Q(W,e>0?u:Math.PI-u),x=d.distanceTo(s),p=[];for(let w=0;w<=28;w++){const y=w/28,D=d.clone().lerp(s,y);D.y-=.035*x*4*y*(1-y)*(.6+.4*y),p.push(D)}ma.push(p),ha(p,1+t*.37,Rt)}const Wt=new v.BufferGeometry;Wt.setAttribute("position",new v.Float32BufferAttribute(it.pos,3)),Wt.setAttribute("aTan",new v.Float32BufferAttribute(it.tan,3)),Wt.setAttribute("aSW",new v.Float32BufferAttribute(it.sw,3)),Wt.setAttribute("aCol",new v.Float32BufferAttribute(it.col,3)),Wt.setIndex(it.idx);const fe=new v.Mesh(Wt,F(Ca(!0),Pa,{uLineW:{value:.16},uAFloor:{value:1.3},uBigA:{value:0}},{defines:{STATIC_LINE:1},transparent:!0,depthWrite:!1}));fe.frustumCulled=!1,fe.renderOrder=4,fe.name="stays",A.add(fe),await h.yield?.();const yt={pos:[],nor:[],col:[],idx:[]},da=(t,e,a,n,o)=>{const i=yt.pos.length/3,c=t.length;for(let r=0;r<c;r++){const s=t[r],u=a(r),d=n(r);for(let x=0;x<e;x++){const p=x/e*6.2832,w=Math.cos(p),y=Math.sin(p),D=s.a.x*w+s.b.x*y,U=s.a.y*w+s.b.y*y,V=s.a.z*w+s.b.z*y,M=.85+.15*w;yt.pos.push(s.p.x+D*u,s.p.y+U*u,s.p.z+V*u),yt.nor.push(D,U,V),yt.col.push(d.r*M,d.g*M,d.b*M)}}for(let r=0;r<(o?c:c-1);r++)for(let s=0;s<e;s++){const u=(r+1)%c,d=(s+1)%e,x=i+r*e+s,p=i+u*e+s,w=i+u*e+d,y=i+r*e+d;yt.idx.push(x,p,w,x,w,y)}},Jt=(t,e,a,n,o,i,c=i,r=2)=>{const s=m().subVectors(e,t).normalize(),u=m().crossVectors(s,Math.abs(s.y)>.9?m(1,0,0):m(0,1,0)).normalize(),d=m().crossVectors(s,u),x=[];for(let p=0;p<r;p++)x.push({p:t.clone().lerp(e,p/(r-1)),a:u,b:d});da(x,o,p=>ve(a,n,p/(r-1))*(r>2&&p%2?1.12:1),p=>p%2?c:i,!1)},Pe=H("#C9A55C"),he=H("#7A5A2C"),Va=E.clone().multiplyScalar(.8),Ga=new v.Color,ke=(t,e,a,n,o)=>{const i=[];for(let r=0;r<e;r++){const s=r/e*6.2832;i.push({p:Q(t,s,o),a:m().addScaledVector(Tt,Math.cos(s)).addScaledVector(X,Math.sin(s)),b:k})}const c=i.map(()=>l());da(i,a,r=>n*(r%6===0?1.3:r%6===3?.92:1),r=>r%12===0?Va:Ga.copy(r%6===0?he:Pe).multiplyScalar(.8+.3*c[r-r%6]).clone(),!0)};ke(W,120,7,.2,0),ke(W-.32,120,5,.12,.26),ke(lt,96,6,.13,0);for(let t=0;t<24;t++){const e=(t+.5)/24*6.2832;Jt(Q(lt,e),Q(W,e),.07,.055,5,Pe,he,4)}const pa=(t,e,a,n,o)=>{const i=t.y-(t===I?3.4:2.7),c=t===I?4:3,r=l.range(0,6.28);for(let u=0;u<c;u++){const d=r+u/c*6.2832;Jt(m(t.x+Math.cos(d)*e,i,t.z+Math.sin(d)*e),m(t.x-Math.cos(d)*.12,t.y+.35,t.z-Math.sin(d)*.12),a,a*.8,5,he,Pe,4)}const s=m(t.x,i+n+.25,t.z);Jt(m(s.x-n*.9,s.y,s.z),m(s.x+n*.9,s.y,s.z),n,n,9,o,o.clone().multiplyScalar(.7),5),Jt(m(s.x-n*1.5,s.y,s.z),m(s.x+n*1.5,s.y,s.z),.06,.06,5,he),Jt(s,t,.03,.03,4,o)};pa(I,1.5,.11,.75,E);for(const t of Ce)pa(t,1,.07,.38,l.pick([Ft,et,b[1]]));await h.yield?.();const Qt=new v.BufferGeometry;Qt.setAttribute("position",new v.Float32BufferAttribute(yt.pos,3)),Qt.setAttribute("normal",new v.Float32BufferAttribute(yt.nor,3)),Qt.setAttribute("color",new v.Float32BufferAttribute(yt.col,3)),Qt.setIndex(yt.idx);const Se=new v.Mesh(Qt,new v.MeshStandardMaterial({vertexColors:!0,roughness:.75,metalness:0,side:v.DoubleSide}));Se.frustumCulled=!1,Se.name="bamboo",A.add(Se),await h.yield?.();const O={pos:[],ax:[],fl:[],col:[],uv:[],idx:[]},gt=(t,e,a,n,o,i,c,r)=>(O.pos.push(t.x,t.y,t.z),O.ax.push(e.x,e.y,e.z),O.fl.push(a,n,o),O.col.push(i.r,i.g,i.b),O.uv.push(c,r),O.pos.length/3-1),Et=b[0].clone().multiplyScalar(.92),ya=l.pick([[E,et,E,Ft],[E,et,E,Et],[E,Ft,et,Et]]);for(let t=0;t<24;t++){const e=ya[t%ya.length],a=l.range(0,6.28),n=[];for(let o=0;o<=3;o++)for(let i=0;i<=3;i++){const c=(t-.5+i/3)/24*6.2832,r=ve(lt+.1,W-.15,o/3);n.push(gt(Q(r,c),k,Math.sin(Math.PI*i/3)*Math.sin(Math.PI*o/3),a,-1,e,i/3,o/3))}for(let o=0;o<3;o++)for(let i=0;i<3;i++){const c=n[o*4+i],r=n[o*4+i+1],s=n[o*4+i+5],u=n[o*4+i+4];O.idx.push(c,r,s,c,s,u)}}const Na=m(0,-.28,-1).normalize(),Wa=[E,et,E,et,Ft,E,et,Et];for(let t=0;t<48;t++){const e=(t+.25)/48*6.2832,a=Q(W+.15,e),n=.5+.5*Math.sin(e),o=l.range(3.6,6.4)*(1-.25*n),i=l.range(.55,.85),c=l.range(0,6.28),r=Wa[t%8],s=m().addScaledVector(Tt,-Math.sin(e)).addScaledVector(X,Math.cos(e)),u=Na.clone().addScaledVector(Tt,.55*Math.cos(e)).addScaledVector(X,.55*Math.sin(e)).normalize(),d=s.addScaledVector(u,-s.dot(u)).normalize(),x=m().crossVectors(u,d).normalize();let p=null;for(let w=0;w<=6;w++){const y=w/6,D=i*.5*(1-y*.92),U=a.clone().addScaledVector(u,y*o),V=gt(U.clone().addScaledVector(d,-D),x,y,c,o,r,0,y),M=gt(U.clone().addScaledVector(d,D),x,y,c,o,r,1,y);p&&O.idx.push(p[0],p[1],M,p[0],M,V),p=[V,M]}}for(let t=0;t<96;t++){const e=t/96*6.2832,a=(t+1)/96*6.2832,n=(e+a)/2,o=[et,E,Et,E][t%4],i=t*.7,c=Q(W+1.25,n,-.35);O.idx.push(gt(Q(W+.1,e),k,0,i,1.6,o,0,0),gt(Q(W+.1,a),k,0,i,1.6,o,1,0),gt(c,k,1,i,1.6,o,.5,.3))}const Ea=[E,et,Et,Ft,Ee,qe];ma.forEach((t,e)=>{const a=m().subVectors(t[4],t[0]).normalize(),n=m().crossVectors(a,m(0,1,0)).normalize(),o=t[0].distanceTo(t[28]);for(let i=3,c=0;i<42;i+=1.7,c++){const r=i/o*28,s=Math.floor(r),u=t[s].clone().lerp(t[s+1],r-s),d=u.clone().addScaledVector(a,.95),x=e*1.3+c*.9,p=Ea[(c+e)%6],w=u.clone().lerp(d,.5);w.y-=1.15,O.idx.push(gt(u,n,0,x,1.2,p,0,0),gt(d,n,0,x,1.2,p,1,0),gt(w,n,1,x,1.2,p,.5,1))}});const Bt=new v.BufferGeometry;Bt.setAttribute("position",new v.Float32BufferAttribute(O.pos,3)),Bt.setAttribute("aAx",new v.Float32BufferAttribute(O.ax,3)),Bt.setAttribute("aFl",new v.Float32BufferAttribute(O.fl,3)),Bt.setAttribute("aCol",new v.Float32BufferAttribute(O.col,3)),Bt.setAttribute("aUv",new v.Float32BufferAttribute(O.uv,2)),Bt.setIndex(O.idx);const Te=new v.Mesh(Bt,F(`
#include <common>
#include <fog_pars_vertex>
uniform float uTime, uGust;
attribute vec3 aAx; attribute vec3 aFl; attribute vec3 aCol; attribute vec2 aUv;
varying vec3 vP; varying vec3 vCol; varying vec3 vAx; varying vec3 vUv;
void main(){
  float fl = aFl.x, ph = aFl.y; vec3 lp = position;
  if (aFl.z < 0.) lp += aAx*fl*(.42 + .18*sin(uTime*1.3 + ph) + .06*sin(uTime*7.3 + ph*3. + aUv.x*9.));
  else {
    float w = sin(uTime*(5. + 2.*uGust) - fl*6. + ph)*.5 + sin(uTime*9.7 - fl*11. + ph*1.7)*.25;
    lp += aAx*w*fl*(.45 + .6*uGust)*min(aFl.z*.3, 1.3) + vec3(0., -1., 0.)*fl*fl*aFl.z*.4*(1. - uGust);
  }
  vP = lp; vCol = aCol; vAx = aAx; vUv = vec3(aUv, aFl.z);
  vec4 mvPosition = modelViewMatrix*vec4(lp, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
#ifdef USE_FOG
  vFogDepth *= .45;                       // the ring's paper stays red and saffron at 700 m
#endif
}`,`
#include <common>
#include <fog_pars_fragment>
${Ie}
uniform vec3 uCam, uCream;
varying vec3 vP; varying vec3 vCol; varying vec3 vAx; varying vec3 vUv;
void main(){
  vec3 N = normalize(cross(dFdx(vP), dFdy(vP)) + vAx*1e-5);
  vec3 base = vCol;
  if (vUv.z < 0.) {
    vec2 dq = abs(vUv.xy - .5)*vec2(1., 1.15);
    float d = dq.x + dq.y;
    base = mix(base, uCream, (1. - smoothstep(.27, .3, d))*.92);
    base = mix(base, vCol, 1. - smoothstep(.1, .13, d));
    base = mix(base, vCol*.5, 1. - smoothstep(.0, .03, abs(d - .39) - .012));
    float e = min(min(vUv.x, 1. - vUv.x), min(vUv.y, 1. - vUv.y));
    base = mix(uCream*.9, base, smoothstep(.035, .06, e));
  } else base *= .82 + .18*step(.5, fract(vUv.y*2.5 + .25));
  vec3 c = paper(base, N, normalize(uCam - vP), 0.)*1.4;
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`,{uCream:{value:Et}}));Te.frustumCulled=!1,Te.name="ring-paper",A.add(Te),await h.yield?.();const ga=f.stage!==!1,tt=m(-20,-270,300);if(ga){const t=`
${Ie}
uniform float uTime, uTint;
float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)))*43758.5453); }
vec3 roofShade(vec2 m, vec2 dm, vec3 wall, float seed, vec2 wxz){
  float edge = min(min(m.x, dm.x - m.x), min(m.y, dm.y - m.y));
  vec3 roof = mix(vec3(.6, .55, .5), wall, uTint)*(.84 + .22*h1(floor(wxz*.7) + seed));
  vec2 sn = normalize(uSunDir.xz + vec2(1e-4, 0.));
  float cot = length(uSunDir.xz)/max(uSunDir.y, .08);
  float tx = (sn.x < 0. ? m.x : dm.x - m.x)/max(abs(sn.x), 1e-3);
  float tz = (sn.y < 0. ? m.y : dm.y - m.y)/max(abs(sn.y), 1e-3);
  float lit = smoothstep(cot*.95, cot*1.05, min(tx, tz));
  vec2 sc = dm*(.28 + .44*vec2(h1(vec2(seed, 1.3)), h1(vec2(seed, 7.7))));
  vec2 q = m - sc;
  float shed = step(max(abs(q.x), abs(q.y)), 1.3);
  vec2 q1 = q + sn*cot*.9, q2 = q + sn*cot*1.8, q3 = q + sn*cot*2.6;
  float ss = max(step(max(abs(q1.x), abs(q1.y)), 1.3), max(step(max(abs(q2.x), abs(q2.y)), 1.3), step(max(abs(q3.x), abs(q3.y)), 1.3)));
  lit *= 1. - ss*(1. - shed);
  vec2 g = (wxz + vec2(uTime*1.1, -uTime*.6))/6.5; vec2 cid = floor(g);
  vec2 f = fract(g) - .5 - (vec2(h1(cid), h1(cid + 3.1)) - .5)*.5;
  lit *= 1. - .6*step(.6, h1(cid + 9.7))*(1. - smoothstep(.1, .15, abs(f.x) + abs(f.y)));
  float par = 1. - smoothstep(.32, .4, edge);
  vec3 alb = mix(mix(roof, mix(wall, vec3(.74, .7, .66), .3), shed), wall, par);
  lit = mix(lit, 1., max(par, shed));
  return alb*(uSky*1.05 + uSun*(max(uSunDir.y, 0.)*1.5 + .22*max(par, shed))*lit);
}`,e=[],a=[],n=(M,G,z,$,J)=>{for(const R of[M,G,z,M,z,$])e.push(...R),a.push(...J)},o=(M,G,z)=>[M,G,z];n(o(-.5,1,-.5),o(-.5,1,.5),o(.5,1,.5),o(.5,1,-.5),[0,1,0]),n(o(-.5,0,.5),o(.5,0,.5),o(.5,1,.5),o(-.5,1,.5),[0,0,1]),n(o(.5,0,-.5),o(-.5,0,-.5),o(-.5,1,-.5),o(.5,1,-.5),[0,0,-1]),n(o(.5,0,.5),o(.5,0,-.5),o(.5,1,-.5),o(.5,1,.5),[1,0,0]),n(o(-.5,0,-.5),o(-.5,0,.5),o(-.5,1,.5),o(-.5,1,-.5),[-1,0,0]);const i=[],c=[],r=[],s=[b[0],b[1],b[2],b[3],b[0],H("#f2efe8"),b[1],b[3],b[0],b[2],H("#f2efe8"),b[4]],u=new v.Color,d=Math.floor((tt.x-tt.z)/L),x=Math.ceil((tt.x+tt.z)/L),p=Math.floor((tt.y-tt.z)/L),w=Math.ceil((tt.y+tt.z)/L);for(let M=d;M<=x;M++)for(let G=p;G<=w;G++){const z=(M+.5)*L,$=(G+.5)*L;if(Math.hypot(z-tt.x,$-tt.y)>=tt.z)continue;const J=(M%14+14)%14===6?5:0,R=2.5+1.5*Ht(M,G,Y+7)+J,st=2.5+1.5*Ht(M,G,Y+11);i.push(z,B(z,$),$,Ht(M,G,Y+3)*97),c.push(L-R,L-st,0),u.copy(s[Math.floor(Ht(M,G,Y+5)*s.length)]).multiplyScalar(.7+.16*Ht(M,G,Y+9)),r.push(u.r,u.g,u.b)}const y=new v.InstancedBufferGeometry;y.instanceCount=i.length/4,y.setAttribute("position",new v.Float32BufferAttribute(e,3)),y.setAttribute("normal",new v.Float32BufferAttribute(a,3)),y.setAttribute("iB",q(new Float32Array(i),4)),y.setAttribute("iD",q(new Float32Array(c),3)),y.setAttribute("iCol",q(new Float32Array(r),3));const D=new v.Mesh(y,F(`
#include <common>
#include <fog_pars_vertex>
attribute vec4 iB; attribute vec3 iD; attribute vec3 iCol;
varying vec3 vN; varying vec3 vP; varying vec3 vCol; varying vec4 vM; varying vec3 vDim;
void main(){
  vec3 lp = vec3(iB.x + position.x*iD.x, position.y*iB.y, iB.z + position.z*iD.y);
  vN = normal; vP = lp; vCol = iCol; vDim = vec3(iD.xy, iB.w);
  vM = vec4((position.xz + .5)*iD.xy, abs(normal.x) > .5 ? position.z*iD.y : position.x*iD.x, iB.y - lp.y);
  vec4 mvPosition = modelViewMatrix*vec4(lp, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,`
#include <common>
#include <fog_pars_fragment>
${t}
varying vec3 vN; varying vec3 vP; varying vec3 vCol; varying vec4 vM; varying vec3 vDim;
void main(){
  vec3 c;
  if (vN.y > .5) c = roofShade(vM.xy, vDim.xy, vCol, vDim.z, vP.xz);
  else {
    float top = vM.w, y = vP.y;
    vec3 alb = vCol*(.74 + .26*h1(floor(vec2(vM.z*.9, y*.45)) + vDim.z))*(.72 + .28*smoothstep(0., 2.2, top))*(.7 + .3*smoothstep(0., 4., y));
    alb = mix(alb, vCol*1.05, 1. - smoothstep(.9, 1.05, top));
    vec2 wq = vec2(vM.z/2.4 + .5, y/3.1); vec2 wf = fract(wq) - .5; vec2 wi = floor(wq);
    float win = step(abs(wf.x), .2)*step(abs(wf.y), .26)*step(.3, h1(wi + vDim.z))*step(1.6, top)*step(1., y);
    vec3 shut = mix(vec3(.07, .06, .08), mix(vec3(.1, .3, .34), vec3(.36, .2, .1), h1(wi*1.7 + vDim.z)), step(.55, h1(wi + 4.4)));
    alb = mix(alb, shut, win);
    c = alb*(mix(uGnd, uSky, .5)*1.05 + uSun*max(dot(normalize(vN), uSunDir), 0.)*.9);
  }
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`,{uTint:{value:.28}},{side:v.FrontSide}));D.frustumCulled=!1,D.name="stage-roofs",A.add(D);const U=new v.PlaneGeometry(3200,3200);U.rotateX(-Math.PI/2),U.translate(0,8.9,0);const V=new v.Mesh(U,F(`
#include <common>
#include <fog_pars_vertex>
varying vec3 vP;
void main(){
  vP = position;
  vec4 mvPosition = modelViewMatrix*vec4(position, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,`
#include <common>
#include <fog_pars_fragment>
${t}
uniform vec3 uCam, uBoxC; uniform vec3 uW0, uW1, uW2, uW3;
varying vec3 vP;
void main(){
  vec2 p = vP.xz; vec2 cid = floor(p/12.); vec2 m0 = p - cid*12.;
  float street = 1. - step(.5, abs(mod(cid.x, 14.) - 6.));
  vec2 lane = vec2(2.5 + 1.5*h1(cid + 5.5) + 5.*street, 2.5 + 1.5*h1(cid + 8.5));
  vec2 m = m0 - lane*.5, dm = vec2(12.) - lane;
  float inside = step(0., min(min(m.x, dm.x - m.x), min(m.y, dm.y - m.y)));
  inside *= step(uBoxC.z, distance((cid + .5)*12., uBoxC.xy));
  float r = h1(cid + 1.7);
  vec3 wall = (r < .32 ? uW0 : (r < .54 ? uW1 : (r < .72 ? uW2 : (r < .9 ? uW3 : vec3(.85, .83, .8)))))*(.72 + .16*h1(cid + 2.9));
  vec3 laneCol = vec3(.055, .055, .08) + uGnd*.06;
  vec3 c = mix(laneCol, roofShade(m, dm, wall, h1(cid)*97., p), inside);
  float far = smoothstep(450., 1500., distance(vP, uCam));
  c = mix(c, vec3(.47, .42, .42)*(uSky + uSun*.5)*1.3, far);
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`,{uTint:{value:.66},uBoxC:{value:tt},uW0:{value:b[0]},uW1:{value:b[1]},uW2:{value:b[2]},uW3:{value:b[3]}},{side:v.FrontSide}));V.frustumCulled=!1,V.name="stage-mosaic",A.add(V)}const qa=Z.slice(0,Dt*3),Ua={portalSeat:{position:g.clone(),normal:k.clone(),up:X.clone(),radius:7,tiltDeg:f.ringTilt??35},ringCenter:g.clone(),ringNormal:k.clone(),flyThrough:jt,trainCurve:Kt,trainAnchor:I.clone(),ringLineAnchors:Ce,kiteAnchors:qa,pathDefault:Ge,minarets:[m(-32,0,-180),m(-8,0,-180)],launch:m(0,12,350),viewpoints:{entry:m(0,14.5,350),duel:m(-30,90,100),skim:m(-20,14.5,-120),finale:m(-20,58,-325)},field:{halfX:C,halfZ:C,minY:30,maxY:150},sunDir:ut.clone(),placement:{position:m(350,0,0),rotationY:-Math.PI/2},toWorld:Ne,toLocal:Ot,counts:{kites:Nt,lines:Dt,escorts:ea,great:Gt,train:nt,cleared:oa},fixedPlaced:ta,kiteLines:K.slice(0,Dt*4)},Ha=m(),Ka=new v.Vector2,xa=f.cutU??.328;let Fe=.3,qt=-1,Le=0,ba=0,_e=!0;return{object:A,radius:130,height:150,center:m(-20,62,-300),anchors:Ua,uniforms:T,ground:!ga,groundY:0,update(t,e,a){if(Le=e,T.uTime.value=e,_e?(T.uGust.value=Fe,_e=!1):t>0&&(T.uGust.value+=(Fe-T.uGust.value)*Math.min(1,t*1.5)),T.uCutClock.value=qt>=0?Math.max(0,e-qt):-1,a){A.updateWorldMatrix(!0,!1),T.uCam.value.copy(A.worldToLocal(Ha.setFromMatrixPosition(a.matrixWorld)));let n=1080;h.renderer?.getDrawingBufferSize&&(n=h.renderer.getDrawingBufferSize(Ka).y||1080),T.uPx.value=2/(Math.max(a.projectionMatrix.elements[5],.05)*n),T.uTanH.value=1/Math.max(a.projectionMatrix.elements[5],.05)}},setProgress(t){Fe=.3+.7*ja(.74,.8,t),Math.abs(t-ba)>.1&&(_e=!0),ba=t,Ye&&(t>=xa&&qt<0?(qt=Le,T.uCutAt.value=Le):t<xa-.02&&qt>=0&&(qt=-1))},setSun(t,e,a=3.6){t&&T.uSunDir.value.copy(Ut(t)).normalize(),e&&T.uSun.value.set(e).multiplyScalar(a/Math.PI)},setAmbient(t,e,a=1.9){T.uSky.value.set(t).multiplyScalar(a/Math.PI),T.uGnd.value.set(e).multiplyScalar(a/Math.PI)},dispose(){}}}export{Za as buildHero};
