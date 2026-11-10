import*as e from"three";import{mergeVertices as ze}from"three/addons/utils/BufferGeometryUtils.js";const ke=["#E8B46A","#B9762F","#F7E6C2","#E6F1FC","#6FA6E0","#04060C","#6FF2E0"],I=40,J=`
uniform vec2 uProf[${I*2}];
uniform vec3 uWave[7];
uniform float uNW, uRise;
vec2 prof(float t, float layer){
  float f = clamp(t, 0., 1.) * ${I-1}.; float i = min(floor(f), ${I-2}.); float u = f - i;
  int b = int(layer + .5) * ${I}; int i1 = int(i);
  vec2 p0 = uProf[b + max(i1 - 1, 0)], p1 = uProf[b + i1], p2 = uProf[b + i1 + 1], p3 = uProf[b + min(i1 + 2, ${I-1})];
  return .5 * ((2. * p1) + (-p0 + p2) * u + (2. * p0 - 5. * p1 + 4. * p2 - p3) * u * u + (-p0 + 3. * p1 - 3. * p2 + p3) * u * u * u);
}
// x -> (local scale, envelope 0..1)
vec2 env(float x){
  float E = 0., sw = 0., ww = 0.;
  for (int k = 0; k < 7; k++) {
    if (float(k) < uNW) {
      vec3 w = uWave[k]; float d = abs(x - w.x) / w.y;
      float dd = min(d, 1.); E = max(E, 1. - dd * dd);                              // scallops: peaked arcs meeting in cusps
      float q = 1. / (d * d * d * d + .02); sw += w.z * q; ww += q;
    }
  }
  E = max(E, .13 * step(uWave[0].x, x) * step(x, uWave[int(uNW + .5) - 1].x));       // the saddles between crests never pinch shut
  return vec2(sw / max(ww, 1e-4), E);
}
vec3 wavePos(float x, float t, float layer, out vec2 sE){
  sE = env(x); vec2 p = prof(t, layer);
  float w = sE.x * mix(.5, 1., sE.y);
  float z = p.x * mix(w, 1., 1. - smoothstep(-800., -480., p.x));
  return vec3(x, p.y * sE.x * mix(.07, 1., sE.y) * uRise, z);
}
`,Be=`
float h21(vec2 p){ p = fract(p * vec2(234.34, 435.345)); p += dot(p, p + 34.23); return fract(p.x * p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float fbm(vec2 p){ float a = .5, s = 0.; for (int i = 0; i < 4; i++) { s += a * vn(p); p = p * 2.03 + 17.1; a *= .5; } return s / .9375; }
`,fe=`
uniform vec3 uSun, uPlanet, uSunCol, uShineCol, uAmb, uCamL, uSeat, uBlue;
varying vec3 vN, vL, vCol; varying float vGl, vOcc;
#include <fog_pars_fragment>
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)); vec3 V = normalize(uCamL - vL + vec3(0., 1e-5, 0.));
  float ndl = dot(N, uSun); float lit = smoothstep(-.02, .09, ndl) * (1. - .92 * vOcc);       // vOcc: in the hollow under the lip
  vec3 col = vCol * uSunCol * lit * (.5 + .5 * clamp(ndl, 0., 1.));
  float pl = smoothstep(-.15, .7, dot(N, uPlanet));
  col += vCol * uShineCol * pl * (1. - lit * .75) * (1. - .7 * vOcc) + vCol * uAmb + vCol * uBlue * .3 * vOcc;
  vec3 sv = vL - uSeat; col += vCol * vec3(.16, .89, .74) * .7 / (1. + dot(sv, sv) / 1600.);   // the portal's pool of mint light
  vec3 H = normalize(uSun + V + vec3(0., 1e-5, 0.));
  float g = max(dot(N, H), 0.); g = g * g; g = g * g; g = g * g; g = g * g; g = g * g; g = g * g;
  col += uSunCol * g * lit * vGl * 3.;
  float back = max(dot(-V, uSun), 0.); back *= back; back *= back;
  float rim = 1. - abs(dot(N, V)); rim = rim * rim * rim;
  col += uSunCol * rim * back * 1.6;
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,Ve=`
attribute vec4 aA;   // x, t0, normal offset (m), flow rate (1/s)
attribute vec4 aB;   // radius (m), spin phase, layer, glint
attribute vec3 aAxis;
attribute vec3 color;
uniform float uTime, uPix, uH, uLipT; uniform vec3 uSeat, uDir, uCamL;
varying vec3 vN, vL, vCol; varying float vGl, vOcc;
#include <fog_pars_vertex>
${J}
void main(){
  float crest = step(1.5, aB.z); float layer = aB.z * (1. - crest); float span = layer < .5 ? 1.2 : 1.;   // crest class: boulders riding the lip only
  float t0 = crest * .56; float tt = t0 + fract(aA.y + uTime * aA.w) * (span - t0); float tc = min(tt, 1.);
  vec2 sE, sE2; vec3 c = wavePos(aA.x, tc, layer, sE); vec3 c2 = wavePos(aA.x, tc - .015, layer, sE2);
  vec3 tg = normalize(c - c2 + vec3(0., 0., 1e-4));
  float ls = sE.x; float le = ls * mix(.45, 1., sE.y);
  vOcc = layer > .5 ? smoothstep(.13, .34, c.y / max(uH * ls * mix(.07, 1., sE.y), 1.)) * smoothstep(.05, .3, sE.y)
    : smoothstep(.45, .55, tc) * (1. - smoothstep(.85, 1., tc)) * step(aA.z, 0.) * .85 * sE.y;   // stones hanging under the roof of the curl
  c += vec3(0., tg.z, -tg.y) * aA.z * le;
  float tau = max(tt - 1., 0.) / .2;                       // shed off the lip: slow ballistic arc
  c += (tg * 85. * tau + vec3(0., -175., 0.) * tau * tau * uRise) * le; c.x += aA.z * tau * 5. * ls;
  float s = aB.x * mix(ls, 1., .15);
  float dist = length(uCamL - c);
  s = max(s, dist * uPix * .85);
  s *= smoothstep(t0, t0 + .03, tt) * (1. - smoothstep(span - .07, span, tt));
  s *= 1. - crest * smoothstep(uLipT - .03, uLipT + .01, tt) * (1. - smoothstep(34., 74., abs(c.x)));   // none hang in the arch over the approach
  vec3 rel = c - uSeat; float h = clamp(dot(rel, -uDir), -30., 330.);   // keep the camera corridor clear
  float dc = length(rel + uDir * h); float cr = mix(22., 8., smoothstep(110., 190., h)); s *= smoothstep(cr, cr + 4., dc - aB.x);   // wider for the last 150 m
  float dl = length(vec3(c.x, max(abs(c.y - 40.) - 4., 0.), 0.)); s *= mix(1., smoothstep(8., 12., dl - aB.x), step(200., c.z));
  float ang = aB.y + uTime * (.25 + fract(aB.y * 7.31) * .7) * (aB.x > 7. ? .25 : 1.);
  vec3 ax = normalize(aAxis + vec3(1e-4, 0., 0.)); float ca = cos(ang), sa = sin(ang);
  vec3 p = position * ca + cross(ax, position) * sa + ax * dot(ax, position) * (1. - ca);
  vec3 n = normal * ca + cross(ax, normal) * sa + ax * dot(ax, normal) * (1. - ca);
  vL = c + p * s; vN = n; vGl = aB.w;
  float far = smoothstep(200., 1500., aA.x);
  vCol = color * mix(vec3(1.), vec3(.42, .5, .66), far);
  vec4 mvPosition = modelViewMatrix * vec4(vL, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Te=`
uniform vec3 uCamL;
varying vec3 vN, vL; varying vec3 vUv; varying vec2 vSE;
#include <fog_pars_vertex>
${J}
void main(){
  float x = position.x, t = position.y, layer = position.z;
  vec2 sE, s2; vec3 P = wavePos(x, t, layer, sE);
  vec3 Px = wavePos(x + 5., t, layer, s2) - wavePos(x - 5., t, layer, s2);
  vec3 Pt = wavePos(x, min(t + .008, 1.), layer, s2) - wavePos(x, max(t - .008, 0.), layer, s2);
  vN = normalize(cross(Pt, Px) + vec3(0., 1e-4, 0.));
  vL = P; vSE = sE; vUv = vec3(x, t, layer);
  vec4 mvPosition = modelViewMatrix * vec4(P, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Fe=`
uniform vec3 uSun, uPlanet, uSunCol, uShineCol, uCamL, uFrost, uCream, uBlue, uSeat;
uniform float uTime, uBraid, uX0, uX1, uH, uRise, uLipT;
varying vec3 vN, vL; varying vec3 vUv; varying vec2 vSE;
#include <fog_pars_fragment>
${Be}
float pebble(vec2 cq, float cov, float rs, out float lit){
  vec2 ci = floor(cq); float ch = h21(ci), c2 = h21(ci + 71.3), c3 = h21(ci + 13.7);
  float r = (.2 + .28 * c3) * rs;
  float d = length(fract(cq) - .5 + (vec2(c2, c3) - .5) * .5);
  lit = step(fract(c2 * 7.7), .64);
  return step(ch, cov) * (1. - smoothstep(r - .08 * rs, r, d));
}
void main(){
  float x = vUv.x, t = vUv.y, layer = vUv.z;
  float sc = max(vSE.x, .05);
  float arc = t * (layer < .5 ? 1150. : 560.);
  float flow = arc - uTime * 22.;
  vec2 q = vec2(x, flow); float fine = 1. - smoothstep(.3, .8, sc);
  vec2 fwq = fwidth(q); float px = max(fwq.x, fwq.y);
  // density: clumps streaked along the flow, with real voids between the strands
  float streak = mix(fbm(vec2(q.x * .05, q.y * .006)), fbm(vec2(q.x * .16, q.y * .02)), fine);
  float clump = mix(fbm(q * .023 + 7.3), fbm(q * .07 + 7.3), fine);
  vec2 qr = mat2(.8, -.6, .6, .8) * q;
  float m1 = fbm(qr * mix(.07, .2, fine) + 5.), m2 = vn(qr.yx * .33 + 9.);
  float rag = fbm(vec2(q.x * .03, q.y * .02 + 3.)) - .5;
  float dens = clamp(smoothstep(.2, .62, streak) * (.5 + 1.1 * clump), 0., 1.);
  float a = .08 + .92 * dens;
  float solid = 0.;
  if (layer > .5) {
    solid = smoothstep(.1, .2, t + rag * .1);                  // above its ragged foot the face is packed rubble: opaque
    a = max(a, .86 * solid);
    a *= smoothstep(.0, .09, t + rag * .16);
    float strands = smoothstep(.25, .5, abs(sin(t * 38. + rag * 4.)));
    a *= mix(1., strands, uBraid * (1. - smoothstep(.12, .3, t)));
  } else {
    a *= 1. - smoothstep(.93, 1., t + rag * .1);
    a = mix(a, max(a, .82), 1. - smoothstep(.1, .5, t));       // the undisturbed sheet behind is dense and calm
    a = max(a, .84 * smoothstep(.4, .48, t) * (1. - smoothstep(.9, .97, t + rag * .1)));   // the crest and lip are packed too
    a *= smoothstep(0., .05, t);
    // the hanging curtain of the lip is left open over the approach line: an arch with the portal's star in it
    a *= 1. - (1. - smoothstep(30., 64., abs(x) + rag * 36.)) * smoothstep(uLipT - .015, uLipT + .015, t);
  }
  a *= mix(1., .78, vSE.y * (1. - solid));
  a *= smoothstep(uX0, uX0 + 220., x) * (1. - smoothstep(uX1 - 120., uX1, x));
  float closeUp = 1. - smoothstep(.12, .3, px);                 // only where half-metre cells are resolved: no per-pixel speckle further off
  if (a + (m1 - .5) * .7 + (m2 - .5) * .2 < .2 + .08 * h21(floor(q * 2.) + 1.7) * closeUp) discard;   // ragged voids between the strands (anchored to the surface)
  // pebbles on a dim dust body: round grains when close, averaged coverage when far
  float near = 1. - smoothstep(.22, .9, px * .43);
  float litCell; float pm = pebble(q * .43, a, .6, litCell);
  float lit2; float pm2 = pebble(qr * .17 + 31.7, a * .5, 1., lit2);
  if (pm2 > pm) { pm = pm2; litCell = lit2; }
  float lit3; float pm3 = pebble(qr.yx * 1.3 + 11.3, a * .8, .8, lit3) * (1. - smoothstep(.2, .6, px * 1.3));
  if (pm3 > pm) { pm = pm3; litCell = lit3; }
  if (closeUp > .5 && pm < .5 && solid < .5 && t < .55 && h21(floor(q * 2.6) + 5.) > a * .6) discard;   // close up, the loose dust is a haze between the stones
  float pmix = mix(a * smoothstep(.38, .6, m1 * .6 + m2 * .4) * 1.15, pm, near);
  float grain = mix(mix(.36, .46, near), mix(1.2, mix(.75, 1.1, litCell), near), pmix) * (.85 + .3 * vn(q * .3));

  vec3 N = normalize(vN); vec3 V = normalize(uCamL - vL + vec3(0., 1e-5, 0.));
  float ndl = dot(N, uSun), ndv = dot(N, V);
  float sgn = ndv < 0. ? -1. : 1.;
  float same = smoothstep(-.05, .05, ndl * sgn);
  // comb: long thin shadows of the bergs, raked along the sun's ground track across the sheet behind the crests
  float comb = smoothstep(.5, .57, fbm(vec2(q.x * .0045 + 3.1, q.y * .1))) * (layer < .5 ? 1. - smoothstep(.5, .72, t) : 0.);
  vec3 refl = uFrost * uSunCol * (.26 + .74 * smoothstep(0., .55, abs(ndl))) * (.6 + .4 * dens) * grain;
  refl *= layer > .5 ? .4 + .75 * streak : 1.;                           // the face: flow streaks read as brightness
  refl *= mix(vec3(1.), uBlue * .3, comb);
  float fw = max(dot(-V, uSun), 0.); float fwd = fw * fw; fwd *= fwd * fw;
  float thin = 1. - dens; float roof = layer < .5 ? smoothstep(.5, .66, t) : 0.;
  // the vault of the curl: ribs of clumped rubble sliding over, deep blue at the back, glowing toward the thin lip
  float rib = smoothstep(.32, .62, fbm(vec2(q.x * .0035 + 11., q.y * .03)));
  float vault = roof * (.18 + .66 * smoothstep(.58, .97, t)) * (.3 + 1.1 * rib);
  vec3 trans = uSunCol * mix(uCream, uFrost, .25 + .3 * grain) * (.1 + 1.2 * fwd + .6 * vault * (.35 + .65 * thin)) * (1.35 - .9 * dens);
  trans *= mix(vec3(1.), uBlue * .7, comb * .8) * mix(1.05, .85, pmix);
  trans += uBlue * (.1 + .07 * grain);                                   // the shadow side is blue, never mud
  vec3 col = mix(trans, refl, same);
  float pfac = clamp(dot(N * sgn, uPlanet), 0., 1.);
  col += uShineCol * uFrost * (.14 + .42 * pfac) * (1.2 - .5 * grain) * mix(.45, 1., same);
  // the hollow under the lip: packed rubble in deep blue shadow, filled butterscotch only where it faces the giant
  float hr = vL.y / max(uH * sc * mix(.07, 1., vSE.y) * uRise, 1.);
  float occ = layer > .5 ? smoothstep(.13, .34, hr) * smoothstep(.05, .3, vSE.y) : 0.;
  float gs = mix(.8, grain, near * .7 + .3);                             // far off, the shadowed rubble is averaged: no orange speckle
  vec3 hollow = uBlue * .17 * (.4 + .8 * gs) * (.45 + 1.1 * streak) + uShineCol * uFrost * .5 * pfac * gs;
  col = mix(col, hollow, occ * .94);
  float lipK = layer < .5 ? smoothstep(.68, 1., t) * smoothstep(0., .5, vSE.y) : 0.;
  col += uSunCol * uFrost * 1.7 * lipK * lipK * lipK * (.45 + .55 * pmix);        // the fire-white lip
  vec3 sv = vL - uSeat; float d2 = dot(sv, sv);
  col += vec3(.16, .89, .74) * uFrost * (.5 + .6 * gs) * .6 / (1. + d2 / 1600.);   // the portal's pool of mint light
  col += uShineCol * uFrost * 3. * gs * smoothstep(0., .5, dot(normalize(sv + vec3(1e-4, 0., 0.)), uPlanet) + .25) * (1. - smoothstep(26., 70., sqrt(d2))) * step(.5, layer);   // butterscotch on the giant's side of the opening
  float gl = step(.9965, h21(floor(q * 1.3) + 3.)) * same * (1. - occ);     // frost glints
  vec3 H = normalize(uSun + V + vec3(0., 1e-5, 0.)); float sp = max(dot(N * sgn, H), 0.); sp *= sp; sp *= sp;
  col += uSunCol * gl * (1. + 5. * sp);
  float far = smoothstep(200., 1500., x);                      // the train recedes: dimmer and bluer down-range
  col = mix(col, uBlue * dot(col, vec3(.4)), far * .45) * mix(1., .4, far);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,qe=`
attribute vec3 color;
uniform mat4 uToHero;
varying vec3 vN, vL, vCol; varying float vGl, vOcc;
#include <fog_pars_vertex>
void main(){
  vOcc = 0.; vL = (uToHero * vec4(position, 1.)).xyz; vN = mat3(uToHero) * normal; vCol = color; vGl = .12;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Le=`
attribute vec4 aA; attribute vec4 aB;
uniform float uTime, uPix; uniform vec3 uCamL, uSeat, uDir;
varying float vI;
${J}
void main(){
  float tt = .5 + fract(aA.y + uTime * aA.w) * .7; float tc = min(tt, 1.);
  vec2 sE, sE2; vec3 c = wavePos(aA.x, tc, 0., sE); vec3 c2 = wavePos(aA.x, tc - .015, 0., sE2);
  vec3 tg = normalize(c - c2 + vec3(0., 0., 1e-4));
  float le = sE.x * mix(.45, 1., sE.y);
  c += vec3(0., tg.z, -tg.y) * aA.z * le;
  float tau = max(tt - 1., 0.) / .2;
  c += (tg * 85. * tau + vec3(0., -175., 0.) * tau * tau * uRise) * le; c.x += aA.z * tau * 3. * sE.x;
  vec3 rel = c - uSeat; float h = clamp(dot(rel, -uDir), -30., 330.); float dc = length(rel + uDir * h);
  float tw = .5 + .5 * sin(aB.y + uTime * (1.5 + aB.z * 4.)); tw *= tw; tw *= tw; tw *= tw;
  vI = (.2 + 2.2 * tw) * smoothstep(.5, .56, tt) * (1. - smoothstep(1.1, 1.2, tt)) * smoothstep(7., 10., dc) * mix(.35, 1., sE.y) * uRise * uRise;
  vec4 mv = modelViewMatrix * vec4(c, 1.);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp(aB.x * le / max(-mv.z * uPix, 1e-4), 1.5, 3.5);
}`,_e=`
uniform vec3 uSunCol; varying float vI;
void main(){ vec2 d = gl_PointCoord - .5; float r = 1. - smoothstep(.1, .5, length(d)); gl_FragColor = vec4(uSunCol * vI * r, 1.); }`,Ne=`
attribute vec4 aS;   // s0, lateral a, lateral b, size
uniform float uTime, uPix; uniform vec3 uMoonP, uEnd;
varying float vI;
void main(){
  float s = fract(aS.x + uTime * .03);
  vec3 a = uEnd, b = uMoonP + vec3(-70., 62., -30.), m = vec3(mix(a.x, b.x, .35), 46., mix(a.z, b.z, .6));
  vec3 c = mix(mix(a, m, s), mix(m, b, s), s);
  float wd = mix(34., 5., s);
  c += vec3(aS.y, aS.z * .35, aS.z) * wd + vec3(0., sin(s * 9. + aS.y * 5. + uTime * .3) * 5., 0.);
  float tw = .6 + .4 * sin(aS.y * 40. + uTime * 2.3);
  vI = smoothstep(0., .08, s) * (1. - smoothstep(.9, 1., s)) * tw * (.5 + .7 * s);
  vec4 mv = modelViewMatrix * vec4(c, 1.);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp(aS.w / max(-mv.z * uPix, 1e-4), 1.5, 4.);
}`,De=`
uniform vec3 uSunCol, uFrost; varying float vI;
void main(){ vec2 d = gl_PointCoord - .5; float r = 1. - smoothstep(.05, .5, length(d)); gl_FragColor = vec4(uSunCol * uFrost * vI * r * .4, 1.); }`;function Ie(c,n,r){const V=Math.sin(c*127.1+n*311.7+r*74.7)*43758.5453;return V-Math.floor(V)}function Ge(c,n,r,V,U){const S=c===0?new e.OctahedronGeometry(1,0):new e.IcosahedronGeometry(1,c===1?0:1),x=S.attributes.position,g=new e.Vector3,z=[n.range(1.1,1.35),n.range(.55,.75),n.range(.8,1)],v=[];for(let p=0;p<(c===2?5:c===1?2:0);p++)v.push({n:new e.Vector3(n.gauss(),n.gauss(),n.gauss()).normalize(),d:n.range(.45,.72)});const T=n.range(0,50);for(let p=0;p<x.count;p++){g.fromBufferAttribute(x,p);const w=[Math.round(g.x*100),Math.round(g.y*100),Math.round(g.z*100)],P=.72+.5*Ie(w[0]+T,w[1],w[2]);g.multiplyScalar(P);for(const f of v){const E=g.dot(f.n)-f.d;E>0&&g.addScaledVector(f.n,-E*.92)}x.setXYZ(p,g.x*z[0],g.y*z[1],g.z*z[2])}S.deleteAttribute("uv"),S.computeVertexNormals();const C=new Float32Array(x.count*3),M=new e.Color;for(let p=0;p<x.count/3;p++){const w=n.range(.5,.78),P=n();M.copy(r).lerp(P<.25?V:U,P<.25?.3:n.range(0,.25)).multiplyScalar(w);for(let f=0;f<3;f++)C.set([M.r,M.g,M.b],(p*3+f)*3)}return S.setAttribute("color",new e.BufferAttribute(C,3)),S}async function Ue(c,n,r,V,U,S){let x=new e.IcosahedronGeometry(1,13);await S(),x.deleteAttribute("uv"),x.deleteAttribute("normal"),x=ze(x,1e-4),await S();const g=x.attributes.position,z=g.count,v=new e.Vector3,T=c==="walnut"?[104,86,96]:[120,80,72],C=[];for(let f=0;f<16;f++)C.push({d:new e.Vector3(n.gauss(),n.gauss(),n.gauss()).normalize(),r:f<3?n.range(.42,.6):n.range(.12,.3),depth:n.range(.5,1)});const M=new Float32Array(z*3),p=new e.Color,w=U.clone().multiplyScalar(.4).lerp(V,.25),P=n.range(0,40);for(let f=0;f<z;f++){(f&255)===255&&await S(),v.fromBufferAttribute(g,f).normalize();let E=1+.2*r.fbm3(v.x*1.2+P,v.y*1.2,v.z*1.2,4)+.035*r.fbm3(v.x*6+P,v.y*6,v.z*6,3),G=.5+.5*r.fbm3(v.x*3+9+P,v.y*3,v.z*3,3),_=0;if(c==="walnut"){const A=Math.exp(-(v.y*v.y)/.012);E+=.13*A,_+=A*.5}for(const A of C){const F=Math.acos(Math.max(-1,Math.min(1,v.dot(A.d))))/A.r;if(F<1)E-=A.r*.24*A.depth*(1-F*F),G-=.3*(1-F);else if(F<1.35){const d=1-(F-1)/.35;E+=A.r*.07*A.depth*d*d,_+=.5*d*d}}g.setXYZ(f,v.x*E*T[0],v.y*E*T[1],v.z*E*T[2]),p.copy(w).lerp(V,Math.max(0,Math.min(1,.25+.4*G+_))).multiplyScalar(.31),M[f*3]=p.r,M[f*3+1]=p.g,M[f*3+2]=p.b}return x.setAttribute("color",new e.BufferAttribute(M,3)),await S(),x.computeVertexNormals(),x}async function Re(c,n={}){const r=c.rng.fork?c.rng.fork("ring-run-hero"):c.rng,V=c.noise,U=(n.palette&&n.palette.length>=7?n.palette:ke).map(t=>new e.Color(t)),[S,x,g,z,v]=U,T=c.quality&&c.quality.detail||1,C=Math.max(.3,Math.min(1,n.density??1)),M=n.ring||r.pick(["ice","ice","rose","braid"]),p=n.moon===!1?null:n.moon||r.pick(["potato","potato","walnut","pair"]),w=Math.max(3,Math.min(7,n.waves??r.int(6,7))),P=r.range(.73,.79),f=r.range(.95,1.06),E=r.range(1.85,2.2),G=z.clone();M==="rose"&&G.lerp(new e.Color("#c9a8a0"),.45);const _=e.MathUtils.degToRad(n.sunElevation??14),A=n.sunDir?new e.Vector3().fromArray(n.sunDir).normalize():new e.Vector3(-.9*Math.cos(_),Math.sin(_),.44*Math.cos(_)).normalize(),F=n.planetDir?new e.Vector3().fromArray(n.planetDir).normalize():new e.Vector3(.8,.16,-.58).normalize(),d=[];{let t=0,o=350,a=1;for(let s=0;s<7;s++){d.push(new e.Vector3(t,o,a*(s>0?.8:1)));const u=o*P;t+=o+u,o=u,a*=P}}const Q=d[w-1],ee=-640,X=Q.x+Q.y+80,ve=t=>{let o=0,a=0,s=0;for(let u=0;u<w;u++){const i=d[u],m=Math.abs(t-i.x)/i.y,h=Math.min(m,1);o=Math.max(o,1-h*h);const l=1/(m*m*m*m+.02);a+=i.z*l,s+=l}return[a/s,o]},pe=[[-900,0],[-700,0],[-560,3],[-460,16],[-360,52],[-260,112],[-170,182],[-100,236],[-40,262],[10,260],[48,250],[78,232],[96,206],[100,182],[92,166]],he=[[330,0],[250,8],[170,28],[90,62],[20,105],[-40,150],[-78,196],[-86,226],[-79,250],[-69,267]],te=(t,o)=>new e.CatmullRomCurve3(t.map(([a,s])=>new e.Vector3(o&&a>-40?-40+(a+40)*E:a,s*f,0)),!1,"centripetal"),de=te(pe,!0),ge=te(he,!1),oe=[],j=new e.Vector3;for(let t=0;t<2;t++)for(let o=0;o<I;o++){const a=o/(I-1),s=t===0?a+.2*Math.sin(Math.PI*a):a+.1*Math.sin(Math.PI*a);(t===0?de:ge).getPointAt(Math.min(1,s),j),oe.push(new e.Vector2(j.x,j.y))}const xe=2,ae=e.MathUtils.degToRad(35),H=new e.Vector3(0,Math.sin(ae),-Math.cos(ae)),R=new e.Vector3(0,230*f,-30),re=t=>R.clone().addScaledVector(H,-t),O=re(300),we=[new e.Vector3(0,40,930),new e.Vector3(0,40,640),new e.Vector3(0,40,O.z+210),new e.Vector3(0,(40+O.y)*.5-4,O.z+86),O,re(150),R.clone()],se=new e.Vector3(-420,-78,630),ne=new e.Vector3(520,-78,630),ye=z.clone().multiplyScalar(2),k={uProf:{value:oe},uWave:{value:d},uNW:{value:w},uRise:{value:1},uLipT:{value:xe},uTime:{value:0},uPix:{value:.0015},uCamL:{value:new e.Vector3(0,200,1e3)},uSun:{value:A},uPlanet:{value:F},uSunCol:{value:ye},uShineCol:{value:S.clone().multiplyScalar(.42)},uAmb:{value:v.clone().multiplyScalar(.025)},uFrost:{value:G.clone().multiplyScalar(.66)},uCream:{value:g.clone()},uBlue:{value:v.clone()},uSeat:{value:R},uDir:{value:H},uBraid:{value:M==="braid"?1:0},uH:{value:262*f},uX0:{value:ee},uX1:{value:X},uMoonP:{value:new e.Vector3},uEnd:{value:new e.Vector3}},$=()=>e.UniformsUtils.clone(e.UniformsLib.fog),q=new e.Group;q.name="ring-run-hero";{const t=[];let o=ee;for(;o<X;){t.push(o);const b=ve(o)[0];o+=20*Math.max(.3,Math.pow(b,.7))}t.push(X);const a=[36,22],s=t.length,u=[],i=[];let m=0;for(let b=0;b<2;b++){for(let N=0;N<a[b];N++)for(let D=0;D<s;D++)u.push(t[D],N/(a[b]-1),b);for(let N=0;N<a[b]-1;N++)for(let D=0;D<s-1;D++){const Z=m+N*s+D,me=Z+1,Y=Z+s,Ee=Y+1;i.push(Z,Y,me,me,Y,Ee)}m+=a[b]*s}const h=new e.BufferGeometry;h.setAttribute("position",new e.Float32BufferAttribute(u,3)),h.setIndex(i),h.boundingSphere=new e.Sphere(new e.Vector3(900,100,-200),2400);const l=new e.ShaderMaterial({uniforms:Object.assign($(),k),vertexShader:Te,fragmentShader:Fe,side:e.DoubleSide,fog:!0}),B=new e.Mesh(h,l);B.frustumCulled=!1,B.name="sheet",q.add(B)}await c.yield?.(),await c.yield?.();const be=new e.ShaderMaterial({uniforms:Object.assign($(),k),vertexShader:Ve,fragmentShader:fe,fog:!0}),Se=d.slice(0,w).reduce((t,o)=>t+Math.pow(o.y,.75),0),le=t=>{if(!t&&r()<.07)return r.range(-620,-350);let o=r()*(t?Math.pow(d[0].y,.75)+Math.pow(d[1].y,.75):Se),a=0;for(;a<w-1&&o>Math.pow(d[a].y,.75);)o-=Math.pow(d[a].y,.75),a++;return d[a].x+d[a].y*r.range(-1,1)},Me=[{kind:0,n:Math.round(3900*C*T),nc:0,rmin:.45,rmax:1.7,alpha:2.2,thick:6},{kind:1,n:Math.round(2600*C*Math.max(.8,T)),nc:Math.round(1100*Math.max(.7,C)),rmin:1.5,rmax:5.5,alpha:2,thick:5},{kind:2,n:Math.round(220*Math.max(.6,C)),nc:Math.round(300*Math.max(.7,C)),rmin:8,rmax:20,alpha:2.2,thick:2.5}],y=r.fork?r.fork("crest"):r;for(const t of Me){const o=Ge(t.kind,r,G,v,g),a=new e.InstancedBufferGeometry;a.setAttribute("position",o.attributes.position),a.setAttribute("normal",o.attributes.normal),a.setAttribute("color",o.attributes.color);const s=t.n+t.nc,u=new Float32Array(s*4),i=new Float32Array(s*4),m=new Float32Array(s*3);for(let l=t.n;l<s;l++){(l&511)===511&&await c.yield?.();const B=y()<.45?0:Math.min(w-1,Math.floor(y()*y()*w)),b=d[B];u[l*4]=b.x+b.y*(y()+y()-1)*.96,u[l*4+1]=y(),u[l*4+2]=.5+Math.abs(y.gauss())*3.5,u[l*4+3]=1/26*y.range(.8,1.25),i[l*4]=t.kind===2?y.range(6,12.5):Math.min(7,2.6*Math.pow(1-y()*.97,-1/2.2)),i[l*4+1]=y.range(0,6.283),i[l*4+2]=2,i[l*4+3]=y()<.5?y.range(.6,1.6):.1,m[l*3]=y.gauss(),m[l*3+1]=y.gauss(),m[l*3+2]=y.gauss()}for(let l=0;l<t.n;l++){(l&1023)===1023&&await c.yield?.();const B=t.kind===2,b=r()<(B?.5:.56)?0:1;u[l*4]=le(B),u[l*4+1]=B?b===0?r.range(.04,.52):r.range(.03,.5):r(),u[l*4+2]=r.gauss()*t.thick,u[l*4+3]=B?r.range(8e-4,.002):1/46*r.range(.8,1.25),i[l*4]=Math.min(t.rmax,t.rmin*Math.pow(1-r()*.985,-1/t.alpha)),i[l*4+1]=r.range(0,6.283),i[l*4+2]=b,i[l*4+3]=r()<.35?r.range(.6,1.6):.1,m[l*3]=r.gauss(),m[l*3+1]=r.gauss(),m[l*3+2]=r.gauss()}a.setAttribute("aA",new e.InstancedBufferAttribute(u,4)),a.setAttribute("aB",new e.InstancedBufferAttribute(i,4)),a.setAttribute("aAxis",new e.InstancedBufferAttribute(m,3)),a.instanceCount=s;const h=new e.Mesh(a,be);h.frustumCulled=!1,h.name="stones"+t.kind,h.userData.full=s,q.add(h),await c.yield?.()}const ie=(t,o)=>new e.ShaderMaterial({uniforms:k,vertexShader:t,fragmentShader:o,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,fog:!1});{const t=Math.round(3600*T),o=new Float32Array(t*4),a=new Float32Array(t*4);for(let i=0;i<t;i++)o[i*4]=le(r()<.6),o[i*4+1]=r(),o[i*4+2]=r.gauss()*9,o[i*4+3]=1/32*r.range(.7,1.3),a[i*4]=r.range(.6,1.6),a[i*4+1]=r.range(0,6.283),a[i*4+2]=r(),a[i*4+3]=0;const s=new e.BufferGeometry;s.setAttribute("position",new e.BufferAttribute(new Float32Array(t*3),3)),s.setAttribute("aA",new e.BufferAttribute(o,4)),s.setAttribute("aB",new e.BufferAttribute(a,4));const u=new e.Points(s,ie(Le,_e));u.frustumCulled=!1,u.name="sparkle",q.add(u)}await c.yield?.();const L=new e.Group;L.name="moon",q.add(L);const K=[];if(p){const t=await Ue(p,r,V,z,x,async()=>{await c.yield?.()}),o=p==="pair"?2:1;for(let m=0;m<o;m++){const h=new e.Mesh(t,new e.ShaderMaterial({uniforms:Object.assign($(),k,{uToHero:{value:new e.Matrix4}}),vertexShader:qe,fragmentShader:fe,fog:!0}));h.userData.spin=r.range(.03,.06)*r.sign(),h.userData.tilt=r.range(-.4,.4),o===2&&h.scale.setScalar(m===0?.62:.5),h.frustumCulled=!1,L.add(h),K.push(h)}await c.yield?.();const a=900,s=new Float32Array(a*4);for(let m=0;m<a;m++)s[m*4]=r(),s[m*4+1]=r.gauss()*.4,s[m*4+2]=r.gauss()*.4,s[m*4+3]=r.range(1.5,5);const u=new e.BufferGeometry;u.setAttribute("position",new e.BufferAttribute(new Float32Array(a*3),3)),u.setAttribute("aS",new e.BufferAttribute(s,4));const i=new e.Points(u,ie(Ne,De));i.frustumCulled=!1,i.name="streamer",q.add(i)}let ce=.38;const Ae=new e.Vector2,Ce=new e.Vector3,ue=t=>{L.position.lerpVectors(se,ne,ce),K.forEach((o,a)=>{if(K.length===2){const s=t*.12+a*Math.PI;o.position.set(Math.cos(s)*82,Math.sin(s*.5)*10,Math.sin(s)*46)}o.rotation.set(o.userData.tilt,t*o.userData.spin+a*2,o.userData.tilt*.5),o.updateMatrix(),L.updateMatrix(),o.material.uniforms.uToHero.value.multiplyMatrices(L.matrix,o.matrix)}),k.uMoonP.value.copy(L.position),k.uEnd.value.set(L.position.x-340,5,336)};ue(0);const Pe=d.slice(0,w).map(t=>({x:t.x,height:262*f*t.z,scale:t.z})),W=(t,o)=>({position:new e.Vector3(...t),target:new e.Vector3(...o)});return{object:q,radius:460,height:340,center:new e.Vector3(40,120,-30),ground:!1,groundY:0,moon:L,uniforms:k,anchors:{portalSeat:{position:R.clone(),normal:H.clone().negate(),facing:H.clone().negate(),pitchDeg:35,radius:7},flyThrough:we,approachDir:H.clone(),gap:{nearZ:930,farZ:330,y:0},moonTrack:{from:se.clone(),to:ne.clone()},crests:Pe,sunDir:A.clone(),planetDir:F.clone(),viewpoints:{gapReveal:W([0,40,930],[160,110,0]),underCurl:W([0,120,128],[0,230*f,-30]),alongCrest:W([-470,215,150],[200,190,-10]),behind:W([-250,150,-820],[100,150,0])}},setProgress(t){ce=Math.max(0,Math.min(1,t))},update(t,o,a){if(k.uTime.value=o,a){q.updateWorldMatrix(!0,!1),k.uCamL.value.copy(q.worldToLocal(Ce.setFromMatrixPosition(a.matrixWorld)));let s=1080;c.renderer&&c.renderer.getDrawingBufferSize&&(s=c.renderer.getDrawingBufferSize(Ae).y||1080),k.uPix.value=2/(Math.max(.1,a.projectionMatrix.elements[5])*s)}ue(o)},dispose(){}}}export{Re as buildHero};
