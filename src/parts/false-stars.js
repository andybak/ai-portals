import*as F from"three";import{clamp as nt,lerp as st,smoothstep as V,makePath as ja,makeRng as Vt}from"../kit/core.js";const Ha=["#03070B","#0D1F2C","#4FE0D6","#0B1638","#9DB2C6","#27473F","#E4EEF8"],ot=F.Vector3,ht=Math.PI*2,se=Math.PI/180,Jt=-30.6,tt=112,J=276,Z=345,na=86,dt=122,mt=262,Se=[21,-6.6],we=[97,-3.8],Re=[dt+24,-6],ve=[dt+74,7.3],sa=5,Ce=t=>V(dt,dt+19,t)*(1-V(mt-24,mt,t)),te=49.5,fe=.8,q=41,ue=.5,ia=12,$e=10,Ua=t=>V(mt-40,mt-22,t)*(1-V(J+4,J+26,t));function $a(t,r,f){const o=f.weather==="rain"?1:0,C=t.range(27,33)*se,y=45,v=y*C,s=t.range(9,14)*.6,i=t.range(26,32),M=tt+s,m=M+v,g=J-2,x=g-v+0*i,c=Math.round((Z+8-Jt)/ue)+1,l=new Float32Array(c),w=new Float32Array(c),k=new Float32Array(c),n=new Float32Array(c),p=Math.round((0-Jt)/ue);let u=0,a=0,d=te,S=0;for(let b=p;b<c;b++){const _=Jt+b*ue;l[b]=u,w[b]=a,k[b]=d,n[b]=S;const B=_>=M&&_<m?1/y:_>=x&&_<g?-1/y:0,A=-5*se*V(J,J+10,_)*(1-V(Z-46,Z-34,_))+6*se*V(Z-9,Z-1,_);S+=B*ue,u+=-Math.sin(S)*ue,d+=-Math.cos(S)*ue,a+=Math.tan(A)*ue}for(let b=p-1;b>=0;b--)l[b]=0,w[b]=0,k[b]=te+(p-b)*ue,n[b]=0;const N=t.range(0,100);return{flood:o,k0:M,k1:m,k2:x,k3:g,n:c,axis(b,_){const B=nt((b-Jt)/ue,0,c-1.001),A=Math.floor(B),W=B-A;_.x=st(l[A],l[A+1],W),_.y=st(w[A],w[A+1],W),_.z=st(k[A],k[A+1],W);const L=st(n[A],n[A+1],W);return _.phi=L,_.dx=-Math.sin(L),_.dz=-Math.cos(L),_.rx=Math.cos(L),_.rz=-Math.sin(L),_.slope=(w[A+1]-w[A])/ue,_},width(b){if(b<-8)return 15*Math.sqrt(Math.max(0,1-((b+8)/23)**2))+.4;const _=15.4-5.4*V(-2,24,b),B=10+1.4*r.n2(b*.045,N)+3.2*Math.exp(-(((b-na)/17)**2));let A=st(_,B,V(10,30,b));A=st(A,3.5+.3*r.n2(b*.09,N+7),V(tt-13,tt+5,b)),A=st(A,16.6+1.6*r.n2(b*.05,N+13),Ce(b)),A=st(A,3+.2*r.n2(b*.11,N+9),V(J-6,J+8,b));const W=V(Z-52,Z,b);return A+2.3*W*W},roof(b){let _;if(b<-8)_=10*Math.pow(Math.max(0,1-((b+8)/23)**2),.42)+.3;else{const B=nt(5.1+1.9*r.n2(b*.06,N+20),3.6,6.9);_=st(10,B,V(4,26,b)),_=st(_,6.7,Math.exp(-(((b-te)/9)**2))),_=st(_,8.6,Math.exp(-(((b-na)/15)**2))),_=st(_,3.35+.6*r.n2(b*.07,N+31),V(tt-11,tt+5,b)),_=st(_,14.2+1.2*r.n2(b*.04,N+37),Math.pow(Ce(b),.8)),_=st(_,3.5+.45*r.n2(b*.05,N+43),V(J-6,J+10,b));const A=V(Z-58,Z,b);_+=(8.3-3.5)*A*A}return Math.max(.5,_-o*(b>tt-10?.55:1)*V(-28,-8,b))},camX(b){return-2.5*V(10,41,b)*(1-V(56,80,b))+3.4*V(58,84,b)*(1-V(89,tt-5,b))+2.2*V(dt+6,dt+22,b)*(1-V(dt+30,dt+54,b))-2.6*V(dt+44,dt+68,b)*(1-V(mt-22,mt-4,b))},domeK:Ce,flow(b){return Math.min(1,.02+.45*V(tt-12,tt+36,b)*(1-.94*V(dt-8,dt+14,b))+.02*Ce(b)+.96*V(mt-10,J+40,b)*(.44+.56*V(J-10,J+40,b)))},speed(b){if(b<tt-12)return st(3,6,nt(b/(tt-12),0,1));const _=st(6,11,V(tt-12,dt,b)),B=st(_,4.2,V(dt-6,dt+16,b));return st(B,st(16,28,nt((b-J)/(Z-J),0,1)),V(mt-12,J+6,b))}}}const Xa=(t,r,f)=>.5+.27*Math.sin(t*.19+1.3+1.6*Math.sin(f*.11+.7))+.23*Math.sin(f*.23+.4+1.4*Math.sin(t*.13+r*.21)),Ya=`
float hueF(vec3 p){ return 0.5+0.27*sin(p.x*0.19+1.3+1.6*sin(p.z*0.11+0.7))+0.23*sin(p.z*0.23+0.4+1.4*sin(p.x*0.13+p.y*0.21)); }
`,Xe=`
float h11(float n){ return fract(sin(n*12.9898)*43758.5453); }
float h31(vec3 p){ p=fract(p*vec3(.1031,.1030,.0973)); p+=dot(p,p.yxz+33.33); return fract((p.x+p.y)*p.z); }
float vn3(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  float a=h31(i), b=h31(i+vec3(1,0,0)), c=h31(i+vec3(0,1,0)), d=h31(i+vec3(1,1,0));
  float e=h31(i+vec3(0,0,1)), g=h31(i+vec3(1,0,1)), h=h31(i+vec3(0,1,1)), k=h31(i+vec3(1,1,1));
  return mix(mix(mix(a,b,f.x),mix(c,d,f.x),f.y),mix(mix(e,g,f.x),mix(h,k,f.x),f.y),f.z); }
`,Ne=`
uniform vec4 uBoat;      // xz of the bow, xz of its heading (unit)
uniform vec4 uBoatP;     // speed m/s, wake strength 0..1, time, unused
uniform vec4 uEel;       // xz, heading xz
uniform float uEelOn;
uniform vec4 uDrip[${ia}];   // x, z, period, phase
vec3 wakeV(vec2 p, vec2 o, vec2 d, float sc, float t){
  vec2 r=(p-o)/sc; float z=-dot(r,d); float x=r.x*d.y-r.y*d.x;
  float inside=z*0.6+0.3-abs(x);
  float m=smoothstep(0.0,0.45,inside)*smoothstep(-0.4,0.8,z)*exp(-max(z,0.0)*0.05)*(0.3+0.7*exp(-max(inside,0.0)*0.5));
  float sg=x<0.0?-1.0:1.0;
  vec2 dn=vec2(d.y,-d.x)*sg*0.94+d*0.34;
  return vec3(dn*cos(inside*13.0-t*6.5)*m, m);
}
vec3 rippleField(vec2 p, float flow){
  float t=uBoatP.z;
  vec3 r=wakeV(p,uBoat.xy,uBoat.zw,1.0,t)*uBoatP.y*0.3;
  r+=wakeV(p,uEel.xy,uEel.zw,0.4,t*1.4)*uEelOn*0.22;
  for(int i=0;i<${ia};i++){
    vec4 ds=uDrip[i]; float tt=fract(t/ds.z+ds.w)*ds.z;
    vec2 q=p-ds.xy; float dd=length(q); float w=dd-tt*0.6-0.05;
    float a=exp(-w*w*14.0)*exp(-tt*0.75);
    r.xy+=q/max(dd,0.02)*a*sin(w*16.0)*0.2; r.z+=a*0.5;
  }
  // the current's own shimmer rides with the boat (we drift on the water we look at), so it is a slow swell at any speed
  vec2 q0=p-uBoat.xy;
  vec2 sh=vec2(sin(q0.x*1.7+t*0.9+sin(q0.y*1.1-t*0.6)), sin(q0.y*2.1-t*1.1+sin(q0.x*1.3+t*0.5)));
  vec2 sh2=vec2(sin(q0.x*5.3-t*3.1+q0.y*2.0), sin(q0.y*4.7+t*2.7-q0.x*1.6));
  float amb=0.006+0.034*flow;
  r.xy+=sh*amb+sh2*amb*0.3*flow; r.z+=amb*2.0;
  return r;
}
`,We=`
#ifdef USE_FOG
  #ifdef FOG_EXP2
    col *= exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
  #else
    col *= 1.0-smoothstep(fogNear,fogFar,vFogDepth);
  #endif
#endif
`,Qa=`
attribute vec4 aLight; attribute float aSky, aSoft; attribute vec3 aOrg, aPl;
uniform float uMirror, uFlowC; uniform vec3 uCamL;
varying vec3 vP, vN, vL, vCam; varying float vIrr, vSky, vSoft, vNear;
#include <fog_pars_vertex>
${Ne}
// uMirror 0: the rock. 1: its image in level water (the mesh is flipped in y by its matrix). 2: its image in the Flume's sloping
// water (position is already the image; aOrg is the rock it is the image of, aPl the water's normal there). An image is shaded
// as the rock it shows, seen from the eye's own image, and it shivers with the water at the point where the eye meets it.
void main(){
  vec3 p=position; vP=position; vCam=uCamL; vSoft=aSoft; vNear=100.0;
  if(uMirror>0.5){
    float hd;
    if(uMirror>1.5){
      vNear=length(uCamL-position);
      vP=aOrg; hd=max(0.5*dot(aOrg-position,aPl),0.0);
      vec3 Vm=uCamL-position; vCam=aOrg+Vm-2.0*dot(Vm,aPl)*aPl;
    } else { hd=max(position.y,0.0); vCam=vec3(uCamL.x,-uCamL.y,uCamL.z); }
    vec2 H=mix(uCamL.xz,position.xz,${fe.toFixed(2)}/(${fe.toFixed(2)}+hd));
    vec3 rp=rippleField(H,uFlowC); p.xz+=rp.xy*(hd+0.15)*1.45;
  }
  vN=normal; vL=aLight.xyz; vIrr=aLight.w; vSky=aSky;
  vec4 mvPosition=modelViewMatrix*vec4(p,1.0);
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Za=`
uniform vec3 uCamL, uWormCol, uRockCol, uSkyCol, uMouth, uAmb, uLift, uColA, uColB;
uniform vec4 uMirD, uMirE; uniform float uMirK, uVoid;      // the Hall's lake: where it begins (x, z, heading), where it ends, how bright the rock's image is in it
uniform float uMirror, uGain, uGlint, uRockK, uRel, uCalm, uRimK, uEven, uHue;
uniform vec4 uCl[5];             // the clouds of the colony behind the ranks: centre, 1 / radius squared
varying vec3 vP, vN, vL, vCam; varying float vIrr, vSky, vSoft, vNear;
#include <fog_pars_fragment>
${Xe}
${Ya}
vec3 h33(vec3 p){ p=fract(p*vec3(.1031,.1030,.0973)); p+=dot(p,p.yxz+33.33); return fract((p.xxy+p.yxx)*p.zyx); }
// Limestone scallops as a SMOOTH field: the eight surrounding jittered cell centres are blended with exponential weights
// (a smooth minimum of the squared distances), so the offset to "the nearest centre" turns over softly on the cusps
// instead of jumping, and no flat facet or slat can form. Returns the blended offset; f = smooth squared distance.
vec3 scallop(vec3 p, out float f){
  vec3 ip=floor(p-0.5), acc=vec3(0.0); float ws=0.0, fs=0.0;
  for(int i=0;i<2;i++) for(int j=0;j<2;j++) for(int k=0;k<2;k++){
    vec3 c=ip+vec3(float(i),float(j),float(k));
    vec3 dd=p-(c+0.5+(h33(c)-0.5)*0.5);
    float d2=dot(dd,dd), w=exp(-d2*11.0);
    acc+=dd*w; fs+=d2*w; ws+=w;
  }
  ws=max(ws,1e-5); f=fs/ws; return acc/ws;
}
void main(){
  vec3 N=vN/max(length(vN),1e-4);
  vec3 q=vP;
  vec3 fq=fwidth(q); float px=max(fq.x,max(fq.y,fq.z));        // metres of rock under one pixel (taken before any loop)
  vec3 V=vCam-vP; V=V/max(length(V),1e-3);
  float facing=clamp(dot(N,V),0.0,1.0);
  // relief fades where a dish would be squeezed under a pixel or two (far down the barrel, at grazing angles)
  float k1=(1.0-smoothstep(0.03,0.11,px))*mix(0.3,1.0,smoothstep(0.05,0.45,facing));       // (far rock is smooth, glow-lit limestone: a dish under three pixels across is a moire, not a scallop)
  float k2=(1.0-smoothstep(0.012,0.04,px))*mix(0.35,1.0,smoothstep(0.05,0.45,facing));
  float dRel=1.0-0.88*smoothstep(8.0,28.0,length(vCam-vP)); k1*=dRel; k2*=dRel;
  float soft=max(vSoft,uEven);                                        // (uEven: the world asks for the same soft rock where a flooded roof is an arm's length off)
  k1*=1.0-soft; k2*=1.0-0.8*soft;                                     // the Hall's throat: smooth rock, no small dishes at all
  float flow=step(vSky,-0.5); k1*=1.0-0.85*flow; k2*=1.0-0.6*flow;      // flowstone (the Hall's stalagmites and islands): smooth and wet, no scallops      // and at any resolution the far walls are calm
  // limestone scallops: dish-shaped hollows with soft cusps between them (two sizes), then grain and strata
  float f1a; vec3 d1a=scallop(q*1.75+vec3(vn3(q*0.7)*0.8),f1a);
  float f1b; vec3 d1b=scallop(q*0.8+vec3(vn3(q*0.37+3.0)*0.7)+19.0,f1b);                 // and patches of big ones, well over a metre across
  float szm=smoothstep(0.36,0.64,vn3(q*0.19+31.0));
  float f1=mix(f1a,f1b,szm); vec3 d1=mix(d1a,d1b*1.3,szm);
  float lk=smoothstep(0.05,0.22,vIrr);                                 // scallops show where the colony's light rakes them; dim rock between the clouds of light is smooth and dark
  float f2; vec3 d2=scallop(q*6.1+7.3,f2);
  d1-=N*dot(d1,N); d2-=N*dot(d2,N);
  float f0; vec3 d0=scallop(q*0.33+vec3(vn3(q*0.19+5.0)*0.9),f0); d0-=N*dot(d0,N);      // a few large soft scallops, three metres across (the throat only)
  float n1=vn3(q*1.3), n2=vn3(q*5.0+3.7), fine=mix(0.5,vn3(q*23.0),k2);
  float sc1=0.45+0.8*smoothstep(0.3,0.7,vn3(q*0.23+11.0));
  vec3 n=N-d1*(1.3*sc1*k1*(1.0-0.55*uCalm))-d2*0.34*k2-d0*(0.8*soft)+N*(fine-0.5)*0.12; n=n/max(length(n),1e-3);
  float strata=vn3(vec3(q.x*0.3,q.y*2.3,q.z*0.3));
  float alb=(0.25+0.2*n1+0.10*strata+0.08*fine)*(0.8+0.3*k1*smoothstep(0.10,0.30,f1))*(0.93+0.12*k2*smoothstep(0.08,0.24,f2));   // dish floors darker and wet, cusps pale
  alb=mix(alb,0.31+0.12*n1+0.06*strata,soft);
  float lv=length(vL);
  float form=1.0-smoothstep(0.55,0.85,lv);                         // stalactites and curtains carry a short light vector: they stay black against the glow
  vec3 L=vL/max(lv,1e-3);
  float difF=0.22+0.26*uCalm, dif=difF+(1.0-difF)*max(dot(n,L),0.0);      // uCalm: the narrow passages, where the walls are an arm's length off and their relief is eased to soft scallops
  vec3 R=reflect(-V,n);
  float wet=smoothstep(0.4,0.75,n2)*0.8+0.2;
  float sp=max(dot(R,L),0.0); sp*=sp; sp*=sp; sp*=sp; sp*=sp; sp*=sp;        // ^32
  float irrC=max(vIrr,0.0)/(1.0+uRockK*max(vIrr,0.0));                                // the world may hold the brightest rock down (dense colony, close walls): dim relief keeps its light
  // the colony's light raked across the scallops (the baked direction with most of its head-on part taken out, leaning to
  // the roof): the side of each dish that faces it and the cusps are lit, the far sides and the dish floors are not
  vec3 Lr=L-N*(dot(L,N)*0.72)+vec3(0.0,0.3,0.0); Lr=Lr/max(length(Lr),1e-3);
  float relK=mix(mix(0.42,1.0,lk),1.0,uCalm);
  float rel=clamp(0.5+1.25*(dot(n,Lr)-dot(N,Lr))*relK+0.3*(smoothstep(0.08,0.32,f1)-0.55)*k1*relK+0.14*(smoothstep(0.04,0.3,f0)-0.5)*soft+0.2*(n1-0.5)*(1.0-0.6*uEven),0.0,1.0);
  rel=mix(rel,0.5+(rel-0.5)*0.4,uEven);                              // (a flooded roof an arm's length off: the swing is eased, so no side of a scallop falls to black)
  // the light on the rock is the colour of the colony over it: greener under its clouds, bluer along its lanes (uHue: how far
  // the two are told apart; the Hall and all after it)
  float cgr=0.0;
  vec3 pm=vec3(vP.x,abs(vP.y),vP.z);                                 // (an image takes the colour of what it is the image of)
  for(int i=0;i<5;i++){ vec3 dc=pm-uCl[i].xyz; cgr+=exp(-dot(dc,dc)*uCl[i].w); }
  float hq=0.5+(hueF(pm)-0.5)*mix(2.2,3.6,uHue)-0.85*min(cgr,1.0)*uHue;
  vec3 wc=max(mix(uColA,uColB,clamp(hq,-0.45,1.5)),vec3(0.0));
  vec3 lit=mix(wc,uRockCol,mix(0.6,0.3,uHue))*alb*irrC*dif*mix(1.0,mix(0.35,1.65,rel),uRel) + wc*irrC*sp*wet*uGlint*2.2*(0.35+0.65*k1);
  // cold sky light finding its way in from the mouth: mid-dark wet rock with pin glints, never a white wall
  vec3 Lm=uMouth-vP; float dm=max(length(Lm),1e-3); Lm/=dm;
  vec3 ns=N*0.3+n*0.7; ns=ns/max(length(ns),1e-3);
  float sm=max(dot(reflect(-V,ns),Lm),0.0); float sm6=sm*sm*sm; sm6*=sm6; float sm2=sm6*sm6; sm2*=sm2;
  float skv=max(vSky,0.0), skd=skv*sqrt(skv)*sqrt(sqrt(skv)), sks=sqrt(skv)*sqrt(sqrt(skv));      // diffuse dies in 30 m; the wet glints carry 100 m
  lit+=uAmb*alb*(0.55+0.45*dif)*(1.0-0.6*form);
  // a pedestal of dim blue-green that follows the same relief, so the lit sides and the cusps sit well over the display curve's
  // cliff and the far sides and the dish floors fall under it: wet modelled rock, not an even glow
  // (uVoid, the Hall and the neck: the pedestal follows the colony's light, so the rock under a cloud of lights is modelled
  // relief and the lanes and voids between the clouds are plain dark rock: the walls are not one even tone)
  float ped=mix(1.0,mix(0.58,1.12,smoothstep(0.02,0.17,max(vIrr,0.0))),uVoid);
  lit+=uLift*ped*mix(mix(0.42,1.7,rel),1.0,0.5*uCalm)*mix(0.93,1.0,max(lk,uCalm))*(0.75+0.55*alb)*(1.0-0.55*form)*(uMirror>0.5?1.4:1.0)*(1.0+0.45*soft);     // (an image is seen through the dark sheet: its relief is lifted to land where the rock's does)
  float rim=1.0-facing; lit+=uWormCol*(vIrr*flow*(1.5*rim*rim*rim+(uMirror>0.5?0.0:0.55*(1.0-smoothstep(0.0,0.14,vP.y)))));     // and a wet line of light where it stands in the lake     // flowstone columns: a wet edge that takes the false sky's light
  // what hangs from the roof is black against the glow, with a wet rim of the colony's light down each side (so is every edge of lit rock)
  lit+=uWormCol*(uRimK*rim*rim*rim*(form*(0.07+0.5*vIrr)+(1.0-form)*0.2*vIrr)*(1.0-flow));
  lit+=uSkyCol*(skd*alb*(0.30+0.70*max(dot(n,Lm),0.0))*0.7+sks*(sm2*(0.2+0.8*wet)*0.9+sm6*(0.3+0.7*wet)*0.16)*(0.25+0.75*k1)*uGlint);
  if(uMirror>1.5) lit=mix(uLift*1.7+uAmb*1.1,lit,smoothstep(3.0,11.0,vNear));      // right under the eye the Flume's image is a few stretched triangles: it dissolves into the sheet's own dim tone
  if(uMirror>0.5) lit*=0.9-0.4*flow;                                 // (a column's image is dimmer than the column: the waterline reads)
  // The Hall's lake is a still black mirror: it holds every light and the towers that stand in it, and of the walls and the
  // dome only a dim image. A rule of the place: from the neck's mouth (uMirD) to the passage's end (uMirE), eased at both.
  if(uMirror>0.5&&uMirror<1.5) lit*=mix(1.0,uMirK,smoothstep(-2.0,12.0,dot(vP.xz-uMirD.xy,uMirD.zw))*(1.0-smoothstep(-44.0,-8.0,dot(vP.xz-uMirE.xy,uMirE.zw))));
  gl_FragColor=vec4(lit*uGain,1.0);
  #include <fog_fragment>
}`,Ja=`
attribute vec3 iPos, iMir, iPar2;      // iPar2: river distance s, flow 0..1, water height there
attribute vec4 iPar;                   // size (m), phase, tint -1..1, how much a wake slap dims it
uniform float uFlip, uTime, uBoatS, uRelight, uShutter, uGain, uBright, uFlowC, uStreak, uAhead;
uniform vec2 uRes; uniform vec3 uCamL, uVelL, uColA, uColB;
varying vec2 vUV; varying float vLen, vSoft, vCom; varying vec3 vCol;
#include <fog_pars_vertex>
${Ne}
void main(){
  vec3 c=iPos; float stretch=1.0, dimM=1.0, velK=1.0; vec3 ext=vec3(0.0); vSoft=0.0;
  if(uFlip>0.5){
    c=iMir;
    float hd=max(iPar2.z-c.y,0.0);
    vec2 H=mix(uCamL.xz,c.xz,${fe.toFixed(2)}/(${fe.toFixed(2)}+hd));
    vec3 rp=rippleField(H,uFlowC);
    c.xz+=rp.xy*(hd+0.15)*1.45;                                     // the same shiver as the rock's image: a light stays on its rock
    stretch=1.0+min(rp.z*5.0,0.8);
    dimM=0.8/(1.0+rp.z*1.2);
    // on quick water the image of each light is drawn out toward the eye into a long soft streak (it is a reflection on a
    // rough surface, not a light that streaks past); the streaks are of uneven length, soft at both ends
    float fq=smoothstep(0.04,0.34,iPar2.y);
    vec2 te=uCamL.xz-c.xz; te=te/max(length(te),1e-3);
    ext=vec3(te.x,0.0,te.y)*((0.3+0.42*hd)*0.5*fq*(0.55+0.9*fract(iPar.y*13.7)));
    velK=1.0-0.8*fq; vSoft=fq*0.7;
    dimM*=mix(1.0,0.8,fq);                                          // an image is never brighter than its light
  }
  vec4 mvPosition=modelViewMatrix*vec4(c,1.0);
  // A LIGHT IN THE SMEAR IS A COMET (the cave's lights themselves, uFlip 0, wherever the world has lifted the cap uStreak
  // with our speed): its head is the light, where it is now; its tail runs back along our travel to where the light stood a
  // moment ago (uShutter seconds of our own velocity, so the length on screen is our speed and its nearness: an arm's length
  // overhead a long stroke, across the hall a still point). An image on the water (uFlip 1) keeps its soft two-ended shimmer.
  // Where the cap is not lifted (the Sphere, the Hall, the open air) and for the lights of the banks outside (river distance
  // 9999) every light is the round point it always was.
  float capW=mix(1.15,uStreak,step(iPar2.x,9000.0));
  float comet=(1.0-step(0.5,uFlip))*step(1.16,capW);
  vCom=comet;
  vec3 vv=mat3(modelViewMatrix)*(uVelL*(uShutter*mix(0.5*velK,0.62+0.7*fract(iPar.y*5.31),comet))+ext);
  vec4 mA=vec4(mvPosition.xyz-vv*(1.0-comet),1.0), mB=vec4(mvPosition.xyz+vv,1.0);
  float zc=min(mvPosition.z,-0.05); mA.z=min(mA.z,-0.05); mB.z=min(mB.z,-0.05);
  vec4 pC=projectionMatrix*vec4(mvPosition.xy,zc,1.0), pA=projectionMatrix*mA, pB=projectionMatrix*mB;
  vec2 hr=0.5*uRes;
  vec2 d=pB.xy/pB.w*hr-pA.xy/pA.w*hr; float len=length(d);
  vec2 dir=len>0.5?d/len:vec2(1.0,0.0);
  float rTrue=iPar.x*projectionMatrix[1][1]*hr.y/(-zc);
  float r=clamp(rTrue,1.0,max(1.6,uRes.y*0.0062)), e=r*2.6;
  // In still water (the Sphere, the Hall) a light is a round point, drawn out by no more than its own width. Where the current
  // takes hold (the neck, and from the Hall's far door down the Flume) the world lifts uStreak (the cap, in widths) with our
  // speed and the lights are drawn out along our motion: comets, longer with speed and nearness.
  len=min(len,r*(uFlip>0.5?1.15+(capW-1.15)*0.3:capW)*(1.0+0.5*vSoft));      // (an image on the water is drawn out a third as far: the water never carries ruled lanes of light)
  float smK=clamp((capW-1.15)*0.25,0.0,1.0);                    // 1 where the world has lifted the cap: the smear
  float sy=len>0.5?mix(1.0,mix(mix(0.55,0.42,smK),1.15,vSoft),smoothstep(0.5,4.0,len/e)):stretch;
  if(comet>0.5) sy=1.0;                                             // the head stays a round point
  float along=comet>0.5?mix(-e,len+e,position.x*0.5+0.5):position.x*(len*0.5+e);
  vec2 px=pC.xy/pC.w*hr+dir*along+vec2(-dir.y,dir.x)*position.y*e*sy;
  gl_Position=vec4(px/hr*pC.w,pC.z,pC.w);
  if(mvPosition.z>-0.08) gl_Position=vec4(0.0,0.0,2.0,1.0);
  vUV=vec2(along/e,position.y); vLen=comet>0.5?len/e:len*0.5/e;
  if(comet>0.5) vSoft=0.0; else if(uFlip<0.5) vSoft=0.6*smoothstep(1.0,4.0,vLen);
  float br=0.7+0.3*sin(uTime*(0.3+0.5*fract(iPar.y*7.31))+iPar.y*6.2832);
  float dl=uBoatS-iPar2.x-4.0;
  br*=1.0-0.93*iPar.w*smoothstep(0.0,2.5,dl)*(1.0-smoothstep(uRelight*0.2,uRelight,dl));
  br*=max(pow(clamp(rTrue/r,0.0,1.0),1.4),0.05)*(1.0+0.35*clamp(rTrue/r-1.0,0.0,2.0));
  if(comet<0.5) br*=(uFlip>0.5?1.0-0.35*smK:1.0)/((1.0+vLen*mix(0.22,0.5,smK))*sqrt(max(sy,1.0)));      // (a comet's head is as bright as the still light: only an image thins as it is drawn out)
  br*=1.0+uAhead*smoothstep(7.0,26.0,iPar2.x-uBoatS);              // seen down a passage the hall beyond is the brighter place: a lit door, never a dark pane
  vCol=mix(uColA,uColB,iPar.z*0.5+0.5)*(br*uBright*dimM*uGain);
  #include <fog_vertex>
}`,t0=`
uniform float uFlip;
varying vec2 vUV; varying float vLen, vSoft, vCom; varying vec3 vCol;
#include <fog_pars_fragment>
void main(){
  if(vCom>0.5){
    // the comet: a round bright head at the light, and behind it a tail that narrows and dies away along our travel
    float x=vUV.x, y=vUV.y, L=max(vLen,1e-3), r2h=x*x+y*y;
    float edge=clamp(1.0-r2h,0.0,1.0); edge*=edge;
    float head=exp(-r2h*11.0)*sqrt(edge)+exp(-r2h*3.6)*0.13*edge;
    float g=clamp(x/L,0.0,1.0), w=mix(0.8,0.24,g), yy=y/w, ey=clamp(1.0-yy*yy,0.0,1.0);
    float tail=exp(-yy*yy*9.0)*ey*ey*exp(-1.5*g)*(1.0-g)*sqrt(1.0-g)*smoothstep(-0.3,0.4,x)*0.5*smoothstep(0.25,1.5,vLen);      // (it dies away over its whole length: a stroke, not a stub)
    vec3 col=vCol*(head+tail);
    col+=vec3(0.3)*dot(vCol,vec3(0.33))*exp(-r2h*22.0);
    ${We}
    gl_FragColor=vec4(col,1.0);
    return;
  }
  float dx=max(abs(vUV.x)-vLen,0.0); float r2=dx*dx+vUV.y*vUV.y;
  float edge=clamp(1.0-r2,0.0,1.0); edge*=edge;                    // everything is gone well inside the card: no plate, no square
  float core=exp(-r2*mix(11.0,6.5,clamp(vSoft*2.5-1.5,0.0,1.0))), halo=exp(-r2*3.6)*0.13*edge;   // only an image on quick water is softened
  float gx=vUV.x/(vLen+1.0);
  float taper=mix(1.0,exp(-gx*gx*4.2)*1.1,vSoft);                  // a streak fades toward both ends: a smear of light, never a dash
  vec3 col=vCol*(core*sqrt(edge)+halo)*taper;
  col+=vec3(0.3)*dot(vCol,vec3(0.33))*core*core*taper;
  ${We}
  gl_FragColor=vec4(col,1.0);
}`,e0=`
attribute vec3 iPos; attribute vec4 iPar;      // length (m), seed, card width (m), river distance
uniform vec3 uCamL, uVelL; uniform float uTime;
varying vec2 vUV; varying vec4 vPar; varying float vFade;
#include <fog_pars_vertex>
void main(){
  vec3 tc=uCamL-iPos; float dist=length(tc);
  vec3 rt=vec3(tc.z,0.0,-tc.x); rt=rt/max(length(rt),1e-3);
  float v=position.y;
  vec3 p=iPos+rt*(position.x*iPar.z*0.5)-vec3(0.0,v*iPar.x,0.0);
  float nearK=exp(-dist*dist/12.0);
  vec2 sw=vec2(sin(uTime*1.3+iPar.y*40.0),cos(uTime*1.1+iPar.y*23.0))*0.016
         +uVelL.xz*0.014*nearK*(0.6+0.4*sin(uTime*3.0+iPar.y*9.0));
  p.xz+=sw*v*v*(iPar.x/0.3);
  vUV=vec2(position.x*0.5+0.5,v); vPar=iPar; vFade=1.0-smoothstep(16.0,38.0,dist);
  vec4 mvPosition=modelViewMatrix*vec4(p,1.0);
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,a0=`
uniform vec3 uWormCol, uCamL; uniform float uGain, uTime;
varying vec2 vUV; varying vec4 vPar; varying float vFade;
#include <fog_pars_fragment>
float h11(float n){ return fract(sin(n*12.9898)*43758.5453); }
void main(){
  vec2 fw=fwidth(vUV);
  float W=vPar.z, Lm=vPar.x;
  float pxm=max(fw.x*W,1e-5);
  float lw=max(pxm*0.6,0.0004);
  float thin=min(1.0,0.0009/lw+0.18);
  float ym=vUV.y*Lm;
  float acc=0.0, bead=0.0;
  for(int k=0;k<6;k++){
    float fk=float(k);
    float xk=(fk+0.5)/6.0+(h11(vPar.y*91.7+fk*3.1)-0.5)*0.13;
    float lk=0.3+0.7*h11(vPar.y*57.3+fk*7.7);
    float dxm=abs(vUV.x-xk)*W;
    float on=1.0-smoothstep(lk-0.03,lk,vUV.y);
    acc+=(1.0-smoothstep(lw*0.5,lw*1.5,dxm))*thin*on;
    float sp=0.013+0.012*h11(vPar.y*13.1+fk*5.3);
    float yb=ym/sp+h11(vPar.y*3.3+fk);
    float id=floor(yb); float dym=(yb-id-0.5)*sp;
    float rb=0.0016+0.0016*h11(id*7.7+fk*31.0+vPar.y*17.0);
    float dd=length(vec2(dxm,dym));
    float b=(1.0-smoothstep(max(rb-pxm*0.5,0.0),rb+pxm,dd))*min(1.0,rb*rb/(pxm*pxm)*4.0+0.05);
    float tw=0.5+0.5*sin(id*12.9+fk*4.0+uCamL.x*5.0+uCamL.z*5.0+uTime*0.7);
    bead+=b*on*(0.35+1.65*tw*tw*tw);
  }
  vec3 col=(uWormCol*acc*0.22+mix(uWormCol,vec3(0.56,0.78,1.0),0.55)*bead*1.6)*(1.0-0.7*vUV.y)*vFade*uGain;     // silk beads: the palest, bluest white in the cave
  col+=vec3(0.55,0.75,1.0)*bead*bead*0.3*vFade*uGain;
  ${We}
  gl_FragColor=vec4(col,1.0);
}`,o0=`
attribute vec3 iPos; attribute vec4 iPar;      // length (m), seed, sway at the tip (m), the water's height under it
uniform vec3 uCamL, uVelL; uniform vec2 uRes; uniform float uTime, uFlip, uFlowC;
varying vec3 vT; varying vec4 vK;               // vT: metres across, metres down the thread, metres per pixel   vK: seed, brightness, length, 0..1 down the thread
#include <fog_pars_vertex>
${Ne}
void main(){
  float v=position.y, len=iPar.x, h=iPar.y;
  vec3 p=iPos; p.y-=v*len;
  float d0=length(uCamL.xz-iPos.xz);
  vec2 sw=vec2(sin(uTime*(0.5+0.45*h)+h*40.0),cos(uTime*(0.42+0.4*fract(h*7.3))+h*23.0))*iPar.z
         +uVelL.xz*(0.03*min(1.0,len/3.0))*exp(-d0*d0/60.0)*(0.6+0.4*sin(uTime*2.1+h*9.0));      // (a short thread swings less in the air we push aside)
  p.xz+=sw*v*v;
  float dimM=1.0;
  if(uFlip>0.5){
    float wy=iPar.w, hd=max(p.y-wy,0.0);
    vec2 H=mix(uCamL.xz,p.xz,${fe.toFixed(2)}/(${fe.toFixed(2)}+hd));
    vec3 rp=rippleField(H,uFlowC);
    p.y=2.0*wy-p.y; p.xz+=rp.xy*(hd+0.15)*1.45;
    dimM=0.7/(1.0+rp.z*1.2);
  }
  vec3 tc=uCamL-p; float dist=max(length(tc),0.05);
  vec3 rt=vec3(tc.z,0.0,-tc.x); rt=rt/max(length(rt),1e-3);
  float pxm=dist*2.0/(projectionMatrix[1][1]*max(uRes.y,1.0));      // metres under one pixel at this distance
  float hw=max(0.03,2.3*pxm);
  p+=rt*(position.x*hw);
  vT=vec3(position.x*hw,v*len,pxm);
  vK=vec4(h,dimM*(1.0-smoothstep(70.0,130.0,dist)),len,v);
  vec4 mvPosition=modelViewMatrix*vec4(p,1.0);
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,n0=`
uniform vec3 uWormCol; uniform float uGain, uTime, uThreadK;
varying vec3 vT; varying vec4 vK;
#include <fog_pars_fragment>
float h11(float n){ return fract(sin(n*12.9898)*43758.5453); }
void main(){
  float x=vT.x, y=vT.y, pxm=max(vT.z,1e-5);
  float lw=max(0.0035,0.6*pxm);
  float line=exp(-x*x/(lw*lw))*min(1.0,0.0035/lw*1.6+0.07);
  float sp=min(0.4+0.3*h11(vK.x*17.0)+0.05*y,0.04+0.16*vK.z);     // the pearls: further apart toward the tip (a short snare carries small beads close together)
  float yb=y/sp+h11(vK.x*3.3);
  float id=floor(yb), dy=(yb-id-0.5)*sp;
  float rT=(0.011+0.009*h11(id*7.7+vK.x*31.0))*clamp(0.5+0.2*vK.z,0.5,1.0), rb=max(rT,1.0*pxm);
  float kb=max(pow(min(1.0,rT/rb),1.15),0.07);
  float bd=exp(-(x*x+dy*dy)/(rb*rb)*1.3);
  float tw=0.5+0.5*sin(id*12.9+vK.x*40.0+uTime*(0.45+0.9*h11(id*3.1+vK.x)));
  float merge=smoothstep(0.5,1.0,2.6*rb/sp);                      // far off they run together into a lit hair
  float bead=mix(bd*(0.3+1.25*tw*tw),0.3*exp(-x*x/(rb*rb)*1.3),merge)*kb;
  float ends=smoothstep(0.0,0.02,vK.w)*(1.0-smoothstep(0.93,1.0,vK.w))*(1.0-0.4*vK.w);
  vec3 col=(uWormCol*line*0.1+mix(uWormCol,vec3(0.56,0.78,1.0),0.5)*bead*1.9+vec3(0.6,0.8,1.0)*bead*bead*0.7)*(ends*vK.y*uThreadK*uGain);     // pearls of water on silk: the palest, bluest white in the cave
  ${We}
  gl_FragColor=vec4(col,1.0);
}`,s0=`
attribute vec4 aLit, aCol, aWl;
uniform float uMirror, uFlowC; uniform vec3 uCamL;
varying vec3 vP, vN, vCam; varying vec4 vL, vC, vWl;
#include <fog_pars_vertex>
${Ne}
void main(){
  vec3 p=position; vP=position; vCam=uCamL;
  if(uMirror>0.5){
    float hd=max(position.y,0.0); vCam=vec3(uCamL.x,-uCamL.y,uCamL.z);
    vec2 H=mix(uCamL.xz,position.xz,${fe.toFixed(2)}/(${fe.toFixed(2)}+hd));
    vec3 rp=rippleField(H,uFlowC); p.xz+=rp.xy*(hd+0.15)*1.45;
  }
  vN=normal; vL=aLit; vC=aCol; vWl=aWl;
  vec4 mvPosition=modelViewMatrix*vec4(p,1.0);
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,i0=`
uniform vec3 uCamL, uWormCol, uRockCol, uAmb, uLift, uColA, uColB;
uniform float uMirror, uGain, uGlint, uFlowK, uTime;
varying vec3 vP, vN, vCam; varying vec4 vL, vC, vWl;
#include <fog_pars_fragment>
${Xe}
void main(){
  vec3 N=vN/max(length(vN),1e-4);
  vec3 q=vP;
  vec3 fq=fwidth(q); float px=max(fq.x,max(fq.y,fq.z));            // metres of stone under one pixel
  vec3 V=vCam-vP; V=V/max(length(V),1e-3);
  float kf=1.0-smoothstep(0.012,0.05,px), kb=1.0-smoothstep(0.03,0.13,px);     // fine work fades before it can alias
  float bank=vC.w, lip=bank*vC.y;
  float warp=vn3(vec3(q.x*1.3,q.y*0.8,q.z*1.3));
  float fj=vn3(vec3(q.x*3.1+7.0,q.y*0.6,q.z*3.1)), fa=(0.15+1.1*vn3(vec3(q.x*1.9+3.0,q.y*0.45,q.z*1.9)))*(1.0-bank);     // the flutes: of uneven spacing and depth, some run together, some die out
  float fc=(vC.x+(warp-0.5)*1.2+(fj-0.5)*0.9)*6.2832;
  vec3 T=vec3(-N.z,0.0,N.x); T=T/max(length(T),1e-3);
  float g1=vn3(vec3(vC.x*0.3,q.y*8.0+warp*1.6,2.0)), g2=vn3(vec3(vC.x*0.8,q.y*25.0,7.0));     // growth bands: thin lips of flowstone, one over another
  float d1=vn3(vec3(vC.x*1.1+3.0,q.y*0.5,5.0)), d2=vn3(vec3(vC.x*2.9,q.y*1.2+2.0,9.0));       // drip streaks: where the water runs down
  vec3 n=N+T*(sin(fc)*0.42*kf*fa)+vec3(0.0,(g1-0.5)*0.55*kb+(g2-0.5)*0.4*kf,0.0)*(1.0-bank)+N*((d2-0.5)*0.25*kf);
  n=n/max(length(n),1e-3);
  float wet=0.25+0.75*smoothstep(0.35,0.7,d1);
  float alb=(0.30+0.17*d1+0.13*g1+0.07*(0.5+0.5*cos(fc))*kf*fa)*(0.76+0.24*smoothstep(0.3,0.6,d2));
  vec3 L=vL.xyz/max(length(vL.xyz),1e-3);
  float sh=vC.z, ndl=dot(n,L), ndl0=dot(N,L);
  float dif=smoothstep(0.0,0.8,ndl)*smoothstep(-0.12,0.3,ndl0);    // the lit side is a third of the way round; the far side takes nothing
  float bk=1.0-(0.9-0.3*smoothstep(0.04,0.3,vP.y))*bank;           // (a bank's risers and pools stay dark, lighter toward the top: its lips carry the light)
  vec3 R=reflect(-V,n);
  float sp=max(dot(R,L),0.0); float s4=sp*sp; s4*=s4; float s32=s4*s4; s32*=s32; s32*=s4;
  // pin glints: beads of water on the stone that catch a light as the eye moves
  vec3 gq=q*21.0; float gh=h31(floor(gq)), gd=length(fract(gq)-0.5);
  float pinB=step(0.93,gh)*(1.0-smoothstep(0.1,0.34,gd))*(1.0-smoothstep(0.12,0.4,px*21.0));
  // the colony's own range: its clouds are greener, its lanes bluer
  vec3 cG=uColA+(uColA-uColB)*0.3, cB=uColB+(uColB-uColA)*0.55;
  vec3 cloudC=mix(cG,uRockCol,0.3);
  // (1) the cloud the island faces: a dim lit side, a near-black side
  vec3 lit=cloudC*(alb*vL.w*dif*sh*0.56*bk*uFlowK);
  lit+=cloudC*(vL.w*sh*uGlint*uFlowK*s32*wet*0.6);
  float facing=clamp(dot(N,V),0.0,1.0), rim=1.0-facing; rim=rim*rim*rim*(1.0-bank);      // (seen from a kayak a bank's flat is all edge: it takes none of this)
  lit+=cloudC*(vL.w*sh*rim*0.2*uFlowK*smoothstep(0.0,0.6,ndl0));                    // a thin wet edge, on the lit side only
  // (2) the worms that live on the stone: each lights the wet flowstone round it, within about a metre
  float Ew=length(vWl.xyz); vec3 Lw=vWl.xyz/max(Ew,1e-3);
  vec3 wC=mix(cG,cB,clamp(vWl.w,0.0,1.0));
  float difw=0.22+0.78*max(dot(n,Lw),0.0);
  float sw=max(dot(R,Lw),0.0); sw*=sw; sw*=sw; sw*=sw;
  float aoW=0.45+0.55*smoothstep(0.2,0.8,sh);                     // the hollow under a lip still holds its own worms' light
  lit+=wC*(Ew*uFlowK*aoW*bk*(alb*difw*0.7+sw*wet*0.22*uGlint));
  // (3) pin-sharp glints of the bluest light, where either light falls
  float pin=pinB*(vL.w*sh*smoothstep(0.05,0.55,ndl0)*(0.25+0.75*s4)*1.7+Ew*aoW*(0.3+0.7*sw)*1.1);
  lit+=mix(cB,vec3(0.5,0.78,1.0),0.45)*(pin*uGlint*uFlowK);
  // (4) the lip of each rimstone step: a wet edge that takes the light, the pool behind it dark
  float l4=clamp(lip,0.0,1.0); l4*=l4; l4*=l4;                                         // (a thin line along the top of the dam: the riser under it stays dark)
  l4*=0.3+0.7*smoothstep(0.004,0.02,px);      // (close under the eye a lip is a hand wide: there it is wet stone, not a band of light)
  lit+=cloudC*(l4*uFlowK*(vL.w*(0.1+0.3*smoothstep(-0.5,0.5,ndl0))+Ew*0.16))+wC*(l4*Ew*0.12*uFlowK);
  // the far side: blue-black, never a hole
  lit+=uAmb*alb*1.3+uLift*0.55*(0.35+0.65*smoothstep(-0.6,0.4,ndl0))+vec3(0.0006,0.0026,0.0075)*alb*(1.0-0.5*bank);
  // where it stands in the lake the stone is dark with water: a black wet line at its foot (and at the foot of its image)
  lit*=0.1+0.9*smoothstep(0.015,mix(0.12,0.07,bank),vP.y);
  // the waterline: a thin bright meniscus where the wet stone meets the lake, never under two pixels tall, so that from across
  // the lake a bank or a column is seen to stand IN the water (lit stone, a line of light, then a dimmer broken image)
  float wlh=max(mix(0.06,0.022,bank),2.0*px);                      // (a bank shelves into the lake: its line is thinner, or the whole shelf would glow)
  float wline=(1.0-smoothstep(wlh*0.45,wlh,vP.y))*(1.0-uMirror)*(1.0-smoothstep(0.5,1.6,px));
  lit+=mix(cloudC,vec3(0.4,0.72,0.9),0.35)*(wline*uFlowK*(1.0-0.5*bank)*(0.2*vL.w*(0.35+0.65*smoothstep(-0.4,0.5,ndl0))+0.14*Ew+0.012));
  if(uMirror>0.5){                                                 // its image: the stone again (the lake's own sheet over it dims it), fading with depth and broken into bands by the lake's ripples (a black image reads as teeth hanging under a plate)
    float bands=smoothstep(0.3,0.7,vn3(vec3(vP.x*0.8,vP.y*5.4+uTime*0.6,vP.z*0.8)));
    lit*=(0.5+0.6*bands)*exp(-0.05*vP.y)*mix(1.0,0.6,bank)*smoothstep(0.0,0.09,vP.y);      // (a hair of dark under the waterline, then the foot's own image: the stone stands in the lake)
  }
  gl_FragColor=vec4(lit*uGain,1.0);
  #include <fog_fragment>
}`,r0=`
attribute vec4 aW;        // metres from the axis, drift time tau (s), flow 0..1, roof glow above
attribute vec4 aW2;       // sky light, across -1..1, river distance (m), drift speed there (m/s)
attribute vec2 aW3;       // where the rock stands in the water on the left and on the right (metres from the axis)
varying vec3 vP; varying vec4 vW, vW2; varying vec2 vW3;
#include <fog_pars_vertex>
void main(){
  vP=position; vW=aW; vW2=aW2; vW3=aW3;                 // the sheet is never displaced: standing waves are shaded, so no mesh edge can show
  vec4 mvPosition=modelViewMatrix*vec4(position,1.0);
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,l0=`
uniform vec3 uCamL, uWormCol, uSkyCol, uAmb, uMouth;
uniform float uTime, uGain, uChev;
uniform vec4 uIsl[${sa}];     // the islands that stand in the lake: x, z, the bank's radius, the phase of its lobes (0: the great Organ)
uniform vec4 uHDrip[${$e}];    // where drops fall into the Hall's lake from the roof: x, z, period (s), phase
varying vec3 vP; varying vec4 vW, vW2; varying vec2 vW3;
#include <fog_pars_fragment>
${Xe}
${Ne}
// The sheet is a dark glass over the BUILT mirror (the rock's image and every light's image lie under it, the whole river
// long): what it draws itself is only what lies ON the water. Foam at one scale: x across in metres, y along the current in
// units of about a metre. Returns (soft clumps for the caps of standing waves, small separate flecks). No lines anywhere:
// nothing here is drawn out along the current, so nothing can rule the surface or beat against the pixels.
vec2 foamAt(float x, float y){
  float wob=vn3(vec3(x*0.7,y*0.33,3.0))*1.7;
  float a=vn3(vec3(x*2.6+wob,y*0.9,1.0))*0.6+vn3(vec3(x*6.3-wob*1.3,y*2.1,5.0))*0.4;
  float f=vn3(vec3(x*13.0+y*7.5+wob,y*13.0-x*7.5,13.0))*0.78+vn3(vec3(x*23.0-y*9.0,y*17.0+x*11.0,9.0))*0.22;
  return vec2(a,f);
}
void main(){
  vec2 fwp=fwidth(vP.xz); float px=max(fwp.x,fwp.y);              // metres of water under one pixel (before any loop)
  float pxx=max(fwidth(vW.x),1e-4);                               // metres ACROSS the stream under one pixel
  vec3 V=uCamL-vP; float dist=max(length(V),1e-3); V/=dist;
  float fl=vW.z, irr=vW.w, sky=vW2.x, ac=vW2.y, sr=vW2.z, vw=max(vW2.w,0.06), x=vW.x;
  float c1=1.0-clamp(V.y,0.0,1.0); float f3=c1*c1*c1;
  float fast=smoothstep(0.06,0.5,fl), fl2=fl*fl;
  // how much of the mirror shows: still water and the Tube's mirror from every angle; the Flume's quick water less under the bow
  float Rf=mix(0.72+0.27*f3,0.48+0.48*f3,smoothstep(0.4,0.9,fl));
  vec3 rp=rippleField(vP.xz,fl);
  // the water's own clock: what floats rides the current exactly. Two octaves of scale are blended by the local speed so a
  // unit along the current is always one to two metres of river, in the still Grotto and in the Flume alike.
  float ta=vW.y-uTime;
  float lv=log2(vw), lo=floor(lv), lf=lv-lo;
  float ya=ta*exp2(lo), yb=ya*2.0;
  vec2 F=mix(foamAt(x,ya),foamAt(x,yb),lf);
  float near=1.0-smoothstep(0.05,0.22,px);
  float lace=vn3(vec3(x*29.0+F.y*2.0,ya*3.3,17.0));                 // grain inside the foam: lace and froth, never a flat pane
  float fleck=smoothstep(0.72,0.88,F.y)*(1.0-smoothstep(0.03,0.14,px))*(0.35+0.85*lace);
  float still=smoothstep(0.84,0.95,vn3(vec3(vP.x*9.0,(vP.z+uTime*0.14)*9.0,9.1)))*(1.0-fast);     // the Grotto's drifting flecks
  // standing waves of the Flume. Quick water in a chute stands in oblique waves: each crest is a V whose point lies downstream
  // and whose arms trail back up the chute toward the walls, some twelve metres from point to wall, so from the bow an arm is
  // a diagonal running away down the water and never a line ruled from wall to wall. The point wanders off the middle, and
  // each crest is only a PIECE: it stands over a third to half of the stream, on one side or the other, its ends ragged, and
  // one in five is missing. The face that rises toward us is pale broken water, its back a soft dark hollow, and froth rides
  // the top in pieces. Far off, where they would be thinner than a few pixels, and right under the bow they are not drawn.
  float crestK=(1.0-smoothstep(1.2,3.6,px))*smoothstep(4.0,10.0,dist)*smoothstep(0.22,0.7,fl);
  float apexX=0.22*sin(sr*0.071+1.3)+0.2*(vn3(vec3(sr*0.045,2.0,7.0))-0.5);
  float av=sqrt((ac-apexX)*(ac-apexX)+0.003);
  float sph=sr*0.5+11.5*av*sqrt(sqrt(av))+0.5*sin(x*0.9+sr*0.11)+1.5*vn3(vec3(x*0.45,sr*0.06,3.0))+0.8*vn3(vec3(x*1.6,sr*0.2,4.0));
  float sw=sin(sph), cw=cos(sph);
  float ci=floor((sph+1.5708)/6.2832);                               // which crest (the seam between two lies in a trough, where nothing is drawn)
  float hA=h11(ci*7.13+3.0), hB=h11(ci*3.71+11.0), hC=h11(ci*5.3+1.7);
  float pcx=(mod(ci,2.0)<0.5?-1.0:1.0)*(0.07+0.24*hA);               // staggered: one stands left of the middle, the next right
  float pwd=0.23+0.10*hB;
  float pedge=abs(ac-pcx)+0.12*(vn3(vec3(x*1.1,sr*0.21,ci+3.0))-0.5);
  float cpc=(1.0-smoothstep(pwd*0.5,pwd*1.2,pedge))*step(0.2,hC);
  float crest=smoothstep(0.80,1.0,sw);                               // the cap is a narrow line along the top, a metre or two wide
  float farK=smoothstep(0.25,1.2,px);                                // far off the foam's grain is under a pixel: a crest is then broken by a coarser field
  float brk=vn3(vec3(x*1.7+ci*5.0,sr*0.16,9.0));                     // (across the stream, an arm's length at a time)
  float capN=mix(F.x*0.6+0.4*vn3(vec3(x*1.1,sr*0.5,9.0)),0.15+0.7*brk,farK);
  float cap=crest*smoothstep(0.46,0.72,capN)*mix(0.12+0.88*lace*lace*1.6,0.6,farK)*crestK*cpc;        // and it comes in pieces of froth: never a band from wall to wall
  float rise=max(cw,0.0)*smoothstep(-0.2,0.7,sw)*crestK*cpc, back=max(-cw,0.0)*smoothstep(-0.6,0.8,sw)*crestK*cpc;
  rise*=(0.22+0.78*smoothstep(0.28,0.66,mix(capN,brk,0.5)))*mix(0.5+0.5*lace,0.8,farK);      // a rising face is broken water, never a flat pale lens
  back*=(0.25+0.75*smoothstep(0.25,0.7,vn3(vec3(x*0.9+3.0,sr*0.12,ci))))*(0.45+0.55*smoothstep(0.3,0.7,vn3(vec3(x*2.3,sr*0.45,ci+7.0))));                         // and its back a hollow of uneven depth, never a ruled riser
  // chevrons: standing diagonal waves that leave both walls and cross in mid-stream, wandering and broken along their length
  float cj=1.5*vn3(vec3(x*0.6,sr*0.15,5.0))+0.7*sin(sr*0.31+x*0.8);
  float chA=max(sin(sr*1.5-x*2.1+cj),0.0), chB=max(sin(sr*1.5+x*2.1+cj*0.8+1.9),0.0);
  chA*=chA; chB*=chB;
  float chev=(chA*(1.0-smoothstep(-0.2,0.8,ac))+chB*smoothstep(-0.8,0.2,ac))
            *(0.15+0.85*smoothstep(0.3,0.7,vn3(vec3(x*1.3,sr*0.4,2.2))))*(1.0-smoothstep(0.2,0.8,px))*fast*(1.0-0.55*fl2);
  // where the current takes hold (the neck, and from the Hall's far door down the Flume: uChev) chevrons stand on the water a
  // metre under the eye: Vs whose points lie downstream and whose arms trail back toward both walls, wandering, broken along
  // their length, each with a pale face and a dark back; flecks of foam ride through them
  // (the arms wander at two scales, so each piece of a crest is a short curve: a comma of broken water, never a ruled line)
  float cw2=2.0*vn3(vec3(x*0.7,sr*0.22,15.0))+0.5*sin(sr*0.23)+1.9*vn3(vec3(x*3.1+3.0,sr*1.4,19.0));
  float cv=sin(sr*2.7+abs(x-0.4*sin(sr*0.09))*5.4+cw2*1.7);          // (arms some 27 degrees off the stream, a crest every 2.3 m)
  float cvK=(1.0-smoothstep(0.05,0.2,px))*smoothstep(1.7,4.2,dist)*uChev;      // only where a crest is several pixels wide, and not right under the eye, where a hand's length of water is a hundred pixels
  // each arm in short pieces (a hand to a forearm long), the pieces in groups, with gaps as long
  float cvP=smoothstep(0.46,0.68,vn3(vec3(x*3.2+5.0,sr*1.5,8.0)))*smoothstep(0.3,0.6,vn3(vec3(x*1.1+9.0,sr*0.5,12.0)));
  float chevN=smoothstep(0.5,0.95,cv)*cvP*cvK*(0.2+0.8*lace);          // a soft face broken into froth
  float chevD=smoothstep(0.55,1.0,-cv)*cvP*cvK*0.5;
  // where the water meets the rock: a ragged line of foam and slow eddies of uneven width that follows every bay of the wall
  float dwall=min(x-vW3.x,vW3.y-x);
  float farB=smoothstep(0.15,0.6,px);                                // far off, what varies along the bank by the arm's length is under a pixel: it is evened out, never dotted
  float edgeN=mix(vn3(vec3(vP.x*1.9,vP.z*1.9,2.0+uTime*0.07)),0.45,farB);
  float eddy=vn3(vec3(x*2.4,ya*0.2,31.0))*0.6+vn3(vec3(x*7.0+edgeN*2.0,ya*0.45,37.0))*0.4;      // these creep: the bank water is slow
  float bankW=0.12+0.5*edgeN*edgeN+0.15*fl;
  float piece=mix(smoothstep(0.42,0.68,vn3(vec3(vP.x*1.15+7.0,vP.z*1.15,3.0+uTime*0.04))),0.3,farB);          // it comes in pieces an arm or two long, with gaps
  // (and where a piece would be thinner than a pixel or two it is not drawn: far down the river there is no line at all)
  float bankF=(1.0-smoothstep(bankW*0.25,bankW,dwall))*smoothstep(-0.3,0.0,dwall)*piece*smoothstep(0.34,0.6,eddy)*(0.3+0.7*mix(0.6,lace,near))*smoothstep(1.0,2.6,bankW/pxx);
  float fringe=(1.0-smoothstep(0.0,0.25+0.6*edgeN,dwall))*mix(smoothstep(0.3,0.75,vn3(vec3(vP.x*0.9+3.0,vP.z*0.9,5.0+uTime*0.05))),0.4,farB);   // dead water in the bays mirrors nothing
  float lipF=smoothstep(${(Z-1.5).toFixed(1)},${(Z-.2).toFixed(1)},sr)*(0.35+0.65*lace);     // the water curls white as it goes over the lip
  float foam=still*(0.1+0.5*fl)+fleck*0.8*max(fast*(0.45+0.55*fl),0.7*uChev)+cap*6.0+rise*0.55+bankF*(0.3+0.35*fast)+lipF*0.5+chevN*(0.05+0.3*lace*F.x);
  foam*=1.0-smoothstep(60.0,160.0,dist)*0.6;
  vec3 light=uWormCol*(irr*mix(0.34,0.6,fast)+0.09*fast)+uSkyCol*(sky/(0.35+sky))*1.6+uAmb*2.0;   // foam is white: it shows on little light
  float lumF=dot(light,vec3(0.25,0.55,0.2));
  vec3 col=mix(light,vec3(0.9,1.0,1.03)*lumF,0.55)*foam*0.8*(1.0-0.4*sky);          // foam is pale: it takes the roof's colour only half way
  vec2 vd=V.xz/max(length(V.xz),1e-3);
  float s1=max(dot(rp.xy,vd)-(0.006+0.034*fl)*1.2,0.0);
  float slw=min(s1*s1*10.0,1.0)*(1.0-0.85*fast);                   // the bow V belongs to still water: in the current it is torn away
  col+=uWormCol*irr*slw*(0.4+0.6*f3)*0.45;                        // faces of the wake that tip toward us catch the roof glow
  // the roof's glow on the faces of the standing waves and chevrons that tip toward the eye: soft, never a line
  col+=(uWormCol*irr*(rise*3.6+chev*0.26)+uSkyCol*sky*rise*2.2)*(0.25+0.75*f3);
  col+=(uWormCol*(irr*1.5+0.07)+uSkyCol*(sky*1.4+0.04))*(chevN*(0.3+0.7*f3)*0.2);
  // the mouth's light on the water. Its true image lies in the built mirror (the Flume's own image, with a pane of sky in its
  // mouth); here is what the roughness of quick water adds: a lane as wide as the disc that runs from under it toward the
  // bow, broken into clumps and glints that ride the current. Worked in directions: the mirrored ray of each point against
  // the mouth's bearing (the lane's width is the mouth's own) and against its height (its length is the water's roughness).
  vec3 Lm=uMouth-vP; float dm=max(length(Lm),1e-3); Lm/=dm;
  vec2 lh=Lm.xz/max(length(Lm.xz),1e-3);
  float dAz=abs(lh.x*vd.y-lh.y*vd.x), wAz=4.2/dm;
  float laneA=(1.0-smoothstep(0.5*wAz,1.2*wAz+0.012+0.03*fast,dAz))*step(0.0,-dot(lh,vd));
  float dEl=max(abs(V.y-Lm.y)-2.6/dm,0.0)/(0.05+0.30*fast);
  float lane=laneA*exp(-0.5*dEl*dEl)*smoothstep(${(J-24).toFixed(1)},${(J+8).toFixed(1)},sr);
  float gl1=vn3(vec3(x*3.1+F.x*1.5,ya*1.3,21.0)), gl2=vn3(vec3(x*11.0,ya*3.1,25.0));
  // far down the chute a metre of water along the stream is under a pixel, so the lane's clumps there are drawn out down the
  // current (round, seen along the water) and ride it: patches of the sky's blue with dark water between, and a few sparks
  float run=uTime*0.55;
  float lcA=vn3(vec3(x*1.25,sr*0.085-run,23.0)), lcB=vn3(vec3(x*3.4+lcA*1.5,sr*0.21-run*2.0,27.0));
  float clumpF=smoothstep(0.36,0.66,lcA)*(0.3+0.7*smoothstep(0.3,0.7,lcB));
  float clump=mix(smoothstep(0.3,0.72,gl1)*(0.35+0.65*clumpF),clumpF,farK);
  float glint=smoothstep(0.60,0.88,gl1*0.5+gl2*0.5)*(1.0-smoothstep(0.03,0.2,px));
  float glintF=smoothstep(0.64,0.8,lcB*0.6+lcA*0.4)*farK;
  col+=uSkyCol*lane*(0.5+0.5*sky)*(0.06+1.05*clump+2.2*glint*fast+1.5*glintF+2.5*rise+0.6*chev)*0.9;
  // where the chute flattens, the water is a hollow mirror and the roof's image runs together into a band: broken water lies
  // across it in patches, so it is never a line from wall to wall
  // rings on the lake round each island's bank: the drips off its columns keep the water there moving. Their faces that tip
  // toward the eye take the colony's glow, their backs hide the image under them, and right at the bank the water is a dark
  // seam between the stone and its image. A ring is drawn only where it is wider than a few pixels ACROSS itself (from a kayak
  // that is the two sides of each ring, far off; the near and far arcs lie edge on and are left out).
  vec2 dPx=dFdx(vP.xz), dPy=dFdy(vP.xz);                           // (taken before the loops)
  float ringL=0.0, ringD=0.0, seam=0.0;
  for(int i=0;i<${sa};i++){
    vec4 isl=uIsl[i]; vec2 qi=vP.xz-isl.xy; float ri=length(qi), ai=atan(qi.y,qi.x+step(ri,0.0)*1e-6);
    float Rb=isl.z*(1.0+0.15*sin(ai*3.0+isl.w)+0.09*sin(ai*5.0-isl.w*1.7)+0.045*sin(ai*11.0+isl.w));
    float di=ri-Rb, on=step(0.5,isl.z);
    vec2 gi=qi/max(ri,1e-3);
    float pc=max(abs(dot(gi,dPx)),abs(dot(gi,dPy)));               // metres across the rings under one pixel
    float rk=(1.0-smoothstep(0.07,0.2,pc))*on;
    float env=smoothstep(-0.2,0.1,di)*(1.0-smoothstep(0.5,2.3,di));   // two or three rings, and then still water
    float wv=sin(di*8.4-uTime*1.5+1.2*vn3(vec3(vP.x*0.5,vP.z*0.5,uTime*0.08+float(i))));
    ringL+=env*smoothstep(0.6,1.0,wv)*rk; ringD+=env*smoothstep(0.35,1.0,-wv)*rk;
    seam+=smoothstep(-0.4,-0.1,di)*(1.0-smoothstep(0.05,0.5,di))*on;
  }
  col+=uWormCol*((irr+0.2)*ringL*(0.3+0.7*f3)*0.4);
  // drops fall from the stalactites into the Hall's lake: each lands as a ring that widens and dies (lit by the colony alone)
  float hring=0.0;
  for(int i=0;i<${$e};i++){
    vec4 hd=uHDrip[i]; float per=max(hd.z,0.5), tt=fract(uTime/per+hd.w)*per;
    vec2 qd=vP.xz-hd.xy; float ld=length(qd); vec2 gd=qd/max(ld,1e-3);
    float pc=max(abs(dot(gd,dPx)),abs(dot(gd,dPy)));
    float wr=clamp(0.7*pc,0.05,0.13), w2=ld-tt*0.75, w3=w2+0.42;      // two thin rings, the second inside the first
    hring+=(exp(-w2*w2/(2.0*wr*wr))+0.55*exp(-w3*w3/(2.0*wr*wr))*step(0.42,tt*0.75))*(0.06/wr)*exp(-tt*0.9)*smoothstep(0.0,0.2,tt)*step(0.6,hd.z)*(1.0-smoothstep(0.14,0.36,pc));     // (a ring too thin to draw is left out: never a pale disc)
  }
  col+=mix(uWormCol,vec3(0.5,0.75,1.0),0.3)*((irr+0.25)*hring*(0.35+0.65*f3)*0.8);
  float jz=exp(-(sr-${(Z-38).toFixed(1)})*(sr-${(Z-38).toFixed(1)})/50.0);
  float jbrk=jz*smoothstep(0.38,0.62,vn3(vec3(x*0.85+11.0,sr*0.07,41.0)));
  float alpha=clamp(1.0-Rf+foam*0.8+fringe*(0.22+0.2*fast)+back*0.5+jbrk*0.4+ringD*0.3+ringL*0.12+seam*0.6+hring*0.2+chevD*0.3+chevN*0.2,0.0,1.0);
  col*=uGain;
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      float ff=1.0-exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
    #else
      float ff=smoothstep(fogNear,fogFar,vFogDepth);
    #endif
    col=mix(col,fogColor*alpha,ff);
  #endif
  gl_FragColor=vec4(col,alpha);
}`,h0=`
varying vec2 vQ;
void main(){ vQ=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,c0=`
uniform vec3 uSkyCol; uniform float uGain, uTime;
varying vec2 vQ;
${Xe}
void main(){
  float d=max(vQ.y,0.0);
  float n=vn3(vec3(vQ.x*2.5,d*1.3-uTime*0.9,uTime*0.15));
  float mist=exp(-d*1.3)*(0.5+0.8*n);
  float n2=vn3(vec3(vQ.x*5.0+3.0,d*0.9-uTime*0.5,7.0));
  vec3 col=uSkyCol*(vec3(0.3,0.46,0.95)*(0.22+0.2*n+0.14*n2)+vec3(0.85,0.95,1.1)*0.5*mist);
  gl_FragColor=vec4(col*uGain,1.0);
}`,f0=`
attribute vec3 aAnt;      // 0..1 along an antenna (0 elsewhere), side, base radius of thin parts (0 = body)
uniform float uTime;
varying vec3 vNv; varying float vTop;
#include <fog_pars_vertex>
void main(){
  vec3 p=position;
  float hsh=fract(instanceMatrix[3].x*3.71+instanceMatrix[3].z*5.13);
  float ph=uTime*(0.8+0.7*hsh)+hsh*40.0;
  float a=aAnt.x*aAnt.x;
  p.x+=aAnt.y*sin(ph+aAnt.y*1.3)*0.075*a+sin(ph*2.3)*0.012*a;
  p.y+=cos(ph*0.63+aAnt.y*2.0)*0.06*a;
  vec4 wp=modelMatrix*instanceMatrix*vec4(p,1.0);
  float dist=length(cameraPosition-wp.xyz);
  vec3 nw=mat3(modelMatrix)*mat3(instanceMatrix)*normal; nw=nw/max(length(nw),1e-4);
  if(aAnt.z>0.0) wp.xyz+=nw*max(0.0,0.0024*dist-aAnt.z);
  vec4 mvPosition=viewMatrix*wp;
  vNv=mat3(viewMatrix)*nw; vTop=nw.y;
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,u0=`
uniform vec3 uWormCol; uniform float uGain;
varying vec3 vNv; varying float vTop;
#include <fog_pars_fragment>
void main(){
  vec3 n=vNv/max(length(vNv),1e-4);
  float rim=max(1.0-abs(n.z),0.0); rim=rim*sqrt(rim);
  vec3 col=uWormCol*(0.0015+0.022*rim*(0.5+0.5*vTop))*uGain;      // black on the glow: the faintest wet rim, no more
  gl_FragColor=vec4(col,1.0);
  #include <fog_fragment>
}`,d0=`
attribute float aT;
uniform vec4 uEel; uniform float uTime, uEelY;
varying vec3 vN; varying float vT;
#include <fog_pars_vertex>
void main(){
  float amp=0.08+0.27*aT;
  float ph=aT*7.5-uTime*5.0;
  float lat=position.x+amp*sin(ph);
  vec2 d=uEel.zw, r=vec2(-d.y,d.x);
  vec3 p=vec3(uEel.x+r.x*lat-d.x*position.z, uEelY+position.y, uEel.y+r.y*lat-d.y*position.z);
  vN=vec3(r.x*normal.x-d.x*normal.z, normal.y, r.y*normal.x-d.y*normal.z); vT=aT;
  vec4 mvPosition=modelViewMatrix*vec4(p,1.0);
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,m0=`
uniform vec3 uWormCol; uniform float uGain;
varying vec3 vN; varying float vT;
#include <fog_pars_fragment>
void main(){
  vec3 n=vN/max(length(vN),1e-4);
  float up=max(n.y,0.0); up*=up; up*=up;
  float ridge=up*up; ridge*=ridge;
  float skin=0.6+0.4*sin(vT*140.0)*sin(vT*37.0+1.0);
  vec3 col=uWormCol*(0.0008+0.11*up*skin+0.16*ridge)*uGain+vec3(0.25,0.4,0.5)*ridge*ridge*ridge*0.14*uGain;   // a black body; only the wet spine takes the roof's blue
  gl_FragColor=vec4(col,1.0);
  #include <fog_fragment>
}`,p0=`
attribute vec3 iPos; attribute vec4 iPar;     // fall height, period, phase, seed
uniform float uTime; uniform vec3 uCamL, uWormCol; uniform float uGain;
varying vec2 vUV; varying vec3 vCol;
#include <fog_pars_vertex>
void main(){
  float tt=fract(uTime/iPar.y+iPar.z)*iPar.y;
  float tf=sqrt(2.0*iPar.x/9.8);
  float tfall=tt-(iPar.y-tf);
  float y=iPos.y-step(0.0,tfall)*4.9*tfall*tfall;
  float vel=max(tfall,0.0)*9.8;
  float grow=tfall<0.0?smoothstep(0.0,iPar.y-tf,tt):1.0;
  vec3 c=vec3(iPos.x,y,iPos.z);
  vec3 tc=uCamL-c; float dist=length(tc);
  vec3 rt=vec3(tc.z,0.0,-tc.x); rt=rt/max(length(rt),1e-3);
  float w=max(0.008*grow,0.0016*dist), h=max(w,vel*0.022);
  vec3 p=c+rt*position.x*w+vec3(0.0,position.y*h,0.0);
  vUV=position.xy; vCol=(uWormCol*1.8+vec3(0.25))*uGain*(0.5+0.5*grow)*(1.0-smoothstep(18.0,45.0,dist));
  vec4 mvPosition=modelViewMatrix*vec4(p,1.0);
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,w0=`
varying vec2 vUV; varying vec3 vCol;
#include <fog_pars_fragment>
void main(){
  float r2=dot(vUV,vUV);
  vec3 col=vCol*exp(-r2*4.0)*(1.0-smoothstep(0.7,1.0,r2));
  ${We}
  gl_FragColor=vec4(col,1.0);
}`;function Ye(){const t=[],r=[],f=[],o=[],C=[],y=[];return{pos:t,nrm:r,lit:f,sky:o,sof:C,idx:y,get count(){return t.length/3},v(v,s,i,M,m,g,x,c,l,w,k,n=0){return t.push(v,s,i),r.push(M,m,g),f.push(x,c,l,w),o.push(k),C.push(n),t.length/3-1},tri(v,s,i){y.push(v,s,i)},async geometry(v){const s=new F.BufferGeometry;return s.setAttribute("position",new F.BufferAttribute(new Float32Array(t),3)),await v.yield?.(),s.setAttribute("normal",new F.BufferAttribute(new Float32Array(r),3)),await v.yield?.(),s.setAttribute("aLight",new F.BufferAttribute(new Float32Array(f),4)),await v.yield?.(),s.setAttribute("aSky",new F.BufferAttribute(new Float32Array(o),1)),await v.yield?.(),s.setAttribute("aSoft",new F.BufferAttribute(new Float32Array(C),1)),await v.yield?.(),s.setIndex(new F.BufferAttribute(t.length/3>65535?new Uint32Array(y):new Uint16Array(y),1)),await v.yield?.(),s.computeBoundingSphere(),await v.yield?.(),s.computeBoundingBox(),s}}}async function v0(t,r,f){const o=[];for(let l=Jt;l<tt-.001;l+=.66)o.push(l);const C=o.length;for(let l=tt;l<J-.001;l+=.77)o.push(l);const y=o.length;for(let l=J;l<Z-.4;l+=1.2)o.push(l);o.push(Z);const v=o.length-1;o.push(Z+.4,Z+1.1);const s=o.length,i=new Float32Array(s*q*3),M=new Float32Array(s*q*3),m={};for(let l=0;l<s;l++){const w=Math.min(o[l],Z),k=l-v;r.axis(w,m);const n=r.width(w),p=r.roof(w),u=r.camX(w),a=nt(Math.min(n,p)/5,.5,1.6),d=V(tt-14,tt+6,w)*(1-Ce(w)),S=.5+.05*f.n2(w*.11,3.3),N=st(st(5.2,3.4,d),5,V(J-20,J+20,w)),D=st(.8,.58,d);for(let b=0;b<q;b++){const _=b/(q-1),B=Math.PI*_,A=Math.cos(B),W=Math.sin(B);let L=n*Math.sign(A)*Math.pow(Math.abs(A),.75),H=p*Math.pow(W,.8),Y=L/(n*n),U=H/(p*p)+1e-5;const X=Math.hypot(Y,U);Y/=X,U/=X;const et=m.x+m.rx*L,bt=m.y+H,ft=m.z+m.rz*L,Ct=f.fbm3(et*.07,bt*.11,ft*.07,3)*1.4*a*(1-.55*d),Q=1-Math.abs(f.n3(et*.42,bt*.6,ft*.42)),St=f.n3(et*1.4,bt*1.4,ft*1.4)*.07,Rt=Math.exp(-(((_-S)/(.03+.045*d))**2))*.95*a*V(-22,-6,w),Nt=.3*Math.exp(-((H/.45)**2)),Ht=1-.75*V(J-30,J+10,w),It=1-V(J-40,J-5,w),Kt=A>0?0:1,Ut=((Math.pow(Math.abs(Math.sin(Math.PI*(w/N+Kt*.37)+1.3*f.n2(w*.06,50+Kt*9))),.6)-.42)*D+.16*f.n2(w*.7,70+Kt*9))*Math.exp(-((H/.85)**2))*V(-10,0,w),ee=Ct*(.4+.6*Ht)-Q*Q*.32*a*It*(1-.5*d)+St*It*(1-.7*d)+Rt*(.5+.5*It)+Nt+Ut,K=b===0||b===q-1;L+=Y*ee,K||(H=Math.max(.1,H+U*ee)),w>-6&&Math.abs(L-u)<1.4&&(H=Math.max(H,2.55)),w>40&&H<2.2&&Math.abs(L-u)<2.9&&(L=u+(L<u?-2.9:2.9));let j=0;if(k>0){const pt=k===1?1.35:2.2,kt=p*.45;L*=pt,H=K?H:(H-kt)*pt+kt,j=k===1?.5:.2}const vt=(l*q+b)*3;i[vt]=m.x+m.rx*L+m.dx*j,i[vt+1]=m.y+H+m.slope*j,i[vt+2]=m.z+m.rz*L+m.dz*j,(b&15)===15&&await t.yield?.()}await t.yield?.()}await t.yield?.();for(let l=0;l<s;l++){(l&63)===63&&await t.yield?.();for(let w=0;w<q;w++){const k=Math.max(0,l-1),n=Math.min(s-1,l+1),p=Math.max(0,w-1),u=Math.min(q-1,w+1),a=(n*q+w)*3,d=(k*q+w)*3,S=(l*q+u)*3,N=(l*q+p)*3,D=i[a]-i[d],b=i[a+1]-i[d+1],_=i[a+2]-i[d+2],B=i[S]-i[N],A=i[S+1]-i[N+1],W=i[S+2]-i[N+2];let L=A*_-W*b,H=W*D-B*_,Y=B*b-A*D;const U=Math.hypot(L,H,Y)||1,X=(l*q+w)*3;M[X]=L/U,M[X+1]=H/U,M[X+2]=Y/U}}return await t.yield?.(),{sl:o,iG:C,iT:y,iM:v,NR:s,P:i,N:M,ringOf:l=>l<=tt?nt((l-Jt)/.66,0,C-.001):l<=J?nt(C+(l-tt)/.77,C,y-.001):nt(y+(l-J)/1.2,y,v),sOf:l=>{const w=Math.min(s-2,Math.floor(l));return st(o[w],o[w+1],l-w)},at:(l,w,k)=>{const n=Math.min(s-2,Math.floor(l)),p=Math.min(q-2,Math.floor(w)),u=l-n,a=w-p,d=(n*q+p)*3,S=d+3,N=d+q*3,D=N+3,b=(1-u)*(1-a),_=(1-u)*a,B=u*(1-a),A=u*a;for(let L=0;L<3;L++)k[L]=i[d+L]*b+i[S+L]*_+i[N+L]*B+i[D+L]*A,k[3+L]=M[d+L]*b+M[S+L]*_+M[N+L]*B+M[D+L]*A;const W=Math.hypot(k[3],k[4],k[5])||1;return k[3]/=W,k[4]/=W,k[5]/=W,k},D:new Float32Array(s*q),B:null,B2:null}}async function ra(t,r,f,o,C,y,v){const s=[],i={};for(const[M,m,g,x,c,l=1]of y){let w=0;for(let k=0;k<g*40&&w<g;k++){(k&31)===31&&await t.yield?.();const n=M+(m-M)*Math.pow(o(),x),p=f.ringOf(n),u=o()*(q-1),a=u/(q-1);f.at(p,u,s),r.axis(n,i);const d=s[1]-i.y;if(d<.5||n>tt-8&&n<tt+10&&o()<.4*(1-Math.abs(n-tt-1)/9))continue;const S=Math.sin(Math.PI*a),N=V(-.08,.42,C.fbm3(s[0]*.085+11,s[1]*.12,s[2]*.085,3)),D=Math.pow(1-Math.abs(C.n3(s[0]*.05+40,3.1,s[2]*.05)),7),b=V(-.32,-.08,C.n3(s[0]*.035+80,s[1]*.05,s[2]*.035)),_=Math.exp(-(((a-.5-.05*C.n2(n*.11,3.3))/.05)**2)),B=(c+N*N*.9+D*.55)*Math.max(b,c)*(.22+.78*Math.pow(S,1.5))+_*.95*(.35+.65*N)*(.4+.6*b);if(o()*1.6>B)continue;const A=o(),W=(.02+.028*A*A+(o()<.04?.03:0))*l,L=d<2.7&&S<.75&&C.n2(n*.12,a*6+50)>-.1?1:0;v.add(s[0]+s[3]*.05,s[1]+s[4]*.05,s[2]+s[5]*.05,W,o(),nt(o.gauss()*.45,-1,1),L,n),f.D[Math.round(p)*q+Math.round(u)]+=W*W*800,w++}}}async function Fa(t,r){const{NR:f,P:o,D:C,sl:y}=r,v=f*q,s=new Float32Array(f),i=new Int32Array(f),M=new Int32Array(f);for(let n=0;n<f;n++){const p=Math.max(.3,Math.abs(y[Math.min(f-1,n+1)]-y[Math.max(0,n-1)])*.5),u=(n*q+20)*3,a=u+3,d=Math.max(.12,Math.hypot(o[a]-o[u],o[a+1]-o[u+1],o[a+2]-o[u+2]));s[n]=p*d,i[n]=nt(Math.round(1.1/p),1,3),M[n]=nt(Math.round(1.1/d),1,6)}const m=new Float32Array(v),g=new Float32Array(v);for(let n=0;n<f;n++)for(let p=0;p<q;p++)m[n*q+p]=C[n*q+p]/s[n];const x=async(n,p,u)=>{for(let a=0;a<f;a++){const d=i[a]*u;for(let S=0;S<q;S++){let N=0,D=0;for(let b=-d;b<=d;b++){const _=a+b;if(_<0||_>=f)continue;const B=d+1-Math.abs(b);N+=n[_*q+S]*B,D+=B}g[a*q+S]=N/D}(a&31)===31&&await t.yield?.()}for(let a=0;a<f;a++){const d=M[a]*u;for(let S=0;S<q;S++){let N=0,D=0;for(let b=-d;b<=d;b++){const _=S+b;if(_<0||_>=q)continue;const B=d+1-Math.abs(b);N+=g[a*q+_]*B,D+=B}p[a*q+S]=N/D}(a&31)===31&&await t.yield?.()}},c=new Float32Array(v),l=new Float32Array(v),w=new Float32Array(v);await x(m,c,1),await x(c,l,3),await x(l,w,7),r.B=c,r.B2=l,r.B3=w,await t.yield?.();const k=Array.from(c).filter(n=>n>1e-4).sort((n,p)=>n-p);r.norm=.16/Math.max(.001,k[Math.floor(k.length*.93)]||1)}function de(t,r,f,o){const{NR:C,P:y,N:v,B:s,B2:i}=t,M=Math.max(0,r-1),m=Math.min(C-1,r+1),g=Math.max(0,f-1),x=Math.min(q-1,f+1),c=(r*q+f)*3,l=r*q+f,w=s[l],k=(m*q+f)*3,n=(M*q+f)*3,p=(r*q+x)*3,u=(r*q+g)*3;let a=y[k]-y[n],d=y[k+1]-y[n+1],S=y[k+2]-y[n+2],N=Math.hypot(a,d,S)||1;a/=N,d/=N,S/=N;let D=y[p]-y[u],b=y[p+1]-y[u+1],_=y[p+2]-y[u+2];N=Math.hypot(D,b,_)||1,D/=N,b/=N,_/=N;const B=V(J-14,J+8,t.sl[r]),A=B>0?et=>s[et]*(1-B)+i[et]*B:et=>s[et],W=nt((A(m*q+f)-A(M*q+f))/(w+.25),-1,1)*1.1,L=nt((A(r*q+x)-A(r*q+g))/(w+.25),-1,1)*1.1;let H=v[c]*.5+a*W+D*L,Y=v[c+1]*.5+d*W+b*L,U=v[c+2]*.5+S*W+_*L;N=Math.hypot(H,Y,U)||1,o[0]=H/N,o[1]=Y/N,o[2]=U/N;const X=.075*V(tt-16,tt+8,t.sl[r])*(1-.45*V(J,J+50,t.sl[r]));return o[3]=Math.min(.5,Math.max(X,(w*.5*(1-B)+i[l]*(.5+.5*B)+t.B3[l]*.8)*t.norm*(1+.5*V(te+8,te+26,t.sl[r])+1.2*V(tt-12,tt+6,t.sl[r])))),o}async function la(t,r,f,o,C,y){const{P:v,N:s,sl:i}=o,M=[0,0,0,0],m={},g=r.count;for(let x=C;x<=y;x++){const c=Math.min(i[x],Z);f.axis(c,m);const l=x>o.iM?1:Math.exp(-(Z-c)/55)*V(f.k3-12,f.k3+22,c),w=Ua(c);for(let k=0;k<q;k++){const n=(x*q+k)*3;de(o,x,k,M);const p=V(0,.55,v[n+1]-m.y);r.v(v[n],v[n+1],v[n+2],s[n],s[n+1],s[n+2],M[0],M[1],M[2],M[3]*(.25+.75*p),l*(.35+.65*p),w)}(x&3)===3&&await t.yield?.()}await t.yield?.();for(let x=0;x<y-C;x++)for(let c=0;c<q-1;c++){const l=g+x*q+c,w=l+q,k=l+1,n=w+1;r.tri(l,k,w),r.tri(w,k,n)}}function _e(t,r,f,o,C,y,v,s,i,M=5,m=5,g=1.5,x=.06){const c=r()*ht,l=r.gauss()*x,w=r.gauss()*x,k=r()*ht,n=t.count;for(let a=0;a<m;a++){const d=a/m,S=v*(Math.pow(1-d,g)*(1+.18*Math.sin(d*9+k))+.75*Math.exp(-d*9))+.004,N=f+l*y*d*d,D=o+.15-(y+.15)*d,b=C+w*y*d*d;for(let _=0;_<M;_++){const B=c+_/M*ht+d*.6,A=Math.cos(B),W=Math.sin(B),L=S*(1+.14*Math.sin(_*2.4+k));t.v(N+A*L,D,b+W*L,A*.94,-.3,W*.94,A*.22,.42,W*.22,s*Math.pow(1-.85*d,1.6),i)}}const p=t.v(f+l*y,o-y,C+w*y,0,-1,0,0,.48,0,s*.05,i);for(let a=0;a<m-1;a++)for(let d=0;d<M;d++){const S=n+a*M+d,N=n+a*M+(d+1)%M,D=S+M,b=N+M;t.tri(S,N,D),t.tri(N,b,D)}const u=n+(m-1)*M;for(let a=0;a<M;a++)t.tri(u+a,u+(a+1)%M,p);return[f+l*y,o-y,C+w*y]}function Qe(t,r,f,o,C,y,v,s=5,i=.1,M=0,m=.8){const g=r.length;for(let x=-1;x<=1;x+=2){const c=t.count;for(let l=0;l<g;l++)for(let w=0;w<=s;w++){const k=w/s,n=Math.sin(l*1.9+M+k*1.3)*i*k+x*(.05*(1-k)+.012),p=r[l],u=Array.isArray(o)?o[l]:o,a=Array.isArray(C)?C[l]:C;t.v(p[0]+u*n,p[1]+.12-(f[l]+.12)*k,p[2]+a*n,u*x,-.15,a*x,u*x*.2,.45,a*x*.2,y*Math.pow(1-m*k,1.4),v)}for(let l=0;l<g-1;l++)for(let w=0;w<s;w++){const k=c+l*(s+1)+w,n=k+s+1,p=k+1,u=n+1;x>0?(t.tri(k,n,p),t.tri(n,u,p)):(t.tri(k,p,n),t.tri(n,p,u))}}}async function g0(t,r,f,o,C,y,v,s){const i=[],M=[0,0,0,0],m={},g=[];let x=-1;const c=[[Jt+3,tt-2,600,0],[tt-2,J,110,1],[J,Z-6,30,2]];for(const[k,n,p,u]of c){const a=u===0?C:y;let d=0;for(let S=0;S<p*30&&d<p;S++){(S&127)===127&&await t.yield?.();const N=a.range(k,n),D=o.ringOf(N),b=a.range(.14,.86)*(q-1);if(o.at(D,b,i),i[4]>-.45)continue;const _=v.fbm3(i[0]*.12+200,0,i[2]*.12,2);if(a()>(V(-.25,.35,_)*.6+.08)*(.35+Math.min(1,(o.B2f||o.B2)[Math.round(D)*q+Math.round(b)]*o.norm*5)))continue;f.axis(N,m);const B=(i[0]-m.x)*m.rx+(i[2]-m.z)*m.rz-f.camX(N),A=i[1]-m.y;if(Math.hypot(i[0],i[2])<2.6)continue;const W=Math.abs(B)<2.4?2.6:1.1;let L=u===0?(.25+1.9*Math.pow(a(),2.2))*(s==="straws"?1.25:1):.1+.3*a();if(L=Math.min(L,A-W),L<.1)continue;const H=s==="straws"?a()<.75:a()<.3,Y=H?.035+.03*a():(.07+.11*a())*(.6+.4*Math.min(1.5,L));de(o,Math.round(D),Math.round(b),M);const U=Math.exp(-(Z-N)/55)*.8,X=_e(r[u],a,i[0],i[1],i[2],L,Y,M[3]*.85+.02,U,5,H?4:5,H?.8:1.5);u===0&&N>2&&N<tt-6&&Math.abs(B)<8&&L>.3&&g.push([X[0],X[1],X[2],X[1]-m.y]),d++,u===0&&d===240&&(x=r[0].idx.length)}u===0&&x<0&&(x=r[0].idx.length)}await t.yield?.();const l=C,w=s==="draperies"?16:8;for(let k=0;k<w;k++){const n=l.range(-12,tt-8),p=o.ringOf(n),u=l.range(.2,.62)*(q-1),a=l.range(4,8),d=l.range(-3,3);if(Math.abs(n-te)<6)continue;const S=[],N=[],D=13;let b=!0;const _=l.range(.6,1.8);for(let L=0;L<D;L++){const H=L/(D-1);o.at(nt(p+d*H,0,o.iG-1),u+a*H,i),f.axis(n,m);const Y=(i[0]-m.x)*m.rx+(i[2]-m.z)*m.rz-f.camX(n),U=Math.min(_*(.3+.7*Math.sin(Math.PI*H))*(1+.3*Math.sin(H*17+k)),i[1]-m.y-(Math.abs(Y)<2.6?2.7:1.2));U<.12&&(b=!1),S.push([i[0],i[1],i[2]]),N.push(U)}if(!b)continue;const B=S[D-1][0]-S[0][0],A=S[D-1][2]-S[0][2],W=Math.hypot(B,A)||1;de(o,Math.round(p),Math.round(u+a*.5),M),Qe(r[0],S,N,A/W,-B/W,M[3]*.8+.02,0,5,.12,k*1.7)}return{tips:g,mirrorCut:x}}async function y0(t,r,f,o,C){const y=[],v=[0,0,0,0],s={};for(const[i,M,m,g]of[[tt+3,dt+3,30,1],[mt-9,J,30,1],[J,Z-44,36,2]]){let x=0;for(let c=0;c<m*30&&x<m;c++){(c&63)===63&&await t.yield?.();const l=C.range(i,M),w=o.ringOf(l),k=C()<.62,n=k?C()<.5?C.range(.15,.33):C.range(.67,.85):C.range(.3,.7);if(o.at(w,n*(q-1),y),y[4]>-.4)continue;f.axis(l,s);const p=(y[0]-s.x)*s.rx+(y[2]-s.z)*s.rz-f.camX(l),u=y[1]-s.y,a=Math.abs(p)<2.7?2.62:1.3;let d=.2+(k?1.15:.6)*Math.pow(C(),1.6);if(d=Math.min(d,u-a),d<.15)continue;const S=(.05+.07*C())*(.7+.5*Math.min(1.2,d));de(o,Math.round(w),Math.round(n*(q-1)),v),_e(r[g],C,y[0],y[1],y[2],d,S,v[3]*.5+.01,Math.exp(-(Z-l)/55)*.8,4,4,1.4,.05),x++}}}function Sa(){const t=[],r=[],f=[],o=[],C=[];return{pos:t,nrm:r,lit:f,col:o,idx:C,wl:null,get count(){return t.length/3},async geometry(y){const v=new F.BufferGeometry;return v.setAttribute("position",new F.BufferAttribute(new Float32Array(t),3)),await y.yield?.(),v.setAttribute("normal",new F.BufferAttribute(new Float32Array(r),3)),await y.yield?.(),v.setAttribute("aLit",new F.BufferAttribute(new Float32Array(f),4)),await y.yield?.(),v.setAttribute("aCol",new F.BufferAttribute(new Float32Array(o),4)),await y.yield?.(),v.setAttribute("aWl",new F.BufferAttribute(this.wl&&this.wl.length===t.length/3*4?this.wl:new Float32Array(t.length/3*4),4)),await y.yield?.(),v.setIndex(new F.BufferAttribute(t.length/3>65535?new Uint32Array(C):new Uint16Array(C),1)),await y.yield?.(),v.computeBoundingSphere(),await y.yield?.(),v.computeBoundingBox(),v}}}function ha(t,r,f,o,C,y,v,s=1,i=0){let M,m,g,x;const c=y>8?.035:.075;s>0?(M=t()*ht,m=t()*ht,g=t.gauss()*c,x=t.gauss()*c):(M=t()*ht,g=t.gauss()*.01,x=t.gauss()*.01,m=t()*ht);const l=i||nt(Math.round(y/.95)+1,2,6),w=[],k=[];let n=0;for(let S=0;S<l;S++){const N=(1.3-.5*S/l)*r.range(.5,1.6);k.push(N),n+=N}const p=s>0?Math.min(.2*y,v*.95):.26*y,u=y-p;let a=0,d=v*(s>0?1.12:1);for(let S=0;S<l;S++){const N=u*k[S]/n,D=d*r.range(.72,.9);w.push({y0:a,y1:a+N,C0:d,C1:D,ph:r()*ht,nfl:3+Math.floor(r()*4),nk:s>0?r.range(.86,.98):r.range(.72,.94),pw:s>0?r.range(.7,1.15):r.range(.4,.8)}),a+=N,d=D}return{bx:f,by:o,bz:C,hgt:y,r0:v,dir:s,a0:M,wob:m,lx:g,lz:x,tiers:w,sides:v>1?20:v>.55?14:v>.3?12:9,capH:p,topR:d,broken:s>0&&r()<.3,tilt:r()*ht,nfine:nt(Math.round(ht*v/.15),7,34)}}function ca(t,r,f,o){const{bx:C,by:y,bz:v,hgt:s,dir:i,sides:M,tiers:m}=r,g=M+1,x=[],c=[0,.1,.34,.66,.86,.94];for(let A=0;A<m.length;A++){const W=m[A],L=W.nk*W.C1,H=W.y1-W.y0;for(const Y of c){if(Y>.9){x.push([st(W.y0,W.y1,Y),L+(W.C1-L)*.42,.4,.04,0,A+Y,W]);continue}const U=Y/.86,X=Y===0?A?.9:.55:Y>.8?.5:.78+.22*V(0,.5,Y);x.push([st(W.y0,W.y1,Y),L+(W.C0-L)*Math.pow(Math.max(0,1-U*U),W.pw),X,st(.12,.03,U),A&&Y<.2?H*(Y===0?.17:.07):0,A+Y,W])}}const l=m[m.length-1],w=l.y1,k=r.topR,n=m.length,p=r.capH;x.push([w,k,.9,.09,p*.12,n,l]),i<0?x.push([w+p*.4,k*.66,.85,.05,0,n+.4,l],[w+p*.75,k*.32,.8,.02,0,n+.75,l],[w+p*.95,k*.08,.8,0,0,n+.95,l]):r.broken?x.push([w+p*.45,k*.92,.95,.05,0,n+.4,l],[w+p*.55,k*.7,.8,.02,0,n+.6,l],[w+p*.5,k*.12,.7,0,0,n+.9,l]):x.push([w+p*.5,k*.87,.95,.05,0,n+.4,l],[w+p*.86,k*.5,1,.02,0,n+.8,l],[w+p*.985,k*.12,1,0,0,n+.95,l]);const u=x.length,a=new Float32Array(u*g*3),d=t.count;for(let A=0;A<u;A++){const[W,L,,H,Y,,U]=x[A],X=W/s,et=r.broken&&A>=u-3?1:0;for(let bt=0;bt<g;bt++){const ft=r.a0+bt%M/M*ht,Ct=Math.cos(ft*U.nfl+U.ph+1.7*Math.sin(ft+r.wob)),Q=L*(1+H*Ct+.05*Math.cos(ft*2+r.wob))+.012,St=(A*g+bt)*3;a[St]=C+r.lx*s*X*X+Math.cos(ft)*Q,a[St+2]=v+r.lz*s*X*X+Math.sin(ft)*Q,a[St+1]=y+i*W-Y*Math.max(Ct,0)+et*Math.cos(ft-r.tilt)*k*.35}}for(let A=0;A<u;A++)for(let W=0;W<g;W++){const L=Math.max(A-1,0),H=Math.min(A+1,u-1),Y=(W%M-1+M)%M,U=(W%M+1)%M,X=(A*g+U)*3,et=(A*g+Y)*3,bt=(H*g+W)*3,ft=(L*g+W)*3,Ct=(A*g+W)*3,Q=a[X]-a[et],St=a[X+1]-a[et+1],Rt=a[X+2]-a[et+2],Nt=a[bt]-a[ft],Ht=a[bt+1]-a[ft+1],It=a[bt+2]-a[ft+2];let Kt=(Ht*Rt-It*St)*i,R=(It*Q-Nt*Rt)*i,Ut=(Nt*St-Ht*Q)*i;const ee=Math.hypot(Kt,R,Ut)||1;t.pos.push(a[Ct],a[Ct+1],a[Ct+2]),t.nrm.push(Kt/ee,R/ee,Ut/ee),t.lit.push(f[0],f[1],f[2],f[3]),t.col.push(W/M*r.nfine+Math.floor(x[A][5])*.37,x[A][5],x[A][2]*o(a[Ct],a[Ct+1],a[Ct+2],r),0)}for(let A=0;A<u-1;A++)for(let W=0;W<M;W++){const L=d+A*g+W,H=L+1,Y=L+g,U=Y+1;t.idx.push(L,Y,H,H,Y,U)}const S=(w+p*(i<0?1:r.broken?.42:1))/s,N=C+r.lx*s*S*S,D=v+r.lz*s*S*S,b=y+i*S*s,_=t.count;t.pos.push(N,b,D),t.nrm.push(0,i,0),t.lit.push(f[0],f[1],f[2],f[3]),t.col.push(.5*r.nfine,n+1,(i<0?.8:1)*o(N,b,D,r),0);const B=d+(u-1)*g;for(let A=0;A<M;A++)t.idx.push(B+A,_,B+A+1)}function x0(t,r,f,o,C,y,v,s,i){const g=t.count,x=C*.55;t.pos.push(f,y,o),t.nrm.push(0,1,0),t.lit.push(s[0],s[1],s[2],s[3]),t.col.push(0,0,.56*i(f,y,o,null),0);for(let c=1;c<=6;c++)for(let l=0;l<18;l++){const w=c/6,k=l/18*ht,n=1+.22*Math.sin(k*3+v)+.1*Math.sin(k*7-v),p=x*w*n,u=f+Math.cos(k)*p,a=o+Math.sin(k)*p,d=Math.max(0,y*Math.pow(1-w*w,.8)+.16*r.n2(u*.9,a*.9)*(1-w)*w),S=Math.hypot(.8*w,1-.5*w);t.pos.push(u,d,a),t.nrm.push(Math.cos(k)*.8*w/S,(1-.5*w)/S,Math.sin(k)*.8*w/S),t.lit.push(s[0],s[1],s[2],s[3]),t.col.push(0,w,(.2+.36*V(0,.5,d))*i(u,d,a,null),0)}for(let c=0;c<18;c++)t.idx.push(g,g+1+(c+1)%18,g+1+c);for(let c=0;c<5;c++)for(let l=0;l<18;l++){const w=g+1+c*18+l,k=g+1+c*18+(l+1)%18,n=w+18,p=k+18;t.idx.push(w,k,n,k,p,n)}}function M0(t,r,f,o,C,y,v,s,i=3){const m=[[1,-.08,.3,0,0]];for(let n=0;n<i;n++){const p=1-.2*n,u=.075+.115*n;m.push([p-.03,u-.05,.7,.25,n],[p-.075,u-.012,1,.85,n],[p-.1,u,1,1,n],[p-.135,u-.04,.3,0,n],[p-.185,u-.034,.26,0,n])}const g=m.length,x=.075+.115*(i-1),c=new Float32Array(g*72*3),l=t.count;for(let n=0;n<g;n++)for(let p=0;p<72;p++){const u=p/72*ht,a=m[n][4],d=1+.22*Math.sin(u*2+y+a*1.3)+.13*Math.sin(u*5-y*1.7+a*2.1)+.06*Math.sin(u*11+y+a),S=(n*72+p)*3,N=Math.pow(Math.abs(Math.sin(u*(3.5+a)+y*2.3+a*1.9)),.7),D=n===0?0:a===0?.075:.12,b=C*m[n][0]*d*(1+D*(N-.62));c[S]=f+Math.cos(u)*b,c[S+2]=o+Math.sin(u)*b,c[S+1]=m[n][1]+(n>0?.025*r.n2(c[S]*1.3,c[S+2]*1.3)+.012*Math.sin(u*9+a*2+y)-.035*(1-N)*m[n][3]:0)}for(let n=0;n<g;n++)for(let p=0;p<72;p++){const u=Math.max(n-1,0),a=Math.min(n+1,g-1),d=(p-1+72)%72,S=(p+1)%72,N=(n*72+S)*3,D=(n*72+d)*3,b=(a*72+p)*3,_=(u*72+p)*3,B=(n*72+p)*3,A=c[N]-c[D],W=c[N+1]-c[D+1],L=c[N+2]-c[D+2],H=c[b]-c[_],Y=c[b+1]-c[_+1],U=c[b+2]-c[_+2];let X=Y*L-U*W,et=U*A-H*L,bt=H*W-Y*A;const ft=Math.hypot(X,et,bt)||1;et<0&&(X=-X,et=-et,bt=-bt),t.pos.push(c[B],c[B+1],c[B+2]),t.nrm.push(X/ft,et/ft,bt/ft),t.lit.push(v[0],v[1],v[2],v[3]),t.col.push(p/72*22+n*.37,m[n][3],m[n][2]*(.5+.5*s(c[B],c[B+1]+.3,c[B+2],null)),1)}for(let n=0;n<g-1;n++)for(let p=0;p<72;p++){const u=l+n*72+p,a=l+n*72+(p+1)%72,d=u+72,S=a+72;t.idx.push(u,a,d,a,S,d)}const w=t.count;t.pos.push(f,x-.04,o),t.nrm.push(0,1,0),t.lit.push(v[0],v[1],v[2],v[3]),t.col.push(0,0,.3*s(f,x+.3,o,null),1);const k=l+(g-1)*72;for(let n=0;n<72;n++)t.idx.push(k+n,k+(n+1)%72,w)}function fa(t,r,f,o=.03){const C=nt(r,0,t.hgt*.99),y=t.tiers.length;let v=-1;for(let m=0;m<y&&v<0;m++){const g=t.tiers[m];if(C>g.y1)continue;const x=g.nk*g.C1,c=Math.min(1,(C-g.y0)/Math.max(.001,g.y1-g.y0)/.86);v=x+(g.C0-x)*Math.pow(Math.max(0,1-c*c),g.pw)}if(v<0){const m=nt((C-t.tiers[y-1].y1)/Math.max(.001,t.capH),0,1);v=t.topR*(1-.82*m*m)}const s=C/t.hgt,i=Math.cos(f),M=Math.sin(f);return[t.bx+t.lx*t.hgt*s*s+i*(v+o),t.by+t.dir*C,t.bz+t.lz*t.hgt*s*s+M*(v+o),i,M]}async function Ba(t,r,f,o,C){const y=r.wl,v=1.15,s=v*v,i=C.length;if(!i)return;let M=1e9,m=-1e9,g=1e9,x=-1e9;for(const c of C)M=Math.min(M,c[0]),m=Math.max(m,c[0]),g=Math.min(g,c[2]),x=Math.max(x,c[2]);for(let c=f;c<o;c++){(c-f&63)===63&&await t.yield?.();const l=r.pos[c*3],w=r.pos[c*3+1],k=r.pos[c*3+2];if(l<M-v||l>m+v||k<g-v||k>x+v)continue;let n=0,p=0,u=0,a=0,d=0;for(let _=0;_<i;_++){const B=C[_],A=B[0]-l;if(A>v||A<-v)continue;const W=B[1]-w,L=B[2]-k,H=A*A+W*W+L*L;if(H>s)continue;const Y=1-H/s,U=B[3]/.06,X=U*U*(.04/(H+.04))*Y*Y,et=Math.sqrt(H)+.06;n+=A/et*X,p+=W/et*X,u+=L/et*X,a+=X,d+=X*nt(B[4]*.42+.5,0,1)}if(a<1e-4)continue;const S=1.15*a/(a+.75)/a,N=c*4,D=Math.hypot(n,p,u)||1,b=a*S/D;y[N]+=n*b,y[N+1]+=p*b,y[N+2]+=u*b,y[N+3]=d/a}}async function b0(t,r,f,o,C,y,v,s,i,M){const m={},g=[],x=[0,0,0,0],c=[],l=[],w=[],k=[],n=[],p=[],u=[],a=":"+(t.seed??0),d=(K,j)=>(C.axis(K,m),[m.x+m.rx*j,m.z+m.rz*j]),S=(K,j)=>{const vt=C.width(K),pt=Math.sign(j)*Math.pow(Math.min(.999,Math.abs(j)/vt),1/.75);return y.at(y.ringOf(K),Math.acos(pt)/Math.PI*(q-1),g)},N=async(K,j,vt,pt,kt,Et=1,wt={})=>{const rt=wt.fb||f,zt=wt.rs||v,Pt=wt.rd||s,[Lt,gt]=d(K,j),yt=zt()*ht,ct=[],at=vt*.55,it=rt.count,lt=(At,Qt)=>{const Xt=Math.hypot(At-Lt,Qt-gt)/at;return Xt<1?Math.max(0,pt*Math.pow(1-Xt*Xt,.8)-.04):0};let Wt=0;for(const[At,Qt,Xt,Yt]of kt){const le=Lt+Math.cos(Qt)*vt*At,jt=gt+Math.sin(Qt)*vt*At,oe=pt*Math.pow(Math.max(0,1-At/.55*(At/.55)),.8)-.05;ct.push(ha(zt,Pt,le,Math.max(oe,0),jt,Xt,Yt,1,Xt>8?8:0)),Wt=Math.max(Wt,oe+Xt)}let xt=M(Lt,2,gt,K,j);if(wt.lt){C.axis(K,m);const At=Math.cos(24*se)/Math.hypot(wt.lt[0],wt.lt[1]);xt=[(m.dx*wt.lt[0]+m.rx*wt.lt[1])*At,Math.sin(24*se),(m.dz*wt.lt[0]+m.rz*wt.lt[1])*At,wt.lt[2]]}const ae=Math.max(xt[0]*xt[0]+xt[2]*xt[2],1e-4),ie=(At,Qt,Xt,Yt)=>{let le=1;for(const jt of ct){if(jt===Yt)continue;const oe=jt.bx-At,me=jt.bz-Xt,Zt=(oe*xt[0]+me*xt[2])/ae;if(Zt<.05)continue;const re=Qt+xt[1]*Zt-jt.by;if(re>jt.hgt||re<-.5)continue;const $t=jt.r0*(1.08-.78*nt(re/jt.hgt,0,1)),Be=Math.hypot(oe-xt[0]*Zt,me-xt[2]*Zt);le=Math.min(le,.1+.9*V($t*.55,$t*1.5,Be))}return le};x0(rt,i,Lt,gt,vt,pt,yt,xt,ie),wt.bank&&M0(rt,i,Lt,gt,vt*(wt.bw??wt.bank),yt,xt,ie,wt.steps??3),await t.yield?.();for(let At=0;At<ct.length;At++)ca(rt,ct[At],[xt[0],xt[1],xt[2],xt[3]*Pt.range(.88,1.1)],ie),await t.yield?.();await t.yield?.();for(const At of ct)if(!(At.r0<.3)){for(let Qt=0,Xt=Math.round(Et*(1+1.6*Pt()));Qt<Xt;Qt++){const Yt=Pt()*ht,le=At.r0*Pt.range(1.25,1.9),jt=At.bx+Math.cos(Yt)*le,oe=At.bz+Math.sin(Yt)*le;let me=!0;for(const re of ct)re!==At&&Math.hypot(re.bx-jt,re.bz-oe)<re.r0*1.15&&(me=!1);const Zt=ha(Pt,Pt,jt,lt(jt,oe),oe,Pt.range(.28,.75)*Math.min(1.3,.6+At.r0),Pt.range(.1,.19),1,2);me&&ca(rt,Zt,[xt[0],xt[1],xt[2],xt[3]*.95],ie)}await t.yield?.()}return c.push({x:Lt,z:gt,R:wt.bank?vt*wt.bank:vt,Rb:wt.bank?vt*(wt.bw??wt.bank):vt,top:Wt,s:K,lat:j,cols:ct,li:xt,ph:yt,FB:rt,v0:it,v1:rt.count,i1:rt.idx.length,wl:[]}),c[c.length-1]},D=(K,j,vt,pt,kt)=>{const Et=(rt,zt,Pt,Lt,gt)=>{l.push([rt,zt,Pt,Lt,pt,gt]),K.wl.push([rt,zt,Pt,Lt,gt])};K.cols.slice().sort((rt,zt)=>zt.hgt-rt.hgt).forEach((rt,zt)=>{const Pt=zt<vt,Lt=j()*ht;for(let gt=0,yt=Pt?7+Math.floor(j()*7):2+Math.floor(j()*4);gt<yt;gt++){const ct=fa(rt,rt.hgt*(1-.17*j()*j())-.02,j()*ht);Et(ct[0],ct[1],ct[2],.03+.034*j()*j(),-.5-1*j())}if(Pt){for(let gt=1;gt<rt.tiers.length;gt++){const yt=rt.tiers[gt];for(let ct=0,at=3+Math.floor(j()*4);ct<at;ct++){const it=fa(rt,yt.y0+.03,j()*ht),lt=it[1]-.04-.08*j(),Wt=j();if(Et(it[0],lt,it[2],.04+.05*j()*j(),-.3-1*j()),Wt<.62){const xt=Math.min(j.range(.25,.8),lt-.35);xt>.2&&p.push([it[0]+it[3]*.03,lt-.01,it[2]+it[4]*.03,xt,j(),.006+.012*j(),0])}else kt&&Wt<.86&&lt>1.6&&k.push([it[0]+it[3]*.05,lt,it[2]+it[4]*.05,Math.min(j.range(.9,2.6),lt-.45),.012+.02*j(),pt])}}for(let gt=0,yt=1+Math.floor(j()*2.5);gt<yt;gt++){const ct=Lt+gt*2.3+j(),at=rt.hgt*j.range(.72,.96),it=rt.hgt*j.range(.06,.3);for(let lt=at;lt>it;lt-=.1+.2*j()){const Wt=.026+.03*j()*j(),xt=.9+.8*j();if(Math.sin(lt*2.3+ct*5)>.6)continue;const ae=fa(rt,lt,ct+.13*Math.sin(lt*1.7+gt));Et(ae[0],ae[1],ae[2],Wt,xt)}}}})},b=mt-25,_=[[.12,v()*ht,6.9,.95]];for(let K=0;K<13;K++)_.push([.22+.7*Math.sqrt((K+v())/13),K*2.4+v(),1.3+3.9*Math.pow(v(),1.3),.36+.38*v()]);const B=await N(b,8.2,4.4,1.25,_,1,{bank:1.3,bw:1.12,lt:[-.3,-1,.52]});await t.yield?.();{const K=S(b,8.2),j=B.x+.3,vt=B.z+.2,pt=K[1]+.15,kt=Math.max(2,K[1]-B.top-1.1)+.15,Et=B.li,wt=ha(v,s,j,pt,vt,kt,.62,-1,4),rt=f.count,zt=[];ca(f,wt,[Et[0],.12,Et[2],Et[3]*.85],()=>1),B.pend={v0:rt,v1:f.count,wl:zt};const Pt=yt=>.62*(1-.72*yt)*.92+.03;for(let yt=0;yt<30;yt++){const ct=s.range(.08,.95),at=s()*ht,it=Pt(ct),lt=[j+Math.cos(at)*it,pt-ct*kt,vt+Math.sin(at)*it,.03+.03*s()*s()];l.push(lt),zt.push([lt[0],lt[1],lt[2],lt[3]*1.4,-.6])}for(let yt=0;yt<12;yt++){const ct=s.range(.3,.97),at=s()*ht,it=Pt(ct)+.03,lt=pt-ct*kt,Wt=Math.min(s.range(1.3,3.8),lt-(B.top-.9));Wt>.5&&k.push([j+Math.cos(at)*it,lt,vt+Math.sin(at)*it,Wt,.02+.03*s()])}const Lt=B.cols[0];for(let yt=1;yt<Lt.tiers.length;yt++)for(let ct=0,at=2+Math.floor(s()*3);ct<at;ct++){const it=Lt.tiers[yt],lt=s()*ht,Wt=it.y0/Lt.hgt,xt=it.C0*.98+.02,ae=Lt.bx+Lt.lx*Lt.hgt*Wt*Wt+Math.cos(lt)*xt,ie=Lt.bz+Lt.lz*Lt.hgt*Wt*Wt+Math.sin(lt)*xt,At=Lt.by+it.y0-.2*(it.y1-it.y0)*.5,Qt=.03+.025*s();l.push([ae,At,ie,Qt]),B.wl.push([ae,At,ie,Qt*1.3,-.5]),n.push([ae,At-.02,ie,s.range(.14,.34),s(),s.range(.1,.2)])}const gt=Vt("false-stars-organ-colony"+a);D(B,gt,6,b,!0);for(let yt=0;yt<44;yt++){const ct=gt.range(.05,.96),at=gt()*ht,it=Pt(ct)+.02,lt=[j+Math.cos(at)*it,pt-ct*kt,vt+Math.sin(at)*it,.04+.045*gt()*gt(),b,yt%3?-.4-gt():1.2];l.push(lt),zt.push([lt[0],lt[1],lt[2],lt[3],lt[5]])}for(let yt=0;yt<12;yt++){const ct=gt.range(.25,.97),at=gt()*ht,it=Pt(ct)+.04,lt=pt-ct*kt,Wt=Math.min(gt.range(1,3.4),lt-(B.top-.9));Wt>.5&&k.push([j+Math.cos(at)*it,lt,vt+Math.sin(at)*it,Wt,.02+.03*gt()])}}await t.yield?.();const A=Vt("false-stars-organ-tomo"+a),W=Vt("false-stars-organ-tomo-d"+a),L=[[.08,A()*ht,9.4+.9*A(),1.18]];for(let K=0;K<6;K++)L.push([.27+.2*A(),K*(ht/6)+A()*.7,4.4+3.8*A(),.6+.3*A()]);for(let K=0;K<10;K++)L.push([.5+.42*Math.sqrt((K+A())/10),K*2.4+A(),1.4+3.4*Math.pow(A(),1.3),.34+.3*A()]);const H=await N(ve[0],ve[1],5.8,1.5,L,.55,{rs:A,rd:W,bank:1.24,bw:1.08,lt:[.15,-1,.55]});D(H,A,8,ve[0],!0),await t.yield?.();const Y=S(ve[0],ve[1]-1.9),U=[Y[0],Y[1]-.3,Y[2]],X={hole:U},et=Vt("false-stars-rank-door"+a),bt=Vt("false-stars-rank-door-d"+a),ft=[[.1,et()*ht,7+.9*et(),.8]];for(let K=0;K<9;K++)ft.push([.24+.68*Math.sqrt((K+et())/9),K*2.4+et(),1.3+4.2*Math.pow(et(),1.25),.3+.34*et()]);const Ct=await N(Re[0],Re[1],3.9,1.1,ft,.6,{fb:o,rs:et,rd:bt,bank:1.3,bw:1.1,lt:[.42,.9,.5]});D(Ct,et,6,Re[0],!0),await t.yield?.();const Q=Vt("false-stars-rank-grotto"+a),St=Vt("false-stars-rank-grotto-d"+a),Rt=Math.max(2.6,S(we[0],we[1])[1]-1),Nt=[[.1,Q()*ht,Rt*(.9+.08*Q()),.58]];for(let K=0;K<7;K++)Nt.push([.26+.66*Math.sqrt((K+Q())/7),K*2.4+Q(),Math.min(Rt*.86,1.2+3.8*Math.pow(Q(),1.2)),.26+.26*Q()]);const Ht=await N(we[0],we[1],3.1,.8,Nt,.8,{fb:o,rs:Q,rd:St,bank:1.3,bw:1.1,lt:[.3,.95,.46]});D(Ht,Q,5,we[0],!1),await t.yield?.();const It=Vt("false-stars-rank-sphere"+a),Kt=Vt("false-stars-rank-sphere-d"+a),R=Math.max(2.2,S(Se[0],Se[1])[1]-.8),Ut=[[.1,It()*ht,Math.min(R*(.9+.08*It()),4.6),.46]];for(let K=0;K<6;K++)Ut.push([.28+.62*Math.sqrt((K+It())/6),K*2.4+It(),Math.min(R*.8,1+2.6*Math.pow(It(),1.2)),.22+.2*It()]);const ee=await N(Se[0],Se[1],2.2,.7,Ut,.7,{fb:o,rs:It,rd:Kt,bank:1.16,lt:[.95,.31,.5]});D(ee,It,4,Se[0],!1),await t.yield?.();for(let K=0;K<12;K++){const j=st(dt+14,mt-16,(K+v())/12),vt=K%2?1:-1,pt=vt*(C.width(j)-v.range(2.4,5.5)),kt=[[.1,v()*ht,1.2+2.4*v(),.34+.24*v()]];v()<.7&&kt.push([.6,v()*ht,.6+1.3*v(),.24+.12*v()]);const[Et,wt]=d(j,pt);let rt=Math.abs(pt-C.camX(j))>=6;for(const zt of c)Math.hypot(Et-zt.x,wt-zt.z)<zt.R+3.5&&(rt=!1);rt&&(await N(j,pt,v.range(1.1,1.9),.5,kt,.6,{bank:1.12,steps:1}),(K&3)===3&&await t.yield?.())}await t.yield?.();for(let K=0,j=0;j<3200&&K<96;j++){(j&63)===63&&await t.yield?.();const vt=v.range(dt+7,mt-9),pt=y.ringOf(vt),kt=v.range(.1,.9);if(y.at(pt,kt*(q-1),g),g[4]>-.35||Math.hypot(g[0]-U[0],g[2]-U[2])<5.2)continue;C.axis(vt,m);const Et=(g[0]-m.x)*m.rx+(g[2]-m.z)*m.rz-C.camX(vt),wt=g[1]-m.y;let rt=.7+4.6*Math.pow(v(),2);if(rt=Math.min(rt,wt-(Math.abs(Et)<3.4?3.6:2.2)),rt<.6)continue;let zt=!0;for(const Pt of c)Math.hypot(g[0]-Pt.x,g[2]-Pt.z)<Pt.R+.8&&g[1]-rt<Pt.top+1.2&&(zt=!1);zt&&(de(y,Math.round(pt),Math.round(kt*(q-1)),x),_e(r,v,g[0],g[1],g[2],rt,(.09+.1*v())*(.8+.45*Math.min(3,rt)),x[3]*.5+.012,0,rt>2?7:5,rt>2?7:5,1.25,.035),K++)}await t.yield?.();{const K=Vt("false-stars-halldrips"+a);for(const[j,vt]of[[H,5],[Ct,2],[B,3]])for(let pt=0;pt<vt&&u.length<$e;pt++){const kt=K()*ht,Et=j.R*(1.12+.3*K()),wt=j.x+Math.cos(kt)*Et,rt=j.z+Math.sin(kt)*Et,zt=Math.max(4,S(j.s,j.lat)[1]-K.range(.6,3));u.push([wt,zt,rt,zt,K.range(2.4,5.2),K()])}}f.wl=new Float32Array(f.count*4),o.wl=new Float32Array(o.count*4);for(const K of c)K.wl.length&&await Ba(t,K.FB,K.v0,K.v1,K.wl),await t.yield?.();return B.pend&&await Ba(t,f,B.pend.v0,B.pend.v1,B.pend.wl),{islands:c,organ:B,organT:H,rankD:Ct,rankG:Ht,rankS:ee,gap:X,lights:l,lightsG:w,threads:k,snares:n,shortT:p,hdrips:u}}async function k0(t,r,f,o,C,y,v,s){const i=[],M={};for(let m=0,g=0;g<s*40&&m<s;g++){(g&127)===127&&await t.yield?.();const x=o.range(-16,60),c=f.ringOf(x),l=o.range(.57,.988),w=l*(q-1);if(f.at(c,w,i),r.axis(x,M),i[1]-M.y<.3)continue;const n=V(-.12,.34,C.fbm3(i[0]*.15+71,i[1]*.2,i[2]*.15,3)),p=Math.pow(1-Math.abs(C.n3(i[0]*.07+5,i[1]*.42+9,i[2]*.07)),6),u=V(-16,-6,x)*(1-V(46,60,x));if(o()*1.25>(.05+n*n*.85+p*.7)*u)continue;const a=o(),d=.022+.03*a*a+(o()<.05?.03:0);y.add(i[0]+i[3]*.05,i[1]+i[4]*.05,i[2]+i[5]*.05,d,o(),nt(o.gauss()*.45,-1,1),0,x),v[Math.round(c)*q+Math.round(w)]+=d*d*800,m++}}function Ta(t,r,f,o,C){const y=t.fbm3(r*.075+71,f*.1+3,o*.075+13,2),v=V(-.2,.1,y),s=V(.12,.42,y),i=V(0,.5,1-Math.pow(1-Math.abs(t.n3(r*.042+9,5.7,o*.042+31)),6)),M=.5+.5*Math.sin(C*.19+1.3*t.n2(C*.03,23.7));let m=st(.2,1,v*i)*st(.7,1.1,M)*(1+.2*s);return m=Math.max(m,st(.72,.2,V(24,52,C))),m=st(m,Math.max(m,1),V(tt-14,tt-4,C)*(1-V(dt,dt+8,C))),st(m,1,V(mt-12,mt-2,C))}async function z0(t,r,f,o,C,y,v,s){const i=[],M={};for(let m=0,g=0;g<s*60&&m<s;g++){(g&127)===127&&await t.yield?.();const x=o.range(Jt+2,tt-4),c=f.ringOf(x),l=o.range(.04,.96),w=l*(q-1);if(f.at(c,w,i),r.axis(x,M),i[1]-M.y<.6)continue;const n=V(.1,.42,C.fbm3(i[0]*.075+71,i[1]*.1+3,i[2]*.075+13,2)),p=V(-.25,.3,C.fbm3(i[0]*.4+17,i[1]*.4,i[2]*.4+5,2));if(o()>n*(.25+.75*p)*(.3+.7*Math.sin(Math.PI*l)))continue;const u=o(),a=.02+.026*u*u+(o()<.03?.026:0);y.add(i[0]+i[3]*.05,i[1]+i[4]*.05,i[2]+i[5]*.05,a,o(),nt(o.gauss()*.45,-1,1),0,x,0,3),v[Math.round(c)*q+Math.round(w)]+=a*a*800,m++}}async function C0(t,r,f,o,C,y,v,s){const i=[],M={};for(let m=0,g=0;g<s*40&&m<s;g++){(g&127)===127&&await t.yield?.();const x=o.range(38,88),c=f.ringOf(x),l=o.range(.012,.44),w=l*(q-1);if(f.at(c,w,i),r.axis(x,M),i[1]-M.y<.3)continue;const n=V(-.2,.3,C.fbm3(i[0]*.15+31,i[1]*.2+7,i[2]*.15+53,3)),p=Math.pow(1-Math.abs(C.n3(i[0]*.07+15,i[1]*.42+2,i[2]*.07+8)),6),u=V(38,48,x)*(1-V(76,88,x));if(o()*1.25>(.06+n*n*.85+p*.7)*u)continue;const a=o(),d=.022+.03*a*a+(o()<.05?.03:0);y.add(i[0]+i[3]*.05,i[1]+i[4]*.05,i[2]+i[5]*.05,d,o(),nt(o.gauss()*.45,-1,1),0,x,0,4),v[Math.round(c)*q+Math.round(w)]+=d*d*800,m++}}async function A0(t,r,f,o,C){const y=[],v=[0,0,0,0],s={},i=(M,m)=>{const g=f.width(M),x=Math.sign(m||1)*Math.pow(Math.min(.999,Math.abs(m)/g),1/.75),c=Math.acos(x)/Math.PI*(q-1);return o.at(o.ringOf(M),c,y),c};for(const[M,m,g,x,c]of[[17,-5.4,4,1.2,4.4],[28.5,-9.2,5,1.5,2.6],[35,-7.6,4,1.3,2.4],[19.5,6.6,3,1.2,3.4],[30,8.2,3,1.1,2.4]]){for(let l=0;l<g;l++){const w=C()*ht,k=l?Math.sqrt(C())*x:0,n=M+Math.cos(w)*k,p=m+Math.sin(w)*k*.8,u=i(n,p);if(y[4]>-.3)continue;f.axis(n,s);const a=(y[0]-s.x)*s.rx+(y[2]-s.z)*s.rz-f.camX(n),d=y[1]-s.y;let S=c*(l?C.range(.32,.8):1);S=Math.min(S,d-(Math.abs(a)<3.6?3.8:2.2)),!(S<.5)&&(de(o,Math.round(o.ringOf(n)),Math.round(u),v),_e(r,C,y[0],y[1],y[2],S,(.1+.07*C())*(.7+.4*Math.min(3,S)),v[3]*.7+.03,0,8,9,1.25,.03))}await t.yield?.()}{const M=[],m=[];let x=!0;for(let c=0;c<17;c++){const l=c/16,w=st(21.5,26.5,l),k=st(3.9,9.6,l);i(w,k),f.axis(w,s);const n=(y[0]-s.x)*s.rx+(y[2]-s.z)*s.rz-f.camX(w),p=Math.min(2.5*(.3+.7*Math.sin(Math.PI*Math.pow(l,.8)))*(1+.28*Math.sin(l*19+1)),y[1]-s.y-(Math.abs(n)<3.6?3.6:2.2));p<.15&&(x=!1),M.push([y[0],y[1],y[2]]),m.push(Math.max(p,.15))}if(x){const c=M[16][0]-M[0][0],l=M[16][2]-M[0][2],w=Math.hypot(c,l)||1;de(o,Math.round(o.ringOf(24)),Math.round(i(24,6.8)),v),Qe(r,M,m,l/w,-c/w,v[3]*.8+.03,0,6,.16,.7,.7)}}}async function P0(t,r,f,o,C,y,v,s,i){const M=[],m={};for(let g=0,x=0;x<s*30&&g<s;x++){(x&127)===127&&await t.yield?.();const c=y+(v-y)*o(),l=.5+.05*C.n2(c*.11,3.3),w=nt(l+o.gauss()*(.035+.05*(1-V(y,y+20,c)))+.03*Math.sin(c*.45),.2,.8),k=f.ringOf(c),n=w*(q-1);if(f.at(k,n,M),r.axis(c,m),M[1]-m.y<1.2||o()>(.3+.7*V(-.35,.3,C.n2(c*.2,91)))*(1-.6*V(mt-4,mt+4,c)))continue;const p=o(),u=.022+.03*p*p+(o()<.05?.03:0);i.add(M[0]+M[3]*.05,M[1]+M[4]*.05,M[2]+M[5]*.05,u,o(),nt(o.gauss()*.45,-1,1),0,c),f.D[Math.round(k)*q+Math.round(n)]+=u*u*800,g++}}async function Ve(t,r,f,o,C,y,v,s,i,M,m,g,x,c,l=1){const w=[],k={};for(let n=0,p=0;p<g*30&&n<g;p++){(p&127)===127&&await t.yield?.();const u=nt(s+o.gauss()*M,x,c),a=nt(i+o.gauss()*m,.012,.988),d=f.ringOf(u),S=a*(q-1);if(f.at(d,S,w),r.axis(u,k),w[1]-k.y<.35)continue;const N=V(-.3,.35,C.fbm3(w[0]*.3+140,w[1]*.3,w[2]*.3,2));if(o()>.16+.84*N)continue;const D=o(),b=(.02+.03*D*D+(o()<.05?.03:0))*l;y.add(w[0]+w[3]*.05,w[1]+w[4]*.05,w[2]+w[5]*.05,b,o(),nt(-.95+o.gauss()*.45,-1.6,.4),0,u,0,1),v[Math.round(d)*q+Math.round(S)]+=b*b*800,n++}}async function F0(t,r,f,o,C,y,v,s,i,M){const m=[],g={};for(let x=0,c=0;c<M*40&&x<M;c++){(c&127)===127&&await t.yield?.();const l=s+(i-s)*Math.pow(o(),1.2),w=.5+.05*C.n2(l*.11,3.3),k=V(-.3,.4,C.n2(l*.16,77)),n=.03+.05*k,p=o.gauss()*(o()<.22?2.6:1),u=nt(w+p*n+.016*Math.sin(l*.33),.25,.75);if(Math.abs(u-w-.013*Math.sin(l*.21+1)-.007)/n<.24*(.9+C.n2(l*.4,31))&&o()<.85||o()>(.22+.78*k)*(1-.72*V(J+18,i,l)))continue;const d=f.ringOf(l),S=u*(q-1);if(f.at(d,S,m),r.axis(l,g),m[1]-g.y<1.6)continue;const N=o(),D=.015+.02*N*N+(o()<.06?.022:0);y.add(m[0]+m[3]*.05,m[1]+m[4]*.05,m[2]+m[5]*.05,D,o(),nt(1-.75*Math.abs(p)+o.gauss()*.35,-1.4,1.7),0,l,0,2),v[Math.round(d)*q+Math.round(S)]+=D*D*800,x++}}async function S0(t,r,f,o,C){const y=[];o.at(o.ringOf(te),(q-1)*.5,y);const v=y[1]+.5,s=3.35,i=.42,M=r.count,m=1.5,g=1.05,x=18,c=10,l=C()*ht,w=(B,A)=>(st(1,.2,Math.pow(B,.75))+.12*Math.exp(-B*7))*(1+.15*Math.sin(A*5+l+B*3)+.07*Math.sin(A*11-B*9)),k=r.count;for(let B=0;B<=c;B++){const A=B/c,W=st(v,s,A);for(let L=0;L<x;L++){const H=L/x*ht,Y=w(A,H),U=Math.cos(H),X=Math.sin(H);r.v(U*Y*m,W,X*Y*g,U*.85,-.5,X*.85,U*.6,.3,X*.6,i*(.75+.25*Math.sin(H*5+l)),0)}}for(let B=0;B<c;B++)for(let A=0;A<x;A++){const W=k+B*x+A,L=k+B*x+(A+1)%x,H=W+x,Y=L+x;r.tri(W,L,H),r.tri(L,Y,H)}const n=r.v(0,s-.35,0,0,-1,0,0,-1,0,i,0),p=k+c*x;for(let B=0;B<x;B++)r.tri(p+B,p+(B+1)%x,n);for(let B=0;B<3;B++){const A=C()*ht,W=C.range(2.4,3.4),L=30,H=.08+B*.2,Y=st(v,s,H),U=[],X=[],et=[],bt=[];for(let ft=0;ft<L;ft++){const Ct=A+W*(ft/(L-1)),Q=w(H,Ct)+.1,St=Math.cos(Ct),Rt=Math.sin(Ct);U.push([St*Q*m,Y,Rt*Q*g]),et.push(St),bt.push(Rt);const Nt=Math.sin(Math.PI*(ft/(L-1)));X.push(Math.min(Y-2.75,(1.1+.9*B*.4)*(.35+.65*Nt)*(1+.22*Math.sin(ft*1.3+B))))}Qe(r,U,X,et,bt,i,0,6,.09,B*2.1),await t.yield?.()}const u=1.62,a=2.1,d=[],S=[],N=B=>w(.3,B)+.14,D=st(v,s,.3);{const A=[],W=[],L=[],H=[];for(let U=0;U<26;U++){const X=u+a*(U/25),et=N(X),bt=Math.cos(X),ft=Math.sin(X),Ct=Math.sin(Math.PI*(U/25));A.push([bt*et*m,D,ft*et*g]),L.push(bt),H.push(ft),W.push((D-2.75)*(.6+.4*Ct)*(1-.08*Math.abs(Math.sin(U*1.7))))}const Y=r.count;Qe(r,A,W,L,H,.9,0,7,.05,.6,.25);for(let U=Y+208;U<r.count;U++)S.push([r.pos[U*3],r.pos[U*3+1],r.pos[U*3+2],r.nrm[U*3],r.nrm[U*3+1],r.nrm[U*3+2]]);for(let U=0;U<4e3&&d.length<9;U++){const X=C.range(.06,.66),et=u+a*X,bt=N(et)+.07,ft=Math.cos(et),Ct=Math.sin(et),Q=D-(D-2.75)*(.6+.4*Math.sin(Math.PI*X))*.9,St=C.range(Math.max(Q+.25,3),Math.min(U<2e3?4.5:5,D-.4)),Rt=ft*bt*m,Nt=Ct*bt*g;let Ht=!0;for(const Ut of d)Math.hypot(Ut.x-Rt,Ut.y-St,Ut.z-Nt)<(U<2e3?.5:.4)&&(Ht=!1);if(!Ht)continue;let It=ft/m,Kt=Ct/g;const R=Math.hypot(It,Kt);It/=R,Kt/=R,d.push({x:Rt,y:St,z:Nt,ox:It,oz:Kt})}}await t.yield?.();const b=46;for(let B=0;B<b;B++){(B&7)===7&&await t.yield?.();let A=C()*ht;const W=B===0?0:Math.sqrt(C())*.98;W>.42&&((A-u+.2)%ht+ht)%ht<a+.4&&(A+=a+.6);const L=Math.cos(A),H=Math.sin(A),Y=L*W*m*.95,U=H*W*g*.95,X=st(s-.2,v-1.2,Math.pow(W,1.6)),et=B===0?2.2:2.3+Math.pow(W,1.25)*2.3+C()*.45,bt=Math.max(.3,X-et),ft=.07+.09*C()+(B===0?.06:0);_e(r,C,Y,X,U,bt,ft,i*.9,0,6,6,1.3,.03)}const _=[];for(let B=M;B<r.count;B++)_.push([r.pos[B*3],r.pos[B*3+1],r.pos[B*3+2],r.nrm[B*3],r.nrm[B*3+1],r.nrm[B*3+2]]);return{pts:_,seats:d,wpts:S,yTop:v,yTip:2.2,RX:m,RZ:g}}function Ee(t,r,f,o,C){const y=t.pos.length/3,v=r.length,s=new ot,i=new ot,M=new ot,m=new ot;for(let g=0;g<v;g++){const x=r[Math.max(0,g-1)],c=r[Math.min(v-1,g+1)];s.set(c[0]-x[0],c[1]-x[1],c[2]-x[2]).normalize(),m.set(0,1,0),Math.abs(s.y)>.9&&m.set(1,0,0),i.crossVectors(s,m).normalize(),M.crossVectors(s,i);const l=C(g,g/(v-1));for(let w=0;w<o;w++){const k=w/o*ht,n=Math.cos(k),p=Math.sin(k),u=i.x*n+M.x*p,a=i.y*n+M.y*p,d=i.z*n+M.z*p,S=Array.isArray(f[g])?f[g]:[f[g],f[g]],N=i.x*n*S[0]+M.x*p*S[1],D=i.y*n*S[0]+M.y*p*S[1],b=i.z*n*S[0]+M.z*p*S[1];t.pos.push(r[g][0]+N,r[g][1]+D,r[g][2]+b),t.nrm.push(u,a,d),t.ext.push(l[0],l[1],l[2])}}for(let g=0;g<v-1;g++)for(let x=0;x<o;x++){const c=y+g*o+x,l=y+g*o+(x+1)%o,w=c+o,k=l+o;t.idx.push(c,l,w,l,k,w)}}function B0(){const t={pos:[],nrm:[],ext:[],idx:[]},r=()=>[0,0,0],f=[],o=[];for(let i=0;i<=8;i++){const M=i/8,m=st(-.034,.026,M),g=Math.sin(Math.PI*Math.pow(M,.8));f.push([0,.019+.008*g-.006*M,m]),o.push([.002+.012*g,.002+.014*g])}Ee(t,f,o,7,r);const C=[],y=[];for(let i=0;i<=4;i++){const M=i/4;C.push([0,.014-.006*M,.024+.012*M]),y.push(.001+.006*Math.sin(Math.PI*(.15+.8*M)))}Ee(t,C,y,6,r);const v=[[.014,.055,.03,.03],[.002,.075,.004,.036],[-.012,.085,-.075,.07]];for(const i of[-1,1])for(let M=0;M<3;M++){const[m,g,x,c]=v[M],l=M===2?.0048:.0034,w=[[i*.006,.014,m],[i*g*.45,c,st(m,x,.3)],[i*g*.8,c*.4,st(m,x,.8)],[i*g,0,x],[i*(g+.012),.001,x+(M===2?-.012:.008)]];Ee(t,w,[l,l,l*.6,l*.45,l*.3],3,()=>[0,i,l*.5])}for(const i of[-1,1]){const M=[],m=[];for(let g=0;g<=10;g++){const x=g/10;M.push([i*(.004+.02*x+.07*x*x),.016+.035*x-.02*x*x,.034+.2*x]),m.push(.0019*(1-.55*x))}Ee(t,M,m,3,(g,x)=>[x,i,5e-4])}const s=new F.BufferGeometry;return s.setAttribute("position",new F.Float32BufferAttribute(t.pos,3)),s.setAttribute("normal",new F.Float32BufferAttribute(t.nrm,3)),s.setAttribute("aAnt",new F.Float32BufferAttribute(t.ext,3)),s.setIndex(t.idx),s}function T0(){const t={pos:[],nrm:[],ext:[],idx:[]},r=[],f=[],o=30;for(let v=0;v<=o;v++){const s=v/o,i=V(0,.035,s),M=1-.16*Math.exp(-(((s-.085)/.03)**2)),m=Math.pow(Math.max(0,1-V(.1,.92,s)),1.25),g=V(.3,.6,s)*(1-V(.9,1,s)),x=Math.exp(-(((s-.125)/.02)**2)),c=(.012+.092*m)*(.5+.5*i)*M+.055*x,l=(.012+.05*m)*(.4+.6*i)+.06*g;r.push([0,0,s*2.5]),f.push([c*(1-V(.96,1,s))+.003,l*(1-V(.96,1,s))+.003])}Ee(t,r,f,7,(v,s)=>[s,0,0]);const C=new Float32Array(t.ext.length/3);for(let v=0;v<C.length;v++)C[v]=t.ext[v*3];const y=new F.BufferGeometry;return y.setAttribute("position",new F.Float32BufferAttribute(t.pos,3)),y.setAttribute("normal",new F.Float32BufferAttribute(t.nrm,3)),y.setAttribute("aT",new F.BufferAttribute(C,1)),y.setIndex(t.idx),y}function Ze(t,r,f=-1){const o=new F.InstancedBufferGeometry;o.setAttribute("position",new F.Float32BufferAttribute([-1,f,0,1,f,0,1,1,0,-1,1,0],3)),o.setIndex([0,1,2,0,2,3]);for(const C in r)o.setAttribute(C,r[C]);return o.instanceCount=t,o.boundingSphere=new F.Sphere(new ot(0,0,-80),400),o}async function V0(t,r={}){const f=t.rng.fork?t.rng.fork("false-stars-hero"):t.rng,o=t.noise,C=(r.palette&&r.palette.length>=7?r.palette:Ha).map(e=>new F.Color(e)),[,y,v,s,i,,M]=C,m=f.range(.82,1.2),g=f.range(-.6,.6),x=f.pick(["mixed","straws","draperies"]),c=nt(r.density??m,.7,1.3),l=nt(r.hue??g,-1,1),w=r.formations||x,k=r.hour||"night",n=nt(t.quality?.detail??1,.5,1),p=new F.Group;p.name="false-stars-hero";const u=$a(f,o,r);await t.yield?.();const a=await v0(t,u,o);await t.yield?.();const d={p:[],par:[],s:[],ch:[],ex:[]},S={add(e,h,z,P,G,I,T,E,$=0,O=0){d.p.push(e,h,z),d.par.push(P,G,I,T),d.s.push(E),d.ch.push($),d.ex.push(O)}},N=Vt("false-stars-river:"+(t.seed??0));await t.yield?.(),await ra(t,u,a,f,o,[[Jt+2,tt,Math.round(8300*c),1,.035],[te+9,tt-3,Math.round(2100*c),1,.05]],S);const D=new Float32Array(a.D.length);await k0(t,u,a,Vt("false-stars-leftwall:"+(t.seed??0)),o,S,D,Math.round(1250*c));const b=Vt("false-stars-backclouds:"+(t.seed??0)),_=[];_.push([we[0]+8.5,.8,3.2]),await Ve(t,u,a,b,o,S,D,we[0]+8.5,.8,3.2,.07,Math.round(300*c),we[0]+1,tt-1.5),await z0(t,u,a,Vt("false-stars-cores:"+(t.seed??0)),o,S,D,Math.round(1700*c));const B=new Float32Array(a.D.length);await C0(t,u,a,Vt("false-stars-rightwall:"+(t.seed??0)),o,S,B,Math.round(1e3*c)),await ra(t,u,a,N,o,[[tt,dt+5,Math.round(420*c),1,.46],[dt+3,mt-3,Math.round(7e3*c),1,.045,1.55]],S),_.push([Re[0]+13,.84,5.5]),await Ve(t,u,a,b,o,S,D,Re[0]+13,.84,5.5,.075,Math.round(420*c),dt+6,mt-4,1.4),_.push([ve[0]+17,.15,8]),await Ve(t,u,a,b,o,S,D,ve[0]+17,.15,8,.085,Math.round(600*c),dt+6,mt-4,1.4),_.push([ve[0]+2,.37,5]),await Ve(t,u,a,b,o,S,D,ve[0]+2,.37,5,.06,Math.round(260*c),dt+6,mt-4,1.4),_.push([mt-14,.2,5]),await Ve(t,u,a,b,o,S,D,mt-14,.2,5,.09,Math.round(420*c),dt+6,mt-4,1.3);const A=d.s.length;await F0(t,u,a,Vt("false-stars-milkyway:"+(t.seed??0)),o,S,D,mt-34,Z-30,Math.round(2600*c)),await P0(t,u,a,Vt("false-stars-lane:"+(t.seed??0)),o,mt-27,J+5,Math.round(680*c),S),await ra(t,u,a,N,o,[[mt-6,J,Math.round(360*c),1,.4],[J,Z-26,Math.round(1500*c),1.45,.34,.9]],S);{const e=Math.round(a.ringOf(te)),h=q-1>>1;for(let z=-3;z<=3;z++)for(let P=-3;P<=3;P++)a.D[(e+z)*q+h+P]+=3*Math.exp(-(z*z+P*P)/5)}await t.yield?.(),await Fa(t,a),await t.yield?.();{a.B2f=a.B2;const e=a.norm;for(let h=0;h<D.length;h++)a.D[h]+=D[h];for(let h=0;h<a.NR;h++){for(let z=0;z<q;z++){const P=h*q+z;a.D[P]=a.D[P]*Ta(o,a.P[P*3],a.P[P*3+1],a.P[P*3+2],a.sl[h])+B[P]}(h&15)===15&&await t.yield?.()}await Fa(t,a),a.norm=e}await t.yield?.();const W=[Ye(),Ye(),Ye()];await la(t,W[0],u,a,0,a.iG),await la(t,W[1],u,a,a.iG,a.iT),await la(t,W[2],u,a,a.iT,a.NR-1),await t.yield?.();const L=await S0(t,W[0],u,a,f);await t.yield?.();const{tips:H,mirrorCut:Y}=await g0(t,W,u,a,f,N,o,w);await t.yield?.(),await y0(t,W,u,a,Vt("false-stars-teeth:"+(t.seed??0))),await t.yield?.();const U=Ye();await A0(t,U,u,a,Vt("false-stars-entry:"+(t.seed??0))),await t.yield?.();const X={},et=(e,h,z,P,G)=>{u.axis(P,X);const I=.9,T=-.48*Math.sign(G||1),E=Math.hypot(I,T),$=Math.cos(24*se)/E;return[(X.dx*I+X.rx*T)*$,Math.sin(24*se),(X.dz*I+X.rz*T)*$,.45]},bt=Sa(),ft=Sa(),Ct=Vt("false-stars-flow:"+(t.seed??0)),Q=await b0(t,W[1],bt,ft,u,a,Vt("false-stars-hall:"+(t.seed??0)),Ct,o,et);await t.yield?.();{const e=Math.round(1e3*c);for(let h=0;h<e;h++){const z=L.pts[Math.floor(f()*L.pts.length)],P=.07,G=z[0]+z[3]*.05+f.gauss()*P,I=z[1]+z[4]*.05+f.gauss()*P,T=z[2]+z[5]*.05+f.gauss()*P;if(I<2.3)continue;let E=!0;for(const O of L.seats){const Mt=G-O.x,Gt=I-O.y,Bt=T-O.z;Mt*Mt+Gt*Gt+Bt*Bt<.3&&Mt*O.ox+Bt*O.oz>-.03&&(E=!1)}const $=f();E&&S.add(G,I,T,.034+.034*$*$+(f()<.08?.03:0),f(),nt(f.gauss()*.45,-1,1),0,te-T,1)}for(let h=0,z=Math.round(230*c);h<z&&L.wpts.length;h++){const P=L.wpts[Math.floor(f()*L.wpts.length)],G=P[0]+P[3]*.03+f.gauss()*.06,I=P[1]+f.gauss()*.08,T=P[2]+P[5]*.03+f.gauss()*.06;let E=I>2.6;for(const O of L.seats){const Mt=G-O.x,Gt=I-O.y,Bt=T-O.z;Mt*Mt+Gt*Gt+Bt*Bt<.3&&Mt*O.ox+Bt*O.oz>-.045&&(E=!1)}const $=f();E&&S.add(G,I,T,.03+.03*$*$,f(),nt(f.gauss()*.45,-1,1),0,te-T,1)}}await t.yield?.();for(let e=0;e<d.s.length;e++){if(d.ex[e]&&d.ex[e]<3||d.ch[e])continue;const h=d.p[e*3],z=d.p[e*3+1],P=d.p[e*3+2],G=st(.4,1,V(tt-30,tt+6,d.s[e])),I=Math.pow(1-Math.abs(o.n3(h*.05+40,3.1,P*.05)),7);d.par[e*4+2]=nt(d.par[e*4+2]*.7+((Xa(h,z,P)-.5)*4.6+1.3*I)*G,-1.7,1.7),(e&2047)===2047&&await t.yield?.()}await t.yield?.();for(let e=0;e<d.s.length;e++)d.ex[e]&&d.ex[e]!==3||d.ch[e]||(d.par[e*4]*=Math.pow(Ta(o,d.p[e*3],d.p[e*3+1],d.p[e*3+2],d.s[e]),.75),(e&1023)===1023&&await t.yield?.());await t.yield?.();{const e=d.s.map((z,P)=>P).sort((z,P)=>d.ch[P]-d.ch[z]||z-P),h=(z,P)=>{const G=[];for(const I of e)for(let T=0;T<P;T++)G.push(z[I*P+T]);return G};await t.yield?.(),d.p=h(d.p,3),await t.yield?.(),d.par=h(d.par,4),await t.yield?.(),d.s=h(d.s,1),d.ch=h(d.ch,1),d.ex=h(d.ex,1)}await t.yield?.();const St=d.s.length;if(Array.isArray(r.extraWorms))for(const e of r.extraWorms){const h=f();S.add(e[0],e[1],e[2],.02+.028*h*h,f(),nt(f.gauss()*.45,-1,1),0,9999)}const Rt=d.s.length,Nt=new Float32Array(d.p),Ht=new Float32Array(Rt*3),It=new Float32Array(d.par),Kt=new Float32Array(Rt*3),R={},Ut=new Float32Array(Rt),ee=new Float32Array(Rt);for(let e=0;e<Rt;e++){const h=d.s[e],z=Nt[e*3],P=Nt[e*3+1],G=Nt[e*3+2];if(e>=St){Ht[e*3]=z,Ht[e*3+1]=P,Ht[e*3+2]=G,Kt[e*3]=h,Kt[e*3+2]=P-50;continue}u.axis(h,R);let I=-R.slope*R.dx,T=1,E=-R.slope*R.dz;const $=Math.hypot(I,T,E);I/=$,T/=$,E/=$;const O=(z-R.x)*I+(P-R.y)*T+(G-R.z)*E;Ht[e*3]=z-2*O*I,Ht[e*3+1]=P-2*O*T,Ht[e*3+2]=G-2*O*E,Kt[e*3]=h,Kt[e*3+1]=u.flow(h),Kt[e*3+2]=R.y,Ut[e]=(z-R.x)*R.rx+(G-R.z)*R.rz-u.camX(h),ee[e]=P-R.y,(e&127)===127&&await t.yield?.()}await t.yield?.();const K={p:[],par:[]};{const e=P=>!d.ex[P]&&d.s[P]>-8&&d.s[P]<dt+8&&Math.abs(Ut[P])<7.5;let h=0;for(let P=0;P<St;P++)!d.ch[P]&&e(P)&&h++;const z=Math.min(1,1100*n/Math.max(1,h));for(let P=0;P<St;P++){(P&1023)===1023&&await t.yield?.();const G=d.ch[P];if(G?f()>.62:!(e(P)&&f()<z))continue;let I=G?.14+.3*f():.07+.33*Math.pow(f(),1.5);I=Math.min(I,ee[P]-(Math.abs(Ut[P])<1.6?2.03:.5)),!(I<.05)&&(K.p.push(Nt[P*3],Nt[P*3+1]-.01,Nt[P*3+2]),K.par.push(I,f(),.1+.16*f(),d.s[P]))}}for(const e of Q.snares)K.p.push(e[0],e[1],e[2]),K.par.push(e[3],e[4],e[5],e[6]??Q.organ.s);await t.yield?.();const j={p:[],par:[]},vt=[];{const e=Vt("false-stars-threads:"+(t.seed??0)),h=[],z=(T,E)=>{const $=u.width(T),O=Math.sign(E||1)*Math.pow(Math.min(.999,Math.abs(E)/$),1/.75);return a.at(a.ringOf(T),Math.acos(O)/Math.PI*(q-1),h)},P=(T,E,$,O)=>{z(T,E);const Mt=h[0],Gt=h[1],Bt=h[2];if(h[4]>-.3||Math.hypot(Mt-Q.gap.hole[0],Bt-Q.gap.hole[2])<4.6)return;u.axis(T,R);const ut=(Mt-R.x)*R.rx+(Bt-R.z)*R.rz-u.camX(T);let Tt=Math.abs(ut)<2.8?3:1.3;for(const Ft of Q.islands)Math.hypot(Mt-Ft.x,Bt-Ft.z)<Ft.R+.7&&(Tt=Math.max(Tt,Ft.top+.7));const qt=Math.min($,Gt-R.y-Tt);qt<.8||(j.p.push(Mt,Gt-.03,Bt),j.par.push(qt,e(),O*Math.min(1.6,qt/3),0))},G=Math.round(12*Math.max(n,.75))+3,I=[[mt-19,2.2],[mt-27,-9.5],[mt-13,-5.2]];for(let T=0,E=0;T<G&&E<400;E++){const $=T<3?I[T][0]:e.range(dt+17,mt-19),O=T<3?I[T][1]:e.range(-.7,.7)*u.width($);let Mt=!0;for(const Tt of vt)T>=3&&Math.hypot(Tt.s-$,Tt.lat-O)<10.5&&(Mt=!1);if(!Mt)continue;const Gt=e.range(4.2,8.2),Bt=e.range(1.5,2.6),ut=Math.round(e.range(26,40));vt.push({s:$,lat:O,len:Gt,R:Bt}),T++;for(let Tt=0;Tt<ut;Tt++){const qt=e()*ht,Ft=Math.sqrt(e()),Dt=Ft*Bt;P($+Math.cos(qt)*Dt,O+Math.sin(qt)*Dt,Gt*(1-.6*Ft*Ft)*e.range(.62,1),.02+.03*e())}await t.yield?.()}await t.yield?.();for(let T=0;T<Math.round(150*n);T++)P(e.range(dt+8,mt-10),e.range(-.85,.85)*u.width(dt+40),1+3.6*Math.pow(e(),1.6),.02+.05*e());for(const T of Q.threads)j.p.push(T[0],T[1]-.02,T[2]),j.par.push(T[3],Ct(),T[4]*Math.min(1.6,T[3]/3),0)}const pt={p:[],par:[]};{const e=Vt("false-stars-snares-short:"+(t.seed??0));for(const h of Q.shortT)pt.p.push(h[0],h[1],h[2]),pt.par.push(h[3],h[4],h[5],h[6]);for(let h=0;h<St;h++){if(d.ex[h]!==2||d.s[h]<mt-32||d.s[h]>J+46||Math.abs(Ut[h])>3.4)continue;const z=e(),P=e(),G=Math.min(P<.4?e.range(1.4,4.2):e.range(.35,1.3),ee[h]-(Math.abs(Ut[h])<1.7?2.06:1.4));z>.62*n||G<.25||(pt.p.push(Nt[h*3],Nt[h*3+1]-.02,Nt[h*3+2]),pt.par.push(G,P,.008+.01*P,Kt[h*3+2]))}}await t.yield?.();const kt={pos:[],w:[],w2:[],w3:[],idx:[]},Et={pos:[],idx:[]},wt=13,rt=[0,0,0,0];{let e=0,h=Jt,z=0,P=0;for(let I=0;I<=a.iM;I++){const T=a.sl[I];u.axis(T,R);const E=.3+3.5*V(tt-12,tt+36,T)*(1-.93*V(dt-8,dt+14,T))+3.5*V(mt-12,J,T)+9*V(J-10,J+50,T);e+=(T-h)/E,h=T;const $=u.width(T)+(T<tt-4||Ce(T)>.02?3.4:2.2),O=u.flow(T),Mt=Math.exp(-(Z-T)/60),Gt=(de(a,I,20,rt)[3]*2+de(a,I,12,rt)[3]+de(a,I,28,rt)[3])*.25,Bt=I*q*3,ut=(I*q+q-1)*3,Tt=(a.P[Bt]-R.x)*R.rx+(a.P[Bt+2]-R.z)*R.rz,qt=(a.P[ut]-R.x)*R.rx+(a.P[ut+2]-R.z)*R.rz;for(let Ft=0;Ft<wt;Ft++){const Dt=Ft/(wt-1)*2-1,_t=Dt*$;kt.pos.push(R.x+R.rx*_t,R.y,R.z+R.rz*_t),kt.w.push(_t,e,O,Gt),kt.w2.push(Mt,Dt,T,E),kt.w3.push(Math.min(qt,Tt),Math.max(qt,Tt))}if(z>0)for(let Ft=0;Ft<wt-1;Ft++){const Dt=(z-1)*wt+Ft,_t=Dt+wt;kt.idx.push(Dt,Dt+1,_t,_t,Dt+1,_t+1)}if(z++,T>J-3){const Ft=[-$,-$,$,$],Dt=[.02,-15,-15,.02];for(let _t=0;_t<4;_t++)Et.pos.push(R.x+R.rx*Ft[_t],R.y+Dt[_t],R.z+R.rz*Ft[_t]);if(P>0)for(let _t=0;_t<3;_t++){const ce=(P-1)*4+_t,ze=ce+4;Et.idx.push(ce,ce+1,ze,ze,ce+1,ze+1)}P++}(I&63)===63&&await t.yield?.()}const G=(P-1)*4;Et.idx.push(G,G+1,G+2,G,G+2,G+3)}await t.yield?.();const zt={h:0,s:0,l:0};v.getHSL(zt);const Pt=zt.h+l*.03,Lt=k==="moonless"?.14:k==="dawn"?.42:k==="day"||k==="golden"||k==="dusk"?.36:.3,gt=(k==="dawn"?M.clone().lerp(i,.5):k==="moonless"?s.clone().lerp(i,.25):i.clone().lerp(s,.3)).multiplyScalar(Lt),yt=y.clone();yt.multiplyScalar(.8/Math.max(yt.r,yt.g,yt.b,.001));const ct=[];{f.shuffle(H);for(let e=0;e<ia;e++){let h=H[e];if(!h){const z=f.range(4,tt-8),P=[];a.at(a.ringOf(z),f.range(.3,.7)*(q-1),P),h=[P[0],P[1]-.1,P[2],P[1]-.1]}ct.push({x:h[0],y:h[1],z:h[2],h:Math.max(.5,h[3]),period:f.range(2.6,6.5),phase:f()})}}const at={uTime:{value:0},uCamL:{value:new ot(0,fe,te)},uVelL:{value:new ot(0,0,-3)},uRes:{value:new F.Vector2(1920,1080)},uGain:{value:r.gain??1},uGlint:{value:r.glint??1},uRockK:{value:0},uRel:{value:0},uCalm:{value:0},uThreadK:{value:1},uFlowK:{value:1},uStreak:{value:1.15},uAhead:{value:0},uChev:{value:0},uBrightO:{value:1},uMirK:{value:r.hallMirror??.55},uVoid:{value:0},uMirD:{value:new F.Vector4},uMirE:{value:new F.Vector4},uLift:{value:new F.Color(0,0,0)},uBright:{value:r.brightness??4.2},uWormCol:{value:new F.Color().setHSL(Pt,zt.s,zt.l)},uRockCol:{value:yt},uColA:{value:new F.Color().setHSL(Pt-.04,zt.s,zt.l)},uColB:{value:new F.Color().setHSL(Pt+.045,zt.s,zt.l*1.03)},uSkyCol:{value:gt},uMouth:{value:new ot},uAmb:{value:y.clone().multiplyScalar(.02)},uBoat:{value:new F.Vector4(0,te,0,-1)},uBoatP:{value:new F.Vector4(3,1,0,0)},uEel:{value:new F.Vector4(0,0,0,-1)},uEelOn:{value:0},uEelY:{value:-.045},uDrip:{value:ct.map(e=>new F.Vector4(e.x,e.z,e.period,e.phase))},uBoatS:{value:0},uRelight:{value:30},uShutter:{value:0},uFlowC:{value:.02},uRimK:{value:1},uEven:{value:0},uHue:{value:0},uCl:{value:_.slice(0,5).map(e=>{const h=[];a.at(a.ringOf(e[0]),e[1]*(q-1),h);const z=e[2]*1.5+2.5;return new F.Vector4(h[0],h[1],h[2],1/(z*z))})}};at.uIsl={value:[Q.organT,Q.rankD,Q.organ,Q.rankG,Q.rankS].slice(0,sa).map(e=>e?new F.Vector4(e.x,e.z,e.Rb??e.R,e.ph):new F.Vector4(0,0,0,0))},at.uHDrip={value:Array.from({length:$e},(e,h)=>{const z=Q.hdrips[h];return z?new F.Vector4(z[0],z[2],z[4],z[5]):new F.Vector4(0,0,0,0)})};const it=(e,h={})=>{const z=F.UniformsUtils.clone(F.UniformsLib.fog);for(const P of e)z[P]=at[P];return Object.assign(z,h)},lt=["uBoat","uBoatP","uEel","uEelOn","uDrip"],Wt=e=>new F.ShaderMaterial({fog:!0,vertexShader:Qa,fragmentShader:Za,uniforms:it(["uCamL","uWormCol","uRockCol","uSkyCol","uMouth","uAmb","uLift","uGain","uGlint","uRockK","uRel","uCalm","uFlowC","uRimK","uEven","uHue","uCl","uColA","uColB","uMirK","uMirD","uMirE","uVoid",...lt],{uMirror:{value:e}})}),xt={transparent:!0,depthWrite:!1,blending:F.AdditiveBlending,fog:!0},ae=e=>new F.ShaderMaterial({...xt,vertexShader:Ja,fragmentShader:t0,uniforms:it(["uTime","uBoatS","uRelight","uShutter","uGain","uBright","uRes","uCamL","uVelL","uColA","uColB","uFlowC","uStreak","uAhead",...lt],{uFlip:{value:e}})}),ie=Wt(0),At=Wt(1),Qt=[];let Xt=null;{const e=await bt.geometry(t);for(const h of[0,1]){const z=new F.Mesh(e,new F.ShaderMaterial({fog:!0,side:F.DoubleSide,vertexShader:s0,fragmentShader:i0,uniforms:it(["uCamL","uWormCol","uRockCol","uAmb","uLift","uGain","uGlint","uFlowK","uFlowC","uTime","uColA","uColB",...lt],{uMirror:{value:h}})}));h&&(z.scale.y=-1),z.name=h?"hall-stone-mirror":"hall-stone",p.add(z),Qt.push(z.material)}await t.yield?.(),Xt=await ft.geometry(t);for(const h of[0,1]){const z=new F.Mesh(Xt,Qt[h]);h&&(z.scale.y=-1),z.name=h?"rank-stone-mirror":"rank-stone",p.add(z)}await t.yield?.()}{const e=await U.geometry(t),h=new F.Mesh(e,ie);h.name="grotto-teeth",p.add(h);const z=new F.Mesh(e,At);z.scale.y=-1,z.name="grotto-teeth-mirror",p.add(z),await t.yield?.()}const Yt=[];for(const e of W)Yt.push(await e.geometry(t)),await t.yield?.();const le=Yt.map((e,h)=>{const z=new F.Mesh(e,ie);return z.name=["grotto","tube","flume"][h],p.add(z),z}),jt=new F.BufferGeometry;for(const e of["position","normal","aLight","aSky","aSoft"])jt.setAttribute(e,Yt[0].getAttribute(e));jt.setIndex(new F.BufferAttribute(Yt[0].index.array.slice(0,Y),1)),jt.boundingSphere=Yt[0].boundingSphere.clone();const oe=new F.Mesh(jt,At);oe.scale.y=-1,oe.name="grotto-mirror",p.add(oe);const me=new F.Mesh(Yt[1],At);me.scale.y=-1,me.name="tube-mirror",p.add(me),await t.yield?.();const Zt=new F.BufferGeometry;{const e=Yt[2],h=e.getAttribute("position").array,z=h.length/3,P=new Float32Array(h.length),G=new Float32Array(h.length);u.axis(J,R);const I=R.x,T=R.z,E=R.dx,$=R.dz;for(let ut=0;ut<z;ut++){const Tt=h[ut*3],qt=h[ut*3+1],Ft=h[ut*3+2];u.axis(nt(J+(Tt-I)*E+(Ft-T)*$,J,Z),R);let Dt=-R.slope*R.dx,_t=1,ce=-R.slope*R.dz;const ze=Math.hypot(Dt,_t,ce);Dt/=ze,_t/=ze,ce/=ze;const oa=(Tt-R.x)*Dt+(qt-R.y)*_t+(Ft-R.z)*ce;P[ut*3]=Tt-2*oa*Dt,P[ut*3+1]=qt-2*oa*_t,P[ut*3+2]=Ft-2*oa*ce,G[ut*3]=Dt,G[ut*3+1]=_t,G[ut*3+2]=ce,(ut&2047)===2047&&await t.yield?.()}const O=e.index.array,Mt=(a.iM-a.iT)*(q-1)*6,Gt=(a.NR-1-a.iT)*(q-1)*6,Bt=[];for(let ut=0;ut<O.length;ut+=3)ut>=Mt&&ut<Gt||Bt.push(O[ut],O[ut+2],O[ut+1]);Zt.setAttribute("position",new F.BufferAttribute(P,3)),Zt.setAttribute("aOrg",e.getAttribute("position")),Zt.setAttribute("aPl",new F.BufferAttribute(G,3));for(const ut of["normal","aLight","aSky","aSoft"])Zt.setAttribute(ut,e.getAttribute(ut));Zt.setIndex(new F.BufferAttribute(z>65535?new Uint32Array(Bt):new Uint16Array(Bt),1)),Zt.computeBoundingSphere()}const re=new F.Mesh(Zt,Wt(2));re.name="flume-mirror",p.add(re),await t.yield?.();let $t=0;for(;$t<St&&d.s[$t]<tt;)$t++;const Be=(e,h)=>({iPos:new F.InstancedBufferAttribute(Nt.subarray(e*3,h*3),3),iMir:new F.InstancedBufferAttribute(Ht.subarray(e*3,h*3),3),iPar:new F.InstancedBufferAttribute(It.subarray(e*4,h*4),4),iPar2:new F.InstancedBufferAttribute(Kt.subarray(e*3,h*3),3)}),La=d.ch.reduce((e,h)=>e+(h?1:0),0),he=Math.max($t,Math.min(St,A+La)),ua=Be(0,$t),da=Be($t,he),ma=Be(he,Rt),qe=ae(0),Je=ae(1),ge=(e,h,z,P,G)=>{const I=new F.Mesh(Ze(e,h),z);return I.frustumCulled=!1,I.renderOrder=P,I.name=G,p.add(I),I},L0=ge($t,ua,qe,3,"worms"),R0=ge(he-$t,da,qe,3,"worms-tube"),N0=ge(Rt-he,ma,qe,3,"worms-flume");{const e=Q.lights.length,h=new Float32Array(e*3),z=new Float32Array(e*3),P=new Float32Array(e*4),G=new Float32Array(e*3),I=u.flow(Q.organ.s);Q.lights.forEach(($,O)=>{h.set([$[0],$[1],$[2]],O*3),z.set([$[0],-$[1],$[2]],O*3),P.set([$[3],Ct(),$[5]??nt(Ct.gauss()*.45-.3,-1,1),0],O*4),G.set([$[4]??Q.organ.s,I,0],O*3)});const T={iPos:new F.InstancedBufferAttribute(h,3),iMir:new F.InstancedBufferAttribute(z,3),iPar:new F.InstancedBufferAttribute(P,4),iPar2:new F.InstancedBufferAttribute(G,3)},E=ae(1);E.uniforms.uBright=at.uBrightO,ge(e,T,qe,3,"worms-organ"),ge(e,T,E,2.5,"worms-organ-mirror")}const Ra=ge($t,ua,Je,2.5,"worms-mirror"),pa=ge(he-$t,da,Je,2.5,"worms-mirror-tube"),Na=ge(St-he,ma,Je,2.5,"worms-mirror-flume"),Ie=new F.Mesh(Ze(K.par.length/4,{iPos:new F.InstancedBufferAttribute(new Float32Array(K.p),3),iPar:new F.InstancedBufferAttribute(new Float32Array(K.par),4)},0),new F.ShaderMaterial({...xt,side:F.DoubleSide,vertexShader:e0,fragmentShader:a0,uniforms:it(["uCamL","uVelL","uTime","uWormCol","uGain"])}));Ie.frustumCulled=!1,Ie.renderOrder=4,Ie.name="snares",p.add(Ie);{const h=[],z=[];for(let T=0;T<=5;T++)h.push(-1,T/5,0,1,T/5,0);for(let T=0;T<5;T++){const E=T*2;z.push(E,E+1,E+2,E+2,E+1,E+3)}const P=j.par.length/4,G=new F.InstancedBufferAttribute(new Float32Array(j.p),3),I=new F.InstancedBufferAttribute(new Float32Array(j.par),4);for(const T of[0,1]){const E=new F.InstancedBufferGeometry;E.setAttribute("position",new F.Float32BufferAttribute(h,3)),E.setIndex(z),E.setAttribute("iPos",G),E.setAttribute("iPar",I),E.instanceCount=P,E.boundingSphere=new F.Sphere(new ot(0,0,-80),400);const $=new F.Mesh(E,new F.ShaderMaterial({...xt,side:F.DoubleSide,vertexShader:o0,fragmentShader:n0,uniforms:it(["uCamL","uVelL","uRes","uTime","uWormCol","uGain","uThreadK","uFlowC",...lt],{uFlip:{value:T}})}));$.frustumCulled=!1,$.renderOrder=T?2.5:4,$.name=T?"threads-mirror":"threads",p.add($);const O=new F.InstancedBufferGeometry;O.setAttribute("position",new F.Float32BufferAttribute([-1,0,0,1,0,0,-1,.5,0,1,.5,0,-1,1,0,1,1,0],3)),O.setIndex([0,1,2,2,1,3,2,3,4,4,3,5]),O.setAttribute("iPos",new F.InstancedBufferAttribute(new Float32Array(pt.p),3)),O.setAttribute("iPar",new F.InstancedBufferAttribute(new Float32Array(pt.par),4)),O.instanceCount=pt.par.length/4,O.boundingSphere=new F.Sphere(new ot(0,0,-80),400);const Mt=new F.Mesh(O,$.material);Mt.frustumCulled=!1,Mt.renderOrder=T?2.5:4,Mt.name=T?"snares-short-mirror":"snares-short",p.add(Mt)}}await t.yield?.();const ye=new F.BufferGeometry;ye.setAttribute("position",new F.Float32BufferAttribute(kt.pos,3)),ye.setAttribute("aW",new F.Float32BufferAttribute(kt.w,4)),ye.setAttribute("aW2",new F.Float32BufferAttribute(kt.w2,4)),ye.setAttribute("aW3",new F.Float32BufferAttribute(kt.w3,2)),ye.setIndex(kt.idx),ye.computeBoundingSphere(),await t.yield?.();const ta=new F.Mesh(ye,new F.ShaderMaterial({transparent:!0,depthWrite:!1,premultipliedAlpha:!0,side:F.DoubleSide,fog:!0,vertexShader:r0,fragmentShader:l0,uniforms:it(["uTime","uCamL","uWormCol","uSkyCol","uAmb","uMouth","uGain","uIsl","uHDrip","uChev",...lt])}));ta.renderOrder=2,ta.name="water",p.add(ta);const Te=new F.BufferGeometry;Te.setAttribute("position",new F.Float32BufferAttribute(Et.pos,3)),Te.setIndex(Et.idx),Te.computeBoundingSphere();const wa=new F.Mesh(Te,new F.MeshBasicMaterial({color:0,side:F.DoubleSide}));wa.name="trough",p.add(wa),await t.yield?.();{u.axis(Z-.15,R);const e=u.width(Z)+2.2,h=14.8,z=new F.BufferGeometry;z.setAttribute("position",new F.Float32BufferAttribute([R.x-R.rx*e,R.y,R.z-R.rz*e,R.x+R.rx*e,R.y,R.z+R.rz*e,R.x+R.rx*e,R.y-h,R.z+R.rz*e,R.x-R.rx*e,R.y-h,R.z-R.rz*e],3)),z.setAttribute("uv",new F.Float32BufferAttribute([-1,0,1,0,1,h,-1,h],2)),z.setIndex([0,1,2,0,2,3]),z.computeBoundingSphere();const P=new F.Mesh(z,new F.ShaderMaterial({side:F.DoubleSide,vertexShader:h0,fragmentShader:c0,uniforms:{uSkyCol:at.uSkyCol,uGain:at.uGain,uTime:at.uTime}}));P.name="mouth-image",p.add(P)}await t.yield?.();const va=[],Ae=new F.InstancedMesh(B0(),new F.ShaderMaterial({fog:!0,vertexShader:f0,fragmentShader:u0,uniforms:it(["uTime","uWormCol","uGain"])}),9);{const e=new F.Matrix4,h=new ot,z=new ot,P=new ot,G=new ot(0,-1,0),I=new ot;for(let T=0;T<9;T++){const E=L.seats[T%Math.max(1,L.seats.length)]||{x:-1.2,y:4,z:.3,ox:-1,oz:0};z.set(E.ox,0,E.oz).normalize(),I.crossVectors(z,G).normalize();const $=f.range(-.8,.8)+(f()<.3?Math.PI:0);P.copy(G).multiplyScalar(Math.cos($)).addScaledVector(I,Math.sin($)).normalize(),h.crossVectors(z,P);const O=f.range(2.7,3.5);e.makeBasis(h.clone().multiplyScalar(O),z.clone().multiplyScalar(O),P.clone().multiplyScalar(O)).setPosition(E.x,E.y,E.z),Ae.setMatrixAt(T,e),va.push(new ot(E.x,E.y,E.z))}Ae.instanceMatrix.needsUpdate=!0,Ae.frustumCulled=!1,Ae.name="weta",p.add(Ae)}const Le=new F.Mesh(T0(),new F.ShaderMaterial({fog:!0,vertexShader:d0,fragmentShader:m0,uniforms:it(["uEel","uTime","uEelY","uWormCol","uGain"])}));Le.frustumCulled=!1,Le.name="eel",p.add(Le);{const e=[],h=[];for(const T of ct)e.push(T.x,T.y,T.z),h.push(T.h,T.period,T.phase,f());const z=new F.Mesh(Ze(ct.length,{iPos:new F.InstancedBufferAttribute(new Float32Array(e),3),iPar:new F.InstancedBufferAttribute(new Float32Array(h),4)}),new F.ShaderMaterial({...xt,vertexShader:p0,fragmentShader:w0,uniforms:it(["uTime","uCamL","uWormCol","uGain"])}));z.frustumCulled=!1,z.renderOrder=4,z.name="drips",p.add(z);const P=[],G=[];for(const T of Q.hdrips)P.push(T[0],T[1],T[2]),G.push(T[3],T[4],T[5],Ct());const I=new F.Mesh(Ze(Q.hdrips.length,{iPos:new F.InstancedBufferAttribute(new Float32Array(P),3),iPar:new F.InstancedBufferAttribute(new Float32Array(G),4)}),z.material);I.frustumCulled=!1,I.renderOrder=4,I.name="drips-hall",p.add(I)}let De=0,ga=0;{const e=E=>(E.index?E.index.count:0)/3;let h=0;for(let E=0;E<St;E++)d.ex[E]>=3&&h++;const z=Yt.reduce((E,$)=>E+e($),0)+e(jt)+e(Yt[1])+e(Zt)+e(ye)+e(Te)+K.par.length/2+j.par.length*5+e(Ae.geometry)*9+e(Le.geometry)+ct.length*2+(Rt-h)*2,P=St-h,G=$t-h,I=he-h,T=nt(Math.floor(Math.min(P*n,(3e5-z)/2)),Math.min(3e3,P),P);Ra.geometry.instanceCount=Math.min($t,T+h),De=nt(T-G,0,he-$t),ga=Math.max(De,Math.floor((he-$t)*n)),pa.geometry.instanceCount=De,Na.geometry.instanceCount=nt(T-I,0,St-he)}const ya=[Q.rankD.i1,Q.rankG.i1];u.axis(tt,R),at.uMirD.value.set(R.x,R.z,R.dx,R.dz),u.axis(J,R),at.uMirE.value.set(R.x,R.z,R.dx,R.dz),await t.yield?.();const Ot={},ne=(e,h=new ot)=>{u.axis(e,Ot);const z=u.camX(e);return h.set(Ot.x+Ot.rx*z,Ot.y+fe,Ot.z+Ot.rz*z)};u.axis(Z,R);const Ke=new ot(R.dx,0,R.dz),xa=new ot(R.rx,0,R.rz),ea=new ot(R.x,R.y,R.z),Oe=ne(Z);at.uMouth.value.copy(ea).addScaledVector(Ke,5).add(new ot(0,3.6,0));const Wa=(e,h,z)=>Oe.clone().addScaledVector(Ke,e).addScaledVector(xa,z).add(new ot(0,h,0)),Ge=[];for(let e=0;e<Z-3;e+=6)Ge.push(ne(e));Ge.push(Oe.clone());const pe=[];{const e=[0,8,22,40,62,85,108,126,130,190],h=[0,6,15,16,13,4,-12,-23,-25,-25],z=[6,4.5,.5,-3,-8.5,-15,-24,-31.5,-33,-33],P=(E,$)=>{let O=0;for(;O<e.length-2&&$>e[O+1];)O++;const Mt=nt(($-e[O])/(e[O+1]-e[O]),0,1),Gt=O>0?(E[O+1]-E[O-1])/(e[O+1]-e[O-1]):0,Bt=O<e.length-2?(E[O+2]-E[O])/(e[O+2]-e[O]):0,ut=e[O+1]-e[O],Tt=Mt*Mt,qt=Tt*Mt;return(2*qt-3*Tt+1)*E[O]+(qt-2*Tt+Mt)*ut*Gt+(-2*qt+3*Tt)*E[O+1]+(qt-Tt)*ut*Bt};let G=0,I=0,T=0;for(let E=1;E<=190;E++){const $=(E>130?-25:P(h,E-.5))*se,O=(E>130?-33:P(z,E-.5))*se;G+=Math.cos(O)*Math.cos($),T+=Math.cos(O)*Math.sin($),I+=Math.sin(O),E%10===0&&pe.push(Wa(G,I,T))}}const Ma=Ge.concat(pe);await t.yield?.();const je=ja(Ma);await t.yield?.();const xe=[0];{const e=ne(0),h=new ot;for(let z=1;z<=Z;z++)ne(z,h),xe.push(xe[z-1]+e.distanceTo(h)),e.copy(h)}const He=xe[Z],_a=He/je.length,Va=e=>{if(e<=0)return e;if(e>=He)return Z+(e-He);let h=0,z=Z;for(;z-h>1;){const P=h+z>>1;xe[P]<=e?h=P:z=P}return h+(e-xe[h])/Math.max(1e-4,xe[z]-xe[h])},Ea=new ot().subVectors(pe[pe.length-1],pe[pe.length-2]).normalize(),ba=ne((Jt+Z)*.5),qa=new ot(ba.x,3,ba.z),Ia=(Z-Jt)*.5+18,Da=11,Ka={entry:{position:ne(0),direction:new ot(0,0,-1)},flyThrough:Ma,cavePath:Ge,arc:pe,pathAt(e,h=new ot){return ne(nt(e,Jt+2,Z),h)},portalSeat:{position:pe[pe.length-1].clone(),normal:Ea.clone().negate(),radius:7,tilt:!0},chandelier:{position:new ot(0,(L.yTop+L.yTip)*.5,0),top:new ot(0,L.yTop,0),tip:new ot(0,L.yTip,0),width:L.RX*2,dist:te},weta:va,mouth:{position:ea.clone(),eye:Oe.clone(),direction:new ot().copy(Ke).add(new ot(0,Math.tan(6*se),0)).normalize(),right:xa.clone(),width:2*u.width(Z),height:u.roof(Z)},plume:{origin:ea.clone().add(new ot(0,.3,0)),velocity:new ot().copy(Ke).multiplyScalar(22*Math.cos(6*se)).add(new ot(0,22*Math.sin(6*se),0)),gravity:9.8},sections:{grotto:[0,tt],tube:[tt,J],dome:[dt,mt],flume:[J,Z],hall:na,bendEnd:u.k3,caveU:_a,caveLen:He,pathLength:je.length},organ:{position:new ot(Q.organ.x,Q.organ.top*.5,Q.organ.z),top:Q.organ.top,s:Q.organ.s},domeK:e=>Ce(e),ranks:Object.fromEntries([["sphere",Q.rankS],["grotto",Q.rankG],["door",Q.rankD],["great",Q.organT],["far",Q.organ]].map(([e,h])=>[e,{position:new ot(h.x,h.top*.5,h.z),top:h.top,s:h.s,lat:h.lat,radius:h.R}])),domeCentre:(u.axis((dt+mt)*.5,Ot),new ot(Ot.x,u.roof((dt+mt)*.5)*.6,Ot.z)),riverAt:Va,speedAt:e=>u.speed(e),drips:ct.map(e=>new ot(e.x,e.y,e.z)),viewpoints:{sphere:ne(21),sphereLook:new ot(0,2.2,0),chandelierPass:ne(45.4),tube:ne(tt+30),hall:ne(dt+20),flume:ne(Z-51),flumeLook:Oe.clone()}};await t.yield?.();let Pe=null,Me=null,ka=!1,za=null;const Ue={position:null,direction:null,speed:0},Ca=new F.Matrix4,be=new ot,Aa=new ot,ke=new ot(0,0,-3),W0=new ot,Fe=new ot,Oa=new ot,aa=new F.Vector2,Ga=e=>{let h=1e12,z=0;for(let G=Jt;G<=Z;G+=2){u.axis(G,Ot);const I=(Ot.x-e.x)**2+(Ot.z-e.z)**2;I<h&&(h=I,z=G)}const P=z;h=1e12;for(let G=P-2;G<=P+2;G+=.25){u.axis(G,Ot);const I=(Ot.x-e.x)**2+(Ot.z-e.z)**2;I<h&&(h=I,z=G)}return z>=Z-.3&&(u.axis(Z,Ot),z=Z+Math.max(0,(e.x-Ot.x)*Ot.dx+(e.z-Ot.z)*Ot.dz)),z};function Pa(e,h,z){p.updateWorldMatrix(!0,!1),Ca.copy(p.matrixWorld).invert(),z&&(z.getWorldPosition?z.getWorldPosition(be):be.copy(z.position),be.applyMatrix4(Ca));const P=Me?Me.position:Pe!=null?je.pointAt(Pe,Oa):be,G=Ga(P);u.axis(Math.min(G,Z),R);let I;Me?(I=Me.speed,ke.copy(Me.direction).multiplyScalar(I)):Pe!=null||!(e>1e-5)||!ka?(I=G>Z?24:u.speed(G),Pe!=null?je.tangentAt(Pe,Fe):Fe.set(R.dx,R.slope,R.dz).normalize(),ke.copy(Fe).multiplyScalar(I)):(Fe.copy(be).sub(Aa).divideScalar(e),Fe.length()<90&&ke.lerp(Fe,1-Math.exp(-e*8)),I=ke.length()),Aa.copy(be),ka=!0;let T=ke.x,E=ke.z;const $=Math.hypot(T,E);$>.2?(T/=$,E/=$):(T=R.dx,E=R.dz),at.uTime.value=h,at.uCamL.value.copy(be),at.uVelL.value.copy(ke),at.uBoat.value.set(P.x+T*3.3,P.z+E*3.3,T,E),at.uBoatP.value.set(I,V(.3,2.5,I)*(1-V(Z-6,Z+1,G)),h,0),at.uBoatS.value=G,at.uRelight.value=Math.max(22,8*I),at.uFlowC.value=u.flow(Math.min(G+4,Z)),at.uShutter.value=.042*V(6,12,I)*(r.streak??1),at.uBrightO.value=at.uBright.value*.5;const O=za??G;pa.geometry.instanceCount=O>tt+4?ga:De,Xt&&Xt.setDrawRange(0,O>we[0]+6?ya[0]:O>Se[0]+6?ya[1]:1/0);const Mt=(G-14.5)/17,Gt=1.15+st(3.4,1.7,Mt),Bt=st(-3.2,3.2,Mt),ut=-E,Tt=T;let qt=T*.42+ut*.91,Ft=E*.42+Tt*.91;const Dt=Math.hypot(qt,Ft)||1;qt/=Dt,Ft/=Dt,at.uEel.value.set(P.x+T*Gt+ut*Bt+qt*1.05,P.z+E*Gt+Tt*Bt+Ft*1.05,qt,Ft),at.uEelOn.value=r.eel===!1?0:V(-.12,.02,Mt)*(1-V(1.05,1.25,Mt)),Le.visible=at.uEelOn.value>.001,t.renderer&&(t.renderer.getDrawingBufferSize(aa),aa.x>0&&at.uRes.value.copy(aa))}return Pa(0,0,null),{object:p,radius:Ia,height:Da,center:qa,anchors:Ka,ground:!1,groundY:0,uniforms:at,chunks:le,counts:{worms:Rt,snares:K.par.length/4},update:Pa,setEyeS(e){za=e},setProgress(e){Pe=e==null?null:nt(e,0,1)},setBoat(e,h,z){if(!e){Me=null;return}Ue.position=e,Ue.direction=h,Ue.speed=z,Me=Ue},setSky(e,h=1){at.uSkyCol.value.set(e).multiplyScalar(h)},dispose(){}}}export{V0 as buildHero};
