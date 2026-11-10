import*as r from"three";import{makePath as lo,clamp as Re,lerp as $,smoothstep as H}from"../kit/core.js";import{makeSky as co,makeLightRig as fo,skyDirection as Lt}from"../kit/sky.js";import*as uo from"../kit/terrain.js";import*as xe from"../kit/flora.js";import*as Te from"../kit/fauna.js";import*as Ge from"../kit/fx.js";import*as q from"../kit/structures.js";import{buildHero as ho}from"../parts/first-rain-stepwell.js";const Ce=Math.PI*2,vo=new r.Vector3(0,-53,38),mo=["#D9A55B","#8A5A2B","#1F2347","#4B5673","#E3B21A","#3F7A4E","#FFE3A1"],x0=38,_=o=>new r.Color(o),Le=o=>{const f=Math.sin(o*127.1+311.7)*43758.5453;return f-Math.floor(f)},Ut={storm:{title:"The Thousand-Stair Rain",sky:{preset:"storm",zenith:"#454c66",mid:"#4a5270",horizon:"#4B5673",ground:"#3a3320",horizonPow:2.6,midPow:1.3,scatterColor:"#FFE3A1",scatter:1.5,scatterPow:2.2,scatterHigh:.2,scatterFall:4.5,sunColor:"#FFD08A",sunSize:1.5,sunIntensity:12,sunGlow:1,sunGlowTight:.45,stars:0,lightning:0,clouds:!1,clouds2:{coverage:.42,stretch:1,opacity:.55,lit:"#ffe6b8",shade:"#6d6a8c",scale:.9,haze:1.2},lightColor:"#ffd79c",lightIntensity:3.3,ambientColor:"#6a76a8",groundLight:"#7a6238",ambientIntensity:1.2,lightElevationMin:10},sunEl:24,sunAz:285,heroSun:["#FFD08A",1.75],heroFill:["#586a98",1.75],skyE:["#1F2347",2.4],skyW:["#FFE3A1",.85],fog0:"#b9965e",fog1:"#7d8499",dens0:.0012,dens1:.004,exposure:.97,night:0,lamps:0,haze:"#6f6c7c",shelf:["#2b3058","#4a5078","#b48a5e"],wallLit:"#8a86a4",wallShade:"#3b4168",rain:["#fff0c8","#d8d6e8","#ffe2a0"],gold:[1.7,1.35,.8],grade:{saturation:1,contrast:1.06,tint:"#fff6ea",shadowTint:"#05060f"},portal:"#ffe3a1",flock:1},dusk:{title:"The Thousand-Stair Rain at Dusk",sky:{preset:"blueHour",zenith:"#30365a",mid:"#3c4268",horizon:"#4a4f74",ground:"#2c2a30",horizonPow:2.8,midPow:1.3,scatterColor:"#ffab6b",scatter:1.5,scatterPow:2.6,scatterHigh:.1,scatterFall:6,sunIntensity:0,sunGlow:.5,stars:0,bodies:[],lightning:0,clouds:!1,clouds2:{coverage:.4,stretch:1,opacity:.6,lit:"#f0a880",shade:"#4a4a70",haze:1.3},lightColor:"#ffc49a",lightIntensity:1.5,ambientColor:"#5a6cae",groundLight:"#6a5c58",ambientIntensity:1.3,lightElevationMin:17,key:"sun"},sunEl:-3,sunAz:285,heroSun:["#ffb684",.5],heroFill:["#6c80b8",1.2],skyE:["#1a1f44",2],skyW:["#ffb07a",.8],fog0:"#5a5670",fog1:"#525a78",dens0:.0013,dens1:.0038,exposure:1.12,night:.6,lamps:1,haze:"#5a5e7c",shelf:["#272b4a","#3e4264","#c08a6e"],wallLit:"#8a7a94",wallShade:"#33385c",rain:["#c8d4f0","#a8b4d8","#e8d0c0"],gold:[.7,.85,1.25],grade:{saturation:.94,contrast:1,tint:"#f4f2ff",shadowTint:"#0b0c16"},portal:"#ffd9a0",flock:.9},dust:{title:"Dust Before the Rain",sky:{preset:"storm",zenith:"#3e3440",mid:"#5a4640",horizon:"#8a6238",ground:"#4a3620",horizonPow:2,midPow:1.2,scatterColor:"#ffb060",scatter:1.3,scatterPow:2.4,scatterHigh:.25,scatterFall:3.5,sunColor:"#ff9d4a",sunSize:1.6,sunIntensity:9,sunGlow:1.3,sunGlowTight:.3,stars:0,lightning:0,clouds:!1,clouds2:!1,lightColor:"#ffcf98",lightIntensity:2.9,ambientColor:"#b4a694",groundLight:"#8a6a3c",ambientIntensity:1.5,lightElevationMin:10},sunEl:20,sunAz:281,heroSun:["#ffa050",1.7],heroFill:["#6a5a66",2],skyE:["#3a2c38",2.2],skyW:["#ffc070",.85],fog0:"#c08a4a",fog1:"#7d8499",dens0:.0032,dens1:.004,exposure:1.06,night:0,lamps:0,haze:"#94765a",shelf:["#3a2f3a","#4e4250","#e09048"],wallLit:"#7e6a78",wallShade:"#3c3040",wallBase:"#5c4a4e",rain:["#ffe0b0","#d8d0d8","#ffd090"],gold:[1.7,1.2,.65],grade:{saturation:.9,contrast:1.07,tint:"#fff2e2",shadowTint:"#0a0a10"},portal:"#ffe3a1",flock:1,clean:{sun:"#FFD08A",fill:["#586a98",1.75],skyE:["#1F2347",2.4],light:"#FFD08A",amb:"#6a76a8"}}};function H0(){const o=[],f=[],c={c:[1,1,1],ox:0,oy:0,oz:0,cs:1,sn:0,sc:1,at(x,p,z,P=0,k=1){return c.ox=x,c.oy=p,c.oz=z,c.cs=Math.cos(P),c.sn=Math.sin(P),c.sc=k,c},tint(x,p=1){const z=_(x);return c.c=[z.r*p,z.g*p,z.b*p],c},v(x){const p=x[0]*c.sc,z=x[1]*c.sc,P=x[2]*c.sc;o.push(c.ox+p*c.cs+P*c.sn,c.oy+z,c.oz-p*c.sn+P*c.cs),f.push(c.c[0],c.c[1],c.c[2])},tri(x,p,z){c.v(x),c.v(p),c.v(z)},quad(x,p,z,P){c.tri(x,p,z),c.tri(x,z,P)},box(x,p,z,P,k,M){const b=[x,p,z],I=[P,p,z],S=[P,p,M],T=[x,p,M],y=[x,k,z],h=[P,k,z],n=[P,k,M],l=[x,k,M];c.quad(b,y,h,I),c.quad(I,h,n,S),c.quad(S,n,l,T),c.quad(T,l,y,b),c.quad(y,l,n,h),c.quad(b,I,S,T)},lathe(x,p,z,P,k=8,M="y",b=Ce,I=0){const S=(T,y,h)=>M==="y"?[x+Math.cos(h)*T,p+y,z+Math.sin(h)*T]:[x+Math.cos(h)*T,p+Math.sin(h)*T,z+y];for(let T=0;T<P.length-1;T++)for(let y=0;y<k;y++){const h=I+y/k*b,n=I+(y+1)/k*b,[l,u]=P[T],[F,L]=P[T+1];l<1e-4?c.tri(S(l,u,h),S(F,L,n),S(F,L,h)):F<1e-4?c.tri(S(l,u,h),S(l,u,n),S(F,L,h)):c.quad(S(l,u,h),S(l,u,n),S(F,L,n),S(F,L,h))}},geometry(){const x=new r.BufferGeometry;return x.setAttribute("position",new r.BufferAttribute(new Float32Array(o),3)),x.setAttribute("color",new r.BufferAttribute(new Float32Array(f),3)),x.computeVertexNormals(),x}};return c}function X0(o,f=0,c=0){const x="#2f6fe0",p="#3aa66a",z="#a8943c",P="#3a72f0";o.tint(x,.9),o.lathe(0,c?0:.62,-.42,[[0,0],[.2,.18],[.24,.45],[.18,.75],[0,.9]],6,"z"),c||(o.tint("#6a6050"),o.box(-.09,0,-.03,-.05,.5,.03),o.box(.05,0,-.03,.09,.5,.03));const k=c?.08:.72,M=.38,b=c?[0,.22,1]:[0,1.32,.52];o.tint(x,1.15);for(const S of[-1,1])o.quad([S*.09,k,M-.06],[S*.05,b[1],b[2]-.05],[0,b[1],b[2]+.05],[0,k,M+.08]);o.quad([-.09,k,M-.06],[.09,k,M-.06],[.05,b[1],b[2]-.05],[-.05,b[1],b[2]-.05]),o.box(-.06,b[1]-.02,b[2]-.06,.06,b[1]+.1,b[2]+.12),o.tint("#d8d0b0"),o.tri([-.03,b[1]+.04,b[2]+.12],[.03,b[1]+.04,b[2]+.12],[0,b[1]+.02,b[2]+.24]),o.tint(x,1.4);for(const S of[-.05,0,.05])o.tri([S-.015,b[1]+.1,b[2]],[S+.015,b[1]+.1,b[2]],[S*2.2,b[1]+.3,b[2]-.05]);const I=c?.02:.7;if(f)for(let T=0;T<11;T++){const y=-1.45+2.9*T/11,h=-1.45+2.9*(T+1)/11,n=1.45,l=-.3;o.tint(T%2?p:z,1),o.quad([Math.sin(y)*.15,I+Math.cos(y)*.15,l],[Math.sin(h)*.15,I+Math.cos(h)*.15,l],[Math.sin(h)*n,I+Math.cos(h)*n,l-.25],[Math.sin(y)*n,I+Math.cos(y)*n,l-.25]);const u=(y+h)/2;o.tint(P,1.3),o.quad([Math.sin(u)*(n-.32)-.07,I+Math.cos(u)*(n-.32),l-.3],[Math.sin(u)*(n-.32)+.07,I+Math.cos(u)*(n-.32),l-.3],[Math.sin(u)*(n-.14)+.07,I+Math.cos(u)*(n-.14),l-.3],[Math.sin(u)*(n-.14)-.07,I+Math.cos(u)*(n-.14),l-.3])}else{const S=c?2.3:1.9,T=c?.12:.62;for(let y=0;y<4;y++){const h=-.2+y*.1,n=h+.1,l=1.7;o.tint(y%2?p:z,.95),o.quad([h,I,-.3],[n,I,-.3],[n*l,I-T,-.3-S],[h*l,I-T,-.3-S])}o.tint(P,1.2),o.quad([-.2,I-T*.75,-.3-S*.75],[.2,I-T*.75,-.3-S*.75],[.3,I-T,-.3-S],[-.3,I-T,-.3-S])}if(c)for(const S of[-1,1])o.tint("#8a6a3a"),o.quad([S*.15,.12,.3],[S*.95,.24,.12],[S*.9,.2,-.3],[S*.15,.1,-.25]),o.tint("#3a3a44"),o.quad([S*.95,.24,.12],[S*1.3,.2,-.1],[S*1.2,.18,-.35],[S*.9,.2,-.3])}function po(o){const f=[],c=[],x=[],p=[],z=[];let P=[0,0,0,0,1],k=0;const M=(te,oe=1)=>{const ae=_(te);return[ae.r*oe,ae.g*oe,ae.b*oe]},b=(te,oe,ae)=>[$(te[0],oe[0],ae),$(te[1],oe[1],ae),$(te[2],oe[2],ae)],I=(te,oe,ae,Be,Ae)=>{const Ue=Math.cos(P[3]),Pe=Math.sin(P[3]),R=P[4];f.push(P[0]+(te[0]*Ue+te[2]*Pe)*R,P[1]+te[1]*R,P[2]+(-te[0]*Pe+te[2]*Ue)*R),x.push(oe[0]*Ue+oe[2]*Pe,oe[1],-oe[0]*Pe+oe[2]*Ue),c.push(ae[0],ae[1],ae[2]),p.push(Be[0],Be[1],Be[2]),z.push(Ae[0],Ae[1]*R,k)},S=(te,oe,ae)=>{I(...te),I(...oe),I(...ae)},T=(te,oe,ae,Be)=>{S(te,oe,ae),S(te,ae,Be)},y=M("#1d3f9c"),h=M("#2552c4"),n=M("#1f48b0"),l=M("#2c6a44"),u=M("#cfc6a8"),F=M("#20222c"),L=M("#a85c28"),W=M("#34261e"),G=M("#b89c68"),D=M("#2f7c46"),ie=M("#8a7c34"),V=M("#1f6c5c"),Ee=M("#d8d4c4"),ee=(te,oe,ae,Be,Ae,Ue,Pe,R,ue,re,j=0,le=0)=>{const ce=[[0,.55],[.5,1],[.86,.8],[1,.3]],he=[];for(const[X,ke]of ce){const de=te[0]+oe[0]*Ae*X,J=te[1]+oe[1]*Ae*X-j*X*X,me=te[2]+oe[2]*Ae*X,Q=Ue*ke*.5,we=[];for(const pe of[-1,1]){const De=[de+ae[0]*Q*pe,J+ae[1]*Q*pe-le*(pe>0?1:0),me+ae[2]*Q*pe];we.push([De,Be,b(Pe,R,X),[pe,X,ue+Ae/10],re(De,X)])}he.push(we)}for(let X=0;X<3;X++)T(he[X][0],he[X][1],he[X+1][1],he[X+1][0])};for(const te of o){P=te,k=te[5]||0;const oe=()=>[0,0],ae=[[-.5,0,0,l],[-.42,.09,0,l],[-.25,.17,0,b(l,y,.5)],[-.05,.215,0,y],[.15,.21,0,y],[.3,.16,.02,y],[.4,.11,.04,h],[.56,.075,.075,h],[.74,.06,.12,h],[.88,.055,.155,n],[.95,.072,.17,n],[1.02,.068,.172,n],[1.07,.036,.165,u],[1.17,0,.15,u]],Be=10,Ae=(R,ue)=>{const[re,j,le,ce]=ae[R],he=Math.cos(ue),X=Math.sin(ue),ke=R>=10&&R<=11&&Math.abs(X)<.4;return[[he*j,le+X*j*.88,re],[he,X,.15],X<-.5?b(ce,F,.35):ke?Ee:ce,[0,0,0],[0,0]]};for(let R=0;R<ae.length-1;R++)for(let ue=0;ue<Be;ue++){const re=ue/Be*Ce,j=(ue+1)/Be*Ce;T(Ae(R,re),Ae(R,j),Ae(R+1,j),Ae(R+1,re))}for(let R=0;R<5;R++){const ue=(R-2)*.028,re=[ue*.4,.235,.985],j=[ue*1.5,.39,.93-Math.abs(R-2)*.012],le=[0,.3,1];T([[re[0]-.006,re[1],re[2]],le,V,[0,0,0],[0,0]],[[re[0]+.006,re[1],re[2]],le,V,[0,0,0],[0,0]],[[j[0]+.005,j[1],j[2]],le,V,[0,0,0],[0,0]],[[j[0]-.005,j[1],j[2]],le,V,[0,0,0],[0,0]]),T([[j[0]-.022,j[1],j[2]],le,V,[0,0,0],[0,0]],[[j[0],j[1]-.02,j[2]],le,V,[0,0,0],[0,0]],[[j[0]+.022,j[1],j[2]],le,V,[0,0,0],[0,0]],[[j[0],j[1]+.045,j[2]-.006],le,n,[0,0,0],[0,0]])}for(const R of[-1,1]){const ue=[R*.13,.1,.24],re=[R*.6,.17,.31],j=[R*1.08,.27,.06],le=J=>J<.55?[$(ue[0],re[0],J/.55),$(ue[1],re[1],J/.55),$(ue[2],re[2],J/.55)]:[$(re[0],j[0],(J-.55)/.45),$(re[1],j[1],(J-.55)/.45),$(re[2],j[2],(J-.55)/.45)],ce=J=>[Re((Math.abs(J[0])-.13)/.95,0,1),0],he=J=>.25*(1-.55*J),X=[-R*.12,1,.05],ke=7;for(let J=0;J<ke;J++){const me=J/ke,Q=(J+1)/ke,we=le(me),pe=le(Q),De=he(me),Qe=he(Q),Ie=(Oe,S0,M0,f0,u0)=>{const d0=[Oe[0],Oe[1]+M0,Oe[2]-S0];return[d0,X,b(G,F,.25+.3*f0),[0,u0,3+f0],ce(d0)]};T(Ie(we,-.02,-.01,me,0),Ie(pe,-.02,-.01,Q,0),Ie(pe,Qe*.5,.022,Q,.5),Ie(we,De*.5,.022,me,.5)),T(Ie(we,De*.5,.022,me,.5),Ie(pe,Qe*.5,.022,Q,.5),Ie(pe,Qe,0,Q,1),Ie(we,De,0,me,1))}const de=16;for(let J=0;J<de;J++){const me=J/(de-1),Q=le(me),we=[Q[0],Q[1]-.004-.002*J,Q[2]-he(me)*.8],pe=$(-.12,1.3,Math.pow(me,1.6)),De=[R*Math.sin(pe),-.03,-Math.cos(pe)],Qe=[R*Math.cos(pe),0,Math.sin(pe)],Ie=.4+.24*Math.sin(Math.PI*Re((me-.25)/.95,0,1)),Oe=H(.42,.6,me);ee(we,De,Qe,X,Ie,.125-.03*Oe,b(F,L,Oe),b(F,W,Oe),1,ce,.02,.014)}}const Ue=[0,.05,-.4],Pe=(R,ue,re,j,le,ce)=>{for(let he=0;he<R;he++){const X=R===1?0:he/(R-1)*2-1,ke=X*ue,de=$(j,re,Math.abs(X))*(.94+.12*Le(he*7.3+R*3.1+k)),J=[Math.sin(ke),-.035,-Math.cos(ke)],me=[Math.cos(ke),0,Math.sin(ke)],Q=he%2?D:ie;ee([Ue[0]+X*.1,Ue[1]+le,Ue[2]],J,me,[0,1,0],de,.2,b(Q,F,.35),Q,2,(we,pe)=>[0,pe*de],ce*de,0)}};Pe(7,.34,.55,.85,.05,.02),Pe(8,.27,1.05,1.5,.03,.035),Pe(9,.2,1.75,2.35,0,.05)}const Ve=new r.BufferGeometry;return Ve.setAttribute("position",new r.Float32BufferAttribute(f,3)),Ve.setAttribute("color",new r.Float32BufferAttribute(c,3)),Ve.setAttribute("normal",new r.Float32BufferAttribute(x,3)),Ve.setAttribute("aF",new r.Float32BufferAttribute(p,3)),Ve.setAttribute("aW",new r.Float32BufferAttribute(z,3)),Ve}const go=`
attribute vec3 aF; attribute vec3 aW;
uniform float uTime, uAmp;
varying vec3 vC; varying vec3 vW; varying vec3 vN; varying vec3 vF;
#include <fog_pars_vertex>
void main(){
  vec3 p = position; vC = color; vF = aF;
  float ph = aW.z, beat = sin(uTime*2.2 + ph)*0.8 + sin(uTime*4.4 + ph*1.7)*0.2;
  p.y += aW.x*aW.x*beat*uAmp - beat*uAmp*0.16;                                  // the wings beat slowly from the shoulder and the body rides against them
  p.z -= aW.x*aW.x*cos(uTime*2.2 + ph)*uAmp*0.25;
  p.y += aW.y*0.05*sin(uTime*3.1 - aW.y*1.5 + ph);                              // the train trails and ripples toward its tips
  p.x += aW.y*0.035*sin(uTime*2.3 - aW.y*1.1 + ph*2.);
  vec4 w = modelMatrix*vec4(p, 1.); vW = w.xyz;
  vN = mat3(modelMatrix)*(normal + vec3(0., aW.x*beat*0.5, 0.));
  vec4 mvPosition = viewMatrix*w;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,yo=`
