import*as a from"three";import{clamp as Ke,lerp as he,smoothstep as ee}from"../kit/core.js";const et=["#05060F","#1A2244","#5A7DB0","#C9C3D6","#F6F3EA","#FFFFFF","#FF4FA3"],Q=320,ne=300,Me=210,Re=80,Le=46,ye=`
float h11(float p){ p=fract(p*.1031); p*=p+33.33; p*=p+p; return fract(p); }
float h21(vec2 p){ vec3 q=fract(vec3(p.xyx)*.1031); q+=dot(q,q.yzx+33.33); return fract((q.x+q.y)*q.z); }
vec3 h23(vec2 p){ vec3 q=fract(vec3(p.xyx)*vec3(.1031,.1030,.0973)); q+=dot(q,q.yxz+33.33); return fract((q.xxy+q.yzz)*q.zyx); }
float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x), mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x), f.y); }
// the only source of saturation in this world: red -> violet
vec3 spectral(float t){ t=clamp(t,0.,1.)*6.;
  vec3 c=mix(vec3(1.,.03,.05), vec3(1.,.36,0.), clamp(t,0.,1.));
  c=mix(c, vec3(1.,.84,.05), clamp(t-1.,0.,1.));
  c=mix(c, vec3(.08,.9,.2), clamp(t-2.,0.,1.));
  c=mix(c, vec3(0.,.6,1.), clamp(t-3.,0.,1.));
  c=mix(c, vec3(.12,.12,1.), clamp(t-4.,0.,1.));
  c=mix(c, vec3(.62,.05,1.), clamp(t-5.,0.,1.));
  return c; }
`,Ue=`
uniform vec4 uMono[7];   // x, z, height, radius
uniform vec4 uMonoB[7];  // base y, shoulder height, shoulder radius, -
uniform vec4 uFan[7];    // axis dir x, axis dir z, tan(half angle), ignition 0..1
uniform float uWinR, uRing, uTwist;
vec4 windowAt(vec2 p, out float mg){
  vec3 col=vec3(0.); float cover=0., red=0., vio=0.;
  float r=length(p), th=atan(p.x,-p.y+1e-5);
  float pet=uWinR*(.72+.28*pow(abs(sin(3.5*th)),.6));
  float farM=1.-smoothstep(pet-18.,pet,r);
  for(int i=0;i<7;i++){
    vec2 e=p-uMono[i].xy; vec2 d=uFan[i].xy;
    float s=dot(e,d); float w=dot(e,vec2(-d.y,d.x));
    float t=w/(max(s,1.)*uFan[i].z)+uTwist*(s-uRing)/uRing;
    float ew=clamp(7./(max(s,1.)*max(abs(uFan[i].z),.01)),.14,.7);
    float edge=smoothstep(1.,1.-ew,abs(t))*step(5.,s);
    float along=smoothstep(uMono[i].w+12.,uMono[i].w+95.,s)*(s<uRing?1.:farM);
    float I=edge*along*(1.25-.5*clamp(s/500.,0.,1.))*uFan[i].w;
    vec3 c=spectral(t*.5+.5);
    col=1.-(1.-col)*(1.-clamp(c*I*.92,0.,1.));
    cover+=I; red+=I*smoothstep(-.55,-1.,t); vio+=I*smoothstep(.55,1.,t);
  }
  mg=min(red,vio);
  col=clamp(mix(vec3(dot(col,vec3(.3333))),col,1.55),0.,1.);
  return vec4(col,cover);
}
`,Oe=`
uniform vec4 uModeA, uModeB; uniform vec2 uModeA2, uModeB2; uniform float uSnap;
// (uTime must be declared by the including shader: the figure trembles a little between snaps)
float chl1(float r, float th, vec4 m, vec2 m2){ return cos(m.x*r+m2.x+.12*sin(uTime*5.))*cos(m.y*th)+m2.y*cos(m.z*r-m2.x*1.7)*cos(m.w*th); }
float chlDist(vec2 p){ float r=length(p), th=atan(p.x,-p.y+1e-5);
  float f=mix(chl1(r,th,uModeA,uModeA2), chl1(r,th,uModeB,uModeB2), uSnap);
  return abs(f)/(mix(uModeA.x,uModeB.x,uSnap)*1.15); }
`,We=`
varying vec3 vP; varying vec3 vN; varying vec3 vCam;
#include <fog_pars_vertex>
`,tt=We+`
attribute float aEdge; varying float vEdge;
void main(){
  vP=position; vN=normal; vEdge=aEdge;
  vCam=(inverse(modelMatrix)*vec4(cameraPosition,1.)).xyz;
  vec4 mvPosition=modelViewMatrix*vec4(position,1.);
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,ot=`
varying vec3 vP; varying vec3 vN; varying vec3 vCam; varying float vEdge;
uniform vec3 uSun, uSunCol, uAmb, uSand, uLav, uMag, uSky;
uniform float uGain, uSparkle, uCore, uSongT, uTime, uPulse, uFloor, uApproach;
#include <fog_pars_fragment>
${ye}
${Ue}
${Oe}
// analytic shadow of the seven prisms (ray toward the sun against each vertical prism), razor edged
float shadowAt(vec3 P, out vec3 caust){
  caust=vec3(0.); float sh=1.;
  float lxz=max(length(uSun.xz),1e-4); vec2 u=uSun.xz/lxz; float tanE=uSun.y/lxz;
  float fwp=fwidth(dot(P.xz,vec2(-u.y,u.x)));
  for(int i=0;i<7;i++){
    vec2 e=P.xz-uMono[i].xy; float tt=dot(e,u);
    float perp=dot(e,vec2(-u.y,u.x));
    float hg=P.y-tt*tanE-uMonoB[i].x; float H=uMono[i].z;
    float rad=(hg<uMonoB[i].y?uMonoB[i].z:uMono[i].w)*(1.-.94*smoothstep(H*.86,H,hg));
    float d=max(abs(perp)-rad,(hg-H)*.6);
    d=max(d,tt+rad*.3);
    float w=.3+fwp*1.2;
    float s=smoothstep(-w,w,d);
    float x=perp/max(rad,1.);
    float inside=(1.-s)*smoothstep(0.,60.,-tt);
    caust+=vec3(.03,.04,.08)*inside*(.3+vn(vec2(perp*.09,hg*.025+float(i)*3.7)));
    caust+=spectral(fract(hg*.004+x*.2+.5))*exp(-pow(d/(.9+w),2.))*.15*smoothstep(0.,40.,-tt);
    sh=min(sh,s);
  }
  return sh;
}
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
    float pt=smoothstep(.2,.04,d);
    vec3 hue=mix(vec3(1.),spectral(fract(h.z*5.+dot(V,fn)*3.)),.75);
    acc+=hue*g1*pt*w;
  }
  return acc*7.*uSparkle;
}
void main(){
  vec3 P=vP; float dist=length(vCam-P); vec3 V=(vCam-P)/dist;
  vec3 N=normalize(vN);
  float rf=1.-smoothstep(120.,700.,dist);
  vec2 wp=vec2(P.x*.8+P.z*.6,-P.x*.6+P.z*.8);
  float rip=sin(wp.x*1.9+vn(wp*.07)*9.+vn(wp*.4)*2.);
  float rip2=sin(wp.x*.42+vn(wp*.021)*8.);
  N=normalize(N+vec3(.8,0.,.6)*(rip*.13*rf+rip2*.1)+vec3(vn(P.xz*.045)-.5,0.,vn(P.xz*.045+7.3)-.5)*.22);
  float ndl=pow(max(dot(N,uSun),0.),1.6)*1.22;
  float rc=wp.x*12.+vn(wp*.55)*5.+vn(wp*.1)*8.; float fc=1.-smoothstep(.3,1.1,fwidth(rc));          // hand-width ripples, only near the eye
  ndl*=1.-.13*fc*(.5-.5*sin(rc));
  float r=length(P.xz);
  vec3 caust; float sh=shadowAt(P,caust);
  float mg; vec4 wn=windowAt(P.xz,mg);
  float cov=clamp(wn.a*1.7,0.,1.)*.97;
  // Chladni ridges on the bowl floor
  float fl=smoothstep(uWinR+40.,uWinR-10.,r)*smoothstep(8.,24.,r);
  float wd=max(2.4,dist*.0032);
  float rd0=1.-smoothstep(wd*.1,wd,chlDist(P.xz));
  float rd1=1.-smoothstep(wd*.1,wd,chlDist(P.xz+normalize(uSun.xz)*wd*.5));
  float rdg=rd0*fl, rsl=(rd1-rd0)*fl;
  vec3 alb=mix(uSand,uLav,clamp(vn(P.xz*.011)*.7+(1.-N.y)*2.2-.15,0.,1.)*.8);
  // the floor of the window is a darker, packed sand so the fans stay saturated on it (uFloor 1 = original, <1 darker)
  float apr=uApproach*(1.-smoothstep(34.,95.,r));          // the run in (uApproach, driven by the world): the last sixty metres come up bright
  alb*=mix(uFloor,1.,max(smoothstep(70.,190.,r),apr*.22));
  // where several fans overlap they sum to white: keep that for the white point only, elsewhere hold the hue
  float wpt=exp(-r*r/(26.*26.));
  vec3 fanc=wn.rgb; float fmin=min(fanc.r,min(fanc.g,fanc.b));
  fanc-=fmin*.72*(1.-wpt)*(1.-uFloor)*2.;
  fanc=min(fanc*uGain*(1.+.4*apr),vec3(1.2+.4*apr));
  vec3 light=uSunCol*ndl*sh*(1.-cov)+uAmb*(.55+.45*N.y)+caust*uSunCol;
  light+=fanc+uMag*mg*1.25;
  light*=max(.25,1.+rdg*rdg*(.3+.7*uPulse)+rsl*2.4);
  // overtones: a finer figure of hairline ridges inside the main one, seen only near the eye, each with a dark line beside it
  { float nk=(1.-smoothstep(22.,95.,dist))*fl; float c2=chlDist(P.xz*3.2)/3.2; float c2s=chlDist((P.xz+normalize(uSun.xz)*.35)*3.2)/3.2;
    float hw=.22+dist*.004; float r2=1.-smoothstep(hw*.3,hw,c2), r2s=1.-smoothstep(hw*.3,hw,c2s);
    light*=1.+nk*(r2*.55+(r2s-r2)*1.1);
    light=mix(light,uAmb*.7,nk*.5*(1.-uFloor)*2.*smoothstep(hw*2.4,hw*1.3,c2)*(1.-r2)); }
  // the nodal line itself: a blue-black seam down the middle of each ridge, so the floor has figure
  float seam=(1.-smoothstep(wd*.1,wd*.34,chlDist(P.xz)))*fl*(1.-uFloor)*2.;
  light=mix(light,uAmb*.6,clamp(seam,0.,.85));
  float core=wpt*uCore+exp(-r*r/(58.*58.))*apr*.06;
  vec3 col=alb*(light+core);
  // song ripple racing outward from the white point
  float rr=uSongT*150.;
  col+=alb*exp(-pow((r-rr)/8.,2.))*.4*max(0.,1.-uSongT/3.4)*(.4+ndl);
  // on the run in the song is seen: slow rings of the whole spectrum widen from the white point and pass under the runners
  if(uApproach>.001){
    float cb=0., hb=.5;
    for(int k=0;k<3;k++){ float q=fract(uTime*.3+float(k)/3.); float xr=(r-q*105.)/8.; float c=(1.-smoothstep(1.,2.,abs(xr)))*(1.-q*q)*smoothstep(0.,.12,q); if(c>cb){ cb=c; hb=clamp(.5-xr*.25,0.,1.); } }
    col=mix(col,alb*spectral(hb)*(.8+.6*ndl*sh)*1.3,cb*uApproach*smoothstep(9.,22.,r)*.94);
  }
  col+=sparkle(P,V,dist)*mix(1.,.3,smoothstep(250.,900.,dist))*(uSunCol*(sh*.85+.15)*(1.-cov*.7)+fanc*mix(1.6,.9,(1.-uFloor)*2.)+core*.3);
  #ifdef USE_FOG
    col=mix(col,fogColor,vEdge);
  #else
    col=mix(col,uSky,vEdge);
  #endif
  gl_FragColor=vec4(col,1.);
  #include <fog_fragment>
}`,at=We+`
attribute vec4 aA; attribute vec2 aB; varying vec4 vA; varying vec2 vB;
void main(){
  vP=position; vN=normal; vA=aA; vB=aB;
  vCam=(inverse(modelMatrix)*vec4(cameraPosition,1.)).xyz;
  vec4 mvPosition=modelViewMatrix*vec4(position,1.);
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,nt=`
varying vec3 vP; varying vec3 vN; varying vec3 vCam; varying vec4 vA; varying vec2 vB;
uniform vec3 uSun, uSunCol, uAmb, uSand, uLav, uSky, uHaze;
uniform float uTime, uReveal;
#include <fog_pars_fragment>
${ye}
vec3 envAt(vec3 d){
  float up=smoothstep(-.03,.05,d.y);
  vec3 sky=mix(uHaze*.6,uSky,smoothstep(0.,.18,d.y));
  vec3 gnd=uSand*uSunCol*(.5+.3*clamp(-d.y*2.,0.,1.));
  return mix(gnd,sky,up);
}
void main(){
  // not yet revealed: the glass is not drawn at all. The light then catches the tips first and runs down the spires
  float rvl=(vP.y+50.*h21(floor(gl_FragCoord.xy))-640.*(1.-uReveal*1.3))/150.;
  if(rvl<0.) discard;
  float dist=length(vCam-vP); vec3 V=(vCam-vP)/dist; vec3 N=normalize(vN);
  float seed=vA.w, y=vA.z, R=vB.x;
  // growth striations: hashed bands across the axis tilt the facet a little
  float band=h11(floor(y/(R*.14))+seed*31.7), band2=h11(floor(y/(R*.8))+seed*7.3);
  float st=(band-.5)*.55+(band2-.5)*.45;
  vec3 Np=normalize(N+vec3(0.,st*.03,0.));
  float nv=max(dot(Np,V),0.); float F=.05+.95*pow(max(1.-nv,0.),4.);
  vec3 Rf=reflect(-V,Np);
  float rs=max(dot(Rf,uSun),0.);
  vec3 refl=envAt(Rf)+uSunCol*(pow(rs,500.)*50.+pow(rs,60.)*.45);
  vec3 T=normalize(refract(-V,Np,.67));
  float back=pow(max(dot(-V,uSun),0.),4.);
  vec3 body=envAt(T)*vec3(.06,.065,.1)+uSky*.25+uHaze*.02+uLav*(.012+.04*back);          // clear glass: we see the black sky through it
  // internal fracture planes: three families per crystal, flaring when they mirror the sun at the eye
  vec3 fr=vec3(0.);
  for(int k=0;k<3;k++){
    float fk=float(k); float a=seed*18.85+fk*2.1+h11(seed*5.+fk)*1.3;
    vec3 n=normalize(vec3(cos(a),.3+.6*h11(seed*9.+fk*3.),sin(a)));
    float sp=R*(1.7+.9*h11(seed*13.+fk));
    float dn=dot(T,n); dn=(dn<0.?-1.:1.)*max(abs(dn),.02);
    float c0=dot(vP,n)/sp; float sg=dn>0.?1.:-1.;
    float j0=dn>0.?floor(c0)+1.:ceil(c0)-1.;
    vec3 tu=normalize(cross(n,vec3(.3,1.,.2))); vec3 tv=cross(n,tu);
    float g=abs(dot(n,normalize(uSun+V)));
    float gm=abs(dot(reflect(-V,n),uSun)); float g8=gm*gm; g8*=g8; g8*=g8;
    float flare=g8*g8*g8*1.9+g8*.045+.004;          // a tight lobe: a plane flares as the view crosses its mirror angle, and is dark glass otherwise
    for(int q=0;q<2;q++){
      float j=j0+sg*float(q); float t=(j*sp-dot(vP,n))/dn;
      vec3 hp=vP+T*t;
      vec2 pc=vec2(dot(hp,tu)*.6,dot(hp,tv))/(R*1.3)+vec2(j*7.3,seed*19.+fk*5.);
      float m=.65+.35*smoothstep(.3,.8,vn(pc)+.3*vn(pc*2.7));
      vec3 tint=mix(vec3(1.),spectral(fract(gm*7.+g*3.+h11(j+seed*3.))),.86);
      fr+=tint*m*flare*exp(-t/(R*2.2));
    }
  }
  float thin=pow(max(1.-nv,0.),1.5);
  float diff=max(dot(N,uSun),0.);
  vec3 col=body*(1.-F)+refl*F+fr*(1.-F)*uSunCol*1.5;
  col+=uSunCol*back*(.015+.4*thin*thin)*mix(uLav,vec3(1.),.5);
  col+=uSunCol*diff*.045*mix(uLav,vec3(1.),.4)*(1.+st*.2);
  { float f3=max(1.-nv,0.); f3=f3*f3*f3; col+=(uSunCol*(.2+.8*back)+uHaze*.3)*f3*1.6; }          // a white fresnel edge on every arris: glass, not stone
  // bevels and arrises catch the light, with a touch of dispersion when backlit
  float w=clamp(fwidth(vA.x)*1.6,.045,.34);
  float edge=max(vA.y,smoothstep(1.-w,1.,abs(vA.x)));
  float eg=edge*(.2+1.3*back+1.4*pow(rs,5.)+.45*diff)*(.6+.8*band2);
  vec3 ecol=mix(vec3(1.),spectral(fract(dot(V,N)*2.5+y*.006+seed)),.25+.45*back);
  col+=ecol*eg*uSunCol;
  // sand-blasted, drifted base
  float frost=smoothstep(R*.45+8.,0.,y+vn(vP.xz*.21)*7.);
  vec3 fcol=uSand*(uSunCol*diff*.75+uAmb*1.6+.05);
  col=mix(col,fcol,frost*.85);
  // unlit glass against the black sky is black: the Choir only blazes once we top the rim (uReveal, driven by the world)
  col=mix(uSky,col,smoothstep(0.,1.,rvl)*smoothstep(.1,.7,uReveal));
  gl_FragColor=vec4(col,1.);
  #include <fog_fragment>
}`,_e=`
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      float fogF=1.-exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
    #else
      float fogF=smoothstep(fogNear,fogFar,vFogDepth);
    #endif
    gl_FragColor.rgb*=1.-fogF;
  #endif
`,st=`
attribute vec4 aJ; attribute vec2 aR;
uniform float uTime, uPulse, uGain;
varying vec2 vUv; varying vec3 vCol; varying float vH;
#include <fog_pars_vertex>
${ye}
${Ue}
${Oe}
void main(){
  vec3 base=aJ.xyz; vec3 cam=(inverse(modelMatrix)*vec4(cameraPosition,1.)).xyz;
  float dist=length(cam-base);
  float on=max(1.-smoothstep(1.2,2.6,chlDist(base.xz)),step(1.,aJ.w)*.8);
  float ph=fract(uTime*(.55+.5*aR.x)+aJ.w);
  float leap=sin(3.14159*ph);
  float hgt=(1.4+2.6*aR.y)*(.25+.75*leap)*(1.+1.1*uPulse)*max(1.,dist/220.);
  float wid=max(1.3+.9*aR.x,dist*.006);
  vec2 side=normalize(vec2(cam.z-base.z,-(cam.x-base.x)));
  vec3 p=base+vec3(side.x,0.,side.y)*position.x*wid+vec3(0.,(position.y+.02)*hgt,0.);
  p*=step(.02,on); 
  float mg; vec4 wn=windowAt(base.xz,mg);
  float r=length(base.xz);
  vec3 lit=vec3(.1)+wn.rgb*1.9+vec3(1.,.31,.64)*mg+vec3(.55)*exp(-r*r/700.);
  if(aJ.w>=1.) lit=spectral(fract(atan(base.x,base.z+1e-5)*.3183+aJ.w*.15))*1.5+.12;          // the ring round the white point: the spectrum twice round
  vCol=lit*on*(.5+.5*leap)*min(1.,260./dist+.12)*(.5+uGain*.5);
  vUv=position.xy; vH=aR.y+aJ.w*7.;
  vec4 mvPosition=modelViewMatrix*vec4(p,1.);
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,rt=`
varying vec2 vUv; varying vec3 vCol; varying float vH; uniform float uTime;
#include <fog_pars_fragment>
${ye}
void main(){
  float x=vUv.x*2.; float core=exp(-x*x*(3.+9.*vUv.y))*(1.-x*x);
  float grain=.45+1.3*step(.62,h21(vec2(floor(vUv.y*11.-uTime*5.+vH*31.),floor(vUv.x*5.+vH*91.))));
  float a=core*(1.-vUv.y)*(1.-vUv.y)*smoothstep(0.,.06,vUv.y)*grain;
  gl_FragColor=vec4(vCol*a*3.,1.);
  ${_e}
}`,it=`
attribute vec3 aC; varying vec3 vC; varying vec3 vP; varying vec3 vCam;
#include <fog_pars_vertex>
void main(){ vC=aC; vP=position; vCam=(inverse(modelMatrix)*vec4(cameraPosition,1.)).xyz;
  vec4 mvPosition=modelViewMatrix*vec4(position,1.); gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,lt=`
varying vec3 vC; varying vec3 vP; varying vec3 vCam; uniform float uTime, uBeam, uReveal; uniform vec3 uSun; uniform vec4 uFan[7];
#include <fog_pars_fragment>
${ye}
void main(){
  vec3 V=normalize(vCam-vP);
  float fwd=.45+1.5*pow(max(dot(-V,uSun),0.),3.);
  float dust=.5+.5*vn(vP.xz*.03+vec2(uTime*.6,vP.y*.05-uTime*.3))+.4*vn(vP.xy*.11+uTime*.2);
  float a=pow(sin(3.14159*clamp(vC.y,0.,1.)),1.6)*smoothstep(0.,.12,vC.x)*smoothstep(1.,.55,vC.x);
  int fi=int(floor(vC.z/8.)); float hue=fract(vC.z/8.);
  gl_FragColor=vec4(spectral(hue)*a*dust*fwd*uBeam*.085*uFan[fi].w*uReveal,1.);
  ${_e}
}`,ct=`
attribute vec3 aP; attribute vec4 aQ; uniform float uTime, uReveal; uniform vec3 uSun;
varying vec2 vUv; varying float vI;
#include <fog_pars_vertex>
void main(){
  vec3 c=aP; vec3 cam=(inverse(modelMatrix)*vec4(cameraPosition,1.)).xyz; float I; float size;
  if(aQ.z>.5){
    float a=aQ.y+uTime*aQ.w; c.xz+=vec2(cos(a),sin(a))*aQ.x; c.y+=sin(a*2.+aQ.y)*14.;
    float fl=pow(max(cos(a-aQ.y*3.),0.),40.);
    I=.1+6.*fl; size=5.+26.*fl;
  } else {
    vec3 V=normalize(cam-c); float back=pow(max(dot(-V,uSun),0.),3.);
    I=(.45+3.2*back)*(.82+.18*sin(uTime*2.3+aQ.y))*uReveal; size=aQ.x*(.6+.7*back);
  }
  float dist=length(cam-c); size=max(size,dist*.008);
  vUv=position.xy*2.; vI=I;
  vec4 mvPosition=modelViewMatrix*vec4(c,1.); mvPosition.xy+=position.xy*size;
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,ut=`
varying vec2 vUv; varying float vI;
#include <fog_pars_fragment>
void main(){
  float d=length(vUv); float g=exp(-d*d*38.)*2.5+exp(-d*5.)*.12;
  for(int k=0;k<3;k++){ float a=float(k)*1.0472+.26; vec2 n=vec2(-sin(a),cos(a));
    g+=exp(-abs(dot(vUv,n))*70.)*exp(-d*4.2)*.9; }
  g*=smoothstep(1.,.6,d);
  gl_FragColor=vec4(vec3(.95,.96,1.)*g*vI,1.);
  ${_e}
}`,f=a.Vector3;function ft(p,c,h,y){const T=[];for(let I=0;I<6;I++){const J=c+I*Math.PI/3;T.push([Math.cos(J)*p*h[I],Math.sin(J)*p*h[I]])}const W=[];for(let I=0;I<6;I++){const J=T[(I+5)%6],Y=T[I],te=T[(I+1)%6];W.push([he(Y[0],J[0],y),he(Y[1],J[1],y)],[he(Y[0],te[0],y),he(Y[1],te[1],y)])}return W}function vt(p,c){const{base:h,axis:y,sec:T,rings:W,seed:I,R:J,H:Y}=c,te=Math.abs(y.z)>.9?new f(1,0,0):new f(0,0,1),X=new f().crossVectors(te,y).normalize(),L=new f().crossVectors(y,X),x=T.length,N=[],A=[];for(const n of W){const m=n.s??1,S=(n.sx??1)*m,u=(n.sz??1)*m,b=n.ox||0,v=n.oz||0,_=n.kx||0,oe=n.kz||0,V=[];for(let B=0;B<x;B++){const k=T[B][0]*S,H=T[B][1]*u,P=n.y+k*_+H*oe,z=k+b,C=H+v;V.push([h.x+X.x*z+y.x*P+L.x*C,h.y+X.y*z+y.y*P+L.y*C,h.z+X.z*z+y.z*P+L.z*C,P])}N.push(V),A.push([h.x+X.x*b+y.x*n.y+L.x*v,h.y+X.y*b+y.y*n.y+L.y*v,h.z+X.z*b+y.z*n.y+L.z*v])}const F=(n,m,S,u,b,v)=>{p.pos.push(n[0],n[1],n[2]),p.nor.push(m,S,u),p.a.push(b,v,n[3],I),p.b.push(J,Y)};for(let n=0;n<W.length-1;n++)for(let m=0;m<x;m++){const S=(m+1)%x,u=N[n][m],b=N[n][S],v=N[n+1][S],_=N[n+1][m],oe=b[0]-u[0],V=b[1]-u[1],B=b[2]-u[2],k=(v[0]+_[0])*.5-u[0],H=(v[1]+_[1])*.5-u[1],P=(v[2]+_[2])*.5-u[2];let z=V*P-B*H,C=B*k-oe*P,E=oe*H-V*k;const se=Math.hypot(z,C,E)||1;z/=se,C/=se,E/=se;const fe=(u[0]+b[0]+v[0]+_[0])*.25-(A[n][0]+A[n+1][0])*.5,be=(u[1]+b[1]+v[1]+_[1])*.25-(A[n][1]+A[n+1][1])*.5,ze=(u[2]+b[2]+v[2]+_[2])*.25-(A[n][2]+A[n+1][2])*.5;z*fe+C*be+E*ze<0&&(z=-z,C=-C,E=-E);const j=m%2===0?1:0;F(u,z,C,E,-1,j),F(b,z,C,E,1,j),F(v,z,C,E,1,j),F(u,z,C,E,-1,j),F(v,z,C,E,1,j),F(_,z,C,E,-1,j)}const q=N[N.length-1],R=[0,0,0,0];for(const n of q)R[0]+=n[0]/x,R[1]+=n[1]/x,R[2]+=n[2]/x,R[3]+=n[3]/x;for(let n=0;n<x;n++){const m=q[n],S=q[(n+1)%x],u=m[0]-R[0],b=m[1]-R[1],v=m[2]-R[2],_=S[0]-R[0],oe=S[1]-R[1],V=S[2]-R[2];let B=b*V-v*oe,k=v*_-u*V,H=u*oe-b*_;const P=Math.hypot(B,k,H)||1;B/=P,k/=P,H/=P,B*y.x+k*y.y+H*y.z<0&&(B=-B,k=-k,H=-H),F(R,B,k,H,0,0),F(m,B,k,H,1,0),F(S,B,k,H,1,0)}return new f(R[0],R[1],R[2])}function Ae(p,c,h,y,T,W,I,J){const Y=[],te=c.range(.03,.12);for(let u=0;u<6;u++)Y.push(1+(u%2?te:-te)+c.range(-.05,.05));const X=ft(T,I,Y,c.range(.07,.12)),L=Math.min(W*.45,T*c.range(1.15,1.8)),x=W-L,N=T*.9+4,A=T*c.range(-.32,.32),F=T*c.range(-.32,.32),q=c.range(-.28,.28),R=c.range(-.28,.28),n=c.pick(["point","point","chisel","oblique"]),m=[{y:-N,s:1.07}];J?m.push({y:x*.36,s:1},{y:x*.74,s:.965,ox:A*.05,oz:F*.05}):m.push({y:x*.55,s:.985});const S=J?.91:.93;if(m.push({y:x,s:S,kx:q,kz:R,ox:A*.08,oz:F*.08}),n==="point")m.push({y:x+L*.58,s:S*.52,ox:A*.6,oz:F*.6,kx:q*.5,kz:R*.5}),m.push({y:W,s:c.range(.05,.12),ox:A,oz:F});else if(n==="chisel"){const u=c.chance(.5);m.push({y:x+L*.55,s:S,sx:u?.42:.78,sz:u?.78:.42,ox:A*.5,oz:F*.5,kx:q*.4,kz:R*.4}),m.push({y:W,s:1,sx:u?.06:.5,sz:u?.5:.06,ox:A,oz:F})}else{const u=c.range(.45,.8)*c.sign(),b=c.range(0,6.283),v=Math.cos(b)*u,_=Math.sin(b)*u;m.push({y:x+L*.3,s:S*.9,kx:v*.75,kz:_*.75,ox:A*.2,oz:F*.2}),m.push({y:x+L*.62,s:S*.66,kx:v,kz:_,ox:A*.4,oz:F*.4})}return vt(p,{base:h,axis:y,sec:X,rings:m,seed:c(),R:T,H:W})}async function dt(p,c={}){const h=p.rng.fork("choir"),y=p.noise,T=(c.palette&&c.palette.length>=7?c.palette:et).map(e=>new a.Color(e)),[W,I,J,Y,te,X,L]=T,x=(e,t=1)=>new f(e.r*t,e.g*t,e.b*t),N=Math.PI/180,A=c.sunDir?new f().fromArray(c.sunDir).normalize():new f(Math.sin(25*N)*Math.cos(55*N),Math.sin(55*N),-Math.cos(25*N)*Math.cos(55*N)).normalize(),F=c.sunIntensity??1.05,q=new a.Group;q.name="singing-erg-choir";const R=220/6*N,n=h.range(425,450),m=[.5,.645,.815,1],S=h.sign(),u=h.range(.16,.19),b=h.range(.12,.3)*h.sign(),v=[];for(let e=0;e<7;e++){const t=Math.abs(e-3),i=(e-3)*R+(t?h.range(-.035,.035):0),s=Math.max(200,n*m[3-t]*(t?h.range(.95,1.05):1)),r=s/h.range(9.6,11.4)*(t===3?1.12:1),o=ne*Math.sin(i),l=-ne*Math.cos(i),d=(e-3)/3*.75,g=-Math.atan(d*u*S),M=-o/ne,U=-l/ne,$=Math.cos(g),Z=Math.sin(g);v.push({i:e,a:i,x:o,z:l,H:s,R:r,fx:M*$-U*Z,fz:M*Z+U*$,subs:[],tips:[]})}const _=h.range(0,100),oe=e=>Re-(Re-Le)*ee(.5,.96,Math.cos(e))+5*y.n2(Math.cos(e)*1.7+_,Math.sin(e)*1.7),V=(e,t)=>{const i=Math.hypot(e,t),s=i/Q,r=Math.atan2(e,t);let o=oe(r)*(s>.34?Math.pow((s-.34)/.66,1.75):0);o+=2.2*ee(.1,.6,s)*y.fbm2(e*.007+_,t*.007,3)+1.4*s*s;for(const l of v){const d=e-l.x,g=t-l.z,M=l.R*1.7;o+=7*Math.exp(-(d*d+g*g)/(M*M))}return o},B=(e,t)=>{const i=Math.hypot(e,t),s=Math.atan2(e,t),r=V(e*Q/i,t*Q/i),o=i-Q,l=r-.6*o,d=(8+70*y.ridged2(e*.0023+_,t*.0023,3))*ee(0,110,o)+r*.45*(1-ee(0,160,o)),g=.5*(l+d+Math.sqrt((l-d)*(l-d)+90));return he(r,g,ee(0,14,o))},k=(e,t)=>Math.hypot(e,t)<=Q?V(e,t):B(e,t);for(const e of v)e.y=V(e.x,e.z)-3;const H=c.skirt!==!1,P=288,z=96,C=H?[0,3,7,12,19,28,40,54,70,88,107,127,148,170,193,217,240]:[0,3,7,12],E=(z+1+C.length)*P,se=new Float32Array(E*3),fe=new Float32Array(E*3),be=new Float32Array(E),ze=[];let j=0;const Be=(e,t,i)=>{for(let s=0;s<P;s++){const r=s/P*Math.PI*2,o=Math.max(e,.01)*Math.sin(r),l=Math.max(e,.01)*Math.cos(r),d=t(o,l),g=1.5,M=t(o+g,l),U=t(o,l+g);let $=-(M-d)/g,Z=-(U-d)/g;const w=Math.hypot($,1,Z);se[j*3]=o,se[j*3+1]=d,se[j*3+2]=l,fe[j*3]=$/w,fe[j*3+1]=1/w,fe[j*3+2]=Z/w,be[j]=i,j++}},Te=(e,t)=>{for(let i=0;i<P;i++){const s=(i+1)%P,r=e*P+i,o=t*P+i,l=t*P+s,d=e*P+s;ze.push(r,o,l,r,l,d)}};for(let e=0;e<=z;e++)Be(Q*Math.pow(e/z,.92),V,0),await p.yield();for(let e=0;e<z;e++)Te(e,e+1);for(let e=0;e<C.length;e++)Be(Q+C[e],B,H?ee(170,240,C[e]):0),await p.yield();for(let e=0;e<C.length-1;e++)Te(z+1+e,z+2+e);await p.yield();const de=new a.BufferGeometry;de.setAttribute("position",new a.BufferAttribute(se,3)),de.setAttribute("normal",new a.BufferAttribute(fe,3)),de.setAttribute("aEdge",new a.BufferAttribute(be,1)),de.setIndex(ze),await p.yield();const re={pos:[],nor:[],a:[],b:[]},pe=[],Ie=new a.Vector2(A.x,A.z).normalize();for(const e of v){const t=h.fork("mono"+e.i),i=t.range(0,Math.PI/3),s=t.range(0,.035),r=t.range(0,6.283),o=new f(Math.sin(s)*Math.cos(r),Math.cos(s),Math.sin(s)*Math.sin(r)).normalize(),l=new f(e.x,e.y,e.z);e.tip=Ae(re,t,l,o,e.R,e.H,i,!0),pe.push({p:e.tip,s:e.R*1.5});const d=t.shuffle([0,1,2,3,4,5]),g=t.int(2,4);let M=0,U=e.R*.93;for(let w=0;w<g;w++){const G=i+d[w]*Math.PI/3+Math.PI/6,O=e.R*t.range(.38,.6),K=e.H*t.range(.42,.8)*(w===0?1:.8),ae=e.R*.78+O*.35,ie=e.x+Math.cos(G)*ae,le=e.z+Math.sin(G)*ae,ce=Ae(re,t,new f(ie,e.y,le),o,O,K,i+(t.chance(.3)?Math.PI/6:0),!0);pe.push({p:ce,s:O*1.4});const ve=Math.abs((ie-e.x)*-Ie.y+(le-e.z)*Ie.x);U=Math.max(U,ve+O*.9),M=Math.max(M,K*.9),await p.yield()}e.shH=M,e.shR=U,await p.yield();const $=t.int(6,9);for(let w=0;w<$;w++){const G=w/$*6.283+t.range(-.3,.3),O=t.range(.22,.8),K=e.H*t.range(.1,.27),ae=K/t.range(5.5,8),ie=e.R*t.range(.7,1.2),le=e.x+Math.cos(G)*ie,ce=e.z+Math.sin(G)*ie,ve=new f(Math.cos(G)*Math.sin(O),Math.cos(O),Math.sin(G)*Math.sin(O));Ae(re,t,new f(le,V(le,ce)-2,ce),ve,ae,K,t.range(0,1),!1),w%3===2&&await p.yield()}await p.yield();const Z=t.int(11,17);for(let w=0;w<Z;w++){const G=t.range(0,6.283),O=e.R*t.range(1.1,2.6),K=t.range(7,28),ae=K/t.range(4,7),ie=e.x+Math.cos(G)*O,le=e.z+Math.sin(G)*O,ce=t.range(.05,.95),ve=G+t.range(-.9,.9),Ze=new f(Math.cos(ve)*Math.sin(ce),Math.cos(ce),Math.sin(ve)*Math.sin(ce));Ae(re,t,new f(ie,V(ie,le)-1,le),Ze,ae,K,t.range(0,1),!1),w%4===3&&await p.yield()}await p.yield()}await p.yield();const me=new a.BufferGeometry;me.setAttribute("position",new a.Float32BufferAttribute(re.pos,3)),await p.yield(),me.setAttribute("normal",new a.Float32BufferAttribute(re.nor,3)),await p.yield(),me.setAttribute("aA",new a.Float32BufferAttribute(re.a,4)),await p.yield(),me.setAttribute("aB",new a.Float32BufferAttribute(re.b,2)),await p.yield();const ue=[],Se=h.int(6,8);for(let e=0;e<Se;e++)ue.push({a:new a.Vector4(h.range(.05,.105),h.chance(.25)?14:7,h.range(.03,.085),h.pick([0,7,7,14])),b:new a.Vector2(h.range(0,6.283),h.range(.45,.9))});const Ve=[5,3,1,0,2,4,6],D={uMono:{value:v.map(e=>new a.Vector4(e.x,e.z,e.H,e.R*.93))},uMonoB:{value:v.map(e=>new a.Vector4(e.y,e.shH,e.shR,0))},uFan:{value:v.map(e=>new a.Vector4(e.fx,e.fz,u*S,1))},uWinR:{value:Me},uRing:{value:ne},uTwist:{value:b},uModeA:{value:ue[0].a.clone()},uModeB:{value:ue[1].a.clone()},uModeA2:{value:ue[0].b.clone()},uModeB2:{value:ue[1].b.clone()},uSnap:{value:1},uSongT:{value:1},uPulse:{value:0},uTime:{value:0},uSun:{value:A.clone()},uSunCol:{value:x(X,F)},uAmb:{value:x(I,1.6)},uSand:{value:x(te,.72)},uLav:{value:x(Y,.7)},uMag:{value:x(L)},uSky:{value:x(W)},uHaze:{value:x(J)},uGain:{value:c.gain??1.1},uSparkle:{value:c.sparkle??1},uCore:{value:1.7},uBeam:{value:c.beams??.15},uReveal:{value:1},uFloor:{value:c.floor??1},uApproach:{value:0}},ge=()=>a.UniformsUtils.clone(a.UniformsLib.fog),Je=new a.ShaderMaterial({uniforms:{...ge(),...D},vertexShader:tt,fragmentShader:ot,fog:!0,side:a.DoubleSide}),ke=new a.Mesh(de,Je);ke.name="choir-sand",ke.frustumCulled=!1,q.add(ke);const $e=new a.ShaderMaterial({uniforms:{...ge(),...D},vertexShader:at,fragmentShader:nt,fog:!0,side:a.DoubleSide}),Pe=new a.Mesh(me,$e);Pe.name="choir-crystal",Pe.frustumCulled=!1,q.add(Pe);const xe=Math.max(0,Math.floor(c.jets??12e3));let we=null;if(xe>0){const e=h.fork("jets"),t=new Float32Array(xe*4),i=new Float32Array(xe*2);for(let r=0;r<xe;r++){(r&1023)===1023&&await p.yield();let o=0,l=0;for(let g=0;g<8;g++){const M=Math.sqrt(e.range(.004,1))*(Me+28),U=e.range(0,6.283);if(o=M*Math.sin(U),l=M*Math.cos(U),!(Math.abs(o)<5&&l>-8))break}r%7===3&&(o=e.range(6,15)*e.sign(),l=e.range(14,Me+20));let d=0;if(r%15===8){const g=e.range(18,40),M=e.range(.3,6.283-.3);o=g*Math.sin(M),l=g*Math.cos(M),d=1}t[r*4]=o,t[r*4+1]=V(o,l),t[r*4+2]=l,t[r*4+3]=e()+d,i[r*2]=e(),i[r*2+1]=e()}const s=new a.InstancedBufferGeometry;s.setAttribute("position",new a.Float32BufferAttribute([-.5,0,0,.5,0,0,.5,1,0,-.5,1,0],3)),s.setIndex([0,1,2,0,2,3]),s.setAttribute("aJ",new a.InstancedBufferAttribute(t,4)),s.setAttribute("aR",new a.InstancedBufferAttribute(i,2)),s.instanceCount=xe,we=new a.Mesh(s,new a.ShaderMaterial({uniforms:{...ge(),...D},vertexShader:st,fragmentShader:rt,fog:!0,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,side:a.DoubleSide})),we.name="choir-jets",we.frustumCulled=!1,we.renderOrder=3,q.add(we)}if(await p.yield(),(c.beams??.15)>0){const e=[],t=[],i=[];for(const o of v)for(let l=0;l<5;l++){const d=(l-2)/2*.82,g=(d*.5+.5)*7.9,M=o.i*8+g,U=G=>{const O=d*G*u*S,K=o.x+o.fx*G-o.fz*O,ae=o.z+o.fz*G+o.fx*O;return[K,V(K,ae)+.6,ae]},$=U(78),Z=U(ne*.97),w=e.length/3;e.push(o.x,o.y+o.H*.42,o.z,o.x,o.y+o.H*.9,o.z,Z[0],Z[1],Z[2],$[0],$[1],$[2]),t.push(0,1,M,0,0,M,1,0,M,1,1,M),i.push(w,w+1,w+2,w,w+2,w+3)}const s=new a.BufferGeometry;s.setAttribute("position",new a.Float32BufferAttribute(e,3)),s.setAttribute("aC",new a.Float32BufferAttribute(t,3)),s.setIndex(i);const r=new a.Mesh(s,new a.ShaderMaterial({uniforms:{...ge(),...D},vertexShader:it,fragmentShader:lt,fog:!0,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,side:a.DoubleSide}));r.name="choir-beams",r.frustumCulled=!1,r.renderOrder=2,q.add(r)}{const e=Math.max(0,Math.floor(c.flyers??40)),t=pe.length+e,i=h.fork("flyers"),s=new Float32Array(t*3),r=new Float32Array(t*4);pe.forEach((d,g)=>{s.set([d.p.x,d.p.y,d.p.z],g*3),r.set([d.s,i.range(0,6.283),0,0],g*4)});for(let d=0;d<e;d++){const g=pe.length+d;s.set([i.range(-50,50),i.range(230,430),i.range(-70,40)],g*3),r.set([i.range(80,250),i.range(0,6.283),1,i.range(.2,.38)*i.sign()],g*4)}const o=new a.InstancedBufferGeometry;o.setAttribute("position",new a.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),o.setIndex([0,1,2,0,2,3]),o.setAttribute("aP",new a.InstancedBufferAttribute(s,3)),o.setAttribute("aQ",new a.InstancedBufferAttribute(r,4)),o.instanceCount=t;const l=new a.Mesh(o,new a.ShaderMaterial({uniforms:{...ge(),...D},vertexShader:ct,fragmentShader:ut,fog:!0,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending}));l.name="choir-glints",l.frustumCulled=!1,l.renderOrder=4,q.add(l)}let Ce=1,He=null,De=null;const Qe=()=>{for(let e=0;e<7;e++)D.uFan.value[e].w=ee(Ve[e]/8.5,(Ve[e]+1.8)/8.5,Ce);D.uCore.value=1.7*ee(.86,1,Ce)},Ne=(e,t)=>(e%t+t)%t;function qe(e,t){D.uTime.value=t,D.uTwist.value=b+.05*Math.sin(t*.8);const i=He??t,s=Math.floor(i/3.5),r=i-s*3.5;if(s!==De){De=s;const o=ue[Ne(s-1,Se)],l=ue[Ne(s,Se)];D.uModeA.value.copy(o.a),D.uModeA2.value.copy(o.b),D.uModeB.value.copy(l.a),D.uModeB2.value.copy(l.b)}D.uSnap.value=ee(0,.4,r),D.uSongT.value=r,D.uPulse.value=Math.exp(-r*2.2)*ee(0,.1,r)}qe(0,0);const Fe=[];for(const e of[330,300,262,220,175,130,95])Fe.push(new f(0,k(0,e)+2.8,e));const Ee=k(0,70)+3;Fe.push(new f(0,Ee,70),new f(0,he(Ee,7.6,.5),35),new f(0,7.6,0));const je=v[3],Ge=e=>({position:new f(e.x,e.y+3,e.z),height:e.H,radius:e.R,tip:e.tip.clone(),fanDir:new f(e.fx,0,e.fz)}),Ye=new f(0,140,0),Xe={portalSeat:{position:new f(0,7.6,0),normal:new f(0,0,1),radius:7},whitePoint:new f(0,0,0),flyThrough:Fe,crest:new f(0,k(0,Q)+2.8,Q),monoliths:v.map(Ge),tallest:Ge(je),sunDir:A.clone(),rimRadius:Q,ringRadius:ne,windowRadius:Me,bowlDepth:Re,saddleHeight:Le,heightAt:k,viewpoints:[{name:"reveal",position:new f(0,k(0,Q)+6,Q+14),lookAt:new f(0,110,-ne)},{name:"run",position:new f(0,k(0,150)+2.8,150),lookAt:new f(0,60,-ne)},{name:"high",position:new f(260,330,620),lookAt:new f(0,60,-40)},{name:"window",position:new f(-140,260,330),lookAt:new f(0,0,-20)}]};return{object:q,radius:340,height:Math.round(je.H+20),center:Ye,anchors:Xe,uniforms:D,update:qe,setProgress(e){Ce=Ke(e,0,1),Qe()},setSongClock(e){He=e},dispose(){},ground:!1,groundY:0}}export{ye as COMMON_GLSL,Ue as WINDOW_GLSL,dt as buildHero};
