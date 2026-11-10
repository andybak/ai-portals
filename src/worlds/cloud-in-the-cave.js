import*as z from"three";import{makePath as Ia,clamp as At,lerp as O,smoothstep as C}from"../kit/core.js";import*as Ua from"../kit/fx.js";import*as Tt from"../kit/flora.js";import*as ue from"../kit/fauna.js";const Ht=z.Vector3,tt=Math.PI*2,qt=Math.PI/180,Ve=(g,q=1)=>new z.Color(g).multiplyScalar(q),yo=g=>At(g,0,1),jt=320.9,he=25*qt,He={x:jt*(1-Math.cos(he)),z:-330-jt*Math.sin(he)};function Ke(g){if(g<=330)return{x:0,z:-g,hx:0,hz:-1};if(g<=470){const j=(g-330)/jt;return{x:jt*(1-Math.cos(j)),z:-330-jt*Math.sin(j),hx:Math.sin(j),hz:-Math.cos(j)}}const q=Math.sin(he),X=-Math.cos(he);return{x:He.x+q*(g-470),z:He.z+X*(g-470),hx:q,hz:X}}function ot(g,q,X=[0,0]){const j=Ke(g);return X[0]=j.x-j.hz*q,X[1]=j.z+j.hx*q,X}function Kt(g,q,X={a:0,l:0}){if(-q<=330)return X.a=-q,X.l=g,X;const j=Math.atan2(-(q+330),jt-g);if(j<=he&&j>=0)return X.a=330+j*jt,X.l=jt-Math.hypot(g-jt,q+330),X;const et=Math.sin(he),W=-Math.cos(he),H=g-He.x,pt=q-He.z;return X.a=470+H*et+pt*W,X.l=H*-W+pt*et,X}const ae={a:620,l:25,A:150,B:115},ut={a:590,l:45,r:65,y:170},pe={a:615,l:60,A:120,B:100,h:90},Qe={a:718,l:-55,h:70,slope:.3},pa=62,kt={a:706,l:-50,y:pa+7.6},me={a:729,l:-58,r:15,y1:100,depth:26},ma=570,Pt={a:300,drop:38,y:0},x0={a0:82,a1:112,a2:176,a3:204},va=72*qt,b0=58*qt,Fe={a0:432,a1:462,a2:540,a3:588,top:22,drop:3,max:25},M0=[{a:222,side:-1,gap:14,h:62,r:8,lean:0,ly:28.5,form:"tiers"},{a:236,side:1,gap:13,h:78,r:10,lean:0,ly:29.5,form:"tiers"},{a:314,side:-1,gap:21,h:46,r:6.5,lean:11*qt,ly:31.8,form:"broken"},{a:288,side:-1,gap:17,h:33,r:5,lean:0,ly:31.2,form:"bell"},{a:322,side:1,gap:12,h:44,r:6,lean:0,ly:32,form:"candles"},{a:64,side:-1,gap:22,h:25,r:5.5,lean:0,ly:9,form:"tiers"},{a:410,side:1,gap:.5,h:60,r:4.5,lean:0,ly:48,form:"column"},{a:434,side:1,gap:2,h:34,r:4,lean:0,ly:53,form:"organ"}],ga=100,wa=ot(M0[6].a,M0[6].gap+5.2);function mt(g){const q=C(100,150,g);let X=O(37,72,q)-8*C(240,330,g)+6*Math.sin(g*.021+1);X-=55*Math.exp(-Math.pow((g-385)/27,2)),X-=30*Math.exp(-Math.pow((g-Pt.a)/15,2));let j=-(O(104,72,C(40,135,g))+5*Math.sin(g*.017+4)),et=168+14*Math.sin(g*.011+.6)+8*Math.sin(g*.027+2);const W=(g-ae.a)/ae.A;if(Math.abs(W)<1){const H=ae.B*Math.sqrt(1-W*W),pt=C(470,500,g);X=Math.max(X,ae.l+H),j=Math.min(j,ae.l-H),et=O(et,186,pt)}if(g>ae.a){const H=Math.abs(W)<1?ae.B*Math.sqrt(1-W*W):0;X=ae.l+H,j=ae.l-H}return{left:j,right:X,roof:et}}const Oa=[[0,0,9],[30,0,9],[60,0,9],[100,0,13],[145,0,18.5],[190,0,25.5],[228,0,29.5],[262,1,30.5],[296,-3,31.5],[328,-6.5,32],[362,-10,35.5],[394,-16,44],[424,-20,51.5],[452,-24,55],[490,-29,50],[528,-34,38],[566,-48,23.2],[596,-42,30.5],[624,-37.5,42.5],[652,-36.5,55.5],[679,-41,66.8],[kt.a,kt.l,kt.y]],ce=[110,250,330,448],ya=g=>9*C(ce[0],ce[1],g)+24*C(ce[2],ce[3],g),Ie={n:60,rise:[]};{let g=0;for(let q=0;q<=Ie.n;q++)Ie.rise.push(g),g+=.25+1.4*Math.abs(Math.sin(q*2.39+.7))*(.35+.65*Math.abs(Math.sin(q*.9+2)))}const xa=g=>O(14,-5,C(70,104,g))-21*C(110,215,g),gt={a0:ce[1],a1:ce[2],l:9,half:31,f:0},Wa=(g,q)=>C(gt.a0-8,gt.a0+8,g)*(1-C(gt.a1-8,gt.a1+6,g))*(1-C(gt.half-7,gt.half+5,Math.abs(q-gt.l)));function ba(g,q){const X=q-xa(g),j=At((X-14)/28,0,1);return .6+.1*X+.16*(Math.min(X,14)+28*(j-j*j*j+.5*j*j*j*j))+ya(g)+.8*Math.sin(g*.105+q*.06)+.35*Math.sin(q*.21-g*.045+1.7)+.1*Math.sin(g*.38+2*Math.sin(q*.3))+.17*Math.sin(g*.27-q*.19+2.1*Math.sin(q*.13+g*.07))+.07*Math.sin(g*.71+q*.93)}gt.f=Math.floor(ba(290,gt.l))+.5;function k0(g,q){const X=q-xa(g),j=C(74,92,g)*(1-C(452,468,g))*C(0,6,X),et=O(ba(g,q),gt.f,Wa(g,q));return{f:At(et,0,Ie.n-.01),zone:j}}function z0(g){const q=Math.floor(g);return Ie.rise[q]+(Ie.rise[q+1]-Ie.rise[q])*(g-q)}Pt.y=1.2+.011*Pt.a+z0(gt.f);const A0=g=>1-C(62,96,g),$e=g=>9*A0(g)-20*C(62,100,g)-26*C(104,160,g)+3.5*Math.sin(g*.019+.4)*C(60,140,g),l0=g=>(12+2*Math.sin(g*.033))*(1-.6*C(418,446,g))+22*A0(g),ve=g=>{const q=Math.max(ya(g)-.9,0)/3.4,X=Math.floor(q);return .011*At(g,-100,460)+z0(At(3.4*(X+C(O(.82,.3,C(328,348,g)),1,q-X)),0,Ie.n-1))};function Re(g,q){if(g<455)return 0;const X=Math.hypot((g-pe.a)/pe.A,(q-pe.l)/pe.B),j=Math.hypot(g-Qe.a,q-Qe.l);return C(455,500,g)*Math.max(1-C(.86,1.06,X),.7*(1-C(70,125,j)),.12)}const _a=76,Ma=[{a:290,l:gt.l,r:50},{a:352,l:10,r:13},{a:388,l:-2,r:12},{a:424,l:-6,r:12}],Bt={a:98,l:11,r:4.2},Rt={a0:20,a1:84,l0:-30,l1:-62,y:2.6};function Va(g,q,X,j=Kt(g,q)){const et=j.a,W=j.l,H=mt(et),pt=X.fbm2(g*.021,q*.021,3),J=X.n2(g*.09+7.1,q*.09-3.3),wt=X.n2(g*.31,q*.31),yt=$e(et),dt=l0(et),$t=ve(et),Et=Math.abs(W-yt)-dt,Gt=Math.min(W-H.left,H.right-W);let Lt=$t+(Et<0?-1.6*C(0,-6,Et)-.5:2.6*C(0,9,Et)-.5)+1.4*pt*C(2,20,Et)+.35*J*C(0,8,Et);Lt+=13*Math.pow(1-C(0,34,Gt),1.7)*(1-A0(et)*C(yt-30,yt-10,W));const Ue=C(Rt.a0-12,Rt.a0+6,et)*(1-C(Rt.a1-4,Rt.a1+14,et))*C(Rt.l0+7,Rt.l0-3,W)*(1-C(Rt.l1+6,Rt.l1-10,W));Lt=O(Lt,$t+Rt.y+.12*J,Ue);const we=k0(et,W);we.zone>0&&(Lt=O(Lt,1.2+.011*et+z0(we.f),we.zone));const zt=Math.hypot(et-Bt.a,W-Bt.l);if(zt<Bt.r+2&&(Lt=O(Lt,1.2+.011*et+z0(k0(Bt.a,Bt.l).f)+.1,1-C(Bt.r-.6,Bt.r+1.6,zt))),et>440){const St=Math.hypot((et-pe.a)/pe.A,(W-pe.l)/pe.B),c0=St<1?pe.h*(1-Math.pow(St,2.2))*(1+.1*pt)+4*J*C(0,.4,St):0,fe=Math.hypot(et-Qe.a,W-Qe.l),Oe=Math.min(Qe.h-Qe.slope*fe+2.5*pt*C(26,60,fe)+1.6*J*C(28,50,fe),pa+.25*J),ye=Math.max(c0,Oe,15+27*(1-C(456,522,et))+5*pt+2*J+.8*wt*(1-C(456,522,et)));Lt=O(Lt,ye,C(450,482,et))}return Lt}const Xe=16,ka=6,W0=`
float h21(vec2 p){ vec3 q=fract(vec3(p.xyx)*vec3(.1031,.1030,.0973)); q+=dot(q,q.yzx+33.33); return fract((q.x+q.y)*q.z); }
float h31(vec3 p){ p=fract(p*vec3(.1031,.1030,.0973)); p+=dot(p,p.yxz+33.33); return fract((p.x+p.y)*p.z); }
float vn2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y); }
float vn3(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  float a=h31(i), b=h31(i+vec3(1,0,0)), c=h31(i+vec3(0,1,0)), d=h31(i+vec3(1,1,0));
  float e=h31(i+vec3(0,0,1)), g=h31(i+vec3(1,0,1)), h=h31(i+vec3(0,1,1)), k=h31(i+vec3(1,1,1));
  return mix(mix(mix(a,b,f.x),mix(c,d,f.x),f.y),mix(mix(e,g,f.x),mix(h,k,f.x),f.y),f.z); }
`,Qt=`
#define NL ${Xe}
#define NPG ${ka}
uniform float uTime;
uniform vec3 uSunDir;            // toward the sun
uniform vec4 uSkyC;              // the skylight: x, rim height, z, mean radius
uniform vec4 uDomeM;             // the dome's middle: x, z, and the radius inside which the daylight is whole; w: falloff length
uniform vec3 uDayCol, uSunCol, uAirCol, uAirDome, uBounce, uSeaCol;
uniform vec3 uDayDome;           // the day under the roof opening itself: green-gold, the sky's light off a sunlit jungle
uniform vec3 uCool;              // the cool blue light every wet face of the passage gives every other: no rock is black
uniform vec2 uLampW[NL];         // each lamp's wash: its strength, and how far it reaches (m); a wide, soft, warm light all round the lamp
uniform vec4 uPoolG[NPG];        // the pools that glow from within: x, z, radius (m), the water's height
uniform vec4 uAirK;              // air density in the passage, in the dome, gain of the glow, spare
uniform vec4 uSea;               // the mist's layer: its top (m), how far the top sinks toward its near end (m), the density of a bank (to a metre), how soft the banks' edges are (1: the usual)
uniform vec4 uSeaA;              // its ends. Near (the passage runs along -z there): -z where the first veils lie, and where the layer is whole. Far: metres along the dome's axis where it thins, and where it is gone
uniform vec4 uSeaB;              // the dome's axis: its point at a 470 (x, z) and its heading (x, z)
uniform vec2 uDrift;             // the way the cave's air moves: toward the dome
uniform vec4 uWash[4];           // the lit flanks of the tallest tower and of the lake's three islands, for still water to mirror: x, z, and the heights each is lit between
uniform vec3 uWashC[4];
uniform vec4 uGlowP;             // where the pillar of sun stands on the forest (the middle of its lit pool), and how much of its light the lit leaves and the lit air give back
uniform vec4 uLampP[NL];         // place, reach
uniform vec4 uLampD[NL];         // direction, cosine of the half cone (-2: all round)
uniform vec3 uLampC[NL];
uniform vec4 uUp;                // the lamp-lit pool among the first terraces (x, y, z) and how far its light reaches up to the hanging roof over it
uniform vec4 uCFall;             // the cave's fall: its foot on the lake (x, the water's height, z), w 1
${W0}
float upPassage(vec3 p){ return max(length(p.xz-uDomeM.xy)-uDomeM.z,0.0); }
// (the day: whole in the dome, falling off fast up the passage: the mouth is a dark frame; far up it a fifth is left, a blue glow)
float dayAt(vec3 p){ float d=upPassage(p)/uDomeM.w; return 0.24+0.76/(1.0+d*d); }
// the shaft of sun: the slanted round pillar under the skylight, soft at its edge
// (a place seen down the sun's own direction from the skylight: q is its offset from the hole's middle, the result the hole's radius that way)
float shaftRim(vec3 p, out vec2 q, out float t){
  t=(uSkyC.y-p.y)/uSunDir.y;
  q=p.xz+uSunDir.xz*t-uSkyC.xz;
  vec2 d=q/max(length(q),1e-3);                                      // (the rim's three and seven lobes, written out in the direction's own cosine and sine)
  float c=d.x, s=d.y, c2=c*c, s2=s*s;
  float c3=c*(4.0*c2-3.0), s3=s*(3.0-4.0*s2), c4=1.0-8.0*c2*s2, s4=4.0*s*c*(c2-s2);
  float c7=c3*c4-s3*s4, s7=s3*c4+c3*s4;
  return uSkyC.w*(1.0+0.07*(s3*0.5403+c3*0.8415)+0.05*(s7*-0.6536+c7*-0.7568));
}
// THE BEAMS. The rim's trees and lianas break the sun: inside the pillar the light comes down in several broad beams of
// unequal width and strength, soft at their edges, with darker air between them. A beam is the same all the way down the
// sun's own direction (q is the place seen down that direction), and sways a little as the trees do
float beamAtF(vec2 q, float f){                                       // (f: how fine the bundle is; 1 for the great pillar)
  q=q*f+vec2(31.0,17.0)*(f-1.0);
  vec2 sw=vec2(sin(uTime*0.11+q.y*0.03),cos(uTime*0.09+q.x*0.025))*1.6;
  float a=vn2((q+sw)*0.043+vec2(3.1,7.7)), b=vn2((q+sw*1.4)*0.097+11.0);
  float broad=smoothstep(0.36,0.60,a), fine=smoothstep(0.38,0.70,b);
  return 0.07+0.93*broad*(0.4+0.6*fine)+0.22*fine*(1.0-broad);
}
float beamAt(vec2 q){ return beamAtF(q,1.0); }
// how far inside the pillar's round a place is (1 inside, soft at the edge), whatever the beams there
float shaftIn(vec3 p){
  if(p.y>uSkyC.y+30.0) return 0.0;
  vec2 q; float t; float R=shaftRim(p,q,t), r=length(q);
  float soft=4.0+0.06*max(t,0.0);
  return 1.0-smoothstep(R-soft*1.6,R+soft*0.4,r);
}
// the sun at a place: the pillar's round times the beam that passes through it
float shaftAt(vec3 p){
  if(p.y>uSkyC.y+30.0) return 0.0;
  vec2 q; float t; float R=shaftRim(p,q,t), r=length(q);
  float soft=4.0+0.06*max(t,0.0);
  float m=1.0-smoothstep(R-soft*1.6,R+soft*0.4,r);
  if(m<=0.0) return 0.0;
  return m*beamAt(q);
}
// the wet air about the pillar: whole inside, fading over some tens of metres outside
float shaftNear(vec3 p){ vec2 q; float t; float R=shaftRim(p,q,t); return exp(-max(length(q)-R,0.0)/26.0)*step(p.y,uSkyC.y); }
// under the forest's crowns the sun comes down in flecks that wander as the leaves move
float gSunK=1.0, gMirror=0.0, gAmb=0.0, gRim=0.09, gSheen=1.0;
float fleckAt(vec3 p){
  vec2 q=p.xz*0.3+vec2(sin(uTime*0.37+p.z*0.21),cos(uTime*0.31+p.x*0.19))*0.22;
  return smoothstep(0.52,0.7,vn2(q)*0.6+vn2(q*2.7+5.0)*0.4);
}
vec3 airGlow(vec3 p){ return uAirCol*((0.12+0.88*dayAt(p))*(0.5+0.5*smoothstep(-10.0,130.0,p.y))); }   // (the far end of the passage is a dim blue haze, never black)
// the sun given back by the pillar's foot: the burning crowns and the lit air there are a warm lamp to the whole dome, strongest
// on what faces them and falling off with distance
vec3 pillarGlow(vec3 p, vec3 N){
  vec3 d=uGlowP.xyz-p; float r=max(length(d),1e-3);
  return uSunCol*(uGlowP.w*(0.3+0.7*max(dot(N,d/r),0.0))/(1.0+r*r/14400.0));
}
// the lamps: each a pool of light where it is turned (cut at its reach) and, all round it, a wide soft warm wash that
// falls off gently and is gone at its own reach (uLampW: stone 60 m and more from a lamp still takes its gold; a face
// turned from the lamp takes a third of it, as from the lit rock about it); spec: their glint on wet rock
#define WASH_COL vec3(1.0,0.66,0.33)
vec3 lampsAt(vec3 p, vec3 N, vec3 V, float wet, out vec3 spec){
  vec3 dif=vec3(0.0); spec=vec3(0.0);
  // (damp air drifts through every beam: the lamp stands steady, its pool of light on the rock shifts slowly by a fifth)
  float drift=0.78+0.44*vn3(vec3((p.xz-uDrift*(uTime*1.75))*0.05,p.y*0.05+uTime*0.1));
  for(int i=0;i<NL;i++){
    vec3 d=uLampP[i].xyz-p; float r2=dot(d,d), reach=uLampP[i].w, wr=uLampW[i].y;
    if(r2<max(reach*reach,wr*wr)){
      float r=sqrt(r2); vec3 L=d/max(r,1e-3);
      float nl=dot(N,L);
      dif+=WASH_COL*(uLampW[i].x*(1.0-smoothstep(wr*0.5,wr,r))/(1.0+r2/(wr*wr*0.04))*(0.3+0.7*max(nl,0.0)));
      // (and every head lamp stands in a small warm pool of its own light: the ground about the caver's feet and the caver, within some 4 m)
      if(i>1&&i<NL-1) dif+=WASH_COL*(1.7*exp(-r2/7.0));
      if(r2<reach*reach){
        float cone=uLampD[i].w<-1.5?1.0:smoothstep(uLampD[i].w-0.22,uLampD[i].w+0.12,dot(-L,uLampD[i].xyz));
        float fall=(1.0-smoothstep(reach*0.5,reach,r))*cone/(1.0+r2*0.06)*drift;
        dif+=uLampC[i]*(fall*(max(nl,0.0)*0.85+0.15*max(nl*0.5+0.5,0.0)));
        vec3 H=L+V; H=H/max(length(H),1e-3); float s=max(dot(N,H),0.0); s*=s; s*=s; s*=s; s*=s;
        spec+=uLampC[i]*(fall*s*wet*0.5*gSheen*smoothstep(-0.03,0.14,nl));   // (a broad soft glint: no bright dashes along the beds)
      }
    }
  }
  // (the pool a lamp is turned into gives its gold up to the roof that hangs over the first staircase: only what stands
  // well over it takes this light)
  { vec3 d=uUp.xyz-p; float r2=dot(d,d); if(d.y<-7.0&&r2<uUp.w*uUp.w){ float r=sqrt(r2);
      dif+=WASH_COL*(1.9*(1.0-smoothstep(uUp.w*0.55,uUp.w,r))/(1.0+r2/1500.0)*(0.35+0.65*max(dot(N,d/r),0.0))); } }
  return dif;
}
// THE POOLS THAT GLOW FROM WITHIN give their turquoise up to what stands over and about them: the nearest walls, the
// draperies, the towers' feet
vec3 poolsAt(vec3 p, vec3 N){
  vec3 g=vec3(0.0);
  for(int i=0;i<NPG;i++){
    vec3 d=vec3(uPoolG[i].x,uPoolG[i].w,uPoolG[i].y)-p; float r2=dot(d,d), R=min(uPoolG[i].z,24.0)*3.0+12.0;
    if(r2<R*R*9.0&&d.y<2.0){ float r=sqrt(r2); g+=vec3(0.07,0.62,0.52)*((1.0-smoothstep(R*1.5,R*3.0,r))/(1.0+r2/(R*R*0.25))*(0.3+0.7*max(dot(N,d/max(r,1e-3)),0.0))); }
  }
  return g;
}
// the ring's own glow on a leaf (the last lamp of the list, all round)
vec3 ringLight(vec3 p, vec3 N){
  vec3 d=uLampP[NL-1].xyz-p; float r2=dot(d,d), reach=uLampP[NL-1].w;
  if(r2>=reach*reach) return vec3(0.0);
  float r=sqrt(r2);
  return uLampC[NL-1]*((1.0-smoothstep(reach*0.5,reach,r))/(1.0+r2*0.06)*(0.35+0.65*max(dot(N,d/max(r,1e-3)),0.0)));
}
// THE GROUND MIST of the dome's hollow: a thin layer of wet air that lies between two heights under the flown line (its
// top is level: uSea.x, a little lower toward its two ends; its foot 13 m under that) from the threshold's far slope to
// the mound's foot, in banks with gaps between them; there is none in the cave. It is air and nothing else: every shader of the world works out how
// much of it lies between the eye and a place, so that whatever stands in it or under it fades into it by its own depth
// and is seen through its gaps; nothing is drawn for it, and nothing under it is unmade.
// mistEdge: how much of the layer there is at a place in plan (its two ends are torn and creep with the cave's wind)
float mistEdge(vec2 xz){
  vec2 q=xz-uDrift*(uTime*2.0);
  float n=vn2(q*0.045);
  float aD=470.0+dot(xz-uSeaB.xy,uSeaB.zw);
  return smoothstep(uSeaA.x,uSeaA.y,-xz.y-26.0*n)*(1.0-smoothstep(uSeaA.z,uSeaA.w,aD+22.0*(n-0.5)));
}
// the layer's top at a place
float mistTop(vec2 xz){
  float aD=470.0+dot(xz-uSeaB.xy,uSeaB.zw);
  return uSea.x-uSea.y*(1.0-smoothstep(uSeaA.x,uSeaA.y+15.0,-xz.y))-5.0*smoothstep(uSeaA.z-25.0,uSeaA.w,aD);
}
// the banks: 1 in a bank, 0 in a gap. They travel toward the dome and turn over on the world's clock (a large size, and a
// smaller one that runs ahead of it)
float mistBank(vec2 xz){
  vec2 q=xz-uDrift*(uTime*2.5), r=vec2(q.x*0.8+q.y*0.6,-q.x*0.6+q.y*0.8)-uDrift*(uTime*1.3);
  float b=vn2(q*0.019+vec2(uTime*0.013,0.0))*0.6+vn2(r*0.052+vec2(4.0,uTime*0.035))*0.4;
  return smoothstep(0.5-0.17*uSea.w,0.5+0.17*uSea.w,b);
}
#define MIST_DEEP 13.0
// its density at a place (to a metre of the eye's ray): a bank stands to the layer's top and is thick; in a gap the mist
// lies some metres lower and is thin; top and foot are soft
float mistDen(vec3 p){
  float k=mistEdge(p.xz);
  if(k<=0.0) return 0.0;
  float top=mistTop(p.xz), b=mistBank(p.xz);
  float up=smoothstep(0.0,3.0+3.0*b,top-5.5*(1.0-b)-p.y), lo=smoothstep(top-MIST_DEEP-4.0,top-MIST_DEEP+3.0,p.y);
  return uSea.z*k*k*(0.09+0.91*b*b)*up*lo;
}
// its light at a place of it, to an eye that looks along V. The mist is LIT air: a pale blue-white where only the cave's
// own cool light finds it, white-gold where the dome's day stands behind it (from the bend on it is a bright bank: what
// stands before it stands dark against it), warm inside the sun's pillar; high in the layer it takes the light, deep in
// it it lies in its own shade
vec3 mistLight(vec3 p, vec3 V){
  float day=dayAt(p), hk=clamp((p.y-(mistTop(p.xz)-MIST_DEEP))/MIST_DEEP,0.0,1.0);
  vec3 Ld=vec3(uSkyC.x,uSkyC.y-30.0,uSkyC.z)-p; Ld=Ld/max(length(Ld),1e-3);
  float fw=max(dot(V,Ld),0.0); fw*=fw; fw*=fw;
  vec3 c=uSeaCol*((0.09+0.55*day)*(0.30+0.45*hk)*(1.0+1.2*fw));
  c+=vec3(1.0,0.90,0.68)*(smoothstep(0.52,0.98,day)*(0.11+0.31*hk)*(1.0+1.6*fw));
  c+=vec3(1.0,0.87,0.62)*(shaftAt(p)*(0.3+0.8*hk));
  return c;
}
// and what the lamps and the glowing pools give it: the lamps' gold in the mist about them, the pools' turquoise in the
// mist that lies over them
vec3 mistGlow(vec3 q){
  vec3 g=vec3(0.0);
  for(int i=2;i<NL-1;i++){ vec3 d=uLampP[i].xyz-q; float wr=uLampW[i].y, r2=dot(d,d); if(r2<wr*wr) g+=WASH_COL*(uLampW[i].x*0.3*(1.0-smoothstep(wr*0.5,wr,sqrt(r2)))/(1.0+r2/(wr*wr*0.03))); }
  for(int i=0;i<NPG;i++){ vec3 d=vec3(uPoolG[i].x,uPoolG[i].w,uPoolG[i].y)-q; float r2=dot(d,d), R=uPoolG[i].z*2.0+8.0; if(r2<R*R*9.0) g+=vec3(0.04,0.62,0.54)*(1.2*(1.0-smoothstep(R*1.5,R*3.0,sqrt(r2)))/(1.0+r2/(R*R*0.3))); }
  return g;
}
// THE MIST BETWEEN THE EYE AND A PLACE: rgb the light it gives the eye on the way, a how much of the place it takes.
// The eye's ray is cut to the layer's two heights and walked in five steps, close together where it enters the layer.
// The air about the eye is clear: within some 35 m of it the mist is a fifth as thick and it comes to its whole
// thickness 95 m off, so what stands near is sharp and the mist lies low and far
#define MIST_STEPS 5
vec4 mistBetween(vec3 p){
  vec3 o=cameraPosition, v=p-o;
  if(max(-o.z,-p.z)<uSeaA.x-30.0) return vec4(0.0);                  // (both ends short of the layer's near end)
  float yT=uSea.x, yB=uSea.x-uSea.y-MIST_DEEP-4.0, t0=0.0, t1=1.0;
  if(abs(v.y)<1e-4){ if(o.y>yT||o.y<yB) return vec4(0.0); }
  else { float ta=(yT-o.y)/v.y, tb=(yB-o.y)/v.y; t0=max(0.0,min(ta,tb)); t1=min(1.0,max(ta,tb)); if(t1<=t0) return vec4(0.0); }
  float len=max(length(v),1e-3), L=(t1-t0)*len, T=1.0;
  vec3 acc=vec3(0.0), V=v/len, glow=mistGlow(o+v*(t0+(t1-t0)*0.3));
  // (the cloud's top is not flat: it rolls in billows some 12 m across, lit on their crowns and grey in their folds)
  vec2 bq=(o.xz+v.xz*t0)-uDrift*(uTime*2.5);
  float bil=0.44+1.08*vn2(bq*0.085);
  // (the glowing pools burn through the mist that lies on them: what stands within a pool's round is seen through an
  // eighth of it)
  for(int i=2;i<NPG;i++){ vec2 d=p.xz-uPoolG[i].xy; float R=uPoolG[i].z; L*=0.12+0.88*smoothstep(R*R*0.75,R*R*1.5,dot(d,d)); }
  for(int i=0;i<MIST_STEPS;i++){
    float f0=float(i)/float(MIST_STEPS), f1=float(i+1)/float(MIST_STEPS), s0=f0*f0, s1=f1*f1, tq=t0+(t1-t0)*0.5*(s0+s1);
    vec3 q=o+v*tq;
    float d=mistDen(q)*(s1-s0)*L*mix(0.2,1.0,smoothstep(35.0,95.0,tq*len));
    if(d>0.0){ float a=1.0-exp(-d); acc+=(mistLight(q,V)*bil+glow)*(T*a); T*=1.0-a; }
  }
  return vec4(acc,1.0-T);
}
// the world's air: the ground mist's layer first (it lies in the dome's hollow only), then a haze by distance toward the
// glow of the place: more of it up the dark passage (the far towers pale and blue), less in the dome. No banks of mist in the cave.
vec3 airApply(vec3 col, vec3 p){
  { vec4 mk=mistBetween(p); col=col*(1.0-mk.a)+mk.rgb; }
  vec3 dv=p-cameraPosition; float dist=length(dv);
  float kp=smoothstep(130.0,330.0,upPassage(p)), kc=smoothstep(130.0,330.0,upPassage(cameraPosition));
  float f=1.0-exp(-mix(uAirK.y,uAirK.x,0.5*(kp+kc))*dist);
  vec3 fc=mix(airGlow(p),airGlow(cameraPosition),0.3)*uAirK.z;
  fc=mix(fc,uAirDome,(1.0-kp)*0.65);
  return mix(col,fc,clamp(f,0.0,1.0));
}
// the forest's own breath: the air between the crowns is damp, so what stands far off in the forest is paler and bluer than
// what stands near (and a little warm about the pillar's foot)
vec3 forestAir(vec3 col, vec3 p){
  float d=length(p-cameraPosition);
  vec3 hz=uDayCol*(dayAt(p)*0.11)+uSunCol*(shaftNear(p)*0.01);
  return airApply(mix(col,hz,1.0-exp(-d*0.0032)),p);
}
// rock, sand, moss: everything solid is lit here. ao: occlusion baked at the vertex
vec3 caveLight(vec3 p, vec3 N, vec3 alb, float wet, float ao){
  vec3 V=cameraPosition-p; V=V/max(length(V),1e-3);
  ao=0.26+0.74*ao;                                                   // (the deepest hollow still takes a quarter of the light about it: no bay is bare dark)
  float day=dayAt(p), inDome=1.0-smoothstep(0.0,150.0,upPassage(p));
  vec3 Ld=vec3(uSkyC.x,uSkyC.y-30.0,uSkyC.z)-p; Ld=Ld/max(length(Ld),1e-3);
  float ndl=dot(N,Ld), hl=ndl*0.5+0.5, wrap=max(ndl*0.72+0.28,0.0); wrap=wrap*wrap+0.1+gAmb;
  wrap=mix(wrap,0.11+0.62*hl*hl+0.42*max(N.y,0.0)+gAmb,inDome);                      // under the roof opening the light comes from a wide hole: tops are bright, no face is left black
  vec3 dc=mix(uDayCol,uDayDome,day*day);                                              // far up the passage the day is a blue glow; from the bend on it is the green-gold day of the opening itself
  vec3 col=alb*dc*(day*wrap*ao);
  // the lit air on every side gives a little to the faces turned from the dome, so that no tower is a flat black shape
  col+=alb*airGlow(p)*(uAirK.z*ao*(0.46+0.22*N.y)*(1.0-inDome));
  // THE COOL BOUNCE: every wet face of the passage gives a little cool blue light to every other, most to what looks up
  // and to what looks toward the day, least into the hollows (ao): the darkest wall is a deep blue-grey whose forms read
  col+=alb*uCool*(ao*(0.5+0.16*N.y+0.5*hl*hl)*(1.0-0.5*inDome));
  col+=alb*poolsAt(p,N)*ao;
  // and every edge of the rock that is turned toward the dome carries a thin cold rim of its day, wet or dry
  { float nv0=1.0-max(dot(N,V),0.0); col+=dc*(day*ao*nv0*nv0*nv0*max(ndl+0.3,0.0)*0.09*(1.0-inDome)); }
  // the ground mist's pale glow from below, on what stands over it in the dome's hollow
  if(p.y>uSea.x-1.0){ float sk=mistEdge(p.xz)*smoothstep(-1.0,8.0,p.y-uSea.x);
    if(sk>0.0){ vec3 sp=vec3(p.x,uSea.x,p.z);
      col+=alb*uSeaCol*(dayAt(sp)*1.5*sk*ao*(0.62-0.38*N.y)*(0.3+0.7/(1.0+(p.y-uSea.x)*0.03))); } }
  vec3 H=Ld+V; H=H/max(length(H),1e-3);
  float nh=max(dot(N,H),0.0); float s=nh*nh; s*=s; s*=s; s*=s; s*=s;
  float nv=1.0-max(dot(N,V),0.0); float fr=nv*nv; fr*=fr;
  col+=dc*(day*ao*wet*(s*0.2+fr*max(ndl+0.25,0.0)*gRim)*(1.0-0.65*day*day));
  float sh=shaftAt(p)*ao*gSunK, ns=max(dot(N,uSunDir),0.0);
  col+=alb*uSunCol*(sh*ns);
  vec3 Hs=uSunDir+V; Hs=Hs/max(length(Hs),1e-3); float ss=max(dot(N,Hs),0.0); ss*=ss; ss*=ss; ss*=ss; ss*=ss; ss*=ss;
  col+=uSunCol*(sh*wet*ss*0.6);
  col+=alb*uBounce*(inDome*ao*(0.72-0.28*N.y));                                      // the lit forest and cloud top give their light back inside the dome, most to what looks down on them: the roof's underside is a dim green-gold, never black
  col+=alb*pillarGlow(p,N)*ao;
  vec3 ls; vec3 ld=lampsAt(p,N,V,wet,ls); col+=alb*ld; col+=ls;
  // WET SHEEN AND GLINTS, from the eye's direction: a wet face of the passage seen at a low angle carries a sheen of the
  // light that lies on it, and the beads of water on it (some 40 cm apart) flash and go out as the eye moves past
  { float up=upPassage(p), bead=smoothstep(0.78,0.9,vn3(p*2.6+V*2.1))*(1.0-smoothstep(16.0,70.0,length(cameraPosition-p)));
    col+=(ld*0.5+uCool*0.55)*(min(wet,1.2)*ao*(0.12*fr+0.8*bead)*gSheen*(1.0-gMirror)*smoothstep(0.0,40.0,up));
    // (from the lake on, the day of the mouth lies on the roof: what hangs high over the last stairs and looks down
    // takes a pale green-gold, strongest toward the mouth)
    col+=alb*uDayDome*(ao*smoothstep(55.0,115.0,p.y)*max(0.3-0.7*N.y,0.0)*smoothstep(0.0,30.0,up)*(1.0-smoothstep(40.0,200.0,up))*0.36);
    // (and no corner of the passage is black: the deepest of it holds a little of the cave's own blue)
    col+=vec3(0.004,0.011,0.010)*(gSheen*smoothstep(0.0,60.0,up)); }
  vec3 R=reflect(-V,N); col+=airGlow(p+R*140.0)*(uAirK.z*wet*ao*fr*0.12*(1.0-0.7*gMirror));   // the glowing air mirrored in what is wet
  if(gMirror>0.0){
    col+=uDayCol*(dayAt(p+R*220.0)*gMirror*(0.03+0.97*fr)*0.07);                    // still water: a mirror of the far daylight (dark teal, never a pale sheet)
    for(int i=0;i<4;i++){                                                             // and of the lit towers that stand in or over it
      vec2 dxz=uWash[i].xy-p.xz; float tt=dot(dxz,R.xz)/max(dot(R.xz,R.xz),1e-4);
      if(tt>0.0){ vec3 q=p+R*tt; vec2 o2=q.xz-uWash[i].xy;
        col+=uWashC[i]*(gMirror*exp(-dot(o2,o2)/(0.012*tt*tt+16.0))*smoothstep(uWash[i].z-6.0,uWash[i].z+4.0,q.y)*(1.0-smoothstep(uWash[i].w-12.0,uWash[i].w+6.0,q.y))*(0.3+0.7*fr)); } }
  }
  return col;
}
`,Ha=`
attribute vec4 aA; attribute vec3 aC;
varying vec3 vP, vN, vC; varying vec4 vA;
void main(){
  vec4 wp=vec4(position,1.0); vec3 n=normal;
  #ifdef USE_INSTANCING
  wp=instanceMatrix*wp; n=mat3(instanceMatrix)*n;
  #endif
  wp=modelMatrix*wp; vP=wp.xyz; vN=mat3(modelMatrix)*n; vC=aC; vA=aA;
  gl_Position=projectionMatrix*viewMatrix*wp;
}`,Ka=`
varying vec3 vP, vN, vC; varying vec4 vA;     // vA: occlusion, green cover, wetness, kind (walls: flowstone 0..1; FLOOR: how much of a rimstone terrace the place is, or -1 less the forest's cover)
uniform vec3 uTone;                           // band contrast, relief, calcite (0 limestone .. 1 pale flowstone)
uniform float uRain, uShade;
uniform vec4 uPearl;                          // the dried pool of pearls: x, z, radius
${Qt}
#ifdef FLOOR
// the rimstone terraces: whole numbers of this are the dams' crests (the passage runs along -z there, and x is metres to the
// right of the line). The dams stand 4 m apart beside the line and 10 m apart toward the wall. g: dams to a metre across
float gourF(vec2 xz, out float g){
  float a=-xz.y, l=xz.x;                                             // (axis coordinates: the passage is straight to a 330, then bends to the right)
  if(a>330.0){ float t=atan(-(xz.y+330.0),${jt.toFixed(1)}-xz.x);
    if(t<=${he.toFixed(5)}){ a=330.0+t*${jt.toFixed(1)}; l=${jt.toFixed(1)}-length(vec2(xz.x-${jt.toFixed(1)},xz.y+330.0)); }
    else { vec2 d=xz-uSeaB.xy; a=470.0+dot(d,uSeaB.zw); l=d.x*-uSeaB.w+d.y*uSeaB.z; } }
  float x=l-mix(14.0,-5.0,smoothstep(70.0,104.0,a))+21.0*smoothstep(110.0,215.0,a), u=clamp((x-14.0)/28.0,0.0,1.0);
  float lk=smoothstep(${(gt.a0-8).toFixed(1)},${(gt.a0+8).toFixed(1)},a)*(1.0-smoothstep(${(gt.a1-8).toFixed(1)},${(gt.a1+6).toFixed(1)},a))*(1.0-smoothstep(${(gt.half-7).toFixed(1)},${(gt.half+5).toFixed(1)},abs(l-${gt.l.toFixed(1)})));
  g=mix(0.10+0.16*(1.0-u*u*(3.0-2.0*u))+0.11*smoothstep(110.0,215.0,a),0.12,lk);
  float f=0.6+0.10*x+0.16*(min(x,14.0)+28.0*(u-u*u*u+0.5*u*u*u*u))+9.0*smoothstep(${ce[0].toFixed(1)},${ce[1].toFixed(1)},a)+24.0*smoothstep(${ce[2].toFixed(1)},${ce[3].toFixed(1)},a)
    +0.8*sin(a*0.105+l*0.06)+0.35*sin(l*0.21-a*0.045+1.7)+0.1*sin(a*0.38+2.0*sin(l*0.3))
    +0.17*sin(a*0.27-l*0.19+2.1*sin(l*0.13+a*0.07))+0.07*sin(a*0.71+l*0.93);
  return mix(f,${gt.f.toFixed(2)},lk);
}
// the rings where drips land on a pool: the water is dealt into cells, and a cell's ring has its own size (a tenth to a
// quarter of the cell), its own place in the cell (so that the whole ring lies inside it) and its own beat; half the
// cells have none. The result is the tilt it gives the water's normal
vec2 dripRings(vec2 xz, float cell, float seed, float rain){
  vec2 pc=floor(xz/cell), pf=xz/cell-pc; float hh=h21(pc+seed), sz=cell*mix(0.1,0.27,h21(pc+seed+31.0)), m=1.6*sz/cell;
  vec2 dq=pf-vec2(m+(1.0-2.0*m)*h21(pc+seed+7.0),m+(1.0-2.0*m)*h21(pc+seed+19.0)); float rr=length(dq)*cell/sz;
  float ph=fract(uTime*(0.13+0.3*hh*hh)*(1.0+rain)/sqrt(sz)+hh*9.0);
  float ring=sin((rr-ph*2.4)*9.0)*exp(-rr*1.4)*(1.0-ph)*smoothstep(0.0,0.15,ph)*step(hh,0.5+0.4*rain);
  return dq*(ring*1.6*cell/(3.2*sz));
}
#endif
void main(){
  vec3 N=vN/max(length(vN),1e-4); if(!gl_FrontFacing) N=-N;
  float dC=length(cameraPosition-vP), lod=1.0-smoothstep(50.0,240.0,dC), lod2=1.0-smoothstep(14.0,70.0,dC);
  float foot=length(fwidth(vP));                                     // metres of rock from one drawn sample to the next
  float w1=vn3(vP*0.013), w2=vn3(vP*0.05+5.0);
  float m1=vn3(vP*0.17+3.0), m2=vn3(vP*0.7+11.0), m3=mix(0.5,vn3(vP*3.1+5.0),lod2);
  float steep=1.0-abs(N.y), far=1.0-smoothstep(260.0,620.0,dC);
  // THE ROCK'S GRAIN lies in the rock itself, on all three of its axes: a face that turns keeps its beds, and no joint is
  // drawn as a line. The beds are of very unequal thickness, dip a little all one way and ride the rock's own slow swells
  // (of some 75 and 20 m), with dark partings between them; the face itself swells and hollows by tens of metres
  float cOut=w2;
  float domeK=1.0-smoothstep(0.0,110.0,upPassage(vP));               // (1 in the dome and its mouth, 0 up the passage)
  float yb=vP.y+0.055*vP.x-0.035*vP.z+9.0*w1+3.0*w2;
  float yq=yb*0.13+2.6*vn2(vec2(yb*0.05,4.5));
  float fwY=fwidth(vP.y+0.055*vP.x-0.035*vP.z), bedK=1.0-smoothstep(0.1,0.4,fwY*0.13);   // (a parting is drawn only where it is wider than a sample)
  float bi=floor(yq), bf=yq-bi;
  float bh=h21(vec2(bi,3.0)), bt=h21(vec2(bi,11.0)), bhUp=h21(vec2(bi+1.0,3.0));   // each bed: how far it stands out of the face, and its own tone
  float ew=max(0.1,fwY*0.4);                                         // (a bed's worn edge is never drawn narrower than a sample)
  float edge=smoothstep(0.0,ew,bf)*(1.0-smoothstep(1.0-ew*1.6,1.0,bf));   // 0 in the parting between two beds: each bed is a slab with worn edges
  // here and there a piece has fallen out of a bed and left a niche, dark under its own roof; and under every bed that stands
  // out lies the shadow of its ledge
  float niche=smoothstep(0.68,0.76,vn2(vP.xz*0.11+bi*3.7))*smoothstep(0.02,0.2,bf)*(1.0-smoothstep(0.8,0.98,bf));
  float ledge=max(bhUp-bh,0.0)*smoothstep(0.45,0.97,bf)*bedK;
  vec3 lime=mix(vec3(0.075,0.08,0.085),vec3(0.30,0.29,0.26),clamp(0.5+(bt-0.5)*1.25*uTone.x*mix(0.3,1.0,steep)*mix(0.6,1.0,lod)+0.2*(m1-0.5)+0.3*(cOut-0.5)*uTone.x,0.0,1.0));
  lime*=mix(vec3(1.0),vec3(1.75,1.45,1.02),domeK);                   // (under the open roof the same stone has weathered to honey)
  lime*=1.0-0.4*(1.0-edge)*uTone.x*steep*far*bedK;
  lime*=(1.0-0.5*niche*uTone.x*steep*(0.5+0.5*bf))*(1.0-0.55*ledge*uTone.x*steep);
  // close to (under 25 m), each thick bed is itself a pile of thin ones with sharp partings
  float lodF=(1.0-smoothstep(12.0,26.0,dC))*smoothstep(0.3,0.75,steep)*uTone.x;   // (on faces that stand up, never on sand or scree)
  float yf=yb*1.15+0.9*vn2(vec2(yb*0.31,9.0))+0.5*m1, bf2=fract(yf), bh2=h21(vec2(floor(yf),5.0));
  float fwB=fwY*1.15; lodF*=1.0-smoothstep(0.12,0.4,fwB);              // (no bed is drawn thinner than a sample)
  float edge2=smoothstep(0.0,0.1+fwB*1.5,bf2)*(1.0-smoothstep(0.84-fwB*1.5,1.0,bf2));
  lime*=(1.0-0.34*(1.0-edge2)*lodF)*(1.0+(bh2-0.5)*0.36*lodF);
  float drip=vn3(vec3(vP.x*0.5,vP.y*0.09,vP.z*0.5)+w1*2.0);                               // flowstone lies in long lobes that run down the face
  // CALCITE IS LAID DOWN IN BANDS: honey and amber gold with cream between, a band some 4 m thick and a slow one of 13 m,
  // riding the stone's own swell and sagging where the lobes run down; far off they close to their mean
  float cbY=vP.y*1.6+5.0*w2+2.6*m1+2.4*drip, cbK=1.0-smoothstep(0.6,2.2,fwidth(cbY));
  float cb=mix(0.5,0.5+0.5*sin(cbY+1.3*sin(cbY*0.53)),cbK)*0.55+(0.5+0.5*sin(cbY*0.29+12.0*w1))*0.45;
  vec3 calc=mix(vec3(0.45,0.28,0.105),vec3(0.59,0.49,0.32),smoothstep(0.2,0.8,cb))*(0.74+0.2*m1+0.16*m2+0.28*drip);
  float calcK=uTone.z;
#ifndef FLOOR
  // flowstone laid over a wall: where the wall carries it, and here and there in pale drapes that run down from a ledge
  float drape=smoothstep(0.7,0.84,vn3(vec3(vP.x*0.045,vP.y*0.011,vP.z*0.045)+w1*1.5))*steep*step(0.95,uTone.x);
  calcK=max(calcK,max(clamp(vA.w,0.0,1.0),drape*0.8));
#endif
  vec3 alb=mix(lime,calc,calcK)*vC*(0.88+0.24*m3);
  // drip stains at two sizes: dark where water runs down the face from a ledge (tongues some 2 m wide and 14 m long, and
  // fine ones a hand wide and 4 m long: each has a head and an end), rust in a few seams
  float run=vn3(vec3(vP.x*0.45,vP.y*0.07,vP.z*0.45)+w1*2.0), runF=vn3(vec3(vP.x*1.5,vP.y*0.24,vP.z*1.5)+3.0);
  float black=smoothstep(0.56,0.72,run*0.62+runF*0.38)*steep;
  float rust=smoothstep(0.66,0.86,vn3(vec3(vP.x*0.3+9.0,vP.y*0.06,vP.z*0.3))*0.75+m1*0.25)*steep;
  alb=mix(alb,vec3(0.27,0.14,0.07),rust*0.4*(1.0-uTone.z*0.5));
  alb*=1.0-0.4*black*(1.0-0.5*calcK);
  // the relief, as a height in metres: blocks and beds standing out as ledges, niches, dished scallops with sharp crests
  // between them, pitting, flutes; none of it finer than the step from one drawn sample to the next
  float sc=vn3(vP*0.16+w1*3.0)*0.6+vn3(vP*0.47+7.0)*0.4, dish=smoothstep(0.3,0.7,sc);
  float fa=(vP.x+vP.z)*1.7+3.0*vn2(vP.xz*0.25)+vP.y*0.08;
  float kf1=1.0-smoothstep(0.7,2.4,foot), kf2=1.0-smoothstep(0.25,0.9,foot), kf3=1.0-smoothstep(0.06,0.22,foot), root=0.0, stn=0.0;
  alb*=0.9+0.2*dish;                                                 // (a scallop's dish is a little paler than its crest's shadow)
  float hgt=((0.15+0.85*bh)*edge*1.1*bedK+(cOut-0.5)*1.6-1.1*niche)*uTone.x*steep*far*(1.0-calcK)
    -0.17*dish*lod*(1.0-0.6*calcK)*kf1
    +0.05*(m3-0.5)*lod2*kf3+0.16*(m2-0.5)*lod*(1.0-steep)*kf2
    +(0.9*(drip-0.5)*kf1+0.1*cos(fa)*lod*kf2)*calcK*steep;
#ifdef FLOOR
  // the terraces: each dam a low wall of buff stone with a rounded crest, the pool behind it level
  // (THE BANK'S STAIRCASE is built: its sheet carries its own terrace coordinate, 2 and more, in place of the floor's
  // kind, and its dams and pools stand in the sheet itself; toward its two sides, where the sheet carries moss, the
  // water gives way to the rim's stone. stair: 1 on that sheet)
  float stair=step(1.5,vA.w);
  float gG; float tF=gourF(vP.xz,gG), zone=clamp(vA.w,0.0,1.0);
  float pan=1.0-smoothstep(uPearl.z-0.6,uPearl.z+0.3,length(vP.xz-uPearl.xy));
  if(stair>0.5){ gG=0.09; tF=vA.w-2.0; pan=0.0; }
  float fwT=fwidth(tF);
  float tFr=fract(tF), tK=floor(tF), tE=0.5*gG, tE2=tE+0.45*gG;
  float see=zone*(1.0-pan)*(1.0-smoothstep(mix(0.07,0.25,stair),mix(0.26,0.7,stair),fwT));   // far off the dams close up: their contrast falls away before two of them could meet in one sample
  float seeB=mix(see,1.0,stair);                                     // (a built dam and a built pool are there at any distance)
  float riser=(1.0-smoothstep(0.0,tE,tFr))*seeB, rim=smoothstep(tE*0.35,tE*0.9,tFr)*(1.0-smoothstep(tE2*0.9,tE2*1.3,tFr))*see;
  float pool=mix(0.7,smoothstep(tE2*0.9,tE2*1.35,tFr),seeB)*zone*(1.0-pan);
  { float shore=stair*smoothstep(0.2,0.7,vA.y); pool*=1.0-shore; rim=max(rim,shore*(1.0-riser)); }
  float tRise=0.25+1.4*abs(sin(tK*2.39+0.7))*(0.35+0.65*abs(sin(tK*0.9+2.0)));
  hgt+=tRise*(smoothstep(0.0,tE,tFr)-tFr)*see*(1.0-stair);
  // roots run winding over the forest's floor (seen close)
  root=(1.0-smoothstep(0.0,0.12,abs(vn2(vP.xz*0.42+7.0)-0.5)))*clamp(-1.0-vA.w,0.0,1.0)*(1.0-smoothstep(22.0,70.0,dC))*smoothstep(3.0,9.0,dC);
  // and pale stones lie in it, a hand to a metre across, half sunk
  stn=smoothstep(0.63,0.70,vn2(vP.xz*0.85+13.0)*0.75+m2*0.25)*clamp(-1.0-vA.w,0.0,1.0)*(1.0-smoothstep(50.0,130.0,dC));
  hgt+=0.2*root+0.3*stn;
#endif
  vec3 sx=dFdx(vP), sy=dFdy(vP), r1=cross(sy,N), r2=cross(N,sx);
  float det=dot(sx,r1);
  vec3 Nb=abs(det)*N-sign(det)*(dFdx(hgt)*r1+dFdy(hgt)*r2)*uTone.y;
  float nbl=length(Nb); Nb=nbl>1e-9?Nb/nbl:N;
  { vec3 gy=vec3(0.055,1.0,-0.035), tg=gy-N*dot(gy,N); float c=2.0*bf2-1.0;          // each thin bed is a small rounded roll (its slope known, not measured)
    Nb+=tg*(c*c*c*(0.25+0.75*bh2)*0.9*lodF*(1.0-calcK)*uTone.y); Nb=Nb/max(length(Nb),1e-4); }
  float wet=clamp(vA.z*(0.35+0.5*black+0.25*m2)*(1.0+0.6*uRain),0.0,2.0);
  float ao=vA.x, cover=0.0;
  gRim=0.09+0.3*uTone.z;                                                               // the towers and the draperies are rimmed with the dome's cold light
  // what stands in the mist is wet, and a little darker for it
  if(vP.y<uSea.x+7.0&&-vP.z>uSeaA.x-30.0){ float sk=mistEdge(vP.xz); if(sk>0.0){ float rimK=sk*(1.0-smoothstep(0.0,7.0,vP.y-mistTop(vP.xz))); wet+=1.2*rimK; alb*=1.0-0.25*rimK; } }
#ifdef FLOOR
  {
    alb=mix(alb,vec3(0.34,0.30,0.235)*(0.75+0.5*m2),clamp(rim*0.9+riser*0.6,0.0,1.0));
    alb=mix(alb,vec3(0.33,0.30,0.24)*(0.8+0.4*m2),pan*zone);                                                      // the dried pool: a pale pan of calcite
    float sp=vn3(vec3(vP.x*1.3,vP.y*2.4+uTime*2.6,vP.z*1.3))*smoothstep(0.25,0.6,vn2(vec2(tK*7.3+vP.x*0.23,vP.z*0.23)))*(1.0+uRain);
    wet=mix(wet,0.7+1.3*smoothstep(0.2,0.55,sp),riser); gAmb=0.2*max(riser,rim);                                  // thin sheets spilling from pool to pool
    alb=mix(alb,vec3(0.42,0.40,0.33),riser*0.35*smoothstep(0.3,0.62,sp));                                         // (cream where the sheet breaks on the dam's face)
    if(stair>0.5){
      // the built dams in the day: a face of honey and cream travertine in upright flutes, dark under its lip and mossed
      // where it is dry; where the water goes over (here broad, there not at all) the lip is glassy turquoise and
      // white threads run down the face
      float ax=dot(vP.xz,vec2(0.8,0.6)), over=smoothstep(0.38,0.6,vn2(vec2(ax*0.17+tK*3.1,tK*7.7)));
      float flute=0.5+0.5*cos(ax*4.4+2.5*vn2(vec2(ax*0.8,tK*3.0)));
      vec3 trav=mix(vec3(0.30,0.20,0.085),vec3(0.42,0.36,0.25),vn2(vec2(ax*0.33+tK*1.7,vP.y*0.9)))*(0.6+0.4*flute);
      trav=mix(trav,vec3(0.06,0.17,0.04),(1.0-over)*smoothstep(0.42,0.66,vn2(vec2(ax*0.55+tK*5.0,vP.y*0.8)))*0.85);
      alb=mix(alb,trav,riser);
      float strand=vn2(vec2(ax*1.9,vP.y*0.5+uTime*2.4))*0.6+vn2(vec2(ax*4.7+7.0,vP.y*1.3+uTime*3.9))*0.4;
      float wtr=smoothstep(0.40,0.64,strand)*riser*over;
      alb=mix(alb,vec3(0.10,0.46,0.44),over*max(rim,riser*smoothstep(tE*0.5,tE,tFr))*0.85);
      alb=mix(alb,vec3(0.86,0.93,0.95),wtr*0.9); wet=mix(wet,0.4,wtr);
      ao*=mix(1.0,0.5+0.5*smoothstep(0.0,tE*0.6,tFr),riser);
    }
    // the pools: still dark water; rings spread where drips land, each of its own size, at its own place and beat
    vec2 dqr=(dripRings(vP.xz,3.7,tK,uRain)+dripRings(vec2(vP.x*0.8+vP.z*0.6,vP.z*0.8-vP.x*0.6)+17.0,6.1,tK+5.0,uRain))*see;
    // (where the cave's fall lands on the lake the water is white, and rings run out from its foot over the lake, dying as they go)
    float rrF=length(vP.xz-uCFall.xz), boilF=0.0;
    if(rrF<70.0&&abs(vP.y-uCFall.y)<3.0){ float rgF=sin(rrF*1.4-uTime*2.6)*exp(-rrF*0.045);
      dqr+=(vP.xz-uCFall.xz)/max(rrF,0.5)*(rgF*0.16*(1.0-smoothstep(45.0,70.0,rrF)));
      boilF=exp(-rrF*rrF/22.0)*(0.55+0.45*vn2(vP.xz*1.3-uTime*1.9)); }
    vec3 Np=vec3(dqr.x,1.0,dqr.y); Np=Np/max(length(Np),1e-3);
    float deep=smoothstep(tE2,tE2+0.4,tFr);                                               // clear water: the pale bottom shows at the rim, teal further in
    Nb=mix(Nb,Np,pool); alb=mix(alb,mix(vec3(0.17,0.17,0.13),vec3(0.022,0.075,0.08),mix(0.8,deep,see)),pool); wet=mix(wet,1.5,pool); gMirror=pool*(1.0-boilF);
    alb=mix(alb,vec3(0.62,0.68,0.68),pool*boilF);
  }
  cover=clamp(-1.0-vA.w,0.0,1.0)*smoothstep(0.5,0.8,abs(vN.y)/max(length(vN),1e-4));        // the forest's floor: leaf litter in light and shade, flecks of sun (a steep bank is bare bedded rock)
  gSunK=mix(1.0,0.1+0.9*fleckAt(vP),cover*0.92); gAmb=max(gAmb,0.14*cover);
  // (the day comes down between the crowns in patches some metres across: clear light here, clear shade there)
  { float dap=smoothstep(0.38,0.6,vn2(vP.xz*0.085+vec2(17.0,5.0))*0.7+w2*0.3); ao*=mix(1.0,0.11+0.7*dap,cover); }
#endif
  float gk=vA.y*smoothstep(0.25,0.7,m1*0.55+m2*0.45+vA.y*0.45+0.3*(bh-0.5)*edge*steep);   // (moss and ferns lie thickest on the ledges)
  gk*=mix(0.16,1.0,smoothstep(0.2,0.62,N.y))*(1.0-0.55*cover);                            // (moss lies on what looks up: a standing face keeps its stone, with a little green in its seams; under the trees the ground is leaf litter more than moss)
  vec3 moss=mix(vec3(0.03,0.085,0.025),vec3(0.15,0.27,0.055),m2*0.7+0.3*m3)*(0.7+0.6*m1);
  alb=mix(alb,moss,gk*(0.6+0.4*smoothstep(0.3,0.6,w2*0.5+m1*0.5))); wet*=1.0-0.75*gk;     // (and here and there the stone shows through it)
  alb=mix(alb,vec3(0.15,0.09,0.045)*(0.6+0.8*m2),cover*0.7*smoothstep(0.3,0.6,m1*0.6+m3*0.4+0.15));   // (litter: russet and brown)
  // (the low green of the forest's floor: seedlings, creepers and moss in patches between the litter)
  alb=mix(alb,mix(vec3(0.04,0.10,0.025),vec3(0.11,0.23,0.05),m2*0.6+m3*0.4),cover*0.7*smoothstep(0.42,0.66,vn2(vP.xz*0.11+3.0)*0.55+m1*0.45));
#ifdef FLOOR
  // (and small flowers in it, in drifts metres across, each drift of one colour, yellow or coral: every flower a dot)
  { float fp=smoothstep(0.69,0.79,vn2(vP.xz*0.075+vec2(31.0,9.0)))*cover;
    if(fp>0.0){ vec3 fc=w1<0.5?vec3(0.60,0.42,0.05):vec3(0.60,0.17,0.10);
      alb=mix(alb,fc,fp*mix(0.14,smoothstep(0.6,0.7,vn2(vP.xz*4.6+9.0)),(1.0-smoothstep(10.0,70.0,dC)))); } }
#endif
  alb*=mix(1.0,uShade,domeK*(1.0-cover)*(1.0-gk));                                      // the walls under the open sky read a little darker beside lit leaves
  { float m4=mix(0.5,vn2(vP.xz*6.5+1.0),(1.0-smoothstep(8.0,45.0,dC))*cover);            // fallen leaves and sprouts, seen close
    alb=mix(alb,vec3(0.30,0.19,0.07),0.55*smoothstep(0.62,0.8,m4)); alb*=0.72+0.56*m4; }
  alb=mix(alb,vec3(0.16,0.11,0.07),root*0.85);
  alb=mix(alb,vec3(0.25,0.24,0.21)*(0.8+0.4*m3),stn*0.85);
#ifdef FLOOR
  // the forest's floor seen close (under 24 m): pale pebbles, single fallen leaves, bright cushions of moss, each sharp
  { float nearK=(1.0-smoothstep(9.0,24.0,dC))*cover;
    if(nearK>0.0){ float pb=vn2(vP.xz*8.0+2.0), pb2=vn2(vP.xz*19.0+7.0), mc=vn2(vP.xz*3.7+11.0);
      alb=mix(alb,vec3(0.085,0.21,0.05)*(0.7+0.6*pb2),nearK*smoothstep(0.6,0.68,mc)*0.75);
      alb=mix(alb,vec3(0.21,0.20,0.17),nearK*smoothstep(0.69,0.75,pb)*0.8);
      alb=mix(alb,vec3(0.23,0.14,0.05),nearK*smoothstep(0.72,0.78,pb2)*0.75);
      alb*=1.0+nearK*(pb2-0.5)*0.4; } }
#endif
  vec3 col=caveLight(vP,Nb,alb,wet,ao);
#ifdef FLOOR
  // THE POOLS LIT FROM WITHIN (uPoolG: x, z, radius, the water's height). Where a lamp rests in the water the pools about
  // it glow turquoise and jade from their own depth, palest in the shallows, and shiver; their rims take the light as
  // cream. And every pool of the staircase, lamp or none, holds a little of that light: the water is clear over pale stone
  float shv=0.88+0.12*sin(uTime*2.1+vP.x*1.9+vP.z*1.3+4.0*vn2(vP.xz*0.7+uTime*0.25));
  float kAll=0.14*zone*(1.0-0.5*smoothstep(325.0,350.0,-vP.z));     // (less of it up the steep stairs, where the lamps and the day do the work)
  for(int i=0;i<NPG;i++){
    float R=uPoolG[i].z, dq=length(vP.xz-uPoolG[i].xy);
    kAll=max(kAll,(1.0-smoothstep(R*0.3,R*1.1,dq))*zone*(R>30.0?0.36:i>2?0.75:1.0));   // (the lake is deep: it glows a third as much as a small pool, and mirrors what stands in it; the pools of the steep stairs three quarters)
  }
  // (under the open roof the same clear water over pale stone is lit by the day: bright where the day comes down
  // between the crowns, deep where a crown shades it, and brightest where the pillar of sun finds it)
  if(stair>0.5) kAll=max(kAll,dayAt(vP)*(0.2+0.95*smoothstep(0.36,0.62,vn2(vP.xz*0.085+vec2(17.0,5.0))*0.7+w2*0.3))*0.9+0.8*shaftAt(vP));
  if(kAll>0.0){
    col+=mix(vec3(0.34,0.70,0.44),vec3(0.03,0.52,0.47),smoothstep(tE2,tE2+0.5,tFr))*(kAll*pool*shv*0.68);
    col+=vec3(0.36,0.33,0.25)*(kAll*clamp(rim+riser*0.6,0.0,1.0)*mix(0.4,0.08,stair));
  }
#endif
  gl_FragColor=vec4(airApply(col,vP),1.0);}`,Qa="varying vec3 vP; void main(){ vP=(modelMatrix*vec4(position,1.0)).xyz; gl_Position=projectionMatrix*viewMatrix*vec4(vP,1.0); }",$a=`
varying vec3 vP; uniform float uTime; uniform vec3 uSunDir;
${W0}
void main(){
  vec3 V=vP-cameraPosition; V=V/max(length(V),1e-3);
  vec2 q=vP.xz*0.012+vec2(uTime*0.004,uTime*0.0025);
  float c=vn2(q)*0.5+vn2(q*2.3+5.0)*0.3+vn2(q*5.1+9.0)*0.2;
  float cl=smoothstep(0.42,0.78,c);
  float sunward=max(dot(V,uSunDir),0.0);
  vec3 blue=mix(vec3(0.20,0.42,0.80),vec3(0.42,0.62,0.86),sunward*sunward);
  vec3 col=mix(blue,vec3(0.9,0.92,0.92),cl*0.5)*0.56;                 // (held back, so that at the world's exposure the opening is a blue sky with white cloud in it and no white hole)
  gl_FragColor=vec4(col,1.0);
}`;function za(g,q,X,j){const{nu:et,pos:W,aA:H,aC:pt,o:J}=g;for(let wt=X;wt<j;wt++)for(let yt=0;yt<et;yt++){const dt=wt*et+yt;J.a[0]=1,J.a[1]=0,J.a[2]=1,J.a[3]=-1,J.c[0]=J.c[1]=J.c[2]=1,q(yt,wt,J),W[dt*3]=J.p[0],W[dt*3+1]=J.p[1],W[dt*3+2]=J.p[2],H[dt*4]=J.a[0],H[dt*4+1]=J.a[1],H[dt*4+2]=J.a[2],H[dt*4+3]=J.a[3],pt[dt*3]=J.c[0],pt[dt*3+1]=J.c[1],pt[dt*3+2]=J.c[2]}}const Aa=(g,q)=>({nu:g,nv:q,pos:new Float32Array(g*q*3),aA:new Float32Array(g*q*4),aC:new Float32Array(g*q*3),o:{p:[0,0,0],a:[1,0,1,-1],c:[1,1,1]}});function Pa(g,q){const{nu:X,nv:j,pos:et,aA:W,aC:H}=g,pt=X*j,J=[];for(let yt=0;yt<j-1;yt++)for(let dt=0;dt<X-1;dt++){const $t=yt*X+dt,Et=$t+1,Gt=$t+X,Lt=Gt+1;q&&!q(et,$t,Et,Gt,Lt,W)||J.push($t,Gt,Et,Et,Gt,Lt)}const wt=new z.BufferGeometry;return wt.setAttribute("position",new z.BufferAttribute(et,3)),wt.setAttribute("aA",new z.BufferAttribute(W,4)),wt.setAttribute("aC",new z.BufferAttribute(H,3)),wt.setIndex(pt>65535?new z.BufferAttribute(new Uint32Array(J),1):new z.BufferAttribute(new Uint16Array(J),1)),wt.computeVertexNormals(),wt.computeBoundingSphere(),wt}function ge(g,q,X,j){const et=Aa(g,q);return za(et,X,0,q),Pa(et,j)}async function P0(g,q,X,j,et,W){const H=Aa(g,q);for(let J=0;J<q;J+=et)za(H,X,J,Math.min(q,J+et)),await W();const pt=Pa(H,j);return await W(),pt}function h0(g){let q=0,X=0;for(const dt of g)q+=dt.attributes.position.count,X+=dt.index.count;const j=new Float32Array(q*3),et=new Float32Array(q*3),W=new Float32Array(q*4),H=new Float32Array(q*3),pt=q>65535?new Uint32Array(X):new Uint16Array(X);let J=0,wt=0;for(const dt of g){const $t=dt.attributes.position.count;j.set(dt.attributes.position.array,J*3),et.set(dt.attributes.normal.array,J*3),W.set(dt.attributes.aA.array,J*4),H.set(dt.attributes.aC.array,J*3);const Et=dt.index.array;for(let Gt=0;Gt<Et.length;Gt++)pt[wt+Gt]=Et[Gt]+J;J+=$t,wt+=Et.length,dt.dispose()}const yt=new z.BufferGeometry;return yt.setAttribute("position",new z.BufferAttribute(j,3)),yt.setAttribute("normal",new z.BufferAttribute(et,3)),yt.setAttribute("aA",new z.BufferAttribute(W,4)),yt.setAttribute("aC",new z.BufferAttribute(H,3)),yt.setIndex(new z.BufferAttribute(pt,1)),yt.computeBoundingSphere(),yt}function xo(g,q){return g.applyMatrix4(q),g}const Xa=`
attribute vec3 aR;                 // a (metres up the passage), across (-1..1), how steeply it climbs there (0 a level reach .. 1 a cascade)
varying vec3 vP; varying vec3 vR;
void main(){ vP=(modelMatrix*vec4(position,1.0)).xyz; vR=aR; gl_Position=projectionMatrix*viewMatrix*vec4(vP,1.0); }`,Ya=`
varying vec3 vP; varying vec3 vR;
uniform float uMilk;
${Qt}
float rip(vec2 p, float t, vec3 k){                                  // k: how much of each finer size of ripple can be told apart at this distance
  vec2 q=vec2(p.x*0.8+p.y*0.6,-p.x*0.6+p.y*0.8), s=vec2(p.x*0.55-p.y*0.835,p.x*0.835+p.y*0.55);     // (each size of ripple lies its own way)
  return vn2(vec2(p.x*0.9,p.y*0.45+t*1.9))*0.42+vn2(vec2(q.x*2.3+3.0,q.y*1.1+t*2.5))*(0.3*k.x)+vn2(vec2(s.x*4.6+7.0,s.y*2.4-t*3.3))*(0.18*k.y)+vn2(vec2(q.y*9.5,q.x*6.0+t*5.0))*(0.1*k.z);
}
void main(){
  vec2 p=vec2(vP.x,vR.x);                                            // across (metres), along
  float t=uTime;
  float fast=1.0+1.6*vR.z;
  float still=1.0-smoothstep(62.0,100.0,vR.x);                       // at the start the river is wide and slow: a black mirror
  float foot=length(fwidth(p));                                      // metres of water from one drawn sample to the next
  vec3 k=vec3(1.0-smoothstep(0.25,0.9,foot),1.0-smoothstep(0.12,0.45,foot),1.0-smoothstep(0.06,0.22,foot));
  float h0=rip(p,t,k), hx=rip(p+vec2(0.16,0.0),t,k), hy=rip(p+vec2(0.0,0.16),t,k);
  float sl=2.6*fast*mix(1.0,0.32,still);
  vec3 N=vec3(-(hx-h0)*sl,1.0,(hy-h0)*sl); N=N/max(length(N),1e-3);
  vec3 V=cameraPosition-vP; float dist=max(length(V),1e-3); V/=dist;
  float edge=1.0-abs(vR.y);
  vec3 deep=mix(vec3(0.004,0.016,0.012),vec3(0.02,0.045,0.035),uMilk);   // (after rain it carries a little silt)
  gSheen=0.0;                                                        // (water has no broad sheen under a lamp: it mirrors it, below)
  vec3 col=caveLight(vP,N,deep,2.4,1.0);
  // the far light on every ripple: the glowing air up the passage mirrored at a grazing angle
  vec3 R=reflect(-V,N); R.y=abs(R.y);
  float fr=1.0-max(dot(N,V),0.0); fr=0.03+0.97*fr*fr*fr*fr*fr;
  col+=airGlow(vP+R*220.0+vec3(0.0,40.0,0.0))*(uAirK.z*fr*mix(2.6,0.9,still));
  col+=uCool*(0.15+1.6*fr);                                      // (and the cave's own cool light off the wet roof: the troughs are a deep blue, never black)
  // every lamp and both lit tents: each a long streak of light on the water toward the eye, that shivers on the ripples
  for(int i=0;i<NL;i++){
    vec3 d=uLampP[i].xyz-vP; float rh=max(length(d.xz),1e-3), Rh=max(length(R.xz),1e-3);
    vec2 Lh=d.xz/rh;
    float saz=(R.x*Lh.y-R.z*Lh.x)/Rh, caz=dot(R.xz,Lh)/Rh, del=R.y/Rh-d.y/rh;      // (the mirrored ray against the way to the lamp: to the side, and up and down)
    float waz=i<2?0.05:0.015, m=max(max(uLampC[i].r,uLampC[i].g),max(uLampC[i].b,1e-3));
    float g=exp(-saz*saz/(waz*waz)-del*del/0.045)*step(0.0,caz)*step(-400.0,uLampP[i].y)*(1.0-smoothstep(120.0,220.0,rh));
    col+=uLampC[i]/m*(g*(i<2?0.8:1.4)*(0.3+0.7*fr));
  }
  float gl=smoothstep(0.62,0.9,vn2(vec2(p.x*3.1,p.y*1.4+t*5.5))*0.6+h0*0.4)*k.y;
  col+=airGlow(vP+vec3(0.0,60.0,-200.0))*(uAirK.z*gl*fr*mix(2.5,0.9,still));
  // (and straight below the eye, where the water is black: every ripple steep enough carries a glint of the lit air far up the passage)
  float gl2=smoothstep(0.6,0.85,vn2(vec2(p.x*2.1+4.0,p.y*0.9+t*4.2))*0.55+hy*0.45)*k.x;
  col+=airGlow(vP+vec3(0.0,60.0,-420.0))*(uAirK.z*gl2*mix(0.3,0.12,still));
  // foam: lines drawn out along the current, thick at the steps and thin along the banks
  float fl=vn2(vec2(p.x*1.6,p.y*0.16+t*0.75))*0.6+vn2(vec2(p.x*4.0,p.y*0.5+t*1.6))*0.4;
  float foam=smoothstep(0.62,0.82,fl)*(0.12+0.5*(fast-1.0))+(1.0-smoothstep(0.4,0.75,edge*4.0))*smoothstep(0.45,0.7,fl)*0.25;
  foam+=(fast-1.0)*smoothstep(0.35,0.7,vn2(vec2(p.x*2.2,p.y*1.3+t*3.6)))*0.35;
  // THE CASCADE: where the river comes down a chute it is broken water: it churns white over one rounded step of
  // rock after another (some 4 m apart, each bowed and of its own breadth), and runs green and smooth into the next
  float casc=smoothstep(0.1,0.4,vR.z);
  if(casc>0.0){
    float churn=vn2(vec2(p.x*1.1,p.y*0.7+t*3.2))*0.55+vn2(vec2(p.x*2.9+3.0,p.y*1.8+t*5.5))*0.45;
    float led=0.5+0.5*sin(p.y*1.6+3.2*vn2(vec2(p.x*0.3,p.y*0.11))+0.5*sin(p.x*0.7));
    foam=mix(foam,clamp(smoothstep(0.22,0.66,churn)*(0.3+0.7*led)+0.3*led*led,0.0,1.0),casc);
  }
  foam*=1.0-still;
  vec3 foamCol=vec3(0.55,0.6,0.58);
  vec3 ls; vec3 ld=lampsAt(vP,vec3(0.0,1.0,0.0),V,0.0,ls);
  float day=dayAt(vP);
  col+=foamCol*clamp(foam,0.0,1.0)*(uDayCol*day*0.9+ld+shaftAt(vP)*uSunCol*0.5+uCool*(0.4+0.5*casc));
  col+=ld*(fr*0.02);
  float a=smoothstep(0.0,0.1,edge);
  gl_FragColor=vec4(airApply(col,vP),a);
}`,Za="varying vec3 vP; varying vec2 vUv; void main(){ vUv=uv; vP=(modelMatrix*vec4(position,1.0)).xyz; gl_Position=projectionMatrix*viewMatrix*vec4(vP,1.0); }",ja=`
varying vec3 vP; varying vec2 vUv; uniform vec3 uCol; uniform float uGlow;
${Qt}
void main(){
  float pole=1.0-smoothstep(0.0,0.035,abs(fract(vUv.x*2.0+0.25)-0.5)*2.0-0.93+0.0*vUv.y);
  float seam=1.0-smoothstep(0.0,0.02,abs(fract(vUv.x*4.0)-0.5));
  float lum=uGlow*(0.45+0.55*(1.0-vUv.y)*(1.0-vUv.y))*(1.0-0.45*pole)*(1.0-0.25*seam)*(0.9+0.2*vn2(vUv*vec2(60.0,24.0)));
  gl_FragColor=vec4(airApply(uCol*lum,vP),1.0);
}`,Ja=`
attribute vec4 iP;                 // x, the height it falls from, z, the height of the fall
attribute vec4 iQ;                 // period (s), phase, width (m), brightness
varying float vB; varying vec2 vUv; varying vec3 vL;
${Qt}
void main(){
  float tau=fract(uTime/iQ.x+iQ.y);
  float fall=iP.w*tau*tau, len=0.25+2.2*tau;
  vec3 c=vec3(iP.x,iP.y-fall,iP.z);
  vec3 toC=cameraPosition-c; float dist=max(length(toC),1e-3);
  vec3 rt=cross(vec3(0.0,1.0,0.0),toC); rt=rt/max(length(rt),1e-3);
  float w=max(iQ.z,dist*0.002);
  vec3 p=c+rt*(position.x*w)+vec3(0.0,position.y*len,0.0);
  vec3 ls; vec3 ld=lampsAt(c,toC/dist,toC/dist,0.0,ls);
  float inSea=mistBetween(c).a;                                      // (a drop is lost to sight where it falls into the mist)
  vL=(airGlow(c)*uAirK.z*1.4+uDayCol*dayAt(c)*0.9+ld*0.6+uSunCol*shaftAt(c)*0.5)*iQ.w*min(1.0,iQ.z/w*1.5+0.25)*(1.0-inSea);
  vB=smoothstep(0.0,0.04,tau)*(1.0-smoothstep(0.96,1.0,tau));
  vUv=position.xy;
  gl_Position=projectionMatrix*viewMatrix*vec4(p,1.0);
}`,to=`
varying float vB; varying vec2 vUv; varying vec3 vL;
void main(){
  float a=max(1.0-abs(vUv.x)*2.0,0.0)*smoothstep(0.0,0.25,vUv.y)*(1.0-smoothstep(0.55,1.0,vUv.y));
  gl_FragColor=vec4(vL*(a*vB),1.0);
}`,eo=`
attribute vec2 aS;                 // across the slice (-1..1), the slice's place in its stack (-1..1)
uniform float uLen, uHalf;
varying vec3 vP; varying vec3 vNs; varying float vIn;
${Qt}
void main(){
  vIn=shaftIn(cameraPosition);     // (how far inside the pillar's round the eye itself stands)
  vec3 top=vec3(uSkyC.x,uSkyC.y,uSkyC.z)+uSunDir*18.0;
  vec3 e=cameraPosition-(top-uSunDir*(0.5*uLen)); e-=uSunDir*dot(e,uSunDir);
  float el=length(e); vec3 n=el>1e-3?e/el:normalize(vec3(uSunDir.y,-uSunDir.x,0.0));
  vec3 across=cross(uSunDir,n);
  vec3 p=top-uSunDir*(position.y*uLen)+across*(aS.x*uHalf)+n*(aS.y*uHalf);
  vP=p; vNs=n;
  gl_Position=projectionMatrix*viewMatrix*vec4(p,1.0);
}`,ao=`
varying vec3 vP; varying vec3 vNs; varying float vIn;
uniform vec3 uShaftCol; uniform float uGap;
${Qt}
void main(){
  vec3 V=vP-cameraPosition; float dist=max(length(V),1e-3); V/=dist;
  vec2 q; float t; float R=shaftRim(vP,q,t), r=length(q);
  float soft=7.0+0.06*max(t,0.0);
  float m=1.0-smoothstep(R-soft*1.4,R+soft*0.5,r);
  if(m<=0.0) discard;
  m*=beamAt(q);                                                      // the beams: the same down the pillar's whole length
  m*=0.7+0.9*exp(-max(t,0.0)/75.0);                                  // brightest where they come in at the skylight
  // the wet air itself is not even, and drifts
  m*=0.66+0.68*vn3(vec3((vP.xz-uDrift*(uTime*5.0))*0.024,vP.y*0.024-uTime*0.08));
  m*=1.0-smoothstep(uSkyC.y-6.0,uSkyC.y+12.0,vP.y);
  float w=1.0/max(abs(dot(V,vNs)),0.3);                              // (the length of the eye's ray inside this slice's slab of air)
  w*=smoothstep(0.5,mix(14.0,46.0,vIn),abs(dot(vP-cameraPosition,vNs)));   // (no slice is seen passing through the eye: soft, as a particle is; and the air about an eye that stands in the pillar is clear to it)
  // (under the ground mist's top, in the hollow, the pillar is the mist's own white gold, not lit air)
  if(vP.y<uSea.x+3.0) w*=mix(1.0,smoothstep(-5.0,3.0,vP.y-mistTop(vP.xz)),mistEdge(vP.xz));
  // wet air throws the sun's light mostly onward: the beams are brightest to an eye that looks up them toward the sun, and
  // thin to one that looks across them or down them (1 where the passage looks at them)
  float cs=dot(V,uSunDir); w*=min(0.98/pow(1.49-1.4*cs,1.5),mix(2.5,1.1,vIn));
  // from inside the pillar the eye is used to its light: the lit air between it and the forest takes less of what it sees
  w*=1.0-0.6*vIn;
  gl_FragColor=vec4(uShaftCol*(m*w*uGap),1.0);
}`,oo=`
attribute vec4 iP;                 // place, size
attribute vec4 iQ;                 // drift speed (m/s), span of its lap (m), phase, opacity
attribute vec2 iR;                 // how far it lifts over its lap (m), its height for its width
varying vec2 vUv; varying vec3 vL; varying float vA; varying float vSeed;
${Qt}
void main(){
  float lap=fract(uTime*iQ.x/max(iQ.y,1.0)+iQ.z);
  vec3 c=iP.xyz+vec3(uDrift.x,0.0,uDrift.y)*((lap-0.5)*iQ.y);
  c.y+=sin(uTime*0.11+iQ.z*40.0)*0.8+iR.x*lap;
  vec3 toC=cameraPosition-c; float dist=max(length(toC),1e-3);
  vec3 rt=cross(vec3(0.0,1.0,0.0),toC); rt=rt/max(length(rt),1e-3); vec3 up=cross(toC/dist,rt);
  vec3 p=c+(rt*position.x+up*position.y*iR.y)*iP.w;
  float day=dayAt(c), sh=shaftAt(c);
  vec3 ls; vec3 nn=toC/dist;
  vL=uSeaCol*(day*(0.8+0.08*iR.x))+vec3(0.86,0.92,0.97)*(smoothstep(0.62,0.97,day)*0.62)+uSunCol*(sh*0.22)+lampsAt(c,nn,nn,0.0,ls)*0.3;   // (white in the dome's day, gold where a sunbeam finds it)
  vA=iQ.w*sin(lap*3.1416)*smoothstep(iP.w*0.25,iP.w*1.1,dist);
  vUv=position.xy; vSeed=iQ.z*31.0;
  gl_Position=projectionMatrix*viewMatrix*vec4(p,1.0);
}`,so=`
varying vec2 vUv; varying vec3 vL; varying float vA; varying float vSeed;
uniform float uTime;
${W0}
void main(){
  float r=length(vUv)*2.0;
  float n=vn2(vUv*3.1+vSeed+vec2(uTime*0.24,0.0))*0.6+vn2(vUv*7.3+vSeed*1.7+vec2(uTime*0.45,-uTime*0.1))*0.4;   // (the wisp churns as it drifts)
  float a=1.0-smoothstep(0.0,1.0,r+0.55*(n-0.5)); a*=a*vA;            // (soft to its edge: a wisp has no outline)
  gl_FragColor=vec4(vL*(0.6+0.8*n)*a,a);
}`,no=`
attribute vec4 aL;                 // the anchor (x, y, z) and the cord's length
attribute vec4 aM;                 // place along it (0 at the anchor .. 1 at the tip), side (-1 / 1), phase, width (m)
varying vec3 vP; varying vec2 vUv; varying float vPh;
uniform float uTime;
void main(){
  float t=aM.x, ph=aM.z*6.2831;
  float swing=t*t*aL.w*0.035;
  vec3 c=aL.xyz+vec3(sin(uTime*0.7+ph)*swing+sin(uTime*1.9+ph*3.0)*swing*0.25, -aL.w*t+swing*0.1*cos(uTime*0.7+ph), cos(uTime*0.55+ph*1.7)*swing);
  c.x+=sin(t*9.0+ph)*0.12*aL.w*0.05; c.z+=cos(t*7.0+ph*2.0)*0.12*aL.w*0.05;
  vec3 toC=cameraPosition-c; float dist=max(length(toC),1e-3);
  vec3 rt=cross(vec3(0.0,1.0,0.0),toC); rt=rt/max(length(rt),1e-3);
  float w=max(aM.w*(1.0-0.5*t),dist*0.0022);
  vec3 p=c+rt*(aM.y*w*0.5);
  vP=p; vUv=vec2(aM.y,t*aL.w); vPh=aM.z;
  gl_Position=projectionMatrix*viewMatrix*vec4(p,1.0);
}`,ro=`
varying vec3 vP; varying vec2 vUv; varying float vPh;
${Qt}
void main(){
  float round=sqrt(max(1.0-vUv.x*vUv.x,0.0));
  float leaf=smoothstep(0.55,0.8,vn2(vec2(vUv.y*0.45,vPh*40.0)));
  vec3 alb=mix(vec3(0.10,0.075,0.05),vec3(0.06,0.17,0.045),leaf)*(0.6+0.5*vn2(vec2(vUv.y*3.0,vPh*17.0)));
  float day=dayAt(vP), sh=shaftAt(vP);
  vec3 col=alb*(uDayCol*(day*(0.35+0.65*round))+uSunCol*(sh*(0.25+0.6*round))+pillarGlow(vP,normalize(cameraPosition-vP))*1.5);
  gl_FragColor=vec4(forestAir(col,vP),1.0);
}`,io=`
attribute float aH;                // height in the crown's own form: -1 at its underside .. 1 at its top
varying vec3 vP, vN, vO, vT; varying float vH;
uniform float uTime;
void main(){
  vec4 wp=instanceMatrix*vec4(position,1.0); vec3 o=instanceMatrix[3].xyz;
  vec3 n=normalize(mat3(instanceMatrix)*normal);
  float ph=o.x*0.37+o.z*0.53;
  wp.xyz+=vec3(sin(uTime*0.7+ph)+0.4*sin(uTime*1.9+ph*2.0+wp.y*0.3),0.0,cos(uTime*0.6+ph*1.3))*(0.14*(1.2+aH));
  wp.xyz+=n*(0.14*sin(uTime*1.3+dot(wp.xyz,vec3(0.9,0.7,1.1))));
  vP=wp.xyz; vN=n; vO=o; vH=aH;
  vT=vec3(1.0);
  #ifdef USE_INSTANCING_COLOR
  vT=instanceColor;
  #endif
  gl_Position=projectionMatrix*viewMatrix*wp;
}`,lo=`
varying vec3 vP, vN, vO, vT; varying float vH;
uniform vec3 uLeafA, uLeafB; uniform float uUnder;
uniform vec4 uBloom;               // the colour of the flowers, and how much of the crown stands in flower
${Qt}
void main(){
  vec3 N=vN/max(length(vN),1e-4);
  vec3 V=cameraPosition-vP; float dist=max(length(V),1e-3); V/=dist;
  float lod=1.0-smoothstep(40.0,160.0,dist), lod2=1.0-smoothstep(14.0,60.0,dist);
  vec3 q=vP+vec3(sin(uTime*0.5+vO.x),0.0,cos(uTime*0.43+vO.z))*0.14;
  float c1=vn3(q*0.42+vO*0.1), c2=vn3(q*1.3+7.0), c3=mix(0.5,vn3(q*3.9+3.0),lod), c4=mix(0.5,vn3(q*10.5+1.0),lod2);
  vec3 g=vec3(vn3(q*0.42+vO*0.1+vec3(0.7,0.0,0.0))-c1, vn3(q*0.42+vO*0.1+vec3(0.0,0.7,0.0))-c1, vn3(q*0.42+vO*0.1+vec3(0.0,0.0,0.7))-c1);
  vec3 g2=vec3(vn3(q*1.3+7.0+vec3(0.5,0.0,0.0))-c2, vn3(q*1.3+7.0+vec3(0.0,0.5,0.0))-c2, vn3(q*1.3+7.0+vec3(0.0,0.0,0.5))-c2);
  vec3 Nb=N-g*1.8-g2*(1.4*lod); Nb=Nb/max(length(Nb),1e-3);
  float clump=c1*0.3+c2*0.35+c3*0.35;
  float hole=smoothstep(0.3,0.52,clump);                              // between the boughs it is dark
  // close to, the mass is leaves: sprays a hand across, light ones and dark ones, and black between them
  float lf=mix(0.5,vn3(q*24.0+5.0),1.0-smoothstep(10.0,42.0,dist)), spray=smoothstep(0.25,0.7,c4*0.55+lf*0.45);
  vec3 alb=mix(uLeafA,uLeafB,smoothstep(0.3,0.8,c2*0.4+c3*0.3+lf*0.3)*0.8)*vT*(0.62+0.38*hole)*mix(1.0,0.55+0.75*spray,lod2);
  float fl=uBloom.w*smoothstep(0.5,0.6,vn3(q*2.3+vO*0.3)*0.55+c4*0.45)*smoothstep(-0.3,0.4,vH);
  alb=mix(alb,uBloom.rgb,fl);
  float ao=(0.12+0.88*smoothstep(-0.7,0.75,vH))*(0.42+0.58*hole);    // (deep green shade under and inside a crown, the day on its top)
  float day=dayAt(vP), sh=shaftAt(vP)*mix(1.0,fleckAt(vP),uUnder);
  float gust=0.76+0.52*smoothstep(0.22,0.78,vn2((vP.xz-uDrift*(uTime*7.0))*0.05));   // a gust turns the leaves' pale sides up as it passes
  // the day comes down through the skylight: the side of a crown that faces it is lit, the other lies in its own shade
  vec3 Ld=vec3(uSkyC.x,uSkyC.y-30.0,uSkyC.z)-vP; Ld=Ld/max(length(Ld),1e-3);
  float nd=dot(Nb,Ld)*0.5+0.5;
  vec3 col=alb*(uDayCol*0.2+uDayDome*(0.95*nd*nd))*(day*ao*gust*(1.0-0.35*uUnder));   // (tops in the opening's green-gold day, undersides in cool green shade)
  float nl=dot(Nb,uSunDir), wrap=max(nl*0.6+0.4,0.0);
  float thru=max(-nl,0.0)*max(dot(V,-uSunDir),0.0);
  vec3 burn=mix(alb,vec3(0.30,0.44,0.05)*(0.6+0.8*hole),0.5*(1.0-fl));  // (in the sun the leaves are yellow-green and burn)
  col+=burn*uSunCol*(sh*ao*gust*(wrap*wrap*0.5+thru*0.35));
  col+=alb*(pillarGlow(vP,Nb)*(2.2*ao)+ringLight(vP,Nb));
  col+=alb*uBounce*((1.0-smoothstep(0.0,120.0,upPassage(vP)))*1.2);
  gl_FragColor=vec4(forestAir(col,vP),1.0);
}`,ho=`
attribute vec4 aA;                 // round the bole (0..1), up it (0 at the foot .. 1)
varying vec3 vP, vN, vT; varying vec2 vUv;
uniform float uTime;
void main(){
  vec4 wp=vec4(position,1.0); vec3 n=normal, o=vec3(0.0); float sw=0.0;
  #ifdef USE_INSTANCING
  wp=instanceMatrix*wp; n=mat3(instanceMatrix)*n; o=instanceMatrix[3].xyz; sw=aA.y*aA.y;
  #endif
  float ph=o.x*0.37+o.z*0.53;
  wp.xyz+=vec3(sin(uTime*0.7+ph),0.0,cos(uTime*0.6+ph*1.3))*(0.14*sw);
  vP=wp.xyz; vN=n; vUv=aA.xy;
  vT=vec3(1.0);
  #ifdef USE_INSTANCING_COLOR
  vT=instanceColor;
  #endif
  gl_Position=projectionMatrix*viewMatrix*wp;
}`,co=`
varying vec3 vP, vN, vT; varying vec2 vUv;       // vUv: round the bole (0..1), up it (0 at the foot .. 1)
uniform float uUnder;
${Qt}
void main(){
  vec3 N=vN/max(length(vN),1e-4); if(!gl_FrontFacing) N=-N;
  float dist=length(cameraPosition-vP), lod=1.0-smoothstep(30.0,140.0,dist);
  float fis=vn2(vec2(vUv.x*26.0,vP.y*0.5)), pl=vn2(vec2(vUv.x*7.0+3.0,vP.y*0.17));
  vec3 alb=vT*mix(vec3(0.15,0.135,0.11),vec3(0.36,0.335,0.28),0.3+0.7*pl)*(1.0-0.5*lod*(1.0-smoothstep(0.25,0.45,fis)));
  alb=mix(alb,vec3(0.40,0.42,0.34),0.55*smoothstep(0.6,0.7,vn3(vP*0.8+4.0)));                // lichen
  float mossK=smoothstep(0.4,0.75,vn3(vP*0.45+9.0)*0.55+(1.0-smoothstep(0.0,0.3,vUv.y))*0.6);
  alb=mix(alb,vec3(0.06,0.14,0.04),mossK*0.8);
  float ao=(0.4+0.6*smoothstep(0.0,0.12,vUv.y))*(1.0-0.45*uUnder);
  gSunK=mix(1.0,fleckAt(vP),uUnder);
  vec3 col=caveLight(vP,N,alb,0.1,ao)+alb*pillarGlow(vP,N)*ao;
  gl_FragColor=vec4(forestAir(col,vP),1.0);
}`,fo=`
attribute vec3 aB;                 // across the blade (-1..1), along it (0 at the stem .. 1 at the tip), the blade's own number
varying vec3 vP, vN, vT, vB;
uniform float uTime;
void main(){
  vec4 wp=instanceMatrix*vec4(position,1.0); vec3 o=instanceMatrix[3].xyz;
  float ph=o.x*0.61+o.z*0.47+aB.z*6.0, k=aB.y*aB.y*length(instanceMatrix[1].xyz);
  wp.xyz+=vec3(sin(uTime*0.9+ph),0.4*sin(uTime*1.7+ph*1.3),cos(uTime*0.75+ph*1.6))*(0.06*k);
  vP=wp.xyz; vN=mat3(instanceMatrix)*normal; vB=aB;
  vT=vec3(1.0);
  #ifdef USE_INSTANCING_COLOR
  vT=instanceColor;
  #endif
  gl_Position=projectionMatrix*viewMatrix*wp;
}`,uo=`
varying vec3 vP, vN, vT, vB;
uniform float uUnder;
${Qt}
void main(){
  float u=vB.x, v=vB.y, au=abs(u);
  float w=pow(clamp((v-0.14)/0.2,0.0,1.0),0.6)*(1.0-pow(clamp((v-0.5)/0.5,0.0,1.0),2.4));     // the blade's outline (below 0.14 it is the stalk)
  float vv=v*22.0+vB.z*9.0;
  if(v>0.14){
    if(au>max(w,0.07)) discard;
    if(h21(vec2(floor(vv+0.5),vB.z*31.0))>0.76&&abs(fract(vv)-0.5)>0.43&&au>w*0.28) discard;   // slits torn along the veins
  } else if(au>0.07) discard;
  vec3 N=vN/max(length(vN),1e-4); if(!gl_FrontFacing) N=-N;
  vec3 V=cameraPosition-vP; float dist=max(length(V),1e-3); V/=dist;
  float rib=1.0-smoothstep(0.035,0.1,au), vein=0.5+0.5*cos(vv*6.2831);
  vec3 alb=mix(vec3(0.04,0.17,0.03),vec3(0.13,0.34,0.055),0.3+0.3*vein+0.4*vn2(vec2(v*5.0+vB.z*7.0,u*2.0)))*vT;
  alb=mix(alb,vec3(0.30,0.40,0.14),rib*0.8);
  float day=dayAt(vP), sh=shaftAt(vP)*mix(1.0,fleckAt(vP),uUnder);
  vec3 Ld=vec3(uSkyC.x,uSkyC.y-30.0,uSkyC.z)-vP; Ld=Ld/max(length(Ld),1e-3);
  float nd=dot(N,Ld);
  vec3 col=alb*uDayCol*(day*(0.14+0.8*max(nd,0.0)+0.55*max(-nd,0.0)));
  float nl=dot(N,uSunDir);
  col+=mix(alb,vec3(0.30,0.46,0.05),0.4)*uSunCol*(sh*(max(nl,0.0)*0.8+max(-nl,0.0)*0.7));
  vec3 H=Ld+V; H=H/max(length(H),1e-3); float s=max(dot(N,H),0.0); s*=s; s*=s; s*=s; s*=s;
  col+=uDayCol*(day*s*0.22);                                          // the day's sheen on the waxy blade
  col+=alb*(pillarGlow(vP,N)*2.2+ringLight(vP,N));
  gl_FragColor=vec4(forestAir(col,vP),1.0);
}`,po=`
attribute vec3 aW;                 // across (-1..1 the water, to -2 and 2 its banks), metres from its head, how it goes there (-0.4 lying in the pool, 1.5 falling down the wall)
varying vec3 vP, vW;
void main(){ vP=position; vW=aW; gl_Position=projectionMatrix*viewMatrix*vec4(position,1.0); }`,mo=`
varying vec3 vP, vW;
uniform vec2 uFallP;               // the fall's foot (x, z)
uniform vec3 uPoolC;               // the pool's middle (x, z) and its radius
${Qt}
void main(){
  float pool=clamp(-vW.z*2.5,0.0,1.0);
  float e=abs(vW.x), ragged=mix(0.86,0.7,pool)+mix(0.14,0.24,pool)*vn2(vec2(vW.y*0.55,sign(vW.x)*3.0)+vP.xz*0.9*pool);
  if(e>ragged){                                                       // the water's own banks: wet stones with moss on them (a pool's margin is broad and mossy)
    if(vW.z>1.2) discard;                                             // (falling water has no banks: beside it is air)
    float m=vn2(vP.xz*1.3), st=vn2(vP.xz*4.0+3.0);
    vec3 alb=mix(vec3(0.05,0.052,0.042),vec3(0.065,0.15,0.045),smoothstep(0.2,0.6,m*0.6+st*0.4+(e-1.0)*0.6));
    alb=mix(alb,vec3(0.36,0.33,0.25)*(0.8+0.4*st),pool);                // (the pool's margin is pale rimstone)
    vec3 Nn=vec3((st-0.5)*0.9,1.0,(m-0.5)*0.9); Nn=Nn/length(Nn);
    gRim=0.0;
    gl_FragColor=vec4(forestAir(caveLight(vP,Nn,alb,0.12,0.6),vP),1.0);
    return;
  }
  float sp=1.2+2.5*min(vW.z,1.0), tall=step(1.2,vW.z), ys=vW.y*mix(1.0,0.3,tall);   // (down the wall the water is drawn out into long strands)
  float flow=vn2(vec2(vW.x*2.5,ys*1.3-uTime*sp))*0.6+vn2(vec2(vW.x*6.0+4.0,ys*3.1-uTime*sp*1.7))*0.4;
  float white=smoothstep(0.34,0.68,flow*(0.42+mix(0.82,0.9,tall)*min(vW.z,1.25)));   // (a fall is strands of white with the dark water between them)
  // (a fall is no strip: it is whole in its middle and breaks toward its two edges into strands and threads with air between them)
  { float thr=vn2(vec2(vW.x*13.0+2.0,ys*0.45-uTime*sp*0.8)), er=e/ragged;
    if(vW.z>0.6&&mix(flow,thr,0.45*tall)<mix(0.36,0.10,tall)+mix(0.3,0.62,tall)*er*er) discard; }
  float deep=smoothstep(0.0,0.55,ragged-e);                           // (0 at the water's edge, 1 out in it)
  vec3 V=cameraPosition-vP; V=V/max(length(V),1e-3);
  vec3 N=vec3((flow-0.5)*0.7,1.0,(vn2(vec2(vW.y*2.0+uTime*sp*0.5,vW.x*3.0))-0.5)*0.7); N=N/length(N);
  float day=dayAt(vP);
  vec3 Ld=vec3(uSkyC.x,uSkyC.y-30.0,uSkyC.z)-vP; Ld=Ld/max(length(Ld),1e-3);
  vec3 H=Ld+V; H=H/max(length(H),1e-3); float s=max(dot(N,H),0.0); s*=s; s*=s; s*=s; s*=s; s*=s; s*=s;
  float nv=1.0-max(dot(N,V),0.0), fr=0.04+0.96*nv*nv*nv;
  vec3 col=vec3(0.02,0.04,0.028)*day;                                 // clear water over dark stones
  vec3 Rf=reflect(-V,N);                                              // what it mirrors: the skylight's day where the mirrored ray finds the opening, else the dome's green shade
  // (a pool mirrors the forest's roof: leaves, and the day in the gaps between them)
  float lf=vn2(Rf.xz*5.0+vP.xz*0.35)*0.6+vn2(Rf.xz*13.0+7.0)*0.4;
  vec3 roofC=mix(vec3(0.035,0.09,0.03),mix(vec3(0.10,0.24,0.07),uDayCol*1.3,smoothstep(0.62,0.8,lf)),smoothstep(0.3,0.6,lf));
  col+=mix(mix(vec3(0.05,0.1,0.05),roofC,pool),uDayCol,smoothstep(0.8,0.97,dot(Rf,Ld)))*(day*fr*(0.2+1.3*pool));
  // (and is clear over pale stone, as the cave's pools are: jade at its edge, turquoise further out, and brighter where the sun finds it)
  { float mid=1.0-smoothstep(0.2,0.95,length(vP.xz-uPoolC.xy)/uPoolC.z);        // (and deep in its middle: a darker blue)
    col+=mix(mix(vec3(0.34,0.66,0.44),vec3(0.03,0.50,0.50),deep),vec3(0.01,0.15,0.34),0.85*mid)*(pool*(1.0-fr)*(0.75+0.5*vn2(vP.xz*0.9+vec2(uTime*0.2,0.0)))*(0.42*day+0.5*shaftAt(vP))); }
  { float rr=length(vP.xz-uFallP.xy), rg=sin(rr*1.7-uTime*3.0)*exp(-rr*0.09);       // (rings run out from the fall's foot, and the water is white where it lands)
    col+=uDayCol*(day*pool*(0.10*max(rg,0.0)+0.9*exp(-rr*rr/40.0)*(0.6+0.4*vn2(vP.xz*1.4-uTime*2.0)))); }
  // (white water in the opening's day; the great fall is strands of white with blue-grey shadow between them, never a blank sheet)
  { float strand=smoothstep(0.3,0.72,flow*0.75+0.25*vn2(vec2(vW.x*11.0,ys*0.8-uTime*sp*1.3)));
    // (in the cave the falling water is lit by the lamp that is turned on it and by the lake's glow under it)
    vec3 lsF; vec3 lampF=lampsAt(vP,V,V,0.0,lsF)*0.5+poolsAt(vP,vec3(0.0,-1.0,0.0))*0.9+uCool*0.5;
    vec3 wc=mix(vec3(0.6,0.8,0.85)*(day*0.6)+uSunCol*(shaftAt(vP)*0.3)+pillarGlow(vP,vec3(0.0,1.0,0.0))*0.6,
      mix(vec3(0.27,0.40,0.48),vec3(0.95,0.98,1.0),strand)*(vec3(0.36*day+0.1*shaftAt(vP))+lampF*(1.0-smoothstep(0.0,60.0,150.0-upPassage(vP)))),tall);
    col=mix(col,wc,white*mix(0.75,0.97,tall)); }
  col+=vec3(0.9,0.96,1.0)*(day*s*1.8);                                // glints
  // fallen petals ride the water: coral, white and yellow specks that go down with it and turn slowly in the pools
  { vec2 pc=vec2(vW.x*2.6,vW.y*2.2-uTime*sp*0.45), ci=floor(pc), cf=fract(pc)-0.5; float hp=h21(ci+7.0);
    if(hp>0.9&&tall<0.5){ vec2 o2=(vec2(h21(ci+3.0),h21(ci+11.0))-0.5)*0.5; float pt=1.0-smoothstep(0.07,0.14,length(cf-o2));
      vec3 pcol=hp>0.966?vec3(1.0,0.82,0.2):hp>0.933?vec3(1.0,0.95,0.86):vec3(1.0,0.42,0.3);
      col=mix(col,pcol*(uDayCol*day*1.5+uSunCol*(shaftAt(vP)*0.4)+vec3(0.03)),pt*(1.0-0.8*white)); } }
  gl_FragColor=vec4(forestAir(col,vP),1.0);
}`,vo=`
attribute vec4 iP;                 // place, size (m)
attribute vec4 iQ;                 // fall speed (m/s, negative rises), span of its lap (m), phase, brightness
uniform float uFluff;
varying vec2 vUv; varying vec3 vL;
${Qt}
void main(){
  float lap=fract(uTime*iQ.x/max(iQ.y,1.0)+iQ.z), ph=iQ.z*6.2831;
  vec3 c=iP.xyz+vec3(sin(uTime*0.31+ph)*0.9+sin(uTime*0.83+ph*2.0)*0.3, (0.5-lap)*iQ.y, cos(uTime*0.27+ph*1.3)*0.9);
  vec3 toC=cameraPosition-c; float dist=max(length(toC),1e-3);
  vec3 rt=cross(vec3(0.0,1.0,0.0),toC); rt=rt/max(length(rt),1e-3); vec3 up=cross(toC/dist,rt);
  float w=max(iP.w,dist*0.0021);
  vec3 p=c+(rt*position.x+up*position.y)*w;
  float ck=mistBetween(c).a;
  float tw=0.6+0.4*sin(uTime*(1.5+2.0*iQ.z)+ph*5.0);
  vL=(uSunCol*(shaftAt(c)*0.34)+uDayCol*(dayAt(c)*0.05*uFluff))*(iQ.w*tw*sin(lap*3.1416)*min(1.0,iP.w/w*1.4+0.15)*(1.0-ck)*smoothstep(1.2,4.0,dist));
  vUv=position.xy;
  gl_Position=projectionMatrix*viewMatrix*vec4(p,1.0);
}`,go=`
varying vec2 vUv; varying vec3 vL;
void main(){ float r=length(vUv)*2.0; float a=1.0-smoothstep(0.2,1.0,r); gl_FragColor=vec4(vL*a,1.0); }`;var bo={id:"cloud-in-the-cave",name:"Cloud in the Cave",category:"wilderness",weirdness:.2,media:["air"],async build(g){const{rng:q,renderer:X}=g,j=g.vary||{},et=g.quality?.detail??1,W=g.core.makeNoise("cloud-in-the-cave:rock"),H=new z.Scene;H.background=new z.Color("#020405"),H.fog=new z.FogExp2(new z.Color("#1c3136"),.0011);const pt=q.fork("look"),J=pt.pick(["sea","sea","veil","rags"]),wt=pt.chance(.33),yt=pt.chance(.5),dt=pt.chance(.4),$t=pt.int(7,9),Et=$t===7?14:15,Gt=pt.pick(["green","green","red","flower"]),Lt=pt.chance(.4),Ue=!!j.rare;H.name=`cave ${J} ${wt?"rain":"clear"} ${yt?"up":"down"} ${dt?"blue":"orange"} ${Et} ${Gt} ${Lt?"fluff":"motes"}${Ue?" shower":""}`;const we=[Math.sin(va),-Math.cos(va)],zt=new Ht(Math.cos(b0)*we[0],Math.sin(b0),Math.cos(b0)*we[1]).normalize(),St=ot(ut.a,ut.l),c0=ot(ae.a,ae.l),fe=[],Oe=[],ye=[],f0=[],Ye=[];for(let t=0;t<Xe;t++)fe.push(new z.Vector4(0,-500,0,0)),Oe.push(new z.Vector4(0,-1,0,-2)),ye.push(new z.Color(0,0,0)),f0.push(new z.Vector2(0,1));for(let t=0;t<ka;t++)Ye.push(new z.Vector4(0,0,1,-900));const it={uTime:{value:0},uSunDir:{value:zt},uSkyC:{value:new z.Vector4(St[0],ut.y,St[1],ut.r)},uDomeM:{value:new z.Vector4(c0[0],c0[1],125,45)},uDayCol:{value:new z.Color(.22,.4,.58)},uSunCol:{value:new z.Color(1,.9,.66).multiplyScalar(2.2)},uDayDome:{value:new z.Color(.8,.82,.58)},uCool:{value:new z.Color(.088,.16,.34)},uLampW:{value:f0},uPoolG:{value:Ye},uAirCol:{value:new z.Color(.13,.26,.47)},uAirDome:{value:new z.Color(.05,.085,.095)},uBounce:{value:new z.Color(.11,.15,.065)},uAirK:{value:new z.Vector4(.0027,8e-4,1,0)},uSea:{value:new z.Vector4({sea:Fe.top,veil:Fe.top-2,rags:Fe.top-.4}[J],Fe.drop,{sea:.035,veil:.022,rags:.04}[J],{sea:1,veil:1.2,rags:.62}[J])},uSeaA:{value:new z.Vector4(Fe.a0,Fe.a1,Fe.a2,Fe.a3)},uSeaB:{value:new z.Vector4(He.x,He.z,Math.sin(he),-Math.cos(he))},uSeaCol:{value:new z.Color(.4,.55,.66)},uDrift:{value:new z.Vector2(.218,-.976)},uWash:{value:[0,1,2,3].map(()=>new z.Vector4(0,0,0,0))},uWashC:{value:[0,1,2,3].map(()=>new z.Color(0,0,0))},uGlowP:{value:new z.Vector4(St[0]-zt.x*(ut.y-46)/zt.y,46,St[1]-zt.z*(ut.y-46)/zt.y,.12)},uLampP:{value:fe},uLampD:{value:Oe},uLampC:{value:ye},uRain:{value:wt||Ue?1:0},uUp:{value:new z.Vector4(0,-900,0,0)},uCFall:{value:new z.Vector4(0,-900,0,0)}},Xt=(t={})=>Object.assign({uTime:it.uTime,uSunDir:it.uSunDir,uSkyC:it.uSkyC,uDomeM:it.uDomeM,uDayCol:it.uDayCol,uSunCol:it.uSunCol,uAirCol:it.uAirCol,uDayDome:it.uDayDome,uCool:it.uCool,uLampW:it.uLampW,uPoolG:it.uPoolG,uAirDome:it.uAirDome,uBounce:it.uBounce,uAirK:it.uAirK,uSea:it.uSea,uSeaA:it.uSeaA,uSeaB:it.uSeaB,uSeaCol:it.uSeaCol,uDrift:it.uDrift,uWash:it.uWash,uWashC:it.uWashC,uGlowP:it.uGlowP,uLampP:it.uLampP,uLampD:it.uLampD,uLampC:it.uLampC,uUp:it.uUp,uCFall:it.uCFall},t),_0=ot(Bt.a,Bt.l),Ze=(t,s,r=1)=>new z.ShaderMaterial({vertexShader:Ha,fragmentShader:Ka,side:z.DoubleSide,defines:s?{FLOOR:1}:{},uniforms:Xt({uTone:{value:new Ht(t[0],t[1],t[2])},uRain:it.uRain,uShade:{value:r},uPearl:{value:new z.Vector4(_0[0],_0[1],Bt.r,0)}})}),V0=Ze([1,1,0],!1,.72),H0=Ze([.6,.8,0],!0),d0=Ze([.3,.7,1]),u0=Ze([.9,1,0]),S0=Ze([.5,.9,.42],!1,.62),Dt=Ia(Oa.map(t=>{const s=ot(t[0],t[1]);return[s[0],t[2],s[1]]})),E=Dt.length,Ut=Math.ceil(E),Ot=new Float32Array(Ut+1),oe=new Float32Array(Ut+1),Wt=new Float32Array(Ut+1);{const t=new Ht;for(let s=0;s<=Ut;s++)Dt.posAtDist(Math.min(s,E),t),Ot[s]=t.x,oe[s]=t.y,Wt[s]=t.z}const K0={d:0,dh:0,s:0,y:0};function st(t,s,r,n=K0){let m=1/0,f=0;for(let l=0;l<=Ut;l+=32){const v=Ot[l]-t,w=oe[l]-s,i=Wt[l]-r,u=v*v+w*w+i*i;u<m&&(m=u,f=l)}for(let l=Math.max(0,f-32),v=Math.min(Ut,f+32);l<=v;l+=4){const w=Ot[l]-t,i=oe[l]-s,u=Wt[l]-r,p=w*w+i*i+u*u;p<m&&(m=p,f=l)}for(let l=Math.max(0,f-4),v=Math.min(Ut,f+4);l<=v;l++){const w=Ot[l]-t,i=oe[l]-s,u=Wt[l]-r,p=w*w+i*i+u*u;p<m&&(m=p,f=l)}return n.d=Math.sqrt(m),n.dh=Math.hypot(Ot[f]-t,Wt[f]-r),n.s=f,n.y=oe[f],n}function _t(t,s,r=K0){let n=1/0,m=0;for(let f=0;f<=Ut;f+=32){const l=Ot[f]-t,v=Wt[f]-s,w=l*l+v*v;w<n&&(n=w,m=f)}for(let f=Math.max(0,m-32),l=Math.min(Ut,m+32);f<=l;f+=4){const v=Ot[f]-t,w=Wt[f]-s,i=v*v+w*w;i<n&&(n=i,m=f)}for(let f=Math.max(0,m-4),l=Math.min(Ut,m+4);f<=l;f++){const v=Ot[f]-t,w=Wt[f]-s,i=v*v+w*w;i<n&&(n=i,m=f)}return r.dh=Math.sqrt(n),r.d=r.dh,r.s=m,r.y=oe[m],r}const Ct=new Ht,se=new Ht;function lt(t,s,r=[0,0,0]){Dt.posAtDist(t,Ct),Dt.tangentAtDist(t,se);const n=Math.hypot(se.x,se.z)||1;return r[0]=Ct.x-se.z/n*s,r[1]=Ct.y,r[2]=Ct.z+se.x/n*s,r}let K=null,Y=null;const ft={a:0,l:0},Q0=(t,s)=>K.r*(1+.09*Math.sin(3*Math.atan2(s-K.z,t-K.x)+.8)+.05*Math.sin(7*Math.atan2(s-K.z,t-K.x)+2.1)),je=t=>3.2*Math.sin(t*.045+.5)*C(Y.dams[0],Y.dams[0]+25,t)*(1-C(Y.sTop-30,Y.sTop-5,t)),Je=(t,s)=>{const r=11+2.6*Math.sin(t*.062+.8)+1.4*Math.sin(t*.17+2);return s<0?O(r,Y.left,C(Y.sTop-3,Y.sTop+5,t)):r},$0=(t,s,r)=>3.2*(s/r)*(s/r)*Math.min(1,r/14)+1.1*Math.sin(s*.5+t*.13)+.6*Math.sin(s*1.3-t*.31)+1.5*Math.abs(Math.sin(s*.42+t*.11)),Sa=t=>{const s=Y.dams,r=Y.N;if(t<=s[0])return(t-s[0])/5;if(t>=s[r])return r+Math.min(.999,(t-s[r])/Y.topLen);let n=0;for(;n<r-1&&t>=s[n+1];)n++;return n+(t-s[n])/(s[n+1]-s[n])},C0=t=>{const s=Sa(t);return s<0?K.y:Y.lev[Math.min(Y.N,Math.floor(s))]},xt={se:0,dE:0,wl:0,W:1,on:!1};function N0(t,s,r){if(xt.on=!1,r.dh>64||r.s<Y.dams[0]-14)return xt;const n=At(r.s,1,Ut-1),m=Ot[n+1]-Ot[n-1],f=Wt[n+1]-Wt[n-1],l=Math.hypot(m,f)||1,v=t-Ot[n],w=s-Wt[n],i=n+(v*m+w*f)/l,u=(w*m-v*f)/l-je(i),p=Je(i,u);return xt.wl=u,xt.W=p,xt.dE=Math.abs(u)-p,xt.se=i-$0(i,At(u,-p,p),p),xt.on=xt.se>Y.dams[0]-1.5&&xt.se<Y.sEnd,xt}function Z(t,s){Kt(t,s,ft);let r=Va(t,s,W,ft);const n=_t(t,s),m=n.y,f=n.dh;if(f<34&&(r=Math.min(r,m-6.4-2.6*C(480,560,n.s)*(1-C(E-90,E-40,n.s))+.5*Math.max(0,f-5))),Y&&(N0(t,s,n),xt.on&&xt.dE<22))if(xt.dE<-.4)r=O(C0(xt.se-6.5)-1,Math.max(r,Y.lev[Y.N]+.5),C(Y.sEnd-6,Y.sEnd,xt.se));else{const l=C0(xt.se)+.1+.9*C(0,3,xt.dE);r=Math.min(O(l,r,C(.5,9.5+.95*At(r-l,0,12),xt.dE)),m-6.4+.6*Math.max(0,f-4))}if(K){const l=Math.hypot(t-K.x,s-K.z),v=Q0(t,s);if(l<v+7){const w=K.y+.55+.5*W.n2(t*.3,s*.3),i=r<w?O(w,r,C(v+2.5,v+7,l)):O(w,r,C(v+.5,v+6,l));r=O(i,K.y-2.6,1-C(v-5,v+.3,l))}}return r}const Yt=(t,s,r)=>K===null?!1:!!(Math.hypot(t-K.x,s-K.z)<K.r*1.14+r||Y&&(t-Y.cx)*(t-Y.cx)+(s-Y.cz)*(s-Y.cz)<Y.rad*Y.rad&&(N0(t,s,_t(t,s)),xt.on&&xt.dE<r-.2));await g.yield();const X0=84,p0=[];for(let t=-110;t<470;t+=4.5)p0.push(t);for(let t=0;t<=74;t++)p0.push(470+300*Math.sin(t/74*Math.PI*.5));const Ca=p0.length,Y0=t=>C(186,214,t)*(1-C(288,316,t)),ne=t=>O(.8,.3,C(455,520,t)),Na=t=>{const s=t/X0;return Math.PI*(s-.3*Math.sin(tt*s)/tt)},m0=ot(me.a,me.l);function te(t,s,r){const n=mt(t),m=(n.left+n.right)*.5,f=Math.max((n.right-n.left)*.5,.01),l=Math.cos(s),v=Math.max(Math.sin(s),0);let w=m+f*Math.sign(l)*Math.pow(Math.abs(l),.55),i=-5+(n.roof+5)*Math.pow(v,ne(t));const u=Ke(t),p=Y0(t)*C(.5*Math.PI,.6*Math.PI,s);let c=u.x-u.hz*w,e=u.z+u.hx*w;p>0&&(i=O(i,Math.min(i,_a+4*W.n2(c*.05,e*.05)+26*(1-Y0(t))),p));const o=C(x0.a0,x0.a1,t)*(1-C(x0.a2,x0.a3,t));if(o>0){const I=47+.14*(t-100)+5*W.n2(c*.045+3,e*.045);i>I&&(i=O(i,I,o))}{const I=Math.hypot(c-wa[0],e-wa[1]);I<30&&(i=Math.min(i,ga+2.2*Math.pow(I,1.25)))}const a=Math.sign(l)*Math.pow(Math.abs(l),.7),d=v,h=W.fbm2(c*.012+i*.004,e*.012-i*.006,3),b=.5+.5*Math.sin((i+9*h)*.21),P=W.n3(c*.03,i*.04,e*.03),x=W.n3(c*.09,i*.11,e*.09),y=Math.tanh(2.6*W.n2(c*.034+40,e*.034-17)),k=C(.2,.62,W.n3(c*.021+9,i*.028,e*.021-4));let M=7*h+3.2*C(.2,.8,b)+3.4*P+.9*x+6.5*y*(1-.6*p)+11*k*(1-p);M*=.35+.65*C(0,22,i),M*=C(2,40,f);const A=0,N=l<0?C(.12,.5,-l)*(1-C(16+.09*(110-i),23+.09*(110-i),Math.abs(t-372)-3*Math.sin(i*.21)))*(1-C(92,110,i+8*W.n2(t*.09,5.5))):0;M-=N*(3+2*W.n2(t*.2,i*.045+3)+1.2*Math.sin(i*.55+2*W.n2(t*.3,1.5)));const L=Math.exp(-((c-m0[0])**2+(e-m0[1])**2)/(me.r*me.r))*(1-C(me.y1-14,me.y1,i));M+=me.depth*C(.12,.6,L);const F=l>0?Math.exp(-(Math.pow(t-Pt.a,2)+Math.pow(i-(Pt.y+Pt.drop+3),2))/55):0;M+=9*C(.15,.6,F),w+=a*M,i+=d*M*.6,c=u.x-u.hz*w,e=u.z+u.hx*w;const G=st(c,i,e);if(G.d<15){const I=(15-G.d)*1.4;w+=a*I,i+=d*I,c=u.x-u.hz*w,e=u.z+u.hx*w}r.p[0]=c,r.p[1]=i,r.p[2]=e,r.a[0]=(.5+.5*C(-.4,.5,P+.5*(b-.5)))*(1-.3*k)*(.82+.18*y)*(1-.95*C(.3,.7,L));const T=C(450,520,t);r.a[1]=At(.5*C(404,470,t)*(1-C(40,110,i))+T*(.45+.4*C(150,60,i))*C(-.2,.5,P),0,1)*(1-C(.1,.4,L))*(1-.85*N),r.a[2]=.75+.25*C(.5,-.3,x),r.a[3]=Math.max(A,N,.8*C(.1,.5,l)*C(92,104,t)*(1-C(128,146,t))*(1-C(14,30,i))*C(-.3,.4,P));const D=l<0?Math.exp(-Math.pow((t-ma)/15,2))*(1-C(64,82,i)):0;r.a[1]*=1-.9*D,r.a[2]+=.6*D;const R=l<0?Math.exp(-Math.pow((t-kt.a-6)/44,2))*(1-C(105,135,i)):0;r.a[1]=Math.max(r.a[1],R*(.55+.45*C(-.3,.3,P))*(1-C(.1,.4,L)));const B=R*C(.52,.72,W.n2(t*.42+3,i*.012+7));r.a[2]+=.5*B;const Q=l>0?Math.exp(-Math.pow((t-Pt.a)/9,2))*(1-C(Pt.y+Pt.drop+2,Pt.y+Pt.drop+12,i)):0;r.a[0]*=1-.9*C(.2,.6,F),r.a[2]+=.6*Q;const U=(.86+.28*W.n2(t*.01,i*.02))*(1-.5*D)*(1-.45*B)*(1-.35*Q);r.c[0]=U,r.c[1]=U,r.c[2]=U*1.02}{const t=ot(ut.a,ut.l),s=(l,v)=>{const w=Math.atan2(v-t[1],l-t[0]);return ut.r*(1+.07*Math.sin(w*3+1)+.05*Math.sin(w*7+4))},r=await P0(X0+1,Ca,(l,v,w)=>te(p0[v],Na(l),w),(l,v,w,i,u)=>{const p=(l[v*3]+l[w*3]+l[i*3]+l[u*3])*.25,c=(l[v*3+1]+l[u*3+1])*.5,e=(l[v*3+2]+l[w*3+2]+l[i*3+2]+l[u*3+2])*.25;return!(c>140&&Math.hypot(p-t[0],e-t[1])<s(p,e)+1.5)},4,g.yield);{const l=new z.Mesh(r,V0);l.name="shell",H.add(l)}const n=ge(97,9,(l,v,w)=>{const i=tt*l/96,u=Math.max(0,v-2)/6,p=ut.r*(1+.07*Math.sin(i*3+1)+.05*Math.sin(i*7+4)),c=160+46*u+(v===0?34:v===1?13:0),e=p+3.5-6*Math.sin(Math.min(u*2.2,1)*Math.PI)*.6+16*u*u+2.5*W.n2(Math.cos(i)*3+9,Math.sin(i)*3+u*2)+(v===0?22:v===1?8:0);w.p[0]=t[0]+Math.cos(i)*e,w.p[1]=c,w.p[2]=t[1]+Math.sin(i)*e,w.a[0]=.9,w.a[1]=.55+.4*u,w.a[2]=.8}),m=new z.Mesh(n,V0);m.name="collar",H.add(m);const f=new z.Mesh(new z.CircleGeometry(270,24).rotateX(Math.PI/2),new z.ShaderMaterial({vertexShader:Qa,fragmentShader:$a,uniforms:{uTime:it.uTime,uSunDir:it.uSunDir},side:z.DoubleSide}));f.position.set(t[0],232,t[1]),f.name="sky",H.add(f)}await g.yield();const nt={a:ma,rows:[],height:44};{const t={p:[0,0,0],a:[0,0,0,0],c:[0,0,0]},s=mt(nt.a),r=Ke(nt.a),n=-r.hz,m=r.hx,f=x=>te(nt.a,Math.PI-Math.asin(Math.min(1,Math.pow((x+5)/(s.roof+5),1/ne(nt.a)))),t);f(30);const l=t.p[0],v=t.p[2];let w=-1e9;for(let x=12;x<=70;x+=2)f(x),w=Math.max(w,(t.p[0]-l)*n+(t.p[2]-v)*m);const i=l+n*(w+6),u=v+m*(w+6),p=i+n*13.5,c=u+m*13.5,e=19;let o=1e9;for(let x=0;x<16;x++)o=Math.min(o,Z(p+Math.cos(x*tt/16)*e,c+Math.sin(x*tt/16)*e));o+=.6;for(let x=o+nt.height;x>o-.6;x-=1.5)nt.rows.push([i-n*.03*(x-o),x,u-m*.03*(x-o)]);nt.in=[n,m],nt.wall=[l+n*w,v+m*w],nt.face=[n*Math.cos(28*qt)-r.hx*Math.sin(28*qt),m*Math.cos(28*qt)-r.hz*Math.sin(28*qt)],K={x:p,z:c,r:e,y:o,fx:i,fz:u},await g.yield();const a=x=>{const y=At(Math.floor(x),0,Ut-1);return oe[y]+(oe[y+1]-oe[y])*At(x-y,0,1)};let d=0;for(let x=0;x<=Ut;x++)Math.hypot(Ot[x]-p,Wt[x]-c)<e&&(d=x);const h=E-25,b=[d-2.5],P=[];for(let x=0;b[x]+9<h;x++)b.push(b[x]+4.2+2.6*Math.abs(Math.sin(x*1.9+.6)));b.push(h);for(let x=0;x<b.length;x++)P.push(Math.max(a(b[x])-7.4,(x?P[x-1]:o)+.5));Y={dams:b,lev:P,N:b.length-1,sTop:h,topLen:16,sEnd:h+16,left:11,fall:null};{const x=lt(h+6,-22),y=Kt(x[0],x[2],{a:0,l:0}),k=y.a,M=mt(k),A=Ke(k),N=-A.hz,L=A.hx,F=_=>te(k,Math.PI-Math.asin(Math.min(1,Math.pow((_+5)/(M.roof+5),1/ne(k)))),t),G=P[P.length-1];F(G+8);const T=t.p[0],D=t.p[2];let R=-1e9;for(let _=G-2;_<=G+34;_+=2)F(_),R=Math.max(R,(t.p[0]-T)*N+(t.p[2]-D)*L);const B=T+N*(R+2.2),Q=D+L*(R+2.2),U=[];for(let _=G+31;_>G-.6;_-=1.5)U.push([B-N*.02*(_-G),_,Q-L*.02*(_-G)]);Y.fall={x:B,z:Q,y:G,top:G+31,rows:U,in:[N,L],face:[N*Math.cos(40*qt)-A.hx*Math.sin(40*qt),L*Math.cos(40*qt)-A.hz*Math.sin(40*qt)]};const I=_t(B,Q);Y.left=Math.max(12,I.dh+4);const V=lt((b[0]+Y.sEnd)*.5,0);Y.cx=V[0],Y.cz=V[2],Y.rad=(Y.sEnd-b[0])*.5+Y.left+26}}const vt={rows:[],x:0,z:0,y:0,in:[0,0],face:[0,0],d:0};{const t={p:[0,0,0],a:[0,0,0,0],c:[0,0,0]},s=mt(Pt.a),r=Ke(Pt.a),n=r.hz,m=-r.hx,f=e=>te(Pt.a,Math.asin(Math.min(1,Math.pow((e+5)/(s.roof+5),1/ne(Pt.a)))),t);f(Pt.y+10);const l=t.p[0],v=t.p[2];let w=-1e9;for(let e=Pt.y-2;e<=Pt.y+Pt.drop-4;e+=2)f(e),w=Math.max(w,(t.p[0]-l)*n+(t.p[2]-v)*m);const i=l+n*(w+2.5),u=v+m*(w+2.5),p=Z(i,u)+.05,c=Pt.y+Pt.drop;for(const[e,o]of[[7,.7],[4.5,.6],[2.2,.35]])vt.rows.push([i-n*(.035*(c-p)+e),c+o,u-m*(.035*(c-p)+e)]);for(let e=c;e>p-.8;e-=1.5)vt.rows.push([i-n*.035*(e-p),e,u-m*.035*(e-p)]);vt.x=i,vt.z=u,vt.y=p,vt.in=[n,m],vt.face=[n*Math.cos(35*qt)-r.hx*Math.sin(35*qt),m*Math.cos(35*qt)-r.hz*Math.sin(35*qt)],vt.d=1e9;for(const e of vt.rows)vt.d=Math.min(vt.d,st(e[0],e[1],e[2]).d);it.uCFall.value.set(i,p,u,1),H.userData.caveFall={drop:+(c-p).toFixed(1),least:+vt.d.toFixed(1)}}const t0=new Float32Array(900);{const t={a:0,l:0};let s=0;for(let r=0;r<=Ut;r++){Kt(Ot[r],Wt[r],t);const n=At(Math.round(t.a+110),0,899);t0[n]=t.l,s=n}for(let r=0;r<110;r++)t0[r]=0;for(let r=s;r<900;r++)t0[r]=t0[s]}const e0=[];for(let t=-110;t<-20;t+=6)e0.push(t);for(let t=-20;t<452;t+=3)e0.push(t);for(let t=452;t<=773;t+=3.1)e0.push(t);const Z0=58,S=[0,0];{const t=await P0(Z0,e0.length,(r,n,m)=>{const f=e0[n],l=mt(f),v=t0[At(Math.round(f+110),0,899)],w=r/(Z0-1)*2-1,i=w<0?v-(l.left-12):l.right+12-v,u=v+Math.sign(w)*Math.pow(Math.abs(w),1.7)*Math.max(i,1);ot(f,u,S);const p=k0(f,u);m.p[0]=S[0],m.p[1]=Z(S[0],S[1]),m.p[2]=S[1];const c=Math.abs(u-$e(f))-l0(f),e=W.n2(S[0]*.07,S[1]*.07),o=C(450,482,f),a=(1-C(4,16,c))*(1-C(426,450,f))*C(-.6,.2,e+.4),d=C(Rt.a0-12,Rt.a0+6,f)*(1-C(Rt.a1-4,Rt.a1+14,f))*C(Rt.l0+7,Rt.l0-3,u)*(1-C(Rt.l1+6,Rt.l1-10,u)),h=Math.max(a,d);m.c[0]=O(.95,1.5,h),m.c[1]=O(.95,1.36,h),m.c[2]=O(.95,1.08,h),m.a[0]=c<0?.6:1,m.a[1]=At(.3*C(410,452,f)*C(-.3,.4,e)+o*(.72+.28*e),0,1),m.a[2]=O(.85,.35,h),m.a[3]=p.zone>.002?p.zone:-1-Re(f,u)},null,5,g.yield),s=new z.Mesh(t,H0);s.name="floor",H.add(s)}{const t=Y.N,s=[0,.02,.045,.085,.3,.65],r=[0,.02,.045,.085,.25,.5,.75,.999],n=[];for(let v=0;v<=t;v++)for(const w of v===t?r:s)n.push([v,w]);const m=[-1.13,-1,-.95,-.88,-.8,-.7,-.6,-.5,-.4,-.3,-.2,-.1,0,.1,.2,.3,.4,.5,.6,.7,.8,.88,.95,1,1.13],f=await P0(m.length,n.length,(v,w,i)=>{const u=n[w][0],p=n[w][1],c=m[v],e=c<0?-1:1,o=Math.abs(c)>=1,a=Math.abs(c)>1,d=Y.dams[u]+(p===0?-.15:p<.03?-.45:p*(u===t?Y.topLen:Y.dams[u+1]-Y.dams[u]));let h=d,b=0,P=1;for(let A=0;A<6;A++)P=Je(h,e),b=Math.min(Math.abs(c),1)*e*P,h=d+$0(h,b,P);const x=lt(At(h,0,E-.01),je(h)+b+(a?e*1.5:0)),y=Y.lev[u],k=u?Y.lev[u-1]:K.y-.3;let M=p===0?k-.25:p<.03?k+.66*(y-k):p<.05?y+.14:p<.09?y+.02:y;o&&p>.03&&(M=Math.max(M,y+.3)),a&&(M=(p<.03?k:y)-4.5),i.p[0]=x[0],i.p[1]=M,i.p[2]=x[2],i.a[0]=p===0?.7:1,i.a[1]=o?1:Math.abs(c)>.9?.45:0,i.a[2]=1.2,i.a[3]=2+u+p},null,10,g.yield),l=new z.Mesh(f,H0);l.name="bank-stairs",H.add(l)}await g.yield();const F0=wt?.5:0;{const r=new Float32Array(5049),n=new Float32Array(1683*3),m=[];for(let v=0;v<187;v++){const w=-112+v*3,i=l0(w)+3.5+2*F0+12*A0(w),u=At((ve(w+1.5)-ve(w-1.5))*.7,0,1);for(let p=0;p<9;p++){const c=p/8*2-1,e=v*9+p;ot(w,$e(w)+c*i,S),r[e*3]=S[0],r[e*3+1]=ve(w)+F0-.25*C(436,446,w),r[e*3+2]=S[1],n[e*3]=w,n[e*3+1]=c,n[e*3+2]=u}}for(let v=0;v<186;v++)for(let w=0;w<8;w++){const i=v*9+w,u=i+1,p=i+9,c=p+1;m.push(i,p,u,u,p,c)}const f=new z.BufferGeometry;f.setAttribute("position",new z.BufferAttribute(r,3)),f.setAttribute("aR",new z.BufferAttribute(n,3)),f.setIndex(m),f.computeBoundingSphere();const l=new z.Mesh(f,new z.ShaderMaterial({vertexShader:Xa,fragmentShader:Ya,uniforms:Xt({uMilk:{value:wt?1:0}}),side:z.DoubleSide,transparent:!0}));l.name="river",l.renderOrder=1,H.add(l)}await g.yield();const j0=(t,s)=>t.r*(1+.4*Math.exp(-s*8))*O(1,.4,Math.pow(s,1.25))*(s>.9?Math.sqrt(Math.max(0,1-Math.pow((s-.9)/.1,2)))*.85+.15*(1-(s-.9)/.1):1),R0=(t,s)=>t.form==="tiers"?j0(t,s):t.form==="broken"?t.r*(.55+.5*(1-s)+.5*Math.exp(-s*7)):t.form==="bell"?t.r*1.8:t.form==="candles"?t.r*1.05:t.form==="column"?t.r*(.6+1.15*Math.pow(Math.abs(s-.42)/.58,1.6)+.45*Math.exp(-s*9)):t.r*1.75,a0=(t,s,r,n,m,f,l=0)=>{const v={r:0,y:0,dx:0,dz:0,ao:1,tone:1},w=ge(n+1,m,(u,p,c)=>{const e=tt*u/n;v.dx=0,v.dz=0,v.ao=1,v.tone=.95,f(e,p,v),c.p[0]=t+Math.cos(e)*v.r+v.dx,c.p[1]=r+v.y,c.p[2]=s+Math.sin(e)*v.r+v.dz,c.a[0]=At(v.ao,.18,1),c.a[1]=l,c.a[2]=1.3,c.a[3]=0,c.c[0]=v.tone,c.c[1]=v.tone*.98,c.c[2]=v.tone*.94}),i=w.attributes.normal;for(let u=0;u<m;u++){const p=u*(n+1),c=p+n,e=i.getX(p)+i.getX(c),o=i.getY(p)+i.getY(c),a=i.getZ(p)+i.getZ(c),d=Math.hypot(e,o,a)||1;i.setXYZ(p,e/d,o/d,a/d),i.setXYZ(c,e/d,o/d,a/d)}return w},Nt=[];for(let t=0;t<M0.length;t++){const s=M0[t],r=s.ly;let n=s.gap+s.r*.75,m=[0,0,0];const f=a=>{ot(s.a,s.side*a,S),m[0]=S[0],m[2]=S[1]};for(let a=0;a<4;a++){f(n);const d=Z(m[0],m[2])-1.5,h=At((r-d)/s.h,0,1);n=s.gap+R0(s,h)*(s.form==="tiers"?1.3:1.08)+Math.abs(Math.tan(s.lean))*Math.max(0,r-d)}s.form==="column"&&(n=s.gap+5.2),f(n);const l=Z(m[0],m[2])-1.5,v=11+t%4*3,w=Math.round(s.h/(t===1?5.2:s.r<5.2?3.4:4.4)),i=Math.tan(s.lean)*.8,u=-Math.tan(s.lean)*.6;if(s.form!=="tiers"){const a=[],d=m[0],h=m[2],b=(x,y,k)=>1+.07*Math.cos(x*k+2.5*Math.sin(y*5+t))+.06*W.n3(Math.cos(x)*2+t*7,y*7,Math.sin(x)*2);if(s.form==="broken")a.push(a0(d,h,l,30,22,(y,k,M)=>{const A=Math.min(1,k/19),N=k>=19,L=1-.13*(.5+.5*Math.cos(y-.8))-.03*Math.cos(y*5);M.y=s.h*Math.min(A,1)*(N?L:Math.min(1,A)<.999?1:L),k===21&&(M.y=s.h*.9),M.r=R0(s,A)*b(y,A,9)*(k===20?.55:k===21?.02:1),M.dx=i*M.y,M.dz=u*M.y,M.ao=N?1:.55+.45*Math.cos(y*9+2.5*Math.sin(A*5+t))*.5+.2,M.tone=N?1.25:.92+.14*W.n2(y*1.3+9,A*6)}));else if(s.form==="bell"){const x=[[0,1.5,0],[.04,.95,0],[.2,.62,0],[.4,.56,0],[.52,.7,0],[.57,1.15,0],[.55,1.6,1],[.6,1.8,0],[.7,1.74,0],[.8,1.52,0],[.89,1.15,0],[.96,.66,0],[1,.02,0]];a.push(a0(d,h,l,40,x.length,(y,k,M)=>{const A=x[k],N=Math.pow(.5+.5*Math.cos(y*13+1.4*Math.sin(y*3)),2)*(.5+.5*Math.sin(y*2+1));M.y=s.h*A[0]-(A[2]?1.2+4.2*N:0)+(k>6?.7*Math.sin(y*2+.6):0),M.r=s.r*A[1]*(1+(k>0&&k<5?.08*Math.cos(y*7):.04*Math.cos(y*13))+.05*W.n3(Math.cos(y)*2,A[0]*6,Math.sin(y)*2)),M.ao=k===5||k===4?.3:k===6?.7:1,M.tone=.92+.14*W.n2(y*1.5,A[0]*5)}))}else if(s.form==="column")a.push(a0(d,h,l,30,26,(y,k,M)=>{const A=k/25;M.y=A*(ga+16-l),M.r=R0(s,A)*b(y,A,7)*(1+.1*Math.sin(A*31+1.7*Math.sin(y*2))),M.ao=.75+.25*Math.cos(y*7+2.5*Math.sin(A*5+t)),M.tone=.74+.14*W.n2(y*1.3+4,A*9)},.25));else{const x=s.form==="organ",y=x?11:7,k=9;a.push(a0(d,h,l,22,5,(M,A,N)=>{const L=A/4;N.y=4.5*L*(1+.2*Math.sin(M*2)),N.r=s.r*(x?1.3:1.15)*(1-.55*L*L)*(1+.1*Math.cos(M*5+t))*(A===4?.02:1),N.ao=.9},x?.3:0));for(let M=0;M<y;M++){let A,N,L,F;if(x){const T=M<7?0:1,D=T?(M-7+.5)/4:M/6,R=(D-.5)*1.9+.9;A=Math.cos(R)*s.r*(T?.35:.95)-s.r*.5*Math.cos(.9),N=Math.sin(R)*s.r*(T?.35:.95)-s.r*.5*Math.sin(.9),L=s.h*(.45+.55*Math.sin(Math.PI*(.12+.76*D)))*(T?.6:1)*(.92+.16*Math.abs(Math.sin(M*2.7))),F=s.r*(.3+.07*Math.sin(M*1.9))}else{const T=M*2.4+.5*Math.sin(M*1.3),D=M===0?0:s.r*(.42+.3*Math.abs(Math.sin(M*1.7)));A=Math.cos(T)*D,N=Math.sin(T)*D,L=s.h*(M===0?1:.3+.55*Math.abs(Math.sin(M*2.9+1))),F=s.r*(M===0?.3:.15+.07*Math.abs(Math.sin(M*4.1)))}const G=x?0:.03*Math.sin(M*3.3);a.push(a0(d+A,h+N,l+1.2,x?9:8,k,(T,D,R)=>{const B=D/(k-1),Q=x?Math.sqrt(Math.max(0,1-Math.pow(Math.max(0,B-.9)/.1,2))):Math.pow(Math.max(0,1-B),.55)*.8+.2*Math.sqrt(Math.max(0,1-B*B));R.y=L*(x?Math.min(1,B/.9)*.97+.03*B:B),R.r=F*(D===k-1?.02:Q*(1+.13*Math.sin(B*(x?9:17)+M*2)+(x?.07*Math.cos(T*4):0))+.5*Math.exp(-B*9)),R.dx=G*R.y,R.dz=-G*.6*R.y,R.ao=.7+.3*B,R.tone=.9+.16*Math.abs(Math.sin(M*5.3))},x?.3*.6:0))}}const P=new z.Mesh(a.length>1?h0(a):a[0],d0);P.name="tower",H.add(P),Nt.push({x:d,y:l,z:h,T:s,off:n,leanX:i,leanZ:u}),await g.yield();continue}const p=36,c=[];for(let a=0;a<w+2;a++)for(const d of[0,.14,.34,.56,.76,.86,.94])c.push(a+d);const e=await P0(p+1,c.length,(a,d,h)=>{const b=tt*a/p,P=c[d],x=Math.floor(P+1e-6),y=P-x,k=Q=>(.1+.16*Math.abs(Math.sin(Q*3.7+t)))*Math.sin(b+Q*2.3)+.07*Math.sin(b*3+Q*1.1),M=O(k(x),k(x+1),C(.5,1,y)),A=Math.pow(At((P-M-.9)/w,0,1),1/.9),N=A*s.h,L=Math.pow(1-y,1.4),F=C(.74,1,y),G=O(L,1,F),T=O(.7+.6*Math.abs(Math.sin(x*2.9+t)),.7+.6*Math.abs(Math.sin((x+1)*2.9+t)),F),D=.5+.5*Math.cos(b*v+(x+1)*2.4+1.2*Math.sin((x+1)*1.7)),R=j0(s,A)*(.82+.2*G*T+.07*F*D+.025*Math.cos(b*v+x*2.4)*L+.05*W.n3(Math.cos(b)*2.2+t*9,A*6,Math.sin(b)*2.2));h.p[0]=m[0]+Math.cos(b)*R+i*N,h.p[1]=l+N,h.p[2]=m[2]+Math.sin(b)*R+u*N,h.a[0]=At((.5+.5*L)*(1-.7*F*(1-.45*D)),.18,1),h.a[1]=0,h.a[2]=1.3;const B=.9+.16*W.n2(b*1.3+t*5,A*5);h.c[0]=B,h.c[1]=B*.98,h.c[2]=B*.94},null,12,g.yield);{const a=e.attributes.normal,d=p+1;for(let h=0;h<c.length;h++){const b=h*d,P=b+p,x=a.getX(b)+a.getX(P),y=a.getY(b)+a.getY(P),k=a.getZ(b)+a.getZ(P),M=Math.hypot(x,y,k)||1;a.setXYZ(b,x/M,y/M,k/M),a.setXYZ(P,x/M,y/M,k/M)}}const o=new z.Mesh(e,d0);o.name="tower",H.add(o),Nt.push({x:m[0],y:l,z:m[2],T:s,off:n,leanX:i,leanZ:u}),await g.yield()}const ht={};for(const t of["spires","tites","lamps","drips","blocks","karst","trees","under","ferns","lianas","rim","motes","threads","swifts","flies","cloud","shower","pearls","wallferns","spare1","spare2","islands","roof","bloom","water","party"])ht[t]=q.fork(t);const J0=(t,s,r=0)=>ge(8,5,(n,m,f)=>{const l=tt*n/7,v=Math.pow(m/4,s?1.5:1),i=(r===1?.36*Math.sqrt(Math.max(0,1-v*v*v))*(1+.3*Math.cos(v*12.6)):r===2?.85*Math.sqrt(Math.max(0,1-v*v)):.5*Math.pow(1-v,.75+.3*t)+(s?.32*Math.exp(-v*6):0))*(1+.16*Math.cos(l*5+t*3)+.2*Math.sin(v*9+t*5))+(v<.999?.02:0);f.p[0]=Math.cos(l)*i,f.p[1]=s?-v:v,f.p[2]=Math.sin(l)*i,f.a[0]=.75+.25*Math.cos(l*5+t*3),f.a[2]=1.1,f.c[0]=.95,f.c[1]=.93,f.c[2]=.88}),Zt={p:[0,0,0],a:[0,0,0,0],c:[0,0,0]};function xe(t,s){let r=.03*Math.PI,n=.97*Math.PI;for(let m=0;m<13;m++){const f=(r+n)*.5;te(t,f,Zt),Kt(Zt.p[0],Zt.p[2],ft),ft.l>s?r=f:n=f}return te(t,(r+n)*.5,Zt),Zt.p[1]}const be=new z.Matrix4,v0=new z.Quaternion,ta=new Ht,ea=new Ht,g0=new z.Euler,Me=(t,s,r,n)=>{const m=new z.InstancedMesh(t,s,Math.max(1,r.length));for(let f=0;f<r.length;f++){const l=r[f];g0.set(l[7]||0,l[6]||0,l[8]||0,"YXZ"),v0.setFromEuler(g0),be.compose(ea.set(l[0],l[1],l[2]),v0,ta.set(l[3],l[4],l[5])),m.setMatrixAt(f,be)}return m.count=r.length,m.instanceMatrix.needsUpdate=!0,m.computeBoundingSphere(),m.name=n,H.add(m),m};{const t=ht.spires,s=[[],[],[]];for(let w=0;w<2;w++){const i=Nt[w];for(let u=0;u<11;u++){const p=t()*tt,c=i.T.r*t.range(1.15,2.6),e=t.int(0,2),o=t.range(2,8)*(1-.5*C(1.5,2.6,c/i.T.r))*(e===2?.4:1),a=o*(e===2?t.range(1.3,2.2):t.range(.2,.36)),d=i.x+Math.cos(p)*c,h=i.z+Math.sin(p)*c,b=Z(d,h)-.4;st(d,b+o,h).d<12.5||st(d,b,h).d<12.5||s[e].push([d,b,h,a,o,a,t()*tt,t.range(-.05,.05),t.range(-.05,.05)])}}for(let w=0;w<28;w++){const i=t.range(-60,250),u=mt(i),p=t.range(u.left+6,u.right-6),c=t.int(0,2),e=t.range(1.5,7)*(c===2?.4:1),o=e*(c===2?t.range(1.3,2.2):t.range(.3,.5));ot(i,p,S);const a=Math.abs(p-$e(i))-l0(i),d=k0(i,p),h=Z(S[0],S[1])-.4;a<7||d.zone>.05||i>Rt.a0-16&&i<Rt.a1+16&&p<Rt.l0+10||st(S[0],h+e,S[1]).d<12.5||s[c].push([S[0],h,S[1],o,e,o,t()*tt,t.range(-.04,.04),t.range(-.04,.04)])}for(let w=0;w<3;w++)Me(J0(.3+w*.9,!1,w),S0,s[w],"stalagmites");await g.yield();const r=ht.tites,n=[[],[]];for(let w=0;w<170;w++){const i=r.range(196,336),u=r.range(-66,-11),p=(4+22*Math.pow(r(),1.8))*(.5+.5*C(-64,-20,u)),c=r.int(0,1),e=r.range(.11,.2),o=r()*tt,a=(u>-42?Math.max(xe(i,u-3),xe(i,u+3),xe(i,u)):xe(i,u))+1.5,d=Zt.p[0],h=Zt.p[2];let b=a-p;for(let P=0;P<30&&st(d,b,h).d<12.5;P++)b+=1;w%24===23&&await g.yield(),!(a-b<4)&&n[c].push([d,a,h,(a-b)*e,a-b,(a-b)*e,o,0,0])}let m=1e9;for(let w=0;w<370;w++){const i=w>=290,u=i?(w%2?104:186)+r.range(-3,3):r.range(96,194),p=r.range(-34,52),c=r.int(0,1),e=r.range(.1,.18),o=r()*tt,a=r();if(ot(u,p,S),!i&&W.n2(S[0]*.06+11,S[1]*.06)<-.22)continue;const d=i?2.5+4*a:(4+15*Math.pow(a,1.7))*(.6+.4*C(-30,20,p)),h=xe(u,p)+1.5,b=Zt.p[0],P=Zt.p[2];let x=h-d,y=st(b,x,P);for(let k=0;k<30&&y.d<13;k++)x+=1,y=st(b,x,P);w%30===29&&await g.yield(),!(h-x<2.5||h>90)&&(y.dh<30&&(m=Math.min(m,x-oe[y.s])),n[c].push([b,h,P,(h-x)*e+.25,h-x,(h-x)*e+.25,o,0,0]))}H.userData.hang={tipOverLine:+m.toFixed(1)};for(let w=0;w<2;w++)Me(J0(.2+w*1.1,!0),S0,n[w],"stalactites");await g.yield();const f=(w,i,u=9.5)=>{const p=[];for(let c=0;c<w;c++)p.push(i(c/(w-1)));return ge(w,6,(c,e,o)=>{const a=c/(w-1),d=p[c],h=e/5;let b=d[1]+1.2-(d[3]+1.2)*h;for(let P=0;P<30&&st(d[0],b,d[2]).d<u;P++)b+=1;o.p[0]=d[0],o.p[1]=Math.min(b,d[1]+1.2),o.p[2]=d[2],o.a[0]=.7+.3*Math.sin(a*60),o.a[2]=1.3,o.a[3]=1,o.c[0]=1,o.c[1]=.95,o.c[2]=.85})},l=[];for(let w=0;w<4;w++){const i=204+w*25,u=w*1.7;l.push(f(64,p=>{const c=xe(i+21*p+1*Math.sin(p*23+u),-14-6*w%9-3.2*Math.sin(p*5.1+u)-1.3*Math.sin(p*27+u));return[Zt.p[0],c,Zt.p[2],20-4*(.5-.5*Math.cos(p*11+u))-2.5*(.5-.5*Math.cos(p*25+u*2))-13*Math.pow(Math.abs(p-.5)*2,3)]})),await g.yield()}for(let w=0;w<3;w++){const i=122+w*27,u=w*2.3+.7,p=w===1?-30:-8,c=w===1?24:50;l.push(f(64,e=>{const o=xe(i+5*Math.sin(e*4.4+u)+1.2*Math.sin(e*23+u),O(p,c,e)+1.1*Math.sin(e*29+u));return[Zt.p[0],o,Zt.p[2],14-4*(.5-.5*Math.cos(e*12+u))-2.5*(.5-.5*Math.cos(e*27+u*2))-6*Math.pow(Math.abs(e-.5)*2,3)]},13)),await g.yield()}const v=new z.Mesh(h0(l),S0);v.name="curtains",H.add(v)}await g.yield();{const t={p:[0,0,0],a:[0,0,0,0],c:[0,0,0]},s=[];for(let n=0;n<5;n++){const m=349+n*8.6,f=30,l=22+9*Math.abs(Math.sin(n*2.3+1)),v=58+5*Math.sin(n*1.7),w=[];for(let i=0;i<=f;i++){const u=m+9.4*i/f,p=mt(u);te(u,Math.PI-Math.asin(Math.min(1,Math.pow((v+5)/(p.roof+5),1/ne(u)))),t);const c=Ke(u);w.push([t.p[0],t.p[1],t.p[2],-c.hz,c.hx])}await g.yield(),s.push(ge(f+1,7,(i,u,p)=>{const c=i/f,e=u/6,o=w[i],a=Math.sin(c*31+n*2),d=1.2+(1.4+1.6*e)*(.5+.5*a)+.8*e,h=l*(.72+.28*Math.abs(Math.sin(c*13+n)))*(1-.5*Math.pow(Math.abs(c-.5)*2,3));p.p[0]=o[0]+o[3]*d*Math.min(1,e*3),p.p[1]=o[1]+1.5-(h+1.5)*e,p.p[2]=o[2]+o[4]*d*Math.min(1,e*3),p.a[0]=.5+.5*(.5+.5*a),p.a[2]=1.3,p.a[3]=1,p.c[0]=1,p.c[1]=.96,p.c[2]=.88}))}const r=new z.Mesh(h0(s),d0);r.name="draperies",H.add(r)}await g.yield();const Fa=it.uTime,o0=[],aa=[],oa=[];{const t=ht.lamps,s=yt?72:50,r=dt?["#4aa3ff","#FFD9A0"]:["#FF9A3D","#FFD9A0"],n=()=>{const e=new z.SphereGeometry(1,16,7,0,tt,0,Math.PI*.5);e.scale(2.2,1.5,1.5);const o=e.attributes.position;for(let a=0;a<o.count;a++){const d=o.getX(a)/2.2;o.setZ(a,o.getZ(a)*(1-.35*d*d)),o.setY(a,o.getY(a)*(1-.25*d*d))}return e.computeVertexNormals(),e};for(let e=0;e<2;e++){const o=lt(s+(e?-7:5),e?-44:-38),a=Z(o[0],o[2]),d=Xt({uCol:{value:Ve(r[e])},uGlow:{value:1.5}}),h=new z.Mesh(n(),new z.ShaderMaterial({vertexShader:Za,fragmentShader:ja,uniforms:d,side:z.DoubleSide}));h.position.set(o[0],a-.03,o[2]),h.rotation.y=.5+e*1.1,h.name="tent",H.add(h),aa.push(d);const b=Ve(r[e]).lerp(Ve("#FFB060"),dt&&e===0?.15:.5);fe[e].set(o[0],a+.7,o[2],34),ye[e].copy(b).multiplyScalar(9),f0[e].set(.5,50),o0.push({slot:e,x:o[0],y:a+.7,z:o[2],phase:e*2.3,col:b,power:9,tent:!0})}const m=[],f=[],l=["#FFE9CC","#FFF3E0","#FFE2B8"],v=(e,o,a,d,h,b,P,x,y=0,k=1,M=!0)=>{const A=Ve(t.pick(l));let N=st(e,Z(e,o)+.9,o);for(let V=0;V<40&&N.d<21;V++){const _=e-Ot[N.s],rt=o-Wt[N.s],ct=Math.hypot(_,rt)||1;e+=_/ct,o+=rt/ct,N=st(e,Z(e,o)+.9,o)}const L=o0.length;if(N.d<21||M&&L>=Xe-1)return null;const F=Z(e,o),G=Math.atan2(h-o,a-e),T=e+Math.cos(G)*.16,D=F+1.63,R=o+Math.sin(G)*.16,B=a-T,Q=d-D,U=h-R,I=Math.hypot(B,Q,U)||1;return m.push([e,F-.05,o,1,1,1,-G-Math.PI/2,0,0]),M?(fe[L].set(T,D,R,P),Oe[L].set(B/I,Q/I,U/I,b),ye[L].copy(A).multiplyScalar(x),f0[L].set(y,k),o0.push({slot:L,x:T,y:D,z:R,col:A,power:x}),[e,F,o]):(f.push([T,D,R]),[e,F,o])},w=e=>{let o=-22;for(let a=0;a<50&&(ot(e,o,S),!(Z(S[0],S[1])>ve(e)+F0+.3));a++,o-=.5);return o-.4};{const e=t.range(41,46),o=lt(e,w(e)-1),a=Nt[5];v(o[0],o[2],a.x,a.y+13,a.z,.74,64,6.5,.8,80)}{const e=t.range(80,86),o=lt(e,w(e)),a=lt(66+t.range(-3,3),39,[0,0,0]);v(o[0],o[2],a[0],11,a[2],.86,130,60,.8,80)}{const e=t.range(26,33),o=lt(e,w(e)),a=lt(e+3,-18.5,[0,0,0]);v(o[0],o[2],a[0],.2,a[2],.72,16,4,.7,70)}if($t===8){const e=t.range(8,16),o=lt(e,w(e)),a=lt(e-14,-17,[0,0,0]);v(o[0],o[2],a[0],.2,a[2],.74,22,6,.5,44)}{ot(Bt.a+1.5,Bt.l+6.5,S);const e=S[0],o=S[1];ot(Bt.a,Bt.l,S),v(e,o,S[0],Z(S[0],S[1]),S[1],.78,18,5,.6,46)}const i=[];{const e=t.range(160,176),o=lt(e,t.range(30,40)),a=lt(e-3,24,[0,0,0]);v(o[0],o[2],a[0],Z(a[0],a[2]),a[2],.74,17,4.5,.6,50),Ye[1].set(a[0],a[2],12,Z(a[0],a[2])),i.push([a[0],Z(a[0],a[2])+.2,a[2]]),it.uUp.value.set(a[0],Z(a[0],a[2]),a[2],115)}{const e=lt(110,21,[0,0,0]);Ye[0].set(e[0],e[2],18,Z(e[0],e[2])),i.push([e[0],Z(e[0],e[2])+.2,e[2]])}for(let e=0;e<Ma.length;e++){const o=Ma[e];ot(o.a,o.l,S);const a=Z(S[0],S[1]);Ye[2+e].set(S[0],S[1],o.r,a),i.push([S[0],a+.2,S[1]])}{const e=Nt[0],o=lt(e.T.a-15,-(e.off+9));v(o[0],o[2],e.x,e.y+22,e.z,.72,50,16,1.2,80)}{const e=Nt[1],o=lt(e.T.a-26,e.off+19);v(o[0],o[2],e.x,e.y+30,e.z,.8,66,40,1.3,90),it.uWash.value[0].set(e.x,e.z,e.y+14,e.y+50),it.uWashC.value[0].setRGB(1,.72,.38).multiplyScalar(.4)}{const e=Nt[2],o=Nt[4],a=Nt[6],d=ot(370,-66,[0,0]);[Nt[2],Nt[3],Nt[4]].forEach((h,b)=>{it.uWash.value[1+b].set(h.x+h.leanX*14,h.z+h.leanZ*14,h.y+3,h.y+.8*h.T.h),it.uWashC.value[1+b].setRGB(1,.74,.42).multiplyScalar(b===1?.3:.55)});for(const[h,b,P,x,y,k,M,A,N]of[[301,-30,e.x+e.leanX*18,e.y+22,e.z+e.leanZ*18,50,20,1.3,85],[318,44,o.x,o.y+24,o.z,56,30,1.2,80],[284,48,vt.x,vt.y+16,vt.z,54,36,1,70],[352,-31,d[0],44,d[1],80,22,.7,95],[392,6,a.x,a.y+22,a.z,60,10,.5,80]])ot(h,b,S),v(S[0],S[1],P,x,y,.76,k,M,A,N)}for(const e of[[612,58],[548,32],[660,20]].slice(0,$t===9?3:2)){ot(e[0],e[1],S);const o=S[0],a=S[1];ot(e[0]-8,e[1]-8,S);const d=v(o,a,S[0],Z(S[0],S[1]),S[1],.74,12,8,0,1,!1);d&&oa.push(d)}{const e=ot(kt.a,kt.l);fe[Xe-1].set(e[0],kt.y,e[1],36),Oe[Xe-1].set(0,-1,0,-2),ye[Xe-1].copy(Ve("#ffd9a0")).multiplyScalar(5)}const u=ge(9,13,(e,o,a)=>{const d=tt*e/8,h=o/12,b=h*1.74,P=b<.9?.15+.03*Math.sin(d*2):b<1.42?O(.17,.22,(b-.9)/.52):b<1.5?O(.22,.075,(b-1.42)/.08):b<1.62?O(.075,.135,C(1.5,1.6,b)):.135*Math.sqrt(Math.max(0,1-Math.pow((b-1.62)/.12,2)));a.p[0]=Math.cos(d)*P*(b<1.45?1.25:1),a.p[1]=b,a.p[2]=Math.sin(d)*P*(b<1.45?.8:1);const x=b>1.52?.5:.22;a.c[0]=x,a.c[1]=x,a.c[2]=x,a.a[2]=.2});Me(u,u0,m,"figures");const p=o0.filter(e=>!e.tent).map(e=>[e.x,e.y,e.z]).concat(f,i),c=Ua.makeGlows({rng:ht.lamps,positions:p,color:"#FFE9CC",size:.9,intensity:2,halo:.8,core:1.3,minAngle:.0045,fogAmount:.25,time:Fa});c.object.name="lamps",H.add(c.object)}{const t=ht.pearls,s=[];for(let l=0;l<260;l++){const v=t()*tt,w=Math.sqrt(t())*(Bt.r-.7),i=t.range(.045,.07);ot(Bt.a+Math.cos(v)*w,Bt.l+Math.sin(v)*w,S),s.push([S[0],Z(S[0],S[1])+i*.8,S[1],i,i,i,0,0,0])}const r=new z.OctahedronGeometry(1,0),n=r.attributes.position.count,m=new Float32Array(n*4),f=new Float32Array(n*3);for(let l=0;l<n;l++)m.set([1,0,2,1],l*4),f.set([1.5,1.45,1.3],l*3);r.setAttribute("aA",new z.BufferAttribute(m,4)),r.setAttribute("aC",new z.BufferAttribute(f,3)),r.setAttribute("normal",r.attributes.position.clone()),Me(r,d0,s,"pearls")}await g.yield();const Ra={transparent:!0,depthWrite:!1,blending:z.CustomBlending,blendEquation:z.AddEquation,blendSrc:z.OneFactor,blendDst:z.OneMinusSrcAlphaFactor,blendSrcAlpha:z.OneFactor,blendDstAlpha:z.OneMinusSrcAlphaFactor},w0=it.uDrift.value;{const t=ht.cloud,s=[],r=(p,c,e,o,a,d,h,b=0,P=.5)=>{ot(p,c,S);const x=.5*o*Math.hypot(1,P)+1,y=t();for(let k=-.5;k<=.501;k+=.125)if(st(S[0]+w0.x*d*k,e+b*(k+.5),S[1]+w0.y*d*k).d<8+x)return;s.push([S[0],e,S[1],o,a,d,y,h,b,P])},n=J==="veil"?.7:1,m=J==="rags"?12:9;for(let p=0;p<m;p++){const c=470+170*(p+t.range(.1,.9))/m,e=mt(c),o=t.range(e.left+40,e.right-40),a=t.range(-.5,.5),d=t.range(24,32),h=t.range(.9,1.7),b=t.range(30,60);for(let P=0;P<10;P++){const x=(P-4.5)*9+t.range(-3,3),y=c+x*Math.sin(a)+t.range(-5,5),k=o+x*Math.cos(a),M=t.range(26,44)*(1-.35*Math.abs(P-4.5)/4.5);ot(y,k,S),r(y,k,Math.max(Z(S[0],S[1])+d,44)+t.range(-2,2),M,h,b,.72*n*t.range(.7,1),0,t.range(.34,.46))}await g.yield()}for(let p=0;p<40;p++){const c=t.range(30,60),e=t.range(476,620),o=mt(e),a=t.range(o.left+30,o.right-30),d=t.range(8,15);ot(e,a,S),r(e,a,Math.max(Z(S[0],S[1])+28,46)+t.range(0,5),d,t.range(1.6,2.8),c,.3*n*t.range(.6,1),t.range(4,9),t.range(.7,1.2))}await g.yield();for(let p=0;p<70;p++){const c=t.range(424,486),e=mt(c),o=t.range(e.left+14,e.right-12),a=t.range(12,24);ot(c,o,S),r(c,o,Z(S[0],S[1])+t.range(3,7)+.3*a*.45,a,-t.range(.7,1.4),t.range(24,40),.42*n*t.range(.6,1),t.range(2,5),.45),p%35===34&&await g.yield()}for(let p=0;p<40;p++){const c=t.range(120,400),e=c>gt.a0&&c<gt.a1,o=e?gt.l+t.range(-gt.half,gt.half):$e(c)+t.range(-8,8),a=t.range(8,14);ot(c,o,S),r(c,o,(e?Z(S[0],S[1]):ve(c))+1.2,a,t.range(.5,1.1),t.range(20,40),.14*t.range(.5,1),0,.2)}{Kt(vt.x,vt.z,ft);const p=ft.a,c=ft.l;for(let e=0;e<12;e++)r(p+t.range(-5,5),c+t.range(-9,1),vt.y+t.range(.8,4),t.range(6,11),t.range(.5,1),t.range(5,9),.5*t.range(.6,1),t.range(3,8),.8);for(let e=0;e<7;e++)r(p+t.range(-2,2),c+t.range(-2,-.3),vt.y+t.range(6,34),t.range(4.5,7.5),t.range(.4,.8),t.range(2,4),.3*t.range(.6,1),-t.range(4,8),1.9)}for(let p=0;p<30;p++){const c=t.range(338,444),e=$e(c)+t.range(-.6,.6)*l0(c);ve(c+1.5)-ve(c-1.5)<.5||r(c,e,ve(c)+t.range(.8,2.2),t.range(4.5,8),t.range(.5,1),t.range(4,8),.3*t.range(.6,1),t.range(1.5,4),.7)}for(let p=0;p<16;p++){const c=t.range(456,492),e=mt(c),o=t.range(e.left+20,Math.min(e.right-16,40)),a=t.range(22,34);ot(c,o,S),r(c,o,Z(S[0],S[1])+t.range(7,13),a,-t.range(.5,1),t.range(16,28),.46*n*t.range(.7,1),t.range(1,3),.5)}{Kt(K.fx,K.fz,ft);const p=ft.a,c=ft.l;for(let d=0;d<22;d++)r(p+t.range(-6,6),c+t.range(-2,7),K.y+t.range(1,6),t.range(7,13),t.range(.8,1.6),t.range(7,13),.5*t.range(.6,1),t.range(6,14),.9);for(let d=0;d<12;d++){const h=nt.rows[Math.floor(t.range(.15,.95)*nt.rows.length)];Kt(h[0],h[2],ft),r(ft.a+t.range(-8,8),ft.l+t.range(.5,3),h[1],t.range(8,13),t.range(.4,.8),t.range(3,6),.26*t.range(.6,1),-t.range(5,10),1.7)}const e=Y.fall;Kt(e.x,e.z,ft);const o=ft.a,a=ft.l;for(let d=0;d<9;d++)r(o+t.range(-2.5,2.5),a+t.range(-1,3),e.y+t.range(.5,3),t.range(4,7),t.range(.6,1.2),t.range(4,8),.45*t.range(.6,1),t.range(3,8),.9);for(let d=0;d<6;d++)r(o+t.range(-2,2),a+t.range(.3,1.5),e.y+t.range(6,28),t.range(4,6.5),t.range(.4,.8),t.range(2,4),.24*t.range(.6,1),-t.range(4,8),1.8)}const f=s.length,l=new Float32Array(f*4),v=new Float32Array(f*4),w=new Float32Array(f*2);for(let p=0;p<f;p++)l.set(s[p].slice(0,4),p*4),v.set(s[p].slice(4,8),p*4),w.set(s[p].slice(8,10),p*2);const i=new z.InstancedBufferGeometry;i.setAttribute("position",new z.BufferAttribute(new Float32Array([-.5,-.5,0,.5,-.5,0,-.5,.5,0,.5,.5,0]),3)),i.setIndex([0,1,2,2,1,3]),i.setAttribute("iP",new z.InstancedBufferAttribute(l,4)),i.setAttribute("iQ",new z.InstancedBufferAttribute(v,4)),i.setAttribute("iR",new z.InstancedBufferAttribute(w,2)),i.instanceCount=f;const u=new z.Mesh(i,new z.ShaderMaterial({vertexShader:oo,fragmentShader:so,...Ra,uniforms:Xt()}));u.frustumCulled=!1,u.name="wisps",u.renderOrder=4,H.add(u)}await g.yield();{const s=ut.r+14,r=new Float32Array(360),n=new Float32Array(240),m=[];for(let v=0;v<30;v++){const w=O(-1,1,v/29);for(let i=0;i<4;i++){const u=v*4+i;r[u*3+1]=i>>1,n[u*2]=(i&1)*2-1,n[u*2+1]=w}m.push(v*4,v*4+1,v*4+2,v*4+2,v*4+1,v*4+3)}const f=new z.BufferGeometry;f.setAttribute("position",new z.BufferAttribute(r,3)),f.setAttribute("aS",new z.BufferAttribute(n,2)),f.setIndex(m);const l=new z.Mesh(f,new z.ShaderMaterial({vertexShader:eo,fragmentShader:ao,side:z.DoubleSide,transparent:!0,depthWrite:!1,blending:z.AdditiveBlending,uniforms:Xt({uLen:{value:236},uHalf:{value:s},uShaftCol:{value:new z.Color(1,.93,.74)},uGap:{value:2*s/29*.0013}})}));l.frustumCulled=!1,l.name="shaft",l.renderOrder=5,H.add(l)}await g.yield();const ke=ot(kt.a,kt.l),Le=[],L0=nt.rows[Math.floor(nt.rows.length*.5)],We=(t,s,r,n,m,f)=>{Dt.posAtDist(t,Ct);const l=s-Ct.x,v=r-Ct.y,w=n-Ct.z;Le.push([Ct.x,Ct.y,Ct.z,l,v,w,1/(l*l+v*v+w*w),m,f,Math.min(Ct.x,s),Math.min(Ct.y,r),Math.min(Ct.z,n),Math.max(Ct.x,s),Math.max(Ct.y,r),Math.max(Ct.z,n)])};for(let t=470;t<590;t+=12)We(t,L0[0],L0[1],L0[2],9,0),t<556&&We(t,K.x,K.y,K.z,14,0);for(let t=596;t<E-10;t+=10)We(t,ke[0],kt.y,ke[1],8.5,0),We(t,ke[0],kt.y+34,ke[1],26,1);{const t=Y.fall;for(let s=620;s<E-30;s+=12)We(s,t.x,t.y+8,t.z,8,0),We(s,t.x,t.y+23,t.z,8,0)}const Jt=[0,0,0];for(const t of Le)Jt[0]+=(t[0]+.5*t[3])/Le.length,Jt[1]+=(t[1]+.5*t[4])/Le.length,Jt[2]+=(t[2]+.5*t[5])/Le.length;let T0=0;for(const t of Le)T0=Math.max(T0,Math.hypot(t[0]-Jt[0],t[1]-Jt[1],t[2]-Jt[2]),Math.hypot(t[0]+t[3]-Jt[0],t[1]+t[4]-Jt[1],t[2]+t[5]-Jt[2])+t[7]);const Ft=(t,s,r,n=!1)=>{const m=t-Jt[0],f=s-Jt[1],l=r-Jt[2],v=T0+60;if(m*m+f*f+l*l>v*v)return 60;let w=30;for(const i of Le){if(n&&i[8])continue;const u=t<i[9]?i[9]-t:t>i[12]?t-i[12]:0,p=s<i[10]?i[10]-s:s>i[13]?s-i[13]:0,c=r<i[11]?i[11]-r:r>i[14]?r-i[14]:0,e=w+i[7];if(u*u+p*p+c*c>=e*e)continue;const o=t-i[0],a=s-i[1],d=r-i[2],h=At((o*i[3]+a*i[4]+d*i[5])*i[6],0,1),b=o-i[3]*h,P=a-i[4]*h,x=d-i[5]*h,y=Math.sqrt(b*b+P*P+x*x)-i[7]*h;y<w&&(w=y)}return w},$=new Ht,y0=[];function ze(t,s,r,n=3){const m=t.attributes.position,f=m.count;for(let l=0;l<f;l+=n)if($.fromBufferAttribute(m,l).applyMatrix4(s),st($.x,$.y,$.z).d<r)return!1;return!0}const Te=t=>(g0.set(t[7]||0,t[6]||0,t[8]||0,"YXZ"),v0.setFromEuler(g0),be.compose(ea.set(t[0],t[1],t[2]),v0,ta.set(t[3],t[4],t[5])));{const t=(e,o)=>{const a=[],d=[],h=[],b=[],P=F=>.5+.5*Math.sin(e*12.9898+F*78.233),x=.16*Math.sin(e*2.7),y=.12*Math.cos(e*1.9),k=Math.hypot(x,1,y),M=(F,G,T,D,R)=>{const B=a.length/3;for(const at of F)a.push(at[0],at[1],at[2]),d.push(G,T,D),h.push(.55+.45*C(0,.7,at[1]),R,.75,-1);const Q=F[1][0]-F[0][0],U=F[1][1]-F[0][1],I=F[1][2]-F[0][2],V=F[3][0]-F[0][0],_=F[3][1]-F[0][1],rt=F[3][2]-F[0][2];(U*rt-I*_)*G+(I*V-Q*rt)*T+(Q*_-U*V)*D>0?b.push(B,B+1,B+2,B,B+2,B+3):b.push(B,B+2,B+1,B,B+3,B+2)};let A=0;for(let F=0;F<o;F++){const G=F===o-1?1:A+(1-A)*(.34+.3*P(F*7+1)),T=F?.26:.08,D=-.5+T*P(F*7+2),R=.5-T*P(F*7+3),B=-.5+T*P(F*7+4),Q=.5-T*P(F*7+5),U=[[D,B],[R,B],[R,Q],[D,Q]],I=(V,_)=>_+(_>0?x*V[0]+y*V[1]:0);for(let V=0;V<4;V++){const _=U[V],rt=U[(V+1)%4],ct=rt[0]-_[0],at=rt[1]-_[1],Mt=Math.hypot(ct,at)||1;M([[_[0],I(_,A),_[1]],[rt[0],I(rt,A),rt[1]],[rt[0],I(rt,G),rt[1]],[_[0],I(_,G),_[1]]],at/Mt,0,-ct/Mt,.03)}M([[U[0][0],I(U[0],G),U[0][1]],[U[1][0],I(U[1],G),U[1][1]],[U[2][0],I(U[2],G),U[2][1]],[U[3][0],I(U[3],G),U[3][1]]],-x/k,1/k,-y/k,.9),A=G}const N=new z.BufferGeometry,L=a.length/3;return N.setAttribute("position",new z.BufferAttribute(new Float32Array(a),3)),N.setAttribute("normal",new z.BufferAttribute(new Float32Array(d),3)),N.setAttribute("aA",new z.BufferAttribute(new Float32Array(h),4)),N.setAttribute("aC",new z.BufferAttribute(new Float32Array(L*3).fill(1),3)),N.setIndex(b),N.computeBoundingSphere(),N},s=[t(.3,2),t(1.7,2),t(3.1,3),t(4.4,3),t(5.3,4),t(6.9,4)],r=s.map(()=>[]),n=ht.blocks,m=(e,o)=>{const a=new z.IcosahedronGeometry(1,o),d=a.attributes.position,h=d.count,b=new Float32Array(h*3),P=new Float32Array(h*4),x=new Float32Array(h*3).fill(1);for(let y=0;y<h;y++){$.fromBufferAttribute(d,y).normalize();const k=1+.3*W.n3($.x*1.3+e*7,$.y*1.3,$.z*1.3-e*3)+.12*W.n3($.x*3.1-e,$.y*3.1+e*5,$.z*3.1);d.setXYZ(y,$.x*k,($.y>0?.8:.5)*$.y*k,$.z*k);const M=$.y*1.3,A=Math.hypot($.x,M,$.z)||1;b.set([$.x/A,M/A,$.z/A],y*3),P.set([.55+.45*C(-.4,.5,$.y),.9*C(-.2,.5,$.y),.9,-1],y*4)}return a.setAttribute("normal",new z.BufferAttribute(b,3)),a.setAttribute("aA",new z.BufferAttribute(P,4)),a.setAttribute("aC",new z.BufferAttribute(x,3)),a.deleteAttribute("uv"),a.computeBoundingSphere(),a},f=[m(.7,1),m(2.3,1),m(4.1,2),m(5.5,0)],l=[[],[],[],[]],v=(e,o,a,d,h,b=!0,P=null)=>{const x=a<1.15?3:n.int(0,1),y=a*n.range(.8,1.25),k=a*n.range(.6,.95),M=a*n.range(.8,1.25),A=[e,(P===null?Z(e,o):P)-k*h,o,y,k,M,n()*tt,n.range(-.15,.15),n.range(-.15,.15)];return Ft(e,A[1]+k,o,!0)<.9*Math.max(y,M)||st(e,A[1]+.3*k,o).d<d+1.5*Math.max(y,k,M)&&!ze(f[x],Te(A),d,1)?!1:(l[x].push(A),b&&a>.9&&y0.push([e,A[1]+k*.72,o,Math.min(y,M)]),!0)},w=(e,o,a,d,h,b=6.5)=>{ot(e,o,S);{const N=_t(S[0],S[1]),L=N.s>=425&&N.s<548&&N.dh<36;if(N.s>=548&&N.dh<60||L){(h||L)&&!Yt(S[0],S[1],.6*a)&&v(S[0],S[1],a*(h?.48:.9),b,h?n.range(.05,.3):n.range(.3,.5));return}}const P=h*2+n.int(0,1),x=h===0?.42:1,y=a*n.range(.8,1.5)/x,k=a*n.range(.55,1)*x,M=a*n.range(.8,1.4)/x,A=[S[0],Z(S[0],S[1])-k*d,S[1],y,k,M,n()*tt,n.range(-.12,.12),n.range(-.12,.12)];Yt(A[0],A[2],.8*Math.max(y,M))||Ft(A[0],A[1]+k,A[2],!0)<.75*Math.max(y,M)||st(A[0],A[1]+.5*k,A[2]).d<b+1.35*Math.max(y,k,M)&&!ze(s[P],Te(A),b,1)||(r[P].push(A),a>1.2&&y0.push([A[0],A[1]+k*.97,A[2],Math.min(y,M)]))};{const e=nt.rows[0],o=Math.atan2(nt.face[0],nt.face[1]),a=-nt.face[1],d=nt.face[0];for(const[b,P,x,y,k,M]of[[0,9.2,4.3,13,5.2,8.5],[-11,7.8,5.2,8,4.6,7],[10,8.4,5.6,9,5,7.5],[3,14,1.5,12,6,7]])l[2].push([e[0]-nt.face[0]*P+a*b,e[1]-x,e[2]-nt.face[1]*P+d*b,y,k,M,o,0,0]);const h=Y.fall;l[2].push([h.rows[0][0]-h.in[0]*3.4,h.top-2.3,h.rows[0][2]-h.in[1]*3.4,4.2,3,3.2,Math.atan2(h.in[0],h.in[1]),0,0])}for(let e=0;e<30;e++){const o=tt*(e+n.range(-.3,.3))/30,a=Q0(K.x+Math.cos(o),K.z+Math.sin(o))*n.range(.99,1.1);v(K.x+Math.cos(o)*a,K.z+Math.sin(o)*a,n.range(.8,2.3),5.4,n.range(.15,.4),!1)}await g.yield();for(let e=0;e<40;e++){const o=n.range(Y.dams[0]+4,Y.sTop+10),a=n.range(-.85,.85),d=n.range(.9,2),h=lt(Math.min(o,E-.5),je(o)+a*Je(o,a));N0(h[0],h[2],_t(h[0],h[2])),xt.on&&xt.dE<-1&&v(h[0],h[2],d,5.4,.2,!0,C0(xt.se)+.1),e%20===19&&await g.yield()}for(let e=0;e<60;e++){const o=n.range(456,520),a=mt(o),d=n.range(3,9);w(o,n.range(a.left+3,a.right-3),d,n.range(.2,.45),1,9),e%30===29&&await g.yield()}await g.yield();for(let e=0;e<205;e++){const o=n.range(470,770),a=mt(o),d=n.range(2.5,9);w(o,n.range(a.left+3,a.right-3),d,n.range(.2,.45),1),e%60===59&&await g.yield()}await g.yield();for(let e=0;e<300;e++){const o=n.range(478,E),a=n.sign()*n.range(6.5,26),d=lt(o,a);Kt(d[0],d[2],ft),w(ft.a,ft.l,n.range(1.4,5.5),n.range(.2,.45),Math.abs(a)<15?2:1),e%50===49&&await g.yield()}await g.yield();for(let e=0;e<240;e++){const o=n.range(478,E-11),a=n.range(-9,9),d=lt(o,a);Kt(d[0],d[2],ft),w(ft.a,ft.l,n.range(.5,1.5),n.range(.45,.62),0,5.4),e%50===49&&await g.yield()}for(let e=0;e<s.length;e++)Me(s[e],u0,r[e],e<2?"stones":"blocks");for(let e=0;e<f.length;e++)Me(f[e],u0,l[e],"boulders");await g.yield();const i=ge(5,4,(e,o,a)=>{const d=tt*e/4,h=o/3,b=(1-h)*(1-.3*h);a.p[0]=Math.cos(d)*.34*b+.12*Math.sin(h*5),a.p[1]=h,a.p[2]=Math.sin(d)*.09*b,a.a[0]=.6+.4*h,a.a[1]=.55,a.a[2]=.9,a.c[0]=.55,a.c[1]=.58,a.c[2]=.6}),u=ht.karst,p=[],c=ot(ut.a,ut.l);for(let e=0;e<1200&&p.length<120;e++){const o=u.range(458,590),a=mt(o),d=u.range(a.left+5,Math.min(a.right-5,90)),h=u(),b=u(),P=u(),x=u(),y=u(),k=u();ot(o,d,S),e%300===299&&await g.yield();const M=O(1.2,4.5,h)*(.7+.6*b),A=Z(S[0],S[1])-.2;if(A>52||Yt(S[0],S[1],2))continue;const N=-Math.atan2(c[1]-S[1],c[0]-S[0])+Math.PI/2+(y-.5)*.5;st(S[0],A+M,S[1]).d<8||p.push([S[0],A,S[1],M*O(.8,1.6,P),M,M*O(.8,1.4,x),N,O(.3,.62,k),0])}Me(i,u0,p,"phytokarst")}await g.yield();const sa=new z.DirectionalLight(new z.Color().setRGB(1,.9,.66),3.6);sa.position.copy(zt).multiplyScalar(200),H.add(sa);const La=new z.HemisphereLight(new z.Color().setRGB(.62,.78,.62),new z.Color().setRGB(.16,.24,.1),3.6);H.add(La);const na=Tt.makeWind({direction:[w0.x,w0.y],strength:.9,speed:1,gustiness:.7}),D0={wind:na,backlight:1,backlightTint:"#d8ff7a",ambient:1.5,leafAmbient:1.5,sheen:.55,detail:.3};await Tt.prepareLeafTexture(D0,g.yield);const ra=(t,s)=>{const r=Tt.windMaterial(s?{...D0,map:s}:D0),n=r.onBeforeCompile,m=Xt({uUnder:{value:t}});return r.onBeforeCompile=f=>{n(f),Object.assign(f.uniforms,m),f.fragmentShader=f.fragmentShader.replace("#include <common>",`#include <common>
uniform float uUnder;
`+Qt).replace("vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;",`
            float cvS = shaftAt(vFloraWorld) * mix(1.0, fleckAt(vFloraWorld), uUnder), cvD = dayAt(vFloraWorld);
            // (the day comes from the skylight: what faces it is lit, what is turned from it lies in cool shade; and the pillar's
            // foot gives its warm light back from its own side)
            vec3 cvL = vec3(uSkyC.x, uSkyC.y - 30.0, uSkyC.z) - vFloraWorld; cvL = normalize((viewMatrix * vec4(cvL, 0.0)).xyz);
            float cvW = 0.5 + 0.5 * dot(normalize(normal), cvL);
            cvD *= 0.8 + 0.44 * smoothstep(0.22, 0.78, vn2((vFloraWorld.xz - uDrift * (uTime * 7.0)) * 0.05));     // (the gust that runs over the roof, on these leaves too)
            vec3 cvG = uGlowP.xyz - vFloraWorld; float cvR = max(length(cvG), 1e-3);
            float cvGn = 0.3 + 0.7 * max(dot(normalize(normal), normalize((viewMatrix * vec4(cvG, 0.0)).xyz)), 0.0);
            vec3 cvQ = uLampP[NL - 1].xyz - vFloraWorld; float cvQ2 = dot(cvQ, cvQ), cvQr = uLampP[NL - 1].w, cvQf = 0.0;      // (and the ring's own glow)
            if (cvQ2 < cvQr * cvQr) cvQf = (1.0 - smoothstep(cvQr * 0.5, cvQr, sqrt(cvQ2))) / (1.0 + cvQ2 * 0.06) * (0.35 + 0.65 * max(dot(normalize(normal), normalize((viewMatrix * vec4(cvQ, 0.0)).xyz)), 0.0));
            vec3 outgoingLight = reflectedLight.directDiffuse * cvS + reflectedLight.indirectDiffuse * (cvD * (0.3 + 1.25 * cvW * cvW) * (1.0 - 0.2 * uUnder))
              + diffuseColor.rgb * (uSunCol * (uGlowP.w * 2.2 * cvGn / (1.0 + cvR * cvR / 14400.0)) + uLampC[NL - 1] * cvQf)
              + diffuseColor.rgb * uBounce * (1.0 - smoothstep(0.0, 120.0, upPassage(vFloraWorld))) + totalEmissiveRadiance;`).replace("#include <fog_fragment>","gl_FragColor.rgb = forestAir(gl_FragColor.rgb, vFloraWorld);")},r.customProgramCacheKey=()=>"cloud-in-the-cave-leaf",r},ee=ra(0,null),De=ra(.9,ee.map),Ta=new z.Color,bt=(t,s,r,n)=>{const m=Me(t,s,r,n);for(let f=0;f<r.length;f++){const l=r[f];m.setColorAt(f,Ta.setRGB(l[9]??1,l[10]??1,l[11]??1))}return m.instanceColor&&(m.instanceColor.needsUpdate=!0),m};await g.yield();let Da=null;const s0=(t,s,r,n)=>{const m=new z.IcosahedronGeometry(1,n),f=m.attributes.position,l=f.count,v=new Float32Array(l*3),w=new Float32Array(l);for(let i=0;i<l;i++){$.fromBufferAttribute(f,i).normalize();const u=1+.27*W.n3($.x*1.7+t*5,$.y*1.7,$.z*1.7-t*3)+.11*W.n3($.x*3.9-t,$.y*3.9+t*7,$.z*3.9),p=$.x*$.x+$.z*$.z,c=$.y>0?$.y:$.y*.45;f.setXYZ(i,$.x*u,c*u*s-r*p,$.z*u);const e=($.y>0?$.y:$.y*2.2)/s,o=Math.hypot($.x,e,$.z)||1;v.set([$.x/o,e/o,$.z/o],i*3),w[i]=$.y}return m.setAttribute("normal",new z.BufferAttribute(v,3)),m.setAttribute("aH",new z.BufferAttribute(w,1)),m.deleteAttribute("uv"),m.computeBoundingSphere(),m},B0=(t,s)=>ge(s+1,5,(r,n,m)=>{const f=tt*r/s,l=[0,.045,.14,.5,1][n],v=(1-.42*l)*(1+t*Math.exp(-l*20)*(.5+.5*Math.cos(f*3+.8)))*(1+.06*Math.sin(f*2+l*9));m.p[0]=Math.cos(f)*v,m.p[1]=l,m.p[2]=Math.sin(f)*v,m.a[0]=r/s,m.a[1]=l}),Be=(t,s,r,n)=>ge(s+1,t.length,(m,f,l)=>{const v=t[f],w=t[Math.max(0,f-1)],i=t[Math.min(t.length-1,f+1)];let u=i[0]-w[0],p=i[1]-w[1],c=i[2]-w[2];const e=Math.hypot(u,p,c)||1;u/=e,p/=e,c/=e;let o=p*.92-c*.11,a=c*.37-u*.92,d=u*.11-p*.37;const h=Math.hypot(o,a,d)||1;o/=h,a/=h,d/=h;const b=p*d-c*a,P=c*o-u*d,x=u*a-p*o,y=tt*m/s,k=Math.cos(y)*v[3],M=Math.sin(y)*v[3];l.p[0]=v[0]+o*k+b*M,l.p[1]=v[1]+a*k+P*M,l.p[2]=v[2]+d*k+x*M,l.a[0]=m/s,l.a[1]=O(r,n,f/(t.length-1))}),ia=ht.bloom.chance(.5)?"#ff86b4":"#ff7350",G0=Ve(ia),q0=(t,s,r,n)=>new z.ShaderMaterial({vertexShader:io,fragmentShader:lo,uniforms:Xt({uUnder:{value:t},uLeafA:{value:new z.Color(s)},uLeafB:{value:new z.Color(r)},uBloom:{value:new z.Vector4(G0.r,G0.g,G0.b,n)}})}),la=t=>new z.ShaderMaterial({vertexShader:ho,fragmentShader:co,side:z.DoubleSide,uniforms:Xt({uUnder:{value:t}})}),E0=la(.8),ha=la(.35),I0={leaf:"#3a7a2c",leafLight:"#9ccb4a",leafDark:"#1c4a22",bark:"#4b4839",barkDark:"#2a2822"},Ba={leaf:"#4c8a30",leafLight:"#b0d65a",leafDark:"#255226",bark:"#5c5747",barkDark:"#34312a"},re=[],n0=[];Dt.tangentAtDist(E-.5,se);const ca=Math.hypot(se.x,se.z)||1,Ae=se.x/ca,Pe=se.z/ca;await g.yield();{const t=Gt==="red",s=ht.spare1,r=t?{leaf:"#b8401c",leafLight:"#ff9a3d",leafDark:"#5e1c10",bark:"#c4bca6",barkDark:"#746c5c"}:{...I0,bark:"#c4bca6",barkDark:"#746c5c"},n=(f,l)=>{const v=[],w=l.lean*l.h;v.push(Be([[0,-1.5,0,l.R*.62],[w*.5,l.h*.5,0,l.R*.52],[w,l.h+.5,0,l.R*.5]],7,0,.5));for(let u=0;u<l.roots;u++){const p=tt*(u+f.range(-.25,.25))/l.roots,c=f.range(-.9,.9),e=f.range(2,3.8)*l.R/1.6,o=f.range(.3,.5)*l.R/1.6,a=[];for(let d=0;d<=9;d++){const h=d/9,b=-1.6+2*C(0,.14,h)+(l.h-.4)*Math.pow(h,1.4),P=p+c*h+.35*Math.sin(h*7+u),x=l.R*(1-.42*h)+e*Math.pow(1-h,4);a.push([Math.cos(P)*x+l.lean*Math.max(b,0),b,Math.sin(P)*x,o*(1+1*Math.pow(1-h,3))*(.82+.18*Math.sin(h*11+u*2))])}v.push(Be(a,6,0,.5))}const i=[];for(let u=0;u<l.boughs;u++){const p=l.fan[0]+(l.fan[1]-l.fan[0])*(u+f.range(.2,.8))/l.boughs,c=f.range(6.5,10)*l.reach,e=f.range(5,8.5)*l.reach,o=[],a=d=>[w+Math.cos(p)*c*d+.5*Math.sin(d*5+u),l.h-.8+e*(1-(1-d)*(1-d)),Math.sin(p)*c*d+.5*Math.cos(d*4+u)];for(let d=0;d<=6;d++){const h=d/6,b=a(h);b.push(O(.6,.15,h)*l.R/1.6),o.push(b)}v.push(Be(o,6,.5,1)),i.push(a)}if(l.arch>0){const u=l.arch*1.74,p=l.archTop-l.h,c=[],e=o=>{const a=2*o/1.15-1;return[w+u*o,l.h+p*(1-a*a)-.6*(1-o),.6*Math.sin(o*6)]};for(let o=0;o<=10;o++){const a=o/10,d=e(a);d.push(O(.62,.17,Math.pow(a,.8))),c.push(d)}v.push(Be(c,6,.5,1)),i.push(e)}for(let u=0;u<l.props;u++){const p=i[u%l.boughs](f.range(.35,.92)),c=f.range(.13,.28),e=[];for(let o=0;o<=5;o++){const a=o/5;e.push([p[0]+.25*Math.sin(a*5+u*1.3)*Math.min(1,a*4),O(p[1],-2.5,a),p[2]+.25*Math.cos(a*4+u)*Math.min(1,a*4)-.25*Math.min(1,a*4),c*(1+.8*a*a*a)])}v.push(Be(e,5,.3,.6))}return h0(v)},m=[{side:-1,h:11.5,R:3,roots:8,boughs:4,fan:[1.2,5.1],reach:1,lean:0,arch:1,archTop:22.5,props:4,leafH:23,leafUp:4.5,full:1.35},{side:1,h:9.5,R:2.1,roots:6,boughs:3,fan:[1.7,4.6],reach:.8,lean:.14,arch:0,archTop:0,props:9,leafH:19,leafUp:3.5,full:1.1}];for(const f of m){const l=Tt.oakGeometry({rng:s.fork("fig"+f.side),height:f.leafH,detail:2,flex:.35,fullness:f.full,...r});let v=!1;for(let w=12,i=0;w<22&&i<6&&!v;w+=1.5,i++){const u=n(s.fork("wood"+f.side+i),{...f,arch:f.arch*w}),p=lt(E-.5,f.side*w),c=p[0]+Ae*2.5,e=p[2]+Pe*2.5,o=Z(c,e)-.3,a=Pe*f.side,d=-Ae*f.side,h=Math.atan2(-d,a);be.makeRotationY(h).setPosition(c,o,e);const b=be.clone(),P=Te([c,o+f.leafUp,e,1,1,1,h+1.3,0,0]).clone();if(await g.yield(),ze(u,b,6.5,1)&&ze(l,P,6.5,2)){u.applyMatrix4(b);const x=new z.Mesh(u,ha);x.name="fig",H.add(x),bt(l,ee,[[c,o+f.leafUp,e,1,1,1,h+1.3,0,0,1,1,1]],"fig-leaves"),n0.push([c,o,e,l.userData.radius,f.leafUp+f.leafH]),re.push([c,o+f.leafUp+f.leafH,e,l.userData.radius,f.leafUp+f.leafH]),v=!0}else u.dispose()}v||l.dispose(),await g.yield()}}await g.yield();{const t=ht.trees,s=t.fork("forms"),r=[],n=[[],[],[],[]];r.push(Tt.oakGeometry({rng:s.fork("a0"),height:24,detail:1,flex:.5,fullness:1.15,...I0})),r.push(Tt.oakGeometry({rng:s.fork("a1"),height:24,detail:1,flex:.5,fullness:1.3,...Ba})),r.push(Tt.cherryGeometry({rng:s.fork("fl"),height:15,detail:1,flex:.5,leaf:"#ff6f52",bark:"#b9b29e"})),r.push(Tt.cherryGeometry({rng:s.fork("fp"),height:15,detail:1,flex:.5,leaf:"#ff86b4",bark:"#b9b29e"})),await g.yield();{const f=(u,p,c)=>{const e=u.attributes.position;for(let o=0;o<e.count;o+=c)if($.fromBufferAttribute(e,o).applyMatrix4(p),Ft($.x,$.y,$.z,!0)<.5)return!1;return!0},l=(u,p,c,e)=>{const o=u.attributes.position;for(let a=0;a<o.count;a+=e){$.fromBufferAttribute(o,a).applyMatrix4(p);const d=st($.x,$.y,$.z);if(d.d<c||d.dh<5&&$.y-d.y<12)return!1}return!0};let v=!1,w=0;const i=[[1,46],[1,52],[1,40],[1.2,46],[1.2,52],[1.2,40],[1.4,46],[1.4,52],[1.4,40]];for(const[u,p]of[["hero",i],["hero2",i],["hero3",i],["hero",[[1.7,46],[1.7,52],[2.1,46],[2.1,52]]]]){if(v)break;const c=Tt.oakGeometry({rng:s.fork(u),height:40,detail:2,flex:.4,fullness:1.15,...I0});await g.yield();for(const[e,o]of p)for(const a of[3.2,4.6,2.2])for(const d of[1,-1])for(const h of[626,668,654,612,640,682]){if(v)continue;const b=Math.max(14,Je(h,d)+d*je(h)+a),P=lt(h,d*b),x=P[0],y=P[2],k=Z(x,y)-.6,M=o/40,A=o*e;Dt.posAtDist(h,Ct);const N=Math.atan2(Ct.x-x,Ct.z-y),L=[x,k,y,M,M*e,M,N,0,0,.9,.95,.85],F=Te(L).clone();if(!l(c,F,7.4,23)||!f(c,F,23)||!l(c,F,6.6,7)||(w++%2===0&&await g.yield(),!f(c,F,3)||!l(c,F,6.2,1)))continue;v=!0,bt(c,ee,[L],"great-tree");const G=[Be([[0,-2.5,0,1.75*M],[0,1.5,0,1.5*M],[0,6,0,1.36*M],[0,11,0,1.24*M],[0,17*M,0,1.1*M]],14,0,.5)];G[0].applyMatrix4(be.makeRotationY(N).setPosition(x,k,y));for(let T=0;T<7;T++){const D=-Math.PI/2+tt*(T+.35*Math.sin(T*2.7+1))/7,R=5+3.5*Math.abs(Math.sin(T*1.9+.4)),B=6+4*Math.abs(Math.sin(T*3.1+2)),Q=[];for(let I=0;I<=6;I++){const V=I/6,_=.12+.5*R*Math.pow(1-V,1.7);Q.push([1.25*M+_,O(-2.2,B,V),0,_])}const U=Be(Q,6,0,.5);U.scale(1,1,.13),U.rotateY(D),U.applyMatrix4(be.makeRotationY(N).setPosition(x,k,y)),ze(U,be.identity(),6.2,1)?G.push(U):U.dispose()}{const T=new z.Mesh(h0(G),ha);T.name="great-tree-buttresses",H.add(T)}re.push([x,k+A,y,c.userData.radius*M,A]),H.userData.greatTree={s:h,lat:d*b,H:A,form:u},Da=[x,k,y,A]}v||c.dispose()}}await g.yield();const m=Gt==="flower"?26:22;for(let f=0,l=0;f<1e3&&l<37;f++){const v=t.range(505,E+24),w=t.sign(),i=t.range(11,46),u=t(),p=t()*tt,c=t(),e=t(),o=t(),a=lt(Math.min(v,E-.5),w*i),d=a[0]+(v>E?Ae*(v-E):0),h=a[2]+(v>E?Pe*(v-E):0),b=Z(d,h)-.5;if(f%12===11&&await g.yield(),Kt(d,h,ft),Math.hypot(ft.a-kt.a,ft.l-kt.l)<22||Re(ft.a,ft.l)<.3||_t(d,h).dh<10)continue;let P=!0;for(const N of re)Math.hypot(N[0]-d,N[2]-h)<7+.3*N[3]&&(P=!1);if(!P||Yt(d,h,3))continue;const x=n[2].length+n[3].length,y=o>(v>585?.25:.58)&&x<m?2+x%2:o<.3?0:1,k=r[y];let M=y>1?O(11,16,u):O(19,29,u),A=null;for(let N=0;N<3&&!A;N++,M*=.66){const L=M/k.userData.height,F=[d,b,h,L,L,L,p,0,0,.82+.3*c,.86+.26*e,.8+.25*c],G=k.userData.radius*L;Ft(d,b+.68*M,h)<G+.5||Ft(d,b+.3*M,h)<1.5||Ft(d,b+.1*M,h)<1.5||(st(d,b+.55*M,h).d>7.5+Math.max(G,.55*M)*1.25||ze(k,Te(F),7.5,16)&&ze(k,Te(F),7.5,2))&&(A=F)}A&&(n[y].push(A),l++,re.push([d,b+A[3]*k.userData.height,h,k.userData.radius*A[3],A[3]*k.userData.height]))}bt(r[0],ee,n[0],"trees"),bt(r[1],ee,n[1],"trees"),bt(r[2],ee,n[2],"trees-in-flower"),bt(r[3],ee,n[3],"trees-in-flower")}await g.yield();{const t=ht.roof,s=[[1,1,1],[.7,.88,.8],[1.28,1.14,.68],[.86,1.12,.98]],r=[.7,.95,.45],n=[[],[],[]],m=[[],[],[]],f=[],l=[],v=[],w=[],i=[],u=(h,b,P,x,y,k,M,A,N,L)=>{const F=st(h,P+y,b),G=F.s<505,T=k;G&&L>0&&(k=1);const D=P+y,R=D-r[k]*x*1.15,B=st(h,R,b),Q=B.d,U=B.s>560?40:G&&B.s>425&&D>B.y+3?46:26;if(Q<Math.max(U,1.4*x+7)||Ft(h,R,b)<1.4*x+.5)return!1;for(const at of re){if((at[5]??1)!==L)continue;const Mt=at[0]-h,Vt=at[2]-b,It=(at[5]===void 0?.8:.56)*(at[3]+x);if(Mt*Mt+Vt*Vt<It*It)return!1}for(const at of oa)if(Math.hypot(at[0]-h,at[2]-b)<x+3.5)return!1;for(const at of n0)if(Math.hypot(at[0]-h,at[2]-b)<x+at[3])return!1;const I=s[Math.floor(M*4)%4],V=(.88+.24*A)*(L?1:.8),_=Q<68+1.4*x,rt=[h,R,b,x,x*(.9+.3*A),x,A*tt,0,0,I[0]*V,I[1]*V,I[2]*V];if(L===0)return v.push(rt),re.push([h,D,b,x,y,0]),!0;const ct=(T===2?.7:.3)*(.8+.4*A)*Math.sqrt(y/20);for(let at=.1;at<.95;at+=.2)if(st(h,P+y*at,b).d<7+ct*2||Ft(h,P+y*at,b)<ct*2+.5)return!1;return(N?_?f:l:(_?n:m)[k]).push(rt),Q<130&&(k===2?i:w).push([h,P-1,b,ct,R-P+1+.15*x,ct,A*9,.07*(M-.5),.07*(A-.5),.62+.3*A,.62+.3*A,.6+.3*A]),re.push([h,D,b,x,y,L]),!0},p=[];for(let h=0;h<700&&p.length<26;h++){const b=t.range(470,768),P=mt(b),x=t.range(P.left+12,P.right-12),y=Re(b,x),k=t(),M=t(),A=t(),N=t(),L=t();if(h%100===99&&await g.yield(),k>y||Math.hypot(b-kt.a,x-kt.l)<26)continue;ot(b,x,S);const F=S[0],G=S[1];let T=!Yt(F,G,10);for(const D of p)Math.hypot(D[0]-F,D[1]-G)<24&&(T=!1);T&&u(F,G,Z(F,G),O(7.5,11,M),O(30,38,A),2,N,L,!1,2)&&p.push([F,G])}await g.yield();const c=Gt==="flower"?.24:.15;for(let h=0,b=0;h<7e3&&b<570;h++){const P=t.range(458,772),x=mt(P),y=t.range(x.left+6,x.right-6),k=Re(P,y),M=t(),A=t(),N=t(),L=t(),F=t(),G=t(),T=t();if(h%110===109&&await g.yield(),M>k*1.15||Math.hypot(P-kt.a,y-kt.l)<24)continue;ot(P,y,S);const D=S[0],R=S[1],B=Z(D,R);if(Yt(D,R,9))continue;const Q=O(5,10.5,A*A),U=14.5+4.5*W.n2(D*.035,R*.035)+4*N+.6*Q;u(D,R,B,Q,U,G<.62?0:1,L,F,T<c,1)&&b++}await g.yield();for(let h=0,b=0;h<4e3&&b<105;h++){const P=t.range(458,772),x=mt(P),y=t.range(x.left+5,x.right-5),k=Re(P,y),M=t(),A=t(),N=t(),L=t(),F=t();if(h%130===129&&await g.yield(),M>k||Math.hypot(P-kt.a,y-kt.l)<22)continue;ot(P,y,S);const G=S[0],T=S[1],D=Z(G,T);!Yt(G,T,8)&&u(G,T,D,O(3.4,6,A),O(6,10.5,N),1,L,F,!1,0)&&b++}await g.yield();{const h=ht.rim,b=ot(ut.a,ut.l);for(let P=0;P<22;P++){const x=h()*tt,y=h.range(3.5,13),k=ut.r*(1+.07*Math.sin(x*3+1)+.05*Math.sin(x*7+4)),M=h.range(3.5,6.5),A=h(),N=h();let L=.3;for(;L<1&&3.5-3.6*Math.sin(Math.min(L*2.2,1)*Math.PI)+16*L*L<y;)L+=.02;const F=s[Math.floor(A*4)%4];m[P%2].push([b[0]+Math.cos(x)*(k+y),159.5+46*L+M*.5,b[1]+Math.sin(x)*(k+y),M,M*1.1,M,N*tt,0,0,F[0],F[1],F[2]])}}const e=[.4,1.9,3.3],o=[.03,0,.1],a=q0(0,"#235c26","#5c9a36",0),d=q0(0,"#2a6428","#5c9a36",.8);v.length&&bt(s0(7.7,.95,0,1),q0(.85,"#1f5424","#4c8a30",0),v,"thickets");for(let h=0;h<3;h++)n[h].length&&bt(s0(e[h],r[h],o[h],2),a,n[h],h===2?"emergents":"canopy"),m[h].length&&bt(s0(e[h],r[h],o[h],1),a,m[h],h===2?"emergents":"canopy"),await g.yield();f.length&&bt(s0(5.1,.7,.03,2),d,f,"canopy-in-flower"),l.length&&bt(s0(5.1,.7,.03,1),d,l,"canopy-in-flower"),w.length&&bt(B0(.5,7),E0,w,"boles"),i.length&&bt(B0(1.5,9),E0,i,"boles")}await g.yield();const Ge=Tt.fernGeometry({rng:ht.under.fork("forms").fork("b1"),size:1,fronds:6,detail:1,leaf:"#3f9a34",leafLight:"#b4dc5c",leafDark:"#1e5a26"}),ie=Tt.fernGeometry({rng:ht.under.fork("forms").fork("f1"),size:1,fronds:9,detail:0,leaf:"#3c8a3a",leafLight:"#9ccb4a",leafDark:"#1c4a22"});{const t=ht.under.fork("kinds"),s=ht.under,r=[{geo:Tt.palmGeometry({rng:t.fork("p1"),height:6,detail:0,fronds:9,curve:.5,coconuts:!1,leaf:"#4f8a2c",leafLight:"#a4cf52",bark:"#8f8468"}),h:[3,8.5],n:36,tall:!0,name:"palms"},{geo:Tt.palmGeometry({rng:t.fork("p2"),height:5.5,detail:0,fronds:12,curve:.15,coconuts:!1,leaf:"#2f7a34",leafLight:"#7fc04a",bark:"#4a3c2c"}),h:[4,7.5],n:28,tall:!0,name:"palms"},{geo:Tt.palmGeometry({rng:t.fork("p3"),height:15,detail:0,fronds:12,curve:.3,coconuts:!1,leaf:"#3f8a30",leafLight:"#9ccf52",bark:"#9a917a"}),h:[15,23],n:22,tall:!0,far:!0,name:"palms"},{geo:Ge,h:[2.4,4.2],n:90,name:"ferns"},{geo:ie,h:[.8,1.7],n:170,name:"ferns"},{geo:Tt.bushGeometry({rng:t.fork("s1"),size:1.6,detail:0,flowers:.75,flowerColor:ia,leaf:"#2f6b2e",leafLight:"#86b844",leafDark:"#183c1e"}),h:[1.4,3],n:34,name:"bushes-in-flower"}];await g.yield();for(const y of r){const k=[],M=y.geo.userData.height||1,A=y.geo.userData.radius||1;for(let N=0;N<y.n*12&&k.length<y.n;N++){const L=s.range(456,774),F=mt(L),G=s.range(F.left+3,F.right-3),T=Re(L,G),D=s(),R=s(),B=s()*tt,Q=s(),U=s();ot(L,G,S);const I=S[0],V=S[1],_=_t(I,V),rt=y.far?1-.6*C(60,160,_.dh):1-.93*C(26,80,_.dh);if(N%300===299&&await g.yield(),D>(.25+.75*T)*rt)continue;const ct=O(y.h[0],y.h[1],R),at=ct/M,Mt=Z(I,V)-.15;if(st(I,Mt+ct,V).d<6+A*at||st(I,Mt+.4*ct,V).d<6+.5*A*at||Ft(I,Mt+ct,V)<A*at+.5||Ft(I,Mt+.4*ct,V)<1)continue;let Vt=!0;for(const It of n0)Math.hypot(It[0]-I,It[2]-V)<4&&(Vt=!1);!Vt||Yt(I,V,1.5)||k.push([I,Mt,V,at,at,at,B,y.tall?.1*(U-.5):.3*(U-.5),0,.8+.3*Q,.85+.25*Q,.8+.2*U])}bt(y.geo,y.tall?ee:De,k,y.name),await g.yield()}const n=y=>{const k=[],M=[],A=[],N=[];for(let T=0;T<5;T++){const D=T*2.4+y.range(-.3,.3),R=O(1.25,.5,T/4)+y.range(-.1,.1),B=y.range(.75,1),Q=y.range(.9,1.5),U=.17*B,I=k.length/3;let V=0,_=.16,rt=0;for(let ct=0;ct<=5;ct++){const at=ct/5,Mt=R-Q*at*at,Vt=Math.cos(D),It=Math.sin(D),_e=Math.cos(Mt),i0=Math.sin(Mt);ct>0&&(V+=Vt*_e*B/5,_+=i0*B/5,rt+=It*_e*B/5);for(let Ne=-1;Ne<=1;Ne++){const U0=Math.abs(Ne)*.22*U;k.push(V-It*Ne*U-Vt*i0*U0,_+_e*U0,rt+Vt*Ne*U-It*i0*U0);const fa=-Vt*i0+It*Ne*.22,da=_e,ua=-It*i0-Vt*Ne*.22,O0=Math.hypot(fa,da,ua)||1;M.push(fa/O0,da/O0,ua/O0),A.push(Ne,at,T+.37)}}for(let ct=0;ct<5;ct++)for(let at=0;at<2;at++){const Mt=I+ct*3+at,Vt=Mt+1,It=Mt+3,_e=It+1;N.push(Mt,It,Vt,Vt,It,_e)}}const F=k.length/3;for(let T=0;T<2;T++)for(let D=0;D<5;D++){const R=tt*D/5,B=T?.03:.05;k.push(Math.cos(R)*B,T*.2,Math.sin(R)*B),M.push(Math.cos(R),0,Math.sin(R)),A.push(0,.05,0)}for(let T=0;T<5;T++){const D=F+T,R=F+(T+1)%5;N.push(D,D+5,R,R,D+5,R+5)}const G=new z.BufferGeometry;return G.setAttribute("position",new z.BufferAttribute(new Float32Array(k),3)),G.setAttribute("normal",new z.BufferAttribute(new Float32Array(M),3)),G.setAttribute("aB",new z.BufferAttribute(new Float32Array(A),3)),G.setIndex(N),G.computeBoundingSphere(),G},m=new z.ShaderMaterial({vertexShader:fo,fragmentShader:uo,side:z.DoubleSide,uniforms:Xt({uUnder:{value:.85}})}),f=[[],[]],l=ht.under.fork("banana");for(let y=0;y<1600&&f[0].length+f[1].length<84;y++){const k=l.range(470,772),M=mt(k),A=l.range(M.left+3,M.right-3),N=Re(k,A),L=l(),F=l(),G=l()*tt,T=l(),D=l.int(0,1);ot(k,A,S);const R=S[0],B=S[1],Q=_t(R,B),U=1-.95*C(22,60,Q.dh);if(y%300===299&&await g.yield(),L>(.25+.75*N)*U)continue;const I=O(3.2,6,F),V=Z(R,B)-.1;if(st(R,V+.55*I,B).d<6+.75*I||Ft(R,V+.55*I,B)<.75*I+.5)continue;let _=!Yt(R,B,2);for(const rt of n0)Math.hypot(rt[0]-R,rt[2]-B)<4.5&&(_=!1);_&&f[D].push([R,V,B,I,I,I,G,.12*(T-.5),0,.85+.3*T,.9+.2*T,.85])}for(let y=0;y<2;y++)bt(n(l.fork("form"+y)),m,f[y],"wild-banana");await g.yield();const v=[],w=[],i=ht.under.fork("treeferns"),u=Ge.userData.height||1,p=Ge.userData.radius||1;for(let y=0;y<900&&v.length<40;y++){const k=i.range(470,772),M=mt(k),A=i.range(M.left+3,M.right-3),N=Re(k,A),L=i(),F=i(),G=i()*tt,T=i();ot(k,A,S);const D=S[0],R=S[1],B=_t(D,R),Q=1-.95*C(24,70,B.dh);if(y%300===299&&await g.yield(),L>(.25+.75*N)*Q)continue;const U=O(3,7,F),I=Z(D,R)-.3,V=O(2.6,3.6,T)/u,_=p*V;st(D,I+U+1,R).d<6+_||st(D,I+.5*U,R).d<6.5||Ft(D,I+U+1,R)<_+.5||Ft(D,I+.5*U,R)<1||Yt(D,R,1.5)||(v.push([D,I,R,.2,U+.3,.2,G,.06*(T-.5),0,.42,.34,.27]),w.push([D,I+U,R,V,V,V,G,0,0,.8+.3*T,.9+.2*T,.8]))}bt(B0(.15,6),E0,v,"tree-fern-stems"),bt(Ge,De,w,"tree-ferns"),await g.yield();const c=ht.under.fork("gully"),e=[],o=[];for(let y=0;y<2400&&e.length+o.length<195;y++){const k=c.range(500,E+6),M=c.sign(),A=7.5+16.5*Math.pow(c(),1.6),N=c()<.42,L=c(),F=c()*tt,G=c(),T=c(),D=lt(Math.min(k,E-.5),M*A),R=D[0]+(k>E?Ae*(k-E):0),B=D[2]+(k>E?Pe*(k-E):0),Q=N?Ge:ie,U=N?O(2.6,5.2,L):O(1,2.2,L),I=Q.userData.height||1,V=Q.userData.radius||1,_=U/I,rt=Z(R,B)-.15;y%300===299&&await g.yield(),!(k>E-10&&A<12)&&(st(R,rt+U,B).d<6+V*_||st(R,rt,B).d<6+V*_||Ft(R,rt+.5*U,B)<V*_+.3||Yt(R,B,1.2)||(N?e:o).push([R,rt,B,_,_,_,F,.3*(T-.5),0,.8+.3*G,.88+.22*G,.8+.2*T]))}for(let y=0,k=0;y<900&&k<100;y++){const M=c.range(500,E-12),A=c.range(-7.5,7.5),N=c(),L=c()*tt,F=c(),G=c(),T=lt(M,A),D=T[0],R=T[2],B=O(.6,1.1,N),Q=B/(ie.userData.height||1),U=Z(D,R)-.1;if(y%100===99&&await g.yield(),Yt(D,R,1.2)||st(D,U+B,R).d<5.6+.5*(ie.userData.radius||1)*Q||Ft(D,U+.5*B,R)<.8)continue;const I=[D,U,R,Q,Q,Q,L,.3*(G-.5),0,.8+.3*F,.88+.22*F,.8+.2*G];st(D,U,R).d<5.6+Math.hypot((ie.userData.radius||1)*Q,B)+.2&&!ze(ie,Te(I),5.6,1)||(o.push(I),k++)}await g.yield();{const y=r[5].geo,k=[];for(let M=0,A=0;M<1100&&A<190;M++){const N=c.range(Y.dams[0]-16,Y.sEnd),L=c.sign(),F=.5+14*Math.pow(c(),1.5),G=c(),T=G<.14,D=G<.45,R=c(),B=c()*tt,Q=c(),U=lt(Math.min(N,E-.5),je(N)+L*(Je(N,L)+F)),I=U[0],V=U[2],_=T?y:D?Ge:ie,rt=T?O(1.5,3,R):D?O(2.2,4.4,R):O(1,2.2,R);if(M%100===99&&await g.yield(),T&&k.length>=30||Math.hypot(I-K.x,V-K.z)<K.r*1.14+.5)continue;const ct=rt/(_.userData.height||1),at=(_.userData.radius||1)*ct,Mt=Z(I,V)-.15;st(I,Mt+rt,V).d<6+at||st(I,Mt,V).d<6+at||Ft(I,Mt+.5*rt,V)<at+.3||((T?k:D?e:o).push([I,Mt,V,ct,ct,ct,B,.2*(Q-.5),0,.85+.25*Q,.9+.15*Q,.85]),T||A++)}bt(y,De,k,"bushes-in-flower")}await g.yield();const a=ht.under.fork("orchids"),d=[Tt.flowerGeometry({rng:a.fork("w"),color:"#fbf3ff",cards:3,width:1,height:1}),Tt.flowerGeometry({rng:a.fork("p"),color:"#ffc9e4",cards:3,width:1,height:1})],h=[[],[]];for(let y=0;y<y0.length;y++){const k=y0[y],M=a(),A=a()*tt,N=a()*.25*k[3],L=a(),F=a(),G=k[0]+Math.cos(A)*N,T=k[2]+Math.sin(A)*N;y%200===199&&await g.yield();const D=st(G,k[1]+1.2,T).d;if(!(D>60||D<6.6||Ft(G,k[1]+.6,T)<1.2)){if(M<.5&&o.length<330){const R=O(.7,1.5,L),B=R/(ie.userData.height||1);D>6+(ie.userData.radius||1)*B&&o.push([G,k[1]-.15,T,B,B,B,A,.3*(F-.5),0,.8+.3*F,.9+.2*F,.8])}else if(M>.72&&D<40&&h[0].length+h[1].length<110){const R=O(.5,.95,L);h[F<.6?0:1].push([G,k[1]-.05,T,R,R,R,A,.25*(F-.5),0,1,1,1])}}}bt(Ge,De,e,"ferns"),bt(ie,De,o,"ferns");for(let y=0;y<2;y++)bt(d[y],De,h[y],"orchids");await g.yield();const b=ht.under.fork("drifts"),P=["#e8262a","#ff7350","#fff6e6","#ffd23a"].map((y,k)=>Tt.flowerGeometry({rng:b.fork("f"+k),color:y,cards:2,width:1,height:1})),x=[[],[],[],[]];for(let y=0,k=0;y<600&&k<56;y++){const M=b.range(486,E+5),A=b.sign(),N=b.range(8,22),L=[2,3,2,3,2,3,1,0][Math.min(7,Math.floor(b()*8))],F=14+Math.floor(b()*17),G=b.range(2.4,4.8),T=lt(Math.min(M,E-.5),A*N),D=T[0]+(M>E?Ae*(M-E):0),R=T[2]+(M>E?Pe*(M-E):0);if(y%40===39&&await g.yield(),M>E-10&&N<12)continue;let B=0;for(let Q=0;Q<F;Q++){const U=b()*tt,I=Math.sqrt(b())*G,V=b.range(.5,.95),_=D+Math.cos(U)*I,rt=R+Math.sin(U)*I,ct=Z(_,rt)-.05;st(_,ct+V,rt).d<5.9||Ft(_,ct+.5*V,rt)<.6||Yt(_,rt,1.2)||(x[L].push([_,ct,rt,V,V,V,U,.2*(b()-.5),0,1,1,1]),B++)}B&&k++}for(let y=0;y<4;y++)bt(P[y],De,x[y],"flowers");await g.yield()}{const t=[],s=[],r=[];let n=0,m=0,f=0;const l=()=>{for(let i=f;i<m-1;i++)for(let u=0;u<4;u++){const p=i*5+u,c=p+1,e=p+5,o=e+1;r.push(p,c,e,c,o,e)}f=m};{const i=-nt.face[1],u=nt.face[0],p=nt.rows.length;for(let c=0;c<p;c++){const e=nt.rows[c],o=O(7,10,Math.pow(c/(p-1),.7))*(.94+.06*Math.sin(c*1.7));c&&(n+=Math.hypot(e[0]-nt.rows[c-1][0],e[1]-nt.rows[c-1][1],e[2]-nt.rows[c-1][2]));for(let a=-2;a<=2;a++){const d=Math.sign(a)*(o+(Math.abs(a)===2?.5:0)),h=Math.abs(a)===2?1.2:0;t.push(e[0]+i*d-nt.in[0]*h,e[1],e[2]+u*d-nt.in[1]*h),s.push(a,n,1.5)}m++}l()}await g.yield();{const i=K.r*1.16+.6,u=[K.fx-nt.in[0]*2.5,K.fz-nt.in[1]*2.5],p=[K.x+nt.in[0]*i,K.z+nt.in[1]*i],c=Math.hypot(p[0]-u[0],p[1]-u[1]),e=Math.max(2,Math.round(c)),o=(p[0]-u[0])/c,a=(p[1]-u[1])/c;for(let d=0;d<=e;d++){const h=d/e,b=O(u[0],p[0],h),P=O(u[1],p[1],h),x=Math.hypot(b-K.x,P-K.z)/i,y=i*Math.sqrt(Math.max(.03,1-x*x));n+=c/e;for(let k=-2;k<=2;k++){const M=Math.sign(k)*(y+(Math.abs(k)===2?.5:0)),A=b-a*M,N=P+o*M;t.push(A,Math.abs(k)===2?K.y-.6:K.y,N),s.push(k,n,-.4)}m++}l()}await g.yield();{const i=Y.fall,u=-i.face[1],p=i.face[0],c=i.rows.length;for(let e=0;e<c;e++){const o=i.rows[e],a=O(1.5,2.6,Math.pow(e/(c-1),.7))*(.92+.08*Math.sin(e*1.3));n+=1.5;for(let d=-2;d<=2;d++){const h=Math.sign(d)*(a+(Math.abs(d)===2?.3:0)),b=Math.abs(d)===2?.6:0;t.push(o[0]+u*h-i.in[0]*b,o[1],o[2]+p*h-i.in[1]*b),s.push(d,n,1.5)}m++}l()}{const i=-vt.face[1],u=vt.face[0],p=vt.rows.length;for(let c=0;c<p;c++){const e=vt.rows[c],o=O(1.7,3.5,Math.pow(c/(p-1),.8))*(.9+.1*Math.sin(c*1.9));n+=1.5;for(let a=-2;a<=2;a++){const d=Math.sign(a)*(o+(Math.abs(a)===2?.3:0)),h=Math.abs(a)===2?.6:0;t.push(e[0]+i*d-vt.in[0]*h,e[1],e[2]+u*d-vt.in[1]*h),s.push(a,n,1.5)}m++}l()}const v=new z.BufferGeometry;v.setAttribute("position",new z.BufferAttribute(new Float32Array(t),3)),v.setAttribute("aW",new z.BufferAttribute(new Float32Array(s),3)),v.setIndex(r),v.computeBoundingSphere();const w=new z.Mesh(v,new z.ShaderMaterial({vertexShader:po,fragmentShader:mo,side:z.DoubleSide,uniforms:Xt({uFallP:{value:new z.Vector2(K.fx,K.fz)},uPoolC:{value:new Ht(K.x,K.z,K.r)}})}));w.name="fall",H.add(w)}await g.yield();{const t=ht.lianas,s=[],r=ot(ut.a,ut.l),n=(e,o,a,d)=>{for(let h=0;h<=1.001;h+=.125)if(st(e,o-d*h,a).d<7.5+d*.05||Ft(e,o-d*h,a)<.6+d*.05)return!1;return!0};for(let e=0;e<re.length;e++){const o=re[e],a=t(),d=t(),h=t(),b=t(),P=t();if(e%60===59&&await g.yield(),!(o[5]===0||_t(o[0],o[2]).dh>80||a<.3))for(let x=0;x<(a>.7?2:1);x++){const y=(d+x*.37)*tt,k=o[3]*O(.2,.7,x?b:h),M=o[0]+Math.cos(y)*k,A=o[2]+Math.sin(y)*k,N=o[1]-.3*o[4],L=Math.min(O(7,20,x?h:P),N-Z(M,A)-1.5);L>4&&n(M,N,A,L)&&s.push([M,N,A,L,.17,b+x*.5])}}for(let e=0;e<84;e++){const o=t()*tt,a=ut.r*(1+.07*Math.sin(o*3+1)+.05*Math.sin(o*7+4))-t.range(.3,3.5),d=r[0]+Math.cos(o)*a,h=r[1]+Math.sin(o)*a,b=170+t.range(-2,3),P=t.range(20,40)*(.6+.4*t()),x=t();let y=1e9;for(const k of[0,9]){Kt(d+Math.cos(o)*k,h+Math.sin(o)*k,ft);const M=mt(ft.a),A=(M.left+M.right)*.5,N=(M.right-M.left)*.5,L=Math.pow(Math.min(1,Math.abs(ft.l-A)/N),1/.55);y=Math.min(y,-5+(M.roof+5)*Math.pow(Math.sqrt(Math.max(0,1-L*L)),ne(ft.a)))}y<172||s.push([d,b,h,P,.4,x])}{const e={p:[0,0,0],a:[0,0,0,0],c:[0,0,0]};for(let o=0;o<130;o++){const a=t.range(486,768),d=t()<.5,h=t.range(95,160),b=t.range(22,55),P=t(),x=t.range(.3,.5),y=mt(a),k=Math.asin(Math.min(1,Math.pow((h+5)/(y.roof+5),1/ne(a))));te(a,d?Math.PI-k:k,e),ot(a,(y.left+y.right)*.5,S);const M=S[0]-e.p[0],A=S[1]-e.p[2],N=Math.hypot(M,A)||1,L=e.p[0]+M/N*1.2,F=e.p[2]+A/N*1.2;n(L,e.p[1],F,b)&&s.push([L,e.p[1],F,b,x,P]),o%40===39&&await g.yield()}for(let o=0;o<80;o++){const a=kt.a+t.range(-45,40),d=t.range(84,150),h=t.range(14,42),b=t(),P=t.range(.3,.55),x=mt(a),y=Math.asin(Math.min(1,Math.pow((d+5)/(x.roof+5),1/ne(a))));te(a,Math.PI-y,e),ot(a,(x.left+x.right)*.5,S);const k=S[0]-e.p[0],M=S[1]-e.p[2],A=Math.hypot(k,M)||1,N=e.p[0]+k/A*1.2,L=e.p[2]+M/A*1.2;let F=!0;for(let G=0;G<=1.001;G+=.125)(st(N,e.p[1]-h*G,L).d<7.5+h*.05||Ft(N,e.p[1]-h*G,L,!0)<.6+h*.05)&&(F=!1);F&&s.push([N,e.p[1],L,h,P,b]),o%40===39&&await g.yield()}}for(const e of n0)for(let o=0;o<9;o++){const a=t()*tt,d=e[3]*t.range(.25,.7),h=e[0]+Math.cos(a)*d,b=e[2]+Math.sin(a)*d,P=e[1]+e[4]*.55,x=Math.min(t.range(5,11),P-Z(h,b)-.3),y=t();x>3&&n(h,P,b,x)&&s.push([h,P,b,x,.24,y])}const m=8,f=s.length,l=f*(m+1)*2,v=new Float32Array(l*4),w=new Float32Array(l*4),i=new Float32Array(l*3),u=[];for(let e=0;e<f;e++){const o=s[e];for(let a=0;a<=m;a++)for(let d=0;d<2;d++){const h=(e*(m+1)+a)*2+d;v.set([o[0],o[1],o[2],o[3]],h*4),w.set([a/m,d*2-1,o[5],o[4]],h*4),i.set([o[0],o[1]-o[3]*a/m,o[2]],h*3)}for(let a=0;a<m;a++){const d=(e*(m+1)+a)*2;u.push(d,d+1,d+2,d+2,d+1,d+3)}}const p=new z.BufferGeometry;p.setAttribute("position",new z.BufferAttribute(i,3)),p.setAttribute("aL",new z.BufferAttribute(v,4)),p.setAttribute("aM",new z.BufferAttribute(w,4)),p.setIndex(u);const c=new z.Mesh(p,new z.ShaderMaterial({vertexShader:no,fragmentShader:ro,side:z.DoubleSide,uniforms:Xt()}));c.frustumCulled=!1,c.name="lianas",H.add(c)}await g.yield();{const t=ht.wallferns,s=Tt.fernGeometry({rng:t.fork("form"),size:1,fronds:6,detail:0,leaf:"#3c8a3a",leafLight:"#9ccb4a",leafDark:"#1c4a22"}),r=[],n={p:[0,0,0],a:[0,0,0,0],c:[0,0,0]};for(let m=0;m<230;m++){const f=t.range(345,770),l=f<470||t()<.5,v=t.range(20,105),w=t.range(1.6,3.8),i=t(),u=t(),p=mt(f),c=Math.asin(Math.min(1,Math.pow((v+5)/(p.roof+5),1/ne(f)))),e=(l?Math.PI-c:c)/Math.PI;te(f,e*Math.PI,n),ot(f,(p.left+p.right)*.5,S);const o=S[0]-n.p[0],a=S[1]-n.p[2];st(n.p[0],n.p[1],n.p[2]).d<9+w||r.push([n.p[0],n.p[1]-.2,n.p[2],w,w,w,Math.atan2(o,a)+(i-.5)*.6,.9,0,.8+.3*u,.9+.2*u,.8])}await g.yield();for(let m=0;m<120;m++){const f=kt.a+t.range(-45,40),l=t.range(60,125),v=t.range(2.4,5.2),w=t(),i=t(),u=mt(f),p=Math.asin(Math.min(1,Math.pow((l+5)/(u.roof+5),1/ne(f))));te(f,Math.PI-p,n),ot(f,(u.left+u.right)*.5,S);const c=S[0]-n.p[0],e=S[1]-n.p[2];m%40===39&&await g.yield(),!(Math.hypot(n.p[0]-m0[0],n.p[2]-m0[1])<me.r+9&&l<me.y1||st(n.p[0],n.p[1],n.p[2]).d<9+v)&&r.push([n.p[0],n.p[1]-.2,n.p[2],v,v,v,Math.atan2(c,e)+(w-.5)*.6,.9,0,.8+.3*i,.9+.2*i,.8])}bt(s,ee,r,"wall-ferns")}await g.yield();const Se={sunDir:[zt.x,zt.y,zt.z],sunColor:new z.Color().setRGB(1,.9,.66),sunIntensity:3,sky:new z.Color().setRGB(.4,.62,.64),skyIntensity:1,ground:new z.Color().setRGB(.1,.16,.07),groundIntensity:1},r0={...Se,sunIntensity:.5,skyIntensity:1.5},le=ue.makeFauna(H,{light:Se}),de=[];H.userData.life=de;const Ce=(t,s)=>(t.object.name=s,t.object.traverse(r=>{r.name=s}),t),qe=t=>{t.object&&t.object.traverse(s=>{s.geometry&&s.geometry.dispose(),s.material&&s.material.dispose()}),t.geometry&&t.geometry.dispose(),t.material&&t.material.dispose()},Ee=t=>{let s=1e9;for(const r of t)s=Math.min(s,st(r[0],r[1],r[2]).d);return Math.round(s*100)/100};{const t=(ut.y-96)/zt.y,s=St[0]-zt.x*t,r=St[1]-zt.z*t,n=[];for(let l=0;l<12;l++){const v=tt*l/12;n.push([s+Math.cos(v)*14,96+4*Math.sin(v*2),r+Math.sin(v)*14])}await g.yield();const m={species:"swifts",count:38,size:3.2,form:"loose",speed:16,spread:[8,5,20],wander:[2,1.5,2,.7],maxSigma:3},f=await ue.makeFlockAsync({rng:ht.swifts,...m,route:n,closed:!0,keepClear:{path:Dt,dist:14,from:430/E,to:640/E,step:2},light:Se},g.yield);de.push({name:"swifts of the pillar",...m,kept:f.kept,reach:f.reach,least:Ee(n)}),f.kept&&f.kept.short>0?qe(f):le.add(Ce(f,"swifts")),await g.yield()}{const t=[];for(let n=349;n<=440.5;n+=18.2){const m=lt(n,-13);t.push([m[0],m[1]+1.5,m[2]])}{const n=lt(447,-16);t.push([n[0],n[1]+2,n[2]])}for(let n=440;n>=348.5;n-=18.2){const m=lt(n,-19);t.push([m[0],m[1]+2.5,m[2]])}{const n=lt(342,-16);t.push([n[0],n[1]+2,n[2]])}await g.yield();const s={species:"swifts",count:14,size:3,form:"loose",speed:15,spread:[2.2,1,14],wander:[1.2,.7,1.5,.8],maxSigma:3},r=await ue.makeFlockAsync({rng:ht.party,...s,route:t,closed:!0,keepClear:{path:Dt,dist:7,from:326/E,to:462/E,step:2},light:Se},g.yield);de.push({name:"swifts up the staircase",...s,kept:r.kept,reach:r.reach,least:Ee(t)}),r.kept&&r.kept.short>0?qe(r):le.add(Ce(r,"swifts-up-the-staircase")),await g.yield()}{const t=[];for(let n=259;n<=304.5;n+=15){const m=lt(n,9.5);t.push([m[0],m[1]-3.2,m[2]])}{const n=lt(308,11.5);t.push([n[0],n[1]-2.8,n[2]])}for(let n=304;n>=258.5;n-=15){const m=lt(n,13.5);t.push([m[0],m[1]-2.4,m[2]])}{const n=lt(255,11.5);t.push([n[0],n[1]-2.8,n[2]])}await g.yield();const s={species:"swifts",count:8,size:3,form:"loose",speed:14,spread:[1.2,.8,8],wander:[.9,.6,1.2,.8],maxSigma:3},r=await ue.makeFlockAsync({rng:ht.spare2.fork("passage"),...s,route:t,closed:!0,keepClear:{path:Dt,dist:6.5,from:240/E,to:324/E,step:2},light:Se},g.yield);de.push({name:"swifts over the lake",...s,kept:r.kept,reach:r.reach,least:Ee(t)}),r.kept&&r.kept.short>0?qe(r):le.add(Ce(r,"swifts-over-the-lake")),await g.yield()}{await g.yield();const t={species:"swifts",count:9,size:3,spread:[1,.6,6],wander:[.9,.5,1.2,.8],maxSigma:3},s={path:Dt,side:-8.5,up:-1.5,lead:20,from:20/E,to:176/E},r=await ue.makeFlockAsync({rng:ht.spare2.fork("escort"),...t,along:s,keepClear:{path:Dt,dist:6,from:0,to:216/E,each:!0,step:2},light:r0},g.yield);de.push({name:"swifts escorting, the river",...t,along:{side:s.side,up:s.up,lead:s.lead,from:20,to:176},kept:r.kept,reach:r.reach,least:8.5}),r.kept&&r.kept.short>0?qe(r):le.add(Ce(r,"swifts-escorting")),await g.yield()}{const t=H.userData.greatTree&&H.userData.greatTree.lat>0?-1:1,s=[],r=(v,w,i)=>{let u=w*t,p=lt(v,u);for(let c=0;c<2;c++){let e=!1;for(const o of re)Math.hypot(o[0]-p[0],o[2]-p[2])<4.5&&(e=!0);if(!e)break;u+=2.5*t,p=lt(v,u)}s.push([p[0],p[1]+i,p[2]])},n=E-116,m=E-32;for(let v=n;v<=m+.5;v+=14)r(v,11.5,1.5);r(m+7,13.5,4);for(let v=m;v>=n-.5;v-=14)r(v,15.5,6.5);r(n-7,13.5,4),await g.yield();const f={species:"swifts",count:12,size:3,form:"loose",speed:13,spread:[1.5,.8,9],wander:[1,.6,1.2,.8],maxSigma:3},l=await ue.makeFlockAsync({rng:ht.spare2.fork("gully"),...f,route:s,closed:!0,keepClear:{path:Dt,dist:6.5,from:(n-28)/E,to:1,step:2},light:r0},g.yield);de.push({name:"swifts of the bank",...f,kept:l.kept,reach:l.reach,least:Ee(s)}),l.kept&&l.kept.short>0?qe(l):le.add(Ce(l,"swifts-of-the-bank")),await g.yield()}{const t=[],s=-nt.in[1],r=nt.in[0];for(let l=0;l<12;l++){const v=tt*l/12,w=Math.cos(v),i=Math.sin(v),u=9+3*i;t.push([K.fx+nt.in[0]*u+s*22*w,K.y+4+13*(1-i),K.fz+nt.in[1]*u+r*22*w])}await g.yield();const n={species:"flamingos",count:11,size:3.4,form:"loose",speed:9,spread:[2.4,1.2,16],wander:[.8,.5,1,.45],maxSigma:3},m={body:"#f6f4ec",belly:"#ffffff",wingC:"#f0eee6",trail:"#e4e2da",tip:"#d6d4ca",beak:"#e8b020",head:"#f8f6f0",neckC:"#f8f6f0",legC:"#2a2622"},f=await ue.makeFlockAsync({rng:ht.spare2.fork("egrets"),...n,palette:m,route:t,closed:!0,keepClear:{path:Dt,dist:6,from:470/E,to:660/E,step:2},light:Se},g.yield);de.push({name:"egrets of the pool",...n,kept:f.kept,reach:f.reach,least:Ee(t)}),f.kept&&f.kept.short>0?qe(f):le.add(Ce(f,"egrets")),await g.yield()}{const t=[];for(let n=0;n<10;n++){const m=tt*n/10;t.push([ke[0]+Math.cos(m)*11,kt.y+27+1.5*Math.sin(m*2),ke[1]+Math.sin(m)*11])}await g.yield();const s={species:"swifts",count:9,size:3,form:"loose",speed:12,spread:[2.2,1,8],wander:[1.2,.7,1.5,.8],maxSigma:3},r=await ue.makeFlockAsync({rng:ht.spare2.fork("ring"),...s,route:t,closed:!0,keepClear:{path:Dt,dist:12,from:(E-80)/E,to:1,step:2},light:Se},g.yield);de.push({name:"swifts about the ring",...s,kept:r.kept,reach:r.reach,least:Ee(t)}),r.kept&&r.kept.short>0?qe(r):le.add(Ce(r,"swifts-about-the-ring")),await g.yield()}{const t=[["#2a8cff","#c8ecff"],["#ff8a14","#fff2d8"],["#ffd91a","#fff6c0"]],s=[1.8,.8,.55,.03],r=(m,f,l)=>{const v=(ut.y-f)/zt.y;return Math.hypot(m+zt.x*v-St[0],l+zt.z*v-St[1])<ut.r-6},n=[{name:"butterflies of the bank",n:58,s:[E-160,E-12],lat:[8.6,21],y:[-5,5],light:r0,where:()=>!0},{name:"butterflies in the sun",n:36,s:[470,610],lat:[8.6,32],y:[-18,2],light:Se,where:r},{name:"butterflies of the left bank",n:26,s:[E-60,E-8],lat:[10,30],side:-1,y:[-4,10],light:r0,where:()=>!0},{name:"butterflies of the ring",n:22,s:[E-9,E+5],lat:[8.8,15],y:[-6,8],light:r0,where:()=>!0}];for(const m of n){const f=ht.flies.fork(m.name),l=[];for(let i=0;i<1200&&l.length<m.n;i++){const u=f.range(m.s[0],m.s[1]),p=(m.side||f.sign())*f.range(m.lat[0],m.lat[1]),c=f.range(m.y[0],m.y[1]),e=lt(Math.min(u,E-.5),p),o=e[0]+(u>E?Ae*(u-E):0),a=e[2]+(u>E?Pe*(u-E):0),d=e[1]+c;i%150===149&&await g.yield(),!(d<Z(o,a)+1.6||st(o,d,a).d<8.6||!m.where(o,d,a))&&l.push([o,d,a])}if(await g.yield(),!l.length)continue;const v={count:l.length,jitter:0,size:3.6,roam:s,varieties:t},w=ue.makeButterflies({rng:f.fork("kit"),positions:l,...v,keepClear:{path:Dt,dist:5,from:(m.s[0]-40)/E,to:1,up:!0,step:1},light:m.light});de.push({name:m.name,...v,kept:w.kept,reach:w.reach,least:Ee(l)}),w.kept&&w.kept.short>0?(w.geometry.dispose(),w.material.dispose()):le.add(Ce(w,m.name.replace(/ /g,"-")),{light:!1}),await g.yield()}}await g.yield();{const t=ht.motes,s=Lt?520:900,r=new Float32Array(s*4),n=new Float32Array(s*4);let m=0;for(let v=0;v<s*6&&m<s;v++){const w=t()<.6,i=t.range(18,150),u=(ut.y-i)/Math.tan(b0),p=t()*tt,c=Math.sqrt(t())*(ut.r+6),e=Lt?t.range(.07,.14):t.range(.02,.045),o=Lt?t.range(.25,.6):t.range(-.12,.2),a=t(),d=t.range(.5,1.3);let h=St[0]-we[0]*u+Math.cos(p)*c,b=St[1]-we[1]*u+Math.sin(p)*c,P=i;if(w){const x=lt(O(515,650,a),(p/tt*2-1)*34);h=x[0],b=x[2],P=x[1]+(c/(ut.r+6)*2-1)*16}v%400===399&&await g.yield(),!(st(h,P,b).d<4||P<Z(h,b)+1)&&(r.set([h,P,b,e],m*4),n.set([o,26,a,d],m*4),m++)}const f=new z.InstancedBufferGeometry;f.setAttribute("position",new z.BufferAttribute(new Float32Array([-.5,-.5,0,.5,-.5,0,-.5,.5,0,.5,.5,0]),3)),f.setIndex([0,1,2,2,1,3]),f.setAttribute("iP",new z.InstancedBufferAttribute(r,4)),f.setAttribute("iQ",new z.InstancedBufferAttribute(n,4)),f.instanceCount=m;const l=new z.Mesh(f,new z.ShaderMaterial({vertexShader:vo,fragmentShader:go,uniforms:Xt({uFluff:{value:Lt?1:0}}),transparent:!0,depthWrite:!1,blending:z.AdditiveBlending}));l.frustumCulled=!1,l.name="motes",l.renderOrder=7,H.add(l)}await g.yield();{const t=ht.threads,s=ht.shower,r=ht.water,n=Math.round((wt||Ue?660:220)*et),m=Ue?Math.round(1500*et):0,f=150,l=n+m+f,v=new Float32Array(l*4),w=new Float32Array(l*4);let i=0;for(let c=0;c<n;c++){const e=Math.floor(t()*70)/70*tt+t.range(-.012,.012),o=ut.r*(1+.07*Math.sin(e*3+1)+.05*Math.sin(e*7+4))-t.range(.5,2.5),a=t.range(1,1.5),d=t(),h=t.range(.7,1.5),b=St[0]+Math.cos(e)*o,P=St[1]+Math.sin(e)*o;if(c%220===219&&await g.yield(),_t(b,P).dh<4)continue;const x=Z(b,P),y=168-x;v.set([b,168,P,y],i*4),w.set([Math.sqrt(2*y/9.8)*a,d,.05,h],i*4),i++}await g.yield();for(let c=0;c<m;c++){const e=s()*tt,o=Math.sqrt(s())*(ut.r-4),a=s.range(1,1.3),d=s(),h=s.range(.5,1.1),b=St[0]+Math.cos(e)*o,P=St[1]+Math.sin(e)*o;if(c%250===249&&await g.yield(),_t(b,P).dh<4)continue;const x=Z(b,P),y=172-x;v.set([b,172,P,y],i*4),w.set([Math.sqrt(2*y/9.8)*a,d,.04,h],i*4),i++}await g.yield();{const c=lt(E-.5,12.5),e=c[0]+Ae*5,o=c[2]+Pe*5;for(let a=0;a<f;a++){const d=e+(a%3-1)*.5*-Pe+r.range(-.08,.08),h=o+(a%3-1)*.5*Ae+r.range(-.08,.08),b=r.range(1,1.25),P=r(),x=r.range(1,1.8);Kt(d,h,ft);const y=Z(d,h),k=xe(ft.a,ft.l)-1,M=k-y;a%30===29&&await g.yield(),!(st(d,y+8,h).d<10)&&(v.set([d,k,h,M],i*4),w.set([Math.sqrt(2*M/9.8)*b,P,.06,x],i*4),i++)}}const u=new z.InstancedBufferGeometry;u.setAttribute("position",new z.BufferAttribute(new Float32Array([-.5,0,0,.5,0,0,-.5,1,0,.5,1,0]),3)),u.setIndex([0,1,2,2,1,3]),u.setAttribute("iP",new z.InstancedBufferAttribute(v,4)),u.setAttribute("iQ",new z.InstancedBufferAttribute(w,4)),u.instanceCount=i;const p=new z.Mesh(u,new z.ShaderMaterial({vertexShader:Ja,fragmentShader:to,uniforms:Xt(),transparent:!0,depthWrite:!1,blending:z.AdditiveBlending}));p.frustumCulled=!1,p.name="rim-threads",p.renderOrder=6,H.add(p)}await g.yield();function Ga(t,s,r,n){it.uTime.value=s,na.update(s),le.update(t,s,r,n);for(let m=0;m<2;m++){const f=o0[m],l=1+.04*Math.sin(s*1.3+f.phase)+.02*Math.sin(s*3.1+f.phase*2);ye[m].copy(f.col).multiplyScalar(f.power*l),aa[m].uGlow.value=1.5*l}}{const t=nt.rows[0],s=H.userData.places={};let r=_t(K.x,K.z);s.pool={x:K.x,y:K.y,z:K.z,r:K.r,lineOver:r.y-K.y,lineAside:r.dh,s:r.s},r=_t(K.fx,K.fz),s.fall={footX:K.fx,footZ:K.fz,headY:t[1],height:nt.height,lineAside:r.dh,s:r.s}}const qa=t=>16+2.5*C(100,140,t)-4*C(400,440,t)+1*C(490,520,t)-1.5*C(555,580,t)+.5*C(610,640,t)-2.5*C(E-100,E,t),Ea=[{at:new Ht(Nt[1].x,Nt[1].y+40,Nt[1].z),from:150/E,to:226/E,weight:.3},{at:new Ht(Nt[2].x+Nt[2].leanX*20,Nt[2].y+20,Nt[2].z+Nt[2].leanZ*20),from:244/E,to:296/E,weight:.3},{at:new Ht(St[0]-zt.x*(ut.y-72)/zt.y,72,St[1]-zt.z*(ut.y-72)/zt.y),from:396/E,to:474/E,weight:.4},{at:new Ht(nt.rows[0][0],K.y+20,nt.rows[0][2]),from:462/E,to:566/E,weight:.55},{at:new Ht(ke[0],kt.y+8,ke[1]),from:598/E,to:(E-30)/E,weight:.4}];return{scene:H,path:Dt,duration:45.5,pace:t=>qa(At(t,0,1)*E)/16.6,camera:{fov:62,near:.3,far:2400,lookAhead:22,sway:.5,bank:.5},portal:{shape:"circle",radius:7,color:"#ffd9a0",glow:.55,tilt:!0,revealDistance:1600,veil:"#123036"},post:{exposure:2,bloom:{strength:.4,radius:.6,threshold:.9},grade:{saturation:1.14,contrast:1.12,tint:"#ffffff",shadowTint:"#020506",vignette:.3,grain:.02,aberration:0}},ride:"none",pois:Ea,update:Ga,dispose(){for(const t of le.items){const s=t.f;s.geometry&&s.geometry.dispose(),s.material&&s.material.dispose()}ee.map&&ee.map.dispose()}}}};export{bo as default};
