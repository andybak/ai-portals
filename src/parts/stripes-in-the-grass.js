import*as r from"three";const Z0=["#14120F","#F3EFE4","#FF5A14","#E2BE62","#16787C"],F={black:0,white:1,orange:2,straw:3,teal:4},b0={repeat:2.4,column:.2,height:4,bridge1:1.15,bridge2:2.45,layerGap:.12};function Be(e=Z0){const a=e&&e.length>=5?e:Z0,t=a.slice(0,5).map(l=>new r.Color(l)),s={uTime:{value:0},uCan:{value:t},uRes:{value:new r.Vector2(800,450)},uSlide:{value:new r.Vector3(-.22,-.14,0)},uWind:{value:new r.Vector3(-1,0,3)},uThin:{value:new r.Vector3(150,300,500)},uMist:{value:new r.Vector2(160,120)}};return{palette:a.slice(0,5),cans:t,uniforms:s,update(l,p){s.uTime.value=l,p&&p.getDrawingBufferSize(s.uRes.value)}}}const w0=`
uniform float uTime; uniform vec3 uCan[5]; uniform vec2 uRes; uniform vec3 uSlide; uniform vec3 uWind; uniform vec3 uThin; uniform vec2 uMist;
float sHash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float sNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(sHash(i), sHash(i + vec2(1., 0.)), f.x), mix(sHash(i + vec2(0., 1.)), sHash(i + vec2(1., 1.)), f.x), f.y); }
// A razor cut: m is a mask whose 0.5 level is the knife line; aa = fwidth(m) taken by the caller; lift > 0 where the card lifted (blur).
float cutMask(float m, float aa, float lift){ float w = max(aa, 1e-4) * 0.75 + lift; return smoothstep(0.5 - w, 0.5 + w, m) * smoothstep(0.0, 0.1, m); }
// The same from a signed distance in metres (+ inside); px = metres per pixel.
float cutDist(float d, float px, float lift){ return clamp(d / max(px + lift, 1e-5) + 0.5, 0., 1.); }
// Distance is paint thinning. Returns the can's colour and how much of the pass is left at dist metres.
vec4 canAt(int can, float dist){
  vec3 c = uCan[can]; float keep = 1.;
  if (can == 0) keep = 1. - smoothstep(uThin.x * 0.72, uThin.x, dist);
  else if (can == 1 || can == 4) keep = 1. - smoothstep(uThin.y * 0.75, uThin.y, dist);
  vec3 sil = uCan[3] * vec3(0.93, 0.88, 0.80);                              // straw, a shade deeper than the fade
  c = mix(c, sil, smoothstep(uThin.y, uThin.z, dist) * (can == 2 || can == 3 ? 1. : 0.));
  keep *= 1. - smoothstep(uThin.z * 1.6, uThin.z * 2.6, dist);
  return vec4(c, keep);
}
// Aerosol stipple for soft zones (fades, halos): 1 = solid. Finer than 3 px it returns its flat average.
float stipple(vec2 q, float px, float cover){
  float g = 0.011; float fine = smoothstep(g * 0.33, g * 0.8, px);
  float h = sHash(floor(q / g)) * 0.7 + sHash(floor(q / (g * 2.3)) + 9.) * 0.3;
  return mix(smoothstep(cover - 0.18, cover + 0.18, 1. - h + (cover - 0.5)), cover, fine);
}
// THE CARD. The black shadow pass of the grass and the tiger's stripes are this one cut: tapering slivers in
// columns CARD.column wide, broken into islands, with two bridge gaps at heights shared by the whole card;
// the card comes round every CARD.repeat metres, sometimes flipped, now and then upside down by mistake.
// p = metres (along the stand, above the ground); returns signed distance in metres (+ inside an island).
float stripeSd(vec2 p){
  float card = floor(p.x / 2.4); float xl = p.x - card * 2.4; float y = p.y;
  float hc = sHash(vec2(card, 3.7));
  if (hc > 0.55) xl = 2.4 - xl;
  if (hc < 0.07) y = 4.0 - y;
  float j0 = floor(xl / 0.2); float best = -1.;
  for (int k = -1; k <= 1; k++) {
    float j = j0 + float(k); if (j < 0. || j > 11.) continue;
    float h1 = sHash(vec2(j, 1.3)), h2 = sHash(vec2(j, 5.1)), h3 = sHash(vec2(j, 8.7));
    float L = 0.72 + 0.62 * h1; float t = (y + h2 * 3.) / L; float seg = floor(t); float f = t - seg;
    float hs = sHash(vec2(j * 7. + 1., seg));
    float s = sin(3.14159 * f);
    float hw = (0.030 + 0.044 * h3) * (0.55 + 0.6 * hs) * sqrt(max(s, 0.)) - 0.013;
    hw *= step(0.14, hs);                                              // some islands were never cut
    hw = min(hw, (4.0 - 0.9 * h1 - y) * 0.06);                         // every sliver comes to a point at the top
    float xc = (j + 0.5) * 0.2 + (h2 - 0.5) * 0.07 * (y - 1.8) + 0.022 * sin(y * 1.9 + j * 2.3);
    best = max(best, hw - abs(xl - xc));
  }
  best = min(best, abs(y - 1.15) - 0.032); best = min(best, abs(y - 2.45) - 0.028);   // the bridges
  return min(best, y - 0.02);
}
float stripeCard(vec2 p, float px, float lift){
  float c = cutDist(stripeSd(p), px, lift);
  return mix(c, 0.34 * step(0.02, p.y) * (1. - smoothstep(3.0, 4.0, p.y)), smoothstep(0.045, 0.09, px));   // too fine: flat tint
}
// Paint arrives. Bands of mist drift downwind; behind a band each pass comes crisp in spraying order
// (order 0 fade or shadow, 1 body, 2 white, 3 black). Only beyond uMist.y metres; nearer, everything is made.
float mistCoord(vec3 wp){ return fract((dot(wp.xz, uWind.xy) - uWind.z * uTime) / max(uMist.x, 1.)); }
float mistBand(vec3 wp){ float a = mistCoord(wp); return smoothstep(0.0, 0.1, a) * (1. - smoothstep(0.15, 0.27, a)); }
float arrive(vec3 wp, float order, float dist){
  float after = fract(1. - mistCoord(wp) + 0.82);                      // time since the band went over, 0..1 of a cycle
  float made = smoothstep(0.02 + 0.13 * order, 0.05 + 0.13 * order, after) * (1. - smoothstep(0.93, 0.99, after));
  return mix(1., made, smoothstep(uMist.y * 0.7, uMist.y, dist));
}
`,Ee=`
attribute float aPart; attribute vec2 aWall; attribute float aStripe;
uniform vec4 uPart[20];
varying vec2 vUv, vWall; varying float vVis, vStripe, vDist;
void main(){
  vec4 P = uPart[int(aPart + 0.5)]; float c = cos(P.z), s = sin(P.z);
  vec2 q = vec2(c * position.x - s * position.y, s * position.x + c * position.y) + P.xy;
  vec4 wp = modelMatrix * vec4(position.z, q.y, q.x, 1.);            // the card plane: local z forward, y up, x = depth of the layer
  vUv = uv; vWall = aWall; vVis = P.w; vStripe = aStripe; vDist = distance(wp.xyz, cameraPosition);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,De=`

