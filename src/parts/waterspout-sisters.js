import*as t from"three";import{clamp as T,lerp as H,smoothstep as v}from"../kit/core.js";const $=6,E=null,Je=["#19C2B8","#0B4F9E","#0E3B3C","#F3E8CF","#2B3157","#66728C","#D2542E"],Qe=-930,Fe=[[55,550,26,110,150,150,26],[-55,320,34,130,150,165,30],[65,90,60,190,150,200,40],[-120,-130,16,80,80,130,20],[70,-220,34,130,150,230,120],[40,-550,22,90,90,140,24]],q=`
float wsHash(vec3 p){ p = fract(p*0.3183099 + vec3(0.71, 0.113, 0.419)); p *= 17.0; return fract(p.x*p.y*p.z*(p.x + p.y + p.z)); }
float wsNoise(vec3 x){
  vec3 i = floor(x), f = fract(x); f = f*f*(3.0 - 2.0*f);
  return mix(mix(mix(wsHash(i), wsHash(i + vec3(1,0,0)), f.x), mix(wsHash(i + vec3(0,1,0)), wsHash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(wsHash(i + vec3(0,0,1)), wsHash(i + vec3(1,0,1)), f.x), mix(wsHash(i + vec3(0,1,1)), wsHash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float wsFbm(vec3 p){ return 0.55*wsNoise(p) + 0.3*wsNoise(p*2.13 + 7.1) + 0.15*wsNoise(p*4.7 + 3.3); }
`,U=`
uniform vec4 uPatch;
float wsPatch(vec2 xz){
  vec2 q = (xz + uPatch.xy)/uPatch.w;
  float n = 0.8*wsNoise(vec3(q, 3.7)) + 0.2*wsNoise(vec3(q*1.9 + 11.0, 9.1));
  return mix(uPatch.z, 1.0, smoothstep(0.30, 0.60, n));
}
`,Ae=`
uniform float uH;
vec3 wsSpine(float y, vec4 A, vec4 B, vec4 C, vec4 D){
  float s = clamp(y/uH, 0.0, 1.0);
  vec2 o = A.xy*s + B.xy*sin(3.14159*s) + B.zw*sin(6.28318*s);
  float tent = max(1.0 - 2.0*sqrt((s - 0.5)*(s - 0.5) + 0.0012), 0.0);
  o += D.xy*C.z*tent;
  return vec3(o.x, y, o.y);
}
float wsRadius(float y, vec4 A, vec4 C, float rmin){
  float rw = C.x*C.w;
  float d = max(uH - y, 0.0);
  float flare = 0.58*exp(-d/38.0) + 0.42*exp(-d/78.0);
  float r = rw*(1.0 + 0.16*exp(-y/50.0)) + max(C.y*mix(1.0, C.w, 0.6) - rw, 0.0)*flare;
  r = max(r, rmin);
  float tp = smoothstep(0.0, 70.0, y - A.z);
  return r*mix(1.0, 0.04 + 0.96*tp, A.w);
}
// psi = angle*dir (radians), y metres, rw waist radius, spin = three band phases. Returns density 0..1.2;
// relief (-0.5..0.5) is the part the mesh is displaced by.
float gFine;   // the close-up grain that the last wsBands call added to its density (lit gently: see TUBE_FRAG)
float wsBands(float psi, float y, float rw, vec3 spin, float braids, float seed, vec2 lod, out float relief){
  gFine = 0.0;
  float h = y/max(rw, 1.0);
  float q1 = psi + spin.x - h*0.95;
  float w = wsNoise(vec3(cos(q1)*0.9, sin(q1)*0.9, h*0.21 + seed));
  float w2 = wsNoise(vec3(cos(q1)*1.7 + 3.0, sin(q1)*1.7, h*0.62 - seed));
  float b1 = 0.5 + 0.5*sin(braids*q1 + 7.5*w + 3.0*w2);
  b1 = mix(b1, smoothstep(0.22, 0.78, w2), 0.55);
  float q2 = psi + spin.y - h*1.55;
  float n2 = wsNoise(vec3(cos(q2)*3.1 + seed, sin(q2)*3.1, h*0.5));
  float q3 = psi + spin.z - h*2.3;
  float n3 = wsNoise(vec3(cos(q3)*8.5, sin(q3)*8.5 + seed, h*1.35));
  relief = 0.45*(b1 - 0.5) + 0.55*(n2 - 0.5);
  float d = 0.27 + 0.40*b1 + 0.38*n2 + 0.24*mix(0.5, n3, lod.x);
  if (lod.y > 0.01) {
    float q4 = psi - spin.y*0.6 - h*2.3 + 0.5*(n2 - 0.5);                                 // climbs with the braids (about 24 degrees) and wanders with them
    float n4 = wsNoise(vec3(cos(q4)*13.0 + seed, sin(q4)*13.0, h*2.5));
    float n5 = wsNoise(vec3(cos(q4)*31.0, sin(q4)*31.0 + seed, h*7.0));
    n4 = mix(n4, smoothstep(0.2, 0.8, n4), 0.5*lod.y);                                     // soft grain inside the braids, not ruled hairlines
    gFine = lod.y*(0.35 + 0.9*n2)*(0.2*(n4 - 0.5) + 0.11*(n5 - 0.5)*lod.y);
    d += gFine;
  }
  return d;
}
`,oe=`
uniform vec3 uSunDir, uSunCol, uShadowCol, uBounceCol;
vec3 wsLit(vec3 N, vec3 V, float dens, float sunP, float y, float relief){
  float ndl = dot(N, uSunDir);
  float wrap = clamp((ndl + 0.22)/1.22, 0.0, 1.0); wrap = wrap*wrap*(3.0 - 2.0*wrap);
  float key = wrap*sunP*relief;
  float low = exp(-max(y, 0.0)/110.0);
  vec3 sh = uShadowCol*(0.78 + 0.22*N.y + 0.25*dens) + uBounceCol*(0.10 + 0.55*low)*(0.6 - 0.4*N.y);
  vec3 col = sh*(1.0 - 0.8*key) + uSunCol*key*(0.74 + 0.30*dens);
  float fs = max(dot(V, uSunDir), 0.0); fs = fs*fs; fs = fs*fs;
  col += uSunCol*vec3(1.0, 0.86, 0.62)*fs*sunP*(0.75 - 0.4*dens);
  return col;
}
`,Xe=`
uniform vec4 uA, uB, uC, uD;
uniform vec3 uSpin;
uniform float uPx, uDir, uRelief;
varying vec3 vWP, vWC, vWA, vWN, vWE1, vLP;
varying float vR, vY;
#include <fog_pars_vertex>
${q}
${Ae}
float gRmin;
void wsFrame(float y, out vec3 c, out vec3 T, out vec3 e1, out vec3 e2){
  c = wsSpine(y, uA, uB, uC, uD);
  T = normalize(wsSpine(y + 2.0, uA, uB, uC, uD) - wsSpine(y - 2.0, uA, uB, uC, uD) + vec3(0.0, 1e-3, 0.0));
  e1 = normalize(vec3(1.0, 0.0, 0.0) - T*T.x);
  e2 = cross(T, e1);
}
vec3 wsSurf(float a, float y){
  vec3 c, T, e1, e2; wsFrame(y, c, T, e1, e2);
  float rel; wsBands(a*uDir, y, uC.x, uSpin, uD.z, uD.w, vec2(1.0, 0.0), rel);
  float r = wsRadius(y, uA, uC, gRmin)*(1.0 + uRelief*rel);
  return c + r*(cos(a)*e1 + sin(a)*e2);
}
void main(){
  float a = position.x*6.2831853;
  float t = position.y;
  float y = mix(uA.z, uH, 0.45*t + 0.55*t*t);
  vec3 c, T, e1, e2; wsFrame(y, c, T, e1, e2);
  vec3 wc = (modelMatrix*vec4(c, 1.0)).xyz;
  gRmin = 1.25*distance(wc, cameraPosition)/max(uPx, 1.0);
  vec3 p = wsSurf(a, y);
  float da = 0.05, dy = max(0.03*uC.x, 0.6);
  vec3 ta = wsSurf(a + da, y) - wsSurf(a - da, y);
  vec3 ty = wsSurf(a, y + dy) - wsSurf(a, y - dy);
  vec3 n = cross(ta, ty);
  vec3 rad = p - c;
  if (dot(n, rad) < 0.0) n = -n;
  n = normalize(n + rad*1e-5 + vec3(1e-6));
  mat3 m3 = mat3(modelMatrix);
  vec4 wp = modelMatrix*vec4(p, 1.0);
  vWP = wp.xyz; vWC = wc; vWA = normalize(m3*T); vWN = normalize(m3*n); vWE1 = normalize(m3*e1);
  vLP = p; vY = y; vR = length(m3[0]);
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}
`,Ze=`
uniform vec4 uA, uB, uC, uD;
uniform vec3 uSpin;
uniform vec2 uBase;
uniform float uDir, uAlpha, uTau, uTime, uBandK, uThr;
varying vec3 vWP, vWC, vWA, vWN, vWE1, vLP;
varying float vR, vY;
#include <fog_pars_fragment>
${q}
${U}
${Ae}
${oe}
// Path length through the near half of a hollow shell whose inner face is soft: the cusp where the line of sight first
// grazes the hollow is rounded off, so the dense limb feathers into the thin middle over about a fifth of the tube's width.
float wsShell(float mu){
  float t = mu*mu - 0.42, sm = 0.5*(t + sqrt(t*t + 0.012));
  return max(mu - 1.2*(sqrt(sm + 0.02) - 0.1414), 0.0)/0.56;
}
void main(){
  vec3 V = normalize(vWP - cameraPosition);
  vec3 A = normalize(vWA);
  vec3 d = vWP - vWC; d -= A*dot(d, A);
  float dl = max(length(d), 1e-3); vec3 dn = d/dl;
  vec3 Vp = V - A*dot(V, A); float vpl = max(length(Vp), 0.08); vec3 Vn = Vp/vpl;
  vec3 N = normalize(vWN);
  float mu0 = clamp(-dot(dn, Vn), 0.0, 1.0);
  float obl = min(1.0/vpl, 1.7);
  float camD = distance(vWP, cameraPosition);
  float thinK = mix(0.25, mix(0.58, 0.86, smoothstep(250.0, 800.0, camD)), smoothstep(130.0, 290.0, camD));   // the shell's middle is thin (thinnest close to): the far wall and core show through
  float lowN = 1.0 - smoothstep(20.0, 90.0, vY);                   // spray-laden and dense low down: the horizon never shows through a foot
  vec3 e1 = normalize(vWE1 - A*dot(vWE1, A) + vec3(1e-5, 0.0, 0.0));
  vec3 e2 = cross(A, e1);
  float phi = atan(dot(dn, e2), dot(dn, e1) + 1e-6);
  float rw = uC.x;
  // sun sunP mask: follow the light ray down to the sea
  vec2 sl = uSunDir.xz/max(uSunDir.y, 0.1);
  float sunP = wsPatch(vLP.xz + uBase - sl*vLP.y);
  // near wall
  float rel, rel2;
  float fp = length(fwidth(vWP));
  vec2 lod = vec2(1.0 - smoothstep(0.35, 0.9, fp*8.5/max(rw, 1.0)), 1.0 - smoothstep(0.45, 1.3, fp*23.0/max(rw, 1.0)));
  float dn1 = wsBands(phi*uDir, vY, rw, uSpin, uD.z, uD.w, lod, rel), fine1 = gFine;
  float st = dot(uSunDir, cross(A, dn));
  float dn2 = wsBands((phi + 0.11*clamp(st*3.0, -1.0, 1.0))*uDir, vY + 0.14*rw*dot(uSunDir, A), rw, uSpin, uD.z, uD.w, lod, rel2), fine2 = gFine;
  float relief = clamp(1.0 + uBandK*(3.2*(dn1 - dn2) - 2.3*(fine1 - fine2)), mix(0.35, 0.5, lod.y), 1.14);   // the braids are carved by the light; the grain inside them is only brushed by it (close to, the shaded side of a braid is never a dark blotch)
  // At arm's length (inside about 150 m) the wall is ropes of water and mist: threads 0.7 m and 0.3 m across and some
  // metres long, in metres of arc (the same size on a thin sister and on the big one), climbing with the braids and
  // turning with them. Ridged, so each is a bright line with a soft flank: they stay sharp where the braids' own noise
  // is a stretched blur. They fade out as they fall under a pixel.
  float thr = 0.0, l6 = (1.0 - smoothstep(0.15, 0.42, fp))*lod.y;                         // (a 1 m thread under about 3 px is a row of ruled lines: a moire on the wall 100 m off)
  if (l6 > 0.01) {
    float q6 = phi*uDir - uThr - vY/max(rw, 1.0)*2.3 + 0.5*(dn1 - 0.6);              // (uThr: their own slow turn, a third of the braids' rate, so a thread moves a fraction of its width per frame)
    float t1 = wsNoise(vec3(cos(q6)*rw + uD.w, sin(q6)*rw, vY*0.1));
    float t2 = wsNoise(vec3(cos(q6)*rw*2.1, sin(q6)*rw*2.1 + uD.w, vY*0.22));
    float r1 = 1.0 - abs(2.0*t1 - 1.0), r2 = 1.0 - abs(2.0*t2 - 1.0);
    thr = l6*(0.6*(r1*r1*r1 - 0.22) + 0.4*(r2*r2*r2 - 0.22)*(1.0 - smoothstep(0.07, 0.2, fp)));
    dn1 += 0.3*thr;
  }
  // ROPES. Between the braids (tens of metres) and the threads (a metre) the wall is twisted ropes of vapour 3 m and
  // 6.5 m across (metres of arc, so the same on every sister), riding the middle bands' own helix and spin: ridged, so
  // each is a crisp bright strand with a shaded groove beside it where the braids' noise alone is a soft smear. They
  // carry the wall from 60 to 400 m (the threads are under a pixel there) and fade before a strand is under two pixels.
  float dnK = smoothstep(60.0, 130.0, cameraPosition.y);                                     // on the climb round her (the slalom flies below 40 m): the wall is seen along its length, above and below the eye, out to 400 m
  float nearR = 1.0 - smoothstep(mix(110.0, 240.0, dnK), mix(200.0, 420.0, dnK), camD);      // (beside the wall, looked along or down on: the strands stay to a coarser footprint and carry more of the tone, or the wall there is the braids' soft smear alone)
  float rope = 0.0, lR = 1.0 - smoothstep(mix(0.9, 1.5, nearR), mix(2.2, 3.4, nearR), fp);
  if (lR > 0.01) {
    float q7 = phi*uDir + uSpin.y - vY/max(rw, 1.0)*1.55 + 0.3*(dn1 - 0.6);
    float a1 = wsNoise(vec3(cos(q7)*rw/3.0 + uD.w, sin(q7)*rw/3.0, vY/24.0));
    float a2 = wsNoise(vec3(cos(q7)*rw/6.5, sin(q7)*rw/6.5 + uD.w, vY/45.0 + 3.0));
    float k1 = 1.0 - abs(2.0*a1 - 1.0), k2 = 1.0 - abs(2.0*a2 - 1.0);
    float bund = smoothstep(0.3, 0.62, wsNoise(vec3(cos(q7)*rw/15.0 + 5.0, sin(q7)*rw/15.0 + uD.w, vY/70.0)));   // in bundles, with smooth wall between: an even hatch reads as cloth
    float crisp = nearR*dnK, w1 = clamp(1.0*fp, 0.035, 0.3), w2 = clamp(0.46*fp, 0.035, 0.3);   // on the climb the lay of the ropes is drawn: between the pale strands run thin dark GROOVES with an edge a pixel and a half wide whatever the distance (on an ivory wall a pale ridge 20 px across was a smear; a groove reads)
    float r1 = mix(k1*k1*k1 - 0.25, 0.15 - 0.6*smoothstep(0.82 - w1, 0.82 + w1, k1), crisp), r2 = mix(k2*k2*k2 - 0.25, 0.15 - 0.6*smoothstep(0.82 - w2, 0.82 + w2, k2), crisp);
    rope = lR*(0.2 + 0.8*bund)*(0.4*r1*(1.0 - smoothstep(mix(0.25, 0.4, nearR), mix(0.7, 1.1, nearR), fp)) + mix(0.62, 0.8, crisp)*r2);
    dn1 += mix(0.32, mix(0.46, 0.54, dnK), nearR)*rope;
  }
  float edge = smoothstep(0.0, 0.13, mu0);
  float dA = mix(0.74, 0.48, uBandK) + 0.52*uBandK*smoothstep(0.3, 1.0, dn1);   // (uBandK: under the moon the bands have half their contrast, so the limbs are braids, not a ladder of white ticks)
  float mu = clamp(mu0 + 0.08*(dn1 - 0.78)*smoothstep(0.2, 0.5, mu0), 0.0, 1.0);   // the shell's thickness follows the smooth cylinder (not the braided relief: that drew a faceted crease); the braids only fray the limb's inner edge
  float aN = (1.0 - exp(-uTau*(1.0 + 1.7*lowN)*wsShell(mu)*dA*obl*mix(1.0, mix(thinK, 1.0, 0.8*lowN), smoothstep(mix(0.45, 0.6, smoothstep(190.0, 350.0, camD)), 0.95, mu))))*edge;
  vec3 cN = wsLit(N, V, dn1, sunP, vY, relief)*mix(mix(0.79, 0.52, uBandK), 1.06, smoothstep(0.36, 1.05, dn1))*max(1.0 + uBandK*(0.7*thr + mix(0.62, 1.25, nearR)*rope), 0.3);
  cN *= 1.0 + 0.26*(1.0 - smoothstep(0.06, 0.5, mu0))*clamp(0.55 + dot(dn, uSunDir), 0.0, 1.0)*sunP;   // a bright rim on the limb that faces the light
  cN *= min(1.0, 1.04/max(max(cN.r, cN.g), max(cN.b, 1e-3)));                                  // (strands and rim keep their colour: nothing on the wall blooms)
  // far wall, found analytically on the local cylinder
  float s = 2.0*dl*mu0/vpl;
  float yF = vY + s*dot(V, A)/max(vR, 1e-3);
  vec3 dF = d + Vp*s; vec3 dFn = dF/max(length(dF), 1e-3);
  float phiF = atan(dot(dFn, e2), dot(dFn, e1) + 1e-6);
  float relF;
  float dnF = wsBands(phiF*uDir, yF, rw, uSpin, uD.z, uD.w, vec2(lod.x, 0.0), relF);
  float inF = smoothstep(uA.z, uA.z + 20.0, yF)*(1.0 - smoothstep(uH - 30.0, uH - 4.0, yF));
  float aF = (1.0 - exp(-uTau*1.25*(1.0 + 1.7*(1.0 - smoothstep(20.0, 90.0, yF)))*wsShell(mu0)*(0.30 + 0.70*smoothstep(0.3, 1.0, dnF))*obl))*inF;
  // Close to, the tube is 30-60 m of cloud: what stands behind it (another sister, a lit cloud edge) must not draw a line
  // down its middle. The far wall takes up the slack there, so the middle shows the far wall's bands and the core, not the world.
  aF = 1.0 - (1.0 - aF)*(1.0 - 0.8*smoothstep(uA.z, uA.z + 20.0, yF)*smoothstep(0.15, 0.6, mu0)*(1.0 - smoothstep(160.0, 420.0, camD)));
  vec3 cF = wsLit(normalize(mix(dFn, -dFn, 0.3) + vec3(0.0, 1e-4, 0.0)), V, dnF, sunP, yF, 1.0)*mix(mix(0.55, 0.15, uBandK), 1.0, smoothstep(0.36, 1.05, dnF))*vec3(0.84, 0.92, 1.10);   // counter-moving bands, in strong contrast
  // lit core: a soft glow seen through the wall. It wanders a quarter of the tube's width, swells and thins every
  // 30-60 m of height and is dimmed where the far wall's counter-moving bands cross it: never a ruled stripe
  float lat = dot(dn, cross(A, Vn));                                         // -1..1 across the tube as seen
  float yM = 0.5*(vY + yF);
  float cn = wsNoise(vec3(uD.w, yM/(rw*2.2) - uTime*0.9, 1.7))*wsNoise(vec3(4.0, yM/(rw*0.6) - uTime*2.1, uD.w));
  float swell = 0.4 + 0.6*wsNoise(vec3(uD.w + 2.0, yM/44.0 - uTime*0.5, 3.3));
  float offC = 0.15*sin(yM*0.05 + uTime*0.4 + uD.w) + 0.1*sin(yM*0.021 - uTime*0.23 + 2.0*uD.w);
  float cw = 1.0 - smoothstep(0.0, 0.63*swell, abs(lat - offC));
  float aC = cw*cw*(0.12 + 0.80*cn)*swell*(1.0 - 0.6*smoothstep(0.45, 0.95, dnF))*inF*smoothstep(0.25, 0.9, uC.w);
  vec3 cC = uSunCol*(0.55 + 0.6*sunP) + uShadowCol*0.35;
  // composite far -> core -> near
  vec3 acc = cF*aF;
  float al = aF;
  acc = mix(acc, cC, aC); al = al + (1.0 - al)*aC;
  acc = acc*(1.0 - aN) + cN*aN; al = al + (1.0 - al)*aN;
  float vfade = smoothstep(uA.z, uA.z + 30.0 + 45.0*uA.w, vY)*(1.0 - smoothstep(uH - 34.0, uH - 6.0, vY));
  al *= vfade*uAlpha;
  gl_FragColor = vec4(acc/max(al/max(vfade*uAlpha, 1e-3), 1e-3), al);
  #include <fog_fragment>
}
`,eo=`
uniform vec4 uA, uB, uC, uD;
uniform vec3 uSpin, uWind;
uniform vec2 uBase;
uniform float uDir, uTime, uOmega, uAlpha;
attribute vec4 aI, aJ;
varying vec2 vUv; varying vec3 vCol; varying float vAl, vSeed;
#include <fog_pars_vertex>
${q}
${U}
${Ae}
${oe}
void main(){
  float p = fract(uTime*aJ.x + aI.w);
  float lifeT = 1.0/aJ.x;
  float y0 = mix(uA.z + 24.0, uH - 60.0, aI.x);
  float y = y0 + p*lifeT*(1.5 + 3.0*aJ.z);
  vec3 c = wsSpine(y, uA, uB, uC, uD);
  float r = wsRadius(y, uA, uC, 0.0);
  float ang = aI.y*6.2831853 + uDir*(uSpin.x*0.0 + uOmega*0.45*lifeT*(p - 0.42*p*p));
  vec3 radial = vec3(cos(ang), 0.0, sin(ang));
  float lee = 0.5 + 0.5*dot(radial.xz, uWind.xy);
  float rr = r*(0.96 + aJ.y*(0.2 + 1.1*lee)*p*p) + 2.0*p;
  vec3 lp = c + radial*rr + vec3(uWind.x, 0.0, uWind.y)*(uWind.z*p*p*lifeT*(0.4 + 0.6*lee));
  vec4 wp = modelMatrix*vec4(lp, 1.0);
  vec3 toCam = cameraPosition - wp.xyz; float dist = length(toCam); toCam /= max(dist, 1e-3);
  vec3 wr = normalize(mat3(modelMatrix)*radial);
  float facing = dot(wr, normalize(vec3(toCam.x, 0.0, toCam.z) + vec3(1e-4, 0.0, 0.0)));
  float limb = smoothstep(-0.55, 0.05, facing)*mix(0.22, 1.0, smoothstep(0.80, 0.35, abs(facing)));
  float across = rr*sqrt(max(1.0 - facing*facing, 0.0))/max(r, 0.5);
  float show = max(limb, smoothstep(1.25, 1.9, rr/max(r, 0.5)))*mix(0.18, 1.0, max(smoothstep(0.85, 1.15, across), smoothstep(0.1, -0.3, facing)*smoothstep(1.0, 1.3, across)));
  float size = aI.z*(3.0 + 0.42*max(r, 3.0))*(0.6 + 1.1*p)*length(mat3(modelMatrix)[0]);
  float rot = uDir*(0.6 + 0.5*p) + (aJ.z - 0.5)*2.4;
  vec2 q = vec2(position.x*(1.3 + 1.2*aJ.w), position.y);
  q = vec2(q.x*cos(rot) - q.y*sin(rot), q.x*sin(rot) + q.y*cos(rot));
  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), -toCam) + vec3(1e-4, 0.0, 0.0));
  vec3 up = cross(-toCam, right);
  wp.xyz += (right*q.x + up*q.y)*size;
  vUv = position.xy; vSeed = aJ.w*37.0 + floor(uTime*aJ.x + aI.w)*3.1;
  vec2 sl = uSunDir.xz/max(uSunDir.y, 0.1);
  float sunP = wsPatch(lp.xz + uBase - sl*lp.y);
  vec3 N = normalize(wr*0.25 + toCam*0.3 + uSunDir*0.75 + vec3(0.0, 0.3, 0.0));
  vCol = wsLit(N, -toCam, 0.55 + 0.3*aJ.w, sunP, y, 1.0)*(0.9 + 0.2*aJ.w);
  float life = smoothstep(0.0, 0.16, p)*(1.0 - smoothstep(0.5, 1.0, p));
  float span = smoothstep(uA.z, uA.z + 40.0, y)*(1.0 - smoothstep(uH - 70.0, uH - 20.0, y));
  vAl = uAlpha*life*show*span*smoothstep(10.0, 45.0, dist)*(0.36 + 0.36*lee)*smoothstep(0.1, 0.5, uC.w);
  vAl *= 1.0 - smoothstep(40.0, 90.0, cameraPosition.y)*(1.0 - smoothstep(120.0, 300.0, dist))*(1.0 - smoothstep(10.0, 50.0, wp.y - cameraPosition.y));   // from the helix a rag at or below the eye and close by is a milky blur over the sea: gone inside 120 m, whole again at 300 m (one well above the eye stands against the cloud and stays)
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}
`,oo=`
uniform float uTime;
varying vec2 vUv; varying vec3 vCol; varying float vAl, vSeed;
#include <fog_pars_fragment>
${q}
void main(){
  float r2 = dot(vUv, vUv);
  float g = max(1.0 - r2, 0.0); g = g*g;
  float n = wsFbm(vec3(vUv*vec2(3.2, 1.5) + vSeed, uTime*0.22 + vSeed));
  float n2 = wsNoise(vec3(vUv*vec2(9.0, 4.5) - vSeed, uTime*0.3));                          // a finer tear: a rag has a torn outline and a lit top, it is never a round blur
  float a = g*smoothstep(0.47, 0.72, n + 0.34*g + 0.24*(n2 - 0.5));
  gl_FragColor = vec4(vCol*(0.76 + 0.32*n + 0.2*(n2 - 0.5) + 0.2*vUv.y), a*vAl);
  #include <fog_fragment>
}
`,to=`
uniform vec4 uSk;
uniform vec2 uBase;
uniform float uTime, uDir, uSpinS, uSeed;
varying vec3 vLP, vN, vWP; varying vec2 vAV; varying float vLobe;
#include <fog_pars_vertex>
${q}
float gLobe;
vec3 skSurf(float a, float v){
  float am = uSk.w;
  float q = a*uDir + uSpinS;
  float lobeLo = 0.45 + 1.1*wsNoise(vec3(cos(q)*2.4 + uSeed, sin(q)*2.4, uTime*0.35 + v*0.6));
  float lobe = lobeLo*(0.8 + 0.45*wsNoise(vec3(cos(q)*7.0, sin(q)*7.0 + uSeed, uTime*0.8)));
  gLobe = lobe;
  float R = uSk.y*(0.55 + 0.45*am);
  float rf = uSk.x;
  float s = clamp(v/0.4, 0.0, 1.0), w = clamp((v - 0.4)/0.6, 0.0, 1.0);
  float r0 = rf*2.1 + 0.06*R;
  float rho = mix(rf*(1.08 + 0.2*s) + (r0 - rf*1.28)*s*s*s, r0 + (R - r0)*pow(w, 0.85), step(0.4, v)) + R*0.16*(lobe - 1.0)*w;
  float lk = 0.9 + 0.12*lobeLo;
  float yS = (2.6 - 1.9*(0.6*s + 0.4*sqrt(s)))*lk;
  float yC = 0.7*lk*pow(1.0 - w, 5.0) + 0.92*lobe*sin(3.14159*pow(w, 0.75))*(1.0 - 0.25*w);
  float y = uSk.z*am*mix(yS, yC, step(0.4, v)) + 0.5;
  float aa = a - uDir*0.75*v;
  return vec3(cos(aa)*rho, y, sin(aa)*rho);
}
void main(){
  float a = position.x*6.2831853, v = position.y;
  vec3 p = skSurf(a, v); float lobe = gLobe;
  vec3 ta = skSurf(a + 0.03, v) - skSurf(a - 0.03, v);
  vec3 tv = skSurf(a, min(v + 0.02, 1.0)) - skSurf(a, max(v - 0.02, 0.0));
  vec3 n = cross(tv, ta);
  n = -n;   // the grid's winding makes cross(tv, ta) the inner / lower side: one sign everywhere (a per-vertex test tore steep lobes into wedges)
  vN = normalize(mat3(modelMatrix)*(n + vec3(0.0, 1e-4, 0.0)));
  vLP = p; vAV = vec2(a, v); vLobe = lobe;
  vec4 wp = modelMatrix*vec4(p, 1.0);
  vWP = wp.xyz;
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}
`,ao=`
uniform vec4 uSk;
uniform vec2 uBase;
uniform float uTime, uDir, uSpinS, uSeed;
varying vec3 vLP, vN, vWP; varying vec2 vAV; varying float vLobe;
#include <fog_pars_fragment>
${q}
${U}
${oe}
void main(){
  float a = vAV.x, v = vAV.y;
  float q = a*uDir + uSpinS*1.35 + 1.7*v;
  float n1 = wsNoise(vec3(cos(q)*3.2, sin(q)*3.2 + uSeed, v*3.5 - uTime*0.9));
  float q2 = a*uDir + uSpinS*1.9 + 2.6*v;
  float n2 = wsNoise(vec3(cos(q2)*10.0 + uSeed, sin(q2)*10.0, v*9.0 - uTime*1.6));
  float n3 = wsNoise(vec3(cos(q2)*27.0, sin(q2)*27.0, v*30.0 - uTime*2.4 + uSeed));
  float qj = a*uDir + uSpinS*2.4 + 0.5*v;
  float jet = wsNoise(vec3(cos(qj)*46.0, sin(qj)*46.0 + uSeed, v*2.2 - uTime*1.3));
  float dens = 0.42*n1 + 0.26*n2 + 0.16*n3 + 0.22*jet;
  float camD = distance(vWP, cameraPosition);
  float nearK = 1.0 - smoothstep(60.0, 240.0, camD);
  float qh = a*uDir + uSpinS*2.9 + 0.3*v;
  float hf = wsNoise(vec3(cos(qh)*120.0, sin(qh)*120.0 + uSeed, v*7.0 - uTime*2.0));
  float hf2 = wsNoise(vec3(vLP.xz*0.9, vLP.y*0.9 - uTime*3.0));
  float hf3 = wsNoise(vec3(vLP.xz*0.23 + uSeed, vLP.y*0.3 - uTime*1.1));
  // torn at every distance: the fine terms erode the sheet (they average out when they fall under a pixel)
  dens += (0.45 + 0.55*nearK)*(0.20*(hf - 0.5) + 0.16*(hf2 - 0.5)) + 0.22*(hf3 - 0.5) + 0.12*(n3 - 0.5);
  float body = mix(0.40, 0.30, smoothstep(0.25, 0.6, v))*(0.5 + 0.5*smoothstep(12.0, 110.0, camD));
  float th = mix(-0.06, 0.50, smoothstep(0.2, 0.9, v)) - 0.14*(vLobe - 1.0);
  float al = body*smoothstep(th, th + 0.46, dens);
  al *= smoothstep(0.0, 0.24, v)*(1.0 - smoothstep(0.45, 0.9, v))*smoothstep(0.4, 3.0, vLP.y);
  vec3 V = normalize(vWP - cameraPosition);
  vec3 N = normalize(vN);
  vec3 rad = normalize(vec3(vLP.x, 0.0, vLP.z) + vec3(1e-4, 0.0, 0.0));
  // no silhouette: every fold dissolves toward grazing, the far side and the top thin out with height above the sea
  al *= uSk.w*smoothstep(0.0, 0.6, abs(dot(N, V)) + 0.3*(hf3 - 0.5) + 0.14*(hf2 - 0.5));
  float hy = vLP.y/max(uSk.z*max(uSk.w, 0.2), 1.0);
  al *= 1.0 - 0.8*smoothstep(0.45, 1.5, hy);
  al *= 1.0 - smoothstep(-0.15, 0.45, dot(rad, V))*smoothstep(0.12, 0.7, hy);
  al *= smoothstep(45.0, 190.0, camD);   // a far-view form: up close it dissolves and leaves the tube, sprites and stain
  vec2 sl = uSunDir.xz/max(uSunDir.y, 0.1);
  float sunP = wsPatch(vLP.xz + uBase - sl*vLP.y);
  vec3 Nl = normalize(rad*0.75 + N*0.6 + vec3(0.0, 0.35, 0.0));
  vec3 col = wsLit(Nl, V, dens, sunP, vLP.y, 0.8 + 0.5*dens)*mix(0.62, 1.1, smoothstep(0.28, 0.72, dens));
  gl_FragColor = vec4(col, al);
  #include <fog_fragment>
}
`,so=`
uniform vec4 uSk;
uniform vec2 uBase;
uniform float uTime, uDir, uOmega, uPx, uMaxPt;
attribute vec4 aI, aJ;
varying vec4 vCol; varying vec3 vDir; varying float vSeed;
#include <fog_pars_vertex>
${q}
${U}
${oe}
vec3 wsTrack(float p, float lifeT, float sheath, out float ang){
  float am = uSk.w, R = uSk.y*(0.55 + 0.45*am);
  float out1 = 1.0 - (1.0 - p)*(1.0 - p);
  float rho = mix(uSk.x*(1.05 + 0.5*aI.y), R*(0.62 + 0.55*aI.y), out1);
  float y = uSk.z*am*(0.5 + 1.1*aI.z)*4.0*p*(1.0 - p)*0.8 + 0.8;
  rho = mix(rho, uSk.x*(1.0 + 0.55*aI.y + 0.5*p), sheath);
  y = mix(y, uSk.z*am*(0.2 + 2.3*p)*(0.6 + 0.6*aI.z), sheath);
  ang = aI.x*6.2831853 + uDir*uOmega*lifeT*(0.30 + 0.5*sheath)*(p - 0.4*p*p);
  return vec3(cos(ang)*rho, y, sin(ang)*rho);
}
void main(){
  float cyc = uTime*aJ.x + aI.w;
  float p = fract(cyc);
  float lifeT = 1.0/aJ.x;
  float am = uSk.w;
  float sheath = step(0.5, aJ.z)*step(aJ.z, 1.5);
  float glint = step(1.5, aJ.z);
  float ang, ang2;
  vec3 lp = wsTrack(p, lifeT, sheath, ang);
  float y = lp.y;
  vec4 wp = modelMatrix*vec4(lp, 1.0);
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  // the sprite's track on screen: it is drawn out along it (gl_PointCoord runs downward)
  vec4 c2 = projectionMatrix*viewMatrix*modelMatrix*vec4(wsTrack(p + 0.035, lifeT, sheath, ang2), 1.0);
  vec2 sd = (c2.xy/max(c2.w, 1e-3) - gl_Position.xy/max(gl_Position.w, 1e-3))*vec2(projectionMatrix[1][1]/max(projectionMatrix[0][0], 1e-3), 1.0);
  float sdl = length(sd);
  vec2 dirS = sdl > 1e-5 ? sd/sdl : vec2(1.0, 0.0);
  float dist = max(-mvPosition.z, 0.5);
  float sc = length(mat3(modelMatrix)[0]);
  float size = aJ.y*(2.2 + 7.5*p)*(1.0 - 0.35*sheath)*sc*1.45;
  size = mix(size, 0.55*sc, glint);
  float px = size*uPx/dist;
  float over = max(px/uMaxPt, 1.0);
  gl_PointSize = clamp(px, 1.6, uMaxPt);
  vDir = vec3(dirS.x, -dirS.y, mix(1.0, 2.5, smoothstep(5.0, 16.0, px)));   // far off (a few pixels) a sprite stays round, or the crown would thin out
  vec3 toCam = normalize(cameraPosition - wp.xyz);
  vec3 rad = vec3(cos(ang), 0.0, sin(ang));
  vec2 sl = uSunDir.xz/max(uSunDir.y, 0.1);
  float sunP = wsPatch(lp.xz + uBase - sl*lp.y);
  vec3 N = normalize(rad*0.6 + toCam*0.5 + vec3(0.0, 0.4, 0.0));
  vec3 col = wsLit(N, -toCam, 0.6 + 0.4*aJ.w, sunP, y, 1.0)*(1.0 + 0.1*aJ.w);
  float life = smoothstep(0.0, 0.12, p)*(1.0 - smoothstep(0.45, 1.0, p));
  float al = life*am*(0.26 + 0.16*aJ.w)/over*smoothstep(12.0, 40.0, dist)*mix(1.0, 0.3, smoothstep(14.0, 70.0, px));   // nothing hangs at the lens: inside 12 m a sprite is gone
  // glitter: tiny HDR sparks on the sunward side, twinkling
  float tw = step(0.72, wsHash(vec3(floor(uTime*7.0 + aI.w*40.0), aI.x*91.0, aI.y*57.0)));
  float sunSide = smoothstep(-0.1, 0.6, dot(rad, uSunDir))*sunP;
  vec3 gcol = uSunCol*vec3(1.0, 0.93, 0.78)*3.6*tw*sunSide;
  col = mix(col, gcol, glint);
  al = mix(al, life*am*tw*sunSide*min(px/1.6, 1.0)*smoothstep(4.0, 12.0, dist), glint);
  vCol = vec4(col, al); vSeed = aI.x*31.0 + aI.y*17.0 + (1.0 - glint)*uTime*0.3 + glint*1000.0;
  #include <fog_vertex>
}
`,no=`
varying vec4 vCol; varying vec3 vDir; varying float vSeed;
#include <fog_pars_fragment>
${q}
void main(){
  vec2 c = gl_PointCoord*2.0 - 1.0;
  float glint = step(900.0, vSeed);
  float sa = dot(c, vDir.xy), sc = dot(c, vec2(-vDir.y, vDir.x));
  vec2 e = mix(vec2(sa, sc*vDir.z), c, glint);
  float r2 = dot(e, e);
  float g = max(exp(-4.5*r2) - 0.0111, 0.0)*step(r2, 1.0);
  float n1 = wsNoise(vec3(sa*1.3 + vSeed, sc*1.9*vDir.z, vSeed*0.37));
  float n2 = wsNoise(vec3(c*6.5 + vSeed*1.7, vSeed*0.11));
  float n = smoothstep(0.34, 0.74, 0.6*n1 + 0.4*n2 + 0.5*g - 0.08);
  n = max(n, 0.7*smoothstep(0.7, 0.86, n2)*smoothstep(0.02, 0.25, g));       // fine drops round the torn body
  n = mix(n, 1.0, glint);
  gl_FragColor = vec4(vCol.rgb*(0.8 + 0.25*n), vCol.a*min(g*1.25, 1.0)*n);
  #include <fog_fragment>
}
`,ro=`
uniform vec4 uStA[${$}], uStB[${$}];
uniform float uSeaY;
attribute float aSp;
varying vec2 vQ, vL; varying vec4 vA, vB; varying float vArms; varying vec3 vSW;
#include <fog_pars_vertex>
void main(){
  int i = int(aSp + 0.5);
  vec4 A = uStA[i]; vA = A; vB = uStB[i];
  vArms = 3.0 + mod(aSp*2.0 + 1.0, 3.0);
  vQ = position.xy;
  vec3 lp = vec3(A.x + position.x*A.z, uSeaY, A.y + position.y*A.z);
  vL = lp.xz;
  vSW = (modelMatrix*vec4(lp, 1.0)).xyz;
  vec4 mvPosition = modelViewMatrix*vec4(lp, 1.0);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}
`,io=`
uniform vec3 uDarkCol, uSargCol;
uniform float uTime, uDir;
varying vec2 vQ, vL; varying vec4 vA, vB; varying float vArms; varying vec3 vSW;
#include <fog_pars_fragment>
${q}
${U}
${oe}
void main(){
  float rho = length(vQ);
  float th = atan(vQ.y, vQ.x + 1e-6);
  float ct = vQ.x/max(rho, 1e-4), sn = vQ.y/max(rho, 1e-4);
  float lr = log(max(rho, 0.03));
  float wob = wsNoise(vec3(ct*1.6, sn*1.6, 2.0 + vA.x*0.01));
  float rn = rho*(0.86 + 0.28*wob);
  float ringR = vB.x/max(vA.z, 1.0);
  float nA = floor(vArms + 0.5);
  // dark smooth spot, soft-rimmed
  vec3 toC = cameraPosition - vSW;
  float steepK = smoothstep(0.3, 0.62, toC.y/max(length(toC), 1.0));                      // looked down on (from the helix): a darker spot, arms that run on as curved streaks, fewer loose dashes
  float dark = (1.0 - smoothstep(0.18, 1.0, rn))*0.45*vA.w*(1.0 + 0.8*steepK);
  // flow coordinates: q is constant along a spiral arm, lr runs along it. Noise is sampled about six times longer
  // along the flow than across it, so foam is drawn out into streaks and webbing; finer octaves come in near the eye
  float q = uDir*th - 2.3*lr + vB.w;
  float qs = q + 0.8*lr + 0.3*(wsNoise(vec3(vL*0.045, 1.0)) - 0.5) + 0.14*(wsNoise(vec3(vL*0.13, 5.0)) - 0.5);   // streaks wander a little: no drawn rings
  float cq = cos(qs), sq = sin(qs), tt = uTime*0.25;
  float fw = length(fwidth(vL))/max(rho*vA.z, 2.0);
  float g3 = 1.0 - smoothstep(0.2, 0.8, fw*46.0), g4 = 1.0 - smoothstep(0.2, 0.8, fw*115.0);
  float g1 = 1.0 - smoothstep(0.25, 1.0, fw*7.0), g2 = 1.0 - smoothstep(0.2, 0.8, fw*19.0);   // far off the streaks blur out: no drawn arcs
  float outR = smoothstep(0.45*ringR, 0.9*ringR, rho);                                     // from the spray ring outward ...
  float lf = lr + max(lr - log(max(0.85*ringR, 0.03)), 0.0);                                // ... the flow draws the foam out half as far (3:1), so ribbons break
  float s1 = mix(0.5, wsNoise(vec3(cq*7.0, sq*7.0, lf*3.2 - tt*0.5 + 1.0)), g1);
  float s2 = mix(0.5, wsNoise(vec3(cq*19.0 + 5.0, sq*19.0, lf*8.5 - tt)), g2);
  float s3 = mix(0.5, wsNoise(vec3(cq*46.0, sq*46.0 + 3.0, lf*20.0 - tt*1.7)), g3);
  float s4 = mix(0.5, wsNoise(vec3(cq*115.0 + 7.0, sq*115.0, lf*50.0 - tt*2.6)), g4);
  float fb = mix(0.40*s1 + 0.30*s2 + 0.18*s3 + 0.12*s4, 0.15*s1 + 0.30*s2 + 0.30*s3 + 0.25*s4, g4);   // finer toward the eye
  float web2 = 1.0 - abs(2.0*(0.5*s3 + 0.5*s4) - 1.0);                              // only the finest scale is ridged into lace
  float lace = smoothstep(0.36, 0.70, fb)*0.72 + 0.2*fb + 0.2*web2*web2*g3*g4;
  float warp = wsNoise(vec3(cq*1.3, sq*1.3, lr*1.5));
  // curved foam arms (log spiral): soft-sided bands made of streaks
  float sa = sin(nA*q + 4.0*warp);
  float w = fwidth(sa)*1.2 + 0.24 + 0.1*(1.0 - g2);                                        // (capped: far arms do not fatten into smooth bands)
  float brk = mix(smoothstep(0.30, 0.62, s1), smoothstep(0.42, 0.70, s1), g2)*(0.45 + 0.55*smoothstep(0.3, 0.6, wsNoise(vec3(vL*0.021, 4.0 + uTime*0.05))));
  float dashC = 0.08 + 0.92*smoothstep(0.36, 0.62, wsNoise(vec3(cq*5.0 + 2.0, sq*5.0, lf*11.0 - tt)));
  float dashF = 0.25 + 0.75*smoothstep(0.32, 0.6, wsNoise(vec3(cq*11.0 + 4.0, sq*11.0, lf*26.0 - tt*1.5)));
  float g2d = 1.0 - smoothstep(0.2, 0.8, 19.0*sqrt(length(dFdx(vL))*length(dFdy(vL)))/max(rho*vA.z, 2.0));   // by the footprint's mean axis: seen low across the sea, an arm lying across the view still resolves its dashes
  float dash = mix(mix(1.0, dashC*mix(0.72, dashF, g2d), max(g2d, 0.7*g1)*outR), 0.5 + 0.5*dashC, 0.8*steepK*outR);   // no arm runs unbroken for more than about 10 m: dashes at two scales, right up to the churned ring; both hold out to mid distance (60-250 m), the fine one fades first
  float band = smoothstep(ringR*0.85, ringR*1.35, rho)*(1.0 - smoothstep(0.55, 0.97, rn));
  float arms = smoothstep(0.52 - w, 0.52 + w, sa)*band*vB.y*(0.3 + 0.7*brk)*dash;
  float fine = smoothstep(0.84 - w, 0.84 + w, sin((nA*3.0)*q + 9.0*warp + 2.0))*band*vB.y*brk*0.5*dash*(1.0 - 0.6*steepK);
  // contact ring and churned water under the crown
  float rr = (rho - ringR)/0.09;
  float churnN = 0.5*s2 + 0.3*s1 + 0.2*s3;
  float ring = exp(-rr*rr)*smoothstep(0.25, 0.7, churnN)*vB.z;
  float churn = 0.8*(1.0 - smoothstep(ringR*0.45, ringR*1.05, rho))*smoothstep(0.30, 0.70, churnN)*vB.z;
  float core = (1.0 - smoothstep(0.14*ringR, 0.6*ringR, rho))*vB.z;
  float blot = 0.35 + 0.65*smoothstep(0.3, 0.7, wsNoise(vec3(vL*0.07, uTime*0.1 + 2.0)));
  float iso = mix(1.0, smoothstep(0.38, 0.62, 0.6*wsNoise(vec3(vL*0.9, uTime*0.2)) + 0.4*wsNoise(vec3(vL*0.31 + 7.0, uTime*0.11))), 0.8*g3*outR);   // near the eye the ribbons are dashes and webbing 1-2 m wide, dark water between
  float webN = 1.0 - abs(2.0*wsNoise(vec3(vL*1.9 + 3.0, uTime*0.3)) - 1.0);
  iso *= mix(1.0, 0.42 + 0.58*smoothstep(0.25, 0.8, webN), (1.0 - smoothstep(0.12, 0.4, length(fwidth(vL))))*outR);   // and within 60 m each dash is veined lace, not a blob
  float foam = clamp((arms + fine + ring*blot*dash)*iso + churn*blot, 0.0, 1.0)*smoothstep(0.16, 0.74, lace + 0.12*churn);   // (the contact ring too: no blot is a smooth blob)
  foam = min(max(foam, core*(0.40 + 0.75*lace)), 1.0);
  // sargassum drawn into the spiral: broken golden-brown tufts
  float q2 = uDir*th - 3.3*lr + vB.w*0.8 + 1.3;
  float ss = sin((nA + 2.0)*q2 + 5.0*warp + 2.2*(s2 - 0.5));
  float w2 = fwidth(ss)*1.2 + 0.07;
  float sband = smoothstep(ringR*1.25, ringR*1.8, rho)*(1.0 - smoothstep(0.80, 1.0, rn));
  float sarg = smoothstep(0.88 - w2, 0.88 + w2, ss)*sband*smoothstep(0.42, 0.6, wsNoise(vec3(vL*0.03 + 5.0, 1.0)))*vA.w;
  sarg *= smoothstep(0.38, 0.62, s2)*(0.45 + 0.55*smoothstep(0.3, 0.7, s3));
  float sunP = wsPatch(vL);
  vec3 foamCol = uSunCol*(0.25 + 0.62*sunP) + uShadowCol*0.55;
  vec3 col = uDarkCol;
  float al = dark;
  col = mix(col, uSargCol*(0.35 + 0.65*sunP), sarg); al = max(al, sarg*0.72);
  col = mix(col, foamCol*(0.82 + 0.3*lace), foam); al = max(al, foam*0.68);
  al *= 1.0 - smoothstep(0.90, 1.0, rho);
  gl_FragColor = vec4(col, al);
  #include <fog_fragment>
}
`,Le=`
attribute vec2 aK;
varying vec3 vLP, vWN, vWP; varying vec2 vK;
#include <fog_pars_vertex>
void main(){
  vLP = position; vK = aK;
  vWN = normalize(mat3(modelMatrix)*normal);
  vec4 wp = modelMatrix*vec4(position, 1.0); vWP = wp.xyz;
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}
`,Re=`
uniform vec3 uIndigo, uOff, uGlowPos, uGlowCol;
uniform vec4 uBar;
uniform float uTime, uDir, uRc, uLitK, uBarK, uFormK;
varying vec3 vLP, vWN, vWP; varying vec2 vK;
#include <fog_pars_fragment>
${q}
${U}
${oe}
void main(){
  vec2 rel = vLP.xz;
  float rho = length(rel);
  float ct = rel.x/max(rho, 1e-3), sn = rel.y/max(rho, 1e-3);
  float tw = uDir*(uTime*0.045 - 1.25*log(max(rho, 10.0)/40.0));
  float c2 = ct*cos(tw) - sn*sin(tw), s2 = sn*cos(tw) + ct*sin(tw);
  float stri = wsNoise(vec3(c2*2.4, s2*2.4, rho/70.0));
  float fine = wsNoise(vec3(c2*7.5, s2*7.5, rho/22.0 + 4.0));
  vec2 wxz = vLP.xz + uOff.xz;
  float lump = wsFbm(vec3(wxz/64.0 + uTime*0.012, 1.3));
  float d1 = wsFbm(vec3(wxz.x, vLP.y*1.5, wxz.y)/23.0 + uTime*0.02);
  float d2 = wsNoise(vec3(wxz.x, vLP.y*1.5, wxz.y)/6.5 + 3.0);
  vec3 bp = vec3(wxz.x, vLP.y*1.4, wxz.y);
  float bl1 = 1.0 - abs(2.0*wsNoise(bp/13.0 + 5.0) - 1.0);
  float bl2 = 1.0 - abs(2.0*wsNoise(bp/4.2 + 9.0) - 1.0);
  float bill = 0.62*bl1 + 0.38*bl2*(1.0 - smoothstep(120.0, 500.0, distance(vWP, cameraPosition)));
  float tone = 0.40 + 0.34*mix(stri, 0.5, 0.7*uFormK) + 0.16*mix(fine, 0.5, 0.5*uFormK) + 0.34*lump + 0.46*d1 + 0.12*d2 + (0.14 + 0.2*uFormK)*bill;
  // pouches and creases at two scales, as on the cloud base (there a marched height field, here shading): broad soft shade
  // toward the creases, and light on the flanks that face the sun
  float pa = abs(2.0*wsNoise(vec3(wxz/125.0 + 3.0, 0.5)) - 1.0), pb = abs(2.0*wsNoise(vec3(wxz/52.0 + 17.0, 2.5)) - 1.0);
  vec2 ps = wxz + normalize(uSunDir.xz + vec2(1e-4, 0.0))*9.0;
  float pa2 = abs(2.0*wsNoise(vec3(ps/125.0 + 3.0, 0.5)) - 1.0), pb2 = abs(2.0*wsNoise(vec3(ps/52.0 + 17.0, 2.5)) - 1.0);
  float pao = 0.66*smoothstep(0.02, 0.4, pa) + 0.34*smoothstep(0.02, 0.4, pb);
  float pfl = clamp((0.66*(sqrt(min(sqrt(pa*pa + 0.006)*1.6, 1.0)) - sqrt(min(sqrt(pa2*pa2 + 0.006)*1.6, 1.0))) + 0.34*(sqrt(min(sqrt(pb*pb + 0.006)*1.7, 1.0)) - sqrt(min(sqrt(pb2*pb2 + 0.006)*1.7, 1.0))))*5.0, -1.0, 1.0);
  tone += 0.36*(pao - 0.6);
  float pcs = mix(1.0, smoothstep(0.0, 0.65, abs(2.0*wsNoise(bp/17.0 + 21.0) - 1.0)), uFormK);   // the bay is seen close: its walls are heads of cloud 15-20 m across with dark creases between, never a smooth plate
  tone -= 0.22*(1.0 - pcs);
  float hol = mix(1.0, smoothstep(55.0, 175.0, length(vLP.xz)), uFormK);                    // inside the bay's ring wall nothing is sunlit: the hollow is dark, lit by the lantern alone
  vec3 N = normalize(vWN);
  vec3 V = normalize(vWP - cameraPosition);
  float low = vK.y;
  vec2 sl = uSunDir.xz/max(uSunDir.y, 0.1);
  float sunP = wsPatch(wxz - sl*(vLP.y + uOff.y));
  float lip = smoothstep(-0.05, 0.55, dot(N, uSunDir) + 0.5*(d1 - 0.5))*(0.35 + 0.65*low)*sunP*(0.5 + d1);
  vec3 col = uIndigo*(0.34 + 0.62*tone)*(0.8 + 0.3*low) + uShadowCol*0.05*tone + uBounceCol*0.05*(0.5 - 0.5*N.y)*(0.4 + low);
  col *= (0.66 + 0.34*pao)*(1.0 - 0.26*max(-pfl, 0.0))*(0.62 + 0.38*hol);
  col += uSunCol*vec3(1.0, 0.8, 0.6)*max(pfl, 0.0)*(0.03 + 0.2*sunP)*(0.4 + 0.6*low)*hol;
  col += uSunCol*vec3(1.0, 0.74, 0.62)*lip*(0.10 + 0.05*bill)*uLitK*hol*(0.3 + 0.7*pcs);
  float fdn = dot(N.xz, normalize(uSunDir.xz + vec2(1e-4, 0.0)));                         // the bay's pouches are modelled: light them by their form, as the base's are
  col *= 1.0 - 0.3*uFormK*smoothstep(0.05, 0.6, -fdn);
  col += uSunCol*vec3(1.0, 0.8, 0.6)*uFormK*smoothstep(0.04, 0.72, fdn)*(0.03 + 0.2*sunP)*(0.4 + 0.6*low)*hol*(0.4 + 0.6*bill)*(0.55 + 0.9*d1)*(0.3 + 0.7*pcs);   // (billowed: a lit shelf seen close is never a flat plate)
  float bt = (dot(vLP.xz, uBar.xy) - uBar.z - 22.0*sin(uTime*0.17))/max(uBar.w, 1.0);   // the portal's bay: a warm bar of sun lying across its mouth ...
  col += uSunCol*vec3(1.0, 0.64, 0.4)*uBarK*exp(-bt*bt)*smoothstep(-0.35, 0.5, dot(N, uSunDir) + 0.5*(d1 - 0.5))*(0.3 + 0.7*low)*(0.25 + 0.75*bill)*(0.35 + 1.1*d1)*(0.5 + 0.5*pao)*(0.3 + 0.7*pcs);   // (on billows and pouches: never a flat warm plate)
  col += uGlowCol*exp(-length(vLP - uGlowPos)/60.0)*(0.45 + 0.55*d1);                    // ... and the lantern's light inside it
  float rag = wsNoise(vec3(wxz/38.0, 7.0 + uTime*0.02));
  float al = smoothstep(0.0, 0.5, vK.x - 0.7*rag*(1.0 - vK.x))*smoothstep(0.0, mix(0.6, 0.24, smoothstep(350.0, 1000.0, distance(vWP, cameraPosition))), abs(dot(N, V)) + 0.34*(d1 - 0.5) + 0.2*(d2 - 0.5) + 0.12*(lump - 0.5));   // folds dissolve: no crease has an edge
  gl_FragColor = vec4(col, al);
  #include <fog_fragment>
}
`;function ne(h,u){const n=new Float32Array((h+1)*(u+1)*3);let S=0;for(let A=0;A<=u;A++)for(let g=0;g<=h;g++)n[S++]=g/h,n[S++]=A/u,n[S++]=0;const F=new Uint32Array(h*u*6);S=0;for(let A=0;A<u;A++)for(let g=0;g<h;g++){const L=A*(h+1)+g,G=L+1,O=L+h+1,fe=O+1;F[S++]=L,F[S++]=G,F[S++]=O,F[S++]=G,F[S++]=fe,F[S++]=O}const re=new t.BufferGeometry;return re.setAttribute("position",new t.BufferAttribute(n,3)),re.setIndex(new t.BufferAttribute(F,1)),re}function lo(){return t.UniformsUtils.clone(t.UniformsLib.fog)}function R(h,u=1){return new t.Color(h).multiplyScalar(u)}const _e={afternoon:h=>({sun:h[3].clone().multiply(new t.Color(.9,.8,.62)),shadow:R("#3A4A7A").lerp(h[5],.6).multiplyScalar(1.35),bounce:h[0].clone().multiplyScalar(.55),elev:22}),noon:h=>({sun:R("#fffaf0",.92),shadow:R("#4d6fb0",1.5),bounce:h[0].clone().multiplyScalar(.7),elev:60}),lastlight:h=>({sun:R("#ffab72",.95),shadow:R("#6a4a86",1.25),bounce:R("#4d7a66",.45),elev:7}),night:h=>({sun:R("#b8c8ea",.6),shadow:R("#1c2646",1),bounce:R("#20d8b4",.12),elev:34})};async function co(h,u={}){const n=h.rng,S=h.noise,F=T(h.quality?.detail??1,.4,1),A=(Array.isArray(u.palette)&&u.palette.length>=7?u.palette:Je).map(e=>new t.Color(e)),g=u.height??620,L=u.mirror?-1:1,G=(_e[E?.mood??u.mood]||_e.afternoon)(A),O=G.elev*Math.PI/180,fe=(u.sunDir?new t.Vector3().copy(u.sunDir):new t.Vector3(-Math.cos(O)*.924,Math.sin(O),Math.cos(O)*.383)).normalize(),ie=u.dying??3,le=u.newborn??5,d=Object.assign({thin:.26,kink:.3,rope:.386,gone:.455,spot:.34,ring:.43,finger:.5,down:.74},u.timeline||{}),Ce=n.chance(.5)?1:-1,ze=n.range(-.9,-.2),Ve=u.layout||Fe,We=[7,8,5,10,6,6],M=new t.Group;M.name="waterspout-sisters";const b=[];for(let e=0;e<$;e++){const o=Ve[e],a=Fe[e],s=(o[2]??a[2])>=50,l=e===4,r=(o[2]??a[2])*.5*n.range(.93,1.08),i=(o[3]??a[3])*.5*n.range(.92,1.1),c={index:e,home:new t.Vector2(o[0]*L,o[1]),top:new t.Vector2(o[0]*L+(l?0:n.range(-14,14)),o[1]+(l?0:n.range(-14,14))),base:new t.Vector2(o[0]*L,o[1]),waist:r,trumpet:i,ring:(o[4]??a[4])*.5,stainR:(o[4]??a[4])*(e===ie||e===le?1.5:1),crown:e===ie?12:e===le?13:s?23:20,collarR:o[5]??a[5],collarDrop:(o[6]??a[6])*(l?1:n.range(.8,1.25)),braids:s?n.int(3,5):r<10?2:n.int(2,4),seed:n.range(0,40),omega:Math.PI*Math.pow(T(17/r,.4,1.3),.62)*n.range(.9,1.1),walkA:We[e]*n.range(.8,1.1),walkF:[n.range(.13,.24),n.range(.11,.2)],walkP:[n.range(0,6.28),n.range(0,6.28)],b1:s?n.range(13,19):l?n.range(15,21):n.range(20,30),b2:s||l?n.range(6,10):n.range(9,15),bf:[n.range(.22,.38),n.range(.2,.34),n.range(.3,.46),n.range(.27,.42)],bp:[n.range(0,6.28),n.range(0,6.28),n.range(0,6.28),n.range(0,6.28)],kinkDir:n.range(0,6.28),life:{foot:15,thin:1,kink:0,taper:0,spray:1,stain:1,arms:1,alpha:1},forced:null,eff:{foot:15,thin:1,kink:0,taper:0,spray:1,stain:1,arms:1,alpha:1},uA:new t.Vector4,uB:new t.Vector4,uC:new t.Vector4,uD:new t.Vector4,uSpin:new t.Vector3,uSk:new t.Vector4,uBase:new t.Vector2,uAlpha:{value:1},objs:[]};b.push(c)}const w={uH:{value:g},uTime:{value:0},uDir:{value:Ce},uPx:{value:400},uMaxPt:{value:80},uBandK:{value:(E?.mood??u.mood)==="night"?.5:1},uSunDir:{value:fe.clone()},uSunCol:{value:u.sunColor?new t.Color().copy(u.sunColor):G.sun},uShadowCol:{value:u.shadowColor?new t.Color().copy(u.shadowColor):G.shadow},uBounceCol:{value:u.bounceColor?new t.Color().copy(u.bounceColor):G.bounce},uPatch:{value:new t.Vector4(0,0,u.patchMin??.5,400)},uWind:{value:new t.Vector3(Math.cos(ze),Math.sin(ze),6.5)}},j=e=>Object.assign(lo(),{uH:w.uH,uTime:w.uTime,uDir:w.uDir,uPx:w.uPx,uMaxPt:w.uMaxPt,uBandK:w.uBandK,uSunDir:w.uSunDir,uSunCol:w.uSunCol,uShadowCol:w.uShadowCol,uBounceCol:w.uBounceCol,uPatch:w.uPatch,uWind:w.uWind},e),ue=e=>({uA:{value:e.uA},uB:{value:e.uB},uC:{value:e.uC},uD:{value:e.uD},uSpin:{value:e.uSpin},uBase:{value:e.uBase},uSk:{value:e.uSk},uAlpha:e.uAlpha,uOmega:{value:e.omega},uSeed:{value:e.seed},uThr:e.uThrU||(e.uThrU={value:0})}),Y={transparent:!0,depthWrite:!1,fog:!0};await h.yield?.();const Ke=ne(64,128),Ie=ne(40,96),He=ne(72,14);await h.yield?.();for(const e of b){const o=e.index===ie||e.index===le,a=new t.ShaderMaterial({...Y,side:t.FrontSide,vertexShader:Xe,fragmentShader:Ze,uniforms:j({...ue(e),uRelief:{value:.11},uTau:{value:2.5}})}),s=new t.Mesh(o?Ie:Ke,a);s.frustumCulled=!1,s.name="tube"+e.index,M.add(s),e.objs.push(s),e.tube=s}if(await h.yield?.(),u.spray!==!1)for(const e of b){const o=new t.ShaderMaterial({...Y,side:t.DoubleSide,vertexShader:to,fragmentShader:ao,uniforms:j({...ue(e),uSpinS:{value:0}})}),a=new t.Mesh(He,o);a.frustumCulled=!1,a.name="skirt"+e.index,M.add(a),e.objs.push(a),e.skirt=a}await h.yield?.();const he=new t.PlaneGeometry(2,2),Ee=[110,120,150,70,160,90];if(u.fringe!==!1)for(const e of b){const o=Math.max(12,Math.round(Ee[e.index]*F)),a=new t.InstancedBufferGeometry;a.index=he.index,a.setAttribute("position",he.getAttribute("position"));const s=new Float32Array(o*4),l=new Float32Array(o*4);for(let c=0;c<o;c++)s[c*4]=Math.pow(n(),.8),s[c*4+1]=n(),s[c*4+2]=n.range(.55,1.25),s[c*4+3]=n(),l[c*4]=1/n.range(3.2,7.5),l[c*4+1]=n.range(.5,1.3),l[c*4+2]=n(),l[c*4+3]=n();a.setAttribute("aI",new t.InstancedBufferAttribute(s,4)),a.setAttribute("aJ",new t.InstancedBufferAttribute(l,4)),a.instanceCount=o;const r=new t.ShaderMaterial({...Y,side:t.DoubleSide,vertexShader:eo,fragmentShader:oo,uniforms:j(ue(e))}),i=new t.Mesh(a,r);i.frustumCulled=!1,i.name="rags"+e.index,M.add(i),e.objs.push(i)}await h.yield?.();const Ge=[1160,1160,1400,580,1160,580];if(u.spray!==!1)for(const e of b){const o=Math.max(40,Math.round(Ge[e.index]*F)),a=new Float32Array(o*3),s=new Float32Array(o*4),l=new Float32Array(o*4);for(let m=0;m<o;m++){const P=n(),p=P<.52?0:P<.91?1:2;s[m*4]=n(),s[m*4+1]=n(),s[m*4+2]=n(),s[m*4+3]=n(),l[m*4]=1/(p===1?n.range(1.6,3):n.range(2.4,4.6)),l[m*4+1]=n.range(.7,1.4)*(e.ring/75*.5+.5)*(p===2?1:1.5),l[m*4+2]=p,l[m*4+3]=n()}const r=new t.BufferGeometry;r.setAttribute("position",new t.BufferAttribute(a,3)),r.setAttribute("aI",new t.BufferAttribute(s,4)),r.setAttribute("aJ",new t.BufferAttribute(l,4));const i=new t.ShaderMaterial({...Y,vertexShader:so,fragmentShader:no,uniforms:j(ue(e))}),c=new t.Points(r,i);c.frustumCulled=!1,c.name="sprites"+e.index,M.add(c),e.objs.push(c)}await h.yield?.();const me=[],de=[];for(let e=0;e<$;e++)me.push(new t.Vector4),de.push(new t.Vector4);let te=null;if(u.stains!==!1){const e=[],o=[],a=[];for(let r=0;r<$;r++){const i=r*4;e.push(-1,-1,0,1,-1,0,1,1,0,-1,1,0),o.push(r,r,r,r),a.push(i,i+2,i+1,i,i+3,i+2)}const s=new t.BufferGeometry;s.setAttribute("position",new t.Float32BufferAttribute(e,3)),s.setAttribute("aSp",new t.Float32BufferAttribute(o,1)),s.setIndex(a);const l=new t.ShaderMaterial({...Y,side:t.DoubleSide,vertexShader:ro,fragmentShader:io,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-4,uniforms:j({uStA:{value:me},uStB:{value:de},uSeaY:{value:u.seaY??.35},uDarkCol:{value:A[2].clone().multiplyScalar(.42)},uSargCol:{value:R("#6f5a22",.62)}})});te=new t.Mesh(s,l),te.frustumCulled=!1,te.renderOrder=-2,te.name="stains",M.add(te)}const ve=u.seat||[477,520,-305],pe=u.approach||[70,285,-305],C=new t.Vector3(ve[0]*L,ve[1],ve[2]),ae=new t.Vector3(pe[0]*L,pe[1],pe[2]);function J(e,o,a){const s=o-e.top.x,l=a-e.top.y,r=Math.hypot(s,l)/e.collarR,i=v(.1,.48,r)*(1-v(.6,1,r))+.22*(1-v(0,.32,r)),c=T(S.fbm2(o/120+e.index*7.3,a/120,2)*.9,-.8,.8);return Math.max(e.collarDrop*i*(1+.5*c)+9*(c+.45)*(1-v(.6,1.2,r)),0)}const Oe={uGlowPos:{value:new t.Vector3},uGlowCol:{value:new t.Color(0,0,0)},uBar:{value:new t.Vector4(1,0,0,1)},uLitK:{value:1},uBarK:{value:0},uFormK:{value:0}};if(u.collars!==!1)for(const e of b){const o=e.index===4,a=e.collarR*1.5,r=ne(o?112:56,o?30:12),i=r.getAttribute("position"),c=new Float32Array(i.count*3),m=new Float32Array(i.count*2);for(let f=0;f<i.count;f++){const N=i.getX(f)*Math.PI*2,D=Math.pow(i.getY(f),.85)*a,B=Math.cos(N)*D,se=Math.sin(N)*D,_=e.top.x+B,V=e.top.y+se,W=J(e,_,V),k=3,Z=-(J(e,_+k,V)-J(e,_-k,V))/(2*k),K=-(J(e,_,V+k)-J(e,_,V-k))/(2*k),ee=1/Math.hypot(Z,1,K);i.setXYZ(f,B,-W+3,se),c[f*3]=Z*ee,c[f*3+1]=-ee,c[f*3+2]=K*ee;const ce=D/e.collarR;m[f*2]=T(Math.max(1-v(.7,1.4,ce+.5*S.fbm2(_/150+9,V/150,2)),v(3,20,W)),0,1)*(1-v(.88,1,D/a)),m[f*2+1]=T(W/Math.max(e.collarDrop*1.15,45),0,1),f%300===299&&await h.yield?.()}r.setAttribute("normal",new t.BufferAttribute(c,3)),r.setAttribute("aK",new t.BufferAttribute(m,2));const P=new t.Vector3(e.top.x,g,e.top.y),p=new t.ShaderMaterial({...Y,side:t.DoubleSide,vertexShader:Le,fragmentShader:Re,uniforms:j({uIndigo:{value:A[4].clone().lerp(A[5],.28).multiplyScalar(.92)},uOff:{value:P},uRc:{value:e.collarR},...Oe})}),y=new t.Mesh(r,p);y.position.copy(P),y.frustumCulled=!1,y.renderOrder=-1,y.name="collar"+e.index,M.add(y),e.collar=y,await h.yield?.()}const z=new t.Vector2(C.x-ae.x,C.z-ae.z).normalize();function Q(e,o){const a=e-C.x,s=o-C.z,l=a*z.x+s*z.y,r=-a*z.y+s*z.x,i=Math.hypot(l,r),c=T(S.fbm2(e/120+51.3,o/120,2)*.9,-.8,.8),m=Math.sqrt(Math.min(Math.hypot(S.n2(e/88+3.3,o/88+1.7),.06)*1.7,1)),P=Math.exp(-Math.pow((i-100)/62,2))*(118+26*v(-40,90,l)),p=52*Math.exp(-Math.pow(i/70,2)),y=1-Math.exp(-Math.pow(r/62,2))*(1-v(-55,25,l)),f=T(-l/300,0,1),N=Math.abs(r)-(118+50*f),D=(1-v(10,50,l))*(112-62*f)*Math.exp(-Math.pow(N/(58-14*f),2))*(1-v(.8,1,f)),B=Math.max(P,D)+p;return Math.max(B*y*(1+.38*c)+(7*(c+.45)+20*(m-.6))*v(8,40,B*y),0)}let I=null;if(u.collars!==!1&&u.bay!==!1){const r=ne(60,55),i=r.getAttribute("position"),c=new Float32Array(i.count*3),m=new Float32Array(i.count*2);for(let f=0;f<i.count;f++){const N=i.getX(f),D=i.getY(f),B=H(250,-300,D),se=(N*2-1)*300,_=z.x*B-z.y*se,V=z.y*B+z.x*se,W=C.x+_,k=C.z+V,Z=Q(W,k),K=3,ee=-(Q(W+K,k)-Q(W-K,k))/(2*K),ce=-(Q(W,k+K)-Q(W,k-K))/(2*K),Pe=1/Math.hypot(ee,1,ce);i.setXYZ(f,_,-Z+3,V),c[f*3]=ee*Pe,c[f*3+1]=-Pe,c[f*3+2]=ce*Pe;const Ue=Math.min(N,1-N,D,1-D);m[f*2]=v(4,24,Z)*v(0,.07,Ue),m[f*2+1]=T(Z/130,0,1),f%150===149&&await h.yield?.()}r.setAttribute("normal",new t.BufferAttribute(c,3)),r.setAttribute("aK",new t.BufferAttribute(m,2));const P=new t.Vector3(C.x,g,C.z),p=new t.Color(u.lanternColor??"#BFF3EE").multiplyScalar(.13),y=new t.ShaderMaterial({...Y,side:t.DoubleSide,vertexShader:Le,fragmentShader:Re,uniforms:j({uIndigo:{value:A[4].clone().lerp(A[5],.28).multiplyScalar(.92)},uOff:{value:P},uRc:{value:230},uGlowPos:{value:new t.Vector3(0,C.y-g,0)},uGlowCol:{value:p},uBar:{value:new t.Vector4(z.x,z.y,-105,46)},uLitK:{value:.8},uBarK:{value:1.5},uFormK:{value:1}})});I=new t.Mesh(r,y),I.position.copy(P),I.frustumCulled=!1,I.renderOrder=-.9,I.name="portal-bay",M.add(I),await h.yield?.()}let De=!1,ke=0;function we(e){ke=e;const o=b[ie]?.life,a=b[le]?.life;if(o){const s=v(d.rope,d.gone,e);o.thin=H(H(1,.32,v(d.thin,d.rope,e)),.14,s),o.kink=v(d.kink,d.kink+.035,e)*(1-.55*s),o.foot=15+(g-15)*Math.pow(s,1.5),o.taper=v(d.rope-.03,d.rope+.01,e),o.spray=1-v(d.rope-.04,d.gone-.02,e),o.stain=1-.8*v(d.gone-.03,d.gone+.14,e),o.arms=1-v(d.gone-.02,d.gone+.16,e),o.alpha=1-v(d.gone-.012,d.gone+.008,e)}if(a){const s=v(d.finger,d.down,e);a.stain=v(d.spot,d.spot+.07,e),a.arms=v(d.spot+.04,d.ring+.02,e),a.spray=v(d.ring,d.ring+.08,e),a.foot=g-(g-15)*s,a.taper=1-v(d.down-.02,d.down+.05,e),a.thin=H(.6,1,v(d.down-.1,d.down+.1,e)),a.kink=0,a.alpha=v(d.finger,d.finger+.02,e)}}we(0);const X=Math.PI*2,Me=["foot","thin","kink","taper","spray","stain","arms","alpha"],je=new t.Vector2;function ge(e){for(const o of b){let a=o.life;if(o.forced){a=o.eff;for(let l=0;l<Me.length;l++){const r=Me[l],i=o.forced[r];a[r]=i!==void 0?i:o.life[r]}}o.base.set(o.home.x+o.walkA*Math.sin(o.walkF[0]*e+o.walkP[0]),o.home.y+o.walkA*Math.cos(o.walkF[1]*e+o.walkP[1])),o.uA.set(o.top.x-o.base.x,o.top.y-o.base.y,a.foot,a.taper),o.uB.set(o.b1*Math.cos(o.bf[0]*e+o.bp[0]),o.b1*Math.sin(o.bf[1]*e+o.bp[1]),o.b2*Math.cos(o.bf[2]*e+o.bp[2]),o.b2*Math.sin(o.bf[3]*e+o.bp[3])),o.uC.set(o.waist,o.trumpet,a.kink*46,a.thin),o.uD.set(Math.cos(o.kinkDir),Math.sin(o.kinkDir),o.braids,o.seed),o.uSpin.set(o.omega*e%X,o.omega*1.23*e%X,o.omega*.81*e%X),o.uThrU&&(o.uThrU.value=o.omega*.3*e%X),o.uSk.set(o.waist*1.16*Math.max(a.thin,.35),o.ring,o.crown,a.spray),o.uBase.copy(o.base),o.uAlpha.value=a.alpha,o.skirt&&(o.skirt.material.uniforms.uSpinS.value=o.omega*.3*e%X);for(const l of o.objs)l.position.set(o.base.x,0,o.base.y);const s=a.alpha>.004&&a.foot<g-10;for(const l of o.objs)l.visible=l===o.tube?s:l.isPoints||l===o.skirt?a.spray>.01:s;me[o.index].set(o.base.x,o.base.y,o.stainR,a.stain),de[o.index].set(o.ring,a.arms,a.spray,(-Ce*.11*e+o.seed)%X)}}function Ne(e,o,a=new t.Vector4){const s=b[e],l=s.uA,r=s.uB,i=s.uC,c=s.uD,m=T(o/g,0,1),P=Math.max(1-2*Math.sqrt((m-.5)*(m-.5)+.0012),0),p=l.x*m+r.x*Math.sin(Math.PI*m)+r.z*Math.sin(2*Math.PI*m)+c.x*i.z*P,y=l.y*m+r.y*Math.sin(Math.PI*m)+r.w*Math.sin(2*Math.PI*m)+c.y*i.z*P,f=i.x*i.w,N=Math.max(g-o,0),D=.58*Math.exp(-N/38)+.42*Math.exp(-N/78);let B=f*(1+.16*Math.exp(-o/50))+Math.max(i.y*H(1,i.w,.6)-f,0)*D;return B*=H(1,.04+.96*v(0,70,o-l.z),l.w),a.set(s.base.x+p,o,s.base.y+y,B)}let Be=0;const xe=new t.Vector4,ye=[0,1,2,3,4,5],be=[0,0,0,0,0,0];function Ye(e,o,a){Be=o,De||we(o/44%1),w.uTime.value=o,w.uPatch.value.x=o*8.5,w.uPatch.value.y=o*3.5;let s=450;h.renderer?.getDrawingBufferSize&&(s=h.renderer.getDrawingBufferSize(je).y||450);const l=a?.projectionMatrix?a.projectionMatrix.elements[5]:1.664;if(w.uPx.value=.5*s*l,w.uMaxPt.value=Math.min(.18*s,160),ge(o),a?.matrixWorld){const r=a.matrixWorld.elements,i=M.matrixWorld.elements,c=r[12]-i[12],m=T(r[13]-i[13],0,g),P=r[14]-i[14];for(let p=0;p<$;p++)Ne(p,m,xe),ye[p]=p,be[p]=Math.hypot(xe.x-c,xe.z-P);ye.sort((p,y)=>be[p]-be[y]);for(let p=0;p<$;p++){const y=b[ye[p]].objs;for(let f=0;f<y.length;f++)y[f].renderOrder=-.01*p}}}ge(0);const x=(e,o,a)=>new t.Vector3(e*L,o,a),Se=[x(0,12,930),x(0,12,730),x(-35,35,550),x(40,35,320),x(-5,30,90),x(-30,30,-220)];for(let e=1;e<=15;e++){const o=e/15*2.5*Math.PI,a=H(100,85,e/15),s=H(30,ae.y,e/15);Se.push(x(70-a*Math.cos(o),s,-220-a*Math.sin(o)))}Se.push(C.clone());const Te=new t.Vector3().subVectors(C,ae).normalize(),$e={origin:new t.Vector3(0,0,Qe),sisters:b.map(e=>({base:new t.Vector3(e.home.x,0,e.home.y),top:new t.Vector3(e.top.x,g,e.top.y),waist:e.waist*2,ring:e.ring*2})),portalSeat:{position:C.clone(),normal:Te.clone().negate(),direction:Te.clone(),radius:u.portalRadius??10},flyThrough:Se,entry:x(0,12,930),closePass:{position:x(-5,30,90),target:x(65,45,80)},helixCentre:x(70,0,-220),viewpoints:[{position:x(0,12,930),target:x(0,180,300)},{position:x(-35,35,560),target:x(55,60,540)},{position:x(-5,30,100),target:x(65,60,70)},{position:x(70,215,-130),target:x(40,120,-320)},{position:ae.clone().lerp(C,.45),target:C.clone()}]},qe={object:M,radius:E?E.radius:440,height:E?E.height:g,center:E?new t.Vector3(...E.center):new t.Vector3(0,230,0),anchors:$e,sisters:b,spineAt:Ne,update:Ye,PATCH_GLSL:q+U,patchUniforms:{uPatch:w.uPatch},uniforms:w,get progress(){return ke},setProgress(e){De=!0,we(T(e,0,1))},setLife(e,o){b[e]&&(b[e].forced=o||null,ge(Be))},setLight(e={}){e.sunDir&&w.uSunDir.value.copy(e.sunDir).normalize(),e.sunColor&&w.uSunCol.value.copy(e.sunColor),e.shadowColor&&w.uShadowCol.value.copy(e.shadowColor),e.bounceColor&&w.uBounceCol.value.copy(e.bounceColor),e.patchMin!==void 0&&(w.uPatch.value.z=e.patchMin)},collarHeight(e,o,a){return g+3-J(b[e],o,a)},bayHeight(e,o){return g+3-(I?Q(e,o):0)},bay:I,bayBar:new t.Vector4(z.x,z.y,-105,46),dispose(){he.dispose()},ground:!0,groundY:-.5};return M.userData.hero=qe,qe}export{co as buildHero};