uniform vec3 uSunDir, uSunCol, uAmb;
varying vec3 vC; varying vec3 vW; varying vec3 vN; varying vec3 vF;
#include <fog_pars_fragment>
void main(){
  vec3 N = vN / max(length(vN), 1e-5);
  vec3 Vv = cameraPosition - vW; vec3 V = Vv / max(length(Vv), 1e-4);
  if (dot(N, V) < 0.) N = -N;
  vec3 alb = vC;
  float kind = floor(vF.z + 0.001), len = (vF.z - kind)*10., ax = abs(vF.x), gloss = 0.5;
  if (kind > 0.5 && kind < 2.5) {                                               // a feather: its shaft, its barbs, a darker edge
    float barb = 0.8 + 0.2*sin(vF.y*len*45. + ax*5.);
    alb *= barb * (1. - 0.3*smoothstep(0.55, 1., ax));
    alb = mix(alb, alb*1.7 + 0.03, smoothstep(0.16, 0.05, ax)*0.55);
  }
  if (kind > 1.5 && kind < 2.5) {                                               // the eye at a train feather's end
    vec2 q = vec2(vF.x*0.085, (vF.y - 0.86)*len) / 0.075;
    float r = length(q*vec2(1., 0.8));
    vec3 eye = mix(vec3(0.015, 0.02, 0.11), vec3(0.03, 0.24, 0.4), smoothstep(0.3, 0.42, r));
    eye = mix(eye, vec3(0.4, 0.25, 0.06), smoothstep(0.6, 0.72, r));
    eye = mix(eye, vec3(0.2, 0.36, 0.11), smoothstep(0.92, 1.05, r));
    alb = mix(eye, alb, smoothstep(1.15, 1.4, r));
    gloss = 0.6;
  }
  if (kind > 2.5) { float t = vF.z - 3.; alb *= 0.5 + 0.5*smoothstep(0.35, 0.5, abs(fract(vF.y*3.5 + t*13.) - 0.5)*2.); gloss = 0.2; }
  if (kind < 0.5) gloss = 0.8;
  float nl = abs(dot(N, uSunDir)), fr = 1. - abs(dot(N, V));
  vec3 col = alb * (uAmb*(0.9 + 0.35*N.y) + uSunCol*(0.2 + 0.6*nl));
  col += (alb*1.6 + vec3(0.01, 0.03, 0.04)) * gloss * (fr*fr*0.55*(uAmb + uSunCol*0.5));     // the sheen of the neck and train as they turn
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,l0=`
float h21(vec2 p){ p = fract(p*vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y)*p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float fbm4(vec2 p){ return vn(p)*0.5 + vn(p*2.03 + 11.7)*0.25 + vn(p*4.1 + 5.3)*0.125 + vn(p*8.3 + 2.1)*0.0625; }
`,wo=`
varying vec3 vW;
void main(){ vec4 w = modelMatrix*vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,bo=`
uniform float uTime, uEdge, uFlash, uTear;
uniform vec3 uDark, uMid, uLit, uHaze, uCam, uFlashPos, uTearPos;
varying vec3 vW;
${l0}
void main(){
  vec2 p = vW.xz;
  vec2 q = p*0.00105 + vec2(uTime*0.006, uTime*0.0012);
  float n = fbm4(q);
  float n2 = fbm4(q*3.3 + vec2(uTime*0.011, 3.7));
  float n3 = fbm4(q*3.3 + vec2(uTime*0.011 - 0.05, 3.7));        // the same lumps a step toward the sun: their lit side
  float edge = uEdge + (n - 0.47)*620. + (n2 - 0.5)*170.;
  float cover = smoothstep(edge - 30., edge + 260., p.x);
  float tear = uTear * (1. - smoothstep(60., 210., length((p - uTearPos.xz)*vec2(1., 0.6)) + (n2 - 0.5)*160.));
  cover *= 1. - tear;
  if (cover < 0.004) discard;
  float lip = 1. - smoothstep(0., 520., p.x - edge);
  float body = n*0.55 + n2*0.45;
  vec3 col = mix(uDark, uMid, smoothstep(0.32, 0.78, body));
  float lit = clamp((n2 - n3)*9. + 0.5, 0., 1.);
  col = mix(col, uLit, clamp(lip*lip*(0.25 + 0.75*lit) + lit*0.1, 0., 1.));
  col += uLit * uTear * 1.6 * (1. - smoothstep(200., 420., length((p - uTearPos.xz)*vec2(1., 0.6)))) * (0.4 + 0.6*n2);
  float d = length(vW - uCam);
  col = mix(col, uHaze, smoothstep(1400., 5600., d)*0.9);
  float fd = length(p - uFlashPos.xz);
  col += uFlash * vec3(0.5, 0.56, 1.0) * exp(-fd*fd/(1100.*1100.)) * (0.35 + 0.65*n2);
  gl_FragColor = vec4(col, cover*(0.93 + 0.07*n2));
}`,xo=`
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.); }`,ko=`
uniform float uTime;
uniform vec2 uFlash;
uniform vec3 uLit, uShade, uBase, uRim;
varying vec2 vUv;
${l0}
// The wall keeps live's own top line and alpha inside it (the far rank, hazier) and stands two ranks of towers before it. X is radians along the arc
// (vUv.x*3.8: 0 at azimuth 198.85 degrees in the south, 3.8 at azimuth -18.85 in the north), h is vUv.y (0.0288 the ground, 0.1019 the foot at
// the shelf's own 380 m); 1 of either is 5200 m. Every tower comes from a hash of its cell number: no stream and no draw. The sun stands at azimuth 285, 18 degrees up.
// A rank is ONE body: a bank with a head on each tower, the heads joined in round saddles; it is lit as one form, and round lobes of three sizes, joined smoothly, only swell its outline and modulate its light.
// The lobes live in the rank's own frame (X, y = h*0.6/head: the heads' own level at that X stands at 0.6), where the heads' bare form is known without any noise.
vec3 h32(vec2 p){ vec3 q = fract(vec3(p.xyx)*vec3(0.1031, 0.1030, 0.0973)); q += dot(q, q.yxz + 33.33); return fract((q.xxy + q.yzz)*q.zyx); }
const mat2 LR1 = mat2(0.8525, 0.5227, -0.5227, 0.8525);
// live's value noise at p and at a second place p2 that lies in the same noise cell or in the next one to the left, above, or both (live's billow and the same
// billow a step toward the sun): x at p, y at p2, the very numbers vn gives; the second reads again every hash the first has read (7 hashes at most, not 8)
vec2 vn2(vec2 p, vec2 p2){
  vec2 i = floor(p), f = fract(p), i2 = floor(p2), f2 = fract(p2), dI = i2 - i;
  float a = h21(i), b = h21(i + vec2(1., 0.)), c = h21(i + vec2(0., 1.)), e = h21(i + vec2(1., 1.));
  float a2 = a, b2 = b, c2 = c, e2 = e;
  if (dI == vec2(-1., 0.)) { b2 = a; e2 = c; a2 = h21(i2); c2 = h21(i2 + vec2(0., 1.)); }
  else if (dI == vec2(0., 1.)) { a2 = c; b2 = e; c2 = h21(i2 + vec2(0., 1.)); e2 = h21(i2 + vec2(1., 1.)); }
  else if (dI == vec2(-1., 1.)) { b2 = c; a2 = h21(i2); c2 = h21(i2 + vec2(0., 1.)); e2 = h21(i2 + vec2(1., 1.)); }
  else if (dI != vec2(0.)) { a2 = h21(i2); b2 = h21(i2 + vec2(1., 0.)); c2 = h21(i2 + vec2(0., 1.)); e2 = h21(i2 + vec2(1., 1.)); }
  f = f*f*(3. - 2.*f); f2 = f2*f2*(3. - 2.*f2);
  return vec2(mix(mix(a, b, f.x), mix(c, e, f.x), f.y), mix(mix(a2, b2, f2.x), mix(c2, e2, f2.x), f2.y));
}
vec2 fbm4p(vec2 p, vec2 p2){ return vn2(p, p2)*0.5 + vn2(p*2.03 + 11.7, p2*2.03 + 11.7)*0.25 + vn2(p*4.1 + 5.3, p2*4.1 + 5.3)*0.125 + vn2(p*8.3 + 2.1, p2*8.3 + 2.1)*0.0625; }
// live's value noise at p and, on the same row, at the place xs (taken no farther than the next cell on either side): x at p, y at xs; 2 hashes more at most
vec2 vnx(vec2 p, float xs){
  vec2 i = floor(p), f = fract(p);
  float a = h21(i), b = h21(i + vec2(1., 0.)), c = h21(i + vec2(0., 1.)), e = h21(i + vec2(1., 1.));
  float i2 = clamp(floor(xs), i.x - 1., i.x + 1.), f2 = clamp(xs - i2, 0., 1.);
  float a2 = a, b2 = b, c2 = c, e2 = e;
  if (i2 < i.x) { b2 = a; e2 = c; a2 = h21(vec2(i2, i.y)); c2 = h21(vec2(i2, i.y + 1.)); }
  else if (i2 > i.x) { a2 = b; c2 = e; b2 = h21(vec2(i2 + 1., i.y)); e2 = h21(vec2(i2 + 1., i.y + 1.)); }
  f = f*f*(3. - 2.*f); f2 = f2*f2*(3. - 2.*f2);
  return vec2(mix(mix(a, b, f.x), mix(c, e, f.x), f.y), mix(mix(a2, b2, f2), mix(c2, e2, f2), f.y));
}
// tower i of a rank (cells W wide from X0; k 1 the near rank, 0 the middle one): its centre, its half width, its rise over live's line (before the arc's fade)
vec3 towerOf(float i, float W, float X0, float k){
  vec3 r = h32(vec2(i, 7. + 31.*k));
  float ese = k*step(abs(i - 4.), 0.5);                                  // the near rank's cell 4 is centred on azimuth 112.5: the tallest tower, the anvil's
  return vec3(X0 + (i + 0.5 + (r.x - 0.5)*0.4*(1. - ese))*W, W*mix(0.5 + 0.28*r.y, 0.7, ese), mix(0.03*r.z, mix(0.02 + 0.035*r.z, 0.065, ese), k));
}
// the HEADS' bare form at a place S of the rank's own frame: a head stands on each of the three towers that can reach the place. A head is half of its tower's
// half width; its foot stands at 0.65 of its own level (the floor of the saddles), it is widest at 0.4 of its own height, an elliptic dome above that, a fifth
// narrower toward its foot, and it runs on below its foot as a column. Two heads whose open gap is under 260 m are joined into a twin by a smooth maximum 0.1 wide.
// The form is known here without any noise and without any number of the pixel being drawn, so the lobes that grow from it are the same for every pixel.
// x: the heads' outline as a distance (over 0 inside), y: the place across the heads (-1 to 1, 0 between them), z: the heart (1 on a head's axis, 0 at its
// outline and between heads), w: how far the form leans toward the sky (the dome only)
float smax(float a, float b){ float h = max(0.1 - abs(a - b), 0.)/0.1; return max(a, b) + h*h*0.025; }
vec4 body(vec2 S, vec3 A, vec3 B, vec3 C){
  float v = (S.y/0.6 - 0.65)/0.35, z = clamp(1. - v/0.4, 0., 1.), g = 1. - 0.2*z*z*(3. - 2.*z), t = max(0., (v - 0.4)/0.6);
  vec3 a = 0.5*vec3(A.y, B.y, C.y), u = (vec3(S.x) - vec3(A.x, B.x, C.x))/(a*g), n2 = u*u + t*t, N = sqrt(n2);
  vec3 f = (1. - N)*g*(a*u*u + 0.126*t*t + a*1e-3)/(n2 + 1e-3);          // (a head's own distance: across its width on the flank, along the dome's height at its top)
  // no head is a clean oval: three slow swells (680 m, 490 m and 1090 m long, 52, 42 and 52 m high) lie across the heads and rise with the lobes; the lobes grow from the swollen form
  vec2 Sr = vec2(S.x, S.y - uTime*0.003);
  f += 0.010*sin(dot(Sr, vec2(43.8, 20.4)) + 1.3) + 0.008*sin(dot(Sr, vec2(50.7, -42.5)) + 4.1) + 0.010*sin(dot(Sr, vec2(10.2, 28.1)) + 2.2);
  vec3 w = 1. - smoothstep(0.8, 1.5, N), e = clamp(1. - n2, 0., 1.);
  float sw = w.x + w.y + w.z + 0.05, ts = min(t, 1.);
  return vec4(smax(smax(f.x, f.y), f.z), dot(clamp(u, -1., 1.), w)/sw, 1. - (1. - e.x)*(1. - e.y)*(1. - e.z), ts*ts*(3. - 2.*ts)*dot(min(N, 1.), w)/sw);
}
// one round lobe laid into the cloud. d: the place from the lobe's centre, re: its radius, am: its strength.
// F gathers the cloud's outline as a distance (over 0 inside), the lobes joined to it by a smooth maximum a quarter of their radius wide;
// Q gathers the product of (1 - bump), each bump (1 - t*t)^3, level at its middle and at its rim: the lobes' smooth relief, with no nearest cell, no line and no corner; dQ its slope
void disc(vec2 d, float re, float am, inout float F, inout float Q, inout vec2 dQ){
  if (re < 1e-4) return;
  float r2 = re*re, t = 1. - min(dot(d, d)/r2, 1.), b = am*t*t*t*min(re/0.06, 1.);          // a lobe's relief is as deep as the lobe is large
  dQ = dQ*(1. - b) + Q*6.*am*min(re/0.06, 1.)*t*t*d/r2;
  Q *= 1. - b;
  float dist = re - length(d);
  dist *= dist < 0. ? max(1., 0.03/re) : 1.;                           // (a lobe that has all but gone casts no edge about itself)
  float ks = 0.25*re, hh = clamp(0.5 + 0.5*(dist - F)/ks, 0., 1.);
  F = mix(F, dist, hh) + ks*hh*(1. - hh);
}
// one large lobe (about 440 m: its radius 0.42 to 0.85 of the cell by its own hash r, breathing a tenth on its own 7 to 14 s) with the smaller ones that ride on it:
// three of about 190 m on its upper rim, turned toward the sun, and two of about 80 m on each of those. A large lobe exists only if its own centre lies inside the heads' bare form
// (its radius grows from nothing over the first 0.4 of its depth), and every smaller one overlaps the one it rides on: so NOTHING CAN FLOAT FREE of the tower.
// The smaller ones grow only above half the head and most on the shoulder toward the sun.
void lobe(vec3 r, vec2 g, vec2 q, vec2 pS, float cell, vec3 A, vec3 B, vec3 C, vec3 L, inout float F, inout float Q, inout vec2 dQ){
  vec2 d = ((q - (g + 0.5 + (r.xy - 0.5)*0.5))*LR1)*cell, c = pS - d;
  float rad = (0.42 + 0.43*r.z)*(0.9 + 0.1*sin(uTime*(0.45 + 0.45*r.x) + r.x*40.))*cell;
  if (dot(d, d) > 2.2*rad*rad) return;                                  // (the lobe and all that rides on it reach 1.46 of its radius at most)
  vec4 bc = body(c, A, B, C);
  float re = rad*smoothstep(0., 0.4*rad, bc.x);
  if (re < 1e-4) return;
  float am = 0.55 + 0.45*fract(r.z*7.3 + r.x*3.1);
  float crowd = smoothstep(0.5, 0.75, c.y/0.6)*(0.55 + 0.45*(0.5 + 0.5*bc.y*L.x/0.951));
  disc(d, re, am, F, Q, dQ);
  for (int j = 0; j < 3; j++) {
    vec3 r2 = fract(r.zxy*vec3(17.3, 23.7, 31.1) + float(j)*vec3(0.37, 0.71, 0.13));
    float th = 1.5708 - 0.6*L.x + (r2.x - 0.5)*3.5 + 0.3*sin(uTime*(0.4 + 0.4*r2.z) + r2.z*40.);
    float rc = re*(0.35 + 0.2*r2.y)*crowd;
    vec2 d2 = d - (re - 0.45*rc)*vec2(cos(th), sin(th));                // (its centre inside the lobe it rides on, whatever its size)
    disc(d2, rc, am*0.8, F, Q, dQ);
    for (int m = 0; m < 2; m++) {
      vec3 r3 = fract(r2.yzx*vec3(13.1, 29.3, 19.7) + float(m)*vec3(0.53, 0.29, 0.83));
      float th3 = th + (r3.x - 0.5)*3. + 0.3*sin(uTime*(0.5 + 0.5*r3.z) + r3.z*40.);
      float rg = rc*(0.3 + 0.2*r3.y);
      disc(d2 - (rc - 0.45*rg)*vec2(cos(th3), sin(th3)), rg, am*0.45, F, Q, dQ);
    }
  }
}
// the three large lobes of cell g: one hash, the second and third drawn from it by arithmetic
void lobes(vec2 g, vec2 q, vec2 pS, float cell, vec3 A, vec3 B, vec3 C, vec3 L, inout float F, inout float Q, inout vec2 dQ){
  vec3 r = h32(g);
  lobe(r, g, q, pS, cell, A, B, C, L, F, Q, dQ);
  lobe(fract(r.zxy*vec3(27.13, 15.71, 39.37) + vec3(0.41, 0.17, 0.83)), g, q, pS, cell, A, B, C, L, F, Q, dQ);
  lobe(fract(r.yzx*vec3(21.57, 33.19, 11.83) + vec3(0.73, 0.59, 0.29)), g, q, pS, cell, A, B, C, L, F, Q, dQ);
}
// one rank laid over what stands behind it. A, B, C: its three towers here (cells i0 - 1, i0, i0 + 1, each W wide); k 1 the near rank, 0 the middle one;
// line: live's line here (the bank between the heads stands on it); lineS: the line the heads and the lobes' frame stand on (each head on its own level); topE: live's line at azimuth 112.5 itself;
// bil: live's billow; shade: the body's own tone in shade at this place
void rank(vec3 A, vec3 B, vec3 C, float W, float i0, float k, vec2 P, float line, float lineS, float topE, float bil, float shade, float sideK, vec3 L, float endK, inout vec3 col, inout float a, inout float flk){
  vec3 wr = 1. - min(abs(vec3(P.x) - vec3(A.x, B.x, C.x))/(0.8*W), 1.);
  wr *= wr;
  float sw = wr.x + wr.y + wr.z;
  float wE = k*dot(wr, step(abs(vec3(i0 - 1., i0, i0 + 1.) - 4.), vec3(0.5)))/sw;      // the tallest tower's share of this place
  float rb = sideK*dot(wr, vec3(A.z, B.z, C.z))/sw + wE*0.065*(0.96076 - sideK);      // the towers' rises, blended where two towers meet
  float ref = line + wE*(topE - line), refS = lineS + wE*(topE - lineS);      // in the tallest tower's share both lines are live's line at that tower's OWN azimuth
  float head = max(refS + rb, 0.05);                                    // the heads' own level here: the frame's 0.6
  float cell = 0.0661*mix(0.8, 1., k);
  vec2 pS = vec2(P.x, P.y*0.6/head);
  vec4 bd = body(pS, A, B, C);
  // the bank between the heads: its top at 0.65 of live's line at the place, raised (never lowered) by live's own billow; it carries no lobes of its own
  float F = smax(0.39*(ref + rb)/head + 0.1*max(bil - 0.3, 0.) - pS.y, bd.x), Q = 1.;
  vec2 dQ = vec2(0.);
  vec2 q = LR1*(vec2(pS.x, pS.y - uTime*0.003)/cell) + vec2(k*19.3 + 3.7, k*7.1 + 1.3), g = floor(q);      // the lobes rise slowly through the heads
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) lobes(g + vec2(float(i), float(j)), q, pS, cell, A, B, C, L, F, Q, dQ);
  F = min(F, (max(ref, refS) + 0.135 - P.y)*0.6/head);                   // no lobe stands more than 0.135 of h over the line it stands on
  float ta = smoothstep(0., 0.0077 + 0.0096*bil, F)*endK;                 // the outline dissolves over 40 to 90 m
  // the big form first: one light over the whole tower, from its sunward side to its far side and from head to base
  float rel = clamp(P.y/max(ref + rb, 0.05), 0., 1.2);                    // the height as a share of the rank's line AT THE PLACE (it runs smoothly along the arc: no tone steps from one head's level to the next)
  float nx = bd.y*0.75*smoothstep(0.3, 0.45, pS.y), ny = 0.55*bd.w;        // (under the saddles' floor the rank is one bank: no head has a side of its own there)
  float big = smoothstep(-0.3, 0.8, nx*L.x + ny*L.y + sqrt(max(0., 1. - nx*nx - ny*ny))*L.z);
  float low = smoothstep(0.38, 0.74, rel), hd = smoothstep(0.45, 1., rel);
  // the lobes only modulate it: v runs from 0 (a lobe's side turned full from the sun) to 1 (turned full to it) and moves a third of the tower's light at most; a hollow gets no darkening of its own
  vec2 G = -0.2*dQ;
  float v = 0.5 + 0.5*(L.z - dot(G, L.xy))/sqrt(1. + dot(G, G));
  float amt = shade + (1. - shade)*low*big*(1. - (1. - v)/3.);
  vec3 tc = mix(uShade, uLit, amt) + uRim*amt*hd*mix(0.21, 0.33, k);      // the wall is indigo: the forms are carried between uShade and uLit; the heads' pale share is a fifth of what it was
  tc = mix(tc, mix(uBase, uLit, 0.3), 0.3*(1. - k));                     // the middle rank stands in haze, a step lighter than the near one
  tc += uRim*0.5*(1. - smoothstep(0., 0.025, F))*(1. - a);                // a pale rim where the edge meets open sky
  float fk = (0.45 + 0.85*bd.z)*(0.8 + 0.2*Q);                           // a flicker glows from the head's heart; the lobes only dim it a little where they are thick
  float an = ta + a*(1. - ta), wgt = ta/max(an, 1e-4);
  col = mix(col, tc, wgt); flk = mix(flk, fk, wgt); a = an;
}
void main(){
  float x = vUv.x*13., h = vUv.y;
  float side = sin(vUv.x*3.14159);                                  // 1 due east, 0 at the ends of the arc
  float sideK = 0.25 + 0.75*side, endK = smoothstep(0., 0.16, side);
  vec2 P = vec2(vUv.x*3.8, h);
  // the near rank's three towers here (13 cells, one centred on azimuth 112.5) and the place Xs their heads stand on: all but level across a head, sliding from one centre to the next in the gap
  float iN = floor((P.x - 0.19162)/0.29231), Xs = P.x;
  vec3 An = vec3(0.), Bn = vec3(0.), Cn = vec3(0.);
  if (h >= 0.1019) {
    // (under the foot no tower is asked for: the rain needs live's line alone, and pays live's own 20 hashes for it)
    An = towerOf(iN - 1., 0.29231, 0.19162, 1.); Bn = towerOf(iN, 0.29231, 0.19162, 1.); Cn = towerOf(iN + 1., 0.29231, 0.19162, 1.);
    vec3 ws = 1. - min(abs(vec3(P.x) - vec3(An.x, Bn.x, Cn.x))/0.23385, 1.);
    ws *= ws; ws *= ws;
    Xs = dot(ws, vec3(An.x, Bn.x, Cn.x))/max(ws.x + ws.y + ws.z, 1e-6);
  }
  // live's top line, kept: the same sum as fbm4's, its two widest octaves read at the place and (sharing the hashes) at Xs
  vec2 pt = vec2(x*0.62 + 3.1, uTime*0.0035);
  float xq = Xs*2.12105 + 3.1;                                       // (13/3.8*0.62 = 2.12105: Xs in the line's own noise measure)
  vec2 o1 = vnx(pt, xq), o2 = vnx(pt*2.03 + 11.7, xq*2.03 + 11.7);
  float o3 = vn(pt*4.1 + 5.3)*0.125, o4 = vn(pt*8.3 + 2.1)*0.0625, wv = 0.1*vn(vec2(x*2.3, uTime*0.008));
  float top = (0.34 + 0.5*(o1.x*0.5 + o2.x*0.25 + o3 + o4) + wv) * sideK;
  float topS = (0.34 + 0.5*(o1.y*0.5 + o2.y*0.25 + o3 + o4) + wv) * (0.25 + 0.75*sin(Xs*0.826734));      // the near rank's line: every head on its own level
  float dxa = 1.507 - P.x, topE = top;                              // 1.507: azimuth 112.5, the tallest tower's own place
  if (h >= 0.1019 && dxa > -0.24 && dxa < 0.52) topE = (0.34 + 0.5*fbm4(vec2(6.2965, uTime*0.0035)) + 0.1*vn(vec2(11.858, uTime*0.008))) * 0.96076;       // live's line at azimuth 112.5 itself, where that tower or its anvil can reach
  if (h > max(top, max(topS, topE)) + 0.15) discard;
  float az = radians(198.85 - vUv.x*217.724);
  vec3 col; float a, flk;
  if (h >= 0.1019) {
    vec2 bb = fbm4p(vec2(x*2.6, h*9. - uTime*0.012), vec2(x*2.6 - 0.07, h*9. - uTime*0.012 + 0.03));
    float bil = bb.x, bil2 = bb.y;                                     // live's billow, and the same billows a step toward the sun, as live's
    float edge = top - h + (bil - 0.5)*0.2;
    a = smoothstep(0., 0.035, edge) * endK;                      // live's alpha: the far rank, never less
    float dl = radians(285.) - az;
    vec3 L = vec3(-sin(dl)*0.951, 0.309, -cos(dl)*0.951);              // toward the sun, in the wall's own frame (along X, up, toward the eye)
    float rel = clamp(h/max(top, 0.05), 0., 1.);
    float relief = clamp((bil - bil2)*4. + 0.5, 0., 1.);               // live's own soft relief
    // the far rank is live's band in live's own tones, in haze: what stands behind is lighter and flatter, never darker than the near rank's shade
    col = mix(uShade, uLit, (relief*0.45 + smoothstep(0.25, 1., rel)*0.55)*(0.55 + 0.45*bil));
    col = mix(col, mix(uBase, uLit, 0.3), 0.6);
    col += uRim * (1. - smoothstep(0., 0.05, edge)) * 0.5;             // its pale rim against the open sky, as live's
    flk = 0.5 + 0.9*bil;
    // the towers' bodies in shade keep live's billow, darker toward the foot: never one flat colour
    float shade = 0.45*relief*(0.55 + 0.45*bil)*mix(0.35, 1., smoothstep(0.1019, 0.4, h));
    float iM = floor((P.x + 0.17273)/0.34545);
    rank(towerOf(iM - 1., 0.34545, -0.17273, 0.), towerOf(iM, 0.34545, -0.17273, 0.), towerOf(iM + 1., 0.34545, -0.17273, 0.), 0.34545, iM, 0., P, top, top, topE, bil, shade, sideK, L, endK, col, a, flk);   // the middle rank: 11 cells, half a cell out of step, on live's line
    rank(An, Bn, Cn, 0.29231, iN, 1., P, top, topS, topE, bil, shade, sideK, L, endK, col, a, flk);    // the near rank, on its own line
    // the anvil of the tallest tower: flat at that tower's own head along its whole length, streaming toward the south (X falls southward), its underside soft and fibrous
    if (dxa > -0.08 && dxa < 0.52) {
      float flatT = topE + 0.06;
      float al = (dxa + 0.08)/0.6;
      float thick = mix(0.10, 0.02, smoothstep(0.13, 1., al));
      float fb = 0.6*vn(vec2((P.x + uTime*0.004)*22., h*70.)) + 0.4*vn(vec2((P.x + uTime*0.004)*55., h*160. + 3.));
      float und = flatT - thick*(0.55 + 0.9*fb);
      float aA = smoothstep(0., 0.012, flatT - h)*smoothstep(0., thick*0.8 + 0.004, h - und)*smoothstep(0., 0.13, al)*(1. - smoothstep(0.8, 1., al))*endK;
      float vA = clamp((h - und)/max(flatT - und, 0.01), 0., 1.);
      vec3 cA = mix(mix(uShade, uBase, 0.3), uLit, smoothstep(0.2, 0.9, vA)*(0.7 + 0.3*fb)) + uRim*0.33*smoothstep(0.6, 1., vA);
      float an = a + aA*(1. - a), wgt = aA*(1. - a)/max(an, 1e-4);         // it stands BEHIND every head and bank: it shows only where the sky was open, and lays no slab over any head
      col = mix(col, cA, wgt); flk = mix(flk, 0.7, wgt); a = an;
    }
    // the foot stands at the shelf's own height: the cloud darkens into it
    col = mix(uBase, col, smoothstep(0.1019, 0.1619, h));
    col = mix(col, uShade*0.9, (1. - smoothstep(0.1019, 0.1369, h))*0.85);
  } else {
    // under the foot the rain: veils leaning west, the far horizon's paler light in the gaps; nothing under the ground line
    float fall = (0.1019 - h)/0.0731;
    float Xv = P.x + 0.0365*cos(az)*fall + uTime*0.0004;
    float dens = max(smoothstep(0.36, 0.62, vn(vec2(Xv*4.2105, uTime*0.05))), 0.8*smoothstep(0.45, 0.75, vn(vec2(Xv*10., 9.1 - uTime*0.05))));     // broad veils (16 cells) and narrow ones between them (38 cells)
    dens *= (0.8 + 0.2*vn(vec2(Xv*31., 3.7 + uTime*0.08)))*(0.35 + 0.65*smoothstep(0.3, 0.75, top));
    float veil = dens*(1. - 0.35*clamp(fall, 0., 1.))*smoothstep(0.0288, 0.0348, h);
    vec3 gap = mix(uBase, uLit, 0.3*smoothstep(0.0248, 0.0328, h));
    col = mix(mix(gap, mix(uShade, uBase, 0.2), veil*0.92), uShade*0.9, smoothstep(0.0959, 0.1019, h)*0.85);
    a = endK; flk = 0.6;
  }
  if (a < 0.004) discard;
  for (int i = 0; i < 2; i++) {
    vec2 fp = i == 0 ? vec2(0.42, 0.3) : vec2(0.61, 0.24);
    float f = i == 0 ? uFlash.x : uFlash.y;
    vec2 d = (vUv - fp)*vec2(5.5, 2.4);
    col += vec3(0.55, 0.62, 1.15) * f * exp(-dot(d, d)*7.) * flk;
  }
  gl_FragColor = vec4(col, a);
}`,So=`
attribute vec3 aInfo;
varying vec2 vUv; varying vec3 vInfo; varying vec3 vW;
void main(){ vUv = uv; vInfo = aInfo; vec4 w = modelMatrix*vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,Mo=`
uniform float uTime, uEdge;
uniform vec3 uCol;
varying vec2 vUv; varying vec3 vInfo; varying vec3 vW;
${l0}
void main(){
  float s = vUv.x*vInfo.x;
  float st = vn(vec2(s*9., vUv.y*1.3 - uTime*0.05 + vInfo.y))*0.6 + vn(vec2(s*31., vUv.y*2.1 - uTime*0.11))*0.4;
  float a = smoothstep(0.25, 0.8, st) * smoothstep(0., 0.2, vUv.x) * smoothstep(1., 0.8, vUv.x);
  a *= smoothstep(0.0, 0.5, vUv.y) * smoothstep(1., 0.9, vUv.y);
  a *= smoothstep(uEdge + 60., uEdge + 520., vW.x + (1. - vUv.y)*140.);
  gl_FragColor = vec4(uCol * a * 0.36, a * 0.36);
}`,Ao=`
attribute vec3 aPin; attribute vec3 aSide;
uniform float uTime, uGust, uU;
uniform vec2 uWind;
varying vec3 vC; varying vec3 vW;
#include <fog_pars_vertex>
void main(){
  vec3 p = position; vC = color;
  float w = aPin.x, ph = aPin.y, g = uGust;
  vec3 wd = vec3(uWind.x, 0., uWind.y);
  if (aPin.z > 0.5 && aPin.z < 1.5) {
    float dist = length(cameraPosition - p);
    p += aSide * max(1., dist*0.07);
    p.y += sin(uTime*3.1 + ph)*0.03*w;
  } else {
    float flap = sin(uTime*(4.5 + g*3.) + ph + p.y*2.3 + dot(p.xz, uWind)*1.9);
    float flap2 = sin(uTime*(7.3 + g*4.) + ph*1.7 + p.y*4.1 + p.x*1.3);
    p += wd * w * (0.2 + 0.75*g) * (0.62 + 0.38*flap);
    p.y += w * (0.1 + 0.42*g) * (0.5 + 0.5*flap2) * 0.7;
    p += vec3(-uWind.y, 0., uWind.x) * w * 0.14 * flap2;
    if (aPin.z > 1.5) {
      float t = clamp((uU - 0.085)/0.14, 0., 1.);
      float e = t*t*(3. - 2.*t);
      p += wd*(e*120.) + vec3(0., sin(t*3.1416)*13. + e*7. + sin(uTime*2.3)*1.2*e, sin(uTime*1.7)*5.*e);
      p.y += (w - 0.5)*sin(uTime*5. + t*20.)*1.4*e;
      p = mix(p, p + wd*4., step(0.985, t));
    }
  }
  vW = p;
  vec4 mvPosition = modelViewMatrix*vec4(p, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Fo=`
uniform vec3 uSunDir, uSunCol, uAmb;
varying vec3 vC; varying vec3 vW;
#include <fog_pars_fragment>
void main(){
  vec3 cr = cross(dFdx(vW), dFdy(vW));
  vec3 N = cr / max(length(cr), 1e-9);
  float nl = abs(dot(N, uSunDir));
  vec3 col = vC * (uAmb*(0.75 + 0.25*abs(N.y)) + uSunCol*(0.3 + 0.7*nl));
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,zo=`
attribute vec3 aPos; attribute vec3 aS;
uniform float uTime, uFront;
uniform vec2 uWrap;
varying vec2 vUv; varying vec3 vS; varying float vFade;
#include <fog_pars_vertex>
void main(){
  vUv = uv; vS = aS;
  float span = max(uWrap.y, 1.), wrapOn = step(0.5, uWrap.y);
  float trav = mod(uTime*uWrap.x*(0.7 + 0.6*aS.z) + aS.y*span*7., span) * wrapOn;
  vec3 c = aPos + vec3(uFront - trav + sin(uTime*0.7 + aS.y*20.)*2.5, sin(uTime*0.9 + aS.y*33.)*0.6, 0.);
  float ends = mix(1., smoothstep(0., 0.15, trav/span) * (1. - smoothstep(0.8, 1., trav/span)), wrapOn);
  vec4 mvPosition = viewMatrix*vec4(c, 1.);
  float dist = -mvPosition.z;
  vFade = smoothstep(5., 24., dist) * ends;
  float rot = aS.y*6.283 + uTime*0.25*(aS.z - 0.5);
  vec2 o = (uv - 0.5)*aS.x; o = vec2(o.x*cos(rot) - o.y*sin(rot), o.x*sin(rot) + o.y*cos(rot));
  mvPosition.xy += o*vec2(1.25, 0.8);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Co=`
uniform float uTime, uOpacity;
uniform vec3 uCol, uColLit;
varying vec2 vUv; varying vec3 vS; varying float vFade;
#include <fog_pars_fragment>
${l0}
void main(){
  vec2 q = vUv - 0.5; float r = length(q)*2.;
  float n = vn(vUv*3.2 + vS.y*17. + uTime*0.12)*0.6 + vn(vUv*7.5 - vS.y*9. - uTime*0.2)*0.4;
  float a = smoothstep(1., 0.25, r + (n - 0.5)*0.75) * uOpacity * vFade * (0.5 + 0.5*vS.z);
  vec3 col = mix(uCol, uColLit, smoothstep(0.35, 0.8, n + q.y*0.6));
  gl_FragColor = vec4(col, a);
  #include <fog_fragment>
  gl_FragColor.rgb *= gl_FragColor.a;
}`,Po=`
attribute vec2 aSeed;
varying vec2 vUv; varying vec3 vW; varying vec2 vSeed;
#include <fog_pars_vertex>
void main(){
  vUv = uv; vSeed = aSeed; vW = position;
  vec4 mvPosition = modelViewMatrix*vec4(position, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,To=`
uniform float uTime, uRain;
uniform vec3 uSunDir, uGold, uShade, uCam;
varying vec2 vUv; varying vec3 vW; varying vec2 vSeed;
#include <fog_pars_fragment>
${l0}
float sunVis(vec3 p){
  vec3 L = uSunDir;
  float tx = L.x < 0. ? (-65. - p.x)/min(L.x, -1e-3) : (65. - p.x)/max(L.x, 1e-3);
  float tz = L.z < 0. ? (-65. - p.z)/min(L.z, -1e-3) : (38. - p.z)/max(L.z, 1e-3);
  float t = max(min(tx, tz), 0.);
  float ye = p.y + t*L.y;
  return smoothstep(-1.5, 1.5, ye);
}
void main(){
  float s = vUv.x*vSeed.x;
  float y = vUv.y*9. + uTime*2.4;
  float a = smoothstep(0.6, 0.95, vn(vec2(s*5.5, y*0.35 + vSeed.y*31.)));
  float fine = vn(vec2(s*90., y*2.2 + vSeed.y*7.)); fine *= fine;
  float f2 = vn(vec2(s*260., y*5.)); f2 = smoothstep(0.7, 1., f2);
  float alpha = (a*0.4 + 0.3) * (fine*0.55 + f2*0.6);
  alpha *= smoothstep(0., 0.12, vUv.x) * smoothstep(1., 0.88, vUv.x) * smoothstep(0., 0.1, vUv.y) * smoothstep(1., 0.75, vUv.y);
  float dist = length(uCam - vW);
  alpha *= smoothstep(9., 34., dist) * uRain;
  float vis = vW.y > 0. ? 1. : sunVis(vW);
  vec3 col = mix(uShade, uGold, vis) * alpha * 0.22;
  float fogF = 1. - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
  gl_FragColor = vec4(col*(1. - fogF*0.7), 0.);
}`,Eo=`
attribute vec3 aBase; attribute vec3 aSeed;
uniform float uTime, uPoolY, uShow;
varying vec3 vN; varying vec3 vC;
#include <fog_pars_vertex>
void main(){
  float t = uTime*(0.5 + aSeed.x*0.5) + aSeed.y*17.;
  float cyc = floor(t), ph = fract(t);
  float hop = clamp((ph - 0.62)/0.38, 0., 1.);
  float dir = aSeed.z*6.283;
  float sgn = mod(cyc, 2.) < 0.5 ? 1. : -1.;
  float along = (sgn > 0. ? hop : 1. - hop) * 0.7 - 0.35;
  float yaw = dir + (sgn > 0. ? 0. : 3.1416);
  float cy = cos(yaw), sy = sin(yaw);
  vec3 lp = position * uShow * (0.75 + 0.5*aSeed.x);
  lp.y *= 1. + 0.5*sin(hop*3.1416);
  vec3 p = vec3(lp.x*cy + lp.z*sy, lp.y, -lp.x*sy + lp.z*cy);
  float afloat = step(aBase.y, uPoolY);
  vec3 base = aBase; base.y = max(aBase.y, uPoolY - 0.04);
  p += base + vec3(cos(dir), 0., -sin(dir))*along*(1. - 0.6*afloat) + vec3(0., sin(hop*3.1416)*0.42*(1. - 0.8*afloat), 0.);
  vN = normalize(vec3(normal.x*cy + normal.z*sy, normal.y, -normal.x*sy + normal.z*cy) + vec3(0., 1e-4, 0.));
  vC = mix(vec3(0.62, 0.66, 0.36), vec3(0.78, 0.74, 0.5), aSeed.y);
  vec4 mvPosition = modelViewMatrix*vec4(p, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Bo=`
uniform vec3 uAmb, uSunCol, uSunDir;
varying vec3 vN; varying vec3 vC;
#include <fog_pars_fragment>
void main(){
  vec3 col = vC * (uAmb*(0.7 + 0.5*vN.y) + uSunCol*max(dot(vN, uSunDir), 0.)*0.5);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,Lo=`
varying vec3 vC; varying vec3 vW;
#include <fog_pars_vertex>
void main(){
  vC = color; vec4 w = modelMatrix*vec4(position, 1.); vW = w.xyz;
  vec4 mvPosition = viewMatrix*w;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Uo=`
uniform vec3 uSunDir, uSunCol, uAmb;
varying vec3 vC; varying vec3 vW;
#include <fog_pars_fragment>
void main(){
  vec3 cr = cross(dFdx(vW), dFdy(vW));
  vec3 N = cr / max(length(cr), 1e-9);
  float nl = abs(dot(N, uSunDir));
  vec3 col = vC * (uAmb*(1.0 + 0.3*abs(N.y)) + uSunCol*(0.22 + 0.5*nl));
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,Io=`
attribute float aPh;
varying vec2 vUv; varying float vPh;
#include <fog_pars_vertex>
void main(){
  vUv = uv; vPh = aPh;
  vec4 mvPosition = modelViewMatrix*vec4(position, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,_o=`
uniform float uTime;
uniform vec3 uCol;
varying vec2 vUv; varying float vPh;
#include <fog_pars_fragment>
void main(){
  float r = length(vUv - 0.5)*2.;
  float a = 1. - smoothstep(0., 1., r); a = a*a*(0.6 + 0.4*a);
  float fl = 0.86 + 0.14*sin(uTime*9. + vPh)*sin(uTime*13.7 + vPh*1.7);
  float fogF = 1. - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
  gl_FragColor = vec4(uCol*a*fl*(1. - fogF), 1.);
}`,c0=[[-560,44],[-330,34],[-200,27],[-128,26],[-94,19],[-74,8]];function He(o,f){let c=1e9;for(let x=0;x<c0.length-1;x++){const p=c0[x][0],z=c0[x][1],P=c0[x+1][0]-p,k=c0[x+1][1]-z,M=Re(((o-p)*P+(f-z)*k)/(P*P+k*k),0,1),b=o-p-P*M,I=f-z-k*M;c=Math.min(c,Math.hypot(b,I))}return c}const k0=(o,f,c)=>o>-73+c||f<7-c||f>45+c,We=o=>o<-128?26:o<-94?$(26,19,(o+128)/34):$(19,8,Re((o+94)/20,0,1)),Q0=(o,f,c=0)=>{const x=(o+170)/102;return o>-152&&f>26-44*x-c&&f<26+15*x+c},Xe=(o,f)=>Math.max(Math.abs(o),Math.abs(f+2)-2),e0=(o,f)=>Math.abs(o)<66.6&&f>-66.6&&f<39.5,K0=(o,f)=>H(-137,-129,o)*(1-H(-80,-70,o))*H(-36,-26,f)*(1-H(68,80,f)),It=.21,_t=Math.cos(It),Wt=Math.sin(It);function Dt(o,f,c){const x=o*_t+f*Wt,p=-o*Wt+f*_t,z=Math.floor(p/17),P=p/17-z,k=x/96+Le(z*3.1)*5,M=k-Math.floor(k),b=Math.min(P,1-P)*17<.9||Math.min(M,1-M)*96<.9,I=z*7.3+Math.floor(k)*1.7,S=Le(I+.5)<.06;return c[0]=b?0:S?.12:1,c[1]=Le(I),c[2]=b?1:0,c}function Wo(){const o=[],f=[],c=[],x=[],p=[],z=(M,b,I,S,T,y)=>(o.push(M[0],M[1],M[2]),f.push(b.r,b.g,b.b),c.push(I,S,T),x.push(y[0],y[1],y[2]),o.length/3-1),P=[0,0,0],k={sheet(M,b,I,S,T,y=0,h=3,n=4,l=0){const u=_(S),F=o.length/3;for(let L=0;L<=n;L++)for(let W=0;W<=h;W++){const G=W/h,D=L/n,ie=.5+(G-.5)*(1-l*D),V=.86+.14*Math.sin(G*9+T)*(1-D*.3);z([$(M[0],b[0],ie),$(M[1],b[1],ie)-I*D,$(M[2],b[2],ie)],{r:u.r*V,g:u.g*V,b:u.b*V},Math.pow(D,1.25),T+G*.9,y,P)}for(let L=0;L<n;L++)for(let W=0;W<h;W++){const G=F+L*(h+1)+W;p.push(G,G+1,G+h+2,G,G+h+2,G+h+1)}},rope(M,b,I,S,T,y=8){const h=_(S),n=b[0]-M[0],l=b[2]-M[2],u=Math.hypot(n,l)||1,F=.022;for(const L of[[0,F,0],[-l/u*F,0,n/u*F]]){const W=o.length/3;for(let G=0;G<=y;G++){const D=G/y,ie=[$(M[0],b[0],D),$(M[1],b[1],D)-I*4*D*(1-D),$(M[2],b[2],D)],V=4*D*(1-D);z(ie,h,V,T,1,L),z(ie,h,V,T,1,[-L[0],-L[1],-L[2]])}for(let G=0;G<y;G++){const D=W+G*2;p.push(D,D+1,D+3,D,D+3,D+2)}}},washing(M,b,I,S,T,y=!1){const h=Math.hypot(I[0]-b[0],I[2]-b[2]),n=.12+h*.012;k.rope(b,I,n,"#2a2622",M()*6);let l=.08;for(let u=0;u<S&&l<.9;u++){const F=M.range(.7,1.7)/h,L=M.range(.7,1.5),W=Math.min(.94,l+F),G=D=>[$(b[0],I[0],D),$(b[1],I[1],D)-n*4*D*(1-D)-.02,$(b[2],I[2],D)];k.sheet(G(l),G(W),L,M.pick(T),M()*6,y&&u===1?2:0,3,4),l=W+M.range(.02,.08)}},geometry(){const M=new r.BufferGeometry;return M.setAttribute("position",new r.Float32BufferAttribute(o,3)),M.setAttribute("color",new r.Float32BufferAttribute(f,3)),M.setAttribute("aPin",new r.Float32BufferAttribute(c,3)),M.setAttribute("aSide",new r.Float32BufferAttribute(x,3)),M.setIndex(p),M}};return k}const Rt=["#f2ede0","#e8e2d4","#c8281e","#e87a1c","#2c4a9a","#d8508a","#2f8a5a","#e8c020","#f4f0e8","#7a2c8a"];function Do(o,f,c,x){const{w:p,d:z,top:P}=c,k=z/2,M=-p/2+p*.3;o.tr(c.x,0,c.z,c.rot),o.col(x.lime,.85,1).surf(q.SURF.PLAIN),o.box(M-.78,0,k-.02,M-.56,2.3,k+.1),o.box(M+.56,0,k-.02,M+.78,2.3,k+.1),o.box(M-.86,2.2,k-.02,M+.86,2.5,k+.13),o.box(-p/2+.2,0,k+.01,p/2-.2,.42,k+.07),o.col([c.wall[0]*.44,c.wall[1]*.4,c.wall[2]*.4],.7,1.15),o.box(-p/2-.04,0,-z/2-.04,p/2+.04,.5,-z/2+.02),o.box(-p/2-.04,0,-z/2,-p/2+.02,.5,k),o.box(p/2-.02,0,-z/2,p/2+.04,.5,k);{const y=f.fork("stain"+Math.round(c.x*7+c.z*13)),h=3.91,n=L=>1-.05*(L+.01)/h,l=L=>.8+.2*(L+.01)/h,u=(L,W,G)=>{const D=n(G),ie=.035;return L===0?[W*D,G,z/2*D+ie]:L===1?[p/2*D+ie,G,-W*D]:L===2?[-W*D,G,-z/2*D-ie]:[-p/2*D-ie,G,W*D]},F=(L,W,G,D,ie,V,Ee)=>o.quad(u(L,W,D),u(L,G,D),u(L,G,ie),u(L,W,ie),void 0,[c.wall[0]*V,c.wall[1]*V*.96,c.wall[2]*V*.95],[c.wall[0]*Ee,c.wall[1]*Ee*.98,c.wall[2]*Ee*.97]);o.surf(q.SURF.PLAIN);for(let L=0;L<4;L++){const W=(L%2?z:p)/2-.06,G=L<2;for(const[D,ie]of L===0?[[-W,M-.85],[M+.85,W]]:[[-W,W]]){let V=D;for(;V<ie-.4;){const Ee=Math.min(ie,V+y.range(1.5,3.2)),ee=G?y.range(.85,1.25):y.range(1,2);F(L,V,Ee,.4,ee,.5,l(ee)),V=Ee}}if(!G){const D=Math.max(2,Math.round(W/1.4));for(let ie=0;ie<D;ie++){const V=$(-W+.5,W-.5,(ie+y.range(.2,.8))/D),Ee=y.range(.2,.5),ee=y.range(1.5,2.6);F(L,V-Ee,V+Ee,ee,3.32,l(ee),.6)}}}}o.col(x.lime,.8,1);{o.box(-p/2*.975-.02,2.72,k*.975-.02,p/2*.975+.02,2.72+.16,k*.975+.05),o.box(-p/2*.975-.05,2.72,-k*.975,-p/2*.975+.02,2.72+.16,k*.975),o.box(p/2*.975-.02,2.72,-k*.975,p/2*.975+.05,2.72+.16,k*.975);for(let n=-p/2+.6;n<p/2-.4;n+=.62)o.box(n-.09,2.72-.3,k*.975-.02,n+.09,2.72-.12,k*.975+.045)}{const y=Math.max(1,Math.round(p/4)),h=f.pick(x.shutters);o.col(h,.8,1.05);for(let n=0;n<y;n++){const l=$(-p/2,p/2,(n+.5)/y)+(y===1?p*.25:0);o.box(l-.82,1.24,k-.03,l-.46,2.26,k+.06),o.box(l+.46,1.24,k-.03,l+.82,2.26,k+.06)}}if(f.chance(.55)){const y=p/2-2.3-f.range(0,1),h=1.9,n=k+2.9;o.col(x.wood,.85,1);for(const l of[-h,h])o.beam([y+l,0,n],[y+l,2.2,n],.1,.1);o.beam([y-h-.2,2.2,n],[y+h+.2,2.2,n],.09,.09);for(let l=0;l<7;l++){const u=y-h-.25+l*((h*2+.5)/7),F=u+(h*2+.5)/7-.03;o.col(l%2?x.straw:x.straw2,.85,1.05),o.quad([u,2.78,k+.05],[u,2.2+.06,n+.35],[F,2.2+.06,n+.35],[F,2.78,k+.05]),o.quad([u,2.76,k+.05],[F,2.76,k+.05],[F,2.2+.04,n+.35],[u,2.2+.04,n+.35])}o.col(x.sack,.8,1.05),o.box(y-1.2,.32,k+1.7,y-.2,.85,k+2.5),o.col(x.steel,.8,1.1),o.cyl(y+.9,.32,k+2.1,.3,.34,.55,9)}o.col(x.mud,.8,1).surf(q.SURF.PLAIN),o.box(-p/2,0,k,p/2,.32,k+1.5);const b=f.int(2,5);for(let y=0;y<b;y++){const h=M+1.5+y*.62+f.range(-.1,.1),n=k+.55+f.range(-.2,.3),l=f.range(.75,1.2);o.col(f.chance(.7)?x.terra:x.terraDark,.7,1.1),o.lathe(h,.32,n,[[.12*l,0],[.3*l,.22*l],[.3*l,.4*l],[.14*l,.56*l],[.18*l,.64*l],[0,.64*l]],8,{smooth:!0}),f.chance(.3)&&o.lathe(h,.32+.64*l,n,[[.1*l,0],[.22*l,.16*l],[.2*l,.3*l],[.1*l,.4*l],[0,.4*l]],8,{smooth:!0})}const I=(y,h,n,l)=>{o.tr(y,h,n,l),o.col(x.wood,.9,1);for(const u of[-.9,.9])for(const F of[-.42,.42])o.beam([u,0,F],[u,.5,F],.07,.07);o.beam([-.9,.44,-.42],[.9,.44,-.42],.06,.06),o.beam([-.9,.44,.42],[.9,.44,.42],.06,.06),o.col(x.rope,.9,1),o.box(-.9,.43,-.42,.9,.47,.42),f.chance(.5)&&(o.col(f.pick(x.quilts),.9,1),o.box(-.8,.47,-.36,f.range(-.1,.5),.55,.36)),o.pop()};f.chance(.75)&&I(-p/2+1.5+f.range(0,1),.32,k+.8,f.range(-.15,.15)),o.col(c.wall,.85,1).surf(q.SURF.PLAIN);const S=p*.475*(c.lv===1?1:0),T=z*.475;if(c.lv===1){o.box(-S,P,T-.22,S,P+.42,T),o.box(-S,P,-T,S,P+.42,-T+.22),o.box(-S,P,-T,-S+.22,P+.42,T),o.box(S-.22,P,-T,S,P+.42,T);for(let h=0;h<4;h++){const n=f.range(-S+1.2,S-1.2),l=f.range(-T+1,T-1),u=f.range(.78,1.16);o.col([c.wall[0]*u*.8,c.wall[1]*u*.78,c.wall[2]*u*.76],.95,1.05),o.box(n-f.range(.6,1.6),P,l-f.range(.5,1.2),n+f.range(.6,1.6),P+.025,l+f.range(.5,1.2),{sides:!1})}if(f.chance(.65)){const h=f.range(-S+1.6,S-2.4),n=f.range(-T+1.2,T-1.6),l=f.int(3,6),u=f.int(2,4);o.col(x.dung,.9,1.1);for(let F=0;F<l;F++)for(let L=0;L<u;L++)o.disc(h+F*.46,P+.05,n+L*.46,.18,6,!0)}f.chance(.4)&&(o.col(x.steel,.75,1.1),o.cyl(f.range(-S+1,S-1),P,-T+.8,.42,.42,.95,9));const y=f.int(2,4);for(let h=0;h<y;h++){const n=f.range(-S+1.3,S-1.3),l=f.range(-T+1.1,T-1.1),u=f();if(u<.34)o.col(f.pick(x.dry),.95,1.05),o.box(n-f.range(.7,1.4),P,l-f.range(.5,.9),n+.9,P+.05,l+.7);else if(u<.6){o.col(x.sack,.75,1.05);for(let F=0;F<3;F++)o.box(n+F*.5-.6,P,l-.3,n+F*.5-.15,P+f.range(.5,.8),l+.3)}else if(u<.8)I(n,P,l,f()*3);else{o.col(x.terra,.7,1.1);for(let F=0;F<3;F++)o.lathe(n+F*.6-.6,P,l,[[.12,0],[.27,.2],[.27,.36],[.13,.5],[0,.5]],7,{smooth:!0})}}}{const y=[c.wall[0]*.9,c.wall[1]*.88,c.wall[2]*.86];o.col(y,.8,1.02).surf(q.SURF.PLAIN);for(const n of[-1,1])o.frustum(n*(p/2-.1),k-.1,1.5,1.5,.7,.7,0,2.5+f.range(0,.5),{}),f.chance(.5)&&o.frustum(n*(p/2-.1),-k+.1,1.4,1.4,.7,.7,0,2.2,{});o.col(c.wall,.9,1.06);const h=c.lv===1?P+.42:3.9;for(const n of[-1,1])for(const l of[-1,1])o.frustum(n*(p*.475-.16),l*(z*.475-.16),.66,.66,.3,.3,h-.12,h+.3+f.range(0,.08)*2,{});if(c.lv===1&&f.chance(.6)){o.col(y,.78,1.04);const n=10,l=P/n,u=Math.min(.5,(z-1.2)/n),F=k-.4;for(let L=0;L<n;L++)o.box(-p/2-1,0,F-(L+1)*u,-p/2+.02,(L+1)*l,F-L*u,{});o.box(-p/2-1,0,-z/2+.1,-p/2+.02,P,F-n*u,{})}}if(f.chance(.6)){const y=p/2+1.3,h=f.range(-z/2+1,z/2-1);o.col(x.dung,.7,1.05),o.lathe(y,0,h,[[.95,0],[.9,.5],[.7,.95],[.38,1.3],[0,1.42]],9,{smooth:!0})}if(c.yard){o.col(c.wall,.75,.98).surf(q.SURF.PLAIN);const y=f.range(4,6.5),h=-p/2-.2,n=p/2+f.range(1.5,3.5),l=-z/2-y,u=-z/2;o.box(h,0,l,h+.34,1.35,u),o.box(n-.34,0,l,n,1.35,u+2),o.box(h,0,l,n-1.6,1.35,l+.34),o.col(x.dung,.7,1.05),f.chance(.7)&&o.lathe(h+1.3,0,l+1.4,[[.9,0],[.85,.45],[.6,.9],[0,1.25]],9,{smooth:!0}),o.col(x.sack,.8,1.05),o.box(n-2.2,0,u-1.4,n-.6,.6,u-.5)}o.pop()}var Vo={id:"first-rain-stepwell",name:"The Thousand-Stair Rain",category:"city",media:["air","open"],weirdness:.1,async build(o){const f=o.rng,c=o.vary||{},x=f.fork("frs-d"),p=o.noise,z=o.quality&&o.quality.detail||1,P=c.density??1,k=!!c.rare,M=x.pick(["storm","storm","dusk","dust"]),b=x.chance(.3),I=x.chance(.6),S=x.chance(.3)?"parakeets":"pigeons",T=x.chance(.3)?"peacocks":"langurs",y=c.hour||"any",h=y==="night"?"dusk":y==="dawn"?"dust":y==="day"||y==="golden"?"storm":M,n=Ut[h],l=h==="dusk",u=new r.Scene,F={value:0},L=new r.Color(1,1,1),W=lo([[-170,9,26],[-128,9,26],[-94,11,19],[-63,12,4],[-30,8,-22],[4,3,-42],[36,-3,-43],[50,-8,-22],[48,-12,4],[40,-16,22],[18,-20,28],[-10,-24,28],[-29,-28,17],[-34,-32,-2],[-33,-35,-18],[-27,-38,-29],[-16,-41,-31],[-5,-45,-28],[0,-47.6,-16],[0,-48,4],[0,-48,24],[0,-48,46]]);await o.yield();const G=co({rng:f,...n.sky,sunElevation:n.sunEl,sunAzimuth:n.sunAz,renderer:o.renderer});u.add(G.object),await o.yield();const D=_(n.fog0),ie=_(n.fog1);u.fog=new r.FogExp2(D.clone(),n.dens0);const V=fo(G,{bounce:.35});u.add(V.object),await o.yield();const Ee=V.hemi.intensity,ee=Lt(Math.max(n.sunEl,13),n.sunAz),Ve=ee.clone(),te=Lt(63,243),oe=ee.clone(),ae=_(n.heroSun[0]).lerp(L,.22),Be=_("#fff0c4"),Ae=_(n.skyE[0]).multiplyScalar(n.skyE[1]),Ue=_(n.skyW[0]).multiplyScalar(n.skyW[1]),Pe=_(n.heroFill[0]).lerp(L,.18).multiplyScalar(n.heroFill[1]),R=n.clean?{sun:_(n.clean.sun).lerp(L,.22),fill:_(n.clean.fill[0]).lerp(L,.18).multiplyScalar(n.clean.fill[1]),skyE:_(n.clean.skyE[0]).multiplyScalar(n.clean.skyE[1]),light:_(n.clean.light),amb:_(n.clean.amb),light0:V.sun.color.clone(),amb0:V.hemi.color.clone()}:null,ue=ae.clone(),re=Pe.clone(),j=Ae.clone(),le=[],ce=(e,t)=>{R&&e&&e.isColor&&le.push([e,e.clone(),_(t)])},he=new r.Vector2(0,0),X={uTime:F,uFlash:{value:he},uLit:{value:_(n.wallLit)},uShade:{value:_(n.wallShade)},uBase:{value:n.wallBase?_(n.wallBase):_(n.wallShade).lerp(_(n.haze),.6)},uRim:{value:_(n.wallLit).multiplyScalar(.5)}},ke=new r.Mesh(new r.CylinderGeometry(5200,5200,5200,48,1,!0,Math.PI/2-1.9,3.8).translate(0,2450,0),new r.ShaderMaterial({uniforms:X,vertexShader:xo,fragmentShader:ko,transparent:!0,depthWrite:!1,side:r.BackSide}));ke.renderOrder=-.9,ke.frustumCulled=!1,u.add(ke);const de={uTime:F,uEdge:{value:1400},uFlash:{value:0},uTear:{value:0},uDark:{value:_(n.shelf[0])},uMid:{value:_(n.shelf[1])},uLit:{value:_(n.shelf[2])},uHaze:{value:_(n.haze)},uCam:{value:new r.Vector3},uFlashPos:{value:new r.Vector3(1500,380,-500)},uTearPos:{value:new r.Vector3(-150,380,-40)}},J=new r.Mesh(new r.PlaneGeometry(10500,13e3).rotateX(Math.PI/2).translate(2750,380,0),new r.ShaderMaterial({uniforms:de,vertexShader:wo,fragmentShader:bo,transparent:!0,depthWrite:!1,side:r.DoubleSide}));if(J.renderOrder=-.5,J.frustumCulled=!1,u.add(J),R){const e=Ut.storm,t=G.uniforms||{};ce(de.uDark.value,e.shelf[0]),ce(de.uMid.value,e.shelf[1]),ce(de.uLit.value,e.shelf[2]),ce(de.uHaze.value,e.haze),ce(X.uLit.value,e.wallLit),ce(X.uShade.value,e.wallShade),ce(X.uBase.value,"#"+_(e.wallShade).lerp(_(e.haze),.6).getHexString()),ce(X.uRim.value,"#"+_(e.wallLit).multiplyScalar(.5).getHexString()),ce(t.uZenith&&t.uZenith.value,e.sky.zenith),ce(t.uMid&&t.uMid.value,e.sky.mid),ce(t.uHorizon&&t.uHorizon.value,e.sky.horizon),ce(t.uScatterColor&&t.uScatterColor.value,e.sky.scatterColor)}const me={uTime:F,uEdge:de.uEdge,uCol:{value:_(l?"#4c4b5e":h==="dust"?"#7a6c68":"#68677a")}};{const e=f.fork("shafts"),t=[],a=[],i=[],s=[],v=(w,C,m,B,U)=>{const A=t.length/3;t.push(...w,...C,...m,...B),a.push(0,0,1,0,1,1,0,1);for(let O=0;O<4;O++)i.push(...U);s.push(A,A+1,A+2,A,A+2,A+3)};for(let w=0;w<11;w++){const C=e.range(260,2600),m=e.range(-2600,2600),B=e.range(380,900),U=e.range(-.5,.5),A=e.range(110,190),O=Math.sin(U)*B/2,ne=Math.cos(U)*B/2;v([C-O-A,-12,m-ne],[C+O-A,-12,m+ne],[C+O,378,m+ne],[C-O,378,m-ne],[e.range(2.5,5),e.range(0,20),0])}const d=new r.BufferGeometry;d.setAttribute("position",new r.Float32BufferAttribute(t,3)),d.setAttribute("uv",new r.Float32BufferAttribute(a,2)),d.setAttribute("aInfo",new r.Float32BufferAttribute(i,3)),d.setIndex(s);const E=new r.Mesh(d,new r.ShaderMaterial({uniforms:me,vertexShader:So,fragmentShader:Mo,transparent:!0,depthWrite:!1,side:r.DoubleSide,blending:r.CustomBlending,blendSrc:r.OneFactor,blendDst:r.OneMinusSrcAlphaFactor}));E.renderOrder=-.65,E.frustumCulled=!1,u.add(E)}ce(me.uCol.value,"#68677a"),await o.yield();const Q=await ho({...o,rng:f.fork("hero")},{palette:mo,progress:0,apron:74,festival:I,sunDir:[ee.x,ee.y,ee.z],sunColor:n.heroSun[0],sunIntensity:n.heroSun[1],poolStart:b?-59.2:-64.2,moss:b?1:0,portalGlow:1.1,cool:l?.6:1});u.add(Q.object),Q.setSun(ee,ae,n.heroSun[1]),Q.setSky(Ae,Ue,Pe),Q.setLamps(n.lamps),Q.setPortalGlow(_(n.portal).lerp(L,.3),1.15);const we=Q.anchors;await o.yield();const pe=_("#a08a66"),De=_("#a8946e"),Qe=_("#c2ab84"),Ie=_("#6e5c3a"),Oe=_("#8f7e4e"),S0=_(b?"#5a9434":"#e6cc22").multiplyScalar(1.75),M0=_(b?"#7fa83e":"#d0c22c").multiplyScalar(1.7),f0=_(b?"#6d9a3a":"#e0c828").multiplyScalar(1.7),u0=[0,0,0],d0=new r.Color,Gt=(e,t)=>Math.max(K0(e,t),1-H(80,97,Xe(e,t))),Fe=(e,t)=>{const a=Xe(e,t);return a<=130?-.24*(1-H(76,96,a)):H(130,520,a)*(p.fbm2(e*.0035,t*.0035,3)*7-1.5)},Ot=(e,t,a,i,s)=>{s=s||d0;const v=Dt(e,t,u0),d=p.n2(e*.011+7,t*.011)*.5+.5;s.copy(S0).lerp(M0,v[1]);const E=H(260,700,Math.hypot(e+60,t));if(s.lerp(f0,E*.6),v[0]<.5&&s.lerp(v[2]?Ie:Oe,1-E*.7),s.multiplyScalar(.78+.34*d),E>=1)return s;const w=!k0(e,t,4.6),C=Xe(e,t),m=e>-137&&e<-70&&t>-36&&t<80?K0(e,t):0;if(!w&&C>=97&&m<=0)return s;const B=Math.max(m,1-H(80,97,C)),U=p.n2(e*.05,t*.05)*.5+.5;if(B>0&&(h0.copy(pe).lerp(De,m).multiplyScalar(.82+.3*U),s.lerp(h0,B)),w){const A=1-H(1.6,3.6,He(e,t)+(U-.5)*1.6);A>0&&(h0.copy(Qe).multiplyScalar(.85+.25*U),s.lerp(h0,A))}return s},h0=new r.Color,Nt=(e,t)=>{const a=Re((e+190)/130,0,1);return Math.min(Math.hypot(e-(-190+130*a),t-We(-190+130*a)),Math.abs(Xe(e,t)-70)*1.4)},A0=await uo.makeTerrainAsync({rng:f.fork("land"),noise:p,height:Fe,corridor:!1,focus:Nt,bounds:[-2700,-2600,2500,2600],cell:2.5,near:42,levels:7,refine:0,maxTriangles:8e4,biome:"meadow",color:Ot,sunDir:ee,skirt:20,palette:{rock:"#8a6a40",rockB:"#a58454",snow:0,snowAmount:0,clouds:.14,cloudSize:520,cloudSpeed:26,tufts:0,ripples:0,pebbles:.6,cracks:.45,strata:0,wet:0}},o.yield,1);await o.yield();{const e=A0.geometry,t=e.attributes.position,a=e.index.array,i=[];for(let s=0;s<a.length;s+=3){s%12288===0&&await o.yield();const v=a[s],d=a[s+1],E=a[s+2];if(e0(t.getX(v),t.getZ(v))||e0(t.getX(d),t.getZ(d))||e0(t.getX(E),t.getZ(E)))continue;const w=(t.getX(v)+t.getX(d)+t.getX(E))/3,C=(t.getZ(v)+t.getZ(d)+t.getZ(E))/3;e0(w,C)||i.push(v,d,E)}await o.yield(),e.setIndex(i)}u.add(A0.object),await o.yield();const t0=q.makeMaterials({night:n.night,streetY:0,lit:.5,glow:2.2,warm:"#ff9a40",streetGlow:.16});t0.setSky({top:n.sky.zenith,horizon:n.sky.horizon,sun:n.sky.lightColor,sunDir:[ee.x,ee.y,ee.z]}),await o.yield();const K=f.fork("village"),ge=[],v0=[],qt=["#c4a47c","#b89a72","#cdb08a","#bfa888","#c2a67e","#d4c0a0","#dccaa6","#b8a082","#e2d6ba","#c8b494"],F0=(e,t,a,i,s,v,d)=>{const E=Math.hypot(a,i)/2;return W.nearestXZ(e,t).dist<i/2+4.6||e+E>-75.5||He(e,t)<i/2+4.4||ge.some(w=>Math.hypot(w.x-e,w.z-t)<w.r+E+1.2)||e+a/2>-104&&Q0(e,t,i/2+1)?!1:(s>1&&Q0(e,t,E+2)&&(s=1),ge.push({x:e,z:t,w:a,d:i,lv:s,rot:v,r:E,yard:d,top:s===1?3.9:s*3+.9,wall:q.lin(K.pick(qt))}),!0)};for(const e of[-1,1]){let t=-131+K.range(0,3);for(;t<-84;){const a=K.range(8,11.5),i=K.range(6.5,8.6);F0(t+a/2,We(t+a/2)+e*(5.3+i/2+K.range(0,1.6)),a,i,1,e<0?K.range(-.08,.08):Math.PI+K.range(-.08,.08),!1),t+=a+K.range(1.6,4.5)}for(t=-134+K.range(0,4);t<-86;){const a=K.range(8.5,12.5),i=K.range(7,9.5);F0(t+a/2,We(t+a/2)+e*(22.5+i/2+K.range(0,3)),a,i,K.chance(.45)?2:1,(e<0?0:Math.PI)+K.range(-.25,.25),!0),t+=a+K.range(2.5,6)}}for(let e=0;ge.length<26&&e<400;e++){const t=K.range(-136,-84),a=K.range(-22,68),i=K.range(8,12),s=K.range(7,9.5);F0(t,a,i,s,K.pick([1,1,2,2,3]),K.range(0,Ce),K.chance(.6))}for(const e of ge){const t=q.makeBuilding({rng:K.fork("h"+v0.length),style:"adobe",width:e.w,depth:e.d,levels:e.lv,detail:1,lit:1,mats:t0,position:[e.x,0,e.z],rotationY:e.rot,palette:{wall:[e.wall],roof:"#a0764a",trim:"#efe6d2",wood:"#4a3222",accent:"#ffa040"}});v0.push(t),await o.yield()}const ze=[-83,40],Vt=q.makeBuilding({rng:K.fork("shrine"),style:"dome",width:5.4,height:6.2,shape:"pointed",detail:1,lit:.6,mats:t0,position:[ze[0],0,ze[1]],rotationY:-Math.PI/2,palette:{wall:["#efe9dc"],dome:"#f4f0e6",trim:"#e6dcc8",gold:"#e8a020",accent:"#ffa040",roof:"#f0eadc"}});v0.push(Vt),await o.yield();const be={lime:q.lin("#f0e8d6"),mud:q.lin("#b08650"),terra:q.lin("#b5562c"),terraDark:q.lin("#3a2a24"),wood:q.lin("#5a3c26"),rope:q.lin("#c9b488"),sack:q.lin("#b8a070"),dung:q.lin("#5a4630"),quilts:["#b8281e","#2c4a9a","#d8a020","#2f7a5a"].map(e=>q.lin(e)),dry:["#b8201a","#c8341c","#d8a428","#c9742a"].map(e=>q.lin(e)),shutters:["#2f7a86","#2c5a9a","#3f8a5a","#8a3a2a"].map(e=>q.lin(e)),straw:q.lin("#b89a54"),straw2:q.lin("#9c8040"),iron:q.lin("#3a3e44"),tractor:q.lin("#8a3a2a"),tyre:q.lin("#1c1c1e"),trolley:q.lin("#2c5a8a"),steel:q.lin("#8a8e94")},g=q.makeBuilder(8192),Ze=Wo(),Ro=[],Ye=[],Z0=[];for(const e of ge)Do(g,K,e,be),await o.yield();const Ke=(e,t,a,i)=>{g.col(be.wood,.85,1).surf(q.SURF.PLAIN),g.beam([e,t,a],[e+.05,t+i,a],.09,.09)};let m0=0;for(let e=0;e<ge.length&&m0<11;e++){const t=ge[e],a=Math.cos(t.rot),i=Math.sin(t.rot),s=(v,d)=>[t.x+v*a+d*i,t.z-v*i+d*a];if(t.lv===1&&K.chance(.7)){const v=s(-t.w*.36,K.range(-1,1)),d=s(t.w*.36,K.range(-1,1));Ke(v[0],t.top,v[1],2.1),Ke(d[0],t.top,d[1],2.1),Ze.washing(K,[v[0],t.top+2,v[1]],[d[0],t.top+2,d[1]],K.int(3,6),Rt,m0===1),m0++}else if(K.chance(.6)){const v=s(-t.w*.4,-t.d/2-1.2),d=s(t.w*.45,-t.d/2-3.6);W.nearestXZ(v[0],v[1]).dist>5&&W.nearestXZ(d[0],d[1]).dist>5&&(Ke(v[0],0,v[1],2.5),Ke(d[0],0,d[1],2.5),Ze.washing(K,[v[0],2.4,v[1]],[d[0],2.4,d[1]],K.int(3,6),Rt,!1),m0++)}}if(await o.yield(),Ke(ze[0],5.8,ze[1],3.4),Ze.sheet([ze[0],9.15,ze[1]],[ze[0]-1.7,9.15,ze[1]+.3],1,"#f06a10",1.3,0,3,3,.85),I){const e=f.fork("flags");for(const[t,a]of[[-58,-8],[16,36]]){const i=[-68.6,7.6,t],s=[-68.6,7.6,a],v=a-t,d=.9;Ke(i[0],6,i[2],1.7),Ke(s[0],6,s[2],1.7),Ze.rope(i,s,d,"#3a2a1e",2,12);for(let E=.03;E<.98;E+=.85/v){const w=C=>[i[0],i[1]-d*4*C*(1-C),$(i[2],s[2],C)];Ze.sheet(w(E),w(E+.5/v),.62,e.pick(["#f06a10","#f08a10","#e8501a","#f0b020"]),e()*6,0,1,2,.95)}}}await o.yield();{const t=We(-109)+3.4;g.col(be.mud,.8,1).surf(q.SURF.PLAIN),g.box(-109-1.1,0,t-1.1,-109+1.1,.22,t+1.1),g.col(be.iron,.8,1.1),g.cyl(-109,.22,t,.09,.07,1.25,7),g.box(-109-.1,1.35,t-.1,-109+.1,1.6,t+.1),g.beam([-109-.75,1.72,t],[-109+.1,1.42,t],.06,.06),g.beam([-109+.05,1.1,t],[-109+.42,1,t],.07,.07),g.col(be.steel,.8,1.1),g.cyl(-109+.5,.22,t+.05,.22,.24,.36,8);const a=(m,B,U)=>{for(const A of[-1.6,.6,3,5.7]){const O=m+A*Math.cos(U),ne=B-A*Math.sin(U);if(He(O,ne)<6||W.nearestXZ(O,ne).dist<7)return!1;for(const Y of ge){const ye=Math.cos(Y.rot),Se=Math.sin(Y.rot),N=O-Y.x,se=ne-Y.z,ve=N*ye-se*Se,Me=N*Se+se*ye;if(Math.abs(ve)<Y.w/2+3.6&&Me<Y.d/2+3.8&&Me>-Y.d/2-(Y.yard?7.4:2.2))return!1}}return!0};let i=-134,s=45,v=1.35;e:for(const m of[18,16,20,14,22,-17,-19,-15,-21])for(const B of[-126,-123,-129,-120,-117,-132])for(const U of[.12,-.2,.5])if(a(B,We(B)+m,U)){i=B,s=We(B)+m,v=U;break e}Ye.push(i+2*Math.cos(v),s-2*Math.sin(v));const d=new r.Matrix4().makeRotationX(Math.PI/2),E=(m,B,U,A)=>{g.push(d),g.col(be.tyre,.9,1.05),g.lathe(m,U-A/2,-B,[[B*.42,0],[B*.9,0],[B,A*.22],[B,A*.78],[B*.9,A],[B*.42,A]],12,{smooth:!0}),g.col(be.tractor,.9,1.1),g.lathe(m,U-A*.3,-B,[[0,0],[B*.42,0],[B*.42,A*.6],[0,A*.6]],8,{}),g.pop()};g.tr(i,0,s,v),g.col(be.tractor,.85,1.05),g.box(-1.5,.75,-.42,.5,1.4,.42),g.box(.5,.75,-.55,1.5,1.2,.55),g.box(.4,1.4,-.6,1.45,1.5,.6),g.col(be.iron,.8,1),g.beam([.45,1.2,-.55],[.45,2.3,-.55],.06,.06),g.beam([.45,1.2,.55],[.45,2.3,.55],.06,.06),g.box(.4,2.3,-.62,1.5,2.36,.62),g.beam([-1.2,1.4,.2],[-1.2,2.2,.2],.08,.08);for(const m of[-.8,.8])E(1.1,.68,m,.42),E(-1.2,.36,m*.82,.22);g.col(be.tractor,.8,1.05);for(const m of[-.8,.8])g.box(.42,1.36,m-.26,1.78,1.44,m+.26);g.col(be.iron,.8,1),g.box(.75,1.2,-.25,1.25,1.3,.25),g.box(1.2,1.2,-.25,1.3,1.75,.25),g.beam([.3,1.4,0],[.62,1.78,0],.05,.05),g.box(.56,1.72,-.2,.68,1.84,.2),g.col(be.trolley,.8,1.05),g.box(2.4,.7,-.95,5.6,.82,.95),g.box(2.4,.82,-.95,5.6,1.45,-.88),g.box(2.4,.82,.88,5.6,1.45,.95),g.box(2.4,.82,-.95,2.47,1.45,.95),g.box(5.53,.82,-.95,5.6,1.45,.95),g.col(be.sack,.8,1.05),g.box(2.7,.82,-.7,4.6,1.25,.7),g.col(be.iron,.8,1),g.beam([1.75,.6,0],[2.4,.72,0],.08,.08);for(const m of[-1.07,1.07])E(4.25,.46,m,.24);g.pop();const w=-99.5,C=We(-99.5)+3.1;g.tr(w,.06,C,.7),g.col(be.tyre,.9,1);for(const m of[-.55,.55])g.lathe(m,0,0,[[.3,0],[.34,.02],[.34,.05],[.3,.07]],12);g.col(be.trolley,.9,1.1),g.beam([-.55,.06,0],[.1,.08,.3],.04,.04),g.beam([.1,.08,.3],[.55,.06,0],.04,.04),g.beam([-.55,.06,0],[.55,.1,.1],.04,.04),g.col(be.iron,.9,1.1),g.beam([.5,.08,.05],[.62,.12,.5],.035,.035),g.pop(),g.col(q.lin("#c9a23a"),.8,1.1),g.lathe(-121,0,We(-121)-3.6,[[1.3,0],[.9,.35],[.3,.7],[0,.78]],10,{smooth:!0}),g.col(be.wood,.7,1);for(let m=-168;m<-142;m+=2.3+Le(m)*.8)for(const B of[8.5,43.5]){const U=B+(Le(m*3.3)-.5)*.6;g.beam([m,0,U],[m+(Le(m)-.5)*.5,1.1+Le(m*1.7)*.4,U],.08,.08)}}await o.yield();{const e=q.lin("#c9a56a"),t=q.lin("#b8935c");for(let w=-104;w<-73.2;w+=1.32)for(let C=-1;C<=1;C++){const m=Le(w*7.1+C*3.3),B=Le(w*3.7+C*9.1);if(B<.14)continue;const U=w+(m-.5)*.3,A=We(w)+C*1.28+(B-.5)*.3,O=.52+m*.12,ne=.5+B*.12,Y=Fe(U,A);g.col(m>.5?e:t,.82,1.08).surf(q.SURF.PLAIN),g.tr(U,Y-.02,A,(m-.5)*.3),g.box(-O,0,-ne,O,.07+B*.03,ne,{}),g.pop()}const a=f.fork("drums"),i=new r.Euler,s=new r.Quaternion,v=new r.Matrix4,d=new r.Vector3,E=new r.Vector3(1,1,1);for(let w=0,C=0;w<30&&C<300;C++){const m=a.range(-97,-75),B=a.range(-20,30),U=a();if(He(m,B)<3.2||ge.some(N=>Math.hypot(N.x-m,N.z-B)<N.r+1)||a()>1.15-Math.hypot(m+72,B-4)/30*.6)continue;const A=Fe(m,B)-.04,O=.85+a()*.3;w++,Z0.push([m,B,U<.42?.75:U<.75?.8:1.7]);const ne=a()*Ce,Y=Le(m*3.1+B*7.7),ye=Le(m*5.3-B*2.9),Se=[e[0]*O,e[1]*O,e[2]*O];if(g.col(Se,.72,1.08).surf(q.SURF.PLAIN),U<.42){const N=a.range(.5,.68),se=a.range(.45,1.25),ve=Y<.36&&se>.7;i.set(ve?Math.PI/2+(ye-.5)*.12:(Y-.5)*.16,ne,ve?0:(ye-.5)*.16,"YXZ"),g.push(v.compose(d.set(m,A+(ve?N*.96:.02),B),s.setFromEuler(i),E)),g.lathe(0,ve?-se/2:0,0,[[N*.93,0],[N,.07],[N,se*.3],[N*.9,se*.35],[N*.9,se*.52],[N*1.05,se*.58],[N*1.05,se*.7],[N*.93,se*.76],[N*.93,se-.07],[N*.86,se],[N*.3,se],[N*.3,se-.06],[0,se-.06]],12,{}),ve&&g.lathe(0,-se/2,0,[[0,.05],[N*.3,.05],[N*.3,0],[N*.93,0]],12,{})}else if(U<.75){const N=a.range(.35,.8),se=N*a.range(.6,1.1),ve=N*.7,Me=.07;i.set((Y-.5)*.22,ne,(ye-.5)*.22,"YXZ"),g.push(v.compose(d.set(m,A+.03,B),s.setFromEuler(i),E)),g.box(-N,0,-ve,N,se-Me,ve,{}),g.col([Se[0]*1.07,Se[1]*1.06,Se[2]*1.04],.9,1.05),g.box(-N+Me,se-Me,-ve+Me,N-Me,se,ve-Me,{})}else{const N=a.range(1.3,2.6),se=a.range(.45,.7),ve=.09,Me=[Se[0]*.74,Se[1]*.74,Se[2]*.74];i.set((Y-.5)*.1,ne,.03+ye*.09,"YXZ"),g.push(v.compose(d.set(m,A+.05+N*.03,B),s.setFromEuler(i),E)),g.col(Me,.72,1.08),g.box(-N,0,-.75,N,se-ve,.75,{}),g.col([Me[0]*1.07,Me[1]*1.06,Me[2]*1.04],.9,1.05),g.box(-N+ve,se-ve,-.75+ve,N-ve,se,.75-ve,{}),g.col([Me[0]*.8,Me[1]*.78,Me[2]*.76],.9,1);for(const Bt of[-N+.3,N-.42])g.box(Bt,se,-.75+ve,Bt+.12,se+.035,.75-ve,{})}g.pop()}}await o.yield();const jt=new r.Mesh(g.toGeometry(),t0.facades);await o.yield();{const e=[...v0,jt],t=Math.ceil(e.length/3);for(let a=0;a<e.length;a+=t)u.add(q.mergeObjects(e.slice(a,a+t)).object),await o.yield()}const z0={...r.UniformsUtils.clone(r.UniformsLib.fog),uTime:F,uGust:{value:.4},uU:{value:0},uWind:{value:new r.Vector2(-.985,.17)},uSunDir:{value:ee},uSunCol:{value:_(n.sky.lightColor).multiplyScalar(l?.5:1.1)},uAmb:{value:_(n.sky.ambientColor).multiplyScalar(.62)}},Y0=new r.Mesh(Ze.geometry(),new r.ShaderMaterial({uniforms:z0,vertexShader:Ao,fragmentShader:Fo,vertexColors:!0,fog:!0,side:r.DoubleSide}));Y0.frustumCulled=!1,u.add(Y0),await o.yield();const o0=xe.makeWind({direction:[-.985,.17],strength:.7,speed:1.3,gustScale:.05,gustiness:.75});await o.yield();const $0={size:512};await xe.prepareLeafTexture($0,o.yield);const Ht=xe.makeLeafTexture($0);await o.yield();const a0=xe.windMaterial({wind:o0,map:Ht,backlight:1,backlightTint:"#e8e070",ambient:1.9,leafAmbient:1.7,sheen:.5}),Z=f.fork("flora"),J0=[];for(let e=0;e<3;e++)J0.push(xe.oakGeometry({rng:Z.fork("neem"+e),height:Z.range(8.5,11),detail:1,flex:2,fullness:1.05,leaf:"#4f7030",leafLight:"#86a04a",leafDark:"#2c4220",bark:"#6e5c48",barkDark:"#4a3c30"})),await o.yield();const Xt=xe.oakGeometry({rng:Z.fork("khejri"),height:6.5,detail:1,flex:2,fullness:.7,leaf:"#6f8452",leafLight:"#9aa86c",leafDark:"#465438",bark:"#77664e",barkDark:"#4e4234"}),$e=[],et=(e,t,a)=>!Q0(e,t,7)&&W.nearestXZ(e,t).dist>9.5+a&&He(e,t)>5&&!e0(e,t)&&Xe(e,t)>78&&!ge.some(i=>Math.hypot(i.x-e,i.z-t)<i.r+1.5)&&Math.hypot(e-ze[0],t-ze[1])>6&&!$e.some(i=>Math.hypot(i.x-e,i.z-t)<8);for(let e=0;$e.length<12&&e<500;e++){const t=Z.range(-150,-80),a=Z.range(-34,76);et(t,a,1.5)&&$e.push({x:t,y:Fe(t,a),z:a,s:Z.range(.85,1.2),rot:Z()*Ce,v:Z.int(0,2),d:0,u:0})}for(let e=0;$e.length<16&&e<300;e++){const t=Z()*Ce,a=Z.range(96,150),i=Math.cos(t)*a-10,s=Math.sin(t)*a;et(i,s,0)&&$e.push({x:i,y:Fe(i,s),z:s,s:Z.range(.8,1.15),rot:Z()*Ce,v:3,d:0,u:0})}const C0=xe.makeScatter({rng:Z.fork("trees"),variants:[...J0,Xt],points:$e,material:a0,tint:.12,hue:.03,groundShadow:{sunDir:ee,strength:.42,heightAt:Fe,color:"#2a2440",size:1.2}});u.add(C0.object),await o.yield();const s0=[],n0=[];for(const e of ge){const t=Math.cos(e.rot),a=Math.sin(e.rot),i=e.w>e.d*1.2?2:1,s=(i===1?Math.max(e.w,e.d):e.d)*.5;for(let v=0;v<i;v++){const d=i===1?0:(v-.5)*e.w*.46,E=e.x+d*t,w=e.z-d*a;s0.push({x:E,z:w,r:s*(e.lv>1?1.3:1)+.7}),n0.push({x:E,z:w,r:s+2.5})}}s0.push({x:ze[0],z:ze[1],r:3.6}),n0.push({x:ze[0],z:ze[1],r:4.6}),Ye.length&&(s0.push({x:Ye[0],z:Ye[1],r:2.4}),n0.push({x:Ye[0],z:Ye[1],r:3.4}));for(const[e,t,a]of Z0)s0.push({x:e,z:t,r:a*.95}),n0.push({x:e,z:t,r:a+.55});const tt=xe.makeGroundShadows({points:s0,heightAt:Fe,sunDir:ee,strength:l?.6:1.3,color:"#746e94",size:1,stretch:.9,cell:7,lift:.14});await o.yield();const ot=xe.makeGroundShadows({points:n0,heightAt:Fe,sunDir:[0,1,0],strength:2.2,color:"#6e6888",size:1,cell:7,lift:.17});u.add(tt.object,ot.object);const p0=[C0,tt,ot];await o.yield();const at=(e,t)=>e>-137&&Gt(e,t)>.25||!k0(e,t,3.4)&&He(e,t)<3.4?0:Dt(e,t,u0)[0],P0={heightAt:Fe,density:at,wind:o0,map:a0.map,width:[1.2,1.9],height:b?[.9,1.35]:[1.05,1.5],cards:2,root:b?"#3a6c22":l?"#a89a24":"#98a224",tip:b?"#98cc48":l?"#ffd428":"#ffe626",dryAmount:0,tint:.14,flowers:0,fade:[135,180],materialOptions:{ambient:2,leafAmbient:2.3,wrap:.8,backlight:.9,sheen:.9,detail:0}},T0=z*Math.min(1.12,Math.max(.85,P)),st=await xe.makeGrassAsync({rng:Z.fork("crop"),bounds:[-202,-44,-128,100],count:Math.round(12500*T0),chunks:2,...P0,shade:p0,width:[1.8,2.8]},o.yield);await o.yield();const nt=await xe.makeGrassAsync({rng:Z.fork("crop2"),bounds:[-130,-128,-62,152],count:Math.round(5800*T0),chunks:2,...P0,shade:p0,width:[2.1,3.3]},o.yield);await o.yield();const it=await xe.makeGrassAsync({rng:Z.fork("crop3"),bounds:[-250,-110,-128,160],count:Math.round(4e3*T0),chunks:1,...P0,cards:1,width:[2.6,3.8],density:(e,t)=>e>-202&&t>-44&&t<100?0:at(e,t)},o.yield);u.add(nt.object,it.object),u.add(st.object),await o.yield();const Qt=(e,t)=>t>56.5&&Math.abs(e)<73.2,rt=(e,t)=>Xe(e,t)<74?.01:Fe(e,t),Kt=(e,t)=>{const a=Xe(e,t);if(e0(e,t)||a<73.2&&!Qt(e,t)||!k0(e,t,3)&&He(e,t)<3)return 0;const i=Math.max(1-H(88,104,a),K0(e,t)*.35);return i>0&&e<-75&&ge.some(s=>Math.hypot(s.x-e,s.z-t)<s.r)?0:i},E0=await xe.makeGrassAsync({rng:Z.fork("dry"),bounds:[-150,-104,104,104],count:Math.round(7600*z),heightAt:rt,density:Kt,shade:p0,wind:o0,map:a0.map,width:[.7,1.2],height:[.35,.75],root:"#7a6a3a",tip:"#d8c078",dryAmount:.5,flowers:0,chunks:2,fade:[110,150],materialOptions:{ambient:1.2,leafAmbient:1.3,wrap:.4,backlight:.6,sheen:.6,detail:0}},o.yield);u.add(E0.object),await o.yield();const lt=await xe.makeGrassAsync({rng:Z.fork("dry-bay"),bounds:[-99,-24,-73.4,34],count:Math.round(2100*z),heightAt:rt,shade:p0,wind:o0,material:E0.material,density:(e,t)=>!k0(e,t,2.6)&&He(e,t)<2.6||ge.some(a=>Math.hypot(a.x-e,a.z-t)<a.r)?0:.35+.65*H(-99,-90,e),width:[.8,1.4],height:[.45,.95],root:"#7a6a3a",tip:"#d8c078",dryAmount:.5,flowers:0,chunks:1,fade:[110,150]},o.yield);u.add(lt.object),await o.yield();const ct=[];for(let e=0;e<2;e++)ct.push(xe.bushGeometry({rng:Z.fork("bush"+e),size:1.4,detail:0,flowers:0,leaf:"#6a7a44",leafLight:"#98a060",leafDark:"#3c4a2a"})),await o.yield();const i0=[];for(let e=0;i0.length<38&&e<900;e++){const t=Z()*Ce,a=Z.range(75,104),i=Re(Math.cos(t)*a*1.3,-104,104),s=Re(Math.sin(t)*a*1.3,-104,104);Xe(i,s)<74.5||i<-74&&s>-30&&s<70||W.nearestXZ(i,s).dist<9||i0.push({x:i,y:Fe(i,s),z:s,s:Z.range(.7,1.5),rot:Z()*Ce,v:i0.length%2,d:0,u:0})}{const e=f.fork("capers-south");for(let t=0;t<9;t++){const a=e.range(-70,70),i=e.range(58,73);i0.push({x:a,y:0,z:i,s:e.range(.7,1.4),rot:e()*Ce,v:t%2,d:0,u:0})}}const ft=[];for(let e=0;e<2;e++)ft.push(xe.bushGeometry({rng:Z.fork("fig"+e),size:1.5,detail:1,flowers:0,leaf:"#3f7a34",leafLight:"#78b04a",leafDark:"#224a20"})),await o.yield();const B0=[];for(let e=0;e<6;e++)for(let t=0;t<3;t++)for(const a of we.ledges(e,t)){if(Z()>.3-e*.03)continue;const i=a.clone();t===0?i.z-=2.1:i.x+=t===1?2.1:-2.1,i.x+=t===0?Z.range(-4,4):0,i.z+=t===0?0:Z.range(-4,4),!(W.distanceTo(i.x,i.y+1,i.z)<7.5)&&B0.push({x:i.x,y:i.y-.05,z:i.z,s:Z.range(.5,1.25),rot:Z()*Ce,v:B0.length%2,d:0,u:0})}await o.yield();const ut=xe.makeScatter({rng:Z.fork("bushes"),variants:ct,points:i0,material:a0,tint:.2});await o.yield();const dt=xe.makeScatter({rng:Z.fork("figs"),variants:ft,points:B0,material:a0,tint:.2,sink:0,tilt:.25});u.add(ut.object,dt.object),await o.yield();const Ne=Te.makeFauna(u,{light:Te.lightFrom(u)}),je=f.fork("birds"),L0={species:"crows",size:1,body:"#8f9cc0",belly:"#b6c0d8",wingC:"#98a4c6",trail:"#66708c",tip:"#2c3040",beak:"#caa08e",head:"#5a6688",flap:5.2,glide:.18},ht={species:"parrots",size:1.25,body:"#58b238",belly:"#93d24c",wingC:"#3f9a30",trail:"#2a7a2a",tip:"#1e5a3a",beak:"#e03a2a",head:"#66c244",tailC:"#3aa48c"};l&&Object.assign(L0,{body:"#687090",belly:"#858ca8",wingC:"#6e7694",trail:"#4c5370",tip:"#252a3c",head:"#48506c"});const g0=Math.round(500*Math.min(1,z)*n.flock*Re(P,.8,1.15)),U0=S==="pigeons"?L0:ht,I0=S==="pigeons"?1:.55,vt=e=>(e.uniforms.uVivid&&(e.uniforms.uVivid.value=.55),e.uniforms.uBack&&(e.uniforms.uBack.value=.3),e),_0=e=>S==="pigeons"?vt(e):e,W0=(e,t)=>({path:W,dist:2,each:!0,from:e,to:t,step:2});Ne.add(_0(Te.makeFlock({rng:je.fork("a"),...U0,count:Math.round(g0*.33*I0),spread:[3.5,3,14],wander:[1.6,1.4,3,.5],maxSigma:3,along:{path:W,side:16,up:1.5,lead:40,from:-.03,to:.58,drift:2}}))),await o.yield(),Ne.add(_0(Te.makeFlock({rng:je.fork("b"),...U0,lod:"low",count:Math.round(g0*.27*I0),spread:[3.5,3,14],wander:[1.6,1.4,3,.45],maxSigma:3,along:{path:W,side:-15,up:-4,lead:48,from:-.03,to:.44,drift:2}}))),await o.yield(),Ne.add(_0(await Te.makeFlockAsync({rng:je.fork("d"),...U0,count:Math.round(g0*.14*I0),spread:[4,2.6,10],wander:[.6,.4,.8,.5],maxSigma:3,keepClear:W0(.2,1),along:{path:W,side:.5,up:2.6,lead:36,from:.72,to:1,drift:3}},o.yield))),await o.yield(),Ne.add(vt(Te.makeFlock({rng:je.fork("c"),...L0,lod:"low",count:Math.round(g0*.26),spread:[6,5,20],wander:[1.2,.8,1.6,.4],maxSigma:3,keepClear:W0(.2,1),center:[0,-19,-8],radius:19,height:6,wobble:.3,speed:14}))),await o.yield();const D0=(e,t,a,i,s,v)=>Ne.add(Te.makeFlock({rng:je.fork(e),...ht,count:i,spread:[4,3,8],wander:[.6,.4,.8,.6],maxSigma:3,keepClear:W0(s,v),cross:{path:W,u:t,lead:32,span:120,angle:62,side:a,height:-2,rise:16,duration:x0}}));D0("p1",.48,1,22,.4,1),await o.yield(),D0("p2",.63,-1,20,.4,1),await o.yield(),D0("p3",.71,1,20,.25,1),await o.yield();const mt=e=>65-3*e,Zt=e=>{const t=[],a=s=>s>=7?17-7*(12-s):-18+7*(7-s);let i=24;for(let s=12;s>=0;s--){const v=e*(mt(s)-1.15),d=a(s),E=-5*(s+1),w=-5*s;for(let C=0;C<=14;C++){const m=C/14;t.push(new r.Vector3(v,$(E,w,m)+.05,$(i,d,m)))}if(s>0)for(let C=1;C<5;C++)t.push(new r.Vector3(e*(mt(s)-1.15+3*C/5),w+.05,d));i=d}return t},Yt=e=>(t,a)=>{let i=1e9,s=0;for(let v=0;v<e.length;v++){const d=e[v],E=(d.x-t)*(d.x-t)+(d.z-a)*(d.z-a);E<i&&(i=E,s=d.y)}return s},R0={...Te.HERD_PRESETS.deer,h:.95,bodyLen:1.05,width:.36,depth:.44,hip:1,leg:[.08,.055,.045],neckLen:.2,neckAng:38,neck:[.17,.14],headLen:.26,headR:.14,headPitch:22,ears:.05,tail:1.8,tailType:"thin",antlers:0,graze:0,coat:"#7c7e80",belly:"#a9a9a4",legs:"#5c5d5e",sock:"#141212",accent:"#141212",horn:"#111111",pattern:"none",speed:1.45,stride:.9,varieties:0,count:15},pt=[];if(T==="langurs")for(const e of[1,-1]){const t=Zt(e),a=t.filter((U,A)=>A%3===0);let i=0;for(let U=1;U<a.length;U++)i+=a[U].distanceTo(a[U-1]);const s=R0.speed*4.2,v=e>0?.54:.72,d=e>0?.88:.57,E=i*1.2,w=Te.makeHerd({rng:je.fork("langur"+e),preset:l?{...R0,coat:"#8c92a4",belly:"#aeb2c0",legs:"#6c7284"}:R0,count:15,mode:"migrate",gait:"run",route:a,closed:!1,heightAt:Yt(t),spread:[.35,35],blobShadow:!0,shadowOpacity:.3,fill:l?.9:.6}),C=w.update.bind(w),m=[];w.object.traverse(U=>{const A=U.material&&U.material.uniforms&&U.material.uniforms.uTravel;A&&!m.includes(A)&&m.push(A)}),w.update=(U,A,O,ne)=>{const Y=ne||0,ye=((d*i+(Y-v)*x0*s)%E+E)%E;C(U,Y*x0,O,ne);for(const Se of m)Se.value=ye};const B=l?{sunColor:"#c0b8c4",sunIntensity:.6,sky:"#8e90a8",skyIntensity:1.25,ground:"#6a6470",groundIntensity:1}:e<0?{sunColor:"#aeb4c6",sunIntensity:.9,sky:"#9aa2bc",skyIntensity:2.6,ground:"#6a6470",groundIntensity:1.8}:{sunColor:"#ffe2bc",sunIntensity:1.6,sky:"#8e96b0",skyIntensity:1.5,ground:"#77706c",groundIntensity:1.1};Ne.add(w,{always:!0,light:Te.lightFrom(u,B)}),await o.yield()}else for(let e=1;e<8;e++)for(const t of[1,2]){const a=we.ledges(e,t);for(let i=e%2;i<a.length;i+=3)W.distanceTo(a[i].x,a[i].y+1,a[i].z)>14&&pt.push([a[i],t])}await o.yield();const gt=(e,t,a)=>{const i=[];for(let s=t;s<=a;s+=9)i.push([s,0,We(s)+e]);return i};Ne.add(Te.makeHerd({rng:je.fork("goats"),preset:{...Te.HERD_PRESETS.antelope,h:.64,horns:.2,coat:"#463a30",belly:"#6a5a4a",legs:"#382e26",sock:"#2a221c",accent:"#d8ccb8",pattern:"none",tail:.12},count:4,mode:"migrate",gait:"run",route:gt(2.3,-152,-84),closed:!1,heightAt:Fe,spread:[1.2,14],tints:["#ffffff","#e8d2b4","#b89878","#ffffff"]})),await o.yield(),Ne.add(Te.makeHerd({rng:je.fork("cattle"),preset:{...Te.HERD_PRESETS.bison,h:1.32,hump:.22,horns:.3,coat:"#dcd6c6",belly:"#c8c0ae",legs:"#bdb5a4",sock:"#9a9282",accent:"#8a8274",neckAng:6,headPitch:42,speed:1},count:2,mode:"migrate",gait:"run",route:gt(-2.1,-156,-86),closed:!1,heightAt:Fe,spread:[.8,9],speed:.75})),await o.yield();const G0={uSunDir:{value:oe},uSunCol:{value:_(n.sky.lightColor).multiplyScalar(.9)},uAmb:{value:_(n.sky.ambientColor).multiplyScalar(.75)}},y0=new r.ShaderMaterial({uniforms:{...r.UniformsUtils.clone(r.UniformsLib.fog),...G0},vertexShader:Lo,fragmentShader:Uo,vertexColors:!0,fog:!0,side:r.DoubleSide});{const e=H0(),t=f.fork("peacocks");e.at(-68.8,6,-8.6,Math.PI/2+.25,1.45),X0(e,1,0);const a=[[-69.5,6,17.5,1.2],[-68.4,6,-31,2],[-30,6,-68.6,.3],[14,6,-69.2,-.5],[44,6,-68,.2],[68.6,6,-40,-1.4],[69.2,6,6,-1.8]];for(const s of a)e.at(s[0],s[1],s[2],s[3]+t.range(-.3,.3),1.4),X0(e,0,0);for(const[s,v]of pt)e.at(s.x,s.y+.02,s.z,(v===1?-Math.PI/2:Math.PI/2)+t.range(-.9,.9),1),X0(e,t.chance(.25)?1:0,0);const i=new r.Mesh(e.geometry(),y0);i.frustumCulled=!1,u.add(i)}const $t={...r.UniformsUtils.clone(r.UniformsLib.fog),...G0,uTime:F,uAmp:{value:.42}},qe=new r.Mesh(po([[0,0,0,0,1.5,.4],[4.5,1.6,-6.5,.08,1.45,2.9]]),new r.ShaderMaterial({uniforms:$t,vertexShader:go,fragmentShader:yo,vertexColors:!0,fog:!0,side:r.DoubleSide}));qe.frustumCulled=!1,qe.position.set(-67,6.8,-9),qe.scale.setScalar(1e-4),u.add(qe);const Je=[.19,.235,.295,.34,.385,.43],yt=new r.CatmullRomCurve3([[-67,6.8,-9],[-34.5,3.6,-10.9],[-11.9,2.2,-27.3],[4.7,1.2,-38.4],[29,-1,-50],[50,-4.8,-63.3]].map(e=>new r.Vector3(e[0],e[1],e[2])),!1,"centripetal"),w0=new r.Vector3,O0=new r.Vector3,wt=(()=>{const e=H0();e.at(0,0,0);for(let a=0;a<8;a++)e.tint(a%2?"#c8201c":"#e0342a"),e.lathe(0,0,0,[[0,0],[1.05,.38]],1,"z",Ce/8,a/8*Ce);e.tint("#3a2a20"),e.box(-.025,-.025,-.1,.025,.025,1.15);const t=new r.Mesh(e.geometry(),y0);return u.add(t),t})(),bt=(()=>{const e=ge[1]||ge[0],t=Math.cos(e.rot),a=Math.sin(e.rot),i=-e.w/2+e.w*.3-.5,s=e.d/2+.08,v=H0();v.at(0,0,0),v.tint("#5a3c26"),v.box(0,.05,-.04,1,2.05,.04),v.tint("#3f2a1c"),v.box(.08,.9,-.06,.92,1,.06);const d=new r.Mesh(v.geometry(),y0);return d.position.set(e.x+i*t+s*a,0,e.z-i*a+s*t),d.userData.rot=e.rot,u.add(d),d})();await o.yield();const xt={...r.UniformsUtils.clone(r.UniformsLib.fog),uTime:F,uPoolY:Q.uniforms.uPoolY,uShow:{value:0},...G0};{const e=f.fork("frogs"),t=Math.round(300*Math.min(1,z+.2)),a=new Float32Array(t*3),i=new Float32Array(t*3),s=[];for(let w=8;w<13;w++)for(let C=0;C<3;C++)for(const m of we.ledges(w,C))s.push(m);for(let w=0;w<t;w++){if(w<t*.62){const C=s[e.int(0,s.length-1)],m=e.range(-6,6),B=e.range(-1.6,.3),U=Math.abs(C.z+2)>Math.abs(C.x)?0:C.x>0?1:2;a[w*3]=C.x+(U===0?m:U===1?-B:B),a[w*3+1]=C.y+.1,a[w*3+2]=C.z+(U===0?B:m)}else{const C=e()*Ce,m=e.range(17.5,25);a[w*3]=Re(Math.cos(C)*m,-24,24),a[w*3+1]=-64.75,a[w*3+2]=Re(6+Math.sin(C)*m*1.15,-22,33)}i[w*3]=e(),i[w*3+1]=e(),i[w*3+2]=e()}const v=new r.IcosahedronGeometry(.17,0).scale(1.15,.62,1.5),d=new r.InstancedBufferGeometry;d.setAttribute("position",v.attributes.position),d.setAttribute("normal",v.attributes.normal),v.index&&d.setIndex(v.index),d.setAttribute("aBase",new r.InstancedBufferAttribute(a,3)),d.setAttribute("aSeed",new r.InstancedBufferAttribute(i,3)),d.instanceCount=t;const E=new r.Mesh(d,new r.ShaderMaterial({uniforms:xt,vertexShader:Eo,fragmentShader:Bo,fog:!0}));E.frustumCulled=!1,u.add(E)}await o.yield();const fe=f.fork("air"),_e=Ge.fxGroup();u.add(_e.object);const kt=.46,St=h==="dust"?.6:.35,Mt=.95,At=_e.add(Ge.makeParticles({rng:fe.fork("rain"),preset:"rain",time:F,count:Math.round(6500*z),box:[54,42,54],velocity:[-5.5,-25,1],colors:n.rain,intensity:1.05,opacity:kt,size:[.016,.03],stretch:.05}));await o.yield();const Jt=_e.add(Ge.makeParticles({rng:fe.fork("dust"),preset:"dust",time:F,count:Math.round(2400*z),box:[46,24,46],velocity:[-3.2,.1,.5],velocityRandom:[1.2,.3,.6],turbulence:[.8,.4,.6],size:[.035,.1],colors:["#a8854e","#b8935a","#987644"],intensity:l?.3:.5,opacity:St,additive:0,twinkle:0}));await o.yield();const Ft=_e.add(Ge.makeParticles({rng:fe.fork("leaves"),preset:"leaves",time:F,follow:!1,center:[0,-24,-8],box:[124,62,104],count:Math.round(1700*z),velocity:[-3.4,.6,1.4],velocityRandom:[2.6,1.8,2.6],turbulence:[4.2,2.2,3.2],size:[.3,.62],colors:["#b8862c","#8a5a2b","#d9a55b"],opacity:Mt,lightDir:[ee.x,ee.y,ee.z]}));At.setOpacity(0),Ft.setOpacity(0),await o.yield();const N0={...r.UniformsUtils.clone(r.UniformsLib.fog),uTime:F,uRain:{value:0},uSunDir:{value:oe},uGold:{value:new r.Color(...n.gold)},uShade:{value:_(n.heroFill[0]).multiplyScalar(1.5)},uCam:{value:new r.Vector3}};{const e=[],t=[],a=[],i=[],s=(m,B,U,A,O,ne)=>{const Y=e.length/3;e.push(...m,...B,...U,...A),t.push(0,0,1,0,1,1,0,1);for(let ye=0;ye<4;ye++)a.push(O/10,ne);i.push(Y,Y+1,Y+2,Y,Y+2,Y+3)};[-52,-34,-14,6,24].forEach((m,B)=>s([-72,-66,m],[48,-66,m],[60,26,m],[-60,26,m],120,B*1.7+.3)),[-50,-28,-6,18,42].forEach((m,B)=>s([m-12,-66,-62],[m-12,-66,37],[m,26,37],[m,26,-62],99,B*2.3+5.1));const w=new r.BufferGeometry;w.setAttribute("position",new r.Float32BufferAttribute(e,3)),w.setAttribute("uv",new r.Float32BufferAttribute(t,2)),w.setAttribute("aSeed",new r.Float32BufferAttribute(a,2)),w.setIndex(i);const C=new r.Mesh(w,new r.ShaderMaterial({uniforms:N0,vertexShader:Po,fragmentShader:To,fog:!0,transparent:!0,depthWrite:!1,side:r.DoubleSide,blending:r.CustomBlending,blendSrc:r.OneFactor,blendDst:r.OneMinusSrcAlphaFactor}));C.renderOrder=3,C.frustumCulled=!1,u.add(C)}const zt={uTime:F,uCol:{value:_("#8a6a40")},uColLit:{value:_(l?"#b08a78":"#e8b872")}},Ct=(e,t,a)=>{const i=new Float32Array(e*3),s=new Float32Array(e*3),v=new r.PlaneGeometry(1,1),d=new r.InstancedBufferGeometry;for(let w=0;w<e;w++)a(w,i,s);d.setAttribute("position",v.attributes.position),d.setAttribute("uv",v.attributes.uv),d.setIndex(v.index),d.setAttribute("aPos",new r.InstancedBufferAttribute(i,3)),d.setAttribute("aS",new r.InstancedBufferAttribute(s,3)),d.instanceCount=e;const E=new r.Mesh(d,new r.ShaderMaterial({uniforms:t,vertexShader:zo,fragmentShader:Co,fog:!0,transparent:!0,depthWrite:!1,blending:r.CustomBlending,blendSrc:r.OneFactor,blendDst:r.OneMinusSrcAlphaFactor}));return E.renderOrder=3,E.frustumCulled=!1,u.add(E),E},q0={...r.UniformsUtils.clone(r.UniformsLib.fog),...zt,uFront:{value:-20},uOpacity:{value:0},uWrap:{value:new r.Vector2(0,0)}};Ct(Math.round(64*Math.min(1,z+.2)),q0,(e,t,a)=>{const i=fe()<.6;t[e*3]=fe.range(-9,9)+(i?0:6),t[e*3+1]=i?fe.range(1.2,3.5):fe.range(4,9),t[e*3+2]=fe.range(-70,130),a[e*3]=i?fe.range(8,14):fe.range(11,19),a[e*3+1]=fe(),a[e*3+2]=fe()});const Pt={...r.UniformsUtils.clone(r.UniformsLib.fog),...zt,uFront:{value:74},uOpacity:{value:0},uWrap:{value:new r.Vector2(10,150)}};Ct(Math.round(34*Math.min(1,z+.2)),Pt,(e,t,a)=>{t[e*3]=0,t[e*3+1]=fe.range(-9,4),t[e*3+2]=fe.range(-60,34),a[e*3]=fe.range(9,17),a[e*3+1]=fe(),a[e*3+2]=fe()}),await o.yield();const V0=[ee.x,ee.y,ee.z],j0=_e.add(Ge.makeDustDevil({rng:fe.fork("devilA"),time:F,position:[150,Fe(150,-150),-150],height:62,radius:[1.6,12],color:"#c79c62",colorTop:"#b89a6e",shadowColor:"#5a4636",opacity:.46,size:[4,14],sunDir:V0,sunColor:n.sky.lightColor,sway:4}));await o.yield();const Go=_e.add(Ge.makeDustDevil({rng:fe.fork("devilB"),time:F,position:[-121,Fe(-121,-66),-66],height:30,radius:[.8,6],color:"#c9a06a",colorTop:"#b89a6e",shadowColor:"#5a4636",opacity:.4,sunDir:V0,sunColor:n.sky.lightColor,wander:5}));await o.yield();const eo=ge.filter(e=>e.lv>1||W.nearestXZ(e.x,e.z).dist>20).slice(0,2);for(const e of eo)_e.add(Ge.makeSmokeColumn({rng:fe.fork("smoke"+e.x),time:F,position:[e.x+1.5,e.top+.3,e.z-1],height:9,radius:[.3,2.6],size:[.9,5],count:46,color:"#7d766e",colorTop:"#9a9288",shadowColor:"#4a4448",opacity:.34,wind:[-22,0,3.4],bend:1.6,rate:.16,sunDir:V0,sunColor:n.sky.lightColor}));if(await o.yield(),n.lamps){const e=[];for(const t of ge){const a=Math.cos(t.rot),i=Math.sin(t.rot),s=-t.w/2+t.w*.3+.95,v=t.d/2+.25;e.push([t.x+s*a+v*i,1.5,t.z-s*i+v*a])}e.push([ze[0]-2.2,1.2,ze[1]]);for(let t=0;t<5;t++)for(const a of[1,2,-2,3,-3,4,-4,5,-5,6,-6]){const i=Math.abs(a),s=(a*7+t*13+a*t*3+120)%5;s!==0&&s!==2&&!(i===3&&t===1)||t<2&&i<3||e.push([a===1?0:Math.sign(a)*(i===2?5:7.5+4.625*(i-2.5)),-65+13*t+2,41.5])}for(const t of[-6.4,6.4])e.push([t,-56.6,39.5]);for(const t of we.lamps||[])e.push([t.x,t.y,t.z]);_e.add(Ge.makeGlows({rng:fe.fork("lamps"),time:F,positions:e,color:"#ffae58",size:2.4,sizeJitter:.3,intensity:2.5,flicker:.5,halo:1,core:1}));{const t=[],a=[],i=[],s=[],v=ge.length+1;for(let w=0;w<v;w++){const C=ge[w],m=C?Math.cos(C.rot):0,B=C?Math.sin(C.rot):0,U=1.9,A=C?3.5:3,O=C?e[w][0]+U*B:e[w][0]-1.6,ne=C?e[w][2]+U*m:e[w][2],Y=Fe(O,ne)+.06,ye=t.length/3,Se=Le(w*5.7+1.3)*40;t.push(O-A,Y,ne-A,O+A,Y,ne-A,O+A,Y,ne+A,O-A,Y,ne+A),a.push(0,0,1,0,1,1,0,1),i.push(Se,Se,Se,Se),s.push(ye,ye+2,ye+1,ye,ye+3,ye+2)}const d=new r.BufferGeometry;d.setAttribute("position",new r.Float32BufferAttribute(t,3)),d.setAttribute("uv",new r.Float32BufferAttribute(a,2)),d.setAttribute("aPh",new r.Float32BufferAttribute(i,1)),d.setIndex(s);const E=new r.Mesh(d,new r.ShaderMaterial({uniforms:{...r.UniformsUtils.clone(r.UniformsLib.fog),uTime:F,uCol:{value:_("#ffae58").multiplyScalar(.36)}},vertexShader:Io,fragmentShader:_o,fog:!0,transparent:!0,depthWrite:!1,blending:r.AdditiveBlending,side:r.DoubleSide}));E.renderOrder=1,E.frustumCulled=!1,u.add(E)}}else we.lamps&&we.lamps.length&&_e.add(Ge.makeGlows({rng:fe.fork("lamps"),time:F,positions:we.lamps.map(e=>[e.x,e.y,e.z]),color:"#ffae58",size:3,intensity:2,flicker:.5,halo:1,core:1}));await o.yield();const to=k?_e.add(Ge.makeGodRays({rng:fe.fork("rays"),time:F,position:[-14,44,-4],direction:[-te.x,-te.y,-te.z],radius:18,count:10,length:132,width:[2.4,8],color:"#fff0c4",intensity:0,falloff:1.1,fogAmount:.3})):null;k&&de.uTearPos.value.set(-186,380,95),await o.yield();const r0=new r.Vector3,oo=new r.Color,ao=o0.uniforms.uFloraWind.value,b0=[-1,-1],Tt=(e,t,a,i)=>{if(t<a)return b0[e]=-1,0;if(b0[e]<0){if(t>a+.03)return 0;b0[e]=i}const s=i-b0[e];if(s<=0||s>=.6)return 0;if(s<.1){const d=s/.1;return d*d*(3-2*d)}const v=1-(s-.1)/.5;return v*v},so=n.heroSun[1],no=j0.uniforms.uBase.value.y;function Et(e,t,a,i){const s=i||0;F.value=t,a.getWorldPosition(r0),Q.setProgress(s);const v=H(.3,.5,s);if(R){const A=H(.36,.6,s);ue.copy(ae).lerp(R.sun,A),re.copy(Pe).lerp(R.fill,A),j.copy(Ae).lerp(R.skyE,A),Q.setSun(void 0,ue,void 0),Q.setSky(j,void 0,re),V.sun.color.copy(R.light0).lerp(R.light,A),V.hemi.color.copy(R.amb0).lerp(R.amb,A);for(let O=0;O<le.length;O++)le[O][0].copy(le[O][1]).lerp(le[O][2],A)}if(k){const A=H(.72,.82,s);oe.copy(Ve).lerp(te,A).normalize(),Q.setSun(oe,oo.copy(ue).lerp(Be,A),so*(1+A*(l?1.4:.25))),Q.setShaft(22,-18,46,A),de.uTear.value=H(.69,.78,s),to.uniforms.uIntensity.value=.34*A*(1-.7*H(.86,.94,s))}Q.setCloud($(34,190,H(.07,.2,s)),.9*(1-H(.15,.215,s))),Q.update(e,t,a),u.fog.color.copy(D).lerp(ie,v),u.fog.density=$(n.dens0,n.dens1,v),At.setOpacity(kt*H(.33,.47,s)),Jt.setOpacity(St*(1-H(.26,.42,s))),Ft.setOpacity(Mt*H(.12,.2,s)*(1-H(.37,.47,s))),N0.uRain.value=H(.38,.5,s)*(k?1-.55*H(.78,.88,s):1),N0.uCam.value.copy(r0),xt.uShow.value=H(.4,.5,s),j0.uniforms.uBase.value.y=no-70*H(.28,.42,s),j0.object.visible=s<.43,de.uEdge.value=$(1400,-560,H(.03,.45,s)),de.uCam.value.copy(r0);const d=Tt(0,s,.12,t),E=Tt(1,s,.58,t),w=Math.max(d,E);he.set(d,E),de.uFlash.value=w*.85,E>0?de.uFlashPos.value.set(900,380,700):de.uFlashPos.value.set(1500,380,-500),G.update(e,t,a),V.update(e,t,a),ke.position.set(r0.x,0,r0.z),V.hemi.intensity=Ee*(1+.07*w);const C=H(.03,.09,s),m=.5+.5*Math.sin(t*.6);ao.z=.7+1.45*C+.25*m,z0.uGust.value=.35+.95*C+.3*m,z0.uU.value=s,q0.uFront.value=-20-s*1600,q0.uOpacity.value=.55*H(.012,.045,s)*(1-H(.16,.26,s)),Pt.uOpacity.value=(h==="dust"?.34:.22)*H(.1,.19,s)*(1-H(.36,.45,s)),A0.update(e,t),C0.update(e,t,a),st.update(e,t,a),nt.update(e,t,a),it.update(e,t,a),E0.update(e,t,a),lt.update(e,t,a),ut.update(e,t,a),dt.update(e,t,a),t0.update(e,t),Ne.update(e,t,a,s),_e.update(e,t,a);const B=s>Je[0]&&s<Je[5];if(qe.scale.setScalar(B?1:1e-4),B){let A=0;for(;A<4&&s>Je[A+1];)A++;const O=(A+(s-Je[A])/(Je[A+1]-Je[A]))/5;yt.getPoint(O,w0),yt.getPoint(Math.min(1,O+.01),O0),qe.position.copy(w0),qe.position.y+=Math.sin(t*1.7)*.2,O<.99&&(qe.rotation.y=Math.atan2(O0.x-w0.x,O0.z-w0.z)),qe.rotation.z=Math.sin(t*1.3)*.07}const U=-84-(t*5.5+13)%62;wt.position.set(U,1+Math.abs(Math.sin(t*4.1))*.3,We(U)+1.4+Math.sin(t*1.3)*.9),wt.rotation.set(.3,.25,-t*5.2),bt.rotation.y=bt.userData.rot+.8+Math.sin(t*2.3)*.6+Math.sin(t*5.9)*.12}{const e=new r.PerspectiveCamera(62,o.aspect||1.78,.3,9e3);W.pointAt(0,e.position),e.lookAt(0,9,20),e.updateMatrixWorld(),Et(0,0,e,0)}await o.yield(),await G.prewarm(o.renderer,null,u);const io=new r.Vector3,ro=(e,t)=>io.set(22,-56,-14).lerp(vo,H(.735,.795,t));return{scene:u,path:W,duration:x0,title:n.title+(k?": the Torn Cloud":b?" (second week)":""),ride:"none",camera:{fov:62,near:.3,far:9e3,lookAhead:22,sway:.7,bank:.55},pois:[{at:[-66,4,6],from:0,to:.13,weight:.4,fade:.3},{at:[4,-62,2],from:.19,to:.33,weight:.62,fade:.35},{at:[59,4,-59],from:.27,to:.435,weight:.66,fade:.25},{at:[-6,-54,28],from:.4,to:.61,weight:.44,fade:.21},{at:[-16,-27,38],from:.615,to:.71,weight:.4,fade:.25},{at:ro,from:.675,to:.85,weight:.6,fade:.25},{at:[0,-57,10],from:.845,to:.9,weight:.3,fade:.3}],portal:{shape:"circle",radius:6.5,color:n.portal,glow:1.1},post:{exposure:n.exposure,bloom:{strength:.4,radius:.62,threshold:.92},grade:{saturation:n.grade.saturation,contrast:n.grade.contrast,tint:n.grade.tint,shadowTint:n.grade.shadowTint,vignette:.34,grain:.025,aberration:0}},update:Et,dispose(){G.dispose?.(),Q.dispose?.(),y0.dispose()}}}};export{Vo as default};
