import*as e from"three";import{clamp as Le,lerp as J,smoothstep as I,makeRng as f0,hashSeed as u0}from"../kit/core.js";const m0=["#EDE6D2","#B3122E","#0B6E86","#031B2A","#F29AB2","#E8C23A","#5CFFE6"],Jt=16,Qt=49.2,qe=2.4,a0=15,ze=84.6,ce=24,Je=22*Math.PI/180,Pt=Math.PI*2,Qe=`
float wfgHash(vec3 p){ p = fract(p*0.3183099 + vec3(0.1, 0.2, 0.3)); p *= 17.0; return fract(p.x*p.y*p.z*(p.x + p.y + p.z)); }
float wfgNoise(vec3 x){
  vec3 i = floor(x), f = fract(x); f = f*f*(3.0 - 2.0*f);
  return mix(mix(mix(wfgHash(i), wfgHash(i + vec3(1,0,0)), f.x), mix(wfgHash(i + vec3(0,1,0)), wfgHash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(wfgHash(i + vec3(0,0,1)), wfgHash(i + vec3(1,0,1)), f.x), mix(wfgHash(i + vec3(0,1,1)), wfgHash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float wfgFbm(vec3 p){ return 0.5*wfgNoise(p) + 0.3*wfgNoise(p*2.03 + 3.1) + 0.2*wfgNoise(p*4.1 + 7.7); }
`,Ge=`
uniform vec4 uPrints[${Jt}];
uniform float uPrintAge[${Jt}];
uniform float uTime;
uniform float uGustAmp;
float wfgBare(vec3 p){
  float b = 0.0;
  for (int i = 0; i < ${Jt}; i++) {
    vec4 pr = uPrints[i];
    float a = uPrintAge[i];
    float d = length(p - pr.xyz);
    float k = (1.0 - smoothstep(pr.w*0.7, pr.w*1.12, d))*smoothstep(0.0, 0.12, a)*(1.0 - smoothstep(1.5, 7.0, a));
    b = max(b, k);
  }
  return b;
}
float wfgGust(vec3 p){
  float ph = uTime*0.2 - (p.x + 70.0)/150.0 + 0.035*sin(p.z*0.21 + p.y*0.17);
  float s = 0.5 + 0.5*sin(6.2831853*ph);
  float g = s*s*s*s;
  float f = 0.5 + 0.5*sin(uTime*1.3 + p.x*0.9 + p.z*0.7 + p.y*0.5);
  return uGustAmp*(0.82*g + 0.18*f*f);
}
`,Re=`
#include <fog_pars_vertex>
varying float vFogY;
`,He=`
#include <fog_pars_fragment>
uniform vec4 uFogLow; uniform vec4 uFogUp; varying float vFogY;
// k scales the amount of fog (1 = the scene's own). The pale bones, their plush and the stained halo take a little
// less fog far off (wfgFar), the way a long exposure balanced on bone pulls them out of the water.
vec3 wfgFogK(vec3 col, float k){
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      float f = 1.0 - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
    #else
      float f = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
    vec3 c = mix(fogColor, uFogLow.rgb, uFogLow.a*(1.0 - smoothstep(-0.8, -0.05, vFogY)));
    c = mix(c, uFogUp.rgb, uFogUp.a*smoothstep(-0.04, 0.8, vFogY));      // the paler water overhead (the dome's own rise)
    col = mix(col, c, f*k);
  #endif
  return col;
}
vec3 wfgFog(vec3 col){ return wfgFogK(col, 1.0); }
float wfgFar(float d){ return smoothstep(50.0, 125.0, d); }
`,d0="gl_FragColor.rgb = wfgFog(gl_FragColor.rgb);",p0=`
attribute vec4 aFx;      // fur, ao, kind (0 bone, 1 rock, 2 baleen), height above the bed
attribute float aSway;
varying vec3 vCol; varying vec3 vPos; varying vec3 vN; varying vec4 vFx;
uniform float uTime; uniform vec3 uCamL; uniform float uPx;
${Re}
void main(){
  vec3 p = position;
  float sw = aSway*(0.6 + 0.4*sin(uTime*0.7 + p.x*0.4 + p.z*0.3));
  p += vec3(0.55, 0.35, 0.12*sin(uTime*1.1 + p.x))*sw*(0.5 + 0.5*sin(uTime*0.45 + p.z*0.6 + p.x*0.25));
  // far off a rib is thinner than a pixel: swell the bones by about half a pixel each side so the hoops still read
  float dc = length(uCamL - p);
  p += normal*(dc*uPx*0.55*smoothstep(45.0, 120.0, dc)*step(aFx.z, 0.5));
  vCol = color; vPos = position; vN = normal; vFx = aFx;
  vec4 mvPosition = modelViewMatrix*vec4(p, 1.0);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
  vFogY = normalize(p - uCamL + vec3(0.0, 1e-5, 0.0)).y;
}`,n0=`
uniform vec2 uBedTone;   // knee, top (albedo, by luminance)
vec3 wfgBedTone(vec3 a){
  float l = dot(a, vec3(0.2126, 0.7152, 0.0722)), k = uBedTone.x, w = max(uBedTone.y - uBedTone.x, 1e-3);
  float l2 = k + w*(1.0 - exp(-max(l - k, 0.0)/w));
  return l > k ? a*(l2/l) : a;
}
`,Ue=`
uniform vec3 uKeyDir; uniform vec3 uKey; uniform vec3 uSky; uniform vec3 uBounce; uniform vec3 uShadow; uniform vec3 uCamL;
uniform vec4 uCloud;     // a shadow sliding over the bed: centre x, centre z, half length, strength
float wfgCloud(vec3 p){ float a = (p.x - uCloud.x)/max(uCloud.z, 1.0), b = (p.z - uCloud.y)/max(uCloud.z*0.3, 1.0); return 1.0 - uCloud.w*exp(-(a*a*a*a + b*b)); }
`,v0={noise:Qe,plush:Ge,light:Ue,fogParsVert:Re,fogParsFrag:He,fogFrag:d0,bedTone:n0},w0=`
varying vec3 vCol; varying vec3 vPos; varying vec3 vN; varying vec4 vFx;
uniform vec3 uCrimson; uniform vec3 uCoat; uniform vec3 uPink; uniform vec3 uYellow; uniform vec3 uMatA; uniform vec3 uMatB;
uniform float uMatAmt; uniform float uCrust; uniform float uFurGain; uniform float uFarCut; uniform float uPx; uniform float uChalkTop;
uniform vec4 uOccC; uniform vec3 uOccB; uniform vec3 uOccU;      // the occiput's dome: centre, lateral axis, up-and-forward axis (for its sutures)
${Ue}
${Qe}
${Ge}
${He}
void main(){
  vec3 n = normalize(vN + vec3(0.0, 1e-5, 0.0));
  if (!gl_FrontFacing) n = -n;
  vec3 vd = uCamL - vPos; float vl = length(vd); vec3 v = vd/max(vl, 1e-4);
  float n1 = wfgFbm(vPos*1.1), n2 = wfgNoise(vPos*6.5), n3 = wfgNoise(vPos*21.0);
  float n4 = wfgNoise(vPos*3.7 + 7.0);
  float fine = 1.0 - smoothstep(18.0, 70.0, vl);            // fade the finest grain with distance (no shimmer)
  // bump from the grain
  n = normalize(n + (vec3(n2, n4, n3) - 0.5)*0.35*fine + vec3(0.0, 1e-5, 0.0));
  float kind = vFx.z;
  float rock = 1.0 - smoothstep(0.4, 0.6, abs(kind - 1.0));
  float bal = smoothstep(1.5, 1.9, kind);
  // chalk
  vec3 alb = vCol*(0.80 + 0.22*n1 + 0.07*(n2 - 0.5));
  alb *= 1.0 - 0.30*smoothstep(0.58, 0.82, n3)*fine;                           // pores
  // thin: how thin the bone is in the picture, by the pixel's own footprint (vl*uPx: the units of bone under one pixel, so
  // it holds at every picture size and from every eye). 0 while a rib (0.9 u across) is nine pixels wide or more, 1 where
  // it is two and a half or fewer: there its pixels are shared with the black halo beside it
  float thin = smoothstep(0.10, 0.36, vl*uPx);
  float pit = smoothstep(0.66, 0.76, n4)*smoothstep(0.35, 0.6, n2)*(1.0 - thin);            // worm borings (grain finer than a pixel is left out: it would only speckle a thin bone grey)
  alb = mix(alb, alb*vec3(0.30, 0.40, 0.50), pit*0.85);
  float streak = wfgNoise(vec3(vPos.x*5.0, vPos.y*0.6, vPos.z*5.0));           // weathering streaks
  alb *= 0.90 + 0.14*streak;
  // old-reef crust, in relief: fist-sized pale coral buds and small clumps of dull sponge, gathered in zones, each
  // standing off the bone (the normal is pushed by the gradient of its height, so tops catch the light and the
  // undersides shade) with a dark skirt where it meets the chalk. Chalk stays the largest surface.
  // (it lies in two or three zones to a rib, a few units long, chalk between them: the low-frequency mask zone; all
  // its edges are soft and ragged, shaped by fbm, never by one octave's lattice)
  float crustOn = uCrust*(1.0 - rock)*(1.0 - bal)*(1.0 - 0.85*clamp(kind*3.3, 0.0, 1.0));      // (the occiput's dome stays one smooth chalk surface)
  float zone = smoothstep(0.47, 0.60, wfgFbm(vPos*0.24 + 31.0) + 0.04*(n4 - 0.5));
  crustOn *= zone;
  float cz = wfgFbm(vPos*0.55 + 23.0);
  float budH = smoothstep(0.58, 0.84, wfgNoise(vPos*1.6 + 11.0) + 0.10*(n2 - 0.5))*smoothstep(0.42, 0.56, cz)*crustOn;
  float spgH = smoothstep(0.26, 0.58, wfgFbm(vPos*0.95 + 5.0)*(0.55 + 0.45*wfgNoise(vPos*2.3 + 9.0))*1.5 + 0.06*(n2 - 0.5))*(1.0 - smoothstep(0.44, 0.58, cz))*crustOn;
  float hc = budH + 0.4*spgH;
  vec3 dpx = dFdx(vPos), dpy = dFdy(vPos);
  vec3 r1 = cross(dpy, n), r2 = cross(n, dpx);
  float det = dot(dpx, r1);
  vec3 grad = (dFdx(hc)*r1 + dFdy(hc)*r2)*(det < 0.0 ? -1.0 : 1.0);
  n = normalize(n - grad*(0.24*(1.0 - smoothstep(16.0, 50.0, vl))/max(abs(det), 1e-10)) + vec3(0.0, 1e-5, 0.0));
  vec3 budCol = mix(uPink, vec3(0.80, 0.76, 0.72), 0.22 + 0.34*n3)*(0.82 + 0.30*n2);
  alb = mix(alb, budCol, smoothstep(0.05, 0.6, budH)*0.6);
  alb *= 1.0 - 0.10*smoothstep(0.02, 0.25, budH)*(1.0 - smoothstep(0.25, 0.7, budH));
  float pore = smoothstep(0.60, 0.74, wfgNoise(vPos*17.0 + 3.0))*fine;
  alb = mix(alb, uYellow*0.50*(0.80 + 0.4*n2)*(1.0 - 0.5*pore), smoothstep(0.05, 0.7, spgH)*0.47);
  alb *= 1.0 - 0.04*smoothstep(0.02, 0.2, spgH)*(1.0 - smoothstep(0.2, 0.5, spgH));
  // bacterial mat climbing from the bed, and its tide line
  // (kind 0 .. 0.4 on a bone marks a foot that keeps a broad, ragged band of mat in every age: the skull's dome)
  float mb = clamp(kind*3.3, 0.0, 1.0)*(1.0 - rock)*(1.0 - bal);
  float h = vFx.w;
  // the dome near the lens: finer pores (within 20 u), and three fine sutures (one up the middle above the foramen,
  // two running down and out from it), never thinner than a pixel and a third, gone by 60 u
  float nearK = (1.0 - smoothstep(8.0, 20.0, vl))*mb;
  float n5 = wfgNoise(vPos*74.0);
  alb *= 1.0 - 0.24*smoothstep(0.60, 0.84, n5)*nearK;
  n = normalize(n + (vec3(n5, wfgNoise(vPos*74.0 + 5.0), n3) - 0.5)*0.16*nearK + vec3(0.0, 1e-5, 0.0));
  vec3 od = vPos - uOccC.xyz;
  float ox = dot(od, uOccB), oy = dot(od, uOccU);
  float s1 = ox + 0.10*sin(oy*7.0 + 1.3) + 0.04*sin(oy*19.0);
  float s2 = (oy - 1.75) + 0.42*abs(ox) + 0.08*sin(ox*8.0) + 0.035*sin(ox*21.0 + 2.0);
  float w1 = max(0.020, 1.3*fwidth(s1)), w2 = max(0.020, 1.3*fwidth(s2));
  float sut = max((1.0 - smoothstep(w1*0.4, w1, abs(s1)))*smoothstep(0.95, 1.25, oy), (1.0 - smoothstep(w2*0.4, w2, abs(s2)))*smoothstep(0.10, 0.30, abs(ox))*(1.0 - smoothstep(3.9, 4.4, abs(ox))));
  sut *= mb*uOccC.w*(1.0 - smoothstep(30.0, 60.0, vl));
  alb *= 1.0 - 0.50*sut;
  float mAmt = max(uMatAmt, 1.5*mb)*mix(1.0, smoothstep(0.14, 0.30, vFx.y), mb);      // (no mat inside the foramen: the hollow stays dark)
  float mt = (1.0 - smoothstep(mix(0.1, 0.55, mb), mix(1.5, 1.25, mb), h*mix(1.0, 0.50, mb) + (n1 - 0.5)*mix(2.2, 1.5, mb) + (n4 - 0.5)*0.8*mb + (n2 - 0.5)*0.22*mb))*mAmt;      // (on the dome the band climbs higher, and its edge is crisp and ragged)
  vec3 matCol = mix(uMatA, uMatB, smoothstep(0.42, 0.62, wfgNoise(vPos*0.8 + 3.0)));
  matCol = mix(matCol, mix(uMatA*1.22, uMatB*vec3(1.70, 1.36, 0.50), smoothstep(0.34, 0.56, wfgNoise(vPos*1.1 + 13.0))), mb);      // the dome's band: whiter whites, stronger sulphur
  float mtE = clamp(mt, 0.0, 1.0);
  alb = mix(alb, matCol*(0.75 + 0.3*n2), mtE*mix(0.85, 0.97, mb));
  alb *= 1.0 - 1.6*mb*mtE*(1.0 - mtE);                                         // a thin shade along the band's ragged edge: the mat lies on the bone
  // where the mat lies thick over the dome (the white fall) the dome still reads as bone: its sutures show through
  // the mat, fainter, thin sulphur stains gather in soft patches, and the mat sinks grey into the dome's shallow dimples
  alb *= 1.0 - 0.34*sut*mtE;
  float dstain = smoothstep(0.50, 0.72, wfgFbm(vPos*0.62 + 41.0) + 0.08*(n2 - 0.5))*mb*mtE;
  alb = mix(alb, uMatB*vec3(1.45, 1.22, 0.58)*(0.72 + 0.3*n2), dstain*0.30);
  alb *= 1.0 - 0.16*smoothstep(0.52, 0.70, wfgFbm(vPos*1.7 + 77.0))*mb*mtE*(1.0 - dstain);
  float tide = (h - 1.5 - n1*1.6)/0.22; tide = exp(-tide*tide)*min(mAmt, 1.0);
  alb = mix(alb, matCol*0.8, tide*0.5);
  alb *= 1.0 - 0.30*mb*(1.0 - smoothstep(0.0, 0.5, vFx.w));                    // the band darkens where it meets the silt
  alb = mix(alb, vec3(0.030, 0.040, 0.046)*(0.5 + 1.1*n1 + 0.5*n3), rock);
  alb = mix(alb, vec3(0.030, 0.027, 0.024)*(0.5 + 1.0*streak), bal);
  // light: one cold key from above, sky and bounce as a hemisphere, blue in every hollow
  float ndl = dot(n, uKeyDir);
  float key = smoothstep(-0.30, 1.0, ndl); key *= key;
  // far off a hoop is a pixel or two wide: its lit top and its shaded flank cannot be told apart, so it takes their mean
  float far = wfgFar(vl)*(1.0 - rock)*(1.0 - bal);
  key = mix(key, max(key, 0.60), far);
  // a thin bone keeps the brightness of its lit top: where it is a pixel or two wide (thin) its light is that of a face
  // turned up to the key, without contact shade, so the line does not grey out against the halo; no bone is thicker for it
  float thinB = thin*(1.0 - rock)*(1.0 - bal);
  key = mix(key, max(key, 0.88), thinB);
  key *= wfgCloud(vPos);
  float ao = mix(vFx.y, max(vFx.y, 0.8), far); ao = mix(ao, max(ao, 0.95), thinB);
  vec3 hemi = mix(uBounce, uSky, smoothstep(-1.0, 1.0, n.y));
  vec3 hemiW = vec3(dot(hemi, vec3(0.25, 0.5, 0.25)))*1.7;
  // white-balanced on bone: the shaded chalk keeps a hint of warmth instead of taking the water's colour
  vec3 amb = mix(hemi, hemiW*vec3(1.05, 1.0, 0.93), 0.62*(1.0 - rock)*(1.0 - bal));
  vec3 lit = uKey*key*mix(0.45, 1.0, ao) + amb*mix(0.30, 1.0, ao);
  // the long exposure is balanced on bone: a chalk face turned full to the key reaches the design's peak (uChalkTop: the
  // share of the key added there, by the cube of the key, so flanks and hollows keep their tone and the forms their depth)
  lit += uKey*(uChalkTop*key*key*key*ao*(1.0 - rock)*(1.0 - bal));
  vec3 col = alb*lit;
  col = mix(col, uShadow*(0.6 + 0.8*alb.g), (1.0 - ao)*0.35*(1.0 - key));
  float spec = pow(max(dot(reflect(-uKeyDir, n), v), 0.0), 18.0);
  col += uKey*spec*bal*0.12;
  // the plush: a crimson velvet coat with a fuzz rim, bared where an animal has just touched it
  float bare = wfgBare(vPos);
  float gust = wfgGust(vPos);
  // (a deep, matt, mottled coat with a ragged, feathered edge against the chalk, darker than the tuft tips above it)
  float fm = smoothstep(0.40, 0.60, vFx.x*uFurGain + (n2 - 0.5)*0.30 + (n4 - 0.5)*0.16 + (n3 - 0.5)*0.30*fine)*(1.0 - bare)*(1.0 - rock)*(1.0 - bal);
  fm *= mix(0.80 + 0.20*n4, 1.0, 1.0 - fine);
  vec3 fur = mix(uCoat, uCrimson, far)*(0.22 + 0.30*n2 + 0.18*n3*fine + 0.30*gust)*(1.0 + 0.6*far);
  float rim = 1.0 - abs(dot(n, v)); rim = rim*rim;
  vec3 furLit = fur*(uKey*key*0.95 + hemiW)*mix(0.5, 1.0, ao) + mix(uCrimson, uPink, 0.35)*rim*(0.25 + 0.75*key)*(uKey*0.5 + hemi)*0.26;
  col = mix(col, furLit, fm);
  // the edge of a fresh print: chalk shows a touch brighter
  col += alb*uKey*0.06*bare*(1.0 - rock);
  // never clipped: the chalk's light ends in a soft shoulder under 0.9 (the design's peak), the three channels pressed
  // alike so its hint of warmth is kept; nothing of the bone reaches the bloom's threshold
  float mx = max(col.r, max(col.g, col.b));
  col *= mx > 0.78 ? (0.78 + 0.12*(1.0 - exp(-(mx - 0.78)/0.12)))/mx : 1.0;
  gl_FragColor = vec4(wfgFogK(col, 1.0 - uFarCut*wfgFar(vFogDepth)*(1.0 - rock)), 1.0);
}`,g0=`
attribute vec3 iPos; attribute vec3 iNrm; attribute vec4 iDat;   // iDat: size, yaw, seed, shade
varying vec3 vCol;
uniform vec3 uCrimson; uniform vec3 uPink; uniform float uPx;
${Ue}
${Ge}
${Re}
void main(){
  vec3 n = normalize(iNrm + vec3(0.0, 1e-5, 0.0));
  vec3 ax = abs(n.y) < 0.9 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
  vec3 t1 = normalize(cross(n, ax)); vec3 t2 = cross(n, t1);
  float phi = position.x + iDat.y;
  vec3 r = cos(phi)*t1 + sin(phi)*t2;
  vec3 side = cross(n, r);
  float tip = position.y;
  float bare = wfgBare(iPos);
  float gust = wfgGust(iPos);
  float len = iDat.x*(0.75 + 0.5*fract(iDat.z*7.31 + position.x))*(1.0 - 0.94*bare);
  float dist = length(uCamL - iPos);
  float wid = max(0.115*iDat.x, dist*uPx*0.9)*(1.0 - 0.8*bare);
  float spread = 0.42 + 0.38*fract(iDat.z*3.17 + position.x*1.7);
  vec3 dir = n*cos(spread) + r*sin(spread);
  // the current lays the plumes over toward the tail (+X) and they tremble
  vec3 flow = vec3(1.0, 0.12, 0.0);
  flow -= n*dot(flow, n)*0.8;
  float flut = sin(uTime*3.1 + iDat.z*40.0 + position.x*2.0)*0.10 + sin(uTime*1.7 + iPos.x*1.3 + iPos.y)*0.08;
  dir = normalize(dir + flow*(0.18 + 0.95*gust) + side*flut + vec3(0.0, 1e-4, 0.0));
  vec3 p = iPos + n*(dist*uPx*0.55*smoothstep(45.0, 120.0, dist) - 0.03) + side*position.z*wid + dir*len*tip;
  float ndl = dot(normalize(n + dir*0.6*tip), uKeyDir);
  float key = smoothstep(-0.35, 1.0, ndl); key *= key; key *= wfgCloud(iPos);
  vec3 hemi = mix(uBounce, uSky, smoothstep(-1.0, 1.0, n.y + 0.3*tip));
  vec3 c = mix(uCrimson*0.26, mix(uCrimson, uPink, 0.04 + 0.2*gust)*0.88, tip)*(0.55 + 0.4*iDat.w)*(0.7 + 0.5*fract(iDat.z*13.7 + position.x*0.61));
  vec3 hemiW = vec3(dot(hemi, vec3(0.25, 0.5, 0.25)))*1.7;
  vCol = c*(uKey*key*0.86 + hemiW*1.08 + 0.04)*(1.0 + 0.35*smoothstep(50.0, 125.0, dist));
  vec4 mvPosition = modelViewMatrix*vec4(p, 1.0);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
  vFogY = normalize(p - uCamL + vec3(0.0, 1e-5, 0.0)).y;
}`,b0=`
varying vec3 vCol; uniform float uFarCut;
${He}
void main(){ gl_FragColor = vec4(wfgFogK(vCol, 1.0 - uFarCut*wfgFar(vFogDepth)), 1.0); }`,y0=`
attribute vec2 aLife;    // born (seconds), length (seconds)
attribute float aSize;
varying float vA;
uniform float uTime; uniform float uPxScale;
void main(){
  float a = (uTime - aLife.x)/max(aLife.y, 0.05);
  vA = a > 0.0 && a < 1.0 ? sin(3.14159*sqrt(clamp(a, 0.0, 1.0))) : 0.0;
  vec4 mv = modelViewMatrix*vec4(position, 1.0);
  gl_Position = projectionMatrix*mv;
  gl_PointSize = vA > 0.0 ? clamp(aSize*uPxScale/max(-mv.z, 0.2), 2.5, 28.0) : 0.0;
}`,x0=`
varying float vA; uniform vec3 uSpark;
void main(){
  vec2 q = gl_PointCoord - 0.5; float d = dot(q, q)*4.0;
  float s = (1.0 - smoothstep(0.0, 1.0, d)); s *= s;
  gl_FragColor = vec4(uSpark*s*vA, 1.0);
}`,M0=`
attribute vec3 aBed;     // halo 0..1, edge fade 0..1, rock 0..1
varying vec3 vPos; varying vec3 vN; varying vec3 vBed;
uniform vec3 uCamL;
${Re}
void main(){
  vPos = position; vN = normal; vBed = aBed;
  vec4 mvPosition = modelViewMatrix*vec4(position, 1.0);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
  vFogY = normalize(position - uCamL + vec3(0.0, 1e-5, 0.0)).y;
}`,k0=`
varying vec3 vPos; varying vec3 vN; varying vec3 vBed;
uniform vec3 uSilt; uniform vec3 uMatA; uniform vec3 uMatB; uniform float uMatAmt; uniform float uTime; uniform float uFarCut; uniform vec4 uPale;
${Ue}
${Qe}
${n0}
${He}
void main(){
  vec3 q = vec3(vPos.x, 0.0, vPos.z);
  float n1 = wfgFbm(q*0.22), n2 = wfgNoise(q*1.7 + 4.0), n3 = wfgNoise(q*7.0);
  if (vBed.y < 0.02 + 0.5*n1 + 0.25*n2) discard;                 // ragged edge so the world's own floor takes over
  float vl = length(uCamL - vPos);
  // current ripples, crests 2 u apart, running across the flow
  float rp = vPos.x*3.14159 + (n1 - 0.5)*7.0 + sin(vPos.z*0.35)*1.2;
  float rip = sin(rp), ripd = cos(rp);
  float ripAmt = (1.0 - smoothstep(30.0, 110.0, vl))*(1.0 - vBed.z);
  vec3 n = normalize(vN + vec3(-ripd*0.33*ripAmt, 0.0, (n2 - 0.5)*0.30*ripAmt) + vec3(0.0, 1e-5, 0.0));
  // the stain is a living mat, not a painted patch: its outline runs out in tongues (n0), it feathers into the silt
  // over several units (the squared ramp), and inside it is mottled, with silt showing through in windows
  float n0 = wfgFbm(q*0.075 + 17.0), n5 = wfgNoise(q*0.5 + 40.0);
  float nearK = 1.0 - smoothstep(22.0, 60.0, vl);                  // 1 under the lens, 0 seen from the approach
  float halo = clamp(vBed.x*1.15 + (n1 - 0.5)*0.5 + (n2 - 0.5)*mix(0.05, 0.16, nearK) + (n0 - 0.5)*0.55, 0.0, 1.0);
  halo = smoothstep(0.04, 0.85, halo);
  vec2 dpl = (vPos.xz - uPale.xy)/max(uPale.z, 1.0);
  float pale = 1.0 + uPale.w*exp(-dot(dpl, dpl));
  vec3 alb = uSilt*(0.72 + 0.4*n1 + 0.12*n3 + 0.07*rip*ripAmt)*pale;
  float farB = wfgFar(vl);
  // from the approach the stain is one calm dark shape (a velvet of sulphide black, a little olive where the mat is
  // thick); under the lens it keeps its mottle and its windows of silt
  float stain = halo*halo*(3.0 - 2.0*halo)*mix(0.94, 0.74 + 0.26*smoothstep(0.28, 0.62, n5 + 0.2*(n2 - 0.5)), nearK);
  vec3 stainCol = mix(vec3(0.018, 0.026, 0.034), vec3(0.060, 0.066, 0.056), smoothstep(0.35, 0.8, n1 + 0.4*(n5 - 0.5)))*mix(0.95 + 0.25*n2, 0.6 + 0.8*n2 + 0.5*n3, nearK);
  alb = mix(alb, stainCol, stain*mix(0.92, 0.86, farB));          // sulphide-black stain
  // the mat's own texture: a fine net of paler wrinkles over the black, strongest where the mat is thickest
  float wr = abs(wfgNoise(q*1.25 + 61.0) - 0.5) + 0.5*abs(wfgNoise(q*2.9 + 5.0) - 0.5);
  alb += vec3(0.030, 0.037, 0.036)*(1.0 - smoothstep(0.03, 0.14, wr))*stain*(1.0 - smoothstep(70.0, 150.0, vl));
  // mat lace: clumps of white and sulphur mat with frayed, filamentous edges, thickest round the rim of the stain
  vec3 qw = q + (vec3(n2, 0.0, n1) - 0.5)*1.6;
  float p1 = wfgFbm(qw*0.42 + 9.0);
  float w1 = wfgNoise(qw*1.9 + 4.0), w3 = wfgNoise(qw*4.3 + 21.0);
  float near = 1.0 - smoothstep(24.0, 95.0, vl);
  float rimBand = smoothstep(0.04, 0.3, halo)*(1.0 - mix(0.94*smoothstep(0.40, 0.72, halo), 0.7*smoothstep(0.55, 0.95, halo), nearK));
  float core = smoothstep(0.57, 0.64, p1 + 0.05*(n3 - 0.5));
  float fringe = smoothstep(0.44, 0.56, p1)*(1.0 - core);
  float fil = (1.0 - smoothstep(0.02, 0.07, abs(w1 - 0.5)))*smoothstep(0.35, 0.6, w3)*near;
  float speck = smoothstep(0.80, 0.86, w3)*near;
  float shim = 0.88 + 0.12*sin(uTime*0.8 + w1*20.0);
  float lace = max(core*(0.75 + 0.25*w3), fringe*max(fil, speck*0.8))*rimBand*uMatAmt*shim;
  // the stain's pale outline: a ragged band of sulphur-white mat along its edge, drawn whole from far off so the black
  // shape has a light, unbroken rim at range
  float edge = smoothstep(0.02, 0.15, halo)*(1.0 - smoothstep(0.24, 0.52, halo));
  float edgeK = mix(0.64 + 0.36*smoothstep(0.22, 0.60, p1 + 0.18*(n2 - 0.5)), 0.22 + 0.78*smoothstep(0.26, 0.66, p1 + 0.30*(n2 - 0.5) + 0.22*(n3 - 0.5)), nearK);
  lace = max(lace, edge*edgeK*mix(0.78, 1.0, farB)*clamp(uMatAmt*1.3, 0.0, 1.0)*shim);
  vec3 matCol = mix(uMatA, mix(uMatA, uMatB, 0.55), smoothstep(0.46, 0.64, wfgNoise(q*0.21 + 3.0)));      // white, warming to pale sulphur in places
  alb = mix(alb, matCol*(0.6 + 0.4*n3), clamp(lace, 0.0, 1.0)*0.85);
  alb = wfgBedTone(alb);                                          // the bed's tone: silt, rims and mat keep under the chalk (the clams below are animals, not bed)
  // small animals on the mat: white clams, singly and in little beds, each a pale oval with a dark gape, sitting in the
  // black just inside the rim (one to a cell of a jittered grid, most cells empty)
  vec2 cq = vPos.xz*0.9 + (vec2(n2, n1) - 0.5)*0.5;
  vec2 ci = floor(cq), cf = fract(cq) - 0.5;
  float ch = wfgHash(vec3(ci, 7.0)), ch2 = wfgHash(vec3(ci, 19.0));
  vec2 co = (vec2(ch2, wfgHash(vec3(ci, 31.0))) - 0.5)*0.5;
  float ca = ch*6.2831853; vec2 cd = cf - co; cd = vec2(cos(ca)*cd.x + sin(ca)*cd.y, cos(ca)*cd.y - sin(ca)*cd.x);
  float cr = length(cd*vec2(1.0, 1.55))/(0.15 + 0.10*ch2);
  float bedK = smoothstep(0.45, 0.62, wfgNoise(q*0.16 + 27.0));                // the clams gather in beds
  float clamOn = step(0.86 - 0.34*bedK, ch)*smoothstep(0.22, 0.42, halo)*(1.0 - smoothstep(0.80, 0.97, halo))*(1.0 - smoothstep(45.0, 100.0, vl))*(1.0 - vBed.z);
  float clam = (1.0 - smoothstep(0.75, 1.0, cr))*clamOn;
  alb = mix(alb, vec3(0.50, 0.50, 0.46)*(0.75 + 0.35*ch2)*(1.0 - 0.35*smoothstep(0.3, 1.0, cr)), clam);
  alb *= 1.0 - 0.75*clam*(1.0 - smoothstep(0.03, 0.10, abs(cd.y)))*(1.0 - smoothstep(0.5, 0.8, abs(cd.x)/(0.15 + 0.10*ch2)));      // the gape
  alb *= 1.0 - 0.45*clamOn*smoothstep(0.85, 1.05, cr)*(1.0 - smoothstep(1.05, 1.5, cr));                                             // the dent it sits in
  vec3 bas = vec3(0.030, 0.040, 0.046)*(0.5 + 1.1*n1 + 0.5*n3);
  bas = wfgBedTone(mix(bas, uSilt*(0.66 + 0.36*n1 + 0.1*n3)*pale, smoothstep(0.22, 0.6, n2 + 0.3*n3)*0.8));      // silt lies in drifts on the rock of the slope
  alb = mix(alb, bas, vBed.z);
  float ndl = dot(n, uKeyDir);
  float key = smoothstep(-0.2, 1.0, ndl); key *= key; key *= wfgCloud(vPos);
  vec3 hemi = mix(uBounce, uSky, smoothstep(-1.0, 1.0, n.y));
  vec3 col = alb*(uKey*key + hemi);
  gl_FragColor = vec4(wfgFogK(col, 1.0 - uFarCut*wfgFar(vFogDepth)*max(halo, clamp(lace, 0.0, 1.0))*(1.0 - vBed.z)), 1.0);
}`,h=[1,1,0,1,0];class t0{constructor(){this.p=[],this.a=[],this.i=[],this.n=0}v(N,u,a){return this.p.push(N,u,a),this.a.push(h[0],h[1],h[2],h[3],h[4]),this.n++}}function Pe(r,N,u,a=0){const M=N.length,F=N[0].length/3,W=r.n,ot=r.i.length;let X=0,Q=0,pt=0;for(let k=0;k<M;k++){const P=N[k];for(let v=0;v<F;v++)u(k/(M-1),v/F,k,v),r.v(P[v*3],P[v*3+1],P[v*3+2]),X+=P[v*3],Q+=P[v*3+1],pt+=P[v*3+2]}X/=M*F,Q/=M*F,pt/=M*F;for(let k=0;k<M-1;k++)for(let P=0;P<F;P++){const v=W+k*F+P,f=W+k*F+(P+1)%F,n=v+F,o=f+F;r.i.push(v,f,o,v,o,n)}for(let k=0;k<2;k++){const P=N[k?M-1:0];let v=0,f=0,n=0;for(let p=0;p<F;p++)v+=P[p*3],f+=P[p*3+1],n+=P[p*3+2];u(k,0,k?M-1:0,-1);const o=r.v(v/F,f/F,n/F),B=W+(k?(M-1)*F:0);for(let p=0;p<F;p++){const q=B+p,m=B+(p+1)%F;k?r.i.push(o,q,m):r.i.push(o,m,q)}}let zt=0;const ht=r.p;for(let k=ot;k<r.i.length;k+=3){const P=r.i[k]*3,v=r.i[k+1]*3,f=r.i[k+2]*3,n=ht[P]-X,o=ht[P+1]-Q,B=ht[P+2]-pt,p=ht[v]-X,q=ht[v+1]-Q,m=ht[v+2]-pt,S=ht[f]-X,A=ht[f+1]-Q,K=ht[f+2]-pt;zt+=n*(q*K-m*A)+o*(m*S-p*K)+B*(p*A-q*S)}if(zt<0!=!!a)for(let k=ot;k<r.i.length;k+=3){const P=r.i[k+1];r.i[k+1]=r.i[k+2],r.i[k+2]=P}}const ut=[0,0];function pe(r,N,u,a,M,F,W){const ot=[];for(let X=0;X<=N;X++){const Q=X/N,pt=a(Q),zt=a(Math.max(0,Q-.02)),ht=a(Math.min(1,Q+.02));let k=ht[0]-zt[0],P=ht[1]-zt[1],v=ht[2]-zt[2];const f=Math.sqrt(k*k+P*P+v*v)||1;k/=f,P/=f,v/=f;const n=typeof M=="function"?M(Q):M,o=n[0]*k+n[1]*P+n[2]*v;let B=n[0]-k*o,p=n[1]-P*o,q=n[2]-v*o;const m=Math.sqrt(B*B+p*p+q*q)||1;B/=m,p/=m,q/=m;const S=P*q-v*p,A=v*B-k*q,K=k*p-P*B,U=new Array(u*3);for(let g=0;g<u;g++){const b=F(Q,g/u*Pt,g);U[g*3]=pt[0]+B*b[0]+S*b[1],U[g*3+1]=pt[1]+p*b[0]+A*b[1],U[g*3+2]=pt[2]+q*b[0]+K*b[1]}ot.push(U)}Pe(r,ot,W)}const e0=(r,N)=>{for(let u=1;u<r.length;u++)if(N<=r[u][0])return J(r[u-1][1],r[u][1],(N-r[u-1][0])/Math.max(1e-6,r[u][0]-r[u-1][0]));return r[r.length-1][1]},Ie=(r,N,u,a,M)=>{const F=1-M;return F*F*F*r+3*F*F*M*N+3*F*M*M*u+M*M*M*a};function z0(r){const{NZ:N,M:u,groundH:a,feet:M}=r;function F(k,P,v,f,n,o,B,p=5,q=8){const m=[];for(let S=0;S<p;S++){const A=Math.PI*(.14+.72*S/(p-1)),K=new Array(q*3);for(let U=0;U<q;U++){const g=U/q*Pt,b=Math.sin(A)*Math.cos(g),x=Math.cos(A),H=Math.sin(A)*Math.sin(g),C=1+.2*N.n3(b*1.4+o,x*1.4-o,H*1.4+o*.37);K[U*3]=P[0]+b*v*C,K[U*3+1]=P[1]+x*f*C,K[U*3+2]=P[2]+H*n*C}m.push(K)}Pe(k,m,B)}function W(k,P,v,f,n,o,B,p,q=5,m=6){const S=[[0,.7],[.1,1.08],[.28,.8],[.5,.66],[.72,.8],[.9,1.08],[1,.7]];pe(k,q,m,A=>[J(P[0],v[0],A),J(P[1],v[1],A),J(P[2],v[2],A)],[0,1,0],(A,K)=>{const U=J(f,n,A)*e0(S,A)*(1+.1*N.n2(A*3+B,K));return ut[0]=Math.cos(K)*U*o,ut[1]=Math.sin(K)*U,ut},p)}const ot=[[-.44,.45],[-.5,.88],[-.46,1],[-.35,1],[-.26,.78],[0,.62],[.26,.78],[.35,1],[.46,1],[.5,.88],[.44,.45]];function X(k,P,v,f,n,o){const B=Math.cos(o.roll),p=Math.sin(o.roll),q=Math.cos(o.yaw),m=Math.sin(o.yaw),S=v*.84+o.dy,A=(b,x,H)=>{const C=x*B-H*p,s=x*p+H*B;return u(P,b*q-C*m,b*m+C*q+o.db,S+s+Q(P))},K=[],U=12;for(let b=0;b<ot.length;b++){const x=new Array(U*3),H=ot[b][0]*f,C=ot[b][1]*v;for(let s=0;s<U;s++){const T=s/U*Pt,y=C*(1+.05*Math.sin(s*2.3+o.seed*9)+.04*N.n2(o.seed*5+b,s*.9)),G=A(H,Math.cos(T)*y,Math.sin(T)*y*.94);x[s*3]=G[0],x[s*3+1]=G[1],x[s*3+2]=G[2]}K.push(x)}if(Pe(k,K,(b,x,H,C)=>{const s=H<=1||H>=ot.length-2,T=H===2||H===3||H===7||H===8,y=C<0?0:Math.sin(x*Pt);h[0]=(s?.5:T?1:.82)*(y<-.3?.6:1),h[1]=s?.25:T?.7:1,h[2]=0,h[3]=o.tint,h[4]=0}),n>v*.9)for(let b=-1;b<=1;b+=2){const x=.22-S,H=o.sweep*b,C=n*(b>0?o.wl:o.wr);pe(k,4,6,s=>A(o.back*s*s,b*(v*.62+(C-v*.62)*s),v*.1+(x-v*.1)*Math.pow(s,1.3)+H*s),u(P,1,0,0).map((s,T)=>s-u(P,0,0,0)[T]),(s,T)=>{const y=1+.35*I(.7,1,s);return ut[0]=Math.cos(T)*J(.46,.25,s)*v*y,ut[1]=Math.sin(T)*J(.2,.1,s)*v,ut},s=>{h[0]=.6+.4*s,h[1]=.85,h[2]=0,h[3]=o.tint*.98,h[4]=0})}const g=A(0,0,0);return M.push(g[0],g[2],v+n*.8),A(0,0,v*.95)}const Q=k=>a(k.x,k.z),pt=[[0,.46],[.04,.66],[.1,.36],[.3,.47],[.6,.45],[.85,.31],[1,.15]],zt=[[0,.4],[.05,.5],[.1,.27],[.25,.165],[.6,.145],[1,.095]];function ht(k,P,v,f){const n=f.k,o=.7+.3*n,B=1.25,p=1.55,q=[B,9*o,7.4*o*f.bulge,f.gap],m=[p,.9,10.5*n,f.top*n],S=f.stub?f.stub:1,A=s=>{const T=s*S,y=Ie(q[0],q[1],q[2],q[3],T)-B,G=Ie(m[0],m[1],m[2],m[3],T)-p,Y=-f.lean*Math.pow(T,1.5);if(f.fallen){const rt=u(P,Y+.4-y*.85,v*(B+1.2+G*.98),0);return rt[1]=a(rt[0],rt[2])+.3+.25*Math.sin(T*3),rt}const nt=u(P,Y,v*(B+y),0);return nt[1]=p+G+Q(P),nt},K=u(P,1,0,0),U=u(P,0,0,0),g=f.fallen?[0,1,0]:[K[0]-U[0],0,K[2]-U[2]],b=f.stub?8:24;pe(k,b,8,A,g,(s,T,y)=>{const G=s*S,Y=Math.cos(T),nt=Math.sin(T);let rt=e0(pt,G)*f.thick,Bt=e0(zt,G)*f.thick;if(G>.13&&(rt*=1-.42*Math.max(0,N.n2(G*10+f.seed*31,Y>0?3.3:8.1))*Math.abs(Y)),f.stub&&s>.9){const Ft=.45+.55*((y*7+3)%5)/4;rt*=Ft,Bt*=Ft}const Ct=f.twist*G,_t=Math.cos(Ct),ve=Math.sin(Ct);let te=Y*rt,Et=nt*Bt;if(f.fallen){const Ft=te;te=Et,Et=Ft}return ut[0]=te*_t-Et*ve,ut[1]=te*ve+Et*_t,ut},(s,T)=>{const y=s*S,G=Math.cos(T*Pt);h[0]=.5+.5*I(.02,.22,y),h[1]=(1-.62*G*G*G*G)*(1-.7*I(.6,1,y))*(y<.03?.4:1),h[2]=0,h[3]=f.tint,h[4]=0});const x=A(.03),H=u(P,.3,v*.55,0);F(k,[H[0]+(x[0]-u(P,0,v*B,0)[0]),x[1]-.3,H[2]+(x[2]-u(P,0,v*B,0)[2])],.5*f.thick,.42*f.thick,.5*f.thick,f.seed*13,()=>{h[0]=.55,h[1]=.6,h[2]=0,h[3]=f.tint,h[4]=0},4,6);const C=[];for(let s=0;s<=10;s++){const T=A(s/10);C.push(new e.Vector3(T[0],T[1],T[2])),(f.fallen||s===0)&&M.push(T[0],T[2],1.2)}return C}return{blob:F,bone2:W,vertebra:X,rib:ht}}async function s0(r,N){const u=r.attributes.position.array,a=r.index.array,M=new Float32Array(u.length);for(let F=0;F<a.length;F+=3){const W=a[F]*3,ot=a[F+1]*3,X=a[F+2]*3,Q=u[X]-u[ot],pt=u[X+1]-u[ot+1],zt=u[X+2]-u[ot+2],ht=u[W]-u[ot],k=u[W+1]-u[ot+1],P=u[W+2]-u[ot+2],v=pt*P-zt*k,f=zt*ht-Q*P,n=Q*k-pt*ht;M[W]+=v,M[W+1]+=f,M[W+2]+=n,M[ot]+=v,M[ot+1]+=f,M[ot+2]+=n,M[X]+=v,M[X+1]+=f,M[X+2]+=n,F%9e3===8997&&await N()}for(let F=0;F<M.length;F+=3){const W=Math.hypot(M[F],M[F+1],M[F+2])||1;M[F]/=W,M[F+1]/=W,M[F+2]/=W,F%45e3===44997&&await N()}r.setAttribute("normal",new e.BufferAttribute(M,3))}function P0(r,N){const{NZ:u,M:a,groundH:M,feet:F,rng:W}=r,{blob:ot,bone2:X}=N,Q=(f,n,o)=>Math.exp(-((f-n)/o)*((f-n)/o));async function pt(f,n,o){const B=Math.cos(Je),p=Math.sin(Je),q=M(n.x,n.z)+1.75,m=(l,z,V)=>{const d=l/ce,E=V-o.droop*d*d;return a(n,l*B+E*p,z,q-l*p+E*B)},S=l=>l<3?J(2.3,5.2,I(-.5,3,l)):5.2*Math.pow(Math.max(0,1-(l-3)/21.2),.72)*.94+.2,A=(l,z,V)=>{const d=l/ce,E=z*V,st=Math.abs(z),lt=(2-1.35*d)*st*st*st*(1+.22*u.n2(l*.45+o.seed,z>0?2.2:6.6))*(.22+.78*I(.8,5,l)),St=(1.6-1.05*d)*I(1.2,4,l)*Q(E,0,.55),yt=.34*Q(Math.abs(E),.33*V+.5,.42)*I(4.5,8,l)*(1-d),Lt=2*(1-I(.4,5.2,l))*(1-z*z)*(.8+.3*u.n2(l*.9+3,E*.9+o.seed));return .25*(1-.5*d)+lt+St+yt+Lt},K=(l,z)=>-(.55+1.5*(1-I(0,6,l)))*Math.pow(Math.max(0,1-z*z),.6)*(.3+.7*(1-l/ce)),U=58,g=25,b=11,x=g+b+2,H=[],C=[],s=l=>.42+.58*Math.pow(Math.sin(Math.PI*.5*Le(l/2.6,0,1)),.75),T=(l,z,V)=>{const d=s(l),E=S(l)*d;let st,lt,St,yt;if(z<g){st=-1+2*z/(g-1),lt=A(l,st,E)*d;const Lt=.25*(1-.5*l/ce)*d;St=.32+.68*I(.05,1.1,lt-Lt),yt=1-.75*I(.35,1,lt-Lt)}else z===g||z===x-1?(st=z===g?1:-1,lt=-.14*d,St=.6,yt=.2):(st=1-2*(z-g)/(b+1),lt=K(l,st)*d-.14*d,St=.45,yt=.3);return V[0]=st*E,V[1]=lt,V[2]=St,V[3]=yt,V},y=[0,0,0,0];for(let l=0;l<=U;l++){const z=new Array(x*3),V=1.3+(ce-1.3)*Math.pow(l/U,1.45);for(let d=0;d<x;d++){T(V,d,y);const E=m(V,y[0],y[1]);z[d*3]=E[0],z[d*3+1]=E[1],z[d*3+2]=E[2],C.push(y[2],y[3])}H.push(z),l%8===7&&await r.pause()}Pe(f,H,(l,z,V,d)=>{const E=(V*x+Math.max(0,d))*2;h[0]=C[E],h[1]=C[E+1],h[2]=0,h[3]=o.tint,h[4]=0}),await r.pause();const G=2.5,Y=.25,nt=3.4,rt=5.4,Bt=2.25,Ct=3.2,_t=24*Math.PI/180,ve=-Math.cos(_t),te=Math.sin(_t),Et=Math.sin(_t),Ft=Math.cos(_t),mt=o.seed*40,Tt=l=>(1+.085*Math.sin(2*l+mt)+.06*Math.sin(3*l+mt*1.7+1)+.04*Math.sin(5*l+mt*2.9+2))/Math.hypot(Math.cos(l)/.145,Math.sin(l)/.215),Dt=(l,z,V)=>{const d=Math.cos(l),E=Math.sin(l);return V[0]=ve*d+Et*E*Math.sin(z),V[1]=E*Math.cos(z),V[2]=te*d+Ft*E*Math.sin(z),V},tt=[0,0,0],Kt=(l,z,V)=>{Dt(l,z,tt);const d=V*(1+.16*I(0,-.55,tt[2]));return m(G+nt*tt[0]*d,rt*tt[1]*d,Y+(tt[2]>0?Bt:Ct)*tt[2]*V)},we=[.08,.4,.66,.84,.96,1.07,1.22,1.45],dt=20,ee=48,Oe=126*Math.PI/180,It=[],he=[],Ae=Dt(.335,-.26,[0,0,0]),Fe=Dt(.335,Math.PI+.26,[0,0,0]),At=M(n.x,n.z);for(let l=0;l<we.length+dt;l++){const z=new Array(ee*3);for(let V=0;V<ee;V++){const d=V/ee*Pt,E=Tt(d);let st,lt;if(l<we.length)lt=we[l],st=E*lt;else{const Ke=Math.pow((l-we.length+1)/dt,1.25);st=J(E*1.45,Oe,Ke),lt=st/E}const St=1-I(.3,1.22,lt),yt=I(-.25,.6,Math.sin(d)),Lt=Math.exp(-((lt-1.12)/.17)*((lt-1.12)/.17));Dt(st,d,tt);const re=((tt[0]-Ae[0])**2+(tt[1]-Ae[1])**2+(tt[2]-Ae[2])**2)/(.135*.135),Xt=((tt[0]-Fe[0])**2+(tt[1]-Fe[1])**2+(tt[2]-Fe[2])**2)/(.135*.135),je=(Math.exp(-re)+Math.exp(-Xt))*I(1.05,1.4,lt),xt=Le(Math.exp(-re/3.4)+Math.exp(-Xt/3.4)-1.25*(Math.exp(-re)+Math.exp(-Xt)),0,1),$e=.03*u.n3(tt[0]*1.3+o.seed*7,tt[1]*1.3,tt[2]*1.3-o.seed*3)+.012*u.n3(tt[0]*4.1,tt[1]*4.1+o.seed*5,tt[2]*4.1),_e=1-.26*St+(.012+.03*yt)*Lt+.185*je+$e*(1-St),le=Kt(st,d,_e);z[V*3]=le[0],z[V*3+1]=le[1],z[V*3+2]=le[2];const Te=le[1]-At,fe=tt[2],Ee=I(.7,1.5,Te)*(1-I(1.7,2.6,Te))*(1-I(.1,.5,fe)),Gt=I(96,112,st*180/Math.PI),De=I(.3,.56,.5+.5*u.n3(tt[0]*2.3+9,tt[1]*2.3+o.seed*11,tt[2]*2.3)),We=I(.52,.66,.5+.5*u.n3(tt[0]*3.4-5,tt[1]*3.4+o.seed*17,tt[2]*3.4+2)),Vt=Le(Math.max(Ee*We,Gt*.9*(.35+.65*De)),0,1),Ve=Math.pow(1-I(.42,1.1,lt),.8)*(1-.3*(1-yt)*I(.6,1,lt)),Ne=J(J(.6+.38*I(-.5,.5,fe),.5,.6*Vt)*(1-.55*xt)*(1+.1*Lt*yt),.1,Ve),Me=Ve>.02||lt<1.3?0:Vt>.3?1+.95*Vt:.22*De*(1-I(.2,.7,fe));he.push(Ne,Me,J(o.tint*(1+.1*Lt*yt),.1,Ve))}It.push(z),l%5===4&&await r.pause()}Pe(f,It,(l,z,V,d)=>{const E=(V*ee+Math.max(0,d))*3;h[0]=he[E],h[1]=he[E+1],h[2]=.3,h[3]=he[E+2],h[4]=0}),await r.pause();const Se=[],Ot=(l,z)=>{const V=Kt(l,z,1),d=Dt(l,z,[0,0,0]),E=m(G+nt*d[0]+.3*d[0]/nt,rt*d[1]+.3*d[1]/rt,Y+(d[2]>0?Bt:Ct)*d[2]+.3*d[2]/(d[2]>0?Bt:Ct));return[new e.Vector3(V[0],V[1],V[2]),new e.Vector3(E[0]-V[0],E[1]-V[1],E[2]-V[2]).normalize()]},ge=o.seed>.5?1:-1,oe=f0(u0("wfg-crown:"+o.seed)),jt=(l,z,V,d)=>{const E=oe.range(l,z),st=oe.range(V,d);return Ot(E*Math.PI/180,(ge>0?st:180-st)*Math.PI/180)},be=jt(44,82,40,124).concat(oe()*Pt),Be=[0,0,0,0,0].map(()=>jt(44,82,40,124));{const l=[be[0]].concat(Be.map(z=>z[0]));for(let z=0;z<8;z++)for(let V=0;V<=20;V++){const d=jt(44,96,30,150);if(l.every(E=>E.distanceTo(d[0])>=1.5)){Se.push(d),l.push(d[0]);break}}}const gt=m(G,0,Y),Ce=m(G,1,Y),ae=m(G+Et,0,Y+Ft),ye={c:new e.Vector3(gt[0],gt[1],gt[2]),b:new e.Vector3(Ce[0]-gt[0],Ce[1]-gt[1],Ce[2]-gt[2]).normalize(),u:new e.Vector3(ae[0]-gt[0],ae[1]-gt[1],ae[2]-gt[2]).normalize()},ne=m(1,0,0),$t=m(0,0,0),Wt=[ne[0]-$t[0],ne[1]-$t[1],ne[2]-$t[2]];for(let l=-1;l<=1;l+=2){const z=m(4.4,l*4.3,1),V=m(6.4,l*(5.2+3.3),.3);pe(f,7,8,d=>[J(z[0],V[0],d),J(z[1],V[1],d)+.9*Math.sin(Math.PI*d),J(z[2],V[2],d)],Wt,(d,E)=>{const st=1+.5*I(.6,1,d)-.25*Math.sin(Math.PI*d);return ut[0]=Math.cos(E)*1.25*st*(1+.15*u.n2(d*4,E+l)),ut[1]=Math.sin(E)*J(.5,.32,d),ut},d=>{h[0]=.65+.35*d,h[1]=.8,h[2]=0,h[3]=o.tint*1.02,h[4]=0})}const se=[];for(let l=1;l<=ce;l+=2.3){const z=m(l,0,A(l,0,S(l)));se.push(new e.Vector3(z[0],z[1],z[2])),F.push(z[0],z[2],S(l)+1.2)}const xe=m(8.5,2.3*(o.seed>.5?1:-1),.6),Yt=m(ce,0,.3),ie=Kt(0,0,1);return{line:se,seat:new e.Vector3(xe[0],xe[1],xe[2]),tip:new e.Vector3(Yt[0],Yt[1],Yt[2]),occ:Se,occ2:Be,occSeat:be,frame:ye,foramen:new e.Vector3(ie[0],ie[1],ie[2])}}function zt(f,n,o){const B=n.hx,p=n.hz,q={feet:[],tips:[]},m=[0,0];for(let A=0;A<2;A++){const K=a(n,0,(A?1:-1)*o.half,0);m[A]=M(K[0],K[2])+o.horn}const S=(m[0]+m[1])*.5+o.top;for(let A=0;A<2;A++){const K=A?1:-1,U=m[A],g=o.seed+A*5.3,b=s=>{const T=a(n,K*o.cross*s*s+o.lean*s,Ie(K*o.half,K*(o.half+2.7),K*(o.half-1.9),K*.4,s),0);return T[1]=Ie(U,U+8,S-4.2,S,s),T};pe(f,32,10,b,[B,0,p],(s,T)=>{const y=Math.cos(T),G=Math.sin(T);let Y=J(.66,.2,Math.pow(s,.8))*(1+.5*Q(s,0,.06)),nt=J(1,.26,Math.pow(s,.9))*(1+.4*Q(s,0,.05));return G*K>0&&(nt*=1+1.25*Q(s,.15,.05)),nt*=1-.3*Math.max(0,u.n2(s*9+g,G>0?1.5:4.5))*Math.abs(G)*I(.22,.4,s),ut[0]=y*Y,ut[1]=G*nt,ut},(s,T)=>{const y=Math.sin(T*Pt);h[0]=.55+.45*I(0,.12,s),h[1]=(.95-.4*y*y*y*y)*(s<.04?.3:1),h[2]=0,h[3]=o.tint*(A?1:.97),h[4]=0});const x=b(0);ot(f,[x[0],x[1]+.1,x[2]],1.15,.85,1.25,g,()=>{h[0]=.6,h[1]=.4,h[2]=0,h[3]=o.tint,h[4]=0},5,9);const H=M(x[0],x[2]);pe(f,6,9,s=>[x[0]+1.6*(1-s)*B*-1+.5*u.n2(s*2,g),J(H-2.2,U-.35,s),x[2]+.5*u.n2(s*2+9,g)],[1,0,0],(s,T)=>{const y=J(4.2,1.25,Math.pow(s,.7))*(1+.28*u.n2(Math.cos(T)*1.3+g,Math.sin(T)*1.3+s*2.2));return ut[0]=Math.cos(T)*y,ut[1]=Math.sin(T)*y,ut},s=>{h[0]=.5+.5*s,h[1]=0,h[2]=1,h[3]=1,h[4]=0}),F.push(x[0],x[2],3.5);const C=b(1);q.feet.push(new e.Vector3(x[0],x[1],x[2])),q.tips.push(new e.Vector3(C[0],C[1],C[2]))}return q}function ht(f,n,o,B){const p=Math.cos(o),q=Math.sin(o),m=(g,b,x=0)=>{const H=n[0]+g*p-b*q,C=n[1]+g*q+b*p;return[H,M(H,C)+.26+x,C]},S=(g,b)=>()=>{h[0]=g,h[1]=b,h[2]=0,h[3]=B.tint,h[4]=0};X(f,m(0,0,.35),m(2.7,.1,.2),.85,.75,.75,1,S(.8,.8),6,8),X(f,m(3,-.6,.1),m(7.3,-1),.52,.62,.55,2,S(.85,.7),6,7),X(f,m(3,.6,.1),m(7.1,.9),.45,.5,.55,3,S(.85,.7),6,7);for(let g=0;g<5;g++)ot(f,m(7.9+.35*(g%2),-1.3+g*.65),.36,.24,.34,g*3.1+B.seed,S(.8,.4),4,6);const A=[4,7,6,3],K=[-.17,-.05,.07,.24];for(let g=0;g<4;g++){let b=8.75,x=-1.25+g*.83,H=1.3-.08*Math.abs(g-1),C=.25;const s=Math.cos(K[g]),T=Math.sin(K[g]);for(let y=0;y<A[g];y++){const G=W.range(-.05,.05),Y=W.range(-.07,.07),nt=b+H*s,rt=x+H*T;X(f,m(b+G,x+Y),m(nt+G,rt+Y),C,C*.88,.62,g*9+y,S(.9,.35),4,6),b=nt+.16*s,x=rt+.16*T,H*=.87,C*=.9}}const U=[];for(let g=0;g<=4;g++){const b=m(g*4,0);F.push(b[0],b[2],2.2),U.push(new e.Vector3(b[0],b[1],b[2]))}return U}function k(f,n,o,B){const p=[],S=B.size,A=1.08,K=Math.cos(o),U=Math.sin(o),g=M(n[0],n[1]);for(let b=0;b<6;b++){const x=J(.2,1,b/5),H=new Array(84);for(let C=0;C<28;C++){const s=C<14,T=s?C/13:1-(C-14)/13,y=(T*2-1)*A,G=1+.13*u.n2(y*1.3+B.seed,1.7)*(b===5?1:.5)-.25*I(.75,1,Math.abs(y)/A)*x,Y=Math.cos(y)*x*S*G,nt=Math.sin(y)*x*S*G,rt=.5*Q(y,.28,.13)*(.4+x)+.25*(1-x),Bt=(s?.3+rt+.22*(1-x*x)+.1*u.n2(Y*.9+B.seed,nt*.9):-.26)*(1-.6*I(.8,1,Math.abs(y)/A))*(b===5?.45:1)+B.tilt*Y;H[C*3]=n[0]+Y*K-nt*U,H[C*3+1]=g+.55+B.lift+Bt,H[C*3+2]=n[1]+Y*U+nt*K}p.push(H)}return Pe(f,p,(b,x,H,C)=>{h[0]=C>=14?.45:.95,h[1]=.3,h[2]=0,h[3]=B.tint,h[4]=0}),F.push(n[0]+.5*S*K,n[1]+.5*S*U,S*.8),new e.Vector3(n[0]+.55*S*K,g+.9+B.lift+B.tilt*.55*S,n[1]+.55*S*U)}function P(f,n,o,B,p){const q=M(n[0],n[1])+.16,m=()=>{h[0]=.85,h[1]=.5,h[2]=0,h[3]=.97,h[4]=0};for(let S=-1;S<=1;S+=2){const A=o+S*.5;X(f,[n[0],q+.1,n[1]],[n[0]+Math.cos(A)*B,q,n[1]+Math.sin(A)*B],.2*B,.13*B,.7,p+S,m,4,6)}F.push(n[0],n[1],B+.6)}function v(f,n,o){const B=o.count;for(let p=0;p<B;p++){const q=W.range(0,Pt),m=Math.sqrt(W())*1,S=n[0]+Math.cos(q)*m*5.5,A=n[1]+Math.sin(q)*m*3.2,K=W.range(-.9,.9)+(W.chance(.3)?Math.PI:0),U=W.range(3,7.5),g=W.range(.3,1.9),b=W.range(.4,1),x=M(S,A),H=2+(W()<.6?1:0);for(let C=0;C<H;C++){const s=(C-(H-1)/2)*W.range(.16,.3),T=W.range(0,9);pe(f,5,3,y=>{const G=K+s*y*y*1.6,Y=U*y*(1-.12*Math.abs(s));return[S+Math.cos(G)*Y+s*.6,x+.12+g*Math.sin(Math.PI*Math.min(1,y*.85+.1))+.15*Math.sin(y*6+T),A+Math.sin(G)*Y]},[0,1,0],(y,G)=>{const Y=J(.4,.07,y*y);return ut[0]=Math.cos(G)*.06,ut[1]=Math.sin(G)*Y,ut},y=>{h[0]=.5+.5*y,h[1]=0,h[2]=2,h[3]=1,h[4]=y*y*b})}p%4===0&&F.push(S,A,3)}}return{skull:pt,jaws:zt,flipper:ht,scapula:k,chevron:P,baleen:v}}const i0={crimson:{furBias:.02,tufts:1,mat:.75,crust:0,white:0,hollow:0},white:{furBias:-.3,tufts:.42,mat:1.7,crust:0,white:.55,hollow:0},reef:{furBias:-.05,tufts:.4,mat:.5,crust:1,white:.15,hollow:1}};async function B0(r,N={}){const u=(N.palette&&N.palette.length>=7?N.palette:m0).map(t=>new e.Color(t)),a=r.rng.fork("whale-fall-garden"),M=r.noise,F=r.quality?.detail??1,W=a(),ot=i0[N.age]?N.age:W<.6?"crimson":W<.8?"white":"reef",X=i0[ot],Q=N.bowSign??(a.chance(.5)?1:-1),pt=N.bow??a.range(8.5,11.5),zt=a.int(7,9),ht=a.int(2,4),k=1,P=-1,v=1,f=t=>Q*pt*(.5-(t-54)/54*((t-54)/54)),n=t=>{const i=Math.min(t,ze),c=-2*Q*pt*(i-54)/2916,w=Math.hypot(1,c),R=-1/w,L=c/w,O=t-i;return{x:56-i+R*O,z:f(i)+L*O,hx:R,hz:L,lx:L,lz:-R,s:t}},o=(t,i,c,w)=>[t.x+i*t.hx+c*t.lx,w,t.z+i*t.hz+c*t.lz],B=n(ze),p=n(ze-2.2),q=(t,i)=>{const c=(t-p.x)*p.hx+(i-p.z)*p.hz,w=Math.abs((t-p.x)*p.lx+(i-p.z)*p.lz),R=c>0?-.7*(c-12*(1-Math.exp(-c/12))):0,L=I(7,20,w)*(.4+.6*I(0,30,c));return R+.9*M.fbm2(t*.045+3.3,i*.045-1.7,3)*L+.12*M.n2(t*.21,i*.21)},m=88,S=42,A=-106,K=78,U=f(54)*.35,g=U-50,b=U+50,x=new Float32Array((m+1)*(S+1));await r.yield();for(let t=0,i=0;t<=S;t++){const c=J(g,b,t/S);for(let w=0;w<=m;w++,i++)x[i]=q(J(A,K,w/m),c);t%2===1&&await r.yield()}const H=(t,i)=>{const c=(t-A)/(K-A)*m,w=(i-g)/(b-g)*S;if(!(c>=0&&c<m&&w>=0&&w<S))return q(t,i);const R=c|0,L=w|0,O=c-R,D=w-L,j=L*(m+1)+R;return(x[j]*(1-O)+x[j+1]*O)*(1-D)+(x[j+m+1]*(1-O)+x[j+m+2]*O)*D},C=[],s={NZ:M,M:o,groundH:q,feet:C,rng:a,pause:()=>r.yield()},T=z0(s),y=P0(s,T),G=()=>a.range(.93,1.04);await r.yield();const Y=new t0,nt=[];{let t=ze-.9,i=0;for(;t>.6&&i<70;){const w=J(.24,1,Math.pow(I(0,46,t),.85))*(t>80?.9:1),R=1.2*w+.42,L=1-I(10,40,t),O=.35+.65*L,D=t>Qt-1.5,j=D?1.9:t<3.5?0:(.95+1.6*I(4,26,t))*(.85+.15*Math.sin(t*.2)),ft={roll:a.gauss()*.1*O+(a.chance(.08*O)?a.range(-.7,.7):0),yaw:a.gauss()*.08*O,db:a.gauss()*.14*O,dy:a.range(-.12,.02)*w,seed:a(),tint:G(),sweep:a.range(-.15,.15),back:a.range(-.5,.1),wl:a.range(.85,1.1),wr:a.range(.85,1.1)};if(!(a.chance(.05)&&!D)){const at=T.vertebra(Y,n(t-R*.5),w,R,j,ft);nt.push(new e.Vector3(at[0],at[1],at[2]))}t-=R+a.range(.14,.3)+(L>.5&&a.chance(.12)?a.range(.3,.9):0),i++,i%3===0&&await r.yield()}const c=9+a.int(0,4);for(let w=0;w<c;w++){const R=n(a.range(4,42)),L=a.sign(),O=o(R,0,L*a.range(2.6,6.5),0);y.chevron(Y,[O[0],O[2]],a.range(0,Pt),a.range(.7,1.15),w*3.7)}}nt.reverse(),await r.yield();const rt=new t0,Bt=[];for(let t=0;t<a0;t++){const i=n(Qt+t*qe+a.range(-.18,.18)),c=.66+.34*Math.pow(Math.sin(Math.PI*(t+.8)/16.2),.8);for(let w=-1;w<=1;w+=2){const R=t===zt&&w===k,L=t===ht&&w===P,O={k:c*a.range(.95,1.05),gap:a.range(.6,2.4),top:a.range(11.6,14.3),bulge:a.range(.9,1.1),lean:a.range(.2,3.2),twist:a.range(.35,.8)*w,thick:a.range(.92,1.12),seed:a(),tint:G(),fallen:R,stub:L?a.range(.2,.3):0},D=T.rib(rt,i,w,O);Bt.push({index:t,side:w,fallen:R,stub:!!L,points:D}),await r.yield()}await r.yield()}const Ct=n(Qt+12.3*qe),_t=o(Ct,0,v*9.6,0),ve=Math.atan2(Ct.lz*v-.5*Ct.hz,Ct.lx*v-.5*Ct.hx)+a.range(-.15,.15),te=y.flipper(rt,[_t[0],_t[2]],ve,{tint:.99,seed:a()}),Et=[];for(let t=-1;t<=1;t+=2){const i=n(Qt+(t>0?14.8:12.4)*qe),c=o(i,0,t*(t>0?12.5:10.8),0);Et.push(y.scapula(rt,[c[0],c[2]],a.range(0,Pt),{size:a.range(4.2,5),tilt:a.range(-.06,.08),lift:a.range(0,.35),seed:a()*9,tint:G()}))}await r.yield();const Ft=new t0,mt=await y.skull(Ft,B,{droop:1.7,seed:a(),tint:1});await r.yield();const Tt=n(ze+ce*Math.cos(Je)+11.5),Dt=y.jaws(Ft,Tt,{half:8,top:a.range(19,21),horn:4.2,cross:a.range(-.9,.9),lean:a.range(-1.2,1.2),seed:a()*9,tint:1}),tt=n(ze+10),Kt=o(tt,0,v*11.5,0);y.baleen(Ft,[Kt[0],Kt[2]],{count:34}),await r.yield();const we=new e.Color("#CFEFF2").lerp(new e.Color("#fff6e8"),.7).multiplyScalar(1.12),dt={uTime:{value:0},uGustAmp:{value:N.gust??1},uPrints:{value:Array.from({length:Jt},()=>new e.Vector4(0,-999,0,1))},uPrintAge:{value:new Array(Jt).fill(1e3)},uKeyDir:{value:new e.Vector3(Math.sin(.105),Math.cos(.105),0)},uKey:{value:we},uSky:{value:u[2].clone().multiplyScalar(.62)},uBounce:{value:new e.Color("#BFEFF0").multiplyScalar(.17)},uShadow:{value:new e.Color("#06323F")},uCamL:{value:new e.Vector3(0,40,80)},uCrimson:{value:u[1].clone()},uCoat:{value:u[1].clone().lerp(new e.Color("#8E1226"),.65)},uFarCut:{value:N.farCut??.32},uOccC:{value:new e.Vector4(mt.frame.c.x,mt.frame.c.y,mt.frame.c.z,1)},uOccB:{value:mt.frame.b},uOccU:{value:mt.frame.u},uPink:{value:u[4].clone()},uYellow:{value:u[5].clone().multiplyScalar(.8)},uMatA:{value:new e.Color("#E9EEE4").multiplyScalar(.74)},uMatB:{value:u[5].clone().lerp(new e.Color("#F2EBC0"),.5).multiplyScalar(.5)},uMatAmt:{value:X.mat},uCrust:{value:X.crust},uFurGain:{value:1},uChalkTop:{value:N.chalkTop??.3},uBedTone:{value:new e.Vector2(.12,.23)},uPx:{value:.003},uPxScale:{value:300},uSpark:{value:u[6].clone().multiplyScalar(3.2)},uSilt:{value:new e.Color(N.silt??"#8FA3A0").multiplyScalar(.34)},uFogLow:{value:new e.Vector4(0,0,0,0)},uFogUp:{value:new e.Vector4(0,0,0,0)},uPale:{value:new e.Vector4(0,0,30,0)},uCloud:{value:new e.Vector4(0,0,60,0)}};N.light&&r0(dt,N.light);const ee=()=>e.UniformsUtils.clone(e.UniformsLib.fog),Oe=new e.ShaderMaterial({uniforms:{...ee(),...dt},vertexShader:p0,fragmentShader:w0,fog:!0,vertexColors:!0,side:e.DoubleSide}),It=u[0].clone().multiplyScalar(.9).lerp(new e.Color(.8,.8,.8),X.white),he=()=>{if(N.chalkTop!==void 0)return;const t=dt.uKey.value,i=Math.max(t.r*It.r,t.g*It.g,t.b*It.b,.4);dt.uChalkTop.value=Math.min(.6,Math.max(.05,1.03/i-1))};he();const Ae=(t,i,c)=>I(-.25,.2,M.fbm3(t*.3,i*.3,c*.3,3)+X.furBias);async function Fe(t){const i=t.n,c=new Float32Array(t.p);await r.yield();const w=new Float32Array(i*3),R=new Float32Array(i*4),L=new Float32Array(i);let O=1e9,D=-1e9,j=1e9,ft=-1e9,Mt=1e9,at=-1e9;for(let _=0;_<i;_++){const $=c[_*3],et=c[_*3+1],Z=c[_*3+2],it=t.a[_*5],wt=t.a[_*5+1],qt=t.a[_*5+2],Rt=t.a[_*5+3],Ht=M.n3($*.45,et*.45,Z*.45),Zt=M.n3($*.11+5,et*.11,Z*.11),vt=Rt*(.95+.07*Ht);w[_*3]=Math.min(.8,It.r*vt*(1+.035*Zt)),w[_*3+1]=Math.min(.8,It.g*vt),w[_*3+2]=Math.min(.8,It.b*vt*(1-.06*Zt));let Nt=wt>1?wt-1:wt*Ae($,et,Z);X.hollow&&wt<=1&&(Nt*=Le(1.75-1.5*it,0,1)),R[_*4]=Nt,R[_*4+1]=it,R[_*4+2]=qt,R[_*4+3]=et-H($,Z),L[_]=t.a[_*5+4],$<O&&(O=$),$>D&&(D=$),et<j&&(j=et),et>ft&&(ft=et),Z<Mt&&(Mt=Z),Z>at&&(at=Z),_%200===199&&await r.yield()}const ct=new e.BufferGeometry;return ct.setAttribute("position",new e.BufferAttribute(c,3)),ct.setAttribute("color",new e.BufferAttribute(w,3)),ct.setAttribute("aFx",new e.BufferAttribute(R,4)),ct.setAttribute("aSway",new e.BufferAttribute(L,1)),await r.yield(),ct.setIndex(i>65535?new e.BufferAttribute(new Uint32Array(t.i),1):new e.BufferAttribute(new Uint16Array(t.i),1)),await r.yield(),await s0(ct,r.yield),await r.yield(),ct.boundingSphere=new e.Sphere(new e.Vector3((O+D)/2,(j+ft)/2,(Mt+at)/2),.5*Math.hypot(D-O,ft-j,at-Mt)+2),ct}const At=new e.Group;At.name="whale-fall-garden-hero";const Se=[];for(const[t,i]of[[Y,"spine"],[rt,"ribs"],[Ft,"skull-and-jaws"]]){const c=new e.Mesh(await Fe(t),Oe);c.name=i,At.add(c),Se.push(c)}const Ot=Math.round(Math.max(9e3,15200*F)*X.tufts*(N.tufts??1)),ge=new Float32Array(Ot*3),oe=new Float32Array(Ot*3),jt=new Float32Array(Ot*4);{const t=[.33,.46,.21],i=n(Qt).x;let c=0;for(let w=0;w<3;w++){const R=Se[w].geometry,L=R.attributes.position.array,O=R.attributes.normal.array,D=R.attributes.aFx.array,j=R.index.array,ft=j.length/3,Mt=new Float32Array(ft);let at=0;for(let _=0;_<ft;_++){const $=j[_*3],et=j[_*3+1],Z=j[_*3+2],it=L[et*3]-L[$*3],wt=L[et*3+1]-L[$*3+1],qt=L[et*3+2]-L[$*3+2],Rt=L[Z*3]-L[$*3],Ht=L[Z*3+1]-L[$*3+1],Zt=L[Z*3+2]-L[$*3+2],vt=wt*Zt-qt*Ht,Nt=qt*Rt-it*Zt,bt=it*Ht-wt*Rt,kt=.5*Math.sqrt(vt*vt+Nt*Nt+bt*bt),Ut=(D[$*4]+D[et*4]+D[Z*4])/3;at+=kt*(Ut>.42?Ut:0)*(w===0&&L[$*3]>i?2:1),Mt[_]=at,_%1500===1499&&await r.yield()}await r.yield();const ct=w===2?Ot-c:Math.round(Ot*t[w]);for(let _=0;_<ct&&at>0;_++,c++){let $=0,et=0,Z=0,it=0,wt=1,qt=0;for(let Ht=0;Ht<4;Ht++){const Zt=a()*at;let vt=0,Nt=ft-1;for(;vt<Nt;){const Ze=vt+Nt>>1;Mt[Ze]<Zt?vt=Ze+1:Nt=Ze}let bt=a(),kt=a();bt+kt>1&&(bt=1-bt,kt=1-kt);const Ut=j[vt*3],ue=j[vt*3+1],me=j[vt*3+2],de=1-bt-kt;if($=L[Ut*3]*de+L[ue*3]*bt+L[me*3]*kt,et=L[Ut*3+1]*de+L[ue*3+1]*bt+L[me*3+1]*kt,Z=L[Ut*3+2]*de+L[ue*3+2]*bt+L[me*3+2]*kt,it=O[Ut*3]*de+O[ue*3]*bt+O[me*3]*kt,wt=O[Ut*3+1]*de+O[ue*3+1]*bt+O[me*3+1]*kt,qt=O[Ut*3+2]*de+O[ue*3+2]*bt+O[me*3+2]*kt,D[Ut*4]*de+D[ue*4]*bt+D[me*4]*kt>.5)break}const Rt=Math.sqrt(it*it+wt*wt+qt*qt)||1;ge[c*3]=$,ge[c*3+1]=et,ge[c*3+2]=Z,oe[c*3]=it/Rt,oe[c*3+1]=wt/Rt,oe[c*3+2]=qt/Rt,jt[c*4]=a.range(.3,.52)*(N.tuftSize??1)*(w===0?J(.45,1,I(0,44,56-$)):1),jt[c*4+1]=a()*Pt,jt[c*4+2]=a(),jt[c*4+3]=a(),_%150===149&&await r.yield()}}}const be=6,Be=new Float32Array(be*9);for(let t=0;t<be;t++){const i=t/be*Pt+t%2*.35;Be.set([i,0,-1,i,0,1,i,1,0],t*9)}const gt=new e.InstancedBufferGeometry;gt.setAttribute("position",new e.BufferAttribute(Be,3)),gt.setAttribute("iPos",new e.InstancedBufferAttribute(ge,3)),gt.setAttribute("iNrm",new e.InstancedBufferAttribute(oe,3)),gt.setAttribute("iDat",new e.InstancedBufferAttribute(jt,4)),gt.instanceCount=Ot,gt.boundingSphere=new e.Sphere(new e.Vector3(-10,0,0),90);const Ce=new e.ShaderMaterial({uniforms:{...ee(),...dt},vertexShader:g0,fragmentShader:b0,fog:!0,side:e.DoubleSide}),ae=new e.Mesh(gt,Ce);ae.name="plush",ae.frustumCulled=!1,At.add(ae),await r.yield();let ye=null;if(N.bed!==!1){const t=m,i=S,c=A,w=K,R=U,L=g,O=b,D=new Float32Array((t+1)*(i+1)*3),j=new Float32Array((t+1)*(i+1)*3),ft=[],Mt=C.length/3;for(let _=0,$=0;_<=i;_++){for(let et=0;et<=t;et++,$++){const Z=J(c,w,et/t),it=J(L,O,_/i);let wt=1e9;for(let vt=0;vt<Mt;vt++){const Nt=Z-C[vt*3],bt=it-C[vt*3+1],kt=Math.sqrt(Nt*Nt+bt*bt)-C[vt*3+2];kt<wt&&(wt=kt)}const qt=(Z-p.x)*p.hx+(it-p.z)*p.hz,Rt=Math.hypot((Z-(c+w)/2)/((w-c)/2),(it-R)/50);D[$*3]=Z,D[$*3+1]=x[$]-.02,D[$*3+2]=it,j[$*3]=1-I(.5,15,wt),j[$*3+1]=1.35*(1-I(.55,1,Rt));const Ht=(Z-p.x)*p.lx+(it-p.z)*p.lz,Zt=Math.exp(-(Ht/30)*(Ht/30));j[$*3+2]=I(.15,.5,I(8,34,qt)*.9*(1-.75*Zt)+.45*M.fbm2(Z*.06,it*.06,3)-.2)}await r.yield()}for(let _=0;_<i;_++)for(let $=0;$<t;$++){const et=_*(t+1)+$,Z=et+1,it=et+t+1,wt=it+1;ft.push(et,it,Z,Z,it,wt)}const at=new e.BufferGeometry;at.setAttribute("position",new e.BufferAttribute(D,3)),at.setAttribute("aBed",new e.BufferAttribute(j,3)),at.setIndex(ft),await r.yield(),await s0(at,r.yield),at.boundingSphere=new e.Sphere(new e.Vector3((c+w)/2,-10,R),125);const ct=new e.ShaderMaterial({uniforms:{...ee(),...dt},vertexShader:M0,fragmentShader:k0,fog:!0});ye=new e.Mesh(at,ct),ye.name="bed",At.add(ye),await r.yield()}const ne=Math.min(40,Math.max(4,Math.round(14*(N.sparks??1)))),$t=ne*22,Wt=new Float32Array($t*3),se=new Float32Array($t*2).fill(-100),xe=new Float32Array($t);for(let t=0;t<$t;t++)xe[t]=a.range(.1,.26);const Yt=new e.BufferGeometry,ie=new e.BufferAttribute(Wt,3),l=new e.BufferAttribute(se,2);ie.setUsage(e.DynamicDrawUsage),l.setUsage(e.DynamicDrawUsage),Yt.setAttribute("position",ie),Yt.setAttribute("aLife",l),Yt.setAttribute("aSize",new e.BufferAttribute(xe,1)),Yt.boundingSphere=new e.Sphere(new e.Vector3(-10,0,0),120);const z=new e.Points(Yt,new e.ShaderMaterial({uniforms:dt,vertexShader:y0,fragmentShader:x0,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending}));z.name="sparks",z.frustumCulled=!1,At.add(z);let V=0,d=Math.floor(a()*1e9)>>>0;const E=()=>(d=Math.imul(d,1664525)+1013904223>>>0,d/4294967296),st=Array.from({length:4},()=>({on:!1,p:new e.Vector3,last:new e.Vector3(0,-999,0),r:2}));let lt=0,St=N.demo!==!1,yt=0,Lt=-1e9;const re=new Float64Array(Jt).fill(-1e3),Xt=(t,i)=>{const c=Math.sin(t*127.1+i*311.7)*43758.5453;return c-Math.floor(c)};function je(t,i){const c=lt;lt=(lt+1)%Jt,dt.uPrints.value[c].set(t.x,t.y,t.z,i),re[c]=yt;for(let w=0;w<ne;w++){const R=V;V=(V+1)%$t;const L=E()*Pt,O=E()*2-1,D=Math.sqrt(1-O*O),j=i*(.75+.3*E());Wt[R*3]=t.x+Math.cos(L)*D*j,Wt[R*3+1]=t.y+O*j*.7,Wt[R*3+2]=t.z+Math.sin(L)*D*j,se[R*2]=yt+E()*1.2,se[R*2+1]=.3+E()*.3}ie.needsUpdate=!0,l.needsUpdate=!0}const xt=new e.Vector3,$e=new e.Vector2,_e=new e.Vector3,le=Bt.filter(t=>!t.fallen&&!t.stub),Te=le[Math.floor(le.length*.45)],fe=le.filter(t=>t.side===1),Ee=(t,i,c)=>{const w=Le(i,0,1)*(t.length-1),R=Math.min(t.length-2,Math.floor(w));return c.lerpVectors(t[R],t[R+1],w-R)},Gt=t=>new e.Vector3(t[0],t[1],t[2]),De=5.6,We=Qt+(a0-1)*qe,Vt=[];for(let t=0;t<=8;t++)Vt.push(Gt(o(n(J(Qt-1.5,We+1.5,t/8)),0,0,De)));const Ve=(Dt.feet[0].y+Dt.feet[1].y)/2,Ne=Gt(o(Tt,0,0,Ve+7.6)),Me=Math.cos(35*Math.PI/180),Ke=Math.sin(35*Math.PI/180),Ye=Ne.clone().add(new e.Vector3(Tt.hx*13,-3.8,Tt.hz*13)),o0=Ye.clone().add(new e.Vector3(Tt.hx*Me*60,-Ke*60,Tt.hz*Me*60)),ke=[];{const t=n(0);ke.push(Gt(o(t,-30,-26,26)),Gt(o(t,-22,-8,12)),Gt(o(t,-9,0,4.2)));for(let i=1;i<nt.length-1;i+=5){const c=nt[i];c.x>n(Qt-3).x&&ke.push(new e.Vector3(c.x,c.y+2.1,c.z))}for(const i of Vt)ke.push(i.clone());for(let i=2;i<mt.line.length;i+=2)ke.push(mt.line[i].clone().add(new e.Vector3(0,4.8,0)));ke.push(Ne.clone(),Ye.clone(),o0.clone())}const Xe=[];for(const[t,i]of[[3,1],[7,-1],[11,1]]){const c=n(Qt+t*qe+1.2);Xe.push({position:Gt(o(c,0,i*2.7,1.5+q(c.x,c.z))),side:i,rib:t})}Xe.push({position:mt.seat.clone(),side:0,rib:-1});const l0=n(40),c0={portalSeat:{position:o0,normal:new e.Vector3(-Tt.hx*Me,Ke,-Tt.hz*Me),radius:7,tiltDeg:35},flyThrough:ke,naveLine:Vt,naveEntry:Vt[0],naveExit:Vt[Vt.length-1],naveClear:1.8,sharkLine:Vt.map(t=>new e.Vector3(t.x,8.7,t.z)),spineTop:nt,skullLine:mt.line,skullTip:mt.tip,occiput:mt.occ,occiput2:mt.occ2,occiputSeat:mt.occSeat,foramen:mt.foramen,archPass:Ne,archFeet:Dt.feet,archTips:Dt.tips,straightStart:Ye,ribs:Bt,octopusSeats:Xe,scapulae:Et,flipperLine:te,baleen:new e.Vector3(Kt[0],q(Kt[0],Kt[2])+.8,Kt[2]),viewpoints:{reveal:Gt(o(l0,0,-62,52)),tailLow:Gt(o(n(0),-12,0,5)),naveMid:Vt[4],archView:mt.line[Math.min(3,mt.line.length-1)].clone().add(new e.Vector3(0,5.5,0))},heading:new e.Vector3(Tt.hx,0,Tt.hz),bowSign:Q,age:ot},h0=new e.Vector3(-6,3,f(54)*.5);return{object:At,radius:30,height:16,center:h0,anchors:c0,ground:!1,groundY:0,uniforms:dt,age:ot,groundHeight:q,groundFast:H,bed:ye,plush:ae,plushGLSL:Ge,glsl:v0,feet:C,stats:{tufts:Ot,boneTriangles:(Y.i.length+rt.i.length+Ft.i.length)/3},setLight(t){r0(dt,t),he()},setGust(t){dt.uGustAmp.value=t},disturb(t,i,c=2){St=!1;const w=st[t&3];if(!i){w.on=!1;return}w.on=!0,w.p.copy(i),w.r=c},disturbWorld(t,i,c=2){if(!i)return this.disturb(t,null);At.updateWorldMatrix(!0,!1),xt.copy(i),At.worldToLocal(xt),this.disturb(t,xt,c/Math.max(1e-4,At.getWorldScale(_e).x)),St=!1},update(t,i,c){yt=i,dt.uTime.value=i,At.updateWorldMatrix(!0,!1),c.getWorldPosition(xt),At.worldToLocal(xt),dt.uCamL.value.copy(xt);const w=r.renderer?r.renderer.getDrawingBufferSize($e).y:900,R=c.projectionMatrix.elements[5]||1.6,L=At.getWorldScale(_e).x||1;if(dt.uPx.value=2/(R*w*L),dt.uPxScale.value=R*w*.5*L,St&&Te){const D=Math.floor(i/.45);if(D!==Lt){Lt=D;for(let j=0;j<Jt;j++){const ft=D-j,Mt=ft*.45,at=dt.uPrints.value[j];if(ft&1)Ee(Te.points,.5+.38*Math.sin(Mt*.33),xt),at.set(xt.x,xt.y,xt.z,1.5);else{const ct=(Mt*.11%1+1)%1,_=fe[Math.min(fe.length-1,Math.floor(ct*fe.length))];Ee(_.points,.5+.12*Math.sin(Mt*.9),xt),at.set(xt.x,xt.y,xt.z,2.3)}re[j]=Mt;for(let ct=0;ct<ne;ct++){const _=j*ne+ct,$=Xt(ft,ct)*Pt,et=Xt(ft+.5,ct)*2-1,Z=Math.sqrt(1-et*et),it=at.w*(.75+.3*Xt(ft,ct+.5));Wt[_*3]=at.x+Math.cos($)*Z*it,Wt[_*3+1]=at.y+et*it*.7,Wt[_*3+2]=at.z+Math.sin($)*Z*it,se[_*2]=Mt+Xt(ft+.25,ct)*1.2,se[_*2+1]=.3+Xt(ft+.75,ct)*.3}}ie.needsUpdate=!0,l.needsUpdate=!0}}const O=dt.uPrintAge.value;for(let D=0;D<Jt;D++){const j=yt-re[D];j<0&&(re[D]=-1e3),O[D]=j<0?1e3:Math.min(j,1e3)}for(const D of st)D.on&&D.last.distanceTo(D.p)>D.r*.55&&(D.last.copy(D.p),je(D.p,D.r))},dispose(){}}}function r0(r,N){N.dir&&r.uKeyDir.value.copy(N.dir).normalize();for(const[u,a]of[["key","uKey"],["sky","uSky"],["bounce","uBounce"],["shadow","uShadow"],["crimson","uCrimson"],["silt","uSilt"]])N[u]!==void 0&&r[a].value.set(N[u]),N[u+"Scale"]&&r[a].value.multiplyScalar(N[u+"Scale"])}export{v0 as WFG_GLSL,B0 as buildHero};
