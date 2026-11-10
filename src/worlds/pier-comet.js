import*as m from"three";import{makePath as jt}from"../kit/core.js";import{makeSky as Qt}from"../kit/sky.js";import*as Pt from"../kit/water.js";import*as Ze from"../kit/fauna.js";import{buildHero as Zt,Geo as U0}from"../parts/pier-comet.js";const T0=["#0E1630","#1E6A7A","#4A2F7A","#FFB59A","#7FF0CF","#FF7EB6","#F6FBFF"],g0=95,uo=-50,o0=-68,e0=-32,h0=330,w=8,R=-35,Xe=.95,ge=1.3,ee=40,Xt=!1,Jt=`
attribute vec3 aCol; attribute vec3 aGlow; attribute float aFx;
uniform float uTime; uniform vec2 uRes;
varying vec3 vCol, vGlow, vN, vW, vL, vS; varying float vFx;
#include <fog_pars_vertex>
void main(){
  vec3 p = position, n = normal;
  vL = vec3(0.0); vS = vec3(1.0);
#ifdef USE_INSTANCING
  vL = position; vS = vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz));
  #ifndef PILE
  // thin timbers far away are widened to hold a pixel and a bit, so the lattice never breaks into sparkle
  float minW = 1.3*2.0*length(cameraPosition - (modelMatrix*vec4(instanceMatrix[3].xyz, 1.0)).xyz)/(uRes.y*projectionMatrix[1][1]);
  p *= mix(clamp(vec3(minW)/max(vS, vec3(1e-3)), vec3(1.0), vec3(8.0)), vec3(1.0), step(vec3(0.7), vS));
  #endif
  p = (instanceMatrix*vec4(p, 1.0)).xyz; n = mat3(instanceMatrix)*n;
  vGlow = vec3(0.0); vFx = 0.0;
  #ifdef USE_INSTANCING_COLOR
  vCol = instanceColor;
  #else
  vCol = vec3(0.7);
  #endif
  #ifdef PILE
  // a skirt of weed below the tide mark, swinging with the swell
  float sk = 1.0 - smoothstep(1.1, 3.0, p.y);
  vec2 rad = normalize(n.xz + vec2(1e-5, 0.0));
  p.xz += rad*sk*(0.09 + 0.07*sin(uTime*2.3 + p.y*3.0 + p.x*1.7 + p.z*2.3));
  p.xz += vec2(0.10, 0.17)*sk*sk*sin(uTime*1.1 + p.x*0.31 + p.z*0.17);
  vFx = 20.0;
  #endif
#else
  vCol = aCol; vGlow = aGlow; vFx = aFx;
  float fl = step(0.001, aFx)*step(aFx, 1.5);
  p.xz += fl*vec2(sin(uTime*5.3 + p.y*2.4 + aFx*40.0), sin(uTime*4.1 + p.x*3.0 + aFx*31.0))*0.11;
  p.y += fl*sin(uTime*6.1 + p.x*2.0 + p.z*2.0)*0.05;
  float bob = step(1.9, aFx)*step(aFx, 3.1);
  p.y += bob*sin(uTime*2.2 + aFx*17.0)*0.32;
#endif
  vec4 w = modelMatrix*vec4(p, 1.0);
  vN = normalize(mat3(modelMatrix)*n + vec3(0.0, 1e-5, 0.0));
#ifdef MIRROR
  w.y = -1.3*w.y; float dep = max(0.0, -w.y);
  w.x += sin(w.y*0.42 + uTime*1.6 + w.z*0.3)*0.02*min(dep, 22.0);
  vN.y = -vN.y;
#endif
  vW = w.xyz;
  vec4 mvPosition = viewMatrix*w;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Yt=`
