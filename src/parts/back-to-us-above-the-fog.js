import*as p from"three";import{makeNoise as Te,clamp as ee,lerp as _,smoothstep as Le}from"../kit/core.js";const U=["#241D18","#25322C","#6E6A85","#8FA3B8","#DCDDD6","#EFE0A0","#E3B4A6"],W=o=>new p.Color(o),Oe=(o,t,n)=>o.clone().lerp(t,n),ae=(o,t,n)=>{const r=new p.Color(o).convertLinearToSRGB(),i=new p.Color(t).convertLinearToSRGB();return"#"+new p.Color().setRGB(_(r.r,i.r,n),_(r.g,i.g,n),_(r.b,i.b,n),p.SRGBColorSpace).getHexString()},P={uTime:{value:0},uSlab:{value:new p.Vector4(64,80,.16,0)},uHaze:{value:new p.Vector4(35e-5,.012,4,5)},uFogHi:{value:W("#DCDDD6")},uFogLo:{value:W("#6E6A85")},uSplit:{value:72},uTone:{value:new p.Vector4(60,40,.3,6)},uDetail:{value:new p.Vector2(35,62)},uSnowCol:{value:W("#DCDDD6")},uSnowLo:{value:W("#6E6A85")},uSnow:{value:1},uDrift:{value:new p.Vector3(0,6,.55)},uDeckHol:{value:W("#B4B7C6")},uDeckFar:{value:W("#BEC6CC")},uViewH:{value:720}};function Be(o=U){P.uFogHi.value.set(o[4]),P.uFogLo.value.set(o[2]),P.uSnowCol.value.set(o[4]),P.uSnowLo.value.copy(Oe(W(o[4]),W(o[2]),.55))}function Ne(o,t){if(P.uTime.value=o,t){const n=t.getDrawingBufferSize(Ce);P.uViewH.value=Math.max(64,n.y)}}const Ce=new p.Vector2,Ae=(()=>{const o=W(U[0]);return[o.r,o.g,o.b].map(t=>t.toFixed(5)).join(", ")})(),te=`
uniform float uTime; uniform vec4 uSlab; uniform vec4 uHaze; uniform vec3 uFogHi; uniform vec3 uFogLo; uniform float uSplit;
uniform vec3 uDeckHol; uniform vec3 uDeckFar;
uniform vec3 uDrift; uniform vec4 uTone; uniform vec2 uDetail; uniform vec3 uSnowCol; uniform vec3 uSnowLo; uniform float uSnow;
const vec3 FZ_UMBER = vec3(${Ae});   // the darkest pigment: nothing is darker, nothing is mixed with black
float fzHash(vec3 p){ p = fract(p * vec3(0.1031, 0.1030, 0.0973)); p += dot(p, p.yxz + 33.33); return fract((p.x + p.y) * p.z); }
float fzNoise(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(mix(fzHash(i), fzHash(i+vec3(1,0,0)), f.x), mix(fzHash(i+vec3(0,1,0)), fzHash(i+vec3(1,1,0)), f.x), f.y),
             mix(mix(fzHash(i+vec3(0,0,1)), fzHash(i+vec3(1,0,1)), f.x), mix(fzHash(i+vec3(0,1,1)), fzHash(i+vec3(1,1,1)), f.x), f.y), f.z); }
// every mix of two pigments is made in gamma-2 space, so a 6 percent step looks like 6 percent on a dark umber as on pearl
vec3 fzMix(vec3 a, vec3 b, float t){ vec3 m = mix(sqrt(max(a, 0.)), sqrt(max(b, 0.)), clamp(t, 0., 1.)); return m * m; }
// tone step of an object whose origin is d metres from the lens: full dark within the dark radius (60 m), the first paler step
// complete one step length on (100 m), each 40 m beyond one step more; a step comes on over the second half of its 40 m
float fzToneStep(float d){ float s = clamp(max(d - uTone.x, 0.) / max(uTone.y, 1.) , 0., uTone.w);
  float st = floor(s) + smoothstep(0.5, 1., fract(s)); return 1. - exp(-st * uTone.z); }
// fog colour for a ray between heights: pearl above the split, violet below
vec3 fzFogCol(float y){ return mix(uFogLo, uFogHi, smoothstep(uSplit - 6., uSplit + 6., y)); }
// optical depth along the true eye ray: thin haze + level slab (box) + ground mist (exponential in height), closed form
float fzTau(vec3 eye, vec3 p){
  float L = distance(eye, p);
  float lo = min(eye.y, p.y), hi = max(eye.y, p.y); float h = max(hi - lo, 0.01); hi = lo + h;
  float ov = max(0., min(hi, uSlab.y) - max(lo, uSlab.x));
  float tau = uHaze.x * L + uSlab.z * L * ov / h;
  float H = max(uHaze.w, 0.1); float ya = max(lo - uHaze.z, -H) / H; float t = h / H;
  float fac = t < 1e-3 ? 1. : (1. - exp(-t)) / t;
  tau += uHaze.y * L * exp(-ya) * fac;
  return tau; }
// the glaze moves: level patches of ground mist and slab slide along uDrift over whatever they lie on
float fzDrift(vec3 p){ vec2 q = p.xz - uDrift.xy * uTime; return 1. + uDrift.z * (fzNoise(vec3(q.x * 0.045, p.y * 0.3, q.y * 0.03)) * 2. - 1.); }
// the fog's colour is that of the fog nearest the eye on this ray: the slab's own height where the ray crosses the slab
// inside the slab the fog is not one tone: level veils, paler and darker, stream past the eye toward the light
vec3 fzVeil(vec3 fogc, vec3 eye, vec3 dir, float L){
  float inside = smoothstep(uSlab.x - 3., uSlab.x + 3., eye.y) * (1. - smoothstep(uSlab.y - 1.5, uSlab.y + 1.5, eye.y));
  if (inside < 0.003) return fogc;
  vec3 s = eye + dir * min(L, 15.); vec2 q = s.xz - uDrift.xy * uTime * 1.5;
  vec3 s2 = eye + dir * min(L, 38.); vec2 q2 = s2.xz - uDrift.xy * uTime * 1.5;
  float n = fzNoise(vec3(q.x * 0.06, s.y * 0.4, q.y * 0.055)), n2 = fzNoise(vec3(q2.x * 0.03 + 7., s2.y * 0.22, q2.y * 0.03));
  vec3 c = fzMix(fogc, uFogHi, smoothstep(0.48, 0.7, n) * 0.5 * inside);
  return fzMix(c, fzMix(uFogLo, FZ_UMBER, 0.1), smoothstep(0.5, 0.74, n2) * 0.55 * inside); }
vec3 fzFog(vec3 col, vec3 eye, vec3 p){ float f = 1. - exp(-fzTau(eye, p) * fzDrift(p));
  float ov = min(max(eye.y, p.y), uSlab.y) - max(min(eye.y, p.y), uSlab.x);
  float yc = mix(mix(eye.y, p.y, 0.6), clamp(eye.y, uSlab.x, uSlab.y), smoothstep(0., 1.5, ov));
  vec3 dv = p - eye; float L = length(dv);
  return fzMix(col, fzVeil(fzFogCol(yc), eye, dv / max(L, 1e-4), L), f); }
// the fog sea's surface (the deck and every foot that melts into it share these): long level swells, nearer the lens billows
float fzDeckH(vec2 q){ return fzNoise(vec3(q.x * 0.011, 3., q.y * 0.03)) * 0.6 + fzNoise(vec3(q.x * 0.03, 7., q.y * 0.075)) * 0.4; }
float fzDeckB(vec2 q){ return fzNoise(vec3(q.x * 0.045, 21., q.y * 0.13)) * 0.6 + fzNoise(vec3(q.x * 0.11, 17., q.y * 0.33)) * 0.4; }
float fzDeckY(vec2 xz, float dl){ vec2 q = xz - uDrift.xy * uTime; float k = smoothstep(4., 48., dl);
  return uSlab.y + (fzDeckH(q) - 0.38) * 7. * k * (1. - smoothstep(2500., 9000., dl)) + (fzDeckB(q) - 0.5) * 3. * k * (1. - smoothstep(90., 260., dl)); }
vec3 fzDeckCol(vec3 w, vec3 eye){
  float d = distance(eye, w); vec2 q = w.xz - uDrift.xy * uTime;
  float fine = fzNoise(vec3(q.x * 0.05, 1., q.y * 0.16)) * (1. - smoothstep(150., 500., d));
  float h0 = fzDeckH(q), rise = (fzDeckH(q + vec2(0., 5.)) - h0) * 7.;       // a swell's near side faces away from the light beyond the horizon
  float hol = max(smoothstep(0.6, 0.22, h0 + (fine - 0.5) * 0.25) * 0.75, smoothstep(0.02, 0.5, rise + (fine - 0.5) * 0.2));
  float nk = 1. - smoothstep(90., 260., d);
  if (nk > 0.) { float b = fzDeckB(q), br = fzDeckB(q + vec2(0., 2.5)) - b;   // nearer the lens: billows of 10 to 25 m, pearl on top, violet on the near side and in the troughs
    hol = mix(hol, clamp((1. - smoothstep(0.36, 0.6, b)) * 0.6 + smoothstep(0., 0.1, br) * 0.55, 0., 1.), nk * 0.85); }
  hol *= 1. - 0.6 * smoothstep(250., 1500., d);
  vec3 c = fzMix(uFogHi, uDeckHol, hol * smoothstep(3., 22., d));
  c = fzMix(c, uDeckFar, smoothstep(300., 6000., d));
  // from above, the vapour's own surface is what is seen: the mist lying on it does not veil it (it would paint it out blank)
  return mix(fzFog(c, eye, w), c, 0.85 * smoothstep(uSlab.y + 0.5, uSlab.y + 5., eye.y)); }
`,De=`
// antialiased drawn line at coordinate x (period 1), w = half width in periods; fades to its average when finer than ~3 px
float fzLine(float x, float w){ float fw = max(fwidth(x), 1e-5); float d = abs(fract(x - 0.5) - 0.5);
  float l = 1. - smoothstep(max(w, fw * 0.75) - fw * 0.75, max(w, fw * 0.75) + fw * 0.75, d);
  return mix(l, 2. * w, smoothstep(0.25, 0.6, fw)) * (1. - smoothstep(0.6, 1.2, fw)); }
`,Ve=`
${te}
attribute vec2 aVS;            // x: local value shift (-1 darker core .. +1 paler), y: forced snow 0..1
uniform vec2 uSway;            // hung cloth stirs: amplitude m, rate
varying vec3 vW; varying vec3 vO; varying vec2 vVS; varying float vTone;
#ifdef FZ_CENTER
attribute vec3 aC;             // merged geometry: object-space centre of the thing this vertex belongs to (same on all its vertices)
#endif
void main(){
  vec4 o = vec4(position, 1.);
  #ifdef USE_INSTANCING
    o = instanceMatrix * o; vec3 oc = (modelMatrix * instanceMatrix * vec4(0., 0., 0., 1.)).xyz;
  #else
    vec3 oc = modelMatrix[3].xyz;
  #endif
  #ifdef FZ_CENTER
    oc = (modelMatrix * vec4(aC, 1.)).xyz;
  #endif
  vO = position; vVS = aVS;
  o.z += uSway.x * sin(uTime * uSway.y + position.x * 0.31 + position.y * 0.23) * (0.6 + 0.4 * sin(uTime * uSway.y * 0.37 + position.y * 0.6));
  vec4 w = modelMatrix * o; vW = w.xyz;
  vTone = fzToneStep(distance(cameraPosition, oc));
  gl_Position = projectionMatrix * viewMatrix * w;
}`,we=`
${te}
${De}
// ashlar: the bed under course k (courses of 0.775 m, more or less 0.325) and the perpend before block k of a course (blocks of 1.95 m, more or less 1.05)
float fzBed(float k){ return k * 0.775 + 0.174 * sin(k * 2.4 + 1.3); }
float fzPerp(float k, float ph){ return k * 1.95 + 0.56 * sin(k * 2.4 + ph); }
uniform vec3 uCol; uniform vec3 uCol2; uniform float uMode; uniform float uSnowAmt; uniform float uGrain; uniform float uLift; uniform float uBody; uniform vec3 uLeaf;
varying vec3 vW; varying vec3 vO; varying vec2 vVS; varying float vTone;
void main(){
  vec3 cw = cross(dFdx(vW), dFdy(vW)); vec3 n = cw / max(length(cw), 1e-12);
  vec3 co = cross(dFdx(vO), dFdy(vO)); vec3 no = co / max(length(co), 1e-12);
  float dist = distance(cameraPosition, vW);
  float df = 1. - smoothstep(uDetail.x, uDetail.y, dist);
  vec3 col = uCol; float v = 0.;                         // v: drawn second value, -1 darker .. +1 paler
  float bt = clamp(-vVS.y, 0., 1.), fwT = fwidth(vVS.y);   // the fir's bough coordinate and its pixel size (derivatives are taken outside the branches)
  if (uMode < 0.5) {                                     // 0 plain: a faint drawn grain only
    v = (fzNoise(vO * uGrain) - 0.5) * 0.2;
  } else if (uMode < 1.5) {                              // 1 ashlar: courses, staggered joints, block values, lichen, weather streaks
    vec3 ao = abs(no); vec2 q = ao.z > 0.55 ? vO.xy : (ao.x > 0.55 ? vO.zy : vO.xz * 1.0);
    float top = step(0.55, ao.y) * (1. - step(0.55, ao.z)) * (1. - step(0.55, ao.x));
    // ashlar by the stone's own rule: no two courses alike (0.45 to 1.1 m), blocks 0.9 to 3 m, no joint over another in a pattern
    float fwq = max(max(fwidth(q.x), fwidth(q.y)), 1e-5);
    float row = floor(q.y / 0.775); if (q.y < fzBed(row)) row -= 1.; else if (q.y >= fzBed(row + 1.)) row += 1.;
    float by0 = fzBed(row), by1 = fzBed(row + 1.), dyb = min(q.y - by0, by1 - q.y);
    float rph = fzHash(vec3(row, 3.3, 7.1)) * 6.283, qx = q.x + fzHash(vec3(row, 5.9, 2.3)) * 1.95;
    float bk = floor(qx / 1.95); if (qx < fzPerp(bk, rph)) bk -= 1.; else if (qx >= fzPerp(bk + 1., rph)) bk += 1.;
    float bx0 = fzPerp(bk, rph), bx1 = fzPerp(bk + 1., rph), dxb = min(qx - bx0, bx1 - qx);
    float blk = fzHash(vec3(bk, row, 1.7)), odd = fzHash(vec3(bk, row, 5.3));
    if (odd < 0.1 && bx1 - bx0 > 1.6) dxb = min(dxb, abs(qx - bx0 - 0.45));          // a through stone: its end shows as a face 0.45 m wide
    float jf = 1. - smoothstep(12., 23., dist);                                                                      // joints are found only on looking
    float near = 1. - smoothstep(4., 18., dist);
    // weathered joints: thin, and they come and go along the course (worn flush here, open there), never a ruled grid
    float worn = 0.3 + 0.7 * smoothstep(0.3, 0.62, fzNoise(vec3(q.x * 0.55, q.y * 0.9, 31.)));
    float jw = max(mix(0.009, 0.005, near), fwq * 0.75), ja = fwq * 0.75;                 // thin dark joints: 1 cm, never under a pixel and a half
    float jl = max(1. - smoothstep(jw - ja, jw + ja, dyb), 1. - smoothstep(jw - ja, jw + ja, dxb)) * (1. - smoothstep(0.02, 0.05, fwq)) * (1. - top) * jf * worn;
    float spall = step(0.84, fzHash(vec3(bk, row, 9.1))) * (1. - smoothstep(0.1, 0.16, (bx1 - qx) + (by1 - q.y) * 1.3 + (fzNoise(vO * 9.) - 0.5) * 0.08));   // a spalled corner
    float gone = step(0.994, odd);                                                             // a dropped block: a dark socket, a few in a face
    float streak = fzNoise(vec3(q.x * 1.7, q.y * 0.13, 4.)) - 0.5;
    float lichen = smoothstep(0.4, 0.72, fzNoise(vO * 0.33 + 9.) * 0.7 + fzNoise(vO * 1.9) * 0.3);                  // soft blots
    float damp = smoothstep(0.45, 0.8, fzNoise(vO * vec3(0.21, 0.09, 0.21) + 21.));                                 // long dark weathering
    float fis = fzLine(q.x * 0.13 + fzNoise(vec3(q.y * 0.35, q.x * 0.1, 7.)) * 0.5, 0.004) * step(0.56, fzNoise(vec3(q.x * 0.13, q.y * 0.07, 3.)));   // a few fissures
    // at arm's length the drawing shows: soft lichen in a second close umber, and knocked arrises along the courses
    float pit = smoothstep(0.5, 0.8, fzNoise(vO * 1.7 + 4.) * 0.65 + fzNoise(vO * 5.3 + 2.) * 0.35) * near;
    float arris = smoothstep(0.5, 0.75, fzNoise(vO * vec3(1.1, 3.1, 1.1) + 12.)) * (1. - smoothstep(0.02, 0.05, dyb)) * near;
    v = (blk - 0.5) * mix(0.02, 0.07, jf) + streak * 0.06 + lichen * 0.1 - damp * 0.12 - fis * 0.45 - jl * mix(0.22, 0.3, near) - pit * 0.06 - arris * 0.22 - (spall * 0.4 + gone * 0.5) * (1. - top) * jf + (abs(no.x) * 0.6 + no.y * 0.12) * 0.07 - 0.02;   // one dark mass; the rolls turn in close values
    // K5: THE WALL'S JOINTS AT THE SECOND VALUE (the designer's fourth word, 5). The same joints (their places, their wear, a
    // centimetre wide and never under a pixel and a half), drawn from the body down to the local dark, which is as far as the two
    // close values part, and kept until the stone's own drawing fades out (35 to 62 m) instead of 12 to 23 m; they go to their
    // average only where a course is finer than about four pixels
    v -= max(max(1. - smoothstep(jw - ja, jw + ja, dyb), 1. - smoothstep(jw - ja, jw + ja, dxb)) * (1. - smoothstep(0.12, 0.25, fwq)) * (1. - top) * worn * 0.5 - jl * mix(0.22, 0.3, near), 0.);
  } else if (uMode < 2.5) {                              // 2 rock: fissures across facets
    float f = fzLine(vO.y * 0.38 + fzNoise(vO * vec3(0.12, 0.3, 0.12)) * 1.6, 0.018) * 0.8 * smoothstep(0.3, 0.55, fzNoise(vO * 0.23 + 7.))   // bedding, nearly level, broken: drawn lines of a hand's breadth
      + fzLine((vO.x * 0.8 + vO.z * 0.6) * 0.23 + fzNoise(vO * 0.17 + 5.) * 0.9, 0.012) * 0.7 * step(0.45, fzNoise(vO * vec3(0.3, 0.08, 0.3) + 2.));   // joints, steep
    float nr = 1. - smoothstep(8., 32., dist);                                 // at a few metres the beds are drawn finer
    f += fzLine(vO.y * 1.1 + fzNoise(vO * vec3(0.3, 0.8, 0.3) + 4.) * 1.3, 0.035) * 0.6 * nr * smoothstep(0.35, 0.6, fzNoise(vO * 0.6 + 11.));
    v = (fzNoise(vO * 0.8) - 0.5) * 0.16 - f * 0.9 + (fzNoise(vO * vec3(0.5, 2.2, 0.5)) - 0.5) * 0.3 * nr   // one mass (its body value is uBody), the drawn beds and joints cut into it; no value by a facet's facing
      + (fzHash(floor(vec3(vO.x * 0.31 + vO.y * 0.12, vO.y * 0.36 + fzNoise(vO * 0.2) * 0.8, vO.z * 0.31 - vO.y * 0.07))) - 0.5) * 0.26;   // close-valued plates of 3 m
  } else if (uMode < 3.5) {                              // 3 bark: long drawn furrows up the limb
    float f = fzLine(fzNoise(vec3(vO.x * 5., vO.y * 0.22, vO.z * 5.)) * 5., 0.07);
    v = -abs(fzNoise(vO * 1.3) - 0.5) * 0.5 - f * 0.55;
    // K5: THE OAKS' BARK AT THE SECOND VALUE (the designer's fourth word, 5). The fine furrows above are a few millimetres wide
    // and are gone a few metres from the eye; the boles stand 5 to 40 m from the route. So the old oak's deep furrows as well:
    // about 6 cm wide and 30 cm apart, running up the limb, drawn from the body down to the local dark; they fade out with the
    // rest of the drawing (35 to 62 m) and go to their average where finer than about four pixels
    v -= fzLine(fzNoise(vec3(vO.x * 0.75, vO.y * 0.05, vO.z * 0.75)) * 3., 0.1) * 0.6;
  } else if (uMode < 4.5) {                              // 4 cloth / feather / plank: parallel drawn lines along object y
    float f = fzLine(vO.x * uGrain + fzNoise(vO * 2.) * 0.22, 0.06);
    v = -f * 1.1 + (fzNoise(vO * 3.) - 0.5) * 0.12;
  } else if (uMode > 7.5) {                              // 8 canvas
    // K1: fore-and-aft canvas (jibs, spanker), which hangs in the keel's plane: the cloths' seams run up it a cloth's width
    // apart along the keel (object z), as the square sails' run across (object x) in the 'lines' mode; the same line, the same value
    float f = fzLine(vO.z * uGrain + fzNoise(vO * 2.) * 0.22, 0.06);
    v = -f * 1.1 + (fzNoise(vO * 3.) - 0.5) * 0.12;
  } else if (uMode > 6.5) {                              // 7 plank: a hull's strakes, level, with butts and a value to each plank; decks are laid fore and aft
    float dk = step(0.7, abs(no.y)), sc = mix(vO.y, vO.x, dk) / 0.3, row = floor(sc), bz = vO.z / 3.4 + fzHash(vec3(row, 1.3, 7.7));
    v = -fzLine(sc, 0.07) * 0.9 - fzLine(bz, 0.008) * 0.7 + (fzHash(vec3(row, floor(bz), 3.1)) - 0.5) * 0.5 + (fzNoise(vO * vec3(9., 9., 0.7)) - 0.5) * 0.2;
  } else if (uMode > 5.5) {                              // 6 fir: whorl on whorl of drooping boughs, drawn from the skirt's own coordinate
    // bt runs from the stem (0) to the bough tips (1). Fir green going umber at the core (uCol2 is the core's umber here), needle
    // sprays ribbed down each bough, and the hanging edge cut in teeth: 26 sprays round a whorl, staggered whorl to whorl.
    // No facet is paler than another: nothing is lit.
    float a = (abs(vO.x) + abs(vO.z)) < 1e-6 ? 0. : atan(vO.z, vO.x);
    float sp = a * 4.138 + vO.y * 31.;
    float saw = abs(fract(sp) - 0.5) * 2.;
    float tooth = (0.36 * saw + 0.12 * fzNoise(vec3(a * 7., vO.y * 43., 3.))) * (1. - smoothstep(0.12, 0.34, fwT));   // teeth finer than the pixel close up
    if (bt > 1. - tooth) discard;
    col = fzMix(uCol, uCol2, 1. - smoothstep(0.08, 0.62, bt));
    v = -fzLine(sp, 0.2) * 0.55 * smoothstep(0.2, 0.55, bt) + (fzNoise(vO * 37.) - 0.5) * 0.24 - 0.35 * smoothstep(0.7, 1., bt);
  }
  // two close values and no third: the body stands uBody of the way from the local dark to its second value, the drawing goes
  // down from there to the local dark and no further (and toward umber where the local dark is a paler pigment); no multiply
  v = v * df + (vVS.x > 0. ? vVS.x * uLift : vVS.x * 1.2) + uBody;
  col = fzMix(fzMix(col, uCol2, clamp(v, 0., 1.)), FZ_UMBER, 0.6 * clamp(-v, 0., 1.));
  if (uMode > 2.5 && uMode < 3.5 && vVS.x > 0.9) col = uLeaf;                 // a russet leaf hanging on
  // snow: pearl where the facet looks up, violet in its hollows; the only pale edge a solid may have
  float sn = smoothstep(0.42, 0.62, n.y + (fzNoise(vW * 1.7) - 0.5) * 0.3 * df) * uSnowAmt;
  sn = max(sn, vVS.y) * uSnow * clamp(1. + min(vVS.y, 0.), 0., 1.);
  if (uMode > 2.5 && uMode < 3.5) sn = smoothstep(0.5, 0.92, vVS.y) * (0.7 + 0.3 * fzNoise(vW * 2.3)) * uSnowAmt * uSnow;
  if (uMode > 6.5 && uMode < 7.5) sn *= 1. - smoothstep(60., 100., dist);   // K1: the snow on a brig's yards is drawn near; past the first tone step the yard is one pale line with the rest of her (a cap of 8 cm is under a pixel there)
  float hol = smoothstep(0.3, 0.85, fzNoise(vW * vec3(0.11, 0.4, 0.11) + 3.)) * 0.4 + (1. - clamp(n.y, 0., 1.)) * 0.5; float gm = 0.;
  if (uMode > 4.5 && uMode < 5.5) { sn = uSnow; hol = clamp(hol * 0.8 - vVS.x * 0.9, 0., 1.);
    // untrodden snow lies in wind drifts: long broken crests across the course, each with a violet lee, drawn where the eye is near
    float dr = fzLine(vW.z * 0.27 + fzNoise(vec3(vW.x * 0.07, 3., vW.z * 0.06)) * 2.6, 0.13) * smoothstep(0.32, 0.6, fzNoise(vec3(vW.x * 0.045, 7., vW.z * 0.1))) * df;
    hol = clamp(hol + dr * 0.5, 0., 1.);                                // 5 ground: snow, or (no snow) drawn heath
    float tuft = mix(0.3, smoothstep(0.52, 0.74, fzNoise(vW * vec3(3.1, 1., 0.8)) * 0.6 + fzNoise(vW * vec3(7.3, 1., 1.9) + 5.) * 0.4), df * (1. - smoothstep(10., 30., dist)))
      + smoothstep(0.35, 0.7, fzNoise(vW * vec3(0.21, 0.5, 0.21))) * 0.5;                                              // short tufts, and broad heath patches
    col = fzMix(uCol, uCol2, clamp(tuft * 0.5 + vVS.x * 0.2 + 0.05, 0., 1.));
    // late autumn: pale mist lies level on the dark heath in drifting sheets, thicker with distance
    vec2 lq = vW.xz - uDrift.xy * uTime;
    float thr = mix(0.6, 0.06, smoothstep(10., 62., dist));
    float lie = smoothstep(thr, thr + 0.2, fzNoise(vec3(lq * vec2(0.02, 0.045), 1.5)) * 0.7 + fzNoise(vec3(lq * vec2(0.06, 0.16), 4.5)) * 0.3);
    col = fzMix(col, fzMix(uSnowLo, uSnowCol, 0.55), (1. - uSnow) * lie * 0.94);
    gm = smoothstep(0.47, 0.7, fzNoise(vec3(lq * vec2(0.02, 0.05), 6.5)) * 0.65 + fzNoise(vec3(lq * vec2(0.055, 0.15), 2.5)) * 0.35) * smoothstep(8., 30., dist) * uSnow; }
  col = mix(col, fzMix(uSnowCol, uSnowLo, clamp(hol, 0., 1.)), sn);
  col = fzMix(col, uSnowLo, gm * 0.5);                                       // over the snow the level mist slides as violet veils
  col = fzMix(col, fzFogCol(vW.y), vTone);
  // the foot melts into mist: seen from above the fog, a solid dissolves over its last metres above the fog's level top
  col = fzFog(col, cameraPosition, vW);
  float above = smoothstep(uSlab.y - 2., uSlab.y + 3., cameraPosition.y);
  if (above > 0.001 && vW.y < uSlab.y + 16.) {            // it takes the fog sea's own colour there, so no edge shows where it goes under
    float dy = fzDeckY(vW.xz, length(vW.xz - cameraPosition.xz));
    float mh = 3. + 3.5 * fzNoise(vec3((vW.xz - uDrift.xy * uTime) * 0.06, 2.));
    float melt = (1. - smoothstep(0., mh, vW.y - dy)) * above;
    if (melt > 0.) { vec3 rd = vW - cameraPosition; float rt = clamp((cameraPosition.y - dy) / max(cameraPosition.y - vW.y, 1e-3), 1., 40.);   // the fog sea seen on this same eye ray beyond the solid: no column of one tone up a sheer face
      col = mix(col, fzDeckCol(vec3(cameraPosition.x + rd.x * rt, dy, cameraPosition.z + rd.z * rt), cameraPosition), melt * (2. - melt)); } }
  gl_FragColor = vec4(col, 1.);
}`,He={plain:0,ashlar:1,rock:2,bark:3,lines:4,snow:5,fir:6,plank:7,canvas:8},ge=ae(U[0],U[2],.2);function he({mode:o="plain",col:t=U[0],col2:n=null,snow:r=1,grain:i=1.5,lift:e=.12,body:a=null,leaf:s=null,centers:c=!1,side:w=p.FrontSide}={}){const z=W(t),d=W(n||(t===U[0]?ge:ae(t,U[4],.5)));return new p.ShaderMaterial({uniforms:{...P,uCol:{value:z},uCol2:{value:d},uMode:{value:He[o]??0},uSnowAmt:{value:r},uGrain:{value:i},uLift:{value:e},uSway:{value:new p.Vector2(0,.7)},uBody:{value:a??(o==="fir"||o==="snow"?0:.4)},uLeaf:{value:W(s||n||ge)}},defines:c?{FZ_CENTER:1}:{},vertexShader:Ve,fragmentShader:we,side:w})}const Fe=`
${te}
uniform float uViewH; attribute vec3 aDir; attribute vec2 aSW; varying vec3 vW;
#ifdef FZ_CENTER
attribute vec3 aC;
#endif
 varying float vTone; varying float vCover;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz;
  vec4 c0 = projectionMatrix * viewMatrix * w; vec4 c1 = projectionMatrix * viewMatrix * (w + vec4(mat3(modelMatrix) * aDir, 0.));
  float asp = projectionMatrix[1][1] / max(projectionMatrix[0][0], 1e-4);
  vec2 s0 = c0.xy / max(abs(c0.w), 1e-4), s1 = c1.xy / max(abs(c1.w), 1e-4);
  vec2 d = (s1 - s0) * vec2(asp, 1.); float dl = length(d); d = dl > 1e-6 ? d / dl : vec2(1., 0.);
  float px = aSW.y * uViewH * projectionMatrix[1][1] / (2. * max(abs(c0.w), 1e-3));
  vCover = clamp(px / 1.5, 0., 1.); float hw = max(px, 1.5) / uViewH;
  c0.xy += vec2(-d.y / asp, d.x) * aSW.x * hw * c0.w;
  vec3 oc = modelMatrix[3].xyz;
  #ifdef FZ_CENTER
    oc = (modelMatrix * vec4(aC, 1.)).xyz;
  #endif
  vTone = fzToneStep(distance(cameraPosition, oc));
  gl_Position = c0;
}`,je=`
${te}
uniform vec3 uCol; varying vec3 vW; varying float vTone; varying float vCover;
void main(){ vec3 f = fzFogCol(vW.y); vec3 col = fzMix(uCol, f, vTone); col = fzFog(col, cameraPosition, vW);
  vec3 bg = fzFog(f, cameraPosition, vW);                 // what a thinning ribbon goes to: the fog tone of its height as seen through the fog on this ray
  gl_FragColor = vec4(fzMix(bg, col, 0.3 + 0.7 * vCover), 1.); }`;function We({col:o=U[0],centers:t=!1}={}){return new p.ShaderMaterial({defines:t?{FZ_CENTER:1}:{},uniforms:{...P,uCol:{value:W(o)}},vertexShader:Fe,fragmentShader:je,side:p.DoubleSide})}function Pe(o){const t=o.length/7,n=new Float32Array(t*12),r=new Float32Array(t*12),i=new Float32Array(t*8),e=new Uint32Array(t*6);for(let s=0;s<t;s++){const c=s*7,w=o[c+3]-o[c],z=o[c+4]-o[c+1],d=o[c+5]-o[c+2];for(let y=0;y<4;y++){const b=y>>1,x=s*4+y;n[x*3]=o[c+b*3],n[x*3+1]=o[c+b*3+1],n[x*3+2]=o[c+b*3+2],r[x*3]=w,r[x*3+1]=z,r[x*3+2]=d,i[x*2]=y&1?1:-1,i[x*2+1]=o[c+6]}e.set([s*4,s*4+1,s*4+2,s*4+2,s*4+1,s*4+3],s*6)}const a=new p.BufferGeometry;if(a.setAttribute("position",new p.BufferAttribute(n,3)),a.setAttribute("aDir",new p.BufferAttribute(r,3)),a.setAttribute("aSW",new p.BufferAttribute(i,2)),a.setIndex(new p.BufferAttribute(e,1)),o.cen){const s=new Float32Array(t*12);for(let c=0;c<t;c++)for(let w=0;w<4;w++)s[(c*4+w)*3]=o.cen[c*3]??0,s[(c*4+w)*3+1]=o.cen[c*3+1]??0,s[(c*4+w)*3+2]=o.cen[c*3+2]??0;a.setAttribute("aC",new p.BufferAttribute(s,3))}return a}const Ee=`
${te}
uniform vec4 uBox;   // z0, z1 (wrap range in mesh space), near fade m, speed scale
attribute vec4 aP; attribute vec4 aS;   // aP: x, y, z, seed   aS: width, height, speed m/s, opacity
varying vec2 vUv; varying float vA; varying vec3 vW; varying vec3 vL; varying float vSeed;
void main(){
  float span = max(uBox.y - uBox.x, 1.); float z = uBox.x + mod(aP.z - uBox.x + uTime * aS.z * uBox.w, span);
  float ends = smoothstep(0., 0.12, (z - uBox.x) / span) * (1. - smoothstep(0.88, 1., (z - uBox.x) / span));
  vec3 c = (modelMatrix * vec4(aP.x, aP.y + sin(uTime * 0.7 + aP.w * 40.) * 0.25, z, 1.)).xyz;
  vec3 tc = cameraPosition - c; vec2 f = tc.xz; float fl = length(f); f = fl > 1e-4 ? f / fl : vec2(0., 1.);
  vec3 right = vec3(f.y, 0., -f.x);
  vec3 w = c + right * position.x * aS.x + vec3(0., position.y * aS.y, 0.);
  vUv = position.xy * 2.; vW = w; vSeed = aP.w; vL = (inverse(modelMatrix) * vec4(w, 1.)).xyz;   // vL: the same place in the mesh's own frame (the ground map's)
  vA = aS.w * ends * smoothstep(uBox.z, uBox.z * 3.5, length(tc));
  // it lies level: seen from steeply above a sheet is not a dash but nothing; and the slab between it and the eye hides it
  float tl = max(length(tc), 1e-3); vA *= 1. - smoothstep(0.5, 0.85, abs(tc.y) / tl);
  float lo = min(cameraPosition.y, c.y), hi = max(cameraPosition.y, c.y), ov = max(0., min(hi, uSlab.y) - max(lo, uSlab.x));
  vA *= exp(-uSlab.z * tl * ov / max(hi - lo, 0.01));
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
}`,Re=`
${te}
uniform vec4 uTint; uniform vec4 uBox; uniform sampler2D uGround; uniform vec4 uGBox; uniform vec4 uGH;
varying vec2 vUv; varying float vA; varying vec3 vW; varying vec3 vL; varying float vSeed;
void main(){
  // a bell both ways: no flat core with a rim, so a far sheet is a breath and never a bar
  float ax = 1. - smoothstep(0.05, 1., abs(vUv.x)), ay = 1. - smoothstep(0., 1., abs(vUv.y)); float a = ax * ax * ay * ay;
  // a sheet fades to nothing where it meets a solid: over the ground map's height under it (red: what stands still; green: what
  // travels, read in its own frame), under a lintel (blue), and at the lens itself (each part of a wide sheet by its own distance)
  vec2 guv = (vL.xz - uGBox.xy) * uGBox.zw; vec4 gt = texture2D(uGround, guv); float gmv = texture2D(uGround, guv - vec2(0., uGH.z * uGBox.w)).g;
  float gy = uGH.x + uGH.y * max(gt.r, gmv);
  a *= smoothstep(gy + 0.1, gy + 0.1 + uGH.w, vL.y);
  if (gt.b < 0.995) { float cy = uGH.x + uGH.y * gt.b; a *= 1. - smoothstep(cy - uGH.w, cy, vL.y); }
  a *= smoothstep(uBox.z * 0.6, uBox.z * 3., distance(vW, cameraPosition));
  a *= 0.55 + 0.45 * fzNoise(vec3(vW.x * 0.25, vW.y * 0.9 + vSeed * 9., vW.z * 0.25 - uTime * 0.15));
  gl_FragColor = vec4(fzMix(fzFogCol(vW.y), uTint.rgb, uTint.a), clamp(a * vA, 0., 1.));
}`;function _e({z0:o=-40,z1:t=40,nearFade:n=4,speed:r=1,tint:i=U[4],tintAmt:e=0,ground:a=null}={}){const s=W(i),c=a||Ie;return new p.ShaderMaterial({uniforms:{...P,uBox:{value:new p.Vector4(o,t,n,r)},uTint:{value:new p.Vector4(s.r,s.g,s.b,e)},uGround:{value:c.tex},uGBox:{value:new p.Vector4(c.x0,c.z0,1/(c.x1-c.x0),1/(c.z1-c.z0))},uGH:{value:new p.Vector4(c.h0,c.hs,0,c.soft)}},vertexShader:Ee,fragmentShader:Re,transparent:!0,depthWrite:!1})}const Me=(o,t,n)=>{const r=new p.DataTexture(o,t,n,p.RGBAFormat,p.UnsignedByteType);return r.magFilter=p.LinearFilter,r.minFilter=p.LinearFilter,r.needsUpdate=!0,r},Ie={tex:Me(new Uint8Array([0,0,255,255]),1,1),x0:0,z0:0,x1:1,z1:1,h0:-1e4,hs:0,soft:1};async function Ue({x0:o,x1:t,z0:n,z1:r,nx:i,nz:e,h0:a,hs:s,soft:c=1.2},w,z=null){const d=new Uint8Array(i*e*4),y=x=>ee(Math.round((x-a)/s*255),0,254),b=[a,a,null];for(let x=0;x<e;x++){const S=_(n,r,(x+.5)/e);for(let q=0;q<i;q++){const g=(x*i+q)*4;b[0]=a,b[1]=a,b[2]=null,w(_(o,t,(q+.5)/i),S,b),d[g]=y(b[0]),d[g+1]=y(b[1]),d[g+2]=b[2]==null?255:y(b[2]),d[g+3]=255}z&&x%12===11&&await z()}return{tex:Me(d,i,e),x0:o,z0:n,x1:t,z1:r,h0:a,hs:s,soft:c}}function Ge(o){const t=new p.InstancedBufferGeometry,n=new p.PlaneGeometry(1,1);t.index=n.index,t.setAttribute("position",n.getAttribute("position"));const r=new Float32Array(o.length*4),i=new Float32Array(o.length*4);return o.forEach((e,a)=>{r.set([e.x,e.y,e.z,e.seed??a*.618%1],a*4),i.set([e.w,e.h,e.speed??2,e.opacity??.5],a*4)}),t.setAttribute("aP",new p.InstancedBufferAttribute(r,4)),t.setAttribute("aS",new p.InstancedBufferAttribute(i,4)),t.instanceCount=o.length,t}class ne{constructor(){this.p=[],this.vs=[],this.c=[],this.i=[],this.n=0,this.center=[0,0,0],this.v=0,this.s=0,this.mat=null}vert(t,n,r,i=this.v,e=this.s){if(this.mat){const a=this.mat.elements,s=t,c=n,w=r;t=a[0]*s+a[4]*c+a[8]*w+a[12],n=a[1]*s+a[5]*c+a[9]*w+a[13],r=a[2]*s+a[6]*c+a[10]*w+a[14]}return this.p.push(t,n,r),this.vs.push(i,e),this.c.push(this.center[0],this.center[1],this.center[2]),this.n++}quad(t,n,r,i,e=this.v,a=this.s){const s=this.vert(t[0],t[1],t[2],e,a);this.vert(n[0],n[1],n[2],e,a),this.vert(r[0],r[1],r[2],e,a),this.vert(i[0],i[1],i[2],e,a),this.i.push(s,s+1,s+2,s,s+2,s+3)}tri(t,n,r,i=this.v,e=this.s){const a=this.vert(t[0],t[1],t[2],i,e);this.vert(n[0],n[1],n[2],i,e),this.vert(r[0],r[1],r[2],i,e),this.i.push(a,a+1,a+2)}rings(t,n=!0){const r=t[0].length,i=this.n;for(const e of t)for(const a of e)this.vert(a[0],a[1],a[2],a[3]??this.v,a[4]??this.s);for(let e=0;e+1<t.length;e++)for(let a=0;a<(n?r:r-1);a++){const s=i+e*r+a,c=i+e*r+(a+1)%r,w=s+r,z=c+r;this.i.push(s,c,z,s,z,w)}}hexa(t,n,r=this.v,i=this.s){for(let e=0;e<4;e++)this.quad(t[e],t[(e+1)%4],n[(e+1)%4],n[e],r,0);this.quad(n[0],n[1],n[2],n[3],r,i),this.quad(t[3],t[2],t[1],t[0],r,0)}box(t,n,r,i,e,a,s=this.v,c=this.s){this.hexa([[t,r,e],[n,r,e],[n,r,a],[t,r,a]],[[t,i,e],[n,i,e],[n,i,a],[t,i,a]],s,c)}build(){const t=new p.BufferGeometry;return t.setAttribute("position",new p.Float32BufferAttribute(this.p,3)),t.setAttribute("aVS",new p.Float32BufferAttribute(this.vs,2)),t.setAttribute("aC",new p.Float32BufferAttribute(this.c,3)),t.setIndex(this.n>65535?new p.Uint32BufferAttribute(this.i,1):new p.Uint16BufferAttribute(this.i,1)),t.computeBoundingSphere(),t}get tris(){return this.i.length/3}}const pe=(o,t,n)=>{const r=Math.abs(o);return t<n.ys?Math.max(r-n.hw,n.y0-t):Math.hypot(r+n.cx,t-n.ys)-(n.hw+n.cx)},ze=(o,t=0)=>o.ys+Math.sqrt(Math.max((o.hw+o.cx+t)**2-o.cx*o.cx,0));function Se(o,t,n,r){const i=o.hw+o.cx+n,e=Math.acos(ee(o.cx/i,-1,1));if(t<=0)return[-(o.hw+n),o.y0];if(t>=2+2*r)return[o.hw+n,o.y0];if(t<=r+1){const s=e*(t-1)/r;return t<1?[-(o.hw+n),_(o.y0,o.ys,t)]:[o.cx-i*Math.cos(s),o.ys+i*Math.sin(s)]}const a=Se(o,2+2*r-t,n,r);return[-a[0],a[1]]}function ye(o,t,n,r,i=0){const e=[];for(let a=0;a<=2+2*r;a++)e.push(n.map(s=>{const c=Se(t,a,s[0],r);return[c[0]+(t.x||0),c[1],i+s[1],s[2]??0,s[3]??0]}));o.rings(e,!1)}function me(o,t,n,r,i=.22,e=.12){const a=[[t,o,0],[t,o+e,.15],[n+.12,o+e,.25],[n,o,-.5]],s=n,c=o,w=0,z=i,d=Math.hypot(s-w,c-z),y=-(c-z)/d,b=(s-w)/d;for(let x=0;x<r;x++){const S=_(s,w,x/r),q=_(c,z,x/r),g=_(s,w,(x+1)/r),m=_(c,z,(x+1)/r),T=d/r/2;for(let D=1;D<=5;D++){const O=Math.PI*D/6,k=(1-Math.cos(O))/2,E=Math.sin(O)*T*.9;a.push([_(S,g,k)+y*E,_(q,m,k)+b*E,[-.3,1,2.5,1,-.3][D-1]])}a.push([g,m,-1])}return a.concat(a.slice().reverse().map(x=>[x[0],-x[1],x[2]]))}function ue(o,t,n,r,i=0){const e=[];for(let a=0;a<t.length;a++){const s=t[Math.max(a-1,0)],c=t[Math.min(a+1,t.length-1)],w=Math.hypot(c[0]-s[0],c[1]-s[1])||1,z=-(c[1]-s[1])/w,d=(c[0]-s[0])/w,y=t[a],b=(y[2]??1)*n*.5,x=b*.45,S=[[b,r-x,1],[b-x,r,2.5],[-b+x,r,2.5],[-b,r-x,1],[-b,-r+x,-.3],[-b+x,-r,2.5],[b-x,-r,2.5],[b,-r+x,-.3]];e.push(S.map(q=>[y[0]+z*q[0],y[1]+d*q[0],i+q[1],q[2],0]))}o.rings(e,!0);for(const a of[e[0],e[e.length-1]])o.quad(a[0],a[1],a[2],a[3],-.6,0),o.quad(a[0],a[3],a[4],a[7],-.6,0),o.quad(a[4],a[5],a[6],a[7],-.6,0)}const se={W:34,zf:1.2,main:{hw:4.5,y0:6.5,ys:27,cx:7.78},door:{hw:1.6,y0:0,ys:2.3,cx:1.2}};async function Ze(o,t,n,r){const{W:i,zf:e,main:a,door:s}=se,c=.45,w=.6,z=1.8,d=76,y=74,b=-d*c/2,x=[0,1].map(()=>({h0:t.range(28.5,33),slope:t.range(.5,1.3),bite:t.range(.6,2.2),seed:t.range(0,50)})),S=t.range(-1.5,1.5),q=t.range(40.6,42.2),g={x:t.sign()*t.range(11,16),y:t.range(24,31),r:t.range(2.5,4.5)},m=(l,u)=>{const f=Math.sin(l*127.1+u*311.7+x[0].seed*.37)*43758.5453;return f-Math.floor(f)},T=l=>l<a.hw+1.95?a.ys+Math.sqrt(Math.max((a.hw+a.cx+1.95)**2-(l+a.cx)**2,0))+.8:0,D=l=>{const u=Math.abs(l),f=x[l<0?0:1],h=M=>q+.9-.42*Math.abs(M-S);let v=u<7.4?h(l):Math.max(f.h0-(u-8.6)*f.slope,h(Math.sign(l)*7.4)-(u-7.4)*3.4);return u>15.4&&(v=Math.min(v,27-(u-15.4)*7.5)),v},O=l=>{const u=Math.abs(l);return Math.max(T(u),Math.abs(u-12.5)<2.7?22.6:u>15.4?12.5:17.5)},k=[0],E=[],Z=[];for(let l=0;k[l]<d;l++){const u=m(l,1.3);k.push(Math.min(d,k[l]+(u<.5?1+Math.floor(u*6):4+Math.floor((u-.5)*11))))}for(let l=0;l<k.length;l++){const u=b+k[l]*c,f=Math.abs(u),h=f<7.4?1.1:1.9;let v=D(u)+(m(l,2.7)-.5)*2*h-(m(l,4.1)<.16?2+3.5*m(l,5.9):0);const M=(u-(g.x-g.r))/(2*g.r);M>0&&M<1&&(v=Math.min(v,g.y-3.5+5*M));const L=m(l,7.3)<.42?(m(l,8.9)-.5)*5.5:0;E.push(Math.max(v,O(u))),Z.push(Math.max(v+L,O(u)))}const N=new Float32Array(d),C=new Float32Array(d);for(let l=0;l+1<k.length;l++)for(let u=k[l];u<k[l+1];u++){const f=k[l+1]-k[l];N[u]=_(Z[l],E[l+1],(u-k[l])/f),C[u]=_(Z[l],E[l+1],(u+1-k[l])/f);const h=b+u*c;N[u]=Math.max(N[u],T(Math.abs(h))),C[u]=Math.max(C[u],T(Math.abs(h+c)))}const G=l=>{const u=ee(Math.floor((l-b)/c),0,d-1);return Math.min(N[u],C[u])},J=new Uint8Array(d*y);for(let l=0;l<y;l++)for(let u=0;u<d;u++){const f=b+(u+.5)*c,h=(l+.5)*w;let v=(l+1)*w<=Math.min(N[u],C[u])?1:0;(pe(f,h,a)<1.4||pe(f,h,s)<.6)&&(v=0),h<1&&(v=Math.abs(f)>2.2?1:0),J[l*d+u]=v}const $=(l,u)=>l<0||u<0||l>=d||u>=y?0:J[u*d+l];for(let l=0;l<y;l++){const u=l*w,f=u+w;for(let h=0;h<d;h++){if(!$(h,l))continue;let v=h;for(;$(v+1,l);)v++;const M=b+h*c,L=b+(v+1)*c;o.quad([M,u,e],[L,u,e],[L,f,e],[M,f,e]),o.quad([L,u,-e],[M,u,-e],[M,f,-e],[L,f,-e]);for(let B=h;B<=v;B++){const A=b+B*c,V=A+c;!$(B,l+1)&&(l+2)*w<=Math.min(N[B],C[B])&&o.quad([A,f,e],[V,f,e],[V,f,-e],[A,f,-e],-.25,0),!$(B,l-1)&&l>0&&o.quad([A,u,-e],[V,u,-e],[V,u,e],[A,u,e],-.7,0)}o.quad([M,u,-e],[M,u,e],[M,f,e],[M,f,-e],-.45,0),o.quad([L,u,e],[L,u,-e],[L,f,-e],[L,f,e],-.45,0),h=v}l%20===19&&await r.yield()}for(let l=0;l<=d;l++){const u=b+l*c,f=u+c,h=l<d?Math.floor(Math.min(N[l],C[l])/w+1e-6)-1:-1,v=l<d&&h>=0&&$(l,h);if(v){const V=(h+1)*w,j=N[l],F=C[l];o.quad([u,V,e],[f,V,e],[f,F,e],[u,j,e]),o.quad([f,V,-e],[u,V,-e],[u,j,-e],[f,F,-e]),o.quad([u,j,e],[f,F,e],[f,F,-e],[u,j,-e],-.25,0)}const M=l>0?Math.floor(Math.min(N[l-1],C[l-1])/w+1e-6)-1:-1,L=l>0&&M>=0&&$(l-1,M),B=L?C[l-1]:v?(h+1)*w-0:0,A=v?N[l]:L?(M+1)*w:0;if((v||L)&&Math.abs(B-A)>.02){const V=Math.min(B,A,v?(h+1)*w:1e9,L?(M+1)*w:1e9),j=Math.max(B,A);o.quad([u,V,-e],[u,V,e],[u,j,e],[u,j,-e],-.45,0)}}{const l=-Math.sign(g.x)||1,u=l*(10.6+m(3,9.1)*1.6),f=G(u)-.6,h=4.2+m(5,9.7)*2.2,v=.7+m(7,3.3)*.5;o.mat=new p.Matrix4().makeRotationZ(-l*(.1+m(9,2.1)*.07)).setPosition(u,f,0),o.hexa([[-v,0,-e*.92],[v,0,-e*.92],[v,0,e*.92],[-v,0,e*.92]],[[-v*.85,h*(l>0?.72:1),-e*.9],[v*.7,h*(l>0?1:.72),-e*.9],[v*.7,h*(l>0?1:.72),e*.9],[-v*.85,h*(l>0?.72:1),e*.9]],0,0),o.mat=null}ye(o,a,me(e,1.95,1.2,3),14),ye(o,s,me(e,1.25,.34,1,.5,.08),6);{const l=me(e,1.95,1.2,3),u=l.length,f=l.slice(3,u-3);for(const h of[-1,1])for(const[v,M,L]of[[13.2,.3,.1],[20.4,.3,.1],[a.ys-.55,.55,.17]]){const B=v+t.range(-.3,.3);t.range(-.3,.3);const A=(V,j,F,Y)=>f.map(X=>{const be=Math.hypot(X[0]-.3,X[1])||1;return[h*(a.hw+X[0]-j*.75+j*.25*(X[0]-.3)/be),B+V,X[1]+j*1.1*X[1]/be,F,Y]});o.rings([A(0,0,-.6,0),A(M*.3,L,.25,0),A(M*.75,L,.5,0),A(M*.76,L,.9,1),A(M,L*.2,.9,1)],!1)}}const R=a.hw+1.95,oe=a.y0;for(const l of[1,-1])o.hexa([[-R,5.25,0],[R,5.25,0],[R,5.25,l*(e+.42)],[-R,5.25,l*(e+.42)]],[[-R,oe+.05,0],[R,oe+.05,0],[R,oe-.5,l*(e+.42)],[-R,oe-.5,l*(e+.42)]],.1,0);for(const l of[1,-1])o.box(-R,R,oe-.52,oe-.4,Math.min(l*(e+.2),l*(e+.46)),Math.max(l*(e+.2),l*(e+.46)),.1,1);for(const l of[1,-1])for(const u of[1,-1]){const f=u*2.95,h=u*(i/2+.15),v=l*e,M=l*(e+.34);o.box(Math.min(f,h),Math.max(f,h),0,1,Math.min(v,M),Math.max(v,M),-.15,0),o.hexa([[f,1,v],[h,1,v],[h,1,M],[f,1,M]],[[f,1.45,v],[h,1.45,v],[h,1.42,l*(e+.05)],[f,1.42,l*(e+.05)]],.2,0);const L=u*(R-.1),B=l*(e+.26);o.hexa([[L,5.3,v],[h,5.3,v],[h,5.38,B],[L,5.38,B]],[[L,5.72,v],[h,5.72,v],[h,5.6,B],[L,5.6,B]],.25,0)}const I=(l,u,f,h)=>{let v=0;for(const[M,L]of f){const B=h*e,A=h*(e+L),V=l-u/2,j=l+u/2,F=v+M,Y=L*3.2;o.hexa([[V,v,B],[j,v,B],[j,v,A],[V,v,A]],[[V,F+Y,B],[j,F+Y,B],[j,F,A],[V,F,A]],.05,0),o.hexa([[V-.1,F-.28,B],[j+.1,F-.28,B],[j+.1,F-.28,A+h*.12],[V-.1,F-.28,A+h*.12]],[[V-.1,F+Y,B],[j+.1,F+Y,B],[j+.1,F,A+h*.12],[V-.1,F,A+h*.12]],.3,0),o.box(V-.12,j+.12,F+Y-.02,F+Y+.1,Math.min(B,B+h*.26),Math.max(B,B+h*.26),.3,0),v=F-.01}};for(const l of[-1,1]){const u=x[l<0?0:1].h0-1.5;I(l*8.7,1.9,[[11,2.5],[u*.36,1.7],[u*.64-11,.95]],1),I(l*8.7,1.9,[[9,1.3],[u*.5,.7]],-1),I(l*16.1,1.7,[[7.5,1.9],[6.5,1]],1),I(l*16.1,1.7,[[8,1]],-1)}const K={x:0,y:a.ys+5,r:2.15},Q=t.sign(),re=t.range(.7,1),le=[];for(let l=0;l<=10;l++){const u=l/10;le.push([Q*(a.hw+.05-5.4*(1-Math.cos(u))),a.ys-1.5+5.4*Math.sin(u)+1.5*u])}ue(o,le,.4,.3),ue(o,[[Q*(a.hw+.1),a.ys-1.9],[Q*(a.hw-.35),a.ys-1.5]],.7,.42);const ce=le[10],fe=Math.atan2(ce[1]-K.y,Math.abs(ce[0])),ie=(l,u=K.r)=>[K.x+Q*Math.cos(l)*u,K.y+Math.sin(l)*u],H=[];for(let l=0;l<=8;l++)H.push(ie(_(fe,fe+re,l/8)));ue(o,H,.5,.32);{const l=fe+re*.45,u=.24;ue(o,[ie(l-u),[...ie(l,K.r-.62),.6],ie(l+u)],.3,.2)}const xe=H[8];return{sh:x,peak:q,lean:S,perch:xe,topY:G}}function Ke(o,t,n,r,i,e,a,s=null){const d=Math.round(n/.45),y=Math.round(r/.6),b=new Uint8Array(d*y);for(let g=0;g<y;g++)for(let m=0;m<d;m++){const T=t+(m+.5)*.45,D=(g+.5)*.6,O=.5*(g&1);b[g*d+m]=(!s||(g+1)*.6<=Math.min(s(m,0),s(m,1)))&&a(s?T:(Math.floor(T/1.8+O)+.5-O)*1.8,D,T)?1:0}const x=(g,m)=>g<0||m<0||g>=d||m>=y?0:b[m*d+g],S=i+e,q=i-e;for(let g=0;g<y;g++)for(let m=0;m<d;m++){if(!x(m,g))continue;const T=t+m*.45,D=T+.45,O=g*.6,k=O+.6;o.quad([T,O,S],[D,O,S],[D,k,S],[T,k,S]),o.quad([D,O,q],[T,O,q],[T,k,q],[D,k,q]),x(m,g+1)||o.quad([T,k,S],[D,k,S],[D,k,q],[T,k,q],-.25,0),!x(m,g-1)&&g>0&&o.quad([T,O,q],[D,O,q],[D,O,S],[T,O,S],-.7,0),x(m-1,g)||o.quad([T,O,q],[T,O,S],[T,k,S],[T,k,q],-.45,0),x(m+1,g)||o.quad([D,O,S],[D,O,q],[D,k,q],[D,k,S],-.45,0)}if(s)for(let g=0;g<=d;g++){const m=t+g*.45,T=m+.45,D=N=>Math.floor(Math.min(s(N,0),s(N,1))/.6+1e-6)-1,O=g<d?D(g):-1,k=O>=0&&x(g,O),E=g>0?D(g-1):-1,Z=E>=0&&x(g-1,E);if(k){const N=(O+1)*.6,C=s(g,0),G=s(g,1);o.quad([m,N,S],[T,N,S],[T,G,S],[m,C,S]),o.quad([T,N,q],[m,N,q],[m,C,q],[T,G,q]),o.quad([m,C,S],[T,G,S],[T,G,q],[m,C,q],-.25,0)}if(k||Z){const N=Math.min(k?(O+1)*.6:1e9,Z?(E+1)*.6:1e9),C=Math.max(k?s(g,0):0,Z?s(g-1,1):0);C-N>.02&&o.quad([m,N,q],[m,N,S],[m,C,S],[m,C,q],-.45,0)}}}function $e(o,t,n,r,i,e=1.25){const s=(z,d,y,b=0,x=.22,S=0)=>{const q=[];for(let g=0;g<16;g++){const m=g/16*Math.PI*2,T=z*(1+x*Math.cos(m*4));q.push([n+Math.cos(m)*T,d+S*Math.cos(m-c)*z,r+Math.sin(m)*T,y+(g%4===2?-.5:0),b])}return q},c=t.range(0,6.28),w=t.range(.25,.9);if(o.rings([s(e*1.55,0,-.1,0,.05),s(e*1.55,.7,-.1,0,.05),s(e*1.4,.95,.3,.9,.08),s(e*1.18,1.25,-.4,0,.15),s(e*1.22,1.5,.3,.6),s(e,1.8,0),s(e,i*.55,.05),s(e,i-w,0,0,.22,w),s(e*.55,i+.15,.1,1,.1,w*.6),s(.01,i+.3,.1,1,0,0)],!0),i>8.5){const z=n>0?-1:1,d=[];for(let y=0;y<=6;y++){const b=y/6*.75;d.push([n+z*(e*.6+3.2*(1-Math.cos(b))),i-1.2+3.2*Math.sin(b),1-y*.07])}ue(o,d,.75,.45,r)}}const ke={hw:6.5,y0:0,ys:12,cx:4.5};function Ye(o,t,n,r){const i=ke,e=.95,a=ze(i),s=t.range(0,40),c=t.sign(),w=z=>{const d=Math.sin(z*91.7+s*3.1)*43758.5453;return d-Math.floor(d)};Ke(o,-11.7,23.4,30,r,e,(z,d,y)=>{if(pe(y,d,i)<1)return!1;const x=Math.abs(z),S=i.hw+3.6+(d>i.ys?.4:0)+n.n2(d*.3,s)*.5;return!(x>S)},(z,d)=>{const y=-11.7+(z+d)*.45,b=Math.abs(y),x=Math.floor(z/3+w(Math.floor(z/7))*1.5);return Math.max(a+2.6-b*(y*c>0?.95:.45)+n.n2(y*.5,s+5)*1.4+(w(x+40)-.5)*2.6-(w(x+80)<.18?2.5:0),b<i.hw+1.6?i.ys+Math.sqrt(Math.max((i.hw+i.cx+1.6)**2-(b+i.cx)**2,0))+.7:9)}),ye(o,i,me(e,1.6,.7,2,.2,.1),12,r);for(const z of[-1,1])for(const d of[1,-1]){const y=z*(i.hw+.2),b=z*(i.hw+4),x=r+d*e,S=r+d*(e+.4);o.box(Math.min(y,b),Math.max(y,b),0,1.1,Math.min(x,S),Math.max(x,S),-.15,0),o.hexa([[y,11.4,x],[b,11.4,x],[b,11.5,x+d*.3],[y,11.5,x+d*.3]],[[y,11.9,x],[b,11.9,x],[b,11.75,x+d*.3],[y,11.75,x+d*.3]],.25,0)}}function Xe(o,t,n,r,i){const e=t.range(1.7,2.9),a=e*t.range(.42,.55),s=.11,c=t.chance(.6);if(o.mat=new p.Matrix4().makeRotationFromEuler(new p.Euler(t.range(-.22,.22),t.range(-.5,.5),t.range(-.3,.3))).setPosition(n,r-.3,i),o.hexa([[-s,0,-s*.7],[s,0,-s*.7],[s,0,s*.7],[-s,0,s*.7]],[[-s*.8,e,-s*.6],[s*.8,e,-s*.6],[s*.8,e,s*.6],[-s*.8,e,s*.6]],0,.9),o.box(-a,a,e*.68,e*.68+s*1.8,-s*.6,s*.6,.1,1),c)for(const w of[-1,1])o.hexa([[0,e+.02,-s*1.6],[w*(a+.12),e*.68+.02,-s*1.6],[w*(a+.12),e*.68+.02,s*1.6],[0,e+.02,s*1.6]],[[0,e+.16,-s*1.6],[w*(a+.2),e*.68+.1,-s*1.6],[w*(a+.2),e*.68+.1,s*1.6],[0,e+.16,s*1.6]],-.2,1);o.mat=null}const ve=new p.Vector3,Je=new p.Vector3,Qe=new p.Vector3,et=new p.Quaternion;function tt(o,t){return ve.set(t()-.5,t()-.5,t()-.5).cross(o),ve.lengthSq()<1e-6&&ve.set(1,0,0).cross(o),ve.normalize()}function de(o,t,n){return o.clone().applyQuaternion(et.setFromAxisAngle(tt(o,n),t)).normalize()}function ot(o,t,n,r){const i=[];for(let e=0;e<t.length;e++){const a=Je.subVectors(t[Math.min(e+1,t.length-1)],t[Math.max(e-1,0)]).normalize(),s=ve.set(.31,.2,.93).cross(a).normalize().clone(),c=Qe.crossVectors(a,s).clone(),w=[];for(let z=0;z<r;z++){const d=z/r*Math.PI*2+e*.4,y=Math.cos(d)*n[e],b=Math.sin(d)*n[e],x=(s.y*y+c.y*b)/Math.max(n[e],1e-4);w.push([t[e].x+s.x*y+c.x*b,t[e].y+s.y*y+c.y*b,t[e].z+s.z*y+c.z*b,z&1?-.25:0,ee(x,0,1)*Le(.045,.15,n[e])])}i.push(w)}o.rings(i,!0)}function qe(o,t,n,r,i,e,a,s,c){const w=s===0,z=w?4:3+(n()<.45?1:0),d=[r.clone()],y=[a],b=[i.clone()];let x=i.clone(),S=r.clone();for(let m=1;m<=z;m++){if(x=de(x,w?n.range(.08,.28):s===1?n.range(.3,.7):n.range(.45,.95),n),!w){x.y+=m<z?s===1?.45:.25:s>=2?-.4:.1;const T=Math.hypot(S.x-c.x,S.z-c.z)||1;x.x+=(S.x-c.x)/T*.18,x.z+=(S.z-c.z)/T*.18,x.normalize()}if(S=S.clone().addScaledVector(x,e/z*n.range(.7,1.3)),c.keepOut&&c.keepOut(S)){if(m===1)return;break}d.push(S),b.push(x.clone()),y.push(a*_(1,w?.72:.42,m/z)*(m<z&&!w?n.range(.95,1.2):1))}w&&(d.unshift(r.clone().addScaledVector(i,-1.2)),y.unshift(a*1.75),d.splice(1,0,r.clone().addScaledVector(i,.9)),y.splice(1,0,a*1.25),y[2]=a*1.02),ot(o,d,y,s<2?7:5);const q=w?3:1,g=d.length-1;if(s<3){for(let m=q;m<=g;m++){const T=m===g?2:w?n()<.6?2:1:n()<.8?1:0;for(let D=0;D<T;D++){const O=de(b[Math.min(m-(w?2:0),b.length-1)],m===g?n.range(.35,.7):n.range(.8,1.35),n);s<1?O.y=Math.abs(O.y)*.5+.75:s<2&&(O.y=Math.abs(O.y)*.6+.2),O.normalize(),qe(o,t,n,d[m],O,e*(w?n.range(.85,1.2):n.range(.55,.7)),y[m]*(m===g?.85:n.range(.5,.68)),s+1,c)}}if(s<2)return}for(let m=1;m<=g;m++){const T=Math.round((m===g?3:2)*c.twigs*n.range(.6,1.4));for(let D=0;D<T;D++){let O=de(b[Math.min(m,b.length-1)],n.range(.4,1.2),n),k=d[m].clone(),E=Math.min(y[m]*.9,.11);const Z=n.range(1.2,2.8)*(s===3?1:1.3);for(let N=0;N<3;N++){const C=k.clone().addScaledVector(O,Z/3);t.push(k.x,k.y,k.z,C.x,C.y,C.z,E*2),k=C,E*=.62,O=de(O,n.range(.3,.8),n),O.y-=.28,O.normalize()}if(n()<.07*c.leaves){const N=n.range(.22,.4),C=n.range(0,3.14),G=Math.cos(C)*N*.5,J=Math.sin(C)*N*.5;o.quad([k.x,k.y,k.z],[k.x+G,k.y-N*.6,k.z+J],[k.x,k.y-N*1.3,k.z],[k.x-G,k.y-N*.6,k.z-J],1,0)}}}}function at(o,t,n,r={}){const i={x:0,y:0,z:0,h:34,lean:.12,twigs:1,leaves:1,...r};o.center=[i.x,i.y,i.z];const e=n.range(0,6.28),a=new p.Vector3(Math.cos(e)*i.lean,1,Math.sin(e)*i.lean).normalize(),s=t.length/7;qe(o,t,n,new p.Vector3(i.x,i.y,i.z),a,i.h*.42,i.h*.036,0,i),t.cen||(t.cen=[]);for(let c=s;c<t.length/7;c++)t.cen.push(i.x,i.y,i.z);o.center=[0,0,0]}function nt(o,t,n,r,i=1.75){const e=i/1.75,a=t.range(-.05,.05),s=9,c=(w,z,d,y,b)=>{const x=[];for(let S=0;S<s;S++){const q=S/s*Math.PI*2;x.push([n+Math.cos(q)*z*e+a*w,w*e,r+(Math.sin(q)*d+y)*e,b+(S%3===0?-.5:0),0])}return x};o.rings([c(0,.36,.3,.05,-.2),c(.45,.31,.26,.03,0),c(1.05,.25,.2,0,.1),c(1.36,.29,.19,-.02,.15),c(1.47,.2,.17,-.04,-.3),c(1.58,.17,.19,-.03,.1),c(1.72,.13,.17,.02,.2),c(1.8,.02,.03,.12,.2)],!0)}function st(o,t,n,r,i=1){const e=.36*i,a=1.05*i;o.hexa([[t-e*.8,r,n-a],[t+e*.8,r,n-a],[t+e,r,n+a*.4],[t-e,r,n+a*.4]].concat([]),[[t-e*.8,r+.4,n-a],[t+e*.8,r+.4,n-a],[t+e,r+.4,n+a*.4],[t-e,r+.4,n+a*.4]],.25,0),o.hexa([[t-e,r,n+a*.4],[t+e,r,n+a*.4],[t+e*.6,r,n+a],[t-e*.6,r,n+a]],[[t-e,r+.4,n+a*.4],[t+e,r+.4,n+a*.4],[t+e*.6,r+.4,n+a],[t-e*.6,r+.4,n+a]],.25,0),o.hexa([[t-e,r+.4,n-a],[t+e,r+.4,n-a],[t+e,r+.4,n+a],[t-e,r+.4,n+a]],[[t-.05,r+.56,n-a*.9],[t+.05,r+.56,n-a*.9],[t+.05,r+.56,n+a*.9],[t-.05,r+.56,n+a*.9]],.5,0)}function it(){const o=new ne,t=[],n=(i,e,a)=>[[0,a+e,i],[e*.9,a,i],[0,a-e*.8,i],[-e*.9,a,i]];for(o.rings([n(-.2,.02,0),n(-.1,.07,0),n(.1,.09,0),n(.24,.06,.02),n(.31,.055,.03),n(.36,.03,.02),n(.47,.004,0)],!0);t.length<o.n;)t.push(0);for(o.quad([-.09,0,-.16],[.09,0,-.16],[.13,0,-.42],[-.13,0,-.42],-.3,0),o.tri([-.13,0,-.42],[.13,0,-.42],[0,0,-.47],-.3,0);t.length<o.n;)t.push(0);for(const i of[-1,1]){const e=(s,c)=>[i*s,.02,c],a=(s,c)=>{s.length===4?o.quad(s[0],s[1],s[2],s[3],c,0):o.tri(s[0],s[1],s[2],c,0);for(const w of s)t.push(w[0])};a([e(.04,.18),e(.27,.25),e(.27,-.12),e(.04,-.16)],.1),a([e(.27,.25),e(.45,.21),e(.47,-.1),e(.27,-.12)],-.1);for(let s=0;s<5;s++){const c=-.15+s*.33,w=Math.cos(c),z=Math.sin(c),d=.45,y=.17-s*.06,b=.24-s*.02;a([e(d,y+.035),e(d+w*b,y-z*b),e(d,y-.045)],s&1?.15:-.2)}}const r=o.build();return r.setAttribute("aWing",new p.Float32BufferAttribute(t,1)),r}const rt=`
${te}
uniform vec3 uHome; uniform vec3 uGate; uniform vec3 uAway; uniform float uGo;
attribute vec2 aVS; attribute float aWing; attribute vec4 aR;
varying vec3 vW; varying vec3 vO; varying vec2 vVS; varying float vTone;
vec3 ravenAt(float lead){
  float ang = aR.x * 6.283 + (uTime + lead) * (7. / max(aR.y, 2.)) * (fract(aR.x * 7.) > 0.5 ? 1. : -1.);
  vec3 wheel = uHome + vec3(cos(ang) * aR.y, aR.z + sin(ang * 2. + aR.x * 9.) * 1.2, sin(ang) * aR.y * 0.8);
  float t = clamp((uGo - aR.w * 0.62) / 0.38 + lead * 0.06, 0., 1.);
  vec3 off = vec3(sin(aR.x * 40.), cos(aR.x * 23.), 0.) * vec3(1.6, 2.4, 0.);
  vec3 a = mix(wheel, uGate + off, smoothstep(0., 0.45, t));
  return mix(a, uAway + off * 3., smoothstep(0.4, 1., t)); }
void main(){
  vec3 c = ravenAt(0.), ahead = ravenAt(0.25); vec3 f = ahead - c; float fl = length(f); vec3 ad = uAway - uGate; f = fl > 1e-3 ? f / fl : ad / max(length(ad), 1e-4);
  vec3 r = cross(vec3(0., 1., 0.), f); float rl = length(r); r = rl > 1e-4 ? r / rl : vec3(1., 0., 0.); vec3 up = cross(f, r);
  float beat = sin(uTime * (7. + aR.x * 3.) + aR.x * 50.); float glide = smoothstep(-0.2, 0.6, sin(uTime * 0.5 + aR.x * 30.)) * (1. - step(0.02, uGo - aR.w * 0.62));
  float w = abs(aWing); vec3 p = position; p.y += w * (beat * mix(0.75, 0.12, glide) + 0.12) + w * w * beat * 0.5; p.x *= 1. - 0.18 * abs(beat) * (1. - glide);
  p *= 1.25;
  vec3 wp = (modelMatrix * vec4(c, 1.)).xyz + mat3(modelMatrix) * (r * p.x + up * p.y + f * p.z);
  vW = wp; vO = position * 6.; vVS = aVS; vTone = fzToneStep(distance(cameraPosition, wp));
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
}`;function lt(o,t,{home:n,gate:r,away:i,col:e=U[0]}){const a=new p.InstancedBufferGeometry().copy(it()),s=new Float32Array(t*4);for(let z=0;z<t;z++)s.set([o(),o.range(5,13),o.range(-3,4),(Math.floor(z/3)+o()*.3)/Math.max(1,Math.ceil(t/3))],z*4);a.setAttribute("aR",new p.InstancedBufferAttribute(s,4)),a.instanceCount=t;const c=new p.ShaderMaterial({uniforms:{...P,uCol:{value:W(e)},uCol2:{value:W(ae(e,U[2],.2))},uMode:{value:4},uSnowAmt:{value:0},uGrain:{value:1.2},uLift:{value:.12},uBody:{value:.4},uLeaf:{value:W(e)},uHome:{value:n.clone()},uGate:{value:r.clone()},uAway:{value:i.clone()},uGo:{value:0}},vertexShader:rt,fragmentShader:we,side:p.DoubleSide}),w=new p.Mesh(a,c);return w.frustumCulled=!1,w}const ct=`
${te}
uniform float uPhase; uniform float uFold; uniform float uAmp;
attribute vec2 aVS; attribute float aWing;
varying vec3 vW; varying vec3 vO; varying vec2 vVS; varying float vTone;
void main(){
  float beat = sin(uPhase), w = abs(aWing); vec3 p = position;
  p.y += (w * (beat * uAmp + 0.12) + w * w * beat * 0.5) * (1. - uFold) - w * 0.25 * uFold;
  p.x *= mix(1. - 0.18 * abs(beat), 0.3, uFold);
  vec4 wp = modelMatrix * vec4(p, 1.);
  vW = wp.xyz; vO = position * 6.; vVS = aVS; vTone = fzToneStep(distance(cameraPosition, modelMatrix[3].xyz));
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;function ht(o,{col:t=U[0],col2:n=null,grain:r=1.2}={}){const i=new p.ShaderMaterial({uniforms:{...P,uCol:{value:W(t)},uCol2:{value:W(n||ae(t,U[2],.2))},uMode:{value:4},uSnowAmt:{value:0},uGrain:{value:r},uLift:{value:.12},uBody:{value:.4},uLeaf:{value:W(t)},uPhase:{value:0},uFold:{value:0},uAmp:{value:.75}},vertexShader:ct,fragmentShader:we,side:p.DoubleSide}),e=new p.Mesh(o,i);return e.frustumCulled=!1,e}async function ut(o,t={}){const n=t.palette||U,r=ee(t.detail??o.quality?.detail??1,.6,1),i=o.rng,e=Te(Math.floor(i()*1e9)),a=!!t.courseZ,s=t.oaks??3,c=t.ground===!1?0:t.groundRadius??170;Be(n),t.standalone!==!1&&(P.uSlab.value.set(60,76,.16,0),P.uSplit.value=68,P.uHaze.value.set(5e-4,.008,0,5)),t.standalone!==!1&&!a&&P.uDrift.value.set(0,-6,.55),t.snow===!1&&(P.uSnow.value=0);const w=new p.Group,z=new p.Group;w.add(z),a&&(z.rotation.y=Math.PI);const d=(f,h)=>{const v=new p.Mesh(f,h);return v.frustumCulled=!1,z.add(v),v},y=new ne,b=await Ze(y,i,e,o);await o.yield();const x=[];for(let f=0;f<8;f++){const h=(f&1?1:-1)*7.2,v=-10-(f>>1)*12,M=f===2||f===5?i.range(9,12.5):i.range(2.6,7.5);y.center=[h,0,v],$e(y,i,h,v,M),x.push([h,M,v])}await o.yield(),y.center=[0,0,-60],Ye(y,i,e,-60),y.center=[0,0,0],await o.yield(),d(y.build(),he({mode:"ashlar",col:n[0],col2:ae(n[0],n[2],.24),snow:1,lift:.2,body:.5,centers:!0,side:p.DoubleSide})).name="stone";const S=(f,h)=>.05+(e.n2(f*.045,h*.045)*.5+.5)*.55+e.n2(f*.17,h*.17)*.12+(Math.abs(f)<18.5&&Math.abs(f)>2?.9*Math.exp(-Math.max(Math.abs(h)-1.3,0)/2.2):0)+(Math.abs(Math.abs(f)-7.2)<3&&h<-6&&h>-50?.35*Math.exp(-Math.abs(Math.abs(f)-7.2)):0);if(c>0){const f=new ne,h=30,v=72,M=[];for(let L=0;L<=h;L++){const B=.2+c*Math.pow(L/h,1.9),A=[];for(let V=0;V<v;V++){const j=V/v*Math.PI*2,F=Math.cos(j)*B,Y=Math.sin(j)*B-12,X=S(F,Y);A.push([F,X,Y,ee((X-.45)*1.6,-1,1),0])}M.push(A)}f.rings(M,!0),d(f.build(),he({mode:"snow",col:n[4],col2:n[2]}))}await o.yield();const q=new ne,g=[];for(let f=0;f<11;f++){let h=(f&1?1:-1)*i.range(4.5,21);const v=i.range(13,50),M=(h-5.7)*.927-(v-19)*.375;Math.abs(M)<2&&v<36&&(h+=(M<0?-1:1)*(2.4-Math.abs(M))),q.center=[h,0,v],Xe(q,i,h,S(h,v),v),g.push([h,v])}const m={x:11.6+i.range(-1,1),z:22+i.range(-3,5)},T=S(m.x,m.z)+.03;q.center=[m.x,0,m.z],q.quad([m.x-.6,T,m.z-1.2],[m.x+.6,T,m.z-1.2],[m.x+.6,T,m.z+1.2],[m.x-.6,T,m.z+1.2],-1,0);for(let f=0;f<7;f++){const h=f/7*6.28,v=.9+i()*.5,M=m.x+1.7,L=m.z+.2;q.tri([M,T+.75,L],[M+Math.cos(h)*v,T-.1,L+Math.sin(h)*v*1.4],[M+Math.cos(h+.9)*v,T-.1,L+Math.sin(h+.9)*v*1.4],f&1?-.3:.2,f%3?0:.6)}q.center=[0,0,0],d(q.build(),he({mode:"lines",col:n[0],grain:9,snow:1,centers:!0,side:p.DoubleSide})).name="graves";const D=f=>f.z>-4&&Math.abs(f.x+2.5)<8.5&&f.y>5||f.z<=-4&&Math.abs(f.x)<9.5||Math.abs(f.z)<2.6&&Math.abs(f.x)<18.5&&f.y<43,O=[[-12.5,10,37],[16,9,33],[19.5,-15,32],[-22,-13,31]].slice(0,s).map(([f,h,v])=>[f+i.range(-1.2,1.2),h+i.range(-1.2,1.2),v+i.range(-1,1)]),k=new ne,E=[];for(const[f,h,v]of O)at(k,E,i,{x:f,y:S(f,h)-.2,z:h,h:v,lean:i.range(.05,.2),twigs:r,leaves:t.leaves??1,keepOut:D}),await o.yield();s>0&&(d(k.build(),he({mode:"bark",col:n[0],leaf:ae(ae(n[0],n[5],.55),n[6],.3),body:.6,snow:1,centers:!0,side:p.DoubleSide})).name="oakWood",d(Pe(E),We({col:n[0],centers:!0})).name="oakTwigs"),await o.yield();const Z=he({mode:"lines",col:n[0],grain:7,snow:.25,side:p.DoubleSide}),N=new ne,C=new ne,G=2.2,J=2.05/1.75;[[C,0,2.1],[N,.12,2],[C,-.1,2],[C,.22,2.05],[N,-.2,1.95],[C,.1,2.1]].forEach(([f,h,v],M)=>nt(f,i,h,M*G,v)),st(N,.01,1.5*G,1.3*J,J);const $=d(N.build(),Z),R=d(C.build(),Z),I={x:5.5+i.range(-.3,.9)*.5+6*Math.sin(.384),z:19+6*Math.cos(.384),th:.384,len:17.5};$.rotation.y=I.th,R.rotation.y=I.th,$.name=R.name="monks";const K=O[0]||[-12,9,37],Q=lt(i,t.ravens??24,{home:new p.Vector3(K[0],K[2]-5,K[1]),gate:new p.Vector3(-1,20,0),away:new p.Vector3(0,9,-120),col:n[0]});z.add(Q);const re=[],le=Math.round(70*r);for(let f=0;f<le;f++)re.push({x:i.range(-30,30),y:i.range(.5,3.4),z:i.range(-90,60),w:i.range(11,26),h:i.range(1.4,3.6),speed:-i.range(2.8,5.2),opacity:i.range(.4,.72),seed:i()});const ce=(f,h,v)=>{const M=Math.abs(f);if(v[0]=.7,v[2]=null,!(M>25)){if(h>-3&&h<4.2)Math.abs(h)<1.9&&M<17.6&&(M<se.door.hw?v[2]=se.door.ys:v[0]=M<se.main.hw?se.main.y0+.3:99),(Math.abs(M-8.7)<1.3||Math.abs(M-16.1)<1.2&&h>-2.7&&h<3.6)&&(v[0]=99);else if(h<-7&&h>-49&&Math.abs(M-7.2)<2.2)for(const[L,B,A]of x)Math.hypot(f-L,h-A)<2.2&&(v[0]=Math.max(v[0],B+.4));else Math.abs(h+60)<1.7&&M>ke.hw-.4&&M<11.9&&(v[0]=99);for(const[L,B]of O)Math.abs(f-L)<2.4&&Math.hypot(f-L,h-B)<2.4&&(v[0]=99)}},fe=await Ue({x0:-44,x1:44,z0:-96,z1:66,nx:48,nz:88,h0:-1,hs:14,soft:1.3},ce,o.yield),ie=d(Ge(re),_e({z0:-90,z1:60,nearFade:3,ground:fe}));ie.renderOrder=5;const H=(f,h,v)=>a?new p.Vector3(f,h,v):new p.Vector3(-f,h,-v),xe={lancet:H(0,21,0),sill:H(0,se.main.y0,0),apex:H(0,ze(se.main),0),door:H(0,0,-1.6),flyThrough:[H(2.5,42,-70),H(2.5,28,-32),H(2.5,21,-11),H(2.5,19.5,0),H(2.2,18,14),H(1.2,15.5,36),H(0,13,60),H(0,10,90)],viewpoints:{reveal:H(0,42,-70),overGraves:H(2.5,26,-26),inWindow:H(2.5,19.5,0),nave:H(1.2,15.5,36)},choirArch:H(0,11,60),piers:x.map(([f,h,v])=>H(-f,h,-v)),graves:g.map(([f,h])=>H(-f,0,-h)),openGrave:H(-m.x,0,-m.z),ravenOak:H(-K[0],K[2],-K[1]),oaks:O.map(([f,h,v])=>H(-f,v,-h)),owlPerch:H(-b.perch[0],b.perch[1]+.45,0),monksStart:H(-I.x,0,-I.z),exitDirection:a?new p.Vector3(0,0,1):new p.Vector3(0,0,-1),portalSeat:null};let l=0;const u={object:w,radius:30,height:42,center:new p.Vector3(0,19,0),anchors:xe,style:P,setProgress(f){l=ee(f,0,1),Q.material.uniforms.uGo.value=l},setRavens(f){Q.material.uniforms.uGo.value=ee(f,0,1)},update(f,h,v){Ne(h,o.renderer);const M=I.len*l,L=M*4.2,B=I.x-Math.sin(I.th)*M,A=I.z-Math.cos(I.th)*M,V=S(B,A)-.12;$.position.set(B,V+Math.abs(Math.sin(L))*.04,A),R.position.set(B,V+Math.abs(Math.cos(L))*.04,A),$.rotation.z=Math.sin(L)*.012,R.rotation.z=-Math.sin(L)*.012},dispose(){},ground:!1,groundY:0,solidAt:(f,h,v)=>ce(-f,-h,v)};return u.update(0,0,null),u}export{ne as FzGeo,U as PALETTE,P as STYLE,De as STYLE_FRAG_GLSL,te as STYLE_GLSL,ut as buildHero,at as buildOak,he as fzMaterial,_e as fzMistMaterial,We as fzRibbonMaterial,Ge as mistGeometry,Ue as mistGround,ae as mixHex,nt as monkFigure,lt as ravenFlock,it as ravenGeometry,Pe as ribbonGeometry,Be as setPalette,ht as soloBird,Ne as tickStyle};
