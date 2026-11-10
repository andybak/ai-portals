import*as m from"three";import{mergeGeometries as la}from"three/addons/utils/BufferGeometryUtils.js";import"three/addons/geometries/ConvexGeometry.js";import{makePath as gn,makeRng as y0,hashSeed as w0,clamp as Y,lerp as J,smoothstep as Q}from"../kit/core.js";import{makeSky as vn}from"../kit/sky.js";import{makeHerd as xn,HERD_PRESETS as bn}from"../kit/fauna.js";import{buildHero as yn,BRANCH_GLSL as F0,FOG_V as zo,FOG_F as Po,FINISH as So,caribouGeo as wn,CARI_VS as Mn,CARI_FS as kn}from"../parts/the-branching.js";const qt=["#DDE3D2","#A81F2B","#D8922A","#6B3A2E","#C7D5DF","#3A4350","#F4DDB8"],ha=40,H0=30,m0=1/.12,fa=`
  float dth=fract(52.9829189*fract(dot(gl_FragCoord.xy,vec2(.06711056,.00583715))));
  if(uFade<=dth) discard;
`,zn=`
vec3 rY(vec3 p,float a){ float c=cos(a), s=sin(a); return vec3(c*p.x+s*p.z,p.y,-s*p.x+c*p.z); }
vec3 rX(vec3 p,float a){ float c=cos(a), s=sin(a); return vec3(p.x,c*p.y-s*p.z,s*p.y+c*p.z); }
vec3 rZ(vec3 p,float a){ float c=cos(a), s=sin(a); return vec3(c*p.x-s*p.y,s*p.x+c*p.y,p.z); }
`,Pn=`
${F0}
attribute vec3 color; attribute vec2 aW;
#ifdef INST
attribute vec4 iPos; attribute vec4 iRot; attribute vec4 iCol;
#endif
uniform vec4 uWind;
varying vec3 vP; varying vec3 vN; varying vec3 vCol; varying vec3 vL; varying vec2 vW; varying vec3 vBup;
${zo}
${zn}
void main(){
  vec3 p=position, n=normal, tint=vec3(1.); float ph=0., sc=1.; vec3 off=vec3(0.);
  vL=position; vBup=vec3(0.,1.,0.);
#ifdef INST
  sc=iPos.w; ph=iRot.w; tint=iCol.rgb; off=iPos.xyz;
  float yaw=iRot.x, pit=iRot.y, bnk=iRot.z;
  #ifdef HOP
    float hp=fract(uTime/max(iCol.w,.5)+ph), j=smoothstep(.88,1.,hp);
    // (yaw and pit come in as the two values the build hands a hop that would have crossed our line: 1 for the
    // opposite heading, and the share of the rise taken off; both are 0 for a hop left as dealt, and then every
    // product below is by one and the sum by nothing. See ROUND 21 (F1) in build)
    off.xz+=vec2(cos(ph*40.),sin(ph*40.))*((j*30.+hp*3.)*(1.-2.*yaw)); off.y+=sin(j*3.1416)*13.*(1.-pit);
    sc*=smoothstep(0.,.07,hp)*(1.-smoothstep(.9,1.,j)); pit=-j*2.5; yaw=3.1416*yaw-ph*40.-1.5708;
  #endif
  #ifdef BIRD
    float side=sign(aW.x), sf=abs(aW.x), fl=sin(ph)*iCol.w;
    float wa=side*(fl*(.3+.9*sf)+.12*sf);
    if(sf>.001){ p=rZ(p,wa); n=rZ(n,wa); }
    p.y-=fl*.04;
    vBup=rY(rX(rZ(rZ(vec3(0.,1.,0.),wa*step(.001,sf)),bnk),pit),yaw);       // which way is up for this wing
  #endif
  p=rY(rX(rZ(p*sc,bnk),pit),yaw)+off;
  n=rY(rX(rZ(n,bnk),pit),yaw);
#endif
#ifndef BIRD
  float g=sin(uTime*uWind.z+ph*6.283+dot(p.xz,vec2(.13,.09))*uWind.y)+.5*sin(uTime*uWind.z*2.3+p.x*uWind.y*.7+ph*11.);
  float gust=vn(p.xz*uWind.w-uTime*vec2(.6,.15));
  p.xz+=vec2(1.,.3)*g*aW.x*uWind.x*sc*(.3+gust);
#endif
  vP=p; vN=n; vCol=color*tint; vW=aW;
  vec4 mvPosition=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
  vDepth=-mvPosition.z;
}`,Sn=`
${Po}
${F0}
uniform vec4 uMatA; uniform vec4 uMatB; uniform float uFade;
varying vec3 vP; varying vec3 vN; varying vec3 vCol; varying vec3 vL; varying vec2 vW; varying vec3 vBup;
void main(){
  ${fa}
  vec3 N=vN/max(length(vN),1e-4); if(!gl_FrontFacing) N=-N;
  vec3 toC=uCamL-vP; float dist=length(toC); vec3 V=toC/max(dist,1e-3);
  float f=uMatA.y;
  float s1=vn(vL.xy*f+vL.z*f*1.37), s2=vn(vL.zy*f*3.3+vL.x*f*2.1+9.);
  vec3 alb=vCol*(1.+uMatA.x*((s1*.65+s2*.35)*2.-1.));
  float bh=s1*.6+s2*.4;
  vec3 dpx=dFdx(vP), dpy=dFdy(vP); float bx=dFdx(bh), by=dFdy(bh);
  vec3 r1=cross(dpy,N), r2=cross(N,dpx); float det=dot(dpx,r1);
  vec3 pb=(bx*r1+by*r2)*(sign(det)/max(abs(det),1e-7))*(uMatA.x*1.2/max(f,.05)/(1.+dist*.04));
  pb*=min(1.,.8/max(length(pb),1e-4));
  N=N-pb; N/=max(length(N),1e-4);
#ifdef BIRD
  float tipw=0.;
#else
  float tipw=smoothstep(.3,.9,vW.x);
#endif
  alb=mix(alb,vec3(.78,.84,.92),uMatB.w*tipw);
#ifdef BIRD
  // seen from below a wing is grey (below in the bird's own frame: it may be banked), the body darkens underneath
  float wmk=smoothstep(.012,.03,abs(vW.x)), und=smoothstep(0.,.3,-dot(V,vBup/max(length(vBup),1e-4)));
  alb*=mix(vec3(mix(.6,1.,smoothstep(-.45,.15,N.y))),mix(vec3(1.),vec3(.5,.52,.58),und),wmk);
  if(uMatB.w>0.){                                             // rows of overlapping feathers across the wing
    float ff=uMatB.w, wm=smoothstep(.012,.03,abs(vW.x)), fz=vL.z*ff*.75, fx=abs(vL.x)*ff+.5*mod(floor(fz),2.);
    float lf=clamp(1.3-(fwidth(vL.x)+fwidth(vL.z))*ff*2.2,0.,1.), ge=min(fract(fx),1.-fract(fx));
    alb*=mix(1.,mix(.88,(.72+.28*smoothstep(0.,.4,fract(fz)))*(.8+.2*smoothstep(0.,.1,ge)),lf),wm);
  }
#endif
  float cs=cloudShadow(vP.xz), ao=vW.y;
  float ndl=dot(N,uSunL), w=uMatB.z;
  float diff=max((ndl+w)/(1.+w),0.);
  float back=pow(max(dot(-V,uSunL),0.),2.)*uMatB.x*(.4+.6*max(-ndl,0.));
  vec3 col=alb*(uSunCol*(diff+back)*cs*(.5+.5*ao)+uSkyCol*(.62+.62*N.y)*ao+(uPal[1]*.07+uPal[6]*.04)*(1.-N.y)*ao);
  vec3 Hh=uSunL+V; Hh/=max(length(Hh),1e-4);
  float sp=pow(max(dot(N,Hh),0.),uMatA.w)*uMatA.z*cs;
  col+=uSunCol*sp*(.3+.7*s2)*(1.+2.*uMatB.w*tipw);
  float rim=pow(1.-max(dot(N,V),0.),3.);
  col+=(uSkyCol*.8+uSunCol*.3*cs*max(dot(-V,uSunL)*.5+.5,0.))*rim*uMatB.y*ao;
#ifdef LEAF
  {
    // (round 10) a leaf in the shade carries the sky: slate-blue fill, strongest along its raised edges and at its tip
    float shd=max(.3*(1.-smoothstep(.08,.5,(diff+back)*cs*(.5+.5*ao))),1.-smoothstep(.02,.07,dot(col,vec3(.2126,.7152,.0722))));
    float edge=clamp(pow(1.-abs(dot(N,V)),2.)*.8+smoothstep(.7,1.,vW.y)*.5,0.,1.);
    col+=vec3(.32,.7,.9)*dot(uSkyCol,vec3(.3,.5,.2))*shd*(.8+.2*ao)*(.125+.07*edge);
  }
#endif
  float alpha=1.;
  ${So}
}`,An=`
${F0}
attribute vec4 iPos; attribute vec4 iRot;
uniform float uUT;
varying vec3 vP; varying vec3 vN; varying vec3 vL; varying float vVis;
${zo}
void main(){
  vec3 p=position, n=normal; float sc=iPos.w, vis=1.; vec3 c=iPos.xyz; vL=position;
#ifdef DROP
  // iRot = (fall height, period, phase, keyed-to-progress flag); drops fall slowed, at 60 m/s
  float tf=iRot.x/60., tt=mix(fract(uTime/max(iRot.y,.1)+iRot.z)*iRot.y,uUT+tf,iRot.w);
  #ifdef CROWN
    // a ring of droplets thrown up where the drop lands: position.x carries nothing, aK the ring index
    float k=tt-tf, life=1.2;
    float r0=fract(sin(dot(c.xz,vec2(12.9,78.2)))*437.5);
    vec2 dir=vec2(cos(r0*6.283),sin(r0*6.283));
    vis=step(0.,k)*step(k,life);
    float kk=clamp(k,0.,life);
    c.xz+=dir*(2.+r0*3.)*kk*3.2; c.y+=kk*(17.+9.*r0)-kk*kk*22.;
    sc*=(1.-kk/life*.6);
  #else
    vis=step(tt,tf); c.y+=iRot.x-60.*min(tt,tf);
    p.y*=1.25; p.xz*=.9+.06*sin(uTime*9.+iRot.z*30.);
  #endif
#else
  p*=1.+.035*sin(uTime*(5.+3.*iRot.w)+iRot.w*30.+position.yxz*2.);       // trembling
#endif
  p=p*sc*vis+c;
  vP=p; vN=n; vVis=vis;
  vec4 mvPosition=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
  vDepth=-mvPosition.z;
}`,Cn=`
${Po}
${F0}
uniform float uFade; uniform vec3 uUnder;
varying vec3 vP; varying vec3 vN; varying vec3 vL; varying float vVis;
void main(){
  ${fa}
  if(vVis<.5) discard;
  vec3 N=vN/max(length(vN),1e-4);
  vec3 toC=uCamL-vP; float dist=length(toC); vec3 V=toC/max(dist,1e-3);
#ifdef RIPPLE
  float rr=length(vL.xz), wv=sin(rr*9.-uTime*3.)*.5+sin(rr*17.-uTime*4.3+2.)*.3;
  vec2 rd=vL.xz/max(rr,1e-3); N=vec3(rd.x*wv*.16,1.,rd.y*wv*.16); N/=max(length(N),1e-4);
#endif
  float ndv=max(dot(N,V),0.);
  vec3 R=reflect(-V,N);
  vec3 up=R; up.y=abs(up.y)+.02; up/=max(length(up),1e-4);
  vec3 refl=skyMirror(up);
#ifdef RIPPLE
  vec3 col=refl*(.25+.75*pow(1.-ndv,2.))+uUnder*.35*ndv;
#else
  // the world upside-down inside the drop: sky below, the dark red ground above
  vec3 d=-R; float sk=smoothstep(-.15,.25,-d.y);
  vec3 dd=vec3(d.x,abs(d.y)+.05,d.z); dd/=max(length(dd),1e-4);
  vec3 inside=mix(uUnder,skyMirror(dd)*.9,sk);
  float fres=pow(1.-ndv,2.2);
  vec3 col=inside*(1.-fres*.7)+refl*(.12+fres*.95);
  col+=uHorizCol*.5*pow(max(dot(N,-uSunL),0.),6.)*(.3+ndv);      // light gathered on the far side
#endif
  float cs=cloudShadow(vP.xz);
  col+=uSunCol*5.*pow(max(dot(R,uSunL),0.),160.)*cs;
  col+=uSunCol*.5*pow(max(dot(R,uSunL),0.),12.)*cs;
  float alpha=1.;
  ${So}
}`,Bn=`
attribute float aAO; varying vec3 vP; varying vec3 vN; varying float vAO;
${zo}
void main(){
  vP=position; vN=normal; vAO=aAO;
  vec4 mvPosition=modelViewMatrix*vec4(position,1.); gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
  vDepth=-mvPosition.z;
}`,Nn=`
${Po}
${F0}
uniform float uFade; uniform vec4 uPatch; uniform vec4 uRun; uniform vec4 uHeath; uniform vec3 uTint; uniform float uTexS;
varying vec3 vP; varying vec3 vN; varying float vAO;
vec2 vor(vec2 p){
  vec2 i=floor(p), f=fract(p); float d1=9., d2=9., id=0.;
  for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){
    vec2 g=vec2(float(x),float(y)); vec2 r=g+vec2(h21(i+g),h21(i+g+57.3))*.8+.1-f; float d=dot(r,r);
    if(d<d1){ d2=d1; d1=d; id=h21(i+g+11.7); } else if(d<d2){ d2=d; }
  }
  return vec2(sqrt(d2)-sqrt(d1),id);
}
// x = gap between the two nearest cells, y = the cell's id, zw = from the cell's centre to here
vec4 cells(vec2 p){
  vec2 i=floor(p), f=fract(p), rb=vec2(0.); float d1=9., d2=9., id=0.;
  for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){
    vec2 g=vec2(float(x),float(y)); vec2 r=g+vec2(h21(i+g),h21(i+g+57.3))*.8+.1-f; float d=dot(r,r);
    if(d<d1){ d2=d1; d1=d; id=h21(i+g+11.7); rb=r; } else if(d<d2){ d2=d; }
  }
  return vec4(sqrt(d2)-sqrt(d1),id,-rb);
}
#define LD(f) clamp(1.3-fw*(f)*2.6,0.,1.)
#if MODE == 2
#define AMB 1.45
#define GLOW .15
#define WRAP .22
#else
#define AMB 1.
#define GLOW .09
#define WRAP 0.
#endif
void main(){
  ${fa}
  vec3 P=vP; vec3 Ng=vN/max(length(vN),1e-4); if(!gl_FrontFacing) Ng=-Ng;
  vec3 toC=uCamL-P; float dist=length(toC); vec3 V=toC/max(dist,1e-3);
  vec3 alb; float hgt, wet, bumpK, flatK=0., poolK=0.;
  // every pattern fades to its mean where a pixel is too big for it (fw = stage metres per pixel), so nothing sparkles
  float fw=length(fwidth(P));
#if MODE == 0
  vec2 p=P.xz;
  float la=clamp(1.4-fw*4.5,0.,1.), lb=clamp(1.4-fw*5.5,0.,1.), lc=LD(.14);   // the squamule mosaic is for near: ten pixels a scale reads as brickwork
  flatK=smoothstep(.1,.38,min(length(dFdx(P)),length(dFdy(P))));
  Ng=normalize(mix(Ng,vec3(0.,1.,0.),.85*flatK));
  float n1=fbm(p*.012+3.), n2=mix(.5,vn(p*.05+3.),LD(.05));
  vec2 v=vor(p*.3+fbm(p*.05)*1.5);
  vec2 v2=vor(p*1.1+4.);
  vec3 sq=mix(uPal[0]*.5,vec3(.36,.44,.34),mix(.5,v.y,la)*.8);
  sq=mix(sq,uPal[0]*.62,mix(.4,smoothstep(.25,.5,v.x),la)*.5);
  sq*=.66+.34*mix(.78,smoothstep(0.,.22,v.x),la);
  sq*=.8+.3*mix(.72,smoothstep(0.,.3,v2.x),lb);
  float bare=smoothstep(.5,.62,n1+.25*n2);
  vec2 t=vor(p*.14+7.);
  vec3 gran=mix(vec3(.24,.24,.27),vec3(.46,.43,.4),mix(.5,vn(p*.6),la))*(.82+.25*mix(.5,vn(p*1.7),LD(1.7)));
  float tile=mix(.86,smoothstep(0.,.1,t.x),lc);
  vec3 mapl=mix(vec3(.4,.43,.12),vec3(.28,.35,.1),mix(.5,t.y,lc))*(.8+.3*mix(.5,vn(p*2.),LD(2.)))*tile+vec3(.015)*(1.-tile);
  vec3 rockc=mix(gran,mapl,smoothstep(.5,.66,vn(p*.025+11.)));
  alb=mix(sq,rockc,bare);
  hgt=mix(mix(.75,smoothstep(0.,.3,v.x),la)*1.6+mix(.5,v.y,la)*.6+mix(.3,v2.x,lb)*.5,mix(.3,t.x,lc)*.6+mix(.5,vn(p*3.),LD(3.))*.4,bare);
  wet=.35; bumpK=.4*clamp(1.15-fw*6.,0.,1.);     // the areoles' relief is for near: far off it lights each one like a brick
#elif MODE == 1
  // the bearberry mat: leaves near, and at any distance a patchwork that is not one plant: crimson bearberry, stands
  // gone claret, russet and gold where it has turned, green-black crowberry, grey lichened stones flush with the mat
  // and dark wet soil between. The patches fade by pixel size like everything else, the big ones last.
  vec2 p=P.xz;
  vec2 sdir=uSunL.xz/max(length(uSunL.xz),1e-3);
  float reg=vn(p*.05+2.);
  float ca=cos(reg*5.), sa=sin(reg*5.);
  vec2 q=vec2(ca*p.x+sa*p.y,-sa*p.x+ca*p.y);
  vec2 v=vor(vec2(q.x*1.5,q.y*.75)+fbm(p*.2)*.8);
  vec2 vb=vor(vec2(q.y*1.3,q.x*.7)+9.);
  float ll=LD(1.3);
  float lf=mix(.8,smoothstep(0.,.16,v.x),ll), ly=mix(.5,v.y,ll);
  float lpA=clamp(1.3-fw*.22,0.,1.), lpB=clamp(1.3-fw*.7,0.,1.);
  float a1=vn(p*.12+41.), a2=fbm(p*.03+5.), a3=vn(p*.36+13.), a3s=vn((p+sdir*1.1)*.36+13.), a4=vn(p*.17+77.);
  float pick=a1*.62+a3*.38;
  vec3 leaf=mix(uPal[1]*.42,uPal[1]*.95+vec3(.08,0.,0.),ly);
  leaf=mix(leaf,uPal[2]*.75,step(.93,v.y)*ll);
  leaf=mix(leaf,vec3(.28,.05,.07),step(v.y,.12)*ll);
  leaf=mix(leaf,leaf*vec3(.5,.42,.5),smoothstep(.42,.62,a2)*.7);
  leaf=mix(leaf,vec3(.4,.13,.045)*(.65+.7*ly),smoothstep(.5,.56,pick)*.85*lpA);
  leaf=mix(leaf,uPal[2]*.6*(.65+.7*ly),smoothstep(.62,.67,pick)*.85*lpA);
  leaf=mix(leaf,vec3(.035,.06,.03)*(.6+.9*ly),smoothstep(.6,.67,a4*.7+a3*.3)*.9*lpA);
  leaf=mix(leaf,vec3(.16,.26,.1)+leaf*.3,uGreen*.8*step(.35,fract(v.y*7.3)));
  float lee=clamp((a3s-a3)*4.,-1.,1.);
  leaf*=1.-(.34*max(lee,0.)-.2*max(-lee,0.))*lpB;
  vec3 under=mix(vec3(.05,.035,.03),uPal[3]*.3,mix(.5,vb.y,ll))*(.5+.5*mix(.8,smoothstep(0.,.2,vb.x),ll));
  float soil=max(smoothstep(.5,.6,a2*.75+.25*vn(p*.4)+.1*(.5-a1)),smoothstep(.66,.74,vn(p*.5+3.)*.7+a1*.3)*lpB);
  alb=mix(mix(under,leaf,lf),under*1.3+vec3(.02),soil*.85);
  vec2 sg=vor(p*.1+3.3+(a3-.5)*.25);
  float isP=step(.9,sg.y);                                   // some of the hollows hold rain: pools with the sky in them
  float stn=step(.78,sg.y)*(1.-isP)*smoothstep(.16,.26,sg.x)*lpA;
  float pool=isP*smoothstep(.17,.25,sg.x+(a3-.5)*.08)*lpA;
  vec3 stc=mix(vec3(.3,.3,.32),vec3(.4,.43,.2),smoothstep(.45,.65,vn(p*.8+5.)))*(.8+.35*mix(.5,vn(p*3.1),LD(3.1)))*(.75+.25*smoothstep(.16,.5,sg.x));
  alb=mix(alb,stc,stn);
  alb=mix(alb,vec3(.03,.028,.03),pool);
  alb*=1.-.45*step(.78,sg.y)*(1.-smoothstep(.1,.2,sg.x))*smoothstep(.02,.1,sg.x)*lpA;      // the dark seam where a stone meets the mat
  vec2 ra=uRun.xy, ab=uRun.zw-uRun.xy; float hh=clamp(dot(p-ra,ab)/max(dot(ab,ab),1e-3),0.,1.);
  float rd=length(p-ra-ab*hh)+(vn(p*.3)-.5)*1.5;
  float run=1.-smoothstep(1.2,2.8,rd);
  alb=mix(alb,mix(vec3(.3,.24,.14),uPal[6]*.42,mix(.5,vn(p*1.7),LD(1.7))),run*.9);
  float snw=uSnow*smoothstep(.56,.8,fbm(p*.08+70.)+.25*(1.-lf))*(.45+.4*(1.-lf));
  alb=mix(alb,vec3(.72,.76,.84),snw);
  float gu=vn(p*.045-uTime*vec2(.42,.12)); alb*=.86+.3*gu*lf;
  poolK=pool*(1.-snw)*(1.-run);
  hgt=(lf*(1.-run)*(1.-stn)+mix(.3,vb.x,ll)*.4)*(1.-pool); wet=(.9*lf*(1.-run)+.1)*(1.-snw)*(.6+.8*gu)*(1.-.7*stn)*(1.-.6*soil); bumpK=.16*(1.-.7*snw);
#elif MODE == 2
  // the tundra bench and the slope above it. Plants are separate clumps, never a wash: thickets a few metres across,
  // shrub mounds a metre and a half across and a ground of small cushions, each of one species and one colour (gold
  // willow, orange birch, crimson bearberry, russet cottongrass, pale lichen, green-black crowberry), each lit on its
  // sunward side, with dark soil in the gaps. On the slope: scree with boulders, grey outcrops that shade the ground
  // beside them, dark gullies down the fall line. Nothing here follows a contour.
  vec2 p=P.xz;
  vec2 sdir=uSunL.xz/max(length(uSunL.xz),1e-3);
  vec2 gd=Ng.xz/max(length(Ng.xz),1e-3); float cz=mix(p.x,p.y,gd.x*gd.x);
  vec3 t=mix(tundraCol(p*.7+vec2(40.,0.),fw*.7),tundraCol(p*4.5+vec2(11.,70.),fw*4.5),.55)*1.3;   // a patchwork at two sizes
  float c1=mix(.5,vn(p*1.3+3.),LD(1.3)), c2=mix(.5,vn(p*3.7+11.),LD(3.7)), c3=mix(.5,vn(p*9.+5.),LD(9.));
  vec3 gold=uPal[2]*.6, oran=vec3(.5,.19,.05), crim=uPal[1]*.66, rus=uPal[3]*.52, pale=mix(uPal[0],uPal[6],.35)*.45, dkg=vec3(.05,.07,.035);
  float com=vn(p*.045+31.), com2=vn(p*.11+17.);
  vec2 pwb=p+(vec2(vn(p*.9+3.),vn(p*.9+17.))-.5)*.7;                 // no clump is a circle
  vec4 kc=cells(p*.17+fbm(p*.05)*1.1), ka=cells(pwb*.6+fbm(p*.17)*.7), kb=cells(pwb*1.9+7.), kd=cells(p*.055+fbm(p*.02+9.)*1.3+23.);
  vec4 kl=cells(pwb*6.1+3.);                                    // sprays of leaves a hand across
  float fwg=sqrt(length(dFdx(P))*length(dFdy(P)));              // ground seen aslant: a pixel is long but narrow, and a mound still shows
  float lkC=clamp(1.6-fw*.5,0.,1.), lkA=clamp(1.5-fwg*3.2,0.,1.), lkB=clamp(1.5-fwg*5.,0.,1.), lkD=clamp(1.6-fw*.16,0.,1.);
  float lkL=clamp(1.5-fwg*15.,0.,1.), lkCr=clamp(1.5-fwg*1.9,0.,1.);
  // a thicket is whole shrubs: each crown belongs to the thicket its own middle stands in, so the outline of a thicket
  // is the outline of its outermost crowns (far off, where a crown is under a pixel, it is a soft blot)
  vec4 kcc=cells((p-ka.zw/.6)*.17+fbm(p*.05)*1.1);
  float qc=fract(mix(kc.y,kcc.y,lkCr)*2.31+com*1.2), qa=fract(ka.y*3.17+com*1.6+qc*.35), qb=fract(kb.y*5.71+com2*1.3);
  vec3 cC=mix(crim,gold,step(.3,qc)); cC=mix(cC,rus,step(.5,qc)); cC=mix(cC,oran,step(.66,qc)); cC=mix(cC,pale,step(.8,qc)); cC=mix(cC,dkg*2.,step(.93,qc));
  vec3 cA=mix(crim,gold,step(.3,qa)); cA=mix(cA,oran,step(.5,qa)); cA=mix(cA,rus,step(.68,qa)); cA=mix(cA,dkg,step(.84,qa)); cA=mix(cA,crim*1.2,step(.92,qa));
  vec3 cB=mix(pale,rus,step(.34,qb)); cB=mix(cB,crim*.8,step(.56,qb)); cB=mix(cB,gold*.8,step(.76,qb)); cB=mix(cB,dkg,step(.9,qb));
  cC*=.8+.4*fract(kc.y*4.3); cA*=.75+.5*fract(ka.y*7.7); cB*=.8+.4*fract(kb.y*9.1);
  cC=mix(cC,vec3(.14,.24,.09)+cC*.3,uGreen*.7*step(.3,fract(kc.y*6.1)));
  cA=mix(cA,vec3(.14,.24,.09)+cA*.3,uGreen*.7*step(.35,fract(ka.y*5.3))); cB=mix(cB,vec3(.12,.22,.08)+cB*.3,uGreen*.6*step(.4,fract(kb.y*3.3)));
  // the outline of a plant is leaves, not a compass line: every edge is broken at the size of a spray and of a leaf
  float rg1=vn(p*4.3+7.)-.5, rg2=(mix(.5,vn(p*11.+2.),lkB)-.5);
  float rC=length(kc.zw)+(vn(p*.45+5.)-.5)*.16+(vn(p*1.3+2.)-.5)*.1, rA=length(ka.zw), rB=length(kb.zw);
  float szB=.33+.15*fract(kb.y*6.7);
  float blobC=1.-smoothstep(.34,.44,rC);
  float blobA=smoothstep(.03,.13,ka.x+rg1*.1+rg2*.06)*(1.-smoothstep(.5,.66,rA+rg1*.16+rg2*.08));       // one shrub, a dark seam round it
  float blobB=smoothstep(.02,.1,kb.x+rg2*.05)*(1.-smoothstep(szB*.9,szB*1.25,rB+rg2*.1));               // one cushion
  float inT=1.-smoothstep(.34,.42,length(kcc.zw)+(fract(ka.y*13.3)-.5)*.16);
  float thk=mix(blobC,inT*blobA,lkCr);
  float domeC=1.-smoothstep(0.,.44,rC), domeB=1.-smoothstep(0.,szB,rB);
  float sideC=dot(kc.zw/max(length(kc.zw),1e-3),sdir), sideA=dot(ka.zw/max(rA,1e-3),sdir), sideB=dot(kb.zw/max(rB,1e-3),sdir);
  float litA=(1.+.3*sideA*smoothstep(.12,.5,rA))*(.95-.25*(1.-smoothstep(0.,.3,rA)));                  // lit on its sunward side, dark at the core
  vec3 soil=vec3(.06,.045,.035)+rus*.12;
  vec3 mB=(pale*.3+rus*.2+crim*.14+gold*.13+dkg*.08)*.8+soil*.25;
  vec3 grd=mix(mB,mix(soil,cB*(1.+.22*sideB*(1.-domeB*.6))*(.75+.25*domeB),blobB),lkB);                  // the cushions
  float has=step(.3,fract(ka.y*9.7+com*.5));                                                             // most cells hold a shrub, the rest are open cushion ground
  // a shrub of the mat: its own colour, a third of its sprays another plant grown through it, every spray of its own tone
  vec3 shr=mix(cA,cB,step(.68,fract(kb.y*4.7+ka.y*3.))*.7*lkB);
  shr*=mix(1.,(.72+.5*fract(kb.y*9.1))*(.7+.3*smoothstep(0.,.12,kb.x)),lkB)*litA;
  shr=mix(shr,(rus*.7+dkg)*.8,.2);                             // the mat is duller than the bushes that stand on it
  vec3 nearc=mix(grd,mix(soil*(.75+.5*kl.y),shr,blobA),has);
  float lfT=(.68+.6*kl.y)*(1.-.6*(1.-smoothstep(.03,.15,kl.x)));
  nearc*=mix(1.,lfT,lkL);
  nearc=mix(nearc,soil*.8,step(.88,fract(kl.y*5.3))*lkL*.7);  // a gap through to the litter here and there
  vec3 thick=mix(cC,cA,.3*lkCr)*(1.+.18*sideC*(1.-domeC*.5))*(.78+.22*domeC);
  thick*=mix(1.,(.8+.4*fract(ka.y*4.9))*litA,lkCr);
  // far off the ground is still plants, not a wash: stands of one species some tens of metres across with dark
  // ground between them, and on those the thickets, each with a lit and a shadowed side
  float qd=fract(kd.y*3.71+com*.9);
  vec3 cD=mix(crim,rus,step(.34,qd)); cD=mix(cD,gold*.9,step(.56,qd)); cD=mix(cD,crim*.62,step(.72,qd)); cD=mix(cD,pale,step(.88,qd));
  cD=mix(cD,vec3(.14,.24,.09)+cD*.3,uGreen*.7*step(.3,fract(kd.y*6.1)));
  float edD=smoothstep(.03,.16,kd.x+(c1-.5)*.1);
  vec3 stand=mix(t,mix(soil*1.6+t*.25,cD*(.74+.4*fract(kd.y*8.3)),edD),.8*lkD);
  // between the thickets: the low crowns of single shrubs, dark between them
  vec3 opn2=stand*.5*mix(1.,mix(.6,.82+.45*fract(ka.y*4.9),blobA),lkCr);
  vec3 farc=mix(stand,mix(opn2,mix(thick,stand,.25),thk),lkC);
  vec3 tc=mix(farc,mix(nearc,thick,.3*thk),lkA);
  tc*=.9+.16*c2*(.5+c3);
  float m1=mix(.5,vn(p*27.+9.),LD(27.)), m2=mix(.5,vn(p*80.+3.),LD(80.));        // leaf and litter grain, seen magnified or from a metre up
  tc*=.82+.22*m1+.14*m2;
  float hb=1.-smoothstep(uHeath.y*.6,uHeath.y,abs(p.x-uHeath.x)+(fbm(p*.03)-.5)*14.);
  hb=max(hb,smoothstep(.55,.67,fbm(p*.011+31.)+(fract(kc.y*7.3)-.5)*.12*lkC)*smoothstep(.87,.95,Ng.y));
  // lichen heath: reindeer lichen in cushions, each a little paler or greyer than the next with a dark seam of litter
  // between; grey-green patches among the cream; russet tufts and dark crowberry here and there
  vec3 heath=mix(uPal[0],uPal[6],.35)*(.35+.1*mix(.5,vn(p*2.3),LD(2.3)))*(.85+.2*vn(p*.4));
  heath*=mix(1.,(.8+.4*vn(pwb*2.3+5.))*(.88+.2*domeB)*(1.+.12*sideB*(1.-domeB))*(.86+.14*smoothstep(0.,.07,kb.x+rg2*.04)),lkB);   // soft mounds, lit on the sunward side (a cushion of one flat tone with a seam round it reads as a cobble)
  heath=mix(heath,heath*vec3(.74,.86,.74),smoothstep(.5,.62,vn(p*.7+41.))*.7);
  heath=mix(heath,soil*1.5+rus*.25,(1.-smoothstep(.0,.1,ka.x+rg1*.12))*.5*lkA*smoothstep(.45,.6,vn(p*.31+13.)));     // litter between the patches, here and there (all round every patch it reads as paving)
  heath=mix(heath,uPal[3]*.42,.5*mix(.2,smoothstep(.6,.8,vn(p*.9+7.)),LD(.9)));
  heath=mix(heath,mix(uPal[3]*.55,dkg*1.6,step(.93,fract(kb.y*3.7))),blobB*step(.76,fract(kb.y*3.7))*lkB*.85);
  heath*=mix(1.,.86+.3*kl.y,lkL)*(.88+.16*m1+.1*m2);
  tc=mix(tc,heath,hb*.9);
  // caribou trails: a few winding lines on the level ground, and the herd's own trodden line (two ruts that part and
  // join) along the heath lane
  float flatg=smoothstep(.955,.99,Ng.y);
  float trn=(fbm(p*.018+3.)*2.+vn(p*.05+9.)*.4)*2.4, trw=abs(fract(trn)-.5);
  float trm=trw/max(fwidth(trn),1e-5)*fw;
  float trail=(1.-smoothstep(.22,.42+fw,trm))*flatg*clamp(1.4-fw*1.6,0.,1.)*smoothstep(.3,.5,vn(p*.012+60.));
  float hxl=p.x-(uHeath.x-.4+1.1*sin(p.y*.03));
  float rut=max(1.-smoothstep(.14,.3+fw*.5,abs(hxl+(vn(p*.5)-.5)*.5)),(1.-smoothstep(.1,.24+fw*.5,abs(hxl-1.3-(vn(p*.19+4.)-.5)*2.)))*.8);
  trail=max(trail,rut*flatg*clamp(1.5-fw*1.1,0.,1.)*uHeath.z);
  tc=mix(tc,vec3(.11,.085,.065),trail*.7);
  // rain stands in the hollows of the level ground: pools with a dark wet rim, the sky in them
  float plN=vn(p*.085+77.)*.62+vn(p*.27+5.)*.38, plF=smoothstep(.972,.99,Ng.y)*(1.-hb*.8)*(1.-trail);
  float pool2=smoothstep(.655,.68,plN)*plF;
  tc=mix(tc,tc*.45,smoothstep(.6,.655,plN)*plF);
  tc=mix(tc,vec3(.03,.028,.03),pool2);
  vec2 rv=vor(p*.19+11.); vec2 st=vor(p*2.2); float ls=LD(2.2);
  float ring=(1.-smoothstep(.04,.12,rv.x))*smoothstep(.45,.6,vn(p*.012+8.))*LD(.7)*smoothstep(.975,.995,Ng.y)*smoothstep(.45,.6,vn(p*.13+31.));   // sorted stones on dead-level ground, in broken arcs: never a net
  vec3 stone=mix(vec3(.24,.24,.25),uPal[4]*.42,mix(.5,st.y,ls))*(.45+.55*mix(.75,smoothstep(0.,.2,st.x),ls));
  tc=mix(tc,stone,ring);
  // scree: stones near; at a distance boulders with a lit and a shadowed side, runs of older lichened stone, tongues of tundra
  vec2 sv=vor(p*1.5+5.+(vn(p*.8)-.5)*.7), sv2=vor(p*4.3+1.); float l15=clamp(1.4-fwg*4.5,0.,1.), l43=LD(4.3);
  float big=smoothstep(.35,.65,vn(p*.23+9.));               // blocks here, fine rubble there
  float old=fbm(p*.023+61.);
  float scr=1.-smoothstep(.82,.93,Ng.y+(vn(p*.08)-.5)*.08);
  scr*=smoothstep(.25,.6,vn(p*.11+3.)+.55*scr);
  // tongues of scree run down the fall line onto the gentler ground below, each with an edge
  scr=max(scr,smoothstep(.57,.65,vn(vec2(cz*.085+old*1.5,P.y*.03+7.))+(vn(p*.37+5.)-.5)*.16)*(1.-smoothstep(.93,.985,Ng.y))*.92);
  scr=max(scr,(1.-smoothstep(uPatch.x-50.,uPatch.x+10.,P.z))*smoothstep(.47,.6,fbm(p*.017+41.))*.92);   // boulder fields up the col
  vec3 scc=mix(vec3(.25,.245,.26),vec3(.44,.41,.385),mix(.5,sv.y,l15))*(1.-.15*big*mix(.25,1.-smoothstep(0.,.14,sv.x),l15))*(1.-.22*(1.-.6*big)*mix(.3,1.-smoothstep(0.,.22,sv2.x),l43))*(.85+.3*mix(.5,vn(p*7.),LD(7.)));
  scc=mix(scc,vec3(.36,.4,.13),step(.84,sv2.y)*.55*l43);
  float lbl=clamp(1.3-fw*1.3,0.,1.), bA=vn(p*.62+21.), bAs=vn((p+sdir*.7)*.62+21.), leeS=clamp((bAs-bA)*4.5,-1.,1.);
  scc*=1.-(.38*max(leeS,0.)-.22*max(-leeS,0.))*lbl;
  scc*=mix(vec3(.64,.66,.75),vec3(1.1,1.05,.96),smoothstep(.35,.65,old));
  scc*=mix(.8,1.08,smoothstep(.4,.6,vn(vec2(cz*.11+old*2.,P.y*.04+3.))+(vn(p*.5+9.)-.5)*.2));          // runs of fresh and of weathered stone down the fall line
  // stones a metre across, each with a lit side and a dark gap round it; far off, separate blocks the size of a hut,
  // each with a lit side and a shadow thrown down-sun
  float szS=.13+.3*fract(ka.y*5.9)*fract(ka.y*5.9), stA=(1.-smoothstep(szS*.75,szS,rA+rg1*.12))*step(.45,fract(ka.y*7.1));   // (of mixed size and not in every cell: evenly, they read as cobbles)
  scc*=mix(1.,mix(.68,(.8+.5*fract(ka.y*3.9))*(1.+.4*sideA),stA),lkA*.9);
  float rK=length(kc.zw), bz=.15+.15*fract(kc.y*5.7), isB=step(.4,fract(kc.y*13.1)), bl=(1.-smoothstep(bz*.8,bz,rK+rg1*.03))*isB;
  float blS=(1.-smoothstep(bz*.8,bz*1.7,length(kc.zw+sdir*bz*1.4)))*isB*(1.-bl);
  scc*=mix(1.,(.85+.45*fract(kc.y*3.3))*(1.+.45*sideC),bl*lkC*(1.-.5*lkA));
  scc*=1.-.45*blS*lkC*(1.-.5*lkA);
  float chute=smoothstep(.52,.74,vn(vec2(cz*.045+old*2.,P.y*.016+3.))+(vn(p*.21+3.)-.5)*.22);
  scc*=1.-.42*chute;
  scc=mix(scc,tc*.9,smoothstep(.52,.66,fbm(p*.021+17.)+.2*(Ng.y-.8))*.85);
  alb=mix(tc,scc,scr);
  // grey outcrops on the open slope, each shading the ground on its lee side; dark gullies
  float rocky=(1.-smoothstep(.95,.992,Ng.y))*(1.-hb)*(1.-scr);
  float lo=clamp(1.3-fw*.45,0.,1.);
  float on=vn(p*.075+50.)*.6+vn(p*.21+9.)*.4, ons=vn((p+sdir*2.2)*.075+50.)*.6+vn((p+sdir*2.2)*.21+9.)*.4;
  float oc=smoothstep(.6,.65,on)*rocky*lo, ocs=smoothstep(.6,.65,ons)*rocky*lo;
  vec3 ocol=mix(vec3(.19,.19,.215),vec3(.45,.41,.36),mix(.5,sv.y,l15)*.5+.5*vn(p*.35+2.))*(.8+.4*c2);
  alb=mix(alb,ocol,oc*.92);
  alb*=1.-.5*clamp(ocs-oc,0.,1.);
  alb*=1.-.34*chute*rocky*clamp(1.3-fw*.12,0.,1.);
  // old snow lies in drifts with an edge (a soft wash of it reads as a smear of one tone); more of them when it has snowed
  float sth=mix(.8,.63,uSnow), snf=fbm(vec2(p.x*.035,p.y*.08)+77.)+.06*(c1-.5);
  float sn=smoothstep(sth,sth+.035,snf)*step(.02,uSnow)*(.9-.4*scr*smoothstep(.35,.6,sv.y)*l15);
  alb=min(alb,vec3(.46));                                    // nothing here is paler than dry lichen: no white-out under a bright overcast
  alb=mix(alb,vec3(.74,.78,.86),sn);
  hgt=mix((blobA*has*.1+thk*.07)*lkA*(1.-hb)+blobB*.05*lkB+min(kl.x*4.,1.)*.03*lkL+c3*.04-trail*.1+ring*mix(.3,st.x,ls)*.6,mix(.3,sv.x,l15)*.2*big+mix(.3,sv2.x,l43)*.22+mix(.5,vn(p*2.6+3.),LD(2.6))*.25+stA*.3*lkA+bl*.8*lkC-chute*.8,scr)+oc*1.2; wet=(.03+.07*scr)*(1.-sn); bumpK=.4*(1.-.85*sn);
  poolK=pool2*(1.-scr)*(1.-sn)*(1.-oc)*.8; hgt*=1.-poolK; bumpK*=1.-poolK;
#elif MODE == 4
  // feldspar crystals standing out of the granite, as tall as a house at this scale: flat cleavage faces that flash
  // in the low sun, growth lamellae along their length, dark mica flecks, a skin of crust lichens toward the foot
  vec3 q=P*uTexS; float fq=fw*uTexS;
  float lam=dot(q,vec3(.31,.92,.24)), cro=dot(q,vec3(.8,-.2,.5));
  float lf=clamp(1.4-fq*4.,0.,1.), lf2=clamp(1.4-fq*14.,0.,1.);
  float l1=mix(.5,vn(vec2(lam*1.6,cro*.12)),lf), l2=mix(.5,vn(vec2(lam*5.5,cro*.3+3.)),lf2);
  vec3 g=mix(vec3(.2,.14,.15),vec3(.52,.4,.37),smoothstep(.2,.8,l1*.62+l2*.38))*uTint;
  vec2 fk=vor(vec2(cro,dot(q,vec3(.1,.3,-.9)))*1.3+lam*.7);
  g=mix(g,vec3(.03,.03,.035),step(.8,fk.y)*smoothstep(.1,.3,fk.x)*.8*clamp(1.4-fq*8.,0.,1.));       // mica
  g=mix(g,vec3(.62,.6,.56)*uTint*1.6,smoothstep(.72,.8,vn(vec2(cro*.5+lam*.2,lam*.06)))*.6*lf);     // a quartz vein
  float low=1.-smoothstep(.3,.8,vAO);
  float cf=fbm(q.xz*.5+q.y*.4+7.);
  g=mix(g,vec3(.3,.34,.27)*(.75+.5*l2),smoothstep(.5,.62,cf+low*.25)*.75);                           // grey-green crust
  g=mix(g,vec3(.5,.3,.05),smoothstep(.66,.72,fbm(q.xz*.9+q.y*.7+29.))*.7*clamp(1.4-fq*2.,0.,1.));  // orange crust
  g=mix(g,vec3(.04,.045,.04),smoothstep(.62,.7,fbm(q.zy*.7+q.x*.6+17.))*.6);
  g=mix(g,vec3(.1,.15,.04),low*low*.7);                                                             // moss at the foot
  alb=g; hgt=l1*.35+l2*.12+cf*.5; wet=1.1*(1.-.7*smoothstep(.5,.62,cf)); bumpK=.3;
#else
  vec3 q=P*uTexS; float fq=fw*uTexS;
  float k1=clamp(1.3-fq*9.,0.,1.), k2=clamp(1.3-fq*30.,0.,1.), k0=clamp(1.3-fq*.57,0.,1.);   // grain and joints are for near: ten pixels a cell reads as brickwork
  vec2 cq=mix(vec2(q.x+q.z*.6,q.y*1.4+q.z*.45),q.xz,step(.66,abs(Ng.y)));
  vec2 c1=vor(cq*.8), c2=vor(cq*2.9+5.);
  vec3 g=mix(vec3(.42,.4,.39),vec3(.6,.52,.47),mix(.5,c1.y,k1));
  g=mix(g,g*.6,smoothstep(.78,.86,c2.y)*smoothstep(0.,.12,c2.x)*k2);
  g=mix(g,g*1.22+.03,(1.-smoothstep(.1,.18,c2.y))*smoothstep(0.,.12,c2.x)*k2);
  g*=mix(.9,1.,k2)*(.86+.14*mix(.8,smoothstep(0.,.06,c1.x),k1));
  g*=uTint;
  // crustose lichens in blotches: grey-green, black, a little orange
  g=mix(g,vec3(.3,.34,.27)*(.8+.4*mix(.5,c1.y,k1)),smoothstep(.46,.58,fbm(cq*.035+7.))*.55);
  g=mix(g,vec3(.065,.065,.07),smoothstep(.6,.68,fbm(cq*.06+17.))*.6);
  g=mix(g,vec3(.55,.33,.05),smoothstep(.68,.74,fbm(cq*.11+29.))*.55*clamp(1.3-fq*.6,0.,1.));
  g=mix(vec3(.45,.42,.4)*uTint,g,.35+.65/(1.+dist*uTexS*.02));
  float upw=smoothstep(.3,.75,Ng.y);
  vec2 t=vor(cq*.22+2.); float tile=mix(.86,smoothstep(0.,.08,t.x),k0);
  float mp=smoothstep(.5,.66,fbm(cq*.05+4.))*upw*uPatch.w;
  vec3 mapl=mix(vec3(.5,.55,.08),vec3(.34,.44,.07),mix(.5,t.y,k0))*tile+vec3(.015)*(1.-tile);
  g=mix(g,mapl,mp);
  float pr=max(uPatch.z,.01);
  float cr=(1.-smoothstep(pr*.7,pr,length(P.xz-uPatch.xy)+(vn(P.xz*.8)-.5)*2.))*step(.02,uPatch.z);
  g=mix(g,uPal[0]*(.42+.2*mix(.5,vn(P.xz*3.),LD(3.))),cr*upw);
  float moss=(1.-smoothstep(.25,.55,vAO))*upw; g=mix(g,vec3(.12,.17,.05),moss*.6*uPatch.w);
  float stre=mix(.2,smoothstep(.5,.75,vn(vec2(dot(q.xz,vec2(.7,.7))*.9,q.y*.08))),clamp(1.3-fq*2.4,0.,1.))*(1.-upw);
  g*=1.-.45*stre;
  alb=g; hgt=mix(.25,c1.x,k1)*.4+mix(.5,vn(cq*2.9+3.),k2)*.3+t.x*mp*k0; wet=.35+.9*stre; bumpK=.6*min(1.,3.6/uTexS);
#endif
  vec3 dpx=dFdx(P), dpy=dFdy(P); float hx=dFdx(hgt), hy=dFdy(hgt);
  vec3 r1=cross(dpy,Ng), r2=cross(Ng,dpx); float det=dot(dpx,r1);
  vec3 nb=Ng-(hx*r1+hy*r2)*(sign(det)/max(abs(det),1e-7))*(bumpK/(1.+dist*.035)/(1.+length(fwidth(P))*8.));
  vec3 N=nb/max(length(nb),1e-4);
  float aoV=mix(vAO,.82,max(flatK,smoothstep(.45,2.,fw)));               // baked contact shadows are smaller than a pixel far off: use their mean
  float cs=cloudShadow(P.xz), ndl=max((dot(N,uSunL)+WRAP)/(1.+WRAP),0.), ao=mix(.4,1.,aoV);
  vec3 col=alb*(uSunCol*ndl*cs*(.3+.7*aoV)+uSkyCol*(.62+.62*N.y)*ao*AMB+uHorizCol*GLOW*ao+(uPal[1]*.05+uPal[6]*.05)*(1.-N.y)*ao);
#if MODE == 1
  {
    // (round 10) shade on the mat was a crimson so deep that it counted for black. The leaves are waxy: where the sun
    // does not reach they carry the sky, a slate-blue fill that comes up as the sun's share falls, and a brighter line
    // of it round each leaf's edge, so that the shade has leaves in it. It is added light, not haze.
    // (and wherever the mat comes out that dark for any reason: claret leaves under a red low sun have no green or
    // blue in them at all, lit or not)
    // (the amounts are what the film curve needs: under it a pure red throws green and blue below zero, and the
    // contrast step takes another 2.5% off, so a fill of less than about .04 is not seen at all, and a little more
    // than that is seen at once: the amount is set to come out a dusky plum-slate, about (60, 12, 22) of 255)
    float shd=max(.3*(1.-smoothstep(.08,.5,ndl*cs*(.3+.7*aoV))),1.-smoothstep(.02,.07,dot(col,vec3(.2126,.7152,.0722))));
    float edge=smoothstep(.06,.15,v.x)*(1.-smoothstep(.17,.34,v.x))*ll;
    col+=vec3(.32,.7,.9)*dot(uSkyCol,vec3(.3,.5,.2))*shd*(.85+.15*aoV)*(.125+.07*edge)*(1.-poolK);
  }
#endif
  vec3 Hh=uSunL+V; Hh/=max(length(Hh),1e-4);
  // the wet glint: where the bumped normal changes within a pixel the highlight is widened and dimmed, so that it is a
  // sheen and never a sparkle of single pixels
  float nv=length(fwidth(N)), pw=50./(1.+nv*40.);
  float sp=pow(max(dot(N,Hh),0.),pw)*cs*aoV*(pw+2.)/52.;
  col+=uSunCol*sp*wet*mix(.6,.3+.7*vn(P.xz*5.+P.y*3.),1./(1.+dist*.03))/(1.+length(fwidth(P))*3.);
  if(poolK>.001){
    vec3 Rp=reflect(-V,vec3(0.,1.,0.)); Rp.y=abs(Rp.y)+.02; Rp/=max(length(Rp),1e-4);
    col=mix(col,skyMirror(Rp)*(.75+.25*cs),poolK*mix(.6,1.,pow(1.-clamp(V.y,0.,1.),2.5)));
  }
  float alpha=1.;
  ${So}
}`,Dn=`
${F0}
attribute vec4 aS;
uniform vec3 uBox; uniform vec3 uVel; uniform vec4 uSpr;
varying float vA; varying float vB;
${zo}
void main(){
  vec3 q=position*uBox+uVel*uTime;
  q+=vec3(sin(uTime*.7+aS.y*40.),sin(uTime*.5+aS.y*23.),cos(uTime*.6+aS.y*31.))*uSpr.z;
  q=mod(q-uCamL+.5*uBox,uBox)-.5*uBox+uCamL;
  vec4 mvPosition=modelViewMatrix*vec4(q,1.);
  float dist=max(-mvPosition.z,.1), S=max(length(modelMatrix[0].xyz),1e-6);
  float px=aS.x*S*uSpr.x/dist;
  gl_PointSize=clamp(px,1.5,uSpr.y);
  vec3 dl=abs(q-uCamL)/(.5*uBox); float edge=1.-smoothstep(.75,1.,max(dl.x,max(dl.y,dl.z)));
  vA=edge*smoothstep(uSpr.w*S,uSpr.w*S*3.,dist)*min(1.,px/1.5); vB=aS.z;
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
  vDepth=-mvPosition.z;
}`,Ln=`
${Po}
${F0}
uniform vec3 uColor; uniform vec3 uLit;
varying float vA; varying float vB;
void main(){
  vec2 c=gl_PointCoord-.5; float r=dot(c,c)*4.; if(r>1.) discard;
  float a=1.-r; a*=a;
  vec3 col=uColor*(uLit.x*(uSunCol*.6+uSkyCol)+uLit.y)*(.5+vB);
  float alpha=a*vA*uLit.z;
  if(alpha<.004) discard;
  ${So}
}`,Vn=`
varying vec3 vD;
void main(){ vD=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,qn=`
${F0}
uniform float uOp; uniform float uLum; uniform vec3 uHi; uniform float uB; uniform vec3 uFogC;
varying vec3 vD;
float disc(vec2 g,float th){
  vec2 id=floor(g), f=fract(g)-.5; float r=h21(id);
  vec2 o=(vec2(h21(id+3.1),h21(id+7.7))-.5)*.3;
  return (1.-smoothstep(.26,.34,length(f+o)))*step(th,r)*(.4+.6*h21(id+1.3));
}
void main(){
  vec3 d=vD/max(length(vD),1e-4);
  float az=atan(d.x,-d.z+step(abs(d.x)+abs(d.z),1e-5));
  vec2 sp=vec2(az*2.2,d.y*3.2);
  float n=fbm(sp*1.1+uTime*.01);
  float hz=smoothstep(-.06,.72,d.y+(n-.5)*.5);
  vec2 hxz=d.xz/max(length(d.xz),1e-4), sxz=uSunL.xz/max(length(uSunL.xz),1e-4);
  float west=dot(hxz,sxz)*.5+.5;
  vec3 low=mix(uPal[1]*.42,uPal[3]*.4,fbm(sp*.8+5.));
  low=mix(low,uPal[1]*.75+uPal[2]*.08,smoothstep(.55,.8,fbm(sp*1.7+2.)));
  low*=.75+.5*west;
  vec3 high=mix(uHi,uHorizCol*.62,west*west*(1.-.5*smoothstep(.1,.7,d.y)));
  vec3 col=mix(low,high,hz);
  float b=disc(sp*2.3+vec2(uTime*.004,0.),.78)+disc(sp*4.1+7.,.84)*.7;
  col+=mix(uPal[1]*.6,uHorizCol*.4,hz)*b*.2;
  col*=uLum; float alpha=uOp;
  if(uB>.001){
    // at boulder scale: the country beyond the mat. Not a smear: two lines of low hills, each with an edge, the
    // nearer one in the mat's own dark red with gold willow along its foot, the farther one paled by the air, and
    // the mat's haze rising to meet them. Above their skyline the real sky and its clouds show through.
    float h1=.036+.06*vn(vec2(az*2.3+2.,3.))+.02*vn(vec2(az*7.+1.,9.))+.007*vn(vec2(az*23.,5.));
    float h2=.008+.04*vn(vec2(az*3.1+5.,1.))+.014*vn(vec2(az*11.,7.))+.005*vn(vec2(az*31.,2.));
    float hl=max(h1,h2);
    float below=1.-smoothstep(hl-.003,hl+.004,d.y);
    // their slopes: ribs and gullies that run down from each skyline, heath and scree in patches, willow gold in
    // drifts along the foot (t = 0 on the skyline, 1 at the foot)
    float t1=clamp((h1-d.y)/(h1+.05),0.,1.5), t2=clamp((h2-d.y)/(h2+.05),0.,1.5);
    float rib1=fbm(vec2(az*38.+t1*2.,t1*3.)+3.), rib2=fbm(vec2(az*52.-t2*2.5,t2*3.5)+17.), m=fbm(vec2(az*9.,t2*5.)+11.);
    vec3 farH=mix(uFogC,uHi*uLum,.34)*(.74+.5*rib1);
    vec3 nearH=mix(uFogC,mix(uPal[1]*.42,uPal[3]*.5,smoothstep(.3,.7,m))*uLum,.62)*(.66+.68*rib2);
    float wil=smoothstep(.5,.7,fbm(vec2(az*26.,t2*7.)+29.))*smoothstep(.4,.8,t2)*(1.-smoothstep(.95,1.3,t2));
    nearH=mix(nearH,uPal[2]*.55*uLum,wil*.5);
    vec3 sl=mix(farH,nearH,1.-smoothstep(h2-.003,h2+.004,d.y));
    sl*=1.+.3*west*smoothstep(hl-.03,hl,d.y);                                   // the crests take the low light
    // under the hills the mat goes on to their feet: its patches drawn smaller and smaller toward the horizon, in haze
    float dn=max(-d.y+.012,.012); vec2 gp=vec2(az*5.,1.)/dn;
    float gt=fbm(gp*.35+5.), gt2=fbm(gp*1.1+31.);
    vec3 flatc=mix(mix(uPal[1]*.3,uPal[3]*.6,smoothstep(.36,.6,gt)),uPal[2]*.62,smoothstep(.58,.74,gt2)*.6)*uLum*(.6+.7*gt2);
    flatc=mix(flatc,uFogC,.12+.5*smoothstep(.07,.014,dn));
    sl=mix(sl,flatc,1.-smoothstep(-.012,.006,d.y));
    sl=mix(sl,uFogC,(1.-smoothstep(-.02,.03,d.y))*.14);
    float ab=mix(.1*(1.-smoothstep(hl,hl+.22,d.y)),.97,below);
    col=mix(col,mix(uFogC,sl,below),uB); alpha=uOp*mix(1.,ab,uB);
  }
  gl_FragColor=vec4(col,alpha);
}`;class St{constructor(){this.p=[],this.c=[],this.w=[],this.i=[],this.n=0}v(n,i,g,C,d=0,M=1){return this.p.push(n,i,g),this.c.push(C[0],C[1],C[2]),this.w.push(d,M),this.n++}tri(n,i,g){this.i.push(n,i,g)}quad(n,i,g,C){this.i.push(n,i,g,n,g,C)}get tris(){return this.i.length/3}build(n=!1){let i=new m.BufferGeometry;if(i.setAttribute("position",new m.Float32BufferAttribute(this.p,3)),i.setAttribute("color",new m.Float32BufferAttribute(this.c,3)),i.setAttribute("aW",new m.Float32BufferAttribute(this.w,2)),i.setIndex(this.i),n){const g=i.toNonIndexed();i.dispose(),i=g}return i.computeVertexNormals(),i}}const tt=(a,n=1)=>{const i=new m.Color(a);return[i.r*n,i.g*n,i.b*n]},rt=(a,n,i)=>[a[0]+(n[0]-a[0])*i,a[1]+(n[1]-a[1])*i,a[2]+(n[2]-a[2])*i];function a0(a,n,i,g,C,d,M=!1){const h=n.length,w=[];let V=0,S=0,z=0;for(let B=0;B<h;B++){const N=n[Math.max(0,B-1)],f=n[Math.min(h-1,B+1)];let P=f[0]-N[0],k=f[1]-N[1],x=f[2]-N[2];const D=Math.hypot(P,k,x)||1;P/=D,k/=D,x/=D,B===0&&(Math.abs(k)<.9?(V=0,S=1,z=0):(V=1,S=0,z=0));const b=V*P+S*k+z*x;V-=b*P,S-=b*k,z-=b*x;const p=Math.hypot(V,S,z)||1;V/=p,S/=p,z/=p;const H=k*z-x*S,A=x*V-P*z,et=P*S-k*V,I=B/(h-1),F=C(B,I),j=d(B,I),_=i[B],T=[];for(let G=0;G<g;G++){const W=G/g*6.2832,X=Math.cos(W)*_,K=Math.sin(W)*_;T.push(a.v(n[B][0]+V*X+H*K,n[B][1]+S*X+A*K,n[B][2]+z*X+et*K,F,j[0],j[1]))}w.push(T)}for(let B=0;B<h-1;B++)for(let N=0;N<g;N++){const f=(N+1)%g;a.quad(w[B][N],w[B][f],w[B+1][f],w[B+1][N])}if(M){const B=h-1,N=a.v(n[B][0],n[B][1],n[B][2],C(B,1),d(B,1)[0],d(B,1)[1]);for(let f=0;f<g;f++)a.tri(w[B][f],w[B][(f+1)%g],N)}}function de(a,n,i,g=0,C=.55){const d=[];for(let M=0;M<n.length;M++){const h=n[M],w=[];for(let V=0;V<i;V++){const S=V/i*6.2832,z=Math.sin(S),B=Math.cos(S),N=h.colB?rt(h.colB,h.col,Q(-.5,.25,B)):h.col;w.push(a.v(z*h.rx,(h.y||0)+B*h.ry,h.z,N,g,J(C,1,B*.5+.5)))}d.push(w)}for(let M=0;M<n.length-1;M++)for(let h=0;h<i;h++){const w=(h+1)%i;a.quad(d[M][h],d[M+1][h],d[M+1][w],d[M][w])}for(const M of[0,n.length-1]){const h=n[M],w=a.v(0,h.y||0,h.z+(M?1:-1)*Math.max(h.rx,h.ry)*.6,h.col,g,.9);for(let V=0;V<i;V++){const S=(V+1)%i;M?a.tri(d[M][V],w,d[M][S]):a.tri(d[M][V],d[M][S],w)}}}function Tn(a,n,i,g,C,d,M=0){const h=[];for(const w of C){const V=[];for(let S=0;S<d;S++){const z=S/d*6.2832;V.push(a.v(n+Math.cos(z)*w[0],i+w[1],g+Math.sin(z)*w[0],w[2],M,w[3]??1))}h.push(V)}for(let w=0;w<C.length-1;w++)for(let V=0;V<d;V++){const S=(V+1)%d;a.quad(h[w][V],h[w+1][V],h[w+1][S],h[w][S])}}function Ht(a,n,i,g,C,d,M,h,w,V=0,S=1){const z=Math.max(3,h>>1),B=[];for(let N=0;N<=z;N++){const f=N/z*Math.PI,P=[];for(let k=0;k<h;k++){const x=k/h*6.2832;P.push(a.v(n+Math.sin(f)*Math.cos(x)*C,i+Math.cos(f)*d,g+Math.sin(f)*Math.sin(x)*M,w,V,S*(.6+.4*(Math.cos(f)*.5+.5))))}B.push(P)}for(let N=0;N<z;N++)for(let f=0;f<h;f++){const P=(f+1)%h;a.quad(B[N][f],B[N+1][f],B[N+1][P],B[N][P])}}function ua(a,n){const i=[],g=n.height,C=(z,B,N,f,P)=>{const k=[z[0]+B[0]*N,z[1]+B[1]*N,z[2]+B[2]*N];if(i.push({a:z,b:k,ra:f,rb:f*.7,order:P,h:Y(k[1]/g,0,1)}),P>=n.orders)return;const x=P===0?3:a.int(2,P<3?3:2),D=a()*6.283;let b=B[1],p=-B[0],H=0,A=Math.hypot(b,p,H);A<.2&&(b=1,p=0,H=0,A=1),b/=A,p/=A;const et=B[1]*H-B[2]*p,I=B[2]*b-B[0]*H,F=B[0]*p-B[1]*b;for(let j=0;j<x;j++){const _=D+j/x*6.283+a.range(-.4,.4),T=n.spread*a.range(.7,1.25),G=Math.cos(T),W=Math.sin(T),X=Math.cos(_),K=Math.sin(_);let bt=[B[0]*G+(b*X+et*K)*W,B[1]*G+(p*X+I*K)*W+n.lift,B[2]*G+(H*X+F*K)*W];const vt=Math.hypot(bt[0],bt[1],bt[2])||1;bt=[bt[0]/vt,bt[1]/vt,bt[2]/vt],C(k,bt,N*n.ratio*a.range(.8,1.2),f*.66,P+1)}},d=n.lean??.12,M=a()*6.283;let h=[Math.cos(M)*d,1,Math.sin(M)*d];const w=Math.hypot(h[0],1,h[2]);h=[h[0]/w,1/w,h[2]/w];let V=0,S=1;for(let z=0;z<=n.orders;z++)V+=S,S*=n.ratio;return C([0,0,0],h,g/V*1.15,n.radius,0),i}function Ao(a,n,i,g){const C=g.base,d=g.tip,M=g.orders;for(const h of n){const w=h.order<=1?g.sides:h.order<=3?Math.max(3,g.sides-2):3,V=h.order<=g.midTo,S=Math.hypot(h.b[0]-h.a[0],h.b[1]-h.a[1],h.b[2]-h.a[2]),z=[h.a],B=[h.ra];if(V){const k=S*.07;z.push([(h.a[0]+h.b[0])/2+i.range(-k,k),(h.a[1]+h.b[1])/2+i.range(-k,k),(h.a[2]+h.b[2])/2+i.range(-k,k)]),B.push((h.ra+h.rb)*.5*i.range(.85,1.12))}z.push(h.b),B.push(h.rb*(h.order===M?.55:1));const N=Y(h.a[1]/g.height,0,1),f=h.h,P=h.order===M;a0(a,z,B,w,(k,x)=>{const D=J(N,f,x),b=rt(C,d,Q(.05,.75,D)),p=P&&x>.9?.55:1;return[b[0]*p,b[1]*p*.96,b[2]*p*.9]},(k,x)=>{const D=J(N,f,x);return[D*D*(.4+.6*h.order/M),J(.5,1,Q(0,.35,D))]})}}function je(a){const n=new St,i=a.len,g=a.span/2,C=a.neck,d=a.sides||10,M=a.plump||1,h=[{z:.5*i,rx:.02*i,ry:.015*i,y:0,col:a.tail},{z:.38*i,rx:.07*i*M,ry:.05*i*M,y:0,col:a.body,colB:a.belly},{z:.18*i,rx:.13*i*M,ry:.11*i*M,y:0,col:a.body,colB:a.belly},{z:-.02*i,rx:.15*i*M,ry:.14*i*M,y:0,col:a.body,colB:a.belly},{z:-.2*i,rx:.12*i*M,ry:.12*i*M,y:.005*i,col:a.neckCol,colB:a.belly},{z:-.28*i,rx:.065*i,ry:.065*i,y:.02*i,col:a.neckCol},{z:(-.28-C)*i,rx:.045*i,ry:.045*i,y:(.04+C*.22)*i,col:a.neckCol},{z:(-.33-C)*i,rx:.06*i*a.head,ry:.058*i*a.head,y:(.05+C*.22+(a.headUp||0))*i,col:a.headCol},{z:(-.39-C)*i,rx:.028*i,ry:.024*i,y:(.04+C*.22+(a.headUp||0))*i,col:a.beak}];de(n,h,d,0,.6);const w=a.ns||10,V=4,S=.3*i*(a.chord||1),z=.09*i,B=[1,1.04,.92,.8,.62];for(const x of[-1,1]){const D=[];for(let b=0;b<=w;b++){const p=b/w,H=S*(1-(a.taperK||.72)*Math.pow(p,a.taperP||1.7)),A=-.19*i+(a.sweep||.1)*i*p*p,et=[];for(let I=0;I<=V;I++){let F=A+H*(I/V);I===V&&b%2&&(F+=.07*S*(1+p));const j=B[I]*(I>=2&&b%2?.88:1);let _=p>a.tipFrom&&I>0?a.tip:I===0?rt(a.wing,a.body,.35):[a.wing[0]*j,a.wing[1]*j,a.wing[2]*j];a.covert&&I<3&&(_=rt(_,a.body,a.covert*(1-Q(.12,.5,p))*(1-I*.25)));const T=a.camber||.012,G=a.arch||.02;et.push(n.v(x*(z+(g-z)*p),.03*i-G*i*p*p+T*i*Math.sin(I/V*3.14),F,_,x*Math.max(p,.02),.62+.38*p))}D.push(et)}for(let b=0;b<w;b++)for(let p=0;p<V;p++)n.quad(D[b][p],D[b+1][p],D[b+1][p+1],D[b][p+1])}const N=n.v(0,.01*i,.36*i,a.tailRoot||a.body,0,.8),f=.14*i*(a.tailW||1),P=(.5+(a.tailL||.12))*i,k=[];for(let x=0;x<=4;x++){const D=(x/4-.5)*1.5;k.push(n.v(Math.sin(D)*f,0,.36*i+(P-.36*i)*Math.cos(D*.6),a.tail,0,1))}for(let x=0;x<4;x++)n.tri(N,k[x],k[x+1]);return n.build()}function In(a){const n=new St,i=a.white,g=[i[0]*1.25,i[1]*1.25,i[2]*1.25],C=a.ruf,d=[.03,.03,.04],M=[.2,.22,.28],h=[[2.55,.34,.3,1.72],[1.95,.82,.76,1.78],[1.05,1.2,1.14,1.9],[.05,1.38,1.34,2.05],[-.85,1.3,1.3,2.22],[-1.55,.98,1.06,2.46]];{const D=[];for(let b=0;b<h.length;b++){const[p,H,A,et]=h[b],I=[],F=Q(.2,-1.2,p);for(let j=0;j<16;j++){const _=j/16*6.2832,T=Math.sin(_),G=Math.cos(_),W=Q(J(.9,2.2,F),J(1.3,2.75,F),Math.acos(G));I.push(n.v(T*H,et+G*A,p,rt(C,g,b===0?Math.max(W,.4):W),0,J(.55,1,G*.5+.5)))}D.push(I)}for(let b=0;b<h.length-1;b++)for(let p=0;p<16;p++){const H=(p+1)%16;n.quad(D[b][p],D[b+1][p],D[b+1][H],D[b][H])}for(const b of[0,h.length-1]){const p=h[b],H=n.v(0,p[3],p[0]+(b?-1:1)*Math.max(p[1],p[2])*.6,b?C:rt(C,g,.4),0,.9);for(let A=0;A<16;A++){const et=(A+1)%16;b?n.tri(D[b][A],H,D[b][et]):n.tri(D[b][A],D[b][et],H)}}}const w=x=>{let D=0;for(;D<h.length-2&&x<h[D+1][0];)D++;const b=h[D],p=h[D+1],H=Y((x-b[0])/(p[0]-b[0]),0,1);return[J(b[1],p[1],H),J(b[2],p[2],H),J(b[3],p[3],H)]};de(n,[{z:2.2,rx:.5,ry:.24,y:1.8,col:rt(C,d,.6)},{z:2.9,rx:.86,ry:.17,y:1.74,col:d},{z:3.75,rx:1,ry:.11,y:1.66,col:d}],8,0,.6);const V=-1.25,S=2.95;for(const x of[-1,1]){const D=(A,et,I)=>{const F=J(V,S,A),j=w(F),_=.6*Q(0,.16,A)*Math.pow(1-Math.pow(A,2.4),.8)+.05,T=J(1,1.5,A)+(et-.5)*2*_,G=.05+I+.1*Math.sin(Y(et,0,1)*3.1416)*(1-A);return[x*Math.sin(T)*(Math.max(j[0],.42)*1.05+G),j[2]+Math.cos(T)*(Math.max(j[1],.4)*1.05+G)-.22*A*A,F]},b=[],p=rt(g,M,.45);for(let A=0;A<=10;A++){const et=[];for(let I=0;I<=4;I++){const F=D(A/10,I/4,0);et.push(n.v(F[0],F[1],F[2],p,0,.62))}b.push(et)}for(let A=0;A<10;A++)for(let et=0;et<4;et++)x<0?n.quad(b[A][et],b[A+1][et],b[A+1][et+1],b[A][et+1]):n.quad(b[A][et],b[A][et+1],b[A+1][et+1],b[A+1][et]);const H=(A,et,I,F,j,_,T)=>{const G=[.6,.95,1,.8,.14],W=[];for(let X=0;X<5;X++){const K=X/4,bt=J(A,I,K),vt=J(et,F,K),at=j*G[X],ht=.5+.5*Q(0,.6,K),yt=[];for(let Z=-1;Z<=1;Z++){const Yt=D(bt,vt+Z*at,_+(Z===0?.045:0)+.03*K);yt.push(n.v(Yt[0],Yt[1],Yt[2],Z===1?rt(T,M,.5):T,0,Z===1?ht*.75:ht))}W.push(yt)}for(let X=0;X<4;X++)for(let K=0;K<2;K++)x<0?n.quad(W[X][K],W[X+1][K],W[X+1][K+1],W[X][K+1]):n.quad(W[X][K],W[X][K+1],W[X+1][K+1],W[X+1][K])};for(let A=0;A<5;A++)H(.46+.03*A,.22+.16*A,.84+.04*A,.5,.17,.02+.012*A,g);for(let A=5;A>=0;A--)H(.16+.075*A,.34,.44+.085*A,1.02-.05*A,.2,.07+.012*(5-A),g);for(let A=5;A>=0;A--)H(.08+.085*A,.12,.22+.085*A,.56,.2,.15,rt(g,C,A%3===1?.3:.06));for(let A=4;A>=0;A--)H(0+.1*A,-.12,.15+.1*A,.26,.2,.2,rt(C,g,A%2?.45:.15));a0(n,[[x*.48,1,.3],[x*.48,.5,.26],[x*.48,.1,.2]],[.36,.27,.22],7,()=>i,A=>[0,.55+.15*A]),Ht(n,x*.48,.13,-.08,.3,.14,.5,6,i,0,.8)}const z=rt([C[0]*1.5,C[1]*1.5,C[2]*1.5],[.42,.3,.18],.25);a0(n,[[0,2.5,-1.15],[0,3.05,-1.55],[0,3.6,-1.85]],[.98,.74,.58],10,x=>rt(C,z,x/2),x=>[0,.85+.1*x]);const B=n.n,N=3.9,f=-1.95;Ht(n,0,N,f,.57,.55,.66,10,z,0,1.25),a0(n,[[0,N-.03,f-.5],[0,N-.07,f-.78],[0,N-.16,f-1]],[.2,.13,.02],6,()=>d,()=>[0,1],!0);for(const x of[-1,1])Ht(n,x*.5,N+.1,f-.27,.115,.115,.115,6,[.006,.006,.008]),Ht(n,x*.4,N+.33,f-.22,.09,.1,.22,6,[.55,.035,.03]),Ht(n,x*.515,N-.04,f-.22,.05,.045,.2,6,g);const P=Math.cos(a.turn),k=Math.sin(a.turn);for(let x=B;x<n.n;x++){const D=n.p[x*3],b=n.p[x*3+2]-(f+.2);n.p[x*3]=D*P+b*k,n.p[x*3+2]=f+.2-D*k+b*P}return n.build()}function Rn(a){const n=new St,i=a.white,g=[.16,.15,.145],C=[.02,.02,.022],d=[[.3,.7,.75,.5],[.7,1.08,1.12,.4],[1.2,1.36,1.4,.3],[1.7,1.5,1.54,.22],[2.2,1.56,1.6,.15],[2.7,1.52,1.54,.08],[3.2,1.42,1.42,0],[3.6,1.28,1.26,-.06],[4,1.1,1.08,-.12]],M=[],h=16;for(let f=0;f<d.length;f++){const[P,k,x,D]=d[f],b=[];for(let p=0;p<h;p++){const H=p/h*6.2832,A=Q(-.1,.5,-Math.cos(H)),et=(f+p)%2===0&&f>0&&f<8;b.push(n.v(Math.sin(H)*k,P,D-Math.cos(H)*x,et?rt(i,g,.25+.6*A):i,0,J(.6,1,Q(.3,2.5,P))))}M.push(b)}for(let f=0;f<d.length-1;f++)for(let P=0;P<h;P++){const k=(P+1)%h;n.quad(M[f][P],M[f][k],M[f+1][k],M[f+1][P])}{const f=n.v(0,.12,.5,i,0,.5);for(let P=0;P<h;P++)n.tri(M[0][(P+1)%h],M[0][P],f)}const w=(f,P,k,x)=>{for(let D=f;D<n.n;D++){const b=(D-f)/P|0;if(b>=k&&b%2===1){const p=rt(i,g,x*(.55+.45*((D-f)%2)));n.c[D*3]=p[0],n.c[D*3+1]=p[1],n.c[D*3+2]=p[2]}}};for(const f of[-1,1]){let P=n.n;Ht(n,f*1.34,2.35,.55,.36,1.6,1,12,i,0,.95),w(P,12,1,.8),P=n.n,Ht(n,f*1.02,1.3,1.25,.3,1.05,.62,10,i,0,.85),w(P,10,1,.8),Ht(n,f*.52,.24,-.3,.44,.3,.62,8,i,0,.8)}{const f=n.n;Ht(n,0,.62,1.55,.72,.24,.95,10,i,0,.8),w(f,10,1,.7)}const V=n.n,S=4.72,z=-.1;Ht(n,0,S,z,1.12,1,1.08,14,i,0,1.2),w(V,14,0,.35);for(const f of[-1,1])Ht(n,f*.42,S+.08,z-.95,.21,.21,.12,8,[.85,.55,.03],0,1.6),Ht(n,f*.43,S+.08,z-1.04,.11,.11,.06,6,C,0,1),Ht(n,f*.45,S+.3,z-.93,.3,.07,.1,6,rt(i,g,.5),0,.8);a0(n,[[0,S-.14,z-1.04],[0,S-.3,z-1.16],[0,S-.46,z-1.08]],[.15,.11,.02],6,()=>C,()=>[0,1],!0);const B=Math.cos(a.turn),N=Math.sin(a.turn);for(let f=V;f<n.n;f++){const P=n.p[f*3],k=n.p[f*3+2]-z;n.p[f*3]=P*B+k*N,n.p[f*3+2]=z-P*N+k*B}return n.build()}function Fn(){const a=new St,n=2.7,i=3.25,g=.7,C=tt("#7a5632",.9),d=tt("#33241a",.85),M=tt("#c49a5c",.9),h=tt("#e2b055",1),w=[.66,.64,.58],V=tt("#e0b02a",.9);de(a,[{z:.42*n,rx:.05*n,ry:.035*n,y:0,col:d},{z:.28*n,rx:.1*n,ry:.07*n,y:0,col:C,colB:d},{z:.05*n,rx:.14*n,ry:.11*n,y:0,col:C,colB:d},{z:-.15*n,rx:.13*n,ry:.11*n,y:.005*n,col:M,colB:C},{z:-.27*n,rx:.085*n,ry:.085*n,y:.02*n,col:h},{z:-.35*n,rx:.075*n,ry:.07*n,y:.03*n,col:h},{z:-.41*n,rx:.035*n,ry:.035*n,y:.022*n,col:V},{z:-.455*n,rx:.012*n,ry:.014*n,y:0,col:[.06,.05,.04]}],10,0,.55);const S=9,z=4,B=.11*n,N=p=>-.2*n+.05*n*Math.sin(p*3),f=p=>.37*n*(1-.1*p),P=p=>.03*n-.03*n*p*p;for(const p of[-1,1]){const H=[];for(let F=0;F<=S;F++){const j=F/S*g,_=f(j),T=N(j),G=[];for(let W=0;W<=z;W++){let X=T+_*(W/z);W===z&&F%2&&(X+=.03*n);let K=W===0?C:W===1?M:W===2?rt(C,M,.35):d;W>=2&&(K=rt(K,w,.85*Q(.46,.6,j)*(W===2?.7:1)*(W===z?.25:1))),j<.12&&(K=rt(K,C,.6)),G.push(a.v(p*(B+(i-B)*j),P(j)+.03*n*Math.sin(W/z*3.14),X,K,p*Math.max(j,.02),.62+.38*j))}H.push(G)}for(let F=0;F<S;F++)for(let j=0;j<z;j++)a.quad(H[F][j],H[F+1][j],H[F+1][j+1],H[F][j+1]);const A=B+(i-B)*g,et=N(g),I=f(g);for(let F=0;F<6;F++){const j=F/5,_=et+I*(.03+.15*F),T=I*.075,G=(i-A)*(1-.13*j*j)*(F===0?.9:1),W=(-.1+.55*j)*G,X=[A-.02*n,P(g),_],K=[A+G*.55,P(g)+.02*n,_+W*.5],bt=[A+G,P(g)+.06*n,_+W],vt=rt(d,w,.5*(1-j)*.6),at=[.035,.03,.028],ht=a.v(p*X[0],X[1],X[2]-T,vt,p*g,.9),yt=a.v(p*X[0],X[1],X[2]+T,vt,p*g,.9),Z=a.v(p*K[0],K[1],K[2]-T*.9,at,p*.87,1),Yt=a.v(p*K[0],K[1],K[2]+T*.9,at,p*.87,1),g0=a.v(p*bt[0],bt[1],bt[2]-T*.3,at,p,1),v0=a.v(p*bt[0],bt[1],bt[2]+T*.45,at,p,1);a.quad(ht,Z,Yt,yt),a.quad(Z,g0,v0,Yt)}}const k=a.v(0,.01*n,.3*n,C,0,.8),x=.3*n,D=[],b=[];for(let p=0;p<=6;p++){const H=(p/6-.5)*1.15;D.push(a.v(Math.sin(H)*x*.62,0,.3*n+.27*n*Math.cos(H*.6),w,0,.95)),b.push(a.v(Math.sin(H)*x,0,.3*n+.44*n*Math.cos(H*.6)+(p%2?.012*n:0),d,0,1))}for(let p=0;p<6;p++)a.tri(k,D[p],D[p+1]),a.quad(D[p],b[p],b[p+1],D[p+1]);return a.build()}function ms(a,n,i=0){const g=new St;de(g,[[1.95,.12,.1,.5],[1.6,.62,.55,.62],[.9,.95,.8,.8],[0,1,.85,.85],[-.8,.85,.72,.8],[-1.3,.62,.55,.72],[-1.65,.42,.38,.62],[-1.92,.16,.14,.52]].map((d,M)=>({z:d[0],rx:d[1],ry:d[2],y:d[3],col:M>5?rt(a,n,.4):a,colB:n})),12,0,.35);for(const d of[-1,1])Ht(g,d*.42,1.08,-1.2,.2,.22,.12,6,rt(a,[.02,.015,.01],.5));return i&&a0(g,[[0,.6,1.8],[0,.9,2.8],[0,1.5,3.6]],[.3,.42,.2],6,()=>rt(a,[.03,.02,.02],.3),()=>[0,.9],!0),g.build()}function Hn(a){const n=new St,i=rt(a,[.05,0,0],.55);de(n,[[1.8,.3,.25],[1.3,1.15,.8],[.5,1.4,.95],[-.3,1.3,.9],[-.75,.98,.72],[-1,1.02,.7],[-1.4,.6,.45],[-1.8,.2,.18]].map(C=>({z:C[0],rx:C[1],ry:C[2],y:0,col:a,colB:i})),14,0,.3);for(const C of[-1,1])a0(n,[[C*.2,0,-1.7],[C*.5,.1,-2.3],[C*.45,-.2,-2.8]],[.12,.09,.05],4,()=>i,()=>[0,.8],!0);return n.build()}function Gn(a){const n=new St,i=[],g=rt(a,[.02,.02,.03],.6);for(let C=0;C<=9;C++){const d=C/9,M=.9-d*1.8,h=.8+.2*Math.cos(C*3.1416),w=.33*Math.sin(Math.min(1,.08+d*1.05)*3.1416)*h+.05;i.push({z:M,rx:w,ry:w*.85,y:.34,col:rt(a,[.5,.56,.7],.25*(C%2)),colB:g})}de(n,i,8,0,.4);for(const C of[-1,1])a0(n,[[C*.1,.4,-.85],[C*.3,.55,-1.25],[C*.42,.42,-1.55]],[.05,.04,.03],3,()=>g,()=>[0,.9],!0);return n.build()}function On(a){const n=new St,i=tt("#8f9c86",.62),g=tt("#b9c2ae",.7),C=tt("#4c5648",.5);Tn(n,0,0,0,[[1.9,-.5,C,.4],[1.25,2.5,i,.6],[1,11,i,.85],[1.35,16.5,i,.95],[2.6,20.5,g,1],[3.45,23.2,g,1],[3.6,24,g,1],[3.3,24.05,g,1],[2.9,22.4,i,.7],[1.6,20.6,C,.45],[.2,19.8,C,.35]],14,0);for(let d=0;d<16;d++){const M=a()*6.283,h=a.range(13,23.5),w=h<16.5?1.25:1.35+(h-16.5)/7.5*2.25;Ht(n,Math.cos(M)*w,h,Math.sin(M)*w,.34,.3,.34,4,g,0,1)}return n.build()}function gs(a,n){const i=new St,g=tt("#3f5a1c",.6),C=tt("#93a030",.7),d=9;a0(i,[[0,0,0],[.15,d*.5,.1],[0,d,0]],[.3,.24,.18],3,(h,w)=>rt(tt("#5a4424",.5),g,w),(h,w)=>[.4*w*w,.5+.5*w]);const M=(h,w,V,S,z)=>{const B=Math.cos(w),N=Math.sin(w),f=.2+.05*V,P=i.v(-N*f,h,B*f,g,z,.6),k=i.v(N*f,h,-B*f,g,z,.6),x=i.v(B*V*Math.cos(S),h+V*Math.sin(S),N*V*Math.cos(S),C,z*1.15,1);i.tri(P,k,x)};for(let h=0;h<4;h++)for(let w=0;w<5;w++)M(d*(.3+.16*h),w*1.2566+h*.7+a()*.3,1.5,.75,.25+.1*h);for(let h=0;h<11;h++)M(d,h*.571+a()*.15,a.range(2.1,2.7),.42+.1*(h%2),.7);if(n){const h=tt("#8a4a26",.6);a0(i,[[0,d,0],[.4,d+3,.1],[1,d+5.2,.2],[1.9,d+5.9,.3]],[.09,.08,.08,.1],3,()=>h,(w,V)=>[.7+.5*V,1]),Ht(i,2.5,d+5.7,.35,.95,.42,.42,6,tt("#b58a3a",.7),1.3,1)}return i.build()}function jn(a){const n=new St,i=tt("#93a08a",.6),g=tt("#c8201c",.85),C=10;a0(n,[[0,-.5,0],[.3,C*.5,.2],[.1,C,0]],[.6,.48,.42],5,(d,M)=>rt(tt("#6a745c",.5),i,M),(d,M)=>[.3*M*M,.5+.5*M]);for(let d=0;d<3;d++){const M=d*2.1+a(),h=.55;Ht(n,Math.cos(M)*h,C+.4+.3*d,Math.sin(M)*h,.85,.7,.85,7,g,.3,1)}return n.build()}function Wn(){const a=new St,n=tt("#6f7c66",.6),i=tt("#c9d0bd",.7),g=7,C=[],d=[],M=a.v(0,0,0,rt(n,[.08,.08,.06],.45),0,.45);for(let h=0;h<=g;h++){const w=(h/g-.5)*2.6,V=1+.24*Math.cos(h*3.1416),S=Math.sin(w),z=Math.cos(w);C.push(a.v(S*.6,.1+.1*Math.abs(S),z*.6+.1,n,0,.7)),d.push(a.v(S*1.15*V,.36+.26*V,z*1.15*V+.15,i,0,1))}for(let h=0;h<g;h++)a.tri(M,C[h],C[h+1]),a.quad(C[h],d[h],d[h+1],C[h+1]);return a.build()}function vs(a,n=6,i=4){const g=new St,C=(d,M,h,w,V)=>{const S=Math.cos(d),z=Math.sin(d),B=Math.cos(M),N=Math.sin(M),f=[];for(const[k,x]of[[.05,.09],[.58,.3]]){const D=S*B*h*k,b=N*h*k+.12-.12*k*k,p=z*B*h*k,H=V*(.55+.45*k),A=x*w;f.push([g.v(D-z*A,b+.06,p+S*A,[H,H,H],.3*k,.4+.6*k),g.v(D,b,p,[H*1.14,H*1.05,H],.3*k,.4+.6*k),g.v(D+z*A,b+.06,p-S*A,[H,H,H],.3*k,.4+.6*k)])}for(let k=0;k<2;k++)g.quad(f[0][k],f[1][k],f[1][k+1],f[0][k+1]);const P=g.v(S*B*h,N*h-.02,z*B*h,[V,V*.95,V*.9],.3,1);g.tri(f[1][0],P,f[1][1]),g.tri(f[1][1],P,f[1][2])};for(let d=0;d<n;d++)C(d/n*6.283+a.range(-.3,.3),a.range(.06,.3),a.range(.85,1.12),1.2,a.range(.85,1.05));for(let d=0;d<i;d++)C(d/Math.max(i,1)*6.283+.6+a.range(-.3,.3),a.range(.5,.9),a.range(.5,.78),1,a.range(.7,.9));return g.build()}function xs(a,n,i,g,C,d){const M=new St;for(let h=0;h<n;h++){const w=h/n*6.283+a.range(-.4,.4),V=C*a.range(.4,1.2),S=i*a.range(.7,1.2),z=Math.cos(w),B=Math.sin(w),N=[];for(let f=0;f<=2;f++){const P=f/2,k=Math.sin(V)*S*P*(1+d*P),x=Math.cos(V)*S*P-d*S*P*P*.6,D=g*(1-.8*P)*(f===0?.6:1),b=.5+.5*P,p=z*k+z*.05,H=B*k+B*.05,A=f<2?[M.v(p-B*D,x,H+z*D,[b,b,b],P*P,.35+.65*P),M.v(p+B*D,x,H-z*D,[b,b,b],P*P,.35+.65*P)]:[M.v(p,x,H,[1,1,1],1,1)];f===1&&M.quad(N[0],N[1],A[1],A[0]),f===2&&M.tri(N[0],N[1],A[0]),N.length=0,N.push(...A)}}return M.build()}function bs(a,n,i,g,C){const d=new St,M=d.v(0,i*g*.8,0,[.36,.36,.36],.5,.55),h=[];for(let N=0;N<4;N++){const f=N*1.5708+a()*.6;h.push(d.v(Math.cos(f)*i*.85,0,Math.sin(f)*i*.85,[.26,.26,.26],0,.3))}for(let N=0;N<4;N++)d.tri(M,h[(N+1)%4],h[N]);for(let N=0;N<n;N++){const f=Math.acos(1-(.12+.88*a())*.9),P=N/n*6.283*2.4+a.range(-.5,.5),k=i*a.range(.8,1.05),x=Math.sin(f)*Math.cos(P),D=Math.cos(f),b=Math.sin(f)*Math.sin(P),p=-Math.sin(P),H=Math.cos(P),A=-D*Math.cos(P),et=Math.sin(f),I=-D*Math.sin(P),F=x*k,j=D*k*g+.03,_=b*k,T=C*a.range(.75,1.25),G=(.5+.5*D)*a.range(.8,1.15),W=a.range(-.35,.35),X=d.v(F-p*T*.6,j,_-H*T*.6,[G*.7,G*.7,G*.7],.4*D,.45+.55*D),K=d.v(F+p*T*.6,j,_+H*T*.6,[G*.7,G*.7,G*.7],.4*D,.45+.55*D);d.tri(X,K,d.v(F+(A*.75+x*.3+p*W)*T,j+(et*.75*g+D*.3)*T+.02,_+(I*.75+b*.3+H*W)*T,[G*1.1,G*1.1,G*1.1],.4*D+.4,1))}const w=d.p,V=d.i;for(let N=0;N<V.length;N+=3){const f=V[N]*3,P=V[N+1]*3,k=V[N+2]*3,x=[w[P]-w[f],w[P+1]-w[f+1],w[P+2]-w[f+2]],D=[w[k]-w[f],w[k+1]-w[f+1],w[k+2]-w[f+2]],b=x[1]*D[2]-x[2]*D[1],p=x[2]*D[0]-x[0]*D[2],H=x[0]*D[1]-x[1]*D[0];if(b*(w[f]+w[P]+w[k])+p*(w[f+1]+w[P+1]+w[k+1]+.6*i)+H*(w[f+2]+w[P+2]+w[k+2])<0){const A=V[N+1];V[N+1]=V[N+2],V[N+2]=A}}const S=d.build(),z=S.attributes.position,B=S.attributes.normal;for(let N=0;N<z.count;N++){const f=z.getX(N),P=z.getY(N)/g+.3*i,k=z.getZ(N),x=Math.hypot(f,P,k)||1;B.setXYZ(N,J(B.getX(N),f/x,.75),J(B.getY(N),P/x,.75),J(B.getZ(N),k/x,.75))}return S}function Un(a,n,i,g,C){const d=new St,M=.74,h=7,w=[],V=[],S=d.v(0,n*i*M,0,[.24,.24,.24],.3,.5);for(let I=0;I<h;I++){const F=I/h*6.283+a()*.4,j=Math.cos(F),_=Math.sin(F);V.push(d.v(j*n*M*.72,n*i*M*.66,_*n*M*.72,[.18,.18,.18],.15,.36)),w.push(d.v(j*n*M*1.02,0,_*n*M*1.02,[.11,.11,.11],0,.2))}for(let I=0;I<h;I++){const F=(I+1)%h;d.tri(S,V[F],V[I]),d.quad(V[I],V[F],w[F],w[I])}const z=(I,F,j,_)=>{const T=Math.hypot(I,F/i,j)||1,G=I/T,W=F/i/T,X=j/T;let K=G*.7+a.range(-.5,.5),bt=W*.7+.45+a.range(-.3,.3),vt=X*.7+a.range(-.5,.5);const at=Math.hypot(K,bt,vt)||1;K/=at,bt/=at,vt/=at;let ht=-vt,yt=0,Z=K;const Yt=Math.hypot(ht,Z);Yt<.05?(ht=1,Z=0):(ht/=Yt,Z/=Yt);const g0=bt*Z-vt*yt,v0=vt*ht-K*Z,pe=K*yt-bt*ht,At=a()*6.283,M0=Math.cos(At),D0=Math.sin(At),Dt=_*.5,mt=_*.42,l0=(ht*M0+g0*D0)*Dt,Tt=(yt*M0+v0*D0)*Dt,h0=(Z*M0+pe*D0)*Dt,ft=(g0*M0-ht*D0)*mt,k0=(v0*M0-yt*D0)*mt,We=(pe*M0-Z*D0)*mt,me=Y(F/(n*i)*.55+.45,.3,1),jt=(.5+.5*me)*a.range(.8,1.2),G0=.1+.34*me,O0=.45+.55*me,ge=d.v(I-l0,F-Tt,j-h0,[jt*.68,jt*.68,jt*.68],G0,O0*.8),X0=d.v(I+ft,F+k0,j+We,[jt,jt,jt],G0,O0),lt=d.v(I+l0,F+Tt,j+h0,[jt*1.14,jt*1.14,jt*1.14],G0+.3,O0),Kt=d.v(I-ft,F-k0,j-We,[jt*.94,jt*.94,jt*.94],G0,O0);d.tri(ge,X0,lt),d.tri(ge,lt,Kt)},B=(I,F,j,_,T,G,W)=>{let X=F[2]-I[2],K=-(F[0]-I[0]);const bt=Math.hypot(X,K)||1;X/=bt,K/=bt,d.quad(d.v(I[0]-X*j,I[1],I[2]-K*j,T,W*.5,.5),d.v(I[0]+X*j,I[1],I[2]+K*j,T,W*.5,.5),d.v(F[0]+X*_,F[1],F[2]+K*_,G,W,.9),d.v(F[0]-X*_,F[1],F[2]-K*_,G,W,.9))},N=C?12:7,f=C?2:7,P=C?6:22,k=C?.03:.02,x=C?[.5,.46,.42]:[.22,.2,.19],D=C?[.72,.66,.6]:[.34,.3,.27];for(let I=0;I<N;I++){const F=Math.acos(1-a.range(.06,.82)),j=I/N*6.283*1.6+a.range(-.4,.4),_=n*a.range(.86,1.08),T=[Math.sin(F)*Math.cos(j)*_,Math.cos(F)*_*i,Math.sin(F)*Math.sin(j)*_],G=[T[0]*.5,T[1]*.5+.1*n,T[2]*.5];if(B([0,.02,0],G,n*k*1.6,n*k,x,x,.2),B(G,T,n*k,n*k*.4,x,D,.6),C)for(let W=0;W<2;W++){const X=a.range(.3,.9),K=[J(G[0],T[0],X),J(G[1],T[1],X),J(G[2],T[2],X)];B(K,[K[0]+a.range(-.3,.3)*n,K[1]+a.range(.05,.3)*n,K[2]+a.range(-.3,.3)*n],n*k*.6,n*k*.25,x,D,.8)}for(let W=0;W<f;W++){const X=a.range(.35,1.06),K=.17*n;z(J(G[0],T[0],X)+a.range(-K,K),Math.max(.03,J(G[1],T[1],X)+a.range(-K,K)*i),J(G[2],T[2],X)+a.range(-K,K),g*a.range(.8,1.25))}}for(let I=0;I<P;I++){const F=Math.acos(1-a.range(.02,.93)),j=a()*6.283,_=n*a.range(.8,1.04);z(Math.sin(F)*Math.cos(j)*_,Math.cos(F)*_*i+.03,Math.sin(F)*Math.sin(j)*_,g*a.range(.8,1.3))}const b=d.p,p=d.i;for(let I=0;I<p.length;I+=3){const F=p[I]*3,j=p[I+1]*3,_=p[I+2]*3,T=[b[j]-b[F],b[j+1]-b[F+1],b[j+2]-b[F+2]],G=[b[_]-b[F],b[_+1]-b[F+1],b[_+2]-b[F+2]],W=T[1]*G[2]-T[2]*G[1],X=T[2]*G[0]-T[0]*G[2],K=T[0]*G[1]-T[1]*G[0];if(W*(b[F]+b[j]+b[_])+X*(b[F+1]+b[j+1]+b[_+1]+.6*n)+K*(b[F+2]+b[j+2]+b[_+2])<0){const bt=p[I+1];p[I+1]=p[I+2],p[I+2]=bt}}const H=d.build(!0),A=H.attributes.position,et=H.attributes.normal;for(let I=0;I<A.count;I++){const F=A.getX(I),j=A.getY(I)/i+.3*n,_=A.getZ(I),T=Math.hypot(F,j,_)||1;et.setXYZ(I,J(et.getX(I),F/T,.62),J(et.getY(I),j/T,.62),J(et.getZ(I),_/T,.62))}return H}function o1(a,n,i,g){const C=[],d=a()*6.283,M=a()*6.283,h=n*a.range(.15,.45),w=a.range(.66,.8);for(let V=0;V<g;V++){const S=d+V/g*6.283+a.range(-.28,.28),z=a.range(.82,1.16),B=Math.cos(S)*n*z,N=Math.sin(S)*n*z;C.push(new m.Vector3(B*1.14,0,N*1.14)),C.push(new m.Vector3(B*.9,i*(w+a.range(-.07,.1)+.08*Math.cos(S-M)),N*.9))}return C.push(new m.Vector3(Math.cos(M)*h,i,Math.sin(M)*h),new m.Vector3(-Math.cos(M)*h*.8,i*.985,-Math.sin(M)*h*.8)),C}function ys(a,n,i,g,C=.2){const d=new St,M=[],h=[],w=a()*40,V=a()*40;for(let S=0;S<5;S++){const z=a()*6.283,B=a.range(-.2,.9);h.push([Math.cos(z)*Math.cos(B),Math.sin(B),Math.sin(z)*Math.cos(B),a.range(.7,.92)])}for(let S=0;S<=g;S++){const z=S/g*Math.PI,B=[];for(let N=0;N<i;N++){const f=N/i*6.2832+S*.3;let P=Math.sin(z)*Math.cos(f),k=Math.cos(z),x=Math.sin(z)*Math.sin(f);const D=1+C*(n.n3(P*1.5+w,k*1.5+V,x*1.5)+.4*n.n3(P*4+w,k*4,x*4+V));P*=D,k*=D,x*=D;for(const p of h){const H=P*p[0]+k*p[1]+x*p[2]-p[3];H>0&&(P-=p[0]*H,k-=p[1]*H,x-=p[2]*H)}const b=.82+.3*n.n3(P*2.2+V,k*2.2,x*2.2+w);B.push(d.v(P,k*.72,x*.88,[b,b,b*1.02],0,Y(.3+.7*(k*.5+.5)+(D-1)*1.2,.2,1)))}M.push(B)}for(let S=0;S<g;S++)for(let z=0;z<i;z++){const B=(z+1)%i;d.quad(M[S][z],M[S+1][z],M[S+1][B],M[S][B])}return d.build()}async function da(a,n,i,g,C,d,M,h,w){const V=d+1,S=new Float32Array(V*(M+1)*3),z=new Float32Array(V*(M+1)).fill(1),B=(i-n)/d,N=(C-g)/M;for(let f=0,P=0;f<=M;f++){const k=g+f*N;for(let x=0;x<=d;x++,P++){const D=n+x*B,b=x===0||x===d||f===0||f===M;S[P*3]=D,S[P*3+1]=h(D,k)-(b?w:0),S[P*3+2]=k}(f&3)===3&&await a.yield()}return{pos:S,ao:z,splat(f,P,k,x){const D=Math.max(0,Math.floor((f-k-n)/B)),b=Math.min(d,Math.ceil((f+k-n)/B)),p=Math.max(0,Math.floor((P-k-g)/N)),H=Math.min(M,Math.ceil((P+k-g)/N));for(let A=p;A<=H;A++)for(let et=D;et<=b;et++){const I=Math.hypot(n+et*B-f,g+A*N-P)/k;I<1&&(z[A*V+et]*=1-x*(1-I*I))}},async finish(){for(let k=1,x;k<M;k++)for(let D=1;D<d;D++){x=k*V+D;const b=(S[(x-1)*3+1]+S[(x+1)*3+1]+S[(x-V)*3+1]+S[(x+V)*3+1])/4;z[x]*=Y(.85+(S[x*3+1]-b)*(.5/Math.min(B,N)),.45,1)}const f=new Uint32Array(d*M*6);for(let k=0,x=0;k<M;k++)for(let D=0;D<d;D++){const b=k*V+D,p=b+1,H=b+V,A=H+1;f[x++]=b,f[x++]=H,f[x++]=p,f[x++]=p,f[x++]=H,f[x++]=A}const P=new m.BufferGeometry;return P.setAttribute("position",new m.BufferAttribute(S,3)),P.setAttribute("aAO",new m.BufferAttribute(z,1)),P.setIndex(new m.BufferAttribute(f,1)),await a.yield(),P.computeVertexNormals(),P}}}function kt(a,n){const i=new m.InstancedBufferGeometry;i.index=a.index;for(const S in a.attributes)i.setAttribute(S,a.attributes[S]);const g=new Float32Array(n*4),C=new Float32Array(n*4),d=new Float32Array(n*4),M=new m.InstancedBufferAttribute(g,4),h=new m.InstancedBufferAttribute(C,4),w=new m.InstancedBufferAttribute(d,4);i.setAttribute("iPos",M),i.setAttribute("iRot",h),i.setAttribute("iCol",w);const V={geo:i,iPos:g,iRot:C,iCol:d,aP:M,aR:h,aC:w,count:0,max:n,tris:(a.index?a.index.count:a.attributes.position.count)/3,add(S,z,B,N,f,P,k,x,D,b=1){if(V.count>=n)return-1;const p=V.count*4;return g[p]=S,g[p+1]=z,g[p+2]=B,g[p+3]=N,C[p]=f,C[p+1]=P,C[p+2]=k,C[p+3]=x,d[p]=D[0],d[p+1]=D[1],d[p+2]=D[2],d[p+3]=b,i.instanceCount=++V.count,V.count-1}};return i.instanceCount=0,V}const En={evening:{el:9,az:-72,exposure:1,lum:1,fogK:1,portal:"#ffe6bf",hi:"#6f86a8",sky:{preset:"goldenHour",zenith:"#33598f",mid:"#8aa3c2",horizon:"#F4DDB8",ground:"#5d5560",scatterColor:"#ffc98a",scatter:.55,sunColor:"#ffe2b8",clouds:{coverage:.54,lit:"#f7e6c6",shade:"#3A4350",silver:1.4,scale:.9,wind:[.012,.002]},clouds2:{lit:"#f4ddb8",shade:"#8f8a98",opacity:.3}}},dawn:{el:7,az:75,exposure:1,lum:.9,fogK:1.25,portal:"#ffd9cc",hi:"#8090b4",sky:{preset:"dawn",zenith:"#2c4a86",horizon:"#f6c4b4",clouds:{coverage:.3,lit:"#ffd6c6",shade:"#5a5f86",silver:1.3}}},overcast:{el:11,az:-70,exposure:1,lum:.96,fogK:1.1,portal:"#ffd9a6",hi:"#7a86a8",sky:{preset:"goldenHour",zenith:"#34446e",mid:"#8a7c9a",horizon:"#f7b274",ground:"#5a4c52",scatterColor:"#ff9a4a",scatter:.95,sunColor:"#ffd3a0",clouds:{coverage:.66,softness:.42,lit:"#ffc592",shade:"#3c4058",absorb:1.3,silver:1.7,scale:.85,detail:.7,wind:[.014,.003]},clouds2:{lit:"#ffbf8c",shade:"#6d6682",opacity:.45}}},night:{el:30,az:-60,exposure:1.6,lum:.4,fogK:.9,portal:"#bfe8d8",hi:"#1c2a4c",sky:{preset:"night",aurora:.6,auroraAzimuth:0,auroraSpread:.5,milkyWay:.5,bodies:[{elevation:30,azimuth:-60,size:2.2,phase:.5,intensity:1,dark:.03,glow:.2,glowColor:"#9db8ff"}],key:0,clouds:{coverage:.26,softness:.38,lit:"#8398cc",shade:"#182446",opacity:.85}}}};var a1={id:"the-branching",name:"The Branching",category:"wilderness",weirdness:.15,media:["air","tiny"],async build(a){const{rng:n,noise:i}=a,g=a.quality?.detail??1,C=a.vary||{},d=new m.Scene,M=n.fork("vary"),h=C.hour||"any";let w;if(h==="golden")w="evening";else if(h==="dawn")w="dawn";else if(h==="day")w="overcast";else if(h==="night")w="night";else{const t=M();w=t<.12?"night":t<.3?"overcast":t<.58?"evening":t<.86?"dawn":"evening"}const V=M(),S=V<.5?"peak":V<.75?"august":"late",z={squirrel:M.chance(.3),owl:M.chance(.3),swans:M.chance(.3),spider:M.chance(.25)},B=!!C.rare,N=Y(C.density??1,.7,1.3),f=En[w],P=w==="night",k=Math.PI/180,x=new m.Vector3(Math.sin(f.az*k)*Math.cos(f.el*k),Math.sin(f.el*k),-Math.cos(f.az*k)*Math.cos(f.el*k)),D=vn({rng:n,...f.sky,sunElevation:P?-35:f.el,sunAzimuth:P?160:f.az,bake:P,renderer:a.renderer});d.add(D.object),await a.yield();const b=D.colorAt(new m.Vector3(-.25,.05,-1).normalize(),new m.Color).multiplyScalar(.92),p=new m.Color(qt[1]).multiplyScalar(.3).lerp(new m.Color(qt[3]).multiplyScalar(.36),.45).multiplyScalar(f.lum);d.fog=new m.FogExp2(p.clone(),.0042);const H=await yn(a,{palette:qt,hour:w,season:S,density:Y((N-.7)/.6,0,1),rareEvent:B,sunDir:[x.x,x.y,x.z]});await a.yield();const A=H.uniforms,et=H.heightAt,I=H.anchors,F=I.flyThrough,j={};H.object.traverse(t=>{t.name&&(j[t.name]=t)});const _=50,T=F[0].x,G=F[0].z+_,W=new m.Vector3(T,et(T,G),G),X=(t,e)=>W.y+m0*(et(W.x+(t-W.x)/m0,W.z+(e-W.z)/m0)-W.y),K=(t,e)=>1.3*i.n2(t*.012,e*.012)+.45*i.n2(t*.045+3,e*.045),bt=K(W.x,W.z),vt=(t,e)=>{const o=Q(G-40,G+10,e)*(1-Q(170,300,Math.abs(t-T))),s=W.y+K(t,e)-bt;return o>.999?s:J(X(t,e),s,o)},at=G+185,ht=new m.Vector3(T+3,vt(T+3,at),at),yt=(t,e)=>ht.y+H0*(vt(ht.x+(t-ht.x)/H0,ht.z+(e-ht.z)/H0)-ht.y)+1.5+1.2*(i.n2(t*.018,e*.018+20)+1)+.5*i.n2(t*.06+9,e*.06),Z=at+185,Yt=Z-40,g0=T+3,v0=Yt-1,pe=yt(g0,v0),At=new m.Vector3(T+6,pe+22,Yt),M0=(t,e)=>4.5*i.n2(t*.007+9,e*.007)+1.8*i.n2(t*.025,e*.025+4),D0=M0(At.x,At.z),Dt=(t,e)=>At.y+M0(t,e)-D0,mt=Z+165,l0=t=>{const e=Y(t,0,1);return e*e*(3-2*e)},Tt=65,h0=60,ft=[],k0=(t,e,o)=>ft.push([T+t,Dt(T+t,mt-o)+e,mt-o]);k0(0,14,0),k0(.4,14,34),k0(3,12.5,68),k0(8.5,10.2,97),k0(10.2,9,116),k0(8.6,10.5,140),ft.push([At.x,Math.max(At.y,Dt(At.x,Z))+14,Z]);for(const[t,e,o]of[[.3,19.5,-.6],[.6,25,-1.4],[1,23.5,-2.4]])ft.push([At.x+o,At.y+e,Z-Tt*t]);const We=t=>J(At.x-2.4,ht.x,Y((Z-Tt-t)/(Z-Tt-at),0,1));for(const[t,e]of[[38,24],[76,15]]){const o=Z-Tt-t,s=We(o);ft.push([s,yt(s,o)+e,o])}ft.push([ht.x,yt(ht.x,at)+13,at]);const me=yt(ht.x,at)+13,jt=T+1,G0=vt(jt,at-h0)+5;for(const t of[.35,.7])ft.push([J(ht.x,jt,t),J(me,G0,l0(t)*.9+t*.1),at-h0*t]);ft.push([jt,G0,at-h0]);const O0=ft.length+1;for(const[t,e,o]of[[40,-2.5,7.2],[80,.6,6.8]]){const s=at-h0-t;ft.push([T+e,vt(T+e,s)+o,s])}const ge=W.y+8.5;ft.push([T+.5,vt(T+.5,G+22)+7,G+22]),ft.push([W.x,ge,G]);{const t=F.length,e=F[t-2],o=F[t-1],s=(c,R,U)=>W.y+U*(et(W.x+(c-W.x)/U,W.z+(R-W.z)/U)-W.y);for(const c of[_*.25,_*.5,_*.75]){const R=G-c,U=c/_,v=J(W.x,F[0].x,U),L=Math.pow(m0,1-Math.pow(l0(U),1.4));let O=-1e9;for(let E=-6;E<=6;E+=6)for(let $=-6;$<=6;$+=6)O=Math.max(O,s(v+E,R+$,L));ft.push([v,Math.max(J(ge,F[0].y,U*U*(3-2*U)*.6+U*.4),O+(U<.4?8:9)),R])}for(let c=0;c<t-2;c++)ft.push(F[c].clone());const r=ft.length-t+3,l=(c,R)=>Math.hypot((R.x??R[0])-(c.x??c[0]),(R.z??R[2])-(c.z??c[2])),u=c=>c.y??c[1],y=(c,R)=>{c.isVector3?c.y=R:c[1]=R};for(let c=r;c>O0+1;c--)y(ft[c-1],Math.max(u(ft[c-1]),u(ft[c])-.66*l(ft[c-1],ft[c])));for(let c=O0+1;c<=r;c++)y(ft[c],Math.max(u(ft[c]),u(ft[c-1])-.04*l(ft[c-1],ft[c])));var X0=ft.length-t+2;ft.push(e.clone(),e.clone().lerp(o,.5),o.clone())}const lt=gn(ft,{samples:900}),Kt=new m.Vector3;let Co=.5;{let t=1e9;for(let e=0;e<=240;e++){const o=lt.pointAt(e/240,Kt).z;o<t&&(t=o,Co=e/240)}}const z0=t=>{let e=0,o=Co;for(let s=0;s<26;s++){const r=(e+o)/2;lt.pointAt(r,Kt).z>t?e=r:o=r}return(e+o)/2},zt={l1a:z0(Z),l1b:z0(Z-Tt),l2a:z0(at),l2b:z0(at-h0),l3a:z0(G),l3b:z0(G-_),crest:z0(300)};await a.yield();const J0=1400,Xt=new Float32Array((J0+1)*3),ws=Math.floor(Co*J0);for(let t=0;t<=J0;t++)lt.pointAt(t/J0,Kt),Xt[t*3]=Kt.x,Xt[t*3+1]=Kt.y,Xt[t*3+2]=Kt.z;const Ue=t=>{let e=0,o=1e18;for(let s=0;s<=J0;s++){const r=(Xt[s*3]-t.x)**2+(Xt[s*3+1]-t.y)**2+(Xt[s*3+2]-t.z)**2;r<o&&(o=r,e=s)}return e/J0},ve=I.flyKeys,Lt={root:Ue(ft[X0+ve.root]),fork:Ue(ft[X0+ve.fork]),turn:Ue(ft[X0+ve.turn]),climb:Ue(ft[X0+ve.climb])},Ms=1016,Wt=Ms/lt.length,Kn=t=>t*Wt,Nt=t=>{let e=0,o=ws;for(;o-e>1;){const u=e+o>>1;Xt[u*3+2]>t?e=u:o=u}const s=Xt[e*3+2],r=Xt[o*3+2],l=Y((s-t)/Math.max(s-r,1e-6),0,1);return{x:J(Xt[e*3],Xt[o*3],l),y:J(Xt[e*3+1],Xt[o*3+1],l)}},xe=new m.Vector3,Ee=(t,e,o,s,r)=>{const l=Y(t,0,1);lt.pointAt(l,r),lt.tangentAt(l,xe);const u=Math.hypot(xe.x,xe.z)||1,y=xe.x/u,c=xe.z/u;return r.x+=y*e-c*o,r.y+=s,r.z+=c*e+y*o,r},Ke=(t,e,o)=>{let s=0;for(;s<t.length-2&&e>t[s+1][0];)s++;const r=t[Math.max(0,s-1)],l=t[s],u=t[s+1],y=t[Math.min(t.length-1,s+2)],c=u[0]-l[0],R=Y((e-l[0])/c,0,1),U=R*R,v=U*R,L=2*v-3*U+1,O=v-2*U+R,E=-2*v+3*U,$=v-U,it=[0,0,0];for(let ot=1;ot<=3;ot++){const dt=(u[ot]-r[ot])/Math.max(u[0]-r[0],1e-6)*c,Bt=(y[ot]-l[ot])/Math.max(y[0]-l[0],1e-6)*c;it[ot-1]=L*l[ot]+O*dt+E*u[ot]+$*Bt}return Ee(e,it[0],it[1],it[2],o)},Bo=(t,e)=>(e.x=(e.x-t.position.x)/t.scale.x,e.y=(e.y-t.position.y)/t.scale.x,e.z=(e.z-t.position.z)/t.scale.x,e),be=()=>m.UniformsUtils.clone(m.UniformsLib.fog),ks=w==="overcast"?.08:0,No=t=>({uTime:A.uTime,uSunL:A.uSunL,uSunCol:A.uSunCol,uSkyCol:A.uSkyCol,uHorizCol:A.uHorizCol,uPal:A.uPal,uSnow:A.uSnow,uGreen:A.uGreen,uAurora:A.uAurora,uMist:A.uMist,uHazeCol:A.uHazeCol,uHaze:{value:0},uCamL:{value:new m.Vector3},uCloud:{value:new m.Vector4(t[0],t[1],t[2],t[3]+ks)},uFade:{value:1}}),s0=w==="dawn"?.75:S==="late"?.35:0,Ct=(t,e,o,s,r={})=>new m.ShaderMaterial({uniforms:Object.assign(be(),t,{uMatA:{value:new m.Vector4(e[0],e[1],e[2],e[3])},uMatB:{value:new m.Vector4(o[0],o[1],o[2],o[3]??0)},uWind:{value:new m.Vector4(s[0],s[1],s[2],s[3])}}),vertexShader:Pn,fragmentShader:Sn,defines:r,fog:!0,side:m.DoubleSide}),P0=(t,e,o={},s=m.FrontSide)=>new m.ShaderMaterial({uniforms:Object.assign(be(),t,{uPatch:{value:new m.Vector4(0,0,0,0)},uRun:{value:new m.Vector4(0,0,1,1)},uHeath:{value:new m.Vector4(0,1,0,0)},uTint:{value:new m.Vector3(1,1,1)},uTexS:{value:1}},o),vertexShader:Bn,fragmentShader:Nn,defines:{MODE:e},fog:!0,side:s}),_e=(t,e={},o=null)=>new m.ShaderMaterial({uniforms:Object.assign(be(),t,{uUT:pa,uUnder:{value:o||new m.Color(qt[1]).multiplyScalar(.16*f.lum+.02)}}),vertexShader:An,fragmentShader:Cn,defines:e,fog:!0}),pa={value:-10},ma=[],Q0=(t,e,o,s,r,l,u,y,c,R,U,v)=>{o=Math.max(8,Math.round(o*g));const L=new Float32Array(o*3),O=new Float32Array(o*4);for(let dt=0;dt<o;dt++)L[dt*3]=v(),L[dt*3+1]=v(),L[dt*3+2]=v(),O[dt*4]=l*v.range(.5,1.4),O[dt*4+1]=v(),O[dt*4+2]=v(),O[dt*4+3]=v();const E=new m.BufferGeometry;E.setAttribute("position",new m.BufferAttribute(L,3)),E.setAttribute("aS",new m.BufferAttribute(O,4));const $=new m.Vector4(400,u,y,c),it=new m.ShaderMaterial({uniforms:Object.assign(be(),t,{uBox:{value:new m.Vector3(s[0],s[1],s[2])},uVel:{value:new m.Vector3(r[0],r[1],r[2])},uSpr:{value:$},uColor:{value:new m.Color(R)},uLit:{value:new m.Vector3(U[0],U[1],U[2])}}),vertexShader:Dn,fragmentShader:Ln,fog:!0,transparent:!0,depthWrite:!1}),ot=new m.Points(E,it);return ot.frustumCulled=!1,ot.renderOrder=4,e.add(ot),ma.push({spr:$,maxFrac:u/450}),ot},ga=Math.hypot(x.x,x.z)||1,zs=-x.x/ga,Ps=-x.z/ga,Ss=Y(Math.cos(f.el*k)/Math.max(Math.sin(f.el*k),.05),.5,4),Do=t=>(e,o,s,r,l=.5)=>{t.splat(e,o,s*1.6,l);const u=Math.min(24,Math.ceil(r*Ss/(s*1.5)));for(let y=1;y<=u;y++)t.splat(e+zs*y*s*1.5,o+Ps*y*s*1.5,s*1.35,l*.62*(1-y/(u+1)))},nt=(t,e,o,s)=>{const r=new m.Mesh(e,o);return r.frustumCulled=!1,r.name=s,t.add(r),r},f0=(t,e,o,s,r,l,u,y,c,R,U=1e9,v=7)=>{const L=[],O=[],E=[],$=u+1,it=[];for(let ct=0;ct<v;ct++){const ut=c()*6.283,pt=c.range(-.3,.9);it.push([Math.cos(ut)*Math.cos(pt),Math.sin(pt),Math.sin(ut)*Math.cos(pt),c.range(.72,.95)])}const ot=c()*50,dt=c()*50;for(let ct=0;ct<=y;ct++)for(let ut=0;ut<=u;ut++){const pt=ct/y*Math.PI,i0=ut/u*6.2832;let Vt=Math.sin(pt)*Math.cos(i0),xt=Math.cos(pt),Zt=Math.sin(pt)*Math.sin(i0);const Gt=1+R*(i.n3(Vt*1.6+ot,xt*1.6+dt,Zt*1.6)+.45*i.n3(Vt*4.2+ot,xt*4.2,Zt*4.2+dt));Vt*=Gt,xt*=Gt,Zt*=Gt;for(const Ot of it){const Et=Vt*Ot[0]+xt*Ot[1]+Zt*Ot[2]-Ot[3];Et>0&&(Vt-=Ot[0]*Et,xt-=Ot[1]*Et,Zt-=Ot[2]*Et)}const c0=Math.min(e+xt*r,U-.12*Math.max(0,1-xt)*r*.1);L.push(t+Vt*s,c0,o+Zt*l),O.push(Y(.35+.65*(xt*.5+.5)+(Gt-1)*1.2,.2,1))}for(let ct=0;ct<y;ct++)for(let ut=0;ut<u;ut++){const pt=ct*$+ut;E.push(pt,pt+1,pt+$,pt+1,pt+$+1,pt+$)}const Bt=new m.BufferGeometry;return Bt.setAttribute("position",new m.Float32BufferAttribute(L,3)),Bt.setAttribute("aAO",new m.Float32BufferAttribute(O,1)),Bt.setIndex(E),Bt.computeVertexNormals(),Bt};await a.yield();const Pt=new m.Group;Pt.name="stage-A",d.add(Pt);const It=No([12,2,.0045,.34]),q=n.fork("stage-a"),va=await da(a,T-240,T+250,Z-320,mt+70,98,112,Dt,40),j0=Do(va),u0=T,Jt=mt-110,$e=Dt(u0,Jt)-1,Ze=tt("#7d8072",.55),ye=tt(qt[0],.86),xa=[.42,1.3,.22,26],ba=[.55,.5,.4,s0],ya=[.7,.05,4.2,.012],Ye=[];{const t=H.graph;let e=0;for(const c of t)e=Math.max(e,c.y);const o=61/e,s=[3.1,2.1,1.35,.85,.52,.3,.14],r=[],l=[];for(const c of t){const R=c.parent>=0?r[c.parent][2]:0,U=c.parent>=0?q.gauss()*c.len*o*.2:0,v=c.parent>=0?r[c.parent]:[0,0,0],L=[c.x*o,c.y*o,R+U];if(r[c.id]=L,l.push({a:v,b:L,ra:s[c.order],rb:s[c.order]*.74,order:c.order,h:Y(L[1]/72,0,1)}),c.kids.length===0){const O=Math.hypot(L[0]-v[0],L[1]-v[1],L[2]-v[2])||1,E=[(L[0]-v[0])/O,(L[1]-v[1])/O,(L[2]-v[2])/O],$=q.int(2,3);for(let it=0;it<$;it++){const ot=[E[0]+q.range(-.7,.7),E[1]+q.range(-.2,.6),E[2]+q.range(-.7,.7)],dt=Math.hypot(ot[0],ot[1],ot[2])||1,Bt=q.range(3.5,6),ct=[L[0]+ot[0]/dt*Bt,L[1]+ot[1]/dt*Bt,L[2]+ot[2]/dt*Bt];l.push({a:L,b:ct,ra:s[5],rb:s[5]*.7,order:5,h:Y(ct[1]/72,0,1)});for(let ut=0;ut<2;ut++){const pt=[ct[0]+q.range(-1.6,1.6),ct[1]+q.range(.6,2.6),ct[2]+q.range(-1.6,1.6)];l.push({a:ct,b:pt,ra:s[6],rb:s[6],order:6,h:Y(pt[1]/72,0,1)})}}}c.order>=1&&c.order<=3&&q.chance(.5)&&Ye.push([u0+L[0],$e+L[1]-s[c.order]*.9,Jt+L[2],q.range(.5,1)])}const u=new St;Ao(u,l,q,{base:Ze,tip:ye,orders:6,sides:9,midTo:3,height:72}),await a.yield();const y=u.build();y.translate(u0,$e,Jt),nt(Pt,y,Ct(It,xa,ba,ya),"hero-lichen"),j0(u0,Jt,7,60,.6);var Lo=[u0+r[0][0],$e+r[0][1],Jt+r[0][2]],we=[r[1],r[0]].map(c=>[u0+c[0],$e+c[1],Jt+c[2]])}await a.yield();const wa=(t,e,o)=>Math.abs(t-Nt(Y(e,Z-Tt,mt)).x)>o,Ma=Ct(It,xa,ba,ya,{INST:1}),Vo=[],qo=[];for(let t=0;t<3;t++){const e=new St,o=t===2?44:64;Ao(e,ua(q,{height:o,orders:5,ratio:t===2?.8:.72,spread:t===2?.72:.5,lift:t===2?.1:.28,radius:2.4,lean:.14}),q,{base:Ze,tip:ye,orders:5,sides:6,midTo:1,height:o}),Vo.push({geo:e.build(),h:o}),await a.yield()}for(let t=0;t<2;t++){const e=new St,o=t?46:62;Ao(e,ua(q,{height:o,orders:4,ratio:t?.8:.72,spread:t?.7:.5,lift:.22,radius:2.6,lean:.14}),q,{base:Ze,tip:ye,orders:4,sides:5,midTo:-1,height:o}),qo.push({geo:e.build(),h:o})}await a.yield();const To=()=>{const t=q(),e=q.range(.82,1.08);return t<.6?[e,e,e]:t<.8?[e*.92,e,e*.86]:[e,e*.97,e*.82]},Io=Vo.map(t=>kt(t.geo,20)),Xe=qo.map(t=>kt(t.geo,Math.round(64*g))),Me=[];for(let t=0,e=0;t<900&&e<34;t++){const o=q.range(Z-170,mt+30),s=T+q.sign()*q.range(24,100),r=o<Jt+115&&o>Jt-100?40:26;if(!wa(s,o,r)||Math.hypot(s-u0,o-Jt)<46||Math.abs(s-u0)<38&&o<Jt-10||Me.some(c=>Math.hypot(c[0]-s,c[1]-o)<30))continue;if(o<mt-40&&o>Z-52){const c=s-Nt(Y(o,Z-Tt,mt)).x;if(c>0&&c<54)continue}const l=q.int(0,2),u=q.range(.72,1.12);Io[l].add(s,Dt(s,o)-1,o,u,q()*6.283,q.range(-.08,.08),q.range(-.08,.08),q(),To())<0||(Me.push([s,o]),j0(s,o,7,Vo[l].h*u*.8,.5),e++)}for(let t=0;t<3e3;t++){const e=q.range(Z-310,mt+60),o=T+q.range(-235,245);if(Math.abs(o-T)<105&&e>Z-175&&e<mt+35||!wa(o,e,30)||Math.abs(o-u0)<44&&e<Jt||Me.some(u=>Math.hypot(u[0]-o,u[1]-e)<24))continue;const r=q.int(0,1),l=q.range(.7,1.2);if(Xe[r].add(o,Dt(o,e)-1,e,l,q()*6.283,q.range(-.1,.1),q.range(-.1,.1),q(),To())<0){if(Xe[1-r].count>=Xe[1-r].max)break;continue}Me.push([o,e]),j0(o,e,7,qo[r].h*l*.7,.4),(t&255)===0&&await a.yield()}const As=[];Io.forEach((t,e)=>nt(Pt,t.geo,Ma,"lichen-near-"+e)),Xe.forEach((t,e)=>As.push(nt(Pt,t.geo,Ma,"lichen-far-"+e))),await a.yield();const Je=(t,e)=>{const o=new m.InstancedBufferGeometry;o.index=t.index,o.setAttribute("position",t.attributes.position),o.setAttribute("normal",t.attributes.normal);const s=new Float32Array(e*4),r=new Float32Array(e*4),l=new m.InstancedBufferAttribute(s,4);o.setAttribute("iPos",l),o.setAttribute("iRot",new m.InstancedBufferAttribute(r,4)),o.instanceCount=0;const u={geo:o,iPos:s,iRot:r,aP:l,count:0,add(y,c,R,U,v=0,L=0,O=0,E=0){if(u.count>=e)return-1;const $=u.count*4;return s[$]=y,s[$+1]=c,s[$+2]=R,s[$+3]=U,r[$]=v,r[$+1]=L,r[$+2]=O,r[$+3]=E,o.instanceCount=++u.count,u.count-1}};return u};await a.yield();const Ro=new m.SphereGeometry(1,14,10),Qe=new m.CircleGeometry(2.95,16);Qe.rotateX(-Math.PI/2),Qe.translate(0,22.7,0);const to=kt(On(q),44),ka=Je(Qe,44),ke=[],za=mt-88,te=[Nt(za).x-20,0,za];for(let t=0;t<1200&&to.count<44;t++){(t&127)===127&&await a.yield();const e=to.count===0,o=e?te[2]:q.range(Z-120,mt+10),s=Nt(Y(o,Z-Tt,mt)).x,r=e?te[0]:s+q.sign()*q.range(15,72),l=e?1:q.range(.5,1.15);if(!e&&(Me.some(c=>Math.hypot(c[0]-r,c[1]-o)<13)||ke.some(c=>Math.hypot(c[0]-r,c[1]-o)<9)||Math.hypot(r-u0,o-Jt)<12))continue;const u=Dt(r,o)-.3,y=q.range(.85,1.08);to.add(r,u,o,l,q()*6.283,q.range(-.07,.07),q.range(-.07,.07),q(),[y,y,y*q.range(.9,1)]),ka.add(r,u,o,l),ke.push([r,o,u,l]),j0(r,o,5*l+2,22*l,.45);for(let c=0;c<2;c++){const R=q()*6.283;Ye.push([r+Math.cos(R)*3.5*l,u+24.2*l,o+Math.sin(R)*3.5*l,q.range(.35,.7)])}}await a.yield(),te[1]=ke[0][2],nt(Pt,to.geo,Ct(It,[.26,.9,.3,30],[.25,.45,.35,s0*.5],[.12,.05,2.2,.012],{INST:1}),"cups"),nt(Pt,ka.geo,_e(It,{RIPPLE:1}),"cup-water"),await a.yield();const Pa=[.9,.08,3.4,.012],Cs=Ct(It,[.3,1.4,.25,30],[.7,.35,.45,s0*.6],Pa,{INST:1}),W0=[kt(gs(q,!1),Math.round(150*g)),kt(gs(q,!0),Math.round(110*g))];for(let t=0;t<4e3;t++){(t&511)===511&&await a.yield();const e=q.range(Z-110,mt+20),o=Nt(Y(e,Z-Tt,mt)).x,s=q.range(7,85),r=o+q.sign()*s;if(i.n2(r*.02+30,e*.02)<-.05)continue;const l=q.chance(.42)?1:0,u=Math.min(q.range(.5,1.3),s<14?.4:9),y=q.range(.8,1.15);if(W0[l].add(r,Dt(r,e)-.2,e,u,q()*6.283,q.range(-.12,.12),q.range(-.12,.12),q(),[y,y,y*.9])<0&&W0[1-l].count>=W0[1-l].max)break}W0.forEach((t,e)=>nt(Pt,t.geo,Cs,"moss-"+e));const ze=kt(jn(q),80);for(let t=0;t<900&&ze.count<80;t++){const e=q.range(Z-100,mt+10),o=Nt(Y(e,Z-Tt,mt)).x,s=q.range(9,70),r=o+q.sign()*s;i.n2(r*.03+60,e*.03)<.1||Math.hypot(r-u0,e-Jt)<8||ze.add(r,Dt(r,e)-.2,e,Math.min(q.range(.55,1.2),s<14?.42:9),q()*6.283,q.range(-.15,.15),q.range(-.15,.15),q(),[1,1,1])}await a.yield(),nt(Pt,ze.geo,Ct(It,[.3,1.2,.5,40],[.35,.45,.4,s0*.5],Pa,{INST:1}),"redcaps"),await a.yield();const Pe=kt(Wn(),Math.round(3400*g));for(let t=0;t<Pe.max;t++){const e=q.range(Z-125,mt+22),o=Nt(Y(e,Z-Tt,mt)).x+q.gauss()*24,s=q.range(.75,1.15);Pe.add(o,Dt(o,e)+.02,e,q.range(.8,1.9),q()*6.283,q.range(-.25,.2),q.range(-.2,.2),q(),q.chance(.25)?[s*.78,s*.95,s*.66]:[s,s,s*.96]),(t&511)===0&&await a.yield()}nt(Pt,Pe.geo,Ct(It,[.4,1.6,.35,30],[.3,.3,.4,s0*.4],[0,.05,1,.01],{INST:1}),"squamules"),await a.yield();{const t=q.fork("knobs"),e=[];for(const s of[-1,1]){const r=T+s*19.5+.9,l=mt-52+s*2,u=Dt(r,l),y=[];y.push(f0(r,u+2.2,l,5.4,4.3,4.9,22,14,t,.13,1e9,4)),y.push(f0(r-s*4.6,u+.9,l+3.2,2.9,2.2,3.2,16,10,t,.15,1e9,3)),y.push(f0(r+s*3.4,u+.5,l-4.4,2.2,1.5,2,14,8,t,.15,1e9,3)),e.push(la(y)),y.forEach(c=>c.dispose()),j0(r,l,7,8,.55),await a.yield()}const o=nt(Pt,e[0],P0(It,3,{uPatch:{value:new m.Vector4(0,0,0,1)},uTint:{value:new m.Vector3(.78,.74,.7)},uTexS:{value:.8}},m.DoubleSide),"knob-w");nt(Pt,e[1],o.material,"knob-e")}await a.yield();const n0=kt(Gn(tt("#4a5a7c",.8)),40);for(let t=0;t<40;t++){const e=q.range(Z-20,mt-12),o=Nt(e).x+q.sign()*q.range(4,26),s=q.range(.8,1.2);n0.add(o,Dt(o,e)+.1,e,q.range(.85,1.2),0,0,0,q(),[s,s,s],q.range(4.5,9))}{const e=[];for(let v=0;;v+=.25){lt.posAtDist(Math.min(v,lt.length),Kt);const L=Math.pow(ha,l0((Z-Kt.z)/Tt));if(e.push(At.x+(Kt.x-At.x)*L,At.y+(Kt.y-At.y)*L,At.z+(Kt.z-At.z)*L,2*L,0),Kt.z<=Z-Tt||v>=lt.length)break}const o=e.length/5,s=(v,L)=>Math.hypot(e[v*5]-e[L*5],e[v*5+1]-e[L*5+1],e[v*5+2]-e[L*5+2]);for(let v=0;v<o;v++)e[v*5+4]=Math.max(v>0?s(v,v-1):0,v<o-1?s(v,v+1):0)/2;const r=[];for(let v=0;v<o;v+=16){const L=Math.min(o,v+16),O=Math.min(o-1,v+8);let E=0,$=0,it=0;for(let ot=v;ot<L;ot++)E=Math.max(E,s(ot,O)),$=Math.max($,e[ot*5+3]),it=Math.max(it,e[ot*5+4]);r.push(v,L,O,E,$,it)}const l=n0.geo.attributes.position;let u=0;for(let v=0;v<l.count;v++)u=Math.max(u,Math.hypot(l.getX(v),l.getY(v),l.getZ(v)));const y=.125,c=Math.ceil(3*.88/y),R=Math.ceil(Math.hypot(30*1.5/.12+3,13*3.1416*1.5/.12)*.12/y),U=(v,L,O)=>{const E=v*4,$=n0.iRot[E+3],it=1-2*L,ot=Math.cos($*40)*it,dt=Math.sin($*40)*it,Bt=u*n0.iPos[E+3];for(let ct=0;ct<=c+R;ct++){const ut=ct<c?.88*ct/c:.88+.12*(ct-c)/R,pt=Q(.88,1,ut),i0=pt*30+ut*3,Vt=n0.iPos[E]+ot*i0,xt=n0.iPos[E+1]+Math.sin(pt*3.1416)*13*(1-O),Zt=n0.iPos[E+2]+dt*i0;for(let Gt=0;Gt<r.length;Gt+=6){const c0=r[Gt+2]*5,Ot=r[Gt+3]+r[Gt+4]+Bt+r[Gt+5]+y/2;if(!((Vt-e[c0])**2+(xt-e[c0+1])**2+(Zt-e[c0+2])**2>=Ot*Ot))for(let Et=r[Gt];Et<r[Gt+1];Et++){const o0=Et*5,B0=e[o0+3]+Bt,R0=e[o0+4]+y/2;if((Vt-e[o0])**2+(xt-e[o0+1])**2+(Zt-e[o0+2])**2<B0*B0+R0*R0)return!1}}}return!0};for(let v=0;v<n0.count;v++){if(await a.yield(),U(v,0,0))continue;let L=1,O=0,E=U(v,1,0);for(let $=1;$<=16&&!E;$++)O=$/32,L=0,E=U(v,0,O),E||(L=1,E=U(v,1,O));E?(n0.iRot[v*4]=L,n0.iRot[v*4+1]=O):n0.iPos[v*4+3]=0}}nt(Pt,n0.geo,Ct(It,[.25,5,.6,40],[.1,.7,.3,0],[0,.05,1,.01],{INST:1,HOP:1}),"springtails"),await a.yield();const Qt=mt-96,d0=Z-34,S0=2.3,L0=t=>[Nt(t).x+13.5,Nt(Math.max(t,Z+2)).y-4.8-.05*Math.max(Z+2-t,0),t];{const t=new St,e=[],o=[],s=L0(Qt),r=L0(d0);e.push([s[0]+1.5,Dt(s[0],Qt+17)-2,Qt+17],[s[0]+.6,(s[1]+Dt(s[0],Qt+8))/2+1,Qt+8]),o.push(2.9,2.6);for(let l=Qt;l>d0-.01;l-=(Qt-d0)/44)e.push(L0(l)),o.push(S0*(1+.07*Math.sin(l*.9)+.05*Math.sin(l*2.3)));e.push([r[0]+.5,(r[1]+Dt(r[0],d0-8))/2+.6,d0-8],[r[0]+1.2,Dt(r[0],d0-16)-2,d0-16]),o.push(2.1,1.7),a0(t,e,o,12,(l,u)=>rt(rt(Ze,ye,.5+.3*Math.sin(l*1.7)),[.3,.36,.26],.25+.25*Math.sin(l*.77+1)),()=>[0,1]);for(let l=0;l<70;l++){const u=q.range(d0,Qt),y=L0(u),c=q.range(-1.9,1.9),R=q.range(.22,.5);Ht(t,y[0]+Math.sin(c)*S0*.97,y[1]+Math.cos(c)*S0*.97,u,R,R*.7,R,5,rt(ye,[.5,.56,.42],q()),0,1)}nt(Pt,t.build(),Ct(It,[.5,1.5,.22,26],[.3,.45,.4,s0*.5],[0,.05,1,.01]),"mite-bough");for(let l=Qt-6;l>d0+6;l-=23){const u=L0(l);Io[2].add(u[0]+1.6,u[1]+.5,l,.36,q()*6.283,q.range(-.2,.2),-.55,q(),To()),j0(u[0],l,6,12,.4)}for(let l=Qt;l>d0;l-=12)j0(L0(l)[0],l,5,9,.45)}await a.yield();const Fo=z.spider?tt("#5a4a3c",.7):tt("#d21a14",.86),Se=z.spider?1.25:1,V0=kt(Hn(Fo),1);V0.add(0,0,0,1,0,0,0,0,[1,1,1]);const eo=[[.3,6,.12,14],[.25,1,.55,0]];nt(Pt,V0.geo,Ct(It,eo[0],eo[1],[0,.05,1,.01],{INST:1}),"mite");const Ae=(()=>{const t=new St,e=rt(Fo,[.04,0,0],.35);for(let o=0;o<8;o++)a0(t,[[0,0,o],[1,1,o],[2,0,o]],[.22,.15,.07],4,s=>s===2?e:Fo,()=>[0,.8]);return t.build()})();Ae.attributes.position.setUsage(m.DynamicDrawUsage),Ae.attributes.normal.setUsage(m.DynamicDrawUsage),nt(Pt,Ae,Ct(It,eo[0],eo[1],[0,.05,1,.01]),"mite-legs");const Sa=new m.Vector3,_n=new m.Vector3,Ho=[.22,.15,.07],Aa=(t,e)=>{const o=L0(t),s=o[0],r=o[1]+S0+1.25+.05*Math.sin(e*9),l=Qt-t,u=2.6*Se,y=.6*u;Sa.set(s,r,t),V0.iPos[0]=s,V0.iPos[1]=r,V0.iPos[2]=t,V0.iRot[2]=.03*Math.sin(l*2.4),V0.aP.needsUpdate=!0,V0.aR.needsUpdate=!0;const c=Ae.attributes.position,R=Ae.attributes.normal;let U=0;for(let v=0;v<8;v++){const L=v<4?-1:1,O=v&3,E=((l/u+(O%2?.5:0)+(L>0?.5:0))%1+1)%1;let $,it=0;if(E<.6)$=y/2-E*u;else{const xt=(E-.6)/.4;$=-y/2+y*xt,it=Math.sin(xt*Math.PI)*.75}const ot=t-1+O*.72,dt=[s+L*.95,r-.3,ot],Bt=ot+(O-1.5)*.85*Se-$,ct=1.75*Se,ut=L0(Bt),pt=[s+L*ct,ut[1]+Math.sqrt(Math.max(S0*S0-Math.min(ct,S0-.2)**2,.2))+it-(ct>S0?(ct-S0)*1.2:0),Bt],i0=[(dt[0]+pt[0])/2+L*.75*Se,Math.max(dt[1],pt[1])+1*Se+it*.3,(dt[2]+pt[2])/2],Vt=[dt,i0,pt];for(let xt=0;xt<3;xt++){const Zt=Vt[Math.max(0,xt-1)],Gt=Vt[Math.min(2,xt+1)];let c0=Gt[0]-Zt[0],Ot=Gt[1]-Zt[1];const Et=Math.hypot(c0,Ot)||1;c0/=Et,Ot/=Et;for(let o0=0;o0<4;o0++,U++){const B0=o0*1.5708,R0=Math.cos(B0),wo=Math.sin(B0),Mo=-Ot*R0,Oe=c0*R0,ko=wo;c.setXYZ(U,Vt[xt][0]+Mo*Ho[xt],Vt[xt][1]+Oe*Ho[xt],Vt[xt][2]+ko*Ho[xt]),R.setXYZ(U,Mo,Oe,ko)}}}c.needsUpdate=!0,R.needsUpdate=!0};await a.yield(),Aa(Qt-6,0);const U0=Je(Ro,2+Math.min(Ye.length,170));U0.add(Lo[0],Lo[1]+3.3,Lo[2]+2.4,3.5,0,0,0,.3),U0.add(we[0][0],we[0][1],we[0][2],1.1,0,0,0,.7);for(const t of Ye)U0.add(t[0],t[1],t[2],t[3],0,0,0,q());U0.aP.setUsage(m.DynamicDrawUsage),nt(Pt,U0.geo,_e(It),"dew");const Go=11,Ca=Je(Ro,Go),Ba=Je(new m.SphereGeometry(1,8,6),Go*13);for(let t=0;t<Go;t++){let e,o,s;if(t===0)e=te[0],s=te[2],o=te[1]+22.7;else if(t<6){const y=ke[1+t*7%(ke.length-1)];e=y[0],s=y[1],o=y[2]+22.7*y[3]}else s=q.range(Z-60,mt-20),e=Nt(Y(s,Z-Tt,mt)).x+q.sign()*q.range(10,45),o=Dt(e,s)+.5;const r=q.range(80,120),l=t===0?100:q.range(5.5,10),u=q();Ca.add(e,o,s,1.7,r,l,u,t===0?1:0);for(let y=0;y<13;y++){const c=y/13*6.283;Ba.add(e+Math.cos(c)*.9,o,s+Math.sin(c)*.9,q.range(.3,.62),r,l,u,t===0?1:0)}}await a.yield(),nt(Pt,Ca.geo,_e(It,{DROP:1}),"drops"),nt(Pt,Ba.geo,_e(It,{DROP:1,CROWN:1}),"crowns"),Q0(It,Pt,420,[150,64,150],[1.6,-.25,.5],.5,20,1.2,4,"#fff1d6",[.85,.04,.7],q.fork("motes")),await a.yield();{const t=await va.finish();await a.yield(),nt(Pt,t,P0(It,0),"crust")}await a.yield();const Ce={uOp:{value:1},uLum:{value:f.lum},uHi:{value:new m.Color(f.hi).multiplyScalar(.42)},uB:{value:0},uFogC:{value:p.clone()}},Be=new m.Mesh(new m.SphereGeometry(1500,28,18),new m.ShaderMaterial({uniforms:Object.assign({},It,Ce),vertexShader:Vn,fragmentShader:qn,side:m.BackSide,transparent:!1,blending:m.CustomBlending,blendSrc:m.SrcAlphaFactor,blendDst:m.OneMinusSrcAlphaFactor,depthTest:!1,depthWrite:!1}));Be.renderOrder=-.5,Be.frustumCulled=!1,d.add(Be);const Mt=new m.Group;Mt.name="stage-B",Mt.visible=!1,d.add(Mt);const t0=No([9,1.5,.006,.38]),gt=n.fork("stage-b"),Na=await da(a,T-300,T+300,at-270,Z+60,104,98,yt,8),x0=Do(Na),Da=Y(.16/Wt-.306,-.01,.045),E0=t=>(t+Da)*Wt,Bs=E0(.268),oo=Ee(Bs,34,9,0,new m.Vector3),ao=[oo.x,yt(oo.x,oo.z),oo.z],p0=[ao[0]+15,yt(ao[0]+15,ao[2]+2)+2.5,ao[2]+2],Oo=E0(.3095),so=Ee(Oo,22.5,1.2,0,new m.Vector3),Rt=[so.x,yt(so.x,so.z),so.z],La=1.85;x0(Rt[0],Rt[2],6.5,2.4,.62),x0(Rt[0],Rt[2],3.6,.8,.4);const Ne=(t,e)=>((t-g0)/26)**2+((e-v0)/29)**2<1||((t-p0[0])/13.5)**2+((e-p0[2])/15.5)**2<1;{const t=gt.fork("rocks"),e=f0(g0,pe+3.5,v0,24,21.5,27,56,36,t,.09,At.y-.35,9);nt(Mt,e,P0(t0,3,{uPatch:{value:new m.Vector4(At.x,At.z-1,7.6,1)},uTexS:{value:3.6},uTint:{value:new m.Vector3(.66,.64,.65)}},m.DoubleSide),"boulder"),x0(g0,v0,24,20,.6);const o=P0(t0,3,{uPatch:{value:new m.Vector4(0,0,0,1)},uTexS:{value:3.6},uTint:{value:new m.Vector3(.56,.53,.5)}},m.DoubleSide);{const l=y0(w0("b-skirt:"+a.seed)),u=[f0(p0[0],p0[1]-1.5,p0[2],13,9.5,15,36,24,t,.12,1e9,5)];await a.yield();for(let y=0;y<9;y++){y===4&&await a.yield();const c=y/9*6.283+l.range(-.25,.25),R=l.range(.92,1.12),U=p0[0]+Math.cos(c)*13*R,v=p0[2]+Math.sin(c)*15*R,L=l.range(1.6,4.2);u.push(f0(U,yt(U,v)+L*.18,v,L*l.range(1,1.4),L*.62,L*l.range(.9,1.3),12,8,l,.14,1e9,3)),x0(U,v,L+1,L*.8,.5)}await a.yield(),nt(Mt,la(u),o,"boulder-2"),u.forEach(y=>y.dispose())}x0(p0[0],p0[2],14,9,.7),x0(p0[0],p0[2],19,4,.35),await a.yield();for(let l=0;l<5;l++){const u=t.range(at-30,Z-70),y=Nt(u).x+t.sign()*t.range(22,70),c=t.range(2.5,5.5);Ne(y,u)||(nt(Mt,f0(y,yt(y,u)+c*.3,u,c*1.2,c*.8,c,14,10,t,.14),o,"stone-b"+l),x0(y,u,c+1,c,.5))}await a.yield();const s=y0(w0("b-stones:"+a.seed)),r=[];for(let l=0,u=0;l<20&&u<400;u++){const y=s.range(at-230,Z-60),c=Nt(Y(y,at,Z)).x+s.sign()*s.range(34,230),R=s.range(3,9);if(Ne(c,y)||r.some(v=>Math.hypot(v[0]-c,v[1]-y)<40))continue;const U=f0(c,yt(c,y)+R*.22,y,R*s.range(1,1.5),R*s.range(.55,.85),R*s.range(.9,1.3),14,9,s,.15);U.userData=null,r.push([c,y,U]),x0(c,y,R+1.5,R,.5),l++}r.length&&(nt(Mt,la(r.map(l=>l[2])),o,"stones-far"),r.forEach(l=>l[2].dispose()))}await a.yield();const Va=Z-Tt+6,De=Va-34,no=De-70,Ft=[Nt(De).x-11,De],q0=[Nt(no).x-13.5,no],jo=(t,e)=>{const o=q0[0]-Ft[0],s=q0[1]-Ft[1],r=Y(((t-Ft[0])*o+(e-Ft[1])*s)/(o*o+s*s),0,1);return Math.hypot(t-Ft[0]-o*r,e-Ft[1]-s*r)},Ns=()=>{const t=gt(),e=gt.range(.7,1.2),o=tt(qt[1]);return S==="august"&&t<.5?[.1*e,.24*e,.07*e]:t<.62?[o[0]*e*1.3+.03,o[1]*e*1.3,o[2]*e*1.3]:t<.74?[.4*e,.11*e,.035*e]:t<.8?tt(qt[2],e*.75):[.17*e,.02*e,.03*e]};await a.yield();for(let t=0;t<15;t++)gt();const _t=y0(w0("b-leaves:"+a.seed)),qa=16,K0=kt(vs(_t),Math.round(1700*g)+qa),Ta=kt((()=>{const t=new St;return Ht(t,0,0,0,1,.92,1,7,[1,1,1]),t.build()})(),260);{const t=y0(w0("b-ptleaves:"+a.seed)),e=tt(qt[1]),o=lt.tangentAt(E0(.306),new m.Vector3);for(let s=0;s<qa;s++){const r=s<11,l=r?t.range(-1.3,1.3):t.range(1.6,4.7),u=r?t.range(3.6,8.5):t.range(4,9),y=Math.cos(l),c=Math.sin(l),R=Rt[0]+(-o.x*y+o.z*c)*u,U=Rt[2]+(-o.z*y-o.x*c)*u,v=t.range(.75,1.25);K0.add(R,yt(R,U)+(r?t.range(.4,1.3):.2),U,t.range(2,3),t()*6.283,t.range(-.3,.3),t.range(-.3,.3),t(),t.chance(.75)?[e[0]*v*1.3+.03,e[1]*v*1.3,e[2]*v*1.3]:[.4*v,.11*v,.035*v])}}for(let t=0;t<9e3&&K0.count<K0.max;t++){const e=gt.range(at-45,Z-42),o=Nt(e).x+gt.gauss()*26;if(Ne(o,e)||jo(o,e)<2.4)continue;const s=yt(o,e),r=gt.range(1,1.75);K0.add(o,s+.08,e,r,gt()*6.283,gt.range(-.15,.15),gt.range(-.15,.15),gt(),Ns()),gt.chance(.16)&&Ta.add(o+gt.range(-.5,.5),s+.42*r,e+gt.range(-.5,.5),gt.range(.26,.4),0,0,0,0,[.02,.018,.03]),(t&511)===0&&await a.yield()}const Ia=Ct(t0,[.22,3,.95,70],[.5,.3,.35,s0*.5],[.3,.2,5,.03],{INST:1,LEAF:1});nt(Mt,K0.geo,Ia,"bearberry"),nt(Mt,Ta.geo,Ct(t0,[.1,3,1.6,90],[0,.6,.2,0],[0,.1,1,.01],{INST:1}),"berries");const ro=kt(vs(_t,5,2),Math.round(950*g));for(let t=0;t<12e3&&ro.count<ro.max;t++){const e=_t.range(at-250,Z-46),o=Nt(Y(e,at,Z)).x,s=_t.sign()*_t.range(20,240)*(_t.chance(.5)?.5:1),r=o+s;if(e>at-30&&Math.abs(s)<34&&_t.chance(.7)||Ne(r,e)||jo(r,e)<3.5||i.n2(r*.016+12,e*.016)+.4*i.n2(r*.06,e*.06+31)<-.1)continue;const l=_t(),u=_t.range(.75,1.2),y=tt(qt[1]),c=_t.range(2.2,4.4),R=l<.5?[y[0]*u*1.35+.03,y[1]*u*1.3,y[2]*u*1.3]:l<.66?[.42*u,.12*u,.04*u]:l<.76?tt(qt[2],u*.75):l<.9?[.035*u,.07*u,.03*u]:[.2*u,.03*u,.04*u];ro.add(r,yt(r,e)+.05,e,c,_t()*6.283,_t.range(-.12,.12),_t.range(-.12,.12),_t(),S==="august"&&l<.4?[.1*u,.24*u,.07*u]:R),c>3.2&&x0(r,e,c*.9,c*.5,.3),(t&511)===0&&await a.yield()}nt(Mt,ro.geo,Ia,"bearberry-far"),await a.yield();const io=kt(xs(gt,12,1.5,.11,.85,.15),Math.round(320*g));for(let t=0;t<2e3&&io.count<io.max;t++){const e=gt.range(at-45,Z-42),o=Nt(e).x+gt.gauss()*30;if(Ne(o,e)||jo(o,e)<2||i.n2(o*.05,e*.05+50)<.15)continue;const s=gt.range(.7,1.1);io.add(o,yt(o,e),e,gt.range(.8,1.5),gt()*6.283,0,0,gt(),[.07*s,.13*s,.05*s]),(t&255)===255&&await a.yield()}await a.yield(),nt(Mt,io.geo,Ct(t0,[.25,4,.4,40],[.4,.3,.4,s0*.6],[.1,.2,4,.03],{INST:1}),"crowberry"),await a.yield();{const t=new St,e=tt("#4a3628",.6),o=tt("#8a7c6e",.6),s=ht.x-9.5,r=at-6,l=yt(s,r)-.3,u=ua(gt,{height:13,orders:4,ratio:.76,spread:.55,lift:.12,radius:.5,lean:.35});Ao(t,u,gt,{base:e,tip:o,orders:4,sides:6,midTo:2,height:13}),await a.yield();const y=S==="late"?.08:.5;for(const R of u)if(!(R.order<3))for(let U=0;U<2;U++){if(!gt.chance(y))continue;const v=gt.range(.3,1),L=[J(R.a[0],R.b[0],v),J(R.a[1],R.b[1],v),J(R.a[2],R.b[2],v)],O=rt(tt(qt[2],.95),tt("#c2571c",.9),gt()),E=gt.range(-.5,.5),$=gt.range(-.5,.5),it=1,ot=0,dt=gt.range(.38,.55),Bt=t.v(L[0],L[1]+.1,L[2],O,.9,1),ct=[];for(let ut=0;ut<12;ut++){const pt=ut/12*6.283,i0=dt*(ut%2?.86:1),Vt=Math.cos(pt)*i0,xt=Math.sin(pt)*i0;ct.push(t.v(L[0]+Vt*it,L[1]+.1+Vt*E+xt*$,L[2]+xt+Vt*ot,rt(O,[.5,.2,.05],.25),.9,1))}for(let ut=0;ut<12;ut++)t.tri(Bt,ct[ut],ct[(ut+1)%12])}const c=t.build();c.translate(s,l,r),nt(Mt,c,Ct(t0,[.3,3,.35,40],[.7,.3,.4,s0*.5],[.16,.12,3.2,.03]),"birch-twig"),x0(s,r,3,8,.4)}await a.yield(),Q0(t0,Mt,130,[90,34,90],[3.2,-2,.9],.5,16,1.5,3,qt[2],[.95,0,.95],gt.fork("leaves")),Q0(t0,Mt,200,[70,20,70],[.3,.05,.1],.16,6,2.6,2.5,"#1a1612",[.5,.02,.8],gt.fork("gnats")),await a.yield(),nt(Mt,await Na.finish(),P0(t0,1,{uRun:{value:new m.Vector4(Ft[0],Ft[1],q0[0],q0[1])}}),"mat"),await a.yield();const ee=kt(z.squirrel?ms(tt("#8f7a56",.7),tt("#cdbf9c",.7),1):ms(tt("#8a4a24",.75),tt("#b9a583",.7)),1);ee.add(Ft[0],yt(Ft[0],Ft[1]),Ft[1],1.3,0,0,0,0,[1,1,1]);const Ra=new m.Vector3(Ft[0],yt(Ft[0],Ft[1]),Ft[1]);nt(Mt,ee.geo,Ct(t0,[.5,5,.1,12],[.3,.75,.5,0],[0,.1,1,.01],{INST:1}),"lemming");const Fa=Math.atan2(-(q0[0]-Ft[0]),-(q0[1]-Ft[1])),Ds=(t,e)=>{const o=Y(.8*(Va-t)/(De-no),0,1),s=o*(De-no),r=J(Ft[0],q0[0],o),l=J(Ft[1],q0[1],o),u=Math.abs(Math.sin(s*.9)),y=o<=0?1:0,c=ee.iPos,R=ee.iRot,U=z.squirrel?1.45:1.3;c[0]=r+Math.sin(s*.35)*.5,c[1]=yt(r,l)+.1+u*.55*(1-y),c[2]=l,c[3]=U*(1-Q(.93,1,o)),R[0]=Fa+Math.sin(s*.35)*.12,R[1]=y&&z.squirrel?1.25+.04*Math.sin(e*2.1):(.5-u)*.3,y&&z.squirrel&&(c[1]+=1.6,R[0]=Fa+2.6+.3*Math.sin(e*.7)),Ra.set(c[0],c[1],c[2]),ee.aP.needsUpdate=!0,ee.aR.needsUpdate=!0};await a.yield();const e0=[.5,.5,.52],T0=tt("#8c4a20",.8),co=S==="late",Ls=z.owl?je({len:12,span:23,neck:0,head:1.9,body:e0,belly:e0,neckCol:e0,headCol:e0,wing:[.5,.5,.52],tip:[.3,.29,.28],tipFrom:.86,tail:[.46,.46,.48],beak:[.05,.05,.05],chord:1.25,ns:12,sides:12,tailW:1.2}):je({len:11,span:18,neck:.05,head:2,tailRoot:[.05,.05,.06],body:co?rt(T0,e0,.8):T0,belly:e0,neckCol:co?rt(T0,e0,.6):T0,headCol:co?rt(T0,e0,.5):T0,wing:e0,tip:e0,tipFrom:2,tail:[.035,.035,.045],beak:[.05,.05,.05],chord:1.3,ns:12,sides:12,tailW:2.3,tailL:.24,plump:1.25,sweep:.06,taperK:.62,taperP:2.6,headUp:.05,covert:.75,camber:.04,arch:.05}),Ha=[[.2,2.5,.2,24],[.1,.35,.45,z.owl?.9:1.1]],Wo=(()=>{const t=lt.tangentAt(E0(.306),new m.Vector3);return Math.atan2(-t.z,t.x)+.12})(),I0=kt(Ls,1);I0.add(Rt[0],Rt[1]+3,Rt[2],La,Wo,.2,0,-1.5708,[1,1,1],1.25);const _0=kt(z.owl?Rn({white:e0,turn:1.2}):In({white:e0,ruf:co?rt(T0,e0,.55):T0,turn:.55}),1),Vs=z.owl?1.5:La;_0.add(Rt[0],Rt[1]-.2,Rt[2],Vs,Wo,0,0,0,[1,1,1],0);const Ga=Ct(t0,Ha[0],Ha[1],[0,.1,1,.01],{INST:1,BIRD:1}),Oa=nt(Mt,I0.geo,Ga,"ptarmigan"),qs=nt(Mt,_0.geo,Ga,"ptarmigan-standing");Oa.visible=!1;const oe=new m.Vector3(Rt[0],Rt[1]+3,Rt[2]),ae=new m.Vector3,$0=new m.Vector3,Uo=new m.Vector3,se=new m.Vector3,lo=Rt[1]+3-lt.pointAt(Oo).y,ja=[[Oo,22.5,1.2,lo],[.3125,23.5,-.2,lo+1.8],[.318,25,-6,lo*.6],[.328,27,-19,lo*.38],[.34,42,-38,-7],[.352,70,-52,-11],[.38,150,-90,-20]].map((t,e)=>e?[E0(t[0]),t[1],t[2],t[3]]:t),Ts=(t,e)=>{const o=I0.iPos,s=I0.iRot,r=t/Wt-Da,l=r<=.3095;if(qs.visible=l,Oa.visible=!l,l){const u=Q(.3068,.3095,r);_0.iPos[1]=Rt[1]-.2+.04*Math.sin(e*2.1)-.45*u,_0.iRot[0]=Wo+.04*Math.sin(e*.9),_0.iRot[1]=.02*Math.sin(e*1.7)-.1*u,_0.aP.needsUpdate=!0,_0.aR.needsUpdate=!0,oe.set(Rt[0],Rt[1]+3,Rt[2]).multiplyScalar(Mt.scale.x).add(Mt.position)}else{Ke(ja,t,oe),Ke(ja,t+.004*Wt,ae),$0.subVectors(ae,oe).normalize();const u=Q(.332,.35,r),y=1-Q(.3095,.322,r),c=Q(.312,.319,r)*(1-Q(.324,.338,r));lt.tangentAt(Y(t,0,1),Uo),$0.x+=.35*c*Uo.z,$0.z-=.35*c*Uo.x,$0.normalize(),s[0]=Math.atan2(-$0.x,-$0.z),s[1]=Math.asin(Y($0.y,-1,1))*.6+.3*y+.4*(1-Q(.325,.35,r));{const R=Math.cos(s[0]),U=Math.sin(s[0]),v=Math.cos(s[1]),L=Math.sin(s[1]);lt.pointAt(Y(t,0,1),se).sub(oe);const O=R*se.x-U*se.z,E=U*L*se.x+v*se.y+R*L*se.z;s[2]=Y(Math.atan2(O,-E),-1.2,1.2)*.6*c+.1*Q(.32,.335,r)*(1-Q(.335,.36,r))}s[3]=J(e*19+1.45,.4+Math.sin(e*5)*.5,u),I0.iCol[3]=J(.6,.3,u),Bo(Mt,ae.copy(oe)),o[0]=ae.x,o[1]=ae.y,o[2]=ae.z,o[3]=J(1,1.3,Q(.3095,.322,r))}I0.aP.needsUpdate=!0,I0.aR.needsUpdate=!0,I0.aC.needsUpdate=!0};await a.yield();const wt=new m.Group;wt.name="stage-C",wt.visible=!1,d.add(wt);const Ut=No([9.5,1.6,.0042,.42]),st=n.fork("stage-c"),Eo=330,Ko=G-260,_o=G+300,Wa=await da(a,T-Eo,T+Eo,Ko,_o,110,100,vt,14),ho=Do(Wa),Ua=Eo/m0-.7;A.uHole.value.set(T,G+((Ko+_o)/2-G)/m0,Ua,(_o-Ko)/2/m0-.7);const ne=t=>T+10.6+1.1*Math.sin(t*.03);nt(wt,f0(ht.x+(g0-ht.x)/H0,ht.y+.25,ht.z+(v0-ht.z)/H0,.8,.72,.9,16,10,st.fork("rock"),.1),P0(Ut,3,{uPatch:{value:new m.Vector4(0,0,0,1)},uTexS:{value:110}},m.DoubleSide),"boulder-far");const Is=()=>{const t=st(),e=st.range(.75,1.2);return S==="late"?t<.5?tt("#7a4526",e):t<.82?tt("#a07c38",e*.85):tt(qt[1],e*.6):S==="august"&&t<.55?[.14*e,.26*e,.07*e]:t<.38?tt(qt[2],e*.7):t<.66?tt("#c65a1c",e*.66):t<.86?tt(qt[1],e*.85):t<.93?[.05*e,.085*e,.04*e]:tt("#c9a23a",e*.72)};for(let t=0;t<21;t++)st();const Ea=bs(y0(w0("c-bush:"+a.seed)),17,.42,.7,S==="late"?.22:.3),Ka=Un(y0(w0("c-bush-near:"+a.seed)),.42,.7,.115,!1),$o=Math.round(4700*g),fo=kt(Ea,$o),Rs=12,Fs=t=>Y(Math.floor((at+20-t)/Rs),0,99),Zo=[];let Yo=0;const re=kt(xs(st,10,.46,.034,1.1,.55),Math.round(1100*g)),_a=kt((()=>{const t=new St;return Ht(t,0,0,0,1,.8,1,6,[1,1,1],1,1),t.build()})(),S==="august"?700:240),Xo=(t,e)=>Math.abs(t-ht.x)<7.6&&e>at-6.2&&e<at+8.6;for(let t=0;t<26e3&&(Yo<$o||re.count<re.max);t++){const e=st.range(G-40,at+20),o=Nt(e).x,s=o+st.gauss()*(st.chance(.7)?9:30),r=vt(s,e);if(!(Xo(s,e)||Math.abs(s-ne(e))<4.5&&st.chance(.75))){if(st.chance(.7)){const l=[s,r-.03,e,st.range(.7,1.6),st()*6.283,st.range(-.15,.15),st.range(-.15,.15),st(),Is()];if(Yo>=$o)continue;if(Yo++,Math.abs(s-o)<8.5){const u=Fs(e);(Zo[u]=Zo[u]||[]).push(l)}else fo.add(...l)}else{const l=st.range(.8,1.25),u=st.range(.8,1.5);re.add(s,r-.03,e,u,st()*6.283,0,0,st(),rt(tt(qt[3],1.3*l),tt("#b89a5a",.8*l),st()*.5)),st.chance(S==="august"?.7:.22)&&_a.add(s+st.range(-.2,.2)*u,r+.42*u,e+st.range(-.2,.2)*u,st.range(.035,.06),0,0,0,st(),[.8,.8,.78])}(t&511)===0&&await a.yield()}}const Hs=[.09,.5,2.6,.04],uo=Ct(Ut,[.3,9,.08,30],[.7,.3,.45,s0*.6],Hs,{INST:1});nt(wt,fo.geo,uo,"dwarf-birch");const Jo=[];for(const t of Zo){if(!t||!t.length)continue;const e=kt(Ea,t.length);let o=0;for(const u of t)e.add(...u),o+=u[2]/t.length;const s=new m.InstancedBufferGeometry;for(const u in Ka.attributes)s.setAttribute(u,Ka.attributes[u]);s.setAttribute("iPos",e.aP),s.setAttribute("iRot",e.aR),s.setAttribute("iCol",e.aC),s.instanceCount=e.count;const r=nt(wt,e.geo,uo,"bush-far"),l=nt(wt,s,uo,"bush-near");l.visible=!1,Jo.push({far:e.geo,near:s,mf:r,mn:l,n:e.count,x:Nt(o).x,z:o})}await a.yield();{const t=y0(w0("c-clumps:"+a.seed)),e=kt(bs(t,13,.5,.7,S==="late"?.26:.34),Math.round(1450*g));for(let o=0;o<3e4&&e.count<e.max;o++){const s=t.range(G-215,at+30),r=T+t.gauss()*95,l=Math.abs(r-Nt(Y(s,G,at)).x);if(s>G-30&&l<22||l>300||Xo(r,s)||i.n2(r*.022+40,s*.022)+.5*i.n2(r*.08,s*.08+9)<.05)continue;const u=t(),y=t.range(.75,1.2),c=t.range(1.5,3.3)*(1+Math.min(l,160)*.004),R=S==="august"&&u<.5?[.13*y,.25*y,.07*y]:u<.36?tt(qt[2],y*.7):u<.62?tt("#c65a1c",y*.66):u<.82?tt(qt[1],y*.85):u<.92?[.05*y,.09*y,.04*y]:tt("#c9a23a",y*.72);e.add(r,vt(r,s)-.04,s,c,t()*6.283,t.range(-.15,.15),t.range(-.15,.15),t(),R),c>2.6&&ho(r,s,c*.8,c*.45,.28),(o&511)===0&&await a.yield()}nt(wt,e.geo,uo,"clumps")}nt(wt,re.geo,Ct(Ut,[.3,9,.2,30],[.6,.3,.5,s0*.6],[.14,.5,2.6,.04],{INST:1}),"tussocks"),nt(wt,_a.geo,Ct(Ut,[.1,9,.1,10],[.8,.6,.6,0],[.14,.5,2.6,.04],{INST:1}),"cottongrass"),await a.yield();for(let t=0;t<56;t++)st();const $a=y0(w0("c-stones:"+a.seed)),Le=kt(ys($a,i,6,4,.18),264+Math.round(300*g)),po=kt(ys($a,i,12,8,.24),Math.round(120*g)),Za=()=>{const t=st.range(.13,.25);return st.chance(.3)?[t*.95,t,t*1.08]:[t,t*.97,t*.93]};for(let t=0;t<22;t++){const e=st.range(G+5,at-30),o=Nt(e).x+st.sign()*st.range(3,34),s=st.range(1.3,2.3);if(!Xo(o,e))for(let r=0;r<12;r++){const l=r/12*6.283+st.range(-.15,.15),u=o+Math.cos(l)*s,y=e+Math.sin(l)*s;Le.add(u,vt(u,y)+.03,y,st.range(.16,.3),st()*6.283,st.range(-.3,.3),st.range(-.3,.3),0,Za())}}await a.yield();for(let t=0;t<4e3&&(Le.count<Le.max||po.count<po.max);t++){(t&511)===511&&await a.yield();const e=st.range(G-210,G-4),o=T+st.gauss()*34,s=.25+Math.pow(st(),2.2)*1.5,r=s>.62?po:Le;Math.abs(o-ne(e))<2.2||r.add(o,vt(o,e)+s*.16,e,s,st()*6.283,st.range(-.3,.3),st.range(-.3,.3),0,Za())<0||s>.62&&ho(o,e,s+3,s*1.5,.4)}await a.yield();const Ya=Ct(Ut,[.5,2.6,.2,24],[0,.2,.3,s0*.3],[0,.1,1,.01],{INST:1});nt(wt,Le.geo,Ya,"stones"),nt(wt,po.geo,Ya,"boulders"),await a.yield();const Qo=[];for(let t=at+70;t>G-22;t-=30)Qo.push([ne(t),0,t]);Qo.push([T+11,0,G-34],[T+11.5,0,G-62],[T+13,0,G-100],[T+17,0,G-150]);const mo=T-2,Xa=T+30,Ve=G-166,ta=at+78,A0=16,qe=Math.ceil((ta-Ve)/3),Te=new Float32Array((A0+1)*(qe+1));for(let t=0;t<=qe;t++){for(let e=0;e<=A0;e++)Te[t*(A0+1)+e]=vt(mo+(Xa-mo)*e/A0,Ve+(ta-Ve)*t/qe);(t&15)===15&&await a.yield()}const Gs=(t,e)=>{const o=Y((t-mo)/(Xa-mo),0,1)*A0,s=Y((e-Ve)/(ta-Ve),0,1)*qe,r=Math.min(A0-1,Math.floor(o)),l=Math.min(qe-1,Math.floor(s)),u=o-r,y=s-l,c=l*(A0+1)+r;return J(J(Te[c],Te[c+1],u),J(Te[c+A0+1],Te[c+A0+2],u),y)};await a.yield();const ea=xn({rng:st.fork("herd"),preset:{...bn.deer,h:1.5,width:.4,depth:.52,chest:1.14,croup:.06,bodyLen:1.06,leg:[.074,.047,.033],joints:1,neckLen:.46,neck:[.215,.125],neckAng:36,headLen:.35,headR:.1,headPitch:34,ears:.1,antlers:.36,pattern:"none",coat:"#392a20",belly:"#b9ae99",legs:"#211812",sock:"#d9d0bd",accent:"#e9e3d3",horn:"#c9b894",rump:"#f1ebdf",varieties:.62},count:70,mode:"migrate",route:Qo,closed:!1,heightAt:Gs,speed:1.35,spread:[2.3,112],sizes:[1,.92,1.06,.62,.96,1.02,.9,.6],light:{sunDir:x.clone(),sunColor:A.uSunCol.value.clone(),sunIntensity:1,sky:A.uSkyCol.value.clone(),skyIntensity:1,ground:new m.Color(qt[3]),groundIntensity:.5*f.lum+.1},fill:.2,rim:.5});wt.add(ea.object),await a.yield();const go=Y(.25,zt.l2b+.03,zt.l3a-.004),vo=lt.pointAt(go,new m.Vector3),Ja=new m.ShaderMaterial({uniforms:Object.assign(be(),Ut,{uNearT:{value:0},uRim:{value:.7}}),vertexShader:Mn,fragmentShader:kn,defines:{BENCH:1},fog:!0});{const t=wn(),e=new m.InstancedBufferGeometry;e.setIndex(t.index);for(const U of["position","normal","color","aPart"])e.setAttribute(U,t.attributes[U]);const o=[[14,-4,1.25],[17.5,-2.4,.96],[21,-.8,1.08],[25.6,-.9,.92],[28.2,1.6,.62],[31.2,-.3,1.17],[34.8,1.1,.98]],s=o.length,r=new Float32Array(s*4),l=new Float32Array(s*4),u=new Float32Array(s);o.forEach(([U,v,L],O)=>{const E=vo.z-U,$=ne(E)+v;let it=ne(E-4)-ne(E+4),ot=-8;const dt=Math.hypot(it,ot);it/=dt,ot/=dt,r.set([$,E,L,1],O*4),l.set([it,ot,(O*.37+.2)%1,-vt($,E)],O*4),u[O]=(vt($+it*4,E+ot*4)-vt($,E))/4}),e.setAttribute("iPos",new m.InstancedBufferAttribute(r,4)),e.setAttribute("iRot",new m.InstancedBufferAttribute(l,4)),e.setAttribute("iUp",new m.InstancedBufferAttribute(u,1)),e.instanceCount=s,nt(wt,e,Ja,"file-near");const y=vo.z-29,c=vo.x-5.5,R=y0(w0("c-anchor:"+a.seed));nt(wt,f0(c,vt(c,y)+.8,y,3.5,2.5,3,26,18,R,.13,1e9,6),P0(Ut,3,{uPatch:{value:new m.Vector4(c,y,2.3,1)},uTexS:{value:110},uTint:{value:new m.Vector3(.27,.265,.285)}},m.DoubleSide),"anchor-boulder"),ho(c,y,3.8,2.6,.62);for(let U=0;U<4;U++){const v=R()*6.283,L=R.range(3.6,5.4),O=R.range(.5,1.1),E=c+Math.cos(v)*L,$=y+Math.sin(v)*L;nt(wt,f0(E,vt(E,$)+O*.2,$,O*1.2,O*.7,O,10,7,R,.14),P0(Ut,3,{uPatch:{value:new m.Vector4(0,0,0,1)},uTexS:{value:110},uTint:{value:new m.Vector3(.44,.43,.44)}},m.DoubleSide),"anchor-stone"+U),ho(E,$,O+.4,O*.7,.45)}}await a.yield();const oa=z.swans?9:39,Qa=[.03,.03,.035],r0=[.5,.5,.52],ts=z.swans?je({len:1.5,span:2.3,neck:.42,head:.9,body:r0,belly:r0,neckCol:r0,headCol:r0,wing:r0,tip:r0,tipFrom:2,tail:r0,beak:[.05,.05,.05],ns:8,sides:8}):je({len:.75,span:1.4,neck:.2,head:1,body:r0,belly:[.42,.42,.45],neckCol:r0,headCol:r0,wing:r0,tip:Qa,tipFrom:.66,tail:r0,beak:tt("#c8627a",.8),ns:8,sides:8}),ie=kt(ts,oa);for(let t=0;t<oa;t++)ie.add(0,-1e3,0,0,0,0,0,0,[1,1,1],.75);nt(wt,ie.geo,Ct(Ut,[.12,4,.2,20],[.1,.35,.5,0],[0,.1,1,.01],{INST:1,BIRD:1}),"geese");const Os=Y(.2475,zt.l2b+.03*Wt,zt.l3a-.012*Wt),aa=.3,es=z.swans?2.3:1.7,js=z.swans?1.3:2,os=[],Ws=z.swans?[[0,0,0,9,1.35]]:[[0,0,0,21,1.35],[4.8,5,2.2,18,1.25]];for(const t of Ws)for(let e=0;e<t[3];e++){const o=Math.ceil(e/2),s=e%2?1:-1;os.push([t[0]-o*.42*es+st.range(-.12,.12),t[1]+s*o*t[4]*es+st.range(-.12,.12),t[2]+st.range(-.2,.2),st()*6.283])}const ce=new m.Vector3,sa=new m.Vector3,as=Math.cos(aa),ss=Math.sin(aa),Us=(t,e)=>{const o=(t-Os)/(.036*Wt),s=l0((at-lt.pointAt(Y(t,0,1),ce).z)/h0),r=Q(-2.7,-2.1,o)*(1-Q(2.1,2.7,o))*Q(.62,.88,s)/Math.max(1,wt.scale.x/1.3),l=ie.iPos,u=ie.iRot,y=2.5-6.5*o-1.6*o*o*o,c=15+1.2*o*o;lt.tangentAt(Y(t,0,1),sa);const R=Math.atan2(-sa.x,-sa.z)+aa;for(let U=0;U<oa;U++){const v=os[U],L=U*4,O=Math.sin(e*.6+v[3]),E=v[0]+O*.2,$=v[1]+Math.sin(e*.43+v[3]*2)*.15;Ee(t,c+E*as+$*ss,y+$*as-E*ss,2.6+v[2]+.15*O,ce),Bo(wt,ce),l[L]=ce.x,l[L+1]=ce.y,l[L+2]=ce.z,l[L+3]=r*js,u[L]=R,u[L+1]=.04,u[L+2]=.06*Math.sin(e*.9+v[3]),u[L+3]=e*(z.swans?16:23)+v[3]}ie.aP.needsUpdate=!0,ie.aR.needsUpdate=!0};Q0(Ut,wt,110,[50,12,50],[2.6,-.5,.7],.06,7,.5,1.2,S==="late"?"#e8ecf2":qt[2],[.9,0,.9],st.fork("fluff")),nt(wt,await Wa.finish(),P0(Ut,2,{uHeath:{value:new m.Vector4(T+11,8.5,1,0)},uPatch:{value:new m.Vector4(G,W.y,0,0)}}),"bench"),await a.yield();const $t=new m.Group;$t.name="stage-D",$t.visible=!1,d.add($t),$t.add(H.object);const xo=Object.assign({},A,{uFade:{value:1}}),ns=n.fork("stage-d");w==="dawn"||S==="late"?Q0(xo,$t,w==="dawn"?260:520,[90,50,90],[5.5,-1.7,1.3],.1,5,.9,1.5,"#eef2f8",[.9,.05,.85],ns.fork("snow")):Q0(xo,$t,240,[90,50,90],[6,-.5,1.6],.13,6,1.4,2,"#f1e7d2",[.9,.03,.85],ns.fork("blown")),await a.yield();const Ie=[.94,.94,.96],Es=z.swans?ts:je({len:.75,span:1.4,neck:.2,head:1,body:Ie,belly:[.8,.8,.84],neckCol:Ie,headCol:Ie,wing:Ie,tip:Qa,tipFrom:.66,tail:Ie,beak:tt("#c8627a",.8),ns:8,sides:8}),le=z.swans?12:30,Z0=kt(Es,le),rs=[],Ks=z.swans?1.25:1.8;{const t=y0(w0("d-geese:"+a.seed));for(let e=0;e<le;e++){const o=e<le*.6?0:1,s=o?e-Math.ceil(le*.6):e,r=Math.ceil(s/2),l=s%2?1:-1;rs.push([(o?-9:0)-r*1.5+t.range(-.5,.5),(o?-13:0)+l*r*2.5+t.range(-.6,.6),(o?2.2:0)+r*.22+t.range(-.5,.5),t()*6.283]),Z0.add(0,-1e3,0,0,0,0,0,0,[1,1,1],.75)}}nt($t,Z0.geo,Ct(xo,[.12,4,.2,20],[.1,.35,.5,0],[0,.1,1,.01],{INST:1,BIRD:1}),"river-geese");const Re=[[Lt.root-.05,70,-34,-24],[Lt.root-.012,34,-9,-8],[Lt.root+.022,34,1.5,-3],[Lt.fork-.02,33,4,-2],[Lt.fork+.012,34,8,-1],[Lt.fork+.04,40,30,4],[Lt.turn-.012,70,84,20],[Lt.turn+.02,120,150,36]],Fe=new m.Vector3,Y0=new m.Vector3,He=new m.Vector3,_s=(t,e)=>{const o=Z0.iPos,s=Z0.iRot,r=Re[0][0],l=Re[Re.length-1][0],u=Q(r,r+.012,t)*(1-Q(l-.02,l,t));if(u<=0){if(o[3]!==0){for(let L=0;L<le;L++)o[L*4+3]=0;Z0.aP.needsUpdate=!0}return}Ke(Re,t,He),Ke(Re,t+.004,Y0),Y0.sub(He);const y=Math.hypot(Y0.x,Y0.z)||1,c=Y0.x/y,R=Y0.z/y,U=Math.atan2(-c,-R),v=Y(Math.atan2(Y0.y,y),-.3,.45)*.6;for(let L=0;L<le;L++){const O=rs[L],E=L*4,$=Math.sin(e*.6+O[3]),it=O[0]+$*.3,ot=O[1]+Math.sin(e*.43+O[3]*2)*.25;Fe.set(He.x+c*it-R*ot,He.y+O[2]+.2*$,He.z+R*it+c*ot),Bo($t,Fe),o[E]=Fe.x,o[E+1]=Fe.y,o[E+2]=Fe.z,o[E+3]=u*Ks,s[E]=U,s[E+1]=v+.04,s[E+2]=.07*Math.sin(e*.9+O[3]),s[E+3]=e*(z.swans?16:22)+O[3]}Z0.aP.needsUpdate=!0,Z0.aR.needsUpdate=!0};await a.yield();let na=null;if(B){const t=kt(Fn(),1);t.add(0,-1e3,0,0,0,0,0,0,[1,1,1],.3),nt($t,t.geo,Ct(xo,[.22,3,.25,20],[.5,.9,.55,2.4],[0,.1,1,.01],{INST:1,BIRD:1}),"eagle");const e=[[.74,64,-44,-26],[.765,30,-18,-11],[.785,15,-7.5,-5.6],[.8,12.8,-4.2,-4.5],[.82,12.6,-2.4,-4.3],[.84,13.2,-.4,-4.5],[.86,21,9,-8],[.892,80,56,-32]],o=Lt.root-.072,s=.75,r=[0,0,0],l=new m.Vector3,u=new m.Vector3;na=(y,c,R,U)=>{const v=t.iPos,L=t.iRot,O=.74+(y-o)/s;let E=0;for(;E<e.length-2&&O>e[E+1][0];)E++;const $=e[Math.max(0,E-1)],it=e[E],ot=e[E+1],dt=e[Math.min(e.length-1,E+2)],Bt=ot[0]-it[0],ct=Y((O-it[0])/Bt,0,1),ut=ct*ct,pt=ut*ct,i0=2*pt-3*ut+1,Vt=pt-2*ut+ct,xt=-2*pt+3*ut,Zt=pt-ut;for(let N0=1;N0<=3;N0++){const pn=(ot[N0]-$[N0])/Math.max(ot[0]-$[0],1e-6)*Bt,mn=(dt[N0]-it[N0])/Math.max(dt[0]-it[0],1e-6)*Bt;r[N0-1]=i0*it[N0]+Vt*pn+xt*ot[N0]+Zt*mn}R.getWorldDirection(l),l.y=0,l.lengthSq()<1e-6&&l.set(0,0,-1),l.normalize();const Gt=U.x+l.x*r[0]-l.z*r[1],c0=U.y+r[2]+.25*Math.sin(c*.8),Ot=U.z+l.z*r[0]+l.x*r[1];v[0]=Gt,v[1]=c0,v[2]=Ot,v[3]=Q(.74,.755,O)*(1-Q(.878,.892,O));const Et=Q(.765,.79,O)*(1-Q(.85,.875,O)),o0=Math.atan2(-l.x,-l.z)-.5*Et-.25,B0=.1*Et,R0=Math.cos(o0),wo=Math.sin(o0),Mo=Math.cos(B0),Oe=Math.sin(B0);u.set(U.x-Gt,U.y-c0,U.z-Ot);const ko=R0*u.x-wo*u.z,dn=wo*Oe*u.x+Mo*u.y+R0*Oe*u.z;L[0]=o0,L[1]=B0,L[2]=Y(Math.atan2(-ko,dn),-.75,.75)*.85*Et+.06*Math.sin(c*.6),L[3]=Math.sin(c*2.1)*1.1,t.aP.needsUpdate=!0,t.aR.needsUpdate=!0}}await a.yield();const he=new m.Mesh(new m.PlaneGeometry(200,200),new m.MeshBasicMaterial({colorWrite:!1,fog:!1}));he.position.copy(I.portalSeat.position),he.position.z+=14,he.renderOrder=4.5,he.frustumCulled=!1,d.add(he);const $s=Mt.children.filter(t=>t.name!=="boulder"),Zs=wt.children.filter(t=>t.name!=="bench"&&t.name!=="bush-far"&&t.name!=="bush-near"),Ys=H.object.children.filter(t=>t.name!=="ridge"&&t.name!=="plain"),Xs=K0.count,Js=Pe.count,Qs=fo.count,tn=re.count,is=W0.map(t=>t.count),en=ze.count;j.ridge.renderOrder=-.8,j.nose.renderOrder=-.8,j.plain.renderOrder=-.85,wt.children.find(t=>t.name==="bench").renderOrder=-.8;const on=at+70-(vo.z-38)+112,Ge=new m.Vector3,cs=(t,e,o,s,r)=>{t.scale.setScalar(e),t.position.set(o,s,r),t.updateMatrixWorld(!0)},fe=(t,e,o)=>cs(t,o,e.x*(1-o),e.y*(1-o),e.z*(1-o)),an=(t,e,o,s,r)=>cs(t,o*r,s.x*(1-r)+r*e.x*(1-o),s.y*(1-r)+r*e.y*(1-o),s.z*(1-r)+r*e.z*(1-o)),C0=[.0042,.0036,32e-5,24e-5].map(t=>t*f.fogK),ra=b.clone().lerp(new m.Color(qt[5]).multiplyScalar(f.lum),.6),ls=p.clone().lerp(ra,.5),bo=new m.Vector3,ia=new m.Vector2,ue=new m.Vector3,sn=[[Pt,It],[Mt,t0],[wt,Ut]],nn=mt-46,hs=mt-162,fs=t=>{const e=lt.pointAt(Y(t,0,1),ue).z,o=l0((Z-e)/Tt),s=l0((at-e)/h0),r=Math.pow(l0((G-e)/_),1.4),l=e>Z-Tt+.01,u=e>at-h0*.72,y=e>G-_-16;he.visible=u,Pt.visible=l,Mt.visible=u,wt.visible=s>.15&&y,$t.visible=s>.15;const c=o>.45;for(const O of $s)O.visible=c;const R=s>.45;for(const O of Zs)O.visible=R;const U=r>.3;for(const O of Ys)O.visible=U;const v=1-Q(.25,.55,o);Pe.geo.instanceCount=Math.round(Js*v),ze.geo.instanceCount=Math.round(en*v),W0[0].geo.instanceCount=Math.round(is[0]*v),W0[1].geo.instanceCount=Math.round(is[1]*v),K0.geo.instanceCount=Math.round(Xs*Q(.4,.8,o)*(1-.85*Q(.25,.7,s)));const L=Q(.45,.9,s)*(1-.85*Q(.04,.36,r));fo.geo.instanceCount=Math.round(Qs*L),re.geo.instanceCount=Math.round(tn*L);for(const O of Jo)O.far.instanceCount=O.near.instanceCount=Math.round(O.n*L),R||(O.mf.visible=O.mn.visible=!1);return fe(Pt,At,Math.pow(ha,-o)),e>at?fe(Mt,At,Math.pow(ha,1-o)):fe(Mt,ht,Math.pow(H0,-s)),e>G?fe(wt,ht,Math.pow(H0,1-s)):fe(wt,W,Math.pow(m0,-r)),e>G?an($t,W,m0,ht,Math.pow(H0,1-s)):fe($t,W,Math.pow(m0,1-r)),A.uHole.value.z=y?Ua:0,It.uFade.value=1-Q(.86,1,o),t0.uFade.value=1-Q(.7,.86,s),Ut.uFade.value=Q(.15,.4,s),A.uFadeD.value=Ut.uFade.value,{pz:e,e1:o,e2:s,e3:r,cx:R}};fs(0),H.setFinale(zt.crest),H.setEvent(.25,.42),H.setReveal(zt.crest-.03,.09);{const t=[];for(let e=zt.l3a*lt.length;;e+=.25){const o=Math.min(e,lt.length);lt.posAtDist(o,ue);const s=Math.pow(l0((G-ue.z)/_),1.4),r=Math.pow(m0,1-s);if(s>.3&&t.push(W.x+(ue.x-W.x)/r,W.y+(ue.y-W.y)/r,W.z+(ue.z-W.z)/r,2/r,o/lt.length),e>=lt.length)break}await H.geeseAside(t)}const us=ve.forkAt,rn=new m.Vector3(x.x,0,x.z).normalize(),cn=new m.Vector3,yo=new m.Vector3,ds=new m.Vector3,ps=new m.Vector3,b0=I.portalSeat.position.clone(),ln=new m.Vector3(b0.x-215,b0.y-78,b0.z+110);H.setNear((Lt.root+Lt.fork)*.5+.012);const hn=[{at:()=>Sa,from:z0(mt-112),to:z0(mt-190),weight:.36},{at:()=>Ra,from:zt.l1b-.012*Wt,to:zt.l1b+.055*Wt,weight:.45},{at:()=>oe,from:E0(.27),to:E0(.345),weight:.6},{at:(t,e)=>{const o=Q(zt.l3a-.03*Wt,zt.l3a+.008*Wt,e),s=lt.pointAt(Y(e,0,1),Ge).y;return lt.pointAt(Y(e+J(.023,.025,o)*Wt,0,1),Ge),Ge.x+=J(8.6,6.5,o),Ge.y=s-J(5.2,7.5,o),Ge},from:zt.l2b+.016*Wt,to:go+.014,weight:.7,fade:.2},{at:I.saddle.clone().add(new m.Vector3(0,-22,0)),from:zt.l3a+.022*Wt,to:zt.crest-.035*Wt,weight:.5},{at:new m.Vector3(us[0],0,us[1]),from:zt.l3a+.005,to:Lt.root-.01,weight:.82,fade:.2},{at:b0,from:zt.crest+.035,to:zt.crest+.135,weight:.24,fade:.35},{at:(t,e)=>(lt.pointAt(Y(e+42/lt.length,0,1),yo),yo.x-=5*Q(Lt.fork-.03,Lt.fork-.06,e),yo.y=1.5,yo),from:Lt.root-.03,to:Lt.fork+.012,weight:.6,fade:.3},{at:(t,e)=>lt.pointAt(Y(e,0,1),cn).addScaledVector(rn,420).setY(8),from:Lt.fork-.012,to:Lt.turn+.015,weight:.45,fade:.3},{at:(t,e)=>{const o=lt.pointAt(Y(e,0,1),ds).distanceTo(b0);return ds.copy(b0).setY(b0.y-Y(.42*o,5,130))},from:Lt.turn+.012,to:.85,weight:.74,fade:.22},{at:ln,from:.82,to:.912,weight:.7,fade:.3},{at:(t,e)=>{const o=lt.pointAt(Y(e,0,1),ps).distanceTo(b0);return ps.copy(b0).setY(b0.y-Y(.2*o,3,60))},from:.885,to:.99,weight:.78,fade:.25}],ca=(t,e,o,s)=>Q(e-s,e+s,t)*(1-Q(o-s,o+s,t)),fn=t=>{const e=.62+.2*(ca(t,zt.l1a,zt.l1b,.012)+ca(t,zt.l2a,zt.l2b,.012)+ca(t,zt.l3a,zt.l3b-.01,.012)),o=Q(zt.crest-.012,zt.crest+.012,t),s=Q(Lt.root-.06,Lt.root-.02,t);return J(J(e,.55,o),1.1-.1*Q(.9,.97,t),s)},un=(t,e,o,s)=>{s=Y(s??0,0,1),o.getWorldPosition(bo);const{pz:r,e1:l,e2:u,e3:y,cx:c}=fs(s);for(const[v,L]of sn)v.visible&&v.worldToLocal(L.uCamL.value.copy(bo));if(c&&wt.visible){const v=Ut.uCamL.value;for(const L of Jo){const O=Math.hypot(L.x-v.x,L.z-v.z),E=O<17;L.mn.visible=E,L.mf.visible=!E&&O<150}}H.setProgress(s),H.update(t,e,o),D.update(t,e,o),Be.position.copy(bo),Ce.uOp.value=1-Q(.15,.6,u),Ce.uB.value=Q(.3,.95,l),Be.visible=Ce.uOp.value>.004;const R=d.fog;r>at?(R.color.copy(p).lerp(ls,Q(.6,1,l)),R.density=C0[0]*Math.pow(C0[1]/C0[0],l)):r>G?(R.color.copy(ls).lerp(ra,Q(0,.3,u)),R.density=C0[1]*Math.pow(C0[2]/C0[1],u)):(R.color.copy(ra).lerp(b,y),R.density=C0[2]*Math.pow(C0[3]/C0[2],y)),Ce.uFogC.value.copy(R.color),a.renderer.getDrawingBufferSize(ia);const U=ia.y*.5*Math.abs(o.projectionMatrix.elements[5]);for(const v of ma)v.spr.x=U,v.spr.y=v.maxFrac*ia.y;if(Pt.visible){pa.value=(nn-r)/22,Aa(Y(hs-19.5+.35*(r-hs),d0+6,Qt-6),e);const v=e*.11%1,L=v*v*(3-2*v),O=we[0],E=we[1],$=U0.iPos;$[4]=J(O[0],E[0],L),$[5]=J(O[1],E[1],L)+2.6,$[6]=J(O[2],E[2],L),$[7]=1.15*Math.min(1,v*12,(1-v)*8),U0.aP.needsUpdate=!0}Mt.visible&&l>.45&&(Ds(r,e),Ts(s,e)),wt.visible&&u>.45&&(Us(s,e),ea.update(t,e,o,s),ea.uniforms.uTravel.value=on+(s-go)*lt.length*.06,Ja.uniforms.uNearT.value=(s-go)*lt.length*.06),$t.visible&&_s(s,e),na&&$t.visible&&na(s,e,o,bo)};return{scene:d,path:lt,duration:50,pace:fn,camera:{fov:62,near:.5,far:9e3,lookAhead:36,bank:.14},pois:hn,portal:{shape:"circle",radius:I.portalSeat.radius,color:f.portal,glow:1,tilt:!0,revealDistance:300},post:{exposure:f.exposure,bloom:{strength:P?.5:.3,radius:.6,threshold:.92},grade:{saturation:1.06,contrast:1.05,tint:"#fffaf3",shadowTint:P?"#050916":"#0b0d16",vignette:.3,grain:.02}},ride:"none",update:un,dispose(){D.dispose(),H.dispose(),Ro.dispose(),Qe.dispose()}}}};export{a1 as default};
