import*as y from"three";import{Geo as J,col as P,v3 as ce,rngOf as O,creatureMaterial as fe,instancedGeo as he,creatureMesh as me,triCount as de,applyLight as ve,sphereOfPoints as K,wingReach as xe,hingeReach as ye,pathLine as pe,lineDist as ie}from"./common.js";function re(t,o,e,n={}){const i=new Float32Array(e*3),x=t.positions,a=t.altitude||n.altitude||[.5,3],h=t.lift||n.lift||[-4,3],u=t.spread??n.spread??14,p=t.clear??n.clear??2.5,c=t.heightAt,m=new y.Vector3,f=new y.Vector3,d=ce(t.center,new y.Vector3(0,2,0)),v=t.radius??n.radius??12,l=t.cluster??n.cluster??0;let A=0,R=0,q=0;for(let M=0;M<e;M++){let z,F,b;if(x&&x.length){const g=x[M%x.length],w=M>=x.length||t.jitter?t.jitter??1:0;z=(g.x??g[0])+o.gauss()*w,F=(g.y??g[1])+o.gauss()*w*.5,b=(g.z??g[2])+o.gauss()*w}else{if(l>0&&M%l!==0)z=A+o.gauss()*1.2,b=q+o.gauss()*1.2,F=R+o.gauss()*.5;else if(t.path){const g=o.range(t.uFrom??.02,t.uTo??.98),w=g*t.path.length;t.path.posAtDist(w,m),t.path.tangentAtDist(w,f);const C=o.sign()*o.range(p,u);z=m.x-f.z*C,b=m.z+f.x*C,F=c?c(z,b)+o.range(a[0],a[1]):m.y+o.range(h[0],h[1])}else{const g=o()*6.283,w=Math.sqrt(o())*v;z=d.x+Math.cos(g)*w,b=d.z+Math.sin(g)*w,F=c?c(z,b)+o.range(a[0],a[1]):d.y+o.range(a[0],a[1])-a[0]}A=z,R=F,q=b}i[M*3]=z,i[M*3+1]=F,i[M*3+2]=b}return i}const ze=`
uniform vec4 uRoam, uFlapI; uniform float uSelf, uBounce; uniform vec3 uColA[8]; uniform vec3 uColB[8];
vec3 hop(float i, float seed){ vec3 h = h31(i * 1.37 + seed); return (h - .5) * 2.; }
`,be=`
vec3 traj(float q){
  vec3 h = h31(iB.z);
#if MOTION == 1
  // dart and hover: hold a point, then streak to the next one
  float t = q * uRoam.z * (.7 + .6 * h.x) + h.y * 10., i = floor(t), f = fract(t);
  float k = smoothstep(.62, 1., f);
  vec3 a = hop(i, iB.z), b = hop(i + 1., iB.z), z = hop(i - 1., iB.z);
  vec3 o = mix(a, b, k) * vec3(uRoam.x, uRoam.y, uRoam.x);
  o += vec3(sin(q * 2.3 + h.x * 9.), sin(q * 3.1 + h.y * 9.), cos(q * 2.7 + h.z * 9.)) * .04 * uRoam.x;
  vec2 d0 = (a - z).xz, d1 = (b - a).xz;
  float y0 = atan(d0.x, d0.y), y1 = atan(d1.x, d1.y), dy = mod(y1 - y0 + 3.14159, 6.28318) - 3.14159;
  gYaw = y0 + dy * smoothstep(.45, .66, f);
  return iA.xyz + o;
#else
  float t = q * uRoam.z * (.6 + .8 * h.x);
  vec3 o = vec3(sin(t + h.y * 6.283) + .5 * sin(t * 2.3 + h.z * 9.), .6 * sin(t * 1.7 + h.x * 20.) + .4 * sin(t * 3.1 + h.y * 7.), cos(t * .9 + h.z * 6.283) + .5 * sin(t * 1.9 + h.x * 5.));
  o *= vec3(uRoam.x, uRoam.y, uRoam.x) * .62;
  o += uRoam.w * vec3(sin(q * 11. * (.7 + h.z) + h.x * 30.), sin(q * 13. * (.7 + h.x) + h.y * 30.), cos(q * 9. * (.7 + h.y) + h.z * 30.));
  float fb = (q * uFlapI.x * (.8 + .4 * h11(iB.z)) + iA.w) * 6.2832;
  o.y += uBounce * (.5 - .5 * cos(fb + 1.2));
  return iA.xyz + o;
#endif
}
`,ge=`
void deform(inout vec3 p, inout vec3 n){
  float side = aAnim.y, hs = h11(iB.z);
  if(abs(side) > .5){
    float t = (uTime * uFlapI.x * (.8 + .4 * hs) + iA.w) * 6.2832 - aAnim.z;
    float gl = 0.;
    if(uFlapI.w > .01){ float th = 1. - 2. * uFlapI.w; gl = smoothstep(th - .15, th + .15, sin(uTime * (1.1 + .9 * hs) + iB.z * 37.)); }
    float ang = mix(uFlapI.z + uFlapI.y * sin(t), .35, gl);
    float d = aAnim.x, sx = p.x - side * d;
    p.x = sx + side * d * cos(ang); p.y += d * sin(ang);
    n.xy = rot2(-side * ang) * n.xy;
    gThin = 1.;
  }
#ifdef PAINT
  int v = int(iB.y + .5);
  vColor = mix(mix(uColA[v], uColB[v], color.g), vec3(.8, .9, 1.), color.b) * color.r * iTint;
#endif
  gEmit = vColor * uSelf * (abs(side) > .5 ? 1. : .3) + uGlowColor * aGlow;
}
`,B=(t,o=0,e=0)=>new y.Color(t,o,e);function we(t,o,e,n){const i=(h,u,p)=>{const c=h[0],m=[],f=[],d=h.length,v=t.v(c[0],c[1],c[2],B(.55));for(let l=1;l<d;l++){const A=h[l],R=e.spots&&l%2===0&&l>1&&l<d-1;f.push(t.v(c[0]+(A[0]-c[0])*.66,A[1],c[2]+(A[2]-c[2])*.66,B(p))),m.push(t.v(A[0],A[1],A[2],R?B(1,1):B(e.border??.1,e.borderMix??0)))}for(let l=0;l<f.length-1;l++)t.tri(v,f[l],f[l+1]),t.quad(f[l],m[l],m[l+1],f[l+1]);return u},x=t.n;i(e.fore.map(([h,u])=>[.012*o+h*o,.01*o,u*o]),0,1);const a=t.n;i(e.hind.map(([h,u])=>[.012*o+h*o,.006*o,u*o]),n,.92),t.anim([x,a],h=>[Math.max(0,h-.012*o),1,0,0]),t.anim([a,t.n],h=>[Math.max(0,h-.012*o),1,n,0]),t.mirror([x,t.n])}const se={butterfly:{spots:!0,border:.08,fore:[[0,.06],[.45,.5],[.95,.72],[1,.42],[.86,.12],[.5,-.04],[0,-.04]],hind:[[0,-.02],[.55,-.02],[.8,-.2],[.74,-.52],[.42,-.78],[.2,-.6],[0,-.3]]},swallowtail:{spots:!0,border:.06,fore:[[0,.06],[.5,.56],[1.05,.8],[1.02,.4],[.82,.08],[.45,-.05],[0,-.04]],hind:[[0,-.02],[.55,-.04],[.76,-.3],[.6,-.62],[.5,-1.05],[.36,-.66],[0,-.3]]},moth:{spots:!1,border:.45,borderMix:.6,fore:[[0,.1],[.5,.34],[1,.3],[.95,-.08],[.6,-.3],[.25,-.3],[0,-.1]],hind:[[0,-.05],[.4,-.2],[.62,-.42],[.45,-.66],[.18,-.6],[0,-.35]]}};function le(t={}){const o=new J,e=t.span??.11,n=se[t.shape]||se.butterfly,i=t.bodyColor?B(t.bodyBright??.12):B(.1);return o.loft([{z:-.6*e,rx:0,ry:0},{z:-.3*e,rx:.035*e,ry:.04*e},{z:.1*e,rx:.055*e,ry:.06*e},{z:.3*e,rx:.045*e,ry:.05*e},{z:.38*e,rx:0,ry:0}],{sides:4,top:i,belly:i}),t.shape==="moth"&&o.paint([0,o.n],(x,a,h,u)=>{u.r=.55,u.g=.5}),we(o,e,n,t.shape==="moth"?.2:.45),o.build()}const Ae=[["#ff8a14","#fff2d8"],["#2a8cff","#c8ecff"],["#ffe04a","#3a6cff"],["#f6f2e8","#ffcf4a"],["#ff6aa8","#ffe2f0"],["#8ae04a","#f4ffc0"],["#b06aff","#ffd0ff"],["#ff4a3a","#ffd84a"]],Me=[["#efe6d2","#9a8a6c"],["#f6f3ea","#cdbfa6"],["#cbbba0","#6e5c48"],["#e6e0f0","#9a90b4"],["#dfe8d2","#8a9a70"]];function S(t,o,e,n){const i=Math.max(1,Math.floor(o.count??n.count)),x=o.size??n.size??1,a=re(o,e,i,n),h=(o.varieties||n.varieties||[["#ffffff","#ffffff"]]).slice(0,8),u=h.length,p=[],c=[];for(let s=0;s<8;s++){const r=h[s%u];p.push(P(r[0])),c.push(P(r[1]))}const m=new Float32Array(i*4),f=new Float32Array(i*4),d=new Float32Array(i*3);for(let s=0;s<i;s++){m.set([a[s*3],a[s*3+1],a[s*3+2],e()],s*4),f.set([x*e.range(.7,1.3),e.int(0,u-1),e()*100,0],s*4);const r=e.range(.85,1.1);d.set([r,r,r],s*3)}const v=o.roam||n.roam,l=o.flap||n.flap,A=n.motion===1,R=fe({instanced:!0,upright:A,light:o.light,bank:0,eps:.08,level:A?void 0:n.level??.5,pre:ze,traj:be,deform:ge,defines:{MOTION:n.motion||0,...n.paint?{PAINT:1}:{}},near:o.nearFade||[.5,1.6],rim:o.rim??n.rim??.3,spec:n.spec??.3,shine:n.shine??30,trans:o.translucency??n.trans??1.2,vivid:o.vivid??n.vivid??.6,glow:P(o.glow??n.glow??"#000000"),uniforms:{uRoam:{value:new y.Vector4(v[0],v[1],v[2],v[3])},uFlapI:{value:new y.Vector4(l[0],l[1],l[2],l[3])},uSelf:{value:o.selfLit??n.self??0},uBounce:{value:o.bounce??n.bounce??0},uColA:{value:p},uColB:{value:c},uThinAlpha:{value:n.thinAlpha??1}}}),q=Math.hypot(v[0],v[1],v[0])*1.3+x,M=K(a,3,i,q),z=he(t,i,m,f,d),F=me(z,R,0,M),b=R.uniforms,g=s=>{s&&s!==a&&a.set(s);for(let r=0;r<i;r++)m[r*4]=a[r*3],m[r*4+1]=a[r*3+1],m[r*4+2]=a[r*3+2];z.attributes.iA.needsUpdate=!0,M.copy(K(a,3,i,q))};let w=0;for(let s=0;s<i;s++)w=Math.max(w,f[s*4]);const C=Math.abs(v[0]),Q=Math.abs(v[1]),j=Math.abs(v[3]),E=A?[1.04*C,Q+.04*C,1.04*C]:[.93*C+j,.62*Q+j+Math.abs(b.uBounce.value),.93*C+j],X=w*xe(t),Z=w*ye(t),ue={roam:E,body:X,swept:Z,radius:Math.hypot(E[0],E[1],E[2])+X};let $=null;const T=o.keepClear;if(T&&T.path){const s=pe(T.path,{step:T.step??.5,from:T.from,to:T.to,length:T.length}),r=new y.Vector3,I=Math.hypot(E[0],E[1],E[2])+Z+(T.dist??2)+(s.sag||0);let N=0,H=0,U=0;for(let k=0;k<i;k++){const W=a[k*3],D=a[k*3+1],ee=a[k*3+2];let G=W,_=D,V=ee,L=ie(s,G,_,V,r);if(!(L>=I)){for(let te=0;te<8&&L<I;te++){const oe=G-r.x,ae=V-r.z,Y=Math.hypot(oe,ae);if(Y<.001){if(!T.up)break;_=r.y+I+.001}else{const ne=Math.sqrt(Math.max(0,I*I-(_-r.y)*(_-r.y)))+.001;G=r.x+oe/Y*ne,V=r.z+ae/Y*ne}L=ie(s,G,_,V,r)}a[k*3]=G,a[k*3+1]=_,a[k*3+2]=V,N++,H=Math.max(H,Math.hypot(G-W,_-D,V-ee)),U=Math.max(U,I-L)}}N&&g(),$={need:I,count:N,moved:H,short:Math.max(0,U)}}return{object:F,material:R,uniforms:b,geometry:z,count:i,anchors:a,bounds:M,triangles:de(t)*i,reach:ue,kept:$,setAnchors:g,setAnchor(s,r,I,N){a[s*3]=r,a[s*3+1]=I,a[s*3+2]=N,g()},update(s,r){b.uTime.value=r,b.uQ.value=r,b.uPhase.value=r},setLight(s,r){ve(b,s,r)},positionAt(s,r,I=new y.Vector3){return I.set(a[0],a[1],a[2])}}}function ke(t={}){const o=O(t),e=t.span??.11;return S(le({span:e,shape:t.shape||"butterfly"}),t,o,{count:60,size:1,paint:!0,varieties:Ae,roam:[2.6,1,.55,.03],flap:[5.5,.85,.5,.18],bounce:.12,self:.12,altitude:[.6,3.2],lift:[-4,2.5],spread:14,clear:2.5})}function Pe(t={}){const o=O(t),e=t.span??.09;return S(le({span:e,shape:"moth"}),t,o,{count:70,size:1,paint:!0,varieties:Me,roam:[1.3,.8,1.5,.07],flap:[9,.75,.3,0],bounce:.05,self:.5,vivid:.3,altitude:[1,4],lift:[-3,3],spread:10,clear:2})}function Be(t={}){const o=new J,e=t.len??.13;o.blob(0,.01*e,.3*e,.075*e,.06*e,.06*e,B(.5,1),null,5,3),o.loft([{z:.26*e,rx:.03*e,ry:.03*e},{z:.16*e,rx:.07*e,ry:.075*e},{z:0,rx:.06*e,ry:.065*e},{z:-.08*e,rx:.03*e,ry:.032*e}],{sides:5,top:B(.9),belly:B(.5)});const n=[],i=[],x=7;for(let p=0;p<=x;p++){const c=p/x;n.push([0,-.03*e*Math.sin(c*2.4),(-.08-c*.62)*e]),i.push(p===x?0:.026*e*(1-.35*c))}const a=o.n;o.tube(n,i,4,B(1),B(1)),o.paint([a,o.n],(p,c,m,f,d)=>{const v=Math.floor((d-a)/4)%2;f.setRGB(v?.35:1,v?1:0,0)});const h=o.n,u=(p,c,m,f,d)=>{const v=[],l=[],A=[],R=[];for(let z=0;z<=4;z++){const F=z/4,b=.03*e+F*m*e,g=p*e+c*F*e,w=f*e*(.55+.6*Math.sin(Math.min(1,F*1.1)*2.6));v.push([b,.07*e,g+w*.4]),l.push([b,.07*e,g-w*.6]),A.push(B(z===3?.45:.9,0,1)),R.push(B(.8,0,1))}const M=o.strip(v,l,A,R);o.anim(M,z=>[Math.max(0,z-.03*e),1,d,0])};return u(.12,.05,.52,.1,0),u(.02,-.06,.5,.12,2.6),o.mirror([h,o.n]),o.build()}const Fe=[["#18d8c8","#0a2a44"],["#ff3a2a","#40100a"],["#3ae06a","#103818"],["#2a7cff","#0a1840"],["#ffc02a","#402808"]];function Ee(t={}){const o=O(t);return S(Be({len:t.length??.13}),t,o,{count:24,size:1,paint:!0,motion:1,varieties:Fe,roam:[2.4,.7,.75,0],flap:[26,.42,.06,0],self:.1,spec:2.5,shine:40,thinAlpha:.55,trans:1.5,altitude:[.4,2.2],lift:[-4,1.5],spread:12,clear:2})}function Re(t={}){const o=new J,e=t.len??.05,n=P(t.yellow??"#ffb81a"),i=P(t.black??"#1a1410"),x=P(t.wing??"#dfe8f0"),a=[-.5,-.42,-.28,-.14,0,.1,.2,.32,.42,.5],h=[0,.15,.24,.27,.24,.17,.2,.2,.14,0],u=[i,i,n,i,n,i,n,n,i,i];o.loft(a.map((m,f)=>({z:m*e,rx:h[f]*e,ry:h[f]*e*.95,top:u[f],belly:u[f]})),{sides:6});const p=o.n,c=o.fan([[.06*e,.2*e,.2*e],[.5*e,.22*e,.1*e],[.62*e,.22*e,-.15*e],[.4*e,.2*e,-.3*e],[.1*e,.2*e,-.02*e]],x);return o.anim(c,m=>[Math.max(0,m-.06*e),1,0,0]),o.mirror([p,o.n]),o.build()}function _e(t={}){const o=O(t);return S(Re({len:t.length??.05,yellow:t.yellow,black:t.black}),t,o,{count:90,size:1,motion:0,roam:[1.1,.6,2.4,.06],flap:[38,.7,.25,0],self:.08,level:.4,spec:.6,thinAlpha:.5,trans:1.2,vivid:.5,altitude:[.4,2],lift:[-3,1.5],spread:9,clear:2,cluster:9})}const Ie=`
#include <fog_pars_vertex>
attribute vec4 iA; attribute vec4 iB;
uniform float uTime, uSize, uMinPx; uniform vec4 uRoam, uBlink; uniform vec2 uNearF;
varying vec2 vP; varying float vI, vMix;
vec3 h31(float n){ return fract(sin(vec3(n*127.1, n*269.5+1.7, n*419.2+3.1))*43758.5453); }
void main(){
  vec3 h = h31(iB.z); float t = uTime * uRoam.z * (.5 + h.x);
  vec3 o = vec3(sin(t + h.y * 6.283) + .5 * sin(t * 2.1 + h.z * 9.), .7 * sin(t * 1.3 + h.x * 20.) + .3 * sin(t * 2.9 + h.y * 4.), cos(t * .8 + h.z * 6.283) + .5 * sin(t * 1.7 + h.x * 5.)) * vec3(uRoam.x, uRoam.y, uRoam.x) * .6;
  o += uRoam.w * vec3(sin(uTime * 5. * (.6 + h.z) + h.x * 30.), sin(uTime * 6. * (.6 + h.x) + h.y * 30.), 0.);
  float ph = uTime * uBlink.x * mix(.7 + .6 * h.y, 1., uBlink.z) * 6.2832 + mix(iA.w * 6.2832, dot(iA.xz, vec2(.05, .03)), uBlink.z);
  float b = max(pow(max(sin(ph), 0.), mix(1., 7., uBlink.y)), uBlink.w);
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(iA.xyz + o, 1.);
  float dist = -mvPosition.z, want = uSize * iB.x, sz = max(want, dist * uMinPx);
  mvPosition.xy += position.xy * sz;
  gl_Position = projectionMatrix * mvPosition;
  vP = position.xy; vI = b * (want * want) / (sz * sz) * smoothstep(uNearF.x, uNearF.y, dist); vMix = iB.y;
  #include <fog_vertex>
}`,Te=`
#include <fog_pars_fragment>
uniform vec3 uColorA, uColorB; uniform float uCore, uHalo; varying vec2 vP; varying float vI, vMix;
void main(){
  float r2 = dot(vP, vP); if(r2 > 1.) discard;
  float core = exp(-r2 * 60.), halo = exp(-r2 * 5.) * (1. - r2);
  vec3 c = mix(uColorA, uColorB, vMix) * (core * uCore + halo * uHalo) * vI;
  #ifdef USE_FOG
    #ifdef FOG_EXP2
    c *= exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
    c *= 1. - smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #endif
  gl_FragColor = vec4(c, 1.);
}`;function qe(t={}){const o=O(t),e=Math.max(1,Math.floor(t.count??350)),n=re(t,o,e,{altitude:[.3,4],lift:[-5,4],spread:26,clear:1.5,radius:25}),i=new Float32Array(e*4),x=new Float32Array(e*4);for(let d=0;d<e;d++)i.set([n[d*3],n[d*3+1],n[d*3+2],o()],d*4),x.set([o.range(.6,1.5),o()<(t.mix??.25)?o():0,o()*100,0],d*4);const a=new y.InstancedBufferGeometry,h=new y.PlaneGeometry(2,2);a.index=h.index,a.setAttribute("position",h.attributes.position),a.setAttribute("iA",new y.InstancedBufferAttribute(i,4)),a.setAttribute("iB",new y.InstancedBufferAttribute(x,4)),a.instanceCount=e;const u=t.roam||[2.2,1,.35,.05],p={...y.UniformsUtils.clone(y.UniformsLib.fog),uTime:{value:0},uSize:{value:t.size??.16},uMinPx:{value:t.minPixel??.0022},uRoam:{value:new y.Vector4(u[0],u[1],u[2],u[3])},uBlink:{value:new y.Vector4(t.blink??.32,t.sharpness??.5,t.sync??0,t.floor??.04)},uColorA:{value:P(t.color??"#d8ff5a")},uColorB:{value:P(t.color2??"#ffb040")},uNearF:{value:new y.Vector2(...t.nearFade||[1.5,4])},uCore:{value:t.core??9},uHalo:{value:t.halo??1.4}},c=new y.ShaderMaterial({uniforms:p,vertexShader:Ie,fragmentShader:Te,fog:!0,transparent:!0,depthWrite:!1,blending:y.AdditiveBlending}),m=K(n,3,e,Math.hypot(u[0],u[1],u[0])+1);a.boundingSphere=m;const f=new y.Mesh(a,c);return f.frustumCulled=!0,f.renderOrder=3,{object:f,material:c,uniforms:p,geometry:a,count:e,anchors:n,bounds:m,triangles:e*2,update(d,v){p.uTime.value=v},setLight(){},positionAt(d,v,l=new y.Vector3){return l.set(n[0],n[1],n[2])}}}export{Ae as BUTTERFLY_VARIETIES,Fe as DRAGONFLY_VARIETIES,Me as MOTH_VARIETIES,Re as beeGeometry,le as butterflyGeometry,Be as dragonflyGeometry,_e as makeBees,ke as makeButterflies,Ee as makeDragonflies,qe as makeFireflies,Pe as makeMoths,re as scatterAnchors};
