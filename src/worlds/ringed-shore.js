import*as i from"three";import{makePath as Bo,clamp as ge,lerp as se,smoothstep as Qt}from"../kit/core.js";import{buildHero as Po}from"../parts/ringed-shore.js";import*as he from"../kit/flora.js";import*as Re from"../kit/fx.js";import*as eo from"../kit/terrain.js";const Io=["#110838","#371d78","#22aea2","#ff7ab8","#dcae82","#1a1630","#b8fff0"],Xe=6,Ce=.72,to=2*Xe/Ce,oo=2.6,Ue=[{sx:-1,z:-4.5,ph:0},{sx:-1,z:4.5,ph:.25},{sx:1,z:-4.5,ph:.5},{sx:1,z:4.5,ph:.75}],me=10,Te=[0,0];function Go(r){if(r<Ce)return Te[0]=Xe*(1-2*r/Ce),Te[1]=0,Te;const g=(r-Ce)/(1-Ce),h=g*g*(3-2*g);return Te[0]=Xe*(-1+2*h),Te[1]=Math.sin(Math.PI*g)*oo,Te}const ut=`
float footZ(float ph, out float lift){
  const float A = ${Xe.toFixed(2)}, D = ${Ce.toFixed(3)};
  if (ph < D) { lift = 0.; return A * (1. - 2. * ph / D); }
  float t = (ph - D) / (1. - D), s = t * t * (3. - 2. * t);
  lift = sin(3.14159 * t) * ${oo.toFixed(2)};
  return A * (-1. + 2. * s);
}
`,ao=`
uniform vec3 uSunD, uGlowDir, uPink, uMid, uHor, uIce;
vec3 shoreLight(vec3 alb, vec3 N, vec3 V){
  float nd = dot(N, uSunD);
  float k = max(nd, 0.), wrap = max(nd * 0.5 + 0.5, 0.);
  float g = max(dot(N, uGlowDir) * 0.6 + 0.4, 0.);
  vec3 keyC = vec3(0.70, 0.86, 1.0) * 1.7;
  vec3 c = alb * (keyC * (k * 0.85 + wrap * wrap * 0.15) + uPink * g * g * 1.0 + uMid * 0.6 + uHor * 0.14 * (N.y * 0.5 + 0.5));
  float rim = pow(1. - max(dot(N, V), 0.), 3.);
  c += rim * (keyC * 0.22 * wrap + uPink * 0.34 * g) * (0.25 + alb * 2.5);
  return c;
}
`,no=`
attribute vec4 aA;      // leg phase (-1: not a leg), swing weight, lift weight, bob weight
attribute vec4 aB;      // tail weight, head weight, glow, along
attribute vec3 color;
attribute vec3 aInst;   // distance offset, seed, scale
uniform float uDist, uTime, uMirror;
uniform vec3 uCam;
varying vec3 vN, vW, vCol, vL; varying vec4 vB; varying float vSeed, vFar;
#include <fog_pars_vertex>
${ut}
void main(){
  vec3 p = position;
  vL = position;
  // legs, tail and neck never get thinner than about two pixels: fatten them with distance
  vec3 cam = uCam; if (uMirror > 0.5) cam.y = -cam.y;
  float camD = length(cam - (instanceMatrix * vec4(0., 12., 0., 1.)).xyz);
  float thin = (aA.x >= 0. || aB.x > 0. || aB.y > 0.1) && aB.w < 4.5 ? 1. : 0.;
  p += normal * thin * max(camD - 70., 0.) * 0.0012 / aInst.z;
  float lamp = (aA.x < 0. && aB.x <= 0. && aB.z > 0.5) ? 1. : 0.;            // belly lanterns stay a few pixels wide
  p += normal * lamp * max(camD - 70., 0.) * 0.0042 / aInst.z;
  vFar = clamp((camD - 60.) / 200., 0., 1.);
  float d = (uDist + aInst.x) / (${to.toFixed(3)} * aInst.z);
  float seed = aInst.y;
  if (aA.x >= 0.) { float lift; float dz = footZ(fract(d + aA.x), lift); p.z += aA.y * dz; p.y += aA.z * lift; }
  p.y += aA.w * (0.32 * sin(d * 12.566) + 0.12 * sin(uTime * 0.8 + seed * 9.));
  p.x += aA.w * 0.35 * sin(d * 6.283 + 0.6);
  float tw = aB.x * aB.x;
  p.x += tw * (2.8 * sin(uTime * 0.55 + seed * 17. - aB.x * 1.6) + 1.2 * sin(d * 6.283 - aB.x * 2.2));
  p.y += tw * (1.1 * sin(uTime * 0.41 + seed * 5. - aB.x * 1.2));
  p.y += aB.y * (0.7 * sin(uTime * 0.47 + seed * 23.) - 0.25 * sin(d * 12.566 + 1.));
  p.x += aB.y * 1.1 * sin(uTime * 0.29 + seed * 11.);
  vec4 wp = instanceMatrix * vec4(p, 1.);
  vW = wp.xyz; vN = normalize(mat3(instanceMatrix) * normal); vCol = color; vB = aB; vSeed = seed;
  vec4 mvPosition = viewMatrix * modelMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,io=`
