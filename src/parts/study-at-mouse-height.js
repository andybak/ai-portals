import*as e from"three";const E=Math.PI*2,C=20,ue=`
float h21(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
float h31(vec3 p){ p=fract(p*vec3(.1031,.1030,.0973)); p+=dot(p,p.yxz+33.33); return fract((p.x+p.y)*p.z); }
float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x),mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x),f.y); }
float vn3(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(mix(h31(i),h31(i+vec3(1.,0.,0.)),f.x),mix(h31(i+vec3(0.,1.,0.)),h31(i+vec3(1.,1.,0.)),f.x),f.y),
             mix(mix(h31(i+vec3(0.,0.,1.)),h31(i+vec3(1.,0.,1.)),f.x),mix(h31(i+vec3(0.,1.,1.)),h31(i+vec3(1.,1.,1.)),f.x),f.y),f.z); }
float fbm(vec2 p){ float a=.5, s=0.; for(int i=0;i<4;i++){ s+=a*vn(p); p=p*2.03+vec2(17.1,9.3); a*=.5; } return s; }
float fbm3(vec3 p){ float a=.5, s=0.; for(int i=0;i<3;i++){ s+=a*vn3(p); p=p*2.03+vec3(17.1,9.3,4.7); a*=.5; } return s; }
`,Le=`
uniform float uTime, uTableY, uLampR, uFireR, uBounce, uNightAll, uNightR, uGreenR; uniform vec4 uBounceK; uniform vec2 uWinX; uniform vec3 uWinS, uWinE;
uniform vec3 uGreenA, uGreenB, uGreenCol, uBase, uAxisH; uniform vec4 uFan;
uniform vec3 uLampPos, uLampCol, uFirePos, uFireCol, uHemiSky, uHemiGnd, uNight, uMoonDir, uMoonCol;
uniform vec4 uTable, uFender, uWin, uSheet, uFont;
uniform float uRain, uLampFar, uFireFar; uniform vec2 uFarR; uniform vec4 uMantel;
uniform vec3 uAir;
uniform vec4 uSkyWin, uGlobe, uGlobePost, uFireLow; uniform vec3 uSkyCol; uniform vec2 uSkyZ; uniform float uSkyR;
uniform vec4 uOccF[${C}];
uniform vec4 uOccL[${C}];
uniform vec4 uMoth[3];
float fret(vec2 q){
  float cz=(fract(q.x/3.2)-.5)*3.2, cz2=(fract(q.x/3.2+.5)-.5)*3.2;
  float dy=q.y-clamp(q.y,3.,7.);
  float d=length(vec2(cz,dy))-.8;
  d=min(d,length(vec2(cz2,q.y-5.))-.5);
  d=min(d,length(vec2(cz2,q.y-7.4))-.3);
  d=min(d,length(vec2(cz2,q.y-2.6))-.3);
  return d;
}
// a standing post (centre o.xy in x,z; radius o.z; top o.w) between the point P and the light L: 1 = clear
float post(vec3 P, vec3 L, vec4 o){
  vec2 a=P.xz, b=L.xz-P.xz; float bb=max(dot(b,b),1e-4);
  float t=clamp(dot(o.xy-a,b)/bb,0.,1.);
  float d=length(a+b*t-o.xy), along=t*sqrt(bb);
  float y=mix(P.y,L.y,t);
  float pen=.25*o.z+.03*along;
  float s=smoothstep(o.z-pen,o.z+pen,d);
  s=max(s,smoothstep(o.w-.6,o.w+.6,y));
  return mix(1.,s,smoothstep(o.z*.6,o.z*1.2,along));
}
float lampVis(vec3 P){
  float v=1.;
  if(P.y<uTableY-.2){
    float t=clamp((uTableY-uLampPos.y)/min(P.y-uLampPos.y,-1e-3),0.,1.);
    vec2 x=uLampPos.xz+t*(P.xz-uLampPos.xz);
    vec2 q=max(vec2(uTable.x-x.x,uTable.z-x.y),vec2(x.x-uTable.y,x.y-uTable.w));
    float sd=max(q.x,q.y), w=max(3.*t,.2);
    v=smoothstep(-w,w,sd);
  }
  // the lamp's own font shades a ring round its foot (uFont: axis x,z; the shade's radius on the table; soft width)
  if(P.y<uLampPos.y-4.){
    float k=(uLampPos.y-P.y)/max(uLampPos.y-uTableY,1.);
    float r=length(P.xz-uFont.xy);
    v*=smoothstep(uFont.z*k-uFont.w*k,uFont.z*k+uFont.w*k,r);
  }
  #ifdef OCC_LAMP
  for(int i=0;i<${C};i++){ vec4 o=uOccL[i]; if(o.z>0.) v*=post(P,uLampPos,o); }
  #endif
  // what flies round the flame (uMoth: place and radius) throws its shadow away from the flame, growing with distance
  vec3 la=P-uLampPos; float laa=max(dot(la,la),1e-3);
  for(int i=0;i<3;i++){ vec4 m=uMoth[i]; if(m.w>0.){ vec3 mb=m.xyz-uLampPos; float s=clamp(dot(mb,la)/laa,0.,1.);
    v*=1.-.8*(1.-smoothstep(m.w*.45,m.w*1.5,length(mb-la*s)))*step(.01,s); } }
  return v;
}
float fenderT(vec3 P, vec3 F){
  float dx=P.x-F.x; if(dx<uFender.x-F.x+.4) return 1.;
  float t=(uFender.x-F.x)/max(dx,1e-3);
  vec3 c=F+(P-F)*t;
  if(c.z<uFender.y||c.z>uFender.z||c.y>uFender.w+.5||c.y<0.) return 1.;
  float open=smoothstep(-.12,.3,-fret(vec2(c.z-uFender.y,c.y)));
  open=mix(open,.3,clamp((P.x-uFender.x)/70.,0.,1.));
  return max(open,smoothstep(uFender.w-.4,uFender.w+.5,c.y));
}
float fireVis(vec3 P){
  float v=.6*fenderT(P,uFirePos)+.4*fenderT(P,uFirePos+vec3(0.,16.,0.));
  // under the hanging sheet (uSheet: x of its foot, x of the table's edge, z0, z1) the fire does not reach
  float s=clamp((P.x-uSheet.x)/max(uSheet.y-uSheet.x,1.),0.,1.);
  float hs=uTableY*(.7*s+.3*s*s);
  float under=step(uSheet.x,P.x)*step(uSheet.z,P.z)*step(P.z,uSheet.w)*(1.-smoothstep(hs-1.2,hs-.2,P.y));
  under=max(under,step(uSheet.y,P.x)*step(uTable.z,P.z)*step(P.z,uTable.w)*step(P.x,uTable.y)*(1.-smoothstep(uTableY-4.,uTableY-3.,P.y))*.8);
  v*=1.-.92*under;
  // THE MANTEL'S SHADE (uMantel: the shelf's front edge in x, its height, its two ends in z): the fire burns under the
  // shelf, so whatever lies above it on the wall's side of that edge stands in the shelf's shade (3 m of half shade at
  // its front edge; 30 m of it to either side of the shelf's two ends, for the fire is 40 m long)
  if(P.y>uMantel.y){ vec3 c=uFirePos+(P-uFirePos)*((uMantel.y-uFirePos.y)/(P.y-uFirePos.y));
    v*=1.-.95*(1.-smoothstep(uMantel.x-3.,uMantel.x+3.,c.x))*smoothstep(uMantel.z-30.,uMantel.z+30.,c.z)*(1.-smoothstep(uMantel.w-30.,uMantel.w+30.,c.z)); }
  #ifdef OCC_FIRE
  for(int i=0;i<${C};i++){ vec4 o=uOccF[i]; if(o.z>0.) v*=post(P,uFirePos,o); }
  #endif
  return v;
}
// THE MOON'S LIGHT at P: what comes in at the east light, through the wall's whole thickness (the opening at the wall's
// inner face uWinX.x and at its outer face uWinX.y; uWin: its two jambs in z, its sill and its head), less the shade of its
// two stone mullions and its glazing bars (soft, and softer the further the light has come: no hard edge lies in the room),
// of the table top on what lies under it, and of the room's standing things (the same posts the flames' light knows)
float moonVis(vec3 P){
  float t=(uWinX.x-P.x)/max(uMoonDir.x,1e-3), t2=(uWinX.y-P.x)/max(uMoonDir.x,1e-3);
  vec3 c=P+uMoonDir*t, c2=P+uMoonDir*t2;
  vec2 e=vec2(2.5+.03*t);
  vec2 m=smoothstep(uWin.xz-e,uWin.xz+e,c.zy)*(1.-smoothstep(uWin.yw-e,uWin.yw+e,c.zy));
  vec2 m2=smoothstep(uWin.xz-e,uWin.xz+e,c2.zy)*(1.-smoothstep(uWin.yw-e,uWin.yw+e,c2.zy));
  float v=m.x*m.y*m2.x*m2.y*step(0.,t);
  if(v<.002) return 0.;
  float ww=uWin.y-uWin.x, hh=uWin.w-uWin.z, w=.6+.02*t;
  float mul=abs(abs(c.z-(uWin.x+uWin.y)*.5)-ww/6.)-4.;
  float bars=min(abs(fract((c.z-uWin.x)/(ww/9.)+.5)-.5)*ww/9.-.5,abs(fract((c.y-uWin.z)/(hh/6.)+.5)-.5)*hh/6.-.5);
  v*=mix(.12,1.,smoothstep(-w,w,mul))*mix(.5,1.,smoothstep(-w,w,bars));
  if(P.y<uTableY-.2){ float s=(uTableY-P.y)/max(uMoonDir.y,1e-3); vec2 x=P.xz+uMoonDir.xz*s;
    vec2 q=max(vec2(uTable.x-x.x,uTable.z-x.y),vec2(x.x-uTable.y,x.y-uTable.w)); float ws=1.+.03*s; v*=smoothstep(-ws,ws,max(q.x,q.y)); }
  vec3 Lm=P+uMoonDir*400.;
  #ifdef OCC_FIRE
  for(int i=0;i<${C};i++){ vec4 o=uOccF[i]; if(o.z>0.) v*=post(P,Lm,o); }
  #endif
  #ifdef OCC_LAMP
  for(int i=0;i<${C};i++){ vec4 o=uOccL[i]; if(o.z>0.) v*=post(P,Lm,o); }
  #endif
  // rain outside: the shade of its falling threads crawls in the moon's bar (written in the window's own plane)
  float col=floor(c.z/2.2), hc=h21(vec2(col,4.1));
  float run=fract(c.y*.021+uTime*(.11+.16*hc)+hc*9.);
  float thread=(1.-smoothstep(.15,.5,abs(fract(c.z/2.2)-.5)))*smoothstep(0.,.08,run)*(1.-smoothstep(.12,.6,run));
  return v*(1.-uRain*.5*thread);
}
// THE SKY AT THE OPEN SOUTH LIGHT (uSkyWin: its two jambs in x, its sill and its head; uSkyZ: the wall's inner and outer
// face). The open light has no glass: the night sky's own cold light comes in at it and lies on what stands before it, the
// stone seat, the boards, the globe and the wall beside it. skyAim: the place of the opening a point takes it from (the
// nearest place of the opening's middle third: a tall soft light, not a point). skyAt: how much comes to P: it falls with the
// distance from the opening's nearest place, a light of that corner and not of the room (the square of the room's own
// fall-off, half of its half at uSkyR, the light's own breadth; nearer than half that breadth nothing has more of it, for
// the opening is as broad as that itself), and it leaves the opening into the room, so what hangs or
// stands along the window wall beside it has little of it and what stands out before it has much; what stands in the wall's own depth
// stands in the open night; THE GLOBE (uGlobe: its ball's middle and radius; uGlobePost: its stand) THROWS ITS SHADE away
// from the light, a long soft one, on the boards and the wall behind it.
vec3 skyAim(vec3 P){ vec2 th=vec2(uSkyWin.y-uSkyWin.x,uSkyWin.w-uSkyWin.z)/3.;
  return vec3(clamp(P.x,uSkyWin.x+th.x,uSkyWin.y-th.x),clamp(P.y,uSkyWin.z+th.y,uSkyWin.w-th.y),uSkyZ.x); }
float skyAt(vec3 P, vec3 A){
  vec3 nq=vec3(clamp(P.x,uSkyWin.x,uSkyWin.y),clamp(P.y,uSkyWin.z,uSkyWin.w),uSkyZ.x)-P;
  float fall=1./(1.+max(dot(nq,nq)/(uSkyR*uSkyR),.25)), v=fall*fall*clamp((uSkyZ.x-P.z)/max(length(A-P),1e-3),0.,1.);
  if(v<.002) return 0.;
  vec3 d=A-P; float dd=max(dot(d,d),1e-3), t=clamp(dot(uGlobe.xyz-P,d)/dd,0.,1.), along=t*sqrt(dd);
  float miss=length(P+d*t-uGlobe.xyz), pen=.1*uGlobe.w+.05*along;
  v*=mix(1.,smoothstep(uGlobe.w-pen,uGlobe.w+pen,miss),smoothstep(uGlobe.w*.4,uGlobe.w*1.3,along));
  return v*post(P,A,uGlobePost);
}
vec3 roomEnv(vec3 R, vec3 P){
  float up=smoothstep(-.25,.6,R.y);
  vec3 c=mix(uHemiGnd*.9+uFireCol*.01, uHemiSky*.9+uLampCol*.03, up);
  return c*vec3(1.12,.94,.72)*min(uBounce,.7)*(.5+.5*vn(R.xz*3.+R.y*2.));
}
// THE BOTTLE'S GREEN IS THE LAMP'S LIGHT COME THROUGH THE GLASS, by three laws of place (all green there is in the room):
//  (1) the glass's own glow on what stands close by it: a long light on the body's axis (uGreenA to uGreenB), half at the
//      body's radius (uGreenR) from the axis and gone by twice that (it falls by the fourth power: the wall behind the
//      bottle, two radii and more off, stays dark wood);
//  (2) THE BOTTLE'S SHADE IS GREEN: where the straight from the flame to a place goes through the body, the place is lit by
//      the lamp's own fall-off, green (so it lies on the chart and on what stands beyond the bottle from the lamp, and
//      never on the wall behind the lamp and the bottle);
//  (3) THE GREEN FAN: the thick base is a lens and throws the light out before it, along the axis toward the room: half
//      strength uFan.x metres before the base, as wide as the ring (uFan.z) at the base and opening by uFan.y to either
//      hand, lying near the table (it is a beam: as high as it is wide), with a net of bright lines that move on the
//      world's clock (two nets of cells whose middles wander; a line is where two cells meet). uFan.w: its strength.
//      It is spent between twice and four times that half distance: it lies on the table and what stands before it, and
//      never reaches the room's far walls.
float fanNet(vec2 p, float t){ vec2 i=floor(p), f=fract(p); float d1=9., d2=9.;
  for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){ vec2 g=vec2(float(x),float(y)); vec2 o=vec2(h21(i+g),h21(i+g+7.7)); o=.5+.4*sin(t+6.2832*o);
    float d=length(g+o-f); if(d<d1){ d2=d1; d1=d; } else if(d<d2) d2=d; }
  return d2-d1; }
vec3 greenAt(vec3 P, vec3 N, float dl){
  vec3 ga=uGreenB-uGreenA; float gl=max(length(ga),1e-3); vec3 gd=ga/gl;
  float tg=clamp(dot(P-uGreenA,gd),0.,gl); vec3 Lg=uGreenA+gd*tg-P; float dg=length(Lg); Lg/=max(dg,1e-3);
  float gq=dg*dg/(uGreenR*uGreenR), g=(1./(1.+gq*gq))*clamp((dot(N,Lg)+.5)/1.5,0.,1.)*.5;
  // (2) the nearest approach of the straight flame-to-place to the body's axis
  vec3 rd=(P-uLampPos)/max(dl,1e-3), w0=uLampPos-uGreenA; float b=dot(rd,gd), d0=dot(rd,w0), e0=dot(gd,w0);
  float sc=clamp((b*e0-d0)/max(1.-b*b,1e-3),0.,dl), tc=clamp(e0+b*sc,0.,gl); sc=clamp(dot(uGreenA+gd*tc-uLampPos,rd),0.,dl);
  float miss=length(uLampPos+rd*sc-(uGreenA+gd*tc));
  float thru=(1.-smoothstep(uGreenR*.65,uGreenR*1.1,miss))*smoothstep(uGreenR*.6,uGreenR*1.6,dl-sc);
  g+=thru*clamp((dot(N,-rd)+.35)/1.35,0.,1.)*1.6/(1.+dl*dl/(uLampR*uLampR*6.));
  // (3) the fan before the base
  vec3 q=P-uBase; float s=-dot(q,uAxisH), y=q.x*uAxisH.z-q.z*uAxisH.x, w=uFan.z+uFan.y*max(s,0.);
  float along=smoothstep(0.,5.,s)/(1.+s*s/(uFan.x*uFan.x))*(1.-smoothstep(2.*uFan.x,4.*uFan.x,s)), lat=1.-smoothstep(.5,1.,abs(y)/w), high=1.-smoothstep(.2,.5,abs(q.y)/w);
  float fan=along*lat*high, fg=0.;
  if(fan>.004){ vec3 Lb=normalize(uBase-P); float fl=length(uLampCol)/3.2, t=uTime*1.1+(fl-1.)*8.;
    vec2 pn=vec2(s*.085+.2*sin(y*.21+uTime*.7),y/w*4.2+.25*sin(s*.17-uTime*.5));
    float n1=1.-smoothstep(.02,.17,fanNet(pn,t)), n2=1.-smoothstep(.02,.22,fanNet(pn*1.9+3.1,t*1.3+1.));
    fg=uFan.w*fan*(.3+1.7*n1+.7*n2)*clamp((dot(N,Lb)+.75)/1.75,0.,1.); }
  // (the thrown light keeps the glass's green: less red and blue than the glow)
  return uGreenCol*(g+fg*vec3(.42,1.,.6));
}
// THE TABLE STANDS IN THE LOW GLOW'S WAY: the fire's low glow skims the boards, and the great table with the sheet that
// hangs from its edge to the floor stands across it; lowVis: how much of the glow comes to P past the table (the length of
// the straight way from the fire to P that lies under the table's top, in plan: none of it, all the glow; forty metres of
// it, none)
float lowVis(vec3 P){
  vec2 o=uFirePos.xz, d=P.xz-o; d+=step(abs(d),vec2(1e-4))*2e-4;
  vec2 ta=(uTable.xz-o)/d, tb=(uTable.yw-o)/d;
  float tn=max(min(ta.x,tb.x),min(ta.y,tb.y)), tf=min(max(ta.x,tb.x),max(ta.y,tb.y));
  return 1.-smoothstep(0.,40.,max(min(tf,1.)-max(tn,0.),0.)*length(d));
}
vec3 shade(vec3 P, vec3 N, vec3 V, vec3 alb, float gloss, float metal, float wrap){
  vec3 Ll=uLampPos-P; float dl=length(Ll); Ll/=max(dl,1e-3);
  // the lamp: a pool that falls off by the square of the distance (half at uLampR), and round it a wider, fainter glow
  // (uLampFar of it, half at uFarR.x); the fire the same
  float al=1./(1.+dl*dl/(uLampR*uLampR))+uLampFar/(1.+dl*dl/(uFarR.x*uFarR.x));
  float vl=lampVis(P);
  // the chimney's open top throws a brighter, wavering cone straight up: on the wall behind, the shelves and across the beams
  float upc=dot(-Ll,vec3(0.,1.,0.));
  al*=1.+1.1*smoothstep(.8+.01*sin(uTime*5.3),.96,upc);
  vec3 Lf=uFirePos+vec3(0.,6.,0.)-P; float df=length(Lf); Lf/=max(df,1e-3);
  float af=1./(1.+df*df/(uFireR*uFireR))+uFireFar/(1.+df*df/(uFarR.y*uFarR.y));
  // THE FAR FIRE ALONG THE BOARDS (uFireLow: its strength; the distance at which it has grown to half; its reach; its height):
  // the fire burns low, and what it throws out under its lintel skims the floor: far from the hearth, where the pool has
  // died, a long low warm glow lies on the boards and on what stands low (it is nothing near the hearth, where the pool is,
// and grows fast as the light comes to skim, half of it at uFireLow.y; it falls slowly
  // with the distance, is half at uFireLow.w above the boards and little higher, and the table stands in its way)
  float ql=df*df/(uFireLow.y*uFireLow.y);
  af+=uFireLow.x*(ql*ql/(1.+ql*ql))/(1.+df/uFireLow.z)/(1.+P.y*P.y/(uFireLow.w*uFireLow.w))*lowVis(P);
  float vf=fireVis(P);
  float nl=clamp((dot(N,Ll)+wrap)/(1.+wrap),0.,1.);
  float nf=clamp((dot(N,Lf)+wrap+.15)/(1.15+wrap),0.,1.);
  // away from the flames: deep warm umber, a little more of it near what the flames light (their bounce), never nothing
  float nearL=1./(1.+dl*dl/(uBounceK.y*uBounceK.y)), nearF=1./(1.+df*df/(uBounceK.w*uBounceK.w));
  // (the shade between the pools: a deep brown that no place is without, uBounceK.x; and the lamp's bounce off the table top)
  vec3 amb=mix(uHemiGnd,uHemiSky,N.y*.5+.5)*(uBounceK.x+uBounce*.3*nearL)+uFireCol*uBounceK.z*nearF;
  // the dark under the table and under the hanging sheet
  vec2 qt=max(vec2(uTable.x-P.x,uTable.z-P.z),vec2(P.x-uTable.y,P.z-uTable.w));
  amb*=1.-.6*(1.-smoothstep(-8.,4.,max(qt.x,qt.y)))*(1.-smoothstep(uTableY-6.,uTableY-2.,P.y));
  // THE NIGHT, the room's second colour: each of the two windows (uWinS: the south light's middle, uWinE: the east light's)
  // is a soft blue light on what faces it, half at uNightR metres from it; and everywhere a deep blue that the night lays on
  // the whole room, least where the lamp's pool is (uNightAll)
  vec3 vs=uWinS-P, ve=uWinE-P; float ds=length(vs), de=length(ve); vs/=max(ds,1e-3); ve/=max(de,1e-3);
  float wS=1./(1.+ds*ds/(uNightR*uNightR)), wE=1./(1.+de*de/(uNightR*uNightR));
  vec3 night=uNight*(wS*clamp(dot(N,vs)*.75+.25,0.,1.)+wE*clamp(dot(N,ve)*.75+.25,0.,1.)+uNightAll*(.6+.4*N.y)*(1.-.9*nearL));
  // (the blue rim: what an edge turned toward a window catches of it)
  float rimN=wS*clamp(dot(N,vs)+.5,0.,1.)+wE*clamp(dot(N,ve)+.5,0.,1.);
  float nm=clamp(dot(N,uMoonDir),0.,1.);
  vec3 moon=uMoonCol*nm*moonVis(P);
  vec3 lamp=uLampCol*al*vl, fire=uFireCol*af*vf;
  vec3 green=greenAt(P,N,dl);
  // the open south light's sky: on what is turned to it; in the wall's own depth the open night on every face
  vec3 As=skyAim(P), Ls=normalize(As-P);
  vec3 sky=uSkyCol*skyAt(P,As);
  float nsk=clamp((dot(N,Ls)+wrap)/(1.+wrap),0.,1.);
  vec3 open=uSkyCol*(1.-smoothstep(-2.,8.,uSkyZ.x-P.z))*step(uSkyWin.x-8.,P.x)*step(P.x,uSkyWin.y+8.)*step(uSkyWin.z-6.,P.y)*step(P.y,uSkyWin.w+3.)*(.33+.3*clamp(N.z,0.,1.)+.17*N.y);
  vec3 col=alb*(1.-metal)*(amb+lamp*nl+fire*nf+night+moon+green+sky*nsk+open);
  vec3 F0=mix(vec3(.04),alb,metal);
  float sh=mix(6.,220.,gloss*gloss), sk=(.04+gloss*gloss*2.6);
  float ndv=clamp(dot(N,V),0.,1.), fr=pow(1.-ndv,5.);
  // every edge turned toward a light catches a rim of it
  float rimv=(1.-ndv)*(1.-ndv)*(1.-ndv);
  col+=mix(alb,vec3(1.),.35)*rimv*(.3*(lamp*clamp(dot(N,Ll)+.45,0.,1.)+fire*1.3*clamp(dot(N,Lf)+.45,0.,1.)+moon*.5)+uNight*rimN*1.5);
  vec3 Hl=normalize(Ll+V+vec3(0.,1e-4,0.)), Hf=normalize(Lf+V+vec3(0.,1e-4,0.));
  float sl=pow(clamp(dot(N,Hl),0.,1.),sh)*sk*step(0.,dot(N,Ll)), sf=pow(clamp(dot(N,Hf),0.,1.),sh*.55)*sk*step(0.,dot(N,Lf));
  vec3 R=reflect(-V,N);
  // (the sky's own gleam on what is glossy: brass, wax, glass)
  vec3 Hs=normalize(Ls+V+vec3(0.,1e-4,0.)); float ssk=pow(clamp(dot(N,Hs),0.,1.),sh*.3)*sk*step(0.,dot(N,Ls));
  col+=mix(F0,vec3(1.),fr*.6*gloss)*(lamp*sl+fire*sf*1.4+(night+moon)*gloss*.6+green*(.3+.4*metal)+sky*(ssk+.25*metal)+open*.3*metal);
  vec3 env=roomEnv(R,P)+lamp*.7*pow(clamp(dot(R,Ll),0.,1.),10.)+fire*.9*pow(clamp(dot(R,Lf),0.,1.),5.);
  col+=mix(F0,vec3(1.),fr*gloss)*env*(metal*.9+.25*gloss+fr*gloss*.5);
  return col;
}
// the lamp's smoke in the air: what the two flames light of the haze between the eye E and the point P (each flame's light
// summed along the sight by its fall-off; uAir: the lamp's and the fire's strength, and the softening radius in metres)
vec3 airlight(vec3 E, vec3 P){
  vec3 d=P-E; float T=length(d); d/=max(T,1e-3);
  vec3 ql=uLampPos-E; float bl=dot(ql,d), hl=sqrt(max(dot(ql,ql)-bl*bl,0.)+uAir.z*uAir.z);
  vec3 qf=uFirePos+vec3(0.,8.,0.)-E; float bf=dot(qf,d), hf=sqrt(max(dot(qf,qf)-bf*bf,0.)+4.*uAir.z*uAir.z);
  float il=(atan((T-bl)/hl)-atan(-bl/hl))/hl, jf=(atan((T-bf)/hf)-atan(-bf/hf))/hf;
  return uLampCol*uAir.x*il+uFireCol*uAir.y*jf;
}
`,Pe=t=>`
#ifdef HAS_G
attribute vec3 aG;
#endif
varying vec3 vW, vN, vC, vG; varying vec2 vUv;
uniform float uTime;
#include <fog_pars_vertex>
${t.vpars||""}
void main(){
  vec3 p=position, n=normal;
  vUv=uv;
  #ifdef USE_COLOR
  vC=color;
  #else
  vC=vec3(1.);
  #endif
  #ifdef HAS_G
  vG=aG;
  #else
  vG=position;
  #endif
  ${t.vert||""}
  #ifdef USE_INSTANCING
  vec4 w=modelMatrix*instanceMatrix*vec4(p,1.); vec3 wn=mat3(modelMatrix)*mat3(instanceMatrix)*n;
  #ifdef USE_INSTANCING_COLOR
  vC*=instanceColor;
  #endif
  #else
  vec4 w=modelMatrix*vec4(p,1.); vec3 wn=mat3(modelMatrix)*n;
  #endif
  ${t.vworld||""}
  vW=w.xyz; vN=wn/max(length(wn),1e-5);
  vec4 mvPosition=viewMatrix*w; gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Fe=t=>`
