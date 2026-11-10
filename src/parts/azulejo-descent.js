import*as i from"three";const Ve=["#F3F1E7","#B4C8EA","#3E6DC2","#142E7C","#C8962E","#5C3A68","#F2C312"],Ne=.14,aa=`
#define TILE 0.14
uniform vec3 uTin, uPale, uMid, uDeep, uOchre, uMang, uYel, uSun;
uniform vec2 uCamSway;
uniform float uTime, uU;
uniform vec4 uPanel;   // sea panel: length, height, border width, travel sign
uniform vec4 uSd;      // per-seed randoms
uniform vec4 uFig[4];  // lead, 2nd, 3rd caravel, whale: x, y, rotation, scale (panel metres, snapped to tiles)
uniform vec4 uFigB;    // whale blow 0..1, fleet step, cast, fish base x
uniform vec3 uFloor, uWash, uWash2;   // darkest value, shade wash, slot wash (multipliers)
uniform vec4 uWorld;   // painted birds offset (m), rain 0..1, dusk glow 0..1, birds kind (0 swallows, 1 sardines)
uniform vec4 uCat;     // frieze cat: x, y, direction, tone (0 white, 1 cobalt)
uniform vec4 uRare;    // roaming whale on pic 15 surfaces: x, y, rotation, scale (0 = off)
uniform vec4 uSky;     // rain bank (2 = the shower overhead), sun glow, cloud drift, warm morning horizon
uniform vec4 uOpt;     // border swap (ochre <-> manganese, borders only), long morning hatching, wet strength, day sky depth (0 at dusk)
uniform vec4 uWarm;    // warm accents: share of near windows lit in tram yellow, share of far windows lit, depth of the shade on faces turned from the sun, gold on the lead ship
varying vec2 vTile; varying float vPic, vBorder, vSeed, vShade; varying vec3 vWN, vWP;
float gAA, gDet, gPat, gLit; vec3 gOc, gMg, gEm;
float h11(float n){ return fract(sin(n*12.9898+4.137)*43758.5453); }
float h21(vec2 p){ p=fract(p*vec2(.1031,.1030)); p+=dot(p,p.yx+33.33); return fract((p.x+p.y)*p.y); }
float vn(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x),mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x),f.y); }
float fl(float d){ return 1.-smoothstep(-gAA,gAA,d); }
float ln(float d,float w){ return (1.-smoothstep(w-gAA,w+gAA,abs(d)))*min(1.,(w+w)/(gAA+1e-5)); }
float br(vec2 p){ return mix(.86,.7+.32*vn(p*vec2(2.3,17.)),clamp(1.-gAA/.05,0.,1.)); }
float seg(vec2 p,vec2 a,vec2 b){ vec2 pa=p-a,ba=b-a; float h=clamp(dot(pa,ba)/max(dot(ba,ba),1e-5),0.,1.); return length(pa-ba*h); }
float edge(vec2 p,vec2 a,vec2 b){ vec2 e=b-a; return dot(p-a,vec2(e.y,-e.x))/max(length(e),1e-5); }
float tri(vec2 p,vec2 a,vec2 b,vec2 c){ return max(edge(p,a,b),max(edge(p,b,c),edge(p,c,a))); }
vec2 rot(vec2 p,float a){ float c=cos(a),s=sin(a); return vec2(c*p.x+s*p.y,-s*p.x+c*p.y); }
float ang(vec2 v){ return atan(v.y,abs(v.x)<1e-5?1e-5:v.x); }
`,ta=`
vec3 borderOrn(float al,float ac,float w){   // al metres along, ac metres across (0 outer .. w inner)
  vec3 c=mix(uTin,uPale,.22*br(vec2(al,ac*3.)));
  float a01=ac/w;
  c=mix(c,gMg,ln(ac-.09*w,.035)); c=mix(c,gMg,ln(ac-.91*w,.035));
  c=mix(c,gOc,.9*ln(ac-.17*w,.018)); c=mix(c,gOc,.9*ln(ac-.83*w,.018));
  float per=w*1.25; float k=al/per; float cell=floor(k); float u=fract(k)-.5;
  float sgn=mod(cell,2.)<.5?1.:-1.;
  vec2 v=vec2(u*per,(a01-.5)*w-sgn*.05*w);
  float r=length(v)/w;
  float vine=(a01-.5)*w-.2*w*sin(k*3.14159);
  c=mix(c,gOc,ln(vine,.03*w/.5)*smoothstep(.2,.26,r));
  float sp=fract(ang(v)*sgn/6.2832+r*3.6);
  float vol=ln((sp-.5)*w*.27,.028*w/.5)*(1.-smoothstep(.2,.24,r));
  c=mix(c,gOc,vol*br(v*2.)); c=mix(c,gOc,fl(length(v)-.035*w/.5*1.6));
  vec2 lf=vec2(abs(u)*per-.36*per,(a01-.5)*w+sgn*.2*w);            // acanthus dabs between volutes
  c=mix(c,gOc,.85*fl(length(lf*vec2(.55,1.))-.07*w));
  c=mix(c,gMg,.8*fl(length(lf*vec2(.55,1.))-.028*w));
  float bd=length(vec2((fract(al/(w*.2))-.5)*w*.2,ac-.955*w));    // bead row on the picture side
  c=mix(c,uDeep,.8*fl(bd-.022*w/.5));
  return c;
}
vec3 fieldPic(float id,vec2 p,float sd){
  vec3 c=uTin, av=uTin; float pf=clamp(gPat,0.,1.);
  if(id<.5){                                    // plain tile, corner sprigs
    vec2 q=abs(fract(p/TILE)-.5)*TILE; float d=length(q-vec2(.07))-.018;
    c=mix(c,uMid,.7*fl(d)*gDet); c=mix(c,uPale,.5*ln(length(q)-.03,.006)*gDet);
    vec2 mq=(fract(p/vec2(2.24,3.36)+vec2(.5,.2))-.5)*vec2(2.24,3.36);          // an albarrada every sixteen tiles: a vase of flowers in a lobed frame
    float md=length(mq*vec2(1.2,1.))-.98+.07*cos(ang(mq)*8.);
    c=mix(c,mix(uTin,uPale,.3+.2*br(p*2.)),fl(md)); c=mix(c,uMid,ln(md,.05)); c=mix(c,uDeep,ln(md+.13,.018));
    float vs=min(length((mq-vec2(0.,-.42))*vec2(1.,.8))-.22,max(abs(mq.x)-.07-.5*max(mq.y+.2,0.)*max(mq.y+.2,0.),abs(mq.y+.12)-.14));
    vs=min(vs,max(abs(mq.x)-.13,abs(mq.y+.7)-.035));
    float stm=min(seg(mq,vec2(0.,0.),vec2(0.,.4)),min(seg(mq,vec2(0.,0.),vec2(-.32,.2)),seg(mq,vec2(0.,0.),vec2(.32,.2))));
    c=mix(c,uMid,ln(stm,.022));
    float flw=min(length(mq-vec2(0.,.48))-.17,min(length(mq-vec2(-.38,.24))-.14,length(mq-vec2(.38,.24))-.14));
    c=mix(c,uMid,fl(flw)*br(p*4.)); c=mix(c,uDeep,ln(flw,.02)); c=mix(c,uTin,fl(flw+.09));
    c=mix(c,uPale,.9*fl(min(length((mq-vec2(-.2,-.02))*vec2(1.,2.2))-.1,length((mq-vec2(.2,-.02))*vec2(1.,2.2))-.1)));
    c=mix(c,mix(uMid,uDeep,.5),fl(vs)); c=mix(c,uTin,.8*ln(mq.y+.42,.02)*fl(vs+.03)); c=mix(c,uDeep,ln(vs,.02));
    av=mix(uTin,uPale,.2); c=mix(av,c,clamp(2.24/max(gAA,1e-4)/14.,0.,1.));
  } else if(id<2.5){                            // star diaper over 2x2 tiles
    vec2 q=fract(p/(TILE*2.)+.5)-.5; vec2 a=abs(q); float r=length(q);
    float star=min(a.x,a.y)*1.9+max(a.x,a.y)*.55-.21;
    c=mix(c,uPale,fl(star*.28)*br(p*3.)); c=mix(c,uMid,ln(star*.28,.012));
    c=mix(c,uDeep,fl((r-.085)*.28)); c=mix(c,uMid,ln((abs(a.x-a.y)-.0)*.2,.008)*smoothstep(.3,.42,r));
    c=mix(c,uMid,fl((length(a-.5)-.13)*.28)); c=mix(c,uTin,fl((length(a-.5)-.06)*.28));
    av=mix(uTin,uMid,.3); c=mix(av,c,pf);
    vec2 mq=abs(fract(vec2(p.x+p.y,p.x-p.y)/3.36)-.5)*3.36; float md=min(mq.x,mq.y);
    c=mix(c,uTin,.8*ln(md,.2)); c=mix(c,uMid,ln(md-.2,.035)); c=mix(c,uDeep,fl(length(mq)-.3));
  } else if(id<3.5){                            // diagonal lattice with knots
    vec2 q=vec2(p.x+p.y,p.x-p.y)/(TILE*2.); vec2 f=abs(fract(q)-.5);
    c=mix(c,uPale,.8*ln(min(f.x,f.y)*.2,.02)*br(p*2.)); c=mix(c,uMid,ln(min(f.x,f.y)*.2,.007));
    c=mix(c,uDeep,fl((length(f)-.11)*.2)); c=mix(c,uMid,.6*fl((length(f-.5)-.16)*.2)*br(p*4.));
    av=mix(uTin,uPale,.55); c=mix(av,c,pf);
    vec2 mq=abs(fract(p/vec2(2.24,3.36))-.5)*vec2(2.24,3.36); float md=length(mq*vec2(1.5,1.))-.9;
    c=mix(c,mix(uTin,uPale,.2),fl(md)); c=mix(c,uMid,ln(md,.05)); c=mix(c,uMid,ln(md+.22,.02)); c=mix(c,uDeep,fl(length(mq)-.16));
  } else if(id<4.5){                            // wave paving, wet
    float y=p.y+.42*sin(p.x*1.9)+.1*sin(p.x*5.3); float s=abs(fract(y/1.1)-.5)*1.1-.27;
    float bpx=.2/max(gAA,1e-4); vec3 dkp=mix(mix(uMid,uDeep,.45),uDeep,smoothstep(5.,16.,bpx)), ltp=mix(uPale,uTin,.3*smoothstep(5.,16.,bpx));
    c=mix(ltp,dkp,fl(s)*(.82+.18*br(p))); c=mix(mix(uPale,mix(uMid,uDeep,.3),.42),c,.38+.62*smoothstep(.45,4.,bpx));   // bold under the wheels, a calm cobalt wash far off
  } else if(id<5.5){                            // fish-scale roof
    vec2 q=p/vec2(.3,.24); float row=floor(q.y); q.x+=.5*mod(row,2.); vec2 f=vec2(fract(q.x)-.5,fract(q.y));
    float d=length(vec2(f.x,f.y-1.)*vec2(1.,.8))-.5;
    c=mix(uPale,uMid,.55+.45*h21(vec2(floor(q.x),row)+sd)); c=mix(c,uDeep,.7*ln(d*.24,.012));
    c=mix(c,uTin,.45*(1.-smoothstep(0.,.3,f.y))*step(d,0.));
    vec3 far5=mix(mix(uPale,uMid,.82+.18*h11(sd*57.)),uDeep,.16+.5*ln((fract(p.y/1.44)-.5)*1.44,.16));   // far off: mid cobalt with deep courses
    c=mix(far5,c,clamp(gPat*1.5,0.,1.));
  } else if(id<6.5){                            // solid glaze
    c=sd<.2?uPale:sd<.4?uMid:sd<.6?uDeep:sd<.8?uOchre:uMang; c*=(.9+.14*br(p*2.))*(.84+.3*vn(p*1.3+sd*9.));
    c=mix(c,c*.68,.55*smoothstep(.56,.68,vn(p*6.))*clamp(1.-gAA/.08,0.,1.));   // stippled brushwork
  } else if(id<7.5){ c=uYel*(.9+.12*br(p*2.));
  } else if(id<8.5){                            // sky wash: broad horizontal strokes
    c=mix(uTin,uPale,clamp(.5+.5*sin(p.y*.02)+.25*(vn(p*vec2(.004,.05))-.5),0.,1.)*.8);
  } else {                                      // crest cartouche: armillary rings, rays, scroll field
    vec2 q=p-vec2(0.,3.1); float r=length(q);
    c=mix(c,uPale,.5*br(p*1.5)*(1.-smoothstep(1.,4.5,r)));
    float rays=abs(fract(ang(q)/6.2832*16.)-.5);
    c=mix(c,uPale,.8*fl((rays-.2)*r*.39)*smoothstep(1.8,2.,r)*(1.-smoothstep(2.6,3.3,r)));
    c=mix(c,uMid,ln(r-1.55,.06)); c=mix(c,uDeep,ln(r-1.75,.03));
    c=mix(c,uTin,fl(r-1.5));
    c=mix(c,uMid,ln(length(q*vec2(2.6,1.))-1.4,.05)); c=mix(c,uMid,ln(length(q*vec2(1.,2.6))-1.4,.05));
    c=mix(c,uDeep,ln(abs(q.y+q.x*.42)-.12,.035)*step(r,1.45)); c=mix(c,uDeep,fl(r-.2));
    float sw=p.y-.75-.35*sin(p.x*1.6); c=mix(c,uMid,.8*ln(sw,.05)*smoothstep(2.4,3.2,abs(p.x)));
    vec2 dd=vec2((fract(p.x/.56)-.5)*.56,p.y-.28); c=mix(c,uDeep,.8*fl(length(dd)-.07));
  }
  return c;
}
`,ca=`
vec3 sailP(vec2 q,float mx,float y0,float y1,float hw,float belly){
  float t=clamp((q.y-y0)/(y1-y0),0.,1.);
  float xs=q.x-mx-.3-belly*sin(3.14159*t); float w=hw*(1.-.2*t); float n=xs/w;
  float foot=y0+.55*(1.-min(1.,n*n));
  return vec3(max(abs(xs)-w,max(foot-q.y,q.y-y1)),n,t);
}
float sheerY(float x){ return 1.2+.03*x*x+.85*(1.-smoothstep(-3.3,-2.4,x))+.4*smoothstep(4.,5.,x); }
vec4 shipD(vec2 q){
  float x=q.x,y=q.y;
  float dH=max(max(y-sheerY(x),-1.2+.02*x*x-y),max(-6.-.08*y-x,x-5.3-.5*y));
  float dM=sailP(q,.4,3.3,9.7,2.7,1.1).x, dF=sailP(q,3.7,3.5,7.7,1.9,.85).x;
  if(uFigB.z>.5&&uFigB.z<1.5){ float dL=tri(q,vec2(-5.2,2.6),vec2(5.9,3.1),vec2(-1.5,11.6)); return vec4(dH,dL,dL,dL); }   // fishing boats: one lateen sail
  float dZ=tri(q,vec2(-6.4,3.9),vec2(-2.9,2.9),vec2(-2.5,8.7));
  return vec4(dH,dM,dF,dZ);
}
float shipSil(vec2 q){ if(abs(q.x)>8.||q.y<-1.5||q.y>11.6) return 0.; vec4 D=shipD(q); return step(min(min(D.x,D.y),min(D.z,D.w)),0.); }
void paintSail(inout vec3 c,inout float a,vec3 S,float emb,vec2 q){
  float f=fl(S.x);
  vec3 s=mix(uTin,uPale,(.62*(1.-smoothstep(-1.,-.1,S.y))+.2*(1.-smoothstep(0.,.25,S.z)))*br(q*1.4));
  s=mix(s,uPale,.7*ln((fract(S.y*2.5+.5)-.5)*.6,.014));
  float cx=abs(S.y),cy=abs(S.z-.52)*2.;
  float k=min(max(cx-.09-.3*cy,cy-.6),max(cy-.09-.3*cx,cx-.6));
  float em=emb<.5?fl(k*1.4):step(.5,fract(S.y*1.5+.25))*.75;
  s=mix(s,gEm,em*br(q*2.+3.));
  c=mix(c,s,f); c=mix(c,uDeep,ln(S.x,.055)); a=max(a,fl(S.x-.06));
}
vec4 lateen(vec2 q){                               // a fishing boat under one lateen sail, an eye painted at the bow
  float x=q.x,y=q.y; vec4 D=shipD(q);
  float rig=min(seg(q,vec2(.6,1.),vec2(.6,8.8)),seg(q,vec2(6.2,2.8),vec2(-1.8,12.)));
  vec3 c=uDeep; float a=max(ln(rig,.075),.8*ln(seg(q,vec2(.6,8.8),vec2(-5.9,2.3)),.03));
  paintSail(c,a,vec3(D.y,(x+.3)/5.,clamp((y-2.6)/9.,0.,1.)),1.,q);
  float e=sheerY(x)-y, f=fl(D.x); vec3 h=uTin;
  h=mix(h,uMid,(smoothstep(.42,.5,e)-smoothstep(.85,.93,e))*br(q*1.7));
  h=mix(h,uPale,smoothstep(1.35,1.6,e)*br(q*1.2+7.));
  h=mix(h,uDeep,max(ln(e-.42,.03),ln(e-.9,.03)));
  vec2 ey=q-vec2(4.2,sheerY(4.2)-.68); h=mix(h,uTin,fl(length(ey*vec2(.6,1.))-.24)); h=mix(h,uDeep,max(ln(length(ey*vec2(.6,1.))-.24,.03),fl(length(ey)-.1)));
  h=mix(h,uMid,.8*ln(seg(q,vec2(-5.2,sheerY(-5.2)-.2),vec2(-1.,sheerY(-1.)-.5))-.0,.05)*step(.5,fract(x*2.2)));   // nets hung to dry
  c=mix(c,h,f); c=mix(c,uDeep,ln(D.x,.065)); a=max(a,fl(D.x-.07));
  vec2 v=q-vec2(6.05,.15); float r=length(v);
  float foam=fl(r-.7); c=mix(c,uTin,foam); c=mix(c,uMid,foam*ln((fract(ang(v)/6.2832+r*1.25)-.5)*.6,.05));
  c=mix(c,uDeep,ln(r-.7,.045)); a=max(a,fl(r-.75));
  return vec4(c,a);
}
vec4 caravel(vec2 q,float id){
  if(abs(q.x)>9.2||q.y<-1.8||q.y>12.8) return vec4(0.);
  float ld=step(id,.5)*uWarm.w; gEm=mix(uMid,mix(uOchre,uYel,.3),ld);        // the lead ship carries the gold: her cross, her waist band, her pennant
  if(uFigB.z>.5&&uFigB.z<1.5) return lateen(q);
  float x=q.x,y=q.y; vec4 D=shipD(q); float emb=uFigB.z>1.5?0.:step(.6,fract(uSd.y+id*.37));
  float rig=min(min(seg(q,vec2(.4,1.),vec2(.4,11.3)),seg(q,vec2(3.7,1.2),vec2(3.7,8.8))),seg(q,vec2(-3.6,2.),vec2(-3.6,7.4)));
  rig=min(rig,seg(q,vec2(5.6,2.3),vec2(8.1,3.5)));
  float stay=min(min(seg(q,vec2(.4,11.2),vec2(8.,3.5)),seg(q,vec2(.4,11.2),vec2(-5.9,2.6))),
                 min(seg(q,vec2(3.7,8.7),vec2(8.,3.5)),seg(q,vec2(-6.4,3.9),vec2(-2.5,8.7))));
  vec3 c=uDeep; float a=max(ln(rig,.075),.8*ln(stay,.032));
  float px=x-.4, pw=.32*(1.-px/2.8), py=y-11.-.24*sin(px*2.6-uTime*7.+id*2.)*px*.5;
  float pen=max(abs(py)-pw,max(-px,px-2.8)); c=mix(c,mix(uMid,uYel,ld),fl(pen)); a=max(a,fl(pen-.03));
  float p2=x-3.7, py2=y-8.6-.2*sin(p2*3.-uTime*7.5+id)*p2*.5;
  float pen2=max(abs(py2)-.24*(1.-p2/2.),max(-p2,p2-2.)); c=mix(c,uDeep,fl(pen2)); a=max(a,fl(pen2));
  float nest=max(abs(x-.4)-.36,abs(y-10.05)-.22); c=mix(c,uTin,fl(nest)); c=mix(c,uDeep,ln(nest,.04)); a=max(a,fl(nest-.04));
  vec3 Z=vec3(D.w,(x+3.9)/1.9,clamp((y-2.9)/5.8,0.,1.));
  paintSail(c,a,Z,1.,q);
  paintSail(c,a,sailP(q,3.7,3.5,7.7,1.9,.85),emb,q);
  paintSail(c,a,sailP(q,.4,3.3,9.7,2.7,1.1),emb,q);
  float e=sheerY(x)-y, f=fl(D.x);
  vec3 h=uTin;
  h=mix(h,gEm,(smoothstep(.42,.5,e)-smoothstep(.85,.93,e))*br(q*1.7));
  h=mix(h,uPale,smoothstep(1.35,1.6,e)*br(q*1.2+7.));
  h=mix(h,uDeep,max(ln(e-.42,.03),max(ln(e-.9,.03),ln(e-1.4,.022))));
  h=mix(h,uDeep,fl(length(vec2((fract(x/.95)-.5)*.95,e-.66))-.1)*step(-3.,x)*step(x,4.5));
  vec2 wq=vec2((fract((x+5.75)/.74)-.5)*.74,e-1.18);
  h=mix(h,uDeep,fl(max(abs(wq.x)-.17,abs(wq.y)-.2))*step(x,-3.55)*step(-5.75,x));
  h=mix(h,uMid,ln((fract(x/.3)-.5)*.3,.03)*step(e,.36)*step(.06,e)*step(x,-2.6));   // castle balusters
  c=mix(c,h,f); c=mix(c,uDeep,ln(D.x,.065)); a=max(a,fl(D.x-.07));
  vec2 v=q-vec2(6.05,.15); float r=length(v);                                        // bow scroll
  float foam=fl(r-.85); c=mix(c,uTin,foam); c=mix(c,uMid,foam*ln((fract(ang(v)/6.2832+r*1.25)-.5)*.6,.05));
  c=mix(c,uDeep,ln(r-.85,.045)); a=max(a,fl(r-.9));
  return vec4(c,a);
}
float whaleD(vec2 q){
  float hx=q.x-2., L=hx>0.?8.:12.; float n=clamp(1.-hx*hx/(L*L),0.,1.);
  float th=2.5*sqrt(n)*(hx>0.?1.:.22+.78*n);
  float sp=.9-.014*q.x*q.x;
  float body=max(abs(q.y-sp)-th,abs(q.x)-10.);
  vec2 f=rot(q-vec2(-9.6,-.45),-.45);
  float hh=.3+2.1*smoothstep(0.,2.6,-f.x);
  float fk=max(max(abs(f.y)-hh,max(f.x-.6,-3.-f.x)),-(abs(f.y)-(-f.x-2.1)*1.4));
  return min(body,fk);
}
float whaleSil(vec2 q){ if(abs(q.x)>14.||abs(q.y)>6.) return 0.; return step(whaleD(q),0.); }
vec4 whale(vec2 q){
  if(q.x<-14.||q.x>11.||q.y<-5.||q.y>10.) return vec4(0.);
  float d=whaleD(q), sp=.9-.014*q.x*q.x, f=fl(d);
  float up=q.y-sp;
  vec3 c=mix(uMid,uDeep,.2+.6*smoothstep(-.5,2.2,up)); c=mix(c,uPale,.3*smoothstep(.55,.9,vn(q*vec2(1.2,5.))));
  c=mix(c,uPale,.55*ln((fract(up/.55+.15*sin(q.x*.7))-.5)*.55,.028)*step(-.9,up-.02*q.x));
  float belly=(1.-smoothstep(-1.1,-.6,up-.02*q.x))*step(-3.5,q.x);
  vec3 b=mix(uTin,uPale,.5*ln((fract(up/.36)-.5)*.36,.035)+.2);
  c=mix(c,b,belly); c=mix(c,uMid,belly*ln((fract(up/.36)-.5)*.36,.016));
  c=mix(c,uTin,fl(length(q-vec2(7.3,-.25))-.36)); c=mix(c,uDeep,ln(length(q-vec2(7.3,-.25))-.36,.04)); c=mix(c,uDeep,fl(length(q-vec2(7.4,-.25))-.17));
  c=mix(c,uDeep,ln(seg(q,vec2(9.9,-.75),vec2(6.2,-1.05)),.05));
  c=mix(c,uTin,.9*step(.8,vn(q*5.))*step(6.5,q.x)*step(1.,up));                       // barnacles
  vec2 fq=rot(q-vec2(3.,-2.3),-.55); float fd=length(fq*vec2(.42,1.))-.52;
  c=mix(c,uDeep,ln(d,.085)); float a=fl(d-.09);
  c=mix(c,mix(uMid,uDeep,.5),fl(fd)); c=mix(c,uDeep,ln(fd,.06)); a=max(a,fl(fd-.06));
  float B=uFigB.x;                                                                      // spout
  vec2 v=q-vec2(5.7,3.1); float r=length(v); float an=atan(v.x,max(v.y,1e-3));
  float R=7.*B; float fan=.12+.4*clamp(r/max(R,1e-3),0.,1.);
  float pl=step(1e-3,v.y)*step(r,R)*(1.-smoothstep(fan-.08,fan,abs(an)))*step(.03,B);
  float st=abs(fract(an*5.3+.5)-.5)/5.3*r;
  vec3 pc=mix(uTin,uPale,.5*br(v*2.)); pc=mix(pc,uMid,ln(st,.045)*(.5+.5*sin(r*5.-uTime*14.)));
  c=mix(c,pc,pl*(1.-a)); a=max(a,pl);
  float cap=ln(r-R,.13)*step(1e-3,v.y)*(1.-smoothstep(fan,fan+.25,abs(an)))*step(.03,B);  // scrolled crown
  c=mix(c,uDeep,cap*(1.-f)); a=max(a,cap);
  return vec4(c,a);
}
float serpD(vec2 q){                               // the sea serpent: four humps, a neck and head, a tail tip
  float d=1e3;
  for(int i=0;i<4;i++){ float fi=float(i); d=min(d,max(abs(length(q-vec2(-9.5+fi*4.2,-1.6))-2.1)-(.42+.12*fi),-1.6-q.y)); }
  d=min(d,seg(q,vec2(6.3,-1.6),vec2(7.5,3.))-.85);
  d=min(d,length((q-vec2(8.5,3.5))*vec2(.6,1.))-.95);
  return min(d,tri(q,vec2(-13.6,1.4),vec2(-11.9,-1.6),vec2(-11.2,-.2)));
}
vec4 serpent(vec2 q){
  if(q.x<-14.5||q.x>11.||q.y<-2.2||q.y>6.) return vec4(0.);
  float d=serpD(q);
  vec3 c=mix(uMid,uDeep,.25+.5*vn(q*vec2(.8,1.6)));
  vec2 g=q/vec2(.5,.42); g.x+=.5*mod(floor(g.y),2.); vec2 f=vec2(fract(g.x)-.5,fract(g.y));
  c=mix(c,uPale,.6*ln((length(vec2(f.x,(f.y-1.)*.8))-.5)*.42,.03));
  c=mix(c,uTin,fl(length(q-vec2(8.9,3.75))-.26)); c=mix(c,uDeep,fl(length(q-vec2(9.,3.75))-.12));
  c=mix(c,uDeep,ln(seg(q,vec2(10.1,3.1),vec2(8.3,3.)),.05));
  float cr=tri(vec2(fract(q.x/.9)*.9,q.y),vec2(.1,4.3),vec2(.8,4.3),vec2(.3,5.));           // a crest of spines on the head
  c=mix(c,uDeep,ln(d,.085)); float a=fl(d-.09);
  float ca=fl(cr)*step(7.6,q.x)*step(q.x,9.4); c=mix(c,uDeep,ca*(1.-a)); a=max(a,ca);
  return vec4(c,a);
}
vec4 beast(vec2 q){ if(uFigB.z>1.5) return serpent(q); return whale(q); }
vec4 dolphins(vec2 p){                            // three dolphins leaping ahead of the fishing fleet
  vec3 c=uMid; float a=0.;
  for(int j=0;j<3;j++){
    float fj=float(j); float ph=fract(uTime*.38+fj*.37); float ht=2.6+.6*fj;
    vec2 pos=vec2(uFigB.w+10.+fj*5.5+ph*7.,uFig[0].y-1.4+ht*4.*ph*(1.-ph)); pos=floor(pos/TILE)*TILE;
    vec2 q=rot(p-pos,atan(ht*4.*(1.-2.*ph),7.));
    if(abs(q.x)<2.4&&abs(q.y)<1.6){
      float bd=min(length(q*vec2(1.,3.2))-1.5,length((q-vec2(1.55,-.05))*vec2(1.,2.6))-.42);
      float fin=tri(q,vec2(-.5,.4),vec2(.3,.4),vec2(-.7,1.05));
      float tl=min(tri(q,vec2(-1.3,0.),vec2(-1.75,0.),vec2(-2.1,-.55)),tri(q,vec2(-1.3,0.),vec2(-2.1,.55),vec2(-1.75,0.)));
      float dd=min(min(bd,fin),tl);
      vec3 fc=mix(uMid,uDeep,smoothstep(-.1,.35,q.y)); fc=mix(fc,uTin,(1.-smoothstep(-.3,-.12,q.y))*step(-1.2,q.x));
      fc=mix(fc,uTin,fl(length(q-vec2(1.,.12))-.07)); fc=mix(fc,uDeep,ln(dd,.05));
      float fa=fl(dd-.05); c=mix(c,fc,fa); a=max(a,fa);
    }
  }
  return vec4(c,a);
}
vec4 fishes(vec2 p){
  vec3 c=uMid; float a=0.;
  for(int j=0;j<7;j++){
    float fj=float(j); float ph=fract(uTime*.5+h11(fj+uSd.z*9.));
    float hop=3.2+2.*h11(fj*3.1); float ht=1.1+1.2*h11(fj*5.7);
    vec2 pos=vec2(uFigB.w-5.5-fj*5.3+fract(fj*.618)*4.+ph*hop,uFig[0].y+.5+ht*4.*ph*(1.-ph)-2.*h11(fj*2.3));
    pos=floor(pos/TILE)*TILE;
    vec2 q=rot(p-pos,atan(ht*4.*(1.-2.*ph),hop));
    if(abs(q.x)<1.2&&abs(q.y)<1.){
      float bd=length(q*vec2(1.,3.4))-.62;
      float tl=tri(q,vec2(-.55,0.),vec2(-.95,-.3),vec2(-.95,.3));
      float wg=tri(q,vec2(.22,.05),vec2(-.1,.05),vec2(-.42,.72+.12*sin(uTime*30.+fj)));
      float wg2=tri(q,vec2(.2,-.05),vec2(-.5,-.5),vec2(-.1,-.05));
      float fa=max(max(fl(bd),fl(tl)),max(fl(wg),fl(wg2)));
      vec3 fc=mix(uPale,uMid,fl(bd)); fc=mix(fc,uDeep,max(ln(bd,.035),max(ln(wg,.025),ln(tl,.025))));
      fc=mix(fc,uTin,fl(length(q-vec2(.4,.03))-.05));
      c=mix(c,fc,fa); a=max(a,max(fa,ln(bd,.05)));
    }
    float sp=ln(length((p-vec2(pos.x-ph*hop,uFig[0].y+.3-2.*h11(fj*2.3)))*vec2(1.,2.2))-.25-1.2*ph,.05)*(1.-ph)*(1.-ph);
    c=mix(c,uTin,sp*(1.-a)); a=max(a,sp*.9);                                             // splash ring where it left the water
  }
  return vec4(c,a);
}
vec2 figQ(vec2 p,int i){ return rot(p-uFig[i].xy,uFig[i].z)/max(uFig[i].w,.05); }
float fleetSil(vec2 p){
  float s=max(max(shipSil(figQ(p,0)),shipSil(figQ(p,1))),shipSil(figQ(p,2)));
  vec2 wq=figQ(p,3); if(uFigB.z>1.5) return max(s,(abs(wq.x)>14.5||abs(wq.y)>6.)?0.:step(serpD(wq),0.));
  return max(s,whaleSil(wq));
}
float shipsSil(vec2 p){ return max(max(shipSil(figQ(p,0)),shipSil(figQ(p,1))),shipSil(figQ(p,2))); }
float beastSil(vec2 p){ vec2 wq=figQ(p,3); if(uFigB.z>1.5) return (abs(wq.x)>14.5||abs(wq.y)>6.)?0.:step(serpD(wq),0.); return whaleSil(wq); }
float wakeM(vec2 p){
  float m=0.;
  for(int i=0;i<3;i++){ vec2 q=figQ(p,i); float t=(-5.6-q.x)/9.;
    m=max(m,step(0.,t)*step(t,1.)*step(abs(q.y-.35),.3+.9*t)*(1.-t)); }
  return m;
}
`,ia=`
float crestF(float u){ float a=smoothstep(0.,.74,u), b=1.-smoothstep(.74,1.,u); return a*a*b; }
vec3 rowCol(float d,float u,float sc,float xx,vec2 p,float t){
  float dn=d/sc; vec3 c=uTin;
  c=mix(c,uPale,.55*step(.6,vn(p*vec2(3.,7.)/sc))*step(.08,dn));                       // foam dabs under the lip
  float w=smoothstep(.2,.4,dn);
  vec3 body=mix(mix(uPale,uMid,smoothstep(.12,.42,dn)),uDeep,.9*smoothstep(.36,.98,dn));
  body=mix(body,mix(uTin,uPale,.75),mix(.14,.6,uWorld.z)*t);
  c=mix(c,body,w*br(p*1.3+xx));
  float sl=(fract(dn*2.1+.12*sin(xx*9.))-.5)/2.1*sc;
  c=mix(c,mix(uTin,uPale,.5),.55*ln(sl,.022*sc)*smoothstep(.45,.7,dn)*step(.35,vn(vec2(xx*5.,dn*2.))));
  vec2 v=vec2((u-.8)*3.6,-(dn-.44))*sc; float r=length(v)/sc;                           // the curl
  float in1=1.-smoothstep(.27,.3,r);
  c=mix(c,uTin,in1); c=mix(c,uDeep,in1*ln((fract(ang(v)/6.2832+r*3.3)-.5)*.3*sc,.03*sc));
  c=mix(c,uDeep,ln((r-.3)*sc,.035*sc));
  c=mix(c,uDeep,ln(d-.05*sc,.045*sc));                                                  // crest outline
  return c;
}
vec3 seaPic(vec2 p,float hide){
  float L=uPanel.x,H=uPanel.y,bw=uPanel.z;
  vec2 e=vec2(.5*L-abs(p.x),min(p.y,H-p.y)); float eb=min(e.x,e.y);
  if(eb<bw){
    if(e.x<bw&&e.y<bw){ vec2 v=e-bw*.5; float r=length(v);
      vec3 k=mix(uTin,uPale,.25); k=mix(k,gMg,ln(max(abs(v.x),abs(v.y))-.44*bw,.035));
      float pet=abs(fract(ang(v)/6.2832*8.)-.5);
      k=mix(k,gOc,fl((pet-.3)*r*.8)*step(r,.36*bw)*br(v*3.)); k=mix(k,gMg,ln(r-.36*bw,.03));
      return mix(k,gMg,fl(r-.08*bw)); }
    return borderOrn(e.y<e.x?p.x:p.y,eb,bw);
  }
  float Yh=bw+(H-2.*bw)*(.6+.05*uSd.x); float top=H-bw-Yh; float sy=(p.y-Yh)/top;
  float day=1.-uWorld.z;
  float sn=vn(vec2(p.x*.07+uSd.y*9.,p.y*.9));
  vec3 c=mix(uTin,uPale,clamp(.12+.6*sy+.45*(sn-.5),0.,1.)*br(p*.7));
  vec3 st=mix(uPale,uMid,clamp(.34+.46*sy+.3*(sn-.5),0.,1.)*(.8+.2*br(p*.7)));        // a storm sky: mid cobalt, darker than the real one behind
  st=mix(st,mix(uTin,uPale,.5),.5*(1.-smoothstep(0.,.3,sy))*smoothstep(.4,.7,vn(vec2(p.x*.11,3.))));   // torn light along the horizon
  c=mix(c,st,day);
  vec2 rq=(p-vec2(-.3*L+(uSd.w-.5)*6.,Yh+top*.52))/.74; float rr=length(rq);
  if(rr<3.8){ float ra=ang(rq)/6.2832;
    float k4=abs(fract(ra*4.+.5)-.5), kd=abs(fract(ra*4.)-.5);
    float s4=rr-3.3*max(1.-k4*3.7,0.), s8=rr-2.1*max(1.-kd*3.7,0.);
    c=mix(c,uPale,ln(rr-2.6,.05)); c=mix(c,uMid,ln(rr-2.75,.02));
    c=mix(c,mix(uPale,uTin,step(.5,fract(ra*4.))),fl(s8*.3)); c=mix(c,uMid,ln(s8*.3,.03));
    c=mix(c,mix(uMid,uTin,step(.5,fract(ra*4.+.5))),fl(s4*.3)); c=mix(c,uDeep,ln(s4*.3,.035));
    c=mix(c,uTin,fl(rr-.45)); c=mix(c,uDeep,ln(rr-.45,.04)); c=mix(c,uDeep,fl(rr-.16)); }
  float cx=(p.x-floor(uTime*2.)*TILE*.5)/24.+uSd.z*5.; float ci=floor(cx);
  vec2 cq=vec2((fract(cx)-.5)*24.,p.y-Yh-top*(.34+.3*h11(ci*3.3+uSd.w)));
  float cv=step(.25,h11(ci*7.7+uSd.w));
  float cd=min(min(length(cq-vec2(-1.8,0.))-1.3,length(cq-vec2(0.,.55))-1.7),min(length(cq-vec2(2.,.1))-1.35,length(cq-vec2(3.6,-.3))-.85));
  cd=max(min(cd,length(cq-vec2(-3.4,-.35))-.8),-.75-cq.y);
  c=mix(c,mix(uTin,mix(uPale,uMid,.5*day),mix(.4,.85,day)*(1.-smoothstep(-.6,.6,cq.y))),fl(cd)*cv); c=mix(c,mix(uMid,uDeep,.4*day),ln(cd,.06)*cv);
  vec2 sv=cq-vec2(-1.8,0.); float sr=length(sv);
  c=mix(c,uMid,cv*ln((fract(ang(sv)/6.2832+sr*.9)-.5)*.8,.045)*step(sr,1.05));
  sv=cq-vec2(2.,.1); sr=length(sv);
  c=mix(c,uMid,cv*ln((fract(-ang(sv)/6.2832+sr*.9)-.5)*.8,.045)*step(sr,1.1));
  float rb=smoothstep(.12*L,.36*L,p.x+3.*sin(p.y*.6))*smoothstep(0.,.2,sy);            // the departing shower
  rb=max(rb,.35*day*smoothstep(0.,.2,sy));                                               // by day rain slants across the whole panel
  float hat=(fract((p.x+p.y*.45)/.42)-.5)*.42;
  c=mix(c,uPale,rb*.4*uWorld.z); c=mix(c,mix(uMid,uDeep,.3),rb*.3*day);
  c=mix(c,mix(uMid,uDeep,.4),rb*.85*ln(hat,.05)*step(.3,vn(vec2((p.x+p.y*.45)*3.,p.y*.35))));
  vec2 gq=vec2(p.x-floor(uTime*6.)*TILE*.5,p.y)/vec2(11.,3.2); vec2 gi=floor(gq);       // gulls
  vec2 gf=(fract(gq)-.5)*vec2(11.,3.2)-(vec2(h21(gi+3.),h21(gi+9.))-.5)*vec2(6.,1.6);
  float gd=gf.y-.34*abs(sin(clamp(gf.x,-.8,.8)*3.927))*(.55+.45*sin(uTime*5.+gi.x*2.));
  c=mix(c,uDeep,ln(gd,.05)*step(abs(gf.x),.8)*step(.5,h21(gi+uSd.w))*step(.1,sy)*(1.-rb));
  c=mix(c,uDeep,ln(p.y-Yh,.04));
  float hit=99.,hd=0.,hu=0.,hsc=1.,hx=0.;
  for(int i=0;i<10;i++){
    float fi=float(i), t=fi/9.;
    float sc=mix(1.5,.4,pow(t,.8)), yb=mix(bw+.75,Yh-.2,1.-pow(1.-t,1.7));
    float xx=(p.x-floor(uTime*8.*(.35+.43*sc))*TILE)/(3.6*sc)+h11(fi+uSd.x)*7.;
    float u=fract(xx);
    float cr=yb+.78*sc*(.72+.5*h11(floor(xx)*1.7+fi*31.))*crestF(u)+.12*sc*sin(xx*2.1+fi);
    if(hit>50.&&p.y<cr){ hit=fi; hd=cr-p.y; hu=u; hsc=sc; hx=xx; }
  }
  if(hit<50.) c=rowCol(hd,hu,hsc,hx,p,hit/9.); else if(p.y<Yh) c=mix(uPale,uMid,.3);
  float show=1.-hide;
  if(hit>4.5){ vec4 f1=caravel(figQ(p,1),1.), f2=caravel(figQ(p,2),2.);
    c=mix(c,f1.rgb,f1.a*show); c=mix(c,f2.rgb,f2.a*show); }
  if(hit>1.5){ vec4 f0=caravel(figQ(p,0),0.); c=mix(c,f0.rgb,f0.a*show); vec4 ff=fishes(p); c=mix(c,ff.rgb,ff.a);
    if(uFigB.z>.5&&uFigB.z<1.5){ vec4 dl=dolphins(p); c=mix(c,dl.rgb,dl.a); } }
  if(hit>1.5){ vec4 wh=beast(figQ(p,3)); c=mix(c,wh.rgb*(1.-.25*uWorld.z),wh.a*show); }   // at dusk the pale beast is held back so it does not flare
  return c;
}
`,la=`
float cloudD(vec2 cq){
  float cd=min(min(length(cq-vec2(-1.8,0.))-1.3,length(cq-vec2(0.,.55))-1.7),min(length(cq-vec2(2.,.1))-1.35,length(cq-vec2(3.6,-.3))-.85));
  return max(min(cd,length(cq-vec2(-3.4,-.35))-.8),-.75-cq.y);
}
void skyCloud(inout vec3 c,vec2 p,float cw,float y0,float yv,float k0,float thr,float spd,float sd,float dk){
  float cx=(p.x+uSky.z*spd)/cw+uSd.z*5.+sd; float ci=floor(cx);
  float kk=k0*(1.+.45*h11(ci*1.9+sd));
  vec2 cq=vec2((fract(cx)-.5)*cw,p.y-y0-yv*h11(ci*3.3+uSd.w+sd))*kk;
  float cv=step(thr,h11(ci*7.7+uSd.w+sd));
  float cd=cloudD(cq);
  vec3 fill=mix(uTin,mix(uPale,mix(uPale,uMid,.55),dk),mix(.4,.8,dk)*(1.-smoothstep(-.7,.7,cq.y))*mix(1.,br(cq*1.6),dk));
  float lw=mix(1.7,1.,dk);
  c=mix(c,fill,fl(cd)*cv*mix(.25,1.,dk)); c=mix(c,uMid,ln(cd,.07*lw)*cv);
  vec2 sv=cq-vec2(-1.8,0.); float sr=length(sv);
  c=mix(c,uMid,cv*ln((fract(ang(sv)/6.2832+sr*.9)-.5)*.8,.05*lw)*step(sr,1.05));
  sv=cq-vec2(2.,.1); sr=length(sv);
  c=mix(c,uMid,cv*ln((fract(-ang(sv)/6.2832+sr*.9)-.5)*.8,.05*lw)*step(sr,1.1));
}
vec3 skyPic(vec2 p){                              // p = (azimuth from south, elevation) * 52
  float az=p.x/52., el=p.y/52.; float h=clamp(el/1.25,0.,1.);
  float dk=uOpt.w;                                // 1 by day: tin white rising to cobalt in broad strokes; 0 at dusk (the inverted scheme keeps its own wash)
  float w=sqrt(h)*.95+.16*(vn(vec2(p.x*.05,p.y*.9))-.5)+.05*sin(p.y*1.7+3.*vn(vec2(p.x*.04,p.y*.2)));
  vec3 c=mix(uTin,uPale,clamp(w,0.,1.));
  vec3 top=mix(uPale,uMid,.86);
  float n1=vn(vec2(p.x*.02,p.y*.55)), n2=vn(vec2(p.x*.031+7.,p.y*.9+3.));
  vec3 d3=mix(mix(uTin,uPale,smoothstep(-.02,.17,el+.03*(n2-.5))),top,smoothstep(.05,.52,el+.07*(n1-.5)));
  d3=mix(d3,uMid,.2*smoothstep(.45,.75,n1)*smoothstep(.1,.4,el));              // broad horizontal brush strokes, darker
  d3=mix(d3,uTin,.2*smoothstep(.55,.8,n2)*smoothstep(.02,.2,el));               // and paler
  c=mix(c,d3,dk);
  float shw=clamp(uSky.x-1.,0.,1.);
  c=mix(c,mix(uPale,uMid,.75),shw*clamp(.25+.75*smoothstep(.08,.7,el)+.3*(vn(vec2(p.x*.03,p.y*.11))-.5),0.,1.));
  float saz=atan(uSun.x,uSun.z), sel=asin(clamp(uSun.y,-1.,1.));
  float da=az-saz; da-=6.2832*floor(da/6.2832+.5);
  float sunw=.5+.5*cos(da);
  vec2 q=vec2(da*cos(el),el-sel)*52.; float r=length(q);
  c=mix(c,vec3(1.,.9,.7),uSky.w*.9*(1.-smoothstep(0.,.32,el))*(.35+.65*sunw*sunw));  // morning: a warm band under the sun
  c=mix(c,vec3(1.,.86,.56),uSky.w*.75*exp(-r*r/420.));                             // and a low golden-tin glow round it
  c=mix(c,uMid,uSky.y*.62*(1.-smoothstep(-.02,.4,el))*(.3+.7*sunw*sunw));          // dusk: the horizon keeps a paler band under the sun
  float rbw=1.-smoothstep(.7,1.3,abs(az-1.3)-shw*4.);
  float rbe=el+.07*(vn(vec2(p.x*.07,2.))-.5);
  float rb=clamp(min(uSky.x,1.)*rbw*(1.-smoothstep(.13+.57*shw,.4+.76*shw,rbe))*smoothstep(-.02,.04,el),0.,1.);
  float hat=(fract((p.x+p.y*.45)/1.3)-.5)*1.3;                        // the shower as a bank of slanting hatching
  c=mix(c,mix(uMid,uDeep,.35),rb*.5*(.75+.25*br(p*.3)));
  c=mix(c,mix(uMid,uDeep,.7),rb*.7*ln(hat,.13)*step(.3,vn(vec2((p.x+p.y*.45)*1.1,p.y*.2))));
  if(dk<.99){                                                          // dusk: white brushwork on the deep cobalt
    float nk=1.-dk; vec3 lite=mix(uPale,uMid,.55);
    float b1=smoothstep(.5,.78,vn(vec2(p.x*.018+3.,p.y*.42))), b2=smoothstep(.56,.8,vn(vec2(p.x*.026+11.,p.y*.7+5.)));
    c=mix(c,lite,nk*.3*b1*smoothstep(.03,.2,el)*(.6+.4*br(p*.35)));          // broad horizontal brush bands
    c=mix(c,uPale,nk*.5*b2*smoothstep(.2,.5,el));
    vec2 sg=p/vec2(5.2,4.4); vec2 si=floor(sg); vec2 sf=(fract(sg)-.5)*vec2(5.2,4.4)-(vec2(h21(si+3.),h21(si+9.))-.5)*vec2(2.6,2.2);
    float sz=.34+.5*h21(si+5.), tw=.7+.3*sin(uTime*(1.5+2.*h21(si+7.))+si.x*3.);
    float s4=(abs(sf.x)+abs(sf.y))*.5+2.2*sqrt(abs(sf.x*sf.y)+1e-6)-sz;        // four-point painted stars
    c=mix(c,mix(uMid,uDeep,.6),nk*tw*fl(s4*.9)*step(.74,h21(si+uSd.w*5.))*smoothstep(.13,.2,el)*(1.-rb));
    vec2 mq=vec2((az-.4-6.2832*floor((az-.4)/6.2832+.5))*cos(el),el-.29)*52.; float mr=length(mq);   // the moon, south-south-east
    if(mr<5.5){ float md=abs(fract(ang(mq)/6.2832*14.)-.5);
      c=mix(c,mix(uMid,uDeep,.5),nk*fl((md-.2)*mr*.45)*smoothstep(2.9,3.1,mr)*(1.-smoothstep(4.,4.2,mr)));
      c=mix(c,uDeep,nk*fl(mr-2.1)); c=mix(c,mix(uTin,uPale,.5),nk*fl(mr-2.1)*fl(length(mq-vec2(.95,.5))-1.75)); c=mix(c,uMid,nk*ln(mr-2.1,.07)); }
  }
  skyCloud(c,p,24.,9.,12.,.55,mix(.12,.2,dk),1.,0.,dk);                // scroll clouds in three rows, the high ones large (at dusk: outlines only)
  { vec3 c2=c; skyCloud(c2,p,36.,mix(12.,17.,dk),10.,.3,.3,1.4,3.7,dk); skyCloud(c2,p,46.,31.,13.,.24,.3,1.9,8.3,dk); c=mix(c,c2,mix(.7,1.,dk)); }
  vec2 gq=vec2(p.x+uTime*1.3,p.y+1.2*sin(uTime*.4+p.x*.2))/vec2(7.,4.2); vec2 gi=floor(gq);   // a painted flock of gulls
  vec2 gf=(fract(gq)-.5)*vec2(7.,4.2)-(vec2(h21(gi+3.),h21(gi+9.))-.5)*vec2(3.6,2.);
  float gd=gf.y-.5*abs(sin(clamp(gf.x,-1.2,1.2)*2.618))*(.5+.5*sin(uTime*5.+gi.x*2.+gi.y));
  c=mix(c,uDeep,ln(gd,.1)*step(abs(gf.x),1.2)*step(.7,h21(gi+uSd.w*7.))*smoothstep(.06,.12,el)*(1.-smoothstep(.45,.55,el))*(1.-.7*rb));
  if(r<6.){                                                            // the sun: a white disc ringed by ochre dashes
    float dash=abs(fract(ang(q)/6.2832*18.)-.5);
    c=mix(c,uOchre,fl((dash-.22)*r*.35)*smoothstep(3.,3.2,r)*(1.-smoothstep(4.3,4.5,r)));
    c=mix(c,mix(uTin,uDeep,uWorld.z)*(1.+uSky.y),fl(r-2.3)); c=mix(c,uMid,ln(r-2.3,.06)*(1.-uWorld.z));
  }
  return c;
}
vec3 winPic(vec2 p,float sd){                     // one window, 1.1 x 1.8 m, local metres
  vec2 q=p-vec2(.55,.9), a=abs(q);
  float inner=max(a.x-.41,a.y-.76);
  vec3 c=mix(uTin,uPale,.3+.2*br(p*3.));
  c=mix(c,uMid,ln(inner-.08,.016));
  vec3 pane=mix(uDeep,uMid,.2+.3*br(p*3.)+.3*smoothstep(-.7,.8,q.y+q.x*.6));
  float lit=step(1.001-max(uWorld.z*.6,uWarm.x),h11(floor(sd*997.+.5)));   // the seed is rounded first: a hash of an interpolated value dithers
  pane=mix(pane,uYel*2.2*(.7+.3*br(p*2.)),lit);
  c=mix(c,pane,fl(inner));
  float bars=max(ln(q.x,.022),ln(q.y-.22,.018));
  c=mix(c,mix(uTin,uPale,.3),bars*fl(inner)*(1.-.5*lit));
  gLit=lit*fl(inner+.02)*(1.-.75*bars)*(.72+.28*br(p*2.));
  return mix(c,uDeep,ln(inner,.028));
}
vec3 doorPic(vec2 p,float sd){                    // an arched door, 1.5 x 2.8 m
  vec2 q=p-vec2(.75,0.); float ax=abs(q.x);
  float d=min(max(ax-.6,q.y-2.),length(vec2(q.x,q.y-2.))-.6);
  vec3 c=mix(uTin,uPale,.35); c=mix(c,uMid,ln(d-.09,.02));
  vec3 dr=mix(mix(uMid,uDeep,.55),uDeep,step(.5,fract(sd*7.)))*(.85+.2*br(p*2.));
  float pn=max(abs(ax-.3)-.19,abs(fract(q.y/.95)-.5)*.95-.33);
  dr=mix(dr,uPale,.6*ln(pn,.016)*step(q.y,1.9)); dr=mix(dr,uTin,.7*ln(q.x,.01));
  dr=mix(dr,uTin,fl(length(q-vec2(.1,1.05))-.035));
  float fan=abs(fract(atan(q.x,max(q.y-2.,1e-3))/3.1416*5.)-.5);
  dr=mix(dr,uPale,.6*ln(fan*.3,.02)*step(2.,q.y));
  c=mix(c,dr,fl(d)); return mix(c,uDeep,ln(d,.03));
}
vec3 riverPic(vec2 p){                            // p = (east, south from the quay) metres: scallop waves marching east
  vec3 c=mix(uPale,uMid,clamp(.78+.22*vn(p*vec2(.012,.09))+.1*vn(p*vec2(.05,.4)),0.,1.));
  c=mix(mix(uMid,uDeep,.25),c,clamp(1.-gAA/6.,0.,1.));                        // far off it holds a fill tone, never a pale average
  c=mix(c,mix(uMid,uDeep,.55),.35*smoothstep(.5,.75,vn(p*vec2(.004,.02)+uSd.xy*5.)));   // long brushed currents
  for(int j=0;j<3;j++){
    float S=j==0?22.:j==1?7.:1.5; float rw=7.*S;
    float row=floor(p.y/rw), yy=fract(p.y/rw)*rw;
    float xx=(p.x-floor(uTime*3.)*.84*S)/(11.*S)+h11(row+float(j)*17.)*5.; float u=fract(xx)-.5;
    float d=length(vec2(u*11.*S,(yy-S)*1.9))-4.4*S;
    float k=clamp(1.-gAA/(1.6*S),0.,1.);
    c=mix(c,mix(uTin,uPale,.4),.5*k*(1.-smoothstep(-1.6*S,0.,d))*step(d,0.)*step(S,yy));
    c=mix(c,mix(uMid,uDeep,.7),k*ln(d,.2*S)*step(S,yy));
  }
  return c;
}
vec3 hillPic(vec2 p,float tone){                  // the far bank: p = (east, metres below the ridge); tone 1 nearest (deep), 0 farthest (pale)
  vec3 base=tone>.5?mix(uMid,mix(uMid,uDeep,.7),(tone-.5)*2.):mix(mix(uPale,uMid,.35),uMid,tone*2.);
  base=mix(base,mix(uPale,uTin,.75-.5*tone),uWorld.z);                         // at dusk the ranges sink into the deep sky, the nearest least
  vec3 c=base*(.85+.3*vn(p*vec2(.006,.03)+tone*9.));
  float dy=-p.y;                                                              // metres below the ridge
  float ter=(fract((dy+9.*vn(vec2(p.x*.008,tone*5.)))/11.)-.5)*11.;           // terrace lines following the slope
  c=mix(c,mix(base,uTin,.42),.8*ln(ter,.9)*smoothstep(4.,14.,dy));
  float hat=(fract((p.x+dy*.8)/7.)-.5)*7.;                                    // hatched shade under each terrace
  c=mix(c,mix(base,uDeep,.6),.5*ln(hat,.8)*step(ter,0.)*smoothstep(4.,14.,dy));
  float k=smoothstep(.55,.9,tone);
  if(k>0.){
    vec2 g=vec2(p.x/46.,(dy-8.)/22.); vec2 gi=floor(g);                       // tin quintas with deep roofs
    vec2 f=(fract(g)-.5)*vec2(46.,22.)-(vec2(h21(gi+2.),h21(gi+5.))-.5)*vec2(22.,6.);
    float on=step(.45,h21(gi+uSd.xy*11.))*step(8.,dy)*k;
    float bd=max(abs(f.x)-6.5,abs(f.y-1.)-3.);
    c=mix(c,uTin,fl(bd)*on); c=mix(c,uDeep,fl(max(abs(f.x)-7.5,abs(f.y+2.6)-1.2+abs(f.x)*.12))*on);
    c=mix(c,uDeep,fl(max(abs(abs(f.x)-2.8)-.9,abs(f.y-1.)-1.1))*on);
    vec2 w=vec2((fract(p.x/170.+.3)-.5)*170.,dy-26.);                         // a row of windmills under the ridge, sails turning
    float wd=max(abs(w.x)-2.2-.14*(w.y+9.),abs(w.y)-9.);
    c=mix(c,uTin,fl(wd)*k); c=mix(c,uDeep,fl(max(abs(w.x)-4.4-(w.y+9.)*.7,abs(w.y+10.6)-1.6))*k);
    vec2 sq=rot(w+vec2(0.,9.),uTime*.5+floor(p.x/170.+.3)*1.7); vec2 sa=abs(sq);
    c=mix(c,uTin,fl(min(max(sa.x-15.,sa.y-1.3),max(sa.y-15.,sa.x-1.3)))*k); c=mix(c,uDeep,fl(length(sq)-1.5)*k);
  }
  return c;
}
vec3 friezePic(vec2 p){                           // a string course, 0.84 m: running wave, bead row, and the cat
  vec3 c=mix(uTin,uPale,.3*br(p*2.));
  c=mix(c,uMid,ln(p.y-.07,.02)); c=mix(c,uMid,ln(p.y-.77,.02));
  c=mix(c,uPale,.8*ln(p.y-.2-.07*sin(p.x*11.22),.03));
  c=mix(c,uMid,.8*fl(length(vec2((fract(p.x/.28)-.5)*.28,p.y-.66))-.035));
  vec2 q=(p-uCat.xy)*vec2(uCat.z,1.);
  if(abs(q.x)<.8&&q.y>-.05&&q.y<.8){
    float ph=uCat.x*8.;
    float d=length((q-vec2(0.,.3))*vec2(.48,1.))-.125;
    d=min(d,length(q-vec2(.34,.44))-.105);
    d=min(d,tri(q,vec2(.27,.52),vec2(.31,.64),vec2(.36,.54))); d=min(d,tri(q,vec2(.36,.54),vec2(.42,.64),vec2(.44,.5)));
    d=min(d,seg(q,vec2(-.25,.34),vec2(-.46,.56+.05*sin(ph*.5)))-.028);
    d=min(d,seg(q,vec2(.18,.24),vec2(.18+.1*sin(ph),0.))-.03); d=min(d,seg(q,vec2(.12,.24),vec2(.12-.1*sin(ph),0.))-.03);
    d=min(d,seg(q,vec2(-.18,.24),vec2(-.18-.1*sin(ph),0.))-.03); d=min(d,seg(q,vec2(-.24,.24),vec2(-.24+.1*sin(ph),0.))-.03);
    vec3 cc=mix(uTin,mix(uMid,uDeep,.45),uCat.w);
    cc=mix(cc,mix(uPale,uDeep,uCat.w),.7*ln((fract(q.x/.11)-.5)*.11,.014)*step(q.x,.2)*step(.26,q.y));
    cc=mix(cc,mix(uDeep,uTin,uCat.w),fl(length(q-vec2(.38,.46))-.02));
    c=mix(c,cc,fl(d)); c=mix(c,uDeep,ln(d,.022));
  }
  return c;
}
vec2 birdsOv(vec2 p){                             // painted swallows (or sardines) crossing the walls, tile by tile
  float k=clamp(1.-gAA/.12,0.,1.); if(k<=0.) return vec2(0.);
  vec2 g=vec2(p.x-floor(uWorld.x/TILE)*TILE,p.y)/vec2(6.3,2.52); vec2 gi=floor(g);
  if(h21(gi+uSd.xy*40.)<.52) return vec2(0.);
  vec2 f=(fract(g)-.5)*vec2(6.3,2.52)-(vec2(h21(gi+3.),h21(gi+9.))-.5)*vec2(3.6,1.);
  f=floor(f/(TILE*.5))*(TILE*.5);
  if(abs(f.x)>.75||abs(f.y)>.7) return vec2(0.);
  float d, e=0.;
  if(uWorld.w<.5){
    float W=.62*(.25+.75*abs(sin(uTime*7.+gi.x*2.+gi.y)));
    d=length(f*vec2(1.,3.))-.2;
    d=min(d,min(tri(f,vec2(.1,0.),vec2(-.1,0.),vec2(-.3,W)),tri(f,vec2(.1,0.),vec2(-.3,-W),vec2(-.1,0.))));
    d=min(d,min(tri(f,vec2(-.15,0.),vec2(-.52,.13),vec2(-.4,0.)),tri(f,vec2(-.15,0.),vec2(-.4,0.),vec2(-.52,-.13))));
    e=fl(length(f-vec2(.12,0.))-.035)*.0;
  } else {
    float wv=.04*sin(f.x*9.-uTime*11.+gi.x);
    vec2 s=vec2(f.x,f.y-wv);
    d=length(s*vec2(1.,3.6))-.36; d=min(d,tri(s,vec2(-.3,0.),vec2(-.5,-.12),vec2(-.5,.12)));
    e=ln(s.y-.02,.014)*step(abs(s.x),.26)+fl(length(s-vec2(.24,.02))-.03);
  }
  return vec2(fl(d)*k,clamp(e,0.,1.)*k);
}
vec3 leafPic(vec2 p,float sd,float sh){           // foliage in glaze: stippled dabs in three strengths, no grid, no sheen
  vec3 mg=mix(uMang,vec3(.3,.19,.66),.6);
  vec3 ink=sd>.75?mg:uMid, dk=sd>.75?mix(mg,uMang,.55):uDeep, lt=sd>.75?mix(uTin,mg,.38):uPale;
  float tone=clamp(sd>.75?(sd-.75)*4.:sd*1.6,0.,1.);
  vec3 c=mix(lt,ink,.3+.45*tone), hi=mix(uTin,lt,.45);
  float k=clamp(1.-gAA/.45,0.,1.);
  for(int j=0;j<3;j++){
    float sc=j==0?1.05:j==1?.46:.27; vec2 g=p/sc+float(j)*vec2(3.7,1.3); vec2 gi=floor(g);
    float r=h21(gi+sd*13.+float(j)*5.);
    vec2 f=rot(fract(g)-.5-(vec2(h21(gi+1.7),h21(gi+7.3))-.5)*.5,r*6.2832);
    float d=(length(f*vec2(1.,1.9))-.2-.16*r)*sc;
    vec3 dab=r<.34?hi:r<.7?ink:dk;
    c=mix(c,dab,fl(d)*k*(.75+.25*br(p*3.)));
  }
  c=mix(mix(lt,ink,.4+.4*tone),c,k);
  c=mix(c,mix(ink,dk,.7),(sd>.75?.6:.88)*smoothstep(.15,.85,sh));     // the underside falls to deep cobalt
  return c;
}
vec3 farPic(vec2 p,float sd){                     // a distant house front: tin wall, rows of painted windows, a dado
  vec3 c=mix(uTin,uPale,.25+.5*h11(sd*31.));
  vec2 g=vec2(p.x/2.3,p.y/3.05+sd*3.); vec2 f=(fract(g)-.5)*vec2(2.3,3.05);
  float d=max(abs(f.x)-.46,abs(f.y+.1)-.8);
  float on=step(.18,h21(floor(g)+sd*7.));
  c=mix(c,mix(uMid,uDeep,.75),.95*fl(d)*on); c=mix(c,uMid,.7*ln(d-.16,.05)*on);
  gLit=.9*fl(d)*on*step(1.-uWarm.y,h21(floor(g)*1.7+sd*3.+2.));              // a few far windows burn yellow
  c=mix(c,mix(uPale,uMid,.6),.7*ln(f.y+1.25,.1));
  return c;
}
vec3 clothPic(vec2 p,float sd){                   // washing and bunting: stripes, checks, dots or a bordered sheet
  float k=fract(sd*7.31); vec3 a=uTin, b=fract(sd*3.17)<.5?uMid:uDeep; vec3 c;
  if(k<.28){ c=mix(a,b,step(.5,fract(p.y/.17))); }
  else if(k<.52){ vec2 q=step(.5,fract(p/.2)); c=mix(a,b,.5*(q.x+q.y)); }
  else if(k<.76){ vec2 q=fract(p/.16)-.5; c=mix(uPale,b,fl((length(q)-.26)*.16)); }
  else { c=mix(b,a,step(.06,min(min(p.x,1.-p.x),min(p.y,1.2-p.y)))); c=mix(c,b,.8*fl(length(vec2(p.x-.5,(p.y-.6)*.8))-.16)); }
  if(fract(sd*11.3)<mix(.16,.34,uWorld.w)) c=mix(c,uYel,.85*step(.5,fract(p.y/.17)));   // a little tram yellow on the line, more at the festival
  return c*(.9+.14*br(p*2.));
}
vec3 rosePic(vec2 p){                             // compass rose inlaid in the belvedere floor (p from its centre, metres)
  float r=length(p), an=ang(p)/6.2832;
  vec3 c=mix(uTin,uPale,.3+.3*br(p));
  float k4=abs(fract(an*4.+.5)-.5), k8=abs(fract(an*4.)-.5), k16=abs(fract(an*16.)-.5);
  float s4=r-5.2*max(1.-k4*3.4,0.), s8=r-3.4*max(1.-k8*3.4,0.);
  c=mix(c,uPale,fl((k16-.25)*r*.39)*smoothstep(5.6,5.8,r)*(1.-smoothstep(6.4,6.6,r)));
  c=mix(c,uMid,ln(r-5.6,.08)); c=mix(c,uDeep,ln(r-6.6,.12)); c=mix(c,uMid,ln(r-7.,.05));
  c=mix(c,mix(uPale,uTin,step(.5,fract(an*4.))),fl(s8*.4)); c=mix(c,uMid,ln(s8*.4,.04));
  c=mix(c,mix(uDeep,uTin,step(.5,fract(an*4.+.5))),fl(s4*.4)); c=mix(c,uDeep,ln(s4*.4,.05));
  c=mix(c,gOc,fl(r-.7)); c=mix(c,uDeep,ln(r-.7,.06)); c=mix(c,uTin,fl(r-.3));
  return c;
}
`,sa=`
attribute vec2 aTile; attribute float aPic, aBorder, aSeed, aShade, aWind; attribute vec3 aRib; attribute vec2 aInst;
uniform float uTime, uPix;
varying vec2 vTile; varying float vPic, vBorder, vSeed, vShade; varying vec3 vWN, vWP;
#include <fog_pars_vertex>
void main(){
  vTile=aTile; vPic=aPic; vBorder=aBorder; vSeed=aSeed+aInst.x; vShade=aShade;
  mat4 m=modelMatrix;
  #ifdef USE_INSTANCING
    m=modelMatrix*instanceMatrix;
  #endif
  vec4 wp=m*vec4(position,1.);
  float wph=uTime*2.1+wp.x*.35+wp.z*.27+aInst.y*6.2832;                       // breeze: cloth, leaves, cords
  wp.xyz+=aWind*vec3(.6*sin(wph)+.25*sin(wph*2.3+1.),.22*sin(wph*1.7),.5*cos(wph*.9));
  float rl=length(aRib);                                                      // ribbons keep about 1.5 px of width
  if(rl>1e-6) wp.xyz+=(mat3(m)*aRib)/rl*max(0.,length(cameraPosition-wp.xyz)*uPix-rl);
  vWP=wp.xyz; vWN=mat3(m)*normal;
  vec4 mvPosition=viewMatrix*wp; gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,oa=aa+`#include <fog_pars_fragment>
