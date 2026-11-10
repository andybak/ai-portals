import*as h from"three";import{makePath as ba,clamp as at,lerp as B,smoothstep as j}from"../kit/core.js";import{makeSky as ya,makeCloudFieldAsync as ta}from"../kit/sky.js";import*as xa from"../kit/terrain.js";import*as To from"../kit/water.js";import*as et from"../kit/fx.js";import*as vt from"../kit/flora.js";import*as ho from"../kit/fauna.js";import*as Fo from"../parts/mountain-of-four-elements.js";const me=Math.PI/180,oa=(E,Ge=0)=>new h.Vector3(Math.sin(E*me)*Math.cos(Ge*me),Math.sin(Ge*me),-Math.cos(E*me)*Math.cos(Ge*me)),Xt=oa(120,5),Ma=oa(105,4),Jt={zenith:"#112a60",mid:"#23428a",horizon:"#5a72ba",ground:"#2c3a66"},co=0,st=110,$e=95,aa=60,sa=150,Ke=176,Se=[185,86],ut=100,Dt=90,fo=235,No=10,Co=13,na=.55,uo=[.22,.1],ka=!0,_t=["#7a1408","#ff7a1a","#ffe08a"],ra=196,Zt=[-2.6,0,-2.4],po=835,la=226,za=290,Pa=42,Sa=8,gt=[300,410,520],mo=Math.sin(205*me),vo=-Math.cos(205*me),Lo=Math.tan(20*me),je=E=>new h.Color(E),ia=[[-312.7,10,670.7],[-283.2,9,607.2],[-249.3,9,534.7],[-219.8,11,471.3],[-184.7,26,410.4],[-146.1,56,351.2],[-125.6,90,283.5],[-108.7,120,214.1],[-71.8,148,154.1],[-43.7,136,103.2],[-6.9,124,57.5],[38,124,20],[90,134,-4],[140,166,-10]],Bt=[[90,196],[120,204],[150,208],[180,210],[210,210],[235,209]];function Aa(){const E=ia.map(G=>G.slice()),Ge=G=>{for(let J=1;J<Bt.length;J++)if(G<=Bt[J][0]){const Fe=Bt[J-1],Ne=Bt[J];return B(Fe[1],Ne[1],(G-Fe[0])/(Ne[0]-Fe[0]))}return Bt[Bt.length-1][1]};for(let G=0;G<=No;G++){const J=Dt+(fo-Dt)*G/No,Fe=(J-90)*me;E.push([Se[0]+ut*Math.sin(Fe),Ge(J),Se[1]-ut*Math.cos(Fe)])}const ae=E[E.length-1],qt=Math.sin(fo*me),ze=-Math.cos(fo*me);for(const G of[16,55,82.5,110])E.push([ae[0]+qt*G,ae[1]-4*G/110,ae[2]+ze*G]);return E}function Ta(E,Ge,ae,qt=[]){const ze=E.makeNoise(90417),G=186,J=966,Fe=3,Ne=Math.floor((J-G)/Fe)+1,rt=new Float32Array(Ne),Ze=new Float32Array(Ne),ue=new Float32Array(Ne),Pt=new Float32Array(Ne),St=new Float32Array(Ne),Qt=new Float32Array(Ne),Q=new h.Vector3,Re=new h.Vector3;for(let N=0;N<Ne;N++){Ge.posAtDist(G+N*Fe,Q),Ge.tangentAtDist(G+N*Fe,Re);const Y=Math.hypot(Re.x,Re.z)||1;rt[N]=Q.x,Ze[N]=Q.y,ue[N]=Q.z,Pt[N]=Re.x/Y,St[N]=Re.z/Y,Qt[N]=Y}const Be={ok:!1,s:0,d:0,y:0},Ye=(N,Y)=>{let O=1e12,V=0;for(let se=0;se<Ne;se+=6){const ne=N-rt[se],ce=Y-ue[se],ke=ne*ne+ce*ce;ke<O&&(O=ke,V=se)}if(O>67600)return Be.ok=!1,Be;const U=Math.max(0,V-6),pe=Math.min(Ne-1,V+6);for(let se=U;se<=pe;se++){const ne=N-rt[se],ce=Y-ue[se],ke=ne*ne+ce*ce;ke<O&&(O=ke,V=se)}const ve=N-rt[V],Ce=Y-ue[V],Pe=at(V+at((ve*Pt[V]+Ce*St[V])/(Fe*Qt[V]),-.5,.5),0,Ne-1),Ae=Math.min(Ne-2,Math.floor(Pe)),be=Pe-Ae;return Be.ok=!0,Be.s=G+Pe*Fe,Be.d=Ce*Pt[V]-ve*St[V],Be.y=Ze[Ae]*(1-be)+Ze[Ae+1]*be,Be},Ue=[Math.sin(60*me),-Math.cos(60*me)],At=[Math.sin(100*me),-Math.cos(100*me)],Tt=(N,Y,O)=>{const V=j(-.05,.6,N*Ue[0]+Y*Ue[1]),U=j(.3,.8,N*At[0]+Y*At[1]),pe=ze.n2(N*3.1-4,Y*3.1+8);return O.r=150+35*U,O.c=B(160+7*pe,B(181,194,U)+5*pe,V),O.hi=V,O.es=U,O},he={r:150,c:160,hi:0,es:0},H=(N,Y)=>{const O=Math.hypot(N,Y),V=1/(O+1e-6),U=N*V,pe=Y*V,ve=O-24*ze.fbm2(U*2.3+5.1,pe*2.3-1.7,2),Ce=j(.5,.86,U*mo+pe*vo);let Pe=ve<500?B(163*Math.pow(at((500-ve)/350,0,1.2),1.4),(500-ve)*.466,Ce):Math.max(-34,(500-ve)*.13);const Ae=j(150,250,O)*(1-j(430,520,O)),be=1-Math.abs(ze.n2(U*4.6+9.3+O*.0011,pe*4.6+2.1));Pe+=(be*be-.4)*17*Ae+5*ze.n2(N*.011,Y*.011)*Ae;const se=Tt(U,pe,he);if(Pe+=46*se.es*j(120,185,O)*(1-j(190,400,O)),O<se.r){if(O<$e)return st-5*j($e,$e-18,O);const ne=st+(se.c-st)*(1-Math.pow(1-(O-$e)/(se.r-$e),1.7+.9*se.hi)),ce=ne+3*ze.n2(N*.02,Y*.02);return ne+(Ve(ce,10,.62)-ce)*j($e,$e+14,O)*(1-j(se.r-16,se.r-2,O))}return B(se.c,Pe,j(0,55,O-se.r))},Ve=(N,Y,O)=>{const V=N/Y,U=Math.floor(V),pe=.5*(1-O);return(U+j(.5-pe,.5+pe,V-U))*Y},Ft=(N,Y,O)=>N+Lo*(Y*mo+O*vo),eo=(N,Y=0)=>{const O=Y>0?(9*ze.n2(N/13+5.1,Y/8+2.7)+4*ze.n2(N/5.3+1.9,Y/4.1+6.3))*j(2,14,Y):0;let V=0;for(const U of gt)V=Math.max(V,1-j(22,56,Math.abs(N-U)+O));return V},Nt=(N,Y)=>(50+13*(.5+.5*ze.n2(N/85+Y*3.7,1.3)))*j(204,262,N)*B(1,.42,j(470,596,N))*B(1,1.3,j(270,360,N)),Ht=N=>B(20.5+1.5*ze.n2(N/60,7.7),15,j(588,612,N)),Ct=ae.map(N=>({s:N.s,d0:N.d0,d1:N.d1,halfS:N.halfS,depth:N.depth,cy:Math.cos(N.yaw||0),sy:Math.sin(N.yaw||0)})),Lt=(N,Y)=>{let O=0;for(const V of Ct){const U=N-V.s;if(Math.abs(U)>V.halfS+16)continue;const pe=Y*V.cy-U*V.sy,ve=Math.abs(U*V.cy+Y*V.sy),Ce=(1-j(V.halfS-.2,V.halfS+1,ve))*j(V.d0-.6,V.d0+.6,pe)*(1-j(V.d1-.6,V.d1+.6,pe));O=Math.max(O,V.depth*Ce)}return O},to=N=>B(B(8,11.5,j(835,880,N)),10,j(930,949,N)),Qe=qt.map(N=>{const Y=13-N.span*26,O=N.side*.5*(13+Y),V=Math.tan(N.ang*me),U=N.s+V*O+N.cv*O*O/13,pe=at((U-G)/Fe,0,Ne-1.001),ve=Math.floor(pe),Ce=pe-ve;return{s:N.s,side:N.side,end:Y,tan:V,cv:N.cv,ph:N.ph,x:B(rt[ve],rt[ve+1],Ce)-St[ve]*O,z:B(ue[ve],ue[ve+1],Ce)+Pt[ve]*O,top:B(Ze[ve],Ze[ve+1],Ce)-to(U)+N.r}});return{land:(N,Y)=>{const O=H(N,Y),V=Ye(N,Y);if(!V.ok)return O;const U=V.s,pe=V.d,ve=Math.abs(pe),Ce=V.y;let Pe=O;if(U<612&&ve<215){const Ae=Ce-6,be=ve-Ht(U),se=pe>0?1:-1;let ne;if(be<=0){const ce=Ft(Ae,N,Y);ne=Ae+(Ve(ce,1.5,.8)-ce)*.8-Lt(U,pe)}else{const ce=se>0?B(.6,.16,j(322,338,U)*(1-j(372,388,U))):1,ke=se>0?eo(U,be):0,lt=B(Nt(U,se)*ce,1,ke),it=Ae+lt*(1-Math.pow(1-at(be/22,0,1),2)),wt=Ft(it,N,Y)+2.2*ze.n2(N/50,Y/50);ne=Math.max(Ae,it+(Ve(wt,13,.72)-wt)*j(0,6,be)*(1-ke*ke*ke)),ne=B(ne,O,se>0?j(34,84,be):j(44,150,be)),se>0&&(ne-=36*j(26,70,be)*(1-j(125,200,be))*j(250,330,U)*(1-j(540,592,U)))}Pe=B(O,ne,j(196,224,U)*(1-j(590,612,U)))}if(U>572&&U<700){const Ae=Ce-B(6,7.5,j(600,660,U)),be=ve-15;Pe=B(Pe,Math.min(Pe,Ae+(be>0?be*1.5:0)),j(572,598,U)*(1-j(684,700,U)))}if(U>822){const Ae=j(835,850,U)*(1-j(940,955,U)),be=Ce-to(U)+(1.1*ze.n2(N/7.3,Y/7.3)+.5*ze.n2(N/2.9+4.1,Y/2.9))*Ae;let se=be;for(const ce of Qe){const ke=U-(ce.s+ce.tan*pe+ce.cv*pe*pe/13+.9*ze.n2(pe/3.1+ce.ph,1.7));if(ke<-4||ke>22)continue;const lt=j(ce.end-2.5,ce.end+1.5,pe*ce.side+1.6*ze.n2(U/4.3+ce.ph,5.5));if(lt<=0)continue;const it=ce.top-Lo*((N-ce.x)*mo+(Y-ce.z)*vo);se=Math.max(se,be+Math.max(0,it-be)*j(-2.6,.4,ke)*lt)}se=Math.min(se,Ce-4.5);const ne=ve-13-8*(1-j(850,866,U));Pe=B(Pe,Math.min(Pe,se+(ne>0?Ve(ne*1.5+2.6*ze.n2(N/13+3.3,Y/13)*Ae,7,.55):0)),j(822,840,U))}return Pe},natural:H,way:Ye,wallH:Nt,halfW:Ht,gapK:eo,rimOf:Tt,hollowAt:Lt,noise:ze}}function Fa(E){return{uTime:E,uSunDir:{value:Xt.clone()},uSunCol:{value:je("#ffcf9a").multiplyScalar(2.4)},uSkyCol:{value:new h.Color(.28,.42,.95).multiplyScalar(.7)},uShadeCol:{value:new h.Color(.24,.26,.6).multiplyScalar(.45)},uGlowDir:{value:Ma.clone()},uGlowCol:{value:new h.Color(1,.56,.4).multiplyScalar(.7)},uFireCol:{value:new h.Color(1,.33,.06).multiplyScalar(2.4)},uFogCol:{value:je("#5a6ea6")},uFogDen:{value:42e-5},uBand:{value:new h.Vector2(aa,sa)},uLake:{value:new h.Vector4(0,0,$e,st)},uShadeMap:{value:null},uShadeBox:{value:new h.Vector4(0,0,1,1)}}}const nt=`
uniform vec3 uSunDir, uSunCol, uSkyCol, uShadeCol, uGlowDir, uGlowCol, uFireCol, uFogCol;
uniform vec4 uShadeBox, uLake; uniform vec2 uBand; uniform float uFogDen, uTime, uFire0;
uniform sampler2D uShadeMap;
// direct sun by place: none below the band, full above it, and only where the land does not stand in its way
float sunSeen(vec3 P) {
  vec4 sm = texture2D(uShadeMap, (P.xz - uShadeBox.xy) * uShadeBox.zw);
  return smoothstep(uBand.x, uBand.y, P.y) * smoothstep(-1.5, 3.0, P.y - sm.b);
}
// the rose of the east sky before the sun: below the sun's band it falls wherever the land leaves the way to the east open
// (through the canyon's gaps, on the dawn side of the shore) and fades out higher up, where the sun itself takes over
vec3 dawnRose(vec3 P, vec3 N) {
  vec4 sm = texture2D(uShadeMap, (P.xz - uShadeBox.xy) * uShadeBox.zw);
  float open = smoothstep(-1.5, 3.0, P.y - sm.b) * (1.0 - smoothstep(uBand.x, uBand.y, P.y));
  // rose low down, turning to the first gold higher up (the canyon's lowest gap lets in rose, its upper two gold)
  vec3 c = mix(uGlowCol * 1.3, uSunCol * 0.5, smoothstep(45.0, 105.0, P.y));
  return c * open * clamp(dot(N, uSunDir) * 0.75 + 0.25, 0.0, 1.0);
}
vec3 placeLight(vec3 P, vec3 N, float ao, float sunK) {
  vec3 amb = mix(uShadeCol, uSkyCol, N.y * 0.5 + 0.5);
  float gl = max(dot(N, uGlowDir), 0.0);
  vec3 glow = uGlowCol * (0.16 + 0.84 * gl * gl);
  vec2 dl = P.xz - uLake.xy; float rl = length(dl), kk = min(1.0, uLake.z * 0.75 / max(rl, 1e-3));
  vec3 Lv = vec3(uLake.x + dl.x * kk, uLake.w, uLake.y + dl.y * kk) - P; float ll = length(Lv);
  float fire = max(dot(N, Lv / max(ll, 1e-3)), 0.0) / (1.0 + ll * ll / 1800.0) * (1.0 - smoothstep(165.0, 215.0, rl));
  fire *= 0.86 + 0.14 * sin((uTime + uFire0) * 1.7 + rl * 0.05);
  return uSunCol * sunK * max(dot(N, uSunDir), 0.0) + (amb + glow) * ao + uFireCol * fire;
}
// a thin sheen of the sky on every face, whatever its paint: it keeps shade blue-violet
vec3 skySheen(vec3 N, float ao) { return uSkyCol * (0.045 + 0.04 * N.y) * ao; }
vec3 placeFog(vec3 col, vec3 P) {
  vec3 V = P - cameraPosition; float d = length(V), f = 1.0 - exp(-uFogDen * uFogDen * d * d);
  vec2 vh = V.xz / max(length(V.xz), 1e-3), gh = uGlowDir.xz / max(length(uGlowDir.xz), 1e-3);
  float e = max(dot(vh, gh), 0.0);
  return mix(col, mix(uFogCol, uGlowCol * 0.8, e * e * e * 0.55), f);
}
`,go=`
// THE SITE'S LAW: nothing here thins or shows by a distance to the eye. Fine paint fades by the footprint of one pixel on the
// rock against THE PATTERN'S OWN STEP (st, in metres), as a mip does, with the same two shares for every pattern, BY THE NATURE OF
// PIXELS: a pattern is whole where a pixel covers under a quarter of its step (four pixels and more to a step) and is its mean
// where a pixel covers half its step and more (two pixels to a step: a grid of pixels carries nothing finer). The pixel's span
// is the smaller of its two, so a floor seen at a low angle keeps its lines. A line drawn by coverage (lineAA) takes its
// spacing as the step; an edge with no coverage of its own takes its own breadth. The fades inside lineAA and crackPit are
// measured in the line's own coordinate and begin at a quarter of the step or later, so none fades earlier than the law
float footK(vec3 P, float st) { return 1.0 - smoothstep(0.25 * st, 0.5 * st, min(length(dFdx(P)), length(dFdy(P)))); }
// the lit colour of rock stays under white: above 0.62 the brightest channel is led toward 0.93 and the others keep their
// share of it, so rock in full sun keeps its hue and its bands
vec3 underWhite(vec3 c) { float m = max(max(c.r, c.g), c.b), k = max(m - 0.62, 0.0); return c * ((min(m, 0.62) + k / (1.0 + 3.2 * k)) / max(m, 1e-4)); }
// the same for the pillars' pale rock and the monastery's white walls, which stand close in full sun: a knee and a room of their
// own (the brightest channel is led toward k0 + room), so a sunlit face holds a tone under white and keeps its form
vec3 underTone(vec3 c, float k0, float room) { float m = max(max(c.r, c.g), c.b), k = max(m - k0, 0.0); return c * ((min(m, k0) + k / (1.0 + k / room)) / max(m, 1e-4)); }
const float PALE_K0 = 0.33, PALE_ROOM = 0.19;
// the steps of the patterns below: the crack net's cell, the pits' cell, the upright cracks' spacing (three level lines to
// a cell of their noise)
const float NET_STEP = 0.85, PIT_STEP = 0.31, UP_STEP = 1.0 / (0.55 * 3.0);
float lineAA(float x, float w) {
  float f = abs(fract(x + 0.5) - 0.5), a = fwidth(x) + 1e-4;
  return clamp((w - f) / a + 0.5, 0.0, 1.0) * (1.0 - smoothstep(0.3, 0.8, a));
}
// the crack net lies on a flat map q (ground, or the plane a flat face lies nearest to); the pits are small hollows dealt in cells
// of SPACE, so a pit is round on a face of any lean and nothing is drawn out along a steep one
vec2 crackPit(vec2 q, vec3 P) {
  vec3 j = voronoi(q / NET_STEP + 13.0); float aj = length(fwidth(q)) / NET_STEP + 1e-4;
  float crack = clamp((0.035 - j.y) / aj + 0.5, 0.0, 1.0) * (1.0 - smoothstep(0.25, 0.7, aj));
  vec3 pq = P / PIT_STEP, pi = floor(pq), pf = fract(pq) - 0.5; float ph = hash11(dot(pi, vec3(12.9898, 78.233, 37.719))), ap = length(fwidth(pq)) + 1e-4;
  vec3 po = vec3(hash11(ph * 17.0 + 0.3), hash11(ph * 29.0 + 0.7), hash11(ph * 41.0 + 0.2)) * 0.3 - 0.15;
  float pit = step(0.55, ph) * clamp((0.1 + 0.1 * hash11(ph * 5.0 + 0.9) - length(pf - po)) / ap + 0.5, 0.0, 1.0) * (1.0 - smoothstep(0.3, 0.8, ap));
  return vec2(crack, pit);
}
// upright cracks on a steep face: the level lines of a noise drawn out along the height, so each one wanders; a crack is
// broken off in some thin layers (li) and runs on in others, as joints do in bedded rock
float uprightCracks(vec3 P, float li) {
  float v = vnoise(vec3(P.x * 0.55, P.y * 0.06, P.z * 0.55) + 31.0) * 3.0;
  return lineAA(v, 0.03) * step(0.42, hash11(li * 2.3 + floor(v + 0.5) * 7.1 + 0.4));
}
`,Na=`
attribute vec2 aShade; varying vec3 vP, vN, vC; varying vec2 vS;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vP = wp.xyz; vN = normalize(mat3(modelMatrix) * normal + vec3(0.0, 1e-6, 0.0)); vC = color; vS = aShade;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`,Ca=`
varying vec3 vP, vN, vC; varying vec2 vS;
${et.GLSL_NOISE}
${nt}
${go}
uniform vec3 uDip; uniform vec3 uBlk[48]; uniform vec3 uHot1, uHot2, uHot3;
void main() {
  vec3 P = vP, N = normalize(vN + vec3(0.0, 1e-6, 0.0)), N0 = N;
  float nA = vnoise(P * 0.55), nB = vnoise(P * 0.13 + 7.0), nC = vnoise(P * 2.3);
  float e = 0.35;
  vec3 g = vec3(vnoise(P * 0.55 + vec3(e, 0., 0.)) - nA, vnoise(P * 0.55 + vec3(0., e, 0.)) - nA, vnoise(P * 0.55 + vec3(0., 0., e)) - nA);
  // the fine grain fades as a pixel's footprint on the rock grows, so slopes drawn small carry no speckle
  // each pattern by its own step: the two grains' cells, the bed, a bed's thin layers, the upright cracks, the breadth of
  // a proud bed's light foot, the joints' own spacing (a joint is drawn by coverage), the crack net's cell and the pits' cell
  float kA = footK(P, 1.0 / 0.55), kC = footK(P, 1.0 / 2.3), kBed = footK(P, 2.6), kLam = footK(P, 2.6 / 8.0), kUp = footK(P, UP_STEP);
  float kFoot = footK(P, 0.25 * 2.6), kJoint = footK(P, 10.5), kNet = footK(P, NET_STEP), kPit = footK(P, PIT_STEP);
  nA = mix(0.5, nA, kA); nC = mix(0.5, nC, kC);
  float rc = length(P.xz);
  // THE CRATER'S INNER WALL AND THE PALE ROCK ARE BROKEN ROCK, not soft ground: there the rock is cut into faces 2 to 8 m across
  // (cells of 5 m on a map of the wall that keeps its measure up a steep face: the height above the lake is laid into the range
  // from the lake's middle). Each face leans a little its own way, so the lake's orange and the sky's blue-violet fall on it
  // flat, with a hard edge to the next face; a thin dark crack (0.08 to 0.18 m, by coverage) runs between two faces. The soft
  // grain bump is laid on by a third there
  float wallK = max(1.0 - smoothstep(186.0, 214.0, rc), smoothstep(0.2, 0.6, vC.b)), shoreD = rc - uLake.z;
  vec2 hq = P.xz * (1.0 + 0.55 * (P.y - uLake.w) / max(rc, 1.0));
  // (the map is drawn about by a broad noise, 2.5 m either way, so the faces are of uneven size and no two edges run alike)
  hq += 5.0 * (vec2(vnoise(vec3(hq * 0.07, 1.0)), vnoise(vec3(hq * 0.07, 5.0))) - 0.5);
  vec3 fv = voronoi(hq / 5.0 + 3.7);
  float dF = fv.y * 5.0, fqh = length(fwidth(hq)) + 1e-4, aF = clamp(fwidth(fv.y) * 5.0, 0.2 * fqh, fqh), hwF = mix(0.04, 0.09, hash11(fv.z * 37.1 + 0.6));
  float crF = clamp((hwF - dF) / aF + 0.5, 0.0, 1.0) + clamp((hwF + dF) / aF + 0.5, 0.0, 1.0) - 1.0;
  vec3 lean = vec3(hash11(fv.z * 53.1 + 0.2), hash11(fv.z * 71.7 + 0.5), hash11(fv.z * 97.3 + 0.8)) - 0.5;
  N = normalize(mix(N0 - g * (1.3 * kA), N0 + lean * (0.8 * mix(0.25, 1.0, hash11(fv.z * 13.7 + 0.9))) - g * (0.45 * kA), wallK));
  // dark lava rock with rust
  // patches of rust and of snow follow a broad noise, so far slopes show fields and no stipple
  float nP = 0.5 * nB + 0.5 * vnoise(P * 0.031 + 7.0);
  vec3 rock = mix(vec3(0.135, 0.128, 0.175), vec3(0.27, 0.13, 0.09), smoothstep(0.5, 0.7, nP) * 0.5);
  // the bowl: black rock with rust in rough level bands
  float bowl = 1.0 - smoothstep(150.0, 186.0, rc);
  float rust = smoothstep(0.6, 0.66, vnoise(vec3(P.x * 0.03, P.y * 0.2, P.z * 0.03)) + 0.16 * (nA - 0.5) + 0.1 * (nC - 0.5));
  rock = mix(rock, mix(vec3(0.075, 0.068, 0.08), vec3(0.30, 0.12, 0.07), rust * 0.8), bowl);
  rock *= (0.7 + 0.45 * nA) * (0.82 + 0.3 * nC);
  // the canyon's tilted beds: ochre, red-brown and cream, with dark seams between beds and joints across them
  float bc = (P.y + uDip.z * (P.x * uDip.x + P.z * uDip.y) + 2.0 * nB) / 2.6;
  bc += 0.38 * sin(bc * 1.7) + 0.2 * sin(bc * 4.1 + 1.0);
  float bi = floor(bc), bf = bc - bi, hsh = hash11(bi * 7.13 + 3.0), hs2 = hash11(floor(bc / 5.0) * 3.7 + 1.0);
  vec3 bed = mix(vec3(0.479, 0.138, 0.045), vec3(0.658, 0.323, 0.102), smoothstep(0.25, 0.45, hsh));
  // the cream beds show on the walls; where a bed lies open as floor it is the darker rock, so no floor reads as snow in the shade
  bed = mix(bed, vec3(0.807, 0.624, 0.352), smoothstep(0.62, 0.8, hsh) * (1.0 - 0.8 * smoothstep(0.72, 0.94, N0.y)));
  bed = mix(bed, bed * vec3(0.8, 0.62, 0.6), hs2 * 0.5);
  // the seam between two beds: a soft dark ramp from afar, a thin sharp line near the lens. The line is a cleft 0.1 m wide ON
  // THE ROCK'S OWN SURFACE at the most (gb: how fast the beds' coordinate runs along the surface, by the metre): where the ground
  // lies nearly along a bed the coordinate runs slowly, and a line of a set share of the bed would spread there into a broad
  // dark band from wall to wall; so it stays a thin crack on a floor as on a wall
  vec3 dPx = dFdx(P), dPy = dFdy(P); float bx = dFdx(bc), by = dFdy(bc), pxx = dot(dPx, dPx), pyy = dot(dPy, dPy), pxy = dot(dPx, dPy);
  float gb = sqrt(max(bx * bx * pyy - 2.0 * bx * by * pxy + by * by * pxx, 0.0) / max(pxx * pyy - pxy * pxy, 1e-14));
  float sw = 0.04 + 0.07 * hs2, seam = mix(smoothstep(0.0, sw, bf) * (1.0 - smoothstep(1.0 - sw, 1.0, bf)), 1.0 - lineAA(bc, min(0.02, 0.05 * gb)), kBed);
  // joints: upright cracks that break each bed into uneven many-sided slabs, each a shade of its own
  // this net of great cracks belongs to ground one can stand on: it fades out between slopes of 25 and 40 degrees, so no
  // crack of the floor runs up a wall across the beds
  vec2 jq = vec2(dot(P.xz, vec2(uDip.y, -uDip.x)), dot(P.xz, uDip.xy) + P.y * 0.8);
  vec3 jv = voronoi(jq / 10.5);
  // a joint is a dark cleft with a hard edge, 0.1 to 0.25 m wide (each slab's side of it 0.05 to 0.125 m, by the slab's own
  // hash), drawn by the share of the pixel it covers in the joint's own coordinate: it keeps its breadth at any range and never
  // spreads into a soft wide line. Beside it runs a thin light lip (0.07 m): the slab's broken edge under the sky
  float lev = smoothstep(0.766, 0.906, N0.y), dj = jv.y * 10.5, fqj = length(fwidth(jq)) + 1e-4, aJ = clamp(fwidth(jv.y) * 10.5, 0.2 * fqj, fqj);
  float hwj = mix(0.05, 0.125, hash11(jv.z * 37.1 + 0.6)), inJ = clamp((hwj - dj) / aJ + 0.5, 0.0, 1.0);
  float cleftJ = inJ + clamp((hwj + dj) / aJ + 0.5, 0.0, 1.0) - 1.0, lipJ = clamp((hwj + 0.07 - dj) / aJ + 0.5, 0.0, 1.0) - inJ;
  float joint = 1.0 - lev * kJoint * cleftJ;
  bed *= (0.6 + 0.4 * seam) * (0.14 + 0.86 * joint) * (1.0 + 0.32 * lev * kJoint * lipJ) * (0.8 + 0.4 * nA) * mix(1.0, 0.84 + 0.32 * hash11(jv.z * 91.7 + 2.0), lev);
  // near the lens every bed shows its thin layers: sharp lines a hand apart, each of its own strength
  // (on a wall the layers are crossed by upright cracks; on the floor the layers show faintly where they crop out)
  // (upright cracks belong to faces that stand steeper than 53 to 70 degrees: on a slope the noise's level lines close into loops)
  float lam = bc * 8.0 + 0.7 * nA, upc = uprightCracks(P, floor(lam)), cliffK = 1.0 - smoothstep(0.34, 0.6, N0.y);
  bed *= 1.0 - kLam * mix(0.36, 0.07, lev) * lineAA(lam, 0.09) * (0.3 + 0.7 * hash11(floor(lam + 0.5) * 3.17 + 1.3));
  bed *= 1.0 - kUp * 0.42 * cliffK * upc;
  // ledges: every few beds one stands proud of the wall; its foot is light, the bed under it lies in its shade
  float steep = 1.0 - smoothstep(0.55, 0.85, N0.y);
  float lgUp = step(0.6, hash11((bi + 1.0) * 5.3 + 0.7)), lgMe = step(0.6, hash11(bi * 5.3 + 0.7));
  bed *= (1.0 - 0.52 * steep * lgUp * smoothstep(mix(0.3, 0.6, kFoot), mix(1.0, 0.72, kFoot), bf)) * (1.0 + 0.3 * steep * lgMe * (1.0 - smoothstep(0.0, mix(0.25, 0.07, kFoot), bf)));
  // the hollows where slabs were lifted out: fresh rock, darker
  float hol = vC.g * step(0.5, vC.r), snowK = vC.g * (1.0 - step(0.5, vC.r));
  bed *= mix(1.0, 0.46, hol);
  vec3 alb = mix(rock, bed, smoothstep(0.25, 0.75, vC.r + (nB - 0.5) * 0.3));
  // the pale rock of the summit's shoulder and its scree
  alb = mix(alb, vec3(0.62, 0.53, 0.45) * (0.7 + 0.5 * nA), smoothstep(0.3, 0.8, vC.b + (nB - 0.5) * 0.4));
  // the pale rock's ledges are in the land's own form: nothing is painted under a lip and no level line is drawn. The paint
  // only follows the form's own normal: a face that stands steep is a shade darker and, near the lens, shows its thin beds
  // (they dip with the mountain's beds) and its upright cracks; ground that lies near level is a shade lighter
  float paleK = smoothstep(0.2, 0.6, vC.b), stK = 1.0 - smoothstep(0.55, 0.85, N0.y);
  alb *= 1.0 - paleK * (0.3 * stK - 0.25 * smoothstep(0.75, 0.95, N0.y));
  alb *= 1.0 - paleK * (0.3 * stK * footK(P, 2.6 / 4.7) * lineAA(bc * 4.7 + 0.6 * nA, 0.09) + 0.36 * cliffK * kUp * upc);
  alb *= mix(1.0, (0.84 + 0.3 * hash11(fv.z * 91.7 + 2.0)) * (1.0 - 0.6 * crF * smoothstep(0.3, 0.55, vnoise(vec3(hq * 0.2, 9.0)))), wallK);
  // the close-range layer on every kind of rock: pits and, on ground one can stand on, a net of small cracks; both in patches
  vec2 cp = crackPit(jq, P);
  alb *= 1.0 - smoothstep(0.3, 0.6, vnoise(P * 0.21 + 5.0)) * (0.3 * lev * kNet * cp.x + 0.3 * kPit * cp.y);
  // snow on what faces up, and shore ice
  float sn = snowK * smoothstep(0.6, 0.88, N0.y + (nB - 0.5) * 0.3) * smoothstep(0.4, 0.58, nP + snowK * 0.3);
  sn *= 0.8;
  sn = max(sn, smoothstep(5.5, 1.5, P.y + nA * 2.0) * (1.0 - vC.r) * step(250.0, rc));
  alb = mix(alb, vec3(0.64, 0.69, 0.76), clamp(sn, 0.0, 1.0));
  // the dark feet of the fallen blocks and of the larger lumps of the floor's small rubble: the ground is shaded close round
  // each (x, z and reach of each, set by place at build; forty blocks and eight lumps at the most)
  float foot = 1.0;
  for (int i = 0; i < 48; i++) foot *= 1.0 - 0.6 * (1.0 - smoothstep(0.5, 1.6, length(P.xz - uBlk[i].xy) / uBlk[i].z));
  float ao = vS.y * mix(1.0, 0.75 + 0.25 * seam, vC.r) * foot;
  // the dawn's rose and first gold fall at full strength on the canyon's beds; the dark cone outside takes less of them and stays dark
  vec3 col = underWhite(alb * (placeLight(P, N, ao, sunSeen(P)) + dawnRose(P, N) * mix(0.4, 1.0, vC.r) * (0.4 + 0.6 * foot))) + skySheen(N, ao);
  // THE LAKE'S HEAT IN THE ROCK: the cracks between the wall's faces glow where they are near the lake, all round its shore:
  // nearly all of them at the shore, fewer in uneven tongues higher up, none beyond 40 m from the shore MEASURED UP THE WALL (by
  // place: the range beyond the lake's radius and the height above the lake, together). A glowing crack is broader than a cold
  // one (up to two and a half times), drawn by coverage in the lava's own three colours, with a dull red on the rock a hand
  // from it; it breathes on the fire's own seeded clock. No level hairline is drawn
  float heatK = smoothstep(0.0, 0.3, (1.0 - length(vec2(shoreD, P.y - uLake.w)) / 40.0) - 0.75 * vnoise(vec3(hq * 0.12, 3.0))) * step(0.0, shoreD);
  float hwG = hwF * (1.0 + 1.5 * heatK), glF = clamp((hwG - dF) / aF + 0.5, 0.0, 1.0) + clamp((hwG + dF) / aF + 0.5, 0.0, 1.0) - 1.0;
  vec3 em = mix(uHot1, uHot2, smoothstep(0.15, 0.7, heatK)); em = mix(em, uHot3, smoothstep(0.75, 1.0, heatK) * (1.0 - smoothstep(0.0, hwG, dF)));
  col += (em * 1.4 * glF + uHot1 * 0.35 * exp(-dF / 0.3)) * heatK * (0.85 + 0.15 * sin((uTime + uFire0) * 1.3 + vnoise(P * 0.2) * 12.0));
  gl_FragColor = vec4(placeFog(col, P), 1.0);
}
`,La=`
varying vec3 vP, vN, vC; varying vec2 vS;
${et.GLSL_NOISE}
${nt}
void main() {
  vec3 P = vP, N = normalize(cross(dFdx(P), dFdy(P)) + vec3(0.0, 1e-12, 0.0));
  float top = smoothstep(0.35, 0.8, N.y), n = vnoise(P * 0.7);
  vec3 alb = mix(vec3(0.42, 0.62, 0.78), vec3(0.86, 0.9, 0.95), top) * (0.85 + 0.2 * n);
  alb = mix(alb, vec3(0.25, 0.5, 0.62), smoothstep(1.2, 0.0, P.y) * 0.7);
  vec3 col = alb * (placeLight(P, N, 1.0, sunSeen(P)) + dawnRose(P, N) * 0.7);
  gl_FragColor = vec4(placeFog(col, P), 1.0);
}
`,Ea=`
varying vec3 vP, vN, vC; varying vec2 vS;
${et.GLSL_NOISE}
${nt}
${go}
void main() {
  vec3 P = vP, Nf = normalize(cross(dFdx(vP), dFdy(vP)) + vec3(0.0, 1e-12, 0.0));
  vec3 N = normalize(mix(normalize(vN + vec3(0.0, 1e-6, 0.0)), Nf, 0.55));
  float nA = vnoise(P * 0.5), nB = vnoise(P * 0.12 + 3.0), nC = vnoise(P * 1.9);
  float e = 0.3;
  vec3 g = vec3(vnoise(P * 0.5 + vec3(e, 0., 0.)) - nA, vnoise(P * 0.5 + vec3(0., e, 0.)) - nA, vnoise(P * 0.5 + vec3(0., 0., e)) - nA);
  N = normalize(N - g * 1.2);
  // upright joints as soft dark streaks (no courses, no drawn lines)
  float streak = vnoise(vec3(P.x * 0.36, P.y * 0.032, P.z * 0.36));
  float joint = smoothstep(0.14, 0.36, abs(streak - 0.5) * 2.0 + nC * 0.12);
  vec3 alb = vec3(0.686, 0.578, 0.479) * (0.64 + 0.36 * joint) * (0.74 + 0.36 * nA) * (0.86 + 0.28 * nC);
  alb = mix(alb, alb * vec3(0.8, 0.72, 0.74), smoothstep(0.5, 0.8, nB) * 0.6);
  // near the lens: thin uneven level layers, wandering upright cracks and pits, all sharp (natural rock: nothing regular, nothing dressed)
  float py = P.y / 0.42 + 0.9 * nA;
  vec2 cp = crackPit(vec2(P.x * 0.8 + P.z * 0.6, P.y * 1.15 + (P.z * 0.8 - P.x * 0.6) * 0.45), P);
  alb *= 1.0 - (0.3 * footK(P, 0.42) * lineAA(py, 0.08) * (0.3 + 0.7 * hash11(floor(py + 0.5) * 3.17 + 1.3)) + 0.42 * footK(P, UP_STEP) * uprightCracks(P, floor(py)) + 0.3 * footK(P, PIT_STEP) * cp.y);
  // AT ARM'S LENGTH the rock shows its build: beds 1 to 3 m thick, some standing proud (a light top edge, the rock under the
  // bed above in its shade), and blocks 1 to 3.5 m across (cells of 2.2 m on the upright plane the face lies nearest to), each
  // face leaning a little its own way with a thin dark joint (by coverage) to the next and a shade of its own. Both fade by
  // the law (footK) with the pixel's span, so a pillar far off keeps its soft streaks
  float pbc = P.y / 1.9 + 1.3 * nB, pbi = floor(pbc), pbf = pbc - pbi, kBd = footK(P, 1.9);
  alb *= (1.0 - 0.4 * kBd * step(0.45, hash11((pbi + 1.0) * 5.3 + 0.7)) * smoothstep(0.6, 0.95, pbf)) * (1.0 + 0.14 * kBd * step(0.45, hash11(pbi * 5.3 + 0.7)) * (1.0 - smoothstep(0.0, 0.12, pbf)));
  vec3 aNf = abs(Nf); vec2 bq = aNf.x > aNf.z ? vec2(P.z, P.y) : vec2(P.x, P.y);
  bq += 1.1 * (vec2(vnoise(vec3(bq * 0.3, 2.0)), vnoise(vec3(bq * 0.3, 6.0))) - 0.5);
  vec3 bv = voronoi(bq / 2.2 + 5.3);
  float kBlk = footK(P, 2.2), dB = bv.y * 2.2, fqb = length(fwidth(bq)) + 1e-4, aB = clamp(fwidth(bv.y) * 2.2, 0.2 * fqb, fqb);
  float crB = clamp((mix(0.03, 0.07, hash11(bv.z * 37.1 + 0.6)) - dB) / aB + 0.5, 0.0, 1.0);
  N = normalize(N + (vec3(hash11(bv.z * 53.1 + 0.2), hash11(bv.z * 71.7 + 0.5), hash11(bv.z * 97.3 + 0.8)) - 0.5) * (0.45 * kBlk));
  alb *= mix(1.0, (0.86 + 0.28 * hash11(bv.z * 91.7 + 2.0)) * (1.0 - 0.6 * crB), kBlk);
  float ao = (0.5 + 0.5 * smoothstep(0.0, 0.2, vS.x)) * (0.7 + 0.3 * joint), sunK = sunSeen(P);
  // the low sun wraps a little round a pale needle; THE SUNLIT FACE HOLDS A ROCK TONE UNDER WHITE (underTone)
  float hw = max(dot(N, uSunDir) * 0.5 + 0.5, 0.0);
  vec3 col = underTone(alb * (placeLight(P, N, ao * 0.7, sunK) + uSunCol * sunK * 0.5 * hw * hw), PALE_K0, PALE_ROOM) + skySheen(N, ao);
  gl_FragColor = vec4(placeFog(col, P), 1.0);
}
`,Ra=`
varying vec3 vP, vN, vC; varying vec2 vS;
${et.GLSL_NOISE}
${nt}
${go}
void main() {
  // every face is flat: the normal is the face's own, turned to the eye (a roof seen from below shows its dark underside)
  vec3 P = vP, N = normalize(cross(dFdx(vP), dFdy(vP)) + vec3(0.0, 1e-12, 0.0));
  float kind = vC.r, u = vC.g, v = vC.b, bh = fract(vS.x), plain = step(1.5, vS.x);
  float nA = vnoise(P * 0.5), nC = vnoise(P * 1.9);
  // STONE: white to pale cream, dressed and old: courses 0.55 m high with broken upright joints, each stone a shade of its own,
  // grey streaks of old rain down the walls
  float cy = v / 0.55, ci = floor(cy), cu = u * 2.0 + 0.5 * mod(ci, 2.0);
  vec3 stone = vec3(0.86, 0.835, 0.78) * (0.86 + 0.2 * nA) * (0.93 + 0.14 * nC) * (0.94 + 0.12 * bh);
  stone *= 0.93 + 0.14 * hash11(ci * 7.3 + floor(cu) * 3.1 + bh * 17.0);
  stone *= 1.0 - 0.26 * smoothstep(0.5, 0.8, vnoise(vec3(P.x * 0.9, P.y * 0.07, P.z * 0.9) + 11.0));
  stone *= 1.0 - 0.24 * footK(P, 0.55) * max(lineAA(cy, 0.05), 0.7 * lineAA(cu, 0.03));
  // small dark arched windows in rows, PAINTED on the wall (not cut): one to a face and row at the most, a row to every 3.4 m of
  // the body's own scale; a window is 0.22 of its cell broad and 1.4 m tall with a round head, drawn by coverage
  float wr = v / 3.4, ym = (fract(wr) - 0.5) * 3.4 - 0.2, X = (fract(u) - 0.5) / 0.11;
  float dW = ym > 0.35 ? length(vec2(X, (ym - 0.35) / 0.3)) - 1.0 : max(abs(X) - 1.0, (-0.75 - ym) / 0.3);
  float win = clamp(0.5 - dW / (fwidth(dW) + 1e-4), 0.0, 1.0) * step(0.0, v) * (1.0 - plain) * step(0.42, hash11(floor(u) * 5.7 + floor(wr) * 11.3 + bh * 31.0));
  // a dark arched doorway at the foot of one face in five (2.3 m tall by the body's scale); the window over it is left out
  float door = step(0.8, hash11(floor(u) * 3.3 + bh * 7.7)), X2 = (fract(u) - 0.5) / 0.17;
  float dD = v > 1.7 ? length(vec2(X2, (v - 1.7) / 0.6)) - 1.0 : max(abs(X2) - 1.0, -v / 0.6);
  float dr = clamp(0.5 - dD / (fwidth(dD) + 1e-4), 0.0, 1.0) * door * (1.0 - plain);
  win *= 1.0 - door * step(wr, 1.0);
  stone = mix(stone, vec3(0.03, 0.03, 0.05), 0.92 * max(win, dr) * footK(P, 1.2));
  // TILE: clear blue, weathered, in rows 0.45 m apart up the slope, each row's tiles a shade of their own; a pale line along
  // every hip of a roof (u runs -1 to 1 across a roof's face) and along its eave; a little snow and pale lichen on the sides
  // turned from the sun
  float ty = v / 0.45, ti = floor(ty);
  vec3 tile = vec3(0.035, 0.2, 0.82) * (0.8 + 0.4 * hash11(ti * 5.1 + floor(u * 2.0 + 0.5 * mod(ti, 2.0)) * 9.7 + bh * 13.0)) * (0.85 + 0.3 * nA);
  tile *= 1.0 - 0.4 * footK(P, 0.45) * lineAA(ty, 0.09);
  tile = mix(tile, vec3(0.74, 0.76, 0.74), max(smoothstep(0.9, 0.96, abs(u)), 1.0 - smoothstep(0.08, 0.14, v)) * 0.8);
  float away = smoothstep(0.1, -0.5, dot(N, uSunDir)) * smoothstep(0.0, 0.35, N.y);
  tile = mix(tile, vec3(0.42, 0.47, 0.36), away * 0.45 * smoothstep(0.58, 0.7, vnoise(P * 0.8 + 17.0)));
  tile = mix(tile, vec3(0.64, 0.69, 0.76), away * smoothstep(0.62, 0.7, vnoise(P * 0.35 + 29.0) + 0.15 * (nC - 0.5)));
  // the tip: pale gold, plain (it carries no light of its own)
  vec3 alb = kind < 0.5 ? stone : (kind < 1.5 ? tile : vec3(0.86, 0.66, 0.30));
  float ao = vS.y, sunK = sunSeen(P), hw = max(dot(N, uSunDir) * 0.5 + 0.5, 0.0);
  // (the white walls in full sun hold a tone under white, as the pillars do; the shaded side takes the sky's blue-violet)
  vec3 col = underTone(alb * (placeLight(P, N, ao * 0.8, sunK) + uSunCol * sunK * 0.3 * hw * hw * step(kind, 0.5)), PALE_K0, PALE_ROOM) + skySheen(N, ao);
  gl_FragColor = vec4(placeFog(col, P), 1.0);
}
`;function wo(E,Ge,ae={}){return new h.ShaderMaterial({uniforms:{...E,...ae},vertexShader:Na,fragmentShader:Ge,vertexColors:!0})}var qa={id:"mountain-of-four-elements",name:"The Mountain of Four Elements",category:"screen",placeKind:"wilderness",screen:"Avatar: The Last Airbender",screenYear:"2005",screenKind:"series",media:["air","water"],weirdness:.5,async build(E){const{core:Ge}=E,ae=new h.Scene,qt=E.quality&&E.quality.detail||1,ze=E.vary||{},G=e=>Ge.makeRng(Ge.hashSeed(e+":"+E.seed)),J={sky:G("mountain-sky"),land:G("mountain-land"),sea:G("mountain-sea"),floes:G("mountain-floes"),bergs:G("mountain-bergs"),plume:G("mountain-plume"),pillars:G("mountain-pillars"),trees:G("mountain-trees"),birds:G("mountain-birds"),rubble:G("mountain-rubble"),dust:G("mountain-diamond-dust"),frost:G("mountain-frost"),cloudHeads:G("mountain-cloud-heads"),cloudHeadsTwin:G("mountain-cloud-heads"),cloudSea:G("mountain-cloud-sea"),birdsEast:G("mountain-birds-east"),blocks:G("mountain-blocks"),cleft:G("mountain-cleft"),plumeFoot:G("mountain-plume-foot"),pillarPlaces:G("mountain-pillar-places"),headPlaces:G("mountain-cloud-head-places"),clockLake:G("mountain-clock-lake"),clockBank:G("mountain-clock-bank"),clockFire:G("mountain-clock-fire"),clockGlow:G("mountain-clock-glow"),footLumps:G("mountain-foot-lumps"),gapMotes:gt.map((e,o)=>G("mountain-gap-motes-"+o)),clumps:G("mountain-clumps"),floorRubble:G("mountain-floor-rubble"),wallRibs:G("mountain-wall-ribs"),blockGroups:G("mountain-block-groups"),monastery:G("mountain-sky-monastery")},Fe=at(ze.density||1,.7,1.3),Ne=ze.hour==="golden",rt=!!ze.rare,Ze={value:0},ue=Fa(Ze);ue.uFire0={value:J.clockFire.range(0,600)};const Pt={value:J.clockLake.range(0,600)},St={value:J.clockBank.range(0,600)},Qt={value:J.clockGlow.range(0,600)};Ne&&(ue.uSunCol.value.multiply(new h.Color(1.06,.97,.86)),ue.uGlowCol.value.multiply(new h.Color(1.1,1,.9)));const Q=ba(Aa()),Re=e=>({p:Q.posAtDist(e),t:Q.tangentAtDist(e)});let Be=null;try{typeof Fo.gateHollows=="function"&&(Be=Fo.gateHollows(E))}catch(e){console.error("mountain part, gateHollows: "+(e&&e.message))}if(!Array.isArray(Be)){Be=[];for(let e=0;e<Sa;e++){const o=za+e*Pa;Be.push({s:o,d0:4,d1:16.5,halfS:4.5,depth:1.8},{s:o,d0:-16.5,d1:-4,halfS:4.5,depth:1.8})}}const Ye=[...new Set(Be.map(e=>e.s))].sort((e,o)=>e-o),Ue=J.cleft,At=[],Tt=[];for(let e=0;e<13;e++)Tt.push(Ue.range(5,13));{const e=Tt.reduce((v,m)=>v+m,0);let o=838;for(let v=0;v<13;v++)o+=Tt[v]*108/e*(v===0?.5:1),At.push({s:o,side:Ue()<.5?-1:1,span:Ue.range(.34,.66),r:Ue.range(1.5,6),ang:Ue.range(10,35)*(Ue()<.5?-1:1),cv:Ue.range(.1,.3)*(Ue()<.5?-1:1),ph:Ue.range(0,40),rank:Ue()})}const he=Ta(Ge,Q,Be,At),H=he.land,Ve=ya({rng:J.sky,preset:"dawn",zenith:Jt.zenith,mid:Jt.mid,horizon:Jt.horizon,ground:Jt.ground,horizonPow:3.2,scatterColor:Ne?"#ffa468":"#ff9a70",scatter:.95,scatterPow:3.6,scatterHigh:.04,scatterFall:5.5,sunElevation:5,sunAzimuth:120,sunColor:"#fff0d0",sunSize:1.6,sunIntensity:11,sunGlow:.8,stars:.3,starDensity:.4,bodies:[],clouds:!1,clouds2:{coverage:.36,opacity:.2,lit:"#ffc8b4",shade:"#6a70b0"},lightElevationMin:5});ae.add(Ve.object),ae.fog=new h.FogExp2(ue.uFogCol.value.clone(),ue.uFogDen.value);const Ft=new h.DirectionalLight(je("#ffcf9a"),2.4);Ft.position.copy(Xt).multiplyScalar(400);const eo=new h.HemisphereLight(je("#7f9fe6"),je("#5a5690"),1.5);ae.add(Ft,Ft.target,eo),await E.yield();const Nt=Array.from({length:48},()=>new h.Vector3(1e6,1e6,1)),Ht=wo(ue,Ca,{uDip:{value:new h.Vector3(mo,vo,Lo)},uBlk:{value:Nt},uHot1:{value:je(_t[0])},uHot2:{value:je(_t[1])},uHot3:{value:je(_t[2])}}),Ct=new h.DataTexture(new Uint8Array([128,128,128,255]),1,1);Ct.needsUpdate=!0,Ht.userData.blank=Ct;const Lt={r:0,c:0,hi:0,es:0},to=(e,o,v,m,s)=>{const c=Math.hypot(e,o),u=he.way(e,o);let g=0;if(u.ok&&u.s<650){const S=Math.abs(u.d),M=u.d>0;g=j(192,220,u.s)*(1-j(590,646,u.s))*(1-j(24,34,S-he.halfW(u.s)))}const R=u.ok&&u.s>826?.55*j(826,850,u.s)*(1-j(34,64,Math.abs(u.d))):0;he.rimOf(e/(c+1e-6),o/(c+1e-6),Lt);const T=j(168,215,c)*(1-g)*(1-j(34,58,v))*(1-.8*Lt.es*(1-j(260,330,c))),q=Math.max(Lt.es*j(150,176,c)*(1-j(214,256,c)),R),F=g>.5?at(he.hollowAt(u.s,u.d)/2.5,0,1):0;return s.setRGB(g,Math.max(T,F),q)},Qe=await xa.makeTerrainAsync({rng:J.land,noise:he.noise,path:Q,corridor:!1,height:H,bounds:[-640,-640,640,640],cell:3,near:60,levels:5,maxTriangles:96e3,sunDir:Xt,ao:.5,color:to,materialInstance:Ht,detailTexture:Ct},E.yield);ue.uShadeMap.value=Qe.shadeMap,ue.uShadeBox.value.copy(Qe.shadeBox),ae.add(Qe.object);const Eo=(e,o)=>Qe.shadeAt(e,o).top;await E.yield();const N=To.waterLight(Ve),Y=[-640,-640,640,640],O=(e,o)=>-H(e,o),V=await To.oceanDepthAsync({depthAt:O,depthRect:Y,depthRes:96},E.yield),U=To.makeOcean({rng:J.sea,light:N,preset:"calm",level:co,deep:"#0e2f4a",scatter:"#1c5a78",depthAt:O,depthRect:Y,depthRes:96,depthData:V,radius:3600,rings:110,segments:128,shallowColor:"#3f9fb8",foam:.3});ae.add(U.object),await E.yield();const pe=new h.ShaderMaterial({uniforms:{...ue,uT0:Pt,uCrust:{value:je("#1a1012")},uHot1:{value:je(_t[0])},uHot2:{value:je(_t[1])},uHot3:{value:je(_t[2])}},vertexShader:`
        varying vec3 vP;
        void main() { vec4 wp = modelMatrix * vec4(position, 1.0); vP = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:`
        ${et.GLSL_NOISE}
        ${nt}
        uniform vec3 uCrust, uHot1, uHot2, uHot3; uniform float uT0;
        varying vec3 vP;
        // plates: (distance to the nearest middle, distance to the plate's edge, the plate's own number)
        vec3 plates(vec2 x) {
          vec2 n = floor(x), f = fract(x); float f1 = 8.0, f2 = 8.0, id = 0.0;
          for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
            vec2 g = vec2(float(i), float(j)), r = g + hash22(n + g) - f; float d = dot(r, r);
            if (d < f1) { f2 = f1; f1 = d; id = hash12(n + g + 17.3); } else if (d < f2) f2 = d;
          }
          return vec3(sqrt(max(f1, 0.0)), sqrt(max(f2, 0.0)) - sqrt(max(f1, 0.0)), id);
        }
        void main() {
          const float GLOW = 1.8; const vec2 FLOW = vec2(1.0, 0.3);
          vec3 N = vec3(0.0, 1.0, 0.0), V = normalize(cameraPosition - vP), lp = vP * 0.05;
          vec2 p = lp.xz; float t = (uTime + uT0) * 0.5;
          float fp = max(length(dFdx(p)), length(dFdy(p)));
          vec2 w = vec2(fbmLo(p * 0.6 + vec2(0.0, t * 0.05)), fbmLo(p * 0.6 + vec2(5.2, -t * 0.04)));
          vec2 q = p + (w - 0.5) * 1.2 + FLOW * t * 0.06;
          vec3 v1 = plates(q), v2 = plates(q * 2.6 + 3.1);
          // each line's own footprint: the span of its own coordinate over one pixel (so a line that runs along the gaze stays
          // thin), never more than the pattern's footprint allows and never less than a fifth of it
          float a1 = clamp(fwidth(v1.y), 0.3 * fp, 2.0 * fp), a2 = clamp(fwidth(v2.y), 0.8 * fp, 5.2 * fp);
          // the small plates' embossing is finer than the large plates' bevels: it gives its mean where a pixel covers its bevel
          float e2 = 1.0 - smoothstep(0.025, 0.05, 2.6 * fp);
          float hm = fbmLo(p * 0.33 - FLOW * t * 0.02 + 9.0) - 0.12;
          float wc = 0.8 * (0.35 + 2.4 * smoothstep(0.4, 0.85, hm)), W1 = wc * 0.1, W2 = wc * 0.07, WH = max(wc, 0.05) / 12.0;
          // each line's shape, widened by its footprint, and the share of the pixel it covers
          float s1 = 1.0 - smoothstep(0.0, W1 + a1, v1.y), s2 = (1.0 - smoothstep(0.0, W2 + a2, v2.y)) * 0.55 * smoothstep(0.3, 0.7, hm);
          float sh = exp(-v1.y / (WH + a1)) * 0.3;
          float pool = smoothstep(0.66, 0.95, hm) * (0.55 + 0.45 * mix(0.45, v2.x, 1.0 - smoothstep(0.35, 1.0, 2.6 * fp)));
          float heat = clamp(max(max(max(s1, s2), pool), sh), 0.0, 1.0);
          float cov = clamp(max(max(s1 * W1 / (W1 + a1), s2 * W2 / (W2 + a2)), max(pool, sh * WH / (WH + a1))) / max(heat, 1e-3), 0.0, 1.0);
          // relief: flat plate tops that bevel down into the cracks, small plates embossed on top; bevels widen with the footprint
          float hgt = smoothstep(0.0, 0.2 + a1, v1.y) * (0.7 + 0.3 * mix(0.9, smoothstep(0.0, 0.1 + a2, v2.y), e2))
            + (v1.z - 0.5) * 0.3 * smoothstep(0.04, 0.3 + a1, v1.y) + (w.x - 0.5) * 0.25;
          hgt *= 1.0 - pool;
          vec3 dpx = dFdx(vP), dpy = dFdy(vP); float hx = dFdx(hgt), hy = dFdy(hgt);
          vec3 r1 = cross(dpy, N), r2 = cross(N, dpx); float det = dot(dpx, r1);
          vec3 Nb = normalize(abs(det) * N - sign(det) * (hx * r1 + hy * r2) * 2.4 * (1.0 - smoothstep(0.05, 0.1, fp)) + N * 1e-6);
          float ndv = max(dot(Nb, V), 0.0);
          float idk = 1.0 - smoothstep(0.3, 1.0, fp), id = mix(0.5, v1.z, idk);
          vec3 em = uHot1 * smoothstep(0.0, 0.35, heat); em = mix(em, uHot2, smoothstep(0.25, 0.7, heat)); em = mix(em, uHot3, smoothstep(0.65, 1.0, heat));
          float shimmer = 1.0 + 0.3 * pool * (1.0 - smoothstep(0.25, 0.5, 3.1 * fp)) * sin((uTime + uT0) * 2.3 + vnoise(lp * 3.1 + (uTime + uT0) * 0.17) * 14.0);
          em *= GLOW * (0.3 + 0.7 * heat) * (0.88 + 0.12 * idk * sin((uTime + uT0) * 1.7 + v1.z * 40.0)) * shimmer;
          // the crust's mottle (cells of 7 m) and grit (cells of 1.8 m): each gives its mean where a pixel covers more than its cell
          float mk = 1.0 - smoothstep(0.35, 1.0, 2.7 * fp), gk = 1.0 - smoothstep(0.35, 1.0, 11.0 * fp), mo = vnoise(lp * 2.7 + v1.z * 17.0);
          float mottle = mix(0.5, mo, mk), mott2 = mix(0.3, mo * mo, mk), grit = mix(0.5, vnoise(lp * 11.0), gk);
          vec3 crust = uCrust * (0.45 + 1.1 * id) * (0.5 + 0.9 * mott2 + 0.45 * grit);
          // a dull sheen of the horizon's sky on the cooled plates, seen at a low angle
          float fr = min(0.04 + 0.96 * pow(clamp(1.0 - ndv, 0.0, 1.0), 5.0), 0.28);
          vec3 col = crust * (placeLight(vP, Nb, 1.0, sunSeen(vP)) + dawnRose(vP, Nb)) + uFogCol * 0.24 * fr * (0.5 + 0.9 * mottle) * (1.0 - pool);
          // the cracks light the plate edges from below
          col += uHot2 * GLOW * 0.1 * pow(1.0 - clamp(hgt, 0.0, 1.0), 3.0) * max(dot(Nb, N), 0.0) * (0.2 / (0.2 + a1));
          col = mix(col, em, smoothstep(0.0, 0.3, heat) * cov) + uHot1 * GLOW * 0.04 * (1.0 - heat);
          gl_FragColor = vec4(placeFog(col, vP), 1.0);
        }`}),ve=new h.Mesh(new h.CircleGeometry($e+8,64).rotateX(-Math.PI/2),pe);ve.position.set(0,st,0),ae.add(ve);const Ce=J.plumeFoot,Pe=[];for(let e=0;e<12;e++)Pe.push({b:Ce.range(0,360)*me,r:Ce.range(.45,.85)*$e});for(const e of Pe){e.x=Math.sin(e.b)*e.r,e.z=-Math.cos(e.b)*e.r;const o=Q.nearestXZ(e.x,e.z),v=Q.pointAt(o.u),m=Q.tangentAt(o.u);e.left=(e.x-v.x)*-m.z+(e.z-v.z)*m.x<0,e.far=Q.distanceTo(e.x,st,e.z)}const Ae=Pe.find(e=>e.left&&e.far>=60)||Pe.filter(e=>e.left).sort((e,o)=>o.far-e.far)[0]||Pe[0],be=[Ae.x,Ae.z],se=et.makeSmokeColumn({rng:J.plume,time:Ze,position:[be[0],st+2,be[1]],height:ra,radius:[14,76],size:[28,96],count:116,color:"#d2bbb6",colorTop:"#eee2dc",shadowColor:"#6c5c80",ambient:"#4a4468",hot:"#ff6a24",hotFalloff:130,opacity:.72,rate:.04,wind:Zt,sunDir:Xt,sunColor:"#f0c8a8"});ae.add(se.object),await E.yield();const ne=[95,130],ce=[330,300],ke=[-120,-120],lt=330,it=Math.hypot(ce[0]-ne[0],ce[1]-ne[1]),wt=(ce[0]-ne[0])/it,oo=(ce[1]-ne[1])/it,bt=-oo,yt=wt,Kt=-Math.cos(lt*me),jt=-Math.sin(lt*me),ha=(()=>{const v=new Float32Array(18720),m=[];for(let c=0;c<=64;c++){const u=c<=30?c*10:300*Math.pow(11.666666666666666,(c-30)/34);for(let g=0;g<96;g++){const R=(g+c%2*.5)/96*Math.PI*2,T=(c*96+g)*3;v[T]=Se[0]+Math.cos(R)*u,v[T+1]=0,v[T+2]=Se[1]+Math.sin(R)*u}}for(let c=0;c<64;c++)for(let u=0;u<96;u++){const g=c*96+u,R=c*96+(u+1)%96,T=g+96,q=R+96;c%2?m.push(g,T,q,g,q,R):m.push(g,T,R,R,T,q)}const s=new h.BufferGeometry;return s.setAttribute("position",new h.BufferAttribute(v,3)),s.setIndex(m),s.boundingSphere=new h.Sphere(new h.Vector3(Se[0],Ke,Se[1]),3600),s})(),Ro=`
      uniform vec4 uEdgeA, uEdgeB; uniform float uTop;
      // billows: rounded heads with sharp hollows between them, heaving slowly
      float billow(vec3 q) { return sqrt(clamp(abs(2.0 * vnoise(q) - 1.0), 0.0, 1.0)); }
      float cloudH(vec2 p, float t) {
        vec2 q = p + vec2(t * 1.1, t * 0.45);
        return billow(vec3(q / 92.0, t * 0.021)) * 17.0 + billow(vec3(q / 33.0 + 9.0, t * 0.04)) * 7.5 - 15.0;
      }
      float cloudFall(vec2 p) { return 1.0 - smoothstep(-70.0, 45.0, dot(p - uEdgeA.xy, uEdgeA.zw)); }
    `,Do=new h.ShaderMaterial({uniforms:{...ue,uT0:St,uTop:{value:Ke-4},uEdgeA:{value:new h.Vector4(ne[0],ne[1],-bt,-yt)},uEdgeB:{value:new h.Vector4(ke[0],ke[1],-Kt,-jt)}},transparent:!0,depthWrite:!0,vertexShader:`
        ${et.GLSL_NOISE}
        uniform float uTime, uT0; ${Ro}
        varying vec3 vP;
        void main() {
          vec3 P = position; P.y = uTop + cloudH(P.xz, (uTime + uT0)) - 44.0 * cloudFall(P.xz);
          vP = P; gl_Position = projectionMatrix * viewMatrix * vec4(P, 1.0);
        }`,fragmentShader:`
        ${et.GLSL_NOISE}
        ${nt}
        ${Ro}
        uniform float uT0; varying vec3 vP;
        void main() {
          vec2 p = vP.xz; float h0 = cloudH(p, (uTime + uT0)), e = 3.0, rc = length(p);
          float fine = vnoise(p / 7.0 + (uTime + uT0) * 0.05) + 0.5 * vnoise(p / 3.1 - (uTime + uT0) * 0.07);
          float nz = (fine - 0.75) * 26.0 + h0 * 1.6;
          float k = smoothstep(-64.0, 28.0, dot(p - uEdgeA.xy, uEdgeA.zw) + nz) * smoothstep(-40.0, 50.0, dot(p - uEdgeB.xy, uEdgeB.zw) + nz) * smoothstep(182.0, 236.0, rc + nz);
          vec3 N = normalize(vec3(-(cloudH(p + vec2(e, 0.), (uTime + uT0)) - h0) / e, 0.8, -(cloudH(p + vec2(0., e), (uTime + uT0)) - h0) / e) + vec3(0.3, 0., 0.3) * (fine - 0.75));
          // gold on what faces the low sun, violet in its own shade, blue-violet in the hollows
          float sunK = smoothstep(uBand.x, uBand.y, vP.y), nl = clamp(dot(N, uSunDir) * 2.4 + 0.04, 0.0, 1.0);
          float depth = smoothstep(-13.0, 5.0, h0 + (fine - 0.75) * 5.0);
          vec3 shade = mix(vec3(0.05, 0.06, 0.21), vec3(0.23, 0.19, 0.43), depth);
          // the tops stand in the low sun whatever way they face; the hollows and far sides keep the violet shade
          float lit = max(nl * (0.15 + 0.85 * depth), 0.8 * smoothstep(-3.0, 7.0, h0 + (fine - 0.75) * 4.0));
          vec3 col = mix(shade, vec3(1.0, 0.85, 0.64) * 1.16, lit * sunK);
          col += uGlowCol * 0.08 * (1.0 - nl);
          // the edge breaks into shreds, it is no even veil; the shreds belong to the edge alone: where the layer has no body at
          // all (k = 0: the whole clear side, over the sea and the canyon) nothing is drawn, so no fleck of it stands in the sky
          float a = smoothstep(0.3, 0.62, k + (fine - 0.75) * 0.8 * (1.0 - k) * smoothstep(0.0, 0.12, k));
          gl_FragColor = vec4(placeFog(col, vP), a);
          if (a < 0.02) discard;
        }`});Do.side=h.DoubleSide;const bo=new h.Mesh(ha,Do);bo.renderOrder=-.5,bo.frustumCulled=!1,ae.add(bo),await E.yield();const ao=J.headPlaces,Gt=[],xt=[];for(let e=0;e<23;e++)Gt.push({a:ao(),b:ao(),c:ao()});const _o=ao(),so=.56,Bo=34,yo=(e,o)=>e*B(.5,1,o)/so,xo=(e,o,v,m)=>xt.push([e,m-so*v,o,v]),no=(e,o)=>Math.max(co,H(e,o));for(let e=0;e<5;e++){const o=(_o+e)/5*it,v=ne[0]+wt*o,m=ne[1]+oo*o,s=Ke-no(v,m),c=Gt[e];if(s<20)continue;const u=yo(s,c.a),g=u*B(.2,.4,c.b);xo(v-bt*g,m-yt*g,u,Ke)}for(let e=0;e<4;e++){const o=(_o+e+.5)/5*it,v=ne[0]+wt*o,m=ne[1]+oo*o,s=Ke-no(v,m);if(!(s<20))for(let c=1;c<=2;c++){const u=Gt[5+e*2+c-1],g=c*B(25,40,u.b),R=v+bt*g,T=m+yt*g,q=s*(1-c/3);xo(R,T,yo(q,u.a),Math.min(Ke,no(R,T)+q))}}{const e=Math.hypot(Se[0],Se[1])+ut,o=Math.atan2(wt,-oo)/me,v=((o-lt)%360+360)%360,m=(s,c,u,g,R)=>{const T=(lt+(s+R.a)/c*v)*me,q=e*B(u,g,R.b);let F=Math.sin(T)*q,S=-Math.cos(T)*q;const M=Ke-no(F,S);if(M<20)return;const _=yo(M,R.c),k=(F-ne[0])*bt+(S-ne[1])*yt+.3*_;k>0&&(F-=bt*k,S-=yt*k);const C=(F-ke[0])*Kt+(S-ke[1])*jt+.3*_;C>0&&(F-=Kt*C,S-=jt*C),xo(F,S,_,Ke-2)};for(let s=0;s<6;s++)m(s,6,1,2,Gt[13+s]);for(let s=0;s<4;s++)m(s,4,2,3,Gt[19+s])}{const e=J.cloudHeadsTwin,o=e.fork?e.fork("clouds"):e,v=[],m=[];for(let s=850;s<=Q.length;s+=2)v.push(Q.posAtDist(s));for(let s=0;s<xt.length;s++){const c=xt[s],u=c[3],g=u*so*(.75+.5*o()),R=[{x:0,z:0,r:u*.5,h:g}];let T=!1;for(let q=1+Math.floor(o()*3);q>0;q--){const F=o()*6.283,S=u*(.22+.3*o());R.push({x:Math.cos(F)*S,z:Math.sin(F)*S,r:u*(.28+.2*o()),h:g*(.35+.45*o())})}for(let q=0;q<Bo;q++){const F=R[o()<.45?0:Math.floor(o()*R.length)],S=o()**1.25,M=o()*6.283,_=F.r*(1-.62*S**1.4)*Math.sqrt(o()),k=u*(.3-.13*S)*(.8+.4*o()),C=c[0]+F.x+Math.cos(M)*_,$=c[1]+S*F.h+k*.5,Z=c[2]+F.z+Math.sin(M)*_;o();for(const te of v)if(Math.hypot(te.x-C,te.y-$,te.z-Z)<1.5*k){T=!0;break}}T&&m.push(s)}for(const s of m)xt[s]=[xt[s][0],-500,xt[s][2],1]}const Mo=await ta({rng:J.cloudHeads,mode:"cumulus",sky:Ve,at:xt,height:so,puffs:Bo,wind:[0,0,0],hazeColor:ue.uFogCol.value},E.yield);ae.add(Mo.object),await E.yield();const qo=await ta({rng:J.cloudSea,mode:"sea",sky:Ve,altitude:171,deck:!1,spacing:84,relief:34,towers:.12,wind:[.9,0,.35],noiseTexture:Mo.noiseTexture,hazeColor:ue.uFogCol.value,avoid:[[0,168,0,la],[ne[0]+bt*2985,Ke,ne[1]+yt*2985,3e3],[ke[0]+Kt*2985,Ke,ke[1]+jt*2985,3e3]]},E.yield);ae.add(qo.object),await E.yield();{const e=new h.Vector3(135,48,135),o=.3*e.x/Math.hypot(Zt[0],Zt[2]),v=new h.Vector3(Zt[0]*o,st+92,Zt[2]*o),m=new h.ShaderMaterial({uniforms:{uTime:Ze,uT0:Qt,uCol:{value:new h.Color(1,.36,.09)},uC:{value:v},uR:{value:e}},transparent:!0,depthWrite:!1,blending:h.AdditiveBlending,side:h.BackSide,vertexShader:"varying vec3 vP; void main() { vec4 wp = modelMatrix * vec4(position, 1.0); vP = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }",fragmentShader:`
          uniform float uTime, uT0; uniform vec3 uCol, uC, uR; varying vec3 vP;
          void main() {
            // the ray from the eye to this point of the volume's far side, in the volume's own measure (a ball of radius 1)
            vec3 E = (cameraPosition - uC) / uR, D = vP - cameraPosition; D = D / max(length(D), 1e-3) / uR;
            float A = dot(D, D), B = dot(E, D), Cc = dot(E, E) - 1.0, h = sqrt(max(B * B - A * Cc, 0.0));
            float t0 = max((-B - h) / A, 0.0), t1 = max((-B + h) / A, t0);
            // the sum of the density (1 - r * r) along the ray, in metres, over the longest such sum (a level ray through the middle)
            float sum = -(A * (t1 * t1 * t1 - t0 * t0 * t0) / 3.0 + B * (t1 * t1 - t0 * t0) + Cc * (t1 - t0));
            float a = pow(clamp(sum / (1.3333 * uR.x), 0.0, 1.0), 1.3333);
            gl_FragColor = vec4(uCol * a * (0.8 + 0.06 * sin((uTime + uT0) * 0.8)), 1.0);
          }`}),s=new h.Mesh(new h.SphereGeometry(1,32,16),m);s.position.copy(v),s.scale.copy(e),s.renderOrder=3,s.frustumCulled=!1,ae.add(s)}await E.yield();{const e=J.rubble,o=Math.round(330*Fe),v=[],m=[];for(let a=0;a<o+90;a++){const z=a>=o,b=z?J.footLumps:e,t=Math.floor(b()*3)%3,n=b()<.5?-1:1,r=b()<.5?-1:1;v.push({s:z?gt[t]+n*b.range(19,37):b.range(238,594),side:z?1:r,off:z?b.range(-2.5,7):b.range(-5.2,-.5),sz:a<14?b.range(2.4,4.4):.5+1.9*Math.pow(b(),2.2),rx:b.range(0,6.28),ry:b.range(0,6.28),rz:b.range(0,6.28),sq:b.range(.6,1),tint:b(),sh:b.range(.75,1.08),ph:b()})}const s=new h.IcosahedronGeometry(.6,1),c=s.attributes.position;for(let a=0;a<c.count;a++){const z=c.getX(a),b=c.getY(a),t=c.getZ(a),n=Math.sin(Math.round(z*50)*12.9898+Math.round(b*50)*78.233+Math.round(t*50)*37.719)*43758.5453;let r=.6+.7*(n-Math.floor(n));r*=1+.3*(.8*z+.6*t)/.6,(.5*z-.7*b+.5*t)/.6>.5&&(r*=.62),c.setXYZ(a,z*r,b*r,t*r)}const u=(a,z)=>Math.hypot(H(a+1.2,z)-H(a-1.2,z),H(a,z+1.2)-H(a,z-1.2))/2.4;for(let a=0;a<v.length;a++){const z=v[a];a%40===39&&await E.yield();let b=!1;for(const l of Ye)Math.abs(z.s-l)<15&&(b=!0);if(b)continue;const t=Re(z.s),n=Math.hypot(t.t.x,t.t.z)||1,r=z.side*(he.halfW(z.s)+z.off),p=t.p.x-t.t.z/n*r,i=t.p.z+t.t.x/n*r;he.hollowAt(z.s,r)>.05||u(p,i)>.42||m.push({x:p,y:H(p,i)+z.sz*.13,z:i,c:z})}const g=new h.ShaderMaterial({uniforms:{...ue},vertexShader:`
          attribute vec4 aTint; varying vec3 vP, vL; varying vec4 vT;
          void main() { vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.0); vP = wp.xyz; vL = position; vT = aTint; gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:`
          ${et.GLSL_NOISE}
          ${nt}
          ${go}
          varying vec3 vP, vL; varying vec4 vT;
          void main() {
            vec3 N = normalize(cross(dFdx(vP), dFdy(vP)) + vec3(0.0, 1e-12, 0.0));
            // a block keeps the beds it broke from: bands across it in its own tilt, a dark seam between two bands
            float bb = vL.y * (5.0 + 4.0 * vT.w) + vT.w * 7.0 + 0.25 * vnoise(vP * 0.9), bh = hash11(floor(bb) * 3.1 + vT.w * 11.0);
            // every band takes the land's own bed paint: its two tones, mixed by the band's hash as the land mixes them by the bed's
            vec3 tone = mix(vec3(0.479, 0.138, 0.045), vec3(0.658, 0.323, 0.102), smoothstep(0.25, 0.45, bh));
            // (a lump of the crater's wall, vT.y 1, takes the bowl's own two tones: dark lava, and rust in some of its bands)
            tone = mix(tone, mix(vec3(0.12, 0.11, 0.135), vec3(0.30, 0.12, 0.07), step(0.66, bh)), vT.y);
            vec3 alb = tone * vT.x * (0.78 + 0.4 * fract(bh * 7.3)) * (1.0 - 0.4 * lineAA(bb, 0.07)) * (0.8 + 0.3 * vnoise(vP * 1.3));
            // the crack net is mapped on the plane the face lies nearest to (a lump's faces are flat), so it is never drawn out along a face
            vec3 aN = abs(N); vec2 cq = aN.y >= max(aN.x, aN.z) ? vP.xz : (aN.x > aN.z ? vP.zy : vP.xy);
            vec2 cp = crackPit(cq, vP);
            alb *= 1.0 - (0.42 * footK(vP, NET_STEP) * cp.x + 0.34 * footK(vP, PIT_STEP) * cp.y);
            // a lump takes the light much as the floor it lies on does (its faces lean the light, they do not turn it off), so it
            // keeps the beds' tone in the shade as well as in the sun
            // (a lump of the crater's wall keeps its own flat faces to the light: the lake's orange on one, the sky's blue-violet on the next)
            float ao = 0.78 + 0.22 * (N.y * 0.5 + 0.5); vec3 NL = normalize(N + vec3(0.0, 0.9 * (1.0 - vT.y), 0.0));
            vec3 col = underWhite(alb * (placeLight(vP, NL, ao, sunSeen(vP)) + dawnRose(vP, NL))) + skySheen(NL, ao);
            gl_FragColor = vec4(placeFog(col, vP), 1.0);
          }`}),R=new h.InstancedMesh(s,g,Math.max(1,m.length)),T=new h.Matrix4,q=new h.Quaternion,F=new h.Euler,S=new h.Vector3,M=new h.Vector3,_=new Float32Array(Math.max(1,m.length)*4);m.forEach((a,z)=>{const b=a.c;T.compose(S.set(a.x,a.y,a.z),q.setFromEuler(F.set(b.rx,b.ry,b.rz)),M.set(b.sz,b.sz*b.sq,b.sz*(1.5-b.sq))),R.setMatrixAt(z,T),_[z*4]=b.sh,_[z*4+3]=b.ph}),s.setAttribute("aTint",new h.InstancedBufferAttribute(_,4)),R.count=m.length,R.instanceMatrix.needsUpdate=!0,R.frustumCulled=!1,ae.add(R),await E.yield();const k=J.blocks,C=[[Ye[0]-33,13]],$=[],Z=[],te=new Set,fe=[];for(let a=200;a<=650;a+=2)fe.push(Q.posAtDist(a));for(let a=0;a<Ye.length-1;a++)C.push([.5*(Ye[a]+Ye[a+1]),Math.max(0,.5*(Ye[a+1]-Ye[a])-15)]);C.push([Ye[Ye.length-1]+19,3]);const de=()=>({j:k.range(-1,1),side:k()<.5?-1:1,m:k.range(.6,2.6),sz:k.range(1.9,4.2),rx:k.range(0,6.28),ry:k.range(0,6.28),rz:k.range(0,6.28),sq:k.range(.6,1),sh:k.range(.75,1.08),ph:k(),rank:k()});for(let a=0;a<C.length;a++)$.push({i:a,twin:!1,...de()});const ge=$.slice(1,C.length-1).sort((a,z)=>a.rank-z.rank).slice(0,3).map(a=>a.i).sort((a,z)=>a-z);for(const a of ge)$.push({i:a,twin:!0,...de()});const oe=[[1,0],[-1,0],[.35,1.4],[-.35,1.4],[.7,2.8],[-.7,2.8]],f=(a,z,b)=>{const t=a.i*2+(z>0?1:0),n=C[a.i][0]+a.j*b[0]*C[a.i][1],r=he.halfW(n),p=Math.min(a.sz,(r-12.7)/1.01),i=z*Math.max(r-a.m-b[1],12.4+1.01*p);if(p<1.9||te.has(t))return!1;const l=Re(n),d=Math.hypot(l.t.x,l.t.z)||1,L=l.p.x-l.t.z/d*i,A=l.p.z+l.t.x/d*i,w=Math.max(1.2,.6*p);if(he.hollowAt(n,i)>.05||Math.hypot(H(L+w,A)-H(L-w,A),H(L,A+w)-H(L,A-w))/(2*w)>.5)return!1;const I=H(L,A)+.3*p*a.sq;let P=1e9;for(let K=Math.floor((n-240)/2);K<=Math.ceil((n-160)/2);K++){const y=fe[K];P=Math.min(P,Math.hypot(y.x-L,y.y-I,y.z-A))}return P-1.01*p<12?!1:(te.add(t),Z.push({x:L,y:I,z:A,sz:p,c:a}),!0)},x=(a,z)=>{for(const b of oe)if(f(a,z,b)||f(a,-z,b))return!0;return!1};for(const a of $)a.twin||(x(a,a.side),await E.yield());for(const a of $)a.twin&&(x(a,a.side),await E.yield());{const a=J.blockGroups,z=28+Math.floor(a()*13),b=[];for(let r=0;r<14;r++){const p={u:a(),kind:a(),side:a()<.5?-1:1,e:a(),lumps:[]};for(let i=0;i<12;i++)p.lumps.push({r:7*Math.sqrt(a()),a:a.range(0,6.283),sz:a.range(1.25,4.2),rx:a.range(0,6.28),ry:a.range(0,6.28),rz:a.range(0,6.28),sq:a.range(.6,1),sh:a.range(.75,1.08),ph:a()});b.push(p)}const t=C[0][0]-C[0][1],n=C[C.length-1][0]+C[C.length-1][1];for(let r=0;r<3;r++)for(let p=0;p<14&&Z.length<z;p++){const i=b[p],l=B(t,n,(p+i.u)/14),d=he.halfW(l),L=i.side*(i.kind<.5?d-B(1.5,4.5,i.e):B(6,12,i.e));for(let A=[0,5,9][r];A<[5,9,12][r]&&Z.length<z;A++){const w=i.lumps[A],I=l+Math.cos(w.a)*w.r,P=he.halfW(I)-.6*w.sz-.6,K=.6*w.sz+1.5,y=at(L+Math.sin(w.a)*w.r,-P,P);let D=he.hollowAt(I,y)>.05;for(let Te=0;Te<6&&!D;Te++)D=he.hollowAt(I+Math.cos(Te*1.0472)*K,y+Math.sin(Te*1.0472)*K)>.05;if(D)continue;const W=Re(I),re=Math.hypot(W.t.x,W.t.z)||1,X=W.p.x-W.t.z/re*y,ye=W.p.z+W.t.x/re*y,qe=Math.max(1.2,.6*w.sz);if(Math.hypot(H(X+qe,ye)-H(X-qe,ye),H(X,ye+qe)-H(X,ye-qe))/(2*qe)>.5)continue;const Oe=H(X,ye)+.25*w.sz*w.sq;let ft=1e9;for(let Te=Math.max(0,Math.floor((I-220)/2));Te<=Math.min(fe.length-1,Math.ceil((I-180)/2));Te++){const dt=fe[Te];ft=Math.min(ft,Math.hypot(dt.x-X,dt.y-Oe,dt.z-ye))}ft-1.01*w.sz<3.6||Z.some(Te=>Math.hypot(Te.x-X,Te.z-ye)<.75*(Te.sz+w.sz))||Z.push({x:X,y:Oe,z:ye,sz:w.sz,c:w})}await E.yield()}}const ie=s.clone(),ee=new h.InstancedMesh(ie,g,40),xe=new Float32Array(160);Z.forEach((a,z)=>{const b=a.c;T.compose(S.set(a.x,a.y,a.z),q.setFromEuler(F.set(b.rx,b.ry,b.rz)),M.set(a.sz,a.sz*b.sq,a.sz*(1.5-b.sq))),ee.setMatrixAt(z,T),xe[z*4]=b.sh,xe[z*4+3]=b.ph,Nt[z].set(a.x,a.z,.8*a.sz)}),ie.setAttribute("aTint",new h.InstancedBufferAttribute(xe,4)),ee.count=Z.length,ee.instanceMatrix.needsUpdate=!0,ee.frustumCulled=!1,ee.name="fallen-blocks",ae.add(ee);const le=J.floorRubble,Me=[],we=[];for(let a=0;a<12;a++){const z={u:le(),w:le.range(-1,1),kind:le(),e:le(),n:5+Math.floor(le()*8),lumps:[]};for(let b=0;b<12;b++)z.lumps.push({r:4.5*Math.sqrt(le()),a:le.range(0,6.283),sz:.4+1.4*Math.pow(le(),1.6),rx:le.range(0,6.28),ry:le.range(0,6.28),rz:le.range(0,6.28),sq:le.range(.6,1),sh:le.range(.75,1.08),ph:le()});Me.push(z)}const Le=C[0][0]-C[0][1],De=C[C.length-1][0]+C[C.length-1][1];for(let a=0;a<12;a++){const z=Me[a];let b=B(Le,De,(a+z.u)/12),t=z.w*(he.halfW(b)-2);const n=gt.find(p=>Math.abs(p-b)<21),r=Be.reduce((p,i)=>!p||Math.abs(i.s-b)<Math.abs(p.s-b)?i:p,null);if(z.kind<.3&&r){const p=.5*(r.d0+r.d1),i=r.s-p*Math.sin(r.yaw||0),l=p*Math.cos(r.yaw||0),d=z.e*6.283;let L=0;for(;L<30&&he.hollowAt(i+Math.cos(d)*L,l+Math.sin(d)*L)>.05;)L+=.5;const A=i+Math.cos(d)*(L+1.2),w=l+Math.sin(d)*(L+1.2);Math.abs(w)<he.halfW(A)-1&&(b=A,t=w)}else z.kind<.55?t=(z.w<0?-1:1)*(he.halfW(b)-B(1.5,4,z.e)):z.kind<.75&&n!==void 0&&(b=n+B(-8,8,z.e),t=he.halfW(b)-B(2,7,Math.abs(z.w)));for(let p=0;p<z.n&&we.length<96;p++){const i=z.lumps[p],l=b+Math.cos(i.a)*i.r,d=t+Math.sin(i.a)*i.r;if(Math.abs(d)>he.halfW(l)-.6*i.sz-.5||he.hollowAt(l,d)>.05)continue;const L=Re(l),A=Math.hypot(L.t.x,L.t.z)||1,w=L.p.x-L.t.z/A*d,I=L.p.z+L.t.x/A*d,P=Math.max(.6,.6*i.sz);if(Math.hypot(H(w+P,I)-H(w-P,I),H(w,I+P)-H(w,I-P))/(2*P)>.5)continue;const K=H(w,I)+.2*i.sz*i.sq;let y=1e9;for(let D=Math.max(0,Math.floor((l-216)/2));D<=Math.min(fe.length-1,Math.ceil((l-184)/2));D++){const W=fe[D];y=Math.min(y,Math.hypot(W.x-w,W.y-K,W.z-I))}y-1.01*i.sz<3.6||Z.some(D=>Math.hypot(D.x-w,D.z-I)<.8*D.sz+.6*i.sz)||we.push({x:w,y:K,z:I,c:i})}await E.yield()}const Je=s.clone(),Ee=new h.InstancedMesh(Je,g,96),_e=new Float32Array(384);we.forEach((a,z)=>{const b=a.c;T.compose(S.set(a.x,a.y,a.z),q.setFromEuler(F.set(b.rx,b.ry,b.rz)),M.set(b.sz,b.sz*b.sq,b.sz*(1.5-b.sq))),Ee.setMatrixAt(z,T),_e[z*4]=b.sh,_e[z*4+3]=b.ph}),Je.setAttribute("aTint",new h.InstancedBufferAttribute(_e,4)),we.slice().sort((a,z)=>z.c.sz-a.c.sz).slice(0,8).forEach((a,z)=>Nt[40+z].set(a.x,a.z,.8*a.c.sz)),Ee.count=we.length,Ee.instanceMatrix.needsUpdate=!0,Ee.frustumCulled=!1,Ee.name="floor-rubble",ae.add(Ee),await E.yield();{const a=J.wallRibs,z=[],b=[],t=[],n=Q.posAtDist(po),r=Math.atan2(n.x,-n.z),p=47*me;for(let y=0;y<60;y++)z.push({u:a(),v:a(),sz:a.range(1.67,6.67),rib:a()<.5,st:a.range(1.5,2),roll:a.range(0,6.283),sq:a.range(.6,1),sh:a.range(.8,1.1),ph:a()});for(let y=700;y<=960;y+=2)t.push(Q.posAtDist(y));const i=new h.Vector3,l=new h.Vector3,d=new h.Vector3,L=new h.Vector3,A=new h.Matrix4,w=new h.Quaternion;for(let y=0;y<z.length;y++){const D=z[y],W=r+(2*D.u-1)*p,re=$e+55*D.v,X=Math.sin(W)*re,ye=-Math.cos(W)*re,qe=1.01*D.sz*D.st;if(y%12===11&&await E.yield(),re<$e+.5*qe)continue;const Oe=he.way(X,ye);if(Oe.ok&&Oe.s>po-9&&Math.abs(Oe.d)<24+qe)continue;const ft=H(X,ye)+.1*D.sz;let Te=1e9;for(const $t of t)Te=Math.min(Te,Math.hypot($t.x-X,$t.y-ft,$t.z-ye));if(Te-qe<3.6)continue;const dt=(H(X+2,ye)-H(X-2,ye))/4,Vt=(H(X,ye+2)-H(X,ye-2))/4;L.set(-dt,1,-Vt).normalize(),D.rib?i.set(Math.sin(W),Math.hypot(dt,Vt),-Math.cos(W)).normalize():i.set(Math.cos(W),0,Math.sin(W)),d.crossVectors(i,L).normalize(),l.crossVectors(d,i),A.makeBasis(i,l,d),q.setFromRotationMatrix(A).multiply(w.setFromAxisAngle(S.set(1,0,0),D.roll)),b.push({x:X,y:ft,z:ye,c:D,q:q.clone()})}const I=s.clone(),P=new h.InstancedMesh(I,g,60),K=new Float32Array(240);b.forEach((y,D)=>{const W=y.c;T.compose(S.set(y.x,y.y,y.z),y.q,M.set(W.sz*W.st,W.sz*W.sq*.8,W.sz*(1.5-W.sq)*.8)),P.setMatrixAt(D,T),K[D*4]=W.sh,K[D*4+1]=1,K[D*4+3]=W.ph}),I.setAttribute("aTint",new h.InstancedBufferAttribute(K,4)),P.count=b.length,P.instanceMatrix.needsUpdate=!0,P.frustumCulled=!1,P.name="wall-ribs",ae.add(P)}}await E.yield();{const e=J.bergs,o=9,v=[],m=[],s=[],c=[],u=[];for(let k=0;k<16;k++)u.push({s:e.range(8,205),d:(e()<.5?-1:1)*e.range(55,190),r:e.range(9,18),h:e.range(4.5,9),ph:e.range(0,6.28),ox:e.range(-.3,.3),oz:e.range(-.3,.3)});let g=0;for(const k of u){if(g>=7)break;const C=Re(k.s),$=Math.hypot(C.t.x,C.t.z)||1,Z=C.p.x-C.t.z/$*k.d,te=C.p.z+C.t.x/$*k.d;if(H(Z,te)>-1.5||H(Z+k.r,te)>-1.5||H(Z-k.r,te)>-1.5||H(Z,te+k.r)>-1.5||H(Z,te-k.r)>-1.5)continue;const fe=v.length/3,de=[[-2.5,1.05],[.32*k.h,.94],[.72*k.h,.58],[k.h,.2]];for(let oe=0;oe<de.length;oe++)for(let f=0;f<o;f++){const x=f/o*Math.PI*2+k.ph,ie=k.r*de[oe][1]*(.8+.4*he.noise.n2(Z*.1+f*1.7,te*.1+oe*2.3)),ee=oe/(de.length-1);v.push(Z+k.ox*k.r*ee+Math.cos(x)*ie,de[oe][0]+(oe===2?.25*k.h*he.noise.n2(f*3.1,Z):0),te+k.oz*k.r*ee+Math.sin(x)*ie),m.push(1,1,1),s.push(ee,1)}for(let oe=0;oe<de.length-1;oe++)for(let f=0;f<o;f++){const x=fe+oe*o+f,ie=fe+oe*o+(f+1)%o;c.push(x,x+o,ie,ie,x+o,ie+o)}const ge=v.length/3;v.push(Z+k.ox*k.r,k.h+.6,te+k.oz*k.r),m.push(1,1,1),s.push(1,1);for(let oe=0;oe<o;oe++)c.push(fe+3*o+oe,ge,fe+3*o+(oe+1)%o);g++}if(g){const k=new h.BufferGeometry;k.setAttribute("position",new h.Float32BufferAttribute(v,3)),k.setAttribute("color",new h.Float32BufferAttribute(m,3)),k.setAttribute("aShade",new h.Float32BufferAttribute(s,2)),k.setIndex(c),k.computeVertexNormals(),ae.add(new h.Mesh(k,wo(ue,La)))}const R=[],T=[],q=[],F=J.frost;for(let k=0;k<12;k++){const C=F.range(0,215),$=(F()<.5?-1:1)*F.range(46,210),Z=F.range(70,150),te=F.range(40,80),fe=F.range(2.2,5.5),de=Re(C),ge=Math.hypot(de.t.x,de.t.z)||1,oe=de.p.x-de.t.z/ge*$,f=de.p.z+de.t.x/ge*$,x=R.length/3;R.push(oe-Z,fe,f-te,oe+Z,fe,f-te,oe+Z,fe,f+te,oe-Z,fe,f+te),T.push(0,0,1,0,1,1,0,1),q.push(x,x+2,x+1,x,x+3,x+2)}const S=new h.BufferGeometry;S.setAttribute("position",new h.Float32BufferAttribute(R,3)),S.setAttribute("uv",new h.Float32BufferAttribute(T,2)),S.setIndex(q);const M=new h.ShaderMaterial({uniforms:{...ue,uAmt:{value:rt?.42:.22}},transparent:!0,depthWrite:!1,side:h.DoubleSide,vertexShader:"varying vec2 vUv; varying vec3 vP; void main() { vUv = uv; vP = position; gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0); }",fragmentShader:`
          ${et.GLSL_NOISE}
          ${nt}
          uniform float uAmt; varying vec2 vUv; varying vec3 vP;
          void main() {
            vec2 c = vUv * 2.0 - 1.0; float e = clamp(1.0 - dot(c, c), 0.0, 1.0);
            float n = vnoise(vec3(vP.xz * 0.035 + vec2(uTime * 0.03, 0.0), uTime * 0.02)) * 0.65 + vnoise(vP.xz * 0.11 - uTime * 0.02) * 0.35;
            float a = e * e * smoothstep(0.35, 0.75, n) * uAmt;
            vec3 col = vec3(0.50, 0.58, 0.80) + uGlowCol * 0.22;
            gl_FragColor = vec4(placeFog(col, vP), a);
          }`}),_=new h.Mesh(S,M);_.renderOrder=2,ae.add(_)}await E.yield();{const e=J.dust,o=Math.round(420*Fe),v=rt?450:0,m=o*gt.length+v,s=new Float32Array(m*3),c=new Float32Array(m);let u=0;for(let q=0;q<v;q++){const F=e.range(0,235),S=(e()<.5?-1:1)*e.range(4.5,70),M=Re(F),_=Math.hypot(M.t.x,M.t.z)||1;s[u*3]=M.p.x-M.t.z/_*S,s[u*3+1]=e.range(7,34),s[u*3+2]=M.p.z+M.t.x/_*S,c[u]=e(),u++}for(let q=0;q<gt.length;q++){const F=gt[q],S=J.gapMotes[q];for(let M=0;M<o;M++){const _=F+S.range(-30,30),k=(S()<.5?-1:1)*S.range(4.2,19),C=S.range(1,30),$=Re(_),Z=Math.hypot($.t.x,$.t.z)||1,te=$.p.x-$.t.z/Z*k,fe=$.p.z+$.t.x/Z*k;s[u*3]=te,s[u*3+1]=H(te,fe)+C,s[u*3+2]=fe,c[u]=S(),u++}}const g=new h.BufferGeometry;g.setAttribute("position",new h.BufferAttribute(s,3)),g.setAttribute("aSeed",new h.BufferAttribute(c,1));const R=new h.ShaderMaterial({uniforms:{...ue},transparent:!0,depthWrite:!1,blending:h.AdditiveBlending,vertexShader:`
          attribute float aSeed; uniform float uTime; varying vec3 vP; varying float vK;
          void main() {
            float ph = mod(uTime * (0.2 + 0.25 * aSeed) + aSeed * 7.0, 6.0);
            vec3 P = position; P.y -= ph;
            vP = P; vK = sin(3.14159 * ph / 6.0) * (0.55 + 0.45 * sin(uTime * (1.3 + 2.0 * aSeed) + aSeed * 90.0));
            vec4 mv = viewMatrix * vec4(P, 1.0);
            gl_PointSize = clamp(46.0 * (0.6 + aSeed) / max(-mv.z, 1.0), 1.2, 6.0);
            gl_Position = projectionMatrix * mv;
          }`,fragmentShader:`
          ${nt}
          varying vec3 vP; varying float vK;
          void main() {
            vec2 c = gl_PointCoord * 2.0 - 1.0; float a = max(1.0 - dot(c, c), 0.0);
            vec4 sm = texture2D(uShadeMap, (vP.xz - uShadeBox.xy) * uShadeBox.zw);
            float open = smoothstep(-1.0, 2.5, vP.y - sm.b);
            vec3 col = mix(uGlowCol * 1.5, uSunCol * 0.8, smoothstep(45.0, 105.0, vP.y));
            gl_FragColor = vec4(col * (a * a * open * vK * 0.85), 1.0);
          }`}),T=new h.Points(g,R);T.frustumCulled=!1,T.renderOrder=4,ae.add(T)}await E.yield();const Mt=J.pillarPlaces,Xe=J.pillars,It=Mt()<.5?5:6,Ho=Mt()<.5?3:4,ca=Mt()<.5?-1:1,Wt=[];for(let e=0;e<12;e++)Wt.push({top:Mt.range(232,292),share:Mt.range(.16,.22),u:Mt(),v:Mt()});const ht=Wt.map(e=>{const o=Xe.int(5,7),v=[0,1,2,3,4,5].map(()=>Xe.range(-.3,.3)),m=[0,1,2,3,4,5,6,7].map(()=>Xe.range(.8,1.2)),s=[0];for(let c=1;c<o;c++)s.push((c+v[c-1])/o);return s.push(1),{top:e.top,rFoot:(e.top-Ke)*e.share,rTopK:Xe.range(.36,.48),ph:Xe.range(0,6.28),lobes:Xe.range(.14,.3),lean:[Xe.range(-.035,.035),Xe.range(-.035,.035)],seed:Xe.range(0,100),bounds:s,mult:m.slice(0,o+1),peak:[Xe.range(-.5,.5),Xe.range(2,7),Xe.range(-.5,.5)]}}),pt=[];{const e=(F,S,M)=>pt.push({...ht[F],x:S,z:M}),o=ht.map((F,S)=>S).sort((F,S)=>ht[F].rFoot-ht[S].rFoot),v=o.slice(0,2).sort((F,S)=>F-S),m=o.slice(2).sort((F,S)=>F-S),s=(Dt-90)*me,c=Se[0]+ut*Math.sin(s),u=Se[1]-ut*Math.cos(s),g=Math.cos(Dt*me),R=Math.sin(Dt*me);for(const[F,S]of[[v[0],-1],[v[1],1]]){const M=ht[F],_=M.rFoot*Math.max(M.mult[0],M.mult[1])*(1+na)*(1+M.lobes+uo[0]+uo[1]),k=Co+_+B(2,6,Wt[F].u);e(F,c+g*S*k,u+R*S*k)}{const F=pt[1],S=Math.atan2(F.x-Se[0],-(F.z-Se[1])),M=m.slice(0,It),_=de=>F.rFoot+1.5+M.reduce((ge,oe)=>ge+de*ht[oe].rFoot+1.5,0),k=de=>1.08*_(de)/Math.PI,C=de=>ut-30-de*Math.max(...M.map(ge=>ht[ge].rFoot));let $=1;for(;$>.5&&k($)>C($);)$-=.02;const Z=_($),te=k($);let fe=(F.rFoot+1.5)/2;for(let de=0;de<It;de++){const ge=M[de],oe=ht[ge],f=oe.rFoot*$,x=f+1.5,ie=S+ca*(fe+x/2)/Z*2*Math.PI,ee=ut-30-f,xe=B(Math.min(te,ee),ee,Wt[ge].v);fe+=x,pt.push({...oe,rFoot:f,x:Se[0]+Math.sin(ie)*xe,z:Se[1]-Math.cos(ie)*xe})}}const T=Dt-90,q=fo-90;for(let F=0;F<Ho;F++){const S=m[6+F],M=ht[S],_=Wt[S],k=(T+(F+B(.3,.7,_.u))*(q-T)/Ho)*me;let C=ut+B(30+M.rFoot,120,_.v),$=Se[0]+Math.sin(k)*C,Z=Se[1]-Math.cos(k)*C;for(let te=0;te<40&&Q.nearestXZ($,Z).dist<30+M.rFoot;te++)C+=3,$=Se[0]+Math.sin(k)*C,Z=Se[1]-Math.cos(k)*C;e(S,$,Z)}for(let F=0;F<pt.length;F++)for(let S=F+1;S<pt.length;S++){const M=pt[F],_=pt[S],k=Math.hypot(M.x-_.x,M.z-_.z);if(k<M.rFoot+_.rFoot+3){const C=Math.max(.3,(k-3)/(M.rFoot+_.rFoot));M.rFoot*=C,_.rFoot*=C}}}const Ie=pt.map(e=>{const{x:o,z:v,top:m,rFoot:s}=e;let c=1e9;for(let u=0;u<8;u++)c=Math.min(c,H(o+Math.cos(u*.785)*s,v+Math.sin(u*.785)*s));return{x:o,z:v,top:m,foot:c-5,rFoot:s,rTop:s*e.rTopK,radius:s*.62,ph:e.ph,lobes:e.lobes,lean:e.lean,seed:e.seed,bounds:e.bounds,mult:e.mult,peak:e.peak}}),Ko=Ie.slice(2,2+It).reduce((e,o)=>o.top>e.top?o:e),Ot=(e,o,v,m)=>{const s=e.foot+(e.top-e.foot)*o,c=Math.cos(m),u=Math.sin(m),g=he.noise;return(e.rTop+(e.rFoot-e.rTop)*(1-o))*e.mult[v]*(1+na*(1-j(0,.16,o)))*(1+e.lobes*Math.cos(2*m+e.ph+o*1.6)+uo[0]*g.n3(c*1.3+e.seed,s*.045,u*1.3)+uo[1]*g.n3(c*3.1,s*.16+e.seed,u*3.1))},fa=(()=>{const o=[],v=[],m=[],s=[],c=he.noise;for(const g of Ie){const R=o.length/3,T=g.top-g.foot,q=[],F=[];for(let M=0;M<g.bounds.length-1;M++)for(const _ of[.02,.3,.62,.98])q.push(B(g.bounds[M],g.bounds[M+1],_)),F.push(M);const S=q.length;for(let M=0;M<S;M++){const _=q[M],k=g.foot+T*_;for(let C=0;C<13;C++){const $=(C+.37*F[M])/13*Math.PI*2,Z=Math.cos($),te=Math.sin($),fe=Ot(g,_,F[M],$);o.push(g.x+g.lean[0]*T*_+Z*fe,k+1.2*c.n2($*2+g.seed,_*9),g.z+g.lean[1]*T*_+te*fe),v.push(g.x,g.z,0),m.push(_,1)}}o.push(g.x+g.lean[0]*T+g.peak[0]*g.rTop,g.top+g.peak[1],g.z+g.lean[1]*T+g.peak[2]*g.rTop),v.push(g.x,g.z,0),m.push(1,1);for(let M=0;M<S-1;M++)for(let _=0;_<13;_++){const k=R+M*13+_,C=R+M*13+(_+1)%13;s.push(k,k+13,C,C,k+13,C+13)}for(let M=0;M<13;M++)s.push(R+(S-1)*13+M,R+S*13,R+(S-1)*13+(M+1)%13)}const u=new h.BufferGeometry;return u.setAttribute("position",new h.Float32BufferAttribute(o,3)),u.setAttribute("color",new h.Float32BufferAttribute(v,3)),u.setAttribute("aShade",new h.Float32BufferAttribute(m,2)),u.setIndex(s),u.computeVertexNormals(),u})(),da=new h.Mesh(fa,wo(ue,Ea));ae.add(da),await E.yield();const jo=(()=>{const o=[1,.86,1.08,.94,.8,1.05,.9,1.1,.84],v=[0,.44,0],m=[];for(const[u,g]of[[.9,.44],[1,.26],[1.03,-.55]])for(let R=0;R<9;R++){const T=R/9*Math.PI*2;v.push(Math.cos(T)*o[R]*u,g,Math.sin(T)*o[R]*u)}for(let u=0;u<9;u++)m.push(0,1+(u+1)%9,1+u);for(let u=0;u<2;u++)for(let g=0;g<9;g++){const R=1+u*9+g,T=1+u*9+(g+1)%9;m.push(R,T,R+9,T,T+9,R+9)}const s=new h.BufferGeometry;s.setAttribute("position",new h.Float32BufferAttribute(v,3)),s.setIndex(m);const c=s.toNonIndexed();return c.computeVertexNormals(),c})(),kt=J.floes,Go=Math.round(640*Fe),Et=[],ro=Q.startTangent.clone().setY(0).normalize();{const e=[],o=Math.round(Go*.26),v=new h.Vector3,m=new h.Vector3;for(let s=0;s<Go;s++)e.push({near:s<o,a:kt(),u:kt(),sz:3+12*Math.pow(kt(),s<o?2:1.3),yaw:kt.range(0,Math.PI*2),sq:kt.range(.8,1.25),ph:kt.range(0,6.28),amp:kt.range(.05,.16)});for(const s of e){let c,u;const g=s.sz*1.15;if(s.near){const S=-120+370*s.a,M=(s.u*2-1)*170;Q.posAtDist(S,v),Q.tangentAtDist(S,m);const _=Math.hypot(m.x,m.z)||1;c=v.x-m.z/_*M,u=v.z+m.x/_*M}else{const S=(125+200*s.a)*me,M=525+1300*Math.pow(s.u,1.4);c=Math.sin(S)*M,u=-Math.cos(S)*M}if(H(c,u)>-2.5||H(c+g,u)>-1.5||H(c-g,u)>-1.5||H(c,u+g)>-1.5||H(c,u-g)>-1.5||Q.nearestXZ(c,u).dist<g+9.5)continue;const R=c-Q.start.x,T=u-Q.start.z,q=R*ro.x+T*ro.z;if(q<0&&q>-345&&Math.abs(R*ro.z-T*ro.x)<g+16)continue;let F=!0;for(const S of Et)if((S.x-c)**2+(S.z-u)**2<(S.sz+s.sz)*(S.sz+s.sz)*1.2){F=!1;break}F&&Et.push({x:c,z:u,...s})}}const ua=new h.ShaderMaterial({uniforms:{...ue},vertexShader:`
        attribute vec2 aPh; uniform float uTime; varying vec3 vP, vN; varying float vY;
        void main() {
          vec3 p = position; vY = p.y;
          p.y += (p.x * sin(uTime * 0.55 + aPh.x) + p.z * sin(uTime * 0.43 + aPh.x * 1.7)) * aPh.y + 0.08 * sin(uTime * 0.6 + aPh.x * 2.3);
          vec4 wp = modelMatrix * instanceMatrix * vec4(p, 1.0);
          vP = wp.xyz; vN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal + vec3(0.0, 1e-6, 0.0));
          gl_Position = projectionMatrix * viewMatrix * wp;
        }`,fragmentShader:`
        ${et.GLSL_NOISE}
        ${nt}
        varying vec3 vP, vN; varying float vY;
        void main() {
          vec3 N = normalize(vN + vec3(0.0, 1e-6, 0.0)); float top = smoothstep(0.35, 0.75, N.y), n = vnoise(vP.xz * 0.5), n2 = vnoise(vP.xz * 2.1);
          vec3 snow = vec3(0.86, 0.9, 0.95) * (0.82 + 0.14 * n + 0.08 * n2);
          vec3 ice = mix(vec3(0.10, 0.32, 0.50), vec3(0.46, 0.72, 0.88), smoothstep(-0.5, 0.3, vY));
          vec3 col = mix(ice, snow, top) * (placeLight(vP, N, 1.0, sunSeen(vP)) + dawnRose(vP, N) * 0.7);
          gl_FragColor = vec4(placeFog(col, vP), 1.0);
        }`}),Ut=new h.InstancedMesh(jo,ua,Math.max(1,Et.length));{const e=new h.Matrix4,o=new h.Quaternion,v=new h.Vector3(0,1,0),m=new Float32Array(Math.max(1,Et.length)*2);Et.forEach((s,c)=>{e.compose(new h.Vector3(s.x,co,s.z),o.setFromAxisAngle(v,s.yaw),new h.Vector3(s.sz*s.sq,1,s.sz/s.sq)),Ut.setMatrixAt(c,e),m[c*2]=s.ph,m[c*2+1]=s.amp}),jo.setAttribute("aPh",new h.InstancedBufferAttribute(m,2)),Ut.count=Et.length,Ut.instanceMatrix.needsUpdate=!0,Ut.frustumCulled=!1}ae.add(Ut),await E.yield();const ct=J.trees,We=[],Io=[],zt=[];zt.push(vt.cherryGeometry({rng:ct,height:6.4,detail:1,leaf:"#f4b6cc",leafLight:"#ffe8f0"})),await E.yield(),zt.push(vt.cherryGeometry({rng:ct,height:5.6,detail:1,leaf:"#fbdde8",leafLight:"#fff6f8",leafDark:"#c890a4"})),await E.yield(),zt.push(vt.cherryGeometry({rng:ct,height:7,detail:1,leaf:"#ee9fbd",leafLight:"#ffdbe8"})),await E.yield();const Wo=[vt.cherryGeometry({rng:ct,height:6,detail:0,leaf:"#f6c2d4",leafLight:"#fff0f5"})];await E.yield();{const e=Math.max(zt[0].userData.radius,zt[1].userData.radius,zt[2].userData.radius,Wo[0].userData.radius),o=[],v=[],m=J.clumps;let s=0;const c=(f,x,ie,ee=!1)=>{const xe=ee?8:2+Math.min(3,Math.floor(m()*4)),le=ee?1.5:m.range(.9,1.35),Me=s++;for(let we=0;we<(ee?8:5);we++){const Le=m.range(.6,.95);o.push({cl:Me,s:f,side:x,q:ie,gr:ee?we===0?0*m():4.9+1.1*Math.sqrt(m()):.8+2.9*Math.sqrt(m()),ga:m.range(0,6.283),sc:le*(we===0?1:Le),rot:m.range(0,6.283),v:m.int(0,2),on:we<xe,great:ee})}return Me},u=At.map((f,x)=>({g:f,i:x})).sort((f,x)=>f.g.rank-x.g.rank).slice(0,6).sort((f,x)=>f.i-x.i);for(const{g:f}of u)c(f.s+Math.tan(f.ang*me)*f.side*Co+f.cv*Co+3.5,f.side,m.range(14.5,17.5));for(let f=0;f<4;f++)c(838+27*(f+m.range(.15,.85)),m()<.5?-1:1,m.range(14.5,18.5));const g=[-1,1].map(f=>[c(po+m.range(3,9),f,m.range(16.5,18.5),!0),c(po+m.range(11,17),f,m.range(16.5,18.5),!0)]),R={};o.sort((f,x)=>(x.great?1:0)-(f.great?1:0));for(let f=0;f<12;f++)for(let x=0;x<6;x++)v.push({i:f,b:ct(),a:ct.range(0,6.283),sc:ct.range(.55,.85),rot:ct.range(0,6.283)});const T=Math.round(48*Fe);let q=0;for(const f of o){if(We.length>=T)break;if(++q%20===0&&await E.yield(),!f.on||f.great&&(R[f.cl]||0)>=5)continue;const x=Re(f.s),ie=Math.hypot(x.t.x,x.t.z)||1,ee=-x.t.z/ie,xe=x.t.x/ie,le=f.side*f.q,Me=x.p.x+ee*le+Math.cos(f.ga)*f.gr,we=x.p.z+xe*le+Math.sin(f.ga)*f.gr,Le=he.way(Me,we),De=Le.ok,Je=Math.abs(Le.d),Ee=f.sc;if(!De||Je<e*Ee+3.4)continue;const _e=H(Me,we),a=Math.min(H(Me+ee*1.6,we+xe*1.6),H(Me-ee*1.6,we-xe*1.6));if(_e-a>3.4||_e>x.p.y+24)continue;let z=!0;for(const b of We)if(Math.hypot(b.x-Me,b.z-we)<2.6+1.6*Ee){z=!1;break}z&&(We.push({x:Me,y:Math.min(_e,a+1.2)-.25,z:we,s:Ee,rot:f.rot,d:0,u:f.s/Q.length,v:f.v,cl:f.cl}),f.great&&(R[f.cl]=(R[f.cl]||0)+1))}for(const f of g){const x=(R[f[0]]||0)>=2?f[1]:f[0];for(let ie=We.length-1;ie>=0;ie--)We[ie].cl===x&&We.splice(ie,1)}{const f={};for(const x of We)f[x.cl]=(f[x.cl]||0)+1;for(let x=We.length-1;x>=0;x--)f[We[x].cl]<2&&We.splice(x,1)}await E.yield();const F=[],S=Ie.map(()=>0);for(let f=880;f<=Q.length;f+=4)F.push(Q.posAtDist(f));for(const f of v){if(f.i>=Ie.length)continue;const x=Ie[f.i],ie=x.bounds.length-1;if(S[f.i]>=3||ie<2)continue;const ee=Math.min(ie-2,Math.floor(f.b*(ie-1))),xe=x.top-x.foot,le=B(x.bounds[ee],x.bounds[ee+1],.98),Me=B(x.bounds[ee+1],x.bounds[ee+2],.02),we=Ot(x,le,ee,f.a)*.965,Le=Ot(x,Me,ee+1,f.a),De=x.foot+xe*(le+Me)*.5;if(we-Le<1.5||De<Ke+8)continue;const Je=Le+(we-Le)*.55,Ee=x.x+x.lean[0]*xe*le+Math.cos(f.a)*Je,_e=x.z+x.lean[1]*xe*le+Math.sin(f.a)*Je;let a=1e9;for(const z of F)a=Math.min(a,Math.hypot(z.x-Ee,z.y-De-3,z.z-_e));a<e*f.sc+6||(S[f.i]++,We.push({x:Ee,y:De-1.1,z:_e,s:f.sc,rot:f.rot,d:999,u:.8,v:0}),Io.push({x:Ee,y:De+3.2*f.sc,z:_e}))}await E.yield();const M=We.filter(f=>f.d===0),_=new h.PlaneGeometry(1,1),k=new h.ShaderMaterial({transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,vertexShader:`
          varying vec2 vUv; varying vec3 vP;
          void main() { vUv = uv; vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.0); vP = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:`
          varying vec2 vUv; varying vec3 vP;
          void main() {
            float r = length(vUv - 0.5) * 2.0, a = (1.0 - smoothstep(0.15, 1.0, r)) * 0.86;
            gl_FragColor = vec4(0.035, 0.03, 0.085, a);
          }`}),C=new h.InstancedMesh(_,k,Math.max(1,M.length)),$=new h.Matrix4,Z=new h.Quaternion,te=new h.Vector3,fe=new h.Vector3(0,0,1),de=new h.Vector3,ge=new h.Vector3,oe=[];for(let f=815;f<=965;f+=3)oe.push(Q.posAtDist(f));for(let f=0;f<M.length;f++){const x=M[f];f%12===11&&await E.yield();const ie=H(x.x,x.z)+.14;let ee=1e9;for(const De of oe)ee=Math.min(ee,Math.hypot(De.x-x.x,De.y-ie,De.z-x.z));const xe=Math.max(.01,Math.min(e*x.s*1.45,ee-3.2)),le=Math.max(1.5,.8*xe);let Me=(H(x.x+le,x.z)-H(x.x-le,x.z))/(2*le),we=(H(x.x,x.z+le)-H(x.x,x.z-le))/(2*le);const Le=Math.hypot(Me,we);Le>.6&&(Me*=.6/Le,we*=.6/Le),te.set(-Me,1,-we).normalize(),C.setMatrixAt(f,$.compose(de.set(x.x,ie,x.z),Z.setFromUnitVectors(fe,te),ge.set(2*xe,2*xe,1)))}C.count=M.length,C.instanceMatrix.needsUpdate=!0,C.frustumCulled=!1,C.renderOrder=1,ae.add(C)}await E.yield(),await vt.prepareLeafTexture({},E.yield);const pa=vt.makeWind({direction:[-.73,-.68],strength:1.15}),ma=vt.windMaterial({wind:pa,backlight:1,backlightTint:"#ffd6e4"}),Oo=vt.makeScatter({rng:ct,points:We,variants:zt,farVariants:Wo,farDistance:60,material:ma,tint:.08,hue:.02,tilt:.1});ae.add(Oo.object),await E.yield();const ko=ho.makeFauna(ae,{light:ho.lightFrom(ae)});{const e=J.birdsEast,o=58,v=[];for(let T=0;T<8;T++)v.push({b:e.range(0,360)*me,r:ut+o+e.range(100,200)});for(const T of v)T.x=Se[0]+Math.sin(T.b)*T.r,T.z=Se[1]-Math.cos(T.b)*T.r,T.ok=(T.x-ne[0])*bt+(T.z-ne[1])*yt<-o&&(T.x-ke[0])*Kt+(T.z-ke[1])*jt<-o&&Math.hypot(T.x,T.z)>la+o;const m=v.find(T=>T.ok),s=Q.posAtDist(360),c=Q.tangentAtDist(360),u=Math.hypot(c.x,c.z)||1,g=s.x+c.z/u*190,R=s.z-c.x/u*190;ko.add(ho.makeFlock({rng:J.birds,species:"gulls",count:16,size:2.2,center:[g,H(g,R)+48,R],radius:50,spread:[12,5,12],wander:[3,1.5,3,.35],maxSigma:3})),m&&ko.add(ho.makeFlock({rng:e,species:"gulls",count:9,size:2.2,center:[m.x,Ke+50,m.z],radius:46,spread:[12,5,12],wander:[3,1.5,3,.35],maxSigma:3}))}if(await E.yield(),ka){const e=J.monastery,o=[],v=[],m=[],s=Math.PI*2,c={nPil:e()<.5?8:9,mainN:6+Math.floor(e()*4),mainTiers:e()<.5?4:5,nBr:3+Math.floor(e()*3),pick:[],pil:[],tw:[]};for(let t=0;t<6;t++)c.pick.push(e());for(let t=0;t<12;t++)c.pil.push({n:2+Math.floor(e()*3),a:e(),stairA:e(),stairDir:e()<.5?-1:1});for(let t=0;t<48;t++)c.tw.push({d:e(),h:e(),e:e(),tiers:e(),turn:e(),hsh:e(),drop:[0,1,2,3,4,5,6,7,8,9,10,11].map(()=>e())});const u=[];for(let t=800;t<=Q.length;t+=2)u.push(Q.posAtDist(t));const g=(t,n,r)=>{let p=1e9;for(const i of u)p=Math.min(p,Math.hypot(i.x-t,i.y-n,i.z-r));return p},R=(t,n)=>{let r=1e9;for(const p of u)r=Math.min(r,Math.hypot(p.x-t,p.z-n));return r},T=(t,n,r,p,i)=>{for(const l of[t,n,r])o.push(l[0],l[1],l[2]),v.push(p,l[3],l[4]),m.push(i,l[5])},q=(t,n,r,p,i,l)=>{T(t,n,r,i,l),T(t,r,p,i,l)},F=(t,n)=>[t.x+t.lean[0]*(n-t.foot),t.z+t.lean[1]*(n-t.foot)],S=(t,n,r,p)=>{const i=s/13,l=p/i-.37*r,d=Math.floor(l),L=l-d,A=(d+.37*r)*i,w=Ot(t,n,r,A),I=Ot(t,n,r,A+i);return w*I*Math.sin(i)/(w*Math.sin(L*i)+I*Math.sin((1-L)*i))},M=[.02,.3,.62,.98],_=(t,n,r)=>{const p=at((n-t.foot)/(t.top-t.foot),.001,.995);let i=0,l=0;for(;i<t.bounds.length-2&&p>=t.bounds[i+1];)i++;const d=(p-t.bounds[i])/(t.bounds[i+1]-t.bounds[i]);for(;l<2&&d>M[l+1];)l++;const L=at((d-M[l])/(M[l+1]-M[l]),0,1);return B(S(t,B(t.bounds[i],t.bounds[i+1],M[l]),i,r),S(t,B(t.bounds[i],t.bounds[i+1],M[l+1]),i,r),L)},k=(t,n)=>{const r=F(t,n[1]),p=n[0]-r[0],i=n[2]-r[1],l=Math.hypot(p,i)||1e-6,d=.9*_(t,n[1],Math.atan2(i,p))-.3;return l>d&&(n[0]=r[0]+p*d/l,n[2]=r[1]+i*d/l),n},C=(t,n,r,p,i,l,d,L)=>{const A=[];for(let w=0;w<L;w++){const I=d+w/L*s;A.push([t+Math.cos(I)*p,r,n+Math.sin(I)*p,i,l])}return A},$=(t,n,r,p)=>{const i=t.length;for(let l=0;l<i;l++){const d=(l+1)%i,L=r===1?-1:l,A=r===1?1:l+1;q([t[l][0],t[l][1],t[l][2],L,t[l][3],t[l][4]],[t[d][0],t[d][1],t[d][2],A,t[d][3],t[d][4]],[n[d][0],n[d][1],n[d][2],A,n[d][3],n[d][4]],[n[l][0],n[l][1],n[l][2],L,n[l][3],n[l][4]],r,p)}},Z=(t,n,r,p)=>{const i=t.length;for(let l=0;l<i;l++){const d=(l+1)%i;T([t[l][0],t[l][1],t[l][2],-1,t[l][3],t[l][4]],[t[d][0],t[d][1],t[d][2],1,t[d][3],t[d][4]],[n[0],n[1],n[2],0,n[3],n[4]],r,p)}},te=(t,n,r)=>{const p=t/2*.96+.4,i=[];let l=0;for(let d=0;d<r;d++)i.push((p+n)*Math.pow(.85,d)),l+=(d<r-1?1.1:1.7)*i[d];return{Rg:p,Rs:i,hR:l}},fe=(t,n,r,p,i,l,d,L,A,w,I,P)=>{const K=i/2,{Rg:y,Rs:D,hR:W}=te(i,d,L),re=Math.max(l-W,4.5),X=re-1.4,ye=Math.max(1,Math.round(X/3.4)),qe=3.4*ye/X,Oe=C(n,r,p,K*1.3,-1,.55,A,P);for(let ot=0;ot<P;ot++)Oe[ot][1]=p-(3+5*I[ot]),k(t,Oe[ot]);const ft=C(n,r,p,K*1.08,0,.8,A,P),Te=C(n,r,p+.4*X,K,.4*X*qe,1,A,P),dt=C(n,r,p+X,K*.96,3.4*ye,.85,A,P),Vt=C(n,r,p+X+.5,y,.5,.8,A,P),$t=C(n,r,p+re,y,1.4,.6,A,P);$(Oe,ft,0,w+2),$(ft,Te,0,w),$(Te,dt,0,w),$(dt,Vt,0,w+2),$(Vt,$t,0,w+2);let mt=p+re-.2;for(let ot=0;ot<L;ot++){const He=D[ot],Po=ot===L-1,Yt=(Po?1:.75)*He,So=(Po?.2:.36)*He,Yo=.2*He,Xo=Yo+Math.hypot(.3*He,.36*Yt),Jo=Xo+Math.hypot(.54*He-So,.64*Yt),wa=C(n,r,mt+.12*He,He,0,1,A,P),Zo=C(n,r,mt,.84*He,Yo,.9,A,P),Qo=C(n,r,mt+.36*Yt,.54*He,Xo,1,A,P),ea=C(n,r,mt+Yt,So,Jo,1,A,P);if($(wa,Zo,1,w),$(Zo,Qo,1,w),$(Qo,ea,1,w),Po){const Ao=mt+1.7*He;Z(ea,[n,Ao,r,Jo+Math.hypot(So,.7*He),1],1,w),Z(C(n,r,Ao-.5,.14+.02*i,0,1,A,4),[n,Ao+.5*i+1,r,0,1],2,w)}else $(C(n,r,mt+.7*Yt,.36*He,.2,.7,A,P),C(n,r,mt+1.1*He+.3,.36*He,1.3,.6,A,P),0,w+2),mt+=1.1*He}},de=Ie.indexOf(Ko),ge=[de,0,1],oe=[];for(let t=2+It;t<Ie.length;t++)ge.push(t);for(let t=2;t<2+It;t++)t!==de&&oe.push(t);for(let t=0;ge.length<c.nPil&&oe.length;t++)ge.push(oe.splice(Math.floor(c.pick[t]*oe.length),1)[0]);const f=Math.min(c.mainN,31-3*(ge.length-1));let x=31-f-3*(ge.length-1);const ie=t=>{const n=t.top-t.foot,r=[];for(let p=t.bounds.length-3;p>=0;p--){const i=B(t.bounds[p],t.bounds[p+1],.98),l=B(t.bounds[p+1],t.bounds[p+2],.02),d=t.foot+n*(i+l)*.5;d>=Ke+8&&r.push({b:p,y:d,yLo:t.foot+n*i,yHi:t.foot+n*l})}return r},ee=[],xe=[],le=We.filter(t=>t.d===999);let Me=0;const we=(t,n,r,p,i,l,d,L)=>{const A=te(i,d,L).Rs[0];for(const w of[0,.35,.7,1])if(g(n,p+w*l,r)-A-.5<20)return!1;for(const w of ee)if(w.pi===t&&Math.abs(w.yB-p)<16&&Math.hypot(w.x-n,w.z-r)<w.Re+A+.3)return!1;for(const w of le)if(Math.hypot(w.x-n,w.z-r)<i/2+2.6&&w.y>p-5&&w.y<p+l)return!1;return!0};for(let t=0;t<ge.length;t++){const n=ge[t],r=Ie[n],p=r.top-r.foot,i=t===0,l=c.pil[t],d=i?0:Math.min(l.n-2,x),L=i?f:2+d;x-=d;{const P=c.tw[Me++],K=i?B(5.2,6,P.d):B(4,5,P.d),y=i?B(34,46,P.h):B(19,26,P.h),D=B(1.6,2.4,P.e),W=i?c.mainTiers:3,re=r.x+r.lean[0]*p+r.peak[0]*r.rTop,X=r.z+r.lean[1]*p+r.peak[2]*r.rTop,ye=r.top-1;fe(r,re,X,ye,K,y,D,W,P.turn*s,P.hsh,P.drop,i?12:8),ee.push({pi:n,x:re,z:X,yB:ye,Re:te(K,D,W).Rs[0],tall:y})}const A=[],w=r.foot+.965*p;for(let P=0;P<8;P++){const K=(l.a+P/8)*s;A.push({a:K,y:w-.5,rim:!0,w:_(r,w,K)})}A.sort((P,K)=>K.w-P.w);for(const P of ie(r)){const K=[];for(let y=0;y<8;y++){const D=(l.a+(y+.5)/8)*s,W=_(r,P.yHi+.5,D);K.push({a:D,y:P.y,b:P.b,rUp:W,w:_(r,P.yLo-.5,D)-W})}K.sort((y,D)=>D.w-y.w);for(const y of K)A.push(y)}let I=0;for(const P of A){if(I>=L||ee.length>=32||Me>=c.tw.length)break;const K=c.tw[Me],y=B(3.5,4.8,K.d),D=K.tiers<.5?2:3,W=B(1.6,2.4,K.e),re=Math.max(P.rim?B(16,26,K.h):B(12,20,K.h),te(y,W,D).hR+4.5),X=P.rim?Math.max(.5,.85*P.w-.5*y):P.rUp+.15*y,ye=F(r,P.y),qe=ye[0]+Math.cos(P.a)*X,Oe=ye[1]+Math.sin(P.a)*X;we(n,qe,Oe,P.y,y,re,W,D)&&(Me++,I++,fe(r,qe,Oe,P.y,y,re,W,D,K.turn*s,K.hsh,K.drop,8),ee.push({pi:n,x:qe,z:Oe,yB:P.y,Re:te(y,W,D).Rs[0],tall:re}),P.rim||xe.push({P:r,b:P.b,a:P.a,y:P.y,hsh:K.hsh}))}}for(const t of xe){const n=t.P,r=n.top-n.foot,p=B(n.bounds[t.b],n.bounds[t.b+1],.98),i=B(n.bounds[t.b+1],n.bounds[t.b+2],.02),l=t.y+.3,d=9;let L=null;for(let A=0;A<=d;A++){const w=t.a+B(-.87,.87,A/d),I=F(n,l),P=Math.cos(w),K=Math.sin(w),y=_(n,n.foot+r*i+.5,w),D=Math.max(_(n,n.foot+r*p-.5,w)+.5,y+2.4),W=I[0]+P*D,re=I[1]+K*D,X={i:[I[0]+P*.8*y,l,I[1]+K*.8*y],o:[W,l,re],lo:k(n,[W,l-5,re]),ok:g(W,l,re)>=20.6};L&&L.ok&&X.ok&&(q([...L.i,0,-3,.85],[...X.i,0,-3,.85],[...X.o,0,-3,1],[...L.o,0,-3,1],0,t.hsh+2),q([...L.o,A-1,0,.9],[...X.o,A,0,.9],[X.o[0],l+1,X.o[2],A,1,1],[L.o[0],l+1,L.o[2],A-1,1,1],0,t.hsh+2),q([...L.lo,A-1,-5,.55],[...X.lo,A,-5,.55],[...X.o,A,0,.9],[...L.o,A-1,0,.9],0,t.hsh+2)),L=X}}let Le=0;for(let t=0;t<ge.length;t++){const n=Ie[ge[t]],r=n.top-n.foot,p=c.pil[t],i=Math.max(Ke+4,n.foot+.12*r),l=n.foot+.94*r;let d=p.stairA*s,L=null,A=0;for(let w=i;w<=l;w+=1.2){const I=_(n,w,d),P=F(n,w),K=Math.cos(d),y=Math.sin(d),D=P[0]+K*(I+1.2),W=P[1]+y*(I+1.2),re={i:[P[0]+K*.8*I,w,P[1]+y*.8*I],o:[D,w,W],lo:k(n,[D,w-2.6,W]),ok:g(D,w,W)>=20.6,s:A};L&&L.ok&&re.ok&&(q([...L.i,0,L.s,.8],[...re.i,0,re.s,.8],[...re.o,1,re.s,1],[...L.o,1,L.s,1],0,2.37),q([...L.lo,0,-2.6,.55],[...re.lo,1,-2.6,.55],[...re.o,1,0,.9],[...L.o,0,0,.9],0,2.37),Le++),L=re,d+=p.stairDir*1.2/(.6*Math.max(I,2)),A+=2.3}}const De=[],Je=Ie.map(()=>0),Ee={};for(const t of ge)for(let n=0;n<Ie.length;n++){if(n===t)continue;const r=Ie[t],p=Ie[n];for(const i of ie(r)){const l=i.y;if(l>p.top-10||l<p.foot+6)continue;const d=F(r,l),L=F(p,l),A=Math.hypot(L[0]-d[0],L[1]-d[1]),w=(L[0]-d[0])/A,I=(L[1]-d[1])/A,P=Math.atan2(I,w),K=_(r,l,P),y=_(p,l,P+Math.PI),D=A-K-y;if(D<3||D>30)continue;let W=!0;for(let re=0;re<=6&&W;re++){const X=K+D*re/6;(R(d[0]+w*X,d[1]+I*X)<21.5||g(d[0]+w*X,l,d[1]+I*X)<21.5)&&(W=!1)}W&&De.push({pi:t,qi:n,y:l,gap:D,ca:d,ux:w,uz:I,ra:.8*K,len:A-.8*K-.8*y})}}De.sort((t,n)=>t.gap-n.gap);let _e=0;for(const t of De){const n=Math.min(t.pi,t.qi)+":"+Math.max(t.pi,t.qi);if(_e>=c.nBr||Ee[n]||Je[t.pi]>=2||Je[t.qi]>=2)continue;Ee[n]=!0,Je[t.pi]++,Je[t.qi]++,_e++;const r=12,p=-t.uz,i=t.ux,l=2.41+.1*_e;let d=null;for(let L=0;L<=r;L++){const A=L/r,w=t.ca[0]+t.ux*(t.ra+t.len*A),I=t.ca[1]+t.uz*(t.ra+t.len*A),P=t.y+.4+.05*t.len*4*A*(1-A),K=P-.7-(.2*t.len+1.2)*(2*A-1)*(2*A-1),y={l:[w+p,I+i],r:[w-p,I-i],top:P,bot:K,s:t.len*A/2.2};if(d){q([d.l[0],d.top,d.l[1],0,-3,1],[y.l[0],y.top,y.l[1],0,-3,1],[y.r[0],y.top,y.r[1],1,-3,1],[d.r[0],d.top,d.r[1],1,-3,1],0,l),q([d.l[0],d.bot,d.l[1],0,-3,.5],[y.l[0],y.bot,y.l[1],0,-3,.5],[y.r[0],y.bot,y.r[1],1,-3,.5],[d.r[0],d.bot,d.r[1],1,-3,.5],0,l);for(const D of["l","r"])q([d[D][0],d.bot,d[D][1],d.s,d.bot-d.top,.7],[y[D][0],y.bot,y[D][1],y.s,y.bot-y.top,.7],[y[D][0],y.top+.9,y[D][1],y.s,.9,1],[d[D][0],d.top+.9,d[D][1],d.s,.9,1],0,l)}d=y}}const a=new h.BufferGeometry;a.setAttribute("position",new h.Float32BufferAttribute(o,3)),a.setAttribute("color",new h.Float32BufferAttribute(v,3)),a.setAttribute("aShade",new h.Float32BufferAttribute(m,2)),a.computeVertexNormals();const z=wo(ue,Ra);z.side=h.DoubleSide;const b=new h.Mesh(a,z);b.name="sky-monastery",b.userData.counts={towers:ee.length,pillars:ge.length,terraces:xe.length,stairTreads:Le,bridges:_e,triangles:o.length/9},ae.add(b)}await E.yield();const va=Ie.map(e=>({x:e.x,z:e.z,top:e.top,radius:e.radius,foot:e.foot+4,rFoot:e.rFoot,rTop:e.rTop})),ga={line:Re,length:Q.length,floorAt:H,groundAt:H,seaY:co,lakeY:st,pillars:va,time:Ze,sunDir:Xt.clone(),sunColor:je("#ffcf9a"),shadeColor:je("#3a3f7a"),skyGlow:je("#ff9f78"),sunBand:{y0:aa,y1:sa},fog:{color:ue.uFogCol.value.clone(),density:ue.uFogDen.value},detail:qt,sunTopAt:Eo,sunTop:{texture:Qe.shadeMap,box:Qe.shadeBox.clone()},lake:{x:0,z:0,r:$e},ledges:Io,light:ue};let tt=null,Uo=!1;try{tt=await Fo.buildHero(E,ga),tt&&tt.object&&ae.add(tt.object)}catch(e){console.error("mountain part, buildHero: "+(e&&e.message)),tt=null}await E.yield();const Vo=232,Rt=Q.length,lo=Ko,$o=(e=>{const o=Q.curve.getLengths(),v=e/(Q.points.length-1)*(o.length-1),m=Math.min(o.length-2,Math.floor(v));return B(o[m],o[m+1],v-m)})(ia.length+No),zo=Q.posAtDist(gt[0]);let io=560;for(const e={r:0,c:0,hi:0,es:0};io<760;io++){const o=Q.posAtDist(io),v=Math.hypot(o.x,o.z);if(he.rimOf(o.x/v,o.z/v,e),v<e.r)break}return await Ve.prewarm(E.renderer,null,ae),{scene:ae,path:Q,duration:50,camera:{fov:62,near:.3,far:4200,lookAhead:26,sway:.4,bank:.15},pois:[{at:[lo.x,.5*(lo.foot+lo.top),lo.z],from:60/Rt,to:Vo/Rt,weight:.3},{at:[be[0],st+ra,be[1]],from:Vo/Rt,to:io/Rt,weight:1,fade:.5},{at:[zo.x,zo.y,zo.z],from:$o/Rt,to:1,weight:.55}],portal:{shape:"circle",radius:7,color:"#fff0cc",glow:.6,revealDistance:300,drawWithin:Rt-$o,veil:Jt.horizon},post:{exposure:1.08,bloom:{strength:.5,radius:.7,threshold:.9},grade:{saturation:1.08,contrast:1.05,tint:"#ffffff",shadowTint:"#0a0c24",vignette:.3,grain:.03,aberration:0}},update(e,o,v,m){if(Ze.value=o,Oo.update(e,o,v),ko.update(e,o,v,m),Ve.update(e,o,v),U.update(e,o,v),se.update(e,o,v),Mo.update(e,o,v),qo.update(e,o,v),tt&&!Uo)try{tt.update(e,o,v)}catch(s){Uo=!0,console.error("mountain part, update: "+(s&&s.message))}},dispose(){tt&&tt.dispose&&tt.dispose(),Ve.dispose&&Ve.dispose(),Qe.strata&&Qe.strata.texture&&Qe.strata.texture.dispose(),Ct.dispose()}}}};export{qa as default};