uniform sampler2D uAtlas; uniform float uKind, uReg, uLift, uAlpha; uniform int uCanId;
varying vec2 vUv, vWall; varying float vVis, vStripe, vDist;
void main(){
  vec4 t = texture2D(uAtlas, vUv);
  vec3 aa = fwidth(t.rgb); float px = length(fwidth(vWall)) * 0.7; float fu = fwidth(vUv.x);
  float liftN = uLift * smoothstep(0.5, 0.9, sNoise(vWall * 1.3 + 7.));
  float a = 0.;
  if (uKind < 0.5) {                                                  // the freehand fade: no knife line at all
    float core = smoothstep(0.30, 0.54, t.r);
    float sweep = 0.93 + 0.07 * sNoise(vWall * vec2(0.9, 2.1) + 3.);
    a = max(core * sweep, 0.14 * smoothstep(0.02, 0.42, t.r));
    float g = sHash(floor(vWall / 0.013)) - 0.5;
    a = clamp(a + g * 0.55 * (1. - smoothstep(0.004, 0.013, px)) * (1. - core) * smoothstep(0.03, 0.2, a), 0., 1.);
    a *= uReg;
  } else if (uKind < 1.5) {
    float br = abs(fract(vUv.x / 0.082) - 0.5) * 0.082;                 // the bridges that held the white card together
    a = cutMask(t.g, aa.g, 0.3 * liftN) * clamp((br - 0.0022) / max(fu, 1e-5) + 0.5, 0., 1.) * uReg;
  } else if (uKind > 2.5) {                                           // the shadow pass: the same cut, whole, in teal
    a = cutMask(t.r, aa.r, 0.25 * liftN) * uReg;
  } else {
    float sil = cutMask(t.r, aa.r, 0.);
    // her own stripes stay cut to a smaller size than the wall's do (never thinner than about 1.5 px, flat only below 2 px a column)
    float st = cutDist(stripeSd(vWall) + 0.25 * px, px, 0.018 * liftN) * (1. - smoothstep(0.08, 0.15, px)) * sil * vStripe;   // too fine to cut: left out, never a flat sixth colour
    a = max(cutMask(t.b, aa.b, 0.3 * liftN) * uReg, st * smoothstep(0., 0.25, uReg));
  }
  vec4 c = canAt(uCanId, vDist);
  gl_FragColor = vec4(c.rgb, a * c.a * vVis * uAlpha);
  if (gl_FragColor.a < 0.004) discard;
}`;function me(e,{kind:a=0,can:t=F.orange,atlas:s=null,order:l=0}={}){const p=new r.ShaderMaterial({uniforms:{...e.uniforms,uAtlas:{value:s},uKind:{value:a},uCanId:{value:t},uReg:{value:1},uLift:{value:1},uAlpha:{value:1},uPart:{value:Array.from({length:20},()=>new r.Vector4(0,0,0,1))}},vertexShader:Ee,fragmentShader:w0+De,transparent:!0,depthWrite:!1,side:r.DoubleSide});return p.userData.order=l,p}const He=`
attribute float aLayer; attribute vec2 aEnd;
varying vec2 vP, vEnd; varying float vLayer, vDist; varying vec3 vWp;
void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vP = uv; vLayer = aLayer; vWp = wp.xyz; vEnd = aEnd;
  vDist = distance(wp.xyz, cameraPosition); gl_Position = projectionMatrix * viewMatrix * wp; }`,We=`
uniform float uSlip, uShow; uniform vec2 uHold;
varying vec2 vP, vEnd; varying float vLayer, vDist; varying vec3 vWp;
void main(){
  float px = length(fwidth(vP)) * 0.7; vec2 p = vP; float a = 0.; vec4 c;
  float card = floor(p.x / 2.4); float hc = sHash(vec2(card, 11.3));
  // card slip: now and then a stand is sprayed again a hand to one side, and its ghost fades over a second
  float per = 6. + 3. * hc; float ph = uTime / per + hc * 7.; float n = floor(ph); float since = (ph - n) * per;
  float slips = step(0.45, hc) * uSlip;
  float off = 0.10 * mod(n, 2.) * slips, offOld = 0.10 * mod(n + 1., 2.) * slips;
  float liftN = smoothstep(0.55, 0.9, sNoise(p * 0.8 + 2.));
  if (vLayer < -0.5) {                                                 // the teal shadow pass, sprayed first: THE CARD cut wide and slid to starboard,
    // so the stand is dark (teal with the black islands over it) and the late sun leaks through it only in slivers
    float fineK = step(max(px, fwidth(p.x) * 0.8), 0.075);
    float dT = stripeSd(p + vec2(0.11, 0.07)) + 0.052;
    dT = min(dT, 4.05 - 0.5 * sHash(vec2(floor(p.x / 0.2), 4.4)) - p.y);  // every blade its own height
    a = mix(0.78 * step(0.02, p.y) * step(p.y, 3.7), cutDist(dT, px, 0.03 * liftN), fineK) * smoothstep(0., 1.6, min(vEnd.x, vEnd.y) + 1.2 * (sNoise(vec2(p.x * 0.7, p.y * 0.5 + 3.)) - 0.5));
    c = canAt(4, 0.);
  } else if (vLayer < 0.5) {                                           // orange underspray: late sun leaking through
    float f = sNoise(p * vec2(0.55, 0.42) + 5.) * 0.65 + sNoise(p * vec2(1.7, 0.9) + 1.) * 0.35;
    float h = smoothstep(4.4, 1.9, p.y) * smoothstep(-0.1, 0.5, p.y);
    // a freehand fade, as underspray is: no knife line, no seam, no bridge; it thins out to nothing over two metres at the ends of the
    // stand and toward the plumes, in uneven sweeps, and its fringe is aerosol grain (flat average where the grain is under 3 px)
    float v = f * (0.30 + 0.85 * h) * smoothstep(0., 2.4, min(vEnd.x, vEnd.y) + 1.6 * (f - 0.5));
    float dens = smoothstep(0.40, 0.66, v) * (0.62 + 0.38 * smoothstep(0.35, 0.7, sNoise(p * vec2(0.23, 0.6) + 11.)));
    // laid through the gaps between stems: cut islands of the can in upright streaks a hand wide, flat, never a blur (soft is only a
    // halo); where a streak is too fine to cut (under 3 px) the stand shows its flat average
    // (one tapering sliver of light to a gap between two columns of the card, so the orange lies between the black islands)
    float cj = floor(p.x / 0.2 + 0.5), xo = p.x - cj * 0.2, o1 = sHash(vec2(cj, 2.9)), o2 = sHash(vec2(cj, 6.3));
    float to = (p.y + o2 * 2.) / (1.1 + 1.3 * o1), os = sHash(vec2(cj * 3. + 2., floor(to)));
    float dO = ((0.022 + 0.04 * o2) * sqrt(max(sin(3.14159 * fract(to)), 0.)) - 0.008) * step(0.3, os) - abs(xo - 0.03 * (o1 - 0.5));
    a = cutDist(min(dO, (dens - 0.3) * 0.5), px, 0.);
    a = mix(a, 0.3 * dens, smoothstep(0.05, 0.1, px));
    c = canAt(2, vDist);
  } else if (vLayer < 1.5) {                                           // THE CARD, in black
    // a card too fine to cut (far off, or seen along its own face) is left out: no flat tint over the orange, which would be a sixth colour
    float fineK = step(max(px, fwidth(p.x) * 0.8), 0.075);
    a = cutDist(stripeSd(p - vec2(off, 0.)), px, 0.02 * liftN) * fineK;
    a = max(a, cutDist(stripeSd(p - vec2(offOld, 0.)), px, 0.03) * fineK * 0.55 * (1. - smoothstep(0., 1.1, since)) * slips);
    c = canAt(0, vDist);
  } else {                                                             // white plume flecks on the tallest slivers
    vec2 q = vec2(p.x / 0.2, (p.y - 3.05) / 0.5); vec2 id = floor(q); vec2 f = fract(q) - 0.5;
    float hh = sHash(id + 31.); f.x += (hh - 0.5) * 0.4;
    float d = 0.33 - length(f * vec2(2.6, 1.0)) - 0.25 * step(hh, 0.62);
    a = cutDist(d * 0.2, px, 0.) * step(3.05, p.y) * step(p.y, 4.05);
    a *= 1. - smoothstep(0.045, 0.09, px);
    c = canAt(1, vDist);
  }
  a *= arrive(vWp, vLayer < 0.5 ? 0. : (vLayer < 1.5 ? 3. : 2.), vLayer < -0.5 ? 0. : vDist);
  // sprayed in strip by strip, in spraying order; over the stretch uHold (centre, half length in stand metres) the black card comes last of all
  float gen = step(vLayer < 0.5 ? 0.001 : (vLayer < 1.5 ? 0.3 : 0.2), uShow * 1.5 - 0.5 * sNoise(vec2(p.x * 0.9, 3.) + 9.));
  // her own stretch uHold stays bare (a pale, quiet ground behind her) until she has stood there as stripes alone; then the card comes
  // down over her in strips 0.6 m wide from the starboard end: underspray, flecks, the black last, each a strip behind the one before
  float hasH = step(0., uHold.y), hd = abs(p.x - uHold.x) - uHold.y, kL = clamp((uShow - 0.55) / 0.45, 0., 1.);
  float strip = floor((p.x - uHold.x + uHold.y) / 0.6) * 0.6 / max(2. * uHold.y, 1e-3);
  float land = step(strip * 0.78 + (vLayer < 0.5 ? 0.015 : (vLayer < 1.5 ? 0.2 : 0.11)), kL);
  a *= mix(gen, land, hasH * step(hd, 0.));
  // (and beside her stretch the underspray thins out in streaks until then: no slab with a ruled edge)
  if (vLayer < 0.5) a *= mix(1., max(step(0.999, kL), smoothstep(0.2, 2.6, hd + 2.2 * (sNoise(vec2(p.x * 3.1, p.y * 0.35 + 7.)) - 0.5))), hasH * step(0., hd));
  gl_FragColor = vec4(c.rgb, a * c.a);
  if (gl_FragColor.a < 0.004) discard;
}`;function ve(e,{slip:a=1,show:t=1}={}){return new r.ShaderMaterial({uniforms:{...e.uniforms,uSlip:{value:a},uShow:{value:t},uHold:{value:new r.Vector2(0,-1)}},vertexShader:He,fragmentShader:w0+We,transparent:!0,depthWrite:!1,side:r.DoubleSide})}const Te=`
varying vec2 vUv; varying float vDist; varying vec3 vWp;
void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vUv = uv; vWp = wp.xyz; vDist = distance(wp.xyz, cameraPosition);
  gl_Position = projectionMatrix * viewMatrix * wp; }`,Ne=`
