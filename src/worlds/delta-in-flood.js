import*as r from"three";import{makePath as pr,clamp as U,lerp as Be,smoothstep as F,bell as hr}from"../kit/core.js";import*as mn from"../kit/sky.js";import*as ge from"../kit/flora.js";import*as fe from"../kit/fauna.js";import*as Fo from"../kit/fx.js";import{buildHero as vr}from"../parts/delta-in-flood.js";const gn=["#B9B45A","#6E9440","#1F4E7A","#9CC3E0","#FFF1CF","#A85A2A","#22301F"],j=Math.PI*2,T=.3,Je=42,S=a=>new r.Color(a),ye=T.toFixed(2),mr={afternoon:{preset:"day",sunEl:24,sun:"#fff0cc",sunI:3.5,zenith:"#3d7cc4",mid:"#8bb3d8",horizon:"#d6cab0",ground:"#74845e",scatter:"#ffe6c0",scatterK:.22,scatterPow:7,fog:"#bfcad0",fogD:72e-5,amb:"#9cc0e4",ambI:.95,groundLight:"#8c9460",exposure:1,bloom:.22,sat:1.12,contrast:1.09,tint:"#fffaf0",shadowTint:"#06101c",cloud:.36,cloudLit:"#fff6e6",cloudShade:"#8ea2bd",papGold:"#908f4e",papFloor:[.05,.06,.062],mirror:"#8fbde2",mirrorK:.86,spray:1,glit:1,curtain:.46,crown:.8,sunDisc:10},golden:{preset:"goldenHour",sunEl:9,sun:"#ffbe74",sunI:3,zenith:"#4470ac",mid:"#9aa6ba",horizon:"#e8b47c",ground:"#86744f",scatter:"#ffa864",scatterK:.6,scatterPow:5,fog:"#d4ae84",fogD:.00105,amb:"#8fa5cf",ambI:.95,groundLight:"#9a8050",exposure:1.02,bloom:.46,sat:1.1,contrast:1.08,tint:"#fff2e0",shadowTint:"#0a0e20",cloud:.42,cloudLit:"#ffd9a8",cloudShade:"#8c88a4",papGold:"#948e4e",papFloor:[.062,.068,.068],mirror:"#93a2c6",mirrorK:.8,spray:.92,glit:1.2,curtain:.56,crown:.85,sunDisc:9},dawn:{preset:"dawn",sunEl:7,sun:"#ffb9a2",sunI:2.3,zenith:"#6d86b6",mid:"#aba8c4",horizon:"#e4b9b0",ground:"#868090",scatter:"#ffae9a",scatterK:.55,scatterPow:5,fog:"#c6b2b9",fogD:.00115,amb:"#a3acd0",ambI:1,groundLight:"#8f8890",exposure:1.08,bloom:.42,sat:1.04,contrast:1.07,tint:"#fff4f2",shadowTint:"#0c1024",cloud:.3,cloudLit:"#ffd6cc",cloudShade:"#8a8eae",papGold:"#908f56",papFloor:[.056,.064,.066],mirror:"#a2aad2",mirrorK:.82,spray:.95,glit:.9,curtain:.7,crown:1.1,sunDisc:8,mist:1},night:{preset:"night",sunEl:32,sun:"#a9bde6",sunI:.8,zenith:"#030816",mid:"#0a1836",horizon:"#16305c",ground:"#060c18",scatter:"#5f7fc0",scatterK:0,scatterPow:5,fog:"#101d3a",fogD:.0011,amb:"#3a5aa8",ambI:2.9,groundLight:"#1c2a52",exposure:1.75,bloom:.5,sat:.96,contrast:1.06,tint:"#eef2ff",shadowTint:"#02040c",cloud:.25,cloudLit:"#8398cc",cloudShade:"#182446",papGold:"#8fa2c8",papFloor:[.02,.026,.036],mirror:"#2a4a86",mirrorK:1,spray:1.25,glit:1.6,curtain:1.1,crown:1.6,sunDisc:0,night:1}},De=`
float dh21(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float dvn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(dh21(i), dh21(i + vec2(1., 0.)), f.x), mix(dh21(i + vec2(0., 1.)), dh21(i + vec2(1., 1.)), f.x), f.y); }
float dfbm(vec2 p){ return dvn(p) * .55 + dvn(p * 2.13 + 7.1) * .3 + dvn(p * 4.31 - 3.7) * .15; }
uniform vec4 uCloud;   // x 1/size, y z drift (m), w strength
uniform vec4 uBox;     // x0, z0, 1/width, 1/depth of the baked rectangle
uniform sampler2D uShade;
float cloudSh(vec2 xz){ vec2 q = (xz + uCloud.yz) * uCloud.x; return 1. - uCloud.w * smoothstep(.5, .7, dvn(q) * .62 + dvn(q * 2.2 + 3.) * .38); }
// the sun that reaches a point: cloud shadow times the papyrus walls' shadow (which stands a known height above the water)
float sunAt(vec3 w){
  vec2 muv = (w.xz - uBox.xy) * uBox.zw; vec2 e = step(vec2(0.), muv) * step(muv, vec2(1.));
  float h = mix(-1., textureLod(uShade, clamp(muv, .003, .997), 0.).r * 9. - 1., e.x * e.y);
  return cloudSh(w.xz) * smoothstep(h - .9, h + .9, w.y - ${ye});
}
`,we=`#include <common>
#include <fog_pars_vertex>
`,xe=`#include <common>
#include <fog_pars_fragment>
`,gr=()=>r.UniformsUtils.clone(r.UniformsLib.fog);async function yr(a,i){const b=document.createElement("canvas");b.width=b.height=1024;const y=b.getContext("2d");y.clearRect(0,0,1024,1024);const g=(d,x,m,w,z,A)=>{const W=y.createRadialGradient(d,x,0,d,x,m*.6);W.addColorStop(0,`rgba(92,92,92,${A})`),W.addColorStop(.3,`rgba(124,124,124,${A*.6})`),W.addColorStop(.65,`rgba(156,156,156,${A*.22})`),W.addColorStop(1,"rgba(190,190,190,0)"),y.fillStyle=W,y.beginPath(),y.arc(d,x,m*.6,0,j),y.fill(),y.lineCap="round";const v=a.int(8,11),G=a()*j;for(let M=0;M<w;M++){const h=M/w*j+a.range(-.06,.06),O=Math.pow(.5+.5*Math.cos(h*v+G),.6),X=m*(.5+.5*O)*a.range(.74,1)*(.88+.12*Math.sin(h)),ce=m*.2*a.range(.3,1),D=Math.round(a.range(150,255)*(.8+.2*O)),I=d+Math.cos(h)*X,K=x-Math.sin(h)*X*.92+ce;y.strokeStyle=`rgb(${D},${D},${D})`,y.lineWidth=z*a.range(.7,1.2),y.beginPath(),y.moveTo(d,x),y.quadraticCurveTo(d+Math.cos(h)*X*.55,x-Math.sin(h)*X*.62,I,K),y.stroke()}};g(256,244,240,120,4.2,.62),await i(),y.fillStyle="#ffffff",y.fillRect(516,4,504,504);for(let d=0;d<2;d++){const x=d*512,m=1023,w=y.createLinearGradient(0,m,0,m-250);w.addColorStop(0,"rgba(66,66,66,1)"),w.addColorStop(.3,"rgba(80,80,80,0.8)"),w.addColorStop(.55,"rgba(90,90,90,0.34)"),w.addColorStop(1,"rgba(96,96,96,0)"),y.fillStyle=w,y.fillRect(x+20,m-250,472,251);const z=[];for(let A=0;A<11;A++){const W=x+70+(A+a())/11*372,v=a.range(-80,80),G=a.range(270,430),M=U(W+v,x+78,x+434),h=m-G,O=Math.round(a.range(74,118));y.strokeStyle=`rgb(${O},${O},${O})`,y.lineWidth=a.range(8,12),y.lineCap="butt",y.beginPath(),y.moveTo(W,m),y.quadraticCurveTo(W+v*.2,m-G*.6,M,h),y.stroke(),z.push([M,h])}z.sort((A,W)=>A[1]-W[1]);for(const[A,W]of z)g(A,Math.max(W,590),a.range(56,74),40,5,.7),await i()}const k=new r.CanvasTexture(b);return k.flipY=!1,k.generateMipmaps=!0,k.minFilter=r.LinearMipmapLinearFilter,k.magFilter=r.LinearFilter,k.anisotropy=4,k.wrapS=k.wrapT=r.ClampToEdgeWrapping,k.needsUpdate=!0,k}function wr(a){const i=()=>({p:[],uv:[],w:[],c:[],idx:[]}),u=d=>{const x=new r.BufferGeometry;return x.setAttribute("position",new r.Float32BufferAttribute(d.p,3)),x.setAttribute("uv",new r.Float32BufferAttribute(d.uv,2)),x.setAttribute("aW",new r.Float32BufferAttribute(d.w,4)),x.setAttribute("aC",new r.Float32BufferAttribute(d.c,3)),x.setIndex(d.idx),x},b=(d,x,m,w,z,A,W,v,G,M,h=0,O=1,X=0)=>(d.p.push(x,m,w),d.uv.push(z,A),d.w.push(W,v,G,M),d.c.push(h,O,X),d.p.length/3-1),y=(d,x,m,w,z)=>d.idx.push(x,m,w,x,w,z),g=d=>{const x=i();for(let m=0;m<d;m++){const w=m/d*j+a.range(-.4,.4),z=m===0?0:a.range(.35,1),A=.55*z,W=.06+.3*z*a.range(.5,1.2),v=a.range(4.1,5.1)*(1-.1*z),G=a(),M=Math.cos(w)*A,h=Math.sin(w)*A,O=Math.cos(w)*Math.sin(W),X=Math.sin(w)*Math.sin(W),ce=B=>[M+O*v*B*(.45+.55*B),v*B*Math.cos(W*B),h+X*v*B*(.45+.55*B)],D=[];[0,.55,1].forEach((B,_)=>{const Q=ce(B),pe=[.066,.05,.028][_],he=[];for(let se=0;se<3;se++){const P=w+se/3*j;he.push(b(x,Q[0]+Math.cos(P)*pe,Q[1],Q[2]+Math.sin(P)*pe,.75,.25,B*B,0,G,.25+.75*B))}D.push(he)});for(let B=0;B<2;B++)for(let _=0;_<3;_++)y(x,D[B][_],D[B][(_+1)%3],D[B+1][(_+1)%3],D[B+1][_]);const I=ce(1),K=a.range(.6,.82),H=I[1]+K*.05,Ge=a()*j;for(let B=0;B<3;B++){const _=[];for(const[Q,pe]of[[-1,-1],[1,-1],[1,1],[-1,1]]){let he,se,P,ae,ie,Re;if(B<2){const Oe=Ge+B*Math.PI*.5;ae=Math.cos(Oe)*Q,Re=Math.sin(Oe)*Q,ie=pe}else ae=Q*.92,Re=pe*.92,ie=.08;he=I[0]+ae*K,P=I[2]+Re*K,se=H+ie*K,_.push(b(x,he,se,P,.25+Q*.232,.238-pe*.232,1,1,G,1,ae,ie,Re))}y(x,_[0],_[1],_[2],_[3])}}return u(x)},k=()=>{const d=i(),x=3.4,m=6.4;for(let w=0;w<2;w++){const z=w*Math.PI*.5+.3,A=Math.cos(z)*x,W=Math.sin(z)*x,v=w*.5,G=a(),M=[b(d,-A,0,-W,v+.01,.998,0,2,G,0),b(d,A,0,W,v+.49,.998,0,2,G,0),b(d,A,m,W,v+.49,.502,1,2,G,1),b(d,-A,m,-W,v+.01,.502,1,2,G,1)];y(d,M[0],M[1],M[2],M[3])}return u(d)};return{clumpA:g(8),clumpB:g(7),card:k()}}const xr=we+`
attribute vec4 aW, iP, iQ;                 // aW: sway 0..1, kind (0 culm 1 head 2 card), phase, height light | iP: x z yaw scale | iQ: seed tint heightK -
attribute vec3 aC;                         // heads: where this corner lies on its mop, from the mop's centre (-1..1)
uniform float uTime, uHigh; uniform vec4 uWind;   // uWind: x dir x, y dir z, z strength, w gust speed | uHigh: 1 when the eye is far above the beds
uniform vec4 uSlip;                        // xyz: a point just behind the eye, w strength
varying vec2 vUv; varying vec3 vWorld, vRel; varying vec4 vInfo;
void main(){
  float c = cos(iP.z), s = sin(iP.z);
  vec3 p = position * vec3(iP.w, iP.w * iQ.z, iP.w);
  if(aW.y > 1.5) p.y *= 1. - .34 * uHigh;
  p.xz = vec2(p.x * c + p.z * s, p.z * c - p.x * s);
  vec3 w = vec3(iP.x, ${ye} - .12, iP.y) + p;
  float sw = aW.x, ph = aW.z * 6.283 + iQ.x * 40.;
  float gust = sin(dot(w.xz, uWind.xy) * .055 - uTime * uWind.w * 1.25 + sin(w.z * .021 + w.x * .013) * 2.) * .5 + .5;
  float amp = uWind.z * (.25 + .75 * gust * gust);
  vec2 d = uWind.xy * amp * (.38 + .16 * sin(uTime * 1.7 + ph)) + vec2(sin(uTime * 2.3 + ph), cos(uTime * 1.9 + ph * 1.3)) * (.07 + .09 * amp);
  vec2 away = w.xz - uSlip.xz; float ad = length(away);
  d += away / max(ad, .5) * uSlip.w * exp(-ad * ad * .0042) * (1. - smoothstep(4., 12., abs(w.y - uSlip.y)));
  w.xz += d * sw * iP.w; w.y -= dot(d, d) * sw * .12;
  vUv = uv; vWorld = w; vInfo = vec4(aW.y, aW.w, iQ.x, iQ.y);
  vRel = vec3(aC.x * c + aC.z * s, aC.y, aC.z * c - aC.x * s);
  vec4 mvPosition = viewMatrix * vec4(w, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ba=`
