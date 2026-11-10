import*as y from"three";const ze=["#6E9FCB","#F2F0E8","#C2C8D1","#1A2236","#2B3037","#EEC455","#5F8794"],K={horizon:"#BCD3E3",nightHorizon:"#2C3A55",metal:"#8F9498",slate:"#26333F",leaf:"#1F2E28",wood:"#B58850",shade:"#1E242B"},re=Math.PI-Math.atan2(68,210),ve=45*Math.PI/180/45,B=a=>new y.Color(a);function ye(){return{uCvO:{value:new y.Vector3(0,92.5,0)},uCvU:{value:new y.Vector3(1,0,0)},uCvV:{value:new y.Vector3(0,1,0)},uCvN:{value:new y.Vector3(0,0,1)},uCvH:{value:new y.Vector4(107.6,80.1,110,82.5)},uKey:{value:new y.Vector3(-.6,.7,-.4).normalize()},uMoon:{value:new y.Vector3(.2366,.2079,.949).normalize()},uT:{value:0},uSeaY:{value:0},uSeed:{value:0},uAsh:{value:new y.Vector4(1,0,0,0)},uSky:{value:new y.Vector4(1,0,0,0)},uP:{value:[B("#6E9FCB"),B("#BCD3E3"),B("#F2F0E8"),B("#C2C8D1"),B("#1A2236"),B("#2C3A55"),B("#26333F"),B("#5F8794"),B("#8E9AAE"),B("#3A4862")]}}}const X={uniforms:ye()},ne=`
uniform vec3 uCvO; uniform vec3 uCvU; uniform vec3 uCvV; uniform vec3 uCvN; uniform vec4 uCvH;
uniform vec3 uKey; uniform vec3 uMoon; uniform float uT; uniform float uSeaY; uniform float uSeed; uniform vec3 uP[10];
uniform vec4 uAsh; uniform vec4 uSky;
#define CFS_ROW 0.19199
#define CFS_SROW 0.10472
#define CFS_TAU 6.2831853
float cfsH(vec2 p){ vec3 p3=fract(vec3(p.xyx)*.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
// where the segment a->b meets the canvas plane, in canvas metres from its centre; z = 1 if it does
vec3 cfsMeet(vec3 a, vec3 b){
  float da=dot(a-uCvO,uCvN), db=dot(b-uCvO,uCvN);
  if(da*db>=0.) return vec3(0.);
  float t=da/(da-db); vec3 h=a+(b-a)*t-uCvO;
  return vec3(dot(h,uCvU),dot(h,uCvV),1.);
}
float cfsInside(vec3 m){ return m.z*step(abs(m.x),uCvH.x)*step(abs(m.y),uCvH.y); }
// +1: the sight line a->b goes through the opening; -1: it crosses the plane beside it; 0: it does not cross
float cfsCross(vec3 a, vec3 b){ vec3 m=cfsMeet(a,b); return m.z*(cfsInside(m)*2.-1.); }
float cfsSide(vec3 a){ return step(dot(a-uCvO,uCvN),0.); }           // 0 = noon side, 1 = night side
// the hour (0 noon, 1 night) in which the eye sees the point P
float cfsWhich(vec3 eye, vec3 P){ return abs(cfsSide(eye)-cfsInside(cfsMeet(eye,P))); }

// one cumulus cell. returns (signed distance in radians, positive inside; light 0..1). keep>0.5: only the few night clouds
vec2 cfsCloudP(float az, float el, float keep, float pk){
  float row=floor(el/CFS_ROW);
  if(row<0.||row>5.) return vec2(-1.,0.);
  float elc=(row+.5)*CFS_ROW, cr=cos(elc);
  float n=max(4.,floor(mix(32.,54.,pk)*cr+.5)), cw=CFS_TAU/n;
  float a=az/cw+row*.37, c=floor(a), ci=mod(c,n);
  if(keep>.5){
    float sel=(1.-step(.5,abs(row-1.)))*(1.-step(.5,abs(mod(ci,5.)-1.)))+(1.-step(.5,abs(row-2.)))*(1.-step(.5,abs(mod(ci,7.)-3.)));
    if(sel<.5) return vec2(-1.,0.);
  }
  vec2 id=vec2(ci,row)+uSeed*vec2(7.,13.);
  float h1=cfsH(id+3.1), h2=cfsH(id+17.7), h3=cfsH(id+41.3);
  float w=CFS_ROW*(.40+.16*h1)*(row<.5?.8:1.);
  vec2 p=vec2((a-c-.5)*cw*cr, el-elc);
  p-=vec2((h2-.5)*max(cw*cr-w*1.15,0.), (h3-.5)*CFS_ROW*mix(.34,.08,pk));
  float y0=-w*.15, best=-1., lit=0.;
  for(int i=0;i<7;i++){
    float fi=float(i), hx=cfsH(id*7.+vec2(fi,5.)), hy=cfsH(id*7.+vec2(fi,23.));
    float t=(fi+.5)/3.5-1.;
    float r=w*(.085+.105*(1.-t*t)+.085*hx);
    vec2 cp=vec2(t*w*.37+(hy-.5)*w*.08, y0+r*(.42+.75*hy*(1.-abs(t))));
    vec2 dv=p-cp; float dd=r-length(dv);
    if(dd>best){ best=dd; lit=dot(dv,vec2(-.45,.89))/max(r,1e-5); }
  }
  float sd=min(best,p.y-y0);
  float val=clamp(.5+.40*lit+.50*((p.y-y0)/max(w*.40,1e-5)-.5),0.,1.);
  return vec2(sd,val);
}
vec2 cfsCloud(float az, float el, float keep){ return cfsCloudP(az,el,keep,uSky.x); }
float cfsAz(vec3 d){ return (abs(d.x)+abs(d.z)>1e-5)?atan(d.x,d.z):0.; }
vec3 cfsNoon(vec3 d, float drift, float px){
  float g=1.-clamp(d.y,0.,1.); g=g*g*g*g*g;
  vec3 c=mix(uP[0],uP[1],g);
  vec2 k=cfsCloud(cfsAz(d)+drift, asin(clamp(d.y,-1.,1.)), 0.);
  px=max(px,1e-5);
  return mix(c, mix(uP[3],uP[2],smoothstep(.30,.72,k.y)), smoothstep(-px,px,k.x));
}
vec3 cfsNight(vec3 d, float drift, float px){
  float g=1.-clamp(d.y,0.,1.); g=g*g*g*g*g;
  vec3 c=mix(uP[4],uP[5],g);
  px=max(px,1e-5);
  float az=cfsAz(d), el=asin(clamp(d.y,-1.,1.));
  // stars: one soft disc per cell, never under about 2.4 pixels across, never flickering
  float sr=floor(el/CFS_SROW), sec=(sr+.5)*CFS_SROW, scr=max(cos(sec),.02);
  float sn=max(3.,floor(60.*scr+.5)), scw=CFS_TAU/sn;
  float sa=az/scw+sr*.61, sc=floor(sa); vec2 sid=vec2(mod(sc,sn),sr);
  vec2 sp=vec2((sa-sc-.5)*scw*scr, el-sec)-(vec2(cfsH(sid+11.3),cfsH(sid+23.9))-.5)*CFS_SROW*.62;
  float r0=.0013*(.6+1.2*cfsH(sid+37.1)), r=max(r0,1.2*px);
  float st=(1.-smoothstep(r*.4,r,length(sp)))*step(.48,cfsH(sid+71.7))*step(0.,el)*clamp(r0*r0/(r*r)+.4,0.,1.);
  c=mix(c,uP[2],st*.92);
  vec2 k=cfsCloud(az+drift*.35, el, 1.);
  c=mix(c, mix(uP[9],uP[8],smoothstep(.30,.72,k.y)), smoothstep(-px,px,k.x));
  // the crescent: 5 degrees wide, flat lead white, no halo
  vec3 mr=normalize(cross(vec3(0.,1.,0.),uMoon)+vec3(1e-6,0.,0.)), mu=cross(uMoon,mr);
  vec2 q=vec2(dot(d,mr),dot(d,mu));
  float m=min(.0436-length(q), length(q-vec2(.0436*.40,.0436*.12))-.0436*.90);
  return mix(c,uP[2],smoothstep(-px,px,m)*step(0.,dot(d,uMoon)));
}
// the ray a cut is filled with: folded above the horizon and lifted 9 degrees, so a cut low in the view is still blue
// sky with cumulus in it and never the pale horizon band
vec3 cfsCutRay(vec3 d){
  float el=asin(clamp(abs(d.y),0.,1.))*.88+.157;
  vec2 h=d.xz+vec2(0.,1e-6);
  return vec3(normalize(h)*cos(el),sin(el)).xzy;
}
// the noon INSIDE a cut: the same sky and the same alike cumulus (4 to 7 degrees wide), but set closer in their rows and
// with a second set of rows between the first, so that every curtain, back and dove carries whole clouds, white top and
// grey underside, and no cut is a sheet of plain blue. (His sky-birds hold a fuller sky than the one they fly in.)
vec3 cfsNoonCut(vec3 d, float drift, float px){
  float g=1.-clamp(d.y,0.,1.); g=g*g*g*g*g;
  vec3 c=mix(uP[0],uP[1],g);
  float az=cfsAz(d)+drift, el=asin(clamp(d.y,-1.,1.));
  vec2 k=cfsCloudP(az,el,0.,.55), k2=cfsCloudP(az+1.31,el+CFS_ROW*.5,0.,.55);
  if(k2.x>k.x) k=k2;
  px=max(px,1e-5);
  return mix(c, mix(uP[3],uP[2],smoothstep(.30,.72,k.y)), smoothstep(-px,px,k.x));
}
// which: 0 noon, 1 night. dir: +1 for the sky itself, -1 inside a cut (its clouds slide the other way)
vec3 cfsHour(vec3 d, float which, float dir, float px){
  float drift=dir*uT*${ve.toFixed(6)};
  if(which<.5) return cfsNoon(d,drift,px);
  return cfsNight(d,drift,px);
}
// his sea is ruled with alike wavelets: one short bowed crest to a cell in staggered rows, riding with the swell; each
// gives way to the flat average before it is finer than about three pixels. fp: a pixel's footprint along the sight line
float cfsCrest(vec3 P, float fp){
  float fade=1.-smoothstep(.2,.55,fp);
  if(fade<=0.) return 0.;
  vec2 q=vec2(dot(P.xz,vec2(.94,.34)), dot(P.xz,vec2(-.34,.94))+uT*.9);
  vec2 g=vec2(q.x/9.,q.y/4.2); g.x+=.5*mod(floor(g.y),2.);
  vec2 id=floor(g), f=fract(g)-.5;
  f-=(vec2(cfsH(id+3.),cfsH(id+9.))-.5)*.3;
  float x=f.x*9., a=2.5+1.3*cfsH(id+21.), xa=clamp(x/a,-1.,1.), arch=1.-xa*xa;
  float z=f.y*4.2-.42*arch, e=max(fp*.8,.03), th=.36*arch;
  return fade*smoothstep(-e,e,z+th)*(1.-smoothstep(-e,e,z))*step(abs(x),a);
}
// the sea at world point P seen from eye, in the hour "which": slate bay under noon, sunlit green under night
vec3 cfsSea(vec3 P, vec3 eye, float which, float px){
  vec3 v=P-eye; float dist=length(v); vec3 ray=v/max(dist,1e-4);
  float fade=1./(1.+dist*.006);
  vec2 wv=vec2(sin(P.x*.21+P.z*.13+uT*.55)+sin(P.z*.37-uT*.36), sin(P.z*.19-P.x*.11+uT*.43)+sin(P.x*.31+uT*.29));
  vec3 r=normalize(vec3(ray.x,abs(ray.y)+.02,ray.z)+vec3(wv.x,0.,wv.y)*mix(.006,.016,which)*fade);
  vec3 m=cfsMeet(P+vec3(0.,.02,0.), P+r*30000.);
  float in2=cfsInside(m);
  float g=1.-clamp(r.y,0.,1.); g=g*g*g*g*g; float w2=abs(which-in2);
  vec3 sky=mix(mix(uP[0],uP[1],g),mix(uP[4],uP[5],g),w2);          // the water takes the hour's sky, not its clouds
  float bar=m.z*step(abs(m.x),uCvH.z)*step(abs(m.y),uCvH.w)*(1.-in2);
  sky=mix(sky,uP[2]*.92,bar);
  vec3 base=mix(uP[6]*.90,uP[7]*1.10,which);                     // measured: lands on #26333F and #5F8794 after the reflection
  float band=sin(dot(P.xz,vec2(.021,.046))+uT*.55+.6*sin(dot(P.xz,vec2(-.013,.008))))*.5+.5;
  band=band*band*(3.-2.*band);
  base*=1.+(.05+.11*which)*(band*2.-1.)/(1.+dist*dist*2.5e-6);
  // near the eye, short wavelets ride the long bands (gone before they are finer than a few pixels)
  float rp=sin(P.x*.83+P.z*.37+uT*1.1+1.7*sin(P.z*.21-uT*.4))*sin(P.z*1.21-P.x*.33-uT*.9);
  base*=1.+mix(.04,.09,which)*rp/(1.+dist*dist*4e-4);
  base*=1.+mix(.10,.20,which)*cfsCrest(P,dist*px*1.5/max(-ray.y,.03));
  float k=1.-clamp(-ray.y,0.,1.); k*=k; k*=k;
  vec3 c=mix(base,sky,mix(.012,.03,which)+mix(.07,.10,which)*k+.5*bar*(1.-k)+.16*in2);
  // the reflected ray goes through hour(): the cumulus of noon lie pale in the slate bay, the crescent, the stars and the
  // moonlit clouds in the sunlit sea; between them the water keeps its pigment exactly
  vec3 grad=mix(mix(uP[0],uP[1],g),mix(uP[4],uP[5],g),w2);
  vec3 img=cfsHour(r,w2,1.,px*2.5);
  return mix(c,img,mix(.10,.30,w2)*clamp(distance(img,grad)*1.6,0.,1.)*(1.-bar));
}
// his small marks, as a multiplier on the local colour. fp: the footprint of a pixel in metres; every mark gives way to
// its flat average before it is finer than about 3 pixels. kind: 2 speckled stone, 3 setts, 4 slats, 5 tiles, 8 ashlar
float cfsSpeck(vec3 P, float fp){
  float f1=1.-smoothstep(.010,.030,fp), f2=1.-smoothstep(.04,.13,fp), s=0.;
  if(f1>0.){ vec3 q=floor(P*40.); float h=cfsH(q.xz+q.y*17.13); s+=f1*(step(.9,h)-step(h,.13))*.16; }
  if(f2>0.){ vec3 q=floor(P*9.); float h=cfsH(q.xz*1.7+q.y*31.7+5.); s+=f2*(h-.5)*.10; }
  return s;
}
float cfsDetail(float kind, vec3 P, float fp, float fq){
  if(kind>9.5){                                                   // stucco ruled as banded masonry: level joints a value darker
    float fade=1.-smoothstep(.05,.14,fp), t=fract(P.y/.46);
    float joint=1.-smoothstep(0.,max(fq*.6,.008),min(t,1.-t)*.46-.02);
    return mix(.94,1.-.30*joint,fade);
  }
  if(kind<2.5) return 1.+cfsSpeck(P,fp);
  if(kind<3.5){
    float fade=1.-smoothstep(.07,.17,fp);
    vec2 g=vec2(P.x/.44,P.z/.27); g.x+=.5*mod(floor(g.y),2.);
    vec2 f=.5-abs(fract(g)-.5);
    float dm=min(f.x*.44,f.y*.27), joint=1.-smoothstep(0.,max(fq*.6,.006),dm-.016);
    return mix(.95,1.-.34*joint+(cfsH(floor(g))-.5)*.13,fade)+cfsSpeck(P,fp)*.6;
  }
  if(kind<4.5){
    float fade=1.-smoothstep(.018,.04,fp), t=fract(P.y/.13);
    float band=smoothstep(0.,.18,t)*(1.-smoothstep(.55,.8,t));
    return mix(.93,.80+.26*band,fade);
  }
  if(kind<5.5){
    float fade=1.-smoothstep(.045,.10,fp), row=floor(P.y/.30), t=fract(P.y/.30);
    float t2=abs(fract(P.z/.32+.5*mod(row,2.))-.5)*2.;
    return mix(.90,(1.-.24*(1.-smoothstep(0.,.3,t)))*(1.-.12*smoothstep(.75,1.,t2)),fade);
  }
  float fade=1.-smoothstep(.35,.8,fp), row=floor(P.y/1.86);
  vec2 g=vec2(dot(P.xz,uAsh.xy)/3.9+.5*mod(row,2.)+.31*mod(row,3.),P.y/1.86);
  vec2 f=.5-abs(fract(g)-.5);
  float dm=min(f.x*3.9,f.y*1.86), joint=1.-smoothstep(0.,max(fq*.6,.01),dm-.045);
  return mix(.96,1.-.30*joint+(cfsH(floor(g)+7.)-.5)*.10,fade)+cfsSpeck(P,fp);
}
// primed cloth folded over the stretcher (kind 9): a plain weave, seen only near and its flat average beyond, and one
// ruled grey selvedge thread along the folded sides. Measured in the canvas's own frame.
float cfsCloth(vec3 P, vec3 n, float fp){
  vec3 q=vec3(dot(P-uCvO,uCvU),dot(P-uCvO,uCvV),dot(P-uCvO,uCvN));
  vec3 a=abs(vec3(dot(n,uCvU),dot(n,uCvV),dot(n,uCvN)));
  float front=step(a.x,a.z)*step(a.y,a.z);
  vec2 t=front>.5?q.xy:(a.x>a.y?q.yz:q.xz);
  vec2 w=sin(t*39.27);
  float m=1.+.06*(1.-smoothstep(.016,.045,fp))*w.x*w.y;
  float wl=max(.05,fp*1.2), d=abs(q.z+1.45);
  m*=1.-.2*(1.-front)*(1.-smoothstep(wl*.5,wl,d))*min(1.,.1/wl+.3);
  return m;
}
// five smooth values against the fixed key; a little stiff, as he is
float cfsRamp(float ndl){ float x=clamp(ndl*.5+.5,0.,1.)*4.; return clamp((floor(x)+smoothstep(.18,.82,fract(x)))*.25,0.,1.); }
vec3 cfsPaint(vec3 local, float v, float hi){
  vec3 c=mix(local*vec3(.60,.64,.72), local, clamp(v/.75,0.,1.));
  return mix(c, mix(local,vec3(1.),.62), hi*smoothstep(.80,1.,v));
}
`,ie=(a,d=X.uniforms)=>Object.assign({},d,a);function ke(a=X.uniforms){return new y.ShaderMaterial({uniforms:ie({},a),depthWrite:!1,side:y.BackSide,fog:!1,vertexShader:`
      varying vec3 vDir;
      void main(){ vDir=position; vec4 p=projectionMatrix*viewMatrix*vec4(position+cameraPosition,1.);
        if(abs(p.w)<1e-4) p.w=1e-4; gl_Position=p.xyww; }`,fragmentShader:ne+`
      varying vec3 vDir;
      void main(){
        vec3 d=normalize(vDir+vec3(0.,1e-7,0.));
        float px=max(length(fwidth(d))*.7,1e-5), py=max(fwidth(d.y),1e-5);
        vec3 eye=cameraPosition;
        float which=cfsWhich(eye,eye+d*30000.);
        vec3 c=vec3(0.);
        float hz=smoothstep(-py,py,d.y);
        if(eye.y<=uSeaY+.05) hz=1.;
        if(hz>0.) c+=hz*cfsHour(vec3(d.x,max(d.y,0.),d.z),which,1.,px);
        if(hz<1.){
          float t=(eye.y-uSeaY)/max(-d.y,py*.5);
          vec3 P=eye+d*t;
          c+=(1.-hz)*cfsSea(P,eye,cfsWhich(eye,P),px);
        }
        gl_FragColor=vec4(c,1.);
      }`})}function xe(a=X.uniforms){const d=new y.Mesh(new y.IcosahedronGeometry(60,3),ke(a));return d.frustumCulled=!1,d.renderOrder=-.5,d.name="cfs-sky-and-sea",d}const Ce=`
  attribute vec3 color; attribute vec2 aFx;
  #ifdef CFS_SWAY
    attribute float aSway;
  #endif
  uniform float uMirror; uniform float uSeaY; uniform float uT;
  varying vec3 vW; varying vec3 vN; varying vec3 vC; varying vec2 vFx;
  void main(){
    vec4 w=vec4(position,1.); vec3 n=normal;
    #ifdef USE_INSTANCING
      w=instanceMatrix*w; n=mat3(instanceMatrix)*n;
    #endif
    w=modelMatrix*w; vN=mat3(modelMatrix)*n; vC=color; vFx=aFx;
    #ifdef CFS_SWAY
      w.x+=aSway*sin(uT*.9+w.z*.07+w.x*.05); w.z+=.5*aSway*sin(uT*.63+w.x*.09);
    #endif
    if(uMirror>.5){ float dp=max(w.y-uSeaY,0.);                 // height above the sea = depth of the image
      w.y=2.*uSeaY-w.y;
      w.x+=sin(dp*.55+uT*.9+w.z*.05)*min(dp*.03,.9); w.z+=sin(dp*.47-uT*.7+w.x*.05)*min(dp*.03,.9); }
    vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w;
  }`,Me=ne+`
  uniform float uMode; uniform float uMirror; uniform float uClip;
  varying vec3 vW; varying vec3 vN; varying vec3 vC; varying vec2 vFx;
  void main(){
    vec3 eye=cameraPosition;
    vec3 ea=eye, pb=vW;
    if(uMirror>.5){ ea.y=2.*uSeaY-ea.y; pb.y=2.*uSeaY-pb.y; }      // the image is tested as the thing it mirrors
    float cr=cfsCross(ea,pb);
    if(uMode>.5&&uMode<1.5&&cr<-.5) discard;                       // a thing of the far side, seen past the canvas
    if(uMode>1.5&&cr>.5&&cfsSide(eye)<.5) discard;                 // the easel behind the picture
    if(uMirror<.5&&uClip>.5&&vW.y<uSeaY) discard;
    if(uMirror>.5&&vW.y>uSeaY) discard;
    vec3 n=normalize(vN+vec3(0.,1e-6,0.));
    if(gl_FrontFacing==(uMirror>.5)) n=-n;
    float kind=vFx.y, fpx=length(dFdx(vW)), fpy=length(dFdy(vW)), fp=max(sqrt(fpx*fpy),1e-4), fq=max(max(fpx,fpy),1e-4);
    vec3 c;
    if(kind>6.5&&kind<7.5){                                        // a real cumulus: lead white top, grey underside
      float hr=clamp((pb.y-vC.g)/max(vC.b,1e-3),0.,1.);              // height in the cloud (its foot and height ride in the colour)
      // each puff is modelled by the key like any solid (white where it faces the key, grey where it turns away), so the
      // puffs stand apart from one another seen from any side, above included; and the flat foot is grey
      float ao=clamp((1.-length(vN))*2.,0.,1.);                       // the crease between two puffs (see addCumulus)
      // and like the cumulus of the dome it is two-toned by height: a grey foot under a white top, the border between
      // them lifted on the side away from the key
      // them lifted on the side away from the key; and every puff has its own white crown and grey flank
      float v=.5*hr+.6*n.y+.2*dot(n,uKey)-.8*ao;
      c=mix(uP[3],uP[2],smoothstep(.18,.62,v));
    } else if(kind>5.5&&kind<6.5){                                 // a window pane: flat yellow, dimming one at a time
      float w=fract(uT*.03+vFx.x), dim=smoothstep(0.,.025,w)*(1.-smoothstep(.07,.095,w));
      c=mix(vC,vec3(.035,.045,.06),dim*.8);
    } else if(kind>.5&&kind<1.5){ c=vC;                            // flat decal: contact shadow, peg hole
    } else {
      float ndl=dot(n,uKey), ndv=abs(dot(n,normalize(ea-pb+vec3(0.,1e-6,0.))));
      c=cfsPaint(vC,cfsRamp(ndl),0.);
      // metal and turned wood: the form goes a value darker where it turns away at its edge, and the highlight is one
      // small pale spot in the same place on every one
      // (and the turning runs on through light and shade, so a ball seen from either side of the key is still a ball)
      c*=mix(1.,(.62+.58*(ndl*.5+.5))*(1.+.2*n.y),vFx.x);
      c*=1.-.34*vFx.x*(1.-smoothstep(0.,.62,ndv));
      c=mix(c,mix(vC,vec3(1.),.62),vFx.x*smoothstep(.9,.965,ndl));
      // and in its shade a reflected light, low on the side away from the key, as the academy models a ball: so a bell
      // seen from its dark side is still round (one value, never a second light: nothing else is lit by it)
      c*=1.+.46*vFx.x*smoothstep(.2,.9,dot(n,normalize(vec3(-uKey.x,-.45*uKey.y,-uKey.z))));
      if(kind>8.5&&kind<9.5) c*=cfsCloth(vW,n,fp); else if(kind>1.5) c*=cfsDetail(kind,vW,fp,fq);
    }
    if(uMirror>.5) c=mix(c,mix(uP[6],uP[7],cfsWhich(eye,vW)),.58);
    gl_FragColor=vec4(c,1.);
  }`;function Fe({mode:a=1,mirror:d=!1,clip:o=!1,sway:h=!1}={},m=X.uniforms){return new y.ShaderMaterial({uniforms:ie({uMode:{value:a},uMirror:{value:d?1:0},uClip:{value:o?1:0}},m),vertexShader:(h?`#define CFS_SWAY
`:"")+Ce,fragmentShader:Me,side:y.DoubleSide,fog:!1})}const Ae=`
  attribute float aSway;
  uniform float uT;
  varying vec3 vW; varying float vSh;
  void main(){
    vec3 p=position;
    float s=aSway*sin(uT*.7+position.x*.045+position.y*.012);
    p.z+=s; p.x+=.35*aSway*sin(uT*.52+position.y*.02);
    vec4 w=vec4(p,1.);
    #ifdef USE_INSTANCING
      w=instanceMatrix*w;
    #endif
    w=modelMatrix*w; vW=w.xyz;
    vSh=clamp(.5-.5*dot(normalize(mat3(modelMatrix)*normal+vec3(0.,0.,1e-6)),vec3(-.6,.2,.77)),0.,1.);
    gl_Position=projectionMatrix*viewMatrix*w;
  }`,Ve=ne+`
  uniform float uMode; uniform float uFold; uniform float uClip; uniform float uMirror;
  varying vec3 vW; varying float vSh;
  void main(){
    vec3 eye=cameraPosition;
    vec3 ea=eye, pb=vW;
    if(uMirror>.5){ ea.y=2.*uSeaY-ea.y; pb.y=2.*uSeaY-pb.y; if(vW.y>uSeaY) discard; }
    if(uMode>.5&&cfsCross(ea,pb)<-.5) discard;
    if(uMirror<.5&&uClip>.5&&vW.y<uSeaY) discard;
    vec3 d=normalize(vW-eye+vec3(0.,1e-6,0.));
    float px=max(length(fwidth(d))*.7,1e-5);
    vec3 c=cfsNoonCut(cfsCutRay(d),-uT*${ve.toFixed(6)},px);                 // noon sky by view ray, drift reversed, cloud-rich
    c*=1.-uFold*vSh;
    if(uMirror>.5) c=mix(c,mix(uP[6],uP[7],cfsWhich(eye,vW)),.80);
    gl_FragColor=vec4(c,1.);
  }`;function we({mode:a=1,fold:d=0,clip:o=!1,mirror:h=!1,vertexShader:m=Ae}={},x=X.uniforms){return new y.ShaderMaterial({uniforms:ie({uMode:{value:a},uFold:{value:d},uClip:{value:o?1:0},uMirror:{value:h?1:0}},x),vertexShader:m,fragmentShader:Ve,side:y.DoubleSide,fog:!1})}const e=(a,d,o)=>new y.Vector3(a,d,o);function ce(){const a=[],d=[],o=[],h=[],m=e(),x=e(),c=e(),g=e(),P=(i,s,u,f,l)=>{a.push(i.x,i.y,i.z),d.push(s.x,s.y,s.z),o.push(u.r,u.g,u.b),h.push(f,l||M.kind)},M={kind:0,count:()=>a.length/9,tri(i,s,u,f,l,t=0,n=0){if(c.crossVectors(m.subVectors(s,i),x.subVectors(u,i)),!(c.lengthSq()<1e-12)){if(c.normalize(),g.copy(i).add(s).add(u).multiplyScalar(1/3).sub(f),c.dot(g)<0){c.negate();const r=s;s=u,u=r}P(i,c,l,t,n),P(s,c,l,t,n),P(u,c,l,t,n)}},quad(i,s,u,f,l,t,n=0,r=0){M.tri(i,s,u,l,t,n,r),M.tri(i,u,f,l,t,n,r)},triN(i,s,u,f,l,t,n,r=0,p=0){c.crossVectors(m.subVectors(s,i),x.subVectors(u,i)),c.dot(f)<0?(P(i,f,n,r,p),P(u,t,n,r,p),P(s,l,n,r,p)):(P(i,f,n,r,p),P(s,l,n,r,p),P(u,t,n,r,p))},loft(i,s,u,f,l=0){const t=i.length;for(let n=0;n<t;n++){const r=(n+1)%t;M.quad(i[n],i[r],s[r],s[n],u,f,l)}},cap(i,s,u,f=0){const l=e();for(const t of i)l.add(t);l.multiplyScalar(1/i.length);for(let t=0;t<i.length;t++)M.tri(l,i[t],i[(t+1)%i.length],s,u,f)},geometry(){const i=new y.BufferGeometry;return i.setAttribute("position",new y.Float32BufferAttribute(a,3)),i.setAttribute("normal",new y.Float32BufferAttribute(d,3)),i.setAttribute("color",new y.Float32BufferAttribute(o,3)),i.setAttribute("aFx",new y.Float32BufferAttribute(h,2)),i.computeBoundingSphere(),i},async geometryAsync(i){const s=new y.BufferGeometry;return s.setAttribute("position",new y.Float32BufferAttribute(a,3)),await i(),s.setAttribute("normal",new y.Float32BufferAttribute(d,3)),await i(),s.setAttribute("color",new y.Float32BufferAttribute(o,3)),await i(),s.setAttribute("aFx",new y.Float32BufferAttribute(h,2)),await i(),s.computeBoundingSphere(),s}};return M}function I(a,d,o,h,m,x,c,g,P,{ch:M=.12,capA:i=!0,capB:s=!0,hi:u=0}={}){const f=e().subVectors(o,d).normalize(),l=e().crossVectors(f,h).normalize(),t=e().crossVectors(l,f).normalize(),n=(v,S,Y)=>{const b=Math.min(S,Y)*M,k=S/2,V=Y/2,H=[];for(const[W,T]of[[k-b,V],[k,V-b],[k,-V+b],[k-b,-V],[-k+b,-V],[-k,-V+b],[-k,V-b],[-k+b,V]])H.push(e().copy(v).addScaledVector(t,W).addScaledVector(l,T));return H},r=n(d,m,x),p=n(o,c,g),w=e().addVectors(d,o).multiplyScalar(.5);a.loft(r,p,w,P,u),i&&a.cap(r,w,P,u),s&&a.cap(p,w,P,u)}function D(a,d,o,h,m,x,c=0){const g=e().copy(o).normalize(),P=e().crossVectors(g,Math.abs(g.y)>.9?e(1,0,0):e(0,1,0)).normalize(),M=e().crossVectors(g,P),i=h.length,s=[],u=[];for(let t=0;t<i;t++){const n=h[Math.max(t-1,0)],r=h[Math.min(t+1,i-1)];let p=r[0]-n[0],w=r[1]-n[1];const v=Math.hypot(p,w)||1;s.push(w/v),u.push(-p/v)}const f=(t,n)=>{const r=n/m*Math.PI*2,p=Math.cos(r),w=Math.sin(r);return e().copy(d).addScaledVector(g,h[t][1]).addScaledVector(P,p*h[t][0]).addScaledVector(M,w*h[t][0])},l=(t,n)=>{const r=n/m*Math.PI*2,p=Math.cos(r),w=Math.sin(r),v=e().addScaledVector(P,p*s[t]).addScaledVector(M,w*s[t]).addScaledVector(g,u[t]);return v.lengthSq()>1e-9?v.normalize():v.copy(g)};for(let t=0;t<i-1;t++)for(let n=0;n<m;n++){const r=f(t,n),p=f(t,n+1),w=f(t+1,n+1),v=f(t+1,n),S=l(t,n),Y=l(t,n+1),b=l(t+1,n+1),k=l(t+1,n);h[t][0]>1e-4&&a.triN(r,p,w,S,Y,b,x,c),h[t+1][0]>1e-4&&a.triN(r,w,v,S,b,k,x,c)}}const O=110,R=82.5,$=92.5,J=2.4,le=[[0,-1.75],[0,.75],[.09,.93],[.27,1],[2.13,1],[2.31,.93],[2.4,.75],[2.4,-1.75],[2.33,-1.93],[2.15,-2],[1.66,-2],[1.66,-2.34],[1.54,-2.48],[.86,-2.48],[.74,-2.34],[.74,-2],[.25,-2],[.07,-1.93]],ee=[{t:e(1,0,0),o:e(0,1,0),L:O,off:R},{t:e(1,0,0),o:e(0,-1,0),L:O,off:R},{t:e(0,1,0),o:e(1,0,0),L:R,off:O},{t:e(0,1,0),o:e(-1,0,0),L:R,off:O}],N=(a,d,o,h)=>e(0,$,o).addScaledVector(a.o,a.off-d).addScaledVector(a.t,h);async function We(a,d,o,h,m,x,c){const g=le.length;for(const s of ee){const u=N(s,1.2,-.5,0);for(let f=0;f<g;f++){const[l,t]=le[f],[n,r]=le[(f+1)%g],p=f>=10&&f<=14?m.wood:m.white,w=4;for(let v=0;v<w;v++){const S=v/w*2-1,Y=(v+1)/w*2-1,b=N(s,l,t,S*(s.L-l)),k=N(s,l,t,Y*(s.L-l)),V=N(s,n,r,Y*(s.L-n)),H=N(s,n,r,S*(s.L-n)),W=e().copy(u).addScaledVector(s.t,(S+Y)*.5*(s.L-1.2));a.quad(b,k,V,H,W,p,0,p===m.white?9:0)}}}await x();const P=o>.8?12:8,M=[[.5,0],[.5,.035],[.47,.075],[.38,.118],[.21,.15],[0,.16]];let i=0;for(const s of ee)for(const u of[0,1]){const f=u?J:0,l=e().copy(s.o).multiplyScalar(u?-1:1),t=s.L-f-3,n=Math.max(2,Math.round(2*t/6)),r=2*t/n,p=e().copy(h).addScaledVector(l,-h.dot(l)).multiplyScalar(-1);p.lengthSq()<1e-6&&p.set(0,-1,0),p.normalize();for(let w=0;w<=n;w++){const v=-t+w*r+d.range(-.22,.22),S=-.5+d.range(-.1,.1),Y=N(s,f,S,v);D(a,Y,l,M,P,m.tack,1);const b=e().crossVectors(l,e(0,0,1)).normalize(),k=e(0,0,1),V=e().copy(Y).addScaledVector(l,.045).addScaledVector(p,.3),H=[];for(let T=0;T<10;T++){const z=T/10*Math.PI*2;H.push(e().copy(V).addScaledVector(b,Math.cos(z)*.6).addScaledVector(k,Math.sin(z)*.6))}const W=e().copy(V).addScaledVector(l,-1);for(let T=0;T<10;T++)a.tri(V,H[T],H[(T+1)%10],W,m.tackShadow,0,1);++i%12===0&&await x()}}if(c)for(const s of ee){const u=e(0,0,1),f=s.L-1.2-3,l=Math.max(2,Math.round(2*f/6)),t=2*f/l,n=e().copy(h).addScaledVector(u,-h.dot(u)).multiplyScalar(-1);n.lengthSq()<1e-6&&n.set(0,-1,0),n.normalize();for(let r=0;r<l;r++){const p=-f+(r+.5)*t+c.range(-.22,.22),w=N(s,1.2+c.range(-.1,.1),1,p);D(a,w,u,M,P,m.tack,1);const v=e().copy(w).addScaledVector(u,.045).addScaledVector(n,.3),S=[];for(let b=0;b<10;b++){const k=b/10*Math.PI*2;S.push(e().copy(v).addScaledVector(s.t,Math.cos(k)*.6).addScaledVector(s.o,Math.sin(k)*.6))}const Y=e().copy(v).addScaledVector(u,-1);for(let b=0;b<10;b++)a.tri(v,S[b],S[(b+1)%10],Y,m.tackShadow,0,1);++i%12===0&&await x()}}for(const s of[ee[2],ee[3]])for(const u of[-1,1]){const f=u*(s.L-.25),l=u*(s.L-.25-3.6),t=N(s,-.03,.7,f),n=N(s,-.2,-1.7,f),r=N(s,-.03,-1.7,l),p=N(s,0,.7,f),w=N(s,0,-1.7,f),v=N(s,0,-1.7,l),S=N(s,.6,-.9,u*(s.L-1.5));a.tri(t,n,r,S,m.white),a.quad(t,n,w,p,S,m.white),a.quad(n,r,v,w,S,m.white),a.quad(r,t,p,v,S,m.white)}}async function Ye(a,d,o,h,m){const g=e(1,0,0),P=e(0,1,0),M=e(0,0,1),i=v=>-5.4-(v-10)*.02,s=v=>m.splay+(3.3-m.splay)*(v- -6)/239,u=(v,S,Y,b,k,V=10)=>{const H=e().crossVectors(S,Y).normalize(),W=e().copy(v).addScaledVector(H,-1),T=[];for(let z=0;z<V;z++){const te=z/V*Math.PI*2;T.push(e().copy(v).addScaledVector(S,Math.cos(te)*b).addScaledVector(Y,Math.sin(te)*b))}for(let z=0;z<V;z++)a.tri(v,T[z],T[(z+1)%V],W,k,0,1)};for(const v of[-1,1]){const S=e(v*s(-6),-6,i(-6)),Y=e(v*3.3,233,i(233));I(a,S,Y,g,7.2,4.6,5.6,4,o.wood,{ch:.1});const b=e().subVectors(Y,S).normalize(),k=e().crossVectors(b,g).normalize(),V=e().crossVectors(k,b).normalize();k.z<0&&k.negate();for(let H=22+m.holeOff;H<222;H+=m.holeStep){const W=(H- -6)/239,T=4.6+(4-4.6)*W,z=e().lerpVectors(S,Y,W);u(e().copy(z).addScaledVector(k,T/2+.06),V,b,.95,o.hole),u(e().copy(z).addScaledVector(k,-T/2-.06),b,V,.95,o.hole)}D(a,e(v*s(4.5),4.5,i(4.5)-2.6),M,[[0,0],[1.3,0],[1.3,9.6],[1.05,10.1],[0,10.1]],10,o.wood),await h()}await h();const f=m.tray;I(a,e(-f,8,1.75),e(f,8,1.75),M,7.7,4,7.7,4,o.wood,{ch:.07}),I(a,e(-f,10.7,4.95),e(f,10.7,4.95),M,1.1,1.6,1.1,1.6,o.wood,{ch:.2}),I(a,e(-30,178.3,-2.3),e(30,178.3,-2.3),M,10.4,5.6,10.4,5.6,o.wood,{ch:.08}),I(a,e(-30,174.6,2),e(30,174.6,2),M,1.6,3.2,1.6,3.2,o.wood,{ch:.16}),D(a,e(0,178.3,2.9),M,[[0,0],[1.1,0],[1.1,.9],[2.3,1.2],[2.6,2],[2.3,2.9],[1.2,3.3],[0,3.4]],14,o.metal,1),await h(),I(a,e(0,226,-10.3),e(0,240,-10.3),g,11.5,7.6,9.2,6.4,o.wood,{ch:.12}),D(a,e(-7.6,234,-10.3),g,[[0,0],[1.6,0],[1.6,.9],[.8,.9],[.8,14.4],[1.5,14.4],[1.5,15.3],[0,15.3]],10,o.metal,1),I(a,e(8.2,234.6,-10.3),e(8.6,238.6,-8.3),g,.7,2.2,.7,1.3,o.metal,{ch:.2,hi:1}),I(a,e(8.2,233.4,-10.3),e(8.6,229.4,-12.3),g,.7,2.2,.7,1.3,o.metal,{ch:.2,hi:1}),await h();const l=v=>-13.5+(m.rear+13.5)*(231-v)/237;I(a,e(0,231,-13.5),e(0,-6,m.rear),g,6.4,4.6,5,4,o.wood,{ch:.1});const t=m.braceY,n=s(t)+5.5;I(a,e(-n,t,i(t)-3.5),e(n,t,i(t)-3.5),P,4.4,2.4,4.4,2.4,o.wood,{ch:.12});for(const v of[-1,1])D(a,e(v*s(t),t,i(t)-4.7),e(0,0,-1),[[0,0],[.9,0],[.9,.35],[.5,.6],[0,.65]],8,o.metal,1);const r=e(0,t,i(t)-4.7),p=e(0,t,l(t)+2.2),w=e().lerpVectors(r,p,.5);I(a,r,w,g,3.2,2,3.2,2,o.wood,{ch:.15}),I(a,e(0,t-2.1,w.z+3),e(0,t-2.1,p.z),g,3.2,2,3.2,2,o.wood,{ch:.15}),D(a,e(-2,t-1.05,w.z+1.5),g,[[0,0],[1,0],[1,4],[0,4]],8,o.metal,1),await h();for(const v of[-1,1])for(const S of[-1,1])I(a,e(v*(O-1.2-17),$+S*(R-1.2),-3.15),e(v*(O-1.2),$+S*(R-1.2-17),-3.15),e(0,0,1),1.3,2.3,1.3,2.3,o.wood,{ch:.14});return{footY:-6,apexY:233,xAt:s,zAt:i,rz:l}}function Te(a,{width:d=46,height:o=170,folds:h=5,lean:m=.16,nx:x=80,ny:c=24}={}){const g=[],P=[],M=[],i=a.range(0,6.28),s=a.sign();for(let f=0;f<=c;f++)for(let l=0;l<=x;l++){const t=l/x*2-1,n=f/c,r=1-n,p=d*.5*(.6-.16*Math.sin(Math.min(r*2.4,Math.PI))+.4*r*r*r),w=Math.sin(t*Math.PI*h+i+.6*Math.sin(t*3+i)),v=1.6*(.5-.5*w)*r*r*r,S=t*p+s*m*d*(r*r-.35)+.9*w*r;g.push(S,n*o+(f===0?v:v*(1-n)),(1.2+3.6*r)*w),P.push(1.6*r*r)}for(let f=0;f<c;f++)for(let l=0;l<x;l++){const t=f*(x+1)+l,n=t+1,r=t+x+1,p=r+1;M.push(t,n,p,t,p,r)}const u=new y.BufferGeometry;return u.setAttribute("position",new y.Float32BufferAttribute(g,3)),u.setAttribute("aSway",new y.Float32BufferAttribute(P,1)),u.setIndex(M),u.computeVertexNormals(),u.computeBoundingSphere(),u}function qe(a,d,o,h,m=20){const x=[[0,0],[.17,0],[.175,.03],[.15,.05],[.1,.075],[.085,.1],[.105,.115],[.085,.13],[.07,.17],[.095,.24],[.135,.31],[.15,.38],[.135,.45],[.09,.52],[.055,.58],[.05,.62],[.085,.64],[.05,.66],[.042,.72],[.06,.76],[.105,.8],[.13,.855],[.125,.91],[.09,.96],[.045,.99],[0,1]];D(a,d,e(0,1,0),x.map(([c,g])=>[c*o,g*o]),m,h,.35)}const ae=[[0,.34],[.022,.3],[.045,.265],[.04,.225],[.06,.19],[.14,.215],[.26,.225],[.38,.19],[.47,.125],[.5,.05],[.455,.07],[.47,0],[.415,.035],[.42,-.04],[.36,.01],[.35,-.06],[.29,-.005],[.24,-.065],[.16,-.05],[.085,-.085],[.06,-.14],[.075,-.2],[.115,-.3],[.06,-.325],[.03,-.31],[0,-.335]];function He(){const a=ae.map(([x,c])=>new y.Vector2(x,c));for(let x=ae.length-2;x>=1;x--)a.push(new y.Vector2(-ae[x][0],ae[x][1]));const d=y.ShapeUtils.triangulateShape(a,[]),o=[],h=[];for(const x of a)o.push(x.x,x.y,0);for(const x of d)h.push(x[0],x[1],x[2]);const m=new y.InstancedBufferGeometry;return m.setAttribute("position",new y.Float32BufferAttribute(o,3)),m.setIndex(h),m}const _e=`
  attribute vec4 aPos;                                       // per dove: world position, wing span in metres
  attribute vec4 aFly;                                       // per dove: roll (radians), wing phase (radians), 0, 0
  varying vec3 vW; varying float vSh;
  void main(){
    float wg=smoothstep(.06,.34,abs(position.x)), a=sin(aFly.y);
    vec2 p=position.xy;
    p.x*=1.-wg*(.22-.22*a);                                  // the wings fold in and open
    p.y-=wg*abs(position.x)*(.55*a-.12);                     // and their tips sweep back and forward
    float cr=cos(aFly.x), sr=sin(aFly.x); p=vec2(p.x*cr-p.y*sr,p.x*sr+p.y*cr)*aPos.w;
    vec3 te=cameraPosition-aPos.xyz;
    vec3 X=normalize(cross(vec3(0.,1.,0.),te)+vec3(1e-5,0.,0.)), Y=normalize(cross(te,X)+vec3(0.,1e-5,0.));
    vW=aPos.xyz+X*p.x+Y*p.y; vSh=0.;
    gl_Position=projectionMatrix*viewMatrix*vec4(vW,1.);
  }`;function ge(a,d=X.uniforms){const o=He(),h=new Float32Array(a*4),m=new Float32Array(a*4),x=new y.InstancedBufferAttribute(h,4),c=new y.InstancedBufferAttribute(m,4);x.setUsage(y.DynamicDrawUsage),c.setUsage(y.DynamicDrawUsage),o.setAttribute("aPos",x),o.setAttribute("aFly",c),o.instanceCount=a;const g=new y.Mesh(o,we({mode:1,fold:0,vertexShader:_e},d));return g.frustumCulled=!1,g.name="cfs-doves",{mesh:g,pos:h,fly:m,count:a,commit(){x.needsUpdate=!0,c.needsUpdate=!0}}}async function Be(a,d={}){const o=a.rng,h=a.yield?()=>a.yield():async()=>{},m=Math.min(1,Math.max(.6,d.detail??a.quality?.detail??1)),x=d.palette&&d.palette.length>=7?d.palette:ze,c=d.uniforms||ye(),g=d.flipX?-1:1,P=C=>Fe(C,c),M=C=>we(C,c);c.uP.value[0].set(x[0]),c.uP.value[2].set(x[1]),c.uP.value[3].set(x[2]),c.uP.value[4].set(x[3]),c.uP.value[7].set(x[6]),c.uP.value[1].set(K.horizon),c.uP.value[5].set(K.nightHorizon),c.uP.value[6].set(K.slate),c.uSeed.value=o.int(0,40);const i=(C,F,_)=>{const A=Math.cos(re),q=Math.sin(re);return e(g*(C*A-_*q),F,C*q+_*A).normalize()},s=i(-.6,.7,-.4),u=i(.2366,.2079,.949),f=!!d.stone,l=B(f?K.metal:K.wood);f||l.offsetHSL(o.range(-.012,.012),0,o.range(-.035,.03));const t={white:B(x[1]),wood:l,metal:B(K.metal),hole:l.clone().multiplyScalar(.42),tackShadow:B("#A4AAB4"),tack:l},n={splay:o.range(76,90),holeStep:o.range(11,15),holeOff:o.range(0,6),tray:o.range(88,100),rear:-o.range(105,128),braceY:o.range(52,72)},r={cx:o.range(66,84),cz:-o.range(235,285),bside:o.sign(),bh:o.range(46,58),bz:-o.range(150,185)},p=new y.Group;p.name="cfs-canvas-of-the-other-hour";const w=(C,F,_=0,A="")=>{const q=new y.Mesh(C,F);return q.frustumCulled=!1,q.renderOrder=_,q.name=A,p.add(q),q};d.sky!==!1&&p.add(xe(c)),await h();const v=ce(),S=C=>{let F=2166136261;const _=String(a.seed??0)+":cfs:"+C;for(let A=0;A<_.length;A++)F^=_.charCodeAt(A),F=Math.imul(F,16777619);return F>>>0};await We(v,o,m,s,t,h,(C=>{let F=S(C);const _=()=>{F|=0,F=F+1831565813|0;let A=Math.imul(F^F>>>15,1|F);return A=A+Math.imul(A^A>>>7,61|A)^A,((A^A>>>14)>>>0)/4294967296};return _.range=(A,q)=>A+(q-A)*_(),_})("front-tacks")),await h();const b=await v.geometryAsync(h);await h();const k=ce(),V=await Ye(k,o,t,h,n);await h();const H=await k.geometryAsync(h);if(await h(),w(b,P({mode:0}),0,"cfs-edge"),w(H,P({mode:2,clip:!0}),0,"cfs-easel"),d.mirror!==!1&&(w(b,P({mode:0,mirror:!0}),-.4,"cfs-edge-mirror"),w(H,P({mode:2,mirror:!0}),-.4,"cfs-easel-mirror")),await h(),d.beyond!==!1){const C=[];for(const L of[-1,1]){const oe=Te(o,{width:o.range(42,50),height:o.range(150,180),folds:o.int(4,6),nx:Math.round(80*m),ny:Math.round(24*m)});oe.translate(L*r.cx,-1.5,r.cz+L*o.range(-12,12)),C.push(oe),await h()}const F=new y.BufferGeometry,_=[],A=[],q=[],E=[];let U=0;for(const L of C){_.push(...L.attributes.position.array),A.push(...L.attributes.normal.array),q.push(...L.attributes.aSway.array);for(const oe of L.index.array)E.push(oe+U);U+=L.attributes.position.count,L.dispose()}F.setAttribute("position",new y.Float32BufferAttribute(_,3)),F.setAttribute("normal",new y.Float32BufferAttribute(A,3)),F.setAttribute("aSway",new y.Float32BufferAttribute(q,1)),F.setIndex(E),w(F,M({mode:1,fold:.06,clip:!0}),0,"cfs-demo-curtains");const j=ce();qe(j,e(r.bside*34,-1,r.bz),r.bh,t.wood,Math.round(22*m));const pe=j.geometry();w(pe,P({mode:1,clip:!0}),0,"cfs-demo-bilboquet"),d.mirror!==!1&&w(pe,P({mode:1,mirror:!0}),-.4,"cfs-demo-bilboquet-mirror")}let W=null;const T=[];if(d.beyond!==!1){W=ge(Math.round(18*m),c),p.add(W.mesh);for(let C=0;C<W.count;C++)T.push({s:(C+o.range(-.3,.3))/W.count*700,x:g*(95+o.range(-5,5)),y:111+o.range(-5,6),span:o.range(3,6),ph:o.range(0,6.28),rate:o.range(3.2,4.4)})}await h();const z=(C,F,_)=>e(g*C,F,_),te={placement:{position:e(80,0,450),rotationY:re},canvas:{center:e(0,$,0),normal:e(0,0,1),right:e(1,0,0),halfWidth:O,halfHeight:R,openHalfWidth:O-J,openHalfHeight:R-J},crossing:{position:z(105,110,0),heading:e(0,0,-1)},flyThrough:[z(52,58,250),z(78,82,170),z(96,100,95),z(104,108,40),z(105,110,0),z(105,110,-45),z(102,104,-120)],viewpoints:{reveal:z(-55,66,290),closest:z(104.5,109,16),far:z(-150,40,520),behind:z(60,90,-260)},edgeNear:z(107.6,110,-.5),apex:e(0,240,-10.3),feet:[e(-n.splay,0,-5.2),e(n.splay,0,-5.2),e(0,0,n.rear)],keyLocal:s.clone(),moonLocal:u.clone(),beyond:d.beyond!==!1?{curtains:[z(-r.cx,0,r.cz),z(r.cx,0,r.cz)],bilboquet:e(r.bside*34,0,r.bz)}:null,portalSeat:null};let se=-1;const fe=new y.Quaternion,de=e(),G=e(),Q=e(),be=e(1,0,0),Se=e(0,1,0),Pe=e(0,0,1),Z=(C,F)=>{C.copy(Q.copy(F).applyQuaternion(fe)).normalize()},ue=d.key?e().copy(d.key).normalize():null,he=d.moon?e().copy(d.moon).normalize():null;function me(C,F,_){if(p.updateWorldMatrix(!0,!1),p.matrixWorld.decompose(de,fe,G),c.uCvO.value.set(0,$,0).applyMatrix4(p.matrixWorld),Z(c.uCvU.value,be),Z(c.uCvV.value,Se),Z(c.uCvN.value,Pe),c.uCvH.value.set((O-J)*G.x,(R-J)*G.y,O*G.x,R*G.y),ue?c.uKey.value.copy(ue):Z(c.uKey.value,s),he?c.uMoon.value.copy(he):Z(c.uMoon.value,u),c.uSeaY.value=de.y,c.uT.value=se>=0?se*45:F,W){const A=c.uT.value;for(let q=0;q<W.count;q++){const E=T[q],U=(E.s+A*40)%700;Q.set(E.x+2*Math.sin(U*.011+E.ph),E.y+1.5*Math.sin(U*.017+E.ph*2),350-U).applyMatrix4(p.matrixWorld);const j=q*4;W.pos[j]=Q.x,W.pos[j+1]=Q.y,W.pos[j+2]=Q.z,W.pos[j+3]=E.span*G.x,W.fly[q*4]=.25*Math.sin(U*.013+E.ph),W.fly[q*4+1]=E.ph+A*E.rate}W.commit()}}return me(0,0,null),{object:p,radius:135,height:240,center:e(0,100,0),anchors:te,update:me,setProgress(C){se=C},uniforms:c,easel:V,dispose(){},ground:!1,groundY:0,style:{uniforms:c,paint:P,cut:M,doves:C=>ge(C,c),skyDome:()=>xe(c)}}}export{X as CFS,K as CFS_MIX,ze as CFS_PALETTE,Ve as CUT_FRAG,Ae as CUT_VERT,_e as DOVE_VERT,ne as STYLE_GLSL,I as addBeam,qe as addBilboquet,D as addLathe,Be as buildHero,Te as curtainGeometry,we as cutMaterial,He as doveGeometry,ye as freshUniforms,ge as makeDoves,ce as makeMesher,xe as makeSkyDome,Fe as paintMaterial,ke as skyMaterial};
