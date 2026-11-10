import*as l from"three";import{ConvexGeometry as Qo}from"three/addons/geometries/ConvexGeometry.js";import{mergeGeometries as Yo}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as Rt,lerp as st,smoothstep as y,makeRng as Be,hashSeed as De}from"../kit/core.js";const Jo=["#DDE3D2","#A81F2B","#D8922A","#6B3A2E","#C7D5DF","#3A4350","#F4DDB8"],Tt={x0:-1150,x1:1150,z0:-1950,z1:450,res:2048},_t={x0:-1300,x1:1300,z0:-700,z1:560,w:256,h:128},ne={x0:-216,x1:216,z0:-250,z1:14,w:288,h:176},je=-1800,ae=[-84,-200],ea=300,Fo=8.5,ge=-36,Bo=50,aa=13,pa=23.4,te=`
uniform float uTime; uniform vec3 uSunL; uniform vec3 uSunCol; uniform vec3 uSkyCol; uniform vec3 uHorizCol;
uniform vec3 uCamL; uniform vec4 uCloud; uniform vec3 uPal[7]; uniform vec3 uHazeCol; uniform float uHaze;
uniform float uSnow; uniform float uGreen; uniform float uAurora; uniform float uMist; uniform vec3 uGap;
float h21(vec2 p){ vec3 q=fract(vec3(p.xyx)*.1031); q+=dot(q,q.yzx+33.33); return fract((q.x+q.y)*q.z); }
float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x), mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x), f.y); }
float fbm(vec2 p){ float a=.5, s=0.; for(int i=0;i<4;i++){ s+=a*vn(p); p=p*2.03+vec2(17.1,9.7); a*=.5; } return s; }
// 1 = in sun, 0 = under cloud. uCloud = (drift x, drift z, scale, coverage); uGap = a hole in the deck that stands
// over one place (x, z, radius; no hole while the radius is 0)
float cloudShadow(vec2 xz){ vec2 q=(xz-uTime*uCloud.xy)*uCloud.z;
  float c=fbm(q)+.22*vn(q*3.3+4.), g=uGap.z>0.?1.-smoothstep(uGap.z*.45,uGap.z,length(xz-uGap.xy)):0.;
  return mix(smoothstep(uCloud.w-.065,uCloud.w+.075,c),1.,g); }
// the sky as wet things mirror it: bright band toward the sun, washed blue above, slate deck away from it
vec3 skyMirror(vec3 d){
  float up=clamp(d.y,0.,1.);
  vec2 h=d.xz/max(length(d.xz),1e-4), s=uSunL.xz/max(length(uSunL.xz),1e-4);
  float west=dot(h,s)*.5+.5;
  vec3 hor=mix(uSkyCol*2.1,uHorizCol,west*west*.7+.3);
  vec3 c=mix(hor,uSkyCol*1.5+vec3(.04,.09,.2)*(1.-uAurora),smoothstep(0.,.6,up));
  float deck=fbm(d.xz/(up+.25)*1.4+uTime*.004);
  c=mix(c,uSkyCol*.85,smoothstep(.45,.7,deck)*smoothstep(.06,.3,up)*(1.-west*.6));
  float au=vn(vec2(d.x/(up+.3)*3.+uTime*.05,d.z*2.))*smoothstep(.1,.5,up);
  return c+uAurora*vec3(.12,1.4,.55)*au*au;
}
// autumn tundra as colour only: crimson bearberry, gold willow, russet cottongrass, pale lichen heath
// fw = the size of a pixel in the units of p: the fine grain fades to its mean where it would alias
vec3 tundraCol(vec2 p,float fw){
  float n1=fbm(p*.0045), n2=fbm(p*.014+7.3), n3=fbm(p*.07+2.1), n4=mix(.5,vn(p*.45),clamp(1.3-fw*1.2,0.,1.));
  vec3 crim=uPal[1]*.5, gold=uPal[2]*.5, rus=uPal[3]*.55, pale=uPal[0]*.46;
  vec3 t=mix(crim,rus,smoothstep(.38,.7,n2));
  t=mix(t,crim*1.25,smoothstep(.5,.75,n3)*.6);
  t=mix(t,uPal[3]*.28+crim*.25,smoothstep(.45,.7,vn(p*.021+5.))*.55);
  t=mix(t,gold,smoothstep(.6,.76,n1*.7+n3*.45)*.7);
  t=mix(t,pale,smoothstep(.6,.78,fbm(p*.009+31.)+n3*.15)*.7);
  t*=.82+.36*n4;
  return mix(t,vec3(.16,.26,.1)+t*.35,uGreen*(.5+.4*n2));
}
`,ze=`varying float vDepth;
#include <fog_pars_vertex>`,Pe=`varying float vDepth;
#include <common>
#include <fog_pars_fragment>`,Ae=`
  col=mix(col,uHazeCol,(1.-exp(-max(vDepth,0.)*uHaze))*.85);
  gl_FragColor=vec4(col,alpha);
  #include <fog_fragment>
`;function ts(s,{orders:et=4,ratio:L=.74,angle:kt=.44,jitter:Nt=.25}={}){const zt=[],pt=(E,O,nt,k,R,at,w)=>{const I=zt.length,D=E+Math.sin(nt)*k,M=O+Math.cos(nt)*k;if(zt.push({id:I,x0:E,y0:O,x:D,y:M,a:nt,len:k,order:R,parent:at,w,kids:[]}),at>=0&&zt[at].kids.push(I),R>=et)return;const d=R<2?3:s.int(2,R===2?4:3),P=kt*Math.pow(.66,R);for(let U=0;U<d;U++){const Z=d===1?0:(U/(d-1)-.5)*2,A=nt*.82+Z*P+s.gauss()*Nt*P*.35;pt(D,M,A,k*L*(1+s.range(-Nt,Nt)),R+1,I,w*.62)}};return pt(0,0,s.range(-.06,.06),1,0,-1,1),zt}function es(s,et,L,kt){let Nt=0,zt=0;for(const d of s)Nt=Math.max(Nt,d.y),zt=Math.max(zt,Math.abs(d.x));const pt=(ae[1]-je)/Nt,E=Rt(940/Math.max(zt,.001),pt/3,pt*3),O=[46,29,19,12,8],nt=ae[1]-je,k=d=>ae[1]-nt*Math.pow(Math.max(d,0)/Nt,2),R=[],at=[],w=(d,P,U,Z)=>{const A={pts:d,w:P,order:U,node:Z,phase:et()};return R.push(A),A},I=new l.CatmullRomCurve3([[kt+12,450],[kt-10,310],[kt+8,170],[kt-4,30],[kt+46,-72],[kt*.73,-126],[kt*.52,-158],[ae[0]-42,ae[1]+13],[ae[0],ae[1]]].map(d=>new l.Vector3(d[0],0,d[1]))).getPoints(48).map(d=>[d.x,d.z]),D=w(I,40,0,-1);for(const d of s){const P=ae[0]+d.x0*E,U=k(d.y0);let Z=ae[0]+d.x*E,A=k(d.y);if(d.kids.length===0&&A>je-30){const V=(je-30-U)/Math.min(A-U,-1);Z=P+(Z-P)*V,A=je-30}const ht=Math.hypot(Z-P,A-U),W=Math.max(4,Math.ceil(ht/20)),n=-(A-U)/ht,p=(Z-P)/ht,$=Math.min(ht*.075,34),b=[];for(let V=0;V<=W;V++){const ut=V/W,K=$*Math.sin(Math.PI*ut)*L.n2(d.id*7.31+ut*2.6,4.4+d.id);b.push([P+(Z-P)*ut+n*K,U+(A-U)*ut+p*K])}at[d.id]=w(b,O[Math.min(d.order,4)]*(.85+.3*et()),d.order,d.id)}const M=R.slice();for(const d of M){const P=d.order===0?3:d.order<3?2:et.chance(.6)?1:0;for(let U=0;U<P;U++){const Z=et.range(.04,.55),A=Math.min(.98,Z+et.range(.22,.42)),j=et.sign(),ht=d.w*1.5+7+et()*11,W=d.pts.length-1,n=Math.floor(Z*W),p=Math.ceil(A*W),$=[];if(!(p-n<3)){for(let b=n;b<=p;b++){const V=d.pts[Math.max(0,b-1)],ut=d.pts[Math.min(W,b+1)],K=d.pts[b],Q=Math.hypot(ut[0]-V[0],ut[1]-V[1])||1,Y=(b-n)/(p-n),C=j*ht*Math.pow(Math.sin(Math.PI*Y),.8)*(1+.3*L.n2(b*.4,d.phase*40));$.push([K[0]-(ut[1]-V[1])/Q*C,K[1]+(ut[0]-V[0])/Q*C])}w($,d.w*et.range(.42,.68),d.order+.5,-2)}}}{const d=s[0].kids.map(P=>at[P]).filter(Boolean);if(d.length){let P=d[0];for(const j of d)j.pts[j.pts.length-1][0]>P.pts[P.pts.length-1][0]&&(P=j);let U=P.pts[P.pts.length-1];for(const j of P.pts)if(j[1]<-455){U=j;break}const Z=[[222,122],[217,72],[225,22],[205,-40],[187,-112],[153,-188],[117,-262],[99,-340],[st(99,U[0],.55),st(-340,U[1],.55)],[U[0],U[1]]],A=new l.CatmullRomCurve3(Z.map(j=>new l.Vector3(j[0],0,j[1]))).getPoints(46).map(j=>[j.x,j.z]);w(A,15,1.5,-2).creek=!0}}return{chans:R,byNode:at,upC:D,sx:E,sz:pt}}function as(s){const et=document.createElement("canvas");et.width=et.height=Tt.res;const L=et.getContext("2d",{willReadFrequently:!0});L.fillStyle="#000",L.fillRect(0,0,Tt.res,Tt.res),L.setTransform(Tt.res/(Tt.x1-Tt.x0),0,0,Tt.res/(Tt.z1-Tt.z0),-Tt.x0*Tt.res/(Tt.x1-Tt.x0),-Tt.z0*Tt.res/(Tt.z1-Tt.z0)),L.globalCompositeOperation="lighten",L.lineJoin="round",L.lineCap="round";const kt=[],Nt=3,zt=14e3,pt=Tt.res/(Tt.x1-Tt.x0);kt.push(()=>{L.getImageData(0,0,1,1)});const E=s.map(nt=>{let k=0;for(let R=1;R<nt.pts.length;R++)k+=Math.hypot(nt.pts[R][0]-nt.pts[R-1][0],nt.pts[R][1]-nt.pts[R-1][1]);return k*pt}),O=(nt,k,R)=>{const at=[];for(let w=0;w<s.length;w++){const I=nt(s[w])*pt,D=(E[w]+I)*I,M=s[w].pts.length-1,d=Math.max(1,Math.min(M,Math.ceil(D/zt),Math.floor(E[w]/(1.5*I))));for(let P=0;P<d;P++)at.push([w,Math.round(P*M/d),Math.round((P+1)*M/d),(E[w]/d+I)*I])}for(let w=0;w<at.length;){let I=w,D=0;do D+=at[I][3],I++;while(I<at.length&&I-w<Nt&&D+at[I][3]<zt);const M=w,d=I;w=I,kt.push(()=>{L.globalCompositeOperation=R;for(let P=M;P<d;P++){const U=s[at[P][0]],Z=at[P][2];L.beginPath(),L.moveTo(U.pts[at[P][1]][0],U.pts[at[P][1]][1]);for(let A=at[P][1]+1;A<=Z;A++)L.lineTo(U.pts[A][0],U.pts[A][1]);L.lineWidth=nt(U),L.strokeStyle=k(U),L.stroke()}L.getImageData(0,0,1,1)})}};for(let nt=1;nt<=9;nt++){const k=st(40,3,(nt-1)/8),R=Math.round(255*nt/9);O(at=>at.w*2.1+k*(.4+at.w/42),()=>`rgb(0,${R},0)`,"source-over")}return O(nt=>nt.w+7,nt=>`rgb(0,0,${Math.round(20+nt.phase*235)})`,"lighten"),[[5.5,64],[3.2,128],[1.4,191],[0,255]].forEach(([nt,k])=>O(R=>R.w+nt,()=>`rgb(${k},0,0)`,"lighten")),{cv:et,steps:kt}}function os(s,et){const L=n=>(7*Math.sin(n*.021+et.ph)+4*Math.sin(n*.053+et.ph*2.3))*y(20,90,n),kt=n=>et.gorgeX+14*Math.sin(n*.012+et.ph)+(n<30?(30-n)*.25:0),Nt=n=>{let p=st(147,172,y(30,300,n));const $=y(78,118,n)*(1-y(140,184,n));if(p-=et.notch*$,p+=(5*s.n2(n*.03,3.1)+2.5*s.n2(n*.11,9.3))*y(55,100,n),n<-10){const b=Math.min(-10-n,-10-ge);p-=4.4*(y(4.2,5.6,b)+y(12.4,13.8,b)+y(20.6,22,b))+1.6*s.n2(n*.16,1.5)*y(-12,-30,n)}return n>318&&(p-=44*Math.pow(y(318,362,n),1.25)),p};let zt=0,pt=0;const E=(n,p,$)=>{const b=p*.019+$*7.7,V=s.ridged2(b+.0022*n,n*.0031+2.2+$,3),ut=s.n2(p*.052+$*3.1,n*.011),K=30+15*s.n2(p*.013+$*9,4.4),Q=1-y(60,130,p),Y=$<0?st(1.22,1.62,Q):1.1,C=.64,N=y(K-10,K+14,n),F=st(n*Y,K*Y+(n-K)*C,N),J=y(3,34,n)*(1-.55*y(K+25,K+110,n)),wt=s.ridged2(p*.075+$*3.3+.004*n,n*.012+5,2),ft=y(5,24,n)*(1-y(K+8,K+55,n)),Bt=$<0?y(-20,30,p)*(1-y(236,290,p)):0,Vt=46,Dt=p+7*s.n2(n*.021+$*2,p*.012+3.3)+.12*n*($<0?1:-.6),mt=Dt/Vt,yt=Math.floor(mt);let f=1e9,i=0;for(let ot=yt-1;ot<=yt+1;ot++){const tt=Math.abs(Math.sin(ot*127.1+$*311.7+et.ph)*43758.5453)%1,gt=Math.abs(mt-(ot+.4+.2*tt))*Vt;gt<f&&(f=gt,i=.8+.5*(tt*7.13%1))}const m=(10.5+.06*n)*(.8+.4*i)*(1+.6*Bt),z=Math.exp(-(f*f)/(m*m)),H=y(9,32,n)*(1-y(K+4,K+34,n))*(1-y(306,326,p)),G=y(K-4,K+22,n)*(1-y(K+30,K+95,n));pt=Math.min(1,i*z*H);const lt=$>0?1:1-y(40,95,p);let dt=0;if(lt>0){const ot=(p+6*s.n2(n*.024+$*5.3,p*.016+1.7)+.16*n*($<0?1:-.6))/($>0?27:21)+$*.31,tt=P(ot),gt=P(ot*2.37+.4),St=y(5,24,n)*(1-.75*y(K+40,K+140,n))*lt;dt=((tt-.55)*($>0?15:11.5)+(gt-.5)*2.4)*St,pt=Math.max(pt,Math.min(1,1.2*(1-tt)*(1-tt))*St*.8)}return-F-1.6*Math.sqrt(n)+((V-.4)*40+ut*6.5)*J+(wt-.5)*st(10,5,Bt)*ft-st(27,15,Bt)*i*z*H+7.5*i*Math.exp(-(f*f)/(m*m*5))*G+dt},O=n=>Math.abs(Math.sin(n*91.7+et.ph*3.1)*43758.5453)%1,nt=134,k=76,R=17,at=[{b:-1+.1*(O(1)-.5),k:.94+.1*O(2),hw:[13,8],sw:[[-20,134],[0,134],[6,119],[24,114],[30,86],[46,80],[52,58],[60,55],[66,34],[86,24],[97,-8]],cut:[[27,10,6.5],[49,6,5],[63,9,6]]},{b:0,k:1,stair:1,hw:[11.5,8],sw:[[-20,0],[40,0],[46,27],[70,31],[76,64],[92,68],[98,100],[112,105],[117,118]],cut:[[5,9,6],[43,10,6.5],[73,8,6],[95,5,5]]},{b:.52+.1*(O(5)-.5),k:.92+.12*O(6),hw:[10.5,6.5],sw:[[-20,134],[0,134],[10,128],[28,122],[34,92],[54,84],[60,60],[70,56],[75,38],[92,26],[102,-8]],cut:[[31,9,6],[57,10,6.5],[72.5,6,5]]},{b:1.14+.08*(O(7)-.5),k:.9+.1*O(8),hw:[6,4],sw:[[-20,134],[0,134],[5,124],[20,116],[25,92],[44,84],[49,58],[58,54],[62,40],[77,26],[87,-8]],cut:[[22.5,8,5.5],[46.5,9,6],[60,5,4.5]]}],w=301,I=321,D=[];at.forEach((n,p)=>{const $=n.sw,b=Y=>{let C=1;for(;C<$.length-1&&Y>$[C][0];)C++;const N=$[C-1],F=$[C];return st(N[1],F[1],Rt((Y-N[0])/(F[0]-N[0]),0,1))},V=[];for(let Y=0;Y<$.length-1;Y++){const C=$[Y],N=$[Y+1],F=N[0]-C[0],J=Math.abs(N[1]-C[1])<1.1*F&&C[0]>=0&&Y<$.length-2;if(V.push([C[0],J]),J)for(let wt=C[0]+4.5+6*O(400+p*31+Y),ft=0;wt<N[0]-3.5;ft++)V.push([wt,!0]),wt+=4.5+7*O(420+p*31+Y*5+ft)}V.push([$[$.length-1][0],!1]),n.cw=new Float32Array(w),n.cc=new Float32Array(w);for(let Y=0;Y<w;Y++){const C=-20+Y*.5;n.cw[Y]=b(C);let N=0;for(;N<V.length-2&&C>=V[N+1][0];)N++;n.cc[Y]=V[N][1]?st(b(V[N][0]),b(V[N+1][0]),y(V[N+1][0]-1.3,V[N+1][0],C)):b(C)}const ut=n.ft=new Float32Array(I),K=[];for(let Y=-80+14*O(100+p*13),C=0;Y<80;C++)K.push([Y,(O(110+p*13+C)-.5)*2.6]),Y+=11+19*O(140+p*13+C);const Q=[[(O(194+p)>.5?1:-1)*((n.stair?7.5:4)+5*O(170+p)),9+4*O(174+p),4.5+2*O(178+p)]];for(let Y=0;Y<I;Y++){const C=-80+Y*.5;let N=K[0][1];for(let F=1;F<K.length;F++)N+=(K[F][1]-K[F-1][1])*y(K[F][0]-.7,K[F][0]+.7,C);for(const F of Q)N+=F[1]*Math.max(0,1-Math.abs(C-F[0])/F[2]);ut[Y]=N}for(let Y=0;Y<2;Y++){const C=p*2+Y,N=O(200+C)>.45?6:5,F=[],J={n:N,f:new Float32Array(N*w),s:new Float32Array(N*w),c:new Float32Array(w),r:[],e:[],l:[]};n.cut.forEach((ft,Bt)=>{const Vt=ft[1]*(.75+.5*O(300+C*9+Bt)),Dt=ft[0]+3*(O(310+C*9+Bt)-.5);for(let mt=0;mt<w;mt++)J.c[mt]=Math.max(J.c[mt],Vt*Math.max(0,1-Math.abs(-20+mt*.5-Dt)/ft[2]))});let wt=0;for(let ft=0;ft<N;ft++)F.push(.5+1.1*O(210+C*7+ft)),wt+=F[ft];for(let ft=0,Bt=0;ft<N;ft++){const Vt=2.6+(Bt+.55*F[ft])/wt*44.8,Dt=1.2+2.6*O(250+C*7+ft);Bt+=F[ft],J.r.push(73.9*F[ft]/wt),J.e.push(Math.max(.7,.06*J.r[ft])),J.l.push(2.2+2.6*O(270+C*7+ft));for(let mt=0;mt<w;mt++){const yt=-20+mt*.5;J.f[ft*w+mt]=Vt+1.5*s.n2(yt*.022+ft*3.7,C*5.1+.3)+.7*s.n2(yt*.09+ft*1.3,C+9.1),J.s[ft*w+mt]=Dt*y(-.25,.2,s.n2(yt*.11+ft*3.1,C*5.3+.7))}}D.push(J)}});const M=(n,p,$)=>{if(n<=0)return 0;const b=D[$],V=Rt((p+20)*2,0,w-1.001),ut=V|0,K=V-ut;let Q=4.2*Math.min(n,2.6)+.25*Rt(n-2.6,0,44.8);for(let Y=0;Y<b.n;Y++){const C=Y*w+ut,N=b.e[Y],F=n-(b.f[C]+(b.f[C+1]-b.f[C])*K);if(F<=-N)break;if(Q+=F>=N?b.r[Y]:b.r[Y]*(F+N)/(2*N),F>.5){const J=1-(F-.5)/b.l[Y];J>0&&(Q-=(b.s[C]+(b.s[C+1]-b.s[C])*K)*J)}}return n>47.4?Q+(n-47.4)*1.9:Q};for(const n of at)n.ax=Math.sin(n.b),n.az=Math.cos(n.b);const d=[-1.42,-.6,.16,.84].map((n,p)=>{const $=66*(.94+.16*O(11+p));return[Math.sin(n)*$,Math.cos(n)*$,30*(.9+.25*O(21+p))]}),P=n=>{const p=n-Math.floor(n);return 1-Math.abs(2*p-1)},U=[[-25,6],[-12,7],[4,7.5],[19,8],[33,9]],Z=(n,p)=>U[n][0]+3.3*(2*P(p/(13+4*O(40+n))+O(30+n))-1)+1.1*s.n2(p*.21+n*9.1,3.3),A=(n,p)=>{let $=147,b=0;for(let V=0;V<U.length;V++){const ut=Z(V,n),K=y(ut-.85,ut+.85,p);$-=U[V][1]*K,V===0&&(b=K)}return $+b*(.13*Rt(n,-14,14)+.45*s.n2(n*.19+7.7,p*.19))};let j=0;const ht=(n,p)=>{const $=Math.hypot(n,p),b=9*s.n2(n*.027+4.4,p*.027+1.1),V=$+b*y(40,80,$);let ut=V<k?Math.min(nt-6,R+(k-V)*.92):R-(V-k)*.62;for(const N of d)ut=Math.max(ut,N[2]-.64*(Math.hypot(n-N[0],p-N[1])+.55*b));ut+=(s.n2(n*.31+9.1,p*.31)*.55+s.n2(n*.12,p*.12+5.5)*1.2)*y(24,60,$)*(1-y(k+30,k+60,$));let K=-1e9,Q=-1e9,Y=0;for(let N=0;N<at.length;N++){const F=at[N],J=(n*F.ax+p*F.az)/F.k;if(J<-18)continue;let wt=-n*F.az+p*F.ax;wt+=3.2*s.n2(J*.045+N*7.7,2.2)*y(6,30,J);const ft=Rt((wt+80)*2,0,I-1.001),Bt=ft|0,Vt=Rt((J+20)*2,0,w-1.001),Dt=Vt|0,mt=N*2+(wt>0?1:0),yt=D[mt].c,f=st(F.hw[0],F.hw[1],y(10,F.stair?45:80,J)),i=yt[Dt]+(yt[Dt+1]-yt[Dt])*(Vt-Dt),m=Math.max(0,Math.abs(wt)-f+i),z=J+(F.ft[Bt]+(F.ft[Bt+1]-F.ft[Bt])*(ft-Bt))*y(4,14,J)*(1-y(5,16,m)),H=Rt((z+20)*2,0,w-1.001),G=H|0,lt=F.cc[G]+(F.cc[G+1]-F.cc[G])*(H-G),dt=F.cw[Dt]+(F.cw[Dt+1]-F.cw[Dt])*(Vt-Dt),ot=M(m,J,mt),tt=Math.max(ut,K),gt=y(0,5,m);let St;if(F.stair){const oe=134-24.5*y(2,8,p)-dt;if(gt>=1)St=oe;else if(147-lt-ot+5.5<tt){Q=Math.max(Q,oe-m*.7);continue}else St=st(A(n,p)-lt,oe,gt)}else St=st(lt,dt,gt);if(Q=Math.max(Q,St-m*.7),St-ot+5.5<tt)continue;const Kt=nt-St+ot,Xt=((s.ridged2(n*.085+N*3.3,p*.085+1.9,2)-.55)*4*y(3,14,Kt)+(s.ridged2(n*.2+N*5.1,p*.2+7.7,1)-.5)*1.9*y(-2,6,J)*(.3+.7*y(0,6,Kt)))*(F.stair?y(0,4,ot):1);St-ot+Xt>K&&(K=St-ot+Xt,Y=Math.min(1,i/5)*y(0,4,m))}const C=Math.max(ut,K);return j=y(5,28,Q-C)*(1-y(k+6,k+42,$))*y(6,16,$),K>ut&&(j=Math.max(j,.85*Y)),C};return{H:(n,p)=>{zt=0;const $=ea+30*s.n2(n*.0015,5.5)*y(60,300,Math.abs(n));let b=186+26*s.n2(n*.0032,1.7)+12*s.n2(n*.011,8.2);b-=13*Math.exp(-(n+8)*(n+8)/3e3),b*=1-.5*y(850,1300,Math.abs(n));const V=p-$,ut=V>0?Math.exp(-(n+8)*(n+8)/5600):0,K=V-150;let Q=V<0?b+V*(.58+.4*Math.exp(-(n+8)*(n+8)/9e4)):b-st(V*.5,V*.2+.25*(Math.sqrt(K*K+400)+K),ut);const Y=s.ridged2(n*.0042+2,p*.0016,3),C=V<0?1-.75*Math.exp(-(n+8)*(n+8)/78e3):1;if(Q+=(Y-.55)*68*y(10,150,Math.abs(V))*y(-40,40,Q)*(1-.85*ut)*C,V<0&&Q>-30){const i=1-Math.exp(-(n+8)*(n+8)/3e4),m=Math.abs(n),z=m<420?.017:.011,H=s.ridged2(n*z+5.1-V*.0016,V*.0045+2.7,m<420?3:2);Q+=(H-.55)*36*i*y(6,60,-V)*y(-30,30,Q)}if(V>-14){const i=1-Math.exp(-(n+8)*(n+8)/7e3),m=y(-14,26,V)*i,z=s.ridged2(n*.019+11.3,p*.0045+4.1,3),H=s.ridged2(n*.052+3.7,p*.011+9.2,2);Q+=((z-.55)*30+(H-.5)*9)*m}const N=y(-26,-9,p),F=1-y(30,56,Math.abs(n)),J=F*N*(1-y(48,80,p)),wt=F*N*(1-y(16,44,p)),ft=(1-y(14,28,Math.abs(n)))*N*(1-y(48,80,p));if(p<364&&Math.abs(n)<330){const i=n-L(p),m=i<0?-1:1;let z,H;if(p>=ge){const dt=1+(.3*s.n2(p*.13+m*4.1,2.7)+.16*s.n2(p*.37,m*7.3))*y(7,22,Math.abs(p)),ot=p<-4,tt=ot?11.5*(1-y(-10,-4,p))*(1+.1*s.n2(p*.31,4.4)):0,gt=Math.max(0,Math.abs(i)-Math.max((3.2*J+13.6*wt)*dt,tt)),St=p>300?(s.ridged2(i*.14+3.3,p*.02+1.7,2)-.5)*11*y(304,320,p)*y(0,10,gt):0;z=(ot?A(i,ge-p):Nt(p))+E(gt,p,m)+St,H=pt}else{const dt=Math.hypot(i,ge-p),ot=Math.atan2(i,ge-p),tt=y(.5,1.05,ot),gt=y(1.22,1.52,Math.abs(ot));if(z=ht(i,ge-p),H=j,gt>0){let St=0,Kt=0,Xt=0,oe=0;tt<1&&(St=E(dt,ge-(ot+1.5708)*Bo,-1),Xt=pt),tt>0&&(Kt=E(dt,ge-(1.5708-ot)*Bo,1),oe=pt),z=st(z,Nt(ge)+st(St,Kt,tt),gt),H=st(H,st(Xt,oe,tt),gt)}}const G=Q,lt=12;Q=.5*(G+z+Math.sqrt((G-z)*(G-z)+lt*lt))-lt*.5*Math.exp(-Math.abs(G-z)/20),z>G-6&&(zt=H)}const Bt=(1-y(ge-4,ge+14,p))*(1-y(150,200,Math.abs(n))),Vt=(1-y(12,18,Math.abs(n)))*(1-y(-10,-4,p))*y(-95,-85,p);if(Q+=(5.5*s.fbm2(n*.021,p*.021,3)+1.6*s.n2(n*.09,p*.09))*y(4,60,Q)*(1-.7*ft)*(1-.6*ut)*(1-.75*Bt)*(1-.9*Vt),J>.01&&Q>60){const i=2.6*s.fbm2(n*.085+31,p*.085,2)+.02*p,m=i/1.15,z=m-Math.floor(m);Q+=((Math.floor(m)+y(.7,1,z))*1.15-i+.9*s.n2(n*.3,p*.3+5))*J*(.45+.55*y(5,12,Math.abs(n)))}const Dt=(1-y(130,250,Math.abs(n)))*(1-y(300,345,p))*(1-ft)*y(12,36,Q)*y(-.25,.35,s.n2(n*.017+20,p*.017))*(V>0?Math.exp(-(n+8)*(n+8)/1800):1)*(1-Bt)*(1-Vt)*(.3+.7*y(60,170,p))*(p<250?1-y(2,14,n):1);if(Dt>.01){const i=Fo*(1.5+.7*s.n2(n*.011+3,p*.011)),m=(Q+.12*n+.05*p+9*s.n2(n*.02,p*.02+8))/i,z=m-Math.floor(m);Q+=(y(.5,.92,z)-z)*i*Dt*.5}const mt=Math.abs(n-kt(p))-22,yt=Math.max(mt,0)*.92-4+10*s.n2(n*.02,p*.02+7)*y(0,60,mt),f=14;return Q=.5*(Q+yt-Math.sqrt((Q-yt)*(Q-yt)+f*f))+(Q<20,0),Q-3*(1-y(0,25,Q))},spurX:L,spurH:Nt,gorgeXf:kt,gullyOf:()=>zt,stairFront:Z,nSteps:U.length}}async function ss(s,et,L){const E=new Float32Array(133263),O=new Float32Array(44421),nt=new Float32Array(44421),k=[],R=[],at=(f,i)=>{let m=0,z=f.length-1;for(;z-m>1;){const H=m+z>>1;f[H]>i?z=H:m=H}return m};for(let f=0;f<=220;f++){const i=f/220*2-1;k.push(1300*(.16*i+.84*i*Math.pow(Math.abs(i),1.6)))}for(let f=0;f<=200;f++)R.push(f<=8?st(-260,-190,f/8):f<=162?st(-190,364,(f-8)/154):st(364,560,(f-162)/38));for(let f=0,i=0;f<=200;f++){const m=R[f],z=1-y(505,560,m);for(let H=0;H<=220;H++,i++){H%37===36&&await s.yield();let G=et(k[H],m);nt[i]=L(),G>0&&(G*=z);const lt=H===0||H===220||f===0||f===200;E[i*3]=k[H],E[i*3+1]=lt?-9:Math.max(G,-8),E[i*3+2]=m}await s.yield()}const w=221;for(let f=0;f<2;f++){const i=new Float32Array(44421);for(let m=0;m<i.length;m++)i[m]=E[m*3+1];for(let m=1;m<200;m++){const z=R[m],H=y(-34,-10,z)*(1-y(270,310,z)),G=0;if(!(H<=0&&G<=0)){for(let lt=1;lt<220;lt++){const dt=k[lt],ot=Math.max(H*y(-205,-150,dt)*(1-y(-30,-12,dt)),G*(1-y(150,210,Math.abs(dt))));if(ot<=0)continue;const tt=m*w+lt,gt=(i[tt-1]+i[tt+1]+i[tt-w]+i[tt+w]+.5*(i[tt-w-1]+i[tt-w+1]+i[tt+w-1]+i[tt+w+1]))/6;E[tt*3+1]=st(i[tt],gt,.75*ot)}(m&31)===31&&await s.yield()}}await s.yield()}for(let f=0,i=0;f<=200;f++)for(let m=0;m<=220;m++,i++){m===0&&(f&3)===3&&await s.yield();const z=Math.max(0,m-2),H=Math.min(220,m+2),G=Math.max(0,f-2),lt=Math.min(200,f+2),dt=(E[(f*w+z)*3+1]+E[(f*w+H)*3+1]+E[(G*w+m)*3+1]+E[(lt*w+m)*3+1])/4,ot=Math.max(0,m-5),tt=Math.min(220,m+5),gt=Math.max(0,f-6),St=Math.min(200,f+6),Kt=(E[(f*w+ot)*3+1]+E[(f*w+tt)*3+1]+E[(gt*w+m)*3+1]+E[(St*w+m)*3+1])/4;O[i]=Rt(.72+(E[i*3+1]-dt)*.06+Math.min(0,E[i*3+1]-Kt+2.5)*.062*(E[i*3+1]>12?1:0),.2,1),O[i]=Math.max(.2,O[i]*(1-.62*y(.12,.7,nt[i])))}await s.yield();{const f=O.slice();for(let i=1,m;i<200;i++){for(let z=1;z<220;z++)m=i*w+z,O[m]=.3*f[m]+.7*(f[m-1]+f[m+1]+f[m-w]+f[m+w]+.5*(f[m-w-1]+f[m-w+1]+f[m+w-1]+f[m+w+1]))/6;(i&63)===63&&await s.yield()}}const I=at(k,-152),D=at(k,152)+1,M=8,d=at(R,9)+1,P=k[I],U=k[D],Z=R[M],A=R[d],j=Math.round((U-P)/1.3),ht=Math.round((A-Z)/1.3),W=j+1,n=(U-P)/j,p=(A-Z)/ht,$=W*(ht+1),b=new Float32Array($*3),V=new Float32Array($),ut=new Float32Array($),K=new Float32Array($),Q=(f,i,m,z,H)=>{const G=at(k,z),lt=at(R,H),dt=Rt((z-k[G])/(k[G+1]-k[G]),0,1),ot=Rt((H-R[lt])/(R[lt+1]-R[lt]),0,1),tt=(lt*w+G)*i+m;return st(st(f[tt],f[tt+i],dt),st(f[tt+w*i],f[tt+w*i+i],dt),ot)};for(let f=0,i=0;f<=ht;f++){const m=f===ht?A:Z+f*p;for(let z=0;z<=j;z++,i++){const H=z===j?U:P+z*n,G=.75*y(-34,-10,m)*y(-205,-150,H)*(1-y(-30,-12,H)),lt=y(0,5,Math.min(H-P,U-H,m-Z,A-m))*(1-G);let dt=Q(E,3,1,H,m);lt>0&&(dt=st(dt,Math.max(et(H,m),-8),lt),ut[i]=L()*lt),b[i*3]=H,b[i*3+1]=dt,b[i*3+2]=m,K[i]=lt}await s.yield()}for(let f=0,i=0;f<=ht;f++){const m=Math.max(0,f-5)*W,z=Math.min(ht,f+5)*W,H=Math.max(0,f-15)*W,G=Math.min(ht,f+15)*W,lt=f*W;for(let dt=0;dt<=j;dt++,i++){const ot=b[i*3+1],tt=Math.max(0,dt-5),gt=Math.min(j,dt+5),St=Math.max(0,dt-15),Kt=Math.min(j,dt+15),Xt=(b[(lt+tt)*3+1]+b[(lt+gt)*3+1]+b[(m+dt)*3+1]+b[(z+dt)*3+1])/4,oe=(b[(lt+St)*3+1]+b[(lt+Kt)*3+1]+b[(H+dt)*3+1]+b[(G+dt)*3+1])/4,Te=Rt(.76+(ot-Xt)*.045+Math.min(0,ot-oe+8)*.011*(ot>12?1:0),.44,1);V[i]=Math.max(.3,Te*(1-.5*y(.12,.7,ut[i])))}(f&7)===7&&await s.yield()}for(let f=0;f<2;f++){const i=V.slice();for(let m=1,z;m<ht;m++){for(let H=1;H<j;H++)z=m*W+H,V[z]=.4*i[z]+.6*(i[z-1]+i[z+1]+i[z-W]+i[z+W]+.5*(i[z-W-1]+i[z-W+1]+i[z+W-1]+i[z+W+1]))/6;(m&31)===31&&await s.yield()}}for(let f=0;f<$;f++)K[f]<1&&(V[f]=st(Q(O,1,0,b[f*3],b[f*3+2]),V[f],K[f]));await s.yield();const Y=new Float32Array($*3),C=new Uint32Array(j*ht*6);for(let f=0,i=0,m=0;f<=ht;f++){const z=Math.max(0,f-1),H=Math.min(ht,f+1);for(let G=0;G<=j;G++,i++){const lt=Math.max(0,G-1),dt=Math.min(j,G+1),ot=(b[(f*W+dt)*3+1]-b[(f*W+lt)*3+1])/(b[(f*W+dt)*3]-b[(f*W+lt)*3]),tt=(b[(H*W+G)*3+1]-b[(z*W+G)*3+1])/(b[(H*W+G)*3+2]-b[(z*W+G)*3+2]),gt=1/Math.sqrt(ot*ot+1+tt*tt);if(Y[i*3]=-ot*gt,Y[i*3+1]=gt,Y[i*3+2]=-tt*gt,G<j&&f<ht){const St=i,Kt=St+1,Xt=St+W,oe=Xt+1;C[m++]=St,C[m++]=Xt,C[m++]=Kt,C[m++]=Kt,C[m++]=Xt,C[m++]=oe}}(f&15)===15&&await s.yield()}const N=new l.BufferGeometry;N.setAttribute("position",new l.BufferAttribute(b,3)),N.setAttribute("aAO",new l.BufferAttribute(V,1)),N.setAttribute("normal",new l.BufferAttribute(Y,3)),N.setIndex(new l.BufferAttribute(C,1)),await s.yield();const F=(f,i)=>f>P&&f<U&&i>Z&&i<A,J=new Uint32Array((44e3-(D-I)*(d-M))*6);for(let f=0,i=0;f<200;f++)for(let m=0;m<220;m++){if(m>=I&&m<D&&f>=M&&f<d)continue;const z=f*w+m,H=z+1,G=z+w,lt=G+1;J[i++]=z,J[i++]=G,J[i++]=H,J[i++]=H,J[i++]=G,J[i++]=lt}await s.yield();const wt=new l.BufferGeometry;wt.setAttribute("position",new l.BufferAttribute(E,3)),wt.setAttribute("aAO",new l.BufferAttribute(O,1)),wt.setIndex(new l.BufferAttribute(J,1)),await s.yield();const ft=new Float32Array(44421*3);for(let f=0,i=0;f<=200;f++){const m=Math.max(0,f-1),z=Math.min(200,f+1),H=R[z]-R[m];for(let G=0;G<=220;G++,i++){const lt=Math.max(0,G-1),dt=Math.min(220,G+1),ot=(E[(f*w+dt)*3+1]-E[(f*w+lt)*3+1])/(k[dt]-k[lt]),tt=(E[(z*w+G)*3+1]-E[(m*w+G)*3+1])/H,gt=1/Math.sqrt(ot*ot+1+tt*tt);ft[i*3]=-ot*gt,ft[i*3+1]=gt,ft[i*3+2]=-tt*gt}(f&15)===15&&await s.yield()}wt.setAttribute("normal",new l.BufferAttribute(ft,3));const Bt=new Float32Array(44421),Vt=new Float32Array($);return wt.setAttribute("aCon",new l.BufferAttribute(Bt,1)),N.setAttribute("aCon",new l.BufferAttribute(Vt,1)),{geo:wt,splat:(f,i,m,z)=>{const H=at(k,f-m),G=Math.min(220,at(k,f+m)+1),lt=at(R,i-m),dt=Math.min(200,at(R,i+m)+1);for(let ot=lt;ot<=dt;ot++)for(let tt=H;tt<=G;tt++){const gt=Math.hypot(k[tt]-f,R[ot]-i)/m;gt<1&&(Bt[ot*w+tt]=1-(1-Bt[ot*w+tt])*(1-z*(1-gt*gt)))}if(f+m>P&&f-m<U&&i+m>Z&&i-m<A){const ot=Math.max(1,Math.floor((f-m-P)/n)),tt=Math.min(j-1,Math.ceil((f+m-P)/n)),gt=Math.max(1,Math.floor((i-m-Z)/p)),St=Math.min(ht-1,Math.ceil((i+m-Z)/p));for(let Kt=gt;Kt<=St;Kt++)for(let Xt=ot;Xt<=tt;Xt++){const oe=Kt*W+Xt,Te=Math.hypot(b[oe*3]-f,b[oe*3+2]-i)/m;Te<1&&(Vt[oe]=1-(1-Vt[oe])*(1-z*(1-Te*Te)))}}},hAt:(f,i)=>{if(f<=k[0]||f>=k[220]||i<=R[0]||i>=R[200])return 0;if(F(f,i)){const dt=Math.min((f-P)/n,j-1e-4),ot=Math.min((i-Z)/p,ht-1e-4),tt=Math.floor(dt),gt=Math.floor(ot),St=dt-tt,Kt=ot-gt,Xt=(gt*W+tt)*3+1;return st(st(b[Xt],b[Xt+3],St),st(b[Xt+W*3],b[Xt+W*3+3],St),Kt)}const m=at(k,f),z=at(R,i),H=(f-k[m])/(k[m+1]-k[m]),G=(i-R[z])/(R[z+1]-R[z]),lt=(z*w+m)*3+1;return st(st(E[lt],E[lt+3],H),st(E[lt+w*3],E[lt+w*3+3],H),G)},aoAt:(f,i)=>f<=k[0]||f>=k[220]||i<=R[0]||i>=R[200]?1:F(f,i)?V[Math.min(ht,Math.round((i-Z)/p))*W+Math.min(j,Math.round((f-P)/n))]:Q(O,1,0,f,i),noseGeo:N,conAttrs:[wt.attributes.aCon,N.attributes.aCon]}}async function ns(s,et,L){const zt=new Float32Array(33147),pt=(_t.x1-_t.x0)/260,E=(_t.z1-_t.z0)/126;for(let D=0,M=0;D<127;D++){for(let d=0;d<261;d++,M++)zt[M]=Math.max(et(_t.x0+d*pt,_t.z0+D*E),0);D%4===3&&await s.yield()}const O=(D,M)=>{const d=Rt((D-_t.x0)/pt,0,259.999),P=Rt((M-_t.z0)/E,0,127-1.001),U=Math.floor(d),Z=Math.floor(P),A=d-U,j=P-Z,ht=Z*261+U;return st(st(zt[ht],zt[ht+1],A),st(zt[ht+261],zt[ht+261+1],A),j)},nt=Math.hypot(L.x,L.z)||.001,k=L.x/nt,R=L.z/nt,at=Math.max(L.y,.02)/nt,w=new Uint8Array(_t.w*_t.h);for(let D=0,M=0;D<_t.h;D++){const d=st(_t.z0,_t.z1,(D+.5)/_t.h);for(let P=0;P<_t.w;P++,M++){const U=st(_t.x0,_t.x1,(P+.5)/_t.w),Z=O(U,d)+1.5;let A=1;for(let j=0,ht=9;j<20&&ht<1250;j++,ht*=1.3){const W=O(U+k*ht,d+R*ht)-(Z+ht*at);W>0&&(A=Math.min(A,1-Rt(W/(3+ht*.035),0,1)))}w[M]=Math.round(255*A)}await s.yield()}const I=new l.DataTexture(w,_t.w,_t.h,l.RedFormat,l.UnsignedByteType);return I.magFilter=l.LinearFilter,I.minFilter=l.LinearMipmapLinearFilter,I.generateMipmaps=!0,I.needsUpdate=!0,I}async function rs(s,et,L){const kt=Math.hypot(L.x,L.z)||.001,Nt=L.x/kt,zt=L.z/kt,pt=Math.max(L.y,.02)/kt,E=new Uint8Array(ne.w*ne.h);for(let nt=0,k=0;nt<ne.h;nt++){const R=st(ne.z0,ne.z1,(nt+.5)/ne.h);for(let at=0;at<ne.w;at++,k++){const w=st(ne.x0,ne.x1,(at+.5)/ne.w),I=et(w,R);let D=1;if(I>-1){const M=I+.7;for(let d=0,P=2.2;d<26&&P<800;d++,P*=1.26){const U=et(w+Nt*P,R+zt*P)-(M+P*pt);if(U>0&&(D=Math.min(D,1-Rt(U/(.8+P*.022),0,1)),D<=0))break}}E[k]=Math.round(255*D)}(nt&1)===1&&await s.yield()}const O=new l.DataTexture(E,ne.w,ne.h,l.RedFormat,l.UnsignedByteType);return O.magFilter=l.LinearFilter,O.minFilter=l.LinearFilter,O.generateMipmaps=!1,O.needsUpdate=!0,O}const To=`
attribute float aAO; attribute float aCon; varying vec3 vP; varying vec3 vN; varying float vAO; varying float vCon; varying float vMag; varying float vInst;
${ze}
void main(){
  vec3 p=position, n=normal; vInst=0.; vCon=aCon;
  #ifdef USE_INSTANCING
    p=(instanceMatrix*vec4(p,1.)).xyz; n=mat3(instanceMatrix)*n; vInst=1.;
  #endif
  vP=p; vN=n; vAO=aAO; vMag=length(modelMatrix[0].xyz);
  vec4 mvPosition=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
  vDepth=-mvPosition.z;
}`,ro=`vec2((P.x-(${_t.x0.toFixed(1)}))/${(_t.x1-_t.x0).toFixed(1)},(P.z-(${_t.z0.toFixed(1)}))/${(_t.z1-_t.z0).toFixed(1)})`,Lo=`
${Pe}
${te}
uniform sampler2D uShade; uniform sampler2D uShadeN; uniform float uBare; uniform vec4 uHole; uniform float uFadeD;
varying vec3 vP; varying vec3 vN; varying float vAO; varying float vCon; varying float vMag; varying float vInst;
// loose stones: x = gap between the two nearest, y = the stone's id, zw = from the stone's centre to here
vec4 cells(vec2 p){
  vec2 i=floor(p), f=fract(p), rb=vec2(0.); float d1=9., d2=9., id=0.;
  for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){
    vec2 g=vec2(float(x),float(y)); vec2 r=g+vec2(h21(i+g),h21(i+g+57.3))*.85+.075-f; float d=dot(r,r);
    if(d<d1){ d2=d1; d1=d; id=h21(i+g+11.7); rb=r; } else if(d<d2){ d2=d; }
  }
  return vec4(sqrt(d2)-sqrt(d1),id,-rb);
}
// Jointed rock. Beds dip across the slope; every bed is cut by two sets of upright joints whose bearing, spacing and
// offset are the bed's own, so the blocks of one bed never line up with those of the next. A block is a prism in
// space, not a pattern laid on a face: the same blocks show on every facing, with no blending of projections.
float bedBlock(vec2 q,float bi,float sc,float seed,out vec2 ai,out vec2 af,out vec2 d1,out vec2 len){
  float r1=h21(vec2(bi,seed)), r2=h21(vec2(bi+3.7,seed+9.1));
  float ang=r1*6.2832; d1=vec2(cos(ang),sin(ang));
  len=sc*vec2(mix(1.4,2.7,r2),mix(1.15,2.1,fract(r2*7.3)));
  vec2 a=vec2(dot(q,d1),dot(q,vec2(-d1.y,d1.x)))/len+vec2(r1,r2)*17.;
  ai=floor(a); af=a-ai;
  return h21(ai+vec2(bi*13.7+seed,bi*5.3));
}
// x = the block's tone (0..1), y = dark of joints and of the shade a prouder neighbour throws, z = ledge top showing,
// w = level of detail (0 when a bed is only a few pixels thick). fn = the side face that shows where this block
// stands proud of its neighbour, fk = how much of the pixel is that face.
vec4 blocks(vec3 q,float sc,float seed,float fw,out vec3 fn,out float fk){
  float b=(q.y+dot(q.xz,vec2(.12,.05)))/sc+(fbm(q.xz*.21/sc+seed)-.5)*1.3, bi=floor(b), bf=b-bi;   // beds that swell and pinch a little
  // (a bed seen thinner than about six pixels is a tone, not blocks: small blocks with their shade are a checker there)
  float lod=clamp(1.7-fw*9./sc,0.,1.)*clamp(1.8-fwidth(b)*5.5,0.,1.);
  fn=vec3(0.,1.,0.); fk=0.;
  if(lod<=0.) return vec4(.5,0.,0.,0.);
  vec2 ai,af,d1,len,ai2,af2,d1b,len2;
  float id=bedBlock(q.xz,bi,sc,seed,ai,af,d1,len);
  float sb=bf<.5?-1.:1.;
  float idv=bedBlock(q.xz,bi+sb,sc,seed,ai2,af2,d1b,len2);
  vec2 sa=vec2(af.x<.5?-1.:1.,af.y<.5?-1.:1.), ho=vec2(bi*13.7+seed,bi*5.3);
  float id1=h21(ai+vec2(sa.x,0.)+ho), id2=h21(ai+vec2(0.,sa.y)+ho);
  vec3 e=vec3(min(bf,1.-bf)*sc,min(af.x,1.-af.x)*len.x,min(af.y,1.-af.y)*len.y);    // metres to the nearest bed plane and joints
  // not every joint has opened: across the others two blocks are one
  vec3 opn=step(vec3(.36,.46,.46),fract((vec3(id)+vec3(idv,id1,id2))*17.31));
  vec3 dh=(vec3(id)-vec3(idv,id1,id2))*sc*.18*opn;                                   // how far this block stands out from each
  // a joint is a crack a few centimetres wide: far off it is a thin grey line (the share of the pixel it covers), never a stroke
  float jw=(.004+.011*fract(id*9.7))*sc, jc=clamp((jw*2.+fw*.28)/(fw*1.4+1e-4),0.,1.);
  vec3 jl=(1.-smoothstep(vec3(jw),vec3(jw+fw*1.4+.004*sc),e))*opn*jc;
  vec3 wd=max(dh,0.)+.02*sc;
  vec3 face=(1.-smoothstep(wd*.55,wd+fw*.5,e))*step(.02*sc,dh);
  vec3 shw=(1.-smoothstep(vec3(0.),max(-dh,0.)*.9+.02*sc+fw,e))*step(dh,vec3(-.02*sc));
  shw.x*=sb>0.?1.:.45;                                                               // an overhang shades more than a step below
  float dark=max(max(jl.x,max(jl.y,jl.z))*.8,max(shw.x,max(shw.y,shw.z))*.5);
  vec3 up=vec3(-.119,.992,-.05);
  if(face.x>=face.y&&face.x>=face.z){ fn=up*sb; fk=face.x; }
  else if(face.y>=face.z){ fn=vec3(d1.x,0.,d1.y)*sa.x; fk=face.y; }
  else { fn=vec3(-d1.y,0.,d1.x)*sa.y; fk=face.z; }
  float top=face.x*step(0.,sb);
  return vec4(mix(.5,id,lod),dark*lod,top*lod,lod);
}
#define LR(s) clamp(1.5-fwp*(s)*5.,0.,1.)
#define LC(s) clamp(1.5-fwp*(s)*7.,0.,1.)
void main(){
  if(uFadeD<=fract(52.9829189*fract(dot(gl_FragCoord.xy,vec2(.06711056,.00583715))))) discard;
  vec3 P=vP; vec3 Ng=vN/max(length(vN),1e-4);
  if(uHole.z>0. && abs(P.x-uHole.x)<uHole.z && abs(P.z-uHole.y)<uHole.w) discard;
  vec3 toC=uCamL-P; float dist=length(toC); vec3 V=toC/max(dist,1e-3);
  float fwp=length(fwidth(P));
  float mag=clamp((vMag-1.)*.5,0.,1.), nmag=1.-mag;            // 1 while the ridge stands in as a distant range
  // the north nose, the bastion the climb to the gate looks at: massive granite in upright blades. No level beds are
  // drawn on it, its joints are faint, its fans are scree; seen from a way off its faces are the mesh's own planes
  float nz=(1.-smoothstep(12.,32.,P.z))*(1.-smoothstep(150.,200.,abs(P.x)))*nmag;
  vec3 Nf=cross(dFdx(P),dFdy(P)); float nfl=length(Nf); Nf=nfl>1e-9?Nf/nfl:Ng; if(Nf.y<0.) Nf=-Nf;
  Ng=mix(Ng,Nf,.5*nz*(1.-smoothstep(4.,9.,P.z))*smoothstep(45.,140.,dist)); Ng/=max(length(Ng),1e-4);
  // the stair under the gate: a tread is a slab and a riser is a wall, with an arris between them (the mesh alone rounds
  // every step into a swelling)
  float stM=nz*(1.-smoothstep(13.,20.,abs(P.x)))*smoothstep(-96.,-86.,P.z)*(1.-smoothstep(-9.,-4.,P.z))*smoothstep(96.,106.,P.y);
  // (and so are the stepped walls and blade ends below it, a little less sharply)
  float stL=nz*(1.-smoothstep(-34.,-22.,P.z))*(1.-smoothstep(118.,132.,P.y))*smoothstep(4.,16.,P.y);
  { float st0=1.-Ng.y, kk=mix(.6,2.2,smoothstep(.1,.3,st0)); vec3 Ns=vec3(Ng.x*kk,Ng.y,Ng.z*kk); Ns/=max(length(Ns),1e-4); Ng=mix(Ng,Ns,max(stM,stL*.75)); }
  // round the gate the spur's flanks are seen end on, along the spur: what shows there is ribs and gullies down the fall
  // line, and level beds across them would be bands
  float gK=(1.-smoothstep(150.,340.,length(P.xz-vec2(0.,20.))))*nmag;
  // (and once the camera itself is on the gate's own approach, every flank in sight is seen that way)
  float bedK=(1.-gK)*(1.-.85*(1.-smoothstep(130.,290.,length(uCamL.xz-vec2(0.,-60.))))*nmag);
  float steep=1.-Ng.y, slope=smoothstep(.12,.3,steep), soft=1.-uBare, wall=smoothstep(.2,.45,steep);   // ground up to about 40 degrees holds talus
  vec3 w3=Ng*Ng; float wxz=max(w3.x+w3.z,1e-3);
  vec2 sdir=uSunL.xz/max(length(uSunL.xz),1e-3);
  float warp=fbm(P.xz*.02), sn=fbm(P.xz*.028+5.);
  float g1=mix(.5,vn(P.xz*2.7+P.y*2.1),LR(2.7)), g2=mix(.5,vn(P.xz*9.+P.y*7.3),LR(9.));
  // down the fall line: streaks a few metres apart, chutes a few tens
  float yy=P.y*.03;
  float fa=vn(vec2(P.z*.3+warp*3.,yy+3.)), fb=vn(vec2(P.x*.3+warp*3.,yy+7.));
  float ga=vn(vec2(P.z*.085+warp*2.,yy*.4+13.)), gc=vn(vec2(P.x*.085+warp*2.,yy*.4+17.));
  float fl=mix(.5,(fa*w3.x+fb*w3.z)/wxz,LR(.3)), gl=mix(.5,(ga*w3.x+gc*w3.z)/wxz,LR(.085));
  float streak=smoothstep(.5,.8,fl)*wall*nmag*max(smoothstep(.42,.66,vn(P.xz*.035+P.y*.03+7.)),nz)*(1.-.7*stM)*(1.-.8*stL), chute=smoothstep(.55,.75,gl)*wall*soft*nmag;   // (streaks in patches only: evenly spaced on a shaded wall they are a comb)   // (magnified they are smears a hundred metres long)
  // strata: continuous beds of uneven thickness that dip across the slope
  float sy=(P.y+dot(P.xz,vec2(.12,.05)))/${Fo.toFixed(1)}+(warp-.5)*3.2;
  float fsy=fwidth(sy), lB=clamp(1.5-fsy*5.,0.,1.)*(1.-.85*nz)*(.25+.75*bedK);
  float str=mix(.5,smoothstep(.3,.7,vn(vec2(sy*1.3,3.7))),lB), str2=mix(.5,vn(vec2(sy*4.1,9.1)),clamp(1.5-fsy*16.,0.,1.));
  // the jointed blocks at three sizes; where the stone is massive only the big joints show
  vec3 wv=(vec3(vn(P.xz*.06+3.),vn(P.zy*.06+11.),vn(P.xy*.06+23.))-.5);
  float massive=smoothstep(.42,.62,fbm(P.xz*.03+P.y*.02+50.));
  vec3 fnA,fnB,fnC; float fkA,fkB,fkC;
  vec4 A=blocks(P+wv*1.1,6.4,3.,fwp,fnA,fkA);
  vec4 B=blocks(P+wv*.6,2.1,17.,fwp,fnB,fkB);
  vec4 C=blocks(P+wv*.3,.62,41.,fwp,fnC,fkC);
  float kB=mix(1.,.62,massive)*mix(.3,1.,slope), kC=mix(1.,.45,massive)*slope, nm=(1.-mag)*(1.-smoothstep(240.,520.,dist));   // as a far range the ridge shows its beds only
  A.y*=nm*.42; A.z*=nm; fkA*=nm*.5; A.x=mix(.5,A.x,nm); B.yz*=kB*nm; fkB*=kB*nm; B.x=mix(.5,B.x,nm); C.yz*=kC*nm; fkC*=kC*nm; C.x=mix(.5,C.x,nm);
  float jk=mix(mix(.42,.1,smoothstep(120.,300.,dist)),1.,slope)*(1.-.88*nz);   // the joints show on flat rock too, a little less, and not from far off
  float hollow=fbm(P.xz*.09+13.)*.6+(vn(P.xz*.45+3.)-.5)*.1+(1.-vAO)*.9+(P.y-150.)*.004-max(dot(Ng,uSunL),0.)*.45+uSnow*(.15+smoothstep(40.,90.,P.y)*.35)+chute*.15-.16*mag*(1.-uSnow)+.1*nmag*smoothstep(70.,130.,P.y);
  float snow=smoothstep(.63,.8,hollow)*smoothstep(.45,.75,Ng.y+uBare*.3)*mix(1.,uSnow,uBare);
  // (old snow lies all year in the shaded gullies high on the spur)
  snow=max(snow,(1.-smoothstep(.45,.7,vAO))*smoothstep(50.,90.,P.y)*smoothstep(.38,.56,fbm(P.xz*.05+3.))*smoothstep(.2,.45,Ng.y)*nmag*.9);
  float bareS=1.-smoothstep(.02,.22,snow);                  // (any snow at all lies smooth over the joints and stones)
  float tone=fbm(P.xz*.011+P.y*.009+2.);
  float fr=max(mag,smoothstep(240.,520.,dist));               // far off, or standing in as a range: beds, not blocks
  float tv=tone+(str-.5)*mix(.16,.7,fr)*mix(1.,.3,mag)+(str2-.5)*mix(.05,.3,fr)*nmag+((A.x-.5)*.26+(B.x-.5)*.22*kB+(C.x-.5)*.14*kC)*jk*bareS;
  vec3 rock=mix(vec3(.13,.13,.145),vec3(.45,.4,.32),smoothstep(.15,.85,tv));
  rock=mix(rock,uPal[4]*.36,smoothstep(.55,.8,vn(P.xz*.07+P.y*.05))*.35);
  rock=mix(rock,vec3(.34,.2,.12),smoothstep(.62,.8,fbm(P.xz*.05+P.y*.08+71.))*.4);            // rust where water has run
  rock*=(.86+.2*g1+.1*g2)*mix(1.,.84,uBare);
  rock*=(1.-.24*streak*smoothstep(.06,.42,abs(dot(Ng,V))))*(1.-.3*chute);
  float graze=smoothstep(.06,.42,abs(dot(Ng,V)));       // (a wall seen edge-on from above: its upright joints would be a comb of dark spikes)
  float dark=max(A.y,max(B.y*.85,C.y*.7))*jk*mix(1.,.5,mag)*bareS*graze;
  rock*=1.-.5*dark;
  // the bastion's granite is shattered into irregular plates a few metres across (no ruled joints): each of its own
  // tone and tilt, a dark crack round it
  // (the cracks are hairlines, and only here and there: drawn all round every plate they are crazy paving)
  vec2 qnz=vec2(P.x*.8+P.z*.6,P.y*1.1+(P.z*.8-P.x*.6)*.45)+wv.xy*3.2+(vec2(g1,sn)-.5)*.5;
  vec4 fq1=cells(qnz*.23+17.), fq2=cells(qnz*.71+5.);
  float lf1=LC(.23)*nz*bareS, lf2=LC(.71)*nz*bareS;
  // (plates of a tone each, no more: a crack drawn round every plate is a net on a smooth surface. Only here and there
  // a master joint shows)
  rock*=1.+(fq1.y-.5)*.2*lf1+(fq2.y-.5)*.1*lf2;
  float fqm=smoothstep(.56,.74,vn(qnz*.11+3.));
  rock*=1.-.2*(1.-smoothstep(.0,.04,fq1.x))*lf1*fqm*graze;
  rock=mix(rock,vec3(.44,.47,.13),smoothstep(.6,.72,fbm(P.xz*.9+P.y*.6+3.))*.35*LR(1.8));     // map lichen, near only
  // black crust in broad soft patches (as a hard-edged fine noise it read as a checker of dark squares from the gate)
  vec2 qc=P.xz*.16+P.y*.25+21.+(wv.xy)*.5;
  rock=mix(rock,rock*.45+vec3(.02,.02,.025),smoothstep(.56,.82,vn(qc)*.7+vn(qc*2.3+5.)*.3)*.3*LR(.44));
  float top=max(A.z,B.z*.8)*jk*bareS;
  rock=mix(rock,vec3(.3,.29,.27)*(.8+.4*g2),top*.6);                                           // grit and stones lying on the ledges
  // old snow in the hollows and on the lee: smooth drifts with a soft edge (worked out here, so that the stones under a
  // drift, and the joints of the rock, do not show through it as dashes or squares)
  // what lies on the gentle ground and in the chutes: talus as stones of three sizes, each with a lit and a shadowed
  // side and a dark gap round it; tundra low down; old snow
  float lie=(1.-slope)*soft;
  // (on the bastion the fans are scree all over; the ledges high on it are swept slabs with scree lying in patches)
  float talus=max(max(lie*smoothstep(.15,.4,sn),chute*.8),lie*nz*mix(.92,.12+.6*smoothstep(.45,.62,vn(P.xz*.13+9.)),smoothstep(84.,100.,P.y)));
  float bigm=smoothstep(.35,.65,fbm(P.xz*.045+31.));
  vec4 s0=cells(P.xz*.27+3.+(wv.xy)*.6), s1=cells(P.xz*.85+7.), s2=cells(P.xz*2.5+1.);
  float l0=LC(.27)*bigm*nmag, l1=LC(.85)*nmag, l2=LC(2.5)*nmag;      // (magnified, a stone would be the size of a house: scree is a tone then)
  float gap0=(1.-smoothstep(.02,.16,s0.x))*l0, gap1=(1.-smoothstep(.03,.2,s1.x))*l1*(1.-.7*l0*smoothstep(.16,.3,s0.x)), gap2=(1.-smoothstep(.04,.24,s2.x))*l2*(1.-l0*.8)*(1.-.5*l1);
  float st=mix(.5,mix(mix(s2.y,s1.y,l1*.75),s0.y,l0*smoothstep(.12,.22,s0.x)),max(l0,max(l1,l2)));
  st=mix(.5,st,bareS);                                        // (under a drift's edge the stones are one tone: no squares in the snow)
  vec3 scr=mix(vec3(.15,.15,.165),vec3(.47,.43,.37),smoothstep(.1,.9,st))*(.9+.2*g2);
  scr=mix(scr,scr*vec3(.7,.72,.8),smoothstep(.45,.7,fbm(P.xz*.06+31.))*.6);          // older, lichened runs
  scr=mix(scr,vec3(.3,.34,.13),step(.8,fract(st*7.3))*.35*max(l0,l1)*bareS);
  float lee=dot(normalize(s0.zw+1e-4),sdir)*l0*smoothstep(.1,.25,s0.x)+dot(normalize(s1.zw+1e-4),sdir)*l1*.6*(1.-l0);
  scr*=1.+.22*lee*bareS;
  scr*=1.-.62*max(gap0,max(gap1*.85,gap2*.6))*bareS;
  vec3 alb=mix(rock,scr,talus*mix(.94,.42,mag));
  // as a range: continuous beds a few tens of metres thick that dip across the slope, each of its own tone with a
  // line of shade under it; colour only (relief on them, lit by a low sun, breaks into dashes)
  float bq=(P.y+dot(P.xz,vec2(.21,.07)))/2.7+(warp-.5)*2.6+(sn-.5)*1.2, bqi=floor(bq), bqf=bq-bqi, fbq=fwidth(bq);
  float lQ=clamp(1.5-fbq*3.,0.,1.)*mag;
  float bedT=h21(vec2(bqi,7.3))-.5, bedE=(1.-smoothstep(0.,.26+fbq,bqf))*step(.3,h21(vec2(bqi,3.1)));
  alb*=1.+(bedT*.6-.36*bedE)*lQ;
  alb=mix(alb,alb*vec3(.62,.66,.78),lQ*step(.72,h21(vec2(bqi,11.7)))*.7);                         // a slate bed among the cream ones
  alb=mix(alb,alb*vec3(.8,.84,.95),lQ*smoothstep(.45,.7,fbm(P.xz*.035+P.y*.02+9.))*.6);          // slate runs among the cream
  // from the river, at its own scale, the range is a few hundred metres off: the same dipping beds, a dozen metres
  // thick, cream ribs standing out of blue-grey gullies (the hollows are baked into the mesh)
  float frd=smoothstep(90.,300.,dist)*nmag;
  float b2=(P.y+dot(P.xz,vec2(.21,.07)))/13.+(warp-.5)*1.1+(sn-.5)*.45, b2i=floor(b2), b2f=b2-b2i, fb2=fwidth(b2);
  float lQ2=clamp(1.5-fb2*3.,0.,1.)*frd*(1.-.85*nz)*bedK;
  alb*=1.+((h21(vec2(b2i,7.3))-.5)*.62-.36*(1.-smoothstep(0.,.25+fb2,b2f))*step(.3,h21(vec2(b2i,3.1))))*lQ2;
  alb=mix(alb,alb*vec3(.66,.7,.84),lQ2*step(.72,h21(vec2(b2i,11.7)))*.6);
  alb=mix(alb,mix(alb*vec3(.66,.75,.98),alb*vec3(1.14,1.06,.93),smoothstep(.5,.86,vAO)),max(frd,gK*(1.-nz)*smoothstep(40.,110.,dist))*.85);
  // down the fall line of the flanks: pale ribs, slate-blue runnels between them
  float colm=vn(vec2(P.z*.11+warp*2.2,P.x*.007+5.))*.6+vn(vec2(P.z*.31+warp*3.+3.,P.x*.018))*.4, flK=(1.-bedK)*(1.-nz)*nmag*smoothstep(40.,120.,dist);
  alb=mix(alb,mix(alb*vec3(.6,.7,.95),alb*vec3(1.16,1.1,1.),smoothstep(.36,.62,colm)),flK*.8);
  alb*=1.+.16*nz*smoothstep(.82,.98,vAO)*(1.-talus);                                             // a lip, an arris: weathered pale
  float low=1.-smoothstep(58.,96.,P.y+sn*40.);
  float veg=lie*smoothstep(.47,.55,fbm(P.xz*.06+9.)+.3*(sn-.5))*low*smoothstep(.6,.72,Ng.y);
  veg=max(veg,(1.-smoothstep(.07,.2,steep))*(1.-smoothstep(30.,100.,P.y+sn*50.))*soft);
  veg*=1.-.85*nz*smoothstep(5.,22.,P.y);
  alb=mix(alb,tundraCol(P.xz,fwp)*(.85+.3*g1),veg*(1.-.25*talus));
  alb=mix(alb,vec3(.74,.78,.86),snow);
  // relief in metres (fine grain, strata, stones); the blocks' own faces are set below
  float stoneH=(min(s0.x*2.2,1.)*1.6*l0+min(s1.x*2.,1.)*.5*l1*(1.-.6*l0)+min(s2.x*2.,1.)*.16*l2)*talus*(1.-veg)*bareS;
  float hgt=(str-.5)*.06*slope*nmag-chute*1.2-streak*.14+stoneH+((g1-.5)*.1+(g2-.5)*.025)*nmag;
  hgt*=bareS;
  vec3 dpx=dFdx(P), dpy=dFdy(P); float hx=dFdx(hgt), hy=dFdy(hgt);
  vec3 r1=cross(dpy,Ng), r2=cross(Ng,dpx); float det=dot(dpx,r1);
  vec3 gb=(hx*r1+hy*r2)*(sign(det)/max(abs(det),1e-7));
  gb*=min(1.,.9/max(length(gb),1e-4));
  vec3 nb=Ng-gb;
  float rk=bareS*(1.-veg)*(1.-talus)*mix(1.,.5,mag)*jk*mix(.25,1.,graze);
  // every block faces its own way a little; where it stands proud its side shows: a ledge top, an overhang, a joint face
  nb+=((vec3(A.x,fract(A.x*7.31),fract(A.x*13.7))-.5)*.5*A.w+(vec3(B.x,fract(B.x*7.31),fract(B.x*13.7))-.5)*.36*B.w*kB+(vec3(C.x,fract(C.x*7.31),fract(C.x*13.7))-.5)*.24*C.w*kC)*rk*mix(.2,1.,smoothstep(.35,.9,slope));   // (a dome is jointed granite, not scales: a block's own tilt shows on walls) (on near-level rock under a low sun a strong tilt puts every other block in shade: a checker)
  nb+=(vec3(s0.y,fract(s0.y*7.31),fract(s0.y*13.7))-.5)*.7*l0*talus*(1.-veg)*bareS+(vec3(s1.y,fract(s1.y*5.31),fract(s1.y*11.7))-.5)*.5*l1*(1.-l0)*talus*(1.-veg)*bareS;
  nb+=((vec3(fq1.y,fract(fq1.y*7.31),fract(fq1.y*13.7))-.5)*.16*lf1+(vec3(fq2.y,fract(fq2.y*5.31),fract(fq2.y*11.7))-.5)*.07*lf2)*(1.-veg)*(1.-talus);
  nb=nb/max(length(nb),1e-4);
  nb=mix(nb,fnA,fkA*A.w*.9*rk); nb=mix(nb,fnB,fkB*B.w*.8*rk); nb=mix(nb,fnC,fkC*C.w*.6*rk);
  vec3 N=nb/max(length(nb),1e-4);
  float sh=texture2D(uShade,${ro},mag*3.).r; float cs=cloudShadow(P.xz);     // (magnified, a texel of the baked shadow is 80 m: read it blurred)
  // (round the bastion the low sun's shadows are baked a second time, a metre and a half fine: a buttress throws a hard edge)
  vec2 sN=vec2((P.x-(${ne.x0.toFixed(1)}))/${(ne.x1-ne.x0).toFixed(1)},(P.z-(${ne.z0.toFixed(1)}))/${(ne.z1-ne.z0).toFixed(1)});
  float eN=min(min(sN.x,1.-sN.x),min(sN.y,1.-sN.y));
  sh=mix(sh,texture2D(uShadeN,clamp(sN,0.,1.)).r,smoothstep(0.,.05,eN)*nmag);
  sh=mix(sh,1.,uBare*(1.-vInst)*smoothstep(146.,160.,P.y));      // (the towers' heads stand in the sun; a loose block has the light of the ground it lies on)
  cs=mix(cs,1.,.75*smoothstep(110.,160.,P.y));               // high ground catches the sun under the cloud deck
  cs=mix(cs,1.,1.-smoothstep(70.,230.,length(P.xz-vec2(-30.,140.))));   // and a gap in the deck stands over the spur
  cs=mix(cs,1.,.88*nz);                                       // and over the bastion: the low sun models it
  float occ=smoothstep(.16,.62,vAO);                          // gullies, hollows, and the ground a block stands on
  float ndl=max(dot(N,uSunL),0.), ao=mix(.68+.1*uBare,1.,vAO)*(1.-.3*chute)*(1.-.4*dark*(1.-veg)*bareS)*(.84+.16*occ);     // (a gully is slate-blue under the sky, not soot)
  float sunK=sh*cs*mix(.1+.2*uBare+.3*vInst,1.,occ)*(1.-.5*dark*(1.-veg)*bareS);   // (a loose block is dark at its foot, not black)
  float con=clamp(vCon,0.,1.), litK=clamp(sh*cs,0.,1.)*vInst;   // the ground a block stands on; a block's extra fill is for one that stands in the sun
  ao*=1.-.5*con; sunK*=1.-.85*con;
  // a range a few kilometres off under a low sun: what the sun only grazes is in shade, and the shade is deep and blue
  // a block's own tilt shades it by degrees: it never throws a sunlit face wholly into shade, nor lights one in a
  // shadowed face (that was a checker of cream and navy squares from the gate); the side faces of proud blocks keep theirs
  float ndG=max(dot(Ng,uSunL),0.), fcK=clamp(max(fkA*A.w,max(fkB*B.w,fkC*C.w))*rk,0.,1.);
  ndl=mix(clamp(ndl,ndG*.6,ndG*1.25+.3),ndl,fcK);
  float amb=mix(1.,.72,mag); ndl=mix(ndl,smoothstep(.25,.7,ndl),mag);
  ndl=mix(ndl,ndl*.7+.3*clamp(dot(N,uSunL)*.5+.5,0.,1.),vInst);       // a loose block is lit round its corners: no facet of it is a black shard
  // (a loose block in shade still stands in the light thrown back by the lit rock round it: slate, never a navy sliver)
  vec3 col=alb*(uSunCol*ndl*sunK+(uSkyCol*mix(.74+.6*N.y,1.05+.35*N.y,litK)+uSunCol*(.04+.1*litK)*(1.-.5*N.y)*(1.-mag)*mix(.4,1.,sh*cs)+(uPal[1]*.05+uPal[6]*.05)*(1.-N.y))*ao*amb*mix(vec3(1.),vec3(.8,.93,1.2),mag));
  vec3 Hh=uSunL+V; Hh/=max(length(Hh),1e-4);
  float nv=length(fwidth(N)), pw=40./(1.+nv*30.);
  float sp=pow(max(dot(N,Hh),0.),pw)*sunK*(pw+2.)/42.;                    // wet glint after the shower: a sheen, never a sparkle
  col+=uSunCol*sp*(.1+.22*snow)*(.3+.7*g2);
  col=mix(col,uHazeCol*1.12,mag*(1.-exp(-max(vDepth,0.)*.00042))*.5);    // as a range it stands in more air
  float alpha=1.;
  ${Ae}
}`,is=`
varying vec3 vP;
${ze}
void main(){ vP=position; vec4 mvPosition=modelViewMatrix*vec4(position,1.); gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
  vDepth=-mvPosition.z;
}`,ls=`
${Pe}
${te}
uniform sampler2D uMap; uniform sampler2D uShade;
uniform float uFadeD; uniform vec4 uWake[10];
varying vec3 vP;
// x = gap between the two nearest cells, y = the cell's id, zw = from the cell's centre to here
vec4 cells(vec2 p){
  vec2 i=floor(p), f=fract(p), rb=vec2(0.); float d1=9., d2=9., id=0.;
  for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){
    vec2 g=vec2(float(x),float(y)); vec2 r=g+vec2(h21(i+g),h21(i+g+57.3))*.8+.1-f; float d=dot(r,r);
    if(d<d1){ d2=d1; d1=d; id=h21(i+g+11.7); rb=r; } else if(d<d2){ d2=d; }
  }
  return vec4(sqrt(d2)-sqrt(d1),id,-rb);
}
// The coastal plain is seen from 200 m up and from 18 m up, so it is built as things with an outline at every size,
// each fading to its mean by the size of a pixel on the ground: oriented thaw lakes and drained lake basins a hundred
// metres long, beaded streams, ice-wedge polygons at two sizes with wet troughs and pooled low centres, cushions of
// single plants; along the river gravel bars with cobbles, wet threads between the bars, shoals under shallow water.
void main(){
  if(uFadeD<=fract(52.9829189*fract(dot(gl_FragCoord.xy,vec2(.06711056,.00583715))))) discard;
  vec3 P=vP; vec2 p=P.xz;
  vec3 toC=uCamL-P; float dist=length(toC); vec3 V=toC/max(dist,1e-3);
  vec2 dpx=dFdx(p), dpy=dFdy(p);
  float fw=abs(dpx.x)+abs(dpy.x)+abs(dpx.y)+abs(dpy.y);
  float fq=sqrt(max(sqrt(max(length(dpx)*length(dpy),1e-9))*fw,1e-9));    // ground seen aslant: a pixel is long but narrow
  vec2 sdir=uSunL.xz/max(length(uSunL.xz),1e-3);
  vec2 muv=vec2((p.x-(${Tt.x0}.))/${Tt.x1-Tt.x0}.,(p.y-(${Tt.z0}.))/${Tt.z1-Tt.z0}.);
  float inMap=step(0.,muv.x)*step(muv.x,1.)*step(0.,muv.y)*step(muv.y,1.);
  vec4 m=texture2D(uMap,muv)*inMap;
  vec2 suv=${ro};
  float sh=mix(1.,texture2D(uShade,suv).r,step(0.,suv.x)*step(suv.x,1.)*step(0.,suv.y)*step(suv.y,1.));
  float cs=cloudShadow(p);
  // coast: lagoon behind barrier islands, then the sea (a level shore: a wavy one reads as a bent horizon)
  float cn=(fbm(p*.004+3.)-.5)*64.+(fbm(p*.02)-.5)*20.;
  float lag=smoothstep(0.,16.,(${je}.+cn)-p.y);
  float zb=${je-340}.+(fbm(vec2(p.x*.0016,2.))-.5)*90.;
  float gapn=vn(vec2(p.x*.0035,7.));
  float wB=34.+80.*smoothstep(.3,.55,gapn);
  float isl=(1.-smoothstep(wB*.55,wB,abs(p.y-zb)+(vn(p*.03)-.5)*10.))*smoothstep(.26,.36,gapn)*clamp(wB*2./(fw+1.),0.,1.);
  // the river's own ground: gravel bars and what grows along them
  float gn=vn(p*.09), rip=1./(1.+fw*.5);
  float kf1=clamp(1.5-fq*2.,0.,1.), kf2=clamp(1.5-fq*7.,0.,1.);
  float fine=(vn(p*.6+3.)-.5)*.07*kf1+(vn(p*2.3+9.)-.5)*.035*kf2;
  // seen from low down no edge on the river is a ruled line: bays and spits a few metres across, then single stones
  float kfr=clamp(1.5-fq*.7,0.,1.), rag=((vn(p*.23+7.)-.5)*.6+(vn(p*.71+3.)-.5)*.34)*kfr+(vn(p*1.9+13.)-.5)*.2*kf1;
  float gb=clamp(m.g+((gn-.5)*.24+(vn(p*.031+3.)-.5)*.3+(vn(p*.011+9.)-.5)*.2+fine+rag*.16)*smoothstep(0.,.2,m.g)*(1.-smoothstep(.9,1.,m.g)),0.,1.);
  float river=smoothstep(.02,.3,gb), dry=1.-river;
  // ---- the tundra
  vec3 crim=uPal[1]*.55, gold=uPal[2]*.55, rus=uPal[3]*.55, pale=uPal[0]*.44, dkg=vec3(.06,.085,.04), soil=vec3(.05,.04,.035);
  vec3 t=tundraCol(p,fw), t0=t;
  float wetz=smoothstep(.42,.6,fbm(p*.0055+9.));
  // ice-wedge polygons: 17 m, and 5 m inside them; each cell of its own tone, troughs dark and wet, rims lit on the
  // sunward side, some low centres pooled
  // (polygon ground comes in fields, never wall to wall, and no cell is a tile: the net is bent by the ground's own grain)
  float pmask=smoothstep(.4,.62,fbm(p*.0042+17.)+.12*(vn(p*.019+3.)-.5));
  vec2 pw=(vec2(vn(p*.035+11.),vn(p*.035+47.))-.5)*1.1+(vec2(vn(p*.13+5.),vn(p*.13+29.))-.5)*.35;
  vec4 pg=cells(p*.06+fbm(p*.01)*1.5+pw), pg2=cells(p*.21+7.+(vn(p*.05)-.5)*.5+pw*1.7);
  float pf1=clamp(1.6-fq*.75,0.,1.)*pmask, pf2=clamp(1.7-fq*1.6,0.,1.)*(.35+.65*pmask);
  float tr1=(1.-smoothstep(.02,.09+fq*.05,pg.x))*pf1, tr2=(1.-smoothstep(.03,.12+fq*.18,pg2.x))*pf2*(.45+.55*wetz);
  float rimL=dot(pg.zw/max(length(pg.zw),1e-3),sdir)*smoothstep(.03,.1,pg.x)*(1.-smoothstep(.1,.3,pg.x));
  t*=mix(1.,.84+.32*pg.y,pf1*.85);
  t=mix(t,mix(t,pale,.6),smoothstep(.08,.14,pg.x)*(1.-smoothstep(.16,.32,pg.x))*pf1*.2*(1.-.6*wetz));   // raised rims, dry and pale
  t*=1.+.34*rimL*pf1;
  // frost hummocks five metres across: each a low dome, lit on its sunward side and in shade on the other
  float hl2=length(pg2.zw), hsd=dot(pg2.zw/max(hl2,1e-3),sdir);
  t*=1.+(.3*hsd*smoothstep(.04,.3,hl2)-.1*smoothstep(.1,.42,hl2))*pf2;
  // cushions of single plants, a metre and a half across (seen only from low down)
  vec4 cu=cells(p*.7+3.+(vn(p*2.1)-.5)*.3);
  float pf3=clamp(1.6-fq*2.3,0.,1.), qc=fract(cu.y*5.71+pg.y*1.3);
  vec3 cc=mix(crim,gold,step(.36,qc)); cc=mix(cc,rus,step(.56,qc)); cc=mix(cc,pale,step(.76,qc)); cc=mix(cc,dkg*1.6,step(.9,qc));
  float csd=dot(cu.zw/max(length(cu.zw),1e-3),sdir);
  float cul=length(cu.zw), cuk=smoothstep(.08,.4,cul);
  t=mix(t,mix(soil*(1.-.5*max(-csd,0.)),cc*(.8+.4*fract(cu.y*9.1))*(1.+(.5*max(csd,0.)-.36*max(-csd,0.))*cuk),smoothstep(.02,.12,cu.x)),pf3*.7);
  t*=mix(1.,.8+.4*vn(p*4.3+1.),clamp(1.5-fq*13.,0.,1.));
  t=mix(t,t*.62+vec3(.012,.03,.004),wetz*.4);                                    // sedge meadow in the wet ground
  t=mix(t,t*.3+vec3(.008,.01,.014),max(tr1*.85,tr2*.62));
  // oriented thaw lakes and drained basins: ellipses a little west of north, each with a wet dark margin
  vec2 lq=vec2(p.x*.9781+p.y*.2079,-p.x*.2079+p.y*.9781);
  vec4 lk=cells(vec2(lq.x/165.,lq.y/290.)+(fbm(p*.0021+5.)-.5)*.5+13.);
  float lsz=.2+.2*fract(lk.y*7.31);
  float le=length(lk.zw)/lsz+(vn(p*.021+7.)-.5)*.34+(vn(p*.075)-.5)*.12*clamp(1.5-fq*.2,0.,1.);
  float aaL=max(fwidth(le)*.8,.012);
  float isLake=step(.58,lk.y), isBasin=step(.3,lk.y)*(1.-isLake);
  float inL=1.-smoothstep(1.-aaL,1.+aaL,le);
  float lake=inL*isLake*dry;
  float marg=(1.-smoothstep(1.,1.28+aaL,le))*(1.-inL)*(isLake+isBasin)*dry;
  t=mix(t,dkg*1.3+t*.2,marg*.75);
  // a drained basin: pale sedge and gold grass in rings round the pond that is left
  float bas=inL*isBasin*dry, ring=.5+.5*sin(le*17.+vn(p*.03)*4.);
  vec3 bcol=mix(mix(gold*.95,pale*1.05,.5),dkg*2.2,.3+.3*ring*clamp(1.4-fwidth(le)*9.,0.,1.))*(.8+.35*vn(p*.06+4.));
  t=mix(t,bcol,bas*.85);
  float bpond=bas*(1.-smoothstep(.34-aaL,.34+aaL,le+(vn(p*.05+17.)-.5)*.2));
  float pn=fbm(p*.011+40.)+.22*vn(p*.05);
  float pond=max(smoothstep(.83,.86,pn),step(.8,pg.y)*(1.-smoothstep(.13,.2,length(pg.zw)+(vn(p*.4)-.5)*.08))*wetz*pf1);      // a pond in some low centres
  t=mix(t,t*.5+vec3(.0,.012,.0),smoothstep(.66,.77,pn)*.7);
  // channel fringe: gold willow line, dark sedge, then gravel bar
  t=mix(t,uPal[2]*.5*mix(1.,.7+.5*cu.y,pf3),smoothstep(.05,.2,gb)*(1.-smoothstep(.26,.4,gb))*.42*smoothstep(.42,.62,vn(p*.045+8.)+(vn(p*.3)-.5)*.3*kf1)*mix(1.,.35+.65*smoothstep(.04,.14,cu.x)*step(.3,fract(cu.y*3.7)),pf3));
  t=mix(t,vec3(.1,.11,.05),smoothstep(.26,.38,gb)*(1.-smoothstep(.44,.54,gb))*.8*smoothstep(.3,.55,vn(p*.06+3.)));
  // gravel: cobbles near, each with a lit side and a dark gap; pale dry tops, darker damp hollows, drift lines
  vec4 cb=cells(p*1.25+5.);
  float pfc=clamp(1.6-fq*6.,0.,1.);
  vec3 gravel=mix(uPal[4]*.36,uPal[0]*.42,vn(p*.17))*mix(.97,.8+.34*vn(p*1.4),rip);
  gravel*=mix(1.,(.72+.5*cb.y)*(1.+.3*dot(cb.zw/max(length(cb.zw),1e-3),sdir))*(.6+.4*smoothstep(.02,.14,cb.x)),pfc*.85);
  gravel*=.86+.28*smoothstep(.4,.6,vn(vec2(p.x*.05+p.y*.012,p.y*.021-p.x*.004)+31.));     // bars laid down in long lenses
  vec4 cb2=cells(p*.33+9.+(vn(p*.9)-.5)*.4);
  float pfb=clamp(1.6-fq*1.5,0.,1.), patchK=smoothstep(.4,.62,vn(p*.07+23.));
  gravel*=mix(1.,(.8+.36*cb2.y)*(1.+.2*dot(cb2.zw/max(length(cb2.zw),1e-3),sdir))*(.7+.3*smoothstep(.03,.16,cb2.x)),pfb*.7*patchK);   // boulder patches
  gravel*=mix(1.,.84+.3*vn(p*.42+7.)+.12*(vn(p*1.1+5.)-.5),kfr*.8);
  float damp=1.-smoothstep(.02,.07,abs(vn(vec2(p.x*.09+p.y*.02,p.y*.028-p.x*.006)+47.)-.5)+(vn(p*.5+3.)-.5)*.03);
  gravel=mix(gravel,gravel*vec3(.52,.56,.62),damp*.7*kfr);                                   // damp threads where the last flood ran
  float drift=smoothstep(.45,.49,abs(fract((m.r*3.+vn(p*.06+5.)*.6)*1.7)-.5));
  gravel=mix(gravel,vec3(.07,.06,.05),drift*.3*kf1*smoothstep(.05,.3,m.r));                 // drift lines of twigs along the old waterlines
  float bar=smoothstep(.46,.58,gb);
  vec3 alb=mix(t,gravel,bar);
  float isv=smoothstep(.6,.66,vn(p*.055+1.7)+(vn(p*.37+2.)-.5)*.2*kfr+(vn(p*1.3)-.5)*.1*kf1)*(1.-smoothstep(.08,.3,m.r));
  vec3 scrub=mix(mix(vec3(.1,.115,.05),uPal[2]*.42,smoothstep(.35,.65,vn(p*.5+9.))),t0*.75,.3);
  scrub*=mix(1.,(.72+.5*cu.y)*(.55+.45*smoothstep(.02,.12,cu.x))*(1.+.2*csd),pf3);
  alb=mix(alb,scrub,bar*isv);                                       // willow and sedge on the higher bars
  // fine silt laid down in the lee of the bars: smooth and pale, ripple-marked where the last flood drained off it
  float siltK=smoothstep(.5,.6,vn(p*.045+61.)+(vn(p*.21+9.)-.5)*.25*kfr)*bar*(1.-isv)*smoothstep(.6,.85,gb);
  vec3 siltC=mix(uPal[0]*.43,uPal[6]*.4,vn(p*.08+3.))*(.92+.12*vn(p*.9+5.));
  siltC*=1.+.07*sin(dot(p,vec2(.9,.44))*7.+vn(p*.35)*7.)*clamp(1.5-fq*11.,0.,1.);
  alb=mix(alb,siltC,siltK*.85);
  // the herd's own trails over the bars and the silt: trodden lines that part and join, pocked with hoof prints
  float tn2=(vn(p*.017+13.)*2.4+vn(p*.06+29.)*.5)*3.2, tw2=abs(fract(tn2)-.5)/max(fwidth(tn2),1e-5)*fq;
  float trk=(1.-smoothstep(.3,.7+fq,tw2))*bar*clamp(1.5-fq*2.,0.,1.)*smoothstep(.35,.5,vn(p*.011+71.));
  alb=mix(alb,alb*.5,trk*(.4+.6*smoothstep(.3,.6,vn(p*2.7+tn2*5.))));
  // the waterline, drawn below: wl rises through .66 where the stream begins (m.r is the map's soft-edged channel)
  float wn=(vn(p*.045+2.)-.5)*.45+(gn-.5)*.2+fine*1.6+rag*.5;
  float wl=m.r+wn, aw=clamp(fwidth(wl)*1.2,.02,.125);
  float wetl=smoothstep(.34,.6,wl)*bar;                            // the dark wet line the falling river leaves along every bar
  alb=mix(alb,alb*vec3(.4,.43,.47),wetl);
  alb=mix(alb,mix(gravel,uPal[2]*.5,gn*.6),isl);
  alb=mix(alb,vec3(.8,.84,.9),uSnow*.5*smoothstep(.5,.7,fbm(p*.02+77.))*(1.-bar));
  vec3 land=alb*(uSunCol*.42*sh*cs+uSkyCol*.95+uHorizCol*.2);      // (in shade the ground is still under the whole lit sky)
  // ---- water. The channels: soft-edged in the map, given a hard, ragged waterline here. Wet threads between the bars.
  float chan=smoothstep(.66-aw,.66+aw,wl);
  float shal=chan*(1.-smoothstep(.72,1.02,wl));                    // the shallow margin: the stones of the bar show through it
  float thal=smoothstep(.4,.62,vn(vec2(p.x*.05+p.y*.012,p.y*.015-p.x*.004)+3.)+(vn(p*.19+5.)-.5)*.3*kf1);
  float deep=smoothstep(.6,.88,m.r+wn*.6)*(.2+.8*thal);         // the thalweg wanders; shoals show through the rest
  float still=max(max(pond,bpond),lake)*(1.-smoothstep(.15,.35,gb));
  still=max(still,tr1*wetz*.75*(1.-smoothstep(.15,.35,gb)));       // the troughs of the wet polygons stand full of water
  still=max(still,lag*(1.-isl));
  float wat=max(chan,still);
  // ripples: wind ruffles on still water, riffles running with the stream in the channels
  // (trains of small waves crossing one another, their crests bent by a slow warp and drawn out along the stream:
  // sines, so there is no lattice in them; each train fades to flat where a pixel is longer than its wave)
  float ruf=mix(1.,.35+1.3*vn(p*.02-uTime*vec2(.5,.12)),still*(1.-chan));
  float rk=clamp(1.5-fq*2.5,0.,1.), rk0=clamp(1.5-fq*.6,0.,1.), rk2=clamp(1.5-fq*7.,0.,1.), rk3=clamp(1.5-fq*15.,0.,1.);
  // (the warp is kept small: a strong one bends the crests into marbled swirls when the water fills the foreground)
  vec2 wq=p+(vec2(vn(p*.09+3.),vn(p*.09+19.))-.5)*3.+(vec2(vn(p*.37+7.),vn(p*.37+31.))-.5)*.7, gw=vec2(0.);
  float tw=uTime;
  gw+=vec2(.52,.2)*.022*cos(dot(wq,vec2(.52,.2))+tw*1.3)*rk0+vec2(-.37,.3)*.026*cos(dot(wq,vec2(-.37,.3))-tw*1.1)*rk0;
  gw+=vec2(1.3,.31)*.045*cos(dot(wq,vec2(1.3,.31))+tw*2.1)*rk+vec2(-1.05,.6)*.05*cos(dot(wq,vec2(-1.05,.6))-tw*1.8)*rk+vec2(1.9,-.45)*.03*cos(dot(wq,vec2(1.9,-.45))+tw*2.9)*rk;
  gw+=vec2(4.3,.9)*.011*cos(dot(wq,vec2(4.3,.9))+tw*4.4)*rk2+vec2(-3.4,1.7)*.012*cos(dot(wq,vec2(-3.4,1.7))-tw*3.9)*rk2+vec2(6.1,-1.3)*.007*cos(dot(wq,vec2(6.1,-1.3))+tw*5.6)*rk2;
  // (a light chop over the trains, so that no two crests are alike)
  // wavelets a hand long, close under the lens
  gw+=vec2(9.1,2.3)*.0046*cos(dot(wq,vec2(9.1,2.3))+tw*6.8)*rk3+vec2(-7.4,5.2)*.005*cos(dot(wq,vec2(-7.4,5.2))-tw*6.1)*rk3+vec2(12.7,-3.1)*.0032*cos(dot(wq,vec2(12.7,-3.1))+tw*8.2)*rk3;
  gw+=(vec2(vn(wq*.8+vec2(tw*.5,0.)),vn(wq*.8+vec2(7.,-tw*.4)))-.5)*.045*rk+(vec2(vn(wq*2.6+vec2(-tw*.9,3.)),vn(wq*2.6+vec2(11.,tw*.8)))-.5)*.08*rk2+(vec2(vn(wq*7.3+vec2(tw*1.7,5.)),vn(wq*7.3+vec2(3.,-tw*1.4)))-.5)*.06*rk3;
  // V wakes behind the caribou that wade the shallows
  float wakeK=0.;
  for(int i=0;i<10;i++){
    vec2 q=p-uWake[i].xy, wd=uWake[i].zw; float l=length(wd);
    float bh=-dot(q,wd)/max(l,1e-3);
    if(l>.01&&bh>0.&&bh<13.){ wd/=l; float sd=dot(q,vec2(-wd.y,wd.x)), arm=abs(sd)-bh*.42;
      float k=exp(-min(arm*arm/(.04+bh*.035),30.))*smoothstep(0.,.8,bh)*(1.-smoothstep(3.,10.,bh));
      wakeK+=k; gw+=vec2(-wd.y,wd.x)*(sd<0.?-1.:1.)*k*.5; }
  }
  vec3 Nw=vec3(-gw.x,1.,-gw.y);
  Nw.xz*=ruf*mix(1.,1.7,(1.-deep)*chan); Nw/=max(length(Nw),1e-4);
  vec3 R=reflect(-V,Nw); R.y=abs(R.y)+.02; R/=max(length(R),1e-4);
  // (the sky lies in the water as a picture: it is looked up with the ripples calmed, and the ripples are drawn over it)
  vec3 Ns=vec3(Nw.x*.3,Nw.y,Nw.z*.3); Ns/=max(length(Ns),1e-4);
  vec3 Rs=reflect(-V,Ns); Rs.y=abs(Rs.y)+.02; Rs/=max(length(Rs),1e-4);
  float fres=mix(mix(.3,.14,chan),1.,pow(1.-clamp(V.y,0.,1.),3.4));
  vec3 sky=skyMirror(mix(R,Rs,chan)); sky=mix(sky,uSkyCol*.5,.7*max(pond,bpond)*(1.-chan)*(1.-lag)*(1.-lake));
  // the water carries the sky: the clouds lie in it, slate-based and lit cream toward the sun, and the ripples break their edges
  { float cup=clamp(Rs.y,0.,1.); vec2 cq=Rs.xz/(cup+.32)*1.7+uTime*vec2(.006,.002);
    float cl=fbm(cq)+.25*vn(cq*3.1+7.), clm=smoothstep(.5,.68,cl)*smoothstep(.03,.25,cup)*(1.-uAurora);
    float wR=dot(Rs.xz/max(length(Rs.xz),1e-4),sdir)*.5+.5;
    sky=mix(sky,mix(uSkyCol*.7,uHorizCol*.6+uSunCol*.08,clamp(wR*.7+.4*smoothstep(.55,.8,cl),0.,1.)),clm*.6*chan); }
  float gust=vn(p*.02-uTime*vec2(.5,.12));
  // glacial water: milky with silt, paler over the shoals and their gravel, a darker thread down the thalweg; seen
  // from above it is this body that shows, seen aslant the sky lies on it
  float shoal=smoothstep(.35,.65,vn(vec2(p.x*.05+p.y*.014,p.y*.016-p.x*.005)+3.)+(vn(p*.21+5.)-.5)*.3*kf1);
  vec3 silt=mix(vec3(.25,.31,.35),gravel*vec3(.66,.76,.82),max(.45*shoal*(1.-deep),shal*.9));
  silt=mix(silt,vec3(.07,.12,.18),deep*.9*(1.-shal));
  vec3 bed=silt*(uSunCol*.34*sh*cs+uSkyCol*.9+uHorizCol*.2);
  vec3 dark=vec3(.02,.03,.035)*(uSkyCol.b*2.+.3);
  float rs=clamp(1.4-fq*1.6,0.,1.);
  vec3 wcol=sky*fres*mix(1.,.72+.4*gust,still*(1.-chan))+mix(dark,bed,chan)*(1.-fres*mix(1.,.55,shal));
  // every ripple has a face to the low sun and a face away from it (close to: this is what the water is made of)
  wcol*=(1.+clamp(-dot(gw,sdir)*5.,-.32,.26)*mix(.5,1.,chan))*mix(1.,.84,chan*rs);
  wcol+=uSkyCol*.2*chan*smoothstep(.66-aw*4.,.66,wl)*(1.-smoothstep(.66+aw,.66+aw*5.,wl))*clamp(1.5-fq*3.,0.,1.);   // the bright line where the water meets the bar
  // the low sun on the water: threads kindle in turn; toward the sun a path of glitter
  float kin=smoothstep(.55,1.,sin(6.2832*(m.b*3.+uTime*.05+p.x*.0005)));
  float gl=vn(wq*vec2(1.25,1.05)+vec2(uTime*1.3,uTime*2.4))*.7+vn(wq*3.1-vec2(uTime*2.2,uTime*.9))*.3;   // (a sparkle the size of a ripple: drawn out along the stream it was a smear from low down)
  gl=mix(.14,gl*gl*gl*2.6,rs);
  float sunw=max(dot(R,uSunL),0.), s8=sunw*sunw; s8*=s8; s8*=s8;
  float s48=s8*s8*s8; s48*=s48;
  float glit=s48*(.12+1.1*min(gl*gl,2.2))+s8*.14;
  wcol+=uSunCol*((.04+.13*kin)*gl*chan+glit*.62*wat)*sh*cs;
  wcol+=uSunCol*.25*cs*gl*lag*(1.-isl)*(1.-chan);
  // seen from the ridge: light runs down the channels reach after reach, each channel in its own time (wind and sun
  // on moving water; close to, the ripples themselves do this)
  float runw=sin(p.y*.019+p.x*.007+uTime*1.25+m.b*37.)*.6+sin(p.y*.047-p.x*.011+uTime*2.1+m.b*11.)*.4;
  wcol*=mix(1.,.8+.42*smoothstep(-.5,.7,runw),(1.-rs)*chan*.9);
  wcol+=uSunCol*.07*smoothstep(.45,.9,runw)*(1.-rs)*chan*sh*cs*(.5+.5*kin);
  wcol=mix(wcol,vec3(.75,.8,.86)*(uSkyCol*2.+.3),uSnow*.6*smoothstep(.55,.7,m.r)*(1.-smoothstep(.8,.95,m.r))); // ice rims
  wcol+=(uSkyCol*1.2+uSunCol*.25*sh*cs)*min(wakeK,1.)*.3*chan;
  land=mix(land,land*.7+sky*.2,wetl*(1.-chan));                     // wet stones and wet silt shine a little
  vec3 col=mix(land,wcol,wat);
  // river mist at frost dawn: separate low wisps along the water, never a sheet (close to, the water is clear)
  float mw=fbm(p*.0105+vec2(uTime*.03,7.))*.72+vn(p*.043-vec2(uTime*.05,3.))*.28;
  float mist=uMist*smoothstep(.55,.72,mw)*smoothstep(.2,.7,m.r+.3*smoothstep(.3,.85,gb))*.62*smoothstep(40.,340.,dist);
  col=mix(col,(uSkyCol*1.6+uSunCol*.2*cs),mist);
  float alpha=1.;
  ${Ae}
}`;function io(s,et,L,kt=0){const Nt=[],zt=[],pt=(I,D,M,d)=>{Nt.push(I[0],I[1],I[2],D[0],D[1],D[2],M[0],M[1],M[2]),zt.push(d[0],d[1],d[2])},E=(I,D,M,d,P,U,Z)=>{const A=[],j=[];let ht=s()*6.283;for(let C=0;C<U;C++)A.push(ht),ht+=6.283/U*s.range(.7,1.3),j.push(M*s.range(.82,1.18));const W=Math.max(P-d,1),n=.5+.5*Rt(Math.hypot(I,D)/(L*.75),0,1),p=(C,N=1)=>Rt((.34+(C-d)/(et*.42))*n*N,.2,1),$=(C,N,F,J,wt,ft)=>A.map((Bt,Vt)=>{const Dt=Math.cos(Bt)*j[Vt]*N,mt=Math.sin(Bt)*j[Vt]*N;return[I+Z[0]*(C-d)+F+Dt,C+wt*Dt+ft*mt,D+Z[1]*(C-d)+J+mt]}),b=(C,N,F,J)=>{for(let wt=0;wt<U;wt++){const ft=(wt+1)%U;pt(C[wt],N[wt],C[ft],[F,J,F]),pt(C[ft],N[wt],N[ft],[F,J,J])}};let V=d-3,ut=1.1,K=0,Q=0,Y=0;for(;V<P-.05&&Y++<9;){let C=W*s.range(.16,.34)+.8;const N=V+C>P-.16*W;N&&(C=P-V);const F=V+C,J=ut*s.range(.9,.99),wt=Math.min(.22,M*.12),ft=N?0:s.range(-.1,.1),Bt=N?0:s.range(-.1,.1);if(N){const Vt=s()*6.283,Dt=s.range(.55,1.35),mt=Math.cos(Vt)*Dt,yt=Math.sin(Vt)*Dt,f=M*.3,i=$(V,ut,K,Q,0,0),m=$(F-f,J,K,Q,mt,yt),z=$(F,J*.72,K,Q,mt*.8,yt*.8);b(i,m,p(V),p(F)),b(m,z,p(F),1);const H=[0,0,0];z.forEach(G=>{H[0]+=G[0]/U,H[1]+=G[1]/U,H[2]+=G[2]/U}),H[1]+=M*.12;for(let G=0;G<U;G++)pt(z[G],H,z[(G+1)%U],[1,1,1]);break}else{const Vt=$(V,ut,K,Q,0,0),Dt=$(F-wt,J,K,Q,ft,Bt),mt=$(F,J*.86,K,Q,ft,Bt);b(Vt,Dt,p(V),p(F)),b(Dt,mt,p(F),p(F,.42)),K+=s.range(-.1,.1)*M,Q+=s.range(-.1,.1)*M,ut=J*s.range(.94,1.04);const yt=$(F+wt,ut,K,Q,ft,Bt);b(mt,yt,p(F,.42),p(F,.9)),V=F+wt}}},O=kt>0,nt=O?2:3,k=O?Math.max(2,kt-3):s.int(5,6),R=O?2:s.int(7,9),at=s()*6.283;for(let I=0;I<nt;I++){const D=at+I/nt*6.283,M=I===0?0:L*s.range(.2,.3);E(Math.cos(D)*M,Math.sin(D)*M,L*s.range(.29,.36),0,et*[1,.84,.7][I]*s.range(.94,1),s.int(5,6),[s.range(-.025,.025),s.range(-.025,.025)])}for(let I=0;I<k;I++){const D=at+.5+I/k*6.283+s.range(-.25,.25),M=L*s.range(.44,.62),d=M/L;E(Math.cos(D)*M,Math.sin(D)*M*.9,L*s.range(.22,.3),-d*2,et*s.range(.42,.78),s.int(5,6),[-Math.cos(D)*s.range(0,.06),-Math.sin(D)*s.range(0,.06)])}for(let I=0;I<R;I++){const D=at+I/R*6.283+s.range(-.3,.3),M=L*s.range(.74,1.02),d=M/L;E(Math.cos(D)*M,Math.sin(D)*M*.9,L*s.range(.2,.28),-d*2.5,et*s.range(.1,.4),s.int(4,6),[-Math.cos(D)*s.range(-.02,.09),-Math.sin(D)*s.range(-.02,.09)])}const w=new l.BufferGeometry;return w.setAttribute("position",new l.Float32BufferAttribute(Nt,3)),w.setAttribute("aAO",new l.Float32BufferAttribute(zt,1)),w.setAttribute("aCon",new l.Float32BufferAttribute(new Float32Array(zt.length),1)),w.computeVertexNormals(),w}function cs(s,et){const L=[11,13,10,12][et],kt=[1.2,1,.72,1][et],Nt=[.36,.74,1.1,.62][et],zt=[.95,.84,.6,.92][et],pt=[],E=R=>Math.sign(R)*Math.pow(Math.abs(R),.55);for(let R=0;R<L;R++){let at=s.range(-1,1),w=s.range(-1,1),I=s.range(-1,1);const D=Math.hypot(at,w,I)||1,M=s.range(.78,1)/D;at=E(at*M),w=E(w*M),I=E(I*M),pt.push(new l.Vector3((at+w*(et===2?.35:.14))*kt,w*Nt,(I-w*.1)*zt))}const O=new Qo(pt),nt=O.attributes.position,k=new Float32Array(nt.count);for(let R=0;R<nt.count;R++)k[R]=Rt(.62+.5*nt.getY(R)/Nt,.42,1);return O.setAttribute("aAO",new l.Float32BufferAttribute(k,1)),O.setAttribute("aCon",new l.Float32BufferAttribute(new Float32Array(k.length),1)),O}const hs=`
${te}
attribute vec3 corner; attribute vec4 aPos; attribute vec4 aDir;
uniform float uHerdAdv; uniform float uPx; uniform vec2 uShadowDir; uniform float uShLen; uniform float uNearT;
varying vec2 vUv; varying float vPart; varying float vKind; varying float vSun; varying float vLod; varying float vFlip;
${ze}
void main(){
  // kind 0 cow, 1 bull, 2 Dall sheep, 3 the shadow alone of an animal that is modelled (see the near herd)
  float kind=aDir.z, own=step(2.5,kind);
  // an animal is never drawn smaller than a few pixels, so from the ridge the files read; by the same licence it is
  // never drawn smaller than 2.3 m, so that from low over the river a file is animals with legs and not a row of dots
  // (the quad holds the antlers too: the withers are at two thirds of its height, as tall as a modelled animal's)
  float hgt=mix(max(.19*aPos.w,kind>1.5?1.5:2.5*(.86+.14*aPos.w)),.19*aPos.w,own), len=hgt*1.42;
  float adv=mix(uHerdAdv*(kind>1.5?.12:1.)*(.8+.4*fract(aPos.z*7.31)),uNearT*aPos.z,own);
  vec3 c=vec3(aPos.x+aDir.x*adv,aDir.w,aPos.y+aDir.y*adv);
  vec4 mvPosition=modelViewMatrix*vec4(c,1.);
  float dist=max(-mvPosition.z,.1), S=max(length(modelMatrix[0].xyz),1e-5), px=dist*uPx;
  float nearK=1.-smoothstep(380.*S,1500.*S,dist);
  float hh=max(hgt*S,px*mix(2.4,4.3,nearK));
  vLod=clamp(1.9-hh/(px*4.6),0.,1.);                      // a blob under four pixels, an animal with legs from nine
  vec3 dv=mat3(modelViewMatrix)*vec3(aDir.x,0.,aDir.y); vFlip=dv.x<0.?-1.:1.;
  if(corner.z<.5){
    float hw=max(len*S*.62,px*mix(1.2,1.7,nearK))*(1.-own);
    mvPosition.xy+=vec2(corner.x*2.*hw,corner.y*hh*(1.-own)); mvPosition.z+=min(dist*.004,.6);
  } else {
    vec2 pr=vec2(-uShadowDir.y,uShadowDir.x);
    float wd=max(len*.8,px*mix(1.7,2.7,nearK)/S), L=max(len*uShLen,px*mix(8.,17.,nearK)/S);
    // (kind 4 and up: the shadow of a plant; its fraction shortens the shadow, and it is never fattened to be seen)
    if(kind>3.5){ wd=len*.8; L=len*uShLen*(1.-fract(kind)); }
    vec3 q=c+vec3(uShadowDir.x,0.,uShadowDir.y)*(corner.y*L)+vec3(pr.x,0.,pr.y)*(corner.x*wd);
    q.y+=.03+dist*.0006/S;
    mvPosition=modelViewMatrix*vec4(q,1.);
  }
  vUv=corner.xy; vPart=corner.z; vKind=kind; vSun=cloudShadow(c.xz);
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
  vDepth=-mvPosition.z;
}`,fs=`
${Pe}
${te}
varying vec2 vUv; varying float vPart; varying float vKind; varying float vSun; varying float vLod; varying float vFlip;
void main(){
  vec3 col; float alpha;
  if(vPart<.5){
    // a caribou side on, head toward +x: a deep body carried level, the neck sloping forward and down to a small head
    // held low, two pairs of legs with daylight between them, the rack swept back over the shoulders and up
    vec2 q=vec2(vUv.x*2.*vFlip,vUv.y);
    float bull=step(.5,vKind)*step(vKind,1.5), sheep=step(1.5,vKind);
    float aa=.035;
    float body=1.-smoothstep(1.-aa*4.,1.,length((q-vec2(-.12,.5-.03*q.x))/vec2(.56,.165)));
    vec2 na=vec2(.3,.57), nb=vec2(.7,.6); vec2 pa=q-na, ba=nb-na; float hn=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);
    float neck=1.-smoothstep(.1-.03*hn-aa,.1-.03*hn,length(pa-ba*hn));
    float head=1.-smoothstep(1.-aa*5.,1.,length((q-vec2(.8,.575-.25*(q.x-.8)))/vec2(.15,.07)));
    float lx=q.x-(q.y-.2)*.06, lw=.036+.02*smoothstep(.25,.42,q.y);
    float legs=step(q.y,.44)*max(max(1.-smoothstep(lw-.012,lw,abs(lx-.27)),1.-smoothstep(lw-.012,lw,abs(lx-.13))),max(1.-smoothstep(lw-.012,lw,abs(lx+.5)),1.-smoothstep(lw-.012,lw,abs(lx+.63))));
    float ay=(q.y-.63)/mix(.2,.36,bull), ax=.66-.34*ay+.42*ay*ay;
    float beam=(1.-smoothstep(.022,.045,abs(q.x-ax)))*step(0.,ay)*step(ay,1.);
    float brow=(1.-smoothstep(.02,.04,abs(q.y-.66-(q.x-.68)*.45)))*step(.68,q.x)*step(q.x,.86)*bull;
    float tine=(1.-smoothstep(.02,.04,abs(q.x-ax-.02-(ay-.62)*.5)))*step(.62,ay)*step(ay,.95);
    float ant=max(beam,max(brow,tine))*(1.-sheep);
    float blob=1.-smoothstep(.55,1.,length((q-vec2(0.,.42))/vec2(1.,.42)));
    float shape=max(max(body,neck),max(head,max(legs,ant)));
    alpha=mix(shape,blob,vLod);
    // the coat of the modelled animals: grey-brown, darker legs and belly, the pale neck and mane, the white rump
    vec3 coat=vec3(.115,.085,.06), pale=vec3(.5,.48,.43);
    vec3 hide=mix(coat,vec3(.05,.04,.032),max(legs*(1.-body),(1.-smoothstep(.36,.44,q.y))*.6));
    hide=mix(hide,pale*mix(.62,1.,bull),smoothstep(.2,.42,q.x)*(1.-smoothstep(.74,.8,q.x))*step(.4,q.y)*(1.-vLod*.6));
    hide=mix(hide,pale*.9,(1.-smoothstep(-.66,-.56,q.x))*step(.44,q.y)*(1.-vLod)*.85);
    hide=mix(hide,vec3(.34,.27,.19),ant*(1.-max(body,max(neck,head)))*(1.-vLod));
    hide=mix(hide,vec3(.82,.8,.74),sheep);
    col=hide*(uSunCol*(.14+.3*smoothstep(.3,.75,q.y))*vSun+uSkyCol*.66+uHorizCol*.08);
  } else {
    float e=1.-abs(vUv.x*2.);
    // close to, the shadow has legs: four thin strokes from the hooves, then the body
    float stripe=1.-smoothstep(.06,.13,abs(abs(vUv.x*2.+.18)-.39));
    float shp=mix(smoothstep(0.,.6,e),stripe,(1.-smoothstep(.26,.36,vUv.y))*(1.-vLod)*step(vKind,3.5));
    alpha=shp*(1.-smoothstep(.55,1.,vUv.y))*(.28+.55*vSun)*(vKind>1.5&&vKind<2.5?.5:1.);
    col=uSkyCol*.12;
  }
  if(alpha<.01) discard;
  ${Ae}
}`,ms=`
${te}
attribute float aW; attribute vec4 aA; attribute vec4 aB; attribute vec4 aO;
uniform float uPx; uniform float uEvent; uniform float uProg; uniform vec2 uRev;
varying float vTip; varying float vLit; varying float vVis; varying float vUnder;
${ze}
void main(){
  float key=step(1.5,aO.w), rest=step(.5,aO.w)*(1.-key), strm=step(3.5,aO.w), key3=step(2.5,aO.w)*(1.-strm);
  float sk=mix((uProg-aA.w)/max(aB.w,1e-3),(uProg-uRev.x)/max(uRev.y,1e-3),key3);   // the last skein is keyed to the reveal over the saddle
  float s=mix(fract(uTime/aB.w+aA.w),clamp(sk+uTime*.0004,0.,1.),key);   // keyed skeins cross as the camera comes
  float q=mix(clamp(s*1.25-aO.y,0.,1.),clamp(uEvent*2.4-aO.y,0.,.93),rest);
  // a stream: chevron after chevron flies the route on the world's clock, for as long as the flight is in its window
  // (a.w = where the window opens in the finale's share, b.w = how long it is), so that whenever the camera hangs
  // over the fork there are birds on the wing in front of it, and they are moving
  float qs=fract(uTime*15./max(length(aB.xyz-aA.xyz),1.)-aO.y);
  q=mix(q,qs,strm);
  float air=max(smoothstep(0.,.03,q),key);
  vVis=mix(smoothstep(0.,.02,mix(s,q,key))*(1.-smoothstep(.92,1.,q)),1.,rest);
  vVis=mix(vVis,smoothstep(0.,.05,qs)*(1.-smoothstep(.9,1.,qs))*smoothstep(aA.w,aA.w+.02,uProg)*(1.-smoothstep(aA.w+aB.w-.03,aA.w+aB.w,uProg)),strm);
  vec3 c=mix(aA.xyz,aB.xyz,q);
  c.y=mix(aA.y,aB.y,mix(smoothstep(0.,.8,q),q,key))+sin(q*23.+aO.z*6.3)*1.2*air;
  vec2 d=aB.xz-aA.xz; d/=max(length(d),1e-3); vec2 pr=vec2(-d.y,d.x);
  vec2 gs=(vec2(fract(aO.z*13.7),fract(aO.z*7.3))-.5)*mix(16.,6.,rest);
  c.xz+=pr*aO.x*air+gs*(1.-air)+pr*sin(q*9.+aA.w*40.)*6.*air*(1.-key);
  vec4 mc=modelViewMatrix*vec4(c,1.);
  float dist=max(-mc.z,.1), S=max(length(modelMatrix[0].xyz),1e-5);
  float k=max(.3,dist*uPx*(mix(3.4,16.,key)+5.*strm)/S)*vVis;
  float flap=sin(uTime*(17.+5.*fract(aO.z*3.1))+aO.z*6.283)*air;
  vec3 v=position; v.x*=mix(.3,1.,air); v.y+=abs(v.x)*(flap*.85+.12)-aW*aW*flap*.12;
  vec3 p=c+(vec3(pr.x,0.,pr.y)*v.x+vec3(0.,1.,0.)*v.y-vec3(d.x,0.,d.y)*v.z)*k;
  vTip=aW; vLit=.5+.5*flap;
  // a skein that flies high (its route starts above 160 m) is seen from below once the camera is under it: grey
  // against the cloud, not white on white
  vUnder=step(160.,aA.y)*smoothstep(4.,40.,c.y-uCamL.y);
  vec4 mvPosition=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mvPosition;
  vVis*=cloudShadow(c.xz)*.6+.4;
  #include <fog_vertex>
  vDepth=-mvPosition.z;
}`,ds=`
${Pe}
${te}
varying float vTip; varying float vLit; varying float vVis; varying float vUnder;
void main(){
  if(vVis<.02) discard;
  vec3 col=mix(vec3(.8),vec3(.03),smoothstep(.74,.84,vTip))*(uSunCol*(.45+.75*vLit)*vVis+uSkyCol*1.8)*mix(1.,.2,vUnder);
  float alpha=1.;
  ${Ae}
}`,ps=`
${te}
attribute vec2 corner; attribute vec4 aS; attribute vec4 aT;
varying vec2 vUv; varying float vFade; varying float vSeed; varying float vA;
${ze}
void main(){
  float s=fract(uTime*aT.y/aT.x+aT.z), e=abs(s-.5)*2.;
  // (aT.z of 1 and over marks the shreds that cross the bastion's face: thicker than those in the notch)
  vA=mix(.34,.52,step(1.,aT.z));
  vec3 c=aS.xyz+vec3((s-.5)*aT.x,mix(-e*e*abs(aT.x)*.09,s*abs(aT.x)*.12,aT.w)+sin(s*9.+aT.z*30.)*2.,(s-.5)*aT.x*.18);
  vec4 mvPosition=modelViewMatrix*vec4(c,1.);
  float S=max(length(modelMatrix[0].xyz),1e-5), sz=aS.w*S*mix(.7+.6*s,.35+1.3*s,aT.w);
  mvPosition.xy+=corner*sz*vec2(1.9,.85);
  float dist=max(-mvPosition.z,.1);
  vFade=mix(sin(3.1416*s),smoothstep(0.,.08,s)*(1.-s)*(1.-s)*1.6,aT.w)*smoothstep(9.*S,42.*S,dist);
  vUv=corner; vSeed=aT.z;
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
  vDepth=-mvPosition.z;
}`,us=`
${Pe}
${te}
varying vec2 vUv; varying float vFade; varying float vSeed; varying float vA;
void main(){
  vec2 q=vUv*2.; float r=1.-clamp(dot(q,q),0.,1.);
  float thick=smoothstep(.4,.7,vA);
  float n=fbm(vUv*vec2(2.4,6.5)+vSeed*37.+vec2(-uTime*.11,uTime*.03));
  n=mix(n,n*.56+.3*fbm(vUv*vec2(7.,17.)+vSeed*11.+vec2(-uTime*.2,uTime*.05))+.15*vn(vUv*vec2(19.,46.)+vSeed*5.+vec2(-uTime*.33,0.)),smoothstep(.34,.5,vA));
  // (a thin shred is a soft wisp; a thick one has a ragged edge and a body)
  float rp=smoothstep(0.,.55,r);
  float alpha=mix(smoothstep(.34,.95,n*(.35+r))*r*r,smoothstep(.4,.6,n*(.5+.85*rp))*rp,step(.45,vA))*vFade*vA;
  if(alpha<.01) discard;
  vec3 col=uSkyCol*1.8+uSunCol*(.2+.14*(.5-vUv.x)+.18*n);
  // (a thick shred has a body: lit along its top, slate under it, so that it reads against a bright sky and a pale wall)
  col=mix(col,mix(uSkyCol*1.05,uSkyCol*1.5+uSunCol*.3,smoothstep(-.3,.3,vUv.y*2.+(n-.5)*1.2)),smoothstep(.34,.5,vA));
  ${Ae}
}`;function vs(){const s=[],et=[],L=[],kt=[],Nt=(M,d,P)=>[M[0]+d[0]*P,M[1]+d[1]*P,M[2]+d[2]*P],zt=M=>{const d=Math.hypot(M[0],M[1],M[2])||1;return[M[0]/d,M[1]/d,M[2]/d]},pt=(M,d)=>[M[1]*d[2]-M[2]*d[1],M[2]*d[0]-M[0]*d[2],M[0]*d[1]-M[1]*d[0]],E=(M,d,P=0,U=1)=>{const Z=[];for(let A=0;A<M.length;A++){const j=M[Math.max(0,A-1)],ht=M[Math.min(M.length-1,A+1)],W=zt([ht[0]-j[0],ht[1]-j[1],ht[2]-j[2]]),n=Math.abs(W[1])>.8?[0,0,1]:[0,1,0],p=zt(pt(n,W)),$=pt(W,p),b=M[A],V=s.length/3;for(let ut=0;ut<d;ut++){const K=ut/d*6.2832,Q=Math.cos(K),Y=Math.sin(K),C=Nt(Nt(b,p,Q*b[3]),$,Y*b[4]),N=U<1&&C[1]<b[1]-b[4]*.3?U:1;s.push(C[0],C[1],C[2]),et.push(b[5][0]*N,b[5][1]*N,b[5][2]*N),L.push(P,b[6]??0)}Z.push(V)}for(let A=0;A<Z.length-1;A++)for(let j=0;j<d;j++){const ht=Z[A]+j,W=Z[A]+(j+1)%d,n=Z[A+1]+j,p=Z[A+1]+(j+1)%d;kt.push(ht,W,n,W,p,n)}for(const A of[0,Z.length-1]){const j=M[A],ht=s.length/3;s.push(j[0],j[1],j[2]),et.push(j[5][0],j[5][1],j[5][2]),L.push(P,j[6]??0);for(let W=0;W<d;W++){const n=Z[A]+W,p=Z[A]+(W+1)%d;A?kt.push(n,p,ht):kt.push(p,n,ht)}}},O=[.105,.072,.048],nt=[.05,.038,.03],k=[.56,.54,.49],R=[.36,.33,.28],at=[.4,.32,.22],w=[.03,.025,.02];E([[0,1.04,.95,.05,.09,k],[0,1.02,.84,.19,.25,k],[0,.99,.6,.255,.3,O],[0,.96,.1,.27,.3,O],[0,.97,-.38,.27,.34,O],[0,1.02,-.72,.2,.29,R],[0,1.07,-.88,.12,.2,k]],8,0,.62),E([[0,1.1,-.78,.13,.19,k,0],[0,1.27,-1.03,.1,.17,k,.4],[0,1.45,-1.24,.085,.11,R,.7]],6,5),E([[0,.98,-.8,.09,.15,k,0],[0,1.08,-1.02,.065,.17,k,.4],[0,1.27,-1.2,.04,.08,k,.7]],5,5),E([[0,1.47,-1.2,.09,.1,O,.75],[0,1.47,-1.4,.075,.085,O,.85],[0,1.42,-1.6,.05,.055,nt,.95],[0,1.39,-1.7,.04,.042,w,1]],6,5);let I=0;for(const M of[-.5,.62])for(const d of[-1,1]){const P=d*.15,U=M<0?-.04:.1;I++,E([[P,.9,M,.085,.13,O,0],[P,.52,M+U,.048,.06,nt,.45],[P,.13,M,.034,.036,nt,.86],[P,0,M-.03,.05,.055,w,1]],5,I)}for(const M of[-1,1]){const d=(P,U,Z)=>E(P.map((A,j)=>{const ht=j/(P.length-1),W=st(U,Z,ht);return[M*A[0],A[1],A[2],W,W,at,.8]}),4,5);d([[.07,1.54,-1.24],[.19,1.74,-1.08],[.3,1.95,-1.03],[.35,2.12,-1.14],[.34,2.24,-1.33]],.04,.026),d([[.07,1.56,-1.27],[.07,1.62,-1.5],[.05,1.72,-1.62]],.024,.014),d([[.16,1.7,-1.1],[.24,1.74,-1.32],[.27,1.84,-1.42]],.022,.013),d([[.3,1.95,-1.03],[.35,2.02,-.85]],.02,.012),d([[.34,2.24,-1.33],[.28,2.36,-1.46]],.02,.012),d([[.35,2.12,-1.14],[.47,2.22,-1.26]],.02,.012)}const D=new l.BufferGeometry;return D.setAttribute("position",new l.Float32BufferAttribute(s,3)),D.setAttribute("color",new l.Float32BufferAttribute(et,3)),D.setAttribute("aPart",new l.Float32BufferAttribute(L,2)),D.setIndex(kt),D.computeVertexNormals(),D}const ws=`
${te}
attribute vec3 color; attribute vec2 aPart; attribute vec4 iPos; attribute vec4 iRot; attribute float iUp;
uniform float uNearT;
varying vec3 vP; varying vec3 vN; varying vec3 vCol; varying float vH;
${ze}
vec2 rot2(vec2 q,float a){ float c=cos(a), s=sin(a); return vec2(c*q.x-s*q.y,s*q.x+c*q.y); }
void main(){
  vec3 p=position, n=normal;
  float walk=step(.001,iPos.w), ph=iRot.z*6.2832, went=uNearT*iPos.w;
  // the stride is tied to the ground covered (a hoof on the ground stays where it is): two steps every 1.05 body-metres
  float cyc=went/(1.05*iPos.z)*6.2832+ph;
  if(aPart.x>.5&&aPart.x<4.5){
    float diag=(aPart.x<1.5||aPart.x>3.5)?0.:3.1416, th=.3*sin(cyc+diag)*walk*smoothstep(0.,.2,aPart.y);
    vec3 pv=vec3(p.x,.9,aPart.x<2.5?-.5:.62);
    vec2 q=rot2(p.yz-pv.yz,th); p.yz=pv.yz+q; n.yz=rot2(n.yz,th);
    // the swinging leg folds at the knee and clears the ground
    p.y+=max(cos(cyc+diag),0.)*.09*walk*aPart.y;
  } else if(aPart.x>4.5){
    // grazing: the neck goes down to the ground and the head works from side to side; walking, the head is carried low and nods
    float gz=mix(1.15+.07*sin(uTime*.9+ph*3.),.28+.05*sin(cyc*2.),walk)*smoothstep(-.1,.5,aPart.y+.2);
    vec3 pv=vec3(0.,1.08,-.8);
    vec2 q=rot2(p.yz-pv.yz,gz); p.yz=pv.yz+q; n.yz=rot2(n.yz,gz);
    p.x+=(1.-walk)*.1*sin(uTime*1.7+ph*5.)*aPart.y;
  }
  p.y+=.012*sin(cyc*2.)*walk;
  vec2 f=iRot.xy/max(length(iRot.xy),1e-4);
  vec3 R=vec3(-f.y,0.,f.x), F=vec3(f.x,0.,f.y);
  vec3 c=vec3(iPos.x+f.x*went,.02-iRot.w+iUp*went,iPos.y+f.y*went);
  vec3 wp=c+(R*p.x+vec3(0.,1.,0.)*p.y-F*p.z)*iPos.z;
  vP=wp; vH=p.y*iPos.z; vN=R*n.x+vec3(0.,1.,0.)*n.y-F*n.z; vCol=color*(.85+.3*fract(iRot.z*7.3));
  vec4 mvPosition=modelViewMatrix*vec4(wp,1.); gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
  vDepth=-mvPosition.z;
}`,gs=`
${Pe}
${te}
uniform float uRim;
varying vec3 vP; varying vec3 vN; varying vec3 vCol; varying float vH;
void main(){
  vec3 N=vN/max(length(vN),1e-4); vec3 toC=uCamL-vP; vec3 V=toC/max(length(toC),1e-3);
  float cs=cloudShadow(vP.xz), ndl=max(dot(N,uSunL)*.72+.28,0.);
  float hair=.86+.28*vn(vP.xz*9.+vP.y*13.);
  vec3 col=vCol*hair*(uSunCol*ndl*cs*.4+uSkyCol*(.5+.32*N.y)+uHorizCol*.1*(1.-N.y));
  float rim=1.-max(dot(N,V),0.); rim*=rim*rim;
  col+=(uSunCol*.16*cs*max(dot(-V,uSunL)*.5+.5,0.)+uSkyCol*.2)*rim*(.4+vCol.r*2.);       // the low sun in the hair along its back
  // (uRim: the low sun rims the side of the animal that is turned to it, warm, where that side is seen edge on)
  float rl=(1.-max(dot(N,V),0.)); rl*=rl*rl*max(dot(N,uSunL)+.15,0.);
  col+=uSunCol*(vec3(.05,.04,.03)+vCol*1.5)*rl*uRim*cs;
#ifdef BENCH
  // (on the pale heath of the bench the coat is a tone deeper, so the animal stands off its ground)
  col*=(smoothstep(-.05,.5,vH)*.5+.5)*mix(.52,.9,smoothstep(.15,.4,vCol.r));
#else
  col*=smoothstep(-.05,.5,vP.y)*.45+.55;                                                // darker toward the ground it stands on
#endif
  float alpha=1.;
  ${Ae}
}`,xs=`
${te}
attribute vec3 color; attribute vec2 aPart; attribute vec4 iPos; attribute vec4 iRot;
uniform float uNearT;
varying vec3 vP; varying vec3 vCol; varying float vY;
${ze}
vec2 rot2(vec2 q,float a){ float c=cos(a), s=sin(a); return vec2(c*q.x-s*q.y,s*q.x+c*q.y); }
void main(){
  vec3 p=position;
  float walk=step(.001,iPos.w), ph=iRot.z*6.2832, went=uNearT*iPos.w;
  float cyc=went/(1.05*iPos.z)*6.2832+ph;
  if(aPart.x>.5&&aPart.x<4.5){
    float diag=(aPart.x<1.5||aPart.x>3.5)?0.:3.1416, th=.3*sin(cyc+diag)*walk*smoothstep(0.,.2,aPart.y);
    vec3 pv=vec3(p.x,.9,aPart.x<2.5?-.5:.62);
    vec2 q=rot2(p.yz-pv.yz,th); p.yz=pv.yz+q;
    p.y+=max(cos(cyc+diag),0.)*.09*walk*aPart.y;
  } else if(aPart.x>4.5){
    float gz=mix(1.15+.07*sin(uTime*.9+ph*3.),.28+.05*sin(cyc*2.),walk)*smoothstep(-.1,.5,aPart.y+.2);
    vec3 pv=vec3(0.,1.08,-.8);
    vec2 q=rot2(p.yz-pv.yz,gz); p.yz=pv.yz+q;
    p.x+=(1.-walk)*.1*sin(uTime*1.7+ph*5.)*aPart.y;
  }
  vec2 f=iRot.xy/max(length(iRot.xy),1e-4);
  vec3 R=vec3(-f.y,0.,f.x), F=vec3(f.x,0.,f.y);
  vec3 c=vec3(iPos.x+f.x*went,.02-iRot.w,iPos.y+f.y*went);
  vec3 wp=c+(R*p.x+vec3(0.,1.,0.)*p.y-F*p.z)*iPos.z;
  vY=wp.y;
  float h=max(wp.y,0.);
  vec3 cam=uCamL; float k=cam.y/max(cam.y+h,.5);
  vec3 q3=vec3(mix(cam.x,wp.x,k),.04,mix(cam.z,wp.z,k));
  // the ripples carry the image about, the more the further it lies from the animal's feet
  q3.xz+=vec2(sin(q3.z*3.1+uTime*2.3)+.6*sin(q3.z*7.7-uTime*3.1),sin(q3.x*2.7-uTime*1.9))*.05*h;
  vP=q3; vCol=color*(.85+.3*fract(iRot.z*7.3));
  vec4 mvPosition=modelViewMatrix*vec4(q3,1.); gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
  vDepth=-mvPosition.z;
}`,ys=`
${Pe}
${te}
uniform sampler2D uMap;
varying vec3 vP; varying vec3 vCol; varying float vY;
void main(){
  if(vY<.0) discard;
  vec2 p=vP.xz;
  vec2 muv=vec2((p.x-(${Tt.x0}.))/${Tt.x1-Tt.x0}.,(p.y-(${Tt.z0}.))/${Tt.z1-Tt.z0}.);
  float wr=texture2D(uMap,muv).r+(vn(p*.045+2.)-.5)*.45+(vn(p*.09)-.5)*.2;
  float wat=smoothstep(.66,.8,wr);
  float brk=.72+.28*sin(p.y*9.+p.x*2.3+uTime*3.4+2.*vn(p*1.7));
  float alpha=wat*brk*.66*(1.-.45*smoothstep(.6,3.2,vY))*(1.-smoothstep(120.,220.,vDepth));
  if(alpha<.02) discard;
  vec3 col=vCol*(uSkyCol*.8+uHorizCol*.12+uSunCol*.1*cloudShadow(p));
  ${Ae}
}`,bs=`
${te}
attribute vec2 aT; attribute vec3 aOff; attribute vec4 iPos; attribute vec4 iCol;
varying vec3 vP; varying vec3 vCol; varying float vT;
${ze}
void main(){
  float kind=iCol.w, cot=step(.5,kind)*step(kind,1.5), t=aT.x;
  vec3 p=position; p.xz*=iPos.w; p.y*=iPos.z;
  p+=aOff*cot*(.5+.5*iPos.z);
  p.xz+=vec2(sin(uTime*1.6+iPos.x*.7+p.y*2.),cos(uTime*1.3+iPos.y*.6+p.y*1.4))*.05*t*t*iPos.z;
  vec3 wp=vec3(iPos.x,0.,iPos.y)+p;
  vP=wp; vT=t;
  vCol=mix(iCol.rgb*(.4+.85*t),vec3(.62,.61,.57),aT.y*cot);
  vec4 mvPosition=modelViewMatrix*vec4(wp,1.); gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
  vDepth=-mvPosition.z;
}`,Ms=`
${Pe}
${te}
varying vec3 vP; varying vec3 vCol; varying float vT;
void main(){
  vec3 toC=uCamL-vP; vec3 V=toC/max(length(toC),1e-3);
  float cs=cloudShadow(vP.xz), back=max(dot(-V,uSunL),0.); back*=back;
  // blades are thin: the low sun shines through them from behind and lights their tips from the side
  vec3 col=vCol*(uSunCol*(.3+.5*back+.25*vT)*cs+uSkyCol*.8+uHorizCol*.14);
  float alpha=1.;
  ${Ae}
}`,ks=`
${te}
attribute vec4 iPos; attribute vec4 iCol;
varying vec3 vP; varying vec3 vN; varying vec3 vCol; varying vec3 vL;
${ze}
void main(){
  float a=iCol.w*6.2832, ca=cos(a), sa=sin(a);
  vec3 p=position, n=normal;
  p.xz=vec2(ca*p.x-sa*p.z,sa*p.x+ca*p.z); n.xz=vec2(ca*n.x-sa*n.z,sa*n.x+ca*n.z);
  vL=vec3(p.x,p.y,p.z);
  p.xz*=iPos.w; p.y*=iPos.z;
  p.xz+=vec2(sin(uTime*1.2+iPos.x),cos(uTime*.9+iPos.y))*.03*p.y;
  vec3 wp=vec3(iPos.x,0.,iPos.y)+p;
  vP=wp; vN=vec3(n.x*iPos.z,n.y*iPos.w,n.z*iPos.z); vCol=iCol.rgb;
  vec4 mvPosition=modelViewMatrix*vec4(wp,1.); gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
  vDepth=-mvPosition.z;
}`,zs=`
${Pe}
${te}
varying vec3 vP; varying vec3 vN; varying vec3 vCol; varying vec3 vL;
void main(){
  vec3 N=vN/max(length(vN),1e-4); vec3 toC=uCamL-vP; vec3 V=toC/max(length(toC),1e-3);
  float cs=cloudShadow(vP.xz), ndl=max(dot(N,uSunL)*.7+.3,0.);
  // leaves: sprays of them catch the light, the gaps between show the dark of the twigs inside
  vec2 q=vP.xz*5.+vP.y*vec2(3.1,-2.3);
  float lf=vn(q)*.6+vn(q*2.7+7.)*.4, spray=smoothstep(.3,.62,lf);
  float tone=vn(vP.xz*.9+vCol.r*40.);
  vec3 leaf=mix(vCol,mix(uPal[2]*.5,uPal[1]*.5,step(.5,fract(vCol.g*37.))),smoothstep(.45,.75,tone)*.6)*(.6+.8*vn(q*1.9+3.));
  vec3 alb=mix(vec3(.03,.028,.022),leaf,spray);
  float low=smoothstep(.0,.55,vL.y);
  vec3 col=alb*(uSunCol*ndl*cs*(.3+.35*low)+uSkyCol*(.45+.35*N.y)*(.45+.55*low)+uHorizCol*.1);
  float rim=1.-max(dot(N,V),0.); rim*=rim;
  col+=leaf*uSunCol*.3*cs*rim*max(dot(-V,uSunL)*.5+.5,0.)*spray;
  float alpha=1.;
  ${Ae}
}`,Ps=`
${te}
uniform sampler2D uShade;
attribute vec4 aD; varying vec2 vM; varying vec2 vR; varying float vLit;
${ze}
void main(){
  vec3 P=(instanceMatrix*vec4(0.,0.,0.,1.)).xyz-normalize(instanceMatrix[0].xyz)*aD.y*.5;       // the block's own place
  vM=vec2(position.x*aD.z+aD.y*.5,position.z*aD.w); vR=aD.xy;
  vLit=texture2D(uShade,${ro}).r*cloudShadow(P.xz);
  vec4 mvPosition=modelViewMatrix*(instanceMatrix*vec4(position,1.)); gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
  vDepth=-mvPosition.z;
}`,As=`
${Pe}
${te}
varying vec2 vM; varying vec2 vR; varying float vLit;
void main(){
  float r=vR.x, tail=vR.y;
  float foot=1.-smoothstep(r*.85,r*1.45,length(vM));
  float shd=(1.-smoothstep(r*.45,r*.95,abs(vM.y)))*smoothstep(-r*.4,r*.2,vM.x)*(1.-smoothstep(tail*.4+r*.5,tail+r*.9,vM.x));
  float alpha=max(foot*.5,shd*.5*vLit)*(1.-smoothstep(240.,480.,vDepth));
  if(alpha<.012) discard;
  vec3 col=uSkyCol*.09;
  ${Ae}
}`,Cs=`
${te}
attribute vec4 aB0; attribute vec4 aB1; varying vec2 vUv; varying float vPh;
${ze}
void main(){
  float u=uv.x, v=uv.y-.5;
  vec3 W=aB1.xyz/max(length(aB1.xyz),1e-4);
  vec3 c=aB0.xyz+W*(u*aB0.w);
  c.y+=sin(u*5.-uTime*.9+aB1.w*6.)*1.8*u+sin(u*11.-uTime*1.7+aB1.w*17.)*.8*u+u*u*aB0.w*.06;
  c.z+=sin(u*3.3-uTime*.6+aB1.w*9.)*2.6*u;
  vec3 side=cross(W,uCamL-c); side/=max(length(side),1e-4); if(side.y<0.) side=-side;
  vec3 p=c+side*v*mix(5.,aB0.w*.3,smoothstep(0.,.55,u));
  vUv=vec2(u,v*2.); vPh=aB1.w;
  vec4 mvPosition=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
  vDepth=-mvPosition.z;
}`,Ss=`
${Pe}
${te}
varying vec2 vUv; varying float vPh;
void main(){
  float u=vUv.x, v=vUv.y;
  float n=fbm(vec2(u*3.2-uTime*.5,v*1.3+vPh*7.))*.65+fbm(vec2(u*9.-uTime*.95,v*3.4+vPh*3.))*.35;
  // (it hangs on the summit: densest over the first third, where it is a body of cloud, and torn to wisps beyond)
  float edge=1.-smoothstep(.25,1.,abs(v+(n-.5)*.9));                      // (its edges are torn by its own cloud, never ruled)
  float body=edge*smoothstep(0.,.025,u)*pow(max(1.-u,0.),.9)*(1.+.45*(1.-smoothstep(.05,.4,u)));
  float alpha=smoothstep(.36,.62,n*(.5+1.05*body))*min(1.,body*2.)*.92*smoothstep(6.,30.,vDepth);
  if(alpha<.012) discard;
  // lit cream along its top, slate under it: so it reads against a bright sky and against a pale tower alike
  float topK=smoothstep(-.6,.35,v+(n-.5)*1.2);
  vec3 col=mix(uSkyCol*vec3(.5,.54,.62),uSkyCol*1.7+uSunCol*.42,topK)*(.82+.36*n);
  ${Ae}
}`,Ro={evening:{sun:[-.939,.156,-.305],sunCol:"#F4DDB8",sunI:2.7,sky:"#7f93b2",skyI:.8,horiz:1.55,cover:.6,mist:0,aurora:0,snow:0},dawn:{sun:[.96,.12,-.25],sunCol:"#ffd3bd",sunI:2.3,sky:"#8f9fc0",skyI:.8,horiz:1.4,cover:.42,mist:1,aurora:0,snow:.25},overcast:{sun:[-.925,.191,-.327],sunCol:"#ffc083",sunI:3.1,sky:"#94859c",skyI:.9,horiz:1.7,horizCol:"#ffb469",cover:.5,mist:0,aurora:0,snow:.1},night:{sun:[-.6,.5,-.35],sunCol:"#a9bcff",sunI:.95,sky:"#2c3d6c",skyI:.8,horiz:.2,cover:.45,mist:0,aurora:1,snow:0}};async function Bs(s,et={}){const L=s.rng.fork("branching-hero"),kt=s.noise,Nt=s.quality?.detail??1,zt=(et.palette&&et.palette.length>=7?et.palette:Jo).map(t=>new l.Color(t)),pt=Ro[et.hour]||Ro.evening,E=et.season||"peak",O=Rt(et.density??L.range(.3,1),0,1),nt=et.rareEvent??L.chance(1/8),k=new l.Vector3().fromArray(et.sunDir||pt.sun).normalize(),R={ph:L()*6.283,notch:L.range(50,70),gorgeX:-L.range(300,380)},at=L.chance(.5),w=new l.Group;w.name="the-branching-hero";const I={uTime:{value:0},uSunL:{value:k.clone()},uSunCol:{value:new l.Color(pt.sunCol).multiplyScalar(pt.sunI)},uSkyCol:{value:new l.Color(pt.sky).multiplyScalar(pt.skyI)},uHorizCol:{value:(pt.horizCol?new l.Color(pt.horizCol):new l.Color("#F4DDB8").lerp(zt[6],.5)).multiplyScalar(pt.horiz)},uCamL:{value:new l.Vector3(0,200,300)},uCloud:{value:new l.Vector4(16,2.7,L.range(.0016,.0024),pt.cover+L.range(-.04,.04))},uPal:{value:zt},uHazeCol:{value:(pt.horizCol?new l.Color(pt.horizCol).lerp(zt[6],.35):new l.Color("#F4DDB8").lerp(zt[6],.5)).multiplyScalar(.55*Math.min(pt.horiz,1.2))},uHaze:{value:13e-5},uSnow:{value:Math.max(pt.snow,E==="late"?.6:0)},uGreen:{value:E==="august"?.75:0},uAurora:{value:pt.aurora},uMist:{value:pt.mist},uGap:{value:new l.Vector3(0,0,0)},uHole:{value:new l.Vector4(0,0,0,0)},uFadeD:{value:1}},D=(t,e,a={},o={})=>new l.ShaderMaterial({uniforms:Object.assign(l.UniformsUtils.clone(l.UniformsLib.fog),I,a),vertexShader:t,fragmentShader:e,fog:!0,...o}),M=ts(et.graphSeed!=null?Be(et.graphSeed):L.fork("graph"),{orders:4,ratio:L.range(.7,.78),angle:L.range(.4,.5),jitter:.25}),d=es(M,L.fork("delta"),kt,R.gorgeX);await s.yield();const{cv:P,steps:U}=as(d.chans);for(const t of U)t(),await s.yield();const Z=new l.CanvasTexture(P);Z.flipY=!1,Z.colorSpace=l.NoColorSpace,Z.generateMipmaps=!0,Z.minFilter=l.LinearMipmapLinearFilter,Z.magFilter=l.LinearFilter,Z.anisotropy=8,await s.yield();const A=os(kt,R),j=A.H;await s.yield();const{geo:ht,splat:W,hAt:n,aoAt:p,noseGeo:$,conAttrs:b}=await ss(s,j,A.gullyOf);await s.yield();const ut={value:await ns(s,n,k)};await s.yield();const K={value:await rs(s,n,k)},Q=new l.Mesh(ht,D(To,Lo,{uShade:ut,uShadeN:K,uBare:{value:0}}));Q.name="ridge",w.add(Q);const Y=new l.Mesh($,Q.material);Y.name="nose",w.add(Y),await s.yield();const C={value:Array.from({length:10},()=>new l.Vector4)},N=new l.PlaneGeometry(11e3,11e3,40,40);N.rotateX(-Math.PI/2),N.translate(0,0,-1500);const F=new l.Mesh(N,D(is,ls,{uMap:{value:Z},uShade:ut,uWake:C}));F.name="plain",F.renderOrder=-.5,w.add(F);const J=14*Math.PI/180,wt=new l.Vector3(0,j(0,0)+aa+1.4,0),ft=96,Bt=new l.Vector3(0,wt.y-ft*Math.sin(J),-ft*Math.cos(J)),Vt=(t,e,a)=>{let o=-1e9;for(let c=-a;c<=a;c+=a)for(let h=-a;h<=a;h+=a)o=Math.max(o,j(t+c,e+h));return o},Dt=Math.max(Vt(-12,300,10),Vt(-9,322,8))+12,mt=[],yt={},f=d.chans.map(t=>{let e=1e9,a=-1e9,o=1e9,c=-1e9;for(const h of t.pts)e=Math.min(e,h[0]),a=Math.max(a,h[0]),o=Math.min(o,h[1]),c=Math.max(c,h[1]);return[e,a,o,c]}),i=(t,e,a=70)=>{let o=a;for(let c=0;c<d.chans.length;c++){const h=d.chans[c],u=f[c],r=a+h.w;if(t<u[0]-r||t>u[1]+r||e<u[2]-r||e>u[3]+r)continue;const x=h.pts;let v=1e18;for(let g=1;g<x.length;g++){const T=x[g-1],S=x[g],q=S[0]-T[0],B=S[1]-T[1],X=Rt(((t-T[0])*q+(e-T[1])*B)/Math.max(q*q+B*B,1e-6),0,1),vt=t-T[0]-q*X,jt=e-T[1]-B*X;v=Math.min(v,vt*vt+jt*jt)}o=Math.min(o,Math.sqrt(v)-h.w*.5)}return o};let m=null,z=40;{const t=d.byNode[0].pts,e=t.length-1,a=t[e],o=_=>{const ct=Rt(_,0,1)*e,bt=Math.min(e-1,Math.floor(ct)),Ot=ct-bt;return[st(t[bt][0],t[bt+1][0],Ot),st(t[bt][1],t[bt+1][1],Ot)]};z=d.byNode[0].w,m=(_,ct)=>{const bt=o(_-.05),Ot=o(_+.05),fe=Math.hypot(Ot[0]-bt[0],Ot[1]-bt[1])||1,xe=o(_);let ue=-(Ot[1]-bt[1])/fe,Se=(Ot[0]-bt[0])/fe;return ue<0&&(ue=-ue,Se=-Se),[xe[0]+ue*ct,xe[1]+Se*ct,(Ot[0]-bt[0])/fe,(Ot[1]-bt[1])/fe]};const c=Dt+17,h=9.5,u=_=>st(c,40,1-Math.pow(1-_,1.7)),r=(_,ct,bt,Ot=13)=>(mt.push(new l.Vector3(_,Math.max(bt,Vt(_,ct,8)+Ot),ct)),mt.length-1);r(-8,324,Dt+9,10),r(-10,300,c,10),r(-28,262,c-2,10),r(-66,205,u(.09)),r(-102,130,u(.24)),r(-122,45,u(.43)),r(-128,-45,u(.63)),r(-116,-125,u(.83)),yt.root=r(ae[0]-6,ae[1]+15,40),await s.yield();const x=m(.3,z*.5+13);let v=[a[0],a[1]],g=-1e9;for(let _=16;_<=70;_+=6)for(let ct=-24;ct<=40;ct+=6){const bt=a[0]+_,Ot=a[1]+ct,fe=Math.min(i(bt,Ot,14),i(bt-7,Ot,14),i(bt+7,Ot,14),i(bt,Ot-7,14),i(bt,Ot+7,14)),xe=Math.min(fe,6)*3-Math.hypot(_-36,ct-6)*.25;fe>1.5&&xe>g&&(g=xe,v=[bt,Ot])}await s.yield(),r(x[0],x[1],20),r(st(x[0],v[0],.55),st(x[1],v[1],.55),h+1,8),yt.fork=r(v[0],v[1],h,8),yt.bar=v,I.uGap.value.set(v[0]-25,v[1]-20,190);for(const[_,ct,bt]of[[-14,-50,11],[-60,-88,14],[-118,-78,19]])r(a[0]+_,a[1]+ct,bt,9);yt.turn=mt.length-1,r(a[0]-148,a[1]-22,23,9);const T=[a[0]-128,a[1]+26],S=27,q=120,B=Bt.z;yt.climb=r(T[0],T[1],S);const X=_=>[-q*(1-Math.cos(_)),B-q*Math.sin(_)];let vt=.25,jt=1.5;for(let _=0;_<30;_++){const ct=(vt+jt)/2,bt=X(ct);(bt[0]-T[0])*Math.cos(ct)-(bt[1]-T[1])*Math.sin(ct)>0?vt=ct:jt=ct}const Ut=(vt+jt)/2,Et=X(Ut),Lt=Math.hypot(Et[0]-T[0],Et[1]-T[1]),Pt=Lt+q*Ut,rt=_=>st(S,Bt.y,Math.pow(_/Pt,.8));for(const _ of[.34,.68])r(st(T[0],Et[0],_),st(T[1],Et[1],_),rt(Lt*_),22);for(const _ of[1,.66,.33]){const ct=X(Ut*_);r(ct[0],ct[1],rt(Lt+q*Ut*(1-_)),22)}yt.trunk=t.map(_=>[_[0],_[1]]),yt.forkAt=[a[0],a[1]]}const H=yt.root;await s.yield(),mt.push(Bt,wt.clone());const G=(t,e,a,o)=>{let c=1e9;for(let h=a;h<o;h++){const u=mt[h],r=mt[h+1],x=r.x-u.x,v=r.z-u.z,g=Rt(((t-u.x)*x+(e-u.z)*v)/(x*x+v*v),0,1);c=Math.min(c,Math.hypot(t-u.x-x*g,e-u.z-v*g))}return c},lt=(t,e)=>G(t,e,0,mt.length-1),dt=(t,e)=>G(t,e,1,H),ot=D(To,Lo,{uShade:ut,uShadeN:K,uBare:{value:1}}),tt=k.x<0?1:-1,gt=Math.hypot(k.x,k.z)||1,St=-k.x/gt,Kt=-k.z/gt,Xt=Math.max(k.y,.05)/gt,oe=Rt(1/Math.max(Xt,.15),.8,5),Te=(t,e,a,o,c)=>{W(t,e,a*1.5+1.2,c);const h=(n(t+St*3,e+Kt*3)-n(t,e))/3,u=Math.min(o*oe,o/Math.max(Xt+h,.16)),r=Math.min(8,Math.floor(u/Math.max(a,1)));for(let x=1;x<=r;x++)W(t+St*x*a,e+Kt*x*a,a+1,c*.7*(1-x/(r+1)))};await s.yield();const Oa=at?[45,36]:[36,45],oa=[],Ha=[];for(let t=0;t<2;t++){const e=t===0?-pa:pa,a=n(e,0)-.8,o=io(L.fork("tower"+t),Oa[t],Oa[t]>40?7.6:6.8);o.translate(e,a,L.range(-1.5,1.5)),Ha.push(o),oa.push(new l.Vector3(e,a+Oa[t],0)),Te(e,0,6,9,.5),await s.yield()}const lo=new l.Mesh(Yo(Ha),ot);lo.name="towers",w.add(lo),Ha.forEach(t=>t.dispose()),await s.yield();const Do=L.fork("block"),jo=[0,1,2,3].map(t=>cs(Do,t)),Ua=[.36,.74,1.1,.62],Ft=L.fork("blocks"),ua=[],co=(t,e)=>Math.hypot(n(t+1.5,e)-n(t-1.5,e),n(t,e+1.5)-n(t,e-1.5)),Ce=(t,e,a,o=-1,c=0)=>{const h=dt(t,e)<75;if(!c&&lt(t,e)<42&&(a=Math.min(a,3.2)),!c&&h&&a<.9||!c&&co(t,e)>(a<2.6&&(o<0||a<1)?2.6:3.3))return;const u=Math.abs(t)<aa+1.5&&e>-34&&e<70;u&&(a=Math.min(a,e<15?.55:1.5));let r=a>1.6?Ft.chance(.45)?0:1:a>.7?[1,1,2,0,3][Ft.int(0,4)]:[3,3,3,1,2][Ft.int(0,4)];o>=0&&(r=o),u&&a>.8&&(r=0),h&&!u&&r!==1&&(r=a>1.3?1:3),ua.push([t,e,a,r,c])};for(let t=0;t<90;t++){const e=Ft()*6.283,a=Ft.range(6.5,12.5);Ce((t%2?pa:-pa)+Math.cos(e)*a,Math.sin(e)*a*1.3,.3+Math.pow(Ft(),2)*1.3)}for(let t=0;t<70;t++)Ce(Ft.gauss()*10,Ft.range(-22,66),Ft.range(.2,.6));for(let t=0;t<190;t++){const e=Ft.range(-18,335);Ce(A.spurX(e)+Ft.gauss()*(4+5*Ft()),e,Math.pow(Ft(),2.2)*2.1+.35)}await s.yield();for(let t=0;t<90;t++)Ce(Ft.range(-80,60),ea+Ft.gauss()*16,Math.pow(Ft(),2.2)*2.2+.4);await s.yield();{const t=Be(De("branching-nose:"+s.seed));for(let e=0;e<150;e++){const a=t.range(-2.3,1.3),o=Math.pow(t(),.7),c=46+o*110,h=.45+Math.pow(t(),2.2)*(1.2+2.2*o);Ce(Math.sin(a)*c,ge-Math.cos(a)*c,h,h>1.2?1:3),(e&31)===31&&await s.yield()}}await s.yield();for(let t=0;t<52;t++){const e=t>=43,a=e||Ft.chance(.7)?-1:1,o=e?Ft.range(180,292):Ft.range(8,300),c=e?Ft.range(-190,-60):A.spurX(o)+a*Ft.range(20,96),h=Ft.int(9,19),u=Ft.range(4,10);for(let r=0;r<h;r++){const x=r===0?Ft.range(.65,1):Math.pow(Ft(),2.8),v=Math.abs(Ft.gauss())*u*(r===0?.4:1.8);Ce(c+a*v,o+Ft.gauss()*u*.8,.3+x*3)}(t&7)===7&&await s.yield()}await s.yield();{const t=Be(De("branching-crags:"+s.seed));for(const e of[-1,1]){const a=[];for(let o=-6;o<=300;o+=3){const c=A.spurX(o)+e*27;a.push(n(c,o)-.5*(n(c,o-8)+n(c,o+8)))}await s.yield();for(let o=2;o<a.length-2;o++){const c=-6+o*3,h=a[o];if(h>1.4&&h>=a[o-1]&&h>=a[o+1]&&(e<0||t.chance(.5)))for(let u=12+t()*6;u<56;u+=t.range(9,16)){const r=A.spurX(c)+e*u,x=c+t.gauss()*2.2,v=t.int(1,3),g=dt(r,x)<75&&t.chance(.5);let T=t.range(4.2,7.4)*(u<20?.7:1);for(let S=0;S<v;S++){const q=r-e*S*T*.45+t.gauss()*.8,B=x+t.gauss()*T*.4,X=t.range(.45,.7);g||Ce(q,B,T,1,X),T*=t.range(.6,.8)}}else if(h<-1.4&&h<=a[o-1]&&h<=a[o+1]&&(e<0||t.chance(.4))){const u=t.int(12,18),r=t.range(40,68);for(let x=0;x<u;x++){const v=Math.pow(t(),.8),g=34+v*r,T=t.gauss()*(2.5+.2*v*r),S=Math.pow(t(),2.4),q=.45+S*(.9+1.2*v);Ce(A.spurX(c)+e*g,c+T+.12*g*(e<0?-1:.6),q)}}(o&15)===15&&await s.yield()}await s.yield()}for(let e=0;e<46;e++){const a=t.range(14,78),o=t.sign();Ce(o*t.range(aa+1.6,aa+9),a,t.range(1.2,2.3),t.chance(.7)?0:1)}for(let e=0;e<70;e++){const a=t.range(15,72);Ce(t.gauss()*5.4,a,.5+Math.pow(t(),1.6)*1,t.chance(.55)?0:1)}}await s.yield();{const t=Be(De("branching-stair:"+s.seed));for(let e=0;e<A.nSteps;e++){const a=8+t.int(0,4);for(let o=0;o<a;o++){const c=t.range(-10,10),h=A.stairFront(e,c),u=e+1<A.nSteps?A.stairFront(e+1,c):h+12,r=u-h-4.6,x=h+2.3+Math.pow(t(),1.8)*Math.max(r,0),v=.5+Math.pow(t(),1.7)*1.5,g=v>1.1?t.chance(.3)?0:1:t.chance(.5)?3:1;r<1||co(c,ge-x)>1.1||ua.push([c,ge-x,v,g,.1,1])}}}await s.yield();const Qe=new l.Matrix4,sa=new l.Quaternion,va=new l.Euler,Ve=new l.Vector3,wa=new l.Vector3,he=new l.Vector3,ho=new l.Quaternion,Ga=new l.Quaternion,Vo=new l.Vector3(0,1,0),fo=jo.map((t,e)=>{const a=new l.InstancedMesh(t,ot,Math.max(1,ua.filter(o=>o[3]===e).length));return a.count=0,a.frustumCulled=!1,a.name="crest-blocks-"+e,w.add(a),a});let Io=0;const na=[],Ie=new l.Vector3,ga=new l.Vector3;for(const[t,e,a,o,c,h]of ua){if((++Io&15)===0&&await s.yield(),!h&&n(t,e)>45&&p(t,e)<.57)continue;const u=c?.16:o===0?.28:.6,r=fo[o];Ve.set(a*Ft.range(.75,1.4),a*Ft.range(.7,1.25),a*Ft.range(.75,1.35)),va.set(Ft.range(-u,u),Ft()*6.283,Ft.range(-u,u)),sa.setFromEuler(va);const x=n(t,e);he.set(n(t-1.5,e)-n(t+1.5,e),3,n(t,e-1.5)-n(t,e+1.5)).normalize(),ho.setFromUnitVectors(Vo,he),Ga.identity().slerp(ho,.8),sa.premultiply(Ga),he.set(0,1,0).applyQuaternion(Ga);const v=Ve.y*Ua[o]*(.04-c);if(wa.set(t+he.x*v,x+he.y*v,e+he.z*v),Qe.compose(wa,sa,Ve),r.setMatrixAt(r.count++,Qe),c>=.3?W(t,e,a*1.3,.2):a>.7&&Te(t,e,a*1.1,a*Ua[o]*1.3,.42),a>.62&&c<.3){const g=Math.max(Ve.x,Ve.z)*.8,T=Ve.y*Ua[o],S=(n(t+St*3,e+Kt*3)-x)/3,q=Math.min(7,T*oe,T/Math.max(Xt+S,.16));Ie.set(St,0,Kt).addScaledVector(he,-(St*he.x+Kt*he.z)).normalize(),ga.crossVectors(Ie,he),na.push([t+he.x*.12+Ie.x*q*.5,x+he.y*.12+Ie.y*q*.5,e+he.z*.12+Ie.z*q*.5,Ie.x,Ie.y,Ie.z,he.x,he.y,he.z,ga.x,ga.y,ga.z,g,q])}}fo.forEach(t=>{t.instanceMatrix.needsUpdate=!0}),await s.yield();{const t=new l.PlaneGeometry(2,2);t.rotateX(-Math.PI/2);const e=new Float32Array(Math.max(1,na.length)*4),a=new l.InstancedMesh(t,D(Ps,As,{uShade:ut},{transparent:!0,depthWrite:!1,side:l.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-6}),Math.max(1,na.length));na.forEach((o,c)=>{const h=o[12]*1.7+o[13]*.5,u=o[12]*1.7;Qe.set(o[3]*h,o[6],o[9]*u,o[0],o[4]*h,o[7],o[10]*u,o[1],o[5]*h,o[8],o[11]*u,o[2],0,0,0,1),a.setMatrixAt(c,Qe),e.set([o[12],o[13],h,u],c*4),(c&255)===255&&(a.instanceMatrix.needsUpdate=!0)}),t.setAttribute("aD",new l.InstancedBufferAttribute(e,4)),a.count=na.length,a.instanceMatrix.needsUpdate=!0,a.frustumCulled=!1,a.renderOrder=1,a.name="block-feet",w.add(a)}await s.yield();{const t=L.fork("pinnacles"),e=io(t,11,2.7,6),a=io(t,7,2.3,5);await s.yield();const o=44,c=[new l.InstancedMesh(e,ot,o/2),new l.InstancedMesh(a,ot,o/2)];for(let h=0;h<o;h++){let u,r;const x=h>=44;if(h<20)r=t.range(112,292),u=A.spurX(r)+t.gauss()*3.5;else if(h<34)r=t.range(60,290),u=A.spurX(r)-tt*t.range(16,70),dt(u,r)<95&&(u=A.spurX(r)+tt*t.range(14,60));else if(!x)u=t.range(-230,110),r=ea+t.range(-70,8),Math.abs(u+8)<34&&(u-=70);else{const g=t.range(-2.1,1),T=t.range(9,30);u=Math.sin(g)*T,r=ge-Math.cos(g)*T}!x&&lt(u,r)<26&&(u+=u>-30?44:-44);const v=x?t.range(.8,1.5):Math.min(t.range(.6,1.5),lt(u,r)<60?.8:9);Ve.set(v*t.range(.8,1.3),v,v*t.range(.8,1.3)),va.set(t.range(-.12,.12),t()*6.283,t.range(-.12,.12)),sa.setFromEuler(va),wa.set(u,n(u,r)-1.2*v,r),Qe.compose(wa,sa,Ve),c[h&1].setMatrixAt(h>>1,Qe),Te(u,r,2.6*v,7*v,.45)}c.forEach((h,u)=>{h.instanceMatrix.needsUpdate=!0,h.frustumCulled=!1,h.name="pinnacles-"+u,w.add(h)})}b.forEach(t=>{t.needsUpdate=!0}),await s.yield();const $t=L.fork("herd"),ra=Math.round(st(4200,6e3,O)*st(.7,1,(Nt-.6)/.4)),_a=26,$e=[];for(const t of M){const e=d.byNode[t.id];if(!(t.order>3))for(const a of t.kids){const o=d.byNode[a].pts,c=e.pts.slice(Math.floor(e.pts.length*.35)),h=o.slice(1,Math.ceil(o.length*(t.order===3?.45:.75))),u=c.concat(h);let r=0;for(let g=1;g<u.length;g++)r+=Math.hypot(u[g][0]-u[g-1][0],u[g][1]-u[g-1][1]);const x=t.order===0?1.5:t.order===1?1.25:1,v=$t.sign();$e.push({pts:u,len:r,dens:x,wa:e.w,wb:d.byNode[a].w,na:c.length,side:v,gap:$t.range(4,9),id:$e.length}),t.order<2&&$e.push({pts:u,len:r,dens:x,wa:e.w,wb:d.byNode[a].w,na:c.length,side:-v,gap:$t.range(5,11),id:$e.length})}}{const t=d.upC.pts.slice(Math.floor(d.upC.pts.length*.55));let e=0;for(let a=1;a<t.length;a++)e+=Math.hypot(t[a][0]-t[a-1][0],t[a][1]-t[a-1][1]);for(const a of[-1,1])$e.push({pts:t,len:e,dens:1.5,wa:d.upC.w,wb:d.upC.w,na:t.length,side:a,gap:$t.range(5,10),id:$e.length})}await s.yield();const $o=$e.reduce((t,e)=>t+e.len*e.dens,0),Oo=Math.max(.5,$o/ra*.62),xa=Math.round(st(120,270,(Nt-.6)/.4)),re=[],mo=yt.root,po=Math.min(yt.climb+2,mt.length-1),Ho=96,ia=[],Ea=1400,Le=(t,e,a)=>{for(const o of re)if(Math.abs(o[0]-t)<a&&Math.abs(o[1]-e)<a&&Math.hypot(o[0]-t,o[1]-e)<a)return!1;return!0},ya=Math.round(st(1300,2300,(Nt-.6)/.4)),Wt=new Float32Array((ra+_a+xa+Ea+ya+4)*4),Zt=new Float32Array((ra+_a+xa+Ea+ya+4)*4);let ye=0;if(m){{const a=mt[yt.fork-1],o=mt[yt.fork],c=Math.hypot(o.x-a.x,o.z-a.z)||1,h=(o.x-a.x)/c,u=(o.z-a.z)/c;for(const[r,x,v,g,T,S,q]of[[13,5,1.78,.33,.8,.6,0],[16,-6,1.45,0,.5,.86,0],[9,11,1.5,.33,.8,.6,0],[7,-10,1.44,0,-.9,.4,0],[19,3,1.62,.33,.8,.6,1],[23,-5,1.4,.33,.8,.6,1],[28,6,1.5,.33,.8,.6,1],[35,-9.5,1.36,.33,.8,.6,0],[39,9,1,.33,.8,.6,0]]){let B=a.x+h*r-u*x,X=a.z+u*r+h*x,vt=i(B,X,14),jt=-1e9;if(!q)for(let Et=-6;Et<=6;Et+=2)for(let Lt=-8;Lt<=8;Lt+=2){const Pt=a.x+h*(r+Et)-u*(x+Lt),rt=a.z+u*(r+Et)+h*(x+Lt);if(!Le(Pt,rt,4.4))continue;const _=i(Pt,rt,14),ct=Math.min(_,1.6)*3-Math.max(_-5,0)-Math.hypot(Et,Lt)*.4+Et*.25;ct>jt&&(jt=ct,B=Pt,X=rt,vt=_)}const Ut=(r*.37+x*.11+7)%1;Le(B,X,4)&&re.push([B,X,v,vt<1.2?.33:g,T,S,Ut,vt<1.2?Rt(.2-vt*.045,.24,.42)*v:0,vt<1.2?1:0])}}{const a=yt.bar,o=Math.hypot(.8,.6),c=.8/o,h=.6/o;let u=0;for(let r=-52,x=0;r<44;r+=$t.range(5.6,7.4),x++){const v=1.3*Math.sin(x*2.1),g=a[0]+c*r-h*v,T=a[1]+h*r+c*v+10,S=i(g,T,14),q=$t(),B=$t.chance(.3)?$t.range(1.56,1.7):$t.chance(.15)?1:$t.range(1.3,1.48);S<-11||!Le(g,T,4.6)||S<1.2&&u>=8||(S<1.2&&u++,re.push([g,T,B,.33,c,h,q,S<1.2?Rt(.2-S*.045,.24,.5)*B:0,S<1.2?1:0]))}for(const[r,x]of[[.3,.2],[.47,.7]]){const v=m(r,z*.5-3.6),g=1.36+.2*x;Le(v[0],v[1],5)&&re.push([v[0],v[1],g,.33,-v[2],-v[3],x,.47*g,1])}}let t=0;const e=yt.trunk;for(let a=1;a<e.length;a++)t+=Math.hypot(e[a][0]-e[a-1][0],e[a][1]-e[a-1][1]);for(let a=14,o=0;a<t-3;a+=$t.range(5.6,8.2),o++)if(!(kt.n2(a*.05,7.7)<-.42))for(const c of[6.5,10.5,14.5]){const h=m(a/t,z*.5+c+1.3*Math.sin(o*1.7)),u=$t.chance(.3),r=$t();if(!(i(h[0],h[1],12)<2.2||!Le(h[0],h[1],5))){re.push([h[0],h[1],u?$t.range(1.5,1.62):$t.chance(.15)?.95:$t.range(1.2,1.4),.3*(.8+.4*r),-h[2],-h[3],r,0,0]);break}}}if(m){const t=Be(De("branching-turn:"+s.seed));for(let e=yt.fork;e<Math.min(yt.climb+2,mt.length-1);e++){const a=mt[e],o=mt[e+1],c=Math.hypot(o.x-a.x,o.z-a.z)||1,h=(o.x-a.x)/c,u=(o.z-a.z)/c;for(let r=4;r<c;r+=t.range(5.5,8))for(const x of[-1,1]){const v=x*(e>yt.turn?t.range(9,46):t.range(15,40)),g=a.x+h*r-u*v,T=a.z+u*r+h*v,S=t(),q=t.chance(.3),B=q?t.range(1.5,1.62):t.chance(.15)?.95:t.range(1.2,1.4);re.length>=xa-40||i(g,T,12)<2.4||!Le(g,T,5.4)||e>yt.turn&&t.chance(.4)||re.push([g,T,B,S<.3?0:.3*(.8+.4*S),.35+.5*(S-.5),.94,S,0,0])}}await s.yield()}for(const t of $t.shuffle($e.slice())){const e=Oo/t.dens;for(let a=1;a<t.pts.length&&ye<ra;a++){const o=t.pts[a-1],c=t.pts[a],h=Math.hypot(c[0]-o[0],c[1]-o[1])||1,u=(c[0]-o[0])/h,r=(c[1]-o[1])/h,x=a<t.na?t.wa:t.wb,v=t.side*(x*.5+t.gap);for(let g=$t()*e;g<h&&ye<ra;g+=e*$t.range(.5,1.5)){if(kt.n2((a*20+g)*.012,t.id*3.7)<-.18)continue;const T=v+$t.gauss()*1.1,S=ye*4,q=$t.chance(.13)?1:0,B=o[0]+u*g-r*T,X=o[1]+r*g+u*T,vt=$t(),jt=q?1.25:$t.chance(.2)?.7:$t.range(.9,1.08);if(Math.abs(B)<460&&X<ae[1]+130&&X>ae[1]-470&&ia.length<Ea){const Ut=G(B,X,mo,po);if(Ut<Ho){ia.push([Ut,B,X,jt,vt,u,r,q]);continue}}Wt[S]=B,Wt[S+1]=X,Wt[S+2]=vt,Wt[S+3]=jt,Zt[S]=-u,Zt[S+1]=-r,Zt[S+2]=q,Zt[S+3]=0,ye++}}}await s.yield(),ia.sort((t,e)=>t[0]-e[0]);for(let t=0;t<ia.length;t++){const[e,a,o,c,h,u,r,x]=ia[t];if((t&127)===127&&await s.yield(),re.length<xa){Le(a,o,5.2)&&i(a,o,12)>1.6&&re.push([a,o,1.2*c+.06,.3*(.8+.4*h),-u,-r,h,0,0]);continue}if(!Le(a,o,7))continue;const v=ye*4;Wt[v]=a,Wt[v+1]=o,Wt[v+2]=h,Wt[v+3]=c,Zt[v]=-u,Zt[v+1]=-r,Zt[v+2]=x,Zt[v+3]=0,ye++}await s.yield();for(let t=0;t<_a;t++,ye++){const e=$t.range(12,82),a=A.spurX(e)-$t.range(20,52)*(k.x<0?1:-1),o=ye*4,c=$t()*6.283;Wt[o]=a,Wt[o+1]=e,Wt[o+2]=$t(),Wt[o+3]=.75,Zt[o]=Math.cos(c),Zt[o+1]=Math.sin(c),Zt[o+2]=2,Zt[o+3]=n(a,e)+.05}const Ge=[],_e=[];if(m){const t=Be(De("branching-flora:"+s.seed)),e=v=>zt[v],a=(v,g,T,S=1)=>[st(v.r,g.r,T)*S,st(v.g,g.g,T)*S,st(v.b,g.b,T)*S],o=new l.Color(.2,.22,.09),c=new l.Color(.62,.5,.26),h=(v,g,T,S)=>{const q=ye*4;ye++,Wt[q]=v,Wt[q+1]=g,Wt[q+2]=0,Wt[q+3]=S/.8/1.42/.19,Zt[q]=1,Zt[q+1]=0,Zt[q+2]=4+Rt(1-T*.8/Math.max(S,.05),0,.92),Zt[q+3]=.02},u=(v,g,T,S,q,B)=>{Ge.length+_e.length>=ya||(S*=1.5,q*=1.6,Ge.push([v,g,S,q,B[0],B[1],B[2],T]),h(v,g,S*.6,q*.8))},r=(v,g,T,S,q)=>{Ge.length+_e.length>=ya||!Le(v,g,S+1.6)||(_e.push([v,g,T,S,q[0],q[1],q[2],t()]),h(v,g,T*.9,S*1.7))};let x=0;for(let v=mo-1;v<po;v++){const g=mt[v],T=mt[v+1],S=Math.hypot(T.x-g.x,T.z-g.z)||1,q=(T.x-g.x)/S,B=(T.z-g.z)/S;for(let X=0;X<S;X+=1.15)for(let vt=0;vt<6;vt++){++x%40===0&&await s.yield();const jt=t(),Ut=(t.chance(.5)?-1:1)*(3+50*jt*jt),Et=g.x+q*X-B*Ut,Lt=g.z+B*X+q*Ut;let Pt=Et,rt=Lt,_=i(Pt,rt,22);if(_>2.6&&_<9&&t.chance(.7)){const Ot=i(Pt+1,rt,22)-i(Pt-1,rt,22),fe=i(Pt,rt+1,22)-i(Pt,rt-1,22),xe=Math.hypot(Ot,fe)||1,ue=_-t.range(.5,1.9);Pt-=Ot/xe*ue,rt-=fe/xe*ue,_=i(Pt,rt,22)}if(_<-1.2)continue;const ct=kt.n2(Pt*.045,rt*.045+31),bt=kt.n2(Pt*.013+9,rt*.013);if(_<.3)t.chance(.55)&&u(Pt,rt,2,t.range(.75,1.25),t.range(.5,.9),a(o,c,t.range(.15,.7),.5));else if(_<2.6)t.chance(.6)?u(Pt,rt,2,t.range(.8,1.4),t.range(.6,1.1),a(o,c,t.range(.2,.9),.55)):u(Pt,rt,0,t.range(.4,.65),t.range(.8,1.3),a(c,e(2),t.range(0,.6),.5));else if(_<16)ct>.12?t.chance(.4)?r(Pt,rt,t.range(.7,1.5),t.range(1.1,2.4),a(e(2),o,t.range(.1,.6),.5)):u(Pt,rt,t.chance(.4)?1:0,t.range(.4,.7),t.range(.7,1.2),a(c,o,t.range(0,.6),.52)):t.chance(.22)&&u(Pt,rt,t.chance(.3)?1:0,t.range(.35,.55),t.range(.6,1),a(c,e(0),t.range(0,.5),.5));else if(t.chance(.62)){const Ot=t();Ot<.22&&ct>-.1?r(Pt,rt,t.range(.5,1),t.range(.9,1.9),a(e(1),e(2),bt>0?t.range(.5,1):t.range(0,.4),.5)):Ot<.45?u(Pt,rt,1,t.range(.4,.62),t.range(.6,1),a(c,o,t.range(.2,.7),.5)):u(Pt,rt,0,t.range(.35,.6),t.range(.8,1.4),a(c,e(3),t.range(0,.7),.5+.1*t()))}}}await s.yield()}const ba=vs(),Ee=new l.InstancedBufferGeometry;for(const t of re)t[2]*=1.2,t[7]*=1.2;Ee.setIndex(ba.index);for(const t of["position","normal","color","aPart"])Ee.setAttribute(t,ba.attributes[t]);const uo=new Float32Array(Math.max(re.length,1)*4),vo=new Float32Array(Math.max(re.length,1)*4),wo=[];re.forEach((t,e)=>{if(uo.set([t[0],t[1],t[2],t[3]],e*4),vo.set([t[4],t[5],t[6],t[7]],e*4),t[8]){wo.push(t);return}const a=ye*4;ye++,Wt[a]=t[0],Wt[a+1]=t[1],Wt[a+2]=t[3],Wt[a+3]=1.25*t[2]/.19,Zt[a]=t[4],Zt[a+1]=t[5],Zt[a+2]=3,Zt[a+3]=.02}),Ee.setAttribute("iPos",new l.InstancedBufferAttribute(uo,4)),Ee.setAttribute("iRot",new l.InstancedBufferAttribute(vo,4)),Ee.setAttribute("iUp",new l.InstancedBufferAttribute(new Float32Array(Math.max(re.length,1)),1)),Ee.instanceCount=re.length;const Ma={value:0},Ka=new l.Mesh(Ee,D(ws,gs,{uNearT:Ma,uRim:{value:.3}}));Ka.frustumCulled=!1,Ka.name="near-herd",w.add(Ka);{const t=re.filter(h=>i(h[0],h[1],12)<5.5).slice(0,26),e=new l.InstancedBufferGeometry;e.setIndex(ba.index);for(const h of["position","color","aPart"])e.setAttribute(h,ba.attributes[h]);const a=new Float32Array(Math.max(t.length,1)*4),o=new Float32Array(Math.max(t.length,1)*4);t.forEach((h,u)=>{a.set([h[0],h[1],h[2],h[3]],u*4),o.set([h[4],h[5],h[6],h[7]],u*4)}),e.setAttribute("iPos",new l.InstancedBufferAttribute(a,4)),e.setAttribute("iRot",new l.InstancedBufferAttribute(o,4)),e.instanceCount=t.length;const c=new l.Mesh(e,D(xs,ys,{uNearT:Ma,uMap:{value:Z}},{transparent:!0,depthWrite:!1,side:l.BackSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-6}));c.frustumCulled=!1,c.renderOrder=1,c.name="herd-mirror",w.add(c)}await s.yield();{const t=[],e=[],a=[],o=[];for(let B=0;B<7;B++){const X=B/7*6.2832+.4*Math.sin(B*2.3),vt=.22+.3*(B*.618%1),jt=.72+.28*(B*.377%1),Ut=Math.cos(X),Et=Math.sin(X),Lt=t.length/3;for(let Pt=0;Pt<3;Pt++){const rt=Pt/2,_=.12+vt*rt*rt,ct=jt*rt,bt=Pt===2?0:.085*(1-.45*rt);Pt<2?(t.push(Ut*_-Et*bt,ct,Et*_+Ut*bt,Ut*_+Et*bt,ct,Et*_-Ut*bt),e.push(rt,0,rt,0),a.push(0,0,0,0,0,0)):(t.push(Ut*_,ct,Et*_),e.push(1,0),a.push(0,0,0))}if(o.push(Lt,Lt+1,Lt+2,Lt+1,Lt+3,Lt+2,Lt+2,Lt+3,Lt+4),B%2===0&&B<6){const Pt=Ut*(.12+vt),rt=jt,_=Et*(.12+vt),ct=t.length/3;for(const bt of[[0,.09,0],[.07,0,.02],[-.03,-.07,.06],[-.05,0,-.07]])t.push(Pt,rt,_),e.push(1,1),a.push(bt[0],bt[1],bt[2]);o.push(ct,ct+1,ct+2,ct,ct+2,ct+3,ct,ct+3,ct+1)}}const c=new l.InstancedBufferGeometry;c.setAttribute("position",new l.Float32BufferAttribute(t,3)),c.setAttribute("aT",new l.Float32BufferAttribute(e,2)),c.setAttribute("aOff",new l.Float32BufferAttribute(a,3)),c.setIndex(o);const h=new Float32Array(Math.max(Ge.length,1)*4),u=new Float32Array(Math.max(Ge.length,1)*4);Ge.forEach((B,X)=>{h.set([B[0],B[1],B[2],B[3]],X*4),u.set([B[4],B[5],B[6],B[7]],X*4)}),c.setAttribute("iPos",new l.InstancedBufferAttribute(h,4)),c.setAttribute("iCol",new l.InstancedBufferAttribute(u,4)),c.instanceCount=Ge.length;const r=new l.Mesh(c,D(bs,Ms,{},{side:l.DoubleSide}));r.frustumCulled=!1,r.name="bar-tufts",w.add(r),await s.yield();const x=new l.SphereGeometry(1,9,5,0,Math.PI*2,0,Math.PI*.5),v=x.attributes.position;for(let B=0;B<v.count;B++){const X=v.getX(B),vt=v.getY(B),jt=v.getZ(B),Ut=1+.2*Math.sin(X*5.1+jt*3.3)+.16*Math.sin(jt*7.3-vt*4.1+1.7)+.1*Math.sin(X*11+vt*6);v.setXYZ(B,X*Ut,vt*(.85+.3*Math.sin(X*4.2+jt*5.7+.5)),jt*Ut)}x.computeVertexNormals();const g=new l.InstancedBufferGeometry;g.setIndex(x.index),g.setAttribute("position",x.attributes.position),g.setAttribute("normal",x.attributes.normal);const T=new Float32Array(Math.max(_e.length,1)*4),S=new Float32Array(Math.max(_e.length,1)*4);_e.forEach((B,X)=>{T.set([B[0],B[1],B[2],B[3]],X*4),S.set([B[4],B[5],B[6],B[7]],X*4)}),g.setAttribute("iPos",new l.InstancedBufferAttribute(T,4)),g.setAttribute("iCol",new l.InstancedBufferAttribute(S,4)),g.instanceCount=_e.length;const q=new l.Mesh(g,D(ks,zs));q.frustumCulled=!1,q.name="bar-willows",w.add(q)}await s.yield();const Ke=new l.InstancedBufferGeometry;Ke.setAttribute("position",new l.Float32BufferAttribute(new Float32Array(24),3)),Ke.setAttribute("corner",new l.Float32BufferAttribute([-.5,0,1,.5,0,1,.5,1,1,-.5,1,1,-.5,0,0,.5,0,0,.5,1,0,-.5,1,0],3)),Ke.setIndex([0,1,2,0,2,3,4,5,6,4,6,7]),Ke.setAttribute("aPos",new l.InstancedBufferAttribute(Wt,4)),Ke.setAttribute("aDir",new l.InstancedBufferAttribute(Zt,4)),Ke.instanceCount=ye;const Uo=Math.max(k.y,.05),Go=new l.Vector2(-k.x,-k.z).normalize(),ka={uHerdAdv:{value:0},uPx:{value:.0015},uShadowDir:{value:Go},uShLen:{value:Rt(1.1/Math.tan(Math.asin(Uo)),1.5,8)},uNearT:Ma},za=new l.Mesh(Ke,D(hs,fs,ka,{transparent:!0,depthWrite:!1,side:l.DoubleSide}));za.frustumCulled=!1,za.renderOrder=2,za.name="herd",w.add(za),await s.yield();const Ct=L.fork("geese"),go=14,Pa=Math.round(800*Nt),Xa=706,Ye=Math.round(2200*Nt)+Pa+Xa,Ht=new Float32Array(Ye*4),Gt=new Float32Array(Ye*4),It=new Float32Array(Ye*4);let pe=0;const _o=d.chans.filter(t=>!t.creek),xo=t=>{for(let e=0;e<40;e++){const a=Ct.pick(_o);if(a.order<t||a.node===-1)continue;const o=Ct.pick(a.pts),c=Ct.sign()*(a.w*.5+Ct.range(4,12));return[o[0]+c,o[1]+Ct.range(-6,6)]}return[ae[0]+40,ae[1]-300]};for(let t=0;t<go;t++){const e=xo(1),a=Math.min(Ct.int(60,300),Math.floor((Ye-Pa-Xa)/go*1.6),Ye-Pa-Xa-pe),o=Ct.range(-190,190),c=Ct.range(172,245),h=Ct.range(110,330),u=Ct.range(52,84),r=Ct(),x=Ct.chance(.4),v=18,g=Math.ceil(a/v),T=[];for(let S=0;S<g;S++)T.push([Ct.gauss()*22,Ct.range(-.4,.4)]);for(let S=0;S<a;S++,pe++){const q=pe*4,B=Math.floor(S/v),X=S%v,vt=Math.ceil(X/2),jt=x||X%2?1:-1;Ht[q]=e[0],Ht[q+1]=.12,Ht[q+2]=e[1],Ht[q+3]=r,Gt[q]=o,Gt[q+1]=c,Gt[q+2]=h,Gt[q+3]=u,It[q]=T[B][0]+jt*vt*2.6+Ct.gauss()*1.1,It[q+1]=Rt((B+T[B][1]+vt*.09+Ct.gauss()*.03)/g,0,1)*.25,It[q+2]=Ct(),It[q+3]=0}}await s.yield();const Aa=[];for(let t=0;t<36;t++)Aa.push(xo(2));const Wa=M.filter(t=>t.order<=1).map(t=>d.byNode[t.id]).filter(t=>t&&t.pts.length>3);for(let t=0;t<10&&Wa.length;t++){const e=Wa[t%Wa.length],a=e.pts[Ct.int(1,e.pts.length-2)],o=Ct.sign()*(e.w*.5+Ct.range(5,14));Aa.splice(Ct.int(0,12),0,[a[0]+o,a[1]+Ct.range(-8,8)])}const Je=mt[1],Ca=yt.forkAt,Eo=[[40,150,90,-420,45,-330,.06,.34,2],[Ca[0]-120,2,Ca[1]-60,86,60,-150,.33,.3,2],[-330,60,-60,60,110,-330,.62,.3,2],[Je.x-250,Je.y-28,Je.z-95,Je.x+190,Je.y-86,Je.z-300,0,1,3]];for(const[t,e,a,o,c,h,u,r,x]of Eo){const v=Math.hypot(o-t,c-e,h-a);for(let g=0;g<80;g++,pe++){const T=g<26?0:g<52?1:2,S=g-T*26,q=Math.ceil(S/2),B=S%2?1:-1,X=pe*4;Ht[X]=t,Ht[X+1]=e,Ht[X+2]=a,Ht[X+3]=u,Gt[X]=o,Gt[X+1]=c,Gt[X+2]=h,Gt[X+3]=r,It[X]=[0,52,-66][T]+B*q*(5.2+.5*Math.sin(T*2.1+B))+Ct.gauss()*2.4+Math.sin(q*.8+T*2+B)*3.2,It[X+1]=([0,95,170][T]+q*6.4+Ct.gauss()*3.4+(Ct.chance(.18)?5:0))/v,It[X+2]=Ct(),It[X+3]=x}}{const t=Be(De("branching-gate-skein:"+s.seed)),e=[215,186,70],a=[15,206,-20],o=Math.hypot(a[0]-e[0],a[1]-e[1],a[2]-e[2]);for(let c=0;c<26;c++,pe++){const h=Math.ceil(c/2),u=c%2?1:-1,r=pe*4;Ht[r]=e[0],Ht[r+1]=e[1],Ht[r+2]=e[2],Ht[r+3]=.74,Gt[r]=a[0],Gt[r+1]=a[1],Gt[r+2]=a[2],Gt[r+3]=.2,It[r]=u*h*7.2+t.gauss()*1.1,It[r+1]=(h*8.4+t.gauss()*1.6)/o,It[r+2]=t(),It[r+3]=2}}{const t=Be(De("branching-streams:"+s.seed)),e=[[-300,40,-120,-50,60,-95,0,.27],[Ca[0]-70,5,Ca[1]-70,-78,128,110,.1,.3],[-190,60,230,-175,45,-150,-.02,.2],[34,62,-212,-176,92,-112,.7,.24],[78,80,-236,-150,106,-138,.71,.24],[130,147,-36,-150,158,-22,.86,.14]];for(const[a,o,c,h,u,r,x,v]of e){const g=Math.hypot(h-a,u-o,r-c);for(let T=0;T<60;T++,pe++){const S=Math.floor(T/15),q=T-S*15,B=Math.ceil(q/2),X=q%2?1:-1,vt=pe*4;Ht[vt]=a,Ht[vt+1]=o,Ht[vt+2]=c,Ht[vt+3]=x,Gt[vt]=h,Gt[vt+1]=u,Gt[vt+2]=r,Gt[vt+3]=v,It[vt]=[0,24,-30,12][S]+X*B*(4.4+.4*Math.sin(S*2.1+X))+t.gauss()*1.4,It[vt+1]=S*.25+(B*5.6+t.gauss()*2+[0,14,5,22][S])/g,It[vt+2]=t(),It[vt+3]=4}}}for(let t=0;t<Pa&&pe<Ye;t++,pe++){const e=Aa[Math.floor(Math.pow(Ct(),1.6)*Aa.length)],a=[e[0]+Ct.gauss()*7,e[1]+Ct.gauss()*9],o=pe*4;Ht[o]=a[0],Ht[o+1]=.12,Ht[o+2]=a[1],Ht[o+3]=Ct(),Gt[o]=a[0]+Ct.range(-90,90),Gt[o+1]=Ct.range(35,130),Gt[o+2]=a[1]+Ct.range(120,420),Gt[o+3]=60,It[o]=Ct.range(-20,20),It[o+1]=Rt((a[1]-je)/1500,0,1)*1.2+Ct()*.12,It[o+2]=Ct(),It[o+3]=1}const Sa=[],la=[],qa=(...t)=>t.forEach(e=>{Sa.push(e[0],0,e[1]),la.push(Math.abs(e[0])*2)});qa([0,-.3],[-.045,0],[.045,0]),qa([-.045,0],[0,.2],[.045,0]);for(const t of[-1,1])qa([t*.04,-.09],[t*.3,-.075],[t*.04,.08]),qa([t*.04,.08],[t*.3,-.075],[t*.5,.05]);const Oe=new l.InstancedBufferGeometry;Oe.setAttribute("position",new l.Float32BufferAttribute(Sa,3)),Oe.setAttribute("aW",new l.Float32BufferAttribute(la,1)),Oe.setAttribute("aA",new l.InstancedBufferAttribute(Ht,4)),Oe.setAttribute("aB",new l.InstancedBufferAttribute(Gt,4)),Oe.setAttribute("aO",new l.InstancedBufferAttribute(It,4)),Oe.instanceCount=pe;const Na={uPx:ka.uPx,uEvent:{value:0},uProg:{value:0},uRev:{value:new l.Vector2(.52,.22)}},Za=new l.Mesh(Oe,D(ms,ds,Na,{side:l.DoubleSide}));Za.frustumCulled=!1,Za.name="geese",w.add(Za),await s.yield();const Ko=async t=>{const e=t.length/5,a=.25,o=new Float64Array(e),c=(r,x)=>Math.hypot(t[r*5]-t[x*5],t[r*5+1]-t[x*5+1],t[r*5+2]-t[x*5+2]);for(let r=0;r<e;r++)o[r]=Math.max(r>0?c(r,r-1):0,r<e-1?c(r,r+1):0)/2;let h=0;for(let r=0;r<la.length;r++){const x=Math.abs(Sa[r*3]),v=la[r]*la[r]*.12;h=Math.max(h,Math.hypot(x,Math.max(Math.abs(x*.97-v),Math.abs(x*.73-v)),Sa[r*3+2]))}h*=.3;let u=!1;for(let r=0,x;r<pe;r=x){const v=r*4,g=It[v+3];if(x=r+1,g!==0&&g!==4)continue;const T=At=>{for(let Qt=0;Qt<4;Qt++)if(Ht[At*4+Qt]!==Ht[v+Qt]||Gt[At*4+Qt]!==Gt[v+Qt])return!1;return It[At*4+3]===g};for(;x<pe&&T(x);)x++;const S=x-r,q=g===4,B=Ht[v],X=Ht[v+1],vt=Ht[v+2],jt=Gt[v+1];let Ut=Gt[v]-B,Et=Gt[v+2]-vt;const Lt=Math.max(Math.hypot(Ut,Et),.001);Ut/=Lt,Et/=Lt;const Pt=[];for(let At=r;At<x;At++)Pt.push(At);Pt.sort((At,Qt)=>It[At*4]-It[Qt*4]);const rt=Float64Array.from(Pt,At=>It[At*4]),_=Float64Array.from(Pt,At=>It[At*4+2]),ct=q?0:6,bt=Ht[v+3]*40,Ot=q?0:.03,fe=a/(q?Math.hypot(Lt,Math.abs(jt-X)+1.2*23):Math.hypot(Lt+54,Math.abs(jt-X)*1.5/.8+1.2*23)),xe=At=>X+(jt-X)*(q?At:y(0,.8,At)),ue=[],Se=[],eo=[],ao=[];for(let At=0;At<e;At++){const Qt=At*5,ve=t[Qt]-B,se=t[Qt+2]-vt,ke=ve*Ut+se*Et,me=t[Qt+3]+h,we=o[At]+a/2,qe=me+we,He=Math.max(Ot,(ke-qe)/Lt),We=Math.min(1,(ke+qe)/Lt);if(We<He)continue;const Re=t[Qt+1],Ze=xe(He),fa=xe(We);if(Re<Math.min(Ze,fa)-1.2-qe||Re>Math.max(Ze,fa)+1.2+qe)continue;const Ra=se*Ut-ve*Et,Ue=me*me+we*we,Da=Math.max(1,Math.ceil((We-He)/fe));for(let it=0;it<=Da;it++){const qt=He+(We-He)*it/Da,ce=qt*Lt-ke,Mt=Ue-ce*ce,Yt=xe(qt)-Re,xt=Math.abs(Yt)-1.2;Mt<=0||xt>0&&xt*xt>=Mt||(ue.push(Ra-(ct?Math.sin(qt*9+bt)*ct:0)),Se.push(Mt),eo.push(Yt),ao.push(qt*23))}}const ha=new Uint8Array(S);let So=!1;for(let At=0;At<ue.length;At++){const Qt=ue[At],ve=Math.sqrt(Se[At]);let se=0,ke=S;for(;se<ke;){const me=se+ke>>1;rt[me]<=Qt-ve?se=me+1:ke=me}for(;se<S&&rt[se]<Qt+ve;se++){const me=rt[se]-Qt,we=eo[At]+Math.sin(ao[At]+_[se]*6.3)*1.2;me*me+we*we<Se[At]&&(ha[se]|=me>0?1:me<0?2:3,So=!0)}}if(So){await s.yield();const At=ue.length,Qt=new Uint32Array(At);for(let it=0;it<At;it++)Qt[it]=it;Qt.sort((it,qt)=>ue[it]-ue[qt]);const ve=new Float64Array(At),se=new Float64Array(At),ke=new Float64Array(At),me=new Float64Array(At);let we=0;for(let it=0;it<At;it++){const qt=Qt[it];ve[it]=ue[qt],se[it]=Se[qt],ke[it]=eo[qt],me[it]=ao[qt],Se[qt]>we&&(we=Se[qt])}we=Math.sqrt(we),await s.yield();const qe=(it,qt,ce)=>{let Mt=it;for(let Yt=!0;Yt;){Yt=!1;let xt=0,de=At;if(ce>0){for(;xt<de;){const Jt=xt+de>>1;ve[Jt]<=Mt-we?xt=Jt+1:de=Jt}for(;xt<At&&ve[xt]-we<Mt;xt++){const Jt=Mt-ve[xt],Me=ke[xt]+Math.sin(me[xt]+qt*6.3)*1.2;if(Jt*Jt+Me*Me<se[xt]){const Ne=Math.fround(ve[xt]+Math.sqrt(se[xt]-Me*Me)+1e-4);Ne>Mt&&(Mt=Ne,Yt=!0)}}}else{for(;xt<de;){const Jt=xt+de>>1;ve[Jt]<Mt+we?xt=Jt+1:de=Jt}for(xt--;xt>=0&&ve[xt]+we>Mt;xt--){const Jt=Mt-ve[xt],Me=ke[xt]+Math.sin(me[xt]+qt*6.3)*1.2;if(Jt*Jt+Me*Me<se[xt]){const Ne=Math.fround(ve[xt]-Math.sqrt(se[xt]-Me*Me)-1e-4);Ne<Mt&&(Mt=Ne,Yt=!0)}}}}return Mt},He=Float64Array.from(Pt,it=>It[it*4+1]),We=Math.abs(jt-X),Re=[],Ze=[],fa=fe*fe/8*(2*ct*81+(q?0:2*We*6/.64)+2*1.2*529),Ra=(it,qt,ce,Mt,Yt,xt)=>{let de=1/0;const Jt=He[it]-He[qt];for(let Me=0;Me<(q?2:1);Me++){const Ne=q?Jt-Math.floor(Jt)-Me:Jt,ma=Math.abs(Ne),qo=ma*Lt*ma*Lt,ja=Math.max(Ot,Ot-Ne),oo=Math.min(1,1-Ne);if(oo<=ja)continue;let Va=Mt-qo;if(xt){const Fe=Yt/2*Math.hypot(2*ct*9*Math.min(1,4.5*ma),(q?0:We*6/.64*ma)+55.199999999999996);Va+=Fe*Fe}else{const Fe=Math.abs(rt[it]-ce)-2*ct*Math.min(1,4.5*ma);if(Fe>0&&Fe*Fe>=Va)continue}if(Va<=0)continue;const No=Math.max(1,Math.ceil((oo-ja)/Yt)),Wo=_[it]*6.3,Zo=_[qt]*6.3;for(let Fe=0;Fe<=No;Fe++){const Ia=ja+(oo-ja)*Fe/No,so=Ia+Ne,$a=xe(Ia)-xe(so)+(Math.sin(Ia*23+Wo)-Math.sin(so*23+Zo))*1.2,no=ce+(ct?(Math.sin(so*9+bt)-Math.sin(Ia*9+bt))*ct:0);if(xt){const da=Va-$a*$a;da>0&&(Re.push(no),Ze.push(da))}else{const da=qo+(rt[it]-no)*(rt[it]-no)+$a*$a;da<de&&(de=da)}}}return de};let Ue=1/0;for(const it of[1,fe])for(let qt=0;qt<S;qt++){for(let ce=qt+1;ce<S;ce++){const Mt=rt[ce]-rt[qt]-2*ct;if(Mt>0&&Mt*Mt>=Ue)break;const Yt=Ra(qt,ce,rt[ce],Ue,it,!1);Yt<Ue&&(Ue=Yt)}await s.yield()}const Da=(Math.sqrt(Ue)+fa)*(Math.sqrt(Ue)+fa);for(let it=0;it<S;it++){if(!ha[it])continue;let qt;if(ha[it]===1)qt=qe(rt[it],_[it],1);else if(ha[it]===2)qt=qe(rt[it],_[it],-1);else{const Mt=qe(rt[it],_[it],1),Yt=qe(rt[it],_[it],-1),xt=Mt-rt[it],de=rt[it]-Yt;qt=xt<de?Mt:de<xt||rt[it]<0?Yt:Mt}const ce=qt>rt[it]?1:-1;Re.length=0,Ze.length=0;for(let Mt=0;Mt<S;Mt++)Mt!==it&&(!ha[Mt]||Mt<it)&&Ra(it,Mt,rt[Mt],Da,fe,!0);for(;;){let Mt=qt;for(let Yt=!0;Yt;){Yt=!1;for(let xt=0;xt<Re.length;xt++){const de=Mt-Re[xt];if(de*de<Ze[xt]){const Jt=Math.fround(Re[xt]+ce*(Math.sqrt(Ze[xt])+1e-4));(ce>0?Jt>Mt:Jt<Mt)&&(Mt=Jt,Yt=!0)}}}if(Mt===qt)break;qt=qe(Mt,_[it],ce)}It[Pt[it]*4]=qt,rt[it]=qt,u=!0,await s.yield()}}await s.yield()}u&&(Oe.attributes.aO.needsUpdate=!0)},ee=L.fork("shreds"),ca=36,Qa=18,ie=new Float32Array((ca+Qa)*4),le=new Float32Array((ca+Qa)*4),be=k.x<0?1:-1;{const t=Be(De("branching-banners:"+s.seed));for(let e=0;e<6;e++){const a=e%3<2,o=t.range(150,200),c=t.range(-20,20),h=a?t.range(100,118):t.range(78,92),u=a?t.range(-84,-64):t.range(-104,-90),r=t.range(10,14),x=1+(e+t.range(0,.2))/6.1;for(let v=0;v<3;v++){const g=(ca+e*3+v)*4;ie[g]=c+(v-1)*t.range(13,19),ie[g+1]=h+t.range(-3,3),ie[g+2]=u+t.range(-4,4),ie[g+3]=t.range(9.5,13.5)*(v===1?1.25:1),le[g]=o*be,le[g+1]=r*be,le[g+2]=x,le[g+3]=0}}}const Ya=be>0?0:1,yo=Rt((wt.y+aa+12-oa[Ya].y)/pa,.3,.7);for(let t=0;t<ca;t++){const e=t*4,a=t>=12&&t<24;if(t>=24){const o=ea+ee.range(-70,26),c=ee.range(200,320),h=ee.range(-70,40);ie[e]=h,ie[e+1]=Math.max(j(h,o),j(-12,o))+ee.range(5,22),ie[e+2]=o,ie[e+3]=ee.range(11,21),le[e]=c*be,le[e+1]=ee.range(10,17)*be,le[e+2]=ee(),le[e+3]=0}else if(a){const o=oa[t%2],c=ee.range(46,80);ie[e]=o.x+be*c*.5,ie[e+1]=o.y-ee.range(0,5)+(t%2===Ya?yo*c*.5:0),ie[e+2]=o.z+c*.09*be,ie[e+3]=ee.range(6,10),le[e]=c*be,le[e+1]=ee.range(6,10)*be,le[e+2]=ee(),le[e+3]=1}else{const o=ee.range(86,176),c=ee.range(230,340);ie[e]=A.spurX(o)+ee.range(-12,12),ie[e+1]=A.spurH(o)+ee.range(-2,16),ie[e+2]=o,ie[e+3]=ee.range(10,20),le[e]=c*be,le[e+1]=ee.range(9,15)*be,le[e+2]=ee(),le[e+3]=0}}await s.yield();const Xe=new l.InstancedBufferGeometry;Xe.setAttribute("position",new l.Float32BufferAttribute(new Float32Array(12),3)),Xe.setAttribute("corner",new l.Float32BufferAttribute([-.5,-.5,.5,-.5,.5,.5,-.5,.5],2)),Xe.setIndex([0,1,2,0,2,3]),Xe.setAttribute("aS",new l.InstancedBufferAttribute(ie,4)),Xe.setAttribute("aT",new l.InstancedBufferAttribute(le,4)),Xe.instanceCount=ca+Qa;const Fa=new l.Mesh(Xe,D(ps,us,{},{transparent:!0,depthWrite:!1}));Fa.frustumCulled=!1,Fa.renderOrder=3,Fa.name="cloud-shreds",w.add(Fa);{const t=new l.PlaneGeometry(1,1,14,2);t.translate(.5,.5,0);const e=new l.InstancedBufferGeometry;e.setIndex(t.index),e.setAttribute("position",t.attributes.position),e.setAttribute("uv",t.attributes.uv);const a=new Float32Array(16),o=new Float32Array(16),c=Be(De("branching-banner:"+s.seed));for(let u=0;u<4;u++){const r=oa[u%2],x=u<2?0:1,v=u%2===Ya;a.set([r.x+be*.4,r.y-.6-x*3.4,r.z,(v?x?46:64:x?58:92)*c.range(.9,1.15)],u*4),o.set([be,v?yo+x*.16:x?.26:.1,.2+(x?.14:0),c()],u*4)}e.setAttribute("aB0",new l.InstancedBufferAttribute(a,4)),e.setAttribute("aB1",new l.InstancedBufferAttribute(o,4)),e.instanceCount=4;const h=new l.Mesh(e,D(Cs,Ss,{},{transparent:!0,depthWrite:!1,side:l.DoubleSide}));h.frustumCulled=!1,h.renderOrder=3,h.name="banners",w.add(h)}await s.yield();const Ba=130,Xo={portalSeat:{position:wt.clone(),facing:new l.Vector3(0,-Math.sin(J),-Math.cos(J)),direction:new l.Vector3(0,Math.sin(J),Math.cos(J)),radius:aa},flyThrough:mt,flyKeys:yt,saddle:new l.Vector3(-8,j(-8,ea),ea),reveal:mt[1].clone(),notch:new l.Vector3(A.spurX(Ba),j(A.spurX(Ba),Ba),Ba),deltaRoot:new l.Vector3(ae[0],0,ae[1]),deltaCentre:new l.Vector3(ae[0],0,(ae[1]+je)*.5),gorgeMouth:new l.Vector3(A.gorgeXf(0),0,0),towerTops:oa,sunDir:k.clone()},bo=new l.Vector3,Mo=new l.Quaternion,ko=new l.Vector2;let Ja=0,zo=0,to=0,ta=.31,Po=0,Ao=.62;const Ta=[.34,.6],La=[.25,.17],Co=(t,e,a)=>{if(I.uTime.value=e,w.updateWorldMatrix(!0,!1),a){bo.setFromMatrixPosition(a.matrixWorld),I.uCamL.value.copy(w.worldToLocal(bo));let c=720;s.renderer&&(s.renderer.getDrawingBufferSize(ko),c=Math.max(ko.y,1)),ka.uPx.value=2/(Math.max(Math.abs(a.projectionMatrix.elements[5]),.001)*c)}w.getWorldQuaternion(Mo).invert(),I.uSunL.value.copy(k).applyQuaternion(Mo).normalize(),zo+=Math.min(t||0,.1)*Ja*1.4,ka.uHerdAdv.value=e%900*.3+zo,Na.uEvent.value=Ja,Na.uProg.value=to;const o=(Po-Ao)*46;Ma.value=o;for(let c=0;c<10;c++){const h=wo[c];h&&C.value[c].set(h[0]+h[4]*h[3]*o,h[1]+h[5]*h[3]*o,h[4],h[5])}};return Co(0,0,null),{object:w,radius:420,height:320,center:new l.Vector3(0,120,-640),extent:{min:new l.Vector3(-1300,0,-2600),max:new l.Vector3(1300,215,560),crest:180},anchors:Xo,graph:M,uniforms:I,heightAt:j,rareEvent:nt,channels:d.chans,setProgress(t){Po=t,to=(t-ta)/Math.max(1-ta,.001),Ja=nt?y(Ta[0],Ta[1],to):0},setFinale(t){ta=t,this.setReveal(La[0],La[1])},setEvent(t,e){Ta[0]=t,Ta[1]=e},setNear(t){Ao=t},nearCount:re.length,setReveal(t,e){La[0]=t,La[1]=e,Na.uRev.value.set((t-ta)/Math.max(1-ta,.001),e/Math.max(1-ta,.001))},geeseAside:Ko,update:Co,dispose(){},ground:!1,groundY:0}}export{te as BRANCH_GLSL,gs as CARI_FS,ws as CARI_VS,Ae as FINISH,Pe as FOG_F,ze as FOG_V,ts as branchGraph,Bs as buildHero,vs as caribouGeo};
