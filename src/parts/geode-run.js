import*as z from"three";import{clamp as Se,lerp as H,smoothstep as vt,makeRng as Aa,hashSeed as Va}from"../kit/core.js";const La=["#0B0716","#3D2466","#8A5BD6","#EEF3FA","#9CCBFF","#2FD3C4","#5A5560"],B=Math.PI*2,g=z.Vector3,Pt=90,Ct=70,Jo=105,Ao=85,et=40,Ft=47.5,oo=138,Vo=88,ho=1.5,_t=0,uo=6,Lo=1.6,Ba=1.7,vo=.72,Zo=5,Ta=9,Me=15,$o=7,Na=`
uniform vec3 uShaftA, uShaftB, uShaftCol, uAmbCol, uPoolCol, uHazeCol, uLampCol, uCamL;
uniform vec4 uLampPos, uLampDir;
uniform float uShaftR, uCloud, uTime, uHaze, uGlint, uOutside, uLampRange;
uniform vec4 uPt[8]; uniform vec3 uPtCol, uDarkCol;
// 1 inside the egg, falling to 0 up the throat: the daylight never reaches the mine
float eggGate(vec3 P){ float a=P.y>70.0?105.0:85.0; float e=dot(P.xz,P.xz)/8100.0+(P.y-70.0)*(P.y-70.0)/(a*a); return 1.0-smoothstep(1.15,1.75,e); }
float h11(float n){ return fract(sin(n*12.9898)*43758.5453); }
vec3 h33(vec3 p){ p=fract(p*vec3(.1031,.1030,.0973)); p+=dot(p,p.yxz+33.33); return fract((p.xxy+p.yxx)*p.zyx); }
float vn3(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  float a=h33(i).x, b=h33(i+vec3(1,0,0)).x, c=h33(i+vec3(0,1,0)).x, d=h33(i+vec3(1,1,0)).x;
  float e=h33(i+vec3(0,0,1)).x, g=h33(i+vec3(1,0,1)).x, h=h33(i+vec3(0,1,1)).x, k=h33(i+vec3(1,1,1)).x;
  return mix(mix(mix(a,b,f.x),mix(c,d,f.x),f.y),mix(mix(e,g,f.x),mix(h,k,f.x),f.y),f.z); }
vec3 shaftPoint(vec3 P){ vec3 ab=uShaftB-uShaftA; float t=clamp(dot(P-uShaftA,ab)/dot(ab,ab),0.0,1.0); return uShaftA+ab*t; }
// light of the geode at local point P with normal N: Lk = key direction, returns irradiance (linear HDR)
vec3 geodeLight(vec3 P, vec3 N, out vec3 Lk){
  vec3 toC=shaftPoint(P)-P; float d=length(toC);
  vec3 L=normalize(toC+vec3(0.0,0.45*d+1.0,0.0)); Lk=L;
  float atten=uShaftR*2.2/(uShaftR+d);
  float inCol=1.0-smoothstep(uShaftR*0.75,uShaftR*1.2,d);
  float ndl=max(dot(N,L)*0.72+0.28,0.0);
  float gate=eggGate(P);
  vec3 key=uShaftCol*(gate*uCloud*atten*(ndl+2.6*inCol*max(N.y*0.6+0.4,0.0)));
  vec3 amb=mix(uDarkCol,uAmbCol,gate)*(0.55+0.45*N.y);
  amb+=uPoolCol*(gate*0.22*uCloud*exp(-max(P.y,0.0)/28.0)*max(0.5-0.5*N.y,0.0));
  vec3 lp=uLampPos.xyz-P; float ld=length(lp); vec3 ll=lp/max(ld,1e-3);
  float cone=smoothstep(uLampDir.w,mix(uLampDir.w,1.0,0.45),dot(-ll,uLampDir.xyz));
  vec3 lamp=uLampCol*(uLampPos.w*cone*max(dot(N,ll)*0.8+0.2,0.0)/(1.0+ld*ld*0.003)*(1.0-smoothstep(uLampRange*0.73,uLampRange*1.13,ld)));
  lamp+=uLampCol*(uLampPos.w*0.16*max(dot(N,ll)*0.6+0.4,0.0)/(1.0+ld*ld*0.03));   // the flame's bare spill to every side: rock, timber and crystal beside the cart stand warm against the cold beyond
  vec3 pts=vec3(0.0);
  for(int i=0;i<8;i++){ vec3 dq=uPt[i].xyz-P; float r2=dot(dq,dq); vec3 lq=dq*inversesqrt(max(r2,1e-4)); pts+=uPtCol*(uPt[i].w*max(dot(N,lq)*0.7+0.3,0.0)/(1.0+r2*0.014)); }
  return key+amb+lamp+pts;
}
// hard facet glint: h = facet hash; a narrow band of phase is lit and the phase depends on the view direction
float facetGlint(vec3 V, float h, float sharp){
  vec3 g=normalize(vec3(fract(h*13.7),fract(h*71.3),fract(h*157.1))-0.5+vec3(1e-3));
  float ph=fract(h*31.7+dot(V,g)*7.0+uTime*0.06);
  return smoothstep(sharp,1.0,1.0-abs(ph*2.0-1.0));
}
vec3 applyHaze(vec3 col, vec3 P){
  float f=1.0-exp(-length(P-uCamL)*uHaze);
  vec3 hz=uHazeCol*(eggGate(P)*(0.4+0.6*uCloud)*(1.0+0.6*exp(-length(P-shaftPoint(P))/40.0)));
  return mix(col,hz,f);
}
`,mt=`
varying vec3 vP; varying vec3 vN;
#include <fog_pars_vertex>
vec3 instNormal(mat3 m, vec3 n){ return normalize(m*(n/vec3(dot(m[0],m[0]),dot(m[1],m[1]),dot(m[2],m[2])))); }
`,pt=`
varying vec3 vP; varying vec3 vN;
#include <fog_pars_fragment>
`+Na,It=`
  col=applyHaze(col,vP);
  gl_FragColor=vec4(col,1.0);
  #include <fog_fragment>
`,Bo=`
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      col*=exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
    #else
      col*=1.0-smoothstep(fogNear,fogFar,vFogDepth);
    #endif
  #endif
`,Ea=mt+`
attribute vec3 color; attribute vec3 aMat;
varying vec3 vC; varying vec3 vM;
void main(){
  vP=position; vN=normal; vC=color; vM=aMat;
  vec4 mvPosition=modelViewMatrix*vec4(position,1.0);
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Ra=pt+`
uniform vec3 uRoot, uTip, uShadow, uGlowA, uGlowB, uCast2, uMilk; uniform float uGlowK; uniform vec4 uMouth, uHole2;
varying vec3 vC; varying vec3 vM;
vec4 vor(vec3 x){ vec3 i=floor(x), f=fract(x); float d1=8.0, d2=8.0; vec3 id=vec3(0.0);
  for(int a=-1;a<=1;a++) for(int b=-1;b<=1;b++) for(int c=-1;c<=1;c++){
    vec3 g=vec3(float(a),float(b),float(c)); vec3 o=h33(i+g); vec3 r=g+o-f; float d=dot(r,r);
    if(d<d1){ d2=d1; d1=d; id=o; } else if(d<d2){ d2=d; } }
  return vec4(id,sqrt(d2)-sqrt(d1)); }