varying vec3 vW, vN, vC, vG; varying vec2 vUv;
#include <fog_pars_fragment>
${ue}
${Le}
${t.pars||""}
void main(){
  vec3 N=normalize(vN); if(!gl_FrontFacing) N=-N;
  vec3 V=normalize(cameraPosition-vW);
  vec3 alb=vC, emis=vec3(0.); float gloss=.15, metal=0., alpha=1., wrap=.25;
  ${t.surface||""}
  vec3 col=shade(vW,N,V,alb,gloss,metal,wrap)+emis;
  ${t.post||""}
  gl_FragColor=vec4(col,alpha);
  #include <fog_fragment>
  gl_FragColor.rgb+=airlight(cameraPosition,vW);
}`;function he(t){const n=1+.018*Math.sin(E*7.1*t)+.012*Math.sin(E*9.7*t+2.1)+.055*Math.sin(E*.4*t),s=1+.11*Math.sin(E*.71*t)+.07*Math.sin(E*1.93*t+1.2)+.05*Math.sin(E*3.37*t+4);return{lamp:n,fire:s}}function ze(t={}){const n=a=>new e.Vector3(a[0],a[1],a[2]),s=(a,l=1)=>{const v=new e.Color(a);return new e.Vector3(v.r*l,v.g*l,v.b*l)},x=n(t.lamp||[0,13,0]),o=n(t.fire||[-400,14,300]),h=s(t.lampColor||"#F2B24C",t.lampGain??3.2),r=s(t.fireColor||"#D9541E",t.fireGain??0),c=()=>Array.from({length:C},()=>new e.Vector4(0,0,0,0)),g={uTime:{value:0},uLampPos:{value:x.clone()},uLampCol:{value:h.clone()},uLampR:{value:t.lampReach??95},uFirePos:{value:o.clone()},uFireCol:{value:r.clone()},uFireR:{value:t.fireReach??75},uTable:{value:new e.Vector4(...t.table||[0,0,0,0])},uTableY:{value:t.tableY??-1e4},uFender:{value:new e.Vector4(...t.fender||[-1e4,0,0,0])},uSheet:{value:new e.Vector4(...t.sheet||[1e4,10001,0,0])},uFont:{value:new e.Vector4(x.x,x.z,t.fontShade??9.8,2.2)},uWin:{value:new e.Vector4(...t.win||[0,0,0,0])},uWinX:{value:new e.Vector2(...t.winX||[1e4,1e4])},uWinS:{value:n(t.winS||[0,1e4,0])},uWinE:{value:n(t.winE||[0,1e4,0])},uNightR:{value:t.nightReach??100},uNightAll:{value:t.nightAll??0},uGreenA:{value:n(t.greenA||[0,-1e4,0])},uGreenB:{value:n(t.greenB||[1,-1e4,0])},uGreenCol:{value:new e.Vector3(0,0,0)},uGreenR:{value:t.greenReach??12},uBase:{value:n(t.greenBase||[0,-1e4,0])},uAxisH:{value:n(t.greenAxis||[1,0,0])},uFan:{value:new e.Vector4(...t.greenFan||[60,.6,8,0])},uHemiSky:{value:s(t.hemiSky||"#6A4526")},uHemiGnd:{value:s(t.hemiGround||"#24160E")},uBounce:{value:t.bounce??.9},uBounceK:{value:new e.Vector4(t.bounceFloor??.12,t.bounceNear??90,t.fireBounce??.045,t.fireNear??70)},uNight:{value:s(t.night||"#2B3A5E",t.nightGain??0)},uMoonDir:{value:n(t.moonDir||[0,.6,.8]).normalize()},uMoonCol:{value:s(t.moonColor||"#AEB9D6",t.moonGain??0)},uRain:{value:t.rain?1:0},uMantel:{value:new e.Vector4(...t.mantel||[-1e5,1e5,0,0])},uLampFar:{value:t.lampFar??.06},uFireFar:{value:t.fireFar??.1},uFarR:{value:new e.Vector2(t.lampFarReach??260,t.fireFarReach??220)},uAir:{value:new e.Vector3(t.airLamp??0,t.airFire??0,t.airSoft??6)},uSkyWin:{value:new e.Vector4(...t.sky||[0,1,1e4,10001])},uSkyZ:{value:new e.Vector2(...t.skyZ||[1e4,10001])},uSkyCol:{value:s(t.skyColor||"#9DB8F0",t.skyGain??0)},uSkyR:{value:t.skyReach??70},uGlobe:{value:new e.Vector4(...t.globe||[0,-1e4,0,1])},uGlobePost:{value:new e.Vector4(...t.globePost||[0,0,0,0])},uFireLow:{value:new e.Vector4(...t.fireLow||[0,100,100,80])},uOccF:{value:c()},uOccL:{value:c()},uMoth:{value:[new e.Vector4,new e.Vector4,new e.Vector4]}},m={lampAt:x,fireAt:o,lampCol:h,fireCol:r};let d=0,p=0;return{u:g,base:m,addOccF(a,l,v,G){d<C&&g.uOccF.value[d++].set(a,l,v,G)},addOccL(a,l,v,G){p<C&&g.uOccL.value[p++].set(a,l,v,G)},mat(a={}){const l={...a.defines||{}};a.occF&&(l.OCC_FIRE=1),a.occL&&(l.OCC_LAMP=1),a.grain&&(l.HAS_G=1);const v=new e.ShaderMaterial({uniforms:{...e.UniformsUtils.clone(e.UniformsLib.fog),...g,...a.uniforms||{}},defines:l,fog:!0,vertexShader:Pe(a),fragmentShader:Fe(a),side:a.side??e.FrontSide,vertexColors:a.vertexColors===!0,transparent:a.transparent===!0,depthWrite:a.depthWrite!==!1});return a.blending!==void 0&&(v.blending=a.blending),a.name&&(v.name=a.name),v},setTime(a){const l=he(a);return l.fire+=(t.fireBreath??0)*Math.sin(E*.27*a+.8),g.uTime.value=a,g.uLampCol.value.copy(m.lampCol).multiplyScalar(l.lamp),g.uFireCol.value.copy(m.fireCol).multiplyScalar(l.fire),g.uLampPos.value.set(m.lampAt.x+.22*Math.sin(a*2.3)+.1*Math.sin(a*7.9),m.lampAt.y+.3*(l.lamp-1)*8,m.lampAt.z+.18*Math.sin(a*1.7+1)),g.uFirePos.value.set(m.fireAt.x,m.fireAt.y+2.2*(l.fire-1)*6,m.fireAt.z+3*Math.sin(a*.83)+1.4*Math.sin(a*2.1+.7)),l}}}const fe={wood:`{ vec3 q=vG*uGrain; float w=fbm(vec2(q.x+q.z*1.7,q.y*.11));
    float lines=vn(vec2((q.x+q.z*1.3)*5.+w*6.,q.y*.22)); float pore=vn(vec2((q.x-q.z)*21.,q.y*1.1));
    float knot=smoothstep(.78,.9,vn(vec2(q.x*.45+3.,q.y*.07+q.z*.4)));
    alb=mix(alb,vec3(dot(alb,vec3(.4,.4,.2))),.3)*mix(.72,1.08,lines)*(.9+.2*pore)*(.82+.36*w)*(1.-.45*knot); gloss=uWoodGloss*(.6+.6*lines); }`,brass:`{ float w=fbm(vG.xy*.9+vG.z*.7); float sc=vn(vec2(vG.y*14.,vG.x*.6+vG.z*.6));
    metal=1.; gloss=.5+.32*w; alb*=(.78+.4*w)*(.94+.12*sc); }`,iron:"{ float w=fbm(vG.xy*1.7+vG.z); metal=.85; gloss=.25+.2*w; alb*=.7+.5*w; }",stone:`{
    // the fine part of the stone (its speckle, the mason's pits, the drag of the chisel) is faded by its own width in the
    // picture: where one picture point covers a sixth of a metre of stone and more it is gone, and the face is calm
    float px=length(fwidth(vW)), fine=1.-smoothstep(.04,.16,px);
    float w=fbm(vW.xz*.11+vW.y*.13), sp=mix(.5,vn3(vW*1.9),fine); alb*=(.74+.45*w)*(.86+.28*sp); gloss=.08;
    // the mason's tooling: shallow pits and a faint drag of the chisel, so that raking light models the face
    float pit=smoothstep(.62,.8,vn3(vW*.9+3.))*fine; alb*=1.-.3*pit;
    N=normalize(N+((vec3(vn3(vW*1.3),vn3(vW*1.3+5.),vn3(vW*1.3+9.))-.5)*.3+vec3(.08*sin((vW.x+vW.z*.3)*5.),0.,0.))*fine); }`,plaster:"{ float w=fbm(vW.xy*.035+vW.z*.03), sp=vn3(vW*.9); alb*=(.82+.3*w)*(.95+.1*sp); gloss=.04; }"},Se="uniform float uGrain, uWoodGloss;",L=(t=0,n=0,s=0,x=0,o=0,h=0,r=1,c=r,g=r)=>new e.Matrix4().compose(new e.Vector3(t,n,s),new e.Quaternion().setFromEuler(new e.Euler(x,o,h)),new e.Vector3(r,c,g)),q=(t,n=48)=>new e.LatheGeometry(t.map(s=>new e.Vector2(Math.max(s[0],1e-4),s[1])),n),Te=(t,n,s=24,x=8)=>new e.TubeGeometry(new e.CatmullRomCurve3(t.map(o=>new e.Vector3(o[0],o[1],o[2]))),s,n,x,!1);function oe(){const t=[],n=[],s=[],x=[],o=[],h=[],r=new e.Vector3,c=new e.Matrix3,g=new e.Color,m=new e.Vector3,d=new e.Quaternion,p=new e.Vector3,T={add(a,l=null,v="#ffffff",G={}){const P=a.attributes.position,X=a.attributes.normal,W=a.attributes.uv,Y=t.length/3;typeof v=="string"?g.set(v):g.setRGB(v[0],v[1],v[2]),l?(c.getNormalMatrix(l),l.decompose(p,d,m)):m.set(1,1,1);const I=G.gs??1,Z=G.g||"y";for(let u=0;u<P.count;u++){const M=P.getX(u)*m.x*I,R=P.getY(u)*m.y*I,b=P.getZ(u)*m.z*I;Z==="x"?o.push(R,M,b):Z==="z"?o.push(M,b,R):o.push(M,R,b),r.fromBufferAttribute(P,u),l&&r.applyMatrix4(l),t.push(r.x,r.y,r.z),r.fromBufferAttribute(X,u),l&&r.applyMatrix3(c).normalize(),n.push(r.x,r.y,r.z),s.push(W?W.getX(u):0,W?W.getY(u):0);const F=G.shade?G.shade(P.getX(u),P.getY(u),P.getZ(u)):1;x.push(g.r*F,g.g*F,g.b*F)}if(a.index){const u=a.index;for(let M=0;M<u.count;M++)h.push(Y+u.getX(M))}else for(let u=0;u<P.count;u++)h.push(Y+u);return a.dispose(),T},get triangles(){return h.length/3},build(){const a=new e.BufferGeometry;return a.setAttribute("position",new e.Float32BufferAttribute(t,3)),a.setAttribute("normal",new e.Float32BufferAttribute(n,3)),a.setAttribute("uv",new e.Float32BufferAttribute(s,2)),a.setAttribute("color",new e.Float32BufferAttribute(x,3)),a.setAttribute("aG",new e.Float32BufferAttribute(o,3)),a.setIndex(h),a.computeBoundingSphere(),a}};return T}const H=13,O=8,Ge="#6FA98A";async function Ae(t,n={}){const s=new e.Group;s.name="lamp-and-bottle";const x=[n.lampAt?n.lampAt[0]:-28.5,0,n.lampAt?n.lampAt[1]:7.8],o=n.length??27.5,h=n.grow??1,r=new e.Group;r.name="bottle-in-cradle",r.scale.setScalar(h),s.add(r);const c=n.lib||ze({lamp:[x[0],H,x[2]],lampGain:3.2,bounce:1.6}),m=(n.palette||{}).brass||"#C9A04A",[d,,p]=x,T=oe();T.add(q([[0,0],[5.3,0],[5.7,.25],[5.7,.8],[5.1,1.1],[4.3,1.5],[4.2,1.9],[4.7,2.4],[5.7,3.3],[6,4.2],[5.9,5],[5.3,6],[4,6.9],[2.9,7.5],[2.5,8]],64),L(d,0,p),m),T.add(q([[2.5,8],[2.9,8.15],[2.95,8.5],[2.7,8.7],[2.7,9.6],[3.05,9.8],[3.05,10.1],[2.6,10.3],[1.2,10.4],[0,10.4]],48),L(d,0,p),m,{shade:()=>.92}),T.add(new e.BoxGeometry(1.9,1.2,.5),L(d,10.9,p),m,{shade:()=>.8}),T.add(new e.CylinderGeometry(.22,.22,3.2,10),L(d+4,9.2,p,0,0,Math.PI/2),m),T.add(q([[0,-.25],[1,-.25],[1.1,-.1],[1.1,.1],[1,.25],[0,.25]],20),L(d+5.6,9.2,p,0,0,Math.PI/2),m);const a=c.mat({name:"hero-brass",vertexColors:!0,grain:!0,surface:fe.brass+`
    { float a=atan(vG.z,vG.x); float pierce=(1.-smoothstep(.2,.3,length(vec2(fract(a*14./6.2832)-.5,(vG.y-9.15)*.9))))*step(8.7,vG.y)*step(vG.y,9.6);
      alb*=1.-.85*pierce; emis+=uLampCol*.35*pierce;
      // the font stands in its own burner's shade (the collar, 3 m in radius 3 m under the flame, shades out to 8.9 m at the
      // font's widest): the flame does not reach it; it shows by the lit table's light from below and by the fire
      float inShade=1.-smoothstep(7.4,8.6,vG.y); emis+=alb*uLampCol*.12*inShade*clamp(.55-.45*N.y,0.,1.); alb*=1.-.5*inShade; }`}),l=new e.Mesh(T.build(),a);l.name="lamp-brass",s.add(l),await t.yield();const v=q([[2.5,8.2],[2.85,9.6],[3.15,11.4],[3,13.4],[2.45,15.6],[1.9,18.2],[1.6,21.5],[1.5,26]],48);v.translate(d,0,p);const G=c.mat({name:"hero-chimney",transparent:!0,depthWrite:!1,side:e.DoubleSide,uniforms:{uFlameY:{value:H}},pars:"uniform float uFlameY;",surface:`{ float ndv=clamp(abs(dot(N,V)),0.,1.), fr=pow(1.-ndv,2.2);
      float dyf=(vG.y-uFlameY)/3.2; float gy=exp(-dyf*dyf);
      float soot=smoothstep(21.,26.,vG.y)*(.5+.5*vn(vec2(atan(vN.z,vN.x)*3.,vG.y*.8)));
      vec3 R=reflect(-V,N); float streak=pow(clamp(dot(normalize(R*vec3(1.,.15,1.)),normalize(vec3(.3,0.,1.))),0.,1.),24.);
      alb=mix(vec3(.9,.85,.7),vec3(.05,.035,.02),soot); gloss=.9; wrap=.6;
      emis=uLampCol*(.16*gy+.5*gy*fr)+vec3(.8,.75,.6)*streak*.35;
      alpha=clamp(.05+.5*fr+.55*soot+.3*streak+.12*gy,0.,.9); }`}),P=new e.Mesh(v,G);P.name="lamp-chimney",P.renderOrder=4,s.add(P);const X={uC:{value:new e.Vector3(d,H-1.5,p)},uSz:{value:new e.Vector2(2,3)},uKind:{value:0},uTime:c.u.uTime,uLampCol:c.u.uLampCol},W=`uniform vec3 uC; uniform vec2 uSz; uniform float uTime, uKind; varying vec2 vP;
    void main(){ vec4 wc=modelMatrix*vec4(uC,1.); vec3 up=normalize(mat3(modelMatrix)*vec3(0.,1.,0.)); vec3 toCam=normalize(cameraPosition-wc.xyz);
      vec3 right=normalize(cross(up,toCam)+vec3(1e-5,0.,0.)); vec3 upv=mix(up,normalize(cross(toCam,right)),uKind);
      float lean=(.16*sin(uTime*2.3)+.07*sin(uTime*7.9))*(1.-uKind);
      float tall=1.+(.09*sin(uTime*3.1+.6)+.06*sin(uTime*11.3))*(1.-uKind);
      vec2 q=position.xy; vP=vec2(q.x*2.,q.y);
      float yy=q.y-.5*uKind;
      vec3 wp=wc.xyz+right*(q.x*uSz.x+lean*q.y*q.y*uSz.y)+upv*yy*uSz.y*tall;
      gl_Position=projectionMatrix*viewMatrix*vec4(wp,1.); }`,Y=`uniform float uTime, uKind; uniform vec3 uLampCol; varying vec2 vP;
    void main(){ vec3 col; 
      if(uKind<.5){ float y=clamp(vP.y,0.,1.); float w=1.75*pow(y,.38)*pow(1.-y,.7)+.02; float d=abs(vP.x+.22*y*y*sin(uTime*9.1+y*7.))/w;
        float body=1.-smoothstep(.45,1.,d); float core=(1.-smoothstep(0.,.7,d))*smoothstep(.04,.3,y)*(1.-smoothstep(.55,.95,y));
        col=mix(vec3(1.,.42,.06)*2.2,vec3(1.,.86,.52)*6.,core)*body;
        col=mix(col,vec3(.12,.25,1.)*1.6*body,(1.-smoothstep(.03,.2,y))*.9); }
      else { float r=length(vec2(vP.x,(vP.y-.5)*2.)); float g=1.-smoothstep(0.,1.,r); col=uLampCol*(.055*g*g+.03*g); }
      gl_FragColor=vec4(col,1.); }`,I=()=>{const i=new e.BufferGeometry;return i.setAttribute("position",new e.Float32BufferAttribute([-.5,0,0,.5,0,0,.5,1,0,-.5,1,0],3)),i.setIndex([0,1,2,0,2,3]),i.boundingSphere=new e.Sphere(new e.Vector3(d,H,p),16),i},Z=new e.ShaderMaterial({uniforms:X,vertexShader:W,fragmentShader:Y,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,side:e.DoubleSide}),u=new e.Mesh(I(),Z);u.name="lamp-flame",u.renderOrder=2,s.add(u);const M=new e.ShaderMaterial({uniforms:{...X,uC:{value:new e.Vector3(d,H,p)},uSz:{value:new e.Vector2(22,22)},uKind:{value:1}},vertexShader:W,fragmentShader:Y,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,side:e.DoubleSide}),R=new e.Mesh(I(),M);R.name="lamp-glow",R.renderOrder=5,s.add(R),await t.yield();const b=o-14.3,F=o-8.2,ce=[[5,1.4],[5,.4],[5.07,.16],[5.26,.03],[5.5,.05],[5.72,.2],[5.84,.48],[5.8,.8],[5.7,1.05],[5.7,b],[5.62,b+1],[5.3,b+2.1],[4.6,b+3.3],[3.6,b+4.4],[2.7,b+5.3],[2.1,F],[1.82,F+.9],[1.68,F+1.9],[1.62,F+3.2],[1.6,o-1.9],[1.75,o-1.75],[2.2,o-1.55],[2.34,o-1.2],[2.34,o-.7],[2.2,o-.3],[1.8,o-.08],[1.6,o]],J=q(ce,72);J.rotateX(-Math.PI/2),J.translate(0,O,0);const _=new e.Color(Ge),me=new e.Vector3(d/h,H/h,p/h),de=c.mat({name:"hero-bottle",side:e.DoubleSide,uniforms:{uFlameL:{value:me},uGreen:{value:new e.Vector3(_.r,_.g,_.b)},uAxisY:{value:O},uBL:{value:o}},vpars:"varying vec3 vNo, vVo;",vert:"vNo=n; vVo=(inverse(modelMatrix)*vec4(cameraPosition,1.)).xyz-p;",pars:"uniform vec3 uFlameL, uGreen; uniform float uAxisY, uBL; varying vec3 vNo, vVo;",surface:`{ vec3 pl=vG; float a=-pl.z; vec3 axp=vec3(0.,uAxisY,pl.z);
      // all in the part's own space: rad across the axis, Vo to the eye, Lf to the flame, dv the eye's direction across the axis
      vec3 rad=pl-axp; float rr=length(rad); rad/=max(rr,1e-3);
      vec3 No=normalize(vNo); if(!gl_FrontFacing) No=-No;
      vec3 Vo=normalize(vVo), Lf=normalize(uFlameL-pl);
      vec3 dv=Vo-vec3(0.,0.,Vo.z); dv/=max(length(dv),1e-3);
      float fl=length(uLampCol)/3.2;
      float ndv=clamp(dot(No,Vo),0.,1.), edge=1.-ndv;
      float glass=smoothstep(.9,1.5,a);
      // the wall behind this one, seen through it: its outward normal
      vec3 Nf=rad-2.*dot(rad,dv)*dv;
      // the lamp on the near wall (it soaks in and wraps), on the far wall (showing through), and straight through the bottle
      float nearL=clamp(dot(No,Lf)*.6+.4,0.,1.), farL=clamp(dot(Nf,Lf),0.,1.), back=clamp(dot(-Vo,Lf),0.,1.);
      float lit=.16+.6*nearL*nearL+.5*farL+.9*back*back*back;
      // A SLOW TURNING GREEN MIST within, laid a few metres behind the wall along the sight so that it gives no depth to read:
      // it turns about the bottle's axis once in two minutes and drifts along it; no shape is in it. It has a soft sea light
      // of its own that swells and sinks on the world's clock (two slow swells, 11 and 13.7 s, never a flash)
      float ta=uTime*.052; vec3 pc=pl-Vo*3.5; pc.y-=uAxisY; pc.xy=mat2(cos(ta),-sin(ta),sin(ta),cos(ta))*pc.xy;
      float cloud=fbm3(pc*.21+vec3(3.1,7.7,1.3+uTime*.02)), mist=fbm3(pc*.1+vec3(9.3,2.1,-uTime*.03));
      float swell=.5+.3*sin(uTime*.5712)+.2*sin(uTime*.4586+1.3);
      // seeds (small bubbles) and a few striae drawn round the body
      float seed=smoothstep(.84,.9,vn3(pl*1.9)), ang=atan(rad.y,rad.x);
      float stria=(1.-smoothstep(.0,.035,abs(vn(vec2(ang*1.3+a*.22,a*.55))-.5)))*.5;
      // glass seen edge-on is deeper: the outline darker and thicker
      float thin=1.-smoothstep(.3,.95,edge), outline=smoothstep(.3,.9,edge);
      vec3 clear=vec3(.02,.4,.085), deep=vec3(.003,.05,.016);
      // (the mist's billows are lighter, the lanes between them deeper)
      vec3 body=mix(deep,clear,smoothstep(.1,1.5,lit*(.55+.6*thin)*(.72+.5*cloud)))*(1.-.85*outline)*(.4+.9*smoothstep(.4,.6,mist));
      alb=vec3(.01,.035,.02); gloss=.45; wrap=.1;
      // (a lantern of green glass: the lamp's light in the wall, and the mist's own soft light behind it)
      emis=body*fl*(1.+.3*lit)*glass*(1.+.8*seed-.3*stria);
      emis+=vec3(.0,.3,.17)*(.3+.7*swell)*smoothstep(.3,.8,mist)*glass*(1.-.75*outline)*1.3;
      // WHAT STANDS BEHIND THE GLASS IS SEEN THROUGH IT, BENT BY THE ROUND WALL: the sight is turned toward the axis by the
      // wall's slant where it enters; where the bent sight goes by the lamp's flame, the flame shows, and where it goes by the
      // chimney's upright, a paler column
      { vec3 sd=normalize(-Vo-.12*(No-dot(No,Vo)*Vo)); vec3 fo=uFlameL-pl; float tf=max(dot(fo,sd),0.); vec3 off=fo-sd*tf;
        float fx=length(off.xz), up=-off.y, far=smoothstep(8.,16.,tf)*step(0.,dot(No,Vo));
        float flameI=exp(-fx*fx/20.-up*up/30.), chimI=exp(-fx*fx/40.)*smoothstep(-7.,-3.5,up)*(1.-smoothstep(9.,14.,up));
        // (a green gold lantern: the flame itself a small gold heart, its glow through the glass green gold round it)
        float heart=exp(-fx*fx/2.5-up*up/5.);
        emis+=(vec3(.5,.95,.2)*.95*flameI+vec3(1.,.9,.36)*1.1*heart+vec3(.6,.72,.28)*.4*chimI)*fl*glass*far*(1.-.7*outline); }
      // the lamp's second long highlight: its light thrown back by the inside of the far wall
      vec3 H=normalize(Lf+Vo), Hp=H-vec3(0.,0.,H.z); Hp/=max(length(Hp),1e-3);
      float h2=pow(clamp(dot(-Nf,Hp),0.,1.),420.)*smoothstep(1.2,2.4,a)*(1.-smoothstep(uBL-15.2,uBL-13.6,a));
      emis+=vec3(.95,1.,.55)*fl*.9*h2*(1.-.6*outline);
      // and its first: the flame itself mirrored in the near wall, a long thin line down the body and the neck
      float h1=pow(clamp(dot(No,Hp),0.,1.),700.)*smoothstep(1.2,2.4,a)*step(0.,dot(No,Lf));
      emis+=vec3(1.,.93,.66)*fl*1.2*h1;
      // the lamp come THROUGH the glass: a long gold-green line on the flank turned from the flame, where the ray from the flame
      // through the bottle's axis leaves the glass (placed by the flame and the glass, never by the eye); it slides with the flame
      vec3 ex=vec3(axp.xy-uFlameL.xy,0.); ex/=max(length(ex),1e-3);
      float slide=.25*sin(uTime*2.3)+.1*sin(uTime*7.9);
      float d=acos(clamp(dot(rad,ex),-1.,1.))*5.7+slide*.4;
      float core=(1.-smoothstep(.3,.8,abs(d)))*smoothstep(1.4,2.6,a)*(1.-smoothstep(uBL-15.4,uBL-14.2,a));
      float halo=exp(-abs(d)/3.2)*smoothstep(.9,1.6,a)*(1.-smoothstep(uBL-14.6,uBL-13.2,a));
      emis+=vec3(.7,.85,.25)*.5*fl*core+vec3(.12,.5,.2)*fl*.2*halo;
      // a thin line of it along the neck
      emis+=vec3(1.1,.98,.5)*fl*.7*(1.-smoothstep(.1,.36,abs(d)*rr/5.7))*smoothstep(uBL-8.,uBL-7.,a)*(1.-smoothstep(uBL-2.2,uBL-1.8,a));
      // the base ring's rolled edge is bright all round, with the lamp as a crescent on its arc toward the flame
      vec3 Hc=normalize(Lf+vec3(0.,0.,1.));
      float ring=1.-smoothstep(.55,1.1,a);
      emis+=uGreen*fl*ring*(2.2*pow(clamp(dot(No,Hc),0.,1.),18.)+.5+.34*clamp(dot(rad,-ex),0.,1.)); }`}),ne=new e.Mesh(J,de);ne.name="bottle",r.add(ne),await t.yield();const K=oe(),ee="#7a1210",pe=L(0,O,0,-Math.PI/2,0,0);K.add(new e.CylinderGeometry(1.5,1.5,4.4,24),L(0,O,-(o+1.2),Math.PI/2,0,0),"#e3cfa2"),K.add(q([[1.52,o+2.5],[1.74,o+2.62],[1.76,o+3.1],[1.55,o+3.5],[.9,o+3.7],[0,o+3.75]],28),pe,ee);for(const[i,f]of[[.5,2.6],[2.4,1.2],[4.3,3.6]]){const w=(y,k)=>[Math.cos(i)*y,O+Math.sin(i)*y,-k];K.add(Te([w(1.72,o+2.75),w(1.62,o+1.4),w(1.86,o+.08),w(2.42,o-.6),w(2.36,o-1.3),w(1.82,o-1.95),w(1.7,o-2.2-f*.5),w(1.68,o-2.2-f)],.27,28,7),null,ee),K.add(new e.SphereGeometry(.4,10,8),L(...w(1.72,o-2.2-f),0,0,0,1,1,1.5),ee),await t.yield()}const ve=c.mat({name:"hero-plain",vertexColors:!0,surface:"{ float sp=vn3(vG*2.3); float wx=step(vC.g,.2); alb*=mix(.8+.35*sp*vn3(vG*9.),.85+.3*sp,wx); gloss=mix(.12,.75,wx); emis=alb*uLampCol*.06; }"}),le=new e.Mesh(K.build(),ve);le.name="cork",r.add(le),await t.yield();const V=oe(),te=b-1.4,$=te+5;V.add(new e.BoxGeometry(9,.8,$),L(0,.4,-(1+$/2)),"#4a2a17",{g:"z"});const A=new e.Shape;A.moveTo(-6.2,0),A.lineTo(6.2,0),A.lineTo(6.2,5.6),A.lineTo(5.9,6),A.lineTo(5.41,6),A.absarc(0,O,5.76,-.354,Math.PI+.354,!0),A.lineTo(-5.9,6),A.lineTo(-6.2,5.6),A.lineTo(-6.2,0),await t.yield();const se=new e.ExtrudeGeometry(A,{depth:1.1,bevelEnabled:!0,bevelSize:.3,bevelThickness:.3,bevelSegments:3,curveSegments:28});await t.yield(),V.add(se.clone(),L(0,.6,-4-.55),"#56311b",{g:"x"}),await t.yield(),V.add(se,L(0,.6,-te-.55),"#56311b",{g:"x"}),await t.yield();for(const i of[-4,-te])for(const f of[-1,1])V.add(new e.CylinderGeometry(.95,.95,1.9,18),L(f*6.05,6.75,i,Math.PI/2,0,0),"#5c351d");for(const i of[-1,1]){V.add(new e.BoxGeometry(.7,.5,$+.6),L(i*4.75,.95,-(1+$/2)),"#56311b",{g:"z"});for(const f of[-2.2,-($-.2)])V.add(q([[0,0],[.9,0],[1.05,.25],[.8,.5],[0,.5]],14),L(i*3.6,0,f),"#3e2413")}await t.yield();const we=c.mat({name:"hero-walnut",vertexColors:!0,grain:!0,pars:Se,uniforms:{uGrain:{value:.55},uWoodGloss:{value:.5}},surface:fe.wood}),ie=new e.Mesh(V.build(),we);ie.name="cradle",r.add(ie),await t.yield();const re=3,ge=i=>{const f=(y,k,N)=>{const S=Math.min(1,Math.max(0,(N-y)/(k-y)));return S*S*(3-2*S)},w=5.7+-3.6500000000000004*f(b+.4,F+.2,i);return w+(1.62-w)*f(F,F+2.6,i)},z=(()=>{let i=0,f=0,w=0;for(let y=0;y<=o;y+=.5){const k=-d/h,N=-y-p/h,S=Math.hypot(k,N),B=ge(y)*(1+re);i=Math.max(i,k/S*B),f=Math.min(f,-y+N/S*B,-y),w=Math.max(w,-y)}return[(i+1)/2,(f+w)/2-.5,(i+1)/2,(w-f)/2+1]})(),D=new e.BufferGeometry;{const i=[],f=[],w=[],y=[],k=(N,S,B,j,Q)=>{const U=i.length/3;i.push(N-B,.09,S-j,N+B,.09,S-j,N+B,.09,S+j,N-B,.09,S+j),f.push(-1,-1,1,-1,1,1,-1,1),w.push(Q,Q,Q,Q),y.push(U,U+2,U+1,U,U+3,U+2)};k(z[0],z[1],z[2],z[3],0),k(0,-(b/2+2.5),6.6,b/2+2,1),D.boundingSphere=new e.Sphere(new e.Vector3(z[0],0,z[1]),Math.hypot(z[2],z[3])+2),D.setAttribute("position",new e.Float32BufferAttribute(i,3)),D.setAttribute("uv",new e.Float32BufferAttribute(f,2)),D.setAttribute("aK",new e.Float32BufferAttribute(w,1)),D.setIndex(y)}const xe=new e.ShaderMaterial({transparent:!0,depthWrite:!1,blending:e.CustomBlending,blendEquation:e.AddEquation,blendSrc:e.OneFactor,blendDst:e.OneMinusSrcAlphaFactor,blendSrcAlpha:e.ZeroFactor,blendDstAlpha:e.OneFactor,polygonOffset:!0,polygonOffsetFactor:-4,polygonOffsetUnits:-8,uniforms:{...e.UniformsUtils.clone(e.UniformsLib.fog),uTime:c.u.uTime,uLampCol:c.u.uLampCol,uGreen:{value:new e.Vector3(_.r,_.g,_.b)},uRest:{value:c.u.uLampCol.value.length()},uLampL:{value:new e.Vector2(d/h,p/h)},uBL:{value:o},uThrow:{value:re},uPaper:{value:new e.Vector4(...n.paper||[-1e4,1e4,-1e4,1e4])}},fog:!0,vertexShader:`attribute float aK; varying vec2 vUv, vM, vWp; varying float vK;
      #include <fog_pars_vertex>
      void main(){ vUv=uv; vK=aK; vM=position.xz; vWp=(modelMatrix*vec4(position,1.)).xz; vec4 mvPosition=modelViewMatrix*vec4(position,1.); gl_Position=projectionMatrix*mvPosition;
      #include <fog_vertex>
      }`,fragmentShader:`uniform float uTime, uRest, uBL, uThrow; uniform vec3 uLampCol, uGreen; uniform vec2 uLampL; uniform vec4 uPaper; varying vec2 vUv, vM, vWp; varying float vK;
      // the glass's radius at a station of the axis (a metres behind the base plane): body, shoulder, neck, lip
      float rad(float a){ float sh0=uBL-14.3, nk=uBL-8.2;
        float r=mix(5.7,2.05,smoothstep(sh0+.4,nk+.2,a)); r=mix(r,1.62,smoothstep(nk,nk+2.6,a));
        return r+.7*(smoothstep(uBL-2.,uBL-1.4,a)-smoothstep(uBL-.7,uBL,a)); }
      #include <fog_pars_fragment>
      ${ue}
      float vor(vec2 p, float t){ vec2 i=floor(p), f=fract(p); float d1=9., d2=9.;
        for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){ vec2 g=vec2(float(x),float(y)); vec2 o=vec2(h21(i+g),h21(i+g+7.7)); o=.5+.4*sin(t+6.2832*o);
          float d=length(g+o-f); if(d<d1){ d2=d1; d1=d; } else if(d<d2) d2=d; }
        return d2-d1; }
      void main(){ float e=length(vUv); float fl=length(uLampCol)/uRest; float t=uTime*1.5+2.*(fl-1.)*6.;
        vec2 p=vM*vec2(.42,.5); p+=.55*vec2(sin(p.y*1.3+uTime*1.2),cos(p.x*1.1-uTime*.9));
        float n1=1.-smoothstep(.02,.16,vor(p,t)), n2=1.-smoothstep(.02,.2,vor(p*1.9+3.1,t*1.3+1.));
        float net=n1*1.1+n2*.55+.22;
        float m=(1.-smoothstep(.2,1.,e))*.3, sh=0.;
        if(vK<.5){
          // the line from the lamp's place through this point of the paper: where it crosses the axis, and how far beyond
          vec2 dl=vM-uLampL; float k0=clamp(-uLampL.x/max(dl.x,1e-3),0.,1.);
          float a0=-(uLampL.y+k0*dl.y), s=(1.-k0)*length(dl), r=rad(a0), w=(s-r)/(uThrow*r);
          float inA=smoothstep(.3,1.1,a0)*(1.-smoothstep(uBL-.4,uBL,a0));
          float env=smoothstep(-.12,.03,w)*(1.-smoothstep(.9,1.,w));
          float cw=(w-.42-.09*sin(a0*.8+uTime*1.7)-.05*sin(a0*2.1-uTime*2.6))/.1, rw=(w-.9-.03*sin(a0*1.3+uTime*2.1))/.06;
          float core=exp(-min(cw*cw,30.)), rim=exp(-min(rw*rw,30.));
          vec2 pe=min(vWp-uPaper.xz,uPaper.yw-vWp);
          float on=inA*env*smoothstep(0.,1.2,min(pe.x,pe.y));
          m=on*(.3+1.7*net+1.4*core+1.*rim)*(1.-.35*smoothstep(.3,1.,w)); sh=.5*on; }
        // thrown light keeps the glass's green: less red and blue than the glow under the cradle
        gl_FragColor=vec4(uGreen*(vK<.5?vec3(.5,1.,.62):vec3(1.))*m*fl,sh);
        #ifdef FOG_EXP2
        gl_FragColor.rgb*=exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
        #endif
      }`}),ae=new e.Mesh(D,xe);ae.name="caustic",ae.renderOrder=3,r.add(ae);const ye=new e.Vector3(.1,.9,.55).multiplyScalar(n.greenGain??3),be={portalCentre:new e.Vector3(0,O*h,0),exitDir:new e.Vector3(0,0,-1),flame:new e.Vector3(d,H,p),lampAxis:new e.Vector3(d,0,p),causticCentre:new e.Vector3(z[0]*h,0,z[1]*h),caustic:z.map(i=>i*h),mothRing:{centre:new e.Vector3(d,0,p),radiusMin:8,radiusMax:10,yMin:12,yMax:22}};return{object:s,radius:58,height:26,center:new e.Vector3(x[0]*.5,9,x[2]*.5-6),anchors:be,lib:c,ground:!0,groundY:0,flicker:he,update(i,f){c.setTime(f),c.u.uGreenCol.value.copy(ye).multiplyScalar(.72+.28*(.5+.3*Math.sin(f*.5712)+.2*Math.sin(f*.4586+1.3)))},dispose(){}}}export{Le as GLSL_LIGHT,ue as GLSL_NOISE,L as M4,C as NOCC,fe as SURF,Se as WOOD_PARS,Ae as buildHero,he as flickerAt,q as lathe,oe as makeBuilder,ze as makeLib,Te as tube};
