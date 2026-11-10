import*as e from"three";const L=Math.PI/180,Le=.6,Oe=.015,be=2,xe=192,qe=60,Fe=32,Ee=8,Be=18,We=4.5,x=t=>{const a=new e.Color(t);return new e.Vector3(a.r,a.g,a.b)},se=`
  float h13(vec3 p){ p=fract(p*.1031); p+=dot(p,p.zyx+31.32); return fract((p.x+p.y)*p.z); }
  vec3 h33(vec3 p){ p=fract(p*vec3(.1031,.1030,.0973)); p+=dot(p,p.yxz+33.33); return fract((p.xxy+p.yxx)*p.zyx); }
  float vn3(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*f*(f*(f*6.-15.)+10.);
    return mix(mix(mix(h13(i),h13(i+vec3(1,0,0)),f.x),mix(h13(i+vec3(0,1,0)),h13(i+vec3(1,1,0)),f.x),f.y),
               mix(mix(h13(i+vec3(0,0,1)),h13(i+vec3(1,0,1)),f.x),mix(h13(i+vec3(0,1,1)),h13(i+vec3(1,1,1)),f.x),f.y),f.z); }
`,fe=`
  float ballMiss(vec3 ro, vec3 rd, float R){
    float b=dot(ro,rd), c=dot(ro,ro)-R*R;
    if(c<=0.) return 0.;
    if(b>=0.) return 1.;
    float d2=max(dot(ro,ro)-b*b,0.);
    return smoothstep(R-.04, R+.04, sqrt(d2));
  }
  // the same for a thing at a known place p (from the ball's centre): cut only if the ball stands before it
  float ballBefore(vec3 ro, vec3 p, float R){
    vec3 d=p-ro; float L=max(length(d),1e-4); vec3 rd=d/L;
    float b=dot(ro,rd), c=dot(ro,ro)-R*R, h=b*b-c;
    if(c<=0.) return 0.;
    if(h<=0. || b>=0.) return 1.;
    return (-b-sqrt(h))<L ? 0. : 1.;
  }
`,_e=1.5,Ne=.5,ze=`varying vec3 vP; flat varying float vDepthB;
  void main(){ vP=position; vDepthB=-.5*projectionMatrix[3][2]; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,Se=`
  flat varying float vDepthB;
  // ro: the eye from the ball's centre; rd: the sight line; opening: the opening's radius in the plane z = 0
  float skinDepth(vec3 ro, vec3 rd, float opening){
    float dz=abs(rd.z)>1e-5 ? rd.z : 1e-5, t=-ro.z/dz, slope=min(fwidth(t),1e6);
    vec2 q=ro.xy+rd.xy*t;
    float behind=step(0.,t)*(1.-smoothstep(1.,2.,(length(q)-opening)/max(slope,1e-3)));
    float zv=1./max(gl_FragCoord.w,1e-6), lead=min(${_e.toFixed(1)}*slope, ${Ne.toFixed(2)}*zv)*behind;
    return gl_FragCoord.z-vDepthB*(1./max(zv-lead,1e-3)-1./zv);
  }
`,Me=`
  float airLaw(float nz){ float deg=degrees(asin(clamp(nz,-1.,1.))); return 1.-smoothstep(20.,26.,deg); }
  // THE THREAD (the air line as the far eye sees it): where the air's edge stands at the line of dusk or within a few
  // degrees of it, the star's light comes round the world through the whole depth of the air and the edge burns as
  // one thin thread. By the facing of the air's edge to the star and by nothing else: whole to THREAD_IN degrees
  // into the night, nothing from THREAD_OUT degrees. For an eye on the shadow's axis the ball's outline stands
  // asin(radius / distance) into the night: so the thread is whole from afar, thins as we come in and is gone where
  // the outline stands THREAD_OUT degrees into the night; from there in, the air's line is airLaw's alone.
  float airThread(float nz){ float deg=degrees(asin(clamp(nz,-1.,1.))); return 1.-smoothstep(${Ee.toFixed(1)},${Be.toFixed(1)},deg); }
`,De=`
  precision highp float;
  #define NW 6
  uniform float uTime, uSea, uCloudAmt, uFleck, uStarAng, uRadius, uOpening;
  uniform mat3 uSpin, uCloud;
  uniform vec3 uAxis, uLandOff, uCloudOff, uCentre, uBelt, uBands;
  uniform vec4 uWhorl[NW];
  uniform vec2 uWhorlRot[NW];
  uniform vec3 cDeep, cShallow, cLand, cDry, cIce, cCloud, cShade, cAir;
  varying vec3 vP;
  ${se}${Se}
  // each finer layer of the noise is turned against the one before, so that no grid of it shows from near
  const mat3 TURN=mat3(0.,.8,.6, -.8,.36,-.48, -.6,-.48,.64);
  float fbmL(vec3 p, float fw, float lac){ float a=.5, s=0., f=1.;
    for(int i=0;i<7;i++){ s+=a*(vn3(p)-.5)*(1.-smoothstep(.3,.8,fw*f)); p=TURN*p*lac+3.7; f*=lac; a*=.52; } return s; }
  float fbmC(vec3 p, float fw){ float a=.5, s=0., f=1.;
    for(int i=0;i<6;i++){ s+=a*vn3(p)*(1.-smoothstep(.3,.8,fw*f)); p=TURN*p*2.17+5.1; f*=2.17; a*=.5; } return s; }
  // the cloud's own noise: its two broadest layers on the banded place p (drawn out along the lines of latitude), its
  // four finer layers on the round place q, so that the bands are bands and nothing under about 5 m is drawn out
  float fbmW(vec3 p, vec3 q, float fw){ float a=.5, s=0., f=1.;
    for(int i=0;i<2;i++){ s+=a*vn3(p)*(1.-smoothstep(.3,.8,fw*f)); p=TURN*p*2.17+5.1; f*=2.17; a*=.5; }
    q=q*(f*.9)+p*.12+9.3;
    for(int i=0;i<4;i++){ s+=a*vn3(q)*(1.-smoothstep(.3,.8,fw*f)); q=TURN*q*2.17+5.1; f*=2.17; a*=.5; } return s; }
  vec3 turn(vec3 p, vec3 a, float th){ float c=cos(th), s=sin(th); return p*c+cross(a,p)*s+a*dot(a,p)*(1.-c); }
  // the height of the ground over the sea (0 is the shore)
  vec3 groundWarp(vec3 s){ return vec3(vn3(s*2.1+uLandOff.yzx), vn3(s*2.1+uLandOff.zxy+7.3), vn3(s*2.1+uLandOff+13.1))-.5; }
  float ground(vec3 s, vec3 w, float fw){ return fbmL(s*1.45+uLandOff+w*.55, fw*1.45, 2.07)-uSea; }
  // the cloud's finer forms: heaps with furrows between them, from about 3 m across down to a third of a metre, on the
  // cloud's own frame (so they drift with it) and slowly working; each layer fades where it is finer than a pixel
  float billow(vec3 sc, float fw){ vec3 p=TURN*(sc*8.5)+uCloudOff.zxy+vec3(0.,uTime*.006,0.); float a=.5, s=0., f=8.5;
    for(int i=0;i<4;i++){ s+=a*(1.-abs(2.*vn3(p)-1.))*(1.-smoothstep(.3,.8,fw*f)); p=TURN*p*2.13+4.3; f*=2.13; a*=.55; } return s; }
  // the weather: 0 clear sky to 1 thick cloud, at the place sc of the cloud's own frame
  float weather(vec3 sc, float fw){
    float lat=dot(sc,uAxis);
    // bands that run round the axis of spin: each band of latitude drifts at its own rate (one of them backward)
    float bi=lat*5.+uBands.x, b0=floor(bi), bf=smoothstep(.3,.7,fract(bi));
    float r0=h13(vec3(b0,3.1,uBands.y))-.3, r1=h13(vec3(b0+1.,3.1,uBands.y))-.3;
    vec3 q=turn(sc, uAxis, uTime*.0021*mix(r0,r1,bf)*6.);
    vec3 st=q+uAxis*dot(q,uAxis)*1.5;
    vec3 w1=vec3(vn3(st*2.3+uCloudOff.zxy), vn3(st*2.3+uCloudOff+5.2), vn3(st*2.3+uCloudOff.yzx+9.1))-.5;
    vec3 p=st*2.4+uCloudOff+w1*1.25;
    vec3 w2=vec3(vn3(p*2.9+3.3), vn3(p*2.9+11.7), vn3(p*2.9+17.2))-.5;
    float c=fbmW(p+w2*.5+vec3(0.,0.,uTime*.004), q*2.4+uCloudOff.yzx+w1*.9+w2*.35+vec3(0.,uTime*.004,0.), fw*2.4);
    float amt=mix(h13(vec3(b0,9.7,uBands.y)), h13(vec3(b0+1.,9.7,uBands.y)), bf);
    c+= (amt-.5)*.34*uBands.z + uCloudAmt;
    float bl=(lat-uBelt.x)/max(uBelt.y,1e-3);
    c+= uBelt.z*exp(-bl*bl)*(.25+.2*vn3(st*5.+uCloudOff));
    // small flecked cloud between the bands, forming and thinning over tens of seconds
    float fl=fbmC(TURN*(q*29.+w1*2.5)+uCloudOff.yzx+vec3(uTime*.011), fw*29.);
    c+= uFleck*smoothstep(.5,.7,fl)*(1.-smoothstep(.25,.7,fw*60.))*.16;
    // the whorls of storm: a spiral about a clear eye, turning about the eye
    for(int i=0;i<NW;i++){
      vec4 wh=uWhorl[i]; if(wh.w<=0.) continue;
      float d=acos(clamp(dot(sc,wh.xyz),-1.,1.))/wh.w; if(d>=1.3) continue;
      vec3 e1=normalize(cross(wh.xyz,uAxis)+vec3(1e-5,0.,0.)), e2=cross(wh.xyz,e1);
      float x=dot(sc,e1), y=dot(sc,e2), ph=atan(y,x+sign(x+1e-9)*1e-6)*uWhorlRot[i].y;
      float n=vn3(sc*23.+wh.xyz*5.)-.5, dw=(d-.2)/.085;
      float arm=sin(ph*2.-7.5*log(max(d,.03))+uWhorlRot[i].x+n*1.6);
      float env=1.-smoothstep(.5,1.05,d), eye=smoothstep(.07,.15,d), wall=exp(-dw*dw);
      float sp=env*eye*max(smoothstep(-.35,.45,arm)*(.55+.45*(1.-d)), wall*1.1);
      float moat=smoothstep(.45,.9,d)*(1.-smoothstep(1.,1.3,d));
      c=mix(c, .22+.62*sp, (1.-smoothstep(.95,1.3,d))*(1.-.35*moat));
    }
    return c;
  }
