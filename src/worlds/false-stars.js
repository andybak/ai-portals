import*as t from"three";import{makePath as U0,clamp as Ne,lerp as G,smoothstep as S,makeRng as gt}from"../kit/core.js";import{makeSky as j0}from"../kit/sky.js";import*as I0 from"../kit/fauna.js";import{buildHero as H0}from"../parts/false-stars.js";const Zo=["#03070B","#0D1F2C","#4FE0D6","#0B1638","#9DB2C6","#27473F","#E4EEF8"],p=t.Vector3,Ce=Math.PI*2,ae=Math.PI/180,we=-112,io=(k,j=1)=>new t.Color(k).multiplyScalar(j),Q0=(k,j)=>3.2*Math.sin(k*.023+1.3)+2.4*Math.sin(j*.019+.4)+1.3*Math.sin((k+j)*.047+2),Ct=`
float h31(vec3 p){ p=fract(p*vec3(.1031,.1030,.0973)); p+=dot(p,p.yxz+33.33); return fract((p.x+p.y)*p.z); }
float vn3(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  float a=h31(i), b=h31(i+vec3(1,0,0)), c=h31(i+vec3(0,1,0)), d=h31(i+vec3(1,1,0));
  float e=h31(i+vec3(0,0,1)), g=h31(i+vec3(1,0,1)), h=h31(i+vec3(0,1,1)), k=h31(i+vec3(1,1,1));
  return mix(mix(mix(a,b,f.x),mix(c,d,f.x),f.y),mix(mix(e,g,f.x),mix(h,k,f.x),f.y),f.z); }
`,ze=`
uniform vec3 uMoonDir, uMoonCol, uAmbCol, uMistCol;
uniform vec4 uMist;        // density at y0, y0 (world), falloff per metre, uniform haze density
uniform float uTime, uOutGain;
${Ct}
vec3 mistApply(vec3 col, vec3 wp){
  vec3 dv=wp-cameraPosition; float d=length(dv);
  float t=clamp(uMist.z*dv.y,-9.0,9.0);
  float f=abs(t)>1e-3 ? (1.0-exp(-t))/t : 1.0;
  float od=uMist.x*exp(-clamp(uMist.z*(cameraPosition.y-uMist.y),-5.0,12.0))*d*f+uMist.w*d;
  float k=1.0-exp(-max(od,0.0));
  vec3 V=dv/max(d,1e-3);
  float g=max(dot(V,uMoonDir),0.0);
  return mix(col,uMistCol*(0.72+1.25*g*g*g),clamp(k,0.0,1.0));
}
`,$0=`
attribute float aShade, aCut, aD; attribute vec4 aC;
varying vec3 vP, vN; varying float vS, vCut, vD; varying vec4 vC;
void main(){ vP=(modelMatrix*vec4(position,1.0)).xyz; vN=normal; vS=aShade; vC=aC; vCut=aCut; vD=aD; gl_Position=projectionMatrix*viewMatrix*vec4(vP,1.0); }`,Y0=`
uniform vec3 uLip, uF, uR, uWormC;
uniform float uFalls;
varying vec3 vP, vN; varying float vS, vCut, vD; varying vec4 vC;
${ze}
void main(){
  if(vCut>0.5) discard;
  vec3 q=vP-uLip; float kk=dot(q,uF), xx=dot(q,uR);
  if(kk<9.0 && kk>-40.0 && abs(xx)<8.5 && q.y>-6.0 && q.y<12.0) discard;          // the cave mouth
  vec3 N=vN/max(length(vN),1e-4);
  float dC=length(cameraPosition-vP), fa=smoothstep(90.0,330.0,dC), fb=smoothstep(14.0,70.0,dC);
  float built=clamp(vC.w,0.0,1.0);
  float n1=vn3(vP*0.07), n2=vn3(vP*0.31+3.1);
  float fine=mix(vn3(vP*3.7),0.5,fb);
  float rockK=smoothstep(0.22,0.5,1.0-N.y);
  float ib=floor(vC.x), fbed=vC.x-ib;
  float hsh=h31(vec3(ib,3.0,7.0));
  // painted beds, only where no ledge is built (the far gorge): a paler band along the top of each bed whose edge wanders,
  // and a soft shade under it. No outline, no fault, no curtain.
  float lipN=(vn3(vec3(vP.x*0.21,ib*1.7,vP.z*0.21))-0.5)*0.18+(n2-0.5)*0.09;
  float dcap=0.84+0.07*hsh-fbed+lipN;
  float capP=(1.0-smoothstep(-0.06,0.06,dcap))*(1.0-built);
  float underP=smoothstep(0.0,0.07,dcap)*exp(-max(dcap,0.0)/0.24)*(1.0-built)*0.45;
  float tread=max(vC.z*built,capP);
  float crev=mix(1.0,clamp(vC.y,0.0,1.0),built);
  // on a built ledge vD runs 0 (foot of the face) .. 1 (its lip) .. 2 (the back of its tread). The nose of every bed leans out,
  // so the lower half of its face is an overhang's hollow: darker, and here and there lit from inside by glow-worms
  float qf=vD, faceK=built*(1.0-smoothstep(0.98,1.04,qf));
  float under=faceK*(1.0-smoothstep(0.05,0.55,qf));
  crev*=mix(1.0,0.42,under);
  float lipA=smoothstep(0.6,0.9,vC.y);                 // (a lip is open to the sky; the seam at the back of a tread, where vD also passes 1, is not)
  float lipHi=built*smoothstep(0.8,0.97,qf)*(1.0-smoothstep(1.0,1.2,qf))*lipA;
  // the rock: every bed its own tone, mottled and pitted; the rain's flutes (karren) and thin partings on the faces
  float karst=vn3(vec3(vP.x*0.55+n1*1.5,vP.y*0.05+ib*3.0,vP.z*0.55));
  float karstF=mix(0.5,vn3(vec3(vP.x*2.1,vP.y*0.12+ib,vP.z*2.1)),1.0-fb);
  float mott=vn3(vP*0.83+5.0), mott2=vn3(vP*0.27+11.0);
  float thin=abs(fract(vC.x*4.0+0.4*n2+0.25*mott)-0.5)*2.0;
  float parting=(1.0-smoothstep(0.0,0.22,thin))*(1.0-fa)*0.3*(1.0-tread);
  float streakN=vn3(vec3(vP.x*0.42,vP.y*0.035,vP.z*0.42)+n1*1.5);
  float streak=smoothstep(0.58,0.8,streakN);
  vec3 rock=mix(vec3(0.036,0.043,0.056),vec3(0.082,0.094,0.112),0.2+0.36*hsh+0.2*n1+0.24*mott2)*(0.84+0.32*fine);
  // (a built wall is never one grey: each bed has its own tone, ochre where lichen has it, dark where water runs, pale at the lips)
  rock*=mix(vec3(1.0),mix(vec3(0.62,0.66,0.74),vec3(1.34,1.2,0.92),smoothstep(0.25,0.75,hsh*0.6+mott2*0.4)),built*0.8);
  rock*=1.0+0.4*lipHi;
  rock*=(1.0-0.42*streak*(1.0-tread))*(1.0-parting);
  rock*=mix(1.0,(0.8+0.4*karst)*(0.86+0.28*mott)*(0.86+0.28*karstF),(1.0-0.75*fa)*(1.0-tread));
  rock*=mix(1.0,1.12,tread);
  // growth: bush on the flats; on a built ledge moss only where it has taken, in patches (the ferns stand on it as tufts)
  float take=smoothstep(0.36,0.6,vn3(vec3(vP.x*0.05+7.0,ib*2.3,vP.z*0.05))*0.7+0.3*n2);
  float lvl=1.0-rockK;
  float veg=clamp(lvl*mix(1.0,take,vC.z*built)+rockK*capP*take,0.0,1.0);
  // hanging ferns and moss: festoons that hang from a lip down the face below it, ragged, in runs along the ledge
  float alongN=vn3(vec3(vP.x*0.31+3.0,ib*1.9,vP.z*0.31)), frondN=vn3(vec3(vP.x*2.4,vP.y*0.5,vP.z*2.4)), frond2=mix(vn3(vec3(vP.x*6.5,vP.y*0.9,vP.z*6.5)),0.5,fb);
  float hl=(0.08+0.5*smoothstep(0.3,0.75,alongN))*(0.55+0.9*frondN);
  float hang=faceK*smoothstep(1.0-hl,1.0-hl*0.55,qf+0.07*(frond2-0.5))*smoothstep(0.3,0.55,alongN+0.3*take)*smoothstep(0.45,0.8,vC.y);
  veg=max(veg,hang*0.94);
  vec3 bush=mix(vec3(0.014,0.045,0.032),vec3(0.03,0.085,0.048),n2)*(0.7+0.6*fine)*(0.75+0.5*mott);
  vec3 alb=mix(rock,bush,veg);
  float shadow=underP*rockK;
  // built faces carry their own normals; the painted ones are stood a little upright so they take the moon as faces
  vec2 hz=N.xz/max(length(N.xz),1e-3);
  vec3 Nc=mix(N,mix(vec3(hz.x,0.12,hz.y),vec3(0.0,1.0,0.0),capP),rockK*(1.0-0.6*fa)*(1.0-built)*0.7);
  vec3 Nb=Nc+vec3((streakN-0.5)*0.2,0.0,(n2-0.5)*0.2)*rockK+vec3(fine-0.5)*0.2;
  Nb+=vec3(hz.y,0.0,-hz.x)*((karst-0.5)*0.8+(karstF-0.5)*0.55+(mott-0.5)*0.3)*rockK*(1.0-tread)*(1.0-0.8*fa);   // flutes and hollows turn the face from side to side
  Nb=Nb/max(length(Nb),1e-3);
  vec3 V=cameraPosition-vP; V=V/max(length(V),1e-3);
  float nl=max(dot(Nb,uMoonDir),0.0);
  float lee=1.0-smoothstep(-0.25,0.35,dot(N,uMoonDir));                           // the wall the moon never reaches
  vec3 Hh=uMoonDir+V; Hh=Hh/max(length(Hh),1e-3);
  float sp=max(dot(Nb,Hh),0.0); sp*=sp; sp*=sp; sp*=sp; sp*=sp; sp*=sp;
  float wet=rockK*(1.0-veg)*(0.25+0.75*streak)*(1.0+1.2*uFalls);
  vec3 col=alb*(uMoonCol*nl*vS*(0.25+0.75*crev)*(1.0-0.9*shadow)+uAmbCol*(0.4+0.6*(Nb.y*0.5+0.5))*(1.0+(0.9+2.3*min(uMoonCol.g,1.0))*lee)*crev*(1.0-0.85*shadow))+uMoonCol*sp*wet*vS*0.7*(1.0-shadow)*crev;
  col*=1.0-uFalls*rockK*(1.0-veg)*(0.24+0.26*smoothstep(0.35,0.75,streakN));                 // after rain the faces are dark with running water
  col+=uWormC*(under*(1.0-veg)*smoothstep(0.5,0.78,vn3(vec3(vP.x*0.1+9.0,ib*3.1,vP.z*0.1)))*(0.6+0.8*fine));     // the glow of a colony under an overhang
  gl_FragColor=vec4(mistApply(col*uOutGain,vP),1.0);
}`,X0=`
varying vec3 vP;
void main(){ vP=(modelMatrix*vec4(position,1.0)).xyz; gl_Position=projectionMatrix*viewMatrix*vec4(vP,1.0); }`,Z0=`
uniform vec3 uFoot, uSkyLow, uSkyHigh, uF;
uniform float uGlit;
varying vec3 vP;
${ze}
void main(){
  vec3 V=cameraPosition-vP; float dist=max(length(V),1e-3); V/=dist;
  vec2 p=vP.xz; vec2 q=p-uFoot.xz; float r=length(q); vec2 rd=q/max(r,0.05);
  float boil=exp(-r*0.09);
  float ring=sin(r*0.95-uTime*3.4+2.0*vn3(vec3(p*0.11,uTime*0.2)))*exp(-r*0.035);
  float w1=sin(dot(p,vec2(0.71,0.43))*1.3+uTime*1.1), w2=sin(dot(p,vec2(-0.38,0.92))*2.1-uTime*1.5), w3=vn3(vec3(p*0.9,uTime*0.7))-0.5;
  vec2 sl=rd*ring*0.22+vec2(w1*0.03+w3*0.09,w2*0.03-w3*0.07)*(1.0+2.5*boil);
  vec3 N=vec3(-sl.x,1.0,-sl.y); N=N/max(length(N),1e-3);
  vec3 R=reflect(-V,N); R.y=abs(R.y);
  float c1=1.0-clamp(dot(N,V),0.0,1.0); float fr=0.04+0.96*c1*c1*c1*c1;
  float up=1.0-clamp(R.y,0.0,1.0);
  vec3 sky=mix(uSkyHigh,uSkyLow,up*up*up);
  vec3 col=vec3(0.0015,0.003,0.005)+sky*fr;
  // broken moonlight: glints wherever a facet tips the moon into the eye, wide and sparse, densest toward the moon side
  float lobe=max(dot(R,uMoonDir),0.0); float l2=lobe*lobe;
  float sparkA=vn3(vec3(p*0.6,uTime*1.1)), sparkB=mix(vn3(vec3(p*1.7+9.0,uTime*1.9)),0.5,smoothstep(50.0,130.0,dist));
  float glit=smoothstep(0.74,0.9,sparkA*0.6+sparkB*0.4+l2*0.22+boil*0.08)*(0.25+0.75*l2*l2);
  glit+=l2*l2*l2*l2*0.6;
  col+=uMoonCol*glit*uGlit;
  float turb=vn3(vec3(p*0.42,uTime*0.5))*0.6+vn3(vec3(p*1.1+4.0,uTime*0.9))*0.4;
  float foam=smoothstep(0.25,1.0,boil*1.7*(0.55+0.9*turb))+max(ring,0.0)*boil*0.5;
  foam+=smoothstep(0.62,0.9,vn3(vec3(p*vec2(0.5,0.5)+uF.xz*uTime*1.1,3.0))*0.6+vn3(vec3(p*1.3+uF.xz*uTime*1.6,7.0))*0.4)*0.07*smoothstep(24.0,40.0,r);
  col+=(uMoonCol*0.33+uAmbCol*1.4)*clamp(foam,0.0,1.5);
  // seen from high above the river is a silver thread: a broad broken sheen of the moonlit sky, in drifting riffles
  float high=smoothstep(26.0,70.0,dist)*smoothstep(20.0,44.0,r);
  float rif=smoothstep(0.42,0.8,vn3(vec3(p*vec2(0.21,0.21)+uF.xz*uTime*0.8,1.0))*0.55+vn3(vec3(p*0.62+uF.xz*uTime*1.3,5.0))*0.45);
  col+=(uMoonCol*vec3(0.085,0.1,0.125)+uSkyLow*0.5)*high*(0.24+1.15*rif)*uGlit;
  gl_FragColor=vec4(mistApply(col*uOutGain,vP),1.0);
}`,J0=`
attribute vec3 iPos; attribute vec4 iScl, iCol;     // iScl: sx, sy, sz, yaw   iCol: rgb, moon shade
uniform float uLump; uniform vec3 uFoot;
varying vec3 vP, vN, vC; varying float vS, vH;
${ze}
void main(){
  vec3 p=position; vec3 n=normal;
  float seed=fract(iPos.x*0.137+iPos.z*0.291)*40.0;
  float l=vn3(position*1.7+seed)+0.55*vn3(position*3.9+seed*1.7);
  p*=1.0+uLump*(l-0.78)*0.72;
  if(uLump>0.5 && p.y<0.0) p.y*=0.4;
  vH=position.y;
  p*=iScl.xyz; n/=max(iScl.xyz,vec3(0.05));
  float c=cos(iScl.w), s=sin(iScl.w);
  p.xz=vec2(c*p.x+s*p.z,-s*p.x+c*p.z); n.xz=vec2(c*n.x+s*n.z,-s*n.x+c*n.z);
  vec3 wp=iPos+p;
  float gust=exp(-length(iPos.xz-uFoot.xz)*0.012)*1.2+0.25;
  float hk=clamp(p.y/max(iScl.y,0.5)+0.4,0.0,1.6);
  wp.xz+=vec2(sin(uTime*0.9+iPos.x*0.07+p.y*0.3),cos(uTime*0.7+iPos.z*0.06+p.x*0.25))*0.22*gust*hk;
  wp.y+=sin(uTime*1.3+iPos.x*0.05+iPos.z*0.04+p.x*0.5)*0.14*gust*hk;
  vP=wp; vN=n; vC=iCol.rgb; vS=iCol.a;
  gl_Position=projectionMatrix*viewMatrix*vec4(wp,1.0);
}`,ea=`
uniform float uLump, uFrost;
varying vec3 vP, vN, vC; varying float vS, vH;
${ze}
void main(){
  vec3 N=vN/max(length(vN),1e-4);
  float n1=vn3(vP*0.9), n2=vn3(vP*2.7+5.0);
  vec3 V=cameraPosition-vP; float dC=length(V); V=V/max(dC,1e-3);
  float facing=abs(dot(N,V)), lodC=1.0-smoothstep(260.0,520.0,dC);
  // a crown is boughs and sprays of leaves with dark air between them: its rim is eaten into a broken, leafy outline, holes
  // open in it (the far side of the crown shows through them, in its own shade), and its surface is clumps of lit leaves
  // with blue-black gaps. Far down the gorge, where a spray is under a pixel, it closes up again.
  float cut=vn3(vP*0.5+11.0)*0.5+vn3(vP*1.3+3.0)*0.32+n2*0.18;
  float rimE=(1.0-facing)*(1.0-facing);
  if(uLump>0.5 && cut<(0.3+0.44*rimE)*lodC) discard;
  float inside=gl_FrontFacing?0.0:1.0; if(inside>0.5) N=-N;
  vec3 Nb=N+(vec3(n1,n2,vn3(vP*1.7+9.0))-0.5)*1.2+(vec3(vn3(vP*4.1+2.0),vn3(vP*4.1+7.0),vn3(vP*4.1+13.0))-0.5)*0.7*lodC; Nb=Nb/max(length(Nb),1e-3);
  float leaf=vn3(vP*6.3+3.0);
  float clump=smoothstep(0.3,0.68,vn3(vP*1.05+17.0)*0.55+n2*0.3+leaf*0.15);
  float gap=mix(1.0,0.12+0.88*clump,0.85*lodC);                                           // dark between the clumps
  float ao=mix(smoothstep(-0.5,0.9,vH),1.0,1.0-uLump)*(0.3+0.7*smoothstep(0.25,0.7,n1*0.6+n2*0.4))*(0.7+0.5*leaf)*gap*mix(1.0,0.22,inside);
  float nl=max(dot(Nb,uMoonDir)*0.86+0.14,0.0);
  float rim=1.0-clamp(dot(N,V),0.0,1.0); rim*=rim;
  vec3 alb=vC*(0.5+1.0*n2)*(0.7+0.7*smoothstep(0.45,0.85,leaf));
  alb=mix(alb,vec3(0.34,0.38,0.42),uFrost*smoothstep(0.1,0.8,Nb.y)*0.7);
  vec3 col=alb*ao*(uMoonCol*nl*vS*2.9+uAmbCol*(0.6+0.75*(Nb.y*0.5+0.5)))+uMoonCol*vS*rim*nl*0.08*ao;
  gl_FragColor=vec4(mistApply(col*uOutGain,vP),1.0);
}`,ta=`
attribute vec4 aF; attribute vec3 iPos; attribute vec4 iPar, iCol;   // iPar: crown radius, trunk height, lift 0..1, phase  iCol: rgb, shade
attribute vec3 iLean;                                               // lean x, lean z, silver 0..1
uniform vec3 uFoot;
varying vec3 vP, vN, vC; varying vec2 vUV; varying vec3 vK;          // vK: shade, silver flash, trunk flag
${ze}
void main(){
  float R=iPar.x, lift=iPar.z, ph=iPar.w*6.2832;
  float gust=exp(-length(iPos.xz-uFoot.xz)*0.013)*1.15+0.22;
  vec3 wp; vec3 n; float flash=0.0;
  if(aF.w<0.0){                                                       // trunk: a tapering, slightly bulged column
    float yy=aF.y;                                                    // 0 at the crown, 1 at the ground
    float rr=R*(0.05+0.035*yy+0.03*lift*(1.0-smoothstep(0.0,0.14,yy)));
    wp=iPos+vec3(cos(aF.x)*rr,-yy*iPar.y,sin(aF.x)*rr)-vec3(iLean.x,0.0,iLean.y)*yy*iPar.y;
    n=vec3(cos(aF.x),0.15,sin(aF.x));
    vUV=vec2(0.0,yy);
  } else {
    float v=aF.y, az=aF.x+ph;
    float heave=sin(uTime*(0.8+0.5*aF.w)+ph+aF.x*2.0+iPos.x*0.05)*0.5+0.5*sin(uTime*2.3+aF.w*17.0+ph);
    float e0=mix(0.42,1.12,lift)+0.20*gust*heave*(0.4+0.6*aF.w);
    float cc=mix(1.55,0.95,lift)+0.25*(aF.w-0.5);
    float e=e0-cc*v;
    float rad=(sin(e0)-sin(e))/cc, hh=(cos(e)-cos(e0))/cc;
    vec2 d2=vec2(cos(az),sin(az));
    float wdt=(0.03+0.17*sin(3.1416*pow(clamp(v,0.0,1.0),0.75)))*mix(1.0,0.75,lift);
    float tw=0.35*gust*heave*v;                                       // the downdraught rolls the blade
    vec3 across=vec3(-d2.y,0.0,d2.x)*cos(tw)+vec3(d2.x*-sin(e),cos(e),d2.y*-sin(e))*sin(tw);
    vec3 lp=vec3(d2.x*rad,hh,d2.y*rad)+across*(aF.z*wdt)-vec3(0.0,abs(aF.z)*wdt*0.22,0.0);
    wp=iPos+lp*R;
    vec3 up=vec3(-d2.x*sin(e),cos(e),-d2.y*sin(e));
    n=up+across*aF.z*0.45;
    flash=iLean.z*smoothstep(0.25,0.95,heave*gust)*v;
    vUV=vec2(aF.z,v);
  }
  vP=wp; vN=n; vC=iCol.rgb; vK=vec3(iCol.a,flash,aF.w<0.0?1.0:0.0);
  gl_Position=projectionMatrix*viewMatrix*vec4(wp,1.0);
}`,oa=`
varying vec3 vP, vN, vC; varying vec2 vUV; varying vec3 vK;
${ze}
void main(){
  vec3 N=vN/max(length(vN),1e-4);
  vec3 V=cameraPosition-vP; V=V/max(length(V),1e-3);
  vec3 alb;
  float fw=fwidth(vUV.y*17.0);
  if(vK.z>0.5){ alb=vec3(0.03,0.032,0.03)*(0.6+0.8*vn3(vP*vec3(6.0,1.5,6.0))); }
  else {
    float comb=abs(fract(vUV.y*17.0+abs(vUV.x)*0.55)-0.5)*2.0;         // pinnae: teeth along the blade, raked toward the tip
    float cut=mix(0.95-comb*0.9,0.3,clamp(fw*1.4,0.0,1.0));
    float edge=abs(vUV.x);
    if(edge>0.16 && edge>cut+0.1) discard;
    float rach=1.0-smoothstep(0.03,0.14,edge);
    alb=vC*(0.75+0.7*vUV.y)*(1.0-0.55*rach)*(0.8+0.4*vn3(vP*3.0));
    if(!gl_FrontFacing){ N=-N; alb=mix(alb,vec3(0.30,0.36,0.38),0.35+0.65*clamp(vK.y*3.0,0.0,1.0)); }
    alb=mix(alb,vec3(0.36,0.43,0.45),clamp(vK.y,0.0,1.0)*0.85);
  }
  float nl=max(dot(N,uMoonDir)*0.7+0.3,0.0);
  float tr=max(dot(-V,uMoonDir),0.0); tr*=tr;
  vec3 Hh=uMoonDir+V; Hh=Hh/max(length(Hh),1e-3);
  float sp=max(dot(N,Hh),0.0); sp*=sp; sp*=sp; sp*=sp;
  vec3 col=alb*(uMoonCol*(nl+tr*0.5)*vK.x*1.65+uAmbCol*(0.65+0.6*(N.y*0.5+0.5)))+uMoonCol*sp*0.04*vK.x*(1.0-vK.z);
  gl_FragColor=vec4(mistApply(col*uOutGain,vP),1.0);
}`,aa=`
attribute vec3 aQ;                 // across -1..1, seconds since leaving the lip, half width there (m)
varying vec3 vP, vQ, vN;
void main(){ vP=(modelMatrix*vec4(position,1.0)).xyz; vQ=aQ; vN=mat3(modelMatrix)*normal; gl_Position=projectionMatrix*viewMatrix*vec4(vP,1.0); }`,na=`
uniform float uLayer, uTmax;
varying vec3 vP, vQ, vN;
${ze}
void main(){
  float a=vQ.x, t=vQ.y, w=vQ.z;
  float ft=t-uTime;                                   // the water's launch time: every pattern falls with the water
  float dC=length(vP-cameraPosition);
  float ax=a*w;                                       // metres across the sheet
  float lod=1.0-smoothstep(30.0,120.0,dC);
  // three scales: falling masses, ropes, and strands three to six to the metre
  float mass=vn3(vec3(ax*0.55+uLayer*5.0,ft*2.6,uLayer*7.0));
  float rope=vn3(vec3(ax*1.7+3.0,ft*5.2+mass,uLayer*3.0+1.0));
  float str=mix(0.5,vn3(vec3(ax*4.6,ft*4.0+mass*1.5,2.0))*0.6+vn3(vec3(ax*9.5,ft*9.0,5.0))*0.4,lod);
  float body=mass*0.42+rope*0.30+str*0.28;
  float fall=smoothstep(0.2,2.3,t);                   // 0 at the lip .. 1 once the sheet has torn (25 m out)
  // the outline is eaten by the same ropes and strands, more as it falls: there is no smooth edge anywhere
  float ed=abs(a)+(rope-0.5)*0.6*(0.35+fall)+(str-0.5)*0.34;
  float edge=1.0-smoothstep(0.58,0.98,ed);
  float thr=mix(0.19,0.56,fall)+uLayer*0.09;          // solid water at the lip, torn to strands and clumps with gaps below
  float dens=smoothstep(thr,thr+0.15,body)*edge;
  float alpha=dens*smoothstep(0.0,0.2,t)*(1.0-smoothstep(uTmax-0.5,uTmax-0.1,t));   // gone just above the pool: the water plane never slices it
  alpha*=mix(0.86,0.30,uLayer);
  vec3 gn=vN/max(length(vN),1e-6);                    // the sheet's smooth normal (a facet normal steps the alpha panel by panel)
  vec3 Vg=vP-cameraPosition; Vg=Vg/max(length(Vg),1e-3);
  alpha*=mix(0.5,1.0,smoothstep(0.02,0.25,abs(dot(gn,Vg))));                      // a sheet seen along itself is spray, not a shell
  vec3 V=vP-cameraPosition; V=V/max(length(V),1e-3);
  float back=max(dot(V,uMoonDir),0.0);
  vec3 col=(uMoonCol*(0.40+0.5*back*back)+uAmbCol*1.0)*(0.4+1.3*smoothstep(thr,thr+0.42,body))*(0.7+0.6*str);   // aerated water is white from every side
  col+=uMoonCol*0.07*exp(-t*1.3)*(1.0-a*a)*(0.55+0.45*back)*(0.5+str);       // the bright core as it leaves the lip
  float glass=(1.0-fall)*(1.0-0.5*uLayer);                                    // near the lip the water is whole: dark and glassy between ropes of white
  col*=mix(1.0,0.16+1.05*smoothstep(0.45,0.8,rope*0.55+str*0.45),glass*0.9)*mix(0.8,1.0,fall);
  col*=1.0+0.9*(1.0-smoothstep(0.0,0.55,dens))*(0.35+0.65*back);             // thin water at the torn edges glows
  col=mistApply(col*uOutGain,vP);
  alpha*=smoothstep(1.5,7.0,dC);
  gl_FragColor=vec4(col*alpha,alpha);
}`,ia=`
attribute vec4 iPar;               // phase 0..1, across -1..1, offset off the sheet (m), size (m)
uniform vec3 uPO, uPV, uPR;         // the plume: origin, launch velocity, right
uniform vec2 uPT;                  // flight time (s), width scale
uniform float uTime;
varying vec2 vUV; varying vec3 vW; varying vec2 vK;
void main(){
  float t=fract(uTime/uPT.x+iPar.x)*uPT.x;
  float wdt=(2.3+0.78*t)*uPT.y;
  vec3 c=uPO+uPV*t+uPR*(-(0.9*t+0.42*t*t)+iPar.y*wdt*0.9);
  c.y=uPO.y+uPV.y*t-4.9*t*t+iPar.z*(0.4+0.25*t);
  vec3 vel=uPV+uPR*(-(0.9+0.84*t)); vel.y=uPV.y-9.8*t;
  vec3 vd=vel/max(length(vel),1e-3);
  vec3 toC=cameraPosition-c;
  // an ellipsoid of water drawn out along its fall: seen from the side a streak, seen along the fall a round blob
  vec3 vw=toC/max(length(toC),1e-3);
  vec3 ax=vd-vw*dot(vd,vw); float al=length(ax); ax=ax/max(al,1e-3);
  vec3 side=cross(ax,vw);
  float wid=iPar.w*(0.40+0.05*t), len=max(iPar.w*(1.5+0.55*t)*al,wid*1.15);
  vec3 wp=c+ax*(position.y*len)+side*(position.x*wid);
  vUV=position.xy; vW=c;
  vK=vec2(smoothstep(0.05,0.5,t)*(1.0-smoothstep(uPT.x-0.5,uPT.x-0.05,t))*smoothstep(2.0,8.0,length(toC)),iPar.x*37.0);
  gl_Position=projectionMatrix*viewMatrix*vec4(wp,1.0);
}`,ra=`
varying vec2 vUV; varying vec3 vW; varying vec2 vK;
${ze}
void main(){
  float x=vUV.x, y=vUV.y;
  float prof=mix(0.18,1.0,smoothstep(-1.0,0.55,y))*(1.0-smoothstep(0.5,1.0,y)*0.75);     // a head that leads, a tail drawn out behind
  float n=vn3(vec3(x*2.2+vK.y,y*1.7-uTime*2.0,vK.y))*0.6+vn3(vec3(x*5.5,y*4.0-uTime*4.0,vK.y+3.0))*0.4;
  float a=1.0-smoothstep(0.0,1.0,abs(x)/max(prof,0.05)+0.9*(n-0.5));
  a*=(1.0-smoothstep(0.75,1.0,abs(y)))*vK.x;
  vec3 V=vW-cameraPosition; V=V/max(length(V),1e-3);
  float back=max(dot(V,uMoonDir),0.0);
  vec3 col=(uMoonCol*(0.42+0.5*back*back)+uAmbCol*1.0)*(0.55+0.9*n)*(0.6+0.6*smoothstep(-0.4,0.8,y));
  col=mistApply(col*uOutGain,vW);
  a*=0.82;
  gl_FragColor=vec4(col*a,a);
}`,sa=`
varying vec3 vP; varying float vLayer, vEdge;
attribute float aLayer, aEdge;       // aEdge: metres of clear air between the sheet and the ground under it (0 where it would touch a wall)
void main(){ vP=(modelMatrix*vec4(position,1.0)).xyz; vLayer=aLayer; vEdge=aEdge; gl_Position=projectionMatrix*viewMatrix*vec4(vP,1.0); }`,la=`
uniform vec4 uDeck;                // peak opacity, hollow radius (m), opacity inside the hollow, brightness
uniform vec3 uHole, uHole2, uDrift; // the hollow runs from the cliff foot (uHole2) to the pool (uHole); world xz in .xz
uniform float uGap;                // how much of the sea is torn open in ragged gaps (0 = brim-full)
uniform vec3 uShade;               // the sky's blue in the shade of the heads (dawn: pale on one side, blue-grey on the other)
varying vec3 vP; varying float vLayer, vEdge;
${ze}
float bil(float v){ v=2.0*v-1.0; return 1.0-v*v; }                 // a dome with a crease round it
// cloud tops at four sizes: swells 120 m across, heads 40 m, cauliflower 14 m, and 5 m curds near the eye
float deckH(vec2 p, float l, float fine){
  float a=vn3(vec3(p*0.0085,uTime*0.010+l*5.0));
  float b=bil(vn3(vec3(p*0.026+a*1.5,3.0+uTime*0.018)));
  float c=bil(vn3(vec3(p*0.071+b*0.8,7.0+l+uTime*0.03)));
  float d=bil(vn3(vec3(p*0.21+c*0.6,11.0+uTime*0.05)));
  float e=bil(vn3(vec3(p*0.57+d*0.5,13.0+uTime*0.07)));
  return a*0.40+b*0.34+c*0.18+d*0.12*fine+e*0.05*fine*fine*fine;
}
void main(){
  vec3 V=vP-cameraPosition; float dC=length(V); V=V/max(dC,1e-3);
  vec2 p0=vP.xz+uDrift.xz*uTime*(1.5+vLayer)+vLayer*37.0;
  float fine=1.0-smoothstep(60.0,260.0,dC);
  // one step of parallax: the heads stand up to 16 m proud of the troughs, so they slide across them as we fly over
  float h0=deckH(p0,vLayer,0.0);
  vec2 p=p0-V.xz/max(abs(V.y),0.4)*(h0-0.5)*16.0;
  float n=deckH(p,vLayer,fine);
  vec2 ml=uMoonDir.xz/max(length(uMoonDir.xz),1e-3);
  float dn=deckH(p+ml*5.0,vLayer,fine)-n;                                         // the tops' slope toward the moon
  // the hollow the fall has punched: torn and ragged, but always open where we dive through it
  vec2 ha=vP.xz-uHole2.xz, hb=uHole.xz-uHole2.xz;
  float hs=clamp(dot(ha,hb)/max(dot(hb,hb),1.0),0.0,1.0);
  float rag=clamp((n-0.5)*2.2+(vn3(vec3(p0*0.045,5.0+uTime*0.03))-0.5)*1.1,-0.95,0.25);
  float rh=length(ha-hb*hs)+rag*uDeck.y;
  float hole=smoothstep(uDeck.y*0.6,uDeck.y*1.25,rh);
  // ragged gaps elsewhere: the forest shows through
  float gapN=vn3(vec3(p0*0.0056+vec2(3.7,9.1),uTime*0.006))+(n-0.5)*0.30;
  float gap=smoothstep(0.585,0.685,gapN)*uGap;
  // the lower sheet is the sea itself; the upper sheet is only the heads that stand above it
  float cover=mix(smoothstep(0.17,0.42,n),smoothstep(0.52,0.76,n)*0.9,vLayer)*(1.0-gap);
  // it thins to nothing before it can touch a wall: no edge is ever drawn against the rock
  float e=clamp(vEdge/24.0,0.0,1.0);
  float edge=smoothstep(0.10,0.60,e*(0.4+1.2*n));
  float a=cover*uDeck.x*mix(uDeck.z,1.0,hole)*edge*smoothstep(5.0,34.0,dC);
  float g=max(dot(V,uMoonDir),0.0);
  float above=smoothstep(-6.0,6.0,cameraPosition.y-vP.y);
  float lit=smoothstep(-0.55,0.55,-dn*13.0);                                      // moon side silver, lee side in blue-black shadow
  float tops=smoothstep(0.26,0.74,n);                                             // heads pale, the troughs between them dark
  float rimK=1.0-smoothstep(0.0,0.45,cover);                                      // thin cloud at a torn edge takes the light through it
  vec3 col=uMistCol*(0.11+tops*(0.35+3.3*lit*lit)+0.5*rimK*(0.4+0.6*lit)+0.6*g*g)+uMoonCol*0.06*lit*tops+uShade*(1.0-lit)*(0.35+0.65*tops);
  col*=uDeck.w*(0.9+0.2*vLayer);
  col=mix(uMistCol*0.5,col,above);
  col*=0.5+0.5*hole;                                                              // the hollow's walls fall away into the dark
  col=mistApply(col*uOutGain,vP);
  gl_FragColor=vec4(col*a,a);
}`,ca=`
attribute vec3 iPos; attribute vec4 iPar;    // radius (m), seed, height : width, opacity
attribute vec4 iWall;                        // toward the nearest wall (world x, z), metres of air to it, how fast it leans away with height
uniform vec3 uDrift, uMoonDir; uniform float uTime;
varying vec2 vUV; varying vec3 vK, vW, vMoonV, vUpV; varying float vWallK;
void main(){
  vec3 c=iPos+uDrift*sin(uTime*0.05+iPar.y*6.2832)*9.0; c.y+=sin(uTime*0.09+iPar.y*17.0)*0.8;
  vec4 mv=viewMatrix*vec4(c,1.0);
  float fade=smoothstep(iPar.x*0.55,iPar.x*1.7,length(mv.xyz));
  vec2 ofs=position.xy*iPar.x*vec2(1.0,iPar.z);
  mv.xy+=ofs;
  vec3 wo=vec3(viewMatrix[0][0],viewMatrix[1][0],viewMatrix[2][0])*ofs.x+vec3(viewMatrix[0][1],viewMatrix[1][1],viewMatrix[2][1])*ofs.y;   // this corner, from the centre, in the world
  vWallK=(iWall.z-dot(wo.xz,iWall.xy)+wo.y*iWall.w)/max(iPar.x,1.0);
  vUV=position.xy; vK=vec3(iPar.w*fade,iPar.y,uTime*0.02); vW=c;
  vMoonV=mat3(viewMatrix)*uMoonDir; vUpV=mat3(viewMatrix)*vec3(0.0,1.0,0.0);
  gl_Position=projectionMatrix*mv;
}`,ua=`
uniform vec3 uMoonCol, uAmbCol, uMistCol, uShade; uniform vec4 uMist; uniform float uOutGain, uHeadK;
varying vec2 vUV; varying vec3 vK, vW, vMoonV, vUpV; varying float vWallK;
${Ct}
void main(){
  float r2=dot(vUV,vUV);
  float n=vn3(vec3(vUV*1.5+vK.y*31.0,vK.z+vK.y*5.0))*0.6+vn3(vec3(vUV*3.9-vK.y*13.0,vK.z*2.0))*0.4;
  float nf=vn3(vec3(vUV*8.5+vK.y*7.0,vK.z*3.0));
  float d=r2+0.8*(n-0.5)+0.24*(nf-0.5);
  float z=sqrt(max(1.0-clamp(d,0.0,1.0),0.0));
  vec3 N=vec3(vUV+(vec2(n,nf)-0.5)*0.95,z+0.2); N=N/max(length(N),1e-3);
  float lit=smoothstep(-0.30,0.80,dot(N,vMoonV));
  // crisp on the moon side, feathered in the shade, and gone before the card can reach the rock
  float a=(1.0-smoothstep(mix(0.22,0.52,lit),0.92,d))*(1.0-smoothstep(0.72,1.0,r2))*smoothstep(0.0,0.28,vWallK);
  float topk=smoothstep(-0.65,0.55,dot(N,vUpV));                                  // the underside sinks into the sea's own shadow
  vec3 col=uMistCol*(0.11+(0.35+3.3*lit*lit)*topk)+uMoonCol*0.06*lit*topk+uShade*(1.0-lit)*(0.35+0.65*topk);
  // the same height mist as everything else outside (inlined: this sprite has no cameraPosition-space position per pixel)
  vec3 dv=vW-cameraPosition; float dd=length(dv);
  float t=clamp(uMist.z*dv.y,-9.0,9.0); float f=abs(t)>1e-3 ? (1.0-exp(-t))/t : 1.0;
  float od=uMist.x*exp(-clamp(uMist.z*(cameraPosition.y-uMist.y),-5.0,12.0))*dd*f+uMist.w*dd;
  col=mix(col*uHeadK,uMistCol*0.8,clamp(1.0-exp(-max(od,0.0)),0.0,1.0)*0.85)*uOutGain;
  a*=vK.x;
  gl_FragColor=vec4(col*a,a);
}`,va=`
attribute vec3 aAcr, aB; attribute vec4 aQ;  // aAcr: unit vector across the fall (world)   aQ: side -1|1, metres down the fall, half width (m), seed
attribute float aS;                          // how much moon reaches this wall
varying vec3 vP, vB; varying vec4 vQ; varying float vS, vE;
void main(){
  vec3 c=(modelMatrix*vec4(position,1.0)).xyz;
  vec3 tc=cameraPosition-c; float dist=length(tc);
  float hw=max(aQ.z,dist*0.0034);                                                 // the stream: never under two pixels
  float wg=4.2+hw*2.0;                                                            // the ribbon: wide enough for the stream to step sideways in
  vec3 wp=c+aAcr*(aQ.x*wg)+tc/max(dist,1e-3)*1.4;
  vP=wp; vQ=vec4(aQ.x*wg,aQ.y,hw,aQ.w); vS=aS; vE=aQ.x; vB=aB;
  gl_Position=projectionMatrix*viewMatrix*vec4(wp,1.0);
}`,fa=`
varying vec3 vP, vB; varying vec4 vQ; varying float vS, vE;     // vQ: metres across the ribbon, metres down the fall, half width of the stream, seed
${ze}
void main(){
  float ib=floor(vB.x), qf=vB.y;
  float face=(1.0-smoothstep(0.93,1.08,qf))*smoothstep(0.1,0.5,vB.z);             // on a rock face (not on the ledge)
  float sd=floor(vQ.w*97.0);
  float hs=h31(vec3(ib,sd,2.0)), hs2=h31(vec3(ib,sd,11.0));                       // this fall on this bed
  float wav=vn3(vec3(vQ.w*31.0,vQ.y*0.33-uTime*0.22,ib*1.3))-0.5;
  float cen=(hs-0.5)*4.0+wav*2.6;                                                 // it steps sideways on every ledge and wavers as it drops
  float hw=vQ.z*(0.6+0.9*hs2);
  float ax=(vQ.x-cen)/max(hw,0.05);                                               // in half widths of the stream
  float on=step(0.2,hs2)*face;                                                    // now and then a bed it misses
  float t=vQ.y*0.42-uTime*(2.0+1.3*hs);                                           // the pattern falls with the water
  float n1=vn3(vec3(ax*1.2+vQ.w*9.0,t,ib*3.1)), n2=vn3(vec3(ax*3.6,t*2.7,vQ.w*5.0+ib));
  float body=n1*0.6+n2*0.4;
  float prof=1.0-smoothstep(0.1,1.0,abs(ax)+(body-0.5)*1.1);
  float drop=1.0-clamp(qf,0.0,1.0);                                               // 0 at the lip .. 1 at the foot
  float thin=1.0-0.6*smoothstep(0.1,0.9,drop);                                    // it frays into spray as it drops
  float gust=smoothstep(0.2,0.6,vn3(vec3(vQ.w*17.0,uTime*0.19+ib*1.7,3.0)));      // and comes and goes
  float lit=smoothstep(0.05,0.5,vS);
  float brk=0.3+0.7*smoothstep(0.3,0.62,vn3(vec3(vQ.w*13.0,vQ.y*0.3-uTime*0.6,5.0)));      // the veil thins and thickens down its length
  float a=prof*on*smoothstep(0.12,0.5,body*(0.75+0.5*hs)*(0.6+0.4*thin))*(0.45+0.55*thin)*(0.45+0.55*gust)*brk;
  float foot=1.0-smoothstep(0.0,0.34,qf);
  float puff=foot*on*(1.0-smoothstep(0.4,4.6,abs(ax)))*(0.3+0.7*vn3(vec3(ax*0.7,qf*6.0-uTime*0.7,vQ.w*7.0)));   // mist at the foot
  a=clamp(a*1.25+puff*0.9,0.0,1.0)*mix(0.85,1.0,lit)*(1.0-smoothstep(0.75,1.0,abs(vE)));
  vec3 V=vP-cameraPosition; V=V/max(length(V),1e-3);
  float back=max(dot(V,uMoonDir),0.0);
  vec3 col=(uMoonCol*((0.95+0.6*back*back)*vS+0.13)+uAmbCol*1.8)*(0.5+0.8*body)*(1.0+0.25*puff);   // silver where the moon reaches, dim blue-grey on the lee wall
  float wetA=(1.0-smoothstep(0.8,3.2,abs(ax)))*0.3*smoothstep(0.2,0.65,n1)*on;    // the rock under it runs dark and wet
  col=mistApply(col*uOutGain,vP);
  float fade=(1.0-smoothstep(260.0,420.0,length(vP-cameraPosition)))*(1.0-smoothstep(0.8,1.0,abs(vE)));
  gl_FragColor=vec4(col*a*fade,(a+(1.0-a)*wetA)*fade);
}`,ha=`
attribute float aS; attribute vec3 iPos; attribute vec4 iScl, iCol;
varying vec3 vP, vN, vC, vO; varying float vS, vH;
${ze}
void main(){
  vec3 p=position*iScl.xyz; vec3 n=normal;
  float c=cos(iScl.w), s=sin(iScl.w);
  p.xz=vec2(c*p.x+s*p.z,-s*p.x+c*p.z); n.xz=vec2(c*n.x+s*n.z,-s*n.x+c*n.z);
  vec3 wp=iPos+p; vO=wp;
  float sw=max(aS,0.0);
  wp.xz+=vec2(sin(uTime*0.8+iPos.x*0.07+p.y*0.21),cos(uTime*0.6+iPos.z*0.06+p.y*0.17))*(0.25+0.9*sw*sw);
  vP=wp; vN=n; vC=iCol.rgb; vS=iCol.a; vH=aS;
  gl_Position=projectionMatrix*viewMatrix*vec4(wp,1.0);
}`,da=`
uniform float uFrost; uniform vec3 uStr;      // uStr: how fine the strands are, and how much of the hem they eat (slope, offset)
varying vec3 vP, vN, vC, vO; varying float vS, vH;
${ze}
void main(){
  vec3 N=vN/max(length(vN),1e-4); if(!gl_FrontFacing) N=-N;
  float hem=max(vH,0.0);
  float strands=vn3(vec3(vO.x*0.9*uStr.x,vO.y*0.16,vO.z*0.9*uStr.x))*0.65+vn3(vec3(vO.x*2.3*uStr.x,vO.y*0.4,vO.z*2.3*uStr.x))*0.35;
  if(vH>=0.0 && strands<hem*uStr.y-uStr.z) discard;                                // weeping: the hem hangs in ragged strands
  float n1=vn3(vP*0.45), n2=vn3(vP*1.3+5.0);
  vec3 Nb=N+(vec3(n1,n2,vn3(vP*0.8+9.0))-0.5)*0.8; Nb=Nb/max(length(Nb),1e-3);
  float nl=max(dot(Nb,uMoonDir)*0.7+0.3,0.0);
  vec3 alb=vH<0.0 ? vec3(0.02,0.02,0.018) : vC*(0.6+0.7*n2)*(1.0-0.5*hem);
  alb=mix(alb,vec3(0.34,0.38,0.42),uFrost*smoothstep(0.0,0.7,Nb.y)*0.8*step(0.0,vH));
  vec3 col=alb*(uMoonCol*nl*vS+uAmbCol*(0.45+0.55*(Nb.y*0.5+0.5)));
  gl_FragColor=vec4(mistApply(col*uOutGain,vP),1.0);
}`,ma=`
attribute float aT; attribute vec4 iPar;      // iPar: x (m right of the keel), z (m ahead of the eye, negative forward), phase, length scale
uniform float uTime, uEelsY;
varying vec3 vN; varying float vT;
void main(){
  float ph=aT*7.0-uTime*(6.0+2.0*fract(iPar.z*3.3))+iPar.z*20.0;
  float amp=(0.04+0.17*aT)*iPar.w;
  vec3 p=vec3(position.x+amp*sin(ph), position.y, position.z*iPar.w);
  p.x+=iPar.x+0.25*sin(uTime*0.7+iPar.z*9.0);
  p.z+=iPar.y+0.9*sin(uTime*0.45+iPar.z*5.0);
  p.y+=uEelsY;
  vN=mat3(modelMatrix)*normal; vT=aT;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);
}`,pa=`
uniform vec3 uEelsCol; uniform float uEelsA;
varying vec3 vN; varying float vT;
void main(){
  vec3 n=vN/max(length(vN),1e-4);
  float up=max(n.y,0.0); up*=up; float ridge=up*up; ridge*=ridge;
  gl_FragColor=vec4(uEelsCol*(0.004+0.05*up*(0.6+0.4*sin(vT*90.0))+0.55*ridge)*uEelsA,1.0);      // black, with a thin wet line of light down the back
}`,Co=`
attribute vec3 iPos; attribute vec4 iPar;    // radius, phase, rise (m; 0 = drifting bank), opacity
uniform vec3 uDrift, uFoot;
varying vec2 vUV; varying vec3 vK; varying vec3 vW; varying float vH;
uniform float uTime, uOp;
void main(){
  vec3 c=iPos; float cyc=1.0, grow=1.0;
  if(iPar.z>0.0){ float f=fract(uTime*0.055+iPar.y); c.y+=f*iPar.z; c.xz+=uDrift.xz*f*14.0; grow=0.55+0.9*f; cyc=sin(3.1416*f); cyc*=cyc; }
  else { c+=uDrift*sin(uTime*0.05+iPar.y*6.2832)*12.0; c.y+=sin(uTime*0.11+iPar.y*17.0)*1.2; }
  vec4 mv=viewMatrix*modelMatrix*vec4(c,1.0);
  float rad=iPar.x*grow;
  float dist=length(mv.xyz);
  float fade=smoothstep(rad*0.35,rad*1.3,dist);
  mv.xy+=position.xy*rad;
  vUV=position.xy; vK=vec3(iPar.w*cyc*fade*uOp,iPar.y,uTime*0.03); vW=c;
  // this corner's height over the pool: the puff thins to nothing at the water, so the water plane never rules a line across it
  vH=(modelMatrix*vec4(c,1.0)).y+(viewMatrix[1][0]*position.x+viewMatrix[1][1]*position.y)*rad-uFoot.y;
  gl_Position=projectionMatrix*mv;
}`,ko=`
varying vec2 vUV; varying vec3 vK; varying vec3 vW; varying float vH;
uniform vec3 uMoonDir, uMoonCol, uAmbCol, uMistCol; uniform float uOutGain;
${Ct}
void main(){
  float r2=dot(vUV,vUV);
  float n=vn3(vec3(vUV*1.6+vK.y*31.0,vK.z+vK.y*5.0))*0.65+vn3(vec3(vUV*3.7-vK.y*13.0,vK.z*2.0))*0.35;
  float a=(1.0-smoothstep(0.0,1.0,r2+0.95*(n-0.5)))*vK.x;                         // each puff is torn, with holes in it: the pool shows between them
  a*=(1.0-smoothstep(0.75,1.0,r2))*smoothstep(0.3,5.0,vH);
  vec3 V=vW-cameraPosition; V=V/max(length(V),1e-3);
  float g=max(dot(V,uMoonDir),0.0);
  vec3 col=(uMistCol*(1.15+2.0*g*g)+uMoonCol*0.035*(0.6+0.4*vUV.y))*(0.7+0.6*n)*uOutGain;
  gl_FragColor=vec4(col*a,a);
}`,ga=k=>`
attribute vec3 iPos; attribute vec4 iPar;       // iPar: size (m), phase, a, b (per kind)
uniform vec2 uRes; uniform vec3 uPx; uniform float uTime, uBright; uniform vec3 uColA, uColB;
varying vec2 vUV; varying vec3 vCol; varying float vF;
void main(){
  vec3 c=iPos; float br=1.0; float tint=fract(iPar.y*7.31); vF=0.0;
  ${k}
  vec4 mv=modelViewMatrix*vec4(c,1.0);
  float zc=min(mv.z,-0.05);
  float rTrue=iPar.x*projectionMatrix[1][1]*0.5*uRes.y/(-zc);
  float r=clamp(rTrue,uPx.x,max(uPx.x,uRes.y*uPx.y));
  br*=max(pow(clamp(rTrue/r,0.0,1.0),1.3),uPx.z)*smoothstep(0.3,0.9,-mv.z);
  vec4 pc=projectionMatrix*vec4(mv.xy,zc,1.0);
  pc.xy+=position.xy*r*2.4/(0.5*uRes)*pc.w;
  gl_Position=pc;
  if(mv.z>-0.1) gl_Position=vec4(0.0,0.0,2.0,1.0);
  vUV=position.xy; vCol=mix(uColA,uColB,tint)*(br*uBright);
}`,wa=`
varying vec2 vUV; varying vec3 vCol;
void main(){
  float r2=dot(vUV,vUV);
  float core=exp(-r2*10.0), halo=exp(-r2*3.4)*0.12;
  gl_FragColor=vec4(vCol*(core+halo)*(1.0-smoothstep(0.6,1.0,r2)),1.0);
}`,So=`
attribute vec3 iPos; attribute vec4 iPar;       // iPar: wing length (m), phase, rise (m), cycles per second
uniform vec2 uRes; uniform vec3 uPx; uniform float uTime, uBright; uniform vec3 uColA, uColB;
varying vec2 vUV; varying vec3 vCol; varying float vF;
void main(){
  float tint=fract(iPar.y*7.31), h2=fract(iPar.y*13.7), h3=fract(iPar.y*29.3);
  float f=fract(uTime*iPar.w+iPar.y);
  float fr=f*sqrt(f)*(0.6+0.4*f);                                                 // slow off the water, quicker as it climbs
  float an=iPar.y*40.0+uTime*(0.5+1.4*tint);
  float rr=(0.12+0.55*fr)*(0.4+tint);
  vec3 c=iPos+vec3(cos(an)*rr,0.06+fr*iPar.z+0.05*sin(uTime*(2.0+3.0*h2)+iPar.y*50.0),sin(an)*rr);
  vF=sin(uTime*(17.0+9.0*tint)+iPar.y*90.0);                                      // the wing beat
  float br=smoothstep(0.0,0.07,f)*(1.0-smoothstep(0.78,1.0,f))*(0.75+0.25*vF);
  vec4 mv=modelViewMatrix*vec4(c,1.0);
  float zc=min(mv.z,-0.05);
  float rTrue=iPar.x*projectionMatrix[1][1]*0.5*uRes.y/(-zc);
  float r=clamp(rTrue,uPx.x,max(uPx.x,uRes.y*uPx.y));
  br*=max(pow(clamp(rTrue/r,0.0,1.0),1.2),uPx.z)*smoothstep(0.35,1.1,-mv.z);
  float tilt=(h3-0.5)*2.0+0.4*sin(uTime*(1.3+2.0*h2)+iPar.y*30.0);                // every one at its own angle, rocking
  float ct=cos(tilt), st=sin(tilt);
  vec2 q=vec2(position.x*0.85,position.y*1.2);
  vec4 pc=projectionMatrix*vec4(mv.xy,zc,1.0);
  pc.xy+=vec2(ct*q.x-st*q.y,st*q.x+ct*q.y)*r*2.6/(0.5*uRes)*pc.w;
  gl_Position=pc;
  if(mv.z>-0.1) gl_Position=vec4(0.0,0.0,2.0,1.0);
  vUV=position.xy; vCol=mix(uColA,uColB,tint)*(br*uBright);
}`,zo=`
varying vec2 vUV; varying vec3 vCol; varying float vF;
void main(){
  vec2 b=vUV-vec2(0.0,-0.34);                                                     // the body sits low in the card; the wings rise from it
  float open=0.30+0.42*(0.5+0.5*vF);                                              // half the angle of the V: the beat
  float so=sin(open), co=cos(open);
  float tL=dot(b,vec2(-so,co)), pL=b.x*co+b.y*so;
  float tR=dot(b,vec2(so,co)),  pR=b.x*co-b.y*so;
  float wL=0.035+0.19*sin(3.1416*pow(clamp(tL/1.15,0.0,1.0),0.7)), wR=0.035+0.19*sin(3.1416*pow(clamp(tR/1.15,0.0,1.0),0.7));
  float wings=exp(-pL*pL/(wL*wL))*smoothstep(-0.04,0.10,tL)*(1.0-smoothstep(0.85,1.2,tL))
             +exp(-pR*pR/(wR*wR))*smoothstep(-0.04,0.10,tR)*(1.0-smoothstep(0.85,1.2,tR));
  float body=exp(-(vUV.x*vUV.x*70.0+(vUV.y+0.36)*(vUV.y+0.36)*16.0));
  float smear=exp(-vUV.x*vUV.x*34.0)*smoothstep(-1.0,-0.5,vUV.y)*(1.0-smoothstep(-0.5,-0.3,vUV.y))*0.22;   // the rise, and the long tails
  float w=min(wings,1.0)*0.8+body*0.75+smear;
  gl_FragColor=vec4(vCol*w*(1.0-smoothstep(0.8,1.0,max(abs(vUV.x),abs(vUV.y)))),1.0);
}`,ya=So.replace("float fr=f*sqrt(f)*(0.6+0.4*f);","float fr=f*(0.55+0.45*f);").replace("float an=iPar.y*40.0+uTime*(0.5+1.4*tint);","float an=iPar.y*40.0+uTime*(0.16+0.2*tint)+fr*2.6;").replace("float rr=(0.12+0.55*fr)*(0.4+tint);","float rr=(2.4+4.6*h2)*(1.0-0.6*fr)+0.3*sin(uTime*1.1+iPar.y*20.0);"),Jo="br=0.7+0.3*sin(uTime*(0.3+0.5*tint)+iPar.y*6.2832);",ba="float tw=sin(uTime*(7.0+9.0*tint)+iPar.y*40.0)*sin(uTime*(3.1+4.0*tint)+iPar.y*17.0); br=iPar.z*(0.72+0.38*tw);",xa=`c.y+=sin(uTime*0.6+iPar.y*30.0)*0.25+fract(uTime*0.07*(0.5+tint)+iPar.y)*1.6-0.8; c.z+=sin(uTime*0.4+iPar.y*11.0)*0.3;
  br=iPar.z*(0.5+0.5*sin(uTime*(2.0+3.0*tint)+iPar.y*50.0));`,Ma=`
attribute float aKind;            // 0 deck and hull, 1 deck lines and fittings, 2 paddle
varying vec3 vL, vN, vV; varying float vKind;
void main(){
  vL=position; vKind=aKind;
  vec4 mv=modelViewMatrix*vec4(position,1.0);
  vN=normalMatrix*normal; vV=-mv.xyz;
  gl_Position=projectionMatrix*mv;
}`,Pa=`
uniform vec3 uEnv, uGlintCol, uKeyV, uKeyCol, uRim; uniform float uWet, uTime;
varying vec3 vL, vN, vV; varying float vKind;
${Ct}
void main(){
  vec3 N=vN/max(length(vN),1e-4); vec3 V=vV/max(length(vV),1e-4);
  if(!gl_FrontFacing) N=-N;
  float c=1.0-clamp(dot(N,V),0.0,1.0); float fr=0.035+0.965*c*c*c;
  float deck=1.0-step(0.5,vKind);
  // beads of water on the deck: a few jittered drops of different sizes, each a pin-sharp glint that winks as the view moves
  vec2 g=vL.xz*vec2(31.0,23.0)+vec2(vn3(vL*9.0),vn3(vL*7.0+4.0))*1.3; vec2 ig=floor(g); vec2 fg=fract(g)-0.5;
  float hh=h31(vec3(ig,1.7)); vec2 off=(vec2(h31(vec3(ig,5.1)),h31(vec3(ig,9.4)))-0.5)*0.7;
  float rad=0.07+0.11*h31(vec3(ig,3.3));
  float bead=(1.0-smoothstep(rad*0.35,rad,length(fg-off)))*step(0.78,hh)*deck;
  float wink=0.5+0.5*sin(uTime*(0.6+1.8*hh)+hh*60.0+dot(V.xy,vec2(11.0,7.0)));
  float film=vn3(vec3(vL.x*14.0,vL.y*5.0,vL.z*2.2))*0.6+vn3(vL*vec3(40.0,9.0,9.0))*0.4;       // water sheeting off toward the gunwales
  vec3 base=vec3(0.0055,0.0065,0.008)*(0.7+0.6*film);
  if(vKind>1.5) base=vec3(0.011,0.012,0.013);
  else if(vKind>0.5) base=vec3(0.004,0.0045,0.005);
  float kd=max(dot(N,uKeyV),0.0);
  vec3 Hh=uKeyV+V; Hh=Hh/max(length(Hh),1e-3);
  float sp=max(dot(N,Hh),0.0); sp*=sp; sp*=sp; sp*=sp; sp*=sp;
  float wetK=mix(0.35,1.0,deck)*uWet*(0.55+0.45*smoothstep(0.35,0.7,film));
  float sp2=max(dot(N,Hh),0.0); sp2*=sp2; sp2*=sp2; sp2*=sp2;
  float shiny=mix(vKind>1.5?0.5:0.0,1.0,deck);
  vec3 col=base*(uEnv*7.0+uKeyCol*kd*4.0)+(uEnv*fr*wetK*0.55+uKeyCol*(sp*0.5+sp2*0.12+fr*0.03)*wetK)*shiny;
  col+=uGlintCol*bead*wink*uWet*(0.3+0.7*smoothstep(-0.2,0.6,N.y));
  // in the Tube the roof is an arm's length over the wet deck: a streaky sheen of its light along the deck and a thin rim down
  // the gunwales and the paddle, so the bow is a wet shape and not a hole in the water
  col+=uRim*(c*c*(0.3+0.7*smoothstep(0.3,0.75,film))*deck+c*c*c*(1.0-deck)*(vKind>1.5?0.8:0.45));
  // the paddle: wet carbon. Its upper side takes the roof's light as a soft line along the shaft and round the blade's edge,
  // so it is read as a shaft and a blade and never as a bare dark bar
  if(vKind>1.5){ float topL=smoothstep(0.25,0.9,N.y); col+=(uEnv*1.5+uRim*2.2+uKeyCol*0.25)*(0.10+0.9*topL*topL)*(0.6+0.4*film); }
  gl_FragColor=vec4(col,1.0);
}`,Ca=`
attribute vec2 aW;                // signed span fraction (0 on the body), chord fraction
uniform float uFlap;
varying vec3 vP, vN, vAx, vAz; varying vec2 vW;
void main(){
  vec3 p=position; float s=abs(aW.x);
  float ang=uFlap*(0.25+0.75*s);
  p.y+=sin(ang)*s*s*0.15;
  p.x*=1.0-0.04*(1.0-cos(ang))*s;
  vP=(modelMatrix*vec4(p,1.0)).xyz; vN=mat3(modelMatrix)*normal; vW=aW;
  vAx=normalize(mat3(modelMatrix)*vec3(1.0,0.0,0.0)); vAz=normalize(mat3(modelMatrix)*vec3(0.0,0.0,1.0));
  gl_Position=projectionMatrix*viewMatrix*vec4(vP,1.0);
}`,ka=`
varying vec3 vP, vN, vAx, vAz; varying vec2 vW;
${ze}
void main(){
  vec3 N=vN/max(length(vN),1e-4); if(!gl_FrontFacing) N=-N;
  vec3 V=cameraPosition-vP; V=V/max(length(V),1e-3);
  float rim=1.0-clamp(dot(N,V),0.0,1.0); rim*=rim;
  float bars=0.7+0.3*vn3(vP*vec3(9.0,9.0,30.0));
  float bar2=0.55+0.45*smoothstep(0.35,0.65,vn3(vP*vec3(5.0,5.0,26.0)+3.0));
  // near black: the bars of its back only just show where the moon lies on them
  vec3 col=vec3(0.040,0.033,0.027)*bars*bar2*(uAmbCol*1.2+uMoonCol*(max(dot(N,uMoonDir),0.0)*0.7+0.1));
  // the rim: on the body where it turns toward the moon; on the wings and tail along the edges that face the moon
  float wing=step(0.001,abs(vW.x)), c2=vW.y*2.0-1.0;
  float eL=smoothstep(0.80,0.97,-c2)*max(dot(-vAz,uMoonDir),0.0), eT=smoothstep(0.84,0.98,c2)*max(dot(vAz,uMoonDir),0.0);
  float eS=smoothstep(0.955,0.995,abs(vW.x))*max(dot(vAx*sign(vW.x),uMoonDir),0.0)*0.35;
  col+=uMoonCol*(mix(rim*rim*smoothstep(0.2,0.9,dot(N,uMoonDir))*0.07,min(eL+eT+eS,1.0)*0.42,wing));
  gl_FragColor=vec4(col*uOutGain,1.0);
}`,Sa=`
attribute vec2 aW;                // signed span fraction (0 on the body), chord fraction
attribute float iPh;
varying vec3 vP, vN; varying vec2 vW;
${ze}
void main(){
  vec3 p=position; float s=abs(aW.x);
  float ph=uTime*(13.0+6.0*fract(iPh*7.3))+iPh*40.0;
  float beat=sin(ph)+0.25*sin(ph*2.0+0.8);
  float ang=0.8*beat*(0.3+0.7*s)-0.1;
  p.y+=sin(ang)*s*0.4-0.035*beat*(1.0-s);
  p.x*=1.0-0.3*(1.0-cos(ang))*s;
  p.z+=0.05*cos(ph)*s*s;
  vec4 wp=modelMatrix*instanceMatrix*vec4(p,1.0);
  vP=wp.xyz; vN=mat3(modelMatrix)*mat3(instanceMatrix)*normal; vW=aW;
  gl_Position=projectionMatrix*viewMatrix*wp;
}`,za=`
varying vec3 vP, vN; varying vec2 vW;
${ze}
void main(){
  vec3 N=vN/max(length(vN),1e-4); if(!gl_FrontFacing) N=-N;
  float wing=step(0.001,abs(vW.x));
  // near black: a wing's membrane lets a breath of the sky through between its fingers, the body none
  float fingers=0.5+0.5*cos(abs(vW.x)*19.0);
  vec3 col=vec3(0.03,0.032,0.04)*(uAmbCol*(0.7+0.9*wing*fingers)+uMoonCol*(max(dot(N,uMoonDir),0.0)*0.25+0.03));
  col+=uMoonCol*(wing*smoothstep(0.9,1.0,1.0-vW.y)*max(dot(N,uMoonDir),0.0)*0.06);       // the leading edge, where the moon lies on it
  gl_FragColor=vec4(col*uOutGain,1.0);
}`,Aa=`
uniform vec3 uCol; uniform float uA, uTime;
varying vec2 vUV;
${Ct}
void main(){
  float n=vn3(vec3(vUV*vec2(5.0,2.0)+vec2(0.0,uTime*2.6),uTime*0.7))*0.6+vn3(vec3(vUV*vec2(17.0,5.0)+vec2(0.0,uTime*5.0),1.0))*0.4;
  float a=uA*(0.55+0.6*n);
  gl_FragColor=vec4(uCol*a,a);
}`,e0="varying vec2 vUV; void main(){ vUV=position.xy; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }";function kt(k,j){const I=new t.InstancedBufferGeometry;I.setAttribute("position",new t.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),I.setIndex([0,1,2,0,2,3]);for(const _ in j)I.setAttribute(_,new t.InstancedBufferAttribute(new Float32Array(j[_][0]),j[_][1]));return I.instanceCount=k,I.boundingSphere=new t.Sphere(new p,1e5),I}function St(k,j,I){const _=new t.InstancedBufferGeometry;_.index=k.index;for(const ne in k.attributes)_.setAttribute(ne,k.attributes[ne]);for(const ne in I)_.setAttribute(ne,new t.InstancedBufferAttribute(new Float32Array(I[ne][0]),I[ne][1]));return _.instanceCount=j,_.boundingSphere=new t.Sphere(new p,1e5),_}function t0(k=11,j=5,I=!0){const _=[],ne=[],W=[];for(let K=0;K<k;K++){const Q=K/k*Ce+K*7%3*.07,be=K*.618%1,ee=_.length/4;for(let de=0;de<=j;de++)for(let fe=-1;fe<=1;fe+=2)_.push(Q,de/j,fe,be),ne.push(0,0,0);for(let de=0;de<j;de++){const fe=ee+de*2;W.push(fe,fe+1,fe+2,fe+2,fe+1,fe+3)}}const Ae=_.length/4,ye=5;if(I){for(let K=0;K<=2;K++)for(let Q=0;Q<ye;Q++)_.push(Q/ye*Ce,K/2,0,-1),ne.push(0,0,0);for(let K=0;K<2;K++)for(let Q=0;Q<ye;Q++){const be=Ae+K*ye+Q,ee=Ae+K*ye+(Q+1)%ye;W.push(be,ee,be+ye,ee,ee+ye,be+ye)}}const Ve=new t.BufferGeometry;return Ve.setAttribute("position",new t.Float32BufferAttribute(ne,3)),Ve.setAttribute("aF",new t.Float32BufferAttribute(_,4)),Ve.setIndex(W),Ve}function lt(){const k=[],j=[],I=[];return{pos:k,idx:j,ext:I,v(_,ne,W,Ae=0){return k.push(_,ne,W),I.push(Ae),k.length/3-1},quad(_,ne,W,Ae){j.push(_,ne,W,_,W,Ae)},tri(_,ne,W){j.push(_,ne,W)},tube(_,ne,W,Ae=0){const ye=k.length/3,Ve=new p(0,1,0),K=new p,Q=new p,be=new p;for(let ee=0;ee<_.length;ee++){K.subVectors(_[Math.min(ee+1,_.length-1)],_[Math.max(ee-1,0)]).normalize(),Q.crossVectors(K,Math.abs(K.y)>.9?new p(1,0,0):Ve).normalize(),be.crossVectors(K,Q);const de=Array.isArray(ne)?ne[ee]:ne;for(let fe=0;fe<W;fe++){const xe=fe/W*Ce,U=Math.cos(xe)*de,te=Math.sin(xe)*de;this.v(_[ee].x+Q.x*U+be.x*te,_[ee].y+Q.y*U+be.y*te,_[ee].z+Q.z*U+be.z*te,Ae)}}for(let ee=0;ee<_.length-1;ee++)for(let de=0;de<W;de++){const fe=ye+ee*W+de,xe=ye+ee*W+(de+1)%W;this.quad(fe,xe,xe+W,fe+W)}},geometry(_,ne=1){const W=new t.BufferGeometry;return W.setAttribute("position",new t.Float32BufferAttribute(k,3)),_&&W.setAttribute(_,new t.Float32BufferAttribute(I.flat?I.flat():I,ne)),W.setIndex(j),W.computeVertexNormals(),W}}}const Va={moon:{hero:"night",zen:"#0B1638",mid:"#11254c",hor:"#31486c",stars:1,milky:1,moon:1,key:1.15,keyCol:"#E4EEF8",amb:["#3c5c9c",.36],mist:["#9DB2C6",.105],fog:[.0034,8,.03,34e-5],glit:.6,gain:1},moonless:{hero:"moonless",zen:"#040a20",mid:"#081634",hor:"#172a50",stars:1.7,milky:1.9,moon:0,key:.1,keyCol:"#b9c8f0",amb:["#4e68a6",.85],mist:["#7890bc",.06],fog:[.0026,8,.03,22e-5],glit:.25,gain:1.6},dawn:{hero:"dawn",zen:"#173a7c",mid:"#4a6ea8",hor:"#c4cdd8",stars:.42,milky:.2,moon:.45,key:.62,keyCol:"#e6ebf4",amb:["#5f82bc",.3],mist:["#c9d2de",.15],fog:[.0038,30,.03,3e-4],glit:.5,gain:1},dusk:{hero:"dusk",zen:"#10286e",mid:"#2c56a0",hor:"#7d9cc8",stars:.28,milky:.1,moon:.8,key:.7,keyCol:"#dfe8f6",amb:["#4a74c4",.5],mist:["#a9bede",.15],fog:[.0036,10,.03,36e-5],glit:.85,gain:1}};var Ba={id:"false-stars",name:"False Stars",category:"wilderness",weirdness:.15,media:["water","interior","air"],async build(k){const{rng:j,noise:I,renderer:_}=k,ne=k.vary||{},W=k.quality?.detail??1,Ae=j.fork("look"),ye=ne.hour||"any",Ve=ye==="dawn"?"dawn":ye==="day"||ye==="golden"?"dusk":ye==="night"?Ae.pick(["moon","moon","moonless"]):Ae.pick(["moon","moon","moonless","dawn","dusk"]),K=Va[Ve],Q=Ve==="dawn"?"brim":Ae.pick(["clear","clear","rain","cloudsea"]),be=Ae.pick(["summer","summer","winter","autumn"]),ee=!!ne.rare,de=Ne(ne.density??1,.7,1.3),fe=be==="winter"?0:Math.round((Ve==="dusk"?230:140)*(.8+.4*Ae())),xe=new t.Scene;xe.background=new t.Color(Zo[0]),xe.fog=new t.FogExp2(new t.Color("#050b12"),9e-4);const U=await H0(k,{palette:Zo,density:de,hour:K.hero,weather:Q==="rain"?"rain":void 0,streak:.4});U.uniforms.uAmb.value.setRGB(.0065,.027,.03),xe.add(U.object);const te=U.anchors,ie=U0(te.flyThrough);await k.yield();const Ge=te.mouth.position.clone(),Y=new p(te.mouth.direction.x,0,te.mouth.direction.z).normalize(),$=te.mouth.right.clone().normalize(),oe=(e,o,r,i=new p)=>i.copy(Ge).addScaledVector($,e).addScaledVector(Y,r).setY(Ge.y+o),ro=e=>{const o=e.x-Ge.x,r=e.z-Ge.z;return{x:o*$.x+r*$.z,y:e.y-Ge.y,k:o*Y.x+r*Y.z}},zt=ie.end.clone(),Me=ro(zt),ct=te.sections,Te=ct.caveU,he=ct.grotto[1],ce=ct.tube[1],Re=ct.flume[1],Ke=ct.dome[0],ke=ct.dome[1],Qe=new p().addScaledVector(Y,Math.cos(76*ae)*Math.cos(22*ae)).addScaledVector($,-Math.sin(76*ae)*Math.cos(22*ae)).setY(Math.sin(22*ae)).normalize(),At=io(K.keyCol,K.key),Et=io(K.amb[0],K.amb[1]),Vt=io(K.mist[0],K.mist[1]),$e=K.fog.slice(),o0=Q==="cloudsea"||Q==="brim",_e=Q==="brim"?Me.y-13:Math.min(we+50,Me.y-22);Q==="cloudsea"&&($e[0]*=1.2,$e[1]=24,$e[3]*=.9),Q==="rain"&&($e[0]*=1.35,$e[3]*=1.3);const q={uMoonDir:{value:Qe},uMoonCol:{value:At},uAmbCol:{value:Et},uMistCol:{value:Vt},uMist:{value:new t.Vector4($e[0],Ge.y+we+$e[1],$e[2],$e[3])},uTime:{value:0},uOutGain:{value:1},uFoot:{value:new p},uLip:{value:Ge},uF:{value:Y},uR:{value:$}},Oe=(e={})=>Object.assign({uMoonDir:q.uMoonDir,uMoonCol:q.uMoonCol,uAmbCol:q.uAmbCol,uMistCol:q.uMistCol,uMist:q.uMist,uTime:q.uTime,uOutGain:q.uOutGain},e),X=new t.Group;X.name="outside",xe.add(X),await k.yield();const wt=j0({rng:j,preset:"night",bake:!0,renderer:_,zenith:K.zen,mid:K.mid,horizon:K.hor,ground:"#070f1c",horizonPow:3,stars:K.stars,twinkle:.85,starDensity:1,milkyWay:K.milky*.62,milkyAxis:[$.x,0,$.z],milkyAngle:be==="winter"?262:232,milkyColor:"#6f86c0",milkyCore:"#aebfe6",bodies:K.moon>0?[{direction:Qe.clone(),size:1.5,phase:.8,phaseAngle:35,intensity:.9*K.moon,dark:.02,glow:.2*K.moon,glowColor:"#9db8ff"}]:[],clouds:!1,clouds2:!1});X.add(wt.object),await k.yield();const a0=wt.colorAt(new p(Y.x,.04,Y.z).normalize(),new t.Color),n0=wt.colorAt(new p(Y.x*.4,.9,Y.z*.4).normalize(),new t.Color),qe=j.fork("terrain"),Pe=qe.range(0,100),i0=qe.range(142,166),r0=qe.range(124,150),s0=qe.range(9,17)*qe.sign(),at={x:Me.x+qe.range(21,26),k:Me.k+qe.range(4,12),h:qe.range(12.5,15),r2:qe.range(70,95)},me=e=>s0*Math.sin((e-150)/150)*S(150,380,e),ut=e=>me(e)+7*Math.sin(e/47+Pe)*S(150,200,e)+lo(5.08)*(1-S(134,230,e)),Ft=26.5,so=(Ft*Math.sin(6*ae)+Math.sqrt((Ft*Math.sin(6*ae))**2+2*9.8*(.3-we)))/9.8,lo=e=>-(.9*e+.42*e*e),Se={x:lo(so),k:Ft*Math.cos(6*ae)*so,r:24};function pe(e,o,r){const i=me(o),c=Math.abs(e-i),a=e<i?-1:1,m=S(260,610,o),l=S(640,820,o),n=G(74,9,m)+140*l+(r?0:7*I.n2(o*.008,Pe+a*5));let s=we+1.4+5*S(.35,1,c/Math.max(n,1));r||(s+=1.8*I.fbm2(e*.03+Pe,o*.03,3));const h=Math.hypot(e-Se.x,o-Se.k);if(s=G(we-3,s,S(Se.r-4,Se.r+5,h)),o>Se.k){const x=Math.abs(e-ut(o));s=Math.min(s,G(we-2.5,s,S(6.5,11,x)))}s+=at.h*Math.exp(-((e-at.x)**2+(o-at.k)**2)/at.r2);let y=s;const b=c-n;if(b>0){const x=G(52,135,m),f=b/x,v=Math.min(f,1);let T=(a<0?i0:r0)*(1-.42*S(180,620,o))*(1-.55*l)*(1+(r?0:.16*I.n2(o*.0045+Pe,a*3.1)))*Math.pow(v,.72);r||(T+=v*(7*I.fbm2(e*.021,o*.021+Pe,3)+5*Math.sin(T*.16+I.n2(o*.02,Pe)*2))),f>1&&(T+=(b-x)*.05+(r?0:6*I.n2(e*.01+Pe,o*.01))),y=s+T}const u=S(2,26,o),g=we+222*(1-S(-10,4,o))+(r?0:5*I.n2(e*.02,Pe+9)*(1-u))-8*u;return Math.max(y,g)}const Ao=34*ae,l0=Math.cos(Ao),c0=Math.sin(Ao);function Ye(e,o,r){let i=0;for(let c=1,a=7;c<=9;c++,a*=1.55){const m=pe(e-l0*a,r,!0)-(o+1.5+c0*a);m>0&&(i=Math.max(i,Math.min(1,m/14)))}return 1-.62*i}await k.yield();const Gt=gt("false-stars-beds:"+(k.seed??0)),Vo=-152,Fe=[Vo],Nt=[];for(;Fe[Fe.length-1]<96;){const e=Gt()<.4;Fe.push(Fe[Fe.length-1]+(e?Gt.range(13,21):Gt.range(6.5,11))),Nt.push(Gt())}Nt.push(.5);const Fo=e=>{const o=Ne(e,Vo,Fe[Fe.length-1]-.01);let r=0,i=Fe.length-1;for(;i-r>1;){const c=r+i>>1;Fe[c]<=o?r=c:i=c}return r+(o-Fe[r])/(Fe[r+1]-Fe[r])},vt=(e,o)=>G(74,9,S(260,610,e))+140*S(640,820,e)+7*I.n2(e*.008,Pe+o*5),Xe=4,nt=264,co=-5,No=63,Z={b:0,ao:1,tread:0,amp:0,out:0,q:0,tw:0},ft=new p,To=(e,o)=>Q0(e,o)+2.4*I.n2(e*.043+Pe,o*.043)+1*I.n2(e*.15,o*.15+Pe);function We(e,o,r){const i=pe(e,o);oe(e,0,o,ft);const c=Fo(i+To(ft.x,ft.z));if(r&&(r.b=c,r.ao=1,r.tread=0,r.amp=0,r.out=0,r.q=0,r.tw=0),o<=Xe||o>=nt)return i;const a=me(o),m=e<a?-1:1,l=Math.abs(e-a)-vt(o,m);if(l<=.5||l>=61.5)return i;let n=S(Xe+2,Xe+14,o)*(1-S(nt-60,nt-8,o))*S(.5,6,l)*(1-S(56,61.5,l));const s=Math.floor(c),h=c-s,y=Fe[s+1]-Fe[s],b=Nt[s],u=I.n2(ft.x*.017+s*7.13,ft.z*.017-s*3.71);n*=.35+.65*S(-.95,-.6,u+.5*I.n2(ft.x*.006+31,ft.z*.006));const g=Ne(.38+.32*b+.26*u,.14,.78),x=1-g,f=Math.min((.3+.8*Nt[(s+3)%Nt.length])*Ne(y/10,.6,1.6),.36*g*y/2.8)*n;let v,C,T=0,d,w;if(h<x)w=h/x,v=w<.72?w*1.18:.85+.075*(1-((1-w)/.28)**2),C=1-.7*(1-S(0,.5,w)),d=f*S(.3,.9,w);else{const A=(h-x)/g;w=1+A,v=.925+.075*A,C=1-.62*S(.45,1,A),T=1,d=f*(1-S(0,.45,A))}return r&&(r.ao=G(1,C,n),r.tread=T,r.amp=n,r.out=d,r.q=w,r.tw=g*y/2.8),i+n*y*(v-h)}const u0=(e,o)=>{const r=me(o),i=e<r?-1:1,c=Math.abs(e-r)-vt(o,i);return Ne(Math.min(c-co,No-c,o-Xe,nt-o)/9,0,1)};await k.yield();const v0=92,f0=132;let _t=null;{const e=v0,o=f0,r=(e+1)*(o+1),i=new Float32Array(r*3),c=new Float32Array(r*3),a=new Float32Array(r),m=new Float32Array(r*4),l=new Float32Array(r),n=new p,s=[];for(let d=0;d<=o;d++){const w=d/o,A=-24+380*w+600*w*w*w;for(let F=0;F<=e;F++){const B=F/e*2-1,E=Math.sign(B)*(110*Math.abs(B)+240*Math.abs(B)**3),P=d*(e+1)+F,N=pe(E,A),R=1.5;oe(E,N,A,n),i[P*3]=n.x,i[P*3+1]=n.y,i[P*3+2]=n.z;const V=(pe(E+R,A)-N)/R,M=(pe(E,A+R)-N)/R,z=Math.hypot(V,1,M);c[P*3]=(-V*$.x-M*Y.x)/z,c[P*3+1]=1/z,c[P*3+2]=(-V*$.z-M*Y.z)/z,a[P]=Ye(E,N,A),m[P*4]=Fo(N+To(n.x,n.z)),m[P*4+1]=1,l[P]=u0(E,A),(F&7)===7&&await k.yield()}await k.yield()}for(let d=0;d<o;d++)for(let w=0;w<e;w++){const A=d*(e+1)+w,F=A+e+1;s.push(A,A+1,F,A+1,F+1,F)}const h=new t.BufferGeometry;h.setAttribute("position",new t.BufferAttribute(i,3)),h.setAttribute("normal",new t.BufferAttribute(c,3)),h.setAttribute("aShade",new t.BufferAttribute(a,1)),h.setAttribute("aC",new t.BufferAttribute(m,4)),h.setAttribute("aCut",new t.BufferAttribute(l,1)),h.setAttribute("aD",new t.BufferAttribute(new Float32Array(r),1)),h.setIndex(s),h.computeBoundingSphere(),await k.yield(),_t=new t.ShaderMaterial({vertexShader:$0,fragmentShader:Y0,side:t.DoubleSide,uniforms:Oe({uLip:q.uLip,uF:q.uF,uR:q.uR,uFalls:{value:Q==="rain"?1:0},uWormC:{value:U.uniforms.uWormCol.value.clone().multiplyScalar(o0?.012:.026)}})});const y=new t.Mesh(h,_t);y.name="gorge",X.add(y),await k.yield();const b=[],u=[],g=[],x=[],f=[];for(let d=0;d<2;d++){const w=1150+d*650,A=b.length/3;for(let F=0;F<=40;F++){const B=(F/40-.5)*(2600+d*1600),E=-70+d*40+70*I.fbm2(F*.17+Pe,d*9.1,3)+6e-5*B*B;oe(B,E,w,n),b.push(n.x,n.y,n.z),oe(B,-260,w,n),b.push(n.x,n.y,n.z),g.push(.5,.5),x.push(.3,1,0,0,.3,1,0,0),f.push(0,0)}for(let F=0;F<40;F++){const B=A+F*2;u.push(B,B+1,B+2,B+2,B+1,B+3)}}const v=new t.BufferGeometry;v.setAttribute("position",new t.Float32BufferAttribute(b,3));const C=new Float32Array(b.length);for(let d=0;d<C.length;d+=3)C[d]=-Y.x*.6,C[d+1]=.8,C[d+2]=-Y.z*.6;v.setAttribute("normal",new t.BufferAttribute(C,3)),v.setAttribute("aShade",new t.Float32BufferAttribute(g,1)),v.setAttribute("aC",new t.Float32BufferAttribute(x,4)),v.setAttribute("aCut",new t.Float32BufferAttribute(f,1)),v.setAttribute("aD",new t.Float32BufferAttribute(f,1)),v.setIndex(u);const T=new t.Mesh(v,_t);T.name="far-ridges",T.frustumCulled=!1,X.add(T)}await k.yield();const Bo=async(e,o,r)=>{const i=[];for(let v=Xe;v<nt-1;v+=o*(1+1.5*S(110,250,v)))i.push(v);i.push(nt);const c=i.length,a=r+1,m=c*a,l=new Float32Array(m*3),n=new Float32Array(m*3),s=new Float32Array(m),h=new Float32Array(m*4),y=new Float32Array(m),b=new p,u=[];for(let v=0;v<c;v++){const C=i[v],T=me(C),d=vt(C,e);for(let w=0;w<a;w++){const A=co+(No-co)*(w/r),F=T+e*(d+A),B=v*a+w,E=We(F,C,Z);oe(F-e*Z.out,E,C,b),l[B*3]=b.x,l[B*3+1]=b.y,l[B*3+2]=b.z,h[B*4]=Z.b,h[B*4+1]=Z.ao,h[B*4+2]=Z.tread,h[B*4+3]=Z.amp,y[B]=Z.q,e>0&&(w%6===0||w===r)&&(s[B]=Ye(F,E,C)),(w&31)===31&&await k.yield()}if(e>0)for(let w=0;w<a;w++){if(w%6===0||w===r)continue;const A=w-w%6,F=Math.min(A+6,r);s[v*a+w]=G(s[v*a+A],s[v*a+F],(w-A)/(F-A))}else s.fill(1,v*a,v*a+a);await k.yield()}let g=0;for(let v=0;v<c;v++){for(let C=0;C<a;C++){const T=(v*a+C)*3,d=(v*a+Math.min(C+1,r))*3,w=(v*a+Math.max(C-1,0))*3,A=(Math.min(v+1,c-1)*a+C)*3,F=(Math.max(v-1,0)*a+C)*3,B=l[d]-l[w],E=l[d+1]-l[w+1],P=l[d+2]-l[w+2],N=l[A]-l[F],R=l[A+1]-l[F+1],V=l[A+2]-l[F+2],M=E*V-P*R,z=P*N-B*V,D=B*R-E*N,O=Math.hypot(M,z,D)||1;n[T]=M/O,n[T+1]=z/O,n[T+2]=D/O,g+=z/O}(v&15)===15&&await k.yield()}if(g<0)for(let v=0;v<n.length;v++)n[v]=-n[v];for(let v=0;v<c-1;v++)for(let C=0;C<r;C++){const T=v*a+C,d=T+a;u.push(T,T+1,d,T+1,d+1,d)}await k.yield();const x=new t.BufferGeometry;x.setAttribute("position",new t.BufferAttribute(l,3)),x.setAttribute("normal",new t.BufferAttribute(n,3)),x.setAttribute("aShade",new t.BufferAttribute(s,1)),x.setAttribute("aC",new t.BufferAttribute(h,4)),x.setAttribute("aCut",new t.BufferAttribute(new Float32Array(m),1)),x.setAttribute("aD",new t.BufferAttribute(y,1)),x.setIndex(u),x.computeBoundingSphere();const f=new t.Mesh(x,_t);f.name=e>0?"cliff-right":"cliff-left",X.add(f),await k.yield()};await Bo(1,2,98),await Bo(-1,3.4,52);{const e=Q==="rain",o=e?qe.fork("falls"):gt("false-stars-falls:"+(k.seed??0)),r=[],i=[],c=[],a=[],m=[],l=[],n=new p,s=Qe.dot($),h=Qe.dot(Y);for(const u of[-1,1]){const g=e?6+o.int(0,2):u>0?2:1;for(let x=0;x<g;x++){const f=e?16+(x+o.range(.15,.85))*(225/g):u>0?118+x*78+o.range(-10,10):o.range(150,200);let v=me(f)+u*(vt(f,u)+52*o.range(.62,.97)),C=f,T=0,d=0,w=0;const A=o.range(.3,.55)*(u>0?x%2===0||!e?2.6:.9:1.8),F=o(),B=r.length/3;for(let E=0;E<240;E++){const N=(pe(v+1.5,C)-pe(v-1.5,C))/3,R=(pe(v,C+1.5)-pe(v,C-1.5))/(2*1.5),V=Math.hypot(N,R),M=We(v,C,Z);if(M<we+7||C<7||V<.25)break;const z=Math.hypot(N,1,R),D=-N/z,O=1/z,J=-R/z,ve=Math.max(V,.001),H=-R/ve,le=N/ve,Ee=Ye(v,M,C)*S(-.15,.45,D*s+O*Qe.y+J*h);d>0&&(T+=Math.hypot(.5,M-w)),w=M,oe(v-u*Z.out,M,C,n);for(const ge of[-1,1])r.push(n.x,n.y,n.z),i.push($.x*H+Y.x*le,0,$.z*H+Y.z*le),c.push(ge,T,A,F),a.push(Z.b,Z.q,Z.amp),m.push(Ee);if(d>0){const ge=B+(d-1)*2;l.push(ge,ge+1,ge+2,ge+2,ge+1,ge+3)}d++,v-=N/ve*.5,C-=R/ve*.5}await k.yield()}}const y=new t.BufferGeometry;y.setAttribute("position",new t.Float32BufferAttribute(r,3)),y.setAttribute("aAcr",new t.Float32BufferAttribute(i,3)),y.setAttribute("aQ",new t.Float32BufferAttribute(c,4)),y.setAttribute("aB",new t.Float32BufferAttribute(a,3)),y.setAttribute("aS",new t.Float32BufferAttribute(m,1)),y.setIndex(l),y.boundingSphere=new t.Sphere(new p,1e5);const b=new t.Mesh(y,new t.ShaderMaterial({vertexShader:va,fragmentShader:fa,transparent:!0,depthWrite:!1,side:t.DoubleSide,premultipliedAlpha:!0,blending:t.CustomBlending,blendSrc:t.OneFactor,blendDst:t.OneMinusSrcAlphaFactor,uniforms:Oe()}));b.frustumCulled=!1,b.renderOrder=1.2,b.name="seep-falls",X.add(b)}await k.yield();{const e=new t.BufferGeometry,o=new p,r=[];for(const[c,a]of[[-260,30],[260,30],[260,980],[-260,980]])oe(c,we,a,o),r.push(o.x,o.y,o.z);e.setAttribute("position",new t.Float32BufferAttribute(r,3)),e.setIndex([0,2,1,0,3,2]),e.computeBoundingSphere(),oe(Se.x,we,Se.k,q.uFoot.value);const i=new t.Mesh(e,new t.ShaderMaterial({vertexShader:X0,fragmentShader:Z0,side:t.DoubleSide,uniforms:Oe({uFoot:q.uFoot,uSkyLow:{value:a0},uSkyHigh:{value:n0},uF:q.uF,uGlit:{value:K.glit}})}));i.name="pool",X.add(i)}const re={o:te.plume.origin.clone(),v:new p().copy(Y).multiplyScalar(Ft*Math.cos(6*ae)).setY(Ft*Math.sin(6*ae)),g:9.8};re.T=so+.12;const Wt=(e,o=new p)=>o.copy(re.o).addScaledVector(re.v,e).addScaledVector($,lo(e)).setY(re.o.y+re.v.y*e-.5*re.g*e*e),ht=Q==="rain"?2:be==="autumn"?1.35:1,h0=[];for(let e=0;e<2;e++){const i=[],c=[],a=[],m=new p,l=new p,n=new p;for(let b=0;b<=64;b++){const u=b/64*re.T,g=(2.3+.78*u)*Math.max(ht,1.42)*(e?1.55:1);Wt(u,m),l.copy(re.v).setY(re.v.y-re.g*u),n.crossVectors($,l).normalize().addScaledVector($,.25).normalize();for(let x=0;x<=8;x++){const f=x/8*2-1,v=(1-f*f)*(.5+.35*u)*(e?1.7:1)+(e?.4:0);i.push(m.x+$.x*f*g+n.x*v,m.y+n.y*v,m.z+$.z*f*g+n.z*v),c.push(f,u,g)}}for(let b=0;b<64;b++)for(let u=0;u<8;u++){const g=b*9+u,x=g+8+1;a.push(g,g+1,x,g+1,x+1,x)}const s=new t.BufferGeometry;s.setAttribute("position",new t.Float32BufferAttribute(i,3)),s.setAttribute("aQ",new t.Float32BufferAttribute(c,3)),s.setIndex(a),s.computeVertexNormals(),s.computeBoundingSphere();const h=new t.ShaderMaterial({vertexShader:aa,fragmentShader:na,transparent:!0,depthWrite:!1,side:t.DoubleSide,premultipliedAlpha:!0,blending:t.CustomBlending,blendSrc:t.OneFactor,blendDst:t.OneMinusSrcAlphaFactor,uniforms:Oe({uLayer:{value:e},uTmax:{value:re.T}})}),y=new t.Mesh(s,h);y.renderOrder=2+e,y.name="plume"+e,X.add(y),h0.push(h)}{const e=j.fork("clumps"),o=[],r=Math.round(120*Math.sqrt(ht));for(let a=0;a<r;a++)o.push(e(),e.range(-1,1),e.range(-.3,1.5),e.range(.55,1.35)*(e()<.2?1.6:1));const i=kt(r,{iPar:[o,4]}),c=new t.Mesh(i,new t.ShaderMaterial({vertexShader:ia,fragmentShader:ra,transparent:!0,depthWrite:!1,side:t.DoubleSide,premultipliedAlpha:!0,blending:t.CustomBlending,blendSrc:t.OneFactor,blendDst:t.OneMinusSrcAlphaFactor,uniforms:Oe({uPO:{value:re.o},uPV:{value:re.v},uPR:{value:$},uPT:{value:new t.Vector2(re.T,ht)}})}));c.frustumCulled=!1,c.renderOrder=3.5,c.name="plume-clumps",X.add(c)}await k.yield();const Do={value:1};{const e=j.fork("mist"),o=[],r=[],i=new p,c=(u,g,x,f,v,C)=>{oe(u,g,x,i),o.push(i.x,i.y,i.z),r.push(f,e(),v,C)},a=Q==="rain"?1.12:Q==="clear"?1:1.05;for(let u=0;u<Math.round(24*W);u++)c(Se.x+e.range(-13,9),we+e.range(0,4),Se.k+e.range(-9,12),e.range(8,17)*ht**.5,e.range(16,40),.3*a);for(let u=0;u<10;u++)c(Se.x+e.range(-9,8),we+e.range(2,9),Se.k+e.range(-9,9),e.range(8,14)*ht**.5,0,.38*a);for(let u=0;u<22;u++){const g=e.range(.9,re.T-.3);Wt(g,i);const x=ro(i);c(x.x+e.range(-4,3),x.y+e.range(-2,3),x.k+e.range(-2,6),e.range(3,9)*ht**.5,e.range(4,10),.13*a)}for(let u=0;u<Math.round(22*W);u++){const g=e.range(160,600),x=ut(g)+e.range(-55,55)*(1-.7*S(300,600,g));c(x,we+e.range(4,16),g,e.range(22,46),0,e.range(.1,.2)*a)}for(let u=0;u<9;u++)c(Me.x+e.range(-24,-3),Me.y-e.range(15,36),Me.k+e.range(4,34),e.range(8,14),0,.15*a);for(let u=0;u<6;u++)c(me(620)+e.range(-40,40),we+e.range(10,50),e.range(560,720),e.range(55,80),0,.22);const m=[],l=[],n=[],s=[];{const u=gt("false-stars-spray:"+(k.seed??0));for(let g=0;g<16;g++){const x=u.range(1.5,3.7);Wt(x,i);const f=ro(i),v=f.x+u.range(-3.5,2.5),C=f.y+u.range(-2,2.5),T=f.k+u.range(-2,4),d=u.range(3.2,6.2)*(.8+.12*x);oe(v,C,T,i),!(ie.distanceTo(i.x,i.y,i.z)<d*1.5+5)&&(n.push(i.x,i.y,i.z),s.push(d,u(),u.range(3,6),.2))}}{const u=ie.posAtDist(.86*ie.length,new p),g=zt.clone().sub(u).normalize(),x=new p().crossVectors(g,new p(0,1,0)).normalize(),f=new p().crossVectors(x,g),v=new p;for(const[C,T,d,w,A]of[[19,-14,60,9,.5],[26,-15.5,63,10.5,.58],[33.5,-14.5,62,9.5,.52],[23,-19,57,8.5,.42],[30.5,-19.5,59,8.5,.42]]){const F=C*ae,B=T*ae;v.copy(u).addScaledVector(g,d*Math.cos(F)*Math.cos(B)).addScaledVector(x,d*Math.sin(F)*Math.cos(B)).addScaledVector(f,d*Math.sin(B)),m.push(v.x,v.y,v.z),l.push(w,e(),0,A)}}const h=kt(r.length/4,{iPos:[o,3],iPar:[r,4]}),y=new t.Mesh(h,new t.ShaderMaterial({vertexShader:Co,fragmentShader:ko,transparent:!0,depthWrite:!1,premultipliedAlpha:!0,blending:t.CustomBlending,blendSrc:t.OneFactor,blendDst:t.OneMinusSrcAlphaFactor,uniforms:{uTime:q.uTime,uMoonDir:q.uMoonDir,uMoonCol:q.uMoonCol,uAmbCol:q.uAmbCol,uMistCol:q.uMistCol,uOutGain:q.uOutGain,uFoot:q.uFoot,uOp:{value:1},uDrift:{value:new p().addScaledVector(Y,.8).addScaledVector($,.25)}}}));y.frustumCulled=!1,y.renderOrder=4,y.name="mist",X.add(y);const b=new t.Mesh(kt(l.length/4,{iPos:[m,3],iPar:[l,4]}),new t.ShaderMaterial({vertexShader:Co,fragmentShader:ko,transparent:!0,depthWrite:!1,premultipliedAlpha:!0,blending:t.CustomBlending,blendSrc:t.OneFactor,blendDst:t.OneMinusSrcAlphaFactor,uniforms:{uTime:q.uTime,uMoonDir:q.uMoonDir,uMoonCol:q.uMoonCol,uAmbCol:q.uAmbCol,uMistCol:{value:Vt.clone().multiplyScalar(Ve==="dawn"?1.9:Ve==="moonless"?3.3:2.2).add(At.clone().multiplyScalar(.035))},uOutGain:q.uOutGain,uFoot:q.uFoot,uOp:Do,uDrift:{value:new p().addScaledVector(Y,.5).addScaledVector($,.15)}}}));if(b.frustumCulled=!1,b.renderOrder=4,b.name="mist-moonlit",X.add(b),s.length){const u=new t.Mesh(kt(s.length/4,{iPos:[n,3],iPar:[s,4]}),new t.ShaderMaterial({vertexShader:Co,fragmentShader:ko,transparent:!0,depthWrite:!1,premultipliedAlpha:!0,blending:t.CustomBlending,blendSrc:t.OneFactor,blendDst:t.OneMinusSrcAlphaFactor,uniforms:{uTime:q.uTime,uMoonDir:q.uMoonDir,uMoonCol:q.uMoonCol,uAmbCol:q.uAmbCol,uMistCol:b.material.uniforms.uMistCol,uOutGain:q.uOutGain,uFoot:q.uFoot,uOp:{value:1},uDrift:{value:new p().addScaledVector(Y,.5).addScaledVector($,.15)}}}));u.frustumCulled=!1,u.renderOrder=4,u.name="fall-spray",X.add(u)}}const Ut=Q==="cloudsea"||Q==="brim",d0=Ge.y+_e,m0=Q==="brim"?.14:0;if(Ut){const e=Q==="brim",o=58,r=84,i=[],c=[],a=[],m=[],l=new p;for(let P=0;P<2;P++){const N=_e+P*7,R=i.length/3;for(let V=0;V<=r;V++){const M=2+1100*Math.pow(V/r,1.7),z=me(M);for(let D=0;D<=o;D++){const O=D/o*2-1,J=z+Math.sign(O)*(120*Math.abs(O)+110*O*O);oe(J,N,M,l),i.push(l.x,l.y,l.z),c.push(P),a.push(N-pe(J,M))}(V&7)===7&&await k.yield()}for(let V=0;V<r;V++)for(let M=0;M<o;M++){const z=R+V*(o+1)+M,D=z+o+1;m.push(z,D,z+1,z+1,D,D+1)}}const n=new t.BufferGeometry;n.setAttribute("position",new t.Float32BufferAttribute(i,3)),n.setAttribute("aLayer",new t.Float32BufferAttribute(c,1)),n.setAttribute("aEdge",new t.Float32BufferAttribute(a,1)),n.setIndex(m),n.boundingSphere=new t.Sphere(new p,1e5);const s=[Me.x+2,Me.k-8,-10,104],h=e?30:27,y=io("#3f66b0",e?.1:0),b=oe(s[0],0,s[1],new p),u=oe(s[2],0,s[3],new p),g=new p().addScaledVector(Y,.8).addScaledVector($,.25),x=new t.Mesh(n,new t.ShaderMaterial({vertexShader:sa,fragmentShader:la,transparent:!0,depthWrite:!1,side:t.DoubleSide,premultipliedAlpha:!0,blending:t.CustomBlending,blendSrc:t.OneFactor,blendDst:t.OneMinusSrcAlphaFactor,uniforms:Oe({uDeck:{value:new t.Vector4(.96,h,0,e?.92:1)},uHole:{value:b},uHole2:{value:u},uDrift:{value:g},uGap:{value:e?0:1},uShade:{value:y}})}));x.frustumCulled=!1,x.renderOrder=1.5,x.name="cloud-floor",X.add(x),await k.yield();const f=qe.fork("cloud-heads"),v=[],C=(P,N)=>_e-pe(P,N),T=(P,N,R)=>{const V=me(N);let M=0,z=260;if(pe(V+P*z,N)<R)return z;for(let D=0;D<12;D++){const O=(M+z)/2;pe(V+P*O,N)<R?M=O:z=O}return M},d=(P,N,R,V)=>{const M=me(R),z=P<M?-1:1,D=(P-M)*z,O=T(z,R,N)-D-2.5,J=T(z,R,N-V)-D-2.5;return[$.x*z,$.z*z,O,Ne((O-J)/Math.max(V,1),0,3)]},w=(P,N)=>{const R=s[0]-s[2],V=s[1]-s[3],M=Ne(((P-s[2])*R+(N-s[3])*V)/(R*R+V*V),0,1);return Math.hypot(P-s[2]-R*M,N-s[3]-V*M)};for(const P of[-1,1])for(let N=6+f.range(0,6);N<560;N+=f.range(6,11)*(1+N/450)){const R=me(N);let V=0,M=230;if(C(R+P*M,N)>8)continue;for(let H=0;H<11;H++){const le=(V+M)/2;C(R+P*le,N)>8?V=le:M=le}const z=f.range(8,15)*(1+N/600),D=R+P*(V-z*f.range(.15,.5)),O=_e+f.range(-1,4),J=f(),ve=f.range(.55,.8);oe(D,O,N,l),!(ie.distanceTo(l.x,l.y,l.z)<z+12||w(D,N)<h*.8)&&v.push([l.x,l.y,l.z,z,J,ve,.86,N,...d(D,O,N,z*ve)])}await k.yield();for(let P=0,N=0,R=Math.round(84*W);P<500&&N<R;P++){const V=18+540*Math.pow(f(),1.2),M=me(V)+f.range(-1,1)*88,z=f.range(12,26)*(1+V/900),D=f(),O=f.range(.5,.72),J=f.range(.1,.3);C(M,V)<16||w(M,V)<z*.7+h*.9||(oe(M,_e+z*J,V,l),!(ie.distanceTo(l.x,l.y,l.z)<z+14)&&(v.push([l.x,l.y,l.z,z,D,O,.9,V,...d(M,_e+z*J,V,z*O)]),N++,(P&63)===63&&await k.yield()))}for(let P=0;P<9;P++){const N=Me.k-64+P*24+f.range(-5,5),R=Me.x+40+P*37%31+f.range(-4,4),V=f.range(15,23),M=f(),z=f.range(.55,.72);C(R,N)<12||(oe(R,_e+V*.22,N,l),!(ie.distanceTo(l.x,l.y,l.z)<V+14)&&v.push([l.x,l.y,l.z,V,M,z,.92,N,...d(R,_e+V*.22,N,V*z)]))}v.sort((P,N)=>N[7]-P[7]);const A=[],F=[],B=[];for(const P of v)A.push(P[0],P[1],P[2]),F.push(P[3],P[4],P[5],P[6]),B.push(P[8],P[9],P[10],P[11]);const E=new t.Mesh(kt(v.length,{iPos:[A,3],iPar:[F,4],iWall:[B,4]}),new t.ShaderMaterial({vertexShader:ca,fragmentShader:ua,transparent:!0,depthWrite:!1,premultipliedAlpha:!0,blending:t.CustomBlending,blendSrc:t.OneFactor,blendDst:t.OneMinusSrcAlphaFactor,uniforms:{uTime:q.uTime,uMoonDir:q.uMoonDir,uMoonCol:q.uMoonCol,uAmbCol:q.uAmbCol,uMistCol:q.uMistCol,uMist:q.uMist,uOutGain:q.uOutGain,uDrift:{value:g},uHeadK:{value:e?.92:1},uShade:{value:y}}}));E.frustumCulled=!1,E.renderOrder=1.8,E.name="cloud-heads",X.add(E)}await k.yield();const Ro=(e,o)=>Math.hypot(pe(e+3,o)-pe(e-3,o),pe(e,o+3)-pe(e,o-3))/6,L=new p,jt=(e,o,r,i)=>(oe(e,o,r,L),ie.distanceTo(L.x,L.y,L.z)>i+7),uo=be==="winter"?1:0,p0=e=>new t.ShaderMaterial({vertexShader:J0,fragmentShader:ea,side:e?t.DoubleSide:t.FrontSide,uniforms:Oe({uLump:{value:e},uFoot:q.uFoot,uFrost:{value:e?uo*.35:uo}})});{const e=j.fork("canopy"),o=[],r=[],i=[],c=Math.round(1180*W),a=new t.Color(.05,.155,.12),m=new t.Color(.1,.155,.06),l=new t.Color(.035,.13,.15),n=new t.Color;let s=0;for(let y=0;y<c*6&&s<c;y++){(y&15)===15&&await k.yield();const b=10+650*Math.pow(e(),1.35),u=me(b)+e.gauss()*85;if(Math.abs(u)>300)continue;const g=We(u,b);if(g<we+.7)continue;const x=Ro(u,b);if(x>.62||x>.4&&e()<.5)continue;const f=G(2.7,9.6,Math.pow(e(),1.6))*(1+b/900);jt(u,g+f*.4,b,f*1.15+10)&&(b>Se.k-6&&Math.abs(u-ut(b))<7.5+f*1.1||(oe(u,g+f*(.22-.3*x),b,L),o.push(L.x,L.y,L.z),r.push(f*e.range(.9,1.3),f*e.range(.6,.95),f*e.range(.9,1.3),e.range(0,Ce)),n.copy(a).lerp(e()<.5?m:l,e()*.8).multiplyScalar(e.range(.75,1.5)),i.push(n.r,n.g,n.b,Ye(u,g+f,b)),s++))}for(let y=0,b=0,u=Math.round(70*W);y<u*30&&b<u;y++){(y&31)===31&&await k.yield();const g=e()<.75?1:-1,x=Xe+8+(nt-50-Xe)*e(),f=e.range(3,56),v=me(x)+g*(vt(x,g)+f),C=We(v,x,Z),T=Z.q-1;if(Z.tread<.5||Z.amp<.45||Z.tw<2.2||T<.3||T>.8)continue;const d=Math.min(3.4,Z.tw*e.range(.5,.75));jt(v,C+d*.4,x,d+6)&&(oe(v,C+d*.3,x,L),o.push(L.x,L.y,L.z),r.push(d*e.range(.9,1.3),d*e.range(.6,.9),d*e.range(.9,1.3),e.range(0,Ce)),n.copy(a).lerp(e()<.5?m:l,e()*.8).multiplyScalar(e.range(.75,1.4)),i.push(n.r,n.g,n.b,Ye(v,C+d,x)),s++,b++)}const h=new t.Mesh(St(new t.IcosahedronGeometry(1,1),s,{iPos:[o,3],iScl:[r,4],iCol:[i,4]}),p0(1));h.frustumCulled=!1,h.name="canopy",X.add(h)}await k.yield();{const e=j.fork("ferns"),o=[],r=[],i=[],c=[],a=new t.Color,m={mamaku:{R:[3.2,4],trunk:[9,17],lift:0,silver:.15,col:[.07,.23,.11]},ponga:{R:[2.2,2.9],trunk:[4,8],lift:.05,silver:1,col:[.08,.21,.14]},wheki:{R:[1.6,2.1],trunk:[3,6],lift:.12,silver:.3,col:[.06,.17,.08]},nikau:{R:[2.5,3.1],trunk:[8,12],lift:1,silver:.2,col:[.06,.19,.085]}},l=(d,w,A,F,B,E=1)=>{const P=m[d],N=We(w,A);if(!B&&(N<we+.6||Ro(w,A)>1))return!1;const R=e.range(P.R[0],P.R[1])*E;let V=e.range(P.trunk[0],P.trunk[1])*(E>1?1.15:1),M=!1;for(let z=0;z<5&&!M;z++)jt(w,N+V+R*.3,A,R)?M=!0:V*=.66;return!M||V<1.6?!1:(oe(w,N+V,A,L),o.push(L.x,L.y,L.z),r.push(R,V+1,P.lift,e()),a.setRGB(P.col[0],P.col[1],P.col[2]).multiplyScalar(e.range(.8,1.45)),a.g*=e.range(.9,1.15),i.push(a.r,a.g,a.b,Ye(w,N+V,A)),c.push(F?F[0]:e.range(-.06,.06),F?F[1]:e.range(-.06,.06),P.silver),!0)},n=()=>{const d=e();return d<.46?"mamaku":d<.76?"ponga":d<.9?"wheki":"nikau"};for(let d=0,w=9+e.int(0,3);d<w;d++){const A=d/w*Ce+e.range(-.2,.2),F=e.range(10.5,15.5);l(d%3?"mamaku":"ponga",Me.x+Math.cos(A)*F,Me.k+10+Math.sin(A)*F*.9)}l("nikau",at.x-2.2,at.k+1.5,[.3*$.x-.1*Y.x,.3*$.z-.1*Y.z].map(d=>-d),!0),l("nikau",at.x+2.6,at.k-2,[-.12*$.x-.22*Y.x,-.12*$.z-.22*Y.z],!0);const s=170,h=Math.round(330*W),y=170;await k.yield();for(let d=0,w=0;d<s*5&&w<s;d++){const A=e.range(0,Ce),F=Se.r+2+75*Math.pow(e(),1.3),B=Se.x+8+Math.cos(A)*F*1.1,E=Se.k+6+Math.sin(A)*F;E<14||(l(n(),B,E)&&w++,(d&15)===15&&await k.yield())}{const d=gt("false-stars-glide-ferns:"+(k.seed??0));for(let w=0,A=0;w<y*6&&A<y;w++){const F=Me.k-14+150*Math.pow(d(),.85),B=d.sign()*d.range(9,84),E=ut(F)+B,P=d();l(P<.56?"mamaku":P<.8?"nikau":"ponga",E,F,null,!1,1.28)&&A++,(w&15)===15&&await k.yield()}}for(let d=0,w=0;d<h*5&&w<h;d++){const A=60+520*e(),F=ut(A)+e.sign()*e.range(9,70)*(1-.6*S(300,600,A));l(n(),F,A)&&w++,(d&15)===15&&await k.yield()}await k.yield();const b=r.length/4,u=new t.Mesh(St(t0(),b,{iPos:[o,3],iPar:[r,4],iCol:[i,4],iLean:[c,3]}),new t.ShaderMaterial({vertexShader:ta,fragmentShader:oa,side:t.DoubleSide,uniforms:Oe({uFoot:q.uFoot})}));u.frustumCulled=!1,u.name="tree-ferns",X.add(u),await k.yield();const g=j.fork("cliff-ferns"),x=[],f=[],v=[],C=[];for(let d=0,w=0,A=Math.round(720*W);d<A*16&&w<A;d++){(d&31)===31&&await k.yield();const F=g()<.74?1:-1,B=Xe+6+(nt-40-Xe)*Math.pow(g(),1.3),E=g.range(2,57),P=me(B)+F*(vt(B,F)+E),N=We(P,B,Z),R=Z.q-1;if(Z.tread<.5||Z.amp<.3||R>(g()<.7?.38:.9)||N>44||N<we+6||!jt(P,N,B,4))continue;const V=g.range(1.3,2.9)*(.75+.25*Math.min(1.6,Z.tw/2));oe(P-F*(Z.out+.3),N+.3,B,L),x.push(L.x,L.y,L.z),f.push(V,.8,g.range(-.4,-.15),g());const M=g.range(.8,1.5);v.push(.05*M,.165*M*g.range(.9,1.15),.085*M,Ye(P,N+1,B)),C.push(0,0,.45),w++}const T=new t.Mesh(St(t0(7,3,!1),f.length/4,{iPos:[x,3],iPar:[f,4],iCol:[v,4],iLean:[C,3]}),u.material);T.frustumCulled=!1,T.name="cliff-ferns",X.add(T)}await k.yield();{const e=j.fork("rimu"),o=lt();o.tube([new p(0,0,0),new p(.008,.5,.004),new p(0,1,0)],[.02,.012,.003],5,-1);const r=7,i=6;for(let f=0;f<r;f++){const v=.5+.48*(f/(r-1)),C=.15*Math.pow(Math.sin(Math.PI*Ne((v-.4)/.64,.06,.94)),.6)+.02,T=f===r-1?1:3,d=e.range(0,Ce);for(let w=0;w<T;w++){const A=d+w/T*Ce+e.range(-.5,.5),F=Math.cos(A),B=Math.sin(A),E=C*e.range(.45,1)*(T===1?0:1),P=e.range(.13,.21)*(1.1-.3*v),N=e.range(.065,.1)*(1.15-.3*v)*(T===1?1.25:1),R=v+e.range(-.035,.035),V=o.v(F*E*.25,R+.025,B*E*.25,0),M=[],z=[];for(let D=0;D<i;D++){const O=D/i*Ce,J=Math.cos(O),ve=Math.sin(O),H=e.range(.8,1.2);M.push(o.v(F*E*.7+J*N*.72,R-P*.22,B*E*.7+ve*N*.72,.4)),z.push(o.v(F*E+J*N*H,R-P*e.range(.8,1.15),B*E+ve*N*H,1))}for(let D=0;D<i;D++){const O=(D+1)%i;o.tri(V,M[O],M[D]),o.quad(M[D],M[O],z[O],z[D])}}}const c=[],a=[],m=[];for(const f of[-1,1])for(let v=12+e.range(0,10);v<600;v+=e.range(8,19)){const C=S(260,610,v),T=me(v)+f*(G(74,9,C)+G(52,135,C)*e.range(.98,1.3)),d=We(T,v),w=e.range(31,46);oe(T,d-1,v,L),c.push(L.x,L.y,L.z),a.push(w*e.range(1,1.25),w,w*e.range(1,1.25),e.range(0,Ce));const A=e.range(.9,1.5);m.push(.035*A,.075*A,.045*A,Ye(T,d+w*.7,v))}const l=[],n=[],s=[];for(const[f,v]of[[14,25],[4,-27],[44,19]]){const C=Me.k+f,T=ut(C)+v,d=We(T,C),w=Me.y-13-d+e.range(-4,1);if(oe(T,d-1,C,L),ie.distanceTo(L.x,L.y+w,L.z)<17)continue;l.push(L.x,L.y,L.z),n.push(w*e.range(.95,1.1),w,w*e.range(.95,1.1),e.range(0,Ce));const A=e.range(1,1.5)*1.5;s.push(.035*A,.078*A,.047*A,Ye(T,d+w*.7,C))}const h=gt("false-stars-giants:"+(k.seed??0)),y=lt(),b=15,u=5;y.tube([new p(0,0,0),new p(.006,.5,.003),new p(0,1,0)],[.021,.012,.003],6,-1);for(let f=0;f<b;f++){const v=.4+.585*(f/(b-1)),C=Math.pow(Math.sin(Math.PI*Ne((v-.34)/.68,.05,.97)),.7),T=f>=b-2?3:5,d=h.range(0,Ce);for(let w=0;w<T;w++){const A=d+w/T*Ce+h.range(-.35,.35),F=Math.cos(A),B=Math.sin(A),E=(.035+.125*C)*h.range(.7,1.15),P=(.05+.055*C)*h.range(.8,1.25),N=v+h.range(-.012,.012),R=h.range(.1,.35),V=[];for(let M=0;M<=u;M++){const z=M/u,D=E*(.06+.94*z),O=N+E*(R*z-.62*z*z),J=F*D,ve=B*D,H=E*(.05+.16*Math.sin(Math.PI*Math.min(1,z*1.1))),le=P*(.3+.7*Math.sin(Math.PI*Math.min(1,.15+z*.95))),Ee=[y.v(J,O,ve,0)];for(const ge of[-1,1]){const mt=h.range(.8,1.25);Ee.push(y.v(J-B*ge*H*.6,O-le*.42,ve+F*ge*H*.6,.45),y.v(J-B*ge*H+F*le*.08,O-le*mt,ve+F*ge*H+B*le*.08,1))}V.push(Ee)}for(let M=0;M<u;M++){const z=V[M],D=V[M+1];y.quad(z[0],D[0],D[1],z[1]),y.quad(z[1],D[1],D[2],z[2]),y.quad(D[0],z[0],z[3],D[3]),y.quad(D[3],z[3],z[4],D[4])}}}await k.yield();const g=f=>new t.ShaderMaterial({vertexShader:ha,fragmentShader:da,side:t.DoubleSide,uniforms:Oe({uFrost:{value:uo},uStr:{value:new p(f[0],f[1],f[2])}})}),x=new t.Mesh(St(o.geometry("aS",1),a.length/4,{iPos:[c,3],iScl:[a,4],iCol:[m,4]}),g([1,1.05,.22]));if(x.frustumCulled=!1,x.name="rimu",X.add(x),n.length){const f=new t.Mesh(St(y.geometry("aS",1),n.length/4,{iPos:[l,3],iScl:[n,4],iCol:[s,4]}),g([2.3,1.25,.33]));f.frustumCulled=!1,f.name="rimu-giants",X.add(f)}}await k.yield();const It=new t.Vector2(800,450),g0={value:It},Ze=(e,o,r,i,c)=>{const a=new t.ShaderMaterial({vertexShader:c.vert||ga(i),fragmentShader:c.frag||wa,transparent:!0,depthWrite:!1,blending:t.AdditiveBlending,uniforms:{uRes:g0,uTime:q.uTime,uPx:{value:new t.Vector3(c.px[0],c.px[1],c.px[2]??.06)},uBright:{value:c.bright},uColA:{value:new t.Color().setRGB(...c.a)},uColB:{value:new t.Color().setRGB(...c.b)}}}),m=new t.Mesh(kt(o,r),a);return m.frustumCulled=!1,m.renderOrder=5,m.name=e,m},ue=U.uniforms.uWormCol.value;{const e=j.fork("outworms"),o=[],r=[];for(let c=0;c<4e3&&r.length<2400;c++){c%500===499&&await k.yield();const a=5+330*Math.pow(e(),1.3),m=.02+.55*e(),l=S(260,610,a),n=me(a)-(G(74,9,l)+G(52,135,l)*m);if(I.n2(a*.035+Pe,m*5)+.5*I.n2(a*.11,m*15+Pe)<.05||Ut&&pe(n,a)<_e+9)continue;oe(n+.7,We(n,a)+.6,a,L),o.push(L.x,L.y,L.z);const s=e();r.push(.16+.3*s*s,e(),0,0)}const i=Ze("wall-worms",r.length/4,{iPos:[o,3],iPar:[r,4]},Jo,{px:[1.1,.006],bright:2.6,a:[ue.r*.85,ue.g,ue.b],b:[ue.r,ue.g*.95,ue.b*1.1]});X.add(i)}await k.yield();{const e=gt("false-stars-ledgeworms:"+(k.seed??0)),o=[],r=[];for(let c=0;c<9e3&&r.length<3600;c++){c%250===249&&await k.yield();const a=14+215*Math.pow(e(),1.2),m=e.range(1.5,52),l=me(a)+vt(a,1)+m;if(I.n2(a*.045+Pe*3,m*.07)+.4*I.n2(a*.15,m*.21+Pe)<.12)continue;const n=We(l,a,Z);if(Z.tread>.5||Z.amp<.5||Z.q<.08||Z.q>.5||Ut&&n<_e+9||(oe(l-Z.out-.35,n,a,L),ie.distanceTo(L.x,L.y,L.z)<5))continue;o.push(L.x,L.y,L.z);const s=e();r.push(.15+.28*s*s,e(),0,0)}const i=Ze("ledge-worms",r.length/4,{iPos:[o,3],iPar:[r,4]},Jo,{px:[1.1,.006],bright:2.2,a:[ue.r*.85,ue.g,ue.b],b:[ue.r,ue.g*.95,ue.b*1.1]});X.add(i)}await k.yield();const Tt=new t.Group;Tt.name="placed-stars",X.add(Tt);{const e=j.fork("stars"),o=[],r=[],i=2500,c=(n,s,h=new p)=>h.set(0,0,0).addScaledVector(Y,Math.cos(n*ae)*Math.cos(s*ae)).addScaledVector($,Math.sin(n*ae)*Math.cos(s*ae)).setY(Math.sin(s*ae)),a=(n,s,h)=>{c(n,s,L),o.push(L.x*i,L.y*i,L.z*i),r.push(4,e(),h,0)};for(const n of[[-12.5,12.6,1],[-8.2,15.8,.8],[-1,20.6,.9],[2.3,24.4,.75],[-1.9,26.8,.7],[-4.6,23.9,.5],[-2.7,22.7,.3],[3.4,33.5,.55],[6.5,40.5,.85],[-4.2,37.6,.45],[1.2,46.5,.5],[9.2,29.6,.4],[-9.5,31.5,.35]])a(...n);for(let n=0;n<26;n++)a(e.range(-80,80),e.range(7,62),e.range(.2,.5));Tt.add(Ze("stars",r.length/4,{iPos:[o,3],iPar:[r,4]},ba,{px:[1.25,.0042],bright:3.2*(.55+.45*K.stars),a:[1,1,1],b:[.78,.86,1]}));const m=(n,s,h,y,b,u)=>{const g=new t.Mesh(new t.PlaneGeometry(2,2),new t.ShaderMaterial({vertexShader:e0,transparent:!0,depthWrite:!1,premultipliedAlpha:!0,blending:t.CustomBlending,blendSrc:t.OneFactor,blendDst:t.OneMinusSrcAlphaFactor,uniforms:{uC:{value:new t.Vector4(y[0],y[1],y[2],b)}},fragmentShader:`uniform vec4 uC; varying vec2 vUV; ${Ct} void main(){ float r2=dot(vUV,vUV); float n=vn3(vec3(vUV*2.3,uC.a*9.0)); float a=1.0-smoothstep(0.0,1.0,r2+0.7*(n-0.5)); a*=a*(1.0-smoothstep(0.7,1.0,r2)); gl_FragColor=vec4(uC.rgb*a,uC.a*a); }`}));c(n,s,g.position).multiplyScalar(i*(u?.98:1.02)),g.scale.setScalar(i*Math.tan(h*ae)),g.lookAt(0,0,0),g.renderOrder=u?5:1,g.frustumCulled=!1,Tt.add(g)};m(2.6,21.2,3.4,[0,0,0],.72*Math.min(1,K.milky),0);const l=Ve==="moonless"?2.2:1;m(33,26,4.6,[.012*l*K.stars,.016*l*K.stars,.024*l*K.stars],0,1),m(24,16.5,2.6,[.014*l*K.stars,.018*l*K.stars,.026*l*K.stars],0,1)}await k.yield();const vo=ee?.6:.85,Ht=Ze("chandelier-halo",2,{iPos:[[0,te.chandelier.position.y,0,0,-te.chandelier.position.y,0],3],iPar:[[2.6,.3,0,0,2.6,.7,0,0],4]},"br=1.0;",{px:[1,.5,1],bright:0,a:[ue.r,ue.g,ue.b],b:[ue.r,ue.g,ue.b]});Ht.visible=!1,U.object.add(Ht);{const e=j.fork("mayflies"),o=[],r=[],i=new p,c=new p,a=Math.round(ee?4e3*Math.max(W,.7):600*de*W),m=ee?ce+20:ke-8;for(let n=0;n<a;n++){const s=ee&&e()<.62?e.range(-10,he-4):e.range(-16,m),h=s>Ke+8&&s<ke-10,y=s<he-10;te.pathAt(s,i),te.pathAt(s+1.5,c);const b=c.x-i.x,u=c.z-i.z,g=Math.hypot(b,u)||1,x=h?e.range(-11,11):y?e()<.5?e.range(-3.4,3.4):e.range(-7.5,9)*(s<8?1.3:1):e.range(-2.3,2.3);o.push(i.x+-u/g*x,i.y-.8,i.z+b/g*x);const f=e(),v=.016+.034*f*f;r.push(v,e(),(h?e.range(3,8):y?e.range(2.2,4.4):e.range(1.2,1.9))+(ee?.5:0),e.range(.04,.085)*(ee?.75:1)*(h?.6:1)),n%500===499&&await k.yield()}const l=Ze("mayflies",a,{iPos:[o,3],iPar:[r,4]},"",{px:[1,.0068,.62],vert:So,frag:zo,bright:vo,a:[.78,.86,.94],b:[.66,.8,.93]});if(U.object.add(l),ee){const n=[],s=[];for(let h=0;h<Math.round(520*Math.max(W,.7));h++){ie.pointAt(e.range(.652,.86),i);const y=e();n.push(i.x+e.range(-26,26),i.y+e.range(-16,8),i.z+e.range(-18,18)),s.push(.02+.04*y*y,e(),e.range(5,11),e.range(.03,.07))}X.add(Ze("hatch",s.length/4,{iPos:[n,3],iPar:[s,4]},"",{px:[1,.0068,.45],vert:So,frag:zo,bright:.22+.2*K.key,a:[.78,.86,.94],b:[.66,.8,.93]}))}}{const e=te.ranks.great,o=gt("false-stars-organflies:"+(k.seed??0)),r=Math.round(230*Math.max(W,.7)),i=[],c=[];for(let m=0;m<r;m++){const l=o();i.push(e.position.x,0,e.position.z),c.push(.03+.04*l*l,o(),Math.min(e.top+1.5,11)*o.range(.7,1),o.range(.034,.06))}const a=Ze("organ-flies",r,{iPos:[i,3],iPar:[c,4]},"",{px:[1.5,.0068,.7],vert:ya,frag:zo,bright:vo*1.1,a:[.74,.85,1],b:[.62,.78,1]});a.visible=!1,U.object.add(a)}await k.yield();let Bt=null;fe>0&&(Bt=I0.makeFlock({rng:j.fork("bats"),species:"bats",count:fe,size:.6,spread:[5.4,3,13],wander:[1.6,1.2,2,1.5],light:{sunDir:[Qe.x,Qe.y,Qe.z],sunColor:K.keyCol,sunIntensity:.35,sky:"#22345e",skyIntensity:.3,ground:"#070a12",groundIntensity:.2},palette:{body:"#08090c",belly:"#0a0b0e",wingC:"#0b0c10",trail:"#0d0e12",tip:"#060608",beak:"#050506",head:"#08090c",legC:"#050505"},along:{path:ie,side:-1,up:1.5,lead:22,from:.57,to:.84,tread:110,drift:4}}),xe.add(Bt.object),await k.yield());let Je=null;const Qt=6,w0=[[-.2,.64,3.5,1.7,2.3],[.2,.44,4.2,2.1,1.6],[.36,.78,3.9,1.4,2.6],[-.62,-.1,3.4,1.9,2.2],[-.32,-.27,3.6,2.4,1.5],[0,.3,4.3,1.6,2]];if(fe>0){const e=lt(),o=(n,s,h,y=0,b=.5)=>e.v(n,s,h,[y,b]),r=(n,s,h,y,b,u)=>{const f=e.pos.length/3;for(let v=0;v<=4;v++)for(let C=0;C<6;C++){const T=v/4*Math.PI,d=C/6*Ce;o(n+Math.sin(T)*Math.cos(d)*y,s+Math.sin(T)*Math.sin(d)*b,h-Math.cos(T)*u)}for(let v=0;v<4;v++)for(let C=0;C<6;C++){const T=f+v*6+C,d=f+v*6+(C+1)%6;e.quad(T,d,d+6,T+6)}};r(0,0,.03,.05,.045,.14),r(0,.014,-.125,.044,.04,.052);for(const n of[-1,1]){const s=e.pos.length/3;o(n*.01,.04,-.135),o(n*.052,.03,-.12),o(n*.045,.105,-.12),e.tri(s,s+1,s+2)}const i=[0,.12,.24,.35,.47,.6,.7,.8,.9,1],c=[0,.35,.6,.8,1],a=[.18,.13,.105,.09,.055];for(const n of[-1,1]){const s=e.pos.length/3;for(const h of i){const y=h<.45?G(-.07,-.2,Math.sin(Math.PI*.5*h/.45)):G(-.2,.05,Math.pow((h-.45)/.55,1.5));let b=0;for(;b<3&&h>c[b+1];)b++;const u=(h-c[b])/(c[b+1]-c[b]),g=Math.max(y+.004,G(a[b],a[b+1],u)-.075*Math.sin(Math.PI*u)*(1-.4*h));for(let x=0;x<=2;x++){const f=x/2;o(n*(.045+h*.455),.012*Math.sin(f*Math.PI)+.01,G(y,g,f),n*h,f)}}for(let h=0;h<i.length-1;h++)for(let y=0;y<2;y++){const b=s+h*3+y,u=b+3;e.quad(b,b+1,u+1,u)}}const m=e.geometry("aW",2),l=new Float32Array(Qt);for(let n=0;n<Qt;n++)l[n]=(n*.618+.13)%1;m.setAttribute("iPh",new t.InstancedBufferAttribute(l,1)),Je=new t.InstancedMesh(m,new t.ShaderMaterial({vertexShader:Sa,fragmentShader:za,side:t.DoubleSide,uniforms:Oe()}),Qt),Je.frustumCulled=!1,Je.name="bats-near",Je.visible=!1,X.add(Je)}const $t=new p,Ko=new p,Oo=new p,qo=new p,dt=new p,it=new p,fo=new p,yt=new p,Yt=new t.Matrix4,bt=(()=>{const e=lt(),o=(c,a,m,l=0,n=.5)=>e.v(c,a,m,[l,n]),r=(c,a,m,l,n,s)=>{const b=e.pos.length/3;for(let u=0;u<=6;u++)for(let g=0;g<9;g++){const x=u/6*Math.PI,f=g/9*Ce;o(c+Math.sin(x)*Math.cos(f)*l,a+Math.sin(x)*Math.sin(f)*n,m-Math.cos(x)*s)}for(let u=0;u<6;u++)for(let g=0;g<9;g++){const x=b+u*9+g,f=b+u*9+(g+1)%9;e.quad(x,f,f+9,x+9)}};r(0,0,.03,.09,.074,.2),r(0,.016,-.16,.108,.09,.096);{const c=e.pos.length/3,a=6;o(0,.004,.14);for(let m=0;m<=a;m++){const l=(m/a-.5)*1.5;o(Math.sin(l)*.2,0,.14+Math.cos(l)*.2+.012*Math.cos(m*Math.PI))}for(let m=0;m<a;m++)e.tri(c,c+1+m,c+2+m)}for(const c of[-1,1]){const l=e.pos.length/3;for(let n=0;n<=11;n++){const s=n/11,h=Math.sqrt(Math.max(0,1-Math.pow(s,3.2))),y=(.3+.06*Math.sin(Math.PI*Math.min(1,s/.75)))*(.38+.62*h)+.012,b=-.16-.035*Math.sin(Math.PI*Math.pow(s,.8))+.075*s*s;for(let u=0;u<=4;u++){const g=u/4,x=s>.62?.03*Math.max(0,Math.sin((s-.62)*41))*(g>.6?1:.25):0,f=u===4?.01*Math.sin(s*37):0;o(c*(.06+s*.5),.03+.016*Math.sin(g*Math.PI)+.045*s,b+y*g+f-x*(g-.5),c*s,g)}}for(let n=0;n<11;n++)for(let s=0;s<4;s++){const h=l+n*5+s,y=h+4+1;e.quad(h,h+1,y+1,y)}}const i=new t.Mesh(e.geometry("aW",2),new t.ShaderMaterial({vertexShader:Ca,fragmentShader:ka,side:t.DoubleSide,uniforms:Oe({uFlap:{value:0}})}));return i.frustumCulled=!1,i.name="ruru",i.scale.setScalar(2.05),X.add(i),i})(),Lo=.86,Xt=new p,ho=new p,Eo=new p;{const e=ie.tangentAtDist(Lo*ie.length,new p),o=new p(e.x,0,e.z).normalize(),r=new p().crossVectors(o,new p(0,1,0)).normalize(),i=o.clone().multiplyScalar(Math.cos(40*ae)).addScaledVector(r,Math.sin(40*ae)).multiplyScalar(Math.cos(12*ae)).setY(-Math.sin(12*ae)).normalize(),c=new p().crossVectors(i,new p(0,1,0)).normalize(),a=new p().crossVectors(c,i).normalize();a.multiplyScalar(Math.cos(16*ae)).addScaledVector(c,-Math.sin(16*ae)).normalize();const m=i.clone().negate(),l=new p().crossVectors(a,m).normalize();bt.quaternion.setFromRotationMatrix(new t.Matrix4().makeBasis(l,a,m))}await k.yield();const et=new t.Group;et.name="kayak",xe.add(et);const xt={uEnv:{value:new t.Color},uRim:{value:new t.Color},uGlintCol:{value:new t.Color},uKeyV:{value:new p(0,1,0)},uKeyCol:{value:new t.Color},uWet:{value:1},uTime:q.uTime},mo=new t.ShaderMaterial({vertexShader:Ma,fragmentShader:Pa,uniforms:xt,side:t.DoubleSide}),y0=new p(0,-.5,-2.15);{const e=lt(),o=18,r=[],i=l=>-.585+.085*l*l,c=l=>.3*Math.pow(Math.max(1-l,0),.62)+.003;for(let l=0;l<=o;l++){const n=l/o,s=.3-2.45*n,h=c(n),y=i(n),b=y-.05*(1-n)-.008,u=[[-h*.72,b-.2*(1-n*.6)],[-h,b],[-h*.55,y-.014],[0,y],[h*.55,y-.014],[h,b],[h*.72,b-.2*(1-n*.6)]];r.push(u.map(g=>e.v(g[0],g[1],s,0)))}for(let l=0;l<o;l++)for(let n=0;n<6;n++)e.quad(r[l][n],r[l][n+1],r[l+1][n+1],r[l+1][n]);const a=(l,n=.0048)=>e.tube(l,n,4,1);for(const l of[-1,1]){const n=[];for(let s=0;s<=12;s++){const h=.3+.62*(s/12);n.push(new p(l*(c(h)-.03)*.86,i(h)+.004-.02*(1-h),.3-2.45*h))}a(n)}for(const l of[-1,1])a([new p(l*c(.56)*.8,i(.56)-.012,.3-2.45*.56),new p(0,i((.56+.68)/2)+.008,.3-2.45*(.56+.68)/2),new p(-l*c(.68)*.8,i(.68)-.01,.3-2.45*.68)]);{const n=-1.9785000000000001;e.tube([new p(-.012,i(.93)+.012,n),new p(.012,i(.93)+.012,n)],.012,5,1)}const m=new t.Mesh(e.geometry("aKind",1),mo);m.frustumCulled=!1,m.name="deck",et.add(m)}const Zt=new t.Group;Zt.position.copy(y0),et.add(Zt);{const e=lt();e.tube([new p(0,0,0),new p(0,-.06,-.03),new p(0,-.11,-.035)],.0045,4,1),e.tube([new p(-.055,-.115,-.035),new p(.055,-.115,-.035)],.011,6,1);const o=new t.Mesh(e.geometry("aKind",1),mo);o.frustumCulled=!1,Zt.add(o)}const Jt=new t.Group;et.add(Jt);{const e=lt(),o=[];for(let i=0;i<=8;i++)o.push(new p(-.78+1.56*(i/8),0,0));e.tube(o,.019,6,2);for(const i of[-1,1]){const a=[],m=i*.5,l=Math.cos(m),n=Math.sin(m);for(let s=0;s<=6;s++){const h=s/6,y=i*(.72+.4*h),b=.08*Math.sin(Math.PI*Math.pow(h,.6))+.012,u=.03*Math.sin(Math.PI*h);a.push([-1,0,1].map(g=>{const x=g*b,f=u-Math.abs(g)*.012;return e.v(y,x*l-f*n,x*n+f*l,2)}))}for(let s=0;s<6;s++)for(let h=0;h<2;h++)e.quad(a[s][h],a[s][h+1],a[s+1][h+1],a[s+1][h])}const r=new t.Mesh(e.geometry("aKind",1),mo);r.frustumCulled=!1,r.name="paddle",Jt.add(r)}const Go=(()=>{const e=j.fork("beads"),o=[],r=[],i=Math.round(90*W);for(let a=0;a<i;a++)o.push(e.sign()*e.range(.7,4.5),e.range(-1.6,2.2),e.range(-9,-1.2)),r.push(e.range(.012,.03),e(),e.range(.4,1),0);const c=Ze("spray-beads",i,{iPos:[o,3],iPar:[r,4]},xa,{px:[1,.003],bright:0,a:[.8,.88,1],b:[.62,.8,.95]});return et.add(c),c})();{const e=j.fork("spray"),o=[],r=[],i=Math.round(260*W),c=m=>m.toFixed(4);for(let m=0;m<i;m++)o.push(e.range(-1.3,1.3),e.range(-.6,2.2),e.range(-1,1)),r.push(e.range(.03,.08),e(),e.range(.35,1),0);const a=`float pt=fract(uTime*${c(1/re.T)}+iPar.y)*${c(re.T)};
        vec3 po=vec3(${c(re.o.x)},${c(re.o.y)},${c(re.o.z)}), pv=vec3(${c(re.v.x)},${c(re.v.y)},${c(re.v.z)}), prr=vec3(${c($.x)},0.0,${c($.z)});
        c=po+pv*pt+prr*(-(0.9*pt+0.42*pt*pt)+iPos.x*(2.4+0.85*pt)*${c(ht)});
        c.y=po.y+pv.y*pt-4.9*pt*pt+iPos.y*(0.5+0.45*pt); c+=vec3(${c(Y.x)},0.0,${c(Y.z)})*iPos.z*(0.3+0.5*pt);
        br=iPar.z*(0.35+0.65*abs(sin(uTime*(3.0+4.0*tint)+iPar.y*50.0)))*smoothstep(0.05,0.5,pt)*(1.0-smoothstep(${c(re.T-.7)},${c(re.T-.1)},pt));`;X.add(Ze("plume-spray",i,{iPos:[o,3],iPar:[r,4]},a,{px:[1,.004],bright:.25+.75*K.key,a:[.85,.92,1],b:[.66,.82,.96]}))}let Ue=null;if(be==="autumn"){const e=j.fork("eels"),o=lt(),r=[],i=[],c=22,a=6;for(let n=0;n<=c;n++){const s=n/c;r.push(new p(0,0,s*1.5)),i.push(.012+.075*Math.sin(Math.PI*Math.pow(s,.42))*(1-.7*s))}o.tube(r,i,a,0);for(let n=0;n<o.ext.length;n++)o.ext[n]=Math.floor(n/a)/c;const m=[],l=7;for(let n=0;n<l;n++){const s=n%2?1:-1;m.push(s*e.range(.75,2.3),-e.range(2.4,8.5),e(),e.range(.8,1.2))}Ue=new t.Mesh(St(o.geometry("aT",1),l,{iPar:[m,4]}),new t.ShaderMaterial({vertexShader:ma,fragmentShader:pa,uniforms:{uTime:q.uTime,uEelsY:{value:-.85},uEelsCol:{value:new t.Color},uEelsA:{value:0}}})),Ue.frustumCulled=!1,Ue.name="autumn-eels",Ue.visible=!1,et.add(Ue)}const Le=new t.Mesh(new t.PlaneGeometry(2,2),new t.ShaderMaterial({vertexShader:e0,fragmentShader:Aa,transparent:!0,depthWrite:!1,depthTest:!1,premultipliedAlpha:!0,blending:t.CustomBlending,blendSrc:t.OneFactor,blendDst:t.OneMinusSrcAlphaFactor,uniforms:{uCol:{value:Vt.clone().multiplyScalar(2.4).add(At.clone().multiplyScalar(.05))},uA:{value:0},uTime:q.uTime}}));Le.frustumCulled=!1,Le.renderOrder=30,Le.scale.set(2.4,1.5,1),Le.name="lip-veil",xe.add(Le),await k.yield();const po=ie.length,go=new p;for(const e of te.weta)go.add(e);go.multiplyScalar(1/Math.max(1,te.weta.length)).lerp(te.chandelier.position,.35);const b0=new p,_o=new p,rt=e=>Ne((e+(ct.caveLen-Re)*Ne(e/Re,0,1))/po,0,1),je=te.ranks,wo=(e,o)=>e.position.clone().setY(e.top*o),Wo=Wt(2.6,new p);Wo.y+=9;const x0=oe(ut(235),we,235,new p),M0=oe(-8,-78,330,new p),P0=[{at:(e,o)=>(ie.posAtDist(o*po+18,_o),b0.copy(go).lerp(_o,S(.089,.113,o))),from:-.03,to:.132,weight:.92},{at:wo(je.grotto,.5),from:rt(je.grotto.s-33),to:rt(je.grotto.s+4),weight:.5,fade:.3},{at:wo(je.door,.55),from:rt(je.door.s-28),to:rt(je.door.s+4),weight:.45,fade:.3},{at:wo(je.great,.5),from:rt(je.great.s-46),to:rt(je.great.s+5),weight:.55,fade:.3},{at:te.organ.position,from:rt(te.organ.s-30),to:rt(te.organ.s+8),weight:.6},{at:M0,from:.622,to:.945,fade:.22,weight:.5},{at:Wo,from:.652,to:.752,fade:.36,weight:.5},{at:x0,from:.735,to:.848,fade:.36,weight:.42},{at:zt,from:.83,to:1.25,fade:.1,weight:.4}],Be=e=>U.object.getObjectByName(e),C0=["grotto","grotto-mirror","grotto-teeth","grotto-teeth-mirror","weta","drips","worms","worms-mirror"].map(Be).filter(Boolean),k0=["rank-stone","rank-stone-mirror"].map(Be).filter(Boolean),S0=["tube","tube-mirror"].map(Be).filter(Boolean),z0=["threads"].map(Be).filter(Boolean),A0=["worms-tube","worms-mirror-tube","worms-organ","worms-organ-mirror"].map(Be).filter(Boolean),V0=["hall-stone","drips-hall"].map(Be).filter(Boolean),yo=Be("mayflies"),F0=["hall-stone-mirror","threads-mirror"].map(Be).filter(Boolean),N0=["snares-short","snares-short-mirror"].map(Be).filter(Boolean),Uo=Be("organ-flies"),jo=Be("weta"),T0=["flume-mirror","worms-mirror-flume","trough","mouth-image"].map(Be).filter(Boolean),B0=["flume","worms-flume"].map(Be).filter(Boolean),Mt=new p,D0=new p,De=new p,bo=new p,Io=new p,Dt=new p,tt=new p,Ho=new p,Rt=new p,eo=new p,Kt=new p,Ot=new p(0,1,0),R0=new t.Matrix4,Qo=new t.Euler(0,0,0,"YZX"),$o=new t.Color,to=new t.Color,ot=te.chandelier.dist,xo=ke-6,K0=U.uniforms.uBright.value,O0=4,st=Q==="rain"?1:0,q0=new t.Color(.0075,.0345,.0385),L0=new t.Color(.0066,.0305,.054),E0=new t.Color(.0065,.027,.03),G0=new t.Color(.0075,.019,.036),Yo=new p,Mo=U.uniforms.uSkyCol.value,_0=Mo.clone(),W0=["canopy","tree-ferns","cliff-ferns"].map(e=>X.getObjectByName(e)).filter(Boolean),Ie=new t.Mesh(new t.PlaneGeometry(30,24),new t.ShaderMaterial({vertexShader:"void main(){ gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:"uniform float uK; void main(){ gl_FragColor=vec4(vec3(uK),1.0); }",uniforms:{uK:{value:0}},transparent:!0,depthWrite:!1,side:t.DoubleSide,blending:t.CustomBlending,blendEquation:t.AddEquation,blendSrc:t.ZeroFactor,blendDst:t.SrcColorFactor,blendSrcAlpha:t.ZeroFactor,blendDstAlpha:t.OneFactor}));Ie.position.copy(Ge).addScaledVector(Y,.25).setY(Ge.y+7),Ie.lookAt(Ie.position.clone().sub(Y)),Ie.frustumCulled=!1,Ie.renderOrder=60,Ie.name="mouth-dawn",xe.add(Ie);function Xo(e,o,r,i){const c=i*po,a=te.riverAt(c);ie.posAtDist(c,Mt),ie.tangentAtDist(c,De),ie.tangentAtDist(c+12,bo),q.uTime.value=o,_&&(_.getDrawingBufferSize(It),It.x>0||It.set(800,450)),r.getWorldPosition?r.getWorldPosition(tt):tt.copy(r.position);const m=i<=0?S(1.2,7,tt.distanceTo(Mt)):0,l=i<Te+.11;if(U.object.visible=l,l){Io.copy(Mt).addScaledVector(De,-1.15),U.setBoat(Io,De,te.speedAt(a)),U.setEyeS(a);const V=te.domeK(a);let M=G(1.8,1.25,S(ot-22,ot-6,a));M=G(M,1.75-.15*st,S(ot+5,ot+20,a)),M=G(M,1.3,S(he-4,he+22,a));const z=S(ke-40,ke-22,a)*(1-S(ke-8,ke+5,a)),D=Math.max(V,.72*z);M=G(M,1.72,D),M=G(M,1.5,S(ce-10,ce+40,a)),U.uniforms.uGain.value=G(M,1.35,m);const O=S(ce-12,ce+34,a),J=S(ot+5,ot+18,a)*(1-m),ve=S(he-16,he+10,a),H=ve*(1-V),le=st*(1-S(Ke-6,Ke+10,a));if(U.uniforms.uRockK.value=G((G(10,14,H)+st*G(5,0,H))*J,O0,O),U.uniforms.uRel.value=J*G(G(.75-.25*st,.32,ve),.3,O),U.uniforms.uCalm.value=Math.max(ve,O),U.uniforms.uAmb.value.copy(E0).multiplyScalar(1-J*G(.4,.75,H)).lerp(G0,O),U.uniforms.uLift.value.copy(q0).lerp(L0,D).multiplyScalar(J*G(.5,.4+.22*st+.68*le,H)*G(1,.75,O)/M),U.uniforms.uEven.value=.9*le*H,U.uniforms.uVoid.value=S(he-6,Ke+10,a)*(1-O)*(1-.5*le),U.uniforms.uHue.value=G(.25,1,S(he-10,Ke+12,a))*(1-m),U.uniforms.uBright.value=K0*(1+1.3*m)*G(G(G(1-.25*st*J,.78-.2*st,S(he-24,he+8,a)),1,Math.max(V,.85*z)),.8,O),U.uniforms.uRimK.value=G(1.25,.9,ve)*(1-.6*m),U.update(e,o,r),a<Re){const se=te.speedAt(a),Po=Math.max(se-5.5,0),Pt=S(5.5,6.8,se),no=1.4*(1-Math.exp(-Po/1.8))*(st?.7:1);U.uniforms.uShutter.value=no/Math.max(se,1),U.uniforms.uStreak.value=G(1.15,30,Pt),U.uniforms.uChev.value=Pt,U.uniforms.uAhead.value=1.2*S(he-34,he-14,a)*(1-S(Ke-4,Ke+6,a))}else U.uniforms.uStreak.value=1.15,U.uniforms.uChev.value=0,U.uniforms.uAhead.value=0;U.uniforms.uBoatP.value.y*=1-m,Ht.visible=m>.01,Ht.material.uniforms.uBright.value=.55*m;const Ee=a<he+4;for(const se of C0)se.visible=Ee;for(const se of k0)se.visible=a<ke+3;const ge=a<ce+1;for(const se of S0)se.visible=ge;const mt=a>Ke-46&&a<ke+3;for(const se of z0)se.visible=mt;const pt=a<ke+3;for(const se of A0)se.visible=pt;const He=a>je.grotto.s+6&&a<ke+3;for(const se of V0)se.visible=He;jo&&(jo.visible=Ee&&a<ot+30);const oo=!Ee&&a<ke+3;for(const se of F0)se.visible=oo;const qt=a>Ke-4;for(const se of B0)se.visible=qt;const ao=qt&&a<Re+6;for(const se of T0)se.visible=ao;const Lt=a<ce+60;for(const se of N0)se.visible=Lt;Uo&&(Uo.visible=a>Ke-30&&a<ke+3),yo&&(yo.visible=a<ce+30,yo.material.uniforms.uBright.value=vo*(1-.75*m))}const n=a>xo,s=S(xo+1,xo+19,a);if(X.visible=n,Ie.visible=n&&s<.999,Ie.material.uniforms.uK.value=s*s,Mo.copy(_0).multiplyScalar(.05+.95*s),n){const V=a>ce+1;for(const z of W0)z.visible=V;wt.update(e,o,r),Tt.position.copy(tt),q.uOutGain.value=G(1.3,1,S(.6,.72,i))*K.gain,Do.value=S(.75,.84,i);const M=(i-Lo)/.02;if(bt.visible=i>.838&&i<.912,bt.visible){Xt.copy(zt).sub(Mt).normalize(),ho.crossVectors(Xt,Ot).normalize(),Eo.crossVectors(ho,Xt);const z=Math.max(M-.8,0),D=(19+12*M+6*z*z)*ae,O=-(14+16*S(.25,1,-M)-2*Math.max(M,0))*ae,J=4.7+.7*M*M;bt.position.copy(Mt).addScaledVector(Xt,J*Math.cos(D)*Math.cos(O)).addScaledVector(ho,J*Math.sin(D)*Math.cos(O)).addScaledVector(Eo,J*Math.sin(O)),bt.position.y+=.08*Math.sin(o*1.1),bt.material.uniforms.uFlap.value=.85*Math.sin(o*8)}}if(Bt&&(Bt.object.visible=i>.5,i>.5&&Bt.update(e,o,r,i)),Je){const V=i>.6&&i<.872;if(Je.visible=V,V){const M=r.matrixWorld.elements,z=r.projectionMatrix.elements,D=1/Math.max(z[0],.1),O=1/Math.max(z[5],.1);$t.set(M[0],M[1],M[2]).normalize(),Ko.set(M[4],M[5],M[6]).normalize(),Oo.set(-M[8],-M[9],-M[10]).normalize(),yt.copy(zt).applyMatrix4(r.matrixWorldInverse).applyMatrix4(r.projectionMatrix);const J=S(Te-.002,Te+.014,i),ve=D/O;for(let H=0;H<Qt;H++){const le=w0[H],Ee=S(.606+.007*H,.642+.007*H,i),ge=S(.8+.006*H,.87,i),mt=ge*ge;let pt=le[0]+.07*Math.sin(o*le[3]+H*2.1)+.03*Math.sin(o*2.9+H),He=le[1]+.06*Math.sin(o*le[4]+H*1.3)+.03*Math.cos(o*2.3+H*.7);pt=G(pt*(1+.5*(1-Ee)),.04+.07*(H-2.5),mt),He=G(He+1.6*(1-Ee),.5+.05*(H%3),mt),He=G(Math.max(He,.06),He,J);const oo=(pt-yt.x)*ve,qt=He-yt.y,ao=Math.hypot(oo,qt);if(yt.z<1&&ao<.36){const no=.36/Math.max(ao,.001);pt=yt.x+oo*no/ve,He=yt.y+qt*no}const Lt=le[2]+30*mt;fo.copy(tt).addScaledVector(Oo,Lt).addScaledVector($t,pt*D*Lt).addScaledVector(Ko,He*O*Lt);const se=.3*Math.sin(o*le[3]*.8+H*1.7),Po=.45*Math.cos(o*le[3]+H*2.1);dt.copy(tt).sub(fo).normalize().multiplyScalar(.8+.25*Math.sin(o*le[4]*.7+H*2.3)).addScaledVector(Ot,.5).addScaledVector($t,Po*.5).normalize(),it.set(-De.x,-De.y*.6,-De.z).addScaledVector($t,-se),it.addScaledVector(dt,-it.dot(dt)),it.lengthSq()<1e-4&&it.copy(Ot).multiplyScalar(-1).addScaledVector(dt,Ot.dot(dt)),it.normalize(),qo.crossVectors(dt,it).normalize();const Pt=.52;Yt.makeBasis(qo,dt,it),Yt.scale(D0.set(Pt,Pt,Pt)),Yt.setPosition(fo),Je.setMatrixAt(H,Yt)}Je.instanceMatrix.needsUpdate=!0}}const h=i<=0;r.getWorldDirection(Dt);const y=S(Te-.02,Te+.03,i),b=Math.atan2(De.x,-De.z),u=h?b:Math.atan2(Dt.x,-Dt.z),g=Math.asin(Ne(De.y,-1,1)),x=Math.asin(Ne(Dt.y,-1,1));let f=u-b;f=Math.atan2(Math.sin(f),Math.cos(f));const v=S(he-12,ce+30,a),C=b+f*G(.42,.85,y)+.012*Math.sin(o*.6)+.006*v*Math.sin(o*5.3),T=G(g,x,.85*y)+.004*Math.sin(o*.9)+.006*v*Math.sin(o*7.1+1);Ho.set(Math.sin(C)*Math.cos(T),Math.sin(T),-Math.cos(C)*Math.cos(T));const d=Ne(-(De.z*bo.x-De.x*bo.z)*5,-1,1);Kt.copy(Ho).negate(),Rt.crossVectors(Ot,Kt).normalize(),eo.crossVectors(Kt,Rt),eo.addScaledVector(Rt,-.14*d+.01*Math.sin(o*.8)).normalize(),Rt.crossVectors(eo,Kt).normalize(),et.quaternion.setFromRotationMatrix(R0.makeBasis(Rt,eo,Kt)),et.position.copy(h?Mt:tt),Zt.rotation.set(.25*Math.sin(o*2.1)*(.3+v)+.5*y,0,.3*Math.sin(o*1.7+1)*(.25+v)-.5*d);const w=S(ke-14,ke+6,a),A=S(he-6,he+8,a)*(1-S(Ke-8,Ke+10,a)),F=1-w;Jt.position.set(.2*F,-.475*F-.95*w,-.9*F-.5*w),Qo.set(.42*F,(.86+.16*d*A+.012*Math.sin(o*.7))*F+.3*w,(-.05-.1*d*A)*F),Jt.rotation.copy(Qo);const B=.034+.055*Math.exp(-((a-ot)*(a-ot))/340)-.012*S(ce,ce+110,a)+.05*S(he-48,he-6,a)*(1-S(ce,ce+60,a))*(1-.4*te.domeK(a)),E=Math.pow(S(ce-30,Re+8,a),1.6);$o.copy(ue).multiplyScalar(B).lerp(to.copy(Et).multiplyScalar(1.5).add(Vt),E),xt.uEnv.value.copy($o),xt.uRim.value.copy(ue).multiplyScalar((.035+.085*S(he-50,he-12,a))*(1-.6*S(ce,ce+70,a))*(1-S(Re-20,Re+5,a))*(1-m)),xt.uGlintCol.value.copy(ue).multiplyScalar(2.6*(1-.6*S(ce,Re-15,a))).lerp(to.copy(At).multiplyScalar(3.2).add(Et),y);const P=S(Re-12,Re+10,a),N=S(ce-25,ce+60,a)*(1-P);if(xt.uKeyCol.value.copy(At).multiplyScalar(.9*P).add(to.copy(Mo).multiplyScalar(1*N)),Yo.copy(De).setY(De.y+.3).normalize().lerp(Qe,P).normalize(),xt.uKeyV.value.copy(Yo).transformDirection(r.matrixWorldInverse),Go.material.uniforms.uBright.value=(.7+.8*K.key)*S(Te-.004,Te+.025,i)*(1-S(.93,.99,i)),Go.visible=i>Te-.01,Ue){const V=S(ce-2,ce+16,a)*(1-S(Re-26,Re-8,a));Ue.visible=V>.002,Ue.visible&&(Ue.material.uniforms.uEelsA.value=V,Ue.material.uniforms.uEelsCol.value.copy(ue).multiplyScalar(.8).lerp(to.copy(Et).multiplyScalar(2).add(Vt),E))}let R=.4*S(Te-.016,Te+.002,i)*(1-S(Te+.004,Te+.034,i));Ut&&i>Te&&(R=Math.max(R,m0*(1-S(2,7,Math.abs(tt.y-d0-3.5))))),Le.visible=R>.003,Le.visible&&(Le.material.uniforms.uA.value=R,Le.position.copy(tt).addScaledVector(Dt,.7),r.getWorldQuaternion?r.getWorldQuaternion(Le.quaternion):Le.quaternion.copy(r.quaternion))}return Xo(0,0,{position:ie.start.clone(),quaternion:new t.Quaternion,matrixWorldInverse:new t.Matrix4().makeTranslation(-ie.start.x,-ie.start.y,-ie.start.z),getWorldDirection:e=>e.copy(ie.startTangent)},0),X.visible=!0,Ie.visible=!0,await wt.prewarm(_,null,xe),{scene:xe,path:ie,duration:50,pace:e=>G(G(G(G(.62,.9,S(.185,.215,e)),.6,S(.222,.262,e)),1.5,S(.455,.53,e)),.95,S(.615,.69,e)),title:Ve==="dawn"?"False Stars, Before Dawn":ee?"False Stars: The Hatch":"False Stars",camera:{fov:62,near:.12,far:5200,lookAhead:16,sway:.6,bank:.55},pois:P0,portal:{shape:"circle",radius:7,color:"#8ff0e6",glow:1,tilt:!0,revealDistance:230},post:{exposure:1.6,bloom:{strength:.52,radius:.7,threshold:.84},grade:{saturation:1.1,contrast:1.06,tint:"#eaf2ff",shadowTint:"#03060c",vignette:.42,grain:.03,aberration:0}},ride:"none",update:Xo,dispose(){wt.dispose(),U.dispose()}}}};export{Ba as default};
