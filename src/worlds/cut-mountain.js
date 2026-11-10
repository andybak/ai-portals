import*as d from"three";import{makePath as ca,clamp as p0,lerp as j,smoothstep as G}from"../kit/core.js";import{buildHero as fa,PLATE_COMMON as W0,plateKit as bo}from"../parts/cut-mountain.js";const{makeAcc:r0,vtx:ko,accGeometry:b0,accTube:Ke,accRibbon:J,accDome:zt,instancePlants:At,plateMaterial:zo,thin:d0,PLANT_FRAG:ha,PAGE_LIB:da,FOG_V:pa,FOG_F:Ua,FRAG_END:Xa}=bo,X=Math.PI*2,ma=`
varying vec3 vDir;
void main(){ vDir = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.); }`,va=`
varying vec3 vDir;
uniform vec4 uCone; uniform vec3 uSky; uniform vec3 uFar;   // uCone: azimuth, half width, height, plume side; uSky: rule density, cloud level, drift; uFar: seed, height, tint
${W0}
void main(){
  vec3 d = normalize(vDir);
  float el = asin(clamp(d.y, -1., 1.));
  float az = atan(d.x, -d.z + (abs(d.x) + abs(d.z) < 1e-5 ? 1e-5 : 0.));
  // level rules, closer together toward the zenith, with a slight burr
  float c0 = pow(max(el, 0.) + 1e-4, 1.5)*uSky.x;
  float fc = max(fwidth(c0), 1e-5);
  float c = c0 + 0.1*(vnoise(vec2(az*24., el*30.)) - 0.5);
  float k = floor(c + 0.5);
  float ln = lineAA(c - k, fc, 0.6);
  ln = mix(ln, 0.17, smoothstep(0.28, 0.6, fc));
  ln *= smoothstep(0.004, 0.02, el)*(0.72 + 0.28*step(0.2, vnoise(vec2(az*9. + k*3.1, k*0.7))));
  // cloud shapes left blank, with a few contour strokes on their undersides; they slide through the ruling
  vec2 q0 = d.xz/(max(d.y, 0.) + 0.22)*0.85;
  vec2 q = q0 + uSky.z*uTime*vec2(-0.9, 0.42);
  float n = 0.62*vnoise(q) + 0.38*vnoise(q*2.7 + 5.);
  vec2 qU = q - q0*0.06;
  float nU = 0.62*vnoise(qU) + 0.38*vnoise(qU*2.7 + 5.);
  float fn = max(fwidth(n), 1e-5);
  float band = smoothstep(0.03, 0.14, el);
  float m = smoothstep(uSky.y - 0.012, uSky.y + 0.012, n)*band;
  float under = smoothstep(0., 0.012, nU - n);
  float outl = lineAA(n - uSky.y, fn, 0.8)*(0.3 + 0.7*under)*step(0.3, vnoise(q*6.));
  float inner = max(lineAA(n - uSky.y - 0.04, fn, 0.6)*step(0.45, vnoise(q*5. + 3.)),
                    lineAA(n - uSky.y - 0.085, fn, 0.6)*step(0.6, vnoise(q*4. + 8.)))*under;
  // a cloud is a blank top over a ruled base: the ruling runs on through its underside, with a thin shade wash
  float baseK = smoothstep(0.0, 0.02, nU - n)*(1. - smoothstep(0.03, 0.12, n - uSky.y))*m;
  float ink = max(ln*(1. - m*(1. - 0.85*baseK)), max(outl, inner*0.8)*band);
  // a second cone on the horizon, in outline only, trailing a ruled plume
  float da = az - uCone.x;
  float sx = da/uCone.y;
  float prof = uCone.z*pow(max(1. - abs(sx), 0.), 1.55);
  float e = el - prof;
  float fe = max(fwidth(e), 1e-5);
  float inC = step(abs(sx), 1.)*step(0., el);
  float cone = lineAA(e, fe, 0.9)*inC;
  float tk = step(e, 0.)*step(-0.02 - 0.03*h11(floor(sx*40.)), e)*lineAA((fract(sx*40.) - 0.5)/40.*uCone.y, max(fwidth(az), 1e-5), 0.5)*step(0.3, sx*uCone.w)*inC;
  float ps = sx*uCone.w;                                   // along the plume
  float pw = max(0.006 + 0.016*ps, 1e-3);
  float py = (el - uCone.z - 0.012*ps - 0.006*sin(ps*5. - uTime*0.25))/pw;
  float pm = step(0.02, ps)*step(abs(py), 1.)*(1. - smoothstep(2.2, 3.4, ps));
  float pl = lineAA((fract(py*2.5 + 0.5) - 0.5)*pw/2.5, max(fwidth(el), 1e-5), 0.55)*step(0.25, vnoise(vec2(ps*9. - uTime*0.2, floor(py*2.5 + 0.5))));
  ink = max(ink*(1. - step(e, 0.)*inC)*(1. - pm), max(cone, max(tk, pl*pm))*0.9);
  // the far cordillera, all round the horizon: two ranges in outline and hachure under flat verditer tints (the second
  // plate), snow left as paper on the highest tops, standing in a sea of cloud that fills everything below the horizon
  float fel = max(fwidth(el), 1e-5), faz = max(fwidth(az), 1e-5);
  float rg2 = 1. - abs(2.*vnoise(vec2(az*6. + uFar.x, 1.3)) - 1.), rg2b = 1. - abs(2.*vnoise(vec2(az*19. + uFar.x, 4.1)) - 1.);
  float rg1 = 1. - abs(2.*vnoise(vec2(az*11. + uFar.x, 2.9)) - 1.);
  float r2p = uFar.y*(0.012 + 0.05*rg2*rg2 + 0.016*rg2b + 0.035*pow(vnoise(vec2(az*2.6 + uFar.x, 7.7)), 3.));
  float r1p = uFar.y*(0.004 + 0.022*rg1 + 0.008*vnoise(vec2(az*37. + uFar.x, 6.3)));
  float e2 = el - r2p, e1 = el - r1p;
  float in2 = 1. - smoothstep(-fel, fel, e2), in1 = 1. - smoothstep(-fel, fel, e1);
  float deck = 1. - smoothstep(-0.008, 0.002, el + 0.014*(vnoise(vec2(az*13., 2.)) - 0.6));
  float c2 = az*150. + e2*260., c1 = az*230. - e1*400.;                      // shading strokes that lean, one way on each range
  float k2 = floor(c2), k1 = floor(c1);
  float hs2 = lineAA((fract(c2) - 0.5)/150., faz + fel*1.74, 0.6)*step(-0.008 - 0.03*h11(k2), e2)*step(0.45, h11(k2 + 7.))*in2;
  float hs1 = lineAA((fract(c1) - 0.5)/230., faz + fel*1.74, 0.6)*step(-0.004 - 0.014*h11(k1 + 3.), e1)*step(0.4, h11(k1 + 11.))*in1;
  float snowF = smoothstep(0.05, 0.058, el/max(uFar.y, 1e-3));
  float gdist = 1./max(0.02 - el, 0.02);
  vec2 gq = vec2(sin(az), -cos(az))*gdist*0.55 + uSky.z*uTime*vec2(-0.5, 0.3);
  float dn = 0.6*vnoise(gq) + 0.4*vnoise(gq*2.3 + 3.);
  float fdn = max(fwidth(dn), 1e-5);
  float dl = lineAA(fract(dn*7.) - 0.5, fdn*7., 0.7)*step(0.35, vnoise(gq*3.))*(1. - smoothstep(0.1, 0.3, fdn*7.));
  float rangeInk = max(max(lineAA(e2, fel, 0.9), hs2*0.6)*(1. - in1), max(lineAA(e1, fel, 1.0), hs1*0.7));
  ink = mix(ink*(1. - max(in2, in1)), dl*0.5, deck);
  ink = max(ink, rangeInk*(1. - deck));
  vec3 tint = mix(vec3(1.), mix(vec3(1.), uShade, 0.42*(1. - snowF)), in2*(1. - in1));
  tint = mix(tint, mix(vec3(1.), uShade, 0.7), in1);
  tint = mix(tint, mix(vec3(1.), uShade, 0.22*smoothstep(0.42, 0.6, dn)), deck);
  tint = mix(vec3(1.), tint, uFar.z)*mix(vec3(1.), uShade, 0.3*baseK*(1. - max(max(in2, in1), deck)));
  float fib = 0.035*(vnoise(vec2(az*60., el*90.)) - 0.5) + 0.03*(vnoise(vec2(az*7., el*9.) + 3.) - 0.5);
  vec3 col = mix(uPaper*(1. - fib)*tint, mix(uInk, uHalf, 0.6), clamp(ink, 0., 1.)*0.8);
  gl_FragColor = vec4(col, 1.);
}`,ua=`
attribute vec3 aCol; attribute vec4 aInfo; attribute float aEdge; attribute vec4 aAnim; attribute vec3 aPivot;
attribute vec4 aIPos; attribute vec4 aIQuat; attribute vec4 aIAnim;
varying vec2 vUv; varying vec3 vCol; varying vec3 vN; varying vec3 vNv; varying vec3 vVp; varying vec4 vInfo;
varying float vEdge; varying float vDist; varying float vTone; varying float vSnow;
${pa}
vec3 qrot(vec4 q, vec3 v){ return v + 2.*cross(q.xyz, cross(q.xyz, v) + q.w*v); }
void main(){
  vec3 p = position, n = normal;
  float ty = aAnim.x, ph = aIAnim.x + aAnim.z;
  vec3 r = p - aPivot;
  if (ty > 0.5 && ty < 1.5) {
    float a = aAnim.y*(sin(ph)*aIAnim.y + aIAnim.w);
    float c = cos(a), s = sin(a);
    p = aPivot + vec3(r.x*c - r.y*s, r.x*s + r.y*c, r.z);
    n = vec3(n.x*c - n.y*s, n.x*s + n.y*c, n.z);
  } else if (ty > 1.5 && ty < 2.5) {
    // (round 11) a leg that keeps its hoof where it was set down. One stride is 4.27 m of the animal's own length: for
    // the first three tenths of it the hoof stands on the ground and the leg is sheared back from the hip at exactly the
    // pace the body goes forward (0.64 m either side of the hip), then it is lifted and carried forward again.
    // aIAnim.y: the length of the step (1 at the gallop, a quarter of that standing).
    float cyc = fract(ph/6.2831853), tW = clamp((cyc - 0.3)/0.7, 0., 1.);
    float st = step(cyc, 0.3);
    float back = mix(1. - 2.*tW*tW*(3. - 2.*tW), 2.*cyc/0.3 - 1., st);
    float lift = (1. - st)*sin(3.14159265*tW);
    float w = aAnim.y;
    p.z += w*back*0.64*aIAnim.y - w*(1. - w)*lift*0.5*aIAnim.y;        // (the knee comes forward as the hoof is lifted)
    p.y += w*w*lift*0.3*aIAnim.y*aIAnim.y;
  } else if (ty > 2.5 && ty < 3.5) {
    float a = aAnim.y*(0.1*sin(ph)*aIAnim.y + aIAnim.w);
    float c = cos(a), s = sin(a);
    p = aPivot + vec3(r.x, r.y*c - r.z*s, r.y*s + r.z*c);
  } else if (ty > 3.5) {
    p.y += aAnim.y*sin(ph)*aIAnim.y;
  }
  vec3 wp = aIPos.xyz + qrot(aIQuat, p*aIPos.w);
  vec3 wn = qrot(aIQuat, n);
  vec4 mvPosition = modelViewMatrix*vec4(wp, 1.);
  vN = wn; vNv = mat3(modelViewMatrix)*wn; vVp = mvPosition.xyz;
  vUv = uv; vCol = aCol; vInfo = aInfo; vEdge = aEdge; vDist = length(mvPosition.xyz); vTone = aIAnim.z; vSnow = 0.;
  gl_Position = projectionMatrix*mvPosition;
  if (aIPos.w <= 0.) gl_Position = vec4(0., 0., 3., 1.);
  #include <fog_vertex>
}`,ga=`
attribute vec3 aBase; attribute vec4 aSeed;      // aSeed: size, aspect, seed, drift rate (0: a fixed card that never parts; under 0: one that drifts and thins but never clears)
uniform vec3 uDrift; uniform float uTime;
varying vec2 vQ; varying float vSeed; varying float vDist; varying float vFade; varying float vSize; varying float vPart;
void main(){
  float life = aSeed.w != 0. ? fract(uTime*abs(aSeed.w) + aSeed.z) : 0.5;
  // (round 12) a bank that stands behind a tree (aSeed.w under 0) does not travel and is not reborn: it sways about its
  // own place by under a third of its own height (so it stays behind its tree) and breathes between about two thirds
  // and the whole of its strength, never less, whatever the clock says. The other cards drift and part as before.
  float bank = step(aSeed.w, -1e-6), swing = sin(6.2831853*life);
  vec3 c = aBase + uDrift*aSeed.x*mix((life - 0.5)*1.6, 0.3*swing, bank);
  vec4 mv = modelViewMatrix*vec4(c, 1.);
  mv.xy += position.xy*vec2(aSeed.x*aSeed.y, aSeed.x);
  vQ = position.xy*vec2(aSeed.y, 1.); vSeed = aSeed.z; vDist = length(mv.xyz); vSize = aSeed.x; vPart = aSeed.w > 0. ? 1. : (aSeed.w < 0. ? 0.5 : 0.);
  vFade = mix(smoothstep(0., 0.2, life)*(1. - smoothstep(0.8, 1., life)), 0.84 + 0.16*sin(6.2831853*life + 1.3), bank);
  gl_Position = projectionMatrix*mv;
}`,xa=`
varying vec2 vQ; varying float vSeed; varying float vDist; varying float vFade; varying float vSize; varying float vPart;
uniform float uMistNear, uMistDots;
${W0}
float dots(vec2 g, float dens){
  vec2 i = floor(g); vec2 c = fract(g) - 0.5 - 0.6*(vec2(h21(i), h21(i + 3.)) - 0.5);
  return (1. - smoothstep(0.13, 0.2, length(c)))*step(h21(i + 9.), dens);
}
void main(){
  vec2 wq = vQ*vSize;
  float fw = max(max(fwidth(wq.x), fwidth(wq.y)), 1e-5);
  float d = length(vQ*vec2(0.5, 1.15));
  float n = 0.6*vnoise(vQ*1.6 + vSeed*17.) + 0.4*vnoise(vQ*4.3 + vSeed*3.);
  float body = (1. - d + (n - 0.5)*0.75)*vFade;
  float near = mix(1., smoothstep(uMistNear, uMistNear*3., vDist), vPart);
  float core = body*near;                                   // the blank parts as we come up to it
  float fb = max(fwidth(core), 1e-5);
  float low = 1. - smoothstep(-0.6, 0.5, vQ.y);
  float l = log2(max(fw*8./0.2, 1e-4)); float lo = floor(l), f = l - lo;
  float s0 = 0.2*exp2(lo);
  vec2 g0 = wq/s0, g1 = wq/(s0*2.) + 7.3;
  vec2 i0 = floor(g0), i1 = floor(g1);
  float r0 = length(fract(g0) - 0.5 - 0.6*(vec2(h21(i0 + 1.), h21(i0 + 4.)) - 0.5));
  float r1 = length(fract(g1) - 0.5 - 0.6*(vec2(h21(i1 + 1.), h21(i1 + 4.)) - 0.5));
  // the blank grows out of the stipple as dots of bare paper of uneven size, scattered at random, that widen until
  // they join into one blank core: never a hard outline, never rows of beads
  float cov = clamp((core - 0.15)*2.6, 0., 1.);
  float q0 = (0.05 + 0.7*cov)*(0.55 + 0.9*h21(i0 + 6.)), q1 = (0.05 + 0.7*cov)*(0.55 + 0.9*h21(i1 + 6.));
  float p0 = (1. - smoothstep(q0, q0 + 0.06, r0))*step(h21(i0 + 5.), 0.2 + 0.9*cov);
  float p1 = (1. - smoothstep(q1, q1 + 0.06, r1))*step(h21(i1 + 5.), 0.2 + 0.9*cov);
  float pap = max(mix(p0, p1, f)*step(0.03, cov), smoothstep(0.72, 0.92, cov));
  float clump = mix(1., smoothstep(0.3, 0.62, vnoise(wq*0.11 + vSeed*9.)), 0.85);
  float dn = smoothstep(0.1, 0.3, body)*(1. - smoothstep(0.5, 0.95, cov))*(0.3 + 0.45*low)*clump*mix(1., smoothstep(8., 26., vDist)*(1. - smoothstep(70., 150., vDist)), vPart)*mix(1., uMistDots, vPart);
  float st = mix(dots(g0, dn), dots(g1, dn), f);
  if (pap < 0.5 && st < 0.5) discard;
  float edge = lineAA(core - 0.72, fb, 0.7)*low*step(0.55, vnoise(vQ*3.7 + vSeed*5.));
  float ink = max(step(0.5, st)*0.78, edge*0.55);
  vec3 col = mix(uPaper, mix(uInk, uHalf, smoothstep(60., 400., vDist)), ink);
  gl_FragColor = vec4(col, 1.);
}`,ya=`
attribute vec3 aBase; attribute vec4 aSeed;      // aSeed: half height, aspect, seed, sway rate
uniform float uTime;
varying vec2 vQ; varying float vSeed; varying float vDist; varying float vSize; varying float vAsp;
void main(){
  vAsp = aSeed.y;
  vec3 c = aBase + vec3(-0.6, 0.25, -0.75)*sin(uTime*aSeed.w + aSeed.z*6.283)*aSeed.x*0.12;
  vec4 mv = modelViewMatrix*vec4(c, 1.);
  mv.xy += position.xy*vec2(aSeed.x*aSeed.y, aSeed.x);
  vQ = position.xy*vec2(aSeed.y, 1.); vSeed = aSeed.z; vDist = length(mv.xyz); vSize = aSeed.x;
  gl_Position = projectionMatrix*mv;
}`,wa=`
varying vec2 vQ; varying float vSeed; varying float vDist; varying float vSize; varying float vAsp;
${W0}
float beltBody(vec2 q, float asp, float seed, float t){
  vec2 e = vec2(q.x/asp, q.y > 0. ? q.y*1.12 : q.y*1.7);
  float n = 0.62*vnoise(q*1.25 + vec2(seed*17. + t, seed*3.)) + 0.38*vnoise(q*2.9 + vec2(seed*5. - t*1.6, 2.));
  return 1. - length(e) + (n - 0.5)*0.62*smoothstep(-0.55, 0.25, q.y) - 0.1;
}
void main(){
  float t = uTime*0.03;
  vec2 wq = vQ*vSize;
  float fw = max(max(fwidth(wq.x), fwidth(wq.y)), 1e-5);
  float a = max(vAsp, 0.5);
  float core = beltBody(vQ, a, vSeed, t);
  float under = beltBody(vQ + vec2(0., 0.09), a, vSeed, t) - core;       // > 0 on the underside of a swell
  float fb = max(fwidth(core), 1e-5);
  float lowZ = 1. - smoothstep(-0.34, -0.08, vQ.y);
  // the base: bare paper grows out of the stipple as dots that widen until they join
  float l = log2(max(fw*8./0.25, 1e-4)); float lo = floor(l), f = l - lo; float s0 = 0.25*exp2(lo);
  vec2 g0 = wq/s0, g1 = wq/(s0*2.) + 7.3; vec2 i0 = floor(g0), i1 = floor(g1);
  float r0 = length(fract(g0) - 0.5 - 0.6*(vec2(h21(i0 + 1.), h21(i0 + 4.)) - 0.5));
  float r1 = length(fract(g1) - 0.5 - 0.6*(vec2(h21(i1 + 1.), h21(i1 + 4.)) - 0.5));
  float cov = clamp((core + 0.07)*5., 0., 1.);
  float q0 = (0.05 + 0.75*cov)*(0.55 + 0.9*h21(i0 + 6.)), q1 = (0.05 + 0.75*cov)*(0.55 + 0.9*h21(i1 + 6.));
  float papLow = max(mix(1. - smoothstep(q0, q0 + 0.06, r0), 1. - smoothstep(q1, q1 + 0.06, r1), f)*step(0.04, cov), smoothstep(0.7, 0.9, cov));
  float pap = mix(smoothstep(-fb, fb, core), papLow, lowZ);
  // stipple along the base only, inside the bank and a little below it
  float dens = lowZ*smoothstep(-0.1, 0.0, core)*(1. - smoothstep(0.1, 0.34, core))*0.62;
  float st = mix((1. - smoothstep(0.14, 0.2, r0))*step(h21(i0 + 9.), dens), (1. - smoothstep(0.14, 0.2, r1))*step(h21(i1 + 9.), dens), f);
  if (pap < 0.5 && st < 0.5) discard;
  // the heaped top: a firm scalloped outline, form strokes under its swells and round the smaller heads inside it
  float topK = 1. - lowZ;
  float outl = lineAA(core, fb, 1.0)*step(0.12, vnoise(vQ*2.4 + vSeed*31.))*topK;
  float form = max(lineAA(core - 0.16, fb, 0.7)*step(0.3, vnoise(vQ*2.1 + vSeed*13. + 3.)), max(lineAA(core - 0.33, fb, 0.65)*step(0.4, vnoise(vQ*1.7 + vSeed*7. + 8.)),
    lineAA(core - 0.52, fb, 0.6)*step(0.5, vnoise(vQ*1.9 + vSeed*3. + 1.))))*smoothstep(0.0, 0.03, under);
  vec2 sq = vQ*3.3 + vec2(vSeed*23. + t*2., 5.);
  float n2 = vnoise(sq), under2 = vnoise(sq + vec2(0.17, 0.27)) - n2;
  float scal = lineAA(n2 - 0.6, max(fwidth(n2), 1e-5), 0.65)*smoothstep(0.0, 0.02, under2)*step(0.1, core);
  // the base: level ruling under a thin shade wash, ending upward on a wavy line (a cloud is a blank top over a ruled base)
  float wav = vnoise(vec2(vQ.x*1.4 + vSeed*9. + t, 3.)) - 0.5;
  float baseA = -0.06 + 0.24*wav - vQ.y, fbA = max(fwidth(baseA), 1e-5);
  float baseK = smoothstep(-fbA, fbA, baseA);
  float rule = hatch(wq.y, max(fwidth(wq.y), 1e-5), 1.1, 1e9, 0.34).x*step(0.2, vnoise(vec2(wq.x*0.05 + vSeed*5., floor(wq.y/1.1))));
  float ink = max(max(outl*0.9, max(form, scal)*0.72*(1. - baseK)), max(rule*0.62, lineAA(baseA, fbA, 0.8)*0.7*step(0.3, vnoise(vQ*3. + 7.)))*baseK*step(0.02, core))*step(0.5, pap);
  ink = max(ink, step(0.5, st)*0.8);
  vec3 col = mix(uPaper*mix(vec3(1.), uShade, 0.46*baseK*step(0.5, pap)), mix(uInk, uHalf, smoothstep(250., 900., vDist)), ink);
  gl_FragColor = vec4(col, 1.);
}`,Ma=`
varying vec3 vW; varying float vDist;
void main(){ vec4 w = modelMatrix*vec4(position, 1.); vW = w.xyz; vec4 mv = viewMatrix*w; vDist = length(mv.xyz); gl_Position = projectionMatrix*mv; }`,ba=`
varying vec3 vW; varying float vDist;
${W0}
void main(){
  vec2 p = vW.xz;
  vec2 q = p*0.012 + uTime*vec2(0.004, -0.007);
  float n = 0.6*vnoise(q) + 0.4*vnoise(q*2.6 + 4.);
  float north = mix(800., 884., smoothstep(-12., 10., p.x));
  float edge = (1. - smoothstep(300., 430., -p.x))*(1. - smoothstep(230., 330., p.x))*smoothstep(north, north + 60., p.y)*(1. - smoothstep(1150., 1260., p.y));
  // (round 4) no bank lies on the plain in front of the section, nor on the flank above the seam foot: the cloud keeps to the palms
  float v = n*1.1 + edge*0.22 - 0.72 - 0.9*(1. - smoothstep(north - 10., north + 50., p.y));
  float fw = max(max(fwidth(p.x), fwidth(p.y)), 1e-5);
  float fv = max(fwidth(v), 1e-5);
  float l = log2(max(fw*7./0.3, 1e-4)); float lo = floor(l), f = l - lo; float s0 = 0.3*exp2(lo);
  vec2 g0 = p/s0, g1 = p/(s0*2.) + 3.7;
  vec2 i0 = floor(g0), i1 = floor(g1);
  float r0 = length(fract(g0) - 0.5 - 0.3*(vec2(h21(i0), h21(i0 + 3.)) - 0.5));
  float r1 = length(fract(g1) - 0.5 - 0.3*(vec2(h21(i1), h21(i1 + 3.)) - 0.5));
  float dn = clamp(v*7. + 0.5, 0., 1.);
  // (round 5) where no cloud lies the sheet leaves nothing: no specks of paper or ink hanging over the plain
  float pap = mix(1. - smoothstep(0.1 + 0.62*dn, 0.16 + 0.62*dn, r0), 1. - smoothstep(0.1 + 0.62*dn, 0.16 + 0.62*dn, r1), f)*step(0.04, dn);
  float sd = smoothstep(0.0, 0.3, dn)*(1. - smoothstep(0.5, 0.95, dn))*0.5 + 0.2*smoothstep(0.5, 0.72, vnoise(q*3.1 + 2.))*(1. - smoothstep(60., 220., vDist))*step(0.04, dn);
  float dots = mix((1. - smoothstep(0.13, 0.2, r0))*step(h21(i0 + 9.), sd), (1. - smoothstep(0.13, 0.2, r1))*step(h21(i1 + 9.), sd), f);
  if (max(pap, dots) < 0.5) discard;
  float cont = max(lineAA(v - 0.16, fv, 0.7)*step(0.35, vnoise(p*0.05)), max(lineAA(v - 0.27, fv, 0.6)*step(0.5, vnoise(p*0.04 + 9.)), lineAA(v - 0.4, fv, 0.6)*step(0.55, vnoise(p*0.045 + 4.))));
  // (round 4) the top of the sheet is drawn: fine form lines round every swell, so that a bank lying among the palms reads
  // as engraved cloud and not as a hole in the plate
  float fl = lineAA((fract(v*13. + 0.5) - 0.5)/13., fv, 0.5)*step(0.3, vnoise(p*0.07 + 2.))*(1. - smoothstep(0.03, 0.07, fv*13.))*smoothstep(0.02, 0.08, v);
  float ink = max(step(0.5, dots)*0.75, max(cont*0.6*(1. - smoothstep(200., 500., vDist)), fl*0.42));
  vec3 col = mix(uPaper, mix(uInk, uHalf, smoothstep(80., 500., vDist)), ink);
  gl_FragColor = vec4(col, 1.);
}`,ka=`
attribute float aLand;
varying vec3 vPos; varying vec3 vNrm; varying float vLand; varying float vDist;
void main(){
  vPos = position; vNrm = normal; vLand = aLand;
  vec4 mv = modelViewMatrix*vec4(position, 1.);
  vDist = length(mv.xyz);
  gl_Position = projectionMatrix*mv;
}`,za=`
varying vec3 vPos; varying vec3 vNrm; varying float vLand; varying float vDist;
uniform vec3 uGreen, uOlive, uGamb; uniform vec4 uEast;      // uEast: snowline (m), tint strength, drift, -
${W0}
${da}
// (round 5) map marks are cut at three scales and each is drawn only while it is a few pixels across (never over about 2%
// of the frame's height), every edge one pixel firm: a tree as a small arc with its shadow tick, grass as a short stroke
float treeMark(vec2 p, float cell, float px){
  vec2 tg = p/cell; tg.x += 0.5*floor(tg.y);
  vec2 ti = floor(tg); vec2 tc = fract(tg) - 0.5 - 0.35*(vec2(h21(ti + 1.), h21(ti + 4.)) - 0.5);
  float tpx = px/cell;
  float crown = lineAA(length(tc) - (0.3 + 0.12*h21(ti + 6.)), tpx, 0.6)*step(tc.y, 0.12);
  float tick = 1. - smoothstep(-tpx, tpx, length(tc - vec2(0.12, 0.14)) - 0.13);
  float keepM = cell > 8. ? 1. : 0.85*step(0.3, h21(ti + 13.));
  return max(crown, tick*0.85)*keepM*smoothstep(0.075, 0.1, tpx)*(1. - smoothstep(0.2, 0.3, tpx));
}
float grassMark(vec2 p, float cell, float fx, float px){
  vec2 sg = p/cell; vec2 si = floor(sg); vec2 sc = fract(sg) - 0.5 - 0.5*(vec2(h21(si + 2.), h21(si + 5.)) - 0.5);
  float tpx = px/cell;
  return lineAA(sc.x*cell, fx, 0.55)*step(abs(sc.y), 0.2)*step(0.55, h21(si + 8.))*smoothstep(0.035, 0.05, tpx)*(1. - smoothstep(0.1, 0.16, tpx));
}
void main(){
  vec2 p = vPos.xz;
  float vD = length(vPos - cameraPosition);                    // (the sheet is too coarse a mesh to carry a distance at its corners)
  vec3 n = normalize(vNrm + vec3(0., 1e-4, 0.));
  vec2 fw2 = fwidth(p);
  float fx = max(fw2.x, 1e-5), fz = max(fw2.y, 1e-5), px = max(fx, fz);
  float h = vLand;
  float burr = vnoise(p*0.012) - 0.5;
  float cA = h + burr*5.;
  float cB = p.y + burr*30.;
  float cC = (p.x + p.y)*0.7071 + h*0.8;
  float fA = max(fwidth(h), 1e-4), fB = fz, fC = max(fwidth((p.x + p.y)*0.7071 + h*0.8), 1e-5);
  float fDg = max(fwidth((p.x + p.y)*0.7071), 1e-5);
  // the river: a meandering centre line in z, its signed distance, its width
  float rx = 430. + 130.*sin(p.y*0.0021 + 1.) + 70.*sin(p.y*0.0057 + 2.3) + 26.*sin(p.y*0.0131);
  float rxd = 0.273*cos(p.y*0.0021 + 1.) + 0.399*cos(p.y*0.0057 + 2.3) + 0.341*cos(p.y*0.0131);
  float rd = (p.x - rx)/sqrt(1. + rxd*rxd);
  float rw = 24. + 9.*sin(p.y*0.0043 + 0.7);
  float frd = max(fwidth(rd), 1e-5);
  // cloud field
  vec2 cq = p*0.0016 + uEast.z*uTime*vec2(1., -0.6);
  float cn = 0.6*vnoise(cq) + 0.4*vnoise(cq*2.7 + 5.);
  float fcn = max(fwidth(cn), 1e-5);
  vec2 cqs = cq + uSun.xz*0.08;
  float cns = 0.6*vnoise(cqs) + 0.4*vnoise(cqs*2.7 + 5.);

  float sK = smoothstep(590., 760., p.y);                       // toward the palm valley the drawn country comes close up to the foot of the page
  // (round 5) the drawn country stops at a firm edge (the same curve the world plants by): the wash ends on it, one pixel
  // firm, and the ruling trails on a few metres past it, ragged, as the lines of a vignette do
  // (by the palm valley, where we come in low over it, the country runs right up to the foot of the page)
  float sK2 = smoothstep(752., 800., p.y);
  float bEdge = mix(mix(140., 7., sK), 2.6, sK2) + (5.*sin(p.y*0.061) + 2.5*sin(p.y*0.173 + 1.3))*mix(1., 0.22, sK2) + 24.*(1. - sK)*sin(p.y*0.011 + 0.5);
  float mA = p.x - bEdge, fmA = max(fwidth(p.x - bEdge), 1e-4);
  float margin = smoothstep(-fmA, fmA, mA);
  float marginInk = smoothstep(-fmA, fmA, mA + (2. + 7.*vnoise(vec2(p.y*0.4, 3.)))*mix(1., 0.25, sK2));
  float hill = smoothstep(4., 30., h);
  float far1 = smoothstep(900., 2700., p.x);
  float snow = smoothstep(uEast.x - 30., uEast.x + 30., h + 70.*(vnoise(p*0.004) - 0.5))*smoothstep(0.3, 0.6, n.y + 0.2*vnoise(p*0.02));
  float ndl = clamp(dot(n, uSun), 0., 1.);
  float shade = (1. - smoothstep(0.3, 0.8, ndl))*hill;
  float forestN = vnoise(p*0.0035 + 7.)*0.6 + vnoise(p*0.011 + 2.)*0.4;
  float water = (1. - smoothstep(rw - frd, rw + frd, abs(rd)))*(1. - hill);
  float ffn = max(fwidth(forestN), 1e-5);                       // (round 5) wood, gallery and thicket end on firm edges: flat tints side by side
  float gallery = smoothstep(-frd, frd, rw + 34. + 22.*vnoise(p*0.03 + 5.) - abs(rd))*(1. - hill);
  float forest = max(smoothstep(0.51 - ffn, 0.51 + ffn, forestN)*(1. - smoothstep(260., 380., h)), gallery)*(1. - water)*(1. - snow);
  float lowl = (1. - hill)*(1. - water);

  // ---- the hills: contours, broken fall-line hachures, a diagonal in deep shade
  float tone = clamp(mix(0.24, 0.4, forest)*(1. - snow) + shade*(0.44 - 0.2*snow), 0., 0.86);
  vec2 hA = hatch(cA, fA, 2.5, 500., tone);
  vec2 hB = hatch(cB, fB, 1.6, 400., tone);
  vec2 hC = hatch(cC, fC, 2.0, 400., tone);
  float farA = smoothstep(5., 30., 6.*fA);
  float lA = smoothstep(0.1, 0.3, tone)*(1. - 0.6*farA);
  float lB = smoothstep(0.42 - 0.3*farA, 0.62 - 0.3*farA, tone), lC = smoothstep(0.72, 0.9, tone)*0.55;
  float ocB = log2(max(6.0*fB/1.6, 1e-4));
  float loB = floor(ocB), fBk = ocB - loB, PB = 1.6*exp2(loB);
  float brk = mix(smoothstep(0.3, 0.45, vnoise(vec2(cB/PB*0.7 + 3.1, p.x/(PB*5.)))), smoothstep(0.3, 0.45, vnoise(vec2(cB/PB*0.35 + 3.1, p.x/(PB*10.)))), fBk);
  float hillInk = (1. - (1. - hA.x*lA)*(1. - hB.x*lB*brk)*(1. - hC.x*lC))*hill;
  hillInk = mix(hillInk, hA.x*0.45*smoothstep(0.45, 0.7, vnoise(p*0.02 + 7.)) + hillInk*shade*0.6, snow);

  // ---- map marks on the plain and the lower slopes: trees as small arcs with a shadow tick, savanna as grass ticks
  float treeInk = max(max(treeMark(p, 11., px), max(treeMark(p + 37., 3.6, px), treeMark(p + 91., 1.2, px))), 0.2*smoothstep(0.2, 0.3, px/11.));
  float grass = max(grassMark(p, 6., fx, px), max(grassMark(p + 13., 2., fx, px), grassMark(p + 29., 0.66, fx, px)));
  float mapInk = max(treeInk*forest, grass*max(1. - forest, 0.5))*(1. - water)*(1. - smoothstep(0.55, 0.8, tone)*hill);
  // ---- (round 5) the floor of the wood close under us: form lines round every swell of the ground, and thickets in
  // crossed lines under a verditer shade, so that what the understorey stands on is drawn at the scale we see it from
  float hN = 5.*vnoise(p*0.017 + 3.) + 1.6*vnoise(p*0.058 + 11.);
  float thN = vnoise(p*0.043 + 21.) - 0.58 - 0.5*max(smoothstep(250., 420., p.x), 1. - smoothstep(600., 720., p.y));
  float fth = max(fwidth(thN), 1e-5);
  float thick = smoothstep(-fth, fth, thN)*forest*lowl;
  float nearG = 1. - smoothstep(0.14, 0.45, px);
  vec2 hG = hatch(hN + burr*0.6, max(fwidth(hN), 1e-5), 0.3, 1e9, 0.26 + 0.3*thick);
  vec2 hX = hatch((p.x - p.y)*0.7071 + burr*8., max(fwidth((p.x - p.y)*0.7071), 1e-5), 1.3, 1e9, 0.5);
  float woodInk = max(hG.x*0.72*nearG, max(hX.x*0.6, lineAA(thN, fth, 0.8)*0.8)*thick*(1. - smoothstep(0.4, 1.2, px)))*forest*lowl;
  mapInk = max(mapInk, woodInk);

  // ---- the river: banks drawn twice, flow lines with travelling dashes, stippled bars
  float bank = max(lineAA(abs(rd) - rw, frd, 1.0), lineAA(abs(rd) - rw - 3., frd, 0.5)*step(0.4, vnoise(vec2(p.y*0.05, sign(rd)*3.)))*0.7)*(1. - hill);
  float t4 = rd/rw*3.; float tk = floor(t4 + 0.5);
  float flow = (1. - smoothstep(0.5, 1.3, abs(t4 - tk)*rw/3./frd))*step(0.42, fract((p.y + uTime*(15. + 6.*h11(tk)))/(42. + 18.*h11(tk + 3.)) + h11(tk + 7.)))
    *(1. - smoothstep(0.2, 0.6, frd/rw*3.))*step(abs(tk), 2.5);
  float bar = smoothstep(0.64, 0.76, vnoise(vec2(p.y*0.006 + 4., rd*0.03)));
  vec2 bg = p/3.; vec2 bi = floor(bg);
  float bdot = (1. - smoothstep(0.12, 0.22, length(fract(bg) - 0.5 - 0.4*(vec2(h21(bi), h21(bi + 3.)) - 0.5))))*step(0.4, h21(bi + 9.))*(1. - smoothstep(0.1, 0.3, px/3.));
  float riverInk = max(flow*0.7*(1. - bar), bdot*bar*0.8)*water;

  // ---- fields on the plain: parcels ruled each its own way and hedged; the tint keeps to the ruling
  vec2 pcl = p/120. + 0.4*vec2(vnoise(p*0.005), vnoise(p*0.005 + 9.));
  vec2 pci = floor(pcl); float phh = h21(pci + 2.);
  float fdir = phh < 0.34 ? p.x : phh < 0.67 ? p.y : (p.x + p.y)*0.7071;
  float ffd = phh < 0.34 ? fx : phh < 0.67 ? fz : fDg;
  vec2 hF = hatch(fdir + burr*10., ffd, 2.2, 900., 0.16 + 0.2*h21(pci + 5.));
  vec2 pe = abs(fract(pcl) - 0.5);
  float hedge = lineAA((0.5 - max(pe.x, pe.y))*120., px, 0.9)*step(0.3, h21(pci + 11.));
  float fieldInk = max(hF.x*(1. - forest)*0.7, hedge*0.6)*lowl;
  float ink = max(max(hillInk, max(mapInk, fieldInk)), max(riverInk, bank));
  ink *= mix(1., 0.72, far1);
  // the bare margin by the foot of the page: the ledger ruling and its column of script run out into the drawing
  float ledger = max(hatchL(p.x, fx, 20., 1e9, 0.1, 0.).x*0.45, hatchL(p.y, fz, 100., 1e9, 0.1, 0.).x*0.3);
  float scr = script(vec2(-p.y, p.x - 30.)/5., fz/5., fx/5.)*step(p.x, 110.)*step(40., p.x)*step(abs(p.y), 700.);
  ink = mix(max(ledger, scr), ink, marginInk);

  // ---- the second plate: flat tints
  vec3 landT = mix(mix(uOlive, uGamb, 0.3), uGreen*vec3(0.95, 1., 0.92), forest);
  landT = mix(landT, mix(vec3(1.), uShade, 0.85), far1*0.8);
  landT = mix(landT, landT*uShade, shade*0.55);
  landT = mix(landT, mix(vec3(1.), uShade, shade*0.5), snow);
  landT = mix(landT, mix(vec3(1.), uShade, 0.55 - 0.3*bar), water);
  landT = mix(landT, mix(uGamb, uGreen, h21(pci + 7.)), 0.4*lowl*(1. - forest)*(1. - far1));
  landT = mix(landT, landT*mix(vec3(1.), uShade, 0.75), thick);
  float landK = mix(0.78, 0.6, far1)*margin*uEast.y*mix(1., 0.4 + 0.6*smoothstep(hF.y*0.8, hF.y*0.8 + 0.25, 0.6), lowl*(1. - forest));

  // ---- the cloud sea: blank paper in nested scalloped outlines, ruled and tinted on the flanks away from the sun
  float cl = smoothstep(1., 9., vPos.y - vLand + 8.*(vnoise(p*0.013) - 0.5));
  float lee = smoothstep(0.0, 0.035, cn - cns);
  float scal = lineAA(fract(cn*9.) - 0.5, fcn*9., 0.8)*step(0.3, vnoise(cq*7.))*(1. - smoothstep(0.12, 0.35, fcn*9.));
  float leeH = hatch(cB, fB, 1.6, 1e9, 0.2).x*lee*0.5;
  float shore = (1. - abs(cl*2. - 1.))*step(0.45, vnoise(p*0.21))*(1. - smoothstep(0.5, 2.5, px));
  float cloudInk = max(max(scal*0.7, leeH), shore*0.6);
  vec3 cloudT = mix(vec3(1.), uShade, 0.34*lee);

  ink = mix(ink, cloudInk, cl);
  vec3 wash = mix(mix(vec3(1.), landT, landK), cloudT, cl);
  vec3 paperTint = vec3(1.) - fibre(p, px) - foxing(p + 300.)*0.2*vec3(0.25, 0.5, 0.85)*(1. - margin);
  vec3 inkc = mix(uInk, uHalf, smoothstep(150., 700., vD));
  vec3 col = mix(uPaper*paperTint*wash, inkc, clamp(ink, 0., 1.));
  gl_FragColor = vec4(col, 1.);
}`,Aa=`
attribute vec3 aBase; attribute float aSeed;
uniform float uTime, uResY;
uniform vec3 uCam, uVel; uniform vec3 uFall;     // uFall: amount, stroke length, dots (1) or strokes (0)
varying vec2 vQ; varying float vA;
void main(){
  vec3 c = aBase + uVel*(uTime*(0.8 + 0.4*aSeed));
  c = mod(c - uCam + 30., 60.) - 30. + uCam;
  vec4 mv = modelViewMatrix*vec4(c, 1.);
  float dist = length(mv.xyz);
  vec3 ax = normalize(mat3(modelViewMatrix)*uVel + vec3(1e-5, 0., 0.));
  vec2 sd = normalize(vec2(-ax.y, ax.x) + vec2(1e-5, 0.));
  float pxm = dist*2.0/(projectionMatrix[1][1]*uResY);
  float w = max(0.012, 0.8*pxm)*mix(1., 1.9, uFall.z);
  float len = mix(uFall.y, w, uFall.z);
  mv.xy += ax.xy*position.y*len + sd*position.x*w;
  vQ = position.xy;
  vA = step(aSeed, uFall.x)*smoothstep(3., 9., dist)*(1. - smoothstep(mix(22., 34., uFall.z), mix(30., 47., uFall.z), dist));
  gl_Position = projectionMatrix*mv;
  if (vA <= 0.01) gl_Position = vec4(0., 0., 3., 1.);
}`,Sa=`
varying vec2 vQ; varying float vA;
uniform vec3 uFall;
${W0}
void main(){
  float d = mix(abs(vQ.x), length(vQ), uFall.z);
  float a = (1. - smoothstep(0.55, 1., d))*vA;
  if (a < 0.5) discard;
  gl_FragColor = vec4(mix(uInk, uHalf, 0.35), 1.);
}`,$0=new d.Vector3,k0=new d.Vector3,Y0=new d.Vector3;function n0(s,a,l,m,F,A,h,p={}){const v=s.n,u=a.length;let y=0;const S=w=>typeof l=="function"?l(w/(u-1)):l[w];k0.set(0,1,0);for(let w=0;w<u;w++){const N=a[w],P=a[Math.max(w-1,0)],T=a[Math.min(w+1,u-1)];$0.set(T[0]-P[0],T[1]-P[1],T[2]-P[2]).normalize(),w===0&&Math.abs($0.y)>.9&&k0.set(1,0,0),k0.addScaledVector($0,-k0.dot($0)),k0.lengthSq()<1e-6&&k0.set($0.z,0,-$0.x).addScalar(.001),k0.normalize(),Y0.crossVectors($0,k0),w>0&&(y+=Math.hypot(N[0]-P[0],N[1]-P[1],N[2]-P[2]));const D=w/(u-1),q=Math.max(S(w),.003),R=(p.sway0??0)+((p.sway1??0)-(p.sway0??0))*D;for(let C=0;C<=m;C++){const Q=C/m*X,Z=Math.cos(Q),L=Math.sin(Q),O=k0.x*Z+Y0.x*L*(p.flat??1),o0=k0.y*Z+Y0.y*L*(p.flat??1),I0=k0.z*Z+Y0.z*L*(p.flat??1);ko(s,[N[0]+O*q,N[1]+o0*q,N[2]+I0*q],[k0.x*Z+Y0.x*L,k0.y*Z+Y0.y*L,k0.z*Z+Y0.z*L],Q*(p.ru??Math.max(q,.12)),y*(p.vs??1),p.colFn?p.colFn(D,o0):F,p.toneFn?p.toneFn(D,o0):A,R,h,p.kind??0)}}for(let w=0;w<u-1;w++)for(let N=0;N<m;N++){const P=v+w*(m+1)+N,T=P+1,D=P+m+1,q=D+1;s.idx.push(P,T,D,T,q,D)}}const Za=(s,a=.55)=>l=>s*Math.pow(Math.sin(Math.PI*p0(l*.96+.02,0,1)),a);function Ao(s,a,l,m,F,A=0){for(let h=a;h<s.n;h++)s.pos[h*3]+=l,s.pos[h*3+1]+=m,s.pos[h*3+2]+=F,s.uv[h*2]+=A}function So(s,a,l,m,F,A,h,p,v,u,y,S=5){const w=Math.cos(l),N=Math.sin(l),P=-N,T=w;for(let D=-1;D<=1;D+=2){const q=[],R=[];for(let C=0;C<=S;C++){const Q=C/S,Z=m*Math.sin(Q*1.4)/Math.sin(1.4),L=F*m*Q-A*m*Q*Q,O=h*Math.pow(Math.sin(Math.PI*Math.min(1,Q*.9+.09)),.7)*.5;q.push([a[0]+w*Z+P*D*O*.92,a[1]+L-O*.38,a[2]+N*Z+T*D*O*.92]),R.push(Math.max(O,.02))}J(s,q,R,[P*D*.92,-.38,T*D*.92],p,v,u*.3,u,y,1,6)}}function Oe(s,a,l){const m=r0(),F=d0(a.pal[2],.52),A=a.green.clone().multiplyScalar(l.dark??.82),h=s.range(-1,1)*l.lean,p=l.h,v=[h,p,.5*h];Ke(m,u=>[h*u*u,p*u,.5*h*u*u],u=>l.r*(1-.34*u)+l.r*.3*Math.exp(-u*14)+l.r*.25*Math.exp(-(1-u)*30),l.sides,l.segs,F,.2,l.sway,70,!0);for(let u=0;u<l.fronds;u++){const y=u/l.fronds*X+s.range(-.25,.25),S=u%3/2;So(m,[v[0],v[1]+.3,v[2]],y,l.L*s.range(.85,1.12),j(1.05,.2,S)+s.range(-.1,.1),j(.75,.9,S),l.w,A,.42,l.sway*4,26,l.fsegs)}return b0(m)}function Fo(s,a){const l=r0(),m=d0(a.pal[1],.55),F=a.green.clone().lerp(a.verd,.25);Ke(l,A=>[.25*Math.sin(A*2),7*A,.15*A],A=>.3-.1*A,5,2,m,.62,.3,30,!0);for(let A=0;A<10;A++){const h=A/10*X+s.range(-.2,.2),p=A%2;So(l,[.25*Math.sin(2),7,.15],h,s.range(3.3,4.4),p?.75:.4,p?.8:.72,1.35,F,.36+.08*p,1.4,22,4)}return b0(l)}function Io(s,a){const l=r0(),m=a.green.clone().lerp(a.olive,.4);for(let F=0;F<5;F++){const A=F/5*X+s.range(-.3,.3),h=Math.cos(A),p=Math.sin(A),v=s.range(1.1,1.9);J(l,[[h*.1,.05,p*.1],[h*v*.55,v*.62,p*v*.55],[h*v,v*.42,p*v]],[.1,.34,.03],[-p,0,h],m,.4,.1,.5,12,1.6,7)}return b0(l)}function Fa(s,a){const l=r0(),m=d0(a.pal[1],.55),F=a.green.clone().lerp(a.olive,.18),A=a.green.clone().multiplyScalar(.84);Ke(l,h=>[0,5*h,0],h=>.2-.05*h,3,1,m,.62,0,30,!0);for(let h=0;h<7;h++){const p=h%2===1,v=h/7*X+s.range(-.2,.2),u=Math.cos(v),y=Math.sin(v),S=(p?2.1:2.7)*s.range(.9,1.1),w=p?.46:.3,N=p?.34:.04;J(l,[[u*.15,5.05,y*.15],[u*S*.4,5+S*w*.9,y*S*.4],[u*S*.74,5+S*w,y*S*.74],[u*S,5+S*N,y*S]],[.12,.56,.5,.04],[-y,0,u],p?A:F,p?.19:.12,.08,.5,12,1.5,7)}return b0(l)}function Ia(s,a){const l=r0(),m=a.green.clone().lerp(a.olive,.25),F=a.green.clone().multiplyScalar(.8);for(let A=0;A<8;A++){const h=A%3===0,p=A/8*X+s.range(-.25,.25),v=Math.cos(p),u=Math.sin(p),y=(h?1.5:2.5)*s.range(.85,1.15),S=h?1.15:.55,w=h?.95:.2;J(l,[[v*.12,.08,u*.12],[v*y*.36,y*S*.52,u*y*.36],[v*y*.72,y*S*.6,u*y*.72],[v*y,y*w*.5,u*y]],[.12,.42,.36,.03],[-u,0,v],h?F:m,h?.5:.38,.1,.55,12,1.5,7)}return b0(l)}function qo(s,a){const l=r0(),m=a.green.clone().multiplyScalar(.9);for(let h=0;h<3;h++){const p=h/3*X+s.range(-.4,.4),v=Math.cos(p),u=Math.sin(p);J(l,[[v*.1,0,u*.1],[v*.5,1.5,u*.5],[v*1,2.7,u*1],[v*1.7,3.1,u*1.7]],[.05,.32,.5,.04],[-u,0,v],m,.42,.1,.6,14,1.2)}const F=[],A=[];for(let h=0;h<=5;h++)F.push([.35+.12*(h%2?1:-1),2.2-h*.3,.2]),A.push(h===0||h===5?.03:.17);return J(l,F,A,[1,0,0],a.verm,.25,.2,.5,10,2.5),b0(l)}function qa(s,a){const l=r0(),m=a.olive.clone().lerp(a.gamb,.35),F=d0(a.pal[2],.55);for(let A=0;A<5;A++){const h=A/5*X+s.range(-.4,.4),p=Math.cos(h),v=Math.sin(h),u=s.range(.55,.95),y=s.range(.2,.55);J(l,[[p*.05,0,v*.05],[p*u*y*.4,u*.62,v*u*y*.4],[p*u*y*1.25,u*.92,v*u*y*1.25]],[.075,.05,.008],[-v,0,p],A%3?m:F,.3,.05,.4,5,3)}return b0(l)}function Vo(s,a,l){const m=r0(),F=d0(a.pal[2],.55),A=a.olive.clone().lerp(a.verd,.35),h=a.green.clone().multiplyScalar(.92);n0(m,[[0,-.5,0],[.15,3,.1],[0,7,-.1],[.3,10.5,.2],[.1,13,0]],[.85,.62,.55,.42,.2],8,F,.5,40);const p=[[.1,13.4,0]];for(let v=0;v<5;v++){const u=v===0?0:l?j(1.9,4.4,(v-1)/3)+s.range(-.2,.2):v/5*X+s.range(-.35,.35),y=Math.cos(u),S=Math.sin(u),w=v===0?7.6:s.range(6,10.5),N=v===0?7.2:s.range(5,7.5),P=v===0?.6:s.range(1.5,3.5),T=[];for(let D=0;D<=4;D++){const q=D/4;T.push([y*(.2+N*q),w+P*q*q+.35*Math.sin(q*5+v),S*(.2+N*q)])}n0(m,T,[.36,.32,.27,.21,.1],6,F,.5,30,{colFn:(D,q)=>q>.35?A:F,toneFn:(D,q)=>q>.35?.3:.55}),l&&v===0||p.push(T[4],[T[3][0]-S*1.2,T[3][1]+1.3,T[3][2]+y*1.2]);for(let D=0;D<5;D++){const q=s.range(.15,.95),R=Math.min(3,Math.floor(q*4)),C=q*4-R,Q=[0,1,2].map(L=>j(T[R][L],T[R+1][L],C)),Z=s.range(.7,1.9);J(m,[[Q[0],Q[1]-.2,Q[2]],[Q[0],Q[1]-.2-Z,Q[2]]],[.16,.02],[y,0,S],A,.42,.05,.45,8,3)}for(let D=0;D<2;D++){const q=v===0?.74+D*.2:s.range(.25,.85),R=Math.min(3,Math.floor(q*4)),C=q*4-R,Q=[0,1,2].map(Z=>j(T[R][Z],T[R+1][Z],C));for(let Z=0;Z<7;Z++){const L=Z/7*X+D,O=Math.cos(L),o0=Math.sin(L),I0=Z===6;J(m,[[Q[0],Q[1]+.25,Q[2]],[Q[0]+O*(I0?.1:.6),Q[1]+(I0?1:.75),Q[2]+o0*(I0?.1:.6)]],[.13,.02],[-o0,0,O],I0?a.verm:a.green,I0?.2:.4,.02,.2,6,3)}}}for(const v of p)for(let u=0;u<3;u++){const y=m.n,S=s.range(1.15,1.9);zt(m,S,S*s.range(.65,.95),7,3,.26,s,u===1?h:h.clone().lerp(u?a.verd:a.olive,.35),.38+.07*u,2.6,.6,2),Ao(m,y,v[0]+s.range(-2.1,2.1),v[1]-.5+s.range(-.4,1.5),v[2]+s.range(-2.1,2.1),s.range(0,20))}return b0(m)}function Va(s,a){const l=r0(),m=d0(a.pal[2],.5),F=a.green.clone().multiplyScalar(.88),A=d0(a.pal[6],.6).lerp(new d.Color(.93,.5,.6),.55);Ke(l,h=>[.3*Math.sin(h*2.4),4.2*h,.2*h],h=>.17-.07*h,5,2,m,.5,.2,20,!0);for(let h=0;h<3;h++){const p=l.n,v=h/3*X+s.range(-.4,.4),u=s.range(1.1,1.5),y=.2+Math.cos(v)*.9,S=Math.sin(v)*.9,w=3.5+.45*h;zt(l,u,u*.8,6,2,.25,s,h?F:F.clone().lerp(a.olive,.3),.4,3,.5,2),Ao(l,p,y,w,S,h*7);for(let N=0;N<2;N++){const P=v+(N?1.3:-.9)+s.range(-.3,.3),T=y+Math.cos(P)*u*.55,D=S+Math.sin(P)*u*.55,q=w+u*.55,R=[[T,q,D],[T+.08,q+.5,D],[T+.12,q+1.15,D+.04]];J(l,R,[.36,.28,.04],[Math.cos(P+1.57),0,Math.sin(P+1.57)],A,.1,.3,.6,5,3),J(l,R,[.36,.28,.04],[Math.cos(P),0,Math.sin(P)],A,.1,.3,.6,5,3)}}return b0(l)}function Ba(s,a){const l=r0(),m=d0(a.pal[1],.7).lerp(d0(a.pal[2],.9),.3),F=(A,h,p,v,u,y)=>{const S=[],w=[],N=y===0?8:5;let P=p,T=A,D=h;for(let q=0;q<=N;q++){const R=q/N;S.push([.16+.03*y,T,D]),w.push(Math.max(.014,u*(1-.92*R))),P+=s.range(-.3,.3)-.25*P*(y===0?1:.2),T-=Math.cos(P)*v/N,D+=Math.sin(P)*v/N}if(J(l,S,w,Math.abs(Math.sin(p))>.72?[0,1,0]:[0,0,1],m,.78,0,0,6,3,1),y<2)for(let q=0,R=y===0?6:2;q<R;q++){const C=1+Math.floor(s()*(N-2)),Q=q%2?1:-1;F(S[C][1],S[C][2],p*.3+Q*s.range(.55,1.15),v*s.range(.28,.5)*(1-.4*C/N),w[C]*.72,y+1)}};return F(0,0,0,9.6,.36,0),b0(l)}function Pa(s,a){const l=r0(),m=d0(a.pal[2].clone().lerp(a.pal[1],.5),.7),F=(A,h,p,v,u,y,S,w,N,P,T)=>{const D=l.n;zt(l,A,h,p,v,.4,s,m,T,6,0,4);for(let q=D;q<l.n;q++){const R=l.pos[q*3],C=l.pos[q*3+1],Q=l.pos[q*3+2];l.pos[q*3]=R*w+C*P+u,l.pos[q*3+1]=C+y,l.pos[q*3+2]=Q*N-C*P*.5+S,l.uv[q*2]+=D*.37}};return F(3.3,5.2,9,4,0,-.8,0,1.2,.9,.24,.36),F(2.2,9,8,5,-1.7,-.8,1.3,.9,1,-.1,.44),F(2,3,7,3,3.2,-.6,-.8,1.1,1.2,.32,.3),F(1.5,2.1,7,3,-3.5,-.5,-1.4,1.2,.9,-.25,.34),F(1.1,1.4,6,2,1.3,-.3,2.7,1,1.1,.1,.28),F(.8,1,6,2,-1,-.3,3.4,1.3,.9,.2,.3),b0(l)}function Ta(s,a){const l=r0(),m=a.green.clone().multiplyScalar(.85);for(let F=0;F<3;F++){const A=(F-1)*1.6+s.range(-.4,.4),h=s.range(3.5,8),p=[],v=[],u=7;for(let y=0;y<=u;y++){const S=y/u;p.push([0,-h*S,A+.35*Math.sin(S*7+F*2)*S]),v.push(.07-.03*S)}J(l,p,v,[0,0,1],m,.6,0,.4,8,3);for(let y=1;y<u;y++){const S=p[y],w=y%2?1:-1,N=.4*(y/u);if(J(l,[[.02,S[1],S[2]],[.02,S[1]-.25,S[2]+w*.42]],[.2,.02],[0,.85,w*.5],m,.45,N,N,8,3),y%3===1){const P=S[1]-.5,T=S[2]-w*.3;J(l,[[.05,P,T-.3],[.05,P,T],[.05,P,T+.3]],[.02,.17,.02],[0,1,0],a.verm,.18,N,N,6,3),J(l,[[.06,P-.3,T],[.06,P,T],[.06,P+.3,T]],[.02,.17,.02],[0,0,1],a.verm,.18,N,N,6,3)}}}return b0(l)}function ue(s,a,l,m,F,A){s.anim=s.anim||[],s.piv=s.piv||[];for(let h=a;h<s.n;h++){const p=s.pos[h*3],v=s.pos[h*3+1],u=s.pos[h*3+2];s.anim[h]=[l,m(p,v,u),typeof F=="function"?F(p,v,u):F,0],s.piv[h]=A}}function re(s,a,l){const m=b0(s),F=new d.InstancedBufferGeometry;F.setIndex(m.index);for(const S of["position","normal","uv","aCol","aInfo","aEdge"])F.setAttribute(S,m.attributes[S]);const A=new Float32Array(s.n*4),h=new Float32Array(s.n*3);for(let S=0;S<s.n;S++){const w=s.anim&&s.anim[S];w&&(A.set(w,S*4),h.set(s.piv[S],S*3))}F.setAttribute("aAnim",new d.BufferAttribute(A,4)),F.setAttribute("aPivot",new d.BufferAttribute(h,3));const p=new d.InstancedBufferAttribute(new Float32Array(l*4),4),v=new d.InstancedBufferAttribute(new Float32Array(l*4),4),u=new d.InstancedBufferAttribute(new Float32Array(l*4),4);for(const S of[p,v,u])S.setUsage(d.DynamicDrawUsage);for(let S=0;S<l;S++)v.array[S*4+3]=1;F.setAttribute("aIPos",p),F.setAttribute("aIQuat",v),F.setAttribute("aIAnim",u),F.instanceCount=l;const y=new d.Mesh(F,a);return y.frustumCulled=!1,{mesh:y,count:l,set(S,w,N,P,T,D,q,R){const C=S*4,Q=p.array,Z=v.array,L=u.array;Q[C]=w.x,Q[C+1]=w.y,Q[C+2]=w.z,Q[C+3]=N,Z[C]=P.x,Z[C+1]=P.y,Z[C+2]=P.z,Z[C+3]=P.w,L[C]=T,L[C+1]=D,L[C+2]=q,L[C+3]=R},flush(){p.needsUpdate=!0,v.needsUpdate=!0,u.needsUpdate=!0}}}function J0(s,a,l,m,F,A,h,p,v=6){const u=[],S=[.5,.86,1,.98,.84,.5];for(let w=0;w<=5;w++){const N=w/5;u.push([0,1,2].map(P=>a[P]+(l[P]-a[P])*N+m[P]*N*N))}J(s,u,S.map(w=>w*F),A,h,p,0,0,4,v,3)}const B0=new d.Color(.036,.03,.028),ge=new d.Color(1,1,1),xe=new d.Color(.115,.095,.085),Ha=new d.Color(.21,.15,.11);function Ca(s){const a=r0(),l=d0(s.pal[6],.4).lerp(d0(s.pal[2],.5),.4);n0(a,[[0,0,.62],[0,.02,.3],[0,.04,-.1],[0,.05,-.42],[0,.07,-.56]],[.04,.17,.21,.16,.09],8,B0,.8,6,{vs:4,ru:.6}),n0(a,[[0,.07,-.5],[0,.08,-.58],[0,.09,-.64]],[.1,.14,.09],8,ge,.05,6,{vs:4}),n0(a,[[0,.09,-.62],[0,.1,-.76],[0,.07,-.86],[0,.03,-.9]],[.07,.075,.05,.012],6,l,.35,6,{vs:4});for(let m=-2;m<=2;m++)J0(a,[m*.03,.02,.5],[m*.13,0,1.08-Math.abs(m)*.04],[0,0,0],.09,[1,0,0],xe,.45);for(let m=-1;m<=1;m+=2){const F=a.n,A=[m*.13,.08,-.12],h=[m*.98,.1,-.2];J(a,[[m*.1,.085,-.22],[m*.55,.1,-.3],[m*1,.1,-.3]],[.17,.17,.13],[0,0,1],xe,.5,0,0,6,5,3);for(let p=0;p<7;p++){const v=m*(.16+p*.125);J0(a,[v,.09,-.14],[v+m*.03,.07,.36-p*.012],[0,0,0],.075,[m,0,0],p>0?ge:xe,p>0?.05:.45)}for(let p=0;p<8;p++){const v=m*(.14+p*.115);J0(a,[v,.108,-.34],[v+m*.02,.1,-.1],[0,0,0],.066,[m,0,0],xe,.55)}for(let p=0;p<7;p++){const v=-.42+p*.3,u=.62+.14*Math.sin(p/6*Math.PI);J0(a,h,[h[0]+m*Math.cos(v)*u,h[1],h[2]+Math.sin(v)*u],[0,.17,0],.062,[-m*Math.sin(v),0,Math.cos(v)],xe,.42+.06*(p%2))}ue(a,F,1,p=>m*(.35+.9*Math.min(1,Math.abs(p)/1.6)),p=>-Math.abs(p)*.5,A)}return a}const Ue={vicuna:{sizes:[3,2,3,3,2,3],places:[.05,.25,.45,.65,.89,.97]},deer:{sizes:[3,2,2,2,3],places:[.05,.27,.5,.88,.97]}};function Bo(s){const a=r0(),l=[s*.36,-.03],m=[.66,.72,.77,.79,.76,.7,.63],F=.026,A=12;a.anim=[],a.piv=[];for(let h=0;h<7;h++){const p=a.n,v=h/6,u=(3+35*v)*Math.PI/180,y=-s*Math.cos(u),S=Math.sin(u),w=s*Math.sin(u),N=Math.cos(u);for(let P=0;P<=A;P++){const T=P/A,D=m[h]*T;for(let q=-1;q<=1;q+=2){const R=ko(a,[l[0]+y*D+q*w*F,l[1]+S*D+q*N*F,-.012*h],[0,0,1],q*F,D,ge,m[h],F,h%2?.34:.4,.3,q);a.anim[R]=[T,v,h*.8+(s>0?0:1.7),.2+.8*v],a.piv[R]=[l[0],l[1],.14+.16*v]}}for(let P=0;P<A;P++){const T=p+P*2;a.idx.push(T,T+1,T+2,T+1,T+3,T+2)}}return a}const Da=`
attribute vec4 aInfo; attribute float aEdge; attribute vec4 aAnim; attribute vec3 aPivot;
attribute vec4 aIPos; attribute vec4 aIQuat; attribute vec4 aIAnim;
varying vec2 vUv; varying vec4 vInfo; varying float vEdge;
vec3 qrot(vec4 q, vec3 v){ return v + 2.*cross(q.xyz, cross(q.xyz, v) + q.w*v); }
void main(){
  float t = aAnim.x, kn = aAnim.y, sd = sign(aPivot.x), ph = aIAnim.x + aAnim.z;
  float load = mix(aIAnim.y, aIAnim.z, aAnim.w), outK = aIAnim.w;
  float open = (kn - 0.35)*(0.12*outK + 0.1*load);
  float gust = (0.025 + 0.05*load)*sin(ph);
  float a = -sd*(open + t*t*(0.05 + aPivot.z*load*(1. + 0.2*outK) + gust));
  vec2 r = position.xy - aPivot.xy; float c = cos(a), s = sin(a);
  vec3 p = vec3(aPivot.xy + vec2(r.x*c - r.y*s, r.x*s + r.y*c), position.z);
  vec3 wp = aIPos.xyz + qrot(aIQuat, p*aIPos.w);
  vUv = uv; vInfo = aInfo; vEdge = aEdge;
  gl_Position = projectionMatrix*modelViewMatrix*vec4(wp, 1.);
  if (aIPos.w <= 0.) gl_Position = vec4(0., 0., 3., 1.);
}`,Na=`
varying vec2 vUv; varying vec4 vInfo; varying float vEdge;
${W0}
void main(){
  float L = vInfo.x, hw = vInfo.y, t = vUv.y/L, e = vEdge, e0 = vInfo.w;
  float f0 = (0.36 + 0.64*smoothstep(0.2, 0.62, t))*(1. - 0.3*smoothstep(0.66, 1., t));
  float tc = 1. - 1.1*hw/L, x = clamp((t - tc)/(1. - tc), 0., 1.);
  float g = 1. - length(vec2(e/f0, x));
  float gpx = g/max(fwidth(g), 1e-5);
  float away = abs(e - e0)*hw, cB = vUv.y - 1.4*away;
  float fe = max(fwidth(e), 1e-5), fB = max(fwidth(cB), 1e-6);
  float cov = clamp(gpx, 0., 1.);
  if (cov < 0.004) discard;
  float outl = 1. - smoothstep(0.9, 1.7, gpx);
  float shaft = lineAA(e - e0, fe, 0.6)*(1. - smoothstep(0.86, 0.97, t));
  float barbs = hatch(cB, fB*0.66, 0.02, 1e9, 0.6).x*smoothstep(0.5, 1.5, abs(e - e0)/fe);
  float ink = clamp(max(outl, max(shaft*0.8, barbs*0.62)), 0., 1.);
  float body = 0.35;
  gl_FragColor = vec4((uInk*ink + uPaper*vInfo.z*body*(1. - ink))*cov, mix(1., vInfo.z*(1. - body)*(1. - ink), cov));
}`;function Ra(s){const a=r0(),l=s.green.clone().multiplyScalar(.72);n0(a,[[0,0,.2],[0,.01,.05],[0,.02,-.12],[0,.03,-.2]],[.03,.07,.075,.05],6,l,.62,3,{vs:5,ru:.5}),n0(a,[[0,.03,-.17],[0,.045,-.25],[0,.03,-.31]],[.05,.06,.02],6,s.gamb,.3,3,{vs:5}),J0(a,[0,0,.16],[0,-.01,.52],[0,0,0],.055,[1,0,0],l,.72,8);for(let m=-1;m<=1;m+=2){const F=a.n;J(a,[[m*.05,.02,-.07],[m*.25,.03,-.05],[m*.47,.03,.05]],[.12,.11,.02],[0,0,1],l,.5,0,0,3,8,3),ue(a,F,1,A=>m*(.5+Math.abs(A)/.45),A=>-Math.abs(A)*1.5,[m*.04,.02,-.05])}return a}function Ea(s){const a=r0(),l=s.verd.clone().lerp(s.green,.4).multiplyScalar(.8);n0(a,[[0,-.1,.1],[0,-.04,.04],[0,.03,-.03],[0,.07,-.07]],[.012,.042,.04,.03],6,l,.55,2,{vs:8,ru:.6}),n0(a,[[0,.06,-.06],[0,.085,-.1],[0,.085,-.13]],[.03,.036,.012],5,s.verm,.3,2,{vs:8}),n0(a,[[0,.085,-.12],[0,.09,-.3]],[.011,.006],4,B0,.9,2,{vs:8}),J0(a,[0,-.08,.09],[0,-.2,.2],[0,0,0],.04,[1,0,0],l,.7,12);for(let m=-1;m<=1;m+=2){const F=a.n;J(a,[[m*.03,.03,-.02],[m*.14,.05,0],[m*.26,.05,.06]],[.05,.055,.012],[0,0,1],d0(s.pal[4],.5),.4,0,0,2,12),ue(a,F,1,()=>m,0,[m*.03,.03,-.02])}return a}function Ga(s,a){const l=r0(),m=a?s.gamb.clone().lerp(s.verm,.5).lerp(d0(s.pal[2],.9),.42):s.gamb.clone().lerp(s.verm,.45).lerp(d0(s.pal[2],.8),.3),F=ge.clone().lerp(m,.12),A=d0(s.pal[1],.7),h=a?.5:.74,p=1.05+h,v=(y,S)=>S<-.35?F:m;n0(l,[[0,.98,.64],[0,1,.42],[0,.98,0],[0,1.02,-.38],[0,1.08,-.54]],[.09,.24,.255,.23,.13],8,m,.32,4,{colFn:v,vs:3,ru:.5,kind:5});const u=l.n;n0(l,[[0,1.02,-.44],[0,1.05+h*.5,-.6],[0,p,-.68]],[.14,.085,.07],6,m,.3,4,{colFn:v,vs:3,kind:5}),n0(l,[[0,p-.03,-.62],[0,p+.05,-.76],[0,p-.01,-.96]],[.06,.078,.034],6,m,.36,4,{vs:3,kind:5,colFn:y=>y>.8?A:m});for(let y=-1;y<=1;y+=2)J(l,[[y*.045,p+.08,-.7],[y*.085,p+.25,-.67]],[.04,.012],[0,0,1],m,.5,0,0,4,6);if(a)for(let y=-1;y<=1;y+=2)n0(l,[[y*.04,p+.08,-.72],[y*.2,p+.34,-.72],[y*.16,p+.5,-.9]],[.02,.016,.008],4,F,.5,4),n0(l,[[y*.18,p+.3,-.72],[y*.3,p+.5,-.66]],[.014,.007],4,F,.5,4);ue(l,u,3,()=>1,.6,[0,1.03,-.46]);for(const[y,S,w]of[[.11,-.36,0],[-.11,-.36,.9],[.1,.42,Math.PI],[-.1,.42,Math.PI+.9]]){const N=l.n;n0(l,[[y,.97,S],[y,.56,S+.03],[y,.28,S-.01],[y,0,S]],[.09,.05,.034,.03],5,m,.4,3,{vs:3,kind:5,colFn:P=>P>.6?A:m}),ue(l,N,2,(P,T)=>p0((.97-T)/.97,0,1),w,[y,.97,S])}return J0(l,[0,1,.6],[0,a?1.3:.78,.74],[0,0,0],.06,[1,0,0],a?ge:m,.25),l}function Po(s,a){const l=d0(s.pal[5],.35),m=[{x:0,y:0,z:0,s:1,rot:0,tone:0,ph:0}],F={vs:3,ru:.5},A=w=>At(b0(w),a,m,0),h=r0();n0(h,[[0,-.1,-.12],[0,.22,-.06],[0,.5,0]],[.36,.47,.42],8,B0,.82,5,F);for(let w=-1;w<=1;w+=2)n0(h,[[w*.26,.16,.08],[w*.36,.06,.48],[w*.33,-.3,.6],[w*.33,-.42,.74]],[.2,.17,.12,.07],6,B0,.84,5,F);const p=r0();n0(p,[[0,-.05,0],[0,.35,.03],[0,.72,.05],[0,.86,.06]],[.4,.42,.33,.2],8,B0,.8,5,{...F,colFn:(w,N)=>B0}),J(p,[[0,.74,.34],[0,.5,.42],[0,.3,.42]],[.13,.17,.03],[1,0,0],l,.15,0,0,5,3),n0(p,[[0,.98,-.14],[0,1.03,.02],[0,1,.2],[0,.95,.33],[0,.93,.4]],[.08,.235,.2,.1,.05],8,B0,.8,5,{...F,colFn:w=>w>.66?l:B0,toneFn:w=>w>.66?.25:.8});for(let w=-1;w<=1;w+=2)n0(p,[[w*.17,1.14,-.02],[w*.2,1.26,-.03],[w*.21,1.3,-.03]],[.07,.07,.03],5,B0,.85,5,F),J(p,[[w*.035,1.12,.2],[w*.14,1.1,.17],[w*.15,1,.2],[w*.06,.96,.27]],[.015,.03,.03,.015],[0,.3,1],l,.1,0,0,5,4);const v=r0();for(let w=-1;w<=1;w+=2)n0(v,[[w*.34,0,0],[w*.4,-.2,.36],[w*.2,.06,.6],[w*.1,.16,.64]],[.15,.13,.1,.07],6,B0,.84,5,F);for(let w=0;w<7;w++){const N=w/7*X,P=Math.cos(N),T=Math.sin(N),D=w===6;J(v,[[0,.14,.68],[P*(D?.05:.42),.14+T*(D?.05:.42)+.1,D?1.15:1]],[.1,.02],[-T,P,0],D?s.verm:s.green,D?.2:.4,0,0,5,3)}const u=new d.Group,y=new d.Group,S=new d.Group;return y.position.set(0,.36,0),S.position.set(0,.74,.1),y.add(A(p),S),S.add(A(v)),u.add(A(h),y),{root:u,torso:y,arms:S}}function St(s){const a=new d.InstancedBufferGeometry;return a.setAttribute("position",new d.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),a.setIndex([0,1,2,0,2,3]),a.instanceCount=s,a}var Wa={id:"cut-mountain",name:"The Cut Mountain",category:"wilderness",weirdness:.4,media:["air"],async build(s){const a=s.rng,l=s.vary||{},m=s.quality?.detail??1,F=p0(l.density??1,.7,1.3),A=s.noise,h=a.fork("cut-mountain-look"),p=h.pick(["sepia","sanguine","sepia","sepia","sanguine","blueblack","blueblack"]),v=h(),u=h.pick(["puya","frailejon"]),y=h.chance(.3),S=h.chance(.4),w=h.chance(.45),N=l.hour||"any",P=N==="day"?"sepia":N==="golden"?"sanguine":N==="dawn"||N==="night"?"blueblack":p,T=P==="blueblack"?"valley":v<.28?"belt":v<.5?"sleet":"clear",D=!!l.rare,q=new d.Scene,R=await fa(s,{ink:P,bloom:u,rare:D,fog:0,plain:!1,snowDrop:T==="sleet"?95:0,pageTone:P==="sanguine"?1:0});q.add(R.object),await s.yield();const C=R.S,Q=R.uniforms,Z=R.anchors,L=R.groundAt;q.background=C.paper.clone();const O=ca(Z.flyThrough),o0=O.length,I0=R.toLegacy,z0=R.fromLegacy,l0=e=>z0(e)*o0,La=R.legacyLength,$=new d.Vector3,D0=new d.Vector3,s0=new d.Vector3,u0=e=>{O.posAtDist(e,$),O.tangentAtDist(e,D0),s0.set(-D0.z,0,D0.x).normalize()},ye=new d.Mesh(new d.SphereGeometry(4200,48,24),new d.ShaderMaterial({uniforms:{...Q,uCone:{value:new d.Vector4(j(.3,.52,(a.range(.72,1)-.72)/.28),a.range(.17,.23),j(.125,.155,(a.range(.07,.095)-.07)/.025),a.sign())},uFar:{value:new d.Vector3(h.range(0,40),1,1)},uSky:{value:new d.Vector3(62,T==="belt"?.55:T==="sleet"?.5:.61,.012)}},vertexShader:ma,fragmentShader:va,side:d.BackSide,depthWrite:!1}));ye.renderOrder=-1,ye.frustumCulled=!1,q.add(ye);const Ft=e=>866+12*A.n2(e*.021,7.7),It=e=>205+45*A.n2(e*.013,2.2),Xe=(e,t)=>{const o=G(Ft(e),Ft(e)+18,t)*(1-G(It(t),It(t)+55,e));return j(-1.2,L(-Math.max(e,.01),t)+.15,o)},K0=(e,t)=>e<=0?L(e,t):t>846?Math.max(Xe(e,t),0):0;{const o=new Float32Array(15189),n=new Float32Array(o.length),r=[];for(let M=0;M<=82;M++){for(let z=0;z<=60;z++){const I=z*5,c=846+M*5,f=(M*61+z)*3;o[f]=I,o[f+1]=Xe(I,c),o[f+2]=c}M%12===11&&await s.yield()}const i=61;for(let M=0;M<=82;M++)for(let z=0;z<=60;z++){const I=(M*i+z)*3,c=o[(M*i+Math.min(z+1,60))*3+1]-o[(M*i+Math.max(z-1,0))*3+1],f=o[(Math.min(M+1,82)*i+z)*3+1]-o[(Math.max(M-1,0)*i+z)*3+1],b=Math.hypot(c,10,f);n[I]=-c/b,n[I+1]=10/b,n[I+2]=-f/b}for(let M=0;M<82;M++)for(let z=0;z<60;z++){const I=M*i+z,c=I+1,f=I+i,b=f+1;r.push(I,f,c,c,f,b)}const g=new d.BufferGeometry;g.setAttribute("position",new d.BufferAttribute(o,3)),g.setAttribute("normal",new d.BufferAttribute(n,3)),g.setIndex(r),g.setAttribute("aTone",new d.BufferAttribute(new Float32Array(5063*3),3));const k=new d.Mesh(g,R.materials.ground);k.frustumCulled=!1,q.add(k)}await s.yield();const To=T==="belt"?150:T==="valley"?135:T==="sleet"?120:85,Co=(e,t)=>{if(e<520)return 0;const o=G(520,1150,e),n=1450+190*A.n2(t*8e-4,3.1)+70*A.n2(t*.0031,9.2),r=3e3+300*A.n2(t*5e-4,8.4),i=(e-n)/330,g=(e-r)/560,k=250+95*A.n2(t*.0015,1.7)+40*A.n2(t*.005,4.4),M=600+190*A.n2(t*.001,5.5)+60*A.n2(t*.004,2.2);let z=o*(30+24*A.fbm2(e*.0035,t*.0035,3))+60*G(1800,2600,e);return z+=k*Math.exp(-i*i)*(.7+.5*A.ridged2(e*.0019+3,t*.0019,3)),z+=M*Math.exp(-g*g)*(.72+.45*A.ridged2(e*.001+9,t*.001,2))*G(1500,2300,e),Math.max(z,0)},Do=(e,t)=>j(-30,To+15*A.n2(e*.0035,t*.0035)+8*A.n2(e*.011,t*.011),G(950,1320,e));{const e=[0,150,300,420,520],t=[],o=[];for(let c=565;c<=2005;c+=45)e.push(c);for(let c=2080;c<=3880;c+=75)e.push(c);for(let c=4080;c<=5280;c+=200)e.push(c);for(let c=0,f=60;c<5300;c+=f)o.push(c),c>1500&&(f=Math.min(260,f*1.12));for(let c=o.length-1;c>0;c--)t.push(-o[c]);for(const c of o)t.push(c);const n=e.length,r=t.length,i=new Float32Array(n*r*3),g=new Float32Array(n*r*3),k=new Float32Array(n*r),M=[];for(let c=0;c<r;c++){for(let f=0;f<n;f++){const b=e[f],x=t[c],B=c*n+f,_=Co(b,x);k[B]=_,i[B*3]=b,i[B*3+1]=Math.max(_,Do(b,x)),i[B*3+2]=x}c%6===5&&await s.yield()}for(let c=0;c<r;c++)for(let f=0;f<n;f++){const b=c*n+f,x=Math.max(f-1,0),B=Math.min(f+1,n-1),_=Math.max(c-1,0),K=Math.min(c+1,r-1),W=(k[c*n+B]-k[c*n+x])/(e[B]-e[x]),Y=(k[K*n+f]-k[_*n+f])/(t[K]-t[_]),h0=Math.hypot(W,1,Y);g[b*3]=-W/h0,g[b*3+1]=1/h0,g[b*3+2]=-Y/h0}for(let c=0;c<r-1;c++)for(let f=0;f<n-1;f++){const b=c*n+f,x=b+1,B=b+n,_=B+1;M.push(b,B,x,x,B,_)}const z=new d.BufferGeometry;z.setAttribute("position",new d.BufferAttribute(i,3)),z.setAttribute("normal",new d.BufferAttribute(g,3)),z.setAttribute("aLand",new d.BufferAttribute(k,1)),z.setIndex(M);const I=new d.Mesh(z,new d.ShaderMaterial({uniforms:{...Q,uGreen:{value:C.green},uOlive:{value:C.olive},uGamb:{value:C.gamb},uEast:{value:new d.Vector4(T==="sleet"?470:660,1,.004,0)}},vertexShader:ka,fragmentShader:za,side:d.DoubleSide}));I.frustumCulled=!1,q.add(I)}await s.yield();const Ze=R.materials.plant,O0=(e,t,o,n={})=>({x:e,y:K0(e,t),z:t,s:o,rot:a()*X,tone:a.range(-.08,.1),ph:a()*X,...n}),N0=(e,t)=>(u0(e),[$.x+s0.x*t,$.z+s0.z*t]),R0=e=>Math.max(1,Math.round(e*(.45+.55*m)*F)),i0=(e,t,o)=>{const n=At(e,Ze,t,o);return q.add(n),n},we=O.pointAt(0),E0=O.tangentAt(0),qt=(e,t)=>{const o=e-we.x,n=t-we.z;return[o*E0.x+n*E0.z,o*-E0.z+n*E0.x]},Vt=(e,t)=>{const[o,n]=qt(e,t);return o>10&&n>-o*.57&&n<o*.54},No=Vt,Bt=(e,t,o,n)=>{const[r,i]=qt(e,t);return r>8&&Math.abs(i)<r*.62?Math.min(o,(20.5-n)/17.5):o},Pt=[],Tt=(e,t,o,n)=>{const r=we.x+E0.x*e-E0.z*t,i=we.z+E0.z*e+E0.x*t,g=O0(r,i,o,{dark:n}),k=i>735&&i<828&&Math.abs(r+3+.014*(835-i))<14;O.nearestXZ(r,i).dist>6.8&&K0(r,i)>.4&&!Vt(r,i)&&!k&&Pt.push(g)};for(const[e,t,o,n]of[[19,-12.5,1.08,.34],[29,-19.5,.96,.3],[41,-27.5,1.1,.16],[22,13.8,1.02,.34],[33,21,1.1,.26],[46,28.5,.94,.12]])Tt(e,t,o,n);for(let e=0;e<34;e++){const t=a.range(16,170),o=e%3===2?1:-1,n=a.range(.66,1.3);Tt(t,o*(t*n+a.range(2,9)),a.range(.82,1.15),0)}const G0=[],ie=[];G0.push(i0(Oe(a,C,{h:50,r:.46,sides:9,segs:7,fronds:11,L:6.4,w:1.7,fsegs:4,lean:1.3,sway:.9}),Pt,.5)),await s.yield();const He=[],[le,ce]=N0(36,-12),Ct=p0((24-K0(le,ce))/17.5,.7,1.2);He.push(O0(le,ce,Ct));const We=new d.Vector3(le,K0(le,ce)+16.5*Ct,ce);for(let e=0,t=R0(112);e<t;e++){const o=a.range(-8,l0(.17)),[n,r]=N0(o,a.sign()*a.range(3.5,62)),i=O.nearestXZ(n,r),g=K0(n,r);if(g<.4||o<15&&i.dist<12||Math.hypot(n-le,r-ce)<9)continue;let k=a.range(.78,1.28);i.dist<11&&(k=Math.min(k,(i.y-5.5-g)/17.5)),n>-24&&n<34&&r>735&&r<848&&(k=Math.min(k,(27-g)/17.5)),k>.55&&He.push(O0(n,r,Bt(n,r,k,g)))}G0.push(i0(Oe(a,C,{h:15,r:.3,sides:6,segs:3,fronds:13,L:5,w:1.5,fsegs:4,lean:.8,sway:.5,dark:.95}),He,.3)),await s.yield();const Dt=[];for(let e=0,t=R0(150);e<t;e++){const o=a.range(8,255),n=a.range(872,1238);Xe(o,n)>.8&&O.nearestXZ(o,n).dist>50&&!No(o,n)&&Dt.push(O0(o,n,a.range(.8,1.2)))}G0.push(i0(Oe(a,C,{h:50,r:.5,sides:5,segs:2,fronds:8,L:6.4,w:1.8,fsegs:2,lean:1.4,sway:.9}),Dt,.5)),await s.yield();const $e=[],Nt=[];for(let e=0,t=R0(1900);e<t;e++){const[o,n]=N0(a.range(-10,l0(.31)),a.gauss()*26);K0(o,n)<.3||o>0&&n<850||((e%9===0?Nt:$e).push(O0(o,n,a.range(.7,1.5))),(e&255)===255&&await s.yield())}G0.push(i0(Io(a,C),$e,.05),i0(qo(a,C),Nt,.05)),await s.yield();{const e=s.core.makeRng(((s.seed??1)>>>0^1540483477)>>>0),t=c=>{const f=G(590,760,c),b=G(752,800,c);return j(j(140,7,f),2.6,b)+(5*Math.sin(c*.061)+2.5*Math.sin(c*.173+1.3))*j(1,.22,b)+24*(1-f)*Math.sin(c*.011+.5)},o=(c,f,b)=>c>t(f)+b&&K0(c,f)<.25,n=(c,f,b,x={})=>({x:c,y:0,z:f,s:b,rot:e()*X,tone:e.range(-.08,.1),ph:e()*X,...x}),r=(c,f)=>e()<G(668,775,f)*(1-G(165,255,c)),i=[],g=[],k=[],M=[],z=[],I=[];for(let c=0,f=R0(130);c<f;c++){const b=e.range(4,240),x=e.range(672,900);o(b,x,4)&&r(b,x)&&I.push([b,x])}for(let c=58;c<200;c+=13)for(const f of[-1,1]){const[b,x]=N0(c,f*e.range(7,30));o(b,x,3)&&I.push([b,x])}for(let c=730;c<868;c+=11){const f=t(c)+e.range(4.5,16);o(f,c,3)&&I.push([f,c+e.range(-3,3)])}for(const[c,f]of I){z.push([c,f]);for(let b=0,x=3+Math.floor(e()*4);b<x;b++){const B=e()*X,_=e.range(.5,6.5),K=c+Math.cos(B)*_,W=f+Math.sin(B)*_;o(K,W,2.5)&&i.push(n(K,W,e.range(1.15,2.1)))}for(let b=0,x=1+Math.floor(e()*3);b<x;b++){const B=e()*X,_=e.range(0,2.6),K=c+Math.cos(B)*_,W=f+Math.sin(B)*_;o(K,W,2.5)&&k.push(n(K,W,e.range(1.4,2.15)))}for(let b=0;b<3;b++){const x=e()*X,B=e.range(3,11),_=c+Math.cos(x)*B,K=f+Math.sin(x)*B;o(_,K,1.5)&&g.push(n(_,K,e.range(.8,1.5)))}}await s.yield();for(let c=0,f=R0(220);c<f;c++){const b=e.range(2,250),x=e.range(668,905);o(b,x,1.2)&&r(b,x)&&g.push(n(b,x,e.range(.7,1.45)))}for(let c=0;c<200&&M.length<34;c++){const f=e.range(10,215),b=e.range(690,890);if(!o(f,b,5)||!r(f,b)||M.some(_=>Math.hypot(_.x-f,_.z-b)<12.5))continue;const x=O.nearestXZ(f,b);let B=e.range(.6,1.16);x.dist<11&&(B=Math.min(B,(x.y-5.5)/17.5)),f>-24&&f<34&&b>735&&b<848&&(B=Math.min(B,27/17.5)),B=Bt(f,b,B,0),B>.5&&M.push(n(f,b,B))}await s.yield(),G0.push(i0(Ia(e,C),i,.05),i0(Io(e,C),g,.05)),await s.yield(),G0.push(i0(qo(e,C),k,.05),i0(Oe(e,C,{h:15,r:.3,sides:6,segs:3,fronds:13,L:5,w:1.5,fsegs:4,lean:.8,sway:.5,dark:.95}),M,.3))}await s.yield();const Ye=[];for(let e=0,t=R0(135);e<t;e++){const[o,n]=N0(a.range(l0(.125),l0(.318)),a.sign()*a.range(0,46));if(o>-2.5)continue;const r=O.nearestXZ(o,n),i=L(o,n);let g=a.range(.75,1.3);r.dist<10&&(g=Math.min(g,(r.y-7-i)/9.6)),o>-36&&n>758&&n<846&&(g=Math.min(g,(29.5-i)/11)),g>.5&&Ye.push(O0(o,n,g))}i0(Fo(a,C),Ye,.2),await s.yield();const L0=[];u0(l0(.2)+13);const U0=1.45,g0={x:$.x-s0.x*16.2,z:$.z-s0.z*16.2},Je=[{x:g0.x,y:L(g0.x,g0.z),z:g0.z,s:U0,rot:Math.atan2(-s0.z,s0.x),tone:0,ph:1}],x0=new d.Vector3(g0.x+s0.x*3.6*U0,Je[0].y+(8.28-.4)*U0,g0.z+s0.z*3.6*U0),Me=s0.clone();for(let e=0;e<30&&L0.length<16;e++){const[t,o]=N0(l0(j(.135,.305,(e+a())/30)),a.sign()*a.range(17,38)),n=a.range(.9,1.3);t>-10||O.nearestXZ(t,o).dist<8.6*n+8.5||Math.hypot(g0.x-t,g0.z-o)<24||L0.some(r=>Math.hypot(r.x-t,r.z-o)<13)||L0.push(O0(t,o,n))}i0(Vo(a,C,!1),L0,.4),await s.yield(),i0(Vo(a,C,!0),Je,.4),await s.yield();const be=[];{const e=s.core.makeRng(((s.seed??1)>>>0^739982445)>>>0);for(let t=0;t<1100&&be.length<34;t++){const o=e.range(-95,-4),n=e.range(690,865),r=e(),i=L(o,n);if(i<25||i>186)continue;const g=O.nearestXZ(o,n);if(g.dist<9||g.dist>44||r>1-.8*G(18,44,g.dist)||Math.hypot(g0.x-o,g0.z-n)<15||L0.some(M=>Math.hypot(M.x-o,M.z-n)<8)||be.some(M=>Math.hypot(M.x-o,M.z-n)<7))continue;let k=e.range(.8,1.25);g.dist<13&&(k=Math.min(k,(g.y-8-i)/5.6)),o>-36&&n>758&&n<846&&(k=Math.min(k,(29.5-i)/5.6)),k>.6&&be.push({x:o,y:i,z:n,s:k,rot:e()*X,tone:e.range(-.06,.08),ph:e()*X})}}const Rt=i0(Va(s.core.makeRng(((s.seed??1)>>>0^374761393)>>>0),C),be,.15);Rt.material=R.materials.plantOut,await s.yield();const ke=[];{const e=s.core.makeRng(s.core.hashSeed("cut-mountain:understorey:"+s.seed)),t=new Set,o=(f,b)=>(f+2048)*4096+(b+2048),n=(f,b,x,B)=>{for(let _=Math.floor(f-x);_<=f+x;_++)for(let K=Math.floor(b-x);K<=b+x;K++){const W=_+.5-f,Y=K+.5-b;W*W+Y*Y<x*x&&B(o(_,K))}},r=(f,b,x)=>n(f,b,x,B=>t.add(B));let i=0,g=0;const k=f=>{i++,t.has(f)&&g++};for(const f of $e)f.x<0&&r(f.x,f.z,1.4*f.s);for(const f of Ye)r(f.x,f.z,3.6*f.s);await s.yield();const M=2.5,z=f=>{if(u0(f),$.x>-1.5)return!1;const b=L($.x,$.z);return b>=5&&b<=192};let I=-1,c=o0;for(let f=0,b=0;f<=o0;f+=2,b++){b%120===119&&await s.yield();const x=z(f);if(I<0)x&&(I=f);else if(!x){c=f;break}}await s.yield();for(let f=0;I>=0&&f<5600&&ke.length<520;f++){f%350===349&&await s.yield();const b=e()<.66,[x,B]=N0(e.range(I,c),e.sign()*(b?e.range(0,25):e.range(25,45))),_=e(),K=e(),W=e(),Y=e(),h0=e.range(.1,.95),F0=e()*X,_e=e.range(-.06,.06),E=e()*X;if(x>-1.5)continue;const V=L(x,B);if(V<5||V>192)continue;const H=O.nearestXZ(x,B),a0=Y<.55?-h0:-1-h0;let v0=_<.2,t0=v0?j(1.15,1.5,K):j(.8,1.3,K),M0=V+.25;if(v0&&(M0=V+j(2.6,5,W),H.dist<14&&(M0=Math.min(M0,H.y-9-1.2*t0)),x>-36&&B>758&&B<846&&(M0=Math.min(M0,29.5-1.2*t0)),Math.hypot(g0.x-x,g0.z-B)<9&&(M0=V),M0-V<1.5&&(v0=!1,t0=j(.8,1.3,K),M0=V+.25)),!(!v0&&H.dist<M*t0+4&&H.y-V<7+1.5*t0)&&!(L0.some(C0=>Math.hypot(C0.x-x,C0.z-B)<2.6)||Math.hypot(g0.x-x,g0.z-B)<2.6)&&(i=0,g=0,n(x,B,M*t0,k),!(g>.45*i)))if(r(x,B,M*t0),v0)ke.push({x,y:M0-5*t0,z:B,s:t0,rot:F0,tone:_e,ph:E,hue:a0});else{const C0=(L(x+1.5,B)-L(x-1.5,B))/3,ve=(L(x,B+1.5)-L(x,B-1.5))/3,H0=new d.Vector3(-.6*C0,1,-.6*ve).normalize();ke.push({x:x-H0.x*5*t0,y:M0-H0.y*5*t0,z:B-H0.z*5*t0,s:t0,rot:F0,tone:_e,ph:E,hue:a0,up:H0})}}}await s.yield();const Et=At(Fa(s.core.makeRng(s.core.hashSeed("cut-mountain:rosette:"+s.seed)),C),R.materials.plantOut,ke,0,e=>e.hue);q.add(Et),await s.yield();const Gt=[];for(let e=0;e<90;e++){const t=a.range(212,706);if(Z.falls.some(o=>Math.abs(o.top.z-t)<6)||Math.abs(t-Z.passionflowers.z)<5){a();continue}Gt.push({x:.36,y:L(-.01,t)-.35,z:t,s:a.range(.8,1.5),rot:0,tone:0,ph:t*.3})}i0(Ta(a,C),Gt,0);{const e=s.core.makeRng(((s.seed??1)>>>0^1013904242)>>>0),t=[],o=R.layout,n=Z.boxes[3],r=Z.boxes.map(i=>({z:i.position.z,hw:i.size.x/2+1.5,top:i.position.y+i.size.y/2})).concat(o.caves.map(i=>({z:i.z-(i.dark?0:3),hw:i.rx+(i.dark?1.5:5),top:i.dark?i.y+i.ry*1.15:1e4})));for(let i=0;i<58;i++){const g=j(712,236,(i+e())/58),k=L(-.01,g),M=e.range(1,2.7);if(Z.falls.some(I=>Math.abs(I.top.z-g)<6.5)||Math.abs(g-o.ventZ)<9)continue;let z=Math.min(26,k*.6);for(const I of r)Math.abs(I.z-g)<I.hw+3&&(z=Math.min(z,k-I.top-1.2));g<n.position.z-n.size.x/2+3&&g>n.position.z-n.size.x/2-30&&(z=Math.min(z,9.5)),!(z<5)&&t.push({x:0,y:k-.6,z:g,s:Math.min(M,z/9.6),rot:0,tone:e.range(-.05,.08),ph:0})}i0(Ba(e,C),t,0)}const Lt=[];for(let e=0,t=R0(2500);e<t;e++){u0(l0(a.range(.56,.885)));const o=Math.min(-1.2,Math.min($.x,0)*.8+a.gauss()*15),n=$.z+a.range(-4,4),r={x:o,y:L(o,n),z:n,s:a.range(.7,1.5),rot:a()*X,tone:a.range(-.05,.1),ph:a()*X};R.flowAt(o,n)>2.5&&r.y<312&&Lt.push(r),(e&255)===255&&await s.yield()}ie.push(i0(qa(a,C),Lt,.03));const _t=[];for(let e=0,t=R0(230);e<t;e++){u0(l0(a.range(.76,.985)));const o=$.x+(a.chance(.42)?1:-1)*(1.5+Math.abs(a.gauss())*9),n=$.z+a.range(-5,5);if(o>-1){a();continue}const r=L(o,n);O.distanceTo(o,r,n)<7.5||R.flowAt(o,n)<4||_t.push({x:o,y:r,z:n,s:a.range(.6,2),rot:.5+a.range(-.6,.6),tone:a.range(-.05,.1),ph:0,snow:r>366-(T==="sleet"?95:0)?1:0})}const Ro=e=>{const t=R.routeNear(e.x,e.z);return!(e.y>300&&t.left>0&&t.d>6.5&&t.d<15.5)},Qt=_t.filter(Ro);ie.push(i0(bo.rockGeometry(a,C),Qt,.1)),await s.yield();{const e=s.core.makeRng(((s.seed??1)>>>0^8011153)>>>0),t=[];for(const[o,n,r]of[[.706,17,1.3],[.752,19,.7],[.812,21,.95]]){u0(l0(o));const i=$.x-s0.x*n,g=$.z-s0.z*n,k=L(i,g);R.flowAt(i,g)>7*r&&t.push({x:i,y:k,z:g,s:r,rot:e()*X,tone:e.range(0,.08),ph:0,snow:k>366-(T==="sleet"?95:0)?1:0})}ie.push(i0(Pa(e,C),t,.2))}await s.yield();const jt=[];for(let e=0;e<46;e++){const t=j(700,425,(e+a())/46),o=-a.range(2.2,9.5),n=L(o,t);n<196&&O.distanceTo(o,n+8,t)>13&&jt.push({x:o,y:n,z:t,s:a.range(.8,1.3),rot:a()*X,tone:a.range(-.08,.1),ph:a()*X})}i0(Fo(a,C),jt,.2),await s.yield();const ze=[],et=(e,t,o,n,r,i,g)=>ze.push(e,t,o,n,r,i,g);et(x0.x-Me.x*6,x0.y+1.2,x0.z-Me.z*6,5.5,1.7,.5,0);{const e=s.core.makeRng(((s.seed??1)>>>0^668265263)>>>0);for(const t of L0){const o=O.nearestXZ(t.x,t.z);O.pointAt(o.u,$);const n=t.x-$.x,r=t.z-$.z,i=Math.hypot(n,r)||1,g=7.5*t.s;et(Math.min(t.x+n/i*g,-5),t.y+e.range(8.2,9.6)*t.s,t.z+r/i*g,e.range(6.2,7.6)*t.s,e.range(1.7,2.2),e(),-e.range(.006,.012))}}const Kt=T==="belt";for(let e=0,t=Math.round(36*(.6+.4*m));e<t;e++){const[o,n]=N0(l0(a.range(.1,.33)),a.sign()*a.range(9,58)),r=Math.min(o,-4),i=a.range(3.2,6.5);et(r,L(Math.min(r,-.01),n)+a.range(4,20),n,i,a.range(1.6,2.6),a(),a.range(.008,.018))}if(Kt){const e=s.core.makeRng(((s.seed??1)>>>0^1757159915)>>>0),t=[],o=[],n=(x,B,_,K,W)=>{t.push(x,B,_),o.push(K,Math.max(1.2,Math.min(W,(-x-12)/(.85*K))),e(),e.range(.05,.11))},r=(x,B)=>{let _=200,K=860;for(let W=0;W<18;W++){const Y=(_+K)/2;L(-Y*Math.cos(x),Y*Math.sin(x))>B?_=Y:K=Y}return(_+K)/2};for(let x=0;x<2;x++)for(let B=0;B<22;B++){const _=j(-1.3,1.36,(B+.5*x+e.range(-.2,.2))/22),K=x?e.range(150,172):e.range(104,126),W=r(_,K),Y=-W*Math.cos(_),h0=W*Math.sin(_),F0=e.range(24,36);n(Y,L(Y,h0)+F0*.52,h0,F0,e.range(2.1,3.1))}u0(l0(.212));const i=$.x,g=$.y,k=$.z,M=x0.x-i,z=x0.z-k,I=Math.hypot(M,z)||1;for(const[x,B,_,K]of[[24,-7,9,2.4],[30,13,10,2.2],[52,2,15,2.6],[78,-26,18,2.5],[84,30,17,2.4],[120,4,24,2.8],[158,-40,26,2.6],[165,44,25,2.6],[200,0,30,3]]){const W=Math.min(x0.x+M/I*x-z/I*B,-6),Y=x0.z+z/I*x+M/I*B;n(W,L(W,Y)+_*.42,Y,_,K)}const c=o.length/4,f=St(c);f.setAttribute("aBase",new d.InstancedBufferAttribute(new Float32Array(t),3)),f.setAttribute("aSeed",new d.InstancedBufferAttribute(new Float32Array(o),4));const b=new d.Mesh(f,new d.ShaderMaterial({uniforms:{...Q},vertexShader:ya,fragmentShader:wa}));b.frustumCulled=!1,q.add(b)}const Ae=ze.length/7,tt=St(Ae),Ot=new Float32Array(Ae*3),Ut=new Float32Array(Ae*4);for(let e=0;e<Ae;e++)Ot.set(ze.slice(e*7,e*7+3),e*3),Ut.set(ze.slice(e*7+3,e*7+7),e*4);tt.setAttribute("aBase",new d.InstancedBufferAttribute(Ot,3)),tt.setAttribute("aSeed",new d.InstancedBufferAttribute(Ut,4));const Xt=new d.Mesh(tt,new d.ShaderMaterial({uniforms:{...Q,uDrift:{value:new d.Vector3(-.45,.35,-.6)},uMistNear:{value:26},uMistDots:{value:Kt?0:1}},vertexShader:ga,fragmentShader:xa}));if(Xt.frustumCulled=!1,q.add(Xt),T==="valley"){const e=new d.Mesh(new d.PlaneGeometry(1e3,520),new d.ShaderMaterial({uniforms:{...Q},vertexShader:Ma,fragmentShader:ba,side:d.DoubleSide}));e.rotation.x=-Math.PI/2,e.position.set(0,12.5,1040),e.frustumCulled=!1,q.add(e)}let fe=null,ot=null;if(T==="sleet"||D){const e=Math.round((D?5200:1700)*(.5+.5*m)),t=St(e),o=new Float32Array(e*3),n=new Float32Array(e);for(let i=0;i<e;i++)o[i*3]=a()*60,o[i*3+1]=a()*60,o[i*3+2]=a()*60,n[i]=a();t.setAttribute("aBase",new d.InstancedBufferAttribute(o,3)),t.setAttribute("aSeed",new d.InstancedBufferAttribute(n,1)),fe={...Q,uCam:{value:new d.Vector3},uVel:{value:D?new d.Vector3(-.7,-1.7,.4):new d.Vector3(-5.5,-9.5,2.6)},uFall:{value:new d.Vector3(0,.5,D?1:0)}};const r=new d.Mesh(t,new d.ShaderMaterial({uniforms:fe,vertexShader:Aa,fragmentShader:Sa,side:d.DoubleSide}));r.frustumCulled=!1,q.add(r),ot=r}await s.yield();const Se=zo(Q,{uFarTint:{value:0}},ua,ha,{side:d.DoubleSide}),Zt=w?2:1,Fe=re(Ca(C),Se,Zt);q.add(Fe.mesh);const _0=zo(Q,{},Da,Na,{side:d.DoubleSide});_0.transparent=!0,_0.blending=d.CustomBlending,_0.blendSrc=d.OneFactor,_0.blendDst=d.SrcAlphaFactor,_0.blendSrcAlpha=d.ZeroFactor,_0.blendDstAlpha=d.OneFactor;const P0=[re(Bo(-1),_0,1),re(Bo(1),_0,1)];q.add(P0[0].mesh,P0[1].mesh),P0[0].mesh.visible=P0[1].mesh.visible=!1,P0[0].mesh.renderOrder=P0[1].mesh.renderOrder=20;const at=60,nt=40,Ie=re(Ra(C),Se,at);q.add(Ie.mesh),u0(36);const qe=[],Eo=l0(.085),Go=l0(.16),Lo=l0(.29);for(let e=0;e<at;e++)e<nt?qe.push({u0:a.range(-.036,.03),ph:a()*X,s:new d.Vector3(a.range(-2.5,2.5),a.range(-1,1.5),a.range(-2.5,2.5)).add(We),v:new d.Vector3().addScaledVector(s0,-a.range(2,7)).addScaledVector(D0,a.range(3,8)).setY(a.range(1.5,4))}):qe.push({w:a.range(.5,.85)*a.sign(),r:a.range(6.5,13),h:a.range(-1,4),ph:a()*X});{const e=s.core.makeRng(((s.seed??1)>>>0^625341585)>>>0);for(let t=0;t<nt;t++){const o=qe[t],n=t%4===0;o.d0=n?e.range(14,27):e.range(5,30),o.vT=e.range(15,19),o.vR=n?e.range(2.6,4.2):e.range(.8,3.6),o.hh=n?e.range(11,15):e.range(10,19),o.dirT=D0.clone(),o.dirR=s0.clone()}}await s.yield();const he=[];R.sites.puya.map(e=>({p:e,d:O.nearestXZ(e.x,e.z).dist})).filter(e=>e.d<30).sort((e,t)=>e.d-t.d).slice(0,12).forEach(e=>he.push(new d.Vector3(e.p.x,e.p.y+3.2*e.p.s,e.p.z))),Je.concat(L0.slice(0,7)).forEach(e=>{const t=Math.cos(e.rot),o=Math.sin(e.rot);he.push(new d.Vector3(e.x+t*6.2*e.s,e.y+9.3*e.s,e.z-o*6.2*e.s))});const Ve=he.length?40:0,st=re(Ea(C),Se,Math.max(1,Ve));q.add(st.mesh);const Ht=[];for(let e=0;e<Ve;e++){const t=he[e%he.length],o=a()*X,n=o+a.range(1,2.6);Ht.push({c:t,a:new d.Vector3(Math.cos(o)*.9,a.range(-.5,.6),Math.sin(o)*.9),b:new d.Vector3(Math.cos(n)*.9,a.range(-.5,.6),Math.sin(n)*.9),rate:a.range(.16,.34),ph:a()})}const Be=e=>{const t=I0(e);return .82+.12*G(.08,.16,t)+.2*G(.6,.72,t)-.14*G(.86,.94,t)},rt={x:0,y:0,z:0},m0=y?12:16,it=re(Ga(C,y),Se,m0);q.add(it.mesh);const U=[];let ee=Math.floor(o0);for(;ee>1&&O.posAtDist(ee-1,$).x<-1;)ee-=1;{let e=0,t=0,o=0,n=0;for(let r=ee;r<=o0;r+=1){u0(r);const i=Math.min($.x-s0.x*11,-2),g=$.z-s0.z*11,k=L(i,g);U.length&&(e+=Math.hypot(i-t,k-o,g-n)),U.push({x:i,y:k,z:g,len:e,d:r}),t=i,o=k,n=g}}const Wt=U[U.length-1].len,te=(e,t)=>{let o=Math.min(U.length-2,Math.max(0,Math.floor(e/Wt*(U.length-1))));for(;o>0&&U[o].len>e;)o--;for(;o<U.length-2&&U[o+1].len<e;)o++;const n=U[o],r=U[o+1],i=p0((e-n.len)/Math.max(r.len-n.len,.001),0,1);return t.x=j(n.x,r.x,i),t.z=j(n.z,r.z,i),t.y=j(n.d,r.d,i),t},_o=e=>{const t=p0(e-ee,0,U.length-1.001),o=Math.floor(t);return j(U[o].len,U[o+1].len,t-o)},lt=Math.max(0,U.findIndex(e=>e.y>=310)),Pe=U.findIndex((e,t)=>t>lt&&e.y>=376),Te=U[lt].len,ct=Pe<0?Wt-20:U[Pe].len,Qo=ct-Te;let $t=0;for(let e=0;e<64;e++)$t+=2/(Be(e/64)+Be((e+1)/64));const Yt=e=>o0/50*Be(p0(e/o0,0,1))*($t/64),Ce=y?Ue.deer.sizes:Ue.vicuna.sizes,jo=y?Ue.deer.places:Ue.vicuna.places,ft=2/3*Qo,De=3,Ne=13,Ko=[-1.9,0,1.9],ht=e=>{const t=p0(e,0,U.length-9);return Yt(U[t].d)*(U[t+8].len-U[t].len)/8},Oo=ht(lt),_a=ht(Pe<0?U.length-28:Pe-8),Re=5*(Oo-Ne),dt=[];{const e=(o,n,r,i=r,g=0,k=0)=>{let M=0,z=1e18;for(let Y=0;Y<U.length;Y++){const h0=U[Y],F0=(h0.x-o)*(h0.x-o)+(h0.z-n)*(h0.z-n);F0<z&&(z=F0,M=Y)}if(z>100||U[M].y<296)return;const I=U[Math.max(M-1,0)],c=U[Math.min(M+1,U.length-1)],f=c.x-I.x,b=c.z-I.z,x=Math.hypot(f,b)||1,B=((o-U[M].x)*f+(n-U[M].z)*b)/x,_=((o-U[M].x)*b-(n-U[M].z)*f)/x,K=(g*f+k*b)/x,W=Math.sqrt(Math.max(0,1-K*K));dt.push({s:U[M].len+B,lat:_,ra:Math.hypot(r*K,i*W),rl:Math.hypot(r*W,i*K)})},t=R.sites;for(const o of t.frail)e(o.x,o.z,1.1*o.s);for(const o of t.frailNew||[])e(o.x,o.z,1.1*o.s);for(const o of t.puya)e(o.x,o.z,1.9*o.s);for(const o of t.cushNear)e(o.x,o.z,2*o.s);for(const o of t.cushFar)e(o.x,o.z,1.5*o.s);for(const o of Qt.concat(t.rocks||[]))e(o.x,o.z,1.15*o.s);for(const o of t.ribs){if(o.top<.5)continue;const n=Math.hypot(o.x,o.z)||1;e(o.x,o.z,Math.max(o.rz,.6*o.top/.7)-.25,Math.max(o.rx,.45*o.top/.7)-.25,o.x/n,o.z/n)}}await s.yield();const c0=[],Uo=Ce.length-2;{let e=0;for(let t=0;t<Ce.length;t++)for(let o=0;o<Ce[t];o++,e++){const n=a(),r=a.range(-2.8,2.8),i=a()*X,g=a.range(.84,.93),k=Te+p0(ft*jo[t]+(o-(Ce[t]-1)/2)*2.4+.6*(n-.5),1,ft);c0.push({s0:k,lat0:Ko[(o+t)%3]+r*.15,ph:i,sc:g,band:Math.min(t,Uo),lead:Re,dBreak:0,run:0})}}const Xo=e=>c0.find(t=>t.band===e.band),Zo=(e,t)=>{if(t<=e.dBreak)return 0;let o=0;const n=(t-e.dBreak)/8;for(let r=0;r<=8;r++)o+=(r===0||r===8?1:r%2?4:2)/Yt(e.dBreak+r*n);return Ne*o*n/3},Ho=(e,t)=>{if(e.run<.5)return 0;const o=t*e.rate,n=o-De*(1-Math.exp(-o/De));return Math.max(0,e.run-2.5*Math.log(1+Math.exp((e.run-n)/2.5)))},oe=(e,t)=>{const o=p0(t-e.s0+1,0,e.line.length-1.001),n=Math.floor(o);return j(e.line[n],e.line[n+1],o-n)},A0=43,Jt=e=>-6.3+.3*e,eo=(e,t,o,n)=>{const r=dt.filter(M=>M.s>e-8&&M.s<e+o+7),i=new Float32Array(o*A0),g=new Int8Array(o*A0);let k=-1;for(let M=0;M<o;M++){const z=e+M-1;let I=!1;for(let c=0;c<A0;c++){const f=Jt(c);let b=1e9;if(!r.some(x=>Math.hypot((x.s-z)/(x.ra+.55),(x.lat-f)/(x.rl+.55))<1)){if(M===0)b=0;else for(let x=-3;x<=3;x++){const B=c+x;B>=0&&B<A0&&i[(M-1)*A0+B]+.5*x*x<b&&(b=i[(M-1)*A0+B]+.5*x*x,g[M*A0+c]=x)}b<1e8&&(b+=.2*(f-t)*(f-t),I=!0)}i[M*A0+c]=b}if(!I)break;k=M}if(n&&k>=0){let M=0;for(let I=1;I<A0;I++)i[k*A0+I]<i[k*A0+M]&&(M=I);for(let I=k;I>=0;I--)n[I]=Jt(M),M+=g[I*A0+M];for(let I=k+1;I<o;I++)n[I]=n[k];const z=Float32Array.from(n);for(let I=0;I<2;I++){let c=n[0];for(let f=1;f<o-1;f++){const b=n[f];n[f]=.25*c+.5*b+.25*n[f+1],c=b}}for(let I=1;I<o-1;I++)r.some(c=>Math.hypot((c.s-(e+I-1))/(c.ra+.35),(c.lat-n[I])/(c.rl+.35))<1)&&(n[I]=z[I])}return k};for(let e=0;e<m0;e++){const t=c0[e],o=t.s0;for(const n of[0,.7,-.7,1.4,-1.4,2.1,-2.1,2.8,-2.8,3.5,-3.5,4.5,5.5,6.5,7.5,9]){const r=o+n;if(!(r<Te+1||r>Te+ft||c0.some((i,g)=>g<e&&Math.abs(i.s0-r)<2))&&eo(r,t.lat0,21,null)===20){t.s0=r;break}}e%2&&await s.yield()}await s.yield();for(let e=m0-1;e>=0;e--){const t=c0[e];t.rate=.97+.06*(t.band*5%7+.5)/7,t.graze=e%2?-1.15:-.1,t.yaw=.9*((e*5%m0+.5)/m0-.5),t.lead=Re+(t.s0-Xo(t).s0),t.dBreak=te(Math.max(t.s0-t.lead,0),rt).y;const o=ht(Math.round(t.dBreak-ee)),n=Ne*(t.lead-De)/Math.max(o-Ne,4)-De;let r=Math.min(t.s0+n+j(8,12,(e*7%m0+.5)/m0),ct-8);const i=Math.max(4,Math.ceil(r-t.s0)+3),g=new Float32Array(i).fill(t.lat0),k=eo(t.s0,t.lat0,i,g),M=dt.filter(z=>z.s>t.s0-8&&z.s<r+8);t.line=g,k<i-1&&(r=Math.min(r,t.s0+k-1-1.5));for(let z=1;z<i;z++){const I=t.s0+z-1;if(I>r+1)break;if(M.some(c=>Math.hypot((c.s-I)/(c.ra+.35),(c.lat-g[z])/(c.rl+.35))<1)){r=Math.min(r,I-2.5);break}}for(let z=0;z<24;z++){const I=oe(t,r);if(!c0.some((c,f)=>f>e&&Math.hypot((c.s0+c.run-r)/2,(oe(c,c.s0+c.run)-I)/1.3)<1))break;r-=.5}t.run=Math.max(r-t.s0,0),e%2&&await s.yield()}await s.yield();const Q0=2,pt=c0.map((e,t)=>t).sort((e,t)=>c0[t].s0-c0[e].s0);for(const e of c0)e.ahead=[],e.gap=[],e.run<.5&&(e.run=0);for(let e=1;e<m0;e++){const t=pt[e],o=c0[t];for(let n=0;n<e;n++){const r=pt[n],i=c0[r],g=Math.max(o.s0,i.s0-Q0),k=Math.min(o.s0+o.run,i.s0+i.run+Q0);let M=!1;for(let z=g;z<=k&&!M;z=z<k?Math.min(z+.25,k):k+1)for(let I=-Q0;I<=Q0;I+=.5){const c=p0(z+I,i.s0,i.s0+i.run);if(Math.abs(c-z)<=Q0&&Math.hypot((c-z)/Q0,(oe(o,z)-oe(i,c))/1.3)<1.1){M=!0;break}}if(M){const z=Math.min(o.run,i.s0+i.run-Q0-o.s0);o.ahead.push(r),o.gap.push(Math.min(Q0,i.s0-o.s0)),o.run=z<.5?0:z}}}await s.yield();const to=new Float32Array(m0),oo=new Float32Array(m0),ao=(e,t)=>{for(let o=0;o<m0;o++){const n=pt[o],r=c0[n];let i=Ho(r,Zo(r,e));for(let g=0;g<r.ahead.length;g++){const k=r.ahead[g];i=Math.min(i,c0[k].s0+t[k]-r.gap[g]-r.s0)}t[n]=Math.max(i,0)}return t};let no=0;for(let e=0;e<m0;e++)no+=c0[e].s0/m0;const Wo=(e,t)=>{const o=_o(e);let n=.05,r=Math.max(o+16,no)*.05;ao(e,oo);for(let i=0;i<m0;i++){const g=c0[i],k=oo[i],M=g.s0+k-o,z=G(.3,2,k)*G(.3,2.5,g.run-k),I=G(-4,4,M)*(1/12+11/12*z*(1-G(34,46,M)));n+=I,r+=I*(g.s0+k)}return te(r/n,t),t.y=L(t.x,t.z)+1,t};let de=null;{let e=1/0,t=-1/0;for(const r of c0)t=Math.max(t,r.s0+r.run),r.run>=.5&&(e=Math.min(e,r.dBreak));const o=e-Re,n=Math.min(te(t,rt).y,te(ct,rt).y);n>o&&(de={open:o,close:n,fade:Re/(n-o)})}await s.yield();const j0=Po(C,Ze);j0.root.position.copy(x0),j0.root.scale.setScalar(1.25),u0(l0(.165)),j0.root.rotation.y=Math.atan2($.x-x0.x,$.z-x0.z),q.add(j0.root);let T0=null;await s.yield(),S&&(T0=Po(C,Ze),T0.root.position.set(x0.x+Me.x*1.9*U0,x0.y+.08*U0,x0.z+Me.z*1.9*U0),T0.root.scale.setScalar(.62),T0.root.rotation.y=j0.root.rotation.y+.5,q.add(T0.root)),await s.yield();const X0=new d.Vector3,mt=new d.Quaternion,$o=new d.Vector3,Qa=new d.Vector3,e0=new d.Vector3,y0=new d.Vector3,S0=new d.Vector3,q0=new d.Vector3,Z0=new d.Vector3,f0=new d.Vector3,w0=new d.Quaternion,so=new d.Quaternion,ro=new d.Matrix4,V0=new d.Vector3(0,1,0),io=new d.Vector3(0,0,1),Yo=new d.Vector3,Ee=new d.Vector3,Ge=new d.Vector3,ae=new d.Vector3,ja=new d.Vector3,Jo=new d.Vector3,ne=(e,t,o,n)=>(ro.lookAt(Yo,e,t),n.setFromRotationMatrix(ro),o&&n.multiply(so.setFromAxisAngle(io,o)),n),ea=new d.CatmullRomCurve3([new d.Vector3(-11,10,2),new d.Vector3(-1.2,.9,6.3),new d.Vector3(-1.5,1.2,10.5),new d.Vector3(3.2,-3.2,13)],!1,"catmullrom",.5),Le=.266,ta=.07,pe=[.33,.36,.455,.5,.54,.56,.58,.6,.63],lo=[0,2.6,2.6,-6.2,-5.6,-2.2,1.2,.8,0];function oa(e,t,o){const n=G(.325,.37,e)*(1-G(.56,.64,e)),r=G(.56,.68,e),i=G(.885,.932,e),g=G(.958,1,e);let k=0;for(let z=1;z<pe.length;z++)if(e<pe[z]){k=j(lo[z-1],lo[z],G(pe[z-1],pe[z],Math.max(e,pe[0])));break}o.set(j(j(3.2,-.9,n)+k+6*r,-6.8,i)+.8*Math.sin(t*.5)-17*g*g,j(-j(j(3.2,4.3,n),-.4,r)-1.5*G(.34,.37,e)*(1-G(.45,.5,e)),4.6,i)+.45*Math.sin(t*.7+1)+8*g,j(13,12,n)+1.5*i+29*g);const M=p0((e-Le)/ta,0,1);if(M<1){ea.getPoint(M,Z0);const z=G(.75,1,M);o.lerpVectors(Z0,o,z)}return M}function vt(e,t,o){const n=oa(e,t,Ge);return u0(l0(e)+Ge.z),o.copy($).addScaledVector(s0,Ge.x).addScaledVector(V0,Ge.y),e<Le&&(u0(l0(e)+120),q0.copy($),q0.x+=30*Math.cos(t*.22),q0.y+=55+4*Math.sin(t*.3),q0.z+=30*Math.sin(t*.22),u0(l0(e)+21),Z0.copy($).addScaledVector(s0,7+Math.sin(t*.5)).addScaledVector(V0,3+.6*Math.sin(t*.7)),q0.lerp(Z0,G(.2,.236,e)),o.lerpVectors(q0,o,G(.248,Le,e))),n}const me=new d.Vector3,se=new d.Vector3,ut=new d.Vector3,co=R.materials.ground.uniforms.uAshFall,fo=R.upperDetail||[],aa=R.grow.up,na=R.grow.far,sa=R.grow.out,ra=R.grow.rib;co.value=0;function ia(e,t,o,n){const r=I0(n);R.setProgress(n),R.update(e,t,o),o.matrixWorld.decompose(X0,mt,$o),ye.position.copy(X0);{const E=P==="blueblack"?G(.06,.34,r):1,V=G(.2,.6,r);Q.uWash.value.set(j(j(16,62,E),120,V),j(j(50,200,E),460,V))}const i=r<.36,g=r>.4;for(let E=0;E<G0.length;E++)G0[E].visible=i;for(let E=0;E<ie.length;E++)ie[E].visible=g;{const E=Math.hypot(X0.x,X0.z),V=1-G(558,600,E),H=G(530,558,E);aa.set(V,V),ra.value=V,na.y=H,sa.set(1-V,1-V);for(let a0=0;a0<fo.length;a0++)fo[a0].visible=V>0;Rt.visible=Et.visible=V<1,ot&&(ot.visible=V>0)}D&&(co.value=G(.42,.9,r)),fe&&(fe.uCam.value.copy(X0),fe.uFall.value.x=D?.95*G(.38,.72,r):.9*G(.4,.56,r)*(1-G(.9,.98,r)));const k=n*o0,M=vt(r,t,Ee);vt(Math.min(r+.004,1),t,e0),vt(Math.max(r-.004,0),t,y0),f0.subVectors(e0,y0);let z=.27*Math.sin(t*.62)+.06*Math.sin(t*2.3+1)-.55*G(.215,.236,r)*(1-G(.25,.266,r));if(u0(k),r>=Le&&M<1){const E=Math.exp(-Math.pow((M-.33)/.24,2));f0.normalize().lerp(S0.copy(s0).addScaledVector(D0,.3).addScaledVector(V0,-.25),.92*E),z+=-1.22*E+.5*G(.55,.8,M)*(1-G(.8,1,M))}{const E=G(.895,.935,r),V=G(.958,1,r);z+=-.78*E*(1-G(.955,.975,r))+.85*Math.sin(Math.PI*V)*(V<1?1:0)}f0.lengthSq()<1e-8&&f0.copy(D0),f0.normalize(),f0.y*=.75,ne(f0,V0,z,w0),Fe.set(0,Ee,1.4,w0,t*1.3,.07,0,.13+.05*Math.sin(t*.6)),Zt>1&&(e0.copy(Ee).addScaledVector(s0,9+2.5*Math.sin(t*.31)).addScaledVector(D0,15).addScaledVector(V0,6+1.5*Math.sin(t*.43)),ne(f0,V0,.2*Math.sin(t*.7+2),w0),Fe.set(1,e0,.9,w0,t*1.1+2,.07,0,.16)),Fe.flush(),R.setShadows(r>.001?X0:null,Ee),O.tangentAtDist(k,se),O.tangentAtDist(k+22,ut);const I=p0((se.z*ut.x-se.x*ut.z)*.8,-.14,.14),c=Math.max(0,se.y);O.tangentAtDist(k-9,y0),O.tangentAtDist(k+13,S0);const f=Math.min(1,1.1*c+2.5*Math.abs(I)),b=Math.min(1,1.1*Math.max(0,y0.y)+2.5*Math.abs(p0((y0.z*S0.x-y0.x*S0.z)*.8,-.14,.14))),x=o.projectionMatrix.elements,B=1/Math.max(x[0],.05),_=1/Math.max(x[5],.05),K=2.8,W=Math.min(_,.75*B)*K,Y=.12*Math.tanh(I/.06);w0.copy(mt).multiply(so.setFromAxisAngle(io,Y));for(let E=-1;E<=1;E+=2)e0.set(E*B*K,-_*K+E*Y*1.3*W,-K).applyQuaternion(mt).add(X0),P0[E<0?0:1].set(0,e0,W,w0,t*2.4,f,b,E*Y/.12),P0[E<0?0:1].flush(),P0[E<0?0:1].mesh.visible=n>0;const h0=1-G(Eo,Go,k);O.posAtDist(p0(k+26,30,Lo),S0),S0.x+=11*h0*se.z,S0.z-=11*h0*se.x,S0.y+=4.5+5*h0;for(let E=0;E<at;E++){const V=qe[E];if(E<nt){const H=Math.max(0,k-V.d0)/16,a0=Math.max(0,H-5.2),v0=Math.exp(-H*.9),t0=36+V.vT*H+1.2*a0*a0,M0=-12+V.vR*Math.min(H,2.6)-1.5*a0*a0,C0=(H<2.6?V.vR:0)-3*a0;O.posAtDist(Math.min(t0,o0-1),e0),O.tangentAtDist(Math.min(t0,o0-1),q0),Z0.set(-q0.z,0,q0.x).normalize();const ve=j(V.s.y-26,V.hh-7,1-v0)+.9*a0*a0;e0.addScaledVector(Z0,M0),e0.x+=V.s.x-We.x,e0.z+=V.s.z-We.z,e0.x+=.45*Math.sin(t*1.3+V.ph),e0.y+=ve+.3*Math.sin(t*1.7+V.ph*2),e0.z+=.45*Math.cos(t*1.1+V.ph),f0.copy(q0).multiplyScalar(V.vT).addScaledVector(Z0,C0),f0.y+=(V.hh+19-V.s.y)*.9*v0+1.8*a0+.6*Math.sin(t*1.7+V.ph*2),ne(f0,V0,.25*Math.sin(t*1.3+V.ph)+p0(.1*(3*a0-(H<2.6?V.vR:0)),-.6,.6),w0),Ie.set(E,e0,H>0?1.75:0,w0,t*13+V.ph,.85,0,.1)}else{const H=t*V.w+V.ph;e0.set(S0.x+V.r*Math.cos(H),S0.y+V.h+1.2*Math.sin(H*1.7+V.ph),S0.z+V.r*.8*Math.sin(H)),f0.set(-Math.sin(H)*Math.sign(V.w),.25*Math.cos(H*1.7+V.ph),.8*Math.cos(H)*Math.sign(V.w)),ne(f0,V0,-.45*Math.sign(V.w),w0),Ie.set(E,e0,1.75,w0,t*12+V.ph,.85,0,.1)}}Ie.flush();for(let E=0;E<Ve;E++){const V=Ht[E],H=t*V.rate+V.ph,a0=Math.abs(H%2-1),v0=G(.42,.58,a0);e0.lerpVectors(V.a,V.b,v0),f0.copy(e0).negate(),f0.y=-.1,e0.add(V.c),e0.y+=.05*Math.sin(t*7+E),ne(f0,V0,0,w0),st.set(E,e0,1,w0,t*61+E,1.1,0,.2)}Ve&&st.flush(),ao(k,to);for(let E=0;E<m0;E++){const V=c0[E],H=to[E],a0=V.run-H,v0=V.s0+H,t0=4.27*V.sc,M0=G(V.dBreak-45,V.dBreak-8,k),C0=V.run<.5?.25:Math.min(1,.25+H/4,.25+a0/4),ve=H<=3?4/t0*Math.log(1+H):a0>=3?4/t0*Math.log(4)+(H-3)/t0:4/t0*Math.log(4)+(V.run-6)/t0+4/t0*Math.log(4/(1+a0));te(v0-.7,y0);const H0=y0.x,ho=y0.z;te(v0+.7,y0);const gt=y0.x-H0,xt=y0.z-ho,Qe=Math.hypot(gt,xt)||1,po=oe(V,v0-.7),mo=oe(V,v0+.7),yt=H0+xt/Qe*po,wt=ho-gt/Qe*po,Mt=y0.x+xt/Qe*mo,bt=y0.z-gt/Qe*mo,vo=L(yt,wt),uo=L(Mt,bt),go=Mt-yt,xo=bt-wt,je=ve*X+V.ph,kt=G(.25,.6,C0);e0.set((yt+Mt)/2,(vo+uo)/2+.02+.035*kt*Math.sin(je*2),(wt+bt)/2);const yo=V.yaw*(1-G(0,2.5,H)),wo=Math.cos(yo),Mo=Math.sin(yo);f0.set(go*wo-xo*Mo,(uo-vo)*.8+.08*kt*Math.cos(je),go*Mo+xo*wo),ne(f0,V0,0,w0),it.set(E,e0,V.sc,w0,je,C0,0,j(j(V.graze,.1,M0),.1*Math.sin(je),kt))}it.flush();const F0=G(.1,.185,r),_e=.5+.5*Math.sin(t*2.1);j0.torso.rotation.x=j(.85,.06,F0)+.04*Math.sin(t*.9),j0.arms.rotation.x=j(.5,-.1,F0)-.3*_e,j0.torso.rotation.y=.18*Math.sin(t*.6),T0&&(T0.torso.rotation.x=.25+.15*Math.sin(t*1.3),T0.arms.rotation.x=-.2-.35*(.5+.5*Math.sin(t*2.9)),T0.torso.rotation.y=.4*Math.sin(t*.8+1))}const la=Z.portalSeat.position.clone().add(new d.Vector3(-4,4,-4));return{scene:q,path:O,duration:50,pace:Be,title:P==="sanguine"?"The Cut Mountain, afternoon proof":P==="blueblack"?"The Cut Mountain, first light":"The Cut Mountain",camera:{fov:62,near:.3,far:9e3},pois:[{at:new d.Vector3(0,95,560),from:-.12,to:z0(.118),weight:.42},{at:x0,from:z0(.125),to:z0(.24),weight:.62},{at:new d.Vector3(-30,400,80),from:z0(.068),to:z0(.168),weight:.44},{at:(e,t)=>{O.posAtDist(t*o0,ae);const o=Math.max(ae.x,8);return ae.z-=16+.95*o,ae.y-=6+.12*o,ae.x=0,ae},from:z0(.275),to:z0(.63),weight:.64},{at:(e,t)=>(O.posAtDist(t*o0,me),me.x=0,me.y+=6,me.z-=170,me),from:z0(.545),to:z0(.71),weight:.8},...de?[{at:(e,t)=>Wo(t*o0,Jo),from:de.open/o0,to:de.close/o0,fade:de.fade,weight:.7}]:[],{at:la,from:z0(.6),to:z0(.97),weight:.3}],portal:{shape:"circle",radius:7,color:P==="blueblack"?"#5F8F8E":"#C6452B",glow:.5,revealDistance:320,tilt:!0},post:{exposure:1,flat:1,bloom:{strength:0},grade:{saturation:1,contrast:1,vignette:0,grain:0}},ride:"none",companion:"none",style:"none",update:ia,dispose(){R.dispose?.()}}}};export{Wa as default};