uniform vec3 uSky, uGround, uRim, uRimDir, uPalA, uPalB, uPalC;
uniform float uTime, uFlash, uGlowK, uWaveZ, uWin;
varying vec3 vCol, vGlow, vN, vW, vL, vS; varying float vFx;
#include <fog_pars_fragment>
float h21(vec2 p){ p = fract(p*vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x*p.y); }
float vn2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f); return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y); }
float boxAA(vec2 f, vec2 c, vec2 hs, vec2 aw){ vec2 d = abs(f - c) - hs; return (1.0 - smoothstep(-aw.x, aw.x, d.x))*(1.0 - smoothstep(-aw.y, aw.y, d.y)); }
void main(){
  vec3 N = normalize(vN);
  vec3 amb = mix(uGround, uSky, N.y*0.5 + 0.5)*(0.9 + 0.1*dot(N, vec3(0.41, 0.0, 0.91)));
  float rim = max(dot(N, uRimDir), 0.0); rim *= rim;
  float camD = length(vW - cameraPosition);
  // the pier's bulbs light whatever stands near them, in slow mint and pink pools
  float near = exp(-max(abs(vW.x + 50.0) - 18.0, 0.0)/30.0)*smoothstep(-40.0, 10.0, vW.z)*(1.0 - smoothstep(330.0, 430.0, vW.z))*exp(-max(abs(vW.y) - 30.0, 0.0)/30.0);
  float s = 0.5 + 0.5*sin(vW.z*0.09 + vW.y*0.13 + sin(vW.x*0.11)*2.0 + uTime*0.25);
  float lit = uGlowK*step(vW.z, uWaveZ);
  vec3 glow = (mix(mix(uPalA, uPalB, s), uPalC, 0.45)*(0.03 + 0.15*near) + vGlow)*lit;
  vec3 alb = vCol;
  if (vFx > 5.5 && vFx < 7.5) {            // deck planks
    float pl = abs(fract(vW.x*1.6) - 0.5);
    alb *= (0.72 + 0.28*smoothstep(0.03, 0.09, pl))*(0.85 + 0.3*h21(vec2(floor(vW.x*1.6), floor(vW.z*0.11 + h21(vec2(floor(vW.x*1.6), 3.0))*7.0))));
    glow *= 0.55*smoothstep(-0.1, 0.4, N.y);
  }
#ifdef USE_INSTANCING
  #ifdef PILE
  float bn = h21(floor(vec2(vW.x + vW.z, vW.y)*7.0));
  float weed = 1.0 - smoothstep(1.4, 2.6, vW.y + 0.5*vn2(vec2((vW.x + vW.z)*3.0, vW.y*1.5))), barn = (1.0 - smoothstep(0.1, 0.75, abs(vW.y - 3.0)))*(1.0 - weed);
  alb *= 0.75 + 0.5*vn2(vec2((vW.x + vW.z)*9.0, vW.y*0.7));
  alb = mix(alb, vec3(0.035, 0.085, 0.05)*(0.6 + 0.8*vn2(vec2((vW.x - vW.z)*5.0, vW.y*2.0 + uTime*0.3))), weed);
  alb = mix(alb, vec3(0.5, 0.52, 0.47), barn*(0.3 + 0.7*step(0.35, bn)));
  #else
  // timber seen close: darker joints and arrises, grain along the length, weathered paint
  vec3 qd = (0.5 - abs(vL))*vS;
  float edge = qd.x + qd.y + qd.z - min(qd.x, min(qd.y, qd.z)) - max(qd.x, max(qd.y, qd.z));
  vec3 lp = vL*vS; float al, ac;
  if (vS.y >= max(vS.x, vS.z)) { al = lp.y; ac = lp.x + lp.z; } else if (vS.x >= vS.z) { al = lp.x; ac = lp.y + lp.z; } else { al = lp.z; ac = lp.x + lp.y; }
  float nk = 1.0 - smoothstep(10.0, 42.0, camD), seed = h21(floor(vW.xz*0.5));
  float grain = vn2(vec2(al*1.1 + seed*17.0, ac*42.0)), wear = vn2(vec2(al*0.35 + seed*5.0, (vW.y + ac)*1.3));
  alb *= mix(0.96, (0.62 + 0.38*smoothstep(0.0, 0.03, edge))*(0.86 + 0.16*grain)*(0.84 + 0.22*wear), nk);
  alb *= 0.9 + 0.14*smoothstep(-0.5, 0.5, vL.y)*step(max(vS.x, vS.z), vS.y);
  #endif
#endif
  vec3 col = alb*(amb*(1.0 + uFlash*3.0) + uRim*rim + glow);
  if (vFx > 7.5 && vFx < 8.5) {            // the town's seafront: sash windows, drawn where the wall is
    vec2 g = vec2(dot(vW.xz, vec2(abs(N.z), abs(N.x))), vW.y)/vec2(2.4, 3.2), c = floor(g), f = fract(g), aw = fwidth(g)*0.75 + 1e-4;
    float far = smoothstep(0.2, 0.55, max(aw.x, aw.y)), r = h21(c + 0.37), shop = step(vW.y, 3.2);
    vec2 hs = mix(vec2(0.2, 0.29), vec2(0.4, 0.33), shop);
    float win = boxAA(f, vec2(0.5, 0.5), hs, aw), frame = boxAA(f, vec2(0.5, 0.5), hs + vec2(0.045, 0.035), aw) - win;
    float bars = max(1.0 - smoothstep(0.0, 0.018 + aw.x, abs(f.x - 0.5)), (1.0 - smoothstep(0.0, 0.014 + aw.y, abs(f.y - 0.52)))*(1.0 - shop));
    float on = step(r, 0.14 + 0.36*min(uWin, 1.0) + 0.3*shop*min(uWin, 1.0));
    vec3 wc = r > 0.42 ? uPalB : (r > 0.34 ? uPalA : uPalC);
    vec3 lamp = wc*uWin*(0.75 + 0.25*sin(uTime*(0.6 + r*2.0) + r*40.0))*(0.55 + 0.45*smoothstep(0.0, 1.0, f.y))*step(vW.z, uWaveZ + 400.0);
    vec3 glass = mix(uSky*0.55 + uRim*rim*0.6, lamp, on)*(1.0 - 0.6*bars*(1.0 - far));
    float cover = mix(win, 4.0*hs.x*hs.y, far);
    col = mix(col, glass, cover);
    col = mix(col, col*1.25 + uSky*0.05, frame*(1.0 - far)*0.8);
    col *= 1.0 - 0.18*(1.0 - far)*(1.0 - smoothstep(0.0, 0.05, f.y))*(1.0 - shop);          // string course under each storey
  }
  if (vFx > 8.5 && vFx < 9.5) {            // slate roofs
    float sl = fract(vW.y*2.6 + vW.x*0.02), aws = fwidth(vW.y*2.6);
    col *= 0.86 + 0.14*mix(smoothstep(0.0, 0.2, sl), 0.5, smoothstep(0.3, 0.9, aws));
  }
  if (vFx > 3.5 && vFx < 5.5) {            // chrome: bulbs slide along it as streaks
    float a = fract(vW.x*0.9 + vW.z*0.37 + vW.y*0.5), b = fract(vW.x*0.6 - vW.z*0.53 + 0.4);
    float sa = smoothstep(0.42, 0.5, a)*(1.0 - smoothstep(0.5, 0.58, a)), sb = smoothstep(0.44, 0.5, b)*(1.0 - smoothstep(0.5, 0.56, b));
    col = alb*(amb*1.6 + uRim*(0.4 + rim)) + (uPalA*sa + uPalB*sb)*lit*1.5 + uPalC*0.25*pow(max(N.y, 0.0), 6.0);
  }
  if (vFx > 11.5 && vFx < 12.5) col *= 0.45 + 0.9*step(0.5, fract(vW.y*3.0 - uTime*5.0));   // the lift chain
#ifdef MIRROR
  col *= 0.6*exp(-max(0.0, -vW.y)*0.008);
#endif
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,$t=`
attribute vec3 iPos; attribute vec4 iA;
uniform float uTime, uLit, uWaveZ, uMirror, uHalo, uFogD, uFogKeep, uSprayT; uniform vec2 uRes, uSea; uniform vec3 uPal[3]; uniform vec3 uFlock;
varying vec2 vQ; varying vec3 vC; varying float vMode, vI, vH, vPh;
vec3 kiteSway(float ph, float t){ return vec3(sin(t*0.5 + ph*20.0)*3.0, sin(t*0.83 + ph*31.0)*2.2, cos(t*0.41 + ph*13.0)*2.0); }
void main(){
  float mode = iA.w, ph = iA.y, t = uTime;
  vec3 lp = iPos;
  if (mode > 5.5 && mode < 6.5) {          // sanderlings: the flock runs and turns as one
    lp.xz += uFlock.xz; lp.x += sin(t*0.9 + ph*30.0)*1.2 + sin(t*0.37 + uFlock.y)*6.0*fract(ph*7.0); lp.y += abs(sin(t*9.0 + ph*50.0))*0.05;
  }
  float I = 1.0, size = iA.z;
  if (mode > 8.5) {                        // spray: a slap of drops from the left, over the nose and gone
    float tau = uSprayT - fract(ph*7.0)*0.25, live = step(0.0, tau)*step(tau, 1.1);
    vec3 v0 = vec3(3.2 + 3.0*fract(ph*13.0), 3.4 + 2.6*fract(ph*29.0), 2.0 + 5.0*fract(ph*41.0));
    lp += v0*tau + vec3(0.0, -6.5*tau*tau, 0.0);
    I = live*(1.0 - smoothstep(0.5, 1.1, tau)); size *= 1.0 + 1.6*tau;
  }
  vec4 w = modelMatrix*vec4(lp, 1.0);
  if (mode < 0.5) I = 0.86 + 0.14*sin(t*3.0 + ph*50.0);
  else if (mode < 1.5) { w.x += sin(t*1.1 + ph*6.283 + w.z*0.05)*0.16; w.y += sin(t*1.7 + ph*9.0)*0.05; I = 0.9 + 0.1*sin(t*2.3 + ph*40.0); }
  else if (mode < 2.5) { w.x += sin(t*0.31 + ph*37.0)*2.2 + sin(t*0.13 + ph*11.0)*1.5; w.z += cos(t*0.23 + ph*23.0)*3.0; w.y += abs(sin(t*2.6 + ph*60.0))*0.16; I = 0.5; }
  else if (mode < 3.5) { float c = fract(ph - t*0.45); I = 0.25 + 1.3*smoothstep(0.7, 1.0, c) + 0.5*(1.0 - smoothstep(0.0, 0.2, c)); }
  else if (mode < 4.5) { float r = fract(t*0.021 + ph); w.y += r*120.0; w.x += r*38.0 + sin(t*0.8 + ph*20.0)*0.8; w.z -= r*26.0; I = smoothstep(0.0, 0.03, r)*(1.0 - smoothstep(0.8, 1.0, r)); }
  else if (mode < 5.5) { w.xyz += kiteSway(ph, t); }
  else if (mode > 6.5 && mode < 7.5) { w.x += t*1.2 + sin(t*0.2 + ph*9.0)*4.0; I = 0.5 + 0.5*sin(t*0.3 + ph*20.0); }
  float bulb = step(mode, 1.5) + step(2.5, mode)*step(mode, 3.5);
  I *= mix(1.0, uLit*step(w.z, uWaveZ), bulb);
  float tall = 1.0, onSea = 0.0;
  if (uMirror > 0.5) {
    w.y = -1.3*w.y; w.x += sin(w.y*0.42 + t*1.6 + w.z*0.3)*0.02*min(-w.y, 22.0); I *= 0.55;
    // seen in the sea, not the sand: lay the light on the water as a long wobbling streak
    float f = clamp((cameraPosition.y - uSea.x)/max(cameraPosition.y - w.y, 0.05), 0.0, 1.0);
    vec3 sp = cameraPosition + (w.xyz - cameraPosition)*f;
    if (sp.z > uSea.y && cameraPosition.y > uSea.x + 0.3) {
      size *= f; tall = 3.6; onSea = 1.0; I *= 0.9;
      w.xyz = sp + vec3(sin(t*2.1 + sp.z*0.9 + ph*40.0)*size*1.6, 0.45, 0.0);
    } else if (sp.z > uSea.y - 3.0 || iPos.z > uSea.y + 4.0) I = 0.0;
  }
  vec4 mv = viewMatrix*w;
  float dist = max(-mv.z, 0.01);
  float px = 2.0*dist/(uRes.y*projectionMatrix[1][1]);       // metres per pixel at this depth
  I *= mix(1.0, 0.25 + 0.75*smoothstep(10.0, 70.0, dist), onSea);   // streaks on the water are a far-off glitter, not blocks beside the car
  float minS = px*(0.75 + bulb*0.4 + step(5.5, mode)*step(mode, 6.5)*0.5);
  if (mode > 4.5 && mode < 5.5) size = min(size, px*17.0);   // a kite never fills the sky
  float s2 = max(size, minS);
  I *= mix(1.0, clamp((size*size)/(s2*s2), 0.22, 1.0), bulb);
  I *= mix(1.0, 0.4, bulb*smoothstep(5.0, 28.0, size/px));
  // in fog a lamp fades and its halo swells with distance
  float hK = uHalo + bulb*max(uHalo, 0.0)*min(dist*0.012, 2.2);
  float qf = 1.0 + bulb*(1.6 + hK);
  float fogF = exp(-uFogD*uFogD*dist*dist);
  I *= mix(fogF, 1.0, uFogKeep*bulb);
  vQ = position.xy*qf; vMode = mode; vI = I; vH = hK; vPh = ph;
  vC = iA.x < 0.5 ? uPal[0] : (iA.x < 1.5 ? uPal[1] : uPal[2]);
  if (mode > 7.5 && mode < 8.5) {          // the kite's string: a hair of light from the flyer's hand to the kite
    float k = position.y*0.5 + 0.5;
    vec3 top = iPos + kiteSway(ph, t) + vec3(0.0, -1.2, 0.0), foot = vec3(iPos.x - iA.z*0.55, 1.2, iPos.z + iA.z*0.3);
    vec3 q = mix(foot, top, k) - vec3(0.0, iA.z*0.16*sin(k*3.14159), 0.0);
    mv = viewMatrix*modelMatrix*vec4(q, 1.0);
    float d8 = max(-mv.z, 0.01);
    mv.x += position.x*0.8*2.0*d8/(uRes.y*projectionMatrix[1][1]);
    vI = 1.0 - smoothstep(60.0, 420.0, d8)*0.6;
  } else if (mode > 4.5 && mode < 5.5) mv.xy += position.xy*s2*vec2(1.0, 3.0) + vec2(0.0, -2.0*s2);     // the diamond sits at the top of a tall quad; its tail hangs below
  else mv.xy += position.xy*s2*qf*vec2(1.0, tall);
  if (dist < 0.9 || vI < 0.004) mv.z = 1e6;
  gl_Position = projectionMatrix*mv;
}`,eo=`
uniform float uSolid, uCore, uTime; uniform vec3 uShade;
varying vec2 vQ; varying vec3 vC; varying float vMode, vI, vH, vPh;
void main(){
  float d = length(vQ);
  if (uSolid > 0.5) {
    float a; vec3 c = vC;
    if (vMode > 7.5 && vMode < 8.5) { a = (1.0 - abs(vQ.x))*0.55; c = vec3(0.92); }
    else if (vMode > 8.5) { a = (1.0 - smoothstep(0.3, 1.0, d))*0.75; c = vec3(1.25, 1.3, 1.35); }
    else if (vMode > 4.5 && vMode < 5.5) {
      // a diamond kite: two-tone panels, a cross spar, and a ribbon tail with bows that snakes in the wind
      vec2 q = vec2(vQ.x, (vQ.y - 0.6667)*3.0);
      float dm = abs(q.x) + abs(q.y*0.8 + 0.12), kite = 1.0 - smoothstep(0.84, 0.92, dm);
      float spar = max(1.0 - smoothstep(0.03, 0.07, abs(q.x)), 1.0 - smoothstep(0.03, 0.07, abs(q.y - 0.18)));
      vec3 kc = mix(c, mix(vec3(0.95), c*0.45, step(0.5, fract(vPh*5.0))), step(0.0, q.x*(q.y - 0.18)));
      kc = mix(kc, vec3(0.2, 0.18, 0.25), spar*0.7);
      float ty = clamp((0.28 - vQ.y)/1.28, 0.0, 1.0);                       // 0 at the kite's foot, 1 at the tail's end
      float tx = sin(ty*9.0 - uTime*4.0 + vPh*30.0)*0.3*ty;
      float bow = 1.0 - smoothstep(0.03, 0.1, abs(fract(ty*4.0) - 0.5));
      float tail = (1.0 - smoothstep(0.05 + 0.16*bow, 0.1 + 0.18*bow, abs(vQ.x - tx)))*step(vQ.y, 0.3)*step(0.001, ty)*(1.0 - smoothstep(0.92, 1.0, ty));
      a = max(kite, tail); c = mix(mix(vec3(0.95), c, bow), kc, kite);
    }
    else if (vMode > 5.5) { a = 1.0 - smoothstep(0.6, 1.0, d); c = vec3(0.86, 0.86, 0.84); }
    else { a = 1.0 - smoothstep(0.9, 1.0, d); c *= 0.6 + 0.5*(1.0 - smoothstep(0.0, 1.2, length(vQ - vec2(-0.3, 0.35)))); }
    if (a < 0.02) discard;
    gl_FragColor = vec4(c*uShade, a*clamp(vI, 0.0, 1.0));
    return;
  }
  vec3 col;
  if (vMode > 1.5 && vMode < 2.5) col = vC*exp(-d*d*3.2)*0.34*vI;                       // crowd: a soft pastel dot
  else if (vMode > 6.5) col = vC*exp(-d*d*2.5)*0.05*vI;                                 // smoke
  else {
    float core = 1.0 - smoothstep(0.82, 1.0, d), halo = exp(-d*d*2.2/(1.0 + 0.8*max(vH, -0.6)))*(0.16 + 0.2*min(vH, 1.6))*(1.0 - smoothstep(1.0, 2.6 + vH, d));
    col = vC*(core*uCore + halo)*vI;
    col += vec3(1.0)*core*(1.0 - smoothstep(0.0, 0.5, d))*0.8*vI;
  }
  gl_FragColor = vec4(col, 0.0);
}`,to=`
attribute vec4 aSpark; attribute vec4 aBurst;
uniform float uTime, uPeriod, uRise, uMirror, uGain, uNA, uNL, uFogD; uniform vec2 uSea; uniform vec3 uSiteA, uSiteB, uAreaA, uAreaB, uWind; uniform vec3 uPal[3];
uniform vec3 uKeyPos[3]; uniform float uKeyTau[3];
varying vec2 vUv; varying vec3 vC; varying float vI;
vec3 h33(vec3 p){ p = fract(p*vec3(0.1031, 0.1030, 0.0973)); p += dot(p, p.yxz + 33.33); return fract((p.xxy + p.yxx)*p.zyx); }
vec3 fwPos(vec3 c, vec3 dir, float sp, float drag, float grav, float te){
  // heavy drag stops the spark early; then it only falls, and drifts on the wind
  return c + dir*sp*(1.0 - exp(-drag*te))/drag - vec3(0.0, grav*te*te*0.5/(1.0 + te*0.3), 0.0) + uWind*te*(0.5 + 0.3*te);
}
float gSea;
vec3 seaLay(vec3 m){
  float f = clamp((cameraPosition.y - uSea.x)/max(cameraPosition.y - m.y, 0.05), 0.0, 1.0);
  vec3 sp = cameraPosition + (m - cameraPosition)*f;
  if (sp.z > uSea.y && cameraPosition.y > uSea.x + 0.3) { gSea = 1.0; return sp + vec3(0.0, 0.45, 0.0); }
  return m;
}
void main(){
  vUv = uv;
  float b = aBurst.x, cyc = uTime/uPeriod + aBurst.y, k = floor(cyc), tau = fract(cyc)*uPeriod, live = 1.0; gSea = 0.0;
  vec3 h = h33(vec3(b*7.13 + 1.0, k*3.71 + 2.0, 1.7)), h2 = h33(vec3(k*1.37 + 5.0, b*5.11 + 3.0, 9.2));
  float atA = step(b, uNA - 0.5);
  vec3 centre = mix(uSiteB, uSiteA, atA) + (h - 0.5)*mix(uAreaB, uAreaA, atA);
  float type = floor(h2.x*2.999);                              // 0 silver willow, 1 mint palm, 2 pink crossette
  if (b > uNL - 0.5) {
    int ki = int(clamp(b - uNL + 0.5, 0.0, 2.0));
    tau = ki == 0 ? uKeyTau[0] : (ki == 1 ? uKeyTau[1] : uKeyTau[2]);
    centre = ki == 0 ? uKeyPos[0] : (ki == 1 ? uKeyPos[1] : uKeyPos[2]);
    type = float(ki); h = vec3(0.6, 0.5, 0.5); h2 = vec3(0.1, 0.5, 0.5);
    live = step(0.0, tau)*step(tau, uPeriod - 0.05); tau = clamp(tau, 0.0, uPeriod);
  }
  float willow = step(type, 0.5), palm = step(0.5, type)*step(type, 1.5), cross = step(1.5, type);
  vec3 posH, posT; float I, width = 0.5;
  if (tau < uRise) {
    float f = tau/uRise, fT = max(f - 0.12, 0.0);
    vec3 launch = vec3(centre.x + (h2.z - 0.5)*14.0, 1.0, centre.z + (h.z - 0.5)*10.0);
    vec3 wav = vec3(sin(f*17.0 + b), 0.0, cos(f*13.0 + b))*0.8;
    posH = mix(launch, centre, 1.0 - (1.0 - f)*(1.0 - f)) + wav*f + aSpark.xyz*aBurst.w*0.5;
    posT = mix(launch, centre, 1.0 - (1.0 - fT)*(1.0 - fT)) + wav*fT;
    I = step(aBurst.z, 0.05)*(0.25 + 0.5*f)*smoothstep(0.0, 0.1, f);
    vC = uPal[2]; width = 0.3;
  } else {
    float te = tau - uRise, life = uPeriod - uRise - 0.2, s = te/life;
    vec3 dir = aSpark.xyz;
    if (willow > 0.5) dir = normalize(dir + vec3(0.0, 0.35, 1e-3));
    if (palm > 0.5) { vec3 q = floor(dir*2.2 + 0.5); dir = normalize(mix(dir, q, 0.85) + vec3(0.0, 0.5, 1e-3)); }
    if (cross > 0.5) { vec3 q = floor(dir*1.6 + 0.5); dir = normalize(q + vec3(1e-3)) + (aSpark.xyz - 0.5)*0.9*smoothstep(0.7, 1.4, te); }
    float sp = aSpark.w*mix(0.8, 1.2, h.x)*(willow*74.0 + palm*92.0 + cross*70.0);
    float drag = willow*2.3 + palm*2.2 + cross*2.4, grav = willow*11.0 + palm*7.5 + cross*6.5;
    float trail = willow*1.5 + palm*0.9 + cross*0.5;
    posH = fwPos(centre, dir, sp, drag, grav, te); posT = fwPos(centre, dir, sp, drag, grav, max(te - trail*(0.6 + 0.6*aBurst.w), 0.0));
    float open = 1.0 - exp(-drag*te);
    float tw = mix(1.0, step(0.4, fract(aBurst.w*77.0 + floor(uTime*12.0)*0.37 + aBurst.z*13.0)), smoothstep(0.45, 0.9, s));
    I = pow(max(1.0 - s, 0.0), mix(1.3, 0.6, willow))*min(open*open*open*2.2, 1.0)*tw;
    vC = willow*mix(uPal[2], vec3(1.0, 0.96, 0.9), 0.3) + palm*uPal[0] + cross*uPal[1];
    width = 0.42 + 0.2*palm;
  }
  I *= live;
  if (uMirror > 0.5) {
    posH.y = -1.3*posH.y; posT.y = -1.3*posT.y; posH.x += sin(posH.y*0.3 + uTime*1.6)*0.5; I *= 0.5;
    gSea = 0.0; posH = seaLay(posH); posT = seaLay(posT);
  }
  vec4 vh = viewMatrix*vec4(posH, 1.0), vt = viewMatrix*vec4(posT, 1.0);
  vec2 ax = vh.xy - vt.xy; float al = length(ax); ax = al > 1e-4 ? ax/al : vec2(0.0, 1.0);
  vec4 mv = mix(vt, vh, uv.y);
  float dist = max(-mv.z, 1.0);
  if (uMirror > 0.5) I *= mix(1.0, 0.3*smoothstep(40.0, 200.0, dist), gSea);   // on the sea a shell's image is a far-off shimmer, never a blot beside the car
  width = max(width, dist*0.0016);
  mv.xy += vec2(-ax.y, ax.x)*(uv.x - 0.5)*2.0*width + ax*(uv.y - 0.5)*2.0*width;
  float fogF = exp(-uFogD*uFogD*dist*dist);
  vI = I*uGain*mix(fogF, 1.0, 0.3);
  if (vI < 0.004) mv.z = 1e6;
  gl_Position = projectionMatrix*mv;
}`,oo=`
varying vec2 vUv; varying vec3 vC; varying float vI;
void main(){
  float x = abs(vUv.x - 0.5)*2.0;
  float a = (1.0 - smoothstep(0.0, 1.0, x))*smoothstep(0.0, 0.5, vUv.y)*(0.35 + 0.65*smoothstep(0.75, 1.0, vUv.y));
  gl_FragColor = vec4(vC*a*vI*1.7, 0.0);
}`,q=(g,C,u0)=>new m.Vector3(g,C,u0),O0=g=>{const C=new m.Color(g);return[C.r,C.g,C.b]},k=(g,C)=>[g[0]*C,g[1]*C,g[2]*C];function Je(){const g=new m.InstancedBufferGeometry;return g.setAttribute("position",new m.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),g.setAttribute("uv",new m.Float32BufferAttribute([0,0,1,0,1,1,0,1],2)),g.setIndex([0,1,2,0,2,3]),g.boundingSphere=new m.Sphere(new m.Vector3(0,0,150),5e3),g}class G0{constructor(){this.p=[],this.a=[]}add(C,u0,C0,H,W,p0=0,W0=this.p.length*.6180339%1){this.p.push(C,u0,C0),this.a.push(H,W0,W,p0)}get count(){return this.p.length/3}build(){const C=Je();return C.setAttribute("iPos",new m.InstancedBufferAttribute(new Float32Array(this.p),3)),C.setAttribute("iA",new m.InstancedBufferAttribute(new Float32Array(this.a),4)),C.instanceCount=this.count,C}}const ao={blue:{sky:{preset:"blueHour",zenith:"#3a2668",mid:"#1b5f70",horizon:"#2a2a5e",ground:"#0b1226",horizonPow:3.2,midPow:1.3,scatterColor:"#FFB59A",scatter:1.35,scatterPow:2.6,scatterHigh:0,scatterFall:11,sunElevation:-6,sunAzimuth:180,sunIntensity:0,sunGlow:0,stars:.55,milkyWay:0,bodies:[],clouds:!1,clouds2:{coverage:.34,stretch:1,scale:.8,lit:"#ff9dbd",shade:"#3b2a6a",opacity:.8}},fog:6e-4,fogMix:.25,exposure:1.12,bulbs:1,halo:0,fwGain:1,win:1,bloom:{strength:.62,radius:.32,threshold:.92},grade:{saturation:1.1,contrast:1.05,tint:"#f4f6ff",shadowTint:"#0E1630",vignette:.34,grain:.02},sky3:[.12,.14,.2],ground3:[.035,.04,.07],rim3:[.5,.3,.22],rimDir:[0,.18,.98],glowK:.5,reflMin:.6,fogKeep:.35,deep:"#0a1836",scatterW:"#1E6A7A",title:"The Pier Comet"},night:{sky:{preset:"night",zenith:"#040818",mid:"#0a1838",horizon:"#14285a",ground:"#040812",sunAzimuth:180,stars:1,milkyWay:.28,milkyAngle:200,bodies:[{elevation:52,azimuth:96,size:1.1,phase:.97,intensity:1.2,glow:.3,glowColor:"#cfe0ff"}],key:0,clouds:!1,clouds2:!1},fog:5e-4,fogMix:0,exposure:1.2,bulbs:1.1,halo:.1,fwGain:1.15,win:1.1,bloom:{strength:.7,radius:.34,threshold:.9},grade:{saturation:1.12,contrast:1.07,tint:"#f0f4ff",shadowTint:"#0a1030",vignette:.38,grain:.022},sky3:[.085,.1,.16],ground3:[.024,.03,.06],rim3:[.34,.4,.55],rimDir:[.75,.62,.2],glowK:.56,reflMin:.62,fogKeep:.35,zen3:[.03,.045,.13],hor3:[.07,.13,.3],peach3:[.25,.3,.45],deep:"#06102a",scatterW:"#16506a",title:"The Pier Comet, Midnight"},golden:{sky:{preset:"goldenHour",sunElevation:8.5,sunAzimuth:196,clouds:{coverage:.3},clouds2:{coverage:.4,stretch:1}},fog:55e-5,fogMix:.5,exposure:.98,bulbs:.16,halo:-.6,fwGain:0,win:.25,bloom:{strength:.3,radius:.5,threshold:.95},grade:{saturation:1.08,contrast:1.05,tint:"#fff4e6",shadowTint:"#1a1838",vignette:.3,grain:.02},sky3:[.3,.38,.55],ground3:[.3,.22,.17],rim3:[1.5,.9,.48],rimDir:[.27,.16,.95],glowK:.06,reflMin:.24,fogKeep:.35,zen3:[.55,.85,1.6],hor3:[2.4,1.7,1.2],peach3:[2.6,1.3,.6],sand3:[.46,.33,.22],sandDry3:[.78,.62,.44],deep:"#0d3a5c",scatterW:"#3aa7a0",title:"The Pier Comet, Last Afternoon"},fret:{sky:{preset:"blueHour",zenith:"#232b4c",mid:"#2f3d5c",horizon:"#34435f",ground:"#2c3955",horizonPow:1.6,midPow:.8,groundFalloff:2,scatterColor:"#8f8fa6",scatter:.2,scatterPow:2,scatterFall:4,sunElevation:-8,sunAzimuth:180,sunIntensity:0,sunGlow:0,stars:0,milkyWay:0,bodies:[],clouds:{coverage:.5,softness:.6,lit:"#3d4a6c",shade:"#27304e",opacity:.6},clouds2:!1},fog:.0042,fogMix:0,exposure:1.15,bulbs:1,halo:.9,fwGain:1.5,win:1.3,bloom:{strength:.7,radius:.55,threshold:.88},grade:{saturation:1.05,contrast:1,tint:"#eef4ff",shadowTint:"#141c38",vignette:.4,grain:.03},sky3:[.17,.19,.25],ground3:[.06,.075,.115],rim3:[.08,.07,.09],rimDir:[0,.18,.98],glowK:.7,reflMin:.6,fogKeep:.03,zen3:[.1,.13,.24],hor3:[.16,.22,.33],peach3:[.3,.25,.3],deep:"#0c1a34",scatterW:"#2a5a6a",title:"The Pier Comet in the Sea Fret"}};function so(g){const C=[],u0=R;for(const[H,W]of[[150,18],[160,18],[169,18],[176,18.3],[181,19.6],[188,25.2],[195,31.1],[202,37],[208,41.6],[212.5,44.5],[216,45.8],[219.5,45.6],[223,43.4],[227,39.2],[232,33.3],[238,26.1],[244,19],[249.5,12.6],[254,8],[258,5.2],[262,4.1],[268,3.7],[280,3.6],[296,3.6],[312,3.6],[326,3.7],[338,4]])C.push([u0,W,H]);for(let H=0;H<=180;H+=15){const W=H*Math.PI/180;C.push([u0+38-38*Math.cos(W),4.2+1.6*Math.sin(W),345+38*Math.sin(W)])}const C0=u0+76;for(const[H,W]of[[334,6.3],[326,11.8],[318,16.4],[310,13.4],[301,7.4],[292,5.2],[284,8.6],[275,14.4],[266,17],[257,13.6],[248,8.2],[240,5.9]])C.push([C0,W,H]);for(const[H,W]of[[232,7.6],[224,12],[216,17.5],[208,23.5],[200,29.5],[192,35.2],[185,39.8],[179,43.6],[174,46.2],[169.5,47.6],[165.5,47.5],[161.5,46.35]]){const p0=Math.min(1,(240-H)/78.5),W0=p0*p0*(3-2*p0);C.push([C0*(1-W0),W,H])}for(const H of g)C.push([H[0],H[1],H[2]+g0]);return C}var fo={id:"pier-comet",name:"The Pier Comet",category:"city",weirdness:.2,media:["rail","air","open"],async build(g){const C=g.rng,u0=g.vary||{},C0=g.quality?.detail??1,H=u0.density??1,W=new m.Scene,p0=u0.hour||"any",W0=C();let ye=p0==="night"?W0<.3?"fret":"night":p0==="golden"||p0==="day"?"golden":p0==="dawn"||W0<.4?"blue":W0<.64?"night":W0<.84?"golden":"fret";const B=ao[ye],G=ye==="golden",Ye=!!u0.rare&&!G,te=C.int(0,2),xe=C.chance(.55),$e=C.chance(.7),Te=C.range(226,250),At=Xt??Te*37.7%1<.2,s0=At?132+(Te-226)*.4:Te,b={navy:O0(T0[0]),teal:O0(T0[1]),violet:O0(T0[2]),peach:O0(T0[3]),mint:O0(T0[4]),pink:O0(T0[5]),white:O0(T0[6])},Ce=[b.mint,b.pink,b.white],K=k(b.white,.74),y0=await Zt(g,{palette:T0,reflection:!0,sand:!0,sandRadius:1500,track:!0,mirrorRadius:250,mirrorDepth:240});y0.object.position.set(0,0,g0),W.add(y0.object);const Ft=y0.anchors;await g.yield();const J=jt(so(Ft.flyThrough),{samples:640}),i0=J.length,be=i0-62;await g.yield();const D0=Math.ceil(i0)+1,Me=new Float32Array(D0);{const e=q(),t=q(),o=new Float32Array(D0);for(let a=0;a<D0;a++){J.tangentAtDist(Math.max(0,a-3),e),J.tangentAtDist(Math.min(i0,a+3),t);const s=(e.z*t.x-e.x*t.z)/6;o[a]=Math.max(-1.05,Math.min(1.05,s*40))}for(let a=0;a<D0;a++){let s=0,n=0;for(let r=-7;r<=7;r++){const c=a+r;c>=0&&c<D0&&(s+=o[c],n++)}Me[a]=s/n*Math.min(1,(i0-a)/30)}}const We=q(),et=q(),tt=q(),oe=q(),Ie=q(0,1,0);await g.yield();const ae=(e,t,o,a,s)=>{J.posAtDist(e,t),J.tangentAtDist(e,o),a.crossVectors(o,Ie).normalize(),s.crossVectors(a,o).normalize();const n=Math.max(0,Math.min(D0-1.001,e)),r=Math.floor(n),c=Me[r]+(Me[Math.min(D0-1,r+1)]-Me[r])*(n-r),l=Math.cos(c),d=-Math.sin(c),x=s.x*l+a.x*d,S=s.y*l+a.y*d,f=s.z*l+a.z*d;a.set(a.x*l-s.x*d,a.y*l-s.y*d,a.z*l-s.z*d),s.set(x,S,f)},x0=(e,t)=>J.nearestXZ(e,t).u,V0=x0(R,190),c0=x0(R,217),ze=x0(R,254),ke=x0(R,332),ot=x0(R+38,383),at=x0(R+76,300),se=x0(R+60,216),b0=Qt({rng:C,bake:!0,renderer:g.renderer,...B.sky});W.add(b0.object),await g.yield();const st=b0.fogColor.clone().lerp(b0.colorAt(q(.3,.04,-1).normalize()),1-B.fogMix);W.fog=new m.FogExp2(st,B.fog);const it=Pt.makeOcean({rng:C,light:Pt.waterLight(b0,{fogColor:st}),preset:"breeze",height:.72,wavelength:58,foam:.2,level:Xe,radius:3600,deep:B.deep,scatter:B.scatterW,depthAt:(e,t)=>t<s0?-8:.3+(t-s0)*.06,depthRect:[-2600,-640,2600,s0+384],depthRes:128,shoalDepth:5,shoalWidth:26});W.add(it.object),await g.yield();const O=y0.uniforms;O.uSky.value.setRGB(...B.sky3),O.uGround.value.setRGB(...B.ground3),O.uRim.value.setRGB(...B.rim3),O.uRimDir.value.set(...B.rimDir).normalize(),O.uGlowK.value=Math.max(.35,B.glowK*1.1),B.zen3&&(O.uZenith.value.setRGB(...B.zen3),O.uHorizon.value.setRGB(...B.hor3),O.uPeach.value.setRGB(...B.peach3)),G&&O.uRimDir.value.copy(b0.sunDirection),B.sand3&&y0.object.traverse(e=>{e.material?.uniforms?.uSand&&e.material.uniforms.uSand.value.setRGB(...B.sand3)}),B.sandDry3&&O.uSandDry.value.setRGB(...B.sandDry3),ye==="blue"&&(O.uZenith.value.multiplyScalar(.7),O.uHorizon.value.multiplyScalar(.7)),O.uSea.value.set(Xe,s0+2),O.uShore.value.set(20,s0),O.uReflMin.value=B.reflMin,O.uLamp.value=G?.5:1;const I0=e=>new m.Color(e[0],e[1],e[2]),nt={value:new m.Vector2(800,450)},M0={uRes:nt,uTime:{value:0},uFlash:{value:0},uGlowK:{value:B.glowK??1},uWaveZ:{value:1e6},uWin:{value:B.win},uSky:O.uSky,uGround:O.uGround,uRim:O.uRim,uRimDir:O.uRimDir,uPalA:{value:I0(b.mint)},uPalB:{value:I0(b.pink)},uPalC:{value:I0(b.white)}},ie=(e,t=m.FrontSide)=>new m.ShaderMaterial({uniforms:{...m.UniformsUtils.clone(m.UniformsLib.fog),...M0},defines:e?{MIRROR:1}:{},vertexShader:Jt,fragmentShader:Yt,fog:!0,side:e?m.DoubleSide:t}),Tt=ie(!1),q0=ie(!1,m.DoubleSide),rt=ie(!0),lt=ie(!1),ct=ie(!0);lt.defines.PILE=1,ct.defines.PILE=1;const ne={uTime:M0.uTime,uLit:{value:B.bulbs},uWaveZ:M0.uWaveZ,uHalo:{value:B.halo},uFogD:{value:B.fog},uRes:nt,uSea:O.uSea,uFogKeep:{value:B.fogKeep},uSprayT:{value:-1},uPal:{value:Ce.map(I0)},uFlock:{value:q()},uCore:{value:G?2.2:5.2},uShade:{value:I0(G?[1.1,.85,.7]:[.3,.34,.5])}},qe=(e,t)=>new m.ShaderMaterial({uniforms:{...ne,uSolid:{value:e?1:0},uMirror:{value:t?1:0}},vertexShader:$t,fragmentShader:eo,transparent:!0,depthWrite:!1,blending:e?m.NormalBlending:m.CustomBlending,blendEquation:m.AddEquation,blendSrc:e?m.SrcAlphaFactor:m.OneFactor,blendDst:e?m.OneMinusSrcAlphaFactor:m.OneFactor}),re=qe(!1,!1),Ct=qe(!1,!0),ut=qe(!0,!1),v0=(e,t,o)=>{const a=new m.Mesh(e,t);return a.frustumCulled=!1,a.renderOrder=o,a},ft=[],Be=[],dt=[],Re=[],B0=new m.Matrix4,L0=q(),z0=q(),le=q(),ht=(e,t,o,a)=>{B0.elements[12]=e,B0.elements[13]=t,B0.elements[14]=o;const s=o<s0+4&&Math.hypot(e,o-g0)<238,n=s?ft:dt,r=s?Be:Re;for(let c=0;c<16;c++)n.push(B0.elements[c]);r.push(a[0],a[1],a[2])},Wt=(e,t,o,a,s,n,r,c)=>{B0.set(t.x*s,o.x*n,a.x*r,0,t.y*s,o.y*n,a.y*r,0,t.z*s,o.z*n,a.z*r,0,0,0,0,1),ht(e.x,e.y,e.z,c)},Y=(e,t,o,a,s,n,r,c,l=r)=>{z0.set(a-e,s-t,n-o);const d=z0.length();d<.001||(z0.multiplyScalar(1/d),Math.abs(z0.z)>.92?L0.set(1,0,0):L0.set(0,0,1),le.crossVectors(L0,z0).normalize(),L0.crossVectors(z0,le),B0.set(L0.x*r,z0.x*d,le.x*l,0,L0.y*r,z0.y*d,le.y*l,0,L0.z*r,z0.z*d,le.z*l,0,0,0,0,1),ht((e+a)/2,(t+s)/2,(o+n)/2,c))},k0=(e,t,o,a,s)=>Y(e.x,e.y,e.z,t.x,t.y,t.z,o,a,s),I=new G0,ce=new G0;let It=0;const N0=()=>It++%3,j0=[.105,.085,.075],_e=(e,t)=>e>o0&&e<e0&&t>0&&t<h0,qt=(e,t,o)=>_e(e,t)&&o>w+.6?w:t>s0-12?-2.2:0,m0=new U0,w0=q(),E0=q(),l0=q(),a0=q(),n0=q(),D=q(),L=q(),E=q(),Ge=[];{const e=[],t=[];for(let d=-40;d<=be+.01;d+=1.5)ae(d,w0,E0,l0,a0),D.copy(w0).addScaledVector(a0,-ge),e.push([D.x-l0.x*.55,D.y-l0.y*.55,D.z-l0.z*.55]),t.push([D.x+l0.x*.55,D.y+l0.y*.55,D.z+l0.z*.55]),L.copy(D).addScaledVector(a0,-.16),Wt(L,l0,a0,E0,1.7,.12,.26,K);m0.col=k(b.white,.9),m0.glow=[.05,.06,.07],m0.tube(e,.075,4,{up:[0,1,0]}),m0.tube(t,.075,4,{up:[0,1,0]}),await g.yield(),ae(J.length*V0-14,w0,E0,l0,a0),L.copy(w0).addScaledVector(a0,-ge-.02),ae(J.length*c0-6,w0,E0,l0,a0),E.copy(w0).addScaledVector(a0,-ge-.02),m0.col=[.5,.52,.56],m0.glow=[0,0,0],m0.fx=12,m0.beam([L.x,L.y,L.z],[E.x,E.y,E.z],.2,.08,{ref:[1,0,0]}),m0.fx=0;const o=i0*V0-16,a=i0*ze,s=i0*ke,n=i0*se-20;let r=null,c=-38,l=0;for(;c<be-1;){const d=c>n,x=d?6.5:4.5;ae(c,w0,E0,l0,a0),D.copy(w0).addScaledVector(a0,-ge),n0.crossVectors(E0,Ie).normalize();const S=D.y-.3,f=qt(D.x,D.z,S),y=S-f,T=_e(D.x,D.z)&&S<w;let P=null;if(y>.9){const z=Math.min(2.2,y*.07),v=Math.max(0,Math.floor((y-1.5)/6));P={n:v,pts:[],d:c};for(let F=0;F<=v+1;F++){const A=F<=v?S-F*6:f,Q=(S-A)/y,U=1.75+z*Q;P.pts.push([q(D.x-n0.x*U,A,D.z-n0.z*U),q(D.x+n0.x*U,A,D.z+n0.z*U)])}const u=P.pts[0],_=P.pts[v+1];k0(u[0],_[0],d?.17:.2,K),k0(u[1],_[1],d?.17:.2,K);for(let F=0;F<=v;F++)k0(P.pts[F][0],P.pts[F][1],F===0?.13:.15,K),(F<v||y-v*6>3)&&k0(P.pts[F][(F+l)%2],P.pts[F+1][(F+l+1)%2],.11,K);if(r&&c-r.d<7){const F=Math.min(r.n,P.n);for(let A=0;A<=F;A++)for(let Q=0;Q<2;Q++)A>0&&k0(r.pts[A][Q],P.pts[A][Q],.13,K),!d&&A<F&&(A+l+Q)%2===0&&k0(r.pts[A][Q],P.pts[A+1][Q],.1,K);if(!d&&F>=1&&y>9&&!G)for(let A=1;A<=F;A++)I.add(P.pts[A][l%2].x,P.pts[A][l%2].y,P.pts[A][l%2].z,N0(),.13,0)}f===0&&y>6&&Ge.push([D.x,D.z,y])}const M=c-i0*c0,h=M>-5&&M<15||c>i0*(se+.012);if(!T&&!h&&c<be-4)for(const p of[-1,1])L.copy(D).addScaledVector(l0,p*2).addScaledVector(a0,-.25),E.copy(L).addScaledVector(a0,1.1),k0(L,E,.06,K),r&&r.rail&&(k0(r.rail[p<0?0:1],E,.05,K),n0.copy(r.rail[p<0?0:1]).addScaledVector(a0,-.5),D.copy(E).addScaledVector(a0,-.5),k0(n0,D,.035,K),D.copy(w0).addScaledVector(a0,-ge),n0.crossVectors(E0,Ie).normalize()),(P||(P={n:-1,pts:[],d:c})).rail=P.rail||[],P.rail[p<0?0:1]=E.clone(),c>6&&I.add(E.x,E.y+.12,E.z,(l+(p>0?1:0))%3,.085,3,(c/46%1+1)%1);else if(!T&&c<be-4&&c>6)for(const p of[-1,1])L.copy(D).addScaledVector(l0,p*1).addScaledVector(a0,-.1),I.add(L.x,L.y,L.z,(l+(p>0?1:0))%3,.075,3,(c/46%1+1)%1);if(c>o&&c<a-9&&(M<-22||M>13)&&(c>i0*c0||l%2===0)){L.copy(D).addScaledVector(n0,-2.15),E.copy(D).addScaledVector(n0,2.15);const p=w0.y+3.4;Y(L.x,L.y,L.z,L.x,p,L.z,.12,K),Y(E.x,E.y,E.z,E.x,p,E.z,.12,K),Y(L.x,p,L.z,E.x,p,E.z,.12,K),Y(L.x,p,L.z,L.x+n0.x*.9,p-1,L.z+n0.z*.9,.08,K),Y(E.x,p,E.z,E.x-n0.x*.9,p-1,E.z-n0.z*.9,.08,K)}r=P,c+=x,l++,(l&15)===0&&await g.yield()}}await g.yield();const i=new U0,V=(e,t,o,a,s,n,r)=>{e.quad([t,n,a],[t,n,r],[s,n,r],[s,n,a]),e.quad([t,o,a],[s,o,a],[s,o,r],[t,o,r]),e.quad([s,o,a],[s,n,a],[s,n,r],[s,o,r]),e.quad([t,o,a],[t,o,r],[t,n,r],[t,n,a]),e.quad([t,o,r],[s,o,r],[s,n,r],[t,n,r]),e.quad([t,o,a],[t,n,a],[s,n,a],[s,o,a])},Se=243,De=263,Le=[],pt=[];i.col=G?[.42,.37,.33]:[.3,.29,.33],i.fx=6,V(i,o0,w-.6,0,R-3.6,w,h0),V(i,R-3.6,w-.6,0,e0,w,Se),V(i,R-3.6,w-.6,De,e0,w,h0),i.fx=0;for(const e of[o0-.1,e0+.1])Y(e,w-.3,0,e,w-.3,h0,.3,K,.9);Y(o0,w-.3,h0+.1,e0,w-.3,h0+.1,.3,K,.9);for(let e=3,t=0;e<h0;e+=5.5,t++){for(let o=o0;o<=e0+.01;o+=6)if(!(J.distanceTo(o,4,e)<2.8||J.distanceTo(o,7,e)<2.8)){{const a=e>s0-12?-2.4:0;(e<s0+4&&Math.hypot(o,e-g0)<238?Le:pt).push(o+((t*7+o)%3-1)*.06,a,e,w-.6-a,.9+.2*(((o*13+t*29)%7+7)%7)/7)}t%2===0&&o<e0-1&&Math.abs(o+3-R)>1&&e>30&&Y(o,1.4,e,o+6,w-1.2,e,.22,j0)}J.distanceTo(R,7.1,e)>3.3?Y(o0,w-.95,e,e0,w-.95,e,.4,j0,.7):Y(o0,w-.95,e,R-3.6,w-.95,e,.4,j0,.7),(t&7)===7&&await g.yield()}await g.yield();const S0=(e,t,o,a,s,n,r,c,l,d)=>{const x=o[0]-t[0],S=o[1]-t[1],f=o[2]-t[2],y=s[0]-t[0],T=s[1]-t[1],P=s[2]-t[2],M=S*P-f*T,h=f*y-x*P,p=x*T-S*y;M*(t[0]-n[0])+h*(t[1]-n[1])+p*(t[2]-n[2])>=0?e.quad(t,o,a,s,r,c,l,d):e.quad(s,a,o,t,d,l,c,r)},$=(e,t,o,a,s,n,r=0)=>{for(let c=0;c<a.length-1;c++){const[l,d,x=0]=a[c],[S,f,y=0]=a[c+1],T=[t,(l+S)/2-(d>f?.3:0),o];for(let P=0;P<s;P++){const M=r+P/s*Math.PI*2,h=r+(P+1)/s*Math.PI*2,p=Math.cos(M),z=Math.sin(M),v=Math.cos(h),u=Math.sin(h);n&&(e.col=n(P,c)),S0(e,[t+p*d,l,o+z*d],[t+v*d,l,o+u*d],[t+v*f,S,o+u*f],[t+p*f,S,o+z*f],T,x||0,x||0,y||0,y||0)}}},H0=(e,t)=>o=>o%2?e:t,R0=k(b.mint,.82),_0=k(b.pink,.85),j=k(b.white,.78),K0=(e,t,o,a,s,n,r,c=0,l=-1)=>{for(let d=0;d<n;d++){const x=d/n*Math.PI*2;e.add(t+Math.cos(x)*s,o,a+Math.sin(x)*s,l<0?d%3:l,r,c,d/n)}},Q0=(e,t)=>{const o=new m.Mesh(e.build(),t);return o.frustumCulled=!1,o},Z=G?.15:1,vt=-51.5,Ne=[[-55,196,10],[vt,166,6.5],[-56,228,8.5]],Z0=C.fork("tents"),Bt=Math.round(40*Math.min(1.15,H));for(let e=0,t=0;e<Bt&&t<600;t++){const o=Z0.range(-64.5,-43.5),a=Z0.range(10,322),s=Z0.range(.8,1.35);if(Ne.some(l=>Math.hypot(o-l[0],a-l[1])<l[2]+3*s)||a>Se-6&&a<De+6&&o>-45)continue;Ne.push([o,a,3*s]),e++;const n=e%2?R0:_0,r=Z0.chance(.3)?4:8,c=Z0.range(0,1.5);i.glow=k(n,.1*Z),$(i,o,a,[[w,2.2*s],[w+2.3*s,2.2*s]],r,H0(n,j),c),i.glow=k(n,.2*Z),$(i,o,a,[[w+2.15*s,3*s,.3+.6*Z0()],[w+2.6*s,2.3*s],[w+4.5*s,0]],r,H0(j,n),c),i.col=n,i.glow=[0,0,0],S0(i,[o,w+4.5*s,a],[o,w+5.6*s,a],[o+1.2,w+5.4*s,a+.2],[o+1.2,w+5.1*s,a+.2],[o,0,a-9],0,0,.8,.8),K0(I,o,w+2.2*s,a,3.05*s,r,.12,0,e%3),I.add(o,w+4.7*s,a,2,.16,0)}await g.yield();{const[e,t]=[vt,166],o=[];for(let n=0;n<=8;n++)o.push([w+n*1.85,3.2-n*.2]);i.glow=k(b.pink,.08*Z),$(i,e,t,o,32,(n,r)=>(n+r*4)%8<4?j:_0),i.glow=k(b.mint,.12*Z),$(i,e,t,[[w+14.8,2.5,.4],[w+15.3,1.9],[w+18,0]],32,n=>n%4<2?R0:j),$(i,e,t,[[w+14.8,1.7],[w+15.7,1.7]],32,()=>k(b.white,.5));const a=150,s=20;for(let n=0;n<a;n++){const r=n/a,c=(n+1)/a,l=r*s,d=c*s,x=w+13.6*(1-r)+.6,S=w+13.6*(1-c)+.6,f=1.85+r*1.5,y=1.85+c*1.5,T=Math.cos(l),P=Math.sin(l),M=Math.cos(d),h=Math.sin(d),p=1.05,z=[e,x-30,t];i.col=k(b.mint,.62),i.glow=k(b.mint,.05*Z),S0(i,[e+T*f,x,t+P*f],[e+T*(f+p),x+.08,t+P*(f+p)],[e+M*(y+p),S+.08,t+h*(y+p)],[e+M*y,S,t+h*y],z),S0(i,[e+T*f,x-.08,t+P*f],[e+T*(f+p),x,t+P*(f+p)],[e+M*(y+p),S,t+h*(y+p)],[e+M*y,S-.08,t+h*y],[e,x+30,t]),i.col=j,S0(i,[e+T*(f+p),x-.02,t+P*(f+p)],[e+T*(f+p+.05),x+.42,t+P*(f+p+.05)],[e+M*(y+p+.05),S+.42,t+h*(y+p+.05)],[e+M*(y+p),S-.02,t+h*(y+p)],[e,x,t]),S0(i,[e+T*(f+p),x-.02,t+P*(f+p)],[e+T*(f+p+.05),x+.42,t+P*(f+p+.05)],[e+M*(y+p+.05),S+.42,t+h*(y+p+.05)],[e+M*(y+p),S-.02,t+h*(y+p)],[e+T*30,x,t+P*30]),n%2===0&&I.add(e+T*(f+p+.1),x+.6,t+P*(f+p+.1),n/2%3===2?2:n/2%3,.13,3,r*3%1)}I.add(e,w+18.3,t,2,.25,0)}await g.yield();const ue=new m.Group;ue.position.set(-55,w,196),W.add(ue);const fe=new G0;{const e=new U0;e.glow=k(b.pink,.16*Z),$(e,0,0,[[0,7],[.45,7],[.45,0]],24,H0(j,R0)),$(e,0,0,[[.45,1.5],[4.4,1.5]],12,H0(_0,j)),e.glow=k(b.pink,.26*Z),$(e,0,0,[[3.9,7.7,.5],[4.4,7],[5.4,3.2],[7.2,0]],24,H0(_0,j)),$(e,0,0,[[4.4,7],[4.3,1.5]],24,()=>k(b.white,.5));for(let t=0;t<16;t++){const o=t/16*Math.PI*2,a=t%2?5.7:4.2,s=Math.cos(o)*a,n=Math.sin(o)*a;e.col=j,e.fx=0,e.beam([s,.45,n],[s,4.35,n],.09,.09),e.col=[j,R0,_0][t%3],e.fx=2+t*.37%1;const r=-Math.sin(o),c=Math.cos(o);e.beam([s-r*.75,1.9,n-c*.75],[s+r*.75,1.9,n+c*.75],.42,.62,{caps:!0,ref:[0,1,0]}),e.beam([s+r*.6,2.1,n+c*.6],[s+r*1,2.75,n+c*1],.26,.3,{caps:!0,ref:[0,1,0]})}e.fx=0,ue.add(Q0(e,q0)),K0(fe,0,4,0,7.75,36,.13,3),K0(fe,0,4.5,0,1.6,12,.12,0),K0(fe,0,5.5,0,3.2,12,.11,0,2),fe.add(0,7.5,0,2,.24,0),ue.add(v0(fe.build(),re,5));for(let t=0;t<6;t++){const o=t/6*Math.PI*2+.3,a=-55+Math.cos(o)*9.2,s=196+Math.sin(o)*9.2;i.glow=[0,0,0],$(i,a,s,[[w,.5],[w+.7,.7]],6,()=>j),i.glow=k(t%2?b.pink:b.white,.05),$(i,a,s,[[w+.7,.95,.5],[w+1.3,.85,.7],[w+1.7,0]],7,(n,r)=>k(t%2?b.pink:b.white,.5+.2*((n+r)%2)))}}await g.yield();const P0=new m.Group;P0.position.set(-56,w,228),W.add(P0);const X0=new G0;i.glow=k(b.mint,.1*Z),$(i,-56,228,[[w,1.6],[w+1.2,.9],[w+(xe?19:27),.7]],10,(e,t)=>t===2&&e%2?R0:j);for(let e=0;e<(xe?9:13);e++)I.add(-56+.95,w+2+e*2,228,e%3,.13,3,e/9);{const e=new U0;if(e.glow=k(b.mint,.22*Z),xe){$(e,0,0,[[18.6,5,.4],[19.2,5.2],[20.4,4.2],[22,0]],16,H0(R0,j)),$(e,0,0,[[19.2,5.2],[18.9,.8]],16,()=>k(b.white,.5));for(let t=0;t<32;t++){const o=t/32*Math.PI*2,a=Math.cos(o),s=Math.sin(o),n=.74+.1*Math.sin(t*2.4),r=8.5,c=4.7+Math.sin(n)*r,l=18.9-Math.cos(n)*r;e.col=k(b.white,.6),e.glow=[.03,.04,.04],e.beam([a*4.7,18.9,s*4.7],[a*c,l,s*c],.07,.07),e.col=[R0,_0,j][t%3],e.glow=k(e.col,.25*Z),e.beam([a*c,l-.2,s*c],[a*(c+.1),l-.9,s*(c+.1)],.6,.6,{caps:!0}),t%2===0&&X0.add(a*c,l-1,s*c,t%3,.1,0)}K0(X0,0,19.2,0,5.3,32,.13,3),X0.add(0,22.3,0,2,.24,0)}else e.glow=k(b.white,.5*Z),$(e,0,0,[[-1.3,2.2],[-1,3.3],[1,3.3],[1.4,2],[1.5,.8]],16,(t,o)=>o===1?t%2?k(b.mint,.9):k(b.white,.9):j),K0(X0,0,1.1,0,3.4,24,.13,3),K0(X0,0,-1.1,0,3.4,24,.12,0),I.add(-56,w+27.6,228,1,.3,0);P0.add(Q0(e,q0)),P0.add(v0(X0.build(),re,5))}await g.yield();for(let e=100,t=0;e<126;e+=1.3,t++){i.col=t%2?k(b.mint,.6):j,i.glow=k(b.mint,.03*Z),i.quad([R-4.4,22.3,e],[R-4.4,22.3,e+1.3],[R-.5,23.5,e+1.3],[R-.5,23.5,e]),i.quad([R-.5,23.5,e],[R-.5,23.5,e+1.3],[R+3.4,22.3,e+1.3],[R+3.4,22.3,e]);for(const o of[R-4.4,R+3.4])i.quad([o,22.3,e],[o,22.3,e+1.3],[o,21.85,e+.65],[o,21.85,e+.65],0,0,.6,.6)}i.col=j,V(i,R-4.4,16.25,100,R-2.3,16.4,126);for(let e=100.2;e<126.5;e+=6.4)for(const t of[R-4.3,R+3.3])Y(t,16.4,e,t,22.3,e,.12,K);for(let e=R-4.2;e<=R+3.3;e+=1.25)I.add(e,21.9,126.2,N0(),.13,0);const mt=(e,t,o,a,s,n,r,c)=>{for(let l=1;l<r;l++){const d=l/r;I.add(e+(a-e)*d,t+(s-t)*d-c*4*d*(1-d),o+(n-o)*d,N0(),.115,1,d)}};for(let e=0;e<15;e++){const t=14+e*21.6;for(const o of[-65.7,-42.7])Y(o,w,t,o,w+7.5,t,.2,K),I.add(o,w+7.8,t,2,.2,0),e<14&&mt(o,w+7.4,t,o,w+7.4,t+21.6,10,1.3);Ne.slice(0,3).some(o=>Math.abs(t-o[1])<7)||mt(-65.7,w+7.4,t,-42.7,w+7.4,t,12,1.5)}for(const e of[o0-.2,e0+.2]){Y(e,w+1.1,0,e,w+1.1,e>-40?Se-2:h0,.09,K);for(let t=2;t<h0;t+=2.2)J.distanceTo(e,w+1.2,t)>4.5&&I.add(e,w+1.25,t,N0(),.12,0),J.distanceTo(e,w-.8,t)>4.5&&I.add(e+(e>-40?.15:-.15),w-.85,t+1.1,N0(),.12,0)}for(let e=o0;e<=e0;e+=2.2)I.add(e,w+1.25,h0+.2,N0(),.13,0);{const e=C.fork("crowd"),t=Math.round(3e3*H*C0);for(let o=0;o<t;o++){const a=e.range(-66.3,-41.2),s=5+321*Math.pow(e(),.85);s>Se-4&&s<De+4&&a>-44||Math.hypot(a+55,s-196)<8||I.add(a,w+1,s,e.int(0,2),.42,2,e())}}await g.yield();{const e=C.fork("town"),t=G?.78:.55,o=2.4,a=3.2,s=[[.6,.78,.7],[.82,.6,.66],[.8,.8,.78],[.62,.7,.8],[.84,.72,.74],[.7,.82,.78]],n=G?[.3,.29,.33]:[.075,.08,.11],r=G?[.36,.27,.25]:[.09,.075,.085],c=k(b.white,G?.7:.42),l=(f,y,T)=>i.quad(f,y,T,T);for(let f=-260,y=0;f<260;y++){const T=e.int(3,6),P=T*o,M=f*o,h=M+P,p=(M+h)/2,z=e.chance(.14)?5:e.int(3,4),v=z*a,u=-25-e.int(0,2)*1.1,_=12,F=u-_,A=u-_/2,Q=T<=4&&e.chance(.38),U=k(e.pick(s),t*e.range(.86,1)),we=Ce[e.int(0,2)],t0=Q?v+P*.42:v+2.7;i.fx=8,i.col=U,i.glow=k(we,.34*Z),i.quad([M,0,u],[h,0,u],[h,a,u],[M,a,u]),i.glow=k(we,.035*Z),i.quad([M,a,u],[h,a,u],[h,v,u],[M,v,u]),i.quad([M,0,F],[M,0,u],[M,v,u],[M,v,F]),i.quad([h,0,u],[h,0,F],[h,v,F],[h,v,u]);const Vt=e.chance(.6)?T>=5?[1,T-2]:[e.int(0,T-1)]:[];for(const r0 of Vt){const N=M+r0*o+.22,X=(z-1)*a;i.fx=8,i.col=k(U,1.08),V(i,N,0,u,N+o-.44,X,u+.85),i.fx=9,i.col=n,i.quad([N-.1,X,u+.95],[N+o-.34,X,u+.95],[N+o-.34,X+.8,u],[N-.1,X+.8,u])}if(i.fx=0,i.col=c,i.glow=[0,0,0],V(i,M-.12,v-.3,u,h+.12,v,u+.32),Q)i.col=U,i.glow=k(we,.02*Z),l([M,v,u],[h,v,u],[p,t0,u]),i.col=c,i.glow=[0,0,0],i.quad([M-.2,v-.1,u+.3],[p,t0+.12,u+.3],[p,t0-.3,u+.3],[M+.25,v-.1,u+.3]),i.quad([p,t0+.12,u+.3],[h+.2,v-.1,u+.3],[h-.25,v-.1,u+.3],[p,t0-.3,u+.3]),i.fx=9,i.col=n,i.quad([M,v,F],[M,v,u+.3],[p,t0,u+.3],[p,t0,F]),i.quad([h,v,u+.3],[h,v,F],[p,t0,F],[p,t0,u+.3]);else if(i.fx=9,i.col=n,i.quad([M,v,u+.3],[h,v,u+.3],[h,t0,A],[M,t0,A]),i.quad([h,v,F],[M,v,F],[M,t0,A],[h,t0,A]),i.fx=0,i.col=U,l([M,v,F],[M,v,u],[M,t0,A]),l([h,v,u],[h,v,F],[h,t0,A]),T>=4&&e.chance(.5))for(const r0 of T>=5?[-P*.24,P*.24]:[0]){const N=p+r0-.9,X=p+r0+.9,$0=u-1.2;i.fx=0,i.col=U,i.glow=k(we,.3*Z),i.quad([N,v+.4,$0],[X,v+.4,$0],[X,v+1.7,$0],[N,v+1.7,$0]),i.glow=[0,0,0],i.fx=9,i.col=n,i.quad([N-.15,v+1.7,$0+.15],[X+.15,v+1.7,$0+.15],[X+.15,v+2.2,A+1.2],[N-.15,v+2.2,A+1.2])}i.fx=0,i.col=r,i.glow=[0,0,0];for(const r0 of T>=5?[M+.5,h-1.4]:[y%2?M+.5:h-1.4]){const N=Q?u-4:A,X=Q?v+(.5-Math.abs(r0+.45-p)/P)*2*(t0-v):t0;V(i,r0,X-1.2,N-.45,r0+.9,X+1.5,N+.45),i.col=k(r,1.5),V(i,r0+.12,X+1.5,N-.16,r0+.42,X+2,N+.16),V(i,r0+.5,X+1.5,N-.16,r0+.8,X+1.95,N+.16),i.col=r}if(e.chance(.42)){const r0=y%2?R0:_0;for(let N=M+.3,X=0;N<h-.6;N+=.6,X++)i.col=k(X%2?r0:j,G?1:.75),i.glow=k(we,.22*Z),i.quad([N,2.25,u+1.75],[N+.6,2.25,u+1.75],[N+.6,3.05,u+.06],[N,3.05,u+.06],.3+.5*e(),.5,0,0)}f+=T+(e.chance(.1)?1:0),(y&15)===15&&await g.yield()}await g.yield(),i.fx=0,i.glow=[0,0,0],i.col=G?[.5,.48,.46]:[.2,.2,.26],V(i,-640,0,-22,o0,3.1,-18.5),V(i,e0,0,-22,640,3.1,-18.5),i.col=G?[.42,.37,.33]:[.3,.29,.33],i.fx=6,V(i,o0,w-.6,-24,e0,w,0),i.fx=0;for(let f=-616;f<620;f+=6.5)(f<o0-2||f>e0+2)&&I.add(f,6.2+.7*Math.cos(f*.24),-18.6,N0(),.14,1,f*.13%1+1);for(let f=-23;f<=23;f++){const y=f*Math.PI*2/.24;(y<o0-2||y>e0+2)&&(Y(y,3.1,-18.9,y,7.15,-18.9,.14,K),I.add(y,7.4,-18.9,2,.22,0))}{const f=G?[.21,.25,.17]:[.04,.05,.075],y=-1560,T=1020,P=60,M=z=>Math.max(9,36+26*g.noise.n2(z*.0016,9.3)+9*g.noise.n2(z*.006,2.2))*Math.min(1,(z-y)/300,(T-z)/300),h=[[-50,.12],[-150,.5],[-300,.86],[-460,1]],p=(z,v)=>{for(let u=0;u<3;u++)if(v>=h[u+1][0]){const _=(h[u][0]-v)/(h[u][0]-h[u+1][0]);return M(z)*(h[u][1]+(h[u+1][1]-h[u][1])*_)}return M(z)};for(let z=y;z<T;z+=P){const v=M(z),u=M(z+P);for(let _=0;_<3;_++){const[F,A]=h[_],[Q,U]=h[_+1];i.col=k(f,1-.14*_+.1*g.noise.n2(z*.01,_*3.3)),i.glow=[0,0,0],i.fx=0,i.quad([z,v*A,F],[z+P,u*A,F],[z+P,u*U,Q],[z,v*U,Q])}}for(let z=0;z<46;z++){const v=e.range(-1150,760),u=e.range(-380,-95),_=p(v,u)-.4,F=e.range(3.6,6),A=k(e.pick(s),t*.9);i.fx=8,i.col=A,i.glow=k(Ce[z%3],.05*Z),i.quad([v-F,_,u],[v+F,_,u],[v+F,_+6.4,u],[v-F,_+6.4,u]),i.fx=9,i.col=n,i.glow=[0,0,0],i.quad([v-F-.3,_+6.4,u+.3],[v+F+.3,_+6.4,u+.3],[v+F+.3,_+9,u-4],[v-F-.3,_+9,u-4]),I.add(v+e.range(-F,F)*.6,_+2.2,u+.4,z%3,.42,0)}for(let z=0;z<70;z++){const v=e.range(-1250,820),u=e.range(-430,-70);I.add(v,p(v,u)+1.5,u,e.chance(.6)?2:z%2,e.range(.25,.4),0)}}i.fx=0,i.glow=[0,0,0],await g.yield();const d=G?[.62,.52,.4]:[.36,.33,.3],x=G?[.36,.4,.2]:[.2,.27,.17],S=f=>1.5+1*g.noise.n2(f*.02,3.1)+.4*g.noise.n2(f*.09,7.7);for(let f=-640;f<640;f+=8){if((f+640&127)===0&&await g.yield(),f+8>o0-1&&f<e0+1)continue;const y=S(f),T=S(f+8);i.col=d,i.glow=[0,0,0],i.quad([f,0,-1.5],[f+8,0,-1.5],[f+8,T,-9],[f,y,-9]),i.quad([f,y,-9],[f+8,T,-9],[f+8,T*.8,-18.5],[f,y*.8,-18.5]);const P=Math.round(8*H);for(let M=0;M<P;M++){const h=f+e()*8,p=e.range(-16,-3),z=Math.min(1,(-1.5-p)/7.5),v=(y+(T-y)*(h-f)/8)*(p>-9?z:1-.2*(-9-p)/9.5)-.05,u=e.range(.7,1.3),_=e.range(-.3,.5);i.col=k(x,e.range(.7,1.2));const F=.2+.7*e();for(const A of[-.22,0,.22])i.v(h+A-.07,v,p,0,.6,.8,0),i.v(h+A+.07,v,p,0,.6,.8,0),i.v(h+A*2.4+_,v+u*(1-Math.abs(A)),p+.1,0,.6,.8,F)}}i.col=G?[.2,.22,.2]:[.05,.06,.09],$(i,1500,-300,[[0,430],[24,260],[42,110],[50,0]],18),i.col=j,i.glow=k(b.white,.05),$(i,1500,-300,[[48,5.5],[74,3.6],[75,5],[78,5],[82,0]],8),I.add(1500,76.5,-300,2,2.4,0)}const Pe=new m.Group;Pe.position.set(1500,76.5,-300),W.add(Pe);{const e=new m.BufferGeometry,t=G?.05:.5;e.setAttribute("position",new m.Float32BufferAttribute([0,0,0,900,-40,60,900,40,-60,0,0,0,-900,40,60,-900,-40,-60],3)),e.setAttribute("color",new m.Float32BufferAttribute([t,t,t*1.1,0,0,0,0,0,0,t,t,t*1.1,0,0,0,0,0,0],3));const o=new m.Mesh(e,new m.MeshBasicMaterial({vertexColors:!0,transparent:!0,blending:m.AdditiveBlending,depthWrite:!1,side:m.DoubleSide,fog:!1}));o.frustumCulled=!1,o.renderOrder=4,Pe.add(o)}await g.yield();const de=new m.Group,wt=C.sign(),io=C.range(0,900),Rt=C.range(470,560);if($e){const e=new U0,t=new G0;e.col=j,e.glow=k(b.white,.06),V(e,-22,0,-4.4,22,3.6,4.4),$(e,24,0,[[0,3],[3.6,4.4]],3,null,Math.PI),e.glow=k(b.white,.55*Z),V(e,-16,3.6,-3.5,13,6.4,3.5),e.glow=k(b.white,.06),V(e,-17,6.4,-3.8,14,6.7,3.8),V(e,-5,.3,4.4,5,5.6,6),V(e,-5,.3,-6,5,5.6,-4.4),e.glow=k(b.pink,.2),$(e,-3,0,[[6.7,1.3],[13,1.2]],8,H0(_0,j)),de.add(Q0(e,q0));const o=(a,s,n,r,c)=>{for(let l=0;l<=c;l++){const d=l/c;t.add(a+(n-a)*d,s+(r-s)*d-5*d*(1-d),0,l%3,.2,1,d)}};o(25,5,-3,14.5,14),o(-3,14.5,-22,5,12);for(let a=-21;a<=21;a+=2.4)for(const s of[-4.5,4.5])t.add(a,4.1,s,(Math.round(a/2.4)+9)%3,.18,0);de.add(v0(t.build(),re,5)),W.add(de)}{const e=G?[.16,.15,.17]:[.07,.07,.09];i.fx=0,i.col=e,i.glow=[0,0,0],V(i,-62,.2,425,-40,2.3,435);for(const[t,o]of[[-40,-34.5],[-62,-65.5]])S0(i,[t,.2,425],[t,2.3,425],[o,2.6,430],[o,1,430],[-51,1,440]),S0(i,[t,.2,435],[t,2.3,435],[o,2.6,430],[o,1,430],[-51,1,420]),S0(i,[t,2.3,425],[t,2.3,435],[o,2.6,430],[o,2.6,430],[-51,-20,430]);i.col=k(b.white,G?.6:.3),V(i,-62.2,2.3,424.8,-39.8,2.5,425.1),V(i,-62.2,2.3,434.9,-39.8,2.5,435.2),i.col=j,i.glow=k(b.white,.3*Z),V(i,-60.5,2.3,427.6,-56.8,4.7,432.4),i.col=k(b.mint,.5),i.glow=[0,0,0],V(i,-60.9,4.7,427.2,-56.4,4.95,432.8);for(let t=0;t<9;t++){const o=-54+t*1.5,a=(t%3-1)*.22;Y(o,2.3,430,o+a,4+t%2*.25,430+.2,.34,[.12,.12,.15])}Y(-54.6,3.1,430.5,-41.4,3.1,430.5,.1,[.3,.3,.34]),Y(-37.5,2.5,430,-37.5,7.4,430,.1,K),Y(-63.4,2.5,430,-63.4,6.2,430,.1,K),I.add(-37.5,7.6,430,2,.2,0),I.add(-63.4,6.4,430,1,.18,0);for(let t=1;t<12;t++){const o=t/12;I.add(-37.5-25.9*o,7.4-1.2*o-4.2*o*(1-o),430,t%3,.15,1,o)}}await g.yield();{const e=C.fork("air");for(let t=0;t<7;t++){const o=e.range(-62,-46),a=e.range(150,250),s=e(),n=t<3?9:2;for(let r=0;r<n;r++)ce.add(o+e.range(-.9,.9),w+2+e.range(0,1.6),a+e.range(-.9,.9),r%2,e.range(.26,.34),4,s+r*.0015)}if(G)for(let t=0,o=0;t<Math.round(100*H)&&o<900;o++){const a=e.range(-300,330),s=e.range(15,s0-10),n=e.range(16,78);if(J.distanceTo(a,n,s)<16||Math.hypot(a,s-g0)<40||_e(a,s))continue;{let c=!1;for(let l=1;l<8&&!c;l++){const d=l/8;c=J.distanceTo(a-n*.55*(1-d),1.2+(n-1.2)*d-n*.16*Math.sin(d*Math.PI),s+n*.3*(1-d))<13}if(c)continue}const r=e();ce.add(a,n,s,e.int(0,2),e.range(1,1.9),5,r),ce.add(a,n,s,2,n,8,r),t++}else for(let t=0;t<16;t++)I.add(e.range(-90,60),e.range(40,95),e.range(-140,-20),2,e.range(9,17),7,e());for(let t=0;t<200;t++)ce.add(R+76+e.gauss()*13,.14,s0-7+e.gauss()*1.6,2,.1,6,e())}await g.yield();const A0=7,he=4,Ee=3,He=5.6,Ke=1,Ue=[];let J0=null,gt=null;if(B.fwGain>0){const e=Math.round(300*(.5+.5*C0)),t=(A0+he+Ee)*e,o=C.fork("fw"),a=new Float32Array(t*4),s=new Float32Array(t*4);for(let l=0;l<A0+he+Ee;l++){const d=((l<A0?l/A0:(l-A0+.5)/he)+o()*.06)%1;l<A0+he&&Ue.push(d);for(let x=0;x<e;x++){const S=(l*e+x)*4,f=o()*2-1,y=o()*6.283,T=Math.sqrt(1-f*f);a[S]=Math.cos(y)*T,a[S+1]=f,a[S+2]=Math.sin(y)*T,a[S+3]=.72+.28*Math.pow(o(),.3),s[S]=l,s[S+1]=d,s[S+2]=o(),s[S+3]=o()}}const n=Je();n.setAttribute("aSpark",new m.InstancedBufferAttribute(a,4)),n.setAttribute("aBurst",new m.InstancedBufferAttribute(s,4)),n.instanceCount=t;const r={uTime:M0.uTime,uPeriod:{value:He},uRise:{value:Ke},uGain:{value:B.fwGain},uNA:{value:A0},uNL:{value:A0+he},uSea:O.uSea,uFogD:{value:B.fog},uKeyPos:{value:[q(-52,96,442),q(74,100,-40),q(-52,128,-95)]},uKeyTau:{value:[-1,-1,-1]},uSiteA:{value:q(0,66,g0-150)},uAreaA:{value:q(130,30,50)},uSiteB:{value:q(-50,78,432)},uAreaB:{value:q(80,26,50)},uWind:{value:q(-2.6,0,-1.2)},uPal:ne.uPal},c=l=>new m.ShaderMaterial({uniforms:{...r,uMirror:{value:l?1:0}},vertexShader:to,fragmentShader:oo,transparent:!0,depthWrite:!1,blending:m.CustomBlending,blendEquation:m.AddEquation,blendSrc:m.OneFactor,blendDst:m.OneFactor,side:m.DoubleSide});J0=v0(n,c(!1),6),gt=v0(n,c(!0),1.5),J0.userData.FU=r,W.add(J0,gt)}await g.yield();{const e=new m.PlaneGeometry(3200,30,1,1);e.rotateX(-Math.PI/2),e.translate(0,.11,s0-13);const t=new m.Mesh(e,new m.ShaderMaterial({uniforms:{...m.UniformsUtils.clone(m.UniformsLib.fog),uTime:M0.uTime,uTide:{value:s0},uCol:{value:I0(G?[.95,.85,.75]:[.3,.38,.5])},uFlash:M0.uFlash},vertexShader:`varying vec3 vW;
#include <fog_pars_vertex>
void main(){ vec4 w = modelMatrix*vec4(position,1.0); vW = w.xyz; vec4 mvPosition = viewMatrix*w; gl_Position = projectionMatrix*mvPosition;
#include <fog_vertex>
}`,fragmentShader:`
uniform float uTime, uTide, uFlash; uniform vec3 uCol; varying vec3 vW;
#include <fog_pars_fragment>
float hh(vec2 p){ p = fract(p*vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x*p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f); return mix(mix(hh(i), hh(i + vec2(1, 0)), f.x), mix(hh(i + vec2(0, 1)), hh(i + vec2(1, 1)), f.x), f.y); }
void main(){
  float zz = uTide - vW.z, a = 0.0;
  for (int i = 0; i < 3; i++) {
    float fi = float(i), ph = fract(uTime*0.055 + fi/3.0 + 0.13*sin(vW.x*0.004 + fi));
    float pos = ph*22.0 + sin(vW.x*0.045 + fi*2.1)*1.6 + sin(vW.x*0.011 + fi)*3.0;
    float w = 0.5 + 1.6*ph, d = zz - pos;
    a += (1.0 - smoothstep(0.0, w, abs(d)))*(1.0 - ph)*(1.0 - ph)*(0.45 + 0.55*vn(vec2(vW.x*0.35, zz*0.9 + fi*7.0)));
    a += (1.0 - smoothstep(-4.0, 0.0, d))*smoothstep(-9.0, -4.0, d)*0.07*(1.0 - ph);
  }
  a *= 1.0 - smoothstep(12.0, 15.0, abs(zz - 13.0));
  gl_FragColor = vec4(uCol*(1.0 + uFlash*3.0), clamp(a, 0.0, 0.9));
  #include <fog_fragment>
}`,transparent:!0,depthWrite:!1,fog:!0}));t.renderOrder=3,t.frustumCulled=!1,W.add(t);const o=[],a=[];for(let r=270,c=0;r<h0-3;r+=9.6,c++){const l=k(c%2?b.pink:b.mint,.065*(G?.5:1)),d=r+1.5;o.push(o0,w-.7,r,e0,w-.7,r,e0,2.5,d,o0,w-.7,r,e0,2.5,d,o0,2.5,d),a.push(...l,...l,0,0,0,...l,0,0,0,0,0,0)}const s=new m.BufferGeometry;s.setAttribute("position",new m.Float32BufferAttribute(o,3)),s.setAttribute("color",new m.Float32BufferAttribute(a,3));const n=new m.Mesh(s,new m.MeshBasicMaterial({vertexColors:!0,transparent:!0,blending:m.AdditiveBlending,depthWrite:!1,side:m.DoubleSide,fog:!1}));if(n.renderOrder=4,n.frustumCulled=!1,W.add(n),G&&Ge.length){const r=b0.sunDirection,c=Math.hypot(r.x,r.z)||1,l=-r.x/c,d=-r.z/c,x=Math.min(7,c/Math.max(.05,r.y)),S=[];for(const[T,P,M]of Ge)for(const h of[-1.9,1.9]){const p=Math.min(170,M*x),z=T+h*d,v=P-h*l,u=.45;S.push(z-d*u,.09,v+l*u,z+d*u,.09,v-l*u,z+l*p+d*u,.09,v+d*p-l*u,z-d*u,.09,v+l*u,z+l*p+d*u,.09,v+d*p-l*u,z+l*p-d*u,.09,v+d*p+l*u)}const f=new m.BufferGeometry;f.setAttribute("position",new m.Float32BufferAttribute(S,3));const y=new m.Mesh(f,new m.MeshBasicMaterial({color:1709104,transparent:!0,opacity:.4,depthWrite:!1,side:m.DoubleSide}));y.renderOrder=3,y.frustumCulled=!1,W.add(y)}}await g.yield();const yt=(e,t,o,a)=>{const s=new U0;s.col=e,s.glow=k(e,.07),s.beam([0,-1,-.85],[0,-1.2,-2.9],1.4,.7,{taper:.5,caps:!0,ref:[0,1,0]}),s.beam([0,-1.28,-.85],[0,-1.28,1.75],1.4,.75,{caps:!0,ref:[0,1,0]});for(const l of[-.72,.72])s.beam([l,-.75,-.85],[l,-.75,1.75],.09,.5,{caps:!0,ref:[0,1,0]});a&&(s.beam([0,-.45,.62],[0,-.45,.8],1.3,1.2,{caps:!0,ref:[0,1,0]}),s.beam([0,-.6,1.66],[0,-.6,1.8],1.4,.9,{caps:!0,ref:[0,1,0]}));const n=l=>-.65-.38*((-.85-l)/2.05)+.012,r=l=>.7*(1-.5*(-.85-l)/2.05),c=(l,d,x,S,f,y,T)=>{s.col=T,s.glow=k(T,.16),s.quad([x,n(l),l],[S,n(l),l],[y,n(d),d],[f,n(d),d])};c(-2.25,-2.75,-.3,.3,-.12,.12,t),c(-1.9,-2.25,-.14,.14,-.3,.3,t),c(-1,-1.9,-r(-1)*.9,-r(-1)*.35,-.14,.14,o),c(-1,-1.6,r(-1)*.5,r(-1)*.85,.02,.1,o),s.col=[.62,.65,.7],s.glow=[0,0,0],s.fx=4,s.tube([[-.68,-.6,-.86],[-.4,-.5,-.97],[0,-.48,-1],[.4,-.5,-.97],[.68,-.6,-.86]],.04,6,{up:[0,1,0]});for(const l of[-.42,.42])s.tube([[l,-.74,-1.2],[l,-.6,-1.27],[l,-.6,-1.45],[l,-.78,-1.52]],.022,5,{up:[1,0,0]});if(s.tube([[.5,-.98,-2.3],[.5,-.76,-2.3]],.015,4,{up:[1,0,0]}),s.fx=0,a){s.col=[.2,.18,.25],s.glow=k(b.pink,.05);for(const l of[-.33,.33])s.beam([l,-.6,.25],[l,.12,.3],.4,.34,{caps:!0})}return s},_t=[k(b.white,.8),k(b.white,.8),k(b.white,.8)][te],Gt=[b.mint,b.pink,b.mint][te],Dt=[b.pink,b.mint,b.white][te],f0=new m.Group;f0.matrixAutoUpdate=!1,W.add(f0),f0.add(Q0(yt(k(te===1?b.pink:te===0?b.white:b.mint,.8),Gt,Dt,!1),q0));const Ae=new m.Group;Ae.position.set(.5,-.74,-2.28),f0.add(Ae);{const e=new U0;for(let t=0;t<6;t++){const o=t/6*Math.PI*2,a=o+.75,s=.2;e.col=t%2?b.pink:b.mint,e.glow=k(e.col,.3),e.v(0,0,0,0,0,1),e.v(Math.cos(o)*s,Math.sin(o)*s,.02,0,0,1),e.v(Math.cos(a)*s*.62,Math.sin(a)*s*.62,.05,0,0,1)}Ae.add(Q0(e,q0))}{const e=new G0,t=C.fork("spray");for(let o=0;o<70;o++)e.add(-2.6+t.range(-.7,.7),-1.5+t.range(-.4,.5),-4.6+t.range(-1.6,1.6),2,.016+.05*t()*t(),9,t());f0.add(v0(e.build(),ut,6))}const pe=[];{const e=yt(k(b.pink,.85),b.white,b.mint,!0).build();for(let o=0;o<3;o++){const a=new m.Mesh(e,q0);a.matrixAutoUpdate=!1,a.frustumCulled=!1,W.add(a),pe.push(a)}const t=new G0;t.add(-.5,-.7,1.85,1,.12,0),t.add(.5,-.7,1.85,1,.12,0),t.add(0,-.3,-2.9,2,.1,0),pe[2].add(v0(t.build(),re,5))}const xt=(e,t)=>{ae(t,oe,We,et,tt),We.negate(),e.matrix.makeBasis(et,tt,We).setPosition(oe),e.matrixWorldNeedsUpdate=!0};await g.yield();{const e=new m.BoxGeometry(1,1,1),t=Be.length/3,o=t+Re.length/3,a=new Float32Array(o*16),s=new Float32Array(o*3);a.set(ft,0),a.set(dt,t*16),s.set(Be,0),s.set(Re,t*3);const n=(h,p)=>{const z=new m.InstancedMesh(e,p,h);return z.instanceMatrix.array.set(a.subarray(0,h*16)),z.instanceMatrix.needsUpdate=!0,z.instanceColor=new m.InstancedBufferAttribute(s.slice(0,h*3),3),z.frustumCulled=!1,W.add(z),z};n(o,Tt),t>0&&n(t,rt),await g.yield();{const h=Le.concat(pt),p=Le.length/5,z=h.length/5,v=new m.CylinderGeometry(.2,.27,1,8,4,!0);v.translate(0,.5,0);const u=new Float32Array(z*16),_=new Float32Array(z*3);for(let A=0;A<z;A++){const Q=h[A*5+4];B0.makeScale(Q,h[A*5+3],Q).setPosition(h[A*5],h[A*5+1],h[A*5+2]),B0.toArray(u,A*16);const U=.85+.3*(A*.618%1);_[A*3]=j0[0]*U,_[A*3+1]=j0[1]*U,_[A*3+2]=j0[2]*U}const F=(A,Q)=>{const U=new m.InstancedMesh(v,Q,A);U.instanceMatrix.array.set(u.subarray(0,A*16)),U.instanceMatrix.needsUpdate=!0,U.instanceColor=new m.InstancedBufferAttribute(_.slice(0,A*3),3),U.frustumCulled=!1,W.add(U)};z>0&&F(z,lt),p>0&&F(p,ct)}await g.yield();const r=Q0(m0,q0);W.add(r),await g.yield();const c=i.build();await g.yield();const l=new m.Mesh(c,q0);l.frustumCulled=!1,W.add(l);const d=new m.Mesh(c,rt);d.frustumCulled=!1,W.add(d);const x=I.count,S=[],f=[];for(let h=0;h<x;h++){const p=I.p[h*3],z=I.p[h*3+2];(z<s0+4&&Math.hypot(p,z-g0)<240&&I.a[h*4+3]<6.5?S:f).push(h)}const y=S.length;for(const h of f)S.push(h);await g.yield();const T=new G0;for(const h of S)T.p.push(I.p[h*3],I.p[h*3+1],I.p[h*3+2]),T.a.push(I.a[h*4],I.a[h*4+1],I.a[h*4+2],I.a[h*4+3]);await g.yield();const P=T.build();W.add(v0(P,re,5)),await g.yield();const M=Je();M.setAttribute("iPos",P.getAttribute("iPos")),M.setAttribute("iA",P.getAttribute("iA")),M.instanceCount=y,W.add(v0(M,Ct,1.4)),W.add(v0(ce.build(),ut,4.5))}await g.yield();const Oe=G?"sunset":{sunDir:[.1,.35,.93],sunColor:T0[3],sunIntensity:.5,sky:ye==="night"?"#5a70b8":"#6a8fc0",skyIntensity:1.5,ground:"#d8a8e0",groundIntensity:1.2},ve=[];await g.yield(),ve.push(Ze.makeFlock({rng:C.fork("gulls"),species:"gulls",count:Math.round(60*H*(.6+.4*C0)),center:[-52,64,205],radius:78,light:Oe})),await g.yield(),ve.push(Ze.makeFlock({rng:C.fork("gulls2"),species:"gulls",count:Math.round(14*H),center:[30,40,330],radius:60,light:Oe})),await g.yield(),ve.push(Ze.makeFlock({rng:C.fork("pigeons"),species:"crows",count:12,size:.75,body:"#8a90a2",wingC:"#6d7386",light:Oe,cross:{path:J,u:(ze+ke)*.5,lead:30,span:90,angle:22,side:1,height:.6,duration:ee},keepClear:{path:J,dist:2,each:!0}}));for(const e of ve)W.add(e.object);await g.yield(),await b0.prewarm(g.renderer,null,W),await g.yield();const no=q(0,32,g0),bt=new m.Vector2,Lt=c0-.012,Nt=e=>e<V0-.04?12:e<c0-.01?4.5:e<c0+.012?5:(J.pointAt(e,oe),Math.min(28,Math.sqrt(30+19.6*Math.max(0,47-oe.y)))),Y0=(e,t,o)=>{const a=Math.min(1,Math.max(0,(o-e)/(t-e)));return a*a*(3-2*a)},Mt=e=>1-.5*Y0(V0-.03,V0+.004,e)+1*Y0(c0+.014,ze-.012,e)-.2*Y0(ke,ot,e)-.68*Y0(se-.03,se+.075,e)+.38*Y0(se+.085,.915,e),F0=256,d0=new Float32Array(F0+1);for(let e=1;e<=F0;e++)d0[e]=d0[e-1]+1/Mt((e-.5)/F0);for(let e=1;e<=F0;e++)d0[e]*=ee/d0[F0];const me=e=>{const t=Math.min(1,Math.max(0,e))*F0,o=Math.min(F0-1,Math.floor(t));return d0[o]+(d0[o+1]-d0[o])*(t-o)},Et=e=>{if(e>=ee)return 1+(e-ee)/ee;let t=0,o=F0;for(;o-t>1;){const a=t+o>>1;d0[a]<=e?t=a:o=a}return(t+(e-d0[t])/Math.max(1e-6,d0[t+1]-d0[t]))/F0},Ve=[c0-.075,x0(R+76,318)-.05,x0(R+76,266)-.05,(ze+ke)*.5-.012],Ht=Ve.map(me),Fe=[-1,-1,-1,-1],Kt=q(0,20,g0),je=q(),zt=new m.Quaternion,Ut=q();let kt=0,Qe=0;const St=new m.Quaternion,Ot=q(1,1,1);return{scene:W,path:J,duration:ee,pace:Mt,title:Ye?"The Pier Comet: Blackout":B.title,ride:"none",style:"none",camera:{fov:64,near:.3,far:4300,lookAhead:11,sway:.5,bank:1},pois:[{at:[-57,13,206],from:V0-.045,to:c0-.006,weight:.5},{at:[-80,6,300],from:c0-.035,to:c0+.03,weight:.7,fade:.4},{at:[-30,22,150],from:ot-.1,to:at+.03,weight:.85},{at:(e,t)=>Kt.set(0,8+24*Y0(.82,.915,t),g0),from:at+.02,to:.94,weight:.78,fade:.2}],portal:{shape:"circle",radius:7,color:"#b9fff0",glow:1.1,revealDistance:340,tilt:!0},post:{exposure:B.exposure,bloom:B.bloom,grade:B.grade},update(e,t,o,a){M0.uTime.value=t,g.renderer.getDrawingBufferSize(bt),ne.uRes.value.copy(bt);for(let x=0;x<Ve.length;x++)Fe[x]=a<Ve[x]?-1:me(a)-Ht[x];ne.uSprayT.value=Fe[3];let s=0;if(J0){for(let S=0;S<Ue.length;S++){const f=(t/He+Ue[S])%1*He-Ke;f>0&&(s+=Math.min(1,f/.1)*Math.exp(-f/.4)*(S<A0?1:.5))}const x=J0.userData.FU.uKeyTau.value;for(let S=0;S<Ee;S++){x[S]=Fe[S];const f=Fe[S]-Ke;f>0&&(s+=Math.min(1,f/.1)*Math.exp(-f/.4)*.8)}J0.userData.FU.uGain.value=B.fwGain*(.8+.2*Math.min(1,Math.max(0,(a-.8)/.1)))}if(Qe=Math.min(.25,s*.16),M0.uFlash.value=Qe,y0.setFlash(Qe),y0.setProgress(a),Ye){const x=(a-Lt)/.07;M0.uWaveZ.value=x<0?1e6:x<1?-1e6:x<1.7?(x-1)/.7*440-20:1e6}b0.update(e,t,o),it.update(e,t,o),y0.update(e,t,o);for(const x of ve)x.update(e,t,o,a);const n=a*i0,r=Nt(a);xt(f0,n),o.matrixWorld.decompose(je,zt,Ut);const c=je.distanceTo(oe);c<2&&(St.setFromRotationMatrix(f0.matrix).slerp(zt,.8),f0.matrix.compose(je,St,Ot));const l=Math.min(1,Math.max(0,(c-1)/9));f0.visible=c<10,f0.matrix.elements[13]-=l*l*(3-2*l)*3,f0.matrix.elements[13]+=Math.sin(t*41)*.0022*r/10+Math.sin(t*17.3)*.002,kt+=e*r*1.1,Ae.rotation.z=-kt;const d=i0*Et(me(a)+4.7);for(let x=0;x<3;x++){const S=d-x*3.5;pe[x].visible=S<i0-1.5,pe[x].visible&&xt(pe[x],S)}if(ue.rotation.y=t*.5,xe?(P0.rotation.y=-t*.85,P0.rotation.x=.05*Math.sin(t*.6),P0.rotation.z=.05*Math.cos(t*.6)):(P0.position.y=w+14+10.5*Math.sin(t*.22),P0.rotation.y=t*.3),Pe.rotation.y=t*Math.PI*2/10,$e){const x=-110+wt*5.5*(me(a)-me(c0));de.position.set(x,Xe-.4+.25*Math.sin(t*.7),Rt),de.rotation.set(.012*Math.sin(t*.6),wt>0?0:Math.PI,.02*Math.sin(t*.45))}ne.uFlock.value.set(24*Math.sin(t*.19),t*.5,1.6*Math.sin(t*.53))},dispose(){b0.dispose(),y0.dispose()}}}};export{fo as default};
