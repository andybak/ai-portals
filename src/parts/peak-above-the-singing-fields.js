import*as S from"three";import{makeCloudField as Ze}from"../kit/sky.js";const U=Math.PI/180,we=Math.PI*2,le=(s,t,i)=>Math.max(t,Math.min(i,s)),se=(s,t,i)=>s+(t-s)*i,O=(s,t,i)=>{const f=Math.max(0,Math.min(1,(i-s)/(t-s)));return f*f*(3-2*f)},$=(s,t)=>{s=Math.abs(s),t=Math.abs(t);let i=0;if(s>i&&(i=s),t>i&&(i=t),i===1/0)return 1/0;if(s!==s||t!==t)return NaN;if(i===0)return 0;const f=s/i,p=t/i;return Math.sqrt(f*f+p*p)*i},Fe=(s,t,i)=>{s=Math.abs(s),t=Math.abs(t),i=Math.abs(i);let f=0;if(s>f&&(f=s),t>f&&(f=t),i>f&&(f=i),f===1/0)return 1/0;if(s!==s||t!==t||i!==i)return NaN;if(f===0)return 0;const p=s/f,j=t/f,b=i/f,v=p*p,L=j*j,g=v+L,M=g-v-L;return Math.sqrt(g+(b*b-M))*f},oe={AX:0,AZ:-350,TOP:360,CROWN0:200,CROWN1:280,CROWNR:260,FALLX:-152,FALLZ:-352,FALLTOP:63,FALLFOOT:8,FALLW:16,VALE:8,SHELF:34},Te=[[0,200],[30,165],[60,140],[100,120],[150,98],[200,78],[250,58],[300,36],[340,16],[358,7]];function pe(s){if(s<=0)return 200-s*1.2;for(let t=1;t<Te.length;t++)if(s<=Te[t][0]){const i=Te[t-1],f=Te[t];return se(i[1],f[1],(s-i[0])/(f[0]-i[0]))}return 7}const tt=21;function Re(s,t){const i=s*U,f=t*U;return new S.Vector3(Math.sin(f)*Math.cos(i),Math.sin(i),-Math.cos(f)*Math.cos(i))}function Ve(s){const t={golden:{sunEl:13,sunAz:-70,moonAz:150,sun:"#ffd08a",sunK:3.2,skyLow:"#9ec4ee",hemi:1.2,zen:"#5f9be0",hor:"#f3d9a2",fogSun:"#f2dcae",fogAway:"#b9cfe6",rose:"#f1b79e",moonK:1},day:{sunEl:30,sunAz:-70,moonAz:150,sun:"#fff0d2",sunK:3.3,skyLow:"#a9cbf2",hemi:1.25,zen:"#4f8fe0",hor:"#dfe9f2",fogSun:"#eef0e6",fogAway:"#c3d6ec",rose:"#f3d9c4",moonK:.8},dawn:{sunEl:13,sunAz:110,moonAz:-60,sun:"#ffb9a0",sunK:3,skyLow:"#a7b9e8",hemi:1.25,zen:"#6a94dc",hor:"#f6cfc0",fogSun:"#f6d2c2",fogAway:"#b7c6e6",rose:"#f3a9a4",moonK:1},low:{sunEl:12,sunAz:-70,moonAz:150,sun:"#ffb466",sunK:3.1,skyLow:"#8fb0e6",hemi:1.25,zen:"#4f83d6",hor:"#f6c98a",fogSun:"#f4cf98",fogAway:"#aebfe2",rose:"#ee9f8c",moonK:1.25}}[s]||null,i=t||Ve("golden");return t&&(i.kind=s,i.sunDir=Re(i.sunEl,i.sunAz),i.moonDir=Re(tt,i.moonAz)),i}const Ne=14,je=16,Be={fog:256e-6,haze:6e-4,top:120,soft:60};function it(s,t={}){const i=(v,L=1)=>new S.Color(v).multiplyScalar(L),f=[],p=[];for(let v=0;v<Ne;v++)f.push(new S.Vector4(0,0,1,1)),p.push(new S.Vector4(0,0,0,0));const j=[];for(let v=0;v<je;v++)j.push(new S.Vector4(0,225,0,0));return{uniforms:{uSunDir:{value:s.sunDir.clone()},uSunCol:{value:i(s.sun,s.sunK/Math.PI)},uMoonDir:{value:s.moonDir.clone()},uMoonCol:{value:i("#c3d0ee",.55*s.moonK)},uSkyLow:{value:i(s.skyLow,s.hemi/Math.PI)},uGroundLow:{value:i("#6f8a4e",.8*s.hemi/Math.PI)},uSkyHigh:{value:i("#31479c",.3)},uSeaBounce:{value:i("#a9a8c8",.5).lerp(i(s.rose,.5),.25)},uFogSun:{value:i(s.fogSun)},uFogAway:{value:i(s.fogAway)},uCloudLit:{value:i("#f6f1e6",.92)},uCloudShade:{value:i("#a9a8c8",.8)},uFog:{value:new S.Vector4(t.fog??Be.fog,t.haze??Be.haze,Be.top,Be.soft)},uAxis:{value:new S.Vector3(oe.AX,oe.CROWNR,oe.AZ)},uSea:{value:new S.Vector4(1560,236,192,0)},uCloudN:{value:0},uCloudP:{value:j},uTime:{value:0},uShapeN:{value:0},uShape:{value:f},uShapeB:{value:p},uWind:{value:new S.Vector2(Math.sin(110*U),-Math.cos(110*U))},uPhGust:{value:new S.Vector2},uPhDust:{value:new S.Vector2},uPhWave:{value:new S.Vector2},uPhNet:{value:new S.Vector2},uPhRip:{value:new S.Vector2},uPhShim:{value:new S.Vector2}},hour:s}}const Ee=`
uniform vec3 uSunDir, uSunCol, uMoonDir, uMoonCol, uSkyLow, uGroundLow, uSkyHigh, uSeaBounce, uFogSun, uFogAway, uCloudLit, uCloudShade, uAxis;
uniform vec4 uFog, uSea; uniform float uTime; uniform int uShapeN, uCloudN; uniform vec4 uCloudP[${je}]; uniform vec4 uShape[${Ne}], uShapeB[${Ne}]; uniform vec2 uWind, uPhGust, uPhDust, uPhWave, uPhNet, uPhRip, uPhShim;
float ph1(vec3 p){ p=fract(p*.3183099+.1); p*=17.; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float pn3(vec3 x){ vec3 i=floor(x), f=fract(x); f=f*f*(3.-2.*f);
  return mix(mix(mix(ph1(i),ph1(i+vec3(1.,0.,0.)),f.x),mix(ph1(i+vec3(0.,1.,0.)),ph1(i+vec3(1.,1.,0.)),f.x),f.y),
             mix(mix(ph1(i+vec3(0.,0.,1.)),ph1(i+vec3(1.,0.,1.)),f.x),mix(ph1(i+vec3(0.,1.,1.)),ph1(i+vec3(1.,1.,1.)),f.x),f.y),f.z); }
float pfbm3(vec3 p){ float a=.5, s=0.; for(int i=0;i<4;i++){ s+=a*pn3(p); p=p*2.03+vec3(11.3,7.1,5.7); a*=.5; } return s; }
float ph2(vec2 p){ vec3 q=fract(vec3(p.xyx)*.1031); q+=dot(q,q.yzx+33.33); return fract((q.x+q.y)*q.z); }
float pn2(vec2 x){ vec2 i=floor(x), f=fract(x); f=f*f*(3.-2.*f);
  return mix(mix(ph2(i),ph2(i+vec2(1.,0.)),f.x),mix(ph2(i+vec2(0.,1.)),ph2(i+vec2(1.,1.)),f.x),f.y); }
float pfbm2(vec2 p){ float a=.5, s=0.; for(int i=0;i<4;i++){ s+=a*pn2(p); p=p*2.03+vec2(17.3,9.1); a*=.5; } return s; }
// one family of parallel joints across a coordinate, at uneven spacing (the coordinate counts beds): x = how far to
// the nearest joint (in beds), y = a number for the bed between two joints
vec2 jset(float c, float k){
  float i=floor(c), f=c-i, d=f-(.2+.6*ph2(vec2(i,k)));
  float dn=d<0. ? f+.8-.6*ph2(vec2(i-1.,k)) : 1.2+.6*ph2(vec2(i+1.,k))-f;
  return vec2(min(abs(d),dn),ph2(vec2(d<0. ? i : i+1.,k+7.3)));
}
vec3 ph33(vec3 p){ p=fract(p*vec3(.1031,.1030,.0973)); p+=dot(p,p.yxz+33.33); return fract((p.xxy+p.yxx)*p.zyx); }
// jointed granite: beds lying a little out of level and two families of upright joints, every family at uneven
// spacing, the upright ones leaning and running through several beds, so no two blocks are alike and none is a
// cell of a net or a course of a wall.
// x = how far the block stands out (0..1; it falls away into the joints over a rounded edge), y = 1 in a joint,
// z = a number for the block; tilt = the way the block's own face is turned from the mean face. A family that lies
// in the face itself (N across it) draws no joint there. px (metres a pixel) widens the edges with the eye's
// distance, so far rock is calm.
vec3 jointed(vec3 p, vec3 N, float px, out vec3 tilt){
  // the beds undulate, pinch and swell; the two upright families lean, one each way
  float wy=p.y+.09*dot(p.xz,vec2(.8,.6))+5.*pn3(p*.013)+2.4*pn3(p*.045+3.)+.5*pn3(p*.21);
  vec2 b=jset(wy/3.6,1.);
  // the upright joints are master joints: one runs up through three or four beds before the next set takes over
  // (never bed by bed, which is a mason's bond)
  float st=jset(wy/13.+.4*pn3(p*.02+31.),8.).y*37.;
  vec3 q=p+2.6*vec3(pn3(p*.021+5.),0.,pn3(p*.021+9.))+.7*vec3(pn3(p*.09+1.),0.,pn3(p*.09+4.));
  vec2 j1=jset((dot(q.xz,vec2(.83,.56))+.27*q.y)/5.6+st,2.), j2=jset((dot(q.xz,vec2(-.56,.83))-.36*q.y)/8.2+st*1.7,3.);
  float kb=smoothstep(.2,.55,length(N.xz)), k1=smoothstep(.2,.55,length(vec2(N.y,dot(N.xz,vec2(-.56,.83))))), k2=smoothstep(.2,.55,length(vec2(N.y,dot(N.xz,vec2(.83,.56)))));
  // the rock is massive in places and broken in others, and no joint runs on for ever: each family comes and goes
  float broken=smoothstep(.3,.62,pn3(p*.03+7.));
  vec3 lv=vec3(smoothstep(.36,.58,pn3(p*.05+vec3(0.,b.y*9.,0.))),smoothstep(.42,.58,pn3(p*.11+11.+st)),smoothstep(.45,.6,pn3(p*.09+23.+st))), live=lv*broken;
  vec3 dm=vec3(b.x*3.6,j1.x*5.6,j2.x*8.2);
  float rw=.3+px*1.6, jw=.03+px*.45;
  vec3 kk=vec3(kb,k1,k2)*live;
  vec3 e=mix(vec3(1.),smoothstep(vec3(0.),vec3(rw),dm),kk), cr=(1.-smoothstep(vec3(jw*.4),vec3(jw),dm))*kk;
  // a block's own number is whole on either side of a joint that is there, and one number across a joint that is
  // not: the four numbers a block could have (with and without each upright family) are eased by how much of each
  // family lives at the place, and all of it by the beds' own life (so no number changes from pixel to pixel)
  vec3 hA=ph33(vec3(b.y,0.,0.)*91.7+3.1), hB=ph33(vec3(b.y,j1.y,0.)*91.7+3.1), hC=ph33(vec3(b.y,0.,j2.y)*91.7+3.1), hD=ph33(vec3(b.y,j1.y,j2.y)*91.7+3.1);
  vec3 h3=mix(vec3(.5),mix(mix(hA,hB,lv.y),mix(hC,hD,lv.y),lv.z),lv.x);
  tilt=(h3-.5)*vec3(1.,.5,1.)*broken;
  return vec3(mix(.6,.3+.7*h3.x,broken)*min(e.x,min(e.y,e.z)),max(cr.x,max(cr.y,cr.z)),mix(.5,h3.y,broken));
}
// the shelf's pavement: long slabs between two families of joints in the plan, the cross joints staggered from
// slab to slab. x = metres to the nearest joint, y = a number for the slab (and, in slabs: z = the number of the
// long strip between two joints of the 8.5 m family, the same all along it, w = how much of that family's joint
// lives at the place, going to nothing over the last half metre to the joint itself: what is scaled by it is whole
// across the joint)
vec4 slabs(vec2 p){
  vec2 q=p+5.*vec2(pn2(p*.02),pn2(p*.02+5.))+1.2*vec2(pn2(p*.11+2.),pn2(p*.11+8.));
  vec2 a=jset(dot(q,vec2(.906,.423))/8.5,4.);
  vec2 c=jset(dot(q,vec2(-.423,.906))/23.+a.y*31.,5.);
  // no joint runs on for ever: each comes and goes along its length
  float la=smoothstep(.34,.5,pn2(p*.045+a.y*9.)), lc=smoothstep(.42,.6,pn2(p*.06+17.+a.y*5.));
  return vec4(min(mix(9.,a.x*8.5,la),mix(9.,c.x*23.,lc)),fract(a.y*3.1+c.y*7.7*lc),a.y,la*smoothstep(0.,.06,a.x));
}
vec2 slab(vec2 p){ return slabs(p).xy; }
// the tooth's radius by height (the same profile the body is built from)
float faceR(float y){
  float r=mix(200.,165.,clamp(y/30.,0.,1.));
  r=mix(r,140.,clamp((y-30.)/30.,0.,1.)); r=mix(r,120.,clamp((y-60.)/40.,0.,1.)); r=mix(r,98.,clamp((y-100.)/50.,0.,1.));
  r=mix(r,78.,clamp((y-150.)/50.,0.,1.)); r=mix(r,58.,clamp((y-200.)/50.,0.,1.)); r=mix(r,36.,clamp((y-250.)/50.,0.,1.));
  r=mix(r,16.,clamp((y-300.)/40.,0.,1.)); r=mix(r,7.,clamp((y-340.)/18.,0.,1.)); return r; }
// the mountain's shadow on a point of the land: 1 in the sun, less in the shade. ONE RULE OF THE SUN AND THE PLACE:
// the rock's shadow is its own outline thrown along the sun's ray (the buttresses stand out of the outline: its edge
// is no ruled line), soft by the sun's breadth and the air, the softer the further it falls; where the head's
// shadow ends lies the crown's (the cloud round the head is 260 m across and thin at its rim: a broad, ragged,
// lighter shade); and all of it is filled by the air's own light with distance, so its far end is lost in the haze
float peakShade(vec3 wp){
  vec2 q=wp.xz-uAxis.xz; float hl=max(length(uSunDir.xz),1e-4); vec2 sh=uSunDir.xz/hl;
  float t=-dot(q,sh), side=q.x*sh.y-q.y*sh.x, tp=max(t,0.), cot=hl/max(uSunDir.y,.05);
  float y=wp.y+tp/cot;
  float w=3.+tp*.07;
  float rock=(1.-smoothstep(-w,w,abs(side)-faceR(y)*(.94+.24*(pn2(vec2(y*.035,sign(side)*9.3))-.5))))*step(0.,t)*(1.-smoothstep(350.,362.,y));
  vec2 e=vec2((t-237.*cot)/(uAxis.y*.95+45.*cot),side/(uAxis.y*.9));
  float crown=.6*(1.-smoothstep(.5,1.05,length(e)+.3*(pfbm2(vec2(t,side)*.006)-.5)))*step(0.,t);
  return 1.-max(rock,crown)*(1.-.75*smoothstep(500.,1500.,tp));
}
// the shadows of the shelf's stone shapes (a place, a breadth across the wind, a height and a lean each; the
// breadth by height is the fin's own law, see buildShapes): 1 in the sun
float shapeShade(vec3 wp){
  float hl=max(length(uSunDir.xz),1e-4); vec2 sh=uSunDir.xz/hl; float tanE=uSunDir.y/hl, lit=1.;
  for(int i=0;i<${Ne};i++){
    if(i>=uShapeN) break;
    vec4 S=uShape[i], B=uShapeB[i];
    float y0=wp.y-B.x;
    // the shape leans downwind by B.yz a metre of height: take its middle at the height the ray meets it
    vec2 q=wp.xz-S.xy; float t=-dot(q,sh);
    float y=y0+max(t,0.)*tanE; float k=clamp(y/max(S.w,1.),0.,1.);
    vec2 q2=q-B.yz*y; t=-dot(q2,sh); float d=abs(q2.x*sh.y-q2.y*sh.x);
    float prof=S.z*pow(max(1.-pow(k,1.25),0.),.71)+.25;
    float w=1.5+max(t,0.)*.03;
    float inside=(1.-smoothstep(-w,w,d-prof))*smoothstep(S.z*.5,S.z*1.1,t)*(1.-smoothstep(S.w*.9,S.w*1.04,y))*step(0.,y);
    lit=min(lit,1.-inside);
  }
  return lit;
}
// the shadows of the small clouds of the open ring, each cast from where that cloud stands now, along the sun's
// own ray: 1 in the sun. A cloud is thin, so its shadow is soft and never dark. And the far sea's own shade: a point
// from which the sun stands behind the far sea's bank (the ray to the sun leaves the ring of open air under the
// bank's top) is in the bank's shade; the land under the sheet is in it altogether
float cloudShade(vec3 wp){
  float hl=max(length(uSunDir.xz),1e-4); vec2 sh=uSunDir.xz/hl; float inv=1./max(uSunDir.y,.08), lit=1.;
  vec2 qa=wp.xz-uAxis.xz; float ba=dot(qa,sh), disc=ba*ba-dot(qa,qa)+uSea.x*uSea.x;
  float ys=disc>0. ? wp.y+(-ba+sqrt(max(disc,0.)))*uSunDir.y/hl : -1e3;
  lit=mix(.42,1.,smoothstep(uSea.y-26.,uSea.y+30.,ys));
  for(int i=0;i<${je};i++){
    if(i>=uCloudN) break;
    vec4 C=uCloudP[i];
    vec2 q=wp.xz+uSunDir.xz*((C.y-wp.y)*inv)-C.xz;
    float al=dot(q,sh), ac=q.x*sh.y-q.y*sh.x;
    float d=length(vec2(al*.85,ac))/max(C.w,1.);
    lit=min(lit,1.-.5*(1.-smoothstep(.45,1.15,d))*step(wp.y,C.y-4.));
  }
  return lit;
}
// light on a point: sun (times what reaches it), the sky's fill by the point's own height, the moon's silver
vec3 peakLit(vec3 alb, vec3 N, vec3 wp, float sun, float ao){
  float hi=smoothstep(250.,290.,wp.y);
  vec3 fill=mix(mix(uGroundLow,uSeaBounce,hi), mix(uSkyLow,uSkyHigh,hi), clamp(N.y*.42+.58,0.,1.));
  // a point that stands inside the crown (between its base and its tops, within its reach of the axis) takes the
  // cloud's own light as well: white, soft, from every side
  float inCrown=smoothstep(176.,204.,wp.y)*(1.-smoothstep(286.,318.,wp.y))*(1.-smoothstep(uAxis.y*.8,uAxis.y,length(wp.xz-uAxis.xz)));
  fill+=mix(uCloudLit,uSunCol,.3)*.5*inCrown;
  // a face that stands (rock, a stone shape) takes the light the lit land, the bright haze and the crown throw back
  // at it, from every side: its shade is blue and open, never black
  fill+=(uSunCol*.08+uSkyLow*.8)*(1.-abs(N.y))*(1.-.5*hi);
  // and a face that stands over the crown takes the light of the crown's lit tops, which lie under it and about it
  // on every side: strongest just over the tops, less toward the last rock's head
  fill+=mix(uCloudLit,uSunCol,.3)*.42*smoothstep(286.,318.,wp.y)*(1.-.6*smoothstep(318.,356.,wp.y))*(1.-.7*max(N.y,0.));
  return alb*(uSunCol*max(dot(N,uSunDir),0.)*sun + fill*ao + uMoonCol*max(dot(N,uMoonDir),0.)*(.5+.5*ao));
}
// the air between the eye and a point: the world's one thin air (clear for two kilometres, then closing fast, so
// that the furthest things go into the sky's own horizon colour), and the land's haze, which lies in the air below
// uFog.z (ending softly over uFog.w) and is counted along the part of the sight line that runs through that air
vec3 peakAir(vec3 col, vec3 wp){
  vec3 v=wp-cameraPosition; float d=length(v); vec3 dir=v/max(d,1e-3);
  float ya=cameraPosition.y, yb=wp.y, lo=min(ya,yb), hi=max(ya,yb);
  float top=uFog.z+.5*uFog.w;
  float inl=clamp((top-lo)/max(hi-lo,1.),0.,1.)*(1.-smoothstep(uFog.z-.5*uFog.w,top,lo));
  float sunny=pow(clamp(dot(normalize(dir.xz+vec2(1e-5,0.)),normalize(uSunDir.xz))*.5+.5,0.,1.),2.);
  float k1=uFog.y*(.8+.45*sunny)*d*inl, k0=uFog.x*d;
  float f=1.-exp(-k0*k0*k0*k0-k1*k1);
  return mix(col,mix(uFogAway,uFogSun,sunny),f);
}
`,ce={y0:100,y1:120,deep:8,step:1.7,broad:12,back:1.1,crack:1.4,all:1,b0:280,b1:100};function lt(s,t,i=null){const f=s.chance(.5)?3:4,p=[],j=s.range(0,360);for(let a=0;a<f;a++)p.push({b:j+a*360/f+s.range(-22,22),w:s.range(26,38),k:a===0?1:s.range(.62,.92),tw:s.range(-.07,.07)});const b=s.range(19,26),v=s.range(8,14),L=s.range(.3,.36),g=s.range(0,50),M=s.range(0,50),T=s.range(0,360),W=a=>{const n=a+180;if(n>=0&&n<360){const x=n+360;if(x<720)return x-360-180}return a=((a+180)%360+360)%360-180,a},z=i||(()=>.5);z.range||(z.range=(a,n)=>a+(n-a)*.5);const E={b:z.range(347,353),w:z.range(9,11),out:z.range(52,58),y:[z.range(96,104),z.range(136,144),z.range(170,177)],drop:[z.range(13,15),z.range(15,17),z.range(14,16)]},V=a=>{const n=W(a-E.b)/E.w;return Math.abs(n)>3?0:.62*Math.exp(-n*n)+.38*Math.exp(-n*n*7)},A=a=>{let n=E.out;for(let x=0;x<3;x++)n-=E.drop[x]*O(E.y[x],E.y[x]+3.5,a);return Math.max(0,Math.min(n*(1-O(184,204,a)),212-pe(a)))};let _=NaN,D=NaN,H=0;const G=(a,n)=>a===_&&n===D?H:C(a,n,V(a)),R=new Float64Array(f),C=(a,n,x)=>{let m=x,w=0,q=1/0;for(let F=0;F<f;F++){const Z=p[F],Y=W(a-Z.b-Z.tw*n)/Z.w,te=Y*Y;R[F]=te,te<q&&(q=te,w=F)}m=Math.max(m,p[w].k*(.62*Math.exp(-q)+.38*Math.exp(-q*9)));for(let F=0;F<f;F++){if(F===w)continue;const Z=R[F],Y=p[F].k;Y/(1+Z*(1+Z*(.5+Z*.16666666666666666)))*1.000001<=m||(m=Math.max(m,Y*(.62*Math.exp(-Z)+.38*Math.exp(-Z*9))))}return _=a,D=n,H=m,m},I=a=>(.45+.55*O(15,95,a))*(1-.55*O(290,356,a)),u=a=>.07*(.5+.5*Math.cos((a-T)*U)),y=oe.FALLX-oe.AX,B=oe.FALLZ-oe.AZ,N=Math.atan2(y,-B)/U,l=$(y,B)-3,e=(a,n)=>1-O(9,27,Math.abs(W(a-N))*U*n),r=((ce.b1-ce.b0)%360+360)%360/2,c=a=>ce.all?1:1-O(0,12,Math.abs(W(a-ce.b0-r))-r),d=(a,n)=>(pe(n)+V(a)*A(n))*(1-L*I(n)*(1-G(a,n))-u(a)*O(0,60,n)),P=(a,n)=>(n[0]=pe(a),n[1]=A(a),n[2]=I(a),n[3]=O(0,60,a),n),k=(a,n,x,m)=>(n[0]+x*n[1])*(1-L*n[2]*(1-m)-u(a)*n[3]),K=(a,n,x,m)=>{const w=n[0]+x*n[1],q=u(a)*n[3];return m[0]=w*(1-L*n[2]-q),m[1]=w*(1-q),m},h=(a,n)=>{if(a>=0&&a<360){const ge=a+360;a=ge<720?ge-360:ge%360}else a=(a%360+360)%360;const x=a*U,m=Math.sin(x),w=-Math.cos(x),q=I(n),F=v*t.n2(m*1.7+g,w*1.7+n*.004),Z=(n+F)/b,Y=Math.floor(Z),te=Z-Y,X=.72*O(60,110,n)*O(-.35,.25,t.n2(m*2.3+Y*3.1,w*2.3+M))*(1-O(340,356,n)),Q=se(n,(Y+O(0,.22,te))*b-F,X),ae=V(a),ee=pe(Math.max(n,Math.min(Q,357)))+(ae>0?ae*A(n)*(1+.16*t.n2(m*9+M,n*.05+g)):0);let J=ee*(1-L*q*(1-G(a,n))-u(a)*O(0,60,n));const ne=x*100;let re=t.n2(ne/13+g,n/120+M);const de=Math.min(a,360-a),ze=n>ce.y0&&de<6?.5*O(0,6,6-de)*O(ce.y0,ce.y1,n):0;ze>0&&(re=se(re,t.n2((a<180?ne+we*100:ne-we*100)/13+g,n/120+M),ze)),J-=3.2*q*Math.min(1,ee/70)*(1-Math.abs(re));const $e=m*ee,Je=w*ee;J-=(2.2+4.5*q)*Math.max(0,.15+t.fbm3($e*.021+g,n*.016,Je*.021+M,3))*(1-.7*O(340,358,n)),J+=1.4*t.n3($e*.11,n*.09,Je*.11)*(1-O(346,358,n));const Ge=n>ce.y0&&n<300?O(ce.y0,ce.y1,n)*(1-O(282,300,n))*c(a):0;if(Ge>0){const ge=(n+2.5*t.n2(m*2+g,w*2+M))/ce.deep,Ae=Math.floor(ge),ke=ge-Ae,be=Math.floor(Ae/3);J-=Ge*ce.step*(.7-ke+O(.7,1,ke));const Se=Math.max(8,Math.round(we*pe((be*3+1.5)*ce.deep)/ce.broad)),Le=(a/360+t.n2(be*7.31+g,3.7)*.5+.5)%1*Se,De=Math.floor(Le),st=Le-De-.5,et=(.5-Math.abs(st))*(we/Se)*ee,rt=t.n2(be*13.7+g,De*5.3+M)*.5+.5;J-=Ge*(ce.back*rt+ce.crack*Math.exp(-(et/1.6)*(et/1.6)))}const qe=O(282,300,n)*(1-O(346,356,n));if(qe>0){const ge=(n+2.5*t.n2(m*2+g,w*2+M))/8,Ae=Math.floor(ge),ke=ge-Ae;J+=qe*1.7*(ke-O(.7,1,ke)-.4);const be=360/17,Se=(a+360*(t.n2(Math.floor(Ae/3)*7.31+g,3.7)*.5+.5))%360/be,Le=Se-Math.floor(Se)-.5,De=be*.5*U;J*=se(1,Math.cos(De)/Math.cos(Le*2*De),qe),J-=qe*1.4*Math.exp(-Math.pow((.5-Math.abs(Le))*be/2,2))}const Qe=e(a,J)*(1-O(oe.FALLTOP-1,oe.FALLTOP+3,n));return Qe>0&&(J=se(J,l+1.2*t.n2(ne/5,n/6),Qe)),J};return{radius:h,coarse:d,coarseY:P,coarseR:k,coarse01:K,rib:G,ribK:C,midOf:I,cleft:e,heightAt:(a,n)=>{const x=$(a,n),m=Math.atan2(a,-n)/U;if(x>215)return-1e3;let w=-8,q=359;if(h(m,w)<x)return-1e3;for(let F=0;F<16;F++){const Z=(w+q)*.5;h(m,Z)>x?w=Z:q=Z}return w},fallBear:N,wallR:l,nRib:f,spur:E,spurK:V,spurOut:A}}const ct=`
attribute vec3 aDress;
varying vec3 vW, vN, vDress;
void main(){ vec4 wp=modelMatrix*vec4(position,1.); vW=wp.xyz; vN=normalize(mat3(modelMatrix)*normal); vDress=aDress; gl_Position=projectionMatrix*viewMatrix*wp; }`,ht=`
uniform vec3 uRock, uRockWarm, uRockPale, uGrass, uSnow;
uniform vec4 uWater[2];
varying vec3 vW, vN, vDress;
${Ee}
vec3 bumpN(vec3 N, vec3 sx, vec3 sy, float hx, float hy, float k){
  vec3 r1=cross(sy,N), r2=cross(N,sx); float det=dot(sx,r1);
  vec3 g=sign(det)*(hx*r1+hy*r2);
  return normalize(abs(det)*N-k*g);
}
void main(){
  vec3 N=normalize(vN), p=vW;
  vec3 sx=dFdx(p), sy=dFdy(p); float px=max(length(sx),length(sy));
  // 1 on the mountain (jointed granite), 0 on the shelf's stone shapes (one stone each, wind-worn)
  // (far: a joint's recess is drawn where it is broad enough before the eye to be seen as a recess, some metres of
  // rock to a point of the raster at most; further off it gives way to its bed's mean tone, so that a joint is a
  // hollow with its shade near by and never a thin line far off)
  float joint=vDress.x, far=smoothstep(.08,.4,px);
  // THREE SIZES, all in the rock's own space (nothing is laid on by a flat projection, so nothing stretches):
  // beds and joints metres apart; weathering, a hand to a stride; grain and crystals, lost a few metres off
  float big=pfbm3(p*.045), med=pfbm3(p*.31+3.), fine=pn3(p*3.3)*(1.-smoothstep(.02,.2,px)), grain=pn3(p*13.)*(1.-smoothstep(.006,.05,px));
  // the mountain's granite stands in beds and blocks: THEY ARE RELIEF (a block stands out of the face, its edges
  // rounded back; the light and the shade show it), never a stroke: nothing dark is drawn along a joint
  vec3 tilt; vec3 jt=jointed(p,N,px,tilt);
  float hb=jt.x*.2*(1.-.7*far);
  tilt*=.26*(1.-.6*far)*joint;
  // the stone's beds: broad bands of a tone each, a little out of level (the mountain's are 6 m and more deep, the
  // shapes' a couple of metres: the same stone); on the shapes fine flutes run along them with the wind
  vec2 band=jset((p.y+.06*dot(p.xz,vec2(.6,-.8))+1.6*pn3(p*.03))/mix(2.3,6.5,joint),6.);
  float gv=.5+.5*sin(p.y*2.4-.5*dot(p.xz,uWind)+2.5*big), groove=gv*gv*smoothstep(.3,.6,pn3(p*.07+5.));
  float h=med*.6+fine*.25+grain*.15-(1.-joint)*.3*groove;
  float up=N.y;
  vec3 Nj=normalize(bumpN(N,sx,sy,dFdx(hb),dFdy(hb),joint)+tilt);
  float upB=Nj.y, deep=1.-smoothstep(.6,.86,vDress.z);
  // dress by height: grass on the low ledges; scree; first snow in the gullies from the crown's height, then on every
  // ledge and bed lip of the last 60 m; the pale level top
  float low=1.-smoothstep(52.,86.,p.y+20.*(big-.5));
  // (above the skirts TURF LIES ON LEVEL TREADS ONLY, on every bench up to the crown's lowest cloud at 185 m, and
  // ends at the lip in a ragged edge a stride deep: no grass is washed down a riser. The skirts keep their own law)
  float tread=smoothstep(.77,.83,up+.2*(pn3(p*1.3+7.)-.5)+.1*(med-.5))*(1.-smoothstep(181.,187.,p.y+4.*(big-.5)));
  // (and the skirts' turf ends upward as it ends at a lip: in a ragged edge, never in a wash thinning over the rock)
  float skirt=smoothstep(.42,.58,low+.3*(pn3(p*.3+11.)*.6+pn3(p*1.3+7.)*.4-.5));
  float grass=mix(tread,smoothstep(.34,.62,up+.3*(med-.5)),skirt)*step(.5,joint);
  float scree=smoothstep(.5,.68,pn3(vec3(p.x*.045,p.y*.03,p.z*.045)+21.)*.65+.35*med)*smoothstep(8.,40.,p.y);
  grass*=1.-.85*scree;
  float snowLedge=smoothstep(298.,322.,p.y+22.*(big-.5))*max(smoothstep(.42,.72,up+.2*(med-.5)),.9*smoothstep(.34,.66,upB+.25*(med-.5)));
  float snowGully=smoothstep(236.,300.,p.y+26.*(big-.5))*deep*smoothstep(.3,.6,med*.6+up*.6+.25);
  float snow=max(snowLedge,snowGully)*(1.-smoothstep(356.5,358.5,p.y))*step(.5,joint);
  float pale=smoothstep(356.5,358.8,p.y)*step(.5,joint);
  float wet=smoothstep(194.,212.,p.y)*(1.-smoothstep(262.,278.,p.y))*step(.5,joint);
  // the granite: pale grey going warm, each bed a little its own tone
  vec3 alb=mix(uRock,uRockWarm,smoothstep(.35,.7,med))*(.8+.4*big)*(.94+.12*grain);
  alb*=mix(.93+.14*band.y,.92+.16*band.y,joint)*mix(1.,.96+.08*jt.z,joint*(1.-far));
  alb=mix(alb,alb*vec3(1.1,1.,.86),(1.-joint)*smoothstep(.5,.8,band.y));
  // rain marks under the ledges (short, by the face's own height)
  float streak=smoothstep(.55,.8,pn3(vec3(p.x*.2,p.y*.05,p.z*.2)+31.))*smoothstep(.4,.62,pn3(p*.02+17.));
  alb*=1.-.2*streak*joint;
  // lichen in gold and grey-green patches below the crown; moss in the joints of the lower face
  // (crisp patches a stride across near the eye; further off only their mean tint, so nothing speckles)
  float lk=pn3(p*.24+9.)*.65+pn3(p*.8+2.)*.35, lreg=smoothstep(.4,.62,pn3(p*.05+23.))*(1.-smoothstep(170.,240.,p.y));
  float lich=mix(smoothstep(.55,.61,lk),.22,smoothstep(.1,.5,px))*lreg;
  vec3 lcol=mix(vec3(.78,.6,.2),vec3(.5,.56,.42),smoothstep(.45,.55,pn3(p*.035+41.)));
  alb=mix(alb,lcol*(.75+.5*med),lich*.6);
  // moss where the lower face's blocks go back into their joints (in the relief's own hollows, as a soft stain)
  alb=mix(alb,vec3(.2,.36,.1),joint*(1.-smoothstep(.1,.5,jt.x))*smoothstep(.1,.6,upB+.3)*(1.-smoothstep(110.,170.,p.y))*smoothstep(.4,.62,pn3(p*.06+3.))*.5*(1.-far));
  float gph=dot(p.xz,uWind)*.3-uTime*1.9+uPhWave.x+3.5*pn2(p.xz*.022+uPhWave);
  float gwave=(.5+.5*sin(gph))*(.55+.45*sin(gph*.31+1.3+dot(p.xz,vec2(-uWind.y,uWind.x))*.05));
  alb=mix(alb,uGrass*(.5+.5*med+.5*big)*(1.+.3*(gwave-.3))*mix(vec3(1.),vec3(1.14,1.04,.66),smoothstep(.4,.7,pn3(p*.035+4.))),grass);
  alb*=mix(1.,.78,wet);
  // THE FACE'S WATERS (the part's thread; each given by its bearing and the heights it runs between): where one
  // comes down, the rock under it is dark and wet and the turf of a tread it crosses is dark wet turf, a ragged
  // way two to five metres broad. The white water itself hangs in the air, off the rock
  vec2 ax=p.xz-uAxis.xz; float seep=0.;
  for(int i=0;i<2;i++){ vec2 d=uWater[i].xy; seep=max(seep,(1.-smoothstep(.9,2.4+px,abs(ax.x*d.y-ax.y*d.x)+1.2*(pn3(p*.45+3.)-.5)))*step(0.,dot(ax,d))*smoothstep(uWater[i].z-1.5,uWater[i].z+.5,p.y)*(1.-smoothstep(uWater[i].w-1.,uWater[i].w+.5,p.y))); }
  alb*=mix(vec3(1.),vec3(.5,.56,.6),seep*joint);
  float rime=wet*smoothstep(.4,.75,pn3(p*.33+5.))*smoothstep(.1,.5,upB+.3*med)*.5;
  alb=mix(alb,uSnow*.9,rime);
  alb=mix(alb,uRockPale*(.9+.2*med),pale);
  alb=mix(alb,uSnow,snow);
  float bumpK=mix(mix(.55,.2,grass),.08,max(snow,pale))*mix(.5,1.,joint);
  vec3 Nb=bumpN(N,sx,sy,dFdx(h),dFdy(h),bumpK);
  float blockK=joint*(1.-grass)*(1.-.6*max(snow,pale));
  Nb=normalize(bumpN(Nb,sx,sy,dFdx(hb),dFdy(hb),blockK)+tilt*blockK);
  float sun=vDress.y*shapeShade(p)*cloudShade(p);
  float ao=vDress.z*(1.-.22*joint*(1.-smoothstep(.05,.45,jt.x))*(1.-far));
  vec3 col=peakLit(alb,Nb,p,sun,ao);
  // threads of water down the gullies of the face between the skirts and the crown: one meridian in four carries
  // one, a hand broad, shimmering on the world's clock. So thin a water is seen only from near: from further off
  // than a hand's breadth fills a third of a pixel's footprint it is lost in the face (the eye's own distance)
  float rr=max(length(ax),1.), tw=atan(ax.x,-ax.y+1e-5)*38., ti=floor(tw);
  float wm=abs(fract(tw)-.5-.2*sin(p.y*.21+ti*2.3))*rr/38.;
  float thread=step(.66,ph1(vec3(ti,3.,1.)))*(1.-smoothstep(.08,.22+px,wm))*smoothstep(58.,92.,p.y)*(1.-smoothstep(200.,222.,p.y))*joint*(1.-grass)*(1.-smoothstep(.6,.86,vDress.z))*(1.-smoothstep(.07,.2,px));
  col=mix(col,col*.6+(uSkyLow*1.2+uSunCol*.3*sun)*(.7+.3*sin(p.y*1.3+uTime*6.+ti*5.+uPhShim.x)),thread*.6);
  vec3 V=normalize(cameraPosition-p);
  // the wind-polished shapes: a soft sheen toward the sun, and the low sun caught along the edge of one seen against it
  col+=uSunCol*.2*(1.-joint)*sun*pow(max(dot(Nb,normalize(uSunDir+V)),0.),18.);
  col+=uSunCol*alb*.5*(1.-joint)*pow(clamp(1.-dot(Nb,V),0.,1.),3.)*smoothstep(-.2,.6,dot(-V,uSunDir))*step(0.,dot(N,uSunDir)+.35);
  // the level top takes the moon's silver as a soft sheen; snow takes a little of the low sun through it
  col+=uMoonCol*4.*pale*pow(max(dot(Nb,normalize(uMoonDir+V)),0.),14.);
  col+=uSunCol*.1*snow*max(dot(uSunDir,-V)*.5+.5,0.);
  gl_FragColor=vec4(peakAir(col,p),1.);
}`;function ut(s){const t=i=>new S.Color(i);return new S.ShaderMaterial({name:"PeakRock",vertexShader:ct,fragmentShader:ht,uniforms:{...s.uniforms,uRock:{value:t("#b3b5b8")},uRockWarm:{value:t("#c6bcab")},uRockPale:{value:t("#c9ccd4")},uGrass:{value:t("#6fae45")},uSnow:{value:t("#eef1f6").multiplyScalar(.92)},uWater:{value:[new S.Vector4(0,-1,1e5,1e5),new S.Vector4(0,-1,1e5,1e5)]}}})}async function ft(s,t,i){const p=[];for(let u=-8;u<70;u+=2.6)p.push(u);for(let u=70;u<200;u+=2.6)p.push(u);for(let u=200;u<262;u+=2.6)p.push(u);for(let u=262;u<357;u+=2)p.push(u);p.push(357.4);const j=[6.7,6,5,3.8,2.4,1,.02],b=(u,y)=>{const B=$(u,y),N=l=>3.5*Math.exp(-(((u-l)/1.9)**2)-(y/3.3)**2);return oe.TOP-2.2*O(5.4,7.3,B)+N(6.3)+N(-6.3)},v=p.length+j.length,L=304*v,g=new Float32Array(L*3),M=new Float32Array(L*3),T=i.sunDir,W=[5,11,20,32,48,70,100,140,190],z=[0,0,0,0],E=W.map(()=>[0,0,0,0]),V=new Float64Array(W.length),A=[0,0],_=u=>{t.coarseY(u,z);for(let y=0;y<W.length;y++){t.coarseY(u+T.y*W[y],E[y]);const B=(E[y][0]+t.spur.out-2)*1.000000001;V[y]=B*B}};for(let u=0;u<v;u++){const y=u<p.length;y&&_(p[u]);for(let B=0;B<304;B++){const N=B/304*360,l=N*U,e=(u*304+B)*3;let r,c,d;if(y){c=p[u];const o=t.radius(N,c);r=Math.sin(l)*o,d=-Math.cos(l)*o}else{const o=j[u-p.length];r=Math.sin(l)*o,d=-Math.cos(l)*o,c=b(r,d),_(c)}g[e]=r,g[e+1]=c,g[e+2]=d;let P=0;for(let o=0;o<W.length&&P<1;o++){const a=W[o],n=r+T.x*a,x=c+T.y*a,m=d+T.z*a;if(x>356)break;if(n*n+m*m>V[o])continue;const w=$(n,m),q=E[o][0];if(w+2>=q+t.spur.out)continue;const F=Math.atan2(n,-m)/U,Z=t.spurK(F);if(w+2>=q&&Z===0||(t.coarse01(F,E[o],Z,A),A[1]-2-w<-1e-6))continue;if(A[0]-2-w>7.000001){P=1;continue}const Y=t.coarseR(F,E[o],Z,t.ribK(F,x,Z))-2-w;Y>0&&(P=Math.max(P,O(0,7,Y)))}const k=t.spurK(N),K=t.ribK(N,c,k),h=le((t.coarseR(N,z,k,K)-$(r,d))/9,0,1);M[e]=1,M[e+1]=1-P,M[e+2]=le(1-.36*z[2]*(1-K)-.16*h,.4,1)}u%4===3&&await s.yield()}const D=new Uint32Array(304*(v-1)*6);let H=0;for(let u=0;u<v-1;u++)for(let y=0;y<304;y++){const B=(y+1)%304,N=u*304+y,l=u*304+B,e=(u+1)*304+y,r=(u+1)*304+B;D[H++]=N,D[H++]=l,D[H++]=e,D[H++]=l,D[H++]=r,D[H++]=e}const G=new S.BufferGeometry;G.setAttribute("position",new S.BufferAttribute(g,3)),G.setAttribute("aDress",new S.BufferAttribute(M,3)),G.setIndex(new S.BufferAttribute(D,1)),await s.yield();const R=new Float32Array(g.length),C=40*304*3;for(let u=0,y=Math.ceil(D.length/9)*3;u<D.length;u+=3){const B=D[u]*3,N=D[u+1]*3,l=D[u+2]*3,e=g[N]-g[B],r=g[N+1]-g[B+1],c=g[N+2]-g[B+2],d=g[l]-g[B],P=g[l+1]-g[B+1],k=g[l+2]-g[B+2],K=r*k-c*P,h=c*d-e*k,o=e*P-r*d;R[B]+=K,R[B+1]+=h,R[B+2]+=o,R[N]+=K,R[N+1]+=h,R[N+2]+=o,R[l]+=K,R[l+1]+=h,R[l+2]+=o,u%y===y-3&&await s.yield()}for(let u=0;u<R.length;u+=3){const y=Fe(R[u],R[u+1],R[u+2])||1;R[u]/=y,R[u+1]/=y,R[u+2]/=y}if(G.setAttribute("normal",new S.BufferAttribute(R,3)),R[C]*g[C]+R[C+2]*g[C+2]<0){for(let u=0;u<D.length;u+=3){const y=D[u+1];D[u+1]=D[u+2],D[u+2]=y}for(let u=0;u<R.length;u++)R[u]=-R[u]}await s.yield();const I=[];for(let u=2;u<p.length;u++)if(!(p[u]<62||p[u]>192))for(let y=0;y<304;y++){const B=(u*304+y)*3;R[B+1]>.74&&I.push([g[B],g[B+1],g[B+2]])}return G.computeBoundingSphere(),{geometry:G,sites:I,triangles:D.length/3,capY:b}}const ot={stands:[[8,22],[36,48],[62,75]],windows:[[22,36],[48,62]],sill:15,mouth:40,bay:60,shade0:12,shade1:60,shadeK:1,floor:.1,feet:.62,all:0,near:50};async function dt(s,t,i,f,p,j,b){const v=[],L=f[0],g=f[1],M=.6,T=ot,W=[],z=(o,a)=>(Math.atan2(o-L,-(a-g))/U+360)%360;if(b)for(const o of b)o[1]>=ve.y0&&o[1]<=ve.y1&&W.push({x:o[0],y:o[1],z:o[2],r:$(o[0]-L,o[2]-g),b:z(o[0],o[2]),s:W.length*3});const E=o=>{let a=null,n=2;for(const x of W){const m=Math.abs(x.b-o);m<n&&(n=m,a=x)}return a},V=(o,a,n,x)=>{for(const m of W){if(a<=m.y-T.sill)continue;const w=m.x-L,q=m.z-g,F=((o-L)*w+(n-g)*q)/(w*w+q*q);if(F<1&&$(o-L-w*Math.max(F,0),n-g-q*Math.max(F,0))<=.55*x)return!0}return!1},A=(o,a,n)=>{const x=E(z(o,n));return!!x&&$(o-L,n-g)<x.r&&a>x.y-T.sill},_=(o,a,n,x)=>{const m=z(o,n),w=$(o-L,n-g);for(const q of T.windows){const F=E(le(m,q[0],q[1]));if(F&&Math.max(0,q[0]-m,m-q[1])*U*w<=x&&w+x>F.r&&a>F.y-T.sill)return!0}return!1},D=(o,a,n,x)=>{for(const m of W){if(m.s>T.mouth+3)break;if(a<m.y&&$(o-L,n-g)>m.r&&$(o-m.x,n-m.z)-.55*x<T.bay)return!0}return!1},H=(o,a,n,x)=>{let m=1e9;if(b)for(const w of b)w[1]>a-14&&w[1]<a+x*M*1.25+16&&(m=Math.min(m,$(o-w[0],n-w[2])-.55*x));return m},G=(o,a,n,x,m)=>{const w=L+Math.sin(o*U)*a,q=g-Math.cos(o*U)*a;if(_(w,n+x*M*1.25,q,0)||D(w,n,q,x))return;let F=x;for(let Z=0;Z<8&&(H(w,n,q,F)<20||V(w,n+F*M*1.25,q,F));Z++)F*=.86;F>=30&&H(w,n,q,F)>=20&&!V(w,n+F*M*1.25,q,F)&&v.push([w,n,q,F,m])},R=14,C=p>.5?15:13,I=9,u=t.range(0,360);for(let o=0;o<R;o++)G(u+o*360/R+t.range(-6,6),t.range(90,108),oe.CROWN0+t.range(-8,6),t.range(112,134),"inner");for(let o=0;o<I;o++){const a=t.range(56,68),n=t.range(228,240);G(u+11+o*360/I+t.range(-8,8),pe(n+20)+.42*a,n,a,"collar")}for(let o=0;o<C;o++)G(u+17+o*360/C+t.range(-11,11),t.range(166,212)+14*p,oe.CROWN0+t.range(-6,20),t.range(92,136)*(1+.14*p),"outer");const y=p>.5?4:3;for(let o=0;o<y;o++)G(Ye+t.range(-7,7),268+o*(152/(y-1))+t.range(-10,10),oe.CROWN0+15+o*4,se(116,72,o/y)*t.range(.9,1.1),"tongue");if(b){const o=b.length,a=T.stands.reduce((n,x)=>n+x[1]-x[0],0);for(let n=0;n<7;n++){let x=(n+t.range(.15,.85))/7*a,m=T.stands[0][0],w=0,q=1e9;for(const re of T.stands){if(x<=re[1]-re[0]){m=re[0]+x;break}x-=re[1]-re[0],m=re[1]}for(let re=0;re<o;re++){const de=Math.abs(z(b[re][0],b[re][2])-m);b[re][1]>=ve.y0&&de<q&&(q=de,w=re)}const F=b[w],Z=$(F[0]-L,F[2]-g)||1,Y=(F[0]-L)/Z,te=(F[2]-g)/Z,X=t.range(64,98),Q=t.range(40,58),ae=.55*X+t.range(22,36),ee=.55*Q+t.range(20,27),J=Math.max(oe.CROWN0-8,F[1]-X*M*t.range(.35,.7));let ne=0;for(;ne<80&&(D(F[0]+Y*(ae+ne),J,F[2]+te*(ae+ne),X)||H(F[0]+Y*(ae+ne),J,F[2]+te*(ae+ne),X)<20);)ne+=4;v.push([F[0]+Y*(ae+ne),J,F[2]+te*(ae+ne),X,"wall"]),n%2===0&&t.range(.6,1.1)}}const B={sunDirection:i.sunDir,sunColor:i.sun,litColor:"#fbf3e2",shadeColor:"#9292c4",bottomColor:new S.Color(i.rose).lerp(new S.Color("#b98fb4"),.35)},N=[[L,352,g,9,150,104]];if(b){const o=Math.min(15,b.length);for(let a=0;a<o;a++){const n=b[Math.round(a*(b.length-1)/Math.max(1,o-1))];N.push([n[0],n[1],n[2],20])}}await s.yield();const l=Ze({rng:t,mode:"cumulus",at:v,height:M,puffs:Math.round(44*(.7+.3*j)),wind:[0,0,0],avoid:N,opacity:.92,...B,nearFade:[.02,.05],farFade:[9e3,12e3],fogFade:.35,silver:.9,erode:1,softness:.32,bump:1.25,renderOrder:8}),e=l.puffs.geometry.attributes.iPos.data.array,r=l.count,c=new Float32Array(r*6),d=N.slice(0,1),P=new Float32Array(r*2),k={lane:0,window:0,face:0};await s.yield();let K=1e9;for(let o=0;o<r;o++)K=Math.min(K,e[o*12+1]-20-.78*1.045*e[o*12+3]);const h=[];if(b)for(const o of b)o[1]>=K&&h.push(o[0],o[1],o[2]);for(let o=0;o<r;o++){(o&255)===255&&await s.yield();const a=o*12,n=e[a],x=e[a+1],m=e[a+2];let w=e[a+3],q=1e9;const F=.78*1.045*w;let Z=1e18;for(let X=0;X<h.length;X+=3){const Q=n-h[X],ae=x-h[X+1],ee=m-h[X+2],J=Q*Q+ae*ae+ee*ee;J<Z&&(Z=J)}Z=Math.sqrt(Z);const Y=Z-20<F?"lane":_(n,x+F,m,F)?"window":A(n,x+F,m)?"face":"";if(P[o*2]=w,P[o*2+1]=e[a+5],Y){k[Y]++,P[o*2]=.001,e[a+3]=.001,e[a+6]=0,c.set([n,x,m,.001,e[a+7],0],o*6);continue}for(const X of d){let Q;if(X.length<5)Q=Fe(n-X[0],x-X[1],m-X[2])-X[3];else{const ae=le((X[1]-x)/Math.max(X[1]-X[4],.001),0,1),ee=$(n-X[0],m-X[2])-se(X[3],X[5],ae),J=Math.max(x-X[1],X[4]-x);Q=J>0?$(Math.max(ee,0),J):ee}q=Math.min(q,Q)}const te=le(q/(w*.78),0,1);c.set([n,x,m,w*Math.max(te,.3),e[a+7],O(.3,.95,te)],o*6)}return{crown:l,heaps:v,veil:c,state:P,out:k,cl:W}}async function pt(s,t,i,f,p,j){const b=ot,v=t.crown.puffs.geometry.attributes.iPos.data.array,L=t.crown.count,g=t.state,M=i.sunDir,T=t.crown.material,W=l=>l.toFixed(3),z=[[0,"float big = max(cloudTone(iNrm.xyz, back, uSunDir) - iData.y, uLight.x);",`float pkS = floor(iData.y)/15., pkO = fract(iData.y); float big = max(cloudTone(iNrm.xyz, back, uSunDir) - pkO - pkS*${W(b.shadeK)}, mix(uLight.x, ${W(b.floor)}, pkS));`],[0,"float crest = clamp(1. - iData.y*5., 0., 1.);","float crest = clamp(1. - (pkO + pkS)*5., 0., 1.);"],[0,"vData = vec4(seed, big, iData.z*fade, iData.w);","vData = vec4(seed, big + 4.*floor(iData.y), iData.z*fade, iData.w);"],[1,"float light = max(vData.y + dot(N, uSunDir)","float pkS = floor(vData.y*.25)/15., pkT = vData.y - 4.*floor(vData.y*.25); float light = max(pkT + dot(N, uSunDir)"],[1,"vec3 col = mix(mix(uBottom, uShade, smoothstep(-.5, .7, vNrm.y + N.y*.5)), uLit, light);",`vec3 col = mix(mix(uBottom, uShade, smoothstep(-.5, .7, vNrm.y + N.y*.5)), uLit, light); col = mix(col, uShade*mix(${W(b.feet)}, 1., smoothstep(-.4, .5, vNrm.y + N.y*.5 - (lump - .5))), pkS*(1. - light));`]],E=[T.vertexShader,T.fragmentShader],V=z.every(([l,e])=>E[l].split(e).length===2);if(V){for(const[l,e,r]of z)E[l]=E[l].replace(e,r);T.vertexShader=E[0],T.fragmentShader=E[1]}t.packed=V;const A=p[0],_=p[1],D=new Float32Array(L*4),H=[],G=[5,11,20,32,48,70,100,140,190];for(let l=0;l<L;l++){const e=l*12;D[l*4]=v[e],D[l*4+1]=v[e+1],D[l*4+2]=v[e+2],D[l*4+3]=g[l*2]>.01?.62*t.veil[l*6+3]:0}const R=new S.Vector3(M.z,0,-M.x).normalize(),C=new Float32Array(L),I=[];let u=0;for(let l=0;l<L;l++)C[l]=D[l*4]*R.x+D[l*4+2]*R.z,D[l*4+3]>0&&(I.push(l),u=Math.max(u,D[l*4+3]));I.sort((l,e)=>C[l]-C[e]);let y=0;for(let l=0;l<L;l++){if(D[l*4+3]<=0)continue;const e=D[l*4],r=D[l*4+1],c=D[l*4+2],d=.75*g[l*2];let P=1;if(!b.all){let m=1e18;for(const w of t.cl){const q=e-w.x,F=r-w.y,Z=c-w.z,Y=q*q+F*F+Z*Z;Y<m&&(m=Y)}P=1-O(b.near,b.near+80,Math.sqrt(m))}if(P<=0){V&&(g[l*2+1]=Math.min(g[l*2+1],.99),v[l*12+5]=g[l*2+1]);continue}++y%150===0&&await s.yield(),H.length=0;let k=0,K=I.length;const h=C[l]-u-.01,o=C[l]+u+.01;for(;k<K;){const m=k+K>>1;C[I[m]]<h?k=m+1:K=m}for(let m=k;m<I.length&&C[I[m]]<=o;m++){const w=I[m],q=D[w*4+3];if(w===l)continue;const F=D[w*4]-e,Z=D[w*4+1]-r,Y=D[w*4+2]-c,te=F*M.x+Z*M.y+Y*M.z;if(te+q<=d)continue;const X=F*F+Z*Z+Y*Y-te*te;if(X>=q*q)continue;const Q=Math.sqrt(q*q-X),ae=Math.max(d,te-Q),ee=te+Q;ee>ae&&H.push([ae,ee])}let a=0,n=-1e9;H.sort((m,w)=>m[0]-w[0]);for(const m of H)m[1]>n&&(a+=m[1]-Math.max(m[0],n),n=m[1]);for(const m of G){const w=e-A+M.x*m,q=r+M.y*m,F=c-_+M.z*m;if(q>356)break;if($(w,F)+2<f.coarse(Math.atan2(w,-F)/U,q)){a+=1e3;break}}const x=O(b.shade0,b.shade1,a)*P;g[l*2+1]=V?Math.round(x*15)+Math.min(g[l*2+1],.99):Math.max(g[l*2+1],.85*x),v[l*12+5]=g[l*2+1]}const B=new Map,N=l=>v[l]*4099+v[l+1]*71+v[l+2];for(let l=0;l<L;l++)B.set(N(l*12),l);t.retouch=()=>{for(let l=0,e=L*12;l<e;l+=12){const r=B.get(N(l));r!==void 0&&(g[r*2]<.01&&(v[l+3]=g[r*2],v[l+6]=0),v[l+5]=g[r*2+1])}}}const ie={shore0:1500,shore1:1600,top:236,base:192,far:5200},mt=`
attribute float aPart;
varying vec3 vW, vN; varying float vPart;
void main(){ vec4 wp=modelMatrix*vec4(position,1.); vW=wp.xyz; vN=normalize(mat3(modelMatrix)*normal); vPart=aPart; gl_Position=projectionMatrix*viewMatrix*wp; }`,vt=`
uniform vec3 uRose; uniform vec2 uSeaPh;
varying vec3 vW, vN; varying float vPart;
${Ee}
// the height of the heaped tops at a place (0..1): broad heaps with a finer boil on them, drifting slowly
// downwind and turning over on the world's clock
float heap(vec2 q){
  vec2 w=q-uWind*uTime*12.+uSeaPh*40.;
  float a=pfbm2(w*.0031+vec2(0.,uTime*.02)), b=pn2(w*.0105+vec2(uTime*.08,7.));
  return clamp(smoothstep(.28,.78,a)*.72+.28*b,0.,1.);
}
void main(){
  vec3 p=vW, V=normalize(p-cameraPosition), Ng=normalize(vN);
  float top=smoothstep(.5,.9,vPart), under=1.-smoothstep(.02,.3,vPart);
  // the tops: light by the heaps' own slopes (the step widens with the eye's distance, so far tops stay calm)
  float e=18.+.012*length(p.xz-cameraPosition.xz);
  float h0=heap(p.xz), hx=heap(p.xz+vec2(e,0.)), hz=heap(p.xz+vec2(0.,e));
  vec3 Nt=normalize(vec3(-(hx-h0)*46./e,1.,-(hz-h0)*46./e));
  vec3 N=normalize(mix(Ng,Nt,top));
  float sl=dot(N,uSunDir), lit=smoothstep(-.12,.55,sl)*mix(.55,1.,h0);
  vec2 hd=normalize(V.xz+vec2(1e-5,0.));
  float sunAz=clamp(dot(hd,normalize(uSunDir.xz))*.5+.5,0.,1.), moonAz=clamp(dot(hd,normalize(uMoonDir.xz)),0.,1.);
  vec3 shade=mix(uCloudShade*.86,uRose,.2+.35*sunAz)*mix(.66,1.,h0);
  vec3 col=mix(shade,uCloudLit*mix(vec3(1.),uSunCol*1.15,.45),lit);
  // the low sun's gold road on the tops under it; the moon's silver on those under the moon
  // (the road shimmers as the tops under it turn over, on the world's clock)
  float shim=smoothstep(.36,.74,pn2(p.xz*.005+uTime*vec2(.21,.12)+uSeaPh)*.5+pn2(p.xz*.016-uTime*vec2(.4,.25)+uSeaPh.yx)*.5);
  col+=uSunCol*(.55*pow(sunAz,6.)+.12*pow(sunAz,2.))*top*(.35+.65*h0)*smoothstep(-.05,.3,sl+.25)*(.66+.7*shim);
  float glint=smoothstep(.5,.78,pn2(p.xz*.006+uTime*vec2(.09,.05)-uSeaPh)*.5+pn2(p.xz*.019-uTime*vec2(.2,.12)-uSeaPh.yx)*.5);
  col+=uMoonCol*3.2*pow(moonAz,5.)*top*(.3+.7*h0)*(.45+1.5*glint);
  // the shore's face and the underside: lilac, rose toward the sun, the sun coming through the bank's thin rim
  float thin=smoothstep(.3,.62,vPart)*(1.-top);
  vec3 low=mix(uCloudShade*.82,uRose*.9,.2+.5*sunAz)*(.8+.3*pn2(p.xz*.004+3.));
  low+=uSunCol*.9*pow(clamp(dot(V,uSunDir),0.,1.),3.)*thin;
  low=mix(low,uCloudLit*mix(vec3(1.),uSunCol*1.15,.45),smoothstep(.05,.6,dot(Ng,uSunDir))*(.35+.65*smoothstep(.15,.5,vPart)));
  col=mix(low,col,top);
  col=mix(col,low*.86,under);
  // THE BANK'S FOOT STANDS IN THE LAND'S FAR AIR: the shore's lower face and the sheet's underside go into the air's
  // own colour with distance (the colour the land's far edge and the sky's horizon go into), so the bank rises out
  // of the haze and no line lies under it
  float dA=length(p.xz-cameraPosition.xz), foot=1.-smoothstep(.1,.66,vPart+.2*(pn2(p.xz*.004+11.)-.5));
  // AND THE WHOLE BANK STANDS BEHIND 1500 M AND MORE OF AIR. The air thins with height (by half every 70 m); what a
  // sight line gathers of it is its length times the air's mean thickness between the eye's height and the place's.
  // Seen from the fields, through the low thick air, the bank and its rim go about three quarters into the horizon's
  // own colour, from the climb a half falling to a third, and no hard rim stands against the sky; seen from above
  // the crown, through thin air, the tops near the shore stay nearly clear, those 1000 m past the shore go a third
  // into it and the sheet's far edge a half and more
  float ea=exp(-max(cameraPosition.y,0.)/100.), eb=exp(-max(p.y,0.)/100.), dy=p.y-cameraPosition.y;
  float thick=abs(dy)<1. ? ea : 100.*(ea-eb)/dy;
  float veil=1.-exp(-length(p-cameraPosition)*thick/400.);
  col=mix(col,mix(uFogAway,uFogSun,sunAz*sunAz),max(foot*(1.-exp(-dA*dA/810000.)),veil));
  gl_FragColor=vec4(peakAir(col,p),1.);
}`;function gt(s,t={}){const{hour:i,light:f,rng:p,noise:j,origin:b=[oe.AX,oe.AZ]}=t,v=192,L=[[-16,ie.base,0],[-24,ie.base+12,.2],[-22,ie.base+28,.42],[-10,ie.top-6,.62],[0,ie.top,.8],[26,ie.top,1],[60,ie.top,1],[105,ie.top,1],[165,ie.top,1],[245,ie.top,1],[350,ie.top,1],[500,ie.top,1],[720,ie.top,1],[1040,ie.top,1],[1500,ie.top,1],[2150,ie.top,1],[2900,ie.top,1],[3650,ie.top,1]],g=[[-16,ie.base,0],[300,ie.base-4,0],[1400,ie.base-4,0],[3650,ie.base-4,0]],M=y=>Math.abs(((y+180)%360+360)%360-180),T=p.range(0,60),W=p.range(0,60),z=y=>{const B=y*U,N=j.fbm2(Math.sin(B)*1.6+T,Math.cos(B)*1.6+W,2),l=Math.max(1-O(10,34,M(y-i.sunAz)),1-O(10,30,M(y-i.moonAz)));return se(le(1550+75*N,ie.shore0,ie.shore1),ie.shore1,l)},E=[],V=[],A=[],_=(y,B)=>{const N=E.length/3;for(let l=0;l<y.length;l++)for(let e=0;e<v;e++){const r=e/v*360,c=r*U,d=z(r)+y[l][0],P=b[0]+Math.sin(c)*d,k=b[1]-Math.cos(c)*d,K=y[l][2]>.5?(26*j.fbm2(P/190+T,k/190+W,3)+10*j.n2(P/62+W,k/62+T))*y[l][2]*(1-.5*O(600,3e3,y[l][0])):4*j.n2(P/90+T,k/90);E.push(P,y[l][1]+K,k),V.push(y[l][2])}for(let l=0;l<y.length-1;l++)for(let e=0;e<v;e++){const r=(e+1)%v,c=N+l*v+e,d=N+l*v+r,P=N+(l+1)*v+e,k=N+(l+1)*v+r;B?A.push(c,d,P,d,k,P):A.push(c,P,d,d,P,k)}};_(L,!0),_(g,!1);const D=new S.BufferGeometry;D.setAttribute("position",new S.Float32BufferAttribute(E,3)),D.setAttribute("aPart",new S.Float32BufferAttribute(V,1)),D.setIndex(A),D.computeVertexNormals();const H=new S.ShaderMaterial({name:"PeakFarSea",vertexShader:mt,fragmentShader:vt,uniforms:{...f.uniforms,uRose:{value:new S.Color(i.rose)},uSeaPh:{value:new S.Vector2(0,0)}},side:S.DoubleSide}),G=new S.Mesh(D,H);G.name="far sea",G.frustumCulled=!1;const R=new S.Group;R.name="farSea",R.add(G);const C=[],I=p.int(8,12);for(let y=0,B=0;y<I&&B<200;B++){const N=p.range(0,360),l=p.range(2200,3400),e=p.range(650,950);M(N-i.sunAz)<44||M(N-i.moonAz)<48||M(N)<20||C.some(r=>$(r[0]-b[0]-Math.sin(N*U)*l,r[2]-b[1]+Math.cos(N*U)*l)<1300)||(C.push([b[0]+Math.sin(N*U)*l,ie.top-40,b[1]-Math.cos(N*U)*l,e]),y++)}const u=Ze({rng:p,mode:"cumulus",at:C,height:1.1,puffs:44,wind:[0,0,0],opacity:.95,sunDirection:i.sunDir,sunColor:i.sun,litColor:"#f6f1e6",shadeColor:"#a9a8c8",bottomColor:i.rose,nearFade:[.02,.05],farFade:[2e4,24e3],fogFade:.45,silver:1,erode:1,softness:.32,bump:1.25,noiseTexture:t.noiseTexture});return R.add(u.object),H.uniforms.uSeaPh.value.set(p.range(0,97),p.range(0,97)),{object:R,mesh:G,towers:u,shoreAt:z,triangles:A.length/3+u.triangles,update(y,B,N){u.update(y,B,N)}}}const wt={arc:40,clear:3,reach:.9,silver:1.2};function xt(s,t={}){const{hour:i,light:f,rng:p,origin:j,route:b}=t,v=wt,L=C=>Math.abs(((C+180)%360+360)%360-180),g=Math.sin(i.moonAz*U),M=-Math.cos(i.moonAz*U),T=Math.tan((tt-Ie-v.clear)*U),W=Math.tan(v.clear*U),z=[];if(b)for(let C=0;C<b.length;C+=5)z.push(b[C]);const E=(C,I,u)=>{const y=ie.top-40+520;for(const B of z){const N=C-B[0],l=I-B[2],e=N*g+l*M;if(e>0&&Math.abs(N*M-l*g)<v.reach*u+e*W&&B[1]+e*T<y)return!0}return!1},V=[],A=p.int(3,4);for(let C=0,I=0;C<A&&I<600;I++){const u=i.moonAz+p.range(-v.arc,v.arc),y=p.range(2400,3e3),B=p.range(500,700),N=j[0]+Math.sin(u*U)*y,l=j[1]-Math.cos(u*U)*y;L(u)<20||V.some(e=>$(e[0]-N,e[2]-l)<650)||E(N,l,B)||(V.push([N,ie.top-40,l,B]),C++)}const _=new S.Group;_.name="moonHeaps";const D=f.uniforms.uMoonCol.value.clone().multiplyScalar(v.silver),H=new S.Vector2(g,M),G=[],R=[["uniform float uTime, uSilver, uFogFade;","uniform vec3 uMoonSilver; uniform vec2 uMoonAz; uniform float uTime, uSilver, uFogFade;"],["col += uSunColor*(uSilver*rim);","col += uSunColor*(uSilver*rim); col += uMoonSilver*pow(clamp(dot(normalize(vWorld.xz - cameraPosition.xz), uMoonAz), 0., 1.), 5.)*smoothstep(.1, .8, vNrm.y + N.y*.4);"]];for(const C of V){const I=Ze({rng:p,mode:"cumulus",at:[C],height:(400-.14*C[3])/C[3],puffs:36,wind:[0,0,0],opacity:.95,sunDirection:i.sunDir,sunColor:i.sun,litColor:"#f6f1e6",shadeColor:"#a9a8c8",bottomColor:i.rose,nearFade:[.02,.05],farFade:[2e4,24e3],fogFade:.45,silver:1,erode:1,softness:.32,bump:1.25,noiseTexture:t.noiseTexture}),u=I.material;if(R.every(([y])=>u.fragmentShader.split(y).length===2)){for(const[y,B]of R)u.fragmentShader=u.fragmentShader.replace(y,B);u.uniforms.uMoonSilver={value:D},u.uniforms.uMoonAz={value:H}}_.add(I.object),G.push(I)}return{object:_,fields:G,at:V,triangles:G.reduce((C,I)=>C+I.triangles,0),update(C,I,u){for(const y of G)y.update(C,I,u)}}}const bt=`
attribute vec4 iA, iB, iC;
uniform float uTime; uniform vec2 uWind; uniform vec3 uSunDir;
varying vec2 vUv; varying vec4 vK; varying vec3 vW;
void main(){
  float len=max(iA.w,1.), s=fract(iC.x+uTime*iC.y/len);
  vec3 c=iA.xyz+vec3(uWind.x,0.,uWind.y)*(s*len)+iB.xyz;
  float fade=smoothstep(0.,.1,s)*(1.-smoothstep(.88,1.,s));
  vec3 right=vec3(viewMatrix[0][0],viewMatrix[1][0],viewMatrix[2][0]), up=vec3(viewMatrix[0][1],viewMatrix[1][1],viewMatrix[2][1]);
  float size=iB.w*(1.+.06*sin(uTime*.4+iC.z*40.));
  vUv=position.xy*2.;
  vW=c+(right*position.x+up*position.y*.62)*size*2.;
  // the eye inside a shred's own two and a half metres: it thins to nothing there, as any mist does
  fade*=smoothstep(.6,2.5,distance(c,cameraPosition)-size*.5);
  vK=vec4(iC.z,fade*iC.w,clamp(.5+.5*dot(normalize(iB.xyz+vec3(0.,.01,0.)),uSunDir),0.,1.),s);
  gl_Position=projectionMatrix*viewMatrix*vec4(vW,1.);
  if(fade<=0.) gl_Position=vec4(2.,2.,2.,1.);
}`,yt=`
uniform vec3 uRose;
varying vec2 vUv; varying vec4 vK; varying vec3 vW;
${Ee}
void main(){
  float r=length(vUv);
  // a shred is a soft torn wisp, never a disc: its edge is where a warped noise runs out
  vec2 q=vUv*1.25+vK.x*vec2(37.1,11.7)+vec2(-uTime*.045,uTime*.02);
  float n=pfbm2(q+.9*vec2(pn2(q*1.7+3.),pn2(q*1.7+9.)));
  float body=1.-smoothstep(.1,1.,r+(n-.5)*1.1);
  float a=body*body*vK.y;
  if(a<.008) discard;
  // lit toward the sun, lilac away from it, rose underneath; a bright thin rim where the sun or the moon comes through
  float light=clamp(vK.z*.7+.3+.4*(n-.5)-.25*vUv.y*(1.-vK.z),0.,1.);
  vec3 col=mix(mix(uRose,uCloudShade,smoothstep(-.6,.3,vUv.y)),uCloudLit*mix(vec3(1.),uSunCol*1.15,.4),smoothstep(.2,.8,light));
  vec3 V=normalize(vW-cameraPosition);
  float thin=1.-body;
  col+=uSunCol*.6*pow(clamp(dot(V,uSunDir),0.,1.),4.)*thin+uMoonCol*1.5*pow(clamp(dot(V,uMoonDir),0.,1.),6.)*thin;
  gl_FragColor=vec4(peakAir(col,vW),a);
}`;function Mt(s,t={}){const{hour:i,light:f,rng:p,origin:j=[oe.AX,oe.AZ],route:b=null,lane:v=null}=t,L=t.rngScud||p,g=t.rngUpper||p,M=t.rngMist||p,T=f.uniforms.uWind.value.x,W=f.uniforms.uWind.value.y,z=-W,E=T,V=[],A=[],_=[],D=[],H=(N,l,e,r)=>{let c=1e9,d=1e18;if(b)for(const P of b){const k=le((P[0]-N)*T+(P[2]-e)*W,0,r),K=P[0]-N-T*k,h=P[1]-l,o=P[2]-e-W*k,a=K*K+h*h+o*o;if(a>d)continue;const n=Fe(K,h,o);n<c&&(c=n,d=a*1.0000001)}return c},G=(N,l,e,r,c,d,P,k,K,h,o,a=p)=>{for(let n=0;n<P;n++){const x=a.range(0,we),m=k*Math.sqrt(a());V.push(N,l,e,r),A.push(Math.cos(x)*m,a.range(-1,1)*k*h,Math.sin(x)*m,K*a.range(.75,1.2)),_.push(d,c,a(),o)}},R=p.int(12,je);for(let N=0;N<R;N++){const l=p.range(250,1300)*(p.chance(.6)?1:-1),e=Math.sqrt(1700*1700-l*l),r=p.range(205,245),c=p.range(35,70),d=j[0]+z*l-T*e,P=j[1]+E*l-W*e,k={x:d,y:r,z:P,len:2*e,speed:p.range(7,9),phase:p(),r:c*.5};D.push(k),G(d,r,P,k.len,k.speed,k.phase,8,c*.36,c*.34,.22,.85)}for(let N=0,l=0;N<56&&l<500;l++){const e=L,r=e.range(52,270)*e.sign(),c=e.range(258,296),d=j[0]+z*r-T*260,P=j[1]+E*r-W*260,k=e.range(20,36);H(d,c,P,760)<k+16||(G(d,c,P,760,e.range(12,17),e(),4,k*.75,k,.3,.75,e),N++)}for(let N=0,l=0;N<40&&l<400;l++){const e=g,r=e.range(-160,280),c=Math.abs(r)<110,d=c?140:-260,P=780-d,k=e.range(288,346),K=e.range(18,34),h=j[0]+z*r+T*d,o=j[1]+E*r+W*d;H(h,k,o,P)<K+16||(G(h,k,o,P,e.range(12,17),e(),4,K*.75,K,.3,.7,e),N++)}if(v)for(let N=0,l=0;N<8&&l<120;l++){const e=M,r=v[e.int(0,v.length-1)],c=e.sign(),d=e.range(15,26),P=e.range(40,70),k=e.range(7,11),K=r[0]+z*c*d-T*P*.5,h=r[1]+e.range(-8,10),o=r[2]+E*c*d-W*P*.5;H(K,h,o,P)<k+10||(G(K,h,o,P,e.range(2,4),e(),2,k*.6,k,.4,.38,e),N++)}const C=new S.PlaneGeometry(1,1),I=new S.InstancedBufferGeometry;I.index=C.index,I.setAttribute("position",C.attributes.position),I.setAttribute("iA",new S.InstancedBufferAttribute(new Float32Array(V),4)),I.setAttribute("iB",new S.InstancedBufferAttribute(new Float32Array(A),4)),I.setAttribute("iC",new S.InstancedBufferAttribute(new Float32Array(_),4)),I.instanceCount=V.length/4;const u=new S.ShaderMaterial({name:"PeakDrift",vertexShader:bt,fragmentShader:yt,uniforms:{...f.uniforms,uRose:{value:new S.Color(i.rose)}},transparent:!0,depthWrite:!1}),y=new S.Mesh(I,u);y.name="drift cloud",y.frustumCulled=!1,y.renderOrder=9,f.uniforms.uCloudN.value=D.length;const B=N=>{for(let l=0;l<D.length;l++){const e=D[l],r=(e.phase+N*e.speed/e.len)%1,c=O(0,.1,r)*(1-O(.88,1,r));f.uniforms.uCloudP.value[l].set(e.x+T*r*e.len,e.y,e.z+W*r*e.len,e.r*(.4+.6*c)*(c>0?1:0))}};return B(0),{object:y,small:D,count:V.length/4,update(N,l){B(l)}}}const zt=`
attribute vec3 aK; attribute vec4 aArc;
varying vec3 vK, vW;
void main(){
  vK=aK; vec3 wp=(modelMatrix*vec4(position,1.)).xyz;
  // (a hanging water is one strip along its arc, turned about the arc toward the eye, as the west fall's body is)
  if(aK.z<.5) wp+=normalize(cross(aArc.xyz,cameraPosition-wp))*aK.x*aArc.w;
  vW=wp; gl_Position=projectionMatrix*viewMatrix*vec4(wp,1.);
}`,At=`
uniform float uPhase;
varying vec3 vK, vW;
${Ee}
void main(){
  // vK: across the water (-1..1), metres fallen along its arc (from a place dealt to each water), and 1 on the
  // spray's cards (on the water itself: half of how far down its leap it is)
  float s=vK.x, run=vK.y, t=uTime+uPhase;
  float sun=peakShade(vW), a;
  vec3 col=uCloudLit*(uSkyLow*1.5+uSunCol*.85*sun);
  if(vK.z>.5){
    // the spray where it lands: a soft breathing puff
    float r=length(vec2(s,run));
    a=(1.-smoothstep(.15,1.,r+.35*(pfbm2(vec2(s,run)*2.+vec2(0.,-t*.7))-.5)))*.34;
  } else {
    float streak=pfbm2(vec2(s*2.2+3.*pn2(vec2(run*.05,7.)),run*.22-t*2.3))*.6+pn2(vec2(s*5.,run*.7-t*5.))*.4;
    float tau=vK.z*2.04;
    // (it leaves the lip whole and is drawn out into strands as it falls and spreads)
    a=smoothstep(.22+.14*tau,.56+.1*tau,streak+.3*(1.-abs(s)))*pow(max(1.-s*s,0.),.7)*smoothstep(0.,.05,tau)*(.92-.3*tau);
    col*=.8+.35*streak;
  }
  if(a<.01) discard;
  gl_FragColor=vec4(peakAir(col,vW),a);
}`;function kt(s,t,i,f,p,j,b){const v=i.spur,L=v.b-v.w*s.range(.25,.45),g=v.y[2]+s.range(10,14),M=s.range(0,60),T=9.81,W=[],z=[],E=[],V=[],A=[],_=[],D=(u,y,B)=>{const N=Math.ceil((B-y)*4)+1,l=new Float32Array(N);for(let e=0;e<N;e++)l[e]=i.radius(u,y+e*.25);return e=>{const r=le((e-y)*4,0,N-1.001),c=Math.floor(r);return se(l[c],l[c+1],r-c)}},H=(u,y,B)=>{let N=1e9,l=1e18;if(b)for(const e of b){const r=u+j[0]-e[0],c=y-e[1],d=B+j[1]-e[2],P=r*r+c*c+d*d;if(P>l)continue;const k=Fe(r,c,d);k<N&&(N=k,l=P*1.0000001)}return N},G=(u,y,B,N,l,e,r,c=!1)=>{const d=u*U,P=Math.sin(d),k=-Math.cos(d),K=y(B)+.3;let h=0,o=0,a=1e9;for(let Q=.6;Q<14;Q+=.1){let ae=0,ee=0;for(let J=.3;J<4;J+=.03){const ne=B-.5*T*J*J,re=K+Q*J;if(ne<l)break;if(re<y(ne)+.25){N(ne,re)&&(ae=J,ee=ne);break}}if(ae&&(h===0||c&&ee<a-.5)&&(h=Q,o=ae,a=ee,!c))break}if(h===0)return null;const n=14,x=[];let m=r,w=0,q=0,F=1e9;for(let Q=0;Q<=n;Q++){const ae=Math.pow(Q/n,.8),ee=o*ae,J=K+h*ee,ne=B-.5*T*ee*ee,re=$(h,T*ee)||1,de=se(1,e/2,ae*ae*(3-2*ae));Q>0&&(m+=$(J-w,ne-q)),w=J,q=ne,x.push([P*J,ne,k*J,P*h/re,-T*ee/re,k*h/re,de,m,ae]),F=Math.min(F,H(P*J,ne,k*J)-de)}if(F<20)return null;const Z=W.length/3;x.forEach((Q,ae)=>{for(const ee of[-1,1])W.push(Q[0],Q[1],Q[2]),E.push(Q[3],Q[4],Q[5],Q[6]),z.push(ee,Q[7],Q[8]*.49);if(ae>0){const ee=Z+(ae-1)*2;V.push(ee,ee+2,ee+1,ee+1,ee+2,ee+3)}});const Y=x[n],te=.8*e,X=[Y[0],Y[1]+.4*te,Y[2]];for(let Q=0;Q<3;Q++){const ae=Q*Math.PI/3,ee=Math.cos(ae),J=Math.sin(ae),ne=W.length/3;W.push(X[0]-ee*te,X[1]-te,X[2]-J*te,X[0]+ee*te,X[1]-te,X[2]+J*te,X[0]+ee*te,X[1]+te,X[2]+J*te,X[0]-ee*te,X[1]+te,X[2]-J*te),z.push(-1,-1,1,1,-1,1,1,1,1,-1,1,1);for(let re=0;re<4;re++)E.push(0,1,0,0);V.push(ne,ne+1,ne+2,ne,ne+2,ne+3)}return _.push({bear:u,from:B,to:Y[1],speed:h,reach:Y[7]-r,broad:e,out:$(Y[0],Y[2])-y(Y[1]+2.5),lineGap:F,foot:X}),Y};{const u=D(L,v.y[0]-2,g+1);let y=g;for(const B of[2,1]){const N=v.y[B-1],l=N+3.5,e=Math.min(u(l)+s.range(1.5,2.5),se(u(l),u(N),.8)),r=G(L,u,v.y[B]+.6,(c,d)=>c<=l+.5&&d>=e-.3,N-1,s.range(5,7),M+B*17);y=r?r[1]:N+2}A.push([L,y-1,g])}if(t){const u=t.range(26,34),y=t.range(240,250),B=t.range(5,7),N=t.range(0,60),l=D(u,211,y+3);let e=y,r=-1e9;for(let d=y-8;d<=y;d+=.25){const P=l(d)-.5*(l(d-1.5)+l(d+1.5));P>r&&(r=P,e=d)}const c=G(u,l,e,d=>e-d>=6&&l(d-1)-l(d+1.5)>=1.2,215,B,N,!0);A.push([u,(c?c[1]:e-6)-1,e+2])}A.forEach((u,y)=>p.uniforms.uWater.value[y].set(Math.sin(u[0]*U),-Math.cos(u[0]*U),u[1],u[2]));const R=new S.BufferGeometry;R.setAttribute("position",new S.Float32BufferAttribute(W,3)),R.setAttribute("aK",new S.Float32BufferAttribute(z,3)),R.setAttribute("aArc",new S.Float32BufferAttribute(E,4)),R.setIndex(V),R.computeBoundingSphere(),R.boundingSphere&&(R.boundingSphere.radius+=8);const C=new S.ShaderMaterial({name:"PeakThread",uniforms:{...f.uniforms,uPhase:{value:M}},vertexShader:zt,fragmentShader:At,transparent:!0,depthWrite:!1,side:S.DoubleSide}),I=new S.Mesh(R,C);return I.name="buttress thread",I.renderOrder=4,{mesh:I,bear:L,top:g,waters:A,hung:_}}async function It(s,t={}){const i=s.core,f=d=>i.makeRng(i.hashSeed("peak:"+d+":"+s.seed)),p=f("form"),j=f("crown"),b=f("farsea"),v=f("drift"),L=f("thread"),g=f("cleftwater"),M=f("scud"),T=f("upperscud"),W=f("mist"),z=i.makeNoise(i.hashSeed("peak:noise:"+s.seed)),E=t.hour||Ve("golden"),V=t.light||it(E),A=t.origin||[0,0];t.light||V.uniforms.uAxis.value.set(A[0],oe.CROWNR,A[1]);const _=s.quality?.detail??1,D=t.form||lt(p,z),H=new S.Group;H.name="peak";const G=t.rock||ut(V),R=await ft(s,D,E),C=new S.Mesh(R.geometry,G);C.name="peakBody",H.add(C),await s.yield();const I=t.route||null,u=I?I.filter(d=>d[1]>oe.CROWN0-14&&d[1]<ve.y1+18&&$(d[0]-A[0],d[2]-A[1])<200):null,y=await dt(s,j,E,A,t.full??.5,_,u);await s.yield(),await pt(s,y,E,D,A,u),await s.yield();const B=gt(s,{hour:E,light:V,rng:b,noise:z,origin:A,noiseTexture:y.crown.noiseTexture});await s.yield();const N=xt(s,{hour:E,light:V,rng:f("moonheaps"),origin:A,route:I,noiseTexture:y.crown.noiseTexture}),l=Mt(s,{hour:E,light:V,rng:v,rngScud:M,rngUpper:T,rngMist:W,origin:A,route:I,lane:u}),e=new S.Group;e.name="peakAir",e.position.set(-A[0],0,-A[1]),e.add(y.crown.object,B.object,N.object,l.object),H.add(e),await s.yield();const r=kt(L,g,D,V,G,A,I);return H.add(r.mesh),{object:H,radius:200,height:oe.TOP,center:new S.Vector3(0,190,0),ground:!0,groundY:0,light:V,hour:E,form:D,body:R,clouds:y,farSea:B,moonHeaps:N,drift:l,rock:G,lane:u,thread:r,anchors:{summit:new S.Vector3(0,oe.TOP,0),portalSeat:new S.Vector3(0,ue.y,0),fallLip:new S.Vector3(oe.FALLX-oe.AX+2,oe.FALLTOP,oe.FALLZ-oe.AZ),fallFoot:new S.Vector3(oe.FALLX-oe.AX,oe.FALLFOOT,oe.FALLZ-oe.AZ),faceRadiusAt:pe},update(d,P,k){V.uniforms.uTime.value=P,y.crown.update(d,P*4,k),y.retouch(),B.update(d,P*4,k),N.update(d,P*4,k),l.update(d,P)},dispose(){}}}const fe={cx:-161,cz:-146,hx:111,hz:102,round:34,lobes:[{cx:-275,cz:-70,hx:75,hz:90,round:30},{cx:-350,cz:-15,hx:50,hz:55,round:30}]},xe={x:-111,z:-44,half:28,soft:26,lean:.364},he={x:30,z:-760,r:45,y:-1},He=[[-176,-350],[-198,-348],[-215,-338],[-216,-312],[-215,-290],[-232,-268],[-262,-254],[-296,-232],[-330,-196],[-372,-150],[-420,-92],[-480,-30],[-560,40],[-680,120]],Oe=[[-680,120],[-800,190],[-950,170],[-1060,60],[-1090,-90],[-1040,-240],[-1100,-390],[-1260,-470],[-1380,-600],[-1400,-770],[-1540,-880],[-1760,-900],[-2e3,-800],[-2300,-860],[-2700,-760],[-3300,-900]],We=[[560,-1090],[430,-985],[300,-950],[190,-870],[95,-800],[30,-760],[-40,-775],[-110,-815],[-190,-775],[-280,-835],[-390,-800],[-500,-870],[-640,-835],[-790,-905],[-940,-850],[-1090,-905],[-1250,-830],[-1400,-770]],St=(s,t)=>{let i=1e9;if(t>-640||t<-1210||s<-1520||s>680)return i;for(let f=0;f<We.length-1;f++){const p=We[f],j=We[f+1][0]-p[0],b=We[f+1][1]-p[1],v=le(((s-p[0])*j+(t-p[1])*b)/(j*j+b*b),0,1);i=Math.min(i,$(s-p[0]-j*v,t-p[1]-b*v))}return i},nt=(s,t)=>{let i=1e9;for(let f=0;f<Oe.length-1;f++){const p=Oe[f],j=Oe[f+1][0]-p[0],b=Oe[f+1][1]-p[1],v=le(((s-p[0])*j+(t-p[1])*b)/(j*j+b*b),0,1);i=Math.min(i,$(s-p[0]-j*v,t-p[1]-b*v))}return i},Lt={die:30};function Gt(s,t){const i=oe,f=[];let p=0;for(let e=0;e<He.length-1;e++){const r=He[e],c=He[e+1],d=$(c[0]-r[0],c[1]-r[1]);f.push({ax:r[0],az:r[1],dx:(c[0]-r[0])/d,dz:(c[1]-r[1])/d,l:d,s0:p}),p+=d}const j=(e,r)=>{let c=1e9,d=0,P=1e18;for(const k of f){const K=le((e-k.ax)*k.dx+(r-k.az)*k.dz,0,k.l),h=e-k.ax-k.dx*K,o=r-k.az-k.dz*K,a=h*h+o*o;if(a>P)continue;const n=$(h,o);n<c&&(c=n,d=k.s0+K,P=a*1.0000001)}return{d:c,s:d}},b=f.map(e=>[Math.min(e.ax,e.ax+e.dx*e.l)-29,Math.max(e.ax,e.ax+e.dx*e.l)+29,Math.min(e.az,e.az+e.dz*e.l)-29,Math.max(e.az,e.az+e.dz*e.l)+29]),v=b.reduce((e,r)=>[Math.min(e[0],r[0]),Math.max(e[1],r[1]),Math.min(e[2],r[2]),Math.max(e[3],r[3])],[1e9,-1e9,1e9,-1e9]),L=v[0],g=v[1],M=v[2],T=v[3],W=(e,r)=>{if(!(e>L&&e<g&&r>M&&r<T))return!1;for(const c of b)if(e>c[0]&&e<c[1]&&r>c[2]&&r<c[3])return!0;return!1},z=e=>i.VALE-7.2*O(150,330,e),E=e=>17+2.5*Math.sin(e*.021)-5*O(170,320,e),V=(e,r,c)=>{const d=Math.abs(e-c.cx)-(c.hx-c.round),P=Math.abs(r-c.cz)-(c.hz-c.round),k=Math.max(d,0),K=Math.max(P,0);return(k>0&&K>0?$(k,K):k+K)+Math.min(Math.max(d,P),0)-c.round},A=(e,r)=>{const c=le(.5+.5*(r-e)/24,0,1);return se(r,e,c)-24*c*(1-c)},_=(e,r)=>A(A(V(e,r,fe),V(e,r,fe.lobes[0])),V(e,r,fe.lobes[1]))+7*s.n2(e/55+3.3,r/55-1.7),D=(e,r,c={})=>{const d=_(e,r);if(c.sd=d,c.s1=d,c.wl=0,c.fan=0,c.br=0,d>82||d<-40)return c;c.s1=d-9*O(-.15,.55,s.n2(e/33+1.1,r/33-4.2)),c.wl=9*O(-.1,.5,s.n2(e/41-6.3,r/41+2.9)),c.fan=O(0,.6,s.n2(e/52-2.2,r/52+6.1));const P=Math.abs(e-xe.x-(r-xe.z)*xe.lean)-.25*Math.max(0,d);return c.br=(1-O(xe.half,xe.half+xe.soft,P))*O(xe.z-70,xe.z-45,r),c},H={},G={w:0,f:0,r:0,sd:0};let R=!1;const C=(e,r,c)=>{if(c.w=0,c.f=0,c.r=0,c.sd=-1e3,!(r<fe.cz&&e<-118))return c;const d=V(e,r,fe);if(c.sd=d,d<=-8||d>=72)return c;const P=Math.max(Math.abs(e-fe.cx)-(fe.hx-fe.round),0),k=Math.max(Math.abs(r-fe.cz)-(fe.hz-fe.round),0),K=O(.3,.6,k/Math.max($(P,k),1e-6));if(K>0){let h=1e9,o=0,a=0,n=1e18;for(const x of f){const m=le((e-x.ax)*x.dx+(r-x.az)*x.dz,0,x.l),w=e-x.ax-x.dx*m,q=r-x.az-x.dz*m,F=w*w+q*q;if(F>n)continue;const Z=$(w,q);Z<h&&(h=Z,o=x.dx*q-x.dz*w,a=x.s0+m,n=F*1.0000001)}o<0&&(c.f=K,c.r=O(0,Lt.die,h-E(a)-9),c.w=K*c.r)}return c},I=(e,r)=>{const c=e-i.AX,d=r-i.AZ,P=c*c+d*d<176e3?0:O(420,1e3,$(c,d)),k=(1-O(90,260,Math.abs(e)))*O(-20,80,r),K=2.8*s.fbm2(e/130+7.1,r/130-2.3,2)*(1-.6*k)-.024*Math.max(r,0)*k;return P*(1-k)>0?K+P*(1-k)*(9+16*s.fbm2(e/520+1.3,r/520+4.1,2)):K},u=(e,r)=>{let c=I(e,r);const d=e>-420&&e<-110&&r>-500&&r<-236?O(-420,-340,e)*(1-O(-150,-110,e))*(O(-500,-430,r)*(1-O(-262,-236,r))):0,P=r<-140&&e<-60?O(-140,-260,r)*O(-60,-200,e)*(1-d):0;P>0&&(c+=P*(10+9*s.fbm2(e/170-3.7,r/170+8.2,2))*(1-O(700,1200,$(e-i.AX,r-i.AZ)))),d>0&&(c=se(c,i.VALE+.7*s.n2(e/38,r/38),d));const k=D(e,r,H),K=k.sd;if(K<82){const w=i.SHELF+.9*s.fbm2(e/44+5.5,r/44+.4,2),q=2*O(.15,.7,s.n2(e/21+8.8,r/21-3.1)),F=w-3.5*(Math.floor(q)+O(.35,.65,q-Math.floor(q)))*O(-9,2,K),Z=c+k.fan*11*(1-O(10,48,k.s1)),Y=Z+(F-Z)*(.46+.1*s.n2(e/29+3.3,r/29+7.1)),te=F-(F-Y)*O(-4,4,k.s1)-(Y-Z)*O(k.wl+3,k.wl+12,k.s1),X=le((K+28)/86,0,1),Q=se(w,c,se(X,O(0,1,X),.5))+.8*s.n2(e/13,r/13)*O(0,.2,X);c=se(te,Q,k.br)}const h=C(e,r,G),o=le((h.sd+6)/48,0,1);if(o>0){const w=o*5,q=Math.floor(w),F=w-q,Z=i.SHELF-(i.SHELF-i.VALE)*Math.min(5,q+.1*F+.9*O(.72,1,F))/5,Y=se(c,Z+.35*s.n2(e/21,r/21),(1-O(-152,-118,e))*O(0,.04,o));c=se(se(c,se(Math.min(c,Y),Y,R?1:h.r),h.f),se(c,Y,O(-300,-266,e)),O(42,72,h.sd))}if(e<-430){const w=nt(e,r);w<240&&(c=se(c,.3+.5*s.n2(e/60,r/60),O(240,40,w)))}if(r<-640){const w=St(e,r);w<100&&(c=se(c,Math.min(c,-.3+.4*s.n2(e/40,r/40)),O(100,45,w)))}if(W(e,r)){const w=j(e,r),q=z(w.s),F=E(w.s),Z=O(F+9,F-2,w.d);Z>0&&(c=se(c,q-1.25+.35*s.n2(e/9,r/9),Z))}const a=e-(i.FALLX-20),n=r-i.FALLZ;if(a*a+n*n<784){const w=$(a,n);w<27&&(c=se(c,i.VALE-2.4,O(27,15,w)))}const x=e-he.x,m=r-he.z;if(x*x+m*m<(he.r+47)*(he.r+47)){const w=$(x,m);if(w<he.r+46){const q=w+5*s.n2(e/31+4.4,r/31-7.7);q<he.r+30&&(c=se(se(c,Math.max(c,he.y+.7),O(he.r+30,he.r+16,q)),he.y-2.2,O(he.r+8,he.r-10,q)))}}return c};return{height:u,heightWhole:(e,r)=>{R=!0;const c=u(e,r);return R=!1,c},levelAt:(e,r)=>{const c=j(e,r),d=E(c.s),P=$(e-(i.FALLX-20),r-i.FALLZ);return $(e-he.x,r-he.z)<he.r+9?he.y:c.d<d+6||P<26?z(c.s):-1e3},surfaceAt:(e,r)=>Math.max(u(e,r),t?t.heightAt(e-i.AX,r-i.AZ):-1e3),riverAt:j,nearRiver:W,waterAt:z,riverHalf:E,shelfSd:_,scarpAt:D,terraceEnd:C,fieldsAt:I,skinR:(e,r)=>t?t.radius(e,r):pe(r)}}const me={x:-70,z:130},Dt=[[305,112,63],[340,162,63],[8,200,54],[42,244,50],[75,286,48],[100,314,70]],Xe=338,Ft=60,Rt=2,ve={b0:8,b1:75,y0:oe.CROWN0,y1:286},ue={y:oe.TOP+10,r:9,turn:55,straight:65,rise:14},Ke=(s=1)=>ue.y-s*ue.straight*Math.tan(ue.rise*U);function Zt(s){const t=oe,i=[],f=-.342,p=-.94,j=t.SHELF+Rt,b=Ft;let v=-1e9,L=0;for(let A=me.z+12;A>=me.z-b-8;A-=4)v=Math.max(v,s.height(me.x,A),s.height(me.x-3,A),s.height(me.x+3,A));const g=v+4.2;for(const A of[0,1/3,2/3,1])i.push([me.x,g+A*b*.06,me.z-A*b]);for(i.bend=i[3];L<200&&!(s.shelfSd(me.x+f*L,me.z-b+p*L)<2);L+=1);const M=me.x,T=me.z-b,W=g+b*.06;i.push([M+f*L*.34*.7,se(W,j,.3),T+p*L*.34],[M+f*L*.67,se(W,j,.66),T+p*L*.67],[M+f*L,j,T+p*L]),i.push([-140,t.SHELF+22,-150],[-190,t.SHELF+20,-248]),i.push([t.FALLX-52,t.FALLTOP-5,-304],[t.FALLX-58,t.FALLTOP+1,t.FALLZ-10]);for(const[A,_,D]of Dt){const H=pe(_)+D;i.push([t.AX+Math.sin(A*U)*H,_,t.AZ-Math.cos(A*U)*H])}const z=ue.turn,E=t.AX+z,V=t.AZ+ue.straight;i.push([E+z,Xe,V]);for(let A=1;A<=4;A++){const _=A*45*U;i.push([E+z*Math.cos(_),se(Xe,Ke(),A/4),V+z*Math.sin(_)])}return i.push([t.AX,Ke(.62),t.AZ+ue.straight*.62],[t.AX,Ke(.3),t.AZ+ue.straight*.3],[t.AX,ue.y,t.AZ]),i}function Ht(s={}){const{path:t,land:i,form:f,knots:p,shapes:j=[],hour:b}=s,v=oe,L=t.length,g=new S.Vector3,M=new S.Vector3,T=new S.Vector3,W=(_,D,H,G=0,R=L)=>{let C=1e18,I=G;for(let u=G;u<=R;u+=1){t.posAtDist(u,g);const y=(g.x-_)**2+(g.y-D)**2+(g.z-H)**2;y<C&&(C=y,I=u)}return I},z=_=>{for(let D=0;D<=L;D+=1)if(t.posAtDist(D,g),g.y>=_)return D;return L},E=(_,D,H)=>{t.posAtDist(H,g),t.tangentAtDist(H,M);const G=_-g.x,R=D-g.z,C=$(G,R)||1,I=$(M.x,M.z)||1;return Math.acos(le((G*M.x+R*M.z)/(C*I),-1,1))/U},V=(_,D,H,G,R)=>{for(let C=H;C<=R;C+=1)if(E(_,D,C)>=G)return C;return R},A={};A.bend=W(p.bend[0],p.bend[1],p.bend[2],0,140),A.rim=0,A.edge=0;for(let _=0;_<=L&&(t.posAtDist(_,g),!(g.y>90));_+=1)i.shelfSd(g.x,g.z)<2&&(A.rim||(A.rim=_),A.edge=_);A.foot=A.rim,A.terr=A.edge;for(let _=0;_<=A.rim;_+=1)if(t.posAtDist(_,g),i.shelfSd(g.x,g.z)<17){A.foot=_;break}A.fall=W(v.FALLX-58,v.FALLTOP,v.FALLZ,A.edge,A.edge+260);for(let _=A.edge;_<=A.fall&&(t.posAtDist(_,g),A.terr=_,!(i.heightWhole(g.x,g.z)<v.VALE+1.5));_+=1);return A.mouth=z(ve.y0),A.cleftTop=z(ve.y1),A.under=z(ve.y0-15),A.clear=z(ve.y1+18),A.fallBehind=V(v.FALLX,v.FALLZ,A.fall,135,A.mouth),A.turn0=W(v.AX+2*ue.turn,Xe,v.AZ+ue.straight,A.cleftTop,L),A.turn1=W(v.AX,Ke(),v.AZ+ue.straight,A.turn0,L),A.ringLevel=z(ue.y-ue.r),{S:A,L,metresAt:W,metresAtHeight:z,offAt:E,untilOff:V}}const _e={rise:.6,fall:.3,nose:.7,rock:.38};function Xt(s,t={}){const{path:i,land:f,form:p,shapes:j=[],hour:b}=t,{S:v,untilOff:L,metresAtHeight:g}=s,M=oe,T=[],W=new S.Vector3,z=new S.Vector3,E=(c,d,P,k,K,h)=>{k-P>=38&&T.push({name:c,at:d,from:P,to:k,weight:K,fade:h})};{i.tangentAtDist((v.rim+v.edge)/2,z);const c=z.z*b.sunDir.x-z.x*b.sunDir.z>0?1:-1;let d=null,P=0;for(const k of j.filter(K=>K.near&&K.side===c)){const K=L(k.x,k.z,v.rim+20,88,v.edge);K-(v.rim+20)>=60&&(!d||k.flank<d.flank)&&(d=k,P=K)}d&&(E("rise",[d.x,d.base,d.z],v.bend,v.rim+20+.4*(P-v.rim-20),_e.rise,.14),E("shape",[d.x+d.leanX*d.h*.5,d.base+d.h*.5,d.z+d.leanZ*d.h*.5],v.rim+20,P,.3,.4))}const V=[M.FALLX-5,M.FALLFOOT+.55*(M.FALLTOP-M.FALLFOOT),M.FALLZ],A=L(V[0],V[2],v.edge,60,v.fall);E("fall",V,v.edge,A,.4,.5);const _=L(V[0],V[2],v.edge,45,v.fall),D=L(V[0],V[2],v.fall-20,100,v.mouth);E("fall again",V,_,D,_e.fall,.5);const H=p.spur,G=H.y[0],R=pe(G)+p.spurOut(G),C=[M.AX+Math.sin(H.b*U)*R,G,M.AZ-Math.cos(H.b*U)*R],I=g(H.y[1]);E("nose",C,D,I,_e.nose,.3);const u=ve.y0+12,y=pe(u)+6,B=(ve.b0+12)*U;E("rock",[M.AX+Math.sin(B)*y,u,M.AZ-Math.cos(B)*y],I,v.mouth,_e.rock,.5);const N=b.moonDir,l=new S.Vector3,e=i.length,r=L(M.AX+N.x*1e6,M.AZ+N.z*1e6,v.clear,30,v.turn1);return E("moon",(c,d)=>(i.posAtDist(d*e,l),l.addScaledVector(N,3e3)),v.cleftTop,r,.5,.4),E("tooth",[M.AX,M.TOP-16,M.AZ],v.turn0,v.turn1,.5,.5),T}const Ce={fields:.8,garden:.15,cleft:.2,crown:.53};function Ut(s){const{S:t,L:i}=s;return f=>{const p=f*i;let j=Ce.fields+(1-Ce.fields)*O(t.foot,t.rim,p);return j-=Ce.garden*O(t.edge,t.terr,p)*(1-O(t.fall,t.fallBehind,p)),j+=Ce.cleft*O(t.under,t.mouth,p)*(1-O(t.cleftTop,t.clear,p)),j-=Ce.crown*O(t.cleftTop,t.clear,p)*(1-O(t.turn1,t.ringLevel,p)),j}}const Pe=[10,63,200,280,360],ye=(s,t,i)=>{const f=s.length;if(i<=s[0])return t[0];if(i>=s[f-1])return t[f-1];let p=0;for(;i>s[p+1];)p++;const j=s[p+1]-s[p],b=T=>(t[T+1]-t[T])/(s[T+1]-s[T]),v=T=>{if(T===0)return b(0);if(T===f-1)return b(f-2);const W=b(T-1),z=b(T);return W*z<=0?0:2*W*z/(W+z)},L=(i-s[p])/j,g=L*L,M=g*L;return(2*M-3*g+1)*t[p]+(M-2*g+L)*j*v(p)+(-2*M+3*g)*t[p+1]+(M-g)*j*v(p+1)},Nt=[14,12.5,9,7.5,6],Ct=[1,.9,.5,.34,.2],Pt=[0,.12,.5,.75,1],qt=[150,200,280,350],Tt=[0,.22,.62,1],Vt=[150,360],jt=[.75,.5],at=new WeakMap;function Ue(s,t,i=null){let f=at.get(t);if(!f){const b=M=>{const T=new S.Color(M);return[T.r,T.g,T.b]},v=[t.zen,"#3f78cf","#3d467d","#3d4260","#3e424e"].map(b),L=[new S.Color(t.zen).lerp(new S.Color(t.hor),.42),new S.Color("#3f78cf").lerp(new S.Color(t.hor),.36),new S.Color("#3e63b8"),new S.Color("#3e4c9c"),new S.Color("#3e4678")].map(M=>[M.r,M.g,M.b]),g=M=>M<=.0031308?M*12.92:1.055*Math.pow(M,1/2.4)-.055;f={zen:[0,1,2].map(M=>v.map(T=>g(T[M]))),mid:[0,1,2].map(M=>L.map(T=>g(T[M])))},at.set(t,f)}const p=b=>b<=.04045?b/12.92:Math.pow((b+.055)/1.055,2.4),j=i||{zen:[0,0,0],mid:[0,0,0],band:0,admit:0,twinkle:0,glow:0,deep:0};for(let b=0;b<3;b++)j.zen[b]=p(ye(Pe,f.zen[b],s)),j.mid[b]=p(ye(Pe,f.mid[b],s));return j.band=ye(Pe,Nt,s),j.admit=ye(qt,Tt,s),j.twinkle=ye(Vt,jt,s),j.glow=ye(Pe,Ct,s),j.deep=ye(Pe,Pt,s),j}const Bt=`
varying vec3 vDir;
void main(){ vDir=position; vec4 p=projectionMatrix*viewMatrix*vec4(position*100.+cameraPosition,1.); if(abs(p.w)<1e-4) p.w=1e-4; gl_Position=p.xyww; }`,Et=`
uniform float uTime, uStarK, uBand, uAdmit, uTw, uGlow, uDeep; uniform vec3 uSunDir, uSunCol, uZen, uMid, uFogSun, uFogAway, uRose, uRC, uRU, uRV, uRiver; uniform vec4 uReach, uReachB, uMoonD;
varying vec3 vDir;
float uh2(vec2 p){ vec3 q=fract(vec3(p.xyx)*.1031); q+=dot(q,q.yzx+33.33); return fract((q.x+q.y)*q.z); }
float un2(vec2 x){ vec2 i=floor(x), f=fract(x); f=f*f*(3.-2.*f); return mix(mix(uh2(i),uh2(i+vec2(1.,0.)),f.x),mix(uh2(i+vec2(0.,1.)),uh2(i+vec2(1.,1.)),f.x),f.y); }
vec3 uh33(vec3 p){ p=fract(p*vec3(.1031,.1030,.0973)); p+=dot(p,p.yxz+33.33); return fract((p.xxy+p.yxx)*p.zyx); }
// how far inside the reach a direction lies: 0 outside, 1 well inside (degrees on a chart about the reach's middle)
float reach(vec3 d){
  float c=dot(d,uRC); if(c<.15) return 0.;
  vec2 q=vec2(atan(dot(d,uRU)/c),atan(dot(d,uRV)/c))*57.2958;
  vec2 A=uReach.xy, AB=uReach.zw-uReach.xy; float L2=max(dot(AB,AB),1e-3);
  float t=dot(q-A,AB)/L2, tc=clamp(t,0.,1.3);
  float pd=length(q-A-AB*tc);
  float w=mix(uReachB.x,uReachB.y,smoothstep(0.,1.,t));
  w+=3.6*(un2(q*.05+uReachB.w)-.5)+1.2*sin(uTime*.105+uReachB.z+2.6*un2(q*.04+3.))+.5*sin(uTime*.061+1.7*uReachB.z);
  return smoothstep(0.,6.5,w-pd)*(1.-smoothstep(.5,1.08,t));
}
// the river of stars: 1 on its middle line, 0 outside it (a band about a great circle)
float river(vec3 d){ float s=abs(dot(d,uRiver)); return 1.-smoothstep(.06,.2,s+.035*(un2(d.xz*7.+d.y*5.)-.5)); }
// one layer of stars: a star in a cell of the direction's own lattice, its size in true angle, never under a pixel
vec3 stars(vec3 d, float n, float keep, float size, float pix, float gain, float late){
  vec3 g=d*n, c=floor(g), r3=uh33(c);
  vec3 sp=normalize((c+.5+(r3-.5)*.5)/n);
  vec3 q=sp*n-c; float rr=max(size,pix*.75), m=rr*n;
  float rv=river(sp);
  if(r3.z>keep*(.55+.9*rv) || any(lessThan(q,vec3(m))) || any(greaterThan(q,vec3(1.-m)))) return vec3(0.);
  float hs=fract(r3.x*7.31+r3.y*3.17), b=gain*(.26+.74*hs*hs*hs)*size*size/(rr*rr);
  // the air lets the brightest through first
  b*=smoothstep(0.,.14,uAdmit-late-.78*sqrt(max(1.-hs,0.)));
  float a=length(d-sp);
  float dk=reach(sp);
  // along the reach's edge a star loses its warmth, dims and is out
  b*=1.-smoothstep(hs*.5,hs*.5+.45,dk);
  float tk=fract(hs*5.3);
  vec3 tint=tk<.34 ? vec3(1.,.9,.74) : (tk<.67 ? vec3(.78,.87,1.15) : vec3(1.,.83,.8));
  tint=mix(tint,vec3(.5,.74,1.35),smoothstep(.03,.4,dk));
  b*=1.+uTw*sin(uTime*(2.5+6.*r3.x)+r3.y*40.);
  b*=smoothstep(.015,.09,sp.y);
  return tint*b*(1.-smoothstep(rr*.45,rr,a));
}
void main(){
  vec3 d=normalize(vDir); float el=max(d.y,0.);
  float pix=length(fwidth(d));
  vec2 hd=normalize(d.xz+vec2(1e-5,0.)), hs=normalize(uSunDir.xz+vec2(1e-5,0.));
  float sunny=pow(clamp(dot(hd,hs)*.5+.5,0.,1.),2.);
  // overhead, the mid sky, and the warm band low down (gold toward the sun, rose away from it)
  float band=exp(-el*el/max(uBand*uBand,1e-4));
  vec3 c=mix(uZen,uMid,exp(-el*4.2));
  vec3 warm=mix(mix(uFogAway,uRose,.45),uFogSun,sunny);
  warm=mix(warm,mix(mix(uRose,uFogAway,.3)*.62,uFogSun*vec3(1.,.8,.55)*.9,sunny),uDeep);
  c=mix(c,warm,band);
  // the horizon itself is the far air's own colour (what the furthest things go into), the same at every height
  c=mix(c,mix(uFogAway,uFogSun,sunny),exp(-el*el*900.));
  c+=uSunCol*.05*uGlow*sunny*exp(-el*5.)*(1.-.5*band);
  float dk=reach(d), rv=river(d);
  // the river's own faint glow of stars too far to tell apart; in the reach there is none, and the sky's light a
  // thirtieth less (shown, that is a few steps darker: the grade is steep in the darks)
  vec3 dq=d*5.;
  float dust=(.4+.6*smoothstep(.25,.8,un2(dq.xz+dq.y*.7)*.5+un2(dq.zy*2.3+3.)*.3+un2(dq.xy*5.1+7.)*.2))*rv*rv;
  float high=smoothstep(.25,1.,uAdmit);
  c+=vec3(.0022,.003,.0058)*(2.2*dust+.25*un2(dq.zx*1.7+11.))*high*(1.-band)*smoothstep(.03,.2,el)*(1.-dk);
  c*=1.-.03*dk;
  vec3 st=stars(d,30.,.55*uStarK,.0014,pix,2.8,0.);
  st+=stars(d,62.,.55*uStarK,.001,pix,1.7,.1);
  st+=stars(d,118.,.5*uStarK,.0008,pix,1.1,.22);
  st+=stars(d,190.,.5*uStarK,.0006,pix,.75,.34);
  // (no star shows through the moon's disc: the moon stands before them)
  c+=st*(1.-band)*(1.-.6*sunny*exp(-el*4.))*(1.-smoothstep(uMoonD.w-.0005,uMoonD.w+.0005,dot(d,uMoonD.xyz)));
  // the sun's disc and its glare, the same at every height
  float cs=clamp(dot(d,uSunDir),0.,1.);
  c+=uSunCol*(smoothstep(.99965,.9998,cs)*9.+.9*pow(cs,900.)+.2*pow(cs,220.)+uGlow*(.14*pow(cs,60.)+.05*pow(cs,7.)));
  gl_FragColor=vec4(c,1.);
}`;function Yt(s,t={}){const i=t.hour||Ve("golden"),f=t.rng,p=(G,R=1)=>new S.Color(G).multiplyScalar(R),j=Re(36.5,2),b=new S.Vector3().crossVectors(j,new S.Vector3(0,1,0)).normalize(),v=new S.Vector3().crossVectors(b,j).normalize(),L=f?f.range(-1.5,1.5):0,g=f?f.range(13,14.5):14,M=f?f.range(0,6.28):1,T=f?f.range(0,40):3,W=f?f.range(-3,3):0,z=f?f.range(-5,5):0,E=new S.Vector3().crossVectors(Re(6,-52+z),Re(64,78-z)).normalize(),V=Ue(0,i),A={uTime:{value:0},uStarK:{value:le(t.density??1,.7,1.3)},uSunDir:{value:i.sunDir.clone()},uSunCol:{value:p(i.sun,1.25)},uZen:{value:new S.Color().setRGB(V.zen[0],V.zen[1],V.zen[2])},uMid:{value:new S.Color().setRGB(V.mid[0],V.mid[1],V.mid[2])},uBand:{value:Math.sin(V.band*U)},uAdmit:{value:V.admit},uTw:{value:V.twinkle},uGlow:{value:V.glow},uDeep:{value:V.deep},uFogSun:{value:p(i.fogSun)},uFogAway:{value:p(i.fogAway)},uRose:{value:p(i.rose)},uRC:{value:j},uRU:{value:b},uRV:{value:v},uRiver:{value:E},uMoonD:{value:new S.Vector4(i.moonDir.x,i.moonDir.y,i.moonDir.z,Math.cos(Ie*U))},uReach:{value:new S.Vector4(21+W,-.5+L,-21-W,2.5-L)},uReachB:{value:new S.Vector4(g,g*.74,M,T)}},_=new S.ShaderMaterial({name:"PeakSky",uniforms:A,vertexShader:Bt,fragmentShader:Et,depthWrite:!1,depthTest:!0,side:S.BackSide,fog:!1}),D=new S.Mesh(new S.IcosahedronGeometry(1,5),_);D.frustumCulled=!1,D.renderOrder=-2,D.name="sky";const H=Ue(0,i);return{object:D,material:_,uniforms:A,setEye(G){const R=Ue(G,i,H);A.uZen.value.setRGB(R.zen[0],R.zen[1],R.zen[2]),A.uMid.value.setRGB(R.mid[0],R.mid[1],R.mid[2]),A.uBand.value=Math.sin(R.band*U),A.uAdmit.value=R.admit,A.uTw.value=R.twinkle,A.uGlow.value=R.glow,A.uDeep.value=R.deep},update(G,R){A.uTime.value=R}}}const Ie=6.5,Me=24,Ot=`
uniform vec3 uDir, uU, uV; uniform float uSize;
varying vec2 vP;
void main(){
  vP=position.xy*2.4;
  vec3 d=uDir+(uU*vP.x+uV*vP.y)*uSize;
  vec4 p=projectionMatrix*viewMatrix*vec4(d*100.+cameraPosition,1.); if(abs(p.w)<1e-4) p.w=1e-4; gl_Position=p.xyww; }`,Wt=`
uniform vec3 uLit, uMark, uSunL; uniform vec4 uSeed, uRay[4]; uniform mat3 uSpin; uniform float uK; uniform vec2 uSunV;
uniform vec3 uDir, uU, uV; uniform float uSize; uniform vec4 uVeilA[VEILS]; uniform vec2 uVeilB[VEILS]; uniform int uVeilN;
varying vec2 vP;
// THE MOON STANDS BEHIND EVERY CLOUD. Its card is drawn before all cloud, and the cloud is laid over it; but a
// cloud's thin rim lets a bright thing through nearly whole, and a moon seen sharp through a cloud's rim reads as
// standing before the cloud. So along each sight line to the moon's card the bodies of the puffs that stand in it
// take the moon's light away (a puff's body: within a third of its breadth of its middle, going to nothing at
// half; above its flat base): behind a heap there is no moon, and it sinks into a heap's rim.
float veil(){
  vec3 d=normalize(uDir+(uU*vP.x+uV*vP.y)*uSize); float T=1.;
  for(int i=0;i<VEILS;i++){
    if(i>=uVeilN) break;
    vec4 A=uVeilA[i]; vec3 c=A.xyz-cameraPosition; float t=dot(c,d);
    if(t>0.){ vec3 q=c-d*t; T*=1.-(1.-smoothstep(.34,.52,length(q)/A.w))*smoothstep(uVeilB[i].x-A.w*.1,uVeilB[i].x+A.w*.32,A.y-q.y)*uVeilB[i].y; }
  }
  return T;
}
float mh1(vec3 p){ p=fract(p*.3183099+.1); p*=17.; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
vec3 mh3(vec3 p){ p=fract(p*vec3(.1031,.1030,.0973)); p+=dot(p,p.yxz+33.33); return fract((p.xxy+p.yxx)*p.zyx); }
float mn3(vec3 x){ vec3 i=floor(x), f=fract(x); f=f*f*(3.-2.*f);
  return mix(mix(mix(mh1(i),mh1(i+vec3(1.,0.,0.)),f.x),mix(mh1(i+vec3(0.,1.,0.)),mh1(i+vec3(1.,1.,0.)),f.x),f.y),
             mix(mix(mh1(i+vec3(0.,0.,1.)),mh1(i+vec3(1.,0.,1.)),f.x),mix(mh1(i+vec3(0.,1.,1.)),mh1(i+vec3(1.,1.,1.)),f.x),f.y),f.z); }
float mf3(vec3 p){ float a=.5, s=0.; for(int i=0;i<4;i++){ s+=a*mn3(p); p=p*2.07+vec3(3.1,7.7,5.3); a*=.5; } return s; }
// round pits: balls dealt in the cells of a lattice in the moon's own space; where the sphere cuts one there is a
// round bowl with a raised rim (x = its height, y = 1 on the bowl's floor)
vec2 pits(vec3 q, float n){
  vec3 g=q*n, c=floor(g), r=mh3(c);
  float rad=.13+.17*r.z, d=length(fract(g)-.5-(r-.5)*.3)/rad, live=step(r.x,.5);
  return vec2((-.6*(1.-smoothstep(.45,.95,d))+.5*exp(-(d-1.)*(d-1.)*18.))*rad*live, (1.-smoothstep(.6,.9,d))*live);
}
float ground(vec3 q){ return .2*mf3(q*2.6+uSeed.xyx)+pits(q,3.1).x*1.4+pits(q+3.7,6.7).x; }
void main(){
  float r=length(vP), aa=fwidth(r)*1.5+1e-4;
  float disc=1.-smoothstep(1.-aa,1.,r);
  float mu=sqrt(max(1.-r*r,0.));
  // a point of the sphere in the moon's own space (its face is turned to this world once, by its own stream)
  vec3 q=uSpin*normalize(vec3(vP,mu+1e-4));
  // the grey seas: broad lowlands, darker; the uplands bright
  float sea=smoothstep(.44,.53,mf3(q*1.15+uSeed.yxy));
  float alb=mix(.86,.52,sea)*(.92+.16*mf3(q*4.+7.));
  // the rayed pits of the uplands: from each a bright apron and long thin rays, uneven in number and length
  for(int i=0;i<4;i++){
    vec3 c=uRay[i].xyz; float a=acos(clamp(dot(q,c),-1.,1.)), len=uRay[i].w;
    vec3 e1=normalize(cross(c,vec3(.31,.87,.38))), e2=cross(c,e1);
    vec2 w=normalize(vec2(dot(q,e1),dot(q,e2))+1e-5);
    float ray=smoothstep(.56,.8,mn3(vec3(w*4.5,float(i)*7.3+uSeed.x))*.7+mn3(vec3(w*11.,float(i)*3.1))*.3);
    alb+=(.42*ray*(1.-smoothstep(len*.25,len,a))*smoothstep(.02,.06,a)+.34*exp(-a*a/(.004+.004*len)))*(1.-.4*sea);
  }
  alb=clamp(alb,0.,1.2);
  // relief: the ground's own slopes turned to this world's sun (seen along the terminator, where the light lies low)
  // (the step the slope is read over is never under what one point of the eye's raster covers, so the relief does not speckle)
  vec3 t1=normalize(cross(q,vec3(.2,.9,.4))), t2=cross(q,t1); float e=max(.012,aa*1.2), h0=ground(q);
  vec3 nb=normalize(q-((ground(normalize(q+t1*e))-h0)/e*t1+(ground(normalize(q+t2*e))-h0)/e*t2));
  float nd=dot(nb,uSunL), ns=dot(q,uSunL);
  // a slope's share of the light counts for most where the sun lies low over it
  float lit=smoothstep(-.02,.1,ns)*pow(max(ns,0.),.55)*clamp(1.+.9*(nd-ns)/(max(ns,0.)+.16),.3,1.6);
  // the limb a little darker (a sphere, not a disc)
  vec3 col=mix(uMark,uLit,clamp(alb,0.,1.))*alb*1.12*lit*(.62+.38*pow(mu,.6));
  // the glow round it in the thin air, on its lit side the stronger. The glowing air lies before the moon as well
  // as beside it: the glow goes on over the disc at its rim's strength, so the unlit limb is never darker than the
  // sky beside it (over the disc its sunward lean runs evenly from side to side)
  float out1=max(r-1.,0.), side=.72+.28*dot(vP,uSunV)/max(r,1.);
  float halo=(.11*exp(-out1*5.)+.035*exp(-out1*1.5))*(1.-smoothstep(1.5,2.35,r))*side;
  // the unlit limb: the faint light this lit world sends back to it
  col+=uMark*.034*alb*(1.-lit);
  gl_FragColor=vec4((col*uK*disc+uLit*halo*uK)*veil(),1.);
}`;function $t(s,t={}){const i=t.hour||Ve("golden"),f=t.rng,p=i.moonDir.clone().normalize(),j=new S.Vector3().crossVectors(p,new S.Vector3(0,1,0)).normalize(),b=new S.Vector3().crossVectors(j,p).normalize(),v=f?f.range(0,6.28):.7,L={uDir:{value:p},uU:{value:j},uV:{value:b},uSize:{value:Math.tan(Ie*U)},uLit:{value:new S.Color("#f4f6fb")},uMark:{value:new S.Color("#c9d0e2")},uSunL:{value:new S.Vector3},uSeed:{value:new S.Vector4(f?f.range(0,30):3,f?f.range(0,30):9,Math.cos(v),Math.sin(v))},uK:{value:1*i.moonK},uSpin:{value:new S.Matrix3},uRay:{value:[]},uSunV:{value:new S.Vector2(1,0)},uVeilA:{value:Array.from({length:Me},()=>new S.Vector4(0,0,0,1))},uVeilB:{value:Array.from({length:Me},()=>new S.Vector2(0,0))},uVeilN:{value:0}},g=new S.Matrix4().makeRotationFromEuler(new S.Euler(f?f.range(-.6,.6):.2,f?f.range(0,6.28):1,v));L.uSpin.value.setFromMatrix4(g);const M=i.sunDir;L.uSunL.value.set(M.dot(j),M.dot(b),-M.dot(p)).normalize(),L.uSunV.value.set(L.uSunL.value.x,L.uSunL.value.y).normalize(),L.uSunL.value.applyMatrix4(g);const T=[];for(let R=0,C=0;R<4&&C<200;C++){const I=f?f.range(0,6.28):R*1.7,u=Math.sqrt(f?f.range(.02,.72):.3+.1*R),y=f?f.range(.35,.8):.5,B=new S.Vector3(Math.cos(I)*u,Math.sin(I)*u,Math.sqrt(1-u*u));T.some(N=>N.c.angleTo(B)<35*U)||(T.push({c:B,len:y}),R++)}for(;T.length<4;)T.push({c:new S.Vector3(0,0,-1),len:.3});L.uRay.value=T.map(R=>{const C=R.c.clone().applyMatrix4(g);return new S.Vector4(C.x,C.y,C.z,R.len)});const W=new S.ShaderMaterial({name:"PeakMoon",uniforms:L,vertexShader:Ot,fragmentShader:Wt,defines:{VEILS:Me},transparent:!0,depthWrite:!1,depthTest:!0,blending:S.AdditiveBlending,fog:!1}),z=new S.Mesh(new S.PlaneGeometry(2,2),W);z.frustumCulled=!1,z.renderOrder=-.5,z.name="moon";const E=t.veil||null,V=t.clouds||null,A=Math.tan(Ie*2.4*U),_=new Float32Array(Me),D=new Float32Array(Me*6),H=(R,C,I,u,y,B,N)=>{const l=R-N.x,e=C-N.y,r=I-N.z,c=l*p.x+e*p.y+r*p.z;if(c<=0||B<=0)return;const d=(.52*u-Fe(l-p.x*c,e-p.y*c,r-p.z*c))/c+A;if(d<=0)return;let P=L.uVeilN.value,k=P<Me?P:-1;if(k<0){k=0;for(let h=1;h<Me;h++)_[h]<_[k]&&(k=h);if(_[k]>=d)return}else L.uVeilN.value=P+1;_[k]=d;const K=k*6;D[K]=R,D[K+1]=C,D[K+2]=I,D[K+3]=u,D[K+4]=y,D[K+5]=B},G=R=>{if(L.uVeilN.value=0,E)for(let C=0;C<E.length;C+=6)H(E[C],E[C+1],E[C+2],E[C+3],E[C+4],E[C+5],R);if(V)for(const C of V)C.w>0&&H(C.x,C.y,C.z,C.w*1.4,-1e6,1,R);for(let C=0;C<L.uVeilN.value;C++)L.uVeilA.value[C].set(D[C*6],D[C*6+1],D[C*6+2],D[C*6+3]),L.uVeilB.value[C].set(D[C*6+4],D[C*6+5])};return{object:z,material:W,uniforms:L,direction:p,lit:.5*(1-M.dot(p)),update:G}}const Ye=110,Kt=[.85,1,.7];async function Jt(s,t,i,f,p=null){const j=oe,b=new S.Vector3,v=new S.Vector3,L=[],g=[];let M=-1,T=-1;for(let h=0;h<=i.length&&(i.posAtDist(h,b),!(b.y>90));h+=2)t.shelfSd(b.x,b.z)<0&&(M<0&&(M=h),T=h);for(let h=Math.max(0,M-160);h<=T+160;h+=3){i.posAtDist(h,b),i.tangentAtDist(h,v);const o=$(v.x,v.z)||1;L.push([b.x,b.z,v.x/o,v.z/o,h])}const W=Float64Array.from(L,h=>h[0]),z=Float64Array.from(L,h=>h[1]),E=L.length,V=8,A=Math.ceil(E/V),_=new Float64Array(A).fill(1e18),D=new Float64Array(A).fill(-1e18),H=new Float64Array(A).fill(1e18),G=new Float64Array(A).fill(-1e18);for(let h=0;h<E;h++){const o=h/V|0;_[o]=Math.min(_[o],W[h]),D[o]=Math.max(D[o],W[h]),H[o]=Math.min(H[o],z[h]),G[o]=Math.max(G[o],z[h])}const R=(h,o)=>{let a=1e18;for(let m=V>>1;m<E;m+=V){const w=h-W[m],q=o-z[m],F=w*w+q*q;F<a&&(a=F)}let n=1e18,x=0;for(let m=0;m<A;m++){const w=h<_[m]?_[m]-h:h>D[m]?h-D[m]:0,q=o<H[m]?H[m]-o:o>G[m]?o-G[m]:0;if(!(w*w+q*q>a))for(let F=m*V,Z=Math.min(E,F+V);F<Z;F++){const Y=h-W[F],te=o-z[F],X=Y*Y+te*te;X<n&&(n=X,x=F)}}return x},C=(h,o)=>{const a=R(h,o);return $(h-W[a],o-z[a])},I=(h,o)=>{const a=R(h,o),n=L[a];return{d:$(h-n[0],o-n[1]),side:n[3]*(h-n[0])-n[2]*(o-n[1])>0?1:-1,s:n[4]}},u=s.range(11,17),y=(h,o=s)=>{const a=o.chance(.62)?f:o.int(0,2),n=(Ye+o.range(-9,9))*U,x=Math.tan(le(u+o.range(-3,3),8,20)*U),m=a===1?o.range(37,46):a===2?o.range(26,30):o.range(28,38),q=(a===1?o.range(14,19):a===2?o.range(20,27):o.range(18,26))*.5*(h?1:.86),F=q*o.range(.75,.95),Z=Math.min(50-F,q*(a===2?o.range(1.9,2.5):o.range(1.3,1.9)));return{kind:a,h:h?m:Math.max(26,m*.86),R:q,aw:F,al:Z,wx:Math.sin(n),wz:-Math.cos(n),leanX:Math.sin(n)*x,leanZ:-Math.cos(n)*x,near:h,x:0,z:0,base:0,flank:0,side:0,s:0,seed:o.range(0,100)}},B=h=>{const o=[];for(let x=0;x<10;x++){const m=x/10*we,w=Math.cos(m),q=Math.sin(m),F=w>0?h.al:h.aw,Z=1.06/Math.sqrt((w/F)**2+(q/h.R)**2);o.push([h.x+(h.wx*w-h.wz*q)*Z,h.z+(h.wz*w+h.wx*q)*Z])}const a=h.x+h.leanX*h.h,n=h.z+h.leanZ*h.h;return o.push([a,n],[a+h.wx*h.R*.7,n+h.wz*h.R*.7],[a-h.wz*h.R*.6,n+h.wx*h.R*.6],[a+h.wz*h.R*.6,n-h.wx*h.R*.6]),o},N=(h,o)=>{const a=h-j.AX,n=o-j.AZ,x=$(a,n);return x>235||t.skinR(Math.atan2(a,-n)/U,j.SHELF+3)<x-4},l=h=>{for(const o of h.pts.slice(0,10))if(t.shelfSd(o[0],o[1])>-5||o[1]<-238||!N(o[0],o[1]))return!1;return!0},e=h=>{h.pts=B(h);let o=1e9;for(const n of h.pts)o=Math.min(o,C(n[0],n[1]));const a=I(h.x,h.z);return h.flank=o,h.side=a.side,h.s=a.s,h},r=(h,o)=>{let a=1e18,n=null,x=null;for(const m of h.pts)for(const w of o.pts){const q=m[0]-w[0],F=m[1]-w[1],Z=q*q+F*F;Z<a&&(a=Z,n=m,x=w)}return n?$(n[0]-x[0],n[1]-x[1]):1e9},c=(h,o=g)=>{let a=1e9;for(const n of o)a=Math.min(a,r(h,n));return a},d=s.int(5,7),P=()=>{const h=[];for(let o=0;o<d;o++)for(let a=0;a<40;a++){const n=y(!0),x=se(M-10,T+10,(o+s.range(.05,.95))/d),m=s.sign();i.posAtDist(x,b),i.tangentAtDist(x,v);const w=$(v.x,v.z)||1,q=s.range(52,96);if(n.x=b.x+v.z/w*m*q,n.z=b.z-v.x/w*m*q,e(n),!(n.flank<45||n.flank>80||!l(n))&&!h.some(F=>r(n,F)<25||F.side!==n.side&&Math.abs(F.s-n.s)<25)){h.push(n);break}}return h};let k=[];for(let h=0;h<16&&k.length<d;h++){const o=P();o.length>k.length&&(k=o),p&&await p()}for(let h=0;h<60&&k.length<d||h<2060&&k.length<4;h++){const o=y(!0),a=s.range(M-10,T+10),n=s.sign();i.posAtDist(a,b),i.tangentAtDist(a,v);const x=$(v.x,v.z)||1,m=s.range(52,96);o.x=b.x+v.z/x*n*m,o.z=b.z-v.x/x*n*m,e(o),!(o.flank<45||o.flank>80||!l(o)||k.some(w=>r(o,w)<25||w.side!==o.side&&Math.abs(w.s-o.s)<25))&&k.push(o)}g.push(...k);const K=fe;for(let h=0,o=0;h<3&&g.length<14&&o<500;o++){const a=y(!1),n=g[s.int(0,g.length-1)],x=s.range(0,we),m=n.R+a.R+s.range(30,52);a.x=n.x+Math.sin(x)*m,a.z=n.z+Math.cos(x)*m,e(a);const w=c(a);p&&o%60===59&&await p(),!(a.flank<82||w<25||w>40||!l(a))&&(g.push(a),h++)}for(let h=0;g.length<14&&h<70;h++){let o=null,a=0;for(let n=0;n<40;n++){const x=y(!1);if(x.x=s.range(K.lobes[1].cx-K.lobes[1].hx,K.cx+K.hx),x.z=s.range(K.cz-K.hz,K.lobes[1].cz+K.lobes[1].hz),e(x),x.flank<82||!l(x))continue;const m=c(x)*s.range(.8,1);m>a&&(a=m,o=x)}o&&c(o)>=25&&g.push(o),p&&h%2===1&&await p()}for(const h of g)h.base=t.height(h.x,h.z),h.h*=Kt[h.kind];return g}function Qt(s,t){const i=oe,f=[],p=s.int(4,6),j=s.range(0,360);for(let b=0;b<p;b++)for(let v=0;v<30;v++){const L=(j+(b+s.range(.1,.9))*360/p)*U,g=s.range(820,1450),M=i.AX+Math.sin(L)*g,T=i.AZ-Math.cos(L)*g,W=s.int(0,2),z=(Ye+s.range(-9,9))*U,E=Math.tan(s.range(9,18)*U),V=W===1?s.range(40,52):W===2?s.range(28,34):s.range(32,42),A=(W===1?s.range(15,20):W===2?s.range(21,28):s.range(19,27))*.5,_=A*s.range(.75,.95),D=A*(W===2?s.range(1.9,2.5):s.range(1.3,1.9)),H=s.range(0,100),G=Math.min(V*.5,2*A*.95);if(!(nt(M,T)<150||t.riverAt(M,T).d<150||f.some(R=>$(R.x-M,R.z-T)<320))){f.push({kind:W,h:G,R:A,aw:_,al:D,wx:Math.sin(z),wz:-Math.cos(z),leanX:Math.sin(z)*E,leanZ:-Math.cos(z)*E,near:!1,x:M,z:T,base:t.height(M,T),flank:g,side:0,s:0,seed:H});break}}return f}async function eo(s,t,i={}){const{rng:f,noise:p,light:j,rock:b}=i,v=[],L=[],g=[];let M=0;for(const z of t){const E=i.cols||(z.near?46:26),V=i.rows||(z.near?46:24),A=v.length/3,_=z.kind===1?f.range(.8,.95):z.kind===2?f.range(.62,.74):f.range(.52,.64),D=z.kind===1?f.range(1.3,1.6):z.kind===2?f.range(1.9,2.5):f.range(1.5,2),H=f.range(.3,.45),G=f.range(.1,.16),R=f.range(.12,.26),C=[],I=f.int(1,2);for(let c=0;c<I;c++)C.push({side:f.sign(),t:f.range(.3,.75),v:f.range(.2,.55),st:f.range(.1,.18),sv:f.range(.12,.2),k:f.range(.12,.22)});const u=z.seed,y=f.range(5,7.5),B=f.range(.12,.2),N=f.range(.45,.7),l=f.range(0,9),e=z.aw+z.al,r=(z.aw+.1*z.al)/e;z.T=z.R*_;for(let c=0;c<=E;c++){const d=.5-.5*Math.cos(Math.PI*c/E),P=-z.aw+e*d,k=Math.max(.6,z.h*(d<r?Math.pow(O(0,1,d/r),.55):1-Math.pow((d-r)/(1-r),D))),K=z.T*Math.pow(Math.sin(Math.PI*Math.pow(d,.6)),.7)+.3,h=1-O(r*.6,r*1.6,d);for(let o=0;o<=V;o++){const a=o<V/2?-1:1,n=Math.abs(2*o/V-1),x=Math.pow(1-Math.pow(n,1.4),.8),m=-3+(k+3)*x,w=le(m/z.h,0,1),q=le(m/k,0,1),F=1+.3*Math.pow(1-O(0,.1,q),2);let Z=1+.1*p.n3(d*3.1+u,w*2.2+u,a*1.7)+.03*p.n3(d*9.3,w*6+u,a*3.3+u),Y=0;for(const ne of C)if(ne.side===a){const re=(d-ne.t)/ne.st,de=(q-ne.v)/ne.sv,ze=ne.k*Math.exp(-re*re-de*de);Z-=ze,Y+=ze}const te=Math.pow(.5+.5*Math.cos(we*(m-N*P+1.4*p.n2(d*2.2+u,m*.05))/y+l),3),X=O(.06,.16,q)*(1-O(.75,.95,q));Z-=B*te*X;const Q=a*K*n*F*Math.max(Z,.4),ae=P+z.aw*h*(H*Math.exp(-Math.pow((w-G)/.09,2))-R*O(.18,.5,w)*(1-O(.75,1,q))),ee=Math.max(m,0);v.push(z.x+z.leanX*ee+z.wx*ae-z.wz*Q,z.base+m,z.z+z.leanZ*ee+z.wz*ae+z.wx*Q);const J=h*Math.exp(-Math.pow((w-G)/.1,2));L.push(0,1,le(1-.9*Y-.3*te*X-.45*J,.3,1)*(.5+.5*O(0,6,m)))}}for(let c=0;c<E;c++)for(let d=0;d<V;d++){const P=A+c*(V+1)+d,k=P+1,K=P+V+1,h=K+1;g.push(P,k,K,k,h,K)}i.shadows!==!1&&M<Ne&&(j.uniforms.uShape.value[M].set(z.x,z.z,z.T,z.h),j.uniforms.uShapeB.value[M].set(z.base,z.leanX,z.leanZ,z.al),M++),await s.yield()}i.shadows!==!1&&(j.uniforms.uShapeN.value=M);const T=new S.BufferGeometry;T.setAttribute("position",new S.Float32BufferAttribute(v,3)),T.setAttribute("aDress",new S.Float32BufferAttribute(L,3)),T.setIndex(g),T.computeVertexNormals();const W=new S.Mesh(T,b);return W.name=i.name||"stone shapes",{object:W,triangles:g.length/3,count:M}}export{Be as AIR,We as BECK,ce as BEDS,xe as BREACH,ve as CLEFT,Dt as CLIMB,ot as CROWN,me as ENTRY,Oe as FAR_RIVER,Ft as FIRST_LEG,_e as LOOK,je as MAX_CLOUDS,Ne as MAX_SHAPES,wt as MOONHEAPS,tt as MOON_EL,Ie as MOON_SIZE,Ce as PACE,Ee as PEAK_GLSL,oe as PLACE,Rt as RIM_OVER,ue as RING,He as RIVER,ie as SEA,Kt as SHAPE_H,fe as SHELF,Pe as SKY_Y,he as TARN,Lt as TERRACE,Xe as TURN_Y,Ye as WIND_BEAR,St as beckD,It as buildHero,eo as buildShapes,pe as faceRadiusAt,nt as farRiverD,$ as hyp,Fe as hyp3,Mt as makeDrift,gt as makeFarSea,lt as makeForm,Ve as makeHour,Gt as makeLand,it as makeLight,$t as makeMoon,xt as makeMoonHeaps,ut as makeRockMaterial,Yt as makeUpperSky,Jt as placeShapes,Qt as placeTors,Zt as routeKnots,Xt as routeLooks,Ut as routePace,Ht as routePlan,Re as skyDir,Ue as skyLaw,Ke as straightY};