`+ta+ca+ia+la+`
void main(){
  vec2 tw=fwidth(vTile); float px=max(max(tw.x,tw.y),1e-5);
  gOc=mix(uOchre,uMang,uOpt.x); gMg=mix(uMang,uOchre,uOpt.x);
  gAA=px*.75; gDet=smoothstep(2.,4.5,TILE/px); gPat=smoothstep(1.2,3.5,TILE/px); gLit=0.; gEm=uMid;
  float pic=floor(vPic+.5);
  if((pic>7.5&&pic<9.5)||(pic>12.5&&pic<13.5)||(pic>15.5&&pic<16.5)||(pic>17.5&&pic<18.5)||pic>19.5) gDet=0.;
  bool matte=(pic>15.5&&pic<16.5)||(pic>17.5&&pic<18.5)||pic>19.5;
  vec2 tc=vTile/TILE, id=floor(tc), f=fract(tc);
  float hs=h21(id+vSeed*17.);
  vec2 p=vTile, cen=(id+.5)*TILE;
  float flipQ=-1., hide=0., flipW=0.;
  bool sea=pic>.5&&pic<1.5&&vBorder<.5;
  if(sea){
    p.x*=uPanel.w; cen.x*=uPanel.w;
    vec2 ahead=cen+vec2(TILE*(1.+hs),0.);                               // one or two tiles ahead: only the fringe at a bow or a stern turns over
    float shN=shipsSil(cen), shP=shipsSil(ahead);
    float chS=abs(shN-shP), chB=abs(beastSil(cen)-beastSil(ahead))*(1.-max(shN,shP)), ph=uTime*4.+hs*7., pr=h21(id*1.3+floor(ph));
    float act=max(max(chS*step(pr,.55),chB*step(pr,.24)),wakeM(cen)*step(h21(id*1.7+floor(ph)),.22))*step(.85,gDet);   // tiles turn over only where a tile is big enough to read (no dither far off)
    if(act>.5){ flipQ=fract(ph); hide=shN*chS*step(flipQ,.5); flipW=chB*(1.-chS); }
  }
  float gap=0., lip=0.;
  if(flipQ>=0.){
    float sq=mix(1.,max(abs(cos(3.14159*flipQ)),.07),gDet); float fy=(f.y-.5)/sq;
    gap=step(.5,abs(fy)); lip=smoothstep(.36,.5,abs(fy))*(1.-gap);
    p.y=(id.y+.5+clamp(fy,-.5,.5))*TILE;
  }
  p+=(vec2(h21(id+5.),h21(id+11.))-.5)*.009*gDet;                    // hand-set tiles never quite register
  vec3 c;
  if(vBorder>.5) c=borderOrn(p.x,p.y,1.4);
  else if(sea) c=seaPic(p,hide);
  else if(pic>19.5) c=hillPic(p,vSeed);
  else if(pic>18.5) c=rosePic(p);
  else if(pic>17.5) c=clothPic(p,vSeed);
  else if(pic>16.5) c=farPic(p,vSeed);
  else if(pic>15.5) c=leafPic(p,vSeed,vShade);
  else if(pic>14.5){ c=fieldPic(2.,p,vSeed); if(uRare.w>.01){ vec4 wh=beast(rot(p-uRare.xy,uRare.z)/uRare.w); c=mix(c,wh.rgb,wh.a); } }
  else if(pic>13.5) c=friezePic(p);
  else if(pic>12.5) c=riverPic(p);
  else if(pic>11.5) c=doorPic(p,vSeed);
  else if(pic>10.5) c=winPic(p,vSeed);
  else if(pic>8.5&&pic<9.5) c=uTin;
  else c=fieldPic(pic,p,vSeed);
  bool wallF=pic<.5||(pic>1.5&&pic<3.5)||(pic>14.5&&pic<15.5);
  if(wallF&&vBorder<.5&&!sea){ vec2 bo=birdsOv(p); c=mix(c,mix(uDeep,uMid,.6*uWorld.w),bo.x); c=mix(c,uTin,bo.y); }
  if(uWorld.y>.01&&abs(vWN.y)<.6*length(vWN)&&pic<7.5){                     // the shower, painted: slanting strokes that run down every wall
    float ri=floor((vTile.x+vTile.y*.3)/.84), rs=(fract((vTile.x+vTile.y*.3)/.84)-.5)*.84;
    float rd=step(.62,fract(vTile.y*.3+uTime*1.1+h11(ri)*7.));
    c=mix(c,mix(uMid,uDeep,.3),uWorld.y*.85*ln(rs,.03)*rd*clamp(gPat,0.,1.));
  }
  float rp=h21(id+vSeed*3.+41.);
  if(sea||pic<.5||(pic>1.5&&pic<3.5)){                                // repairs: odd pattern tiles and bare mortar
    if(rp<.004) c=mix(c,mix(uTin,fieldPic(2.,vTile+rp*90.,0.),.6),gDet);
    else if(rp>.9982) c=mix(c,mix(mix(uTin,uMang,.3),uDeep,.55*step(.82,max(f.x,1.-f.y))),gDet);
  }
  c=mix(c,mix(uDeep,uMid,.35),gap); c=mix(c,uDeep,.7*lip);
  c*=1.+(hs-.5)*.13*gDet;
  c*=mix(vec3(1.),mix(vec3(1.02,1.,.95),vec3(.95,.98,1.03),h21(id+71.)),gDet);
  vec2 pe=abs(f-.5); c*=1.-.07*gDet*smoothstep(.36,.5,max(pe.x,pe.y));       // pillowed glaze edge
  float g=min(min(f.x,1.-f.x),min(f.y,1.-f.y))*TILE;
  float grt=(.26+.34*smoothstep(4.,12.,TILE/px))*gDet*(1.-smoothstep(max(.0012,px*.35),max(.0024,px*.9),g));
  c=mix(c,mix(mix(uTin,uMang,.4)*.62,c*.72,.7),grt);                  // grout takes the tile's own tone, so deep figures are not meshed with pale lines
  c=mix(c,c*vec3(.86,.84,.8),clamp(1.-gAA/.004,0.,1.)*step(abs(vn(p*85.)-.5),.03));   // crazing, only very close
  float stn=vn(vec2(vTile.x*.55,vTile.y*.07+vSeed));                 // rain stains run down from above
  c*=mix(vec3(1.),uWash,.22*smoothstep(.55,.85,stn));
  vec3 N=normalize(vWN+vec3(0.,1e-5,0.)); if(!gl_FrontFacing) N=-N;
  N=normalize(N+(vec3(h21(id+1.),h21(id+2.),h21(id+3.))-.5)*.06*gDet*((pic>10.5&&pic<12.5)?.15:1.));
  float ndl=dot(N,uSun);
  float shade=max(1.-smoothstep(-.45,.25,ndl),vShade);                 // grazing faces are hatched, only faces turned well away take the wash
  vec3 wash=uWash, wash2=uWash2;
  bool roofy=pic>4.5&&pic<5.5, farF=pic>16.5&&pic<17.5, pave=pic>3.5&&pic<4.5, riv=pic>12.5&&pic<13.5;
  if(roofy||farF||pave||riv){                                          // painted cloud shade drifting over the city, block by block
    float stp=floor(uTime*4.), sc=riv?5.6:1.12;
    vec2 q=floor((vWP.xz-stp*vec2(.84,.34))/sc);
    float cs=vn(q/(riv?26.:44.)+uSd.xy*9.);
    float inS=smoothstep(.53,.6,cs)*(1.-.75*clamp(vShade,0.,1.));
    c*=mix(vec3(1.),wash*mix(vec3(1.),wash,.5),.62*inS);
    float fr=step(abs(cs-.55),.02)*step(.55,h21(q+floor(uTime*2.)*7.))*(1.-clamp(vShade,0.,1.));   // its edge turns over like split-flaps
    c=mix(c,mix(uMid,uDeep,.5),.5*fr);
  }
  if(farF) c*=mix(vec3(1.),wash,.85*smoothstep(.45,.95,shade));
  c*=mix(vec3(1.),wash,.92*smoothstep(.45,.95,shade));
  if(!matte&&!(pic>8.5&&pic<9.5)) c*=mix(vec3(1.),mix(wash,wash2,.6),uWarm.z*(sea?.25:1.)*(1.-smoothstep(-.62,-.3,ndl)));   // faces turned well away: one deeper, solid cobalt
  c*=mix(vec3(1.),mix(wash2,vec3(1.),.35),smoothstep(.6,1.,vShade));
  float hb=smoothstep(.05,.3,shade)*(1.-smoothstep(.6,.95,shade)*(1.-.75*uOpt.y));
  float hl=ln((fract((vTile.x+vTile.y)/.24)-.5)*.24,.04+.02*uOpt.y)*mix(.5+.5*vn(vec2((vTile.x+vTile.y)*6.,(vTile.x-vTile.y)*.5)),1.,.7*uOpt.y);
  if(matte) hl=0.;
  c*=mix(vec3(1.),mix(wash,wash*wash,.6*uOpt.y),hb*hl);
  c=max(c*.84,uFloor);
  if(pic>6.5&&pic<7.5){                                                          // tram yellow stays yellow: the one accent, tiled and pinstriped
    c=uYel*(1.-.3*uWorld.z)*(.8-.22*shade)*(.92+.1*br(vTile*2.))*(1.+(hs-.5)*.1*gDet); c=mix(c,uYel*.5,grt*.8);
    float sq=vSeed<.5?vTile.y:vTile.x; c=mix(c,uDeep,.85*ln((fract(sq/.3)-.5)*.3,.011)); }
  c=mix(c,uYel*(1.25+.75*uWorld.z),clamp(gLit,0.,1.));
  vec3 V=normalize(cameraPosition-vWP+vec3(0.,1e-4,0.));
  vec3 Hh=normalize(uSun+V+vec3(uCamSway.x,uCamSway.y,uCamSway.x*.5)+vec3(0.,1e-4,0.));
  Hh=normalize(mix(vec3(Hh.x,Hh.y*.15,Hh.z),Hh,abs(N.y))+vec3(1e-4,0.,0.));
  float s=max(dot(N,Hh),0.); float s2=s*s; float s8=s2*s2*s2*s2; float s32=s8*s8*s8*s8;
  float blink=flipQ>=0.?.35*sin(3.14159*flipQ)*(1.-gap)*(1.-.7*flipW):0.;
  float fres=1.-max(dot(N,V),0.); fres=fres*fres*fres;
  if(!matte) c=mix(c,uPale*.9,(sea?mix(.08,.03,uWorld.z):.16)*fres);
  if(pic>3.5&&pic<4.5){                                                        // wet paving: sky wash at grazing angles, rippling
    float rp2=vn(vTile*vec2(1.3,2.1)+vec2(uTime*.5,-uTime*.3));
    c=mix(c,mix(uPale,uTin,.35),clamp(fres*.7*uOpt.z,0.,.3*uOpt.z)*(.3+.7*rp2));
    c=mix(c,uTin,.16*uWorld.y*smoothstep(.68,.82,vn(vec2(vTile.x*9.,vTile.y*.35-uTime*2.4)))*clamp(gPat,0.,1.));   // the shower: water running down the paving
  }
  if(pic>12.5&&pic<13.5) c+=vec3(1.,.97,.9)*.9*s8*step(.84,vn(vTile*.22+uTime*vec2(.5,.17)));   // river glitter
  float s128=s32*s32*s32*s32;
  float shn=s32*.055+s128*s128*.5;                                              // the one sheen: on the sea panel a soft band that never hides a figure
  if(sea) shn=min(mix(.2,.07,uWorld.z),.35*shn);
  if(!matte) c+=vec3(1.,.98,.93)*(shn+blink*(.25+(sea?.3:1.)*s8));
  if(pic>8.5&&pic<9.5) c=skyPic(p);                                             // the sky is paint only: no shade, no sheen
  gl_FragColor=vec4(c,1.);
  #include <fog_fragment>
}`;function Re(f=Ve){const m=Ve.map((p,E)=>new i.Color(f&&f[E]||p)),o=[];for(let p=0;p<4;p++)o.push(new i.Vector4(0,-100,0,1));return{uTin:{value:m[0]},uPale:{value:m[1]},uMid:{value:m[2]},uDeep:{value:m[3]},uOchre:{value:m[4]},uMang:{value:m[5]},uYel:{value:m[6]},uSun:{value:new i.Vector3(-.42,.74,.52).normalize()},uCamSway:{value:new i.Vector2},uTime:{value:0},uU:{value:0},uPanel:{value:new i.Vector4(90,20,1.4,1)},uFloor:{value:new i.Vector3(m[3].r*.8,m[3].g*.8,m[3].b*.8)},uWash:{value:new i.Vector3(m[1].r/Math.max(m[0].r,.05),m[1].g/Math.max(m[0].g,.05),m[1].b/Math.max(m[0].b,.05))},uWash2:{value:new i.Vector3(m[2].r/Math.max(m[0].r,.05),m[2].g/Math.max(m[0].g,.05),m[2].b/Math.max(m[0].b,.05))},uWorld:{value:new i.Vector4(0,0,0,0)},uCat:{value:new i.Vector4(0,-100,1,0)},uRare:{value:new i.Vector4(0,0,0,0)},uSky:{value:new i.Vector4(1,0,0,0)},uOpt:{value:new i.Vector4(0,0,1,1)},uWarm:{value:new i.Vector4(0,0,0,1)},uPix:{value:.0011},uSd:{value:new i.Vector4(.5,.5,.5,.5)},uFig:{value:o},uFigB:{value:new i.Vector4(0,0,0,0)}}}function Ge(f={}){const m=f.uniforms||Re(f.palette);return new i.ShaderMaterial({uniforms:Object.assign(f.fog===!1?{}:i.UniformsUtils.clone(i.UniformsLib.fog),m),vertexShader:sa,fragmentShader:oa,fog:f.fog!==!1,side:f.side??i.FrontSide})}function Qe(){const f=[],m=[],o=[],p=[],E=[],g=[],Q=[],X=(n,v)=>[n[0]-v[0],n[1]-v[1],n[2]-v[2]],S={count:()=>f.length/9,vert(n,v,b,x,q,N,P){f.push(n[0],n[1],n[2]),m.push(v[0],v[1],v[2]),o.push(b[0],b[1]),p.push(x),E.push(q),g.push(N||0),Q.push(P||0)},quad(n,v,b,x,q,N,P,w,M,h){const k=Array.isArray(q[0])?q:[q,q,q,q],I=X(v,n),d=X(b,n),$=k[0],ae=(I[1]*d[2]-I[2]*d[1])*$[0]+(I[2]*d[0]-I[0]*d[2])*$[1]+(I[0]*d[1]-I[1]*d[0])*$[2]<0,re=[n,v,b,x],fe=ae?[0,2,1,0,3,2]:[0,1,2,0,2,3];for(const O of fe)S.vert(re[O],k[O],N[O],P,w,M,h)},geo(n,v,b,x,q,N){const P=n.index?n.toNonIndexed():n;P.applyMatrix4(v);const w=P.attributes.position,M=P.attributes.normal,h=P.attributes.uv;for(let k=0;k<w.count;k++)S.vert([w.getX(k),w.getY(k),w.getZ(k)],[M.getX(k),M.getY(k),M.getZ(k)],[h.getX(k)*q[0],h.getY(k)*q[1]],b,x,N);P!==n&&P.dispose(),n.dispose()},async build(n){const v=new i.BufferGeometry;for(const[b,x,q]of[["position",f,3],["normal",m,3],["aTile",o,2],["aPic",p,1],["aSeed",E,1],["aShade",g,1],["aBorder",Q,1]])v.setAttribute(b,new i.Float32BufferAttribute(x,q)),await n?.();return v.computeBoundingSphere(),await n?.(),v.computeBoundingBox(),v}};return S}async function na(f,m={}){const o=f.rng.fork?f.rng.fork("sea-wall"):f.rng,p=40,E=Math.max(50,Math.min(m.arc??90,230)),g=E/(2*p),Q=.9,X=20.2,S=Q+X,n=22.1,v=1.4,b=m.travel===-1?-1:1,x=Re(m.palette);(m.border??(o.chance(.25)?"manganese":"ochre"))==="manganese"&&(x.uOpt.value.x=1),x.uPanel.value.set(E,X,v,b),x.uSd.value.set(o(),o(),o(),o());const q=m.cast==="fishing"?1:m.cast==="galleon"?2:0;x.uFigB.value.z=q;const N=Ge({uniforms:x,side:i.DoubleSide}),P=new i.Group;P.name="azulejo-sea-wall";const w=(e,a,t)=>[(p-a)*Math.sin(e),t,p-(p-a)*Math.cos(e)],M=(e,a,t)=>[-Math.sin(e)*a,t,Math.cos(e)*a],h=Qe();function k(e,a,t,c,s=0){let l=s;for(let r=0;r<e.length-1;r++){const y=e[r],T=e[r+1],A=T[0]-y[0],R=T[1]-y[1],B=Math.hypot(A,R)||1e-6,G=R/B,U=-A/B;for(let u=0;u<c;u++){const D=a+(t-a)*(u/c),j=a+(t-a)*((u+1)/c),Z=M(D,G,U),z=M(j,G,U);h.quad(w(D,y[0],y[1]),w(j,y[0],y[1]),w(j,T[0],T[1]),w(D,T[0],T[1]),[Z,z,z,Z],[[D*p,l],[j*p,l],[j*p,l+B],[D*p,l+B]],y[2]??0,y[3]??0,y[4]??0)}l+=B}}async function I(e,a,t,c){let s=0;for(let l=0;l<e.length-1;l++)k([e[l],e[l+1]],a,t,c,s),s+=Math.hypot(e[l+1][0]-e[l][0],e[l+1][1]-e[l][1])||1e-6,await f.yield?.()}function d(e,a,t,c,s,l,r,y,T,A=0,R=0,B=!0){const G=Math.cos(e),U=Math.sin(e),u=(K,ea,Ye)=>{const Ce=w(e,ea,Ye);return[Ce[0]+G*K,Ye,Ce[2]+U*K]},D=(a+t)/2,j=(c+s)/2,Z=1-R,z=D+(a-D)*Z,Y=D+(t-D)*Z,C=j+(c-j)*Z,V=j+(s-j)*Z,Ie=[G,0,U],Oe=M(e,1,0),je=K=>[-K[0],-K[1],-K[2]],F=e*p;h.quad(u(a,s,l),u(t,s,l),u(Y,V,r),u(z,V,r),Oe,[[F+a,l],[F+t,l],[F+Y,r],[F+z,r]],y,T,A),h.quad(u(a,c,l),u(t,c,l),u(Y,C,r),u(z,C,r),je(Oe),[[F+a,l],[F+t,l],[F+Y,r],[F+z,r]],y,T,A),h.quad(u(t,c,l),u(t,s,l),u(Y,V,r),u(Y,C,r),Ie,[[c,l],[s,l],[V,r],[C,r]],y,T,A),h.quad(u(a,c,l),u(a,s,l),u(z,V,r),u(z,C,r),je(Ie),[[c,l],[s,l],[V,r],[C,r]],y,T,A),B&&h.quad(u(z,C,r),u(Y,C,r),u(Y,V,r),u(z,V,r),[0,1,0],[[F+z,C],[F+Y,C],[F+Y,V],[F+z,V]],y,T,A)}const $=new i.Matrix4,ae=new i.Quaternion,re=new i.Vector3,fe=new i.Vector3,O=(e,a,t,c=1,s=0,l=0)=>{const r=w(e,a,t);return ae.setFromAxisAngle(new i.Vector3(0,1,0),-e+l),$.compose(fe.set(r[0]+Math.cos(e)*s,t,r[2]+Math.sin(e)*s),ae,re.set(c,c,c)).clone()},He=[[0,0],[.42,0],[.42,.12],[.2,.2],[.16,.42],[.34,.6],[.56,.95],[.6,1.25],[.5,1.5],[.3,1.62],[.36,1.7],[.36,1.78],[.2,1.86],[.1,2.1],[.19,2.24],[.12,2.42],[0,2.5]].map(e=>new i.Vector2(e[0],e[1])),we=(e,a,t,c,s,l,r=0)=>h.geo(new i.LatheGeometry(He,12),O(e,a,t,c,r),s,l,[2.4*c,2.6*c],0);k([[0,Q,1,o()],[0,S]],-g,g,144),await f.yield?.(),await I([[.78,0,6,.5],[.78,.2,6,.3],[.64,.28,3,.2,.35],[.64,.6,6,.3],[.5,.68,0,.1],[.36,.76,6,.9],[.36,.84,0,.3],[0,Q]],-g,g,96),await f.yield?.(),await I([[0,S,0,.2,.5],[.12,S+.08,0,.2,.2],[.12,S+.2,0,.4,.75],[.32,S+.4,6,.7],[.32,S+.52,0,.4,.8],[.46,S+.58,0,.6,.15],[.46,S+.7,0,.6,.7],[.7,S+.86,6,.9],[.7,n,5,.3],[.15,n]],-g,g,96),await f.yield?.();const te=o.range(4.6,5.8),L=o.range(3.2,4.2),me=o.range(2.6,3.4),pe=e=>{const a=Math.abs(e);if(a<L)return te+1.5*Math.sqrt(Math.max(0,1-a/L*(a/L)));if(a<L+.6)return te;if(a<L+4.2){const t=(a-L-.6)/3.6;return 1.7+(te-2.7)*(1-t)*(1-t)}return a<L+6.6?1.7+.75*Math.sin(Math.PI*(a-L-4.2)/2.4):1.12+.4*Math.abs(Math.sin((a-L-6.6)*Math.PI/me))},ue=280,_e=o();for(let e=0;e<ue;e++){const a=-g+2*g*e/ue,t=-g+2*g*(e+1)/ue,c=a*p,s=t*p,l=pe(c),r=pe(s),y=(u,D)=>w(u,.15,D),T=(u,D)=>w(u,-.75,D);h.quad(y(a,n),y(t,n),y(t,n+r),y(a,n+l),[M(a,1,0),M(t,1,0),M(t,1,0),M(a,1,0)],[[c,0],[s,0],[s,r],[c,l]],10,_e),h.quad(T(a,n),T(t,n),T(t,n+r),T(a,n+l),[M(a,-1,0),M(t,-1,0),M(t,-1,0),M(a,-1,0)],[[c,0],[s,0],[s,r],[c,l]],3,.4);const A=s-c,R=r-l,B=Math.hypot(A,R),G=(a+t)/2,U=[Math.cos(G)*(-R/B),A/B,Math.sin(G)*(-R/B)];h.quad(w(a,.22,n+l),w(t,.22,n+r),w(t,-.82,n+r),w(a,-.82,n+l),U,[[c,0],[s,0],[s,1],[c,1]],6,.3),e%56===55&&await f.yield?.()}await I([[-.75,n,4,.2],[-1.6,n,0,.3],[-1.6,n-.5,6,.3],[-1.8,n-.62,2,.6],[-3.4,0]],-g,g,72);const ye=o.int(6,8);for(let e=0;e<ye;e++){const a=-g+2*g*(e+.5)/ye+o.range(-.02,.02),t=o.range(1.1,1.4);d(a,-t,t,-5.7,-2.6,0,7+o.range(-.6,.6),3,o(),0,.07),d(a,-t*.86,t*.86,-4.5,-2.2,6.4,14,3,o(),0,.08),d(a,-t*.72,t*.72,-3.4,-1.9,13.4,19,0,o(),0,.1),d(a,-t*.8,t*.8,-3.5,-1.8,19,19.35,6,.3,0,.3)}await f.yield?.();for(const e of[-1,1]){const a=e*g,t=e>0?-.25:-2.75,c=e>0?2.75:.25,s=n+1.2+o.range(0,.8),l=o();d(a,t-.22,c+.22,-4,1.32,0,1.5,6,.5,0,.03),d(a,t,c,-3.8,1.1,1.5,s,2,l),d(a,t+.55,c-.55,1.1,1.18,3.2,s-2.4,3,l+.3,0,0,!1),d(a,t+.4,c-.4,1.1,1.22,2.9,3.2,6,.9),d(a,t+.4,c-.4,1.1,1.22,s-2.4,s-2.1,6,.9),d(a,t-.15,c+.15,-3.95,1.25,s,s+.25,6,.7),d(a,t-.34,c+.34,-4.14,1.44,s+.25,s+.85,0,l,.1),d(a,t-.2,c+.2,-4,1.3,s+.85,s+2.2,5,l,0,.62),we(a,-1.35,s+2.2,1.45,2,l+.1,(t+c)/2),await f.yield?.()}const ve=(e,a)=>{const t=e/p,c=n+pe(e);d(t,-.36*a,.36*a,-.72,.12,c-.5,c+.3*a,0,.5,.1),we(t,-.3,c+.3*a,.72*a,o.chance(.5)?2:3,o())};for(const e of[-1,1]){ve(e*(L+.3),1.15),ve(e*(L+5.4),.95),await f.yield?.();for(let a=L+6.6+me*2;a<E/2-2;a+=me*3)ve(e*a,.85),await f.yield?.()}const be=[[0,0],[.3,0],[.34,.1],[.5,.55],[.52,.72],[.58,.76],[.58,.86],[.46,.86],[0,.8]].map(e=>new i.Vector2(e[0],e[1])),Ue=o.int(5,8);for(let e=0;e<Ue;e++){const a=(o.chance(.5)?-1:1)*o.range(.25,g-.06),t=o.range(.9,1.25);h.geo(new i.LatheGeometry(be,12),O(a,1.3,0,t),o.chance(.5)?2:3,o(),[2,.9],0);const c=new i.IcosahedronGeometry(.6*t,1);c.scale(1,o.range(1.3,2.1),1),h.geo(c,O(a,1.3,(.86+.8)*t,1),16,o.range(.22,.5),[3.4,3.4],.3),await f.yield?.()}{const e=(o.chance(.5)?-1:1)*o.range(.45,Math.min(.95,g-.1)),a=o.range(7.5,10.5),t=O(e,1.75,.02).multiply(new i.Matrix4().makeRotationX(-Math.atan2(1.5,a)));for(const c of[-.3,.3])h.geo(new i.BoxGeometry(.08,a,.1),t.clone().multiply(new i.Matrix4().makeTranslation(c,a/2,0)),6,.3,[.2,a],0);for(let c=.4;c<a-.2;c+=.34)h.geo(new i.BoxGeometry(.6,.06,.06),t.clone().multiply(new i.Matrix4().makeTranslation(0,c,0)),6,.3,[.6,.1],0);h.geo(new i.LatheGeometry(be,10),O(e,1.5,0,.5,.9),6,.1,[1,.5],0)}await f.yield?.();const J=n+te+1.5;d(0,-.42,.42,-.74,.14,J-.3,J+.7,0,.5,.1,.25),h.geo(new i.CylinderGeometry(.07,.1,1,6),O(0,-.3,J+1.15),6,.9,[.5,1],0),await f.yield?.();const qe=new i.Mesh(await h.build(f.yield),N);qe.name="sea-wall",P.add(qe),await f.yield?.();const H=Qe(),Me=new i.Matrix4,Ze=e=>new i.Matrix4().makeRotationX(e),Te=e=>new i.Matrix4().makeRotationZ(e);H.geo(new i.TorusGeometry(1.5,.075,6,40),Me,6,.7,[9,.5],0),await f.yield?.(),H.geo(new i.TorusGeometry(1.5,.075,6,40),Ze(Math.PI/2),6,.7,[9,.5],0),await f.yield?.(),H.geo(new i.TorusGeometry(1.5,.075,6,40),new i.Matrix4().makeRotationY(Math.PI/2),6,.7,[9,.5],0),await f.yield?.(),H.geo(new i.CylinderGeometry(1.64,1.64,.34,40,1,!0),Te(.41),6,.9,[10,.34],0),H.geo(new i.CylinderGeometry(.05,.05,3.9,6),Te(.41+Math.PI/2-1.2),6,.5,[.3,3.9],0),H.geo(new i.SphereGeometry(.42,12,8),Me,6,.5,[2,1],0),await f.yield?.();const ce=new i.Mesh(await H.build(f.yield),N);ce.name="armillary";{const e=w(0,-.3,J+3.2);ce.position.set(e[0],e[1],e[2])}P.add(ce),await f.yield?.();const xe=(e,a,t)=>e+(a-e)*t,ee=(e,a,t)=>{const c=Math.min(1,Math.max(0,(t-e)/(a-e)));return c*c*(3-2*c)},Xe=v+(X-2*v)*(.6+.05*x.uSd.value.x),ie=e=>xe(v+.75,Xe-.2,1-Math.pow(1-e/9,1.7)),le=e=>xe(1.5,.4,Math.pow(e/9,.8)),se=e=>Math.floor(e/Ne)*Ne,ke=q===1?.8:1,Pe=q===2?1.32:q===1?1.12:1.27,De=[{off:0,y:ie(2)+.3*le(2),s:Pe,ph:0},{off:o.range(17,21),y:ie(4)+.3*le(4),s:ke*.84,ph:1.9},{off:o.range(34,39),y:ie(4)+.42*le(4),s:ke*.78,ph:4.1}],Se=o.range(14,16),ze=ie(1)+.3*le(1),Je=13.5,oe=E+De[2].off+5,he=E/2-v-7.5,Ke=Math.acos(.8);let de=null,ne=null,_=0,ge=0;const Le=new i.Vector3,We=new i.Vector3,Fe=(e,a,t)=>{const c=e*b/p;return t.set((p-.05)*Math.sin(c),Q+a,p-(p-.05)*Math.cos(c))};function Ee(e){if(ne!=null){let c=(ne*b+Ke)*p;c>he-6&&(c=he-6*Math.exp(-(c-he+6)/6)),_=c,ge=de!=null?Math.min(1,Math.max(0,(de-.3)/.5)):(e/9+.1)%1}else _=-E/2-8+((e*Je+oe-89)%oe+oe)%oe,ge=((e/9+.1)%1+1)%1;for(let c=0;c<3;c++){const s=De[c],l=_-s.off,r=l*.29+s.ph+e*.8;x.uFig.value[c].set(se(l),q===2&&c?-100:se(s.y+.3*s.s*Math.sin(r)),.075*Math.cos(r)+.02,s.s)}const a=ge,t=-4.7+6.1*ee(0,.3,a)-7.2*ee(.66,1,a);x.uFig.value[3].set(se(_-Se+2.5*a),se(ze+t),xe(.38,-.55,ee(.25,.95,a)),1),x.uFigB.value.x=ee(.26,.36,a)*(1-ee(.5,.62,a)),x.uFigB.value.w=_,Fe(_,x.uFig.value[0].y+4.5*Pe,Le),Fe(_-Se,ze+1,We)}Ee(12);const W=(e,a,t)=>new i.Vector3(e,a,t),Ae=[];for(let e=0;e<=12;e++){const a=b*(-1.5+3*e/12);Ae.push(W(32*Math.sin(a),12-5*e/12,p-32*Math.cos(a)))}const $e={arcCentre:W(0,0,p),wallRadius:p,trackRadius:32,travel:b,flyThrough:Ae,lead:Le,whale:We,portalSeat:{position:W(0,9,p),facing:W(0,0,-1)},viewpoints:{midTurn:{position:W(0,9.6,8),target:W(b*22,10,6.5)},wide:{position:W(-b*18,15,74),target:W(0,13,6)},end:{position:W(b*30,8,26),target:W(b*34,11,15)}},crestTop:W(0,J+3.2,-.3),sunHint:x.uSun.value.clone()};let Be=o.range(0,6.28);return{object:P,radius:27,height:Math.round(J+5),center:W(0,12,9),anchors:$e,uniforms:x,material:N,makeTileMaterial:Ge,setProgress(e){de=e,ne=e==null?null:(-.5+Math.min(1,Math.max(0,e)))*Math.PI},setCab(e){ne=e},update(e,a,t){x.uTime.value=a,Ee(a),Be+=e*.5*(1+.6*Math.sin(a*.31)),ce.rotation.set(.12*Math.sin(a*.7),Be,.41*.3)},dispose(){},ground:!0,groundY:0}}export{Ve as AZULEJO_PALETTE,na as buildHero,Ge as makeTileMaterial,Re as makeTileUniforms};
