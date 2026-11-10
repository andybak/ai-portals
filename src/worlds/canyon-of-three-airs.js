import*as t from"three";import{makePath as Zo,clamp as Ke,smoothstep as P,lerp as $}from"../kit/core.js";import{mergeGeometries as Oo,mergeVertices as Xo}from"three/addons/utils/BufferGeometryUtils.js";import{buildHero as Yo,SWELL_GLSL as Mt,SKIN_GLSL as Qo,swellAt as jt}from"../parts/canyon-of-three-airs.js";const Z=.643,O=-.766,X=.766,Y=.643,ce=260,H=-300,J=-480,W=(N,q,Q)=>new t.Vector3(Z*N+X*q,Q,O*N+Y*q),$o=[{name:"Canyon of Three Airs",c:["#F4B8C4","#F0B254","#2FA7A0"],deep:"#12494E",rust:"#C4472E"},{name:"Canyon of Three Airs: Lilac Tide",c:["#C9B4F0","#F2DC8A","#3F4FB0"],deep:"#1A2060",rust:"#B8562E"},{name:"Canyon of Three Airs: Pearl and Coral",c:["#EBD0D8","#F08A6A","#3A78D0"],deep:"#122A70",rust:"#A83A4E"}],zt=`
float h21(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x),mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x),f.y); }
`,He=Mt+`
uniform vec3 uC0, uC1, uC2, uLv, uFogCol; uniform float uTime, uFogDen;
vec4 c3aLayer(vec3 p, out float line){
  float sw = c3aSwell(p.xz, uTime);
  float a0 = smoothstep(-1.5, 1.5, p.y - uLv.x - sw * 0.5);
  float a1 = smoothstep(-1.5, 1.5, p.y - uLv.y - sw);
  float a2 = smoothstep(-1.5, 1.5, p.y - uLv.z - sw * 0.4);
  vec3 c = mix(uC2, uC1, a2); c = mix(c, uC0, a1); c = mix(c, vec3(1.), a0);
  line = max(max(a0 * (1. - a0), a1 * (1. - a1)), a2 * (1. - a2)) * 4.;
  return vec4(c, a0 + a1 + a2);
}
vec3 c3aFog(vec3 col, vec3 wp){
  float d = distance(wp, cameraPosition) * uFogDen;
  return mix(uFogCol, col, exp(-d * d));
}
`,St=`
attribute vec3 aCol; varying vec3 vW, vN, vCol;
#ifdef TERR
attribute float aF; varying float vF;
#endif
void main(){
  mat4 m = modelMatrix;
  #ifdef USE_INSTANCING
  m = modelMatrix * instanceMatrix;
  #endif
  // a spire is a unit cone stretched many times taller than wide: the normal has to be stretched the other way
  mat3 m3 = mat3(m); vec3 s2 = max(vec3(dot(m3[0], m3[0]), dot(m3[1], m3[1]), dot(m3[2], m3[2])), vec3(1e-6));
  vec4 wp = m * vec4(position, 1.); vW = wp.xyz; vN = m3 * (normal / s2); vCol = aCol;
  #ifdef TERR
  vF = aF;
  #endif
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,Ft=zt+He+`
uniform vec3 uSun, uKey, uFill, uFlora0, uFlora1, uFlora2; uniform float uStrata, uLift; uniform vec4 uPools[3];
varying vec3 vW, vN, vCol;
#ifdef TERR
varying float vF;
#endif
void main(){
  vec3 n = normalize(vN + vec3(0., 1e-4, 0.)); if (!gl_FrontFacing) n = -n;
  vec3 nl = normalize(n + vec3(0., uLift + 1e-4, 0.));                        // the standing stones take the light of the lid as well as the sun's
  float dist = distance(vW, cameraPosition);
  float s = vW.y * 0.42 + 4. * vn(vW.xz * 0.012);
  float band = 0.82 + 0.22 * sin(s) * sin(s * 0.37 + 1.7) + 0.09 * sin(s * 5.3) + 0.1 * (vn(vW.xz * 0.35 + vW.y * 0.6) - 0.5);
  float steep = 1. - smoothstep(0.55, 0.8, n.y);
  vec3 alb = vCol * mix(1., band, uStrata * steep);
  // strata in two or three related colours: warm cream, cool grey, a thin rust course
  vec3 hue = mix(vec3(1.1, 0.97, 0.78), vec3(0.8, 0.92, 1.04), smoothstep(-0.3, 0.3, sin(s * 0.23 + 0.7)));
  hue = mix(hue, vec3(1.1, 0.74, 0.56), smoothstep(0.78, 0.97, sin(s * 0.11 + 2.)) * 0.7);
  alb *= mix(vec3(1.), hue, uStrata * steep);
  float line; vec4 L = c3aLayer(vW, line);
  float a2 = step(0.5, L.w), a1 = step(1.5, L.w), a0 = step(2.5, L.w);
  // above the top skin the rock is the spires' own rock in the sun: bold courses of cream, sage and ochre a dozen metres thick
  float bi = floor(s * 0.19 + 0.6 * sin(s * 0.07 + 1.));
  float bh = h21(vec2(bi, 1.3));
  vec3 bcol = bh < 0.4 ? vec3(1.14, 1.0, 0.78) : (bh < 0.68 ? vec3(0.84, 0.94, 0.84) : vec3(1.2, 0.8, 0.55));
  alb *= mix(vec3(1.), bcol, uStrata * a0 * (0.55 + 0.3 * steep));
  // lichen, one kind to each air: it follows the strata in long hanging rows, never in blobs
  float along = vW.x * ${Z.toFixed(3)} + vW.z * ${O.toFixed(3)};
  float pn = vn(vec2(along * 0.034, vW.y * 0.19)) * 0.55 + 0.3 * vn(vec2(along * 0.11, vW.y * 0.45 + 3.)) + 0.15 * vn(vec2(along * 0.6, vW.y * 1.7));
  float shelf = 0.5 + 0.5 * sin(s * 2. + 1.);
  float frT = fract((vW.y - (${J.toFixed(1)})) / 52.);
  float ao = 1. - 0.34 * (1. - smoothstep(0., 0.17, frT)) - 0.22 * smoothstep(0.78, 0.92, frT);
  alb *= mix(1., ao, uStrata * steep);                                       // the foot of each riser and the hollow under each ledge sit in shade
  alb = mix(alb, vec3(1.02, 0.97, 0.86), smoothstep(0.945, 0.985, frT) * steep * uStrata * 0.55);   // the worn pale rim of each ledge
  float hang = 0.3 + 0.7 * smoothstep(0.5, 0.9, frT);
  float patchM = smoothstep(0.5, 0.64, pn * (0.7 + 0.5 * shelf)) * uStrata * (1. - a0) * 0.85 * steep * hang;
  vec3 flora = mix(mix(uFlora2, uFlora1, a2), uFlora0, a1);
  float tips = smoothstep(0.62, 0.8, pn * (0.7 + 0.5 * shelf));
  alb = mix(alb, mix(flora, alb, 0.2) * (0.7 + 0.5 * vn(vec2(along * 1.3, vW.y * 2.2)) + 0.5 * tips), patchM);
  // old tide-lines under each surface
  float tide = smoothstep(0.55, 0.7, vn(vec2(vW.x * 0.3 + vW.z * 0.2, 0.))) * uStrata;
  vec3 dy = vec3(vW.y) - uLv;
  float old = max(max(exp(-abs(dy.x + 9.) * 0.5), exp(-abs(dy.y + 9.) * 0.5)), exp(-abs(dy.z + 9.) * 0.5));
  alb = mix(alb, vec3(0.93, 0.9, 0.82), old * (0.35 + 0.4 * tide) * uStrata);
  float lvl = (1. - steep) * uStrata;
  #ifdef TERR
  // rimstone terraces: the same field that stepped the mesh, cut per pixel so every lip is crisp
  float fw = fwidth(vF), fr = fract(vF), lv = floor(vF);
  float aa = 1. - smoothstep(0.3, 0.8, fw);
  float riser = smoothstep(0.76, 0.8, fr);
  float lip = 1. - smoothstep(0.015, 0.07 + fw, fr);
  float foot = smoothstep(0.5, 0.76, fr) * (1. - riser);
  float pool = smoothstep(0.07, 0.3, fr) * (1. - smoothstep(0.55, 0.76, fr));
  float hsh = h21(vec2(lv, 3.7));
  vec3 poolc = mix(vec3(0.62, 0.72, 0.68), vec3(0.8, 0.8, 0.7), hsh) * (0.82 + 0.25 * vn(vW.xz * 0.21));
  vec3 terr = mix(vec3(0.82, 0.78, 0.68), poolc, pool);
  terr *= 1. - 0.42 * foot;                                                  // the shadow each lip casts on the pool below
  float drip = 0.75 + 0.25 * sin(along * 2.3 + 5. * vn(vW.xz * 0.4)) ;
  terr = mix(terr, vec3(0.6, 0.57, 0.5) * drip, riser);
  terr = mix(terr, vec3(1.02, 0.97, 0.84), lip);
  // pale ground-fog sliding between the lips
  float gfog = smoothstep(0.4, 0.78, vn(vW.xz * 0.03 + vec2(uTime * 0.07, -uTime * 0.045)) * 0.7 + 0.3 * vn(vW.xz * 0.11 - vec2(uTime * 0.11, 0.)));
  terr = mix(terr, vec3(0.93, 0.98, 0.95), gfog * (0.25 + 0.4 * pool + 0.3 * foot) * 0.75);
  alb = mix(alb, mix(vec3(0.74, 0.74, 0.66), terr, aa), 0.92);
  #else
  // level rock: wind-scoured streaks and cracked plates, quiet enough to sit under whatever lies on it
  float plates = vn(vW.xz * 0.045 + 7.) * 0.6 + vn(vW.xz * vec2(0.011, 0.07)) * 0.4;
  float crack = smoothstep(0.44, 0.47, abs(fract(vn(vW.xz * 0.09 + 2.) * 3.) - 0.5));
  alb *= mix(vec3(1.), mix(vec3(0.74, 0.66, 0.56), vec3(1.02, 0.98, 0.9), plates) * (1. - 0.3 * crack * (1. - smoothstep(60., 220., dist))), lvl);
  // the strata worn through on the level: each plate inside its crack line is one course, cream, cool grey or rust
  float crs = floor(vn(vW.xz * 0.09 + 2.) * 3. + 0.5) + floor(vn(vW.xz * 0.021 + 9.) * 4.);
  float ch = h21(vec2(crs, 5.3));
  vec3 course = ch < 0.4 ? vec3(1.07, 0.93, 0.8) : (ch < 0.72 ? vec3(0.84, 0.9, 0.99) : vec3(1.08, 0.76, 0.66));
  course = mix(course, ch < 0.4 ? vec3(1.12, 0.96, 0.72) : (ch < 0.72 ? vec3(0.8, 0.93, 0.84) : vec3(1.2, 0.76, 0.5)), a0);
  alb *= mix(vec3(1.), course, lvl * (0.7 + 0.25 * a0));
  // and wide worn courses that still read from across the canyon: a seam line between each and the next
  float topo = vn(vW.xz * 0.017 + 4.) * 7. + vW.y * 0.03;
  float tf = fract(topo), seam = (1. - smoothstep(0., 0.45, tf)) * smoothstep(0., 0.04, tf);    // each course throws a soft shadow on the one below
  alb *= mix(1., (0.82 + 0.3 * h21(vec2(floor(topo), 2.1))) * (1. - 0.24 * seam), lvl * 0.85);
  #endif
  float sand = vn(vec2(along * 0.045 - uTime * 0.9, vW.x * ${X.toFixed(3)} * 0.3 + vW.z * ${Y.toFixed(3)} * 0.3)) * vn(vec2(along * 0.013 - uTime * 0.35, vW.z * 0.02 + 5.));
  alb *= 1. + lvl * a0 * (smoothstep(0.2, 0.55, sand) * 0.5 - 0.12) * (1. - smoothstep(150., 500., dist));
  float key = max(dot(nl, uSun), 0.);
  vec3 col = alb * (uKey * key + uFill * (0.5 + 0.35 * nl.y)) * mix(vec3(1.), L.rgb, 0.45);
  // gold caustics in the lowest air: a fine net that drifts and breaks into dapples
  vec2 cw = vW.xz * 0.05 + 1.7 * vec2(vn(vW.xz * 0.023 + uTime * 0.05), vn(vW.zx * 0.023 - uTime * 0.04)) + vW.y * 0.02;
  float ca = abs(sin(cw.x * 1.9 + uTime * 0.31)), cb = abs(sin(cw.y * 1.7 - uTime * 0.27)), cc = abs(sin((cw.x + cw.y) * 1.3 + uTime * 0.2));
  float cn = 1. - min(ca, min(cb, cc)); cn *= cn; cn *= cn; cn *= cn; cn *= cn;
  float dap = smoothstep(0.3, 0.7, vn(vW.xz * 0.009 + vec2(uTime * 0.03, -uTime * 0.02)));
  float up = 0.06 + 0.94 * max(n.y, 0.); up *= up;
  col += (1. - a2) * vec3(1., 0.78, 0.38) * (cn * dap * dap * 0.5 + 0.05 * dap) * up * (1. - smoothstep(250., 600., dist));
  // pools of light under the shafts
  vec3 pl = vec3(0.);
  for (int i = 0; i < 3; i++) { vec2 d = vW.xz - uPools[i].xy; pl += vec3(1., 0.8, 0.42) * uPools[i].w * exp(-dot(d, d) / max(uPools[i].z * uPools[i].z, 1.)); }
  col += alb * pl * (1. - a2) * up;
  float dapl = vn(vec2(vW.x * 0.03 + vW.y * 0.02 + uTime * 0.55, vW.z * 0.03 - uTime * 0.4)) * 0.6 + 0.4 * vn(vec2(vW.x * 0.11 - uTime * 0.9, vW.y * 0.09 + vW.z * 0.1));
  col *= 0.8 + 0.4 * dapl;
  col += vec3(1., 0.96, 0.86) * line * 0.7 * (1. - smoothstep(50., 240., dist));   // the skin line shows on rock close by; far off it would rule a straight line along the wall
  col += uFogCol * 0.07;                                                     // never pure black, in any air
  col = max(col, vec3(0.034, 0.038, 0.056) + uFogCol * 0.09);
  gl_FragColor = vec4(c3aFog(col, vW), 1.);
}`,Jo=Mt+`
uniform float uTime, uLevel, uAmp, uRidge, uUp; uniform vec4 uHole; uniform vec4 uHoles[3]; uniform vec4 uSag[2];
varying vec3 vW; varying float vRidge, vVault, vSag;
void main(){
  vec3 p = position; p.y = uLevel + c3aSwell(p.xz, uTime) * uAmp;
  // the rest of the billow train, standing down the canyon behind the hero
  float zz = p.z - uHole.z + 780.;
  float m = (1. - smoothstep(-80., 0., zz)) * uRidge;
  float ph = zz * 0.0157 + 0.0012 * p.x + 0.35 * sin(p.x * 0.004);
  float c = 0.5 + 0.5 * cos(ph);
  vRidge = c * c * c * m * uUp; p.y += vRidge * 62.; p.z += vRidge * 24.;      // uUp 0 once the camera is under the skin: the far train sinks back level with the ceiling
  // seen from inside the amber every billow of the train is a long rounded vault in the one unbroken ceiling
  float vv = 0.;
  for (int i = 0; i < 3; i++) {
    vec4 h = uHoles[i]; float wz = h.w - h.z, hy = max(h.y, 1.);
    float fx = 1. - smoothstep(hy * 0.5, hy * 0.97, abs(p.x - h.x));
    float t = clamp((p.z - (h.z + wz * 0.44)) / max(wz * 0.4, 1.), -1., 1.);
    float cz = 0.5 + 0.5 * cos(3.14159 * t);
    vv = max(vv, fx * cz * cz * wz / 530.);
  }
  vVault = vv * (1. - uUp) * uRidge; p.y += vVault * 66.;
  // and the troughs before two billows of the train hang down into the amber as long rounded bellies
  float sg = 0.;
  for (int i = 0; i < 2; i++) {
    vec2 d = (p.xz - uSag[i].xy) / max(uSag[i].zw, vec2(1.));
    float q = clamp(1. - dot(d, d), 0., 1.);
    sg = max(sg, q * q * (3. - 2. * q));
  }
  vSag = sg * (1. - uUp) * uRidge; p.y -= vSag * (46. + 5. * sin(uTime * 0.21 + p.x * 0.01));
  vW = p; gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
}`,e0=zt+He+Qo+`
uniform vec3 uBelow, uAbove, uSun, uKey, uFill, uGold, uBody; uniform vec4 uHole; uniform vec4 uBars[3]; uniform vec4 uHoles[3];
// where a rolled billow stands in for the skin: 1 inside its footprint (x centre, half length, z back, z front), soft and uneven at the edge
float c3aCut(vec4 h, vec3 w, float inset, float jit){
  float hx = 1. - smoothstep(h.y - 45. - inset, h.y - inset * 0.4, abs(w.x - h.x) + jit);
  float hz = smoothstep(h.z + inset * 0.5, h.z + 45. + inset * 1.5, w.z - jit) * (1. - smoothstep(h.w - 45. - inset * 1.7, h.w - inset * 0.7, w.z + jit));
  return hx * hz;
}
float c3aNear(vec4 h, vec3 w){
  float dx = max(abs(w.x - h.x) - h.y, 0.), dz = max(max(h.z - w.z, w.z - h.w), 0.);
  return 1. - smoothstep(0., 300., sqrt(dx * dx + dz * dz + 1e-4));
} uniform float uLevel, uRidge, uGlit, uAlpha, uGhost, uLid, uUp, uAmp; uniform vec3 uSunC;
// one billow of the train seen through the top skin: x = body of the bar, y = its bright curling crest
vec2 c3aBar(vec2 p, vec4 b){
  float bx = 1. - smoothstep(0.5 * b.w, b.w, abs(p.x - b.y));
  float dz = (p.y - b.x) / (125. * b.z);
  float e = dz - 0.6;
  return vec2(exp(-dz * dz), exp(-e * e * 11.)) * bx * (0.5 + 0.5 * b.z);
}
varying vec3 vW; varying float vRidge, vVault, vSag;
void main(){
  vec3 V = cameraPosition - vW; float dist = length(V) + 1e-3; V /= dist;
  float above = step(vW.y, cameraPosition.y);
  float graze = 1. - abs(V.y);
  // coin glitter, twinkling
  vec2 q = vW.xz * 1.1 + vec2(uTime * 0.3, 0.);
  vec2 ci = floor(q); float hsh = h21(ci);
  float tw = 0.5 + 0.5 * sin(uTime * (2. + 3. * hsh) + hsh * 40.);
  float near = 1. - smoothstep(40., 190., dist); vec2 cf = fract(q) - 0.5; float spot = 1. - smoothstep(0.02, 0.16, dot(cf, cf));
  float rows = 0., gl = 0.;
  vec3 col; float alpha;
  vec3 hlf = normalize(V + uSun + vec3(0., 1e-3, 0.));
  if (above > 0.5) {
    // FROM ABOVE the skin is a surface: slow swells that shade and catch a crisp sheen, cells of mineral scum with cream walls,
    // small rafts riding at their hearts, short broken wind-rows lying across the canyon; all of it sinks into the air's colour far off
    float rdg = clamp(uRidge, 0., 1.);
    float fineK = 1. - smoothstep(70., 300., dist), midK = 1. - smoothstep(500., 1700., dist);
    vec2 sp = vW.xz; float e = 1.6;
    // (the swells are laid in a frame turned so their crests lie across the canyon: long backs, each a few of its own lengths wide)
    vec2 wsc = mix(vec2(1.7, 0.55), vec2(0.95), uLid);                               // (the lid is flown over on every heading: its chop has no grain)
    vec2 wq = mix(vec2(dot(sp, vec2(0.985, -0.17)), dot(sp, vec2(0.17, 0.985))), sp, uLid) * wsc;
    float h0 = c3aChop(wq, uTime, fineK), hx = c3aChop(wq + vec2(e, 0.), uTime, fineK), hz = c3aChop(wq + vec2(0., e), uTime, fineK);
    vec2 sq = vec2(hx - h0, hz - h0) / e * wsc;
    vec2 slope = c3aSwellG(sp, uTime) * uAmp * mix(3., 0.9, uLid) + mix(vec2(0.985 * sq.x + 0.17 * sq.y, -0.17 * sq.x + 0.985 * sq.y), sq, uLid) * (0.3 + 0.7 * midK);
    vec3 n = normalize(vec3(-slope.x, 1., -slope.y));
    float rel = -(slope.x * uSun.x + slope.y * uSun.z);
    float shade = clamp(1. + 2.6 * rel + 0.14 * (h0 - 2.), 0.58, 1.34);
    float nh = max(dot(n, hlf), 0.), nh8 = nh * nh; nh8 *= nh8; nh8 *= nh8; float nh64 = nh8 * nh8; nh64 *= nh64; nh64 *= nh64;
    vec3 base0 = uBelow * (0.7 + 0.25 * vRidge + 0.45 * uLid) * (0.75 + 0.25 * uKey);
    // the middle skin is the same deep amber as the rolled billow standing in it, so the two meet without an edge
    vec3 base1 = uBody * (uKey * vec3(1., 0.95, 0.8) * (0.62 + 0.3 * vRidge) + uFill * vec3(1.05, 0.9, 0.62) * 0.73) * 1.08;
    float prox = max(c3aNear(uHoles[0], vW), max(c3aNear(uHoles[1], vW), c3aNear(uHoles[2], vW))) * rdg;
    base1 = mix(base1, uBody * (uKey * vec3(1., 0.95, 0.8) * 0.72 + uFill * vec3(1.05, 0.9, 0.62) * 0.66), prox * 0.85);
    col = mix(base0, base1, rdg) * shade;
    col *= 1. + 0.3 * nh8 * (1. - 0.6 * uLid);                                    // the satin sheen, in the skin's own colour
    col += uKey * nh64 * (0.12 + 0.9 * step(0.55, hsh) * spot * near) * mix(vec3(1.), vec3(1., 0.86, 0.6), rdg);   // and the sun's glint, broken into sparks
    // cells of scum
    vec2 cp = (sp + vec2(0.5, 0.3) * uTime + 4. * vec2(vn(sp * 0.05 + 2.), vn(sp * 0.05 + 9.))) / 6.5;
    vec2 cw = fwidth(cp); float caa = max(cw.x, cw.y);
    vec4 ce = c3aCells(cp);
    float scumP = smoothstep(0.4, 0.68, vn(sp * 0.011 + vec2(uTime * 0.01, 4.)) * 0.7 + 0.3 * vn(sp * 0.04 + 3.));
    float wall = 1. - smoothstep(0.03, 0.08 + caa * 1.2, ce.x);
    wall = mix(wall, 0.14, smoothstep(0.1, 0.4, caa)) * scumP * smoothstep(0.3, 0.62, vn(sp * 0.19 + 4.)) * (1. - 0.55 * uLid);
    float rr = length(ce.zw) * 6.5, isR = step(0.93, ce.y), rfade = 1. - smoothstep(0.08, 0.3, caa);
    float raft = isR * (1. - smoothstep(0.6, 0.85 + caa * 6.5, rr)) * rfade;
    float rring = isR * (1. - smoothstep(0., 0.25, abs(rr - 1.7 - 0.4 * sin(uTime * 1.3 + ce.y * 40.)))) * rfade;
    // wind-rows: short, broken, lying across the canyon, never a line that runs to the vanishing point
    vec2 rd = vec2(dot(sp, vec2(0.17, 0.985)), dot(sp, vec2(0.985, -0.17)));
    float rowsN = smoothstep(0.6, 0.78, vn(vec2(rd.x * 0.03 + uTime * 0.03, rd.y * 0.15) + 1.7 * vn(sp * 0.012)))
      * smoothstep(0.35, 0.6, vn(sp * 0.02 + 7.)) * (1. - smoothstep(250., 800., dist)) * (1. - uLid);
    vec3 cream = vec3(1., 0.95, 0.85);
    vec3 scum = mix(cream, mix(base0, base1, rdg) * 1.6, 0.3);
    col = mix(col, scum * (0.55 + 0.45 * uKey), clamp(wall * 0.45 + rowsN * 0.2, 0., 0.7));
    col = mix(col, scum * (0.5 + 0.55 * uKey), raft * 0.85);
    col *= 1. - 0.35 * isR * (1. - smoothstep(0.2, 0.45, rr)) * rfade;
    col += scum * rring * 0.22;
    // glitter gathers along the cell walls
    float gath = 1. - smoothstep(0.02, 0.3, ce.x);
    col += cream * step(0.9 - 0.25 * gath, hsh) * tw * near * spot * 2. * uGlit;
    col += vec3(0.72, 1., 0.9) * (wall * 0.22 + 0.05 * nh8) * uLid;
    // at a grazing angle the skin mirrors its own air, kept in colour
    float fz = 1. - clamp(V.y, 0., 1.); fz *= fz; fz *= fz;
    col = mix(col, mix(uFogCol, mix(base0, base1, rdg), 0.55) * 1.04, fz * 0.5);
    alpha = mix(mix(uAlpha, 0.97, graze * graze * graze), mix(0.5, 0.97, 1. - V.y * V.y), rdg);
    alpha = max(alpha, max(raft * 0.9, wall * 0.5));
    if (uGhost > 0.5) {
      // the billow train showing through the skin as gold bars with bright crests (the look-down ray, bent steeply as it enters)
      vec2 p2 = vW.xz - V.xz * 60.;
      vec2 bar = c3aBar(p2, uBars[0]) + c3aBar(p2, uBars[1]) + c3aBar(p2, uBars[2]);
      float zz = p2.y - uHole.z + 780.;
      float rc = 0.5 + 0.5 * cos(zz * 0.0157 + 0.0012 * p2.x + 0.35 * sin(p2.x * 0.004));
      float rm = (1. - smoothstep(-80., 0., zz)) * 0.85; rc = rc * rc * rc;
      bar += vec2(rc, rc * rc * rc) * rm;
      float vis = exp(-dist * 0.00022) * (0.7 + 0.3 * vn(p2 * 0.012 + uTime * 0.03));
      col = mix(col, uGold * vec3(1., 0.84, 0.58) * (0.72 + 0.25 * uKey) * shade, clamp(bar.x * 2.2 * vis, 0., 0.9));
      col += vec3(1., 0.92, 0.66) * bar.y * 1.5 * vis * (0.8 + 0.2 * sin(uTime * 0.7 + p2.x * 0.02));
    }
  } else {
    vec2 rp = uGhost > 0.5 ? vec2(vW.z, -vW.x) : vW.xz;       // the top skin's rows lie across the way we fly under it
    rows = smoothstep(0.45, 0.8, vn(vec2(rp.x * 0.012 + rp.y * 0.004, rp.y * 0.09 + 0.3 * vn(vW.xz * 0.02)) + vec2(uTime * 0.02, uTime * 0.22)));
    gl = step(0.8, hsh) * tw * near * spot * 2.2 + rows * 0.25 * (0.6 + 0.4 * vn(vW.xz * 0.2 + uTime * 0.05));
    float win = smoothstep(mix(0.25, 0.03, uLid), mix(0.75, 0.42, uLid), abs(V.y));
    float sunL = max(dot(-V, uSun), 0.); sunL = sunL * sunL; sunL *= sunL; sunL *= sunL;
    float rdg = clamp(uRidge, 0., 1.);
    col = mix(uFogCol * mix(0.7, 1.15, uLid) + uAbove * 0.3 * rdg, uAbove * mix(1.25, 1.02, rdg), win) + vec3(1., 0.9, 0.7) * sunL * sunL * 1.1 * (1. - rdg) * (0.7 + 0.3 * sin(uTime * 1.7 + vW.x * 0.05));
    col += vec3(1., 0.95, 0.85) * rows * 0.22 * win;
    col *= 1. + 0.13 * sin(uTime * 1.4 + vW.x * 0.08 + vW.z * 0.05);
    col *= 0.82 + 0.36 * rows + 0.2 * (vn(vW.xz * vec2(0.004, 0.03) + 7.) - 0.5);   // wind-rows show through even edge-on
    col += vec3(1., 0.95, 0.85) * (gl * uGlit * 0.7 + rows * 0.1);            // coin glitter drifting past overhead
    // close to, the ceiling shows its grain: strands streaming with the wind, a dapple of denser gas
    float det = (1. - smoothstep(50., 260., dist)) * rdg;
    float fs = vn(vec2(vW.x * 0.035 + uTime * 0.12, vW.z * 0.42)) * 0.6 + vn(vec2(vW.x * 0.11 + uTime * 0.2, vW.z * 1.1)) * 0.4;
    col *= mix(1., 0.66 + 0.68 * fs, det);
    // straight overhead the ceiling is bright enough to wash out, so there the strands are drawn in colour: deep rose-gold between pale gold
    float fine = vn(vec2(vW.x * 0.3 + uTime * 0.3, vW.z * 2.3));
    float st = smoothstep(0.28, 0.72, 0.62 * fs + 0.38 * fine);
    col *= mix(vec3(1.), mix(vec3(0.5, 0.4, 0.37), vec3(1.02, 1., 0.96), st), det * (0.4 + 0.6 * win));
    // within a few metres the skin is all fine strands sliding past, never a blank sheet
    float nearC = (1. - smoothstep(8., 52., dist)) * rdg;
    float mic = vn(vec2(vW.x * 0.45 + uTime * 0.5, vW.z * 3.6)) * 0.62 + vn(vec2(vW.x * 1.2 + uTime * 0.9, vW.z * 9.)) * 0.38;
    col *= mix(vec3(1.), mix(vec3(0.66, 0.55, 0.5), vec3(1.04, 1.01, 0.96), smoothstep(0.2, 0.8, mic)), nearC * 0.85);
    // the billows are thicker gas: their vaults and hanging bellies are a deeper gold than the calm skin between them
    float thick = clamp(max(vVault * 0.75, vSag), 0., 1.);
    col = mix(col, col * (uBody * 1.35 + vec3(0.12, 0.08, 0.04)), thick * 0.8);
    col *= 1. + 0.22 * smoothstep(0.02, 0.3, vSag) * (1. - smoothstep(0.3, 0.75, vSag));      // a paler rim where a belly turns under
    // the ceiling keeps its own colour: whatever the rows and the glow add, it rolls off before it reaches white
    float pk = max(col.r, max(col.g, col.b));
    col *= mix(1., (0.9 + 0.22 * (1. - exp(-(pk - 0.9) * 2.5))) / max(pk, 1e-3), step(0.9, pk) * rdg);
    // the sun smeared through the skin above the gasfall, and its road of glitter running up the ceiling toward the eye
    vec3 sd = -V; float scn = max(dot(sd, uSunC), 0.); float s8 = scn * scn; s8 *= s8; s8 *= s8; float s64 = s8 * s8; s64 *= s64; s64 *= s64; float s256 = s64 * s64; s256 *= s256;
    vec2 sh = sd.xz / max(length(sd.xz), 1e-4), ch = uSunC.xz / max(length(uSunC.xz), 1e-4);
    float az = max(dot(sh, ch), 0.); az *= az; az *= az; az *= az; az *= az; az *= az;
    float road = az * az * smoothstep(uSunC.y - 0.12, uSunC.y + 0.15, sd.y) * (1. - smoothstep(0.55, 0.95, sd.y));
    col += rdg * (1. - 0.8 * thick) * vec3(1., 0.93, 0.76) * (s64 * 0.1 + s256 * s256 * 1.4 + road * (0.14 + 0.8 * rows + 1.6 * gl));
    alpha = mix(0.88, mix(0.8, 0.93, win) * (1. - 0.3 * clamp(vRidge, 0., 1.)), rdg);
  }
  float sb = sin(0.045 * vW.x + 0.07 * vW.z + uTime * 0.9) * sin(0.02 * vW.z - 0.03 * vW.x + uTime * 0.6);
  col *= 1. + (0.11 + 0.07 * clamp(uRidge, 0., 1.) * above) * sb;
  col = c3aFog(col, vW);
  // seen from underneath, broad wind-rows stay readable through the haze, so the skin is a streaked ceiling and never a flat slab
  float under = 1. - above;
  vec2 rq = uGhost > 0.5 ? vec2(vW.z, -vW.x) : vW.xz;
  float wr = vn(vec2(rq.x * 0.0035 + 3. + uTime * 0.012, rq.y * 0.022)), wr2 = vn(vec2(rq.x * 0.011 + uTime * 0.03, rq.y * 0.06) + 9.);
  float hz = smoothstep(mix(600., 500., clamp(uRidge, 0., 1.)), mix(1500., 1300., clamp(uRidge, 0., 1.)), dist);   // toward the horizon the rows sink into the haze: no ruled line where a skin ends
  col *= 1. + under * (1. - 0.6 * uLid) * (1. - hz) * (0.6 * (wr - 0.5) + 0.35 * (wr2 - 0.5) + 0.25 * smoothstep(0.6, 0.85, wr));
  // cut to meet the hero's aprons
  float inset = 30. * above, jit = (vn(vW.xz * 0.021 + 3.) - 0.5) * 34.;   // from above the skin laps a little way over the apron's fading edge: no gap between them
  float cutT = max(c3aCut(uHoles[1], vW, inset * 0.7, jit), c3aCut(uHoles[2], vW, inset * 0.6, jit));
  float cut = max(c3aCut(uHoles[0], vW, inset, jit), cutT) * uUp;      // uUp 0 once the camera is inside the amber: no opening anywhere, the ceiling is one sheet
  alpha *= 1. - cut * clamp(uRidge, 0., 1.);
  gl_FragColor = vec4(col, alpha);
}`,t0=`
uniform vec3 uSun, uFogCol, uZen, uHor; uniform float uClear, uTime;
varying vec3 vD;
void main(){
  vec3 d = normalize(vD); float h = max(d.y, 0.);
  float hh = 1. - h; vec3 sky = mix(uHor, uZen, 1. - hh * hh * hh * hh);
  // combed cirrus
  float ci = 0.5 + 0.5 * sin(d.x * 9. / (0.15 + h) + uTime * 0.07 + 3. * sin(d.z * 5. / (0.2 + h) + uTime * 0.04));
  sky += vec3(0.13) * ci * ci * smoothstep(0.05, 0.3, h) * (1. - h);
  float sd = max(dot(d, uSun), 0.); float s2 = sd * sd; s2 *= s2; s2 *= s2; s2 *= s2;
  sky += vec3(1., 0.93, 0.8) * (s2 * s2 * s2 * 0.5 + smoothstep(0.9993, 0.9997, sd) * 5.);
  vec3 inside = uFogCol;                                    // exactly the fog colour, so rock lost in the haze has no outline against it
  gl_FragColor = vec4(mix(inside, sky, uClear), 1.);
}`;var u0={id:"canyon-of-three-airs",name:"Canyon of Three Airs",category:"alien",weirdness:.55,media:["air","open"],async build(N){const q=N.rng,Q=N.noise,qt=N.quality?.detail??1,Ie=N.vary||{},K=new t.Scene,re=$o[q.int(0,2)],je=Ie.hour!=null?Ie.hour<.34?1:Ie.hour>.67?2:0:q.int(0,2),Ct=[52,20,78][je]*Math.PI/180,_t=q.range(.3,.9),Zt=q.pick([7,7,3,1]),o0=q.int(2,4),At=!!Ie.rare,be=new t.Color(re.c[0]),ne=new t.Color(re.c[1]),Ce=new t.Color(re.c[2]),kt=new t.Color(re.deep),a0=new t.Color("#F7F1E6"),Bt=new t.Vector3(Math.cos(Ct)*Math.sin(_t+1.2),Math.sin(Ct),Math.cos(Ct)*Math.cos(_t+1.2)).normalize(),qe=new t.Color(je===1?"#FFD9B0":"#FFF4E2"),_={uTime:{value:0},uC0:{value:be},uC1:{value:ne},uC2:{value:Ce},uLv:{value:new t.Vector3(ce,0,H)},uFogCol:{value:new t.Color("#F2E6D2")},uFogDen:{value:3e-4},uSun:{value:Bt},uKey:{value:qe.clone()},uFill:{value:new t.Color("#9db8d8")}};K.fog=new t.FogExp2(15918802,3e-4),K.background=new t.Color(15918802);const Vo=[re.c[0],re.c[1],re.c[2],"#F7F1E6","#5A3F52",re.rust,re.deep],ee=await Yo(N,{palette:Vo,sun:{direction:Bt,color:qe.clone().multiplyScalar(.9)}});K.add(ee.object);const Je=be.clone().lerp(ne,.24);{const e={};Je.getHSL(e,t.SRGBColorSpace),Je.setHSL(e.h,Math.max(e.s,.6),Math.min(e.l,.72),t.SRGBColorSpace)}ee.setCeil(Je);const We=ee.anchors.extent;await N.yield();const Ot=new t.ShaderMaterial({uniforms:{uSun:_.uSun,uFogCol:_.uFogCol,uTime:_.uTime,uZen:{value:new t.Color(je===2?"#5C98DC":"#3F7FCB")},uHor:{value:new t.Color(je===1?"#F3CFAE":"#E9D3C4")},uClear:{value:1}},vertexShader:"varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:t0,side:t.BackSide,depthWrite:!1,depthTest:!1,fog:!1}),et=new t.Mesh(new t.SphereGeometry(4200,32,16),Ot);et.renderOrder=-10,et.frustumCulled=!1,K.add(et);const Xt=[new t.Vector4(0,0,1,0),new t.Vector4(0,0,1,0),new t.Vector4(0,0,1,0)],tt=(e,o=0)=>({..._,uStrata:{value:e},uLift:{value:o},uPools:{value:Xt},uFlora0:{value:be.clone().lerp(new t.Color("#E8788C"),.55)},uFlora1:{value:new t.Color(re.rust)},uFlora2:{value:Ce.clone().lerp(kt,.3).lerp(new t.Color("#BFE8DC"),.46)}}),_e=new t.ShaderMaterial({uniforms:tt(1),vertexShader:St,fragmentShader:Ft,side:t.DoubleSide}),pe=(e,o,u)=>{const r=(u-J)/52,h=Math.floor(r),p=r-h,x=(h+P(.92,1,p))*15,z=Q.fbm2(o*.006+e*9,u*.012,3)*16+Q.n2(o*.03,u*.05+e*5)*4,v=1-Math.abs(Q.n2(o*.011+h*3.7,e*7.3+h*1.9)),f=v*v*v*13;return e>0?440+x+z-f:-470-x-z*1.4+f},ue=ce+42,ot=380,Nt=984,Yt=J+104,Qt=J+520,$t=async(e,o,u,r,h,p)=>{const x=new Float32Array((r+1)*(p+1)*3),z=new Float32Array(x.length),v=[];for(let b=0;b<=p;b++){for(let d=0;d<=r;d++){const g=o+(u-o)*d/r,w=h+(ce+60-h)*b/p,i=(b*(r+1)+d)*3,c=w>ce+45,n=e>0?16*P(ot,ot+30,g)*(1-P(Nt-30,Nt,g))*P(Yt,Yt+26,w)*(1-P(Qt-26,Qt,w)):0,s=pe(e,g,Math.min(w,ce+40))+(c?e*1100:0)+n;x[i]=Z*g+X*s,x[i+1]=c?ue+14:Math.min(w,ue),x[i+2]=O*g+Y*s;const a=.74+.1*Q.n2(g*.01,w*.03);if(z[i]=.72*a/.78,z[i+1]=.66*a/.78,z[i+2]=.58*a/.78,d<r&&b<p){const l=b*(r+1)+d;e>0?v.push(l,l+1,l+r+1,l+1,l+r+2,l+r+1):v.push(l,l+r+1,l+1,l+1,l+r+1,l+r+2)}}b%6===5&&await N.yield()}const f=new t.BufferGeometry;f.setAttribute("position",new t.BufferAttribute(x,3)),f.setAttribute("aCol",new t.BufferAttribute(z,3)),f.setIndex(v),await N.yield(),f.computeVertexNormals();const y=new t.Mesh(f,_e);y.frustumCulled=!1,K.add(y),await N.yield()};for(const e of[1,-1])await $t(e,-1500,2400,177,J-10,60),await $t(e,2400,4300,32,ce-80,8);{const e=[.001,.12,.25,.4,.55,.7,.82,.9,.925,.96,.999],o=151,u=[];for(let f=2;f<10;f++)for(const y of e)u.push(J+52*(f+y));const r=u.length,h=new Float32Array(o*r*3),p=new Float32Array(o*r*3),x=[];for(let f=0;f<r;f++){for(let y=0;y<o;y++){const b=ot+(Nt-ot)*y/(o-1),d=u[f],g=(f*o+y)*3,w=pe(1,b,d)-.8+1.4*Q.n2(b*.11,d*.23);h[g]=Z*b+X*w,h[g+1]=d,h[g+2]=O*b+Y*w;const i=.74+.1*Q.n2(b*.01,d*.03);if(p[g]=.72*i/.78,p[g+1]=.66*i/.78,p[g+2]=.58*i/.78,y<o-1&&f<r-1){const c=f*o+y;x.push(c,c+1,c+o,c+1,c+o+1,c+o)}}f%10===9&&await N.yield()}const z=new t.BufferGeometry;z.setAttribute("position",new t.BufferAttribute(h,3)),z.setAttribute("aCol",new t.BufferAttribute(p,3)),z.setIndex(x),await N.yield(),z.computeVertexNormals();const v=new t.Mesh(z,_e);v.frustumCulled=!1,K.add(v),await N.yield()}{const e=[],o=[],u=[],h=(v,f,y,b,d,g)=>{const w=e.length/3,i=.9+.12*Q.n2(v*.02+g,f*.02);for(let n=0;n<2;n++)for(let s=0;s<=16;s++){const a=s%16/16*Math.PI*2,l=d*(.78+.34*Q.n2(Math.cos(a)*1.2+v*.011+g,Math.sin(a)*1.2+f*.011))*(n?.9:1.08),m=Math.cos(a)*l*1.7,M=Math.sin(a)*l;e.push(Z*(v+m)+X*(f+M),n?b:y,O*(v+m)+Y*(f+M)),o.push(.82*i,.67*i,.54*i)}for(let n=0;n<16;n++){const s=w+n,a=s+16+1;u.push(s,a,s+1,s+1,a,a+1)}const c=e.length/3;for(let n=0;n<=16;n++){const s=(w+16+1+n)*3;e.push(e[s],b,e[s+2]),o.push(.86*i,.76*i,.64*i)}e.push(Z*v+X*f,b+2,O*v+Y*f),o.push(.86*i,.76*i,.64*i);for(let n=0;n<16;n++)u.push(c+n,c+16+1,c+n+1)},p=q.fork("mesas");for(let v=-1250;v<4200;v+=p.range(150,260))for(const f of[1,-1]){const y=p.range(70,150),b=p.range(80,230),d=p.range(60,420),g=p.int(2,4);if(f<0&&v<-640)continue;const w=f*(705+y+d);let i=y,c=ue+2;for(let n=0;n<g;n++){const s=b/g*p.range(.8,1.25);h(v,w,c-6,c+s,i,n*7.3+f),c+=s,i*=p.range(.6,.78)}}{let v=46,f=ue+2;for(const y of[54,43,32])h(-556,-759,f-6,f+y,v,91.7+y),f+=y,v*=.72}const x=new t.BufferGeometry;x.setAttribute("position",new t.Float32BufferAttribute(e,3)),x.setAttribute("aCol",new t.Float32BufferAttribute(o,3)),x.setIndex(u),x.computeVertexNormals();const z=new t.Mesh(x,_e);z.frustumCulled=!1,K.add(z),await N.yield()}const Po=ee.anchors,me=Po.flyThrough,de=me[10],Lo=(e,o)=>{let u=0,r=1e9;const h={};for(let p=0;p<=36;p++){ee.facePoint(e,p/36*.6,h);const x=Math.abs(h.z-o);x<r&&(r=x,u=h.y)}return u},Wt=de.x+170,Tt=de.z+16,Jt=Lo(Wt,Tt),eo=Z*Wt+O*Tt,to=X*Wt+Y*Tt,Vt=e=>[de.x+e,de.z+5+11*Ke((e-60)/110,0,1.3)],Ze=e=>{const o=Vt(e),u=ee.faceHeight(o[0],o[1],0,0);return u===u?u:0},at=Math.max(de.y-6,Ze(60)+6.5);let Me=190,Pt=-1e9;for(let e=80;e<=190;e+=4){const o=Ze(e-18)+6.5,u=e-78;if(o>at+3||at-o>.32*u+.1)continue;let r=1e9;for(let h=1;h<=6;h++){const p=60+(e-78)*h/6;r=Math.min(r,$(at,o,h/6)-Ze(p))}if(r>=4.5){Me=e,Pt=9;break}r>Pt&&(Pt=r,Me=e)}const oo=Vt(Me-18),ao=Vt(Me+18),no=Ze(Me-18)+6.5,so=Math.min(Ze(Me+18)-6.5,no-9),ro=Math.min(Jt-24,so-8),lo=[new t.Vector3(oo[0],no,oo[1]),new t.Vector3(ao[0],so,ao[1])],nt=W(eo+196,to+62,Math.min(Jt-40,-50,ro-8)),io=W(712,378,-263),co=W(815,374,-318);Me-78>=22&&lo.unshift(new t.Vector3(de.x+60,at,de.z+5));const Lt=[W(-1100,-692,332),W(-1042,-670,328),W(-960,-636,316),W(-890,-598,297),W(-835,-540,252),W(-792,-452,178),new t.Vector3(-640,70,330),new t.Vector3(-525,35,300),new t.Vector3(-390,42,262),new t.Vector3(-250,50,230),new t.Vector3(me[4].x-102,me[4].y+12,me[4].z+77),me[4].clone(),me[6].clone(),me[8].clone(),de.clone(),...lo,W(eo+88,to+44,ro),nt,W(500,356,-106),W(600,330,-182),io,co,W(930,320,-372),W(1070,300,-410),W(1230,300,-437),W(1390,300,-449),W(1450,300,-452)],U=Zo(Lt),ge=Lt[Lt.length-1];let we=.55;{const e=new t.Vector3;for(let o=0;o<=1200;o++){const u=.4+.3*o/1200;if(U.pointAt(u,e),e.x<de.x+20)continue;const r=ee.faceHeight(e.x,e.z,0,0);if(e.y<(r===r?r:0)+.9){we=u;break}}}const he=705,xe=e=>440+15*(e-J)/52,st=e=>U.nearestXZ(e.x,e.z).u,Oe=st(me[4]),te=st(io),Te=st(co),n0=st(nt);await N.yield();const Ro=2;{const o=Math.ceil(U.length/.25),u=new Float64Array((o+1)*3),r=new t.Vector3,h=new t.Vector3;let p=0;for(let x=0;x<=o;x++)U.posAtDist(U.length*x/o,r).toArray(u,x*3),x&&(p=Math.max(p,r.distanceTo(h))),h.copy(r),x%1024===1023&&await N.yield();await N.yield(),await ee.keepBellsOff(u,p,Ro),await N.yield()}const ve=(e,o,u,r)=>{const h=e.attributes.position.count,p=new Float32Array(h*3);for(let x=0;x<h;x++)p[x*3]=o,p[x*3+1]=u,p[x*3+2]=r;return e.setAttribute("aCol",new t.BufferAttribute(p,3)),e},Ve=740,Xe=1680,Pe=40,Uo=500;{const u=new Float32Array(8928),r=[];for(let x=0;x<=30;x++)for(let z=0;z<=95;z++){const v=-1500+3900*z/95,f=-680+1260*x/30,y=(x*96+z)*3,b=U.nearestXZ(Z*v+X*f,O*v+Y*f),d=J+Q.fbm2(v*.01,f*.01,3)*9+Math.abs(Q.n2(v*.04,f*.04))*3,g=16*P(Ve,Ve+60,v)*(1-P(Xe-60,Xe,v))*P(Pe,Pe+60,f);if(u[y]=Z*v+X*f,u[y+1]=Math.min(d-g,b.dist<30?b.y-9:1e9),u[y+2]=O*v+Y*f,z<95&&x<30){const w=x*96+z;r.push(w,w+95+1,w+1,w+1,w+95+1,w+95+2)}}const h=new t.BufferGeometry;h.setAttribute("position",new t.BufferAttribute(u,3)),h.setIndex(r),h.computeVertexNormals();const p=new t.Mesh(ve(h,.7,.66,.58),_e);p.frustumCulled=!1,K.add(p)}await N.yield();{const r=new Float32Array(123114),h=new Float32Array(289*142),p=[],x=70,z=new Float32Array(x),v=new Float32Array(x),f=new Float32Array(x),y=new t.Vector3;for(let w=0;w<x;w++)U.pointAt(Te-.02+(1.02-Te)*w/(x-1),y),z[w]=y.x,v[w]=y.z,f[w]=y.y;for(let w=0;w<=141;w++){for(let i=0;i<=288;i++){const c=Ve+(Xe-Ve)*i/288,n=Pe+(Uo-Pe)*w/141,s=w*289+i,a=Z*c+X*n,l=O*c+Y*n;let M=8+13*Math.exp(-((c-1452)*(c-1452)+(n-300)*(n-300)*1.5)/28900)+6.5*Q.fbm2(c*.0055,n*.0055,3)+2.2*Q.n2(c*.021,n*.021)+13*P(350,470,n);if(Math.abs(n-325)<120){let L=1e9,k=0;for(let F=0;F<x;F++){const j=(z[F]-a)*(z[F]-a)+(v[F]-l)*(v[F]-l);j<L&&(L=j,k=f[F])}M=Math.min(M,$(k-13-J,60,P(24,80,Math.sqrt(L))))}M=Math.max(M,1);const S=P(Ve,Ve+40,c)*(1-P(Xe-40,Xe,c))*P(Pe,Pe+40,n),T=Math.floor(M/2),A=M/2-T;r[s*3]=a,r[s*3+1]=J+2*(T+P(.76,.98,A))-18*(1-S),r[s*3+2]=l,h[s]=M/2,i<288&&w<141&&p.push(s,s+288+1,s+1,s+1,s+288+1,s+288+2)}w%3===2&&await N.yield()}const b=new t.BufferGeometry;b.setAttribute("position",new t.BufferAttribute(r,3)),b.setAttribute("aF",new t.BufferAttribute(h,1)),b.setIndex(p),await N.yield(),b.computeVertexNormals(),await N.yield();const d=new t.ShaderMaterial({uniforms:tt(1),vertexShader:St,fragmentShader:Ft,defines:{TERR:1},side:t.DoubleSide}),g=new t.Mesh(ve(b,.8,.78,.7),d);g.frustumCulled=!1,K.add(g)}await N.yield();const Rt=[];{const e=(i,c)=>{const n=ve(new t.CylinderGeometry(.22,1,1,i,c,!1),.72,.67,.6);n.translate(0,.5,0);const s=n.attributes.position,a=n.attributes.aCol;for(let l=0;l<s.count;l++){const m=s.getY(l),M=Math.floor(m*9+.6*Math.sin(m*23))%3,S=M===0?[.84,.78,.66]:M===1?[.7,.73,.67]:[.85,.68,.52];a.setXYZ(l,S[0],S[1],S[2])}for(let l=0;l<s.count;l++){const m=s.getY(l),M=Math.atan2(s.getZ(l),s.getX(l)),S=i>16?Math.cos(6*M+m*2.6):0,T=(1+.065*Math.sin(m*44)+.1*Math.sin(m*13+2)+.15*S*Math.abs(S))*(m>.95?.3:1);s.setX(l,s.getX(l)*T),s.setZ(l,s.getZ(l)*T)}return n.computeVertexNormals(),n},o=new t.ShaderMaterial({uniforms:tt(.8,1.1),vertexShader:St,fragmentShader:Ft,side:t.DoubleSide}),u=new t.InstancedMesh(e(24,24),o,57),r=new t.InstancedMesh(e(10,18),o,57);u.frustumCulled=!1,r.frustumCulled=!1;const h=[];for(let i=.72;i<=1.001;i+=.02)h.push(U.pointAt(Math.min(i,1),new t.Vector3));let p=0,x=0;const z={setMatrixAt(i,c){const n=c.elements[12],s=c.elements[14];h.some(a=>Math.hypot(a.x-n,a.z-s)<105)?u.setMatrixAt(p++,c):r.setMatrixAt(x++,c)}},v=new t.Matrix4,f=new t.Quaternion,y=new t.Vector3,b=new t.Vector3;let d=0;const g=[.77,.8,.83,.86,.9].map(i=>U.pointAt(i,new t.Vector3)),w=(i,c)=>{for(const n of g){const s=ge.x-n.x,a=ge.z-n.z,l=Ke(((i.x-n.x)*s+(i.z-n.z)*a)/Math.max(s*s+a*a,1),0,1);if(Math.hypot(i.x-n.x-s*l,i.z-n.z-a*l)<c+9)return!0}return!1};for(let i=0;i<400&&d<40;i++){const c=q.range(700,1800),n=q.range(30,440),s=q.range(9,20),a=q.range(60,180),l=W(c,n,J-6);U.nearestXZ(l.x,l.z).dist<s+19||w(l,s)||c>1250&&Math.abs(n-300)<78&&c<1560||(f.setFromAxisAngle(new t.Vector3(0,1,0),q.range(0,6.28)),y.set(s,a,s),b.copy(l),v.compose(b,f,y),z.setMatrixAt(d++,v),Rt.push({p:l.clone(),r:s,hgt:a}))}for(const[i,c,n,s]of[[1338,256,11,172],[1398,232,15,132],[1436,356,9,96],[1528,246,17,160],[1575,322,13,176],[1548,398,11,124],[1612,268,12,140]])f.setFromAxisAngle(new t.Vector3(0,1,0),i),y.set(n,s,n),b.copy(W(i,c,J-4)),v.compose(b,f,y),z.setMatrixAt(d++,v),Rt.push({p:b.clone(),r:n,hgt:s});for(const[i,c,n,s]of[[905,412,15,262],[1040,414,13,288],[1135,404,16,250],[1010,150,17,336],[1165,165,15,300],[1290,150,16,272],[860,40,17,352],[1310,420,14,240],[930,250,15,318]]){const a=W(i,c,J-4);U.nearestXZ(a.x,a.z).dist<n+22||w(a,n)||(f.setFromAxisAngle(new t.Vector3(0,1,0),i*.7),y.set(n,s,n),v.compose(a,f,y),z.setMatrixAt(d++,v))}u.count=p,r.count=x,K.add(u,r),await N.yield();{const n=[],s=[],l=(A,L)=>(L+24)/3.6+.35*Math.sin(A*.21),m=A=>{const L=Math.sin(A*12.9898)*43758.5453;return L-Math.floor(L)},M=A=>{const L=6.2+3.8*Math.pow(Math.abs(2*A-1),2.2)+1.5*Q.n2(A*5,3.3),k=19.5+L,F=.2,j=A<F?0:A>1-F?1:(A-F)/(1-2*F),le=Math.PI*j,B=A<F?(F-A)/F:A>1-F?(A-1+F)/F:0;return[Math.cos(le)*k+(A<.5?1:-1)*B*3,Math.sin(le)*k*1.06-B*20,L]};for(let A=0;A<=84;A++){const L=A/84,k=M(L),F=M(Math.min(1,L+.01)),j=M(Math.max(0,L-.01));let le=F[0]-j[0],B=F[1]-j[1];const G=Math.hypot(le,B)||1;le/=G,B/=G;const R=1+.42*Math.max(0,Q.n2(L*11,2.2))+.25*Math.max(0,Q.n2(L*27,8.1));for(let E=0;E<=16;E++){const C=E%16/16*Math.PI*2,D=ye=>Math.sign(ye)*Math.pow(Math.abs(ye),.6),V=D(Math.cos(C)),ae=D(Math.sin(C));let I=k[2]*(1+.16*Q.n3(k[0]*.09,k[1]*.09,C*1.3+7));const oe=l(k[0]+-B*V*I,k[1]+le*V*I),yt=oe-Math.floor(oe);I*=(.8+.42*m(Math.floor(oe)))*(yt<.12?.9:1),V<0?I*=1+(R-1)*-V:I=Math.min(I,k[2]+1.3-.4*V);const ie=k[0]+-B*V*I,Fe=k[1]+le*V*I,Ne=ae*I*1.25;n.push(ge.x+X*ie+Z*Ne,ge.y+Fe,ge.z+Y*ie+O*Ne)}}for(let A=0;A<84;A++)for(let L=0;L<16;L++){const k=A*17+L,F=k+16+1;s.push(k,k+1,F,k+1,F+1,F)}const S=new t.BufferGeometry;S.setAttribute("position",new t.Float32BufferAttribute(n,3)),S.setIndex(s),S.computeVertexNormals();const T=new t.Mesh(ve(S,.7,.66,.6),o);T.frustumCulled=!1,K.add(T);{const A=S.attributes.position,L=S.attributes.aCol;for(let k=0;k<A.count;k++){const F=A.getX(k)-ge.x,j=A.getZ(k)-ge.z,le=F*X+j*Y,B=A.getY(k)-ge.y,G=Math.floor(m(Math.floor(l(le,B))+.5)*3)%3,R=G===0?[.95,.86,.68]:G===1?[.6,.66,.62]:[.93,.62,.42],E=Math.cos(k%17%16/16*Math.PI*2),C=(.66+.8*P(-6,22,le))*(1-.6*Math.max(0,E));L.setXYZ(k,R[0]*C,R[1]*C,R[2]*C)}}}}await N.yield();const uo=[],Go=ee.anchors.trainInfo||[],ho=[new t.Vector4(20,0,1,590)],vo=[new t.Vector4(0,We.halfLength,We.back,We.front)];for(let e=0;e<2;e++){const o=Go[e];ho.push(o?new t.Vector4(o.z+20*o.scale,o.x,o.scale,o.length*.49):new t.Vector4(-9e3,0,.01,1)),vo.push(o?new t.Vector4(o.x,o.length*.5,o.z-200*o.scale,o.z+330*o.scale):new t.Vector4(0,-1e3,-9e3,-8e3))}const rt=new t.Color(ne.r*.84,ne.g*.74,ne.b*.5),fo=new t.Color(rt.r*.62,rt.g*.42,rt.b*.34).lerp(new t.Color("#5A3F52"),.22).lerp(rt,.5),po={value:1},Ut=be.clone();{const e={};Ut.getHSL(e,t.SRGBColorSpace),Ut.setHSL(e.h,Math.min(1,e.s*1.2+.08),Math.min(e.l,.73),t.SRGBColorSpace)}const Do=[new t.Vector4(415,-213,165,78),new t.Vector4(583,-411,190,84)],mo={value:new t.Vector3(1,.3,0)};{const e=W(he,xe(-215)-38,0),o=new t.Vector3(e.x-nt.x,0,e.z-nt.z).normalize();mo.value.set(o.x*.95,.31,o.z*.95).normalize()}const Gt=async(e,o,u,r,h,p,x,z,v,f,y,b)=>{const d=new Float32Array((o+1)*(u+1)*3),g=[];for(let n=0;n<=u;n++)for(let s=0;s<=o;s++){const a=v+(f-v)*s/o,l=y+(b-y)*n/u,m=(n*(o+1)+s)*3;if(d[m]=Z*a+X*l,d[m+1]=0,d[m+2]=O*a+Y*l,s<o&&n<u){const M=n*(o+1)+s;g.push(M,M+o+1,M+1,M+1,M+o+1,M+o+2)}}const w=new t.BufferGeometry;w.setAttribute("position",new t.BufferAttribute(d,3)),w.setIndex(g);const i=new t.ShaderMaterial({uniforms:{..._,uUp:po,uSunC:mo,uSag:{value:Do},uLevel:{value:e},uAmp:{value:p},uRidge:{value:x},uGlit:{value:z},uAlpha:{value:x>0?.66:e>0?.6:.88},uGhost:{value:e>0?1:0},uLid:{value:e<-1?1:0},uGold:{value:ne.clone().multiplyScalar(.95)},uBars:{value:ho},uHoles:{value:vo},uBody:{value:fo},uHole:{value:new t.Vector4(We.halfLength,0,We.back,We.front)},uBelow:{value:r},uAbove:{value:h}},vertexShader:Jo,fragmentShader:e0,side:t.DoubleSide,transparent:!0,depthWrite:!1}),c=new t.Mesh(w,i);c.frustumCulled=!1,c.userData.level=e,K.add(c),uo.push(c),await N.yield()};await Gt(ce,116,30,Ut.clone(),be.clone().lerp(new t.Color("#ffffff"),.55),1,0,1,-1500,4300,-790,770),await Gt(0,208,64,ne.clone(),Je.clone(),1,1,1.2,-1500,2400,-720,670),await Gt(H,96,30,Ce.clone(),ne.clone().multiplyScalar(1.05),.4,0,.8,-1500,2400,-700,620);const go=new t.ShaderMaterial({uniforms:tt(0),vertexShader:St,fragmentShader:Ft,side:t.DoubleSide}),fe=[];{const e=new t.BoxGeometry(30,4.6,7.4,8,1,2),o=e.attributes.position,u=e.attributes.normal,r=[],h=[],p=[];for(let v=0;v<o.count;v++)r.push(u.getY(v)<-.5),h.push(o.getY(v)<0&&Math.abs(o.getZ(v))<.001),p.push(o.getZ(v)>0);for(let v=0;v<o.count;v++){const f=o.getX(v)/15;o.setZ(v,o.getZ(v)*(1-.72*f*f)*(o.getY(v)<0?.6:1)),o.setY(v,o.getY(v)+1.3+2*f*f-(h[v]?1.9*(1-.7*f*f):0))}ve(e,.46,.29,.17);{const v=e.attributes.aCol;for(let f=0;f<o.count;f++)if(r[f]){const y=h[f]?[1.5,.92,.46]:p[f]?[1.05,.66,.3]:[.56,.34,.19];v.setXYZ(f,y[0],y[1],y[2])}}fe.push(e);const x=(v,f)=>{const y=v.attributes.position;let b=0,d=-1e9;for(let g=0;g<y.count;g++)b=Math.min(b,y.getY(g)),d=Math.max(d,y.getY(g));for(let g=0;g<y.count;g++){const w=(d-y.getY(g))/Math.max(d-b,.001),i=w*w;y.setX(g,y.getX(g)*(1-.62*i)-f*w),y.setZ(g,y.getZ(g)*(1-.5*w))}return v},z=(v,f,y,b,d)=>{const g=v.attributes.position;v.computeBoundingBox();const w=v.boundingBox,i=(w.min.x+w.max.x)/2,c=[],n=[];for(let a=0;a<g.count;a++)c.push(g.getX(a)>i),n.push((w.max.y-g.getY(a))/Math.max(w.max.y-w.min.y,.001));ve(x(v,f),y,b,d);const s=v.attributes.aCol;for(let a=0;a<g.count;a++){const l=c[a]?$(2.4,5.6,n[a]):$(1,1.9,n[a]);s.setXYZ(a,y*l,b*l*(c[a]?$(1.3,1.75,n[a]):1.1),d*l*(c[a]?$(1,1.9,n[a]):1))}return v};fe.push(z(new t.BoxGeometry(13,14,.9,1,6,1).translate(0,-7.6,0),6.5,.34,.22,.15));for(const v of[-1,1])fe.push(z(new t.BoxGeometry(4,9,.4,1,4,1).translate(3,-4,v*3.9),1.6,.36,.24,.16));fe.push(ve(new t.BoxGeometry(7,.35,6.4).translate(-10,6.4,0),.77,.28,.18)),fe.push(ve(new t.BoxGeometry(.5,3,.5).translate(-10,5,0),.3,.2,.14)),[-9,.5,9.5].forEach((v,f)=>{const y=[22,28,20][f];fe.push(ve(new t.CylinderGeometry(.22,.34,y,6).translate(v,3+y/2,0),.3,.2,.14));const b=new t.CircleGeometry(y-2,9,Math.PI/2-.42,1.25),d=b.attributes.position;for(let g=0;g<d.count;g++){const w=Math.hypot(d.getX(g),d.getY(g))/y;d.setZ(g,Math.sin(w*3.1)*1.1+Math.sin(g*2.4)*.25)}b.translate(v+2.5,4,0),fe.push(ve(b,.93,.84,.7)),fe.push(ve(new t.PlaneGeometry(3.6,.7).translate(v-1.8,3.6+y,0),.8,.26,.16))})}const Eo=Oo(fe.map(e=>{const o=e.index?e.toNonIndexed():e;return o.deleteAttribute("uv"),o.attributes.normal||o.computeVertexNormals(),o}));fe.forEach(e=>e.dispose());const Ye=new t.InstancedMesh(Eo,go,Zt+4);Ye.frustumCulled=!1,K.add(Ye);const ze=852,Ae=pe(1,ze,H),lt=W(ze+6,Ae-21,0),Ko=new t.Vector3(.55,.55,.55),Le=[];for(let e=0;e<Zt;e++)Le.push({a:-498-e*120,b:-168+e%2*22+e*6-85*P(2.5,5,e),ph:q.range(0,6.28),yaw:.873+q.range(-.08,.08),sc:1+.95*P(2.5,5,e)});Le.push({a:520,b:335,ph:1.3,yaw:.873+1.3,sc:1.9,sink:2.6},{a:650,b:296,ph:4.1,yaw:.873-1.15,sc:1.6,sink:2.2}),Le.push({a:-542,b:-276,ph:2.6,yaw:.873+.35,sc:1.55});const it=new t.Matrix4,wo=new t.Quaternion,ct=new t.Euler,ut=new t.Vector3,Ho=new t.Vector3(1,1,1),xo=e=>{for(let o=0;o<Le.length;o++){const u=Le[o],r=Z*u.a+X*u.b,h=O*u.a+Y*u.b;ct.set(.07*Math.sin(e*.5+u.ph)+.05,u.yaw,.03*Math.sin(e*.37+u.ph*2),"YXZ"),ut.set(r,jt(r,h,e)+.4-(u.sink||0),h),it.compose(ut,wo.setFromEuler(ct),Ho.setScalar(u.sc)),Ye.setMatrixAt(o,it)}ct.set(.05*Math.sin(e*.6),.873+.06*Math.sin(e*.21),.04*Math.sin(e*.45),"YXZ"),ut.set(lt.x,H+jt(lt.x,lt.z,e)*.4+.3,lt.z),it.compose(ut,wo.setFromEuler(ct),Ko),Ye.setMatrixAt(Le.length,it),Ye.instanceMatrix.needsUpdate=!0};xo(0),await N.yield();{const e=q.fork("scatter"),o=Ke(Ie.density??1,.6,1.4)*qt,u=new t.BoxGeometry(1,1,1,2,2,2);u.deleteAttribute("uv"),u.deleteAttribute("normal");const r=Xo(u),h=r.attributes.position;u.dispose();for(let B=0;B<h.count;B++){const G=h.getX(B),R=h.getY(B),E=h.getZ(B),C=1-.3*(Math.abs(G)+Math.abs(R)+Math.abs(E)-.5)+.08*Math.sin(G*9+R*7+E*5);h.setXYZ(B,G*C,R*C,E*C)}r.computeVertexNormals();const p=Math.round(400*o)+8,x=new t.InstancedMesh(r,_e,p),z=new Float32Array(p*3),v=new t.Matrix4().makeBasis(new t.Vector3(Z,0,O),new t.Vector3(0,1,0),new t.Vector3(X,0,Y)),f=new t.Quaternion().setFromRotationMatrix(v),y=new t.Quaternion,b=new t.Quaternion,d=new t.Euler,g=new t.Matrix4,w=new t.Vector3,i=new t.Vector3;let c=0;const n=(B,G,R,E,C,D,V,ae)=>{if(c>=p)return;d.set(e.range(-V,V),e.range(-.25,.25)+(V>.3?e.range(0,6.28):0),e.range(-V,V)),b.copy(f).multiply(y.setFromEuler(d)),w.copy(W(B,G,R)),i.set(E,C,D),g.compose(w,b,i),x.setMatrixAt(c,g);const I=ae*e.range(.9,1.08);z[c*3]=.74*I,z[c*3+1]=.68*I,z[c*3+2]=.6*I,c++};n(ze,Ae-5,H+1.2,22,3.4,13,0,1.02);for(let B=0;B<3;B++)n(ze-7+B*.5,Ae-13.5-B*2.6,H+.6-B*1.1,8,1.4,3.2,0,1.08);n(ze+8.5,Ae-10.5,H+3.6,1.1,1.7,1.1,.05,.75),n(ze-2,Ae-1,H+7,30,9,9,.04,.95),n(ze+2,Ae+1,H+15,22,7,7,.04,.9),n(ze+16,Ae-4,H+4,6,5,6,.3,.9),n(he,xe(-124)+6,-127,66,8,34,.02,.86),n(he-44,xe(-110)+2,-112,26,30,30,.06,.92),n(he+46,xe(-110)+2,-114,30,26,30,.06,.9);const s=Math.round(78*o);for(let B=0;B<s;B++){const G=e.range(470,960),R=J+52*e.int(3,8)+45+e.range(-4,4),E=e.range(16,44),C=e.range(7,15),D=e.range(1.6,4.5);if(Math.abs(G-he)<60&&R<-70)continue;const V=pe(1,G,R)+C*.12;n(G,V,R,E,D,C,.035,.96);const ae=G<690&&R>-210?1:0;for(let I=e.int(0,2)+ae*2;I>0;I--){const oe=e.range(1.2,4.2)*(1+.3*ae);n(G+e.range(-.4,.4)*E,V-C*e.range(.05,.3),R+D*.5+oe*.3,oe*e.range(.8,1.6),oe,oe*e.range(.7,1.3),.5,.92)}}let a=0;for(;c<p&&a++<4e3;){const B=e.range(-1080,-800),G=Math.pow(e(),1.6)*150+4,R=e.range(.7,3.4)*(e.chance(.12)?2.2:1),E=pe(-1,B,ue-4)-G,C=W(B,E,ue-6);U.distanceTo(C.x,C.y,C.z)<15+R*2||n(B,E,ue-9+G*.021+R*.32,R*e.range(.8,1.9),R*e.range(.5,1),R*e.range(.8,1.4),.45,e.range(.86,1.06))}r.setAttribute("aCol",new t.InstancedBufferAttribute(z,3)),x.count=c,x.frustumCulled=!1,K.add(x),await N.yield();const l=new t.SphereGeometry(1,9,4,0,Math.PI*2,0,Math.PI*.5);l.deleteAttribute("uv");const m=Math.round(560*o),M=new t.InstancedMesh(l,go,m),S=new Float32Array(m*3),T=new t.Color(re.rust),A=T.clone().lerp(ne,.55),L=be.clone().lerp(new t.Color("#E8607C"),.6),k=new t.Color;let F=0;const j=(B,G,R,E,C,D)=>{F>=m||(d.set(e.range(-.12,.12),e.range(0,6.28),e.range(-.12,.12)),b.setFromEuler(d),w.copy(W(B,G,R)),i.set(E,E*C,E),g.compose(w,b,i),M.setMatrixAt(F,g),S[F*3]=D.r,S[F*3+1]=D.g,S[F*3+2]=D.b,F++)},le=Math.round(300*o);for(let B=0;B<le&&F<m;){const G=e.range(430,940),R=e.range(H+14,-30),E=e.int(3,7);for(let C=0;C<E;C++,B++){const D=G+C*e.range(3.5,6.5),V=R+C*e.range(-.4,1.3),ae=D<690&&V>-210,I=e.range(2.6,6.5)*(ae?1.45:1),oe=ae?e.range(.3,.46):e.range(.14,.3);Math.abs(D-he)<56||(k.copy(T).lerp(A,e()).multiplyScalar(e.range(.85,1.15)),j(D,pe(1,D,V)-.6,V,I,oe,k),ae&&(k.multiplyScalar(1.22),j(D+e.range(-.2,.2)*I,pe(1,D,V)-.6,V+I*oe*.66,I*.58,oe*1.1,k)))}}{const B=[.87,.89,.91,.93,.95,.97].map(C=>U.pointAt(C,new t.Vector3)),G=C=>B.reduce((D,V)=>Math.min(D,Math.hypot(V.x-C.p.x,V.z-C.p.z)),1e9),R=Ce.clone().lerp(kt,.45),E=new t.Color("#CFEFE2");for(const C of Rt.slice().sort((D,V)=>G(D)-G(V)).slice(0,3)){const D=B.reduce((ie,Fe)=>Math.hypot(Fe.x-C.p.x,Fe.z-C.p.z)<Math.hypot(ie.x-C.p.x,ie.z-C.p.z)?Fe:ie,B[0]),V=(D.x-C.p.x)*Z+(D.z-C.p.z)*O,ae=(D.x-C.p.x)*X+(D.z-C.p.z)*Y,I=Math.atan2(ae,V),oe=C.p.x*Z+C.p.z*O,yt=C.p.x*X+C.p.z*Y;for(let ie=0;ie<10;ie++){const Fe=9+ie*5.2+e.range(-1.2,1.2),Ne=I+(ie%2?1:-1)*(.25+.14*ie)+e.range(-.2,.2),ye=e.range(2.6,4.6),bt=C.r*(1-.78*Fe/C.hgt)*1.02-ye*.3,To=J-4+Fe;k.copy(R).multiplyScalar(e.range(.85,1.15)),j(oe+Math.cos(Ne)*bt,yt+Math.sin(Ne)*bt,To,ye,e.range(.2,.3),k),k.copy(E).multiplyScalar(e.range(.85,1)),j(oe+Math.cos(Ne)*(bt+ye*.42),yt+Math.sin(Ne)*(bt+ye*.42),To+ye*.13,ye*.5,.3,k)}}}for(a=0;F<m&&a++<4e3;){const B=e.chance(.45)?e.range(-975,-870):e.range(-1080,-800),G=Math.pow(e(),1.5)*120+3,R=e.int(2,6),E=W(B,pe(-1,B,ue-4)-G,ue-6);if(!(U.distanceTo(E.x,E.y,E.z)<13))for(let C=0;C<R;C++){const D=B+e.range(-6,6),V=G+e.range(-5,5),ae=e.range(.7,2.6);k.copy(L).multiplyScalar(e.range(.8,1.15)),j(D,pe(-1,D,ue-4)-Math.max(V,1),ue-9.2+Math.max(V,1)*.021,ae,e.range(.4,.62),k)}}l.setAttribute("aCol",new t.InstancedBufferAttribute(S,3)),M.count=F,M.frustumCulled=!1,K.add(M)}await N.yield();const Re=.08,yo=1570,Ue=2.8,Qe=[.927,-.375],Ge=U.pointAt(Re,new t.Vector3);Ge.x+=34*.961+6*.276,Ge.z+=34*-.276+6*.961,Ge.y=0;const bo=[{u:Re,lv:ce,amp:.5,sc:3.8,at:Ge,dir:Qe,ech:1,sp:yo,pitch:.45},{u:.07,lv:ce,amp:.5,sc:1.5},{u:.2,lv:0,amp:1,sc:1},{u:.265,lv:0,amp:1,sc:1},{u:Te-.022,lv:H,amp:.4,sc:1.7}],Dt=q.pick([9,9,5]),Mo={..._,uU:{value:0}};{const e=[],o=[],u=[],r=(i,c,n,s,a=4,l=[0,0],m=[0,0],M=[0,0])=>{e.push(...i,...c,...n),o.push(s[0],s[1],s[2]),u.push(a,l[0],l[1],a,m[0],m[1],a,M[0],M[1])},h=[0,0,0];for(const i of[-1,1]){const s=(a,l)=>{const m=l/7,M=a/3,S=1.25-.55*m-2.1*m*m,T=(2.5*(1-m)+.3)*(1+(a===3?.11*Math.cos(m*6.5*6.2832):0));return[S-T*M,.38*Math.pow(m,1.2)+.12*Math.sin(Math.PI*M)*(1-m),i*(.16+2.44*m)]};for(let a=0;a<7;a++)for(let l=0;l<3;l++){const m=[l/3,a/7],M=[(l+1)/3,a/7],S=[l/3,(a+1)/7],T=[(l+1)/3,(a+1)/7];r(s(l,a),s(l+1,a),s(l+1,a+1),h,0,m,M,T),r(s(l,a),s(l+1,a+1),s(l,a+1),h,0,m,T,S)}}{const i=[1.9,1.3,.35,-.8,-1.7],c=[.02,.3,.46,.3,.04],n=6,s=(a,l)=>{const m=l/n*6.2832;return[i[a],-.04+Math.sin(m)*c[a]*.85,Math.cos(m)*c[a]]};for(let a=0;a<4;a++)for(let l=0;l<n;l++)r(s(a,l),s(a+1,l),s(a+1,l+1),h,1),r(s(a,l),s(a+1,l+1),s(a,l+1),h,1)}{const c=(n,s)=>{const a=n/5;return[s?-.42-.25*a-.2*a*a:.02-.5*a-.4*a*a,-.15-(Ue+.6)*a,0]};for(let n=0;n<5;n++){const s=[n/5,0],a=[(n+1)/5,0];r(c(n,0),c(n,1),c(n+1,1),h,2,s,s,a),r(c(n,0),c(n+1,1),c(n+1,0),h,2,s,a,a)}}{const c=-Ue+.03,n=-.7;r([n-1.7,c,-1.7],[n+1.7,c,-1.7],[n+1.7,c,1.7],h,3,[-1,-1],[1,-1],[1,1]),r([n-1.7,c,-1.7],[n+1.7,c,1.7],[n-1.7,c,1.7],h,3,[-1,-1],[1,1],[-1,1])}for(const i of[-1,1]){const n=s=>{const a=s/5,l=i*(.25+3.6*a),m=.22+2.7*a,M=-.6-44*a;return{i:[M,-Ue+.3,l-i*m],c:[M,-Ue+.3,l],o:[M,-Ue+.3,l+i*m*1.5],a:.02+.95*Math.pow(1-a,1.6)}};for(let s=0;s<5;s++){const a=n(s),l=n(s+1);r(a.i,l.i,l.c,[.02,.02,l.a]),r(a.i,l.c,a.c,[.02,l.a,a.a]),r(a.c,l.c,l.o,[a.a,l.a,.02]),r(a.c,l.o,a.o,[a.a,.02,.02])}}const p=new t.BufferGeometry;p.setAttribute("position",new t.Float32BufferAttribute(e,3)),p.setAttribute("aK",new t.Float32BufferAttribute(o,1)),p.setAttribute("aQ",new t.Float32BufferAttribute(u,3));const x=new t.InstancedBufferGeometry;x.setAttribute("position",p.attributes.position),x.setAttribute("aK",p.attributes.aK),x.setAttribute("aQ",p.attributes.aQ);const z=bo.length*Dt,v=new Float32Array(z*4),f=new Float32Array(z*4),y=new Float32Array(z*3),b=new t.Vector3,d=new t.Vector3;bo.forEach((i,c)=>{U.pointAt(Math.min(i.u+.013,.99),d),U.tangentAt(i.u,b),i.at&&d.copy(i.at);const n=i.dir?Math.atan2(i.dir[1],i.dir[0]):Math.atan2(b.z,b.x)+(c%2?-1.15:1.15);for(let s=0;s<Dt;s++){const a=(c*Dt+s)*4,l=Math.ceil(s/2),m=s%2?1:-1;v[a]=d.x,v[a+1]=i.lv,v[a+2]=d.z,v[a+3]=n,f[a]=i.ech?s*4.2*i.sc:m*l*7.5*i.sc,f[a+1]=i.ech?-s*5*i.sc:l*9*i.sc,f[a+2]=i.u,f[a+3]=i.amp,y[a/4*3]=i.sc,y[a/4*3+1]=i.sp||2600,y[a/4*3+2]=i.pitch||0}}),x.setAttribute("aBase",new t.InstancedBufferAttribute(v,4)),x.setAttribute("aForm",new t.InstancedBufferAttribute(f,4)),x.setAttribute("aSc",new t.InstancedBufferAttribute(y,3)),x.instanceCount=z;const g=new t.ShaderMaterial({uniforms:Mo,transparent:!0,depthWrite:!1,side:t.DoubleSide,vertexShader:Mt+`
uniform float uTime, uU; attribute float aK; attribute vec3 aSc, aQ; attribute vec4 aBase, aForm; varying float vK, vS; varying vec3 vW, vQ;
void main(){
  float sc = aSc.x, ws = mix(sc, min(sc, 1.5), step(0.001, aK));            // a wake is as long on a big skimmer as on a small one
  // the elders lean into the skin, wings tipped nose-down over a keel that stays where it is
  float pk = aSc.z * step(aK, 0.001) * smoothstep(-1.3, -0.25, position.y) * step(aQ.x, 2.5), cp = cos(pk), sp = sin(pk);
  vec3 pos = vec3(position.x * cp + position.y * sp, position.y * cp - position.x * sp, position.z);
  float along = (uU - aForm.z) * aSc.y - aForm.y + pos.x * ws;
  float lat = aForm.x + pos.z * ws + 2.5 * sin(uTime * 0.6 + aForm.x);
  vec2 d = vec2(cos(aBase.w), sin(aBase.w));
  vec2 xz = vec2(aBase.x, aBase.z) + d * along + vec2(-d.y, d.x) * lat;
  float skin = aBase.y + c3aSwell(xz, uTime) * aForm.w;
  float y = skin + (${Ue.toFixed(1)} + pos.y) * sc;
  y += step(aQ.x, 0.5) * abs(pos.z) * sc * 0.22 * sin(uTime * 2.4 + aForm.x * 0.7);      // the wings beat slowly from the root
  vK = aK; vQ = aQ; vS = y - skin; vW = vec3(xz.x, y, xz.y);
  // a flight is seen from the air it rides in, never as specks through the skin above it
  float lidY = aBase.y > 200. ? 1e5 : (aBase.y > -100. ? 262. : 4.);
  gl_Position = mix(projectionMatrix * viewMatrix * vec4(vW, 1.), vec4(0., 0., 2., 1.), step(lidY, cameraPosition.y));
}`,fragmentShader:He+`
uniform vec3 uSun, uKey, uFill; varying float vK, vS; varying vec3 vW, vQ;
void main(){
  float d = distance(vW, cameraPosition) * uFogDen; float f = exp(-d * d);
  vec3 col = vec3(1.25, 1.18, 1.02); float a = clamp(vK, 0., 1.) * 0.62;
  if (vK < 0.01) {
    vec3 V = normalize(cameraPosition - vW + vec3(0., 1e-3, 0.));
    vec3 N = cross(dFdx(vW), dFdy(vW)); N = N / max(length(N), 1e-7); if (dot(N, V) < 0.) N = -N;
    float ndl = max(dot(N, uSun), 0.), top = smoothstep(-0.15, 0.3, N.y);
    float thru = max(dot(-V, uSun), 0.); thru *= thru;
    float fr = 1. - abs(dot(N, V)); fr *= fr;
    float ln; vec4 L = c3aLayer(vW - vec3(0., 3., 0.), ln);                 // the gas under the skin this one rides
    vec3 plum = vec3(0.34, 0.17, 0.26), cream = vec3(1., 0.94, 0.86);
    a = 1.;
    if (vQ.x < 0.5) {
      // a wing: a thin membrane between dark ribs, pale along the leading edge, thinner and brighter toward the trailing edge
      float c = clamp(vQ.y, 0., 1.), t = clamp(vQ.z, 0., 1.);
      float rl = 1. - smoothstep(0.03, 0.11, abs(fract(t * 6.5 - c * 0.55) - 0.5));
      float le = 1. - smoothstep(0.02, 0.12, c);
      vec3 memb = mix(plum, mix(L.rgb, cream, 0.2), 0.22 + 0.4 * c);
      memb = mix(memb, plum * 0.5, rl * 0.7);
      memb = mix(memb, cream, le * 0.9);
      vec3 lit = uKey * (0.2 + 0.8 * ndl) * mix(0.3, 1., top) + uFill * 0.8 + uKey * thru * (1. - top) * (0.25 + 0.75 * c) + vec3(0.9, 0.85, 0.8) * fr * 0.25;
      col = memb * lit;
      a = clamp(0.62 + 0.4 * rl + 0.4 * le + 0.3 * (1. - c) - 0.1 * (1. - top), 0., 1.);
    } else if (vQ.x < 1.5) {
      col = plum * 0.75 * (uKey * (0.25 + 1.1 * ndl) + uFill * 0.8) + cream * fr * 0.22;
    } else if (vQ.x < 2.5) {
      // the keel-fin takes the colour of the gas it drags in, with a bright line where it cuts the skin
      float under = 1. - smoothstep(-0.4, 1.6, vS);
      col = mix(plum * 0.7, L.rgb * 0.95, under * 0.85) * (uKey * 0.55 + uFill * 0.8);
      col += cream * (1. - smoothstep(0.1, 0.5, abs(vS - 0.15))) * 0.9;
    } else {
      float r = length(vQ.yz) + 1e-4, ph = fract(uTime * 0.6);
      float ring = (1. - smoothstep(0., 0.07, abs(r - 0.22))) + (1. - ph) * (1. - smoothstep(0., 0.09, abs(r - 0.22 - 0.7 * ph)));
      col = cream * 1.15; a = clamp(ring, 0., 1.) * 0.8 * (1. - smoothstep(0.85, 1., r));
    }
  }
  if (a < 0.004) discard;
  gl_FragColor = vec4(mix(uFogCol, col, f), a);
}`}),w=new t.Mesh(x,g);w.frustumCulled=!1,w.renderOrder=6,K.add(w),p.dispose()}await N.yield();const zo={..._,uPx:{value:800}};{const e=Math.floor(3600*qt),o=new Float32Array(e*3);for(let p=0;p<e*3;p++)o[p]=q()*160;const u=new t.BufferGeometry;u.setAttribute("position",new t.BufferAttribute(o,3));const r=new t.ShaderMaterial({uniforms:zo,transparent:!0,depthWrite:!1,vertexShader:`
uniform float uTime, uPx; uniform vec3 uLv; varying float vA;
void main(){
  float h = fract(position.x * 7.31 + position.z * 3.17);
  vec3 p = position + vec3(uTime * (1. + 2. * h), -uTime * (2.5 + 2.5 * h), sin(uTime * 0.7 + h * 30.) * 1.5);
  p = mod(p - cameraPosition, 160.) - 80. + cameraPosition;
  vA = 1. - smoothstep(uLv.x - 8., uLv.x - 1., p.y);
  vec4 mv = viewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp(uPx * 0.2 / max(-mv.z, 1.), 1.5, 14.) * step(0.01, vA);
}`,fragmentShader:`
uniform vec3 uC0; varying float vA;
void main(){ vec2 c = gl_PointCoord - 0.5; float r = dot(c, c) * 4.; gl_FragColor = vec4(mix(uC0, vec3(1.), 0.75) * 1.15, (1. - smoothstep(0.3, 1., r)) * vA * 0.8); }`}),h=new t.Points(u,r);h.frustumCulled=!1,h.renderOrder=8,K.add(h)}const Io={..._,uGreen:{value:new t.Color("#8FBF5A")},uPale:{value:Ce.clone().lerp(new t.Color("#F2FFF6"),.55)}},jo=new t.ShaderMaterial({uniforms:Io,transparent:!0,depthWrite:!1,side:t.DoubleSide,vertexShader:`
attribute vec4 aFall; varying vec4 vF; varying vec3 vW; uniform float uTime;
void main(){
  vF = aFall; vec3 p = position;
  float sway = sin(uTime * 0.37 + aFall.y * 5. + aFall.z * 20.) * 3.2 * aFall.y * (1. - aFall.w);
  p.x -= ${X.toFixed(3)} * sway; p.z -= ${Y.toFixed(3)} * sway; p.x += ${Z.toFixed(3)} * sway * 0.6; p.z += ${O.toFixed(3)} * sway * 0.6;
  vW = p; gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
}`,fragmentShader:zt+He+`
uniform vec3 uGreen, uPale, uKey; varying vec4 vF; varying vec3 vW;
void main(){
  float u = vF.x, v = vF.y, sd = vF.z, skirt = vF.w;
  vec3 col; float a;
  if (skirt > 0.5) {
    // the fallen gas spreading over the lower skin: slow rolls beating outward from the plunge
    float n1 = vn(vec2(u * 9., v * 3. - uTime * 0.25));
    float rings = 0.5 + 0.5 * sin(v * 26. - uTime * 1.3 + 4. * n1);
    float puff = smoothstep(0.3, 0.75, vn(vec2(u * 14. + 3., v * 5. - uTime * 0.4)) * 0.6 + 0.4 * n1);
    a = (0.07 + 0.4 * rings * rings * puff) * smoothstep(0., 0.08, v) * (1. - smoothstep(0.3, 0.95, v));
    col = mix(uC2 * 1.5, uPale, 0.2 + 0.45 * rings) * (0.85 + 0.25 * uKey);
  } else {
    float e = abs(u - 0.5) * 2.;
    float fall = v * 9. - uTime * 0.9;
    float s1 = vn(vec2(u * 4. + sd * 17., fall * 0.35));
    float s2 = vn(vec2(u * 7. + sd * 31. + 0.6 * s1, fall * 0.8 + sd * 5.));
    float s3 = vn(vec2(u * 19. + sd * 7., fall * 1.5));
    float st = vn(vec2(u * 30. + sd * 13., fall * 0.3 + sd * 3.));          // threads streaming down inside the pour
    float edgeN = e + 0.3 * (s2 - 0.5) + 0.16 * (s3 - 0.5);
    float body = 1. - smoothstep(0.66, 0.8, edgeN);                         // a billowing edge, not a fade
    float rim = smoothstep(0.42, 0.7, edgeN) * body;
    float ends = smoothstep(0., 0.05, v) * (1. - smoothstep(0.9, 1., v));
    float dens = 0.45 + 0.55 * smoothstep(0.25, 0.8, 0.5 * s1 + 0.5 * s2);
    a = min(body * ends * (0.5 + 0.42 * dens), 0.94);
    col = mix(uC2 * 1.25, uPale, 0.12 + 0.6 * smoothstep(0.5, 0.85, st) + 0.25 * s2 * s2);
    col = mix(col, uGreen * (0.9 + 0.4 * s2), rim * 0.9);                   // green only here, where the lowest air truly mixes into the middle one
    col *= 0.78 + 0.4 * s1 + 0.22 * uKey;
    col += uPale * smoothstep(0.75, 0.95, st) * 0.3 * (1. - rim);
  }
  if (a < 0.004) discard;
  gl_FragColor = vec4(c3aFog(col, vW), a);
}`});let ht=null,De=null;const vt=W(he,xe(H)-52,H);{const e=[],o=[],u=[],r=q.fork("fall"),h=(z,v,f,y,b,d)=>{const i=e.length/3;for(let c=0;c<=40;c++)for(let n=0;n<=6;n++){const s=c/40,a=n/6,l=d+(H-14-d)*s,m=P(H+70,H-5,l),M=f*(.55+.45*P(0,.3,s))*(1+.7*m),S=he+z+(a-.5)*M+5*Math.sin(s*5+b*9),T=xe(l)-v*(.25+.75*P(0,.35,s))-y*Math.sin(Math.PI*a)-26*m*m+4*Math.sin(s*7+b*5);if(e.push(Z*S+X*T,l,O*S+Y*T),o.push(a,s,b,0),n<6&&c<40){const A=i+c*7+n;u.push(A,A+6+1,A+1,A+1,A+6+1,A+6+2)}}};for(let z=0;z<9;z++)h((z/8-.5)*42+r.range(-4,4),16+z%3*19+r.range(0,8),r.range(15,24)*1.3,r.range(2,9)*(z%2?1:-.5),r(),-120-r.range(0,10));h(0,36,60,6,.613,-118);{const f=e.length/3;for(let y=0;y<=5;y++)for(let b=0;b<=40;b++){const d=b/40*Math.PI*2,g=y/5,w=14+100*g,i=H+1.2+12*(1-g)*(1-g);if(e.push(vt.x+Math.cos(d)*w,i,vt.z+Math.sin(d)*w*.8),o.push(b/40*3,g,.37,1),b<40&&y<5){const c=f+y*41+b;u.push(c,c+40+1,c+1,c+1,c+40+1,c+40+2)}}}const p=new t.BufferGeometry;p.setAttribute("position",new t.Float32BufferAttribute(e,3)),p.setAttribute("aFall",new t.Float32BufferAttribute(o,4)),p.setIndex(u),ht=new t.Mesh(p,jo),ht.frustumCulled=!1,K.add(ht);const x=new t.RingGeometry(6,176,64,8);x.rotateX(-Math.PI/2),De=new t.Mesh(x,new t.ShaderMaterial({uniforms:_,transparent:!0,depthWrite:!1,side:t.DoubleSide,vertexShader:Mt+`
uniform float uTime; varying vec3 vW; varying float vR;
void main(){
  vec4 wp = modelMatrix * vec4(position, 1.); vR = length(position.xz);
  wp.y += c3aSwell(wp.xz, uTime) * 0.4 - 8. * exp(-vR * vR / 2800.) + 1.3 * sin(vR * 0.2 - uTime * 1.5) * exp(-vR / 60.);
  vW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp;
}`,fragmentShader:He+`
varying vec3 vW; varying float vR;
void main(){
  float w = 0.5 + 0.5 * sin(vR * 0.2 - uTime * 1.5); w = w * w; w *= w;
  float ring = exp(-(vR - 58.) * (vR - 58.) / 70.);
  float a = (w * 0.42 * exp(-vR / 60.) + ring * 0.55) * (1. - smoothstep(125., 176., vR)) * smoothstep(6., 16., vR);
  gl_FragColor = vec4(c3aFog(vec3(1., 0.97, 0.88) * (0.9 + 0.5 * ring), vW), clamp(a, 0., 1.));
}`})),De.position.set(vt.x,H+.5,vt.z),De.frustumCulled=!1,De.renderOrder=5,K.add(De)}const s0=W(he,xe(-215)-38,-215);await N.yield();const So=new t.ShaderMaterial({uniforms:{uCol:{value:ne.clone().multiplyScalar(.075)},uFogDen:_.uFogDen},vertexShader:`varying vec3 vSN; varying vec3 vSW; varying vec2 vSUv;
void main() { vSUv = uv; vec4 wp = modelMatrix * vec4(position, 1.0); vSW = wp.xyz; vSN = mat3(modelMatrix) * normal; gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:`uniform vec3 uCol; uniform float uFogDen; varying vec3 vSN; varying vec3 vSW; varying vec2 vSUv;
void main() { vec3 V = cameraPosition - vSW; float dl = max(length(V), 1e-4); V = V / dl; vec3 N = vSN / max(length(vSN), 1e-4);
  float fd = dl * uFogDen * 1.3;
  float nv = abs(dot(N, V)); float a = nv * nv * nv * smoothstep(0.0, 0.45, vSUv.y) * (1.0 - smoothstep(0.35, 1.0, vSUv.y)) * exp(-fd * fd);
  gl_FragColor = vec4(uCol * a, 1.0); }`,transparent:!0,blending:t.AdditiveBlending,depthWrite:!1,fog:!1,side:t.DoubleSide}),ft=[],Et=So.clone();Et.uniforms.uCol={value:ne.clone().multiplyScalar(.3)},Et.uniforms.uFogDen=_.uFogDen,[[1408,337,0],[1150,228,1],[985,430,2]].forEach(([e,o,u])=>{const r=new t.Mesh(new t.CylinderGeometry(5,17,200,20,1,!0),u?So:Et);r.position.copy(W(e,o,J+96)),r.rotation.z=.1,K.add(r),ft.push(r);const h=W(e,o,0);Xt[ft.length-1].set(h.x-9,h.z,u?30:25,u?.8:2.3)});const Fo={uA:{value:0},uBody:{value:fo},uKey:_.uKey,uFill:_.uFill,uTime:_.uTime};{const e=new t.Mesh(new t.PlaneGeometry(2,2),new t.ShaderMaterial({uniforms:Fo,transparent:!0,depthTest:!1,depthWrite:!1,vertexShader:"varying vec2 vS; void main(){ vS = position.xy; gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:zt+`
uniform float uA, uTime; uniform vec3 uBody, uKey, uFill; varying vec2 vS;
void main(){
  float g = exp(-dot(vS - vec2(0.15, 0.3), vS - vec2(0.15, 0.3)) * 1.4);
  float rows = vn(vec2(vS.x * 2.2 + vS.y * 0.8 + uTime * 0.6, vS.y * 26. - vS.x * 9.)) * 0.6 + 0.4 * vn(vec2(vS.x * 5. - uTime * 0.9, vS.y * 70. - vS.x * 24.));
  vec3 col = uBody * (uKey * (0.5 + 0.4 * g + 0.18 * rows) + uFill * 0.66);
  gl_FragColor = vec4(col, uA);
}`}));e.frustumCulled=!1,e.renderOrder=900,K.add(e)}{const e=new t.CircleGeometry(46,40),o=new t.Mesh(e,new t.ShaderMaterial({uniforms:{uCol:{value:new t.Color("#BFF5E4").multiplyScalar(.3)},uFogDen:_.uFogDen},vertexShader:"varying vec3 vHW; varying vec2 vHP; void main(){ vHP = position.xy; vec4 wp = modelMatrix * vec4(position, 1.); vHW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }",fragmentShader:"uniform vec3 uCol; uniform float uFogDen; varying vec3 vHW; varying vec2 vHP; void main(){ float d = distance(vHW, cameraPosition), fd = d * uFogDen * 0.7; float r2 = dot(vHP, vHP); float a = (exp(-r2 / 330.) + 0.35 * exp(-r2 / 1300.)) * (1. - smoothstep(600., 2100., r2)) * smoothstep(25., 110., d) * exp(-fd * fd); gl_FragColor = vec4(uCol * a, 1.); }",transparent:!0,blending:t.AdditiveBlending,depthWrite:!1,fog:!1,side:t.DoubleSide}));o.position.copy(ge).add(new t.Vector3(-Z*13,0,-O*13)),o.rotation.y=Math.atan2(Z,O),o.frustumCulled=!1,o.renderOrder=7,K.add(o)}let ke=null;const Co=W(826,280,H-86);if(At){const u=[],r=[],h=[],p=[],x=q.fork("bell"),z=(d,g,w)=>{const i=u.length/3,c=d.length;for(let n=0;n<c;n++)for(let s=0;s<=48;s++){const a=s/48*Math.PI*2,l=d[n][0]*(1+w*Math.sin(a*8+n*.9));if(u.push(l*Math.cos(a),d[n][1],l*Math.sin(a)),r.push(s/48,d[n][2]),h.push(g,0),s<48&&n<c-1){const m=i+n*49+s;p.push(m,m+48+1,m+1,m+1,m+48+1,m+48+2)}}},v=[];for(let d=0;d<=14;d++){const g=d/14*Math.PI*.6;v.push([60*Math.sin(g),60*Math.cos(g),d/14*.8])}v.push([60*.9,-60*.38,.87],[60*.76,-60*.44,.94],[60*.62,-60*.4,1]),z(v,0,0);const f=[];for(let d=0;d<=8;d++){const g=d/8;f.push([60*$(.34,.1,Math.pow(g,.7)),-60*(.12+1.25*g),g])}z(f,1,.22);const y=(d,g,w,i,c,n,s,a,l)=>{const M=u.length/3;for(let S=0;S<=12;S++){const T=S/12,A=c*(1-.6*T),L=l*T*T*d,k=l*T*T*w;for(let F=0;F<2;F++){const j=F-.5;u.push(d+L+n*A*j,g-i*T,w+k+s*A*j),r.push(F,T),h.push(2,a)}if(S<12){const F=M+S*2;p.push(F,F+2,F+1,F+1,F+2,F+3)}}};for(let d=0;d<30;d++){const g=(d+x.range(-.25,.25))/30*Math.PI*2,w=Math.cos(g),i=Math.sin(g),c=d%2;y(w*60*.8,-60*.42,i*60*.8,60*x.range(1.1,2),x.range(2.2,3.6),c?w:-i,c?i:w,x(),x.range(-.12,.1))}for(let d=0;d<6;d++){const g=(d+.5)/6*Math.PI*2,w=Math.cos(g),i=Math.sin(g);y(w*60*.08,-60*1.3,i*60*.08,60*x.range(.7,1.1),9,-i,w,x(),1.5)}const b=new t.BufferGeometry;b.setAttribute("position",new t.Float32BufferAttribute(u,3)),b.setAttribute("uv",new t.Float32BufferAttribute(r,2)),b.setAttribute("aB",new t.Float32BufferAttribute(h,2)),b.setIndex(p),b.computeVertexNormals(),ke=new t.Mesh(b,new t.ShaderMaterial({uniforms:_,transparent:!0,depthWrite:!1,side:t.DoubleSide,vertexShader:`
attribute vec2 aB; uniform float uTime; varying vec2 vUv; varying vec3 vN, vW; varying float vPart;
void main(){
  vUv = uv; vPart = aB.x; vec3 p = position; float beat = sin(uTime * 1.57);
  if (aB.x < 0.5) { float rk = smoothstep(0.25, 0.8, uv.y); p.xz *= 1. + 0.07 * beat * rk; p.y += 1.6 * beat * (1. - rk); }
  else if (aB.x < 1.5) { p.xz *= 1. + 0.08 * sin(uTime * 1.57 - 1. - uv.y * 3.); }
  else {
    float al = uv.y, ph = aB.y * 6.2832;
    p.xz *= 1. + 0.07 * beat * (1. - al);
    p.x += sin(uTime * 0.5 + ph + al * 4.) * al * al * 9.;
    p.z += cos(uTime * 0.43 + ph * 1.7 + al * 3.3) * al * al * 9.;
    p.y += 2.5 * al * sin(uTime * 1.57 - al * 5. + ph);
  }
  vec4 wp = modelMatrix * vec4(p, 1.); vW = wp.xyz; vN = normal; gl_Position = projectionMatrix * viewMatrix * wp;
}`,fragmentShader:He+`
varying vec2 vUv; varying vec3 vN, vW; varying float vPart;
void main(){
  vec3 V = normalize(cameraPosition - vW + vec3(0., 1e-3, 0.));
  float line; vec4 L = c3aLayer(vW, line);
  vec3 pearl = vec3(0.98, 0.9, 0.82), gas = mix(L.rgb, pearl, 0.5);
  vec3 col; float a;
  if (vPart < 0.5) {
    vec3 n = normalize(vN + vec3(0., 1e-4, 0.));
    float fr = 1. - abs(dot(n, V)); fr *= fr;
    float lob = abs(sin(vUv.x * 3.14159 * 24.));                       // 24 lobes with a groove between each two
    float groove = smoothstep(0., 0.3, lob);
    float band = 0.5 + 0.5 * sin(vUv.y * 46. - uTime * 0.6);
    float rim = smoothstep(0.74, 0.8, vUv.y);
    col = mix(gas * 0.86, pearl, 0.3 * fr) * (0.56 + 0.4 * groove) * (0.92 + 0.1 * band * smoothstep(0.3, 0.8, vUv.y)) * (0.86 + 0.2 * n.y);
    col = mix(col, vec3(1., 0.86, 0.66) * (0.7 + 0.3 * lob), rim * 0.5);
    col += vec3(1., 0.96, 0.86) * line * 0.6;
    a = 0.62 + 0.3 * fr + 0.12 * (1. - groove) + 0.15 * rim;
  } else if (vPart < 1.5) {
    float fl = 0.5 + 0.5 * sin(vUv.x * 6.2832 * 8. + vUv.y * 7.);
    float tv = clamp(vUv.y, 0., 1.);
    col = gas * (0.6 + 0.35 * fl) * (1.05 - 0.3 * tv); a = 0.72 - 0.2 * tv;
  } else {
    float ed = min(abs(vUv.x - 0.5) * 2., 1.), sv = clamp(vUv.y, 0., 1.);
    float bead = 0.5 + 0.5 * sin(sv * 60. - uTime * 1.2);
    col = mix(gas * 0.8, pearl, 0.25 + 0.45 * bead * bead) * (1. - 0.3 * ed);
    a = (1. - smoothstep(0.7, 1., ed)) * (0.8 - 0.45 * sv) * (1. - smoothstep(0.9, 1., sv));
  }
  // drawn after the skins: what lies on the far side of the lowest skin from the eye is seen through it, faint from above, glowing from below
  float sub = 1. - clamp(L.a, 0., 1.), camUp = step(uLv.z, cameraPosition.y);
  a *= mix(mix(1., 0.5, 1. - sub), mix(1., 0.2, sub), camUp);
  gl_FragColor = vec4(c3aFog(col, vW), clamp(a, 0., 0.95));
}`})),ke.position.copy(Co),ke.frustumCulled=!1,ke.renderOrder=4.5,K.add(ke)}await N.yield();const Kt=je===1,pt=ne.clone();{const e={};pt.getHSL(e,t.SRGBColorSpace),pt.setHSL($(e.h,.1,.6),Ke(e.s,.66,.78),Math.min(e.l,.57),t.SRGBColorSpace)}const Ht=be.clone();{const e={};Ht.getHSL(e,t.SRGBColorSpace),Ht.setHSL(e.h,Math.min(1,e.s*1.16+.08),Math.min(e.l,.75),t.SRGBColorSpace)}const Se=[{fog:kt.clone().lerp(Ce,.3),den:.0022,key:new t.Color(.16,.17,.15),fill:Ce.clone().lerp(new t.Color(.8,.85,.8),.4).multiplyScalar(.95)},{fog:pt,den:.0016,key:qe.clone().multiply(new t.Color(1,.76,.38)).multiplyScalar(Kt?.4:.95),fill:ne.clone().lerp(pt,.5).multiplyScalar(Kt?.9:.76)},{fog:Ht,den:.00102,key:qe.clone().multiply(new t.Color(1,.8,.84)).multiplyScalar(.92),fill:be.clone().multiplyScalar(.55)},{fog:new t.Color(Kt?"#F3CFAE":"#E9D3C4"),den:31e-5,key:qe.clone().multiplyScalar(.95),fill:new t.Color("#9db8d8").lerp(new t.Color("#5A3F52"),.38).multiplyScalar(.72)}],mt=new t.Vector3,$e=new t.Color,dt=new t.Color,gt=new t.Color,wt=new t.Color,xt=new t.Color,Ao=new t.Vector2,Ee={dy:300,under:0},qo=new t.Vector3,ko=(e,o)=>{const u=e.y<60?ee.faceHeight(e.x,e.z,o):NaN;return e.y-(u===u?u:jt(e.x,e.z,o))};Ee.at=(e,o)=>ko(U.pointAt(e,qo),o),Ee.kc=Me,Ee.uX=we;const Bo=(e,o)=>{const u=e<50&&o<.9;Ee.dy=o,Ee.under=u?1:0;const r=[P(H-5,H+5,e),Math.max(P(40,60,e),P(.9,7,o)),P(ce-6,ce+6,e)];$e.copy(Se[0].fog),dt.copy(Se[0].key),gt.copy(Se[0].fill);let h=Se[0].den;for(let p=0;p<3;p++)$e.lerp(Se[p+1].fog,r[p]),dt.lerp(Se[p+1].key,r[p]),gt.lerp(Se[p+1].fill,r[p]),h=$(h,Se[p+1].den,r[p]);_.uFogCol.value.copy($e),_.uFogDen.value=h,_.uKey.value.copy(dt),_.uFill.value.copy(gt),K.fog.color.copy($e),K.fog.density=h,K.background.copy($e),wt.copy(dt),wt.g*=$(1,.97,r[1]),wt.b*=$(1,.84,r[1]),xt.copy(gt),xt.g*=$(1,.92,r[1]),xt.b*=$(1,.66,r[1]),ee.setSun(Bt,wt),ee.setFill(xt),po.value=u?0:1,ee.object.visible=!u,Fo.uA.value=e<50?u?P(-1.1,.5,o):1-P(1,2.2,o):0,Ot.uniforms.uClear.value=r[2],ht.renderOrder=u?e>H?5:.5:0,De.renderOrder=e>H?5:.6;for(const p of uo)p.renderOrder=1+Math.round(3-Math.min(3,Math.abs(e-p.userData.level)/200))};Bo(300,300);const Be=500,se=new Float32Array((Be+1)*3),No=new t.Vector3,Wo=new t.Vector3;{const e=new t.Vector3,o=new t.Vector3,u=new t.Vector3,r=new t.Vector3,h=new t.Vector3,p=At?W(he+120,xe(-200)-110,0):W(he+40,xe(-200)-62,0),x=new t.Vector3,z=new t.Vector3,v=new t.Vector3,f=m=>{const M=(m-Re)*yo+26;return h.set(Ge.x+Qe[0]*M-Qe[1]*4,ce+12,Ge.z+Qe[1]*M+Qe[0]*4)};v.copy(f(Re)).sub(U.pointAt(Re,e));const y=m=>m<=Re?f(m):h.copy(U.pointAt(m,o)).add(v),b=()=>h.set(-420,10,120),d=()=>h.set(-370,26,198),g=()=>h.set(20,55,70),w=te-.075,i=new t.Vector3,c=m=>h.set(p.x,$(-60,-205,P(we+.012,te-.045,m)),p.z);i.copy(c(w)).sub(U.pointAt(w,e));const n=m=>m<=w?c(m):h.copy(U.pointAt(m,o)).add(i),s=()=>h.copy(me[8]),a=[[0,30],[.015,30],[.07,y],[.086,y],[.135,b],[.2,b],[.238,d],[.262,d],[.31,g],[.35,g],[Oe-.035,s],[Oe+.004,s],[Oe+.03,45],[we-.055,45],[we+.05,n]];if(At){const m=te+.002,M=te+.04;x.copy(W(851,280,H+24)).sub(U.pointAt(m,e)).normalize(),z.copy(W(901,280,H-26)).sub(U.pointAt(M,e)).normalize();const S=T=>h.copy(x).lerp(z,P(m,M,T)).multiplyScalar(300).add(U.pointAt(T,o));a.push([te-.085,n],[te-.002,S],[te+.045,S],[Te+.09,30],[1,30])}else a.push([te-.075,n],[te+.03,30],[1,30]);const l=(m,M,S)=>(U.pointAt(M,e),typeof m[1]=="number"?U.posAtDist(M*U.length+m[1],o):o.copy(m[1](M)),S.subVectors(o,e).normalize());for(let m=0;m<=Be;m++){const M=m/Be;let S=0;for(;S<a.length-2&&M>a[S+1][0];)S++;l(a[S],M,u),l(a[S+1],M,r),u.lerp(r,P(a[S][0],a[S+1][0],M)).normalize(),se[m*3]=u.x,se[m*3+1]=u.y,se[m*3+2]=u.z}for(let m=0;m<2;m++){const M=se.slice();for(let S=0;S<=Be;S++){let T=0,A=0,L=0;for(let F=-4;F<=4;F++){const j=Ke(S+F,0,Be)*3;T+=M[j],A+=M[j+1],L+=M[j+2]}const k=Math.hypot(T,A,L)||1;se[S*3]=T/k,se[S*3+1]=A/k,se[S*3+2]=L/k}}}const _o=[{at:(e,o)=>{const u=Ke(o,0,1)*Be,r=Math.min(Be-1,Math.floor(u)),h=u-r;return U.pointAt(o,No),Wo.set($(se[r*3],se[r*3+3],h),$(se[r*3+1],se[r*3+4],h),$(se[r*3+2],se[r*3+5],h)).normalize(),Wo.multiplyScalar(300).add(No)},from:-1,to:2,weight:1}],It=(e,o,u,r,h)=>P(o,u,e)*(1-P(r,h,e));return{scene:K,path:U,duration:50,pace:e=>1-.33*It(e,Oe-.04,Oe+.01,we-.05,we-.01)+.25*It(e,we+.01,we+.04,te-.09,te-.05)-.2*It(e,te-.06,te-.03,te+.01,te+.04),title:re.name,camera:{fov:62,near:.5,far:5e3,lookAhead:30,sway:.6,bank:.45},pois:_o,portal:{shape:"circle",radius:13,color:"#BFF5E4",glow:1,revealDistance:460},post:{exposure:1,bloom:{strength:.35,radius:.6,threshold:.92},grade:{saturation:1.06,contrast:1.04,tint:"#ffffff",shadowTint:"#2a1c26",vignette:.25,grain:.02,aberration:0}},ride:"none",update(e,o,u,r){_.uTime.value=o,Mo.uU.value=r,mt.setFromMatrixPosition(u.matrixWorld),Bo(mt.y,ko(mt,o)),et.position.copy(mt),ee.update(e,o),xo(o),N.renderer.getDrawingBufferSize(Ao),zo.uPx.value=Ao.y;for(let h=0;h<ft.length;h++)ft[h].scale.x=1+.12*Math.sin(o*.4+h*2.1);ke&&(ke.position.y=Co.y+92*P(Te-.2,Te-.07,r)+2.5*Math.sin(o*.8))},dispose(){ee.dispose()},crossing:Ee}}};export{u0 as default};
