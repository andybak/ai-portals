import*as n from"three";import{clamp as Fe,lerp as ne,smoothstep as A,makePath as ja}from"../kit/core.js";import{makeSky as Xa,skyDirection as Aa}from"../kit/sky.js";import*as Nt from"../kit/fx.js";import{buildHero as Ha,COMMON_GLSL as _t}from"../parts/singing-erg.js";const Ca=Math.PI/180,We=Math.PI*2,_=n.Vector3,we=[.6,.8],fe=[.8,-.6],Ft=[250,665],mt=248,gt=296,Za=a=>260*a+2700*a*a*a,Ya=a=>900*a+2200*a*a*a,Dt=we;function Yt(a,s,d,h){let O=1e18,z=1,X=0,E=0;for(let u=0;u<a.length-1;u++){const r=a[u],F=a[u+1],p=F[0]-r[0],$=F[1]-r[1];let q=((s-r[0])*p+(d-r[1])*$)/(p*p+$*$);q=q<0?0:q>1?1:q;const re=s-(r[0]+p*q),Ge=d-(r[1]+$*q),U=re*re+Ge*Ge;U<O&&(O=U,z=-$*re+p*Ge>=0?1:-1,X=r[2]+(F[2]-r[2])*q,E=r[3]+(F[3]-r[3])*q)}return h.d=Math.sqrt(O),h.side=z,h.a=X,h.b=E,h}function $a(a,s){const d=new n.CatmullRomCurve3(a.map(z=>new _(z[0],0,z[1])),!1,"centripetal"),h=Math.ceil(d.getLength()/s),O=[];for(let z=0;z<=h;z++){const X=d.getPointAt(z/h);O.push([X.x,X.z])}return O}function Qa(a,s,d){const h=a.noise,O=s.anchors.heightAt,z=d.range(0,50),X=d.range(0,50),E=(M,b,j)=>[b*Math.sin(M*Ca),b*Math.cos(M*Ca),j,0],u=()=>d.range(.9,1.1),r=[E(-100,480,50),E(-70,460,105*u()),E(-45,452,160*u()),E(-28,455,215),E(-18,450,190),E(-8,444,100),E(5,438,36),E(18,444,100),E(28,450,150),E(40,458,178*u()),E(56,462,150*u()),E(76,468,115*u()),E(98,475,80),E(122,485,50)],F=new _(r[3][0],r[3][2],r[3][1]),p=[[640,1210,30,0],[560,1095,50,0],[470,960,56,0],[425,890,56,0],[372,858,54,0],[300,852,50,0],[225,876,42,0],[150,925,28,0]],$=[[60,462,36,0],[38,436,38,0],[20,388,42,0],[4,340,47,0]],re=$a([[503,1010],[470,960],[425,890],[392,800],[340,728],[272,650],[185,560],[100,482],[38,436],[9,372],[0,331]],20);let Ge=0;re.forEach((M,b)=>{b&&(Ge+=Math.hypot(M[0]-re[b-1][0],M[1]-re[b-1][1])),M[2]=Ge,M[3]=0});const U=[338,742],G={d:0,side:1,a:0,b:0},ke=(M,b)=>{const j=M-U[0],Q=b-U[1],le=(j*we[0]+Q*we[1])/120,pe=(j*fe[0]+Q*fe[1])/215;return 1-A(.55,1.15,Math.sqrt(le*le+pe*pe)+.12*h.n2(M*.006+z,b*.006))},he=(M,b)=>{const j=M-Math.floor(M),Q=1-b;return j<Q?.5-.5*Math.cos(Math.PI*j/Q):1-(j-Q)/b},He=(M,b)=>{const j=M*Dt[0]+b*Dt[1],Q=M*fe[0]+b*fe[1],le=.3+.7*A(-.5,.6,h.n2(j*.0011+z,Q*8e-4+X)),pe=he(j/470+.5*h.n2(Q*.0016+X,j*6e-4)+.2,.3*le)*le,_e=.35+.65*le,qe=he((j*.94+Q*.34)/97+.6*h.n2(Q*.006,j*.003+z),.2*_e);return 92*pe+11*qe*_e},ue=(M,b,j,Q,le)=>(Yt(M,b,j,G),G.a-G.d*(G.side>0?Q:le)),Oe=(M,b,j)=>.5*(M+b+Math.sqrt((M-b)*(M-b)+j)),at=(M,b)=>{const j=M-Ft[0],Q=b-Ft[1],le=j*we[0]+Q*we[1],pe=j*fe[0]+Q*fe[1];return Math.abs(pe)<330&&le>-520&&le<560},Vt={d:0,side:1,a:0,b:0};let nt=NaN,Me=NaN;const R=(M,b)=>((M!==nt||b!==Me)&&(Yt(re,M,b,Vt),nt=M,Me=b),Vt),m=(M,b)=>{const j=Math.hypot(M,b);if(j<331)return O(M,b)-.35;let Q=400;at(M,b)&&(Q=R(M,b).d);const le=A(40,220,Q),pe=M+26*le*h.n2(M*.0035+X,b*.0035),_e=b+26*le*h.n2(M*.0035,b*.0035+z+9),qe=ke(M,b);let Ae=He(M,b)*A(50,260,Q)*(1-qe)*A(380,620,j);return Ae=Oe(Ae,ue(r,pe,_e,.5,.56),30),Ae=Oe(Ae,ue(p,pe,_e,.6,.2),14),Ae=Oe(Ae,ue($,M,b,.3,.3),20),Ae=ne(Ae,0,qe*(1-A(4,40,Ae))),j<372?ne(O(M,b)-.35,Ae,A(331,372,j)):Ae},Ze=re.map(M=>m(M[0],M[1]));re.forEach((M,b)=>{let j=0,Q=0;for(let le=-1;le<=1;le++){const pe=Ze[Fe(b+le,0,Ze.length-1)];j+=pe,Q++}M[3]=j/Q});const Ne=re[re.length-1][2];return nt=NaN,{height:(M,b)=>{const j=m(M,b);if(!at(M,b)||Math.hypot(M,b)<331)return j;const Q=R(M,b);return ne(Q.b,j,Math.max(A(5,46,Q.d),1-A(334,352,Math.hypot(M,b))))},natural:m,flatMask:ke,track:(M,b,j)=>{if(!at(M,b))return j.d=999,j;const Q=R(M,b);return j.d=Q.d*Q.side,j.a=Q.a,j},route2:re,sLen:Ne,massif:r,d0:p,summit:F,flatC:U}}const Ja=a=>(a=Fe(a,0,1),a*a*(3-2*a)),qt=[[0,14],[110,11],[250,15],[655,15],[745,0]],Pa=a=>{if(a<=qt[0][0])return qt[0][1];for(let s=0;s<qt.length-1;s++){const d=qt[s],h=qt[s+1];if(a<=h[0])return ne(d[1],h[1],Ja((a-d[0])/(h[0]-d[0])))}return 0},en=[[330,4.2],[314,7.5],[298,17],[280,22.5],[262,19.5],[244,16.5],[226,13],[208,10],[190,7.6]];function tn(a,s){const d=[],h=a.route2,O=s.anchors.heightAt;for(let z=0;z<h.length;z++){const X=h[z];if(X[1]<=345)continue;const E=h[Math.max(0,z-1)],u=h[Math.min(h.length-1,z+1)],r=Math.hypot(u[0]-E[0],u[1]-E[1])||1,F=Pa(X[2]);if(Math.abs(F)<.01){d.push(new _(X[0],X[3]+2.7,X[1]));continue}const p=X[0]-(u[1]-E[1])/r*F,$=X[1]+(u[0]-E[0])/r*F;let q=a.height(p,$);for(const re of[-9,9])q=Math.max(q,a.height(p+(u[0]-E[0])/r*re,$+(u[1]-E[1])/r*re)-.6);d.push(new _(p,q+2.7,$))}for(const z of en)d.push(new _(0,O(0,z[0])+z[1],z[0]));for(const z of s.anchors.flyThrough)if(z.z<180){const X=z.clone();X.y+=2.6*A(40,96,z.z),d.push(X)}return ja(d,{samples:420})}const an=`
vec3 sparkle(vec3 P, vec3 V, float dist){
  float lvl=log2(max(dist,2.)*.011); float fl=floor(lvl), fr=lvl-fl; vec3 acc=vec3(0.);
  vec3 Hh=normalize(uSun+V);
  for(int k=0;k<2;k++){
    float cs=exp2(fl+float(k)); vec2 g=P.xz/cs; vec2 id=floor(g); vec2 f=fract(g)-.5;
    vec3 h=h23(id+cs*17.31);
    float d=length(f-(h.xy-.5)*.6);
    vec3 fn=normalize(vec3((h.x-.5)*1.5+.28*sin(uTime*(1.+h.z*3.)+h.x*40.),1.,(h.z-.5)*1.5+.28*cos(uTime*(1.3+h.x*3.)+h.z*40.)));
    float g1=pow(max(dot(fn,Hh),0.),48.);
    float w=(k==0)?1.-fr:fr;
    vec3 hue=mix(vec3(1.),spectral(fract(h.z*5.+dot(V,fn)*3.)),.75);
    acc+=hue*g1*smoothstep(.2,.04,d)*w;
  }
  // looking up-sun the whole sand is the sun's glitter path: there the grains are thinned, so the ground keeps its form and colour
  return acc*7.*uSparkle*mix(1.,.26,smoothstep(.74,.9,Hh.y));
}`,ha=`
uniform float uSongT, uBandK; uniform vec4 uRing;
float songPer(vec2 p, float w){
  float r=length(p), a=0.;
  for(int k=0;k<3;k++){ float rr=(uSongT+3.5*float(k))*150.; float x=(r-rr)/w; a+=exp(-x*x)*max(0.,1.-rr/1500.)*smoothstep(0.,60.,rr); }
  return a;
}
float songRings(vec2 p, float w){
  float r2=length(p-uRing.xy); float x2=(r2-uRing.z)/w, x3=(r2-uRing.z*.62)/w;
  return songPer(p,w)+(exp(-x2*x2)+.6*exp(-x3*x3))*uRing.w;
}
// the scripted ring seen on the sand: the song made visible, three bands of the whole spectrum racing outward.
// Returns (coverage, hue 0..1 from the leading red edge to the trailing violet one)
vec2 songBand(vec2 p, float w){
  float r2=length(p-uRing.xy);
  float x1=(r2-uRing.z)/w, x2=(r2-uRing.z*.62)/w, x3=(r2-uRing.z*.36)/w;
  float c1=1.-smoothstep(1.,2.,abs(x1)), c2=(1.-smoothstep(1.,2.,abs(x2)))*.8, c3=(1.-smoothstep(1.,2.,abs(x3)))*.6;
  float c=max(c1,max(c2,c3)); float x=(c1>=c2&&c1>=c3)?x1:((c2>=c3)?x2:x3);
  return vec2(c*min(uRing.w,1.)*uBandK*smoothstep(4.,30.,r2),clamp(.5-x*.25,0.,1.));
}`,nn=`
attribute vec4 aD; attribute vec2 aT; varying vec3 vP; varying vec3 vN; varying vec4 vD; varying vec2 vT;
#include <fog_pars_vertex>
void main(){
  vP=position; vN=normal; vD=aD; vT=aT;
  vec4 mvPosition=modelViewMatrix*vec4(position,1.);
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,on=`
varying vec3 vP; varying vec3 vN; varying vec4 vD; varying vec2 vT;
uniform vec3 uSun, uSunCol, uAmb, uSand, uLav, uHaze;
uniform float uSparkle, uTime, uAval, uDrift, uTrailEnd, uFill;
uniform vec2 uWind;
uniform sampler2D uShadow; uniform vec4 uShA; uniform vec3 uShC;
uniform vec4 uMono[7]; uniform vec4 uMonoB[7]; uniform vec3 uBeast[16];
uniform vec4 uSpire[8]; uniform vec4 uSpireB[8]; uniform float uFanOn;          // crystal spires beside the climb: (x, z, fan dir) and (reach, tan half angle, -, strength)
#include <fog_pars_fragment>
${_t}
${an}
${ha}
float monoShadow(vec3 P){
  float sh=1.; float lxz=max(length(uSun.xz),1e-4); vec2 u=uSun.xz/lxz; float tanE=uSun.y/lxz;
  float fw=fwidth(dot(P.xz,vec2(-u.y,u.x)));
  for(int i=0;i<7;i++){
    vec2 e=P.xz-uMono[i].xy; float tt=dot(e,u); float perp=dot(e,vec2(-u.y,u.x));
    float hg=P.y-tt*tanE-uMonoB[i].x; float H=uMono[i].z;
    float rad=(hg<uMonoB[i].y?uMonoB[i].z:uMono[i].w)*(1.-.94*smoothstep(H*.86,H,hg));
    float d=max(abs(perp)-rad,(hg-H)*.6); d=max(d,tt+rad*.3);
    float w=.3+fw*1.2; sh=min(sh,smoothstep(-w,w,d));
  }
  return sh;
}
// cracked hardpan: jittered polygon plates. Returns (distance to the nearest edge, cell id, edge id)
vec3 plates(vec2 p){
  vec2 id=floor(p), f=fract(p); float d1=9., d2=9.; float c1=0., c2=0.;
  for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){
    vec2 o=vec2(float(i),float(j)); vec3 h=h23(id+o); float d=length(o+h.xy*.86+.07-f);
    if(d<d1){ d2=d1; c2=c1; d1=d; c1=h.z; } else if(d<d2){ d2=d; c2=h.z; }
  }
  return vec3(d2-d1,c1,fract((c1+c2)*7.13));
}
void main(){
  vec3 P=vP; float dist=length(cameraPosition-P); vec3 V=(cameraPosition-P)/max(dist,1e-3);
  vec3 Ng=normalize(vN); vec3 N=Ng; float fm=vD.z;
  // the dune shadow field: a signed texture over the patch near the route (re-thresholded here for a razor edge),
  // the per-vertex field beyond it. All derivatives are taken here, before any loop.
  vec2 sq=P.xz-uShC.xy; vec2 suv=vec2(dot(sq,uShA.xy),dot(sq,uShA.zw))*uShC.z+.5;
  vec2 sb=abs(suv-.5); float inT=1.-smoothstep(.45,.495,max(sb.x,sb.y));
  float sfar=smoothstep(60.,300.,dist);
  float rimK=1.-smoothstep(335.,420.,length(P.xz));          // the hanging valley and the rim stay in the sun: only deep shadow survives there, as a clean shape
  // read two to three mips down, and ask for a deeper shadow the further away it is: shallow shadow islands dissolve
  // (no mottled faces on the far dunes), only the big slip-face shapes stay
  float se=(texture2D(uShadow,suv,1.9+1.3*sfar).r-.5)*2.-.03-.3*sfar-1.4*rimK;
  float sfw=fwidth(se)*.9+.003; float shT=1.-smoothstep(-sfw,sfw,se);
  float vw=fwidth(vD.y)*1.1+.012; float shV=1.-smoothstep(-vw,vw,vD.y);
  float sh=mix(mix(shV,1.,rimK),shT,inT);
  vec2 wp=vec2(dot(P.xz,uWind),dot(P.xz,vec2(uWind.y,-uWind.x)));
  // wind ripples: in patches, and gone before their wavelength reaches a few pixels (no moire stripes on far slopes)
  float ra=wp.x*1.9+vn(wp*.07)*9.+vn(wp*.4)*2., rb=wp.x*.42+vn(wp*.021)*8.;
  float fa=1.-smoothstep(.5,1.5,fwidth(ra)), fb=1.-smoothstep(.5,1.5,fwidth(rb));
  float rpat=smoothstep(.34,.62,vn(P.xz*.013+3.7));
  float rc=wp.x*12.+vn(wp*.55)*5.+vn(wp*.1)*8.; float fc=(1.-smoothstep(.3,1.1,fwidth(rc)))*(.3+.7*rpat)*(1.-fm);          // hand-width ripples, only near the eye
  N=normalize(N+(vec3(uWind.x,0.,uWind.y)*(sin(rc)*.2*fc+sin(ra)*.12*fa*rpat+sin(rb)*.05*fb*(.35+.65*rpat))+vec3(vn(P.xz*.045)-.5,0.,vn(P.xz*.045+7.3)-.5)*.08)*(1.-fm*.85));
  sh=min(sh,monoShadow(P));
  sh=min(sh,smoothstep(.0,.09,dot(Ng,uSun)));               // a face turned from the sun is in shade, whatever the bake says
  // the caravan's shadows: each beast throws a long blue-black shape (legs, barrel, neck, mirror) down-sun
  { float lxz=max(length(uSun.xz),1e-4); vec2 sd=-uSun.xz/lxz; float sl=9.6*lxz/max(uSun.y,.2); float bs=0.;
    float bw=fwidth(P.x)+fwidth(P.z);
    for(int i=0;i<16;i++){
      vec2 e=P.xz-uBeast[i].xy; float tt=clamp(dot(e,sd)/sl,0.,1.); float d=length(e-sd*(tt*sl));
      float x1=(tt-.52)/.17, x2=(tt-.97)/.07;
      float rad=.4+1.25*exp(-x1*x1)+1.1*exp(-x2*x2);
      bs=max(bs,(1.-smoothstep(rad-.12-bw,rad+.12+bw,d))*uBeast[i].z);
    }
    sh*=1.-.92*bs; }
  float ndl=min(pow(max(dot(N,uSun),0.),1.15)*.86,1.);
  vec3 alb=mix(uSand,uLav,clamp(vn(P.xz*.011)*.5+(1.-N.y)*1.6-.2,0.,1.)*.7);
  if(fm>.01){
    float nf=1.-smoothstep(60.,260.,dist);
    vec2 hq=P.xz+vec2(vn(P.xz*.09),vn(P.xz*.09+5.3))*3.2+vec2(vn(P.xz*.41+1.7),vn(P.xz*.41+9.1))*1.3;
    vec2 su=normalize(uSun.xz+vec2(1e-4));
    // three scales: master cracks ~4.5 m apart, plates ~1.5 m (four in ten of their edges healed), hairlines near the eye
    vec3 p1=plates(hq*.22), p1s=plates((hq+su*.3)*.22), pm=plates(hq*.66+4.3), p2=plates(hq*2.1+11.);
    float nz=vn(P.xz*.31+2.), lw=dist*.0011;
    float w1=(.01+.05*nz*nz+lw)*.6;
    float keep=mix(.3,1.,step(.25,p1.z))*(.5+.5*vn(P.xz*.8));
    float crack=(1.-smoothstep(0.,w1,p1.x))*keep;
    float wm=.012+.03*nz+lw*1.6;
    crack=max(crack,(1.-smoothstep(0.,wm,pm.x))*step(.4,pm.z)*(.3+.5*vn(P.xz*1.3+3.))*(1.-smoothstep(70.,200.,dist)));
    float fine=(1.-smoothstep(0.,.03+lw*3.,p2.x))*.38*step(.3,p2.z)*(1.-smoothstep(18.,80.,dist));
    float rim=smoothstep(w1*5.+.08,w1,p1.x)*keep*nf;                        // curled plate edges
    float side=clamp((p1s.x-p1.x)*9.,-1.,1.);                              // +: this lip faces the sun
    vec3 hp=uLav*(.7+.13*p1.y+.1*pm.y+.12*vn(P.xz*.6)-.1*vn(P.xz*.02));
    hp*=1.+rim*max(side,0.)*.55;
    hp=mix(hp,uSand*1.15,rim*max(-side,0.)*(.35+.65*vn(P.xz*7.))*.7);       // frost fur on the shaded lip
    hp*=1.-(.78*crack+fine)*nf;
    alb=mix(alb,hp,fm);
  }
  // the caravan's trampled trail and an older pair of runner grooves, up to the rim
  float lat=abs(vT.x), tr=step(vT.y,uTrailEnd)*(1.-smoothstep(60.,220.,dist));
  float row=smoothstep(2.1,.5,abs(lat-7.2));
  float pr=smoothstep(.55,.32,length(vec2((fract(vT.y/2.7+step(0.,vT.x)*.5+h11(floor(vT.y/2.7))*.2)-.5)*2.7,(lat-7.2)+(h11(floor(vT.y/2.7)+7.)-.5)*2.4)));
  float gro=smoothstep(.22,.05,abs(lat-1.25));
  alb*=1.-tr*(.5*row*pr+.22*gro+.06*smoothstep(10.,5.,lat));
  // blue-black shadow: sky fill from above, a breath of light bounced off the lit sand on steep faces
  vec3 Bd=normalize(vec3(-uSun.x,.4,-uSun.z)+vec3(0.,1e-4,0.));
  float bnc=max(dot(N,Bd),0.);
  vec3 fill=(mix(uAmb,vec3(dot(uAmb,vec3(.3333))),.22)*(1.2+.9*N.y)+uHaze*.012)*uFill+uSand*uSunCol*(.05*clamp(1.-Ng.y,0.,.3)*3.3+vec3(.6,.68,1.)*(.05*bnc*bnc+.035*bnc));
  fill*=1.+(sin(ra)*.1*fa*rpat+sin(rb)*.07*fb)*(1.-fm)*(1.-smoothstep(40.,170.,dist));          // wind ripples stay readable in the near shade, and are gone before they can band
  // the spires' fans: wedges of spectral light that replace the sunlight, each leaving a blade of shadow at its root
  vec3 spf=vec3(0.); float spc=0., sps=1.;
  for(int i=0;i<8;i++){
    vec2 e=P.xz-uSpire[i].xy, d=uSpire[i].zw; float s=dot(e,d), w=dot(e,vec2(d.y,-d.x)); float rch=uSpireB[i].x, sn=s/rch;
    float t=w/(max(s,1.)*uSpireB[i].y);
    float c=smoothstep(1.,.78,abs(t))*smoothstep(.06,.2,sn)*(1.-smoothstep(.5,1.,sn))*uSpireB[i].w;
    spf+=spectral(t*.5+.5)*c; spc+=c;
    sps=min(sps,smoothstep(.8,2.2,length(e-d*clamp(s,0.,rch*.15)))+1.-uSpireB[i].w);
  }
  spf/=max(spc,1.); float cv=min(spc,1.)*uFanOn*.94;
  ndl*=1.+.16*sin(ra)*fa*rpat*(1.-fm)*(1.-smoothstep(30.,110.,dist));          // the near ripples read in full sun too
  vec3 light=(uSunCol*ndl*sh*min(sps,1.)*(1.-cv)+fill)*(1.-.2*fc*(.5-.5*sin(rc)));          // their troughs hold a little shade
  light+=spf*cv*length(uSunCol)*.56*(.45+.55*sh);
  vec3 col=alb*light;
  float ring=songPer(P.xz,9.);
  col+=alb*ring*.42*(.6+ndl*sh)*length(uSunCol+uAmb);
  vec2 bnd=songBand(P.xz,11.);
  col=mix(col,alb*spectral(bnd.y)*(.5+.75*ndl*sh)*max(length(uSunCol)*.62,.8),bnd.x*.82);
  ring+=bnd.x*.3;
  // grains saltating down the wind
  float st=vn(vec2(wp.y*.11,wp.x*.016-uTime*.6))*vn(vec2(wp.y*.023+3.,wp.x*.006-uTime*.23));
  st=smoothstep(.3,.66,st)*(1.-fm*.4)*(1.-smoothstep(260.,900.,dist));
  // near the eye the drifting sheet breaks into streamers of grains (a flat sheet only whites the sand out), and it
  // thins where the song's colours lie
  float snear=1.-smoothstep(12.,75.,dist);
  st*=mix(1.,smoothstep(.34,.8,vn(vec2(wp.y*1.9,wp.x*.13-uTime*1.9)))*1.1,snear)*(1.-.75*bnd.x);
  col+=alb*st*mix(uDrift,min(uDrift,.5),snear)*(.2+ndl*sh)*uSunCol;
  // the slip face letting go in sheets
  float av=vD.w*uAval;
  float a1=vn(vec2(dot(P.xz,vec2(.86,-.5))*.16,P.y*.3+uTime*2.6))*vn(vec2(dot(P.xz,vec2(.86,-.5))*.05,P.y*.08+uTime*1.1));
  float sheet=smoothstep(.2,.5,a1)*av;
  col+=alb*sheet*(.15+ndl*sh*.45)*uSunCol;
  col+=sparkle(P,V,dist)*mix(1.,.3,smoothstep(250.,900.,dist))*uSunCol*(sh*.6+.4)*(1.+ring*4.+sheet*3.+st*uDrift*1.5);
  col=mix(col,fogColor,vD.x);
  gl_FragColor=vec4(col,1.);
  #include <fog_fragment>
}`,sn=`
attribute vec3 color; attribute vec4 aK;
#ifdef USE_INSTANCING
attribute vec4 aI;
#endif
uniform float uTime;
varying vec3 vWP; varying vec3 vWN; varying vec3 vCol; varying vec3 vK; varying float vG;
#include <fog_pars_vertex>
${ha}
void main(){
  vec3 p=position, n=normal; vec4 inst=vec4(0.); mat4 M=modelMatrix; float flash=0.; vG=9.;
  #ifdef USE_INSTANCING
    inst=aI; M=modelMatrix*instanceMatrix;
  #endif
  #if MODE == 1
    if(aK.y>.5&&aK.y<4.5){                       // legs swing from the hip; the shank folds at the knee on the forward swing
      float lp=inst.x+aK.y*1.5708+step(2.5,aK.y)*.8;
      float a=sin(lp)*.5*inst.z;
      float kn=aK.z*.53, kb=max(sin(lp+1.1),0.)*.8*inst.z*smoothstep(kn+.1,kn-.5,p.y);
      vec2 qk=vec2(p.y-kn,p.z-aK.w); float ck=cos(kb), sk=sin(kb);
      p.y=kn+qk.x*ck+qk.y*sk; p.z=aK.w-qk.x*sk+qk.y*ck;
      vec2 q=vec2(p.y-aK.z,p.z-aK.w); float c=cos(a), s=sin(a);
      p.y=aK.z+q.x*c-q.y*s; p.z=aK.w+q.x*s+q.y*c; n.yz=vec2(n.y*c-n.z*s,n.y*s+n.z*c);
    } else if(aK.y<5.5&&aK.y>4.5){               // neck and head nod
      float k=max(p.y-aK.z,0.); p.y+=sin(inst.x*2.+.6)*.07*k*inst.z; p.z+=cos(inst.x*2.)*.06*k*inst.z;
    } else if(aK.y<6.5&&aK.y>5.5){               // the mirror rocks about its centre once per bound: the horizon slides across it
      float a=sin(inst.x)*.2*inst.z+.05*sin(uTime*1.3+inst.w*9.);
      vG=(p.y-aK.z)/1.6-sin(inst.x)*1.25*inst.z-sin(uTime*1.3+inst.w*9.)*1.4*(1.-inst.z);               // where the sun's glint lies on the glass: it sweeps the panel as the mirror rocks
      vec2 q=vec2(p.y-aK.z,p.z-aK.w); float c=cos(a), s=sin(a);
      p.y=aK.z+q.x*c-q.y*s; p.z=aK.w+q.x*s+q.y*c; n.yz=vec2(n.y*c-n.z*s,n.y*s+n.z*c);
    } else if(aK.y>6.5){                          // fringe and tail swing
      float k=max(aK.z-p.y,0.); p.x+=sin(inst.x*2.+p.z*2.3)*.13*k; p.z+=(.22+.2*cos(inst.x*2.+p.z*3.))*k*inst.z;
    }
    flash=inst.y;
  #endif
  #if MODE == 0
    if(aK.x>3.5) flash=clamp(songRings(M[3].xz,18.),0.,1.)*.4;          // spires ring like struck glass as the song passes
  #endif
  #if MODE == 2
    vec3 ip=M[3].xyz;                             // blades track the sun and flash in a wave across the flat
    float ph=uTime*1.5708-dot(ip.xz,vec2(.6,.8))*.035-aK.y*.37;
    flash=pow(max(sin(ph),0.),24.)+songRings(ip.xz,16.)*.5;
    float a=.1*sin(ph-.6); float c=cos(a), s=sin(a);
    p.xz=vec2(p.x*c-p.z*s,p.x*s+p.z*c); n.xz=vec2(n.x*c-n.z*s,n.x*s+n.z*c);
  #endif
  vec4 wp=M*vec4(p,1.); vWP=wp.xyz; vWN=normalize(mat3(M)*n); vCol=color; vK=vec3(aK.x,flash,inst.w+aK.y*.13);
  vec4 mvPosition=viewMatrix*wp;
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,rn=`
varying vec3 vWP; varying vec3 vWN; varying vec3 vCol; varying vec3 vK; varying float vG;
uniform vec3 uSun, uSunCol, uAmb, uSand, uSky, uHaze; uniform float uEcl, uFlash, uPrism;
#include <fog_pars_fragment>
${_t}
void main(){
  vec3 N=normalize(vWN); if(!gl_FrontFacing) N=-N;
  vec3 V=normalize(cameraPosition-vWP);
  float ndl=max(dot(N,uSun),0.);
  vec3 bounce=uSand*uSunCol*.2*clamp(.5-N.y*.5,0.,1.);
  float wr=max(dot(N,uSun)*.5+.5,0.);
  vec3 col=vCol*(uSunCol*(ndl*.85+wr*wr*.2)+mix(uAmb,vec3(dot(uAmb,vec3(.3333))),.4)*(.9+.5*N.y)+bounce*1.9);
  float nv=max(dot(N,V),0.);
  // back-lit rim: a white edge on every silhouette that stands between us and the sun
  col+=(vCol*.6+.25)*uSunCol*pow(1.-nv,2.5)*(.2+1.1*pow(max(dot(-V,uSun)*.5+.5,0.),2.))*step(vK.x,.5);
  if(vK.x>.5){
    float F=.06+.94*pow(max(1.-nv,0.),4.);
    vec3 R=reflect(-V,N); float rs=max(dot(R,uSun),0.);
    vec3 env=mix(uSand*uSunCol*.5,uSky+uHaze*.3*(1.-abs(R.y)),smoothstep(-.05,.08,R.y));
    if(vK.x<1.5){
      float back=pow(max(dot(-V,uSun),0.),3.);
      // white and lavender glass; hue only as a narrow glint near the mirror angle
      col=vCol*(uAmb*.7+uSunCol*(ndl*.42+back*.3))*(1.-F)+env*F;
      col+=uSunCol*(pow(rs,260.)*10.+pow(rs,26.)*.2+back*.16*(1.-nv));
      col+=spectral(fract(vK.z*7.+rs*2.2))*uSunCol*pow(rs,9.)*.55*(1.-pow(rs,60.));
      col+=uSunCol*vK.y*1.7; col=min(col,vec3(3.));
    } else if(vK.x<2.5){
      // a true mirror: black sky above, the haze band on the horizon, sunlit sand and dune shadows below, and the sun itself
      vec3 gnd=uSand*uSunCol*(.5+.25*smoothstep(0.,-.5,R.y))+uAmb*.3;
      vec3 skyc=uSky+uHaze*exp(-abs(R.y)*9.)*1.5;
      col=mix(gnd,skyc,smoothstep(-.012,.012,R.y))*.5*vCol+uSunCol*(smoothstep(.992,.999,rs)*9.+pow(rs,60.)*.6+pow(rs,7.)*.12+vK.y*uFlash+exp(-vG*vG*30.)*(2.8+2.*vn(vWP.xy*3.)));
    } else if(vK.x<3.5) col=vCol*(uSunCol*1.5+uAmb);
    else {
      // prism glass: every facet sends a different part of the spectrum to the eye, brightest against the sun
      float back=max(dot(-V,uSun),0.); back*=back;
      vec3 sp=spectral(fract(vCol.r+vK.z*3.1+dot(N,V)*1.9+dot(N,uSun)*1.3+vWP.y*.03));
      sp=mix(sp,vec3(1.),.22+.7*smoothstep(110.,380.,length(cameraPosition-vWP)));          // far off they are white glints, not confetti
      float lum=length(uSunCol)*.58, f1=1.-nv;
      col=uSky*.6+env*F*.5+sp*lum*(.16+.5*ndl+.75*back*(1.-.5*nv))+uSunCol*(pow(rs,90.)*5.+f1*f1*f1*.8+back*.14);
      col+=(sp*.65+.35)*lum*vK.y*uPrism;
    }
  }
  col+=uHaze*uEcl*(.05+.55*pow(1.-max(dot(N,V),0.),2.5));          // totality: a cold rim so silhouettes read
  gl_FragColor=vec4(col,1.);
  #include <fog_fragment>
}`,ln=`
attribute vec4 aF; attribute vec2 aG; varying vec2 vF; varying float vS; varying vec3 vP;
#include <fog_pars_vertex>
void main(){
  float s=position.y, w=position.x; vec2 d=vec2(sin(aF.z),cos(aF.z));
  vec2 q=aF.xy+d*(s*aF.w)+vec2(d.y,-d.x)*(w*s*aF.w*aG.x);
  vF=vec2(w,s); vS=aG.y; vP=vec3(q.x,.16,q.y);
  vec4 mvPosition=viewMatrix*vec4(vP,1.);
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,cn=`
varying vec2 vF; varying float vS; varying vec3 vP; uniform vec3 uLav, uSunCol; uniform float uFanOn, uTime;
#include <fog_pars_fragment>
${_t}
void main(){
  float t=vF.x+.05*sin(vF.y*9.-uTime*.7);
  float edge=smoothstep(1.,.86,abs(t)), along=smoothstep(.04,.16,vF.y)*(1.-smoothstep(.55,1.,vF.y));
  float a=edge*along*vS*uFanOn;
  vec3 col=uLav*(.75+.25*vn(vP.xz*.6))*spectral(t*.5+.5)*1.25*max(length(uSunCol)*.6,.35);
  gl_FragColor=vec4(col,a*.93);
  #include <fog_fragment>
}`,un=`
attribute vec4 aR; uniform float uTime; varying vec2 vUv; varying float vA;
#include <fog_pars_vertex>
${ha}
void main(){
  vec3 base=vec3(aR.x,0.,aR.y); float dist=length(cameraPosition-base);
  float amp=clamp(songRings(base.xz,22.),0.,1.);
  float wid=max(.022,dist*.0014)*(1.+amp*5.);
  vec2 side=normalize(vec2(cameraPosition.z-base.z,-(cameraPosition.x-base.x))+1e-5);
  float y=position.y;
  vec3 p=base+vec3(side.x,0.,side.y)*(position.x*wid+sin(uTime*63.+aR.w*40.)*.07*amp*y)+vec3(0.,y*aR.z,0.);
  p.xz+=vec2(.6,.8)*sin(uTime*.9+aR.w*6.283)*.012*y*y;
  vUv=vec2(position.x*2.,y); vA=(1./(1.+amp*4.))*min(1.,90./dist+.15)*(.022/max(.022,dist*.0014)*.8+.12);
  vec4 mvPosition=viewMatrix*vec4(p,1.);
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,fn=`
varying vec2 vUv; varying float vA; uniform vec3 uSunCol, uAmb;
#include <fog_pars_fragment>
void main(){
  float a=(1.-vUv.x*vUv.x)*smoothstep(1.,.8,vUv.y)*vA;
  vec3 col=(uSunCol*.85+uAmb)*(.55+.6*vUv.y);
  gl_FragColor=vec4(col,clamp(a,0.,1.)*.85);
  #include <fog_fragment>
}`,hn=`
uniform vec3 uDir; uniform float uSize; varying vec2 vUv;
void main(){
  vUv=position.xy*2.;
  vec4 c=viewMatrix*vec4(cameraPosition+uDir*900.,1.); c.xy+=position.xy*uSize*900.;
  gl_Position=projectionMatrix*c;
}`,dn=`
varying vec2 vUv; uniform float uI, uMoon; uniform vec2 uMoonAt; uniform vec3 uCol;
void main(){
  float d=length(vUv); float g=exp(-d*d*420.)*5.+exp(-d*9.)*.14;
  for(int k=0;k<3;k++){ float a=float(k)*1.0472+.5236; vec2 n=vec2(-sin(a),cos(a)); g+=exp(-abs(dot(vUv,n))*150.)*exp(-d*5.5)*1.6; }
  g*=smoothstep(1.,.5,d)*uI;
  float md=length(vUv-uMoonAt); float disc=smoothstep(.06,.052,md);
  vec2 mq=vUv-uMoonAt; float an=atan(mq.y,mq.x+1e-5);
  float streams=.62+.38*cos(an*2.-.6)+.22*cos(an*5.+1.);          // totality: a pearl corona with long equatorial streamers
  float corona=(exp(-max(md-.055,0.)*14.)*2.4+exp(-max(md-.055,0.)*5.5)*1.5*streams+exp(-md*3.2)*.35)*uMoon*(1.-uI);
  gl_FragColor=vec4(uCol*(g*(1.-disc*uMoon)+corona*(1.-disc)),1.);
}`,vn=`
attribute vec4 aS; attribute vec2 aW; uniform vec3 uSun; uniform vec2 uWind; varying vec2 vUv; varying float vSeed; varying float vFwd;
void main(){
  vec3 base=aS.xyz; vec3 toC=cameraPosition-base;
  vec2 side=normalize(vec2(toC.z,-toC.x)+vec2(1e-5));
  vec3 p=base+vec3(side.x,0.,side.y)*(position.x*aW.x)+vec3(0.,position.y*aW.y-2.,0.);
  p.xz+=uWind*(position.y*aW.y*1.6);
  vUv=vec2(position.x*2.,position.y); vSeed=aS.w;
  vec3 V=normalize(p-cameraPosition); float f=max(dot(V,uSun),0.); vFwd=.22+1.5*f*f*f;
  gl_Position=projectionMatrix*viewMatrix*vec4(p,1.);
}`,pn=`
varying vec2 vUv; varying float vSeed; varying float vFwd; uniform vec3 uSunCol, uAmb; uniform float uTime, uStream;
${_t}
void main(){
  float n=vn(vec2(vUv.x*1.3+vSeed*37.,vUv.y*1.6-uTime*.7+vSeed*11.)), n2=vn(vec2(vUv.x*9.+vSeed*5.+vUv.y*3.,vUv.y*5.-uTime*2.2));
  float e=max(1.-vUv.x*vUv.x,0.), up=max(1.-vUv.y,0.);
  float a=e*e*smoothstep(0.,.07,vUv.y)*up*up*up*(.3+.7*n)*(.55+.6*n2)*.75;
  gl_FragColor=vec4((uSunCol*vFwd+uAmb*.5)*a*uStream,1.);
}`,mn=`
attribute vec3 aUv; varying vec3 vUv; varying vec3 vWP;
void main(){ vUv=aUv; vWP=position; gl_Position=projectionMatrix*viewMatrix*vec4(position,1.); }`,gn=`
varying vec3 vUv; varying vec3 vWP; uniform vec3 uSunCol, uAmb; uniform float uTime, uSpray;
${_t}
void main(){
  float x=vUv.x, y=vUv.y, sd=vUv.z*17.;
  float env=smoothstep(0.,.3,x)*smoothstep(0.,.06,y)*(1.-y)*(1.-smoothstep(.8,1.,x)*.7);
  vec3 acc=vec3(0.);
  for(int k=0;k<2;k++){
    float fk=float(k); vec2 g=vec2(x*(70.+50.*fk)+uTime*(16.+9.*fk)+sd,y*(22.+14.*fk)-x*(9.+6.*fk)+fk*3.7); vec2 id=floor(g); vec2 f=fract(g)-.5; vec3 h=h23(id+sd+fk*31.);
    float pt=smoothstep(.3,.06,length(f-(h.xy-.5)*.5))*step(.62,h.z);
    float tw=.35+.65*sin(uTime*(9.+h.x*13.)+h.y*40.);
    acc+=mix(vec3(1.),spectral(h.x),.6*step(.82,h.z))*pt*max(tw,0.);
  }
  float mist=vn(vec2(x*7.+uTime*4.+sd,y*4.));
  vec3 col=(uSunCol+uAmb)*(acc*2.6+mist*mist*.07)*env*uSpray;
  gl_FragColor=vec4(col,1.);
}`,wn=`
varying vec2 vUv;
void main(){
  vec3 base=vec3(0.,15.5,-1.5); vec3 toC=cameraPosition-base; float dist=length(toC);
  vec2 side=normalize(vec2(toC.z,-toC.x)+vec2(1e-5));
  vec3 p=base+vec3(side.x,0.,side.y)*(position.x*max(9.,dist*.03))+vec3(0.,position.y*125.,0.);
  vUv=vec2(position.x*2.,position.y);
  gl_Position=projectionMatrix*viewMatrix*vec4(p,1.);
}`,yn=`
varying vec2 vUv; uniform float uTime, uReveal, uFanOn;
void main(){
  float x=vUv.x, up=max(1.-vUv.y,0.);
  float a=(exp(-x*x*90.)*1.3+exp(-x*x*9.)*.2)*smoothstep(0.,.05,vUv.y)*up*sqrt(up)*(.86+.14*sin(uTime*2.3-vUv.y*26.));
  gl_FragColor=vec4(vec3(.93,.92,1.)*a*1.4*smoothstep(.5,1.,uReveal)*uFanOn,1.);
}`,ve="#efece4",be="#0c0c16",Ke="#b9b3c9",wt="#6f6b88",xn=new _(0,1,0),W=(a,s,d,h=0,O=0,z=0,X=1,E=X,u=X)=>new n.Matrix4().compose(new _(a,s,d),new n.Quaternion().setFromEuler(new n.Euler(h,O,z)),new _(X,E,u)),Xe=(a,s,d)=>{const h=s.clone().normalize();return new n.Matrix4().compose(a.clone().addScaledVector(h,d/2),new n.Quaternion().setFromUnitVectors(xn,h),new _(1,1,1))},it=()=>({p:[],n:[],c:[],k:[]});function P(a,s,d,h,O=0,z=0,X=0,E=0,u=!1){const r=s.index?s.toNonIndexed():s;r.applyMatrix4(d),u&&r.computeVertexNormals();const F=r.attributes.position.array,p=r.attributes.normal.array,$=new n.Color(h);for(let q=0;q<F.length;q+=3)a.p.push(F[q],F[q+1],F[q+2]),a.n.push(p[q],p[q+1],p[q+2]),a.c.push($.r,$.g,$.b),a.k.push(O,z,X,E);r.dispose(),r!==s&&s.dispose()}function rt(a){const s=new n.BufferGeometry;return s.setAttribute("position",new n.Float32BufferAttribute(a.p,3)),s.setAttribute("normal",new n.Float32BufferAttribute(a.n,3)),s.setAttribute("color",new n.Float32BufferAttribute(a.c,3)),s.setAttribute("aK",new n.Float32BufferAttribute(a.k,4)),s}const tt=(a=10,s=7)=>new n.SphereGeometry(1,a,s),Bt=(a,s,d)=>new n.CylinderGeometry(a,s,d,6);async function zn(a){const s=it(),d=(u,r,F,p=6,$=1)=>new n.CylinderGeometry(u,r,F,p,$,!0),h=[[.02,3.15],[.34,3.02],[.8,2.62],[1.14,2.05],[1.33,1.4],[1.27,.7],[1.1,.1],[1.12,-.5],[1.3,-1.1],[1.46,-1.7],[1.3,-2.3],[.95,-2.75],[.5,-3.02],[.02,-3.15]];P(s,new n.LatheGeometry(h.map(u=>new n.Vector2(u[0],u[1])),20),W(0,5.1,0,Math.PI/2,0,0,1,1,1.12),Ke);const O=u=>{for(let r=0;r<h.length-1;r++)if(u<=h[r][1]&&u>=h[r+1][1])return ne(h[r][0],h[r+1][0],(h[r][1]-u)/(h[r][1]-h[r+1][1]));return 1};for(let u=0;u<5;u++){const r=-.75+u*.44;P(s,new n.CylinderGeometry(O(r+.22)+.07,O(r-.22)+.07,.44,10,1,!0,Math.PI-2.5,5),W(0,5.1,r,Math.PI/2,0,0,1,1,1.12),u%2?be:ve)}await a();for(const u of[-1,1]){for(let r=0;r<12;r++)P(s,new n.PlaneGeometry(.13,.7+.28*(r%2)),W(u*.82,3.72-.14*(r%2),-.92+r*.2,0,Math.PI/2,0),r%2?ve:be,0,7,4.1,0);P(s,new n.CylinderGeometry(.46,.46,1.5,8),W(u*1.52,5.3,.45,Math.PI/2,0,0),u>0?ve:wt);for(const r of[-.42,.42])P(s,d(.49,.49,.13,8),W(u*1.52,5.3,.45+r,Math.PI/2,0,0),be);P(s,d(.05,.06,2,4),Xe(new _(u*.95,6,-.2),new _(-u*.95,1.5,1),2),be),P(s,d(.05,.06,2,4),Xe(new _(u*.95,6,1.6),new _(-u*.95,1.5,-.8),2),be),P(s,new n.ConeGeometry(.07,.6,4),W(u*.2,9.98,-4.55,.5,0,u*-.3),ve,0,5,5.9,0)}P(s,d(.04,.04,2.9,4),W(0,7.45,.95,0,0,Math.PI/2),be);const z=(u,r,F,p,$)=>P(s,new n.CylinderGeometry(.17,.02,p,6,1,!0),W(u,r-p/2,F),new n.Color($,1,1),4,7,r,0,!0);[-1.35,-.85,-.38,.38,.85,1.35].forEach((u,r)=>z(u,7.45,.95,.75+.3*(r*3%2)+.12*(r%3),r*.17)),z(-1.02,6.05,1.75,.95,.55),z(1.02,6.05,1.75,.95,.08),await a();const X=[[5.9,-2.1],[6.75,-2.95],[7.6,-3.42],[8.4,-3.62],[9.05,-3.78],[9.5,-4.12],[9.66,-4.5]];for(let u=0;u<6;u++){const r=new _(0,X[u][0],X[u][1]),F=new _(0,X[u+1][0],X[u+1][1]),p=F.clone().sub(r),$=p.length()+.12;P(s,d(ne(.66,.27,(u+1)/6),ne(.66,.27,u/6)*(u?1:1.25),$,7),Xe(r,p,$),Ke,0,5,5.9,0)}P(s,tt(8,6),W(0,9.6,-4.95,.22,0,0,.36,.34,.82),Ke,0,5,5.9,0),P(s,tt(6,4),W(0,9.44,-5.62,0,0,0,.2,.17,.2),be,0,5,5.9,0),await a();for(const[u,r,F]of[[-1,-1,1],[1,-1,2],[-1,1,4],[1,1,3]]){const p=r*1.62,$=new _(u*.82,4.75,p),q=new _(u*.86,2.5,p-.22*r),re=new _(u*.86,.22,p+.05);P(s,tt(8,6),W(u*.74,4.95,p,0,0,0,.62,1,.86),Ke),P(s,tt(6,5),W(u*.84,4.15,p-.05*r,0,0,0,.44,.95,.58),Ke,0,F,4.75,p),P(s,d(.2,.42,2.3,8),Xe($,q.clone().sub($),2.3),wt,0,F,4.75,p),P(s,tt(6,4),W(u*.86,2.5,p-.22*r,0,0,0,.26,.3,.3),wt,0,F,4.75,p),P(s,d(.12,.2,2.34,8,2),Xe(q,re.clone().sub(q),2.34),wt,0,F,4.75,p),P(s,d(.17,.27,.42,6),W(u*.86,.52,p+.03),ve,0,F,4.75,p),P(s,tt(6,4),W(u*.86,.17,p-.08,0,0,0,.32,.18,.42),be,0,F,4.75,p)}await a(),P(s,new n.ConeGeometry(.13,2.3,5),W(0,4.35,3.25,-.35,0,0),wt,0,7,5.4,0),P(s,d(.07,.08,2.6,5),W(0,8.1,.95),be);const E=(u,r,F)=>{const p=new n.CircleGeometry(u,6),$=p.attributes.normal,q=p.attributes.position;for(let re=0;re<$.count;re++){const Ge=new _(q.getX(re)*.1,q.getY(re)*.17,1).normalize();$.setXYZ(re,Ge.x,Ge.y,Ge.z)}P(s,p,W(0,9.6,r,.1,.42,0),F,2,6,9.6,1)};return E(1.55,1.08,ve),E(1.74,1.04,"#55536a"),P(s,new n.CylinderGeometry(1.96,1.96,.1,6,1,!1,Math.PI/6),W(-.02,9.6,.94,.1,.42,0).multiply(new n.Matrix4().makeRotationX(Math.PI/2)),be,0,6,9.6,1),rt(s)}function bn(a){const s=it();P(s,tt(12,8),W(0,1.9,0,0,0,0,2.3,1.15,3.5),wt),P(s,tt(8,6),W(0,2.1,-4.1,0,0,0,.7,.6,1.05),Ke,0,5,1.4,0);for(const[d,h,O]of[[-1,-1,1],[1,-1,2],[-1,1,4],[1,1,3]])P(s,new n.CylinderGeometry(.62,.5,2,7),W(d*1.75,1,h*2.1),be,0,O,2,h*2.1);P(s,Bt(.3,1.55,8),Xe(new _(0,2.4,.2),new _(.05,1,.08),8),ve,1,0,0,0,!0);for(let d=0;d<9;d++){const h=d/9*We+a.range(-.25,.25),O=a.range(3,6.2),z=a.range(.3,.75);P(s,Bt(O*.04,O/a.range(4.2,5.5),O),Xe(new _(Math.cos(h)*1,2.3,Math.sin(h)*1.7+.2),new _(Math.cos(h)*Math.sin(z),Math.cos(z),Math.sin(h)*Math.sin(z)),O),d%3?ve:Ke,1,d+1,0,0,!0)}return rt(s)}function Mn(a){const s=it();if(a)P(s,new n.IcosahedronGeometry(.95,0),W(0,.95,0),ve,1,0,0,0,!0),P(s,new n.OctahedronGeometry(1.25,0),W(0,.95,0,.5,.3,0,.5,1,.5),Ke,1,3,0,0,!0),P(s,new n.OctahedronGeometry(1.25,0),W(0,.95,0,.3,.2,1.57,.5,1,.5),ve,1,5,0,0,!0);else{P(s,new n.CylinderGeometry(.55,.78,.12,12),W(0,.14,0),ve,2,0,0,0,!0),P(s,tt(8,5),W(0,.2,-.1,0,0,0,.36,.2,.42),Ke,1,2);const d=new n.BufferGeometry;d.setAttribute("position",new n.Float32BufferAttribute([-.32,.04,.7,.32,.04,.7,0,.04,8],3)),d.setAttribute("normal",new n.Float32BufferAttribute([0,1,0,0,1,0,0,1,0],3)),P(s,d,W(0,0,0),ve,3)}return rt(s)}function Sn(a){const s=it(),d=11;for(let h=0;h<d;h++){const O=a.range(2,5)*(h<3?1:.75),z=O*a.range(.2,.32),X=h/d*We*1.9+a.range(-.3,.3),E=h<3?a.range(.9,1.3):a.range(.25,.8),u=new n.Matrix4().makeRotationY(X).multiply(new n.Matrix4().makeRotationX(-E)).multiply(W(0,0,O*.42,0,a.range(-.2,.2),a.range(-.5,.5),z,1,O/2)),r=Bt(1,1,.1);r.setIndex(Array.from(r.index.array).slice(36)),P(s,r,u,h%3?ve:Ke,1,h,0,0,!0)}return rt(s)}function kn(a){const s=it();let d=-.4;for(let h=0;h<7;h++){const O=ne(1.7,.45,h/6)*a.range(.85,1.15),z=a.range(.8,1.25);P(s,Bt(O*.82,O,z),W(a.range(-.2,.2),d+z/2,a.range(-.2,.2),a.range(-.08,.08),a.range(0,3),a.range(-.08,.08)),h%2?Ke:ve,1,h,0,0,!0),d+=z*.93}return P(s,Bt(.02,.4,1.6),W(0,d+.7,0),ve,1,9,0,0,!0),rt(s)}function An(){const a=it();for(const s of[-1,1]){P(a,new n.BoxGeometry(.3,.4,22),W(s*2.3,.2,0),ve,1,0,0,0,!0),P(a,new n.BoxGeometry(.3,.4,4),W(s*2.3,1,-12.4,.5,0,0),ve,1,1,0,0,!0);for(const d of[-7,0,7])P(a,new n.BoxGeometry(.2,1.1,.2),W(s*2.3,.9,d),be);for(const d of[-8,8])P(a,new n.CylinderGeometry(.08,.08,3.4,5),W(s*2.2,3.1,d),be)}P(a,new n.BoxGeometry(5,.3,19),W(0,1.5,0),Ke),P(a,new n.BoxGeometry(2.4,1.6,3),W(-.8,2.4,3),wt),P(a,new n.BoxGeometry(2,1.2,2.4),W(.9,2.2,-1),ve),P(a,new n.BoxGeometry(1.6,2,2),W(.6,2.6,6.5),be);for(let s=0;s<9;s++)P(a,new n.BoxGeometry(5.4,.08,2),W(0,4.85-.02*(s-4)*(s-4),-8+s*2),s%2?be:ve);return P(a,new n.CylinderGeometry(.06,.06,2.6,5),W(0,6.1,-8.6),be),P(a,new n.BoxGeometry(1.5,1.5,.06),W(0,7.6,-8.6,-.3,.5,0),ve,2),rt(a)}const Fa=[[1,.03,.05],[1,.36,0],[1,.84,.05],[.08,.9,.2],[0,.6,1],[.12,.12,1],[.62,.05,1]];function Cn(a,s){a=Fe(a,0,1)*6;const d=Math.min(5,Math.floor(a)),h=a-d,O=Fa[d],z=Fa[d+1];return s.setRGB(ne(O[0],z[0],h),ne(O[1],z[1],h),ne(O[2],z[2],h))}const Pn={noon:{elev:55,az:25,sunI:1.05,white:"#FFFFFF",amb:"#1A2244",zenith:"#05060F",haze:"#5A7DB0",fog:"#1a2850",fogD:21e-5,hPow:10,exposure:.92,gain:1.1,sparkle:1,stars:1,disc:12,key:2.6},low:{elev:23,az:36,sunI:1.4,white:"#FFF9F2",amb:"#1C2552",zenith:"#05060F",haze:"#6C8CC0",fog:"#1e2f5c",fogD:24e-5,hPow:6,exposure:.95,gain:1.15,sparkle:1.2,stars:.9,disc:12,key:2.4},night:{elev:27,az:-31,sunI:.5,white:"#CDD5FF",amb:"#161D44",zenith:"#02030A",haze:"#2C3D6C",fog:"#0c1430",fogD:19e-5,hPow:8,exposure:1.6,gain:.82,sparkle:2.4,stars:1.9,disc:0,key:1.1}};var Gn={id:"singing-erg",name:"The Singing Erg",category:"alien",weirdness:.6,media:["open","snow"],async build(a){const s=a.rng,d=a.vary||{},h=a.quality?.detail??1,O=Fe(d.density??1,.7,1.3);let z=s.pick(["noon","noon","low","low","night","noon"]);d.hour==="day"?z="noon":d.hour==="golden"||d.hour==="dawn"?z="low":d.hour==="night"&&(z="night");const X=!!d.rare;X&&z==="night"&&(z="noon");let E=s.pick(["wind","devils","meteors"]);z==="night"&&s.chance(.5)&&(E="meteors");const u={caravan:2*Math.round(s.int(6,10)*O),herd:Math.round(s.int(8,14)*O),calves:s.chance(.5),weeds:s.chance(.35),other:s.int(5,8)},r=Pn[z],F=Aa(r.elev,r.az),p=new n.Scene;p.fog=new n.FogExp2(r.fog,r.fogD);const $=await Ha(a,{skirt:!1,sunDir:[F.x,F.y,F.z],sunIntensity:r.sunI,gain:r.gain,sparkle:r.sparkle,palette:[r.zenith,r.amb,r.haze,"#C9C3D6","#F6F3EA",r.white,"#FF4FA3"],jets:Math.round(1e4*h),flyers:40,floor:.56});p.add($.object);const q=$.uniforms,re=$.anchors.heightAt,Ge=.3;q.uCore.value=Ge,await a.yield();const U=Qa(a,$,s.fork("land"));await a.yield();const G=tn(U,$);await a.yield();const ke=(e,i)=>Math.hypot(e,i)<331?re(e,i):U.height(e,i),he={uWind:{value:new n.Vector2(Dt[0],Dt[1])},uRing:{value:new n.Vector4(0,0,0,0)},uAval:{value:.3},uDrift:{value:E==="wind"?1.2:.4},uShadow:{value:null},uShA:{value:new n.Vector4(1,0,0,1)},uShC:{value:new n.Vector3(0,0,1)},uEcl:{value:0},uFill:{value:z==="night"?.62:1},uTrailEnd:{value:U.sLen-8},uFanOn:{value:1},uSpray:{value:0},uBeast:{value:Array.from({length:16},()=>new n.Vector3(1e5,1e5,0))},uFlash:{value:z==="night"?2.6:7},uPrism:{value:z==="night"?1.5:2.2},uBandK:{value:.5},uSpire:{value:Array.from({length:8},()=>new n.Vector4(1e5,1e5,0,1))},uSpireB:{value:Array.from({length:8},()=>new n.Vector4(50,.2,0,0))},uStream:{value:(E==="wind"?1:.62)*(z==="night"?1.5:1)}},He=(e,i,c={})=>new n.ShaderMaterial({uniforms:{...n.UniformsUtils.clone(n.UniformsLib.fog),...q,...he},vertexShader:e,fragmentShader:i,fog:!0,...c});await a.yield();{const e=mt+1,i=gt+1,c=e*i,g=new Float32Array(i),y=new Float32Array(e);for(let f=0;f<i;f++)g[f]=Ya(f/gt*2-1);for(let f=0;f<e;f++)y[f]=Za(f/mt*2-1);const w=new Float32Array(c*3),C=new Float32Array(c*3),S=new Float32Array(c*4),te=new Float32Array(c*2),K=new Float32Array(c),H={d:0,side:1,a:0,b:0};for(let f=0;f<i;f++){for(let I=0;I<e;I++){const T=f*e+I,ae=Ft[0]+we[0]*g[f]+fe[0]*y[I],ie=Ft[1]+we[1]*g[f]+fe[1]*y[I],se=U.height(ae,ie);K[T]=se,w[T*3]=ae,w[T*3+1]=se,w[T*3+2]=ie,S[T*4]=A(.84,1,Math.max(Math.abs(f/gt*2-1),Math.abs(I/mt*2-1))),S[T*4+2]=U.flatMask(ae,ie)*(1-A(.4,3,se)),S[T*4+3]=1-A(60,125,Math.hypot(ae-408,ie-846)),U.track(ae,ie,H),te[T*2]=H.d,te[T*2+1]=H.a,(I&63)===63&&await a.yield()}await a.yield()}for(let f=0;f<i;f++)for(let I=0;I<e;I++){const T=f*e+I,ae=Math.max(0,f-1),ie=Math.min(gt,f+1),se=Math.max(0,I-1),ge=Math.min(mt,I+1),ze=(K[ie*e+I]-K[ae*e+I])/(g[ie]-g[ae]),Se=(K[f*e+ge]-K[f*e+se])/(y[ge]-y[se]),Pe=-(ze*we[0]+Se*fe[0]),Ue=-(ze*we[1]+Se*fe[1]),ye=Math.sqrt(Pe*Pe+1+Ue*Ue);C[T*3]=Pe/ye,C[T*3+1]=1/ye,C[T*3+2]=Ue/ye,S[T*4+3]*=A(.1,.2,1-1/ye),I===0&&(f&7)===7&&await a.yield()}await a.yield();const L=f=>{const I=f[0],T=f[f.length-1],ae=2048,ie=new Float32Array(ae+1);let se=0;for(let ge=0;ge<=ae;ge++){const ze=I+(T-I)*ge/ae;for(;se<f.length-2&&f[se+1]<ze;)se++;ie[ge]=se+Fe((ze-f[se])/(f[se+1]-f[se]),0,1)}return ge=>{const ze=Fe((ge-I)/(T-I),0,1)*ae,Se=Math.min(ae-1,ze|0);return ie[Se]+(ie[Se+1]-ie[Se])*(ze-Se)}},Z=L(g),ee=L(y),v=(f,I)=>{const T=f-Ft[0],ae=I-Ft[1],ie=Z(T*we[0]+ae*we[1]),se=ee(T*fe[0]+ae*fe[1]),ge=Math.min(gt-1,ie|0),ze=Math.min(mt-1,se|0),Se=ie-ge,Pe=se-ze,Ue=ge*e+ze;return(K[Ue]*(1-Pe)+K[Ue+1]*Pe)*(1-Se)+(K[Ue+e]*(1-Pe)+K[Ue+e+1]*Pe)*Se},D=Math.hypot(F.x,F.z)||1,B=F.x/D,t=F.z/D,o=F.y/D,l=16,k=[];for(let f=0;f<l;f++)k.push(5*Math.pow(1.38,f));const x=[235,520],V=1840,J=Math.min(o,.36);for(let f=0;f<i;f++){for(let I=0;I<e;I++){const T=f*e+I,ae=w[T*3],ie=K[T]+.25,se=w[T*3+2];let ge=-1;const ze=ae-x[0],Se=se-x[1];if(!(Math.max(Math.abs(ze*B+Se*t),Math.abs(ze*-t+Se*B))<V*.43)){for(let Pe=0;Pe<l;Pe++){const Ue=k[Pe],ye=(v(ae+B*Ue,se+t*Ue)-ie)/Ue-J;ye>ge&&(ge=ye)}S[T*4+1]=Fe(ge,-.5,.5)}}await a.yield()}{await a.yield();const f=768,I=V,T=I/f,ae=x[0],ie=x[1],se=-t,ge=B,ze=new Uint8Array(f*f),Se=new Float32Array(f+2),Pe=Math.min(o,1.35),Ue=Pe>J+.05,ye=[],ua=new _;for(let Ie=395;Ie<=800;Ie+=81)G.posAtDist(Ie,ua),ye.push(ua.x,ua.z);const Oa=(Ie,Rt)=>{let Ct=1e12;for(let Re=0;Re<ye.length-2;Re+=2){const vt=ye[Re+2]-ye[Re],st=ye[Re+3]-ye[Re+1];let de=((Ie-ye[Re])*vt+(Rt-ye[Re+1])*st)/(vt*vt+st*st);de=de<0?0:de>1?1:de;const et=Ie-ye[Re]-vt*de,Pt=Rt-ye[Re+1]-st*de,pt=et*et+Pt*Pt;pt<Ct&&(Ct=pt)}return 1-A(45,250,Math.sqrt(Ct))};await a.yield();for(let Ie=0;Ie<f;Ie++){const Rt=ae+se*(Ie+.5-f/2)*T-B*(f/2+.5)*T,Ct=ie+ge*(Ie+.5-f/2)*T-t*(f/2+.5)*T;for(let de=0;de<f+2;de++)Se[de]=v(Rt+B*de*T,Ct+t*de*T);let Re=-1e9,vt=-1e9,st=0;for(let de=f-1;de>=0;de--){const et=Se[de+1],Pt=Re-J*T;let pt=Pt-et-.1;if(Re=Pt>et?Pt:et,Ue){const fa=vt-Pe*T;vt=fa>et?fa:et,((de&3)===0||de===f-1)&&(st=Oa(Rt+B*(de+1)*T,Ct+t*(de+1)*T)),st>0&&(pt=pt+(fa-et-.1-pt)*st)}ze[Ie*f+de]=Math.max(0,Math.min(255,Math.round(127.5+127.5*pt/8)))}Ie&1&&await a.yield()}await a.yield();const At=new n.DataTexture(ze,f,f,n.RedFormat,n.UnsignedByteType);At.minFilter=n.LinearMipmapLinearFilter,At.magFilter=n.LinearFilter,At.generateMipmaps=!0,At.unpackAlignment=1,At.needsUpdate=!0,he.uShadow.value=At,he.uShA.value.set(B,t,se,ge),he.uShC.value.set(ae,ie,1/I)}await a.yield();const N=new Uint32Array(mt*gt*6);let Y=0;for(let f=0;f<gt;f++)for(let I=0;I<mt;I++){I===0&&(f&7)===7&&await a.yield();const T=f*e+I,ae=T+e,ie=T+1,se=ae+1;Math.max(Math.hypot(w[T*3],w[T*3+2]),Math.hypot(w[ae*3],w[ae*3+2]),Math.hypot(w[ie*3],w[ie*3+2]),Math.hypot(w[se*3],w[se*3+2]))<329||(N[Y++]=T,N[Y++]=ae,N[Y++]=ie,N[Y++]=ie,N[Y++]=ae,N[Y++]=se)}await a.yield();const oe=new n.BufferGeometry;oe.setAttribute("position",new n.BufferAttribute(w,3)),oe.setAttribute("normal",new n.BufferAttribute(C,3)),oe.setAttribute("aD",new n.BufferAttribute(S,4)),oe.setAttribute("aT",new n.BufferAttribute(te,2)),oe.setIndex(new n.BufferAttribute(N.subarray(0,Y),1));const ce=new n.Mesh(oe,He(nn,on));ce.name="erg-dunes",ce.frustumCulled=!1,p.add(ce)}await a.yield();const ue=z==="night";await a.yield();const Oe=Xa({rng:s,preset:"night",zenith:r.zenith,mid:r.zenith,horizon:r.haze,ground:r.fog,horizonPow:r.hPow,midPow:2.5,scatter:.04,scatterColor:r.haze,sunDirection:ue?Aa(-20,25):F,sunColor:"#ffffff",sunSize:.3,sunIntensity:r.disc,sunGlow:.22,sunGlowTight:.92,stars:r.stars,twinkle:.12,starDensity:1,milkyWay:ue?.55:.12,milkyColor:"#7f93c8",milkyCore:"#c9c3d6",clouds:!1,clouds2:!1,aurora:0,lightning:0,bodies:ue?[{elevation:r.elev,azimuth:r.az,size:2.3,color:"#f1f0ff",color2:"#b9b3c9",texture:.5,phase:.92,phaseAngle:30,intensity:2.2,glow:.3,glowColor:"#aab4ff",seed:3},{elevation:r.elev-9,azimuth:r.az-8,size:1.2,color:"#dcd8ee",color2:"#8f8aa6",texture:.4,phase:.3,phaseAngle:200,intensity:1.8,glow:.2,glowColor:"#aab4ff",seed:8}]:[{elevation:41,azimuth:-37,size:.95,color:"#e9e6f4",color2:"#a9a4be",texture:.5,phase:.72,phaseAngle:40,intensity:1.1,seed:3},{elevation:45.5,azimuth:-31.5,size:.55,color:"#dcd8ee",color2:"#8f8aa6",texture:.4,phase:.22,phaseAngle:215,intensity:1.3,seed:8}],fogColor:r.fog,bake:!0,renderer:a.renderer});p.add(Oe.object),await a.yield();const at=new n.DirectionalLight(r.white,r.key);at.position.copy(F).multiplyScalar(600),p.add(at);const Vt=new n.HemisphereLight(ue?"#39468f":"#465aa0","#8f8aa8",ue?.75:.9);p.add(Vt);const nt=new n.Mesh(new n.PlaneGeometry(1,1),new n.ShaderMaterial({vertexShader:hn,fragmentShader:dn,transparent:!0,depthWrite:!1,blending:n.AdditiveBlending,uniforms:{uDir:{value:F.clone()},uSize:{value:ue?.3:.34},uI:{value:ue?.12:1},uMoon:{value:X?1:0},uMoonAt:{value:new n.Vector2(9,9)},uCol:{value:new n.Color(r.white)}}}));nt.frustumCulled=!1,nt.renderOrder=1,p.add(nt),await a.yield();const Me=G.length,R=new _,m=new _,Ze=new _,Ne=new _,lt=G.nearestXZ(0,327).u*Me,De=G.nearestXZ(425,890).u,M=G.nearestXZ(392,800).u,b=G.nearestXZ(U.flatC[0],U.flatC[1]).u,j=G.pointAt(De).clone(),Q={value:0},le=Nt.fxGroup();p.add(le.object);const pe=e=>He(sn,rn,{defines:{MODE:e},side:n.DoubleSide}),_e=new n.Object3D;_e.rotation.order="YXZ";const qe=(e,i,c,g,y,w,C=1,S=0)=>{_e.position.set(c,g,y),_e.rotation.set(S,w,0),_e.scale.setScalar(C),_e.updateMatrix(),e.setMatrixAt(i,_e.matrix)},Ae=(e,i,c)=>{const g=new n.InstancedMesh(e,i,c),y=new n.InstancedBufferAttribute(new Float32Array(c*4),4);return y.setUsage(n.DynamicDrawUsage),g.instanceMatrix.setUsage(n.DynamicDrawUsage),e.setAttribute("aI",y),g.frustumCulled=!1,p.add(g),{m:g,aI:y}},$t=e=>e-We*Math.floor((e+Math.PI)/We);await a.yield();const Da=await zn(()=>a.yield());await a.yield();const Ye=u.caravan,ct=u.other*2,yt=Ae(Da,pe(1),Ye+ct);await a.yield();const Ut=new n.Mesh(An(),pe(0));Ut.frustumCulled=!1,p.add(Ut),await a.yield();const da=Ye+ct+2,Et=Ye+ct+3,Ba=Et+4,Te=le.add(Nt.makeGlows({rng:s.fork("glow"),positions:new Float32Array(Ba*3),color:"#ffffff",size:5,intensity:2.6,spikes:1.5,halo:ue?.22:.55,time:Q,fogAmount:.4}));Te.object.frustumCulled=!1,await a.yield();const Kt=u.herd,va=u.calves?Math.max(2,Math.round(Kt*.4)):0,Gt=2+Kt+va,Lt=Ae(bn(s.fork("pb")),pe(1),Gt),Be=s.fork("herd"),ot=[];await a.yield(),G.pointAt(b,R),G.tangentAt(b,m);{const e=Math.hypot(m.x,m.z)||1;m.set(m.x/e,0,m.z/e)}const je=[-m.z,m.x],Wt=R.x+je[0]*36-m.x*15,Ot=R.z+je[1]*36-m.z*15,xt=[500+je[0]*58,820+je[1]*58],pa=[330+je[0]*58,600+je[1]*58],Ve=[(pa[0]-xt[0])/278,(pa[1]-xt[1])/278],zt=[-m.x,-m.z],Ua=Math.atan2(-F.x,-F.z),Qt=Math.atan2(R.x+m.x*45-Wt,R.z+m.z*45-Ot);ot.push({x:Wt,z:Ot,s:1,v:.04,seed:Be(),yaw:Be.range(0,We)},{x:Wt+7,z:Ot-6,s:.34,v:.04,seed:Be(),yaw:Be.range(0,We)});const ma=[R.x+je[0]*78+m.x*40,R.z+je[1]*78+m.z*40],Ga=[R.x+je[0]*46+m.x*80,4,R.z+je[1]*46+m.z*80];for(let e=0;e<Kt;e++){const i=Be.range(-100,80),c=Be.range(-48,48)*.42;ot.push({a:i,b:c,x:0,z:0,s:Be.range(.85,1.15),v:Be.range(.8,1.1),seed:Be()})}for(let e=0;e<va;e++){const i=ot[2+Be.int(0,Kt-1)];ot.push({a:i.a-Be.range(6,11),b:i.b+Be.range(-9,9),x:0,z:0,s:Be.range(.3,.4),v:i.v,seed:Be()})}const bt=new n.InstancedBufferGeometry;{const e=[],i=[];for(let c=0;c<=8;c++)e.push(-1,c/8,0,1,c/8,0),c<8&&i.push(c*2,c*2+1,c*2+2,c*2+1,c*2+3,c*2+2);bt.setAttribute("position",new n.Float32BufferAttribute(e,3)),bt.setIndex(i)}const jt=new n.InstancedBufferAttribute(new Float32Array(Gt*4),4),ga=new n.InstancedBufferAttribute(new Float32Array(Gt*2),2);jt.setUsage(n.DynamicDrawUsage),bt.setAttribute("aF",jt),bt.setAttribute("aG",ga),bt.instanceCount=Gt,ot.forEach((e,i)=>ga.setXY(i,i<2?.17:.125,(ue?.6:.92)*(e.s<.5?.8:1)));const Jt=new n.Mesh(bt,He(ln,cn,{transparent:!0,depthWrite:!1,side:n.DoubleSide}));Jt.frustumCulled=!1,Jt.renderOrder=2,p.add(Jt);const Tt=new n.Mesh(new n.PlaneGeometry(2,2),new n.ShaderMaterial({uniforms:{uC:{value:new n.Color(1,1,1)}},depthTest:!1,depthWrite:!1,transparent:!0,blending:n.CustomBlending,blendSrc:n.DstColorFactor,blendDst:n.ZeroFactor,blendEquation:n.AddEquation,vertexShader:"void main(){ gl_Position=vec4(position.xy,0.,1.); }",fragmentShader:"uniform vec3 uC; void main(){ gl_FragColor=vec4(uC,1.); }"}));Tt.frustumCulled=!1,Tt.renderOrder=60,p.add(Tt);const ut=new n.Color;await a.yield();const ft=[],wa=De*Me+8,ya=M*Me+45;for(const e of[-27,19,40]){G.posAtDist(wa,R),G.tangentAtDist(wa,m),G.posAtDist(ya,Ze),G.tangentAtDist(ya,Ne);const i=Math.hypot(m.x,m.z)||1,c=Math.hypot(Ne.x,Ne.z)||1;ft.push({ax:R.x-m.z/i*e,az:R.z+m.x/i*e,bx:Ze.x-Ne.z/c*e*1.3,bz:Ze.z+Ne.x/c*e*1.3})}ft.push({ax:-17,az:314,bx:-27,bz:140},{ax:21,az:314,bx:33,bz:140});for(const[e,i,c,g]of[[.6,62,.385,27],[.575,104,.4,50],[.57,36,.43,19]]){G.pointAt(e,R),G.tangentAt(e,m),G.pointAt(c,Ze),G.tangentAt(c,Ne);const y=Math.hypot(m.x,m.z)||1,w=Math.hypot(Ne.x,Ne.z)||1;ft.push({ax:R.x-m.z/y*i,az:R.z+m.x/y*i,bx:Ze.x-Ne.z/w*g,bz:Ze.z+Ne.x/w*g,slow:.8})}ft.forEach((e,i)=>{e.len=Math.hypot(e.bx-e.ax,e.bz-e.az),e.dx=(e.bx-e.ax)/e.len,e.dz=(e.bz-e.az)/e.len,e.v=(u.weeds?9:15)*s.range(.85,1.15)*(e.slow||1),e.ph=s()}),await a.yield();const ea=96,ta=Ae(Mn(u.weeds),pe(0),ea),xa=[],aa=s.fork("sk");for(let e=0;e<ea;e++)xa.push({lane:ft[Math.floor(e/12)],ph:e%12*.028+aa.range(0,.02)+(e%12>7?.5:0),lat:aa.range(-7,7),wob:aa.range(0,We)});{const e=s.fork("bloom"),i={d:0,side:1,a:0,b:0},c=Math.round(300*O*h),g=[];await a.yield();for(let v=0;v<c*12&&g.length<c;v++){(v&127)===127&&await a.yield();const D=v%3!==0,B=e.range(-1,1),t=e.range(-1,1);let o,l;if(D){if(o=U.flatC[0]+we[0]*B*150+fe[0]*t*250,l=U.flatC[1]+we[1]*B*150+fe[1]*t*250,U.flatMask(o,l)<.5)continue}else{const k=U.route2[e.int(8,U.route2.length-2)],x=e.range(11,75)*e.sign();if(o=k[0]+fe[0]*x+we[0]*e.range(-10,10),l=k[1]+fe[1]*x+we[1]*e.range(-10,10),Math.hypot(o,l)<345)continue}Yt(U.route2,o,l,i).d<14||G.nearestXZ(o,l).dist<11||Math.abs(U.height(o+3,l)-U.height(o-3,l))+Math.abs(U.height(o,l+3)-U.height(o,l-3))>1.6||g.push([o,l,D?e.range(.55,1.5):e.range(.6,1.5)])}for(let v=0;v<18;v++){const D=ne(M*Me+25,b*Me+105,(v+e())/18),B=e.range(9,17);G.posAtDist(D,R),G.tangentAtDist(D,m);const t=Math.hypot(m.x,m.z)||1,o=R.x-m.z/t*B,l=R.z+m.x/t*B;U.flatMask(o,l)>.6&&g.push([o,l,e.range(.32,.55)])}await a.yield();const y=new n.InstancedMesh(Sn(e),pe(2),g.length);g.forEach((v,D)=>qe(y,D,v[0],U.height(v[0],v[1])-.1,v[1],e.range(0,We),v[2])),y.instanceMatrix.needsUpdate=!0,y.frustumCulled=!1,p.add(y);const w=Math.min(Math.round(9e3*h),Math.round(9e3*O*h)),C=new Float32Array(w*4);let S=0;await a.yield();for(let v=0;v<w*6&&S<w;v++){(v&255)===255&&await a.yield();const D=e.range(-1,1),B=e.range(-1,1),t=U.flatC[0]+we[0]*D*135+fe[0]*B*150,o=U.flatC[1]+we[1]*D*135+fe[1]*B*150;U.flatMask(t,o)<.93||a.noise.n2(t*.035,o*.035)<-.05||Yt(U.route2,t,o,i).d<3.5||G.nearestXZ(t,o).dist<4||(C[S*4]=t,C[S*4+1]=o,C[S*4+2]=e.range(.5,1.15),C[S*4+3]=e(),S++)}await a.yield();const te=new n.InstancedBufferGeometry;te.setAttribute("position",new n.Float32BufferAttribute([-.5,0,0,.5,0,0,.5,1,0,-.5,1,0],3)),te.setIndex([0,1,2,0,2,3]),te.setAttribute("aR",new n.InstancedBufferAttribute(C,4)),te.instanceCount=S;const K=new n.Mesh(te,He(un,fn,{transparent:!0,depthWrite:!1,side:n.DoubleSide}));K.frustumCulled=!1,K.renderOrder=3,p.add(K),await a.yield();const H=kn(e),L=pe(0);G.pointAt(G.nearestXZ(60,462).u,R);const Z=[R.x+15,R.z-12];[[U.summit.x,U.height(U.summit.x,U.summit.z),U.summit.z,2.6],[Z[0],U.height(Z[0],Z[1]),Z[1],1]].forEach((v,D)=>{const B=new n.Mesh(H,L);B.position.set(v[0],v[1],v[2]),B.scale.setScalar(v[3]),p.add(B),Te.setPosition(Ye+ct+D,v[0],v[1]+7.2*v[3],v[2])})}await a.yield();const Mt=[],Xt=[];{const e=s.fork("spire"),i=it(),c=new _,g=(t,o,l,k,x,V,J)=>{c.set(Math.sin(l)*Math.cos(k),Math.cos(l),Math.sin(l)*Math.sin(k));const N=new _(t,-.16,o),Y=x*.76+.16,oe=new n.Color(J,1,1);P(i,new n.CylinderGeometry(V*.8,V,Y,6,1,!0),Xe(N,c,Y),oe,4,0,0,0,!0),P(i,new n.CylinderGeometry(.003,V*.8,x-Y+.16,6,1,!0),Xe(N.clone().addScaledVector(c,Y),c,x-Y+.16),oe,4,0,0,0,!0)},y=.07,w=.8;g(0,0,y,w,1,.075,0);for(let t=0;t<5;t++){const o=t/5*We+e.range(-.4,.4),l=e.range(.28,.68)*(t===1?1.15:1),k=e.range(.07,.15);g(Math.cos(o)*k,Math.sin(o)*k,e.range(.16,.55),o+e.range(-.5,.5),l,l*e.range(.085,.12),e())}await a.yield();const C=[],S=[-F.x,-F.z],te=Math.hypot(S[0],S[1])||1;S[0]/=te,S[1]/=te,G.tangentAt(.5,m);const K=S[0]*-m.z+S[1]*m.x<0,H=(t,o)=>{let l=1e9;for(let k=5;k<ft.length;k++){const x=ft[k],V=Fe((t-x.ax)*x.dx+(o-x.az)*x.dz,0,x.len);l=Math.min(l,Math.hypot(t-x.ax-x.dx*V,o-x.az-x.dz*V))}return l},L=Math.round(34*Math.max(h,.8));for(let t=0;t<700&&C.length<L;t++){(t&31)===31&&await a.yield();const o=t%6===5,l=t%3===1,k=o?e.range(.4,.68):e.range(.355,.63),x=o||e.chance(K?.7:.45),V=o?e.range(75,135):l?e.range(15.5,25)*(x?1:-2.2):x?e.range(24,70):-e.range(34,62),J=o?e.range(19,30):l?e.range(5,9.5):e.range(8,18),N=e.range(0,We);G.pointAt(k,R),G.tangentAt(k,m);const Y=Math.hypot(m.x,m.z)||1,oe=R.x-m.z/Y*V,ce=R.z+m.x/Y*V;if(Math.hypot(oe,ce)<348||G.nearestXZ(oe,ce).dist<(x?14.5:30)||H(oe,ce)<9)continue;let f=!0;for(const I of C)if(Math.hypot(I.x-oe,I.z-ce)<(o?30:13)){f=!1;break}f&&C.push({x:oe,z:ce,h:J,yaw:N,far:o,y:U.height(oe,ce),seed:e()})}await a.yield();const Z=rt(i),ee=new n.InstancedMesh(Z,pe(0),C.length),v=new Float32Array(C.length*4);C.forEach((t,o)=>{qe(ee,o,t.x,t.y-.02*t.h,t.z,t.yaw,t.h),v[o*4+3]=t.seed*5}),Z.setAttribute("aI",new n.InstancedBufferAttribute(v,4)),ee.instanceMatrix.needsUpdate=!0,ee.frustumCulled=!1,ee.name="erg-spires",p.add(ee),await a.yield();const D=Math.atan2(S[0],S[1]),B=C.filter(t=>!t.far).map(t=>{G.tangentAt(G.nearestXZ(t.x,t.z).u,m);const o=55+45*t.seed,l=D+Fe($t(Math.atan2(-m.x,-m.z)-D),-.7,.7)+(t.seed-.5)*.2;return{q:t,reach:o,ang:l,d:G.nearestXZ(t.x+Math.sin(l)*o*.42,t.z+Math.cos(l)*o*.42).dist}}).sort((t,o)=>t.d-o.d);for(const t of B){if(Mt.length>=8||t.d>30)break;if(Mt.some(l=>Math.hypot(l.x-t.q.x,l.z-t.q.z)<24))continue;const o=Mt.length;if(Mt.push({x:t.q.x,z:t.q.z,ang:t.ang}),he.uSpire.value[o].set(t.q.x,t.q.z,Math.sin(t.ang),Math.cos(t.ang)),he.uSpireB.value[o].set(t.reach,.27+.09*t.q.seed,0,ue?.6:1),Xt.length<4&&(o&1)===0){const l=Math.sin(y)*Math.cos(w)*.98,k=Math.sin(y)*Math.sin(w)*.98,x=Math.cos(t.q.yaw),V=Math.sin(t.q.yaw);Xt.push(new _(t.q.x+(l*x+k*V)*t.q.h,t.q.y+t.q.h*.95,t.q.z+(-l*V+k*x)*t.q.h))}}Xt.forEach((t,o)=>Te.setPosition(Et+o,t.x,t.y,t.z))}await a.yield();const na=E==="wind";if(le.add(Nt.makeParticles({rng:s.fork("motes"),preset:"dust",count:Math.round((na?4200:2400)*h),box:[70,18,70],velocity:[Dt[0]*(na?9:3),-.15,Dt[1]*(na?9:3)],velocityRandom:[1.2,.3,1.2],colors:["#ffffff","#d9d4ea","#ffffff"],size:[.025,.075],intensity:ue?1.4:2.2,twinkle:1,time:Q})),await a.yield(),E==="devils")for(let e=0;e<3;e++){await a.yield();const i=[[60,-70],[-30,95],[150,20]][e];let c=U.flatC[0]+we[0]*i[0]+fe[0]*i[1],g=U.flatC[1]+we[1]*i[0]+fe[1]*i[1];for(let y=0;y<4&&G.nearestXZ(c,g).dist<55;y++)c+=fe[0]*28,g+=fe[1]*28;le.add(Nt.makeDustDevil({rng:s.fork("devil"+e),time:Q,position:[c,0,g],height:s.range(30,48),radius:[.9,7.5],color:"#f4f1ff",colorTop:"#ffffff",shadowColor:"#8a8fc4",opacity:.3,wander:10,debris:220,sunDir:[F.x,F.y,F.z],sunColor:r.white}))}await a.yield(),(E==="meteors"||ue)&&le.add(Nt.makeShootingStars({rng:s.fork("met"),time:Q,count:E==="meteors"?30:8,period:E==="meteors"?[2.2,6.5]:[6,14],color:"#ffffff",tailColor:"#aab8e6",intensity:5,radius:3200})),await a.yield();{const e=s.fork("spin"),i=[],c=[],g=U.massif,y=[-.5,0,0,.5,0,0,.5,1,0,-.5,1,0];for(let H=0;H<g.length-1;H++){const L=g[H],Z=g[H+1],ee=Math.hypot(Z[0]-L[0],Z[1]-L[1]),v=Math.max(1,Math.round(ee/13)),D=-(Z[1]-L[1])/ee,B=(Z[0]-L[0])/ee;for(let t=0;t<v;t++){const o=(t+.5)/v,l=ne(L[0],Z[0],o),k=ne(L[1],Z[1],o);let x=-1e9,V=0;for(let ce=-36;ce<=36;ce+=6){const f=U.height(l+D*ce,k+B*ce);f>x&&(x=f,V=ce)}const J=l+D*V,N=k+B*V,Y=e.range(.6,1.4),oe=e();x<60||G.nearestXZ(J,N).dist<70||a.noise.n2(J*.006+31,N*.006)<-.25||(i.push(J,x,N,oe),c.push(e.range(26,40),(14+x*.07)*Y))}await a.yield()}for(const H of[-46,-35,-25,-16,16,25,35,46]){const L=Math.sqrt(106929-H*H);i.push(H,ke(H,L)+1.2,L,e()),c.push(e.range(13,19),e.range(5,8.5))}for(let H=2;H<6;H++){const L=U.d0[H],Z=U.d0[H+1],ee=Math.hypot(Z[0]-L[0],Z[1]-L[1]),v=Math.max(2,Math.round(ee/24)),D=-(Z[1]-L[1])/ee,B=(Z[0]-L[0])/ee;for(let t=0;t<v;t++){const o=(t+.5)/v,l=ne(L[0],Z[0],o),k=ne(L[1],Z[1],o);let x=-1e9,V=0;for(let I=-18;I<=18;I+=6){const T=U.height(l+D*I,k+B*I);T>x&&(x=T,V=I)}const J=l+D*V,N=k+B*V,Y=G.nearestXZ(J,N).dist,oe=e(),ce=e.range(.8,1.25);if(Y<12)continue;const f=1-A(14,45,Y);i.push(J,x+.9,N,oe),c.push(ne(24,16,f)*ce,ne(12,8,f)*ce)}await a.yield()}const w=new n.InstancedBufferGeometry;w.setAttribute("position",new n.Float32BufferAttribute(y,3)),w.setIndex([0,1,2,0,2,3]),w.setAttribute("aS",new n.InstancedBufferAttribute(new Float32Array(i),4)),w.setAttribute("aW",new n.InstancedBufferAttribute(new Float32Array(c),2)),w.instanceCount=i.length/4;const C={fog:!1,transparent:!0,depthWrite:!1,blending:n.AdditiveBlending,side:n.DoubleSide},S=new n.Mesh(w,He(vn,pn,C));S.name="erg-spindrift",S.frustumCulled=!1,S.renderOrder=3,p.add(S);const te=new n.BufferGeometry;te.setAttribute("position",new n.Float32BufferAttribute(y,3)),te.setIndex([0,1,2,0,2,3]);const K=new n.Mesh(te,He(wn,yn,C));K.name="erg-shaft",K.frustumCulled=!1,K.renderOrder=5,p.add(K)}await a.yield();const $e=4,Ht=24,oa=4*($e+1)*2,ht=new Float32Array((oa+(Ht+1)*2)*3),St=[new _,new _],xe=lt/Me;{const e=[],i=[],c=ue?.3:1,g=new n.Color(ve).multiplyScalar(.95*c),y=new n.Color("#3f4474").multiplyScalar(c),w=(K,H,L)=>{for(let Z=0;Z<=H;Z++){const ee=L&&Z>>1&1?y:g,v=K+Z*2;e.push(ee.r*.5,ee.g*.5,ee.b*.56,ee.r*1.05,ee.g*1.05,ee.b*1.05),Z<H&&i.push(v,v+1,v+2,v+1,v+3,v+2)}};for(let K=0;K<4;K++)w(K*($e+1)*2,$e,!0);w(oa,Ht,!0);const C=new n.BufferGeometry,S=new n.BufferAttribute(ht,3);S.setUsage(n.DynamicDrawUsage),C.setAttribute("position",S),C.setAttribute("color",new n.Float32BufferAttribute(e,3)),C.setIndex(i);const te=new n.Mesh(C,new n.MeshBasicMaterial({vertexColors:!0,side:n.DoubleSide}));te.frustumCulled=!1,te.name="erg-tow",p.add(te);var Ta=S}const kt=new _,Ce=new _,Qe=new _,me=new _,Le=new _,Ee=new _,sa=new _,ia=new _,ra=(e,i,c)=>{const g=me.distanceTo(i),y=Fe(g*.0034,.02,.3)*c;Ee.subVectors(me,i).cross(Le);const w=(Ee.length()||1)*(Ee.y<0?-1:1);Ee.multiplyScalar(y/w),ht[e]=me.x-Ee.x,ht[e+1]=me.y-Ee.y,ht[e+2]=me.z-Ee.z,ht[e+3]=me.x+Ee.x,ht[e+4]=me.y+Ee.y,ht[e+5]=me.z+Ee.z};function Ia(e,i,c){const g=A(xe-.012,xe+.03,i),y=Math.pow(g,1.4)*.85,w=1-A(xe+.03,xe+.075,i),C=Math.min(i*Me+1.6,Me-1);G.posAtDist(C,R),G.tangentAtDist(C,m);const S=Math.hypot(m.x,m.z)||1,te=-m.z/S,K=m.x/S;Ce.addVectors(St[0],St[1]).multiplyScalar(.5),Ce.x-=m.x/S*5,Ce.z-=m.z/S*5,Ce.y=Math.max(Ce.y-1.6,ke(Ce.x,Ce.z)+1.2),Ce.lerp(St[0],g);for(let v=0;v<2;v++){Le.subVectors(St[v],Ce),Le.lengthSq()<1e-6&&Le.set(0,1,0),Le.normalize();for(let D=0;D<=$e;D++){const B=D/$e;me.lerpVectors(Ce,St[v],B),me.y-=.25*4*B*(1-B),ra(((2+v)*($e+1)+D)*6,c,w*(1-g))}}kt.set(R.x,R.y-1.9,R.z),Le.subVectors(Ce,kt);const H=Le.length()||1;Le.multiplyScalar(1/H),Ee.set(m.x/S,0,m.z/S).lerp(Le,.55).normalize(),Qe.copy(kt).addScaledVector(Ee,Math.min(6,H*.4)),Qe.y+=.55,Qe.lerp(Ce,y);for(let v=0;v<2;v++){const D=v?1:-1;ia.set(kt.x+te*D*1.2,kt.y,kt.z+K*D*1.2).lerp(Qe,y),Le.subVectors(Qe,ia).normalize();for(let B=0;B<=$e;B++){const t=B/$e;me.lerpVectors(ia,Qe,t),me.y-=.12*4*t*(1-t),ra((v*($e+1)+B)*6,c,w)}}Le.subVectors(Ce,Qe).normalize();const L=Qe.distanceTo(Ce),Z=.9*Math.min(1,L/30)+5*g,ee=Math.sin(Math.PI*g)*2.6+1.2*g;for(let v=0;v<=Ht;v++){const D=v/Ht,B=4*D*(1-D),t=Math.sin(e*1.7+D*3)*.3*B*Math.min(1,L/30)+Math.sin(e*9+D*8)*ee*(1-D);me.lerpVectors(Qe,Ce,D),me.x+=te*t,me.z+=K*t,me.y=Math.max(me.y-Z*B-g*(1-D)*3+Math.cos(e*7+D*6)*ee*.5*(1-D),ke(me.x,me.z)+.3),ra(oa*3+v*6,c,w)}Ta.needsUpdate=!0}await a.yield();const Je=7,dt=new Float32Array(2*Je*2*3),Zt=G.nearestXZ(0,205).u;{const e=[],i=[];for(let w=0;w<2;w++)for(let C=0;C<Je;C++){const S=(w*Je+C)*2;e.push(C/(Je-1),0,w,C/(Je-1),1,w),C<Je-1&&i.push(S,S+1,S+2,S+1,S+3,S+2)}const c=new n.BufferGeometry,g=new n.BufferAttribute(dt,3);g.setUsage(n.DynamicDrawUsage),c.setAttribute("position",g),c.setAttribute("aUv",new n.Float32BufferAttribute(e,3)),c.setIndex(i);const y=new n.Mesh(c,He(mn,gn,{fog:!1,transparent:!0,depthWrite:!1,blending:n.AdditiveBlending,side:n.DoubleSide}));y.frustumCulled=!1,y.name="erg-spray",y.renderOrder=6,p.add(y);var Ra=g}function Na(e){const i=A(De-.005,De+.02,e)*(1-A(M+.03,M+.09,e)),c=A(xe-.004,xe+.012,e)*(1-A(Zt-.01,Zt+.025,e));he.uSpray.value=a.through?0:(.3+.7*Math.max(i,A(Zt,Zt+.04,e)))*(1-c),G.posAtDist(e*Me,R),G.tangentAtDist(e*Me,m);const g=Math.hypot(m.x,m.z)||1,y=m.x/g,w=m.z/g;for(let C=0;C<2;C++)for(let S=0;S<Je;S++){const te=C?1:-1,K=S/(Je-1),H=ne(12,2.4,K),L=te*(2.3+2.4*K*K),Z=L+te*(.5+1.7*K),ee=(C*Je+S)*6,v=R.x+y*H-w*L,D=R.z+w*H+y*L,B=R.x+y*H-w*Z,t=R.z+w*H+y*Z,o=ke(R.x+y*H,R.z+w*H),l=Fe(ke(v,D),o-.8,o+.5);dt[ee]=v,dt[ee+1]=l+.03,dt[ee+2]=D,dt[ee+3]=B,dt[ee+4]=l+.2+1.7*Math.pow(K,.7),dt[ee+5]=t}Ra.needsUpdate=!0}await a.yield();{const e=it(),i=s.fork("crown");for(let g=0;g<18;g++){const y=(g+i.range(-.3,.3))/18*We,w=i.range(2.4,5.1)*(1+.9*Math.pow(Math.abs(Math.sin(y)),3)),C=new _(Math.sin(y),Math.cos(y),i.range(-.5,-.05)),S=new _(Math.sin(y)*8.3,7.6+Math.cos(y)*8.3,-.6);P(e,Bt(.03,i.range(.62,1),w),Xe(S,C,w),be,1,g,0,0,!0)}const c=new n.Mesh(rt(e),pe(0));c.frustumCulled=!1,c.name="erg-crown",p.add(c)}const _a=q.uSunCol.value.clone(),qa=q.uAmb.value.clone(),Va=q.uSparkle.value,Ea=Oe.uniforms.uSun.value.y,Ka=at.intensity,za=nt.material.uniforms;let It=Qt;const la=[0,0],ca=[0,0],ba=(e,i,c,g,y)=>{G.posAtDist(e,R),G.tangentAtDist(e,m);const w=Math.hypot(m.x,m.z)||1,C=ne(-Pa(e)+c*4.6+Math.min(2.5+1.2*i,5)*Math.sin(e*.02+i*.7),c*g,A(lt-100,lt-20,e));y[0]=R.x-m.z/w*C,y[1]=R.z+m.x/w*C},Ma=[38,436];function Sa(e,i){const c=i*Me,g=ne(28,8,A(.16,.26,i)*(1-A(.54,.63,i)));for(let t=0;t<Ye;t++){const o=t>>1,l=t&1?1:-1,k=8.5-3.5*o/(Ye/2),x=4+o*14,V=Math.min(c+g+o*13+(t&1)*6,lt+x);let J,N,Y,oe=1;if(V<=lt)ba(V,o,l,k,la),ba(V+3,o,l,k,ca),J=la[0],N=la[1],Y=Math.atan2(-(ca[0]-J),-(ca[1]-N));else{const T=V-lt,ae=l*(k+T)/326,ie=A(Math.max(x-9,0),x,T);J=326*Math.sin(ae),N=326*Math.cos(ae);const se=Math.atan2(-Math.cos(ae)*l,Math.sin(ae)*l);Y=se+$t(Math.atan2(J,N)-se)*ie,oe=1-.88*ie}const ce=V*.42+t*1.7+(1-oe)*e*.6,f=ke(J,N)+Math.abs(Math.sin(ce*.5))*1.1*oe;qe(yt.m,t,J,f,N,Y,1),t<2&&St[t].set(J+Math.sin(Y)*2.6,f+4.3,N+Math.cos(Y)*2.6),t<16&&he.uBeast.value[t].set(J,N,1);const I=Math.pow(Math.max(0,Math.sin(e*1.6-o*.6)),10);yt.aI.setXYZW(t,ce,I,oe,t*.37),Te.setPosition(t,J,f+9.6,N),Te.setSize(t,.12+(ue?1.3:3.1)*I)}const y=330,w=150*Fe(i/.5,0,1.3)+e*.5,C=Math.atan2(-Ve[0],-Ve[1]),S=t=>(t%y+y)%y,te=t=>Math.max(.001,A(0,14,t)*(1-A(y-14,y,t)));for(let t=0;t<ct;t++){const o=Ye+t,l=S(w+38+(t>>1)*12.5),k=t&1?1:-1,x=xt[0]+Ve[0]*l-Ve[1]*k*4.2,V=xt[1]+Ve[1]*l+Ve[0]*k*4.2,J=l*.42+t*2.3,N=ke(x,V)+Math.abs(Math.sin(J*.5))*1.1;qe(yt.m,o,x,N,V,C,.92*te(l));const Y=Math.pow(Math.max(0,Math.sin(e*1.7+(t>>1)*.6+2)),24);yt.aI.setXYZW(o,J,Y,1,o*.37),Te.setPosition(o,x,N+8.8,V),Te.setSize(o,(.12+(ue?1.3:2.8)*Y)*te(l))}{const t=S(w+14),o=xt[0]+Ve[0]*t,l=xt[1]+Ve[1]*t,k=ke(o,l),x=ke(o+Ve[0]*8,l+Ve[1]*8);Ut.position.set(o,k+.05,l),Ut.scale.setScalar(te(t)),Ut.rotation.set(Math.atan2(x-k,8),C,0,"YXZ");const V=Math.pow(Math.max(0,Math.sin(e*1.3)),16);Te.setPosition(da,o-Ve[0]*8.6,k+7.6,l-Ve[1]*8.6),Te.setSize(da,.1+1.6*V)}Te.setSize(Ye+ct,.9+.5*Math.sin(e*2.3)),Te.setSize(Ye+ct+1,.5+.45*Math.sin(e*3.1+1));const K=e*1.1,H=.55,L=250;G.pointAt(i,R);const Z=A(b-.15,b-.05,i)*(1-A(b+.05,b+.15,i)),ee=Math.atan2(R.x-Wt,R.z-Ot)+.17*ne(1.6,-1.6,A(b-.035,b+.035,i));It=Qt+$t(ee-Qt)*Z;for(let t=0;t<Gt;t++){const o=ot[t];let l=o.x,k=o.z,x=1;if(t>=2){const N=((o.a+110+K*o.v)%L+L)%L,Y=N-110;x=A(0,14,N)*(1-A(L-14,L,N)),l=ma[0]+zt[0]*Y-zt[1]*o.b,k=ma[1]+zt[1]*Y+zt[0]*o.b}const V=ke(l,k);qe(Lt.m,t,l,V-.05-(1-x)*3,k,t<2?o.yaw:Math.atan2(-zt[0],-zt[1])+(o.seed-.5)*.3,o.s*Math.max(x,.001)),Lt.aI.setXYZW(t,K*o.v*.8/o.s+o.seed*6,.2+.13*Math.sin(e*1.7+o.seed*20),t<2?.08:H,o.seed);const J=t===0?It:(t===1?It+.5:Ua)+.3*Math.sin(e*.45+o.seed*9)*(t?1:0);jt.setXYZW(t,l,k,J,(o.s<.5?22:(t<2?150:100+60*o.seed)*o.s)*x)}for(let t=0;t<ea;t++){const o=xa[t],l=o.lane,k=(e*l.v/l.len+l.ph+o.ph)%1,x=k*l.len,V=o.lat+Math.sin(x*.045+o.wob)*3,J=l.ax+l.dx*x-l.dz*V,N=l.az+l.dz*x+l.dx*V,Y=ke(J,N),oe=ke(J+l.dx*2,N+l.dz*2),ce=A(0,.06,k)*(1-A(.9,1,k));u.weeds?qe(ta.m,t,J,Y+Math.abs(Math.sin(x*.3+o.wob))*.9,N,Math.atan2(-l.dx,-l.dz),ce*1.1,-x/.95):qe(ta.m,t,J,Y+.05,N,Math.atan2(-l.dx,-l.dz)+Math.cos(x*.045+o.wob)*.12,ce*1.15,Math.atan2(oe-Y,2))}if(yt.m.instanceMatrix.needsUpdate=!0,yt.aI.needsUpdate=!0,Lt.m.instanceMatrix.needsUpdate=!0,Lt.aI.needsUpdate=!0,ta.m.instanceMatrix.needsUpdate=!0,jt.needsUpdate=!0,he.uAval.value=.3+.7*A(De-.012,De+.015,i)*(1-A(M+.04,M+.12,i)),he.uBandK.value=i<.33?.45:i<.668?1:.8,i<.33)he.uRing.value.set(j.x,j.z,Math.max(0,i-De)*Me*3.4,A(De,De+.008,i)*(1-A(De+.1,De+.17,i))*(.35+.65*A(De+.004,De+.03,i)));else if(i>=.668){const t=Fe((i-.668)/(xe+.03-.668),0,1);he.uRing.value.set(0,0,318+t*95,A(0,.1,t)*(1-A(.8,1,t))*1.5)}else{const t=Fe((i-.35)/.105,0,2.999),o=t-Math.floor(t);he.uRing.value.set(Ma[0],Ma[1],o*.105*Me*3.4,A(0,.06,o)*(1-A(.7,1,o))*1.5*(1-A(.64,.665,i)))}q.uReveal.value=A(xe-.09,xe-.02,i);const v=A(.86,.97,i),D=ne(Ge,.62,v);q.uApproach.value=v,X||(q.uCore.value=D);const B=he.uRing.value;for(let t=0;t<Mt.length;t++){const o=Mt[t],l=o.ang+.07*Math.sin(e*.5+t*1.9);he.uSpire.value[t].set(o.x,o.z,Math.sin(l),Math.cos(l))}for(let t=0;t<4;t++){const o=Xt[t];if(!o){Te.setSize(Et+t,.001);continue}const l=Math.hypot(o.x-B.x,o.z-B.y),k=(l-B.z)/18,x=(l-B.z*.62)/18;let V=(Math.exp(-k*k)+.6*Math.exp(-x*x))*B.w;const J=Math.hypot(o.x,o.z);for(let N=0;N<3;N++){const Y=(q.uSongT.value+3.5*N)*150,oe=(J-Y)/18;V+=Math.exp(-oe*oe)*Math.max(0,1-Y/1500)}Te.setSize(Et+t,(.22+.06*Math.sin(e*2.1+t*2.3)+.7*Math.min(V,1.2))*(ue?.6:1))}if(X){const t=A(.555,.58,i),o=A(.645,.67,i),l=t*(1-o),k=1-l;$.setProgress(i<.62?1-t:ne(.2,1,A(.66,.8,i))),q.uCore.value*=D/1.7,q.uSunCol.value.copy(_a).multiplyScalar(ne(.14,1,k)),q.uSparkle.value=Va*ne(7,1,k),q.uAmb.value.copy(qa).addScaledVector(q.uHaze.value,.1*l),he.uEcl.value=l,Oe.uniforms.uSun.value.y=Ea*k,at.intensity=Ka*ne(.14,1,k),he.uFanOn.value=k,za.uI.value=k;const x=(i-.6125)*.9;za.uMoonAt.value.set(x,-.3*x)}}await a.yield(),Sa(0,0),await a.yield(),await Oe.prewarm(a.renderer,null,p),await a.yield();const ka=$.anchors.tallest,La=new _,Wa=new _;return{scene:p,path:G,duration:50,pace:e=>1-.55*A(xe-.015,xe+.02,e)*(1-A(xe+.05,xe+.1,e)),title:X?"The Singing Erg, Eclipsed":ue?"The Singing Erg under Two Moons":z==="low"?"The Singing Erg, Long Shadows":"The Singing Erg",ride:"sleigh",style:"none",camera:{fov:62,near:.3,far:7500,lookAhead:26,sway:.8,bank:.8},pois:[{at:Ga,from:.16,to:.31,weight:.3},{at:[U.summit.x,U.summit.y*.45,U.summit.z],from:.34,to:.54,weight:.35},{at:(e,i)=>{const c=A(xe-.03,xe+.012,i);return Wa.set(0,ne(120,22,c),ne(-120,-60,c))},from:.55,to:xe+.1,weight:.5},{at:[0,ka.height*.3,ka.position.z],from:xe+.075,to:.93,weight:.45},...X?[{at:(e,i)=>G.pointAt(Fe(i,0,1),La).addScaledVector(F,900),from:.555,to:.645,weight:.35}]:[]],portal:{shape:"circle",radius:7,color:"#ECE8FF",glow:1.1,revealDistance:340},post:{exposure:r.exposure,bloom:{strength:.42,radius:.6,threshold:1},grade:{saturation:1.06,contrast:1.09,tint:"#ffffff",shadowTint:"#000000",vignette:0,grain:.02,aberration:0}},update(e,i,c,g){Q.value=i,Sa(i,g),Ia(i,g,sa.setFromMatrixPosition(c.matrixWorld)),Na(g),$.update(e,i,c);const y=sa.x-ot[0].x,w=sa.z-ot[0].z,C=Math.sin(It),S=Math.cos(It),te=y*C+w*S,K=(y*S-w*C)/(Math.max(te,1)*.17),H=te>8&&te<140?A(1,.8,Math.abs(K))*he.uFanOn.value*(ue?.6:1)*A(b-.05,b-.035,g)*(1-A(b+.035,b+.05,g)):0;if(H<=.004)Tt.material.uniforms.uC.value.setRGB(1,1,1);else{Cn(K*.5+.5,ut);const L=1.2/Math.max(ut.r,ut.g,ut.b,.2),Z=.36*H;Tt.material.uniforms.uC.value.setRGB(ne(1,ut.r*L+.1,Z),ne(1,ut.g*L+.1,Z),ne(1,ut.b*L+.1,Z))}Oe.update(e,i,c),le.update(e,i,c)},dispose(){Oe.dispose(),$.dispose()}}}};export{Pa as bendAt,Gn as default,Qa as planLand,tn as planPath};