`,He=`
  void main(){
    vec3 n=normalize(vP);
    vec3 v=normalize(cameraPosition-uCentre-vP);
    float ndv=clamp(dot(n,v),0.,1.);
    float fw=length(fwidth(n));
    // the one light: the star, its rays along +Z. E is its height over the horizon at this place.
    float sinE=clamp(-n.z,-1.,1.), E=asin(sinE), eDeg=degrees(E);
    // THE STAR'S LIGHT ON THE GROUND, by the ground's own facing to the star and by nothing else: full where the star
    // stands high, falling as the ground turns from it (a ball, never a plate); then a band of warm low light (pale
    // gold, then gold, where the star stands under about 30 degrees), the dusk (rose, under about 6) and night at
    // the line itself. Every term is smooth in E: the day falls to the night through a soft terminator, no line.
    float sE=clamp(sinE,0.,1.);
    float I=sE*(.42+.58*smoothstep(0.,24.,eDeg));
    vec3 lightC=mix(vec3(1.,.30,.24), vec3(1.,.60,.30), smoothstep(.5,6.,eDeg));
    lightC=mix(lightC, vec3(1.,.86,.64), smoothstep(5.,14.,eDeg));
    lightC=mix(lightC, vec3(1.), smoothstep(13.,34.,eDeg));
    vec3 ts=vec3(0.,0.,-1.)+n*n.z; float tl=length(ts); ts/=max(tl,1e-4);
    float tanZ=clamp(tl/max(sinE,.02),.5,4.);
    // the ground: seas, lands, ice round the poles of spin
    vec3 s=uSpin*n;
    vec3 gw=groundWarp(s);
    float h=ground(s,gw,fw), stp=max(.004,fw);
    float slope=(ground(uSpin*normalize(n+ts*stp),gw,fw)-h)/stp;
    float relief=clamp(1.-slope*1.1,.5,1.45);
    float coast=max(fw*1.2,.0012);
    float land=smoothstep(-coast,coast,h);
    float shal=smoothstep(-.085,-.003,h);
    float m1=vn3(s*5.3+uLandOff.zxy);
    // the ground's fine mottle: two layers on turned frames (no squares of the noise's own lattice seen from low over it)
    float m2=(.6*vn3(TURN*(s*41.)+uLandOff)+.4*mix(.5, vn3(TURN*TURN*(s*97.)+uLandOff.yzx), 1.-smoothstep(.25,.7,fw*97.)))*(1.-smoothstep(.25,.7,fw*41.));
    // the sea: darker over the deeps, and paler drifts in it that bend with the coasts' own warp
    float drift=vn3(s*17.+gw*5.+uLandOff.yzx);
    vec3 sea=mix(cDeep, cShallow, shal*shal)*(.72+.56*m1)*mix(.66,1.,smoothstep(-.3,-.04,h));
    sea=mix(sea, cShallow*vec3(.9,1.12,1.), .3*smoothstep(.56,.84,drift)*(1.-shal));
    float dry=smoothstep(.3,.75, m1*.7+vn3(s*13.+uLandOff.yzx)*.3+h*1.4);
    vec3 gcol=mix(cLand, cDry, dry);
    float range=smoothstep(.06,.15,h+.035*(m2-.5));
    gcol*=mix(1.,.8,range)*(.82+.36*m2);
    gcol*=mix(1., relief, land);
    float lat=dot(n,uAxis);
    float ice=smoothstep(.905,.935, abs(lat)+.05*(m1-.5)+.025*(m2-.5));
    vec3 surf=mix(sea, gcol, land);
    surf=mix(surf, cIce*(.74+.2*relief), ice);
    // the weather over it: cloud with a lit side and a shaded side, and its shadow on sea and land
    vec3 sc=uCloud*n;
    // its finer forms ride on it (billow): they fret its edges into wisps and heap its top, and every heap has a side
    // toward the star and a side in its own blue grey shade (the same step toward the star that throws the shadow)
    vec3 sc2=uCloud*normalize(n+ts*(.0125*tanZ));
    float bw=billow(sc,fw), c=weather(sc,fw)+(bw-.5)*.2;
    float c2=weather(sc2,fw)+(billow(sc2,fw)-.5)*.2;
    float a=smoothstep(.45,.68,c), aS=smoothstep(.45,.68,c2);
    float body=smoothstep(.5,.9,c);
    float shade=smoothstep(-.02,.11,c2-c);
    vec3 cloudC=mix(cCloud*(.7+.2*body+.14*bw), cShade*.52, shade*.92);
    // the cloud's shadow on sea and land: by the cloud's own thickness (a thin wisp throws next to none)
    surf*=mix(vec3(1.), cShade*.62, smoothstep(.52,.84,c2)*.85);
    vec3 col=mix(surf, cloudC, a);
    col*=lightC*I*1.3;
    // the star mirrored in the sea: a broad soft patch that glitters, broken by coasts, ice and cloud
    float t5=uTime*5.;
    vec3 wv=vec3(vn3(s*310.+vec3(0.,t5*.07,0.)), vn3(s*310.+vec3(9.1,0.,t5*.07)), vn3(s*310.+vec3(t5*.07,4.7,0.)))-.5;
    vec3 wn=normalize(n+wv*.09*(1.-smoothstep(.2,.7,fw*310.)));
    float ga=acos(clamp(dot(reflect(-v,wn),vec3(0.,0.,-1.)),-1.,1.));
    // a soft sheen, no disc: brightest where the star mirrors toward the eye, with a broad faint skirt round it
    float gq=ga/uStarAng, gl=sqrt(.72*exp(-gq*gq*1.7)+.1*exp(-gq*gq*.4));
    float spk=vn3(vec3(s.xy*760.,s.z*760.+t5));
    float glit=mix(.8, .25+4.5*spk*spk*spk*spk, 1.-smoothstep(.3,.9,fw*760.));
    col+=vec3(1.,.93,.78)*gl*gl*glit*1.25*(1.-land)*(1.-ice)*(1.-a)*(1.-.75*aS)*smoothstep(0.,6.,eDeg);
    // the air: paler and bluer toward the edge, and the thin bright line at the very edge
    // (the air is lit as the ground under it is: it glows on the star's side of the ball, from about 7 degrees of the
    // star's height, and by the line of dusk its line is the night limb's own, no brighter)
    float rim=1.-ndv, airI=smoothstep(.12,.6,sE);
    col=mix(col, cAir*(.19+.86*airI), rim*rim*rim*.7);
    col+=cAir*.6*(1.+1.2*airI)*pow(rim,7.);
    // the last of the dusk is the night's own black, so that no step stands where the night limb begins
    col-=vec3(.072)*(1.-smoothstep(0.,2.5,eDeg));
    gl_FragColor=vec4(col,1.);
    gl_FragDepth=skinDepth(cameraPosition-uCentre, -v, uOpening);
  }
