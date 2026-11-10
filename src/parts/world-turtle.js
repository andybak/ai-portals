import*as o from"three";import{clamp as ee,lerp as se}from"../kit/core.js";const G=150,O=280,fe=O+4,Be=-8,Ge=176,Pe=9,Te=520,C=Math.PI*2,Je=["#05030f","#2a1a5a","#c94f9a","#2fb8a8","#3f8a4a","#c9a86a","#ffe9a8"],I=(a,n,i)=>{const e=ee((i-a)/(n-a),0,1);return e*e*(3-2*e)},Ne=`
uniform vec3 uSunDir, uSunCol, uFillA, uFillB, uAmb, uSideDir;
uniform float uTime, uNight;
uniform sampler2D uMap; uniform float uMapR;
float wtSh=1.;
float h21(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
vec2 h22(vec2 p){ float n=h21(p); return vec2(n,h21(p+n+17.13)); }
float vn(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x),mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x),f.y); }
float fbm(vec2 p){ float s=0.,a=.5; for(int i=0;i<4;i++){ s+=a*vn(p); p=p*2.03+17.7; a*=.5; } return s; }
// band-limited fbm: fw = footprint of one pixel in units of p; octaves finer than the pixel fade to their mean
float fbmB(vec2 p, float fw){ float s=0.,a=.5;
  for(int i=0;i<4;i++){ s+=a*mix(vn(p),.5,smoothstep(.2,.6,fw)); p=p*2.03+17.7; fw*=2.03; a*=.5; } return s; }
// shadow cast by the shell-world's own relief: a short march toward the sun through the height map.
// q = hero-local xz, h0 = height above the ring sea (m). Returns 1 lit .. 0 shadowed (soft, wider with distance).
float wtMapShadow(vec2 q, float h0){
  vec2 s=uSunDir.xz; float sl=max(length(s),1e-3); vec2 d=s/sl; float k=uSunDir.y/sl;
  float occ=0., t=3.;
  for(int i=0;i<10;i++){
    float hs=max(texture2D(uMap,(q+d*t)/(2.*uMapR)+.5).r*176.-8.,0.);
    occ=max(occ,clamp((hs-(h0+1.4+k*t))/(1.2+.07*t),0.,1.));
    t*=1.62;
  }
  return 1.-occ;
}
`,ce=`
${Ne}
vec3 wtBump(vec3 N, vec3 P, float h, float k){
  vec3 dx=dFdx(P), dy=dFdy(P); float hx=dFdx(h), hy=dFdy(h);
  vec3 r1=cross(dy,N), r2=cross(N,dx); float det=dot(dx,r1);
  vec3 g=sign(det)*(hx*r1+hy*r2); vec3 o=abs(det)*N-k*g; float l=length(o); return l>1e-9?o/l:N; }
vec3 wtShade(vec3 alb, vec3 N, vec3 V, float rough, float ao){
  float ndl=dot(N,uSunDir);
  float dif=clamp((ndl+.1)/1.1,0.,1.)*wtSh;
  vec3 sun=uSunCol*dif*mix(vec3(1.,.42,.22),vec3(1.),smoothstep(0.,.4,ndl));
  float s=dot(N,uSideDir)*.5+.5;
  vec3 neb=mix(uFillA,uFillB,smoothstep(.15,.85,s));
  vec3 fill=neb*(.5+.5*abs(s*2.-1.))+uAmb*(.6+.4*N.y);
  vec3 H=normalize(uSunDir+V+vec3(0.,1e-4,0.));
  float sp=pow(max(dot(N,H),0.),mix(90.,6.,rough))*(1.-rough)*step(0.,ndl)*mix(2.5,.3,rough)*wtSh;
  float fr=pow(clamp(1.-dot(N,V),0.,1.),3.);
  return alb*(sun+fill*ao)+uSunCol*sp*.5+neb*fr*.45*ao;
}
`,Se=`
#ifdef USE_FOG
  #ifdef FOG_EXP2
    col*=exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
  #else
    col*=1.-smoothstep(fogNear,fogFar,vFogDepth);
  #endif
#endif
`,Ce=`
uniform float uStroke;
vec3 rotAx(vec3 v, vec3 a, float ang){ float c=cos(ang), s=sin(ang); return v*c+cross(a,v)*s+a*dot(a,v)*(1.-c); }
// fl: x = 0..1 along the limb, y = phase (cycles), z = amplitude (rad), w = side (+1 right, -1 left, 0 tail)
vec3 wtFlap(vec3 p, vec3 pivot, vec3 axis, vec4 fl, float stroke, out vec2 an){
  float ph=(stroke+fl.y)*6.2831853-1.25*fl.x;
  float w=smoothstep(0.,.3,fl.x)*(.5+.5*fl.x);
  an.x=fl.z*(sin(ph)+.22*sin(2.*ph+.6))*w;
  an.y=-fl.w*fl.z*.5*cos(ph)*w;
  vec3 q=rotAx(p-pivot,axis,an.x);
  q=rotAx(q,vec3(0.,1.,0.),an.y);
  return pivot+q;
}
`,de=`
#include <fog_pars_vertex>
varying vec3 vW; varying vec3 vN; varying vec3 vL;
`,he=`
#include <fog_pars_fragment>
varying vec3 vW; varying vec3 vN; varying vec3 vL;
`,ve=`
  vL=p;
  vec4 wp=modelMatrix*vec4(p,1.); vW=wp.xyz; vN=mat3(modelMatrix)*n; vN=dot(vN,vN)>1e-12?normalize(vN):vec3(0.,1.,0.);
  vec4 mvPosition=viewMatrix*wp; gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
`;function xe(a){return n=>{const i=a.length;if(n<=a[0][0])return a[0][1];if(n>=a[i-1][0])return a[i-1][1];let e=0;for(;e<i-2&&n>a[e+1][0];)e++;const s=a[Math.max(0,e-1)],c=a[e],u=a[e+1],S=a[Math.min(i-1,e+2)],d=u[0]-c[0],p=(n-c[0])/d,l=(u[1]-s[1])/Math.max(1e-6,u[0]-s[0])*d,t=(S[1]-c[1])/Math.max(1e-6,S[0]-c[0])*d,r=p*p,f=r*p;return(2*f-3*r+1)*c[1]+(f-2*r+p)*l+(-2*f+3*r)*u[1]+(f-r)*t}}class le{constructor(n){this.spec=n,this.data={};for(const i in n)this.data[i]=[];this.idx=[],this.n=0}vert(n){for(const i in this.spec){const e=n[i],s=this.data[i],c=this.spec[i];for(let u=0;u<c;u++)s.push(e&&e[u]||0)}return this.n++}tri(n,i,e){this.idx.push(n,i,e)}quad(n,i,e,s){this.idx.push(n,i,e,n,e,s)}grid(n,i,e,s,c=!1,u=!1){const S=this.n,d=n+1,p=new Array(d*(i+1));for(let l=0;l<=i;l++)for(let t=0;t<=n;t++)p[l*d+t]=e(t/n,l/i);for(let l=0;l<=i;l++)for(let t=0;t<=n;t++){const r=t===n?u?1:n:t+1,f=t===0?u?n-1:0:t-1,z=p[l*d+r],h=p[l*d+f],x=p[Math.min(i,l+1)*d+t],N=p[Math.max(0,l-1)*d+t],k=p[l*d+t],b=z[0]-h[0],y=z[1]-h[1],g=z[2]-h[2],v=x[0]-N[0],m=x[1]-N[1],A=x[2]-N[2];let M=y*A-g*m,B=g*v-b*A,T=b*m-y*v;const w=Math.hypot(M,B,T);if(w>1e-12){const q=(c?-1:1)/w;M*=q,B*=q,T*=q}else M=0,B=1,T=0;const F=s?s(t/n,l/i,k,[M,B,T])||{}:{};F.position=k,F.normal||(F.normal=[M,B,T]),this.vert(F)}for(let l=0;l<i;l++)for(let t=0;t<n;t++){const r=S+l*d+t,f=r+1,z=r+d+1,h=r+d;c?this.quad(r,h,z,f):this.quad(r,f,z,h)}return S}async gridA(n,i,e,s,c,u,S=!1,d=!1){const p=this.n,l=e+1,t=new Array(l*(s+1));for(let r=0;r<=s;r++){for(let f=0;f<=e;f++)t[r*l+f]=c(f/e,r/s);r%i===i-1&&await n.yield()}for(let r=0;r<=s;r++){for(let f=0;f<=e;f++){const z=f===e?d?1:e:f+1,h=f===0?d?e-1:0:f-1,x=t[r*l+z],N=t[r*l+h],k=t[Math.min(s,r+1)*l+f],b=t[Math.max(0,r-1)*l+f],y=t[r*l+f],g=x[0]-N[0],v=x[1]-N[1],m=x[2]-N[2],A=k[0]-b[0],M=k[1]-b[1],B=k[2]-b[2];let T=v*B-m*M,w=m*A-g*B,F=g*M-v*A;const q=Math.hypot(T,w,F);if(q>1e-12){const D=(S?-1:1)/q;T*=D,w*=D,F*=D}else T=0,w=1,F=0;const R=u?u(f/e,r/s,y,[T,w,F])||{}:{};R.position=y,R.normal||(R.normal=[T,w,F]),this.vert(R)}r%i===i-1&&await n.yield()}for(let r=0;r<s;r++)for(let f=0;f<e;f++){const z=p+r*l+f,h=z+1,x=z+l+1,N=z+l;S?this.quad(z,N,x,h):this.quad(z,h,x,N)}return p}geometry(){const n=new o.BufferGeometry;for(const i in this.spec)n.setAttribute(i,new o.Float32BufferAttribute(this.data[i],this.spec[i]));return n.setIndex(this.n>65535?new o.Uint32BufferAttribute(this.idx,1):new o.Uint16BufferAttribute(this.idx,1)),n}}const oe=()=>o.UniformsUtils.clone(o.UniformsLib.fog),et=a=>new o.Color(a),U=(a,n,i)=>a.clone().lerp(n,i);async function tt(a,n){const e=2*fe/280,s=a.noise.n2,c=a.noise.ridged2,u=new Float32Array(280*280),S=new Float32Array(280*280),d=new Uint8Array(280*280),p=new Float32Array(280*280),l=24,t=new Float32Array(l*l),r=new Float32Array(l*l),f=new Float32Array(l*l),z=new Float32Array(l*l),h=n.scute,x=h*.866,N=a.rng.fork("scutes");for(let v=0;v<l;v++)for(let m=0;m<l;m++){const A=v-12,M=m-12,B=v*l+m;t[B]=(M+.5*(A&1)+N.range(-.17,.17))*h+n.scuteOff[0],r[B]=(A+N.range(-.17,.17))*x+n.scuteOff[1],f[B]=N(),z[B]=N.range(7,20)}const k=new Uint8Array(280*280*4),b=n.teeth;for(let v=0;v<280;v++){v%2===1&&await a.yield();const m=(v+.5)*e-fe;for(let A=0;A<280;A++){const M=(A+.5)*e-fe,B=Math.hypot(M,m),T=v*280+A;if(B>fe+3){u[T]=-1,S[T]=40,k[T*4]=(-1-Be)/Ge*255,k[T*4+1]=255;continue}const w=M+9*s(M*.012+7,m*.012)+2.5*s(M*.05,m*.05+3),F=m+9*s(M*.012-4,m*.012+9)+2.5*s(M*.05+8,m*.05),q=Math.round((F-n.scuteOff[1])/x);let R=1e9,D=1e9,P=0,W=0;for(let J=-1;J<=1;J++){const ue=q+J,ze=Math.round((w-n.scuteOff[0])/h-.5*(ue&1));for(let Fe=-1;Fe<=1;Fe++){const $=(ue+12)*l+(ze+Fe+12),Y=t[$]-w,ae=r[$]-F,ge=Y*Y+ae*ae;ge<R?(D=R,W=P,R=ge,P=$):ge<D&&(D=ge,W=$)}}const E=t[W]-t[P],_=r[W]-r[P],V=Math.hypot(E,_)||1;let L=(((t[P]+t[W])*.5-w)*E+((r[P]+r[W])*.5-F)*_)/V;const j=s(M*.021+3,m*.021-5),K=s(M*.05-9,m*.05+2),X=s(M*.11,m*.11+6),H=n.coast+9*s(M*.018+20,m*.018-11)+3*K;let Q=I(H+7,H-9,B);const ie=30*Math.max(0,1-B/H*(B/H)),me=I(1.5,15,L),ne=z[P];let Ae=Math.min(L/7,5);const re=Math.floor(Ae);Ae=re+I(.3,.7,Ae-re);let Z=ie+me*ne*.55+Ae*ne*.12+(3.2*j+1.6*K+.7*X)*me;Z=se(ie*.85-1.3,Z,I(2,6.5,L));let be=0;for(const J of n.peaks){const ue=Math.hypot(M-J.x,m-J.z)/J.r;if(ue<1){const ze=c(M*J.f+J.o,m*J.f-J.o,4);be+=J.h*Math.pow(1-ue,1.6)*(.62+.6*ze)*(.9+.1*X)}}Z+=be,L+=be*.6;const te=Math.hypot(M-n.city.x,m-n.city.z);if(te<62){const J=I(58,30,te);Z=se(Z,4.2+.5*X,J),Q=Math.max(Q,I(62,40,te)),te<34&&(L=Math.max(L,20))}Z=se(-5-1.5*j,Z,Q);const pe=I(O-10,O-3,B);if(pe>0){const J=Math.atan2(M,m),ue=Math.pow(Math.max(0,Math.cos(J*b)),1.4)*I(O+3,O-2.5,B)*I(O-10,O-5,B);Z=se(Z,-.9+ue*(7.5+3*K+2*X),pe)}let Me=I(-.25,.2,s(M*.011+50,m*.011)+.5*K+.25*X)*I(2.5,5,Z)*I(72,52,Z)*I(4,9,L)*I(30,48,te);Me=Math.max(Me,.75*I(70,55,te)*I(36,46,te)*I(2.5,4,Z)),u[T]=Z,S[T]=L,d[T]=f[P]*255,p[T]=Me;const ke=T*4;k[ke]=ee((Z-Be)/Ge,0,1)*255,k[ke+1]=ee(L/48,0,1)*255,k[ke+2]=d[T],k[ke+3]=Me*255}}const y=new o.DataTexture(k,280,280,o.RGBAFormat);y.minFilter=y.magFilter=o.LinearFilter,y.needsUpdate=!0;const g=(v,m,A)=>{const M=ee((m+fe)/e-.5,0,278.999),B=ee((A+fe)/e-.5,0,280-1.001),T=Math.floor(M),w=Math.floor(B),F=M-T,q=B-w,R=w*280+T;return(v[R]*(1-F)+v[R+1]*F)*(1-q)+(v[R+280]*(1-F)+v[R+280+1]*F)*q};return{tex:y,H:u,E:S,S:d,F:p,N:280,cell:e,hAt:(v,m)=>g(u,v,m),eAt:(v,m)=>g(S,v,m),fAt:(v,m)=>g(p,v,m),sAt:(v,m)=>d[ee(Math.floor((m+fe)/e),0,279)*280+ee(Math.floor((v+fe)/e),0,279)]/255}}const We=`
${de}
void main(){
  vec3 p=position, n=normal;
  ${ve}
}`,at=`
${ce}
${he}
uniform vec3 uCity;
uniform vec3 cGrassA, cGrassB, cGrassC, cForest, cSand, cRockA, cRockB, cShallow, cDeep, cWarm;
void main(){
  vec2 q=vL.xz; float r=length(q);
  vec4 m=texture2D(uMap,q/(2.*uMapR)+.5);
  float h=m.r*${Ge.toFixed(1)}+(${Be.toFixed(1)}), e=m.g*48., rnd=m.b, forest=m.a;
  vec3 N=normalize(vN+vec3(0.,1e-6,0.)), V=normalize(cameraPosition-vW);
  float fwq=length(fwidth(q)), nearK=1.-smoothstep(.25,1.6,fwq);
  float n1=fbm(q*.07), n2=fbm(q*.55+31.), n3=mix(.5,fbm(q*2.6+7.),nearK);
  float slope=1.-N.y;
  vec3 g=mix(cGrassA,cGrassB,smoothstep(.45,.6,rnd)); g=mix(g,cGrassC,smoothstep(.84,.9,rnd));
  g*=.65+.7*n1; g=mix(g,g*vec3(1.2,1.1,.65),n2*.5);
  float ringT=e/7., rf=fract(ringT);
  float ring=smoothstep(0.,.14,rf)*smoothstep(1.,.86,rf);
  g*=mix(1.,.62+.38*ring,step(ringT,5.2)*smoothstep(3.,6.,e));
  g*=.72+.56*n3;
  float nearD=1.-smoothstep(70.,160.,length(cameraPosition-vW));
  float n4=fbmB(q*1.1+53.,fwq*1.1)*.6+fbmB(q*4.3+11.,fwq*4.3)*.4;      // tufts, stones and furrows: ground that reads from 60 m
  g*=1.+(n4-.5)*.55*nearD;
  float flw=step(.9,h21(floor(q*1.4)))*nearK*smoothstep(.45,.7,n2);
  g=mix(g,mix(cGrassC,cWarm,h21(floor(q*1.4)+3.))*.9,flw*.7);
  g=mix(g,cForest*(.6+.8*n2),forest*.85);
  float dcy=length(q-uCity.xy), pav=smoothstep(uCity.z,uCity.z*.62,dcy);
  float ca=atan(q.x-uCity.x,q.y-uCity.y+1e-4);
  float street=max(smoothstep(.42,.5,abs(fract(ca*1.5915)-.5)),smoothstep(.4,.5,abs(fract(dcy/11.)-.5)));
  vec3 pave=cSand*(.42+.2*n3)*(1.-.3*step(.5,fract(q.x*.45))*step(.5,fract(q.y*.45))*nearK);
  g=mix(g,mix(pave,cSand*.75,street*.8),pav);
  vec3 alb=g; float rough=.95;
  float rockK=clamp(smoothstep(.2,.4,slope+(n2-.5)*.15)+smoothstep(56.,74.,h+n1*14.),0.,1.);
  vec3 rock=mix(cRockA,cRockB,vn(vec2(h*.45+n1*6.,n2*3.)));
  float hy=vL.y-${G.toFixed(1)};                                     // the mesh's own height: smooth, unlike the 8-bit map
  float strata=vn(vec2(hy*1.6+n1*4.,r*.05));
  float band=mix(.5,vn(vec2((q.x+q.y)*.3,hy*2.3+n2*1.5))*.6+vn(vec2((q.x-q.y)*.9,hy*6.))*.4,nearK);   // steep faces: horizontal beds, not smears
  float steep=smoothstep(.22,.6,slope);
  rock*=(.75+.5*strata)*mix(1.,.55+.9*band,steep);
  rock=mix(rock,rock*vec3(1.25,1.05,.85),smoothstep(.6,.85,strata)*.6);
  alb=mix(alb,rock,rockK);
  N=wtBump(N,vW,(strata*.6+band*.8)*rockK,.55*nearK*steep);
  N=wtBump(N,vW,n4,.3*nearD*(1.-rockK));
  alb*=1.-.2*clamp(-dot(normalize(vN+vec3(0.,1e-6,0.)),uSunDir)*2.,0.,1.)*smoothstep(.02,.2,slope);   // terraces model
  float snow=smoothstep(86.,99.,h+(n1-.5)*26.-slope*36.);
  alb=mix(alb,vec3(.5,.54,.62),snow);
  alb=mix(alb,cSand*(.75+.4*n2),smoothstep(2.8,1.3,h));
  alb=mix(vec3(dot(alb,vec3(.3,.5,.2))),alb,.82)*.84;      // quieter land: lights, snow and water are the accents
  float ao=mix(.5+.5*smoothstep(0.,11.,e),1.,snow);
  // water: ring sea, estuaries and the rivers in the scute seams
  float sea=smoothstep(.35,-.25,h);
  float river=smoothstep(3.6,2.3,e)*smoothstep(66.,50.,h)*smoothstep(-.2,.6,h);
  float w=max(sea,river);
  vec3 wcol=mix(cShallow,cDeep,clamp(-h/5.5,0.,1.)*sea);
  float rimK=smoothstep(268.,280.,r);
  float foam=smoothstep(.45,.85,vn(vec2(atan(q.x,q.y+1e-4)*70.,r*.1-uTime*1.2)))*rimK*.8+smoothstep(277.5,280.,r)*.5;
  foam+=smoothstep(-1.,-.1,h)*sea*(.35+.25*sin(uTime*1.3+n1*30.));
  wcol=mix(wcol,vec3(.7,.82,.86),clamp(foam,0.,1.)*sea*.85);
  vec3 Nw=normalize(N+vec3(vn(q*.5+uTime*.4)+.5*vn(q*1.7-uTime*.6)-.75,0.,vn(q*.5+9.-uTime*.35)+.5*vn(q*1.7+4.+uTime*.5)-.75)*.13);
  alb=mix(alb,wcol,w); rough=mix(rough,.62,w); N=normalize(mix(N,Nw,w)); ao=mix(ao,1.,w);
  wtSh=wtMapShadow(q,max(h,0.));
  { vec2 sd2=uSunDir.xz/max(length(uSunDir.xz),1e-3); float lowS=1.-smoothstep(.05,.5,uSunDir.y);
    float fs=max(texture2D(uMap,(q+sd2*mix(3.,9.,lowS))/(2.*uMapR)+.5).a,texture2D(uMap,(q+sd2*mix(6.,20.,lowS))/(2.*uMapR)+.5).a*.8);
    float dap=mix(1.,.55+.9*n3,nearK);
    wtSh*=1.-clamp(fs*dap,0.,1.)*mix(.45,.8,lowS)*(1.-w); }
  ao*=mix(.72,1.,wtSh);
  vec3 col=wtShade(alb,N,V,rough,ao);
  col+=alb*uFillB*(1.-wtSh)*.16*smoothstep(-.05,.1,uSunDir.y);    // cool bounce inside the long shadows
  col+=w*wtSh*uSunCol*pow(max(dot(N,normalize(uSunDir+V+vec3(0.,1e-4,0.))),0.),260.)*(1.-clamp(foam,0.,1.))*step(0.,dot(N,uSunDir))*2.2;
  float sd=dot(N,uSideDir)*.5+.5;
  col+=w*mix(uFillA,uFillB,sd)*.16;                       // rivers and sea mirror the nebula, also at night
  { float sang=atan(q.x,q.y+1e-4);
    float cur=smoothstep(.5,.9,vn(vec2(sang*46.,r*.09-uTime*.55)))*(1.-smoothstep(.6,2.5,fwq));     // streaks drawn toward the rim
    float gl1=vn(q*.9+vec2(uTime*.5,uTime*.2)), gl2=vn(q*2.3-vec2(uTime*.4,-uTime*.6));
    float glint=pow(gl1*gl2,3.)*8.*(1.-smoothstep(.3,1.5,fwq));
    vec3 nebW=mix(uFillA,uFillB,gl1);
    col+=sea*(cShallow*(.07+.1*cur)+nebW*glint*.9+cShallow*uNight*.05); }
  float tw=h21(floor(q*1.3));
  col+=snow*wtSh*uSunCol*step(.985,tw)*(.5+.5*sin(uTime*3.+tw*90.))*max(dot(N,uSunDir),0.)*1.6;
  col+=alb*cWarm*vec3(1.,.8,.55)*uNight*1.25*exp(-dcy*dcy/(uCity.z*uCity.z));
  gl_FragColor=vec4(col,1.);
  #include <fog_fragment>
}`;async function ot(a,n,i,e,s){const S=new Float32Array(70227),d=new Float32Array(23409*3),p=new Uint32Array(23104*6),l=(h,x)=>Math.max(0,n.hAt(h,x));for(let h=0;h<153;h++)for(let x=0;x<153;x++){const N=-1+2*x/152,k=-1+2*h/152,b=(h*153+x)*3,y=O*N*Math.sqrt(1-k*k/2),g=O*k*Math.sqrt(1-N*N/2);S[b]=y,S[b+1]=G+l(y,g),S[b+2]=g;const v=2.4,m=(l(y+v,g)-l(y-v,g))/(2*v),A=(l(y,g+v)-l(y,g-v))/(2*v),M=1/Math.hypot(m,1,A);d[b]=-m*M,d[b+1]=M,d[b+2]=-A*M,x===152&&(h&7)===7&&await a.yield()}let t=0;for(let h=0;h<152;h++)for(let x=0;x<152;x++){const N=h*153+x,k=N+1,b=N+153+1,y=N+153;p[t++]=N,p[t++]=y,p[t++]=b,p[t++]=N,p[t++]=b,p[t++]=k}const r=new o.BufferGeometry;r.setAttribute("position",new o.BufferAttribute(S,3)),r.setAttribute("normal",new o.BufferAttribute(d,3)),r.setIndex(new o.BufferAttribute(p,1));const f=new o.ShaderMaterial({uniforms:{...oe(),...i,uMap:{value:n.tex},uMapR:{value:fe},uCity:{value:new o.Vector3(s.city.x,s.city.z,46)},cGrassA:{value:e.grassA},cGrassB:{value:e.grassB},cGrassC:{value:e.grassC},cForest:{value:e.forest},cSand:{value:e.sand},cRockA:{value:e.rockA},cRockB:{value:e.rockB},cShallow:{value:e.shallow},cDeep:{value:e.deep},cWarm:{value:e.warm}},vertexShader:We,fragmentShader:at,fog:!0}),z=new o.Mesh(r,f);return z.name="shellWorld",z}const nt=`
${Ne}
${de}
attribute vec3 aCol; attribute vec2 aSh;      // aSh: x = baked shade (dark under each tier / blob), y = 1 foliage, 0 trunk
varying vec3 vCol; varying vec3 vT;
void main(){
  vec3 q=position; vec3 io=instanceMatrix[3].xyz;
  float ph=uTime*1.3+io.x*.1+io.z*.07;
  float gust=.55+.45*sin(uTime*.37+io.x*.021-io.z*.017);
  float bend=q.y*q.y*(.13*sin(ph)+.045*sin(ph*2.7+io.z))*gust;
  q.x+=bend; q.z+=bend*.6+q.y*q.y*.05*sin(uTime*1.7+io.z*.23);
  q.xz+=aSh.y*.035*vec2(sin(uTime*3.1+position.y*9.+io.x),cos(uTime*2.7+position.x*11.+io.z));   // leaf flutter
  vec3 p=(instanceMatrix*vec4(q,1.)).xyz;
  vec3 n=normalize(normalize(mat3(instanceMatrix)*normal)+vec3(0.,.45,0.));
  vCol=mix(vec3(.11,.07,.06),aCol,aSh.y)*aSh.x;
  vT=vec3(wtMapShadow(io.xz,io.y-${G.toFixed(1)}+2.5),aSh.y,h21(io.xz));
  ${ve}
}`,it=`
${ce}
${he}
varying vec3 vCol; varying vec3 vT;
void main(){
  vec3 N=normalize(vN+vec3(0.,1e-6,0.)), V=normalize(cameraPosition-vW);
  float fw=length(fwidth(vW));
  float leaf=fbmB(vW.xz*1.7+vW.y*2.3+vT.z*40.,fw*1.7);                 // leaf clumps, only where a pixel can hold them
  float clumpN=fbmB(vW.xz*.42+vW.y*.6+vT.z*9.,fw*.42);                 // boughs: survives further off than the leaves
  vec3 alb=vCol*mix(1.,(.55+.9*leaf)*(.7+.6*clumpN),vT.y);
  alb=mix(alb,alb*vec3(1.25,1.15,.8),vT.y*smoothstep(.55,.8,leaf)*.6);
  wtSh=vT.x;
  vec3 col=wtShade(alb,N,V,.95,.8);
  col+=alb*uSunCol*pow(clamp(dot(-V,uSunDir),0.,1.),4.)*.22*vT.y*wtSh;    // low sun glowing through the crowns
  gl_FragColor=vec4(col,1.);
  #include <fog_fragment>
}`;function Le(a,n,i){let e=1e9;for(let s=0;s<i.length-1;s++){const c=i[s][0],u=i[s][1],S=i[s+1][0]-c,d=i[s+1][1]-u,p=ee(((a-c)*S+(n-u)*d)/(S*S+d*d||1),0,1);e=Math.min(e,Math.hypot(a-c-S*p,n-u-d*p))}return e}async function rt(a,n,i,e,s,c){const u=a.rng.fork("trees"),S=a.rng.fork("treeShape"),d={position:3,normal:3,aSh:2},p=(w,F,q)=>{const R=[],D=[];for(let P=0;P<3;P++){const W=P/3*C,E=Math.cos(W),_=Math.sin(W);R.push(w.vert({position:[E*F*1.3,-.04,_*F*1.3],normal:[E,.1,_],aSh:[.7,0]})),D.push(w.vert({position:[E*F,q,_*F],normal:[E,.1,_],aSh:[1,0]}))}for(let P=0;P<3;P++){const W=(P+1)%3;w.quad(R[P],D[P],D[W],R[W])}},l=new le(d);p(l,.045,.3);const t=(w,F,q,R,D,P)=>{const W=l.vert({position:[R*.4,q,D*.4],normal:[0,1,0],aSh:[P,1]}),E=[],_=S()*C;for(let V=0;V<6;V++){const L=V/6*C+_,j=w*(V%2?.82:1.06),K=Math.cos(L),X=Math.sin(L);E.push(l.vert({position:[R+K*j,F-(V%2?0:.035),D+X*j],normal:[K*.82,.57,X*.82],aSh:[1.08,1]}))}for(let V=0;V<6;V++)l.tri(W,E[(V+1)%6],E[V])};t(.5,.16,.6,.03,-.02,.5),t(.39,.4,.82,-.03,.02,.55),t(.26,.64,1,.01,.02,.95);const r=new le(d);p(r,.05,.5);const f=(w,F,q,R,D,P,W=1)=>{const E=w.attributes.position,_=[];for(let V=0;V<E.count;V++){let L=E.getX(V),j=E.getY(V),K=E.getZ(V);const X=Math.hypot(L,j,K)||1;L/=X,j/=X,K/=X;const H=1+.3*Math.sin(L*7.1+F*31)*Math.cos(K*6.3+j*5.2+R*17);_.push(r.vert({position:[F+L*D*H,q+j*P*H,R+K*D*H],normal:[L*.8+F,j,K*.8+R],aSh:[W*(.3+.8*ee(j*.8+.5,0,1)),1]}))}for(let V=0;V<_.length;V+=3)r.tri(_[V],_[V+1],_[V+2]);w.dispose()};f(new o.IcosahedronGeometry(1,0),.02,.62,0,.46,.34),f(new o.OctahedronGeometry(1,0),-.26,.5,.2,.33,.25,.8),f(new o.OctahedronGeometry(1,0),.3,.47,-.18,.31,.23,1.12),f(new o.OctahedronGeometry(1,0),.06,.84,.1,.27,.2,1.2);const z=new le(d);{const w=new o.IcosahedronGeometry(1,0),F=w.attributes.position,q=[];for(let R=0;R<F.count;R++){let D=F.getX(R),P=F.getY(R),W=F.getZ(R);const E=Math.hypot(D,P,W)||1;D/=E,P/=E,W/=E;const _=1+.28*Math.sin(D*5.3+1.7)*Math.cos(W*4.1+P*3.3);q.push(z.vert({position:[D*.5*_,.16+P*.3*_,W*.5*_],normal:[D,P,W],aSh:[.5+.6*ee(P*.8+.5,0,1),1]}))}for(let R=0;R<q.length;R+=3)z.tri(q[R],q[R+1],q[R+2]);w.dispose()}const h=[l.geometry(),r.geometry(),z.geometry()],x=[{m:[],c:[]},{m:[],c:[]},{m:[],c:[]}];await a.yield();const N=Math.atan2(s.city.x,s.city.z),k=[[40,-400],[105,-200],[140,-60],[s.city.x-18,s.city.z-12],[Math.sin(N)*306,Math.cos(N)*306]],b=new o.Matrix4,y=new o.Quaternion,g=new o.Euler,v=new o.Vector3,m=new o.Vector3;let A=0,M=0;for(;M<c&&A++<c*14;){(A&255)===0&&await a.yield();const w=u()*C,F=Math.sqrt(u())*(O-30),q=Math.sin(w)*F,R=Math.cos(w)*F,D=n.fAt(q,R);if(D<.25||u()>D||Le(q,R,k)>250&&u()<.4)continue;const P=n.hAt(q,R),W=Math.hypot(q-s.city.x,R-s.city.z),E=n.sAt(q,R);let _,V,L,j=1,K=!1;W<78&&u()<.8?(K=!0,_=U(e.cherry,e.warm,u.range(0,.4)).multiplyScalar(u.range(.45,.72)),V=u.range(5,7.5),L=u.range(5,7)):P>34||u()<.4?(j=0,_=U(e.forest,e.shallow,u.range(.05,.3)).multiplyScalar(u.range(.6,1.05)),V=u.range(8,13.5),L=u.range(3.6,5)):(_=(E>.86&&W<110?e.cherry:E>.52?U(e.sand,e.cherry,u.range(0,.35)):U(e.grassA,e.sand,u.range(0,.4))).clone().multiplyScalar(u.range(.42,.75)),V=u.range(6,9.5),L=u.range(5.5,8)),_.r*=u.range(.85,1.15),_.g*=u.range(.85,1.15),_.b*=u.range(.85,1.15);{const H=_.r*.3+_.g*.5+_.b*.2,Q=K?.36:.38,ie=K?.78:.8;_.r=(_.r+(H-_.r)*Q)*ie,_.g=(_.g+(H-_.g)*Q)*ie,_.b=(_.b+(H-_.b)*Q)*ie}g.set(u.range(-.07,.07),u()*C,u.range(-.07,.07)),y.setFromEuler(g),v.set(L*.47,V*.47,L*.47),m.set(q,G+P-.2,R),b.compose(m,y,v);const X=x[j];for(let H=0;H<16;H++)X.m.push(b.elements[H]);X.c.push(_.r,_.g,_.b),M++}await a.yield();{const w=u.fork("scrub"),F=new o.Color(.2,.18,.26),q=U(e.forest,e.sand,.35),R=U(e.cherry,e.forest,.6).multiplyScalar(.7);let D=0,P=0;for(;D<420&&P++<16e3;){(P&511)===0&&await a.yield();const W=w()*C,E=Math.sqrt(w())*(O-34),_=Math.sin(W)*E,V=Math.cos(W)*E;if(Le(_,V,k)>150)continue;const L=n.hAt(_,V);if(L<3||L>96||n.fAt(_,V)>.55)continue;const j=2.2,K=(n.hAt(_+j,V)-n.hAt(_-j,V))/(2*j),X=(n.hAt(_,V+j)-n.hAt(_,V-j))/(2*j),H=Math.hypot(K,X);if(H<.55||H>2.4)continue;const Q=w()<.45,ie=Q?F.clone().multiplyScalar(w.range(.7,1.5)):(w()<.3?R:q).clone().multiplyScalar(w.range(.6,1.1)),me=Q?w.range(1.4,4.2)*(w()<.1?1.8:1):w.range(1.6,3.4);g.set(w.range(-.3,.3),w()*C,w.range(-.3,.3)),y.setFromEuler(g),v.set(me,me*w.range(.7,1.3),me*w.range(.7,1.2)),m.set(_,G+L-.15,V),b.compose(m,y,v);for(let ne=0;ne<16;ne++)x[2].m.push(b.elements[ne]);x[2].c.push(ie.r,ie.g,ie.b),D++}}const B=new o.ShaderMaterial({uniforms:{...oe(),...i},vertexShader:nt,fragmentShader:it,fog:!0}),T=new o.Group;return T.name="forest",h.forEach((w,F)=>{const q=x[F].c.length/3;w.setAttribute("aCol",new o.InstancedBufferAttribute(new Float32Array(x[F].c),3));const R=new o.InstancedMesh(w,B,Math.max(1,q));R.instanceMatrix.array.set(x[F].m),R.instanceMatrix.needsUpdate=!0,R.count=q,R.frustumCulled=!1,T.add(R)}),T}const st=`
${de}
attribute vec2 aUv; attribute vec3 aFeat;
varying vec2 vUv; varying vec3 vFeat;
#ifdef FLAP
${Ce}
attribute vec3 aPivot; attribute vec3 aAxis; attribute vec4 aFlap;
#endif
void main(){
  vec3 p=position, n=normal;
  #ifdef FLAP
    vec2 an; p=wtFlap(p,aPivot,aAxis,aFlap,uStroke,an);
    n=rotAx(n,aAxis,an.x); n=rotAx(n,vec3(0.,1.,0.),an.y);
  #endif
  vUv=aUv; vFeat=aFeat;
  ${ve}
}`,lt=`
${ce}
${he}
uniform vec3 cSkinA, cSkinB, cSeam, cBelly, cHorn, cStar, cLine, cMoss;
uniform float uScale, uStarScale, uStarDensity, uRim, uTone, uRough, uFillRim, uStarGain, uUnder, uFall, uRimUnder;
uniform vec3 uBounce, cFall;
varying vec2 vUv; varying vec3 vFeat;
vec3 voro(vec2 x){ vec2 n=floor(x), f=fract(x); float d1=8., d2=8.; vec2 id=n;
  for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){ vec2 g=vec2(float(i),float(j)); vec2 r=g+h22(n+g)-f; float d=dot(r,r);
    if(d<d1){ d2=d1; d1=d; id=n+g; } else if(d<d2){ d2=d; } }
  return vec3(sqrt(d2)-sqrt(d1),h21(id+3.3),sqrt(d1)); }
float seg(vec2 a, vec2 b){ vec2 ba=b-a; float h=clamp(dot(-a,ba)/dot(ba,ba),0.,1.); return length(a+ba*h); }
vec2 starMap(vec2 x, float fwc){ vec2 n=floor(x), f=fract(x); float st=0., ln=0.;
  float aw=1./(1./80.+fwc*1.3);                                        // glint arms never thinner than a pixel
  for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){ vec2 g=vec2(float(i),float(j)); vec2 c=n+g;
    vec2 a=g+.15+.7*h22(c)-f; float b=smoothstep(1.-uStarDensity,1.,h21(c+7.7));
    float d=dot(a,a); vec2 aa=abs(a);
    st+=b*(exp(-d*800.)*1.7+(exp(-aa.x*aw-aa.y*7.)+exp(-aa.y*aw-aa.x*7.))*.6*exp(-d*26.));   // small sharp four-point glints, no soft blobs
    float hl=h21(c+1.9);
    if(hl>.42){ vec2 g2=g+(hl>.71?vec2(1.,0.):vec2(0.,1.)); vec2 c2=n+g2; vec2 a2=g2+.15+.7*h22(c2)-f;
      float b2=smoothstep(1.-uStarDensity,1.,h21(c2+7.7)); float sd=seg(a,a2); ln+=min(b,b2)*exp(-sd*sd*aw*aw*.14); } }
  return vec2(st,ln); }
void main(){
  vec3 N=normalize(vN+vec3(0.,1e-6,0.)), V=normalize(cameraPosition-vW);
  // The three features step from 0 to their value across one quad (belly under a paddle, keratin on its leading edge), and
  // at a paddle's tip that quad is thinner than a pixel: an antialiased sample past its edge reads them far outside 0..1,
  // and the mixes below multiply that into a glowing albedo. They are held to the range the vertices carry.
  vec3 feat=clamp(vFeat,0.,1.);
  float mouth=feat.x, keratin=feat.y, belly=feat.z;
  float fw=length(fwidth(vUv));
  float near=1.-smoothstep(.12,.5,fw/uScale), nearS=1.-smoothstep(.06,.3,fw/uStarScale);
  vec3 vo=voro(vUv/uScale);
  float n1=fbm(vUv*.11), n2=fbmB(vUv*.9,fw*.9);
  float pw=fw/uScale;
  float plate=mix(.85,smoothstep(.012,.1+pw*1.5,vo.x),near);
  vo.y=mix(.5,vo.y,near);
  vec3 alb=mix(cSkinA,cSkinB,clamp(vo.y*.34+n1*.9-.12,0.,1.));
  alb*=(.66+.36*n2)*(.82+.36*vo.y);
  alb=mix(cSeam,alb,mix(1.,plate,.7*(1.-keratin)));
  alb=mix(alb,cBelly*(.7+.4*n2),belly*.4*(.45+.55*plate));
  float stri=mix(.5,vn(vec2(vUv.x*.22,vUv.y*1.5)),1.-smoothstep(.12,.4,fw));
  alb=mix(alb,cHorn*(.68+.38*stri),keratin);
  // moss and barnacle crust gathers on the upward faces and in the seams
  float mossN=fbm(vUv*.045+3.), crust=fbmB(vUv*.6+9.,fw*.6);
  float moss=smoothstep(.5,.68,mossN+.25*(1.-plate)*near)*smoothstep(-.15,.5,N.y)*(1.-keratin)*(1.-belly);
  alb=mix(alb,cMoss*(.55+.9*crust),moss*.3);
  alb*=mix(1.,uTone,(1.-belly)*(1.-keratin));
  alb*=1.-.85*mouth;
  float hgt=plate*.7*(1.-keratin)+n2*.5+stri*keratin*.5+moss*crust*.6;
  N=wtBump(N,vW,hgt,1.1*near*(1.-smoothstep(.12,.45,pw*10.)));      // no relief once a seam is narrower than a few pixels
  vec3 col=wtShade(alb,N,V,mix(uRough,.3,keratin),.65+.35*plate);
  vec2 sm=starMap(vUv/uStarScale,fw/uStarScale);
  float pulse=.6+.4*sin(vL.z*.018+uTime*.7);
  float twk=.7+.3*sin(uTime*2.3+vo.y*40.);
  col+=(cStar*sm.x*1.45*twk+cLine*sm.y*1.7*pulse)*(1.-keratin)*(1.-mouth)*nearS*uStarGain;
  col+=(cStar*.05+cLine*.03)*pulse*(1.-nearS)*(1.-keratin);
  { float fr=clamp(1.-dot(N,V),0.,1.); fr*=fr; fr*=fr;                 // warm rim: the low sun finds the brow, beak and neck folds
    col+=uSunCol*uRim*fr*clamp(dot(N,uSunDir)+.35,0.,1.)*(.6+.4*plate); }
  { float f1=clamp(1.-dot(N,V),0.,1.);                                  // nebula rim: a limb keeps a lit edge after dusk
    col+=(uFillA+uFillB)*uFillRim*f1*f1*f1*(.55+.45*plate);
    float nearRim=1.-smoothstep(8.,64.,abs(length(vL.xz)-${O.toFixed(1)}));
    col+=alb*uBounce*nearRim*4.;                                         // light off the Rimfall's spray on whatever swims beside it
    float under=uUnder*clamp(.35-.65*N.y,0.,1.);
    col+=(alb+cBelly*.25)*(uFillB*1.5+uBounce*4.)*under; }                // the paddle's underside, seen from below against the curtain
  { // Light off the fall, by place. Outside the rim and below the lip a skin is lit from the curtain above and inward of it
    // (a wide soft light and a wet sheen), less the further out it reaches; under the carapace's own rim it takes the light
    // of the spray and the ice ring below. Nothing here follows the eye.
    float rl=length(vL.xz), ro=rl-${O.toFixed(1)}; vec2 rd=vL.xz/max(rl,1.);
    float fk=uFall*smoothstep(-20.,8.,ro)*exp(-max(ro,0.)/90.)*smoothstep(${(G+16).toFixed(1)},${(G-8).toFixed(1)},vL.y);
    vec3 Lf=normalize(vec3(-rd.x*.5,.86,-rd.y*.5));
    vec3 fc=cFall*(uSunCol*.28+(uFillA+uFillB)*.8+uAmb*.5);
    col+=(alb*2.6+cFall*.06)*fc*clamp(dot(N,Lf)*.65+.35,0.,1.)*fk;
    col+=fc*pow(max(dot(N,normalize(Lf+V)),0.),16.)*fk*.45*(.4+.6*plate);
    col+=(alb+cBelly*.3)*fc*uRimUnder*clamp(.35-.65*N.y,0.,1.)*(1.-smoothstep(0.,70.,-ro))*step(ro,0.); }
  gl_FragColor=vec4(col,1.);
  #include <fog_fragment>
}`;function qe(a,n,i){return new o.ShaderMaterial({uniforms:{...oe(),...a,cSkinA:{value:n.skinA},cSkinB:{value:n.skinB},cSeam:{value:n.seam},cBelly:{value:n.belly},cHorn:{value:n.horn},cStar:{value:n.star},cLine:{value:n.line},cMoss:{value:n.moss},uScale:{value:i.scale},uStarScale:{value:i.starScale},uStarDensity:{value:i.starDensity},uRim:{value:i.rim??.1},uTone:{value:i.tone??1},uRough:{value:i.rough??.55},uFillRim:{value:i.fillRim??0},uStarGain:{value:i.starGain??1},uUnder:{value:i.under??0},uBounce:{value:n.water.clone().multiplyScalar(i.bounce??0)},uFall:{value:i.fall??0},uRimUnder:{value:i.rimUnder??0},cFall:{value:n.water}},defines:i.flap?{FLAP:1}:{},vertexShader:st,fragmentShader:lt,fog:!0})}const _e={position:3,normal:3,aUv:2,aFeat:3};async function ct(a,n,i,e){const s=xe([[0,279],[.06,280.5],[.12,279.5],[.2,275],[.3,262],[.42,243],[.56,208],[.7,160],[.84,96],[1,.6]]),c=xe([[0,.3],[.06,-2],[.12,-7],[.2,-14],[.3,-25],[.42,-39],[.56,-54],[.7,-66],[.84,-75],[1,-80]]),u=e.teeth,S=new le(_e),d=(l,t)=>{const r=l*C,f=I(.3,.1,t),z=s(t)+f*I(0,.05,t)*(2.6*Math.sqrt(Math.max(0,Math.cos(r*u)*.5+.5))-1.8)+I(.3,.6,t)*I(1,.8,t)*2.5*Math.cos(r*6);return[Math.sin(r)*z,G+c(t),Math.cos(r)*z*(1+.05*I(.3,.7,t))]};await S.gridA(a,3,144,20,d,(l,t)=>{const r=l*C,f=300*(1-t)+20;return{aUv:[Math.sin(r)*f,Math.cos(r)*f],aFeat:[I(.19,.215,t)*I(.24,.215,t)*.6,I(.26,.17,t),I(.3,.55,t)]}},!0,!0);const p=new o.Mesh(S.geometry(),qe(n,i,{scale:26,starScale:30,starDensity:e.starDensity,rimUnder:1}));return p.name="body",p}function ut(a,n){const s=a.noise.n3,c=xe([[0,58],[.12,47],[.3,35],[.44,31],[.52,40],[.62,49],[.72,49],[.82,44],[.9,32],[.95,20],[.985,9],[1,2]]),u=xe([[0,38],[.2,30],[.44,25],[.52,34],[.62,46],[.72,47],[.82,40],[.9,29],[.95,20],[.985,11],[1,2]]),S=xe([[0,40],[.2,31],[.44,24],[.55,31],[.66,34],[.78,30],[.88,21],[.94,13],[.98,7],[1,2.5]]),d=xe([[0,-46],[.3,-40],[.5,-33],[.7,-27],[.88,-27],[.94,-31],[.975,-41],[1,-58]]),p=(g,v)=>{const m=Math.cos(v),A=Math.sin(v),M=se(1,.8,I(.42,.6,g));return[c(g)*Math.sign(m)*Math.pow(Math.abs(m),M),G+d(g)+(A>0?u(g):S(g))*Math.sign(A)*Math.pow(Math.abs(A),M),205+g*277]},l=.79,t=.44,r=p(l,t),f=p(l,t+.05),z=p(l,t-.05),h=p(l+.02,t),x=p(l-.02,t),N=new o.Vector3(f[0]-z[0],f[1]-z[1],f[2]-z[2]).cross(new o.Vector3(h[0]-x[0],h[1]-x[1],h[2]-x[2])).normalize(),k=(g,v)=>{const m=Math.sin(v),A=Math.cos(v),M=Math.atan2(m,Math.abs(A)),B=se(.52,.2,ee((g-.64)/.36,0,1)),T=M+B,w=I(.64,.7,g);return{dl:T,mt:w,mouth:w*Math.exp(-(T/.045)*(T/.045))}};return{pos:(g,v)=>{const m=g*C,A=v,M=p(A,m),B=G+d(A);let T=M[0],w=M[1]-B;const F=Math.hypot(T,w)||1;T/=F,w/=F;const q=I(.52,.4,A),R=Math.min(1,c(A)/14);let D=q*(1.2+.8*I(.3,0,A))*Math.sin(M[2]*.3+8*s(M[0]*.028,M[1]*.028,M[2]*.016))*(.75-.25*w);D+=1.5*s(M[0]*.045,M[1]*.045,M[2]*.045)+.6*s(M[0]*.13,M[1]*.13,M[2]*.13);const P=Math.abs(M[0])-r[0],W=M[1]-r[1],E=M[2]-r[2],_=Math.hypot(P,W,E);D+=4.6*Math.exp(-(((_-13)/3.6)**2))*(1+.9*ee(W/12,-.7,1))-1.6*Math.exp(-((_/10.5)**2));const V=k(A,m);return D+=V.mt*(-1.6*Math.exp(-((V.dl/.07)**2))+1.1*I(0,.1,V.dl)*I(.5,.15,V.dl)),D+=2.2*I(.5,.62,A)*I(.8,.66,A)*Math.max(0,w)*Math.max(0,w),D*=R,[M[0]+T*D,M[1]+w*D,M[2]]},attr:(g,v,m)=>{const A=g*C,M=v,B=k(M,A),T=.5*(c(M)+u(M)),w=Math.hypot(Math.abs(m[0])-r[0],m[1]-r[1],m[2]-r[2]);return{aUv:[(g-.5)*C*Math.max(T,16),205+M*277],aFeat:[Math.max(B.mouth,.55*Math.exp(-(((w-11.8)/2.2)**2))),I(.83,.92,M)*(.6+.4*I(-.75,-.3,B.dl)),I(-.15,-.75,Math.sin(A))*.9]}},eye:new o.Vector3(r[0],r[1],r[2]),eyeN:N,tip:new o.Vector3(0,G+d(1),482),Z0:205,LEN:277,cy:d}}const ft=`
${de}
uniform float uBlink; varying vec3 vD;
void main(){
  vec3 d=normalize(position); vD=d;
  float up=mix(.74,-.1,uBlink)-.34*d.x*d.x, lo=mix(-.74,-.1,uBlink)+.24*d.x*d.x;
  float lc=max(smoothstep(up-.07,up+.05,d.y),smoothstep(lo+.07,lo-.05,d.y));
  vec3 p=position+d*lc*.9; vec3 n=normal;
  ${ve}
}`,ht=`
${ce}
${he}
uniform float uBlink; uniform vec2 uLook; uniform vec3 cIrisA, cIrisB, cLid;
varying vec3 vD;
void main(){
  vec3 d=normalize(vD), N=normalize(vN+vec3(0.,1e-6,0.)), V=normalize(cameraPosition-vW);
  float up=mix(.74,-.1,uBlink)-.34*d.x*d.x, lo=mix(-.74,-.1,uBlink)+.24*d.x*d.x;
  float lid=max(smoothstep(up-.012,up+.012,d.y),smoothstep(lo+.012,lo-.012,d.y));
  vec3 c=normalize(vec3(uLook,1.));
  vec3 tx=normalize(cross(vec3(0.,1.,0.),c)), ty=cross(c,tx);
  vec2 q=vec2(dot(d,tx),dot(d,ty)); float rr=length(q)+step(dot(d,c),0.);
  float bands=fbm(vec2(q.x*1.6+uTime*.02,q.y*9.+fbm(q*4.+uTime*.03)*2.4));
  vec3 iris=mix(cIrisA,cIrisB,smoothstep(.25,.75,bands));
  iris=mix(iris,cIrisB*1.25,smoothstep(.1,.0,length((q-vec2(.4,-.16))*vec2(1.,1.6))));   // a great spot
  { vec2 qn=q/max(rr,1e-3); float fib=fbm(qn*5.5+3.)*.6+vn(qn*17.+rr*2.+9.)*.4;          // radial fibres, coarse and fine
    iris*=.3+1.5*fib*fib+.5*fib; }
  iris=mix(iris,cIrisB*1.25,smoothstep(.6,.36,rr)*.5);                                   // an amber collar round the pupil
  iris*=.5+.75*smoothstep(.86,.28,rr);
  float pupil=smoothstep(.3,.25,length(q*vec2(.9,1.)));                                  // a round, calm pupil
  iris*=1.-.72*smoothstep(.5,.74,rr);                                                    // a dark limbal ring
  iris*=1.-.5*smoothstep(.42,.3,rr);                                                     // deepening toward the pupil, so it reads dark through the glow
  iris=mix(iris*(1.-.85*smoothstep(.7,.84,rr)),vec3(.004,.002,.012),pupil);
  vec3 eye=mix(iris,vec3(.02,.012,.035),smoothstep(.82,.88,rr));
  float eyeGain=mix(.62,1.5,smoothstep(90.,420.,length(cameraPosition-vW)));             // a lamp from afar, an amber planet at 60 m
  vec3 col=eye*eyeGain+wtShade(eye*.2,N,V,.92,1.);                                      // the amber glows from within
  col+=vec3(1.,.95,.85)*pow(max(dot(N,normalize(V+normalize(vec3(.25,1.,.15)))),0.),260.)*.9;
  col*=.45+.55*smoothstep(up+.02,up-.22,d.y);                                              // shade under the lid
  float wr=fbm(vec2(d.x*5.,d.y*26.));
  float edge=smoothstep(0.,.09,min(abs(d.y-up),abs(d.y-lo)));
  vec3 lc=wtShade(cLid*(.6+.8*wr)*(.35+.65*edge),N,V,.55,.8);
  col=mix(col,lc,lid);
  gl_FragColor=vec4(col,1.);
  #include <fog_fragment>
}`;async function mt(a,n,i,e){const s=ut(a,e),c=new le(_e);await a.yield(),await c.gridA(a,3,60,104,s.pos,s.attr,!1,!0),await a.yield();const u=new o.Vector3(0,G-42,215),S=new o.Group;S.position.copy(u),S.name="head";const d=new o.Mesh(c.geometry(),qe(n,i,{scale:7.5,starScale:13,starDensity:Math.min(.8,e.starDensity+.12),rim:.4,fillRim:.12,starGain:1.25}));d.position.copy(u).negate(),S.add(d);const p=new o.SphereGeometry(13.6,36,26),l=[];for(const t of[1,-1]){const r=s.eyeN.clone();r.x*=t,r.z+=.1,r.normalize();const f=s.eye.clone();f.x*=t,f.addScaledVector(r,-8.3);const z=new o.ShaderMaterial({uniforms:{...oe(),...n,uBlink:{value:0},uLook:{value:new o.Vector2},cIrisA:{value:i.irisA},cIrisB:{value:i.irisB},cLid:{value:i.skinA.clone().lerp(i.skinB,.35)}},vertexShader:ft,fragmentShader:ht,fog:!0}),h=new o.Mesh(p,z),x=new o.Vector3(0,1,0).cross(r).normalize(),N=r.clone().cross(x);h.quaternion.setFromRotationMatrix(new o.Matrix4().makeBasis(x,N,r)),h.position.copy(f).sub(u),h.name=t>0?"eyeRight":"eyeLeft",S.add(h),l.push({mesh:h,mat:z,center:f,normal:r,look:new o.Vector2})}return{group:S,mesh:d,eyes:l,info:s,pivot:u}}async function pt(a,n,i,e){const s=new le({..._e,aPivot:3,aAxis:3,aFlap:4}),c=xe([[0,.5],[.2,.84],[.45,1],[.7,.8],[.9,.45],[1,.03]]),u=[],S=[],d=t=>{const{root:r,side:f,L:z}=t,h=80,x=[];let N=r.x,k=r.z,b=null;for(let T=0;T<=h;T++){const w=T/h,F=f*(t.beta0+t.sweep*Math.pow(w,1.4));x.push([N,k,F]),b===null&&Math.hypot(N,k)>O&&(b=Math.atan2(N,k)),N+=Math.sin(F)*z/h,k+=Math.cos(F)*z/h}const y=T=>{const w=ee(T,0,1)*h,F=Math.min(h-1,Math.floor(w)),q=w-F,R=x[F],D=x[F+1];return[se(R[0],D[0],q),se(R[1],D[1],q),se(R[2],D[2],q)]},g=[r.x,r.y,r.z],v=[-Math.cos(f*t.beta0),0,Math.sin(f*t.beta0)],m=T=>r.y+t.droop*(4.25*T*(1-T)-T),A=T=>.06+.36*Math.pow(T,1.2),M=(T,w)=>{const F=T*C,q=Math.cos(F),R=Math.sin(F),D=y(w);let P=t.chord*c(w);q<0&&(P*=1+.08*Math.sin(w*44)*-q);const W=t.thick*(1-.78*w)*(.6+.4*q)*(.25+.75*Math.sqrt(c(w))),E=.3*t.thick*(1-.7*w)*R*R*Math.sqrt(c(w)),_=q*P-.18*P,V=R*W*(R>0?1.15:.8)+E+.9*Math.sin(w*30+q*2)*(1-w),L=Math.cos(A(w)),j=Math.sin(A(w)),K=f*(_*L-V*j),X=-Math.cos(D[2]),H=Math.sin(D[2]);return[D[0]+X*K,m(w)+_*j+V*L,D[1]+H*K]};s.grid(18,44,M,(T,w)=>{const F=T*C,q=Math.cos(F),R=Math.sin(F);return{aUv:[q*t.chord*c(w)+(R>0?0:230)+t.uvOff,w*z],aFeat:[0,I(.9,1,q)*.5,R<0?.65:0],aPivot:g,aAxis:v,aFlap:[w,t.phase,t.amp,f]}},f>0,!0);const B=y(.97);u.push({rest:new o.Vector3(B[0],m(.97),B[1]),pivot:g,axis:v,flap:[.97,t.phase,t.amp,f]}),S.push([b===null?Math.atan2(r.x,r.z):b,t.chord*.9/O])};for(const t of[1,-1])await a.yield(),d({root:new o.Vector3(t*198,G-46,150),side:t,L:e.flipL,chord:31,thick:14,beta0:1.05,sweep:1.3,droop:16,phase:0,amp:.3,uvOff:t*37}),await a.yield(),d({root:new o.Vector3(t*150,G-49,-198),side:t,L:e.flipL*.64,chord:40,thick:11,beta0:2.3,sweep:.5,droop:10,phase:.42+e.rearPhase,amp:.15,uvOff:t*91+400});await a.yield();const p=[0,G-50,-252];s.grid(14,16,(t,r)=>{const f=t*C,z=21*Math.pow(1-r,.8)+.3;return[Math.cos(f)*z*(1+.06*Math.sin(r*40)),p[1]-12*r*r+Math.sin(f)*z*.78,p[2]-93*r]},(t,r)=>({aUv:[t*130,r*93+700],aFeat:[0,I(.8,1,r)*.6,Math.sin(t*C)<0?.5:0],aPivot:p,aAxis:[0,1,0],aFlap:[r,.2,.14,0]}),!0,!0);const l=new o.Mesh(s.geometry(),qe(n,i,{scale:8.5,starScale:21,starDensity:e.starDensity,flap:!0,rim:.3,tone:.6,rough:.8,fillRim:.35,starGain:1.5,under:1,bounce:.25,fall:1}));return l.frustumCulled=!1,l.name="limbs",{mesh:l,tips:u,gaps:S}}const $e=`
${Ce}
#include <fog_pars_vertex>
attribute vec3 aPivot; attribute vec3 aAxis; attribute vec4 aFlap; attribute vec3 aRib;
uniform float uTime, uTrailT, uDrift, uPeriod, uPx;
varying vec3 vRib; varying float vNearF;
vec3 trail(float k){
  float tau=k*uTrailT; vec2 an;
  vec3 p=wtFlap(position,aPivot,aAxis,aFlap,uStroke-tau/uPeriod,an);
  p.z-=uDrift*tau; p.x+=aFlap.w*12.*k*k+sin(k*9.+uTime*.6+aRib.z)*4.*k; p.y+=cos(k*7.-uTime*.5+aRib.z*2.)*5.*k;
  return p; }
`,dt=`
${$e}
void main(){
  float k=aRib.x;
  vec3 a=(modelViewMatrix*vec4(trail(k),1.)).xyz, b=(modelViewMatrix*vec4(trail(k+.012),1.)).xyz;
  vec3 sd=cross(normalize(b-a+vec3(1e-4,0.,0.)),normalize(a)); sd/=max(length(sd),1e-4);
  vec4 mvPosition=vec4(a+sd*aRib.y*mix(1.3,12.,pow(max(k,0.),.85)),1.);
  vRib=aRib; vNearF=mix(.1,1.,smoothstep(70.,300.,length(a)));   // a trail that fills the view up close would wash it out
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,vt=`
${ce}
#include <fog_pars_fragment>
uniform vec3 cA, cB, cC; varying vec3 vRib; varying float vNearF;
void main(){
  float k=vRib.x, x=vRib.y, core=exp(-x*x*3.5);
  float st=vn(vec2(k*46.-uTime*1.2+vRib.z,x*2.5)), fine=vn(vec2(k*150.-uTime*2.,x*7.+vRib.z));
  vec3 c=mix(cA,mix(cB,cC,smoothstep(.2,.9,k)),smoothstep(0.,.3,k));
  float I=pow(clamp(1.-k,0.,1.),1.5)*smoothstep(0.,.12,k)*core*(.45+.9*st+pow(fine,6.)*3.);
  vec3 col=c*I*1.3*vNearF;
  ${Se}
  gl_FragColor=vec4(col,1.);
}`,Ue=`
${$e}
attribute vec4 aRnd; varying float vI; varying float vK;
void main(){
  #ifdef RIBBON
    float k=fract(aRib.x+uTime*.03*(.5+aRnd.w));
    vec3 p=trail(k)+aRnd.xyz*(2.+24.*k);
    float size=(1.4+2.6*aRnd.w)*(1.-.5*k), I=pow(clamp(1.-k,0.,1.),1.2)*smoothstep(0.,.03,k);
  #else
    vec3 p=position; p.z=mod(position.z-uTime*uDrift*(.45+.8*aRnd.w)+900.,1800.)-900.;
    float k=aRnd.x*.5+.5, size=1.2+3.2*aRnd.w*aRnd.w, I=smoothstep(900.,650.,abs(p.z))*.8;
  #endif
  vec4 mvPosition=modelViewMatrix*vec4(p,1.);
  float px=size*uPx/max(1.,-mvPosition.z), nearK=1.;
  #ifdef RIBBON
    nearK=smoothstep(50.,220.,length(mvPosition.xyz));                  // a paddle's trail seen from inside it is fine drops, not a column of sparks
  #endif
  gl_PointSize=clamp(px,1.6,mix(3.5,9.,nearK));
  vI=I*(.45+.55*sin(uTime*(2.+5.*aRnd.w)+aRnd.w*60.))*min(1.,px/1.6)*1.3*mix(.22,1.,nearK); vK=k;
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Ee=`
#include <fog_pars_fragment>
uniform vec3 cA, cB, cC; varying float vI; varying float vK;
void main(){
  float d=length(gl_PointCoord-.5), a=smoothstep(.5,0.,d);
  vec3 col=mix(cA,mix(cB,cC,smoothstep(.3,.9,vK)),smoothstep(0.,.35,vK))*a*a*vI*2.6;
  ${Se}
  gl_FragColor=vec4(col,1.);
}`;async function gt(a,n,i,e,s){const c=a.rng.fork("dust"),u=new o.Group;u.name="stardust";const S={...oe(),...n,uTrailT:{value:11},uDrift:{value:24},uPeriod:{value:Pe},cA:{value:i.warm},cB:{value:i.magenta},cC:{value:i.teal}},d={transparent:!0,depthWrite:!1,blending:o.AdditiveBlending,fog:!0},p=90,l=[],t=[],r=[],f=[],z=[],h=[];e.forEach((k,b)=>{const y=l.length/3,g=c()*20;for(let v=0;v<=p;v++)for(const m of[-1,1])l.push(k.rest.x,k.rest.y,k.rest.z),t.push(...k.pivot),r.push(...k.axis),f.push(...k.flap),z.push(v/p,m,g);for(let v=0;v<p;v++){const m=y+v*2;h.push(m,m+1,m+3,m,m+3,m+2)}k.index=b});const x=new o.BufferGeometry;x.setAttribute("position",new o.Float32BufferAttribute(l,3)),x.setAttribute("aPivot",new o.Float32BufferAttribute(t,3)),x.setAttribute("aAxis",new o.Float32BufferAttribute(r,3)),x.setAttribute("aFlap",new o.Float32BufferAttribute(f,4)),x.setAttribute("aRib",new o.Float32BufferAttribute(z,3)),x.setIndex(h);const N=new o.Mesh(x,new o.ShaderMaterial({uniforms:S,vertexShader:dt,fragmentShader:vt,side:o.DoubleSide,...d}));N.frustumCulled=!1,N.renderOrder=6,u.add(N),await a.yield();{const b=[],y=[],g=[],v=[],m=[],A=[];for(const T of e)for(let w=0;w<420;w++){b.push(T.rest.x,T.rest.y,T.rest.z),y.push(...T.pivot),g.push(...T.axis),v.push(...T.flap),m.push(c(),0,c()*20);const F=new o.Vector3(c.gauss(),c.gauss(),c.gauss()).multiplyScalar(.5);A.push(F.x,F.y,F.z,c())}const M=new o.BufferGeometry;M.setAttribute("position",new o.Float32BufferAttribute(b,3)),M.setAttribute("aPivot",new o.Float32BufferAttribute(y,3)),M.setAttribute("aAxis",new o.Float32BufferAttribute(g,3)),M.setAttribute("aFlap",new o.Float32BufferAttribute(v,4)),M.setAttribute("aRib",new o.Float32BufferAttribute(m,3)),M.setAttribute("aRnd",new o.Float32BufferAttribute(A,4));const B=new o.Points(M,new o.ShaderMaterial({uniforms:S,defines:{RIBBON:1},vertexShader:Ue,fragmentShader:Ee,...d}));B.frustumCulled=!1,B.renderOrder=7,u.add(B)}if(await a.yield(),s.stardust!==!1){const k=Math.round(2600*(a.quality&&a.quality.detail>0?a.quality.detail:1)),b=[],y=[],g=new Float32Array(k*3),v=new Float32Array(k*4);for(let M=0;M<k;M++){let B,T;do B=c.range(-760,760),T=c.range(G-420,G+480);while(Math.abs(B)<O+30&&T>G-110&&T<G+190);b.push(B,T,c.range(-900,900)),y.push(c.range(-1,1),0,0,c())}const m=new o.BufferGeometry;m.setAttribute("position",new o.Float32BufferAttribute(b,3)),m.setAttribute("aRnd",new o.Float32BufferAttribute(y,4)),m.setAttribute("aPivot",new o.BufferAttribute(g,3)),m.setAttribute("aAxis",new o.BufferAttribute(g.slice(),3)),m.setAttribute("aFlap",new o.BufferAttribute(v,4)),m.setAttribute("aRib",new o.BufferAttribute(g.slice(),3));const A=new o.Points(m,new o.ShaderMaterial({uniforms:S,vertexShader:Ue,fragmentShader:Ee,...d}));A.frustumCulled=!1,A.renderOrder=7,u.add(A)}return u}const De=`
${de}
varying vec2 vUv;
void main(){
  vec3 p=position, n=normal; vUv=uv;
  ${ve}
}`,Ve=`
${ce}
${he}
varying vec2 vUv;
uniform float uTeeth; uniform vec2 uGaps[6]; uniform vec3 cWater;
// The bow in the spray, by the sun's place: a ring 42 degrees from the point opposite the sun (a fainter second ring at 51),
// red outermost, as bright as the sun that makes it. V runs from the drop to the eye.
vec3 wtBow(vec3 V){
  float an=acos(clamp(dot(V,uSunDir),-1.,1.));
  float x1=(an-.733)/.05, x2=(.89-an)/.07;
  vec3 b=vec3(smoothstep(-.4,1.1,x1),1.-min(abs(x1)*.8,1.),1.-smoothstep(-1.1,.4,x1))*exp(-x1*x1);
  b+=vec3(smoothstep(-.4,1.1,x2),1.-min(abs(x2)*.8,1.),1.-smoothstep(-1.1,.4,x2))*exp(-x2*x2)*.3;
  b=mix(vec3(dot(b,vec3(.333))),b,.7);                                 // a pale bow, as by a low sun
  return b*dot(uSunCol,vec3(.3,.5,.2));
}
void main(){
  float ang=vUv.x*6.2831853, a=vUv.x*1770., f=vUv.y;
  vec3 N=normalize(vN+vec3(0.,1e-6,0.)), V=normalize(cameraPosition-vW);
  float wrap=clamp(dot(N,uSunDir)*.5+.5,0.,1.);
  float back=pow(max(dot(-V,uSunDir),0.),3.);
  float sd=dot(N,uSideDir)*.5+.5;
  vec3 neb=mix(uFillA,uFillB,smoothstep(.15,.85,sd));
  float dist=length(cameraPosition-vW);
  #ifdef MIST
    float fwm=fwidth(a)+fwidth(f)*112.;
    vec3 tint=mix(cWater,cWater*vec3(.35,.95,1.05),.6);
   #ifdef CREST
    // Spray standing over the lip, all round the rim where the sea breaks over: f runs up from the sea's edge. Plumes here
    // and there, none where a paddle, the neck or the tail leaves the shell.
    float gapc=0.;
    for(int i=0;i<6;i++){ float d=abs(mod(ang-uGaps[i].x+3.14159265,6.2831853)-3.14159265); gapc=max(gapc,1.-smoothstep(uGaps[i].y*.6,uGaps[i].y*1.5,d)); }
    float fu=clamp(f,0.,1.);
    float plume=.3+1.2*vn(vec2(a*.09,uTime*.05));
    float al=fbm(vec2(a*.034+uTime*.012,fu*1.5-uTime*.2))*smoothstep(0.,.1,fu)*(1.-fu)*(1.-fu)*plume*(1.-gapc);
    float strk=mix(.5,vn(vec2(a*.3,fu*4.-uTime*.7)),1.-smoothstep(1.5,6.,fwm));
    al*=.5+.9*strk;
    vec3 col=tint*(uSunCol*(wrap*wrap*.35+back*1.1)+neb)*al*.42;
    col+=vec3(1.,.55,.3)*uSunCol*back*back*al*.3;
   #else
    float al=fbm(vec2(a*.028+uTime*.02,f*2.2-uTime*.12))*smoothstep(0.,.3,f)*smoothstep(1.,.55,f);
    float strk=mix(.5,vn(vec2(a*.22,f*9.-uTime*.5)),1.-smoothstep(1.5,6.,fwm));          // falling veils inside the mist
    float grain=mix(.5,vn(vec2(a*1.1,f*46.-uTime*1.6)),1.-smoothstep(.3,1.4,fwm));
    al*=.45+.8*strk+.5*(grain-.5);
    vec3 col=tint*(uSunCol*(wrap*wrap*.3+back*.9)+neb*1.1)*al*al*.5;
    col+=vec3(1.,.55,.3)*uSunCol*back*back*al*al*.25;
    { float ab=clamp(al,0.,1.); col+=wtBow(V)*ab*ab*.4; }                                  // the bow stands in the mist under the fall, where the mist is thick enough to show it
   #endif
    col*=smoothstep(12.,110.,dist);                                                       // never a wall of fog in the lens
    ${Se}
    gl_FragColor=vec4(col,1.);
  #else
    // fwa: a pixel's footprint across the fall's ropes, in metres. The ropes run down the fall, so a footprint drawn out along
    // them (the curtain seen from the lip, down its own face) costs a quarter of what it costs across them.
    float fall=pow(max(f,0.),.75)*70.-uTime*6.5, fwa=fwidth(a)+fwidth(fall)*.25;
    float sh=fbm(vec2(a*.085,fall*.045));
    float st=mix(.5,vn(vec2(a*.33,fall*.09)),1.-smoothstep(1.2,5.,fwa));
    float fine=mix(.5,vn(vec2(a*1.25,fall*.3)),1.-smoothstep(.3,1.4,fwa));
    float d3=mix(.5,vn(vec2(a*4.1,fall*.75+3.)),1.-smoothstep(.08,.4,fwa));               // detail that only exists near the camera
    float d4=mix(.5,vn(vec2(a*11.,fall*1.7+7.)),1.-smoothstep(.03,.15,fwa));
    float t1=pow(1.-abs(2.*vn(vec2(a*.55,fall*.05+11.))-1.),6.)*(1.-smoothstep(.5,2.2,fwa));
    float t2=pow(1.-abs(2.*vn(vec2(a*2.3,fall*.14+5.))-1.),7.)*(1.-smoothstep(.12,.6,fwa));
    float thread=clamp(t1+.8*t2+.12*smoothstep(.5,2.2,fwa),0.,1.);                        // foam threads
    float tooth=pow(max(0.,cos(ang*uTeeth)),1.4);
    float dens=sh*.75+st*.5+fine*.28+(d3-.5)*.22+(d4-.5)*.14+(1.-f)*.42-tooth*.5*smoothstep(.6,0.,f);
    float body=smoothstep(.5,1.05,dens);
    float gap=0.;
    for(int i=0;i<6;i++){ float d=abs(mod(ang-uGaps[i].x+3.14159265,6.2831853)-3.14159265); gap=max(gap,smoothstep(uGaps[i].y*1.5,uGaps[i].y*.6,d)); }
    float opn=1.-.92*gap*smoothstep(.03,.18,f);
    float veil=fbm(vec2(a*.045+uTime*.012,fall*.035));
    float fadeDown=pow(clamp(1.-f,0.,1.),.8)*smoothstep(1.,.8,f);
    float rear=smoothstep(.62,.2,abs(ang-3.14159265))*smoothstep(.04,.2,f);          // thinner behind, so plastron and tail show from the entry
    opn*=1.-.6*rear;
    float alpha=body*opn*mix(1.,veil*1.4,smoothstep(.25,1.,f))*fadeDown*.92;
    alpha=max(alpha,(.34+.4*thread)*opn*fadeDown*smoothstep(.0,.06,f));                  // glassy water between the white ropes
    alpha=max(alpha,smoothstep(.03,0.,f)*.85*(1.-tooth*.8)*(1.-gap));
    float lipK=1.-smoothstep(.14,.4,f);
    alpha=max(alpha,.86*lipK*opn*(1.-tooth*.4*smoothstep(.1,0.,f)));                       // no hoop or stars through the top 40 m
    float cl=vn(vec2(a*.055,fall*.028+2.))*vn(vec2(a*.17+5.,fall*.065));
    float clump=smoothstep(.2,.42,cl)*(1.-smoothstep(4.,12.,fwa));                         // torn foam falling in clumps
    alpha=max(alpha,clump*.82*opn*fadeDown);
    float fr=pow(clamp(1.-abs(dot(N,V)),0.,1.),3.);
    float foam=clamp(smoothstep(.72,1.2,dens)*.8+thread*.9+clump*(.45+.5*fine),0.,1.);
    // The lip. Where the sea breaks over the rim it is a bright crest (the top few metres); just under it the water is still
    // whole and bends over as dark glass between the white ropes, and only further down is it all foam. f is held to the
    // curtain's own range before the exponential.
    float fcl=clamp(f,0.,1.);
    float crest=exp(-fcl*24.)*(1.-.85*gap);
    float glass=smoothstep(.012,.05,fcl)*(1.-smoothstep(.07,.24,fcl))*(1.-thread);
    foam=clamp(foam*(1.-.85*glass)+crest*(.5+.5*st),0.,1.);
    vec3 deep=cWater*vec3(.07,.4,.5);
    vec3 light=uSunCol*(wrap*wrap*.5+back*.5)+neb*1.15+uAmb;
    // seen from near enough for a pixel to hold its ropes, the fall is white ropes over dark glass, not one pale sheet
    float nearC=1.-smoothstep(.4,2.,fwa), fm=mix(foam,foam*(.3+.7*foam),nearC);
    vec3 col=mix(deep*1.6,cWater,fm)*light*(.72+(.5+.3*nearC)*st+.3*(fine-.5)+.5*(d3-.5)+.4*(d4-.5)-.1*nearC);
    col+=cWater*light*(crest*(1.+1.6*st)+thread*.3*nearC);                               // the crest and the ropes catch the light
    col+=deep*(.16+.3*fr);                                                                // the fall keeps its teal in nebula light
    col+=neb*fr*.4;
    col+=vec3(1.,.5,.22)*cWater*uSunCol*back*(.25+.75*smoothstep(.3,1.,f))*.55;           // warm where the sun shines through
    vec2 gc=vec2(a*1.2,fall*1.6), gf=fract(gc)-.5; float gr=h21(floor(gc));
    float gl=step(.982,gr)*exp(-dot(gf,gf)*22.)*(1.-smoothstep(.5,2.5,fwa))*smoothstep(8.,60.,dist)+.02*smoothstep(.5,2.5,fwa);
    col+=uSunCol*gl*(wrap+back)*2.6*smoothstep(.1,.6,f);
    col+=wtBow(V)*foam*smoothstep(.04,.3,fcl)*.08;                                       // and, fainter, in the fall's own foam below the glassy lip
    gl_FragColor=vec4(col,alpha);
    #include <fog_fragment>
  #endif
}`,wt=`
#include <fog_pars_vertex>
attribute vec4 aRnd; uniform float uTime, uPx, uSpin; varying float vI;
void main(){
  float ang=position.z+uTime*uSpin*(.6+.8*aRnd.x);
  vec3 p=vec3(sin(ang)*position.x,position.y+sin(uTime*.4+aRnd.w*30.)*1.5,cos(ang)*position.x);
  vec4 mvPosition=modelViewMatrix*vec4(p,1.);
  float size=.7+2.6*aRnd.w*aRnd.w, px=size*uPx/max(1.,-mvPosition.z);
  gl_PointSize=clamp(px,1.5,9.);
  float tw=pow(.5+.5*sin(uTime*(1.5+6.*aRnd.y)+aRnd.w*80.),4.);
  vI=(.22+2.4*tw)*min(1.,px/1.5);
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,yt=`
#include <fog_pars_fragment>
uniform vec3 cIce; varying float vI;
void main(){
  vec2 d=gl_PointCoord-.5; float l=length(d), a=smoothstep(.5,0.,l);
  float star=max(0.,1.-abs(d.x)*abs(d.y)*110.)*smoothstep(.5,.1,l);
  vec3 col=cIce*vI*(a*a+star*.6);
  ${Se}
  gl_FragColor=vec4(col,1.);
}`,Oe=`
${ce}
${he}
uniform vec3 cIce, cAir;
void main(){
  vec3 N=normalize(vN+vec3(0.,1e-6,0.)), V=normalize(cameraPosition-vW);
  #ifdef RING
    float r=length(vL.xy), ang=atan(vL.x,vL.y+1e-4);
    float k=(r-${(O+12).toFixed(1)})/98.;
    float bands=(.35+.65*vn(vec2(r*.13,3.)))*(.5+.5*fbm(vec2(ang*9.+uTime*.03,r*.05)));
    float I=bands*smoothstep(0.,.12,k)*smoothstep(1.,.35,k)/max(abs(dot(N,V)),.16);
    vec3 col=cIce*I*.05*(.5+length(uSunCol)*.3);
  #else
    float rim=pow(clamp(1.-abs(dot(N,V)),0.,1.),3.4);
    float day=clamp(dot(N,uSunDir)*.6+.45,0.,1.);
    vec3 col=mix(vec3(1.,.42,.18),cAir,smoothstep(.1,.6,day))*day*rim*length(uSunCol)*.13+cAir*rim*.03;
    if(!gl_FrontFacing) col*=.4;
    col*=smoothstep(30.,200.,length(cameraPosition-vW));                 // the air's limb is a far thing: no pale wall across the view where the flight goes through it at the lip
  #endif
  ${Se}
  gl_FragColor=vec4(col,1.);
}`;function je(a,n,i,e,s,c){const u=[],S=[];for(let l=0;l<e;l++){const t=s();u.push(t[0],t[1],t[2]),S.push(a(),a(),a(),a())}const d=new o.BufferGeometry;d.setAttribute("position",new o.Float32BufferAttribute(u,3)),d.setAttribute("aRnd",new o.Float32BufferAttribute(S,4));const p=new o.Points(d,new o.ShaderMaterial({uniforms:{...oe(),...n,uSpin:{value:c},cIce:{value:i.ice}},vertexShader:wt,fragmentShader:yt,transparent:!0,depthWrite:!1,blending:o.AdditiveBlending,fog:!0}));return p.frustumCulled=!1,p.renderOrder=5,p}async function xt(a,n,i,e,s){const c=a.rng.fork("rimfall"),u=new o.Group;u.name="rimfall";const S={position:3,normal:3,uv:2},d=new le(S);await d.gridA(a,5,224,14,(g,v)=>{const m=g*C;let A,M;if(v<.07){const B=v/.07;A=O-2.5+4.5*B,M=G+.35-.6*B*B}else{const B=(v-.07)/.93;A=O+2+17*Math.pow(B,1.5),M=G-.25-120*Math.pow(B,1.2)}return[Math.sin(m)*A,M,Math.cos(m)*A]},(g,v)=>({uv:[g,Math.max(0,(v-.07)/.93)]}),!0,!0);const p=[];for(let g=0;g<6;g++)p.push(new o.Vector2(s[g]?s[g][0]:0,s[g]?s[g][1]:.001));const l={...oe(),...n,uTeeth:{value:e.teeth},uGaps:{value:p},cWater:{value:i.water}},t=new o.Mesh(d.geometry(),new o.ShaderMaterial({uniforms:l,vertexShader:De,fragmentShader:Ve,transparent:!0,depthWrite:!1,side:o.DoubleSide,fog:!0}));t.renderOrder=2,u.add(t),await a.yield();const r=new le(S);r.grid(96,6,(g,v)=>{const m=g*C,A=O+8+32*Math.sin(Math.PI*Math.min(1,v*1.05)*.86);return[Math.sin(m)*A,G-42-112*v,Math.cos(m)*A]},(g,v)=>({uv:[g,v]}),!0,!0);const f=new o.Mesh(r.geometry(),new o.ShaderMaterial({uniforms:l,defines:{MIST:1},vertexShader:De,fragmentShader:Ve,transparent:!0,depthWrite:!1,side:o.DoubleSide,blending:o.AdditiveBlending,fog:!0}));f.renderOrder=3,u.add(f),await a.yield();const z=new le(S);z.grid(96,3,(g,v)=>{const m=g*C,A=O+1+13*v;return[Math.sin(m)*A,G-3+30*v,Math.cos(m)*A]},(g,v)=>({uv:[g,v]}),!0,!0);const h=new o.Mesh(z.geometry(),new o.ShaderMaterial({uniforms:l,defines:{MIST:1,CREST:1},vertexShader:De,fragmentShader:Ve,transparent:!0,depthWrite:!1,side:o.DoubleSide,blending:o.AdditiveBlending,fog:!0}));h.renderOrder=3,u.add(h),await a.yield();const x=G-132;u.add(je(c,n,i,3400,()=>[O+14+96*Math.pow(c(),1.7),x+c.gauss()*3.5,c()*C],.035));const N=new o.RingGeometry(O+12,O+110,128,2);N.rotateX(-Math.PI/2);const k={...oe(),...n,cIce:{value:i.ice},cAir:{value:i.air}},b=`${de} void main(){ vec3 p=position, n=normal; ${ve} vL=vec3(position.x,position.z,0.); }`,y=new o.Mesh(N,new o.ShaderMaterial({uniforms:k,defines:{RING:1},vertexShader:b,fragmentShader:Oe,transparent:!0,depthWrite:!1,side:o.DoubleSide,blending:o.AdditiveBlending,fog:!0}));return y.position.y=x,y.renderOrder=4,u.add(y),{group:u,haloU:k}}function bt(a){const n=new o.SphereGeometry(1,56,14,0,C,0,Math.PI/2);n.scale(O+6,190,O+6),n.computeVertexNormals();const i=new o.Mesh(n,new o.ShaderMaterial({uniforms:a,vertexShader:We,fragmentShader:Oe,transparent:!0,depthWrite:!1,side:o.DoubleSide,blending:o.AdditiveBlending,fog:!0}));return i.position.y=G-2,i.renderOrder=4,i.name="atmosphere",i}const Mt=`
${Ne}
${de}
attribute vec3 aCol; attribute vec3 aTipCol; attribute float aTip;
varying vec3 vCol; varying vec3 vTipCol; varying vec2 vTip;
void main(){
  vec3 io=instanceMatrix[3].xyz;
  vec3 q=position; q.xz+=aTip*aTip*.12*vec2(sin(uTime*1.1+io.x*.3+position.y*3.),cos(uTime*.9+io.z*.3+position.x*4.));   // soft tips sway
  vec3 p=(instanceMatrix*vec4(q,1.)).xyz;
  vec3 n=normalize(mat3(instanceMatrix)*normal);
  vCol=aCol; vTipCol=aTipCol; vTip=vec2(aTip,h21(io.xz));
  ${ve}
}`,St=`
${ce}
${he}
varying vec3 vCol; varying vec3 vTipCol; varying vec2 vTip;
void main(){
  vec3 N=normalize(vN+vec3(0.,1e-6,0.)), V=normalize(cameraPosition-vW);
  float t=clamp(vTip.x,0.,1.);                                         // a prong thinner than a pixel: held to the vertices' range before the power
  vec3 alb=vCol*(.35+.75*t)*(.8+.4*fbmB(vL.xz*2.+vL.y*3.,length(fwidth(vL))*2.));
  vec3 col=wtShade(alb,N,V,.8,.55+.45*t);
  float pulse=.65+.35*sin(uTime*1.3+vTip.y*40.+vL.z*.05);
  col+=vTipCol*pow(t,2.5)*(.9+1.5*uNight)*pulse+vTipCol*.06*t;        // fluorescent tips, brighter after dusk
  gl_FragColor=vec4(col,1.);
  #include <fog_fragment>
}`;function At(a){const n=new le({position:3,normal:3,aTip:1});for(let e=0;e<5;e++){const s=e/5*C+a.range(-.4,.4),c=a.range(.25,.75),u=a.range(.7,1.15),S=a.range(.07,.11),d=[[Math.cos(s)*.1,0,Math.sin(s)*.1],[Math.cos(s)*(.1+c*.3*u),.5*u,Math.sin(s)*(.1+c*.3*u)],[Math.cos(s+.5)*(.1+c*.42*u),u,Math.sin(s+.5)*(.1+c*.42*u)]],p=d.map((t,r)=>{const f=S*(1-.38*r),z=[];for(let h=0;h<3;h++){const x=h/3*C+r;z.push(n.vert({position:[t[0]+Math.cos(x)*f,t[1],t[2]+Math.sin(x)*f],normal:[Math.cos(x),.25,Math.sin(x)],aTip:[r*.5]}))}return z});for(let t=0;t<2;t++)for(let r=0;r<3;r++){const f=(r+1)%3;n.quad(p[t][r],p[t+1][r],p[t+1][f],p[t][f])}const l=n.vert({position:[d[2][0],d[2][1]+.06,d[2][2]],normal:[0,1,0],aTip:[1]});for(let t=0;t<3;t++)n.tri(l,p[2][(t+1)%3],p[2][t])}const i=(e,s,c,u,S)=>{const d=n.vert({position:[e,u,s],normal:[0,1,0],aTip:[S]}),p=[],l=[];for(let t=0;t<6;t++){const r=t/6*C,f=Math.cos(r),z=Math.sin(r),h=1+.18*Math.sin(t*2.4+e*9);p.push(n.vert({position:[e+f*c*.66*h,u*.72,s+z*c*.66*h],normal:[f*.6,.8,z*.6],aTip:[S*(t%2?.75:.3)]})),l.push(n.vert({position:[e+f*c*h,-.05,s+z*c*h],normal:[f,.15,z],aTip:[0]}))}for(let t=0;t<6;t++){const r=(t+1)%6;n.tri(d,p[r],p[t]),n.quad(l[t],p[t],p[r],l[r])}};return i(.42,-.3,.36,.34,.8),i(-.45,.12,.2,.3,.25),i(-.2,-.5,.16,.26,.25),n.geometry()}function Ke(a,n,i,e,s){const c=a.rng.fork("coral-"+s),u=At(c),S=e.length,d=new o.ShaderMaterial({uniforms:{...oe(),...n},vertexShader:Mt,fragmentShader:St,side:o.DoubleSide,fog:!0}),p=new o.InstancedMesh(u,d,Math.max(1,S)),l=new Float32Array(Math.max(1,S)*3),t=new Float32Array(Math.max(1,S)*3),r=new o.Matrix4,f=new o.Quaternion,z=new o.Quaternion,h=new o.Vector3(0,1,0),x=new o.Vector3,N=[U(i.magenta,i.sand,.45),U(i.teal,i.violet,.4),U(i.sand,i.warm,.3),U(i.magenta,i.violet,.5)],k=[i.teal.clone().multiplyScalar(1.5),i.magenta.clone().multiplyScalar(1.5),U(i.teal,i.warm,.35).multiplyScalar(1.3)];return e.forEach((b,y)=>{f.setFromUnitVectors(h,b.n),z.setFromAxisAngle(h,c()*C),f.multiply(z),x.set(b.s*c.range(.8,1.3),b.s*c.range(.8,1.5),b.s*c.range(.8,1.3)),p.setMatrixAt(y,r.compose(b.p,f,x));const g=c.pick(N).clone().multiplyScalar(c.range(.5,.85)),v=c.pick(k);l.set([g.r,g.g,g.b],y*3),t.set([v.r,v.g,v.b],y*3)}),u.setAttribute("aCol",new o.InstancedBufferAttribute(l,3)),u.setAttribute("aTipCol",new o.InstancedBufferAttribute(t,3)),p.count=S,p.instanceMatrix.needsUpdate=!0,p.frustumCulled=!1,p.name="coral-"+s,p}async function kt(a,n,i,e){const s=a.rng.fork("coralSpots"),c=a.noise.n3,u=[],S=[],d=o.Vector3,p=Math.atan2(i.city.x,i.city.z);for(let t=0;u.length<300&&t<9e3;t++){(t&255)===255&&await a.yield();const r=s()<.6,f=r?p+s.range(-.75,1):s()*C,z=s.range(250,280.5),h=Math.sin(f)*z,x=Math.cos(f)*z,N=n.hAt(h,x);if(N<-1.3||N>9||z<268&&N<.2||c(h*.03,7,x*.03)<-.25)continue;const k=1.5,b=(n.hAt(h+k,x)-n.hAt(h-k,x))/(2*k),y=(n.hAt(h,x+k)-n.hAt(h,x-k))/(2*k);u.push({p:new d(h,G+Math.max(N,-.6)-.15,x),n:new d(-b,1.6,-y).normalize(),s:s.range(1.6,3.6)*(s()<.12?1.7:1)})}const l=(t,r)=>{const f=e.pos(t,r);return new d(f[0],f[1],f[2])};await a.yield();for(let t=0;S.length<320&&t<9e3;t++){(t&127)===127&&await a.yield();const r=s()<.22,f=r?s.range(.55,.74):Math.pow(s(),1.5)*.5+.015,z=r?s.range(.3,.7)*Math.PI:s.range(-.12,1.12)*Math.PI,h=(z/C%1+1)%1,x=l(h,f);if(c(x.x*.035,x.y*.035,x.z*.035)+(r?.1:.3-f)<.05)continue;const N=l(h+.01,f).sub(l(h-.01,f)),k=l(h,Math.min(1,f+.01)).sub(l(h,Math.max(0,f-.01))),b=N.cross(k).normalize();b.dot(new d(x.x,x.y-(G+e.cy(f)),0))<0&&b.negate(),S.push({p:x.addScaledVector(b,-.25),n:b,s:s.range(1.8,4.2)*(s()<.1?1.6:1)})}return{rim:u,neck:S}}const He={position:3,normal:3,aCol:3,aWin:3,aGlow:1},Ye=`
${Ne}
${de}
attribute vec3 aCol; attribute vec3 aWin; attribute float aGlow; varying vec3 vCol; varying vec3 vWin; varying float vGlow; varying float vShd;
void main(){
  vec3 p=position, n=normal;
  if(aWin.z<0.) p+=n*.45*sin(uTime*1.7+position.y*.6+position.x*.21);      // sailcloth
  vCol=aCol; vWin=aWin; vGlow=aGlow;
  vShd=wtMapShadow(position.xz,max(position.y-${G.toFixed(1)},0.)+1.);
  ${ve}
}`,Xe=`
${ce}
${he}
uniform vec3 cWarm; varying vec3 vCol; varying vec3 vWin; varying float vGlow; varying float vShd;
void main(){
  vec3 N=normalize(vN+vec3(0.,1e-6,0.)), V=normalize(cameraPosition-vW); if(!gl_FrontFacing) N=-N;
  vec3 alb=vCol*(.8+.4*vn(vL.xz*.7+vL.y));
  wtSh=vShd;
  vec3 col=wtShade(alb,N,V,.75,1.);
  vec2 wc=vWin.xy/vec2(1.7,2.5), wf=fract(wc), wi=floor(wc);
  float win=step(.28,wf.x)*step(wf.x,.72)*step(.3,wf.y)*step(wf.y,.82)*step(.98,vWin.z);
  float hs=h21(wi+floor(vL.xz*.13));
  float on=step(hs,uNight*1.2-.1);
  col=mix(col,col*.3,win*(1.-on));
  col+=cWarm*vec3(1.,.82,.6)*2.5*win*on*(.75+.25*sin(uTime*(1.+hs*3.)+hs*40.));
  col+=cWarm*vGlow*(.5+2.2*uNight);
  gl_FragColor=vec4(col,1.);
  #include <fog_fragment>
}`,zt=`
#include <fog_pars_vertex>
attribute float aRnd; uniform float uTime, uPx, uNight; varying float vI;
void main(){
  vec4 mvPosition=modelViewMatrix*vec4(position,1.);
  float px=(1.6+1.6*aRnd)*uPx/max(1.,-mvPosition.z);
  gl_PointSize=clamp(px,1.8,30.);
  vI=step(aRnd,uNight*1.2-.1)*(.7+.3*sin(uTime*(1.5+aRnd*3.)+aRnd*50.))*min(1.,px/1.8);
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Ft=`
#include <fog_pars_fragment>
uniform vec3 cWarm; varying float vI;
void main(){
  float a=smoothstep(.5,0.,length(gl_PointCoord-.5));
  vec3 col=cWarm*a*a*vI*4.5;
  ${Se}
  gl_FragColor=vec4(col,1.);
}`,Tt=a=>n=>{const i=ee(n,0,1)*(a.length-1),e=Math.min(a.length-2,Math.floor(i)),s=i-e;return[se(a[e][0],a[e+1][0],s),se(a[e][1],a[e+1][1],s)]};function Ze(a,n,i,e,s,c,u){const S=Tt(n);a.grid(c,n.length-1,(d,p)=>{const l=d*C,t=S(p);return[i+Math.cos(l)*t[0],e+t[1],s+Math.sin(l)*t[0]]},(d,p)=>{const l=S(p);return u(d*C*l[0],l[1],p)},!0,!0)}const Nt=(a,n,i)=>{const e=[[a*1.06,-1.5],[a*1.06,.8],[a,1],[a,n],[a*1.09,n+.3],[a*1.09,n+.9],[a*.97,n+1.1]];for(let c=1;c<=6;c++){const u=c/6*1.45;e.push([a*.97*Math.cos(u)*(1+.16*Math.sin(u*2.2)),n+1.1+a*i*Math.sin(u)])}const s=n+1.1+a*i*Math.sin(1.45);return e.push([a*.07,s+a*.12],[a*.05,s+a*.45],[.02,s+a*.55]),e},Rt=(a,n)=>[[a*1.35,-1.5],[a*1.35,.8],[a,1],[a*.85,n*.6],[a*1.55,n*.63],[a*1.55,n*.665],[a*.8,n*.675],[a*.72,n*.84],[a*1.05,n*.87],[a*.95,n*.92],[a*.3,n*.975],[.03,n]];async function Bt(a,n,i,e,s){const c=a.rng.fork("city"),u=new le(He),S=s.city.x,d=s.city.z,p=()=>U(e.sand,e.warm,c.range(0,.4)).multiplyScalar(c.range(.55,.75)),l=[e.teal.clone().multiplyScalar(.7),e.teal.clone().multiplyScalar(.7),U(e.magenta,e.sand,.3).multiplyScalar(.7),e.sand.clone().multiplyScalar(.9),U(e.teal,e.violet,.5)],t=(y,g,v,m,A,M)=>{const B=p(),T=c.pick(l),w=m+1.1+v*A*Math.sin(1.45);Ze(u,Nt(v,m,A),y,G+n.hAt(y,g),g,M,(F,q)=>{const R=q>m+1,D=R?T:B;return{aCol:[D.r,D.g,D.b],aWin:[F,q-.6,q>.95&&q<m+.05?1:0],aGlow:q>w?1:0}})},r=(y,g,v,m)=>{const A=p(),M=c.pick(l);Ze(u,Rt(v,m),y,G+n.hAt(y,g),g,8,(B,T)=>{const w=T>m*.86,F=w?M:A;return{aCol:[F.r,F.g,F.b],aWin:[B,T*.5,T>.95&&T<m*.6+.05||T>m*.675-.05&&T<m*.84+.05?1:0],aGlow:T>m*.97?1:T>m*.69&&T<m*.83?.25:0}})};t(S,d,9.5,8,1.05,20),await a.yield();const f=c()*C;for(let y=0;y<4;y++){const g=f+y/4*C;r(S+Math.cos(g)*14.5,d+Math.sin(g)*14.5,1.5,c.range(30,36)),await a.yield()}const z=[[S,d,17]];let h=0,x=0,N=0;for(;h++<400&&x<30;){const y=c()*C,g=c.range(20,42),v=S+Math.cos(y)*g,m=d+Math.sin(y)*g,A=c.range(2.6,5.4)*(g<28?1.15:1);n.hAt(v,m)<2.5||z.some(M=>Math.hypot(M[0]-v,M[1]-m)<M[2]+A+1.2)||(z.push([v,m,A]),(z.length&1)===0&&await a.yield(),N<6&&c()<.2?(r(v,m,1.1,c.range(17,26)),N++):(t(v,m,A,c.range(4,8.5),c.range(.8,1.25),9),x++))}const k=new o.ShaderMaterial({uniforms:{...oe(),...i,cWarm:{value:e.warm}},vertexShader:Ye,fragmentShader:Xe,side:o.DoubleSide,fog:!0}),b=new o.Mesh(u.geometry(),k);return b.name="city",{mesh:b,mat:k}}function Gt(a,n,i,e,s){const c=a.rng.fork("ships"),u=new le(He),S=new o.Group;S.name="ships";for(let p=0;p<s.ships;p++){let l,t,r=0;do l=p/s.ships*C+c.range(-.15,.15),t=c.range(s.coast+16,O-13);while(n.hAt(Math.sin(l)*t,Math.cos(l)*t)>-1.5&&r++<8);const f=Math.sin(l)*t,z=Math.cos(l)*t,h=Math.cos(l),x=-Math.sin(l),N=c.range(7,10),k=N/8,b=(v,m,A)=>[f+h*v-x*A,G+m,z+x*v+h*A],y=new o.Color(.16,.08,.05).lerp(e.sand,c.range(0,.3)),g=(c()<.3?U(e.magenta,e.warm,.35):U(e.warm,e.sand,c.range(.1,.5))).multiplyScalar(.7);u.grid(8,6,(v,m)=>{const A=v*2-1,M=Math.pow(Math.max(0,1-A*A),.6)*2.4*k,B=m*Math.PI;return b(A*N+(1-Math.sin(B))*.6*A,1.5*k-Math.sin(B)*2.3*k*(.7+.3*(1-A*A))+A*A*.9,Math.cos(B)*M)},(v,m)=>({aCol:[y.r,y.g,y.b],aWin:[0,0,0],aGlow:0}),!1,!1);for(const v of[[-.25,15.5,6.2],[.45,11.5,4.6]]){const m=v[0]*N,A=v[1]*k,M=v[2]*k;u.grid(3,4,(w,F)=>{const q=1-F*.92;return b(m+(w-.35)*M*q,2.2*k+F*A,Math.sin(w*Math.PI)*1.3*k*q+.3)},(w,F)=>({aCol:[g.r,g.g,g.b],aWin:[0,0,-1],aGlow:0}),!1,!1);const B=u.vert({position:b(m,2.6*k+A,.3),normal:[0,1,0],aCol:[.1,.06,.04],aGlow:1.2}),T=[];for(let w=0;w<3;w++){const F=w/3*C;T.push(u.vert({position:b(m+Math.cos(F)*.3,1.2*k,.3+Math.sin(F)*.3),normal:[Math.cos(F)*h,.2,Math.cos(F)*x],aCol:[.12,.07,.05],aGlow:0}))}for(let w=0;w<3;w++)u.tri(B,T[(w+1)%3],T[w])}}const d=new o.Mesh(u.geometry(),i);return d.frustumCulled=!1,S.add(d),S}function qt(a,n,i,e,s){const c=a.rng.fork("lamps"),u=[],S=[];let d=0;for(;u.length<510&&d++<6e3;){const t=c()*C,r=Math.sqrt(c())*(O-34),f=Math.sin(t)*r,z=Math.cos(t)*r,h=n.hAt(f,z),x=n.eAt(f,z);if(h<2.5||h>46||x<5||x>15||n.fAt(f,z)>.5)continue;const N=c.int(2,6);for(let k=0;k<N;k++){const b=f+c.gauss()*5,y=z+c.gauss()*5,g=n.hAt(b,y);g>2&&(u.push(b,G+g+1.6,y),S.push(c()))}}for(let t=0;t<90;t++){const r=c()*C,f=c.range(8,50),z=s.city.x+Math.cos(r)*f,h=s.city.z+Math.sin(r)*f,x=n.hAt(z,h);x>1.5&&(u.push(z,G+x+1.4,h),S.push(c()*.8))}const p=new o.BufferGeometry;p.setAttribute("position",new o.Float32BufferAttribute(u,3)),p.setAttribute("aRnd",new o.Float32BufferAttribute(S,1));const l=new o.Points(p,new o.ShaderMaterial({uniforms:{...oe(),...i,cWarm:{value:e.warm}},vertexShader:zt,fragmentShader:Ft,transparent:!0,depthWrite:!1,blending:o.AdditiveBlending,fog:!0}));return l.renderOrder=1,l.name="villageLights",l}const Qe=`
${de}
varying vec2 vUv;
#ifdef SHARD
attribute float aRnd; varying float vR;
#endif
uniform float uSize;
void main(){
  vec3 p=position, n=normal; vUv=uv;
  #ifdef SHARD
    p=(instanceMatrix*vec4(position,1.)).xyz; n=normalize(mat3(instanceMatrix)*normal); vR=aRnd;
  #endif
  ${ve}
  #ifdef BILLBOARD
    mvPosition=modelViewMatrix*vec4(0.,0.,0.,1.); mvPosition.xy+=position.xy*uSize; gl_Position=projectionMatrix*mvPosition;
  #endif
}`,_t=`
${ce}
${he}
varying vec2 vUv; uniform vec3 cSun, cGold; uniform float uSunAng;
void main(){
  #if defined(BILLBOARD)
    vec2 d=vUv-.5; float r=length(d)*2.;
    float I=pow(max(0.,1.-r),3.)*1.3+exp(-r*r*45.)*2.+pow(max(0.,1.-r),2.)*.22*pow(abs(sin(atan(d.y,d.x)*6.+uTime*.1)),10.);
    vec3 col=cSun*I*smoothstep(1.,.72,r);
  #elif defined(HOOP)
    float ang=vUv.x*6.2831853, d=abs(mod(ang-uSunAng+3.14159265,6.2831853)-3.14159265);
    float stud=smoothstep(.12,0.,abs(fract(vUv.x*72.)-.5));
    float run=pow(.5+.5*sin(ang*36.+uTime*1.2),8.);
    vec3 col=cGold*(.34+stud*1.2+run*.3+3.4*exp(-d*d*60.)+.6*exp(-d*d*4.));
  #elif defined(GIMBAL)
    vec3 col=cGold*(1.5+2.*smoothstep(.12,0.,abs(fract(vUv.x*24.)-.5)));
  #else
    vec3 N=normalize(vN+vec3(0.,1e-6,0.)), V=normalize(cameraPosition-vW);
    vec3 col=cSun*(5.+2.6*fbm(vL.xy*.35+uTime*.12)+2.*pow(clamp(1.-abs(dot(N,V)),0.,1.),2.));
  #endif
  ${Se}
  gl_FragColor=vec4(col,1.);
}`,Dt=`
${ce}
${he}
uniform vec3 cIce; varying float vR;
void main(){
  vec3 N=normalize(vN+vec3(0.,1e-6,0.)), V=normalize(cameraPosition-vW);
  float fr=pow(clamp(1.-abs(dot(N,V)),0.,1.),2.), sd=dot(N,uSideDir)*.5+.5, wrap=clamp(dot(N,uSunDir)*.5+.5,0.,1.);
  float sp=pow(max(dot(N,normalize(uSunDir+V)),0.),50.);
  float tw=pow(.5+.5*sin(uTime*(1.+3.*vR)+vR*70.+dot(N,vec3(3.,5.,7.))),6.);
  vec3 col=cIce*(.14+.5*fr+.3*wrap*wrap)+mix(uFillA,uFillB,sd)*(.45+fr)+uSunCol*sp*2.+cIce*tw*1.7;
  gl_FragColor=vec4(col,1.);
  #include <fog_fragment>
}`;function Vt(a,n,i){const e=new o.Group;e.name="sunHoop",e.position.set(0,G,0);const s=new o.Vector3(Math.cos(i.hoopYaw),0,-Math.sin(i.hoopYaw)),c=new o.Vector3(0,1,0),u=s.clone().cross(c);e.quaternion.setFromRotationMatrix(new o.Matrix4().makeBasis(s,c,u));const S={...oe(),...a,cSun:{value:n.sun},cGold:{value:n.gold},uSunAng:{value:0},uSize:{value:95}},d=(r,f={})=>new o.ShaderMaterial({uniforms:S,defines:r,vertexShader:Qe,fragmentShader:_t,fog:!0,...f}),p=new o.Mesh(new o.TorusGeometry(Te,1.9,4,320),d({HOOP:1}));p.frustumCulled=!1,e.add(p);const l=new o.Group;l.name="sun",e.add(l),l.add(new o.Mesh(new o.IcosahedronGeometry(15,3),d({}))),l.add(new o.Mesh(new o.TorusGeometry(23,1.3,4,48),d({GIMBAL:1})));const t=new o.Mesh(new o.PlaneGeometry(2,2),d({BILLBOARD:1},{transparent:!0,depthWrite:!1,blending:o.AdditiveBlending}));return t.frustumCulled=!1,t.renderOrder=8,l.add(t),{hoop:e,sun:l,uni:S,dir:s,normal:u}}function It(a,n,i,e){const s=a.rng.fork("portalRing"),c=new o.Group;c.name="portalRing",c.position.copy(e.position),c.quaternion.setFromUnitVectors(new o.Vector3(0,1,0),e.facing);const u=new o.Group;c.add(u);const S=230,d=new o.OctahedronGeometry(1,0),p=new Float32Array(S),l=new o.InstancedMesh(d,new o.ShaderMaterial({uniforms:{...oe(),...n,cIce:{value:i.ice}},defines:{SHARD:1},vertexShader:Qe,fragmentShader:Dt,fog:!0}),S),t=new o.Matrix4,r=new o.Quaternion,f=new o.Euler,z=new o.Vector3,h=new o.Vector3;for(let x=0;x<S;x++){const N=s()*C,k=s()<.12,b=25+s.gauss()*(k?1.2:2.4),y=k?s.range(1.2,2):s.range(.3,.95);h.set(Math.sin(N)*b,s.gauss()*1.7,Math.cos(N)*b),f.set(s()*C,s()*C,s()*C),r.setFromEuler(f),z.set(y,y*s.range(2.2,4.5),y*s.range(.7,1.2)),l.setMatrixAt(x,t.compose(h,r,z)),p[x]=s()}return d.setAttribute("aRnd",new o.InstancedBufferAttribute(p,1)),l.instanceMatrix.needsUpdate=!0,l.frustumCulled=!1,u.add(l),c.add(je(s,n,i,650,()=>[25+s.gauss()*3.4,s.gauss()*2.6,s()*C],.22)),{group:c,spin:u}}async function Ct(a,n={}){const i=a.rng,e=o.Vector3,s=a.quality&&a.quality.detail>0?a.quality.detail:1,c=(Array.isArray(n.palette)&&n.palette.length>=7?n.palette:Je).map(et),[,u,S,d,p,l,t]=c,r=new o.Color(1,1,1),f=i.range(1.2,1.7),z=i.range(233,240),h={scute:i.range(84,104),scuteOff:[i.range(-35,35),i.range(-35,35)],coast:z,teeth:i.int(22,30),city:{x:Math.sin(f)*(z-31),z:Math.cos(f)*(z-31)},peaks:[{x:i.range(-18,18),z:i.range(-24,12),r:i.range(116,130),h:i.range(132,146),f:.0105,o:i.range(0,60)}],starDensity:i.range(.45,.7),flipL:i.range(205,225),rearPhase:i.range(-.08,.12),ships:i.int(10,14),hoopYaw:.61+i.range(-.2,.2)};for(let $=i.int(2,4);$>0;$--){const Y=f+i.range(1.9,5.4),ae=i.range(118,180);h.peaks.push({x:Math.sin(Y)*ae,z:Math.cos(Y)*ae,r:i.range(42,66),h:i.range(22,48),f:.021,o:i.range(0,60)})}const x=i.pick(["indigo","teal","plum"]),N=u.clone().multiplyScalar(2.7),k={skinA:x==="indigo"?U(N,d,.14):x==="teal"?U(d,N,.55).multiplyScalar(.7):U(N,S,.22).multiplyScalar(.85),skinB:x==="teal"?U(p,d,.6).multiplyScalar(.5):U(d,N,.5).multiplyScalar(.6),seam:U(l,d,.72).multiplyScalar(.36),belly:U(N,l,.3).multiplyScalar(.5),horn:U(l,N,.25).multiplyScalar(.75),star:t.clone(),line:d.clone(),warm:t.clone(),magenta:S.clone(),teal:d.clone(),violet:N,sand:l.clone().multiplyScalar(.85),grassA:p.clone().multiplyScalar(.95),grassB:U(l,p,.25).multiplyScalar(.75),grassC:U(S,l,.45).multiplyScalar(.6),moss:U(p,d,.45).multiplyScalar(.5),forest:U(p,u,.35).multiplyScalar(.42),rockA:new o.Color(.1,.085,.15),rockB:new o.Color(.2,.18,.27),shallow:d.clone().multiplyScalar(.75),deep:U(N,d,.3).multiplyScalar(.5),cherry:U(S,t,.25),water:U(r,d,.3).multiplyScalar(.72),ice:U(r,d,.25),air:new o.Color(.2,.45,1),irisA:new o.Color(.8,.2,.02).lerp(new o.Color(.72,.36,.02),i()),irisB:new o.Color(1,.52,.09),sun:new o.Color(1,.72,.38),gold:U(l,t,.5)},b={uSunDir:{value:new e(.5,.6,-.4).normalize()},uSunCol:{value:new o.Color(2.4,2.1,1.7)},uFillA:{value:S.clone().multiplyScalar(.5)},uFillB:{value:d.clone().multiplyScalar(.46)},uAmb:{value:N.clone().multiplyScalar(.55)},uSideDir:{value:new e(1,0,0)},uTime:{value:0},uNight:{value:0},uStroke:{value:0},uPx:{value:470}},y=new o.Group;y.name="worldTurtle";const g=await tt(a,h);b.uMap={value:g.tex},b.uMapR={value:fe},await a.yield();const v=await ot(a,g,b,k,h);y.add(v),await a.yield();let m=null;n.trees!==!1&&(m=await rt(a,g,b,k,h,typeof n.trees=="number"?n.trees:Math.round(6500*s)),y.add(m)),await a.yield(),await a.yield(),y.add(await ct(a,b,k,h)),await a.yield();const A=await mt(a,b,k,h);y.add(A.group),await a.yield();let M=null;if(n.coral!==!1){const $=await kt(a,g,h,A.info);await a.yield();const Y=Ke(a,b,k,$.rim,"rim");y.add(Y),await a.yield();const ae=Ke(a,b,k,$.neck,"neck");ae.position.copy(A.pivot).negate(),A.group.add(ae),M={rim:Y,neck:ae},await a.yield()}const B=await pt(a,b,k,h);y.add(B.mesh),await a.yield(),y.add(await gt(a,b,k,B.tips,n)),await a.yield();const T=await xt(a,b,k,h,[[0,.2],[Math.PI,.1],...B.gaps]);y.add(T.group),await a.yield();let w=null;n.atmosphere!==!1&&(w=bt(T.haloU),y.add(w));let F=null,q=null;if(await a.yield(),n.city!==!1&&(F=await Bt(a,g,b,k,h),y.add(F.mesh)),await a.yield(),n.ships!==!1){const $=F?F.mat:new o.ShaderMaterial({uniforms:{...oe(),...b,cWarm:{value:k.warm}},vertexShader:Ye,fragmentShader:Xe,side:o.DoubleSide,fog:!0});q=Gt(a,g,$,k,h),y.add(q)}await a.yield(),y.add(qt(a,g,b,k,h)),await a.yield();const R=Vt(b,k,h);n.sun===!1&&(R.hoop.visible=!1),y.add(R.hoop);const D=A.eyes[0].center.clone(),P=A.eyes[1].center.clone(),W=A.info.tip.clone(),E=new e(0,G-28,W.z+180),_=new e(D.x+58,D.y-2,D.z-8),V=new e(Math.sin(.454),0,Math.cos(.454)),L=new e(h.city.x,G+g.hAt(h.city.x,h.city.z),h.city.z),j=Math.atan2(h.city.x,h.city.z),K=h.peaks[0],X=new e(K.x,G+g.hAt(K.x,K.z),K.z),H=B.tips[0].rest.x,Q=[new e(-30,G+250,-600),new e(40,G+185,-400),new e(105,G+105,-200),new e(140,G+62,-60),new e(h.city.x-18,G+58,h.city.z-12),new e(Math.sin(j+.04)*306,G+34,Math.cos(j+.04)*306),new e(H-15,G-45,62),new e(H+48,G-78,150),new e(H+5,G-60,268),new e(255,G-34,352),_.clone()];for(const $ of[Q[2],Q[3],Q[4]])$.y=Math.max($.y,G+Math.max(0,g.hAt($.x,$.z))+38);const ie=[new e(-30,G+250,-600),new e(40,G+185,-400),new e(105,G+105,-200),new e(140,G+62,-60),new e(h.city.x-40,G+58,h.city.z+10),new e(150,G+44,215),new e(152,G+5,300),new e(132,G-12,360),_.clone()],me={portalSeat:{position:E,facing:V},flyThrough:Q,flyThroughShoulder:ie,viewpoints:{entry:Q[0].clone(),overCity:Q[4].clone(),flank:Q[7].clone(),eye:_.clone()},lookAt:{world:new e(0,G+40,0),city:L.clone().setY(L.y+12),eye:D.clone(),head:new e(0,G-30,400)},peak:X,city:L,eyeRight:D,eyeLeft:P,beakTip:W,head:new e(0,G-30,400),flipperTips:B.tips.map($=>$.rest.clone()),schoolCenter:new e(O+95,G-62,30),sunHoop:{center:new e(0,G,0),radius:Te,normal:R.normal.clone()},rimRadius:O,seaY:G,lipBearing:Math.max(j+.04,Math.atan2(B.tips[0].rest.x,B.tips[0].rest.z)+.24),flipperRoot:new e(198,G-46,150)};await a.yield();let ne=null;n.portalRing!==!1&&(ne=It(a,b,k,me.portalSeat),y.add(ne.group));const Ae=xe([[0,58],[.3,30],[.42,14],[.52,4],[.7,-5],[1,-12]]),re={progress:typeof n.progress=="number"?n.progress:null,sunAngle:null,blink:null},Z={direction:new e(0,1,0),position:new e,color:new o.Color,night:0},be=new e,te=new e,pe=new e,Me=new o.Vector2,ke=new o.Color(2.1,1.9,1.55),J=new o.Color(2.2,1.25,.62);let ue=!0;function ze($,Y,ae){const ge=re.progress!==null?ee(re.progress,0,1):.5-.5*Math.cos(Y*.045+1),we=re.sunAngle!==null?re.sunAngle:Ae(ge)*Math.PI/180;b.uTime.value=Y,b.uStroke.value=Y/Pe,be.copy(R.dir).multiplyScalar(Math.cos(we)),be.y=Math.sin(we),R.sun.position.set(Te*Math.cos(we),Te*Math.sin(we),0),R.uni.uSunAng.value=we,y.updateMatrixWorld(),b.uSunDir.value.copy(be).transformDirection(y.matrixWorld),b.uSideDir.value.set(1,0,0).transformDirection(y.matrixWorld),b.uSunCol.value.copy(J).lerp(ke,I(.05,.6,we)).multiplyScalar(se(.5,1,I(-.07,.02,we))),b.uNight.value=I(.33,.03,we),Z.direction.copy(b.uSunDir.value),R.sun.getWorldPosition(Z.position),Z.color.copy(b.uSunCol.value),Z.night=b.uNight.value,A.group.rotation.y=.034*Math.sin(Y*.23)+.012*Math.sin(Y*.61+2),A.group.rotation.x=.02*Math.sin(Y*.17+1),q&&(q.rotation.y=Y*.0045),ne&&(ne.spin.rotation.y=Y*.11);let Re=re.blink;Re===null&&(Re=re.progress!==null?I(.763,.775,ge)*I(.803,.7896,ge):I(0,.35,Y%11/1.9)*I(1,.5,Y%11/1.9));for(const ye of A.eyes)if(ye.mat.uniforms.uBlink.value=ee(Re,0,1),ae){te.setFromMatrixPosition(ae.matrixWorld),ye.mesh.worldToLocal(te).normalize(),te.z>-.15?pe.set(te.x,te.y,0).multiplyScalar(.55/Math.max(te.z,.4)):pe.set(.12,0,0),pe.length()>.42&&pe.setLength(.42);const Ie=ue||!($>0)?1:1-Math.exp(-$*2.2);ye.look.x+=(pe.x-ye.look.x)*Ie,ye.look.y+=(pe.y-ye.look.y)*Ie,ye.mat.uniforms.uLook.value.copy(ye.look)}ae&&a.renderer&&(a.renderer.getDrawingBufferSize(Me),b.uPx.value=.5*Me.y*ae.projectionMatrix.elements[5]),ue=!1}ze(0,0,null);const Fe={object:y,radius:360,extent:480,height:330,center:new e(0,G,70),anchors:me,ground:!1,groundY:0,seaY:G,update:ze,setProgress($){re.progress=$},setSunAngle($){re.sunAngle=$===void 0?null:$},setBlink($){re.blink=$===void 0?null:$},sun:Z,heightAt:($,Y)=>G+Math.max(0,g.hAt($,Y)),isLand:($,Y)=>Math.hypot($,Y)<O&&g.hAt($,Y)>.3,parts:{shell:v,trees:m,city:F&&F.mesh,ships:q,sunGroup:R.sun,hoop:R.hoop,portalRing:ne&&ne.group,headGroup:A.group,atmosphere:w,coral:M},uniforms:b,dispose(){g.tex.dispose()}};return Object.defineProperty(y.userData,"hero",{value:Fe,enumerable:!1}),Fe}function Wt(a){const n=a.seaY,i=a.flyThrough.map(y=>[y.x,y.y,y.z]),e=a.flipperTips[0],s=a.portalSeat.position,c=a.portalSeat.facing,u=a.lipBearing,S=[Math.sin(u)*306,n+34,Math.cos(u)*306],d=a.flipperRoot.y-30,p=[[-80,n+142,-1e3],[-42,n+170,-700],...i.slice(1,5)],l=i[10];p.push(S,[e.x+85,d,e.z-65],[e.x+150,a.flipperRoot.y-52,175],[e.x+120,n-77,268],[238,n-37,328],l.slice());const t=90,r=105,f=[s.x+c.x*r,s.z+c.z*r],z=[f[0]+c.z*t,f[1]-c.x*t],h=-.52,x=Math.atan2(c.x,-c.z),N=y=>[z[0]+t*Math.cos(y),z[1]+t*Math.sin(y)],k=N(h);p.push([l[0]-20,n-13,l[2]+66],[l[0]+8,n-17,l[2]+150]);const b=7;for(let y=0;y<=b;y++){const g=N(h+(x-h)*y/b);p.push([g[0],n-22-6*Math.min(1,y/3),g[1]])}return p.push([s.x+c.x*55,s.y,s.z+c.z*55],[s.x,s.y,s.z]),{pts:p,lip:S,loopCentre:z,index:{tail:2,aft:3,rim:6,out:7,flank:8,turn:9,neck:10,eye:11,beak:12,leg:13,loop:14,loopEnd:14+b}}}export{Ct as buildHero,Wt as flightRoute};