void main(){
  vec3 N=normalize(vN); vec3 toCam=uCamL-vP; vec3 V=normalize(toCam);
  if(uOutside>0.5 && dot(N,toCam)<0.0) discard;
  if(vM.z<0.5){
    float rag=vn3(vP*0.35)*2.0;
    if(vP.y>150.0 && length(vP-shaftPoint(vP))<uShaftR-1.0+rag) discard;
    if(distance(vP,uMouth.xyz)<uMouth.w+rag*0.6) discard;
    if(distance(vP,uHole2.xyz)<uHole2.w+rag*0.5) discard;
  }
  vec4 v1=vor(vP*0.3), v2=vor(vP*0.95+7.3);
  vec3 Lk; vec3 col;
  // crystal crust: every cell is a facet with its own tilt, dark at the seams (roots) and pale toward its middle (tip)
  vec3 Nf=normalize(N+(v1.xyz-0.5)*1.25+(v2.xyz-0.5)*0.7);
  float tipK=0.6*smoothstep(0.0,0.55,v1.w)+0.4*smoothstep(0.0,0.4,v2.w);
  float ndv=max(dot(Nf,V),0.0);
  vec3 alb=mix(uShadow*0.9+uRoot*0.55,mix(uRoot*1.3,uTip,0.3+0.3*v2.y),tipK)*(0.62+0.76*v1.x);
  alb=mix(alb,uTip,0.25*pow(1.0-ndv,3.0));
  // the mineral is not one colour: zones where this geode's second mineral has grown instead, and agate bands in the
  // rind, pale and smoky, lying nearly level round the egg
  float z2=smoothstep(0.5,0.68,vn3(vP*0.022+vec3(9.0,3.0,5.0)));
  alb=mix(alb,mix(uCast2*0.22,uCast2,tipK)*(0.62+0.76*v1.x),z2*0.85);
  float band=smoothstep(0.6,0.92,0.5+0.5*sin(vP.y*0.42+vn3(vP*0.035+vec3(4.0,1.0,7.0))*7.0));
  alb=mix(alb,mix(uMilk*0.4,uTip,0.3)*(0.5+0.6*v2.x),band*0.5);
  vec3 E=geodeLight(vP,Nf,Lk);
  float lum=dot(E,vec3(0.3,0.5,0.2));
  float inner=smoothstep(0.4,0.95,dot(reflect(-V,Nf),Lk))*tipK;               // the bright inner face of a facet turned to the light
  // sparse hard points of light: under 2% of the small cells, only at the heart of the cell, and they travel with the view
  float gsel=step(0.965,fract(v2.z*7.13+v2.x*3.1));
  float gl=facetGlint(V,v2.x+v1.y*3.1,0.9)*gsel*smoothstep(0.34,0.5,v2.w);
  vec3 crust=alb*mix(vec3(lum),E,0.4)/(1.0+0.45*lum)*vC*(1.45+0.7*inner)+mix(uTip,vec3(1.0),0.6)*(gl*uGlint*(0.2+lum)*5.0);
  // pockets of druse 10 m across: the wall holds light of its own at their hearts, so it has structure at 100 m
  vec4 v3=vor(vP*0.09+3.1);
  float pocket=smoothstep(0.16,0.7,v3.w);
  crust*=0.62+0.5*v3.y+0.35*pocket;
  crust+=mix(mix(uGlowA,uGlowB,0.3*tipK),uCast2*1.3,z2*0.8)*(uGlowK*0.25*pocket*(0.35+0.65*v3.x)*(0.45+0.75*tipK)*(0.6+0.4*uCloud)*eggGate(vP));
  // rock and moss round the pool: wet, seamed, mossed wherever the daylight lands
  float rn=vn3(vP*0.8)*0.5+vn3(vP.zxy*3.1+2.0)*0.3+vn3(vP.yzx*9.7+5.0)*0.2;
  float seam=1.0-abs(2.0*(vn3(vP*0.42+13.0)*0.6+vn3(vP.zxy*1.3+4.0)*0.4)-1.0);
  vec3 ralb=mix(vec3(0.035,0.032,0.05),vec3(0.24,0.23,0.29),rn)*vC*(1.0-0.55*smoothstep(0.86,0.97,seam));
  float mossK=clamp(vM.y*1.5,0.0,1.0)*smoothstep(0.2,0.5,rn+vM.y*0.6);
  ralb=mix(ralb,mix(vec3(0.04,0.20,0.06),vec3(0.34,0.60,0.12),rn),mossK);
  vec3 Nr=normalize(N+(vec3(vn3(vP*1.7),vn3(vP*1.7+9.1),vn3(vP*1.7+4.7))-0.5)*1.1+(vec3(vn3(vP*6.3),vn3(vP*6.3+3.1),vn3(vP*6.3+7.7))-0.5)*0.5);
  vec3 Er=geodeLight(vP,Nr,Lk);
  float wet=(1.0-mossK)*(0.35+0.65*smoothstep(0.45,0.7,vn3(vP*0.5+21.0)));
  float rsp=pow(max(dot(reflect(-V,Nr),Lk),0.0),28.0)*wet;
  vec3 rock=ralb*Er+(uShaftCol*uCloud*eggGate(vP)+uLampCol*0.2)*(rsp*0.16)*min(dot(Er,vec3(0.3,0.5,0.2)),2.0);
  col=mix(crust,rock,vM.x);
`+It+"}",ea=mt+`
attribute vec3 aInst;                       // seed, hue shift, brightness
varying vec3 vI; varying float vH; varying vec3 vNl; varying vec3 vLp; varying float vLen; varying float vFh;
uniform vec3 uCamL; uniform float uOutside;
void main(){
  vec4 lp=instanceMatrix*vec4(position,1.0);
  vec3 root=instanceMatrix[3].xyz;
  // cut-away: seen from outside the egg, the crystals of the near wall are folded away
  float hide=step(0.5,uOutside)*step(dot(vec3(0.0,70.0,0.0)-root,uCamL-root),0.0);
  lp.xyz=mix(lp.xyz,root,hide);
  vP=lp.xyz; vN=instNormal(mat3(instanceMatrix),normal); vI=aInst; vH=position.y; vNl=normal; vLp=position; vLen=length(instanceMatrix[1].xyz);
  vFh=fract(sin((aInst.x*17.0+dot(floor(normal*2.6+0.5),vec3(1.0,5.0,11.0)))*12.9898)*43758.5453);   // one hash per facet, made here: the same at all three corners
  vec4 mvPosition=modelViewMatrix*lp;
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,ta=pt+`
uniform vec3 uRoot, uTip, uShadow, uGlowA, uGlowB, uCast2; uniform float uGlowK;
varying vec3 vI; varying float vH; varying vec3 vNl; varying vec3 vLp; varying float vLen; varying float vFh;
void main(){
  vec3 N=normalize(vN); vec3 V=normalize(uCamL-vP);
  vec3 Lk; vec3 E=geodeLight(vP,N,Lk);
  float fh=vFh;                                                              // one hash per facet
  float big=step(1.5,vI.y), hueV=vI.y-2.0*big;                               // the great druses (hue + 2) hold light of their own
  float h=smoothstep(0.05,0.95,vH);
  vec3 tip=mix(uTip,uTip.brg,hueV*0.35);                                     // per-crystal hue lean
  float z2=smoothstep(0.5,0.68,vn3(vP*0.022+vec3(9.0,3.0,5.0)));             // where the second mineral has grown (the wall's own zones)
  tip=mix(tip,uCast2,z2*0.85); vec3 rootC=mix(uRoot,uCast2*0.25,z2*0.85);
  vec3 body=mix(uShadow+rootC*0.3,rootC*1.35,smoothstep(0.0,0.5,vH));
  float dCam=length(uCamL-vP);
  float farK=smoothstep(35.0,110.0,dCam);                        // far walls: calmer facets, no confetti
  body=mix(body,tip*1.1,smoothstep(0.45,1.0,vH)*(1.0-0.55*farK))*mix(0.6+0.65*fh,0.92,farK*0.75)*vI.z;
  float ndv=max(dot(N,V),0.0);
  float fres=pow(1.0-ndv,3.0);
  vec3 R=reflect(-V,N);
  float inner=smoothstep(0.35,0.95,dot(R,Lk))*(0.3+0.7*h)*(1.0-mix(0.8,0.35,big)*farK);    // the bright inner face
  float back=pow(max(dot(-V,Lk),0.0),3.0)*h;                                 // tips backlit by the shaft
  float lum=dot(E,vec3(0.3,0.5,0.2));
  vec3 Ec=mix(vec3(lum),E,0.4)/(1.0+0.55*lum);                               // keep the violet: daylight only tints it, and never bleaches it
  vec3 col=body*Ec*(1.7+0.8*inner)+tip*(lum/(1.0+0.55*lum))*(0.16*fres*(1.0-0.75*farK)+0.3*back*(1.0-0.7*farK));
  col+=tip*((1.0-eggGate(vP))*0.24*(0.2+0.8*h)*(0.5+0.8*fh));              // in the dark of the mine a point keeps a breath of its own colour: never a black lump
  col*=mix(1.0,0.5,farK*(1.0-smoothstep(1.5,5.0,vLen)));                      // small far points sink into the crust
  // a facet that catches the light brightens a little all over and carries one small hard gleam
  float gl=facetGlint(V,fh+vI.x,0.87)*(1.0-0.97*farK);
  vec2 nn=normalize(vNl.xz+vec2(1e-4));
  vec2 gxz=nn*0.85+vec2(-nn.y,nn.x)*((fract(fh*5.1)-0.5)*0.6);
  vec3 gd=(vLp-vec3(gxz.x,0.1+0.8*fract(fh*7.3+vI.x*3.1),gxz.y))*vec3(1.0,2.6,1.0);
  float gspot=(1.0-smoothstep(0.06,0.5,length(gd)))*smoothstep(2.5,6.0,dCam);   // close facets are clean gradients
  col+=mix(tip,vec3(1.0),0.7)*(gl*gspot*uGlint*(0.3+lum)*7.0)+tip*(gl*uGlint*lum*0.45);
  // light transmitted through the body of a great crystal: strongest on the faces turned to the eye, rising to the tip,
  // breathing slowly, each on its own; it is the wall's own colour and it holds at any distance
  float ndc=clamp(ndv,0.0,1.0);
  float coreG=(0.18+0.82*ndc*ndc)*smoothstep(0.08,0.8,vH)*(0.75+0.5*fh);
  float breath=0.82+0.18*sin(uTime*0.5+vI.x*40.0);
  col+=mix(mix(uGlowA,uGlowB,smoothstep(0.25,1.0,vH)),uCast2*1.25,z2*0.8)*(big*uGlowK*coreG*breath*(0.7+0.7*fract(vI.x*5.3))*(0.6+0.4*uCloud)*(0.5+0.5*eggGate(vP)));   // half as strong in the mine, where the points are small and close
`+It+"}",oa=mt+`
attribute vec4 aSel;                        // seed, blaze 0..1, length (m), point along the beam nearest the shaft
varying vec4 vS; varying vec3 vL; varying vec3 vLampK; varying vec3 vAxP; varying vec4 vAxD;
uniform vec4 uLampPos;
void main(){
  vec4 lp=instanceMatrix*vec4(position,1.0);
  vP=lp.xyz; vN=instNormal(mat3(instanceMatrix),normal); vS=aSel; vL=position;
  vAxP=instanceMatrix[3].xyz; vAxD=vec4(normalize(instanceMatrix[1].xyz+vec3(0.0,1e-5,0.0)),0.5*min(length(instanceMatrix[0].xyz),length(instanceMatrix[2].xyz)));
  // nearest point of the beam axis to the lamp: (t along 0..1, distance, -)
  vec3 a=(instanceMatrix*vec4(0.0,-0.5,0.0,1.0)).xyz, ax=instanceMatrix[1].xyz;
  float t=clamp(dot(uLampPos.xyz-a,ax)/max(dot(ax,ax),1e-4),0.0,1.0);
  vLampK=vec3(t,length(uLampPos.xyz-(a+ax*t)),0.0);
  vec4 mvPosition=modelViewMatrix*lp;
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,aa=pt+`
uniform vec3 uMilk;
varying vec4 vS; varying vec3 vL; varying vec3 vLampK; varying vec3 vAxP; varying vec4 vAxD;
void main(){
  vec3 N=normalize(vN); vec3 V=normalize(uCamL-vP);
  vec3 Lk; vec3 E=geodeLight(vP,N,Lk);
  float al=vL.y+0.5;                                                         // 0..1 along the beam
  float st=vn3(vec3(vL.x*26.0+vS.x*9.0,vL.y*vS.z*0.25,vL.z*26.0));           // striations run the length
  float st2=vn3(vec3(vL.x*90.0,vL.y*vS.z*0.06+vS.x,vL.z*90.0));
  float cleave=smoothstep(0.62,0.7,vn3(vec3(vL.x*3.0+vS.x*5.0,vL.y*vS.z*0.045,vL.z*3.0)));   // long cleavage planes
  float ndv=max(dot(N,V),0.0);
  float fres=pow(1.0-ndv,2.5);
  // inside the crystal: feathered veils lying along the beam, read at two depths under the face, so they slide behind
  // the surface as the eye passes
  vec3 rel=vP-vAxP; vec3 q1=rel-V*(vAxD.w*0.5), q2=rel-V*(vAxD.w*1.1);
  float y1=dot(q1,vAxD.xyz), y2=dot(q2,vAxD.xyz);
  float veil=0.6*smoothstep(0.45,0.8,vn3((q1-vAxD.xyz*y1)*1.6+vAxD.xyz*(y1*0.09)+vS.x*31.0))+0.4*smoothstep(0.5,0.85,vn3((q2-vAxD.xyz*y2)*2.3+vAxD.xyz*(y2*0.13)+vS.x*57.0));
  // faces: the face turned to a light carries it and the face turned away keeps half
  vec3 ll=normalize(uLampPos.xyz-vP+vec3(0.0,1e-4,0.0));
  float faceL=mix(0.5,1.2,smoothstep(-0.3,0.8,dot(N,ll))), faceD=mix(0.55,1.15,smoothstep(-0.3,0.8,dot(N,Lk)));
  vec3 alb=uMilk*(0.30+0.30*st+0.13*st2+0.07*cleave)*(0.8+0.45*veil);
  vec3 Lk2; vec3 Em=E+0.3*geodeLight(vP,-N,Lk2);                             // light passes through the crystal
  Em/=1.0+1.15*dot(Em,vec3(0.3,0.5,0.2));                                    // a milky solid: it never clips to paper white
  vec3 col=alb*mix(vec3(dot(Em,vec3(0.3,0.5,0.2))),Em,0.7)*(0.8+0.5*fres)+uMilk*uAmbCol*1.2;
  // how near the line of sight passes to the beam's own axis: the glow is a core seen through a translucent body
  vec3 cx=cross(V,vAxD.xyz); float cl=max(length(cx),1e-3);
  float bq=abs(dot(vP-vAxP,cx))/(cl*max(vAxD.w,1e-3));
  float line=exp(-bq*bq*5.5);
  float body=0.22+0.24*ndv;
  // light pipe: daylight entering where the beam crosses the column, carried the whole length and out of the ends
  float dS=(al-vS.w)*vS.z;
  float ends=smoothstep(0.42,0.5,abs(vL.y));
  float core=vS.y*uCloud*(0.42+0.85*exp(-dS*dS/90.0)+0.6*ends);
  core=1.4*core/(1.0+core);
  vec3 day=mix(uShaftCol*0.55,uMilk,0.3)*core*(body+1.25*line+0.5*ends);
  // the lamp: a white core sliding along beside the cart, and the far ends lighting like windows
  float dL=(al-vLampK.x)*vS.z;
  float lampIn=uLampPos.w*(1.0-smoothstep(10.0,32.0,vLampK.y));
  float lc=lampIn*(0.85*exp(-dL*dL/40.0)+0.07+1.0*smoothstep(0.44,0.5,abs(vL.y)));
  lc=1.5*lc/(1.0+lc);
  vec3 lampG=uMilk*lc*(body*0.9+1.2*line+0.6*ends);
  col+=(day*faceD+lampG*faceL)*(0.45+0.9*st)*(0.72+0.6*veil);
  // the six long edges of the prism catch the lamp: a warm line where the edge turns between the flame and the eye
  float ed=abs(fract((atan(vL.z,vL.x+1e-5)-0.26)*0.9549297+0.5)-0.5);         // 0 on an edge, 0.5 in the middle of a face
  float edge=(1.0-smoothstep(0.012,0.05,ed))*(1.0-ends)*(1.0-smoothstep(25.0,60.0,length(uCamL-vP)));
  vec3 rad=normalize(rel-vAxD.xyz*dot(rel,vAxD.xyz)+vec3(1e-4));
  col+=uLampCol*(lampIn*edge*(0.05+0.45*pow(max(dot(rad,normalize(ll+V)),0.0),5.0)))+uMilk*(edge*0.2*dot(Em,vec3(0.3,0.5,0.2)));
`+It+"}",na=mt+`
attribute vec3 aTim;                        // seed, kind (0 timber, 1 iron, 2 rail), -
uniform float uPx;
varying vec3 vT; varying vec3 vL; varying float vF;
void main(){
  mat3 m=mat3(instanceMatrix);
  vec3 ax=(instanceMatrix*vec4(0.0,position.y,0.0,1.0)).xyz;
  vec3 off=m*vec3(position.x,0.0,position.z);
  float w=min(length(m[0]),length(m[2]));
  vec4 mvC=modelViewMatrix*vec4(ax,1.0);
  float dz=max(-mvC.z,0.1);
  float keep=1.0-step(0.5,aTim.z)*step(fract(aTim.x*7.31),0.5)*smoothstep(45.0,85.0,dz);   // far turns carry less bracing
  float f=max(1.0,mix(1.15,0.8,smoothstep(45.0,110.0,dz))*dz/(uPx*w))*keep;   // about a pixel wide at least; finer far off
  vec3 lp=ax+off*f;
  vP=lp; vN=instNormal(m,normal); vT=aTim; vF=1.0/max(f,1.0);
  vL=vec3(position.x*length(m[0]),position.y*length(m[1]),position.z*length(m[2]));
  vec4 mvPosition=modelViewMatrix*vec4(lp,1.0);
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,sa=pt+`
uniform vec3 uTimber, uMilk, uRoot;
varying vec3 vT; varying vec3 vL; varying float vF;
void main(){
  vec3 N=normalize(vN); vec3 V=normalize(uCamL-vP);
  vec3 Lk; vec3 E=geodeLight(vP,N,Lk);
  float grain=vn3(vec3(vL.x*9.0+vT.x*31.0,vL.y*0.7,vL.z*9.0))*0.6+vn3(vec3(vL.x*30.0,vL.y*2.5+vT.x*7.0,vL.z*30.0))*0.4;
  vec3 wood=mix(uTimber,uMilk,0.08)*(0.55+0.55*grain)*(0.8+0.4*vT.x);
  vec3 iron=vec3(0.035,0.036,0.045)*(0.7+0.6*grain);
  vec3 rail=vec3(0.16,0.17,0.2);
  float isIron=step(0.5,vT.y)*(1.0-step(1.5,vT.y)), isRail=step(1.5,vT.y);
  vec3 alb=mix(mix(wood,iron,isIron),rail,isRail);
  float gate=eggGate(vP);
  E/=1.0+0.7*dot(E,vec3(0.3,0.5,0.2))*max(gate,0.75);                        // weathered grey, never chalk white in the column or the lamp
  E+=uShaftCol*(uCloud*gate*(0.08+0.22*max(-N.y,0.0)));                       // daylight off the mist and the pool finds the backs and undersides
  vec3 lq=uLampPos.xyz-vP;
  E+=uLampCol*(uLampPos.w*0.3/(1.0+dot(lq,lq)*0.06));                         // the deck and the rails under the cart stand in the flame's glow on every face: never a black bar against the lit cave
  vec3 col=alb*(E+uAmbCol*0.6);
  float fres=pow(1.0-max(dot(N,V),0.0),3.0);
  col+=(isIron*0.10+isRail*0.5*max(N.y,0.0))*fres*uShaftCol*uCloud*0.5;
  col*=mix(1.0,vF,0.5);
  // aerial perspective inside the egg: far members sink toward the colour of the wall, a mid-dark violet silhouette
  // against the lit druses, so the trestle reads in depth and never as a white wire lattice
  float dC=length(uCamL-vP);
  float air=gate*smoothstep(14.0,mix(64.0,46.0,step(0.5,vT.z)),dC)*mix(0.8,0.93,step(0.5,vT.z));
  col=mix(col,(uHazeCol*(0.35+0.15*uCloud)+uRoot*0.5)*(0.5+0.3*grain),air*0.75);
`+It+"}",Fa=mt+`
attribute float aShore; varying float vShore;
void main(){
  vP=position; vN=normal; vShore=aShore;
  vec4 mvPosition=modelViewMatrix*vec4(position,1.0);
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,_a=pt+`
uniform vec4 uRing[6]; varying float vShore;
float wav(vec2 p){
  float s=(vn3(vec3(p*0.33,uTime*0.22))-0.5)*0.9+(vn3(vec3(p*1.3+4.0,uTime*0.5))-0.5)*0.3;
  for(int i=0;i<6;i++){ float d=length(p-uRing[i].xy); s+=uRing[i].z*sin(d*uRing[i].w-uTime*2.4+float(i)*1.7)*exp(-d*0.09);
    // a blind fish rises: one ring opens from the same spot every few seconds and dies as it spreads
    float age=fract(uTime*0.085+float(i)*0.37), rr=d-age*9.0; s+=1.5*(1.0-age)*(1.0-age)*sin(rr*4.2)*exp(-rr*rr*0.9); }
  return s;
}
void main(){
  vec2 p=vP.xz; float e=0.25;
  float w0=wav(p), wx=wav(p+vec2(e,0.0)), wz=wav(p+vec2(0.0,e));
  vec3 N=normalize(vec3(-(wx-w0)/e*0.35,1.0,-(wz-w0)/e*0.35));
  vec3 V=normalize(uCamL-vP);
  float fres=0.04+0.96*pow(1.0-max(dot(N,V),0.0),4.0);
  vec2 q=p-uShaftA.xz; float oval=exp(-dot(q,q)/(2.0*10.5*10.5));
  float caust=pow(abs(sin(w0*7.0+p.x*0.6))*abs(sin(w0*5.0-p.y*0.7+1.3)),3.0);
  vec3 deep=uPoolCol*(0.10+0.06*w0);
  vec3 col=deep*(uAmbCol*6.0+uShaftCol*uCloud*0.5);
  col+=uPoolCol*uCloud*oval*(2.3+2.2*caust+0.8*w0);
  col+=uShaftCol*uCloud*oval*oval*(0.8+1.5*caust);
  vec3 R=reflect(-V,N); vec3 toHole=normalize(uShaftB-vP);
  float spec=pow(max(dot(R,toHole),0.0),220.0);
  vec3 roof=mix(uHazeCol*0.9,uShaftCol*0.5*uCloud,smoothstep(0.75,0.99,dot(R,toHole)));
  col=mix(col,roof,fres*0.7)+uShaftCol*uCloud*spec*9.0;
  // the daylight column mirrored in the water: how near the reflected ray passes to the column's axis
  vec3 ab=uShaftB-uShaftA; vec3 rn=cross(R,ab); float miss=abs(dot(uShaftA-vP,rn))/max(length(rn),1e-3);
  col+=uShaftCol*uCloud*(0.16*(1.0-smoothstep(uShaftR*0.5,uShaftR*1.15,miss))*step(0.0,R.y)*(0.4+0.6*fres));
  // a tarn (water above the pool's level) holds the daylight in its milky water, more the nearer it lies to the column
  col+=uPoolCol*(step(0.05,vP.y)*uCloud*(0.5*uShaftR/(uShaftR+length(q)))*(0.75+0.5*w0));
  col=applyHaze(col,vP);
  gl_FragColor=vec4(col,smoothstep(0.0,1.0,vShore));
  #include <fog_fragment>
}`,Ia=mt+`
attribute vec3 aK; varying vec3 vK;        // v along (0 bottom..1 top), strength, angle
void main(){
  vP=position; vN=normal; vK=aK;
  vec4 mvPosition=modelViewMatrix*vec4(position,1.0);
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Da=pt+`
uniform vec3 uMilk;
varying vec3 vK;
void main(){
  vec3 N=normalize(vN); vec3 V=normalize(uCamL-vP);
  float wk=step(5.0,vK.y), wk0=wk;                                            // strength >= 5 marks the plume over the well
  float face=abs(dot(N,V));
  float soft=face*face*(3.0-2.0*face); soft*=soft;                              // a bright core, a transparent rim
  float rays=0.25+0.75*vn3(vec3(vK.z*5.0,vK.x*1.3-uTime*0.012,2.0))+0.45*vn3(vec3(vK.z*17.0,vK.x*2.0-uTime*0.02,7.0));
  rays=mix(rays,0.9,wk0*0.5);
  float mist=0.7+0.6*vn3(vec3(vP.xz*0.06,vP.y*0.035+uTime*0.07));
  float ends=smoothstep(0.0,0.05,vK.x)*(0.55+0.45*vK.x);
  ends=mix(ends,smoothstep(0.0,0.06,vK.x)*(1.0-vK.x)*(1.0-vK.x),wk);
  vec3 col=mix(uShaftCol*uCloud,(uPoolCol*1.3+uMilk*0.9)*(0.75+0.25*uCloud),wk)*(mix(0.088,0.125,wk)*(vK.y-10.0*wk)*(1.0+0.5*wk)*mix(soft,sqrt(soft),wk)*rays*mist*ends);
`+Bo+`
  gl_FragColor=vec4(col,1.0);
}`,Ha=mt+`
void main(){
  vP=position; vN=normal;
  vec4 mvPosition=modelViewMatrix*vec4(position,1.0);
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Ga=pt+`
uniform float uCloudPos, uStars; uniform vec3 uSkyA, uSkyB;
void main(){
  vec2 p=vP.xz-uShaftB.xz;
  float edge=p.x*0.8+p.y*0.6+(vn3(vec3(vP.xz*0.16,uTime*0.03))-0.5)*14.0+(vn3(vec3(vP.xz*0.5,3.0))-0.5)*5.0;
  float cl=smoothstep(-4.0,5.0,edge-uCloudPos);
  vec3 cell=floor(vec3(vP.xz*1.7,3.0));
  float star=step(0.93,h33(cell).x)*(1.0-smoothstep(0.05,0.32,length(fract(vP.xz*1.7)-0.5)))*(0.6+0.4*sin(uTime*(1.5+3.0*h33(cell).y)+h33(cell).z*40.0));
  vec3 blue=uSkyA+vec3(0.8,0.9,1.0)*(uStars*star*6.0);
  vec3 white=uSkyB*(1.0-0.33*smoothstep(4.0,22.0,edge-uCloudPos));
  gl_FragColor=vec4(mix(blue,white,cl),1.0);
}`,Ka=`
attribute vec4 aPt;                         // type, seed, size (m), speed
uniform vec3 uShaftA, uShaftB; uniform float uTime, uPx, uCloud;
varying vec4 vPt; varying float vA;
#include <fog_pars_vertex>
void main(){
  float ty=aPt.x, sd=aPt.y; vec3 p=position; float a=1.0; float size=aPt.z;
  if(ty<2.5){                                // in the column: position = (radius, y0, angle)
    float span=uShaftB.y-uShaftA.y-6.0;
    float y=mod(position.y-uTime*aPt.w,span)+2.0;
    float ang=position.z+uTime*(0.05+0.12*fract(sd*7.0))*(ty>0.5?1.0:0.3)+sin(uTime*0.4+sd*40.0)*0.3*step(0.5,ty);
    vec3 ax=uShaftA+(uShaftB-uShaftA)*((y-uShaftA.y)/(uShaftB.y-uShaftA.y));
    float r=position.x+sin(uTime*0.7+sd*91.0)*1.2*step(0.5,ty);
    p=vec3(ax.x+cos(ang)*r,y,ax.z+sin(ang)*r);
    a=smoothstep(0.0,8.0,y)*(1.0-smoothstep(span-10.0,span,y));
    if(ty>0.5&&ty<1.5) a*=0.55+0.45*sin(uTime*(9.0+sd*8.0)+sd*60.0);          // moth wing flicker
    if(ty>1.5) a*=0.5+0.5*abs(sin(uTime*(3.0+sd*3.0)+sd*20.0));                // leaf spin
  } else if(ty<3.5){                         // smoke where a thread fall lands
    float life=fract(uTime*0.16*aPt.w+sd);
    p+=vec3(sin(sd*40.0+life*2.0)*(1.0+3.5*life),life*(3.0+4.0*fract(sd*9.0)),cos(sd*23.0+life*2.0)*(1.0+3.5*life));
    size*=0.5+1.3*life; a=smoothstep(0.0,0.15,life)*(1.0-life);
  } else {                                   // a miner's lamp: it stands where it was hung and its flame wavers
    a=0.86+0.14*sin(uTime*(9.0+sd*7.0)+sd*40.0)*sin(uTime*5.3+sd*17.0);
  }
  vPt=aPt; vA=a*(ty>3.5?1.0:0.5+0.5*uCloud);
  vec4 mvPosition=modelViewMatrix*vec4(p,1.0);
  gl_Position=projectionMatrix*mvPosition;
  gl_PointSize=clamp(size*uPx/max(-mvPosition.z,0.5),ty>3.5?2.5:1.0,90.0);
  #include <fog_vertex>
}`,qa=`
uniform vec3 uShaftCol, uMilk, uWarm;
varying vec4 vPt; varying float vA;
#include <fog_pars_fragment>
void main(){
  vec2 c=gl_PointCoord-0.5; float d=length(c)*2.0;
  float ty=vPt.x; vec3 col;
  if(ty<0.5){ float s=1.0-smoothstep(0.0,1.0,d); col=uShaftCol*(0.038*s*s); }                  // mist
  else if(ty<1.5){ float s=1.0-smoothstep(0.25,1.0,max(abs(c.x)*1.3,abs(c.y)*3.0)*2.0); col=uMilk*(1.6*s); }   // moth
  else if(ty<2.5){ float s=1.0-smoothstep(0.3,1.0,d); col=vec3(0.45,0.8,0.25)*(0.7*s); }      // leaf
  else if(ty<3.5){ float s=1.0-smoothstep(0.0,1.0,d); col=mix(uShaftCol,uMilk,0.5)*(0.085*s*s); }       // smoke
  else { col=uWarm*((exp(-d*d*6.0)*0.55+exp(-d*d*70.0)*3.2)*(1.0-smoothstep(0.85,1.0,d))); }  // lamp: a warm flame in its own glow
  col*=vA;
`+Bo+`
  gl_FragColor=vec4(col,1.0);
}`,Oa=`
attribute vec4 aBird;                       // radius, y0, angle0, seed
attribute float aWing;
uniform vec3 uShaftA, uShaftB; uniform float uTime, uPx;
#include <fog_pars_vertex>
void main(){
  float sd=aBird.w, dir=sd>0.3?1.0:-1.0;
  float ang=aBird.z+uTime*(0.32+0.3*fract(sd*13.0))*dir;
  float dip=pow(max(sin(uTime*0.11+sd*33.0),0.0),6.0);                        // now and then one dips toward the pool
  float y=mix(aBird.y+sin(uTime*0.35+sd*20.0)*7.0,10.0+sd*10.0,dip*step(0.7,fract(sd*5.0)));
  float r=aBird.x*(0.8+0.2*sin(uTime*0.23+sd*50.0));
  vec3 ax=uShaftA+(uShaftB-uShaftA)*((y-uShaftA.y)/(uShaftB.y-uShaftA.y));
  vec3 c=vec3(ax.x+cos(ang)*r,y,ax.z+sin(ang)*r);
  vec3 fw=vec3(-sin(ang),0.0,cos(ang))*dir, rt=vec3(cos(ang),0.0,sin(ang));
  vec4 mvC=modelViewMatrix*vec4(c,1.0);
  float s=max(1.0,1.6*max(-mvC.z,0.1)/(uPx*0.9))*smoothstep(3.0,10.0,-mvC.z);   // keep a fleck at any distance; none in the lens
  float flap=sin(uTime*(13.0+sd*5.0)+sd*90.0);
  vec3 lp=position*s; lp.y+=aWing*flap*0.45*s;
  vec3 p=c+rt*lp.x*dir+vec3(0.0,lp.y,0.0)+fw*lp.z+rt*(-0.35*abs(lp.x)*dir*0.0);
  vec4 mvPosition=modelViewMatrix*vec4(p,1.0);
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,ja=`
uniform vec3 uBirdCol;
#include <fog_pars_fragment>
void main(){
  gl_FragColor=vec4(uBirdCol,1.0);
  #include <fog_fragment>
}`,la=mt+`
attribute vec3 aDir; attribute vec4 aRib;   // tangent; (side * half width, kind, along 0..1, seed)
uniform vec3 uCamL; uniform float uPx, uTime, uFallK;
varying vec4 vR; varying float vSide;
void main(){
  vec3 p=position; float kind=aRib.y, al=aRib.z, sd=aRib.w;
  if(kind>0.5&&kind<1.5){ float sw=al*al*1.6; p.x+=sin(uTime*0.6+sd*30.0+al*3.0)*sw; p.z+=cos(uTime*0.47+sd*17.0+al*2.3)*sw; }   // roots sway
  if(kind>2.5){ float sw=al*al*0.5; p.x+=sin(uTime*1.1+sd*30.0)*sw; p.z+=cos(uTime*0.9+sd*17.0)*sw; }                         // fronds and horsetails
  vec3 toC=uCamL-p;
  vec3 sideV=normalize(cross(aDir,toC)+vec3(1e-4));
  vec4 mvC=modelViewMatrix*vec4(p,1.0);
  float hw=max(abs(aRib.x)*(kind<0.5?uFallK:1.0),(kind<0.5?2.0:0.75)*max(-mvC.z,0.1)/uPx);
  p+=sideV*sign(aRib.x)*hw;
  vP=p; vN=normalize(cross(sideV,aDir)+vec3(1e-4)); vR=aRib; vSide=sign(aRib.x);
  vec4 mvPosition=modelViewMatrix*vec4(p,1.0);
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,ra=pt+`
uniform vec3 uMilk; uniform float uFrozen, uFallK;
varying vec4 vR; varying float vSide;
void main(){
  float kind=vR.y, al=vR.z, sd=vR.w;
  vec3 N=normalize(vN); vec3 Lk; vec3 E=geodeLight(vP,N,Lk)+geodeLight(vP,-N,Lk);
  vec3 col;
  if(kind<0.5){                                                               // thread waterfall
    float len=vR.z;                                                           // metres fallen
    float ice=step(h11(sd*3.7+0.31),uFrozen);                                  // winter: this fall is a frozen organ pipe
    float run=uTime*(1.0-ice);
    float st=vn3(vec3(vSide*2.2+sd*9.0,len*0.22-run*(3.2+len*0.03),sd*5.0));
    float st2=vn3(vec3(vSide*6.0,len*0.7-run*7.0,sd*3.0));
    float body=(1.0-vSide*vSide*0.7)*(0.45+0.55*st)*(0.6+0.4*st2)*(0.75+0.25*uFallK);
    body=mix(body,0.55+0.45*abs(sin(vSide*9.0+sd*20.0))*(0.7+0.3*st),ice);
    float strand=vn3(vec3(vSide*5.0+sd*13.0,len*0.05-run*0.4,sd*7.0));         // the thread parts into strands: gaps open and close down its length
    if(body<0.3+0.24*strand*(1.0-ice)) discard;
    vec3 Ew=E/(1.0+0.4*dot(E,vec3(0.3,0.5,0.2)));                              // water in the column is bright and keeps its streaks: never one white bar
    col=mix(uShaftCol,uMilk,0.6+0.3*ice)*(0.5*Ew+uAmbCol*2.0)*((0.8+2.3*body*body)*(1.0-0.6*ice))+mix(uShaftCol,uMilk,0.5)*(uCloud*eggGate(vP)*0.14*body);
  } else if(kind<1.5){ col=mix(vec3(0.07,0.05,0.045),vec3(0.16,0.14,0.11),h11(sd*7.0))*E*0.5; }      // roots
  else if(kind<2.5){ col=vec3(0.04,0.04,0.05)*E*0.5; }                                                // rope
  else if(kind<3.5){ col=mix(vec3(0.03,0.16,0.04),vec3(0.2,0.5,0.1),al)*E*0.5*(0.7+0.6*h11(sd*3.0)); }   // fern
  else { col=mix(vec3(0.2,0.36,0.2),vec3(0.6,0.78,0.5),al)*E*0.5/(1.0+0.12*dot(E,vec3(0.3,0.5,0.2))); }                                   // horsetail
`+It+"}",Wa=mt+`
attribute vec2 aBk;                         // phase, seed
uniform vec3 uCabA, uCabB, uCabSide; uniform float uCabSag, uTime;
void main(){
  float u=fract(aBk.x+uTime*0.012);
  float s=u<0.5?u*2.0:2.0-u*2.0; float lane=u<0.5?1.0:-1.0;
  vec3 c=mix(uCabA,uCabB,s)+uCabSide*lane; c.y-=uCabSag*4.0*s*(1.0-s);
  vec3 fw=normalize(uCabB-uCabA), rt=normalize(uCabSide);
  float sw=sin(uTime*1.25+aBk.y*40.0)*0.13;
  vec3 lp=position*vec3(1.6,1.3,1.6); lp.xy=vec2(lp.x*cos(sw)-lp.y*sin(sw),lp.x*sin(sw)+lp.y*cos(sw));
  vec3 ln=normal; ln.xy=vec2(ln.x*cos(sw)-ln.y*sin(sw),ln.x*sin(sw)+ln.y*cos(sw));
  vP=c+rt*lp.x+vec3(0.0,lp.y,0.0)+fw*lp.z; vN=normalize(rt*ln.x+vec3(0.0,ln.y,0.0)+fw*ln.z);
  vec4 mvPosition=modelViewMatrix*vec4(vP,1.0);
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Ya=pt+`
uniform vec3 uBkGlow, uMilk;
void main(){
  vec3 N=normalize(vN); vec3 V=normalize(uCamL-vP); if(dot(N,V)<0.0) N=-N;
  vec3 Lk; vec3 E=geodeLight(vP,N,Lk);
  float rust=vn3(vP*2.3);
  E/=1.0+0.25*dot(E,vec3(0.3,0.5,0.2));
  vec3 col=mix(vec3(0.05,0.05,0.07),vec3(0.15,0.12,0.12),rust)*(E+uAmbCol*0.5);
  col+=mix(uShaftCol,uMilk,0.4)*((0.35+0.65*uCloud)*0.5*pow(1.0-max(dot(N,V),0.0),2.0));   // a pale rim so the iron reads against the wall
  col+=uBkGlow*(0.75+0.25*sin(uTime*1.7+vP.x*0.4+vP.z*0.3));
`+It+"}";function mo(p){const E=new z.BufferGeometry;return E.setAttribute("position",new z.Float32BufferAttribute(p,3)),E.computeVertexNormals(),E}function ia(){const p=[],E=(x,P,j)=>{const k=j/6*B;return[Math.cos(k)*x,P,Math.sin(k)*x]},W=[.16,1,.1];for(let x=0;x<6;x++){const P=E(.74,0,x),j=E(.74,0,x+1),k=E(1,.66+.05*(x%2),x),_=E(1,.66+.05*((x+1)%2),x+1);p.push(...P,...k,..._,...P,..._,...j,...k,...W,..._)}return mo(p)}function ca(){const p=[],x=(P,j,k)=>{const _=k/6*B+.26;return[Math.cos(_)*P,j,Math.sin(_)*P]};for(let P=0;P<6;P++){const j=(k,_,M,$)=>{const le=x(k,_,P),ue=x(k,_,P+1),Q=x(M,$,P),Te=x(M,$,P+1);p.push(...le,...Q,...Te,...le,...Te,...ue)};j(.5,-.5+.014,.5,.5-.014),j(.5,.5-.014,.5*.6,.5),j(.5*.6,-.5,.5,-.5+.014),p.push(...x(.5*.6,.5,P),.05,.5+.014*.5,0,...x(.5*.6,.5,P+1)),p.push(...x(.5*.6,-.5,P+1),.05,-.5-.014*.5,0,...x(.5*.6,-.5,P))}return mo(p)}function da(){const p=[],E=[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]];for(let W=0;W<4;W++){const[x,P]=E[W],[j,k]=E[(W+1)%4];p.push(x,0,P,x,1,P,j,1,k,x,0,P,j,1,k,j,0,k)}return mo(p)}function fa(){const p=[],W=(M,$,le)=>{const ue=le/8*B;return[Math.cos(ue)*M,$,Math.sin(ue)*M*1.25]};for(let M=0;M<8;M++){const $=W(.55,-3.5,M),le=W(.55,-3.5,M+1),ue=W(.8,-2.3,M),Q=W(.8,-2.3,M+1),Te=W(.86,-2.22,M),Ae=W(.86,-2.22,M+1);p.push(...$,...ue,...Q,...$,...Q,...le,...ue,...Te,...Ae,...ue,...Ae,...Q,...le,0,-3.5,0,...$)}const x=(M,$,le,ue,Q)=>{p.push(M,$,-Q,le,ue,-Q,le,ue,Q,M,$,-Q,le,ue,Q,M,$,Q)};x(-.8,-2.4,-.12,-.3,.07),x(.8,-2.4,.12,-.3,.07);const P=.14,j=-.42,k=.12,_=.3;for(const M of[-1,1])p.push(M*P,j,-_,M*P,k,-_,M*P,k,_,M*P,j,-_,M*P,k,_,M*P,j,_);for(const M of[-1,1])p.push(-P,j,M*_,-P,k,M*_,P,k,M*_,-P,j,M*_,P,k,M*_,P,j,M*_);return mo(p)}const po=p=>p>Ct?Jo:Ao,Lt=(p,E,W)=>(p*p+W*W)/(Pt*Pt)+((E-Ct)/po(E))**2;function Be(p,E,W,x,P,j,k,_,M,$,le,ue){const Q=x-p,Te=P-E,Ae=j-W,Ne=$-k,Ee=le-_,tt=ue-M,J=p-k,c=E-_,F=W-M,ye=Q*Q+Te*Te+Ae*Ae,be=Ne*Ne+Ee*Ee+tt*tt,ze=Ne*J+Ee*c+tt*F;let oe,K;if(ye<1e-9&&be<1e-9)oe=0,K=0;else if(ye<1e-9)oe=0,K=Se(ze/be,0,1);else{const Re=Q*J+Te*c+Ae*F;if(be<1e-9)K=0,oe=Se(-Re/ye,0,1);else{const at=Q*Ne+Te*Ee+Ae*tt,Fe=ye*be-at*at;oe=Fe>1e-9?Se((at*ze-Re*be)/Fe,0,1):0,K=(at*oe+ze)/be,K<0?(K=0,oe=Se(-Re/ye,0,1)):K>1&&(K=1,oe=Se((at-Re)/ye,0,1))}}const it=J+Q*oe-Ne*K,xt=c+Te*oe-Ee*K,ot=F+Ae*oe-tt*K;return Math.sqrt(it*it+xt*xt+ot*ot)}function Ua(p,E,W){const x={},P=x.hc={x:-5+p.range(-1.5,1.5),z:2+p.range(-1.5,1.5)},j=ho*B*et,k=oo-Vo,_=1.5,M=[],$=[];let le=0;const ue=.07,Q=P.x+et*Math.cos(_t),Te=P.z-et*Math.sin(_t),Ae=-Math.sin(_t),Ne=-Math.cos(_t),Ee=19*Math.PI/180,tt=[];{let m=Q,y=Te;for(let L=1;L<=60;L++){const T=Ee*vt(5,38,(L-.5)*_),q=Ae*Math.cos(T)+Ne*Math.sin(T),N=Ne*Math.cos(T)-Ae*Math.sin(T);m-=q*_,y-=N*_,le=L*_;const U=Ee*vt(5,38,le);if(tt.push({x:m,y:oo+le*ue,z:y,hx:Ae*Math.cos(U)+Ne*Math.sin(U),hz:Ne*Math.cos(U)-Ae*Math.sin(U)}),Lt(m,oo+le*ue,y)>=.955)break}}for(let m=tt.length-1;m>=0;m--)M.push(tt[m]);x.helixStartIdx=M.length;const J=Math.round(j/_);for(let m=0;m<=J;m++){const y=m/J,L=_t+y*ho*B,T=oo-k*y,q=Math.cos(L),N=Math.sin(L);M.push({x:P.x+et*q,y:T,z:P.z-et*N,hx:-N,hz:-q,th:L}),$.push({x:P.x+Ft*q,y:T,z:P.z-Ft*N,hx:-N,hz:-q,th:L})}x.helixEndIdx=M.length-1,x.nH=J;const c=[];let F=0,ye=0;for(let m=0;m<=100;m+=2){c.push([F,ye]);const y=H(15,66,vt(0,40,m+1))*Math.PI/180;F+=Math.cos(y)*2,ye+=Math.sin(y)*2}const be=c[c.length-1],ze=1.7,oe=6+be[1]-ze,K=M[M.length-1],it=K.hx,xt=K.hz;let ot=P.x-K.x,Re=P.z-K.z;const at=Math.hypot(ot,Re);ot/=at,Re/=at;const Fe=22,gt=p.range(120,128)*Math.PI/180,ct=Fe*gt,xo=4.5,nt=ct+xo,Bt=K.x+ot*Fe,Xe=K.z+Re*Fe,qe=m=>{const y=Math.min(m,ct)/Fe,L=Math.cos(y),T=Math.sin(y),q=Math.max(0,m-ct),N=it*L+ot*T,U=xt*L+Re*T;return{x:Bt+Fe*(-ot*L+it*T)+N*q,y:H(Vo,oe,m/nt),z:Xe+Fe*(-Re*L+xt*T)+U*q,hx:N,hz:U}},Oe=Math.round(nt/_);for(let m=1;m<=Oe;m++)M.push(qe(m/Oe*nt));x.outer=M;const ve=$[$.length-1],_e=qe(Fe*1.08),dt=8+(Ft-et)*.4,Yt=[ve.x,ve.z],fe=[ve.x+it*dt,ve.z+xt*dt],Qe=[_e.x-_e.hx*dt,_e.z-_e.hz*dt],je=[_e.x,_e.z];for(let m=1;m<=14;m++){const y=m/14,L=1-y,T=L*L*L,q=3*L*L*y,N=3*L*y*y,U=y*y*y,ne=T*Yt[0]+q*fe[0]+N*Qe[0]+U*je[0],Z=T*Yt[1]+q*fe[1]+N*Qe[1]+U*je[1],ee=$[$.length-1];let te=ne-ee.x,Ce=Z-ee.z;const lt=Math.hypot(te,Ce)||1;$.push({x:ne,y:H(ve.y,_e.y,y),z:Z,hx:te/lt,hz:Ce/lt})}x.second=$;const We=M[M.length-1];x.railEnd=We,x.dive=c.map(([m,y])=>({x:We.x+We.hx*m,y:We.y+ze-y,z:We.z+We.hz*m}));const Y=x.dive[x.dive.length-1];x.well={x:Y.x,y:6,z:Y.z},x.sight=[];for(let m=x.helixEndIdx-24;m<M.length;m+=6){const y=M[m],L=Y.x-y.x,T=11-(y.y+ze),q=Y.z-y.z,N=Math.hypot(L,T,q);x.sight.push([y.x+L*(13/N),y.y+ze+T*(13/N),y.z+q*(13/N),y.x+L*((N-9)/N),y.y+ze+T*((N-9)/N),y.z+q*((N-9)/N)])}{const m=M[0],y=M[Math.min(27,x.helixStartIdx)];x.revealSeg=[m.x,m.y+ze,m.z,y.x,y.y+ze,y.z]}const Dt=Math.cos(66*Math.PI/180),yt=Math.sin(66*Math.PI/180);x.portalN={x:-We.hx*Dt,y:yt,z:-We.hz*Dt};const Ge=x.spot={x:Y.x-We.hx*12,z:Y.z-We.hz*12};x.pool={x:Ge.x*.55,z:Ge.z*.55,r:25};const Tt={x:Ge.x+(P.x-Ge.x)*.85,z:Ge.z+(P.z-Ge.z)*.85};x.sink={x:Tt.x,y:174,z:Tt.z},x.shaftA=new g(Ge.x,0,Ge.z),x.shaftB=new g(Ge.x+(Tt.x-Ge.x)*(193/175),193,Ge.z+(Tt.z-Ge.z)*(193/175)),x.shaftAt=(m,y)=>{const L=m/193;return y.x=H(x.shaftA.x,x.shaftB.x,L),y.z=H(x.shaftA.z,x.shaftB.z,L),y};const Je=M.length+$.length,Pe=new Float32Array(Je*3);let Ie=0;for(const m of M)Pe[Ie++]=m.x,Pe[Ie++]=m.y,Pe[Ie++]=m.z;for(const m of $)Pe[Ie++]=m.x,Pe[Ie++]=m.y,Pe[Ie++]=m.z;const st=x.dive,ie=M[0].y,ae=M[M.length-1].y;x.clear=(m,y,L,T,q,N,U)=>{const ne=T*T,Z=U*U;let ee=!(y-ie>N||y-ae<q);if(ee){const te=m-P.x,Ce=L-P.z;te*te+Ce*Ce>(Ft+T+1)**2&&Math.abs((m-Q)*Ne-(L-Te)*Ae)>T+22&&(ee=!1)}if(ee)for(let te=0;te<Pe.length;te+=3){const Ce=y-Pe[te+1];if(Ce>q&&Ce<N){const lt=m-Pe[te],zt=L-Pe[te+2];if(lt*lt+zt*zt<ne)return!1}}for(let te=0;te<st.length;te++){const Ce=st[te],lt=m-Ce.x,zt=y-Ce.y,V=L-Ce.z;if(lt*lt+zt*zt+V*V<Z)return!1}return!0},x.segClear=(m,y,L,T,q,N,U=6)=>{for(let ne=0;ne<=U;ne++){const Z=ne/U;if(!x.clear(H(m.x,y.x,Z),H(m.y,y.y,Z),H(m.z,y.z,Z),L,T,q,N))return!1}return!0};const Ke=x.pool,Ze=(m,y)=>1.5+1.7*E.fbm2(m*.045+3.1,y*.045-1.7,3)+.45*E.n2(m*.31,y*.31),kt=x.tarns=[];{const m=W("geode-water"),y=Math.atan2(Y.z-Ke.z,Y.x-Ke.x);for(let L=0;L<2;L++){let T=y+(L?1:-1)*m.range(1.5,2.5),q=Ke.r*1.28,N=.1;for(let U=0;U<7;U++){const ne=m.range(3.6,6.4);q+=ne;const Z=Ke.x+Math.cos(T)*q,ee=Ke.z+Math.sin(T)*q;if(Math.hypot(Z,ee)+ne>49||Math.hypot(Z-Y.x,ee-Y.z)<19+ne)break;N=Math.max(N+.3,Math.min(Ze(Z,ee)-.2,N+.9)),kt.push({x:Z,z:ee,r:ne,y:N}),q+=ne+.5,T+=m.range(-.16,.16)}}}return x.floorH=(m,y)=>{const L=m*m+y*y;let T=Ze(m,y);const q=Math.hypot(m-Ke.x,y-Ke.z)/(Ke.r*(1+.13*E.n2(m*.05+9,y*.05+4)));T=H(-3.4,Math.max(T,.35),vt(.84,1.1,q));for(let ne=0;ne<kt.length;ne++){const Z=kt[ne],ee=Math.hypot(m-Z.x,y-Z.z);if(ee>Z.r+3.2)continue;const te=Z.r*(1+.1*E.n2(m*.19+Z.x,y*.19+Z.z));T=ee<te?Z.y-.1-.7*(1-(ee/te)**2):H(T,Math.max(T,Z.y+.25),vt(te+2.8,te+.3,ee))}const N=Math.hypot(m-Y.x,y-Y.z);T=H(T,4.4+.8*E.n2(m*.4,y*.4),vt(15.5,10.2,N)),N<8.8&&(T=H(-11,T,vt(6.6,8.8,N)));const U=Ct-Ao*Math.sqrt(Math.max(0,1-L/(Pt*Pt)));return Math.max(T,U+.5)},x}async function Qa(p,E={}){const W=p.rng.fork?p.rng.fork("geode-hero"):p.rng,x=p.noise,P=p.rng.fork?p.rng.fork("geode-druse"):W,j=p.rng.fork?p.rng.fork("geode-falls"):W,k=e=>Aa(Va(e+":"+p.seed)),_=(E.palette&&E.palette.length>=7?E.palette:La).map(e=>new z.Color(e)),[M,$,le,ue,Q,Te,Ae]=_,Ne=p.quality&&p.quality.detail||1,Ee=E.preview,tt=E.cutaway!==void 0?!!E.cutaway:!0,J=new z.Group;J.name="geode-run-hero";const c=Ua(W,x,k),F=new g,ye=new g,be=new g,ze=new z.Matrix4;await p.yield();const oe={uShaftA:{value:c.shaftA.clone()},uShaftB:{value:c.shaftB.clone()},uShaftR:{value:Me},uShaftCol:{value:Q.clone().multiplyScalar(2.3)},uAmbCol:{value:Q.clone().lerp(le,.55).multiplyScalar(.085)},uPoolCol:{value:Te.clone()},uHazeCol:{value:Q.clone().lerp(le,.6).multiplyScalar(.26)},uLampCol:{value:ue.clone().multiplyScalar(5)},uCamL:{value:new g(0,80,300)},uLampPos:{value:new z.Vector4(0,-999,0,0)},uLampDir:{value:new z.Vector4(0,0,-1,Math.cos(24*Math.PI/180))},uCloud:{value:1},uTime:{value:0},uHaze:{value:E.haze!==void 0?E.haze:.003},uGlint:{value:E.glint!==void 0?E.glint:1},uOutside:{value:0},uPx:{value:400},uRoot:{value:$.clone()},uTip:{value:le.clone()},uShadow:{value:M.clone()},uMilk:{value:ue.clone().multiplyScalar(.92)},uTimber:{value:Ae.clone()},uLampRange:{value:30},uPt:{value:[0,1,2,3,4,5,6,7].map(()=>new z.Vector4(0,-999,0,0))},uPtCol:{value:ue.clone().lerp(Q,.35)},uDarkCol:{value:le.clone().lerp(Q,.5).multiplyScalar(.012)},uSkyA:{value:new z.Color(.16,.42,1).multiplyScalar(2.3)},uSkyB:{value:new z.Color(1,1,1.02).multiplyScalar(3.6)},uStars:{value:0},uBirdCol:{value:new z.Color(.012,.012,.02)},uBkGlow:{value:new z.Color(0,0,0)},uFallK:{value:1},uFrozen:{value:0},uGlowA:{value:new z.Color("#D873CC")},uGlowB:{value:new z.Color("#F9AEDD")},uGlowK:{value:1},uWarm:{value:new z.Color(1,.5,.17).multiplyScalar(1.7)},uCast2:{value:le.clone()}},K=(e,o,t={},s={})=>new z.ShaderMaterial(Object.assign({vertexShader:e,fragmentShader:o,fog:!0,uniforms:Object.assign(z.UniformsUtils.clone(z.UniformsLib.fog),oe,t)},s)),it=[],xt=[],ot=[],Re=[],at=[],Fe=(e,o,t)=>{const s=it.length/3,l={p:[0,0,0],c:[1,1,1],m:[0,0,0],r:[0,1,0]};for(let r=0;r<=o;r++)for(let a=0;a<=e;a++)t(a/e,r/o,l),it.push(...l.p),xt.push(...l.c),ot.push(...l.m),Re.push(...l.r);for(let r=0;r<o;r++)for(let a=0;a<e;a++){const i=s+r*(e+1)+a,n=i+1,d=i+e+1,f=d+1;at.push(i,d,n,n,d,f)}},gt=(e,o,t)=>{const s=Math.cos(o),l=Pt*Math.sin(o),r=Ct+(s>0?Jo:Ao)*s,a=l*Math.cos(e),i=l*Math.sin(e),n=1+.045*x.fbm3(a*.017,r*.017,i*.017,3)+.012*x.n3(a*.07,r*.07,i*.07);return t[0]=a*n,t[1]=Ct+(r-Ct)*n,t[2]=i*n,t},ct=(e,o,t,s)=>{const l=po(o),r=-e/(Pt*Pt),a=-(o-Ct)/(l*l),i=-t/(Pt*Pt),n=Math.hypot(r,a,i)||1;return s[0]=r/n,s[1]=a/n,s[2]=i/n,s},xo=2.7,nt=112,Bt=68,Xe=new Float32Array((nt+1)*(Bt+1)*5),qe=[0,0,0];for(let e=0;e<=Bt;e++){for(let o=0;o<=nt;o++){gt(o/nt*B,.012+e/Bt*(xo-.012),qe);const t=(e*(nt+1)+o)*5;Xe[t]=qe[0],Xe[t+1]=qe[1],Xe[t+2]=qe[2],Xe[t+3]=.95+.4*x.fbm3(qe[0]*.03+5,qe[1]*.03,qe[2]*.03,2),Xe[t+4]=x.n3(qe[0]*.02,qe[1]*.02+7,qe[2]*.02)}e%12===11&&await p.yield()}Fe(nt,Bt,(e,o,t)=>{const s=(Math.round(o*Bt)*(nt+1)+Math.round(e*nt))*5,l=Xe[s+3],r=Xe[s+4];t.p[0]=Xe[s],t.p[1]=Xe[s+1],t.p[2]=Xe[s+2],ct(t.p[0],t.p[1],t.p[2],t.r),t.c[0]=l*(1+.14*r),t.c[1]=l*(1-.05*r),t.c[2]=l*(1-.1*r),t.m[0]=0,t.m[1]=0,t.m[2]=0}),await p.yield();const Oe=c.spot,ve=c.well,_e=132,dt=44,Yt=new Float32Array((_e+1)*(dt+1));for(let e=0;e<=dt;e++){const o=57.5*Math.pow(e/dt,.85);for(let t=0;t<=_e;t++){const s=t/_e*B;Yt[e*(_e+1)+t]=c.floorH(Math.cos(s)*o,Math.sin(s)*o)}e%4===3&&await p.yield()}Fe(_e,dt,(e,o,t)=>{const s=e*B,l=57.5*Math.pow(o,.85),r=Math.cos(s)*l,a=Math.sin(s)*l,i=Yt[Math.round(o*dt)*(_e+1)+Math.round(e*_e)];t.p[0]=r,t.p[1]=i,t.p[2]=a,t.r[0]=0,t.r[1]=1,t.r[2]=0;const n=.8+.35*x.n2(r*.11,a*.11),d=Math.hypot(r-Oe.x,a-Oe.z);t.c[0]=n,t.c[1]=n*.97,t.c[2]=n*1.06;const f=vt(-.2,1.2,i);t.m[0]=1,t.m[1]=f*vt(19,9,d)*(.55+.45*x.n2(r*.2+3,a*.2)),t.m[2]=1}),await p.yield();const fe=new g;Fe(40,6,(e,o,t)=>{const s=e*B,l=169+o*24;c.shaftAt(l,fe);const r=Me+.6+1.6*x.n2(Math.cos(s)*2.2+11,Math.sin(s)*2.2+l*.08)+(o>.9?1.5:0);t.p[0]=fe.x+Math.cos(s)*r,t.p[1]=l,t.p[2]=fe.z+Math.sin(s)*r,t.r[0]=-Math.cos(s),t.r[1]=0,t.r[2]=-Math.sin(s);const a=1.2+1.3*o;t.c[0]=a,t.c[1]=a,t.c[2]=a,t.m[0]=1,t.m[1]=.35+.6*o,t.m[2]=1});const Qe=c.outer[0],je=new g(Qe.x,Qe.y+2.2,Qe.z);E.throatStub!==!1&&Fe(16,4,(e,o,t)=>{const s=e*B,l=5.9+.9*x.n2(Math.cos(s)*1.7+o*2,Math.sin(s)*1.7+30),r=1.5-o*13.5,a=Math.cos(s)*l;t.p[0]=je.x+Qe.hx*r+Qe.hz*a,t.p[1]=je.y+o*13.5*.07+Math.sin(s)*l*.9,t.p[2]=je.z+Qe.hz*r-Qe.hx*a,t.r[0]=-Qe.hz*Math.cos(s),t.r[1]=-Math.sin(s),t.r[2]=Qe.hx*Math.cos(s);const i=.9-.5*o;t.c[0]=i,t.c[1]=i,t.c[2]=i*1.1,t.m[0]=.55,t.m[1]=0,t.m[2]=1});const We=W.range(0,B),Y=gt(We,W.range(.42,.56),[0,0,0]),Dt=ct(Y[0],Y[1],Y[2],[0,0,0]);await p.yield();const yt=new z.BufferGeometry;yt.setAttribute("position",new z.Float32BufferAttribute(it,3)),await p.yield(),yt.setAttribute("color",new z.Float32BufferAttribute(xt,3)),yt.setAttribute("aMat",new z.Float32BufferAttribute(ot,3)),await p.yield(),yt.setIndex(at),yt.computeVertexNormals(),await p.yield();{const e=yt.attributes.normal.array;for(let o=0;o<e.length;o+=3)e[o]*Re[o]+e[o+1]*Re[o+1]+e[o+2]*Re[o+2]<0&&(e[o]=-e[o],e[o+1]=-e[o+1],e[o+2]=-e[o+2])}const Ge=K(Ea,Ra,{uMouth:{value:new z.Vector4(je.x,je.y,je.z,5.3)},uHole2:{value:new z.Vector4(Y[0],Y[1],Y[2],4.2)}},{side:z.DoubleSide}),Tt=new z.Mesh(yt,Ge);Tt.frustumCulled=!1,J.add(Tt),await p.yield();const Je=new g,Pe=new g,Ie=new g,st=(e,o,t,s,l,r,a,i)=>{if(Pe.copy(o).normalize(),i?Je.copy(i):Je.set(Math.abs(Pe.y)>.9?1:0,Math.abs(Pe.y)>.9?0:1,0),Ie.crossVectors(Je,Pe),Ie.lengthSq()<1e-6&&(Je.set(.3,.2,.9),Ie.crossVectors(Je,Pe)),Ie.normalize(),Je.crossVectors(Pe,Ie).normalize(),r){const n=Math.cos(r),d=Math.sin(r);be.copy(Je).multiplyScalar(n).addScaledVector(Ie,d),Ie.multiplyScalar(n).addScaledVector(Je,-d),Je.copy(be)}return a.makeBasis(be.copy(Je).multiplyScalar(s),F.copy(Pe).multiplyScalar(t),ye.copy(Ie).multiplyScalar(l)).setPosition(e),a},ie=k("geode-beams"),ae=k("geode-points"),Ke=k("geode-collar"),Ze=k("geode-splinters"),kt=k("geode-rings"),m=k("geode-blade"),y=k("geode-roots"),L=k("geode-ferns"),T=k("geode-cableway"),q=k("geode-buckets"),N=k("geode-mist"),U=k("geode-moths"),ne=k("geode-leaves"),Z=k("geode-flock"),ee=[],te=[c.shaftA.x,c.shaftA.y,c.shaftA.z,c.shaftB.x,c.shaftB.y-20,c.shaftB.z],Ce=(e,o,t)=>{let s=0;for(;s<t&&Lt(e.x+o.x*(s+2),e.y+o.y*(s+2),e.z+o.z*(s+2))<1&&e.y+o.y*(s+2)>c.floorH(e.x+o.x*(s+2),e.z+o.z*(s+2))-1;)s+=2;return s},lt=(e,o,t)=>{if(!c.segClear(e,o,5.2+t*.5,-7-t*.5,8.5+t*.5,8+t*.5,Math.ceil(e.distanceTo(o)/3)))return!1;for(const s of ee)if(Be(e.x,e.y,e.z,o.x,o.y,o.z,s.a.x,s.a.y,s.a.z,s.b.x,s.b.y,s.b.z)<(t+s.wx)*.5-.6)return!1;if(e.distanceTo(je)<16||o.distanceTo(je)<16||Be(e.x,e.y,e.z,o.x,o.y,o.z,...c.revealSeg)<21+t*.5)return!1;for(const s of c.sight)if(Be(e.x,e.y,e.z,o.x,o.y,o.z,s[0],s[1],s[2],s[3],s[4],s[5])<4+t*.5)return!1;return!0},zt=(e,o,t,s,l)=>{const r=Be(e.x,e.y,e.z,o.x,o.y,o.z,...te);let a=.5,i=1e9;for(let d=0;d<=20;d++){const f=d/20,v=H(e.y,o.y,f);c.shaftAt(Se(v,0,193),fe);const h=Math.hypot(H(e.x,o.x,f)-fe.x,H(e.z,o.z,f)-fe.z);h<i&&(i=h,a=f)}const n=(1-vt(Me*.55,Me*1.25,r))*(Math.max(e.y,o.y)>4?1:.6);ee.push({a:e.clone(),b:o.clone(),wx:t,wz:s,blaze:n,tS:a,seed:l===void 0?ie():l})},V=new g,me=new g,se=new g,O=[0,0,0],Ve=[0,0,0];for(let e=0,o=0;e<9&&o<400;o++){const t=ie.range(22,158);c.shaftAt(t,fe);const s=e<6?ie.range(0,9):ie.range(18,45),l=ie.range(0,B);F.set(fe.x+Math.cos(l)*s,t,fe.z+Math.sin(l)*s);const r=ie.range(0,B),a=ie.range(-.75,.75);if(V.set(Math.cos(r)*Math.cos(a),Math.sin(a),Math.sin(r)*Math.cos(a)),Lt(F.x,F.y,F.z)>.8)continue;const i=Ce(F,V,130),n=Ce(F,ye.copy(V).negate(),130);me.copy(F).addScaledVector(V,-n-1.5),se.copy(F).addScaledVector(V,i+1.5),ie.chance(.45)&&(ie.chance(.5)?me.copy(F).addScaledVector(V,-Math.min(n,ie.range(14,30))):se.copy(F).addScaledVector(V,Math.min(i,ie.range(14,30))));const d=me.distanceTo(se),f=ie.range(3.4,5.2);d<55||d>165||!lt(me,se,f)||(zt(me,se,f,f*ie.range(.55,.8)),e++,e%3===0&&await p.yield())}await p.yield();for(let e=0,o=0;e<30&&o<900;o++){if(gt(ie.range(0,B),Math.acos(ie.range(-.8,.9)),O),ct(O[0],O[1],O[2],Ve),O[1]<c.floorH(O[0],O[2])+1)continue;V.set(Ve[0]+ie.range(-.9,.9),Ve[1]+ie.range(-.9,.9),Ve[2]+ie.range(-.9,.9)).normalize();const t=ie.range(24,58),s=ie.range(2.1,3.7);me.set(O[0],O[1],O[2]).addScaledVector(V,-3),se.copy(me).addScaledVector(V,t),!(Lt(se.x,se.y,se.z)>.93||se.y<c.floorH(se.x,se.z)+2||!lt(me,se,s))&&(zt(me,se,s,s*ie.range(.5,.85)),e++)}let To=null;{const e=k("geode-pass-beam"),o=_t+(ho-1)*B,t=6,s=[],l=2.3;let r=-1,a=-1,i=-1,n=1e9;for(let f=c.helixStartIdx;f<=c.helixEndIdx;f++){const v=c.outer[f];if(v.th<o)continue;const h=Math.hypot(v.x-ve.x,v.z-ve.z);h>i&&(i=h,r=f),h<n&&(n=h,a=f)}for(let f=0;f<t;f++)s.push(e.int(Math.min(r,a),Math.max(r,a)));const d=e();for(const f of s){const v=c.outer[f],h=(v.x-c.hc.x)/et,u=(v.z-c.hc.z)/et,S=v.y+4.5;F.set(v.x,S,v.z),V.set(h,0,u).normalize();const w=Ce(F,V,80);if(se.copy(F).addScaledVector(V,w+2),me.copy(F).addScaledVector(V,-24),!!c.segClear(me,se,2.2,-3,4,7,30)){zt(me,se,l,l*.62,d),To={position:new g(v.x,S,v.z),dist:f*1.5};break}}}const Ht=new g(ve.x,ve.y,ve.z),Ut=new g(c.portalN.x,c.portalN.y,c.portalN.z),No=new g().crossVectors(Ut,new g(0,1,0)).normalize(),ha=new g().crossVectors(Ut,No).normalize(),Eo=[];for(let e=0;e<12;e++){const o=e/12*B+Ke.range(-.08,.08),t=Ke.range(12,18),s=Ke.range(1.7,2.5);F.copy(No).multiplyScalar(Math.cos(o)).addScaledVector(ha,Math.sin(o)),V.copy(Ut).addScaledVector(F,Ke.range(.3,.5)).normalize(),me.copy(Ht).addScaledVector(F,$o+1.5+s*.3).addScaledVector(V,-6.5),se.copy(me).addScaledVector(V,t),Eo.push({a:me.clone(),b:se.clone(),wx:s,wz:s*.42,blaze:1,tS:.75,seed:Ke(),hint:F.clone()})}{const e=ee.concat(Eo),o=e.length,t=ca(),s=new Float32Array(o*4),l=new z.InstancedMesh(t,K(oa,aa),o),r=new g;e.forEach((a,i)=>{r.copy(a.a).add(a.b).multiplyScalar(.5),V.copy(a.b).sub(a.a);const n=V.length();l.setMatrixAt(i,st(r,V,n,a.wx,a.wz,a.hint?0:a.seed*B,ze,a.hint)),s[i*4]=a.seed,s[i*4+1]=a.blaze,s[i*4+2]=n,s[i*4+3]=a.tS}),t.setAttribute("aSel",new z.InstancedBufferAttribute(s,4)),l.frustumCulled=!1,J.add(l)}await p.yield();{const e=Math.round(5200*(.6+.4*Ne)),o=56,t=14,s=16,l=e+o*15+(t+s)*12,r=ia(),a=new Float32Array(l*3),i=new z.InstancedMesh(r,K(ea,ta),l),n=new g,d=new g,f=new g,v=new g,h=new g,u=new g,S=new g;let w=0,I=0;for(;w<e&&I++<8e3;){const R=ae.chance(.13);if(R){const de=ae.range(0,B),xe=ae.range(23,54);if(n.set(Math.cos(de)*xe,0,Math.sin(de)*xe),n.y=c.floorH(n.x,n.z),n.y<.6||Math.hypot(n.x-ve.x,n.z-ve.z)<14.5||Math.hypot(n.x-Oe.x,n.z-Oe.z)<17)continue;d.set(-n.x*.008,1,-n.z*.008).normalize()}else if(gt(ae.range(0,B),Math.acos(ae.range(-.97,.992)),O),ct(O[0],O[1],O[2],Ve),n.set(O[0],O[1],O[2]),d.set(Ve[0],Ve[1],Ve[2]),n.y<c.floorH(n.x,n.z)-.5||(c.shaftAt(Se(n.y,0,193),fe),n.y>150&&Math.hypot(n.x-fe.x,n.z-fe.z)<Me+4)||n.distanceTo(je)<9.5||Math.hypot(n.x-Y[0],n.y-Y[1],n.z-Y[2])<8)continue;f.set(d.y,d.z,-d.x).cross(d).normalize(),v.crossVectors(d,f);const D=ae.chance(.2),re=D?ae.range(8,14):ae.range(3,7)*(R?.7:1),G=ae.int(4,D?10:8),C=Math.pow(ae(),2.2),X=ae.range(.8,1.25),ut=re*ae.range(.3,.5);for(let de=0;de<G&&w<e;de++){const xe=de===0?re:re*ae.range(.22,.72),ge=de===0?ae.range(0,.3):ae.range(.25,.95),we=ae.range(0,B);S.copy(d).addScaledVector(f,Math.cos(we)*ge).addScaledVector(v,Math.sin(we)*ge).normalize();const He=de===0?0:ut*ae.range(.5,1.4);if(h.copy(n).addScaledVector(f,Math.cos(we)*He).addScaledVector(v,Math.sin(we)*He).addScaledVector(S,-xe*.2),u.copy(h).addScaledVector(S,xe),!c.segClear(h,u,4.5,-5,7,7.5,3))continue;const Le=xe*ae.range(.2,.3)+.15;i.setMatrixAt(w,st(h,S,xe,Le,Le*ae.range(.8,1.1),ae.range(0,B),ze)),a[w*3]=ae(),a[w*3+1]=Se(C+ae.range(-.1,.1),0,1),a[w*3+2]=X*ae.range(.85,1.15)*(de===0?1:.78),w++}(I&127)===0&&await p.yield()}await p.yield();{const R=P.range(0,B),D=2.399963,re=32;for(let G=0;G<o;G++){const C=k("geode-druse"+G),X=40+120*((G+.5)/o),ut=Math.pow(C(),2.2),de=C.range(.95,1.25),xe=[],ge=[];for(let rt=0;rt<re;rt++)xe.push([C.range(-3,3),rt?C.range(-.45,.45):0,C.range(16,26),C.range(1.5,2.25),C.range(0,.22),C.range(0,B)]);const we=C.range(.82,1.08),He=C.range(0,B),Le=C(),Ye=C.int(9,14);for(let rt=0;rt<Ye;rt++)ge.push([C.range(.3,.7),C.range(.3,1),C.range(-.3,.3),C.range(.7,1.9),C.range(.11,.17),C.range(.82,1.08),C.range(0,B),C(),C.range(-.1,.1),C.range(.8,1.05)]);for(const[rt,ke,$e,bt,Et,to]of xe){const Rt=X+rt,Co=R+G*D+ke;if(gt(Co,Math.acos(Se((Rt-Ct)/po(Rt),-1,1)),O),ct(O[0],O[1],O[2],Ve),n.set(O[0],O[1],O[2]),d.set(Ve[0],Ve[1],Ve[2]),n.distanceTo(je)<24||Math.hypot(n.x-Y[0],n.y-Y[1],n.z-Y[2])<15||(f.set(d.y,d.z,-d.x).cross(d).normalize(),v.crossVectors(d,f),S.copy(d).addScaledVector(f,Math.cos(to)*Et).addScaledVector(v,Math.sin(to)*Et).normalize(),h.copy(n).addScaledVector(S,-$e*.12),u.copy(h).addScaledVector(S,$e),!c.segClear(h,u,5.5+bt,-6.5,8.5,8.5+bt,12))||Be(h.x,h.y,h.z,u.x,u.y,u.z,...te)<Me+3||Be(h.x,h.y,h.z,u.x,u.y,u.z,...c.revealSeg)<13)continue;let lo=!0;for(const Ue of c.sight)if(Be(h.x,h.y,h.z,u.x,u.y,u.z,Ue[0],Ue[1],Ue[2],Ue[3],Ue[4],Ue[5])<5+bt){lo=!1;break}if(lo){i.setMatrixAt(w,st(h,S,$e,bt,bt*we,He,ze)),a[w*3]=Le,a[w*3+1]=2+Se(ut,0,1),a[w*3+2]=de,w++;for(let Ue=0;Ue<Ye;Ue++){const[ko,ro,za,wa,Sa,Ma,ba,Pa,Ca,ka]=ge[Ue],io=$e*ko,co=Ue/Ye*B+za,Qo=bt*wa;S.copy(d).addScaledVector(f,Math.cos(co)*ro).addScaledVector(v,Math.sin(co)*ro).normalize(),h.copy(n).addScaledVector(f,Math.cos(co)*Qo).addScaledVector(v,Math.sin(co)*Qo).addScaledVector(S,-io*.18),u.copy(h).addScaledVector(S,io);const fo=io*Sa+.25;c.segClear(h,u,4.8+fo,-5.5,7.5,7.8+fo,8)&&(Be(h.x,h.y,h.z,u.x,u.y,u.z,...te)<Me+2||(i.setMatrixAt(w,st(h,S,io,fo,fo*Ma,ba,ze)),a[w*3]=Pa,a[w*3+1]=2+Se(ut+Ca,0,1),a[w*3+2]=de*ka,w++))}break}}(G&3)===3&&await p.yield()}}{const R=k("geode-floor"),D=R.range(0,B),re=R(),G=2.399963;for(let C=0;C<t+s;C++){const X=k("geode-floor"+C),ut=C<t,de=Math.pow(X(),2.2),xe=X.range(.95,1.25),ge=ut?X.range(12,22):X.range(11,18),we=ge*X.range(.085,.11),He=X.range(0,ut?.28:.22),Le=X.range(0,B);if(ut){const ke=D+C*G,$e=27+24*((re+C*.618034)%1);if(n.set(Math.cos(ke)*$e,0,Math.sin(ke)*$e),n.y=c.floorH(n.x,n.z),d.set(-n.x*.006,1,-n.z*.006).normalize(),n.y<.3||Math.hypot(n.x-ve.x,n.z-ve.z)<20||Math.hypot(n.x-Oe.x,n.z-Oe.z)<19)continue}else{const ke=6+34*((C-t+.5)/s)+X.range(-2,2);if(gt(D+C*G,Math.acos(Se((ke-Ct)/po(ke),-1,1)),O),ct(O[0],O[1],O[2],Ve),n.set(O[0],O[1],O[2]),d.set(Ve[0],Ve[1],Ve[2]),n.y<c.floorH(n.x,n.z)-1)continue}if(f.set(d.y,d.z,-d.x).cross(d).normalize(),v.crossVectors(d,f),S.copy(d).addScaledVector(f,Math.cos(Le)*He).addScaledVector(v,Math.sin(Le)*He).normalize(),h.copy(n).addScaledVector(S,-ge*.1),u.copy(h).addScaledVector(S,ge),!c.segClear(h,u,5.5+we,-6.5,8.5,9.5+we,12)||Be(h.x,h.y,h.z,u.x,u.y,u.z,...te)<Me+3)continue;let Ye=!0;for(const ke of c.sight)if(Be(h.x,h.y,h.z,u.x,u.y,u.z,ke[0],ke[1],ke[2],ke[3],ke[4],ke[5])<5+we){Ye=!1;break}if(!Ye)continue;i.setMatrixAt(w,st(h,S,ge,we,we*X.range(.82,1.08),X.range(0,B),ze)),a[w*3]=X(),a[w*3+1]=2+Se(de,0,1),a[w*3+2]=xe,w++;const rt=X.int(7,11);for(let ke=0;ke<rt;ke++){const $e=ge*X.range(.28,.66),bt=X.range(.3,1),Et=ke/rt*B+X.range(-.3,.3),to=we*X.range(.7,1.9);S.copy(d).addScaledVector(f,Math.cos(Et)*bt).addScaledVector(v,Math.sin(Et)*bt).normalize(),h.copy(n).addScaledVector(f,Math.cos(Et)*to).addScaledVector(v,Math.sin(Et)*to).addScaledVector(S,-$e*.18),u.copy(h).addScaledVector(S,$e);const Rt=$e*X.range(.11,.17)+.25,Co=X.range(.82,1.08),lo=X.range(0,B),Ue=X(),ko=X.range(-.1,.1),ro=X.range(.8,1.05);c.segClear(h,u,4.8+Rt,-5.5,7.5,8.5+Rt,8)&&(Be(h.x,h.y,h.z,u.x,u.y,u.z,...te)<Me+2||(i.setMatrixAt(w,st(h,S,$e,Rt,Rt*Co,lo,ze)),a[w*3]=Ue,a[w*3+1]=2+Se(de+ko,0,1),a[w*3+2]=xe*ro,w++))}(C&7)===7&&await p.yield()}}i.count=w,r.setAttribute("aInst",new z.InstancedBufferAttribute(a,3)),i.frustumCulled=!1,J.add(i)}await p.yield();const Ro=[],go=[],ua=k("geode-timber"),ce=(e,o,t,s,l,r,a=0)=>{V.copy(o).sub(e);const i=V.length();if(!(i<.05)){st(e,V,i,t,s,0,ze,r);for(let n=0;n<16;n++)Ro.push(ze.elements[n]);go.push(ua(),l,a)}},Fo=c.outer.length,_o=e=>e>=c.helixStartIdx-4&&e<=c.helixEndIdx+4,va=(e,o)=>{const t=Math.max(1,Math.ceil(e.distanceTo(o)));for(let s=0;s<=t;s++){const l=s/t,r=H(e.x,o.x,l),a=H(e.y,o.y,l),i=H(e.z,o.z,l);for(let n=0;n<Fo;n++){const d=c.outer[n],f=r-d.x,v=a-(d.y+Ba),h=i-d.z;if(v>uo||v<-uo||f*f+v*v+h*h>=uo*uo)continue;let u=n,S=1e9;for(let R=Math.max(0,n-6);R<=Math.min(Fo-1,n+6);R++){const D=c.outer[R],re=(r-D.x)**2+(i-D.z)**2;re<S&&(S=re,u=R)}const w=c.outer[u],I=(r-w.x)*w.hz-(i-w.z)*w.hx;if(!(a<w.y&&(_o(u)?I<=vo+.05:Math.abs(I)<=Lo)))return!0}}return!1},ft=(e,o)=>{if(!c.segClear(e,o,2.7,-.55,4.9,6.5,Math.max(3,Math.ceil(e.distanceTo(o)/2.5)))||va(e,o))return 1;for(const t of ee)if(Be(e.x,e.y,e.z,o.x,o.y,o.z,t.a.x,t.a.y,t.a.z,t.b.x,t.b.y,t.b.z)<t.wx*.5+.1)return 2;for(const t of c.sight)if(Be(e.x,e.y,e.z,o.x,o.y,o.z,t[0],t[1],t[2],t[3],t[4],t[5])<2.6)return 1;return 0},Io=e=>Lt(e.x,e.y,e.z)>.985||e.y<c.floorH(e.x,e.z)-.2,At=(e,o)=>o.set(e.hz,0,-e.hx),De=new g(0,1,0),pe=new g,he=new g,A=new g,b=new g,Do=(e,o,t,s=!1)=>{for(let l=o;l<=t;l++){const r=e[l];if(At(r,he),pe.set(r.hx,0,r.hz),A.set(r.x,r.y-.24,r.z).addScaledVector(he,s&&!_o(l)?-vo:-1),b.set(r.x,r.y-.24,r.z).addScaledVector(he,s?vo:1),ce(A,b,.24,.17,0,pe),(l-o)%2===0&&l+2<=t)for(const a of[-.5,.5]){const i=e[l+2];A.set(r.x,r.y-.07,r.z).addScaledVector(he,a),At(i,ye),b.set(i.x,i.y-.07,i.z).addScaledVector(ye,a),ce(A,b,.1,.14,2,he)}if((l-o)%3===0&&l+3<=t)for(const a of[-.58,.58]){const i=e[l+3];A.set(r.x,r.y-.55,r.z).addScaledVector(he,a),At(i,ye),b.set(i.x,i.y-.55,i.z).addScaledVector(ye,a),ce(A,b,.26,.42,0,he)}}};Do(c.outer,0,c.outer.length-1,!0),Do(c.second,0,c.second.length-1),await p.yield();const Ho=16,Gt=Ft-et,Go={cap:[-1.3,1.3],leg:[[-1,-1/12],[1,1/12]],yoke:6.3,chain:[[-6.5,-.06],[6.5,.06]]},ma={cap:[-Gt-6.8,vo],leg:[[-Gt-5.5,-1/12],[-Gt-2.9,-1/40]],knee:[-.6,-Gt],chain:[[-Gt-6.4,-.16],[-Gt-3.7,-.04]]},yo=(e,o,t,s,l=!0)=>{const r={legs:[[],[]],feet:[null,null],hang:!l,p:e,lat:o.clone(),spec:t,id:s};A.set(e.x,e.y-.78,e.z).addScaledVector(o,t.cap[0]),b.set(e.x,e.y-.78,e.z).addScaledVector(o,t.cap[1]),ce(A,b,.36,.44,0,De);for(let n=0;n<2;n++){const d=t.leg[n][0],f=t.leg[n][1],v=r.legs[n];let h=new g(e.x,e.y-1,e.z).addScaledVector(o,d);v.push(h);let u=null;for(let S=1;S<12&&l;S++){const w=new g(e.x,e.y-1-S*Ho,e.z).addScaledVector(o,d+f*S*Ho);let I=!1;if(Io(w)){let D=0,re=1;for(let G=0;G<7;G++){const C=(D+re)/2;be.lerpVectors(h,w,C),Io(be)?re=C:D=C}w.lerpVectors(h,w,Math.min(1,re+.04)),I=!0}const R=ft(h,w);if(R){R===1&&(r.hang=!0);break}if(u=w,I)break;v.push(w),h=w}u&&ce(v[0],u,.38,.38,0,o),r.feet[n]=u}if(t.knee&&r.feet[1])for(const n of t.knee)A.set(e.x,e.y-10,e.z).addScaledVector(o,t.leg[1][0]+t.leg[1][1]*9),b.set(e.x,e.y-1,e.z).addScaledVector(o,n),r.feet[1].y<A.y&&!ft(A,b)&&ce(A,b,.24,.28,0,De);const[a,i]=r.legs;for(let n=1;n<Math.min(a.length,i.length);n++)ft(a[n],i[n])||ce(a[n],i[n],.22,.26,0,De),s+n&1?ft(a[n-1],i[n])||ce(a[n-1],i[n],.16,.18,0,De,1):ft(i[n-1],a[n])||ce(i[n-1],a[n],.16,.18,0,De,1);return r},pa=e=>{for(let o=0;o+1<e.length;o++)for(let t=0;t<2;t++){const s=e[o].legs[t],l=e[o+1].legs[t],r=Math.min(s.length,l.length);for(let a=1;a<r;a++)a%2===1&&(ft(s[a],l[a])||ce(s[a],l[a],.2,.24,0,De,1))}},zo=new g,ht=[[],[],[],[]];for(let e=4;e<c.helixStartIdx-2;e+=6){const o=c.outer[e];ht[0].push(yo(o,At(o,zo),Go,ht[0].length))}await p.yield();for(let e=c.helixStartIdx;e<=c.helixEndIdx;e+=6){const o=c.outer[e],t=Math.round((e-c.helixStartIdx)/6),s=yo(o,At(o,zo),ma,t,t%2===0);s.helix=!0,t%2===0?ht[1].push(s):ht[3].push(s),(t&3)===3&&await p.yield()}await p.yield();for(let e=c.helixEndIdx+7;e<c.outer.length-1;e+=6){const o=c.outer[e];ht[2].push(yo(o,At(o,zo),Go,ht[2].length))}await p.yield();for(let e=0;e<3;e++)pa(ht[e]),await p.yield();const xa=[];ht.forEach((e,o)=>e.forEach((t,s)=>{if(!t.hang)return;const l=t.spec.yoke||0,r=t.spec.chain;if(l){if(A.set(t.p.x,t.p.y-l,t.p.z).addScaledVector(t.lat,r[0][0]),b.set(t.p.x,t.p.y-l,t.p.z).addScaledVector(t.lat,r[1][0]),ft(A,b))return;ce(A,b,.3,.36,0,De);for(const a of[0,1])A.set(t.p.x,t.p.y-l,t.p.z).addScaledVector(t.lat,t.spec.leg[a][0]),b.set(t.p.x,t.p.y-.9,t.p.z).addScaledVector(t.lat,t.spec.leg[a][0]),ce(A,b,.2,.2,0,t.lat)}for(const a of[0,1]){if(a===1&&t.helix&&t.id>=28)continue;const i=r[a][0],n=r[a][1];A.set(t.p.x,t.p.y-(l||.6),t.p.z).addScaledVector(t.lat,i),V.copy(t.lat).multiplyScalar(n).add(De).normalize();let d=4;for(;d<120&&Lt(A.x+V.x*d,A.y+V.y*d,A.z+V.z*d)<.99;)d+=1;b.copy(A).addScaledVector(V,d),ye.copy(A).addScaledVector(V,1.5),!ft(ye,b)&&(ce(A,b,.13,.13,1,t.lat),xa.push(b.clone()))}})),await p.yield();const wt=[],Xt=k("geode-lamps");{const e=ht[1].filter(l=>l.feet[0]&&l.feet[1]&&l.legs[0].length>2&&l.legs[1].length>2),o=e.length?e[Xt.int(0,e.length-1)]:null,t=e.length?e[Xt.int(0,e.length-1)]:null;ht[1].forEach((l,r)=>{pe.set(-l.lat.z,0,l.lat.x),r%2===0&&(A.set(l.p.x,l.p.y-.6,l.p.z).addScaledVector(l.lat,l.spec.cap[0]+.3),b.copy(A).setY(l.p.y+1.9),ce(A,b,.14,.14,0,l.lat),wt.push(b.x,b.y+.25,b.z,1.5));const a=l===o||l===t,i=l.legs[0],n=l.legs[1],d=Math.min(i.length,n.length);for(let f=1;f<d;f++){if((a||r%2===0&&f%2===0)&&wt.push((i[f].x+n[f].x)/2+pe.x*.5,i[f].y+1.7,(i[f].z+n[f].z)/2+pe.z*.5,1.3),!a)continue;for(const w of[.3,.62,.94])A.copy(i[f]).addScaledVector(pe,w).setY(i[f].y+.16),b.copy(n[f]).addScaledVector(pe,w).setY(n[f].y+.16),ce(A,b,.3,.05,0,De);const v=f&1?n[f-1]:i[f-1],h=f&1?i[f]:n[f],u=v.distanceTo(h),S=Math.floor(u/.42);for(const w of[.4,.84])A.copy(h).addScaledVector(pe,w).setY(h.y+.2),b.copy(v).addScaledVector(pe,w).setY(v.y+.2),ce(A,b,.07,.09,0,pe);for(let w=1;w<S;w++)be.lerpVectors(h,v,w/S),be.y+=.2,A.copy(be).addScaledVector(pe,.4),b.copy(be).addScaledVector(pe,.84),ce(A,b,.045,.045,0,De,1)}});const s=Xt.range(0,B);for(let l=0;l<6;l++){const r=s+l/6*B,a=ve.x+Math.cos(r)*11.5,i=ve.z+Math.sin(r)*11.5,n=c.floorH(a,i);A.set(a,n-.3,i),b.set(a,n+2.4,i),!ft(A,b)&&(ce(A,b,.16,.16,0,De),wt.push(a,n+2.65,i,1.4))}for(const l of c.tarns){const r=l.x-c.pool.x,a=l.z-c.pool.z,i=Math.hypot(r,a)||1,n=Xt.range(-.7,.7),d=Math.cos(n),f=Math.sin(n),v=l.x+(r*d-a*f)/i*(l.r+1.4),h=l.z+(r*f+a*d)/i*(l.r+1.4),u=c.floorH(v,h);A.set(v,u-.3,h),b.set(v,u+2.4,h),!ft(A,b)&&(ce(A,b,.16,.16,0,De),wt.push(v,u+2.65,h,1.4))}}{const e=c.railEnd;At(e,he),pe.set(e.hx,0,e.hz);for(let t=0;t<9;t++){A.set(e.x,e.y-Ze.range(.1,.8),e.z).addScaledVector(he,Ze.range(-1.2,1.2)).addScaledVector(pe,Ze.range(-1.5,0)),V.copy(pe).multiplyScalar(Ze.range(.6,1)).addScaledVector(he,Ze.range(-.5,.5)),V.y=Ze.range(-.9,.15),V.normalize(),b.copy(A).addScaledVector(V,Ze.range(1.2,3.6));const s=Se((b.x-e.x)*he.x+(b.z-e.z)*he.z,-Lo+.1,Lo-.1);b.addScaledVector(he,s-((b.x-e.x)*he.x+(b.z-e.z)*he.z)),b.y=Math.min(b.y,e.y-.05-.3*Math.max(0,(b.x-e.x)*pe.x+(b.z-e.z)*pe.z)),ce(A,b,Ze.range(.12,.3),Ze.range(.1,.24),t<2?2:0,De)}const o=c.second[0];At(o,he),pe.set(o.hx,0,o.hz);for(const t of[-.6,.6])A.set(o.x,o.y-.2,o.z).addScaledVector(he,t),b.copy(A).addScaledVector(pe,-1.3).addScaledVector(De,1.5),ce(A,b,.26,.26,0,he),A.copy(b),b.set(o.x,o.y-.2,o.z).addScaledVector(he,t).addScaledVector(pe,-2.6),ce(A,b,.22,.22,0,he);A.set(o.x,o.y+1.2,o.z).addScaledVector(he,-1).addScaledVector(pe,-1.2),b.copy(A).addScaledVector(he,2),ce(A,b,.3,.3,0,De)}{const e=go.length/3,o=da(),t=new z.InstancedMesh(o,K(na,sa),e);t.instanceMatrix.array.set(Ro),t.instanceMatrix.needsUpdate=!0,o.setAttribute("aTim",new z.InstancedBufferAttribute(new Float32Array(go),3)),t.frustumCulled=!1,J.add(t)}await p.yield();{const e=c.pool,o=56,t=14,s=[],l=[],r=[];for(let d=0;d<=t;d++)for(let f=0;f<=o;f++){const v=f/o*B,h=e.r*1.3*(d/t),u=e.x+Math.cos(v)*h,S=e.z+Math.sin(v)*h;s.push(u,0,S),l.push(Math.hypot(u-ve.x,S-ve.z)<9.5?0:Se(-c.floorH(u,S)/.7,0,1))}for(let d=0;d<t;d++)for(let f=0;f<o;f++){const v=d*(o+1)+f,h=v+1,u=v+o+1,S=u+1;r.push(v,u,h,h,u,S)}for(const d of c.tarns){const f=s.length/3,v=20,h=5;for(let u=0;u<=h;u++)for(let S=0;S<=v;S++){const w=S/v*B,I=(d.r*1.14+.3)*(u/h),R=d.x+Math.cos(w)*I,D=d.z+Math.sin(w)*I;s.push(R,d.y,D),l.push(Se((d.y-c.floorH(R,D))/.3,0,1))}for(let u=0;u<h;u++)for(let S=0;S<v;S++){const w=f+u*(v+1)+S,I=w+1,R=w+v+1,D=R+1;r.push(w,R,I,I,R,D)}}const a=new z.BufferGeometry;a.setAttribute("position",new z.Float32BufferAttribute(s,3)),a.setAttribute("normal",new z.Float32BufferAttribute(new Float32Array(s.length).map((d,f)=>f%3===1?1:0),3)),a.setAttribute("aShore",new z.Float32BufferAttribute(l,1)),a.setIndex(r);const i=[];for(let d=0;d<6;d++)i.push(new z.Vector4(e.x+kt.range(-16,16),e.z+kt.range(-16,16),kt.range(.12,.3),kt.range(1.2,2.2)));oe.uRing={value:i};const n=new z.Mesh(a,K(Fa,_a,{},{transparent:!0,depthWrite:!1,side:z.DoubleSide}));n.renderOrder=1,n.frustumCulled=!1,J.add(n)}const Kt={from:new g(Y[0],Y[1],Y[2]),to:new g};{const e=gt(We+Math.PI+m.range(-1.1,1.1),m.range(.85,1.1),[0,0,0]);Kt.to.set(e[0],e[1],e[2]);const o=[],t=[],s=[],l=[],r=new g,a=new g,i=new g,n=(I,R,D,re,G,C,X)=>{const ut=o.length/3;i.copy(R).sub(I).normalize(),r.set(1,0,0).addScaledVector(i,-i.x).normalize(),a.crossVectors(i,r);for(let de=0;de<=C;de++)for(let xe=0;xe<=G;xe++){const ge=de/C,we=xe/G*B,He=H(D,re,ge),Le=Math.cos(we),Ye=Math.sin(we);o.push(H(I.x,R.x,ge)+(r.x*Le+a.x*Ye)*He,H(I.y,R.y,ge)+(r.y*Le+a.y*Ye)*He,H(I.z,R.z,ge)+(r.z*Le+a.z*Ye)*He),t.push(r.x*Le+a.x*Ye,r.y*Le+a.y*Ye,r.z*Le+a.z*Ye),s.push(ge,X,we)}for(let de=0;de<C;de++)for(let xe=0;xe<G;xe++){const ge=ut+de*(G+1)+xe,we=ge+1,He=ge+G+1,Le=He+1;l.push(ge,He,we,we,He,Le)}};n(c.shaftA,c.shaftB,Me+2.5,Me-.5,48,8,1),n(Kt.to,Kt.from,3.4,2,16,2,2.2),n(Ht,F.copy(Ht).addScaledVector(Ut,58),7.6,3,24,4,14.5);const d=new z.BufferGeometry;d.setAttribute("position",new z.Float32BufferAttribute(o,3)),d.setAttribute("normal",new z.Float32BufferAttribute(t,3)),d.setAttribute("aK",new z.Float32BufferAttribute(s,3)),d.setIndex(l);const f=new z.Mesh(d,K(Ia,Da,{},{transparent:!0,depthWrite:!1,blending:z.AdditiveBlending,side:z.DoubleSide}));f.renderOrder=3,f.frustumCulled=!1,J.add(f);const v=[],h=[],u=(I,R,D)=>{const re=v.length/3;r.set(1,0,0).addScaledVector(R,-R.x).normalize(),a.crossVectors(R,r),v.push(I.x,I.y,I.z);for(let G=0;G<=24;G++){const C=G/24*B;v.push(I.x+(r.x*Math.cos(C)+a.x*Math.sin(C))*D,I.y+(r.y*Math.cos(C)+a.y*Math.sin(C))*D,I.z+(r.z*Math.cos(C)+a.z*Math.sin(C))*D)}for(let G=0;G<24;G++)h.push(re,re+1+G,re+2+G)};u(c.shaftB,new g(0,1,0),Me+6),F.set(Dt[0],Dt[1],Dt[2]),u(ye.copy(Kt.from).addScaledVector(F,-5),F,9);const S=new z.BufferGeometry;S.setAttribute("position",new z.Float32BufferAttribute(v,3)),S.setIndex(h),S.computeVertexNormals(),oe.uCloudPos={value:0};const w=new z.Mesh(S,K(Ha,Ga,{},{fog:!1,side:z.DoubleSide}));w.frustumCulled=!1,J.add(w)}await p.yield();const wo=[],Ko=[],qo=[],Oo=[],So=[],Qt=(e,o,t,s,l,r)=>{const a=wo.length/3,i=e.length;for(let n=0;n<i;n++){const d=e[n],f=e[Math.max(0,n-1)],v=e[Math.min(i-1,n+1)];V.copy(v).sub(f).normalize();const h=H(s,l,n/(i-1)),u=r?r(n):n/(i-1);for(const S of[-1,1])wo.push(d.x,d.y,d.z),Ko.push(V.x,V.y,V.z),qo.push(S*h,o,u,t)}for(let n=0;n<i-1;n++){const d=a+n*2;Oo.push(d,d+1,d+2,d+1,d+3,d+2)}},Mo=(e,o,t,s)=>{let l=o;const r=c.floorH(e,t);for(l=o-3;l>Math.max(r,0);l-=1){let d=!1;for(const f of ee)if(Be(e,l,t,e,l-.5,t,f.a.x,f.a.y,f.a.z,f.b.x,f.b.y,f.b.z)<f.wx*.42){d=!0;break}if(d)break}const a=o-l,i=Math.max(3,Math.ceil(a/4)),n=[];for(let d=0;d<=i;d++)n.push(new g(e,o-a*d/i,t));return Qt(n,0,s,.4,.62+a*.004,d=>a*d/i),So.push(new g(e,l,t)),a},Jt=k("geode-threads"),qt=k("geode-horsetails");let jo=null,Wo=0;{const e=c.helixStartIdx+Math.round(c.nH*.43),o=c.outer[e],t=(c.hc.x-o.x)/et,s=(c.hc.z-o.z)/et,l=o.x+t*12.8,r=o.z+s*12.8;let a=o.y+40;for(;a>o.y+8&&Lt(l,a+3,r)>.97;)a-=2;Mo(l,a,r,Jt()),jo={position:new g(l,o.y+1.7,r),dist:e*1.5};for(let f=0,v=0;f<5&&v<200;v++){const h=Jt.pick(ee),u=Jt.range(.25,.75),S=H(h.a.x,h.b.x,u),w=H(h.a.y,h.b.y,u)-h.wx*.4,I=H(h.a.z,h.b.z,u);if(w<45)continue;let R=!0;for(let D=w;D>2;D-=3)if(!c.clear(S,D,I,5,-4,9,8)){R=!1;break}R&&(Mo(S,w,I,Jt())<14,f++)}Wo=So.length;const i=[];for(const f of ee){let v=null;for(let h=2;h<=18;h++){const u=h/20,S=H(f.a.x,f.b.x,u),w=H(f.a.y,f.b.y,u)-f.wx*.4,I=H(f.a.z,f.b.z,u),R=Math.hypot(S-c.hc.x,I-c.hc.z)-Ft;if(!(R<Zo||R>Zo+Ta))for(let D=c.helixStartIdx;D<=c.helixEndIdx;D+=2){const re=c.outer[D],G=w-re.y;if(G<5||G>30)continue;const C=Math.hypot(S-re.x,I-re.z);(!v||C<v.dh)&&(v={x:S,y:w,z:I,dh:C,i:D})}}v&&i.push(v)}await p.yield(),i.sort((f,v)=>f.i-v.i);for(const f of i)f.seed=j();let n=-99,d=0;for(const f of i){if(d>=8||f.i-n<14)continue;let v=!0;for(let h=f.y;h>2;h-=3)if(!c.clear(f.x,h,f.z,4.6,-4,9,8)){v=!1;break}v&&(Mo(f.x,f.y,f.z,f.seed),n=f.i,d++)}}await p.yield();for(let e=0;e<46;e++){const o=y.range(0,B),t=y.range(6,22)*(y.chance(.2)?1.3:1),s=y.range(171,176),l=Me+y.range(-.6,.6),r=y.range(-2.5,1),a=[];for(let i=0;i<=7;i++){const n=i/7,d=s-t*n;c.shaftAt(d,fe);const f=l+r*n*n;a.push(new g(fe.x+Math.cos(o)*f,d,fe.z+Math.sin(o)*f))}Qt(a,1,y(),.13,.03)}for(let e=0;e<80;e++){const o=L.range(0,B),t=L.range(170.5,180),s=L.range(2.5,5.5),l=[];c.shaftAt(t,fe);for(let r=0;r<=3;r++){const a=r/3,i=Me+.3-s*.75*a;l.push(new g(fe.x+Math.cos(o)*i,t+s*(.25*a-.6*a*a),fe.z+Math.sin(o)*i))}Qt(l,3,L(),.7,.05)}for(let e=0,o=0;e<170&&o<900;o++){const t=qt.range(0,B),s=qt.range(3,16),l=Oe.x+Math.cos(t)*s,r=Oe.z+Math.sin(t)*s,a=c.floorH(l,r);if(a<.15||Math.hypot(l-ve.x,r-ve.z)<10)continue;const i=qt.range(1.4,3.2),n=qt.range(-.15,.15),d=qt.range(-.15,.15);Qt([new g(l,a-.1,r),new g(l+n*i*.5,a+i*.5,r+d*i*.5),new g(l+n*i,a+i,r+d*i)],4,qt(),.1,.035),e++}const Yo=c.helixStartIdx+8,Vt=c.outer[Yo],Zt=new g,ao=new g,no=new g;let so=5;{let e=-1;for(let o=0;o<24;o++){const t=Math.atan2(Vt.hz,Vt.hx)+Math.PI/2+T.range(-.75,.75);V.set(Math.cos(t),0,Math.sin(t)),F.set(Vt.x,Vt.y+9.4,Vt.z);const s=Ce(F,V,180),l=Ce(F,ye.copy(V).negate(),180),r=l/(l+s),a=F.y+so*4*r*(1-r);me.copy(F).addScaledVector(V,-l),se.copy(F).addScaledVector(V,s),me.y=se.y=a;let i=99;for(const d of ee)i=Math.min(i,Be(me.x,me.y-3,me.z,se.x,se.y-3,se.z,d.a.x,d.a.y,d.a.z,d.b.x,d.b.y,d.b.z)-d.wx*.5);c.shaftAt(150,fe),i=Math.min(i,99);const n=Math.min(i,8)+(l+s)*.01;n>e&&(e=n,Zt.copy(me),ao.copy(se),no.set(-V.z,0,V.x).multiplyScalar(1.7))}for(const o of[-1,1]){const t=[];for(let s=0;s<=20;s++){const l=s/20;t.push(new g().lerpVectors(Zt,ao,l).addScaledVector(no,o).setY(Zt.y-so*4*l*(1-l)))}Qt(t,2,.5,.05,.05)}}{const e=new z.BufferGeometry;e.setAttribute("position",new z.Float32BufferAttribute(wo,3)),e.setAttribute("aDir",new z.Float32BufferAttribute(Ko,3)),e.setAttribute("aRib",new z.Float32BufferAttribute(qo,4)),e.setIndex(Oo);const o=new z.Mesh(e,K(la,ra,{},{side:z.DoubleSide}));o.frustumCulled=!1,J.add(o);const t=fa(),s=14,l=new Float32Array(s*2);for(let a=0;a<s;a++)l[a*2]=(a+q.range(-.12,.12))/s,l[a*2+1]=q();t.setAttribute("aBk",new z.InstancedBufferAttribute(l,2));const r=new z.InstancedMesh(t,K(Wa,Ya,{uCabA:{value:Zt},uCabB:{value:ao},uCabSide:{value:no},uCabSag:{value:so}},{side:z.DoubleSide}),s);r.frustumCulled=!1,J.add(r)}await p.yield();{const e=[],o=[],t=Math.round(420*Ne),s=Math.round(240*Ne);for(let i=0;i<t;i++)e.push(Me*1.05*Math.sqrt(N()),N.range(0,187),N.range(0,B)),o.push(0,N(),N.range(10,20),N.range(.6,1.6));for(let i=0;i<s;i++)e.push(U.range(1,Me-1.5),U.range(0,187),U.range(0,B)),o.push(1,U(),U.range(.45,.75),U.range(-.25,.5));for(let i=0;i<36;i++)e.push(ne.range(1,Me-2),ne.range(0,187),ne.range(0,B)),o.push(2,ne(),ne.range(.4,.6),ne.range(2.2,4));const l=j.fork?j.fork("geode-smoke"):j;for(let i=0;i<wt.length;i+=4)e.push(wt[i],wt[i+1],wt[i+2]),o.push(4,Xt(),wt[i+3],0);So.forEach((i,n)=>{const d=n<Wo?Jt:l;for(let f=0;f<22;f++)e.push(i.x,i.y+.3,i.z),o.push(3,d(),d.range(4,8.5),d.range(.7,1.3))});const r=new z.BufferGeometry;r.setAttribute("position",new z.Float32BufferAttribute(e,3)),r.setAttribute("aPt",new z.Float32BufferAttribute(o,4));const a=new z.Points(r,K(Ka,qa,{},{transparent:!0,depthWrite:!1,blending:z.AdditiveBlending}));a.renderOrder=4,a.frustumCulled=!1,J.add(a)}{const o=[],t=[],s=[],r=[[0,0,.5,0],[-.1,0,-.3,0],[.1,0,-.3,0],[-.08,0,.14,0],[-.85,0,-.16,1],[-.08,0,-.14,0],[.08,0,.14,0],[.08,0,-.14,0],[.85,0,-.16,1]];for(let n=0;n<120;n++){const d=Z.range(3,13.5),f=Z.range(22,166),v=Z.range(0,B),h=Z();for(const u of r)o.push(u[0]*1.3,u[1]*1.3,u[2]*1.3),t.push(d,f,v,h),s.push(u[3])}const a=new z.BufferGeometry;a.setAttribute("position",new z.Float32BufferAttribute(o,3)),a.setAttribute("aBird",new z.Float32BufferAttribute(t,4)),a.setAttribute("aWing",new z.Float32BufferAttribute(s,1));const i=new z.Mesh(a,K(Oa,ja,{},{side:z.DoubleSide}));i.renderOrder=5,i.frustumCulled=!1,J.add(i)}const Nt=(e,o=0)=>new g(e.x,e.y+o,e.z),Ot=[];for(let e=0;e<c.outer.length;e+=4)Ot.push(Nt(c.outer[e],1.7));for(let e=1;e<c.dive.length;e+=2)Ot.push(Nt(c.dive[e]));Ot[Ot.length-1].equals(Ht)||Ot.push(Ht.clone());const $t=c.outer[0],bo=c.railEnd,Po=new g;c.shaftAt(85,Po),Po.y=85;const Uo={entry:{position:Nt($t),direction:new g($t.hx,0,$t.hz)},track:{outer:c.outer.map(e=>Nt(e)),second:c.second.map(e=>Nt(e))},trackAt(e,o={position:new g,tangent:new g}){const t=Se(e/1.5,0,c.outer.length-1.001),s=Math.floor(t),l=c.outer[s],r=c.outer[s+1],a=t-s;return o.position.set(H(l.x,r.x,a),H(l.y,r.y,a),H(l.z,r.z,a)),o.tangent.set(r.x-l.x,r.y-l.y,r.z-l.z).normalize(),o},revealDist:Math.min(27,c.helixStartIdx)*1.5,helix:{center:new g(c.hc.x,0,c.hc.z),radius:et,secondRadius:Ft,yTop:oo,yBottom:Vo,theta0:_t,turns:ho,startDist:c.helixStartIdx*1.5,endDist:c.helixEndIdx*1.5},railEnd:{position:Nt(bo),direction:new g(bo.hx,-.07,bo.hz).normalize()},flyThrough:Ot,portalSeat:{position:Ht.clone(),normal:Ut.clone(),radius:$o,tilt:66},shaft:{bottom:c.shaftA.clone(),top:c.shaftB.clone(),radius:Me},sinkhole:{position:new g(c.sink.x,c.sink.y,c.sink.z),radius:Me},secondSinkhole:{position:Kt.from.clone(),target:Kt.to.clone()},pool:{center:new g(c.pool.x,0,c.pool.z),radius:c.pool.r,y:0},lightSpot:new g(Oe.x,0,Oe.z),beamPass:To,fallPass:jo,bucketPass:{position:new g(Vt.x,Vt.y+9.4,Vt.z),dist:Yo*1.5},cable:{a:Zt.clone(),b:ao.clone(),side:no.clone(),sag:so},viewpoints:{reveal:Nt(c.outer[4],1.9),revealLook:Po.clone(),low:new g(c.pool.x-30,7,c.pool.z-18),lowLook:new g(c.hc.x,95,c.hc.z),across:new g(c.hc.x+58,120,c.hc.z-30)}},ga=new z.Vector2,jt=new g,Xo=new z.Quaternion,St=new g,Wt=new g;let eo=null,ya=E.lamp==="demo"||typeof Ee=="string"&&Ee.includes("lamp");const Mt={object:J,radius:95,height:195,center:new g(0,80,0),anchors:Uo,uniforms:oe,ground:!1,groundY:-15,lib:{mkMat:K,setBasis:st,segSegDist:Be,makeCrystalGeo:ia,makeBeamGeo:ca,makeBoxGeo:da,makeBucketGeo:fa,beams:ee,layout:c,glsl:{VS_PARS:mt,FS_PARS:pt,FS_END:It,FS_ADD_FOG:Bo,RIBBON_VS:la,RIBBON_FS:ra,SELENITE_VS:oa,SELENITE_FS:aa,CRYSTAL_VS:ea,CRYSTAL_FS:ta,TIMBER_VS:na,TIMBER_FS:sa}},setCloud(e){eo=e},setLamp(e,o,t=1,s=24){J.updateWorldMatrix(!0,!1),St.copy(e),J.worldToLocal(St),J.getWorldQuaternion(Xo).invert(),Wt.copy(o).normalize().applyQuaternion(Xo),oe.uLampPos.value.set(St.x,St.y,St.z,t),oe.uLampDir.value.set(Wt.x,Wt.y,Wt.z,Math.cos(s*Math.PI/180))},update(e,o,t){oe.uTime.value=o;const s=.5-.5*Math.sin(o*B/12+.6),l=s*s*(3-2*s);if(oe.uCloud.value=eo!==null?eo:1-.5*l,oe.uCloudPos.value=H(15,-9,eo!==null?Se((1-eo)*2,0,1):l),t){jt.setFromMatrixPosition(t.matrixWorld),J.worldToLocal(jt),oe.uCamL.value.copy(jt),oe.uOutside.value=tt&&Lt(jt.x,jt.y,jt.z)>1.03?1:0;let r=1080;p.renderer&&p.renderer.getDrawingBufferSize&&(r=p.renderer.getDrawingBufferSize(ga).y||1080),oe.uPx.value=t.projectionMatrix.elements[5]*r*.5}if(ya){const r=Uo.trackAt(o*6%((c.outer.length-2)*1.5));St.copy(r.position),St.y+=1.3,J.localToWorld(St),Wt.copy(r.tangent).transformDirection(J.matrixWorld),Mt.setLamp(St,Wt,1,26)}},dispose(){}};return typeof Ee=="string"&&Ee.startsWith("in")&&(Mt.radius=23,Mt.height=154,Mt.center=new g($t.x-10,85,$t.z-59)),typeof Ee=="string"&&Ee.startsWith("low")&&(Mt.radius=10,Mt.height=60,Mt.center=new g(c.pool.x,12,c.pool.z)),Mt.update(0,0,null),Mt}export{Qa as buildHero};
