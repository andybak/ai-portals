import*as i from"three";const rt=["#F1EEE6","#17150F","#C9C8C2","#6E8F7C","#C46A3A","#7A1F1C","#2FA39A"],Pe=`
uniform vec3 uWhite, uBlack, uSmoke, uGreen, uPenny, uOx, uTurq, uStain, uShade;
uniform vec3 uSunDir;
uniform float uTime, uFogHalf, uFire, uRingY;
uniform vec3 uFront;
uniform vec4 uGust;

vec2 rkHash2(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.xx + p3.yz) * p3.zy); }
float rkHash1(vec3 p){ p = fract(p * .1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float rkNoise3(vec3 x){ vec3 i = floor(x), f = x - i; f = f * f * (3. - 2. * f);
  return mix(mix(mix(rkHash1(i), rkHash1(i + vec3(1,0,0)), f.x), mix(rkHash1(i + vec3(0,1,0)), rkHash1(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(rkHash1(i + vec3(0,0,1)), rkHash1(i + vec3(1,0,1)), f.x), mix(rkHash1(i + vec3(0,1,1)), rkHash1(i + vec3(1,1,1)), f.x), f.y), f.z); }

// Distance is smoke, and it takes the black first: half the contrast of a white trunk is gone at uFogHalf (120 m),
// black clay goes about two and a half times sooner. No scene fog anywhere.
// It goes to uShade, a tone darker than the smoke sky, so far trunks end as silhouette bars against the paler low smoke
// (never as nothing), and the mix is done on square roots (as the eye counts), so black clay stays black for tens of metres.
vec3 rakuFog(vec3 c, float d){
  float l = clamp(sqrt(max(dot(c, vec3(.3, .55, .15)), 0.)) * 1.25, 0., 1.);
  float k = .6931 / max(uFogHalf, 1.);
  float dd = d * d * d / (d * d + 2025.);                // nothing is lost in the first dozen metres: near black is the clay's black
  float f = 1. - exp(-dd * k * mix(1.5, 1., l));
  vec3 m = mix(sqrt(max(c, vec3(0.))), sqrt(uShade), f);
  return m * m;
}

// Copper lustre: hue by the angle between the (quaking) surface normal and the half vector of eye and sun disc.
// turquoise at the glancing angle, oxblood edge on, penny square on, one pale flash at the mirror angle.
vec3 rakuLustre(vec3 n, vec3 toEye){
  vec3 h = toEye + uSunDir; h = h / max(length(h), 1e-4);
  float d = abs(dot(n, h)) + uFire * .08;
  vec3 c = mix(uTurq, uOx, smoothstep(.07, .2, d));
  c = mix(c, uPenny, smoothstep(.34, .58, d));
  c = mix(c, mix(uPenny, uWhite, .3), smoothstep(.925, .985, d) * (1. - .5 * max(uFire, 0.)));
  return c;
}
// what a turned crown averages to far away (flat penny, a little oxblood in it)
vec3 rakuLustreAvg(){ return mix(uPenny, uOx, .22 + .15 * uFire); }

// One crackle generation: Voronoi F2 - F1 in surface coordinates x (cells), periodic in x.x with period per.
// Returns (edge distance in cells, cell id hash). Derivatives are taken by the caller, outside the loop.
vec2 rkCrackle(vec2 x, float per){
  vec2 n = floor(x), f = x - n; float d1 = 8., d2 = 8., id = 0.;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j)); vec2 c = n + g; c.x = mod(c.x, max(per, 1.));
    vec2 o = rkHash2(c + 17.); vec2 r = g + .12 + .76 * o - f; float d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; id = o.x; } else if (d < d2) { d2 = d; }
  }
  return vec2(sqrt(d2) - sqrt(d1), id);
}
// a hairline held at >= 1.5 px: e = edge distance, fw = fwidth(e), w = its fired width in the same units
float rkLine(float e, float fw, float w){ float hw = max(w, .8 * fw); return 1. - smoothstep(hw - .6 * fw - 1e-5, hw + .9 * fw + 1e-5, e); }
`,zt=`
vec3 rakuGlaze(vec2 uvS, float N1, float arc, float ao, vec3 op, vec3 nrm, float dist){
  N1 = max(floor(N1 + .5), 3.);
  vec2 x1 = vec2(uvS.x * N1, uvS.y);
  vec2 fx = fwidth(x1);
  float px1 = 1. / max(max(fx.x, fx.y), 1e-5);          // pixels per generation-1 cell
  float cool = rkNoise3(op * .085 + 3.7);               // where the piece cooled faster
  float lag = rkNoise3(op * .45 + 11.) * 4.;
  // the hand: cracks wander (a seamless warp from object space) and their weight comes and goes
  vec3 wq = op * .5;
  x1 += (vec2(rkNoise3(wq), rkNoise3(wq + 19.3)) - .5) * .8;
  float wv = .55 + 1.0 * rkNoise3(op * 1.2 + 2.);
  vec2 c1 = rkCrackle(x1, N1);
  vec2 c2 = rkCrackle(x1 * 4. + 31., N1 * 4.);
  vec2 c3 = rkCrackle(x1 * 16. + 77., N1 * 16.);
  float f1 = fwidth(c1.x), f2 = fwidth(c2.x), f3 = fwidth(c3.x);
  // fronts: a generation exists where its front has passed; the racing tip is drawn a little heavier
  vec3 t = uFront - arc - lag * vec3(.3, .6, 1.);
  vec3 rev = smoothstep(vec3(0.), vec3(.6, 1.2, 2.), t);
  vec3 tip = exp(-t * t * vec3(.5, .2, .06)) * step(vec3(0.), t);
  // a net finer than ~3 px is replaced by its flat average tint
  float v1 = smoothstep(2.4, 5.5, px1), v2 = smoothstep(2.4, 5.5, px1 * .25), v3 = smoothstep(2.4, 5.5, px1 * .0625);
  float m2 = .35 + .65 * smoothstep(.30, .50, cool), m3 = smoothstep(.47, .62, cool);
  float l1 = mix(.10, rkLine(c1.x, f1, .019 * wv * (1. + 1.6 * tip.x)), v1) * rev.x;
  // about half of the quarter-metre net belongs to the newest firing: it arrives with the racing front and stays
  float young = smoothstep(.44, .56, rkNoise3(op * .21 + 70.));
  float rev2 = mix(rev.y, rev.z, young), tip2 = mix(tip.y, tip.z, young);
  float l2 = mix(.05, rkLine(c2.x, f2, .02 * (1. + 2. * tip2)) * .92, v2) * rev2 * m2;
  float l3 = mix(.03, rkLine(c3.x, f3, .022 * (1. + 2. * tip.z)) * .8, v3) * rev.z * m3;
  float lines = clamp(max(l1, max(l2, l3)), 0., 1.);
  // smoke rubbed into the craze: a soft grey edge beside generation 1 and 2
  float rub = (1. - smoothstep(0., .16, c1.x)) * .30 * rev.x * v1 + (1. - smoothstep(0., .22, c2.x)) * .16 * rev2 * m2 * v2;
  // each cell fired a hair differently
  float cellTint = (c1.y - .5) * .05 * v1;
  // bark eyes: lens scars where the glaze crawled back to black clay, a brow over each, stain round it
  float Ne = max(2., floor(N1 / 4. + .5));
  vec2 ex = vec2(uvS.x * Ne, uvS.y * Ne / N1 * .5);
  ex.y += rkHash2(vec2(mod(floor(ex.x), Ne), 3.)).x * 7.;   // each column at its own height, so two never sit level like a face
  vec2 ei = floor(ex), ew = vec2(mod(ei.x, Ne), ei.y);
  vec2 h = rkHash2(ew + 5.), h2 = rkHash2(ew + 91.);
  float present = step(h.x, .42);
  vec2 q = (ex - ei - vec2(.4 + .2 * h.y, .3 + .4 * h2.x)) * vec2(N1 / Ne, 2. * N1 / Ne);
  q /= (.6 + .6 * h2.y) * min(1., N1 / Ne / 3.6);
  float tlt = (fract(h2.x * 31.) - .5) * 1.1; q = vec2(q.x * cos(tlt) - q.y * sin(tlt), q.x * sin(tlt) + q.y * cos(tlt));
  q += (vec2(rkNoise3(op * 1.6), rkNoise3(op * 1.6 + 7.)) - .5) * .4;
  float browOnly = step(fract(h.x * 17.), .3);
  float dl = length(vec2(q.x, abs(q.y) + 1.517)) - 1.817 + browOnly * .22;
  float fd = fwidth(dl) + 1e-4;
  float eye = present * (1. - smoothstep(-fd, fd, dl));
  float db = abs(length(vec2(q.x * .8, q.y + .95 + .25 * q.x * q.x)) - 1.817);
  float brow = present * step(.6, fract(h.y * 23.)) * step(0., q.y) * (1. - smoothstep(.035, .035 + 1.5 * fd, db)) * (1. - smoothstep(1.0, 1.6, abs(q.x)));
  float halo = present * (q.y < 0. ? exp(-max(dl, 0.) * 1.0) * (1. - smoothstep(.6, 1.2, abs(q.x))) : .6 * exp(-max(dl, 0.) * 2.6));
  // crawled bare spots
  float crawl = rev.y * step(c2.y, .035) * smoothstep(.45, .65, rkNoise3(op * .2 + 40.)) * v2 * smoothstep(.03, .09, c2.x);
  // stain: never cast; it blooms a moment after the smoke has passed
  float smoked = smoothstep(-3., 5., uRingY - op.y * .55 - 8.);
  float stain = ao * (.55 + .45 * smoked) * (.7 + 1.1 * rkNoise3(op * .31 + 5.));
  float under = smoothstep(0., 1., -nrm.y);
  vec3 col = uWhite * (1. - .11 * under + cellTint);
  col = mix(col, uStain, clamp(stain + halo * .65 + rub, 0., .92));
  col = mix(col, uBlack, lines);
  col = mix(col, uBlack, max(eye, max(brow * .92, crawl)));
  return rakuFog(col, dist);
}
// clay with a lit half: lift 0..1 lets the brown of the body through the smoke-black (fern fronds fold along the rib)
vec3 rakuClayL(vec3 op, float dist, float lift){
  return rakuFog(mix(uBlack, uStain, .05 + .06 * rkNoise3(op * .7) + .42 * lift), dist);
}
vec3 rakuClay(vec3 op, float dist){
  return rakuFog(mix(uBlack, uStain, .05 + .06 * rkNoise3(op * .7)), dist);
}
`,Pt=`
attribute vec4 aCk;                       // N1, arc, ao, sway weight
varying vec3 vO, vN, vW; varying vec2 vUv; varying vec4 vCk;
uniform float uTime;
void main(){
  vec3 p = position;
  float sw = aCk.w;                       // twigs sway a hand's width; glaze never moves
  p.x += sin(uTime * 1.1 + position.y * .21 + position.z * .13) * .11 * sw;
  p.z += sin(uTime * .9 + position.x * .17 + position.y * .15) * .09 * sw;
  vO = position; vUv = uv; vCk = aCk;
  vN = normalize(mat3(modelMatrix) * normal + vec3(0., 1e-5, 0.));
  vec4 w = modelMatrix * vec4(p, 1.); vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,Ft=`
