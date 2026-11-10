import*as u from"three";import{makePath as He,clamp as k0,lerp as i0,smoothstep as T}from"../kit/core.js";import{buildHero as Ee,grid as r0,lathe as e0,tube as T0,place as Kt,merge as b0,lin as q0,mul as q,mixc as R,hornPoint as Ue,GLSL_ROOM as Rt}from"../parts/seventy-eight-in-the-rain.js";const c0=Math.PI*2,O0={hamY:320,cageY:40,h0:-.09,h1:1,hw:.84,c0:.3,c1:.012,cw:.8,n0:.7,nf:.15},W0=["#0B0B0E","#8F9BA1","#DCE4E6","#C8983A","#2C4F93","#2E5B45","#B3261E"],K=-900,X=-2400,l0=2700,h0=-3400,d0=3300,F0=300,o0=2300,A0=2950,Vt=500,U=(t,n,l)=>new u.Vector3(t,n,l),S0=(t,n,l=new u.Vector3)=>{const g=Math.cos(n),x=Math.sin(n);return l.set(t.x*g+t.z*x,t.y,-t.x*x+t.z*g)},Xt="#include <fog_pars_vertex>",jt="#include <fog_vertex>",Zt=`
#include <fog_pars_fragment>
float fxFog(){
#ifdef USE_FOG
  #ifdef FOG_EXP2
  return 1. - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
  #else
  return smoothstep(fogNear, fogFar, vFogDepth);
  #endif
#else
  return 0.;
#endif
}
vec3 fogCol(){
#ifdef USE_FOG
  return fogColor;
#else
  return vec3(0.);
#endif
}
vec3 fxApplyFog(vec3 c){ return mix(c, fogCol(), fxFog()); }
`,$e=`
uniform float uSun; uniform vec3 uFill, uRake, uRakeDir;
float sunGate(vec3 P, vec3 d){
  float t = (${l0.toFixed(1)} - P.z)/max(d.z, .08);
  vec3 h = P + d*t;
  float open = smoothstep(${(F0-40).toFixed(1)}, ${(F0+160).toFixed(1)}, h.y)*(1. - smoothstep(${(o0-220).toFixed(1)}, ${(o0+20).toFixed(1)}, h.y));
  float post = smoothstep(.045, .075, abs(fract((h.x + 1300.)/2000. + .5) - .5));
  float bal = smoothstep(-860., -790., h.y)*(1. - smoothstep(160., 240., h.y))*smoothstep(.2, .42, abs(fract(h.x/190.) - .5));
  float side = smoothstep(${h0.toFixed(1)}, ${(h0+260).toFixed(1)}, h.x)*(1. - smoothstep(${(d0-260).toFixed(1)}, ${d0.toFixed(1)}, h.x));
  return max(open*post, bal*.7)*side*step(P.z, ${(l0+40).toFixed(1)});
}
vec3 verIrr(vec3 P, vec3 N){
  float depth = smoothstep(${(X-200).toFixed(1)}, ${l0.toFixed(1)}, P.z);
  float front = mix(.26, 1., depth*sqrt(depth));
  vec3 L = normalize(vec3(-P.x*.15, 800. - P.y, 3200. - P.z));
  float wrap = clamp(dot(N, L)*.6 + .4, 0., 1.);
  vec3 c = uSkyCol*front*(.22 + .55*wrap*wrap + .25*max(N.y, 0.));
  c += uFill*(.6 + .4*N.y);
  c += uSkyCol*.10*max(-N.y, 0.)*front;
  c += uKeyCol*max(dot(N, uKeyDir), 0.)*mix(.5, 2.4*sunGate(P, uKeyDir), uSun);
  // the last rift of a blue dusk rakes in low from the open side: warm on whatever faces it, fading into the room
  c += uRake*max(dot(N, uRakeDir), 0.)*sunGate(P, uRakeDir)*(.3 + .7*smoothstep(-2400., 1800., P.z));
  return c*(1. + uFlash*3.);
}
`,L0=`
attribute vec4 aData;
varying vec3 vWPos, vWNrm, vCol, vOPos; varying vec4 vData;
uniform float uTimeV;
${Xt}
void main(){
  vCol = color; vData = aData; vOPos = position;
  vec3 p = position;
#ifdef SWAY
  // aData.z = weight (m of travel), aData.w = phase: a draught in cloth, leaves shivering under the drip
  float w = aData.z;
  p.x += w*(sin(uTimeV*1.7 + aData.w) + .5*sin(uTimeV*4.3 + aData.w*2.1));
  p.z += w*.7*sin(uTimeV*2.3 + aData.w*1.3);
  p.y += w*.35*sin(uTimeV*6.1 + aData.w*3.7);
#endif
  vec4 wp = modelMatrix*vec4(p, 1.);
  vWPos = wp.xyz; vWNrm = mat3(modelMatrix)*normal;
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  ${jt}
}`,Q0=`
varying vec3 vWPos, vWNrm, vCol, vOPos; varying vec4 vData;
${Rt}
${$e}
${Zt}
// the mist under the roof is lit by the opening: toward the back of the room it is dimmer, so the far corners sink
vec3 roomFog(vec3 c, vec3 Ps){ return mix(c, fogCol()*mix(.4, 1., smoothstep(${X.toFixed(1)}, 1500., Ps.z)), fxFog()); }
`,Ea=Q0+`
uniform float uLimeK;
void main(){
  vec3 N = normalize(vWNrm);
  if(!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vWPos);
  vec3 Ns = normalize(uStageInv*N), Vs = normalize(uStageInv*V), Ps = uStageInv*(vWPos - uStagePos);
  float gloss = vData.x, occ = 1. - vData.y;
  float grain = n21(vOPos.xy*.05 + vOPos.z*.031)*.6 + n21(vOPos.zy*.21 + vOPos.x*.17)*.4;
  grain = mix(grain, .5, smoothstep(3., 14., length(fwidth(vOPos))));
  float stain = n21(vec2((vOPos.x + vOPos.z)*.011, vOPos.y*.0011))*.6 + n21(vec2((vOPos.x - vOPos.z)*.004, vOPos.y*.0005 + 3.))*.4;
  vec3 alb = vCol*(.8 + .4*grain)*(.78 + .44*stain);
  float ndv = max(dot(Ns, Vs), 0.);
  float lime = 0., irid = 0.;
#ifndef SWAY
  lime = step(.5, vData.w)*uLimeK; irid = vData.z;
  // limewash in the rain: streaks run down it, damp rises from the rail and the floor and hangs under the eave
  float y = vOPos.y;
  float streak = n21(vec2(vOPos.x*.045 + vOPos.z*.03, y*.0022))*.6 + n21(vec2(vOPos.x*.13 - vOPos.z*.09, y*.006 + 5.))*.4;
  float damp = (1. - smoothstep(${(F0+100).toFixed(1)}, ${(F0+1150).toFixed(1)}, y))*step(${F0.toFixed(1)}, y)
    + (1. - smoothstep(${K.toFixed(1)}, ${(K+650).toFixed(1)}, y))*step(y, ${F0.toFixed(1)}) + .6*smoothstep(${(o0-800).toFixed(1)}, ${o0.toFixed(1)}, y);
  alb *= 1. - lime*(.36*damp + .34*smoothstep(.42, .78, streak)*(.45 + .55*damp));
  alb = mix(alb, alb*vec3(.86, .97, .9), lime*smoothstep(.5, .85, stain)*damp);
  gloss = mix(gloss, .62, lime*.8);
  // the morpho: structural blue, brilliant face on, sinking to violet at a glancing angle
  float iv = ndv*sqrt(ndv);
  alb = mix(alb, mix(alb*vec3(.55, .4, 1.15), alb*1.35 + vec3(.03, .26, .4), iv), irid);
#endif
  float fr = 1. - ndv; float fr2 = fr*fr; fr = fr2*fr2*fr;
  vec3 col = alb*verIrr(Ps, Ns)*occ;
  vec3 Rr = reflect(-Vs, Ns);
  col += roomEnv(Rr, mix(.55, .06, gloss))*(.03 + .97*fr)*gloss*occ;
  // masonry: one side of every post and baluster lies in soft shade, and a wet edge turns toward the opening
  col *= mix(1., mix(.6, 1.12, smoothstep(-.85, .85, dot(Ns, vec3(-.83, .16, .53)))), lime);
  col += lime*uSkyCol*fr2*(1. - ndv)*.3*smoothstep(-.3, .5, Rr.z);
  col += irid*uSkyCol*vec3(.35, .75, 1.)*pow(max(dot(Ns, normalize(Vs + vec3(0., .6, .8))), 0.), 14.)*.5;
  gl_FragColor = vec4(roomFog(col, Ps), 1.);
}`,Ye=Q0+`
void main(){
  vec3 N = normalize(vWNrm);
  if(!gl_FrontFacing) N = -N;
  vec3 Ns = normalize(uStageInv*N), Ps = uStageInv*(vWPos - uStagePos);
  float a = vData.x, w = vData.y;
  float px = max(fwidth(a), 1e-4);
  float fa = fract(a) - .5;
  float hem = .64 + .36*sqrt(max(1. - 4.*fa*fa, 0.));
  if(w > hem) discard;
  float keep = 1. - smoothstep(.16, .45, px);
  vec2 q = vec2(a*2., w*3.4);
  float net = min(abs(fract(q.x + q.y) - .5), abs(fract(q.x - q.y) - .5));
  float thread = 1. - smoothstep(.08, .14, net);
  float tape = 1. - smoothstep(.1, .13, w);
  float bar = 1. - smoothstep(.03, .05, abs(w - .6));
  float cord = 1. - smoothstep(.06, .1, hem - w);
  float eyelet = 1. - smoothstep(.1, .14, length(vec2(fa, (w - .78)*.8)));
  float lobe = step(.62, w)*(1. - eyelet);
  float solid = max(max(tape, bar), max(cord, max(thread*step(w, .62), lobe)));
  if(solid < .5 && keep > .5) discard;
  vec3 alb = vCol*mix(.8, .86 + .14*solid + .1*cord + .08*tape, keep);
  alb *= .92 + .08*sin(a*6.2832*4.);
  gl_FragColor = vec4(roomFog(alb*verIrr(Ps, Ns)*(1. - .25*w), Ps), 1.);
}`,Ke=Q0+`
uniform vec3 uTileA, uTileB, uTileC, uTileD; uniform float uWet; uniform vec4 uShade;
vec3 ring(vec2 p, float cell, float seed){
  vec2 q = p/cell, i = floor(q), f = fract(q) - .5;
  float k = h21(i + seed);
  vec2 o = (vec2(h21(i + seed + 3.1), h21(i + seed + 7.7)) - .5)*.5;
  float ph = fract(uTime*(.35 + .3*k) + k*9.);
  vec2 d = (f - o)*cell;
  float r = length(d), rr = ph*cell*.34;
  float q1 = (r - rr)/(cell*.02);
  float w = exp(-q1*q1)*(1. - ph)*(1. - ph);
  return vec3(d/max(r, 1e-3)*w*sin((r - rr)/(cell*.012)), w);
}
void main(){
  vec3 V = normalize(cameraPosition - vWPos);
  vec3 Vs = normalize(uStageInv*V), Ps = uStageInv*(vWPos - uStagePos);
  vec2 p = vOPos.xz/240.;
  float fw = max(fwidth(p.x) + fwidth(p.y), 1e-4);
  vec2 id = floor(p), f = fract(p) - .5, c = abs(f);
  float r = length(f), a = atan(f.y, f.x + step(r, 1e-4));
  float aa = fw*1.1;
  float star = r - (.25 + .085*cos(a*8.));
  float band = abs(r - .425) - .022;
  float lobe = length(c - .5) - .21, eye = length(c - .5) - .1;
  float keep = 1. - smoothstep(.3, 1.1, fw);
  vec3 alb = uTileA;
  alb = mix(alb, uTileC, 1. - smoothstep(-aa, aa, lobe));
  alb = mix(alb, uTileA, 1. - smoothstep(-aa, aa, eye));
  alb = mix(alb, uTileB, 1. - smoothstep(-aa, aa, star));
  alb = mix(alb, uTileD, 1. - smoothstep(-aa, aa, band));
  alb = mix(alb, uTileD, (1. - smoothstep(-aa, aa, r - .07)));
  alb = mix(mix(uTileA, uTileC, .3), alb, keep);
  alb *= 1. - .4*smoothstep(.487 - aa, .5, max(c.x, c.y))*keep;
  alb *= .8 + .32*h21(id) - .2*n21(vOPos.xz*.0011);
  // water lying in broad shallow sheets
  float pud = smoothstep(.42, .68, n21(vOPos.xz*.0016 + 3.)*.65 + n21(vOPos.xz*.006)*.35);
  float wet = clamp(uWet*(.45 + .55*pud), 0., 1.);
  vec3 rg = ring(vOPos.xz, 520., 0.) + ring(vOPos.xz + 211., 330., 5.);
  vec3 N = normalize(vec3(rg.x, 0., rg.y)*.35*wet + vec3(0., 1., 0.) + vec3(n21(vOPos.xz*.02 + uTime*.1) - .5, 0., n21(vOPos.zx*.02 - uTime*.1) - .5)*.02*pud);
  float ndv = max(dot(N, Vs), 0.);
  float fr = 1. - ndv; float fr2 = fr*fr; fr = fr2*fr2*fr;
  float F = .03 + .97*fr;
  vec3 irr = verIrr(Ps, vec3(0., 1., 0.));
  // the table and its cloth stand over the middle: soft shade
  float tr = length(Ps.xz);
  float sh = 1. - .5*(1. - smoothstep(380., 1150., tr));
  // the hammock's long soft shade (uShade.xy is free for one round blob of shade)
  sh *= 1. - .55*(1. - smoothstep(150., 560., length(Ps.xz - uShade.xy)));
  sh *= 1. - .3*(1. - smoothstep(.4, 1.3, length((Ps.xz - uShade.zw)/vec2(640., 1800.))));
  vec3 col = alb*irr*sh*(1. - .35*wet);
  col += roomEnv(reflect(-Vs, N), mix(.3, .03, wet))*F*(.35 + .65*wet)*mix(1., .55, 1. - sh);
  col += uSkyCol*rg.z*.06*wet;
  gl_FragColor = vec4(roomFog(col, Ps), 1.);
}`,Re=Q0+`
uniform vec3 uGlaze, uCobalt, uPlaster, uShutter; uniform vec4 uDoors;     // door centres (x), ajar door index, ajar side
float volute(vec2 q, vec2 c, float turns, float dir){
  vec2 d = q - c; float r = max(length(d), 2e-3);
  return sin(log(r)*turns + atan(d.y, d.x + 1e-4)*dir);
}
float louvre(float y){ float sl = fract(y/88.); return mix(.34, 1., smoothstep(0., .3, sl))*(1. - .62*smoothstep(.7, 1., sl)); }
// one leaf: lx 0..1 across, y world height, top of the leaf
vec3 leaf(float lx, float y, float top){
  float st = min(lx, 1. - lx);
  float rail = min(min(y - ${K.toFixed(1)}, top - y), abs(y - 560.) + 0.)/700.;
  float field = smoothstep(.09, .11, st)*smoothstep(.1, .12, rail);
  vec3 c = uShutter*mix(.9, louvre(y), field);
  c *= .75 + .25*smoothstep(0., .03, st);
  return c;
}
void main(){
  vec3 N = normalize(vWNrm);
  if(!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vWPos);
  vec3 Ns = normalize(uStageInv*N), Vs = normalize(uStageInv*V), Ps = uStageInv*(vWPos - uStagePos);
  float id = vData.x;
  float s = id < .5 ? vOPos.x : vOPos.z, y = vOPos.y;
  vec3 alb; float gloss = 0.;
  float dq = (y - ${K.toFixed(1)})/${(Vt-K).toFixed(1)};
  float fq = max(fwidth(dq), 1e-4)*1.3;
  vec2 tc = vec2(s, y - ${K.toFixed(1)})/168.;
  float ft = max(fwidth(tc.y), 1e-4);
  if(id > 2.5){
    alb = leaf(clamp(vOPos.x/700., 0., 1.), y, 2050.);
    gloss = .25;
  } else {
    // plaster: lime wash with damp coming down from the roof and up from the floor
    float damp = n21(vec2(s/140., y/2600.))*.6 + n21(vec2(s/37., y/900.))*.4;
    alb = uPlaster*(.82 + .22*n21(vec2(s, y)*.004) - .28*smoothstep(.45, .8, damp)*smoothstep(900., 2800., y));
    alb = mix(alb, alb*vec3(.72, .8, .7), smoothstep(.55, .8, n21(vec2(s, y)*.0013 + 7.))*.5);
    // the dado
    if(dq < 1.045){
      float PW = 1680.;
      float px = fract(s/PW) - .5;
      vec2 q = vec2(abs(px)*PW/${(Vt-K).toFixed(1)}, dq);
      float ink = 0., wash = 0.;
      // rope borders top and bottom
      float bq = min(q.y, 1. - q.y);
      ink += 1. - smoothstep(.006, .006 + fq, abs(bq - .012));
      ink += 1. - smoothstep(.006, .006 + fq, abs(bq - .1));
      ink += (1. - smoothstep(.012, .012 + fq, abs(bq - .056 - .022*sin(s/168.*6.2832))))*step(bq, .1);
      wash += step(bq, .1)*.35;
      // pilaster between the panels
      float pe = .6 - q.x;
      ink += 1. - smoothstep(.005, .005 + fq, abs(pe - .05));
      ink += (1. - smoothstep(.01, .01 + fq, abs(pe - .025 - .012*sin(q.y*60.))))*step(pe, .05);
      wash += step(pe, .05)*.5;
      // the cartouche and its scrolls
      vec2 b = abs(q - vec2(0., .5)) - vec2(.44, .30);
      float box = length(max(b, 0.)) + min(max(b.x, b.y), 0.) - .035 + .012*sin(q.y*38.)*sin(q.x*38.);
      float inside = step(pe, .05) < .5 && bq > .1 ? 1. : 0.;
      ink += (1. - smoothstep(.007, .007 + fq, abs(box)))*inside;
      ink += (1. - smoothstep(.004, .004 + fq, abs(box + .03)))*inside;
      float inC = step(box, -.03)*inside;
      float v1 = volute(q, vec2(.23, .5), 7., 1.), v2 = volute(q, vec2(.36, .66), 6., -1.), v3 = volute(q, vec2(.36, .34), 6., 1.), v4 = volute(q, vec2(.1, .68), 5., 1.), v5 = volute(q, vec2(.1, .32), 5., -1.);
      float d1 = length(q - vec2(.23, .5)), d2 = length(q - vec2(.36, .66)), d3 = length(q - vec2(.36, .34)), d4 = length(q - vec2(.1, .68)), d5 = length(q - vec2(.1, .32));
      float sw = .32 + fq*18.;
      float sc = (1. - smoothstep(.0, sw, abs(v1)))*(1. - smoothstep(.1, .13, d1)) + (1. - smoothstep(.0, sw, abs(v2)))*(1. - smoothstep(.065, .085, d2))
        + (1. - smoothstep(.0, sw, abs(v3)))*(1. - smoothstep(.065, .085, d3)) + (1. - smoothstep(.0, sw, abs(v4)))*(1. - smoothstep(.06, .08, d4)) + (1. - smoothstep(.0, sw, abs(v5)))*(1. - smoothstep(.06, .08, d5));
      ink += sc*inC*(1. - smoothstep(.004, .02, fq));
      // a flower in the middle of each panel
      vec2 fc = q - vec2(0., .5); float fr0 = length(fc), fa = atan(fc.y, fc.x + 1e-4);
      float fl = fr0 - .055*(1. + .35*cos(fa*6.));
      ink += (1. - smoothstep(0., fq, fl))*inC;
      wash += inC*(.18 + .3*smoothstep(.4, .7, n21(q*9. + floor(s/PW)*3.)));
      ink = clamp(ink, 0., 1.);
      vec2 ti = floor(tc), tf = abs(fract(tc) - .5);
      float grout = smoothstep(.5 - ft - .012, .5, max(tf.x, tf.y))*(1. - smoothstep(.2, .7, ft));
      vec3 tile = uGlaze*(.9 + .14*h21(ti));
      tile = mix(tile, mix(uGlaze, uCobalt, .45), clamp(wash, 0., 1.)*.6);
      tile = mix(tile, uCobalt*(.8 + .4*h21(ti + 3.)), ink*.92);
      tile *= 1. - .45*grout;
      float mould = step(1., dq);                                   // the moulded cap
      alb = mix(tile, mix(uCobalt*.7, uGlaze, step(.5, fract(dq*44.))), mould);
      gloss = .55*(1. - mould*.5);
      alb *= mix(.55, 1., smoothstep(0., .07, dq));                  // splash-back grime at the floor
    }
    if(id > .5){
      float up = smoothstep(${Vt.toFixed(1)}, ${(Vt+500).toFixed(1)}, y);
      float raf = smoothstep(.5, .92, sin((y + s*.5)/150.)*.5 + .5);
      alb *= 1. - .2*raf*up*smoothstep(600., 2600., y);
      float blot = smoothstep(.42, .7, n21(vec2(s/900., y/1300.) + 11.)*.7 + n21(vec2(s/260., y/420.) + 3.)*.3);
      alb = mix(alb, alb*vec3(.7, .78, .68), blot*.75*up);
    }
    if(id < .5){
      // two tall louvred doors with stone casings and a fanlight
      float dA = abs(s - uDoors.x), dB = abs(s - uDoors.y);
      float dd = min(dA, dB), which = dA < dB ? 0. : 1.;
      float sx = which < .5 ? s - uDoors.x : s - uDoors.y;
      float arch = length(vec2(sx, max(y - 2050., 0.)));
      float inDoor = step(dd, 720.)*step(arch, 720.)*step(y, 2800.);
      float casing = step(arch, 860.)*step(dd, 860.)*(1. - inDoor)*step(y, 2950.);
      alb = mix(alb, uPlaster*vec3(1.08, 1.05, .98)*(.85 + .15*step(.5, fract(arch/70.))), casing);
      gloss *= 1. - casing;
      if(inDoor > .5){
        gloss = .22;
        if(y > 2050.){
          float fa2 = atan(y - 2050., sx + 1e-3);
          alb = uShutter*(.55 + .45*step(.5, fract(arch/95.)))*(.6 + .4*step(.12, abs(fract(fa2/.5236) - .5)));
        } else {
          float side = step(0., sx);
          float lx = side > .5 ? sx/720. : 1. + sx/720.;
          alb = leaf(clamp(lx, 0., 1.), y, 2050.);
          alb *= .6 + .4*smoothstep(0., 14., abs(sx));
          float ajar = step(abs(which - uDoors.z), .5)*step(abs(side - uDoors.w), .5);
          alb = mix(alb, vec3(.012, .016, .016) + uShutter*.05*smoothstep(1400., -900., y), ajar);
          gloss *= 1. - ajar;
        }
      }
    } else {
      // a shuttered window in each end wall
      float wx = abs(s - 150.), wy = y - 1050.;
      float inW = step(wx, 620.)*step(abs(wy), 820.);
      float cas = step(wx, 730.)*step(abs(wy), 930.)*(1. - inW);
      alb = mix(alb, uPlaster*1.05, cas);
      if(inW > .5){
        float lx = fract((s - 150.)/620.*.5 + .5 + .5);
        float st = min(lx, 1. - lx);
        alb = uShutter*mix(.85, louvre(y), smoothstep(.08, .1, st)*step(abs(wy), 740.));
        gloss = .22;
      }
      gloss *= 1. - cas;
    }
  }
  float ndv = max(dot(Ns, Vs), 0.);
  float fr = 1. - ndv; float fr2 = fr*fr; fr = fr2*fr2*fr;
  vec3 col = alb*verIrr(Ps, Ns);
  col += roomEnv(reflect(-Vs, Ns), .12)*(.04 + .96*fr)*gloss;
  // the end walls run from the bright opening back into the dim of the room; the corners and the top of every
  // wall, under the roof, sink further
  float zf = smoothstep(${X.toFixed(1)}, ${l0.toFixed(1)}, Ps.z);
  float fall = (id > .5 && id < 2.5) ? mix(.46, 1.32, zf*zf) : 1.;
  float corner = id < .5 ? smoothstep(0., 1000., min(Ps.x - ${h0.toFixed(1)}, ${d0.toFixed(1)} - Ps.x)) : smoothstep(0., 1000., Ps.z - ${X.toFixed(1)});
  fall *= mix(.58, 1., corner)*mix(1., .7, smoothstep(1500., 2900., Ps.y));
  col *= id > 2.5 ? 1. : fall;
  gl_FragColor = vec4(roomFog(col, Ps), 1.);
}`,Xe=Q0+`
uniform vec3 uClay;
void main(){
  vec3 N = normalize(vWNrm);
  if(!gl_FrontFacing) N = -N;
  vec3 Ns = normalize(uStageInv*N), Ps = uStageInv*(vWPos - uStagePos);
  vec2 p = vec2(vOPos.x/118., vOPos.z/230.);
  float fw = max(fwidth(p.x) + fwidth(p.y), 1e-4), keep = 1. - smoothstep(.3, 1.2, fw);
  float tr = abs(fract(p.x) - .5)*2.;
  float row = fract(p.y);
  float shade = (.5 + .5*tr*tr)*(.62 + .38*smoothstep(0., .14, row));
  vec3 alb = uClay*(.72 + .5*h21(floor(p)))*mix(.72, shade, keep);
  alb = mix(alb, vec3(.03, .022, .018), (1. - smoothstep(.05, .07, abs(fract(vOPos.z/460.) - .5)))*.9);
  alb *= .75 + .4*n21(vOPos.xz*.002);
  gl_FragColor = vec4(roomFog(alb*verIrr(Ps, Ns), Ps), 1.);
}`,je=`
varying vec3 vOPos;
void main(){ vOPos = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.); }`,Ze=`
varying vec3 vOPos;
${Rt}
uniform vec3 uCloudLo, uCloudHi, uHaze, uBay, uSunGlow; uniform float uRiftGain, uBolt;
void main(){
  vec3 d = normalize(vOPos - vec3(0., 300., 0.));
  float e = d.y, hl = max(length(d.xz), 1e-4), az = d.x/hl;
  float t = uTime*.012;
  float n1 = n21(vec2(az*2.2 + t, e*5.)), n2 = n21(vec2(az*5.3 - t*1.7, e*13. + 4.)), n3 = n21(vec2(az*12.1 + t*2.3, e*31. + 9.));
  float cl = n1*.55 + n2*.3 + n3*.15;
  // stacked decks of cloud: each one dark under its belly and paler along its top
  float deck = fract(e*5.2 + cl*1.3);
  float shelf = smoothstep(0., .75, deck)*(1. - smoothstep(.9, 1., deck));
  vec3 sky = mix(uCloudLo, uCloudHi, clamp(cl*1.1 - .32 + .55*shelf, 0., 1.));
  sky = mix(sky, uCloudLo*.8, smoothstep(.3, .9, e));
  float de = e - .09;
  float rift = exp(-de*de/.0035)*exp(-az*az/.2)*(.7 + .6*n2);
  float seam = exp(-az*az/(.012 + .06*e*e))*smoothstep(.04, .16, e)*(1. - smoothstep(.3, .62, e))*(.45 + .9*n2);
  sky += uRiftCol*(rift + seam*.38)*uRiftGain;
  float sd = max(dot(d, uKeyDir), 0.), sd2 = sd*sd, sd8 = sd2*sd2; sd8 *= sd8;
  sky += uSunGlow*(sd8*sd8*sd8*sd8*2.2 + sd8*.3)*(.6 + .6*cl);
  float sh = smoothstep(.5, .8, n11(az*7. + e*3.5 - uTime*.02))*(1. - smoothstep(.05, .3, e))*smoothstep(-.03, .03, e);
  sky = mix(sky, uCloudLo*.85 + uHaze*.15, sh*.5);
  // lightning: the cloud lit from inside round one place, and a forked stroke standing in it
  vec2 lp = vec2(az + .05, e - .27);
  float lg = exp(-dot(lp, lp)/.045)*(.35 + 1.3*cl) + rift*1.5 + .12;
  float bx = az + .05 - (n11(e*23.) - .5)*.1 - (n11(e*71. + 3.) - .5)*.03;
  float bx2 = bx + (e - .2)*.55 + (n11(e*47. + 9.) - .5)*.04;
  float bolt = (1. - smoothstep(.0022, .006, abs(bx)))*smoothstep(.03, .07, e)*(1. - smoothstep(.37, .43, e))
    + .6*(1. - smoothstep(.0018, .005, abs(bx2)))*smoothstep(.07, .1, e)*(1. - smoothstep(.19, .2, e));
  sky += vec3(.82, .88, 1.)*uBolt*(lg*2.6 + bolt*16.);
  vec3 col = mix(sky, uHaze, (1. - smoothstep(.0, .2, e))*.42);
  float shore = .022 + .012*n11(az*9. + 2.) + .006*n11(az*31.);
  float land = (1. - smoothstep(shore - .003, shore + .003, e));
  col = mix(col, mix(uHaze, uGardenCol, .3), land*.8);
  float bay = 1. - smoothstep(.006, .011, e);
  col = mix(col, uBay*(.82 + .36*n21(vec2(az*30. + uTime*.15, e*700.))) + uRiftCol*uRiftGain*.12*exp(-az*az/.1), bay);
  float gm = 1. - smoothstep(-.05, -.03 + .012*n11(az*23.), e);
  col = mix(col, mix(uGardenCol, uHaze, .45)*(.8 + .4*n21(vec2(az*40., e*60.))), gm);
  gl_FragColor = vec4(col*(1. + uBolt*.5), 1.);
}`,Je=`
attribute vec4 aData;
varying vec3 vCol, vP; varying float vHaze;
uniform float uTimeV, uWind;
void main(){
  vCol = color; vHaze = aData.z; vP = position;
  vec3 p = position;
  float w = aData.x*uWind, ph = aData.y;
  float gust = sin(uTimeV*.9 + ph)*.6 + sin(uTimeV*2.3 + ph*1.7)*.3 + sin(uTimeV*5.3 + ph*2.9)*.2*aData.w;
  p.x += w*(.55 + gust);
  p.y -= w*.3*(.6 + .4*gust) - w*.25*aData.w*sin(uTimeV*7.1 + ph*4.3);
  gl_Position = projectionMatrix*modelViewMatrix*vec4(p, 1.);
}`,Qe=`
varying vec3 vCol, vP; varying float vHaze;
uniform vec3 uHazeP, uSkyCol; uniform float uFlash, uPlantGain, uHazeK;
void main(){
  // lit from the sky above, dark where the leaves hang into their own shade; veins and leaflets as fine ribbing
  float top = .62 + .6*smoothstep(-900., 2700., vP.y);
  float vein = .92 + .08*sin((vP.y*.9 + vP.x*.5)*.085) + .1*sin((vP.y*.35 - vP.x*.8)*.031);
  vec3 c = vCol*(uSkyCol*.9 + .08)*uPlantGain*top*vein;
  c = mix(c, uHazeP, clamp(vHaze*uHazeK, 0., 1.));
  gl_FragColor = vec4(c*(1. + uFlash*.4), 1.);
}`,to=Q0+`
uniform float uRain; uniform vec3 uRainCol;
void main(){
  float x = vOPos.x, y = vOPos.y, lay = vData.x;
  float cx = x/mix(30., 46., lay);
  float keep = 1. - smoothstep(.22, .7, fwidth(cx));
  float ci = floor(cx), cf = fract(cx) - .5;
  float k = h11(ci*1.37 + lay*31.);
  float strand = 1. - smoothstep(.1, .4, abs(cf + (k - .5)*.4));
  float fall = y/mix(560., 900., lay) + uTime*mix(2.4, 1.1, lay)*(.7 + .6*k) + k*17.;
  float beadn = n11(fall*6.)*.6 + n11(fall*19. + 3.)*.4;
  float on = step(1. - uRain*.62, k);
  float a = mix(.16*uRain, strand*smoothstep(.3, .75, beadn)*on, keep);
  float gust = .55 + .45*sin(x*.0021 + uTime*.7 + sin(x*.0007 - uTime*.4)*2.);
  a = a*gust + .07*uRain*gust*n21(vec2(x/120., fall*1.5));
  a *= (1. - smoothstep(${(o0-80).toFixed(1)}, ${(o0+60).toFixed(1)}, y))*mix(1., .4, lay);
  vec3 c = uRainCol*a*(1. + uFlash*4.);
  gl_FragColor = vec4(mix(c, fogCol()*a*.4, fxFog()*.75), a*.4);
}`,ao=`
attribute vec4 aSeed;
uniform mat3 uStageInv; uniform vec3 uStagePos, uBox, uVel; uniform float uTimeV, uLen, uWid;
varying float vA; varying vec2 vUv;
void main(){
  vec3 vel = uVel*(.75 + .5*aSeed.w);
  vec3 camS = uStageInv*(cameraPosition - uStagePos);
  vec3 c = mod(aSeed.xyz*uBox + vel*uTimeV - camS + uBox*.5, uBox) - uBox*.5;
  vec4 wp = modelMatrix*vec4(camS + c, 1.);
  vec3 dir = normalize(mat3(modelMatrix)*vel);
  vec3 toCam = cameraPosition - wp.xyz;
  float dist = max(length(toCam), 1e-3);
  vec3 side = normalize(cross(dir, toCam/dist) + vec3(1e-4, 0., 0.));
  float w0 = uWid*(.6 + .8*aSeed.w), wid = max(w0, dist*.0017);
  vec3 p = wp.xyz + dir*position.y*uLen*(.6 + .8*fract(aSeed.w*7.13)) + side*position.x*wid;
  vec3 e = abs(c)/uBox;
  float open = mix(.22, 1., smoothstep(-900., 1900., camS.z + c.z));      // spray thins away from the open side
  vA = open*smoothstep(20., 80., dist)*(1. - smoothstep(.36, .5, max(e.x, max(e.y, e.z))))*min(1., w0/wid*1.6);
  vUv = vec2(position.x*2., position.y + .5);
  gl_Position = projectionMatrix*viewMatrix*vec4(p, 1.);
}`,Ua=`
varying float vA; varying vec2 vUv;
uniform vec3 uRainCol; uniform float uGain, uFlash;
void main(){
  float a = (1. - vUv.x*vUv.x)*sin(clamp(vUv.y, 0., 1.)*3.14159)*vA*uGain;
  gl_FragColor = vec4(uRainCol*a*(1. + uFlash*4.), a*.25);
}`,eo=`
attribute vec4 aBase, aMove, aMisc;
uniform float uTimeV;
varying float vA, vSeed, vTint; varying vec2 vUv;
${Xt}
void main(){
  float ph = fract(uTimeV*aMisc.y + aMove.w);
  vec3 c = aBase.xyz + aMove.xyz*ph;
  c.x += sin(uTimeV*.7 + aMove.w*20.)*aBase.w*.12;
  c.z += sin(uTimeV*.53 + aMove.w*33.)*aBase.w*.1;
  float size = aBase.w*(1. + aMisc.z*ph);
  vec4 mvPosition = viewMatrix*(modelMatrix*vec4(c, 1.));
  float dist = -mvPosition.z;
  mvPosition.xy += position.xy*size;
  vA = aMisc.x*smoothstep(0., .2, ph)*(1. - smoothstep(.55, 1., ph))*smoothstep(size*.3, size*1.2, dist);
  // the mist at the horn's mouth (tint 2) is for the far view: it clears as the camera comes up to the rim
  vA *= mix(1., smoothstep(size*1.6, size*4.5, dist), step(1.5, aMisc.w));
  vUv = position.xy*2.; vSeed = aMove.w; vTint = aMisc.w;
  gl_Position = projectionMatrix*mvPosition;
  ${jt}
}`,oo=`
varying float vA, vSeed, vTint; varying vec2 vUv;
uniform vec3 uPuffA, uPuffB, uPuffC; uniform float uTime, uFlash, uPuffGain;
float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx)*.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y)*p3.z); }
float n21(vec2 x){ vec2 i = floor(x), f = fract(x); f = f*f*(3.-2.*f);
  return mix(mix(h21(i), h21(i+vec2(1.,0.)), f.x), mix(h21(i+vec2(0.,1.)), h21(i+vec2(1.,1.)), f.x), f.y); }
${Zt}
void main(){
  float r = length(vUv);
  float n = n21(vUv*1.7 + vSeed*40. + uTime*.06)*.65 + n21(vUv*4.1 - vSeed*17. - uTime*.11)*.35;
  float a = (1. - smoothstep(.15, 1., r + (n - .5)*.7))*vA*uPuffGain;
  vec3 c = mix(mix(mix(uPuffA, uPuffB, min(vTint, 1.)), uPuffC, clamp(vTint - 1., 0., 1.)), fogCol(), fxFog()*.6);
  gl_FragColor = vec4(c*a*(1. + uFlash*2.), a);
}`,so=`
attribute vec4 aSplash;
uniform float uTimeV, uSize;
varying float vPh; varying vec2 vUv;
float hh(float n){ return fract(sin(n)*43758.5453); }
void main(){
  float k = aSplash.w, per = 1.1 + 1.7*fract(k*7.3);
  float tt = uTimeV/per + k*13.;
  float ph = fract(tt), cyc = floor(tt);
  vec2 j = (vec2(hh(cyc + k*91.), hh(cyc*1.7 + k*37.)) - .5)*24.;
  float R = uSize*(.25 + 1.1*sqrt(ph))*(.6 + .8*fract(k*3.1));
  vec3 p = aSplash.xyz + vec3(j.x, 0., j.y) + vec3(position.x, 0., position.z)*R;
  vPh = ph; vUv = position.xz;
  gl_Position = projectionMatrix*modelViewMatrix*vec4(p, 1.);
}`,no=`
varying float vPh; varying vec2 vUv;
uniform vec3 uRainCol; uniform float uGain, uFlash;
void main(){
  float r = length(vUv), a0 = atan(vUv.y, vUv.x + 1e-4);
  float q = (r - .78)/.1, k = 1. - vPh;
  float ring = exp(-q*q)*k*k*(.7 + .3*sin(a0*11.));
  float core = exp(-r*r*30.)*(1. - smoothstep(0., .25, vPh));
  gl_FragColor = vec4(uRainCol*(ring + core)*uGain*(1. + uFlash*4.), 1.);
}`,io=`
attribute vec4 aFly;
uniform float uTimeV, uFlyK;
varying float vB; varying vec2 vUv;
void main(){
  float s = aFly.w;
  vec3 c = aFly.xyz + vec3(sin(uTimeV*.31 + s*40.)*150., sin(uTimeV*.47 + s*17.)*70., cos(uTimeV*.39 + s*29.)*150.);
  float b = max(sin(uTimeV*(.7 + s) + s*50.), 0.); vB = b*b*(.55 + .45*b);
  vec4 mv = viewMatrix*(modelMatrix*vec4(c, 1.));
  float size = max(34., -mv.z*.034)*uFlyK;
  mv.xy += position.xy*size;
  vUv = position.xy*2.;
  gl_Position = projectionMatrix*mv;
}`,ro=`
varying float vB; varying vec2 vUv;
uniform vec3 uFlyCol; uniform float uFlyK;
void main(){
  float r2 = dot(vUv, vUv);
  gl_FragColor = vec4(uFlyCol*(exp(-r2*4.)*.34 + exp(-r2*18.)*1.7*uFlyK)*vB*(1. - smoothstep(.6, 1., r2)), 1.);
}`,lo=`
attribute vec4 aSeed;
uniform vec3 uThroat, uHornAxis, uHX, uHY; uniform float uTimeV, uAx0, uAx1, uStream;
varying float vA; varying vec2 vUv;
float bore(float ax){ float t = clamp(ax/220.4, 0., 1.); return 9. + 116.*(.2*t + .8*pow(t, 3.1)); }
vec3 at(float ax, float an, float fr){ return uThroat + uHornAxis*ax + bore(ax)*fr*(cos(an)*uHX + sin(an)*uHY); }
void main(){
  float k = aSeed.w;
  float ph = fract(aSeed.z + uTimeV*(.34 + .26*k));                 // 0 out before the mouth .. 1 at the collar
  float ax = mix(uAx1, uAx0, ph), fr = .14 + .62*aSeed.y;
  float an = aSeed.x*6.2831853 + ph*(1.2 + 1.6*k);
  vec3 c0 = at(ax, an, fr), c1 = at(ax - 5., an + .03*(1.2 + 1.6*k), fr);
  vec4 wp = modelMatrix*vec4(c0, 1.);
  vec3 dir = normalize(mat3(modelMatrix)*(c1 - c0));
  vec3 toCam = cameraPosition - wp.xyz;
  float dist = max(length(toCam), 1e-3);
  vec3 side = normalize(cross(dir, toCam/dist) + vec3(1e-4, 0., 0.));
  float w0 = .22 + .3*k, wid = max(w0, dist*.0019);
  vec3 p = wp.xyz + dir*position.y*(5. + 9.*fract(k*7.13)) + side*position.x*wid;
  vA = uStream*smoothstep(0., .1, ph)*(1. - smoothstep(.95, 1., ph))*smoothstep(5., 26., dist)*min(1., w0/wid*2.2)*(.3 + 1.1*ph*ph);
  vUv = vec2(position.x*2., position.y + .5);
  gl_Position = projectionMatrix*viewMatrix*vec4(p, 1.);
}`,co=`
varying vec3 vWPos, vWNrm, vCol, vOPos; varying vec4 vData;
uniform vec3 uMistCol; uniform float uTime, uFlash, uMistGain, uThin;
float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx)*.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y)*p3.z); }
float n21(vec2 x){ vec2 i = floor(x), f = fract(x); f = f*f*(3.-2.*f);
  return mix(mix(h21(i), h21(i+vec2(1.,0.)), f.x), mix(h21(i+vec2(0.,1.)), h21(i+vec2(1.,1.)), f.x), f.y); }
void main(){
  float s = vData.y, a = vData.x*6.2831853;
  float t1 = sin(a*3. + s*16. + uTime*.5), t2 = sin(a*2. - s*11. - uTime*.35 + 2.);
  float thr = mix(smoothstep(.7, 1., t1)*.7 + smoothstep(.8, 1., t2)*.5, pow(max(t1, 0.), 36.)*.8 + pow(max(t2, 0.), 48.)*.6, uThin);
  float n = n21(vec2(sin(a)*2.2 + s*9., cos(a)*2.2 - uTime*.2));
  // by day the threads live deep in the bore and only at a distance, where they stay thin on screen
  float fade = mix(smoothstep(.16, .5, s)*(1. - smoothstep(.8, 1.02, s)), smoothstep(.16, .36, s)*(1. - smoothstep(.5, .8, s)), uThin);
  float dist = length(cameraPosition - vWPos);
  float al = thr*(.35 + .65*n)*fade*mix(smoothstep(8., 45., dist), smoothstep(35., 130., dist), uThin)*uMistGain;
  gl_FragColor = vec4(uMistCol*al*(1. + uFlash*2.), 1.);
}`,ho=`
varying vec3 vWPos, vWNrm, vCol, vOPos; varying vec4 vData;
uniform vec3 uWingCol; uniform float uTime, uFlash;
float gs(float x){ return exp(-x*x); }
void main(){
  float r = vData.x, an = vData.y;
  float tipR = .98 - .2*an*an;
  float shape = smoothstep(0., .08, r)*(1. - smoothstep(tipR - .12, tipR, r))*(1. - smoothstep(.78, 1., abs(an)));
  // the blur: feather tips smeared into fine arcs, brightest along the rim of the fan and where the wing turns
  float arcs = .75 + .25*sin(r*46.);
  float rimArc = gs((r - tipR + .15)/.07), ends = gs((abs(an) - .8)/.15);
  float veil = shape*(.2*arcs + .22*rimArc + .16*ends);
  // ghosts of the wing itself, dark and tapered, caught two or three times in the beat
  float bw = .05 + .1*sin(3.14159*clamp(r*1.05, 0., 1.));
  float b1 = 1. - smoothstep(bw*.55, bw, abs(an - .78*sin(uTime*38.)));
  float b2 = 1. - smoothstep(bw*.55, bw, abs(an + .78*sin(uTime*38. + 1.9)));
  float b3 = 1. - smoothstep(bw*.55, bw, abs(an - .9*sin(uTime*61. + .7)));
  float blade = shape*clamp(.5*b1 + .38*b2 + .26*b3, 0., .75);
  vec3 dark = vec3(.03, .05, .12)*(.5 + uWingCol.b);
  gl_FragColor = vec4((uWingCol*vCol*veil + dark*blade)*(1. + uFlash*2.), clamp(veil*.9 + blade, 0., .9));
}`,fo=`
attribute vec4 aData;
uniform float uCor;
varying vec3 vWPos, vWNrm; varying float vA;
${Xt}
void main(){
  float a = aData.x, v = aData.y, kind = aData.z, sd = aData.w, c = uCor;
  vec3 rad = vec3(cos(a), 0., sin(a));
  float R = 3. + 10.*sqrt(c);
  float rise = sin(3.14159*clamp(c*1.3, 0., 1.));
  vec3 p, n; float al;
  if(kind < .5){
    float spike = .5 + .5*cos(a*11.); spike = spike*(.4 + .6*spike);
    float h = 11.5*rise*(.62 + .38*spike*smoothstep(.4, 1., v));
    p = rad*(R + .55*h*v*v) + vec3(0., h*v, 0.);
    n = normalize(rad + vec3(0., .9*v - .45, 0.));
    al = sqrt(max(rise, 0.))*(.22 + .78*v*v);
  } else if(kind < 1.5){
    float tt = clamp((c - .1)/.9, 0., 1.), sp = .7 + .6*sd;
    float y = 34.*sp*tt - 38.*tt*tt;
    float sz = (.7 + .9*sd)*smoothstep(0., .08, tt)*step(0., y);
    p = rad*(R*.9 + 16.*tt*sp) + vec3(0., y + 1., 0.) + position*sz;
    n = position;
    al = 1.;
  } else if(kind < 2.5){
    float rr = 4. + 30.*c + (v - .5)*(2.6 + 3.5*c);
    p = rad*rr + vec3(0., .12, 0.);
    n = normalize(vec3(rad.x*(v - .5)*1.6, 1., rad.z*(v - .5)*1.6));
    al = (1. - c)*(1. - c)*(1. - abs(v*2. - 1.))*1.4;
  } else {
    float g = smoothstep(.3, .75, c);
    p = position*vec3(2.7, 1.7, 2.7)*g;
    n = normalize(position + vec3(0., .2, 0.));
    al = g;
  }
  vA = al;
  vec4 wp = modelMatrix*vec4(p, 1.);
  vWPos = wp.xyz; vWNrm = mat3(modelMatrix)*n;
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  ${jt}
}`,uo=`
varying vec3 vWPos, vWNrm; varying float vA;
${Rt}
${Zt}
void main(){
  vec3 N = normalize(vWNrm + vec3(0., 1e-4, 0.));
  if(!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vWPos);
  vec3 Ns = normalize(uStageInv*N), Vs = normalize(uStageInv*V);
  float ndv = max(dot(Ns, Vs), 0.);
  float fr = 1. - ndv; fr = fr*fr*(.35 + .65*fr);
  // water: it mirrors the opening on its glancing edges and gathers one hard glint of the sky
  vec3 env = roomEnv(reflect(-Vs, Ns), .05);
  vec3 Lk = normalize(vec3(uKeyDir.x*.5, .35, max(uKeyDir.z, .2) + .6));
  float sp = max(dot(Ns, normalize(Lk + Vs)), 0.); sp *= sp; sp *= sp; sp *= sp; sp *= sp; sp *= sp;
  vec3 col = env*(.2 + .8*fr) + uSkyCol*.03 + (uSkyCol + uRiftCol*.4)*sp*2.6;
  float a = clamp(vA*(.13 + .75*fr + sp), 0., .9);
  gl_FragColor = vec4(mix(col, fogCol(), fxFog())*a*(1. + uFlash*3.), a);
}`;function J(t,n,l){t.deleteAttribute("uv");const g=t.attributes.position,x=g.count,D=new Float32Array(x*3),N=new Float32Array(x*4),y=[0,0,0,0];for(let r=0;r<x;r++){const e=g.getX(r),i=g.getY(r),b=g.getZ(r),d=typeof n=="function"?n(e,i,b):n;D[r*3]=d[0],D[r*3+1]=d[1],D[r*3+2]=d[2],typeof l=="function"?(y[0]=y[1]=y[2]=y[3]=0,l(e,i,b,y),N.set(y,r*4)):l&&N.set(l,r*4)}return t.setAttribute("color",new u.BufferAttribute(D,3)),t.setAttribute("aData",new u.BufferAttribute(N,4)),t}const ft=(t,n,l,g,x,D,N,y)=>J(new u.BoxGeometry(t,n,l).translate(g,x,D),N,y);function ut(t,n){return r0(1,t,!1,(l,g,x)=>n(g,l,x))}function pt(t,n,l,g,x=!1,D=null){const N=new u.InstancedBufferGeometry,y=x?[-1,0,-1,1,0,-1,1,0,1,-1,0,1]:[-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0];N.setAttribute("position",new u.Float32BufferAttribute(y,3)),N.setIndex(x?[0,2,1,0,3,2]:[0,1,2,0,2,3]);const r=Array.isArray(n)?n:[n],e=r.map(()=>new Float32Array(t*l)),i=r.map(()=>new Float32Array(l));for(let b=0;b<t;b++){g(b,...i);for(let d=0;d<r.length;d++)e[d].set(i[d],b*l)}for(let b=0;b<r.length;b++)N.setAttribute(r[b],new u.InstancedBufferAttribute(e[b],l));return N.instanceCount=t,D&&D(N),N}const $a=[-3300,-1300,700,2700];async function po(t){const n=[],l=t.noise,g=(S=1)=>(W,C,A)=>q(t.lime,S*(.86+.2*l.n3(W*.004,C*.004,A*.004))),x=(S=1)=>(W,C,A)=>q(t.darkWood,S*(.8+.4*l.n3(W*.003,C*.01,A*.003))),D=[.035,.04,.045],N=l0-100,r=e0([[0,220],[62,220],[62,172],[40,150],[34,96],[46,20],[78,-150],[92,-300],[80,-430],[48,-540],[36,-600],[52,-640],[70,-662],[70,-780],[0,-780]],{seg:10,color:(S,W,C)=>q(t.lime,.8+.25*Math.sin(W*2+C*.01)*.3+.1),data:(S,W,C,A)=>{A[0]=.25,A[1]=.35*(1-T(-780,-500,C))+.25*T(120,220,C),A[3]=1}});await t.tick();for(let S=h0+95;S<d0;S+=190){if($a.some(C=>Math.abs(C-S)<150))continue;const W=r.clone();W.rotateY(S*.37),W.translate(S,0,N),n.push(W)}r.dispose(),await t.tick();const e=d0-h0,i=(h0+d0)/2,b=(S,W,C,A)=>{A[0]=.3,A[1]=.3*(1-T(K,K+160,W)),A[3]=1};n.push(ft(e,120,260,i,K+60,N,g(.9),b)),n.push(ft(e,36,210,i,206,N,g(.85),[.3,.25,0,1])),n.push(ft(e,80,290,i,F0-40,N,g(1.05),[.45,0,0,1])),await t.tick();const d=[[0,o0],[150,o0],[165,o0-30],[165,o0-110],[128,o0-150],[112,o0-190],[112,F0+240],[128,F0+200],[150,F0+170],[150,K+10],[0,K+10]];for(const S of $a)n.push(e0(d,{seg:16,sq:9,color:(W,C,A)=>q(t.lime,.85+.12*l.n2(C*2,A*.004)-.2*T(o0-500,o0,A)),data:[.25,0,0,1]}).translate(S,0,N));n.push(ft(e+200,170,300,i,o0+85,N,x(1.3),[.15,.2,0,0])),n.push(ft(e+200,190,40,i,o0+10,l0+130,x(1.6),[.2,0,0,0])),await t.tick();const m=Math.atan2(A0-(o0+30),l0+200-X),v=Math.hypot(A0-o0-30,l0+200-X);for(let S=h0+150;S<d0;S+=420){const W=new u.BoxGeometry(76,140,v);W.rotateX(m),W.translate(S,(A0+o0+30)/2-85,(X+l0+200)/2),n.push(J(W,x(1),[.1,.15,0,0]))}await t.tick(),n.push(e0([[0,-16],[330,-16],[300,-60],[150,-110],[95,-200],[120,-330],[170,-420],[120,-520],[85,-640],[120,-760],[260,-830],[300,-900],[0,-900]],{seg:24,color:(S,W,C)=>q(t.darkWood,1.5+.5*l.n2(W*3,C*.02)),data:(S,W,C,A)=>{A[0]=.4,A[1]=.5*T(-300,-20,C)}}));for(const S of t.fernX)n.push(e0([[0,250],[140,250],[172,262],[176,240],[160,222],[128,30],[138,0],[0,0]],{seg:16,color:(W,C,A)=>q(t.clay,.8+.3*l.n2(C*2+S,A*.02)),data:[.2,0,0,0]}).translate(S,F0,N));await t.tick();const s=t.cage,h=t.cageK,f=125*h,p=s.y-120*h,c=s.y+120*h,M=c+128*h,F=M+70,P=(S=1)=>[.6*S,.62*S,.6*S],w=[.55,.15,0,0],k=t.cageSide;{const S=A0-(s.z-X)*Math.tan(m)-150,W=Math.round((S-F)/44);n.push(e0([[0,0],[46,0],[52,-14],[30,-30],[12,-44],[0,-46]],{seg:10,color:()=>q(D,1.5),data:[.5,0,0,0]}).translate(s.x,S+6,s.z));for(let C=0;C<W;C++){const A=new u.TorusGeometry(15,4.6,5,10).scale(.62,1.5,1);A.rotateY(C%2?Math.PI/2:0),A.translate(s.x,F+12+(C+.5)*((S-F-50)/W),s.z),n.push(J(A,q(D,1.5+.5*(C%2)),[.6,0,0,0])),(C&7)===7&&await t.tick()}await t.tick()}for(let S=0;S<20;S++){const W=S/20*c0,C=Math.cos(W),A=Math.sin(W);n.push(T0([[s.x+C*f,p,s.z+A*f],[s.x+C*f,c,s.z+A*f],[s.x+C*f*.84,c+74*h,s.z+A*f*.84],[s.x+C*f*.45,c+116*h,s.z+A*f*.45],[s.x,M,s.z]],()=>6.2,{along:10,around:5,color:()=>P(.9+.2*(S%2)),data:w})),S%5===4&&await t.tick()}await t.tick();for(const[S,W,C]of[[p,f,12],[s.y-40*h,f,6.5],[s.y+44*h,f,6.5],[c,f,10],[c+74*h,f*.84,6]])n.push(J(new u.TorusGeometry(W,C,6,32).rotateX(Math.PI/2).translate(s.x,S,s.z),P(1),w));await t.tick(),n.push(e0([[0,p+6],[f-6,p+6],[f+6,p+14],[f+16,p],[f+12,p-26],[f*.5,p-40],[0,p-44]],{seg:24,color:S=>S<.2?[.3,.27,.2]:P(.8),data:[.4,.2,0,0]}).translate(s.x,0,s.z)),n.push(e0([[0,F],[9,F-6],[15,F-30],[9,M+10],[22,M+2],[26,M-14],[0,M-20]],{seg:10,color:()=>P(.9),data:w}).translate(s.x,0,s.z)),await t.tick(),n.push(T0([[s.x-k.x*f,s.y-50*h,s.z-k.z*f],[s.x,s.y-50*h,s.z],[s.x+k.x*f,s.y-50*h,s.z+k.z*f]],()=>9,{along:2,around:7,color:()=>q(t.darkWood,3.2),data:[.1,0,0,0]})),n.push(T0([[s.x-52,c+100*h,s.z+30],[s.x-56,c+6*h,s.z+30],[s.x,c-6*h,s.z+30],[s.x+56,c+6*h,s.z+30],[s.x+52,c+100*h,s.z+30]],()=>4.5,{along:14,around:5,color:()=>P(.8),data:w}));for(const[S,W]of[[-1,[.5,.36,.14]],[1,[.2,.3,.42]]])n.push(e0([[30,44],[34,46],[36,40],[30,4],[0,0]],{seg:10,color:()=>W,data:[.6,.2,0,0]}).translate(s.x+S*(f-26),p+30,s.z+70));await t.tick();{const S=Math.atan2(t.cageSide.x,-t.cageSide.z)+.2,W=Math.cos(S),C=Math.sin(S),A=-C,j=W,Z=f+5;n.push(T0([[-48,p+20],[-48,s.y+30*h],[-30,s.y+62*h],[0,s.y+74*h],[30,s.y+62*h],[48,s.y+30*h],[48,p+20]].map(([s0,p0])=>[s.x+W*Z+A*s0,p0,s.z+C*Z+j*s0]),()=>8.5,{along:18,around:5,color:()=>P(1.1),data:w}))}await t.tick();const L=t.fan,O=A0-(L.z-X)*Math.tan(m)-150;n.push(T0([[L.x,O,L.z],[L.x,(O+L.y)/2,L.z],[L.x,L.y+60,L.z]],()=>16,{along:2,around:8,color:()=>q(t.brass,.5),data:[.6,0,0,0]})),n.push(e0([[0,150],[40,150],[60,110],[120,70],[135,20],[120,-30],[60,-60],[26,-90],[0,-100]],{seg:18,color:(S,W,C)=>q(t.brass,.45+.1*Math.sin(C*.2)),data:[.7,0,0,0]}).translate(L.x,L.y,L.z)),n.push(e0([[0,40],[70,40],[90,0],[60,-30],[0,-30]],{seg:14,color:()=>q(t.brass,.4),data:[.6,0,0,0]}).translate(L.x,O,L.z));for(const S of[t.ham.z0,t.ham.z1])n.push(J(new u.TorusGeometry(46,11,6,14).rotateY(Math.PI/2).translate(t.ham.x,t.ham.y+20,S),D,[.5,0,0,0]));return await t.tick(),b0(n)}async function mo(t){const n=[],l=t.noise,g=t.rng,x=d=>(m,v,s)=>q([.52,.5,.44],d*(.85+.2*l.n2(m*.02,s*.02))),D=t.props.stack;for(let d=0;d<5;d++){const m=new u.BoxGeometry(292,5,292,4,1,4);m.rotateY((g()-.5)*.24),m.translate(D.x+(g()-.5)*22,3+d*6.5,D.z+(g()-.5)*22),n.push(J(m,x(.78+.08*d+.1*g()),[.12,d===0?.3:.1,0,0]))}const N=3+5*6.5;n.push(e0([[0,2],[44,2],[44,2.4],[60,2.4],[148,2.4],[150,1.4],[150,0]],{seg:48,color:(d,m,v)=>d<.2?q0(t.labelHex):[.012,.012,.015],data:(d,m,v,s)=>{s[0]=d<.2?.2:.95}}).translate(D.x-46,N,D.z+38));{const d=new u.BoxGeometry(292,4,292,4,1,4);d.rotateY(.3),d.translate(D.x+34,N+4.5,D.z-30),n.push(J(d,x(1),[.15,0,0,0]))}{const d=D.x+34,m=D.z-30,v=N+6.6,s=[.16,.13,.1];n.push(e0([[0,.5],[40,.5],[40,.5],[45,.5],[45,.5],[47.5,.7],[47.5,0]],{seg:40,color:h=>h<.3?q0(t.labelHex):h<.6?[.012,.012,.015]:q(s,2),data:(h,f,p,c)=>{c[0]=h<.6?.5:.1}}).translate(d,v-.4,m));for(const[h,f]of[[128,3.2],[118,1.4]])for(let p=0;p<4;p++){const c=new u.BoxGeometry(h*2+f,.4,f);c.translate(0,0,h),c.rotateY(p*Math.PI/2+.3),c.translate(d,v,m),n.push(J(c,s,[.1,0,0,0]))}for(let h=0;h<4;h++){const f=new u.BoxGeometry(46,.4,2.2);f.translate(0,0,70+h%2*8),f.rotateY(h*Math.PI/2+.3),f.translate(d,v,m),n.push(J(f,s,[.1,0,0,0]))}}await t.tick();const y=t.props.tin,r=(d,m,v)=>q(t.brass,.75+.2*Math.sin(m*3+v));n.push(e0([[52,26],[56,28],[58,26],[58,2],[55,0],[0,0]],{seg:28,color:r,data:[.8,0,0,0]}).translate(y.x,.5,y.z)),n.push(e0([[0,3.5],[52,3.5],[52,26]],{seg:28,color:()=>[.08,.07,.06],data:[.4,.3,0,0]}).translate(y.x,.5,y.z)),n.push(Kt(e0([[0,9],[57,9],[60,7],[60,0],[0,0]],{seg:28,color:(d,m,v)=>d<.3?q0(t.labelHex):q(t.brass,.8),data:[.75,0,0,0]}),U(y.x+78,30,y.z+20),U(-.72,.62,-.2)));for(let d=0;d<16;d++){const m=g()*c0,v=g()*36,s=U(Math.cos(m*3.1),.12+.2*g(),Math.sin(m*3.1));n.push(Kt(e0([[0,14],[1.3,13.6],[1.3,5],[.9,2],[.15,0]],{seg:6,color:()=>[.6,.62,.62],data:[.9,0,0,0]}),U(y.x+Math.cos(m)*v-s.x*7,5+g()*3,y.z+Math.sin(m)*v-s.z*7),s))}await t.tick();const e=t.props.cup,i=(d,m,v)=>v>44&&v<54?q(q0(W0[4]),.9):q([.62,.64,.62],.92+.08*Math.sin(m*5));n.push(e0([[30,6],[58,7],[84,14],[88,15],[86,11],[60,2],[34,0],[0,0]],{seg:36,color:i,data:[.85,0,0,0]}).translate(e.x,.5,e.z)),n.push(e0([[41,68],[43.5,70],[45,68],[44,50],[40,28],[31,13],[24,8],[22,6],[0,6]],{seg:36,color:i,data:[.85,0,0,0]}).translate(e.x,.5,e.z)),n.push(e0([[41,68],[39,46],[33,24],[22,12],[0,10]].reverse().map(d=>[d[0],d[1]]),{seg:36,color:()=>[.6,.6,.56],data:[.6,.35,0,0]}).translate(e.x,.5,e.z)),n.push(e0([[0,57],[39.5,57]],{seg:28,color:d=>R([.05,.022,.01],[.16,.08,.035],d*d),data:[.95,0,0,0]}).translate(e.x,.5,e.z)),n.push(T0([[e.x-43,58,e.z],[e.x-62,60,e.z],[e.x-72,44,e.z],[e.x-62,26,e.z],[e.x-38,24,e.z]],()=>4.6,{along:14,around:8,color:()=>[.6,.62,.6],data:[.85,0,0,0]})),await t.tick();const b=t.props.flower;for(let d=0;d<5;d++){const m=d/5*c0+.3,v=Math.cos(m),s=Math.sin(m);n.push(r0(6,8,!1,(p,c,M)=>{const F=15*Math.sin(Math.PI*Math.pow(c,.8))*(.25+.75*c)+1.5,P=(p-.5)*2*F+5*c,w=3+c*29,k=2.2+5.5*c*c+2.4*(p-.5)*(p-.5)*4*c+(p-.5)*4;M.p[0]=b.x+v*w-s*P,M.p[1]=k,M.p[2]=b.z+s*w+v*P;const L=R([.78,.52,.12],[.8,.77,.66],T(.1,.62,c+.25*(p-.5)));M.c[0]=L[0],M.c[1]=L[1],M.c[2]=L[2],M.d[0]=.35,M.d[1]=.25*(1-c)}));const h=14+12*g(),f=m+(g()-.3)*.5;n.push(J(new u.SphereGeometry(1.6+1.6*g(),8,5).scale(1,.6,1).translate(b.x+Math.cos(f)*h,5.4+h*h*.0058,b.z+Math.sin(f)*h),[.62,.66,.68],[1,0,0,0]))}return await t.tick(),b0(n)}function R0(t,n,l,g,x,D=1,N=1){return r0(D,N,!1,(y,r,e)=>{for(let i=0;i<3;i++){const b=t[i]+(n[i]-t[i])*y,d=g[i]+(l[i]-g[i])*y;e.p[i]=b+(d-b)*r}e.d[0]=x[0],e.d[1]=x[1],e.d[2]=x[2],e.d[3]=x[3]})}async function vo(t,n){const l=[],g=t.ham.sag,x=n/2,D=.28*n,N=t.noise,y=[.78,.76,.68],r=t.hamStriped?[.05,.075,.22]:[.1,.17,.37],e=(v,s,h)=>{const f=(v*2-1)*D,p=1-f/x*(f/x),c=Math.sin(Math.PI*v),M=i0(340,900,Math.pow(c,.6)),F=s*2-1,P=Math.exp(-(((v-.46)/.2)**2));return h[0]=f,h[2]=F*M*.5*(1-.12*F*F),h[1]=-g*p+(175+85*c)*F*F-125*c*F-120*P*(1-F*F)-70*P*T(.25,1,F)+16*Math.sin(F*10+v*4+1.5*Math.sin(v*5))*(1-.5*c)+6*Math.sin(v*37+F*3)*(1-F*F),h};l.push(r0(56,40,!1,(v,s,h,f,p)=>{e(v,s,h.p);const c=s*2-1,M=Math.sin(Math.PI*v),F=Math.exp(-(((v-.46)/.2)**2)),P=t.hamStriped?p%4<2?1:0:p>=8&&p<=10||p>=30&&p<=32?1:p===12||p===28?.6:0,w=Math.sin(c*10+v*4+1.5*Math.sin(v*5))*.6+Math.sin(c*19-v*3+2)*.4,k=.88+.12*N.n2(v*60,s*14)-.06*Math.abs(Math.sin(v*170))+.17*w*(.45+.55*M),L=q(R(y,r,P*.88),k);h.c[0]=L[0],h.c[1]=L[1],h.c[2]=L[2],h.d[0]=.04,h.d[1]=k0(.8*Math.pow(Math.max(0,1-Math.pow(Math.abs(c-.12),2.6)),.6)*M*(1-.2*c)+.22*F*(1-c*c)+.2*(1-M)+.16*T(.88,1,Math.abs(c))+.07*w*M,0,.88),h.d[2]=0,h.d[3]=0})),await t.tick();const d=[0,0,0];for(const v of[0,1])for(let s=0;s<11;s++){e(v,s/10,d);const h=(v*2-1)*x,f=d[0],p=d[1],c=d[2];l.push(ut(6,(M,F,P)=>{const w=-34*Math.sin(Math.PI*M)*(.6+.4*Math.abs(s-5)/5);P.p[0]=i0(h,f,M),P.p[1]=i0(0,p,M)+w+(F-.5)*15,P.p[2]=i0(0,c,M)+(F-.5)*9;const k=.62-.14*(s%2);P.c[0]=k,P.c[1]=k*.97,P.c[2]=k*.86,P.d[0]=.03,P.d[1]=.25*(1-M)}))}for(const v of[-1,1])l.push(J(new u.SphereGeometry(30,10,8).scale(1.7,1,1).translate(v*(x-40),-8,0),[.55,.53,.46],[.03,.2,0,0]));const m=[];await t.tick();for(const v of[0,1])m.push(r0(112,3,!1,(s,h,f)=>{e(s,v,d);const p=Math.sin(Math.PI*s),c=(40+30*Math.pow(p,.5))*h;f.p[0]=d[0],f.p[1]=d[1]-c,f.p[2]=d[2]+(v*2-1)*(3+9*h),f.c[0]=.8,f.c[1]=.79,f.c[2]=.72,f.d[0]=s*66,f.d[1]=h,f.d[2]=9*h,f.d[3]=s*40+v*2}));return await t.tick(),{cloth:b0(l),lace:b0(m)}}function xo(t){const n=q(q0(W0[2]),.8);return r0(180,5,!1,(l,g,x,D,N)=>{const y=l*c0,r=Math.sin(y*30)+.4*Math.sin(y*11+1),e=651+5*g+13*r*g;x.p[0]=Math.cos(y)*e,x.p[2]=Math.sin(y)*e,x.p[1]=-2-g*(215+46*Math.abs(Math.sin(y*18)));const i=q(n,(N%2?.92:.66)*(.86+.14*r*g)*(1-.25*g));x.c[0]=i[0],x.c[1]=i[1],x.c[2]=i[2],x.d[0]=.03,x.d[1]=.1*g,x.d[2]=9*g*g,x.d[3]=y*3})}async function yo(t){const n=[],l=t.rng,g=q0(W0[5]);for(const x of t.fernX)for(let D=0;D<20;D++){await t.tick();const N=D/20*c0+l()*.3,y=380+220*l(),r=150+240*l(),e=l()*6,i=.8+.6*l(),b=Math.cos(N),d=Math.sin(N);n.push(r0(2,16,!1,(m,v,s,h,f)=>{const p=v,c=y*Math.pow(p,.85),M=r*Math.sin(p*2.2)-230*p*p*p,F=(70*Math.pow(Math.sin(Math.PI*Math.pow(p,.6)),.8)+5)*(f%2?1:.55)*(m-.5)*2;s.p[0]=x+b*c-d*F,s.p[1]=F0+255+M-Math.abs(m-.5)*30*p,s.p[2]=l0-100+d*c+b*F;const P=q(R(g,[.2,.34,.16],.5*p),i*(h===1?.7:1.05)*(.5+.5*p));s.c[0]=P[0],s.c[1]=P[1],s.c[2]=P[2],s.d[0]=.25,s.d[1]=.4*(1-p),s.d[2]=18*p*p,s.d[3]=e+p*2}))}return await t.tick(),b0(n)}function go(t){const n=[];for(let l=0;l<4;l++){const g=l/4*c0,x=Math.cos(g),D=Math.sin(g);n.push(r0(4,10,!1,(N,y,r)=>{const e=130+580*y,i=(105+125*Math.pow(Math.sin(Math.PI*Math.min(.5+y*.5,1)),.5))*(y>.96?.8:1)*(y<.12?.35+y*5:1),b=(N-.5)*i,d=-20+b*.2-30*y*y;r.p[0]=x*e-D*b,r.p[1]=d,r.p[2]=D*e+x*b;const m=y<.14?q(t.brass,.5):q(t.darkWood,2.2+.8*Math.sin(b*.05+y*9));r.c[0]=m[0],r.c[1]=m[1],r.c[2]=m[2],r.d[0]=y<.14?.7:.45,r.d[1]=0}))}return b0(n)}function wo(){const t=A0+40,n=l0+240;return b0([R0([h0,K,X],[d0,K,X],[d0,t,X],[h0,t,X],[0,0,0,0],8,4),R0([h0,K,n],[h0,K,X],[h0,t,X],[h0,t,n],[1,0,0,0],8,4),R0([d0,K,X],[d0,K,n],[d0,t,n],[d0,t,X],[1,0,0,0],8,4)])}async function Mo(t){const n=[],l=t.rng,g=q0(W0[5]),x=q0(W0[1]),D=(e,i,b,d,m,v,s,h,f)=>{e.p[0]=i,e.p[1]=b,e.p[2]=d,e.c[0]=m[0],e.c[1]=m[1],e.c[2]=m[2],e.d[0]=v,e.d[1]=s,e.d[2]=h,e.d[3]=f};for(let e=0;e<6;e++){const i=i0(-3300,3300,(e+.5)/6)+(l()-.5)*700,b=4300+l()*900,d=1150+l()*900+(e===2||e===3?-350:0),m=(l()-.3)*600,v=i0(.3,.52,(b-4300)/900),s=l()*6,h=q(R(g,x,.35),.5+.25*l()),f=i+m,p=-1500;n.push(ut(12,(c,M,F)=>{const P=i0(95,48,c)*(1+.12*Math.sin(c*40)),w=i+m*c*c+(M-.5)*2*P;D(F,w,i0(p,d,c),b,q(h,.8),70*c*c,s,v,0)}));for(let c=0;c<12;c++){await t.tick();const M=i0(-.9,Math.PI+.9,(c+l()*.6)/12),F=820+380*l(),P=.35+.5*l(),w=s+l()*2,k=Math.cos(M),L=Math.sin(M),O=(C,A)=>(A[0]=f+F*C*k+240*C*C,A[1]=d+F*C*L-P*F*C*C*(.6+.4*Math.abs(k)),A),S=[0,0],W=[0,0];for(const C of[0,1])n.push(r0(26,1,!1,(A,j,Z,s0)=>{O(A,S),O(Math.min(A+.02,1.02),W);let p0=W[0]-S[0],B=W[1]-S[1];const n0=Math.hypot(p0,B)||1;p0/=n0,B/=n0;const Q=(150*Math.pow(Math.sin(Math.PI*Math.pow(A,.7)),.6)+26)*(s0%2?1:.3)*(C?.45:1)*j,z0=C?-B:p0*.35+.25,B0=C?p0:-1;D(Z,S[0]+z0*Q,S[1]+(C?Math.abs(B0):B0)*Q,b+c*3+C,q(h,C?1.15:.85+.3*l()),60+250*A+90*j*A,w+A*1.5,v,j*A)}))}}for(let e=-3500;e<3300;e+=520+l()*420){const i=3080+l()*420,b=5+Math.floor(l()*4),d=i0(.06,.2,(i-3080)/420);for(let m=0;m<b;m++){await t.tick();const v=(l()-.5)*2.2,s=900+700*l(),h=250+1100*l(),f=l()*6,p=q(R(g,q0(W0[2]),.12+.25*l()),.75+.5*l()),c=e+(l()-.5)*240,M=[l(),l(),l(),l()];n.push(r0(2,16,!1,(F,P,w,k,L)=>{const O=P,S=c+v*s*.5*O*O,W=i0(-1300,h,Math.sin(O*1.35)/Math.sin(1.35))-240*O*O*Math.abs(v),C=O<.25?.07:Math.pow(Math.sin(Math.PI*(O-.25)/.76),.55),A=M.some(p0=>Math.abs(O-.3-p0*.65)<.035)?.3:1,j=(k-1)*230*C*A*(L%2?1:.86),Z=Math.cos(v*.5),s0=-Math.sin(v*.5)*.6;D(w,S+Z*j,W+s0*j-Math.abs(k-1)*60*C*O,i+m*4,q(p,k===1?1.25:.9),(30+170*O)*(.6+.4*Math.abs(k-1)),f+O,d,O*Math.abs(k-1))}))}}await t.tick();const N=t.mangoSide*2500,y=3950,r=1500;n.push(ut(6,(e,i,b)=>D(b,N+(i-.5)*300*(1.35-.6*e)+140*e*e*t.mangoSide,i0(-1500,r-250,e),y,q(x,.2),10*e,0,.36,0)));for(const[e,i]of[[-520,560],[430,640],[80,820]])n.push(ut(4,(b,d,m)=>D(m,N+e*b*(.6+.4*b)+(d-.5)*120*(1-.6*b),r-420+i*b,y+1,q(x,.2),14*b,1,.38,0)));for(let e=0;e<84;e++){const i=l()*Math.PI,b=Math.sqrt(l())*(e%9===0?1.12:1),d=Math.cos(i)*b,m=Math.sin(i)*b,v=N+d*1450,s=r-260+m*1250-220*d*d,h=T(.55,1.05,b),f=i0(330,170,h)*(.8+.45*l()),p=l()*6,c=3+Math.floor(l()*3),M=l()*6,F=q(R(g,x,.3),(.26+.2*l())*(.75+.55*m)*(1+.5*h)),P=.36+.26*h;n.push(r0(26,2,!1,(w,k,L)=>{const O=w*c0,S=f*k*(.78+.22*Math.abs(Math.sin(O*c*.5+M))+.06*Math.sin(O*7+e)),W=.8+.45*k*Math.max(0,Math.sin(O))+.25*(k>.75?1:0);D(L,v+Math.cos(O)*S,s+Math.sin(O)*S*.78,y+10+e*2,q(F,W),30+34*k,p+Math.cos(O),P+.1*(k>.75?1:0),.2*k)})),(e&15)===15&&await t.tick()}return await t.tick(),b0(n)}function bo(t){const n=[];n.push(r0(44,6,!0,(l,g,x)=>{x.p[0]=x.p[1]=x.p[2]=0,x.d[0]=l*c0,x.d[1]=g,x.d[2]=0})),n.push(r0(44,2,!0,(l,g,x)=>{x.p[0]=x.p[1]=x.p[2]=0,x.d[0]=l*c0,x.d[1]=g,x.d[2]=2}));for(let l=0;l<11;l++)n.push(J(new u.SphereGeometry(1,8,6),[1,1,1],[(l+.5)/11*c0,0,1,t()]));for(let l=0;l<7;l++)n.push(J(new u.SphereGeometry(.55,6,4),[1,1,1],[t()*c0,0,1,.3+1.4*t()]));return n.push(J(new u.SphereGeometry(1,14,7,0,c0,0,Math.PI/2),[1,1,1],[0,0,3,0])),b0(n)}function zo(t){const n=[],l=[.01,.011,.016],g=[.012,.02,.062],x=[.012,.075,.05],D=[.035,.2,1.2],N=[.2,.1,1],y=[[-1.7,47,.25],[-.9,38,.95],[-.2,28.5,1.5],[.4,21,2.5],[1.9,16.2,7.4],[2.7,10.5,9.7],[1.3,4.6,8.7],[-3.2,-1,6.9],[-9.5,-6.5,11.4],[-17,-13,13.8],[-25.5,-20.5,12.4],[-33,-27.5,8.6],[-38.5,-33,4.8],[-41.5,-36.5,1.5]],r=y.length-1,e=(p,c)=>{const M=Math.min(r-1,Math.floor(p)),F=p-M,P=y[Math.max(M-1,0)][c],w=y[M][c],k=y[M+1][c],L=y[Math.min(M+2,r)][c];return .5*(2*w+(k-P)*F+(2*P-5*w+4*k-L)*F*F+(3*w-P-3*k+L)*F*F*F)},i=r*4;n.push(r0(18,i,!0,(p,c,M,F,P)=>{const w=Math.min(c*r,r-1e-4),k=p*c0,L=Math.cos(k),O=Math.sin(k),S=e(w,0),W=e(w,1),C=Math.max(e(w,2),.2),A=.05;let j=e(Math.min(w+A,r-1e-4),0)-e(Math.max(w-A,0),0),Z=e(Math.min(w+A,r-1e-4),1)-e(Math.max(w-A,0),1);const s0=Math.hypot(j,Z)||1;j/=s0,Z/=s0;const p0=Math.exp(-(((w-9)/1.5)**2)),B=Math.exp(-(((w-5)/1.2)**2)),n0=O<0?1+.32*p0:.94-.1*p0,Q=1-.08*B+.04*p0;M.p[0]=C*L*Q,M.p[1]=S+-Z*C*O*n0,M.p[2]=W+j*C*O*n0;const z0=(F+P)%2?1.2:.78,B0=T(-.1,.6,O),tt=T(4.25,4.7,w)*(1-T(8.3+.35*Math.cos(k*6),8.9+.35*Math.cos(k*6),w))*T(.5,.18,O-.25*B);let m0,_0=.7,at=.06;w<3.15?(m0=q(l,1+.6*T(.3,1,O)),_0=.6,at=0):(m0=q(R(R(g,[.02,.03,.05],T(.2,-.8,O)*T(8,11,w)),x,.75*B0*T(6.5,8.5,w)),z0),m0=R(m0,q(N,.16*z0),.6*B0*(1-T(5.8,7.2,w))),m0=R(m0,q(R(D,N,.25*T(7,8.6,w)),.55+.6*z0),tt),at=Math.max(.1*B0,.85*tt)),M.c[0]=m0[0],M.c[1]=m0[1],M.c[2]=m0[2],M.d[0]=_0,M.d[1]=.25*T(.1,-.9,O)*T(7.5,9,w)*(1-tt),M.d[2]=at}));for(const p of[-1,1])n.push(J(new u.SphereGeometry(1.75,10,8).translate(p*7.7,3.7,13.3),[.004,.004,.005],[1,0,0,0])),n.push(J(new u.SphereGeometry(.42,6,5).translate(p*8.75,4.5,14.1),[.9,.9,.86],[1,0,0,0])),n.push(J(new u.SphereGeometry(1.25,8,6).scale(.5,.8,1.3).translate(p*8.95,4.4,9.4),[.82,.84,.86],[.2,0,0,0])),n.push(J(new u.SphereGeometry(3.4,10,7).scale(.9,1.15,1).translate(p*4.2,-34.5,-23.5),(c,M,F)=>q([.6,.63,.66],.8+.3*t.noise.n3(c*.9,M*.9,F*.9)),[.05,.2,0,0]));const d=U(0,-.36,-.933),m=U(.94,.317,-.122),v=U(-.34,.877,-.338),s=new u.Vector3,h=new u.Vector3;for(let p=0;p<10;p++){const c=p/9*2-1,M=Math.abs(c),F=.74*c,P=31+25*Math.pow(M,1.5),w=7.4*(1-.25*M),k=(1-M)*1.6;s.copy(d).multiplyScalar(Math.cos(F)).addScaledVector(m,Math.sin(F)),h.copy(m).multiplyScalar(Math.cos(F)).addScaledVector(d,-Math.sin(F));const L=s.x,O=s.y,S=s.z,W=h.x,C=h.y,A=h.z;n.push(r0(2,9,!1,(j,Z,s0,p0)=>{const B=p0-1,n0=w*(.4+.6*Math.sin(Math.PI/2*Math.min(1,Z/.55)))*(Z<.55?1:1-.93*Math.pow((Z-.55)/.45,1.5)),Q=k+(B===0?.7:0)-6*Z*Z-.8*M*Z;s0.p[0]=c*2.6+L*P*Z+W*B*n0+v.x*Q,s0.p[1]=-38.5+O*P*Z+C*B*n0+v.y*Q,s0.p[2]=-33+S*P*Z+A*B*n0+v.z*Q;const z0=q(R([.02,.07,.42],[.008,.016,.1],T(.35,1,Z)),(B===0?1.5:.8)*(.85+.3*(p%2)));s0.c[0]=z0[0],s0.c[1]=z0[1],s0.c[2]=z0[2],s0.d[0]=.65,s0.d[1]=.25*(1-Z)*(1-M),s0.d[2]=B===0?.35:.15}))}const f=[];for(const p of[-1,1])f.push(r0(16,6,!1,(c,M,F)=>{const P=(c*2-1)*1.2,w=62*M;F.p[0]=p*(8+Math.cos(P)*w*.97),F.p[2]=-4+Math.sin(P)*w*.95,F.p[1]=-5+w*(.15*Math.cos(P)+.16*Math.sin(P)),F.d[0]=M,F.d[1]=c*2-1}));return{body:b0(n),wings:b0(f)}}function So(){const t=[.006,.006,.01],n=T0([[0,0,26],[0,1.5,12],[0,1,-8],[0,-1,-30]],g=>.4+3.4*Math.sin(Math.PI*Math.min(1,g*1.2+.05)),{along:10,around:8,color:()=>[.03,.025,.02],data:[.3,0,0,0]}),l=[];for(const[g,x,D,N]of[[12,62,44,.5],[-10,46,40,-.55]])l.push(r0(48,14,!1,(y,r,e,i,b)=>{const d=x*r,m=N+(y-.5)*1.5,v=Math.sin(Math.PI*y),s=d*(.55+.45*Math.pow(v,.85))*(1+.018*Math.cos(y*Math.PI*16)*T(.8,1,r));e.p[0]=2+Math.cos(m)*s,e.p[2]=g+Math.sin(m)*s*(D/x)*1.4,e.p[1]=1+3*r*(1-r)+.5*Math.cos(y*Math.PI*8)*r;const h=k0(T(.7,.86,r+.03*Math.cos(y*Math.PI*16))+(1-T(.03,.2,v))*T(.08,.45,r)+(1-T(.04,.1,r)),0,1),f=R([.012,.085,.5],[.16,.46,.95],T(.08,.75,r+.12*(v-.5))),p=i%6===0&&b>1?.22:1;let c=R(q(f,p*(.92+.12*Math.sin(y*9+g))),t,h);b===13&&i%6===3&&i>3&&i<45&&(c=[.42,.5,.6]),e.c[0]=c[0],e.c[1]=c[1],e.c[2]=c[2],e.d[0]=.4*(1-h),e.d[2]=.9*(1-h)*(p>.5?1:.3)}));return{body:n,wing:b0(l)}}function Ya(t,n,l,g){const x=U(0,1,0),D=[];D.push(e0([[0,128],[10,126],[19,118],[22.5,106],[20,95],[17.5,90],[26,78],[31,60],[30,40],[24,22],[14,10],[0,6]],{seg:18,color:(y,r,e)=>q(e>92?n:R(t,n,.25*T(40,90,e)),.8+.3*Math.max(0,-Math.sin(r))),data:[.3,0,0,0]}).scale(1,1,1.12)),D.push(Kt(e0([[0,17],[3.4,14],[7,7],[8.6,0]],{seg:10,color:()=>l,data:[.7,0,0,0]}),U(0,104,17),U(0,-.5,.86)));for(const y of[-1,1])D.push(J(new u.SphereGeometry(2.6,8,6).translate(y*14.5,110,14),[.01,.01,.01],[1,0,0,0]));D.push(ut(6,(y,r,e)=>{e.p[0]=(r-.5)*i0(30,12,y),e.p[1]=26-96*y,e.p[2]=-20-34*y;const i=q(g,1-.3*y);e.c[0]=i[0],e.c[1]=i[1],e.c[2]=i[2],e.d[0]=.3}));for(const y of[-1,1])D.push(T0([[y*9,14,2],[y*10,4,4],[y*10,-3,8]],()=>2.6,{along:3,around:6,color:()=>[.25,.22,.2],data:[.2,0,0,0]}));const N=r0(5,6,!1,(y,r,e)=>{const i=26*Math.sin(Math.PI*Math.pow(r,.6))+3;e.p[0]=66*r,e.p[1]=4*Math.sin(r*3),e.p[2]=(y-.6)*i;const b=q(R(t,g,r),.7+.5*y);e.c[0]=b[0],e.c[1]=b[1],e.c[2]=b[2],e.d[0]=.3});return{body:b0(D),wing:N,Y:x}}async function Po(t){const n=[],l=t.noise,g=[.76,.58,.42],N=T0([[7,2,-62],[-4,2.4,-46],[3.5,3.4,-29],[0,5,-12],[-2,6,4],[1,5.6,18],[0,5,27],[0,4.8,39]],r=>r<.48?.5+6.5*Math.pow(r/.48,.8):r<.8?7+1.8*Math.sin(Math.PI*(r-.48)/.32):r<.88?5.6:6.6*Math.pow(Math.max(0,(1-r)/.12),.45)+.4,{along:40,around:12,color:(r,e)=>{const i=T(-.25,.5,Math.cos(e-1.57)),b=T(.25,.75,.5+.5*Math.sin(r*52+Math.sin(e*2)*1.3)),d=T(.25,.6,l.n2(r*90,e*7)),m=R(R([.7,.6,.5],g,i),[.33,.22,.16],i*(.7*b+.25*d*(1-b)));return q(m,.92+.16*l.n2(r*30,e*3))},data:[.35,0,0,0]});await t.tick();{const r=N.attributes.position,e=N.attributes.aData;for(let m=0;m<r.count;m++){const v=r.getZ(m),s=r.getY(m);r.setY(m,Math.max(.15,(s-4)*.62+3.4-(v<-20?(v+20)*-.03:0))),e.setZ(m,7*Math.pow(k0((-34-v)/28,0,1),1.6)),e.setW(m,v*.06)}const i=N.attributes.color,b=[.76,.64,.52],d=[.13,.075,.05];for(let m=0;m<=40;m++){let v=1e9,s=-1e9;for(let h=0;h<12;h++){const f=r.getY(m*12+h);v=Math.min(v,f),s=Math.max(s,f)}for(let h=0;h<12;h++){const f=m*12+h,p=r.getX(f),c=r.getZ(f),M=T(.4,.8,(r.getY(f)-v)/Math.max(s-v,.001)),F=T(.38,.62,.5+.5*Math.sin(c*.4+p*.1)),P=T(.2,.6,l.n2(p*.5,c*.5)),w=q(R(R(b,g,M),d,Math.min(1,M*1.15)*(.95*F+.35*P*(1-F))),.93+.14*l.n2(p*.2+5,c*.2));i.setXYZ(f,w[0],w[1],w[2])}}await t.tick(),N.computeVertexNormals()}n.push(N),await t.tick();const y=r=>(e,i)=>{const b=T(-.3,.5,Math.sin(i)),d=T(.35,.65,.5+.5*Math.sin(e*15+r));return q(R(R([.76,.64,.52],g,b),[.14,.08,.055],.9*d*(.45+.55*b)),.95+.1*Math.sin(e*40))};for(const[r,e,i]of[[-1,17,9],[1,17,9],[-1,-9,-7],[1,-9,3]]){const b=i>5,d=e+(b?3:-5),m=r*18.5,v=e+i;n.push(T0([[r*1.5,3.4,e],[r*6.5,4.6,e+(b?.6:-1.2)],[r*12.6,6.6,d],[r*16,3.6,d+(v-d)*.6],[m,1.1,v]],s=>3.6-1.5*T(0,.5,s)-.6*T(.55,1,s)+.5*Math.exp(-(((s-.5)/.1)**2)),{along:14,around:8,color:y(e),data:[.3,0,0,0]}));for(let s=-2;s<=2;s++){const h=(b?.25:-.35)+s*.46,f=r*Math.cos(h),p=Math.sin(h),c=6.4-.7*Math.abs(s);n.push(T0([[m-f*.8,1,v-p*.8],[m+f*c*.55,1.2,v+p*c*.55],[m+f*c,.65,v+p*c]],M=>1.05-.4*M,{along:3,around:6,color:M=>R(q(g,.95),[.2,.12,.08],.8*T(.3,.7,.5+.5*Math.sin(M*9+s))),data:[.35,0,0,0]})),n.push(J(new u.SphereGeometry(1.5,8,5).scale(1,.34,1).translate(m+f*(c+.6),.6,v+p*(c+.6)),(M,F,P)=>R([.92,.74,.66],q(g,1.05),T(.3,1,F)),[.55,0,0,0]))}await t.tick()}await t.tick();for(const r of[-1,1])n.push(J(new u.SphereGeometry(1.75,10,8).translate(r*3.6,5.75,33),[.62,.44,.12],[.95,0,0,0])),n.push(J(new u.SphereGeometry(1.4,8,8).scale(.5,1,.5).translate(r*4.75,5.95,33.5),[.006,.005,.004],[1,0,0,0])),n.push(J(new u.SphereGeometry(.32,6,5).translate(r*5.2,6.75,34),[.85,.86,.82],[1,0,0,0]));return b0(n)}const _=(t,n,l)=>new u.Color(t,n,l),ko={day:{heroHour:"day",fog:_(.5,.56,.58),fogDensity:15e-5,fill:_(.05,.062,.066),cloudLo:_(.125,.16,.175),cloudHi:_(.5,.56,.58),bay:_(.5,.56,.585),plantHaze:_(.33,.4,.405),plantGain:.62,hazeK:.85,flyCol:_(0,0,0),sunGlow:_(0,0,0),riftGain:.5,rain:.9,rainCol:_(.82,.9,.93),streak:.3,wet:1,limeK:1,throat:1,bandGold:.92,mouthMist:.045,mistGain:.3,mistWarm:1,sun:0,wind:1,steam:0,flies:0,exposure:1,bloom:{strength:.3,radius:.6,threshold:1},tint:"#f2f7f8",shadowTint:"#0a1014",saturation:1.04,portal:"#ffe3a6"},golden:{heroHour:"golden",fog:_(.6,.48,.34),fogDensity:14e-5,fill:_(.075,.058,.045),cloudLo:_(.33,.27,.28),cloudHi:_(.98,.76,.5),bay:_(.95,.74,.44),plantGain:1,hazeK:1,flyCol:_(0,0,0),sunGlow:_(3,1.75,.7),riftGain:.22,rain:.42,rainCol:_(1.5,1.15,.6),streak:.8,wet:.85,limeK:.45,throat:1,bandGold:.7,mouthMist:.055,mistGain:.32,mistWarm:1,sun:1,wind:.6,steam:1,flies:0,exposure:.95,keyDir:U(-.5,.28,.82).normalize(),bloom:{strength:.36,radius:.65,threshold:1},tint:"#fff4e2",shadowTint:"#140d10",saturation:1.06,portal:"#fff0c8"},dusk:{heroHour:"night",fog:_(.045,.075,.16),fogDensity:16e-5,fill:_(.02,.028,.052),cloudLo:_(.028,.045,.12),cloudHi:_(.1,.16,.36),bay:_(.1,.14,.27),plantGain:1,hazeK:1,flyCol:_(1.1,1.5,.36),rake:_(.66,.27,.18),sunGlow:_(0,0,0),riftGain:.42,rain:.14,rainCol:_(.4,.52,.85),streak:.14,wet:.9,limeK:.8,throat:.5,bandGold:.5,mouthMist:.085,mistGain:.3,mistWarm:.3,sun:0,wind:.35,steam:0,flies:1,exposure:1.7,bloom:{strength:.42,radius:.7,threshold:.95},tint:"#e6eeff",shadowTint:"#060a1c",saturation:1.1,portal:"#ffe2b8"}};var Co={id:"seventy-eight-in-the-rain",name:"Seventy-Eight in the Rain",category:"domestic",weirdness:.15,media:["tiny","interior","air"],async build(t){const{rng:n}=t,l=new u.Scene,g=new u.Group;g.name="stage",l.add(g);const x=n.fork("variety"),D=t.vary||{},N=x(),y=D.mood??N,r=D.hour||"any",e=r==="golden"?"golden":r==="night"||r==="dawn"?"dusk":r==="day"||y<.45?"day":y<.75?"golden":"dusk",i=ko[e],b=k0(D.density??1,.6,1.4),d=t.quality?.detail??1,m=!!D.rare,v=x()<.45,s=x()>.7,h=x(),f=e==="dusk"?h<.6:h<.15,p=x()<.5?-1:1,c=x()<.5?0:1,M=x()<.5?0:1,F=[-2150+x.range(-150,150),-350+x.range(-200,200),1500+x.range(-200,200)];l.background=i.fog.clone(),l.fog=new u.FogExp2(i.fog.clone(),i.fogDensity);const P=await Ee(t,{palette:W0,hour:i.heroHour,density:b});g.add(P.object),i.keyDir&&P.setLook({keyDir:i.keyDir});const w=P.anchors,k=P.uniforms;k.uThroatCol.value.multiplyScalar(i.throat),k.uBandGold.value=i.bandGold,k.uFlow.value=2.2,await t.yield();const L=.56,O=[U(-138,290,-92),U(-108,263,-62),U(-84,250.8,-39)],S=[[.68,-.3],[.2,-.1],[-.03,.03]],W=(a,o,V,z)=>{const E=V-a;if(z<=L){const g0=k0(z/L,0,1),C0=g0*g0,ht=C0*g0;return(2*ht-3*C0+1)*a+(3*C0-2*ht)*o+(ht-2*C0+g0)*.6*(o-a)+(ht-C0)*L*E}const y0=1-L,a0=k0((z-L)/y0,0,1),u0=a0*a0,N0=u0*a0;return(2*N0-3*u0+1)*o+(N0-2*u0+a0)*y0*E+(3*u0-2*N0)*V},C=(a,o)=>o.set(W(O[0].x,O[1].x,O[2].x,a),W(O[0].y,O[1].y,O[2].y,a),W(O[0].z,O[1].z,O[2].z,a)),A=2.64,j=.2,Z=j*Math.hypot(O[0].x,O[0].z),s0=j*Math.hypot(O[2].x,O[2].z),p0=U(.218,.03,.974).normalize(),B=[],n0=new u.Vector3,Q={};for(const a of[114,88,62,40,20])B.push(S0(n0.copy(O[0]).addScaledVector(p0,-(a+Z)),-j));B[0].y=B[1].y=B[2].y,Q.settle=B.length;for(let a=0;a<1;a+=.125)B.push(S0(n0.copy(O[0]).addScaledVector(p0,-Z*(1-a)*(1-a)),-j+j*a*a));Q.ride0=B.length;const z0=Math.ceil(A/.05);for(let a=0;a<=z0;a++)B.push(S0(C(a/z0,n0),a/z0*A));Q.ride1=B.length-1;const B0=C(1,new u.Vector3),tt=U(-.4,.04,.92).normalize(),m0=A+j;for(let a=.125;a<=1.001;a+=.125)B.push(S0(n0.copy(B0).addScaledVector(tt,s0*a*a),A+j*(1-(1-a)*(1-a))));Q.free=B.length-1;const _0={x:-50,z:303,r:50},at=[[-104,258,6],[-106,272,42],[-106.5,298,83],[-104,331,125],[-101,362,168],[-100,392,212],[-100,416,259]];for(const a of at)B.push(S0(n0.set(a[0],a[1],a[2]),m0));Q.turn0=B.length;const Ka=a=>w.hornMouth.y+(a-w.hornMouth.z)*(w.hornAxis.y/w.hornAxis.z),mt=w.portalSeat.position,Jt=_0.z-57,Qt=Ka(Jt),Ra=Qt+3;for(let a=0;a<=8;a++){const o=a/8,V=o*Math.PI,z=436+(Ra-436)*(o<.75?1.143*o:.857+1.143*(o-.75-(o-.75)*(o-.75)/.5));B.push(S0(n0.set(_0.x-_0.r*Math.cos(V),z,_0.z+_0.r*Math.sin(V)),m0))}Q.turn1=B.length-1;const ta=(Jt-w.hornMouth.z)/w.hornAxis.z;B.push(S0(n0.set(0,Qt+3.5,_0.z-31),m0));const Xa=ta+mt.distanceTo(w.hornMouth);Q.axis=B.length;for(let a=0;a<Xa-20;a+=46)B.push(S0(n0.copy(w.hornMouth).addScaledVector(w.hornAxis,ta-a),m0));B.push(S0(n0.copy(mt).addScaledVector(w.hornAxis,30),m0)),B.push(S0(n0.copy(mt),m0)),await t.yield();const et=He(B,{samples:480});await t.yield();const ja=32.5,aa=k0(et.length/ja,36,50),ot=[0];for(let a=1;a<B.length;a++)ot.push(ot[a-1]+B[a].distanceTo(B[a-1]));const $0=a=>ot[a]/ot[ot.length-1],G={settle:$0(Q.settle),ride0:$0(Q.ride0),ride1:$0(Q.ride1),free:$0(Q.free),turn0:$0(Q.turn0),turn1:$0(Q.turn1),axis:$0(Q.axis)};G.mouth=1-mt.distanceTo(w.hornMouth)/et.length;const X0=1200,Y0=new Float32Array(X0+1),H0=new Float32Array(X0+1),Ct=new u.Vector3,vt=new u.Vector3;for(let a=0;a<=X0;a++){const o=a/X0;if(o<=G.settle){H0[a]=-j,Y0[a]=0;continue}if(o>=G.free){H0[a]=m0,Y0[a]=1;continue}if(o<G.ride0){const E=(o-G.settle)/(G.ride0-G.settle);H0[a]=-j+j*E*E,Y0[a]=0;continue}if(o>G.ride1){const E=(o-G.ride1)/(G.free-G.ride1);H0[a]=A+j*(1-(1-E)*(1-E)),Y0[a]=1;continue}let V=(o-G.ride0)/(G.ride1-G.ride0);et.pointAt(o,vt);const z=Math.atan2(vt.z,-vt.x);for(let E=0;E<6;E++){C(V,Ct);const y0=V*A,a0=z-Math.atan2(Ct.z,-Ct.x),u0=a0+c0*Math.round((y0-a0)/c0);V=k0(u0/A,0,1)}Y0[a]=V,H0[a]=V*A}const st=(a,o)=>{const V=k0(o,0,1)*X0,z=Math.min(X0-1,Math.floor(V));return a[z]+(a[z+1]-a[z])*(V-z)},ea=a=>T(G.settle,G.ride0,a)*(1-T(G.ride1,G.free,a)),oa=(a,o)=>-P.warpAt(a)*ea(o),nt=(a,o,V,z)=>(S0(a,st(H0,V),z),z.y+=oa(o,V),z);await t.yield();{const a=[];for(let o=0;o<=2400;o++)a.push(S0(et.pointAt(o/2400,vt),-st(H0,o/2400)));await P.clearDrips(a,8)}await t.yield();const sa=()=>u.UniformsUtils.clone(u.UniformsLib.fog),Za={value:(i.rake||_(0,0,0)).clone()},Ja={value:U(-.42,.09,.9).normalize()},Qa={value:i.sun},te={value:i.limeK},ae={value:i.fill.clone()},Tt={value:i.rainCol.clone()},ee={value:i.fog.clone().multiplyScalar(1.06)},na={value:0},G0=(a,o,V={},z={})=>new u.ShaderMaterial({uniforms:{...sa(),...k,uTimeV:k.uTime,uSun:Qa,uFill:ae,uLimeK:te,uRake:Za,uRakeDir:Ja,...V},vertexShader:a,fragmentShader:o,fog:!0,vertexColors:!0,...z}),j0={transparent:!0,depthWrite:!1,blending:u.CustomBlending,blendSrc:u.OneFactor,blendDst:u.OneMinusSrcAlphaFactor},At={transparent:!0,depthWrite:!1,blending:u.AdditiveBlending},Y=(a,o,V,z=g)=>{const E=new u.Mesh(a,o);return E.name=V,z.add(E),E},I0=G0(L0,Ea,{},{side:u.DoubleSide}),Gt=G0(L0,Ea,{},{side:u.DoubleSide,defines:{SWAY:1}}),xt=R(q0(W0[3]),[.96,.68,.25],.5),H={rng:n.fork("set"),noise:t.noise,tick:()=>t.yield(),lime:e==="day"?[.4,.425,.42]:[.5,.52,.5],darkWood:[.05,.032,.025],clay:[.34,.15,.09],brass:xt,fernX:F,hamStriped:v,mangoSide:p,labelHex:P.labelColor,cage:U(1370,690,-700),cageK:1.5,cageSide:{x:.59,z:.81},fan:U(2250,1560,250),ham:{x:2700,y:1350,z0:X+44,z1:2452,sag:1150},props:{stack:{x:470,z:-40},tin:{x:-500,z:205},cup:{x:-545,z:-120},flower:{x:525,z:270}}},ia=e==="golden"?1.08:1;Y(R0([h0,K,l0+240],[d0,K,l0+240],[d0,K,X],[h0,K,X],[0,0,0,0]),G0(L0,Ke,{uTileA:{value:_(.5*ia,.48*ia,.42)},uTileB:{value:_(.06,.12,.27)},uTileC:{value:_(.2,.24,.25)},uTileD:{value:_(.03,.035,.045)},uWet:{value:i.wet},uShade:{value:new u.Vector4(1e6,1e6,H.ham.x,(H.ham.z0+H.ham.z1)/2)}}),"floor"),await t.yield();const Dt=[-1700,1700],ra=G0(L0,Re,{uGlaze:{value:_(.6,.64,.68)},uCobalt:{value:new u.Color(W0[4]).multiplyScalar(1.25)},uPlaster:{value:_(.52,.53,.49)},uShutter:{value:new u.Color(W0[5]).multiplyScalar(1.5)},uDoors:{value:new u.Vector4(Dt[0],Dt[1],c,M)}},{side:u.DoubleSide});Y(wo(),ra,"walls"),await t.yield();{const a=(A0-o0-30)/(l0+200-X),o=l0+420;Y(R0([h0,A0,X],[d0,A0,X],[d0,A0-a*(o-X),o],[h0,A0-a*(o-X),o],[0,0,0,0]),G0(L0,Xe,{uClay:{value:_(H.clay[0],H.clay[1],H.clay[2])}},{side:u.DoubleSide}),"roof")}await t.yield(),Y(await po(H),I0,"set"),await t.yield(),Y(await mo(H),I0,"tableProps"),await t.yield();const oe=Y(xo(H),Gt,"skirt");await t.yield();const se=Y(await yo(H),Gt,"ferns");oe.frustumCulled=se.frustumCulled=!1;const la=Y(J(new u.BoxGeometry(700,2050-K,36).translate(350,(2050+K)/2,0),[1,1,1],[3,0,0,0]),ra,"doorLeaf");la.position.set(Dt[c]+(M?720:-720),0,X+24),await t.yield();const ca=Y(go(H),I0,"fan");ca.position.copy(H.fan),await t.yield();const yt=U(H.ham.x,H.ham.y,H.ham.z0),gt=U(H.ham.x,H.ham.y,H.ham.z1),ne=yt.distanceTo(gt),ha=await vo(H,ne),Z0=Y(ha.cloth,I0,"hammock"),ie=Y(ha.lace,G0(L0,Ye,{},{side:u.DoubleSide,defines:{SWAY:1}}),"hammockLace",Z0);ie.frustumCulled=!1,Z0.position.copy(yt).add(gt).multiplyScalar(.5),Z0.rotation.order="YXZ";const re=Math.atan2(-(gt.z-yt.z),gt.x-yt.x);Z0.rotation.y=re,Z0.frustumCulled=!1,await t.yield();const da=Y(r0(40,10,!1,(a,o,V)=>{const z=(a-.5)*4.2;V.p[0]=Math.sin(z)*6500,V.p[2]=Math.cos(z)*6500,V.p[1]=i0(-2800,5600,o)}),new u.ShaderMaterial({uniforms:{...k,uCloudLo:{value:i.cloudLo.clone()},uCloudHi:{value:i.cloudHi.clone()},uHaze:ee,uBay:{value:i.bay.clone()},uSunGlow:{value:i.sunGlow.clone()},uRiftGain:{value:i.riftGain},uBolt:na},vertexShader:je,fragmentShader:Ze,side:u.DoubleSide}),"outside");da.frustumCulled=!1,da.renderOrder=-2,await t.yield();const le={value:i.wind},ce={value:(i.plantHaze||i.fog.clone().multiplyScalar(1.06)).clone()},he=Y(await Mo({rng:n.fork("garden"),mangoSide:p,tick:()=>t.yield()}),new u.ShaderMaterial({uniforms:{uTimeV:k.uTime,uWind:le,uHazeP:ce,uPlantGain:{value:i.plantGain},uHazeK:{value:i.hazeK},uSkyCol:k.uSkyCol,uFlash:k.uFlash},vertexShader:Je,fragmentShader:Qe,vertexColors:!0,side:u.DoubleSide}),"garden");he.frustumCulled=!1,await t.yield();const de=G0(L0,to,{uRain:{value:i.rain},uRainCol:Tt},{side:u.DoubleSide,...j0}),fe=Y(b0([R0([h0-300,K-500,l0+190],[d0+300,K-500,l0+190],[d0+300,o0+60,l0+190],[h0-300,o0+60,l0+190],[0,0,0,0]),R0([-5600,-1600,3850],[5600,-1600,3850],[5600,4400,3850],[-5600,4400,3850],[1,0,0,0])]),de,"rainCurtains");fe.renderOrder=2,await t.yield();const I=n.fork("particles"),ue=Math.max(200,Math.round(2e3*b*d*Math.sqrt(i.rain))),fa={uStageInv:k.uStageInv,uStagePos:k.uStagePos,uTimeV:k.uTime,uFlash:k.uFlash,uRainCol:Tt,uBox:{value:U(800,520,800)},uVel:{value:U(30,-170,-40)},uLen:{value:9},uWid:{value:.55},uGain:{value:i.streak}},ua=Y(pt(ue,"aSeed",4,(a,o)=>{o[0]=I(),o[1]=I(),o[2]=I(),o[3]=I()}),new u.ShaderMaterial({uniforms:fa,vertexShader:ao,fragmentShader:Ua,...j0}),"rain");ua.frustumCulled=!1,ua.renderOrder=4,await t.yield();const pe=Math.round(170*k0(b,.7,1.3)*d*(.3+.7*i.rain)),me={uTimeV:k.uTime,uFlash:k.uFlash,uRainCol:Tt,uSize:{value:6.5},uGain:{value:.3+.2*i.streak}},pa=Y(pt(pe,"aSplash",4,(a,o)=>{for(let V=0;V<30;V++)if(a%3===0){if(o[0]=I.range(-222,222),o[2]=I.range(-222,222),o[1]=225.7,Math.hypot(o[0],o[2])>172)break}else{const z=I()*c0,E=Math.sqrt(I())*610;if(o[0]=Math.cos(z)*E,o[2]=Math.sin(z)*E,o[1]=.7,Math.abs(o[0])>275||Math.abs(o[2])>275)break}o[3]=I()},!0),new u.ShaderMaterial({uniforms:me,vertexShader:so,fragmentShader:no,...At}),"splashes");pa.frustumCulled=!1,pa.renderOrder=3,await t.yield();const Nt=[],wt=(a,o,V,z,E,y0,a0,u0,N0,g0,C0)=>Nt.push([a,o,V,z,E,y0,a0,I(),u0,1/N0,g0,C0]),V0=w.hornMouth,t0=w.hornAxis;for(let a=0;a<14;a++){const o=I()*c0,V=I.range(20,105);wt(V0.x+Math.cos(o)*V,V0.y+Math.sin(o)*V*.87+t0.y*16,V0.z-Math.sin(o)*V*.5+t0.z*16,I.range(40,85),-t0.x*50,-t0.y*50,-t0.z*50,i.mouthMist,I.range(7,11),.3,2)}for(let a=0;a<26;a++)wt(I.range(-2900,2600),I.range(-500,1900),I.range(1300,2550),I.range(520,1100),I.range(-250,250),-80,I.range(-700,-300),.036+.024*i.rain,I.range(26,46),.5,0);for(let a=0;a<10;a++)wt(H.props.cup.x+I.range(-12,12),64,H.props.cup.z+I.range(-12,12),I.range(16,26),I.range(4,26),I.range(120,190),I.range(-30,0),.2,I.range(4,6.5),2.6,1);if(i.steam)for(let a=0;a<36;a++)wt(I.range(-2700,2600),K+90,I.range(-1500,2300),I.range(280,520),I.range(30,120),I.range(300,480),0,.06,I.range(14,24),1.1,1);const ma=Y(pt(Nt.length,["aBase","aMove","aMisc"],4,(a,o,V,z)=>{const E=Nt[a];o.set(E.slice(0,4)),V.set(E.slice(4,8)),z.set(E.slice(8,12))}),new u.ShaderMaterial({uniforms:{...sa(),uTimeV:k.uTime,uTime:k.uTime,uFlash:k.uFlash,uPuffA:{value:i.fog.clone().multiplyScalar(1.2)},uPuffB:{value:e==="golden"?_(1,.8,.52):e==="dusk"?_(.3,.36,.55):_(.82,.85,.85)},uPuffC:{value:e==="dusk"?i.fog.clone().multiplyScalar(1.2).lerp(_(.3,.36,.55),.25):_(1,.84,.56)},uPuffGain:{value:1}},vertexShader:eo,fragmentShader:oo,fog:!0,...j0}),"puffs");ma.frustumCulled=!1,ma.renderOrder=5;const va={uTimeV:k.uTime,uFlyCol:{value:i.flyCol.clone()},uFlyK:{value:1}};if(i.flies){const a=Y(pt(Math.round(300*d),"aFly",4,(o,V)=>{for(let z=0;z<20&&(V[0]=I.range(-2500,2500),V[1]=I.range(-500,1900),V[2]=I.range(-1900,2500),!(Math.hypot(V[0],V[2])>420||V[1]>700));z++);V[3]=I()}),new u.ShaderMaterial({uniforms:va,vertexShader:io,fragmentShader:ro,...At}),"fireflies");a.frustumCulled=!1,a.renderOrder=4}await t.yield();const xa=new u.Vector3,qt=w.hornThroat.distanceTo(w.hornMouth),ve={uMistCol:{value:e==="dusk"?k.uSkyCol.value.clone().lerp(_(xt[0],xt[1],xt[2]),.3).multiplyScalar(.8):k.uSkyCol.value.clone().lerp(_(1,.8,.46),i.mistWarm).multiplyScalar(.9)},uMistGain:{value:i.mistGain/i.exposure},uThin:{value:e==="dusk"?0:1}},xe=Y(r0(48,30,!1,(a,o,V)=>{const z=w.portalSeat.depth+.03+(.99-w.portalSeat.depth)*o;Ue(z,a*c0,xa);const E=Math.min(z,1)*qt;for(let y0=0;y0<3;y0++){const a0="xyz"[y0],u0=w.hornThroat[a0]+t0[a0]*E;V.p[y0]=u0+(xa[a0]-u0)*.62}V.d[0]=a,V.d[1]=z}),G0(L0,co,ve,{side:u.DoubleSide,...At}),"hornMist");xe.renderOrder=3,await t.yield();const ya={uThroat:k.uThroat,uHornAxis:k.uHornAxis,uHX:k.uHX,uHY:k.uHY,uTimeV:k.uTime,uFlash:k.uFlash,uStream:{value:0},uGain:{value:1},uAx0:{value:w.portalSeat.depth*qt+1},uAx1:{value:qt+70},uRainCol:{value:e==="dusk"?_(.5,.62,1):e==="golden"?_(1.3,.95,.46):_(1,.9,.64)}},ga=Y(pt(Math.round(240*d),"aSeed",4,(a,o)=>{o[0]=I(),o[1]=Math.sqrt(I()),o[2]=I(),o[3]=I()}),new u.ShaderMaterial({uniforms:ya,vertexShader:lo,fragmentShader:Ua,...j0}),"boreDrops");ga.frustumCulled=!1,ga.renderOrder=4,await t.yield();const wa={uCor:{value:0}},Ma=U(w.dripLanding.x,w.recordY,w.dripLanding.z),D0=Y(bo(I),G0(fo,uo,wa,{side:u.DoubleSide,...j0}),"coronet");D0.frustumCulled=!1,D0.renderOrder=2,D0.visible=!1,D0.position.copy(Ma),await t.yield();const w0=U(1,0,0),ye=U(0,1,0),P0=new u.Vector3().crossVectors(t0,w0).normalize(),Mt=.5,ba=w0.clone().multiplyScalar(Math.cos(Mt)).addScaledVector(P0,Math.sin(Mt)),ge=w0.clone().multiplyScalar(-Math.sin(Mt)).addScaledVector(P0,Math.cos(Mt)),za=V0.clone().addScaledVector(t0,36).addScaledVector(ba,100),Sa=ba.clone().multiplyScalar(.55).addScaledVector(ge,-.75).addScaledVector(t0,-.36).normalize(),Pa=(a,o)=>o.copy(za).multiplyScalar((1-a)*(1-a)).addScaledVector(we,2*a*(1-a)).addScaledVector(Fa,a*a),f0=new u.Group;f0.name=f?"morpho":"hummingbird",g.add(f0);let bt=null;if(f){const a=So();Y(a.body,I0,"morphoBody",f0),bt=[1,-1].map(o=>{const V=new u.Group;return V.scale.x=o,f0.add(V),Y(a.wing,I0,"morphoWing",V),V}),f0.scale.setScalar(.9)}else{f0.scale.setScalar(.78);const a=zo(H);Y(a.body,I0,"hummingbirdBody",f0);const o=Y(a.wings,G0(L0,ho,{uWingCol:{value:k.uSkyCol.value.clone().lerp(_(1,1,1),.45).multiplyScalar(e==="dusk"?1.5:.95)}},{side:u.DoubleSide,...j0}),"hummingbirdWings",f0);o.renderOrder=3}await t.yield();const Ot=G.axis+.03,ka=.04,Wt=Ot+ka,it=G.mouth-.095,_t=G.mouth-.05,we=V0.clone().addScaledVector(t0,70).addScaledVector(P0,-125).addScaledVector(w0,46),Fa=V0.clone().addScaledVector(t0,12).addScaledVector(P0,-34).addScaledVector(w0,-56),It=f?V0.clone().addScaledVector(t0,-22).addScaledVector(P0,-44).addScaledVector(w0,-70):V0.clone().addScaledVector(t0,-10).addScaledVector(P0,-30).addScaledVector(w0,-46),Va=V0.clone().addScaledVector(t0,6).addScaledVector(P0,-70).addScaledVector(w0,-150),Ca=V0.clone().addScaledVector(t0,60).addScaledVector(P0,-30).addScaledVector(w0,-260),Ta=(a,o,V,z,E)=>E.copy(a).multiplyScalar((1-z)*(1-z)).addScaledVector(o,2*z*(1-z)).addScaledVector(V,z*z),x0=new u.Vector3,E0=new u.Vector3,Lt=new u.Vector3,Aa=new u.Vector3,Me=new u.Matrix4,zt=new u.Vector3,rt=(a,o,V=0)=>{E0.copy(o).normalize(),Lt.crossVectors(ye,E0).normalize(),Aa.crossVectors(E0,Lt),a.quaternion.setFromRotationMatrix(Me.makeBasis(Lt,Aa,E0)),V&&a.rotateZ(V)},Ga=[],be=Math.atan2(-H.cageSide.z,H.cageSide.x);{const a=s?[[.72,-64,1],[.64,60,-1]]:[[.88,0,1]],o=e==="dusk"?2.3:1,V=s?Ya(q([.72,.56,.08],o),q([.8,.66,.12],o),[.62,.42,.3],q([.5,.42,.1],o)):Ya(q([.05,.36,.1],o),q([.3,.42,.06],o),[.6,.56,.42],q([.04,.2,.12],o));for(const[z,E,y0]of a){const a0=new u.Group;a0.scale.setScalar(z*1.15*H.cageK),g.add(a0),Y(V.body,I0,"cageBird",a0);const u0=[1,-1].map(N0=>{const g0=new u.Group;return g0.position.set(N0*24,80,-2),g0.scale.x=N0,a0.add(g0),Y(V.wing,I0,"cageBirdWing",g0),g0});Ga.push({grp:a0,wings:u0,x0:E,dir:y0,ph:I()*6})}}await t.yield();const Bt=Y(await Po(H),Gt,"gecko");Bt.frustumCulled=!1;const Da=U(-206,225.4,-50),Ht=U(-214,225.4,105),Et=U(-166,225.4,180.5),Na=U(70,225.4,198),Ut=new u.Vector3,St=new u.Vector3;await t.yield();const ze=G.ride1-G.ride0,lt=.2462,Se=.012,qa=.03,Pe=.5+Math.sqrt(Math.max(w.dripLip.y-4.6-w.recordY-.6,1)/20)/4,Oa=lt-Math.min(Pe,1)*qa,M0=G.ride0+.8*ze,ke=a=>a<M0?0:T(M0,M0+.0022,a)*Math.exp(-Math.max(a-M0-.0022,0)/.0045),ct=new u.Vector3,Fe=new u.Vector3,Ve=new u.Vector3,Ce=new u.Vector3,Te=new u.Vector3,Ae=new u.Vector3,Ge=(a,o)=>nt(Ae.copy(V0).addScaledVector(P0,-66*(1-T(G.axis+.012,G.axis+.085,o))),a,o,Te),De=(a,o)=>{const V=st(Y0,o),z=W(S[0][0],S[1][0],S[2][0],V)+.02*Math.sin(a*.37),E=W(S[0][1],S[1][1],S[2][1],V)+.012*Math.sin(a*.53);return C(V,ct),ct.x+=Math.sin(z)*Math.cos(E)*260,ct.y+=Math.sin(E)*260,ct.z+=Math.cos(z)*Math.cos(E)*260,nt(ct,a,o,Fe)},Ne=U(-250,430,l0-100),qe=U(H.ham.x-150,H.ham.y-H.ham.sag+O0.hamY,-40),Oe=U(H.cage.x,H.cage.y+O0.cageY,H.cage.z),We=new u.Vector3,_e=[{at:De,from:G.settle-.04,to:G.free+.04,weight:.92,fade:.12},{at:(a,o)=>nt(Ne,a,o,Ve),from:G.free+.004,to:G.turn0-.01,weight:.72,fade:.25},{at:(a,o)=>nt(qe,a,o,Ce),from:G.turn0+O0.h0,to:i0(G.turn0,G.turn1,O0.h1),weight:O0.hw,fade:.3},{at:(a,o)=>nt(Oe,a,o,We),from:i0(G.turn0,G.turn1,O0.c0),to:G.axis+O0.c1,weight:O0.cw,fade:.3},{at:Ge,from:i0(G.turn0,G.turn1,O0.n0),to:G.mouth-.015,weight:.86,fade:O0.nf}],K0=new u.Vector3,$t=a=>1-.24*ea(a)+.2*T(G.free,G.free+.05,a)*(1-T(G.turn0-.06,G.turn0-.01,a))-.3*T(G.turn0-.01,G.turn0+.03,a)*(1-T(G.turn1-.01,G.axis,a));let Pt=0;for(let a=0;a<65;a++)Pt+=1/k0($t(a/64),.35,2.5);return Pt=Pt/65/aa,{scene:l,path:et,duration:aa,pace:$t,camera:{fov:62,near:1,far:7800,lookAhead:14,sway:.35,bank:.25},pois:_e,portal:{shape:"circle",radius:w.portalSeat.radius,color:i.portal,glow:.22,tilt:!0,revealDistance:620},post:{exposure:i.exposure,bloom:i.bloom,grade:{saturation:i.saturation,contrast:1.05,tint:i.tint,shadowTint:i.shadowTint,vignette:.3,grain:.02,aberration:0}},ride:"none",beats:{...G,drip:Oa,land:lt,flash:M0,dart:Ot,lead:Wt,away:it,gone:_t,hammock:G.turn0+.03,cage:i0(G.turn0,G.turn1,.75),look:e,rare:m,morpho:f,canaries:s,hamStriped:v},update(a,o,V,z){const E=st(Y0,z);g.rotation.y=st(H0,z),g.position.y=oa(o,z);const y0=m?ke(z):0,a0=m&&z>M0?T(M0,M0+.0012,z):0,u0=Math.max(z-M0,0),N0=a0*(3+5.5*Math.exp(-u0/.006)*(.6+.4*Math.cos(u0*900)));P.setNeedle(82-12*E-N0),P.setHop(a0*5*Math.exp(-u0/.0035)*Math.abs(Math.cos(u0*520))),P.setFlash(y0*.38),na.value=y0;const g0=(z-Oa)/qa;P.setDrip(g0>0&&g0<1?Math.max(g0,.002):0);const C0=(z-lt)/Se;if(D0.visible=C0>0&&C0<7,D0.visible){wa.uCor.value=Math.min(C0,1);const $=(z-lt)/($t(lt)*Pt),v0=P.recordAngle(o)-P.recordAngle(o-$);S0(Ma,v0,D0.position),D0.position.y=w.recordY+P.warpAtXZ(o,D0.position.x,D0.position.z)+.2}P.update(a,o,V);const Wa=.52+.2*(Math.sin(o*.55)+.3*Math.sin(o*1.9));la.rotation.y=M?Math.PI+Wa:-Wa,ca.rotation.y=o*1.15,Z0.rotation.x=.075*Math.sin(o*.8)+.018*Math.sin(o*2.1+1),fa.uGain.value=i.streak*(1-T(G.mouth-.07,G.mouth-.015,z)),ya.uStream.value=T(G.mouth-.11,G.mouth-.03,z),va.uFlyK.value=1+.8*T(G.free,G.turn0,z)*(1-T(G.axis,G.axis+.06,z));const _a=Math.sin(k.uSwell.value*c0),Ia=m?T(M0,M0+.004,z)*(1-T(M0+.03,M0+.06,z)):0;for(const $ of Ga){const v0=o*.22+$.ph,Ft=Math.floor(v0),Be=v0-Ft,La=Ft%2?-1:1,Yt=T(.55,.75,Be),Ba=$.x0+$.dir*La*i0(-48,48,Yt)*(s?.4:1);$.grp.position.set(H.cage.x+H.cageSide.x*Ba,H.cage.y-50*H.cageK+8+13*Math.sin(Math.PI*Yt)*(Yt<1?1:0)+5*_a+20*Ia*Math.abs(Math.sin(o*9)),H.cage.z+H.cageSide.z*Ba),$.grp.rotation.y=be+$.dir*.35*Math.sin(o*.31+$.ph)+.25*La,$.grp.rotation.x=.1*_a;const Ha=Ia*(.9+.8*Math.sin(o*26));$.wings[0].rotation.z=-1.38+Ha*1.5,$.wings[1].rotation.z=1.38-Ha*1.5}const dt=(z-Ot)/ka;if(f0.visible=z<_t,dt<=0){const $=14+12*Math.sin(o*1.3)*Math.sin(o*.37+1);x0.copy(za).addScaledVector(Sa,12-$),x0.x+=2.5*Math.sin(o*5.3),x0.y+=3*Math.sin(o*3.7+1)+(f?9*Math.sin(o*4.4):0),x0.z+=2*Math.sin(o*4.1+2),f0.position.copy(x0),rt(f0,K0.copy(Sa).addScaledVector(t0,.12*Math.sin(o*.6)),.12*Math.sin(o*2.3))}else if(dt<1){const $=dt*dt*(3-2*dt),v0=Math.min($+.02,1.02);Pa($,x0),Pa(v0,zt),f0.position.copy(x0),rt(f0,K0.subVectors(zt,x0).normalize().lerp(f?E0.copy(t0).multiplyScalar(-1).addScaledVector(w0,-.5):E0.copy(w0).addScaledVector(t0,-.3).addScaledVector(P0,.25),T(.7,1,$)),-.5*Math.sin(Math.PI*$))}else if(z<it){const $=(z-Wt)/(it-Wt),v0=T(0,.25,$);x0.copy(Fa).lerp(It,$*$*(3-2*$)),x0.x+=v0*5*Math.sin(o*2.9),x0.y+=v0*(4*Math.sin(o*3.7+1)+(f?8*Math.sin(o*4.4):0)),x0.z+=v0*3*Math.sin(o*2.3+2),f0.position.copy(x0),f?rt(f0,K0.copy(t0).multiplyScalar(-1).addScaledVector(w0,-.5+.2*Math.sin(o*.9)),.15*Math.sin(o*2.3)):rt(f0,K0.copy(w0).addScaledVector(t0,-.3).addScaledVector(P0,.25+.1*Math.sin(o*.9)),-.1*v0+.08*Math.sin(o*2.3))}else{const $=k0((z-it)/(_t-it),0,1),v0=$*$,Ft=Math.min(v0+.02,1.02);Ta(It,Va,Ca,v0,x0),Ta(It,Va,Ca,Ft,zt),f0.position.copy(x0),rt(f0,K0.subVectors(zt,x0).normalize().lerp(f?E0.copy(t0).multiplyScalar(-1).addScaledVector(w0,-.5):E0.copy(w0).addScaledVector(t0,-.3).addScaledVector(P0,.25),1-T(0,.3,v0)),(f?0:-.1*(1-T(0,.3,v0)))+.4*Math.sin(Math.PI*v0))}if(bt){const $=.15+1.05*Math.abs(Math.sin(o*4.4));bt[0].rotation.z=$,bt[1].rotation.z=-$}const U0=T(.012,.062,z),kt=1-U0;Ut.copy(Da).multiplyScalar(kt*kt).addScaledVector(Ht,2*U0*kt).addScaledVector(Et,U0*U0),St.copy(Ht).sub(Da).multiplyScalar(kt).addScaledVector(K0.copy(Et).sub(Ht),U0);const J0=m?T(M0+.0015,M0+.03,z):0,Ie=Math.sin(Math.PI*U0)+Math.sin(Math.PI*J0);J0>0&&(St.lerp(K0.copy(Na).sub(Et),Math.min(1,J0*6)),Ut.lerp(Na,J0));const Le=Math.sin((U0*250+J0*240)*.09);Bt.position.copy(Ut),Bt.rotation.y=Math.atan2(St.x,St.z)+.36*T(.7,1,U0)*(1-J0)+.22*Le*Ie+.03*Math.sin(o*.7)-2.25*(1-T(.008,.03,z))},dispose(){P.dispose?.()}}}};export{Co as default};
