import*as y from"three";import{lerp as Be,clamp as pe,smoothstep as me}from"../kit/core.js";const $t=["#141A3C","#2B3FA8","#5B3C9E","#1F8F78","#E0607E","#F28A2E","#FFF4C2"],ea=0,ve=1,O=2,N=3,Le=4,lt=5,$=6,ct=7,P=8,E=9,T=10,Rt=11,Bt=[P,T,P,T,$,E,Le,Rt,O,O,N,ct];function ta(s){const g=s.map(v=>new y.Color(v)),[t,d,L,C,j,W,k]=g,m=(v,w,V)=>v.clone().lerp(w,V);return[t,m(L,t,.3),d,L,C,m(d,k,.35),j,m(j,k,.45),W,m(W,k,.5),k,m(C,k,.45)].map(v=>new y.Vector3(v.r,v.g,v.b).multiplyScalar(.8))}function Ke(s,g){return s>.88?g<.42?T:E:s>.78?g<.65?P:E:s>.66?g<.6?$:P:s>.5?g<.55?N:g<.92?O:$:s>.2?g<.35?ve:g<.85?O:N:s>.1?g<.5?N:g<.74?$:O:g<.6?ve:O}const Lt=`
uniform float uTime, uPxScale, uStar, uFront, uManner, uPrimeK, uStorm, uReveal;
uniform vec2 uRes;
uniform vec3 uStarPos, uAxis, uE1, uE2, uL;
uniform vec3 uPig[12];
float pickPig(float l, float h){
  if (l > .88) return h < .42 ? 10. : 9.;
  if (l > .78) return h < .65 ? 8. : 9.;
  if (l > .66) return h < .6 ? 6. : 8.;
  if (l > .5) return h < .55 ? 3. : h < .92 ? 2. : 6.;
  if (l > .2) return h < .35 ? 1. : h < .85 ? 2. : 3.;
  if (l > .1) return h < .5 ? 3. : h < .74 ? 6. : 2.;
  return h < .6 ? 1. : 2.;
}
// the new star's painted light: cool pigments near it (or inside the jets' light front) turn rose, then orange
float starWarm(vec3 p){
  vec3 rel = p - uStarPos; float al = dot(rel, uAxis); float pr = length(rel - uAxis * al);
  float w = uStar * (1. - smoothstep(90., 420., length(rel)));
  float j = (1. - smoothstep(25., 150., pr)) * step(abs(al), uFront * 900.) * step(0.001, uFront) * 0.85;
  return max(w, j);
}
// aerial perspective the painter's way: with distance more dabs are swapped (never blended) for ultramarine and its pale tint
float farPig(float pig, float dist, float h){
  float far = smoothstep(900., 4500., dist);
  if (h < far * .65) pig = pig > 4.5 ? 5. : 2.;
  return pig;
}
float warmPig(float pig, float w, float hh){
  if (pig < 5.5) { if (hh < w) pig = (hh < w * 0.6 && w > 0.55) ? 8. : 6.; }
  else if (pig < 7.5 && hh < w * 0.7) pig = 8.;
  return pig;
}
`,_t=`
uniform float uLandWarm, uLandDeep;
float deckPick(float T, float h, float air){
  float w = uLandWarm * (1. - .8 * air);   // (the warm dots are sparser far off)
  if (T < 1.) return h < .6 ? 0. : uLandDeep;
  if (T < 2.1) return h < .42 ? uLandDeep : h < .8 ? 2. : 3.;
  if (T < 2.85) return h < .56 ? 3. : 2.;
  if (T < 3.2) return h < .45 ? 5. : h < .75 ? 2. : 3.;   // (the edge: the pale beside the body, one hue in two values, as on the wall)
  float pu = .54 + .28 * air, ro = pu + .28 * (1. - .65 * air);   // (far off the lit slopes are the wall's own pale tier: pale ultramarine, a little rose)
  if (T < 4.1) return h < pu ? 5. : h < ro ? 6. : h < ro + .14 * w ? 8. : 7.;
  return h < .36 ? 7. : h < .64 ? 5. : h < .64 + .22 * w ? 9. : h < .64 + .36 * w ? 10. : 7.;
}
float deckAir(float t){ return t * t / (t * t + 1e8); }
float deckFarT(float T, float a){ return mix(T, 3.9, .95 * a); }
`,aa=`
${Lt}
${_t}
uniform float uPeel, uJet, uPush, uOvalX, uEmis;
uniform vec3 uCamVel, uWind, uTail;
attribute vec3 iPos; attribute vec4 iData; attribute vec4 iAux;
varying vec2 vUv; varying vec2 vQ; varying vec3 vCol; varying float vH; varying float vPx;
#include <fog_pars_vertex>
vec3 curl(vec3 p){ return vec3(sin(p.y * 1.7 + p.z * 1.3), sin(p.z * 1.9 + p.x * 1.1), sin(p.x * 1.5 + p.y * 2.1)); }
void main(){
  float size = iData.x, hsh = iData.y, pig = iData.z, rot = iData.w;
  float sc = 1., emis = 1., capK = 1., pull = 0., starK = 1.;
  vec2 vo = vec2(0.);
  float hh = fract(hsh * 17.31);
  vec3 p = iPos;
#if MODE == 0
  // surface crust: drift a little along the flow, each on its own slow phase
  if (iAux.w < 1.9) p += iAux.xyz * (sin(uTime * (0.3 + hh * 0.5) + hsh * 50.) * size * 0.3);
  if (iAux.w > 1.9) {
    // the star as the far view sees it: a loaded lemon disc with a ring of orange dabs and violet partners outside
    // them, laid facing the lens (iAux.xy), larger from across the nebula; inside 150 m the 6 m cluster takes over
    float sd = length(p - cameraPosition);
    starK = mix(1., 1.9, smoothstep(320., 900., sd));
    vo = iAux.xy * starK; capK = 3.4; pull = 40.;
    sc = starK * smoothstep(70., 150., sd) * mix(iAux.w > 2.5 ? .0 : .5, 1., uStar);
    if (iAux.w < 2.5) { pig = uStar > .5 ? pig : 8.; emis = 1.1 + .9 * uStar; }
    else emis = iAux.w < 3.5 ? 1. + .25 * uStar : 1.;
    sc *= 1. + .05 * sin(uTime * 1.1 + hsh * 40.);
  }
  else if (iAux.w > 0.) { pig = (uStar > hh * 0.8 + 0.1) ? 10. : 8.; emis = 1.1 + 0.6 * iAux.w * uStar * uEmis; }
  else if (iAux.w < -.5 && iAux.w > -1.5) {   // the beacon round the portal seat: a bright wave runs round the ring
    float bw = sin(uTime * 1.3 - rot * 2.);
    emis = 1.3 + .2 * bw; sc = 1. + .1 * bw;
  }
  else if (iAux.w < -3.5) {                    // the beacon's far generation: a few loaded lemon dabs that hold from across the nebula
    emis = 1.3 + .16 * sin(uTime * 1.3 - rot * 2.);
    sc = smoothstep(300., 520., length(p - cameraPosition));
  }
  else if (iAux.w < -2.5) sc = smoothstep(680., 1100., length(p - cameraPosition));   // the egg's far contour gives way to the fine one
  else if (iAux.w < -.1 && iAux.w > -.4) {
    // a dab of the deck carries the tone of the place it lies on (fifty steps to a tier) and, where the place has a
    // light of its own (a burning rim near by, a bank of gas overhead), the pigment of that light; 15 = none. Its
    // pigment is picked here, by the deck's rule and the law of distance, as the far wall's shader picks its dots:
    // far off the place is paler and its own light sparser.
    float own = mod(pig, 16.), air = deckAir(length(p - cameraPosition));
    pig = deckPick(deckFarT(floor(pig / 16.) / 50., air), hh, air);
    if (pig < .5) pig = uLandDeep;                // (a dab is never the priming)
    if (own < 14.5 && fract(hsh * 71.3) > .7 * air) pig = own;
    // (a dab of a knot, its shadow or its streamer, iAux.w = -0.3: it would come to nothing between 8.4 and 8.9 km from
    // the eye, by the metres from the eye to the dab and nothing else; a guard so that the lens's far distance never
    // cuts a knot: the knots stand on the carpet, where none lies that far from an eye of the route)
    if (iAux.w < -.28) sc *= 1. - smoothstep(8400., 8900., length(p - cameraPosition));
  }
#elif MODE == 1
  // spray: looping flow paths off the rim and fingers
  float life = fract(uTime * iAux.w + hsh * 7.3);
  float len = length(iAux.xyz);
  p = iPos + iAux.xyz * life + curl(iPos * 0.013 + life * 2. + hsh * 6.) * len * 0.13 * life;
  sc = smoothstep(0., .12, life) * (1. - smoothstep(.6, 1., life));
  // while we look back at the globule, the spray between the lens and it parts: the egg is the figure, not the weather
  vec3 cd = uStarPos - cameraPosition; vec3 pd = p - cameraPosition;
  float cl = max(length(cd), 1.), pl = max(length(pd), 1e-3);
  sc *= 1. - uReveal * smoothstep(.5, .82, dot(cd, pd) / (cl * pl)) * (1. - smoothstep(.45, .7, pl / cl));
#elif MODE == 2
  // veil: peel time per dab; loopers (iAux.y) shed for ever
  vec3 rn = iPos - uStarPos; vec3 n = rn / max(length(rn), 1e-3);
  float tl = clamp((uPeel * 1.95 - iAux.x) / 0.5, 0., 1.);   // all but the fringe along the lip lifts away
  float lp = fract(uTime * 0.06 + hsh * 9.);
  float loopOn = step(0.5, iAux.y);
  tl = mix(tl, lp, loopOn);
  p += n * (sin(uTime * 1.3 + hsh * 60.) * 2.5 + 46. * tl) + uWind * (tl * tl * 470.)
     + curl(iPos * 0.012 + uTime * 0.1) * 30. * tl;
  // a lifted dab thins as it goes, so the peel is a clean edge travelling outward and not a cloud across the mouth
  sc = (1. - smoothstep(.3, .9, tl)) * mix(1., smoothstep(0., .08, lp), loopOn);
#elif MODE == 3
  // disc: Keplerian orbits, inner rings faster; iAux = (r, theta0, height, kind)
  float rr = iAux.x;
  float om = 0.7 * pow(45. / max(mix(rr, 80., step(0.5, iAux.w) * step(iAux.w, 1.5)), 22.), 1.5);
  float th = iAux.y + uTime * om;
  p = uStarPos + (uE1 * cos(th) + uE2 * sin(th)) * rr + uAxis * (iAux.z * (1. + 0.15 * sin(uTime * 0.7 + hsh * 30.)));
  sc = smoothstep(31., 38., length(p - uStarPos - uE1 * 80.));   // the rings part round the portal seat: a clean dark pool in the groove
  if (iAux.w > 1.5) sc *= smoothstep(300., 520., length(p - cameraPosition));   // the far generation resolves into the fine one
#elif MODE == 4
  // jets: iAux = (s0, angle, radial 0..1, sign)
  float s = mod(iAux.x + uTime * 260., 900.);
  float jl = uJet * 900.;
  float hd = jl - s;
  float capk = 1. - smoothstep(0., 50., hd);
  float R = mix(8., 40., s / 900.) * (1. + .5 * capk);     // a tapering cone, 8 m at the root and 40 m at the far end
  float knot = smoothstep(.7, 1., sin(s * 0.021 - uTime * 6.5 + iAux.w));
  float an = iAux.y + s * 0.012;
  p = uStarPos + uAxis * (iAux.w * (s + 5.)) + (uE1 * cos(an) + uE2 * sin(an)) * (R * iAux.z * (1. + 0.5 * knot));
  // a stroke of gold and orange with a lemon core and lemon knots, violet beside it; it leaves the star as a thread
  sc = step(0., hd) * (1. - smoothstep(850., 900., s)) * smoothstep(0., 70., s) * (1. + 0.7 * capk + 1.6 * knot) * mix(.85, 1.5, s / 900.);
  if (rot > 50.) sc *= smoothstep(260., 520., length(p - cameraPosition));   // the far generation gives way to the fine one
  // orange, lemon and gold beside ultramarine and violet all the way out: a lemon core, lemon knots, a violet cap
  if (hd < 34. && hh < .55) pig = 3.;                       // the blunt cap is tipped with violet
  else if (pig < 7.5 && iAux.z < .35 && hd > 60.) pig = 9.; // the core is all warm; the cool dabs lie in the sheath beside the orange
  else if (pig < 7.5 && s < 160.) pig = hh < .55 ? 8. : 9.; // the root is all fire, so the star's disc stands clear of it
  else if (pig > 7.5 && ((knot > 0.5 && iAux.z < .62) || iAux.z < .24)) pig = 10.;
  else if (pig > 9.5) pig = hh < .6 ? 8. : 9.;              // lemon is kept for the core and the knots
  emis = pig > 7.5 ? 0.95 + 0.36 * uEmis * knot : 1.;
#elif MODE == 5
  // tadpoles: iPos = centre, iAux.xyz = (along tail, lateral, lateral), w = phase
  float fr = fract(uTime * 0.011 + iAux.w);
  vec3 b1 = normalize(cross(uTail, vec3(0., 1., 0.))); vec3 b2 = cross(uTail, b1);
  float wag = sin(uTime * 1.9 - iAux.x * 0.3 + iAux.w * 40.) * iAux.x * 0.14;
  p = iPos + uTail * ((fr - 0.5) * 150. + iAux.x) + b1 * (iAux.y + wag) + b2 * iAux.z;
  sc = smoothstep(0., .1, fr) * (1. - smoothstep(.9, 1., fr));
#elif MODE == 6
  // a box of dabs wrapped round the camera, drifting on the gas flow; thinned into loose banks
  float bx = iAux.x;
  vec3 w0 = iPos * bx + iAux.yzw * uTime;
  p = cameraPosition + (fract((w0 - cameraPosition) / bx + 0.5) - 0.5) * bx;
  p += curl(p * (3.0 / bx) + uTime * 0.05 + hsh * 6.) * size * 1.5;
  float bank = sin(p.x * 5.1 / bx + 1.3) * sin(p.y * 4.3 / bx + hsh) * sin(p.z * 4.7 / bx + 2.1);
  sc = smoothstep(0.0, 0.3, bank + (hh - 0.5) * 0.4) * step(fract(hsh * 43.7), uStorm) * smoothstep(250., 400., length(p - uStarPos))
     * (1. - smoothstep(0.36, 0.5, length(p - cameraPosition) / bx));
  // the storm parts in front of the globule while we round the tip, so the egg reads as one dark mass
  vec3 cd = uStarPos - cameraPosition; vec3 pd = p - cameraPosition;
  float ca = dot(cd, pd) / (max(length(cd), 1.) * max(length(pd), 1e-3));
  sc *= 1. - uReveal * smoothstep(.5, .82, ca);
#endif
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  mv.xyz *= 1. - min(.3, pull / max(length(mv.xyz), 1.));
  mv.xy += vo;
  float dist = max(length(mv.xyz), 0.01);
#if MODE != 4
  float wm = starWarm(p);
#if MODE == 3
  wm *= .8;                                   // the disc keeps some ultramarine beside the orange
#endif
#if MODE == 0
  if ((iAux.w < -.5 && iAux.w > -1.5) || iAux.w < -3.5 || iAux.w > 1.9) wm = 0.;   // the beacon keeps its lemon and violet beside the star
  if (iAux.w < -1.5) wm *= .16;               // the egg's shell stays a dark mass round the lit hollow: the star only pricks it with rose
#endif
  pig = warmPig(pig, wm, hh);
#if MODE == 0
  // (a dab of the deck, iAux.w = -0.25 or -0.3, keeps the tier of tone it was laid in: the deck cools with distance by its tone)
  if (emis < 1.05 && !(iAux.w < -.1 && iAux.w > -.4)) pig = farPig(pig, dist, fract(hsh * 71.3));
#elif MODE != 3
  if (emis < 1.05) pig = farPig(pig, dist, fract(hsh * 71.3));
#endif
#endif
  vec3 col = uPig[int(pig + 0.5)];
  float breathe = 1. + 0.08 * sin(uTime * (0.4 + hh) + hsh * 90.);

  float px = size * sc * uPxScale / dist;
  float sFar = smoothstep(1.8, 4.2, px);
#if MODE == 0 || MODE == 1
  float capPx = uRes.y * 0.055;               // crust and spray never swell into petals: the next, finer generation takes over
#elif MODE == 4
  float capPx = uRes.y * 0.065;
#else
  float capPx = uRes.y * 0.07;                // nothing swells past 7 % of the frame's height: it parts instead
#endif
  capPx *= capK;
  float sNear = 1. - smoothstep(capPx * 0.85, capPx * 1.5, px);
  vec2 ax = mv.xy; float axl = max(length(ax), 1e-3);
  mv.xy += ax / axl * (1. - sNear) * size * 1.2;
  float r = 0.5 * size * sc * sFar * sNear;
  mv.xyz *= 1. - min(0.5, uPush * size / dist);
  float Z = max(-mv.z, 0.01);
  vec2 m = (-uCamVel.xy - mv.xy * uCamVel.z / Z) / Z;
  float ml = length(m);
  float st = 1. + min(0.8, ml * 1.2);
  vec2 dir = vec2(cos(rot), sin(rot));
  if (ml > 0.25) dir = m / ml;
#if MODE == 0
  // a dab that lies on a form is a stroke laid along its row on the surface (iAux.xyz, a direction fixed in the world:
  // a ring round a pillar, a band round the egg), and a stroke seen end on is as short as it looks
  else if (iAux.w < .5 && (iAux.w > -.1 || (iAux.w < -1.5 && iAux.w > -2.5))) {
    vec2 sd = (viewMatrix * vec4(iAux.xyz, 0.)).xy; float sl = length(sd);
    if (sl > .08) { dir = sd / sl; st *= .62 + .38 * min(sl, 1.); }
  }
#endif
#if MODE == 3
  // every dab of the disc is a stroke laid along its orbit, so the rings read as rings from any distance
  vec2 td = (viewMatrix * vec4(uE2 * cos(th) - uE1 * sin(th), 0.)).xy;
  float tdl = length(td);
  if (tdl > .08) dir = td / tdl;
#endif
#if MODE == 4
  vec2 jd = (viewMatrix * vec4(uAxis, 0.)).xy;   // every dab of a jet is a stroke laid along the jet
  float jdl = length(jd);
  if (jdl > .08) { dir = jd / jdl; st = max(st, 1.45); }
#endif
  vec2 q = position.xy;
  vec2 off = dir * (q.x * min(st * uOvalX, 2.2)) + vec2(-dir.y, dir.x) * q.y;   // a stroke, never a streak
  mv.xy += off * r;
  vUv = q; vQ = off; vCol = col * breathe * emis; vH = hsh;
  vPx = 2. * r * uPxScale / Z;                // the dab's width on screen, for the depth of its impasto
  gl_Position = projectionMatrix * mv;
  vec4 mvPosition = mv;
  #include <fog_vertex>
}`,oa=`
uniform float uManner;
varying vec2 vUv; varying vec2 vQ; varying vec3 vCol; varying float vH; varying float vPx;
#include <fog_pars_fragment>
void main(){
  float d = length(vUv);
  if (uManner > 1.5) {
    // a round-headed stroke, gently bent: the head (left) a little wider than the tail, both ends blunt
    vec2 c = vUv; c.y += 0.26 * c.x * c.x - 0.1;
    float wy = mix(1.3, 1.85, smoothstep(-.5, .9, c.x));
    d = length(vec2(max(abs(c.x) - .34, 0.) / .66, c.y * wy));
  }
  else if (uManner > 0.5) { vec2 a = abs(vUv); d = max(a.x, a.y) * 1.36 + 0.05 * a.x * a.y; }
  float edge = 0.9 + 0.09 * sin(vUv.x * 9. + vH * 31.) * sin(vUv.y * 11. + vH * 17.);
  if (d > edge) discard;
  // impasto, deeper the larger the dab stands on screen: a light ridge where the paint piled up toward the studio
  // light (upper left), a dark lip on the lower right, and the furrows the bristles left along the stroke.
  // Three flat tones of the one pigment, not a gradient: paint, not a lit sphere.
  float big = smoothstep(10., 40., vPx);
  float amp = mix(.06, .2, big);
  vec2 qn = vQ / max(length(vQ), 1e-4);
  float side = dot(qn, vec2(-0.707, 0.707));
  float dn = d / edge;
  float ridge = smoothstep(.42, .8, dn) * side;
  float nb = 5. + floor(vH * 2.99);                                   // five to seven furrows
  float fur = sin(vUv.y * nb * 3.4 + vH * 40. + .9 * sin(vUv.x * 2.6 + vH * 9.));
  fur *= (.55 + .45 * sin(vUv.x * 1.7 + vH * 23.)) * (1. - .6 * smoothstep(.55, .95, dn));
  float v = ridge * 1.25 + fur * (.3 + .4 * big);
  float tone = v > .42 ? 1. : v < -.42 ? -1. : 0.;
  tone = mix(v, tone, .75);
  vec3 col = vCol;
  vec3 hi = max(col, mix(col * 1.1, vec3(.84, .8, .7), .62 * amp));   // toward the pale tint beside it, never past it
  vec3 lo = col * (1. - 1.5 * amp);
  col = tone > 0. ? mix(col, hi, tone) : mix(col, lo, -tone);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,na=`