varying vec3 vO, vN, vW; varying vec2 vUv; varying vec4 vCk;
void main(){
  float dist = length(vW - cameraPosition);
  vec3 c = rakuGlaze(vUv, vCk.x, vCk.y, vCk.z, vO, vN, dist);
  gl_FragColor = vec4(mix(c, rkPoolCol(dist), .86 * rkAnkle(vW, dist)), 1.);      // smoke lies over the foot of whatever stands in a pool
}`,St=`
attribute vec4 aCk;
varying vec3 vO, vN, vW; varying vec2 vUv; varying vec4 vCk;
uniform float uTime, uViewH;
void main(){
  vec3 p = position; float sw = aCk.w;
  p.x += sin(uTime * 1.1 + position.y * .21 + position.z * .13) * .11 * sw;
  p.z += sin(uTime * .9 + position.x * .17 + position.y * .15) * .09 * sw;
  vec4 w = modelMatrix * vec4(p, 1.);
  float dist = length(w.xyz - cameraPosition);
  float pix = dist * 2. / max(projectionMatrix[1][1] * uViewH, 1.);      // metres per pixel here
  vec3 nw = normalize(mat3(modelMatrix) * normal + vec3(0., 1e-5, 0.));
  w.xyz += nw * max(0., .8 * pix - aCk.x) * step(1e-4, aCk.x);
  vO = position; vUv = uv; vCk = aCk; vN = nw; vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,At=`
varying vec3 vO, vN, vW; varying vec2 vUv; varying vec4 vCk;
void main(){ float dist = length(vW - cameraPosition); vec3 c = rakuClayL(vO, dist, smoothstep(.44, .56, vCk.z));
  gl_FragColor = vec4(mix(c, rkPoolCol(dist), .86 * rkAnkle(vW, dist)), 1.); }`,Ct=`
attribute vec3 aPos;                      // disc centre
attribute vec4 aLeaf;                     // azimuth of the face, tilt, phase 0..1, radius (m)
attribute float aTurn;
uniform float uTurnNow, uTurnSoft, uMinPx, uViewH;
varying vec2 vP; varying vec3 vCol; varying float vDist, vLie;
void main(){
  float ph = aLeaf.z * 6.2832;
  float hz = .5 + .3 * fract(aLeaf.z * 7.31);                       // 0.5 .. 0.8 Hz, never a sparkle
  float gust = 1. + uGust.x * (.5 + .5 * sin(uTime * .35 + aPos.x * .05 + aPos.z * .04));
  float az = aLeaf.x + .44 * gust * sin(uTime * 6.2832 * hz + ph) + .1 * sin(uTime * 2.3 + ph * 3.);
  float tl = aLeaf.y + .08 * sin(uTime * 6.2832 * hz * .5 + ph * 2.);
  vec3 n = vec3(sin(az) * cos(tl), sin(tl), cos(az) * cos(tl));
  vec3 tu = vec3(cos(az), 0., -sin(az));
  vec3 tv = cross(n, tu);
  vec4 cw = modelMatrix * vec4(aPos, 1.);
  vec3 toEye = cameraPosition - cw.xyz; float dist = length(toEye); toEye = toEye / max(dist, 1e-4);
  vec3 nw = normalize(mat3(modelMatrix) * n + vec3(0., 1e-6, 0.));
  float turned = smoothstep(0., max(uTurnSoft, 1e-4), uTurnNow - aTurn);
  vec3 lus = mix(rakuLustre(nw, toEye), rakuLustreAvg(), clamp((dist - 20.) / 200., 0., 1.));
  vec3 grn = uGreen * (.97 + .06 * fract(aLeaf.z * 13.7));
  vCol = rakuFog(mix(grn, lus, turned), dist);
  // a disc lying on the floor inside a pool is under the smoke: a faint shape, a quarter of its contrast at most
  vLie = step(1.2, abs(aLeaf.y));
  if (vLie > .5) vCol = mix(vCol, rkPoolCol(dist), .8 * rkAnkle(cw.xyz, dist));
  vP = position.xy; vDist = dist;
  // a hung disc is never drawn smaller than uMinPx pixels of radius, so a far crown stays a mass and does not fizz away
  float pix = dist * 2. / max(projectionMatrix[1][1] * uViewH, 1.);
  float rad = aLeaf.w * clamp(uMinPx * pix / max(aLeaf.w, .05), 1., 5.) ;
  rad = mix(rad, aLeaf.w, step(1.2, abs(aLeaf.y)));
  vec3 p = aPos + (tu * position.x + tv * position.y) * rad;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(p, 1.);
}`,Vt=`
varying vec2 vP; varying vec3 vCol; varying float vDist, vLie;
void main(){
  // disc with the aspen's small point at the bottom
  vec2 p = vP; float tipw = max(0., -p.y - .55); p.x *= 1. + tipw * .9; p.y *= 1. - .16 * step(p.y, 0.) * (1. - min(abs(p.x) * 2.2, 1.));
  float r = length(p); float fw = fwidth(r) + 1e-5;
  float disc = 1. - smoothstep(1. - fw, 1., r);
  // black clay stalk above the disc, held at 1.5 px, dropped when the leaf is only a few pixels across
  float sw = max(.028, .8 * fw);
  float stalk = (1. - smoothstep(sw - .5 * fw, sw + .5 * fw, abs(vP.x + .09 * (vP.y - .9) * (vP.y - .9)))) * step(.9, vP.y) * step(vP.y, 1.7) * (1. - smoothstep(.05, .12, fw)) * (1. - vLie);
  if (max(disc, stalk) < .5) discard;
  vec3 clay = mix(rakuFog(uBlack, vDist), vCol, vLie);
  // where the matt glaze breaks thin over the rim the clay shows a little
  float rim = smoothstep(.86, .99, r) * (1. - smoothstep(.03, .10, fw)) * .35;
  gl_FragColor = vec4(mix(clay, mix(vCol, clay, rim), disc), 1.);
}`,Lt=`
attribute vec3 aPos; attribute vec4 aPuff;   // size, seed, drift speed, rise
attribute float aGate;                       // the value of uGate.x at which this puff arrives (used where uGate.y is 1)
uniform float uLift, uSpin, uAlpha, uFlat, uRope; uniform vec3 uFar; uniform vec2 uGate;
uniform vec3 uBend;
varying vec2 vP; varying float vA;
void main(){
  float a = uSpin * uTime * (.6 + .8 * aPuff.y) ;
  float c = cos(a), s = sin(a);
  vec3 q = vec3(aPos.x * c + aPos.z * s, aPos.y + uLift + sin(uTime * .21 + aPuff.y * 40.) * aPuff.w, -aPos.x * s + aPos.z * c);
  q.xz *= 1. + .05 * sin(uTime * .13 + aPuff.y * 17.);
  // a rope (aPuff.z > 0): each puff climbs uRope metres from its foot at aPuff.z turns a second, bending over by uBend as it goes
  float rp = fract(aPuff.y * 7.13 + uTime * aPuff.z) * step(1e-5, aPuff.z);
  q += (vec3(0., uRope, 0.) * rp + uBend * rp * rp) * step(1e-5, aPuff.z);
  vec4 mv = viewMatrix * modelMatrix * vec4(q, 1.);
  float dist = length(mv.xyz);
  float sz = aPuff.x * (1. + .12 * sin(uTime * .3 + aPuff.y * 90.)) * (1. + 2.2 * rp);
  mv.xy += position.xy * sz * (1. - uFlat);
  mv += viewMatrix * vec4(position.x * sz, 0., position.y * sz, 0.) * uFlat;      // uFlat 1: the puff lies level (pools, sheets)
  vP = position.xy;
  // thin out against the lens so a puff never slaps the camera, and with distance (smoke on smoke is nothing)
  vA = uAlpha * (.6 + .4 * fract(aPuff.y * 9.7)) * smoothstep(1.5, 9., dist) * (1. - uFar.z * smoothstep(uFar.x, uFar.y, dist))
    * mix(1., smoothstep(0., .07, rp) * (1. - rp * rp), step(1e-5, aPuff.z))
    * mix(1., smoothstep(-6., -1.5, uGate.x - aGate) * (1. - smoothstep(8., 16., uGate.x - aGate)), uGate.y);
  gl_Position = projectionMatrix * mv;
}`,Bt=`
uniform vec3 uSmokeCol;
varying vec2 vP; varying float vA;
void main(){
  float r = dot(vP, vP); float f = max(1. - r, 0.);
  gl_FragColor = vec4(uSmokeCol, vA * f * f);
}`,Tt=`
attribute float aPart, aWing;             // aWing: signed span fraction (-1..1), 0 on the body
attribute vec3 aRoost; attribute vec4 aBird;   // lift threshold, seed, rope radius, rope phase
uniform float uTurnNow, uBirdScale, uCast, uBeat;
varying vec3 vCol; varying vec3 vL; varying float vPart, vDist;
void main(){
  float seed = aBird.y;
  float s = uTurnNow - aBird.x;                                  // metres the smoke has risen past this roost
  float fl = smoothstep(0., 3.5, s);
  float sc = max(s, 0.);
  // the rope: every bird of a tier shares one helix round the trunk and is strung along it
  float dirn = fract(aBird.w * 3.7) < .5 ? 1. : -1.;
  float th = aBird.w * 6.2832 + seed * 1.6 + dirn * (uTime * (.22 + .05 * fract(seed * 5.)) + sc * .055);
  float rr = aBird.z * (1. + .12 * sin(th * 2. + seed * 9.)) + 1.5 * sin(seed * 60.);
  vec3 orb = vec3(sin(th) * rr, aRoost.y + 2. + min(sc, 30.) * .55 + 2.5 * sin(th * 1.5 + seed * 12.) + 1.2 * sin(seed * 31.), cos(th) * rr);
  vec3 c = mix(aRoost, orb, fl);
  c.y += sin(fl * 3.1416) * 2.5;                                 // the jump off the limb
  // a flying bird never comes nearer the eye than five metres: it is eased out along the line from the lens
  { vec3 cw0 = (modelMatrix * vec4(c, 1.)).xyz - cameraPosition; float dl = length(cw0);
    c += cw0 / max(dl, 1e-3) * max(0., 5. - dl) * fl; }
  float face = mix(seed * 40., th + dirn * 1.5708, fl);
  float cf = cos(face), sf = sin(face);
  // wings: flap twice a second with glides; folded on the roost
  float glide = smoothstep(-.3, .25, sin(uTime * .8 + seed * 20.));
  float beat = sin(uTime * 12.566 * uBeat + seed * 30.);
  float ang = mix(-1.25, beat * .95 * glide + .12, fl);
  vec3 p = position; float w = abs(aWing);
  vec3 nl = vec3(0., 1., 0.);
  if (w > 0.) {
    float a = ang * (.55 + .75 * w);
    float fold = mix(.45, 1., fl);
    float x = p.x * fold;
    p.x = x * cos(a); p.y += abs(x) * sin(a); p.z -= (1. - fl) * w * .16;
    nl = vec3(-sign(aWing) * sin(a), cos(a), 0.);
  } else if (aPart > 1.5) { nl = normalize(vec3(.35 * sign(p.x + 1e-4), 1., .1 * sin(uTime * 3. + seed * 7.))); }
  // roost: a slow bob and a tail flick
  p.y += (1. - fl) * .02 * sin(uTime * 2.2 + seed * 50.);
  float dcam = length((modelMatrix * vec4(c, 1.)).xyz - cameraPosition);
  p *= uBirdScale * (1. + .5 * fl * smoothstep(14., 42., dcam)) * (1. - fl * smoothstep(95., 135., dcam));      // on the wing it is seen from further off: a size larger
  float bank = fl * dirn * -.35;
  p.xy = vec2(p.x * cos(bank) - p.y * sin(bank), p.x * sin(bank) + p.y * cos(bank));
  nl.xy = vec2(nl.x * cos(bank) - nl.y * sin(bank), nl.x * sin(bank) + nl.y * cos(bank));
  vec3 pw = c + vec3(p.x * cf + p.z * sf, p.y, -p.x * sf + p.z * cf);
  vec3 nw = vec3(nl.x * cf + nl.z * sf, nl.y, -nl.x * sf + nl.z * cf);
  vec4 wp = modelMatrix * vec4(pw, 1.);
  vec3 toEye = cameraPosition - wp.xyz; float dist = length(toEye); toEye = toEye / max(dist, 1e-4);
  nw = normalize(mat3(modelMatrix) * nw + vec3(0., 1e-6, 0.));
  vec3 col = aPart < .5 ? uWhite * (position.y < 0. ? .9 : 1.) : (aPart < 1.5 ? uBlack : mix(rakuLustre(nw, toEye), rakuLustreAvg(), clamp((dist - 60.) / 240., 0., 1.)));
  vCol = col; vL = position; vPart = aPart; vDist = dist;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,Nt=`
uniform float uCast;
varying vec3 vCol; varying vec3 vL; varying float vPart, vDist;
void main(){
  vec3 col = vCol;
  // the cast: 0 magpie; 1 pied woodpecker (barred wings, one oxblood cap); 2 white owl with black barring
  if (uCast > 1.5) { float ax = abs(vL.x), bx = fract(ax * 7.5 + .15 + vL.z * 1.5), bz = fract(vL.z * 8. + .2);      // barred all over the back, black wing tips: an owl, not a paper dart
    float bar = ax > .07 ? max(1. - smoothstep(.3, .38, bx), smoothstep(.5, .54, ax)) : (vL.y > .03 || vL.z < -.2 ? 1. - smoothstep(.34, .42, bz) : 0.);
    col = mix(uWhite * (vL.y < 0. ? .9 : 1.), uBlack, bar * .92);
    if (vL.z > .455) col = uBlack; }
  else if (uCast > .5) {
    if (vPart > 1.5) col = mix(uBlack, uWhite, step(.5, fract(abs(vL.x) * 6.5 + .25)));
    if (vL.z > .3 && vL.z < .44 && vL.y > .035) col = uOx; }
  if (vPart < .5) {                                              // the breast is glaze: it crazes too
    vec2 x = vL.xz * 16. + vL.y * 9.; vec2 fx = fwidth(x);
    vec2 ck = rkCrackle(x, 512.); float fw = fwidth(ck.x);
    float vis = smoothstep(3., 8., 1. / max(max(fx.x, fx.y), 1e-5));
    col = mix(col, uBlack, mix(.06, rkLine(ck.x, fw, .02), vis));
  }
  gl_FragColor = vec4(rakuFog(col, vDist), 1.);
}`,qt=`
varying vec3 vDir;
void main(){ vDir = position; vec4 p = projectionMatrix * viewMatrix * vec4(position + cameraPosition, 1.);
  if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }`,Ht=`
uniform float uBand, uFloorY, uFloorOn, uFarLine, uGlow;
varying vec3 vDir;
void main(){
  vec3 d = vDir / max(length(vDir), 1e-4);
  float az = atan(d.x, d.z + 1e-5 * step(abs(d.x) + abs(d.z), 0.));
  vec3 col = uSmoke * mix(vec3(1.02, 1.0, .965), vec3(1.05, 1.05, 1.055), smoothstep(-.1, .9, d.y));
  float h = d.y * 15. + .5 * sin(az * 2. + uTime * .02);
  float b1 = sin(h + sin(az * 3. - uTime * .031) * .7), b2 = sin(h * 2.3 + 1.7 + sin(az * 2. + uTime * .017) * .9);
  float bands = smoothstep(-.5, .7, b1) * .65 + smoothstep(-.3, .8, b2) * .35;
  col *= 1. + uBand * (bands - .5) * smoothstep(.015, .16, d.y) * (1. - smoothstep(.5, .95, d.y));
  // the far wood, painted: a tree line (the smoke's shade with verdigris in it, copper where a drift has passed) on a slot of
  // paler smoke between far trunk bars; over it a low pale warm band, strongest under the sun disc: light low between the trunks
  float camY = cameraPosition.y - uFloorY, hl = max(length(d.xz), 1e-3);
  vec2 hd = d.xz / hl; vec2 sh = uSunDir.xz / max(length(uSunDir.xz), 1e-3);
  float sunward = smoothstep(-.6, .95, dot(hd, sh));
  float te = d.y / hl, fy = fwidth(te) + 1e-5;
  float rag = rkNoise3(vec3(hd * 23., 1.)) * .6 + rkNoise3(vec3(hd * 71., 4.)) * .4;
  float y0 = -camY / 430., yb = (14. - camY) / 430., yt = (37. - camY) / 430. + .03 * rag;
  vec3 glowCol = mix(uSmoke, uWhite, .62) * vec3(1.035, 1., .93);
  float glow = (.38 + .62 * sunward) * exp(-max(te - yt, 0.) / .15) * uGlow;
  col = mix(col, glowCol, glow * .8);
  float sd = dot(d, uSunDir); float fs = fwidth(sd) + 1e-6;
  col = mix(col, uWhite, smoothstep(.99966 - fs, .99966 + fs, sd));
  // below the horizon: the floor itself, where the view ray meets y = uFloorY, fading into the smoke as the real floor does
  float tg = (cameraPosition.y - uFloorY) / max(-d.y, 1e-4);
  vec3 hit = cameraPosition + d * min(tg, 3000.);
  vec3 fl = rkFloor(vec3(hit.x, uFloorY, hit.z), min(tg, 3000.));
  col = mix(col, mix(uShade, fl, 1. - smoothstep(300., 700., tg)), step(d.y, 0.) * step(0., tg) * uFloorOn);
  { float bn = rkNoise3(vec3(hd * 150., 2.)), fb = fwidth(bn) + 1e-4;
    float bar = smoothstep(.55 - fb, .55 + fb, bn) * (1. - smoothstep(.5, 1.6, fb));
    vec3 slot = mix(mix(uShade, uSmoke, .5), glowCol, (.3 + .7 * sunward) * uGlow);
    slot = mix(slot, uShade, bar * .8 + .12);
    float cu = smoothstep(.56, .64, rkNoise3(vec3(hd * 7., 3.)));
    vec3 can = mix(mix(uShade, uGreen, .3), mix(uShade, rakuLustreAvg(), .55), cu) * (.93 + .1 * smoothstep(yb, yt, te));
    float inSlot = smoothstep(y0 - fy, y0 + fy, te) * (1. - smoothstep(yb - fy, yb + fy, te));
    float inBand = smoothstep(yb - fy, yb + fy, te) * (1. - smoothstep(yt - fy, yt + fy, te));
    float low = uFarLine * (1. - smoothstep(26., 40., camY));
    col = mix(col, slot, inSlot * low); col = mix(col, can, inBand * low);
    // from above the wood goes on to the horizon: crowns as cells of verdigris, copper along the drifts, dark between
    float tc = (camY - 33.) / max(-d.y, 1e-4); vec3 hc = cameraPosition + d * clamp(tc, 0., 4000.);
    vec2 cx = hc.xz / 12.; vec2 fcx = fwidth(cx); float pxc = 1. / max(max(fcx.x, fcx.y), 1e-5), vis = smoothstep(2.5, 6., pxc);
    vec2 cc = rkCrackle(cx + (vec2(rkNoise3(vec3(cx * .7, 2.)), rkNoise3(vec3(cx * .7, 8.))) - .5), 4096.);
    float cuN = smoothstep(.47, .6, rkNoise3(vec3(hc.xz * .0065, 3.))) * .85;
    vec3 crown = mix(uGreen, rakuLustreAvg(), step(cc.y, cuN)) * (.9 + .2 * fract(cc.y * 7.3));
    crown = mix(mix(uGreen, rakuLustreAvg(), cuN), crown, vis);
    crown = mix(mix(uShade, uBlack, .45), crown, mix(.82, smoothstep(.03, .1, cc.x), vis));
    float hi = smoothstep(34., 41., camY) * uFarLine;
    col = mix(col, rakuFog(crown, clamp(tc, 0., 4000.)), step(d.y, 0.) * hi);
    // the farthest treetops stand a little over the horizon: a ragged edge, never a ruled line
    float tops = .003 + .02 * (rkNoise3(vec3(hd * 37., 6.)) * .6 + rkNoise3(vec3(hd * 150., 2.)) * .4);
    col = mix(col, mix(uShade, uGreen, .12) * .9, hi * step(0., d.y) * (1. - smoothstep(tops - fy, tops + fy, te))); }
  gl_FragColor = vec4(col, 1.);
}`,Et=`
attribute float aPart, aWing; attribute vec4 aFeat;
uniform float uFlap, uFold, uBirdScale, uCast, uHead;
varying vec3 vCol; varying vec3 vL; varying float vPart, vDist; varying vec4 vF;
void main(){
  vec3 p = position; float w = abs(aWing); vec3 nl = vec3(0., 1., 0.);
  if (aFeat.z > .5 && aFeat.z < 2.5) {                             // the head turns on the neck
    vec3 nk = vec3(0., .045, .35); vec3 q = p - nk; float c = cos(uHead), s = sin(uHead);
    p = nk + vec3(q.x * c + q.z * s, q.y, -q.x * s + q.z * c); }
  if (w > 0.) { float a = mix(uFlap, -1.25, uFold) * (.55 + .75 * w); float x = p.x * mix(1., .45, uFold);
    p.x = x * cos(a); p.y += abs(x) * sin(a); p.z -= uFold * w * .16; nl = vec3(-sign(aWing) * sin(a), cos(a), 0.); }
  else if (aPart > 1.5) { nl = normalize(vec3(.35 * sign(p.x + 1e-4), 1., 0.)); }
  p *= uBirdScale;
  vec4 wp = modelMatrix * vec4(p, 1.);
  vec3 toEye = cameraPosition - wp.xyz; float dist = length(toEye); toEye = toEye / max(dist, 1e-4);
  vec3 nw = normalize(mat3(modelMatrix) * nl + vec3(0., 1e-6, 0.));
  vCol = rakuLustre(nw, toEye); vL = position; vPart = aPart; vDist = dist; vF = aFeat;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,Gt=`
uniform float uCast;
varying vec3 vCol; varying vec3 vL; varying float vPart, vDist; varying vec4 vF;
void main(){
  float kind = vF.z, al = vF.x, ac = abs(vF.y);
  float feat = step(3.5, kind), tail = step(4.5, kind), head = step(.5, kind) * (1. - step(1.5, kind)), beak = step(1.5, kind) * (1. - step(2.5, kind)), cov = step(2.5, kind) * (1. - feat);
  float fa = fwidth(al) + 1e-5, fc = fwidth(ac) + 1e-5;
  // glaze crazes (worked out before anything is discarded)
  vec2 cx = feat > .5 ? vec2(al * 5. + vF.w * 37., vF.y * 1.2 + vF.w * 11.) : vL.xz * 15. + vL.y * 9.; vec2 fx = fwidth(cx);
  vec2 ck = rkCrackle(cx, 512.); float fw = fwidth(ck.x);
  float craze = mix(.07, rkLine(ck.x, fw, .03), smoothstep(3., 8., 1. / max(max(fx.x, fx.y), 1e-5)));
  // the round tip of a feather, and the notch between it and the next
  float tq = max(al - .72, 0.) / .28; float e = tq * tq + ac * ac;
  if (feat > .5 && al > .72 && e > 1.) discard;
  float edge = feat * max(smoothstep(1. - 1.6 * fc - .07, 1. - .6 * fc, ac), al > .72 ? smoothstep(.78, .97, e) : 0.);      // the hairline that parts two feathers
  float tip = feat * smoothstep(.8 - fa, .8 + fa, al);
  vec3 wht = uWhite * (vL.y < 0.02 && kind < .5 ? .9 : 1.), col;
  float bar = 0.;
  if (uCast > 1.5) {                                                // white owl
    float b1 = fract(al * (tail > .5 ? 6. : 4.6) + vF.w * 2.3);
    bar = feat * (1. - smoothstep(.3 - fa * 5., .3 + fa * 5., b1));
    bar = max(bar, feat * (1. - tail) * step(.5, vF.w) * smoothstep(.62, .7, al));                 // black wing tips (the primaries)
    bar = max(bar, cov * max(1. - smoothstep(.16, .2, al), step(.5, fract(vF.y * 9. + al * 1.5)) * step(.55, al)));   // a black leading edge, spotted coverts
    float bz = fract(vL.z * 13. + .3);
    bar = max(bar, (1. - feat) * (1. - cov) * (1. - head) * (1. - beak) * step(-.1, vF.y) * (1. - smoothstep(.3, .36, bz)));   // barred back
    bar = max(bar, head * max(step(al, .46) * step(.25, fract(al * 9.)), smoothstep(.46, .5, al) * (1. - smoothstep(.56, .6, al))));   // barred crown, the face ringed black
    bar = max(bar, head * step(.72, al) * step(al, .9) * step(.25, vF.y) * step(vF.y, .8));                               // the eyes
    col = mix(wht, uBlack, max(bar * .94, beak));
  } else if (uCast > .5) {                                          // pied woodpecker
    float b1 = fract(al * 4.2 + .15);
    bar = feat * smoothstep(.5 - fa * 4., .5 + fa * 4., b1) * (1. - smoothstep(.9, .94, al)) * (tail > .5 ? step(.8, abs(vF.w - .5) * 2.) : 1.);
    col = mix(uBlack, wht, bar);
    if (cov > .5) col = vPart < .5 ? wht : mix(uBlack, wht, step(.6, fract(vF.y * 7.)) * step(.3, al) * step(al, .8));
    if (kind < .5) col = vPart < .5 ? wht : uBlack;
    if (head > .5) col = vF.y > .45 && al > .3 ? uOx : (vF.y < .3 && al > .25 ? wht : uBlack);
    if (beak > .5) col = uBlack;
  } else {                                                          // magpie
    col = vPart < .5 ? wht : (vPart < 1.5 ? uBlack : vCol);
    col = mix(col, uBlack, tip * step(1.5, vPart));
  }
  float lum = dot(col, vec3(.3, .55, .15));
  col = mix(col, mix(uBlack, uStain, step(lum, .12) * .5), edge * .9);                              // a brown thread on black feathers, black on the rest
  col = mix(col, uBlack, craze * step(.6, lum));
  gl_FragColor = vec4(rakuFog(col, vDist), 1.);
}`,Rt=`
varying vec3 vW;
void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,Ze=`
uniform float uPool, uAsh, uEntryZ;
uniform vec3 uPoolAt, uClearAt;      // (x, z, radius): a pool that always lies here; clay that always shows here
// The lying smoke as a field (no derivatives: safe in vertex shaders). At world point w seen from dist metres it returns
// (how much smoke lies there, the level above which it is a pool, dist as counted from the entry plane, pre).
// An eye standing behind the entry plane (z < uEntryZ: the view through the previous world's portal) counts smoke only from
// that plane on, so the portal shows what the first frame shows.
vec4 rkPoolField(vec3 w, float dist){
  float pre = 0.;
  { float behind = max(uEntryZ - cameraPosition.z, 0.); float kb = clamp(behind / max(w.z - cameraPosition.z, 1e-3), 0., 1.);
    pre = kb * smoothstep(3., 22., behind); dist = dist * (1. - kb) + 5.5 * pre; }
  float h = max(cameraPosition.y - w.y, .6);
  vec2 sp = w.xz * .043 + vec2(uTime * .011, uTime * .006);
  vec2 wp2 = sp + (vec2(rkNoise3(vec3(sp * 2.3, 7.)), rkNoise3(vec3(sp * 2.3 + 4.7, 9.))) - .5) * .55;
  float raw = rkNoise3(vec3(wp2, uTime * .012)) * .62 + rkNoise3(vec3(wp2 * 2.9 + 3., 3. - uTime * .02)) * .27 + rkNoise3(vec3(sp * 8.3 + 5., uTime * .03)) * .11;
  vec2 ez = vec2(w.x, w.z - uEntryZ);
  float nearEntry = exp(-min(dot(ez, ez) / 3600., 40.));
  { vec2 a = (w.xz - uPoolAt.xy) / max(uPoolAt.z, 1.), b = (w.xz - uClearAt.xy) / max(uClearAt.z, 1.);
    raw += .42 * exp(-min(dot(a, a), 40.)) - .2 * exp(-min(dot(b, b), 40.));
    // along the floor run past the entry the clay is kept mostly bare, so the low flight is over black with pools, not one pale field
    vec2 e = vec2(w.x / 17., (w.z - uEntryZ - 80.) / 44.); raw -= .2 * exp(-min(dot(e, e), 40.));
    // the entry is composed, the same on every seed and hour: bare clay under the eye and to the right of it, a pool lying in
    // from the left, one across to the right behind it, a third further down the avenue
    vec2 p1 = (ez - vec2(7.5, 24.)) / 5.5, p2 = (ez - vec2(-5.5, 44.)) / 5.5, k1 = (ez - vec2(-2.5, 5.5)) / 6., k2 = (ez - vec2(-2., 27.)) / 5.;
    raw += .34 * exp(-min(dot(p1, p1), 40.)) + .27 * exp(-min(dot(p2, p2), 40.)) - .36 * exp(-min(dot(k1, k1), 40.)) - .22 * exp(-min(dot(k2, k2), 40.));
    // this side of the entry plane (seen only in the previous world's portal): bare clay with three small pools, whatever the hour
    vec2 b1 = (ez - vec2(-2.6, -5.5)) / 3.1, b2 = (ez - vec2(2.6, -9.5)) / 3.3, b3 = (ez - vec2(-1., -15.)) / 3.6;
    float rb = .12 + .8 * (exp(-min(dot(b1, b1), 40.)) + exp(-min(dot(b2, b2), 40.)) + exp(-min(dot(b3, b3), 40.)));
    raw = mix(raw, rb, smoothstep(1., 5., -ez.y)); }
  float through = dist / h;
  float pl = mix(max(uPool, .5), 1., nearEntry);
  float th = (.53 - .045 * smoothstep(6., 70., through) + .05 * smoothstep(14., 40., h)) / pl + .16 * pre + .045 * (1. - smoothstep(3., 12., h));      // from far behind the entry the pools are drawn a little smaller, so the portal picture has black in it
  return vec4(raw, th, dist, pre);
}
// what lying smoke looks like from dist metres (a step under the white glaze, so trunks, boulders and deer stand clear of it)
vec3 rkPoolCol(float dist){ return rakuFog(mix(uSmoke, uShade, .22), dist); }
// how much the lying smoke veils a thing at w (0..1): only inside a pool, only ankle-deep. Smoke lies OVER what stands in it.
float rkAnkle(vec3 w, float dist){
  if (w.y > .36) return 0.;
  vec4 f = rkPoolField(vec3(w.x, 0., w.z), dist);
  return smoothstep(f.y - .012, f.y + .03, f.x) * (1. - smoothstep(.1, .36, w.y));
}
`,yt=`
vec3 rkFloor(vec3 w, float dist0){
  vec4 pf = rkPoolField(w, dist0); float dist = pf.z, raw = pf.x, th = pf.y;
  vec2 x = w.xz * 1.9; vec2 fx = fwidth(x); float px = 1. / max(max(fx.x, fx.y), 1e-5);
  vec3 wq = vec3(w.xz * .6, 0.);
  x += (vec2(rkNoise3(wq), rkNoise3(wq + 9.1)) - .5) * 1.3;
  x += (vec2(rkNoise3(vec3(w.xz * .16, 5.)), rkNoise3(vec3(w.xz * .16, 12.))) - .5) * 4.5;      // the hand: plates change scale in patches
  // dried clay: big plates whose fissures gape and close along their length (never a mesh of even lines), a finer craze
  // inside them near the eye, hairlines inside those within a few metres; plates fired a shade apart, a few lifted paler
  vec2 c1 = rkCrackle(x * .62, 4096.); float f1 = fwidth(c1.x);
  vec2 c2 = rkCrackle(x * 2.1 + 13., 4096.); float f2 = fwidth(c2.x);
  vec2 c3 = rkCrackle(x * 7.3 + 41., 4096.); float f3 = fwidth(c3.x);
  float v1 = smoothstep(2.5, 7., px / .62), v2 = smoothstep(2.5, 7., px / 2.1), v3 = smoothstep(3., 9., px / 7.3);
  float wv = rkNoise3(vec3(w.xz * .55, 2.)), wv2 = rkNoise3(vec3(w.xz * 1.7, 6.));
  float patchy = smoothstep(.3, .62, rkNoise3(vec3(w.xz * .11, 4.)));
  float l1 = mix(.07, rkLine(c1.x, f1, .003 + .04 * wv * wv) * smoothstep(.3, .58, wv + .3 * wv2), v1);
  float l2 = mix(.05, rkLine(c2.x, f2, .012 + .03 * wv2) * smoothstep(.3, .6, wv2 + .3 * patchy), v2) * (.35 + .65 * patchy);
  float l3 = rkLine(c3.x, f3, .03) * v3 * smoothstep(.45, .7, rkNoise3(vec3(w.xz * .8, 11.))) * .7;
  float lines = max(l1, max(l2 * .8, l3 * .55));
  // where smoke has lain longest the clay keeps a grey-brown bloom
  float ash = smoothstep(.45, .8, rkNoise3(vec3(w.xz * .045, 1.))) * uAsh;
  float lifted = step(.86, c1.y) * v1;
  vec3 col = mix(uBlack, uStain, .008 + .07 * c1.y * c1.y * v1 + .035 * c2.y * v2 + .1 * lifted + .05 * ash);      // (linear: a little stain goes a long way)
  // a fissure is a gap with pale ash settled in it: heavy ones nearly the smoke's tone, hairlines only a brown thread
  col = mix(col, mix(uStain, uSmoke, .08 + .4 * l1 * wv), lines * (.15 + .25 * l1 * wv + .08 * ash));
  // the lying smoke, as the potter would have it: a stain with an edge. Two values only, black clay and pale smoke, the
  // outline decided (one pixel of blend), sliding slowly; a tide line of stain just inside the edge, a second paler
  // level inside the widest pools. Seen low and far the pools close up a little (a long look through a thin layer),
  // but black always shows between them.
  float fr = fwidth(raw) + 1e-4;
  float pool = smoothstep(th - fr, th + fr, raw);
  float tide = pool * (1. - smoothstep(th + .012 + fr, th + .03 + 2. * fr, raw));
  float core = smoothstep(th + .085 - fr, th + .085 + fr, raw);
  vec3 smokeCol = mix(mix(uSmoke, uShade, .22), uSmoke, core);      // a step under the white glaze, so trunks, boulders and deer stand clear of it
  smokeCol = mix(smokeCol, uStain, .34 * tide);
  // the fissures show faintly through the thin edge of a pool, never through its core
  col = mix(col, smokeCol, pool * (.93 - .1 * lines * (1. - core)));
  return rakuFog(col, dist);
}
`,Dt=`
varying vec3 vW;
void main(){ gl_FragColor = vec4(rkFloor(vW, length(vW - cameraPosition)), 1.); }`;function It(E=rt,P={}){const o=d=>new i.Color(E[d]||rt[d]),l=o(1).lerp(o(2),.27);l.r*=1.3,l.g*=1.08,l.b*=.78;const _=o(2);_.r*=.6,_.g*=.615,_.b*=.645;const u=i.MathUtils.degToRad(P.sunElevation??38),V=i.MathUtils.degToRad(P.sunRight??150),R=new i.Vector3(-Math.sin(V)*Math.cos(u),Math.sin(u),Math.cos(V)*Math.cos(u)),M={uWhite:{value:o(0)},uBlack:{value:o(1)},uSmoke:{value:o(2)},uGreen:{value:o(3)},uPenny:{value:o(4)},uOx:{value:o(5)},uTurq:{value:o(6)},uStain:{value:l},uShade:{value:_},uSunDir:{value:R},uTime:{value:0},uFogHalf:{value:P.fogHalf??120},uFire:{value:P.fire??0},uViewH:{value:720},uRingY:{value:1e4},uFront:{value:new i.Vector3(1e4,1e4,1e4)},uGust:{value:new i.Vector4(0,0,0,0)},uCast:{value:P.cast??0},uBeat:{value:P.beat??1},uPool:{value:1},uAsh:{value:1},uEntryZ:{value:-1e6},uPoolAt:{value:new i.Vector3(0,-1e5,1)},uClearAt:{value:new i.Vector3(0,-1e5,1)}},D=(d,c,f,h)=>new i.ShaderMaterial({uniforms:{...M,...f||{}},vertexShader:d,fragmentShader:c,...h||{}}),F=Pe+Ze+zt;return{uniforms:M,palette:E.slice(),glazeMaterial:(d,c)=>D(Pt,F+Ft,c?{uRingY:c.ringY||M.uRingY,uFront:c.front||M.uFront,uFogHalf:c.fogHalf||M.uFogHalf}:null,d),clayMaterial:(d,c)=>D(St,F+At,c?.fogHalf?{uFogHalf:c.fogHalf}:null,d),leafMaterial:(d,c=.3,f,h)=>D(Pe+Ze+Ct,Pe+Vt,{uTurnNow:d||{value:0},uTurnSoft:{value:c},uMinPx:{value:h?.minPx??0},...h?.fogHalf?{uFogHalf:h.fogHalf}:{}},{side:i.DoubleSide,...f||{}}),smokeMaterial:(d={})=>D(`uniform float uTime;
`+Lt,Bt,{uLift:d.lift||{value:0},uSpin:{value:d.spin??0},uFlat:{value:d.flat?1:0},uAlpha:{value:Math.min(d.alpha??.2,.25)},uRope:{value:d.rope??0},uBend:{value:d.bend||new i.Vector3},uFar:{value:new i.Vector3(...d.far||[150,500,.7])},uGate:d.gate||{value:new i.Vector2(0,0)},uSmokeCol:{value:d.pale<0?o(2).lerp(o(1),-d.pale*.5):o(2).lerp(o(0),d.pale??.25)}},{transparent:!0,depthWrite:!1}),birdMaterial:(d,c=1)=>D(Pe+Tt,Pe+Nt,{uTurnNow:d||{value:0},uBirdScale:{value:c}},{side:i.DoubleSide}),flyerMaterial:(d,c,f=1.3,h)=>D(Pe+Et,Pe+Gt,{uFlap:d||{value:0},uFold:c||{value:0},uBirdScale:{value:f},uHead:h||{value:0}},{side:i.DoubleSide}),floorMaterial:(d={})=>(M.uPool.value=d.pool??1,M.uAsh.value=d.ash??1,M.uEntryZ.value=d.entryZ??-1e6,d.poolAt&&M.uPoolAt.value.copy(d.poolAt),d.clearAt&&M.uClearAt.value.copy(d.clearAt),D(Rt,Pe+Ze+yt+Dt,d.fogHalf?{uFogHalf:d.fogHalf}:null)),skyMaterial:(d={})=>D(qt,Pe+Ze+yt+Ht,{uBand:{value:d.band??.11},uFarLine:{value:d.farLine??0},uGlow:{value:d.glow??0},uFloorY:{value:d.floorY??0},uFloorOn:{value:d.floor?1:0},...d.fogHalf?{uFogHalf:d.fogHalf}:{}},{side:i.BackSide,depthWrite:!1,depthTest:!1})}}function Ke(){const E=[],P=[],o=[],l=[],_=[],u=new i.Vector3,V=new i.Vector3,R=new i.Vector3,M=new i.Vector3,D=new i.Quaternion,F=new i.Vector3;return{get vertexCount(){return E.length/3},get triangleCount(){return _.length/3},sweep(d,c,f={}){const h=f.sides||8,m=d.length,k=E.length/3,g=Math.max(3,Math.round(2*Math.PI*c[0]/(f.cell||1)));u.subVectors(d[1],d[0]).normalize(),V.set(1,0,0),Math.abs(u.x)>.9&&V.set(0,0,1),V.addScaledVector(u,-V.dot(u)).normalize();let L=0,C=0;const N=u.clone();for(let w=0;w<m;w++){if(w<m-1?u.subVectors(d[w+1],d[Math.max(w-1,0)]).normalize():u.subVectors(d[w],d[w-1]).normalize(),D.setFromUnitVectors(N,u),V.applyQuaternion(D),V.addScaledVector(u,-V.dot(u)).normalize(),N.copy(u),R.crossVectors(u,V),w>0){const B=d[w].distanceTo(d[w-1]);L+=B,C+=B*g/(Math.PI*(c[w]+c[w-1]))}for(let B=0;B<=h;B++){const q=B/h*Math.PI*2,j=Math.cos(q),Fe=Math.sin(q);M.copy(V).multiplyScalar(j).addScaledVector(R,Fe);const be=c[w]*(f.shape?f.shape(q,L,M):1);F.copy(d[w]).addScaledVector(M,be),E.push(F.x,F.y,F.z),P.push(M.x,M.y,M.z),o.push(B/h,C),l.push(g,(f.arc0||0)+L,f.ao?Math.min(1,Math.max(0,f.ao(F,M,L,w))):0,f.sway?f.sway(w/(m-1)):0)}if(w>0)for(let B=0;B<h;B++){const q=k+(w-1)*(h+1)+B,j=q+h+1;_.push(q,q+1,j,q+1,j+1,j)}}return{arcEnd:(f.arc0||0)+L,N1:g}},build(){const d=new i.BufferGeometry;return d.setAttribute("position",new i.Float32BufferAttribute(E,3)),d.setAttribute("normal",new i.Float32BufferAttribute(P,3)),d.setAttribute("uv",new i.Float32BufferAttribute(o,2)),d.setAttribute("aCk",new i.Float32BufferAttribute(l,4)),d.setIndex(E.length/3>65535?new i.Uint32BufferAttribute(_,1):new i.Uint16BufferAttribute(_,1)),d}}}function kt(E,P,o){const l=new i.InstancedBufferGeometry;return l.setAttribute("position",new i.Float32BufferAttribute([0,2,0,-1.7321,-1,0,1.7321,-1,0],3)),l.setAttribute("aPos",new i.InstancedBufferAttribute(E,3)),l.setAttribute("aLeaf",new i.InstancedBufferAttribute(P,4)),l.setAttribute("aTurn",new i.InstancedBufferAttribute(o,1)),l.instanceCount=o.length,l.boundingSphere=new i.Sphere(new i.Vector3,1e5),l}function bt(E,P,o){const l=new i.InstancedBufferGeometry;return l.setAttribute("position",new i.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),l.setIndex([0,1,2,0,2,3]),l.setAttribute("aPos",new i.InstancedBufferAttribute(E,3)),l.setAttribute("aPuff",new i.InstancedBufferAttribute(P,4)),l.setAttribute("aGate",new i.InstancedBufferAttribute(o||new Float32Array(P.length/4),1)),l.instanceCount=P.length/4,l.boundingSphere=new i.Sphere(new i.Vector3,1e5),l}function _t(E,P){const o=[],l=[],_=[],u=(h,m,k,g,L=0,C=0,N=0)=>{o.push(...h,...m,...k),l.push(g,g,g),_.push(L,C,N)},V=[[.5,0,-.012],[.4,.055,.03],[.3,.048,.012],[.14,.115,0],[-.06,.09,.005],[-.2,.03,.02]],R=([h,m,k])=>[[0,k+m,h],[m*.9,k,h],[0,k-m*.95,h],[-m*.9,k,h]];for(let h=0;h<V.length-1;h++){const m=R(V[h]),k=R(V[h+1]);for(let g=0;g<4;g++){const L=(g+1)%4,N=(g===1||g===2)&&(h===2||h===3)?0:1;h===0?u(m[0],k[L],k[g],1):(u(m[g],m[L],k[g],N),u(m[L],k[L],k[g],N))}}for(const h of[-1,1]){const m=[h*.06,.05,.16],k=[h*.06,.05,-.06],g=[h*.34,.05,.15],L=[h*.32,.05,-.11],C=[h*.62,.05,-.02],N=[h*.5,.05,-.15],w=B=>h*(Math.abs(B[0])-.06)/.56+h*.001;u(m,g,k,0,w(m),w(g),w(k)),u(k,g,L,2,w(k),w(g),w(L)),u(g,C,L,2,w(g),w(C),w(L)),u(L,C,N,1,w(L),w(C),w(N)),u([h*.035,.02,-.2],[h*.115,.02,-.5],[h*.07,.02,-.55],2)}const M=[-.035,.02,-.2],D=[.035,.02,-.2],F=[-.07,.02,-.55],d=[.07,.02,-.55],c=[0,.02,-.72];u(M,D,d,1),u(M,d,F,1),u(F,d,c,1);const f=new i.InstancedBufferGeometry;return f.setAttribute("position",new i.Float32BufferAttribute(o,3)),f.setAttribute("aPart",new i.Float32BufferAttribute(l,1)),f.setAttribute("aWing",new i.Float32BufferAttribute(_,1)),f.setAttribute("aRoost",new i.InstancedBufferAttribute(E,3)),f.setAttribute("aBird",new i.InstancedBufferAttribute(P,4)),f.instanceCount=P.length/4,f.boundingSphere=new i.Sphere(new i.Vector3,1e5),f}function Yt(){const E=[],P=[],o=[],l=[],_=(c,f,h,m)=>{E.push(c[0],c[1],c[2]),P.push(f),o.push(h),l.push(m[0],m[1],m[2],m[3])},u=(c,f,h,m,k,g,L,C)=>{_(c,m,k(c),g),_(f,m,k(f),L),_(h,m,k(h),C)},V=()=>0,R=([c,f,h],m)=>{const k=[];for(let g=0;g<m;g++){const L=g/m*Math.PI*2,C=Math.cos(L);k.push([Math.sin(L)*f*.92,h+C*f*(C>0?1:.95),c,C])}return k},M=[[.36,.05,.045],[.3,.086,.032],[.2,.118,.012],[.07,.125,0],[-.06,.1,.004],[-.16,.06,.015],[-.225,.028,.02]];for(let c=0;c<M.length-1;c++){const f=R(M[c],8),h=R(M[c+1],8);for(let m=0;m<8;m++){const k=(m+1)%8,g=m>=2&&m<=5&&c>=1&&c<=4?0:1,L=[c/6,f[m][3],0,0],C=[c/6,f[k][3],0,0],N=[(c+1)/6,h[m][3],0,0],w=[(c+1)/6,h[k][3],0,0];u(f[m],f[k],h[m],g,V,L,C,N),u(f[k],h[k],h[m],g,V,C,w,N)}}const D=[[.36,.05,.045],[.4,.074,.062],[.45,.07,.07],[.495,.042,.064],[.52,.02,.058]];for(let c=0;c<D.length-1;c++){const f=R(D[c],6),h=R(D[c+1],6);for(let m=0;m<6;m++){const k=(m+1)%6,g=[c/4,f[m][3],1,0],L=[c/4,f[k][3],1,0],C=[(c+1)/4,h[m][3],1,0],N=[(c+1)/4,h[k][3],1,0];u(f[m],f[k],h[m],1,V,g,L,C),u(f[k],h[k],h[m],1,V,L,N,C)}}{const c=R(D[4],6),f=[0,.048,.615];for(let h=0;h<6;h++)u(c[h],c[(h+1)%6],f,1,V,[0,0,2,0],[0,0,2,0],[1,0,2,0])}const F=(c,f,h,m,k,g,L,C,N,w,B)=>{const q=(ge,we,pe)=>[c[0]+f[0]*m*ge+h[0]*pe*we,L,c[2]+f[2]*m*ge+h[2]*pe*we],j=q(0,-1,k),Fe=q(0,1,k),be=q(.72,-1,g),Se=q(.72,1,g),re=q(1,-1,g),de=q(1,1,g),$=(ge,we)=>[ge,we,N,w];u(j,Fe,Se,C,B,$(0,-1),$(0,1),$(.72,1)),u(j,Se,be,C,B,$(0,-1),$(.72,1),$(.72,-1)),u(be,Se,de,C,B,$(.72,-1),$(.72,1),$(1,1)),u(be,de,re,C,B,$(.72,-1),$(1,1),$(1,-1))};for(const c of[-1,1]){const f=w=>c*(Math.min(1,Math.max(0,(Math.abs(w[0])-.06)/.58))+.001),h=[c*.07,.056,.2],m=[c*.36,.056,.215],k=[c*.07,.056,.085],g=[c*.36,.056,.11],L=[c*.585,.056,.135],C=[c*.55,.056,.07],N=(w,B)=>[w,f(B)*c,3,0];u(h,m,g,0,f,N(0,h),N(0,m),N(1,g)),u(h,g,k,0,f,N(0,h),N(1,g),N(1,k)),u(m,L,C,1,f,N(0,m),N(0,L),N(1,C)),u(m,C,g,1,f,N(0,m),N(1,C),N(1,g));for(let w=0;w<5;w++){const B=(w+.5)/5,q=[k[0]+(g[0]-k[0])*B,0,k[2]+(g[2]-k[2])*B+.02],j=(4+9*B)*Math.PI/180;F(q,[c*Math.sin(j),0,-Math.cos(j)],[c*Math.cos(j),0,Math.sin(j)],.215+.03*B,.034,.036,.05-w*.0016,2,4,(w+.37)/12,f)}for(let w=0;w<7;w++){const B=(w+.5)/7,q=[g[0]+(C[0]-g[0])*B,0,g[2]+(C[2]-g[2])*B+.02],j=(14+62*Math.pow(B,1.25))*Math.PI/180;F(q,[c*Math.sin(j),0,-Math.cos(j)],[c*Math.cos(j),0,Math.sin(j)],.275-.05*B,.026,.03,.042-w*.0016,2,4,(w+5.37)/12,f)}}for(let c=0;c<7;c++){const f=(c-3)*7.5*Math.PI/180,h=Math.abs(c-3);F([Math.sin(f)*.02,0,-.19],[Math.sin(f),0,-Math.cos(f)],[Math.cos(f),0,Math.sin(f)],.55-.035*h,.022,.036,.03-h*.003,h===3?2:1,5,(c+.5)/7,V)}const d=new i.BufferGeometry;return d.setAttribute("position",new i.Float32BufferAttribute(E,3)),d.setAttribute("aPart",new i.Float32BufferAttribute(P,1)),d.setAttribute("aWing",new i.Float32BufferAttribute(o,1)),d.setAttribute("aFeat",new i.Float32BufferAttribute(l,4)),d.boundingSphere=new i.Sphere(new i.Vector3,4),d}const ae={a0:i.MathUtils.degToRad(-60),a1:i.MathUtils.degToRad(395),y0:24,y1:54,approach:40,exit:79,exitPitch:i.MathUtils.degToRad(5)};function Ce(E,P=new i.Vector3){const o=u=>(u=Math.min(1,Math.max(0,u)),u*u*(3-2*u)),l=ae.a0+(ae.a1-ae.a0)*E,_=E<.55?24.5-11*o(E/.55):13.5+5*o((E-.55)/.45);return P.set(-_*Math.cos(l),ae.y0+(ae.y1-ae.y0)*E,_*Math.sin(l))}function Wt(){const E=[],P=new i.Vector3(Math.sin(ae.a0),0,Math.cos(ae.a0)),o=Ce(0);for(let u=8;u>=1;u--)E.push(o.clone().addScaledVector(P,-ae.approach*u/8).setY(ae.y0-4*Math.pow(u/8,1.5)));for(let u=0;u<=64;u++)E.push(Ce(u/64));const l=new i.Vector3(Math.sin(ae.a1)*Math.cos(ae.exitPitch),Math.sin(ae.exitPitch),Math.cos(ae.a1)*Math.cos(ae.exitPitch)),_=Ce(1);for(let u=1;u<=8;u++)E.push(_.clone().addScaledVector(l,ae.exit*u/8));return{pts:E,exitDir:l,entryDir:P}}async function jt(E,P={}){const o=E.rng,l=E.yield?()=>E.yield():async()=>{},_=Math.min(1,Math.max(.6,P.detail??E.quality?.detail??1)),u=P.style||It(P.palette||rt,P),V=u.uniforms,R=new i.Group;R.name="old-stem";const M=(e,t,a)=>new i.Vector3(e,t,a),D=M(0,1,0),F=(e,t,a)=>e+(t-e)*a,d=e=>Math.min(1,Math.max(0,e)),c=80*(P.heightScale??1),f=(()=>{let e=((E.seed??1)*2654435761^2654435769)>>>0;const t=()=>{e=e+1831565813|0;let a=Math.imul(e^e>>>15,1|e);return a=a+Math.imul(a^a>>>7,61|a)^a,((a^a>>>14)>>>0)/4294967296};return t.range=(a,r)=>a+(r-a)*t(),t.gauss=()=>Math.sqrt(-2*Math.log(1-t()*.999999))*Math.cos(6.2832*t()),t})(),h=Wt(),m=10,k=new Map,g=(e,t,a)=>(e+64)*16384+(t+64)*128+(a+64);{const e=M(),t=h.pts.length;for(let a=0;a<t-1;a++){const r=h.pts[a].distanceTo(h.pts[a+1]),s=Math.max(1,Math.ceil(r/1));for(let n=0;n<s;n++){e.lerpVectors(h.pts[a],h.pts[a+1],n/s);const p=g(Math.floor(e.x/m),Math.floor(e.y/m),Math.floor(e.z/m));let x=k.get(p);x||k.set(p,x=[]),x.push(e.x,e.y,e.z)}}}const L=(e,t,a)=>{const r=Math.floor(e/m),s=Math.floor(t/m),n=Math.floor(a/m);let p=9801;for(let x=-1;x<=1;x++)for(let z=-1;z<=1;z++)for(let G=-1;G<=1;G++){const y=k.get(g(r+x,s+z,n+G));if(y)for(let v=0;v<y.length;v+=3){const T=y[v]-e,W=y[v+1]-t,A=y[v+2]-a,I=T*T+W*W+A*A;I<p&&(p=I)}}return Math.sqrt(p)},C=(e,t,a=1)=>{let r=99;for(let s=a;s<e.length;s++)r=Math.min(r,L(e[s].x,e[s].y,e[s].z)-t[s]);return r},N=(e,t,a,r,s,n)=>{const p=[e.clone()],x=t.clone(),z=e.clone(),G=(n[0]<0?-1:1)*(.45+.75*Math.abs(n[0]))/r,y=Math.cos(G),v=Math.sin(G);for(let T=1;T<=r;T++){{const W=x.x*y-x.z*v,A=x.x*v+x.z*y;x.x=W,x.z=A}x.y+=s/r,x.x+=n[T*3]*.2,x.y+=n[T*3+1]*.1,x.z+=n[T*3+2]*.2,x.normalize(),z.addScaledVector(x,a/r),p.push(z.clone())}return p},w=e=>{const t=new Float32Array((e+1)*3);for(let a=0;a<t.length;a++)t[a]=o.range(-1,1);return t},B=(e,t,a=.14,r=.85)=>{const s=[];for(let n=0;n<=t;n++)s.push(Math.max(.045,e*(1-(1-a)*Math.pow(n/t,r))));return s},q=[],j=o.range(0,Math.PI*2),Fe=o.range(.3,.75),be=o.range(.8,1.5),Se=o.range(1.2,3.2),re=(e,t=M())=>{const a=e/c,r=Fe*Math.sin(a*Math.PI*be*2+j)*d(e/12)+Se*Math.pow(d((e-.7*c)/(.3*c)),2);return t.set(Math.cos(j)*r,e,Math.sin(j)*r)},de=e=>e<0?4.5-e*.5:e<50?4.5-1.5*(e/50):.28+2.72*(1-Math.pow(d((e-50)/(c-50)),1.25));{const e=[],t=[];for(let r=0;r<=50;r++){const s=r/50,n=-1.5+(c+1.5)*(.35*s+.65*s*s*(1.3-.3*s))/1;e.push(re(n)),t.push(de(n))}q.push({pts:e,radii:t,level:0,arc0:0,cell:P.trunkCell??1.4,sides:30,attach:[]})}const $=q[0],ge=Math.PI*(3-Math.sqrt(5)),we=o.range(0,Math.PI*2),pe=14;let ye=0;for(let e=0;e<pe;e++){const t=e/(pe-1),a=20+Math.pow(t,.9)*(c-30)+o.range(-1,1),r=we+e*ge+o.range(-.25,.25),s=F(44,13,Math.pow(t,1.1))*o.range(.9,1.1),n=i.MathUtils.degToRad(F(16,52,t)+o.range(-5,6)),p=F(.62,.2,t)*o.range(.8,1.2),x=F(1.25,.42,t)*o.range(.92,1.08),z=Math.max(6,Math.round(s/3.2)),G=w(z),y=B(x,z,.13,.8);let v=null,T=-1e9;e:for(let A=0;A<23;A++)for(let I=0;I<7;I++){const K=r+(A===0?0:Math.ceil(A/2)*.28*(A%2?1:-1)),b=a+(I===0?0:Math.ceil(I/2)*2.2*(I%2?1:-1));if(b<19.5)continue;const Y=M(Math.sin(K)*Math.cos(n),Math.sin(n),Math.cos(K)*Math.cos(n)),xe=N(re(b),Y,s,z,p,G),ue=C(xe,y);if(ue>T&&(T=ue,v={pts:xe,h:b}),ue>=7)break e}if(T<6.4){ye++;continue}{const A=new i.CatmullRomCurve3(v.pts,!1,"centripetal"),I=z*2,K=[],b=[];for(let Y=0;Y<=I;Y++){K.push(A.getPoint(Y/I));const xe=Y/I*z,ue=Math.min(z-1,Math.floor(xe));b.push(F(y[ue],y[ue+1],xe-ue))}v.pts=K,y.length=0;for(const Y of b)y.push(Y)}const W={emerge:de(v.h)*1.12,pts:v.pts,radii:y,level:1,arc0:v.h+1.5,cell:.75,sides:12,attach:[],L:s,order:t};q.push(W);{const A=M().subVectors(v.pts[1],v.pts[0]).normalize(),I=Math.hypot(A.x,A.z)||1;$.attach.push({p:v.pts[0].clone().addScaledVector(A,de(v.h)),r:x,dx:A.x/I,dz:A.z/I})}e%3===2&&await l()}await l();const Ne=(e,t,a,r,s)=>{const n=e.pts.length-1,p=Math.min(n-1,Math.max(1,Math.round(t*n))),x=M().subVectors(e.pts[p+1],e.pts[p-1]).normalize(),z=M().crossVectors(x,D);z.lengthSq()<1e-4&&z.set(1,0,0),z.normalize().multiplyScalar(a);const G=o.range(.7,1.15),y=x.clone().multiplyScalar(Math.cos(G)).addScaledVector(z,Math.sin(G));y.y+=o.range(.05,.3),y.normalize();const v=Math.max(s===2?.16:.09,e.radii[p]*o.range(.5,.62)),T=Math.max(3,Math.round(r/(s===2?3.4:2.6))),W=w(T),A=B(v,T,.2,.9),I=N(e.pts[p],y,r,T,o.range(.15,.5),W);if(C(I,A)<6.5)return null;let K=0;for(let Y=1;Y<=p;Y++)K+=e.pts[Y].distanceTo(e.pts[Y-1]);const b={emerge:e.radii[p]*1.1,pts:I,radii:A,level:s,arc0:e.arc0+K,cell:s===2?.5:.36,sides:s===2?7:5,attach:[]};return e.attach.push({p:I[0].clone().addScaledVector(y,e.radii[p]),r:v}),q.push(b),b},me=q.filter(e=>e.level===1),Ae=(e,t,a,r)=>{const s=e.pts.length-1,n=Math.min(s-1,Math.max(1,Math.round(t*s))),p=M().subVectors(e.pts[n+1],e.pts[n-1]).normalize(),x=M().crossVectors(p,D);x.lengthSq()<1e-4&&x.set(1,0,0),x.normalize().multiplyScalar(a);const z=p.clone().multiplyScalar(r?o.range(0,.3):o.range(.25,.7)).addScaledVector(x,o.range(.6,1));z.y=r?o.range(-.12,.05):o.range(-.3,0),z.normalize();const G=r?o.range(17,25):o.range(9,15),y=Math.max(4,Math.round(G/2.6)),v=Math.max(r?.3:.2,Math.min(r?.5:.38,e.radii[n]*.55)),T=w(y),W=B(v,y,.2,.9),A=N(e.pts[n],z,G,y,r?o.range(-.45,-.2):o.range(-.75,-.35),T);for(let b=1;b<=y;b++)A[b].y<13.5&&(A[b].y=13.5+(13.5-A[b].y)*.2);if(C(A,W)<6.5)return null;let I=0;for(let b=1;b<=n;b++)I+=e.pts[b].distanceTo(e.pts[b-1]);const K={emerge:e.radii[n]*1.1,pts:A,radii:W,level:2,arc0:e.arc0+I,cell:.5,sides:6,attach:[],droop:!0,long:!!r};return e.attach.push({p:A[0].clone().addScaledVector(z,e.radii[n]),r:v}),q.push(K),K},Ve=(e,t,a)=>{const r=e.pts.length-1,s=Math.min(r-1,Math.max(1,Math.round(t*r))),n=e.pts[s],p=Math.hypot(n.x,n.z)||1,x=M().subVectors(e.pts[s+1],e.pts[s-1]).normalize(),z=M(n.x/p,0,n.z/p).multiplyScalar(o.range(.3,.8)).addScaledVector(M(-n.z/p,0,n.x/p),a*o.range(.3,.9)).addScaledVector(x,.2);z.y=o.range(-.75,-.4),z.normalize();const G=o.range(13,21),y=Math.max(5,Math.round(G/3.2)),v=Math.max(.2,Math.min(.36,e.radii[s]*.5)),T=w(y),W=B(v,y,.2,.9),A=N(n,z,G,y,o.range(.1,.5),T);for(let b=1;b<=y;b++)A[b].y<12&&(A[b].y=12+(12-A[b].y)*.25);if(C(A,W)<6.5)return null;let I=0;for(let b=1;b<=s;b++)I+=e.pts[b].distanceTo(e.pts[b-1]);const K={emerge:e.radii[s]*1.1,pts:A,radii:W,level:2,arc0:e.arc0+I,cell:.5,sides:5,attach:[],droop:!0,hanger:!0};return e.attach.push({p:A[0].clone().addScaledVector(z,e.radii[s]),r:v}),q.push(K),K};for(let e=0;e<me.length;e++){const t=me[e];if(t.order>.72)continue;const a=Math.round(F(14,6,t.order/.72));for(let r=0;r<a;r++){const s=F(.3,.98,(r+o.range(.15,.85))/a),n=r%2?1:-1;Ve(t,s,n)||Ve(t,s,-n)||Ve(t,Math.min(.98,s+.12),n)}e%2===1&&await l()}await l();for(let e=0;e<me.length;e++){const t=me[e];if(t.order>.62)continue;const a=Math.round(F(6,3,t.order/.62));for(let r=0;r<a;r++){const s=F(.42,.97,(r+o.range(.15,.85))/a),n=r%2?1:-1;Ae(t,s,n)||Ae(t,s,-n)}for(const[r,s]of[[.5,1],[.5,-1],[.78,1],[.78,-1]]){const n=Ae(t,r+o.range(-.06,.06),s,!0);if(n)for(let p=0;p<3;p++){const x=F(.3,.95,(p+o.range(.2,.8))/3);t.order<.5&&p!==2?Ve(n,x,p?s:-s)||Ae(n,x,-1):Ae(n,x,p%2?1:-1)}}e%2===1&&await l()}await l();for(let e=0;e<me.length;e++){const t=me[e],a=Math.round(F(6,3,t.order));for(let r=0;r<a;r++){const s=F(.26,.9,(r+o.range(.2,.8))/a),n=(r+e)%2?1:-1,p=Ne(t,s,n,(1-s)*t.L*.55+o.range(5,9),2)||Ne(t,s,-n,(1-s)*t.L*.45+5,2);if(!p)continue;const x=o.int(2,3);for(let z=0;z<x;z++)Ne(p,F(.3,.9,(z+o.range(.2,.8))/x),(z%2?1:-1)*n,o.range(4,8.5),3)}e%2===1&&await l()}await l();{const e=q.filter(a=>a.level>=1&&!a.hanger),t=a=>{const r=new Float32Array((a+1)*3);for(let s=0;s<r.length;s++)r[s]=f.range(-1,1);return r};for(let a=0;a<90;a++){const r=a>=46,s=r?F(.56,1,(a-46+f())/44):F(0,.6,(a+f())/46),n=Ce(s),p=Math.hypot(n.x,n.z)||1,x=n.x/p,z=n.z/p,G=r?f.range(3,20):f.range(8,25),y=M(n.x+x*G,n.y+(r?f.range(7.5,12):-f.range(6,12)),n.z+z*G);let v=null,T=1e9,W=0;for(const oe of e)for(let De=1;De<oe.pts.length;De++){const ot=oe.pts[De],Ie=ot.y-y.y;if((r?Ie<-16||Ie>5:Ie<5||Ie>26)||oe.radii[De]<.12)continue;const wt=Math.hypot(ot.x-y.x,ot.z-y.z)+Math.abs(Ie)*.5;wt<T&&(T=wt,v=oe,W=De)}if(!v||T>30)continue;const A=v.pts[W],I=M().subVectors(y,A),K=Math.max(7,I.length()*1.2);I.y*=.55,I.normalize();const b=Math.max(4,Math.round(K/3)),Y=Math.max(.18,Math.min(.34,v.radii[W]*.55)),xe=B(Y,b,.2,.9),ue=N(A,I,K,b,r?.35:-.5,t(b));for(let oe=1;oe<=b;oe++)ue[oe].y<12&&(ue[oe].y=12+(12-ue[oe].y)*.25);if(C(ue,xe)<6.5)continue;let gt=0;for(let oe=1;oe<=W;oe++)gt+=v.pts[oe].distanceTo(v.pts[oe-1]);q.push({emerge:v.radii[W]*1.1,pts:ue,radii:xe,level:2,arc0:v.arc0+gt,cell:.5,sides:5,attach:[],droop:!0,hanger:!0,skirt:!0}),v.attach.push({p:A.clone().addScaledVector(I,v.radii[W]),r:Y}),a%8===7&&await l()}}await l();const Le=Ke(),qe=o.range(0,Math.PI*2),S=M(Math.cos(qe),0,Math.sin(qe)),H=o.int(5,7),U=o.range(0,6.28),X=o.range(0,6.28),ee=(e,t)=>{let a=0;for(let r=0;r<e.length;r++){const s=e[r],n=t.x-s.p.x,p=t.y-s.p.y,x=t.z-s.p.z,z=n*n+p*p+x*x,G=2.3*s.r+.5;if(z<G*G*6&&(a+=Math.exp(-z/(G*G))*(p<0?.95:.4)),p<0&&p>-9*s.r-3){const y=n*n+x*x,v=1.25*s.r+.3;a+=.55*Math.exp(-y/(v*v))*Math.exp(p/(5*s.r+1.5))}}return a};for(let e=0;e<q.length;e++){const t=q[e];if(t.level===0)Le.sweep(t.pts,t.radii,{sides:t.sides,cell:t.cell,arc0:0,shape:(a,r,s)=>{const n=r-1.5,p=Math.exp(-Math.max(n,0)/4.2),x=.5+.5*Math.cos(H*a+U);let z=0;for(let G=0;G<t.attach.length;G++){const y=t.attach[G],v=(n-y.p.y+.6*y.r)/(1.9*y.r),T=s.x*y.dx+s.z*y.dz;v*v<9&&T>0&&(z+=.3*y.r*Math.exp(-v*v)*T*T*T*T)}return 1+p*(.14+.62*x*x*x+.1*Math.cos(2*a+X))+.022*Math.sin(3*a+n*.21+X)+.018*Math.sin(5*a-n*.6+U)+z/Math.max(.3,de(n))},ao:(a,r)=>.42*Math.max(0,r.x*S.x+r.z*S.z)+.6*Math.exp(-Math.max(a.y,0)/2.2)+ee(t.attach,a)});else{const a=t.radii[0],r=t.emerge||0,s=t.level===1?.6:.32;Le.sweep(t.pts,t.radii,{sides:t.sides,cell:t.cell,arc0:t.arc0,shape:(n,p)=>1+s*Math.exp(-Math.max(0,p-r)/(1.3*a)),ao:(n,p,x)=>.3*Math.max(0,-p.y)+.8*Math.exp(-Math.max(0,x-r)/(2*a+.4))+.12*Math.max(0,p.x*S.x+p.z*S.z)+ee(t.attach,n)})}(e%12===11||e<2)&&await l()}for(let e=0;e<H;e++){const t=(Math.PI*2*e-U)/H+o.range(-.08,.08),a=Math.cos(t),r=-Math.sin(t),s=o.range(8,13),n=8,p=[],x=[],z=o.range(-.5,.5),G=re(0);for(let y=0;y<=n;y++){const v=y/n,T=2.6+s*v,W=z*v*v*s*.5+Math.sin(v*4+e*1.7)*1.7*v;p.push(M(G.x+a*T-r*W,2.3*(1-v)*(1-v)*(1-v)-1.7*v*v-.2,G.z+r*T+a*W)),x.push(F(2,.75,Math.pow(v,.8)))}Le.sweep(p,x,{sides:9,cell:.9,arc0:0,shape:(y,v,T)=>.8+.5*T.y*T.y,ao:y=>.6*Math.exp(-Math.max(y.y,0)/.9)})}const O={value:50},se={value:new i.Vector3(1e4,1e4,55)},ne={value:P.heroFogHalf??Math.max(V.uFogHalf.value,300)},te=new i.Mesh(Le.build(),u.glazeMaterial(null,{ringY:O,front:se,fogHalf:ne}));te.name="old-stem-glaze",te.frustumCulled=!1,R.add(te),await l();const Q=Ke(),ce=13,ke=11,J=(c+3-ke)/(ce-1),ie=(e,t)=>{const a=Math.min(ce-1,Math.max(0,Math.round((e-ke)/J)));return F(e,ke+a*J,t)},le=Math.round((P.leaves??56e3)*(.55+.45*(_-.6)/.4)),he=[],st=M(.447,0,-.894),nt=(e,t,a)=>{const r=Math.hypot(e,a);return t<25+4*Math.sin(e*.2+a*.13)&&r>5&&e*st.x+a*st.z>r*.86},Xe=(e,t,a=o)=>{const r=e.pts.length-1,s=t*r,n=Math.min(r-1,Math.floor(s)),p=M().lerpVectors(e.pts[n],e.pts[n+1],s-n),x=M().subVectors(e.pts[n+1],e.pts[n]).normalize(),z=M(a.range(-1,1),a.range(-.35,.5),a.range(-1,1)).addScaledVector(x,.9).normalize(),G=a.range(2.6,5.2),y=Math.min(.075,Math.max(.04,e.radii[n]*.5)),v=[p],T=p.clone(),W=z.clone();for(let b=1;b<=3;b++){W.x+=a.range(-.25,.25),W.z+=a.range(-.25,.25),W.y-=.06,W.normalize(),T.addScaledVector(W,G/3);const Y=T.clone();Y.y=ie(Y.y,.5*(b/3)),v.push(Y)}let A=!0;for(let b=1;b<=3;b++)L(v[b].x,v[b].y,v[b].z)<5&&(A=!1);if(!A||nt(v[3].x,v[3].y+1.5,v[3].z))return;const I=[y,y*.75,y*.5,y*.3],K=Q.vertexCount;Q.sweep(v,I,{sides:3,sway:b=>b*b}),he.push({pts:v,mark:K,skirt:!!e.skirt,w:e.skirt?1.9:e.hanger?2.4:e.droop?1.5:v[3].y>60?.5:1})};for(let e=1;e<q.length;e++){const t=q[e],a=t.long||t.hanger?7:t.droop?5:t.level===3?3:t.level===2?4:8;if(t.skirt){for(let r=0;r<8;r++)Xe(t,F(.25,1,(r+f())/8),f);continue}for(let r=0;r<a;r++)Xe(t,t.level===1?F(.4,1,(r+o())/a):F(t.droop?.2:.3,1,(r+o())/a));e%20===19&&await l()}for(let e=0;e<5;e++)Xe($,F(.93,1,(e+o())/5));await l();const it=Q.build();{const e=it.getAttribute("aCk"),t=e.count;for(let a=0;a<he.length;a++){const r=a+1<he.length?he[a+1].mark:t;for(let s=he[a].mark;s<r;s++){const n=Math.floor((s-he[a].mark)/4);e.setX(s,.06*[1,.75,.5,.3][n])}}}const Qe=new i.Mesh(it,u.clayMaterial(null,{fogHalf:ne}));Qe.name="old-stem-twigs",Qe.frustumCulled=!1,R.add(Qe),await l();const He=92,fe=new Float32Array(He*4);for(let e=0;e<He;e++){const t=F(13,c-3,Math.pow((e+f())/He,.85)),a=(t-44)/40,r=46*Math.sqrt(Math.max(.03,1-a*a)),s=f.range(0,Math.PI*2),n=7+(r-9)*Math.sqrt(f()),p=re(t);fe[e*4]=p.x+Math.cos(s)*n,fe[e*4+1]=t,fe[e*4+2]=p.z+Math.sin(s)*n,fe[e*4+3]=t<27?F(3,19,(t-13)/14)+f.range(-5,4):Math.min(72,t+3.5+f.range(-8,7))}const Je=(e,t,a)=>{let r=1e9;for(let s=0;s<He;s++){const n=fe[s*4]-e,p=(fe[s*4+1]-t)*1.25,x=fe[s*4+2]-a,z=fe[s*4+3]+Math.sqrt(n*n+p*p+x*x);z<r&&(r=z)}return r},lt=Math.round(1400*_),ct=Math.max(1,(le-lt)/Math.max(1,he.reduce((e,t)=>e+(t.skirt?0:t.w),0))),Ee=le+Math.ceil(he.reduce((e,t)=>e+(t.skirt?1:0),0)*ct*2.4)+64,Be=new Float32Array(Ee*3),Me=new Float32Array(Ee*4),$e=new Float32Array(Ee);let Z=0;const ve=M();for(let e=0;e<he.length;e++){const t=he[e].pts,a=he[e].skirt?f:o;for(let r=0,s=Math.round(ct*he[e].w);r<s&&Z<Ee;r++){const n=a.range(.1,1.12)*3,p=Math.min(2,Math.floor(n));ve.lerpVectors(t[p],t[p+1],n-p);const x=a.range(0,Math.PI*2),z=2.7*Math.sqrt(a()),G=a.range(.38,.56),y=a(),v=a(),T=a.range(0,Math.PI*2),W=a.gauss()*.45,A=a.range(-2,2),I=a(),K=ve.x+Math.cos(x)*z,b=ve.z+Math.sin(x)*z,Y=ie(ve.y+.5-y*Math.sqrt(y)*2.4,.42)-G,xe=L(K,Y,b);xe<6.4||nt(K,Y,b)||Y>62&&r%3===2||(Be[Z*3]=K,Be[Z*3+1]=Y,Be[Z*3+2]=b,Me[Z*4]=T,Me[Z*4+1]=W,Me[Z*4+2]=v,Me[Z*4+3]=G*Math.min(1,Math.max(.5,(xe-2.5)/8.5)),$e[Z]=I<.008?1e9:Je(K,Y,b)+A*.7,Z++)}e%4===3&&await l()}for(let e=0;e<lt&&Z<Ee;e++){const t=o.range(0,Math.PI*2),a=7+60*Math.pow(o(),.7);Be[Z*3]=Math.cos(t)*a,Be[Z*3+1]=.06+o()*.05,Be[Z*3+2]=Math.sin(t)*a,Me[Z*4]=o.range(0,6.28),Me[Z*4+1]=1.45+o.range(-.06,.06),Me[Z*4+2]=o(),Me[Z*4+3]=o.range(.3,.42),$e[Z]=1e9,Z++}const et=new i.Mesh(kt(Be.subarray(0,Z*3),Me.subarray(0,Z*4),$e.subarray(0,Z)),u.leafMaterial(O,.5,null,{fogHalf:P.leafFogHalf||ne,minPx:P.leafMinPx??2.1}));et.name="old-stem-leaves",et.frustumCulled=!1,R.add(et),await l();const _e=Math.round((P.birds??400)*(_<.8?.6:1)),We=new Float32Array(_e*3),Ge=new Float32Array(_e*4),ht=q.filter(e=>e.level===1||e.level===2),ft=[],ut=[];for(let e=0;e<ce;e++)ft.push(o.range(15,33)),ut.push(o());for(let e=0;e<_e;e++){const t=ht[Math.floor(o()*ht.length)],a=t.pts.length-1,r=o.range(.15,.92)*a,s=Math.min(a-1,Math.floor(r));ve.lerpVectors(t.pts[s],t.pts[s+1],r-s);const n=F(t.radii[s],t.radii[s+1],r-s),p=Math.min(ce-1,Math.max(0,Math.round((ve.y-ke)/J)));We[e*3]=ve.x,We[e*3+1]=ve.y+n+.1,We[e*3+2]=ve.z,Ge[e*4]=Math.max(26.6+2.4*f(),Je(ve.x,ve.y,ve.z)+o.range(-.9,.9)),Ge[e*4+1]=o(),Ge[e*4+2]=ft[p]+o.range(-1.2,1.2),Ge[e*4+3]=ut[p],e%100===99&&await l()}await l();const tt=new i.Mesh(_t(We,Ge),u.birdMaterial(O,P.birdScale??1.3));tt.name="old-stem-magpies",tt.frustumCulled=!1,R.add(tt);const Oe=Math.round(420*_),Te=new Float32Array(Oe*3),ze=new Float32Array(Oe*4),dt=new Float32Array(Oe);for(let e=0;e<Oe;e++){const t=e%4===3,a=o.range(0,Math.PI*2),r=t?o.range(30,47):25+o.gauss()*3.2;Te[e*3]=Math.cos(a)*r,Te[e*3+1]=o.gauss()*(t?.9:1.5),Te[e*3+2]=Math.sin(a)*r,ze[e*4]=t?o.range(7,11):o.range(4.5,8),ze[e*4+1]=o(),ze[e*4+2]=0,ze[e*4+3]=o.range(.3,.9);const s=e%He;Te[e*3]=fe[s*4]+f.range(-1.2,1.2),Te[e*3+1]=fe[s*4+1]-9,Te[e*3+2]=fe[s*4+2]+f.range(-1.2,1.2),ze[e*4]=f.range(1.5,2.6),ze[e*4+1]=f(),ze[e*4+2]=f.range(.045,.075),ze[e*4+3]=.2,dt[e]=fe[s*4+3]}const pt={value:new i.Vector2(O.value,1)},Ye=new i.Mesh(bt(Te,ze,dt),u.smokeMaterial({rope:15,bend:M(2.2,0,1.4),alpha:.2,pale:.12,far:[70,170,.75],gate:pt}));Ye.name="old-stem-smoke-ring",Ye.frustumCulled=!1,Ye.renderOrder=5,R.add(Ye);const at=Math.round(70*_),je=new Float32Array(at*3),Re=new Float32Array(at*4);for(let e=0;e<at;e++){const t=o.range(0,Math.PI*2),a=o.range(6,38);je[e*3]=Math.cos(t)*a,je[e*3+1]=o.range(.3,.9),je[e*3+2]=Math.sin(t)*a,Re[e*4]=o.range(3.5,7),Re[e*4+1]=o(),Re[e*4+2]=0,Re[e*4+3]=.15}if(P.floor!==!1){const e=new i.Mesh(bt(je,Re),u.smokeMaterial({spin:.012,alpha:.2,flat:!0}));e.name="old-stem-smoke-pool",e.frustumCulled=!1,e.renderOrder=4,R.add(e)}if(P.floor!==!1){const e=new i.Mesh(new i.CircleGeometry(P.floorRadius??90,48).rotateX(-Math.PI/2),u.clayMaterial());e.name="old-stem-floor",R.add(e)}let Ue=null;P.sky!==!1&&(Ue=new i.Mesh(new i.SphereGeometry(900,24,12),u.skyMaterial()),Ue.renderOrder=-.5,Ue.frustumCulled=!1,R.add(Ue)),await l();const vt=h.pts[h.pts.length-1].clone(),Mt={flyThrough:h.pts.map(e=>e.clone()),helixStart:8,helixEnd:72,portalSeat:{position:vt,facing:h.exitDir.clone().negate(),direction:h.exitDir.clone(),radius:7,pitchDeg:5},hoopCentre:vt.clone(),closePass:{position:Ce(.55),lookAt:re(Ce(.55).y)},oneImage:{position:Ce(.72),lookAt:re(Ce(.72).y+2)},entryView:{position:h.pts[0].clone(),lookAt:re(34)},trunkAt:e=>re(e),trunkRadiusAt:e=>de(e),sunDir:V.uSunDir.value.clone(),crownRadius:46,crownBase:21,top:re(c)};let mt=!0;const xt=new i.Vector2;return{object:R,radius:22,height:44,center:M(0,42,0),anchors:Mt,ground:!1,groundY:0,style:u,uniforms:V,ringY:O,fronts:se,fog:ne,skeleton:q,stats:{limbs:me.length,dropped:ye,branches:q.length,twigs:he.length,leaves:Z,birds:_e},setRingY(e){O.value=e},patches:fe,bloomAt:Je,setProgress(e){O.value=F(16,c+8,d(e))},setFronts(e,t,a){mt=!1,se.value.set(e,t,a)},setGust(e){V.uGust.value.x=e},update(e,t,a){V.uTime.value=t,E.renderer&&(E.renderer.getDrawingBufferSize(xt),V.uViewH.value=xt.y),mt&&se.value.set(1e4,1e4,O.value+3.5),pt.value.x=O.value},dispose(){}}}async function Ut(E,P,o={}){const l=E.rng,_=new i.Group;_.name="daughter-hoop";const u=(o.centre||new i.Vector3(0,60,0)).clone(),V=(o.dir||new i.Vector3(0,0,1)).clone().normalize(),R=new i.Vector3().crossVectors(new i.Vector3(0,1,0),V);R.lengthSq()<1e-6&&R.set(1,0,0),R.normalize();const M=new i.Vector3().crossVectors(V,R).normalize(),D=o.thick??1,F=(o.opening??7.5)+D*.8,d=o.groundY??0,c=(S,H=new i.Vector3)=>H.copy(u).addScaledVector(R,Math.cos(S)*F).addScaledVector(M,Math.sin(S)*F),f=[],h=[],m=c(0),k=Math.max(4,m.y-d+1.2),g=12,L=30,C=l.range(1.5,4),N=l.range(0,6.28);for(let S=0;S<g;S++){const H=S/g,U=k*(1-H),X=Math.sin(H*Math.PI)*C;f.push(m.clone().addScaledVector(M,-U).add(new i.Vector3(Math.cos(N)*X+(1-H)*(1-H)*3*R.x,0,Math.sin(N)*X+(1-H)*(1-H)*3*R.z))),h.push(D*(1.3-.3*H)*(1+.6*Math.exp(-(H*k)/2.5)))}const w=Math.PI*2-.09;for(let S=0;S<=L;S++){const H=S/L;f.push(c(H*w)),h.push(D*(1-.28*H)*(1+.1*Math.sin(H*23+N)))}const B=Ke(),q={value:o.fogHalf??Math.max(P.uniforms.uFogHalf.value,260)},j=c(0);B.sweep(f,h,{sides:12,cell:o.cell??1.25,arc0:0,ao:(S,H,U,X)=>.08*Math.max(0,-H.y)+.5*Math.exp(-Math.max(S.y-d,0)/1.5)+.75*Math.exp(-S.distanceToSquared(j)/(5*D*D))*(.55+.45*Math.max(0,-H.y))});{const S=[],H=[];for(let U=0;U<=5;U++){const X=U/5;S.push(c(w+.02).addScaledVector(M,-X*3.2*D).addScaledVector(V,-D*(.75-.5*X))),H.push(D*.5*(1-.8*X))}B.sweep(S,H,{sides:7,cell:.8,arc0:0,ao:()=>.5})}const Fe=[],be=new i.Vector3(0,1,0),Se=S=>{const H=S.clone().sub(u);return H.addScaledVector(V,-H.dot(V)).length()};if(o.crown!==!1){const S=o.boughs??12;for(let H=0;H<S;H++){let U,X,ee;if(H%2){const J=(.98+.86*(H/S)+l.range(-.05,.05))*Math.PI;U=c(J),X=U.clone().sub(u).normalize().addScaledVector(V,l.range(-.8,.8)),X.y+=.2,ee=D*.4}else{const J=.42+.52*(H/S)+l.range(-.03,.03),ie=Math.min(g-1,Math.floor(J*g)),le=l.range(0,6.283);U=f[ie].clone(),X=R.clone().multiplyScalar(Math.cos(le)*.7+.6).addScaledVector(V,Math.sin(le)),X.y=l.range(.1,.45),ee=h[ie]*.4}X.normalize();const O=l.range(10,17),se=7,ne=[U.clone()],te=[],Q=X.clone(),ce=U.clone(),ke=l.range(-.13,.13);for(let J=1;J<=se;J++){Q.applyAxisAngle(be,ke),Q.y+=.07,Q.x+=l.range(-.12,.12),Q.z+=l.range(-.12,.12),Q.normalize(),ce.addScaledVector(Q,O/se);const ie=Se(ce);if(ie<F+3.6){const le=ce.clone().sub(u);le.addScaledVector(V,-le.dot(V)),le.lengthSq()<1e-6&&le.copy(R),le.normalize(),ce.addScaledVector(le,F+3.6-ie)}ne.push(ce.clone())}for(let J=0;J<=se;J++)te.push(Math.max(.07,ee*(1-.82*J/se)));B.sweep(ne,te,{sides:6,cell:.6,arc0:0,shape:(J,ie)=>1+.5*Math.exp(-ie/(1.4*ee)),ao:(J,ie,le)=>.3*Math.max(0,-ie.y)+.7*Math.exp(-le/1)}),Fe.push(ne)}}const re=new i.Mesh(B.build(),P.glazeMaterial(null,{fogHalf:q}));re.frustumCulled=!1,_.add(re),await E.yield?.();const de=Ke(),$=[],ge=[],we=[],pe=new i.Vector3,ye=new i.Vector3,Ne=o.twigs??44;for(let S=0;S<Ne;S++){const H=.12*Math.PI+(S+l())/Ne*.86*Math.PI;c(H,ye),pe.subVectors(ye,u).normalize();const U=pe.clone().addScaledVector(V,l.range(-.5,.5)).addScaledVector(R,l.range(-.3,.3));U.y+=.25,U.normalize();const X=l.range(2.6,5.4),ee=[ye.clone().addScaledVector(pe,D*.6)];for(let O=1;O<=3;O++)ee.push(ye.clone().addScaledVector(U,X*O/3).add(new i.Vector3(l.range(-.3,.3),-.08*O*O,l.range(-.3,.3))));de.sweep(ee,[.075,.055,.036,.02],{sides:3,sway:O=>O*O});for(let O=0;O<15;O++){const se=l.range(.25,1.1)*3,ne=Math.min(2,Math.floor(se)),te=ee[ne].clone().lerp(ee[ne+1],se-ne);te.addScaledVector(pe,l.range(.2,1.6)).add(new i.Vector3(l.range(-1.3,1.3),l.range(-.3,.8),l.range(-1.3,1.3))),!(te.distanceTo(u)<F+D+.7)&&($.push(te.x,te.y,te.z),ge.push(l.range(0,6.28),l.gauss()*.4,l(),l.range(.4,.56)),we.push(o.turn??1e9))}}const me=[];for(let S=0;S<9;S++){const H=(.2+.6*(S+.5)/9)*Math.PI;c(H,ye),pe.subVectors(ye,u).normalize(),me.push(ye.clone().addScaledVector(pe,D*.78))}for(const S of Fe){const H=S.length-1;me.push(S[3].clone().add(new i.Vector3(0,.3,0)));for(let U=0;U<6;U++){const X=(.3+.7*(U+l())/6)*H,ee=Math.min(H-1,Math.floor(X)),O=S[ee].clone().lerp(S[ee+1],X-ee),se=new i.Vector3(l.range(-1,1),l.range(-.2,.6),l.range(-1,1)).add(S[ee+1].clone().sub(S[ee]).normalize()).normalize(),ne=l.range(2.4,4.4),te=[O];for(let Q=1;Q<=3;Q++)te.push(O.clone().addScaledVector(se,ne*Q/3).add(new i.Vector3(l.range(-.3,.3),-.08*Q*Q,l.range(-.3,.3))));de.sweep(te,[.075,.055,.036,.02],{sides:3,sway:Q=>Q*Q});for(let Q=0;Q<17;Q++){const ce=l.range(.2,1.1)*3,ke=Math.min(2,Math.floor(ce)),J=te[ke].clone().lerp(te[ke+1],ce-ke);J.add(new i.Vector3(l.range(-1.9,1.9),l.range(-1.6,.5),l.range(-1.9,1.9)));const ie=l();Se(J)<F+D+1.2||($.push(J.x,J.y,J.z),ge.push(l.range(0,6.28),l.gauss()*.4,l(),l.range(.42,.6)),we.push(ie<.1?1e9:o.crownTurn??-1))}}}const Ae=de.build(),Ve=Ae.getAttribute("aCk");for(let S=0;S<Ve.count;S++)Ve.setX(S,.075*[1,.75,.5,.3][Math.floor(S%16/4)]);const Le=new i.Mesh(Ae,P.clayMaterial(null,{fogHalf:q}));Le.frustumCulled=!1,_.add(Le);const qe=new i.Mesh(kt(new Float32Array($),new Float32Array(ge),new Float32Array(we)),P.leafMaterial(o.turnNow||{value:0},o.turnSoft??.004,null,{fogHalf:q,minPx:1.8}));return qe.frustumCulled=!1,_.add(qe),{object:_,foot:f[0].clone(),centre:u,perches:me}}export{rt as RAKU_PALETTE,Pe as STYLE_GLSL,zt as SURFACE_GLSL,_t as birdGeometry,Ut as buildDaughterHoop,jt as buildHero,Yt as flyerGeometry,kt as leafGeometry,It as makeRakuStyle,Ke as makeSweeper,bt as smokeGeometry};