vec3 papShade(vec3 fill, vec3 sun){ return (mix(fill, vec3(dot(fill, vec3(.3, .5, .2))), .5) * 2.2 + mix(sun, vec3(dot(sun, vec3(.3, .5, .2))), .55) * .25) * .3183; }`,br=xe+De+ba+`
uniform sampler2D uMap; uniform vec3 uSunDir, uSunCol, uSkyCol, uCulm, uGreen, uGold, uFloor;
varying vec2 vUv; varying vec3 vWorld, vRel; varying vec4 vInfo;
void main(){
  vec4 t = texture2D(uMap, vUv);
  vec3 Vp = cameraPosition - vWorld; float dist = length(Vp);
  if(t.a < mix(.4, .15, smoothstep(10., 70., dist))) discard;
  vec3 V = Vp / max(dist, 1e-3);
  float kind = vInfo.x, cl = sunAt(vWorld), toSun = max(dot(-V, uSunDir), 0.), side = dot(V.xz, uSunDir.xz) * .5 + .5;
  float tone = .82 + .36 * dh21(vec2(vInfo.z * 91.7, 3.1)), lum = .52 + .6 * t.r * t.r;
  vec3 shL = papShade(uSkyCol, uSunCol), sunL = uSunCol * .3183 * cl;
  float trans = toSun * (.25 + 1.5 * toSun * toSun);                         // forward light through the fine rays
  vec3 c;
  if(kind < .5){                                   // culm: olive where the sun reaches it, dark green in the foot of the stand
    c = uCulm * tone * (shL * (.26 + .74 * vInfo.y) + sunL * (.1 + .7 * side) * (.25 + .75 * vInfo.y) * .8);
  } else if(kind < 1.5){                           // a mop of rays, shaded as a ball
    vec3 N = normalize(vRel + vec3(0., .3, 0.));
    float k = smoothstep(-.35, .75, dot(N, uSunDir));
    vec3 alb = mix(uGreen, uGold, k) * tone * lum;
    c = alb * (shL * (.78 + .22 * N.y) + sunL * (.08 + k * .72 + trans * .75)) + uGold * sunL * trans * .3 * lum;
  } else {                                         // a stand on a card
    float h = 1. - smoothstep(.52, .98, vUv.y), mop = smoothstep(.25, .8, h) * smoothstep(.35, .75, t.r);
    float st = dvn(vec2(vUv.x * 110. + (1. - vUv.y) * 5., vInfo.z * 37.));   // the stand is culms, light and dark, with air between them higher up: never a slab
    if(mop < .3 && st < .56 * smoothstep(.1, .55, h) * (1. - smoothstep(30., 70., dist))) discard;
    tone *= .62 + .76 * st;
    vec3 alb = mix(mix(uCulm, uGreen * .8, .2 + .5 * h), mix(uGreen, uGold, .2 + .6 * side), mop) * tone * lum;
    c = alb * (shL * (.42 + .58 * h) + sunL * (.12 + .74 * side) * (.3 + .7 * h) * .8 + sunL * trans * mop * .75) + uGold * sunL * trans * mop * .26 * lum;
  }
  gl_FragColor = vec4(c + uFloor, 1.);
  #include <fog_fragment>
}`,yn=`
uniform sampler2D uMask;   // r water depth / 4 m, g papyrus signed distance (-16..16 m), b grass on the plain, a lily rafts; plain defaults outside
vec4 maskAt(vec2 p){
  vec2 muv = (p - uBox.xy) * uBox.zw; vec4 m = texture2D(uMask, clamp(muv, .003, .997));
  vec2 e = smoothstep(vec2(0.), vec2(.02), muv) * (1. - smoothstep(vec2(.98), vec2(1.), muv));
  return mix(vec4(.075, 0., .8, 0.), m, e.x * e.y);
}
float sdLod(vec2 p){ vec2 muv = (p - uBox.xy) * uBox.zw; return textureLod(uMask, clamp(muv, .003, .997), 0.).g * 32. - 16.; }`,zr=we+`
varying vec3 vWorld;
void main(){ vWorld = position; vec4 mvPosition = viewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Sr=xe+De+yn+ba+`
uniform vec3 uSunDir, uSunCol, uSkyCol, uCulm, uGreen, uGold, uFloor; uniform float uTime; uniform vec4 uWind;
varying vec3 vWorld;
// one round umbel in its cell: returns how surely this point is on it; nrm is the dome's normal, info = (hash, ray, r / R)
float mopAt(vec2 q, float so, float soft, out vec3 nrm, out vec3 info){
  vec2 ci = floor(q), cf = fract(q) - .5; float hs = dh21(ci + so);
  vec2 a = cf - (vec2(dh21(ci + so + 1.3), dh21(ci + so + 8.1)) - .5) * .36;
  float R = .35 + .13 * hs, r = length(a);
  float ang = atan(a.y, a.x + (abs(a.x) + abs(a.y) < 1e-5 ? 1e-4 : 0.));
  float ray = .5 + .5 * sin(ang * 11. + hs * 40.);
  float edge = R * (.78 + .22 * ray * (1. - soft)), k = clamp(r / R, 0., 1.), dome = sqrt(max(1. - k * k, 0.));
  nrm = normalize(vec3(a.x, R * (.22 + dome), a.y));
  info = vec3(hs, ray, k);
  return 1. - smoothstep(edge - .05 - .12 * soft, edge + .04 * soft, r);
}
void main(){
  vec2 p = vWorld.xz; float sd = maskAt(p).g * 32. - 16.;
  if(sd - 2.4 + 2.2 * (dvn(p * .37) - .5) < 0.) discard;
  vec3 Vv = cameraPosition - vWorld; float dist = length(Vv); vec3 V = Vv / max(dist, 1e-3);
  float gust = sin(dot(p, uWind.xy) * .055 - uTime * uWind.w * 1.25 + sin(p.y * .021 + p.x * .013) * 2.) * .5 + .5;
  vec2 warp = (vec2(dvn(p * .17), dvn(p * .17 + 7.3)) - .5) * 3.2 + (vec2(dvn(p * .71 + 3.1), dvn(p * .71 + 11.)) - .5) * .7;   // no rows: the lattice is bent out of sight
  vec2 q = p * 1.25 + uWind.xy * gust * .2 + warp;
  vec2 dqx = dFdx(q), dqy = dFdy(q); float fa = length(dqx), fb = length(dqy), px = sqrt(max(fa, fb) * min(fa, fb) + 1e-8);   // cells to a pixel: the mean of the footprint's long and short axes, so the heads last out to a hundred metres
  float soft = smoothstep(.1, .4, px), melt = max(max(smoothstep(.34, .95, px), smoothstep(1.3, 2.6, max(fa, fb))), smoothstep(80., 135., dist));
  vec2 pb = p - V.xz / max(V.y, .3) * .5, qb0 = pb * 1.25 + uWind.xy * gust * .14 + warp;   // the lower storey, half a metre down
  vec2 qb = vec2(qb0.x * .8 - qb0.y * .6, qb0.x * .6 + qb0.y * .8) * 1.07 + vec2(.5, 17.3);
  vec3 nA, nB, iA, iB; float cA = mopAt(q, 2.7, soft, nA, iA), cB = mopAt(qb, 31.4, soft, nB, iB);
  float cl = cloudSh(p), toSun = max(dot(-V, uSunDir), 0.), back = toSun * toSun * .5;
  vec3 shL = papShade(uSkyCol, uSunCol), sunL = uSunCol * .3183 * cl;
  float kA = smoothstep(-.6, .5, dot(nA, uSunDir)), kB = smoothstep(-.6, .5, dot(nB, uSunDir));
  float tus = dvn(p * .27 + 5.), tusk = .78 + .44 * tus;                                 // tussocks: the bed stands in clumps a few metres across
  vec3 hA = mix(uGreen, uGold, kA) * (.86 + .28 * iA.x) * (1. - .34 * iA.y * iA.z * (1. - soft)) * (.62 + .38 * smoothstep(0., .34, iA.z)) * (shL * (.75 + .25 * nA.y) + sunL * (.08 + kA * .72 + back));
  vec3 hB = mix(uGreen, uGold, kB) * (.86 + .28 * iB.x) * (1. - .34 * iB.y * iB.z * (1. - soft)) * (shL * (.5 + .2 * nB.y) + sunL * (.04 + kB * .4 + back * .6));
  vec3 gap = mix(uCulm, uGreen, .4) * (shL * .42 + sunL * .05);
  float lean = smoothstep(.35, 1., tus);                                                // the tall middle of a tussock closes over its gaps
  vec3 c = mix(mix(gap, hB, max(cB, lean * .6)), hA, cA);
  float kM = smoothstep(-.6, .5, uSunDir.y * .7 + .12);
  vec3 mean = mix(gap, mix(uGreen, uGold, kM * .8) * (shL * .9 + sunL * (.08 + kM * .56 + back * .9)), .8) * (.9 + .2 * dvn(p * .9 + 2.) * (1. - smoothstep(110., 190., dist)));
  c = (mix(c, mean, melt) * tusk * (.86 + .28 * dvn(p * .06 + 4.)) * (.94 + .12 * gust) + uFloor);
  if(!gl_FrontFacing) c = mix(uCulm, uGreen, .3) * shL * .5 + uFloor;
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`,Mr=we+`
varying vec3 vWorld;
void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vWorld = wp.xyz; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,kr=xe+De+yn+ba+`
uniform vec3 uFill, uMirror;   // the sky fill that lights the papyrus; the colour of the low sky in the mirror
uniform vec3 uSunDir, uSunCol, uSkyCol, uHorizon, uDeep, uBed, uGrassA, uGrassB, uCulm, uGreen, uGold, uPapFloor, uFloor, uPadA, uPadB, uPetal;
uniform float uTime; uniform vec4 uWind, uWater, uWall;   // uWater: x ruffle, y glitter, z grass gain, w mirror brightness | uWall: x wall height m, y -, z -, w no walls beyond this z
varying vec3 vWorld;
// the papyrus wall a ray leaving the water meets: x 1 if it meets one, y distance m
vec2 wallMarch(vec2 p, vec2 dh){
  float tt = 0., hit = 0.;
  for(int i = 0; i < 7; i++){
    float sd = sdLod(p + dh * tt);
    if(sd > -.35){ hit = 1.; break; }
    tt += max(-sd * .9, .6);
  }
  return vec2(hit, tt);
}
// lily pads in one grid: rgb colour, a cover
vec4 padsAt(vec2 lp, float lily, float so, vec3 light, vec3 sky){
  vec2 ci = floor(lp), cf = fract(lp) - .5; float hs = dh21(ci + 5.3 + so);
  vec2 a = cf - (vec2(dh21(ci + 1.7 + so), dh21(ci + 9.2 + so)) - .5) * .3;
  float r = length(a), rad = .26 + .17 * hs;
  float ang = atan(a.y, a.x + (abs(a.x) + abs(a.y) < 1e-5 ? 1e-4 : 0.));
  float notch = smoothstep(0., .2, abs(mod(ang - hs * 6.283 + 9.4248, 6.2832) - 3.1416));
  float pad = (1. - smoothstep(rad - .04, rad, r)) * mix(1., notch, smoothstep(.04, .09, r)) * step(1. - lily, dh21(ci + 13.1 + so));
  float vein = .9 + .1 * sin(ang * 14. + hs * 9.);
  vec3 pc = mix(uPadA, uPadB, hs) * (.7 + .3 * (1. - smoothstep(0., rad, r))) * vein * mix(vec3(1.), vec3(1.25, .8, .55), smoothstep(rad - .07, rad - .01, r) * .6);
  pc = pc * light + sky * .08;
  float fl = step(.84, dh21(ci + 21.7 + so)) * (1. - smoothstep(.07, .12, length(a - vec2(.05, -.03))));     // an open flower on some
  pc = mix(pc, uPetal * light * 1.5, fl);
  return vec4(pc, max(pad, fl * step(1. - lily, dh21(ci + 13.1 + so))));
}
void main(){
  vec2 p = vWorld.xz; float t = uTime;
  vec3 Vv = cameraPosition - vWorld; float dist = length(Vv); vec3 V = Vv / max(dist, 1e-3);
  vec4 m = maskAt(p);
  float depth = m.r * 4., papSd = m.g * 32. - 16., grassK = m.b, lily = m.a;
  float sunK = sunAt(vec3(p.x, ${ye}, p.y));
  float fineK = 1. - smoothstep(6., 22., dist), grainK = 1. - smoothstep(3., 10., dist);
  float paw = smoothstep(.45, .8, dvn(p * .035 + uWind.xy * t * .12) * .65 + dvn(p * .11 - uWind.xy * t * .2) * .35);
  float calm = smoothstep(-3., 2., papSd), deepK = smoothstep(.45, 1.9, depth);
  // ---- the surface
  float amp = (.026 + .05 * paw + .08 * uWater.x) * (1. - .7 * calm) / (1. + dist * .012);
  vec2 rp = vec2(sin(p.x * 1.3 + t * 1.1 + 2. * sin(p.y * .7 - t * .6)), sin(p.y * 1.7 - t * 1.3 + 2. * sin(p.x * .9 + t * .5)));
  rp = rp * .4 + 2.2 * (vec2(dvn(p * 2.7 + t * .4), dvn(p * 2.7 + 17. - t * .35)) - .5) + .7 * (vec2(dvn(p * .8 - t * .3), dvn(p * .8 + 31. + t * .25)) - .5);
  rp += 2.6 * fineK * (vec2(dvn(p * 7.3 + vec2(t * .9, -t * .6)), dvn(p * 7.3 + 23. - vec2(t * .7, t * .8))) - .5);      // small wind ripples under the eye
  vec3 N = normalize(vec3(rp.x * amp, 1., rp.y * amp));
  float nv = max(dot(N, V), 0.), fres = .04 + .96 * pow(clamp(1. - nv, 0., 1.), 4.);
  fres = mix(fres, .05 + .95 * (1. - nv) * (1. - nv), .85 * smoothstep(uWall.w - 50., uWall.w + 15., p.y));   // out on the plain the shallow flood is a mirror from much steeper angles: the sky lies on it
  vec3 R = reflect(-V, N); R.y = abs(R.y);
  float rl = max(length(R.xz), 1e-3), sl = R.y / rl; vec2 rh = R.xz / rl;
  vec3 skyc = mix(uSkyCol, vec3(dot(uSkyCol, vec3(.3, .5, .2))), .24);
  vec2 sunh = uSunDir.xz / max(length(uSunDir.xz), 1e-3); float toS = max(dot(rh, sunh), 0.), roadK = toS * toS * toS;
  // a sky-blue mirror at grazing angles (the low sky, not the white of the horizon); warm only down the sun's road
  vec3 sky = mix(mix(mix(uHorizon, uMirror, .9), uHorizon, roadK * .3) * uWater.w, mix(skyc, uMirror, .25), smoothstep(-.02, .5, R.y));
  float cr = smoothstep(.5, .76, dfbm((p + rh * (700. / max(sl, .14))) * .0009 + uWind.xy * t * .004));              // clouds in the mirror
  sky = mix(sky, uHorizon * 1.05 * uWater.w, cr * .5 * min(uCloud.w * 2.2, 1.) * smoothstep(.03, .3, R.y));
  sky *= 1. + deepK * .22 * (dvn(vec2(p.x * .9, p.y * .13 - t * .3)) - .5) - .16 * paw * uWater.x;                   // the slow current drawing lines down the channel
  float wallK = 0.;
  if(p.y < uWall.w){
    vec2 wm = wallMarch(p, rh); vec2 hp = p + rh * wm.y; float hh = sl * wm.y;
    float Ht = uWall.x * (.82 + .3 * dvn(hp * .5) + .14 * dvn(hp * 1.9 + 3.));
    wallK = wm.x * (1. - smoothstep(Ht - .7, Ht + .2, hh));
    float f = clamp(hh / max(Ht, .5), 0., 1.), mopZ = smoothstep(.5, .8, f), along = dot(hp, vec2(rh.y, -rh.x));
    float toW = dot(rh, sunh);
    float wsun = sunAt(vec3(hp.x, ${ye} + hh, hp.y)) * smoothstep(-.3, .6, -toW);
    vec3 walb = mix(uCulm * (.55 + .9 * dvn(vec2(along * 4.5, hh * .35))), mix(uGreen, uGold, clamp(wsun * .7 + .3 * dvn(hp * 1.3 + hh), 0., 1.)) * (.7 + .6 * dvn(hp * 2.3 - hh * .7)), mopZ);
    vec3 wc = walb * (papShade(uFill, uSunCol) * (.3 + .7 * f) + uSunCol * .3183 * wsun * (.12 + .6 * f)) + uGold * uSunCol * cloudSh(hp) * mopZ * smoothstep(.15, .9, toW) * .1 + uFloor;
    sky = mix(sky, wc * .9, wallK * .94);
  }
  float sr = max(dot(R, uSunDir), 0.), s8 = sr * sr; s8 *= s8; s8 *= s8; float s64 = s8 * s8; s64 *= s64; s64 *= s64;
  float spark = dvn(p * 5. + vec2(t * 1.3, -t)) * dvn(p * 9. - vec2(t, t * 1.7));
  float s16 = s8 * s8, fineS = dvn(p * 19. + vec2(t * 2.1, -t * 1.6)) * dvn(p * 31. - vec2(t * 1.5, t * 2.3));
  float road = s16 * (smoothstep(.42, .54, fineS) * 1.5 / (1. + dist * .03) + .05);                                    // the glitter road: a broad lane of sparks toward the sun
  float glit = (s64 * s64 * smoothstep(.3, .5, spark) * .9 + s8 * s8 * s8 * .025 + road * .34) * uWater.y * sunK * (1. - wallK);
  // ---- looking down through it: the ray is bent at the surface and meets the bed further on
  float vl = max(length(V.xz), 1e-4), sT = min(vl, .999) / 1.33;
  vec2 bp = p - V.xz / vl * depth * sT / sqrt(1. - sT * sT) + N.xz * min(depth, 1.2) * 2.2;
  vec2 bw = bp + .1 * min(depth, 1.5) * vec2(sin(bp.y * 1.1 + t * .8), sin(bp.x * 1.3 - t * .7));
  // sand: ripple marks a hand apart, bent by a slow warp, and grain
  float warp = dvn(bw * .33) * 9. + dvn(bw * 1.07 + 4.) * 3.;
  float rip = sin(dot(bw, vec2(.62, .78)) * 24. + warp) * .5 + .5; rip = rip * rip * (3. - 2. * rip);
  float grain = dvn(bw * 21.) * .6 + dvn(bw * 43. + 7.) * .4;
  vec3 sandC = uBed * (.88 + .24 * dvn(bw * .6 + 3.)) * mix(1., .6 + .52 * rip, fineK) * mix(1., .84 + .32 * grain, grainK);
  // weed: dark beds with frayed edges, and loose strands combed out along the current
  vec2 cu = vec2(dot(bw, vec2(.34, .94)), dot(bw, vec2(.94, -.34)));
  float st1 = dvn(vec2(cu.x * 1.4 + sin(t * .5) * .1, cu.y * 9.)), st2 = dvn(vec2(cu.x * 2.6, cu.y * 23.) + 11.);
  float wb = dvn(bw * .21 + 9.) * .5 + dvn(bw * .83 + vec2(sin(t * .5) * .15, 0.)) * .32 + dvn(bw * 2.9) * .18;
  float weed = smoothstep(.5, .68, wb + (st1 - .5) * .3);
  float fronds = smoothstep(.6, .82, st1 * .6 + st2 * .4) * fineK;
  vec3 bed = mix(sandC, uBed * vec3(.16, .25, .1) * (.7 + .6 * st2), clamp(weed * .8 + fronds * .55, 0., .92));
  // the drowned meadow: blades lying downwind under the surface, sand showing between the tussocks
  float meadow = grassK * (1. - smoothstep(.5, 1.3, depth));
  vec2 gw = vec2(dot(bw, uWind.xy), dot(bw, vec2(-uWind.y, uWind.x)));
  float bl = dvn(vec2(gw.x * 2.3, gw.y * 25.)) * .6 + dvn(vec2(gw.x * 4.1 + 5., gw.y * 13. + gw.x * 3.)) * .4;
  float tus = smoothstep(.3, .62, dvn(bw * 1.25 + 2.) * .6 + dvn(bw * .37) * .4);
  vec3 turf = mix(uGrassB * vec3(.2, .23, .16), mix(uGrassB, uGrassA, .35) * .62, mix(.4, smoothstep(.42, .7, bl), fineK));
  bed = mix(bed, turf, meadow * (.12 + .7 * tus * tus));
  float c1 = dvn(bw * 2.3 + vec2(t * .35, -t * .22)), c2 = dvn(bw * 3.1 - vec2(t * .27, t * .31));
  float caust = pow(clamp(1. - abs(c1 + c2 - 1.) * 2.4, 0., 1.), 4.);                                            // a bright net of light on the bed
  bed *= (uSunCol * max(uSunDir.y, .06) * sunK * (.66 + .8 * caust * mix(.3, 1., fineK) * (1. - .8 * deepK)) + uSkyCol * .5) * .3183;
  vec3 T = exp(-depth * vec3(.75, .5, .62));
  bed = bed * T * vec3(1., .95, .8) + mix(uDeep, vec3(.05, .12, .09), .55) * (.5 + .15 * sunK) * (uSkyCol.b + .25) * (1. - T.g) * 1.6;
  vec3 c = mix(bed, sky, fres) + uSunCol * glit;
  // the dark floor of the papyrus beds
  c = mix(c, uPapFloor * (uSkyCol * .9 + uSunCol * (.03 + sunK * .14)) * (.55 + .9 * dvn(p * .9)) * .3183 + uFloor, smoothstep(-.4, 1.4, papSd));
  // lily rafts: two sizes of pad, some in flower
  if(lily > .02){
    vec3 light = (uSkyCol * 1.1 + uSunCol * (.06 + sunK * max(uSunDir.y, .1) * 1.7)) * .3183;
    vec4 pa = padsAt(p * 1.55, lily, 0., light, sky), pb = padsAt(p * .93 + 7.7, lily * .8, 40., light, sky);
    float fade = smoothstep(16., 60., dist);
    c = mix(c, pa.rgb, mix(pa.a, lily * .5, fade) * .96);
    c = mix(c, pb.rgb, pb.a * (1. - fade) * .96);
  }
  // grass and sedge tips standing through the sheet: meadows and open leads
  float gn = dvn(p * .017 + 3.) * .5 + dvn(p * .06) * .3 + dvn(p * .19) * .2;
  float tips = mix(smoothstep(.4, .68, dvn(p * vec2(13., 9.)) * .5 + dvn(p * vec2(31., 37.)) * .5), .64, smoothstep(6., 50., dist));
  float cover = clamp((.25 + .75 * smoothstep(.3, .58, gn)) * tips * (.55 + 1.45 * (1. - nv) * (1. - nv)), 0., .96) * grassK * (1. - deepK) * uWater.z;
  cover *= mix(.45, 1., smoothstep(5., 26., dist));               // under the eye the standing tufts are real; these are the stragglers
  float toSun = max(dot(-V, uSunDir), 0.);
  vec3 sunc2 = mix(uSunCol, vec3(dot(uSunCol, vec3(.3, .5, .2))), .5);
  vec3 grass = mix(uGrassB, uGrassA, smoothstep(.3, .8, dvn(p * .31 + 5.))) * (uSkyCol * .55 + sunc2 * sunK * .34 + uSunCol * sunK * .7 * toSun * toSun) * .3183;
  c = mix(c, grass, cover);
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`,Cr=we+`
attribute vec3 aIsle;                      // x radius fraction 0..1, y island radius m, z seed
varying vec3 vWorld, vN, vIsle;
void main(){ vWorld = position; vN = normal; vIsle = aIsle; vec4 mvPosition = viewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ar=xe+De+`
uniform vec3 uSunDir, uSunCol, uSkyCol, uSand, uSalt, uTurf, uTurfB, uUnder, uFloor;
varying vec3 vWorld, vN, vIsle;
void main(){
  vec2 p = vWorld.xz; vec3 N = normalize(vN + vec3(0., 1e-4, 0.));
  float n1 = dvn(p * .33 + vIsle.z * 17.), n2 = dvn(p * 1.7), n3 = dvn(p * 6.3), rf = vIsle.x + .1 * (n1 - .5);
  float dist = distance(cameraPosition, vWorld), fine = mix(n3, .5, smoothstep(12., 50., dist));
  float n4 = dvn(p * 23.) * .6 + dvn(p * 61.) * .4; fine = mix(fine * .7 + n4 * .3, fine, smoothstep(4., 22., dist));   // sand grain and litter up close
  vec3 sand = mix(uSand, uSalt, smoothstep(.8, .93, rf) * (.55 + .45 * n2)) * (.86 + .28 * fine);
  float turf = (1. - smoothstep(.62, .84, rf)) * smoothstep(.25, .5, n1 * .6 + n2 * .4);
  vec3 alb = mix(sand, mix(uTurf, uTurfB, n2) * (.7 + .6 * fine), turf);
  alb = mix(alb, uUnder, (1. - smoothstep(.2, .55, rf)) * (.4 + .4 * n1));                   // shade and litter under the trees
  alb = mix(alb, uUnder * 1.25, smoothstep(.5, .75, dvn(vec2(atan(p.y - vIsle.y, p.x) * 9., vIsle.z * 5.) + n2)) * smoothstep(.86, .9, rf) * (1. - smoothstep(.93, .97, rf)) * .55);   // a drift line of reed litter
  alb *= .78 + .22 * smoothstep(${T.toFixed(2)}, ${(T+.35).toFixed(2)}, vWorld.y);    // wet at the waterline
  float cl = cloudSh(p);
  vec3 c = alb * (uSkyCol * .55 + uSunCol * cl * max(dot(N, uSunDir) * .8 + .2, 0.)) * .3183 + uFloor * .8;
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`;function wn(){const a=[],i=[],u=[],b=[],y=[],g=[];return{I:g,v(k,d,x,m=0,w=0,z=0){return a.push(k[0],k[1],k[2]),i.push(d[0],d[1],d[2]),u.push(x.r,x.g,x.b),b.push(m,w,z,0),y.push(.875,.75),a.length/3-1},build(k){const d=new r.BufferGeometry;return d.setAttribute("position",new r.Float32BufferAttribute(a,3)),d.setAttribute("normal",new r.Float32BufferAttribute(i,3)),d.setAttribute("color",new r.Float32BufferAttribute(u,3)),d.setAttribute("wind",new r.Float32BufferAttribute(b,4)),d.setAttribute("uv",new r.Float32BufferAttribute(y,2)),d.setIndex(g),d.computeBoundingSphere(),d.computeBoundingBox(),d.userData={triangles:g.length/3,height:d.boundingBox.max.y,radius:Math.max(d.boundingBox.max.x,-d.boundingBox.min.x,d.boundingBox.max.z,-d.boundingBox.min.z),glowColor:null,...k},d}}}function ht(a,i={}){const u=wn(),b=i.height??18,y=i.segs??10,g=i.sides??7,k=i.lean||[a.range(-1.6,1.6),a.range(-1.6,1.6)],d=i.fans??14,x=i.pleats??8,m=S("#9a948a"),w=S("#625c54"),z=S(i.leaf||"#74905a"),A=S(i.leafLight||"#a9b77c"),W=S("#3c5232"),v=S("#a8946a"),G=S("#6f7a4a"),M=I=>[k[0]*Math.pow(I,1.7),b*I,k[1]*Math.pow(I,1.7)],h=[];for(let I=0;I<=y;I++){const K=I/y,H=M(K),Ge=(K-.56)/.13,B=b*.0165*(1+.6*Math.exp(-K*10))*(1+.5*Math.exp(-Ge*Ge))*(1-.22*K),_=[];for(let Q=0;Q<g;Q++){const pe=Q/g*j,he=Math.cos(pe),se=Math.sin(pe);_.push(u.v([H[0]+he*B,H[1],H[2]+se*B],[he,0,se],(I%2?m:w).clone().multiplyScalar(.8+.3*a()),.03*b*K*K))}h.push(_)}for(let I=0;I<y;I++)for(let K=0;K<g;K++){const H=(K+1)%g;u.I.push(h[I][K],h[I+1][K],h[I+1][H],h[I][K],h[I+1][H],h[I][H])}const O=M(1),X=.03*b,ce=b/18;let D=a()*j;for(let I=0;I<d;I++){const K=I/(d-1),H=F(.72,1,K),Ge=Be(1.2,-.75,Math.pow(K,.85))+a.range(-.12,.12);D+=2.4+a.range(-.3,.3);const B=[Math.cos(D)*Math.cos(Ge),Math.sin(Ge),Math.sin(D)*Math.cos(Ge)],_=[-Math.sin(D),0,Math.cos(D)],Q=[_[1]*B[2]-_[2]*B[1],_[2]*B[0]-_[0]*B[2],_[0]*B[1]-_[1]*B[0]],pe=ce*a.range(1.3,1.9),he=ce*a.range(1.5,2)*(1-.2*H),se=[O[0]+B[0]*pe,O[1]+B[1]*pe,O[2]+B[2]*pe],P=z.clone().lerp(v,H*.9),ae=A.clone().lerp(v,H),ie=W.clone().lerp(v,H*.6),Re=.06*ce,Oe=u.v([O[0]-_[0]*Re,O[1],O[2]-_[2]*Re],Q,G,X),Vo=u.v([O[0]+_[0]*Re,O[1],O[2]+_[2]*Re],Q,G,X),te=u.v(se,Q,ie,X+.1*ce,.3,1);u.I.push(Oe,Vo,te);let be=-1;for(let Ie=0;Ie<=x;Ie++){const ke=Be(-1.9,1.9,Ie/x),re=Ie%2,ne=he*(re?.82:1)*(.9+.1*Math.cos(ke)),E=(re?.11:-.05)*he,je=-(.12+.3*H)*he*(1-Math.cos(ke))*.6,vt=Math.cos(ke)*ne,Vt=Math.sin(ke)*ne,To=[se[0]+B[0]*vt+_[0]*Vt+Q[0]*E,se[1]+B[1]*vt+_[1]*Vt+Q[1]*E+je,se[2]+B[2]*vt+_[2]*Vt+Q[2]*E],et=[Q[0]+_[0]*(re?0:Math.sign(ke)*.5),Q[1]+.2,Q[2]+_[2]*(re?0:Math.sign(ke)*.5)],Tt=Math.hypot(et[0],et[1],et[2])||1,Ce=u.v(To,[et[0]/Tt,et[1]/Tt,et[2]/Tt],(re?P:ae).clone().multiplyScalar(.85+.3*a()),X+.16*ce,1,1);be>=0&&u.I.push(te,be,Ce),be=Ce}}return u.build({kind:"fanPalm"})}function Pr(a,i=3.5){const u=wn(),b=7,y=8,g=S("#9a8f80"),k=S("#6e655a"),d=[],x=a()*j;for(let w=0;w<=b;w++){const z=w/b,A=[],W=i*(.27*Math.pow(1-z,.75)+.035)*(1+.16*Math.sin(z*9+x));for(let v=0;v<y;v++){const G=v/y*j,M=W*(1+.2*Math.sin(G*3+z*5+x)+.1*a()),h=Math.cos(G),O=Math.sin(G);A.push(u.v([h*M+.12*i*z*z,i*z,O*M],[h*.9,.42,O*.9],g.clone().lerp(k,a()*.8+.2*(1-z)).multiplyScalar(.75+.25*z)))}d.push(A)}for(let w=0;w<b;w++)for(let z=0;z<y;z++){const A=(z+1)%y;u.I.push(d[w][z],d[w+1][z],d[w+1][A],d[w][z],d[w+1][A],d[w][A])}const m=u.v([.12*i,i*1.04,0],[0,1,0],g);for(let w=0;w<y;w++)u.I.push(d[b][w],m,d[b][(w+1)%y]);return u.build({kind:"spire"})}const xn=(a,i)=>a.r*(1+.1*Math.sin(2*i+a.ph)+.06*Math.sin(3*i+a.ph*2.3)+.035*Math.sin(5*i+a.ph*.7)),za=(a,i,u)=>{const b=i-a.x,y=u-a.z,g=Math.hypot(b,y)/xn(a,Math.atan2(y,b));return g>=1.1?-1:Be(-.2,a.h,1-F(.5,1.08,g))+(g<.9?.25*a.h*Math.sin(b*.31+a.ph)*Math.sin(y*.27)*(1-g):0)};function Wr(a){const i=[],u=[],b=[],y=[0,.3,.52,.7,.84,.94,1.02,1.1],g=22;for(const d of a){const x=i.length/3;i.push(d.x,za(d,d.x,d.z),d.z),u.push(0,d.r,d.ph);for(let m=1;m<y.length;m++)for(let w=0;w<g;w++){const z=w/g*j,A=xn(d,z)*y[m],W=d.x+Math.cos(z)*A,v=d.z+Math.sin(z)*A;i.push(W,m===y.length-1?-.25:za(d,W,v),v),u.push(y[m],d.r,d.ph)}for(let m=0;m<g;m++)b.push(x,x+1+(m+1)%g,x+1+m);for(let m=1;m<y.length-1;m++)for(let w=0;w<g;w++){const z=x+1+(m-1)*g+w,A=x+1+(m-1)*g+(w+1)%g,W=z+g,v=A+g;b.push(z,A,v,z,v,W)}}const k=new r.BufferGeometry;return k.setAttribute("position",new r.Float32BufferAttribute(i,3)),k.setAttribute("aIsle",new r.Float32BufferAttribute(u,3)),k.setIndex(b),k.computeVertexNormals(),k.computeBoundingSphere(),k}function Fr(){const a=new fe.Geo,i=S("#58585e"),u=S("#45464c"),b=S("#80706e"),y=S("#d1868c"),g=S("#dba0a0"),k=S("#521a22"),d=S("#efe6c8"),x=S("#1c1716");a.loft([{z:-2,y:-.5,rx:0,ry:0},{z:-1.8,y:-.52,rx:.46,ry:.52},{z:-1.2,y:-.56,rx:.84,ry:.76},{z:-.4,y:-.6,rx:.95,ry:.82},{z:.35,y:-.6,rx:.9,ry:.8},{z:.9,y:-.56,rx:.72,ry:.68},{z:1.25,y:-.5,rx:.58,ry:.56},{z:1.45,y:-.48,rx:0,ry:0}],{sides:12,top:u,belly:b,shade:[-1.1,-.5]}),a.blob(0,-.52,1.3,.34,.26,.2,k,k,8,4);const m=a.n,w=a.loft([{z:.98,y:-.4,rx:0,ry:0},{z:1.08,y:-.38,rx:.5,ry:.44},{z:1.42,y:-.33,rx:.52,ry:.45},{z:1.72,y:-.36,rx:.44,ry:.33},{z:2.05,y:-.35,rx:.57,ry:.31},{z:2.38,y:-.36,rx:.6,ry:.29},{z:2.52,y:-.38,rx:.52,ry:.24},{z:2.58,y:-.4,rx:0,ry:0}],{sides:12,top:i,belly:y,shade:[-.8,-.45],flat:.5,square:.35});a.paint(w,(v,G,M,h)=>{G>-.25&&M>2&&h.lerp(b,.3),G<-.5&&h.lerp(k,.85*(1-F(1.2,1.8,M)))});for(const v of[-1,1])a.blob(v*.33,.06,1.42,.13,.12,.17,i,b,6,4),a.blob(v*.41,.09,1.46,.05,.05,.05,x,x,5,3),a.blob(v*.24,-.08,2.36,.11,.07,.12,u,u,6,3),a.tube([[v*.44,-.5,2.18],[v*.46,-.66,2.2],[v*.45,-.78,2.17]],[.055,.045,0],5,d,d),a.tube([[v*.14,-.5,2.46],[v*.14,-.63,2.5]],[.04,0],4,d,d);a.anim([m,a.n],()=>[1,0,1,0]),a.pivot([m,a.n],0,-.52,1.12);const z=a.n;for(const v of[-1,1])a.fan([[v*.36,.04,1.16],[v*.56,.2,1.1],[v*.5,.3,1.15],[v*.36,.26,1.2],[v*.3,.14,1.2]],i,b);a.anim([z,a.n],v=>[Math.sign(v),0,3,0]),a.pivot([z,a.n],0,-.52,1.12);const A=a.n;a.loft([{z:1.02,y:-.74,rx:0,ry:0},{z:1.16,y:-.75,rx:.46,ry:.27},{z:1.7,y:-.74,rx:.42,ry:.27},{z:2.05,y:-.72,rx:.56,ry:.28},{z:2.38,y:-.71,rx:.59,ry:.27},{z:2.5,y:-.71,rx:.5,ry:.22},{z:2.56,y:-.71,rx:0,ry:0}],{sides:12,top:y,belly:i,shade:[.35,.75],square:.35}),a.paint([A,a.n],(v,G,M,h)=>{G>-.7&&h.lerp(k,.85*(1-F(1.2,1.8,M)))}),a.blob(0,-.45,1.75,.3,.07,.5,g,g,8,4);for(const v of[-1,1])a.tube([[v*.43,-.5,2.24],[v*.47,-.34,2.3],[v*.46,-.2,2.3],[v*.43,-.12,2.26]],[.075,.065,.045,0],6,d,d),a.tube([[v*.15,-.5,2.4],[v*.16,-.4,2.54],[v*.16,-.34,2.62]],[.05,.04,0],5,d,d);a.anim([A,a.n],()=>[1,0,2,0]),a.pivot([A,a.n],0,-.52,1.12);for(let v=m;v<a.n;v++)a.p[v*3+2]=1.12+(a.p[v*3+2]-1.12)*.8;const W=a.build();return W.userData.triangles=a.triangles,W}const bn=`
attribute vec4 iA, iB;                      // iA: x z yaw scale | iB: phase, period s, mode (0 ambient 1 surfacer 2 yawner) + 10 * group, seed
uniform float uTime, uLive; uniform vec4 uKey;   // uKey: xy = group 0 (surface, yawn) zw = group 1, driven by u
vec3 hippoState(){                          // x up 0..1, y yawn 0..1, z cycle 0..1
  float mode = mod(iB.z, 10.), grp = floor(iB.z / 10. + .01); vec2 key = grp < .5 ? uKey.xy : uKey.zw;
  float cyc = fract(uTime / iB.y + iB.x), up = smoothstep(0., .1, cyc) * (1. - smoothstep(.42, .8, cyc));
  float c2 = fract(uTime / (iB.y * 1.9) + iB.x * 3.7), yawn = mode > 1.5 ? smoothstep(.5, .58, c2) * (1. - smoothstep(.76, .86, c2)) : 0.;
  if(mode > 1.5){ yawn = mix(yawn, key.y, uLive); up = max(up * .7, yawn); }
  else if(mode > .5) up = mix(up, key.x, uLive);
  return vec3(up, yawn, cyc);
}`,Vr=we+bn+`
attribute vec4 aAnim; attribute vec3 aPivot;
varying vec3 vColor, vN, vWorld;
vec2 rot(vec2 yz, float a){ float c = cos(a), s = sin(a); return vec2(yz.x * c + yz.y * s, yz.y * c - yz.x * s); }
void main(){
  vec3 st = hippoState(), p = position, n = normal; float up = st.x, yawn = st.y, part = aAnim.z;
  if(part > 2.5){ vec3 e = vec3(aAnim.x * .36, .1, 1.16), d = p - e; float a = sin(uTime * 17. + iB.w * 40.) * (.2 + .9 * up * (1. - smoothstep(.12, .3, st.z))); float c = cos(a), s = sin(a); d.xz = vec2(d.x * c - d.z * s, d.x * s + d.z * c); p = e + d; }
  if(part > .5){
    float sway = .04 * sin(uTime * 1.9 + iB.w * 30.) * yawn;
    float a = (part > 1.5 && part < 2.5) ? -(.22 * yawn - sway) : (.08 * up + .74 * yawn + sway);
    vec3 d = p - aPivot; d.yz = rot(d.yz, a); n.yz = rot(n.yz, a); p = aPivot + d;
  }
  float pitch = .09 * up + .32 * yawn + .02 * sin(uTime * .9 + iB.w * 9.);                 // the forequarters come up; the rump stays down
  p.yz = rot(vec2(p.y + .5, p.z + .6), pitch) + vec2(-.5, -.6); n.yz = rot(n.yz, pitch);
  p.y += mix(-.6, .14, up) + .34 * yawn + .03 * sin(uTime * 1.3 + iB.w * 20.);
  p *= iA.w;
  float c = cos(iA.z), s = sin(iA.z);
  vec3 w = vec3(iA.x + p.x * c + p.z * s, ${ye} + p.y, iA.y + p.z * c - p.x * s);
  vN = vec3(n.x * c + n.z * s, n.y, n.z * c - n.x * s); vWorld = w; vColor = color * (.88 + .24 * fract(iB.w * 7.3));
  vec4 mvPosition = viewMatrix * vec4(w, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Tr=xe+De+`
uniform vec3 uSunDir, uSunCol, uSkyCol, uHorizon;
varying vec3 vColor, vN, vWorld;
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)); if(!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vWorld + vec3(0., 1e-5, 0.));
  float ndl = dot(N, uSunDir), sunK = sunAt(vWorld), wet = 1. - smoothstep(.0, .5, vWorld.y - ${ye});
  float pinkK = smoothstep(.02, .12, vColor.r - vColor.g * 1.4);
  vec3 alb = vColor * (1. - .3 * wet * (1. - pinkK));
  vec3 hemi = mix(uHorizon * .8, uSkyCol, N.y * .5 + .5) * (1.25 + .3 * pinkK);
  vec3 c = alb * (hemi + uSunCol * sunK * (max(ndl * .7 + .3, 0.) * .85 + .1 + .12 * pinkK)) * .3183;
  float fr = 1. - max(dot(N, V), 0.); fr *= fr * fr;
  vec3 Hv = normalize(V + uSunDir + vec3(0., 1e-4, 0.)); float sp = max(dot(N, Hv), 0.); sp *= sp; sp *= sp; sp *= sp; sp *= sp; sp *= sp;
  c += uSunCol * sunK * sp * (.05 + .22 * wet) + mix(uHorizon, uSkyCol, .5) * fr * (.05 + .2 * wet);
  c += uSunCol * sunK * (.25 + alb) * fr * smoothstep(-.5, .3, ndl) * max(dot(-V, uSunDir), 0.) * .3;
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`,Br=we+bn+`
uniform vec2 uBlow;                         // age 0..1 of the scripted surfacer's blow, per group
varying vec2 vP; varying vec3 vWorld; varying float vAge;
void main(){
  vec3 st = hippoState(); float mode = mod(iB.z, 10.), grp = floor(iB.z / 10. + .01);
  float age = st.z < .06 ? 1. : clamp((st.z - .06) / .2, 0., 1.);
  if(uLive > .5 && mode > .5) age = mode < 1.5 ? (grp < .5 ? uBlow.x : uBlow.y) : 1.;
  float c = cos(iA.z), s = sin(iA.z), sz = iA.w * (1.7 + 3.1 * age);
  vec3 o = vec3(iA.x + 2.1 * iA.w * s, ${ye} + .3, iA.y + 2.1 * iA.w * c);
  vec2 tc = cameraPosition.xz - o.xz; tc /= max(length(tc), 1e-3);
  vec3 w = o + vec3(tc.y, 0., -tc.x) * position.x * sz + vec3(0., position.y * sz * 1.1, 0.);
  vP = vec2(position.x * 2., position.y); vWorld = w; vAge = age;
  vec4 mvPosition = viewMatrix * vec4(w, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Dr=xe+De+`
uniform vec3 uSunDir, uSunCol, uSprayCol; uniform float uTime;
varying vec2 vP; varying vec3 vWorld; varying float vAge;
void main(){
  float a0 = 1. - vAge; if(a0 < .01) discard;
  float lean = abs(vP.x) - vP.y * .55, plume = exp(-lean * lean * 12.) * smoothstep(0., .12, vP.y) * (1. - smoothstep(.45, 1., vP.y));
  float n = dvn(vP * 5. + vec2(0., -uTime * 1.5)) * .6 + dvn(vP * 11. - uTime) * .4;
  float a = plume * (.4 + .9 * n) * a0 * (.3 + .7 * a0) * .9;
  if(a < .004) discard;
  vec3 ray = normalize(vWorld - cameraPosition + vec3(0., 1e-5, 0.)); float fs = max(dot(ray, uSunDir), 0.); fs = .12 + fs * fs;
  gl_FragColor = vec4(uSprayCol * .6 + uSunCol * fs * .5, min(a, .75));
  #include <fog_fragment>
  gl_FragColor.rgb *= gl_FragColor.a;
}`,Gr=we+`
attribute vec4 iR, iS;                      // iR: x z size phase | iS: mode (0 looping, 1 event), period s or event u, speed m/s, life s
uniform float uTime, uU;
varying vec2 vP; varying vec3 vWorld; varying vec3 vInfo;
void main(){
  float age = iS.x < .5 ? fract(uTime / iS.y + iR.w) * iS.y : (uU - iS.y) * ${Je.toFixed(1)};
  float show = step(0., age) * step(age, iS.w);
  vec3 w = vec3(iR.x + position.x * iR.z * show, ${(T+.03).toFixed(2)}, iR.y + position.z * iR.z * show);
  vP = position.xz * iR.z; vWorld = w; vInfo = vec3(age, iS.z, iS.w);
  vec4 mvPosition = viewMatrix * vec4(w, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Rr=xe+`
uniform vec3 uSkyCol, uHorizon, uSunDir, uSunCol;
varying vec2 vP; varying vec3 vWorld; varying vec3 vInfo;
float crest(float r, float age, float sp, float k){ float a = age - k * .55, rk = max(a, 0.) * sp + .3, w = .1 + .05 * max(a, 0.); float q = (r - rk) / w; return a < 0. ? 0. : exp(-q * q) / (1. + .5 * max(a, 0.)); }
void main(){
  float r = length(vP), age = vInfo.x, sp = vInfo.y;
  float c = crest(r, age, sp, 0.) + crest(r, age, sp, 1.) + crest(r, age, sp, 2.) + crest(r, age, sp, 3.);
  vec3 V = normalize(cameraPosition - vWorld + vec3(0., 1e-5, 0.)); float graze = 1. - max(V.y, 0.); graze *= graze;
  float a = clamp(c * (.1 + .34 * graze) * (1. - smoothstep(vInfo.z * .55, vInfo.z, age)), 0., .8);
  if(a < .004) discard;
  vec3 ray = -V; float fs = max(dot(reflect(ray, vec3(0., 1., 0.)), uSunDir), 0.); fs *= fs; fs *= fs;
  gl_FragColor = vec4(mix(uHorizon, uSkyCol, .4) * 1.1 + uSunCol * fs * .5, a);
  #include <fog_fragment>
  gl_FragColor.rgb *= gl_FragColor.a;
}`,_r=we+`
attribute vec4 iR, iS;                      // iR: x z size seed | iS: event u, life s, -, -
uniform float uU;
varying vec2 vP; varying vec3 vWorld; varying vec3 vInfo;
void main(){
  float age = (uU - iS.x) * ${Je.toFixed(1)}, show = step(0., age) * step(age, iS.y);
  vec3 o = vec3(iR.x, ${ye}, iR.y); float W = iR.z * 3.4, H = iR.z * 2.2;
  vec2 tc = cameraPosition.xz - o.xz; tc /= max(length(tc), 1e-3);
  vec3 w = o + (vec3(tc.y, 0., -tc.x) * position.x * W + vec3(0., position.y * H, 0.)) * show;
  vP = vec2(position.x * W, position.y * H); vWorld = w; vInfo = vec3(age, iR.w, iR.z);
  vec4 mvPosition = viewMatrix * vec4(w, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,qr=xe+De+`
uniform vec3 uSunDir, uSunCol, uSprayCol;
varying vec2 vP; varying vec3 vWorld; varying vec3 vInfo;
// round drops: one soft disc to a cell of launch space, a third of the cells empty
float drops1(vec2 p){ vec2 i = floor(p), f = fract(p) - .5; vec2 o = (vec2(dh21(i + 3.7), dh21(i + 11.3)) - .5) * .56; float rad = .07 + .11 * dh21(i + 5.1);
  return (1. - smoothstep(rad * .45, rad, length(f - o))) * step(.5, dh21(i + 17.9)); }
void main(){
  float t = max(vInfo.x, .02), seed = vInfo.y, sz = max(vInfo.z, .1), v0 = 4.4 * sqrt(sz);
  vec3 Vv = cameraPosition - vWorld; float dist = length(Vv), down = clamp(Vv.y / max(dist, 1e-3), 0., 1.);
  vec2 vel = vec2(vP.x, vP.y + 4.9 * t * t) / t;
  float sp = length(vel) / v0, an = atan(vel.x, max(vel.y, 1e-3));
  float rim = .66 + .3 * dvn(vec2(an * 2.1 + seed * 17., seed * 3.)) + .09 * dvn(vec2(an * 7.3, seed * 9.)), fan = 1. - smoothstep(.8, 1.25, abs(an));
  float sheet = (1. - smoothstep(rim - .4, rim, sp)) * fan, flung = smoothstep(rim - .2, rim, sp) * (1. - smoothstep(rim + .05, rim + .55, sp)) * fan;
  vec2 q = vel * 1.1 + seed * 13.;
  float lig = dvn(q * vec2(1.7, .8)) * .5 + dvn(q * 3.9 + 3.) * .3 + dvn(q * 9.1 - 7.) * .2, tear = smoothstep(.04, .6, t);
  float body = smoothstep(mix(.1, .42, tear), mix(.5, .8, tear), lig);
  float near = 1. - smoothstep(16., 42., dist);
  float beads = drops1(q * 3.1 + 5.) * (.35 + .65 * tear) * near, drops = drops1(q * 2.2 + 9.) * flung * near + flung * .1 * (1. - near);
  vec2 fq = vec2(vP.x / (.45 * sz + 1.3 * t), (vP.y - .05) / (.16 * sz + .5 * t));                              // froth: a low torn mound on the water, no dome
  float froth = exp(-dot(fq, fq) * 1.9) * (1. - smoothstep(.08, .55, t)) * (.35 + .65 * lig) * (1. - .75 * smoothstep(.2, .55, down));
  float a = clamp(((sheet * (body * .75 + beads * .9) + drops) * (1. - smoothstep(.5, 1., t)) + froth * .4) * .8, 0., .8) * smoothstep(0., .3, vP.y + .12 * lig);
  a *= (1. - smoothstep(.8, 1., abs(vP.x) / (1.7 * sz))) * (1. - smoothstep(.85, 1., vP.y / (2.2 * sz)));
  if(a < .004) discard;
  vec3 ray = normalize(vWorld - cameraPosition + vec3(0., 1e-5, 0.)); float fs = max(dot(ray, uSunDir), 0.); fs = .14 + .6 * fs * fs;
  gl_FragColor = vec4(uSprayCol * .6 + uSunCol * fs * (.5 + .35 * (beads + drops)), a);
  #include <fog_fragment>
  gl_FragColor.rgb *= gl_FragColor.a;
}`;function zn(a){const i=new fe.Geo,u=a.len,b=a.span,y=S(a.body),g=S(a.belly),k=S(a.head),d=S(a.wing),x=S(a.tip),m=S(a.tail),w=S(a.beak),z=S(a.leg);i.loft([{z:-.5*u,y:0,rx:0,ry:0},{z:-.36*u,y:0,rx:.1*u,ry:.1*u},{z:-.05*u,y:-.01*u,rx:.17*u,ry:.17*u},{z:.22*u,y:.01*u,rx:.15*u,ry:.15*u,top:k,belly:k},{z:.36*u,y:.03*u,rx:.09*u,ry:.09*u,top:k,belly:k}],{sides:8,top:y,belly:g});const A=i.n;i.blob(0,.07*u,.45*u,.095*u,.095*u,.12*u,k,k,7,4),i.tube([[0,.07*u,.54*u],[0,.06*u,.54*u+a.bill*.6],[0,.02*u,.54*u+a.bill]],[.045*u,.035*u,0],5,w,w);for(const D of[-1,1])i.blob(D*.075*u,.09*u,.5*u,.02*u,.02*u,.02*u,S("#111111"),S("#111111"),4,3);i.anim([A,i.n],()=>[0,0,2,0]),i.pivot([A,i.n],0,.02*u,.3*u),i.fan([[0,.02*u,-.34*u],[-.2*u,.02*u,-.74*u],[-.07*u,.02*u,-.8*u],[.07*u,.02*u,-.8*u],[.2*u,.02*u,-.74*u]],y,m);const W=i.n;for(const D of[-1,1])i.tube([[D*.07*u,-.12*u,-.06*u],[D*.08*u,-.3*u,0],[D*.08*u,-.34*u,.1*u]],[.035*u,.022*u,.012*u],4,g,z);i.anim([W,i.n],()=>[0,0,3,0]),i.pivot([W,i.n],0,-.1*u,-.06*u);const v=i.n,G=[.06,.3,.55,.8,1],M=[],h=[],O=[],X=[];G.forEach(D=>{const I=.08*u+D*b,K=a.chord*(1-.45*D*D),H=-.1*b*D*D;M.push([I,.02*u,.2*u+H+.03*b*Math.sin(D*3)]),h.push([I,0,.2*u+H-K]),O.push(d.clone().lerp(a.shoulder?S(a.shoulder):d,1-F(.1,.45,D))),X.push(d.clone().lerp(x,F(.3,1,D)))}),i.strip(M,h,O,X),i.anim([v,i.n],D=>[1,U((D-.08*u)/b,0,1),1,0]),i.pivot([v,i.n],.08*u,.02*u,.1*u),i.mirror([v,i.n],0);for(let D=v;D<i.n;D++)i.a[D*4]=Math.sign(i.p[D*3])||1;const ce=i.build();return ce.userData.triangles=i.triangles,ce}const Lr=we+`
attribute vec4 aAnim; attribute vec3 aPivot;
uniform vec4 uWing;                         // x raise rad, y flap amplitude rad, z fold 0..1, w phase
uniform vec2 uPose;                         // x head thrown back rad, y legs forward rad
varying vec3 vColor, vN, vWorld;
void main(){
  vec3 p = position, n = normal; float part = aAnim.z;
  if(part > .5 && part < 1.5){
    float sd = aAnim.x, s = aAnim.y, x0 = aPivot.x, th = uWing.x + uWing.y * (sin(uWing.w) * (1. - .35 * s) + .5 * s * sin(uWing.w - 1.1));
    float dx = (p.x - x0) * (1. - .84 * uWing.z), c = cos(th), sn = sin(th);
    p.z -= abs(p.x - x0) * uWing.z * .95; p.y += abs(dx) * sn - .04 * uWing.z; p.x = x0 + dx * c;
    n = normalize(vec3(n.x * c - sd * n.y * sn, n.y * c + sd * n.x * sn, n.z) + vec3(0., 1e-4, 0.));
  } else if(part > 1.5){
    float a = part < 2.5 ? uPose.x : uPose.y; vec3 d = p - aPivot; float c = cos(a), sn = sin(a);
    d.yz = vec2(d.y * c + d.z * sn, d.z * c - d.y * sn); n.yz = vec2(n.y * c + n.z * sn, n.z * c - n.y * sn); p = aPivot + d;
  }
  vec4 wp = modelMatrix * vec4(p, 1.);
  vWorld = wp.xyz; vN = mat3(modelMatrix) * n; vColor = color;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ir=xe+`
uniform vec3 uSunDir, uSunCol, uSkyCol, uHorizon;
varying vec3 vColor, vN, vWorld;
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)); if(!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vWorld + vec3(0., 1e-5, 0.));
  float ndl = dot(N, uSunDir), fr = 1. - max(dot(N, V), 0.); fr *= fr;
  vec3 c = vColor * (mix(uHorizon * .7, uSkyCol, N.y * .5 + .5) * .8 + uSunCol * (max(ndl, 0.) * .85 + .12)) * .3183;
  c += uSunCol * (.15 + vColor) * fr * max(dot(-V, uSunDir), 0.) * .35;
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`,Nr=we+`
attribute vec4 aAnim; attribute vec3 aStart; attribute vec4 aRnd, aDir;   // aAnim: wing span 0..1, part | aDir: heading x z, kind (0 egret 1 duck), launch delay s
uniform float uTime, uT;                         // uT: seconds since the first bird went up (from u)
varying vec3 vCol, vWorld, vN; varying float vKind;
vec3 track(float p){
  vec2 h = aDir.xy, sd = vec2(h.y, -h.x); float kind = aDir.z, sp = mix(11.5, 15., kind) * (.9 + .25 * aRnd.y);
  float run = sp * (p - (1. - exp(-p * 1.3)) / 1.3);
  float lift = (mix(4.4, 3.0, kind) + 3.2 * aRnd.z) * (1. - exp(-p * .8)) + .5 * p;
  float veer = (aRnd.w - .5) * 2.; veer = veer * (1.3 + .9 * p) + sign(veer) * (max(p - 3.2, 0.) * max(p - 3.2, 0.) * 1.8 + kind * 1.6 * p);   // ducks peel away from our line at once
  vec3 q = aStart + vec3(h.x * run + sd.x * veer, lift, h.y * run + sd.y * veer);
  q += vec3(sin(p * 2.1 + aRnd.x * 30.), .6 * cos(p * 2.7 + aRnd.y * 30.), sin(p * 1.7 + aRnd.z * 30.)) * .5 * min(p, 1.);
  return q;
}
void main(){
  float p = max(uT - aDir.w, 0.), kind = aDir.z, up = smoothstep(0., .3, p), part = aAnim.y, s = aAnim.x;
  vec3 c = track(p), f = normalize(track(p + .05) - c + vec3(aDir.x, 0., aDir.y) * 1e-3);
  vec3 r = normalize(cross(f, vec3(0., 1., 0.)) + vec3(1e-5, 0., 0.)), u = cross(r, f);
  float ph = uTime * mix(12.5, 25., kind) + aRnd.w * 40., sx = position.x < 0. ? -1. : 1.;
  vec3 l = position, n = normal, col = color;
  if(part > 2.5 && part < 3.5){
    // the arm beats from the shoulder, the hand lags and bends down on the upstroke: an arched wing, never a flat board
    float beat = sin(ph - s * .9), ang = ((beat * (.5 + .25 * s) + .12) * mix(1., .72, kind) - s * s * (.22 + .16 * cos(ph - .9))) * up;
    float dx = (abs(l.x) - .07) * mix(.22, 1., up), ca = cos(ang), sa = sin(ang) * sx;
    l.x = sx * (.07 + dx * ca); l.y += dx * sin(ang) - .05 * s * s * (1. - up);
    n = vec3(n.x * ca - n.y * sa, n.x * sa + n.y * ca, n.z);
    col *= .8 + .2 * smoothstep(0., .22, s);                                              // the wing root lies in the body's shade
  }
  if(kind > .5){
    col = vec3(.3, .17, .085);                                                           // chestnut body
    if(part > 4.5){ l.z = -.3 + (l.z + .3) * .2; col = vec3(.06, .05, .05); }               // ducks carry no long legs
    else if(part > 3.5) col = vec3(.05, .045, .04);
    else if(part > 2.5) col = mix(vec3(.34, .22, .13), vec3(.16, .115, .085), s);
    else if(part > 1.5) col = vec3(.08, .08, .09);
    else if(part > .5){ col = position.z > .425 && position.y > .055 ? vec3(.86, .85, .8) : (position.z > .36 ? vec3(.05, .045, .04) : vec3(.34, .18, .08)); }   // the white face, black nape, chestnut neck
    if(part > .5 && part < 2.5){ l.y = mix(l.y, .04 + (l.y - .04) * .5, smoothstep(.24, .4, l.z)) + .03 * smoothstep(.24, .44, l.z); l.z = .25 + (l.z - .25) * .7; }   // the neck out straight
    l *= vec3(.72, 1.15, .84);
  }
  float sc = mix(1.2, .84, kind) * (.9 + .22 * aRnd.x) * smoothstep(0., .14, p);          // out of the reeds, not out of thin air
  vec3 wp = c + (r * l.x + u * l.y + f * l.z) * sc;
  vN = r * n.x + u * n.y + f * n.z; vWorld = wp; vCol = col; vKind = kind;
  vec4 mvPosition = viewMatrix * vec4(wp, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Kr=xe+`
uniform vec3 uSunDir, uSunCol, uSkyCol;
varying vec3 vCol, vWorld, vN; varying float vKind;
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)); if(!gl_FrontFacing) N = -N;
  float ndl = dot(N, uSunDir), wrap = max(ndl * .75 + .25, 0.);
  vec3 skyD = mix(uSkyCol, vec3(dot(uSkyCol, vec3(.3, .5, .2))), .3);
  vec3 amb = skyD * mix(3.7, 2.2, vKind) * (.7 + .3 * N.y) * .3183;                   // undersides and far wings fall to a blue-grey: the bird has a form
  vec3 c = vCol * (amb + uSunCol * .3183 * (wrap * .8 + max(-ndl, 0.) * .2 * (1. - vKind)));
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`;function Hr(a){const i=new fe.Geo,u=S("#f1efe6"),b=S("#f2b01c"),y=S("#141210"),g=(M,h)=>i.anim(M,()=>[0,h,0,0]);g(i.loft([{z:-.3,y:.01,rx:0,ry:0},{z:-.21,y:.015,rx:.068,ry:.058},{z:-.03,y:0,rx:.125,ry:.108},{z:.13,y:0,rx:.118,ry:.105},{z:.25,y:.02,rx:.07,ry:.07},{z:.31,y:.035,rx:0,ry:0}],{sides:8,top:u,belly:u}),0),g(i.tube([[0,.03,.22],[0,-.04,.33],[0,-.03,.42],[0,.045,.45],[0,.085,.41]],[.052,.046,.04,.034,.034],6,u,u),1),g(i.blob(0,.098,.465,.038,.04,.068,u,u,6,4),1),g(i.tube([[0,.098,.52],[0,.09,.62],[0,.08,.73]],[.022,.015,0],4,b,b),2);const k=[[.07,.03,.15,-.15,0],[.27,.058,.2,-.2,.22],[.5,.064,.2,-.21,.48],[.71,.046,.15,-.21,.72],[.87,.012,.06,-.19,.9],[.95,-.012,-.04,-.15,.98],[.97,-.02,-.1,-.12,1]],d=S("#c4c8cc"),x=S("#e6e6e0"),m=i.n,w=k.map(M=>[M[0],M[1],M[2]]),z=k.map(M=>[M[0],M[1]+.03*(1-M[4]*.6),M[2]*.45+M[3]*.55+.1]),A=k.map(M=>[M[0],M[1]-.012,M[3]]);i.strip(w,z,u,x),i.strip(z,A,x,d),i.anim([m,i.n],M=>[U((M-.07)/.9,0,1),3,0,0]);const W=i.mirror([m,i.n],0);i.anim(W,M=>[U((-M-.07)/.9,0,1),3,0,0]),g(i.fan([[0,.02,-.25],[.065,.02,-.4],[0,.012,-.45],[-.065,.02,-.4]],u),4),g(i.tube([[0,-.03,-.2],[0,-.04,-.5],[0,-.045,-.8],[0,-.05,-.88]],[.026,.022,.024,.03],4,y,y,{flatten:1.5}),5);const v=i.build(),G=new r.InstancedBufferGeometry;G.index=v.index;for(const M of["position","normal","color","aAnim"])G.setAttribute(M,v.attributes[M]);return G.instanceCount=a,G.boundingSphere=new r.Sphere(new r.Vector3,1e5),G.userData.triangles=i.triangles,G}const Er=we+`
attribute vec2 aSV;                         // arc length m, across -1..1
varying vec2 vSV; varying vec3 vWorld;
void main(){ vSV = aSV; vWorld = position; vec4 mvPosition = viewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ur=xe+De+`
uniform vec3 uSkyCol, uHorizon; uniform float uHead, uTime, uHalf;
varying vec2 vSV; varying vec3 vWorld;
void main(){
  float back = uHead - vSV.x; if(back < 0. || back > 34.) discard;
  float x = abs(vSV.y) * uHalf + .12 * sin(back * 1.3 + uTime * 1.1), arm = .16 + .23 * back, w = .1 + .03 * back;
  float q = (x - arm) / w, q2 = (x - arm * .5) / (w * 1.3), qt = (x - arm + w * 1.7) / (w * 1.1);
  float feather = smoothstep(.15, .85, .5 + .5 * sin(back * 4.6 + x * 7. - uTime * 4.5));   // the cusp wavelets of a ship's wake
  float crest = (exp(-q * q) + .45 * exp(-q2 * q2)) * feather;
  float trough = exp(-qt * qt) * step(.6, back);
  float churn = (1. - smoothstep(0., arm * .5, x)) * (1. - smoothstep(0., 6., back)) * (.4 + .6 * dvn(vWorld.xz * 4. + uTime));
  vec3 V = normalize(cameraPosition - vWorld + vec3(0., 1e-5, 0.)); float graze = 1. - max(V.y, 0.); graze *= graze;
  float life = (1. - smoothstep(11., 26., back)) * smoothstep(0., 1.2, back + .4);
  float brk = .35 + .65 * dvn(vec2(back * 1.6 - uTime * 1.4, x * 3.));
  float aC = clamp((crest * (.12 + .32 * graze) * brk + churn * .22) * life, 0., .52), aT = clamp(trough * (.12 + .14 * graze) * life, 0., .35) * (1. - aC);
  float a = aC + aT;
  if(a < .004) discard;
  gl_FragColor = vec4((mix(uSkyCol, uHorizon, .6) * aC + mix(uSkyCol, vec3(.02, .04, .05), .7) * .5 * aT) / max(a, 1e-3), a);
  #include <fog_fragment>
  gl_FragColor.rgb *= gl_FragColor.a;
}`;function Or(){const a=new fe.Geo,i=S("#7c7e4a"),u=S("#474a2a"),b=S("#aaa478"),y=S("#1a1a12"),g=[[-2.3,-.02,0,0],[-1.95,-.03,.032,.1],[-1.45,-.05,.065,.14],[-.95,-.08,.13,.17],[-.5,-.1,.24,.19],[-.05,-.11,.33,.2],[.42,-.11,.34,.2],[.78,-.1,.27,.17],[1,-.08,.2,.13],[1.17,-.05,.2,.115],[1.33,-.05,.18,.1],[1.5,-.075,.13,.064],[1.75,-.085,.1,.05],[1.9,-.08,.096,.052],[1.97,-.085,0,0]];a.loft(g.map(m=>({z:m[0],y:m[1],rx:m[2],ry:m[3]})),{sides:12,top:i,belly:b,shade:[-.5,.1],flat:.4});const k=(m,w)=>{let z=0;for(;z<g.length-2&&w>g[z+1][0];)z++;const A=g[z],W=g[z+1],v=U((w-A[0])/(W[0]-A[0]),0,1),G=Be(A[2],W[2],v),M=Be(A[3],W[3],v),h=U(m/Math.max(G,.001),-1,1);return Be(A[1],W[1],v)+M*Math.sqrt(1-h*h)},d=(m,w,z,A)=>{const W=k(m,w)-.012;a.fan([[m,W,w-A*.5],[m,W+z,w+A*.05],[m,W,w+A*.5]],u,i)};for(let m=-2.12;m<.96;m+=.125)if(m<-1.35)d(0,m,.085*Math.min(1,(m+2.3)/.5),.13);else{const w=m<-.5?Be(.03,.085,(m+1.35)/.85):.09;d(w,m,.06,.125),d(-w,m,.06,.125),m>-.45&&m<.85&&(d(.2,m+.06,.035,.12),d(-.2,m+.06,.035,.12))}for(const m of[-1,1])a.blob(m*.105,.045,1.25,.05,.05,.075,i,u,6,4),a.blob(m*.125,.06,1.265,.022,.024,.03,y,y,5,3),a.blob(m*.035,-.035,1.9,.028,.022,.04,u,u,5,3);a.anim([0,a.n],(m,w,z)=>[U((.6-z)/2.9,0,1),0,0,0]);const x=a.build();return x.userData.triangles=a.triangles,x}const jr=we+`
attribute vec4 aAnim; uniform float uTime, uSwim; varying vec3 vColor, vN, vWorld, vLocal;
void main(){ vec3 p = position; vLocal = position; p.x += sin(p.z * 1.9 + uTime * 5.5) * .2 * aAnim.x * uSwim; vec4 wp = modelMatrix * vec4(p, 1.); vWorld = wp.xyz; vN = mat3(modelMatrix) * normal; vColor = color;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,$r=xe+De+`
uniform vec3 uSunDir, uSunCol, uSkyCol, uHorizon;
varying vec3 vColor, vN, vWorld, vLocal;
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)); if(!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vWorld + vec3(0., 1e-5, 0.));
  // square scutes in rows down the back, each with a paler keel and a dark groove round it
  vec2 sq = vec2(vLocal.x * 12., vLocal.z * 8.5), cf = fract(sq) - .5; float cell = dh21(floor(sq) + 3.);
  float topK = smoothstep(-.3, .45, N.y), groove = smoothstep(.3, .5, max(abs(cf.x), abs(cf.y))) * topK, keel = (1. - smoothstep(0., .2, abs(cf.x))) * topK;
  float band = smoothstep(.35, .65, dvn(vec2(vLocal.z * 2.6, 1.7)));                                    // faint dark saddles
  vec3 alb = vColor * (.8 + .34 * cell) * (1. - .5 * groove) * (1. + .2 * keel) * (1. - .28 * band * topK);
  float sunK = sunAt(vWorld), ndl = dot(N, uSunDir), wet = 1. - smoothstep(0., .25, vWorld.y - ${ye});
  vec3 skyD = mix(uSkyCol, vec3(dot(uSkyCol, vec3(.3, .5, .2))), .4);
  vec3 c = alb * (1. - .25 * wet) * (skyD * (.7 + .4 * N.y) + uSunCol * sunK * max(ndl * .75 + .25, 0.) * .8) * .3183;
  vec3 Hv = normalize(V + uSunDir + vec3(0., 1e-4, 0.)); float sp = max(dot(N, Hv), 0.); sp *= sp; sp *= sp; sp *= sp; sp *= sp;
  float fr = 1. - max(dot(N, V), 0.); fr *= fr * fr;
  c += uSunCol * sunK * sp * (.05 + .3 * wet) * (.5 + keel) + mix(uHorizon, uSkyCol, .5) * fr * (.04 + .16 * wet);
  float under = smoothstep(0., .28, ${ye} - vWorld.y);                                                // it sinks into the tea-dark water
  c = mix(c, vec3(.035, .06, .05) * (uSkyCol.b + .25), under * .88);
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`;function Yr(a){const u=document.createElement("canvas");u.width=u.height=256;const b=u.getContext("2d");b.clearRect(0,0,256,256);for(let g=0;g<30;g++){const k=256*(.5+a.range(-.32,.32)),d=a.range(-.3,.3)*256+(k-256/2)*.55,x=256*a.range(.45,.98),m=a.range(7,12),w=Math.round(a.range(150,255)),z=U(k+d,6,250),A=256-x,W=k+d*.3,v=256-x*.55;b.fillStyle=`rgb(${w},${w},${w})`,b.beginPath(),b.moveTo(k-m/2,256),b.quadraticCurveTo(W-m*.32,v,z,A),b.quadraticCurveTo(W+m*.32,v,k+m/2,256),b.closePath(),b.fill()}const y=new r.CanvasTexture(u);return y.flipY=!1,y.generateMipmaps=!0,y.minFilter=r.LinearMipmapLinearFilter,y.magFilter=r.LinearFilter,y.anisotropy=4,y.wrapS=y.wrapT=r.ClampToEdgeWrapping,y.needsUpdate=!0,y}function Xr(){const a=[],i=[],u=[];for(let y=0;y<2;y++){const g=y*Math.PI*.5+.4,k=Math.cos(g)*.5,d=Math.sin(g)*.5,x=a.length/3;a.push(-k,0,-d,k,0,d,k,1,d,-k,1,-d),i.push(.02,.99,.98,.99,.98,.02,.02,.02),u.push(x,x+1,x+2,x,x+2,x+3)}const b=new r.BufferGeometry;return b.setAttribute("position",new r.Float32BufferAttribute(a,3)),b.setAttribute("uv",new r.Float32BufferAttribute(i,2)),b.setIndex(u),b}const Sn=we+`
attribute vec4 iP, iQ;                     // iP: x z yaw width | iQ: seed, tint, height m, -
uniform float uTime; uniform vec4 uWind;
varying vec2 vUv; varying vec3 vWorld; varying vec3 vInfo;   // seed, tint, height above the water
void main(){
  float c = cos(iP.z), s = sin(iP.z);
  vec3 p = vec3(position.x * iP.w, position.y * iQ.z, position.z * iP.w);
  p.y *= 1. - smoothstep(105., 150., distance(cameraPosition.xz, iP.xy));          // far tufts sink away instead of popping
  p.xz = vec2(p.x * c + p.z * s, p.z * c - p.x * s);
  vec3 w = vec3(iP.x, ${ye} - .12, iP.y) + p;
  float gust = sin(dot(w.xz, uWind.xy) * .09 - uTime * uWind.w * 1.6 + sin(w.z * .05 + w.x * .03) * 2.) * .5 + .5;
  float sw = position.y * position.y;
  vec2 d = uWind.xy * uWind.z * (.1 + .32 * gust) + vec2(sin(uTime * 2.7 + iQ.x * 40.), cos(uTime * 2.2 + iQ.x * 31.)) * .035;
  w.xz += d * sw * iQ.z * 1.6; w.y -= dot(d, d) * sw * iQ.z * .8;
  float hgt = w.y - ${ye};
#ifdef MIRROR
  float hh = max(hgt, 0.), camH = max(cameraPosition.y - ${ye}, .05), k = camH / (camH + hh);
  w.xz = cameraPosition.xz + (w.xz - cameraPosition.xz) * k;
  w.xz += hh * .12 * vec2(sin(w.z * 5.3 + uTime * 2.1), sin(w.x * 4.7 - uTime * 1.8));
  w.y = ${ye} + .012;
#endif
  vUv = uv; vWorld = w; vInfo = vec3(iQ.x, iQ.y, hgt);
  vec4 mvPosition = viewMatrix * vec4(w, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Mn=xe+De+`
uniform sampler2D uMap; uniform vec3 uSunDir, uSunCol, uSkyCol, uRoot, uTip, uFloor;
varying vec2 vUv; varying vec3 vWorld; varying vec3 vInfo;
void main(){
  if(vInfo.z < 0.) discard;                                       // the part under water
  vec4 t = texture2D(uMap, vUv);
  vec3 Vp = cameraPosition - vWorld; float dist = length(Vp);
  if(t.a < mix(.42, .14, smoothstep(8., 60., dist))) discard;
  vec3 V = Vp / max(dist, 1e-3);
  float h = 1. - vUv.y, cl = cloudSh(vWorld.xz), toSun = max(dot(-V, uSunDir), 0.);
  vec3 alb = mix(uRoot, uTip, h * h) * (.75 + .5 * t.r) * (.82 + .36 * vInfo.y);
  vec3 sunc = mix(uSunCol, vec3(dot(uSunCol, vec3(.3, .5, .2))), .5);
  vec3 c = alb * (uSkyCol * .8 + sunc * cl * (.34 + .3 * h) + uSunCol * cl * toSun * toSun * (.45 + .7 * h)) * .3183 + uFloor * (.8 + .5 * h);   // the floor: light off the water all round, so the shade side stays olive, never black
#ifdef MIRROR
  float fres = .04 + .96 * pow(clamp(1. - V.y, 0., 1.), 4.);
  gl_FragColor = vec4(c * .55, fres * .9);
  #include <fog_fragment>
  gl_FragColor.rgb *= gl_FragColor.a;
#else
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
#endif
}`,Qr=we+`
attribute vec2 aSV;                         // metres along, 0..1 up
varying vec2 vSV; varying vec3 vWorld;
void main(){ vSV = aSV; vWorld = position; vec4 mvPosition = viewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Zr=xe+De+`
uniform vec3 uSunDir, uSunCol, uSkyCol, uDark, uLeaf, uFloor;
varying vec2 vSV; varying vec3 vWorld;
void main(){
  float x = vSV.x, y = vSV.y;
  float crown = dvn(vec2(x * .045, 3.)) * .5 + dvn(vec2(x * .13, 7.)) * .36 + dvn(vec2(x * .41, 1.)) * .14;
  float top = .4 + .56 * crown;
  if(y > top) discard;
  vec3 V = normalize(cameraPosition - vWorld + vec3(0., 1e-5, 0.));
  float back = max(dot(-V, uSunDir), 0.), lump = dvn(vec2(x * .22, y * 5.)) * .6 + dvn(vec2(x * .7, y * 11.)) * .4;
  float face = smoothstep(-.4, .6, dot(V.xz, uSunDir.xz));            // sunlit when we stand between it and the sun
  vec3 alb = mix(uDark, uLeaf, lump * (.35 + .65 * face)) * (.55 + .45 * smoothstep(0., .5, y));
  vec3 c = alb * (uSkyCol * .5 + uSunCol * cloudSh(vWorld.xz) * (.08 + .5 * face * lump)) * .3183;
  c += uLeaf * uSunCol * back * back * smoothstep(top - .1, top, y) * .05;      // the lit fringe of the crowns against the light
  c += uFloor * (1.1 + .5 * y);                                                    // far off and against the light: the dark green of the palette, not black
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`;var as={id:"delta-in-flood",name:"The Flood Comes to the Delta",category:"wilderness",weirdness:.05,media:["air","open"],async build(a){const i=a.rng,u=a.noise,b=a.quality?.detail??1,y=a.vary||{hour:"any",rare:!1,density:1,mood:.5},g=new r.Scene,k=i.fork("look"),d=k()*4%1,x={dawn:"dawn",day:"afternoon",golden:"golden",night:"night"}[y.hour]||(d<.28?"golden":d<.5?"dawn":d<.58?"night":"afternoon"),m=k(),w=x==="afternoon"?m>=.5?"clear":m>=.25?"haze":"wind":x==="golden"&&m<.25?"wind":"clear",z=k.pick(["flood","flood","may","august"]),A=k.chance(.14),W=k.chance(.4),v=!!y.rare,G=U(y.density??1,.7,1.3),M=x==="night",h={...mr[x]};let O=M?.3:.5,X=i.range(.8,1.15),ce=.12;w==="haze"&&(h.fog="#d3bd9c",h.fogD*=2,h.sun="#ffc68a",h.sunI*=.74,h.zenith="#7c9cbe",h.mid="#b0b8ba",h.horizon="#dcc29a",h.scatter="#ffb880",h.scatterK=.7,h.scatterPow=4,h.cloud=.12,h.glit*=.6,O=0,h.papGold="#9a8c4c",h.sunDisc=7,h.curtain*=.9),w==="wind"&&(X=2.4,ce=.85,h.cloud+=.14,O+=.1);const D=h.sunEl*Math.PI/180,I=i.range(-.1,.1),K=new r.Vector3(Math.cos(D)*Math.cos(I),Math.sin(D),Math.cos(D)*Math.sin(I)),H=new r.Vector2(-.55,.83).rotateAround(new r.Vector2,i.range(-.4,.4)),Ge={coverage:h.cloud,softness:.26,scale:1.7,opacity:.9,detail:.6,lit:h.cloudLit,shade:h.cloudShade,wind:[H.x*.012*X,H.y*.012*X],haze:.3},B=mn.makeSky(M?{rng:i,preset:"night",milkyWay:.3,stars:.85,bodyOverrides:{0:{elevation:h.sunEl,azimuth:90+I*180/Math.PI,size:2.1,glow:.12}},clouds:Ge,fogColor:h.fog,bake:!0,renderer:a.renderer}:{rng:i,preset:h.preset,zenith:h.zenith,mid:h.mid,horizon:h.horizon,ground:h.ground,horizonPow:4.2,scatterColor:h.scatter,scatter:h.scatterK,scatterPow:h.scatterPow,sunDirection:K,sunColor:h.sun,sunSize:1.5,sunIntensity:h.sunDisc,sunGlow:w==="haze"?1:.6,clouds:Ge,clouds2:!1,moon:{elevation:37,azimuth:-84,size:1.5,phase:.6,phaseAngle:110,intensity:.55,texture:.5},lightColor:h.sun,lightIntensity:h.sunI,ambientColor:h.amb,groundLight:h.groundLight,ambientIntensity:h.ambI,lightElevationMin:9,fogColor:h.fog,cloudLit:h.cloudLit,cloudShade:h.cloudShade,bake:!0,renderer:a.renderer});g.add(B.object),await a.yield(),g.fog=new r.FogExp2(S(h.fog),h.fogD);const _=mn.makeLightRig(B,{intensity:1,ambient:1,bounce:.45});g.add(_.object);const Q=S(h.sun).multiplyScalar(h.sunI),pe=S(h.amb).multiplyScalar(h.ambI*.9),he=S(h.horizon),se=M?S("#1a3a72"):S(h.zenith).lerp(S(h.mid),.45),P={uTime:{value:0},uCloud:{value:new r.Vector4(1/310,0,0,O)},uSunDir:{value:K.clone()},uSunCol:{value:Q},uSkyCol:{value:pe},uHorizon:{value:he},uWind:{value:new r.Vector4(H.x,H.y,.55*X,.8+.25*X)},uSlip:{value:new r.Vector4(0,100,0,1.25)},uShade:{value:null},uBox:{value:new r.Vector4(0,0,1,1)},uHigh:{value:1}},ae=(e,t,o,n={})=>new r.ShaderMaterial({uniforms:{...gr(),...o},vertexShader:e,fragmentShader:t,fog:!0,...n}),ie=()=>({uSunDir:P.uSunDir,uSunCol:P.uSunCol,uSkyCol:P.uSkyCol,uCloud:P.uCloud,uShade:P.uShade,uBox:P.uBox});await a.yield();const Re=i.range(-6,2),Oe={z:-35,sigma:42,amp:31},Vo=v?Oe.amp*Math.exp(-(((40-Oe.z)/Oe.sigma)**2)):0,te=await vr(a,{palette:gn,hour:x,weather:w,season:z,cast:A?"buffalo":"lechwe",water:"wake",duration:Je,count:Math.round(U((A?270:400)*G,250,520)),sunDir:K.toArray(),pool:{z:40,d:Re+Vo,radius:20},wheel:v?Oe:void 0,nearLanes:v?5:3,nearMax:v?172:150,curtainGain:h.curtain,crownGain:h.crown,curtainHeight:A?13:12,curtainNear:-11});g.add(te.object),te.setLight({sunColor:Q}),te.uniforms.uSprayCol.value.multiplyScalar(h.spray);{const e=te.parts,t=e.herdMat.uniforms;v&&(e.uCurt.value.w*=.8),t.uSkyCol={value:t.uSkyCol.value.clone().multiplyScalar(M?1.5:x==="afternoon"?1:1.3)},t.uBounce={value:t.uBounce.value.clone().multiplyScalar(M?2.6:x==="afternoon"?1.25:1.7).add(S("#6a5a3a").multiplyScalar(M?.1:.2))}}const be=te.anchors,Ie=te.flankX,ke=be.paceLine,re=new r.Vector3(...be.portalSeat.position),ne={x:be.pool.position[0],z:be.pool.position[2],r:be.pool.radius};await a.yield();const E=-690+i.range(-12,10),je=-330,vt=Ie(je)-44,Vt=i.range(-.055,-.015),To=i.range(5.2,6.8)*i.sign(),et=Math.PI/i.range(70,80),Tt=i.range(0,j),Ce=e=>vt+Vt*(e-je)+To*Math.sin(et*(e-je)+Tt)*F(E+80,E+180,e)*(1-F(je-46,je,e)),mt=[[Ce(E),26.3,E],[Ce(E+36),26.3,E+36],[Ce(E+72),26,E+72],[Ce(E+104),20.2,E+104],[Ce(E+136),11.2,E+136],[Ce(E+163),5.2,E+163],[Ce(E+188),2.95,E+188]];for(let e=E+222;e<je-18;e+=34)mt.push([Ce(e),T+2.2,e]);mt.push([vt,T+2.5,je],[Ie(-270)-24,T+3.3,-270]);const Bo=e=>v?1.9*F(-150,-95,e)*(1-F(12,50,e)):0,kn=[14.5,11,9.5,9.5,9.5,11,14.5];ke.forEach((e,t)=>mt.push([Ie(e[2])-(kn[t]??13),e[1]+Bo(e[2]),e[2]]));const _e=be.flyThrough,Ne=_e.length,oo=new r.Vector3(re.x-_e[Ne-2][0],re.y-_e[Ne-2][1],re.z-_e[Ne-2][2]).normalize();mt.push([_e[Ne-4][0],_e[Ne-4][1]+Bo(35),_e[Ne-4][2]],[_e[Ne-3][0],_e[Ne-3][1]+Bo(70),_e[Ne-3][2]]);const Sa=new r.Vector3(..._e[Ne-2]);mt.push(Sa.toArray(),Sa.clone().lerp(re,.5).toArray(),re.toArray());const q=pr(mt);await a.yield();const tt=e=>{const t=q.pointAt(e),o=q.tangentAt(e);return o.y=0,o.normalize(),{p:t,t:o,l:new r.Vector3(o.z,0,-o.x)}},N=(e,t=0,o=0,n=null)=>{const s=tt(e),p=s.p.clone().addScaledVector(s.l,t).addScaledVector(s.t,o);return n!==null&&(p.y=n),p},Bt=e=>{let t=0,o=1;for(let n=0;n<24;n++){const s=(t+o)/2;q.pointAt(s).z<e?t=s:o=s}return(t+o)/2},gt=Bt(ke[0][2]),Jr=Bt(ke[ke.length-1][2]);te.setRun({zStart:ke[0][2]+60-be.herd.travel*gt}),await a.yield();const Ma=Math.floor(E)-240,Do=760,ao=new Float32Array(Do);{let e=0;for(let t=0;t<Do;t++){(t&63)===0&&await a.yield();const o=Ma+t;if(o<=E){ao[t]=Ce(E)+(o-E)*(q.startTangent.x/Math.max(q.startTangent.z,.2));continue}for(;e<1&&q.pointAt(e).z<o;)e+=.0012;ao[t]=q.pointAt(Math.min(e,1)).x}}const $e=e=>{const t=U(e-Ma,0,Do-1.001),o=Math.floor(t);return Be(ao[o],ao[o+1],t-o)};await a.yield();const le=-306+i.range(-5,5),Go=Bt(le),Ro=i.range(0,j),Ye={...(()=>{const e=N(.405,37);return{x:e.x,z:e.z}})(),r:25,h:1.7,ph:i.range(0,j),near:!0,name:"first"},ka=re.clone().addScaledVector(new r.Vector3(oo.x,0,oo.z).normalize(),9),_o={x:ka.x,z:ka.z,r:33,h:1.5,ph:i.range(0,j),near:!0,name:"exit"},ve=(()=>{const e=N(.321,-14.5);return{x:e.x,z:e.z,r:10}})(),Ke={...(()=>{const e=N(.384,10.8);return{x:e.x,z:e.z}})(),r:4.6,h:.42,ph:1.3,bare:!0},oe=[N(.262,-9),N(.262,-62,46),N(.445,9),N(.445,44,30)].map(e=>[e.x,e.z]),He=.835,qo=v?N(He,-2.6,11):N(He,2.2,10),Ae=v?N(He,-6.6,14.5):N(He,7,13),no=(()=>{const e=v?qo:Ae,t=v?Ae:qo,o=t.x-e.x,n=t.z-e.z,s=Math.hypot(o,n)||1;return[[ne.x,ne.z],[e.x,e.z],[t.x,t.z],[t.x+o/s*8,t.z+n/s*8]]})(),Cn=[{x:$e(-200)-i.range(75,95),a:16,f:.021,p:i.range(0,j),w:6.5,z0:-330,z1:700},{x:i.range(95,120),a:22,f:.016,p:i.range(0,j),w:8,z0:-200,z1:900},{x:-i.range(200,240),a:30,f:.012,p:i.range(0,j),w:9,z0:-250,z1:900}],ro=(e,t,o,n,s,p)=>{const l=s-o,c=p-n,f=U(((e-o)*l+(t-n)*c)/(l*l+c*c),0,1);return Math.hypot(e-o-l*f,t-n-c*f)},Ca=te.uniforms.uLane.value.x,so=(e,t)=>e-.5*Ca*t*t,yt=[Ye,_o,Ke];{const e=i.fork("isles"),t=N(.555,-22),o=(s,p,l)=>{if(q.nearestXZ(s,p).dist<l+46||p<330&&Math.abs(so(s,p))<52+l||Math.hypot(s-ne.x,p-ne.z)<50+l||Math.hypot(s-t.x,p-t.z)<40+l||p<le+30+l&&s<Ie(Math.min(p,0))-4+l)return!1;for(const c of yt)if(Math.hypot(s-c.x,p-c.z)<c.r+l+55)return!1;return!0},n=(s,p,l,c,f)=>{for(let C=0,V=0;C<s&&V<400;V++){const L=e.range(.42,1.25),$=tt(Math.min(L,1)),R=e.sign(),ee=e.range(p,l)*R,de=e.range(c,f),Me=$.p.x+$.l.x*ee+$.t.x*(L>1?(L-1)*q.length:0),Ve=$.p.z+$.l.z*ee+$.t.z*(L>1?(L-1)*q.length*1.6:0);o(Me,Ve,de)&&(yt.push({x:Me,z:Ve,r:de,h:e.range(1.2,1.9),ph:e.range(0,j),near:l<260}),C++)}};n(5,62,150,15,26),await a.yield(),n(8,170,420,22,40),await a.yield(),n(11,480,1250,30,45)}await a.yield();const wt=e=>10.6-1.6*F(le-60,le-8,e),Dt=16,st=(e,t)=>{const o=$e(t);let n=Math.abs(e-o)-wt(t);return n=Math.min(n,le+6*Math.sin(e*.09+Ro)+3.5*Math.sin(e*.23)-t,Ie(Math.min(t,0))-17+5*Math.sin(t*.05+Ro)-e,e-(o-255-30*Math.sin(t*.011)),t-(E-205)),n<=-Dt?-Dt:(n=Math.min(n,Math.hypot(e-ve.x,t-ve.z)-ve.r,Math.hypot(e-Ye.x,t-Ye.z)-Ye.r*1.1-2.5,Math.hypot(e-Ke.x,t-Ke.z)-Ke.r-1.5),n=Math.min(n,ro(e,t,oe[0][0],oe[0][1],oe[1][0],oe[1][1])-3.6,ro(e,t,oe[2][0],oe[2][1],oe[3][0],oe[3][1])-3.2),Math.max(n,-Dt))},Aa=(e,t)=>{let o=.3;const n=wt(t)-Math.abs(e-$e(t));n>0&&t<le+60&&(o=Math.max(o,.3+2.9*F(.5,6.5,n)*(1-F(le+6,le+60,t))));const s=ve.r-Math.hypot(e-ve.x,t-ve.z);s>0&&(o=Math.max(o,.3+2.4*F(0,5,s)));const p=ne.r-Math.hypot(e-ne.x,t-ne.z)+1.6*Math.sin(e*.4)*Math.sin(t*.33);if(p>-3&&(o=Math.max(o,.3+2.9*F(-3,3,p))),Math.abs(t-Ae.z)<60){let l=1e9;for(let f=0;f<3;f++)l=Math.min(l,ro(e,t,no[f][0],no[f][1],no[f+1][0],no[f+1][1]));const c=5.5-l+Math.sin(e*.3+t*.2);c>-2&&(o=Math.max(o,.3+2.2*F(-2,2.5,c)))}for(const l of[0,2]){const c=3.4-ro(e,t,oe[l][0],oe[l][1],oe[l+1][0],oe[l+1][1]);c>0&&(o=Math.max(o,.3+1.6*F(0,2.5,c)))}for(const l of Cn)if(t>l.z0&&t<l.z1){const c=l.w-Math.abs(e-l.x-l.a*Math.sin(t*l.f+l.p)-.35*l.a*Math.sin(t*l.f*2.7+l.p));c>0&&(o=Math.max(o,.3+2*F(0,3.5,c)*F(l.z0,l.z0+60,t)))}return o},Pa=z==="august"?1.5:1,Wa=[.213,.238,.262,.287,.312,.337,.362,.39,.415,.44,.465].map(e=>q.pointAt(e).z+i.range(-3,3)),An=(e,t,o,n)=>{if(n<.5||o>.5)return 0;const s=.5+.5*Math.sin(e*.33+Math.sin(t*.19)*2)*Math.sin(t*.21+Math.sin(e*.13)*2),p=wt(t)-Math.abs(e-$e(t));let l=0;if(p>0&&t<le+40){let C=0;for(let V=0;V<Wa.length;V++){const L=V%2?1:F(1.5,4.5,Math.abs(e-$e(t)+(V%4?2.5:-2.5)));C=Math.max(C,(1-F(2.4,5.6,Math.abs(t-Wa[V]+3*Math.sin(e*.3))))*L)}l=Math.max((1-F(2.6,5.2,p))*F(.25,.5,s),C*F(.3,.55,s+.22))}const c=Math.hypot(e-ve.x,t-ve.z)/ve.r;c<1&&(l=Math.max(l,F(.55,.9,c)*s));const f=Math.hypot(e-ne.x,t-ne.z)/ne.r;return f<1.05&&(l=Math.max(l,F(.72,.95,f)*F(.35,.6,s)*.8)),U(l*Pa,0,1)},Pn=(e,t,o,n)=>{if(o>-1.5||n>.55)return 0;let s=1;for(const p of yt){const l=e-p.x,c=t-p.z,f=p.r+4;l*l+c*c<f*f&&(s=Math.min(s,F(.4,3,Math.sqrt(l*l+c*c)-p.r)))}return Math.abs(so(e,t))<36&&t<260&&(s*=.55),s},ue=384,qe=832,io=-345,lo=E-232,Gt=610,co=1350,it=new Uint8Array(ue*qe*4);for(let e=0;e<qe;e++){const t=lo+(e+.5)/qe*co;for(let o=0;o<ue;o++){(o&63)===0&&await a.yield();const n=io+(o+.5)/ue*Gt,s=(e*ue+o)*4,p=st(n,t),l=Aa(n,t);it[s]=Math.min(255,Math.round(l/4*255)),it[s+1]=Math.round(U((p+Dt)/(2*Dt),0,1)*255),it[s+2]=Math.round(Pn(n,t,p,l)*255),it[s+3]=Math.round(An(n,t,p,l)*255)}}const lt=new r.DataTexture(it,ue,qe,r.RGBAFormat,r.UnsignedByteType);lt.magFilter=lt.minFilter=r.LinearFilter,lt.wrapS=lt.wrapT=r.ClampToEdgeWrapping,lt.needsUpdate=!0,await a.yield();const Wn=5.8,Lo=new Uint8Array(ue*qe),Fn=Gt/ue,Vn=Math.tan(Math.max(D,.06));for(let e=1;e<qe-1;e++){let t=-1;for(let o=ue-2;o>0;o--){const n=e*ue+o;t=Math.max(t-Fn*Vn,-1),Lo[n]=Math.round(U((t+1)/9,0,1)*255),it[n*4+1]>134&&(t=Wn)}(e&31)===0&&await a.yield()}const ct=new r.DataTexture(Lo,ue,qe,r.RedFormat,r.UnsignedByteType);ct.magFilter=ct.minFilter=r.LinearFilter,ct.wrapS=ct.wrapT=r.ClampToEdgeWrapping,ct.needsUpdate=!0,P.uShade.value=ct,P.uBox.value.set(io,lo,1/Gt,1/co);const Fa={uMask:{value:lt}},Tn=(e,t)=>{const o=U(Math.floor((e-io)/Gt*ue),0,ue-1),n=U(Math.floor((t-lo)/co*qe),0,qe-1);return it[(n*ue+o)*4+3]/255},Bn=(e,t)=>{const o=U(Math.floor((e-io)/Gt*ue),0,ue-1),n=U(Math.floor((t-lo)/co*qe),0,qe-1);return Lo[n*ue+o]/255*9-1},Io=S(z==="may"?"#b8a860":z==="august"?"#8fa24c":"#a8a458"),No=S(z==="may"?"#8f8a4c":z==="august"?"#587f3c":"#647e3e");{const e=te.parts.sheet?.material?.uniforms;e&&(e.uBed.value.multiplyScalar(.6),e.uGrassA.value=Io,e.uGrassB.value=No)}const Rt=new r.Color().fromArray(h.papFloor),Ko=S(M?"#7f9a78":"#80a854"),Ho=S("#69734a"),Eo=S(h.papGold),Dn=ae(Mr,kr,{...Fa,...ie(),uTime:P.uTime,uWind:P.uWind,uSkyCol:{value:se},uHorizon:{value:he.clone().multiplyScalar(.96)},uDeep:{value:S(gn[2])},uBed:{value:S("#cdbb8c")},uGrassA:{value:Io},uGrassB:{value:No},uCulm:{value:Ho},uGreen:{value:Ko},uGold:{value:Eo},uFloor:{value:Rt},uPapFloor:{value:S("#465a2c")},uPetal:{value:S("#ece8fb")},uPadA:{value:S("#3d7436")},uPadB:{value:S("#86a84a")},uWater:{value:new r.Vector4(ce,h.glit,z==="may"?1.2:1,h.mirrorK)},uFill:P.uSkyCol,uMirror:{value:S(h.mirror)},uWall:{value:new r.Vector4(6.2,0,0,le+30)}}),uo=new r.Mesh(new r.PlaneGeometry(9600,9600).rotateX(-Math.PI/2),Dn);uo.position.set(-40,T,-100),uo.frustumCulled=!1,uo.name="flood",g.add(uo),await a.yield();const Gn=ae(Cr,Ar,{...ie(),uFloor:{value:new r.Color().fromArray(h.papFloor)},uSand:{value:S("#cdbb98")},uSalt:{value:S("#ece6d6")},uTurf:{value:S("#a39a55")},uTurfB:{value:S("#6f8040")},uUnder:{value:S("#4b4a30")}}),Uo=new r.Mesh(Wr(yt),Gn);Uo.name="islands",Uo.frustumCulled=!1,g.add(Uo);const ot=(e,t)=>{let o=T-.3;for(const n of yt){const s=e-n.x,p=t-n.z;s*s+p*p<n.r*n.r*1.3&&(o=Math.max(o,za(n,e,t)))}return o};await a.yield();const Va=await yr(i.fork("ptex"),a.yield);await a.yield();const ut=wr(i.fork("pgeo")),Z=i.fork("pap");await a.yield();const Rn=ae(xr,br,{...ie(),uTime:P.uTime,uWind:P.uWind,uSlip:P.uSlip,uHigh:P.uHigh,uMap:{value:Va},uCulm:{value:Ho},uGreen:{value:Ko},uGold:{value:Eo},uFloor:{value:Rt}},{side:r.DoubleSide}),Oo=new r.Group;Oo.name="papyrus",g.add(Oo);const jo=6,$o=E-205,Yo=(le+14-$o)/jo,Xo=()=>Array.from({length:jo},()=>({p:[],q:[]})),Ta=Xo(),Qo=Xo(),Ba=Xo(),Zo=(e,t,o,n,s)=>{const p=e[U(Math.floor((o-$o)/Yo),0,jo-1)];p.p.push(t,o,Z()*j,n),p.q.push(Z(),Z(),s,0)},fo=[],_t=(e,t,o=1.2,n=0)=>{st(e,t)<.25||q.nearestXZ(e,t).dist<9.4||fo.push([e,t,o,n])};for(let e=E+104;e<le+8;e+=2)for(const t of[-1,1]){t<0&&await a.yield();const o=e+Z.range(-.6,.6),n=$e(o),s=wt(o);_t(n+t*(s+.45+Z.range(0,1)),o,1.26),Z.chance(.9*b)&&_t(n+t*(s+2.5+Z.range(0,1.5)),o+1,1.44)}const Jo=(e,t,o,n)=>{for(let s=0;s<j;s+=n/o){const p=o+Z.range(.3,1.5);_t(e+Math.cos(s)*p,t+Math.sin(s)*p,1.2,1)}};await a.yield(),Jo(ve.x,ve.z,ve.r,1.8),Jo(Ye.x,Ye.z,Ye.r*1.1+2.5,2.6),Jo(Ke.x,Ke.z,Ke.r+1.5,2.2);for(let e=-70;e<70;e+=2.2){const t=$e(le)+e+Z.range(-.7,.7);if(Math.abs(e)>wt(le)+.4)for(let o=0;o<3;o++)_t(t+Z.range(-.5,.5),le+6*Math.sin(t*.09+Ro)+3.5*Math.sin(t*.23)-.6-o*2-Z(),1.05+.17*o,1)}for(const e of[0,2])for(let t=.04;t<1;t+=.05)for(const o of[-1,1]){const n=oe[e+1][0]-oe[e][0],s=oe[e+1][1]-oe[e][1],p=Math.hypot(n,s);_t(oe[e][0]+n*t+-s/p*o*(4.2+Z()),oe[e][1]+s*t+n/p*o*(4.2+Z()),1.15,1)}await a.yield();const Da=(e,t,o)=>{st(e,t)<o||Zo(Ba,e,t,Z.range(.9,1.15),Z.range(.9,1.08))};{const e=new Map,t=(o,n)=>Math.floor(o/3)+":"+Math.floor(n/3);for(const o of fo){const n=t(o[0],o[1]);e.has(n)||e.set(n,[]),e.get(n).push(o)}for(let o=0;o<fo.length;o++){(o&31)===0&&await a.yield();const n=fo[o],s=Math.floor(n[0]/3),p=Math.floor(n[1]/3);let l=0;for(let c=-1;c<=1;c++)for(let f=-1;f<=1;f++){const C=e.get(s+c+":"+(p+f));if(C)for(const V of C)V!==n&&Math.hypot(V[0]-n[0],V[1]-n[1])<3&&l++}if(!(l<2)&&(Zo(Z.chance(.55)?Ta:Qo,n[0],n[1],Z.range(.92,1.12),n[2]*Z.range(.92,1.08)),n[3])){const c=Z()*j,f=n[0]+Math.cos(c)*1.3,C=n[1]+Math.sin(c)*1.3;st(f,C)>.25&&q.nearestXZ(f,C).dist>9.4&&Zo(Qo,f,C,Z.range(.82,1),n[2]*Z.range(.9,1.1))}}}await a.yield();for(let e=E-30;e<le+8;e+=3.3)for(const t of[-1,1])for(let o=5.2;o<17;o+=3+o*.03)Da($e(e)+t*(wt(e)+o+Z.range(-.9,.9)),e+Z.range(-1.3,1.3),2.2);await a.yield();for(const e of[0,2])for(let t=.04;t<1;t+=.03)for(const o of[-1,1]){const n=oe[e+1][0]-oe[e][0],s=oe[e+1][1]-oe[e][1],p=Math.hypot(n,s);Da(oe[e][0]+n*t+-s/p*o*(5.4+Z()),oe[e][1]+s*t+n/p*o*(5.4+Z()),1.4)}let Ga=0;const ea=(e,t)=>t.forEach((o,n)=>{const s=o.p.length/4;if(!s)return;const p=new r.InstancedBufferGeometry;p.index=e.index;for(const V in e.attributes)p.setAttribute(V,e.attributes[V]);p.setAttribute("iP",new r.InstancedBufferAttribute(new Float32Array(o.p),4)),p.setAttribute("iQ",new r.InstancedBufferAttribute(new Float32Array(o.q),4)),p.instanceCount=s;let l=1e9,c=-1e9;for(let V=0;V<s;V++)l=Math.min(l,o.p[V*4]),c=Math.max(c,o.p[V*4]);const f=$o+(n+.5)*Yo;p.boundingSphere=new r.Sphere(new r.Vector3((l+c)/2,3.5,f),Math.hypot((c-l)/2+6,Yo/2+6,9));const C=new r.Mesh(p,Rn);C.name=e===ut.card?"papyrus-cards":"papyrus-clumps",Oo.add(C),Ga+=s*(e.index.count/3)});ea(ut.clumpA,Ta),ea(ut.clumpB,Qo),ea(ut.card,Ba),await a.yield();{const e=[],t=[],n=(l,c)=>5.5+.5*u.n2(l*.045,c*.045);for(let l=E-205;l<le+12;l+=9)for(let c=-345;c<140;c+=9){if(c===-345&&await a.yield(),st(c+9/2,l+9/2)<-5)continue;const f=e.length/3;e.push(c,n(c,l),l,c+9,n(c+9,l),l,c+9,n(c+9,l+9),l+9,c,n(c,l+9),l+9),t.push(f,f+2,f+1,f,f+3,f+2)}const s=new r.BufferGeometry;s.setAttribute("position",new r.Float32BufferAttribute(e,3)),s.setIndex(t),s.computeBoundingSphere();const p=new r.Mesh(s,ae(zr,Sr,{...ie(),...Fa,uTime:P.uTime,uWind:P.uWind,uCulm:{value:Ho},uGreen:{value:Ko},uGold:{value:Eo},uFloor:{value:Rt}},{side:r.DoubleSide}));p.name="papyrus-canopy",g.add(p),Ga+=t.length/3}await a.yield();const _n=ge.makeWind({direction:[H.x,H.y],strength:.85*X,speed:1});await a.yield();const qt=ge.windMaterial({wind:_n,backlight:.75,backlightTint:"#e6ee9a"});await a.yield();const Y=i.fork("trees"),Ra={leaf:"#35602c",leafLight:"#6f9a40",leafDark:"#1c3a1c",bark:"#6a5a48",barkDark:"#3a3028"},_a={leaf:"#557f38",leafLight:"#a6c060",leafDark:"#2a4a26",coconuts:!1},Xe=[],dt=[];Xe.push(ht(Y,{height:19})),await a.yield(),Xe.push(ht(Y,{height:16.5,fans:13})),await a.yield(),Xe.push(ht(Y,{height:21.5,fans:15})),await a.yield(),Xe.push(ge.palmGeometry({rng:Y,height:4.3,detail:0,fronds:9,curve:.5,..._a})),await a.yield(),Xe.push(ge.oakGeometry({rng:Y,height:9.5,detail:1,fullness:1.15,...Ra})),await a.yield(),Xe.push(Pr(Y)),await a.yield(),dt.push(ht(Y,{height:19,segs:5,sides:5,fans:9,pleats:6})),await a.yield(),dt.push(ht(Y,{height:16.5,segs:5,sides:5,fans:8,pleats:6})),await a.yield(),dt.push(ht(Y,{height:21.5,segs:5,sides:5,fans:9,pleats:6})),await a.yield(),dt.push(ge.palmGeometry({rng:Y,height:4.3,detail:0,fronds:6,curve:.5,..._a})),await a.yield(),dt.push(ge.oakGeometry({rng:Y,height:9.5,detail:0,fullness:1.15,...Ra}),Xe[5]),await a.yield();const qa=[],J={t:new r.Vector3(oo.x,0,oo.z).normalize()};J.l=new r.Vector3(J.t.z,0,-J.t.x);const ft=(e,t,o,n)=>{const s=q.nearestXZ(e,t);qa.push({x:e,y:ot(e,t),z:t,s:n,rot:Y()*j,d:s.dist,u:s.u,v:o})};for(const e of yt){if(e.bare)continue;const t=e===_o,o=e.near?3+Math.round(e.r/6):2+Math.round(e.r/10),n=Math.atan2(q.pointAt(q.nearestXZ(e.x,e.z).u).z-e.z,q.pointAt(q.nearestXZ(e.x,e.z).u).x-e.x),s=(p,l,c)=>{for(let f=0;f<30;f++){const C=e===Ye?n+Y.range(-1.9,1.9):Y()*j,V=Y.range(p,l),L=e.x+Math.cos(C)*e.r*V,$=e.z+Math.sin(C)*e.r*V;if(!t||Math.abs((L-re.x)*J.l.x+($-re.z)*J.l.z)>c)return[L,$]}return null};for(let p=0;p<o;p++){const l=s(.08,.7,14);l&&ft(l[0],l[1],Y.int(0,2),Y.range(.82,1.14))}for(let p=0,l=e.near?Y.int(2,4):1;p<l;p++){const c=s(.35,.82,9.5);if(c)for(let f=0,C=Y.int(2,3);f<C;f++)ft(c[0]+Y.range(-1.6,1.6),c[1]+Y.range(-1.6,1.6),3,Y.range(.75,1.3))}if(e.r>17){const p=s(.1,.45,16);p&&ft(p[0],p[1],4,Y.range(.8,1.2))}if(e.near&&!t){const p=s(.5,.8,9);p&&ft(p[0],p[1],5,Y.range(.8,1.15))}}{const e=re.clone().addScaledVector(J.l,-9.5).addScaledVector(J.t,-15);ft(e.x,e.z,5,1.05);for(const[t,o]of[[10.5,-21],[12.5,-19],[-11,-9],[-13.5,-11.5],[9.8,-7]]){const n=re.clone().addScaledVector(J.l,t).addScaledVector(J.t,o);ft(n.x,n.z,3,Y.range(.9,1.35))}}await a.yield();const ta=(e,t)=>ae(Qr,Zr,{...ie(),uFloor:{value:Rt},uDark:{value:S(e)},uLeaf:{value:S(t)}},{side:r.DoubleSide}),oa=(e,t,o,n,s,p,l)=>{const c=[],f=[],C=[];for(let R=0;R<=96;R++){const ee=Be(t,o,R/96),de=e(ee),Me=R/96*(o-t),Ve=F(0,.1,R/96)*(1-F(.9,1,R/96));if(c.push(de,s,ee,de,s+n*Ve,ee),f.push(Me,0,Me,1),R<96){const me=R*2;C.push(me,me+1,me+3,me,me+3,me+2)}}const L=new r.BufferGeometry;L.setAttribute("position",new r.Float32BufferAttribute(c,3)),L.setAttribute("aSV",new r.Float32BufferAttribute(f,2)),L.setIndex(C),L.computeBoundingSphere();const $=new r.Mesh(L,p);return $.name=l,g.add($),L},Lt=i.fork("woods"),aa=Lt.range(0,300),na=e=>.5*Ca*e*e+150+22*Math.sin(e*.006+aa)+10*Math.sin(e*.017+aa*2),La=x==="golden"||x==="dawn",qn=[oa(na,-560,640,La?25:42,T-.2,ta("#131f17","#3d5a2a"),"far-woods"),oa(e=>na(e)+34+10*Math.sin(e*.011),-600,700,La?33:52,T-.2,ta("#16241b","#35502a"),"far-woods"),oa(e=>$e(U(e,-300,400))-620-60*Math.sin(e*.004+aa),-200,900,20,T-.2,ta("#22321f","#4a6a30"),"far-woods")];for(let e=0;e<46;e++){const t=Lt.range(-520,600),o=na(t)+Lt.range(-10,26);ft(o,t,Lt.int(0,2),Lt.range(.9,1.3))}await a.yield();const Ia=ge.makeScatter({rng:i.fork("tsc"),points:qa,variants:Xe,farVariants:dt,farDistance:170,path:q,material:qt,heightAt:(e,t)=>Math.max(ot(e,t),T+.03),tint:.14,hue:.03,sink:.005,tilt:.03,groundShadow:M?void 0:{sunDir:K,strength:.42,stretch:2.2,size:1.1,color:"#1b2a3a"}});g.add(Ia.object),await a.yield();const Na=[];for(const e of[1,-1]){const t=re.clone().addScaledVector(J.l,e*10.6).addScaledVector(J.t,.6);t.y=ot(t.x,t.z)-.1;const o=ht(Y,{height:19.4+e*.7,fans:16,sides:9,segs:14,pleats:10,lean:[-J.l.x*e*5.6-J.t.x*1.4,-J.l.z*e*5.6-J.t.z*1.4]}),n=new r.Mesh(o,qt);n.position.copy(t),n.name="portal-palm",g.add(n),Na.push({mesh:n,crown:t.clone().add(new r.Vector3(-J.l.x*e*5.6-J.t.x*1.4,o.userData.height*.93,-J.l.z*e*5.6-J.t.z*1.4))}),await a.yield()}const ra=ge.deadTreeGeometry({rng:Y,height:7,detail:1}),at=N(.3805,9);at.y=ot(at.x,at.z)-.15;const sa=new r.Mesh(ra,qt);sa.position.copy(at),sa.name="leadwood-snag",g.add(sa);const po=at.clone();{const e=ra.attributes.position;let t=-1;for(let o=0;o<e.count;o++)e.getY(o)>t&&(t=e.getY(o),po.set(at.x+e.getX(o),at.y+t,at.z+e.getZ(o)))}await a.yield();const It=i.fork("lily"),ho={pad:"#3d7436",padLight:"#86a84a",rim:"#6a5a2a",heart:"#f0c648"},Nt=[];Nt.push(ge.lilyPadGeometry({rng:It,size:.6,...ho})),await a.yield(),Nt.push(ge.lilyPadGeometry({rng:It,size:.48,...ho})),await a.yield(),Nt.push(ge.lilyPadGeometry({rng:It,size:.58,flower:!0,petal:"#f1effa",petalTip:"#cfcbf5",...ho})),await a.yield(),Nt.push(ge.lilyPadGeometry({rng:It,size:.55,flower:!0,petal:"#cdc8f6",petalTip:"#9f99e8",...ho})),await a.yield();const Ka=ge.makeLilyPads({rng:It,path:q,uRange:[.19,Go+.03],radius:11,corridor:0,falloff:0,count:Math.round(430*Pa*(.6+.4*b)),waterY:T,spacing:.62,scale:[.62,1.15],material:qt,variants:Nt,shade:(e,t)=>Bn(e,t)>.15?.78:1,density:(e,t)=>Tn(e,t)>.3?1:0});g.add(Ka.object),await a.yield();const Ln=ge.makeWind({direction:[H.x,H.y],strength:1.3*X,speed:1.15,gustScale:.04,gustiness:.7}),In=new r.Color,Nn={ambient:1.1,leafAmbient:1.25,wrap:.5,backlight:.95,sheen:.7,detail:0},Ha=Yr(i.fork("sedge"));await a.yield();const vo=Xr(),Qe=i.fork("sg"),Ea=[],Ua={...ie(),uTime:P.uTime,uWind:P.uWind,uMap:{value:Ha},uFloor:{value:Rt},uRoot:{value:No.clone().multiplyScalar(.7)},uTip:{value:Io.clone().lerp(S("#d8c470"),.4)}},Kn=ae(Sn,Mn,Ua,{side:r.DoubleSide}),Hn=ae(Sn,Mn,Ua,{side:r.DoubleSide,transparent:!0,depthWrite:!1,premultipliedAlpha:!0,defines:{MIRROR:1}});let En=0;{const e=Go-.016,t=.975,o=10,n=Array.from({length:o},()=>({p:[],q:[],mp:[],mq:[]})),s=Math.round(14500*b*(.85+.15*G)),p=Math.round(15e3*b*(.85+.15*G)),l=new r.Vector3;for(let f=0;f<s+p;f++){(f&31)===0&&await a.yield();const C=f<s,V=Qe.range(e,t),L=C?Qe.range(-9.5,9.5):Qe.sign()*(9+53*Math.pow(Qe(),1.7)),$=tt(V);l.copy($.p).addScaledVector($.l,L);const R=l.x,ee=l.z,de=Qe()*j,Me=Qe.range(.55,1)*(C?1:1.25),Ve=Qe.range(.5,.95)*(C?1:1.12),me=Qe(),Te=Qe();if(ee<le+4&&st(R,ee)>-1.5||Aa(R,ee)>.55||ot(R,ee)>.04||Math.abs(so(R,ee)+te.wheelAt(ee))<34&&Te>.4)continue;const Wo=n[U(Math.floor((V-e)/(t-e)*o),0,o-1)],vn=U(.5+.9*u.n2(R*.021,ee*.021)+(me-.5)*.5,0,1);Wo.p.push(R,ee,de,Me),Wo.q.push(me,vn,Ve,0),C&&Te<.55&&(Wo.mp.push(R,ee,de,Me),Wo.mq.push(me,vn,Ve,0))}const c=(f,C,V,L)=>{const $=f.length/4;if(!$)return null;const R=new r.InstancedBufferGeometry;R.index=vo.index;for(const Te in vo.attributes)R.setAttribute(Te,vo.attributes[Te]);R.setAttribute("iP",new r.InstancedBufferAttribute(new Float32Array(f),4)),R.setAttribute("iQ",new r.InstancedBufferAttribute(new Float32Array(C),4)),R.instanceCount=$,L&&R.setDrawRange(0,6);let ee=1e9,de=-1e9,Me=1e9,Ve=-1e9;for(let Te=0;Te<$;Te++)ee=Math.min(ee,f[Te*4]),de=Math.max(de,f[Te*4]),Me=Math.min(Me,f[Te*4+1]),Ve=Math.max(Ve,f[Te*4+1]);R.boundingSphere=new r.Sphere(new r.Vector3((ee+de)/2,T,(Me+Ve)/2),Math.hypot((de-ee)/2+2,(Ve-Me)/2+2)+1);const me=new r.Mesh(R,V);return me.name=L?"sedge-mirror":"sedge",L&&(me.renderOrder=2),g.add(me),En+=$*(L?2:4),Ea.push({mesh:me,c:R.boundingSphere.center,r:R.boundingSphere.radius,reach:L?60:150}),R};for(const f of n)await a.yield(),c(f.p,f.q,Kn,!1),c(f.mp,f.mq,Hn,!0)}await a.yield();const Un=S("#a8975a"),On=()=>In.copy(Un),mo=[];for(const[e,t]of[_o,Ye].entries())mo.push(await ge.makeGrassAsync({rng:i.fork("ig"+e),bounds:[t.x-t.r,t.z-t.r,t.x+t.r,t.z+t.r],count:Math.round((e?2200:3600)*b),width:[.7,1.3],height:[.4,.8],cards:2,heightAt:ot,heightStep:2.5,groundColor:On,wind:Ln,map:qt.map,...e?{material:mo[0].material}:{materialOptions:Nn},flowers:0,chunks:1,density:(o,n)=>F(T+.25,T+.6,ot(o,n))},a.yield)),await a.yield();for(const e of mo)g.add(e.object);await a.yield();const Pe=i.fork("hippo"),Kt=[],ia=[],xt=[],Ht=[],la=[],Oa=[],We={surfA:[.283,.3,.335,.362],yawnA:[.29,.303,.338,.353],blowA:.2975,surfB:[.8,.818,.868,.89],yawnB:[.8,.818,.862,.878],blowB:.8265},go=(e,t,o,n,s=1.2)=>{la.push(e,t,o,Pe()),Oa.push(n,s,0,0)},bt=(e,t,o,n,s,p)=>{const l=Pe(),c=Pe.range(9,15);Kt.push(e,t,o,n),ia.push(l,c,s+10*p,Pe());const f=e+Math.sin(o)*1.1*n,C=t+Math.cos(o)*1.1*n;if(s===0)xt.push(f,C,10,l),Ht.push(0,c,.75,c*.6);else{const V=s===1?p?We.surfB[0]:We.surfA[0]:p?We.yawnB[0]:We.yawnA[0];xt.push(f,C,14,0),Ht.push(1,V,1.15,9),go(f,C,s===1?1.3:1.2,V+.006,1)}},yo=(e,t,o,n)=>Math.atan2(o-e,n-t),Ze=N(.3195,-8),zt=N(.3175,-12.6);{const e=N(.31);bt(Ze.x,Ze.z,yo(Ze.x,Ze.z,e.x,e.z)+.42,1.4,2,0),bt(zt.x,zt.z,yo(zt.x,zt.z,e.x,e.z)-.5,1.15,1,0);const t=[[Ze.x,Ze.z],[zt.x,zt.z]];for(let o=0,n=0;o<4&&n<200;n++){const s=Pe()*j,p=Math.sqrt(Pe())*(ve.r-2.2),l=ve.x+Math.cos(s)*p,c=ve.z+Math.sin(s)*p;q.nearestXZ(l,c).dist<10||t.some(f=>Math.hypot(f[0]-l,f[1]-c)<3.8)||(t.push([l,c]),bt(l,c,Pe()*j,Pe.range(.85,1.1),0,0),o++)}}const St=(()=>{if(v)return N(He,-10.5,19.5);const e=ne.x-Ae.x,t=ne.z-Ae.z,o=Math.hypot(e,t)||1;return new r.Vector3(Ae.x+e/o*5.6,0,Ae.z+t/o*5.6)})();{const e=N(.84);bt(Ae.x,Ae.z,yo(Ae.x,Ae.z,e.x,e.z)+(v?.42:-.42),1.4,2,1),bt(St.x,St.z,yo(St.x,St.z,e.x,e.z)+(v?-.5:.5),1.15,1,1);const t=[];for(let o=0,n=0;o<7&&n<200;n++){const s=Pe()*j,p=Math.sqrt(Pe())*(ne.r-4),l=ne.x+Math.cos(s)*p,c=ne.z+Math.sin(s)*p;t.some(f=>Math.hypot(f[0]-l,f[1]-c)<4)||Math.hypot(l-St.x,c-St.z)<4||(t.push([l,c]),bt(l,c,Pe()*j,Pe.range(.85,1.12),0,1),o++)}}const wo=(e,t,o)=>{const n=new r.InstancedBufferGeometry;n.index=e.index;for(const s in e.attributes)n.setAttribute(s,e.attributes[s]);for(const s in t)n.setAttribute(s,new r.InstancedBufferAttribute(new Float32Array(t[s]),4));return n.instanceCount=o,n.boundingSphere=new r.Sphere(new r.Vector3(0,0,-200),1e4),n},ca=(()=>{const e=new r.BufferGeometry;return e.setAttribute("position",new r.Float32BufferAttribute([-.5,0,0,.5,0,0,.5,1,0,-.5,1,0],3)),e.setIndex([0,1,2,0,2,3]),e})(),ja=(()=>{const e=new r.BufferGeometry;return e.setAttribute("position",new r.Float32BufferAttribute([-.5,0,-.5,.5,0,-.5,.5,0,.5,-.5,0,.5],3)),e.setIndex([0,2,1,0,3,2]),e})();await a.yield();const $a=Fr(),Et={uTime:P.uTime,uLive:{value:0},uKey:{value:new r.Vector4},uBlow:{value:new r.Vector2(1,1)}},ua=new r.Mesh(wo($a,{iA:Kt,iB:ia},Kt.length/4),ae(Vr,Tr,{...ie(),uHorizon:P.uHorizon,...Et},{side:r.DoubleSide,vertexColors:!0}));ua.name="hippos",ua.frustumCulled=!1,g.add(ua);const xo={transparent:!0,depthWrite:!1,premultipliedAlpha:!0,side:r.DoubleSide},bo=new r.Mesh(wo(ca,{iA:Kt,iB:ia},Kt.length/4),ae(Br,Dr,{...ie(),...Et,uSprayCol:te.uniforms.uSprayCol},xo));bo.name="hippo-blow",bo.frustumCulled=!1,bo.renderOrder=3,g.add(bo),await a.yield();const jn=()=>ae(Lr,Ir,{uSunDir:P.uSunDir,uSunCol:P.uSunCol,uSkyCol:P.uSkyCol,uHorizon:P.uHorizon,uWing:{value:new r.Vector4(0,0,0,0)},uPose:{value:new r.Vector2(0,0)}},{side:r.DoubleSide,vertexColors:!0}),da=zn({len:.8,span:1.02,chord:.44,bill:.1,body:"#2e1c12",belly:"#8a4a22",head:"#efebe0",wing:"#241710",tip:"#120c08",shoulder:"#9a5426",tail:"#efebe0",beak:"#e6b62e",leg:"#e0ae2a"});await a.yield();const Ya=zn({len:.3,span:.25,chord:.12,bill:.1,body:"#22262c",belly:"#ecece6",head:"#1c2026",wing:"#3a3e44",tip:"#101216",shoulder:"#d8d8d2",tail:"#deded8",beak:"#14161a",leg:"#333333"}),fa=(e,t,o)=>{const n=new r.Mesh(e,jn());return n.scale.setScalar(t),n.name=o,n.frustumCulled=!1,g.add(n),n},pa=fa(da,1.85,"fish-eagle-calling"),Mt=fa(da,1.6,"fish-eagle-stooping"),Ut=fa(Ya,3,"pied-kingfisher"),Xa=(()=>{const e=new fe.Geo;return e.blob(0,0,0,.05,.085,.2,S("#aeb6b8"),S("#e4e6e2"),5,4),e.fan([[0,0,-.19],[0,.09,-.3],[0,-.09,-.3]],S("#8a9294")),e.build()})(),zo=new r.Mesh(Xa,Mt.material);zo.position.set(0,-.36,.06),zo.visible=!1,Mt.add(zo);const Ot=qo.clone().setY(T+.5),So=Na[0].crown.clone().add(new r.Vector3(0,.9,0)),ze=(()=>{const e=tt(He),t=Ot,o=(n,s)=>({u:n,p:s});return[o(.77,N(.805,-40,40,26)),o(.805,t.clone().addScaledVector(e.l,-17).addScaledVector(e.t,-4).setY(9.5)),o(.825,t.clone().addScaledVector(e.l,-6).addScaledVector(e.t,-2.5).setY(3.4)),o(He,t),o(.847,t.clone().addScaledVector(e.l,4).addScaledVector(e.t,15).setY(4.2)),o(.88,t.clone().lerp(So,.5).setY(15)),o(.915,So.clone().addScaledVector(J.t,-7).setY(So.y+3.2)),o(.932,So)]})(),ha=(e,t)=>{const o=ze.length;if(e<=ze[0].u)return t.copy(ze[0].p);if(e>=ze[o-1].u)return t.copy(ze[o-1].p);let n=0;for(;n<o-2&&e>ze[n+1].u;)n++;const s=(e-ze[n].u)/(ze[n+1].u-ze[n].u),p=ze[Math.max(n-1,0)].p,l=ze[n].p,c=ze[n+1].p,f=ze[Math.min(n+2,o-1)].p,C=s*s,V=C*s,L=($,R,ee,de)=>.5*(2*R+(ee-$)*s+(2*$-5*R+4*ee-de)*C+(3*R-$-3*ee+de)*V);return t.set(L(p.x,l.x,c.x,f.x),L(p.y,l.y,c.y,f.y),L(p.z,l.z,c.z,f.z))},nt={dive0:.2345,hit:.2435,out:.2468},pt=N(.2575,2.5,0,T+4.6);xt.push(pt.x,pt.z,8,0,Ot.x,Ot.z,12,0),Ht.push(1,nt.hit,1.3,5,1,He,1.7,5.5),go(pt.x,pt.z,.85,nt.hit,1.3),go(Ot.x,Ot.z,1.6,He,1.5),await a.yield();const Ee=i.fork("flush"),Qa=.36,jt=100,$n=24,Yn=34,Za=new Float32Array(jt*3),Ja=new Float32Array(jt*4),en=new Float32Array(jt*4);for(let e=0;e<jt;e++){const t=e>=44,o=e<14?.4025+e*.0011:Ee.range(.392,.474),n=tt(o),s=e<14?e%2?1:-1:Ee.sign(),p=s*(t?Ee.range(7.4,9.4):Ee.range(6.6,9.4)),l=n.p.clone().addScaledVector(n.l,p),c=tt(Math.min(o+48/q.length,.6)),f=c.p.clone().addScaledVector(c.l,p+s*(t?7:3.5)).sub(l).setY(0).normalize();Za.set([l.x,T+(t?.1:.35),l.z],e*3),Ja.set([Ee(),Ee(),Ee(),s>0?Ee.range(.56,1):Ee.range(0,.44)],e*4),en.set([f.x,f.z,t?1:0,Math.max(0,(o-(t?Yn:$n)/q.length-Qa)*Je)+Ee()*.2],e*4)}const $t=Hr(jt);await a.yield(),$t.setAttribute("aStart",new r.InstancedBufferAttribute(Za,3)),$t.setAttribute("aRnd",new r.InstancedBufferAttribute(Ja,4)),$t.setAttribute("aDir",new r.InstancedBufferAttribute(en,4));const Mo=new r.Mesh($t,ae(Nr,Kr,{uTime:P.uTime,uT:{value:0},uSunDir:P.uSunDir,uSunCol:P.uSunCol,uSkyCol:P.uSkyCol},{side:r.DoubleSide,vertexColors:!0}));Mo.name="flush",Mo.frustumCulled=!1,g.add(Mo),await a.yield();const kt=new r.CatmullRomCurve3([new r.Vector3(Ke.x,T,Ke.z),N(.397,6.2,0,T),N(.412,-1.5,0,T),N(.427,-6.4,0,T),N(.443,-2.5,0,T),N(.461,4.5,0,T)],!1,"centripetal"),va=kt.getLength(),tn=ae(jr,$r,{...ie(),uHorizon:P.uHorizon,uTime:P.uTime,uSwim:{value:0}},{side:r.DoubleSide,vertexColors:!0}),Ct=new r.Mesh(Or(),tn);Ct.scale.setScalar(1.3),Ct.name="crocodile",Ct.frustumCulled=!1,g.add(Ct),await a.yield();{const e=kt.getPointAt(.07);go(e.x,e.z,1.2,.3585,1.3),xt.push(e.x,e.z,10,0),Ht.push(1,.3585,1.3,5)}const on=(()=>{const t=[],o=[],n=[],s=new r.Vector3,p=new r.Vector3;for(let c=0;c<=64;c++){kt.getPointAt(c/64,s),kt.getTangentAt(c/64,p);const f=p.z,C=-p.x;if(t.push(s.x-f*6,T+.035,s.z-C*6,s.x+f*6,T+.035,s.z+C*6),o.push(c/64*va,-1,c/64*va,1),c<64){const V=c*2;n.push(V,V+1,V+3,V,V+3,V+2)}}const l=new r.BufferGeometry;return l.setAttribute("position",new r.Float32BufferAttribute(t,3)),l.setAttribute("aSV",new r.Float32BufferAttribute(o,2)),l.setIndex(n),l.computeBoundingSphere(),l})(),ko=new r.Mesh(on,ae(Er,Ur,{...ie(),uTime:P.uTime,uHead:{value:0},uHalf:{value:6},uSkyCol:{value:se},uHorizon:P.uHorizon},{...xo,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-4}));ko.name="croc-wake",ko.renderOrder=1,g.add(ko);const Yt=new r.Mesh(wo(ja,{iR:xt,iS:Ht},xt.length/4),ae(Gr,Rr,{uTime:P.uTime,uU:{value:0},uSkyCol:{value:se},uHorizon:P.uHorizon,uSunDir:P.uSunDir,uSunCol:P.uSunCol},{...xo,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-4}));Yt.name="rings",Yt.frustumCulled=!1,Yt.renderOrder=1,g.add(Yt);const Xt=new r.Mesh(wo(ca,{iR:la,iS:Oa},la.length/4),ae(_r,qr,{...ie(),uU:{value:0},uSprayCol:te.uniforms.uSprayCol},xo));Xt.name="splashes",Xt.frustumCulled=!1,Xt.renderOrder=4,g.add(Xt),await a.yield();const Ue=fe.makeFauna(g,{light:fe.lightFrom(g),range:520}),Se=i.fork("fauna"),an=N(.552,-27),es=Ue.add(fe.makeHerd({rng:Se,species:"elephant",count:5,sizes:[1.2,1.12,1.05,.95,.6],center:[an.x,0,an.z],radius:10,y:0,path:q,clear:15,coat:"#58544f",belly:"#4a4642",legs:"#3e3a36",fill:.42,blobShadow:!1}),{always:!0});await a.yield();const ma=[N(.4185,10.6),N(.4245,12.4),N(.431,10.2)].map(e=>[e.x,T,e.z]);Ue.add(fe.makeWaders({rng:Se,species:"stork",positions:ma,count:3,size:1.45,level:T,depth:.3,heightAt:ot,facing:Math.atan2(-J.l.x,-J.l.z),scatterYaw:.7,active:.7,body:"#f4f2ea",belly:"#ffffff",wing:"#17171b",neckC:"#16161a",cap:"#16161a",beakC:"#d8301c",legC:"#2c2623"})),await a.yield();const Qt=[];for(let e=0;e<9;e++){const t=N(.205+e*.021+Se.range(-.006,.006),Se.sign()*Se.range(7.2,9.2));st(t.x,t.z)<1.5&&Math.hypot(t.x-Ze.x,t.z-Ze.z)>5&&Qt.push([t.x,T,t.z])}for(let e=0;e<6;e++){const t=Se()*j,o=[ne.x+Math.cos(t)*(ne.r+3),T,ne.z+Math.sin(t)*(ne.r+3)];q.nearestXZ(o[0],o[2]).dist>7&&Math.abs(so(o[0],o[2])+te.wheelAt(o[2]))>40&&Qt.push(o)}Qt.length&&Ue.add(fe.makeWaders({rng:Se,species:"egret",positions:Qt,count:Qt.length,size:1.05,level:T,depth:.22})),await a.yield();const Xn=[N(.618,-15.5),N(.624,-18)].map(e=>[e.x,T,e.z]);if(Ue.add(fe.makeWaders({rng:Se,species:"crane",positions:Xn,count:2,size:1.15,level:T,depth:.25,body:"#b9bcc0",belly:"#f4f4f0",neckC:"#f4f4f0",wing:"#3a3c42",cap:"#b02a22",beakC:"#c8b078"})),await a.yield(),Ue.add(fe.makeFlock({rng:Se,species:"gulls",count:16,size:1.25,speed:10,body:"#f8f8f2",belly:"#ffffff",wingC:"#f4f4ee",tip:"#ecece6",head:"#f8f8f2",beak:"#f0b428",spread:[16,2.5,26],cross:{path:q,u:.055,lead:62,height:-15,angle:58,side:1,span:320,duration:Je}})),await a.yield(),Ue.add(fe.makeFlock({rng:Se,species:"swifts",count:Math.round(26*(.6+.4*b)),center:[re.x,re.y+9,re.z],radius:17,height:5,body:"#2a2622",wingC:"#3a342c"})),await a.yield(),z==="august"&&Ue.add(fe.makeFlock({rng:Se,species:"parrots",count:18,size:.7,body:"#d83a4e",belly:"#f0607a",wingC:"#c82c44",tip:"#1e1a22",head:"#2a8a86",tailC:"#b02038",beak:"#1a1a1a",spread:[7,2.4,20],along:{path:q,side:-11,up:.5,lead:30,from:gt-.02,to:.86,drift:8}})),await a.yield(),Ue.add(fe.makeDragonflies({rng:Se,count:Math.round(26*(.5+.5*b)),size:2.1,path:q,uFrom:.2,uTo:Go,clear:2.6,spread:8,lift:[-2.2,.2]})),await a.yield(),W){const e=N(.357,-9.6);Ue.add(fe.makeHerd({rng:Se,species:"antelope",count:2,size:.95,center:[e.x,0,e.z],radius:3,y:0,path:q,clear:7.5,coat:"#5e4a36",belly:"#8a765c",legs:"#4a3a2a",pattern:"none",blobShadow:!1}))}await a.yield();const Zt=Fo.fxGroup();g.add(Zt.object),M?Zt.add(Fo.makeParticles({rng:i.fork("ff"),preset:"fireflies",count:Math.round(420*b),box:[70,9,70],follow:"xz",center:[0,T+3.4,0],time:P.uTime})):Zt.add(Fo.makeParticles({rng:i.fork("motes"),preset:"dust",count:Math.round(1500*b),box:[40,14,46],colors:[h.sun,"#fff4d8",h.papGold],intensity:x==="afternoon"?.75:1.1,opacity:.6,time:P.uTime})),await a.yield(),h.mist&&Zt.add(Fo.makeGroundFog({time:P.uTime,y:T+.05,height:2.1,layers:5,size:760,color:"#f0dcd4",opacity:.19,coverage:.55,scale:.011,wind:[H.x*.7,H.y*.7],sunDir:K,sunColor:h.sun,scatter:.5})),await a.yield();const nn=new r.PlaneGeometry(2,2),rn={uAmt:{value:0},uTime:P.uTime,uCloud:P.uCloud,uBox:P.uBox,uShade:P.uShade,uCol:{value:S(h.sun).lerp(S("#ffc45e"),.6)}},Qn="uniform float uAmt; varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy * step(.002, uAmt), 0., 1.); }",Zn=e=>De+`uniform float uAmt, uTime; uniform vec3 uCol; varying vec2 vUv;
      void main(){ vec2 p = vUv * vec2(3.4, 2.); float n = dfbm(p + vec2(uTime * 1.7, -uTime * .9)), s = dvn(vUv * vec2(60., 34.) + vec2(uTime * 23., uTime * 9.));
        float left = 1.25 - .95 * smoothstep(0., 1., vUv.x), a = uAmt * (.55 + .7 * n) * left * (1.1 - .35 * vUv.y);
        gl_FragColor = vec4(uCol * ${e?"a * .16 + uCol * uAmt * smoothstep(.74, .95, s) * .22 * left":"a * 1.5"}, 1.); }`,Jn=e=>new r.ShaderMaterial({transparent:!0,depthTest:!1,depthWrite:!1,uniforms:rn,vertexShader:Qn,fragmentShader:Zn(e),blending:r.CustomBlending,blendEquation:r.AddEquation,blendSrc:e?r.OneFactor:r.DstColorFactor,blendDst:r.OneFactor,blendSrcAlpha:r.ZeroFactor,blendDstAlpha:r.OneFactor}),ga=new r.Group;if(ga.name="gold-veil",v)for(const e of[0,1]){const t=new r.Mesh(nn,Jn(e));t.frustumCulled=!1,t.renderOrder=40+e,ga.add(t)}g.add(ga);const At=Bt(-76),Co=Bt(6);await a.yield();const sn=new r.Vector3(0,1,0),er=new r.Vector3,tr=Ze.clone().setY(T+.9),or=po.clone().add(new r.Vector3(0,-.6,0)),ar=new r.Vector3(ma[1][0],T+2.5,ma[1][2]),nr=Ae.clone().setY(T+.9),ln=gt-.07,cn=[{at:tr,from:.268,to:.347,weight:.6},{at:or,from:.338,to:.392,weight:.5},{at:ar,from:.395,to:.452,weight:.3},{at:(e,t)=>{const o=U(t,0,1),n=q.pointAt(o),s=q.tangentAt(o),p=v?.5+.5*(1-F(At-.03,At+.01,o)*(1-F(Co,Co+.03,o))):1,l=20+14*(1-F(ln+.02,gt+.05,o))+12*F(.795,.88,o),c=Be(30,l,(p-.5)*2),f=22*p;return er.set(n.x+(s.z*f+s.x*c),T+2.6,n.z+(-s.x*f+s.z*c))},from:ln,to:v?.815:.885,weight:.7,fade:.2},{at:nr,from:.795,to:.885,weight:v?.62:.5}],Jt={shift:0,rams:0,cut:0},rr=Math.tan(31*Math.PI/180)*(16/9),Ao=new r.Vector3,un=new r.Vector3,Pt=new r.Vector3,Wt=new r.Vector3,rt={},dn=(e,t,o)=>{q.pointAt(e,Wt),q.posAtDist(e*q.length+24,Ao).sub(Wt).normalize();for(const l of cn){const c=hr(e,l.from??0,l.to??1,l.fade??.3)*(l.weight??.5);c<=.001||(Pt.copy(typeof l.at=="function"?l.at(0,e):l.at).sub(Wt).normalize(),Ao.multiplyScalar(1-c).addScaledVector(Pt,c).normalize())}un.crossVectors(Ao,sn).normalize();let n=0,s=0,p=0;for(let l=0;l<te.nearCount;l++){if(te.nearAt(l,t+be.herd.travel*e,rt),rt.inside<3)continue;Pt.set(rt.x-Wt.x,T+.9-Wt.y,rt.z-Wt.z);const c=Pt.dot(Ao);if(c<2)continue;const f=Pt.dot(un)/c/rr,C=(rt.ram?1.95:1.3)*rt.sc/(Pt.length()*1.2);rt.ram&&C>.088&&f>-.37&&f<.05?n++:C>.07&&f>-.62&&f<.3&&s++,f<-.82&&f>-1.22&&C>.075&&p++,o&&Math.abs(f)<1.25&&C>.05&&o.push([+f.toFixed(2),+C.toFixed(3),rt.ram?1:0])}return{good:n,fair:s,cut:p}};if(!v){const e=te.zStartNow();let t=-1e9;for(let o=0;o<9;o+=.25){const n=dn(.7,e+o),s=Math.min(n.good,3)*2+Math.min(n.fair,3)*.4-n.cut*2.5-o*.01;s>t&&(t=s,Jt.shift=o,Jt.rams=n.good,Jt.cut=n.cut)}te.setRun({zStart:e+Jt.shift})}const eo=(e,t)=>F(t[0],t[1],e)*(1-F(t[2],t[3],e)),sr=sn,Ft=new r.Vector3,ya=new r.Vector3,Po=new r.Vector3,fn=new r.Matrix4,pn=new r.Vector3,hn=new r.Vector3,Le=new r.Vector3,Fe=new r.Vector3,wa=new r.Vector3,to=(e,t,o,n=0)=>{Po.copy(o).normalize(),Ft.crossVectors(sr,Po),Ft.lengthSq()<1e-6&&Ft.set(1,0,0),Ft.normalize(),ya.crossVectors(Po,Ft),fn.makeBasis(Ft,ya,Po),e.quaternion.setFromRotationMatrix(fn),n&&e.rotateZ(n),e.position.copy(t)},ir=N(.368).sub(po).setY(0).normalize(),lr=ir.clone().multiplyScalar(.5).add(new r.Vector3(0,.87,0)),cr=J.t.clone().multiplyScalar(-.5).add(new r.Vector3(0,.87,0)),ur=pt.clone().setY(T),xa=J.t.clone();{const e=tt(.262);xa.copy(e.t).multiplyScalar(.85).addScaledVector(e.l,.34).add(new r.Vector3(0,.26,0)).normalize()}const dr=tt(.2575).l.clone().multiplyScalar(-1),fr=(e,t,o,n)=>{P.uTime.value=t,P.uCloud.value.y=H.x*t*3.2*X,P.uCloud.value.z=H.y*t*3.2*X;const s=o.matrixWorld.elements,p=s[12],l=s[14];wa.set(-s[8],-s[9],-s[10]),P.uSlip.value.set(p-wa.x*4,s[13],l-wa.z*4,P.uSlip.value.w),P.uHigh.value=F(7.5,13,s[13]),te.setProgress(n),te.update(e,t,o),B.update(e,t,o),_.update(e,t,o),Ia.update(e,t,o),Ka.update(e,t,o);for(const c of mo)c.update(e,t,o);for(const c of Ea)c.mesh.visible=Math.hypot(c.c.x-p,c.c.z-l)<c.r+c.reach;Ue.update(e,t,o,n),Zt.update(e,t,o),Et.uLive.value=F(0,.02,n),Et.uKey.value.set(eo(n,We.surfA),eo(n,We.yawnA),eo(n,We.surfB),eo(n,We.yawnB)),Et.uBlow.value.set(n<We.blowA?1:U((n-We.blowA)*Je/2.4,0,1),n<We.blowB?1:U((n-We.blowB)*Je/2.4,0,1)),Yt.material.uniforms.uU.value=n,Xt.material.uniforms.uU.value=n;{const c=eo(n,[.33,.345,.39,.4]),f=pa.material.uniforms;to(pa,po,lr),pa.position.y+=.6,f.uWing.value.set(.05+.1*c,0,1-.18*c,0),f.uPose.value.set(c*(.75+.35*Math.sin(t*8.5)),-1)}{const c=Mt.material.uniforms,f=.0016;ha(n-f,pn),ha(n+f,hn),ha(n,Le);const C=F(.922,.934,n),V=F(.81,.831,n)*(1-F(.837,.847,n)),L=F(.837,.851,n)*(1-C),$=1-Math.max(V,L,C);Fe.subVectors(hn,pn),Fe.lengthSq()<1e-8&&Fe.copy(J.t),Fe.normalize(),V>0&&(Fe.y=Be(Fe.y,.28,V*F(.825,.835,n))),Fe.lerp(cr,C),to(Mt,Le,Fe,$*.25*Math.sin(t*.6)),C>0&&(Mt.position.y+=.3*C);const R=C*(1-F(.95,.975,n));c.uWing.value.set(.12*$+.3*V+.1*L+.5*R,.07*$+.16*V+.72*L+.26*R,C*(1-.62*R),t*(L>.3?17:6.5)),c.uPose.value.set(C*.25,1.25*V-1*C+.25*L),zo.visible=n>He&&n<.99,Mt.visible=n>.755}{const c=Ut.material.uniforms,f=U((n-nt.dive0)/(nt.hit-nt.dive0),0,1),C=U((n-nt.out)/.05,0,1);n<nt.hit?(Le.copy(pt),Le.y=Be(pt.y+.12*Math.sin(t*5.2),T-.1,f*f),Le.x+=.1*Math.sin(t*3.1)*(1-f),Fe.copy(dr).multiplyScalar(1-f).add(ya.set(0,.75-1.9*f,0)),to(Ut,Le,Fe),c.uWing.value.set(.15,1.05*(1-f),.9*F(.1,.5,f),t*52),c.uPose.value.set(-.9*(1-f),0),Ut.visible=!0):(Le.copy(ur).addScaledVector(xa,C*30),Le.y=T+.3+C*7.5*(.7+.3*C),to(Ut,Le,xa),c.uWing.value.set(.1,.95,0,t*44),c.uPose.value.set(0,0),Ut.visible=n>nt.out&&C<1)}Mo.material.uniforms.uT.value=(n-Qa)*Je;{const c=F(.354,.466,n)*.5+.5*U((n-.361)/.105,0,1),f=F(.356,.371,n);kt.getPointAt(U(c,0,.999),Le),kt.getTangentAt(U(c,.001,.999),Fe),to(Ct,Le,Fe),Ct.position.y=T+.03+(1-f)*(Ke.h*.75)-.09*f,tn.uniforms.uSwim.value=f,ko.material.uniforms.uHead.value=c*va}if(v){const c=F(At-.012,At+.004,n)*(.1+.9*(1-F(At+.006,At+.034,n)))*(1-F(Co-.02,Co+.01,n));rn.uAmt.value=c}};return await B.prewarm?.(a.renderer,null,g),{scene:g,path:q,duration:Je,pace:e=>1.1-.2*(1-F(.04,.14,e))-.27*F(gt-.04,gt+.03,e)*(1-F(.8,.88,e)),_probe:e=>{const t=[],o=dn(e??.7,te.zStartNow(),t);return{...Jt,u:e??.7,...o,list:t.sort((n,s)=>n[0]-s[0])}},camera:{fov:62,near:.4,far:4600,lookAhead:24,sway:.8,bank:.8},pois:cn,portal:{shape:"circle",radius:be.portalSeat.radius||7,color:M?"#cfe0ff":"#fff0c8",glow:1.2,revealDistance:420},post:{exposure:h.exposure,bloom:{strength:h.bloom,radius:.6,threshold:.92},grade:{saturation:h.sat,contrast:h.contrast??1.06,tint:h.tint,shadowTint:h.shadowTint,vignette:.3,grain:.02}},ride:"great-bird",update(e,t,o,n){fr(e,t,o,n)},dispose(){B.dispose?.(),te.dispose?.(),lt.dispose(),ct.dispose(),Va.dispose(),Ha.dispose();for(const e of[...Xe,...dt,...qn,ut.clumpA,ut.clumpB,ut.card,ca,ja,$a,vo,on,$t,da,Ya,Xa,ra,nn])e.dispose?.()}}}};export{as as default};