`,Ge=`
  precision highp float;
  uniform vec3 uCentre, cAir; uniform float uOpening, uTime, uShim;
  varying vec3 vP;
  ${Me}${Se}
  void main(){
    vec3 n=normalize(vP), ro=cameraPosition-uCentre, rd=normalize(vP-ro);
    float r=1.;
    if(ro.z>0. && rd.z<-1e-4){ vec2 q=ro.xy+rd.xy*(-ro.z/rd.z); r=clamp(length(q)/uOpening,0.,1.); }
    float r2=r*r;
    vec3 col=-vec3(.12)*(1.-.4*r2*r2*r2);
    if(gl_FrontFacing){
      float rim=1.-clamp(dot(n,-rd),0.,1.), rim2=rim*rim;
      // the air line's shimmer: the same law and the same seeded phase as the air shell's (one line of air, one shimmer)
      float shim=1.+.05*sin(atan(n.y,n.x+1e-6)*9.+uTime*.7+uShim)*sin(uTime*.31+uShim*1.7+n.x*4.);
      // where the eye looks toward the star through this air, the light of the dusk comes through it
      float fwd=pow(clamp(-rd.z,0.,1.),6.);
      col+=(cAir*.6+vec3(1.,.5,.26)*1.3*fwd)*rim2*rim2*rim2*rim*airLaw(n.z)*shim;
    }
    gl_FragColor=vec4(col,1.);
    gl_FragDepth=skinDepth(ro, rd, uOpening);
  }