varying vec3 vP; varying vec3 vN; varying vec2 vUv; varying float vDist;
#include <fog_pars_vertex>
void main(){
  vP = position; vN = normal; vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  vDist = length(mvPosition.xyz);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ia=`
${Lt}
uniform vec3 uGapR, uGapW;
varying vec3 vP; varying vec3 vN; varying vec2 vUv; varying float vDist;
#include <fog_pars_fragment>
float gBowl = 0.;   // how far the star's light has taken the inside of the egg (set in main)
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
// g in cell units; returns (hash, hash2, mask)
vec3 dotCell(vec2 g, float wrapN, float rad, float seed){
  float row = floor(g.y); g.x += 0.5 * mod(row, 2.);
  vec2 id = floor(g); vec2 f = fract(g) - 0.5;
  id.x = mod(id.x, wrapN);
  float h = h21(id + seed), h2 = h21(id + seed + 17.3);
  vec2 j = (vec2(h, h2) - .5) * .42;
  vec2 fj = f - j; float dl = uManner > 0.5 && uManner < 1.5 ? max(abs(fj.x), abs(fj.y)) * 1.12 : length(fj);
  if (dl < rad * (0.84 + 0.4 * h2)) return vec3(h, h2, 1.);
  // second grid in the interstices: smaller dabs, so the priming only pricks through
  vec2 gg = g + 0.5; vec2 id2 = floor(gg); vec2 f2 = fract(gg) - 0.5; id2.x = mod(id2.x, wrapN);
  float k = h21(id2 + seed + 71.), k2 = h21(id2 + seed + 33.);
  return vec3(k, k2, step(length(f2), rad * 0.7 * (0.8 + 0.4 * k2)));
}
float discPick(float r, float h){
  vec3 g = step(abs(vec3(r) - uGapR), uGapW * 0.5);
  if (g.x + g.y + g.z > 0.5) return h < .4 ? 1. : h < .75 ? 2. : 3.;
  if (r < 26.) return h < .5 ? 10. : h < .8 ? 9. : 8.;
  if (mod(floor(r / 13.), 2.) < .5) return h < .5 ? 8. : h < .7 ? 9. : h < .9 ? 2. : 10.;
  return h < .5 ? 2. : h < .72 ? 5. : h < .9 ? 8. : 3.;
}
vec3 shadeCell(vec3 c, float l, float warm, float r){
#if HMODE == 1
  float pig = discPick(r, c.x);
  float e = pig > 7.5 ? 1. + 0.2 * uStar * (1. - smoothstep(20., 120., r)) : 1.;
  return uPig[int(pig + .5)] * (0.88 + 0.2 * c.y) * e;
#else
  float pig = pickPig(l + (c.y - 0.5) * 0.14, c.x);   // (a dot strays at most into the band next to its own)
  pig = warmPig(pig, warm, fract(c.x * 17.31));
  float hb = fract(c.x * 29.7 + c.y * 5.3);
  if (hb < gBowl) pig = hb < gBowl * .38 ? 8. : hb < gBowl * .46 ? 9. : 6.;
  pig = farPig(pig, vDist, fract(c.x * 71.3 + c.y * 3.1));
  return uPig[int(pig + .5)] * (0.86 + 0.22 * c.y);
#endif
}
void main(){
  vec3 N = normalize(vN);
  float l = dot(N, uL) * 0.5 + 0.44 + 0.06 * sin(vP.y * 0.02 + vP.x * 0.013);
  float warm = starWarm(vP);
  float r = 0.;
#if HMODE == 2
  vec3 gd = vP - uStarPos; gd /= max(length(gd), 1e-3);
  float rag = 0.09 * sin(gd.x * 9. + gd.y * 5.) * sin(gd.z * 8. - gd.y * 6.) + 0.04 * sin(gd.x * 23. + gd.z * 19.);
  if (dot(gd, uAxis) > 0.42 + rag) discard;
  // (the hollow is a solid banded bowl: rings round the jet axis, the deepest shade and the rose of the turn by turns, so that what the
  // lifting veil uncovers is a body and not a hole)
  if (!gl_FrontFacing) { l = 0.03 + 0.66 * step(0., sin(acos(clamp(dot(gd, uAxis), -1., 1.)) * 26.)); warm = 0.; gBowl = uStar * (.34 + .5 * (1. - smoothstep(-.75, .3, dot(gd, uAxis)))); }   // the hollow takes the star's light: rose, then orange in its depth
  else { l -= 0.17; warm *= 0.2; }             // a dark egg: only the lip of the opening burns
#endif
#if HMODE == 1
  float cw = 8. * vDist / max(uPxScale, 1.);    // finer on the disc, so its rings and gaps survive distance
#else
  float cw = 12. * vDist / max(uPxScale, 1.);
#endif
  float L = log2(max(cw, 0.3)); float i = floor(L); float f = L - i; float cA = exp2(i);
  float radA = 0.47 * (1. - smoothstep(.45, 1., f)), radB = 0.47 * smoothstep(0., .55, f);
#if HMODE == 1
  vec3 rel = vP - uStarPos; vec2 pl = vec2(dot(rel, uE1), dot(rel, uE2));
  r = length(pl); float th = atan(pl.y, pl.x + 1e-5);
  float cB = cA * 2.;
  float rbA = (floor(r / cA) + 0.5) * cA, rbB = (floor(r / cB) + 0.5) * cB;
  float nA = max(6., floor(6.2832 * rbA / cA)), nB = max(6., floor(6.2832 * rbB / cB));
  float omA = 0.7 * pow(45. / max(rbA, 22.), 1.5), omB = 0.7 * pow(45. / max(rbB, 22.), 1.5);
  vec2 gA = vec2(fract((th - uTime * omA) / 6.2832 + 2.) * nA, fract(r / cA));
  vec2 gB = vec2(fract((th - uTime * omB) / 6.2832 + 2.) * nB, fract(r / cB));
  vec3 a = dotCell(gA, nA, radA, floor(r / cA) * 7.1), b = dotCell(gB, nB, radB, floor(r / cB) * 3.3 + 40.);
#else
  vec3 a = dotCell(vUv / cA, 1e6, radA, 0.), b = dotCell(vUv / (cA * 2.) + 3.7, 1e6, radB, 40.);
#endif
#if HMODE == 1
  if (length(pl - vec2(80., 0.)) < 37.) r = uGapR.y;   // the dark pool round the portal seat is painted as the groove is
#endif
  vec3 col = uPig[0] * uPrimeK;
  if (b.z > 0.5) col = shadeCell(b, l, warm, r);
  if (a.z > 0.5) col = shadeCell(a, l, warm, r);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`;class ye{constructor(){this.n=0,this.cap=2048,this.pos=new Float32Array(this.cap*3),this.data=new Float32Array(this.cap*4),this.aux=new Float32Array(this.cap*4)}add(g,t,d,L,C,j,W,k=0,m=0,h=0,v=0){if(this.n===this.cap){this.cap*=2;const Fe=new Float32Array(this.cap*3),Pe=new Float32Array(this.cap*4),Se=new Float32Array(this.cap*4);Fe.set(this.pos),Pe.set(this.data),Se.set(this.aux),this.pos=Fe,this.data=Pe,this.aux=Se}const w=this.n++,V=w*3,U=w*4,se=this.pos,ae=this.data,oe=this.aux;se[V]=g,se[V+1]=t,se[V+2]=d,ae[U]=L,ae[U+1]=C,ae[U+2]=j,ae[U+3]=W,oe[U]=k,oe[U+1]=m,oe[U+2]=h,oe[U+3]=v}get count(){return this.n}}function _e(s,g,t,d,L){const C=new Float32Array((s+1)*(g+1)*3),j=new Float32Array((s+1)*(g+1)*2),W=[],k=new y.Vector3;let m=0,h=0;for(let w=0;w<=g;w++)for(let V=0;V<=s;V++)t(V/s,w/g,k),C[m++]=k.x,C[m++]=k.y,C[m++]=k.z,j[h++]=V/s*d,j[h++]=w/g*L;for(let w=0;w<g;w++)for(let V=0;V<s;V++){const U=w*(s+1)+V,se=U+1,ae=U+s+1,oe=ae+1;W.push(U,oe,se,U,ae,oe)}const v=new y.BufferGeometry;return v.setAttribute("position",new y.BufferAttribute(C,3)),v.setAttribute("uv",new y.BufferAttribute(j,2)),v.setIndex(W),v}function Qe(s){let g=0,t=0;for(const m of s)g+=m.attributes.position.count,t+=m.index.count;const d=new Float32Array(g*3),L=new Float32Array(g*2),C=new Uint32Array(t);let j=0,W=0;for(const m of s){d.set(m.attributes.position.array,j*3),L.set(m.attributes.uv.array,j*2);const h=m.index.array;for(let v=0;v<h.length;v++)C[W+v]=h[v]+j;j+=m.attributes.position.count,W+=h.length,m.dispose()}const k=new y.BufferGeometry;return k.setAttribute("position",new y.BufferAttribute(d,3)),k.setAttribute("uv",new y.BufferAttribute(L,2)),k.setIndex(new y.BufferAttribute(C,1)),k.computeVertexNormals(),k}const S=Math.PI*2;async function da(s,g={}){const t=s.rng.fork?s.rng.fork("nursery-hero"):s.rng,d=g.dabRng||(s.rng.fork?s.rng.fork("nursery-hero-dabs"):t),L=s.noise,C=s.quality&&s.quality.detail||1,j=pe(g.density??1,.4,1)*(C<1?.5+.5*C:1),W=g.palette&&g.palette.length>=7?g.palette:$t,k=ta(W),m=g.dabScale??t.range(.9,1.2),h=(e,a,o)=>new y.Vector3(e,a,o),v=h(-.75,.55,.35).normalize(),w=h(v.x,0,v.z).normalize(),V=1600,U=y.MathUtils.degToRad(t.range(10.5,13.5)),se=Math.tan(U)*V*.97,ae=t.range(30,90),oe=t.range(0,9),Fe=t.range(0,9),Pe=t.range(-40,40),Se=t.range(-40,40),xe=(e,a)=>a.set(-se*e+30*Math.sin(e*5+oe)*e,e*V,ae*e+24*Math.sin(e*4+Fe)*e),le=h(0,0,0),dt=(e,a)=>{let o=Be(250,178,e)*(1-.5*me(.78,1,e))*(1+.25*Math.pow(1-e,3));e>.9&&(o*=Math.sqrt(Math.max(0,1-Math.pow((e-.9)/.1,2))));const n=Math.cos(a),i=Math.sin(a);return o*(1+.26*L.fbm3(n*1.4+Pe,e*6+Se,i*1.4,3)+.07*L.n3(n*4+Se,e*22,i*4+Pe))},_=(e,a,o)=>{const n=e*S,i=dt(a,n);return xe(a,le),o.set(le.x+Math.cos(n)*i,le.y,le.z+Math.sin(n)*i*.8)},ke=xe(1,h(0,0,0)),J=h(t.range(250,268),t.range(272,292),t.range(242,258)),c=h(ke.x-5,V+78+J.y*.93,ke.z+2),Ze=t.range(-30,30),ht=e=>1+.07*L.fbm3(e.x*2+Ze,e.y*2,e.z*2-Ze,3),Ve=h(0,0,0),Ft=(e,a,o)=>{const n=e*S-.6,i=(a-.5)*Math.PI;Ve.set(Math.cos(n)*Math.cos(i),Math.sin(i),Math.sin(n)*Math.cos(i));const u=ht(Ve);return o.set(c.x+Ve.x*J.x*u,c.y+Ve.y*J.y*u,c.z+Ve.z*J.z*u)},ut=Math.atan2(.6,-.8)+t.range(-.18,.18),Je=y.MathUtils.degToRad(50),f=h(Math.cos(Je)*Math.cos(ut),Math.sin(Je),Math.cos(Je)*Math.sin(ut)).normalize(),F=h(0,0,0).crossVectors(f.clone().negate(),h(0,1,0)).normalize(),K=h(0,0,0).crossVectors(f,F).normalize();t.sign()<0&&K.negate();const ne=[{r:45+t.range(-3,3),width:t.range(8,11)},{r:80,width:22},{r:115+t.range(-4,4),width:t.range(9,13)}],ft=e=>ne.some(a=>Math.abs(e-a.r)<a.width*.5),Ct=(e,a)=>ft(e)?a<.55?ve:a<.85?O:ve:e<26?a<.5?T:a<.8?E:P:Math.floor(e/13)%2===0?a<.5?P:a<.7?E:a<.9?O:T:a<.5?O:a<.72?lt:a<.9?P:N,we=[],gt=e=>{const a=h(0,0,0).crossVectors(e,Math.abs(e.y)>.9?h(1,0,0):h(0,1,0)).normalize();return[a,h(0,0,0).crossVectors(a,e).normalize()]};{const e=xe(.93,h(0,0,0)),o=h(c.x,c.y-J.y*.9,c.z).clone().sub(e),n=o.length();o.normalize(),we.push({p0:e,D:o,len:n,bend:h(0,0,0),fr:gt(o),rad:x=>13+50*Math.pow(1-x,2.2)+34*Math.pow(x,5),neck:!0,seed:t.range(0,50)});const i=t.int(4,6),u=t.range(0,S);for(let x=0;x<i;x++){const Y=Math.atan2(w.z,w.x)+(x-(i-1)/2)*t.range(.85,1.15)+Math.sin(u+x)*.2,ie=t.range(.84,.91),H=h(0,0,0);xe(ie,H);const Oe=dt(ie,Y)*.62;H.x+=Math.cos(Y)*Oe,H.z+=Math.sin(Y)*Oe*.8;const Z=h(Math.cos(Y)*.42+w.x*.4,1,Math.sin(Y)*.42+w.z*.4).normalize(),We=t.range(34,52),Re=t.range(150,270)*(x===0||x===i-1?.75:1),rt=h(w.x,.15,w.z).multiplyScalar(t.range(15,45)),st=t.range(0,50);we.push({p0:H,D:Z,len:Re,bend:rt,fr:gt(Z),seed:st,rad:Ot=>(We*(1-.72*Math.pow(Ot,.8))+4)*Math.sqrt(Math.max(0,1-Math.pow(Ot,7)))})}}const Xe=(e,a,o,n)=>{const i=a*S,u=e.rad(o)*(1+.22*L.n3(Math.cos(i)*1.3+e.seed,o*5,Math.sin(i)*1.3)),x=Math.sin(Math.PI*o*.5)*o,Y=Math.cos(i)*u,ie=Math.sin(i)*u,H=e.len*o;return n.set(e.p0.x+e.D.x*H+e.bend.x*x+e.fr[0].x*Y+e.fr[1].x*ie,e.p0.y+e.D.y*H+e.bend.y*x+e.fr[0].y*Y+e.fr[1].y*ie,e.p0.z+e.D.z*H+e.bend.z*x+e.fr[0].z*Y+e.fr[1].z*ie)};await s.yield();const I={uTime:{value:0},uPxScale:{value:400},uRes:{value:new y.Vector2(800,450)},uStar:{value:0},uFront:{value:0},uPeel:{value:0},uJet:{value:0},uStarPos:{value:c.clone()},uAxis:{value:f.clone()},uE1:{value:F.clone()},uE2:{value:K.clone()},uL:{value:v.clone()},uPig:{value:k},uCamVel:{value:h(0,0,0)},uWind:{value:h(f.x*.55,f.y*.55+.25,f.z*.55+.75).normalize()},uTail:{value:v.clone().negate()},uOvalX:{value:g.manner===2?1.55:g.manner===1?1:t.range(1.2,1.4)},uEmis:{value:1.25},uStorm:{value:1},uReveal:{value:0},uManner:{value:g.manner??0},uPrimeK:{value:g.primeK??2.2},uLandWarm:{value:1},uLandDeep:{value:1},uGapR:{value:h(ne[0].r,ne[1].r,ne[2].r)},uGapW:{value:h(ne[0].width,ne[1].width,ne[2].width)}},jt=y.UniformsUtils.clone(y.UniformsLib.fog),pt=[],mt=e=>{const a={...jt,...e};for(const o in I)a[o]=I[o];return a},Ce=(e,a)=>{const o=new y.ShaderMaterial({uniforms:mt({}),vertexShader:na,fragmentShader:ia,defines:{HMODE:e},fog:!0,side:a});return pt.push(o),o},Ut=(e,a)=>{const o=new y.ShaderMaterial({uniforms:mt({uPush:{value:a}}),vertexShader:aa,fragmentShader:oa,defines:{MODE:e},fog:!0,side:y.DoubleSide});return pt.push(o),o},je=new y.Group;je.name="pointillist-nursery-hero";const vt=[_e(48,40,_,1280,1536)];we.forEach(e=>vt.push(_e(12,e.neck?12:9,(a,o,n)=>Xe(e,a,o,n),256,Math.max(64,Math.round(e.len/64)*64)))),await s.yield();const yt=Qe(vt),It=new y.Mesh(yt,Ce(0,y.DoubleSide));await s.yield();const xt=Qe([_e(44,26,Ft,1536,768)]),qt=new y.Mesh(xt,Ce(2,y.DoubleSide)),sa=h(0,0,0),Gt=Qe([_e(96,1,(e,a,o)=>{const n=e*S,i=Be(7,153,a);return o.copy(c).addScaledVector(F,Math.cos(n)*i).addScaledVector(K,Math.sin(n)*i).addScaledVector(f,-9)},1,1)]),Nt=new y.Mesh(Gt,Ce(1,y.DoubleSide));for(const e of[It,qt,Nt])e.frustumCulled=!1,je.add(e);await s.yield();const z=h(0,0,0),wt=h(0,0,0),bt=h(0,0,0),p=h(0,0,0),q=h(0,0,0),M=h(0,0,0),B=(e,a,o)=>{const i=Math.min(o,.996);e(a,i,z),e(a+.004,i,wt),e(a,i+.004,bt),q.subVectors(wt,z),M.subVectors(bt,z),p.crossVectors(M,q),p.lengthSq()<1e-10&&p.set(0,1,0),p.normalize(),q.normalize(),M.normalize()},ee=(e,a=t)=>L.n3(e.x*.004,e.y*.004,e.z*.004)*Math.PI+a.range(-.35,.35),b=e=>Math.round(e*j),A=new ye,Ye={add(){}},$e=(e,a,o,n,i,u,x,Y=0,ie=0)=>{const H=n.dot(v)*.5+.5+Y+(e()-.5)*.16,Oe=Ke(H,e()),Z=x*m;a.add(o.x+n.x*Z*.15,o.y+n.y*Z*.15,o.z+n.z*Z*.15,Z,e(),Oe,ee(o,e),u.x,u.y,u.z,ie);const We=e();if(We<(H>.76?.36:.07)){const Re=.6*Z*e.sign(),rt=e(),st=ee(o,e);(H>.76||We<.035)&&a.add(o.x+i.x*Re+n.x*Z*.2,o.y+i.y*Re+n.y*Z*.2,o.z+i.z*Re+n.z*Z*.2,Z*.55,rt,H>.76?Bt[Oe]:P,st,u.x,u.y,u.z,ie)}},Ee=(e,a,o,n,i,u,x)=>$e(t,A,e,a,o,n,i,u,x),Ue=(e,a,o,n,i,u,x)=>$e(d,A,e,a,o,n,i,u,x),et=(e,a,o,n,i,u)=>$e(t,Ye,e,a,o,n,i,u),X=(Math.atan2(w.z/.8,w.x)/S+1)%1;for(let e=0,a=b(2e3);e<a;e++)B(_,t(),t.range(.02,.99)),et(z,p,q,M,t.range(42,68)),(e&255)===255&&await s.yield();for(let e=0,a=b(17e3);e<a;e++){const o=e%2?t():X+t.gauss()*.13;B(_,(o+1)%1,Math.pow(t(),.6)*.99),et(z,p,q,M,t.range(8.5,15)),(e&255)===255&&await s.yield()}for(let e=0,a=b(2800);e<a;e++)B(_,(X-.06+t.gauss()*.07+1)%1,t.range(.06,.985)),et(z,p,q,M,e%2?t.range(40,60):t.range(22,36),.22),(e&255)===255&&await s.yield();await s.yield();const be=(e,a)=>(Math.floor(e*V/a)+.5)*a/V;for(let e=0,a=b(2e3);e<a;e++){const o=d();B(_,o,be(d.range(.02,.99),52)),Ue(z,p,M,q,d.range(42,68),0),(e&255)===255&&await s.yield()}await s.yield();for(let e=0,a=b(17e3);e<a;e++){const o=e%2?d():X+d.gauss()*.075;B(_,(o+1)%1,be(Math.pow(d(),.6)*.99,11)),Ue(z,p,M,q,d.range(8.5,15),0),(e&255)===255&&await s.yield()}await s.yield();for(let e=0,a=b(5200);e<a;e++)B(_,(X-.035+d.gauss()*.045+1)%1,be(d.range(.06,.985),30)),z.addScaledVector(p,16),Ue(z,p,M,q,e%2?d.range(36,54):d.range(20,32),.05),(e&255)===255&&await s.yield();await s.yield();const ce=h(0,0,0);for(let e=0,a=b(2e4);e<a;e++){const o=(X+t.gauss()*.055+1)%1,n=t.range(.47,.985);B(_,o,n),ce.copy(p),B(_,o,be(n,2.7)),Ee(z,ce,M,q,t.range(2,3.3),.05),(e&255)===255&&await s.yield()}for(let e=0,a=b(4e3);e<a;e++){const o=(X+t.gauss()*.013+1)%1,n=t.range(.55,.98);B(_,o,n),ce.copy(p),B(_,o,be(n,.75)),Ee(z,ce,M,q,t.range(.5,.9),.08),(e&255)===255&&await s.yield()}for(let e=0,a=b(6e3);e<a;e++)B(_,(X+d.gauss()*.16+2)%1,be(d.range(.55,.95),2.7)),Ue(z,p,M,q,d.range(2,3.2),0),(e&255)===255&&await s.yield();await s.yield();for(const e of we){const a=(o,n,i)=>Xe(e,o,n,i);for(let o=0,n=b(420);o<n;o++)B(a,t(),t.range(.03,.97)),Ee(z,p,q,M,t.range(7,12));await s.yield();for(let o=0,n=b(1e3);o<n;o++)B(a,t(),Math.pow(t(),.7)*.98),Ee(z,p,q,M,t.range(2,3.2)),(o&255)===255&&await s.yield();await s.yield()}await s.yield();const G=(e,a=t)=>{const o=a.range(-1,1),n=a.range(0,S),i=Math.sqrt(1-o*o);return e.set(Math.cos(n)*i,o,Math.sin(n)*i)},te=(e,a,o)=>{const n=ht(e)*a;return o.set(c.x+e.x*J.x*n,c.y+e.y*J.y*n,c.z+e.z*J.z*n)},l=h(0,0,0),D=h(0,0,0),r=h(0,0,0),re=e=>{p.set(e.x/J.x,e.y/J.y,e.z/J.z).normalize(),M.copy(I.uWind.value).addScaledVector(p,-I.uWind.value.dot(p)),M.lengthSq()<1e-6&&M.set(1,0,0),M.normalize(),q.crossVectors(p,M).normalize()},Me=(e,a)=>{const o=Math.floor(e.dot(f)/a),n=pe((o+.5)*a,-.995,.995);return D.copy(e).addScaledVector(f,-e.dot(f)),D.lengthSq()<1e-8&&D.copy(F),D.normalize(),e.copy(D).multiplyScalar(Math.sqrt(1-n*n)).addScaledVector(f,n),o},R=h(0,0,0),De=e=>(R.crossVectors(f,e),R.lengthSq()<1e-8&&R.copy(F),R.normalize());for(let e=0,a=b(7400);e<a;e++)G(l),!(l.dot(f)>.5)&&(re(l),ce.copy(p),Me(l,e<420?.13:.045),te(l,1,r),De(l),Ee(r,ce,R,R,e<420?t.range(26,40):t.range(8.5,14),-.2+.2*me(.42,.66,ce.dot(v)),-2),(e&255)===255&&await s.yield());for(let e=0,a=b(950),o=0;e<a&&o<2e4;o++)G(l),!(l.dot(f)>.3||l.dot(v)>.25)&&(e++,Me(l,.045),te(l,1.012,r),De(l),A.add(r.x,r.y,r.z,t.range(8.5,13)*m,t(),e%5<2?Le:$,ee(r),R.x,R.y,R.z,-2));await s.yield();const tt=()=>p.dot(v)>.55+(d()-.5)*.14,at=(e=t)=>{const a=e();return a<.42?ve:a<.78?O:a<.96?N:$},Ie=(e=t)=>{const a=e();return a<.46?P:a<.7?T:a<.88?E:a<.95?$:O};for(let e=0,a=b(2600),o=0;e<a&&o<2e5;o++){G(l);const n=l.dot(f);if(n<.15||n>.38||t()>.2+.8*me(.15,.3,n))continue;e++,te(l,t.range(1,1.035),r);const i=(t()<.7?t.range(6,11):t.range(2.2,3.6))*m;Ye.add(r.x,r.y,r.z,i,t(),Ie(),ee(r))}for(let e=0,a=b(2600),o=0;e<a&&o<2e5;o++){G(l,d);const n=l.dot(f);if(n<.22||n>.38||d()>.2+.8*me(.22,.32,n))continue;e++,Me(l,.03),re(l),te(l,d.range(1,1.035),r),De(l);const i=(d()<.7?d.range(6,11):d.range(2.2,3.6))*m;A.add(r.x,r.y,r.z,i,d(),tt()?Ie(d):at(d),ee(r,d),R.x,R.y,R.z,0),(o&255)===255&&await s.yield()}for(let e=0,a=0;e<300&&a<2e4;a++){G(l);const o=l.dot(f);o<.2||o>.46||(e++,re(l),te(l,1.02,r),A.add(r.x,r.y,r.z,t.range(30,46)*m,t(),tt()?Ie():at(),ee(r),M.x,M.y,M.z,-3))}for(let e=0,a=0;e<260&&a<4e4;a++){G(l,d);const o=l.dot(f);o<.05||o>.47||(re(l),!(p.dot(v)<.62)&&(e++,te(l,1.085,r),A.add(r.x,r.y,r.z,d.range(26,40)*m,d(),Ie(d),ee(r,d),M.x,M.y,M.z,-3)))}await s.yield();for(let e=0,a=b(2600),o=0;e<a&&o<2e5;o++){G(l);const n=l.dot(f);if(n<.33||n>.52)continue;e++,Me(l,.03),re(l),te(l,t.range(1,1.03),r),De(l);const i=(t()<.75?t.range(5,10):t.range(2,3.4))*m;A.add(r.x,r.y,r.z,i,t(),tt()?Ke(.9,t()):at(),ee(r),R.x,R.y,R.z,0),(o&255)===255&&await s.yield()}await s.yield();for(let e=0,a=b(1700),o=0;e<a&&o<2e5;o++){G(l,d);const n=l.dot(f);if(n<.35||n>.47||(re(l),d()>me(.42,.72,p.dot(v))))continue;e++,Me(l,.04),te(l,d.range(1.05,1.085),r),De(l);const i=d();A.add(r.x,r.y,r.z,d.range(10,14)*m,d(),i<.63?P:i<.84?T:i<.9?E:O,ee(r,d),R.x,R.y,R.z,0),(o&255)===255&&await s.yield()}await s.yield(),A.add(c.x,c.y,c.z,10,t(),P,.4,0,0,0,1);for(let e=0;e<150;e++){const a=Math.abs(t.gauss())*2.2;G(l),A.add(c.x+l.x*a,c.y+l.y*a,c.z+l.z*a,t.range(.6,2.6),t(),P,t.range(0,3),l.x,l.y,l.z,t.range(.6,1))}for(let e=0;e<40;e++){const a=4+Math.abs(t.gauss())*9;G(l),A.add(c.x+l.x*a,c.y+l.y*a,c.z+l.z*a,t.range(3,6),t(),P,t.range(0,3),l.x,l.y,l.z,1.45)}A.add(c.x,c.y,c.z,30,d(),T,.5,0,0,0,2);for(let e=0;e<7;e++){const a=e/7*S+.3;A.add(c.x,c.y,c.z,d.range(10,13),d(),e%3===2?E:T,a,Math.cos(a)*11,Math.sin(a)*11,0,2)}for(let e=0;e<14;e++){const a=e/14*S+d.range(-.04,.04),o=a+S/28;A.add(c.x,c.y,c.z,d.range(7.5,9),d(),P,a+1.57,Math.cos(a)*25,Math.sin(a)*25,0,3),A.add(c.x,c.y,c.z,d.range(6,7.2),d(),N,o+1.57,Math.cos(o)*34,Math.sin(o)*34,0,4)}for(let e=0;e<24;e++){const a=e/24*S+t.range(-.02,.02);r.copy(c).addScaledVector(F,80+Math.cos(a)*27).addScaledVector(K,Math.sin(a)*27).addScaledVector(f,8+t.range(-.5,.5)),A.add(r.x,r.y,r.z,t.range(8.5,10),t(),e%4?T:E,a+Math.PI*.5,0,0,0,-1);const o=a+S/48;r.copy(c).addScaledVector(F,80+Math.cos(o)*36).addScaledVector(K,Math.sin(o)*36).addScaledVector(f,10+t.range(-.5,.5)),A.add(r.x,r.y,r.z,t.range(6,7.5),t(),N,o+Math.PI*.5,0,0,0,-1)}for(let e=0;e<44;e++){const a=e/44*S+t.range(-.02,.02);r.copy(c).addScaledVector(F,80+Math.cos(a)*18).addScaledVector(K,Math.sin(a)*18).addScaledVector(f,6+t.range(-.4,.4)),A.add(r.x,r.y,r.z,t.range(2.6,3.6),t(),e%3?T:E,a,0,0,0,-1)}for(let e=0;e<8;e++){const a=e/8*S;r.copy(c).addScaledVector(F,80+Math.cos(a)*28).addScaledVector(K,Math.sin(a)*28).addScaledVector(f,12),A.add(r.x,r.y,r.z,21,t(),e%4?T:E,a+Math.PI*.5,0,0,0,-4)}for(let e=0;e<170;e++){const a=t.gauss()*.5,o=80+t.range(-7.5,7.5),n=Math.min(1,Math.abs(a)/.9);Math.abs(a)*80<48||(r.copy(c).addScaledVector(F,Math.cos(a)*o).addScaledVector(K,Math.sin(a)*o).addScaledVector(f,2+t.range(-.5,.5)),A.add(r.x,r.y,r.z,Be(5.5,2.2,n)*t.range(.8,1.2),t(),e%4?T:E,a*5,0,0,0,-1))}for(let e=0;e<26;e++){const a=e/26*S,o=9+e%2*3;r.copy(c).addScaledVector(F,Math.cos(a)*o).addScaledVector(K,Math.sin(a)*o).addScaledVector(f,1.5),A.add(r.x,r.y,r.z,t.range(2.4,3.4),t(),e%2?N:E,a,0,0,0,e%2?0:.35)}await s.yield();const qe=new ye;for(let e=0,a=b(12500);e<a;e++){G(l);const o=l.dot(f);if(o<.3){t()<.9&&e--;continue}const n=Me(l,.04);re(l),te(l,t.range(.99,1.05),r);const i=1-(o-.3)/.7,u=.1+i*1.9+.4*L.n3(l.x*3+Ze,l.y*3,l.z*3),x=Math.min(.56,p.dot(v)*.4+.24+(t()-.5)*.1)+(d()<.05?.1:0)+(n%2?.06:-.06);qe.add(r.x,r.y,r.z,(t()<.7?t.range(6,13):t.range(2.5,4))*m,t(),Ke(x,t()),ee(r),u,i>.4&&t()<.12?1:0,0,0),(qe.count&255)===255&&await s.yield()}const de=new ye;for(let e=0,a=b(21e3);e<a;e++){const o=8+144*Math.sqrt(t());if(ft(o))continue;const n=t()<.3,i=t.gauss()*(n?.5:1)*(3.5+4*o/150)+(n?2.5:0);de.add(c.x,c.y,c.z,(n?t.range(6,11):t.range(2,3.4))*m,t(),Ct(o,t()),t.range(0,3),o,t.range(0,S),i,0),(e&511)===511&&await s.yield()}for(let e=0,a=b(1500),o=0;e<a&&o<2e4;o++){const n=10+140*Math.sqrt(t()),i=t.range(9,14);if(ne.some(x=>Math.abs(n-x.r)<x.width*.5+i*.3))continue;e++;const u=n<26?t()<.6?T:E:Math.floor(n/13)%2===0?t()<.7?P:E:t()<.75?O:N;de.add(c.x,c.y,c.z,i*m,t(),u,t.range(0,3),n,t.range(0,S),3+t.range(-1,1),2)}await s.yield();const Ht=g.planets??t.int(1,3),Wt=[];for(let e=0;e<Ht;e++){const a=t.range(0,S)+e*2.1;Wt.push(a),de.add(c.x,c.y,c.z,6,t(),E,.3,80,a,0,1);for(let o=0;o<46;o++)de.add(c.x,c.y,c.z,t.range(.8,2.2),t(),t()<.7?P:O,t.range(0,3),80+t.gauss()*1.4,a+t.gauss()*.017,t.gauss()*1.4,1);for(let o=0,n=b(330);o<n;o++){const i=t.range(-10.5,10.5),u=-Math.sign(i)*.05*Math.pow(Math.abs(i),1.45);de.add(c.x,c.y,c.z,t.range(1,2.6)*(1-Math.abs(i)/16),t(),t()<.6?T:t()<.5?lt:E,t.range(0,3),80+i,a+u+t.gauss()*.012,t.gauss()*1.2,1)}}await s.yield();const Ge=new ye;for(let e=0,a=b(1e4);e<a;e++){const o=t(),n=o<.35?t.range(7,12):o<.9?t.range(2.5,4):t.range(.7,1.1),i=t(),u=i<.32?P:i<.54?T:i<.68?E:i<.88?O:N;Ge.add(c.x,c.y,c.z,n*m,t(),u,t.range(0,3),t.range(0,900),t.range(0,S),t()<.7?.55+.45*Math.sqrt(t()):t(),e%2?1:-1),(e&511)===511&&await s.yield()}for(let e=0,a=b(3e3);e<a;e++){const o=t();Ge.add(c.x,c.y,c.z,t.range(16,26)*m,t(),o<.32?P:o<.54?T:o<.68?E:o<.88?O:N,100+t.range(0,3),t.range(0,900),t.range(0,S),t.range(.08,.95),e%2?1:-1)}const ze=new ye,Ne=(e=t)=>{const a=e();return a<.46?P:a<.72?T:a<.93?E:$},Mt=()=>{const e=t();return(e<.64?t.range(2,3.5):e<.8?t.range(6,11):e<.85?t.range(14,24):t.range(.6,1))*m},zt=e=>D.set(-.5+e.x*.3+t.range(-.15,.15),.75+t.range(-.15,.2),.25+e.z*.3+t.range(-.15,.15)).normalize().multiplyScalar(t.range(70,190));for(let e=0,a=b(6e3);e<a;e++)B(_,(X+t.gauss()*.07+1)%1,t.range(.45,.99)),zt(p),ze.add(z.x+p.x*2,z.y+p.y*2,z.z+p.z*2,Mt(),t(),Ne(),t.range(0,3),D.x,D.y,D.z,t.range(.05,.11)),(e&255)===255&&await s.yield();for(let e=0,a=b(1900);e<a;e++){const o=we[1+e%(we.length-1)];B((n,i,u)=>Xe(o,n,i,u),t(),t.range(.55,.99)),zt(p),ze.add(z.x,z.y,z.z,Mt(),t(),Ne(),t.range(0,3),D.x,D.y,D.z,t.range(.05,.1))}await s.yield();for(let e=0,a=b(2e3),o=0;e<a&&o<1e5;o++){G(l);const n=l.dot(f);if(n<-.12||n>.42)continue;e++,t.range(-.15,.15),t.range(-.15,.15),t.range(-.15,.15),t.range(170,430);const i=t();Ye.add(0,0,0,i<.5?t.range(2.4,3.8):i<.9?t.range(6,11):t.range(14,22),t(),Ne(),t.range(0,3),0,0,0,t.range(.045,.09))}for(let e=0,a=b(1100),o=0;e<a&&o<1e5;o++){G(l,d);const n=l.dot(f);if(n<.12||n>.44||(re(l),p.dot(v)<.45))continue;e++,te(l,1.03,r),D.set(-v.x*.8+p.x*.45+d.range(-.15,.15),-v.y*.8+p.y*.45+d.range(-.15,.15),-v.z*.8+p.z*.45+d.range(-.15,.15)).normalize().multiplyScalar(d.range(170,430));const i=d();ze.add(r.x,r.y,r.z,(i<.5?d.range(2.4,3.8):i<.9?d.range(6,11):d.range(14,22))*m,d(),Ne(d),d.range(0,3),D.x,D.y,D.z,d.range(.045,.09)),(o&255)===255&&await s.yield()}await s.yield();for(let e=0,a=b(1200);e<a;e++){const o=Math.floor(t()*7)*(S/7)+t.gauss()*.05,n=t.range(170,235),i=t.range(-90,90)*(e%2?1:.4);r.copy(c).addScaledVector(F,Math.cos(o)*n).addScaledVector(K,Math.sin(o)*n).addScaledVector(f,i),D.copy(c).addScaledVector(F,Math.cos(o+.5)*150).addScaledVector(K,Math.sin(o+.5)*150).sub(r);const u=t();ze.add(r.x,r.y,r.z,t.range(2,3.4)*m,t(),u<.4?$:u<.7?Le:u<.9?O:P,t.range(0,3),D.x,D.y,D.z,t.range(.07,.13))}await s.yield(),await s.yield();const he=new ye,At=[],Kt=g.tadpoles??t.int(28,48);for(let e=0,a=0;e<Kt&&a<600;a++){if(G(l),l.x=-Math.abs(l.x)*.9+l.x*.35,l.normalize(),l.dot(f)>.3||(r.copy(c).addScaledVector(l,t.range(330,640)),r.y<1380||r.y>2300)||(xe(pe(r.y/V,0,1),le),r.y<1900&&Math.hypot(r.x-le.x,r.z-le.z)<310))continue;const o=t.range(10,24),n=t();At.push(r.clone()),e++,he.add(r.x,r.y,r.z,o*.36,t(),N,.3,0,0,0,n),he.add(r.x,r.y,r.z,o*.24,t(),ve,1.2,o*.13,o*.05,-o*.04,n),he.add(r.x,r.y,r.z,o*.2,t(),O,2,o*.05,-o*.09,o*.06,n);for(let i=0;i<5;i++){const u=i/5*S;he.add(r.x,r.y,r.z,o*t.range(.1,.15),t(),i%3?P:T,u,-o*.17,Math.cos(u)*o*.11,Math.sin(u)*o*.11,n)}for(let i=0;i<18;i++){const u=Be(.22,1.7,i/17)*o,x=o*.04*(1+i*.12);he.add(r.x,r.y,r.z,o*Be(.2,.06,i/17),t(),i%5===4?Le:i%7===3?ct:$,t.range(0,3),u,t.gauss()*x,t.gauss()*x,n)}}await s.yield();const Qt=new Float32Array([0,2,0,-1.7321,-1,0,1.7321,-1,0]),ue=(e,a,o,n=je)=>{const i=new y.InstancedBufferGeometry;i.setAttribute("position",new y.BufferAttribute(Qt,3)),i.setAttribute("iPos",new y.InstancedBufferAttribute(e.pos.slice(0,e.count*3),3)),i.setAttribute("iData",new y.InstancedBufferAttribute(e.data.slice(0,e.count*4),4)),i.setAttribute("iAux",new y.InstancedBufferAttribute(e.aux.slice(0,e.count*4),4)),i.instanceCount=e.count;const u=new y.Mesh(i,Ut(a,o));return u.frustumCulled=!1,n&&n.add(u),u};ue(A,0,.6),await s.yield(),ue(ze,1,0),await s.yield(),ue(qe,2,.3),await s.yield(),ue(de,3,.25),await s.yield(),ue(Ge,4,0),await s.yield(),ue(he,5,0);const Zt=A.count+ze.count+qe.count+de.count+Ge.count+he.count;await s.yield();const Ae=[];{const e=yt.attributes.position.array;for(let o=0;o<e.length;o+=3)e[o+1]>700&&Ae.push(e[o],e[o+1],e[o+2]);const a=xt.attributes.position.array;for(let o=0;o<a.length;o+=3)l.set(a[o]-c.x,a[o+1]-c.y,a[o+2]-c.z).normalize(),l.dot(f)<.5&&Ae.push(a[o],a[o+1],a[o+2])}const Pt=e=>{let a=1e12;for(let o=0;o<Ae.length;o+=3){const n=Ae[o]-e.x,i=Ae[o+1]-e.y,u=Ae[o+2]-e.z,x=n*n+i*i+u*u;x<a&&(a=x)}return Math.sqrt(a)},ot=(e,a,o)=>{for(let n=0;n<60&&Pt(e)<o;n++)e.addScaledVector(a,4);return e},fe=c.clone().addScaledVector(F,80),St=w.clone().addScaledVector(f,-w.dot(f)).normalize(),kt=[],ge=[];for(const e of[.5,.58,.66,.74,.82,.9])B(_,X,e),kt.push(z.clone());for(const e of[.56,.66,.76,.84])B(_,X,e),p.y=0,p.normalize(),ge.push(ot(z.clone().addScaledVector(p,18),p,28));ge.push(ot(ke.clone().addScaledVector(w,250).add(h(0,90,0)),w,34)),ge.push(ot(c.clone().addScaledVector(w,420).add(h(0,-30,0)),w,60)),ge.push(c.clone().addScaledVector(f,560).addScaledVector(St,230).addScaledVector(F,40)),ge.push(fe.clone().addScaledVector(f,1e3).addScaledVector(St,60)),ge.push(fe.clone().addScaledVector(f,700),fe.clone().addScaledVector(f,260),fe.clone(),fe.clone().addScaledVector(f,-40));const Jt={globuleCenter:c.clone(),starPos:c.clone(),discNormal:f.clone(),discRadius:152,gaps:ne,discE1:F.clone(),discE2:K.clone(),portalSeat:{position:fe.clone(),normal:f.clone(),radius:7},flyThrough:ge,rimLine:kt,tipTop:ke.clone(),clusterDir:v.clone(),viewpoints:{entry:h(ke.x+250,1300,2300),overTip:c.clone().addScaledVector(w,420).add(h(0,60,0)),dive:fe.clone().addScaledVector(f,400)},jets:[{root:c.clone(),dir:f.clone(),length:900,rootRadius:8,endRadius:40},{root:c.clone(),dir:f.clone().negate(),length:900,rootRadius:8,endRadius:40}],tadpoles:At,pillarPoint:(e,a,o)=>_(e,a,o),axisAt:(e,a)=>xe(e,a),litU:X,hullDist:Pt,bounds:{radius:1e3,minY:0,maxY:c.y+900*f.y,center:h(c.x*.5,1400,0)}},Q={peel:0,star:0,jets:0,front:0,reveal:0},Vt=()=>{I.uPeel.value=Q.peel,I.uStar.value=Q.star,I.uJet.value=Q.jets,I.uFront.value=Q.front,I.uReveal.value=Q.reveal},Et=e=>{e=pe(e,0,1),Q.peel=me(0,.6,e),Q.star=me(.45,.55,e),Q.jets=pe((e-.55)/.25,0,1),Q.front=pe((e-.55)/.45,0,1),Vt()},Xt=e=>{for(const a in Q)e[a]!==void 0&&(Q[a]=pe(e[a],0,1));Vt()};Et(g.progress??.72);const He=new y.Vector2,nt=h(0,0,0),Dt=h(0,0,0),Te=h(0,0,0),it=new y.Quaternion,la=new y.Quaternion;let Tt=null;const Yt=(e,a,o)=>{I.uTime.value=a,o&&(s.renderer&&s.renderer.getDrawingBufferSize?s.renderer.getDrawingBufferSize(He):He.set(1280,720),I.uRes.value.copy(He),I.uPxScale.value=o.projectionMatrix.elements[5]*He.y*.5,o.getWorldPosition(nt),o===Tt&&e>1e-4?(Te.subVectors(nt,Dt).divideScalar(e),Te.length()>1500&&Te.set(0,0,0),o.getWorldQuaternion(it),it.invert(),Te.applyQuaternion(it),I.uCamVel.value.lerp(Te,1-Math.exp(-e*16))):I.uCamVel.value.set(0,0,0),Tt=o,Dt.copy(nt))};return{object:je,radius:330,height:560,center:c.clone(),anchors:Jt,update:Yt,setProgress:Et,setStage:Xt,stage:Q,uniforms:I,pigments:k,dabCount:Zt,kit:{Bank:ye,DECK_GLSL:_t,dabMesh:(e,a,o)=>ue(e,a,o,null),hullMat:Ce,gridGeometry:_e,mergeGrids:Qe,pickPigment:Ke,COMPLEMENT:Bt,P:{PRIME:ea,DVIOLET:ve,ULTRA:O,VIOLET:N,VIRID:Le,PULTRA:lt,ROSE:$,PROSE:ct,ORANGE:P,GOLD:E,LEMON:T,PVIRID:Rt}},dispose(){},ground:!1,groundY:0}}export{_t as DECK_GLSL,da as buildHero};