uniform float uShape, uAlpha, uSeed, uFloor, uSoft, uNear; uniform vec2 uInner; uniform int uCanId;
uniform vec2 uLane; uniform float uReach;
varying vec2 vUv; varying float vDist; varying vec3 vWp;
void main(){
  vec2 q = abs(vUv - 0.5) * 2.; float a; vec2 fw = fwidth(vUv);
  float n = sNoise(vUv * 3.1 + uSeed + uTime * 0.11), n2 = sNoise(vUv * 9. + uSeed * 1.7 - uTime * 0.07);
  if (uShape < 0.5) {                                                  // halo, puff of mist
    float r = length(vUv - 0.5) * 2. + (n - 0.5) * 0.55 + (n2 - 0.5) * 0.18;
    a = 1. - smoothstep(0.05, 0.95, r); a *= a * (1. - smoothstep(0.70, 0.98, length(vUv - 0.5) * 2.));
  } else if (uShape > 2.5) {                                           // a veil of mist: even in the middle, thinning away over its outer half, no rim
    float r = length(vUv - 0.5) * 2. + (n - 0.5) * 0.4 + (n2 - 0.5) * 0.14;
    a = (1. - smoothstep(0.3, 1.0, r)) * (1. - smoothstep(0.75, 0.98, length(vUv - 0.5) * 2.)) * (0.86 + 0.14 * n2);
    if (uLane.y > 0.) a *= smoothstep(uLane.x, uLane.y, abs(vWp.x));
  } else if (uShape > 1.5) {                                           // a sprayed floor: solid, torn soft at its rim
    a = 1. - smoothstep(0.72, 1.0, length(vUv - 0.5) * 2. + (n - 0.5) * 0.3);
  } else {                                                             // the ghost of a card: overspray that got past its edge
    // a breath of the can, never a ruled frame: densest toward one corner (where the hand started), thinning round the card, broken where
    // the card was lifted, soft over a metre and more outward; its inner side follows the card's edge but is only as sharp as the card lay flat
    vec2 d2 = (q - uInner) / max(vec2(1.) - uInner, vec2(1e-3));
    float dOut = max(d2.x, d2.y);
    vec2 cd = vec2(fract(uSeed * 0.37) < 0.5 ? -1. : 1., fract(uSeed * 0.73) < 0.5 ? -1. : 1.);
    vec2 rv = (vUv - 0.5) * 2.;
    float corner = clamp(0.5 + 0.5 * dot(rv, cd) / max(abs(rv.x) + abs(rv.y), 1e-3), 0., 1.);
    float lift = smoothstep(0.38, 0.72, sNoise(vUv * 4.3 + uSeed * 2.1));
    float w = uSoft * (0.35 + 1.9 * lift);
    float edge = smoothstep(-0.3 * w, w, dOut + (n2 - 0.5) * 0.5 * w);
    float fall = 1. - smoothstep(0., 1., dOut + (n - 0.5) * 0.5);
    float around = mix(uFloor, 1., smoothstep(0.38, 0.74, n * 0.75 + n2 * 0.45)) * mix(mix(0.16, 0.6, uFloor), 1., corner * corner);
    if (uReach > 0.) around *= 1. - smoothstep(0.45 * uReach, uReach, max(abs(rv.x - cd.x * uInner.x), abs(rv.y - cd.y * uInner.y)));
    a = edge * fall * (0.4 + 0.6 * fall) * around;                        // a broad breath, not a line along the edge
  }
  float px = max(fw.x, fw.y);
  float g = sHash(floor(vUv / 0.004 + uSeed)) - 0.5;
  a = clamp(a + g * 0.5 * a * (1. - smoothstep(0.0015, 0.004, px)), 0., 1.);
  vec4 c = canAt(uCanId, vDist);
  a *= smoothstep(uNear * 0.5, max(uNear, 1e-3), vDist);                // (near > 0: a band of mist thins to nothing round the lens, so we never fly through white)
  gl_FragColor = vec4(c.rgb, min(a * uAlpha * c.a, 1.));               // never more than the can itself: an alpha above 1 would subtract what is behind it (a sixth colour)
  if (gl_FragColor.a < 0.003) discard;
}`;function Ie(e,{can:a=F.orange,shape:t=0,alpha:s=.12,seed:l=0,inner:p=[.8,.7],floor:v=0,soft:i=.3,near:u=0}={}){return new r.ShaderMaterial({uniforms:{...e.uniforms,uShape:{value:t},uAlpha:{value:s},uSeed:{value:l},uInner:{value:new r.Vector2(p[0],p[1])},uCanId:{value:a},uFloor:{value:v},uSoft:{value:i},uNear:{value:u},uLane:{value:new r.Vector2(0,0)},uReach:{value:0}},vertexShader:Te,fragmentShader:w0+Ne,transparent:!0,depthWrite:!1,side:r.DoubleSide})}const Ue=`
attribute vec4 aSeed;                                                   // can 0..1, size 0..1, trail slot, drift 0..1
uniform float uNow, uThread; uniform vec4 uTrail[16];                   // x, z, birth time, strength of each trail sample; uThread 1 = one unbroken thread of specks (the wind's ribbons)
varying float vCan, vA;
void main(){
  vec4 tr = uTrail[int(aSeed.z + 0.5)];
  float wv = mix(aSeed.w, 0.5, uThread);                                 // (a thread's specks all ride at one speed, so it stays one line)
  float age = uNow - tr.z - wv * 0.14; float life = mix(1.8 + wv * 2.2, 3.7, uThread);
  vec3 p = vec3(tr.x, 0., tr.y) + position + vec3(uWind.x, 0., uWind.y) * (0.5 + wv) * age * 0.9 + vec3(0., (aSeed.x - 0.6) * 0.25 * age * (1. - uThread), 0.);
  vec4 mv = viewMatrix * modelMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mv;
  float sizePx = (0.012 + 0.03 * aSeed.y * (1. - 0.6 * uThread) + 0.012 * uThread) * projectionMatrix[1][1] * uRes.y * 0.5 / max(gl_Position.w, 0.1);
  gl_PointSize = clamp(sizePx, 1.5 + 0.4 * uThread, 9. - 5.6 * uThread);
  vA = smoothstep(0., 0.15, age) * (1. - smoothstep(life * 0.5, life, age)) * step(0., age) * min(1., sizePx / 1.5);
  vA *= step(fract(aSeed.y * 7.31), tr.w);
  vA = mix(vA, step(fract(aSeed.x * 37.7) * 0.8 + 0.1, vA) / 0.85, uThread);   // a thread's specks are each the solid can, there or not
  vCan = aSeed.x;
}`,Ge=`
varying float vCan, vA;
void main(){ vec2 d = gl_PointCoord - 0.5; if (dot(d, d) > 0.25 || vA < 0.01) discard;
  int k = int(clamp(vCan * 5., 0., 4.)); gl_FragColor = vec4(uCan[k], vA * 0.85); }`;function _e(e){return new r.ShaderMaterial({uniforms:{...e.uniforms,uNow:{value:0},uThread:{value:0},uTrail:{value:Array.from({length:16},()=>new r.Vector4(0,0,-99,0))}},vertexShader:w0+Ue,fragmentShader:w0+Ge,transparent:!0,depthWrite:!1})}const Oe=`
