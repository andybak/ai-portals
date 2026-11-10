import*as a from"three";import{mergeVertices as Re}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as ce,lerp as me,smoothstep as z}from"../kit/core.js";const Ee=["#3F86C9","#BFE2F2","#F4FAFD","#58B8D8","#1C6FA0","#06141F","#E23B2E"],Le=20,ze=36,Se=.6*9.81,Ne=14*Math.PI/180,Ie=4,Te=`
uniform float uCalvT;      // event time, seconds
uniform float uCalvTime;   // free-running time for the ambient swell
uniform vec3 uCalvImp;     // impact x, impact z, impact time
uniform float uCalvSwell;  // ambient swell scale (opts.swell)
float calvProfile(float x){
  float a = exp(-(x*x)/289.0);
  a -= 0.30*exp(-((x+30.0)*(x+30.0))/400.0);
  a -= 0.28*exp(-((x-30.0)*(x-30.0))/324.0);
  a += 0.45*exp(-((x-60.0)*(x-60.0))/324.0);
  a -= 0.16*exp(-((x-90.0)*(x-90.0))/324.0);
  a += 0.25*exp(-((x-120.0)*(x-120.0))/400.0);
  return a;
}
float calvRing(vec2 p){
  float tt = uCalvT - uCalvImp.z;
  if (tt <= 0.0) return 0.0;
  float r = length(p - uCalvImp.xy);
  float A = 7.0*sqrt(28.6/max(r, 28.6))*smoothstep(0.0, 1.6, tt)*smoothstep(4.0, 26.0, r);
  float h = A*calvProfile(${ze}.0*tt - r);
  h += 2.4*exp(-r/45.0)*exp(-0.22*tt)*sin(0.2*r - 2.1*tt)*smoothstep(0.0, 1.0, tt);
  return h;
}
float calvSwell(vec2 p){
  float t = uCalvTime;
  return uCalvSwell*(0.15*sin(p.x*0.052 + p.y*0.047 + t*0.85) + 0.10*sin(p.x*-0.091 + p.y*0.118 + t*1.25) + 0.05*sin(p.x*0.23 - p.y*0.17 + t*1.9));
}
float calvWave(vec2 p){ return calvRing(p) + calvSwell(p); }
`;function Ge(n){let o=Math.exp(-(n*n)/289);return o-=.3*Math.exp(-((n+30)*(n+30))/400),o-=.28*Math.exp(-((n-30)*(n-30))/324),o+=.45*Math.exp(-((n-60)*(n-60))/324),o-=.16*Math.exp(-((n-90)*(n-90))/324),o+=.25*Math.exp(-((n-120)*(n-120))/400),o}function Be(n,o,e,F,m,y=1){let I=y*(.15*Math.sin(n*.052+o*.047+F*.85)+.1*Math.sin(n*-.091+o*.118+F*1.25)+.05*Math.sin(n*.23-o*.17+F*1.9));const u=e-m.z;if(u>0){const d=Math.hypot(n-m.x,o-m.y),l=7*Math.sqrt(28.6/Math.max(d,28.6))*z(0,1.6,u)*z(4,26,d);I+=l*Ge(ze*u-d),I+=2.4*Math.exp(-d/45)*Math.exp(-.22*u)*Math.sin(.2*d-2.1*u)*z(0,1,u)}return I}const De=`
uniform vec4 uCalvSh[6]; uniform vec3 uCalvShDir;
float calvShadow(vec2 p){
  if (uCalvShDir.z < 0.001) return 0.0;
  float s = 0.0;
  for (int i = 0; i < 6; i++) {
    vec4 c = uCalvSh[i]; vec2 d = p - c.xy;
    float al = dot(d, uCalvShDir.xy), ac = abs(d.x*uCalvShDir.y - d.y*uCalvShDir.x), soft = 2.0 + max(al, 0.0)*0.04;
    s = max(s, smoothstep(0.0, 6.0, al)*(1.0 - smoothstep(c.w*0.7, c.w + 1.0, al))*(1.0 - smoothstep(c.z - soft, c.z + soft, ac)));
  }
  return s*uCalvShDir.z;
}
`,Pe=`
float cvHash(vec3 p){ p = fract(p*0.3183099 + vec3(0.71, 0.113, 0.419)); p *= 17.0; return fract(p.x*p.y*p.z*(p.x + p.y + p.z)); }
float cvNoise(vec3 x){
  vec3 i = floor(x), f = fract(x); f = f*f*(3.0 - 2.0*f);
  return mix(mix(mix(cvHash(i), cvHash(i + vec3(1,0,0)), f.x), mix(cvHash(i + vec3(0,1,0)), cvHash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(cvHash(i + vec3(0,0,1)), cvHash(i + vec3(1,0,1)), f.x), mix(cvHash(i + vec3(0,1,1)), cvHash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float cvFbm(vec3 p){ return 0.55*cvNoise(p) + 0.3*cvNoise(p*2.13 + 7.1) + 0.15*cvNoise(p*4.7 + 3.3); }
`;function Fe(n,o,e={}){const F=new a.MeshStandardMaterial({vertexColors:!0,roughness:.62,metalness:0,side:e.side??a.FrontSide}),m={uIceBlue:{value:n.cyan.clone()},uIceDeep:{value:n.sapphire.clone()},uRimCol:{value:n.iceLight.clone()},uWet:e.wet||{value:0},uRim:e.rim||{value:0},uGlowK:n.glow,uIceTime:o.uCalvTime,uDetail:{value:e.detail??1},uScallop:{value:e.scallop??0},uSweep:{value:e.sweep??0},uFresh:{value:e.fresh??1},uFrost:{value:e.frost??0},uCrack:{value:e.crack??1}};return F.userData.u=m,F.onBeforeCompile=y=>{Object.assign(y.uniforms,m),y.vertexShader=y.vertexShader.replace("#include <common>",`#include <common>
attribute vec3 aIce;
varying vec3 vIce;
varying vec3 vIceP;
varying float vIceWY;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vIce = aIce; vIceP = position; vIceWY = (modelMatrix*vec4(position, 1.0)).y;`),y.fragmentShader=y.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vIce; varying vec3 vIceP; varying float vIceWY;
uniform vec3 uIceBlue, uIceDeep, uRimCol; uniform float uWet, uRim, uIceTime, uDetail, uScallop, uGlowK, uSweep, uFresh, uFrost, uCrack;
${Pe}
float iceH(vec3 p){
  float a = cvFbm(vec3(p.x*0.09, p.y*0.022, p.z*0.09));          // tall vertical fracture flutes
  float b = cvNoise(vec3(p.x*0.45, p.y*0.11, p.z*0.45));
  float c = abs(cvNoise(vec3(p.x*0.2, p.y*0.035, p.z*0.2) + 11.0) - 0.5)*2.0;                // crack lines
  float cw = max(0.12, 1.5*fwidth(c));                          // crack lines never thinner than a pixel and a half: they fade instead of breaking into dots
  float sc = uScallop > 0.0 ? uScallop*smoothstep(-0.5, 0.0, vIce.x)*(cvNoise(p*0.95)*0.55 + abs(cvNoise(p*0.42 + 4.0) - 0.5)*1.6 + abs(cvNoise(vec3(p.x*1.25, p.y*0.06, p.z*1.25) + 23.0) - 0.5)*2.2) : 0.0;   // + vertical melt flutes
  return a*1.6 + b*0.45 - (1.0 - smoothstep(0.0, cw, c))*0.9*(0.12/cw)*uCrack + sc;
}`).replace("#include <color_fragment>",`#include <color_fragment>
float hI = iceH(vIceP);
float crC = abs(cvNoise(vec3(vIceP.x*0.2, vIceP.y*0.035, vIceP.z*0.2) + 11.0) - 0.5)*2.0, crW = max(0.10, 1.5*fwidth(crC));
float crackI = (1.0 - smoothstep(0.0, crW, crC))*(0.10/crW)*uCrack;
float strata = 0.5 + 0.5*sin(vIceP.y*0.55 + cvNoise(vIceP*0.05)*9.0);
float blueI = clamp(vIce.x + crackI*0.35 + (0.5 - hI*0.3)*0.25*uDetail, 0.0, 1.0);
diffuseColor.rgb *= mix(vec3(1.0), vec3(0.80, 0.93, 0.98), strata*0.35*(1.0 - vIce.y));
diffuseColor.rgb = mix(diffuseColor.rgb, uIceBlue*0.85, blueI*0.45);
diffuseColor.rgb = mix(diffuseColor.rgb, uIceDeep*0.9, clamp(vIce.y*0.8 + blueI*blueI*0.35 + vIce.z*0.8, 0.0, 1.0));
diffuseColor.rgb = mix(diffuseColor.rgb, uIceDeep*0.85, 0.4*min(uScallop, 1.0)*max(vIce.x, 0.0));   // the arch (the only scalloped ice) keeps its sapphire in any light
if (uScallop > 0.0) {                                                                       // darker sapphire bands and flutes in the new ice
  float bandA = smoothstep(0.35, 0.75, 0.5 + 0.5*sin(vIceP.y*1.15 + cvNoise(vIceP*0.22)*5.0));
  float fluteA = abs(cvNoise(vec3(vIceP.x*1.25, vIceP.y*0.06, vIceP.z*1.25) + 23.0) - 0.5)*2.0;
  diffuseColor.rgb = mix(diffuseColor.rgb, uIceDeep*0.5, clamp(vIce.x, 0.0, 1.0)*(0.45*bandA + 0.35*(1.0 - smoothstep(0.0, 0.3, fluteA))));
}
if (uFrost > 0.0) {                                                                         // freshly broken ice: glassy sapphire with white fracture frost, paler toward its edges
  float frN = cvFbm(vIceP*0.33 + 5.0), frost = smoothstep(0.43, 0.6, frN)*0.85 + smoothstep(0.42, 0.5, abs(cvNoise(vIceP*0.9 + 3.0) - 0.5)*2.0)*0.25;
  float edgeI = pow(1.0 - clamp(dot(normalize(vViewPosition), normalize(vNormal)), 0.0, 1.0), 2.0);
  diffuseColor.rgb = mix(diffuseColor.rgb, uRimCol*0.86, uFrost*vIce.y*clamp(frost*0.85 + edgeI*0.7, 0.0, 1.0));
  diffuseColor.rgb *= 1.0 - 0.45*uFrost*vIce.y*(1.0 - smoothstep(0.2, 0.34, frN));                   // dark crevices between the blocks of clean ice
  vec3 nWf = inverseTransformDirection(normalize(vNormal), viewMatrix);                      // mass: a lit side and a shaded side in any light
  float keyF = 0.5 + 0.5*dot(nWf, vec3(-0.55, 0.6, 0.58));
  diffuseColor.rgb *= 1.0 - 0.52*uFrost*(1.0 - smoothstep(0.25, 0.8, keyF));
}
if (uSweep > 0.0) diffuseColor.rgb *= 1.0 - uSweep*0.6 + uSweep*1.6*smoothstep(0.3, 0.72, cvNoise(vec3(vIceP.x*0.0045 - uIceTime*0.09, 1.7, 3.3)));
float sheet = 0.0;
if (uWet > 0.001) {
  float colm = cvNoise(vec3(vIceP.x*2.6, 3.0, vIceP.z*2.6));
  float run = cvNoise(vec3(vIceP.x*5.0, vIceWY*0.35 + uIceTime*(2.0 + colm*2.5), vIceP.z*5.0 + colm*3.0));
  sheet = uWet*smoothstep(0.55, 0.95, run)*smoothstep(0.35, 0.75, colm);
}`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = mix(roughnessFactor, 0.16, clamp(vIce.y + blueI*0.5 + uWet*0.6, 0.0, 1.0));`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
{
  vec3 sx = dFdx(-vViewPosition), sy = dFdy(-vViewPosition);
  float fade = uDetail/(1.0 + length(vViewPosition)*0.004);
  float dhx = dFdx(hI)*fade, dhy = dFdy(hI)*fade;
  vec3 r1 = cross(sy, normal), r2 = cross(normal, sx);
  float det = dot(sx, r1);
  normal = normalize(abs(det)*normal - sign(det)*1.4*(dhx*r1 + dhy*r2));
}`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
{
  float fres = pow(1.0 - clamp(dot(normalize(vViewPosition), normal), 0.0, 1.0), 2.0);
  totalEmissiveRadiance += (uIceBlue*(blueI*0.16 + 0.04) + uIceDeep*(vIce.y*(0.75 + 0.6*fres)*uFresh + blueI*blueI*0.3 + vIce.z*0.35))*uGlowK*(1.0 - 0.8*uFrost*vIce.y);
  totalEmissiveRadiance += mix(uIceBlue, uRimCol, 0.3)*vIce.z*uRim*(0.75 + 0.25*sin(uIceTime*2.1 + vIceP.y*0.4));
  totalEmissiveRadiance += vec3(0.5, 0.8, 1.0)*sheet*(0.3 + 0.8*min(uScallop, 1.0));
}`)},F}function _e(n,o,e,F,m,y,I={}){const u=I.seg??2.2;let d=new a.BoxGeometry(e,F,m,Math.max(3,Math.round(e/u)),Math.max(3,Math.round(F/u)),Math.max(3,Math.round(m/u)));d.deleteAttribute("uv"),d.deleteAttribute("normal"),d=Re(d,.001);const l=d.attributes.position,x=l.count,i=o.range(0,500),w=e/2,g=F/2,_=m/2,q=I.round??.55,N=I.amp??1.5;for(let M=0;M<x;M++){let p=l.getX(M),r=l.getY(M),C=l.getZ(M);const v=p/w,f=r/g,b=C/_,L=Math.pow(Math.pow(Math.abs(v),6)+Math.pow(Math.abs(f),6)+Math.pow(Math.abs(b),6),1/6)||1,K=me(1,1/L,q);p*=K,r*=K,C*=K;const te=1+(n.fbm3(p*.09+i,r*.09,C*.09,3)*N+n.n3(p*.3+i,r*.3,C*.3)*N*.25)/Math.max(w,g,_)*2.2;p*=te,r*=te,C*=te;const J=n.n3(p*.05+i+40,r*.05,C*.05);if(p+=J*N*.8,C+=n.n3(p*.05,r*.05+i,C*.05+9)*N*.8,I.spires&&f>.2){const G=n.ridged2(p*.11+i,C*.11,3);r+=z(.2,1,f)*(G*G*I.spires-I.spires*.25);const k=1-.28*z(.3,1,f);p*=k,C*=k}l.setXYZ(M,p,r,C)}d.computeVertexNormals();const H=d.attributes.normal,T=new Float32Array(x*3),Y=new Float32Array(x*3),O=new a.Color,ee=I.weathered||((M,p,r)=>z(.2,.6,r));for(let M=0;M<x;M++){const p=l.getX(M),r=l.getY(M),C=l.getZ(M),v=ee(H.getX(M),H.getY(M),H.getZ(M),p,r,C),f=.5+.5*n.fbm3(p*.07+i,r*.07,C*.07,3),b=z(.25,.7,n.n2(p*.22+i,r*.02))*v;O.copy(y.snow).multiplyScalar(.78).lerp(y.iceLight,.25+.5*f).multiplyScalar(.9+.1*f).lerp(y.cyan,b*.35),v<1&&O.lerp(y.cyan,(1-v)*.6),T[M*3]=O.r,T[M*3+1]=O.g,T[M*3+2]=O.b,Y[M*3]=ce((1-v)*.6+f*.25+b*.45,0,1),Y[M*3+1]=(1-v)*(.6+.4*f),Y[M*3+2]=0}return d.setAttribute("color",new a.BufferAttribute(T,3)),d.setAttribute("aIce",new a.BufferAttribute(Y,3)),d}async function je(n,o,e,F,m){const y=F/2,I=Math.round(ce(F/1.75,200,420)),u=46,d=[0,2.5,6,11,18,27,39,55,76,104,140,190],l=d.length,x=u+l-1,i=[];let w=-y;for(;w<y;){const p=o.range(9,26);i.push({x0:w,x1:w+p,out:o.range(-4,7)+(o.chance(.18)?o.range(4,9):0),top:o.range(58,80)+(o.chance(.12)?o.range(3,7):0),gap:o.range(.35,1),gapD:o.range(4,20)}),w+=p}const g=o.range(0,300),_=new Float32Array((I+1)*x*3),q=new Float32Array((I+1)*x*3),N=new Float32Array((I+1)*x*3),H=new a.Color;let T=0,Y=0;for(let p=0;p<=I;p++){(p&31)===31&&await m();const r=-y+p/I*F;for(;T<i.length-1&&r>i[T].x1;)T++;const C=i[T],v=Math.min(r-C.x0,C.x1-r),f=r-C.x0<C.x1-r?i[Math.max(0,T-1)]:i[Math.min(i.length-1,T+1)],b=(C.gap+f.gap)*.5,L=Math.exp(-(v*v)/3.2)*b,K=z(0,2.5,v)*.5+.5,te=me((C.out+f.out)*.5,C.out,K*2-1),J=me((C.top+f.top)*.5,C.top,K*2-1),G=Math.abs(r)/y,k=1-z(16.5,22,Math.abs(r)),ie=k*z(9,14.5,Math.abs(r)),B=70+n.fbm2(r*.004+g,3.1,3)*6;let A=(J-L*(5+(C.gapD+f.gapD)*.5)+n.fbm2(r*.09+g,.5,3)*3.6)*(1-.3*G*G);A=me(A,Math.min(A,56+n.n2(r*.09,g+7)*3),(1-z(22,70,Math.abs(r)))*.85),A=me(A,53+n.n2(r*.2,g)*3,k),Y=Math.max(Y,A);const W=n.fbm2(r*.006+g,9.7,3)*16-Math.pow(G,2.6)*150-3-k*12;let R=0;for(let D=0;D<x;D++){const V=(p*x+D)*3;let S,j,ne,Z=0,re;if(D<u){const E=D/(u-1);S=me(-6,A,E),j=W+te*(.35+.65*E)*(1-k)-L*(3+13*Math.pow(E,1.3))*(1-k*.7)+n.fbm3(r*.06+g,S*.016,1.7,3)*4.4+n.n3(r*.2,S*.05,g)*1.1+(Math.round(n.n3(r*.05+g,S*.012,5.5)*3)*1.3+Math.round(n.n3(r*.012+g,S*.09,8.2)*2)*.8)*(1-k)-3.5*E-2.4*Math.exp(-((S-1.2)*(S-1.2))/5),D===u-1&&(R=j),ne=ce(L*.85+(1-E)*.3+(S<4?.35*(1-S/4):0)+n.n3(r*.04,S*.09,g+3)*.15,0,1),Z=k*(.6+.4*n.n3(r*.2,S*.2,g))*z(-2,6,S)*(1-.5*ie),ne=Math.max(ne,ie),re=z(.9,1,E)*(1-L)}else{const E=d[D-u+1],ae=z(0,34,E),U=Math.sin((E+n.fbm2(r*.012+g,E*.012,2)*46)*.17),ve=z(.7,1,U)*z(3,16,E);S=me(A,B*(1-.3*G*G),ae)+E*.11-ve*6+n.fbm2(r*.04,E*.04+g,3)*2.2*ae,j=R-E+n.n2(r*.05,E*.05+g)*1.5,ne=ce(ve*.9+L*(1-ae)*.6,0,1),re=1-ne,Y=Math.max(Y,E<80?S:0)}_[V]=r,_[V+1]=S,_[V+2]=j;const $=.5+.5*n.fbm3(r*.035+g,S*.06,j*.035,3);H.copy(e.iceLight).multiplyScalar(.72+.14*$).lerp(e.snow,re*.8).lerp(e.cyan,ne*.3).multiplyScalar(1-.62*L*(D<u?1:.3)),D<u&&H.multiplyScalar((.86+.14*z(-4,6,te))*(1-.42*k)*(1-.5*ie)),q[V]=H.r,q[V+1]=H.g,q[V+2]=H.b,N[V]=ne,N[V+1]=Z,N[V+2]=0}}const O=new Uint32Array(I*(x-1)*6);let ee=0;for(let p=0;p<I;p++)for(let r=0;r<x-1;r++){const C=p*x+r,v=C+x;O[ee++]=C,O[ee++]=v,O[ee++]=C+1,O[ee++]=v,O[ee++]=v+1,O[ee++]=C+1}const M=new a.BufferGeometry;return M.setAttribute("position",new a.BufferAttribute(_,3)),M.setAttribute("color",new a.BufferAttribute(q,3)),M.setAttribute("aIce",new a.BufferAttribute(N,3)),M.setIndex(new a.BufferAttribute(O,1)),await m(),M.computeVertexNormals(),{geometry:M,top:Y}}const ue={hw:7.5,hh:9.5,cy:1.5,ex:2.6};async function Ue(n,o,e,F=0,m=100*Math.PI/180,y=-2,I=async()=>{}){const l=o.range(0,400),x=o.range(.55,.95)*o.sign(),i=o.range(2,2.6)*-Math.sign(x),w=o.range(4,7.5),g=o.range(.9,1.12),_=2464,q=new Float32Array(_*3),N=new Float32Array(_*3),H=new Float32Array(_*3),T=new a.Color,Y=2/ue.ex,O=e.cyan.clone().lerp(e.sapphire,.45),ee=new a.Color("#7f898c");for(let B=0;B<112;B++){B%28===27&&await I();const A=B/112*Math.PI*2,W=Math.sin(A),R=Math.cos(A),D=ue.hw*Math.sign(W)*Math.pow(Math.abs(W),Y),V=ue.cy+ue.hh*Math.sign(R)*Math.pow(Math.abs(R),Y);let S=Math.sign(W)*Math.pow(Math.abs(W),2-Y)/ue.hw,j=Math.sign(R)*Math.pow(Math.abs(R),2-Y)/ue.hh;const ne=Math.hypot(S,j)||1;S/=ne,j/=ne;const Z=R,re=ae=>{let U=A-ae;return U=Math.atan2(Math.sin(U),Math.cos(U)),U};let $=(me(6.6,5.2,z(.2,1,Z))+(Z<-.3?-2.6*z(-.3,-.9,Z):0))*g;$+=w*Math.exp(-Math.pow(re(x)/.2,2))+w*.45*Math.exp(-Math.pow(re(i>0?1.15:-1.15)/.3,2)),$+=n.fbm2(Math.cos(A)*1.6+l,Math.sin(A)*1.6,3)*1.8+n.n2(A*5+l,2)*.5,$=Math.max(2.4,$);const E=(me(3.5,5.3,z(.3,-1,Z))+n.fbm2(Math.cos(A)*1.3,Math.sin(A)*1.3+l,2)*.9)*g;for(let ae=0;ae<22;ae++){const U=ae/22*Math.PI*2,ve=Math.cos(U),ge=Math.sin(U),xe=Math.sign(ve)*Math.pow(Math.abs(ve),.62),pe=Math.sign(ge)*Math.pow(Math.abs(ge),.62);let de=$*.5*(1+xe),he=E*pe*(1-.3*z(.35,1,de/$)*(.5+.5*Z)),oe=D+S*de,se=V+j*de;const ye=z(.25,.9,de/$),Me=n.fbm3(oe*.11+l,se*.11,he*.11,3)*1.5+n.n3(oe*.33,se*.33+l,he*.33)*.4+(Math.abs(n.n3(oe*.15+l,se*.15,he*.15+20))-.3)*1.9;oe+=S*Me*ye,se+=j*Me*ye,he+=n.fbm3(oe*.09,se*.09+l,he*.2,2)*1.2*(.3+.7*Math.abs(pe));const Ce=Math.exp(-(se*se)/1.6)*ye;oe-=S*Ce*.7;const le=(B*22+ae)*3;q[le]=oe,q[le+1]=se,q[le+2]=he;const t=z(-.15,.5,-pe)*z(.02,.3,de/$+.1),c=z(.35,.02,de/$),s=.5+.5*n.fbm3(oe*.1+l,se*.1,he*.1,3),h=z(.1,.55,n.n2(oe*.5+l,se*.09+he*.3));T.copy(e.snow).multiplyScalar(.7+.08*s).lerp(ee,.3+.4*h),T.lerp(O,(1-t)*(.6+.3*s)),N[le]=T.r,N[le+1]=T.g,N[le+2]=T.b,H[le]=ce((1-t)*.7+s*.2,0,1)-.7*t,H[le+1]=(1-t)*(.3+.7*s)*me(.75,1,c),H[le+2]=c*c*z(-.75,-.2,Z+.25)}}await I();const M=46,p=18,r=(M+1)*(p+1),C=Math.cos(m),v=Math.sin(m),f=Math.cos(F),b=Math.sin(F),L=new Float32Array(r*3),K=new Float32Array(r*3),te=new Float32Array(r*3);for(let B=0;B<=M;B++)for(let A=0;A<=p;A++){const W=B/M*2-1,R=A/p,D=B===0||B===M||A===0||A===p;let V=12.2+8.6*R,S=V*Math.tan(F)+11.4*W;const j=Math.pow(Math.max(0,1-Math.pow(Math.abs(W),3)),.7),ne=R<.36?Math.pow(z(0,.36,R),.75):1-Math.pow(z(.36,1,R),1.35),Z=n.ridged2(S*.32+l,V*.4,3),re=n.n2(S*.2+l,V*.2+7)*.9+n.n2(S*.7+l,V*.7+3)*.22;let $=D?-1.2:-.6+9.3*j*ne*(.95+.05*Z)+re*ne*j;D||(S+=n.n2(S*.4,V*.4+l)*.7,V+=n.n2(S*.4+9,V*.4+l)*.6);const E=$*C+V*v,ae=-$*v+V*C,U=(B*(p+1)+A)*3;L[U]=S*f-ae*b,L[U+1]=E+y,L[U+2]=S*b+ae*f;const ve=.5+.5*n.fbm2(S*.25+l,V*.25+$*.2,3),ge=z(.38,.7,n.n2(S*.5+l,V*.1+$*.08)),xe=1-z(.3,2.6,$+.6*n.n2(S*.6,l+4)),pe=z(.55,.85,Z)*.5;T.copy(e.snow).multiplyScalar(.8+.06*ve).lerp(ee,.3*ge).lerp(e.iceLight,.35*pe).lerp(e.cyan,.75*xe),K[U]=T.r,K[U+1]=T.g,K[U+2]=T.b,te[U]=-.8+1.25*xe+.5*pe,te[U+1]=0,te[U+2]=0}const J=new Uint16Array(_*6),G=new Uint16Array(M*p*6);let k=0;for(let B=0;B<112;B++)for(let A=0;A<22;A++){const W=(B+1)%112,R=(A+1)%22,D=B*22+A,V=W*22+A,S=W*22+R,j=B*22+R;J[k++]=D,J[k++]=j,J[k++]=V,J[k++]=V,J[k++]=j,J[k++]=S}k=0;for(let B=0;B<M;B++)for(let A=0;A<p;A++){const W=B*(p+1)+A,R=W+p+1;G[k++]=W,G[k++]=W+1,G[k++]=R,G[k++]=R,G[k++]=W+1,G[k++]=R+1}const ie=(B,A,W,R)=>{const D=new a.BufferGeometry;return D.setAttribute("position",new a.BufferAttribute(B,3)),D.setAttribute("color",new a.BufferAttribute(A,3)),D.setAttribute("aIce",new a.BufferAttribute(W,3)),D.setIndex(new a.BufferAttribute(R,1)),D.computeVertexNormals(),D};return{ring:ie(q,N,H,J),ridge:ie(L,K,te,G)}}function Ye(n,o,e){const u=new Float32Array(42840),d=new Uint32Array(14160*6);for(let g=0;g<=118;g++){const _=g/118,q=650*(.72*_+.28*_*_*_);for(let N=0;N<120;N++){const H=(N+(g&1)*.5)/120*Math.PI*2,T=(g*120+N)*3;u[T]=e.imp.x+Math.sin(H)*q,u[T+1]=0,u[T+2]=e.imp.y+Math.cos(H)*q}}let l=0;for(let g=0;g<118;g++)for(let _=0;_<120;_++){const q=g*120+_,N=g*120+(_+1)%120,H=q+120,T=N+120;d[l++]=q,d[l++]=H,d[l++]=N,d[l++]=N,d[l++]=H,d[l++]=T}const x=new a.BufferGeometry;x.setAttribute("position",new a.BufferAttribute(u,3)),x.setIndex(new a.BufferAttribute(d,1)),x.boundingSphere=new a.Sphere(new a.Vector3(e.imp.x,0,e.imp.y),660);const i=new a.ShaderMaterial({fog:!0,uniforms:a.UniformsUtils.merge([a.UniformsLib.fog,{uDeep:{value:n.water.clone()},uTeal:{value:n.sapphire.clone()},uTop:{value:e.skyTop.clone()},uHor:{value:e.skyHor.clone()},uSun:{value:e.sunDir.clone()},uFoamCol:{value:n.snow.clone().multiplyScalar(.92)},uGlit:{value:e.glitter??1}}]),vertexShader:`
#include <common>
#include <fog_pars_vertex>
${Te}
varying vec3 vW; varying vec2 vL; varying vec3 vN; varying vec2 vRing;
void main(){
  vec3 p = position; vec2 xz = p.xz;
  float h = calvWave(xz), e = 1.5;
  float hx = calvWave(xz + vec2(e, 0.0)), hz = calvWave(xz + vec2(0.0, e));
  p.y += h;
  vN = normalize(mat3(modelMatrix)*vec3(h - hx, e, h - hz));
  float r = length(xz - uCalvImp.xy);
  vRing = vec2(calvRing(xz), 7.0*sqrt(28.6/max(r, 28.6)));
  vL = xz;
  vec4 wp = modelMatrix*vec4(p, 1.0); vW = wp.xyz;
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uDeep, uTeal, uTop, uHor, uSun, uFoamCol;
uniform float uCalvT, uCalvTime, uGlit; uniform vec3 uCalvImp; uniform vec4 uArchFoam;
varying vec3 vW; varying vec2 vL; varying vec3 vN; varying vec2 vRing;
${Pe}
${De}
void main(){
  vec3 V = normalize(cameraPosition - vW);
  float dist = length(cameraPosition - vW), t = uCalvTime;
  float lod = 1.0/(1.0 + dist*0.006);
  vec2 vS = vec2(vL.x*0.8 - vL.y*0.6, (vL.x*0.6 + vL.y*0.8)*0.42);          // stretched along the wind: elongated wavelets, not blobs
  vec3 q1 = vec3(vL*0.22 + vec2(t*0.25, t*0.12), t*0.35), q2 = vec3(vS*1.3 - vec2(t*0.3, -t*0.4), t*0.6);
  vec2 rip = (vec2(cvNoise(q1), cvNoise(q1 + 17.3)) - 0.5)*0.08 + (vec2(cvNoise(q2), cvNoise(q2 + 9.1)) - 0.5)*0.19*lod;
  vec3 q3 = vec3(vS*3.6 + vec2(-t*0.55, t*0.4), t*0.9);
  rip += (vec2(cvNoise(q3), cvNoise(q3 + 5.7)) - 0.5)*0.26*lod*lod;
  // crisp wavelets near the bow: two fine octaves, each faded out before it gets finer than a pixel
  float fp = max(length(dFdx(vL)), length(dFdy(vL)));
  float k4 = 1.0 - smoothstep(0.12, 0.45, fp*9.0), k5 = 1.0 - smoothstep(0.12, 0.45, fp*24.0);
  vec3 q4 = vec3(vS*9.0 + vec2(t*0.9, -t*0.7), t*1.4), q5 = vec3(vS*24.0 - vec2(t*1.3, t*1.1), t*2.0);
  rip += (vec2(cvNoise(q4), cvNoise(q4 + 3.9)) - 0.5)*0.52*k4 + (vec2(cvNoise(q5), cvNoise(q5 + 8.3)) - 0.5)*0.36*k5;
  vec3 n = normalize(vN + vec3(rip.x, 0.0, rip.y));
  float F = 0.02 + 0.98*pow(1.0 - clamp(dot(n, V), 0.0, 1.0), 5.0);
  vec3 R = reflect(-V, n); R.y = abs(R.y);
  vec3 sky = mix(uHor, uTop, smoothstep(0.0, 0.55, R.y));
  float steep = clamp(1.0 - vN.y, 0.0, 1.0)*14.0;
  float lift = clamp(vRing.x/vRing.y, -1.0, 1.0);
  vec2 outD = vL - uCalvImp.xy; float outL = length(outD);
  float face = outL > 1.0 ? smoothstep(0.015, 0.09, dot(outD/outL, vN.xz))*smoothstep(0.12, 0.4, lift) : 0.0;      // the advancing face of the ring wave
  vec3 col = uDeep*(0.75 + 0.5*clamp(dot(n, uSun), 0.0, 1.0));
  col += uTeal*(clamp(steep, 0.0, 1.0)*0.30 + max(lift, 0.0)*0.28)*(1.0 - 0.6*face);
  float raN = length(vL - uArchFoam.xy), nearArch = 1.0 - smoothstep(22.0, 70.0, raN);
  col = mix(col, sky*0.8, F*0.36*(1.0 - 0.55*nearArch)*(1.0 - 0.45*smoothstep(0.16, 0.34, R.y)));   // black body, sky only at grazing angles
  float wl1 = 1.0 - abs(2.0*cvNoise(vec3(vS*4.2 + vec2(t*0.7, -t*0.5), t*0.8)) - 1.0), wl2 = 1.0 - abs(2.0*cvNoise(vec3(vS*10.0 - vec2(t*1.1, t*0.9), t*1.3)) - 1.0);
  col += sky*(0.15*wl1*wl1*wl1*wl1*(1.0 - smoothstep(0.1, 0.4, fp*4.2)) + 0.13*wl2*wl2*wl2*wl2*k4)*(1.0 - 0.6*nearArch);      // thin lines of sky light along the wavelet crests
  float sd = max(dot(R, uSun), 0.0);
  float spark = step(0.86, cvNoise(vec3(vL*2.3, t*1.6)));
  float shd = calvShadow(vL);
  col += vec3(1.0, 0.98, 0.95)*(pow(sd, 380.0)*9.0 + pow(sd, 22.0)*spark*3.2*lod + pow(sd, 6.0)*0.05)*(1.0 - shd);
  // hard white glitter whatever the sun's azimuth: points that wink on the facets tilted toward the light
  float gcell = cvNoise(vec3(vL*13.0 + rip*6.0, t*2.2)), gpatch = smoothstep(0.3, 0.5, cvNoise(vec3(vL*0.6 + 31.0, t*0.35)));
  float glit = smoothstep(0.83, 0.87, gcell)*gpatch*smoothstep(1.5, 4.0, dist)*(1.0 - smoothstep(22.0, 60.0, dist))*(1.0 - smoothstep(0.3, 1.1, fp*13.0));
  col += vec3(2.5)*glit*(1.0 - shd)*uGlit;
  col = mix(col, uDeep*0.5 + uTeal*(0.08 + 0.55*smoothstep(0.45, 0.85, lift)), face*0.85);      // the face of the wave: dark water, turquoise where it thins under the crest
  // foam: the advancing crest, the trailing swells, the impact fPatch, the arch
  float fn = cvFbm(vec3(vL*0.16, t*0.15)), fn2 = cvNoise(vec3(vL*0.7, t*0.5));
  float ridge = 1.0 - abs(2.0*cvFbm(vec3(vL*0.23 + 5.0, t*0.12)) - 1.0);
  float ridge2 = 1.0 - abs(2.0*cvNoise(vec3(vL*0.8, t*0.3)) - 1.0);
  float veins = max(ridge, ridge2*0.9);
  float liftF = lift*(1.0 - 0.3*face);
  float dens = smoothstep(0.42, 0.9, liftF + (fn - 0.5)*0.4) + smoothstep(0.24, 0.5, liftF)*0.4;
  float tt = uCalvT - uCalvImp.z, r = length(vL - uCalvImp.xy);
  if (tt > 0.0) {
    float rad = min(125.0, 16.0 + 15.0*tt);
    float fPatch = (1.0 - smoothstep(rad*0.3, rad, r + (fn - 0.5)*40.0))*exp(-tt/10.0)*smoothstep(0.0, 1.2, tt);
    dens = max(dens, fPatch*1.1);
    dens = max(dens, exp(-pow((r - rad)/6.0, 2.0))*exp(-tt/7.0)*0.7);
  }
  float ra = raN, solid = smoothstep(0.4, 0.8, liftF);
  dens = max(dens, 0.4*uArchFoam.w*(1.0 - smoothstep(uArchFoam.z*0.25, uArchFoam.z, ra + (fn - 0.5)*14.0)));
  dens = clamp(dens, 0.0, 1.0);
  float foam = smoothstep(1.02 - dens, 1.22 - dens*0.9, veins)*smoothstep(0.0, 0.08, dens);
  // broken into streaks everywhere but on the advancing crest and the impact patch: never a white sheet
  float brk = smoothstep(0.5, 0.64, cvFbm(vec3(vL*0.13 + 3.0, t*0.1)))*(0.55 + 0.45*smoothstep(0.35, 0.7, fn2));
  if (tt > 0.0) solid = max(solid, (1.0 - smoothstep(30.0, 90.0, r))*exp(-tt/9.0));
  foam *= mix(brk, 1.0, solid)*(1.0 - 0.5*nearArch*(1.0 - solid));
  vec3 foamLit = min(uFoamCol*(0.36 + 0.6*clamp(dot(n, uSun), 0.0, 1.0) + 0.5*solid) + uHor*0.1, vec3(0.75 + 0.4*solid));
  col = mix(col, foamLit, foam);
  col *= mix(vec3(1.0), vec3(0.34, 0.48, 0.78), shd);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`});Object.assign(i.uniforms,o,{uArchFoam:e.archFoam});const w=new a.Mesh(x,i);return w.name="calving-sea",w}function Ke(n,o,e,F,m){const I=[],u=[],d=[],l=[];for(let v=0;v<8;v++){const f=(v+o.range(-.3,.3))/8*Math.PI*2,b=o.range(.6,1.1);I.push([Math.cos(f)*b,Math.sin(f)*b])}const x=e.snow.clone().multiplyScalar(.78),i=e.iceLight.clone().multiplyScalar(.74),w=e.cyan.clone().multiplyScalar(.8),g=(v,f,b,L)=>(u.push(v,f,b),d.push(L.r,L.g,L.b),u.length/3-1),_=g(0,1.12,0,x);for(let v=0;v<8;v++){const[f,b]=I[v];g(f*.82,1,b*.82,x),g(f,.72,b,i),g(f*1.04,-.25,b*1.04,w)}for(let v=0;v<8;v++){const f=1+v*3,b=1+(v+1)%8*3;l.push(_,b,f,f,b,f+1,b,b+1,f+1,f+1,b+1,f+2,b+1,b+2,f+2)}const q=new a.BufferGeometry;q.setAttribute("position",new a.Float32BufferAttribute(u,3)),q.setAttribute("color",new a.Float32BufferAttribute(d,3)),q.setIndex(l),q.computeVertexNormals();const N=new a.MeshStandardMaterial({vertexColors:!0,roughness:.7,flatShading:!0});N.onBeforeCompile=v=>{Object.assign(v.uniforms,F),v.vertexShader=v.vertexShader.replace("#include <common>",`#include <common>
${Te}
vec3 calvTilt(vec3 v, vec3 n){ vec3 k = vec3(n.z, 0.0, -n.x); return v*n.y + cross(k, v) + k*dot(k, v)/(1.0 + n.y); }
vec3 calvN(vec2 c){ float e = 2.0, h = calvWave(c); return normalize(vec3(h - calvWave(c + vec2(e, 0.0)), e, h - calvWave(c + vec2(0.0, e)))); }`).replace("#include <begin_vertex>",`#include <begin_vertex>
vec3 fc = instanceMatrix[3].xyz; vec3 fn = calvN(fc.xz);
transformed = (instanceMatrix*vec4(transformed, 1.0)).xyz - fc;
transformed = calvTilt(transformed, fn) + fc + vec3(0.0, calvWave(fc.xz), 0.0);`).replace("#include <project_vertex>",`vec4 mvPosition = modelViewMatrix*vec4(transformed, 1.0);
gl_Position = projectionMatrix*mvPosition;`)};const H=m.count,T=[],Y=new a.Matrix4,O=new a.Quaternion,ee=new a.Vector3,M=new a.Vector3,p=new a.Vector3(0,1,0);for(let v=0;v<H*14&&T.length<H;v++){const f=o.range(-m.half*.95,m.half*.95),b=o.range(-30,600),L=o()<.35,K=L?o.range(7,17):o.range(1.6,6.5);if(Math.hypot(f-m.imp.x,b-m.imp.y)<46+K||b<m.wallZ(f)+8+K||Math.abs(f)<m.channel+K&&b>40||Math.hypot(f,b-m.archZ)<30+K)continue;let te=!0;for(const J of T){const G=J.x-f,k=J.z-b,ie=J.r+K+.6;if(G*G+k*k<ie*ie){te=!1;break}}te&&T.push({x:f,z:b,r:K})}const r=new a.InstancedMesh(q,N,T.length),C=new a.Color;return T.forEach((v,f)=>{O.setFromAxisAngle(p,o.range(0,6.283));const b=v.r>7?o.range(.9,2.2):o.range(.35,1.1);ee.set(v.r*o.range(.8,1.1),b,v.r*o.range(.7,1.05)),M.set(v.x,0,v.z),r.setMatrixAt(f,Y.compose(M,O,ee)),r.setColorAt(f,C.setScalar(o.range(.86,1)).lerp(e.iceLight,o.range(0,.25)))}),r.instanceMatrix.needsUpdate=!0,r.frustumCulled=!1,r.name="calving-floes",r}function Oe(n,o,e,F){const m=n.length,y=new Float32Array(m*3),I=new Float32Array(m*3),u=new Float32Array(m*4),d=new Float32Array(m*4);n.forEach((w,g)=>{y.set(w.o,g*3),I.set(w.v,g*3),u.set([w.t0,w.life,w.s0,w.s1],g*4),d.set([w.seed,w.clock,w.g,w.a],g*4)});const l=new a.InstancedBufferGeometry;l.setAttribute("position",new a.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),l.setIndex([0,1,2,0,2,3]),l.setAttribute("aO",new a.InstancedBufferAttribute(y,3)),l.setAttribute("aV",new a.InstancedBufferAttribute(I,3)),l.setAttribute("aT",new a.InstancedBufferAttribute(u,4)),l.setAttribute("aK",new a.InstancedBufferAttribute(d,4)),l.instanceCount=m;const x=new a.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,uniforms:a.UniformsUtils.merge([a.UniformsLib.fog,{uSun:{value:F.sunDir.clone()},uLit:{value:o.snow.clone().multiplyScalar(1.15)},uShade:{value:o.cyan.clone().multiplyScalar(.55).lerp(o.sapphire,.25)}}]),vertexShader:`
#include <common>
#include <fog_pars_vertex>
attribute vec3 aO, aV; attribute vec4 aT, aK;
uniform float uCalvT, uArchT, uDrip; uniform vec3 uSun;
varying vec2 vUv; varying float vA, vSeed; varying vec3 vSunV;
void main(){
  float T = mix(uCalvT, uArchT, aK.y);
  float tau = T - aT.x, life = abs(aT.y), on = step(0.0, tau), amp = aK.w;
  if (aT.y < 0.0) { tau = mod(max(tau, 0.0), life); amp *= uDrip; }
  float f = tau/life; on *= step(f, 1.0);
  float d = (1.0 - exp(-0.22*tau))/0.22;
  float size = mix(aT.z, aT.w, sqrt(clamp(f, 0.0, 1.0)));
  vec3 p = aO + vec3(aV.x*d, aV.y*tau - 0.5*${Se.toFixed(3)}*aK.z*tau*tau, aV.z*d);
  p.y = max(p.y, size*0.22);
  vA = amp*on*smoothstep(0.0, 0.07, f)*(1.0 - smoothstep(0.5, 1.0, f));
  float ang = aK.x*40.0 + f*(aK.x - 0.5)*1.5, ca = cos(ang), sa = sin(ang);
  vUv = position.xy; vSeed = aK.x;
  vec4 mvPosition = modelViewMatrix*vec4(p, 1.0);
  mvPosition.xy += mat2(ca, sa, -sa, ca)*position.xy*size*step(0.001, vA);
  vec3 sv = normalize((viewMatrix*vec4(uSun, 0.0)).xyz);
  vSunV = vec3(sv.x*ca + sv.y*sa, -sv.x*sa + sv.y*ca, sv.z);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uLit, uShade; uniform float uCalvTime;
varying vec2 vUv; varying float vA, vSeed; varying vec3 vSunV;
${Pe}
void main(){
  float r = length(vUv);
  if (r > 1.0 || vA < 0.003) discard;
  float n = cvFbm(vec3(vUv*1.9 + vSeed*31.0, vSeed*9.0 + uCalvTime*0.25));
  float a = smoothstep(1.0, 0.25, r + (n - 0.5)*1.1)*vA;
  vec3 nn = normalize(vec3(vUv + (n - 0.5)*0.6, sqrt(max(0.0, 1.0 - r*r)) + 0.25));
  float lit = clamp(dot(nn, vSunV)*0.62 + 0.5, 0.0, 1.0);
  gl_FragColor = vec4(mix(uShade, uLit, lit*lit), a);
  #include <fog_fragment>
}`});Object.assign(x.uniforms,e,{uArchT:F.archT,uDrip:F.drip});const i=new a.Mesh(l,x);return i.frustumCulled=!1,i.renderOrder=5,i.name="calving-spray",i}function Ze(n,o,e){const F=new a.OctahedronGeometry(1,0);F.scale(1,1.7,.6);const m=n.length,y=new Float32Array(m*3),I=new Float32Array(m*3),u=new Float32Array(m*4);n.forEach((i,w)=>{y.set(i.p,w*3),I.set(i.v,w*3),u.set([i.t0,i.s,i.spin,i.seed],w*4)});const d=new a.InstancedBufferGeometry;d.setAttribute("position",F.attributes.position),d.setIndex(F.index),d.setAttribute("aP0",new a.InstancedBufferAttribute(y,3)),d.setAttribute("aV0",new a.InstancedBufferAttribute(I,3)),d.setAttribute("aSp",new a.InstancedBufferAttribute(u,4)),d.instanceCount=m;const l=new a.MeshStandardMaterial({color:o.snow.clone().multiplyScalar(.78).lerp(o.iceLight,.4),emissive:o.sapphire,emissiveIntensity:.08,roughness:.22,flatShading:!0});l.onBeforeCompile=i=>{i.uniforms.uCalvT=e.uCalvT,i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
attribute vec3 aP0, aV0; attribute vec4 aSp; uniform float uCalvT;`).replace("#include <begin_vertex>",`#include <begin_vertex>
{
  float tau = uCalvT - aSp.x, vis = step(0.0, tau);
  vec3 pp = aP0 + aV0*tau + vec3(0.0, -0.5*${Se.toFixed(3)}*tau*tau, 0.0);
  vis *= smoothstep(-2.5, 0.0, pp.y);
  vec3 ax = normalize(vec3(sin(aSp.w*37.0), cos(aSp.w*53.0), sin(aSp.w*91.0)));
  float an = tau*aSp.z + aSp.w*6.28, ca = cos(an), sa = sin(an);
  vec3 v = transformed*aSp.y*vis;
  transformed = v*ca + cross(ax, v)*sa + ax*dot(ax, v)*(1.0 - ca) + pp;
}`)};const x=new a.Mesh(d,l);return x.frustumCulled=!1,x.name="calving-shards",x}async function Je(n,o={}){const e=n.rng.fork?n.rng.fork("calving-hero"):n.rng,F=n.noise,m=o.palette&&o.palette.length>=6?o.palette:Ee,y={glow:{value:o.iceGlow??1},sky:new a.Color(m[0]),iceLight:new a.Color(m[1]),snow:new a.Color(m[2]),cyan:new a.Color(m[3]),sapphire:new a.Color(m[4]),water:new a.Color(m[5])},I=ce(o.width??520,260,1400),u=o.archDistance??230,d=(o.sunDir?new a.Vector3().copy(o.sunDir):new a.Vector3(-.6,.7,.4)).normalize(),l=o.swell??1,x=new a.Group;x.name="the-calving";const i=new a.Vector3(e.range(-2,2),24,0),w={uCalvT:{value:0},uCalvTime:{value:0},uCalvImp:{value:i},uCalvSwell:{value:l},uCalvSh:{value:Array.from({length:6},()=>new a.Vector4(0,0,-100,1))},uCalvShDir:{value:new a.Vector3(1,0,0)}},g={value:0},_={value:0},q={value:0},N={value:0},H={value:new a.Vector4(0,u,20,0)},T=()=>n.yield(),Y=await je(F,e,y,I,T);await n.yield();const O=Fe(y,w,{sweep:o.lightSweep??0}),ee=new a.Mesh(Y.geometry,O);ee.name="calving-glacier",x.add(ee),await n.yield();const M=Fe(y,w,{detail:.8,fresh:.42,frost:1}),p=()=>e.range(-.8,.8),r=4.5,C=[{c:[0,9.5,r],s:[25,31,14.5],delay:0,kick:2.5,vmax:25,n:46,eq:-.34},{c:[-5.4+p(),35,r-.2],s:[14.5,23,14],delay:.3,kick:3.5,vmax:35,n:70,eq:-.3},{c:[7.2+p(),34,r+.4],s:[11.5,22,13],delay:.15,kick:3,vmax:28,n:50,eq:-.32},{c:[.6+p(),56,r-.4],s:[22,22,13],delay:.5,kick:4,vmax:35,n:84,eq:-.12,main:!0},{c:[-1+p(),74.5,r-.6],s:[18.5,19,12],delay:.75,kick:4,vmax:29,n:60,eq:-.3,spires:10}],v=new a.Vector3(0,0,r),f=new a.Vector3(1,0,0),b=t=>Ne*Math.pow(Math.max(t,0)/Ie,2),L=[];for(let t=0;t<C.length;t++){const c=C[t],s=_e(F,e,c.s[0],c.s[1],c.s[2],y,{spires:c.spires,amp:1.5,seg:2,weathered:($e,He,We)=>Math.max(z(.15,.6,We),c.spires?z(.3,.8,He):0)}),h=new a.Mesh(s,M);h.name="calving-block-"+t,x.add(h);const P=Ie+c.delay,X=b(P),Q=2*Ne*P/(Ie*Ie),fe=new a.Vector3(...c.c),we=fe.clone().sub(v).applyAxisAngle(f,X),be=we.clone().add(v),Ae=new a.Vector3(e.range(-1.6,1.6)+(fe.x-.5)*.12,-we.z*Q+e.range(-.5,1.2),we.y*Q+c.kick*e.range(.8,1.2)),Ve=c.s[1]*.25,ke=(Ae.y+Math.sqrt(Ae.y*Ae.y+2*Se*Math.max(.1,be.y-Ve)))/Se,qe=new a.Vector3(1,e.range(-.35,.35),e.range(-.5,.5)).normalize();L.push({d:c,mesh:h,c:fe,tr:P,om:Q,p0:be,v0:Ae,yHit:Ve,tauH:ke,tHit:P+ke,axis:qe,spin:e.range(.22,.5)*(c.main?1.1:1),rollAxis:new a.Vector3(e.range(-.3,.3),0,1).normalize(),hit:new a.Vector3(be.x+Ae.x*ke,0,be.z+Ae.z*ke),depth:c.s[1]*e.range(.85,1.1)}),await n.yield()}i.z=(L[1].tHit+L[2].tHit)*.5,i.x=(L[1].hit.x+L[2].hit.x)*.5,i.y=(L[1].hit.z+L[3].hit.z)*.5;const K=i.z+Math.max(0,Math.hypot(i.x,u-i.y)-22)/ze,te=7.5,J=new a.Quaternion,G=new a.Quaternion,k=new a.Vector3;function ie(t,c){const s=t.mesh;if(c<=t.tr){const Q=b(c);s.position.copy(t.c).sub(v).applyAxisAngle(f,Q).add(v),s.quaternion.setFromAxisAngle(f,Q);return}const h=Math.min(c-t.tr,t.tauH),P=Math.max(0,c-t.tHit);s.position.set(t.p0.x+t.v0.x*h,t.p0.y+t.v0.y*h-.5*Se*h*h,t.p0.z+t.v0.z*h);let X=h;if(P>0){const Q=t.d.eq*t.d.s[1],fe=(1-Math.exp(-.7*P))/.7;s.position.y=Q+(t.yHit-Q)*Math.exp(-3*P)-t.depth*Math.exp(-.3*P)*Math.sin(.9*P),s.position.x+=t.v0.x*fe,s.position.z+=t.v0.z*fe*.8+(t.d.main?1.4:.6)*P*Math.exp(-P*.08),X+=(1-Math.exp(-.45*P))/.45}J.setFromAxisAngle(f,b(t.tr)+t.om*h),G.setFromAxisAngle(t.axis,t.spin*X),s.quaternion.copy(G).multiply(J),P>0&&t.d.main&&(G.setFromAxisAngle(t.rollAxis,2.2*(1-Math.exp(-.13*P))+.12*Math.sin(P*.7)),s.quaternion.premultiply(G))}await n.yield();const B=[];for(let t=0;t<200;t++){const c=t<50,s=e.pick(L),h=c?e.range(.4,Ie):s.tr+e.range(-.2,1.6),P=b(Math.min(h,s.tr));if(k.set(s.c.x+e.range(-.5,.5)*s.d.s[0],s.c.y+e.range(-.5,.5)*s.d.s[1],c?r+e.pick([-7,6.5]):s.c.z+e.range(-.5,.55)*s.d.s[2]),k.sub(v).applyAxisAngle(f,P).add(v),!c){const X=Math.max(0,h-s.tr);k.x+=s.v0.x*X,k.y+=s.v0.y*X-.5*Se*X*X,k.z+=s.v0.z*X}B.push({p:[k.x,Math.max(1,k.y),k.z],v:[e.range(-5,5),e.range(-1,6)+(c?0:s.v0.y),e.range(1.5,10)],t0:h,s:e.range(.5,1.4)*(e.chance(.15)?2.2:1),spin:e.range(.8,3.2)*e.sign(),seed:e()})}x.add(Ze(B,y,w));const A=[],W=(t,c,s,h,P,X,Q,fe=1,we=0)=>A.push({o:t,v:c,t0:s,life:h,s0:P,s1:X,a:Q,g:fe,clock:we,seed:e()});for(let t=0;t<28;t++)W([e.range(-13,13),e.range(40,84),e.range(-5,0)],[e.range(-2,2),e.range(.5,3),e.range(.5,4)],e.range(0,.7),e.range(4.5,7),3,e.range(9,15),.34,.04);for(let t=0;t<22;t++)W([e.range(-12,12),e.range(2,62),r+e.range(5,10)],[e.range(-1.5,1.5),e.range(-1,1),e.range(1,4)],e.range(1,4.6),e.range(3,5),2.5,e.range(7,11),.3,.12);for(const t of L){for(let c=0;c<t.d.n;c++){const s=Math.pow(e(),.7),h=e.range(0,6.283),P=(1-s)*e.range(4,15)+e.range(0,3),X=e.range(0,9);W([t.hit.x+Math.cos(h)*X,0,t.hit.z+Math.sin(h)*X],[Math.cos(h)*P,t.d.vmax*(.3+.7*s)*e.range(.9,1.05),Math.sin(h)*P*.8+1.5],t.tHit+e.range(0,1.1),e.range(5.8,8.6)*(.6+.4*s),e.range(6.5,11.5),e.range(18,32),e.range(.42,.62))}for(let c=0;c<14;c++){const s=e.range(-.4,Math.PI+.4),h=e.range(13,30);W([t.hit.x,0,t.hit.z],[Math.cos(s)*h,e.range(2,6),Math.sin(s)*h],t.tHit+e.range(.1,.9),e.range(4,6.4),9,e.range(18,28),.3)}}for(let t=0;t<52;t++){const c=e.range(0,6.283),s=e.range(8,15),h=e.sign()*e.range(9,16);W([h,0,u+Math.sin(c)*s*.5],[Math.sign(h)*e.range(1,6),e.range(5,13),Math.sin(c)*e.range(2,6)],e.range(.3,3),e.range(2.6,4.6),2,e.range(5,9),.26,1,1)}for(let t=0;t<44;t++){const c=e.range(-13.5,13.5),s=Math.abs(c)<7&&e.chance(.6),h=s?ue.cy+ue.hh*Math.pow(Math.max(0,1-Math.pow(Math.abs(c)/ue.hw,ue.ex)),1/ue.ex)-.3:e.range(6,13);W([c,h,u+e.range(-3.5,4)],[e.range(-.3,.3),-1,e.range(-.3,.3)],2.6+e.range(0,2),-e.range(1.5,2.3),s?.5:.9,s?e.range(1,1.7):e.range(1.8,3),s?.3:.45,1,1)}x.add(Oe(A,y,w,{sunDir:d,archT:g,drip:_})),await n.yield();const R=Fe(y,w,{wet:q,rim:N,detail:1,scallop:1}),D=-2,V=new a.Group,S=100*Math.PI/180,j=await Ue(F,e,y,o.archYaw??0,S,D,T),ne=new a.Mesh(j.ring,R);ne.position.y=-D,V.add(ne),V.name="calving-arch",x.add(V),j.ridge.computeBoundingBox();const Z=j.ridge.boundingBox.getCenter(new a.Vector3);j.ridge.translate(-Z.x,-Z.y,-Z.z);const re=new a.Mesh(j.ridge,R);re.position.set(Z.x,Z.y-D,Z.z),V.add(re);const $=(o.archYaw??0)+e.range(-.02,.02);await n.yield();const E=Y.geometry.attributes.position,ae=E.count/(Math.round(ce(I/1.75,200,420))+1),U=t=>{const c=ce(Math.round((t+I/2)/I*(E.count/ae-1)),0,E.count/ae-1);return E.getZ(c*ae+4)};o.sea!==!1&&x.add(Ye(y,w,{imp:i,sunDir:d,skyTop:new a.Color(o.skyTop||m[0]),skyHor:new a.Color(o.skyHorizon||m[1]),archFoam:H,glitter:o.glitter})),await n.yield();const ve=11;o.floes!==!1&&x.add(Ke(F,e,y,w,{count:520,half:Math.min(I/2,330),imp:i,wallZ:U,channel:ve,archZ:u})),await n.yield();let ge=null,xe=null,pe=0,de=0;const he=t=>(t=ce(t,0,1),t*t*t*(t*(t*6-15)+10)),oe=(t,c)=>Be(t,c,pe,de,i,l),se=(t,c,s)=>Be(t,c,s,0,i,0);function ye(t,c){pe=t,de=c,w.uCalvT.value=t,w.uCalvTime.value=c;for(const be of L)ie(be,t);const s=xe!=null?xe*te:Math.max(0,t-K),h=he(s/3.2),P=Math.max(0,s-3.2),X=h*.2*Math.exp(-.38*P)*Math.sin(1.55*P+.2)*(s>0?1:0),Q=oe(0,u),fe=(oe(0,u+5)-oe(0,u-5))/10,we=.9*(1-h)+3*Math.sin(Math.PI*ce(s/4.6,0,1))*h+.5*Math.exp(-.3*P)*Math.sin(1.1*P)*h;V.position.set(0,D+we+Q*.75,u),V.rotation.set(S*(1-h)-X+Math.atan(fe)*.6+.012*Math.sin(c*.7),$,.02*Math.sin(c*.53+1)+.05*h*Math.exp(-.3*P)*Math.sin(1.2*P)),g.value=s,re.scale.setScalar(Math.max(.001,1-z(.5,.9,h))),_.value=z(2.3,3.3,s)*(.4+.6*Math.exp(-P/6)),q.value=h*(.35+.65*Math.exp(-P/5)),N.value=h*1.35,H.value.set(0,u,20+Math.min(s,8)*2.2,.95*z(.2,1.4,s)*(1-.5*z(4,9,s))+.4*(1-h))}ye(0,0);const Me=!1,Ce=new a.Vector3,le={portalSeat:{position:new a.Vector3(0,3.5,u),normal:new a.Vector3(0,0,1),radius:7},flyThrough:[[0,.8,440],[0,.8,380],[0,.8,320],[0,.8,u+60],[0,2.1,u+30],[0,3.5,u],[0,3.5,u-14]].map(t=>new a.Vector3(...t)),viewpoints:{kayakStart:new a.Vector3(0,.8,440),kayakWave:new a.Vector3(0,.8,290),archReveal:new a.Vector3(0,2.5,u+30)},impact:new a.Vector3(i.x,0,i.y),towerTop:new a.Vector3(0,74,r),cliffTop:new a.Vector3(0,Y.top,-10),archCrown:new a.Vector3(0,14,u),splashTop:new a.Vector3(i.x,96,i.y),channelHalfWidth:ve,opening:{halfWidth:7.4,yMin:-3,yMax:10.5}};return{object:x,radius:Me?20:170,height:Me?18:78,center:Me?new a.Vector3(0,6,u):new a.Vector3(0,24,95),anchors:le,eventLength:Le,timeline:{release:Ie,hit:i.z,arch:K,archLength:te,waveSpeed:ze,waveAt:t=>i.z+Math.max(0,t-i.y)/ze,blockHits:L.map(t=>t.tHit)},waveHeight:oe,ringHeight:se,wallZ:U,waveGLSL:Te,waveUniforms:w,shadowGLSL:De,setShadows(t,c,s){const h=Math.hypot(c[0],c[1])||1;w.uCalvShDir.value.set(c[0]/h,c[1]/h,s),w.uCalvSh.value.forEach((P,X)=>{const Q=t[X];Q?P.set(Q.x,Q.z,Q.halfWidth,Q.length):P.set(0,0,-100,1)})},kit:{pal:y,makeIceBlock:(t,c,s,h)=>_e(F,e,t,c,s,y,h),makeIceMaterial:t=>Fe(y,w,t)},setProgress(t){ge=ce(t,0,1.5)*Le},setEventTime(t){ge=t},setArchProgress(t){xe=t==null?null:Math.max(0,t)},update(t,c,s){let h=ge;h==null&&(h=Math.min((c+23)%26,25)),ye(h,c),s&&(s.getWorldPosition(Ce),N.value*=ce(Math.hypot(Ce.x-x.position.x,Ce.z-x.position.z-u)/52,.12,1))},dispose(){},ground:o.sea===!1,groundY:0}}export{Je as buildHero};
