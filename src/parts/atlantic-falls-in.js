import*as a from"three";import{smoothstep as C,clamp as Q,lerp as K}from"../kit/core.js";const W=520,ge=Math.tan(20*Math.PI/180),xe=["#1C4FA0","#2F9C8E","#F3F7F5","#C9A46A","#EFE6D2","#8FB0CF","#F4C56A"];function Me(){const M=new Float32Array(461),b=new Float32Array(461);let r=0;const g=e=>(14*C(250,480,e)+22*C(700,860,e))*Math.PI/180;for(let e=0;e<461;e++){const n=-60+e*2;M[e]=r,r-=Math.tan(g(n+1))*2;const o=1-C(-40,480,n);b[e]=M[e]-(11+239*o*Math.sqrt(o))}const F=(e,n)=>{const o=Q((n- -60)/2,0,459.999),v=Math.floor(o),S=o-v;return e[v]*(1-S)+e[v+1]*S},d=e=>F(M,e),m=e=>e<=712?F(b,e):F(b,712)-(e-712)*.249,x=e=>(m(e+1)-m(e-1))*.5,A=[];for(let e=0;e<=860;e+=20)A.push([e,8,d(e)]);const w=Math.cos(36*Math.PI/180),l=Math.sin(36*Math.PI/180);for(let e=25;e<=150;e+=25)A.push([860+w*e,8,d(860)-l*e]);return{pathZ:d,wallZ:m,wallSlope:x,pts:A,endDir:[w,0,-l]}}const ve=185;function J(t){const c=Math.max(t-330,0);return-4*C(200,330,t)-(c-ve*(1-Math.exp(-c/ve)))}function pe(t,c,h){const M=55*(1-Math.exp(-Math.max(c,0)/160))+9*Math.sin(c*.021+1.3),b=C(350,425,t)*(1-C(880,1010,t)),r=6.2831853*(t-M-420)/110,g=r-.45*(1-Math.cos(r));let d=12.5*b*(.78+.22*Math.sin(c*.0131+t*.004))*K(1,.6,C(250,700,c))*Math.cos(g);const m=C(235,430,t)*(1-.5*C(800,1e3,t)),x=.5+.5*Math.cos(6.2831853*(c-.5*t)/74),A=.5+.5*Math.cos(6.2831853*(c+.5*t)/61+1.7);d+=m*(4.6*x*x*x+3.8*A*A*A-2);const w=t-556+.35*c,l=1+.09*Math.sin(h*1.3)+.05*Math.sin(h*2.9+1),e=Math.exp(-w*w/2300-c*c/1150),n=Math.sin(t*.37+h*1.9)*Math.sin(c*.45-h*1.3+t*.11)+.6*Math.sin(t*.21-h*2.3+c*.3);return d+=e*(56*l+4.5*n*C(.1,.5,e)),d}function de(t,c,h){const M=1-C(200,330,t);return M<=0?0:M*(.85*Math.sin(t*.071+c*.018-h*.83)+.45*Math.sin(t*.118-c*.052-h*1.07+2)+.22*Math.sin(t*.27+c*.19-h*1.62+4))}const ee=`
uniform vec3 uSunDir, uSunCol, uSkyCol, uBounce;
uniform float uTime;
float h21(vec2 p){ p = fract(p * vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float fbm3(vec2 p){ return 0.5 * vn(p) + 0.3 * vn(p * 2.03 + 17.1) + 0.2 * vn(p * 4.11 + 41.7); }
`,te=`
#ifdef USE_FOG
varying float vFogDepth;
#endif
`,oe=`
#ifdef USE_FOG
uniform vec3 fogColor; varying float vFogDepth;
#ifdef FOG_EXP2
uniform float fogDensity;
#else
uniform float fogNear; uniform float fogFar;
#endif
#endif
float fogAmt(){
#ifdef USE_FOG
  #ifdef FOG_EXP2
  return 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  #else
  return smoothstep(fogNear, fogFar, vFogDepth);
  #endif
#else
  return 0.;
#endif
}
vec3 fogMix(vec3 c){
#ifdef USE_FOG
  return mix(c, fogColor, fogAmt());
#else
  return c;
#endif
}
`,ke=`
float floodFoam(vec2 p, float t){
  float fx = p.x - t * 30.;
  float a = fbm3(vec2(fx * 0.011, p.y * 0.028));
  float b = vn(vec2(fx * 0.033, p.y * 0.085) + 7.);
  float pch = fbm3(p * 0.0055 - vec2(t * 0.1, 0.));
  return smoothstep(0.36, 0.62, a * 0.55 + b * 0.3 + pch * 0.4 - 0.08);
}
vec3 floodFarCol(vec2 p, float t, vec3 green, vec3 white, vec3 haze){
  float f = floodFoam(p, t);
  vec3 g = green * 0.42 * (uSkyCol * 0.9 + uSunCol * 0.45), w = white * 0.74 * (uSunCol * 0.70 + haze * 0.40 + uSkyCol * 0.25);
  return mix(g, w, f);
}
`,re=`
uniform float uSurge;
float gCrest, gRidge, gPillow;
float rampY(float bx){ float u = max(bx - 330., 0.); return -4. * smoothstep(200., 330., bx) - (u - 185. * (1. - exp(-u / 185.))); }
float standY(float bx, float d, float t){
  float bow = 55. * (1. - exp(-max(d, 0.) / 160.)) + 9. * sin(d * 0.021 + 1.3);
  float env = smoothstep(350., 425., bx) * (1. - smoothstep(880., 1010., bx));
  float ph = 6.2831853 * (bx - bow - 420.) / 110.;
  float psi = ph - 0.45 * (1. - cos(ph));
  float amp = 12.5 * env * (0.78 + 0.22 * sin(d * 0.0131 + bx * 0.004)) * mix(1., 0.6, smoothstep(250., 700., d));
  float h = amp * cos(psi);
  gCrest = env * smoothstep(0.35, 1., cos(psi - 0.55));
  float renv = smoothstep(235., 430., bx) * (1. - 0.5 * smoothstep(800., 1000., bx));
  float r1 = 0.5 + 0.5 * cos(6.2831853 * (d - 0.5 * bx) / 74.), r2 = 0.5 + 0.5 * cos(6.2831853 * (d + 0.5 * bx) / 61. + 1.7);
  r1 = r1 * r1 * r1; r2 = r2 * r2 * r2;
  h += renv * (4.6 * r1 + 3.8 * r2 - 2.0);
  gRidge = renv * max(r1, r2);
  float px = bx - 556. + 0.35 * d, heave = 1. + 0.09 * sin(t * 1.3) + 0.05 * sin(t * 2.9 + 1.0) + 0.12 * uSurge;
  gPillow = exp(-px * px / 2300. - d * d / 1150.);
  float boil = sin(bx * 0.37 + t * 1.9) * sin(d * 0.45 - t * 1.3 + bx * 0.11) + 0.6 * sin(bx * 0.21 - t * 2.3 + d * 0.3);
  h += gPillow * (56. * heave + 4.5 * boil * smoothstep(0.1, 0.5, gPillow));
  return h;
}
float swellY(float bx, float z, float t){
  float k = 1. - smoothstep(200., 330., bx);
  return k * (0.85 * sin(bx * 0.071 + z * 0.018 - t * 0.83) + 0.45 * sin(bx * 0.118 - z * 0.052 - t * 1.07 + 2.0)
    + 0.22 * sin(bx * 0.27 + z * 0.19 - t * 1.62 + 4.0));
}
float waterH(float bx, float d, float z, float t){ return rampY(bx) + standY(bx, d, t) + swellY(bx, z, t); }
// travel time of the stream to brief-x (seconds): 1/v = 0.025 + 0.375 * (1 - tanh((bx-300)/70)) / 2, integrated exactly
float flowT(float bx){ float q = (bx - 300.) / 70., aq = abs(q);
  float lncosh = aq + log(1. + exp(-2. * aq)) - 0.6931472;
  return 0.025 * bx + 0.1875 * (bx - 70. * lncosh); }
float flowV(float bx){ float q = clamp((bx - 300.) / 70., -9., 9.); float th = 1. - 2. / (exp(2. * q) + 1.);
  return 1. / (0.025 + 0.1875 * (1. - th)); }
`,Se=`
attribute float aD; attribute float aSlope;
varying vec3 vL; varying float vBx, vD, vSlope;
${te}
uniform float uTime;
${re}
void main(){
  float bx = position.x + ${W}.;
  vec3 p = position; p.y = waterH(bx, aD, position.z, uTime);
  vBx = bx; vD = aD; vSlope = aSlope;
  vL = p;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  #ifdef USE_FOG
  vFogDepth = -mvPosition.z;
  #endif
  gl_Position = projectionMatrix * mvPosition;
}`,ze=`
precision highp float;
${ee}
${oe}
${re}
${ke}
uniform vec3 uCam, uCobalt, uGreen, uWhite, uHaze, uGold;
varying vec3 vL; varying float vBx, vD, vSlope;
void main(){
  float t = uTime, e = 0.7;
  float hx = waterH(vBx + e, vD - e * vSlope, vL.z, t);
  float hz = waterH(vBx, vD + e, vL.z + e, t);
  float h0 = waterH(vBx, vD, vL.z, t);
  float crest = gCrest, ridge = gRidge, pillow = gPillow;
  vec3 N = vec3(-(hx - h0) / e, 1., -(hz - h0) / e);
  float v = flowV(vBx), T = flowT(vBx);
  vec3 toCam = uCam - vL; float dist = max(length(toCam), 0.01); vec3 V = toCam / dist;
  float lod = 1. - smoothstep(120., 800., dist);
  // FLOW COORDINATES: (seconds along the stream minus time, metres across). Patterns drawn here travel at the
  // local speed (2.6 m/s on the swell, 40 m/s down the ramp) through shapes that stand still.
  vec2 fc = vec2(T - t, vD);
  float wide = mix(0.36, 1., lod);                                          // seen from far above the foam reads as patches, not as a comb
  float n1 = fbm3(vec2(fc.x * 0.9, fc.y * 0.22 * wide));
  float n2 = fbm3(vec2(fc.x * 2.7 + 9., fc.y * 0.61 * wide + 3.));
  float n3 = vn(vec2(fc.x * 7.3, fc.y * 1.9));
  float slow = 1. - smoothstep(4., 12., v), fast = smoothstep(10., 40., v);
  float lod2 = 1. - smoothstep(30., 160., dist);
  float n4 = vn(vec2(fc.x * 21., fc.y * 5.7));
  float nearI = (1. - smoothstep(18., 120., dist)) * smoothstep(7., 18., v);                    // POLISH 2: under the lens the grain of fast water is round (lumps, holes, bubbles), not combed
  n3 = mix(n3, vn(vec2(fc.x * 14. + 1., fc.y * 0.47)), nearI); n4 = mix(n4, vn(vec2(fc.x * 60., fc.y * 2.)), nearI);
  float thr = smoothstep(0.7, 0.95, vn(vec2(fc.x * 3.7 + 5., fc.y * 2.9))) * lod;
  float fn = n1 * 0.48 + n2 * 0.30 + mix(0.09, n3 * 0.18, lod) + (n4 - 0.5) * 0.14 * lod2 + thr * 0.2 * fast;
  float lacePat = 1. - abs(2. * fbm3(vec2(fc.x * 1.3 + vL.z * 0.05, fc.y * 0.33)) - 1.);
  float iso = fbm3(vec2(fc.x * 3.6 + 2., fc.y * 0.11 + 5.));                 // torn cells a dozen metres across, carried with the flow: fast water is blotched, not combed
  fn = mix(fn, fn * 0.5 + iso * 0.5, fast * 0.8);
  fn = mix(fn, 0.15 + 0.5 * lacePat * lacePat + 0.25 * n2, slow);
  // POLISH 2: seen from the void the racing water is drawn ALONG its run: long foam streaks and dark glass lanes between them
  float farK = fast * (1. - lod2);
  float stA = vn(vec2(fc.x * 1.15 + 3., fc.y * 0.17)), stB = vn(vec2(fc.x * 2.9, fc.y * 0.47 + 9.)), stC = vn(vec2(fc.x * 6.7 + 1., fc.y * 1.3));
  float streakF = stA * 0.5 + stB * 0.32 + stC * 0.18 * lod;
  fn = mix(fn, fn * 0.35 + streakF * 0.65, farK * 0.85);
  vec2 pc = vec2(vL.x * 0.085 + vL.y * 0.07, vL.z * 0.085 - vL.y * 0.05) + t * vec2(0.55, -0.35);            // (taken on the slope itself, so nothing stretches into stripes down its flanks)
  float pboil = 0.5 * fbm3(pc) + 0.3 * vn(pc * 2.9 + 7.) + 0.2 * vn(pc * 7.3 - t * 0.4);
  float nearC = nearI;
  fn = mix(fn, 0.15 * fn + 0.50 * vn(vec2(fc.x * 6.5, fc.y * 0.21)) + 0.35 * vn(vec2(fc.x * 15. + 3., fc.y * 0.52 + 1.)), nearC * 0.92);     // POLISH 2: under the lens torn water is lumps and lace a few metres across, never a smear of streaks
  fn = mix(fn, 0.10 + 0.86 * pboil, smoothstep(0.12, 0.45, pillow));     // the pillow boils: torn white with green holes, no streaks run up it
  float crestN = smoothstep(0.42, 1., crest);                                   // the torn line itself, not the whole back of the hill
  float A = 0.10 * fast * lod2 + 0.60 * crestN + 0.42 * ridge * smoothstep(5., 25., v) + smoothstep(0.30, 0.85, pillow) * (0.50 + 0.30 * n2) + 0.25 * pillow
          + 0.32 * smoothstep(520., 900., vBx) + slow * (0.07 + 0.15 * vn(vL.xz * 0.02 + 3.))
          + 0.5 * (fbm3(vL.xz * 0.0055 - vec2(t * 0.1, 0.)) - 0.5) * fast * (1. - lod);     // far off: whiter and greener reaches a hundred metres across
  A = clamp(A, 0., 1.25);
  float foam = smoothstep(0.80 - A * 0.74, mix(0.99 - A * 0.60, 0.80 - A * 0.74 + 0.11, fast * (1. - 0.5 * lod2)), fn);      // fast water tears: hard-edged white, not a soft smear
  float pK = smoothstep(0.10, 0.40, pillow);
  foam = mix(foam, smoothstep(0.50, 0.60, pboil + 0.13 * smoothstep(0.45, 0.95, pillow)), pK);
  float clot = 0.6 * vn(vec2(fc.x * 38., fc.y * 1.6 + 2.)) + 0.4 * vn(vec2(fc.x * 90. + 5., fc.y * 3.7));      // under the lens the white is clots and lace with green in the holes, not a streak
  foam *= mix(1., 0.30 + 0.80 * smoothstep(0.26, 0.56, clot), (1. - smoothstep(14., 75., dist)) * fast * (1. - pK));
  // fine relief: wind chop on the open sea, ironed smooth in the tongue, torn where the water is fast and white
  vec2 q = vec2(fc.x * 3.1, fc.y * 0.9); float q0 = vn(q);
  vec2 g1 = vec2(vn(q + vec2(0.35, 0.)) - q0, vn(q + vec2(0., 0.35)) - q0);
  vec2 qc = vL.xz * 0.42 + t * vec2(0.55, 0.21); float c0 = vn(qc);
  vec2 g2 = vec2(vn(qc + vec2(0.3, 0.)) - c0, vn(qc + vec2(0., 0.3)) - c0);
  vec2 qd = vL.xz * 1.9 - t * vec2(0.8, 0.5); float d0 = vn(qd);
  vec2 g3 = vec2(vn(qd + vec2(0.3, 0.)) - d0, vn(qd + vec2(0., 0.3)) - d0);
  float chop = 1. - smoothstep(180., 320., vBx);
  vec2 qi = vec2(fc.x * 20., fc.y * 0.66); float i0 = vn(qi);
  vec2 gI = vec2(vn(qi + vec2(0.35, 0.)) - i0, vn(qi + vec2(0., 0.35)) - i0);
  N.xz += (mix(g1, gI, 0.8 * nearI) * (0.10 + 0.55 * fast + 0.5 * foam) + (g2 * 0.55 + g3 * 0.35 * lod) * chop) * (0.35 + 0.65 * lod);
  N = normalize(N);
  float ndl = dot(N, uSunDir), ndv = max(dot(N, V), 0.);
  // body colour by speed: cobalt -> glass green -> milk
  float g = smoothstep(2.8, 9., v);
  vec3 deep = mix(uCobalt * 0.42, uGreen * 0.6, g);
  float lift = clamp(crest * 0.7 + ridge * 0.5 + max(h0 - rampY(vBx), 0.) * 0.035, 0., 1.);
  deep = mix(deep, uGreen * 1.1 + vec3(0.01, 0.07, 0.04), lift * 0.6 * g);
  deep = mix(deep, mix(uGreen, uWhite, 0.5) * 0.72, 0.14 * smoothstep(22., 40., v) * (0.4 + 0.6 * n1));
  deep *= mix(1., 0.50 + 1.05 * lift + 0.35 * (streakF - 0.5), fast * (1. - 0.6 * lod2));           // dark glass in the troughs and lanes, bright jade on the faces that climb
  deep = mix(deep, uGreen * 1.35 + vec3(0.0, 0.10, 0.06), 0.85 * smoothstep(0.06, 0.3, pillow));                 // glass green where the heap is thin: its flanks and the holes in its foam
  vec3 body = deep * (uSkyCol * 0.9 + uSunCol * (0.3 + 0.6 * max(ndl, 0.)));
  float om = 1. - ndv, fres = 0.02 + 0.98 * om * om * om * om * om;
  vec3 R = reflect(-V, N); float ry = sqrt(clamp(R.y, 0., 1.));
  vec3 skyRef = mix(uHaze * 1.05, uSkyCol * 1.5, ry);
  vec3 col = mix(body, skyRef, fres * 0.9 * (1. - 0.6 * fast));              // torn fast water does not mirror the sky
  vec3 Hh = normalize(uSunDir + V + vec3(0., 1e-4, 0.));
  float ndh = max(dot(N, Hh), 0.);
  float s1 = ndh * ndh; s1 *= s1; s1 *= s1; s1 *= s1; float s2 = s1 * s1; s2 *= s2; s2 *= s2;     // ^16, ^256
  col += uSunCol * uGold * (s2 * 5. + s1 * 0.12) * (1. - foam);
  float lipK = smoothstep(215., 300., vBx) * (1. - smoothstep(335., 400., vBx)) * om * om * smoothstep(120., 260., dist);   // seen low and from afar the ironed tongue is a bright glittering line
  col += (uSunCol * 0.55 + uSkyCol * 0.7) * lipK * (0.55 + 0.9 * smoothstep(0.45, 0.8, vn(vec2(vL.x * 0.5 - t * 3., vL.z * 0.12))));
  // white water: albedo 0.78, shadows tinted haze blue so it never clips
  float wrap = clamp(ndl * 0.45 + 0.62, 0., 1.);           // spray scatters: the east-facing ramp still glows under a low sun
  vec3 foamLit = uWhite * (0.66 + 0.12 * n3) * (uSunCol * wrap * 0.92 + uHaze * 0.5 + uSkyCol * 0.25);
  foamLit *= mix(1., 0.62 + 0.75 * pboil, pK);                                  // boils stand in their own blue shade
  // POLISH 2: the pillow is torn, boiling water: domes a few metres across, each lit on its crown, with blue-grey creases where
  // they meet and green glass in the holes, never a blank white egg
  float pcr = abs(vn(pc * 2.3 + 3.) - 0.5) * 2., pcr2 = abs(vn(pc * 5.9 + 11.) - 0.5) * 2., pcr3 = abs(vn(pc * 13. + 5.) - 0.5) * 2.;
  float crease = clamp((1. - smoothstep(0.0, 0.24, pcr)) * 0.75 + (1. - smoothstep(0.0, 0.30, pcr2)) * 0.5 + (1. - smoothstep(0.0, 0.35, pcr3)) * 0.3 * lod2, 0., 1.);
  foamLit *= mix(vec3(1.), mix(vec3(1.10), vec3(0.46, 0.60, 0.78), crease), pK);
  float nearF = 1. - smoothstep(25., 140., dist);
  float ftex = 0.5 * mix(vn(vec2(fc.x * 9. + 3., fc.y * 0.9)), vn(vec2(fc.x * 24. + 3., fc.y * 0.8)), fast) + 0.3 * n4 + 0.2 * vn(vec2(fc.x * 47., fc.y * 4.3 + 7.));      // close to: lumps, torn holes and bubble grain, blue in the hollows
  foamLit *= mix(vec3(1.), mix(vec3(0.60, 0.72, 0.86), vec3(1.12), smoothstep(0.25, 0.75, ftex)), nearF * (1. - pK));
  col = mix(col, foamLit, foam * 0.94);
  // behind the Rock the flood spreads north over raw ground: torn white water streaked with green, never a calm sheet
  float spreadK = (1. - smoothstep(-70., -4., vD)) * smoothstep(700., 760., vBx) * (1. - smoothstep(880., 1000., vBx));
  vec2 sq = vec2((vL.x + vL.z * 0.35) - t * 26., vL.z - vL.x * 0.35);                 // streaks drawn in world space along the run of the flood
  float sst = fbm3(vec2(sq.x * 0.003, sq.y * 0.06)) * 0.5 + vn(vec2(sq.x * 0.008, sq.y * 0.2)) * 0.4 + vn(vec2(sq.x * 0.03, sq.y * 0.6)) * 0.25 * lod;
  vec3 spreadCol = mix(uGreen * 0.42 * (uSkyCol * 0.9 + uSunCol * 0.45), foamLit, smoothstep(0.3, 0.62, sst));
  col = mix(col, spreadCol, spreadK * 0.9);
  col = mix(col, floodFarCol(vL.xz, t, uGreen, uWhite, uHaze), smoothstep(880., 1040., vBx));     // the world carries the chute on below in the same hand
  col = mix(col, floodFarCol(vL.xz, t, uGreen, uWhite, uHaze), 0.85 * smoothstep(560., 860., vD) * smoothstep(700., 800., vBx));     // POLISH 2: the far side of the flood is flood, not a blue slab
  col = mix(col, uHaze * 0.8, 0.5 * smoothstep(700., 1000., vD) * (1. - smoothstep(700., 800., vBx)));
  gl_FragColor = vec4(fogMix(col), 1.);
}`;async function Ce(t,c){const b=new Float32Array(241);{const w=v=>v<200?1:v<800?3:1.2;let l=0;for(let v=-160;v<1060;v+=2)l+=w(v)*2;let e=0,n=1,o=-160;for(b[0]=-160;n<=240&&o<1060;)e+=w(o)*.5,o+=.5,e>=l*n/240&&(b[n++]=o);for(;n<=240;n++)b[n]=1060}const r=new Float32Array(26751*3),g=new Float32Array(26751),F=new Float32Array(26751);let d=0;for(let w=0;w<=110;w++){const l=-6+2.2*w+574e-6*w*w*w,e=1-w/110;for(let n=0;n<=240;n++,d++){const o=b[n],v=Math.max(o-712,0)*1.5+260*C(712,760,o),S=l-v*e*e*e;r[d*3]=o-W,r[d*3+1]=0,r[d*3+2]=t.wallZ(o)+S,g[d]=S,F[d]=t.wallSlope(o)}w%16===15&&await c.yield()}await c.yield();const m=new Uint32Array(26400*6);let x=0;for(let w=0;w<110;w++)for(let l=0;l<240;l++){const e=w*241+l,n=e+1,o=e+240+1,v=o+1;m[x++]=e,m[x++]=o,m[x++]=n,m[x++]=n,m[x++]=o,m[x++]=v}const A=new a.BufferGeometry;return A.setAttribute("position",new a.BufferAttribute(r,3)),A.setAttribute("aD",new a.BufferAttribute(g,1)),A.setAttribute("aSlope",new a.BufferAttribute(F,1)),A.setIndex(new a.BufferAttribute(m,1)),A.boundingSphere=new a.Sphere(new a.Vector3(30,-200,300),1e3),A}const _=t=>{const c=Math.sin(t*127.1+311.7)*43758.5453;return c-Math.floor(c)};function me(t){const c=[];let h=40;for(;h<712;)c.push({x:h,z:t.wallZ(h),a:Math.atan(-t.wallSlope(h))}),h+=h<400?8:h<440?4:2;const M=Math.atan(.249),b=22,r={x:712,z:t.wallZ(712)},g=n=>[Math.cos(n),-Math.sin(n)],F=g(M+Math.PI/2),d=[r.x+b*F[0],r.z+b*F[1]],m=84*Math.PI/180;for(let n=0;n<=14;n++){const o=M+(m-M)*n/14,v=g(o+Math.PI/2);c.push({x:d[0]-b*v[0],z:d[1]-b*v[1],a:o,e:.01+n})}let x=c[c.length-1].x,A=c[c.length-1].z,w=15,l=2.5;for(let n=0;n<50;n++){const o=m-26*Math.PI/180*C(0,50,n)+.1*Math.sin(n*.33),v=g(o);x+=v[0]*l,A+=v[1]*l,w+=l,l=Math.min(l*1.065,15),c.push({x,z:A,a:o,e:w})}let e=0;for(let n=0;n<c.length;n++){const o=c[n];n&&(e+=Math.hypot(o.x-c[n-1].x,o.z-c[n-1].z)),o.s=e,o.nx=Math.sin(o.a),o.nz=Math.cos(o.a),o.e=o.e||0,o.bx=Math.min(o.x,712+o.e*.2)}return c}async function Fe(t,c){const h=t.attributes.position.array,M=t.index.array,b=new Float32Array(h.length);for(let r=0;r<M.length;r+=3){const g=M[r]*3,F=M[r+1]*3,d=M[r+2]*3,m=h[g],x=h[g+1],A=h[g+2],w=h[F]-m,l=h[F+1]-x,e=h[F+2]-A,n=h[d]-m,o=h[d+1]-x,v=h[d+2]-A,S=l*v-e*o,i=e*n-w*v,z=w*o-l*n;b[g]+=S,b[g+1]+=i,b[g+2]+=z,b[F]+=S,b[F+1]+=i,b[F+2]+=z,b[d]+=S,b[d+1]+=i,b[d+2]+=z,r%24e3===23997&&await c.yield()}for(let r=0;r<b.length;r+=3){const g=Math.hypot(b[r],b[r+1],b[r+2])||1;b[r]/=g,b[r+1]/=g,b[r+2]/=g,r%6e4===59997&&await c.yield()}t.setAttribute("normal",new a.BufferAttribute(b,3))}async function Ae(t,c,h){const M=t.noise,b=me(c),r=b.length,g=24,F=46,d=24,m=7,x=g+F+d+m,A=new Float32Array(r*x*3),w=new Float32Array(r*x*4),l=100/F;let e=0;for(let S=0;S<r;S++){const i=b[S],z=C(0,40,i.e),G=C(0,3,i.e),p=(75+53*C(150,470,i.x))*(1-z)+132*C(560,700,i.x)*(1-z)+z*(262-96*C(40,480,i.e))+11*M.fbm2(i.s*.012,3.3,3)+14*M.n2(i.s*.0065,1.7)+5*M.n2(i.s*.06,9.1),q=K(Math.min(J(i.bx)-14,-8),Math.min(-300,J(i.x)-80),C(700,716,i.x)),N=C(320,370,i.x)*(1-C(4,30,i.e));let u=0;for(let f=0;f<x;f++,e++){let y,P=0,I=!1;if(f<g){const R=f/g;y=K(q,-40,1-(1-R)*(1-R))}else if(f<g+F)y=-40+(f-g)*(100/F);else if(f<x-m){const R=(f-g-F)/(d-1);y=K(60,p,R*(.55+.45*R))}else{const R=f-(x-m)+1,$=K(430,K(70,150,z),G);if(I=!0,R===m)y=-300,P=$+12;else{const O=R/(m-1);y=K(p,36+16*M.n2(i.s*.008,O*2.5),O*O*(3-2*O)),P=4+$*Math.pow(O,1.3),y=K(y,p-(p-40)*Math.pow(O,1.5)+9*M.n2(i.s*.02,O*4)*O,G)}}const T=I?p:y,D=Math.max(T-20,0),B=Math.max(T-(p-60),0);let V=-(.2*D+.0011*D*D)-.006*B*B-P-.6*C(9,4,y)*(1-z);V+=z*.12*Math.max(-90-y,0);const s=y-ge*i.s*.8,L=C(9.5,6,y),k=8*M.fbm2(i.s*.011,y*.009,3)+4.5*M.fbm2(i.s*.04+7,y*.03,2),j=s/6.5+.35*M.n2(i.s*.02,5.5),H=Math.floor(j),Z=j-H;let E=(_(H)-.5)*4.4+(_(Math.floor(j/3)+90)-.5)*6+.9*C(.7,.95,Z)-.8*C(.22,0,Z);const be=Math.floor((i.s+_(H+40)*5)/(4.5+3*_(H+7)));E+=(_(be*13.7+H*3.1)-.5)*(1.3+1.6*L);const se=-7*C(.55,.9,M.fbm2(i.s*.03+20,y*.004,2)*.5+.5)*C(20,70,y);E*=1-.4*z;const we=z*(22*M.fbm2(i.s*.012+40,y*.007,3)+9*M.n2(i.s*.035,y*.02));let U=k+E+se+we;if(I){const R=(f-(x-m))/3;U=K(u,k*.5,C(0,1,R))}else f===x-m-1&&(u=U);let le=0,ie=0,ae=0,fe=y;if(z<.5&&!I){const R=(i.x-578)/17;U+=17*Math.exp(-R*R)*C(-2,-42,y);const $=(i.x-628)/8.5,O=(y-23)/6.5;le=Math.exp(-$*$-O*O*(y>23?1.6:.8));for(const X of h){const ue=Math.abs(i.s-X.s)/X.w;if(ue>1.4)continue;const Y=X.y-y,ne=1-C(.7,1.3,ue);if(X.low){Y<-.1&&(ae=Math.max(ae,ne*X.d*(1-C(1.5,9,-Y)))),Math.abs(Y+l)<.02&&(fe=K(y,X.y+.3,C(.3,.8,ne)));continue}Y>=-.5?ie=Math.max(ie,ne*X.d*(1-C(0,X.d*2.6,Y))):U-=ne*2.2*(1-C(.5,6,-Y))}}const he=N*C(-8,-2,y)*(1-C(20,30,y)),ye=I?U:Q(k*.45+(E+se)*1.25-1.6,-8,1.9);U=K(U,ye,he)+ie*(1-he)-ae-13*le,y=fe,V+=U,A[e*3]=i.x+i.nx*V-W,A[e*3+1]=y,A[e*3+2]=i.z+i.nz*V,w[e*4]=j,w[e*4+1]=i.s,w[e*4+2]=I?K(f===x-m?1.45:2,1,G):Q(1+E*.16+se*.05-le*1.1-ae*.17,.12,1.15),w[e*4+3]=i.bx}S%4===3&&await t.yield()}const n=new Uint32Array((r-1)*(x-1)*6);let o=0;for(let S=0;S<r-1;S++)for(let i=0;i<x-1;i++){const z=S*x+i,G=z+x,p=z+1,q=G+1;n[o++]=z,n[o++]=G,n[o++]=p,n[o++]=p,n[o++]=G,n[o++]=q}const v=new a.BufferGeometry;return v.setAttribute("position",new a.BufferAttribute(A,3)),v.setAttribute("aInfo",new a.BufferAttribute(w,4)),v.setIndex(new a.BufferAttribute(n,1)),await t.yield(),await Fe(v,t),await t.yield(),v.boundingSphere=new a.Sphere(new a.Vector3(100,0,-250),900),{geo:v,st:b,NR:x}}const Ne=`
attribute vec4 aInfo;
varying vec3 vL, vN; varying vec4 vInfo;
${te}
void main(){
  vL = position; vN = normal; vInfo = aInfo;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  #ifdef USE_FOG
  vFogDepth = -mvPosition.z;
  #endif
  gl_Position = projectionMatrix * mvPosition;
}`,Ie=`
precision highp float;
${ee}
${oe}
uniform vec3 uCam, uHoney, uBone, uHaze, uShade, uWhite;
uniform float uTide;
varying vec3 vL, vN; varying vec4 vInfo;
float rampY(float bx){ float u = max(bx - 330., 0.); return -4. * smoothstep(200., 330., bx) - (u - 185. * (1. - exp(-u / 185.))); }
// jointed blocks: a jittered brick lattice (rows offset by half a block). x = distance to the block's centre,
// y = distance to its nearest joint (0 on the joint), zw = the block
vec4 fracCell(vec2 p, float jit){ vec2 i = floor(p), f = fract(p); float d1 = 8., d2 = 8.; vec2 best = vec2(0.);
  for (int yy = -1; yy <= 1; yy++) for (int xx = -2; xx <= 1; xx++) { vec2 c = i + vec2(float(xx), float(yy));
    vec2 r = c + vec2(0.5 + jit * (h21(c) - 0.5) + 0.5 * mod(c.y, 2.), 0.5 + jit * (h21(c + 71.3) - 0.5)) - p; r.y *= 1.25; float d = max(abs(r.x), abs(r.y)) * 0.8 + 0.2 * length(r);
    if (d < d1) { d2 = d1; d1 = d; best = c; } else if (d < d2) d2 = d; }
  return vec4(d1, d2 - d1, best); }
void main(){
  float y = vL.y, s = vInfo.y, bq = vInfo.x, backF = smoothstep(1.2, 1.9, vInfo.z), ao = min(vInfo.z, 1.15);
  vec2 gp = mix(vec2(s, y), vL.xz, backF);
  float dist = length(uCam - vL), lod = 1. - smoothstep(90., 600., dist), lod2 = 1. - smoothstep(25., 160., dist);
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)); if (!gl_FrontFacing) N = -N;
  float eastF = smoothstep(713.5, 720., vInfo.w) * (1. - backF) * smoothstep(-0.5, -0.1, N.x), freshF = 1. - smoothstep(6., 9.5, y);     // the shaded east FACE only: the upland behind the crest takes the sun
  vec3 fN = cross(dFdx(vL), dFdy(vL)); fN = normalize(fN + N * 1e-5);                 // broken, faceted rock
  N = normalize(mix(N, fN, min(0.22 + 0.2 * freshF + 0.36 * (1. - smoothstep(20., 90., dist)) + 0.26 * eastF, 0.9))); vec3 Nm = N;     // up close the face is broken planes, not a dune
  // rock detail: bed partings, joints, facets
  float wob = vn(vec2(s * 0.05, y * 0.05));
  float bqq = bq + (wob - 0.5) * 0.18;
  float fb = fract(bqq), bi = floor(bqq);
  float fb2 = fract(bqq * 3.7 + 0.3);
  float part = (1. - smoothstep(0.0, 0.10, fb)) * (0.3 + 0.7 * vn(vec2(s * 0.23, bi * 7.3))) * 0.8
             + (1. - smoothstep(0.0, 0.12, fb2)) * 0.3 * lod2 * vn(vec2(s * 0.5, floor(bqq * 3.7) * 3.1));
  float jw = 4.5 + 3. * h21(vec2(bi, 7.));
  float sj = s + (vn(vec2(y * 0.3, bi * 3.1)) - 0.5) * 1.8 + (fb - 0.5) * 3.2 * (h21(vec2(bi, 3.)) - 0.5);
  float jq = (sj + h21(vec2(bi, 40.)) * 5.) / jw;
  float jf = fract(jq), ji = floor(jq);
  float joint = (1. - smoothstep(0.0, 0.05, jf)) * 0.7 * step(0.3, h21(vec2(ji, bi + 9.)))
              + (1. - smoothstep(0., 0.07, fract(jq * 2.3 + 0.4 * fb))) * 0.25 * lod2 * step(0.5, h21(vec2(floor(jq * 2.3 + 0.4 * fb), bi)));
  float flatTop = smoothstep(0.5, 0.8, N.y), lineK = (1. - flatTop) * (1. - backF) * (0.25 + 0.75 * lod) * (1. - 0.25 * eastF);
  part *= lineK; joint *= lineK;
  float blockTone = mix(0.5, h21(vec2(ji, bi)), lineK), bandTone = h21(vec2(floor(bqq / 3.), 3.));
  float grain = fbm3(gp * 0.9), grain2 = vn(gp * 4.1);
  // bump from the same pattern (cheap normal tilt)
  vec3 Tn = normalize(vec3(N.z, 0., -N.x) + vec3(1e-4, 0., 0.));
  float bumpS = vn(vec2(s * 0.9 + 0.4, y * 0.9)) - vn(vec2(s * 0.9 - 0.4, y * 0.9));
  float bumpY = vn(vec2(s * 0.9, y * 0.9 + 0.4)) - vn(vec2(s * 0.9, y * 0.9 - 0.4));
  N = normalize(N - (Tn * bumpS + vec3(0., 1., 0.) * (bumpY + (part - 0.2) * 0.5)) * 0.34 * (0.3 + 0.7 * lod));
  float nearK = 1. - smoothstep(14., 70., dist);
  float b2S = vn(vec2(s * 3.1 + 0.15, y * 3.1)) - vn(vec2(s * 3.1 - 0.15, y * 3.1)), b2Y = vn(vec2(s * 3.1, y * 3.1 + 0.15)) - vn(vec2(s * 3.1, y * 3.1 - 0.15));
  N = normalize(N - (Tn * b2S + vec3(0., 1., 0.) * b2Y) * 0.55 * nearK * (1. - backF));
  // colour by height: weathered honey-grey above the old tide line, raw bone below it
  float tj = (vn(vec2(s * 0.6, 3.)) - 0.5) * 0.5 + (vn(vec2(s * 3.3, 9.)) - 0.5) * 0.22;
  float crust = (vn(vec2(s * 0.9, 21.)) - 0.5) * 1.1 + (vn(vec2(s * 4.7, y * 0.6)) - 0.5) * 0.5;                    // the barnacle band's upper edge: uneven, crusted
  float wtop = uTide + 0.42 * (vn(vec2(s * 0.47, 31.)) - 0.5) + 0.34 * (vn(vec2(s * 1.9, 13.)) - 0.5) + 0.12 * (vn(vec2(s * 7.1, 5.)) - 0.5);      // the old tide line: level, but drawn by living things, never ruled
  float above = max(smoothstep(wtop - 0.35 + tj * 0.4, wtop + 0.30 + tj * 0.4, y + 0.3 * (grain2 - 0.5)), eastF);
  // BROKEN ROCK: two sizes of fracture cell skewed along the beds. Below the tide line the face is days old: angular blocks,
  // each its own plane and tone, open dark joints with a lit lip, a few blocks fallen out. Above it the same joints, weathered.
  vec2 fp = vec2(s * 0.40 + y * 0.06, (y - 0.29 * s) * 0.80 + 0.22 * vn(vec2(s * 0.21, y * 0.3)));
  vec4 fr1 = fracCell(fp, 0.62), fr2 = fracCell(fp * 0.34 + 9.3, 0.5);
  float fId = h21(fr1.zw + 3.1), fId2 = h21(fr1.zw + 17.7), gId = h21(fr2.zw + 5.9), gId2 = h21(fr2.zw + 23.3);
  float fK = (1. - above) * (1. - backF) * (1. - eastF) * lod2, gK = (1. - backF) * (1. - eastF) * (0.25 + 0.75 * lod) * (1. - 0.5 * flatTop);
  float open1 = 0.35 + 0.65 * smoothstep(0.25, 0.7, vn(fp * 0.9 + 5.));                                    // some joints gape, some are hairlines
  float gape = smoothstep(0.42, 0.78, open1);
  float crackF = (1. - smoothstep(0.016, 0.02 + 0.085 * gape, fr1.y)) * fK * (0.12 + 0.88 * gape), crackG = (1. - smoothstep(0.008, 0.03, fr2.y)) * gK * 0.55;
  float jointAO = (1. - smoothstep(0.0, 0.30, fr1.y)) * fK * (0.3 + 0.7 * gape);
  float lipF = smoothstep(0.05, 0.09, fr1.y) * (1. - smoothstep(0.09, 0.22, fr1.y)) * fK;
  // POLISH 2: a third, small size of break inside half of the plates (shattered rock, chips, rubble faces), close to only
  vec4 fr3 = fracCell(fp * 3.3 + 4.7, 0.7); float hId = h21(fr3.zw + 9.1), hId2 = h21(fr3.zw + 31.7);
  float hK = fK * (1. - smoothstep(30., 110., dist)) * smoothstep(0.38, 0.58, vn(fp * 0.45 + 13.));
  float socket = step(0.88, fId) * fK * smoothstep(0.03, 0.10, fr1.y);
  vec3 honey = mix(uHoney, vec3(0.42, 0.40, 0.37), 0.30 + 0.25 * grain) * (0.62 + 0.3 * blockTone);
  float streak = smoothstep(0.52, 0.8, vn(vec2(s * 0.42, y * 0.035 + bi * 0.37)) * (0.6 + 0.4 * vn(vec2(s * 1.7, y * 0.1))));
  honey = mix(honey, vec3(0.045, 0.04, 0.04), streak * 0.72 * smoothstep(0.1, 0.5, 1. - fb + 0.3) * (1. - flatTop) * (1. - backF) * (1. - 0.6 * eastF));   // black water stains under ledges
  float lichen = smoothstep(0.66, 0.78, fbm3(vec2(s * 0.33 + 5., y * 0.33))) * (0.5 + 0.5 * grain2) * lod;
  honey = mix(honey, vec3(0.62, 0.30, 0.07), lichen * 0.5);
  float top = smoothstep(0.55, 0.85, N.y);                                                             // dusty ledge tops
  honey = mix(honey, uHoney * 0.8 + 0.06, top * 0.5);
  honey = mix(honey, mix(vec3(0.25, 0.28, 0.17), vec3(0.34, 0.35, 0.22), backF), max(top, backF) * mix(0.6, 0.6, backF) * smoothstep(0.35, 0.6, fbm3(vL.xz * 0.035)) * (0.6 + 0.4 * grain2));   // maquis on the flats
  honey *= mix(1., 0.88 + 0.24 * gId, gK * above) * (1. - 0.30 * crackG * above * lod2);                     // weathered blocks, their joints grown soft
  vec3 bone = uBone * (0.34 + 0.22 * blockTone + 0.24 * fId * fK + 0.12 * gId + 0.08 * grain);                // fresh breaks: every block its own tone
  // POLISH 2: a fresh break in limestone is a mosaic: bone-white new fractures beside joint faces that were already stained
  // honey and rust inside the rock, so the wall below the tide line is the same stone as the wall above it, newly opened.
  float stainB = smoothstep(0.50, 0.60, gId * 0.55 + fId2 * 0.45 + 0.3 * (grain - 0.5));
  bone = mix(bone, uHoney * (0.50 + 0.30 * fId) * (0.8 + 0.4 * grain2), 0.78 * stainB);
  bone = mix(bone, uBone * dot(honey, vec3(0.333)) / max(dot(uHoney, vec3(0.333)), 0.05) * 0.60, 0.35);              // and it carries the wall's own beds and streaks
  float lamQ = bqq * 13. + 0.5 * vn(vec2(s * 0.3, y * 0.1)), lam = (1. - smoothstep(0., 0.22, fract(lamQ))) * smoothstep(0.25, 0.7, vn(vec2(s * 0.17, floor(lamQ) * 1.7)));
  bone *= 1. - 0.30 * lam * lod2;
  bone *= mix(1., 0.74 + 0.5 * hId, hK) * (1. - 0.62 * (1. - smoothstep(0.02, 0.075, fr3.y)) * hK);                                                                                  // thin beds inside every block
  bone *= (1. - 0.86 * crackF) * (1. - 0.30 * jointAO) * (1. - 0.5 * crackG * (1. - above)) * (1. + 0.26 * lipF) * (1. - 0.30 * socket);
  bone *= 1. - 0.34 * smoothstep(0.5, 0.78, vn(vec2(s * 0.45, y * 0.03 + bi * 0.21))) * (0.6 + 0.4 * grain2);     // wet streaks still draining
  bone *= 1. - 0.8 * clamp(joint * 1.7 + part * 1.1, 0., 1.) * lod;                                           // open joints between angular blocks
  bone = mix(bone, uHoney * 0.75, 0.25 * smoothstep(0.55, 0.9, vn(vec2(s * 0.07, y * 0.07 + 11.))));    // old stained faces among the fresh
  float waterY = rampY(vInfo.w);
  float wet = 1. - smoothstep(3., 40., y - waterY + 22. * (vn(vec2(s * 0.75, y * 0.02)) - 0.5) + 8. * vn(vec2(s * 0.08, uTime * 0.07)));     // the wet reach ends in drips, not in a blot
  bone *= mix(1., 0.62, wet);
  vec3 alb = mix(bone, honey, above);
  N = normalize(N + (Tn * (h21(vec2(ji, bi + 3.)) - 0.5) + vec3(0., 1., 0.) * (h21(vec2(ji + 5., bi)) - 0.5)) * 0.6 * (1. - above) * lineK * (1. - eastF));      // below the tide line each block is its own broken plane
  N = normalize(N + (Tn * (hId - 0.5) + vec3(0., 1., 0.) * (hId2 - 0.5)) * 1.0 * hK + (Tn * (fId - 0.5) + vec3(0., 1., 0.) * (fId2 - 0.5)) * 1.1 * fK + (Tn * (gId - 0.5) + vec3(0., 1., 0.) * (gId2 - 0.5)) * mix(0.3, 0.8, 1. - above) * gK);
  // the old tide line: 2 m of dark weed under 1 m of white barnacle, dead level
  float tong = vn(vec2(s * 0.85, 4.)); tong = tong * tong * (0.55 + 0.45 * vn(vec2(s * 3.9, 7.))) + 0.25 * vn(vec2(s * 9., 1.));   // the weed hangs in ragged tongues
  float strand = vn(vec2(s * 9., y * 0.8)) * 0.6 + vn(vec2(s * 23., y * 2.1)) * 0.4;
  float wlen = 0.55 + 3.0 * tong, wgap = smoothstep(0.26, 0.42, vn(vec2(s * 0.31, 12.)) * 0.75 + vn(vec2(s * 1.7, 6.)) * 0.35);      // stretches where the rock shows through
  float wv = (wtop - y) / max(wlen, 0.05);                                                             // 0 at the line, 1 at the frond tips
  float weed = smoothstep(-0.06, 0.04, wtop - y) * (1. - smoothstep(0.45, 1.05, wv + 0.75 * (strand - 0.5))) * wgap * (1. - eastF);     // tips fray into single strands
  vec3 weedCol = mix(vec3(0.030, 0.034, 0.018), vec3(0.17, 0.115, 0.045), strand * (0.55 + 0.45 * grain2)) * (1. - 0.35 * smoothstep(0.3, 1., wv));
  weedCol += vec3(0.10, 0.12, 0.10) * smoothstep(0.72, 0.9, vn(vec2(s * 13., y * 3.5)));                 // wet glints
  float drip = (1. - smoothstep(0.5, 9., wtop - y + 5. * (vn(vec2(s * 1.1, 9.)) - 0.5))) * smoothstep(0.30, 0.62, vn(vec2(s * 1.6, y * 0.06 + 2.))) * (1. - above) * (1. - eastF);
  alb *= 1. - 0.42 * drip;                                                                              // the rock under the weed is still dark with what drains out of it
  alb = mix(alb, weedCol, weed * 0.95);
  // barnacle: a crust of tiny pale cones, dense for half a metre above the weed, breaking upward into ragged patches
  float bz = y - wtop, bTop = 0.55 + 1.1 * vn(vec2(s * 0.62, 21.)) + 0.35 * (vn(vec2(s * 2.7, 3.)) - 0.5);
  float bDense = smoothstep(-0.05, 0.06, bz) * (1. - smoothstep(0.2, max(bTop, 0.3), bz));
  float bPatch = smoothstep(0.50, 0.60, vn(gp * 2.9 + 40.) * 0.55 + vn(gp * 7.7) * 0.25 + 0.85 * bDense - 0.12 * clamp(part + joint, 0., 1.));
  float cones = mix(0.5, vn(gp * 26.) * 0.55 + vn(gp * 67.) * 0.45, 1. - smoothstep(12., 60., dist));
  vec3 crustCol = mix(uBone * 0.52, uWhite * 0.70, smoothstep(0.30, 0.68, cones)) * (0.90 + 0.2 * grain2);
  float barn = bPatch * step(0., bz + 0.05) * (1. - eastF) * (1. - backF);
  alb = mix(alb, crustCol, barn * 0.92);
  alb *= (1. - 0.74 * clamp(part + joint, 0., 1.) * (0.35 + 0.65 * lod)) * (0.8 + 0.3 * bandTone);
  // at the 9 m pass: pits, pores and hair cracks so the face is never a smooth slab
  float lod3 = 1. - smoothstep(14., 70., dist);
  float pit = vn(gp * 7.3) * vn(gp * 17. + 3.), crk = abs(vn(gp * 2.6 + 20.) + 0.35 * vn(gp * 6.1) - 0.68);
  alb *= 1. - lod3 * (1. - backF) * (0.12 * smoothstep(0.22, 0.55, pit) + 0.22 * (vn(gp * 31.) - 0.5) + 0.12 * above * (1. - smoothstep(0.0, 0.03, crk)));
  // light: warm key, blue sky fill, ochre bounce from the basin; shade settles to slate blue
  float mdl = dot(Nm, uSunDir);
  float lm = clamp(mdl * mix(1.15, 1.5, eastF) + mix(0.6, 0.5, eastF), 0., 1.);
  float det = clamp(1. + (dot(N, uSunDir) - mdl) * 1.5, 0.5, 1.45);
  float ndl = lm * det;
  float aoK = clamp(ao, 0., 1.15);
  float skyW = 0.55 + 0.45 * N.y, bncW = 0.5 - 0.5 * N.y;
  vec3 amb = (uSkyCol * skyW + uBounce * bncW * 0.55 + uSunCol * vec3(0.9, 0.8, 0.62) * (0.13 + 0.40 * (1. - lm)) * (1. - eastF)) * (0.35 + 0.65 * aoK);      // shade on the sunlit wall is filled warm by the rock around it
  vec3 col = alb * (uSunCol * ndl * (0.45 + 0.55 * aoK) + amb);
  float sh = 1. - smoothstep(0.06, 0.5, lm);
  col *= 1. + 0.75 * eastF * sh;                                                                     // POLISH 2: the east face is the same honey stone in shade, not a second material:
  col = mix(col, mix(uShade, uHoney * dot(uShade, vec3(0.45)), 0.30 * eastF) * (0.25 + 1.3 * dot(alb, vec3(0.33))) * (0.4 + 0.6 * aoK), sh * mix(0.09, 0.42, eastF));      // its beds and stains show through the blue
  col = mix(col, col * vec3(1.24, 1.03, 0.80), 0.55 * eastF);                                         // POLISH 2: honey stone under blue light is grey-mauve, not blue
  // the shaded east face keeps its form: beds, buttresses and gullies in two blues, ochre bounce on the lower cliffs
  float eb = fbm3(vec2(s * 0.012, y * 0.02)), eg = smoothstep(0.45, 0.75, vn(vec2(s * 0.045, 1.)) * (0.7 + 0.3 * vn(vec2(s * 0.2, y * 0.03))));
  float ebed = 1. - 0.5 * (1. - smoothstep(0.0, 0.14, fb)) - 0.25 * (1. - smoothstep(0.0, 0.1, fb2));
  float eb2 = smoothstep(0.3, 0.7, eb), strata = 0.78 + 0.44 * h21(vec2(bi, 5.)) * (0.5 + 0.5 * h21(vec2(floor(bqq / 4.), 8.)));
  col *= mix(1., (0.62 + 0.62 * eb2) * (1. - 0.4 * eg) * (0.85 + 0.3 * fb) * ebed * strata * (0.75 + 0.6 * clamp(Nm.y + 0.3, 0., 1.)), eastF);
  col += eastF * uBounce * 0.5 * (1. - smoothstep(-260., 80., y)) * (0.4 + alb);
  float bl = clamp(dot(N, vec3(0.72, -0.24, -0.65)) * 0.6 + 0.5, 0., 1.);                  // soft light off the bright basin models the facets
  col *= mix(1., 0.5 + 1.05 * bl, eastF);
  col = mix(col, col * vec3(1.26, 1.02, 0.74), eastF * clamp(0.4 - 0.9 * N.y + 0.4 * (strata - 1.), 0., 0.6));      // warm off the bright floor on faces that look down or out; ledge tops keep the sky's blue
  col *= smoothstep(0.1, 0.45, ao) * 0.85 + 0.15;                                                       // the cave mouth goes dark
  // water still draining out of the new rock: thin runnels sliding down below the tide line
  float runMask = smoothstep(0.60, 0.78, vn(vec2(s * 0.8, 2.))) * smoothstep(0.35, 0.6, vn(vec2(s * 0.5, y * 0.11 + 5.))) * (1. - above) * (1. - weed) * lod2 * (1. - eastF);
  float runT = vn(vec2(s * 5., y * 0.45 + uTime * 2.6)) * vn(vec2(s * 9., y * 1.4 + uTime * 4.1));
  col += (uSkyCol * 1.3 + uSunCol * 0.45) * runMask * smoothstep(0.34, 0.6, runT) * 0.42;
  col *= 1. - 0.25 * runMask;
  // spray mist hangs against the foot of the wall
  float mist = (1. - smoothstep(0., 60., y - waterY)) * smoothstep(380., 560., vInfo.w);
  col = mix(col, uHaze * 0.75 + uSunCol * 0.1, mist * 0.28);
  gl_FragColor = vec4(fogMix(col), 1.);
}`,Be=`
attribute vec3 aPin;      // local x, local z, distance from the wall
attribute vec4 aRnd;      // phase, size, kind (0 crest, 1 pillow), variation
varying vec2 vUv; varying vec3 vSunV; varying vec4 vK;
${te}
uniform float uTime, uBurst; uniform vec3 uSunDir;
${re}
void main(){
  float bx = aPin.x + ${W}.;
  float kind = aRnd.z, r = aRnd.w;
  float life = fract(uTime / (1.5 + 0.9 * kind) + aRnd.x), tau = life * (1.5 + 0.9 * kind);
  float burst = uBurst * (1. - smoothstep(450., 480., bx)) * (1. - kind);
  float gain = 1. + 0.5 * burst + 0.7 * uSurge * kind;
  vec3 p = vec3(aPin.x, waterH(bx, aPin.z, aPin.y, uTime - tau) - 1.5, aPin.y);
  vec3 vel = mix(vec3(15. + 11. * r, 6.5 + 7. * fract(r * 7.3), (fract(r * 13.7) - 0.5) * 7.),
                 vec3(8. + 6. * r, 10. + 8. * fract(r * 7.3), 1. + 5. * fract(r * 13.7)), kind) * gain;
  float drag = 1. - exp(-tau * 1.1), sheet = kind * step(0.6, r);               // two fifths of the pillow's spray is the thin sheet that climbs the wall past the old tide line
  vel = mix(vel, vec3(5. + 4. * fract(r * 5.1), 0., 0.4), sheet);
  p += vel * drag / 1.1; p.y -= 2.6 * tau * tau * (1. - 0.7 * kind) * (1. - sheet);
  p.y += sheet * (42. + 20. * fract(r * 7.3)) * (1. - exp(-tau * 1.4)) * (0.85 + 0.3 * uSurge);
  p.x += 9. * tau;                                        // the gale blows the way the water goes
  float size = aRnd.y * (0.45 + 1.5 * life) * (1. + 0.25 * kind) * (1. + 0.12 * burst);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
  mvPosition.xy += position.xy * size * vec2(1.45, 0.95);
  float fade = smoothstep(0., 0.12, life) * (1. - life) * sqrt(1. - life);
  float nearF = smoothstep(8., 120., -mvPosition.z) * (0.45 + 0.55 * smoothstep(60., 260., -mvPosition.z));                 // POLISH 2: spray thins toward the lens: droplets past us, never a milky sheet
  vK = vec4(fade * nearF * (0.55 + 0.45 * fract(r * 3.1)) * min(gain, 1.25) * mix(0.25, 0.30, kind) * mix(1., 0.85, sheet), aRnd.x * 37., life, kind);
  vUv = position.xy; vSunV = normalize(mat3(modelViewMatrix) * uSunDir);
  #ifdef USE_FOG
  vFogDepth = -mvPosition.z;
  #endif
  gl_Position = projectionMatrix * mvPosition;
}`,Pe=`
precision highp float;
${ee}
${oe}
uniform vec3 uWhite, uHaze, uGold;
varying vec2 vUv; varying vec3 vSunV; varying vec4 vK;
void main(){
  float r2 = dot(vUv, vUv); if (r2 > 1.) discard;
  float n = fbm3(vUv * 2.2 + vK.y + vec2(0., -vK.z * 1.5));
  float n2 = vn(vUv * 5.3 + vK.y * 1.7);
  float a = (1. - smoothstep(0.15, 1., r2 + (n - 0.5) * 1.1 + (n2 - 0.5) * 0.5)) * (0.35 + 0.65 * n) * vK.x;
  vec3 nrm = normalize(vec3(vUv * 0.9, sqrt(max(1. - r2, 0.)) + 0.25));
  float lit = clamp(dot(nrm, vSunV) * 0.6 + 0.45, 0., 1.);
  float rim = smoothstep(0.35, 0.95, r2) * max(-vSunV.z, 0.);                     // backlit edge takes the gold
  vec3 sunW = mix(uSunCol, vec3(dot(uSunCol, vec3(0.3, 0.5, 0.2))), 0.62);                 // spray is white water: it takes the sun's strength, little of its gold
  vec3 col = uWhite * 0.78 * (sunW * lit * 0.9 + uHaze * (0.42 + 0.2 * n)) + uGold * uSunCol * rim * 0.3;
  gl_FragColor = vec4(fogMix(col), min(a * 0.95, 0.8));
}`;function qe(t,c,h,M,b){const r=Math.round(600*b),g=Math.round(300*b),F=r+g,d=new Float32Array(F*3),m=new Float32Array(F*4);for(let e=0;e<F;e++){let n,o,v=0;if(e<r){const S=e%5,i=t();o=3+430*Math.pow(i,1.4);const z=55*(1-Math.exp(-o/160))+9*Math.sin(o*.021+1.3);n=420+110*S+z+t.range(1,11)}else v=1,o=Math.abs(t.gauss())*7+.5,n=566-.35*o+Math.abs(t.gauss())*12;d[e*3]=n-W,d[e*3+1]=c.wallZ(n)+o,d[e*3+2]=o,m[e*4]=t(),m[e*4+1]=t.range(3.2,7.5),m[e*4+2]=v,m[e*4+3]=t()}const x=new a.InstancedBufferGeometry;x.setAttribute("position",new a.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),3)),x.setIndex([0,1,2,0,2,3]),x.setAttribute("aPin",new a.InstancedBufferAttribute(d,3)),x.setAttribute("aRnd",new a.InstancedBufferAttribute(m,4)),x.instanceCount=F,x.boundingSphere=new a.Sphere(new a.Vector3(120,-150,150),700);const A=M();for(const e of["uTime","uSurge","uBurst","uSunDir","uSunCol","uSkyCol","uBounce","uWhite","uHaze","uGold"])A[e]=h[e];const w=new a.ShaderMaterial({vertexShader:Be,fragmentShader:Pe,uniforms:A,fog:!0,transparent:!0,depthWrite:!1}),l=new a.Mesh(x,w);return l.name="crest-spray",l.renderOrder=5,l}const ce=t=>{const c=(t-300)/70,h=Math.abs(c);return .025*t+.1875*(t-70*(h+Math.log(1+Math.exp(-2*h))-.6931472))},Le=`
attribute vec3 color;
varying vec3 vCol, vN, vL;
${te}
void main(){
  vec4 lp = vec4(position, 1.); vec3 n = normal;
  #ifdef USE_INSTANCING
  lp = instanceMatrix * lp; n = mat3(instanceMatrix) * n;
  #endif
  vL = lp.xyz; vN = n; vCol = color;
  vec4 mvPosition = modelViewMatrix * lp;
  #ifdef USE_FOG
  vFogDepth = -mvPosition.z;
  #endif
  gl_Position = projectionMatrix * mvPosition;
}`,Te=`
precision highp float;
${ee}
${oe}
uniform vec3 uHaze;
varying vec3 vCol, vN, vL;
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
  float ndl = clamp(dot(N, uSunDir) * 0.8 + 0.2, 0., 1.);
  float g = 0.8 + 0.4 * vn(vL.xz * 6. + vL.y * 3.);
  vec3 col = vCol * g * (uSunCol * ndl + uSkyCol * (0.6 + 0.4 * N.y) + uBounce * (0.3 - 0.3 * N.y));
  col += uSkyCol * 0.5 * pow(1. - abs(N.y), 3.) * 0.6;                         // wet sheen
  gl_FragColor = vec4(fogMix(col), 1.);
}`;function De(t){const c=[],h=[],M=[],b=new a.Color("#5A2E1C"),r=new a.Color("#2A1710"),g=new a.Color("#B89A72"),F=new a.Color("#2F4A2C"),d=new a.Color,m=(l,e,n,o)=>{const v=c.length/3,S=new a.Vector3(0,1,0),i=new a.Vector3,z=new a.Vector3,G=new a.Vector3;for(let p=0;p<l.length;p++){i.subVectors(l[Math.min(p+1,l.length-1)],l[Math.max(p-1,0)]).normalize(),z.crossVectors(i,Math.abs(i.y)>.9?new a.Vector3(1,0,0):S).normalize(),G.crossVectors(i,z);for(let q=0;q<n;q++){const N=q/n*6.2831853,u=e[p]*(1+.12*Math.sin(N*3+p*1.7));c.push(l[p].x+(z.x*Math.cos(N)+G.x*Math.sin(N))*u,l[p].y+(z.y*Math.cos(N)+G.y*Math.sin(N))*u,l[p].z+(z.z*Math.cos(N)+G.z*Math.sin(N))*u);const f=o(p/(l.length-1),q);h.push(f.r,f.g,f.b)}}for(let p=0;p<l.length-1;p++)for(let q=0;q<n;q++){const N=v+p*n+q,u=v+p*n+(q+1)%n,f=N+n,y=u+n;M.push(N,f,u,u,f,y)}},x=[],A=[];for(let l=0;l<=12;l++){const e=l/12;x.push(new a.Vector3(-6+12*e,.35*Math.sin(e*3.1),.2*Math.sin(e*5+1))),A.push(l===0?.3:K(.62,.2,Math.pow(e,.8))*(l===12?.5:1))}m(x,A,8,(l,e)=>d.copy(b).lerp(r,.35+.4*_(e*3.3+l*40)).lerp(g,l>.97||l<.02?.7:0).clone());for(let l=0;l<9;l++){const e=l/9*6.2831853+t.range(-.2,.2),n=t.range(1.5,2.9),o=[],v=[];for(let S=0;S<=4;S++){const i=S/4,z=n*i;o.push(new a.Vector3(-5.9-.9*i*i-.2*i,Math.cos(e)*z,Math.sin(e)*z)),v.push(K(.26,.05,i))}m(o,v,5,S=>d.copy(r).lerp(g,.25+.5*S).clone())}for(let l=0;l<7;l++){const e=t.range(1.5,5.6),n=t.range(0,6.28),o=t.range(.9,2.6),v=[],S=[];for(let i=0;i<=3;i++){const z=i/3;v.push(new a.Vector3(e+o*.5*z,Math.cos(n)*o*z,Math.sin(n)*o*z)),S.push(K(.13,.04,z))}if(m(v,S,4,()=>d.copy(b).lerp(r,.5).clone()),l<5){const i=v[3],z=[],G=[];for(let p=0;p<=3;p++){const q=p/3;z.push(new a.Vector3(i.x-.5+1.1*q,i.y,i.z)),G.push(.55*Math.sin(Math.PI*(.08+.84*q)))}m(z,G,6,(p,q)=>d.copy(F).multiplyScalar(.7+.5*_(q+l*7)).clone())}}for(let l=0;l<9;l++){const e=_(l*3.7+1)*6.2831853,n=.7+2*Math.sqrt(_(l*5.1+2)),o=4.4+2.4*_(l*7.9+3),v=Math.cos(e)*n,S=Math.sin(e)*n;m([new a.Vector3(o-1.8,.1,0),new a.Vector3(o-.7,v*.6,S*.6),new a.Vector3(o,v,S)],[.13,.09,.05],4,()=>d.copy(b).lerp(r,.4).clone());for(let i=0;i<7;i++){const z=_(l*4.1+i*2.7)*6.2831853,G=(_(l*1.3+i*5.9)-.35)*1.5,p=.9+.9*_(l*6.7+i*3.3),q=Math.cos(G)*Math.cos(z)*.7+.45,N=Math.sin(G),u=Math.cos(G)*Math.sin(z),f=Math.hypot(q,N,u)||1,y=[new a.Vector3(o,v,S),new a.Vector3(o+q/f*p*.55,v+N/f*p*.55,S+u/f*p*.55),new a.Vector3(o+q/f*p,v+N/f*p,S+u/f*p)];m(y,[.1,.3,.03],4,P=>d.copy(F).multiplyScalar(.7+.8*_(i*1.7+l*7)+.3*P).clone())}}const w=new a.BufferGeometry;return w.setAttribute("position",new a.Float32BufferAttribute(c,3)),w.setAttribute("color",new a.Float32BufferAttribute(h,3)),w.setIndex(M),w.computeVertexNormals(),w}function Ge(t,c,h,M,b){const g=De(t),F=M();for(const p of["uTime","uSunDir","uSunCol","uSkyCol","uBounce","uHaze"])F[p]=h[p];const d=new a.ShaderMaterial({vertexShader:Le,fragmentShader:Te,uniforms:F,fog:!0}),m=new a.InstancedMesh(g,d,6);m.name="pine-trunks",m.frustumCulled=!1;const x=ce(250),A=ce(1e3),w=A-x,l=[];for(let p=0;p<6;p++)l.push({ph:(p+t.range(0,.7))/6,d:p===0?30:t.range(22,190),spin:t.range(.5,1.1)*(t.chance(.5)?1:-1),yaw:t.range(-.5,.5),wob:t.range(0,6)});for(const p of l)p.yaw=(p.yaw<0?-1:1)*(.6+1.1*Math.abs(p.yaw));const e=new a.Matrix4,n=new a.Quaternion,o=new a.Quaternion,v=new a.Euler,S=new a.Vector3,i=new a.Vector3,z=new a.Vector3(1,0,0),G=(p,q=-1)=>{for(let N=0;N<6;N++){const u=l[N],f=(p/w+u.ph)%1,y=x+f*w;let P=250,I=1e3;for(let j=0;j<18;j++){const H=(P+I)*.5;ce(H)<y?P=H:I=H}const T=N===0&&q>=0,D=T?q<.47?380+(q-.33)/.14*180:560+(q-.47)*3e3:P,B=c.wallZ(D)+u.d,V=j=>J(j)+pe(j,u.d,p)+de(j,B,p),s=V(D),L=(V(D+3)-V(D-3))/6;v.set(0,u.yaw+.3*Math.sin(p*.4+u.wob),Math.atan(L),"YZX"),n.setFromEuler(v),o.setFromAxisAngle(z,p*u.spin+u.wob),n.multiply(o);const k=T?1-C(.5,.58,q):C(0,.04,f)*(1-C(.93,1,f));S.set(D-W,s-.25+.3*Math.sin(p*1.1+u.wob),B),i.setScalar(Math.max(k,.001)),e.compose(S,n,i),m.setMatrixAt(N,e)}m.instanceMatrix.needsUpdate=!0};return G(0),b.push((p,q,N,u)=>G(q,u)),m}function Ve(){const t=[],c=[],h=[],M=[],b=[],r=[.76,.76,.73],g=new a.Color("#E9C877"),F=new a.Color("#AFC3CF"),d=[.02,.02,.025],m=(u,f,y)=>[u[0]+(f[0]-u[0])*y,u[1]+(f[1]-u[1])*y,u[2]+(f[2]-u[2])*y],x=[g.r*.9,g.g*.9,g.b*.9],A=[F.r*.85,F.g*.85,F.b*.85],w=[[.48,.003,.003,.003],[.455,.01,.008,.007],[.42,.017,.013,.011],[.385,.024,.02,.017],[.36,.034,.03,.03],[.33,.043,.038,.04],[.29,.05,.046,.047],[.24,.058,.056,.055],[.18,.074,.075,.072],[.11,.09,.095,.088],[.02,.098,.108,.097],[-.08,.094,.104,.092],[-.18,.08,.086,.078],[-.27,.06,.058,.06],[-.34,.036,.028,.05],[-.41,.014,.01,.046],[-.47,.006,.004,.022],[-.5,.003,.002,.004]],l=14;for(let u=0;u<w.length;u++){const[f,y,P,I]=w[u];for(let T=0;T<l;T++){const D=T/l*6.2831853,B=Math.sin(D),V=Math.cos(D),s=(B>0?y:P)*B*(.82+.18*Math.abs(B)),L=I*V;t.push(f,s,L);let k=r.slice();const j=C(.13,.27,f)*(.6+.4*C(-.3,.6,B));if(k=m(k,x,j*.95),f>.372)k=m(A,d,Math.abs(B)<.25&&f<.47?.75:0);else if(f>.345){const H=Math.hypot(f-.362,s-.01);Math.abs(V)>.5&&(k=m(k,d,1-C(.008,.024,H)))}k=m(k,[.55,.57,.6],.22*C(.3,-.9,B)*C(.3,.1,f)),c.push(k[0],k[1],k[2]),h.push(0,0,0,C(.17,.3,f))}}for(let u=0;u<w.length-1;u++)for(let f=0;f<l;f++){const y=u*l+f,P=u*l+(f+1)%l,I=y+l,T=P+l;M.push(y,P,I,P,T,I)}const e=(u,f,y,P,I,T,D=8,B=1)=>{const V=t.length/3;t.push(u,f,y),c.push(...I),h.push(0,0,0,B);for(let s=0;s<D;s++){const L=s/D*6.2831853;t.push(u+Math.cos(L)*P,f+Math.sin(L)*P,y-T*P*.25),c.push(...I),h.push(0,0,0,B)}for(let s=0;s<D;s++){const L=V+1+s,k=V+1+(s+1)%D;T>0?M.push(V,L,k):M.push(V,k,L)}};for(const u of[-1,1]){e(.362,.011,u*.0305,.0085,[.72,.78,.8],u),e(.3625,.011,u*.0318,.004,d,u,6),e(.3645,.0135,u*.0326,.0016,[2.2,2.2,2.2],u,4);const f=t.length/3,y=u*.022;t.push(-.33,-.03,y,-.43,-.012,y-.009,-.43,-.012,y+.009,-.38,-.034,y);for(let P=0;P<4;P++)c.push(.16,.16,.17),h.push(0,2,P,0);M.push(f,f+1,f+2,f,f+3,f+1,f,f+2,f+3,f+3,f+2,f+1)}const n=13,o=6,v=.83;for(const u of[-1,1])for(const f of[1,-1]){const y=t.length/3;for(let P=0;P<=n;P++){const I=P/n,T=Math.max(0,(I-.42)/.58),D=I<.42?K(.13,.175,I/.42):K(.175,-.11,Math.pow(T,1.15)),B=I<.42?K(.215,.19,I/.42):K(.19,.028,Math.pow(T,1.35));for(let V=0;V<=o;V++){const s=V/o,L=.11*B*Math.sqrt(s)*(1-s)*2.2*(1-.6*I),k=.048+.018*Math.sin(I*3)-.03*I*I+.02*B*Math.sin(s*3.14159)+(f>0?L:-L*.35);t.push(D-B*s,k,u*(.065+v*I));const j=C(.6,.68,I+.22*(s-.45));let H=m(r,d,j);H=m(H,m(H,[.3,.3,.32],.5),.5*(1-j)*C(.75,1,s)*(f<0?1:.4)),c.push(H[0],H[1],H[2]),h.push(u,I,T,0),b[t.length/3-1]=s}}for(let P=0;P<n;P++)for(let I=0;I<o;I++){const T=y+P*(o+1)+I,D=T+1,B=T+o+1,V=B+1;u*f>0?M.push(T,D,B,D,V,B):M.push(T,B,D,D,B,V)}}const S=t.length/3,i=new Float32Array(S*3),z=.87,G=-.275,p=(u,f,y,P,I)=>{const T=Math.cos(I),D=Math.sin(I),B=u-y,V=f-P;return[y+B*T-V*D,P+B*D+V*T]};for(let u=0;u<S;u++){const f=t[u*3],y=t[u*3+1],P=t[u*3+2],I=h[u*4],T=h[u*4+1];let D,B,V=P;if(T>1.5){const s=h[u*4+2],L=P<0?-1:1,k=L*.04;[D,B,V]=[[-.035,G+.11,k],[.085,G,k+.034],[.085,G,k-.034],[-.04,G,k]][s]}else if(Math.abs(I)>.5){const s=b[u],L=C(.55,1,T),k=.11-.6*T-.03*(s-.5),j=.064-.045*T+(.5-s)*.1*(1-.75*T);[D,B]=p(k,j,0,0,z),V=I*K(.099,-.014,L),B=Math.max(B,G+.03)}else{let s=p(f,y,.28,0,-(z+.28)*C(.25,.34,f));s=p(s[0],s[1],.12,0,.28*C(.1,.26,f)),[D,B]=p(s[0],s[1],0,0,z),B=Math.max(B,G+.012+.02*Math.abs(P))}i[u*3]=D,i[u*3+1]=B,i[u*3+2]=V}const q=new a.BufferGeometry;q.setAttribute("position",new a.BufferAttribute(i,3)),q.setIndex(M),q.computeVertexNormals();const N=new a.BufferGeometry;return N.setAttribute("aPerch",new a.BufferAttribute(i,3)),N.setAttribute("aPerchN",q.attributes.normal),N.setAttribute("position",new a.Float32BufferAttribute(t,3)),N.setAttribute("color",new a.Float32BufferAttribute(c,3)),N.setAttribute("aAnim",new a.Float32BufferAttribute(h,4)),N.setIndex(M),N.computeVertexNormals(),N}const je=`
attribute vec3 color; attribute vec4 aAnim;   // wing side (-1, 0, +1), span 0..1, hand 0..1 beyond the wrist, head weight
attribute vec4 aBird;                         // per bird: phase 0..1, dive 0..1 (wings thrown back), flap 0..1 (1 = beat without gliding), perch 0..1 (standing, wings folded)
attribute vec3 aPerch, aPerchN;
uniform float uTime;
varying vec3 vCol, vN; varying vec2 vWing;
${te}
void main(){
  vec3 p = position, n = normal;
  float side = aAnim.x, u = aAnim.y, hand = aAnim.z, dive = aBird.y;
  float tt = uTime + aBird.x * 4., ph = mod(tt, 4.);
  // shallow beats at 3 Hz for 2 s, then a 2 s glide on flat wings
  float flap = mix(smoothstep(0., 0.35, ph) * (1. - smoothstep(1.7, 2.05, ph)), 1., aBird.z) * (1. - dive);
  float w = 18.849556 * tt, sw = sin(w), cw = cos(w);
  if (abs(side) > 0.5) {
    vec3 piv = vec3(0.06, 0.048, side * 0.065);
    vec3 q = p - piv;
    float sweep = dive * (1.05 + 0.45 * hand) + flap * 0.12 * hand * max(cw, 0.);      // hand folds back on the upstroke; arrow in the dive
    float cs = cos(sweep), sn = sin(sweep), zz = abs(q.z);
    q = vec3(q.x * cs - zz * sn, q.y, q.x * sn + zz * cs);
    float ang = flap * (0.36 * sw + 0.07) * (0.35 + 0.65 * u) + flap * 0.30 * sin(w - 1.0) * hand
              + (1. - flap) * (0.035 * sin(tt * 0.8) + 0.02) - dive * 0.08;
    float ca = cos(ang), sa = sin(ang);
    float y2 = q.y * ca + q.z * sa, z2 = q.z * ca - q.y * sa;
    p = piv + vec3(q.x, y2, side * z2);
    n = vec3(n.x, n.y * ca + side * n.z * sa, n.z * ca - side * n.y * sa);
  }
  p.y += (1. - aAnim.w) * 0.03 * sin(w - 1.4) * flap;                                   // the body rises and falls, the head holds still
  float perch = clamp(aBird.w, 0., 1.);
  p = mix(p, aPerch, perch); n = mix(n, aPerchN, perch) + vec3(0., 1e-5, 0.);
  vec4 lp = vec4(p, 1.);
  #ifdef USE_INSTANCING
  lp = instanceMatrix * lp; n = mat3(instanceMatrix) * n;
  #endif
  vN = n; vCol = color; vWing = vec2(u, abs(side));
  vec4 mvPosition = modelViewMatrix * lp;
  #ifdef USE_FOG
  vFogDepth = -mvPosition.z;
  #endif
  gl_Position = projectionMatrix * mvPosition;
}`,He=`
precision highp float;
${ee}
${oe}
varying vec3 vCol, vN; varying vec2 vWing;
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
  float ndl = clamp(dot(N, uSunDir) * 0.7 + 0.3, 0., 1.);
  float feather = 1. - 0.07 * vWing.y * smoothstep(0.3, 0.5, vWing.x) * (1. - smoothstep(0.08, 0.3, abs(fract(vWing.x * 27.) - 0.5)));   // feather partings along the wing
  vec3 col = vCol * feather * (uSunCol * ndl * 0.9 + uSkyCol * (0.9 + 0.7 * N.y) + uBounce * (0.6 - 0.6 * N.y));
  gl_FragColor = vec4(fogMix(col), 1.);
}`;function Ke(t,c){const h=Ve(),M=new a.InstancedBufferAttribute(new Float32Array(t*4),4);M.setUsage(a.DynamicDrawUsage),h.setAttribute("aBird",M);const b=a.UniformsUtils.clone(a.UniformsLib.fog);for(const A of["uTime","uSunDir","uSunCol","uSkyCol","uBounce"])b[A]=c[A];const r=new a.ShaderMaterial({vertexShader:je,fragmentShader:He,uniforms:b,fog:!0}),g=new a.InstancedMesh(h,r,t);g.name="gannets",g.frustumCulled=!1,g.instanceMatrix.setUsage(a.DynamicDrawUsage);const F=new a.Matrix4,d=new a.Quaternion,m=new a.Euler,x=new a.Vector3;return{object:g,count:t,geometry:h,material:r,place(A,w){m.set(w.bank||0,w.yaw||0,w.pitch||0,"YZX"),d.setFromEuler(m),x.setScalar(w.scale??1),F.compose(w.position,d,x),g.setMatrixAt(A,F),M.setXYZW(A,w.phase??A*.37%1,w.dive||0,w.flap||0,w.perch||0)},commit(){g.instanceMatrix.needsUpdate=!0,M.needsUpdate=!0}}}function We(t,c,h,M){const b=Ke(h,c),r=new a.Vector3,g=[];for(let o=0;o<h;o++)g.push({off:o*.085+t.range(-.02,.02),dy:t.range(-1.5,2.5),dz:t.range(-5,5),ph:t(),sc:t.range(.94,1.06)});const F=150,d=44,m=-.15,x=-270,A=62,w=(o,v)=>v.set(x+F*Math.cos(o),0,A+d*Math.sin(o)),l=new a.Vector3,e=new a.Vector3,n=o=>{for(let v=0;v<h;v++){const S=g[v],i=o*m-S.off+1.2;w(i,r),w(i+.02*Math.sign(m),l),w(i+.04*Math.sign(m),e);const z=Math.atan2(-(l.z-r.z),l.x-r.x);let p=Math.atan2(-(e.z-l.z),e.x-l.x)-z;p>Math.PI&&(p-=6.2831853),p<-Math.PI&&(p+=6.2831853),r.y=15+S.dy+3.5*Math.sin(i*2+v)+.5*Math.sin(o*.7+v*2.1),r.z+=S.dz,b.place(v,{position:r,yaw:z,bank:Q(-p*22,-.7,.7),pitch:.05*Math.cos(i*2+v),phase:S.ph,scale:S.sc})}b.commit()};return n(0),M.push((o,v)=>n(v)),b}async function Re(t,c={}){const h=t.rng,M=Q(c.detail??t.quality?.detail??1,.6,1),b=(c.palette&&c.palette.length>=7?c.palette:xe).map(s=>new a.Color(s)),r=Me(),g=new a.Group;g.name="atlantic-falls-in-hero";const F=new a.Vector3(-.828,.407,.386),d={uTime:{value:0},uSurge:{value:0},uBurst:{value:0},uProgress:{value:-1},uSunDir:{value:F.clone()},uSunCol:{value:new a.Color("#F4C56A").lerp(new a.Color("#ffffff"),.4).multiplyScalar(1.18)},uSkyCol:{value:new a.Color("#5E8FD0").multiplyScalar(.42)},uBounce:{value:new a.Color("#C9A46A").multiplyScalar(.3)},uCam:{value:new a.Vector3(0,8,200)},uCobalt:{value:b[0]},uGreen:{value:b[1]},uWhite:{value:b[2]},uHoney:{value:b[3]},uBone:{value:b[4]},uHaze:{value:b[5]},uGold:{value:b[6]},uShade:{value:new a.Color(c.shade||"#5F7FA8")},uTide:{value:8}},m=()=>a.UniformsUtils.clone(a.UniformsLib.fog),x=(...s)=>{const L=m();for(const k of s)L[k]=d[k];return L},A=["uTime","uSunDir","uSunCol","uSkyCol","uBounce","uCam"],w=h.range(0,100),l=new a.ShaderMaterial({vertexShader:Se,fragmentShader:ze,fog:!0,uniforms:x(...A,"uSurge","uCobalt","uGreen","uWhite","uHaze","uGold")}),e=new a.Mesh(await Ce(r,t),l);e.name="tongue",g.add(e),await t.yield();const n=100/46,o=[];for(let s=0;s<18;s++){const L=s<13?K(445,706,(s+h.range(.1,.9))/13):h.range(200,430);o.push({bx:L,y:-40+Math.round((h.range(24,62)+40)/n)*n,w:h.range(5,12),d:h.range(2.6,5.2),s:0})}for(let s=0;s<10;s++){const L=s===0?516:K(534,704,(s-1+h.range(.15,.85))/9);o.push({bx:L,y:-40+Math.round(((s===0?12.2:s%2?h.range(13.5,21):h.range(11.5,12.6))+40)/n)*n,w:s===0?8.5:h.range(5,9),d:s===0?3.7:h.range(2.6,3.8),s:0,low:!0,colony:s===0})}{const s=me(r);for(const L of o){let k=s[0];for(const j of s)j.e===0&&Math.abs(j.x-L.bx)<Math.abs(k.x-L.bx)&&(k=j);L.s=k.s,L.st=k}}const v=await Ae(t,r,o),S=new a.ShaderMaterial({vertexShader:Ne,fragmentShader:Ie,fog:!0,side:a.DoubleSide,uniforms:x(...A,"uHoney","uBone","uHaze","uShade","uWhite","uTide")}),i=new a.Mesh(v.geo,S);i.name="wall-and-rock",g.add(i),await t.yield();const z=[];{const s=v.geo.attributes.position,L=v.st;for(const k of o){const j=Math.max(L.findIndex(E=>E.s===k.s),0),H=24+Math.round((k.y+40)/n),Z=j*v.NR+H;z.push({position:[s.getX(Z)-k.st.nx*k.d*.45,s.getY(Z)+.1,s.getZ(Z)-k.st.nz*k.d*.45],normal:[k.st.nx,0,k.st.nz],size:k.w,low:!!k.low,colony:!!k.colony})}}const G=[];g.add(qe(h,r,d,m,M)),await t.yield(),g.add(Ge(h,r,d,m,G)),await t.yield();const p=c.gannets===!1?0:Math.round(c.gannets??7),q=p>0?We(h,d,p,G):null;q&&g.add(q.object),await t.yield();const N=s=>[s[0]-W,s[1],s[2]],u=r.pts.map(N),f=u[u.length-1],y=(s,L,k=0)=>{const j=s+W,H=L-r.wallZ(j);return J(j)+pe(j,H,k)+de(j,L,k)},P={flyThrough:u,portalSeat:{position:f,facing:[-r.endDir[0],0,-r.endDir[2]],radius:7},firstCrest:[424-W,y(424-W,r.pathZ(424)),r.pathZ(424)],pillow:[556-W,J(556)+56,r.wallZ(556)+2],caveMouth:[628-W,23,r.wallZ(628)+2],prowTip:[735-W,8,r.wallZ(712)-12],rockCrest:[700-W,255,r.wallZ(700)-60],tideLine:8,ledges:z,viewpoints:{entry:{position:N([0,8,0]),lookAt:N([330,0,-20])},firstWave:{position:N([395,8,r.pathZ(395)]),lookAt:N([440,-12,r.pathZ(440)+6])},wallPass:{position:N([585,8,r.pathZ(585)]),lookAt:N([640,2,r.pathZ(640)-4])},pastProw:{position:N([790,8,r.pathZ(790)]),lookAt:N([900,-120,r.pathZ(790)+60])},lookBack:{position:N([930,8,r.pathZ(860)-50]),lookAt:N([640,-60,r.wallZ(640)+60])}},waterHeight:y,wallZ:s=>r.wallZ(s+W),pathZ:s=>r.pathZ(s+W)},I=new a.Matrix4,T=new a.Quaternion,D=new a.Vector3;let B=-1;const V={object:g,radius:300,height:200,center:new a.Vector3(60,55,-60),anchors:P,uniforms:d,ground:!1,groundY:-300,setProgress(s){B=s,d.uProgress.value=s},setLight(s={}){s.sunDir&&F.copy(s.sunDir.isVector3?s.sunDir:new a.Vector3().fromArray(s.sunDir)).normalize(),s.sunColor&&d.uSunCol.value.set(s.sunColor).multiplyScalar(s.sunIntensity??1.18),s.sky&&d.uSkyCol.value.set(s.sky).multiplyScalar(s.skyIntensity??.42),s.bounce&&d.uBounce.value.set(s.bounce).multiplyScalar(s.bounceIntensity??.3)},update(s,L,k){d.uTime.value=L+w,g.updateWorldMatrix(!0,!1),I.copy(g.matrixWorld).invert(),k&&(D.setFromMatrixPosition(k.matrixWorld),d.uCam.value.copy(D).applyMatrix4(I)),g.getWorldQuaternion(T).invert(),d.uSunDir.value.copy(F).applyQuaternion(T).normalize();const j=(H,Z)=>{const E=(B-H)/Z;return B<0?0:Math.exp(-E*E)};d.uSurge.value=j(.47,.05),d.uBurst.value=j(.39,.035);for(const H of G)H(s,L,k,B)},dispose(){}};return(c.sunDir||c.sunColor||c.skyColor||c.bounceColor)&&V.setLight({sunDir:c.sunDir,sunColor:c.sunColor,sky:c.skyColor,bounce:c.bounceColor}),V.update(0,0,null),V}export{ke as FLOOD_FAR,Ke as buildGannets,Re as buildHero,Ve as gannetGeometry,Fe as normalsAsync};
