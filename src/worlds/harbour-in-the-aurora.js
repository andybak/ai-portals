import*as c from"three";import{makePath as Yo,clamp as He,lerp as Xo,smoothstep as te}from"../kit/core.js";import*as co from"../kit/water.js";import{buildHero as Uo}from"../parts/harbour-in-the-aurora.js";const Z=-430,V=-530,xe=-130,Pt=13.5,Qo=3.5,Jo=Pt+Qo,uo=[2.5,8],$o=5,Gt=62,Ce=35,D=f=>new c.Color(f),ea=`
uniform vec3 uSunDir, uNZen, uNHor, uNGround, uDZen, uDMid, uDHor, uDGround, uSunCol, uAurA, uAurB, uAurV, uDusk1, uDusk2, uDusk3, uHazeD;
uniform float uTime, uAurK, uViolet, uGapX;
uniform vec4 uFold;
const float ZC = -430.;
// the thin place's size on the plane (m): half its width and half its height at half strength, and its middle's height
const vec2 WIN = vec2(130.,75.);
const float WINY = 70.;
// THE SEA WIND that the day's clouds, the spindrift and the city's palms go by. WDIR is its direction on plan (x, z),
// the direction the palms lean in (the part's wind, 0.85, 0.5); WIND is its speed in metres a second, the speed the
// spindrift runs at over the ice.
const vec2 WDIR = vec2(.862,.507);
const float WIND = 9.;
const float RIM = 3400.;     // the cloud banks stand over the rim of the sea (the sea's own radius, m)
const float HIGH = 6000.;    // the thin high cloud's height (m)
float h11(float p){ p=fract(p*.1031); p*=p+33.33; p*=p+p; return fract(p); }
float h31(vec3 p){ p=fract(p*.1031); p+=dot(p,p.zyx+31.32); return fract((p.x+p.y)*p.z); }
float vn1(float x){ float i=floor(x), f=fract(x); f=f*f*(3.-2.*f); return mix(h11(i),h11(i+1.),f); }
float h21(vec2 p){ vec3 p3=fract(vec3(p.xyx)*.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
vec2 h22(vec2 p){ vec3 p3=fract(vec3(p.xyx)*vec3(.1031,.1030,.0973)); p3+=dot(p3,p3.yzx+33.33); return fract((p3.xx+p3.yz)*p3.zy); }
float vn2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x), mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x), f.y); }
// the fine upright rays of a curtain (x in metres along it) and the broad lit stretches they stand in
float raysFine(float x, float t){
  float b=vn1(x*.105-t*.33+17.), c=vn1(x*.36+t*.6+41.), e=vn1(x*1.07-t*1.3+5.);
  return (.35+.65*b)*(.4+.6*c)*(.7+.3*e);
}
float raysEnv(float x, float t){ return smoothstep(.22,.8,vn1(x*.019+t*.06)); }
float rays(float x, float t){ float env=raysEnv(x,t); return raysFine(x,t)*(.05+1.5*env*env); }
// THE THIN PLACE IS THE CURTAIN GROWN THIN, a thing of the curtain: functions of the point p = (x, y) on the plane
// z = ZC and of the clock's breath, of nothing else. No eye is in them. windowR is the point's measure from the foot
// of the gap's middle, in outlines: 1 on the design's outline (260 m wide at the ice and 150 m high, its middle 70 m
// up, over the middle of the great ridge's gap on this seed), 3 where the curtain is whole again, as far beyond the
// outline as the thin place is wide.
float windowR(vec2 p){
  float br=1.+.035*sin(uTime*.21+uFold.z);
  return length(vec2(p.x-uGapX,p.y-(WINY-WIN.y))/(vec2(WIN.x,2.*WIN.y)*br));
}
// the day's share behind the curtain's light at p (1 the day, 0 the night): whole within half the outline (the gap's
// floor and the sea beyond are seen there), half on the outline, and from there less and less over a long way, to
// nothing at three outlines. One smooth fall, with no streak, tooth or period in it: the night lies behind the rays
// and never in stripes over the day, and no line can be traced round it.
float windowAt(vec2 p){
  float r=windowR(p), q=max(2.*r-1.,0.);
  return (1.-smoothstep(1.,3.,r))/(1.+q*q);
}
// THE NIGHT SEEN FROM THE DAY is the curtain's far face (1 night, 0 day), one function of direction for every eye. The
// curtain stands along the east-west plane south of the day, so its wall is whole due south and its top sinks with the
// bearing as a straight wall's top does, by the cosine of the bearing from due south, to nothing at due east and due
// west; north of that the day has its own sky. Its height is not a wall's: it is one height in the sky for every eye
// on the day side, as the design gives the day side. Its arms come out of the day's far haze as that haze thins toward
// the south (the haze's own bearing law, below). The wall melts into the day by height, its top uneven by direction.
float ringN(vec3 d){
  float hl=max(length(d.xz),1e-4);
  float el=d.y/hl;
  vec2 h=d.xz/hl;
  float fr=vn2(h*2.6+uFold.xy*.13)*.55+vn2(h*9.+uFold.zw*.13+vec2(uTime*.012,0.))*.45;
  float top=(.57+.3*(fr-.5))*max(h.y,0.);
  return smoothstep(-.1,.3,h.y)*(1.-smoothstep(top*.3,top+1e-4,el));
}
// the point (x, y) at which the view ray from the eye along d meets the curtain plane
vec2 planeAt(vec3 d){
  float den=abs(d.z)>1e-4 ? d.z : (d.z<0. ? -1e-4 : 1e-4);
  return cameraPosition.xy+d.xy*((ZC-cameraPosition.z)/den);
}
float starLayer(vec3 d, float sc, float dens, float rad){
  vec3 q=d*sc, i=floor(q), f=fract(q)-.5;
  float h=h31(i);
  vec3 o=vec3(h31(i+11.3),h31(i+23.7),h31(i+37.1))-.5;
  float r=length(f-o*.5);
  float tw=.72+.28*sin(uTime*(1.2+5.*h)+h*40.);
  return step(1.-dens,h)*(1.-smoothstep(rad*.25,rad,r))*tw*(.35+.65*h31(i+3.1));
}
// one far curtain of the night: an upright sheet over the line dot(p.xz, n) = c, lower border y0, height hh
vec3 farCurtain(vec3 d, vec2 n, float c, float y0, float hh, float sd){
  float dn=dot(d.xz,n), en=dot(cameraPosition.xz,n);
  float den=abs(dn)>1e-3 ? dn : 1e-3;
  vec2 tn=vec2(-n.y,n.x);
  float t=(c-en)/den;
  float s=dot(cameraPosition.xz+d.xz*t,tn);
  float off=170.*sin(s*.0023+sd+uTime*.03)+60.*sin(s*.0067+sd*2.3-uTime*.05);
  t=(c+off-en)/den;
  vec3 P=cameraPosition+d*t;
  s=dot(P.xz,tn);
  float yb=y0+70.*vn1(s*.0035+sd);
  float v=(P.y-yb)/hh;
  // the lit stretches of a far curtain surge along it (about 110 m a second), dimmer between them and never dark: the
  // ring of night round the day is plainly alive, and no bundle of rays stands alone before dark sky
  float xr=s*.3+sd*97., ev=smoothstep(.22,.8,vn1(xr*.019+uTime*.6+sd));
  float ry=raysFine(xr,uTime)*(.14+1.4*ev*ev);
  float prof=smoothstep(0.,.03,v)*exp(-max(v,0.)*(3.4-2.4*min(ry,1.)));
  vec3 col=mix(uAurA,uAurB,smoothstep(0.,.3,v));
  col=mix(col,uAurV,smoothstep(.22,.85,v)*uViolet);
  float fold=clamp(.3/max(abs(dn)/max(length(d.xz),1e-3),.1),1.,2.6);
  return col*prof*ry*fold*step(1.,t)*(1.-smoothstep(3000.,7000.,t));
}
vec3 nightSky(vec3 d){
  float e=d.y;
  vec3 c=mix(uNHor,uNZen,pow(clamp(e,0.,1.),.5));
  c+=uAurA*.07*exp(-max(e,0.)*7.)*uAurK;
  float up=smoothstep(-.01,.05,e);
  c+=vec3(.86,.93,1.)*(starLayer(d,150.,.1,.2)*1.8+starLayer(d,280.,.17,.3)*.8)*up;
  vec3 a=farCurtain(d,vec2(0.,1.),900.,250.,700.,uFold.x)+farCurtain(d,vec2(0.,1.),2600.,300.,900.,uFold.y+3.)
    +farCurtain(d,vec2(.944,.33),1500.,240.,650.,uFold.z+7.)+farCurtain(d,vec2(-.97,.243),1900.,280.,800.,uFold.w+11.)
    +farCurtain(d,vec2(0.,-1.),2900.,90.,620.,uFold.x+17.);
  c+=a*uAurK*.8*up;
  return mix(c,uNGround,1.-smoothstep(-.03,0.,e));
}
// a cloud bank's body: noise by the direction's x and by its z, each with the height above the horizon
float cloudBody(vec2 hb, float e, float sc, float o){
  return .5*(vn2(vec2(hb.x*2.6,e*17.)*sc+o)+vn2(vec2(hb.y*2.6,e*17.)*sc+o+vec2(4.7,2.3)));
}
vec3 daySky(vec3 d){
  float e=d.y;
  vec3 c=mix(uDHor,uDMid,smoothstep(0.,.13,e));
  c=mix(c,uDZen,smoothstep(.06,.75,e));
  float sd=max(dot(d,uSunDir),0.);
  vec2 hd=d.xz/max(length(d.xz),1e-4), hs=uSunDir.xz/max(length(uSunDir.xz),1e-4);
  float toSun=dot(hd,hs);
  c+=uSunCol*vec3(1.,.66,.36)*.42*pow(max(toSun,0.),3.)*exp(-max(e,0.)*4.);
  // cloud banks low on the horizon, lit from the west. They are carried by the sea wind: a bank that stands RIM metres
  // off on the bearing az moves along the horizon by the wind's share across the line of sight, WIND / RIM radians a
  // second at most (0.15 degrees), nothing toward up wind and down wind; the same rate at every clock, body and all
  float az=(abs(d.x)+abs(d.z))>1e-5 ? atan(d.x,-d.z) : 0.;
  float azb=az-uTime*(WIND/RIM)*(WDIR.x*cos(az)+WDIR.y*sin(az));
  // the drifted bearing as a direction on plan: the banks' noise is read at its own x and z, so it is whole round the horizon
  vec2 hb=vec2(sin(azb),-cos(azb));
  float bank=vn2(hb*1.7+vec2(uFold.y,.3))*.6+vn2(hb*4.3+vec2(uFold.x,1.7))*.4;
  float body=cloudBody(hb,e,1.,0.)*.55+cloudBody(hb,e,2.3,5.)*.3+cloudBody(hb,e,5.1,9.)*.15;
  float e2=e-.15-.07*bank;
  float topE=.05+.16*bank*bank;
  float cl=(1.-smoothstep(topE*.35,topE,e2+(body-.5)*.07))*smoothstep(-.03,.03,e2+(body-.5)*.06)*smoothstep(.4,.7,bank+(body-.5)*.5);
  vec3 lit=mix(vec3(.6,.52,.66),vec3(1.,.84,.6),smoothstep(-.5,.7,toSun))*(.74+.5*body)*(.8+.5*smoothstep(0.,topE,e2));
  c=mix(c,lit,cl*.92);
  // thin high cloud: a level sheet HIGH metres up, carried by the same wind (WIND / HIGH of its own measure a second)
  vec2 cp=(d.xz/(max(e,0.)+.12)-WDIR*(uTime*WIND/HIGH))*1.4+vec2(0.,uFold.x);
  float ci=vn2(vec2(cp.x*.55+cp.y*.2,cp.y*1.9))*.6+vn2(vec2(cp.x*1.4,cp.y*5.2)+7.)*.4;
  c=mix(c,vec3(1.,.96,.9),smoothstep(.55,.88,ci)*.3*smoothstep(.04,.22,e));
  c+=uSunCol*(.25*pow(sd,6.)+.8*pow(sd,70.)+5.*smoothstep(.9993,.9998,sd));
  return mix(c,uDGround,1.-smoothstep(-.035,0.,e));
}
// the wall of night's melt into the day (w: 0 night, 1 day), through dusk colours in between
vec3 skyMix(vec3 night, vec3 day, vec3 d, float w){
  vec3 c=mix(night,day,w);
  vec3 dusk=w<.5 ? mix(uDusk3,uDusk2,w*2.) : mix(uDusk2,uDusk1,w*2.-1.);
  return mix(c,dusk*(1.-.45*clamp(d.y,0.,1.)),4.*w*(1.-w)*.62);
}
// what the eye sees of the sky along d, and the see-through weight T of the curtain plane along d (0 where the ray
// never crosses it); pc is the point (x, y) at which the ray meets the plane (the veil hands in its own point).
// THE ONE LOCK: the side of the plane on which the eye stands chooses the sky, a bare step. From the night side a ray
// that goes north shows, by the thin place's weight at pc, the day side as it is: the day side's own sky along d, the
// very function an eye on the day side sees (the day, the curtain's far face, the far haze), with no colour of the
// thin place's own between the night and it; every other ray is night. From the day side every ray shows that sky,
// and the night side's things show through the plane where that sky is night. Nothing here is sized, thinned or faded
// by the eye's distance from the plane.
vec3 skyAlong(vec3 d, vec2 pc, out float T){
  float dz=cameraPosition.z-ZC;
  float den=abs(d.z)>1e-4 ? d.z : 1e-4;
  float crossed=step(0.,-dz/den)*step(1e-4,abs(d.z));
  float nw=ringN(d);
  // the day side's far haze: at and under the horizon to the north, east and west the sky is the haze its land and sea fade to
  float hl=max(length(d.xz),1e-4);
  float hz=(1.-smoothstep(-.1,.3,d.z/hl))*(1.-smoothstep(0.,.045,d.y/hl));
  vec3 night=nightSky(d);
  vec3 within=mix(skyMix(night,daySky(d),d,1.-nw),uHazeD,hz);
  if(dz>0.){
    T=windowAt(pc)*crossed;
    return mix(night,within,T);
  }
  T=nw*crossed;
  return within;
}
`,ta=`
uniform vec3 uSnowLit, uSnowShade, uIceCore, uWarm, uFogN, uFogD, uLead, uSkin;
// 0 on the night side of the curtain plane, 1 on the day side
float dayAt(vec3 P){ return 1.-smoothstep(ZC-9., ZC+9., P.z); }
vec3 iceLight(vec3 P, vec3 N, vec3 V, float glass){
  float dayK=dayAt(P);
  float up=clamp(N.y*.5+.5,0.,1.);
  float rim=pow(clamp(1.-abs(dot(N,V)),0.,1.),2.);
  // night: the sky's light from above, the great curtain's green from the north, deep blue shade
  float ka=max(dot(N,normalize(vec3(0.,.5,-1.))),0.);
  float kw=max(dot(N,normalize(vec3(-.85,.3,-.2))),0.);
  vec3 night=uSnowShade*(.36+.28*up)+uSnowLit*(pow(up,2.4)*.07+ka*.2+kw*.05)+uAurA*(ka*.12+kw*.08+pow(up,3.)*.03)*uAurK;
  // the day's warm light that comes through the thin place, and the light that comes through a slab from behind
  vec3 tl=vec3(uGapX,14.,ZC-30.)-P;
  float dl=max(length(tl),1.);
  tl/=dl;
  float reach=exp(-dl/150.);
  night+=uWarm*(max(dot(N,tl),0.)*reach*1.1+.12*exp(-dl/85.));
  vec3 core=uSnowShade*(.16+.3*up)+uIceCore*(.012+.03*up+.16*kw+.1*rim*up+(.9*max(dot(-N,tl),0.)+.15)*reach)+uAurA*uAurK*(.06*kw+.03*rim);
  night=mix(night, core, glass*.8);
  // day: the low sun in the west and the blue of the sky
  float kd=max(dot(N,uSunDir),0.);
  vec3 day=uSunCol*kd*.9+vec3(.3,.46,.7)*(.4+.6*up);
  day=mix(day, uIceCore*(.5+.5*kd+.5*rim)+uSunCol*kd*.3, glass*.6);
  return mix(night,day,dayK);
}
vec3 iceFog(vec3 c, vec3 P){
  float dayK=dayAt(P);
  float f=1.-exp(-length(P-cameraPosition)*mix(.0004,.00055,dayK));
  return mix(c,mix(uFogN,uFogD,dayK),f);
}
`,oa=`
uniform float uTime;
attribute vec2 aTint;
varying vec3 vW; varying vec2 vTint; varying vec3 vN0;
void main(){ vec4 w=modelMatrix*vec4(position,1.); w.y+=step(w.z,-467.)*.12*sin(uTime*.9+aTint.y*40.); vW=w.xyz; vTint=aTint; vN0=normal; gl_Position=projectionMatrix*viewMatrix*w; }`,aa=`
//@SKY
varying vec3 vW; varying vec2 vTint;
void main(){
  vec3 fn=cross(dFdx(vW),dFdy(vW));
  vec3 N=dot(fn,fn)>1e-20 ? normalize(fn) : vec3(0.,1.,0.);
  vec3 V=normalize(cameraPosition-vW);
  float n1=vn2(vW.xz*.8+vW.y*.6), n2v=vn2(vec2((vW.x+vW.z*.7)*.35,vW.y*4.2+(vW.x-vW.z)*.22)+vTint.y*9.);
  float shelf=step(1.5,vTint.x), dk=dayAt(vW);
  float snow=smoothstep(.34,.66,N.y+(n1-.5)*.4);
  float g=min(vTint.x,1.)*(1.-snow)*(.55+.6*n1);
  float vein=smoothstep(.44,.5,n2v)*(1.-smoothstep(.5,.56,n2v));
  vec3 c=iceLight(vW,N,V,g)*mix(.64+.56*vTint.y+.25*n1,.7+.22*vTint.y+.2*n1,dk)+uIceCore*g*(vein*.09+.05*smoothstep(.35,.8,n1)*(1.-dk));
  vec3 R=reflect(-V,N);
  float gn=pow(max(dot(R,normalize(vec3(.15,.55,-1.))),0.),14.), gd=pow(max(dot(R,uSunDir),0.),36.);
  c+=(uAurA*gn*.55*uAurK*(1.-dk)+uSunCol*gd*1.2*dk)*(.25+.75*g);
  float pond=smoothstep(.6,.72,vn2(vW.xz*.31+vTint.y*23.))*smoothstep(.96,.995,N.y)*dk*(1.-shelf);
  c=mix(c,vec3(.3,.72,.8)*(.6+.4*n1),pond*.7);
  c=mix(c,(vec3(.2,.6,.68)+uSunCol*.08)*(.75+.35*n1),shelf*dk);
  gl_FragColor=vec4(iceFog(c,vW),1.);
}`,na=`
//@SKY
uniform float uFloe;
varying vec3 vW; varying vec3 vN0;
vec3 floes(vec2 p){
  vec2 i=floor(p), f=fract(p);
  float d1=9., d2=9., id=0.;
  for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){
    vec2 g=vec2(float(x),float(y));
    vec2 r=g+h22(i+g)*.8+.1-f;
    float d=dot(r,r);
    if(d<d1){ d2=d1; d1=d; id=h21(i+g+3.7); } else if(d<d2){ d2=d; }
  }
  return vec3(sqrt(d2)-sqrt(d1),id,sqrt(d1));
}
float dune(vec2 p, float fineK){
  vec2 q=vec2(p.y*.045+p.x*.011,p.x*.016-p.y*.004);
  float sast=1.-abs(2.*vn2(vec2(p.y*.3+p.x*.06,p.x*.055)+11.)-1.);
  return vn2(q)+.5*vn2(q*2.3+7.)+.22*vn2(q*5.6+3.)+.13*sast*sast*fineK;
}
void main(){
  vec2 p=vW.xz;
  float dist=length(vW-cameraPosition);
  float foot=max(fwidth(p.x),fwidth(p.y));
  vec2 pw=p+7.*vec2(vn2(p*.05),vn2(p*.05+13.))+2.4*vec2(vn2(p*.23+3.),vn2(p*.23+31.));
  vec3 fl=floes(pw/uFloe+.3*vec2(vn2(p*.011),vn2(p*.011+9.)));
  float lw=(.005+.022*vn2(p*.007+21.))*smoothstep(.28,.5,vn2(p*.0045+5.));
  float aa=fwidth(fl.x)*1.5+.004;
  float lead=(1.-smoothstep(lw-aa,lw+aa,fl.x))*step(1e-3,lw);
  float rimIce=(1.-smoothstep(lw,lw+.035,fl.x))*step(1e-3,lw);
  float fineK=1.-smoothstep(.6,3.,foot), broadK=1.-smoothstep(4.,16.,foot);
  float e=.6, k=5.*broadK;
  float h0=dune(p,fineK), hx=dune(p+vec2(e,0.),fineK), hz=dune(p+vec2(0.,e),fineK);
  vec3 N=normalize(normalize(vN0)+vec3(-(hx-h0)/e*k,0.,-(hz-h0)/e*k));
  vec3 V=normalize(cameraPosition-vW);
  vec3 c=iceLight(vW,N,V,.1*rimIce)*(.93+.1*fl.y);
  c*=mix(1.,.66+.44*smoothstep(.45,1.25,h0),broadK);
  c*=.92+.16*vn2(p*.9)*fineK;
  c=mix(c,c*1.2+uSnowLit*.05,rimIce*(1.-lead));
  vec2 wa=vec2(dot(p,WDIR),dot(p,vec2(-WDIR.y,WDIR.x)));   // metres along the sea wind and across it
  vec2 sq=vec2((wa.x-uTime*WIND)*.028+wa.y*.004,wa.y*.2+vn2(p*.02)*2.);
  float drift=vn2(sq)*vn2(sq*vec2(2.3,1.7)+vec2(uTime*.4,3.));
  c+=(uSnowLit*.22+uAurA*.04)*smoothstep(.16,.5,drift)*(1.-smoothstep(120.,420.,dist))*(1.-lead);
  float skin=smoothstep(.2,.62,vn2(p*.33)*.6+vn2(p*1.4)*.4);
  vec3 lc=mix(uLead,uSkin,.22+.7*skin)+uAurA*.02*uAurK;
  c=mix(c,lc,lead*.92);
  gl_FragColor=vec4(iceFog(c,vW),1.);
}`,ra=`
varying vec3 vDir;
void main(){ vDir=position; vec4 p=projectionMatrix*vec4(mat3(viewMatrix)*position,1.); if(abs(p.w)<1e-4) p.w=1e-4; gl_Position=p.xyww; }`,sa=`
//@SKY
varying vec3 vDir;
void main(){ vec3 d=normalize(vDir); float T; gl_FragColor=vec4(skyAlong(d,planeAt(d),T),1.); }`,ia=`
varying vec3 vW;
void main(){ vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }`,la=`
//@SKY
varying vec3 vW;
void main(){
  vec3 d=normalize(vW-cameraPosition);
  float T;
  vec3 c=skyAlong(d,vW.xy,T);
  gl_FragColor=vec4(c,1.-T);
}`,ha=`
uniform float uTime; uniform vec4 uSheet; uniform vec2 uWave;
attribute float aBase;
varying vec3 vW; varying float vV;
float h11(float p){ p=fract(p*.1031); p*=p+33.33; p*=p+p; return fract(p); }
float vn1(float x){ float i=floor(x), f=fract(x); f=f*f*(3.-2.*f); return mix(h11(i),h11(i+1.),f); }
void main(){
  float x=position.x, v=position.y;
  float yb=aBase;
  float z=-430.+uSheet.x+uWave.x*sin(x*.0041+uSheet.y+uTime*.09)+uWave.y*sin(x*.0127+uSheet.y*1.7-uTime*.14);
  vW=vec3(x,yb+v*uSheet.w,z); vV=v;
  gl_Position=projectionMatrix*viewMatrix*vec4(vW,1.);
}`,ca=`
//@SKY
uniform vec4 uSheet; uniform float uGain; uniform vec2 uDepth;
varying vec3 vW; varying float vV;
void main(){
  float v=clamp(vV,0.,1.);
  float xx=vW.x+uSheet.y*31.;
  float fine=raysFine(xx,uTime), env=raysEnv(xx,uTime);
  // how much of the curtain's light is left at this sheet's own point (x, y), the same for every eye: at the foot of
  // the gap's middle the floor the far curtains keep between their lit stretches (.14: dimmer, never dark), more by
  // degrees sideways and upward, whole at three outlines. The rays hang across all of the thin place, weakest at
  // the crossing, and the eye flies under their hems (RAYS_OVER m over the line at the least).
  float h=smoothstep(0.,3.,windowR(vW.xy));
  float left=.14+.86*h;
  // the curtain stands in long lit stretches of fine rays with dimmer stretches between. The thin place is its
  // brightest fold: there every stretch is lit, so its rays are the curtain's own fine rays (unlike in width, spacing
  // and height, by the sheets' own noise) standing many together, none alone against the day. By degrees outward the
  // lit stretches and the dimmer ones between them return.
  float big=smoothstep(.34,.72,vn1(vW.x*.0037+uSheet.y*3.+uTime*.004));
  float own=fine*mix(.05+1.5,big*(.05+1.5*env*env),h);
  float ry=own*left;
  float prof=smoothstep(0.,.03,v)*exp(-v*(3.3-2.3*min(own,1.)))*(1.-smoothstep(.8,1.,v));
  vec3 col=mix(uAurA,uAurB,smoothstep(0.,.28,v));
  col=mix(col,uAurV,smoothstep(.2,.85,v)*uViolet);
  // toward the thin place's middle the rays turn from the curtain's colours to pale light
  col=mix(col,vec3(.55,1.,.78),1.-h);
  // the rays are whole for every eye and thin by place: a sheet's strength is its own depth through the curtain, from
  // nothing at the curtain's day face (uDepth.x) to the most at its night face (uDepth.y), one in the mean; an eye that
  // flies through has the stronger rays behind it and the thinner ahead. No eye, gaze or lens is read here.
  float kz=2.*clamp((vW.z-uDepth.x)/(uDepth.y-uDepth.x),0.,1.);
  // light over what lies behind: where a ray is bright it also veils (so that green stays green before the day's sky)
  float I=prof*ry*kz*uAurK*uGain;
  gl_FragColor=vec4(col*I,clamp(I*.6,0.,.62));
}`,gt=f=>f.replace("//@SKY",ea+ta),da=`
uniform float uTime;
attribute vec4 aP; attribute vec3 aL;
varying float vK; varying vec3 vW;
void main(){
  float a=aP.y+uTime*aP.z/aP.x;
  vec3 rt=vec3(cos(a),0.,sin(a)), fw=vec3(-sin(a),0.,cos(a))*sign(aP.z);
  vec3 c=position+rt*aP.x+vec3(0.,.8*sin(uTime*.35+aP.w),0.);
  float th=uTime*(5.+.3*sin(aP.w))+aP.w*7.;
  float flap=smoothstep(-.3,.5,sin(uTime*.45+aP.w*3.));
  float beat=sin(th)*flap, lag=sin(th-.7)*flap;
  float bk=aL.y, cb=cos(bk), ax=abs(aL.x);
  float hw=min(ax,.42)*(.45+.45*beat)+max(ax-.42,0.)*(-.45+.7*lag);
  vec3 w=c+rt*(aL.x*cb)+fw*aL.z+vec3(0.,aL.x*sin(bk)+hw*cb,0.);
  vK=abs(aL.x); vW=w;
  gl_Position=projectionMatrix*viewMatrix*vec4(w,1.);
}`,ua=`
uniform vec3 uSunCol, uSunDir, uFogD;
varying float vK; varying vec3 vW;
void main(){
  vec3 fn=cross(dFdx(vW),dFdy(vW));
  vec3 N=dot(fn,fn)>1e-20 ? normalize(fn) : vec3(0.,1.,0.);
  vec3 V=normalize(cameraPosition-vW);
  if(dot(N,V)<0.) N=-N;
  float upper=smoothstep(-.15,.15,N.y);
  vec3 alb=mix(vec3(.8,.8,.78),vec3(.6,.62,.66),upper);
  alb=mix(alb,vec3(.1,.1,.12),smoothstep(.5,.78,vK));
  vec3 amb=mix(vec3(.2,.19,.17),vec3(.24,.31,.45),N.y*.5+.5);
  vec3 c=alb*(uSunCol*max(dot(N,uSunDir),0.)*.95+amb);
  float fd=length(vW-cameraPosition)*.00055;
  c=mix(c,uFogD,1.-exp(-fd*fd));
  gl_FragColor=vec4(min(c,vec3(.72)),1.);
}`,fa=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]],ga=[[0,3,2,1],[4,5,6,7],[0,1,5,4],[2,3,7,6],[1,2,6,5],[0,4,7,3]];function Rt(){const f=[],z=[],K=[],O=new c.Vector3,p=new c.Matrix4,x=new c.Quaternion,G=new c.Euler,C=new c.Vector3,I=new c.Vector3,T={pos:f,boxes:0,box(W,F,M,v,k,A,E,R,b,_,oe,vt=1,ae=.5){G.set(R,E,b,"YXZ"),x.setFromEuler(G),C.set(W,F,M),I.set(v,k,A),p.compose(C,x,I);const X=f.length/3;for(let L=0;L<8;L++){const ne=fa[L],Ie=ne[1]>0?vt:1,be=mt=>{const Ee=Math.sin((oe*91.7+L*7.13+mt*3.31)*43.37)*4375.85;return Ee-Math.floor(Ee)-.5};O.set(ne[0]*Ie*(1+ae*be(1)),ne[1]*(1+ae*.6*be(2)),ne[2]*Ie*(1+ae*be(3))).applyMatrix4(p),f.push(O.x,O.y,O.z),z.push(_,oe)}for(const L of ga)K.push(X+L[0],X+L[1],X+L[2],X+L[0],X+L[2],X+L[3]);return T.boxes++,X},geometry(){const W=new c.BufferGeometry;return W.setAttribute("position",new c.Float32BufferAttribute(f,3)),W.setAttribute("aTint",new c.Float32BufferAttribute(z,2)),W.setIndex(K),W.computeBoundingSphere(),W}};return T}function Bt(f,z,K,O){const p=f.length,x=z.length,G=new Float32Array(p*x*3),C=new Float32Array(p*x*3),I=new Float32Array(p*x*2),T=[];for(let F=0;F<x;F++)for(let M=0;M<p;M++){const v=F*p+M,k=f[M],A=z[F],E=K(k,A);G[v*3]=k,G[v*3+1]=E,G[v*3+2]=A;const R=O?O(k,A,E):[0,.5];I[v*2]=R[0],I[v*2+1]=R[1]}for(let F=0;F<x;F++)for(let M=0;M<p;M++){const v=F*p+M,k=Math.max(0,M-1),A=Math.min(p-1,M+1),E=Math.max(0,F-1),R=Math.min(x-1,F+1),b=(G[(F*p+A)*3+1]-G[(F*p+k)*3+1])/(f[A]-f[k]),_=(G[(R*p+M)*3+1]-G[(E*p+M)*3+1])/(z[R]-z[E]),oe=Math.hypot(b,1,_);C[v*3]=-b/oe,C[v*3+1]=1/oe,C[v*3+2]=-_/oe}for(let F=0;F<x-1;F++)for(let M=0;M<p-1;M++){const v=F*p+M,k=v+1,A=v+p,E=A+1;T.push(v,A,k,k,A,E)}const W=new c.BufferGeometry;return W.setAttribute("position",new c.BufferAttribute(G,3)),W.setAttribute("normal",new c.BufferAttribute(C,3)),W.setAttribute("aTint",new c.BufferAttribute(I,2)),W.setIndex(T),W.computeBoundingSphere(),W}const ce=(f,z,K)=>{const O=[],p=Math.max(1,Math.round((z-f)/K));for(let x=0;x<=p;x++)O.push(f+(z-f)*x/p);return O};var ya={id:"harbour-in-the-aurora",name:"A Harbour in the Aurora",category:"books",placeKind:"ocean",book:"His Dark Materials",author:"Philip Pullman, born 1946",media:["air"],weirdness:.7,async build(f){const{noise:z}=f,K=f.vary||{},O=f.quality?.detail??1,p=e=>f.core.makeRng(f.core.hashSeed("harbour-aurora/"+e+":"+f.seed)),x=p("look"),G=p("route"),C=p("ridges"),I=p("great-ridge"),T=p("bits"),W=p("floes"),F=p("sea"),M=p("far"),v=p("wayside"),k=p("walls"),A=p("field"),E=p("gulls"),R=p("tower-flocks"),b=p("line-parties"),_=p("basin-flock"),oe={day:20,golden:16,dawn:17,night:16}[K.hour],vt=x.range(16,20),ae=(oe??vt)*Math.PI/180,X=18*Math.PI/180,L=new c.Vector3(-Math.cos(ae)*Math.cos(X),Math.sin(ae),Math.cos(ae)*Math.sin(X)),ne=x.range(0,.65),Ie=x.range(0,1),be=x.range(.55,1),mt=x(),Ee=.92+.4*(K.mood??mt),fo=new c.Vector4(x.range(0,60),x.range(0,60),x.range(0,6.28),x.range(0,60)),Me=D("#b0849e"),Ht=D("#17344e"),Ve={uTime:{value:0},uSunDir:{value:L},uAurK:{value:Ee},uViolet:{value:be},uFold:{value:fo},uNZen:{value:D("#050b1c")},uNHor:{value:D("#0e2233")},uNGround:{value:Ht},uDZen:{value:D("#2a66c2")},uDMid:{value:D("#79b0e6")},uDHor:{value:D("#edc6a6")},uDGround:{value:Me},uHazeD:{value:Me},uSunCol:{value:D("#ffd9a0")},uAurA:{value:D("#4dffa0").lerp(D("#2fe3c0"),ne)},uAurB:{value:D("#2fe3c0").lerp(D("#36c4ee"),ne)},uAurV:{value:D("#c05cff").lerp(D("#ff5f8a"),Ie*.7)},uDusk1:{value:D("#ff9a6a")},uDusk2:{value:D("#b06aa8")},uDusk3:{value:D("#3a3f7a")},uSnowLit:{value:D("#cfe6f2")},uSnowShade:{value:D("#3d5f8a")},uIceCore:{value:D("#49c7d8")},uWarm:{value:D("#ffd9a0")},uFogN:{value:Ht},uFogD:{value:Me},uLead:{value:D("#06131f")},uSkin:{value:D("#62798a")},uFloe:{value:x.range(54,76)},uGapX:{value:0}},j=new c.Scene;j.fog=new c.FogExp2(Me.clone(),55e-5);const Q=new c.DirectionalLight("#ffcf8f",3.3);Q.castShadow=!0,Q.shadow.mapSize.set(2048,2048);const de=210,ue=Q.shadow.camera;ue.left=-de,ue.right=de,ue.top=de,ue.bottom=-de,ue.near=1,ue.far=1200,ue.updateProjectionMatrix(),Q.shadow.bias=-4e-4,Q.shadow.normalBias=de*2/2048*2.5;const go=new c.HemisphereLight("#9dbcf0","#b3906e",.86),Vt=new c.DirectionalLight("#c9d6ff",.4);Vt.position.set(.6,.45,-.65).multiplyScalar(400),j.add(Q,Q.target,go,Vt);const vo=[],Ke=e=>{const t=new c.ShaderMaterial({uniforms:Ve,...e});return vo.push(t),t},pt=new c.Mesh(new c.BoxGeometry(2,2,2),Ke({vertexShader:ra,fragmentShader:gt(sa),side:c.BackSide,depthTest:!1,depthWrite:!1}));pt.frustumCulled=!1,pt.renderOrder=-1e3,j.add(pt);const _e=new c.Mesh(new c.PlaneGeometry(7e3,1100),Ke({vertexShader:ia,fragmentShader:gt(la),side:c.DoubleSide,transparent:!0,depthWrite:!1}));_e.position.set(0,450,Z),_e.frustumCulled=!1,_e.renderOrder=20,j.add(_e);const qe=[46,27,9,-9,-26,-44],yt=qe.map(()=>[x.range(0,40),x.range(uo[0],uo[1]),x.range(300,430)]),ke=[20,8],mo=Z+Math.min(...qe)-ke[0]-ke[1],po=Z+Math.max(...qe)+ke[0]+ke[1],yo=qe.map((e,t)=>{const o={...Ve,uSheet:{value:new c.Vector4(e,yt[t][0],0,yt[t][2])},uGain:{value:.42},uWave:{value:new c.Vector2(ke[0],ke[1])},uDepth:{value:new c.Vector2(mo,po)}},a=new c.ShaderMaterial({uniforms:o,vertexShader:ha,fragmentShader:gt(ca),side:c.DoubleSide,transparent:!0,depthWrite:!1,blending:c.CustomBlending,blendEquation:c.AddEquation,blendSrc:c.OneFactor,blendDst:c.OneMinusSrcAlphaFactor}),n=new c.Mesh(new c.BufferGeometry,a);return n.frustumCulled=!1,n.renderOrder=21+t,j.add(n),n});await f.yield();const wo=co.waterLight("noon",{sunDir:L,sunColor:"#ffd9a0",sunIntensity:3,zenith:"#2a66c2",mid:"#79b0e6",horizon:"#edc6a6",fogColor:Me}),Kt=co.makeOcean({rng:F,light:wo,preset:"calm",height:.22,radius:3400,rings:80,segments:104,deep:"#0d6f8f",scatter:"#1fa3a8",shallowColor:"#3fd6c2",horizonColor:Me,windAngle:2.2,reflectivity:.85,glitter:1.7});j.add(Kt.object),await f.yield();const U=await Uo(f,{sun:L.clone(),seedKey:f.seed});U.object.position.set(0,0,V),j.add(U.object),U.object.traverse(e=>{const t=e.material&&e.material.userData&&e.material.userData.wind;t&&t.set&&t.set({speed:1.5})});const H=U.anchors,_t=new c.PointLight("#c8ffe6",900,130,2);_t.position.set(H.ring[0],H.ring[1],H.ring[2]+V),j.add(_t),await f.yield();const fe=H.corridor.map(e=>[e[0],e[1],e[2]+V]),xo=G.range(.88,1.08),ze=G.range(-6,6),re=17,se=e=>re+(e-re)*xo,qt=se(74),Ze=e=>fe[0][0]+(qt-fe[0][0])*(e-fe[0][2])/(-371.4-fe[0][2]),J=Ze(Z);Ve.uGapX.value=J;const Ae=Yo([[re,9,xe],[re,9,xe-Gt/2],[re,9,xe-Gt],[se(18.4),8.8,-211],[se(24.3),8.6,-228],[se(48.5),8.4,-266+ze*.5],[se(71),8.6,-305+ze],[se(79),8.9,-323+ze],[se(80.7),9.3,-341+ze],[se(77.6),10,-359+ze*.5],[qt,10.8,-371.4],[Ze(-400),12.4,-400],[J,Pt,Z],[Ze(-470),11.6,-470],[Ze(-503),10.8,-503],[fe[0][0],11,fe[0][2]],...fe.slice(1)]),$=Math.ceil(Ae.length),u=new Float32Array(($+1)*3),Oe=new c.Vector3;for(let e=0;e<=$;e++)Ae.posAtDist(Math.min(e,Ae.length),Oe),u[e*3]=Oe.x,u[e*3+1]=Oe.y,u[e*3+2]=Oe.z;const Zt=(e,t,o,a=60)=>{let n=1e9;for(let r=0;r<=$;r++){const s=u[r*3+2]-o;if(s>a||s<-a)continue;const i=u[r*3]-e,l=u[r*3+1]-t,d=i*i+l*l+s*s;d<n&&(n=d)}return Math.sqrt(n)},ie=e=>{for(let t=0;t<=$;t++)if(u[t*3+2]<=e)return t;return $},bo=e=>u[ie(e)*3],wt=[-168,-252,-334].map(e=>e+G.range(-7,7)),je=wt.map(e=>bo(e)),xt=2.6,Mo=(e,t)=>.5+.5*z.fbm2(e*.021+3.1,t*.0075-1.7,3),Ot=(e,t)=>wt[e]+13*z.n2(t*.0065,e*7.3+1.2),jt=(e,t)=>(.9+2.7*Math.max(0,.55+.45*z.n2(t*.021+e*31.7,4.4)))*te(30,62,Math.abs(t-je[e])),ko=(e,t)=>{let o=0;for(let a=0;a<3;a++){const n=(t-Ot(a,e))/6.5;Math.abs(n)<3&&(o=Math.max(o,jt(a,e)*Math.exp(-n*n)))}return o},ge=(e,t)=>.55+1.1*Mo(e,t)+.55*ko(e,t),Ye=e=>Xo(4,25+5.5*z.n2(e*.0043,9.9),te(44,64,Math.abs(e-J))),bt=(e,t)=>{const o=(t-Z)/Ce;if(Math.abs(o)>=1)return-3;const a=Math.pow(1-o*o,.75),n=-3+(Ye(e)+3)*a*(.86+.14*z.n2(e*.03,t*.03))+1.6*z.n2(e*.09,t*.09)*a;return Math.max(n,-3+(Pt+xt+3)*a*te(44,64,Math.abs(e-J)))};yo.forEach((e,t)=>{const o=new c.PlaneGeometry(3400,1,220,1);o.translate(0,.5,0);const a=o.attributes.position,n=new Float32Array(a.count);for(let r=0;r<a.count;r++){const s=a.getX(r);n[r]=Math.max(Ye(s),Jo)+yt[t][1]+$o*(.5+.5*z.n2(s*.011,t*3.3+20))}o.setAttribute("aBase",new c.BufferAttribute(n,1)),e.geometry=o});const Yt=e=>Ke({vertexShader:oa,fragmentShader:gt(e)}),Le=Yt(aa),zo=Yt(na),Se=(e,t,o)=>{const a=new c.Mesh(e,t);return a.name=o,a.frustumCulled=!1,j.add(a),a},Ao=[-5200,-3200,-1900,-1100,-700,-480,-360,...ce(-238,322,7),360,480,700,1100,1900,3200,5200],So=[...ce(-446,-61,7),-20,60,200,400,700,1200,2200,3600,5200];Se(Bt(Ao,So,ge),zo,"ice-plain"),await f.yield();const Do=[...ce(-4600,-520,80),...ce(-455,455,7),...ce(520,4600,80)];Se(Bt(Do,ce(Z-Ce,Z+Ce,5),bt,(e,t)=>[.35+.3*z.n2(e*.05,t*.05),.5+.5*z.n2(e*.2,t*.2)]),Le,"great-ridge"),await f.yield();const ee=ie(-222),De=ie(-340+ze),ve=7.5;let Xe=1e9,Ue=-1e9,Qe=1e9,Je=-1e9;for(let e=ee;e<=De;e++)Xe=Math.min(Xe,u[e*3]),Ue=Math.max(Ue,u[e*3]),Qe=Math.min(Qe,u[e*3+2]),Je=Math.max(Je,u[e*3+2]);const Wo=(e,t)=>{let o=1e18,a=ee;for(let i=ee-10;i<=De+10;i++){const l=e-u[i*3],d=t-u[i*3+2],h=l*l+d*d;h<o&&(o=h,a=i)}const n=u[(a+1)*3]-u[(a-1)*3],r=u[(a+1)*3+2]-u[(a-1)*3+2],s=Math.hypot(n,r)||1;return[((e-u[a*3])*-r+(t-u[a*3+2])*n)/s,a]},Mt=(e,t)=>{if(e<Xe-40||e>Ue+40||t<Qe-40||t>Je+40)return 0;const[o,a]=Wo(e,t),n=Math.abs(o);if(n<=ve||n>=ve+30)return 0;const r=te(ee,ee+22,a)*(1-te(De-22,De,a));return(o<0?15.5:9.5)*r*(.72+.28*z.n2(a*.06+(o<0?3:40),5.5))*te(ve,ve+5.5,n)*(1-te(ve+9,ve+30,n))*(.85+.15*z.n2(e*.12,t*.12))},We=(e,t)=>ge(e,t)+Mt(e,t);Se(Bt(ce(Xe-42,Ue+42,3),ce(Qe-42,Je+42,3),(e,t)=>{const o=Mt(e,t);return o>.02?ge(e,t)+o:ge(e,t)-.8},(e,t)=>[.3+.45*(.5+.5*z.n2(e*.07,t*.07)),.5+.5*z.n2(e*.2,t*.2)]),Le,"lane-walls"),await f.yield();const Te={kept:{},least:{}},kt=new Map,Xt=7,To=(e,t,o,a,n)=>{const r=Math.floor(e/Xt),s=Math.floor(o/Xt);for(let i=r-2;i<=r+2;i++)for(let l=s-2;l<=s+2;l++){const d=kt.get(i*4096+l);if(d)for(let h=0;h<d.length;h+=4){const m=d[h]-e,y=d[h+1]-t,w=d[h+2]-o,g=(d[h+3]+a)*.66;if(m*m+y*y+w*w<g*g)return!0}}if(n){const i=r*4096+s;let l=kt.get(i);l||kt.set(i,l=[]),l.push(e,t,o,a)}return!1},B=(e,t,o,a,n,r,s,i,l,d,h,m,y,w,g,S)=>{const N=g??.5,q=Math.hypot(r*(1+N*.5),s*(1+N*.3),i*(1+N*.5)),Y=Zt(o,a,n)-q;return Y<xt+.5||n+q>xe-1&&n-q<xe+62&&Math.abs(o-re)-q<15||!S&&Math.max(r,i)<=12&&To(o,a,n,Math.max(r,i),!0)?!1:(e.box(o,a,n,r,s,i,l,d,h,m,y,w,g),Te.kept[t]=(Te.kept[t]||0)+1,Te.least[t]=Math.min(Te.least[t]??1e9,Y),!0)},$e=(e,t,o,a,n,r,s,i,l,d,h,m,y=We(o,a))=>B(e,t,o,y+Math.abs(Math.sin(l))*s*.6-.15,a,n,r,s,i,l,d,h,m,.62+.38*(m*13.7%1),.7)?(B(e,"bed",o,y+.1,a,n*.9+.7,.42,s*.7+.7,i,0,0,0,m,.5,.35,!0),!0):!1,me=(.8+(He(K.density??1,.7,1.3)-.7)*(.4/.6))*(.6+.4*O),et=M.sign(),tt=J+et*M.range(170,230),ot=M.range(-372,-300),Fe=M.range(22,30),zt=M.range(-.4,.4),At=[M(),M(),M()],Ut=(e,t)=>K.rare&&Math.abs(e-tt)<100&&Math.abs(t-ot)<52,P=Rt();for(let e=0;e<3;e++){const t=Math.round(230*me);for(let o=0;o<t;o++){const a=je[e]+C.gauss()*150,n=C.gauss()*4.2,r=C.range(1.3,4.4),s=C.range(.18,.5),i=C.range(.9,2.8),l=C.range(0,6.283),d=C.range(.2,.8)*C.sign(),h=C.range(-.3,.3),m=C.range(.45,1),y=C(),w=Ot(e,a)+n,g=jt(e,a)/3.6,S=.45+.75*g;Math.abs(a-je[e])>420||g<.08||Ut(a,w)||$e(P,"lesser",a,w,r*S,s,i*S,l,d,h,m,y)}await f.yield()}const Fo=Math.round(200*me);for(let e=0;e<Fo;e++){const t=40+T.gauss()*120,o=T.range(-392,-70),a=T.chance(.16),n=T.range(1.2,3.8),r=T.range(.16,.48),s=T.range(.9,2.8),i=T.range(0,6.283),l=T.range(.2,.8)*T.sign(),d=T.range(-.3,.3),h=T(),m=T.range(.9,2.7),y=T.range(.4,.7),w=T.range(.5,1);if(Ut(t,o))continue;const g=We(t,o);(a?B(P,"bergy",t,g+m*.72,o,n,m,s*1.2,i,d*.5,d*.5,1,h,y,.7)&&(B(P,"bed",t,g+.1,o,n+.9,.45,s*1.2+.9,i,0,0,0,h,.5,.35,!0),!0):$e(P,"upturned",t,o,n,r,s,i,l,d,w,h,g))&&B(P,"drift",t+2.4+n,ge(t+3+n,o)+.1,o,2.6+n*1.3,.5,.8+s*.5,0,0,-.1,0,h,.3,.3,!0)}const No=ie(Z+Ce-1);for(let e=14;e<No;e+=8){const t=v.sign(),o=v.range(6.5,26),a=2+Math.floor(v()*3),n=u[e*3]+t*o,r=u[e*3+2]+v.range(-3,3),s=v();for(let i=0;i<5;i++){const l=v.range(-3.6,3.6),d=v.range(-3.6,3.6),h=v.range(.8,2.8),m=v.range(.14,.42),y=v.range(.7,2.2),w=v.range(0,6.283),g=v.range(.2,.8)*v.sign(),S=v.range(.6,1),N=v();i<a&&$e(P,"wayside",n+l,r+d,h,m,y,w,g,.2,S,N)}B(P,"drift",n+5.5,ge(n+5.5,r)+.1,r,5.5,.5,1.7,0,0,-.1,0,s,.3,.3,!0);for(let i=0;i<6;i++){const l=v.range(-9,9),d=v.range(-9,9),h=v.range(.35,1.1),m=v.range(.1,.3),y=v.range(.3,.9),w=v.range(0,6.283),g=v.range(-.5,.5),S=v.range(.3,1),N=v(),q=n+l,Y=r+d;B(P,"rubble",q,We(q,Y)+m*.3+Math.abs(Math.sin(g))*y*.4,Y,h,m,y,w,g,.15,S,N,.8,.7)}}const Co=Math.round(400*me);for(let e=0;e<Co;e++){const t=ee+k()*(De-ee),o=k.sign(),a=ve+1.5+k()*24,n=k.chance(.22),r=k.range(1.5,4.6),s=k.range(.22,.6),i=k.range(1.3,3.4),l=k.range(0,6.283),d=k.range(.2,.8)*k.sign(),h=k.range(-.3,.3),m=k.range(.5,1),y=k(),w=k.range(1.2,3.2),g=Math.floor(t),S=u[(g+1)*3]-u[(g-1)*3],N=u[(g+1)*3+2]-u[(g-1)*3+2],q=Math.hypot(S,N)||1,Y=u[g*3]+-N/q*o*a,Be=u[g*3+2]+S/q*o*a,ct=We(Y,Be);n?B(P,"wall",Y,ct+w*.6,Be,r*.8,w,i,l,h*.4,h*.4,.9,y,.55,.7):$e(P,"wall",Y,Be,r,s,i,l,d,h,m,y,ct)}await f.yield();const Io=Math.round(190*me);for(let e=0;e<Io;e++){const t=re+A.gauss()*95,o=A.range(-240,-92),a=A.range(2.5,7.5),n=A.range(.22,.38),r=A.range(2,5.5),s=A.range(0,6.283),i=A.range(-.05,.05),l=A.range(-.05,.05),d=A.range(.35,.7),h=A();B(P,"lowfloe",t,We(t,o)+n*.55,o,a,n,r,s,i,l,d,h,.9,.6)}K.rare&&(B(P,"berg",tt,Fe*.42,ot,78,Fe*.6,36,zt,.03,-.04*et,.85,At[0],.8,.35),B(P,"berg",tt-et*52,Fe*.3,ot+22,26,Fe*.42,20,zt+.5,-.06,.05,.9,At[1],.7,.4),B(P,"berg",tt+et*20,Fe*.95,ot-6,30,Fe*.3,18,zt-.2,.05,.02,.8,At[2],.6,.4)),Se(P.geometry(),Le,"ice-slabs"),await f.yield();const St=Rt(),Eo=Math.round(2300*me);for(let e=0;e<Eo;e++){const t=J+I.range(-640,640),o=Z+He(I.gauss()*15,-31,31),a=I.chance(.16),n=I.range(2.2,6.2)*(a?1.5:1),r=I.range(.35,1.05)*(a?1.7:1),s=I.range(1.6,4.4)*(a?1.3:1),i=I.range(0,6.283),l=I.range(.2,.85)*I.sign(),d=I.range(-.4,.4),h=I.range(.5,1),m=I(),y=te(5,20,Ye(t)),w=.42+.58*y,g=l*(.3+.7*y);B(St,"great",t,bt(t,o)+Math.abs(Math.sin(g))*s*w*.6-.3,o,n*w,r*w,s*w,i,g,d*(.3+.7*y),h,m,.62+.38*(m*13.7%1),.7),e%400===399&&await f.yield()}Se(St.geometry(),Le,"great-slabs"),await f.yield();const at=Rt(),Lo=Math.round(300*me);for(let e=0;e<Lo;e++){const t=Math.pow(W(),1.7),o=J+W.gauss()*190,a=W.range(2.5,9)*(1-.4*t),n=W.range(2,7)*(1-.4*t),r=W.range(0,6.283),s=W(),i=Z-38-t*46;B(at,"floe",o,.2,i,a,.55,n,r,0,0,.75,s,.93,.5)&&B(at,"shelf",o,-.03,i,a+1.5,.1,n+1.5,r,0,0,2,s,1,.5,!0)}Se(at.geometry(),Le,"day-floes"),await f.yield();const Dt=[],Qt=[],Jt=[],$t=[],eo=[[0,0,.33],[-.07,0,.04],[.07,0,.04],[-.07,0,.04],[0,0,-.3],[.07,0,.04]];for(const e of[-1,1])eo.push([.04*e,0,.2],[.04*e,0,-.17],[.42*e,0,.17],[.04*e,0,-.17],[.42*e,0,-.1],[.42*e,0,.17],[.42*e,0,.17],[.42*e,0,-.1],[.8*e,0,-.13]);const Pe=(e,t,o,a,n,r,s)=>{Dt.push({x:e,y:t,z:o,r:a});const i=Math.min(Math.atan(r*r/(9.8*a)),.6);for(const l of eo)Qt.push(e,t,o),Jt.push(a,n,r,s),$t.push(l[0],i,l[2])};for(let e=0;e<54;e++){const t=J+E.gauss()*150,o=E.range(5,24),a=E.range(-498,-482),n=E.range(5,14),r=E.range(0,6.283),s=E.range(7,11)*E.sign(),i=E.range(0,6.283);Zt(t,o,a,80)-n-1.9<xt+1.5||Pe(t,o,a,n,r,s,i)}const Ne=7,Wt=ie(V),Po=Dt.length,le=4,Ge=-150,Re=V-380,pe=128,nt=110,Tt=new Float32Array(pe*nt);{const e=new c.Vector3,t=new c.Matrix4,o=new c.Box3,a=[];j.updateMatrixWorld(!0),U.object.traverse(r=>{r.isMesh&&r.geometry&&r.name!=="towers"&&a.push(r)});const n=(r,s,i,l,d)=>{if(s<Ge||l<Re||r>Ge+pe*le||i>Re+nt*le)return;const h=Math.max(Math.floor((r-Ge)/le),0),m=Math.min(Math.floor((s-Ge)/le),pe-1),y=Math.max(Math.floor((i-Re)/le),0),w=Math.min(Math.floor((l-Re)/le),nt-1);for(let g=h;g<=m;g++)for(let S=y;S<=w;S++)d>Tt[g+S*pe]&&(Tt[g+S*pe]=d)};for(const r of a){if(r.isInstancedMesh){r.geometry.boundingBox||r.geometry.computeBoundingBox();for(let s=0;s<r.count;s++)r.getMatrixAt(s,t),t.premultiply(r.matrixWorld),o.copy(r.geometry.boundingBox).applyMatrix4(t),n(o.min.x,o.max.x,o.min.z,o.max.z,o.max.y)}else{const s=r.geometry.attributes.position,i=r.geometry.index,l=new Float32Array(s.count*3);for(let h=0;h<s.count;h++)e.fromBufferAttribute(s,h).applyMatrix4(r.matrixWorld),l[h*3]=e.x,l[h*3+1]=e.y,l[h*3+2]=e.z;const d=(i?i.count:s.count)/3;for(let h=0;h<d;h++){const m=(i?i.getX(h*3):h*3)*3,y=(i?i.getX(h*3+1):h*3+1)*3,w=(i?i.getX(h*3+2):h*3+2)*3;n(Math.min(l[m],l[y],l[w]),Math.max(l[m],l[y],l[w]),Math.min(l[m+2],l[y+2],l[w+2]),Math.max(l[m+2],l[y+2],l[w+2]),Math.max(l[m+1],l[y+1],l[w+1])),h%4e4===39999&&await f.yield()}}await f.yield()}}const Go=(e,t)=>{const o=Math.floor((e-Ge)/le),a=Math.floor((t-Re)/le);if(o<1||a<1||o>pe-2||a>nt-2)return 31;let n=0;for(let r=-1;r<=1;r++)for(let s=-1;s<=1;s++)n=Math.max(n,Tt[o+r+(a+s)*pe]);return n},rt=(e,t,o)=>{const a=Math.max(8,Math.ceil(6.283*o/3));let n=0;for(let r=0;r<a;r++){const s=r/a*6.283;n=Math.max(n,Go(e+Math.cos(s)*o,t+Math.sin(s)*o))}return n},st=(e,t,o,a)=>{let n=1e9;for(let r=0;r<=$;r++){const s=u[r*3+2]-o;if(s>a+40||s<-a-40)continue;const i=u[r*3]-e,l=Math.sqrt(i*i+s*s)-a,d=u[r*3+1]-t,h=l*l+d*d;h<n&&(n=h)}return Math.sqrt(n)},Ro=(e,t)=>{let o=1e9,a=Wt;for(let n=Math.max(Wt-40,0);n<=$;n++){const r=u[n*3]-e,s=u[n*3+2]-t,i=r*r+s*s;i<o&&(o=i,a=n)}return[Math.sqrt(o),a]},Ft=(e,t,o,a)=>{for(const n of H.towers)if(t-3<n.h&&Math.abs(Math.hypot(e-n.x,o-n.z-V)-a)<n.r+2.6)return!1;for(const n of H.domes)if(t-3<n.h&&Math.abs(Math.hypot(e-n.x,o-n.z-V)-a)<Math.max(n.r,(n.half??n.r)*1.45)+2.6)return!1;return!0};let to=0,oo=0,ao=0,no=0,Bo=0;const ro=1,Ho=Math.ceil(U.height/ro);for(const e of H.towers){const t=e.x,o=e.z+V,a=Ro(t,o)[1],n=R.sign(),r=u[a*3+1],s=Math.round(e.h/ro);for(let i=0;i<Ho;i++){const l=i%3===2,d=R(),h=R(),m=R.range(0,6.283),y=R.range(7,11)*(R.chance(.8)?n:-n),w=R.range(0,6.283),g=l?e.r+12+d*18:e.r+2.6+Math.pow(d,1.3)*13,S=l?9.5+h*14:-9+h*24;if(i>=s)continue;const N=Math.max(r+S,rt(t,o,g)+3.5);N>e.h+6||st(t,N,o,g)<Ne||!Ft(t,N,o,g)||(Pe(t,N,o,g,m,y,w),to++)}++Bo%8===0&&await f.yield()}await f.yield();const Vo=(e,t)=>{const o=(e-H.basinCentre[0])/120,a=(t-V-H.basinCentre[2])/85;return o*o+a*a<1};let Ko=0;for(let e=Wt+12;e<$-30;e++){if(Vo(u[e*3],u[e*3+2])||++Ko%10!==0)continue;const t=b.sign(),o=b.chance(.5),a=b.range(5,10),n=b.range(0,8),r=b.range(7.5,14),s=b.range(-5,6),i=b.sign(),l=3+Math.floor(b()*3),d=u[(e+1)*3]-u[(e-1)*3],h=u[(e+1)*3+2]-u[(e-1)*3+2],m=Math.hypot(d,h)||1,y=(o?n:a+Ne+n)*t,w=u[e*3]-h/m*y,g=u[e*3+2]+d/m*y,S=Math.max(u[e*3+1]+(o?r:s),rt(w,g,a+1)+3.5);for(let ye=0;ye<5;ye++){const It=b.range(0,6.283),Et=b.range(7,11)*i,Lt=b.range(0,6.283),he=b.range(0,2.4),we=b.range(-1,1);ye>=l||st(w,S+he,g,a+we)<Ne||!Ft(w,S+he,g,a+we)||(Pe(w,S+he,g,a+we,It,Et,Lt),oo++)}const N=b.range(5,10),q=b.range(-6,6),Y=b.range(7.5,15),Be=b.sign(),ct=3+Math.floor(b()*3),dt=u[e*3]-h/m*q,ut=u[e*3+2]+d/m*q,ft=Math.max(u[e*3+1]-Y,rt(dt,ut,N+1)+3.5);for(let ye=0;ye<5;ye++){const It=b.range(0,6.283),Et=b.range(7,11)*Be,Lt=b.range(0,6.283),he=b.range(0,2),we=b.range(-1,1);ye>=ct||ft+he>u[e*3+1]-Ne||st(dt,ft+he,ut,N+we)<Ne||!Ft(dt,ft+he,ut,N+we)||(Pe(dt,ft+he,ut,N+we,It,Et,Lt),ao++)}}const _o=(e,t,o)=>{const a=(e-H.basinCentre[0])/Math.max(120-o-12,1),n=(t-V-H.basinCentre[2])/Math.max(85-o-12,1);return a*a+n*n<1};for(let e=0;e<36;e++){const t=_.range(0,6.283),o=Math.sqrt(_()),a=_.range(6,15),n=_.range(6,26),r=_.range(0,6.283),s=_.range(7,11)*_.sign(),i=_.range(0,6.283),l=H.basinCentre[0]+Math.cos(t)*o*100,d=V+H.basinCentre[2]+Math.sin(t)*o*68;!_o(l,d,a)||n<rt(l,d,a)+3.5||st(l,n,d,a)<Ne||(Pe(l,n,d,a,r,s,i),no++)}Te.gulls={mouth:Po,towers:to,overhead:oo,low:ao,basin:no};const it=new c.BufferGeometry;it.setAttribute("position",new c.Float32BufferAttribute(Qt,3)),it.setAttribute("aP",new c.Float32BufferAttribute(Jt,4)),it.setAttribute("aL",new c.Float32BufferAttribute($t,3));const Nt=new c.Mesh(it,Ke({vertexShader:da,fragmentShader:ua,side:c.DoubleSide}));Nt.frustumCulled=!1,Nt.name="gulls",j.add(Nt);const so=Ae.length,lt=e=>He(e/so,0,1),io=30,Ct=ie(xe-Gt),qo=ie(Z+Ce),ht=ie(Z-Ce),Zo=U.center.clone().add(U.object.position),Oo=Ae.posAtDist(Math.min(ht+io,so),new c.Vector3),jo=new c.Vector3,lo=new c.Vector3,ho=new c.Vector3;return{scene:j,path:Ae,duration:42,camera:{fov:62,near:.3,far:5600,lookAhead:io,sway:.6,bank:.5},pois:[{at:(e,t)=>jo.lerpVectors(Zo,Oo,te(lt(qo),lt(ht),t)),from:lt(Ct),to:lt(ht),weight:.45,fade:(ee-Ct)/(ht-Ct)}],portal:{shape:"circle",radius:9,color:"#c8ffe6",glow:1.8,revealDistance:200},post:{exposure:1,bloom:{strength:.45,radius:.7,threshold:.92},grade:{saturation:1.06,contrast:1.04,tint:"#ffffff",shadowTint:"#040a18",vignette:.3,grain:.02,aberration:0}},counts:Te,probe:{route:u,RN:$,plainH:ge,greatH:bt,crestH:Ye,ridgeZ:wt,gapX:je,gapC:J,entry:[re,9,xe],soups:{night:P.pos,great:St.pos,floes:at.pos},anchors:H,ground:We,wallH:Mt,lane:[ee,De],cityZ:V,gulls:Dt,look:{sunDeg:+(ae*180/Math.PI).toFixed(1),greenBlue:+ne.toFixed(2),pink:+Ie.toFixed(2),violet:+be.toFixed(2),auroraK:+Ee.toFixed(2),rare:!!K.rare,dens:+me.toFixed(2)}},update(e,t,o){Ve.uTime.value=t,Kt.update(e,t,o),U.update(e,t,o),lo.setFromMatrixPosition(o.matrixWorld),ho.set(0,0,-1).transformDirection(o.matrixWorld);const a=Q.target.position.copy(lo).addScaledVector(ho,de*.6),n=de*2/2048*8;a.set(Math.round(He(a.x,-300,380)/n)*n,10,Math.round(He(a.z,V-300,V+30)/n)*n),Q.position.copy(a).addScaledVector(L,520)},dispose(){U.dispose?.()}}}};export{ya as default};
