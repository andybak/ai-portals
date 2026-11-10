import*as G from"three";import{Geo as I,col as y,rngOf as _,resolveRoute as H,routeBounds as j,creatureMaterial as O,instancedGeo as N,creatureMesh as S,triCount as J}from"./common.js";import{makeSwimmer as K,hull as Q}from"./marine.js";import{makeJellyfish as U}from"./fish.js";import{makeHerd as X}from"./land.js";const V=[[.495,.01,-.018,.032,.7],[.47,.024,-.044,.066,.7],[.43,.036,-.072,.092,.7],[.37,.048,-.098,.108,.75],[.3,.058,-.108,.112,.8],[.22,.068,-.1,.104,.9],[.12,.076,-.086,.092,1],[.02,.078,-.07,.078,1],[-.08,.074,-.058,.063,1],[-.18,.064,-.046,.049,1.05],[-.28,.052,-.036,.035,1.1],[-.36,.04,-.028,.024,1.1],[-.43,.028,-.02,.016,1.1],[-.48,.016,-.012,.01,1],[-.5,.006,-.004,.004,1]],q=t=>{const o=V;let e=0;for(;e<o.length-2&&o[e+1][0]>t;)e++;const l=o[e],d=o[e+1],n=Math.min(1,Math.max(0,(l[0]-t)/(l[0]-d[0])));return[l[1]+(d[1]-l[1])*n,l[2]+(d[2]-l[2])*n,l[3]+(d[3]-l[3])*n]};function Y(t={}){const o=new I,e=t.len??48,l=(n,r,f)=>new G.Color(n,r,f);Q(o,V,e,t.sides??18,{eb:1.35,yc:()=>.55,paint:(n,r,f,u)=>{const[a,c]=q(n),w=(r-c)/(a-c);u.setRGB(.82+.18*Math.max(0,f),1-Math.min(1,Math.max(0,(w-.25)/.4)),0)}});const d=(n,r,f,u)=>{const[a,c,w]=q(n),p=w*.86*e,b=(c+(a-c)*.42)*e,g=n*e,M=7,x=[],F=[],P=[],h=[];for(let v=0;v<=M;v++){const m=v/M,z=p+m*r*e,k=g-Math.pow(m,1.5)*r*e*.75,L=f*e*(1-.8*Math.pow(m,1.3));x.push([z,b-m*u*e,k+L*.35]),F.push([z,b-m*u*e-.002*e,k-L*.65]),P.push(l(1,.15+.35*m,.5)),h.push(l(1,1,.5))}const i=o.strip(x,F,P,h);o.anim(i,v=>[Math.max(0,(v-p)/(r*e)),1,1,0]),o.pivot(i,p,b,g),o.mirror(i)};d(.2,.32,.15,.04),d(.02,.23,.11,.035),d(-.14,.16,.08,.025);for(const n of[-1,1]){const r=[],f=[],u=[],a=[];for(let p=0;p<=9;p++){const b=p/9,g=-.47*e-b*.36*e,M=n*(.004*e+Math.pow(b,1.3)*.13*e),x=.012*e+.07*e*Math.sin(Math.min(1,b*1.15+.08)*Math.PI)*(1-.3*b);r.push([M+n*x*.7,.004*e,g+x*.3]),f.push([M-n*x*.3,0,g-x*.5]),u.push(l(1,.9,.5)),a.push(l(1,.25,.5))}const w=o.strip(r,f,u,a);o.anim(w,(p,b,g)=>[0,0,0,Math.max(0,(-.47*e-g)/(.36*e))*1.5])}for(let n=0;n<12;n++){const r=.24-n*.045,f=q(r)[0]*e,u=r*e,a=.055*e*Math.sin((n+.5)/12*Math.PI)+.012*e;o.fan([[0,f-.004*e,u+.022*e],[0,f+a,u-.04*e],[0,f-.004*e,u-.032*e]],l(1,.1,.5),l(1,1,.5))}for(const n of[-1,1]){o.tube([[n*.03*e,-.045*e,.45*e],[n*.07*e,-.1*e,.37*e],[n*.09*e,-.13*e,.25*e],[n*.095*e,-.125*e,.12*e]],[.006*e,.0045*e,.003*e,.0012*e],4,l(1,.1,.5),l(1,1,.5)),o.tube([[n*.04*e,.03*e,.42*e],[n*.075*e,.075*e,.35*e],[n*.092*e,.1*e,.26*e]],[.009*e,.0055*e,0],5,l(1,0,1));const r=o.blob(n*.071*e,-.012*e,.455*e,.006*e,.009*e,.011*e,l(.05,0,1),null,6,3);o.glow(r,2.2)}return o.build()}const Z=`
uniform vec3 uLTop, uLBel, uLFin, uLEdge, uLHorn, uGlowF; uniform float uWL; uniform vec4 uLGlow;
float lh(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec3 pattern(vec3 base, vec3 lp, float mask){
  vec3 q = lp / uWL; float zn = q.z, part = base.b, t = uTime;
  vec3 c;
  if(part < .25){
    float k = base.g, th = atan(q.x, -q.y);
    float n = lh(floor(vec2(zn * 60., th * 5.)));
    c = mix(uLTop, uLBel, smoothstep(.2, .8, k)) * (.8 + .4 * n);
    float body = smoothstep(-.47, -.38, zn) * (1. - smoothstep(.4, .48, zn));
    // lanterns: soft discs on the lateral line, pulsing in a wave toward the tail
    float cell = zn * uLGlow.x, ci = floor(cell); vec2 d = vec2((fract(cell) - .5) / uLGlow.x, (k - .52) * .07);
    float disc = smoothstep(.016, .003, length(d)) * body;
    float wave = .35 + .65 * pow(.5 + .5 * sin(t * uLGlow.z + ci * .55), 2.);
    // flowing bands along the belly and pouch
    float ph = th * 7. + 1.6 * sin(zn * 7. + t * .15), w = fwidth(ph);
    float band = (1. - smoothstep(.0, .2 + w, abs(sin(ph)))) * (1. - smoothstep(.8, 2., w)) * smoothstep(.55, .9, k) * body;
    float run = .25 + .75 * pow(.5 + .5 * sin(zn * 16. - t * uLGlow.w), 3.);
    // spots on the back
    vec2 gp = vec2(zn * 46., th * 7.); vec2 gi = floor(gp); float hs = lh(gi);
    float spot = smoothstep(.3, .08, length(fract(gp) - .5 - .25 * (vec2(hs, lh(gi + 7.)) - .5))) * step(.55, hs) * (1. - smoothstep(.2, .4, k)) * body * (.3 + .7 * pow(.5 + .5 * sin(t * 1.1 + hs * 40.), 3.));
    spot *= 1. - smoothstep(.25, .7, length(fwidth(gp)));
    gEmitF = uGlowF * (disc * wave * 1.6 + band * run * .9 + spot * 1.1);
    c *= 1. - .5 * disc;
  } else if(part < .75){
    float e = base.g;
    c = mix(uLFin, uLEdge, e * .7);
    gEmitF = uGlowF * (smoothstep(.72, 1., e) * (.5 + .5 * sin(t * 1.3 - zn * 16.)) * 1.1 + .05);
  } else { c = uLHorn; }
  return c * base.r;
}
`;function u0(t={}){const o=_(t),e=t.length??48,l=t.glowIntensity??2.2,d=Y({len:e});return K(d,t,o,{len:e,speed:6,count:1,light:"alien",center:[0,70,0],radius:190,height:14,span:700,swim:[.085,.045,4.6,.42],fin:[.095,.42,-.06,1.7],bank:50,bob:1.5,rim:.9,spec:.8,shine:22,caustics:0,glow:t.glow??"#3affe0",glowK:l,glowAnim:[.5,.5,1.3,16],scales:[.4,.55,.3],spread:[e*.9,e*.4,e*.9],pattern:Z,near:.03,uniforms:{uLTop:{value:y(t.top??"#2a2f78")},uLBel:{value:y(t.belly??"#2c7f8c")},uLFin:{value:y(t.fin??"#3a3f9a")},uLEdge:{value:y(t.edge??"#58c8d8")},uLHorn:{value:y(t.horn??"#c8d8f0")},uGlowF:{value:y(t.glow??"#3affe0").multiplyScalar(l)},uWL:{value:e},uLGlow:{value:new G.Vector4(t.lanterns??22,0,1.4,1.1)}}})}function c0(t={}){const o=_(t);return U({preset:o.pick?o.pick(["orchid","lagoon","ember"]):"orchid",count:14,size:5,radius:.55,length:3.4,spread:[70,18,70],center:[0,40,0],pulse:.16,thrust:.7,drift:[6,3,6],light:"alien",glowIntensity:1.6,hueVariety:1,opacity:.85,clear:20,...t,rng:o})}const $=`
uniform float uLen, uWidth; uniform vec4 uWave, uPulse; uniform vec3 uColA, uColB;
varying float vAlong, vAcross;
`,e0=`
vec3 traj(float q){
  float s = q - iA.z; vec3 h = h31(iB.z);
  gFade = endFade(s);
  vec3 w = vec3(sin(s * .021 * (.7 + h.x) + h.y * 30.), sin(s * .017 * (.7 + h.z) + h.x * 30.), cos(s * .019 * (.7 + h.y) + h.z * 30.)) * uWave.w;
  return routeAt(s) + vec3(iA.x, iA.y, iB.w) + w;
}
`,t0=`
void deform(inout vec3 p, inout vec3 n){
  float t = aAnim.y, seed = iB.z, ph = (uPhase * uWave.x * (.8 + .4 * h11(seed)) + iA.w) * 6.2832;
  float amp = uWave.y * (.2 + t), arg = t * uWave.z - ph;
  p.y += aAnim.x * uWidth * .16 * sin(t * 90. - ph * 4.);          // the fin edges ripple
  p.xy = rot2(t * 4.2 + uTime * .35 + seed) * p.xy;                 // a slow twist runs down the ribbon
  p.x += amp * sin(arg); p.y += amp * .6 * cos(arg * .83 + 1.);
  vAlong = t; vAcross = aAnim.x;
}
`,o0=`
#include <fog_pars_fragment>
uniform vec3 uColA, uColB; uniform vec4 uPulse; uniform float uTime;
varying vec3 vColor, vN, vWorld, vEmit, vLocal; varying float vThin, vAlong, vAcross;
void main(){
  float ax = abs(vAcross), fw = fwidth(vAcross);
  float sheet = 1. - ax * ax, spine = 1. - smoothstep(.0, .14 + fw, ax), edge = smoothstep(.62 - fw, .9, ax) * (1. - smoothstep(.93, 1., ax));
  float ends = smoothstep(.0, .03, vAlong) * (1. - smoothstep(.7, 1., vAlong));
  float pulse = uPulse.x + uPulse.y * pow(.5 + .5 * sin(vAlong * uPulse.w - uTime * uPulse.z), 4.);
  float bars = .75 + .25 * sin(vAlong * 260.);
  vec3 hue = mix(uColA, uColB, smoothstep(.04, .75, vAlong)) * vColor;
  vec3 c = hue * (.3 * sheet * bars + 1.05 * spine + .55 * edge) * pulse * ends;
  c += uColA * exp(-vAlong * 45.) * 1.2 * sheet;
  #ifdef USE_FOG
    #ifdef FOG_EXP2
    c *= exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
    c *= 1. - smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #endif
  gl_FragColor = vec4(c, 1.);
}
`;function h0(t={}){const o=_(t),e=Math.max(1,Math.floor(t.count??9)),l=t.length??26,d=t.width??.7,n=48,r=new I,f=new G.Color(1,1,1),u=[];for(let s=0;s<=n;s++){const A=s/n,E=Math.min(1,A/.035),B=Math.min(1,(1-A)/.3),C=d*Math.sqrt(E)*(.25+.75*B*B*(3-2*B))*(s===2?1.25:1),W=-A*l,R=[r.v(-C,0,W,f),r.v(0,0,W,f),r.v(C,0,W,f)];u.push(R),r.a[R[0]*4]=-1,r.a[R[2]*4]=1;for(const D of R)r.a[D*4+1]=A}for(let s=0;s<n;s++)r.quad(u[s][0],u[s][1],u[s+1][1],u[s+1][0]),r.quad(u[s][1],u[s][2],u[s+1][2],u[s+1][1]);const a=r.build(),c=t.speed??9,w=H({...t,speed:c},o,{center:[0,30,0],radius:70,height:16,span:400,wobble:.4}),p=new Float32Array(e*4),b=new Float32Array(e*4),g=new Float32Array(e*3),M=t.spread||[14,8,60],x=new G.Color;let F=0,P=0;for(let s=0;s<e;s++)p.set([o.gauss()*M[0]*.5,o.gauss()*M[1]*.5,o()*M[2]+s*3,o()],s*4),b.set([o.range(.6,1.3)*(t.size??1),0,o()*100,o.gauss()*M[0]*.5],s*4),x.setHSL(o(),.5*(t.hueVariety??.5),.75),g.set([x.r,x.g,x.b],s*3),F=Math.max(F,Math.hypot(p[s*4],p[s*4+1],b[s*4+3])),P=Math.max(P,p[s*4+2]);const h=t.intensity??1.2,i=[t.waveSpeed??.45,t.wave??1.6,t.waves??9,t.wander??6],v=(t.size??1)*1.3,m=O({instanced:!0,spine:!0,route:w.route,light:t.light||"alien",eps:1.5,pre:$,traj:e0,deform:t0,frag:o0,transparent:!0,depthWrite:!1,blending:G.AdditiveBlending,near:[1.5,5],uniforms:{uLen:{value:l},uWidth:{value:d},uWave:{value:new G.Vector4(...i)},uPulse:{value:new G.Vector4(.5,1.1,t.pulseSpeed??2.4,t.pulses??26)},uColA:{value:y(t.color??"#5affea").multiplyScalar(h)},uColB:{value:y(t.color2??"#c050ff").multiplyScalar(h)}}}),z=j(w,F+i[3]*1.8+i[1]*2+d*2,P+l*v),k=N(a,e,p,b,g),L=S(k,m,3,z.sphere),T=m.uniforms;return{object:L,material:m,uniforms:T,geometry:k,count:e,route:w.route,bounds:z.sphere,triangles:J(a)*e,update(s,A,E,B){const C=w.step(s,A,B);T.uTime.value=A,T.uPhase.value=A+w.state.extra,T.uVis.value=w.state.vis,T.uQ.value=C,z.follow(C)},setLight(){},positionAt(s,A,E=new G.Vector3){return w.route.pointAt(w.travel(s,A),E)}}}function a0(t={}){const o=new I,e=t.h??9,l=y(t.coat??"#4a3f8a"),d=y(t.belly??"#2a8a8a"),n=y(t.legs??"#3a3470"),r=y(t.sock??"#1e1a44"),f=y(t.accent??"#7ad8e0"),u=y("#ffffff"),a=.17*e,c=e,w=o.loft([{z:-a*1.2,y:c,rx:0,ry:0},{z:-a*.85,y:c,rx:a*.55,ry:a*.3},{z:-a*.2,y:c+.02*e,rx:a,ry:a*.52},{z:a*.5,y:c+.02*e,rx:a*.85,ry:a*.5},{z:a*1.05,y:c,rx:a*.4,ry:a*.3},{z:a*1.3,y:c-.01*e,rx:0,ry:0}],{sides:10,top:l,belly:d,shade:[-.5,.2]});o.glow(w,(h,i,v)=>Math.abs(i-c+a*.12)<a*.1&&Math.abs(h)>a*.3?1:0);for(let h=0;h<5;h++){const i=a*(.6-h*.35),v=a*(.5+.5*Math.sin((h+.5)/5*Math.PI)),m=o.fan([[0,c+a*.42,i+a*.15],[0,c+a*.45+v,i-a*.3],[0,c+a*.4,i-a*.22]],l,f);o.glow(m,(z,k)=>k>c+a*.5+v*.5?1:0)}for(const h of[-1,1]){const i=o.blob(h*a*.42,c+a*.1,a*.95,a*.09,a*.09,a*.09,u,null,5,3);o.glow(i,2)}const p=(h,i)=>{const v=Math.sin(h),m=Math.cos(h),z=v*a*.6,k=m*a*.6,L=c-a*.2,T=[[z,L,k],[v*.3*e,L+.12*e,m*.3*e],[v*.36*e,.52*e,m*.36*e],[v*.3*e,.06*e,m*.3*e],[v*.3*e,0,m*.3*e+.01*e]],s=o.tube(T,[.022*e,.03*e,.016*e,.011*e,.03*e],5,n,r);o.anim(s,(A,E)=>[i,Math.min(1,Math.max(0,(L+.12*e-E)/(L+.12*e)))*(E>L&&Math.hypot(A,0)<99,1),1,0]),o.pivot(s,z,L,k),o.glow(s,(A,E)=>Math.abs(E-(L+.12*e))<.03*e||Math.abs(E-.52*e)<.035*e?1.2:0)};p(0,0),p(Math.PI*2/3,.33),p(-Math.PI*2/3,.66);const b=o.n,g=[0,c-a*.25,a*.9],M=[],x=[],F=8;for(let h=0;h<=F;h++){const i=h/F;M.push([0,g[1]-i*.36*e-Math.sin(i*Math.PI)*.03*e,g[2]+Math.sin(i*Math.PI*.6)*.16*e]),x.push(.028*e*(1-.55*i))}const P=o.tube(M,x,5,l,f);return o.glow(P,(h,i)=>i<g[1]-.3*e?1.5:0),o.anim([b,o.n],(h,i)=>[Math.min(1,Math.max(0,(g[1]-i)/(.2*e))),0,2,0]),o.pivot([b,o.n],g[0],g[1],g[2]),o.build()}const n0={h:9,bodyLen:.4,speed:1.6,stride:.5,graze:.75,pattern:"none",count:5,sizes:[1,.8,.9,.55,.7],coat:"#4a3f8a",belly:"#2a8a8a",legs:"#3a3470",sock:"#1e1a44",accent:"#7ad8e0",glow:"#58ffe8",glowK:1.1,glowAnim:[.6,.4,1.6,0],shadow:[3.6,3.6,0]};function f0(t={}){const o={...n0,...t.height?{h:t.height,shadow:[t.height*.4,t.height*.4,0]}:{}};for(const e of["coat","belly","legs","sock","accent"])t[e]!==void 0&&(o[e]=t[e]);return X({light:"alien",swing:.2,pause:.11,roam:2.2,radius:60,...t,preset:o,geometry:a0(o)})}export{n0 as TRIPOD_PRESET,Y as leviathanGeometry,c0 as makeFloatingJellies,u0 as makeLeviathan,h0 as makeRibbonEels,f0 as makeTripods,a0 as tripodGeometry};