`;function ve(t){const a=t.attributes.position.array;for(let s=0;s<a.length;s+=3){const i=a[s+1];a[s+1]=-a[s+2],a[s+2]=i}return t.deleteAttribute("normal"),t.deleteAttribute("uv"),t}const Re="varying vec3 vP; void main(){ vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }",Ue=`
  uniform vec3 uCentre; uniform float uRadius, uThick, uBufH;
  varying vec3 vP; varying float vTh;
  void main(){
    float dist=length(cameraPosition-uCentre);
    float px=2./(projectionMatrix[1][1]*max(uBufH,1.));
    vTh=max(uThick, 1.6*px*dist);
    vP=normalize(position)*(uRadius+vTh);
    gl_Position=projectionMatrix*modelViewMatrix*vec4(vP,1.);
  }`,$e=`
  precision highp float;
  uniform vec3 uCentre, cAir; uniform float uRadius, uThick, uTime, uShim;
  varying vec3 vP; varying float vTh;
  ${Me}
  void main(){
    vec3 ro=cameraPosition-uCentre, rd=normalize(vP-ro);
    vec3 t=ro-rd*dot(ro,rd); float d=length(t); vec3 nt=t/max(d,1e-4);
    float g=1.-clamp((d-uRadius)/max(vTh,1e-3),0.,1.);
    float outside=smoothstep(uRadius-.02,uRadius+.03,d);
    float shim=1.+.05*sin(atan(nt.y,nt.x+1e-6)*9.+uTime*.7+uShim)*sin(uTime*.31+uShim*1.7+nt.x*4.);
    // where the shell is drawn wider than it is, its light is thinned by as much: the line's whole light is by place alone
    float k=clamp(uThick/max(vTh,1e-3),0.,1.);
    // seen against the star's side of the sky the air carries the dusk's own light: rose at the ground, gold over it,
    // and bright (the ring of all this world's dusks, which the eye in the shadow sees whole)
    float fwd=pow(clamp(-rd.z,0.,1.),6.);
    vec3 dusk=mix(vec3(1.,.74,.46), vec3(1.,.44,.24), g)*2.4*fwd*g;
    // the thread: gold at the ground, blue white at the air's top, seen where the eye looks toward the star through it
    dusk+=mix(vec3(.62,.82,1.), vec3(1.,.8,.52), g)*(.35+.65*g)*${We.toFixed(1)}*fwd*airThread(nt.z);
    // on the day side the air glows toward the star, as on the ground under it (nothing of this on the night side)
    float dayGlow=1.+1.2*smoothstep(.12,.6,clamp(-nt.z,0.,1.));
    gl_FragColor=vec4((cAir*.6*g*g*dayGlow+dusk)*outside*airLaw(nt.z)*shim*k,1.);
  }`,je=`attribute vec2 aUV; varying vec2 vUV; varying vec3 vP;
  void main(){ vUV=aUV; vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,Ze=`
  precision highp float;
  uniform vec3 uCentre, cAurora; uniform float uTime, uRadius, uOffA;
  varying vec2 vUV; varying vec3 vP;
  ${se}${fe}
  void main(){
    float u=clamp(vUV.x,0.,1.), h=clamp(vUV.y,0.,1.);
    float rays=vn3(vec3(u*46.+uTime*.35, uTime*.21, 1.7+uOffA))*.65+vn3(vec3(u*131.-uTime*.5, uTime*.4, 9.2+uOffA))*.35;
    float swell=.35+.65*vn3(vec3(u*4.+uTime*.05, uTime*.11, 4.4+uOffA));
    float up=smoothstep(0.,.07,h)*(1.-h)*(1.-h)*(.55+.45*rays);
    float ends=sqrt(clamp(sin(u*3.14159),0.,1.));
    float lit=up*rays*rays*swell*ends*2.2;
    gl_FragColor=vec4(cAurora*lit*ballBefore(cameraPosition-uCentre, vP, uRadius),1.);
  }`,ke={deep:"#0B3A8C",shallow:"#1F6FB8",land:"#6F7350",dry:"#9A8660",ice:"#E8EEF5",cloud:"#F4F7FB",shade:"#7F93BA",air:"#5AB0FF",aurora:"#6FD8C8",starMid:"#FFDC92",starLimb:"#F2A23A",core:"#FFD98A"},Te=["clear","whorls","belt"];async function at(t,a={}){const s=a.radius??24,i=a.limbDeg??52,S=a.spinPeriod??300,h=s+Le,n=h-Oe,M=.7,p=new e.Vector3().fromArray(a.spinAxis??[.643,.766,0]).normalize(),l={...ke,...a.palette||{}},r=t.core.makeRng(t.core.hashSeed("blue-world:"+t.seed)),z=r.range(0,Math.PI*2),y=a.spinPhase??z,k=new e.Vector3(r.range(-40,40),r.range(-40,40),r.range(-40,40)),O=new e.Vector3(r.range(-40,40),r.range(-40,40),r.range(-40,40)),T=new e.Vector3(r.range(0,1),r.range(0,50),r.range(.7,1.1)),R=t.core.makeRng(t.core.hashSeed("blue-world-weather:"+t.seed)).pick(Te),d=Te.includes(a.weather)?a.weather:R,b=a.density??1,v=6,A=a.whorlTrack??[-14,-7],te=r.range(0,Math.PI*2),H=r.range(-.0016,.0016),G=[];for(let D=0;D<6;D++){const J=r.range(5,9);G.push({on:!0,lat:r.range(A[0]*.75+A[1]*.25,A[0]*.25+A[1]*.75)*L,lon:te+D/6*Math.PI*2+r.range(-.12,.12),rad:(d==="whorls"&&D===0?9:J)/2/n,turn:r.range(40,70),wander:H,phase:r.range(0,Math.PI*2)})}const K=r.range(0,60),Q=r.range(0,Math.PI*2),u=new e.Vector3(0,0,1).cross(p).normalize(),_=new e.Vector3().crossVectors(p,u),C=G.map(()=>new e.Vector4(1,0,0,0)),Y=G.map(()=>new e.Vector2(0,1)),U=new e.Group,f={value:new e.Vector3},o={value:0},c={value:450},m={value:x(l.air)};await t.yield();const w={uTime:o,uCentre:f,uRadius:{value:n},uOpening:{value:s},uSea:{value:.022},uStarAng:{value:Math.asin(265/900)},uCloudAmt:{value:d==="clear"?-.035:d==="belt"?-.02:0},uFleck:{value:.75*b},uSpin:{value:new e.Matrix3},uCloud:{value:new e.Matrix3},uAxis:{value:p},uLandOff:{value:k},uCloudOff:{value:O},uBands:{value:T},uBelt:{value:new e.Vector3(Math.sin((A[0]+A[1])/2*L),.075,d==="belt"?1:0)},uWhorl:{value:C},uWhorlRot:{value:Y},cDeep:{value:x(l.deep)},cShallow:{value:x(l.shallow)},cLand:{value:x(l.land)},cDry:{value:x(l.dry)},cIce:{value:x(l.ice)},cCloud:{value:x(l.cloud)},cShade:{value:x(l.shade)},cAir:m},I=new e.SphereGeometry(n,xe,qe,0,Math.PI*2,Math.PI/2-be*L,Math.PI/2+be*L);await t.yield(),ve(I),await t.yield();const ae=new e.Mesh(I,new e.ShaderMaterial({uniforms:w,vertexShader:ze,fragmentShader:De+He,fog:!1}));U.add(ae),await t.yield();const q=(90-i)*L,g=new e.SphereGeometry(h,xe,Fe,0,Math.PI*2,q,Math.PI/2-q);await t.yield(),ve(g),await t.yield();const F=new e.Mesh(g,new e.ShaderMaterial({uniforms:{uCentre:f,cAir:m,uOpening:{value:s},uTime:o,uShim:{value:Q}},vertexShader:ze,fragmentShader:Ge,side:e.DoubleSide,fog:!1}));U.add(F),await t.yield();const N=new e.SphereGeometry(1,96,36,0,Math.PI*2,50*L,130*L);await t.yield(),ve(N);const oe=new e.Mesh(N,new e.ShaderMaterial({uniforms:{uCentre:f,cAir:m,uRadius:{value:h},uThick:{value:M},uBufH:c,uTime:o,uShim:{value:Q}},vertexShader:Ue,fragmentShader:$e,side:e.BackSide,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,fog:!1}));oe.frustumCulled=!1,oe.renderOrder=2,U.add(oe),await t.yield();const $=160,P=6,j=new Float32Array(($+1)*(P+1)*3),E=new Float32Array(($+1)*(P+1)*2),X=[],B=new e.Vector3(p.y,-p.x,0).normalize(),V=Math.cos(9*L),ie=Math.sin(9*L);for(let D=0;D<=$;D++){const J=D/$*Math.PI,me=Math.cos(J)*ie,he=Math.sin(J)*ie,re=p.x*V+B.x*me,Z=p.y*V+B.y*me,de=he;for(let ee=0;ee<=P;ee++){const W=D*(P+1)+ee,ne=h+.3+1.1*(ee/P);j[W*3]=re*ne,j[W*3+1]=Z*ne,j[W*3+2]=de*ne,E[W*2]=D/$,E[W*2+1]=ee/P,D<$&&ee<P&&X.push(W,W+P+1,W+1,W+1,W+P+1,W+P+2)}}const le=new e.BufferGeometry;le.setAttribute("position",new e.BufferAttribute(j,3)),le.setAttribute("aUV",new e.BufferAttribute(E,2)),le.setIndex(X);const pe=new e.Mesh(le,new e.ShaderMaterial({uniforms:{uCentre:f,uTime:o,uRadius:{value:h},uOffA:{value:K},cAurora:{value:x(l.aurora).multiplyScalar(a.aurora??.16)}},vertexShader:je,fragmentShader:Ze,side:e.DoubleSide,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,fog:!1}));pe.renderOrder=3,U.add(pe);const ge=new e.Matrix4,ce=new e.Vector3,Ce=new e.Vector2,Ie=Math.cos(i*L)*h,Ve=Math.sin(i*L)*h;function ye(D,J,me){o.value=J,U.getWorldPosition(f.value),t.renderer&&(c.value=t.renderer.getDrawingBufferSize(Ce).y);const he=y+J/S*Math.PI*2;w.uSpin.value.setFromMatrix4(ge.makeRotationAxis(p,-he)),w.uCloud.value.setFromMatrix4(ge.makeRotationAxis(p,-he*1.05));for(let re=0;re<6;re++){const Z=G[re],de=Z.lon+Z.wander*J,ee=Math.cos(Z.lat),W=Math.sin(Z.lat);ce.copy(p).multiplyScalar(W).addScaledVector(u,ee*Math.cos(de)).addScaledVector(_,ee*Math.sin(de)),C[re].set(ce.x,ce.y,ce.z,Z.on?Z.rad:0);const ne=Z.lat>0?1:-1;Y[re].set(Z.phase-ne*(J/Z.turn)*Math.PI*2,ne)}}return ye(0,0,null),{object:U,radius:h,height:2*h,center:new e.Vector3(0,0,0),openingRadius:s,anchors:{centre:new e.Vector3(0,0,0),openingNormal:new e.Vector3(0,0,1),holeRadius:Ie,holeZ:Ve,duskTop:new e.Vector3(0,h,0),starDirection:new e.Vector3(0,0,-1)},weather:d,whorls:v,spinPhase:y,axis:p,update:ye,ground:!1}}const Ke=`
  precision highp float;
  #define NS 6
  uniform float uTime, uRate, uBallR;
  uniform vec3 uCentre, uWorld, cMid, cLimb, uOff;
  uniform vec4 uSpot[NS];
  varying vec3 vP;
  ${se}${fe}
  // x: distance to the nearest cell middle, y: how far inside the cell (0 on the lane), z: the cell's own number
  vec3 cells(vec3 p, float t){
    vec3 i=floor(p), f=fract(p); float d1=8., d2=8., id=0.;
    for(int z=-1;z<=1;z++) for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){
      vec3 g=vec3(float(x),float(y),float(z)), h=h33(i+g);
      vec3 o=g+.5+.36*sin(t*(.45+.55*h.yzx)+h*6.2832)-f;
      float d=dot(o,o);
      if(d<d1){ d2=d1; d1=d; id=h.x; } else if(d<d2){ d2=d; }
    }
    d1=sqrt(d1); return vec3(d1, sqrt(d2)-d1, id);
  }
  void main(){
    vec3 eye=cameraPosition-uCentre, v=normalize(eye-vP), n=normalize(vP);
    if(ballMiss(cameraPosition-uWorld, -v, uBallR)<.5) discard;
    float mu=clamp(dot(n,v),0.,1.);
    float fw=length(fwidth(vP));
    float t=uTime*uRate;
    // a slow swell bends every border, so that no border is a ruled line and no two cells are of one size
    vec3 q1=vP/38.+uOff.yzx, q2=vP/90.+uOff;
    vec3 bend=vec3(vn3(q1+vec3(0.,t*.05,0.)), vn3(q1.zxy+11.), vn3(q1.yzx+23.))-.5;
    bend+=1.4*(vec3(vn3(q2+vec3(t*.02,0.,0.)), vn3(q2.zxy+5.), vn3(q2.yzx+17.))-.5);
    // THE GRAIN, which boils: cells of two sizes, mixed by a slow field that drifts, each with a soft bright middle
    // that swells and sinks on its own time; between them dim soft lanes that shift as the middles wander. No lane
    // goes dark. Finer cells ride on them from near. All go to their mean where a cell is under two pixels.
    vec3 gA=cells(vP/14.+uOff+bend*2.4, t), gB=cells(vP/7.5+uOff.zxy+bend*4.2, t*1.3);
    float size=smoothstep(.32,.68,vn3(vP/55.+uOff.zxy+vec3(t*.03,0.,0.)));
    // a cell's light: a round soft middle (by the way from its own middle) that sinks into the lane (by the way to the next cell)
    float topA=(1.-smoothstep(.12,.78,gA.x))*(.45+.55*smoothstep(0.,.5,gA.y))*(.75+.5*gA.z)*(.86+.14*sin(t*1.3+gA.z*40.));
    float topB=(1.-smoothstep(.12,.78,gB.x))*(.45+.55*smoothstep(0.,.5,gB.y))*(.75+.5*gB.z)*(.86+.14*sin(t*1.7+gB.z*40.));
    float gran=mix(topA, topB, size);
    vec3 g2=cells(vP/3.6+uOff.zxy+bend*7., t*1.6);
    gran*=mix(1., .7+.4*smoothstep(0.,.5,g2.y), 1.-smoothstep(1.2,4.,fw));
    gran=mix(gran, .62, smoothstep(3.5,9.,fw));
    // the large slow pattern: bright fields and dull fields
    float big=vn3(vP/95.+uOff.yzx+vec3(0.,uTime*.012,0.))*.6+vn3(vP/43.+uOff+vec3(uTime*.02,0.,0.))*.4;
    float L=(.6+.5*gran)*(.68+.64*big);
    // a few brighter fields, slow and broad, in which the grain burns whiter; and pores: here and there one cell of
    // the larger grain whose middle is sunk and dim, as dim as a lane and no dimmer
    float field=smoothstep(.6,.8,vn3(vP/62.+uOff.zxy+vec3(0.,0.,uTime*.01)+41.));
    L+=.3*field*(.4+.6*gran);
    L*=1.-.5*step(.93,gA.z)*(1.-smoothstep(.12,.5,gA.x))*(1.-.6*size);
    // bright torches near the limb: small fields that show where the face is seen aslant
    float torch=smoothstep(.58,.82,vn3(vP/14.+uOff.zxy+31.))*(1.-smoothstep(.3,.72,mu))*smoothstep(.04,.2,mu);
    L+=.42*torch*(1.-.5*gran);
    // spots: a dark heart, and round it a border of fibres that run out from the heart; small and slow
    float heart=0., border=0., fibre=0.;
    for(int i=0;i<NS;i++){ vec4 sp=uSpot[i]; if(sp.w<=0.) continue;
      vec3 e1=normalize(cross(sp.xyz, vec3(.31,.2,.93))), e2=cross(sp.xyz,e1);
      vec2 tp=vec2(dot(n,e1),dot(n,e2)); float rr=max(length(tp),1e-5);
      float a=acos(clamp(dot(n,sp.xyz),-1.,1.))/sp.w+.22*(vn3(vP/7.+sp.xyz*9.)-.5);
      float fb=vn3(vec3(tp/rr*6.,a*1.3)+sp.xyz*13.);
      float inb=1.-smoothstep(.82,1.08,a+.2*(fb-.5));
      if(inb>border){ border=inb; fibre=fb; }
      heart=max(heart, 1.-smoothstep(.34,.5,a)); }
    L*=mix(1., .5+.42*fibre, border);
    L*=mix(1., .32, heart);
    L=clamp(L,0.,1.3);
    // limb darkening: gold at the middle, fire gold then ember red at the edge; the lanes are fire gold everywhere
    // LIMB DARKENING, by the angle of the face to the eye: white hot where we look straight down into the star, gold
    // round that, a deeper gold orange toward the edge and ember at the very edge; and its light falls the same way.
    // The lanes between the cells are a deeper orange of the same place: the grain is told by colour as by light.
    float m=pow(mu,.72);
    vec3 cHot=vec3(1.,.9,.7), cEdge=cLimb*vec3(.9,.46,.22);
    vec3 tone=mix(cEdge, cLimb, smoothstep(0.,.4,m)); tone=mix(tone, cMid, smoothstep(.35,.8,m)); tone=mix(tone, cHot, .75*smoothstep(.8,1.,m));
    vec3 lane=tone*vec3(.86,.6,.42);
    vec3 col=mix(lane, tone, smoothstep(.38,.95,L))*(.22+.86*m*sqrt(m))*(.3+.92*L);
    gl_FragColor=vec4(col,1.);
  }
`,Qe=`
  precision highp float;
  uniform float uTime, uStarR, uBallR, uLively, uPhase;
  uniform vec3 uCentre, uWorld, cMid, cLimb, uOff, uQuiet;
  varying vec3 vP;
  ${se}${fe}
  void main(){
    vec3 ro=cameraPosition-uCentre, rd=normalize(vP-ro);
    float ts=-dot(ro,rd), dist=length(ro);
    vec3 c=ro+rd*max(ts,0.); float b=length(c), x=b/uStarR;
    vec3 u=c/max(b,1e-3);
    float toward=smoothstep(0.,.35,ts/max(dist,1.));
    // the outer glow: a half at the limb, nothing at 3.2 radii: a bright inner crown and long pale streamers in fine
    // rays, which swell and turn very slowly (a full change in about 40 s)
    float xo=max(x-1.,0.);
    float st=vn3(u*4.3+uOff+vec3(1.7,uTime*.011,5.))*.55+vn3(u*9.7+uOff.zxy+vec3(uTime*.016,2.,0.))*.45;
    st=smoothstep(.25,.85,st);
    float fr=.5+.5*vn3(u*38.+uOff.yzx+vec3(0.,0.,uTime*.03))+.4*(vn3(u*97.+uOff+3.)-.5);
    float swell=.85+.15*sin(uTime*.157+uPhase+u.x*3.+u.y*2.);
    float glow=(.3*exp(-xo*7.)+.17*exp(-xo*(4.1-2.8*st))*(.3+.7*st)*mix(1.,fr,smoothstep(0.,.4,xo)))*swell;
    glow*=1.-smoothstep(2.1,3.1,x);
    // THE LONG STREAMERS: narrow rays of the same light that stand straight out from the star, each to its own
    // length, the longest for two to three of its radii, with finer rays between; they turn and swell very slowly.
    // A ray is told by where round the star's outline the sight line passes (w), so that it is straight in every picture.
    vec3 e=ro/max(dist,1.), w=c-e*dot(c,e); w/=max(length(w),1e-3);
    float reach=.5+1.5*vn3(w*2.3+uOff.zxy+vec3(0.,uTime*.006,0.));
    float r1=vn3(w*6.+uOff.yzx+vec3(uTime*.008,0.,0.)), r2=vn3(w*17.+uOff+vec3(0.,0.,uTime*.012));
    r1=r1*r1*r1*2.4; r2=r2*r2*r2*r2*2.2;
    float far=(.25*r1+.13*r2*(.3+r1))*exp(-xo/reach)*smoothstep(.02,.4,xo)*(1.-smoothstep(2.7,3.7,xo))*swell;
    // THE CROWN'S QUIET SIDE (the join sheet's law of the entry: one dark bead on the star's face, no second dark
    // body against the crown): in the sector of the crown within about 40 degrees of the direction uQuiet (the moon's
    // side of the shadow's axis) the long streamers are still, so that the moon stands there before black sky
    far*=1.-smoothstep(.72,.9,dot(w,uQuiet));
    // the fringe: a fur of short spikes that flicker and lean
    vec3 uq=u*70.+uOff+vec3(uTime*.25*uLively, sin(uTime*.4+uPhase+u.y*9.)*.6, 0.);
    float spike=vn3(uq)*.6+vn3(uq*2.7+5.)*.4;
    float len=.005+.045*spike*spike*(.7+.5*sin(uTime*(1.1+spike)*uLively+u.z*31.));
    float fringe=.9*exp(-xo/max(len,1e-3))*step(1.,x);
    vec3 pale=vec3(.84,.9,1.);      // the far streamers are pearl, as a crown of light is
    vec3 col=mix(cMid, pale, smoothstep(0.,.45,xo))*glow+mix(cMid, vec3(1.,.95,.86), smoothstep(0.,.6,xo))*far+mix(cLimb, cMid, .6*spike)*fringe;
    gl_FragColor=vec4(col*toward*step(.985,x)*ballMiss(cameraPosition-uWorld, rd, uBallR),1.);
  }
`,ue=[.975,.125],we=.14,Ye=`
  attribute vec3 aRad, aLean; attribute vec4 aInfo; attribute vec2 aRing;
  uniform float uTime;
  varying vec3 vN, vW; varying vec4 vInfo; varying vec2 vRing;
  void main(){
    vRing=aRing;
    float br=${ue[0].toFixed(3)}+${ue[1].toFixed(3)}*sin(uTime*6.2832/aInfo.z+aInfo.y*6.2832);
    float ln=${we.toFixed(2)}*sin(uTime*6.2832/aInfo.w+aInfo.y*17.);
    vec3 p=position+aRad*(br-1.)+aLean*ln;
    vInfo=aInfo; vN=normalize(mat3(modelMatrix)*normal);
    vec4 w=modelMatrix*vec4(p,1.); vW=w.xyz;
    gl_Position=projectionMatrix*viewMatrix*w;
  }`,Xe=`
  precision highp float;
  uniform float uTime, uBallR; uniform vec3 uWorld, cLimb, cCore;
  varying vec3 vN, vW; varying vec4 vInfo; varying vec2 vRing;
  ${se}${fe}
  void main(){
    vec3 v=normalize(cameraPosition-vW);
    float face=clamp(abs(dot(normalize(vN),v)),0.,1.);
    float s=clamp(vInfo.x,0.,1.), leg=abs(s-.5)*2.;
    // threads run along the loop; the fire climbs it in clumps; the legs are bright, the crown faint
    float great=step(1.5,vInfo.y), sk=s*mix(7.,12.,great);
    float thr=vn3(vec3(vRing*2.3, sk-uTime*.22+vInfo.y*9.));
    float fn=vn3(vec3(sk-uTime*.5, vInfo.y*31., uTime*.1));
    float fire=(mix(.07,.3,great)+mix(2.3,1.7,great)*fn*fn)*(.4+1.3*thr*thr);
    // knots of fire rain down both legs; on the great arch they are many, of unlike strength and spacing, each a
    // clot on one side of the ribbon and not a bar across it
    float kw=leg*mix(2.3,6.,great)+great*.4*vn3(vec3(leg*11.,vInfo.y*5.,0.))-uTime/3.+vInfo.y*7.;
    float k=fract(kw)-.5, kn=vn3(vec3(floor(kw)*7.3,vInfo.y*13.,1.));
    float knot=exp(-k*k/.006)*smoothstep(.04,.2,leg)*mix(1., 2.*kn*kn*exp(-2.5*(vRing.x-(kn*2.-1.))*(vRing.x-(kn*2.-1.))), great);
    // the great arch (its phase is told apart by a whole 2 added to it) burns along its whole length, crown and all
    float foot=(1.-smoothstep(.86,1.,leg))*.75+.25, along=mix(.12,.3,great)+mix(.88,.5,great)*pow(leg,1.8);
    float body=pow(face,1.5), core=body*body;
    vec3 col=(cLimb*body*.85+cCore*1.2*core*thr)*fire*foot*along+cCore*knot*body*body*1.6;
    // THE GREAT ARCH IS A ROPE OF FIRE, not a tube: many fine threads run along it and wander across it, bright where
    // they bunch and dark between; its edges fray into loose threads; whole lengths of it burn low and others flare
    if(great>.5){
      float ax=clamp(vRing.x,-1.,1.);
      float wob=vn3(vec3(sk*.5, vInfo.y*3., uTime*.04))-.5;
      float t1=vn3(vec3(ax*2.6+wob*3., sk*.3-uTime*.1, vInfo.y*17.));
      float t2=vn3(vec3(ax*7.+wob*6., sk*.7-uTime*.26, vInfo.y*23.));
      float t3=vn3(vec3(ax*17.-wob*9., sk*1.6-uTime*.5, vInfo.y*29.));
      float rope=smoothstep(.36,.66,t1)*(.3+.9*smoothstep(.3,.72,t2))+.5*smoothstep(.55,.8,t3)*smoothstep(.3,.6,t2);
      float fray=1.-smoothstep(.35,1.,abs(ax)+.7*(vn3(vec3(sk*1.1-uTime*.15, ax*2.+3., vInfo.y*5.))-.5));
      float flare=vn3(vec3(sk*.45-uTime*.07, vInfo.y*41., 2.));
      float burn=(.3+1.9*flare*flare)*(.4+1.1*fn);
      vec3 fireC=mix(cLimb*vec3(1.,.72,.5), cCore, clamp(rope*rope,0.,1.));
      // its knots are clots of fire that run down one thread: long along the rope, narrow across it
      float clot=exp(-k*k/.02)*smoothstep(.04,.2,leg)*2.2*kn*kn*exp(-30.*(ax-.8*(kn*2.-1.))*(ax-.8*(kn*2.-1.)));
      col=fireC*rope*fray*burn*foot*(.45+.55*pow(leg,1.4))*1.5+cCore*clot*1.5;
    }
    gl_FragColor=vec4(col*smoothstep(0.,.25,face)*ballMiss(cameraPosition-uWorld, -v, uBallR),1.);
  }`;async function ot(t,a={}){const s=a.radius??265,i={...ke,...a.palette||{}},S=a.worldCentre?new e.Vector3().copy(a.worldCentre):new e.Vector3(0,0,900),h=a.worldRadius??24,n=t.core.makeRng(t.core.hashSeed("star:"+t.seed)),M=t.core.makeRng(t.core.hashSeed("star-temper:"+t.seed)).pick(["calm","restless"]),p=t.core.makeRng(t.core.hashSeed("low-arches:"+t.seed)).int(14,18),l=["calm","restless","vast"].includes(a.temper)?a.temper:M,r=new e.Vector3(n.range(-30,30),n.range(-30,30),n.range(-30,30)),z=new e.Group,y={value:new e.Vector3},k={value:0},O={value:S},T={value:h},R={value:x(i.starMid)},d={value:x(i.starLimb)},b={value:x(i.core)},v=l==="restless"?6:l==="calm"?3:4,A=[],te=[];for(let o=0;o<6;o++){const c=n.range(0,Math.PI*2),m=n.range(.25,1.15);A.push({a:c,b:m,rad:n.range(13,24)/s,drift:n.range(8e-4,.0022)*n.sign()}),te.push(new e.Vector4(0,0,1,0))}const H=new e.SphereGeometry(s,96,40);await t.yield();const G=new e.Mesh(H,new e.ShaderMaterial({uniforms:{uTime:k,uRate:{value:l==="restless"?.62:.42},uBallR:T,uCentre:y,uWorld:O,cMid:R,cLimb:d,uOff:{value:r},uSpot:{value:te}},vertexShader:Re,fragmentShader:Ke,fog:!1}));z.add(G),await t.yield();const K=t.core.makeRng(t.core.hashSeed("star-glow:"+t.seed))()*Math.PI*2,Q=new e.Mesh(new e.SphereGeometry(s*4.8,48,24),new e.ShaderMaterial({uniforms:{uTime:k,uStarR:{value:s},uBallR:T,uLively:{value:l==="restless"?1.5:1},uCentre:y,uWorld:O,cMid:R,cLimb:d,uOff:{value:r},uPhase:{value:K},uQuiet:{value:a.quiet?new e.Vector3().copy(a.quiet).normalize():new e.Vector3(0,0,-1)}},vertexShader:Re,fragmentShader:Qe,side:e.BackSide,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,fog:!1}));Q.frustumCulled=!1,Q.renderOrder=1,z.add(Q),await t.yield();const u=48,_=8,C=[],Y=l==="calm"?6:5,U=l==="calm"?3:l==="restless"?p:4,f=n.range(0,Math.PI*2);l==="vast"&&C.push({al:f+Math.PI*2*5.5/6,be:20*L,H:200,span:Math.PI/2,tube:12,tw:0});for(let o=0;o<Y;o++){const c=n.range(92,160);C.push({al:f+(o+n.range(-.3,.3))*Math.PI*2/(l==="vast"?6:Y),be:n.range(14,24)*L,H:c,span:c*n.range(.55,.95)/s,tube:n.range(6.5,10)*(.8+c/400),tw:n.range(-.6,.6)})}for(let o=0;o<U;o++){const c=n.range(20,50);C.push({al:n.range(0,Math.PI*2),be:n.range(4,34)*L,H:c,span:c*n.range(.8,1.5)/s,tube:n.range(2.6,4.6),tw:n.range(-1.2,1.2)})}for(const o of C)o.phase=n(),o.T1=n.range(20,40),o.T2=n.range(15,30),o.skew=n.range(-.45,.45),o.crown=n.range(.5,.9);if(a.great){const o=t.core.makeRng(t.core.hashSeed("great-arch:"+t.seed)),c=a.great,m=s*o.range(c.height[0],c.height[1]),w=o.range(c.reach[0],c.reach[1]),I=o.range(270,320),ae=new e.Vector3(c.foot.x,0,c.foot.z).normalize(),q=Math.sign(ae.x)||1,g={f:ae,a:new e.Vector3(0,1,0),tw:0,be:0,al:0,H:m,over:0,span:2*Math.asin(I/2/s),tube:o.range(14,18),phase:2+o(),T1:o.range(30,44),T2:o.range(22,34),skew:o.range(-.15,.15),crown:o.range(.62,.8),great:!0};if(c.places&&c.places.length){await t.yield();const F=c.places.filter(B=>B.length()<s+1.5*m+c.reach[1]+2*g.tube),N=new e.Vector3().crossVectors(g.f,g.a).normalize(),oe=g.skew*.25*g.span,$=new e.Vector3,P=B=>{$.copy(g.f).multiplyScalar(Math.cos(oe)).addScaledVector(g.a,Math.sin(oe)).multiplyScalar(s*.985+g.H).addScaledVector(N,g.H*q*B);let V=1/0;for(const ie of F)V=Math.min(V,ie.distanceTo($));return V},j=2;let E=0,X=j;if(P(0)<w){for(let B=0;B<16;B++){const V=.5*(E+X);P(V)<w?E=V:X=V}g.over=q*X}if(await t.yield(),Pe(g,s,F)<c.clear){E=Math.abs(g.over),X=j;for(let B=0;B<12;B++){const V=.5*(E+X);g.over=q*V,Pe(g,s,F)<c.clear?E=V:X=V,B%3===2&&await t.yield()}g.over=q*X}await t.yield()}C.push(g)}return z.userData.arches=C,Je(t,{object:z,R:s,list:C,NSEG:u,NRING:_,tU:k,centre:y,uWorld:O,uBallR:T,cLimb:d,cCore:b,spots:A,uSpot:te,nSpot:v,temper:l})}const Ae=t=>[0,1,2].map(a=>({...t,H:t.H*(t.great?[1,.94,.88]:[1,.84,.66])[a],span:t.span*(t.great?[1,.9,1.07]:[1,.9,.78])[a],tube:t.tube*[1,.8,.62][a],tw:t.tw+(t.great?[0,.2,-.17]:[0,.32,-.27])[a],skew:t.skew+(t.great?[0,.2,-.24]:[0,.25,-.3])[a],phase:t.phase+a*.31,T2:t.T2*[1,1.2,.85][a],main:a===0}));function Pe(t,a,s){const i=new e.Vector3,S=new e.Vector3,h=new e.Vector3,n=new e.Vector3,M=new e.Vector3,p=ue[0]+ue[1];let l=1/0;for(const r of Ae(t)){i.copy(r.f),S.copy(r.a),h.crossVectors(i,S).normalize(),S.multiplyScalar(Math.cos(r.tw)).addScaledVector(h,Math.sin(r.tw)).normalize(),h.crossVectors(i,S).normalize();for(let z=0;z<=48;z++){const y=z/48,k=(y+r.skew*y*(1-y)-.5)*r.span,O=Math.pow(Math.max(Math.sin(Math.PI*y),0),r.crown),T=r.tube*(.62+.5*Math.sin(Math.PI*y));n.copy(i).multiplyScalar(Math.cos(k)).addScaledVector(S,Math.sin(k));for(const R of[-we,we]){M.copy(n).multiplyScalar(a*.985+r.H*O*p).addScaledVector(h,r.H*O*((r.over||0)+R));for(const d of s){const b=d.distanceTo(M)-T;b<l&&(l=b)}}}}return l}async function Je(t,a){const{object:s,R:i,NSEG:S,NRING:h}=a,n=[];for(const f of a.list)n.push(...Ae(f));const M=n.length*(S+1)*h,p=new Float32Array(M*3),l=new Float32Array(M*3),r=new Float32Array(M*3),z=new Float32Array(M*3),y=new Float32Array(M*4),k=new Float32Array(M*2),O=[],T=new e.Vector3,R=new e.Vector3,d=new e.Vector3,b=new e.Vector3,v=new e.Vector3,A=new e.Vector3,te=new e.Vector3,H=new e.Vector3,G=new e.Vector3,K=(f,o,c)=>{const m=(o+f.skew*o*(1-o)-.5)*f.span,w=Math.pow(Math.max(Math.sin(Math.PI*o),0),f.crown);return b.copy(T).multiplyScalar(Math.cos(m)).addScaledVector(R,Math.sin(m)),c.copy(b).multiplyScalar(i*.985+f.H*w).addScaledVector(d,f.H*w*(f.over||0))},Q={feet:[],tops:[]};let u=0;for(let f=0;f<n.length;f++){const o=n[f];o.f?(T.copy(o.f),R.copy(o.a)):(T.set(Math.cos(o.al)*Math.cos(o.be),Math.sin(o.al)*Math.cos(o.be),Math.sin(o.be)),R.set(-Math.sin(o.al),Math.cos(o.al),0)),d.crossVectors(T,R).normalize(),R.multiplyScalar(Math.cos(o.tw)).addScaledVector(d,Math.sin(o.tw)).normalize(),d.crossVectors(T,R).normalize(),o.main&&(Q.feet.push(K(o,0,new e.Vector3),K(o,1,new e.Vector3)),Q.tops.push(K(o,.5,new e.Vector3)));const c=u;for(let m=0;m<=S;m++){const w=m/S,I=Math.pow(Math.max(Math.sin(Math.PI*w),0),o.crown);K(o,Math.max(0,w-.004),v),K(o,Math.min(1,w+.004),A),te.subVectors(A,v).normalize(),K(o,w,v),G.copy(b),H.crossVectors(d,te).normalize();const ae=o.tube*(.62+.5*Math.sin(Math.PI*w));for(let q=0;q<h;q++,u++){const g=q/h*Math.PI*2,F=Math.cos(g),N=Math.sin(g),oe=H.x*F+d.x*N,$=H.y*F+d.y*N,P=H.z*F+d.z*N;if(p[u*3]=v.x+(H.x*F+d.x*N*.4)*ae,p[u*3+1]=v.y+(H.y*F+d.y*N*.4)*ae,p[u*3+2]=v.z+(H.z*F+d.z*N*.4)*ae,k[u*2]=F,k[u*2+1]=N,l[u*3]=oe,l[u*3+1]=$,l[u*3+2]=P,r[u*3]=G.x*o.H*I,r[u*3+1]=G.y*o.H*I,r[u*3+2]=G.z*o.H*I,z[u*3]=d.x*o.H*I,z[u*3+1]=d.y*o.H*I,z[u*3+2]=d.z*o.H*I,y[u*4]=w,y[u*4+1]=o.phase,y[u*4+2]=o.T1,y[u*4+3]=o.T2,m<S){const j=c+m*h+q,E=c+m*h+(q+1)%h;O.push(j,E,j+h,E,E+h,j+h)}}m%16===15&&await t.yield()}await t.yield()}await t.yield();const _=new e.BufferGeometry;_.setAttribute("position",new e.BufferAttribute(p,3)),_.setAttribute("normal",new e.BufferAttribute(l,3)),_.setAttribute("aRad",new e.BufferAttribute(r,3)),_.setAttribute("aLean",new e.BufferAttribute(z,3)),_.setAttribute("aInfo",new e.BufferAttribute(y,4)),_.setAttribute("aRing",new e.BufferAttribute(k,2)),_.setIndex(O);const C=new e.Mesh(_,new e.ShaderMaterial({uniforms:{uTime:a.tU,uBallR:a.uBallR,uWorld:a.uWorld,cLimb:a.cLimb,cCore:a.cCore},vertexShader:Ye,fragmentShader:Xe,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,fog:!1}));C.frustumCulled=!1,C.renderOrder=2,s.add(C);const Y=new e.Vector3;function U(f,o,c){a.tU.value=o,s.getWorldPosition(a.centre.value);for(let m=0;m<6;m++){const w=a.spots[m],I=w.a+w.drift*o;Y.set(Math.sin(w.b)*Math.cos(I),Math.sin(w.b)*Math.sin(I),Math.cos(w.b)),a.uSpot[m].set(Y.x,Y.y,Y.z,m<a.nSpot?w.rad:0)}}return U(0,0,null),{object:s,radius:i,height:2*i,center:new e.Vector3(0,0,0),anchors:Q,temper:a.temper,arches:a.list.length,tall:a.list.filter(f=>f.H>=90).length,great:a.list.find(f=>f.great)||null,update:U,ground:!1}}const et=`varying vec3 vN; varying vec3 vW;
  void main(){ vN=normalize(position); vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }`,tt=`
  uniform float uTime, uRate, uPhase, uStarR, uWorldR, uLaneCore, uLaneFull, uLaneZ1;
  uniform vec3 uSpinAxis, uSeed, uStar, uWorld, cIce, cCream, cCrack, cStar, cCopper;
  uniform vec4 uLine[9];
  uniform vec4 uDome[6];
  varying vec3 vN; varying vec3 vW;
  ${se}
  vec3 turn(vec3 v, vec3 k, float a){ return v*cos(a)+cross(k,v)*sin(a)+k*dot(k,v)*(1.-cos(a)); }
  // the ground's height at a place q of the moon's own frame (a unit vector), in units of about a metre; crack: how deep in a crack
  float ground(vec3 q, float fine, out float crack){
    vec3 w=q*2.3+uSeed;
    vec3 qw=normalize(q+.09*(vec3(vn3(w),vn3(w+7.3),vn3(w+13.1))-.5));
    float h=0.; crack=0.;
    for(int i=0;i<9;i++){
      float wd=uLine[i].w, d=abs(dot(qw,uLine[i].xyz)-.13*float(i-4))/wd;
      float cut=exp(-d*d), ridge=exp(-(d-2.1)*(d-2.1)*1.4);
      crack=max(crack,cut); h+=(-.55*cut+.4*ridge)*fine;
    }
    // a web of lesser cracks between them: the level lines of a slow noise
    float web=abs(vn3(qw*5.+uSeed.yzx)-.5)/.03, wc=exp(-web*web);
    crack=max(crack,.6*wc); h-=.3*wc*fine;
    for(int i=0;i<6;i++){ float s=(1.-dot(q,uDome[i].xyz))/uDome[i].w; h+=.9*exp(-s*s); }
    // smooth plains, and fields of broken ice between them
    float broken=smoothstep(.5,.7,vn3(q*2.1+uSeed.zxy));
    return h+.35*vn3(q*5.+uSeed.zxy)+broken*fine*(.22*vn3(q*38.+uSeed)+.1*vn3(q*90.+uSeed));
  }
  // the share of a disc of angular radius a that a disc of angular radius b hides when their middles stand d apart
  float hidden(float a, float b, float d){
    if(d>=a+b) return 0.;
    if(d<=abs(a-b)) return min(1.,(b*b)/max(a*a,1e-8));
    float x=clamp((d*d+a*a-b*b)/max(2.*d*a,1e-8),-1.,1.), y=clamp((d*d+b*b-a*a)/max(2.*d*b,1e-8),-1.,1.);
    float lens=a*a*acos(x)+b*b*acos(y)-.5*sqrt(max((-d+a+b)*(d+a-b)*(d-a+b)*(d+a+b),0.));
    return clamp(lens/max(3.14159265*a*a,1e-8),0.,1.);
  }
  void main(){
    vec3 n=normalize(vN), q=turn(n,uSpinAxis,-(uPhase+uTime*uRate));
    vec3 v=normalize(cameraPosition-vW);
    // detail finer than a pixel is faded by its own width
    float fw=max(length(dFdx(q)),length(dFdy(q))), fine=1.-smoothstep(.006,.03,fw);
    float crack, c1, c2;
    vec3 t1=normalize(cross(q,abs(q.y)<.9?vec3(0.,1.,0.):vec3(1.,0.,0.))), t2=cross(q,t1);
    float e=max(.004,fw*1.5), h0=ground(q,fine,crack), hx=ground(normalize(q+t1*e),fine,c1), hy=ground(normalize(q+t2*e),fine,c2);
    vec3 nq=normalize(q-(t1*(hx-h0)+t2*(hy-h0))*(.04/e));
    vec3 nn=turn(nq,uSpinAxis,uPhase+uTime*uRate);
    // the ice: pale plains in two tones, cracks a little darker and bluer
    float tone=vn3(q*1.6+uSeed.yzx), tone2=vn3(q*7.+uSeed);
    vec3 ice=mix(cIce,cCream,smoothstep(.35,.7,tone))*(.9+.14*tone2);
    ice=mix(ice,mix(ice,cCrack,.3),smoothstep(.5,.7,vn3(q*2.1+uSeed.zxy)));
    ice=mix(ice,cCrack,.66*crack*fine);
    // the star's light, less what the world hides of its disc from this place
    vec3 toS=uStar-vW, toW=uWorld-vW; float dS=max(length(toS),1.), dW=max(length(toW),1.); vec3 l=toS/dS;
    float aS=asin(clamp(uStarR/dS,0.,1.)), aW=asin(clamp(uWorldR/dW,0.,1.)), sep=acos(clamp(dot(l,toW/dW),-1.,1.));
    float most=min(1.,(aW*aW)/max(aS*aS,1e-8)), share=hidden(aS,aW,sep)/max(most,1e-6);
    float sun=1.-.93*smoothstep(.04,.82,share);
    // THE STAR'S LIGHT ON THE ICE, by the ground's own facing to the star: full where it faces it, falling as it turns
    // away (the relief of ridges and cracks takes it: a lit flank and a shaded one), a warm low band where the star
    // stands low over the ball's own horizon, and the shadowed side beyond: a soft terminator, no line
    float ndl=dot(nn,l), gdl=dot(n,l);
    float lit=clamp(ndl,0.,1.)*(.45+.55*smoothstep(0.,.4,ndl)), sky=smoothstep(-.03,.3,gdl);
    vec3 low=mix(vec3(1.,.5,.28), vec3(1.,.84,.62), smoothstep(.0,.16,gdl)); low=mix(low, vec3(1.), smoothstep(.12,.5,gdl));
    vec3 col=ice*cStar*low*lit*sky*sun*1.3;
    // frost: small faces that flash where they mirror the star
    float spark=vn3(q*240.+uSeed), flash=pow(max(dot(reflect(-l,nn),v),0.),24.);
    col+=cStar*flash*sun*sky*(.1+2.4*pow(spark,6.)*(1.-smoothstep(.3,.9,fw*240.)));
    // the copper of the embers: the river runs in a sleeve round the shadow's axis, brightest at uLaneCore metres
    // from it, full as far as z uLaneFull and nothing by uLaneZ1. The ground takes its light by its own place: by
    // how far it lies from the river's core, by what the river has left at that z, and by how it faces the river
    // (upstream and toward the axis, where the river is full: the ground that looks downstream takes none).
    vec2 ax=vW.xy-uWorld.xy; float rAx=max(length(ax),1e-3), gap=max(rAx-uLaneCore,0.)/10.;
    float facing=smoothstep(0.,1.,dot(nn,normalize(vec3(-.6*ax/rAx,-.8))));
    float reach=1./(1.+gap*gap), along=1.-smoothstep(uLaneFull,uLaneZ1,vW.z);
    col+=ice*cCopper*(.004+.5*facing*reach*along);
    // a hairline of the star's light at the limb, seen from the night side
    float rim=1.-max(dot(n,v),0.);
    col+=cStar*.6*pow(rim,6.)*smoothstep(-.5,.1,dot(n,l))*sun;
    gl_FragColor=vec4(col,1.);
  }`;async function rt(t,a={}){const s=a.radius||21,i=t.core.makeRng(t.core.hashSeed("moon:"+t.seed)),S=()=>{const b=i()*2-1,v=i()*Math.PI*2,A=Math.sqrt(Math.max(0,1-b*b));return new e.Vector3(A*Math.cos(v),b,A*Math.sin(v))},h=new e.Vector3(.5*(i()-.5),1,.5*(i()-.5)).normalize(),n=i()*Math.PI*2,M=260+120*i(),p=i()<.5?-1:1,l=new e.Vector3(i()*40,i()*40,i()*40),r=[];for(let b=0;b<9;b++){const v=S();r.push(new e.Vector4(v.x,v.y,v.z,.007+.011*i()))}const z=[];for(let b=0;b<6;b++){const v=S();z.push(new e.Vector4(v.x,v.y,v.z,.008+.02*i()))}const y=i();await t.yield();const k={uTime:{value:0},uRate:{value:p*Math.PI*2/M},uPhase:{value:n},uSpinAxis:{value:h},uSeed:{value:l},uLine:{value:r},uDome:{value:z},uStar:{value:(a.starCentre||new e.Vector3(0,0,-900)).clone()},uStarR:{value:a.starRadius||265},uWorld:{value:(a.worldCentre||new e.Vector3).clone()},uWorldR:{value:a.worldRadius||24},uLaneCore:{value:a.laneCore||27},uLaneFull:{value:a.laneFull||190},uLaneZ1:{value:a.laneZ1||230},cIce:{value:x("#dfe8ee")},cCream:{value:x("#efe4cc").lerp(x("#e6e9e4"),y*.6)},cCrack:{value:x("#8e6f5c").lerp(x("#7f97ad"),y)},cStar:{value:x(a.starColor||"#fff1d2")},cCopper:{value:x("#ffb884")}},O=new e.ShaderMaterial({uniforms:k,vertexShader:et,fragmentShader:tt,fog:!1}),T=new e.Mesh(new e.SphereGeometry(s,96,64),O),R=new e.Group;R.add(T),await t.yield();const d=(b,v)=>{k.uTime.value=v};return{object:R,radius:s,height:2*s,center:new e.Vector3(0,0,0),turnTime:M,update:d,ground:!1}}export{Me as AIR_GLSL,fe as BALL_GLSL,se as NOISE_GLSL,Le as SKIN_OVER,at as buildHero,rt as buildMoon,ot as buildStar};