precision highp float;
varying vec3 vN, vW, vCol, vL; varying vec4 vB; varying float vSeed, vFar;
uniform vec3 uCam, uDark; uniform float uMirror, uTime;
#include <fog_pars_fragment>
${ao}
float sh21(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float svn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(sh21(i), sh21(i + vec2(1., 0.)), f.x), mix(sh21(i + vec2(0., 1.)), sh21(i + vec2(1., 1.)), f.x), f.y); }
void main(){
  if (vW.y < 0.) discard;
  vec3 cam = uCam; if (uMirror > 0.5) cam.y = -cam.y;
  vec3 V = normalize(cam - vW), N = normalize(vN);
  if (vB.w > 4.5) {
    // knee webs: a translucent membrane, dark violet, pink only where the afterglow shines through it
    float q = (vB.w - 5.) / 0.8, ac = clamp((vB.z - 0.02) / 0.03, 0., 1.);
    // veins fan out from the knee: a ray from the knee keeps its place across the membrane
    float cell = svn(vL.yz * 2.2 + vL.x * 1.3);
    float vein = smoothstep(0.86, 1., abs(sin(ac * 7.854 + (cell - 0.5) * 0.5))) * smoothstep(0.03, 0.2, q);
    float back = pow(max(dot(-V, uGlowDir), 0.), 3.), backK = pow(max(dot(-V, uSunD), 0.), 6.);
    vec3 wcol = (uMid * 0.34 + uDark * 0.25) * (0.6 + 0.5 * cell) + vCol * 0.05;
    wcol += uPink * back * (0.32 + 0.26 * cell) * (0.35 + 0.65 * ac) + vec3(0.6, 0.8, 1.) * backK * 0.3;
    wcol *= 1. - 0.35 * clamp(vein, 0., 1.);
    wcol *= 0.7 + 0.3 * smoothstep(1., 0.55, q);                 // the free edge is thicker and darker
    wcol += uPink * 0.1 * smoothstep(0.25, 0., ac);
    wcol = mix(wcol, uHor * 0.32 + uPink * 0.1 + uMid * 0.14, vFar * 0.7);
    if (uMirror > 0.5) wcol *= 0.84;
    gl_FragColor = vec4(wcol, 1.);
    #include <fog_fragment>
    return;
  }
  vec3 alb = vCol * (0.8 + 0.3 * (1. - vFar) * svn(vec2(vB.w * 60. + vSeed * 30., atan(N.x, N.z + 1e-4) * 4.)));   // fine scales
  float hull = step(0.001, vB.z) * step(vB.w, 0.62) * step(vB.y, 0.01) * step(vB.x, 0.0001);
  float belly = smoothstep(0.1, -0.7, N.y) * hull;
  // hide pattern: ribbed bands along the hull, mottling, a darker ventral stripe and pale flank spots
  float mott = svn(vec2(vL.z * 1.7, atan(vL.x, vL.y - 21.5) * 2.6) + vSeed * 20.);
  float rib = smoothstep(0.2, 0.8, sin(vB.w * 96. + mott * 2.2));
  alb *= mix(1., (0.62 + 0.38 * rib) * (0.75 + 0.5 * mott), hull);
  alb = mix(alb, alb * 1.15 + uPink * 0.04, belly * 0.6);
  alb *= 1. - 0.55 * belly * smoothstep(0.75, 0.15, abs(vL.x));
  float spot = smoothstep(0.72, 0.9, svn(vec2(vL.z * 0.9 + vSeed * 7., vL.y * 0.9))) * hull * (1. - belly);
  alb = mix(alb, alb * 1.5 + uHor * 0.08, spot * 0.6);
  alb *= mix(0.7 + 0.5 * smoothstep(0., 12., vW.y), 1., hull);      // limbs: dark at the waterline, lighter toward the knee
  vec3 col = shoreLight(alb, N, V);
  col += uHor * 0.035 * smoothstep(2., 16., vW.y) * (1. - hull);
  float fr = pow(1. - max(dot(N, V), 0.), mix(1.8, 2.5, hull));
  col += fr * (vec3(0.70, 0.86, 1.0) * 0.55 * max(dot(N, uSunD) * 0.5 + 0.5, 0.) * 0.6 + uPink * 0.15 * max(dot(N, uGlowDir) * 0.5 + 0.5, 0.) + uHor * 0.06);
  // far animals sink into the dusk air: violet-teal silhouettes with lanterns, never black brackets
  col = mix(col, uHor * 0.32 + uPink * 0.1 + uMid * 0.14, vFar * 0.7);
  // every limb carries a lit edge, so a leg reads as a limb and never as a black bar or a wire
  col += fr * (uIce * 0.35 + uPink * 0.25) * (1. - hull) * (1. - 0.45 * vFar);
  // soft lanterns: belly sacs, knee joints, head and the lure at the tail tip
  float pulse = 0.7 + 0.3 * sin(uTime * 1.3 + vSeed * 40. + vB.w * 6.);
  float spots = 0.55 + 0.45 * sin(vB.w * 31. - uTime * 0.9);
  vec3 glowC = mix(uHor * 1.6, uIce, 0.6);
  float ndv = max(dot(N, V), 0.), sac = step(0.6, vB.z) * step(vB.z, 0.65);
  float lampK = mix(0.45 + 0.55 * pow(1. - ndv, 1.5) + belly, (0.3 + 1.2 * (1. - ndv) * (1. - ndv)) * (0.7 + 0.5 * max(-N.y, 0.)), sac);   // sacs: dark core, bright rim
  col += glowC * max(vB.z - 0.05, 0.) * pulse * (0.6 + 0.4 * spots) * 3.2 * lampK * mix(1. - 0.9 * vFar, 1. + 2.4 * vFar, step(0.5, vB.z));   // far away only the lanterns shine, the legs stay clean silhouettes
  col += glowC * spot * 0.22 * pulse;
  if (uMirror > 0.5) col *= 0.84;
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}
`;function Lo(){return{pos:[],nor:[],a:[],b:[],col:[],idx:[]}}function we(r,g,h,c,re){const I=g.length,X=r.pos.length/3,B=new i.Vector3,U=new i.Vector3,T=new i.Vector3,v=new i.Vector3,y=new i.Vector3;for(let f=0;f<I;f++){B.subVectors(g[Math.min(I-1,f+1)],g[Math.max(0,f-1)]).normalize(),f===0&&(U.set(1,0,0),Math.abs(B.x)>.8&&U.set(0,0,1)),U.addScaledVector(B,-U.dot(B)).normalize(),T.crossVectors(B,U).normalize();const p=re(f),m=p.e||[1,1],R=h[f];for(let j=0;j<=c;j++){const S=j/c*Math.PI*2,A=Math.cos(S),l=Math.sin(S);v.copy(g[f]).addScaledVector(U,A*R*m[0]).addScaledVector(T,l*R*m[1]),y.set(0,0,0).addScaledVector(U,A/m[0]).addScaledVector(T,l/m[1]).normalize(),r.pos.push(v.x,v.y,v.z),r.nor.push(y.x,y.y,y.z),r.a.push(p.a[0],p.a[1],p.a[2],p.a[3]),r.b.push(p.b[0],p.b[1],p.b[2],p.b[3]),r.col.push(p.c.r,p.c.g,p.c.b)}}const x=c+1;for(let f=0;f<I-1;f++)for(let p=0;p<c;p++){const m=X+f*x+p,R=m+1,j=m+x,S=j+1;r.idx.push(m,j,R,R,j,S)}}function Ro(r,g){const h=Lo(),c=(v,y,x)=>new i.Vector3(v,y,x),re=g.dark.clone().lerp(g.violet,.5).lerp(g.sand,.1).multiplyScalar(1.15),I=g.dark.clone().lerp(g.violet,.55).lerp(g.sand,.12),X=I.clone().lerp(g.sand,.35),B=21.7;{const v=[-4.9,-4.6,-4.2,-3.6,-3,-2.2,-1.4,-.5,.4,1.3,2.2,2.9,3.6,4.1,4.5].map(m=>m*1.3),y=[.3,1,1.6,2.15,2.6,2.95,3.2,3.15,3,2.7,2.3,1.9,1.5,1.15,.8],x=v.length-1;we(h,v.map((m,R)=>c(0,B+.35*Math.sin(R/x*Math.PI)-.2,m)),y.map((m,R)=>m*(R%2?1.03:.985)),16,m=>({a:[-1,0,0,1],b:[0,0,.04,m/x*.6],c:I,e:[1,.8]}));const f=[-5.7,-3.4,-.8,1.8,4.4],p=[.1,.5,.66,.52,.12];we(h,f.map((m,R)=>c(0,B+2+.6*Math.sin(R/4*Math.PI),m)),p,6,m=>({a:[-1,0,0,1],b:[0,0,0,.7+m*.02],c:X,e:[.5,1.6]}))}for(const[v,y,x]of[[-.7,-3.4,.8],[.75,-2,.6],[-.3,-.9,.95],[.8,.3,.55],[-.75,1.3,.7],[.4,2.6,.75],[-.4,3.9,.5]]){const f=B-2-.45*Math.cos(y*.3);we(h,[c(v,f,y),c(v,f-.5,y),c(v*1.05,f-.95,y),c(v*1.1,f-1.45,y),c(v*1.1,f-1.9,y),c(v*1.1,f-2.2,y)],[.1*x,.16*x,.4*x,.56*x,.4*x,.05],8,p=>({a:[-1,0,0,1],b:[0,0,p<2?.1:.62,.7+y*.05+p*.012],c:X,e:[1,1]}))}{const v=[c(0,B+.1,4.6),c(0,B+.3,6),c(0,B-.4,7),c(0,B-1.7,8),c(0,B-2.8,8.5),c(0,B-3.5,9.2),c(0,B-3.9,10.1),c(0,B-4,10.6)],y=[.9,.7,.52,.42,.38,.7,.56,.1],x=[0,.15,.35,.6,.8,1,1,1],f=[0,0,0,0,0,.3,.7,.2];we(h,v,y,8,p=>({a:[-1,0,0,1],b:[0,x[p],f[p],.8+p*.05],c:p>4?X:I,e:[1,1]}))}{const y=[],x=[],f=[];for(let p=0;p<=15;p++){const m=p/15;y.push(c(0,B+.2+1.2*Math.sin(m*Math.PI)+10.5*Math.pow(m,1.7),-5.6-15.5*Math.pow(m,.8))),x.push(p===15?.08:p>=13?.42:se(.85,.12,Math.pow(m,.7))),f.push(m)}we(h,y,x,7,p=>({a:[-1,0,0,1],b:[f[p],0,p>=13?1:p%3===1?.22:0,1.2+p*.07],c:I,e:[1,1]}))}for(const v of Ue){const y=v.z,x=c(v.sx*1.15,B+.5,y*.55),f=c(v.sx*(me-3.4),25.8,y*.85),p=[],m=[],R=[];for(let D=0;D<=5;D++){const q=D/5;p.push(x.clone().lerp(f,q).add(c(0,Math.sin(q*Math.PI)*1.1,0))),m.push(se(.72,.46,q)+(D===5?.22:0)),R.push(q)}we(h,p,m,7,D=>({a:[v.ph,.22*R[D],0,1-R[D]],b:[0,0,D===5?.5:0,2+R[D]*.2],c:re,e:[1,1]}));const j=[],S=[],A=[],l=c(v.sx*me,0,y);for(let D=0;D<=10;D++){const q=D/10;j.push(f.clone().lerp(l,q)),A.push(q),S.push(D===0?.66:D===10?.75:D===9?.3:se(.46,.21,q)+(D%3===0?.09:0))}we(h,j,S,7,D=>({a:[v.ph,.22+.78*A[D],A[D],0],b:[0,0,D===0?.55:D%3===0&&D<10?.06:0,2.3+A[D]*.9],c:re,e:[1,1]}))}const U=X.clone().lerp(g.pink,.3).lerp(g.teal,.15);for(const v of Ue){const y=v.z,x=c(v.sx*1.15,B+.5,y*.55),f=c(v.sx*(me-3.4),25.8,y*.85),p=c(v.sx*me,0,y),m=6,R=h.pos.length/3,j=c(0,0,1);for(let S=0;S<=m;S++){const A=S/m,l=1-A*.8,D=A*.42,q=x.clone().lerp(f,l).add(c(0,Math.sin(l*Math.PI)*1.1-.2,0)),Ve=f.clone().lerp(p,D).add(c(-v.sx*.15,0,0)),Ze=q.clone().lerp(Ve,.5).add(c(v.sx*1.1*Math.sin(A*Math.PI*.5),.9*A,0)),_e=[v.ph,.22*l,0,1-l],M=[v.ph,.22+.78*D,D,0],le=[v.ph,(_e[1]+M[1])/2,D/2,(1-l)/2];for(const[Be,ye,Oe]of[[q,_e,.02],[Ze,le,.05],[Ve,M,.02]])h.pos.push(Be.x,Be.y,Be.z),h.nor.push(j.x*.6,.5,v.z>0?.62:-.62),h.a.push(ye[0],ye[1],ye[2],ye[3]),h.b.push(0,0,Oe,5+A*.8),h.col.push(U.r,U.g,U.b)}for(let S=0;S<m;S++)for(let A=0;A<2;A++){const l=R+S*3+A,D=l+3;h.idx.push(l,D,l+1,l+1,D,D+1)}}const T=new i.BufferGeometry;return T.setAttribute("position",new i.Float32BufferAttribute(h.pos,3)),T.setAttribute("normal",new i.Float32BufferAttribute(h.nor,3)),T.setAttribute("aA",new i.Float32BufferAttribute(h.a,4)),T.setAttribute("aB",new i.Float32BufferAttribute(h.b,4)),T.setAttribute("color",new i.Float32BufferAttribute(h.col,3)),T.setIndex(h.idx),T}const ft=15,Uo=`
attribute vec2 aCorner;
attribute vec4 aRing;      // foot x, rest z, gait phase, strider index
uniform vec4 uStr[9];      // x, z, yaw, gait distance in strides
uniform float uScl[9];
varying vec2 vUv; varying float vAmp, vSeed;
#include <fog_pars_vertex>
${ut}
void main(){
  int i = int(aRing.w + 0.5);
  vec4 s = uStr[i]; float sc = uScl[i];
  float lift; float dz = footZ(fract(s.w + aRing.z), lift);
  vec2 l = vec2(aRing.x, aRing.y + dz) * sc;
  float cy = cos(s.z), sy = sin(s.z);
  vec2 c = s.xy + vec2(l.x * cy + l.y * sy, -l.x * sy + l.y * cy);
  vAmp = (1. - smoothstep(0.05, 1.2, lift)) * step(0.01, sc);
  vUv = aCorner; vSeed = aRing.z * 17. + aRing.w * 3.1;
  vec4 mvPosition = viewMatrix * vec4(c.x + aCorner.x * ${ft.toFixed(1)}, 0.04, c.y + aCorner.y * ${ft.toFixed(1)}, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,Vo=`
precision highp float;
varying vec2 vUv; varying float vAmp, vSeed;
uniform float uTime; uniform vec3 uIce, uPink;
#include <fog_pars_fragment>
void main(){
  float r = length(vUv);
  if (r > 1. || vAmp < 0.01) discard;
  float R = r * ${ft.toFixed(1)};
  float w = sin(R * 1.9 - uTime * 3.4 + vSeed);
  float crest = smoothstep(0.55, 1., w) - 0.5 * smoothstep(0.55, 1., -w);
  float env = smoothstep(0.25, 1.3, R) * pow(1. - r, 1.6);
  vec3 col = mix(uIce, uPink, 0.25) * crest * env * vAmp * 0.9;
  float fogF = 0.;
  #ifdef FOG_EXP2
  fogF = 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  #endif
  gl_FragColor = vec4(max(col, 0.) * (1. - fogF), 1.);
}
`,Eo=`
attribute vec2 aCorner;    // x: 0 at the foot .. 1 at the far end, y: -1..1 across
attribute vec4 aRing;      // foot x, rest z, gait phase, strider index
attribute float aKind;     // 0: thrown by the small sun (long, violet), 1: thrown by the afterglow (shorter, teal)
uniform vec4 uStr[9];
uniform float uScl[9];
uniform vec2 uDirS, uDirG;
varying vec2 vUv; varying float vAmp, vKind;
#include <fog_pars_vertex>
${ut}
void main(){
  int i = int(aRing.w + 0.5);
  vec4 s = uStr[i]; float sc = uScl[i];
  float lift; float dz = footZ(fract(s.w + aRing.z), lift);
  vec2 l = vec2(aRing.x, aRing.y + dz) * sc;
  float cy = cos(s.z), sy = sin(s.z);
  vec2 c = s.xy + vec2(l.x * cy + l.y * sy, -l.x * sy + l.y * cy);
  vec2 d = aKind < 0.5 ? uDirS : uDirG;
  float len = (aKind < 0.5 ? 64. : 40.) * sc, wid = (aKind < 0.5 ? 1.5 : 1.15) * sc * (1. + 1.6 * aCorner.x);
  c += d * (aCorner.x * len - 0.8) + vec2(-d.y, d.x) * aCorner.y * wid;
  vAmp = (1. - smoothstep(0.05, 1.6, lift)) * step(0.01, sc);
  vUv = aCorner; vKind = aKind;
  vec4 mvPosition = viewMatrix * vec4(c.x, 0.045, c.y, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,Wo=`
precision highp float;
varying vec2 vUv; varying float vAmp, vKind;
uniform vec3 uColS, uColG;
#include <fog_pars_fragment>
void main(){
  float vy = clamp(vUv.y, -1., 1.), a = 1. - vy * vy; a *= a;   // clamped: multisampling extrapolates vUv.y past its range on quads seen edge-on
  a *= smoothstep(0., 0.03, vUv.x) * pow(max(1. - vUv.x, 0.), 1.4) * vAmp;
  float fogF = 0.;
  #ifdef FOG_EXP2
  fogF = 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  #endif
  gl_FragColor = vec4(vKind < 0.5 ? uColS : uColG, a * (vKind < 0.5 ? 0.9 : 0.8) * (1. - fogF));
}
`,so=`
attribute vec3 aW;       // span weight 0..1, tail weight 0..1, chord
attribute vec4 aI;       // loop centre xyz, loop radius
attribute vec4 aJ;       // phase, angular speed, size, seed
uniform float uTime;
varying vec3 vW; varying vec2 vUv; varying float vSeed, vTail;
#include <fog_pars_vertex>
void main(){
  float seed = aJ.w, a = aJ.x + uTime * aJ.y;
  vec3 c = aI.xyz + vec3(cos(a) * aI.w, sin(a * 1.7 + seed * 9.) * 2.2 + sin(uTime * 0.21 + seed * 30.) * 3., sin(a) * aI.w * 0.72);
  vec3 fwd = normalize(vec3(-sin(a), 0.12 * cos(a * 1.7 + seed * 9.), cos(a) * 0.72)) * sign(aJ.y);
  vec3 inw = normalize(vec3(-cos(a), 0., -sin(a) * 0.72));
  vec3 up = normalize(vec3(0., 1., 0.) + inw * 0.38);
  vec3 rt = normalize(cross(up, fwd)); up = cross(fwd, rt);
  vec3 p = position;
  float sw = aW.x * aW.x;
  p.y += sw * (0.55 + 0.75 * sin(uTime * 1.25 + seed * 20.)) + aW.x * 0.09 * sin(uTime * 2.6 - p.z * 1.6 + seed * 7.);
  float tw = aW.y;
  p.x += tw * (0.25 + tw) * 0.55 * sin(uTime * 2.1 - tw * 6.5 + seed * 11. + position.x * 2.);
  p.y += tw * 0.4 * sin(uTime * 1.5 - tw * 5. + seed * 3.) - tw * tw * 0.9;
  vec3 wp = c + (rt * p.x + up * p.y + fwd * p.z) * aJ.z;
  vW = wp; vUv = vec2(aW.x, aW.z); vSeed = seed; vTail = tw;
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(wp, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,ro=`
precision highp float;
varying vec3 vW; varying vec2 vUv; varying float vSeed, vTail;
uniform vec3 uCam, uSunD, uGlowDir, uPink, uHor, uIce, uMid;
uniform float uMirror, uTime;
#include <fog_pars_fragment>
void main(){
  if (vW.y < 0.) discard;
  vec3 cam = uCam; if (uMirror > 0.5) cam.y = -cam.y;
  vec3 V = normalize(cam - vW);
  // a soft back-lit film: faint ribs, a bright leading edge and spine, fading toward the trailing edge and the tip
  float veins = smoothstep(0.9, 1., abs(sin(vUv.x * 15.7))) * (1. - vUv.x);
  float edge = smoothstep(0.14, 0., vUv.y) * (1. - 0.6 * vUv.x) + 0.25 * smoothstep(0.92, 1., vUv.y);
  float spine = smoothstep(0.07, 0., vUv.x);
  vec3 tint = mix(uIce, mix(uHor * 2., uPink, step(0.6, fract(vSeed * 7.3))), 0.25 + 0.5 * vUv.x);
  tint = mix(tint, mix(uIce, uPink, vUv.y), 0.55);
  // translucent membrane: lit from behind by the afterglow and the small sun
  float back = pow(max(dot(-V, uGlowDir), 0.), 3.) * 1.2 + pow(max(dot(-V, uSunD), 0.), 8.) * 2.2;
  float shim = 0.75 + 0.25 * sin(uTime * 1.7 + vSeed * 50. + vUv.x * 8.);
  vec3 col = tint * (0.34 + 0.5 * back) * shim + (uIce * 0.9 + uPink * 0.4) * (veins * 0.15 + edge * 0.6 + spine * 0.7);
  float alpha = clamp((0.2 + 0.12 * back) * (1. - 0.45 * vUv.y) + veins * 0.08 + edge * 0.4 + spine * 0.5, 0., 0.92);
  if (vTail > 0.) { float tl = clamp(vTail, 0., 1.); col = mix(uPink, uIce, tl) * (1.3 - tl * 0.6); alpha = 0.75 * (1. - tl * 0.7); }   // clamped: multisampling extrapolates vTail on the thin ribbons
  if (uMirror > 0.5) { col *= 0.8; alpha *= 0.85; }
  gl_FragColor = vec4(col, alpha);
  #include <fog_fragment>
}
`;function No(){const r=[],g=[],h=[],c=[0,0,1.7],re=[0,0,-2.3],I=6,X=4,B=(T,v,y)=>[T[0]+(v[0]-T[0])*y,T[1]+(v[1]-T[1])*y,T[2]+(v[2]-T[2])*y];for(const T of[-1,1]){const v=[T*2.9,0,-.1],y=r.length/3;for(let x=0;x<=I;x++)for(let f=0;f<=X;f++){const p=x/I,m=f/X,R=B(c,v,p),j=B(re,v,p),S=B(R,j,m);S[2]-=Math.sin(p*Math.PI)*.35*(m-.3),r.push(S[0],S[1],S[2]),g.push(p,0,m)}for(let x=0;x<I;x++)for(let f=0;f<X;f++){const p=y+x*(X+1)+f,m=p+X+1;h.push(p,m,p+1,p+1,m,m+1)}}for(const T of[-1,1]){const v=r.length/3,y=12;for(let x=0;x<=y;x++){const f=x/y,p=-2.2-f*7.5,m=.11*(1-f*.6);r.push(T*.16-m,0,p,T*.16+m,0,p),g.push(0,f,.5,0,f,.5)}for(let x=0;x<y;x++){const f=v+x*2;h.push(f,f+2,f+1,f+1,f+2,f+3)}}const U=new i.BufferGeometry;return U.setAttribute("position",new i.Float32BufferAttribute(r,3)),U.setAttribute("aW",new i.Float32BufferAttribute(g,3)),U.setIndex(h),U}const lo=`
attribute vec3 color;
varying vec3 vN, vW, vCol;
#include <fog_pars_vertex>
void main(){
  vW = position; vN = normal; vCol = color;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,co=`
precision highp float;
varying vec3 vN, vW, vCol;
uniform vec3 uCam, uSand; uniform float uMirror;
#include <fog_pars_fragment>
${ao}
float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vn2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
void main(){
  if (vW.y < 0.) discard;
  vec3 cam = uCam; if (uMirror > 0.5) cam.y = -cam.y;
  vec3 V = normalize(cam - vW), N = normalize(vN);
  float a = atan(vW.x, vW.z) * 40.;
  float bed = vn2(vec2(vW.y * 0.22 + vn2(vec2(a * 0.05, vW.y * 0.02)) * 3., 3.7));
  float streak = vn2(vec2(a, vW.y * 0.03));
  vec3 alb = vCol * (0.6 + 0.6 * bed) * (0.85 + 0.3 * streak);
  alb = mix(alb, uSand * 0.25, smoothstep(0.62, 0.9, bed) * 0.35);
  // vertical fractures and joints, talus-dark ledges
  float hx = vW.x * 0.23 + vW.z * 0.19;
  float crack = smoothstep(0.72, 1., vn2(vec2(hx * 1.6, vW.y * 0.012))) + 0.6 * smoothstep(0.8, 1., vn2(vec2(hx * 5. + 9., vW.y * 0.03)));
  alb *= 1. - 0.5 * clamp(crack, 0., 1.);
  float grit = vn2(vec2(hx * 9., vW.y * 0.9)) - 0.5;
  alb *= 1. + 0.35 * grit;
  alb *= 0.45 + 0.55 * smoothstep(0., 9., vW.y);                    // wet tide line
  // rough rock relief in the lighting
  vec3 tg = normalize(cross(N, vec3(0., 1., 0.)) + 1e-4);
  N = normalize(N + tg * (vn2(vec2(hx * 0.9, vW.y * 0.06)) - 0.5) * 0.9 + vec3(0., 1., 0.) * (bed - 0.5) * 0.5 + tg * grit * 0.3);
  vec3 col = shoreLight(alb, N, V);
  // a decided key: lit flank toward the small sun, violet shadow side
  float kd = smoothstep(-0.2, 0.55, dot(N, uSunD));
  col = mix(col * vec3(0.6, 0.52, 0.88) + uMid * 0.012, col * 1.2 + alb * vec3(0.7, 0.86, 1.) * 0.55, kd);
  if (uMirror > 0.5) col *= 0.85;
  gl_FragColor = vec4(col, 1.);
  // capped haze: far stacks sink into the mist but keep their lit flank and shadow side
  #ifdef FOG_EXP2
  float ff = 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor * vec3(0.8, 0.82, 0.95), min(ff, 0.8));
  #endif
}
`,uo=(r,g)=>{const h=new i.InstancedMesh(r.geometry,g||r.material,r.count);return h.instanceMatrix=r.instanceMatrix,r.instanceColor&&(h.instanceColor=r.instanceColor),h.scale.y=-1,h};var Ko={id:"ringed-shore",name:"The Ringed Shore",category:"alien",weirdness:.45,async build(r){const g=r.rng,h=new i.Scene,c=g.sign(),re=g.pick(["afterglow","teal","violet"]),I=Io.slice();re==="teal"&&(I[0]="#0b1038",I[1]="#2b2a7c",I[2]="#2cc4a4",I[3]="#ff8cb4"),re==="violet"&&(I[0]="#170634",I[1]="#4a1c84",I[2]="#2a9cba",I[3]="#ff6ac6");const X=g.range(.45,1.25),B=g.int(18,28),U=g.range(42,46),T=g.range(2.9,3.5),v=r.core.makeRng((Math.imul(r.seed|0,2654435761)^24301)>>>0),y=v.int(0,2),x=I.map(e=>new i.Color(e)),f=(e,a,t,o)=>x[e].clone().multiplyScalar(a).add(x[t].clone().multiplyScalar(o)),p=[{bandA:f(4,.95,3,0),bandB:f(3,.8,4,.15),ring:[1.24,2.08],moon:v.chance(.5)?[v.range(-.55,-.1),v.range(-.3,.35),.06,.0022]:null},{bandA:f(4,.8,6,.3),bandB:f(1,1.5,3,.45),ring:[1.5,2.26],moon:[v.range(-.5,0),v.range(-.25,.4),.075,.0026]},{bandA:f(3,.9,4,.25),bandB:f(4,.7,2,.3),ring:[1.16,1.86],moon:null}][y],m=v.range(-.55,.55),R=v.int(88,128),j=v.chance(.5)?-1:1,S=await Po(r,{palette:I,look:p,planetElev0:18.6,planetSize0:33.5,planetElev:g.range(18.8,19),planetSize:34.5,planetElev1:18.4,ringTilt:g.range(12,21),sky:"full"});h.add(S.object);const A=S.anchors,l=S.colors;await r.yield();const D=l.teal.clone().multiplyScalar(.4).add(l.pink.clone().multiplyScalar(.07)).add(l.violet.clone().multiplyScalar(.27));h.fog=new i.FogExp2(D,.00105*(.85+.25*X));const q=new i.DirectionalLight(A.keyLight.color,2.3);q.position.copy(A.sunDir).multiplyScalar(400);const Ve=new i.HemisphereLight(l.violet.clone().lerp(l.pink,.4).multiplyScalar(1.6),l.teal.clone().lerp(l.violet,.5).multiplyScalar(.9),1.5);h.add(q,Ve);const Ze=e=>[e[0]*c,e[1],e[2]],_e=[[0,4,880],[0,4.2,812],[-2,5,742],[-8,6.6,662],[-26,8.6,582],[-42,9.6,512],[-38,11,452],[-24,14.5,396],[-9,18.6,336]].map(Ze);for(let e=0;e<A.flyThrough.length-1;e++)_e.push([A.flyThrough[e].x,A.flyThrough[e].y,A.flyThrough[e].z]);const M=Bo(_e),le=()=>g.range(-10,10),Be=60,ye=280,Oe=150,qe=(e,a)=>{const t=se(Be,ye,e/2),o=M.posAtDist(t),n=M.tangentAtDist(t),s=c*(Oe*(1-e/3)-a)/(Math.hypot(n.x,n.z)||1);return new i.Vector3(o.x+n.z*s,0,o.z-n.x*s)},fo=[qe(0,le()),qe(1,le()),qe(2,0),...[[-42,512],[-46,450],[-64,396],[-100+le()*.4,348],[-150+le()*.4,306],[-210+le()*.4,270],[-280+le()*.4,240],[-360+le()*.4,216],[-450,198],[-560,184],[-680,176]].map(([e,a])=>new i.Vector3(e*c,0,a))],Pe=new i.CatmullRomCurve3(fo,!1,"centripetal");Pe.arcLengthDivisions=600;const $e=Pe.getLength(),te=260,xe=new Float32Array(te+1),be=new Float32Array(te+1),Ee=new Float32Array(te+1),We=new Float32Array(te+1),N=new i.Vector3,Q=new i.Vector3;for(let e=0;e<=te;e++)Pe.getPointAt(e/te,N),xe[e]=N.x,be[e]=N.z,Pe.getTangentAt(e/te,Q),Ee[e]=Q.x,We[e]=Q.z;const Ne=e=>{const a=ge(e/$e,.002,.998)*te,t=Math.min(te-1,Math.floor(a)),o=a-t;N.set(xe[t]+(xe[t+1]-xe[t])*o,0,be[t]+(be[t+1]-be[t])*o);const n=Ee[t]+(Ee[t+1]-Ee[t])*o,s=We[t]+(We[t+1]-We[t])*o,u=Math.hypot(n,s)||1;Q.set(n/u,0,s/u)},po=24,dt=[[-c*(54+g.range(-4,4)),146+g.range(-6,6),c*.9,-.44],[-c*(100+g.range(-4,4)),-88+g.range(-6,6),c*.9,-.44],[c*(68+g.range(-4,4)),60+g.range(-8,8),-c*.85,-.53]].map(([e,a,t,o])=>{const n=Math.hypot(t,o);return{x:e,z:a,dx:t/n,dz:o/n,yaw:Math.atan2(t,o)}}),ue=(e,a)=>{let t=1e9;for(let o=0;o<=te;o++){const n=xe[o]-e,s=be[o]-a,u=n*n+s*s;u<t&&(t=u)}t=Math.sqrt(t)-po;for(const o of dt){const n=ge((e-o.x)*o.dx+(a-o.z)*o.dz,-150,50),s=Math.hypot(e-o.x-o.dx*n,a-o.z-o.dz*n);s<t&&(t=s)}return t},pt=180,vt=(e,a)=>{let t=0;for(let o=0;o<=te;o++){const n=xe[o]-e.x,s=be[o]-e.z;n*n+s*s<pt*pt&&(t+=s*a.x-n*a.z)}return Math.sign(t)};await r.yield();const gt=M.pointAt(.42);let je=0;{let e=1e9;for(let a=0;a<=1600;a++){Pe.getPointAt(a/1600,N);const t=N.distanceToSquared(new i.Vector3(gt.x,0,gt.z));t<e&&(e=t,je=a/1600*$e)}}await r.yield();const fe={uSunD:{value:A.sunDir.clone()},uGlowDir:{value:A.glowDir.clone()},uPink:{value:l.pink},uMid:{value:l.violet},uHor:{value:l.teal},uIce:{value:l.ice},uSand:{value:l.sand},uDark:{value:l.dark},uCam:{value:new i.Vector3(0,4,880)},uTime:{value:0},uDist:{value:0}},Me=(e,a,t,o={})=>new i.ShaderMaterial({uniforms:{...i.UniformsUtils.clone(i.UniformsLib.fog),...fe,uMirror:{value:t}},vertexShader:e,fragmentShader:a,fog:!0,side:i.DoubleSide,...o}),ze=new i.Group;ze.name="mirror-images",h.add(ze);const ce=9,ae=2,ht=75,Ae=[-2*ht,-ht,0,96,156,218,640,740,900],ke=[],mt=[];for(let e=0;e<ce;e++)e!==ae&&(Ae[e]+=g.range(-9,9)),ke.push(e===ae?1:g.range(.86,1.1)),mt.push(g());await r.yield();const wt=Ro(g.fork("strider"),l);await r.yield();const yt=new Float32Array(ce*3);for(let e=0;e<ce;e++)yt.set([Ae[e],mt[e],ke[e]],e*3);wt.setAttribute("aInst",new i.InstancedBufferAttribute(yt,3));const Ie=new i.InstancedMesh(wt,Me(no,io,0),ce);Ie.frustumCulled=!1;const xt=uo(Ie,Me(no,io,1));xt.frustumCulled=!1,h.add(Ie),ze.add(xt);const Ge=[],bt=ke.slice();for(let e=0;e<ce;e++)Ge.push(new i.Vector4);{const e=[],a=[],t=[],o=[];let n=0;for(let O=0;O<ce;O++)for(const L of Ue){for(const E of[[-1,-1],[1,-1],[1,1],[-1,1]])e.push(E[0],E[1]),a.push(L.sx*me,L.z,L.ph,O),o.push(0,0,0);t.push(n,n+2,n+1,n,n+3,n+2),n+=4}const s=new i.BufferGeometry;s.setAttribute("position",new i.Float32BufferAttribute(o,3)),s.setAttribute("aCorner",new i.Float32BufferAttribute(e,2)),s.setAttribute("aRing",new i.Float32BufferAttribute(a,4)),s.setIndex(t);const u=new i.Mesh(s,new i.ShaderMaterial({uniforms:{...i.UniformsUtils.clone(i.UniformsLib.fog),uStr:{value:Ge},uScl:{value:bt},uTime:fe.uTime,uIce:fe.uIce,uPink:fe.uPink},vertexShader:Uo,fragmentShader:Vo,fog:!0,transparent:!0,depthWrite:!1,blending:i.AdditiveBlending,side:i.DoubleSide}));u.frustumCulled=!1,u.renderOrder=2,h.add(u);const w=[],z=[],F=[],b=[],P=[];let G=0;for(let O=0;O<ce;O++)for(const L of Ue)for(let E=0;E<2;E++){for(const d of[[0,-1],[1,-1],[1,1],[0,1]])w.push(d[0],d[1]),z.push(L.sx*me,L.z,L.ph,O),F.push(E),P.push(0,0,0);b.push(G,G+2,G+1,G,G+3,G+2),G+=4}const ee=new i.BufferGeometry;ee.setAttribute("position",new i.Float32BufferAttribute(P,3)),ee.setAttribute("aCorner",new i.Float32BufferAttribute(w,2)),ee.setAttribute("aRing",new i.Float32BufferAttribute(z,4)),ee.setAttribute("aKind",new i.Float32BufferAttribute(F,1)),ee.setIndex(b);const $=new i.Mesh(ee,new i.ShaderMaterial({uniforms:{...i.UniformsUtils.clone(i.UniformsLib.fog),uStr:{value:Ge},uScl:{value:bt},uDirS:{value:new i.Vector2(-A.sunDir.x,-A.sunDir.z).normalize()},uDirG:{value:new i.Vector2(-A.glowDir.x,-A.glowDir.z).normalize()},uColS:{value:l.violet.clone().lerp(l.pink,.3).multiplyScalar(.78)},uColG:{value:l.teal.clone().multiplyScalar(.5)}},vertexShader:Eo,fragmentShader:Wo,fog:!0,transparent:!0,depthWrite:!1,side:i.DoubleSide}));$.name="strider-shadows",$.frustumCulled=!1,$.renderOrder=1.35,h.add($)}let Se=0,Je=null,Mt=0;const zt=14,At=new i.Matrix4,vo=new i.Quaternion,go=new i.Vector3,ho=new i.Vector3(0,1,0),kt=e=>je-T*(.42-e)*U+zt*Math.tanh(Se/zt),St=new i.Vector3,mo=(e,a)=>(Ne(kt(a)),St.set(N.x,20.5,N.z),St),wo=[[ae,0],[ae,1],[ae,2],[ae,3],[ae+1,c>0?0:2],[ae+1,c>0?1:3]],yo=[[6,0],[6,1],[6,2],[6,3],[8,c>0?2:0],[8,c>0?3:1]],Dt=[-10,12,0,24,-9,15,0,0,0].map(e=>e*c),xo=je+T*.38*U,Ft=12*c,Ye=30,Ct=3;function Tt(e){const a=kt(e);fe.uDist.value=a;for(let o=0;o<ce;o++){let n;if(o>=6){const s=dt[o-6],u=a-xo;N.set(s.x+s.dx*u,0,s.z+s.dz*u),n=s.yaw}else if(o===ae){const s=a+Ae[o],u=ge((s-(je-Ye))/(Ye-Ct),0,1),w=Ft*(1-u*u*(3-2*u)),z=-Ft*6*u*(1-u)/(Ye-Ct);Ne(s);const F=Q.z,b=-Q.x;n=Math.atan2(Q.x+F*z,Q.z+b*z),N.x+=F*w,N.z+=b*w}else Ne(a+Ae[o]),n=Math.atan2(Q.x,Q.z),N.x+=Q.z*Dt[o],N.z-=Q.x*Dt[o];At.compose(N,vo.setFromAxisAngle(ho,n),go.setScalar(ke[o])),Ie.setMatrixAt(o,At),Ge[o].set(N.x,N.z,n,(a+Ae[o])/(to*ke[o]))}Ie.instanceMatrix.needsUpdate=!0;const t=e>.52?yo:wo;for(let o=0;o<t.length;o++){const n=Ge[t[o][0]],s=Ue[t[o][1]],u=ke[t[o][0]],w=((n.w+s.ph)%1+1)%1,z=Go(w),F=s.sx*me*u,b=(s.z+z[0])*u,P=Math.cos(n.z),G=Math.sin(n.z);S.setRipple(2+o,n.x+F*P+b*G,n.y-F*G+b*P,z[1]>.05?.25:1.3,o*1.7)}}Tt(0),await r.yield();const k=g.fork("spires"),_t=[[],[],[],[]],bo=e=>e>600?0:e>430?1:e>210?2:3,Qe=(e,a,t,o)=>!(M.nearestXZ(e,a).dist<o+t*.36||ue(e,a)<17+t*.3||a<300&&Math.abs(e)<16+(300-a)*.2||Math.hypot(e,a)<46||a>850&&Math.abs(e)<30),De=[],Fe=(e,a,t,o={})=>{_t[bo(a)].push({x:e,z:a,h:t,lean:[k.gauss()*.07,k.gauss()*.07],...o}),t>3.2&&De.push([e,a,t,t*.07+.5])};for(const[e,a,t]of[[c*44,640,36],[c*36,722,30],[-c*24,772,26]])Fe(e+k.range(-2,2),a+k.range(-5,5),t*k.range(.92,1.1),{dark:.22,r:t*.09,glow:.7,shards:5,tip:!0,lean:[k.gauss()*.03,k.gauss()*.03]});for(let e=0,a=0;e<900&&a<R;e++){const t=k.range(232,476),o=Math.pow(k(),1.5),n=9+o*95,s=M.nearestXZ(0,t),u=M.pointAt(s.u).x,w=u+(k()<.5+.5*m?-1:1)*n+k.range(-3,3),z=se(5,40,Math.pow(k(),2.2))*(.45+.55*Qt(8,46,n));Qe(w,t,z,8.5)&&(Fe(w,t,z),a++)}await r.yield();for(let e=0,a=0;e<600&&a<52;e++){const t=k.range(-380,380),o=k.range(60,660),n=se(7,36,Math.pow(k(),1.8));Math.abs(t)<34||!Qe(t,o,n,30)||(Fe(t,o,n,{shards:k.int(1,2)}),a++)}await r.yield();for(let e=0;e<4;e++){const a=.07+e*.1+k.range(-.02,.02),t=M.pointAt(a),o=-(vt(t,M.tangentAt(a))||-c)*k.range(30,62)*(e===2?.55:1),n=k.int(5,9);for(let s=0;s<n;s++){const u=t.x+o+k.gauss()*9,w=t.z+k.gauss()*12,z=se(4,24,Math.pow(k(),1.6));Qe(u,w,z,14)&&Fe(u,w,z)}}await r.yield();for(let e=0,a=0;e<700&&a<130;e++){const t=k.range(.03,.97),o=M.pointAt(t),n=M.tangentAt(t),s=k.sign()*(7.5+Math.pow(k(),1.4)*26),u=o.x-n.z*s,w=o.z+n.x*s,z=k.range(.5,2.6)*(k.chance(.12)?2:1);M.nearestXZ(u,w).dist<7.2||ue(u,w)<13||Math.hypot(u,w)<40||(Fe(u,w,z,{shards:k.int(1,3),tip:k.chance(.25),glow:.5,lean:[k.gauss()*.3,k.gauss()*.3]}),a++,(e&127)===127&&await r.yield())}for(const[e,a,t]of[[c*j*15.5,812,18],[-c*j*17.5,800,24]])Fe(e,a+k.range(-4,4),t*k.range(.92,1.08),{dark:.22,r:t*.075,glow:.3,shards:2,tip:!0,lean:[k.gauss()*.02,k.gauss()*.02]});await r.yield();const Bt=[];for(const e of _t){if(!e.length)continue;const a=await S.buildCrystals(e,k,()=>r.yield());S.object.add(a.object);for(const t of a.tips)Bt.push(t);await r.yield()}S.object.add(S.buildTipGlints(Bt,k)),await r.yield();const H=r.core.makeRng((Math.imul(r.seed|0,2654435761)^49573)>>>0),Pt=[[],[]],It=(e,a,t,o)=>{Pt[a>430?0:1].push({x:e,z:a,h:t,...o}),t>3.2&&De.push([e,a,t,t*.07+.5])},Gt=36;for(let e=0;e<Gt;e++){const a=.045+(e+H())/Gt*.9,t=M.pointAt(a),o=M.tangentAt(a),n=t.z<300,s=n?H.range(12.5,17.5):H.range(9.6,16),u=H.range(3,6)*(n?.8:1),w=H.gauss()*.1,z=H.gauss()*.1;for(const F of e%2?[1,-1]:[-1,1]){const b=t.x-o.z*s*F,P=t.z+o.x*s*F;if(!(M.nearestXZ(b,P).dist<9.2||ue(b,P)<13||Math.hypot(b,P)<40)){It(b,P,u,{shards:3,tip:!0,glow:.6,lean:[w,z]});break}}}await r.yield();for(let e=0,a=0;e<300&&a<16;e++){const t=H.range(.03,.97),o=M.pointAt(t),n=M.tangentAt(t),s=H.sign()*(7.5+Math.pow(H(),1.4)*26),u=o.x-n.z*s,w=o.z+n.x*s,z=H.range(.5,2.6)*(H.chance(.12)?2:1);M.nearestXZ(u,w).dist<7.2||ue(u,w)<13||Math.hypot(u,w)<40||(It(u,w,z,{shards:H.int(1,3),tip:H.chance(.25),glow:.5,lean:[H.gauss()*.3,H.gauss()*.3]}),a++)}await r.yield();const et=[];for(const e of Pt){if(!e.length)continue;const a=await S.buildCrystals(e,H,()=>r.yield());S.object.add(a.object);for(const t of a.tips)et.push(t);await r.yield()}et.length&&S.object.add(S.buildTipGlints(et,H)),await r.yield();const Z=g.fork("mesas"),tt=[],Lt=[],Rt=[],V=e=>"#"+e.getHexString(),Mo=V(l.violet.clone().lerp(l.dark,.35).lerp(l.sand,.12)),zo=V(l.dark.clone().lerp(l.violet,.35)),Ao=V(l.violet.clone().lerp(l.pink,.35)),ko=Z.int(9,12);for(let e=0,a=0;e<400&&a<ko;e++){const t=a<3,n=(a%2?1:-1)*(t?Z.range(430,980):Z.range(385,860)),s=t?Z.range(-1500,-850):Z.range(-700,840);if(Lt.some(b=>Math.hypot(b.x-n,b.z-s)<230)||ue(n,s)<120)continue;const u=Z.range(80,150)*(t?1.25:1),w=Z.range(26,54)*(t?1.3:1),z=eo.seaStackGeometry({rng:Z,height:u,radius:w,segments:28,ledges:Z.int(3,5),top:"flat",sink:0,lean:.06,undercut:.13,flute:.26,lobes:.42,waist:.2,roughness:.42,crease:.6,color:Mo,colorB:zo,colorTop:Ao});De.push([n,s,Math.min(u,60),w*.85]),tt.push({g:z,m:new i.Matrix4().makeRotationY(Z.range(0,6.28)).setPosition(n,0,s)}),Lt.push({x:n,z:s,h:u,r:w}),a++;const F=Z.int(3,6);for(let b=0;b<F;b++){const P=Z.range(0,6.28),G=Z.range(0,.42)*w;Rt.push([n+Math.cos(P)*G,u-1,s+Math.sin(P)*G,Z.range(2.4,4.6),Z.range(0,6.28)])}await r.yield()}const Ut=eo.mergeRocks(tt);await r.yield();for(const e of tt)e.g.dispose();const So=new i.Mesh(Ut,Me(lo,co,0)),Vt=new i.Mesh(Ut,Me(lo,co,1));Vt.scale.y=-1,h.add(So),ze.add(Vt),await r.yield();const K=g.fork("flora"),Et=he.makeWind({direction:[.8*c,.5],strength:g.range(.8,1.3),speed:.8});await r.yield();const Wt={wind:Et,backlight:1.1,backlightTint:V(l.pink),ambient:1.6,leafAmbient:1,glow:.7,hold:!0};await he.prepareLeafTexture(Wt,()=>r.yield());const Nt=he.windMaterial(Wt);await r.yield();const ne=new i.Object3D,jt=[],ot=(e,a)=>{const t=new i.InstancedMesh(e,Nt,a.length);jt.push(e),a.forEach((n,s)=>{ne.position.set(n[0],n[1],n[2]),ne.rotation.set(0,n[4],0),ne.scale.setScalar(n[3]),ne.updateMatrix(),t.setMatrixAt(s,ne.matrix)});const o=uo(t);return h.add(t),ze.add(o),t.userData.mirror=o,t},Do=he.frondSpiralGeometry({rng:K,detail:0,height:8,stalk:V(l.violet),stalkTip:V(l.pink),leaf:V(l.pink.clone().lerp(l.violet,.5)),leafTip:"#ffc0dc",glow:1.8});await r.yield(),ot(Do,Rt);const at=[[],[]],Ht=(e,a,t,o)=>{const n=M.pointAt(e),s=M.tangentAt(e),u=K.int(3,6),w=a*K.range(t,o);for(let z=0;z<u;z++){const F=w+a*Math.abs(K.gauss())*3.5,b=K.gauss()*5,P=n.x-s.z*F+s.x*b,G=n.z+s.x*F+s.z*b;M.nearestXZ(P,G).dist<8||ue(P,G)<13.5||at[e<.5?0:1].push([P,0,G,K.range(.6,1.2),K.range(0,6.28)])}};for(let e=0;e<7;e++)Ht(.1+e*.03+K.range(-.008,.008),e%2?1:-1,9,e%2===(c>0?1:0)?20:11.5);for(let e=0;e<3;e++)Ht(.75+e*.06+K.range(-.01,.01),e%2?1:-1,16,26);const nt=[];for(let e=0;e<2;e++)nt.push(he.tendrilGeometry({rng:K,detail:1,count:6,height:K.range(6,7.5),base:V(l.dark.clone().lerp(l.teal,.3)),mid:V(l.teal),tip:V(l.pink.clone().lerp(l.violet,.3)),glow:1.6})),await r.yield();const it=at.map((e,a)=>e.length?ot(nt[a],e):null);for(const e of it)e&&(e.frustumCulled=!1,e.userData.mirror.frustumCulled=!1);const Fo=(e,a)=>{for(let t=0;t<2;t++){const o=it[t];if(!o||!(t===0?a<.45:a>.4))continue;const n=at[t];for(let s=0;s<n.length;s++){const u=n[s],w=Math.hypot(u[0]-e.x,u[2]-e.z),z=Qt(20,58,w);ne.position.set(u[0],0,u[2]),ne.rotation.set(0,u[4]+(1-z)*1.4,0),ne.scale.set(u[3]*se(.55,1,z),u[3]*se(.16,1,z),u[3]*se(.55,1,z)),ne.updateMatrix(),o.setMatrixAt(s,ne.matrix)}o.instanceMatrix.needsUpdate=!0}};await r.yield();{const e=[];for(let t=0;t<300&&e.length<10;t++){const o=K.range(.08,.62),n=M.pointAt(o),s=M.tangentAt(o),u=K.sign()*K.range(24,52),w=o<.3?c*Math.abs(u):u,z=n.x-s.z*w,F=n.z+s.x*w;M.nearestXZ(z,F).dist<(o<.2?40:22)||ue(z,F)<16||e.push([z,-.1,F,K.range(.9,1.6),K.range(0,6.28)])}await r.yield();const a=he.crystalTreeGeometry({rng:K,detail:1,height:10,trunk:V(l.violet),trunkDark:V(l.dark),trunkLight:V(l.teal),crystal:V(l.teal.clone().lerp(l.violet,.25).multiplyScalar(.85)),crystalTip:V(l.ice.clone().multiplyScalar(.6)),glow:.6});await r.yield(),ot(a,e);for(const t of e)De.push([t[0],t[2],9*t[3],2.2*t[3]])}he.holdGlow(Nt,jt),await r.yield(),await r.yield();{for(const L of A.feet)De.push([L.x,L.z,30,3.2]);const e=[],a=[],t=[],o=[],n=new i.Vector2(-A.sunDir.x,-A.sunDir.z).normalize(),s=new i.Vector2(-A.glowDir.x,-A.glowDir.z).normalize(),u=l.violet.clone().multiplyScalar(.9),w=l.violet.clone().lerp(l.pink,.2).multiplyScalar(.72),z=l.teal.clone().multiplyScalar(.55),F=l.dark.clone().multiplyScalar(.25);let b=0;const P=(L,E,d,C,_,W,J)=>{const Y=-d.y,oe=d.x;for(const[ie,pe]of[[0,-1],[1,-1],[1,1],[0,1]]){const ve=_*(ie?.4:1)*pe,rt=ie?C:-_*.7;e.push(L+d.x*rt+Y*ve,.03,E+d.y*rt+oe*ve),a.push(ie,pe),t.push(W.r,W.g,W.b,J)}o.push(b,b+1,b+2,b,b+2,b+3),b+=4},G=(L,E,d)=>{for(const[C,_]of[[-1,-1],[1,-1],[1,1],[-1,1]])e.push(L+C*d,.035,E+_*d),a.push(2.5+C*.5,_),t.push(F.r,F.g,F.b,.6);o.push(b,b+1,b+2,b,b+2,b+3),b+=4};let ee=0;for(const[L,E,d,C]of De){const _=M.nearestXZ(L,E).dist<80;P(L,E,n,Math.min(d*1.9,80),C*2.3,_?w:u,_?.82:.75),P(L,E,s,Math.min(d*1.5,56),C*1.4,z,_?.88:.65),C<12&&G(L,E,C*1.5+.6),(++ee&63)===0&&await r.yield()}const $=new i.BufferGeometry;$.setAttribute("position",new i.Float32BufferAttribute(e,3)),$.setAttribute("uv",new i.Float32BufferAttribute(a,2)),$.setAttribute("aCol",new i.Float32BufferAttribute(t,4)),$.setIndex(o);const O=new i.Mesh($,new i.ShaderMaterial({uniforms:{...i.UniformsUtils.clone(i.UniformsLib.fog)},fog:!0,transparent:!0,depthWrite:!1,side:i.DoubleSide,vertexShader:`
          attribute vec4 aCol; varying vec2 vUv; varying vec4 vCol;
          #include <fog_pars_vertex>
          void main(){ vUv = uv; vCol = aCol; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`
          precision highp float;
          varying vec2 vUv; varying vec4 vCol;
          #include <fog_pars_fragment>
          void main(){
            float vy = clamp(vUv.y, -1., 1.), a = 1. - vy * vy; a *= a;   // clamped: multisampling extrapolates vUv.y past its range on quads seen edge-on
            if (vUv.x > 1.5) a = smoothstep(1., 0.25, length(vec2((vUv.x - 2.5) * 2., vUv.y)));
            else a *= smoothstep(0., 0.08, vUv.x) * pow(max(1. - vUv.x, 0.), 1.25);
            float fogF = 0.;
            #ifdef FOG_EXP2
            fogF = 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
            #endif
            gl_FragColor = vec4(vCol.rgb, a * vCol.a * (1. - fogF));
          }`}));O.name="double-shadows",O.renderOrder=1.3,O.frustumCulled=!1,h.add(O)}await r.yield();{const e=g.fork("gliders"),a=No(),t=new i.InstancedBufferGeometry;t.index=a.index,t.setAttribute("position",a.attributes.position),t.setAttribute("aW",a.attributes.aW);const o=[];for(let d=0;d<6;d++){const C=e.range(15,21),_=d%2?1:-1;o.push([_*(C+e.range(16,24)),e.range(9,14)-d*.5,[250,205,160,120,85,52][d]+e.range(-8,8),C,e.range(1.5,2)])}for(let d=0;d<4;d++){const C=[.05,.1,.16,.24][d],_=M.pointAt(C),W=M.tangentAt(C),J=e.range(15,21),Y=(d%2?1:-1)*(J+e.range(16,24));o.push([_.x-W.z*Y,_.y+e.range(5,9),_.z+W.x*Y,J,e.range(1.7,2.2)])}const n=(d,C)=>{for(let _=0;_<8;_++){let W=1e9,J=0,Y=0,oe=0;for(let lt=0;lt<16;lt++){const $t=lt/16*Math.PI*2,Jt=d[0]+Math.cos($t)*d[3],Yt=d[2]+Math.sin($t)*d[3]*.72,ct=M.nearestXZ(Jt,Yt);ct.dist<W&&(W=ct.dist,J=ct.u,Y=Jt,oe=Yt)}if(W>=C)break;const ie=M.pointAt(J);let pe=Y-ie.x,ve=oe-ie.z;Math.hypot(pe,ve)<.5&&(pe=d[0]-ie.x,ve=d[2]-ie.z);const qt=Math.hypot(pe,ve)||1;d[0]+=pe/qt*(C-W+2),d[2]+=ve/qt*(C-W+2)}return d};for(const d of o)n(d,30);await r.yield();const s=B+o.length,u=new Float32Array(s*4),w=new Float32Array(s*4),z=[.09,.26,.5,.63,.78,.86,.93,.82];for(let d=0;d<B;d++){const C=ge(z[d%z.length]+e.range(-.035,.035),.03,.97),_=M.pointAt(C),W=M.tangentAt(C),J=e.range(14,36),Y=e.sign()*(J+e.range(16,60)),oe=ge(_.y+e.range(3,24),10,44),ie=e.range(5,9)*e.sign();u.set(n([_.x-W.z*Y,oe,_.z+W.x*Y,J],28),d*4),w.set([e.range(0,6.28),ie/J,e.range(1.1,1.7),e()],d*4),(d&7)===7&&await r.yield()}o.forEach((d,C)=>{const _=B+C;u.set([d[0],d[1],d[2],d[3]],_*4),w.set([e.range(0,6.28),e.range(6,9)*e.sign()/d[3],d[4],e()],_*4)});const F=r.core.makeRng((Math.imul(r.seed|0,2654435761)^27415)>>>0),b=200,P=[];for(let d=F.range(0,b);d<M.length;d+=b){const C=M.posAtDist(d),_=M.tangentAtDist(d),W=F.range(14,18),J=F.sign(),Y=(-vt(C,_)||J)*(W+F.range(15,21)),oe=n([C.x-_.z*Y,C.y+F.range(8,18),C.z+_.x*Y,W],30);P.push([oe[0],oe[1],oe[2],oe[3],F.range(0,6.28),F.range(6,9)*F.sign()/W,F.range(1.8,2.2),F()])}const G=s+P.length,ee=new Float32Array(G*4),$=new Float32Array(G*4);ee.set(u),$.set(w),P.forEach((d,C)=>{ee.set(d.slice(0,4),(s+C)*4),$.set(d.slice(4),(s+C)*4)}),t.setAttribute("aI",new i.InstancedBufferAttribute(ee,4)),t.setAttribute("aJ",new i.InstancedBufferAttribute($,4)),t.instanceCount=G;const O={transparent:!0,depthWrite:!1},L=new i.Mesh(t,Me(so,ro,0,O)),E=new i.Mesh(t,Me(so,ro,1,O));L.frustumCulled=!1,E.frustumCulled=!1,L.renderOrder=2,E.renderOrder=.5,E.scale.y=-1,h.add(L),ze.add(E),a.dispose()}await r.yield();const Le={value:0},de=Re.fxGroup();de.object.name="atmosphere",h.add(de.object);const Kt=D.clone().multiplyScalar(1.35).lerp(l.teal.clone().multiplyScalar(.6),.45);de.add(Re.makeGroundFog({time:Le,layers:2,size:1100,y:.6,height:9,color:Kt.clone().multiplyScalar(.75).lerp(l.teal,.3),opacity:.3*X,coverage:.5,scale:.004,wind:[2.6*c,.9],near:[90,260],sunDir:A.sunDir,sunColor:"#bcd8ff",scatter:.4})),await r.yield(),de.add(Re.makeMist({rng:g.fork("mist"),time:Le,count:30,area:[640,3,640],center:[0,2.2,0],size:[22,52],color:Kt,opacity:.2*X,drift:[2.2*c,0,.8],follow:!0})),await r.yield(),de.add(Re.makeParticles({rng:g.fork("motes"),preset:"dust",time:Le,count:1500,box:[64,26,64],size:[.035,.1],colors:[V(l.ice),V(l.teal.clone().lerp(l.ice,.5)),V(l.pink)],intensity:1.5,velocity:[.5*c,.08,.2]})),await r.yield(),de.add(Re.makeShootingStars({rng:g.fork("stars"),time:Le,count:g.int(8,16),period:[5,13],minElevation:.3,radius:1500,color:V(l.ice),tailColor:V(l.teal),intensity:4})),await r.yield();const Xt=fe.uCam.value,He=new Float32Array(65),Ke=new Float32Array(65);for(let e=0;e<=64;e++){const a=M.pointAt(e/64);He[e]=a.y,Ke[e]=a.z}const Co=new i.Vector3,To=(e,a)=>{const t=ge(a,0,1)*64,o=Math.min(63,Math.floor(t)),n=t-o;return Co.set(0,He[o]+(He[o+1]-He[o])*n+1,Ke[o]+(Ke[o+1]-Ke[o])*n-300)},Zt=.42,Ot=.3*(.92-.46),st=Zt+Ae[ae+1]/(M.length-T*U);Ne($e);const _o=new i.Vector3(N.x,20.5,N.z);return{scene:h,path:M,duration:U,camera:{fov:75,near:.3,far:4e3,lookAhead:30,sway:1,bank:.8},pois:[{at:[0,14,0],from:0,to:.3,weight:.4},{at:mo,from:.3,to:.445,weight:.35,fade:.3},{at:_o,from:Zt,to:st+Ot,weight:.85,fade:.3},{at:To,from:st,to:.92,weight:.8,fade:Ot/(.92-st)}],portal:{shape:"circle",radius:A.portalSeat.radius,color:"#6fead6",glow:.7,revealDistance:320},post:{exposure:1,bloom:{strength:.5,radius:.7,threshold:.9},grade:{saturation:1.08,contrast:1.05,tint:"#fff4fb",shadowTint:"#0a0622",vignette:.36,grain:.02,aberration:0}},update(e,a,t,o){Xt.setFromMatrixPosition(t.matrixWorld),fe.uTime.value=a,Le.value=a;const n=Je===null?0:ge(a-Je,0,2),s=o-Mt;Je=a,Mt=o,Math.abs(s)>.02?Se=0:s<1e-6?Se+=T*n:Se-=Math.sign(Se)*Math.min(Math.abs(Se),.4*T*n),Tt(o),S.setProgress(o),S.update(e,a,t),Fo(Xt,o),Et.update(a),de.update(e,a,t)},dispose(){S.dispose(),it.forEach((e,a)=>{e||nt[a].dispose()})}}}};export{Ko as default};
