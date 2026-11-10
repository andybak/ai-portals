import*as k from"three";import{mergeGeometries as bt}from"three/addons/utils/BufferGeometryUtils.js";import{makeNoise as Kt,clamp as lt,lerp as $,smoothstep as K}from"../kit/core.js";const Ft=["#E7C9B0","#F3E9CC","#C9812A","#7A4A1C","#3F8F4E","#1F4FA0","#FBF6E6"],It=new k.Vector3(.92,.24,.3).normalize();function Ht(d=Ft){const s=n=>new k.Color(d[n]||Ft[n]);return{uTime:{value:0},uU:{value:0},uPour:{value:0},uSun:{value:It.clone()},uSunCol:{value:new k.Color(1,.93,.8)},uSkyCol:{value:new k.Color(.8,.76,.7)},uFloorCol:{value:new k.Color(.84,.7,.64)},uDustCol:{value:s(1).clone().lerp(s(0),.3)},uDustK:{value:12e-5},uDustL:{value:.0011},uClay:{value:s(0)},uStraw:{value:s(1)},uAmber:{value:s(2)},uPool:{value:s(3)},uGreen:{value:s(4)},uCobalt:{value:s(5)},uSlip:{value:s(6)},uGain:{value:.6},uShadeTint:{value:new k.Color(.417,.339,.433)},uSunK:{value:new k.Color(1.11,1.226,1.3)},uHazeSun:{value:s(6).clone().lerp(s(1),.4)},uHazeRose:{value:new k.Color("#E9CEBD")},uHazeD:{value:1090},uSkyZen:{value:new k.Color("#D9B3A2")},uVent:{value:new k.Vector4(0,0,0,0)},uVentR:{value:120}}}const Vt=(()=>{const d=s=>new k.Matrix3().fromArray(s).invert().elements.map(n=>n.toFixed(6)).join(",");return{inI:d([.59719,.076,.0284,.35458,.90834,.13383,.04823,.01566,.83777]),outI:d([1.60475,-.10208,-.00327,-.53108,1.10813,-.07276,-.07367,-.00605,1.07602])}})(),Nt=`
uniform float uU, uPour, uDustK, uDustL, uGain;
uniform vec3 uSun, uSunCol, uSkyCol, uFloorCol, uDustCol, uClay, uStraw, uAmber, uPool, uGreen, uCobalt, uSlip, uShadeTint, uSunK, uHazeSun, uHazeRose, uSkyZen;
uniform float uHazeD, uVentR; uniform vec4 uVent;
float gzSpec = 0.; vec3 gzVd = vec3(0., 0., 1.);   // gzVd: eye to point (each main sets it; the haze is straw toward the sun, rose away)
float gzH1(float n){ return fract(sin(n*127.1+3.7)*43758.5453); }
float gzH2(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float gzN1(float x){ float i=floor(x), f=fract(x); f=f*f*(3.-2.*f); return mix(gzH1(i), gzH1(i+1.), f); }
float gzN2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(gzH2(i),gzH2(i+vec2(1,0)),f.x), mix(gzH2(i+vec2(0,1)),gzH2(i+vec2(1,1)),f.x), f.y); }
// a streak field about c metres wide, dl metres long, running downhill (the figure shader sets the globals)
float gzLane = 0., gzDown = 0., gzE0 = 1., gzE1 = 2., gzLf = 0., gzFb = 0., gzWx = 0.; vec3 gzO = vec3(0.);
float gzS(float c, float sd, float dl){
  float a = .5, b = .5, y = -gzO.y/dl;
  if (gzFb < .999) a = mix(gzN2(vec2(gzLane*gzE0/c + sd, gzDown/dl)), gzN2(vec2(gzLane*gzE1/c + sd + 7.3, gzDown/dl + 3.1)), gzLf);
  if (gzFb > .001) b = mix(gzN2(vec2(gzO.x/(c*1.4) + sd, y)), gzN2(vec2(gzO.z/(c*1.4) + sd + 5.1, y + 1.7)), gzWx);
  return mix(a, b, gzFb);
}
// display-linear colour -> scene value (uGain = 0.6 / the world's exposure)
vec3 gzToScene(vec3 D){
  vec3 y = clamp(mat3(${Vt.outI})*clamp(D, 0., .95), .0004, .97);
  vec3 A = .983729*y - 1., B = .432951*y - .0245786, Cc = .238081*y + .000090537;
  vec3 v = (-B - sqrt(max(B*B - 4.*A*Cc, 0.)))/(2.*A);
  return max(mat3(${Vt.inI})*v, 0.)*uGain;
}
// the one low side light and its bounce, as a tint. A level face takes the sun at a graze (the sine of its height), an
// upright face turned to it takes it whole: the same clay is a mid-tone floor, a bright leg and a rose shade side.
vec3 gzLight(vec3 N, float ao){
  float nl = clamp(dot(N, uSun), 0., 1.);
  float under = 1. - smoothstep(-.8, 0., N.y);
  vec3 amb = mix(uFloorCol*(1. + .2*under), uSkyCol, smoothstep(.05, .9, N.y))*(.7 + .3*ao);
  return amb + max(uSunK - amb, 0.)*nl*(.55 + .45*ao);
}
// the dust at the end of the floor, by bearing: sun-lit straw toward the sun, rose away from it
vec3 gzHaze(vec3 d){
  vec2 h = d.xz; float l = length(h); vec2 sx = normalize(uSun.xz + vec2(1e-5, 0.));
  float s = l > 1e-4 ? .5 + .5*dot(h/l, sx) : .5;
  return mix(uHazeRose, uHazeSun, smoothstep(.2, .95, s));
}
// dead-matt fired clay
vec3 gzMatt(vec3 alb, vec3 N, float ao){ return alb*gzLight(N, ao); }
// lead glass over slip: body colour, a blurred sky-above / floor-below reflection, one long soft sun highlight
vec3 gzGlass(vec3 alb, vec3 N, vec3 V, float ao){
  float nv = clamp(dot(N, V), 0., 1.), q1 = 1. - nv;
  float fr = .1 + .9*q1*q1*q1*q1*q1;
  vec3 R = reflect(-V, N);
  vec3 flo = uClay*gzLight(vec3(0., 1., 0.), 1.)*1.08;
  vec3 env = mix(flo, mix(uHazeSun, uSkyZen, smoothstep(.15, .9, R.y)), smoothstep(-.3, .3, R.y));
  float rl = max(dot(R, uSun), 0.);
  gzSpec = (pow(rl, 18.)*.17 + pow(rl, 80.)*1.15)*(.3 + .7*ao);   // one long soft highlight down the sunlit side; the colour round it stays
  vec3 dif = alb*gzLight(N, ao);
  return mix(dif, env, fr*.4*(.4 + .6*ao)) + uSlip*pow(rl, 7.)*.03;
}
// the style's distance rule, then exact colour, then the highlight. Two dusts: a thin layer in the lowest 40 m (the mean
// density along the ray from the eye's height to the point's), and the distance itself: a fifth of the way to the horizon's
// colour at 400 m, two thirds at 1,200 m, so a near figure is crisp and a far one is plainly far
vec3 gzOut(vec3 col, float dist, float y){
  float yc = max(cameraPosition.y, 0.), yp = max(y, 0.), dy = yp - yc;
  float a = exp(-yc/40.), b = exp(-yp/40.);
  float lay = abs(dy) > .5 ? 40.*(a - b)/dy : a;
  float a2 = exp(-yc/85.), b2 = exp(-yp/85.);
  float lay2 = abs(dy) > .5 ? 85.*(a2 - b2)/dy : a2;   // the haze thins with height too: looked down on from the air, the floor keeps its tone
  float t = max(dist, 0.)/max(uHazeD, 1.);
  float f = 1. - exp(-t*sqrt(t)*clamp(lay2, 0., 1.) - dist*(uDustK + uDustL*max(lay, 0.)));
  f = clamp(f, 0., 1.);
  { vec3 dv = cameraPosition + gzVd - uVent.xyz; float vl = uVent.w*exp(-dot(dv, dv)/max(uVentR*uVentR, 1.));   // the light in the vent: clay and glass near it glow straw
    col = mix(col*(1. + vl*vec3(.9, .58, .26)), uStraw, min(vl*.1, .6)); }
  return gzToScene(mix(col, gzHaze(gzVd), f)) + uSunCol*gzSpec*(1. - .8*f);
}
`,Pt=`
uniform vec4 uPose;    // x head toss (rad about the pivot's x axis), y head swing (rad about y), z breath 0..1, w ear flick
uniform vec3 uPivot;   // neck pivot, object space
uniform float uTime;
vec3 gzRotX(vec3 p, float a){ float c=cos(a), s=sin(a); return vec3(p.x, c*p.y-s*p.z, s*p.y+c*p.z); }
vec3 gzRotY(vec3 p, float a){ float c=cos(a), s=sin(a); return vec3(c*p.x+s*p.z, p.y, -s*p.x+c*p.z); }
// bend.x neck weight 0..1, bend.y ear weight, bend.z breath weight
void gzPose(inout vec3 p, inout vec3 n, vec3 bend){
  float w = bend.x;
  vec3 q = p - uPivot;
  q = gzRotY(gzRotX(q, uPose.x*w), uPose.y*w*w); n = gzRotY(gzRotX(n, uPose.x*w), uPose.y*w*w);
  q.z -= max(bend.y, 0.)*uPose.w*3.;
  float sw = max(-bend.y, 0.); q.x += sw*.55*sin(uTime*.8 + p.z*.21 + p.x*.1); q.z += sw*.45*sin(uTime*.63 + p.x*.17);
  p = q + uPivot;
  p.x *= 1. + .012*uPose.z*bend.z; p.y += .25*uPose.z*bend.z;
}
`,Zt=`
attribute vec4 aFlow;   // x aDown: metres downhill from the pour, y aLane: constant along a flow line, z green carried from uphill, w cream part (mane, blaze)
attribute vec4 aSurf;   // x ridge (glaze thins to slip), y hollow (it pools), z ao, w part: 0 body, 1 saddle cloth, 2 always bare, 3 face (takes the pour)
attribute vec3 aBend;   // neck, ear, breath weights
attribute float aLw;    // log2 of the metres one lane unit spans here (lanes fan out on domes: the runs split to keep their width)
attribute vec4 aMark; varying vec4 vMark;   // marks that stand on the mould (baked at build): x a pared arris of a leg (+1 / -1 on alternate edges), y a knife cut of the mane, z and w a tongue of the glaze line (how near its middle; how far below the knee it ends, m)
varying vec4 vFlow, vSurf; varying vec3 vN, vP, vO, vSunO; varying float vLw; uniform vec3 uSun;
${Pt}
void main(){
  vec3 p = position, n = normal; gzPose(p, n, aBend);
  vSunO = normalize(uSun*mat3(modelMatrix) + vec3(0., 1e-6, 0.));   // the sun in the mould's own space (the same at every corner)
  vFlow = aFlow; vSurf = aSurf; vO = position; vLw = aLw;
  vMark = aMark;
  vec4 w = modelMatrix*vec4(p, 1.); vP = w.xyz; vN = mat3(modelMatrix)*n;
  gl_Position = projectionMatrix*viewMatrix*w;
}`,Ut=`
varying vec4 vFlow, vSurf; varying vec3 vN, vP, vO, vSunO; varying float vLw;
varying vec4 vMark;
uniform float uSeed, uKnee, uScale, uTime, uPourK; uniform vec3 uKiln; uniform vec2 uFront; uniform vec4 uLegs;
${Nt}
void main(){
  vec3 toCam = cameraPosition - vP; float dist = length(toCam); vec3 V = toCam/max(dist, 1e-3); gzVd = -toCam;
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)); if (!gl_FrontFacing) N = -N;
  float down = vFlow.x, part = vSurf.w;
  float fan = clamp(fwidth(vFlow.y)/max(length(dFdx(vP)) + length(dFdy(vP)), 1e-5), 0., 1.); // lanes fan out on domes: calm the meander there
  float lane = vFlow.y + uSeed*37. + fan*(2.6*(gzN2(vec2(vFlow.y/8., down/15.) + uSeed) - .5) + .9*(gzN2(vec2(vFlow.y/2.5, down/5.)) - .5));
  float isCloth = step(.5, part)*step(part, 1.5), isBare = step(1.5, part)*step(part, 2.5), isFace = step(2.5, part);
  float lw = fwidth(lane);
  vec3 on = abs(cross(dFdx(vO), dFdy(vO)));
  float lgc = min(vLw, 3.), lgk = clamp(floor(lgc), -1., 3.);
  gzLf = smoothstep(.2, .8, lgc - lgk); gzE0 = exp2(lgk); gzE1 = gzE0*2.; gzLane = lane; gzDown = down; gzO = vO;
  gzFb = smoothstep(2.6, 3.8, vLw)*(1. - smoothstep(.45, .75, abs(N.y))); gzWx = smoothstep(.25, .75, on.x/(on.x + on.z + 1e-9));
  float px = mix(lw*exp2(lgc), (length(dFdx(vO)) + length(dFdy(vO)))*.7, gzFb);   // metres across the flow under one pixel
  float nW = gzN1(lane/11.), nM = gzN1(lane/3.1+7.), nF = gzN1(lane/1.05+19.);
  nF = mix(nF, .5, smoothstep(.35, 1.1, lw)); nM = mix(nM, .5, smoothstep(1.2, 3.5, lw));
  float finger = nM*nM*(.6+.8*nF);
  // where the glaze is: behind this lane's creeping front, and above the ragged knee line
  float front = uFront.x + uFront.y*nW + 34.*finger + uU*47.*mix(.5, 3., nM)*.8;
  float kf = gzS(1.7, 3.3, 1e4); front += 45.*(1. - smoothstep(58., 84., vO.y));
  float kneeY = uKnee + 3.2*(gzS(5., 31., 1e4)*2. - 1.) - 9.*kf*kf*kf - 4.*finger*finger;
  // a tongue of the line: at a fixed edge of a leg the glaze comes down a set distance below the knee in one fat rounded lip (a bead hangs from it)
  { float tq = clamp((1. - vMark.z)/.55, 0., 1.); kneeY = min(kneeY, uKnee + 3.5 - (vMark.w + 3.5)*sqrt(1. - tq*tq)*step(.001, vMark.z)); }
  float d = min(front - down, vO.y - kneeY) - isBare*1e4;
  float aa = fwidth(d) + 1e-4;
  float cover = smoothstep(-aa, aa, d);
  float lip = exp(-max(d, 0.)/1.7);
  float run = smoothstep(.5, .85, nF)*nM;
  // the one green pour over the face (uPour 0..1), with its own fat front
  float pq = uPour*uPourK;
  float pd = pq*96. - 8. - down - 13.*(1.-nM)*(1.-.6*pq) - 13.*clamp(vSurf.x, 0., 1.2)*(1. - .5*pq);
  float pmask = isFace*max(smoothstep(.1, .3, max(vFlow.w, 0.) + .34*(gzS(2.2, 5., 30.) - .5)), smoothstep(138., 147., vO.y));
  float pg = pmask*smoothstep(0., 1.5, pd)*step(1e-3, pq);
  float plip = pmask*exp(-abs(pd)/2.6)*step(1e-3, pq);
  // the wet glass still creeps: slow, thicker pulses travel down each lane (small cyclic life, on the clock)
  float lph = gzN1(lane/1.3 + 41.)*37. + gzN1(lane/.37 + 5.)*9.;
  float pz = down/(13.*uScale) - uTime*.5 + lph;
  float pulse = smoothstep(.42, .8, gzN1(pz))*(1. - smoothstep(.3, 1.1, fwidth(pz)))*(1. - smoothstep(.7, 2.2, lw))*(.4 + .6*nM)*smoothstep(.3, .6, N.y*.5 + .8);
  float h = cover*(.3 + 1.1*lip + .22*run + .9*plip + .3*pg + .4*pulse)*uScale;
  // THE RUN IS THE MARK. Streak noises in (lane, down): the octave is picked from the baked lane metric, so a run keeps its
  // width (about c metres) wherever lanes fan out over a dome and splits in two instead of widening into a blot.
  float sW = gzS(9., uSeed*3.1, 170.);                                      // where a colour was dabbed on: 9 m wide, running far
  float sM = mix(gzS(2.6, 7., 64.), .5, smoothstep(.9, 2.8, px));           // the runs: 2 to 4 m wide
  float sF = mix(gzS(.85, 19., 24.), .5, smoothstep(.3, .95, px));          // the threads between them
  float sP = mix(gzS(2.6, 33., 13.), .5, smoothstep(.9, 2.8, px));          // where a run slows
  float cream = max(vFlow.w, 0.), strapness = max(-vFlow.w, 0.);
  float isLeaf = step(.09, strapness)*step(strapness, .15);                 // a pendant or a tassel: its own green piece
  // amber over the body in runs, the misses left cream as tall narrow streaks
  float aN = .46*sW + .54*sM + .1*(sF - .5) + .22*(1. - smoothstep(64., 112., vO.y));
  float a = smoothstep(uKiln.x + .02, uKiln.x + .15, aN)*(1. - .92*cream);
  float tk = clamp((aN - uKiln.x - .04)*4.2, 0., 1.);                       // how thick the amber lies across its run: honey at the edge, amber in the body
  a = max(a, step(.5, uKiln.x)*cream*.9);
  a *= mix(1., smoothstep(.42, .58, sW), uKiln.y);
  a = max(a, step(.03, strapness)*step(strapness, .07)*.96);   // the luted saddle: amber, its seat pooled
  a = max(a, (1. - cream)*step(uKiln.x, .5)*smoothstep(.88, .97, N.y)*.95);   // where it was poured on, along the top, nothing misses
  // green carried downhill from cloth, straps and pendants in fingers; thrown splashes, combed by the runs
  float gT = .47 - .14*uU;
  float gv = vFlow.z*(.3 + 1.5*sM*(.6 + .5*sF)) + isCloth*.25 - gT;
  gv = max(gv, mix(-1., (gzS(6., 50., 140.) - .68)*.5, uKiln.y*(1. - cream)));
  gv = max(gv, (strapness - .42)*(.7 + .3*sM)*2.);
  float bl = gzN2(vO.zy/vec2(21., 27.) + vO.x/19. + uSeed*1.7) + .34*(sM - .5) + .16*(sF - .5);
  gv = max(gv, mix(-1., (bl - .79)*.9, (1. - cream)*(1. - isFace)));
  gv = max(gv, mix(-1., .2, isLeaf));
  float g = smoothstep(0., .06, gv);
  float over = isCloth*smoothstep(.6, .7, sM*.5 + sW*.5); g *= 1. - .9*over; a = max(a, over);   // amber from the saddle runs on across the cloth
  float seam = smoothstep(-.07, -.005, gv)*(1. - smoothstep(.05, .15, gv))*(1. - isLeaf)*(1. - isCloth);   // amber overruns green: an olive seam
  // resist spots that stayed cream: small, round, in dapples (never wider than they are tall)
  float dap = smoothstep(.5, .7, gzN2(vO.zy/vec2(34., 30.) + vO.x/25. + uSeed*2.3));
  float resist = smoothstep(.8, .85, gzS(1.5, uSeed + 11., 3.2))*(1. - smoothstep(.45, 1.2, px))*(1. - isCloth)*(1. - isLeaf)*(.25 + .75*dap)*smoothstep(-.7, .2, vLw);
  a *= 1. - .92*resist; g *= 1. - .92*resist; seam *= 1. - resist;
  g = max(g, pg);
  // thickness: thin amber is honey over the slip, thick amber deepens, slow stretches and hollows pool brown
  float slow = smoothstep(.56, .8, sP)*smoothstep(.4, .65, sM);
  float pool = clamp(vSurf.y*1.25 + lip*.6 + run*.35 + pulse*.85 + slow*.75, 0., 1.);
  float thick = smoothstep(.22, .62, sM*.7 + sF*.3);
  vec3 amb = mix(mix(uStraw, uAmber, .7), uAmber, max(thick*.6, smoothstep(.08, .6, tk)));
  amb = mix(amb, uPool, clamp(pool*.95 + .34*smoothstep(.55, .9, sM) + .5*smoothstep(.6, 1., tk)*sF, 0., 1.));
  vec3 col = mix(uStraw, amb, clamp(a, 0., 1.));
  col = mix(col, col*vec3(.95, .87, .7), pulse*.7*(1. - a));   // thicker clear glass is strawier
  vec3 olive = sqrt(uAmber*uGreen)*.86;
  vec3 gc = mix(mix(uGreen, uStraw, .2*(1. - thick)), uGreen*.55, pool*.7);
  col = mix(col, gc, g);
  col = mix(col, mix(olive, olive*.7, pool), seam*smoothstep(.2, .6, a)*.9);
  float dab = isCloth*uKiln.z*smoothstep(.75, .79, gzN2(vO.xz/5.6 + uSeed*5.) + .1*(sM - .5))*(1. - over);   // fat dabs, some 3 m across
  col = mix(col, uCobalt, dab*.93);
  float mo = gzN2(vO.zy/vec2(3.1, 5.3) + vO.x/3.7 + uSeed); mo = mix(mo, .5, smoothstep(.5, 1.8, px)); col *= .92 + .16*mo;   // the glass is mottled, never one flat tone
  float thin = clamp(vSurf.x*1.15 - .12, 0., 1.)*(1. - pool*.6);
  col = mix(col, mix(uSlip, uAmber, isLeaf*.85), thin*.8);   // slip on ridges, seams and strap edges; on a pendant the veins take amber
  // the knife's marks under the glass. A leg pared in six flat sides: along each arris between two of them (the edges marked +1) the
  // glass thins toward slip, a line 0.6 m wide (in the mould's metres, measured on the surface). A knife cut of the mane: its bottom pooled dark, 0.8 m wide, its edges slip (baked ridge)
  vec3 mox = dFdx(vO), moy = dFdy(vO); float mmx = dFdx(vMark.x), mmy = dFdy(vMark.x);
  float mg11 = dot(mox, mox), mg12 = dot(mox, moy), mg22 = dot(moy, moy);
  float mgr = sqrt(max((mg22*mmx*mmx - 2.*mg12*mmx*mmy + mg11*mmy*mmy)/max(mg11*mg22 - mg12*mg12, 1e-12), 1e-10));   // how fast the mark changes, per metre of surface
  float mpx = sqrt(max(mg11, mg22)), arris = (1. - smoothstep(.3 - mpx, .3 + mpx, (1. - vMark.x)/mgr))*(1. - smoothstep(.45, 1.3, mpx));
  col = mix(col, uSlip, arris*.3*(1. - pool*.6));
  col = mix(col, mix(uPool, uAmber, .2)*.9, smoothstep(.25, .45, vMark.y)*.92);
  // crazing: a quiet crackle about half a metre across, only near, never the loudest thing
  vec2 cz = (on.y > max(on.x, on.z) ? vO.xz : (on.x > on.z ? vO.zy : vO.xy))*uScale/.5; float cw = fwidth(cz.x) + fwidth(cz.y);
  float craze = 0.;
  if (dist < 70.) {
    vec2 ci = floor(cz), cf = fract(cz); float f1 = 9., f2 = 9.;
    for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
      vec2 o = vec2(float(i), float(j)); vec2 r = o + vec2(gzH2(ci+o), gzH2(ci+o+17.3)) - cf; float dd = dot(r, r);
      if (dd < f1) { f2 = f1; f1 = dd; } else if (dd < f2) f2 = dd;
    }
    float e = sqrt(max(f2, 0.)) - sqrt(max(f1, 0.));
    craze = (1.-smoothstep(0., cw*1.2 + .02, e))*(1.-smoothstep(40., 68., dist))*(1.-smoothstep(.16, .42, cw))*(.35 + .65*gzN2(cz/7. + 3.));
  }
  col *= 1. - .085*craze*cover;
  // crazing at the nearest: inside 30 m of the eye (the design's own distance) the glass shows its wider net as well, cells a metre
  // across (the top of the design's 0.3 to 1 m: twice the quiet crackle's size) at twice its value (0.17 for 0.085), a line as fine;
  // full inside 18 m, gone at 30. One rule for every figure; still never the loudest thing
  if (dist < 30.) {
    vec2 cy = cz*.5 + 11.3; float cv = cw*.5;
    vec2 ci = floor(cy), cf = fract(cy); float f1 = 9., f2 = 9.;
    for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
      vec2 o = vec2(float(i), float(j)); vec2 r = o + vec2(gzH2(ci+o+3.1), gzH2(ci+o+29.7)) - cf; float dd = dot(r, r);
      if (dd < f1) { f2 = f1; f1 = dd; } else if (dd < f2) f2 = dd;
    }
    float e = sqrt(max(f2, 0.)) - sqrt(max(f1, 0.));
    col *= 1. - .17*cover*(1.-smoothstep(0., cv*1.2 + .02, e))*(1.-smoothstep(18., 30., dist))*(1.-smoothstep(.2, .5, cv));
  }
  // relief of the wet glass: fat lips and raised runs bend the normal
  vec3 dpx = dFdx(vP), dpy = dFdy(vP); float hx = dFdx(h), hy = dFdy(h);
  vec3 r1 = cross(dpy, N), r2 = cross(N, dpx); float det = dot(dpx, r1);
  vec3 Nb = normalize(abs(det)*N - sign(det)*(hx*r1 + hy*r2)*1.6 + N*1e-7);
  float ao = vSurf.z;
  vec3 glass = gzGlass(col, Nb, V, ao);
  // bare clay: dead matt, knife facets, speckle
  vec3 fc = cross(dpx, dpy); vec3 Nf = fc/max(length(fc), 1e-9); if (dot(Nf, N) < 0.) Nf = -Nf;
  vec3 pk = vO*1.7; float skw = fwidth(pk.x) + fwidth(pk.y) + fwidth(pk.z);
  float sp = gzN2(pk.xy*2.3 + pk.z*1.9)*.5 + gzN2(pk.zx*5.1 + pk.y*4.3)*.5; sp = mix(sp, .5, smoothstep(.2, .7, skw));
  float mott = gzN2(vO.xz/23. + vO.y/31.);
  float grit = gzN2(vO.xy*.9 + vO.z*.7); grit = mix(grit, .5, smoothstep(.5, 1.6, skw));
  vec3 calb = uClay*(.9 + .14*mott)*(1. - .22*smoothstep(.7, .78, sp))*(.94 + .12*grit) + vec3(.035, .0, -.015)*(mott-.5);
  calb = mix(calb, mix(uClay, uSlip, .75), arris*.8);   // bare clay pared by the knife: each arris a pale line between two flat sides
  vec3 clay = gzMatt(calb, normalize(mix(N, Nf, .8)), ao);
  clay = mix(clay, calb*uShadeTint*1.06, .55*(1. - isBare)*smoothstep(11.6, 12.1, vO.y)*(1. - smoothstep(12.5, 13.1, vO.y)));   // the pared hoof: the knife's ledge round its top, in its own rose shade
  // each leg throws its shadow along the slab it stands on (the floor's shadows are the sheared moulds, below the slab's top)
  if (vO.y < 9.5 && N.y > .6) {
    vec2 sh = vSunO.xz; float sl = max(length(sh), 1e-4); sh /= sl; float tanE = vSunO.y/sl, lsh = 0.;
    vec2 r; float t, dp, sf;
    r = vec2(-uLegs.x, uLegs.y) - vO.xz; t = dot(r, sh); dp = abs(r.x*sh.y - r.y*sh.x); sf = .5 + .035*max(t, 0.);
    lsh = max(lsh, smoothstep(-2., 2., t)*step(t*tanE, 70.)*(1. - smoothstep(uLegs.w - sf, uLegs.w + sf, dp)));
    r = vec2(uLegs.x, uLegs.y) - vO.xz; t = dot(r, sh); dp = abs(r.x*sh.y - r.y*sh.x); sf = .5 + .035*max(t, 0.);
    lsh = max(lsh, smoothstep(-2., 2., t)*step(t*tanE, 70.)*(1. - smoothstep(uLegs.w - sf, uLegs.w + sf, dp)));
    r = vec2(-uLegs.x, uLegs.z) - vO.xz; t = dot(r, sh); dp = abs(r.x*sh.y - r.y*sh.x); sf = .5 + .035*max(t, 0.);
    lsh = max(lsh, smoothstep(-2., 2., t)*step(t*tanE, 70.)*(1. - smoothstep(uLegs.w - sf, uLegs.w + sf, dp)));
    r = vec2(uLegs.x, uLegs.z) - vO.xz; t = dot(r, sh); dp = abs(r.x*sh.y - r.y*sh.x); sf = .5 + .035*max(t, 0.);
    lsh = max(lsh, smoothstep(-2., 2., t)*step(t*tanE, 70.)*(1. - smoothstep(uLegs.w - sf, uLegs.w + sf, dp)));
    clay = mix(clay, calb*uShadeTint*1.06, lsh);
  }
  gzSpec *= cover;
  gl_FragColor = vec4(gzOut(mix(clay, glass, cover), dist, vP.y), 1.);
}`;function _t(d,s={}){const n=s.kiln==="cream"?[.74,0,0]:s.kiln==="streaked"?[.2,1,0]:[.26,0,0];return new k.ShaderMaterial({vertexShader:Zt,fragmentShader:Ut,side:k.DoubleSide,uniforms:{...d,...s.tint||{},uSeed:{value:s.seed??0},uKnee:{value:s.knee??38},uScale:{value:s.scale??1},uKiln:{value:new k.Vector3(n[0],n[1],s.cobalt?1:0)},uFront:{value:new k.Vector2(s.front0??76,s.frontVar??50)},uPourK:{value:s.pour?1:0},uLegs:{value:new k.Vector4(...s.legs||[18,60,-68,7.5])},uPose:{value:new k.Vector4(0,0,0,0)},uPivot:{value:(s.pivot||new k.Vector3(0,120,70)).clone()}}})}function $t(d,s={}){return new k.ShaderMaterial({uniforms:{...d,uPose:s.pose||{value:new k.Vector4},uPivot:s.pivot||{value:new k.Vector3(0,120,70)},uFloorY:{value:s.floorY??0}},vertexShader:`attribute vec3 aBend; uniform float uFloorY; uniform vec3 uSun; varying vec3 vP;
${Pt}
void main(){ vec3 p = position, n = normal; gzPose(p, n, aBend); vec4 w = modelMatrix*vec4(p, 1.);
  float hgt = max(w.y - uFloorY, 0.); w.xz -= uSun.xz/max(uSun.y, .05)*hgt; w.y = uFloorY + .05; vP = w.xyz;
  gl_Position = projectionMatrix*viewMatrix*w; }`,fragmentShader:`varying vec3 vP;
${Nt}
void main(){ gzVd = vP - cameraPosition;
  vec3 c = uClay*uShadeTint*(.95 + .1*(gzN2(vP.xz/61.)*.6 + gzN2(vP.xz/17. + 9.)*.4));
  gl_FragColor = vec4(gzOut(c, length(gzVd), 0.), 1.); }`,side:k.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})}function it(d,s=!1){const n=d.nS,g=d.nT,M=g+1,r=(n+1)*M,w=new Float32Array(r*3),B=new Float32Array(n+1),C=new Float32Array(n+1),a=new k.Vector3().fromArray(d.up||[0,1,0]),P=new k.Vector3,u=new k.Vector3,A=new k.Vector3,T=new k.Vector3,v=new k.Vector3,y=new k.Vector3;for(let p=0;p<=n;p++){const m=p/n,R=.5/n,j=d.at(m);T.fromArray(d.at(Math.max(0,m-R)).p),v.fromArray(d.at(Math.min(1,m+R)).p),y.fromArray(j.p),P.subVectors(v,T);const V=P.length();V>1e-6?P.multiplyScalar(1/V):P.set(0,0,1),u.crossVectors(a,P),u.lengthSq()<1e-8&&u.set(1,0,0),u.normalize(),A.crossVectors(P,u),B[p]=p?B[p-1]+V*(p===1||p===n?1.5:1):0,C[p]=(j.rx+j.ry)*.5;for(let D=0;D<=g;D++){const G=D%g/g*Math.PI*2,_=d.shape?d.shape(m,G):1,O=(p*M+D)*3,l=Math.cos(G)*j.rx*_,o=Math.sin(G)*j.ry*_;w[O]=y.x+u.x*l+A.x*o,w[O+1]=y.y+u.y*l+A.y*o,w[O+2]=y.z+u.z*l+A.z*o}}const e={spec:d,nS:n,nT:g,W:M,n:r,P:w,plen:B,rad:C,N:new Float32Array(r*3),flow:new Float32Array(r*4),surf:new Float32Array(r*4),bend:new Float32Array(r*3)};return qt(e),s||Tt(e),e}function Tt(d,s=0,n=1/0,g=!0){const{spec:M,nS:r,nT:w,W:B,P:C}=d;if(M.disp||M.seam){const a=d.N;for(let P=s;P<=Math.min(r,n-1);P++)for(let u=0;u<=w;u++){const A=(P*B+u)*3,T=P/r,v=u%w/w*Math.PI*2;let y=M.disp?M.disp(T,v,C[A],C[A+1],C[A+2]):0;M.seam&&(y+=M.seam*Math.exp(-(C[A]*C[A])/1.1)),C[A]+=a[A]*y,C[A+1]+=a[A+1]*y,C[A+2]+=a[A+2]*y}g&&qt(d)}return d}function qt(d){const{nS:s,nT:n,W:g,P:M,N:r}=d;for(let w=0;w<=s;w++)for(let B=0;B<=n;B++){const C=Math.max(0,w-1),a=Math.min(s,w+1),P=(B%n+n-1)%n,u=(B%n+1)%n,A=(a*g+B)*3,T=(C*g+B)*3,v=(w*g+u)*3,y=(w*g+P)*3,e=(w*g+B)*3,p=M[A]-M[T],m=M[A+1]-M[T+1],R=M[A+2]-M[T+2],j=M[v]-M[y],V=M[v+1]-M[y+1],D=M[v+2]-M[y+2];let G=V*R-D*m,_=D*p-j*R,O=j*m-V*p;const l=Math.hypot(G,_,O)||1;r[e]=G/l,r[e+1]=_/l,r[e+2]=O/l}}function pt(d,s=0,n=0,g=1/0){const{spec:M,nS:r,nT:w,W:B,n:C,P:a,N:P,flow:u,surf:A,bend:T,plen:v,rad:y}=d;let e=d._order,p=0;if(s!==2&&!e){e=d._order=new Uint32Array((r+1)*w);for(let O=0;O<=r;O++)for(let l=0;l<w;l++)e[p++]=O*B+l;e.sort((O,l)=>a[l*3+1]-a[O*3+1]),d._done=new Uint8Array(C)}const m=d._done||new Uint8Array(C),R=M.laneOff||0,j=M.down0||0,V=s===2?0:Math.min(g,e.length),D=[[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]],G=(O,l)=>O*B+(l%w+w)%w;for(let O=n;O<V;O++){const l=e[O],o=l/B|0,h=l%B,q=l*3,L=o/r,H=h/w*Math.PI*2,Z=M.green?M.green(L,H):0,W=G(Math.min(r,o+1),h)*3,t=G(Math.max(0,o-1),h)*3,c=G(o,h+1)*3,b=G(o,h-1)*3,x=o>0&&o<r?.5:1,f=(a[W]-a[t])*x,z=(a[W+1]-a[t+1])*x,F=(a[W+2]-a[t+2])*x,S=(a[c]-a[b])*.5,E=(a[c+1]-a[b+1])*.5,U=(a[c+2]-a[b+2])*.5,X=f*f+z*z+F*F+1e-9,i=f*S+z*E+F*U,I=S*S+E*E+U*U+1e-9,at=X*I-i*i+1e-12;let Y=(I*z-i*E)/at,J=(X*E-i*z)/at;const ot=z*Y+E*J;let Q=0,et=0,nt=0,ut=!1;if(!(ot<.03&&P[q+1]>0)){const gt=Math.max(Math.abs(Y),Math.abs(J))||1;Y/=gt,J/=gt;const mt=Math.atan2(J,Y),yt=(mt/(Math.PI/4)%8+8)%8,vt=Math.floor(yt)%8,Lt=(vt+1)%8,Dt=yt-Math.floor(yt),kt=_(o+D[vt][0],h+D[vt][1]),At=_(o+D[Lt][0],h+D[Lt][1]);let st=kt>=0&&m[kt]?kt:-1,rt=At>=0&&m[At]?At:-1,wt=Dt;if(st<0&&rt<0){let zt=-1,St=a[q+1];for(let xt=0;xt<8;xt++){const dt=_(o+D[xt][0],h+D[xt][1]);dt>=0&&m[dt]&&a[dt*3+1]>St&&(St=a[dt*3+1],zt=dt)}st=rt=zt}else st<0?st=rt:rt<0&&(rt=st);if(st>=0){Math.abs(u[st*4+1]-u[rt*4+1])>6&&(wt>.5?st=rt:rt=st);const zt=$(a[st*3],a[rt*3],wt)-a[q],St=$(a[st*3+1],a[rt*3+1],wt)-a[q+1],xt=$(a[st*3+2],a[rt*3+2],wt)-a[q+2],dt=Math.hypot(zt,St,xt);Q=$(u[st*4+1],u[rt*4+1],wt),et=$(u[st*4],u[rt*4],wt)+dt,nt=$(u[st*4+2],u[rt*4+2],wt)*Math.exp(-dt/(M.carry||70)),ut=!0}}if(!ut){const gt=ot>.25?1:0;Q=R+v[o]+gt*(h/w)*Math.PI*2*y[o],et=j}const ft=l*4;u[ft]=et,u[ft+1]=Q,u[ft+2]=Math.max(Z,nt),u[ft+3]=M.cream?M.cream(L,H):0,m[l]=1}function _(O,l){return O<0||O>r?-1:G(O,l)}for(let O=s===2?n:0;s!==1&&O<=(s===2?Math.min(r,g-1):r);O++)for(let l=0;l<=w;l++){const o=O*B+l,h=o*3,q=O/r,L=l%w/w*Math.PI*2;if(l===w){const F=O*B;for(let S=0;S<4;S++)u[o*4+S]=u[F*4+S]}const H=G(Math.min(r,O+1),l)*3,Z=G(Math.max(0,O-1),l)*3,W=G(O,l+1)*3,t=G(O,l-1)*3,c=(a[H]+a[Z]+a[W]+a[t])/4-a[h],b=(a[H+1]+a[Z+1]+a[W+1]+a[t+1])/4-a[h+1],x=(a[H+2]+a[Z+2]+a[W+2]+a[t+2])/4-a[h+2],f=Math.hypot(a[H]-a[Z],a[H+1]-a[Z+1],a[H+2]-a[Z+2])+Math.hypot(a[W]-a[t],a[W+1]-a[t+1],a[W+2]-a[t+2])+1e-6,z=(c*P[h]+b*P[h+1]+x*P[h+2])/f*14*Math.min(1,8/f);if(A[o*4]=lt(-z,0,1)*.8*(M.curvK??1)+(M.ridge?M.ridge(q,L,a[h],a[h+1],a[h+2]):0)+(M.seam?Math.exp(-(a[h]*a[h])/1.6)*.9:0),A[o*4+1]=lt(z,0,1)+(M.hollow?M.hollow(q,L,a[h],a[h+1],a[h+2]):0),A[o*4+2]=lt(.78+.22*P[h+1]-(M.hollow?.5*M.hollow(q,L,a[h],a[h+1],a[h+2]):0)-lt(z,0,1)*.4,.3,1),A[o*4+3]=M.part||0,M.bend){const F=M.bend(a[h],a[h+1],a[h+2],q,L);T[h]=F[0],T[h+1]=F[1],T[h+2]=F[2]}}return d}function jt(d,s=!0){const{nS:n,nT:g,W:M,P:r,N:w,flow:B,surf:C,bend:a}=d,P=[];for(let A=0;A<n;A++)for(let T=0;T<g;T++){const v=A*M+T,y=v+1,e=v+M,p=e+1;P.push(v,y,e,y,p,e)}const u=new k.BufferGeometry;return u.setAttribute("position",new k.BufferAttribute(r,3)),u.setAttribute("normal",new k.BufferAttribute(w,3)),u.setAttribute("aFlow",new k.BufferAttribute(B,4)),u.setAttribute("aSurf",new k.BufferAttribute(C,4)),u.setAttribute("aBend",new k.BufferAttribute(a,3)),u.setAttribute("aLw",new k.BufferAttribute(s===!1?new Float32Array(d.n):Xt(d),1)),u.setIndex(P),u}function Xt(d){const{nS:s,nT:n,W:g,n:M,P:r,flow:w}=d,B=new Float32Array(M),C=new Float32Array(M),a=(P,u)=>P*g+(u%n+n)%n;for(let P=0;P<=s;P++)for(let u=0;u<=n;u++){const A=Math.max(0,P-1),T=Math.min(s,P+1),v=a(T,u),y=a(A,u),e=a(P,u+1),p=a(P,u-1),m=r[v*3]-r[y*3],R=r[v*3+1]-r[y*3+1],j=r[v*3+2]-r[y*3+2],V=r[e*3]-r[p*3],D=r[e*3+1]-r[p*3+1],G=r[e*3+2]-r[p*3+2],_=w[v*4+1]-w[y*4+1],O=w[e*4+1]-w[p*4+1],l=m*m+R*R+j*j+1e-6,o=m*V+R*D+j*G,h=V*V+D*D+G*G+1e-6,q=l*h-o*o+1e-9,L=Math.sqrt(Math.max((h*_*_-2*o*_*O+l*O*O)/q,1e-8));B[P*g+u]=lt(-Math.log2(L),-1,6)}for(let P=0;P<3;P++){const u=P%2?C:B,A=P%2?B:C;for(let T=0;T<=s;T++)for(let v=0;v<=n;v++){const y=Math.max(0,T-1),e=Math.min(s,T+1);A[T*g+v]=(u[a(T,v)]*2+u[a(y,v)]+u[a(e,v)]+u[a(T,v+1)]+u[a(T,v-1)])/6}}return C}const Ct=(d,s,n,g,M)=>{const r=1-M;return[0,1,2].map(w=>r*r*r*d[w]+3*r*r*M*s[w]+3*r*M*M*n[w]+M*M*M*g[w])},N=(d,s)=>Math.exp(-(d*d)/(s*s)),ct=(d,s,n)=>{const g=Math.min(d/s,(1-d)/n);return g>=1?1:Math.sqrt(Math.max(0,1-(1-g)*(1-g)))},ht=(d,s)=>{let n=d-s;for(;n>Math.PI;)n-=2*Math.PI;for(;n<-Math.PI;)n+=2*Math.PI;return n},tt={knee:38,slab:[84,6,230],pivot:[0,126,60],chestZ:82,rumpZ:-97,legX:18,foreZ:60,hindZ:-68,back:150},Mt=d=>{const s=Math.sin(d*91.7+2.3)*4375.85;return s-Math.floor(s)};function Yt(d,s){const n=[];return d.forEach((g,M)=>{const{nS:r,nT:w,W:B,n:C,P:a,N:P}=g,u=g.mark=new Float32Array(C*4);for(let A=0;A<=r;A++)for(let T=0;T<=w;T++)u[(A*B+T)*4]=T%w%2?-1:1;for(let A=0;A<3;A++){const T=(1+3*M+4*A)%w,v=(4.5+5*Mt(M*3+A))*s/38,y=s-v;for(let e=0;e<=r;e++)for(const p of[-1,0,1])for(const m of[((T+p)%w+w)%w])for(const R of m===0?[0,w]:[m]){const j=(e*B+R)*4;u[j+3]=v,p===0&&(u[j+2]=1)}for(let e=0;e<r;e++){const p=(e*B+T)*3,m=p+B*3;if((a[p+1]-y)*(a[m+1]-y)<=0&&a[p+1]!==a[m+1]){const R=(y-a[p+1])/(a[m+1]-a[p+1]);n.push({p:[a[p]+(a[m]-a[p])*R+P[p]*.25,y+.35,a[p+2]+(a[m+2]-a[p+2])*R+P[p+2]*.25],T:v,k:M,t:A});break}}}}),n}function Jt(d,s){const n=new Float32Array(d.attributes.position.count*4);let g=0;for(const M of s)M.mark&&n.set(M.mark,g*4),g+=M.n;return d.setAttribute("aMark",new k.BufferAttribute(n,4)),d}async function Et(d,s=1,n=null,g=null,M=!0){const r=M?pt:t=>t;g=g||{arch:d.range(-1,1),rump:d.range(.96,1.06),tuck:d.range(-1,1),neckT:d.range(.94,1.08),clothLen:d.range(.9,1.15),tail:d.range(.85,1.2),nPend:d.int(7,9),nCrup:d.int(4,5),earSplay:d.range(.7,1.3)};const w=async()=>{n&&await n()};await w();const B=t=>Math.max(8,Math.round(t*s)),C=t=>Math.max(8,Math.round(t*(.5+.5*s)/2)*2),a=[],P=t=>$(tt.rumpZ,tt.chestZ,t),u=.5-.115*g.clothLen,A=.5+.125*g.clothLen,T=1.02,v=(t,c)=>K(u-.012,u+.004,t)*(1-K(A-.004,A+.012,t))*(1-K(T-.03,T+.03,Math.abs(ht(c,Math.PI/2))+.05*Math.sin(t*90))),y=(t,c,b,x,f)=>{const z=N(x-120,2.3)*K(A-.01,A+.01,t),F=N(x-128,2.3)*(1-K(u-.01,u+.01,t)),S=N((t-(A-.045))*179,2)*K(T-.05,T+.05,Math.abs(ht(c,Math.PI/2)));return Math.max(z,F,S)},e=it({nS:B(132),nT:C(72),up:[0,1,0],seam:.6,carry:42,laneOff:0,at:t=>{const c=ct(t,.2,.17),b=tt.back+3.5*N(t-.16,.16)*g.rump-4.5*N(t-.52,.2)+3.5*N(t-.84,.1),x=78+13*(1-K(.1,.6,t))-2.5*N(t-.78,.15),f=(b-x)/2*(.25+.75*c),z=$((b+x)/2+(t<.5?5:2)*(1-c),(b+x)/2,c),F=(30+6.5*N(t-.2,.2)*g.rump+2.5*N(t-.82,.14)-3*N(t-.52,.16))*c*(1-.2*K(.9,1,t));return{p:[0,z,P(t)],rx:F,ry:f}},shape:(t,c)=>1+.07*Math.sin(c)+.09*N(t-.13,.12)*Math.pow(Math.abs(Math.cos(c)),1.5)*(Math.sin(c)<.3?1:.4)+.06*N(t-.86,.09)*Math.pow(Math.abs(Math.cos(c)),1.5)-.05*N(t-.5,.25)*Math.max(0,-Math.sin(c))*Math.abs(Math.cos(c)),disp:(t,c,b,x,f)=>1.3*v(t,c)+1.5*y(t,c,b,x,f)*(1-v(t,c))+4.2*Math.exp(-((Math.abs(b)-30)**2+(x-124)**2+(f+64)**2)/500)+3.2*Math.exp(-((Math.abs(b)-28)**2+(x-116)**2+(f-56)**2)/330)-1.6*Math.exp(-((x-104)**2+(f+30)**2)/260)*K(10,24,Math.abs(b)),part:0,green:(t,c)=>0,cream:(t,c)=>0,bend:(t,c,b,x)=>[0,0,K(.3,.6,x)*(1-K(.9,1,x))*K(150,100,c)]},!0);await w();for(let t=0;t<=e.nS;t+=4)Tt(e,t,t+4,t+4>e.nS),await w();const p=new Float32Array(e.n),m=new Float32Array(e.n);for(let t=0;t<=e.nS;t++){t%8===7&&await w();for(let c=0;c<=e.nT;c++){const b=t*e.W+c,x=t/e.nS,f=c%e.nT/e.nT*Math.PI*2;m[b]=v(x,f),p[b]=y(x,f,e.P[b*3],e.P[b*3+1],e.P[b*3+2])}}const R=(t,c)=>Math.round(t*e.nS)*e.W+Math.round(c/(Math.PI*2)*e.nT);e.spec.green=(t,c)=>{const b=R(t,c);return Math.max(m[b],p[b]>.45?.62:0)},e.spec.cream=(t,c)=>{const b=R(t,c);return-Math.min(1,1.3*p[b])*(1-m[b])},e.spec.ridge=(t,c)=>{const b=R(t,c),x=m[b],f=p[b];return 3.2*x*(1-x)+(f>.2&&f<.5?.7:0)},e.spec.hollow=(t,c,b,x,f)=>.55*N(x-92,14)*(N(f-tt.foreZ,16)+N(f-tt.hindZ,18))*K(8,14,Math.abs(b))+.5*N(t-.52,.1)*N(ht(c,Math.PI/2),.5),await w();for(let t=0;t<e.n;t+=150)r(e,1,t,t+150),await w();for(let t=0;t<=e.nS;t+=5)r(e,2,t,t+5),await w();for(let t=0;t<e.n;t++){t%1500===1499&&await w();const c=(t/e.W|0)/e.nS,b=t%e.W%e.nT/e.nT*Math.PI*2;v(c,b)>.5&&(e.surf[t*4+3]=1)}a.push(e),await w();const j=[[0,122,54],[0,184+3*g.arch,56],[0,202*g.neckT-4,110+3*g.arch],[0,151,123+2*g.tuck]],V=t=>{const c=Ct(j[0],j[1],j[2],j[3],t),b=ct(t,.01,.12);return{p:c,rx:$(35,11.5,Math.pow(t,.7))*(.5+.5*b),ry:$(24,9.5,Math.pow(t,.8))*(.6+.4*b)}},D=(t,c)=>K(0,1,lt(((c-58)*.5+(t-128)*.8)/40,0,1)),G=it({nS:B(64),nT:C(44),up:[1,0,0],seam:.6,at:V,laneOff:300,carry:70,shape:(t,c)=>1-.1*Math.abs(Math.sin(c))*(1-t),cream:(t,c)=>N(ht(c,Math.PI*1.5),.3)*0,bend:(t,c,b)=>[D(c,b),0,0]});if(await w(),M){for(let t=0;t<G.n;t+=250)pt(G,1,t,t+250),await w();await w(),pt(G,2)}a.push(G),await w();const _=[0,153,121+2*g.tuck],O=[0,101,125+3*g.tuck],l=(t,c,b,x)=>Math.hypot((t-b)*52,ht(c,Math.PI/2+x)*8.5),o=(t,c)=>Math.min(Math.hypot((t-.3)*52/1.7,ht(c,Math.PI/2+1)*8.5),Math.hypot((t-.3)*52/1.7,ht(c,Math.PI/2-1)*8.5)),h=(t,c)=>Math.min(l(t,c,.895,.62),l(t,c,.895,-.62)),q=(t,c)=>Math.abs((t-.945)*52+2.2*Math.max(0,Math.sin(c))),L=it({nS:B(72),nT:C(56),up:[0,0,1],seam:.95,laneOff:500,part:3,carry:60,at:t=>{const c=ct(t,.16,.1),b=(8.4+1.4*N(t-.3,.16)-2.9*K(.3,.72,t)+1.2*N(t-.9,.1))*c,x=(9+2.4*N(t-.34,.2)-3.4*K(.4,.8,t)+1*N(t-.9,.1))*c;return{p:[0,$(_[1],O[1],t),$(_[2],O[2],t)-5*N(t-.34,.25)+1.5*N(t-.75,.2)],rx:b,ry:x}},shape:(t,c)=>1+.2*N(t-.36,.2)*Math.max(0,-Math.sin(c))-.12*Math.max(0,Math.sin(c))*Math.abs(Math.cos(c))*2*N(t-.55,.3),disp:(t,c)=>{const b=o(t,c),x=h(t,c),f=Math.abs(ht(c,Math.PI/2)),z=Math.abs(ht(c,Math.PI*1.5)),F=3*N(b,1.6)-1.6*N(b-3.1,1.2),S=2.1*N((t-.215)*52,2.2)*N(f-.95,.45),E=1.7*N(x-1.5,.9)-1.5*N(x,.9),U=-1.2*N(q(t,c),.8)*K(.5,1.1,f),X=2.7*N((t-.4)*52,6.5)*N(z-1.05,.42)-1.3*N((t-.62)*52,5)*N(z-1.3,.3),i=1*N(f,.42)*K(.3,.45,t)*(1-K(.78,.9,t)),I=2.3*(1-K(.1,.25,t))*N(f-.5,.3)*(.75+.25*Math.sin(t*150));return F+S+E+U+X+i+I},cream:(t,c)=>N(ht(c,Math.PI/2),.55)*K(.1,.3,t),ridge:(t,c)=>.55*N(o(t,c)-1.2,.5)+.5*N(h(t,c)-1.6,.5),hollow:(t,c)=>.85*N(o(t,c)-2.9,.8)+.9*N(h(t,c),.9)+.8*N(q(t,c),.7)*K(.5,1.1,Math.abs(ht(c,Math.PI/2))),bend:()=>[1,0,0]},!0);await w();for(let t=0;t<=L.nS;t+=6)Tt(L,t,t+6,t+6>L.nS),await w();if(M){for(let t=0;t<L.n;t+=200)pt(L,1,t,t+200),await w();for(let t=0;t<=L.nS;t+=12)pt(L,2,t,t+12),await w()}a.push(L),await w();for(const t of[-1,1]){const c=V(.93),b=[t*5.2,c.p[1]+c.rx*.55,c.p[2]+3],x=[t*(7+2.5*g.earSplay),b[1]+21,b[2]+9],f=it({nS:B(12),nT:8,up:[0,0,1],laneOff:560+t*20,part:3,at:z=>({p:[$(b[0],x[0],z),$(b[1],x[1],z),$(b[2],x[2],z)+2*Math.sin(z*3)],rx:4.4*Math.sin(Math.PI*Math.pow(Math.min(z+.12,1),.7))+.05,ry:2.3*(1-z)+.05}),shape:(z,F)=>1-.55*Math.max(0,Math.sin(F))*Math.sin(Math.PI*z),bend:(z,F)=>[1,K(b[1],b[1]+18,F)*(t>0?1:.6),0]});r(f),a.push(f),await w()}const H=(t,c,b,x)=>{const f=Array.from({length:12},()=>d.range(.93,1.05)),z=it({nS:B(46),nT:b===2?8:12,up:[0,0,1],curvK:.35,laneOff:700+x*90,down0:20+x*3,carry:60,at:F=>{const S=$(112,6,F),E=b?50:46,U=6.1+8*Math.pow(K(56,114,S),2)+2.2*N(S-E,5)+1.3*N(S-20,3.2)-.9*N(S-14.5,2.5)+2.3*(1-K(6,12.5,S)),X=c+(b?-7*N(S-54,16)+5*K(60,110,S):1.5*N(S-E,7)),i=Math.min(1,F/.07),I=.25+.75*Math.sqrt(1-(1-i)*(1-i));return{p:[t*(1-.3*K(62,112,S)),S,X],rx:U*I,ry:U*I*(b?1.12:1)*(1+(b?.5:.3)*K(62,112,S))}},shape:(F,S)=>f[Math.round(S/(Math.PI*2)*12)%12]*(1+.035*Math.sin(F*23+S*3)),hollow:(F,S,E,U)=>.35*N(U-16.5,2.2)+.5*K(88,104,U)});return r(z),z},Z=tt.legX;a.push(H(-Z,tt.foreZ,0,0)),await w(),a.push(H(Z,tt.foreZ,0,1)),await w(),a.push(H(-Z-1,tt.hindZ,1,2)),await w(),a.push(H(Z+1,tt.hindZ,1,3)),await w();const W=Yt(a.slice(5,9),tt.knee);return a.legEnds=W,{parts:a,v:g,body:e,neck:G,head:L,neckAt:V,nk:j,neckW:D,NS:B,NT:C,inCloth:v,strap:y,zOf:P,hp0:_,hp1:O,clothA:u,clothB:A,clothTh:T}}function Qt(d,s,n,g,M,r,w=0,B=0){const{nS:C,nT:a,W:P,P:u,N:A}=d,T=[],v=(y,e,p,m)=>y[(e*P+(p%a+a)%a)*3+m];for(let y=0;y<=M;y++){const e=lt(Math.floor(s),0,C-1),p=lt(s-e,0,1),m=Math.floor(n),R=n-m,j=[0,0,0],V=[0,0,0];for(let f=0;f<3;f++)j[f]=$($(v(u,e,m,f),v(u,e+1,m,f),p),$(v(u,e,m+1,f),v(u,e+1,m+1,f),p),R),V[f]=$($(v(A,e,m,f),v(A,e+1,m,f),p),$(v(A,e,m+1,f),v(A,e+1,m+1,f),p),R);const D=Math.hypot(V[0],V[1],V[2])||1;V[0]/=D,V[1]/=D,V[2]/=D,T.push({p:j,n:V});const G=v(u,e+1,m,0)-v(u,e,m,0),_=v(u,e+1,m,1)-v(u,e,m,1),O=v(u,e+1,m,2)-v(u,e,m,2),l=v(u,e,m+1,0)-v(u,e,m,0),o=v(u,e,m+1,1)-v(u,e,m,1),h=v(u,e,m+1,2)-v(u,e,m,2),q=G*G+_*_+O*O+1e-9,L=G*l+_*o+O*h,H=l*l+o*o+h*h+1e-9,Z=q*H-L*L+1e-12,W=-(H*_-L*o)/Z,t=-(q*o-L*_)/Z,c=Math.hypot(G*W+l*t,_*W+o*t,O*W+h*t);if(c<.12||j[1]<r||s<=.02||s>=C-.02)break;const b=w*Math.sin(B+y*.33)*g/c,x=Math.sqrt(H/q);s+=W*g/c-t*x*b,n+=t*g/c+W/x*b}return T}function Ot(d){let s=0,n=0;for(const v of d)s+=v.pts.length*4,n+=(v.pts.length-1)*18;const g=new Float32Array(s*3),M=new Float32Array(s*3),r=new Float32Array(s*3),w=new Float32Array(s*4),B=new Float32Array(s*3),C=new Float32Array(s*3),a=new Uint32Array(n);let P=0,u=0;const A=[-1,-.4,.4,1];for(const v of d){const y=v.pts.length;let e=0,p=0;for(let m=1;m<y;m++)p+=Math.hypot(v.pts[m].p[0]-v.pts[m-1].p[0],v.pts[m].p[1]-v.pts[m-1].p[1],v.pts[m].p[2]-v.pts[m-1].p[2]);for(let m=0;m<y;m++){const R=v.pts[Math.max(0,m-1)].p,j=v.pts[Math.min(y-1,m+1)].p,V=v.pts[m];m&&(e+=Math.hypot(V.p[0]-v.pts[m-1].p[0],V.p[1]-v.pts[m-1].p[1],V.p[2]-v.pts[m-1].p[2]));let D=j[0]-R[0],G=j[1]-R[1],_=j[2]-R[2],O=G*V.n[2]-_*V.n[1],l=_*V.n[0]-D*V.n[2],o=D*V.n[1]-G*V.n[0];const h=Math.hypot(O,l,o)||1;for(let q=0;q<4;q++,P++)if(g.set(V.p,P*3),M.set(V.n,P*3),r[P*3]=O/h,r[P*3+1]=l/h,r[P*3+2]=o/h,w[P*4]=e,w[P*4+1]=p,w[P*4+2]=v.h,w[P*4+3]=A[q],B[P*3]=v.col,B[P*3+1]=v.w*(.8+.2*Math.sin(e*.7+v.h*40)),B[P*3+2]=v.seed||0,C.set(V.bend||v.bend||[0,0,0],P*3),m<y-1&&q<3){const L=P;a[u++]=L,a[u++]=L+4,a[u++]=L+1,a[u++]=L+1,a[u++]=L+4,a[u++]=L+5}}}const T=new k.BufferGeometry;return T.setAttribute("position",new k.BufferAttribute(g,3)),T.setAttribute("normal",new k.BufferAttribute(M,3)),T.setAttribute("aSide",new k.BufferAttribute(r,3)),T.setAttribute("aRib",new k.BufferAttribute(w,4)),T.setAttribute("aCol",new k.BufferAttribute(B,3)),T.setAttribute("aBend",new k.BufferAttribute(C,3)),T.setIndex(new k.BufferAttribute(a.subarray(0,u),1)),T}const Rt="clamp(.3 + .25*H + uU*(1.1 + 1.6*H), 0., 1.)",Gt=`varying vec3 vN, vP; varying float vCol, vAo;
${Nt}
void main(){ vec3 toCam = cameraPosition - vP; float dist = length(toCam); vec3 V = toCam/max(dist, 1e-3); gzVd = -toCam;
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)); if (dot(N, V) < 0.) N = -N;
  vec3 col = vCol < .5 ? mix(uAmber, uPool, .5) : (vCol < 1.5 ? mix(uGreen, uGreen*.55, .45) : mix(uStraw, uAmber, .7));
  gl_FragColor = vec4(gzOut(gzGlass(col, N, V, vAo), dist, vP.y), 1.); }`;function te(d,s={}){return new k.ShaderMaterial({uniforms:{...d,uPose:s.pose||{value:new k.Vector4},uPivot:s.pivot||{value:new k.Vector3}},side:k.DoubleSide,vertexShader:`attribute vec3 aSide, aCol, aBend; attribute vec4 aRib; uniform float uU; varying vec3 vN, vP; varying float vCol, vAo;
${Pt}
void main(){ float H = aRib.z; float front = aRib.y*${Rt}; float behind = front - aRib.x;
  float w = smoothstep(0., 1.4, behind)*(.5 + .75*exp(-max(behind, 0.)/3.2))*(1. + .3*sin(aRib.x*.55 - uTime*1.4 + aCol.z*40.));
  float c = aRib.w; vec3 p = position + aSide*c*aCol.y*w + normal*(.04 + .55*aCol.y*w*(1. - c*c));
  vec3 n = normal + aSide*c*.55; gzPose(p, n, aBend);
  vec4 wp = modelMatrix*vec4(p, 1.); vP = wp.xyz; vN = mat3(modelMatrix)*n; vCol = aCol.x; vAo = .75 + .25*normal.y;
  gl_Position = projectionMatrix*viewMatrix*wp; }`,fragmentShader:Gt})}function Bt(d,s,n={}){if(!n.lite&&!n.tier){const y=s.filter(m=>m.size>=4),e=s.filter(m=>m.size<4),p=new k.Group;return y.length&&p.add(Bt(d,y,{...n,tier:2})),e.length&&p.add(Bt(d,e,{...n,tier:1})),p}const g=n.tier===2?[[0,.035],[.1,.055],[.26,.11],[.42,.24],[.56,.375],[.7,.465],[.82,.47],[.91,.38],[.97,.22],[1,0]]:n.tier===1?[[0,.04],[.28,.13],[.54,.37],[.76,.47],[.93,.3],[1,0]]:[[0,.05],[.36,.2],[.68,.46],[.9,.34],[1,0]],M=n.tier===2?14:n.tier===1?8:6,r=[],w=[],B=[];for(let y=0;y<g.length;y++)for(let e=0;e<=M;e++){const p=e/M*Math.PI*2,m=g[y][1];r.push(Math.cos(p)*m,-g[y][0],Math.sin(p)*m);const R=g[Math.min(g.length-1,y+1)][1]-g[Math.max(0,y-1)][1],j=g[Math.min(g.length-1,y+1)][0]-g[Math.max(0,y-1)][0],V=Math.hypot(R,j)||1;w.push(Math.cos(p)*j/V,R/V,Math.sin(p)*j/V)}for(let y=0;y<g.length-1;y++)for(let e=0;e<M;e++){const p=y*(M+1)+e;B.push(p,p+1,p+M+1,p+1,p+M+2,p+M+1)}const C=new k.InstancedBufferGeometry;C.setAttribute("position",new k.Float32BufferAttribute(r,3)),C.setAttribute("normal",new k.Float32BufferAttribute(w,3)),C.setIndex(B);const a=s.length,P=new Float32Array(a*3),u=new Float32Array(a*4),A=new Float32Array(a*3);s.forEach((y,e)=>{P.set(y.p,e*3),u.set([y.size,y.seed??e*.618%1,y.h??-1,y.col||0],e*4),A.set(y.bend||[0,0,0],e*3)}),C.setAttribute("iPos",new k.InstancedBufferAttribute(P,3)),C.setAttribute("iPar",new k.InstancedBufferAttribute(u,4)),C.setAttribute("iBend",new k.InstancedBufferAttribute(A,3)),C.instanceCount=a;const T=new k.ShaderMaterial({uniforms:{...d,uPose:n.pose||{value:new k.Vector4},uPivot:n.pivot||{value:new k.Vector3}},vertexShader:`attribute vec3 iPos, iBend; attribute vec4 iPar; uniform float uU; varying vec3 vN, vP; varying float vCol, vAo;
${Pt}
void main(){ float H = iPar.z; float reach = H < 0. ? 1. : ${Rt};
  float grow = smoothstep(.93, 1., reach)*(.5 + .5*clamp(uU*1.5 + iPar.y*.35, 0., 1.));
  float ph = iPar.y*40.; float sag = 1. + .1*sin(uTime*1.1 + ph) + .25*uU;
  vec3 q = position*vec3(1., sag, 1.)*iPar.x*grow; float lo = -position.y;
  q.x += lo*lo*iPar.x*.07*sin(uTime*1.7 + ph); q.z += lo*lo*iPar.x*.06*sin(uTime*1.3 + ph*1.7);
  vec3 a = iPos, n0 = vec3(0., 1., 0.), n = normal; gzPose(a, n0, iBend);
  vec4 wp = modelMatrix*vec4(a + q, 1.); vP = wp.xyz; vN = mat3(modelMatrix)*n; vCol = iPar.w; vAo = 1.;
  gl_Position = projectionMatrix*viewMatrix*wp; }`,fragmentShader:Gt}),v=new k.Mesh(C,T);return v.frustumCulled=!1,v}function Wt(d,s,n,g,M=1,r=112){const w=Kt(Math.floor(g()*1e9)),B=[[1,0],[1.012,s*.12],[1.004,s*.8],[.992,s*.97],[.975,s],[.9,s],[.6,s],[.25,s],[0,s]],C=r+1,a=B.length*C,P=new Float32Array(a*3),u=new Float32Array(a*4),A=new Float32Array(a*4),T=new Float32Array(a*3),v=[],y=Math.min(d,n)*.06;for(let p=0;p<B.length;p++)for(let m=0;m<=r;m++){const R=m%r/r*Math.PI*2,j=Math.cos(R),V=Math.sin(R),D=(p*C+m)*3,G=.22,_=Math.sign(j)*Math.pow(Math.abs(j),G),O=Math.sign(V)*Math.pow(Math.abs(V),G),l=B[p][0],o=p<5?1+.012*w.n2(j*3+M,V*3)+.004*w.n2(R*9,3.3):1,h=_*d/2*l*o,q=O*n/2*l*o,L=.06*s*w.n2(h/(d*.4),q/(n*.4)+7)+(p>=3?-.05*s*Math.max(0,w.n2(h/9,q/9)):0);P[D]=h,P[D+1]=B[p][1]+(p>0?L:0)+(p===3||p===4?-.1*s*Math.max(0,w.n2(R*14,1.7)):0),P[D+2]=q,u[(p*C+m)*4+2]=p<1?.6:1,u[(p*C+m)*4+3]=2,A[(p*C+m)*4+1]=R*40}for(let p=0;p<B.length-1;p++)for(let m=0;m<r;m++){const R=p*C+m,j=R+1,V=R+C,D=V+1;v.push(R,V,j,j,V,D)}const e=new k.BufferGeometry;return e.setAttribute("position",new k.BufferAttribute(P,3)),e.setAttribute("aFlow",new k.BufferAttribute(A,4)),e.setAttribute("aSurf",new k.BufferAttribute(u,4)),e.setAttribute("aBend",new k.BufferAttribute(T,3)),e.setAttribute("aLw",new k.BufferAttribute(new Float32Array(a),1)),e.setIndex(v),e.computeVertexNormals(),e}async function ne(d,s={}){const n=d.rng,g=d.yield?()=>d.yield():async()=>{},M=lt(s.detail??d.quality?.detail??1,.6,1),r=s.style||Ht(s.palette||Ft),w=s.kiln||(n()<.7?"amber":n()<.5?"cream":"streaked"),B=n.range(1,90),C=s.q??1,a=s.scale??1,P=s.knee??tt.knee,u=s.slab||tt.slab,A=s.runs??1,T=new k.Group;T.name="glaze-horse";const v=n.fork("shadow"),y=!!s.lite,e=await Et(n,C,g),p=await ee(e,n,g,y);await g();const m=[];{let i=0;for(const I of e.parts.concat(p.parts))m.push(jt(I,!0)),i+=I.n,i>1200&&(i=0,await g())}m.push(Wt(u[0],u[1],u[2],n,1,s.lite?56:112)),await g();const R=m.length>>1,j=bt(m.slice(0,R),!1);await g();const V=bt(m.slice(R),!1);await g();const D=bt([j,V],!1);if(m.forEach(i=>i.dispose()),j.dispose(),V.dispose(),Jt(D,e.parts.concat(p.parts)),e.crup){const i=e.body,I=D.attributes.aFlow.array,at=Math.round(i.nT/4);for(let Y=Math.ceil(e.crup.s0*i.nS);Y<=Math.floor(e.crup.s1*i.nS);Y++)for(const J of[1,-1]){let ot=0;for(let Q=0;Q<i.nT/4;Q++){const et=at+J*Q,nt=(Y*i.W+et)*3,ut=(Y*i.W+et-J)*3;Q&&(ot+=Math.hypot(i.P[nt]-i.P[ut],i.P[nt+1]-i.P[ut+1],i.P[nt+2]-i.P[ut+2]));const ft=(Y*i.W+et)*4+2;I[ft]=Math.max(I[ft],.62*Math.exp(-Math.max(0,ot-2)/9))}}}await g();const G=new k.Vector3().fromArray(tt.pivot),_=await Et(v,y?Math.min(C,.05):Math.min(C,.3),g,e.v,!1);await g();const O=_.parts.map(i=>jt(i,!1));await g(),O.push(Wt(u[0],u[1],u[2],v,1,y?24:112));const l=bt(O,!1);O.forEach(i=>i.dispose());for(const i of["aFlow","aSurf","aLw","normal"])l.deleteAttribute(i);await g();const o=[],h=p.hang.filter((i,I)=>!y||I%3===0).map(i=>({p:i.p,size:i.size*(y?1.5:1),bend:i.bend,col:i.green?1:0,h:-1})),q=e.parts.slice(5,9),L=Math.PI*2,H=(i,I,at,Y,J,ot,Q,et)=>{const nt=Qt(i,I,at,Y,J,ot,n.range(.06,.22),n()*9);if(nt.length<4)return;const ut=(lt(Math.round(I),0,i.nS)*i.W+(Math.round(at)%i.nT+i.nT)%i.nT)*4,ft=n(),gt=i.flow[ut+2]>.8?1:n()<.15?2:0,mt=nt[nt.length-1],yt=nt.length-1===J&&i===e.body;if(et)for(const vt of nt)vt.bend=et(vt.p);o.push({pts:nt,w:Q,col:gt,h:ft,seed:n()}),h.push({p:[mt.p[0]+mt.n[0]*.25,mt.p[1]+.35,mt.p[2]+mt.n[2]*.25],size:Q*n.range(2.2,4.2)*(yt?.45:1),h:ft,col:gt,bend:mt.bend,seed:n()})};for(const i of q){await g();for(let I=0;I<Math.round(11*A);I++)H(i,(112-n.range(58,86))/106*i.nS,n()*i.nT,1.8,31,P-(n()<.3?n.range(3,10):n.range(-2,4)),n.range(.55,1.35))}await g();const Z=Math.round(84*M*A);for(let i=0;i<Z;i++)i%8===7&&await g(),H(e.body,n.range(.04,.96)*e.body.nS,(Math.PI/2+n.sign()*n.range(.9,1.95))/L*e.body.nT,2.6,n.int(14,31),0,n.range(.8,2.1));await g();for(let i=0;i<Math.round(14*A);i++)H(e.neck,n.range(.12,.9)*e.neck.nS,(Math.PI+n.sign()*n.range(.8,1.7))/L*e.neck.nT,2.2,31,0,n.range(.7,1.5),I=>[e.neckW(I[1],I[2]),0,0]);await g();const W=(i,I,at)=>{let Y=0,J=1e9;for(let ot=Math.round(I*i.nS);ot<=Math.round(at*i.nS);ot++)for(let Q=0;Q<i.nT;Q++){const et=(ot*i.W+Q)*3;i.P[et+1]<J&&(J=i.P[et+1],Y=et)}return[i.P[Y],i.P[Y+1]+.5,i.P[Y+2]]},t=W(e.body,.8,.93),c=W(e.head,.8,1);h.push({p:t,size:13,h:-1,col:0,seed:.05},{p:c,size:5.5,h:-1,col:0,bend:[1,0,0],seed:.4});for(let i=0;i<(y?7:16);i++){const I=p.bodyPt(n.range(.2,.74),Math.PI*1.5+n.range(-.12,.12));h.push({p:[I.p[0],I.p[1]+.4,I.p[2]],size:n.range(1.8,5),h:-1,col:b(I.o),seed:n()})}function b(i){return e.body.flow[i*4+2]>.3?1:0}if(!y){for(const i of e.parts.legEnds)h.push({p:i.p,size:2.7+.9*Mt(40+i.k*3+i.t),h:-1,col:0,seed:Mt(60+i.k*3+i.t)});p.hang.forEach((i,I)=>{i.size===1.1&&h.push({p:[i.p[0],i.p[1]-.5,i.p[2]],size:2.6+.8*Mt(80+I),h:-1,col:1,bend:i.bend,seed:Mt(120+I)})})}await g();let x;if(o.length>40){const i=o.length>>1,I=Ot(o.slice(0,i));await g();const at=Ot(o.slice(i));await g(),x=bt([I,at],!1),I.dispose(),at.dispose()}else x=Ot(o);await g();const f=(i={})=>{const I=new k.Group,at=i.scale??a,Y=_t(r,{seed:i.seed??B,knee:P,kiln:i.kiln||w,cobalt:i.cobalt??!1,pivot:G,scale:at,tint:i.tint,pour:!!i.pour}),J={pose:Y.uniforms.uPose,pivot:Y.uniforms.uPivot},ot=new k.Mesh(D,Y),Q=new k.Mesh(l,$t(r,J)),et=new k.Mesh(x,te(r,J)),nt=Bt(r,h,{...J,lite:y});Q.renderOrder=-.5;for(const ut of[ot,Q,et,nt])ut.frustumCulled=!1,I.add(ut);return I.scale.setScalar(at),{object:I,pose:Y.uniforms.uPose.value,material:Y,shadow:Q}},z=f({seed:B,kiln:w,cobalt:s.cobalt??!0,tint:s.tint,pour:s.pour??!y}),F=z.material;T.add(z.object),await g();let S=-1;const E=F.uniforms.uPose.value,U=e.zOf((e.clothA+e.clothB)/2+.01),X={glazeLineY:tt.knee,slabTop:tt.slab[1],slabSize:tt.slab.slice(),neckPivot:tt.pivot.slice(),foreGate:[0,30,tt.foreZ],hindGate:[0,30,tt.hindZ],legGapHalf:tt.legX-7.5,flyUnder:[[0,30,185],[0,30,135],[0,30,tt.foreZ],[0,36,-8],[0,30,tt.hindZ],[0,30,-150]],chestBead:t,chin:c,muzzle:[0,e.hp1[1]+2,e.hp1[2]+6],poll:e.hp0.slice(),crest:[0,187,88],saddleTop:[0,158,U],backLine:[[0,164,-90],[0,168,U-10],[0,170,U+28],[0,196,62],[0,200,96]],faceDive:[[0,176,128],[0,160,140],[0,110,142],[0,60,150]],rumpOrbit:{center:[0,120,tt.rumpZ+10],radius:95},tailTip:p.hang[0].p.slice(),sun:It.toArray()};return{object:T,radius:125*a,height:190*a,center:new k.Vector3(0,95*a,10*a),anchors:X,ground:!0,groundY:0,style:r,material:F,kiln:w,instance:f,shadow:z.shadow,setProgress(i){S=i},update(i,I){const at=S>=0?S:I/30%1;r.uTime.value=I,r.uU.value=at,r.uPour.value=K(.56,.66,at)+0*i,E.set(.035*Math.sin(I*.31)+.02*Math.sin(I*.83+1),.05*Math.sin(I*.23+2),.5+.5*Math.sin(I*.9),Math.pow(Math.max(0,Math.sin(I*.7+1.3)),24))},dispose(){}}}async function ee(d,s,n,g=!1){const M=[],{body:r,neckAt:w,neckW:B,v:C,NS:a}=d,P=[],u=(l,o)=>{const h=lt(Math.round(l*r.nS),0,r.nS),q=(Math.round(o/(Math.PI*2)*r.nT)%r.nT+r.nT)%r.nT,L=h*r.W+q;return{o:L,p:[r.P[L*3],r.P[L*3+1],r.P[L*3+2]],n:[r.N[L*3],r.N[L*3+1],r.N[L*3+2]],down:r.flow[L*4],lane:r.flow[L*4+1]}},A=l=>{const o=w(l),h=w(Math.max(0,l-.01)).p,q=w(Math.min(1,l+.01)).p;let L=q[1]-h[1],H=q[2]-h[2];const Z=Math.hypot(L,H)||1;L/=Z,H/=Z;const W=o.rx+1.2;return[0,o.p[1]+H*W,o.p[2]-L*W]};let T=0;{let l=A(.05);for(let o=1;o<=60;o++){const h=A($(.05,.875,o/60));T+=Math.hypot(h[1]-l[1],h[2]-l[2]),l=h}}const v=Math.round(T/3),y=it({nS:a(v*5),nT:8,up:[1,0,0],laneOff:1e3,carry:40,curvK:.25,at:l=>{const o=ct(l,.03,.02),h=Math.pow(Math.abs(Math.sin(Math.PI*l*v)),.35);return{p:A($(.05,.875,l)),rx:(1.2+3.6*h)*(.3+.7*o),ry:2.9*o*(.85+.15*h)}},shape:(l,o)=>1-.35*Math.abs(Math.sin(o))*Math.max(0,-Math.cos(o)),cream:()=>1,ridge:(l,o)=>.5*Math.max(0,-Math.cos(o))*(1-Math.pow(Math.abs(Math.sin(Math.PI*l*v)),.35)),bend:(l,o,h)=>[B(o,h),0,0]});await n(),pt(y),M.push(y),await n();const e=C.tail,p=[[0,141,-88],[0,145,-101],[0,150,-108-2*e],[0,158+3*e,-111-5*e]],m=it({nS:a(34),nT:14,up:[1,0,0],laneOff:1200,seam:.4,at:l=>{const o=ct(l,.02,.1),h=(6.8-3*l+1.7*N(l-.36,.09)+1.1*N(l-.8,.12))*(.4+.6*o);return{p:Ct(p[0],p[1],p[2],p[3],l),rx:h,ry:h*.92}},disp:(l,o)=>.7*N(l-.36,.1)*Math.sin(o*2+l*16)+.3*Math.sin(o*6+l*5)*K(.5,.9,l),hollow:l=>.6*N(l-.22,.05)});await n(),pt(m),M.push(m);{const l=Ct(p[0],p[1],p[2],p[3],.995);P.push({p:l,size:2.6,bend:[0,0,0]})}const R=(d.clothA+d.clothB)/2+.01,j=d.zOf(R),V=u(R,Math.PI/2).p[1],D=it({nS:a(40),nT:28,up:[0,1,0],laneOff:1400,seam:.5,carry:30,curvK:.15,at:l=>{const o=ct(l,.14,.14);return{p:[0,V-3.5+5*N(l-.06,.16)+6*N(l-.95,.14),j+$(-19,20,l)],rx:16.5*(.45+.55*o)*(1-.12*N(l-.5,.25)),ry:(5.2+6.5*N(l-.05,.13)+7.5*N(l-.96,.12))*(.35+.65*o)}},shape:(l,o)=>(Math.sin(o)<0?.7:1)*(1+.1*Math.pow(Math.abs(Math.cos(o)),6)),disp:(l,o)=>.9*Math.pow(Math.abs(Math.cos(o)),10)*(Math.sin(o)>-.3?1:0),ridge:(l,o)=>.8*Math.pow(Math.abs(Math.cos(o)),10),hollow:(l,o)=>.5*N(l-.5,.16)*Math.pow(Math.max(0,Math.sin(o)),2),cream:()=>-.05,bend:()=>[0,0,.6]});await n(),pt(D),M.push(D),await n();const G=(l,o,h,q,L)=>{const H=Math.hypot(o.n[0],o.n[2])||1,Z=o.n[0]/H,W=o.n[2]/H,t=L||[0,0,0],c={laneOff:o.lane-2+q*.01,down0:o.down,carry:40,green:()=>1,cream:()=>-.12,part:0,curvK:.2};let b;l==="leaf"?b=it({...c,nS:g?7:12,nT:g?6:8,up:[Z,0,W],at:x=>({p:[o.p[0]+Z*(1.3+1.2*x*x),o.p[1]-.5-x*h,o.p[2]+W*(1.3+1.2*x*x)],rx:h*.3*Math.pow(Math.sin(Math.PI*Math.pow(x,.62)),.8)+.12,ry:.85*(1-.6*x)+.05}),disp:(x,f)=>.3*N(Math.cos(f)*3,.5)+.16*Math.sin((Math.abs(Math.cos(f))*2.4+x*4)*6.28)*Math.abs(Math.cos(f)),ridge:(x,f)=>.7*Math.pow(Math.abs(Math.cos(f)),10),hollow:(x,f)=>.3*(1-Math.abs(Math.cos(f))),bend:(x,f)=>[t[0],-K(o.p[1]-1,o.p[1]-h,f)*.6,t[2]]}):l==="boss"?b=it({...c,green:()=>0,cream:()=>.75,nS:g?4:7,nT:g?8:12,up:[0,1,0],at:x=>({p:[o.p[0]+Z*(.2+1.9*x),o.p[1]+o.n[1]*1.9*x,o.p[2]+W*(.2+1.9*x)],rx:h*Math.sqrt(Math.max(0,1-x*x))+.02,ry:h*Math.sqrt(Math.max(0,1-x*x))+.02}),shape:(x,f)=>1+.2*Math.cos(f*6)*(1-x)-.25*N(x-.55,.12),ridge:x=>.6*N(x-.3,.2),hollow:x=>.6*N(x-.55,.1),bend:()=>t}):b=it({...c,nS:g?6:10,nT:g?6:8,up:[Z,0,W],at:x=>({p:[o.p[0]+Z*1.1,o.p[1]+.6-x*h,o.p[2]+W*1.1],rx:(.5+1*N(x-.12,.08)+1.5*K(.25,1,x))*ct(x,.05,.04)+.05,ry:(.5+1*N(x-.12,.08)+1.3*K(.25,1,x))*ct(x,.05,.04)+.05}),shape:(x,f)=>1+.14*Math.cos(f*4)*K(.25,.5,x),hollow:x=>.6*N(x-.25,.06),bend:(x,f)=>[t[0],-K(o.p[1],o.p[1]-h,f)*.9,t[2]]}),pt(b),M.push(b),l!=="boss"&&P.push({p:[o.p[0]+Z*1.3,o.p[1]-h-.3,o.p[2]+W*1.3],size:l==="leaf"?1.5:1.1,bend:[t[0],-.7,t[2]],green:1})},_=(l,o,h)=>{let q=-1,L=1e9;const H=l?Math.round(r.nS*(d.clothB+.03)):2,Z=l?r.nS-2:Math.round(r.nS*(d.clothA-.03));for(let t=H;t<=Z;t++)for(let c=0;c<r.nT;c++){const b=(t*r.W+c)*3,x=r.P[b],f=r.P[b+1],z=r.P[b+2],F=l?Math.atan2(x,z-50):Math.atan2(x,-(z+62)),S=Math.abs(f-h(z))+Math.abs(ht(F,o))*30;S<L&&(L=S,q=t*r.W+c)}const W=q*3;return{p:[r.P[W],r.P[W+1]-1.5,r.P[W+2]],n:[r.N[W],r.N[W+1],r.N[W+2]],down:r.flow[q*4],lane:r.flow[q*4+1]}};let O=0;for(let l=0;l<C.nPend;l++){const o=$(-2.2,2.2,(l+.5)/C.nPend)+s.range(-.05,.05),h=_(!0,o,()=>120);G("leaf",h,s.range(8.2,9.6),O++,[0,0,.5]),G("boss",{...h,p:[h.p[0],h.p[1]+1.5,h.p[2]]},2,O++,[0,0,.5]),await n()}for(let l=0;l<C.nCrup*2;l++){const o=$(-2.3,2.3,(l+.5)/(C.nCrup*2))+s.range(-.05,.05),h=_(!1,o,()=>128);G("leaf",h,s.range(8,9.4),O++),G("boss",{...h,p:[h.p[0],h.p[1]+1.5,h.p[2]]},2,O++),await n()}await n();for(const l of[-1,1])for(let o=0;o<6;o++){const h=$(d.clothA+.004,d.clothB-.004,o/5),q=u(h,Math.PI/2+l*(d.clothTh+.03));G("tassel",q,o===0||o===5?s.range(8,9.5):s.range(5,7),O++,[0,0,.5]),o%2===1&&await n()}if(!g){await n();const l=Math.PI*2,o=Math.PI/2,h=(f,z)=>{const F=lt(f,0,1)*r.nS,S=Math.min(r.nS-1,Math.floor(F)),E=F-S,U=(z/l%1+1)%1*r.nT,X=Math.floor(U)%r.nT,i=U-Math.floor(U),I=[S*r.W+X,(S+1)*r.W+X,S*r.W+X+1,(S+1)*r.W+X+1],at=[(1-E)*(1-i),E*(1-i),(1-E)*i,E*i],Y=[0,0,0],J=[0,0,0];for(let Q=0;Q<4;Q++)for(let et=0;et<3;et++)Y[et]+=r.P[I[Q]*3+et]*at[Q],J[et]+=r.N[I[Q]*3+et]*at[Q];const ot=Math.hypot(J[0],J[1],J[2])||1;return{p:Y,n:[J[0]/ot,J[1]/ot,J[2]/ot]}},q=(f,z)=>[f.p[0]+f.n[0]*z,f.p[1]+f.n[1]*z,f.p[2]+f.n[2]*z],L=(f,z,F)=>[0,0,K(.3,.6,(F-tt.rumpZ)/179)*(1-K(.9,1,(F-tt.rumpZ)/179))*K(150,100,z)],H=f=>{const z=it({laneOff:2e3+70*M.length,carry:40,curvK:.2,part:0,bend:L,...f});return pt(z),M.push(z),z},Z=d.clothA-.004,W=d.clothB+.004,t=d.clothTh,c={green:()=>.62,cream:()=>-.6,ridge:(f,z)=>.9*Math.pow(Math.max(0,Math.cos(z)),6),hollow:(f,z)=>.8*Math.pow(Math.abs(Math.sin(z)),4)};for(const f of[Z,W])H({...c,nS:22,nT:6,up:[0,0,-1],at:z=>{const F=ct(z,.03,.03);return{p:q(h(f,o+$(-t,t,z)),.3),rx:1*(.4+.6*F),ry:1.2*(.4+.6*F)}}});await n();for(const f of[-1,1]){const z=S=>o+f*(t-.05*Math.sin(S*90)),F=h((Z+W)/2,z((Z+W)/2)).n;H({...c,nS:14,nT:6,up:[-F[1],F[0],0],at:S=>{const E=ct(S,.04,.04),U=$(Z,W,S);return{p:q(h(U,z(U)),.3),rx:1*(.4+.6*E),ry:1.2*(.4+.6*E)}}})}await n();{const f=(F,S)=>{const E=h(F,0).p[0];let U=Math.acos(lt(S/E,-1,1));for(let X=0;X<2;X++)U+=(h(F,U).p[0]-S)/(E*Math.max(.3,Math.sin(U)));return U},z=(F,S)=>Math.sign(F)*Math.pow(Math.abs(F),S);H({nS:44,nT:6,up:[0,1,0],green:()=>0,cream:()=>-.05,bend:()=>[0,0,.6],ridge:(F,S)=>.5*Math.pow(Math.max(0,Math.sin(S)),4),hollow:(F,S)=>.9*K(.1,-.6,Math.sin(S)),at:F=>{const S=F*l,E=19.3*z(Math.cos(S),.7),U=j+.5+21*z(Math.sin(S),.8),X=(U-tt.rumpZ)/179;return{p:q(h(X,f(X,E)),.5),rx:1.5,ry:1.5}}})}await n();const b=.06,x=d.clothA-.012;H({nS:20,nT:6,up:[1,0,0],green:()=>.62,cream:()=>-.6,bend:()=>[0,0,0],ridge:(f,z)=>.7*Math.pow(Math.abs(Math.sin(z)),8),at:f=>{const z=ct(f,.04,.04);return{p:q(h($(x,b,f),o),.35),rx:1*(.4+.6*z),ry:2*(.5+.5*z)}}});for(let f=0;f<3;f++){const z=$(x,b,.22+.28*f),F=h(z,o),S=Math.hypot(...[0,1,2].map(E=>h(z,o-.1).p[E]-F.p[E]))/.1;G("boss",{p:q(F,.9),n:F.n,lane:2600+f,down:0},2,O++,[0,0,0]);for(const E of[-1,1]){const U=8.6+.8*Mt(200+f*2+E);H({nS:9,nT:8,up:[0,1,0],green:()=>1,cream:()=>-.12,bend:()=>[0,0,0],at:X=>({p:q(h(z,o-E*(1.6+X*U)/S),.75-.35*X),rx:U*.3*Math.pow(Math.sin(Math.PI*Math.pow(X,.62)),.8)+.12,ry:.85*(1-.6*X)+.05}),disp:(X,i)=>.3*N(Math.cos(i)*3,.5)+.16*Math.sin((Math.abs(Math.cos(i))*2.4+X*4)*6.28)*Math.abs(Math.cos(i)),ridge:(X,i)=>.7*Math.pow(Math.abs(Math.cos(i)),10),hollow:(X,i)=>.3*(1-Math.abs(Math.cos(i)))})}await n()}d.crup={s0:b,s1:x};{let f=.05,z=-1e9;for(let F=0;F<=80;F++){const S=$(.05,.875,F/80),E=A(S);E[1]>z&&(z=E[1],f=S)}H({nS:34,nT:6,up:[1,0,0],green:()=>0,cream:()=>-.05,bend:(F,S,E)=>[B(S,E),0,0],hollow:(F,S)=>.6*Math.max(0,Math.cos(S)),ridge:(F,S)=>.75*Math.pow(Math.abs(Math.sin(S)),6),at:F=>{const S=$(f,.07,F),E=w(S),U=w(Math.max(0,S-.01)).p,X=w(Math.min(1,S+.01)).p;let i=X[1]-U[1],I=X[2]-U[2];const at=Math.hypot(i,I)||1;i/=at,I/=at;const Y=4.6,J=Math.min(.95,Y/E.ry),ot=E.rx*Math.sqrt(1-J*J)*(1-.1*J*(1-S))+.2,Q=ct(F,.04,.03),et=N(F-.95,.04);return{p:[Y,E.p[1]+I*ot,E.p[2]-i*ot],rx:.95*(.3+.7*Q)*(1+.5*et),ry:(1.25+.5*F+1*et)*Q+.05}}})}await n(),y.mark=new Float32Array(y.n*4);for(let f=0;f<=y.nS;f++){const z=f/y.nS*v%1,F=Math.min(z,1-z)*y.nS/v;for(let S=0;S<=y.nT;S++){const E=f*y.W+S;F<.5?y.mark[E*4+1]=1:F<1.5&&(y.surf[E*4]=Math.max(y.surf[E*4],1.3))}}}return{parts:M,hang:P,bodyPt:u}}export{Nt as GLAZE_GLSL,Ft as GLAZE_PALETTE,Pt as GLAZE_POSE_GLSL,tt as HORSE,pt as bakeFlow,Bt as beadsMesh,ne as buildHero,Et as buildHorseParts,_t as glazeFigureMaterial,te as glazeRunMaterial,$t as glazeShadowMaterial,Tt as loftDisplace,it as loftPart,Ht as makeGlazeStyle,Jt as markAttr,Yt as markLegs,jt as partGeometry,Ot as runsGeometry,Wt as slabGeometry,Qt as traceDown};
