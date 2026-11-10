import*as a from"three";import{clamp as he,lerp as oe,smoothstep as J}from"../kit/core.js";const Ve=["#1F150D","#6B4E2E","#B08A55","#47563A","#587C8E","#A9BFC8","#E4DDC3"],Ut={UMBER:0,RAW:1,OCHRE:2,OLIVE:3,AZUR:4,PALE:5,WHITE:6},Fe=28*Math.PI/180,mt=55*Math.PI/180;function At(v=Ve){const r={uPal:{value:Ve.map((e,u)=>new a.Color(v[u]||e))},uFloor:{value:new a.Color("#2A1D12")},uLight:{value:new a.Vector3},uDipN:{value:new a.Vector3},uTime:{value:0},uAir:{value:1},uHour:{value:new a.Vector2(0,1)}};return pt(r,0),r}function pt(v,r){const e=Math.cos(mt),u=new a.Euler(0,r,0);v.uLight.value.set(.18*e,Math.sin(mt),-.98*e).normalize().applyEuler(u),v.uDipN.value.set(-Math.sin(Fe),Math.cos(Fe),0).applyEuler(u)}const Oe=`
uniform vec3 uPal[7]; uniform vec3 uFloor; uniform vec3 uLight; uniform vec3 uDipN; uniform float uTime; uniform float uAir; uniform vec2 uHour;
float lcH(vec2 p){ vec3 q=fract(vec3(p.xyx)*.1031); q+=dot(q,q.yzx+33.33); return fract((q.x+q.y)*q.z); }
float lcN2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(lcH(i),lcH(i+vec2(1.,0.)),f.x), mix(lcH(i+vec2(0.,1.)),lcH(i+vec2(1.,1.)),f.x), f.y); }
float lcFull=0.;      // a material may set it (0..1) before lcRockD: at 1 every bed of the mass carries its ledge light, thin beds too, and a wall that leans out over us keeps them (the two walls of the last straight)
float lcBare=0.;      // a bare thing (a root): no bed, parting or joint is ruled on it; it keeps only the form's tone
float lcSoft=0.;      // a wall sets it before lcRockD: its form turns from half tone to umber in one soft turning, with no step of value to read as a crease
float lcGreat=1., lcTopX=0., lcUndX=0.;      // a crag's blade (the glaze material's uBlade) sets them before lcRockD: lcGreat 0 takes the ruled great ledges and far bands off it (they go round a form like hoops), lcTopX / lcUndX are its own few partings' lit top and undercut
float lcSteps(float t){ float q=clamp(t,0.,1.)*5.; return (floor(q)+smoothstep(.12,.88,fract(q)))/5.; }
float lcTone(vec3 n){ return lcSteps(smoothstep(-.6,1.,dot(n,uLight))); }
vec3 lcGlaze(vec3 c,float tone){ return mix(uFloor,c,clamp(tone,0.,1.)); }
float lcBeds(vec3 wp){ float b=dot(wp,uDipN);
  float w=lcN2(vec2(b*.35,dot(wp.xz,vec2(.021,.017))))*2.-1.;
  float s=sin(b*1.55+w*1.3)*.55+sin(b*.47+1.7)*.45;
  float fine=sin(b*6.3+w*2.)*.35, fine2=sin(b*23.+w*5.)*.2;
  float fw=fwidth(b); fine*=1.-smoothstep(.12,.45,fw); fine2*=1.-smoothstep(.03,.12,fw); s*=1.-smoothstep(.6,2.2,fw);
  return clamp(s+fine+fine2,-1.,1.); }
vec3 lcAirK(vec3 c,vec3 wp,float gk){
  float d=distance(wp,cameraPosition);
  float de=d*(1.+(1.-smoothstep(0.,80.+d*.11,wp.y))*smoothstep(200.,700.,d));   // the air doubles at a far thing's feet
  float lum=dot(c,vec3(.3,.5,.2));
  // the green ground, from 60 m: olive gone grey in the air, its value pulled half way to the mean (half the contrast of
  // the near rock), a quarter of the local hue kept so a far light is a dull olive-ochre and never full ochre
  float v=mix(.11,lum,.5);
  vec3 og=mix(uPal[3],uPal[5],.22);
  vec3 g=mix(og*(v/.166),c*(v/max(lum,.012)),.16);
  c=mix(c,g,(1.-exp(-max(d-60.,0.)/95.))*uAir*gk);
  vec3 bl=uPal[4]*(.8+lum*1.2)*uHour.y;
  c=mix(c,bl,smoothstep(220.,900.,de)*uAir);
  c=mix(c,uPal[5]*mix(1.,uHour.y,.6),smoothstep(900.,6500.,de)*.86*uAir);
  c=mix(c,uPal[5]*mix(1.,uHour.y,.6),(1.-smoothstep(0.,50.+d*.1,wp.y))*smoothstep(350.,1100.,d)*.6*uAir);      // far things stand on pale air: the foot of a far pinnacle, the far land under the ranks
  return c; }
vec3 lcAir(vec3 c,vec3 wp){ return lcAirK(c,wp,1.); }
// The bedding as LEDGES, per pixel, on any face that crosses the beds: every bed boundary (one bed is 4.4 m of b,
// the same rule the land, the cave and the pinnacles step their geometry by) has a lit top just above it and an
// undercut just under it; within 40 m or so each bed parts again into four. x lit top, y undercut, z the bed's own value.
vec3 lcLedge1(float q,float fw,float wide){
  float c=floor(q), f=q-c, h0=fract(c*.618034+.31), h1=fract((c+1.)*.618034+.31);
  float wt=mix(.06,.2,h0)*wide, wu=mix(.1,.3,h1);
  float top=1.-smoothstep(wt*.25-fw,wt*1.2+fw,f), und=smoothstep(1.-wu*1.15-fw,1.-wu*.25+fw,f);
  float fade=1.-smoothstep(.07,.22,fw);                                     // a bed thinner than a few pixels is not ruled: it is left to the form
  return vec3(top*mix(.25+.75*h0*h0,.6+.4*h0,lcFull),und*mix(.3+.7*h1,.7+.3*h1,lcFull),h0-.5)*fade; }             // thick beds step out, thin ones barely (the land's own rule): ledges come in groups
vec3 lcRockD(vec3 wp,vec3 n,float occ,float moss,vec2 led,vec2 deep){
  float nd=distance(wp,cameraPosition);
  float nearK=1.-smoothstep(60.,170.,nd), farK=smoothstep(60.,200.,nd);     // his dark within 60 m; beyond 200 m the beds are soft bands only
  float form0=smoothstep(-.6,1.,dot(n,uLight)), form=mix(lcSteps(form0),form0,max(.9*smoothstep(45.,150.,nd),lcSoft));      // the one light on the form: five firm steps near, lost into one soft turning of tone far off (no band of value there reads as a cast shadow)
  form=mix(form,form*form*(.4+.6*form),nearK*.9);                          // near rock is the darkest thing: a face only half turned to the light sinks to umber
  float beds=lcBeds(wp)*(1.-lcBare);
  float grain=lcN2(wp.xz*.7+wp.y*.9)*.5+lcN2(wp.zy*2.3+wp.x*1.7)*.5;
  grain=mix(.5,grain,1.-smoothstep(40.,160.,nd));                          // grain finer than a few pixels: its flat average
  float b=dot(wp,uDipN), along=dot(wp.xz,vec2(.011,.016)), q=b/4.4; q+=.3*sin(q*1.7+1.3)+(lcN2(vec2(b*.09,along))-.5)*.2;      // beds of unequal thickness (the world's bedQ), a little unruled
  // the partings inside a bed are not ruled: they pinch and thicken along the bed and crowd in groups (0.3 to 3 m)
  float q4=q*4.+.7*sin(q*2.9+.7)+.12*sin(q*7.3+2.)+(lcN2(vec2(b*.2,along*2.3+5.))-.5)*.5+.37, q16=q4*4.+.6*sin(q4*2.3+1.1)+.11;
  float fw=fwidth(q)+1e-4, fw4=fwidth(q4)+1e-4;
  float cq=floor(q), jo=fract(cq*.754877+.11)*9.;                           // joints: soft clefts across a bed, each bed's own, on two sets of planes
  vec2 jc=vec2(wp.z+jo,dot(wp.xy,vec2(uDipN.y,-uDipN.x))+jo*1.7)/vec2(7.5,9.5), jf=abs(fract(jc)-.5)*vec2(7.5,9.5), jw=fwidth(jc)*vec2(7.5,9.5)+1e-4;
  float joint=max((1.-smoothstep(.05,.22+jw.x,jf.x))*(1.-smoothstep(.12,.4,jw.x)),(1.-smoothstep(.05,.22+jw.y,jf.y))*(1.-smoothstep(.12,.4,jw.y)))*step(.5,fract(cq*.618034+.31))*(1.-smoothstep(14.,44.,nd))*(1.-lcBare);      // the thick beds only, and only near
  float xb=smoothstep(.06,.42,1.-abs(dot(n,uDipN)));                    // ledges stand only on faces that cross the beds
  vec3 L0=lcLedge1(q,fw,1.)*(1.-farK), l0=lcLedge1(q4,fw4,1.25)*(1.-smoothstep(22.,70.,nd));
  // the GREAT LEDGES of the middle distance (45 to 500 m): where the 4.4 m beds grow too fine to rule, the rock is still bedded: every two or three
  // beds part as one ledge, a soft dull light along its top over a soft dark, moss on some: a far wall or a crag is never a smooth dune
  float qg=q/2.6+.37, fwg=fwidth(qg)+1e-4; vec3 G=lcLedge1(qg,fwg,1.7)*smoothstep(45.,110.,nd)*(1.-smoothstep(300.,560.,nd))*mix(.5,1.,led.x)*lcGreat;
  vec3 L=L0*led.x, l=l0*led.y*(1.-.6*L.x)*(1.-.5*L.y);
  vec3 l2=lcLedge1(q16,fw4*4.,1.25)*led.y*(1.-.6*L.x)*(1.-.6*l.x)*(1.-smoothstep(6.,22.,nd));     // and again, for the rock within a few metres of the eye
  float Lt=mix(L.x,L0.x/max(1.-farK,.001)*(1.-.6*farK),deep.y);                          // deep.y: a mass in half tone keeps the whole light of its ledge tops, and keeps it farther
  float top=clamp(Lt+mix(.6,1.,deep.y)*l.x+mix(.35,.9,deep.y)*l2.x+mix(.55,1.,deep.y)*G.x,0.,1.); top=max(mix(top,smoothstep(.26,.48,top),deep.y),lcTopX); top*=mix(xb,smoothstep(0.,.3,xb),deep.y)*smoothstep(-.35-.6*lcFull,.1-.6*lcFull,n.y); float und=clamp(L.y+.55*l.y+.4*l2.y+.55*G.y+lcUndX,0.,1.)*xb;      // a top shows on a face that leans back or stands, never under an overhang
  float band=sin(b*.21+1.7+2.*lcN2(vec2(b*.05,along*.6)));                 // far off: two or three soft bands to a pinnacle
  float tone=form*(1.+.06*beds*mix(.35,1.,lcGreat)+.1*band*farK*lcGreat)+beds*.02+(grain-.5)*.05+xb*(L.z*.07*led.x+l.z*.04*led.y);      // inside a lit face the bands are slight
  float occD=occ*deep.x; occD=mix(occD,mix(occD,.88,.65),farK); occ=mix(occ,mix(occ,.88,.65),farK);      // crevice dark is a near thing
  tone*=occD; occ=mix(occD,occ,deep.y);                                     // deep.x: the mass stands in half tone; its ledge tops (deep.y) do not
  tone=mix(tone,max(tone,.94*mix(1.,min(occ,1.),.45)),top);                 // a ledge's top faces the light whichever way its wall looks: full ochre (dimmer in a hollow or deep in the cave)
  tone=clamp(tone-(und*(.25+.45*tone)+joint*xb*max(led.x,.6)*mix(.2,.42,deep.y)),0.,1.);            // a lit ochre top, an umber underside, the bed's own value between
  float o1=clamp(tone,0.,1.);
  o1*=mix(mix(.6,1.,smoothstep(.3,.62,o1)),1.,smoothstep(4.,48.,nd));      // the nearest thing is the darkest: in its shadows, never in its lights
  vec3 local=mix(uPal[1],uPal[2],smoothstep(mix(.5,.62,nearK)-.16*uHour.x,mix(.76,.88,nearK)-.1*uHour.x,o1));   // raw umber half tone; ochre where the light is full
  float mtop=clamp(lcLedge1(q,fw,2.2).x*(1.-farK)*3.*step(.3,fract(cq*.371+.2))+l0.x*1.6*step(.5,fract(floor(q4)*.259))+G.x*2.2*step(.4,fract(floor(qg)*.471+.13)),0.,1.)*xb*smoothstep(-.35,.1,n.y);      // moss lies whole along a ledge's top, whatever share of the ledge the mass draws
  mtop=mix(mtop,smoothstep(.2,.5,mtop)*step(.45,fract(cq*.871+floor(q4)*.137+.3)),deep.y);      // on such a mass moss lies whole along some tops and leaves the others to the light
  float mm=mix(mtop,smoothstep(.3,.7,grain+n.y*.4),smoothstep(.45,.85,n.y));
  float mg=G.x*step(.4,fract(floor(qg)*.471+.13))*xb*smoothstep(-.35,.1,n.y)*deep.y;      // and along some of the great ledges of a mass that carries its lights, whatever its own moss
  local=mix(local,uPal[3]*1.05,max(moss*clamp(mm,0.,1.),clamp(mg*1.6,0.,.85)));                      // moss lies along the ledges (verdigris gone olive), never in blotches
  return lcGlaze(local,clamp(o1*1.12+.02,0.,1.)); }      // thin on the lit crests (the ochre lands whole), pooled in the hollows
vec3 lcRock(vec3 wp,vec3 n,float occ,float moss,vec2 led){ return lcRockD(wp,n,occ,moss,led,vec2(1.,0.)); }
vec3 lcRock(vec3 wp,vec3 n,float occ,float moss){ return lcRock(wp,n,occ,moss,vec2(1.)); }
`,St=`
varying vec3 vWp; varying vec3 vN; varying vec3 vC; varying float vNv0;
uniform float uPush; uniform float uRad;
#ifdef LC_RAD
  attribute float aRad;
#endif
void main(){
  vec4 p=vec4(position,1.); vec3 n=normal;
  #ifdef USE_INSTANCING
    p=instanceMatrix*p; n=mat3(instanceMatrix)*n;
  #endif
  vec4 wp=modelMatrix*p; vec3 wn=mat3(modelMatrix)*n; wn=wn/max(length(wn),1e-5);
  vWp=wp.xyz; vN=wn;
  #ifdef USE_COLOR
    vC=color;
  #else
    vC=vec3(1.,0.,1.);
  #endif
  float rad=uRad;
  #ifdef LC_RAD
    rad=aRad;
  #endif
  float push=min(uPush*distance(wp.xyz,cameraPosition),max(rad,.05)*.6);     // contour shell: pushed uPush x view distance, never farther than the form is thick there (a far spire's tip stays a tip)
  float q=max(rad,.05)/(max(rad,.05)+push+1e-4); vNv0=sqrt(clamp(1.-q*q,.0004,1.));   // N.V on the shell where it stands over the solid's own edge
  wp.xyz+=wn*push;
  gl_Position=projectionMatrix*viewMatrix*wp;
}`,Wt=`
varying vec3 vWp; varying vec3 vN; varying vec3 vC; varying float vNv0;
uniform float uPush; uniform float uRim; uniform vec3 uTint; uniform float uTintAmt; uniform vec4 uFace; uniform vec2 uLedge; uniform vec2 uDeep; uniform float uLitTop; uniform float uBlade;
${Oe}
void main(){
  vec3 n=normalize(vN+vec3(0.,1e-5,0.));
  float occ=clamp(vC.r,0.,1.2), moss=clamp(vC.g+uDeep.y,0.,1.);      // uDeep: x a mass that stands in half tone, y moss along all its ledges
  vec3 nf=normalize(mix(n,uFace.xyz,uFace.w)+vec3(0.,1e-5,0.));      // uFace: the mass's own broad face, mixed into the light's normal
  float al=1., lk=1.;
  #ifdef LC_SHELL
    vec3 vd=cameraPosition-vWp; vd=vd/max(length(vd),1e-4);
    float nv=abs(dot(n,vd)), a0=clamp(nv*nv/max(vNv0*vNv0,1e-4),0.,1.);      // 0 at the pushed rim, 1 over the solid's edge, even across the band
    al=a0*a0*(3.-2.*a0)*uRim*clamp(vC.b,0.,1.); lk=a0*a0;                    // the rim carries the form's tone only: a ruled ledge half gone over the sky would read as a smear
  #endif
  lcFull=clamp(vC.b-1.,0.,1.);      // vertex colour b over 1: a mass all of whose beds carry their ledge lights
  // A CRAG'S BLADE (uBlade 1, on every vertex whose b is 1): g is not moss but the blade's own parting coordinate, whole numbers at its
  // few partings (its rings, which lie on bedding planes at unequal heights). Each parting is ruled here as a short slanting ledge, a
  // dull light on its top over a dark, that pinches out along the bed and stops where the face meets a joint or an arris (r, the
  // crevice dark, is low there): never a hoop round the form. The ruled beds of the land are taken off it.
  lcBare=step(vC.b,-.5);            // vertex colour b under 0: a bare root
  // A WALL (vertex colour b 3, on a blade): a blade whose ledge lights hold where it leans out over us (lcFull) and whose every parting can be followed
  // from arris to arris as a soft dark, the light on it swelling and dying along the bed.
  float wl=step(2.5,vC.b), bl=uBlade*(1.-lcFull*(1.-wl)); vec2 led=uLedge*lk*mix(vec2(1.),vec2(.0,.3*(1.-wl)),bl)*(1.-lcBare); lcSoft=.85*wl*bl;      // (no ruled hairline on a wall: its own partings only)
  {
    float s=vC.g, fs=fwidth(s)+1e-4, c=floor(s+.5), f=s-c, h=fract(c*.618034+.27), h2=fract(c*.3819+.61);
    float wt=mix(.08,.18,h), wu=mix(.14,.34,h2);
    float nz=lcN2(vec2(c*7.3,dot(vWp.xz,vec2(.11,.06)))+.3*h);
    float keep=bl*smoothstep(.6,.86,vC.r)*step(.5,mod(c,16.))*(1.-smoothstep(.1,.28,fs))*mix(smoothstep(.3,.5,nz),.45+.55*smoothstep(.25,.6,nz),wl);
    lcTopX=keep*mix(step(.3,h),step(.15,h)*smoothstep(.22,.5,nz),wl)*smoothstep(-fs,fs,f)*(1.-smoothstep(wt*.5-fs,wt+fs,f));
    lcUndX=keep*smoothstep(-wu*1.2-fs,-wu*.25+fs,f)*(1.-smoothstep(-fs,fs,f));
    lcGreat=(1.-bl)*(1.-lcBare); moss=max(moss*(1.-bl),bl*clamp(vC.r-2.,0.,1.));      // (a blade's r over 2: moss on a fallen block's upper face)
  }
  vec3 col=lcRockD(vWp,nf,occ,moss,led,vec2(uDeep.x,uLitTop*lk*(1.-lcBare)));
  col=mix(col,lcGlaze(uTint,lcTone(n)*occ*uDeep.x),uTintAmt);
  col=lcAir(col,vWp);
  gl_FragColor=vec4(col,al);
}`;function rt(v,r={}){return new a.ShaderMaterial({uniforms:{...v,uPush:{value:0},uRim:{value:1},uRad:{value:r.rad??20},uFace:{value:new a.Vector4(0,1,0,0)},uLedge:{value:new a.Vector2(r.ledge??1,r.ledgeFine??1)},uDeep:{value:new a.Vector2(r.dark??1,r.moss??0)},uLitTop:{value:r.litTop??0},uBlade:{value:r.blade??0},uTint:{value:new a.Color(r.tint||Ve[3])},uTintAmt:{value:r.tintAmt??0}},vertexShader:St,fragmentShader:Wt,vertexColors:!!r.vertexColors,side:r.side??a.FrontSide})}function Bt(v,r={}){const e=rt(v,r);return e.defines=r.radAttr?{LC_SHELL:1,LC_RAD:1}:{LC_SHELL:1},e.uniforms.uPush.value=r.push??.022,e.uniforms.uRim.value=r.rim??1,e.transparent=!0,e.depthWrite=!1,e}const Pt=`
varying vec2 vUv; varying vec4 vS; varying vec3 vWp;
uniform float uLines; uniform float uFar; uniform float uLit; uniform float uFarLit; uniform float uAirK; uniform float uPaleB; uniform float uPart;
${Oe}
void main(){
  float v=clamp(vUv.y,-1.,1.), round=1.-v*v;      // clamped: a varying runs past its range on thin triangles under antialiasing
  float fwl=fwidth(v*9.);      // (taken here, outside every branch)
  float flatK=smoothstep(.45,.95,fwidth(v));       // a strand under four pixels wide goes to its flat average tint, whole under two: a far bundle whose strands touch is one soft lock, paler on its outer side, never bars
  float f=(v*.5+.5)*uLines+.5, fw=fwidth(f)+1e-4, wl=.13;
  float line=1.-smoothstep(wl-fw,wl+fw,abs(fract(f)-.5));
  float farL=smoothstep(.3,.7,fw);
  line=mix(line,uFar,farL);          // lines finer than a few pixels: the strand itself is the pale stroke on its dark body
  float pulse=.62+.38*sin(vS.y*.55+vS.w*40.);
  float glint=smoothstep(.15,.9,sin(vS.y*.45+vS.w*17.)*.5+.5);
  vec3 hollow=mix(uFloor,uPal[3],.5);
  vec3 body=mix(uPal[3],uPal[5],clamp(vS.z,0.,1.)*.5*uPaleB);
  if(vS.x<-.001){ body=mix(uFloor,uPal[3],.66); hollow=mix(uFloor,uPal[3],.4); pulse=.8+.2*pulse;
    body=mix(body,hollow,.5*smoothstep(.3,.75,lcN2(vec2(v*7.+vS.w*5.,vS.y*.03))));      // the body is water too: slow lanes of tone run down it, never a flat board
    if(uPart>.5){      // the great fall's dark ribbons have the fall's own form: lanes of tone that go down with the strands, umber-olive at their
      // edges, and they PART: toward their edges and their foot they are tongues between hollows (the fall's whole body, behind them, is FALL_BODY below)
      float fa=clamp(vUv.x,0.,1.), keep=1.-smoothstep(.3,.8,fwl);
      float l1=lcN2(vec2(v*9.+vS.w*5.,vS.y*.1)), l2=lcN2(vec2(v*23.+3.,vS.y*.21+7.)), edge=smoothstep(.3,1.,abs(v));
      float dk=clamp(edge*.95+(.6*smoothstep(.35,.7,l1)+.3*smoothstep(.4,.8,l2)-.25)*keep,0.,1.);
      body=mix(mix(uFloor,uPal[3],.6),mix(uFloor,uPal[3],.16),dk); hollow=mix(uFloor,uPal[3],.2);
      float part=edge*1.15+smoothstep(.62,1.,fa)*.8+(1.-smoothstep(0.,.12,fa))*.6;
      if(mix(.5,l1*.65+l2*.35,keep)<part-.42) discard;
    }
  }
  vec3 col=mix(hollow,body,clamp(mix(round,.67,flatK)*(.5+.5*pulse),0.,1.));
  col=mix(col,uPal[6],clamp(line*clamp(vS.x,0.,1.)*uLit*mix(.3+.7*glint,1.,farL*uFarLit)*mix(smoothstep(0.,.5,round),.8,flatK),0.,1.));      // uFarLit: far off the outer strands are whole pale strokes (a great curl read from the lip)
  gl_FragColor=vec4(lcAirK(col,vWp,uAirK),1.);
}`,Ft=`
attribute vec3 aO,aU,aV; attribute vec4 aP,aQ,aK;
uniform float uTime,uGrow,uCyc,uBend,uAng,uSqz,uSize,uTin,uMinW,uStem,uSqO; uniform vec3 uWave; uniform vec4 uMove;
varying vec2 vUv; varying vec4 vS; varying vec3 vWp;
void main(){
  float a=position.x, v=position.y;
  float sc=smoothstep(aQ.y,aQ.y+.14,uGrow);
  float cyc=fract(uTime*.085+aQ.z);
  float e=mix(1.,smoothstep(0.,.42,cyc)*(1.-smoothstep(.62,1.,cyc)),uCyc);
  float Ls=aP.x*sc*e*uSize*uStem, R=max(aP.y*sc*uSize*mix(1.,.3+.7*e,uCyc),1e-3), k=aP.z;
  float T=6.2832*max(aP.w+uMove.x*sin(uTime*uMove.y+aQ.z*6.2832)*(1.-uCyc)-uCyc*(1.-e)*.9,.3);   // the scroll winds and unwinds on the world's clock
  float q=sqrt(1.+k*k), Lp=R/k*q*(1.-exp(-k*T)), s=a*(Ls+Lp);
  if(uAng>.01){ float m=1.-clamp((a-uAng)/(1.-uAng),0.,1.)*(1.-exp(-k*T*.5)); s=a<uAng?Ls*a/uAng:Ls+R/k*q*(1.-m*m); }      // uAng: the stem's share of the segments; the scroll's then turn less where its radius is large (an even sagitta), so no corner shows on the outer winding
  float r=R, lat=0., sS=min(s,Ls), th=uBend*sS/max(Ls,1e-3);      // the stem: an open arc turning uBend radians the scroll's way
  vec2 p=uBend>1e-3?(Ls/uBend)*vec2(sin(th),1.-cos(th)):vec2(sS,0.), tg=vec2(cos(th),sin(th));
  if(s>Ls){
    float arg=max(1.-(s-Ls)*k/(R*q),1e-4), t=-log(arg)/k; r=R*arg;
    vec2 e0=vec2(-k,-1.)/q; float c=cos(t), sn=sin(t), cb=cos(uBend), sb=sin(uBend);
    vec2 dv=r*vec2(e0.x*c-e0.y*sn,e0.x*sn+e0.y*c), tl=vec2(c,sn);
    float phi=uMove.w*uTime+aQ.z*6.2832, ov=.11*smoothstep(0.,2.4,t)*step(1e-4,abs(uMove.w)); vec2 a1=vec2(cos(phi),sin(phi));      // uMove.w: the coil turns on the world's clock (0.15 rad/s for a great curl)
    dv+=ov*(2.*dot(dv,a1)*a1-dv); tl+=ov*(2.*dot(tl,a1)*a1-tl); tl=tl/max(length(tl),1e-4);
    vec2 ps=-R*e0+dv;
    p+=vec2(ps.x*cb-ps.y*sb,ps.x*sb+ps.y*cb); tg=vec2(tl.x*cb-tl.y*sb,tl.x*sb+tl.y*cb);
  } else { float w=s/max(Ls,1e-3); lat=-aK.w*uSize*.5*(1.-cos(w*6.2832))*.5*aQ.z
      +uWave.x*sin(w*uWave.y*6.2832+aQ.z*61.-uTime*uWave.z)*sin(w*3.1416); }   // uWave: the stem weaves, the whole bundle as one (strands never cross)
  vec2 nn=vec2(-tg.y,tg.x); p+=nn*lat;
  float wb=abs(aK.w)*uSize*.9+1e-3, off=aQ.x*uSize*sc*r/(r+wb)*(R+wb)/R;
  vec3 nrm=cross(aU,aV);
  vec3 pos=aO+aU*p.x+aV*p.y+(aU*nn.x+aV*nn.y)*off;
  pos+=nrm*aK.z*uSize*sc*cos(clamp(aQ.x/max(abs(aK.w),1e-3),-1.,1.)*1.45)*sqrt(max(sin(a*3.1416),0.));
  pos.x=mix(pos.x*uSqz,pos.x-aO.x*(1.-uSqz),max(step(.5,aK.x),uSqO));      // uSqz (the bore in a narrow river): flat locks are drawn narrower, standing scrolls only stand closer; uSqO 1 (the tails): flat locks too keep their breadth and only lie closer
  vec4 wp=modelMatrix*vec4(pos,1.);
  float dist=distance(wp.xyz,cameraPosition);
  float taper=smoothstep(0.,uTin,a)*(1.-smoothstep(.72,1.,a)*.85)*(1.-smoothstep(.97,1.,a));      // uTin: how far along a strand comes to its full width (0.05; more for a lock that rises out of level water)
  float hw0=aQ.w*sc*uSize*mix(1.,e,uCyc), hw=max(hw0,uMinW*dist*min(sc*40.,1.))*taper;      // uMinW: no strand thinner than about two pixels (0.0011 of its distance); more for a close-combed lock, whose far strands then touch and leave no gap
  float thin=clamp(hw0/max(uMinW*dist,1e-4),.3,1.);
  vec3 t3=mat3(modelMatrix)*(aU*tg.x+aV*tg.y);
  vec3 sideF=mat3(modelMatrix)*(aU*nn.x+aV*nn.y);
  vec3 sbd=cross(t3,cameraPosition-wp.xyz); sbd=sbd/max(length(sbd),1e-4);
  wp.xyz+=mix(sideF,sbd,aK.x*step(-.5,aK.y))*v*hw;      // a bundle's dark body (aK.y -1: half a metre to a metre broad) has an attitude of its own: its breadth lies in the bundle's own plane, whatever looks at it. Only a single strand is a round thread, drawn turned about its length
  vWp=wp.xyz; vUv=vec2(a,v);
  vS=vec4(thin*aK.y*(.45+.55*smoothstep(-1.,1.,-aQ.x/max(abs(aK.w),1e-3))),(s-uTime*mix(5.,7.,uCyc))*uMove.z,fract(aQ.z*7.31)*.8,aQ.z);
  gl_Position=projectionMatrix*viewMatrix*wp;
}`,Rt=`
attribute vec3 aO,aU; attribute vec4 aP,aK;
uniform float uTime,uGrow,uRun,uFine,uTwin; uniform vec3 uLip,uFoot;
#ifdef LC_SLIDE
  uniform float uProf[17];      // a slide: the water keeps to the ground, whose heights under its run are given at 17 even stations
#endif
varying vec2 vUv; varying vec4 vS; varying vec3 vWp;
void main(){
  float a=position.x, v=position.y;
  float sc=smoothstep(aP.y,aP.y+.1,uGrow);
  float W=mix(1.,7.,uGrow), tau=(a-.07)/.93;
  float o=uLip.x-uFoot.x, H=uLip.y-uFoot.y;
  vec3 c, tg;
  if(tau<0.){ c=uLip+vec3(-tau*120.,.3+tau*tau*60.,0.); tg=vec3(-1.,0.,0.); }
  else {
    #ifdef LC_SLIDE
      float ft=clamp(tau,0.,1.)*16., fi=min(floor(ft),15.), ff=ft-fi; int ip=int(fi);
      float y0=uProf[ip], y1=uProf[ip+1], ym=uProf[max(ip-1,0)], y2=uProf[min(ip+2,16)];
      float sl=mix(.5*(y1-ym),.5*(y2-y0),ff);      // the slope eased from station to station: the plait bends over each ledge, it does not kink
      c=vec3(uLip.x-o*tau,uLip.y+mix(y0,y1,ff*ff*(3.-2.*ff))+.3,uLip.z); tg=vec3(-o/16.,sl-.001,0.); tg=tg/max(length(tg),1e-4);
    #else
      c=vec3(uLip.x-o*tau,uFoot.y+H*(1.-tau*tau)+.3,uLip.z); tg=vec3(-o,-2.*H*tau-.01,0.); tg=tg/max(length(tg),1e-4);
    #endif
  }
  float open=smoothstep(-.075,.3,tau), fl=tau-uTime*.175*uRun;
  float ph=aP.z+aU.z*6.2832*fl, ps=aO.z+tau*3.+uTime*.25*sign(aU.z+1e-3);
  float lat=(aO.x*W*(.7+.5*tau)*(1.-.62*uTwin)+aU.x*sin(ph)*sc*min(W*.4,1.)*(1.-.4*uTwin))*(.35+.65*open)
    +(aO.x>=0.?1.:-1.)*uTwin*6.6*smoothstep(-.02,.22,tau);      // uTwin: the fall parts into two braids below the lip
  float dep=(aO.y+aU.y*cos(ph))*open*min(W*.35,1.);
  vec3 dn=vec3(-tg.y,tg.x,0.);
  vec3 pos=c+vec3(0.,0.,1.)*(lat+aP.x*cos(ps)*sc)+dn*(dep+aP.x*sin(ps)*.6*sc*open);
  vec4 wp=modelMatrix*vec4(pos,1.);
  float dist=distance(wp.xyz,cameraPosition);
  float taper=smoothstep(0.,.05,a)*(1.-smoothstep(.9,1.,a));
  float hw0=aP.w*sc;
  bool fixd=aK.x<0.;      // a fall's dark ribbons (2.7 m broad in the great fall, 1 m in the brook's slide) are things with a fixed attitude: their breadth lies along the strands' spread, whatever looks at them
  float hw=(fixd?hw0:max(hw0,.0011*dist*min(sc*40.,1.)))*taper;
  float thin=fixd?1.:clamp(hw0/max(.0011*dist,1e-4),.3,1.);
  vec3 t3=mat3(modelMatrix)*tg;
  vec3 sb=fixd?mat3(modelMatrix)*vec3(0.,0.,1.):cross(t3,cameraPosition-wp.xyz); sb=sb/max(length(sb),1e-4);      // a single strand (0.1 to 0.4 m as built) is a round thread: it is drawn as its own width, turned about its length
  wp.xyz+=sb*v*hw;
  vWp=wp.xyz; vUv=vec2(a,v);
  vS=vec4(aK.x*thin,fl*H*uFine,aK.y,aK.z);
  gl_Position=projectionMatrix*viewMatrix*wp;
}`;function Re(v,r="lock",e={}){const u=new a.ShaderMaterial({uniforms:{...v,uGrow:{value:1},uCyc:{value:e.cyc??0},uLines:{value:e.lines??4},uWave:{value:new a.Vector3(e.wave??0,e.waves??2,e.waveSpeed??1.5)},uMove:{value:new a.Vector4(e.turnAmp??.2,e.turnRate??.15,e.flow??1,e.turn??0)},uBend:{value:e.bend??0},uAng:{value:e.ang??0},uSqz:{value:1},uStem:{value:1},uSqO:{value:e.sqo??0},uSize:{value:1},uTin:{value:.05},uMinW:{value:e.minW??.0011},uLit:{value:1},uFar:{value:e.far??(r==="fall"?.3:.55)},uFarLit:{value:e.farLit??0},uAirK:{value:e.airK??.4},uPaleB:{value:1},uPart:{value:0},uTwin:{value:0},uLip:{value:new a.Vector3},uFoot:{value:new a.Vector3},uRun:{value:e.run??1},uFine:{value:e.fine??1}},vertexShader:r==="fall"?Rt:Ft,fragmentShader:Pt,side:a.DoubleSide});return r==="fall"&&e.slide&&(u.defines={LC_SLIDE:1},u.uniforms.uProf={value:e.slide}),u}function vt(v,r,e){const u=new a.InstancedBufferGeometry,d=new Float32Array((v+1)*6),h=[];for(let z=0;z<=v;z++)d[z*6]=d[z*6+3]=z/v,d[z*6+1]=-1,d[z*6+4]=1;for(let z=0;z<v;z++){const m=z*2;h.push(m,m+1,m+2,m+1,m+3,m+2)}u.setAttribute("position",new a.BufferAttribute(d,3)),u.setIndex(h);for(const z in r)u.setAttribute(z,new a.InstancedBufferAttribute(r[z][1],r[z][0]));return u.instanceCount=e,u.boundingSphere=new a.Sphere(new a.Vector3,1e5),u}const Tt=`
uniform float uTime,uGrow,uTwin; uniform vec3 uLip,uFoot;
varying vec3 vWp; varying vec4 vB;
void main(){
  float a=position.x, ph=position.y, sd=position.z;
  float W=mix(1.,7.,uGrow), tau=(a-.07)/.93;
  float o=uLip.x-uFoot.x, H=uLip.y-uFoot.y;
  vec3 c, tg;      // the fall line and its tangent: the same law as the strands' (FALL_VERT, no slide)
  if(tau<0.){ c=uLip+vec3(-tau*120.,.3+tau*tau*60.,0.); tg=vec3(-1.,0.,0.); }
  else { c=vec3(uLip.x-o*tau,uFoot.y+H*(1.-tau*tau)+.3,uLip.z); tg=vec3(-o,-2.*H*tau-.01,0.); tg=tg/max(length(tg),1e-4); }
  float open=smoothstep(-.075,.3,tau), taper=smoothstep(0.,.05,a)*(1.-smoothstep(.9,1.,a));
  float there=sd>0.?1.:step(.001,uTwin);      // the second tube is nothing until the fall parts (it then leaves the first from the same place)
  float B=6.6*W/7.*(1.-.42*uTwin)*(.62+.42*clamp(tau,0.,1.))*(1.+.06*sin(tau*13.-uTime*.5)+.04*sin(tau*29.+1.7))*taper*there;      // the width breathes slowly down the fall
  float D=(2.7*open*min(W*.35,1.)+.3)*taper*there;
  vec3 dn=vec3(-tg.y,tg.x,0.);
  vec3 pos=c+vec3(0.,0.,1.)*(sd*uTwin*6.6*smoothstep(-.02,.22,tau)+B*cos(ph))+dn*(D*sin(ph));      // uTwin: one tube behind each braid
  vec4 wp=modelMatrix*vec4(pos,1.);
  vWp=wp.xyz; vB=vec4(a,ph,(tau-uTime*.175)*H,(1.-sd)*8.5);      // the lanes run down with the plait, 14 m/s
  gl_Position=projectionMatrix*viewMatrix*wp;
}`,qt=`
varying vec3 vWp; varying vec4 vB; uniform float uAirK;
${Oe}
void main(){
  float fa=clamp(vB.x,0.,1.);
  float w=1.-vB.y/1.5708;      // across the wall by the angle round it: 0 straight behind the fall line (toward the dam), +1 and -1 at the two ends of the strands' spread, 2 and -2 meeting in front
  // THE WALL'S MIDDLE stands 40 degrees round from straight behind, toward the end of the spread that lies away from the cave (the mesh's +z): the way comes from
  // the cave down the dam and has the fall before it from the other end only (60 to 20 m off, 75 to 44 degrees off square), and from there the wall that stands
  // behind the strands is the dam's side of the tube and its far end, round to the front. A law of the place: nothing here reads the eye.
  float m=w-.45, aw=abs(m);
  float side=smoothstep(.7,1.15,aw), flatK=smoothstep(.45,.95,fwidth(w));
  float pulse=.8+.2*(.62+.38*sin(vB.z*.55+20.));
  float keep=1.-smoothstep(.3,.8,fwidth(w*9.));      // lanes finer than three pixels go to their flat average
  float l1=lcN2(vec2(w*9.+2.5+vB.w,vB.z*.1)), l2=lcN2(vec2(w*23.+3.+vB.w,vB.z*.21+7.));
  float dk=clamp(side*.8+(.6*smoothstep(.35,.7,l1)+.3*smoothstep(.4,.8,l2)-.25)*keep,0.,1.);
  vec3 body=mix(mix(uFloor,uPal[3],.6),mix(uFloor,uPal[3],.16),dk), hollow=mix(uFloor,uPal[3],.2);      // olive grey, umber-olive toward its two sides
  // it PARTS: toward its two sides, its head and its foot it is tongues between hollows, and further round it is gone: its outline is made of locks, never a rim.
  // Across its middle it is whole. On the dam's side toward the cave the tongues begin half way out (36 degrees from the middle) and it is gone by 120; round the
  // far end of the spread, where the strands stand before it deepest, it is whole 30 degrees further.
  float e=aw-.35*step(0.,m);
  float part=smoothstep(.4,.6,e)*(.6+.9*clamp(e-.55,0.,.6))+smoothstep(1.1,1.4,e)*1.2+smoothstep(.62,1.,fa)*.8+(1.-smoothstep(0.,.12,fa))*.6;
  if(mix(.5,l1*.65+l2*.35,keep)<part-.42) discard;
  vec3 col=mix(hollow,body,clamp(mix(1.-side,.67,flatK)*(.5+.5*pulse),0.,1.));      // the body's tone across its middle, into the hollow's tone at its sides
  gl_FragColor=vec4(lcAirK(col,vWp,uAirK),1.);
}`;function Ct(v,r){const e=new a.BufferGeometry,u=r+1,d=(v+1)*u,h=new Float32Array(d*6),z=[];for(let m=0;m<2;m++)for(let T=0;T<=v;T++)for(let w=0;w<u;w++){const j=(m*d+T*u+w)*3;if(h[j]=T/v,h[j+1]=-Math.PI/2+2*Math.PI*w/r,h[j+2]=m?-1:1,T<v&&w<r){const y=m*d+T*u+w;z.push(y,y+u,y+1,y+1,y+u,y+u+1)}}return e.setAttribute("position",new a.BufferAttribute(h,3)),e.setIndex(z),e.boundingSphere=new a.Sphere(new a.Vector3,1e5),e}const Gt="varying vec3 vWp; void main(){ vec4 wp=modelMatrix*vec4(position,1.); vWp=wp.xyz; gl_Position=projectionMatrix*viewMatrix*wp; }",Dt=`
varying vec3 vWp; uniform vec3 uBoilW; uniform float uGrow; uniform float uPaleW; uniform vec4 uRimW; uniform vec3 uOutW; uniform vec3 uBandW;
${Oe}
void main(){
  vec2 rb=vWp.xz-uBoilW.xz; float r=length(rb), d=distance(vWp,cameraPosition);
  vec3 vd=(cameraPosition-vWp)/max(d,1e-3);
  float big=lcN2(vWp.xz*.021+7.)*.6+lcN2(vWp.xz*.09)*.4;
  float sw=sin(r*.42-uTime*.9)*exp(-r/85.)*uGrow;
  // the streaming: broad slow lanes of tone that leave the boil and run out with the current (level tone, no glint)
  float ang=atan(rb.y,-rb.x+sign(-rb.x+1e-4)*1e-3), nearB=1.-smoothstep(70.,150.,r);
  float lane=lcN2(vec2(ang*5.5,r*.03-uTime*.11))*.62+lcN2(vec2(ang*15.+3.,r*.055-uTime*.17))*.38;
  float dn=1.-smoothstep(25.,110.,d);
  float riv=lcN2(vec2(vWp.x*.16+3.,vWp.z*.03-uTime*.2))*.5+lcN2(vec2(vWp.x*.45+9.,vWp.z*.07-uTime*.4))*.32+mix(.5,lcN2(vec2(vWp.x*1.1,vWp.z*.16-uTime*.7)),dn)*.18;
  lane=smoothstep(.28,.72,mix(riv,lane,nearB))-.5;      // a river or a brook (far from any boil) streams down its own length, in lanes one can follow
  float dm=(smoothstep(.62,.9,lcN2(vWp.xz*.33+uTime*.04))-.25)*dn;      // soft dimples, near the eye
  float tone=.5+.2*big+.19*sw-.1*dm, lanes=.4*lane*(.35+.65*uGrow);
  // depth by the eye: looked down into, the water is dark transparent olive umber; at a low angle and far off it pales
  // toward the sky's low band; under the rock at its rim it is darkest
  float graze=1.-clamp(vd.y,0.,1.); graze=graze*graze*smoothstep(.5,.9,graze); graze=graze*graze*smoothstep(8.,160.,d);      // the pale of the sky's band lies on it only at a low glance
  float rd=distance(vWp.xz,uRimW.xy);      // under its banks: a band inside the rim, none outside it and none where the pool runs out (uOutW: x, z, radius)
  float rim=uRimW.w*smoothstep(uRimW.z-34.,uRimW.z-2.,rd)*(1.-smoothstep(uRimW.z-2.,uRimW.z+24.,rd))*smoothstep(uOutW.z*.5,uOutW.z,distance(vWp.xz,uOutW.xy));
  vec3 deep=mix(uFloor,uPal[3],.6)*.9, mid=mix(uPal[3],uPal[5],.14+uPaleW);
  float down=mix(1.,.27,smoothstep(.05,.5,clamp(vd.y,0.,1.)));      // looked down into from any height the water is deep; only a low glance finds its pale
  vec3 col=mix(deep,mid,clamp(tone*(1.-.55*rim)*down+lanes*mix(1.,.6,smoothstep(40.,140.,d)),0.,1.));      // the lanes keep their strength in the dark near water
  col=mix(col,mix(uPal[5],uBandW,.45),clamp(graze*.8,0.,.8)*(.75+.5*(tone+lanes-.5)));
  gl_FragColor=vec4(lcAirK(col,vWp,.1),1.);      // water keeps its own tone through the air (it is the olive of the green ground already); far off it goes blue and pale as all things do
}`;function wt(v,r={}){return new a.ShaderMaterial({uniforms:{...v,uBoilW:{value:new a.Vector3(0,0,1e5)},uGrow:{value:0},uPaleW:{value:r.pale??0},uRimW:{value:new a.Vector4(0,0,1,0)},uOutW:{value:new a.Vector3(0,1e5,1)},uBandW:{value:new a.Color(r.band||Ve[6])}},vertexShader:Gt,fragmentShader:Dt})}const Et=`
attribute vec4 aB; attribute vec3 aC; uniform float uTime,uGrow; varying vec2 vUv; varying vec3 vWp; varying float vA;
void main(){
  float cyc=fract(uTime*aC.z+aB.w), life=smoothstep(0.,.18,cyc)*(1.-smoothstep(.8,1.,cyc))*smoothstep(aC.y,aC.y+.1,uGrow);
  vec2 dir=aB.xy/max(length(aB.xy),1e-3);
  vec3 pos=vec3(aB.x+dir.x*cyc*aC.x,.12,aB.y+dir.y*cyc*aC.x)+vec3(position.x,0.,position.y)*aB.z*life;
  vec4 wp=modelMatrix*vec4(pos,1.);
  vWp=wp.xyz; vUv=position.xy; vA=life;
  gl_Position=projectionMatrix*viewMatrix*wp;
}`,Kt=`
varying vec2 vUv; varying vec3 vWp; varying float vA;
${Oe}
void main(){
  float r=length(vUv), fw=fwidth(r)+1e-4;
  float ring=1.-smoothstep(.1-fw*.2,.1+fw,abs(r-.82));
  ring=mix(ring,.22*step(r,.95),smoothstep(.25,.6,fw));
  float arc=smoothstep(.2,.9,dot(vUv/max(r,1e-3),vec2(-.6,.8)));
  float al=ring*(.3+.6*arc)*vA;
  if(al<.02) discard;
  gl_FragColor=vec4(lcAir(uPal[6],vWp),al);
}`,me=-10,Te=85,lt=84,_e=80,it=[62,0,-10];async function Nt(v,r,e,u,d){const h=v.noise,z=7,m=Math.sin(Fe),T=Math.cos(Fe),w=[];for(let S=0;S<u.length-1;S++)for(const g of e){const B=oe(u[S].b,u[S+1].b,g);B>-47&&B<69&&w.push({b:B,L:S,f:g})}for(let S=0;S<2&&w.length>88;S++)for(;w.length>88;){let g=-1,B=1e9;for(let P=0;P<w.length;P++){const R=w[P],O=u[R.L+1].b-u[R.L].b;R.f>.2&&R.f<.8&&(S===1||!u[R.L].thick)&&O<B&&(B=O,g=P)}if(g<0)break;w.splice(g,1)}const j=w.length-1,y=j+z+1,A=r+1,_=new Float32Array(y*A*3),ae=new Float32Array(y*A*3),pe=[],ve=S=>S>.01?1:0;for(let S=0;S<A;S++){S%8===7&&await v.yield();const g=-100+S/r*190,B=Math.abs(g-me),P=104+6*h.n2(g*.021,3.1)+3*h.n2(g*.07,9.2),R=Math.max(0,B-4.5)/4.6,O=_e+8.5*(Math.floor(R)+J(.7,1,R-Math.floor(R)))+(g>me?2.5:0)*Math.min(R,1),re=Math.min(P,O),Q=J(P-1,P-9,O),ke=oe(10.5,19,J(14,55,B)),te=46*Math.pow(J(70,95,Math.abs(g+5)),2),le=k=>Te-ke*Math.pow(1-he(k/105,0,1),1.7)+(2.2*h.fbm2(g*.013+4,k*.012,2)+4.2*h.n2(g*.034,k*.006+2))*(1-Q*.7)+Q*2.5+te;for(let k=0;k<y;k++){const H=(S*y+k)*3;let Z,W,X=1,o=0;if(k<=j){const i=w[k],b=u[i.L];W=i.b/T+40;for(let N=0;N<3;N++)W=(i.b+m*le(W))/T;const D=J(re,re-2.5,W)*(.5+.5*J(-4,5,W)),V=he(W,-5,re),E=le(V),q=(g+b.s*5)/b.js;let C=1e3,K=0;for(let N=0;N<d.length;N++){const de=Math.abs(q-d[N])*b.js;de<C&&(C=de),q>d[N]&&(K=N)}const ie=((K*7+i.L*13+5)*2654435761>>>0)/4294967296-.5,ne=Math.exp(-(C*C)/3.2),xe=u[Math.max(i.L-1,0)],we=(N,de)=>N.a*(.5+.5*h.n2(g*.027,de*1.7+.3)*1.6),fe=i.f>.01?we(b,i.L):Math.min(we(b,i.L),we(xe,i.L-1))-.5;Z=E+(-fe+ie*.1*b.a*ve(i.f)+ne*(b.thick?.9:.15))*D,W=V,X=(1-(b.thick?.4:.2)*ne)*(i.f<.01?.5:b.thick?i.f<.2?.85:1:.72)*(.8+.2*J(-2,6,W)),o=(i.f>.8?1:0)*J(-.3,.3,h.n2(g*.09,W*.11))*(.3+.7*J(30,4,B-6))}else{const i=(k-j)/z;Z=_[(S*y+j)*3]+i*44+(1-i)*i*6*h.n2(g*.05,i*3),W=oe(re,Math.min(re,lt-6),J(.25,1,i))+(1-i)*i*3*h.n2(g*.08,5+i*2),X=.95,o=.5*(1-i)}_[H]=Z,_[H+1]=W,_[H+2]=g,ae[H]=X,ae[H+1]=o,ae[H+2]=k>j?1:Math.max(J(re-9,re-3,W),J(8,30,te))}}for(let S=0;S<r;S++)for(let g=0;g<y-1;g++){const B=S*y+g,P=B+y;pe.push(B,P,B+1,P,P+1,B+1)}const U=new a.BufferGeometry;return U.setAttribute("position",new a.BufferAttribute(_,3)),U.setAttribute("color",new a.BufferAttribute(ae,3)),U.setIndex(pe),U.computeVertexNormals(),U.computeBoundingSphere(),U}function jt(v,r,e,u){const d=o=>{const i=Math.sin(u*12.9898+o*78.233)*43758.5453;return i-Math.floor(i)},h=v/2,z=r/2,m=e/2,T=16*(1+Math.floor(d(0)*30)),w=(d(10)-.5)*.36,j=d(11)<.45?3:2,y=[[-h*(.78+.22*d(1)),-m*(.62+.3*d(2))],[h*(.3+.34*d(3)),-m],[h,-m*(.12+.4*d(4))],[h*(.62+.3*d(5)),m*(.6+.32*d(6))],[-h*(.08+.42*d(7)),m],[-h,m*(.1+.42*d(8))]],A=y.length,_=[],ae=[],pe=[],ve=o=>z*(1-.16*d(30+o)),U=o=>-z*(1-w*y[o][0]/h)*(1-.14*d(40+o)),S=o=>.3+.4*d(50+o),g=o=>[y[o][0],ve(o),y[o][1]],B=o=>[y[o][0]*.94,U(o),y[o][1]*.94],P=o=>{const i=1.02+.07*d(60+o);return[y[o][0]*i,oe(U(o),ve(o),S(o)),y[o][1]*i]},R=(o,i,b,D,V,E,q)=>{const C=i[0]-o[0],K=i[1]-o[1],ie=i[2]-o[2],ne=b[0]-o[0],xe=b[1]-o[1],we=b[2]-o[2];let fe=K*we-ie*xe,N=ie*ne-C*we,de=C*xe-K*ne;const Qe=fe*(o[0]+i[0]+b[0])+N*(o[1]+i[1]+b[1])+de*(o[2]+i[2]+b[2])>=0,ce=Qe?1:-1,De=Math.hypot(fe,N,de)||1;fe*=ce/De,N=N*ce/De-q,de*=ce/De;const Ee=Math.hypot(fe,N,de)||1;Qe?(_.push(...o,...i,...b),ae.push(...D,...V,...E)):(_.push(...o,...b,...i),ae.push(...D,...E,...V));for(let qe=0;qe<3;qe++)pe.push(fe/Ee,N/Ee,de/Ee)},O=h*(d(12)-.5)*.5,re=m*(d(13)-.5)*.5,Q=d(14)<.4,ke=Math.floor(d(15)*A),te=T+j+.5,le=[Q?3:.62,te,1],k=[O,z*.8,re],H=o=>Q&&(o===ke||o===(ke+1)%A)?3:o===(ke+3)%A?.74:1.05;for(let o=0;o<A;o++){const i=(o+1)%A;R(k,g(o),g(i),le,[H(o),te,1],[H(i),te,1],-.9)}for(let o=1;o<A-1;o++)R(B(0),B(o),B(o+1),[.5,T+.5,1],[.5,T+.5,1],[.5,T+.5,1],0);const Z=(o,i)=>d(70+o*3+i)<.42?.52:.82+.14*d(80+o+i),W=(o,i)=>(d(90+o*5+i)-.5)*.5;for(let o=0;o<A;o++){const i=(o+1)%A,b=.5+.5*d(20+o),D=ne=>T+.5+j*(.22+.56*d(100+ne))+W(ne,1),V=[Z(o,0)*.85,T+.5+W(o,0)*.4,1],E=[Z(i,0)*.85,T+.5+W(i,0)*.4,1],q=[Z(o,1),D(o),1],C=[Z(i,1),D(i),1],K=[Z(o,2),te+W(o,2)*.4,1],ie=[Z(i,2),te+W(i,2)*.4,1];R(B(o),B(i),P(i),V,E,C,b+.35),R(B(o),P(i),P(o),V,C,q,b+.35),R(P(o),P(i),g(i),q,C,ie,b),R(P(o),g(i),g(o),q,ie,K,b)}const X=new a.BufferGeometry;return X.setAttribute("position",new a.Float32BufferAttribute(_,3)),X.setAttribute("color",new a.Float32BufferAttribute(ae,3)),X.setAttribute("normal",new a.Float32BufferAttribute(pe,3)),X}function Vt(v,r,e,u,d,h,z,m,T=0,w=24){const j=Math.max((u.ns-1)/2*u.sp,.05),y=j*.9+.001,A=u.k,_=Math.sqrt(1+A*A),ae=u.sp*(u.fill??.42),pe=36;let ve=1e9;for(const U of[.5,1]){if(m&&U!==m)continue;let S=1e18;for(let g=T;g<w;g++){const B=g/24,P=oe(1,J(0,.42,B)*(1-J(.62,1,B)),h),R=u.stem*U*P,O=Math.max(u.R*U*oe(1,.3+.7*P,h),.001);for(const re of[-1,1]){const Q=6.2832*Math.max(u.turns+z*re*(1-h)-h*(1-P)*.9,.3),ke=O/A*_*(1-Math.exp(-A*Q));for(let te=0;te<=pe;te++){const le=te/pe*(R+ke);let k=Math.min(le,R),H=0,Z=1,W=0,X=O,o=0;if(le>R){const D=Math.max(1-(le-R)*A/(O*_),1e-4),V=-Math.log(D)/A,E=Math.cos(V),q=Math.sin(V),C=-A/_,K=-1/_;X=O*D,k+=-O*C+X*(C*E-K*q),H+=-O*K+X*(C*q+K*E),Z=E,W=q}else o=-j*.25*(1-Math.cos(le/Math.max(R,.001)*6.2832))*u.phase;const i=-W,b=Z;k+=i*o,H+=b*o;for(let D=-1;D<=1;D++){const V=D*j*U*X/(X+y)*(O+y)/O,E=v[0]+r[0]*k+e[0]*H+(r[0]*i+e[0]*b)*V,q=v[1]+r[1]*k+e[1]*H+(r[1]*i+e[1]*b)*V,C=v[2]+r[2]*k+e[2]*H+(r[2]*i+e[2]*b)*V;for(let K=0;K<d.length;K+=3){const ie=E-d[K],ne=q-d[K+1],xe=C-d[K+2],we=ie*ie+ne*ne+xe*xe;we<S&&(S=we)}}}}}ve=Math.min(ve,Math.sqrt(S)-ae*U)}return ve}async function Ht(v,r={}){const e=v.rng,u=he(r.detail??1,.6,1),d=!!r.inWorld,h=r.style||At(r.palette||Ve),z=new a.Group,m=new a.Group;z.add(m);const T=d?0:Math.PI/2;d?m.position.set(10,0,340):m.rotation.y=T,pt(h,T);const w=(t,s,n)=>{const c=new a.Vector3(t,s,n);return d?c.add(m.position):c.applyAxisAngle(new a.Vector3(0,1,0),T),c},j=(t,s,n)=>{const c=new a.Vector3(t,s,n).normalize();return d||c.applyAxisAngle(new a.Vector3(0,1,0),T),c},y=r.greatCurls??e.int(5,9),A=r.hand??e.sign(),_=r.twin??e.chance(.2),ae=[];{let t=-70;for(;t<110;){const s=e.chance(.4);ae.push({b:t,a:s?e.range(2.2,4.6):e.range(.1,1),s:e.range(-8,8),js:e.range(.9,2.4),thick:s}),t+=s?e.range(5.5,9.5):e.range(2.2,4.2)}ae.push({b:t,a:2,s:0,js:1})}const pe=[];{let t=-112;for(;t<120;)pe.push(t),t+=e.range(7,19)}const ve={vertexColors:!0,ledge:.45,dark:.62,moss:.7,litTop:1},U=rt(h,{...ve,side:a.DoubleSide}),S=rt(h,{vertexColors:!0,side:a.DoubleSide,ledge:.45,blade:1});{const t=j(-.86,.5,-.1);U.uniforms.uFace.value.set(t.x,t.y,t.z,.22)}const g=new a.Mesh(await Nt(v,Math.round(94*u),u>.8?[0,.14,.5,.86]:[0,.16,.84],ae,pe),U);m.add(g),await v.yield();const B=Bt(h,ve);B.uniforms.uFace.value.copy(U.uniforms.uFace.value);const P=new a.BufferGeometry;{const t=g.geometry,s=t.index.array,n=t.attributes.color.array,c=[];for(let f=0;f<s.length;f+=3)n[s[f]*3+2]+n[s[f+1]*3+2]+n[s[f+2]*3+2]>.02&&c.push(s[f],s[f+1],s[f+2]);for(const f in t.attributes)P.setAttribute(f,t.attributes[f]);P.setIndex(c),P.boundingSphere=t.boundingSphere}const R=new a.Mesh(P,B);R.renderOrder=6,m.add(R),await v.yield();const O=[];e.chance(.5);const re=[[13,5.5,8.5,Te+1.5,_e+1.95,me+5.4,.12,.2],[13,5.5,8.5,Te+1.5,_e+1.85,me-5.4,.205,.285],[15,6.4,11,Te+1,_e+17.2,me+16.5,...r.bedWindow||[.385,.455]]];for(let t=0;t<3;t++){const s=re[t],n=new a.Mesh(jt(s[0],s[1],s[2],3+t*5.1),S);n.position.set(s[3],s[4],s[5]),n.rotation.z=Fe*.5,m.add(n),await v.yield(),O.push({m:n,x:s[3],y:s[4],z:s[5],u0:s[6],u1:s[7],spin:Math.abs(e.range(.7,1.4)*e.sign()),dz:e.range(-3,3)})}await v.yield();const Q=wt(h,{band:r.band}),ke=wt(h,{pale:.3,band:r.band});Q.uniforms.uRimW.value.set(0,0,r.poolRadius??112,.75);const te=new a.Mesh(new a.CircleGeometry(r.poolRadius??112,72),Q);te.rotation.x=-Math.PI/2,m.add(te);const le=new a.Mesh(new a.PlaneGeometry(150,164,1,1),ke);le.rotation.x=-Math.PI/2,le.position.set(Te+73,lt,-5),m.add(le);const k=Re(h,"fall",{lines:4});k.uniforms.uPart.value=1,k.uniforms.uLip.value.set(Te-2.5,_e+.6,me),k.uniforms.uFoot.value.set(68,0,me);{const t=Math.round(500*u),s=new Float32Array(t*3),n=new Float32Array(t*3),c=new Float32Array(t*4),f=new Float32Array(t*4);let p=2,l=0;for(let L=0;L<7;L++,p++){const F=-.42+.84*L/6;s.set([F,1.5,e.range(0,6.28)],(p-2)*3),n.set([.5,.3,(L%2?1:-1)*1.5],(p-2)*3),c.set([0,L===3?-.5:Math.abs(F)*.8,e.range(0,6.28),1.35],(p-2)*4),f.set([-1,0,e(),0],(p-2)*4)}for(;p<t;){const L=Math.min(e.int(7,15),t-p),F=l===0?0:Math.pow(e(),.8)*.86;let I=l===0?0:e.range(-1,1)*(.3+.7*F);const ee=e.range(-1.6,1.6),ue=e.range(0,6.28),Y=e.range(1.1,2.2),be=e.range(.8,1.5),Le=e.range(1.5,3)*(l%2?1:-1),Me=e.range(.26,.4),Ae=l===0?Math.min(Me,2/(L-1)):Me,Ce=e.range(0,6.28),ze=e.range(.15,.7),Be=e();for(let Pe=0;Pe<L;Pe++,p++)s.set([I,ee,ue],(p-2)*3),n.set([Y,be,Le],(p-2)*3),c.set([(Pe-(L-1)/2)*Ae,(l===0?-.5:F)+.02*e(),Ce,Ae*e.range(.36,.5)],(p-2)*4),f.set([.25+.75*Math.pow(Pe/Math.max(L-1,1),1.5),ze,Be+Pe*.013,0],(p-2)*4);l++}const M=new a.Mesh(vt(28,{aO:[3,s],aU:[3,n],aP:[4,c],aK:[4,f]},p-2),k);M.frustumCulled=!1,m.add(M)}const H=new a.ShaderMaterial({uniforms:{...h,uGrow:k.uniforms.uGrow,uTwin:k.uniforms.uTwin,uLip:k.uniforms.uLip,uFoot:k.uniforms.uFoot,uAirK:k.uniforms.uAirK},vertexShader:Tt,fragmentShader:qt,side:a.BackSide}),Z=new a.Mesh(Ct(30,16),H);Z.frustumCulled=!1,m.add(Z),await v.yield();const W=t=>{const s={aO:[3,new Float32Array(t*3)],aU:[3,new Float32Array(t*3)],aV:[3,new Float32Array(t*3)],aP:[4,new Float32Array(t*4)],aQ:[4,new Float32Array(t*4)],aK:[4,new Float32Array(t*4)]};let n=0;return{add(c,f,p,l){const M=Math.max((l.ns-1)/2*l.sp,.05),L=f[2]*p[0]-f[0]*p[2]>=0?1:-1;l.body&&n<t&&(s.aO[1].set([c[0],c[1]-.14,c[2]],n*3),s.aU[1].set(f,n*3),s.aV[1].set(p,n*3),s.aP[1].set([l.stem,l.R,l.k,l.turns],n*4),s.aQ[1].set([0,l.birth,l.phase,M+l.sp*.9],n*4),s.aK[1].set([l.mode,-1,0,M],n*4),n++);for(let F=0;F<l.ns&&n<t;F++,n++){const I=(F-(l.ns-1)/2)*l.sp;s.aO[1].set(c,n*3),s.aU[1].set(f,n*3),s.aV[1].set(p,n*3),s.aP[1].set([l.stem,l.R,l.k,l.turns],n*4),s.aQ[1].set([I,l.birth+.03*(F/l.ns),l.phase+F*7e-4,l.sp*(l.fill??.42)],n*4),s.aK[1].set([l.mode,l.lit,(l.crown||0)*(l.mode?1:L),M],n*4)}},mesh(c,f){const p=new a.Mesh(vt(c,s,n),f);return p.frustumCulled=!1,m.add(p),p}}},X=Re(h,"lock",{lines:4,bend:.8,turnAmp:.12,ang:.45,far:.95,farLit:1,airK:.25,turn:.15*A}),o=Re(h,"lock",{lines:3,far:.8,farLit:.6,airK:.3,flow:2.2,turnAmp:.25,turnRate:.55,bend:.6,ang:.36,wave:.3,waves:1.3,waveSpeed:1.4}),i=Re(h,"lock",{lines:3,cyc:.8,turnAmp:.2}),b={lines:3,wave:.45,waves:1.4,waveSpeed:1.2,bend:.35,flow:1.6,far:.7},D=Re(h,"lock",b),V=Re(h,"lock",{...b,sqo:1}),[E,,q]=it,C=t=>[-Math.cos(t),0,Math.sin(t)],K=(t,s)=>[t[2]*s,0,-t[0]*s],ie=W(Math.round(130*u)),ne=W(Math.round(265*u)),xe=[];for(let t=0;t<y;t++){const s=(t+.5)/y,n=(A>0?oe(-1.72,1.05,s):oe(-1.05,1.72,s))+e.range(-.06,.06),c=C(n),f=e.range(4.5,7.5),p=t%2,l=[0,1,3,5,7,8,6,4,2][Math.min(t,8)]/Math.max(y-1,1),M=p?e.range(7.6,8.4):e.range(8.6,9.6),L=e.range(.2,.22),F=e.range(1.6,1.9),I=7,ee={ns:I,sp:M*e.range(.38,.42)/(I-1),stem:p?e.range(58,66):e.range(50,56),R:M,k:L,turns:F,birth:Math.min(l,1)*.72,phase:e(),mode:0,lit:e.range(.8,1),crown:.55,fill:.34,body:1};ie.add([E+c[0]*f,.22+.07*t,q+c[2]*f],c,K(c,A),ee),xe.push({t:n,reach:f+.9*ee.stem+ee.R*1.6,R:ee.R,stem:ee.stem,r0:f})}const we=Math.round(30*u),fe=[-56,110];for(let t=0;t<we;t++){const s=t%5<2,n=e.range(-1.75,1.75),c=s?e.range(14,48):e.range(50,150),f=C(n);let p=E+f[0]*c,l=q+f[2]*c;{const Be=Math.hypot(p,l);Be>96&&(p*=96/Be,l*=96/Be)}const M=fe[0]-p,L=fe[1]-l,F=Math.hypot(M,L)||1,I=J(30,95,c),ee=e.range(-.3,.3),ue=oe(f[0],M/F,I),Y=oe(f[2],L/F,I),be=Math.atan2(Y,-ue)+ee,Le=C(be),Me=e.chance(.75)?A:-A,Ae=e.range(1.9,3.5),Ce=7,ze={ns:Ce,sp:Ae*.4/(Ce-1),stem:e.range(8,19),R:Ae,k:e.range(.2,.24),turns:e.range(1.5,2.1),birth:t%2===0?-.5:.18+.7*e(),phase:e(),mode:0,lit:e.range(.6,.95),crown:.2,fill:.36,body:1};ne.add([p,.14+.002*t,l],Le,K(Le,Me),ze)}const N=Re(h,"lock",{lines:4,bend:.8,turnAmp:.15,turnRate:.4,ang:.45,turn:-.15*A});if(N.uniforms.uGrow.value=0,_){const t=W(64),s=[E-16,0,q+34];for(let n=0;n<5;n++){const c=oe(-.5,2.3,n/4)+e.range(-.1,.1),f=C(c),p=e.range(4.2,5.6),l=7;t.add([s[0]+f[0]*2.5,.95+.05*n,s[2]+f[2]*2.5],f,K(f,-A),{ns:l,sp:p*.36/(l-1),stem:n%2?e.range(10,14):e.range(5,7),R:p,k:.22,turns:e.range(1.6,1.9),birth:.12*n,phase:e(),mode:0,lit:1,crown:.3,fill:.36,body:1})}t.mesh(48,N)}ie.mesh(Math.round(96*(u*.5+.5)),X),ne.mesh(Math.round(38*(u*.5+.5)),o),await v.yield();const de=.8,Qe=.2,ce=[];if(r.way)for(let t=0;t<r.way.length;t+=3){const s=r.way[t]-m.position.x,n=r.way[t+1]-m.position.y,c=r.way[t+2]-m.position.z;Math.hypot(s-it[0],c-it[2])<45&&ce.push(s,n,c)}const De=W(Math.round(160*u)),Ee=Math.round(15*u);for(let t=0;t<Ee;t++){const s=oe(-1.5,1.5,(t+e())/Ee),n=C(s),c=e.range(2.5,8),f=e.range(1,1.32),p=Math.cos(f),l=Math.sin(f),M={ns:e.int(8,11),sp:e.range(.16,.21),stem:e.range(9,14.5),R:e.range(3,4.6),k:e.range(.22,.28),turns:e.range(1.5,2.1),birth:.1+.6*e(),phase:e(),mode:1,lit:e.range(.7,1),crown:0,fill:.42},L=[E+2+n[0]*c,-.5,q+n[2]*c],F=[n[0]*p,l,n[2]*p],I=[n[0]*l,-p,n[2]*l];if(ce.length){const ee=M.stem+2.6*M.R+4.5,ue=[];for(let Y=0;Y<ce.length;Y+=3)Math.hypot(ce[Y]-L[0],ce[Y+1]-L[1],ce[Y+2]-L[2])<ee&&ue.push(ce[Y],ce[Y+1],ce[Y+2]);for(let Y=0;Y<18&&ue.length;Y++){let be=1e9;for(const Le of[.5,1])for(const Me of[0,12])be=Math.min(be,Vt(L,F,I,M,ue,de,Qe,Le,Me,Me+12)),await v.yield();if(be>=3.2)break;M.stem*=.9,M.R*=.9,await v.yield()}await v.yield()}De.add(L,F,I,M)}De.mesh(30,i);const qe=Math.round(3e3*u),ct=new a.ShaderMaterial({uniforms:{...h,uGrow:{value:1}},vertexShader:Et,fragmentShader:Kt,transparent:!0,depthWrite:!1,side:a.DoubleSide});{const t=new Float32Array(qe*4),s=new Float32Array(qe*3);for(let f=0;f<qe;f++){const p=e.int(0,5),l=f%5===4,M=l||e.chance(.22),L=l?e.range(-1.3,1.3):e.range(-2,2);let F=l?e.range(40,165):M?e.range(20,62):4.5+p*2.7+e.gauss()*.28;if(l){const I=Math.hypot(E-Math.cos(L)*F,q+Math.sin(L)*F);I>100&&(F*=100/I*.8)}t.set([-Math.cos(L)*F,Math.sin(L)*F,l?e.range(.3,.75):M?e.range(.2,.5):e.range(.22,.8),e()],f*4),s.set([l?e.range(4,9):M?e.range(2,6):e.range(.6,2.2),l?-1:M?.3+.6*e():e()*.5,l?e.range(.03,.07):e.range(.05,.14)],f*3),f%600===599&&await v.yield()}const n=new a.InstancedBufferGeometry;n.setAttribute("position",new a.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),3)),n.setIndex([0,1,2,0,2,3]),n.setAttribute("aB",new a.InstancedBufferAttribute(t,4)),n.setAttribute("aC",new a.InstancedBufferAttribute(s,3)),n.instanceCount=qe,n.boundingSphere=new a.Sphere(new a.Vector3,1e5);const c=new a.Mesh(n,ct);c.position.set(E,0,q),c.frustumCulled=!1,c.renderOrder=3,m.add(c)}await v.yield();const ge=new a.Group;z.add(ge);const gt=new a.ShaderMaterial({uniforms:{...h,uBandW:{value:new a.Color(r.band||Ve[6])}},side:a.DoubleSide,vertexShader:`attribute float aH; varying vec3 vWp; varying float vH;
      void main(){ vec4 wp=modelMatrix*vec4(position,1.); vWp=wp.xyz; vH=aH; gl_Position=projectionMatrix*viewMatrix*wp; }`,fragmentShader:`varying vec3 vWp; varying float vH; uniform vec3 uBandW;
      ${Oe}
      void main(){
        float d=distance(vWp,cameraPosition); vec3 vd=(cameraPosition-vWp)/max(d,1e-3);
        float big=lcN2(vWp.xz*.021+7.)*.6+lcN2(vWp.xz*.09)*.4;
        float down=mix(1.,.27,smoothstep(.05,.5,clamp(vd.y,0.,1.)));
        vec3 col=mix(mix(uFloor,uPal[3],.6)*.9,mix(uPal[3],uPal[5],.14),clamp((.5+.2*big)*down,0.,1.));      // the level water's own tone by the eye's angle, so the foot has no edge
        float graze=1.-clamp(vd.y,0.,1.); graze=graze*graze*smoothstep(.5,.9,graze); graze=graze*graze*smoothstep(8.,160.,d);
        float h=clamp(vH,0.,1.4);
        col=mix(col,mix(uPal[5],uBandW,.45),clamp(graze*.8,0.,.8)*(.75+.5*.2*(big-.5))*(1.-smoothstep(.1,.5,h)));
        col=mix(col,mix(uFloor,uPal[3],.52),clamp(smoothstep(.2,.8,h)*.9+smoothstep(1.02,1.3,h),0.,1.));   // olive umber up the back, under the crest and down the front
        gl_FragColor=vec4(lcAirK(col,vWp,.1),1.);
      }`});let $e=null;const Ue=new a.Group;ge.add(Ue);const Ze=Re(h,"lock",{lines:3,cyc:.3,bend:.2,ang:.2,flow:1.6,far:.6});{const p=[[-17.5,-.45,0],[-15,0,0],[-10,.945,.37],[-5,1.89,.74],[-1.4,2.57,1],[.2,2.8,1.02],[1.4,2.6,1.08],[2.1,1.9,1.2],[2.3,1,1.3],[2.1,.3,1.3],[1.9,-.5,1.3]],l=x=>Math.pow(Math.max(1-Math.pow(Math.abs(x)/30,2.5),0),.6),M=x=>7*(1-x/30*(x/30)),L=[],F=[],I=[],ee=p.length;for(let x=0;x<=40;x++){const G=-30+60*x/40,se=l(G);for(let $=0;$<ee;$++)L.push(G,p[$][1]*(p[$][1]>0?se:1),p[$][0]*(.5+.5*se)+M(G)),F.push(p[$][2]*(.35+.65*se))}for(let x=0;x<40;x++)for(let G=0;G<ee-1;G++){const se=x*ee+G,$=se+ee;I.push(se,se+1,$,$,se+1,$+1)}const ue=new a.BufferGeometry;ue.setAttribute("position",new a.Float32BufferAttribute(L,3)),ue.setAttribute("aH",new a.Float32BufferAttribute(F,1)),ue.setIndex(I),ue.computeBoundingSphere(),$e=new a.Mesh(ue,gt),ge.add($e);const Y=u*.5+.5,be=W(112),Le=W(40),Me=W(112),Ae=x=>{const G=Math.hypot(x[0],x[1],x[2])||1;return[x[0]/G,x[1]/G,x[2]/G]},Ce=14,ze=7;for(let x=0;x<Ce;x++){const G=-27.5+55*(x+.5)/Ce,se=l(G),$=.5+.5*se,Se=G>=0?-1:1,Ke=[G,.16,-15*$+M(G)],Ne=[G,2.57*se+.16,-1.4*$+M(G)],at=[0,Ne[1]-Ke[1],Ne[2]-Ke[2]],dt=Math.hypot(at[1],at[2])*.35/Math.sin(.35),Mt=dt*(1-Math.cos(.35))/.35,zt=e.range(2.3,2.7)/(ze-1),kt=e.range(.7,.95),ht=e();be.add(Ke,Ae(at),[Se,0,0],{ns:ze,sp:zt,stem:dt,R:.3,k:.25,turns:.5,birth:.35*e(),phase:ht,mode:0,lit:kt,crown:.12,fill:.4,body:1});const Ge=Ae([.1*Se,1,.2]),je=[Se*.92,0,.38],nt=je[0]*Ge[0]+je[1]*Ge[1]+je[2]*Ge[2],Lt=Ae([je[0]-nt*Ge[0],je[1]-nt*Ge[1],je[2]-nt*Ge[2]]),st=e.range(1.45,1.75)*(.72+.28*se);Me.add([G+Se*Mt,Ne[1]-.25,Ne[2]+.15],Ge,Lt,{ns:ze,sp:st*.44/(ze-1),stem:st*e.range(.5,.62),R:st,k:.23,turns:e.range(1.7,2),birth:x%3===1?.8+0*e():.2+.4*e(),phase:ht,mode:1,lit:1,crown:0,fill:.44,body:1})}for(let x=0;x<5;x++){const G=-22+44*(x+e.range(.3,.7))/5,se=.5+.5*l(G),$=G/30*.05+e.range(-.02,.02)*.3,Se=Math.hypot($,1),Ke=x%2?1:-1,Ne=e.range(1.8,2.6);Le.add([G,.2+.01*x,(-15+1.2)*se+M(G)],[$/Se,0,-1/Se],[-Ke/Se,0,-Ke*$/Se],{ns:ze,sp:e.range(2.5,3.1)*.82/(ze-1),stem:36+3.5*(x*3%5)+e.range(0,1.5),R:Ne,k:.24,turns:e.range(1.5,2),birth:.5*e(),phase:e(),mode:0,lit:.85,crown:.15,fill:.36,body:1})}for(let x=0;x<23;x++)e();const Be=be.mesh(24,D);m.remove(Be),ge.add(Be);const Pe=Le.mesh(24,V);m.remove(Pe),Ue.add(Pe);const ft=Me.mesh(Math.round(40*Y),Ze);m.remove(ft),ge.add(ft)}d?ge.position.set(-64,0,520):(ge.position.copy(w(-25,0,78)),ge.rotation.y=T);let Xe=null;(r.apron??!d)&&(Xe=new a.Mesh(new a.CircleGeometry(1500,48),Q),Xe.rotation.x=-Math.PI/2,Xe.position.y=-.3,m.add(Xe)),await v.yield();const Je=r.viewRadius??null,et=r.viewCentre??null;let Ye=r.progress??.44,He=r.bore??(d?0:1),Ie=1,ye=0,tt=1,ot=_&&!d?1:0;const We=new a.Vector3,xt=Math.cos(Fe),yt=Math.sin(Fe),ut=()=>{const t=J(0,1,he((Ye-.1)/.24,0,1)),s=J(0,1,he((Ye-.1)/.17,0,1));k.uniforms.uGrow.value=t,X.uniforms.uGrow.value=s,o.uniforms.uGrow.value=s,i.uniforms.uGrow.value=he((t-.12)/.88,0,1),ct.uniforms.uGrow.value=.25+.75*t,Q.uniforms.uGrow.value=.45+.55*t,D.uniforms.uGrow.value=He,Ze.uniforms.uGrow.value=He*(1-.3*ye),ge.scale.set(1,Math.max(He,.001),1-.6*ye),Ze.uniforms.uSize.value=1+.3*ye,D.uniforms.uLit.value=1-.6*ye,D.uniforms.uWave.value.x=.45*(1-.95*ye),D.uniforms.uFar.value=oe(.7,.16,ye),D.uniforms.uPaleB.value=1-.9*ye,D.uniforms.uTin.value=oe(.05,.16,ye),Ue.scale.z=1/ge.scale.z,Ue.position.z=-6.9*(1-Ue.scale.z),V.uniforms.uWave.value.x=.45*(1-.6*ye)*(1-.75*tt),V.uniforms.uStem.value=oe(.36,1,tt),D.uniforms.uSqz.value=Ie,V.uniforms.uSqz.value=Ie,V.uniforms.uGrow.value=He,Ze.uniforms.uSqz.value=Ie,$e.scale.x=Ie,k.uniforms.uTwin.value=ot,N.uniforms.uGrow.value=ot;for(let n=0;n<3;n++){const c=O[n],f=he((Ye-c.u0)/(c.u1-c.u0),0,1),p=Math.min(f/.3,1),l=Math.max(0,(f-.3)/.7),M=7*p*p;c.m.position.set(c.x-xt*M-12*l,c.y-yt*M-(n===2?101:80)*l*l,c.z+(c.dz+(n===2?14:0))*l),c.m.rotation.z=Fe*.5+c.spin*l*(n===2?1.3:.4),c.m.rotation.x=(n===2?.4:.15)*c.spin*l}};ut();const bt={poolCentre:w(0,0,0),boil:w(E,0,q),fallFoot:w(68,0,me),notchLip:w(Te-2.5,_e,me),lakeLevel:lt,damFace:{point:w(Te-4,50,me),normal:j(-1,.1,0)},flow:j(-1,0,0),flyThrough:[[-10,68,-125],[24,42,-70],[58,24,-18],[28,9,20],[-20,7,58],[-62,8,110]].map(t=>w(t[0],t[1],t[2])),viewpoints:{reveal:w(24,42,-70),closest:w(58,24,-18),skim:w(10,8,40)},lookAt:{column:w(72,30,me),flower:w(E-22,0,q)},greatCurls:xe.map(t=>{const s=C(t.t),n=K(s,A),c=t.r0+.897*t.stem-.717*t.R,f=.379*t.stem+.697*t.R;return{centre:w(E+s[0]*c+n[0]*f,0,q+s[2]*c+n[2]*f),radius:t.R,reach:t.reach}}),bedWindows:O.map(t=>[t.u0,t.u1]),boreRun:[w(-80,0,180),w(-84,0,260),w(-84,0,350)],portalSeat:{position:w(-84,12,350),facing:j(0,0,-1)}};return{object:z,radius:r.viewRadius??Je??55,height:Je?Je*1.2:105,center:et==="fall"?w(71,30,me):et==="pool"?w(34,2,4):et==="bore"?w(-25,3,84):w(42,30,-6),anchors:bt,bore:ge,ground:!1,groundY:0,hand:A,greatCurls:y,twin:_,style:h,poolMaterial:Q,setProgress(t){Ye=t},setBore(t,s=60,n=0,c=1){He=he(t,0,1),Ie=he(s/60,.25,1),ye=he(n,0,1),tt=he(c,0,1)},setTwin(t){ot=_?he(t,0,1):0},update(t,s,n){h.uTime.value=s,We.set(E,0,q).applyMatrix4(m.matrixWorld),Q.uniforms.uBoilW.value.copy(We),We.set(0,0,0).applyMatrix4(m.matrixWorld),Q.uniforms.uRimW.value.x=We.x,Q.uniforms.uRimW.value.y=We.z,We.set(fe[0],0,fe[1]).applyMatrix4(m.matrixWorld),Q.uniforms.uOutW.value.set(We.x,We.z,78),ut()},dispose(){N.dispose(),Z.geometry.dispose(),H.dispose()}}}export{Ut as PAL,Ve as PALETTE,Oe as STYLE_GLSL,Ht as buildHero,Bt as contourShellMaterial,rt as glazeMaterial,At as makeStyle,pt as setStyleYaw,jt as slabGeometry,vt as strandGeometry,Re as strandMaterial,wt as waterMaterial};
