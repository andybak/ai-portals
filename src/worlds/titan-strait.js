import*as u from"three";import{makePath as no,clamp as ie,lerp as P,smoothstep as p}from"../kit/core.js";import{makeSky as so}from"../kit/sky.js";import{buildHero as M0,SEA_GLSL as be,SAND_GLSL as pt,SHADE_GLSL as k0}from"../parts/titan-strait.js";const Ue=["#B4492C","#EFE3C8","#7CCBB8","#1F6F74","#22262C","#9CC3DA","#E9A66B"],io=.04,S0=-6,Kt=-12,ro=10,A0=.364,Be=[-.1,.995],lo=29.5,Y=60,L=[14,338+Y],T=[Math.sin(15*Math.PI/180),Math.cos(15*Math.PI/180)],mo=12.4,Ot=(()=>{const A=[[0,86],[.14,102],[.21,119.6],[.29,149],[.39,193],[.5,223],[.578,254],[.62,257.5],[.7,262.5],[.76,272],[1,300]],G=400,B=new Float32Array(G+1),ye=new Float32Array(G+1);for(let O=0,Q=0;O<=G;O++){const I=O/G;for(;Q<A.length-2&&I>A[Q+1][0];)Q++;B[O]=A[Q][1]+(A[Q+1][1]-A[Q][1])*(I-A[Q][0])/(A[Q+1][0]-A[Q][0])}for(let O=0;O<=G;O++){let Q=0,I=0;for(let C=-9;C<=9;C++){const xe=Math.min(G,Math.max(0,O+C));Q+=B[xe],I++}ye[O]=Q/I}return ye})(),He=A=>{const G=Math.min(1,Math.max(0,A))*400,B=Math.min(399,Math.floor(G));return Ot[B]+(Ot[B+1]-Ot[B])*(G-B)},oe=`
float h12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(h12(i), h12(i+vec2(1.,0.)), f.x), mix(h12(i+vec2(0.,1.)), h12(i+vec2(1.,1.)), f.x), f.y); }
float fbm(vec2 p){ float a = .5, s = 0.; for(int i=0;i<4;i++){ s += a*vn(p); p = p*2.03 + 17.1; a *= .5; } return s; }
`,mt=`
uniform vec3 uSun, uSunA, uSkyA, uBounceA;
vec3 litAbove(vec3 alb, vec3 N, float sh){
  float ndl = max(dot(N, uSun), 0.);
  return alb * (uSunA * ndl * sh + uSkyA * (.55 + .45 * N.y) + uBounceA * (.5 - .5 * N.y));
}
`;var go={id:"titan-strait",name:"The Titan's Strait",category:"prehistoric",weirdness:.25,media:["air","water"],async build(A){const G=A.rng,B=A.noise,ye=A.vary||{},O=ie(A.quality?.detail??1,.5,1),Q=ie(ye.density??1,.7,1.3),I=new u.Scene,C=(e,t=1)=>new u.Color(e).multiplyScalar(t),xe=G.fork("visit"),$t=xe(),W0=xe(),P0=xe(),Gt=xe(),Ut=$t<.46?"calm":$t<.74?"chop":"ebb",gt=ye.hour||"any",Ht=(W0*2+P0)%1;let Me=Ht<.34?"clear":Ht<.67?"dust":"low";gt==="golden"||gt==="dawn"?Me="low":gt==="day"&&Me==="low"&&(Me="clear");const Z=Me==="dust"?1:0,wt=Me==="low",ve={clear:["#4F86C4","#9CC3DA","#DFE6DF","#D3DEDD"],dust:["#6A8FB4","#B2C5CD","#EBD8B8","#DFD3BF"],low:["#4878B8","#93B6D6","#E6E0CC","#D7DAD0"]}[Me],Ze=!!ye.rare,ke=Gt<.5?"one":Gt<.76?"two":"shoal",C0=Ut==="chop"?1:0,z0=Ut==="ebb"?1:0,T0=wt?28:38,Zt=130*Math.PI/180,bt=T0*Math.PI/180,de=new u.Vector3(Math.sin(Zt)*Math.cos(bt),Math.sin(bt),Math.cos(Zt)*Math.cos(bt)),B0=L[0]+T[0]*60,_0=L[1]+T[1]*60,ce=no([[0,21.5,34],[-2.5,20.8,42],[-10.5,18,52],[-21.5,14.5,61],[-31,11.8,73],[-31,9.2,89],[-15,6.6,106],[0,5,122],[-1.2,4.9,138],[-7,5.2,150],[-15.5,3.8,163],[-20,3,175],[-26.5,4.6,186],[-28,6.6,198],[-21,6.3,211],[-9,5.5,221],[-1.5,5.2,228],[4.2,5.4,238],[5.8,5,250],[4.4,4.6,267],[3.6,4.2,281],[3,3.8,297],[0,4.3,314],[-3,5.2,332],[-3.6,6.2,350],[.5,6.7,366],[7.2,6.9,383],[L[0],7,L[1]],[L[0]+T[0]*20,8.5,L[1]+T[1]*20],[L[0]+T[0]*40,9,L[1]+T[1]*40],[B0,9,_0]]),he=e=>{const t=Math.max(0,(126-e)/21);return S0-18*(1-p(121,187,e))+4.4*t*t-18*p(290+Y,350+Y,e)},Xt=e=>ro-9*p(318,338,e)*(1-p(372,396,e))-20*p(285+Y,345+Y,e)-18*p(98,110,e)*(1-p(137,150,e)),_e=397.637,yt=.69*_e,xt=4.7,Mt=11.7,F0=xt+Mt,le=e=>{let t=ie(e,0,1)*ce.length;return t-=xt*p(40,112,t)+Mt*p(155,250,t),t<=yt?t/_e:.69+.31*(t-yt)/(ce.length-F0-yt)},fe=e=>(e*_e+xt*p(38,108,e*_e)+Mt*p(150,234,e*_e))/ce.length,kt=so({rng:G.fork("sky"),preset:"day",sunDirection:de,zenith:ve[0],mid:ve[1],horizon:ve[2],ground:"#8FB9B4",horizonPow:18,midPow:.75,scatter:.02,sunSize:.9,sunIntensity:9,sunGlow:.3,clouds:{coverage:Z?.34:.3,scale:.55,opacity:.9,softness:.3,haze:.3,wind:[.006,.003],lit:"#fff9ee",shade:"#a9b9cf"},clouds2:{coverage:Z?.36:.26,stretch:1,opacity:.6,scale:.8,haze:.4,wind:[.004,.002],lit:"#ffffff",shade:"#c9d6e2"}});I.add(kt.object);const N0=C(ve[3]);I.fog=new u.FogExp2(N0,Z?.0015:9e-4),await A.yield();const Xe=wt?1:0,ae={uSun:{value:de},uSunA:{value:new u.Color(.84+.05*Xe-.05*Z,.72-.03*Xe-.03*Z,.57-.1*Xe-.01*Z)},uSkyA:{value:new u.Color(.2+.05*Z,.3+.02*Z,.44+.03*Xe-.04*Z)},uBounceA:{value:new u.Color(.11,.1,.07)},uTime:{value:0}},ee=()=>u.UniformsUtils.clone(u.UniformsLib.fog),St=(e,t)=>{const a=e*Be[0]+t*Be[1],o=e*Be[1]-t*Be[0],n=B.fbm2(e*.021+3.1,t*.021-7.7,3),i=B.n2(e*.09,t*.09);let l=lo-A0*(a+3)+i*.25+4.6*Math.exp(-(Math.pow((e-13.5)/6,2)+Math.pow((t-22)/9,2)))+1.2*Math.exp(-(Math.pow((e+17.5)/6,2)+Math.pow((t-21)/8,2)));const h=23.5+n*5+p(22,85,o)*50;a>h&&(l-=(a-h)*(.8+.25*i)),a<-3&&(l-=(-3-a)*2.4);const v=-36+n*7,c=150+n*14;return o<v&&(l-=(v-o)*1.9),o>c&&(l-=(o-c)*1.3),l},pe=e=>-36*p(63,96,e),Jt=(e,t)=>{const a=e-L[0],o=t-L[1],n=a*T[0]+o*T[1],i=a*T[1]-o*T[0],l=B.fbm2(e*.024-11.3,t*.024+5.9,3),h=B.n2(e*.11+9,t*.11);let v=18.5-.035*n+.05*i+l*4.5+h*.4+2.2*B.n2(e*.045+3,t*.045-8);const c=g=>2.7*Math.min(g,3.4+h)+.22*ie(g-3.4-h,0,5.5)+2.3*Math.max(g-8.9-h,0),f=-5+l*6+Math.max(0,i)*.1,s=150+l*12;n<f&&(v-=c(f-n)),n>s&&(v-=(n-s)*1.6);const r=-(22+16*p(10,60,n)+46*p(46,84,n))+l*4,d=84+l*10;return i<r&&(v-=c(r-i)*.6),i>d&&(v-=c(i-d)*.7),v},At=(e,t,a=0,o=5.5)=>{const n=e-L[0],i=t-L[1],l=n*T[0]+i*T[1],h=n*T[1]-i*T[0],v=10.2+B.n2(e*.11+9,t*.11)*.9+3*p(-8,4,-l)+a;return Math.min(Jt(e,t),(Math.abs(h-pe(l))-v)*o-2.2)},j={x:22.5,z:353,sn:Math.sin(.3),cs:Math.cos(.3),hl:15.5,hw:8},Wt=(e,t)=>[(e-j.x)*j.sn+(t-j.z)*j.cs,(e-j.x)*j.cs-(t-j.z)*j.sn],Qt=(e,t)=>{const a=Math.cbrt(Math.pow(Math.abs(e/j.hl),3)+Math.pow(Math.abs(t/j.hw),3));return a+(.1*Math.sin(e*.45+1)+.08*Math.sin(t*.9+2)+.05*Math.sin((e+t)*1.3))*(1-p(.92,1.12,a))},Yt=(e,t)=>{if(Math.abs(e-j.x)>30||Math.abs(t-j.z)>30)return-99;const[a,o]=Wt(e,t),n=-1.5+6.2*ie(o/j.hw*.5+.5,0,1)+.9*ie(a/j.hl,-1,1)+.5*B.n2(e*.09+5,t*.09);return Math.min(n,(1-Qt(a,o))*34)},R0=(e,t)=>{if(Math.abs(e-j.x)>60||Math.abs(t-j.z)>60)return-99;const[a,o]=Wt(e,t);return Math.min((1-Qt(a,o))*1.6,.5)-2},Je=(e,t)=>Math.max(St(e,t),At(e,t),Yt(e,t)),q0=(e,t)=>{const a=B.fbm2(e*.02+40,t*.02+13,3),o=Xt(t);let n=-2.6+a*1.5+z0*2.5*p(o+5,o+22,e)*(.75+.5*B.n2(e*.045,t*.045));const i=p(96,108,t)*(1-p(139,153,t))*p(o-1,o+4,e)*(1-p(o+15,o+30,e));n=P(n,Math.max(n,-1.25+.3*B.n2(e*.12,t*.12)),i);const l=-4.2+a*1.3+p(-250,-310,e)*5.2,h=p(42,66,t+a*6),c=(o+ie(8*B.n2(t*.021+3.3,2.2)+5*B.n2(t*.062,e*.02+5.1),-4,13)+7-e-2.6*B.n2(e*.09+7,t*.09))/31,f=p(96,108,t)*(1-p(139,153,t)),s=P(.4*p(0,.62,c)+.6*p(.42,1,c),p(o+2,o-9,e),f)*h,r=p(-92,-78,e);return P(l,P(n,Kt,s),r)},D0=(e,t)=>{const a=e-L[0],o=t-L[1],n=a*T[0]+o*T[1],i=a*T[1]-o*T[0];return p(-34,-6,n)*(1-p(13,22,Math.abs(i-pe(n))))},I0=e=>e>=0?Math.min(e,.5)-3.4:-3.4+e*.15,Fe=(e,t)=>Math.max(P(q0(e,t),-6.2,D0(e,t)),I0(Math.max(St(e,t),At(e,t,1.8,8))),R0(e,t)),Qe=(e,t,a)=>{let o=0;for(let n=1;n<=9;n++){const i=n*n*.55+1.2,l=e+de.x*i,h=t+de.y*i,v=a+de.z*i;if(h>31)break;const c=Je(l,v)-h;if(c>0&&(o=Math.max(o,Math.min(1,c/(.6+i*.06))),o>=1))break}return o},j0=(e,t)=>e>-45&&e<190&&t>-50&&t<135||e>-45&&e<200&&t>325&&t<540+Y,K=await M0(A,{palette:Ue,detail:O,stage:!1,floorY:Kt,sunDir:de,sharks:5,momentShift:io});K.object.position.set(he(He(0)),0,He(0)),I.add(K.object),ke==="shoal"&&(K.parts.sharks.visible=!1,K.parts.sharkShadows.visible=!1);const ne=K.uniforms,e0=e=>{e.uTintB.value.set("#2C9DB4"),e.uTintA.value.set("#7FD2C0"),wt&&(e.uSunCol.value.setRGB(.9,.71,.5),e.uSkyCol.value.setRGB(.4,.52,.7),e.uTintA.value.set("#74C6BE"),e.uTintB.value.set("#2A93B0")),Z&&(e.uSunCol.value.setRGB(.76,.67,.54),e.uSkyCol.value.setRGB(.47,.55,.62),e.uTintA.value.set("#86CDB2"),e.uTintB.value.set("#44A596"))};e0(ne),await A.yield();let X=null;(Ze||ke==="two")&&(X=await M0(A,{palette:Ue,detail:O,stage:!1,floorY:Kt,sunDir:de,sharks:5}),X.parts.sharks.visible=!1,X.parts.sharkShadows.visible=!1,e0(X.uniforms),I.add(X.object),await A.yield());const Ne=[],Re=[];for(let e=-340;e<-96;e+=20)Ne.push(e);for(let e=-96;e<=150;e+=2.5)Ne.push(e);for(let e=164;e<=300;e+=17)Ne.push(e);for(let e=-200;e<-44;e+=26)Re.push(e);for(let e=-44;e<=452+Y;e+=4)Re.push(e);for(let e=470+Y;e<=900+Y;e+=21.5)Re.push(e);const Se=Ne.length,Pt=Re.length,Ct=Se*Pt,Ye=new Float32Array(Ct*3),et=new Float32Array(Ct*3),tt=new Float32Array(Ct*3),zt=[];for(let e=0;e<Pt;e++){for(let t=0;t<Se;t++){const a=e*Se+t,o=Ne[t],n=Re[e],i=Fe(o,n);Ye[a*3]=o,Ye[a*3+1]=i,Ye[a*3+2]=n,et[a*3]=o,et[a*3+1]=0,et[a*3+2]=n;const l=j0(o,n);tt[a*3]=i,tt[a*3+1]=l?Qe(o,Math.max(i,0,Math.min(Je(o,n),30))+.2,n):0,tt[a*3+2]=l?ie((Je(o,n)+7)/5,0,1):0}e%4===3&&await A.yield()}for(let e=0;e<Pt-1;e++)for(let t=0;t<Se-1;t++){const a=e*Se+t,o=a+1,n=a+Se,i=n+1;zt.push(a,n,o,o,n,i)}const Ae=new u.BufferGeometry;Ae.setAttribute("position",new u.BufferAttribute(Ye,3)),Ae.setAttribute("aAux",new u.BufferAttribute(tt,3)),Ae.setIndex(zt),Ae.computeBoundingSphere();const qe=new u.BufferGeometry;qe.setAttribute("position",new u.BufferAttribute(et,3)),qe.setAttribute("aAux",Ae.attributes.aAux),qe.setIndex(zt),qe.computeBoundingSphere(),await A.yield();const L0=new u.ShaderMaterial({fog:!0,uniforms:{...ee(),...ne,uSunW:ae.uSun},vertexShader:`attribute vec3 aAux; varying vec3 vW; varying float vSh;
#include <fog_pars_vertex>
void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vSh = aAux.y; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,fragmentShader:`
uniform vec3 uSkyCol, uSunCol, uSunRefr, uSunW; uniform float uShade;
varying vec3 vW; varying float vSh;
#include <fog_pars_fragment>
${oe}
${be}
${pt}
void main(){
  float rip; float dist = length(cameraPosition - vW);
  vec3 a = sandCol(vW.xz, dist, rip);
  float wet = smoothstep(.0, .9, -vW.y);                      // under water
  float nearS = 1. - smoothstep(18., 55., dist);
  float ca = caustic(vW.xz, uTime) * wet * (1. - .6 * smoothstep(110., 260., dist)) * 1.25;
  // shell hash on the banks: crisp-edged drifts of broken shell, pale pieces with dark gaps between them (never a soft stain)
  float bankK = smoothstep(-7., -4.5, vW.y);
  float hn = fbm(vW.xz * .17 + 71.) + (vn(vW.xz * 1.5) - .5) * .12 + (vn(vW.xz * 5.3) - .5) * .06;
  float hash = smoothstep(.612, .628, hn) * bankK;
  float bits = vn(vW.xz * 6.1 + 13.) , gaps = 1. - smoothstep(.26, .34, vn(vW.xz * 8.3 + 5.));
  float hk = 1. - smoothstep(20., 60., dist);
  vec3 shellC = mix(a * vec3(1.03, 1.02, 1.0), mix(a * 1.22 + .03, a * vec3(.50, .47, .42), gaps), hk * (.35 + .65 * smoothstep(.35, .6, bits)));
  a = mix(a, shellC, hash);
  // dry sand left by the tide: paler, ribbed, darker where still damp
  float dry = smoothstep(.05, .5, vW.y);
  a *= mix(1., 1.06, dry) * mix(1., .72, (1. - dry) * (1. - wet));
  float cs = smoothstep(.50, .70, fbm(vW.xz * .0058 + vec2(uTime * .0035, uTime * .0022) + 3.7));      // cloud shadows drifting down the strait
  float sun = (1. - vSh * .96) * mix(uSunW.y * 1.15, uSunRefr.y, wet) * (1. - .50 * cs);
  float lens = sin(vW.x * .52 + vW.z * .36 + fbm(vW.xz * .045) * 5. - uTime * 1.25) + .5 * sin(vW.x * -.21 + vW.z * .47 - uTime * .8 + 2.);
  sun *= 1. + .12 * lens * wet;
  vec3 L = uSunCol * sun * (1. + (.20 + .06 * nearS + .2 * dry + .14 * (1. - smoothstep(1., 5., -vW.y))) * rip) * (.90 + .62 * ca * (1. - .7 * cs)) + uSkyCol * uShade * (1. - .12 * vSh) * (1. + .05 * rip);
  vec3 col = seaTint(a * L, -vW.y, vW);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`}),t0=new u.Mesh(Ae,L0);t0.renderOrder=0,I.add(t0),await A.yield();const o0=new u.Vector3,Tt=new u.Vector3(0,0,-9999),a0=new u.Vector4(0,0,0,1),V0=new u.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,uniforms:{...ee(),uTime:ae.uTime,uZen:{value:C(ve[0])},uPale:{value:C(ve[1])},uHor:{value:C(ve[2])},uFar:{value:C(Ue[3],1)},uShal:{value:C("#63BFAF")},uChop:{value:C0},uHead:{value:o0},uHead2:{value:Tt},uLift:ne.uLift,uHero:{value:a0},uSunW:ae.uSun,uFoamC:{value:new u.Color(1.18,1.16,1.1)},uCleft:{value:new u.Vector4(L[0],L[1],T[0],T[1])},uWallLit:{value:C("#B9B09C",.62)},uWallSh:{value:C("#5C6B78",.5)}},vertexShader:`attribute vec3 aAux; varying vec3 vW; varying vec3 vAux;
#include <fog_pars_vertex>
void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vAux = aAux; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,fragmentShader:`
uniform vec3 uZen, uPale, uHor, uFar, uShal, uHead, uHead2, uSunW, uFoamC, uWallLit, uWallSh; uniform vec4 uHero, uCleft; uniform float uTime, uChop, uLift;
varying vec3 vW; varying vec3 vAux;
#include <fog_pars_fragment>
${oe}
float swell(vec2 p){ float t = uTime;
  return sin(p.x * .21 + p.y * .13 + t * .55) * .06 + sin(p.x * -.11 + p.y * .29 + t * .43 + 1.7) * .05 + sin(p.x * .53 - p.y * .47 + t * .9) * .015; }
void main(){
  float h = vAux.x, sh = vAux.y;
  if (h > .12) discard;
  vec2 p = vW.xz; vec3 V = cameraPosition - vW; float dist = max(length(V), 1e-3); V /= dist;
  float e = .35;
  float hx = swell(p + vec2(e, 0.)) - swell(p - vec2(e, 0.)), hz = swell(p + vec2(0., e)) - swell(p - vec2(0., e));
  float nearK = 1. - smoothstep(25., 110., dist);
  // wind ripples: a fine shiver everywhere, a real chop on some days
  vec2 q = p * 1.35 + vec2(uTime * .42, uTime * .31), q2 = p * 3.1 - vec2(uTime * .6, -uTime * .45);
  float c1 = vn(q) - .5, c2 = vn(q2) - .5;
  vec2 rp = vec2(vn(q + vec2(.3, 0.)) - vn(q - vec2(.3, 0.)), vn(q + vec2(0., .3)) - vn(q - vec2(0., .3)));
  float chopK = (.05 + .5 * uChop) * nearK;
  vec3 N = normalize(vec3(-hx / (2. * e) - rp.x * chopK, 1., -hz / (2. * e) - rp.y * chopK));
  float nv = clamp(dot(N, V), 0., 1.), f = 1. - nv, f5 = f * f; f5 = f5 * f5 * f;
  float F = .02 + .98 * f5;
  vec3 Rr = reflect(-V, N); float up = clamp(Rr.y, 0., 1.); up = mix(max(up, .15), up, smoothstep(140., 480., dist));
  vec3 sky = mix(mix(uHor, uPale, smoothstep(0., .16, up)), uZen, smoothstep(.12, .85, up));
  // cat's-paws: patches of ruffled water drifting down the strait on the breeze
  float paw = fbm(p * .035 + vec2(uTime * .045, uTime * .06)); paw = smoothstep(.42, .62, paw + .12 * vn(p * .21 - uTime * .25));
  F = clamp(F * (1. + .55 * paw) + .028 * paw * (1. - nearK * .7), 0., 1.);
  // glass: within 200 m the skin gives back less than half of the sky it should, and less again over her and her shadow,
  // so that from the ledge she is the darkest thing in the sea and her shadow is sand in shade, not a blue copy of her
  vec2 hq = p - uHero.xy; float along = clamp(dot(hq, uHero.zw), -13., 12.); hq -= uHero.zw * along; hq.x += 3.;
  float overHer = 1. - smoothstep(8., 17., length(hq));
  float aR = clamp((F * 1.05 + .012) * mix(.42, 1., smoothstep(60., 210., dist)) * (1. - .6 * overHer), 0., .96);
  float depth = max(-h, 0.), deepK = smoothstep(1.2, 3.2, depth);
  // slow slicks give the glass a skin; a smooth hump of pale sky travels over each head
  float slick = sin(p.x * .29 + p.y * .17 + uTime * .11) * sin(p.y * .23 - p.x * .09 - uTime * .08);
  slick = slick * slick * (.5 + .5 * sin(p.x * .05 - p.y * .07 + uTime * .03));
  vec2 d1 = p - uHead.xz, d2 = p - uHead2.xz;
  float hump = exp(-dot(d1, d1) / 7.) * (.02 + .07 * uLift / 1.55) + exp(-dot(d2, d2) / 9.) * uHead2.y;
  // the skin itself, so that whatever swims is seen THROUGH something: wind-drawn threads of pale sky, sparks on the cat's-paws,
  // a long smooth hump travelling over her back and slow rings spreading where the snout base lifts
  vec2 sq = p * vec2(.95, .42) + vec2(uTime * .16, uTime * .10);
  float thr = 1. - smoothstep(0., .075, abs(vn(sq + vn(sq * 1.6 + 5.) * .8) - .5));
  float thr2 = 1. - smoothstep(0., .05, abs(vn(sq * 2.3 - vn(sq * 2.9) * .6 + 9.) - .5));
  float skin = (thr * .11 + thr2 * .05 * nearK) * (.35 + .65 * deepK) * (1. - .7 * smoothstep(120., 300., dist));
  float backK = exp(-dot(hq, hq) / 5.5) * step(-12.9, along) * step(along, 11.9);
  float wake = backK * (.035 + .05 * max(sin(along * 1.7 + uTime * 2.1) * sin(length(hq) * 2.3 - uTime * 1.6), 0.));
  // (polish2: the rings are few, uneven and broken by the wind's own ripples: they were ruled circles)
  float rr = length(d1 * vec2(1., .82)) + (vn(p * .33 + vec2(uTime * .1, 0.)) - .5) * 2.2 + (vn(p * 1.1) - .5) * .7;
  float rings = exp(-rr * rr / 70.) * smoothstep(.15, .95, .5 + .5 * sin(rr * 1.9 - uTime * 2.6)) * smoothstep(1.0, 2.6, rr) * (.03 + .13 * uLift / 1.55) * (.55 + .9 * vn(p * .8 + 7.));
  aR = clamp(aR + hump + .05 * slick + skin + wake + rings, 0., .96);
  // chop: bright facets of sky and dark backs of wavelets shiver over whatever lies below
  vec2 q3 = p * vec2(5.3, 7.9) + vec2(uTime * .9, uTime * .6), q4 = p * vec2(12.7, 9.1) - vec2(uTime * 1.1, -uTime * .8);
  float facet = smoothstep(.16, .34, (vn(q3) - .5) + (vn(q4) - .5) * .8 + c1 * .35) * uChop * (.25 + .75 * nearK) * (.12 + .88 * deepK);      // over the shallows only a shiver: the shells stay readable
  sky = mix(sky, uPale * 1.04, facet * .5);
  aR = clamp(aR + facet * .075, 0., .96);
  // far off the water closes over: dark teal over the channel, pale green over the banks
  vec3 body = mix(uShal, uFar, smoothstep(2.5, 9., depth)) * (.62 + .38 * (1. - sh));
  float aB = smoothstep(150., 430., dist) * .96 + uChop * .10 * (1. - smoothstep(.0, .3, c2 + .2)) * (.2 + .8 * deepK);
  // surf: a creaming white line on the island feet, surging with the swell
  float surge = .5 + .5 * sin(uTime * .9 + p.x * .07 + p.y * .05);
  float isl = vAux.z;
  // the cleft (polish2): the coarse floor grid cannot draw a shoreline between walls 20 m apart (it drew grey slabs), so inside the
  // cleft and round its mouth the foam is left to the strips that follow the wall feet, and the water gives back the WALLS:
  // warm lit stone on the sunny side, blue shade on the other, a strip of sky down the middle
  vec2 cq = p - uCleft.xy; float cA = dot(cq, uCleft.zw), cB = cq.x * uCleft.w - cq.y * uCleft.z + 36. * smoothstep(63., 96., cA);
  float cW = 10.5 + 3. * smoothstep(-8., 4., -cA);
  float inC = smoothstep(-14., -5., cA) * (1. - smoothstep(cW + 4., cW + 9., abs(cB)));
  float wallK = inC * smoothstep(-4., 8., cA) * smoothstep(.22, .92, abs(cB) / cW + (vn(p * .9 + vec2(uTime * .3, 0.)) - .5) * .22 + rp.x * .5);
  vec3 wallC = mix(uWallSh, uWallLit, smoothstep(-2., 2., -cB) * (1. - .8 * sh)) * (.75 + .5 * vn(vec2(p.x * .5 + p.y * .9, cB * 1.3 + uTime * .15)));
  sky = mix(sky, wallC, wallK * .85);
  aR = clamp(aR + wallK * .42 + inC * .10, 0., .96);
  // (polish2: on the island feet the white line itself is drawn on the rock at the waterline, pixel-sharp; the water only adds
  // threads of lace drifting off it, since the floor grid here is far too coarse to carry a shoreline)
  float band = smoothstep(mix(-.28, -.62, isl), mix(-.06, -.44, isl), h) * (1. - smoothstep(-.02, .12, h)) * mix(.5, .8, isl) * (1. - inC) * (1. - smoothstep(.15, .5, isl));
  float offK = smoothstep(-3.4, -1.1, h) * isl * (1. - inC);
  float offT = 1. - smoothstep(0., .07, abs(vn(p * vec2(.9, .7) + vec2(uTime * .12, -uTime * .1) + vn(p * 2.1 + 3.) * .9) - .5));
  float lace = fbm(p * 1.6 + vec2(uTime * .22, -uTime * .17)) + .35 * sin(h * 5. - uTime * 1.3);
  float foam = band * smoothstep(.42, .75, lace + band * .45) * (1. - smoothstep(260., 520., dist));
  foam = clamp(foam + smoothstep(-.3, .0, h) * band * .6 * isl + offT * offK * .5 * (.4 + .6 * surge), 0., 1.);
  // over the shoals the swell stands up and frays into thin lines of lace that run in and fade
  float shoalK = (1. - smoothstep(.8, 1.9, depth)) * (1. - smoothstep(200., 420., dist));
  float wf = sin(p.x * .9 + p.y * .55 - uTime * 1.1 + fbm(p * .11) * 7.);
  float laceS = smoothstep(.80, .97, wf) * smoothstep(.38, .62, fbm(p * 1.3 + vec2(-uTime * .3, uTime * .2)));
  foam = clamp(foam + laceS * shoalK * .55, 0., 1.);
  float cs = smoothstep(.50, .70, fbm(p * .0058 + vec2(uTime * .0035, uTime * .0022) + 3.7));
  body *= 1. - .35 * cs; sky *= 1. - .12 * cs;
  float spark = .35 * smoothstep(.97, 1.06, vn(p * 5.1 + vec2(uTime * 1.3, -uTime * .9)) * (.6 + .8 * vn(p * 8.3 - vec2(uTime * 1.7, uTime * 1.1)))) * paw * (1. - cs)
    * smoothstep(14., 40., dist) * (1. - smoothstep(170., 380., dist));
  vec3 foamC = uFoamC * mix(vec3(1.), vec3(.42, .52, .66), sh * .9) * (.85 + .3 * vn(p * 9.));
  float a = 1. - (1. - aR) * (1. - aB);
  vec3 c = (sky * .92 * aR + body * aB * (1. - aR)) / max(a, 1e-3);
  c = mix(c, vec3(1.5, 1.45, 1.3), spark * .8); a = max(a, spark * .8);
  c = mix(c, foamC, foam); a = max(a, foam * .92);
  gl_FragColor = vec4(c, a);
  #include <fog_fragment>
}`}),n0=new u.Mesh(qe,V0);n0.renderOrder=6,I.add(n0),await A.yield();const De=[],ot=(e,t)=>{const a=Math.floor(e/t),o=e/t-a;return(a+p(.62,.98,o))*t},Bt=(e,t)=>A0*(e*Be[0]+t*Be[1]),se=(e,t)=>{const a=St(e,t),o=Bt(e,t);return ot(a+o+40,1.7+.5*B.n2(e*.013,t*.013))-40-o},Ie=(e,t)=>.035*((e-L[0])*T[0]+(t-L[1])*T[1])-.05*((e-L[0])*T[1]-(t-L[1])*T[0]),me=(e,t)=>{const a=At(e,t,7,8),o=Ie(e,t);return P(a-.4,ot(a+o+40,1.9)-40-o,p(.8,3.6,a))},s0=(e,t)=>-.36*Wt(e,t)[1],_t=(e,t)=>{const a=Yt(e,t),o=s0(e,t);return P(a-.3,ot(a+o+40,1.25)-40-o,p(.6,2.4,a))},co=(e,t)=>Math.max(se(e,t),me(e,t),_t(e,t)),je=new u.ShaderMaterial({fog:!0,uniforms:{...ee(),...ne,...ae,uRock:{value:C("#C9C6BC",.8)},uSoil:{value:C("#9A4A30",.75)}},vertexShader:`attribute vec2 aRk; varying vec3 vW, vN; varying vec2 vRk;
#include <fog_pars_vertex>
void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vN = normal; vRk = aRk; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,fragmentShader:`
uniform vec3 uRock, uSoil, uSunCol, uSkyCol, uSunRefr; uniform float uShade;
varying vec3 vW, vN; varying vec2 vRk;
#include <fog_pars_fragment>
${oe}
${mt}
${be}
${pt}
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.));
  float dist = length(cameraPosition - vW), near = 1. - smoothstep(40., 150., dist);
  float bed = vRk.x, top = smoothstep(.72, .9, N.y), face = 1. - top;
  vec3 rough = vec3(vn(vW.xz * 1.7 + vW.y * 2.3) - .5, (vn(vW.xy * 2.1 + vW.z * 1.3) - .5) * .5, vn(vW.zx * 1.9 - vW.y * 2.1) - .5) + (vec3(vn(vW.xz * 6.1 + vW.y * 5.), .5, vn(vW.zy * 5.7 + vW.x * 6.3)) - .5) * .5;
  N = normalize(N + rough * (.38 * near + .08));
  // strata: beds of uneven thickness, a dark joint under each lip, thin laminae inside the beds
  // (polish1: the beds undulate, pinch and break into blocks; no joint runs ruled from end to end)
  float hc = vW.x * .9 + vW.z * .7;
  float bw = bed * .62 + vn(vW.xz * .05) * .9 + (vn(vec2(hc * .07, vW.y * .05)) - .5) * .45 + (vn(vec2(hc * .5, vW.y * .3)) - .5) * .07, k = floor(bw), f = fract(bw);
  float cx = hc * (.22 + .2 * h12(vec2(k, 11.))) + h12(vec2(k, 7.)) * 9. + (vn(vec2(vW.y * .6, k)) - .5) * .3, cf = fract(cx);
  float blockT = h12(vec2(floor(cx), k * 3.1));
  float vj = (1. - smoothstep(.0, .03, min(cf, 1. - cf))) * face * step(.45, blockT);
  float tone = .80 + .20 * h12(vec2(k, 3.)) + .16 * (blockT - .5) * face + .10 * (vn(vec2(bw * 9., vW.x * .05 + vW.z * .05)) - .5) * near;
  float jm = .25 + .75 * smoothstep(.3, .62, vn(vec2(hc * .19, k * 7.3)));
  float joint = (1. - smoothstep(.0, .10, f)) * .50 * jm + (1. - smoothstep(.0, .05, abs(f - .55))) * .12 * near * (1. - jm) + vj * .30;
  // vertical joints and rain stains down the faces
  float st = vn(vec2(vW.x * .9 + vW.z * .7, vW.y * .12)) * .6 + vn(vec2(vW.x * 2.3 - vW.z * 1.9, vW.y * .3)) * .4;
  vec3 alb = uRock * tone * (1. - joint * face) * mix(1., .72 + .5 * st, face);
  // polish3: the beds are not one grey: buff and cream limestones between the grey ones, now and then a rusty marl
  float bq = h12(vec2(k, 9.)), br = h12(vec2(k, 5.));
  alb *= mix(vec3(1.), mix(vec3(1.17, 1.02, .79), vec3(1.22, .88, .64), step(.86, br)), smoothstep(.30, .62, bq) * (.35 + .65 * face));
  alb = mix(alb, alb * vec3(.80, .86, .96), smoothstep(.55, .8, vn(vW.xz * .08 + 9.)) * .5);      // lichen-grey patches
  // polish2: a face seen close is not ruled lines: blocks of different weathering, a web of fine cracks, pits and pale lichen spots
  float mid = 1. - smoothstep(25., 90., dist);
  vec2 fq = vec2(hc, vW.y * 1.05);
  alb *= mix(1., .74 + .52 * fbm(fq * .85 + 5.), face * (.35 + .65 * mid));
  float crk = 1. - smoothstep(0., .045, abs(vn(fq * 1.25 + vn(fq * 3.1) * .7 + 9.) - .5));
  float crk2 = 1. - smoothstep(0., .06, abs(vn(fq * 4.3 + 21.) - .5));
  alb *= 1. - (.30 * crk * mid * smoothstep(.3, .6, vn(fq * .23 + 2.)) + .20 * crk2 * near) * face;
  alb = mix(alb, vec3(.62, .60, .50), smoothstep(.68, .80, vn(fq * 2.7 + 31.)) * smoothstep(.45, .7, vn(fq * .4 + 3.)) * .5 * mid);
  // iron stain bleeding down from the red soil, weather pockets, and ferns and moss hanging from the wetter ledges
  float stain = smoothstep(.42, .72, fbm(vec2(hc * .06, vW.y * .10) + 3.)) * face;
  alb = mix(alb, alb * vec3(1.30, .90, .60), stain * .75);
  alb *= 1. - .26 * smoothstep(.76, .84, vn(vec2(hc * 2.7, vW.y * 3.3))) * face * near;
  float gm = smoothstep(.62, .78, vn(vec2(hc * .15, k * 3.7 + 1.))) * smoothstep(.50 + .3 * vn(vec2(hc * 2.3, 5.)), 1., f) * step(.25, vn(vec2(hc * 5.1, vW.y * 2.))) * face * smoothstep(1.8, 3.2, vW.y);
  alb = mix(alb, vec3(.20, .30, .10) * (.6 + .9 * vn(vec2(hc * 3.7, vW.y * 3.1))), gm * .8);
  // the pavement: clints and grikes, red soil in the cracks
  vec2 cp = vW.xz * .42 + vec2(vn(vW.xz * .2) * 1.4, vn(vW.xz * .2 + 31.) * 1.4);
  float cr = min(abs(fract(cp.x + .3 * sin(cp.y * 1.7)) - .5), abs(fract(cp.y * .62 + .25 * sin(cp.x * 1.3)) - .5));
  float fine = abs(vn(vW.xz * 2.6) - .5);
  float crack = (1. - smoothstep(.02, .075, cr)) * .9 + (1. - smoothstep(.01, .05, fine)) * .45 * near;
  crack = clamp(crack, 0., 1.) * top;
  alb = mix(alb, uSoil * (.5 + .8 * vn(vW.xz * 3.)), crack * .78);
  alb *= 1. + (vn(vW.xz * 11.) - .5) * .16 * near;
  // the tide mark: dark wet rock and a black-green band at the water's edge
  float wetK = 1. - smoothstep(.15, 1.1 + .5 * vn(vW.xz * .7), vW.y);
  alb = mix(alb, alb * vec3(.60, .66, .54), wetK * .85);
  // the swell creaming on the rock: a white line that climbs and drains with each surge, lace above it
  float sg = .5 + .5 * sin(uTime * .9 + vW.x * .07 + vW.z * .05), fl = fbm(vec2(hc * 1.7 + uTime * .2, vW.y * 3. - uTime * .5));
  float foamR = (1. - smoothstep(.03 + .16 * sg, .10 + .30 * sg, vW.y + (fl - .5) * .35)) * smoothstep(-.14, -.02, vW.y);
  foamR *= .45 + .55 * smoothstep(.36, .62, fbm(vec2(hc * 2.3 - uTime * .3, vW.y * 5. + vW.x * .9)));      // ragged, never an even white band
  foamR *= .18 + .82 * smoothstep(.34, .62, vn(vec2(hc * .21 - uTime * .10, 3.)));      // polish3: it comes and goes along the foot (a stiff white outline round every rock)
  foamR *= mix(1., .9 * smoothstep(.50, .72, fbm(vW.xz * 1.1 + vec2(uTime * .16, -uTime * .12))) * (1. - smoothstep(.10, .30, vW.y)), top);      // a platform awash carries lace, not a white sheet
  float sh = 1. - vRk.y * .97;
  // bed lips catch the sun, their undersides hold shade
  float lip = smoothstep(.80, 1., f) * face * near;
  vec3 col = litAbove(alb, N, sh) * (1. + .16 * lip - .22 * joint * face);
  // in the shade a wall is not flat blue: warm light comes back off the sunlit wall opposite, and the water throws a moving net up it
  vec2 wq = vec2(hc * .45 + uTime * .13, vW.y * .7 - uTime * .22);
  float wl = (1. - smoothstep(0., .10, abs(vn(wq + vn(wq * 1.7 + 4.) * .9) - .5))) * (1. - smoothstep(.3, 6., vW.y)) * face;
  col += alb * (vec3(.26, .22, .17) * vRk.y * face * (.75 + .5 * rough.x) + vec3(.20, .25, .24) * wl * (.25 + .75 * vRk.y));
  col = mix(col, mix(vec3(1.15, 1.13, 1.06), vec3(.42, .52, .66), vRk.y * .85) * (.8 + .4 * fl), foamR * .9);
  col = mix(col, seaTint(col * 1.5 + alb * vec3(.10, .12, .11), -vW.y, vW), smoothstep(0., .3, -vW.y));      // the foot of the rock, seen through the water
  // a metre down the rock is buried in the same sand as the sea floor, lit and tinted the same way, so that where the two coarse
  // meshes cut each other nothing shows (it showed as dark shards in the water round the skerry)
  float rip = 0.; vec3 sa = uSand * (.84 + .08 * (fbm(vW.xz * .35 + 3.) - .5));      // plain sand: with the turf pattern a steep buried face could come out as a dark blade
  float cau = caustic(vW.xz, uTime) * 1.25;
  vec3 Ls = uSunCol * (1. - vRk.y * .22) * uSunRefr.y * (1. + .2 * rip) * (.90 + .62 * cau) + uSkyCol * uShade;      // (lit like the floor beside it: with the rock's own shade its buried skirt drew a dark line along the foot)
  // under water the rock takes the look of the sea floor round its foot (sand seen through about 3 m of water), whatever its own
  // depth and slope: so the thin steep cells where the rock mesh dives under the floor mesh vanish into the floor instead of showing
  // as dark blades or pale slabs under the foam line
  float dEff = .9 + 1.05 * clamp(-vW.y, 0., 12.);      // polish3: the foot deepens as it goes down (at one fixed depth it lay under the water as a pale pane with a ruled edge)
  col = mix(col, seaTint(sa * Ls, dEff, vW), smoothstep(.0, .10, -vW.y));
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`}),Ft=async(e,t,a,o,n,i=null,l=1)=>{const h=new Float32Array(e*t*3),v=new Float32Array(e*t*2),c=new Uint8Array(e*t),f=[];for(let r=0;r<t;r++){for(let d=0;d<e;d++){const g=r*e+d,[y,w]=a(d,r),x=Fe(y,w),S=o(y,w),M=Math.max(S,x-1.2,-13.5);h[g*3]=y,h[g*3+1]=M,h[g*3+2]=w,v[g*2]=M+n(y,w)+40,c[g]=S>x-.15?1:0,v[g*2+1]=c[g]?l*Qe(y,Math.max(M,0)+.35,w):0}r%3===2&&await A.yield()}for(let r=0;r<t-1;r++)for(let d=0;d<e-1;d++){const g=r*e+d,y=g+1,w=g+e,x=w+1;(c[g]||c[y]||c[w]||c[x])&&(i&&i(h[g*3],h[g*3+2])||f.push(g,w,y,y,w,x))}const s=new u.BufferGeometry;return s.setAttribute("position",new u.BufferAttribute(h,3)),s.setAttribute("aRk",new u.BufferAttribute(v,2)),s.setIndex(f),s.computeVertexNormals(),s.computeBoundingSphere(),s};{const e=[],t=[];for(let o=-52;o<-30;o+=2.75)e.push(o);for(let o=-30;o<64;o+=1.25)e.push(o);for(let o=64;o<=196;o+=2.75)e.push(o);for(let o=-44;o<-12;o+=2.9)t.push(o);for(let o=-12;o<74;o+=1.25)t.push(o);for(let o=74;o<=132;o+=2.9)t.push(o);const a=await Ft(e.length,t.length,(o,n)=>[e[o],t[n]],se,Bt,(o,n)=>o<3&&n>31.5);I.add(new u.Mesh(a,je)),await A.yield()}{const e=[],t=[];for(let s=-22;s<40;s+=1.4)e.push(s);for(let s=40;s<112;s+=2.2)e.push(s);for(let s=112;s<=176;s+=4.5)e.push(s);for(let s=-103;s<-64;s+=2.75)t.push(s);for(let s=-64;s<-18;s+=1.45)t.push(s);for(let s=-18;s<18;s+=1.2)t.push(s);for(let s=18;s<60;s+=1.45)t.push(s);for(let s=60;s<=150;s+=2.75)t.push(s);const a=(s,r)=>[L[0]+s*T[0]+r*T[1],L[1]+s*T[1]-r*T[0]],o=await Ft(t.length,e.length,(s,r)=>a(e[r],t[s]+pe(e[r])),me,Ie);I.add(new u.Mesh(o,je)),await A.yield();const n=1.61,i=13,l=3,h=i*l+1,v=88,c=(s,r)=>{const d=Math.sin(s*127.1+r*311.7)*43758.5453;return d-Math.floor(d)},f=[[],[]];for(const s of[1,-1]){const r=new Float32Array(v*h*3),d=new Float32Array(v*h*2),g=[];for(let w=0;w<v;w++){const x=-9+w*1.5,S=pe(x),M=10.5+.8*B.n2(x*.07,s*5.3)+3*p(-8,4,-x);let W=-3;for(let z=0;z<h;z++){const V=z*3+w,N=z===h-1,b=Math.min(i-1,Math.floor(z/l)),m=z%l/(l-1);let k=-3+(b+.02+.96*m)*n+.25*B.n2(x*.03,b*3.1);const F=b+Math.floor(x/23+c(b,9)*3)*17;let D=c(F,s)*1.2+Math.max(0,k)*.065+.35*B.n2(x*.16,k*.3+s*7)+.22*m*(c(F,4)-.3);D+=2.4*p(.12,.55,B.n2(x*.075+s*13.7,4.2))+.9*Math.max(0,B.n2(x*.23+5,s*3.1+b*.37));let q=S+s*(M+D),[E,$]=a(x,q);const $e=ot(Jt(E,$)+Ie(E,$)+40,1.9)-40-Ie(E,$);if(N){let ze=!1;for(const Ge of[11,7.5,4.5,2.2])if(q=S+s*(M+D+Ge),[E,$]=a(x,q),k=Math.max(-1.6,me(E,$)+.05),k>=W-1.6){ze=!0;break}ze||(q=S+s*(M+D+.9),[E,$]=a(x,q),k=W-.35)}else k=Math.min(k,Math.max($e,-3)),W=k;z===5&&f[s>0?0:1].push(x,q);const we=(w*h+z)*3;r[we]=E,r[we+1]=k,r[we+2]=$,d[(w*h+z)*2]=k+Ie(E,$)+40,d[(w*h+z)*2+1]=Qe(E-s*T[1]*.5,k+.3,$+s*T[0]*.5)}w%6===5&&await A.yield()}for(let w=4;w<v-14;w+=2)for(let x=2;x<h-2;x+=3){const S=(w*h+x)*3,M=S+3;Math.hypot(r[M]-r[S],r[M+2]-r[S+2])>.45&&r[S+1]>1.6&&r[S+1]<15&&De.push([(r[S]+r[M])*.5,r[S+1]+.02,(r[S+2]+r[M+2])*.5])}for(let w=0;w<v-1;w++)for(let x=0;x<h-1;x++){const S=w*h+x,M=S+1,W=S+h,z=W+1;Math.min(r[(w*h+h-2)*3+1],r[((w+1)*h+h-2)*3+1])<3||(s>0?g.push(S,W,M,M,W,z):g.push(S,M,W,M,z,W))}const y=new u.BufferGeometry;y.setAttribute("position",new u.BufferAttribute(r,3)),y.setAttribute("aRk",new u.BufferAttribute(d,2)),y.setIndex(g),y.computeVertexNormals(),y.computeBoundingSphere(),I.add(new u.Mesh(y,je)),await A.yield()}{const s=[],r=[],d=[];let g=0;for(let S=0;S<2;S++){const M=S?-1:1,W=f[S],z=W.length/2;for(let V=0;V<z;V++){const N=W[V*2],b=W[V*2+1];for(let m=0;m<2;m++){const[k,F]=a(N,b+M*(m?-3.4:.7));s.push(k,.05,F),r.push(m,N,Qe(k,.3,F),S)}if(V<z-1){const m=g+V*2;S?d.push(m,m+1,m+2,m+1,m+3,m+2):d.push(m,m+2,m+1,m+1,m+2,m+3)}}g+=z*2}const y=new u.BufferGeometry;y.setAttribute("position",new u.Float32BufferAttribute(s,3)),y.setAttribute("aF",new u.Float32BufferAttribute(r,4)),y.setIndex(d);const w=new u.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,side:u.DoubleSide,uniforms:{...ee(),uTime:ae.uTime},vertexShader:`attribute vec4 aF; varying vec4 vF; varying vec3 vW;
#include <fog_pars_vertex>
void main(){ vF = aF; vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,fragmentShader:`uniform float uTime; varying vec4 vF; varying vec3 vW;
#include <fog_pars_fragment>
${oe}
void main(){
  float c = vF.x, a = vF.y;
  // each surge runs along the wall, climbs out from its foot and drains back in lace
  // polish2: a ragged white edge 0.3 to 1.5 m wide that breathes with the swell, and threads of foam drawn out along the wall
  // beyond it (it was a 3 m shelf of white)
  float d = c * 4.1 - .7;
  float surge = .5 + .5 * sin(uTime * 1.05 - a * .13 + vF.w * 2.1), reach = .30 + 1.2 * surge * surge;
  float lace = fbm(vW.xz * 2.6 + vec2(uTime * .25, -uTime * .2)), fine = vn(vW.xz * 9. - uTime * .6);
  float body = 1. - smoothstep(reach * .25, reach, d + (lace - .5) * 1.1);
  float th = 1. - smoothstep(0., .075, abs(vn(vec2(a * .55 - uTime * .35, d * 1.9 + lace * 1.2)) - .5));
  float trail = th * (1. - smoothstep(.8, 3.2, d)) * .5;
  float al = clamp(body * (.6 + .4 * fine) + trail * (.45 + .55 * fine), 0., 1.) * (1. - smoothstep(.85, 1., c));
  if (al < .01) discard;
  vec3 col = mix(vec3(1.2, 1.18, 1.1), vec3(.40, .52, .68), vF.z * .92) * (.85 + .25 * fine);
  gl_FragColor = vec4(col, al * .92);
  #include <fog_fragment>
}`}),x=new u.Mesh(y,w);x.renderOrder=7,x.frustumCulled=!1,I.add(x)}}{const a=await Ft(25,49,(o,n)=>{const i=-24+n,l=-11.4+o*.95;return[j.x+i*j.sn+l*j.cs,j.z+i*j.cs-l*j.sn]},_t,s0,null,.3);I.add(new u.Mesh(a,je)),await A.yield()}{const e=[2300,1600,1150,820,600,450,350,280,230,190,160,135,112,92,76,62,50,41,34,28,23,18,13,8,4,0],t=[];for(let c=-1100;c<-160;c+=40)t.push(c);for(let c=-160;c<900;c+=10)t.push(c);for(let c=900;c<=2140;c+=40)t.push(c);const a=c=>-288-.0011*Math.pow(Math.max(0,c-860),2)-.0011*Math.pow(Math.max(0,-360-c),2)+16*B.n2(c*.0042+31,5.5),o=e.length,n=t.length,i=new Float32Array(o*n*3),l=[];for(let c=0;c<n;c++){for(let f=0;f<o;f++){const s=t[c],r=e[f]+(e[f]>60?B.n2(s*.004,f*3.7)*6:0),d=a(s)-r,g=.5+.5*B.n2(s*.0065+1.3,r*.004),y=Math.abs(B.n2(s*.0031+7,r*.0052+3)),w=30*p(52,118,r)*(1-.72*p(150,235,r))*(.45+.55*g)+62*p(250,520,r)*(.35+.65*y)+(40+130*Math.pow(1-Math.abs(B.n2(s*.0017+5,r*8e-4)),2.2))*p(650,1500,r)*(1-.35*p(1700,2300,r))+2.2*Math.abs(B.n2(s*.03,r*.03))*p(30,90,r),x=p(-.25,.2,B.n2(s*.0036+9,1.7)),S=Math.pow(Math.abs(B.n2(s*.021,3.3+r*.004)),.7),W=(10+14*(.5+.5*B.n2(s*.009+4,8.8)))*x*p(15,31,r-15*(1-S))*(.72+.28*S)*(1-.55*p(70,240,r)),z=(c*o+f)*3;i[z]=d,i[z+1]=-.7+2.3*p(0,22,r)+W+w,i[z+2]=s}c%12===11&&await A.yield()}for(let c=0;c<n-1;c++)for(let f=0;f<o-1;f++){const s=c*o+f,r=s+1,d=s+o,g=d+1;l.push(s,d,r,r,d,g)}const h=new u.BufferGeometry;h.setAttribute("position",new u.BufferAttribute(i,3)),h.setIndex(l),h.computeVertexNormals(),h.computeBoundingSphere(),await A.yield();const v=new u.ShaderMaterial({fog:!0,uniforms:{...ee(),...ae,uRed:{value:C(Ue[0],.98)},uPaleRed:{value:C("#CC7B4E",.92)},uBeach:{value:C("#E3C6A0",.8)},uHaze:{value:C("#E2A77E",.95)}},vertexShader:`varying vec3 vW, vN;
#include <fog_pars_vertex>
void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vN = normal; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,fragmentShader:`
uniform vec3 uRed, uPaleRed, uBeach, uHaze; uniform float uTime;
varying vec3 vW, vN;
#include <fog_pars_fragment>
${oe}
${mt}
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.));
  float steep = 1. - smoothstep(.70, .96, N.y);
  // broad colour only (nothing finer than the pixel at 300 m): pale pans, deeper red faces, darker hollows
  float big = fbm(vec2(vW.x * .006, vW.z * .009) + 2.), mid = fbm(vec2(vW.x * .021 + vW.z * .006, vW.z * .027));
  vec3 alb = mix(uRed, uPaleRed, smoothstep(.35, .7, big) * .65) * (.80 + .40 * mid);
  // the bluff faces: thick beds of red mudstone, a few paler ones, weathering into ribs (broad soft bands warped by the rock itself)
  float bedq = vW.y * .16 + (fbm(vec2(vW.z * .012, vW.x * .012)) - .5) * 1.6, bed = smoothstep(.25, .75, abs(fract(bedq) - .5) * 2.);
  vec3 face = mix(uRed * vec3(.78, .66, .66), uRed * vec3(1.08, .98, .90), bed);
  face = mix(face, uPaleRed * vec3(1.0, 1.02, .98), smoothstep(.70, .86, vn(vec2(floor(bedq) * 7.3, vW.z * .004))) * .55);
  float rib = vn(vec2(vW.z * .16, vW.y * .03 + 4.));
  face *= .74 + .5 * rib;
  alb = mix(alb, face, steep);
  // the beach: pale shell sand above the tide, dark wet mud at the water's edge
  float beach = (1. - smoothstep(1.4, 3.4, vW.y + (mid - .5) * 1.6)) * (1. - steep);
  alb = mix(alb, uBeach * (.9 + .2 * mid), beach);
  alb = mix(alb, uRed * vec3(.50, .46, .50), (1. - smoothstep(.15, .7, vW.y)) * .85);
  N = normalize(N + vec3(mid - .5, 0., vn(vW.xz * .03 + 9.) - .5) * .30);
  // front light flattens land, so the form is drawn by what the sky cannot reach: gullies, the feet of faces, the lee of crests
  float occ = 1. - .42 * steep * (1. - rib) - .20 * (1. - smoothstep(.30, .60, mid)) * (1. - beach);
  float cs = smoothstep(.50, .70, fbm(vW.xz * .0058 + vec2(uTime * .0035, uTime * .0022) + 3.7));
  vec3 c = litAbove(alb, N, 1. - .62 * cs) * occ;
  // the swell breaking on the beach: a ragged white line that runs up and drains
  float run = .12 + .22 * (.5 + .5 * sin(uTime * .8 + vW.z * .05));
  float surf = (1. - smoothstep(run * .4, run, abs(vW.y - .02) + (vn(vec2(vW.z * .21, uTime * .3)) - .5) * .25)) * (.55 + .45 * vn(vec2(vW.z * .6 + uTime * .2, 3.)));
  c = mix(c, vec3(1.05, 1.03, .98), clamp(surf, 0., 1.) * .8);
  // the far dunes stand in the desert's own warm dust, not in the sea's pale haze (fogged white they read as snow peaks)
  float fd = fogDensity * max(vFogDepth, 0.), ff = 1. - exp(-fd * fd);
  gl_FragColor = vec4(mix(c, mix(fogColor, uHaze, .62), ff * .9), 1.);
}`});I.add(new u.Mesh(h,v)),await A.yield()}const Nt=(e,t,a,o,n)=>{const i=Math.hypot(t,a,o)||1,l=t/i,h=a/i,v=o/i,c=1+.2*B.n3(l*1.6+e[6],h*1.6,v*1.6)+.07*B.n3(l*4.1,h*4.1+e[6],v*4.1);return n.set(e[0]+l*e[3]*c,Math.max(e[1]+h*e[4]*c,e[1]-e[4]*.45),e[2]+v*e[5]*c)},Rt=[[-3.9,0,7.6,2,1.45,1.7,3.1],[4.8,0,13.5,1.2,.9,1.4,9.2],[-9.5,0,14.5,1.6,1.1,1.3,5.5],[9.5,0,5.5,1.1,.8,1,1.7],[-1.8,0,18.5,.8,.6,1,7.7],[1.6,0,22,1,.7,.9,4.4],[-14,0,6,1.5,1.1,1.8,6.1]];{const e=[],t=[],a=[],i=new u.Vector3;let l=0;for(const v of Rt){v[1]=se(v[0],v[2])+v[4]*.42;for(let c=0;c<=10;c++)for(let f=0;f<=16;f++){const s=c/10*Math.PI,r=f/16*Math.PI*2;Nt(v,Math.sin(s)*Math.cos(r),Math.cos(s),Math.sin(s)*Math.sin(r),i),e.push(i.x,i.y,i.z),t.push(i.y+Bt(i.x,i.z)+40,0)}for(let c=0;c<10;c++)for(let f=0;f<16;f++){const s=l+c*17+f,r=s+16+1;a.push(s,s+1,r,s+1,r+1,r)}l+=187}const h=new u.BufferGeometry;h.setAttribute("position",new u.Float32BufferAttribute(e,3)),h.setAttribute("aRk",new u.Float32BufferAttribute(t,2)),h.setIndex(a),h.computeVertexNormals(),h.computeBoundingSphere(),I.add(new u.Mesh(h,je))}const at=()=>({pos:[],col:[],pl:[],idx:[],n:0});let R=at();const J=new u.Vector3,Le=new u.Vector3,nt=new u.Vector3,st=new u.Vector3,te=(e,t,a,o,n,i,l,h=1)=>{const v=R.n,c=e.length;let f=0;for(let s=0;s<c;s++){const r=e[s],d=e[Math.min(c-1,s+1)],g=e[Math.max(0,s-1)];st.set(d[0]-g[0],d[1]-g[1],d[2]-g[2]).normalize(),J.set(0,1,0),Math.abs(st.y)>.92&&J.set(1,0,0),Le.crossVectors(st,J).normalize(),nt.crossVectors(Le,st),s>0&&(f+=Math.hypot(r[0]-g[0],r[1]-g[1],r[2]-g[2]));const y=s/(c-1);for(let w=0;w<t;w++){const x=w/t*Math.PI*2,S=Math.cos(x)*r[3],M=Math.sin(x)*r[3];R.pos.push(r[0]+Le.x*S+nt.x*M,r[1]+Le.y*S+nt.y*M,r[2]+Le.z*S+nt.z*M);const W=.82+.18*Math.sin(x);R.col.push(P(a.r,o.r,y)*W,P(a.g,o.g,y)*W,P(a.b,o.b,y)*W),R.pl.push(f*h,w/t,n,P(i,l,y))}R.n+=t}for(let s=0;s<c-1;s++)for(let r=0;r<t;r++){const d=v+s*t+r,g=v+s*t+(r+1)%t,y=d+t,w=g+t;R.idx.push(d,y,g,g,y,w)}},We=(e,t,a,o,n,i,l,h)=>{const v=R.n,c=e.length;for(let f=0;f<c;f++){const s=e[f],r=f/(c-1),d=t(r);for(const g of[-1,1])R.pos.push(s[0]+a.x*d*g,s[1]+a.y*d*g,s[2]+a.z*d*g),R.col.push(P(o.r,n.r,r),P(o.g,n.g,r),P(o.b,n.b,r)),R.pl.push(r,g,i,P(l,h,r));R.n+=2}for(let f=0;f<c-1;f++){const s=v+f*2;R.idx.push(s,s+1,s+2,s+1,s+3,s+2)}},_=G.fork("flora"),E0=C("#6B5646",.8),K0=C("#4A3B30",.8),qt=C("#3F5A45",.9),i0=C("#5E7A4E",.9),O0=C("#26382C",.9),Ve=(e,t,a,o,n)=>{const i=_.range(-.03,.03),l=_.range(-.03,.03),h=o*.022+.05,v=[];for(let s=0;s<=6;s++){const r=s/6;v.push([e+i*o*r*r,t-.3+(o+.3)*r,a+l*o*r*r,h*(1-.86*r)+.012])}te(v,n?7:5,K0,E0,0,0,.25,1);const c=n?9:6,f=n?6:5;for(let s=0;s<c;s++){const r=(s+_.range(.1,.5))/c,d=P(.24,.97,r)*o,g=P(.36,.07,Math.pow(r,1.3))*o*_.range(.85,1.1),y=_()*6.28;for(let w=0;w<f;w++){const x=y+w/f*6.28+_.range(-.2,.2),S=Math.cos(x),M=Math.sin(x),W=g*_.range(.8,1.1),z=e+i*o*r*r,V=a+l*o*r*r,N=t+d,b=[],m=P(.55,.18,r)*W,k=n?5:3;for(let D=0;D<=k;D++){const q=D/k;b.push([z+S*W*q,N+W*.16*Math.sin(q*2.2)-m*q*q,V+M*W*q,P(.085,.03,q)*(.7+.3*o/8)])}te(b,n?5:4,O0,qt,1,.25+.2*r,.9,3);const F=n?5:3;for(let D=0;D<F;D++){const q=(D+.7)/(F+.4),E=Math.min(k-1,Math.floor(q*k)),$=q*k-E,$e=b[E],we=b[E+1],ze=P($e[0],we[0],$),Ge=P($e[1],we[1],$),Et=P($e[2],we[2],$),b0=D%2?1:-1,Te=W*_.range(.26,.42)*(1-.35*q),y0=-M*b0*Te*.55+S*Te*.25,x0=S*b0*Te*.55+M*Te*.25;te([[ze,Ge,Et,.05],[ze+y0*.6,Ge-Te*.25,Et+x0*.6,.042],[ze+y0,Ge-Te*.85,Et+x0,.016]],3,qt,i0,1,.6,1,3)}}}te([[e+i*o,t+o-.2,a+l*o,.06],[e+i*o,t+o+.5,a+l*o,.015]],4,qt,i0,1,.5,.9,3)},r0=C("#4F6B3A",.9),it=C("#7E9550",.9),Dt=C("#2F4428",.9),$0=C("#7A6248",.8),G0=C("#3E3226",.8),l0=(e,t,a,o)=>{const n=_.range(.8,1.2)*o,i=_.range(.26,.36)*o,l=[];for(let c=0;c<=5;c++){const f=c/5;l.push([e,t-.15+(n+.15)*f,a,i*(.82+.3*Math.sin(f*2.6))*(f>.9?.7:1)])}te(l,8,G0,$0,3,0,0,1/(i*6.28));const h=Math.round(_.range(11,15)),v=_()*6.28;for(let c=0;c<h;c++){const f=v+c*2.399,s=_.range(.35,1.15),r=_.range(1.2,1.6)*o,d=Math.cos(f),g=Math.sin(f),y=[];for(let w=0;w<=4;w++){const x=w/4,S=r*x*Math.cos(s),M=r*x*Math.sin(s)-.42*r*x*x*(1.25-s);y.push([e+d*(.06+S),t+n-.05+M,a+g*(.06+S)])}J.set(-g,.12*(c%2?1:-1),d),We(y,w=>(.02+.15*Math.pow(Math.sin(Math.PI*Math.pow(w,.65)),.7))*o,J,Dt,c%3?r0:it,2,.1,.8)}},c0=(e,t,a,o)=>{const n=5+Math.floor(_()*3),i=_()*6.28;for(let l=0;l<n;l++){const h=i+l*2.399+_.range(-.3,.3),v=_.range(.35,.6)*o,c=Math.cos(h),f=Math.sin(h),s=[[e,t-.03,a],[e+c*v*.45,t+v*.62,a+f*v*.45],[e+c*v*.95,t+v*.5,a+f*v*.95]];J.set(-f,0,c),We(s,r=>(.02+.1*Math.sin(Math.PI*Math.min(1,r*1.15+.08)))*o,J,Dt,l%2?r0:it,2,.15,1)}},U0=(e,t,a,o)=>{const n=_.range(-.08,.08),i=_.range(-.08,.08);te([[e,t-.05,a,.03],[e+n*.4,t+o*.5,a+i*.4,.027],[e+n,t+o,a+i,.012]],4,Dt,it,4,0,1,1)},rt=(e,t,a)=>Math.abs(e(t+.9,a)-e(t-.9,a))+Math.abs(e(t,a+.9)-e(t,a-.9))<1.5,Ee=(e,t,a,o)=>ce.distanceTo(e,t,a)>o;for(const[e,t,a]of[[10.5,2.5,10.5],[-11,3,10],[12.5,20,9],[-25,13,9],[17,8,9.5],[-28,4,8]])Ve(e,se(e,t),t,a,!0),await A.yield();let U=0;for(let e=0;e<400&&U<22;e++){const t=_.range(-30,170),a=_.range(-8,100),o=se(t,a),n=_.range(6.5,9);o<5||!rt(se,t,a)||!Ee(t,o+n*.6,a,11)||Math.abs(t)<22&&a<30||(Ve(t,o,a,n,!1),U++,U%6===0&&await A.yield())}U=0;for(let e=0;e<400&&U<9;e++){const t=_.range(-20,150),a=_.range(330+Y,480+Y),o=me(t,a),n=_.range(6,8.5);o<11||!rt(me,t,a)||!Ee(t,o+n*.5,a,16)||(Ve(t,o,a,n,!1),U++)}await A.yield(),U=0;for(let e=0;e<900&&U<60;e++){const t=U>=42,a=U<16,o=t?_.range(-20,130):a?_.range(-16,16):_.range(-30,150),n=t?_.range(330+Y,470+Y):a?_.range(5,26):_.range(-6,95),i=t?me:se,l=i(o,n);l<(t?10:4)||!rt(i,o,n)||!Ee(o,l+1,n,t?15:4.5)||(l0(o,l,n,_.range(.85,1.2)),U++)}await A.yield();const h0=Math.round(400*O*Math.min(1.15,Q));U=0;for(let e=0;e<4e3&&U<h0;e++){const t=U<h0*.45,a=t?_.range(-20,22):_.range(-32,160),o=t?_.range(1,30):_.range(-8,100),n=se(a,o);if(n<3||!rt(se,a,o))continue;const i=a*.42,l=o*.42*.62;Math.min(Math.abs(i-Math.round(i)),Math.abs(l-Math.round(l)))>.2&&_()<.7||(c0(a,n,o,_.range(.8,1.5)),U++,U%80===0&&await A.yield())}{const e=A.core.makeRng((A.seed|0)*31+977>>>0),t=C("#93A84E",.85),a=C("#3F5E2E",.85),o=C("#5E7C3A",.85),n=Math.min(De.length*3,Math.round(560*O));for(let l=0;l<n&&De.length;l++){const h=De[Math.floor(e()*De.length)],v=h[0]-L[0],c=h[2]-L[1],f=v*T[0]+c*T[1],s=v*T[1]-c*T[0];if(B.n2(f*.11+31,h[1]*.35+(s>pe(f)?9:0))<-.15&&e()<.85)continue;const r=e.range(-.9,.9),d=[h[0]+T[0]*r,h[1],h[2]+T[1]*r];if(!Ee(d[0],d[1],d[2],6.4))continue;const g=s-pe(f)>0?-1:1,y=g*T[1],w=-g*T[0],x=e.range(.42,.95),S=6+Math.floor(e()*4);for(let M=0;M<S;M++){const W=(M/(S-1)-.5)*2.9+e.range(-.2,.2),z=Math.cos(W),V=Math.sin(W),N=y*z-w*V,b=w*z+y*V,m=e.range(.7,1.2)*x,k=e.range(.4,1),F=e.range(.25,.6),D=[[d[0]-y*.08,d[1]-.02,d[2]-w*.08],[d[0]+N*m*.36,d[1]+m*F,d[2]+b*m*.36],[d[0]+N*m*.74,d[1]+m*(F*.75-.2*k),d[2]+b*m*.74],[d[0]+N*m*.98,d[1]-m*(.1+.55*k),d[2]+b*m*.98]];J.set(-b,.35*(M%2?1:-1),N).normalize(),We(D,q=>(.02+.12*Math.sin(Math.PI*Math.min(1,q*1.1+.06)))*x,J,a,M%3===0?t:M%3===1?it:o,2,.15,1)}if(e()<.45){const M=2+Math.floor(e()*4);for(let W=0;W<M;W++){const z=e.range(-.55,.55),V=e.range(.8,2.3),N=d[0]+T[0]*z+y*.12,b=d[2]+T[1]*z+w*.12,m=e.range(.1,.3);J.set(T[0],0,T[1]),We([[N,d[1]+.03,b],[N+y*m,d[1]-V*.3,b+w*m],[N+y*m*1.2,d[1]-V*.68,b+w*m*1.2],[N+y*m*.8,d[1]-V,b+w*m*.8]],k=>.035+.075*Math.sin(Math.PI*Math.min(1,k*.9+.1)),J,a,W%2?o:t,2,.1,1)}}l%40===39&&await A.yield()}for(const[l,h,v]of[[10,5.2,"c"],[-3,5.6,"c"],[7.5,3.6,"b"],[12.5,4.4,"b"],[3,5,"b"],[-7,4.6,"b"],[9,2.4,"f"],[6,4.5,"f"],[10.5,1.8,"f"],[1.5,3.2,"f"],[13,3,"f"],[5,2,"f"],[-2,2.6,"f"],[-9,3.4,"f"],[-5,1.6,"f"]]){const c=j.x+l*j.sn+h*j.cs,f=j.z+l*j.cs-h*j.sn,s=_t(c,f);s<2.4||(v==="c"?Ve(c,s,f,l>0?5.6:4.4,!1):v==="b"?l0(c,s,f,.95):c0(c,s,f,1.3))}await A.yield();const i=(l,h)=>[L[0]+l*T[0]+h*T[1],L[1]+l*T[1]-h*T[0]];for(const[l,h,v]of[[6,1,7.5],[19,-1,8.5],[27,1,9],[41,-1,7],[52,1,8],[66,-1,9],[74,1,7.5],[-2,-1,6.5]]){const[c,f]=i(l,pe(l)+h*(17.5+e.range(0,3))),s=me(c,f);s<8||!Ee(c,s+v*.5,f,14)||(Ve(c,s,f,v,!1),await A.yield())}}for(let e=0;e<70;e++){const t=_()*6.28,a=Math.sqrt(_())*3.2,o=-7.5+Math.cos(t)*a,n=15+Math.sin(t)*a*1.6;U0(o,se(o,n),n,_.range(.7,1.2))}await A.yield();const lt=e=>{const t=new u.BufferGeometry;return t.setAttribute("position",new u.Float32BufferAttribute(e.pos,3)),t.setAttribute("aCol",new u.Float32BufferAttribute(e.col,3)),t.setAttribute("aPl",new u.Float32BufferAttribute(e.pl,4)),t.setIndex(e.idx),t},Ke=lt(R);await A.yield();{const e=Ke.attributes.position.array,t=Ke.index.array,a=new Float32Array(e.length);for(let c=0;c<t.length;c+=3){const f=t[c]*3,s=t[c+1]*3,r=t[c+2]*3,d=e[s]-e[f],g=e[s+1]-e[f+1],y=e[s+2]-e[f+2],w=e[r]-e[f],x=e[r+1]-e[f+1],S=e[r+2]-e[f+2],M=g*S-y*x,W=y*w-d*S,z=d*x-g*w;a[f]+=M,a[f+1]+=W,a[f+2]+=z,a[s]+=M,a[s+1]+=W,a[s+2]+=z,a[r]+=M,a[r+1]+=W,a[r+2]+=z,c%45e3===44997&&await A.yield()}let o=1e9,n=1e9,i=1e9,l=-1e9,h=-1e9,v=-1e9;for(let c=0;c<a.length;c+=3){const f=Math.hypot(a[c],a[c+1],a[c+2])||1;a[c]/=f,a[c+1]/=f,a[c+2]/=f,o=Math.min(o,e[c]),n=Math.min(n,e[c+1]),i=Math.min(i,e[c+2]),l=Math.max(l,e[c]),h=Math.max(h,e[c+1]),v=Math.max(v,e[c+2]),c%9e4===89997&&await A.yield()}Ke.setAttribute("normal",new u.BufferAttribute(a,3)),Ke.boundingSphere=new u.Sphere(new u.Vector3((o+l)/2,(n+h)/2,(i+v)/2),Math.hypot(l-o,h-n,v-i)/2+.5)}await A.yield();const H0=new u.ShaderMaterial({fog:!0,side:u.DoubleSide,uniforms:{...ee(),...ae},vertexShader:`attribute vec3 aCol; attribute vec4 aPl; uniform float uTime; varying vec3 vW, vN, vCol; varying vec4 vPl;
#include <fog_pars_vertex>
void main(){ vec3 p = position; float s = aPl.w;
  float g = sin(uTime * .6 + p.x * .05 + p.z * .07) * .5 + .5;                         // slow gusts crossing the island
  p.x += s * (.05 + .13 * g) * sin(uTime * 1.9 + p.x * .9 + p.y * .7) + s * .03 * sin(uTime * 4.3 + p.z * 3.);
  p.z += s * (.04 + .09 * g) * sin(uTime * 1.6 + p.z * .8 + 1.3);
  p.y += s * .05 * g * sin(uTime * 2.3 + p.x * 1.3 + p.z);
  vec4 wp = modelMatrix * vec4(p, 1.); vW = wp.xyz; vN = normal; vCol = aCol; vPl = aPl;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,fragmentShader:`
varying vec3 vW, vN, vCol; varying vec4 vPl;
#include <fog_pars_fragment>
${oe}
${mt}
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.)); if (!gl_FrontFacing) N = -N;
  float kind = vPl.z, u = vPl.x, v = vPl.y; vec3 alb = vCol; float thin = 0.;
  if (kind < .5) { alb *= .75 + .5 * vn(vec2(u * 3., v * 9.)); }
  else if (kind < 1.5) { float sc = abs(fract(u * 2.6 + v * 2.) - .5) + abs(fract(u * 2.6 - v * 2.) - .5); alb *= .62 + .75 * smoothstep(.2, .7, sc); }
  else if (kind < 2.5) {
    float av = abs(v), comb = fract(u * 22. + av * 1.5);
    if (av > .16 && comb > .58) discard;
    alb *= mix(1.25, .8 + .3 * comb, smoothstep(.08, .2, av)); thin = 1.;
  }
  else if (kind < 3.5) { float d1 = abs(fract(u * 5. + v * 7.) - .5), d2 = abs(fract(u * 5. - v * 7.) - .5); alb *= .5 + .9 * smoothstep(.03, .2, min(d1, d2)); }
  else { alb *= .6 + .5 * smoothstep(.1, .2, fract(u * 7.)); }
  vec3 c = litAbove(alb, N, 1.) + alb * uSunA * (.45 * thin + .12) * max(dot(-N, uSun), 0.);
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`}),Z0=new u.Mesh(Ke,H0);I.add(Z0),await A.yield();const ct=[],It=[],H=G.fork("fauna"),ht=Math.round(3e3*O*(ke==="shoal"?1.25:1)),f0=[new u.Vector4(-10,-1.8,193,8.5),new u.Vector4(-7,-1.6,330,10),ke==="shoal"?new u.Vector4(S0-2.5,-4,0,11):new u.Vector4(10.5,-1.5,322+Y+3,9.5)],Pe=[new u.Vector4(0,0,-999,1),new u.Vector4(0,0,-999,1),new u.Vector4(0,0,-999,1)];{const e=new u.InstancedBufferGeometry;e.setAttribute("position",new u.Float32BufferAttribute([0,0,.11,.026,0,.02,-.026,0,.02,0,0,-.07,.03,0,-.11,-.03,0,-.11,0,.03,.02],3)),e.setIndex([0,1,2,1,3,2,3,4,5,0,6,1,0,2,6,6,3,1,6,2,3]);const t=new Float32Array(ht*4),a=new Float32Array(ht*4);for(let i=0;i<ht;i++){const l=ke==="shoal"?i%5<3?2:i%5-3:i%3,h=Math.pow(H(),.6),v=H()*6.2832;t.set([h*Math.cos(v),H.range(-1,1),h*Math.sin(v),H()],i*4),a.set([l,H.range(.75,1.3),H.range(.8,1.25),H()],i*4),i%1e3===999&&await A.yield()}e.setAttribute("iA",new u.InstancedBufferAttribute(t,4)),e.setAttribute("iB",new u.InstancedBufferAttribute(a,4)),e.instanceCount=ht;const o=new u.ShaderMaterial({fog:!0,side:u.DoubleSide,uniforms:{...ee(),...ne,uShoal:{value:f0},uAvoid:{value:Pe},uSunW:ae.uSun},vertexShader:`attribute vec4 iA, iB; uniform vec4 uShoal[3], uAvoid[3]; uniform float uTime;
varying vec3 vW; varying float vFl, vBack;
#include <fog_pars_vertex>
void main(){
  int si = int(iB.x + .5); vec4 S = uShoal[0], A = uAvoid[0];
  if (si == 1) { S = uShoal[1]; A = uAvoid[1]; } else if (si == 2) { S = uShoal[2]; A = uAvoid[2]; }
  // the shoal turns as one slow wheel that breathes; each fish keeps its own lane in it
  float ph = iA.w * 6.2832, w = .16 * iB.y, th = uTime * w + ph * .15;
  float c = cos(th), s = sin(th);
  vec2 o = vec2(c * iA.x - s * iA.z, s * iA.x + c * iA.z) * S.w * (1. + .18 * sin(uTime * .5 + iB.x * 2.));
  o.x *= .62; o += vec2(sin(uTime * .21 + iB.x * 3.), cos(uTime * .17 + iB.x * 5.)) * 2.;
  vec3 ctr = vec3(S.x + o.x, S.y + iA.y * (.55 + .12 * S.w) * .5 + .25 * sin(uTime * .8 + ph), S.z + o.y);
  // it parts round whatever comes through: fish are pushed out sideways
  vec2 d = (ctr.xz - A.xy) * vec2(1., A.w); float dl = length(d) + 1e-3, push = sqrt(dl * dl + A.z * A.z) - dl;
  ctr.x += d.x / dl * push;  ctr.z += d.y / dl * push * A.w;
  // heading: along the wheel, and outward where it is parting
  vec2 hd = vec2(-s * iA.x - c * iA.z, c * iA.x - s * iA.z); hd.x *= .62; hd += d / dl * push * .12;
  hd = hd / max(length(hd), 1e-3);
  vec3 p = position * iB.z * 1.5;
  float wig = sin(uTime * 9. * iB.y + ph * 7. - p.z * 14.) * (.012 + .16 * max(-p.z, 0.));
  p.x += wig;
  float roll = sin(uTime * 1.3 * iB.y + ph * 3.) ; roll = roll * roll * roll * .9 + smoothstep(1.2, 4., push) * sin(uTime * 7. + ph * 9.) * .8;
  p.xy = vec2(cos(roll) * p.x - sin(roll) * p.y, sin(roll) * p.x + cos(roll) * p.y);
  vec3 wp = ctr + vec3(hd.y * p.x + hd.x * p.z, p.y, -hd.x * p.x + hd.y * p.z);
  // polish3: one fish in seven leaps where the shoal is parting: a short silver arc out of the water and back
  float lt = fract(uTime * .42 * iB.y + iA.w * 37.), lk = step(.86, fract(iA.w * 91.7)) * (.22 + .78 * smoothstep(.25, 1.6, push));
  float arc = sin(3.14159 * clamp(lt / .26, 0., 1.)) * lk;
  wp.y = mix(wp.y, .05 + .95 * arc * (.6 + .5 * iB.z), smoothstep(0., .22, arc)); wp.xz += hd * arc * .5;
  vW = wp; vFl = max(abs(roll), smoothstep(.1, .3, arc)); vBack = position.y;
  vec4 mvPosition = viewMatrix * vec4(wp, 1.); gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,fragmentShader:`
uniform vec3 uSunCol, uSkyCol;
varying vec3 vW; varying float vFl, vBack;
#include <fog_pars_fragment>
${oe}
${be}
void main(){
  // dark olive backs from above; a roll throws the silver flank at the sun
  float fl = smoothstep(.35, .85, vFl);
  vec3 col = mix(vec3(.05, .07, .07), vec3(.95, .97, 1.) * 1.5, fl) * (uSunCol + uSkyCol * .5);
  col = seaTint(col, -vW.y, vW);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`}),n=new u.Mesh(e,o);n.frustumCulled=!1,n.renderOrder=2,I.add(n),await A.yield()}const ue=(e,t,a,o,n,i,l=null,h=null)=>{const v=R.n,c=e.length;for(let f=0;f<c;f++){const s=e[f],r=f/(c-1);for(let d=0;d<t;d++){const g=d/t*Math.PI*2,y=Math.sin(g),w=Math.cos(g),x=l?1+l(g,r):1,S=h?h.px:.85,M=h?s[4]*Math.pow(w,h.py)+h.add(g,r):s[4]*w*x;R.pos.push(s[0]+s[3]*Math.sign(y)*Math.pow(Math.abs(y),S)*x,s[1]+(w>=0?M:s[5]*w),s[2]);const W=p(-.25,.3,-w);R.col.push(P(a.r,o.r,W),P(a.g,o.g,W),P(a.b,o.b,W)),R.pl.push(s[2],(1-w)*.5,n,i?i(r,y):0)}R.n+=t}for(let f=0;f<c-1;f++)for(let s=0;s<t;s++){const r=v+f*t+s,d=v+f*t+(s+1)%t,g=r+t,y=d+t;R.idx.push(r,d,g,d,y,g)}};{R=at();const e=C("#75623A",.66),t=C("#3E3120",.7),a=C("#A88C5E",.82),o=C("#B9AE8C",.7),n=(b,m)=>{let k=Math.abs(b-m);return k=Math.min(k,6.2832-k),Math.exp(-k*k/.012)},i=b=>(m,k)=>b*(n(m,0)+.85*n(m,.5236)+.85*n(m,5.7596))*Math.min(1,.25+3*Math.sin(Math.PI*k)),l=b=>m=>{let k=0;for(;k<b.length-2&&m>b[k+1][0];)k++;const F=b[k],D=b[k+1];return P(F[1],D[1],ie((m-F[0])/(D[0]-F[0]),0,1))},h=l([[0,.5],[.05,.6],[.6,1],[.68,1],[.95,.62],[1,.52]]),v=l([[0,.5],[.1,.8],[.5,1],[.85,.7],[1,.44]]),c=[];for(let b=0;b<=8;b++){const m=b/8;c.push([0,-.02,.44-1.22*m,.15-.05*m,.065,.06])}ue(c,8,a,o,6,null);const f=[];for(let b=0;b<=14;b++){const m=b/14,k=h(m),F=Math.min(1,.6+2.2*Math.sin(Math.PI*m));f.push([0,.035,.52-.84*m,.62*k,.075*F,.045*F])}ue(f,24,e,o,5,null,null,{px:.55,py:.42,add:i(.034)});const s=[];for(let b=0;b<=7;b++){const m=b/7,k=v(m),F=Math.min(1,.6+2.2*Math.sin(Math.PI*m));s.push([0,.02,-.44-.32*m,.31*k,.06*F,.04*F])}ue(s,24,e,o,5,null,null,{px:.55,py:.42,add:i(.024)}),ue([[0,0,.42,.15,.08,.06],[0,0,.58,.125,.07,.055],[0,.005,.72,.12,.068,.05],[0,.015,.82,.155,.08,.055],[0,.01,.91,.125,.066,.05],[0,0,1,.07,.045,.035],[0,-.01,1.08,.03,.026,.02],[0,-.015,1.14,.006,.008,.008]],8,a,o,6,b=>.4*b),ue([[0,0,-.74,.1,.06,.045],[0,0,-.9,.07,.045,.035],[0,0,-1.14,.044,.03,.025],[0,0,-1.42,.03,.022,.018],[0,0,-1.7,.012,.01,.008]],6,a,t,6,b=>-.55*b);for(const[b,m,k,F]of[[1,.3,.36,1],[-1,.3,.36,-1],[1,-.6,.32,-1],[-1,-.6,.32,1]]){const D=b*(m>0?.42:.24),q=m>0?.1:-.06;te([[D,-.02,m,.06],[D+b*k*.5,-.05,m+q*.5,.05],[D+b*k,-.11,m+q,.034]],5,a,a,7,F*.4,F*1,1),J.set(0,0,1),We([[D+b*k*.9,-.11,m+q],[D+b*(k+.09),-.13,m+q*1.2],[D+b*(k+.18),-.14,m+q*1.3]],E=>.045+.07*Math.sin(Math.PI*(.25+.7*E)),J,a,a,7,F,F)}const r=lt(R);r.computeVertexNormals();const d=new u.InstancedBufferGeometry;d.index=r.index;for(const b of Object.keys(r.attributes))d.setAttribute(b,r.attributes[b]);const g=6,y=new Float32Array(g*4),w=new Float32Array(g*4),x=[123.6,125.6,127.4,129.6,132.6,136.4],S=[-1.4,-5.4,1.8,-3.2,-6.4,.2];for(let b=0;b<g;b++){const m=x[b]+H.range(-.5,.5),k=S[b]+H.range(0,.6),F=H.range(1.3,1.9);y.set([k,Fe(k,m)+.14,m,F*(b%2?1:-1)],b*4),w.set([H()*6.28,H.range(1.08,1.2),H(),0],b*4),It.push([k,m,F])}d.setAttribute("iP",new u.InstancedBufferAttribute(y,4)),d.setAttribute("iQ",new u.InstancedBufferAttribute(w,4)),d.instanceCount=g;const M=`attribute vec3 aCol; attribute vec4 aPl, iP, iQ; uniform float uTime;
vec3 placo(vec3 p, inout vec3 n, out float fy){
  float kind = aPl.z, sw = aPl.w, ph = uTime * 2.1 * (.8 + .4 * iQ.z) + iQ.x * 5.;
  // slow diagonal steps: each paddle swings forward clear of the sand, plants, and the body slides over it
  if (kind > 6.5) { float c = sin(ph * sign(sw) + (sw > 0. ? 0. : 3.1416)), l = max(cos(ph * sign(sw) + (sw > 0. ? 0. : 3.1416)), 0.); p.z += c * .13 * abs(sw); p.y += l * .05 * abs(sw); }
  else if (kind > 5.5) { p.x += sin(ph * .5 + p.z * 2.) * .05 * sw; }                 // head noses about, tail swings against it
  p.x += sin(ph) * .012; p.y += abs(sin(ph)) * .008;
  p *= iQ.y;
  float r = iP.w, w = .085 / r, th = uTime * w + iQ.x, c = cos(th), s = sin(th);
  // heading is the tangent of its slow circle
  vec2 h = vec2(-s, c) * sign(r);
  vec3 q = vec3(h.y * p.x + h.x * p.z, p.y, -h.x * p.x + h.y * p.z);
  n = vec3(h.y * n.x + h.x * n.z, n.y, -h.x * n.x + h.y * n.z);
  fy = iP.y - .13;
  return q + vec3(iP.x + c * abs(r), iP.y, iP.z + s * abs(r));
}`,W=new u.ShaderMaterial({fog:!0,side:u.DoubleSide,uniforms:{...ee(),...ne},vertexShader:`${M}
varying vec3 vW, vN, vCol; varying vec4 vPl;
#include <fog_pars_vertex>
void main(){ vec3 n = normal; float fy; vec3 wp = placo(position, n, fy); vW = wp; vN = n; vCol = aCol; vPl = aPl;
 vec4 mvPosition = viewMatrix * vec4(wp, 1.); gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,fragmentShader:`
uniform vec3 uSunRefr, uSunCol, uSkyCol, uBounce;
varying vec3 vW, vN, vCol; varying vec4 vPl;
#include <fog_pars_fragment>
${oe}
${be}
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.)); if (!gl_FrontFacing) N = -N;
  vec3 alb = vCol;
  if (vPl.z > 4.5 && vPl.z < 5.5) {
    // the shell: a mosaic of small plates, paler seams between them
    vec2 q = vec2(vPl.x * 16., vPl.y * 34.); q.x += .5 * floor(q.y);
    vec2 f = abs(fract(q) - .5); float seam = smoothstep(.34, .47, max(f.x, f.y));
    alb = alb * (.72 + .5 * h12(floor(q))) ; alb = mix(alb, alb * 2.3 + .05, seam * .85 * (1. - smoothstep(.36, .5, vPl.y)));
    float kl = max(1. - smoothstep(.002, .012, vPl.y), 1. - smoothstep(.006, .02, abs(vPl.y - .067)));
    alb = mix(alb, alb * 2.1 + .06, kl * .8);
    alb *= 1. - .45 * smoothstep(.20, .27, vPl.y) * (1. - smoothstep(.30, .36, vPl.y));          // the shield's rim throws a dark edge
  } else { alb *= .75 + .5 * vn(vec2(vPl.x * 30., vPl.y * 14.)); }
  float ndl = max(dot(N, uSunRefr), 0.), ca = caustic(vW.xz + vW.y * .7, uTime) * smoothstep(.1, .6, N.y);
  vec3 col = alb * (uSunCol * ndl * (.88 + .75 * ca) + uSkyCol * (.42 + .58 * N.y) * .55 + uBounce * (max(-N.y, 0.) * .55 + .08));
  gl_FragColor = vec4(seaTint(col, -vW.y, vW), 1.);
  #include <fog_fragment>
}`}),z=new u.Mesh(d,W);z.frustumCulled=!1,z.renderOrder=2,I.add(z);const V=new u.ShaderMaterial({fog:!0,side:u.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,uniforms:{...ee(),...ne},vertexShader:`${M}
uniform vec3 uSunRefr; varying vec3 vW;
#include <fog_pars_vertex>
void main(){ vec3 n = normal; float fy; vec3 wp = placo(position, n, fy);
 float t = (wp.y - fy) / max(uSunRefr.y, .2); wp -= uSunRefr * t; wp.y = fy + .03; vW = wp;
 vec4 mvPosition = viewMatrix * vec4(wp, 1.); gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,fragmentShader:`
varying vec3 vW;
#include <fog_pars_fragment>
${oe}
${be}
${pt}
${k0}
void main(){
  float rip; vec3 a = sandCol(vW.xz, length(cameraPosition - vW), rip);
  gl_FragColor = vec4(seaTint(a * shadeLight(-vW.y, rip), -vW.y, vW), 1.);
  #include <fog_fragment>
}`}),N=new u.Mesh(d,V);N.frustumCulled=!1,N.renderOrder=1,I.add(N),await A.yield()}{const e=G.fork("mounds"),t=[],a=[],o=[],n=[];let i=0;const l=C("#3E3A2E",.8),h=C("#D9D2BC",.8),v=6,c=12,f=(x,S,M,W)=>{const z=Fe(x,S)-.05,V=e()*50;for(let N=0;N<=v;N++)for(let b=0;b<=c;b++){const m=N/v*Math.PI*.5,k=b/c*Math.PI*2,F=Math.sin(m)*Math.cos(k),D=Math.sin(m)*Math.sin(k),q=Math.cos(m),E=1+.3*B.n3(F*2.3+V,q*2.3,D*2.3)+.26*Math.abs(B.n3(F*5.5+V,q*5.5,D*5.5))-.06;t.push(x+F*M*E,z+q*W*E,S+D*M*E*.8);const $=ie(.5+1.6*B.n3(F*7+V,q*7+3,D*7),0,1)*(.35+.65*q);a.push(P(l.r,h.r,$),P(l.g,h.g,$),P(l.b,h.b,$)),o.push(z+.05)}for(let N=0;N<v;N++)for(let b=0;b<c;b++){const m=i+N*(c+1)+b,k=m+c+1;n.push(m,m+1,k,m+1,k+1,k)}i+=(v+1)*(c+1)};for(let x=0;x<3;x++){const[S,M,W]=It[x*2],z=.6+x*2.2;f(S+Math.cos(z)*(W+.62),M+Math.sin(z)*(W+.62),.55,.42)}const s=Math.round(46*Math.max(O,.8));for(let x=0,S=0;x<s&&S<600;S++){const M=e.range(92,262),W=Xt(M)+e.range(.5,30),z=Fe(W,M);if(z>-.5||z<-5.5||Je(W,M)>-2)continue;let V=!0;for(const N of It)Math.hypot(W-N[0],M-N[1])<N[2]+.9&&(V=!1);V&&(f(W,M,e.range(.45,1),e.range(.3,.55)),x++,e.chance(.5)&&f(W+e.range(-1.2,1.2),M+e.range(-1.2,1.2),e.range(.3,.55),e.range(.2,.35)))}const r=new u.BufferGeometry;r.setAttribute("position",new u.Float32BufferAttribute(t,3)),r.setAttribute("aCol",new u.Float32BufferAttribute(a,3)),r.setAttribute("aFy",new u.Float32BufferAttribute(o,1)),r.setIndex(n),r.computeVertexNormals(),r.computeBoundingSphere();const d=new u.ShaderMaterial({fog:!0,uniforms:{...ee(),...ne},vertexShader:`attribute vec3 aCol; varying vec3 vW, vN, vCol;
#include <fog_pars_vertex>
void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vN = normal; vCol = aCol; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,fragmentShader:`
uniform vec3 uSunRefr, uSunCol, uSkyCol, uBounce;
varying vec3 vW, vN, vCol;
#include <fog_pars_fragment>
${oe}
${be}
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.));
  // a heap of oyster shells: pale valves a hand across, black gaps between them
  float cell = vn(vW.xz * 15. + vW.y * 11.), big = vn(vW.xz * 6.5 + vW.y * 5. + 3.);
  vec3 alb = mix(vCol * .32, vec3(.66, .63, .55) * (.7 + .5 * big), smoothstep(.36, .47, cell) * (.45 + .55 * smoothstep(.25, .5, big)));
  float ndl = max(dot(N, uSunRefr), 0.), ca = caustic(vW.xz + vW.y * .7, uTime) * smoothstep(.1, .6, N.y);
  vec3 col = alb * (uSunCol * ndl * (.9 + .6 * ca) + uSkyCol * (.42 + .58 * N.y) * .5 + uBounce * .06);
  gl_FragColor = vec4(seaTint(col, -vW.y, vW), 1.);
  #include <fog_fragment>
}`}),g=new u.Mesh(r,d);g.renderOrder=2,I.add(g);const y=new u.ShaderMaterial({fog:!0,side:u.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,uniforms:{...ee(),...ne},vertexShader:`attribute float aFy; uniform vec3 uSunRefr; varying vec3 vW;
#include <fog_pars_vertex>
void main(){ vec4 wp = modelMatrix * vec4(position, 1.); float t = max(wp.y - aFy, 0.) / max(uSunRefr.y, .2); wp.xyz -= uSunRefr * t; wp.y = aFy + .03; vW = wp.xyz;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,fragmentShader:`
varying vec3 vW;
#include <fog_pars_fragment>
${oe}
${be}
${pt}
${k0}
void main(){
  float rip; vec3 a = sandCol(vW.xz, length(cameraPosition - vW), rip);
  gl_FragColor = vec4(seaTint(a * shadeLight(-vW.y, rip), -vW.y, vW), 1.);
  #include <fog_fragment>
}`}),w=new u.Mesh(r,y);w.renderOrder=1,I.add(w),await A.yield()}const u0={vertexShader:`attribute vec3 aCol; attribute vec4 aPl; uniform float uTime, uOpen, uFlap, uAmp, uSeed;
varying vec3 vW, vN, vCol; varying vec4 vPl;
#include <fog_pars_vertex>
void main(){ vec3 p = position, n = normal; float kind = aPl.z, sw = aPl.w, sx = sign(p.x);
  if (kind > 8.5 && kind < 9.5) {                    // rib fan: folds flat to the flank on the rock, trembles in the glide
    float out_ = abs(p.x) - .03; p.x = sx * (.03 + out_ * mix(.12, 1., uOpen)); p.z -= out_ * (1. - uOpen) * .9;
    p.y += sw * (.012 * sin(uTime * 11. + uSeed + sw * 3.) + .03 * sin(uTime * 2.3 + uSeed)) * uOpen + sw * sw * .035 * uOpen;
  } else if (kind > 9.5 && kind < 11.5 && sw > 0.) {   // wing: beats from the shoulder, the outer wing lagging and folding on the upstroke
    float a = uAmp * (sin(uFlap) * .85 + .1) + (1. - uAmp) * .16, a2 = a + uAmp * sw * (.55 * sin(uFlap - 1.1) - .25 * cos(uFlap));
    float r = abs(p.x) - .03, ang = mix(a, a2, sw);
    p.y += r * sin(ang); p.x = sx * (.03 + r * (cos(ang) - .22 * uAmp * sw * max(cos(uFlap), 0.)));
    n.y += .5; n = normalize(n);
  } else if (sw < 0.) { p.x += sin(uTime * 3.1 + uSeed + p.z * 6.) * .05 * sw * sw; p.y += sin(uTime * 2.2 + uSeed) * .03 * sw * sw; }   // tail steers
  vec4 wp = modelMatrix * vec4(p, 1.); vW = wp.xyz; vN = mat3(modelMatrix) * n; vCol = aCol; vPl = aPl;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,fragmentShader:`
varying vec3 vW, vN, vCol; varying vec4 vPl;
#include <fog_pars_fragment>
${oe}
${mt}
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.)); if (!gl_FrontFacing) N = -N;
  float kind = vPl.z; vec3 alb = vCol; float thin = 0.;
  if (kind < 8.5) {                                   // lizard: darker cross-bands over the back, fine speckle, a dark eye
    float band = smoothstep(.35, .65, sin(vPl.x * 62.) * .5 + .5) * (1. - smoothstep(.3, .55, vPl.y));
    alb *= mix(1., .45, band) * (.85 + .3 * vn(vec2(vPl.x * 220., vPl.y * 40.)));
  } else if (kind < 9.5) {                            // fan: rust skin, the long ribs showing as pale lines
    float rib = 1. - smoothstep(.04, .16, abs(fract(vPl.x) - .5)); alb = mix(alb, alb * 1.7 + .05, rib * .7); alb *= .8 + .4 * vn(vPl.xy * vec2(3., 9.)); thin = 1.;
  } else if (kind < 10.5) {                           // wing skin: the finger along the front, faint fibres, the sun through it
    alb *= .82 + .3 * vn(vec2(vPl.x * 30., vPl.y * 5.)); alb = mix(alb, alb * .5, 1. - smoothstep(.0, .07, vPl.y)); thin = 1.;
  } else if (kind > 11.5) { alb *= .6 + .8 * vn(vec2(vPl.x * 300., vPl.y * 60.)); }       // fur
  vec3 c = litAbove(alb, N, 1.) + alb * uSunA * (.42 * thin) * max(dot(-N, uSun), 0.) + alb * uSkyA * .15 * thin;
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`},X0=()=>new u.ShaderMaterial({fog:!0,side:u.DoubleSide,vertexShader:u0.vertexShader,fragmentShader:u0.fragmentShader,uniforms:{...ee(),...ae,uOpen:{value:0},uFlap:{value:0},uAmp:{value:0},uSeed:{value:H()*40}}}),v0=(e,t,a,o,n,i,l,h,v=1)=>{const c=R.n;for(let f=0;f<=a;f++){const s=f/a,r=e(s),d=t(s);for(let g=0;g<=o;g++){const y=g/o;R.pos.push(P(r[0],d[0],y),P(r[1],d[1],y),P(r[2],d[2],y)),R.col.push(P(n.r,i.r,y),P(n.g,i.g,y),P(n.b,i.b,y)),R.pl.push(s*v,y,l,h(s,y))}R.n+=o+1}for(let f=0;f<a;f++)for(let s=0;s<o;s++){const r=c+f*(o+1)+s,d=r+1,g=r+o+1,y=g+1;R.idx.push(r,g,d,d,g,y)}},d0=(e,t,a)=>[P(e[0],t[0],a),P(e[1],t[1],a),P(e[2],t[2],a)],J0=(e,t)=>{const a=ie(t,0,1)*(e.length-1),o=Math.min(e.length-2,Math.floor(a));return d0(e[o],e[o+1],a-o)};R=at();{const e=C("#B79A6C",.85),t=C("#E6DCC0",.8),a=C("#A0603C",.8),o=C("#74442C",.8);ue([[0,0,.325,.006,.005,.005],[0,.002,.312,.02,.013,.012],[0,.004,.285,.03,.022,.016],[0,.004,.255,.033,.025,.018],[0,.002,.225,.026,.02,.017],[0,0,.195,.022,.019,.018],[0,0,.15,.029,.023,.022],[0,0,.09,.032,.024,.023],[0,0,.03,.028,.022,.02],[0,0,-.02,.02,.018,.016],[0,0,-.1,.011,.011,.01],[0,0,-.22,.006,.006,.006],[0,0,-.38,.0015,.0015,.0015]],10,e,t,8,n=>n>.72?-(n-.72)*3.4:0);for(const n of[1,-1])te([[n*.026,-.004,.16,.009],[n*.07,-.008,.115,.007],[n*.078,-.008,.05,.005],[n*.085,-.008,.03,.007]],4,e,e,11,0,0,1),te([[n*.022,-.004,0,.011],[n*.065,-.006,-.05,.008],[n*.058,-.006,-.13,.005],[n*.066,-.006,-.155,.008]],4,e,e,11,0,0,1),v0(i=>[n*.03,.005,P(.165,0,i)],i=>[n*(.03+.2*Math.pow(Math.sin(Math.PI*(.07+.86*i)),.6)),.007,P(.105,-.035,i)-.012],11,4,o,a,9,(i,l)=>l,11)}const jt=lt(R);jt.computeVertexNormals(),jt.boundingSphere=new u.Sphere(new u.Vector3,.6),await A.yield(),R=at();{const e=C("#5A4634",.9),t=C("#8A735A",.9),a=C("#C89B74",.8),o=C("#8E6648",.8),n=C("#6E5642",.85),i=C("#3A3028",.9);ue([[0,.012,.205,.003,.003,.003],[0,.014,.185,.009,.008,.008],[0,.016,.15,.014,.014,.012],[0,.02,.118,.02,.022,.016],[0,.022,.095,.022,.024,.018],[0,.018,.075,.015,.016,.014]],8,i,t,8,null),ue([[0,.016,.08,.012,.013,.012],[0,.008,.05,.026,.024,.024],[0,0,0,.034,.03,.032],[0,0,-.06,.03,.026,.028],[0,0,-.115,.018,.016,.016],[0,0,-.14,.006,.006,.006]],10,e,t,12,null),te([[0,0,-.13,.006],[0,.004,-.25,.004],[0,.006,-.36,.003]],4,n,n,11,-.2,-.9,1),J.set(0,1,0),We([[0,.006,-.35],[0,.006,-.385],[0,.006,-.42]],l=>.004+.022*Math.sin(Math.PI*Math.min(1,l+.12)),J,o,a,11,-.9,-1);for(const l of[1,-1]){const h=[[l*.03,.012,.045],[l*.105,.014,.015],[l*.19,.014,.075],[l*.34,.008,.035],[l*.5,0,-.05]],v=[l*.035,0,-.2],c=[l*.02,0,-.1];v0(f=>J0(h,f),f=>{const s=d0(v,h[4],Math.pow(f,1.25));return s[2]+=.035*Math.sin(Math.PI*f),s},10,3,a,o,10,(f,s)=>Math.pow(f,1.2)*.999+.001,1),te(h.map((f,s)=>[f[0],f[1]+.002,f[2],[.011,.009,.007,.005,.002][s]]),4,n,n,11,.001,.999,1);for(let f=0;f<3;f++)te([[l*.19,.014,.075,.004],[l*(.2+.008*f),.012,.098+.004*f,.003],[l*(.205+.012*f),.006,.108,.001]],3,i,i,11,.37,.37,1);te([[c[0],c[1],c[2],.009],[l*.045,0,-.15,.006],v.concat(.004),[l*.04,-.004,-.225,.005]],4,e,n,11,0,0,1)}}const Lt=lt(R);Lt.computeVertexNormals(),Lt.boundingSphere=new u.Sphere(new u.Vector3,.8),await A.yield();const ft=ce.length,ge=new u.Vector3,Ce=new u.Vector3,ut=new u.Vector3,p0=new u.Matrix4,re=new u.Vector3,m0=new u.Vector3,Q0=new u.Quaternion,Y0=new u.Vector3(0,0,1),Vt=[],g0=(e,t,a,o)=>{const n=new u.Mesh(e,X0());n.frustumCulled=!1,n.scale.setScalar(a),I.add(n),Vt.push({mesh:n,posFn:t,tick:o,U:n.material.uniforms})},vt=[[3.2,22.6],[5.4,23.4]].map(([e,t])=>new u.Vector3(e,se(e,t)+.035,t));vt.unshift(Nt(Rt[0],.25,1,-.05,new u.Vector3),Nt(Rt[0],-.35,.8,.5,new u.Vector3)),vt[0].y+=.03,vt[1].y+=.03;const eo=[[-1.4,3.8,1.5],[-1.5,3.4,2.3],[-.4,5.6,3.4],[2.4,4.8,2.6]],dt=[[0,.018],[.002,.024],[.004,.034],[.006,.042]];for(let e=0;e<4;e++){const t=H()*6.28;g0(jt,(a,o,n)=>{const i=le(a),l=p(dt[e][0],dt[e][1],i),h=p(.285+.012*e,.47,i),v=eo[e];return ce.posAtDist(a*ft+v[1]+5*h,n),n.x+=v[0]+.3*Math.sin(o*.8+t)+62*h*Math.sqrt(h),n.y+=-v[2]+.18*Math.sin(o*1.2+t*2)-6*h,n.y=Math.max(n.y,1.2),n.lerpVectors(vt[e],n,l),n.y+=1.1*Math.sin(Math.PI*l)*(1-l),n},e===0?1.3:e<2?1.15:1,(a,o,n)=>{const i=le(o),l=p(dt[e][0],dt[e][1],i);a.U.uOpen.value=p(.12,.6,l),a.roll=(.22*Math.sin(n*.9+t)+.08*Math.sin(n*2.3+t))*l,a.mesh.visible=i<.47})}const to=[[-6.4,7.2,2.2],[-9.2,9.8,3.1],[-5.2,12.5,.9]];for(let e=0;e<3;e++){const t=H()*6.28,a=o=>e===2?p(.455,.492,o)*(1-p(.5,.54,o)):0;g0(Lt,(o,n,i)=>{const l=le(o),h=p(.27,.39,l),v=p(.69,.87,l),c=to[e],f=e===0?p(.4,.455,l)*(1-p(.525,.575,l)):0,s=P(c[1],3.9,f)+(e===0?(4.3-c[1])*v:(34+9*e)*v);ce.posAtDist(o*ft+s,i);const r=(P(c[0],-.7,f)+(10.5+1.5*e)*p(.5+.012*e,.56+.012*e,l))*(1-v)+(e===0?.7*v:-(9+7*e)*v*v)-46*(1-h)*(1-h);return i.x+=r+.45*Math.sin(n*.6+t)*(1-.6*f),i.z+=6*(1-h),i.y+=-P(c[2],.7,f)*(1-v)-(e===0?.5*v:-15*v*v)+.22*Math.sin(n*1.1+t)*(1-.5*f)+2.5*(1-h),i.y=P(Math.max(i.y,1),.32,a(l)),i},e===0?1.25:1,(o,n,i)=>{const l=le(n);o.U.uFlap.value=i*18.85+t,o.U.uAmp.value=p(-.25,.3,Math.sin(i*.62+t))*(1-.9*a(l))*.75,o.roll=.16*Math.sin(i*.7+t),o.mesh.visible=l>.255&&(e!==0||n*ft+4.3<ft-.6)})}ct.push((e,t,a,o)=>{for(let n=0;n<Vt.length;n++){const i=Vt[n];i.roll=0,i.tick(i,o,t),i.mesh.visible&&(i.posFn(o,t,i.mesh.position),i.posFn(o+.004,t,m0),i.posFn(Math.max(0,o-.004),t,re),ge.subVectors(m0,re),ge.lengthSq()<1e-6&&ge.set(Math.sin(n*1.3-.4),0,Math.cos(n*1.3-.4)),ge.normalize(),ut.set(0,1,0),Ce.crossVectors(ut,ge),Ce.lengthSq()<1e-6&&Ce.set(1,0,0),Ce.normalize(),ut.crossVectors(ge,Ce),p0.makeBasis(Ce,ut,ge),i.mesh.quaternion.setFromRotationMatrix(p0),i.mesh.quaternion.multiply(Q0.setFromAxisAngle(Y0,i.roll)))}});const oo=new u.Vector3,w0=e=>Ze?150+(e-.3)*330*(e<.3?.75:1)-190*Math.max(0,e-.38):He(e)+47;ct.push((e,t,a,o)=>{const n=le(o),i=K.object.position;if(a.getWorldPosition(re),Pe[0].set(re.x+1.5,re.z+5,4.5,1),re.z>296?Pe[1].set(re.x-2,re.z+9,5.5,1):Pe[1].set(i.x,i.z,4.2,.3),ke==="shoal"?(f0[2].set(i.x-5.5,-3.6,i.z+5,13),Pe[2].set(i.x,i.z-1,4.4,.3)):Pe[2].set(re.x,re.z+6,4,1),!X)return;const l=w0(n),h=X.uniforms;if(h.uTime.value=t,h.uTrim.value=t*.55+2,Ze){X.object.position.set(-48,0,l),X.setSwim(l),X.setTilt(p(.235,.285,n)*(1-p(.325,.385,n)));const v=p(.278,.297,n)*(1-p(.306,.34,n));h.uLift.value=1.55*v,h.uRise.value=.5*p(.26,.297,n)*(1-p(.31,.36,n)),X.setBreath((n-.28)/.085)}else X.object.position.set(he(l)-2.5,0,l),X.object.rotation.y=Math.atan((he(l+1)-he(l-1))*.5),X.setSwim(K.swimAt(n)+9);X.headWorld(Tt),Tt.y=.06+.16*h.uLift.value/1.55});{const e=Math.round((Z?520:300)*O),t=new u.InstancedBufferGeometry;t.setAttribute("position",new u.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),t.setIndex([0,1,2,0,2,3]);const a=new Float32Array(e*4),o=new Float32Array(e*4),n=G.fork("dust");for(let h=0;h<e;h++)a.set([n.range(-345,-262),n.range(2,12)+(Z?9*n():0),n.range(-420,1050),n()],h*4),o.set([n.range(30,62),n.range(.5,1),n.range(.012,.03),n()],h*4);t.setAttribute("dA",new u.InstancedBufferAttribute(a,4)),t.setAttribute("dB",new u.InstancedBufferAttribute(o,4)),t.instanceCount=e;const i=new u.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,uniforms:{...ee(),uTime:ae.uTime,uDustC:{value:C(Z?"#DDB392":Ue[6],.9)},uReach:{value:Z?190:110},uDen:{value:Z?.125:.06}},vertexShader:`attribute vec4 dA, dB; uniform float uTime, uReach; varying vec2 vUv; varying vec2 vK;
#include <fog_pars_vertex>
void main(){
  float life = fract(uTime * dB.z + dA.w);
  vec3 c = dA.xyz + vec3(life * uReach, life * 5. * dB.w + sin(uTime * .2 + dA.w * 30.) * 1.5, life * 25.);
  vUv = position.xy; vK = vec2(sin(3.14159 * life) * dB.y, dB.w);
  vec4 mvPosition = viewMatrix * vec4(c, 1.);
  mvPosition.xy += position.xy * dB.x * vec2(1.6, .3) * (.7 + .6 * life);
  gl_Position = projectionMatrix * mvPosition;
#include <fog_vertex>
}`,fragmentShader:`uniform vec3 uDustC; uniform float uDen; varying vec2 vUv; varying vec2 vK;
#include <fog_pars_fragment>
${oe}
void main(){
  float r2 = dot(vUv, vUv), n = vn(vUv * 2.2 + vK.y * 40.);
  float a = (1. - smoothstep(.1, 1., r2 + n * .5)) * vK.x * uDen;
  if (a < .003) discard;
  gl_FragColor = vec4(uDustC * (.9 + .25 * n), a);
  #include <fog_fragment>
}`}),l=new u.Mesh(t,i);l.frustumCulled=!1,l.renderOrder=9,I.add(l),await A.yield()}const ho=new u.Vector3,ao=new u.Vector3,Oe=(e,t)=>{const a=le(t),o=He(a),n=p(.385,.45,a)*.2,i=p(.47,.56,a),l=p(.58,.605,a)*(1-p(.625,.655,a)),h=p(.44,.48,a)*(1-p(.515,.555,a));return ao.set(he(o)-1.5-1.6*n*(1-i)+2*i,-3-6*n*(1-i)+2.2*i+2.6*p(.635,.69,a)+3.2*h,o-5.5*n*(1-i)+6.6*i+4*l+7*h)};return{scene:I,path:ce,duration:45,pace:e=>{const t=le(e),a=P(1.25,1.45,p(.1,.2,t)),o=P(a,1,p(.26,.34,t)),n=P(o,.78,p(.37,.45,t)),i=P(n,1.1,p(.67,.75,t));return P(i,.92,p(.82,.9,t))},title:"The Titan's Strait \xB7 202 million years ago",camera:{fov:62,near:.3,far:2500,lookAhead:30,sway:.2,bank:.4},pois:Ze?[{at:Oe,from:-.2,to:fe(.775),weight:.7,fade:.07},{at:Oe,from:fe(.585),to:fe(.765),weight:.6,fade:.2},{at:(e,t)=>oo.set(-48,-1,w0(le(t))+5),from:fe(.2),to:fe(.4),weight:.42,fade:.3}]:[{at:Oe,from:-.2,to:fe(.775),weight:.7,fade:.07},{at:Oe,from:fe(.585),to:fe(.765),weight:.6,fade:.2},{at:Oe,from:-.2,to:.07,weight:.5,fade:.06}],portal:{shape:"circle",radius:7,color:"#bfe6dc",glow:.9,revealDistance:150},post:{exposure:.94,bloom:{strength:.25,radius:.5,threshold:.97},grade:{saturation:1.12,contrast:1.06,tint:"#fff8ee",shadowTint:"#06181c",vignette:.15,grain:.012}},ride:"none",companion:"none",style:"none",update(e,t,a,o){ae.uTime.value=t,kt.update(e,t,a);const n=o;o=le(n);const i=He(o);K.object.position.set(he(i),0,i),K.object.rotation.y=Math.atan((he(i+1)-he(i-1))*.5),K.setProgress(o),K.setSwim(i-105+t*1.4),K.update(e,t,a),K.setBreath((o-.52)/.15),ne.uLift.value=1.55*p(.52,.54,o)*(1-p(.6,.64,o)),ne.uRise.value=.5*p(.514,.553,o)*(1-p(.65,.71,o)),K.setTilt(p(.598,.645,o)*(1-p(.685,.735,o))),K.headWorld(o0),a0.set(K.object.position.x,i,Math.sin(K.object.rotation.y),Math.cos(K.object.rotation.y));for(let l=0;l<ct.length;l++)ct[l](e,t,a,n)},dispose(){kt.dispose()}}}};export{go as default};