attribute vec3 aOff; attribute vec3 aInfo;                              // side offset (unit tangent, signed); phase, max length m, speed mult
uniform float uRun, uWide;
varying float vT, vDist;
void main(){
  float t = mod(uTime * uRun + aInfo.x * 140., 140.);
  float len = min(aInfo.y, 0.02 * aInfo.z * t) * (1. - smoothstep(128., 140., t));
  vec4 wp = modelMatrix * vec4(position - vec3(0., len * uv.y, 0.), 1.);
  float dist = distance(wp.xyz, cameraPosition);
  float mpp = 2. * dist / max(projectionMatrix[1][1] * uRes.y, 1.);     // metres per pixel here
  float bead = 1. + 1.3 * smoothstep(0.86, 0.97, uv.y) * (1. - smoothstep(0.985, 1., uv.y));
  float w = max(0.011 * uWide * bead, 0.8 * mpp);
  wp.xyz += normalize(mat3(modelMatrix) * aOff) * w * sign(uv.x - 0.5);
  vT = uv.y; vDist = dist; gl_Position = projectionMatrix * viewMatrix * wp;
}`,je=`
uniform int uCanId; varying float vT, vDist;
void main(){ vec4 c = canAt(uCanId, vDist); gl_FragColor = vec4(c.rgb, c.a * (1. - smoothstep(280., 400., vDist))); if (gl_FragColor.a < 0.01) discard; }`;function we(e,{can:a=F.black,run:t=1,wide:s=1}={}){return new r.ShaderMaterial({uniforms:{...e.uniforms,uCanId:{value:a},uRun:{value:t},uWide:{value:s}},vertexShader:w0+Oe,fragmentShader:w0+je,transparent:!0,depthWrite:!1,side:r.DoubleSide})}function xe(e){const a=e.length,t=new Float32Array(a*12),s=new Float32Array(a*12),l=new Float32Array(a*12),p=new Float32Array(a*8),v=[];e.forEach((u,h)=>{for(let b=0;b<4;b++)t.set(u.at,h*12+b*3),s.set(u.tangent,h*12+b*3),l.set([u.phase??0,u.length??.5,u.speed??1],h*12+b*3),p.set([b&1,b>>1],h*8+b*2);v.push(h*4,h*4+2,h*4+1,h*4+1,h*4+2,h*4+3)});const i=new r.BufferGeometry;return i.setAttribute("position",new r.BufferAttribute(t,3)),i.setAttribute("aOff",new r.BufferAttribute(s,3)),i.setAttribute("aInfo",new r.BufferAttribute(l,3)),i.setAttribute("uv",new r.BufferAttribute(p,2)),i.setIndex(v),i}function ye(e){const a=[],t=[],s=[],l=[],p=[];for(let i=-1;i<3;i++)for(const u of e){if(i<0&&!u.teal)continue;const h=i<0?-2*b0.layerGap:i===0?-b0.layerGap:i===1?0:.05,b=(u.height??b0.height)+.1,A=Math.hypot(u.b[0]-u.a[0],u.b[1]-u.a[1]),n=a.length/3,d=i===0?.6:0,x=(u.b[0]-u.a[0])/A,o=(u.b[1]-u.a[1])/A;for(let L=0;L<4;L++){const k=L&1?A+d:-d,g=L>>1?b+d:-.05;a.push(u.a[0]+x*k+u.front[0]*h,g,u.a[1]+o*k+u.front[1]*h),t.push((u.u0??0)+k,g),s.push(i),l.push(k,A-k)}p.push(n,n+1,n+2,n+1,n+3,n+2)}const v=new r.BufferGeometry;return v.setAttribute("position",new r.Float32BufferAttribute(a,3)),v.setAttribute("uv",new r.Float32BufferAttribute(t,2)),v.setAttribute("aLayer",new r.Float32BufferAttribute(s,1)),v.setAttribute("aEnd",new r.Float32BufferAttribute(l,2)),v.setIndex(p),v}const m=(e,a,t,s,l,p=0)=>{const v=(e+t)/2,i=(a+s)/2,u=t-e,h=s-a,b=Math.hypot(u,h)||1,A=-h/b,n=u/b;return[[e,a],[v+A*(l/2+p),i+n*(l/2+p)],[t,s],[v-A*(l/2-p),i-n*(l/2-p)]]},$e=(e,a,t,s)=>[[e-t,a],[e,a+s],[e+t,a],[e,a-s]],J0=1.12,be={torso:{b:[-1.85,1.85,-.8,.78],R:[[[-1.5,.3],[-1.25,.47],[-.6,.44],[.1,.42],[.75,.5],[1.1,.56],[1.42,.42],[1.6,.12],[1.52,-.25],[1.2,-.52],[.7,-.58],[.1,-.5],[-.5,-.4],[-.95,-.38],[-1.3,-.45],[-1.6,-.2],[-1.63,.08]]],G:[[[1.42,-.1],[1.3,-.28],[.85,-.36],[.3,-.36],[-.3,-.3],[-.85,-.26],[-1.25,-.3],[-1.38,-.4],[-1,-.47],[-.5,-.46],[.1,-.55],[.7,-.63],[1.2,-.58],[1.5,-.36],[1.58,-.12]]],B:[]},headA:{b:[-.56,1.32,-.6,.9],R:[[[-.25,.36],[.1,.44],[.3,.5],[.36,.64],[.44,.72],[.53,.66],[.56,.56],[.7,.56],[.84,.5],[.95,.4],[1.06,.33],[1.13,.24],[1.14,.14],[1.1,.04],[1.03,-.05],[.92,-.1],[.78,-.12],[.66,-.22],[.52,-.3],[.4,-.26],[.22,-.34],[-.05,-.42],[-.3,-.4],[-.38,0]]],G:[[[.96,.2],[1.06,.24],[1.12,.12],[1.08,.03],[.98,-.04],[.9,.02],[.9,.12]],[[.52,.1],[.66,.14],[.78,.06],[.76,-.08],[.66,-.18],[.52,-.26],[.42,-.2],[.44,-.04]],[[.78,.44],[.86,.49],[.95,.43],[.86,.42]],[[0,-.24],[.2,-.22],[.34,-.28],[.2,-.34],[-.04,-.38]]],B:[[[.775,.34],[.855,.42],[.945,.385],[.86,.32]],[[1.085,.255],[1.14,.235],[1.148,.15],[1.1,.175]],m(1.085,.04,.88,-.035,.032,.012),[[.38,.6],[.44,.695],[.52,.64],[.47,.575]],m(.74,.3,.56,.14,.06,.03),m(.72,.16,.62,-.12,.05,-.02),m(.56,.26,.42,-.04,.055,.02),m(.5,-.06,.58,-.24,.04,0),m(.8,.33,.69,.26,.032,0),m(.6,.535,.7,.38,.045,0),m(.72,.53,.78,.44,.035,0),m(.5,.52,.56,.34,.05,.01),m(.28,.46,.24,0,.08,.03),m(.1,.42,.04,-.12,.085,-.02),m(-.1,.37,-.17,-.22,.09,.02),m(.28,-.08,.32,-.26,.05,0)]},headB:{b:[-.56,1.28,-.6,.96],R:[[[-.25,.32],[.05,.44],[.2,.56],[.24,.72],[.34,.78],[.44,.7],[.48,.62],[.62,.64],[.76,.64],[.82,.76],[.93,.78],[.99,.68],[.98,.56],[1.06,.4],[1.1,.2],[1.06,.02],[.96,-.12],[.84,-.22],[.68,-.28],[.52,-.26],[.36,-.2],[.24,-.3],[.05,-.4],[-.28,-.38],[-.38,0]]],G:[[[.5,.08],[.6,.12],[.66,.04],[.64,-.08],[.54,-.12],[.46,-.04]],[[.68,.04],[.74,.12],[.84,.08],[.88,-.04],[.8,-.12],[.7,-.08]],[[.58,-.14],[.67,-.11],[.76,-.14],[.67,-.22]],[[.4,.4],[.51,.475],[.62,.395],[.51,.385]],[[.72,.395],[.83,.475],[.94,.4],[.83,.385]],[[.43,.225],[.5,.238],[.58,.222],[.5,.17]],[[.76,.222],[.84,.238],[.91,.225],[.84,.17]],[[.24,.14],[.36,.12],[.42,-.04],[.36,-.16],[.24,-.22],[.2,-.04]],[[.94,.12],[1.04,.14],[1.07,0],[.98,-.1],[.92,-.02]]],B:[[[.415,.3],[.5,.37],[.59,.288],[.5,.243]],[[.75,.288],[.84,.37],[.925,.3],[.84,.243]],[[.6,.14],[.74,.14],[.67,.04]],m(.67,.05,.67,-.02,.03),m(.54,-.07,.67,-.02,.036,.012),m(.67,-.02,.8,-.07,.036,.012),[[.25,.62],[.3,.735],[.39,.7],[.35,.62]],[[.82,.64],[.86,.745],[.94,.73],[.93,.64]],m(.61,.64,.62,.45,.062),m(.72,.64,.71,.45,.062),m(.5,.6,.545,.48,.05),m(.83,.6,.79,.48,.05),m(.39,.25,.25,.15,.07,.02),m(.41,.07,.31,-.1,.062,.02),m(.95,.25,1.06,.17,.062,-.02),m(.93,.07,1,-.08,.056,-.02),m(.08,.4,.03,-.14,.085,-.02),m(-.12,.35,-.18,-.22,.09,.02)]},foreU:{b:[-.4,.4,-1.02,.4],R:[[[-.22,.15],[0,.22],[.22,.12],[.21,-.35],[.14,-.78],[0,-.85],[-.13,-.78],[-.19,-.35]]],G:[m(-.13,-.18,-.08,-.76,.07,0)],B:[]},foreL:{b:[-.34,.54,-1,.28],R:[[[-.13,.1],[.13,.1],[.12,-.3],[.09,-.56],[.14,-.66],[.32,-.7],[.36,-.79],[.2,-.83],[-.08,-.82],[-.15,-.74],[-.1,-.56],[-.13,-.3]]],G:[m(-.08,-.05,-.08,-.62,.05,0),[[.06,-.7],[.2,-.68],[.29,-.74],[.1,-.78]]],B:[m(-.11,-.1,.1,-.14,.055,.01),m(-.11,-.27,.1,-.3,.05,-.01),m(-.1,-.43,.1,-.46,.045,.01),m(.2,-.7,.215,-.78,.02),m(.11,-.71,.12,-.79,.02)]},hindU:{b:[-.54,.64,-1,.48],R:[[[-.35,.18],[0,.3],[.36,.15],[.45,-.25],[.36,-.62],[.2,-.8],[.02,-.78],[-.12,-.5],[-.3,-.2]]],G:[m(-.06,-.42,.06,-.74,.08,0)],B:[]},hindL:{b:[-.58,.4,-1.12,.32],R:[[[-.12,.14],[.16,.08],[.12,-.16],[-.08,-.4],[-.1,-.66],[.02,-.78],[.2,-.82],[.22,-.91],[-.14,-.94],[-.3,-.84],[-.36,-.62],[-.4,-.4],[-.28,-.14]]],G:[m(-.02,-.06,-.26,-.4,.05,0),[[-.16,-.84],[-.02,-.82],[.07,-.87],[-.12,-.9]]],B:[m(-.2,-.08,.1,-.06,.05,.01),m(-.3,-.26,-.03,-.3,.05,0),m(-.34,-.5,-.14,-.5,.045,.01),m(-.3,-.66,-.12,-.64,.04,0),m(-.02,-.83,-.01,-.91,.02)]},tail:{b:[-.8,.24,-.26,.26],R:[[[.08,0],[0,.09],[-.3,.085],[-.6,.075],[-.66,0],[-.6,-.075],[-.3,-.085],[0,-.09]]],G:[],B:[m(-.16,.085,-.19,-.085,.07,0),m(-.42,.08,-.44,-.08,.065,0)]},tailTip:{b:[-.8,.24,-.26,.26],R:[[[.08,0],[0,.08],[-.3,.085],[-.56,.08],[-.66,0],[-.56,-.08],[-.3,-.085],[0,-.08]]],G:[],B:[m(-.14,.08,-.17,-.08,.07,0),[[-.36,0],[-.42,.085],[-.57,.08],[-.665,0],[-.57,-.08],[-.42,-.085]]]}},M0=1024,Ve=180;function qe(e,a){const t=a.length;e.moveTo(a[0][0],a[0][1]);for(let s=0;s<t;s++){const l=a[(s+t-1)%t],p=a[s],v=a[(s+1)%t],i=a[(s+2)%t];e.bezierCurveTo(p[0]+(v[0]-l[0])/6,p[1]+(v[1]-l[1])/6,v[0]-(i[0]-p[0])/6,v[1]-(i[1]-p[1])/6,v[0],v[1])}e.closePath()}async function Ke(e){const a=document.createElement("canvas");a.width=a.height=M0;const t=a.getContext("2d");t.fillStyle="#000",t.fillRect(0,0,M0,M0);let s=0,l=0,p=0;const v={},i=Ve,u=3e3;for(const b of Object.keys(be)){const A=be[b],n=Math.ceil((A.b[1]-A.b[0])*i),d=Math.ceil((A.b[3]-A.b[2])*i);s+n>M0&&(s=0,l+=p+2,p=0),v[b]={x:s,y:l,w:n,h:d,b:A.b};for(const[x,o,L]of[["R","#ff0000",15],["G","#00ff00",2.4],["B","#0000ff",2.4]])if(A[x].length){t.save(),t.beginPath(),t.rect(s,l,n,d),t.clip(),t.globalCompositeOperation="lighter",t.fillStyle=o,t.shadowColor=o,t.shadowBlur=L,t.shadowOffsetX=u,t.shadowOffsetY=0,t.setTransform(i,0,0,-i,s-A.b[0]*i-u,l+A.b[3]*i);for(const k of A[x])t.beginPath(),qe(t,k),t.fill();t.restore(),await e.yield()}s+=n+2,p=Math.max(p,d),await e.yield()}const h=new r.CanvasTexture(a);return h.colorSpace=r.NoColorSpace,h.generateMipmaps=!0,h.minFilter=r.LinearMipmapLinear,h.magFilter=r.LinearFilter,h.anisotropy=4,{texture:h,cells:v}}const H0=[{name:"fHindU",cell:"hindU",depth:.06,stripe:1},{name:"fHindL",cell:"hindL",depth:.06,stripe:0},{name:"fForeU",cell:"foreU",depth:.06,stripe:1},{name:"fForeL",cell:"foreL",depth:.06,stripe:0},{name:"tail1",cell:"tail",depth:.02,stripe:0},{name:"tail2",cell:"tail",depth:.02,stripe:0},{name:"tail3",cell:"tail",depth:.02,stripe:0},{name:"tail4",cell:"tailTip",depth:.02,stripe:0},{name:"torso",cell:"torso",depth:0,stripe:1},{name:"nHindU",cell:"hindU",depth:-.06,stripe:1},{name:"nHindL",cell:"hindL",depth:-.06,stripe:0},{name:"nForeU",cell:"foreU",depth:-.06,stripe:1},{name:"nForeL",cell:"foreL",depth:-.06,stripe:0},{name:"headA",cell:"headA",depth:-.08,stripe:0},{name:"headB",cell:"headB",depth:-.08,stripe:0,k:1.28}],Ye=Object.fromEntries(H0.map((e,a)=>[e.name,a])),_={shoulder:[1.02,-.08],hip:[-1.12,-.02],neck:[1.36,.16],tail:[-1.56,.16],elbow:[0,-.72],stifle:[.16,-.66],tailLen:.52,stand:1.5};function Xe(e,a,t){const s=H0.length,l=new Float32Array(s*12),p=new Float32Array(s*8),v=new Float32Array(s*4),i=new Float32Array(s*8),u=new Float32Array(s*4),h=[];H0.forEach((A,n)=>{const d=e[A.cell],x=d.b,o=a[n],L=Math.cos(o.z),k=Math.sin(o.z);for(let g=0;g<4;g++){const o0=g&1,B=g>>1,h0=J0*(A.k||1),s0=(o0?x[1]:x[0])*h0,Q=(B?x[3]:x[2])*h0;l.set([s0,Q,A.depth],n*12+g*3),p.set([(d.x+o0*d.w)/M0,1-(d.y+(1-B)*d.h)/M0],n*8+g*2),v[n*4+g]=n,u[n*4+g]=A.stripe,i.set([t+L*s0-k*Q+o.x,k*s0+L*Q+o.y],n*8+g*2)}h.push(n*4,n*4+1,n*4+2,n*4+1,n*4+3,n*4+2)});const b=new r.BufferGeometry;return b.setAttribute("position",new r.BufferAttribute(l,3)),b.setAttribute("uv",new r.BufferAttribute(p,2)),b.setAttribute("aPart",new r.BufferAttribute(v,1)),b.setAttribute("aWall",new r.BufferAttribute(i,2)),b.setAttribute("aStripe",new r.BufferAttribute(u,1)),b.setIndex(h),b.boundingSphere=new r.Sphere(new r.Vector3(0,2,0),9),b}const H=8,M=(e,a,t)=>{const s=Math.min(1,Math.max(0,(t-e)/(a-e)));return s*s*(3-2*s)},$0=[[.3,0],[.8,1.8],[1.5,2.4],[2.3,5.8],[3.5,6],[3.9,5.2],[4.25,4],[4.6,9],[4.9,11],[6.2,11],[6.4,8],[6.62,3.5],[6.9,0]],C0=[.3,3.9,4.6,6.4,6.9];function Ze(e){const t=H/800,s=new Float32Array(801),l=new Float32Array(801),p=e.Lb??e.L2,v=[null,e.arc1,p,e.arc2+e.L3-(p-e.L2)],i=n=>{for(let d=0;d<$0.length-1;d++){const x=$0[d],o=$0[d+1];if(n>=x[0]&&n<o[0])return x[1]+(o[1]-x[1])*M(x[0],o[0],n)}return 0},u=[0,0,0,0];for(let n=0;n<800;n++){const d=(n+.5)*t;for(let x=0;x<4;x++)d>=C0[x]&&d<C0[x+1]&&(u[x]+=i(d)*t)}const h=u.map((n,d)=>v[d]?v[d]/Math.max(n,.001):1);for(let n=0;n<800;n++){const d=(n+.5)*t;let x=0;for(let o=0;o<4;o++)d>=C0[o]&&d<C0[o+1]&&(x=h[o]);s[n]=i(d)*x,l[n+1]=l[n]+s[n]*t}s[800]=0;const b=(n,d)=>{const x=Math.min(799.999,Math.max(0,d/t)),o=Math.floor(x),L=x-o;return n[o]+(n[o+1]-n[o])*L};return{L1:b(l,C0[1]),total:l[800],s:n=>b(l,n),v:n=>b(s,Math.max(0,n-t*.5))}}const Me=e=>[Math.sin(e),Math.cos(e)],ge=e=>[-Math.cos(e),Math.sin(e)];function Je(e){const a=Me(-e.gamma),t=ge(-e.gamma),s=Me(-e.beta),l=ge(-e.beta);return e.P2=[e.d0*Math.sin(e.gamma),-e.d0*Math.cos(e.gamma)],e.C1=[e.P2[0]+e.r1*t[0],e.P2[1]+e.r1*t[1]],e.P1=[e.C1[0]-e.r1*l[0],e.C1[1]-e.r1*l[1]],e.S=[e.P1[0]-e.L1*s[0],e.P1[1]-e.L1*s[1]],e.P3=[e.P2[0]+e.L2*a[0],e.P2[1]+e.L2*a[1]],e.endFwd?(e.C2=[e.P3[0]-e.r2*t[0],e.P3[1]-e.r2*t[1]],e.hEnd=e.hook||0,e.P4=[e.C2[0]-e.r2*Math.cos(e.hEnd),e.C2[1]+e.r2*Math.sin(e.hEnd)]):(e.C2=[e.P3[0]+e.r2*t[0],e.P3[1]+e.r2*t[1]],e.hEnd=-Math.PI,e.P4=[e.C2[0]-e.r2,e.C2[1]]),e}function Q0(e,a,t){const s=e.L1,l=s+e.arc1,p=l+e.L2,v=p+e.arc2;if(a<s)t.x=e.S[0]-Math.sin(e.beta)*a,t.z=e.S[1]+Math.cos(e.beta)*a,t.h=-e.beta;else if(a<l){const i=-e.beta-(a-s)/e.r1;t.x=e.C1[0]+e.r1*Math.cos(i),t.z=e.C1[1]-e.r1*Math.sin(i),t.h=i}else if(a<p)t.x=e.P2[0]-Math.sin(e.gamma)*(a-l),t.z=e.P2[1]+Math.cos(e.gamma)*(a-l),t.h=-e.gamma;else if(a<v)if(e.endFwd){const i=-e.gamma+(a-p)/e.r2;t.x=e.C2[0]-e.r2*Math.cos(i),t.z=e.C2[1]+e.r2*Math.sin(i),t.h=i}else{const i=-e.gamma-(a-p)/e.r2;t.x=e.C2[0]+e.r2*Math.cos(i),t.z=e.C2[1]-e.r2*Math.sin(i),t.h=i}else t.x=e.P4[0]+Math.sin(e.hEnd)*(a-v),t.z=e.P4[1]+Math.cos(e.hEnd)*(a-v),t.h=e.hEnd;return t}const J=Math.PI*2;function Ae(e,a,t,s,l,p=0){const v=e.s(t)+p,i=J0,u=M(.3,.8,t)*(1-M(6.6,6.9,t)),h=M(4.45,4.65,t)*(1-M(6.38,6.6,t)),b=M(1.5,2.3,t)*(1-M(3.75,4.2,t)),A=Math.max(0,u-h-b),n=1-u,d=M(3.8,4.3,t)*(1-M(4.45,4.7,t))+.6*M(6.4,6.6,t)*(1-M(6.7,7,t)),x=v/1.9,o=v/3.3,L=(v-(a.L1+a.arc1))/a.stride,k=[0,0,0,0,0,0,0,0],g=(S,U,W,N)=>{k[U]+=S*W,k[U+1]+=S*N};n>0&&(g(n,0,.04,0),g(n,2,-.08,-.02),g(n,4,.1,.05),g(n,6,0,0)),A>0&&[[.25,0,0],[.75,2,0],[0,4,1],[.5,6,1]].forEach(([S,U,W])=>{const N=J*(x+S),C=Math.sin(N),G=Math.max(0,Math.cos(N));if(W){const E=.12+.36*C;g(A,U,E,.5*E-.45*G)}else{const E=.05+.4*C;g(A,U,E,E-.75*G)}});let o0=.03*A*Math.sin(2*J*x),B=.02*A*Math.sin(2*J*x+1);const h0=(S,U,W)=>{if(S<=0)return;[[0,0],[.07,2],[0,4],[.06,6]].forEach(([C,G])=>{const E=J*(U-C),K=Math.cos(E-J*.25);if(G<4){const e0=.25+.95*W*K;g(S,G,e0,e0-1.1*W*Math.max(0,Math.cos(E)))}else{const e0=-.1-1*W*K;g(S,G,e0,.6*e0-.5*W*Math.max(0,-Math.cos(E)))}});const N=Math.sin(Math.PI*U);o0+=S*1*W*W*N*N,B+=S*.22*W*Math.cos(J*(U-.08))};h0(b,o,.6),h0(h,L,1),g(d,0,-.35,.45),g(d,2,-.3,.4),g(d,4,.42,-.2),g(d,6,.36,-.16),o0-=.24*d,B+=.09*d;const s0=Math.cos(B),Q=Math.sin(B),O=_.stand+o0,V=S=>[s0*S[0]-Q*S[1],O+Q*S[0]+s0*S[1]],n0=(S,U,W,N,C=1)=>s[Ye[S]].set(U*i,W*i,N,C);n0("torso",0,O,B);const r0=(S,U,W,N,C,G)=>{const E=V(W),K=Math.cos(C),e0=Math.sin(C);n0(S,E[0],E[1],C),n0(U,E[0]+K*N[0]-e0*N[1],E[1]+e0*N[0]+K*N[1],G)};r0("nForeU","nForeL",_.shoulder,_.elbow,k[0],k[1]),r0("fForeU","fForeL",[_.shoulder[0]+.07,_.shoulder[1]],_.elbow,k[2],k[3]),r0("nHindU","nHindL",_.hip,_.stifle,k[4],k[5]),r0("fHindU","fHindL",[_.hip[0]+.09,_.hip[1]],_.stifle,k[6],k[7]);const X=M(3.3,3.52,t)*(1-M(4.5,4.68,t)),c0=V(_.neck),R0=-.55*B-.16*A-.05*b+.1*h+.03*Math.sin(J*x*2+.5)*A-.12*d+l*.03;n0("headA",c0[0],c0[1],R0,1-X),n0("headB",c0[0]-.02,c0[1]+.02,R0+.05,X);let f0=V(_.tail),q=B;const g0=[.55,.28,-.12,-.42],j=[.12,-.02,-.14,-.2],A0=Math.min(1,b+h),$=h>.5?L:b>.3?o:x;for(let S=0;S<4;S++)q+=g0[S]+(j[S]-g0[S])*A0+(.1+.22*A0+.1*d)*Math.sin(J*($-.16*S)+1)*u+.05*Math.sin(t*1.3+S)*n,q=Math.max(.07-.4*h,q),n0("tail"+(S+1),f0[0],f0[1],q),f0=[f0[0]-Math.cos(q)*_.tailLen,f0[1]-Math.sin(q)*_.tailLen];return{s:v,y:O*i,hb:X,wB:h,pB:L,move:u}}async function Qe(e,a={}){const t=e.rng.fork?e.rng.fork("tiger"):e.rng,s=Math.min(1,Math.max(.6,a.detail??e.quality?.detail??1)),l=a.style||Be(a.palette||Z0),p=a.crossFrom??11,v=a.farWallX??11.5,i=a.wallHeight??b0.height,u=Math.min(1.2,Math.max(0,a.wallYaw??.6)),h=new r.Group;h.name="stripes-in-the-grass:tiger";const b=new r.Group;b.add(h);let A=a.sweep??0,n=a.sweepT??-1;const d=Math.min(Math.PI/2,Math.max(u+.3,a.crossAngle??Math.PI/2)),x=a.endAhead?Math.max(0,a.hook??0):0,o={beta:u,gamma:d,r1:2.5,r2:a.endAhead?a.hookRadius??3.2:2,L3:a.endAhead?a.runOn??5:1,endFwd:!!a.endAhead,d0:a.crossLead??p,hook:x};o.Lb=a.stride?3*a.stride:o.d0+(v-.7-o.r2*(1+Math.cos(d)))/Math.sin(d),o.L2=o.Lb*Math.min(3,Math.max(1.5,x>0?a.straight??3:3))/3,o.arc1=o.r1*(d-u),o.arc2=o.endFwd?o.r2*(d+x):o.r2*(Math.PI-d),o.stride=o.Lb/3;const L=Ze(o);o.L1=L.L1,Je(o);const k=Math.cos(u),g=Math.sin(u),o0=o.P1;o.sx=o.S[0],o.sz=o.S[1],o.xS=o.P2[0];const B=x>0?v:.7-o.P4[0],h0=Math.floor(t.range(0,40))*b0.column+t.range(0,b0.column),s0=t.range(-1,1),Q=o.hEnd,O=Math.sin(Q),V=Math.cos(Q),n0=o.L3,r0=o.P4[0]+O*n0,X=o.P4[1]+V*n0;await e.yield();const{texture:c0,cells:R0}=await Ke(e),f0=H0.map(()=>new r.Vector4);Ae(L,o,0,f0,s0);const q=h0+16,g0=Xe(R0,f0,q);await e.yield();const j=[{key:"shadow",kind:3,can:F.teal,delay:.06,gap:-1.3},{key:"fade",kind:0,can:F.orange,delay:0,gap:0},{key:"white",kind:1,can:F.white,delay:.12,gap:1},{key:"black",kind:2,can:F.black,delay:.25,gap:2}];a.white&&(j[1].can=F.white,j[2].can=F.straw);const A0=(c,y,w)=>c.forEach((f,R)=>{f.mat=me(l,{kind:f.kind,can:f.can,atlas:c0,order:R}),f.mesh=new r.Mesh(g0,f.mat),f.mesh.frustumCulled=!1,f.mesh.renderOrder=w+R,f.mesh.rotation.order="YXZ",f.mesh.scale.setScalar(y),h.add(f.mesh),f.tr={x:0,z:0,h:0},f.mis=R<2?[0,0]:[t.range(-.06,.06),t.range(-.035,.035)]});A0(j,1,20);const $=new r.Mesh(g0,me(l,{kind:0,can:F.white,atlas:c0,order:0}));$.material.uniforms.uPart=j[1].mat.uniforms.uPart,$.material.uniforms.uReg.value=0,$.frustumCulled=!1,$.renderOrder=20.5,$.rotation.order="YXZ",h.add($);const S=[];if(a.cubs)for(let c=0;c<2;c++){const y=j.map(w=>({key:w.key,kind:w.kind,can:w.can,delay:w.delay*1.5,gap:w.gap}));A0(y,.5,12+c*4),S.push({set:y,start:c?5.45:4.7,along:c?15.5:12,tum:c?-1:1,ph:t.range(0,6)})}await e.yield();const U=c=>[o.sx-g*c+k*.7,o.sz+k*c+g*.7],W=a.wallAhead??9,N=a.wallBack??16,C=[{a:U(-N),b:U(o.L1+W),front:[-k,-g],u0:h0+16-N,height:i,teal:a.darkWall!==!1},x>0?{a:[-B,-26],b:[-B,2],front:[1,0],u0:q-40,height:i}:o.endFwd?{a:[-B,X-20],b:[-B,X+W+6],front:[1,0],u0:q-20,height:i}:{a:[-B,10],b:[-B,X-18],front:[1,0],u0:q+X-10,height:i}];let G=null;if(x>0){const c=r0-V*.7,y=X+O*.7,w=Math.min(a.returnBack??12,(c+B)/Math.max(O,.2)),f=a.returnAhead??3.1;G={a:[c-O*w,y-V*w],b:[c+O*f,y+V*f],front:[V,-O],u0:q-w,height:i}}let E=null,K=null,e0=[];if(a.walls!==!1){E=new r.Mesh(ye(C),ve(l,{slip:1})),E.renderOrder=4,E.frustumCulled=!1,h.add(E),G&&(K=new r.Mesh(ye([G]),ve(l,{slip:0,show:0})),K.renderOrder=17,K.frustumCulled=!1,K.material.uniforms.uHold.value.set(q+.6,3.9),h.add(K));const c=(f,R,I,Z)=>{const t0=[];for(let z=0;z<f;z++){const D=C[z%2],a0=t(),i0=D.a[0]+(D.b[0]-D.a[0])*a0+D.front[0]*.02,l0=D.a[1]+(D.b[1]-D.a[1])*a0+D.front[1]*.02;t0.push({at:[i0,t.range(R,I),l0],tangent:[-D.front[1],0,D.front[0]],length:t.range(Z*.4,Z),phase:t(),speed:t.range(.7,1.4)})}return t0},y=new r.Mesh(xe(c(Math.round(22*s),.5,2.3,.7)),we(l,{can:F.black})),w=new r.Mesh(xe(c(Math.round(10*s),.4,1.6,.5)),we(l,{can:F.orange}));y.renderOrder=6,w.renderOrder=3,y.frustumCulled=w.frustumCulled=!1,h.add(y,w),e0=[y,w]}await e.yield();const Se=new r.PlaneGeometry(1,1),v0=(c,y,w,f)=>{const R=new r.Mesh(Se,Ie(l,c));return R.scale.set(y,w,1),R.renderOrder=f,R.frustumCulled=!1,h.add(R),R};let W0=null;a.ground!==!1&&(W0=v0({can:F.straw,shape:2,alpha:1,seed:t.range(0,9)},110,110,1),W0.rotation.x=-Math.PI/2,W0.position.set(0,-.02,-8));const ee=a.white?F.white:F.orange,T0=v0({can:ee,shape:1,alpha:.42,seed:t.range(0,9),inner:[.86,.78]},7.5,4.5,18),te=v0({can:ee,shape:0,alpha:.11,seed:t.range(0,9)},6.6,3.4,19),ke=a.white?.72:.66,ae=v0({can:a.white?F.straw:F.white,shape:3,alpha:0,seed:t.range(0,9)},15,4,16),oe=v0({can:F.black,shape:0,alpha:0,seed:t.range(0,9)},6.4,3.4,22),N0=v0({can:F.white,shape:0,alpha:0,seed:t.range(0,9)},3.4,3.2,19.5),z0=v0({can:F.white,shape:0,alpha:0,seed:t.range(0,9)},5.5,2.2,17);await e.yield();const I0=Math.round(900*s),se=new Float32Array(I0*3),ne=new Float32Array(I0*4);for(let c=0;c<I0;c++)se.set([t.range(-1.6,1.6),t.range(.1,2.9),t.range(-1.6,1.6)],c*3),ne.set([t(),t(),c%16,t()],c*4);const U0=new r.BufferGeometry;U0.setAttribute("position",new r.BufferAttribute(se,3)),U0.setAttribute("aSeed",new r.BufferAttribute(ne,4));const G0=_e(l),_0=new r.Points(U0,G0);_0.frustumCulled=!1,_0.renderOrder=26,h.add(_0);let O0=0,j0=0;const Pe=t.range(-.05,.05);await e.yield();let d0=-1,re=0,ie=0,F0=1;const V0=new r.Vector3(0,0,-1e4),le=o.L1+o.arc1,q0=L.total,x0={x:0,z:0,h:0},Le=(c,y=new r.Vector3,w=0)=>{const f=Math.min(1,Math.max(0,c))*H;Q0(o,Math.min(q0,L.s(f)-w),x0);const R=.67*(1-M(.3,1.6,f)),I=.67*M(6.45,6.95,f);return y.set(x0.x+k*R-V*I,1.7,x0.z+g*R+O*I)};function he(c,y,w,f,R,I,Z=y,t0=0){const z=M(.3,1,y)*(1-M(7.2,7.5,Z))*I,D=M(.22,.5,y)*(1-M(8.3,8.65,Z))*I,a0=.67*(1-M(.3,1.6,y)),i0=.67*M(6.45,6.95,y),l0=k*a0-V*i0,S0=g*a0+O*i0;let u0=null,B0=0,k0=0;const y0=d0>=0?M(.4,1,y)*(1-M(6.5,6.85,y)):0;for(const P of c){const T=Math.max(0,y-P.delay),Y=Ae(L,o,Math.max(0,y-P.delay*.2),P.mat.uniforms.uPart.value,s0,t0),X0=Y.pB-Math.floor(Y.pB),P0=Math.sin(Math.PI*X0),p0=Y.wB*P0*P0;let L0=L.s(T)+L.v(T)*P.delay+t0;P.key==="black"?L0-=.9*p0*f:P.key==="white"&&(L0-=.12*p0*f),Q0(o,Math.min(q0,Math.max(-60,L0)),P.tr);let m0=P.tr.h;if(y0>0){let E0=Math.atan2(V0.x-w[0]-P.tr.x,V0.z-w[1]-P.tr.z)-m0;E0-=J*Math.round(E0/J);const D0=Math.abs(E0),Fe=Math.max(.9,Math.min(Math.PI-.9,D0));m0+=Math.sign(E0)*(D0-Fe)*y0*(1-M(2.75,3.1,D0))*M(.02,.3,D0)}P.hC=m0;const de=-P.gap*.1*z*f,ue=P.key==="shadow"?z:0,pe=(.11*ue+P.mis[0]*z)*f;P.mesh.position.set(w[0]+P.tr.x+l0+Math.cos(m0)*de+Math.sin(m0)*pe,(-.085*ue+P.mis[1]*z)*f,w[1]+P.tr.z+S0-Math.sin(m0)*de+Math.cos(m0)*pe),P.mesh.rotation.y=m0,P.mesh.rotation.x=R?R*.35*p0*Math.sin(J*(Y.pB-4*P.delay)):0,P.mat.uniforms.uReg.value=P.key==="black"?D:z,P.mat.uniforms.uLift.value=1+2.5*p0,P.key==="fade"?(u0=Y,B0=p0,P.s=L0):P.key==="black"&&(k0=Math.abs(L0-c[1].s))}return{fade:u0,fl0:B0,lag:k0,reg:z,regK:D}}const K0=[0,0],Ce=[0,0];function Y0(c,y,w=c){for(const T of S){const Y=Math.min(H,2.2+Math.max(0,w-T.start));K0[0]=-g*T.along,K0[1]=k*T.along,he(T.set,Y,K0,.5,T.tum,M(0,.5,w-T.start),2.2+Math.max(0,w-T.start))}const{fade:f,lag:R,reg:I,regK:Z}=he(j,c,Ce,1,0,F0,Math.max(c,w),-ie);{const T=Math.max(c,w),Y=j[1].mesh;$.position.copy(Y.position),$.rotation.copy(Y.rotation),$.material.uniforms.uReg.value=.72*F0*M(7.1,7.45,T)*(1-M(8.25,8.6,T))}if(K){const T=Math.max(c,w);K.material.uniforms.uShow.value=.55*M(5.55,6.3,c)+.45*Math.min(1,Math.max(0,(T-7.65)/.65))}const t0=j[1],z=t0.hC,D=Math.sin(z),a0=Math.cos(z),i0=Math.cos(z),l0=-Math.sin(z),S0=1+.2*Math.sin(y*1.9),u0=(T,Y,X0,P0,p0=t0)=>{T.position.set(p0.mesh.position.x+D*Y+i0*P0,X0,p0.mesh.position.z+a0*Y+l0*P0),T.rotation.y=z+Math.PI/2};u0(T0,.5,f.y+.05,.16),T0.material.uniforms.uAlpha.value=.3*I,T0.rotation.z=Pe,u0(te,.4,f.y,.1),te.material.uniforms.uAlpha.value=.11*I*S0,u0(ae,.3,1.75,.42),ae.material.uniforms.uAlpha.value=ke*F0*M(.3,1,c)*(1-M(7.7,8.3,Math.max(c,w)))*Math.max((a.darkWall!==!1?.2+.65*M(3.9,4.6,c):.85)*f.move,M(6.3,6.8,c))*(.9+.1*S0),u0(oe,.3,f.y,-.14,j[3]),oe.material.uniforms.uAlpha.value=Z*Math.min(.09,.02+.08*R)*S0;const B0=M(3.1,3.38,c)*(1-M(3.7,4.4,c)),k0=1+.5*M(3.1,4.4,c);u0(N0,2.15*J0,f.y+.85,.3),N0.scale.set(3.4*k0,3.2*k0,1),N0.material.uniforms.uAlpha.value=.95*B0;const y0=f.pB-Math.floor(f.pB),P=f.pB>.5&&f.pB<3.3?Math.exp(-y0*5)*(f.pB>=1?1:0):0;return Q0(o,Math.min(q0,le+Math.floor(Math.max(0,f.pB))*o.stride),x0),z0.position.set(x0.x,.9,x0.z+.2),z0.rotation.y=z+Math.PI/2,z0.scale.set(5.5*(1+y0),2.2*(1+.6*y0),1),z0.material.uniforms.uAlpha.value=.2*P,{v:L.v(c),reg:I}}function Re(c,y,w){l.update(y,e.renderer),w&&d0>=0&&(h.updateWorldMatrix(!0,!1),h.worldToLocal(V0.setFromMatrixPosition(w.matrixWorld)));let f;if(d0>=0)f=Math.min(1,d0)*H;else if(w){const I=w.matrixWorld.elements;let Z=Math.atan2(I[12],I[14]);Z<-.4&&(Z+=J);const t0=((y-12+2.75+.92*Z)%(H+2)+H+2)%(H+2);f=n>=0?n:Math.min(H,t0),Y0(f,y);const z=j[1].mesh.position,D=Z+Math.PI/2-j[1].tr.h,a0=Math.cos(D),i0=Math.sin(D),l0=A||1;h.rotation.y=D,h.scale.setScalar(l0),h.position.set(-(z.x*a0+z.z*i0)*l0,0,-(-z.x*i0+z.z*a0)*l0)}else f=0;const R=Y0(f,y,d0>=0?d0*H:f);if(G0.uniforms.uNow.value=y,j0+=Math.min(.1,Math.abs(y-re)),re=y,j0>.14){j0=0;const I=j[1].mesh.position;O0=(O0+1)%16,G0.uniforms.uTrail.value[O0].set(I.x,I.z,y,Math.min(1,R.v/9)*R.reg)}}Y0(0,0);let ce=5.5;for(let c=4.6;c<6.4;c+=.01)if(L.s(c)>=le+1.5*o.stride){ce=c;break}const fe={duration:H,stir:.3/H,walk:.8/H,lope:2.3/H,headSwing:3.45/H,firstBound:4.6/H,midSecondBound:ce/H,landed:6.4/H,gone:7.95/H},ze={flyThrough:[[0,1.7,-70],[0,1.7,-48],[0,1.7,-28],[0,1.7,-8],[0,1.7,14],[0,1.7,34]],cameraAtMidBound:[0,1.7,-28],viewpoints:{pacing:{pos:[0,1.7,-46],look:[(o.sx+o0[0])/2,1.9,(o.sz+o0[1])/2]},crossing:{pos:[0,1.7,-28],look:[0,2.6,0]},vanish:{pos:[0,1.7,-16],look:[r0-V*.67,1.9,X+O*.67]}},restStart:[o.sx+k*.67,0,o.sz+g*.67],restEnd:[r0-V*.67,0,X+O*.67],crossing:{from:[o.P2[0],0,o.P2[1]],to:[o.P3[0],0,o.P3[1]],stride:o.stride},track:{rest:o.S,paceEnd:o.P1,boundFrom:o.P2,boundTo:o.P3,turnEnd:o.P4,stop:[r0,X],hEnd:Q,farWallX:B,ret:G?{a:G.a,b:G.b}:null},portWall:{a:[C[0].a[0],0,C[0].a[1]],b:[C[0].b[0],0,C[0].b[1]],u0:C[0].u0,front:[-k,0,-g]},farWall:{a:[C[1].a[0],0,C[1].a[1]],b:[C[1].b[0],0,C[1].b[1]],u0:C[1].u0,front:[1,0,0]},portalSeat:null,timing:fe};return{object:b,radius:5,height:5,center:new r.Vector3(0,2,0),anchors:ze,style:l,duration:H,timing:fe,setProgress(c,y=0,w=1){d0<0&&(h.position.set(0,0,0),h.rotation.set(0,0,0),h.scale.setScalar(1)),d0=Math.min(2,Math.max(0,c)),ie=Math.max(0,y),F0=Math.min(1,Math.max(0,w))},tigerAt:Le,update:Re,dispose(){c0.dispose()},ground:!1,groundY:0}}export{F as CAN,b0 as CARD,Z0 as PALETTE,w0 as STYLE_GLSL,xe as buildDripGeometry,Qe as buildHero,ye as buildWallGeometry,me as cardMaterial,we as dripMaterial,_e as dustMaterial,Be as makeStyle,Ie as sprayMaterial,ve as wallMaterial};
