import*as c from"three";import{mergeGeometries as xt}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as Q,lerp as B,smoothstep as j}from"../kit/core.js";const M=6.6,S=60,G=-15,se=-60,ye=120,Se=6.5,at=7,Bt=["#f6d9a4","#b8c9b4","#56704e","#2a3a2a","#5a3423","#1b1410","#ffb347"],nt=`
float h21(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
vec2 h22(vec2 p){ float n=h21(p); return vec2(n,h21(p+n+17.1)); }
float vn(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x),mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x),f.y); }
float fbm(vec2 p){ float a=.5,s=0.; for(int i=0;i<4;i++){ s+=a*vn(p); p=p*2.03+vec2(17.,9.); a*=.5; } return s; }
vec3 voro(vec2 p,float jit){
  vec2 i=floor(p),f=fract(p),mg=vec2(0.),mr=vec2(0.); float md=8.;
  for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){ vec2 g=vec2(float(x),float(y)); vec2 r=g+.5+jit*(h22(i+g)-.5)-f; float d=dot(r,r); if(d<md){ md=d; mr=r; mg=g; } }
  float ed=8.;
  for(int y=-2;y<=2;y++)for(int x=-2;x<=2;x++){ vec2 g=mg+vec2(float(x),float(y)); vec2 r=g+.5+jit*(h22(i+g)-.5)-f; vec2 dr=r-mr; if(dot(dr,dr)>1e-5) ed=min(ed,dot(.5*(mr+r),normalize(dr))); }
  return vec3(ed,h21(i+mg),sqrt(md)); }
`,Ee=`
uniform vec4 uHole[3];      // z, theta (from up, toward +x), radius, phase
uniform vec3 uShaftDir, uSkyCol, uGold, uPortalCol, uEmber, uChar;
uniform vec4 uDims;         // axisY, mouthZ, portalZ, boreR
uniform float uTime, uPortalI, uShaftI, uEmberI, uBounce;
float holeSDF(vec3 p){
  float th=atan(p.x,p.y-uDims.x), d=1e3;
  for(int i=0;i<3;i++){ vec2 q=vec2(p.z-uHole[i].x,(th-uHole[i].y)*${at.toFixed(1)}); float a=atan(q.y,q.x), w=uHole[i].w;
    float r=uHole[i].z*(1.+.16*sin(3.*a+w)+.09*sin(7.*a+w*2.3)+.05*sin(13.*a+w*4.1)); d=min(d,length(q)-r); }
  return d; }
vec3 interiorLight(vec3 P,vec3 N){
  float depth=max(uDims.y-P.z,0.);
  vec3 tm=normalize(vec3(0.,uDims.x+2.,uDims.y+6.)-P);
  vec3 L=uSkyCol*(.95*exp(-depth/8.)+.14*exp(-depth/45.))*(.3+.7*max(dot(N,tm),0.));
  vec3 tp=vec3(0.,uDims.x,uDims.z)-P; float dp=length(tp);
  L+=uPortalCol*uPortalI*(1.0/(1.+dp*dp*.0055))*(.25+.75*max(dot(N,tp/dp),0.));
  for(int i=0;i<3;i++){
    float th=uHole[i].y; vec3 Hc=vec3(sin(th)*7.2,uDims.x+cos(th)*7.2,uHole[i].x);
    vec3 d=P-Hc; float t=dot(d,uShaftDir); float r=length(d-uShaftDir*t), rh=uHole[i].z*.85;
    float pool=smoothstep(rh*1.12,rh*.5,r)*smoothstep(1.,3.,t);
    L+=uGold*uShaftI*(3.4*pool*max(dot(N,-uShaftDir),0.)+.1*exp(-r*r/(rh*rh*5.))*smoothstep(0.,4.,t));
    L+=uSkyCol*.38*exp(-dot(d,d)/45.);
  }
  return L+uEmber*.03*(.6+.4*sin(uTime*.7+P.z*.35+P.x))+vec3(.04,.034,.028);
}
`,wt=`
  float fogK=1.;
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      fogK=exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
    #else
      fogK=1.-smoothstep(fogNear,fogFar,vFogDepth);
    #endif
  #endif
`;function Ke(){return{p:[],n:[],c:[],a:[],i:[],count:0}}function he(p,y,t,x,te,me,E,K,H,J,N){return p.p.push(y,t,x),p.n.push(te,me,E),p.c.push(K.r,K.g,K.b),p.a.push(H,J,N),p.count++}function Le(p,y){const t=new c.BufferGeometry;return t.setAttribute("position",new c.Float32BufferAttribute(p.p,3)),t.setAttribute("normal",new c.Float32BufferAttribute(p.n,3)),t.setAttribute("color",new c.Float32BufferAttribute(p.c,3)),t.setAttribute("aAux",new c.Float32BufferAttribute(p.a,3)),t.setIndex(p.i),y&&t.computeVertexNormals(),t}const Y=new c.Vector3,R=new c.Vector3,ne=new c.Vector3,L=new c.Vector3,He=new c.Color;function Ze(p,y,t,x,te,me=!0){const E=y.length,K=p.count;let H=0;R.set(.31,.83,.47);for(let N=0;N<E;N++){Y.subVectors(y[Math.min(E-1,N+1)],y[Math.max(0,N-1)]).normalize(),R.addScaledVector(Y,-R.dot(Y)).normalize(),ne.crossVectors(Y,R),N>0&&(H+=y[N].distanceTo(y[N-1]));const Z=N/(E-1);for(let A=0;A<=x;A++){const F=A/x*Math.PI*2,ve=Math.cos(F),ce=Math.sin(F),re=t(Z,F),ze=ve*R.x+ce*ne.x,oe=ve*R.y+ce*ne.y,Pe=ve*R.z+ce*ne.z,ke=te(Z,F,He,oe);he(p,y[N].x+ze*re,y[N].y+oe*re,y[N].z+Pe*re,ze,oe,Pe,He,H,F*Math.max(re,.15),ke)}}const J=x+1;for(let N=0;N<E-1;N++)for(let Z=0;Z<x;Z++){const A=K+N*J+Z,F=A+J;p.i.push(A,A+1,F,A+1,F+1,F)}if(me){const N=te(1,0,He,Y.y),Z=he(p,y[E-1].x+Y.x*.05,y[E-1].y+Y.y*.05,y[E-1].z+Y.z*.05,Y.x,Y.y,Y.z,He,H,0,N);for(let A=0;A<x;A++){const F=K+(E-1)*J+A;p.i.push(F,F+1,Z)}}}const X=(p,y,t,x=new c.Vector3)=>x.set(Math.sin(y)*p,M+Math.cos(y)*p,t);async function Tt(p,y={}){const t=p.rng.fork?p.rng.fork("fallen-giant"):p.rng,x=p.noise,te=y.palette&&y.palette.length>=7?y.palette:Bt,me=te.map(e=>new c.Color(e)),[E,K,H,J,N,Z,A]=me,F=new c.Group;F.name="fallen-giant";const ve=t.int(9,14),ce=t.int(5,8),re=t.range(0,6.28),ze=t.range(-.006,.006),oe=t.range(.75,1.15),Pe=t.range(-.02,.025),ke=t.int(15,20),rt=K.clone().lerp(E,t.range(.25,.8)),le=[15,35,55].map((e,o)=>({z:S-e+t.range(-1.5,1.5),th:[.2,-.85,.42][o]+.5*t.range(-.3,.12),r:t.range(2.1,2.9)*[1,1.1,1.15][o],ph:t.range(0,6.28)})),it=(e,o)=>e.r*(1+.16*Math.sin(3*o+e.ph)+.09*Math.sin(7*o+e.ph*2.3)+.05*Math.sin(13*o+e.ph*4.1)),pe=(e,o)=>{let a=1e3;for(const l of le){const u=e-l.z,r=(o-l.th)*at;a=Math.min(a,Math.hypot(u,r)-it(l,Math.atan2(r,u)))}return a},U=new c.Vector3().fromArray(y.shaftDir||[.18,-.77,.6]).normalize(),q={uHole:{value:le.map(e=>new c.Vector4(e.z,e.th,e.r,e.ph))},uShaftDir:{value:U},uSkyCol:{value:new c.Color(y.skyColor||te[0])},uGold:{value:A.clone().lerp(E,.25)},uPortalCol:{value:new c.Color(y.portalColor||te[6])},uEmber:{value:new c.Color("#ff8a3a")},uChar:{value:Z.clone()},uDims:{value:new c.Vector4(M,S,G,Se)},uTime:{value:0},uPortalI:{value:1},uShaftI:{value:y.shaft??1.4},uEmberI:{value:y.ember??1},uGlowI:{value:1},uBounce:{value:y.bounce??.4}},de=new c.MeshStandardMaterial({vertexColors:!0,roughness:.94,metalness:0});de.onBeforeCompile=e=>{Object.assign(e.uniforms,q),e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
attribute vec3 aAux; varying vec3 vAux; varying vec3 vObj;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vAux=aAux; vObj=position;`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vAux; varying vec3 vObj; float gHgt; float gEmber; float gFw;
`+nt+Ee).replace("#include <color_fragment>",`#include <color_fragment>
        if(holeSDF(vObj)<0.) discard;
        { float u=vAux.x, v=vAux.y, ch=max(vAux.z,0.), ms=max(-vAux.z,0.);
          float wp=vn(vec2(v*.4,u*.05));
          vec2 bp=vec2(v*1.05+wp*1.3,u*.095+.6*vn(vec2(v*.9,u*.03)));
          float fw=max(fwidth(bp.x),fwidth(bp.y)); gFw=fw;
          float a1=clamp(fw*2.4-.15,0.,1.), a2=clamp(fw*10.-.1,0.,1.);
          vec3 b1=voro(bp,.9), b2=voro(bp*vec2(3.1,2.3)+4.,.9);
          float p1=mix(smoothstep(.015,.12,b1.x),.84,a1), p2=mix(smoothstep(0.,.15,b2.x),.85,a2);
          float fib=mix(vn(vec2(v*17.,u*.9)),.5,clamp(fwidth(v)*17.-.2,0.,1.));
          float bark=p1*(.68+.32*p2), fur=bark*(.82+.36*b1.y);
          float mott=fbm(vObj.xz*1.3+vObj.y*.7);
          gHgt=mix(bark,mott*.6,ms*.8);
          vec3 bc=diffuseColor.rgb*mix(.3,1.12,fur)*mix(vec3(.82,.92,1.04),vec3(1.22,1.02,.86),fib);
          vec3 mc=diffuseColor.rgb*(.5+1.05*mott)*mix(mix(.62,1.,fur),1.,ms*ms);
          diffuseColor.rgb=mix(bc,mc,ms);
          float chm=smoothstep(.3,.7,ch+(fbm(vec2(v*.7,u*.3))-.5)*.45);
          vec3 cv=vec3(1.,.5,1.); if(ch>.02) cv=voro(vec2(v*2.7,u*1.5),.95);
          float fwc=1.-clamp(max(fwidth(v)*2.7,fwidth(u)*1.5)*4.-.3,0.,1.);                 // 1 near, 0 where a char plate is under ~3 pixels
          diffuseColor.rgb=mix(diffuseColor.rgb,uChar*(1.2+2.6*cv.y),chm);
          float crack=(1.-smoothstep(0.,.06,cv.x))*chm, halo_=pow(1.-smoothstep(0.,.3,cv.x),2.)*chm;
          diffuseColor.rgb*=1.-.75*crack;
          float patch_=smoothstep(.5,.78,fbm(vec2(v*.2,u*.2)+uTime*.015));
          gEmber=(crack+halo_*.3)*patch_*smoothstep(.42,.8,fbm(vec2(v,u)*.9+5.))*1.6*(.65+.35*sin(uTime*.8+cv.y*6.28))*smoothstep(.6,1.,ch);
          gHgt=mix(gHgt,mix(.5,cv.y*.5+smoothstep(0.,.12,cv.x)*.5,fwc),chm); }`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
        { vec3 sx=dFdx(-vViewPosition), sy=dFdy(-vViewPosition);
          vec3 r1=cross(sy,normal), r2=cross(normal,sx); float det=dot(sx,r1)*faceDirection;
          float k=.22/(1.+length(vViewPosition)*.05)*(1.-clamp(gFw*6.-.12,0.,.92));
          vec3 gr=sign(det)*(dFdx(gHgt*k)*r1+dFdy(gHgt*k)*r2);
          gr*=min(1.,abs(det)*1.1/max(length(gr),1e-9));                                      // never tilt past ~48 degrees: no sparkle of flipped normals
          vec3 nn=abs(det)*normal-gr; if(dot(nn,nn)>1e-12) normal=normalize(nn); }`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        totalEmissiveRadiance+=uEmber*gEmber*1.1*uEmberI;
        { // fog light bounced back onto the wood: strongest on faces turned up or toward the eye, so relief survives
          float bf=.45+.35*clamp(normal.y,0.,1.)+.4*pow(clamp(dot(normal,normalize(vViewPosition)),0.,1.),1.5);
          totalEmissiveRadiance+=diffuseColor.rgb*uSkyCol*(uBounce*bf); }`)},de.customProgramCacheKey=()=>"fallen-giant-wood";const Ne=N.clone().multiplyScalar(1.9).lerp(K,.05).offsetHSL(Pe,.05,0),Mt=Ne.clone().lerp(K,.2),yt=Ne.clone().lerp(A,.4),Ve=H.clone().lerp(K,.45).lerp(A,.15).multiplyScalar(1.2),St=J.clone().lerp(N,.4),qe=Z.clone().lerp(N,.6).multiplyScalar(1.5),ae=(e,o)=>{const a=S-e,l=a/ye,u=Math.cos(o),r=Math.sin(o);let i=B(8.5,6.5,l);const s=Math.exp(-a/6.5);i+=s*(1.5+.8*Math.sin(o*ce+re)+.4*Math.sin(o*(ce*2+1)+re*2));const n=o+a*ze+.25*x.n2(o*.8,a*.015);return i+=.34*Math.pow(.5+.5*Math.sin(n*ve),1.6),i+=.42*x.fbm3(u*1.3,r*1.3,e*.045,3)+.13*x.n3(u*5,r*5,e*.22),e>G-2&&(i=Math.max(i,7.05)),a>ye-9&&(i*=1-.22*j(ye-9,ye,a)),i},ge=Ke();{const a=new c.Color;for(let r=0;r<=136;r++){const i=r/136;for(let s=0;s<=96;s++){const n=-Math.PI+s/96*Math.PI*2;let h=B(S-1,se,i);if(r>132){const z=(r-132)/4;h-=z*(1.2+5.5*Math.pow(Math.abs(x.n2(n*2.1,3.3)),1.5)+1.5*Math.abs(x.n2(n*9,7.7)))}const f=ae(h,n),d=Math.cos(n),b=S-h,m=x.fbm3(Math.cos(n)*2.2,Math.sin(n)*2.2,h*.09,3),g=Q(j(.3,.85,d+.65*m)*oe,0,1),v=pe(h,n),w=Q(Math.max(j(2.6,.2,v),j(3.5,.5,b)*.6),0,1);a.copy(Ne).lerp(Mt,Q(.5+.9*x.n3(Math.cos(n)*3,Math.sin(n)*3,h*.05),0,1)*.6),a.lerp(St,j(0,-.8,d)*.55),a.lerp(H,g*.92).lerp(Ve,g*Q(.5+m*1.6,0,1)*.6),a.multiplyScalar(.85+.3*x.n3(Math.cos(n)*7,Math.sin(n)*7,h*.35)),he(ge,Math.sin(n)*f,M+Math.cos(n)*f,h,0,1,0,a,b,n*8,w>.08?w:-g)}(r&7)===7&&await p.yield()}await p.yield();const l=97;for(let r=0;r<136;r++)for(let i=0;i<96;i++){const s=r*l+i,n=s+l,h=B(S-1,se,(r+.5)/136),f=-Math.PI+(i+.5)/96*Math.PI*2;pe(h,f)<-.9||ge.i.push(s,s+1,n,s+1,n+1,n)}a.copy(yt).multiplyScalar(.55);const u=he(ge,0,M,se-.5,0,0,-1,a,ye,0,0);for(let r=0;r<96;r++){const i=136*l+r;ge.i.push(i,u,i+1)}}await p.yield();const st=Le(ge,!1);await p.yield(),st.computeVertexNormals(),await p.yield();const Ie=Ke();{const e=new c.Color,o=72,a=8;for(const l of[-1,1]){const u=Ie.count,r=l*7.3;for(let i=0;i<=o;i++)for(let s=0;s<=a;s++){const n=B(S-3,se+2,i/o),h=s/a,f=2.4+1.5*x.fbm2(n*.05+r,3.1,3)+.4*x.n2(n*.21,r),d=l*Math.acos(Q((f-M)/8.2,-1,1)),b=ae(n,d)-.25,m=Math.sin(d)*b,g=7.5+2.5*x.n2(n*.04,r+9),v=m+l*g*h,w=B(f,-1.1,Math.pow(j(0,1,h),.8))+(.9*x.fbm2(v*.16+3,n*.16,3)+.3*x.n2(v*.5,n*.5))*Math.sin(Math.min(1,h*1.6)*Math.PI*.5)*(h>0?1:0),z=Q(.55+.9*x.fbm2(v*.13,n*.13,3),0,1)*oe;e.copy(qe).lerp(J,.35).lerp(H,z*.8).lerp(Ve,z*z*.35).multiplyScalar(.7+.5*x.n2(v*.9,n*.9+5)*.5+.2),he(Ie,v,w,n,0,1,0,e,n*.3,v*2.2,-1)}for(let i=0;i<o;i++)for(let s=0;s<a;s++){const n=u+i*(a+1)+s,h=n+a+1;Ie.i.push(n,n+1,h,n+1,h+1,h)}}}await p.yield();const zt=Le(Ie,!0);await p.yield();const ct=new c.Mesh(xt([st,zt],!1),de);ct.name="trunk",F.add(ct),await p.yield();const lt=N.clone().multiplyScalar(2.5).lerp(K,.14),Pt=Z.clone().lerp(N,.22),Re=[];for(let e=0;e<ke;e++)Re.push({ang:(e+t.range(-.32,.32))/ke*Math.PI*2,len:t.range(4.3,6.8)*(t.chance(.16)?1.25:1),r0:t.range(.75,1.3),curl:t.range(-.55,.55),zb:t.range(-1.2,2.6),zf:t.range(-1.5,2.2),ph:t.range(0,6.28),str:t.range(.6,1.2)});const ft=(e,o)=>{let a=e-o;return a-=Math.round(a/(Math.PI*2))*Math.PI*2,a},kt=e=>{let o=0;for(const a of Re){const l=ft(e,a.ang)/.15;o=Math.max(o,a.str*Math.exp(-l*l))}return o},ut=e=>6.56+.55*Math.abs(x.n2(e*3.1,1.7))+.22*Math.abs(x.n2(e*11,4.2)),Ue=Ke();{const o=new c.Color,a=10;for(let l=0;l<=132;l++){const u=-Math.PI+l/132*Math.PI*2,r=kt(u),i=ut(u),s=10.2+1.9*r+.7*x.n2(u*2.3,8.8)+.3*x.n2(u*9,2.2),n=ae(S-2.6,u)-.15,h=[[i,-.4],[i+.04,.8],[i+.5,1.6],[B(i,s,.38),2.3],[B(i,s,.62),2.05],[B(i,s,.86),1.25],[s,.2],[s-.35,-1],[B(s,n,.55),-1.9],[n,-2.6]];for(let f=0;f<a;f++){let[d,b]=h[f];const m=Math.sin(f/(a-1)*Math.PI),g=Math.cos(u),v=Math.sin(u),w=x.fbm3(g*d*.35,v*d*.35,f*.6,3);f>=2&&f<=7&&(b+=.95*r*j(1,4,f)*(f<=6?1:.4)+.75*w*m,d+=.3*x.n3(g*d*.8,v*d*.8,f)*(f>=3?1:0));const z=f<=2?1:f===3?.72:f===4?.3:0,V=j(4.5,6.5,f)*(.55+.45*x.n2(u*4,f));o.copy(lt).lerp(Ne,.35+.3*w).lerp(qe,V*.8);const P=g*(f>=5?1:.3),k=Q(j(.45,.9,P+.3*w),0,1)*.45*oe;o.lerp(H,k).multiplyScalar((.8+.35*w)*(f>=2&&f<=6?.55+.55*r:1)),he(Ue,v*d,M+g*d,S+b,0,0,1,o,d*1.1,u*8.5,z>0?z:-Math.max(V*.7,k))}}for(let l=0;l<132;l++)for(let u=0;u<a-1;u++){const r=l*a+u,i=r+a;Ue.i.push(r,i,r+1,r+1,i,i+1)}}const be=Ke(),Fe=[],$e=e=>{const o=e.x,a=e.y-M,l=Math.hypot(o,a);return l<7.35&&l>.001&&(e.x=o/l*7.35,e.y=M+a/l*7.35),e},_e=(e,o=1)=>(a,l,u,r)=>(u.copy(lt).lerp(Pt,j(.25,-.7,r)*.65).lerp(Ve,Q(j(.45,.9,r)*.45*oe*(1-a*.5),0,1)),u.multiplyScalar((.82+.3*Math.sin(l*2+a*9))*o),e(a)),Qe=[];for(const e of Re){const o=[];for(let l=0;l<=18;l++){const u=l/18,r=7.7+e.len*u,i=e.ang+e.curl*u*u+.1*Math.sin(u*5+e.ph)*u,s=X(r,i,S+1.3+e.zb*Math.sin(u*2.4)+e.zf*u*u+.3*Math.sin(u*9+e.ph));s.y-=1.4*u*u*Math.abs(Math.sin(i)),o.push($e(s))}Qe.push(o),Fe.push(o[18].clone()),Ze(be,o,(l,u)=>e.r0*(Math.pow(1-l,.75)*(1+.16*Math.sin(u*3+e.ph)+.22*Math.sin(l*17+e.ph))+.07),9,_e(l=>j(.42,.05,l)*.95))}await p.yield();const Ye=(e,o,a,l,u,r,i,s,n=1)=>{const h=Q(Math.floor(o*(e.length-1)),1,e.length-2),f=e[h].clone(),d=new c.Vector3().subVectors(e[h+1],e[h-1]).normalize(),b=new c.Vector3(t.gauss(),t.gauss(),t.gauss()*.7).normalize();d.addScaledVector(b,i).normalize();const m=[f.clone()],g=t.range(0,6.28);for(let v=1;v<=r;v++)d.x+=.22*Math.sin(g+v*1.3)*(1-s),d.z+=.18*Math.cos(g*1.7+v*1.1)*(1-s),d.y-=s*.45,d.normalize(),f.addScaledVector(d,a/r),m.push($e(f.clone()));return Ze(be,m,(v,w)=>l*(Math.pow(1-v,.8)+.06)*(1+.15*Math.sin(w*2+g)),u,_e(()=>e[h].z>S-1&&e[h].distanceTo(L.set(0,M,e[h].z))<9.5?.6:0,n)),m},ht=[];{let e=0;for(const o of Qe){const a=t.int(4,7);for(let l=0;l<a;l++)ht.push(Ye(o,t.range(.22,.85),t.range(2.4,5.2),t.range(.22,.46),6,8,t.range(.5,1.2),.12));(++e&3)===0&&await p.yield()}}await p.yield();for(let e=0;e<190;e++){const o=t.chance(.45)?t.pick(Qe):t.pick(ht);(e&31)===31&&await p.yield(),Ye(o,t.range(.15,.95),t.range(.9,3.6),t.range(.11,.18),4,5,.8,t.range(.55,.9),.5)}await p.yield();for(let e=0;e<14;e++){const o=t.range(0,6.28),a=t.range(.35,.95)*t.sign(),l=t.range(8.6,11.6),u=l+t.range(-1,1.6),r=S+t.range(.6,2.6),i=t.range(0,6.28),s=t.range(.2,.42),n=[];for(let h=0;h<=10;h++){const f=h/10;n.push($e(X(B(l,u,f)+.5*Math.sin(f*Math.PI),o+a*f,r+.8*Math.sin(f*6+i))))}Ze(be,n,(h,f)=>s*(.55+.45*Math.sin(h*Math.PI))*(1+.15*Math.sin(f*3+i)),6,_e(()=>.15))}{const e=t.int(5,9);for(let o=0;o<e;o++){const a=t.range(se+8,S-18),l=t.range(-1.5,1.5);if(pe(a,l)<3.5)continue;const u=ae(a,l)-.6,r=t.range(3,7.5),i=t.range(.22,.42),s=t.range(-.9,.3),n=t.range(0,6.28),h=t.range(-.6,.6),f=[];for(let b=0;b<=10;b++){const m=b/10;f.push(X(u+r*m,l+h*m*m*.2+.03*Math.sin(m*7+n),a+s*r*m+.25*Math.sin(m*9+n*2)))}Ze(be,f,(b,m)=>i*(Math.pow(1-b,.6)*(1+.15*Math.sin(m*3+n)+.12*Math.sin(b*23+n))+.08)*(1+.6*Math.exp(-b*8)),7,_e(()=>0));const d=t.int(2,4);for(let b=0;b<d;b++)Ye(f,t.range(.3,.85),t.range(1.2,3.2),i*t.range(.35,.6),5,6,t.range(.5,.9),.04)}}await p.yield();const mt=new c.Mesh(xt([Le(Ue,!0),Le(be,!1)],!1),de);mt.name="root-wheel",F.add(mt),await p.yield();const ie=(e,o)=>{const a=Math.cos(o),l=Math.sin(o);let u=Se+.32*Math.abs(x.n3(a*2.4,l*2.4,e*.16))+.45*Math.pow(Math.abs(x.n3(a*.9+4,l*.9,e*.05)),1.3);u=Math.min(u,ae(e,o)-.35);const r=-a;return r>.5&&(u=Math.min(u,(6.3-.07*(.5+.5*x.n2(l*3,e*.5)))/r)),Math.max(u,6.22)},D={p:[],s:[],k:[],i:[],count:0},xe=(e,o,a,l,u,r)=>(D.p.push(e,o,a),D.s.push(l,u),D.k.push(r),D.count++);{const a=S+.85,l=G-2.4,u=73;for(let r=0;r<=104;r++)for(let i=0;i<=72;i++){const s=B(a,l,r/104),n=i/72*Math.PI*2,h=s>S?Math.max(ie(s,n),ut(n>Math.PI?n-Math.PI*2:n)-.02):ie(s,n);xe(Math.sin(n)*h,M+Math.cos(n)*h,s,n*Se,s,0)}for(let r=0;r<104;r++)for(let i=0;i<72;i++){const s=r*u+i,n=s+u,h=B(a,l,(r+.5)/104);let f=(i+.5)/72*Math.PI*2;f>Math.PI&&(f-=Math.PI*2),!(pe(h,f)<-.9)&&D.i.push(s,n,s+1,s+1,n,n+1)}for(const r of le){const i=D.count,s=44,n=3;for(let h=0;h<=s;h++){const f=h/s*Math.PI*2,d=it(r,f),b=r.z+Math.cos(f)*d,m=r.th+Math.sin(f)*d/at,g=ie(b,m)-.03,v=ae(b,m)+.04;for(let w=0;w<=n;w++){const z=w/n,V=B(g,v,z);xe(Math.sin(m)*V,M+Math.cos(m)*V,b,f*r.r,z*(v-g),1)}}for(let h=0;h<s;h++)for(let f=0;f<n;f++){const d=i+h*(n+1)+f,b=d+n+1;D.i.push(d,b,d+1,d+1,b,b+1)}}{const r=D.count,i=36,s=6;for(let n=0;n<=s;n++)for(let h=0;h<=i;h++){const f=h/i*Math.PI*2,d=n/s*7.4,b=Math.sin(f)*d,m=Math.cos(f)*d;xe(b,M+m,G-1.9-1.6*(1-(d/7.4)**2)+.35*x.n2(b*.4,m*.4),b,m,3)}for(let n=0;n<s;n++)for(let h=0;h<i;h++){const f=r+n*(i+1)+h,d=f+i+1;D.i.push(f,f+1,d,f+1,d+1,d)}}{const r=D.count,i=72;for(let s=0;s<=i;s++){const n=s/i*Math.PI*2,h=Math.sin(n),f=Math.cos(n);xe(h*6.02,M+f*6.02,G-.35,n*6.2,0,2),xe(h*6.6,M+f*6.6,G-.5,n*6.2,1,2)}for(let s=0;s<i;s++){const n=r+s*2;D.i.push(n,n+1,n+2,n+1,n+3,n+2)}}}await p.yield();const fe=new c.BufferGeometry;fe.setAttribute("position",new c.Float32BufferAttribute(D.p,3)),fe.setAttribute("aS",new c.Float32BufferAttribute(D.s,2)),fe.setAttribute("aKind",new c.Float32BufferAttribute(D.k,1)),fe.setIndex(D.i),fe.computeVertexNormals();const Ae=()=>c.UniformsUtils.clone(c.UniformsLib.fog),We="vec3 camObj=(inverse(modelMatrix)*vec4(cameraPosition,1.)).xyz; vView=camObj-position;",Nt=new c.ShaderMaterial({fog:!0,side:c.DoubleSide,uniforms:Object.assign(Ae(),q,{uDuff:{value:qe.clone().lerp(J,.55)},uMossC:{value:H.clone().lerp(K,.15)}}),vertexShader:`
      attribute vec2 aS; attribute float aKind; varying vec2 vS; varying float vKind; varying vec3 vObj, vN, vView;
      #include <fog_pars_vertex>
      void main(){ vS=aS; vKind=aKind; vObj=position; vN=normal; ${We}
        vec4 mvPosition=modelViewMatrix*vec4(position,1.); gl_Position=projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec2 vS; varying float vKind; varying vec3 vObj, vN, vView;
      uniform vec3 uDuff, uMossC;
      #include <fog_pars_fragment>
      ${nt}${Ee}
      void main(){
        if(vKind<.5 && holeSDF(vObj)<0.) discard;
        vec3 N=normalize(vN); if(!gl_FrontFacing) N=-N;
        vec3 V=normalize(vView), col;
        if(vKind>1.5 && vKind<2.5){
          float f=fbm(vec2(vS.x*1.3,uTime*.3));
          col=uPortalCol*(1.5+4.5*f)*uPortalI*smoothstep(1.,.1,vS.y);
        } else {
          // cracked charcoal: long checks along the grain (cB), alligator plates (c1), fine crazing (c2). The faces are
          // charcoal with a cool sheen; the orange lives only in the cracks.
          vec2 cs=vS*vec2(5.,2.5);
          vec3 cB=voro(vS*vec2(1.05,.3)+3.,.9), c1=voro(cs,.95), c2=voro(vS*vec2(14.,8.)+7.,.85);
          float px=max(fwidth(cs.x),fwidth(cs.y)), aa=clamp(px*2.6-.25,0.,1.), aa2=clamp(px*7.-.25,0.,1.), pxB=max(fwidth(vS.x)*1.05,fwidth(vS.y)*.3);
          float ckB=1.-smoothstep(0.,.03+pxB*.8,cB.x);
          float ck1=(1.-smoothstep(0.,.055+px*.5,c1.x))*(1.-.75*aa), ck2=(1.-smoothstep(0.,.08,c2.x))*(1.-aa2);
          float crack=max(ckB,max(ck1,.5*ck2));
          float grit=fbm(vS*4.7), grit2=fbm(vS*vec2(19.,6.)+11.);
          float hgt=smoothstep(0.,.25,cB.x)*.9+smoothstep(0.,.22,c1.x)*.5*(1.-.7*aa)+smoothstep(0.,.2,c2.x)*.2*(1.-aa2)+grit*.45+grit2*.12*(1.-aa2)+c1.y*.16*(1.-aa);
          vec3 Nb;
          { vec3 sx=dFdx(vObj), sy=dFdy(vObj), r1=cross(sy,N), r2=cross(N,sx); float det=dot(sx,r1);
            float bk=.2*(1.-.6*aa); vec3 gr=sign(det)*(dFdx(hgt*bk)*r1+dFdy(hgt*bk)*r2); gr*=min(1.,abs(det)*1.1/max(length(gr),1e-9)); vec3 nn=abs(det)*N-gr; Nb=dot(nn,nn)>1e-14?normalize(nn):N; }
          vec3 alb=mix(vec3(.038,.027,.02),vec3(.11,.076,.052),mix(c1.y,.5,aa))*(.7+.9*grit)*(.8+.4*mix(c2.y,.5,aa2))*(.85+.3*cB.y);
          alb*=1.-.85*crack;
          float down=-(vObj.y-uDims.x)/max(length(vec2(vObj.x,vObj.y-uDims.x)),1e-3);
          float fn=fbm(vObj.xz*.45), fl=vKind<.5?smoothstep(.78,.9,down+(fn-.5)*.16):0.;
          vec3 fa=mix(uDuff,uMossC,smoothstep(.35,.7,fbm(vObj.xz*.9+3.)))*(.55+.9*fn);
          alb=mix(alb,fa,fl); crack*=1.-fl; ck1*=1.-fl; ckB*=1.-fl; ck2*=1.-fl; Nb=normalize(mix(Nb,N+vec3(fn-.5,0.,fbm(vObj.zx*.6)-.5)*.5,fl));
          vec3 L=interiorLight(vObj,Nb);
          float gl=1.-fl;
          L+=gl*mix(uSkyCol,vec3(.55,.66,.8),.6)*(.75+.25*Nb.y)*(.22+.30*exp(-max(uDims.y-vObj.z,0.)/9.));                // dim cool ambient: black charcoal, never pure black
          col=alb*L;
          if(vKind<.5) col*=.25+.75*smoothstep(0.,.6,holeSDF(vObj));
          float fres=pow(clamp(1.-dot(Nb,V),0.,1.),3.);
          vec3 R=reflect(-V,Nb), tp=vec3(0.,uDims.x,uDims.z)-vObj, tm=vec3(0.,uDims.x,uDims.y+4.)-vObj;
          float dp=length(tp), dm=length(tm), shine=(1.-.8*crack)*(.5+grit);
          col+=gl*shine*uPortalCol*uPortalI*pow(max(dot(R,tp/dp),0.),9.)*(.2/(1.+dp*dp*.004));
          col+=gl*shine*mix(uSkyCol,vec3(.6,.72,.9),.5)*(pow(max(dot(R,tm/dm),0.),9.)*(.22/(1.+dm*dm*.003))+.028*fres);
          float pat=smoothstep(.46,.74,fbm(vS*.16+vec2(uTime*.02,uTime*.05)));
          float hot=smoothstep(.45,.82,fbm(vS*.85+vec2(3.,uTime*.06)))*pat;
          float wave=.6+.4*sin(uTime*1.3+vS.y*.7+cB.y*6.28), tw=.65+.35*sin(uTime*2.1+c1.y*40.);
          col+=uEmberI*gl*uEmber*((ckB*(.035+1.7*hot)+pow(1.-smoothstep(0.,.12,cB.x),2.)*.16*hot)*wave+(ck1*1.1+ck2*.4)*hot*hot*tw);
          if(vKind>.5&&vKind<1.5) col+=alb*(uGold*2.5*uShaftI*max(dot(Nb,-uShaftDir),0.)+uSkyCol*.25);
          if(vKind>2.5) col*=.3;
        }
        gl_FragColor=vec4(col,1.);
        #include <fog_fragment>
      }`}),vt=new c.Mesh(fe,Nt);vt.name="bore",F.add(vt),de.side=c.DoubleSide,await p.yield();const ue=[],Ce=new c.Vector3(0,1,0),Xe=(e,o)=>{const a=Math.PI+o;return{p:X(ie(e,a)-.06,a,e),up:new c.Vector3(-Math.sin(a),-Math.cos(a),0).lerp(Ce,.6).normalize()}},je=le.map(e=>{const o=X(6.9,e.th,e.z);for(let a=0;a<40;a+=.25){L.copy(o).addScaledVector(U,a);const l=Math.atan2(L.x,L.y-M);if(a>2&&Math.hypot(L.x,L.y-M)>=ie(L.z,l)-.1)break}return{start:o,end:L.clone(),len:L.distanceTo(o)}});for(let e=0;e<64;e++){const o=t.range(.12,.8)*t.sign(),a=t.range(G+1.5,S+.4),l=Xe(a,o);ue.push({...l,s:B(.5,1.25,j(.2,.7,Math.abs(o)))*t.range(.8,1.2),inside:1})}for(const e of je)for(let o=0;o<9;o++){const a=Math.atan2(e.end.x,e.end.y-M),l=Q(ft(a,Math.PI)+t.range(-.35,.35),-.85,.85),u=Xe(e.end.z+t.range(-3,3),l);ue.push({...u,s:t.range(.6,1)*(Math.abs(l)<.25?.75:1.2),inside:1})}for(let e=0;e<12;e++){const o=e&1?1:-1,a=Xe(G+1.5+(e>>1)*4.2+t.range(-1,1),o*t.range(.55,.95));ue.push({...a,s:t.range(1.25,1.75),inside:1})}const Vt=(e,o,a)=>{const l=e*7.3,u=2.4+1.5*x.fbm2(o*.05+l,3.1,3)+.4*x.n2(o*.21,l),r=e*Math.acos(Q((u-M)/8.2,-1,1)),i=Math.sin(r)*(ae(o,r)-.25),s=7.5+2.5*x.n2(o*.04,l+9),n=i+e*s*a;return new c.Vector3(n,B(u,-1.1,Math.pow(j(0,1,a),.8))+.9*x.fbm2(n*.16+3,o*.16,3)*Math.sin(Math.min(1,a*1.6)*Math.PI*.5)-.05,o)};for(let e=0;e<120;e++){const o=t.sign(),a=Vt(o,t.range(se+4,S-4),t.range(.05,.7));ue.push({p:a,up:new c.Vector3(o*.35,1,0).normalize(),s:t.range(1.1,2.2),inside:0})}for(let e=0;e<26;e++){const o=t.range(se+5,S-5),a=t.range(-.75,.75);pe(o,a)<1.6||ue.push({p:X(ae(o,a)-.1,a,o),up:new c.Vector3(Math.sin(a)*.5,1,0).normalize(),s:t.range(.6,1.1),inside:0})}const Je=new c.MeshLambertMaterial({vertexColors:!0,side:c.DoubleSide});{const e=[],o=[],a=[],l=[],u=[];let r=0;const i=new c.Quaternion,s=new c.Vector3,n=new c.Color,h=Ve.clone().lerp(A,.25),f=5;let d=0;for(const g of ue){(++d&63)===0&&await p.yield(),i.setFromUnitVectors(Ce,g.up);const v=t.int(6,9),w=t.range(0,6.28),z=t.range(0,6.28);for(let V=0;V<v;V++){const P=w+V/v*6.28+t.range(-.3,.3),k=g.s*t.range(.8,1.3),W=t.range(.55,1.15),_=Math.cos(P),O=Math.sin(P),T=k*.2,ee=t.range(.7,1.15),we=t.chance(.12)?.5:0;for(let $=0;$<=f;$++){const C=$/f,Me=k*.85*Math.sin(C*1.45),Ge=k*(.95*C-.62*C*C)*W;for(const ot of[-1,1])s.set(_*Me-O*T*ot,Ge+.03,O*Me+_*T*ot).applyQuaternion(i).add(g.p),e.push(s.x,s.y,s.z),s.set(-_*.5,1,-O*.5).normalize().applyQuaternion(i),o.push(s.x,s.y,s.z),n.copy(H).lerp(h,C*.8).lerp(A,we*C).multiplyScalar(ee*(.55+.6*C)),a.push(n.r,n.g,n.b),l.push(ot,C,z+V,g.inside)}for(let $=0;$<f;$++){const C=r+$*2;u.push(C,C+1,C+2,C+1,C+3,C+2)}r+=(f+1)*2}}const b=new c.BufferGeometry;b.setAttribute("position",new c.Float32BufferAttribute(e,3)),b.setAttribute("normal",new c.Float32BufferAttribute(o,3)),b.setAttribute("color",new c.Float32BufferAttribute(a,3)),b.setAttribute("aF",new c.Float32BufferAttribute(l,4)),b.setIndex(u),Je.onBeforeCompile=g=>{Object.assign(g.uniforms,q),g.vertexShader=g.vertexShader.replace("#include <common>",`#include <common>
attribute vec4 aF; varying vec4 vF; varying vec3 vObj; uniform float uTime;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vF=aF; { float w=aF.y*aF.y*.16; transformed+=vec3(sin(uTime*1.1+aF.z),.4*sin(uTime*1.7+aF.z*1.3),cos(uTime*.9+aF.z*1.7))*w; } vObj=transformed;`),g.fragmentShader=g.fragmentShader.replace("#include <common>",`#include <common>
varying vec4 vF; varying vec3 vObj;
`+Ee).replace("#include <color_fragment>",`#include <color_fragment>
          { float t=clamp(vF.y,0.,1.), x=abs(vF.x); float env=sin(pow(t,.75)*3.14159)*.92+.08;
            float pin=abs(fract(t*12.)-.5)*2.; if(x>max(env*(.2+.8*smoothstep(1.,.15,pin)),.09)) discard;
            diffuseColor.rgb*=.75+.5*(1.-x); }`).replace("#include <opaque_fragment>",`outgoingLight=mix(outgoingLight,diffuseColor.rgb*interiorLight(vObj,vec3(0.,1.,0.))*2.4,vF.w);
#include <opaque_fragment>`)},Je.customProgramCacheKey=()=>"fallen-giant-fern";const m=new c.Mesh(b,Je);m.name="ferns",F.add(m)}await p.yield();const pt=[];{const e=[],o=[],a=[],l=[];let u=0;const r=new c.Quaternion,i=new c.Vector3,s=new c.Vector3,n=(m,g,v,w,z)=>{r.setFromUnitVectors(Ce,g);const V=[[.3*v+.02,0,0,.1],[.2*v+.015,w*.6,0,.35],[.22*v+.015,w,0,.6],[v,w+.04*v,1,.75],[.92*v,w+.3*v,1,1],[.55*v,w+.52*v,1,1]],P=7,k=u;for(const[_,O,T,ee]of V)for(let we=0;we<P;we++){const $=we/P*6.283,C=Math.cos($),Me=Math.sin($),Ge=_*(T?1+.08*Math.sin($*3+z):1);i.set(C*Ge,O,Me*Ge).applyQuaternion(r).add(m),e.push(i.x,i.y,i.z),s.set(C,T?.6:0,Me).normalize().applyQuaternion(r),o.push(s.x,s.y,s.z),a.push(ee,z,T),u++}i.set(0,w+.6*v,0).applyQuaternion(r).add(m),e.push(i.x,i.y,i.z),s.copy(g),o.push(s.x,s.y,s.z),a.push(1,z,1);const W=u++;for(let _=0;_<V.length-1;_++)for(let O=0;O<P;O++){const T=k+_*P+O,ee=k+_*P+(O+1)%P;l.push(T,T+P,ee,ee,T+P,ee+P)}for(let _=0;_<P;_++)l.push(k+5*P+_,W,k+5*P+(_+1)%P)},h=(m,g,v,w,z)=>{pt.push(m.clone().addScaledVector(g,.5));const V=new c.Vector3().crossVectors(g,new c.Vector3(0,0,1)).normalize(),P=new c.Vector3().crossVectors(g,V);for(let k=0;k<w;k++){const W=t.range(.08,.2)*z*(k===0?1.5:1),_=t.gauss()*v,O=t.gauss()*v,T=m.clone().addScaledVector(V,_).addScaledVector(P,O),ee=g.clone().lerp(Ce,.55).add(i.set(t.gauss(),0,t.gauss()).multiplyScalar(.18)).normalize();n(T,ee,W,W*t.range(1.2,2.6),t.range(0,6.28))}};for(let m=0;m<26;m++){const g=t.range(.3,1.15)*t.sign(),v=t.range(G+1,S-1),w=Math.PI+g,z=ie(v,w);h(X(z-.02,w,v),new c.Vector3(-Math.sin(w),-Math.cos(w),0),.45,t.int(5,10),1),(m&7)===7&&await p.yield()}await p.yield();for(let m=0;m<12;m++){const g=(m&1?1:-1)*t.range(.75,1.3),v=G+1+(m>>1)*4.3+t.range(-1.2,1.2),w=Math.PI+g,z=ie(v,w);h(X(z-.02,w,v),new c.Vector3(-Math.sin(w),-Math.cos(w),0),.5,t.int(6,11),1.25)}for(let m=0;m<9;m++){const g=t.range(1.75,2.75)*t.sign(),v=t.range(7,8.4);h(X(v,g,S+B(1.6,2.6,j(6.8,8.4,v))),new c.Vector3(Math.sin(g)*-.3,.3,1).normalize(),.4,t.int(4,8),1.1)}const f=new c.BufferGeometry;f.setAttribute("position",new c.Float32BufferAttribute(e,3)),f.setAttribute("normal",new c.Float32BufferAttribute(o,3)),f.setAttribute("aM",new c.Float32BufferAttribute(a,3)),f.setIndex(l);const d=new c.ShaderMaterial({fog:!0,uniforms:Object.assign(Ae(),q,{uTint:{value:rt}}),vertexShader:`attribute vec3 aM; varying vec3 vM, vN, vView, vObj;
        #include <fog_pars_vertex>
        void main(){ vM=aM; vN=normal; vObj=position; ${We}
          vec4 mvPosition=modelViewMatrix*vec4(position,1.); gl_Position=projectionMatrix*mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`varying vec3 vM, vN, vView, vObj; uniform vec3 uTint; uniform float uGlowI;
        #include <fog_pars_fragment>
        ${Ee}
        void main(){ vec3 N=normalize(vN), V=normalize(vView);
          float pulse=.75+.25*sin(uTime*.6+vM.y), rim=pow(clamp(1.-abs(dot(N,V)),0.,1.),2.);
          vec3 col=uTint*(.22*interiorLight(vObj,N)+vec3(.05));
          col+=uTint*vec3(.92,1.,.8)*uGlowI*pulse*vM.x*vM.x*(.34+.5*rim+.26*vM.z);
          gl_FragColor=vec4(col,1.);
          #include <fog_fragment>
        }`}),b=new c.Mesh(f,d);b.name="mushrooms",F.add(b)}await p.yield();{const e=[],o=[],a=[],l=[];let u=0;const r=22,i=8;le.forEach((f,d)=>{const b=je[d],m=b.start.clone().addScaledVector(U,-.6),g=b.len+1.2;R.set(1,0,0).addScaledVector(U,-U.x).normalize(),ne.crossVectors(U,R);for(const v of[1,.55]){const w=u;for(let z=0;z<=i;z++)for(let V=0;V<=r;V++){const P=z/i,k=V/r*6.2832,W=f.r*.85*v*(1+.12*P),_=Math.cos(k)*R.x+Math.sin(k)*ne.x,O=Math.cos(k)*R.y+Math.sin(k)*ne.y,T=Math.cos(k)*R.z+Math.sin(k)*ne.z;e.push(m.x+U.x*g*P+_*W,m.y+U.y*g*P+O*W,m.z+U.z*g*P+T*W),o.push(_,O,T),a.push(P,v+(d?2:0),d+k),u++}for(let z=0;z<i;z++)for(let V=0;V<r;V++){const P=w+z*(r+1)+V,k=P+r+1;l.push(P,P+1,k,P+1,k+1,k)}}});const s=new c.BufferGeometry;s.setAttribute("position",new c.Float32BufferAttribute(e,3)),s.setAttribute("normal",new c.Float32BufferAttribute(o,3)),s.setAttribute("aSh",new c.Float32BufferAttribute(a,3)),s.setIndex(l);const n=new c.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,blending:c.AdditiveBlending,side:c.DoubleSide,uniforms:Object.assign(Ae(),q),vertexShader:`attribute vec3 aSh; varying vec3 vSh, vN, vView, vObj;
        #include <fog_pars_vertex>
        void main(){ vSh=aSh; vN=normal; vObj=position; ${We}
          vec4 mvPosition=modelViewMatrix*vec4(position,1.); gl_Position=projectionMatrix*mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`varying vec3 vSh, vN, vView, vObj; uniform vec3 uGold; uniform float uTime, uShaftI;
        #include <fog_pars_fragment>
        ${nt}
        void main(){ float nv=abs(dot(normalize(vN),normalize(vView)));
          float a=pow(clamp(nv,0.,1.),1.8)*smoothstep(0.,.1,vSh.x)*smoothstep(1.,.72,vSh.x);
          float f=fbm(vec2(vSh.z*2.2+vObj.x*.25,vSh.x*2.5-uTime*.17))*fbm(vObj.xz*.3+vec2(uTime*.11,uTime*.05)+3.);
          a*=.35+2.6*f; float deep=step(2.,vSh.y), sh=vSh.y-2.*deep; a*=mix(.55,1.,sh<.8?1.:0.)*smoothstep(4.,18.,length(vView));   // three beams of one kind; they thin out within 18 m of the lens, so none floods the frame
          ${wt}
          gl_FragColor=vec4(uGold*uShaftI*a*.3*fogK,1.); }`}),h=new c.Mesh(s,n);h.name="skylight-shafts",h.renderOrder=3,F.add(h)}const dt=Object.assign(Ae(),q,{uVh:{value:720},uTint:{value:rt}});{const e=[],o=[];for(const r of pt)e.push(r.x,r.y,r.z),o.push(t.range(2.2,3.4),t.range(0,1),0,0);for(let r=0;r<1500;r++){if(r<700){const i=t.pick(je),s=t.range(0,i.len),n=t.range(0,6.28),h=Math.sqrt(t())*2.6;L.copy(i.start).addScaledVector(U,s),e.push(L.x+Math.cos(n)*h,L.y+t.range(-1,1),L.z+Math.sin(n)*h)}else{const i=t.range(0,6.28),s=Math.sqrt(t())*5.6;e.push(Math.sin(i)*s,M+Math.cos(i)*s,t.range(G,S+8))}o.push(t.range(.035,.09),t.range(0,1),1,0)}const a=new c.BufferGeometry;a.setAttribute("position",new c.Float32BufferAttribute(e,3)),a.setAttribute("aP",new c.Float32BufferAttribute(o,4)),a.boundingSphere=new c.Sphere(new c.Vector3(0,M,25),50);const l=new c.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,blending:c.AdditiveBlending,uniforms:dt,vertexShader:`attribute vec4 aP; uniform float uVh; varying vec3 vCol; varying float vKind;
        uniform vec4 uHole[3]; uniform vec3 uShaftDir, uGold, uSkyCol, uTint; uniform vec4 uDims; uniform float uTime, uShaftI, uGlowI;
        #include <fog_pars_vertex>
        void main(){ vec3 p=position; vKind=aP.z; float px=aP.x;
          if(aP.z>.5){ float t=uTime, h=aP.y;
            p+=vec3(sin(t*.21+h*61.),sin(t*.17+h*93.)*.7,cos(t*.19+h*41.))*.9;
            float lit=0.;
            for(int i=0;i<3;i++){ float th=uHole[i].y; vec3 Hc=vec3(sin(th)*7.2,uDims.x+cos(th)*7.2,uHole[i].x); vec3 d=p-Hc; float tt=dot(d,uShaftDir); float r=length(d-uShaftDir*tt), rh=uHole[i].z*.85; lit+=smoothstep(rh,rh*.7,r)*step(0.,tt); }
            vCol=uGold*uShaftI*lit*(1.2+2.5*fract(h*7.7))+uSkyCol*.12*exp(-max(uDims.y-p.z,0.)/9.);
          } else vCol=uTint*uGlowI*.07*(.8+.2*sin(uTime*.6+aP.y*6.28));
          vec4 mvPosition=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mvPosition;
          float sz=px*projectionMatrix[1][1]*uVh*.5/max(-mvPosition.z,.2);
          if(aP.z>.5){ vCol*=min(sz*sz,1.); sz=max(sz,1.); }
          gl_PointSize=min(sz,260.);
          #include <fog_vertex>
        }`,fragmentShader:`varying vec3 vCol; varying float vKind;
        #include <fog_pars_fragment>
        void main(){ float d=length(gl_PointCoord-.5)*2.; if(d>1.) discard;
          float a=vKind>.5?smoothstep(1.,.3,d):pow(clamp(1.-d,0.,1.),2.4);
          ${wt}
          gl_FragColor=vec4(vCol*a*fogK,1.); }`}),u=new c.Points(a,l);u.name="motes-and-halos",u.renderOrder=4,F.add(u)}let Be=Fe[0];for(const e of Fe)e.y-Math.abs(e.x)*.3>Be.y-Math.abs(Be.x)*.3&&(Be=e);let et=0;for(const e of Fe)et=Math.max(et,e.y);const I=(e,o,a)=>new c.Vector3(e,o,a),It={portalSeat:{position:I(0,M,G),facing:I(0,0,1),radius:6},flyThrough:[I(0,M,S+125),I(0,M,S+70),I(0,M,S+25),I(0,M,S+3),I(0,M,45),I(0,M,25),I(0,M,5),I(0,M,G)],mouth:{position:I(0,M,S+2),radius:Se},skylights:le.map((e,o)=>({position:X(7.4,e.th,e.z),radius:e.r,floor:je[o].end.clone()})),shaftDir:U.clone(),owlPerch:{position:Be.clone().add(I(0,.4,.3)),launch:I(0,.25,1).normalize()},wheelTop:I(0,et,S+1.5),viewpoints:{reveal:I(0,M+.5,S+125),threeQuarter:I(-34,13,S+42),inside:I(0,M,S-8)},axis:{origin:I(0,M,S),dir:I(0,0,-1),axisY:M,boreRadius:Se,mouthZ:S,portalZ:G},gully:{halfWidth:5,floorY:.3}},Ft=y.ember??1,_t=y.shaft??1.4,gt=y.bounce??.4,At=y.bounceIn??gt,Ct=new c.Vector2,jt=e=>{const o=j(.35,.8,e);q.uEmberI.value=Ft*(.55+.45*o),q.uShaftI.value=_t*(.78+.22*o)*(1+.2*j(.84,.88,e)),q.uGlowI.value=.7+.3*o,q.uBounce.value=B(gt,At,j(.78,.86,e))},tt=y.view||null;let De=64,Oe=20,Te=I(0,8,0),bt=!0;return tt==="mouth"?(De=14,Oe=14,Te=I(0,8,S+2)):tt==="inside"?(De=-4.2,Oe=.01,Te=I(0,M,30),bt=!1):tt==="flank"&&(De=22,Oe=14,Te=I(0,8,28)),{object:F,radius:De,height:Oe,center:Te,anchors:It,uniforms:q,setProgress:jt,update(e,o){q.uTime.value=o,p.renderer&&p.renderer.getDrawingBufferSize&&(dt.uVh.value=p.renderer.getDrawingBufferSize(Ct).y)},dispose(){},ground:bt,groundY:0}}export{Tt as buildHero};
