import*as w from"three";import{makePath as wa,clamp as V,lerp as C,smoothstep as D}from"../kit/core.js";import{makeSky as va,makeLightRig as ba}from"../kit/sky.js";import*as ro from"../kit/terrain.js";import*as L from"../kit/flora.js";import*as fs from"../kit/fx.js";import*as jt from"../kit/water.js";import{buildHero as xa,buildShapes as us,placeShapes as ya,makeUpperSky as ka,makeMoon as Aa,makeHour as za,makeLight as Sa,makeForm as Ma,makeLand as La,routeKnots as ja,routePlan as Fa,routeLooks as Ta,routePace as Ra,faceRadiusAt as Na,PLACE as u,SHELF as Me,RIVER as Le,PEAK_GLSL as io,MAX_SHAPES as ms,RING as Pa,ENTRY as nt,TARN as ae,FAR_RIVER as Ea,placeTors as Ba,BECK as Da,beckD as Ka,BREACH as rt,hyp as K,hyp3 as it}from"../parts/peak-above-the-singing-fields.js";const gs=Math.PI/180,Wa=`
attribute vec2 aShade; attribute vec4 aZone;
varying vec3 vW, vN, vCol; varying vec2 vShade; varying vec4 vZone;
void main(){ vec4 wp=modelMatrix*vec4(position,1.); vW=wp.xyz; vN=normal; vCol=color; vShade=aShade; vZone=aZone; gl_Position=projectionMatrix*viewMatrix*wp; }`,Ca=`
uniform vec3 uFl[8]; uniform float uBloom; uniform vec2 uFarR[16], uBeck[18]; uniform vec4 uTor[6]; uniform int uTorN;
varying vec3 vW, vN, vCol; varying vec2 vShade; varying vec4 vZone;
${io}
// THE FAR LAND'S OWN THINGS, in the ground's skin: beyond 640 m of the axis on every side, and from 300 m of it in
// the north meadows (north of z -440: beyond the garden's end) and the east land (east of x +230), 60 m clear of
// the tarn: ground the line never comes within 85 m of (it climbs round the mountain and looks down on them from afar). Each thing is
// given by place alone and is whole for every eye; what the eye's distance changes is only how fine a grain of it
// a pixel can show.
// metres to the far river's middle line
float farRiver(vec2 p){ float d=1e9; for(int i=0;i<15;i++){ vec2 a=uFarR[i], b=uFarR[i+1]-a; d=min(d,length(p-a-b*clamp(dot(p-a,b)/dot(b,b),0.,1.))); } return d; }
// metres to the middle line of the tarn's beck
float beck(vec2 p){ float d=1e9; for(int i=0;i<17;i++){ vec2 a=uBeck[i], b=uBeck[i+1]-a; d=min(d,length(p-a-b*clamp(dot(p-a,b)/dot(b,b),0.,1.))); } return d; }
// standing pools: metres to the nearest pool's shore (under 0 inside it); a pool in two cells of five, 18 to 41 m in radius
float poolD(vec2 p){
  vec2 c=floor(p/430.-.5); float d=1e4;
  for(int j=0;j<2;j++) for(int i=0;i<2;i++){
    vec2 cell=c+vec2(float(i),float(j)); float h=ph2(cell+71.3);
    if(h<.38){ vec2 ctr=(cell+.5+(vec2(ph2(cell+13.1),ph2(cell+29.7))-.5)*.6)*430.; d=min(d,length(p-ctr)-(18.+60.*h)*(.8+.5*pn2(p*.02+h*9.))); }
  }
  return d;
}
// small woods and blossom groves: x = how much of one stands at a place (a ragged shore), y = a number for the wood
vec2 wood(vec2 p){
  vec2 c=floor(p/190.-.5); float m=0., kind=0.;
  for(int j=0;j<2;j++) for(int i=0;i<2;i++){
    vec2 cell=c+vec2(float(i),float(j)); float h=ph2(cell+5.7);
    if(h<.45){
      vec2 ctr=(cell+.5+(vec2(ph2(cell+41.3),ph2(cell+17.9))-.5)*.5)*190.;
      float k=1.-smoothstep(.74,.95,length(p-ctr)/(25.+62.*h)+.5*(pn2(p*.035+h*31.)-.5)+.5*(pn2(p*.013+h*17.)-.5));
      if(k>m){ m=k; kind=fract(h*37.7); }
    }
  }
  return vec2(m,kind);
}
// THE SLAB IS A WEATHERED TABLELAND: great plates of pale granite some 30 m across, each with its own ragged
// outline, parted by hollows where turf and small flowers grow. x = metres from a place to the nearest hollow's
// middle line, y = a number for the plate
vec2 plates(vec2 p){
  vec2 q=(p+7.*vec2(pn2(p*.021+3.),pn2(p*.021+8.))+2.*vec2(pn2(p*.09+1.),pn2(p*.09+6.)))/30.;
  vec2 c=floor(q), f=fract(q); float d1=9., d2=9., id=0.;
  for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){
    vec2 g=vec2(float(i),float(j)), r=g+vec2(ph2(c+g),ph2(c+g+31.7))*.8+.1-f; float d=dot(r,r);
    if(d<d1){ d2=d1; d1=d; id=ph2(c+g+5.3); } else if(d<d2) d2=d;
  }
  return vec2((sqrt(d2)-sqrt(d1))*15.,id);
}
// rain pools on the slab: in six cells of ten (26 m cells), 4 to 12 m across, each with its own ragged shore:
// metres to the nearest pool's shore (under 0 inside it)
float rainPool(vec2 p){
  vec2 c=floor(p/26.); float d=9.;
  for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){
    vec2 cell=c+vec2(float(i),float(j)); float h=ph2(cell+91.3);
    if(h<.6){ vec2 ctr=(cell+.5+(vec2(ph2(cell+3.1),ph2(cell+47.7))-.5)*.55)*26.; d=min(d,length(p-ctr)-(2.+4.*fract(h*7.3))*(.8+.4*pn2(p*.35+h*20.))); }
  }
  return d;
}
// THE TURF'S NAP: tussocks half a metre to a metre and a half across, the turf's own height in world metres
// (0..1 of a quarter of a metre). The build reads the same pattern (tussockAt): tufts and blooms stand by it
float tussock(vec2 p){ return smoothstep(.42,.74,pn2(p*1.15+3.7)*.62+pn2(p*2.6+11.3)*.38); }
void main(){
  vec3 p=vW, N=normalize(vN);
  float px=max(length(dFdx(p)),length(dFdy(p)));
  float grass=clamp(vZone.x,0.,1.), rock=clamp(vZone.y,0.,1.), garden=clamp(vZone.z,0.,1.), bed=clamp(vZone.w,0.,1.);
  // the slab's top: its plates, its hollows of turf (about a third of it) and its rain pools
  float lvl=smoothstep(.82,.96,N.y), slabK=rock*lvl;
  vec2 pl=plates(p.xz); float pd=rainPool(p.xz);
  float hw=1.+3.4*pn2(p.xz*.03+11.), he=pl.x+1.1*(pn2(p.xz*.42+5.)-.5)+.5*(pn2(p.xz*1.7)-.5)*(1.-smoothstep(.2,1.,px));
  // A RAIN POOL HAS A SHORE: where a hollow's turf comes down to it the turf reaches the water (0.05 to 0.3 m off)
  // and its first metre and a half is a belt of rushes (darker, in clumps; the build stands the rushes there);
  // where bare plate meets it the rock is wet for half a metre; the water lies a lip's depth under the plate
  // (0.15 to 0.3 m, one depth to a pool or nearly), and the lip toward the sun throws its shade on the water
  float slab0=slabK, holR=slabK*(1.-smoothstep(hw-.5-px,hw+px,he));
  float hol=holR*smoothstep(.05,.3+px,pd), rush=hol*(1.-smoothstep(1.,1.5+px,pd));
  float pool=slabK*(1.-smoothstep(-.12-px,.12+px,pd))*smoothstep(.985,.998,N.y);
  // down each hollow broader than 3 m (its half breadth over 1.5 m) a rill runs along its middle line, 0.3 to 0.8 m
  // broad, to the rain pool that lies in the hollow's way: the pools' own water (the build's hollowAt keeps the
  // cover out of it)
  // (its breadth changes every few strides; its banks are wet earth a hand broad, darker than the turf)
  float rillW=.15+.25*(.6*pn2(p.xz*.07+31.)+.4*pn2(p.xz*.45+7.))+.1*(pn2(p.xz*2.3+9.)-.5)*(1.-smoothstep(.1,.4,px)), rillK=hol*smoothstep(1.5,2.1,hw)*smoothstep(.985,.998,N.y)*(1.-smoothstep(.25,1.,px));
  float rill=rillK*(1.-smoothstep(-.04-.5*px,.04+.5*px,pl.x-rillW)), rillBank=rillK*(1.-smoothstep(.08,.3+.5*px,pl.x-rillW))*(1.-rill);
  float pool0=pool; pool=max(pool,rill);
  // where turf meets bare rock the turf ends at a ragged edge a stride deep, not in a wash
  { float rk=smoothstep(.38,.62,rock+.42*(pn2(p.xz*.45+3.)*.6+pn2(p.xz*1.7)*.4-.5)); grass=clamp(grass+rock-rk,0.,1.); rock=rk; }
  vec3 alb=mix(vCol,mix(vec3(.2,.5,.07),vec3(.4,.66,.12),pfbm2(p.xz*.055))*.9,hol);
  grass=max(grass,hol); rock*=1.-hol; slabK*=1.-hol;
  float m1=pfbm2(p.xz*.055), m2=pn2(p.xz*.8)*(1.-smoothstep(.3,1.5,px))+.5*smoothstep(.3,1.5,px);
  // wind in the grass: long waves running downwind (toward uWind), on the world's clock
  float ph=dot(p.xz,uWind)*.3-uTime*1.9+uPhWave.x+3.5*pn2(p.xz*.022+uPhWave);
  float wave=(.5+.5*sin(ph))*(.55+.45*sin(ph*.31+1.3+dot(p.xz,vec2(-uWind.y,uWind.x))*.05));
  // and the gusts: broad fronts a furlong apart sweeping the whole land downwind, seen from any height. Where a
  // front passes, all that grows in the meadow bows together and shows its paler side: grass and flowers alike
  vec2 gq=vec2(dot(p.xz,uWind)*.011-uTime*.2,dot(p.xz,vec2(-uWind.y,uWind.x))*.017)+uPhGust;
  float gust=smoothstep(.4,.6,pn2(gq)*.65+pn2(gq*2.7+5.)*.35), gk=.92+.32*gust;
  // (the waves are a stride-and-more apart: from where a pixel spans more than that they are not told apart, and
  // only the gusts are seen)
  alb*=mix(1.,(.84+.3*m1)*(.88+.24*m2)*(1.+.3*(wave-.3)*(1.-smoothstep(.5,1.8,px)))*gk,grass);
  // the nap under the low sun (fields, breach, fans, hollows alike; seen where a point of the raster is smaller
  // than a tussock, a mean tone further off): a tussock's crown is paler, the turf between deeper, and each throws
  // its shade down-sun, four times its height long (0.25 m high under a sun 13 degrees up: a metre)
  vec2 sunXZ=normalize(uSunDir.xz+vec2(1e-5,0.));
  float tusK=grass*(1.-smoothstep(.2,.7,px)), tus=tussock(p.xz);
  float tusSh=tusK*smoothstep(.05,.5,max(tussock(p.xz+sunXZ*.45),.7*tussock(p.xz+sunXZ*.9))-tus);
  alb*=mix(1.,.86+.26*tus,tusK);
  alb=mix(alb,vec3(.1,.2,.06)*(.7+.7*pn2(p.xz*2.9+3.)),rush*(.45+.45*smoothstep(.3,.6,pn2(p.xz*1.3+17.))));
  alb*=1.-.5*rillBank;
  // new grass lets the low sun through: a gold cast toward the sun
  alb=mix(alb,alb*vec3(1.12,1.04,.72),grass*.5*pow(clamp(dot(normalize(cameraPosition.xz-p.xz+vec2(1e-4,0.)),-normalize(uSunDir.xz))*.5+.5,0.,1.),2.));
  // flowers: small blooms of every hue in drifts; a drift leans to one colour. Each bloom has its own place, breadth
  // and hue; blooms are drawn near the eye, and further off a drift is the tint of its blooms
  float drift=smoothstep(.36,.66,pfbm2(p.xz*.03+5.3));
  float dens=mix(.16+.5*drift,.22+.56*drift,garden)*uBloom*(1.-rush);
  vec2 cq=p.xz*3.6+.8*vec2(pn2(p.xz*.9+2.),pn2(p.xz*.9+9.));
  vec2 cell=floor(cq), f=fract(cq)-.5;
  float h1=ph2(cell), h2=ph2(cell+17.3), h3=ph2(cell+41.7);
  // a drift is an island some forty metres across with a ragged shore, green between it and the next; the colour its
  // blooms lean to is the island's own (one number for the island: no colour lies in bands round another)
  vec2 wq=p.xz*.022+1.3*vec2(pn2(p.xz*.011),pn2(p.xz*.011+7.));
  float wk=ph2(floor(wq)); vec2 wf=fract(wq)-.5;
  // (its shore is a ragged edge a stride or two deep, plain from any height: a drift has an outline)
  float isle=1.-smoothstep(.31,.35+px*.03,length(wf)+.5*(pfbm2(p.xz*.045+3.)-.5)+.07*(pn2(p.xz*.33+1.7)-.5));
  float lead=floor(fract(wk*13.7)*7.99);
  float pick=mix(floor(h2*7.99),lead,step(h3,mix(.45,.86,garden)));
  vec3 fc=uFl[int(pick)];
  float rad=.1+.16*fract(h1*37.);
  float dotv=1.-smoothstep(rad*.5,rad,length(f+(vec2(h2,h3)-.5)*.5));
  float near=1.-smoothstep(.07,.3,px);
  float fl=max(grass,garden)*(1.-bed)*near*step(h1,dens)*dotv;
  alb=mix(alb,fc,clamp(fl,0.,1.));
  alb=mix(alb,uFl[int(lead)]*(.8+.3*m1)*gk,max(grass,garden)*(1.-bed)*(1.-near)*min(dens,.6)*(.35+.3*m2)*isle);
  // from afar a drift is a wash of its leading colour over the green (the fuller islands; broken, never a flat disc)
  float wash=isle*step(.45,wk)*(.5+.5*m2)*smoothstep(.3,.62,pn2(p.xz*.3+7.));
  alb=mix(alb,uFl[int(lead)]*(.75+.3*m1)*gk,max(grass,garden)*(1.-bed)*(1.-near)*wash*mix(.32,.5,garden)*min(uBloom,1.2));
  // THE GROUND'S SKIN KEEPS A GRAIN AT EVERY HEIGHT IT IS SEEN FROM: clumps of deeper green, each some five to ten
  // points of the eye's raster across whatever the eye's distance (one size of clump gives way to the next as a point's
  // footprint grows; nothing is stretched, nothing tiles)
  float gl=log2(max(px,.6)*4.), gi=floor(gl), gf=gl-gi;
  float gr=mix(pn2(p.xz*exp2(-gi)+gi*7.3),pn2(p.xz*exp2(-gi-1.)+gi*7.3+7.3),gf);
  alb*=mix(1.,1.-.22*smoothstep(.5,.62,gr)+.1*(1.-smoothstep(.34,.48,gr)),grass*smoothstep(.6,1.6,px));
  // THE FAR LAND: flower sweeps that follow the ground's own lie and the water; the river going on, and the
  // standing pools; small woods and blossom groves with their long shadows; the lone tors' shadows
  float rA=length(p.xz-uAxis.xz), farW=smoothstep(640.,820.,rA)*max(grass,bed), water=0., farSun=1.;
  // (the tarn's beck: metres to its water's edge; it wanders up to 40 m either side of its line in bends of two
  // sizes and is 8 to 12 m broad; its water, gravel and rushes lie along it wherever it runs, to the tarn's own shore)
  float dBk=1e4;
  if(p.z<-690.&&p.z>-1170.&&p.x>-1480.&&p.x<640.) dBk=beck(p.xz+62.*vec2(pn2(p.xz*.0045+2.)-.5,pn2(p.xz*.0045+9.)-.5)+18.*vec2(pn2(p.xz*.017+4.)-.5,pn2(p.xz*.017+1.)-.5))-(4.+2.2*pn2(p.xz*.016+5.));
  float farK=max(farW,smoothstep(300.,420.,rA)*max((1.-smoothstep(-520.,-440.,p.z)),smoothstep(230.,330.,p.x))*smoothstep(105.,150.,length(p.xz-vec2(${ae.x}.,${ae.z}.)))*grass);
  farK=max(farK,grass*(1.-smoothstep(16.,34.,dBk)));
  if(farK>0.){
    float hl=max(length(uSunDir.xz),1e-4); vec2 sh=uSunDir.xz/hl;
    float lie=p.y/9.+2.4*pn2(p.xz*.0028+4.)+.5*pn2(p.xz*.011+9.);
    // (a sweep has an edge: ragged, a few strides deep, plain from any height; inside it the flowers thin and thicken)
    float rag=.16*(pn2(p.xz*.045+2.)-.5)+.07*(pn2(p.xz*.21+6.)-.5), eg=.03+px*.012;
    float sweep=smoothstep(.46,.46+eg,1.-abs(fract(lie)-.5)*2.+rag)*smoothstep(.44,.44+eg*2.,pfbm2(p.xz*.0042+3.)+rag*.4)*(.72+.28*smoothstep(.3,.7,pn2(p.xz*.06+13.)));
    vec3 sc=uFl[int(floor(ph2(vec2(floor(lie),3.))*7.99))];
    vec2 pw=p.xz+50.*vec2(pn2(p.xz*.0032)-.5,pn2(p.xz*.0032+7.)-.5);
    float dW=min(min(farRiver(pw)-11.,poolD(p.xz)),dBk);
    water=(1.-smoothstep(-px,px,dW))*farK;
    sweep=max(sweep,.9*smoothstep(8.,22.,dW)*(1.-smoothstep(60.,120.,dW)));
    alb=mix(alb,mix(sc*gk,alb,.25)*(.75+.3*m1),farK*sweep*.56*min(uBloom,1.2)*(.55+.45*smoothstep(.3,.7,gr)));
    vec2 wd=wood(p.xz); float w0=wd.x*step(18.,dW), can=pn2(p.xz*.17)*.6+pn2(p.xz*.41+3.)*.4;
    // a wood is its trees' crowns, each a few metres across, with the dark between them (told apart where a pixel
    // is smaller than a crown; further off, the wood's mean tone); a grove's crowns are in blossom
    float crown=mix(smoothstep(.4,.56,can),.55,smoothstep(1.5,5.,px));
    float grove=step(.7,wd.y);
    vec3 wc=mix(mix(vec3(.07,.2,.07),vec3(.24,.44,.14),grove),mix(mix(vec3(.2,.42,.12),vec3(.34,.56,.17),can),mix(vec3(.97,.76,.85),vec3(1.,.96,.94),can),grove),crown);
    w0*=farK; alb=mix(alb,wc,w0);
    farSun=1.-.62*farK*max(max(wood(p.xz+sh*14.).x,wood(p.xz+sh*28.).x),wood(p.xz+sh*42.).x)*(1.-w0);
    for(int i=0;i<6;i++){
      if(i>=uTorN) break;
      vec2 q=p.xz-uTor[i].xy; float t=-dot(q,sh), yy=max(t,0.)*uSunDir.y/hl, w=1.5+max(t,0.)*.05;
      farSun=min(farSun,1.-.8*(1.-smoothstep(-w,w,abs(q.x*sh.y-q.y*sh.x)-uTor[i].z*(1.-.55*yy/uTor[i].w)))*step(0.,t)*(1.-smoothstep(uTor[i].w*.8,uTor[i].w,yy)));
    }
    // the water's rim: a belt of rushes, deep green, some strides broad and ragged, and inside it the pale gravel
    alb=mix(alb,vec3(.16,.36,.1)*(.8+.4*m2),farK*(1.-smoothstep(9.,13.+px,dW+5.*(pn2(p.xz*.11+4.)-.5)))*smoothstep(3.,6.,dW)*.8);
    alb=mix(alb,vec3(.8,.76,.62),farK*(1.-smoothstep(2.,5.+px,dW))*.7);
  }
  // THE SHELF'S BARE GRANITE. Level (the slab's plates): pale weathered granite, each plate of its own tone, its
  // edge rounded down into the turf of the hollow, lichen in gold and grey-green patches, damp round the pools.
  // Standing (the scarp's risers): the same granite in beds; a bed's foot is a recess with a shadow and moss in
  // it, and broad upright recesses part the buttresses. Nothing is drawn on the rock: tone, weathering and grain
  // are read in the rock's own space (so nothing stretches down the scarp), and form is relief under the light.
  float farR=smoothstep(.12,.7,px);
  float r1=pfbm3(p*.05), r2=pfbm3(p*.31+3.), r3=pn3(p*3.3)*(1.-smoothstep(.02,.2,px)), r4=pn3(p*13.)*(1.-smoothstep(.006,.05,px));
  alb*=mix(1.,(.84+.32*r1)*(.9+.2*r2)*(.95+.1*r4),rock);
  alb=mix(alb,alb*vec3(1.08,1.,.88),rock*smoothstep(.45,.7,r2));
  alb*=mix(1.,.93+.14*pl.y,slabK*(1.-.6*farR));
  // THE SLAB IS STONE IN PLATES, each by its own number: its edge is a step 0.4 to 0.8 m high, it dips 3 to 6 degrees
  // its own way (in its light: the land's height is the part's and is not moved), and its top carries the
  // mountain's pavement (see slab: joints 8.5 and 23 m apart), each joint a recess with moss in it, and a slab in
  // three strips standing a hand higher or lower than its neighbour where the joint between them lives (a step at the joint).
  float stepH=.4+.4*fract(pl.y*13.7), dipA=radians(3.+3.*fract(pl.y*7.31)), dipB=6.2832*fract(pl.y*23.17);
  vec4 pv=slabs(p.xz); float pvK=slabK*(1.-smoothstep(.4,1.6,px));
  float pvJ=pvK*(1.-smoothstep(.05+px*.5,.28+px*.9,pv.x)), pvStep=.22*(fract(pv.z*5.3)-.5)*step(.66,fract(pv.z*9.7))*pv.w;
  alb*=1.-.28*pvJ;
  alb=mix(alb,vec3(.2,.36,.1)*(.8+.5*r2),pvJ*.6*smoothstep(.35,.6,pn2(p.xz*.5+7.3)));
  float blockK=rock*(1.-lvl);
  // the beds undulate, pinch and swell (3 m and more thick); each has a number of its own
  // (uneven beds, 3 to 6 m thick; a recess lives only along parts of a bed's foot, a few strides at a time)
  vec2 bj=jset((p.y+.07*dot(p.xz,vec2(.8,.6))+3.*pn3(p*.016)+1.2*pn3(p*.06+3.))/4.4,11.); float bedN=bj.y;
  float bedH=smoothstep(0.,.3,bj.x);
  float recess=(1.-smoothstep(.03,.3+px*.15,bj.x))*smoothstep(.45,.7,pn3(vec3(p.x*.09,bj.y*31.,p.z*.09)+5.));
  float gully=smoothstep(.5,.78,pn3(vec3(p.x*.09,p.y*.012,p.z*.09)+19.));
  // THE BEDS ARE BROKEN INTO BLOCKS by the mountain's own two families of upright joints (5.6 and 8.2 m apart at
  // uneven spacing, leaning one each way, as on the face: see jointed): a master joint runs up through the beds of
  // a riser before the next set takes over, each family comes and goes, and one that lies in the face itself draws
  // no joint there. A block has a tone and a tilt of its own; its edge is rounded into the joint; the joint is a
  // dark line as broad as a hand, broader with the eye's distance and gone where a pixel spans a block.
  float stJ=jset((p.y+3.*pn3(p*.016))/13.+.4*pn3(p*.02+31.),8.).y*37.;
  vec3 qj=p+2.6*vec3(pn3(p*.021+5.),0.,pn3(p*.021+9.))+.7*vec3(pn3(p*.09+1.),0.,pn3(p*.09+4.));
  vec2 u1=jset((dot(qj.xz,vec2(.83,.56))+.27*qj.y)/5.6+stJ,2.), u2=jset((dot(qj.xz,vec2(-.56,.83))-.36*qj.y)/8.2+stJ*1.7,3.);
  vec2 ujK=vec2(smoothstep(.2,.55,length(vec2(N.y,dot(N.xz,vec2(-.56,.83))))),smoothstep(.2,.55,length(vec2(N.y,dot(N.xz,vec2(.83,.56))))))
    *vec2(smoothstep(.3,.5,pn3(p*.11+11.+stJ)),smoothstep(.33,.52,pn3(p*.09+23.+stJ)))*(1.-smoothstep(.5,.76,N.y));
  vec2 ujD=vec2(u1.x*5.6,u2.x*8.2); float ujW=.09+px*.7;
  vec2 ujE=mix(vec2(1.),smoothstep(vec2(0.),vec2(.35+px*1.6),ujD),ujK), ujC=(1.-smoothstep(vec2(ujW*.4),vec2(ujW),ujD))*ujK;
  float blockE=min(ujE.x,ujE.y), crackJ=max(ujC.x,ujC.y)*(1.-smoothstep(.4,1.6,px));
  // (a block's number is whole on either side of a joint that is there and one number across a joint that is not)
  vec3 blockH=mix(mix(ph33(vec3(bedN,0.,0.)*91.7+3.1),ph33(vec3(bedN,u1.y,0.)*91.7+3.1),ujK.x),mix(ph33(vec3(bedN,0.,u2.y)*91.7+3.1),ph33(vec3(bedN,u1.y,u2.y)*91.7+3.1),ujK.x),ujK.y);
  alb*=mix(1.,(.84+.32*blockH.x)*(1.-.16*recess*(1.-.6*farR))*(1.-.24*gully)*(1.-.26*crackJ),blockK);
  // standing granite weathers as the mountain's does: dark rain marks running down from the beds, pale washes
  // between them, moss in the recesses (all read in the rock's own space, long down the face by the rain's own way)
  float rainS=smoothstep(.5,.78,pn3(vec3(p.x*.2,p.y*.045,p.z*.2)+31.))*smoothstep(.35,.6,pn3(p*.02+17.));
  float paleS=smoothstep(.5,.75,pn3(vec3(p.x*.13,p.y*.035,p.z*.13)+7.));
  alb*=1.-.26*rainS*blockK;
  alb=mix(alb,alb*vec3(1.2,1.12,.94),blockK*paleS*.6);
  alb=mix(alb,vec3(.2,.36,.1)*(.8+.5*r2),blockK*recess*(1.-farR)*smoothstep(.35,.6,pn3(p*.07+13.))*.8);
  float lk=pn3(p*.24+9.)*.65+pn3(p*.8+2.)*.35;
  float lich=mix(smoothstep(.55,.61,lk),.22,smoothstep(.1,.5,px))*smoothstep(.38,.6,pn3(p*.05+23.))*rock;
  alb=mix(alb,mix(vec3(.78,.6,.2),vec3(.5,.56,.42),smoothstep(.45,.55,pn3(p*.035+41.)))*(.75+.5*r2),lich*.6);
  // the plate's edge: moss and a darker damp where it goes down into the hollow
  float edgeD=he-hw, rimK=slabK*(1.-smoothstep(0.,1.4+px,edgeD));
  alb=mix(alb,vec3(.22,.38,.12)*(.8+.5*r2),rimK*.55*smoothstep(.3,.6,pn2(p.xz*.6+3.1)));
  float damp=slabK*(1.-smoothstep(.2,1.8,pd));
  // THE RIVER'S BED, plain from the flown height: pale gravel bars, a greener, deeper channel wandering down it,
  // dark stones a stride across, weed in the channel, pebbles close to; and the net of light the ripples throw on
  // it, in two sizes of mesh, running on the world's clock
  vec2 pc=floor(p.xz*3.1); float pk=ph2(pc);
  float chan=smoothstep(.35,.65,pn2(p.xz*.06+7.)), stone=smoothstep(.62,.7,pn2(p.xz*.55+3.))*smoothstep(.4,.6,pn2(p.xz*.13));
  float weed=smoothstep(.58,.72,pn2(p.xz*.21+11.))*chan;
  vec3 bedc=mix(vec3(.9,.84,.64),vec3(.4,.7,.62),chan*.7);
  bedc=mix(bedc,vec3(.3,.3,.27),stone*.8);
  bedc=mix(bedc,vec3(.2,.44,.22),weed*.6);
  bedc*=mix(1.,.72+.5*pk,near);
  float n1=pn2(p.xz*1.3+uTime*vec2(.33,.21)+uPhNet), n2=pn2(p.xz*2.1-uTime*vec2(.27,.36)+4.+uPhNet.yx);
  float n3=pn2(p.xz*.42+uTime*vec2(.2,.13)+9.+uPhNet), n4=pn2(p.xz*.7-uTime*vec2(.17,.22)+2.+uPhNet.yx);
  float net=pow(clamp(1.-abs(n1+n2-1.)*2.2,0.,1.),5.)*(1.-smoothstep(.2,.9,px))+.8*pow(clamp(1.-abs(n3+n4-1.)*2.4,0.,1.),4.)*(1.-smoothstep(.6,2.4,px));
  alb=mix(alb,bedc,bed);
  // the step's shade in the hollow: the plate that stands toward the sun (read 0.6 m of step's shade away along
  // the sun's bearing) throws a shade as long as its own step is high over the sun's height; painted on the
  // hollow's ground and nowhere else
  float cotS=min(length(uSunDir.xz)/max(uSunDir.y,.05),6.), stLq=.6*cotS;
  vec2 stQ=p.xz+sunXZ*stLq, plS=plates(stQ);
  float stE=plS.x+1.1*(pn2(stQ*.42+5.)-.5)-(1.+3.4*pn2(stQ*.03+11.)), stL=(.4+.4*fract(plS.y*13.7))*cotS;
  float stepSh=hol*smoothstep(stLq-stL-.25,stLq-stL+.35,stE)*(1.-smoothstep(1.,3.,px));
  float lipH=.15+.15*pn2(p.xz*.05+17.), lipSh=0.;
  if(slab0>0.&&pd<.6) lipSh=slab0*(1.-smoothstep(.2,.5+px,pd))*smoothstep(.1,.45,rainPool(p.xz+sunXZ*lipH*cotS))*(1.-smoothstep(1.,3.,px));
  float sun=vShade.x*peakShade(p)*shapeShade(p)*farSun*(1.-.5*tusSh)*(1.-.8*stepSh)*(1.-.75*lipSh);
  // cloud shadows crossing the land, slowly, downwind
  sun*=cloudShade(p);
  float ao=mix(1.,vShade.y,.8)*(1.-.3*recess*blockK)*(1.-.3*crackJ*blockK)*(1.-.25*hol*(1.-smoothstep(0.,1.5,hw-he)));
  // the sky a stone shape hides from the slab at its foot (a shade at the contact, by the shape's own plan), and
  // the pale grit the wind drops in its lee: a drift tapering downwind, the same for every shape
  float grit=0.;
  for(int i=0;i<${ms};i++){
    if(i>=uShapeN) break;
    vec2 q=p.xz-uShape[i].xy; float al=dot(q,uWind), ac=dot(q,vec2(-uWind.y,uWind.x)), R=uShape[i].z, Lb=uShapeB[i].w, lev=step(abs(p.y-uShapeB[i].x),6.);
    float foot=length(vec2(al/(al>0. ? Lb : R*.9),ac/R));
    ao*=1.-.6*(1.-smoothstep(.9,1.8,foot))*lev;
    grit=max(grit,(1.-smoothstep(.55,1.,length(vec2((al-Lb*1.1)/(Lb*1.5),ac/(R*(1.15-.5*clamp((al-Lb)/(Lb*1.6),0.,1.)))))))*lev);
  }
  alb=mix(alb,vec3(.76,.7,.57)*(.85+.3*r2),grit*rock*lvl*(.5+.35*pn2(p.xz*.6+2.)));
  // level ground under a low sun shows its roughness turned to the light; the plates' edges are rounded down into
  // the hollows; on the scarp each bed stands out over the recess at its foot, and the upright recesses lie back
  vec3 Nl=normalize(N+vec3(uSunDir.x,0.,uSunDir.z)*.22*grass+(blockH-.5)*vec3(.34,.12,.34)*blockK*(1.-.7*farR)-vec3(cos(dipB),0.,sin(dipB))*tan(dipA)*slabK);
  float hb=blockK*(.3*min(bedH,blockE)*smoothstep(.3,.6,pn3(p*.045+9.))+.22*blockE-.3*gully)*(1.-.6*farR)+slabK*((.7*stepH*smoothstep(0.,.5+3.*px,edgeD-.5*(pn2(p.xz*1.7)-.5)*(1.-smoothstep(.2,1.,px)))*(1.-smoothstep(.25,1.,px))+.12*smoothstep(0.,1.6+px,edgeD))*(1.-.7*farR)+.05*r2+.02*r3)+pvK*(.1+pvStep)*smoothstep(0.,.4+2.*px,pv.x)
    -lipH*slab0*(1.-smoothstep(.1,.45+px,pd))*(1.-smoothstep(.5,2.,px));
  vec3 sx=dFdx(p), sy=dFdy(p), c1=cross(sy,Nl), c2=cross(Nl,sx); float det=dot(sx,c1);
  // (the tussocks are relief too: each has a lit side and a side turned from the sun)
  float hg=.16*tus*tusK;
  // (water lies level: no relief of the rock shows in a pool's face)
  Nl=normalize(abs(det)*Nl-sign(det)*(rock*(1.-pool0)*(dFdx(hb)*c1+dFdy(hb)*c2)+dFdx(hg)*c1+dFdy(hg)*c2));
  vec3 col=peakLit(alb,Nl,p,sun,ao);
  col+=alb*uSunCol*bed*net*2.2*sun;
  // veils of fine dust the wind drives over the bare shelf, long streaks running downwind
  vec2 dq=vec2(dot(p.xz,uWind)-uTime*13.,dot(p.xz,vec2(-uWind.y,uWind.x)))+uPhDust*31.;
  float dustv=smoothstep(.5,.8,pfbm2(dq*vec2(.035,.22)+3.*pn2(dq*.011)))*smoothstep(.3,.7,pn2(dq*vec2(.008,.02)+uTime*.05));
  col+=(uSunCol*.22*sun+uSkyLow*.13)*dustv*rock*lvl*(1.-pool);
  // the low sun's sheen on the worn rock, toward the sun
  col+=uSunCol*.2*rock*sun*(1.-pool)*pow(max(dot(N,normalize(uSunDir+normalize(cameraPosition-p))),0.),24.);
  // a pool of rain: the sky lying in it, wrinkled by the wind
  vec3 V=normalize(cameraPosition-p);
  float fres=.12+.88*pow(clamp(1.-V.y,0.,1.),3.);
  float rip=.9+.2*pn2(p.xz*2.6+uTime*vec2(.8,.5)+uPhRip);
  vec3 R=reflect(-V,vec3(0.,1.,0.));
  float rsun=pow(clamp(dot(normalize(R.xz+vec2(1e-5,0.)),normalize(uSunDir.xz))*.5+.5,0.,1.),2.);
  vec3 skyc=mix(mix(uFogAway,uFogSun,rsun),uSkyLow*2.6,smoothstep(0.,.5,R.y))*rip;
  // the stone shapes stand in a pool's mirror: each by its own place, height, breadth and lean, dark against the sky
  vec3 poolc=skyc;
  if(pool>0.){
    float rl=max(length(R.xz),1e-4), mir=0.; vec2 rd=R.xz/rl;
    for(int i=0;i<${ms};i++){
      if(i>=uShapeN) break;
      vec2 q=uShape[i].xy-p.xz; float t=max(dot(q,rd),0.), y=t*R.y/rl, k=clamp(y/uShape[i].w,0.,1.);
      vec2 ax=q+vec2(uShapeB[i].y,uShapeB[i].z)*y;
      mir=max(mir,(1.-smoothstep(.75,1.,abs(ax.x*rd.y-ax.y*rd.x)/(uShape[i].z*(1.-.45*k))))*(1.-smoothstep(.9,1.,y/uShape[i].w))*step(0.,dot(q,rd)));
    }
    poolc=mix(skyc,vec3(.36,.33,.3)*(uSkyLow*1.6+uSunCol*.2),mir);
    // THE MOUNTAIN AND ITS CROWN STAND IN THE MIRROR TOO, by the mirror's own law: the eye's ray turned at the water
    // is followed to the mountain's axis. The mountain is its own outline by height (faceR, as its shadow's), seen
    // where the ray comes within it (tried at the ray's nearest pass and at two places before it, where the broader
    // foot may be met first), lit on the side turned to the sun; the crown is the cloud's own place (185 to 290 m
    // up, to uAxis.y m out, ragged by place as its shadow is), in front of the rock where the ray meets it lower
    // (the wind's wrinkles shiver the image: the ray's rise by a twentieth)
    vec2 qa=uAxis.xz-p.xz; float ta=dot(qa,rd), sd=qa.x*rd.y-qa.y*rd.x, kR=max(R.y/rl,1e-3)*(1.+.5*(rip-1.));
    if(ta>0.){
      float inR=-1e4, tH=ta;
      for(int j=0;j<3;j++){ float t=max(ta-float(j)*45.,0.), y=p.y+t*kR, e=faceR(y)*(.94+.24*(pn2(vec2(y*.035,sign(sd)*9.3))-.5))*(1.-smoothstep(350.,362.,y))-length(vec2(sd,ta-t)); if(e>inR){ inR=e; tH=t; } }
      float mtn=smoothstep(-1.5,1.5,inR), yH=p.y+tH*kR;
      vec2 nH=normalize(rd*tH-qa+vec2(1e-4,0.));
      // (its granite in beds, and the green of its skirt to some 60 to 110 m up, as it stands)
      float skirt=1.-smoothstep(-8.,8.,yH-60.-50.*pn2(nH*5.+3.));
      vec3 mc=mix(vec3(.5,.48,.45)*(.78+.44*pn2(vec2(yH*.21,3.)+nH*2.)),vec3(.24,.4,.1)*(.8+.4*pn2(nH*23.+yH*.07)),skirt*.85)*(uSkyLow*1.5+uSunCol*.8*clamp(dot(nH,sunXZ)*1.3+.15,0.,1.));
      float t1=(185.-p.y)/kR, t2=(290.-p.y)/kR, tc=clamp(ta,t1,t2); vec2 pc=p.xz+rd*tc;
      float crown=(1.-smoothstep(.6,1.,length(qa-rd*tc)/uAxis.y+.4*(pfbm2(pc*.011+3.)-.5)))*smoothstep(-.1,.35,pfbm2(pc*.03+7.)-.3);
      poolc=mix(poolc,mix(mc,skyc,.12),mtn*(1.-mir));
      poolc=mix(poolc,mix(uCloudShade,uCloudLit,.45+.55*clamp(dot(normalize(pc-uAxis.xz+vec2(1e-4,0.)),sunXZ)*.5+.5,0.,1.))*rip,crown*(1.-mir)*(1.-mtn*step(yH,185.)));
    }
  }
  col*=1.-.4*damp*(1.-pool);
  // (the wet rim: darker stone with the sky's sheen on it)
  { float wet=slab0*(1.-hol)*(1.-pool)*(1.-smoothstep(.3,.7+px,pd)); col=mix(col,col*.58+skyc*.3*fres,wet); }
  poolc*=1.-.3*lipSh;
  // (the rill's water runs over dark peat: deep in tone where the eye looks down into it, the sky's mirror where
  // it looks along it, and glints of the sky's light going down it on the world's clock)
  vec3 pw=mix(col*.3,mix(poolc,uSkyLow*2.2,.35)*.8,.25+.75*fres);
  { float rk=rill*(1.-pool0), glint=.6*smoothstep(.64,.9,pn2(p.xz*8.6+uTime*vec2(1.7,1.1)+uPhRip))*(1.-smoothstep(.1,.5,px));
    pw=mix(pw,mix(vec3(.05,.08,.09)*(uSkyLow*2.+uSunCol*.3*sun),poolc*.9,fres*.75)+uSkyLow*1.5*glint,rk); }
  col=mix(col,pw,pool);
  // the far land's water: clear over its pale bed, the sky lying in it, and the sun's own gold on the reach that
  // lies under the sun from where the eye stands (a mirror's law)
  vec3 wcol=mix(vec3(.3,.62,.6)*(uSkyLow*2.+uSunCol*.45*sun),skyc*.9,fres);
  wcol+=uSunCol*3.*pow(max(dot(normalize(R+vec3(rip-1.,0.,.6*(rip-1.))*.25),uSunDir),0.),70.)*sun;
  col=mix(col,wcol,water);
  gl_FragColor=vec4(peakAir(col,p),1.);
}`,Ha=`
attribute vec4 iA, iB; attribute vec3 iC;
uniform float uTime; uniform vec3 uVel;
varying vec2 vUv; varying vec3 vK, vCol, vW;
void main(){
  // iA: where in the crown it comes away, and how far it has to fall; iB: phase, pace, a number of its own, size
  // (every divisor is held off nothing at its own term: a fall of half a metre at the least, a pace of a fifth, a
  // sinking of 0.05 m a second, a fall's time of a tenth of a second; the deal's own figures are all well over these)
  float T=max(iA.w,.5)/(max(-uVel.y,.05)*max(iB.y,.2)), s=fract(iB.x+uTime/max(T,.1)), t=s*T, free=smoothstep(0.,2.,t);
  vec3 c=iA.xyz+uVel*(iB.y*t);
  vec2 side=normalize(vec2(-uVel.z,uVel.x)+1e-5);
  c.xz+=side*(sin(t*1.1+iB.z*40.)*.9+sin(t*2.7+iB.z*13.)*.3)*free;
  c.y+=sin(t*2.3+iB.z*29.)*.25*free;
  float tum=t*(3.+4.*iB.z)+iB.z*50., ca=cos(tum*.7), sa=sin(tum*.7), flip=.25+.75*abs(cos(tum));
  vec3 right=vec3(viewMatrix[0][0],viewMatrix[1][0],viewMatrix[2][0]), up=vec3(viewMatrix[0][1],viewMatrix[1][1],viewMatrix[2][1]);
  vec2 q=vec2(position.x*ca-position.y*sa*flip,position.x*sa+position.y*ca*flip)*iB.w;
  vW=c+right*q.x+up*q.y; vUv=position.xy; vCol=iC;
  // (it comes away over the first twentieth of its fall and is lost in the grass over the last)
  vK=vec3(iB.z,smoothstep(0.,.04,s)*(1.-smoothstep(.93,1.,s)),.6+.4*abs(cos(tum+1.)));
  gl_Position=projectionMatrix*viewMatrix*vec4(vW,1.);
}`,qa=`
attribute vec4 aArc;
varying vec2 vUv; varying vec3 vW;
void main(){
  vUv=uv;
  vec3 wp=(modelMatrix*vec4(position,1.)).xyz;
  wp+=normalize(cross(aArc.xyz,cameraPosition-wp))*uv.x*aArc.w;
  vW=wp; gl_Position=projectionMatrix*viewMatrix*vec4(wp,1.);
}`,Ga=`
uniform vec2 uFallY; uniform float uPhFall;
varying vec2 vUv; varying vec3 vW;
${io}
void main(){
  float s=vUv.x, tau=clamp((uFallY.x-vW.y)/uFallY.y,0.,1.);
  // a parcel of water keeps its number as it falls, so every surge and strand is drawn out as it gathers speed
  float z=vUv.y-uTime*.62+uPhFall;
  float a=pfbm2(vec2(s*1.1+3.,z*.75)), b=pn2(vec2(s*2.6+a*1.6,z*1.9+7.));
  float f=1.-abs(2.*pn2(vec2(s*7.+b*2.4,z*2.4))-1.);
  float body=smoothstep(.2,.58,a*.5+b*.4+f*f*f*.3+.28*(1.-s*s));
  float al=body*pow(max(1.-s*s,0.),1.1)*smoothstep(0.,.07,tau)*(1.-.5*smoothstep(.9,1.,tau))*.78;
  vec3 V=normalize(vW-cameraPosition); float toSun=clamp(dot(V,uSunDir)*.5+.5,0.,1.);
  // white water: the sky's light from every side, the sun's on it, brighter seen toward the sun
  vec3 col=(uSkyLow*1.5+uSunCol*(.3+.4*toSun*toSun))*(.82+.3*f);
  gl_FragColor=vec4(peakAir(col,vW),al);
}`,Oa=`
varying vec2 vUv; varying vec3 vK, vCol, vW;
${io}
void main(){
  vec2 q=vUv-vec2(0.,.04); float d=length(q*vec2(1.,1.4+.5*q.x));
  float a=(1.-smoothstep(.56,.68,d))*vK.y;
  if(a<.02) discard;
  vec3 col=vCol*(uSkyLow*1.1+uSunCol*.8*vK.z*peakShade(vW));
  gl_FragColor=vec4(peakAir(col,vW),a);
}`,lt={rose:"#e4577c",white:"#f4f0e6",yellow:"#f6d44c",violet:"#8b6fe0",blue:"#5aa2f0"},Ia=[["rose","white"],["yellow","violet"],["blue","white"]];var Ua={id:"peak-above-the-singing-fields",name:"The Peak Above the Singing Fields",category:"books",placeKind:"wilderness",book:"A Wrinkle in Time",author:"Madeleine L'Engle, 1918 to 2007",media:["air"],weirdness:.5,async build(b){const ct=b.core,je=b.vary||{},Ft=b.quality?.detail??1,z=e=>ct.makeRng(ct.hashSeed("peak:"+e+":"+b.seed)),ws=z("form"),vs=z("sky"),bs=z("land"),xs=z("shapes"),ys=z("shapeform"),Y=z("singles"),he=z("foot"),Fe=z("garden"),ks=z("grass"),lo=z("flowers"),Tt=z("water"),As=z("air"),zs=z("reach"),Ss=z("moon"),Te=z("ledge"),be=z("ledgetree"),Re=z("neartrees"),pe=z("petals"),Ms=z("down"),Ls=z("spur"),xe=z("spurtrees"),js=z("tors"),Fs=z("torform"),X=z("copses"),Ts=z("fallbody"),Xe=z("scarpfoot"),de=z("blocks"),_e=z("facetrees"),fe=z("breachstones"),Ne=z("rushes"),$=ct.makeNoise(ct.hashSeed("peak:noise:"+b.seed)),S=new w.Scene,co=je.hour==="day"?"day":je.hour==="dawn"?"dawn":je.hour==="night"?"low":"golden",E=za(co),ht=!!je.rare,Rs=V(je.density??1,.7,1.3),Rt=V(je.mood??.5,0,.9999),I=Ia[Math.floor(Rt*3)%3],Ns=Math.floor(Rt*9)%3,Ps=Rt*27%1,G=Sa(E);for(const[e,t]of[["gust","uPhGust"],["dust","uPhDust"],["waves","uPhWave"],["rivernet","uPhNet"],["ripple","uPhRip"],["shimmer","uPhShim"]]){const o=z(e);G.uniforms[t].value.set(o.range(0,97),o.range(0,97))}const H=E.sunDir,Za=E.moonDir,Nt=va({rng:vs,preset:co==="day"?"day":"goldenHour",transparent:!0,zenith:E.zen,horizon:E.hor,mid:new w.Color(E.zen).lerp(new w.Color(E.hor),.42),ground:"#9aa78a",sunElevation:E.sunEl,sunAzimuth:E.sunAz,sunColor:E.sun,sunSize:1.5,sunIntensity:12,scatterColor:E.fogSun,scatter:.5,scatterPow:4,bodies:[],stars:0,clouds:!1,clouds2:!1,lightColor:E.sun,lightIntensity:E.sunK,ambientColor:E.skyLow,groundLight:"#6f8a4e",ambientIntensity:E.hemi,lightElevationMin:4}),ho=ba(Nt,{intensity:1,ambient:1});S.add(ho.object),S.fog=new w.FogExp2(new w.Color(E.fogSun).lerp(new w.Color(E.fogAway),.5),22e-5),await b.yield();const Pe=Ma(ws,$,Ls),v=La($,Pe);await b.yield();const po=ja(v),j=wa(po),ye=j.length,fo=[];{const e=new w.Vector3;for(let t=0;t<=ye;t+=3)j.posAtDist(t,e),fo.push([e.x,e.y,e.z])}await b.yield();const O=await xa(b,{hour:E,light:G,origin:[u.AX,u.AZ],form:Pe,full:Ps,route:fo});O.object.position.set(u.AX,0,u.AZ),S.add(O.object),O.heightAt=(e,t)=>v.surfaceAt(e,t),O.levelAt=(e,t)=>v.levelAt(e,t),await b.yield();const Q=new w.Vector3,ee=new w.Vector3,Pt=Fa({path:j,land:v,form:Pe,knots:po}),pt=Pt.S,Es=pt.rim,Bs=pt.edge,Et=pt.fall,Ds=pt.foot,ke=e=>new w.Color(e),Ks=ke("#b2dc64"),Ws=ke("#7cbc4c"),Cs=ke("#b9b7b2"),Hs=ke("#8d8a80"),qs=ke("#d8ccae"),Gs=ke("#7b8a4e");let uo=NaN,mo=NaN,go=NaN,wo=NaN;const Bt={},Os={w:0,sd:0},dt=(e,t,o,a,s)=>{if(e===uo&&t===mo&&o===go&&a===wo&&s===te)return s;uo=s===te?e:NaN,mo=t,go=o,wo=a;const n=v.scarpAt(e,t,Bt),h=e-(u.FALLX-20),c=t-u.FALLZ;let r=h*h+c*c<676?D(25,20,K(h,c)):0;if(v.nearRiver(e,t)){const F=v.riverAt(e,t),m=v.riverHalf(F.s);r=Math.max(D(m+1.5,m-2.5,F.d),r)}const l=D(.86,.66,a),i=v.terraceEnd(e,t,Os),p=Math.max(D(4,-4,n.s1)*(1-n.br)*(1-D(-4,4,i.sd)*i.w),l*D(n.wl+26,n.wl+8,n.s1)*(1-.7*n.br)),f=D(-8,0,i.sd)*i.w*(1-D(-152,-120,e))*D(52,40,i.sd),g=D(-345,-330,e)*(1-D(-160,-140,e))*D(-435,-420,t)*(1-D(-270,-250,t)),d=Math.max(f,g)*(1-r),A=V(p,0,1)*(1-r)*(1-f);return s.rock=A,s.bed=r,s.garden=d,s.grass=V(1-A-r,0,1),s},te={rock:0,bed:0,garden:0,grass:0},Is=new w.Color,Dt={},vo=(e,t,o,a=1,s=Is)=>{const n=dt(e,t,o,a,te),h=$.fbm2(e/75+2.2,t/75-6.1,2),c=e-u.AX,r=t-u.AZ;if(s.copy(Ks).lerp(Ws,V(.45+.6*h,0,1)),c*c+r*r<=57121){const l=D(238,196,K(c,r))*(1-n.garden);s.lerp(Gs,.2*l),s.lerp(Hs,.45*l*D(.2,.7,$.n2(e/17,t/17)*.5+.5))}return s.lerp(Cs,n.rock).lerp(qs,n.bed),s},Zs=[I[0],I[0],I[0],I[1],I[1],...Object.keys(lt).filter(e=>!I.includes(e))].slice(0,8).map(e=>ke(lt[e])),ft=new w.ShaderMaterial({name:"PeakGround",vertexShader:Wa,fragmentShader:Ca,vertexColors:!0,uniforms:{...G.uniforms,uFl:{value:Zs},uBloom:{value:ht?1.5:1},uFarR:{value:Ea.map(e=>new w.Vector2(e[0],e[1]))},uBeck:{value:Da.map(e=>new w.Vector2(e[0],e[1]))},uTor:{value:[0,1,2,3,4,5].map(()=>new w.Vector4(0,0,1,1))},uTorN:{value:0}}}),Kt=new w.DataTexture(new Uint8Array([128,128,128,255]),1,1);Kt.needsUpdate=!0,ft.detailMap=Kt;const ne=[-3350,-3700,3350,3e3],Ee=3,bo=8,Be=Ee*(1<<bo),xo=Math.max(1,Math.round((ne[2]-ne[0])/Be)),yo=Math.max(1,Math.round((ne[3]-ne[1])/Be)),U=(ne[0]+ne[2])/2-xo*Be/2,oe=(ne[1]+ne[3])/2-yo*Be/2,ko=xo*Be,Ao=yo*Be,Vs=(()=>{const e=Math.max(Ee*2,Math.max(ko,Ao)/360),t=Math.ceil(ko/e),o=Math.ceil(Ao/e),a=t+1,s=new Float32Array(a*(o+1)).fill(1e9),n=Math.max(64,Math.ceil(j.length/e*2)),h=new w.Vector3;for(let c=0;c<=n;c++){j.pointAt(c/n,h);const r=(h.x-U)/e,l=(h.z-oe)/e,i=Math.floor(r),p=Math.floor(l);for(let f=0;f<2;f++)for(let g=0;g<2;g++){const d=i+g,A=p+f;if(d<0||A<0||d>t||A>o)continue;const F=K(r-d,l-A),m=A*a+d;F<s[m]&&(s[m]=F)}}for(let c=0;c<=o;c++)for(let r=0;r<=t;r++){const l=c*a+r;let i=s[l];r>0&&s[l-1]+1<i&&(i=s[l-1]+1),c>0&&(s[l-a]+1<i&&(i=s[l-a]+1),r>0&&s[l-a-1]+1.4142<i&&(i=s[l-a-1]+1.4142),r<t&&s[l-a+1]+1.4142<i&&(i=s[l-a+1]+1.4142)),s[l]=i}for(let c=o;c>=0;c--)for(let r=t;r>=0;r--){const l=c*a+r;let i=s[l];r<t&&s[l+1]+1<i&&(i=s[l+1]+1),c<o&&(s[l+a]+1<i&&(i=s[l+a]+1),r<t&&s[l+a+1]+1.4142<i&&(i=s[l+a+1]+1.4142),r>0&&s[l+a-1]+1.4142<i&&(i=s[l+a-1]+1.4142)),s[l]=i}return(c,r)=>{const l=V((c-U)/e,0,t-.001),i=V((r-oe)/e,0,o-.001),p=Math.floor(l),f=Math.floor(i),g=l-p,d=i-f,A=f*a+p;return((s[A]*(1-g)+s[A+1]*g)*(1-d)+(s[A+a]*(1-g)+s[A+a+1]*g)*d)*e}})();await b.yield();const Z={reach:150,top:u.SHELF+6,cell:2*Ee},Wt=await(async()=>{const e=Z.cell,t=[],o=new w.Vector3;let a=1e9,s=-1e9,n=1e9,h=-1e9;for(let m=0;m<=j.length;m+=4)j.posAtDist(m,o),!(o.y>Z.top+Z.reach)&&(t.push(o.x,o.y,o.z),a=Math.min(a,o.x),s=Math.max(s,o.x),n=Math.min(n,o.z),h=Math.max(h,o.z));const c=Math.floor((a-Z.reach-U)/e),r=Math.floor((n-Z.reach-oe)/e),l=Math.ceil((s+Z.reach-U)/e)-c,i=Math.ceil((h+Z.reach-oe)/e)-r,p=l+1,f=new Float64Array(p*(i+1)).fill(NaN),g=new Uint8Array(p*(i+1));for(let m=0;m<t.length;m+=3){const y=Math.max(0,t[m+1]-Z.top),x=(Z.reach+e)*(Z.reach+e)-y*y,k=(t[m]-U)/e-c,M=(t[m+2]-oe)/e-r,W=Math.sqrt(x)/e;for(let N=Math.max(0,Math.ceil(M-W));N<=Math.min(i,Math.floor(M+W));N++){const P=Math.sqrt(Math.max(0,x/(e*e)-(N-M)*(N-M))),T=Math.max(0,Math.ceil(k-P)),ce=Math.min(l,Math.floor(k+P));ce>=T&&g.fill(1,N*p+T,N*p+ce+1)}}for(let m=0,y=0,x=p*(i+1);m<x;m++)g[m]&&(f[m]=v.height(U+(c+m%p)*e,oe+(r+Math.floor(m/p))*e),++y%5e3===0&&await b.yield());const d=new Int32Array(p*(i+1));for(let m=0;m<i;m++)for(let y=0;y<l;y++){const x=m*p+y,k=f[x],M=f[x+1],W=f[x+p],N=f[x+p+1],P=(M-k)*(M-k),T=(N-W)*(N-W),ce=(W-k)*(W-k),Ie=(N-M)*(N-M);let ve=0;if(Math.max(P,T)+Math.max(ce,Ie)>=e*e){const Ze=U+(c+y+.5)*e,Ve=oe+(r+m+.5)*e,Lt=(k+M+W+N)/4;for(let at=0;at<t.length;at+=3){const hs=t[at]-Ze,ps=t[at+1]-Lt,ds=t[at+2]-Ve;if(hs*hs+ps*ps+ds*ds<=Z.reach*Z.reach){ve=1;break}}}d[(m+1)*p+y+1]=ve+d[m*p+y+1]+d[(m+1)*p+y]-d[m*p+y]}return{any:(m,y,x,k)=>{const M=V(Math.round((m-U)/e)-c,0,l),W=V(Math.round((x-U)/e)-c,0,l),N=V(Math.round((y-oe)/e)-r,0,i),P=V(Math.round((k-oe)/e)-r,0,i);return d[P*p+W]-d[N*p+W]-d[P*p+M]+d[N*p+M]>0},heightAt:(m,y)=>{const x=(m-U)/e-c,k=(y-oe)/e-r;if(x>=0&&x<=l&&k>=0&&k<=i&&x===Math.floor(x)&&k===Math.floor(k)){const M=f[k*p+x];if(M===M)return M}return v.height(m,y)},squares:d[i*p+l]}})();await b.yield();const Xs=(e,t)=>{const o=Vs(e,t);if(o<Z.reach+40){const a=Math.round((e-U)/(Ee/2)),s=a&-a,n=s*Ee/2;if(s>=2&&s<=16&&Wt.any(e-n,t-n,e+n,t+n))return 0}return Math.max(46,o)},J=[],Ae=await ro.makeTerrainAsync({rng:bs,noise:$,path:j,height:Wt.heightAt,corridor:!1,bounds:ne,cell:Ee,near:20,levels:bo,focus:Xs,color:(e,t,o,a,s)=>{const n=vo(e,t,o,a,s);return J.push(e,t,o,a,te.grass,te.rock,te.garden,te.bed),n},sunDir:H,shadow:.9,ao:.4,skirt:40,maxTriangles:105e3,materialInstance:ft,detailTexture:Kt},b.yield);Ae.steepSquares=Wt.squares;{const e=Ae.geometry.attributes.position,t=Ae.geometry.attributes.normal,o=e.count,a=new Float32Array(o*4);for(let s=0,n=0;s<o;s++){const h=e.getX(s),c=e.getZ(s),r=e.getY(s),l=t.getY(s),i=s*8;if(J[i]===h&&J[i+1]===c&&J[i+2]===r&&J[i+3]===l){a[s*4]=J[i+4],a[s*4+1]=J[i+5],a[s*4+2]=J[i+6],a[s*4+3]=J[i+7];continue}const p=dt(h,c,r,l,te);a[s*4]=p.grass,a[s*4+1]=p.rock,a[s*4+2]=p.garden,a[s*4+3]=p.bed,++n%3e3===0&&await b.yield()}Ae.keptKinds=J.length/8,J.length=0,Ae.geometry.setAttribute("aZone",new w.BufferAttribute(a,4))}Ae.object.name="ground",S.add(Ae.object),await b.yield();const Ct=await ya(xs,v,j,Ns,b.yield),_s=await us(b,Ct,{rng:ys,noise:$,light:G,rock:O.rock});S.add(_s.object),await b.yield();const Ht=Ba(js,v),Us=await us(b,Ht,{rng:Fs,noise:$,light:G,rock:O.rock,cols:16,rows:14,shadows:!1,name:"far tors"});S.add(Us.object),Ht.forEach((e,t)=>ft.uniforms.uTor.value[t].set(e.x,e.z,e.T,e.h)),ft.uniforms.uTorN.value=Ht.length,await b.yield();const qt=K(H.x,H.z)||1e-4,ut=H.x/qt,mt=H.z/qt,zo=H.y/qt,Ue=(e,t,o,a=!0)=>{const s=e-u.AX,n=o-u.AZ,h=-(s*ut+n*mt);if(h>0){const c=Math.abs(s*mt-n*ut),r=t+h*zo;if(r<356&&c<Na(r))return 0}if(a)for(const c of Ct){const r=e-c.x,l=o-c.z,i=-(r*ut+l*mt);if(i>c.R*1.25){const p=t-c.base+i*zo,f=Math.abs((r-c.leanX*p)*mt-(l-c.leanZ*p)*ut);if(p>0&&p<c.h*.95&&f<c.R)return 0}}return 1},re=[.6,.64,.82],ue=[1,1,1],So=[];for(let e=0;e<=ye&&(j.posAtDist(e,Q),!(Q.y>130));e+=5)So.push([Q.x,Q.z,e]);const ie=(e,t,o)=>{let a=1e9,s=0,n=1e18;for(const h of So){const c=e-h[0],r=t-h[1],l=c*c+r*r;if(l>n)continue;const i=K(c,r);i<a&&(a=i,s=h[2],n=l*1.0000001)}return o&&(o.s=s),a},Gt=L.makeWind({direction:[G.uniforms.uWind.value.x,G.uniforms.uWind.value.y],strength:1.15,speed:1}),Mo={wind:Gt,backlight:1.2,backlightTint:"#fff0c0",ambient:2,leafAmbient:2.3,wrap:1};await L.prepareLeafTexture(Mo,b.yield);const me=L.windMaterial(Mo),gt={leaf:"#f6efe9",leafLight:"#ffffff",leafDark:"#d9c3c8",bark:"#4a3a36"},Ot={leaf:"#f3bccb",leafLight:"#ffe1ea",leafDark:"#d58aa4",bark:"#4a3a36"},wt={leaf:"#5fa23a",leafLight:"#9fd060",leafDark:"#3f7a3a"},Lo=async e=>{const t=[];for(const o of[()=>L.cherryGeometry({rng:Y,height:9,detail:e,...gt}),()=>L.cherryGeometry({rng:Y,height:8.5,detail:e,...Ot}),()=>L.oakGeometry({rng:Y,height:12,detail:e,...wt}),()=>L.birchGeometry({rng:Y,height:13,detail:e,...wt})])t.push(o()),await b.yield();return t},Js=await Lo(1),It=await Lo(0);await b.yield();const le=[],jo={s:0},ze=(e,t,o)=>{const a=o*.999999,s=o*1.000001,n=a*a,h=s*s;for(const c of le){const r=e-c.x,l=t-c.z,i=r*r+l*l;if(i<n||i<h&&K(r,l)<o)return!1}return!0},Se=e=>e-Math.floor(e),Zt=(e,t)=>{let o=Se(e*.1031),a=Se(t*.1031),s=o;const n=o*(a+33.33)+a*(s+33.33)+s*(o+33.33);return o+=n,a+=n,s+=n,Se((o+a)*s)},R=Math.fround,Ys=R(.1031),Fo=R(33.33),q=(e,t)=>R(e+R(t)),De=e=>{const t=R(R(e)*Ys);return R(t-Math.floor(t))},Je=(e,t)=>{const o=R(e+Fo),a=R(R(R(e*R(t+Fo))+R(t*o))+R(e*o)),s=R(e+a),n=R(R(s+R(t+a))*s);return R(n-Math.floor(n))},se=(e,t)=>Je(De(e),De(t)),B=(e,t)=>{const o=Math.floor(e),a=Math.floor(t);let s=e-o,n=t-a;s=s*s*(3-2*s),n=n*n*(3-2*n);const h=De(o),c=De(o+1),r=De(a),l=De(a+1),i=Je(h,r),p=Je(c,r);return(i+(p-i)*s)*(1-n)+C(Je(h,l),Je(c,l),s)*n},To=(e,t)=>{let o=.5,a=0;for(let s=0;s<4;s++)a+=o*B(e,t),e=e*2.03+17.3,t=t*2.03+9.1,o*=.5;return a},Ke=new Float32Array(256*256*2).fill(NaN),ge=new Float64Array(512*512*3).fill(NaN),We=[0,0,0],Ro=(e,t)=>{const o=se(q(e,91.3),q(t,91.3));return We[0]=o,We[1]=We[2]=0,o<.6&&(We[1]=(e+.5+(se(q(e,3.1),q(t,3.1))-.5)*.55)*26,We[2]=(t+.5+(se(q(e,47.7),q(t,47.7))-.5)*.55)*26),We},No=(e,t)=>{const o=(e+7*B(e*.021+3,t*.021+3)+2*B(e*.09+1,t*.09+1))/30,a=(t+7*B(e*.021+8,t*.021+8)+2*B(e*.09+6,t*.09+6))/30,s=Math.floor(o),n=Math.floor(a),h=o-s,c=a-n;let r=9,l=9;for(let i=-1;i<=1;i++)for(let p=-1;p<=1;p++){const f=s+p,g=n+i;let d,A;if(f>=-128&&f<128&&g>=-128&&g<128){const x=((g+128)*256+f+128)*2;Ke[x]!==Ke[x]&&(Ke[x]=se(f,g),Ke[x+1]=se(q(f,31.7),q(g,31.7))),d=Ke[x],A=Ke[x+1]}else d=se(f,g),A=se(q(f,31.7),q(g,31.7));const F=p+d*.8+.1-h,m=i+A*.8+.1-c,y=F*F+m*m;y<r?(l=r,r=y):y<l&&(l=y)}return(Math.sqrt(l)-Math.sqrt(r))*15},Po=(e,t)=>{const o=Math.floor(e/26),a=Math.floor(t/26);let s=9;for(let n=-1;n<=1;n++)for(let h=-1;h<=1;h++){const c=o+h,r=a+n;let l,i,p;if(c>=-256&&c<256&&r>=-256&&r<256){const d=((r+256)*512+c+256)*3;if(ge[d]!==ge[d]){const A=Ro(c,r);ge[d]=A[0],ge[d+1]=A[1],ge[d+2]=A[2]}l=ge[d],i=ge[d+1],p=ge[d+2]}else{const d=Ro(c,r);l=d[0],i=d[1],p=d[2]}if(l>=.6)continue;const f=2+4*Se(R(l*R(7.3))),g=K(e-i,t-p);g-1.2*f>=s||(s=Math.min(s,g-f*(.8+.4*B(e*.35+l*20,t*.35+l*20))))}return s},$s=(e,t)=>{const o=No(e,t);if(o>=4.95)return 0;const a=1+3.4*B(e*.03+11,t*.03+11),s=o+1.1*(B(e*.42+5,t*.42+5)-.5)+.5*(B(e*1.7,t*1.7)-.5);return s>=a-.25||a>1.5&&o<.15+.25*(.6*B(e*.07+31,t*.07+31)+.4*B(e*.45+7,t*.45+7))+.2?0:(1-D(a-.75,a-.25,s))*D(.6,1.6,Po(e,t))},Qs=(e,t)=>No(e,t)+1.1*(B(e*.42+5,t*.42+5)-.5)+.5*(B(e*1.7,t*1.7)-.5)<.75+3.4*B(e*.03+11,t*.03+11),Eo=(e,t)=>D(.42,.74,B(e*1.15+3.7,t*1.15+3.7)*.62+B(e*2.6+11.3,t*2.6+11.3)*.38),ea=(e,t)=>{const o=e*.022+1.3*B(e*.011,t*.011),a=t*.022+1.3*B(e*.011+7,t*.011+7);return 1-D(.31,.35,K(Se(o)-.5,Se(a)-.5)+.5*(To(e*.045+3,t*.045+3)-.5)+.07*(B(e*.33+1.7,t*.33+1.7)-.5))},ta=(e,t)=>{const o=Math.floor(e/430-.5),a=Math.floor(t/430-.5);for(let s=0;s<2;s++)for(let n=0;n<2;n++){const h=o+n,c=a+s,r=Zt(h+71.3,c+71.3);if(r<.38&&K(e-(h+.5+(Zt(h+13.1,c+13.1)-.5)*.6)*430,t-(c+.5+(Zt(h+29.7,c+29.7)-.5)*.6)*430)<(18+60*r)*1.3+9)return!0}return!1},we=(e,t)=>{const o=v.riverAt(e,t);return o.d<v.riverHalf(o.s)+7||K(e-(u.FALLX-20),t-u.FALLZ)<31||K(e-ae.x,t-ae.z)<ae.r+16||ta(e,t)||Ka(e,t)<52},Ye=(e,t,o,a,s,n)=>{const h=ie(e,t,jo);le.push({x:e,y:o,z:t,s,rot:n.range(0,Math.PI*2),d:h,u:jo.s/ye,v:a})};for(let e=0;e<3;e++)for(let t=0;t<14;t++){const o=C(14,Math.max(60,Ds-30),(e+Re.range(.15,.85))/3),a=Re.sign(),s=Re.range(9,12);j.posAtDist(o,Q),j.tangentAtDist(o,ee);const n=K(ee.x,ee.z)||1,h=Q.x+ee.z/n*a*s,c=Q.z-ee.x/n*a*s;if(!(we(h,c)||v.shelfSd(h,c)<16||ie(h,c)<8.8||!ze(h,c,12))){Ye(h,c,v.height(h,c),Re.int(0,1),Re.range(.85,1),Re);break}}for(const[e,t,o]of[[12,Es-20,5],[Bs+10,Et+20,4]])for(let a=0;a<o;a++)for(let s=0;s<14;s++){const n=C(e,t,(a+Y.range(.15,.85))/o),h=Y.sign(),c=Y.range(12,20);j.posAtDist(n,Q),j.tangentAtDist(n,ee);const r=K(ee.x,ee.z)||1,l=Q.x+ee.z/r*h*c,i=Q.z-ee.x/r*h*c;if(!(we(l,i)||v.shelfSd(l,i)<16||ie(l,i)<11.5||!ze(l,i,12))){Ye(l,i,v.height(l,i),Y.int(0,1),Y.range(.85,1.2),Y);break}}await b.yield();const Bo=128;for(let e=0,t=0;e<Bo&&t<Bo*14;t++){const o=he.range(0,Math.PI*2),a=150+112*Math.pow(he(),.8),s=u.AX+Math.sin(o)*a,n=u.AZ-Math.cos(o)*a;if($.n2(s/60+9.1,n/60-4.4)<-.25||v.shelfSd(s,n)<10||we(s,n)||ie(s,n)<22||!ze(s,n,7)||Pe.cleft(Math.atan2(s-u.AX,-(n-u.AZ))/gs,a)>0)continue;const h=v.surfaceAt(s,n);h>70||(Ye(s,n,h,he.chance(.3)?he.int(0,1):he.int(2,3),he.range(.75,1.3),he),e++,t%60===59&&await b.yield())}await b.yield();const Do=38;for(let e=0,t=0;e<Do&&t<Do*14;t++){const o=Fe.range(-342,-146),a=Fe.range(-428,-246);if(we(o,a)||ie(o,a)<15||!ze(o,a,9)||v.shelfSd(o,a)<4)continue;const s=v.surfaceAt(o,a);s>40||(Ye(o,a,s,Fe.chance(.8)?Fe.int(0,1):3,Fe.range(.8,1.2),Fe),e++)}const Ko=16,vt=[];for(let e=0,t=0;e<Ko&&t<Ko*20;t++){const o=X.range(0,Math.PI*2),a=X.range(260,820),s=u.AX+Math.sin(o)*a,n=u.AZ-Math.cos(o)*a;if(v.shelfSd(s,n)<30||we(s,n)||ie(s,n)<70||n>-30&&Math.abs(s-nt.x)<60)continue;const h=X.int(4,7);for(let c=0;c<h;c++){const r=s+X.range(-24,24),l=n+X.range(-24,24),i=X.chance(.4)?X.int(0,1):X.int(2,3),p=X.range(.8,1.35),f=X.range(0,Math.PI*2);we(r,l)||!ze(r,l,8)||vt.some(g=>K(g.x-r,g.z-l)<7)||vt.push({x:r,y:v.height(r,l),z:l,s:p,rot:f,d:99,u:0,v:i})}e++}const _=[Me.lobes[1].cx-Me.lobes[1].hx-40,Me.cx+Me.hx+40,Me.cz-10,Me.lobes[1].cz+Me.lobes[1].hz+44];for(let e=0,t=0;e<9&&t<500;t++){const o=Xe.range(_[0],_[1]),a=Xe.range(_[2],_[3]),s=v.scarpAt(o,a,Dt);s.s1<s.wl+15||s.s1>s.wl+34||we(o,a)||ie(o,a)<13||!ze(o,a,14)||(Ye(o,a,v.height(o,a),Xe.int(0,1),Xe.range(.7,1),Xe),e++)}for(let e=le.length-1;e>=0;e--)K(le[e].x-(u.FALLX-9),le[e].z-u.FALLZ)<46&&le.splice(e,1);const Wo=L.makeScatter({rng:he,points:le,variants:Js,farVariants:It,farDistance:48,material:me,tint:.14,hue:.05,shade:(e,t)=>{const o=Ue(e,v.height(e,t)+6,t,!1);return ue[0]=C(re[0],1,o),ue[1]=C(re[1],1,o),ue[2]=C(re[2],1,o),ue}});S.add(Wo.object),await b.yield();const oa=(e,t)=>{const o=Ue(e,v.height(e,t)+6,t,!1);return ue[0]=C(re[0],1,o),ue[1]=C(re[1],1,o),ue[2]=C(re[2],1,o),ue},sa=[gt,Ot,wt,{leaf:"#4f9440",leafLight:"#8cc65a",leafDark:"#356e3a"}].map(e=>L.bushGeometry({rng:X,size:4.6,detail:0,...e})),Co=L.makeScatter({rng:X,points:vt,variants:sa,material:me,tint:.14,hue:.05,shade:oa});await b.yield();const aa=L.makeGroundShadows({points:vt.map(e=>({x:e.x,z:e.z,r:3.4*e.s})),heightAt:v.height,sunDir:H,strength:.62,color:"#2a3162",size:1.1,stretch:2.4,lift:.3,cell:16});S.add(Co.object,aa.object),await b.yield();const Ce=[];{const e=["rock","slab","rock"].map(h=>ro.rockGeometry({rng:de,noise:$,kind:h,radius:1,detail:1})),t=[],o=[],a=[];for(let h=0,c=0;h<44&&c<1400;c++){const r=de.range(_[0],_[1]),l=de.range(_[2]-60,_[3]),i=.6+3*Math.pow(de(),2.4),p=de(),f=v.scarpAt(r,l,Dt);if(f.s1<f.wl+9||f.s1>f.wl+30||p>1-.8*(f.s1-f.wl-9)/21||f.br>.25||l<-236||we(r,l)||ie(r,l)<9+i||!ze(r,l,3+i))continue;const g=e[de.int(0,2)],d=g.attributes.position.array,A=g.attributes.normal.array,F=de.range(0,Math.PI*2),m=Math.cos(F),y=Math.sin(F),x=de.range(-.35,.35),k=Math.cos(x),M=Math.sin(x),W=v.height(r,l)+i*.3,N=Ue(r,W+i,l);for(let P=0;P<d.length;P+=3){const T=d[P],ce=d[P+1]*k-d[P+2]*M,Ie=d[P+1]*M+d[P+2]*k,ve=A[P],Ze=A[P+1]*k-A[P+2]*M,Ve=A[P+1]*M+A[P+2]*k;t.push(r+(T*m-Ie*y)*i,W+ce*i,l+(T*y+Ie*m)*i),o.push(ve*m-Ve*y,Ze,ve*y+Ve*m),a.push(0,N,.94)}Ce.push({x:r,z:l,r:i}),h++}const s=new w.BufferGeometry;s.setAttribute("position",new w.Float32BufferAttribute(t,3)),s.setAttribute("normal",new w.Float32BufferAttribute(o,3)),s.setAttribute("aDress",new w.Float32BufferAttribute(a,3));const n=new w.Mesh(s,O.rock);n.name="fallen blocks",S.add(n)}await b.yield();{const e=["rock","slab","boulder"].map(r=>ro.rockGeometry({rng:fe,noise:$,kind:r,radius:1,detail:0})),t=fe.int(50,70),o=[],a=[],s=[],n=Ce.length;for(let r=0,l=0;r<t&&l<t*40;l++){const i=fe.range(rt.z-80,rt.z+70),p=rt.x+(i-rt.z)*rt.lean+fe.range(-48,48),f=.2+.7*Math.pow(fe(),1.7),g=fe.range(0,Math.PI*2),d=fe.range(-.3,.3),A=e[fe.int(0,2)],F=v.scarpAt(p,i,Dt);if(F.br<.55||F.sd<-28||F.sd>58||j.nearestXZ(p,i).dist<3+1.2*f)continue;const m=v.height(p,i);if(j.distanceTo(p,m,i)-1.2*f<2||Ce.some(T=>K(T.x-p,T.z-i)<T.r+f+.5))continue;const y=A.attributes.position.array,x=A.attributes.normal.array,k=Math.cos(g),M=Math.sin(g),W=Math.cos(d),N=Math.sin(d),P=Ue(p,m+f,i);for(let T=0;T<y.length;T+=3){const ce=y[T],Ie=y[T+1]*W-y[T+2]*N,ve=y[T+1]*N+y[T+2]*W,Ze=x[T],Ve=x[T+1]*W-x[T+2]*N,Lt=x[T+1]*N+x[T+2]*W;o.push(p+(ce*k-ve*M)*f,m+Ie*f,i+(ce*M+ve*k)*f),a.push(Ze*k-Lt*M,Ve,Ze*M+Lt*k),s.push(0,P,.94)}Ce.push({x:p,z:i,r:f}),r++}const h=new w.BufferGeometry;h.setAttribute("position",new w.Float32BufferAttribute(o,3)),h.setAttribute("normal",new w.Float32BufferAttribute(a,3)),h.setAttribute("aDress",new w.Float32BufferAttribute(s,3));const c=new w.Mesh(h,O.rock);c.name="breach stones",c.userData.count=Ce.length-n,S.add(c)}const Vt=L.makeGroundShadows({points:Ce.map(e=>({x:e.x,z:e.z,r:1.1*e.r})),heightAt:v.height,sunDir:H,strength:.6,color:"#2a3162",size:1.1,stretch:2.4,lift:.14,cell:8});Vt.object.name="stone shade",S.add(Vt.object),await b.yield();const Ho=L.makeGroundShadows({points:le.filter(e=>K(e.x-u.AX,e.z-u.AZ)>216).map(e=>({x:e.x,z:e.z,r:4.2*e.s})),heightAt:v.height,sunDir:H,strength:.62,color:"#2a3162",size:1.1,stretch:2.4,lift:.18});S.add(Ho.object),await b.yield();const Xt={cover:.6,crest:-10};let _t=!1;const Ut=(e,t)=>{const o=dt(e,t,0,1,te),a=Bt;_t=!1;{const s=e-u.AX,n=t-u.AZ,h=s*s+n*n;if(h<42849&&(h<42025||K(s,n)<206))return 0}if(a.s1<a.wl+12.5&&a.br<.6){if(a.s1>Xt.crest||o.rock<.5)return 0;const s=$s(e,t);return _t=s>0,Xt.cover*o.rock*s}return o.grass},qo=new w.Color,bt=[1,1,1],Go=(e,t)=>{if(Ut(e,t),!_t)return vo(e,t,0,1,qo);const o=To(e*.055,t*.055)*.9;return qo.setRGB(C(.2,.4,o/.9)*.9,C(.5,.66,o/.9)*.9,C(.07,.12,o/.9)*.9)},Oo=e=>.2126*e.r+.7152*e.g+.0722*e.b,na=Oo(G.uniforms.uSunCol.value),ra=Oo(G.uniforms.uSkyLow.value),Io=(e,t,o)=>{const a=it(e,t,o);return na*Math.max((e*H.x+t*H.y+o*H.z)/a,0)+ra*V(.42*t/a+.58,0,1)},ia=Io(.22*H.x,1,.22*H.z),Jt=new Map,la=(e,t)=>{const o=Math.round(e/2.5),a=Math.round(t/2.5),s=(o+8192)*16384+a+8192;let n=Jt.get(s);if(n===void 0){const h=o*2.5,c=a*2.5,r=1.5,l=v.height(h,c),i=(v.height(h+r,c)-l)/r,p=(v.height(h,c+r)-l)/r;n=V(Io(-i+.22*H.x,1,-p+.22*H.z)/ia,.7,1.6),Jt.set(s,n)}return n},Yt=(e,t)=>{const o=Ue(e,v.height(e,t)+.4,t),a=o>0?la(e,t):1;return bt[0]=C(re[0],1,o)*a,bt[1]=C(re[1],1,o)*a,bt[2]=C(re[2],1,o)*a,Vt.shadeAt(e,t,Ho.shadeAt(e,t,bt))},Zo=[I[0],I[0],I[1],I[1],...Object.keys(lt)].map(e=>lt[e]),$e=await L.makeGrassAsync({rng:ks,path:j,uRange:[0,Math.min(1,(Et+30)/ye)],count:Math.round(12800*(.6+.4*Ft)),radius:34,heightAt:v.height,density:(e,t)=>{const o=Ut(e,t);return o>0?o*C(.34,1,Eo(e,t)):0},groundColor:Go,shade:Yt,wind:Gt,map:me.map,tint:.1,materialOptions:{wrap:.65,ambient:1.3,leafAmbient:1.3},flowers:ht?.07:.04,flowerColors:Zo,height:[.4,.8],width:[.8,1.3],chunks:4,fade:[72,104]},b.yield);S.add($e.object),await b.yield();const ca=[0,1].map(()=>L.flowerGeometry({rng:lo,petalMask:!0,cards:1,width:1,height:1,root:[1.25,1.25,1.25],tip:[2.1,1.95,1.5]}));await b.yield();const ha=2*Math.round((ht?3600:3400)*1.07/2),Vo=[];for(let e=0;e<2;e++){const t=L.makeFlowers({rng:lo,path:j,uRange:[0,Math.min(1,(Et+30)/ye)],count:ha/2,radius:30,corridor:1.5,heightAt:v.height,density:(o,a)=>{const s=Ut(o,a);return s>0?s*C(.22,1,Math.max(Eo(o,a),ea(o,a))):0},colors:Zo,groundColor:Go,shade:Yt,wind:Gt,map:me.map,chunks:3,variants:[ca[e]],scale:[.26,.44]});S.add(t.object),Vo.push(t),await b.yield()}const pa={update:(e,t,o)=>{for(const a of Vo)a.update(e,t,o)}},Qe=[];{const e=[];for(let t=Math.floor((_[2]-60)/26);t<=Math.ceil(_[3]/26);t++)for(let o=Math.floor(_[0]/26);o<=Math.ceil(_[1]/26);o++){const a=se(q(o,91.3),q(t,91.3));if(a>=.6)continue;const s=(o+.5+(se(q(o,3.1),q(t,3.1))-.5)*.55)*26,n=(t+.5+(se(q(o,47.7),q(t,47.7))-.5)*.55)*26,h=ie(s,n);h<120&&e.push({x:s,z:n,R:2+4*Se(R(a*R(7.3))),d:h,h:a})}e.sort((t,o)=>t.d-o.d);for(const t of e){const o=Math.round(t.R*2*Math.PI*2.2);for(let a=0;a<o&&Qe.length<400;a++){const s=Ne.range(0,Math.PI*2),n=Ne.range(.15,1.2),h=Ne.range(.865,1.11),c=Ne.range(0,Math.PI*2),r=Math.sin(s),l=Math.cos(s);let i=0,p=t.R*1.5;const f=x=>x-t.R*(.8+.4*B((t.x+r*x)*.35+t.h*20,(t.z+l*x)*.35+t.h*20));if(f(p)<=0)continue;for(let x=0;x<9;x++){const k=(i+p)/2;f(k)<0?i=k:p=k}const g=t.x+r*(p+n),d=t.z+l*(p+n);if(Po(g,d)<.1||!Qs(g,d))continue;const A=dt(g,d,0,1,te),F=Bt;if(!(F.s1<F.wl+12.5&&F.br<.6)||F.s1>Xt.crest||A.rock<.5)continue;const m=v.height(g,d),y=.99*h;Math.min(j.distanceTo(g,m+y,d),j.distanceTo(g,m+.5*y,d))<2+.3||Qe.push({x:g,y:m,z:d,s:h,rot:c,d:0,u:0,v:0})}if(Qe.length>=400)break;await b.yield()}}const et=Qe.length?L.makeScatter({rng:Ne,points:Qe,variants:[L.grassTuftGeometry({rng:Ne,cards:2,width:.55,height:.9,root:[.15,.33,.09],tip:[.4,.5,.17]})],material:$e.material,tint:.14,hue:.03,sink:.02,tilt:.1,stretch:.2,shade:Yt}):null;et&&(et.object.name="rushes",S.add(et.object)),Jt.clear();const $t=jt.waterLight(Nt),Xo=[[u.FALLX-7,u.VALE+.05,u.FALLZ+.5]];{let e=0;for(let t=0;t<Le.length;t++)t>0&&(e+=K(Le[t][0]-Le[t-1][0],Le[t][1]-Le[t-1][1])),Xo.push([Le[t][0],v.waterAt(e)+.05,Le[t][1]])}const Qt=jt.makeRiver({rng:Tt,light:$t,points:Xo,width:e=>2*v.riverHalf(e*1180)+3,across:9,speed:2.6,deep:"#3f9c98",shallow:"#d6f2ee",foam:.5,bankFoam:.5,ripple:1,opacity:.2,bankFade:2.2,chop:.08});S.add(Qt.object);const _o=jt.makeWaterfall({rng:Tt,light:$t,top:[u.FALLX,u.FALLTOP,u.FALLZ],height:u.FALLTOP-u.FALLFOOT,width:u.FALLW,dir:[-1,0,0],launch:2.6,density:1.9,lipLength:7,tint:Qt.uniforms?.uDeep?.value??"#4fb3ad",mistCount:Math.round(180*(.6+.4*Ft)),mistOpacity:.24,mistColor:"#fff6e2",rainbow:.5,poolSize:1.6});S.add(_o.object);{const e=u.FALLTOP-u.FALLFOOT,t=2.6,o=28,a=[],s=[],n=[],h=[],c=p=>{const f=p*e,g=Math.sqrt(2*f/9.81);return[u.FALLX-(1.16*t*g+.9),u.FALLTOP-f,u.FALLZ,g]};for(let p=0;p<=o;p++){const f=Math.pow(p/o,1.35),g=c(f),d=c(Math.min(1,f+.01)),A=c(Math.max(0,f-.01)),F=d[0]-A[0],m=d[1]-A[1],y=K(F,m)||1,x=.5*(.32*t*g[3]+1.1)+.9;for(const k of[-1,1])a.push(g[0],g[1],g[2]),s.push(F/y,m/y,0,x),n.push(k,g[3]);if(p<o){const k=p*2;h.push(k,k+2,k+1,k+1,k+2,k+3)}}const r=new w.BufferGeometry;r.setAttribute("position",new w.Float32BufferAttribute(a,3)),r.setAttribute("aArc",new w.Float32BufferAttribute(s,4)),r.setAttribute("uv",new w.Float32BufferAttribute(n,2)),r.setIndex(h),r.computeBoundingSphere(),r.boundingSphere.radius+=6;const l=new w.ShaderMaterial({name:"FallBody",uniforms:{...G.uniforms,uFallY:{value:new w.Vector2(u.FALLTOP,e)},uPhFall:{value:Ts.range(0,97)}},vertexShader:qa,fragmentShader:Ga,transparent:!0,depthWrite:!1,side:w.DoubleSide}),i=new w.Mesh(r,l);i.name="fall spray body",i.renderOrder=2,S.add(i)}const Uo=jt.makeLake({rng:Tt,light:$t,level:ae.y,center:[ae.x,ae.z],radius:ae.r+14,segments:26,depthAt:(e,t)=>ae.y-v.height(e,t),deep:"#2f6f8c",shallow:"#9fdcd4",ripple:.7,shoreFoam:.2,band:!1});S.add(Uo.object),await b.yield();const xt=G.uniforms.uWind.value.x,yt=G.uniforms.uWind.value.y,da=new w.Vector3(xt*2.6,-.7,yt*2.6),He=ht?96:64,fa=[["#fbf3f0","#ffffff","#f7e6ea"],["#f6c9d6","#fbdfe6","#f3b3c8"]].map(e=>e.map(t=>new w.Color(t))),tt=le.filter(e=>e.v<=1),Jo=new Float32Array(tt.length*He*4),Yo=new Float32Array(tt.length*He*4),$o=new Float32Array(tt.length*He*3);tt.forEach((e,t)=>{const o=(e.v===0?9:8.5)*e.s;for(let a=0;a<He;a++){const s=t*He+a,n=pe.range(0,Math.PI*2),h=Math.sqrt(pe())*.34*o,c=pe.range(.45,.92)*o,r=fa[e.v][pe.int(0,2)];Jo.set([e.x+Math.cos(n)*h,e.y+c,e.z+Math.sin(n)*h,c],s*4),Yo.set([pe(),pe.range(.8,1.25),pe(),pe.range(.12,.24)],s*4),$o.set([r.r,r.g,r.b],s*3)}});const qe=new w.InstancedBufferGeometry;qe.setAttribute("position",new w.Float32BufferAttribute([-1.2,-.7,0,1.2,-.7,0,0,1.7,0],3)),qe.setAttribute("iA",new w.InstancedBufferAttribute(Jo,4)),qe.setAttribute("iB",new w.InstancedBufferAttribute(Yo,4)),qe.setAttribute("iC",new w.InstancedBufferAttribute($o,3)),qe.instanceCount=tt.length*He;const kt=new w.Mesh(qe,new w.ShaderMaterial({name:"PeakPetals",vertexShader:Ha,fragmentShader:Oa,uniforms:{...G.uniforms,uVel:{value:da}},transparent:!0,depthWrite:!1,side:w.DoubleSide}));kt.name="petals",kt.frustumCulled=!1,kt.renderOrder=3;const Qo=(e,t,o)=>fs.makeParticles({rng:Ms,preset:"pollen",count:o,box:t,follow:!1,center:e,colors:["#ffffff","#fff6e0","#f2f6ff"],velocity:[xt*2,-.12,yt*2],size:[.03,.07]}),es=Qo([nt.x,v.height(nt.x,nt.z-60)+14,nt.z-60],[70,24,150],560),ts=Qo([-246,u.VALE+20,-338],[170,36,170],760),os=fs.makeParticles({rng:As,preset:"snow",count:Math.round(2400*(.6+.4*Ft)),box:[260,90,260],follow:!1,center:[u.AX+xt*40,330,u.AZ+yt*40],colors:["#ffffff","#eef2fb","#dfe6f6"],velocity:[xt*8,-.25,yt*8],size:[.1,.26]});S.add(kt,es.object,ts.object,os.object),await b.yield();const eo=[],At=[];for(const e of O.body.sites){const t=e[0]+u.AX,o=e[1],a=e[2]+u.AZ,s=1-D(100,124,o),n=be(),h=be.range(.8,1.25),c=be.range(0,6.28),r=be.int(0,1),l=Te(),i=Te.range(1.5,2.6),p=Te.range(0,6.28),f=Te.int(0,2);if(Math.abs(a-u.FALLZ)<u.FALLW/2+6&&t<u.FALLX+30&&o<u.FALLTOP+12)continue;const g=j.distanceTo(t,o,a);if(s>0&&n<.05&&g>16&&!At.some(d=>it(d.x-t,d.y-o,d.z-a)<10)){At.push({x:t,y:o,z:a,s:h,rot:c,d:60,u:0,v:r});continue}g<8||l>=C(.5,.9,s)||eo.push({x:t,y:o,z:a,s:i,rot:p,d:g,u:0,v:f})}const zt=eo.length?L.makeScatter({rng:Te,points:eo,variants:[I[0],I[1],I[0]].map((e,t)=>L.flowerGeometry({rng:Te,color:lt[e],cards:3,width:1.5,height:.6+.15*t,root:"#4f8f3c",tip:"#8fca5a"})),material:me,tint:.1,hue:.03,sink:.1,tilt:.2}):null;zt&&S.add(zt.object);const ua=[L.birchGeometry({rng:be,height:4.6,detail:0,...wt}),L.cherryGeometry({rng:be,height:3.8,detail:0,...gt})],St=At.length?L.makeScatter({rng:be,points:At,variants:ua,material:me,tint:.12,hue:.04,sink:.04,tilt:.32}):null;St&&S.add(St.object);const Mt=[],Ge=Pe.spur;for(const e of O.body.sites){const t=e[1],o=t>Ge.y[0]&&t<Ge.y[0]+9?0:t>Ge.y[1]&&t<Ge.y[1]+9?1:-1;if(o<0||Math.abs((Math.atan2(e[0],-e[2])/gs-Ge.b+540)%360-180)>Ge.w*1.1)continue;const a=e[0]+u.AX,s=e[2]+u.AZ;Mt.filter(n=>n.bench===o).length>=5||!xe.chance(.5)||Mt.some(n=>it(n.x-a,n.y-t,n.z-s)<7)||Mt.push({x:a,y:t,z:s,bench:o,s:xe.range(.9,1.4),rot:xe.range(0,6.28),d:60,u:0,v:xe.int(0,1)})}const ss=[L.cherryGeometry({rng:xe,height:7.6,detail:0,...Ot}),L.cherryGeometry({rng:xe,height:7,detail:0,...gt})],as=(e,t)=>{const o=(t.userData.height||8)*e.s,a=(t.userData.radius||3)*e.s;return Math.min(j.distanceTo(e.x,e.y,e.z),j.distanceTo(e.x,e.y+.5*o,e.z),j.distanceTo(e.x,e.y+o,e.z))-a},to=Mt.filter(e=>as(e,ss[e.v])>=20),Oe=to.length?L.makeScatter({rng:xe,points:to,variants:ss,material:me,tint:.12,hue:.04,sink:.04,tilt:.32}):null;Oe&&S.add(Oe.object);const oo=[];for(const e of O.body.sites){const t=_e(),o=_e.range(6,10),a=_e.range(0,6.28),s=_e.int(0,1);e[1]>=124&&e[1]<=185&&oo.push({x:e[0]+u.AX,y:e[1],z:e[2]+u.AZ,num:t,s:o/(s===0?9:8.5),rot:a,d:60,u:0,v:s})}oo.sort((e,t)=>e.num-t.num);const ot=[],ns=[It[0],It[1]];for(const e of oo){if(ot.length>=10)break;Math.abs(e.z-u.FALLZ)<u.FALLW/2+6&&e.x<u.FALLX+30&&e.y<u.FALLTOP+12||ot.some(t=>it(t.x-e.x,t.y-e.y,t.z-e.z)<12)||to.some(t=>it(t.x-e.x,t.y-e.y,t.z-e.z)<12)||as(e,ns[e.v])<20||ot.push(e)}const st=ot.length?L.makeScatter({rng:_e,points:ot,variants:ns,material:me,tint:.12,hue:.04,sink:.04,tilt:.32}):null;Oe&&(Oe.object.name="bench trees"),st&&(st.object.name="face trees",S.add(st.object)),await b.yield();const so=ka(b,{hour:E,rng:zs,density:Rs,light:G}),rs=Aa(b,{hour:E,rng:Ss,veil:O.clouds.veil,clouds:G.uniforms.uCloudP.value});S.add(so.object,rs.object),await b.yield();const ma=Ta(Pt,{path:j,land:v,form:Pe,shapes:Ct,hour:E}).map(e=>({at:e.at,from:e.from/ye,to:e.to/ye,weight:e.weight,fade:e.fade})),ga=Ra(Pt),is=e=>{const t=e.geometry;return(t.index?t.index.count:t.attributes.position.count)/3*(e.isInstancedMesh?e.count:t.isInstancedBufferGeometry&&isFinite(t.instanceCount)?t.instanceCount:1)};let ls=0,ao=0;S.traverse(e=>{if(e.isMesh){for(let t=e;t;t=t.parent)if(!t.visible)return;ls+=is(e)}}),$e.object.traverse(e=>{e.isInstancedMesh&&(ao+=is(e))});const cs=ls-425e3;if(cs>0&&ao>0){const e=Math.max(.4,1-cs/ao);$e.object.traverse(t=>{t.isInstancedMesh&&(t.count=Math.floor(t.count*e))})}const no=new w.Vector3;return{scene:S,path:j,duration:50,pace:ga,camera:{fov:62,near:.3,far:5e3,lookAhead:24,nearThrough:.3,lookArc:!0,sway:.8,bank:.7},pois:ma,portal:{shape:"circle",radius:Pa.r,color:"#cfe2ff",glow:1,revealDistance:200,blendDistance:25,tilt:!0},post:{exposure:1.12,bloom:{strength:.35,radius:.6,threshold:.9},grade:{saturation:1.04,contrast:1.07,tint:"#fff6e8",shadowTint:"#070a1e",vignette:.28,grain:.02,aberration:0}},update(e,t,o,a){no.setFromMatrixPosition(o.matrixWorld),so.setEye(no.y),so.update(e,t),ho.update(e,t,o),O.update(e,t,o),rs.update(no),Wo.update(e,t,o),Co.update(e,t,o),$e.update(e,t,o),pa.update(e,t,o),Qt.update(e,t,o),_o.update(e,t,o),Uo.update(e,t,o),es.update(e,t,o),ts.update(e,t,o),os.update(e,t,o),zt&&zt.update(e,t,o),St&&St.update(e,t,o),Oe&&Oe.update(e,t,o),st&&st.update(e,t,o),et&&et.update(e,t,o)},dispose(){O.dispose?.(),Nt.dispose?.()}}}};export{Ua as default};
