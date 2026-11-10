import*as l from"three";const G=.75,ke=42,ra=4.5,Xe=240,Me=16,D=319.5,V=1653,J=3014.25,ce=4320,ie=5760,Ne=7200,Je=8640,k=[285.75,84,4.5,37.5],j=[152.25,84,4.5,37.5],F=[144.75,36,4.5,30],B=[199.5,36,4.5,30],R=335,Z=j[0]+(R-k[0]),Ze=["#F4F0E4","#2E7D5B","#E8B21E","#5A2E44","#1B3C8C","#B96A3C","#CFC9BB"],ee=`
uniform float uTime, uU, uWake, uLook, uSeed, uRare, uDur, uShiver;
uniform float uGait, uCrow, uFlare, uCall, uRay, uGrow, uSecond, uShake;
uniform vec2 uBird;            // the great bird's frieze position on the mural wall, on the north wall
uniform vec2 uOrb;             // the painted sun (or moon): frieze position on the mural wall, on the north wall
uniform vec2 uSprig;           // centre of the bough the small flock carries: on the west wall, on the mural wall
uniform vec3 uSun, uSunCol, uAmb, uSky, uDoorCol, uTin, uBiscuit, uPortalCol;
uniform vec3 uPigLine, uPigLeaf, uPigSun, uPigDark;     // absorbances: outline, leaf, bright, dark
uniform vec4 uPortalL;         // the portal as a light the glaze mirrors: position, strength
uniform vec2 uBounce;          // door bounce: radius squared, gain
uniform vec3 uKey;             // dawn key light: gain of the soft halo round the door pool, of the gold that comes round the corner, of the hard pool
uniform vec4 uDoor;            // x0, x1, height, z of the door rectangle
uniform vec4 uChim;            // chimney axes: x,z and x,z
uniform vec4 uPA, uPB, uPC, uPD;   // patches in frieze metres: start, width, h0, height
uniform vec4 uFP, uFQ;             // the great bird flying as a picture: uFP = the point under him and the angle he faces; uFQ = when he folds and turns, scale, ripple, centre of his patch
float h21(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float h11(float p){ p = fract(p * .1031); p *= p + 33.33; p *= p + p; return fract(p); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
// launch and landing times (in path progress) shared by the wall shader and the flying tiles
// which tiles of the great patch carry the great bird (c = column, row on the patch): they fly as his picture and land together
float birdIn(vec2 c){
  vec2 bp = vec2((c.x + .5) * .75 - 49.25, (c.y + .5) * .75 - 1.6); float dR;
  if (uLook < .5) { vec2 rq = bp - vec2(-5.4, 11.6);
    dR = max(length(rq) - 23., rq.x > 0. ? (.36 * rq.x - rq.y) * .94 : (.577 * rq.x - rq.y) * .866 - 1.3);      // the fan of sickles: no plume hangs below it
    dR = min(dR, (length((bp - vec2(-.3, 10.)) / vec2(8.4, 6.4)) - 1.) * 6.4);
    dR = min(dR, min(max(abs(bp.x - .3) - 5.6, bp.y - 8.), length(bp - vec2(8., 23.)) - 6.2)); }
  else if (uLook < 1.5) {      // the owl as she is painted when she banks up (uCrow 1): body, face, two wings, tail
    vec2 o = vec2(bp.x, bp.y - 18.6) / 1.15, u = vec2(.8776 * o.x + .4794 * o.y, -.4794 * o.x + .8776 * o.y);
    vec2 a = u - vec2(1., 1.5), w2 = vec2(.5817 * a.x + .8134 * a.y, -.8134 * a.x + .5817 * a.y) - vec2(8., 0.);
    vec2 b = u - vec2(.8, 1.2), w1 = vec2(-.7027 * b.x + .7115 * b.y, -.7115 * b.x - .7027 * b.y) - vec2(8.5, 0.);
    vec2 t = u - vec2(-4., 0.); float th = clamp(-t.x / 6.3, 0., 1.);
    dR = min(min((length(u / vec2(5.8, 3.1)) - 1.) * 3.1, (length((u - vec2(5.9, .9)) / vec2(2.15, 2.3)) - 1.) * 2.15),
      min(min((length(w2 / vec2(8., 4.3)) - 1.) * 4.3, (length(w1 / vec2(8.5, 4.3)) - 1.) * 4.3), length(t + vec2(6.3 * th, -.06 * 6.3 * th)) - .4 - 1.9 * th)) * 1.15 - .5; }
  else dR = min(length((bp - vec2(-3., 15.)) / vec2(17., 13.)), length((bp - vec2(-26., 15.)) / vec2(17., 13.))) * 13. - 13.;
  return step(dR + (h21(c + 4.4) - .5) * (uLook > .5 && uLook < 1.5 ? .5 : 1.6), 0.);
}
// the bird's own tiles leave first, all together; then the wall behind lets go from the corner back, the top rows first
float tLaunchG(vec2 c){ return mix(.44 + .034 * (1. - c.x / 111.) + .012 * (1. - c.y / 49.) + .006 * h21(c + 3.7), .425 + .006 * h21(c + 3.7), birdIn(c)); }
// the loose tiles pour home from the far end of the patch back toward the camera; the bird presses in whole a moment later
float tLandG(vec2 c){ return mix(.63 + .1 * (1. - c.x / 111.) + .012 * h21(c + 9.1) + .004 * c.y / 50., .731 + .011 * (1. - c.x / 111.) + .005 * h21(c + 6.3), birdIn(c)); }
float tLaunchS(vec2 c){ return .11 + .028 * (1. - c.x / 47.) + .008 * h21(c + 5.3); }
float tLandS(vec2 c){ return .185 + .03 * (1. - c.x / 47.) + .012 * h21(c + 1.9); }
float tPeelR(vec2 g){ return .50 + .022 * (1. + sin(g.x * .011 + g.y * .05)) + .02 * h21(g + 2.2); }
float tBackR(vec2 g){ return .63 + .02 * (1. + sin(g.x * .013 - g.y * .04)) + .025 * h21(g + 7.4); }
`,ne=`
float gD, gW, gPool, gGlow; vec2 gDir; vec3 gA;
void lay(float sd, float lvl, vec2 dir, vec3 pg){
  float m = 1. - smoothstep(-gW, gW, sd);
  float pool = (1. - smoothstep(0., .05 + gW, -sd)) * gPool * step(.01, lvl);
  gD = mix(gD, lvl + .35 * pool, m); gDir = mix(gDir, dir, m); gA = mix(gA, pg, m); gGlow *= 1. - m;
}
void ink(float sd, float hw, float lvl){
  float m = (1. - smoothstep(-gW, gW, abs(sd) - hw)) * clamp(hw * 2.5 / max(gW, 1e-4), .25, 1.);
  gD = mix(gD, max(gD, lvl), m); gA = mix(gA, uPigLine, m);
}
// a wash and the 6 cm line drawn round it
void wash(float sd, float lvl, vec2 dir, vec3 pg){ lay(sd, lvl, dir, pg); ink(sd, .06, 1.); }
float sdSeg(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; return length(pa - ba * clamp(dot(pa, ba) / max(dot(ba, ba), 1e-4), 0., 1.)); }
float sdTri(vec2 p, vec2 a, vec2 b, vec2 c){
  vec2 e0 = b - a, e1 = c - b, e2 = a - c, v0 = p - a, v1 = p - b, v2 = p - c;
  vec2 q0 = v0 - e0 * clamp(dot(v0, e0) / max(dot(e0, e0), 1e-4), 0., 1.);
  vec2 q1 = v1 - e1 * clamp(dot(v1, e1) / max(dot(e1, e1), 1e-4), 0., 1.);
  vec2 q2 = v2 - e2 * clamp(dot(v2, e2) / max(dot(e2, e2), 1e-4), 0., 1.);
  float s = sign(e0.x * e2.y - e0.y * e2.x);
  vec2 d = min(min(vec2(dot(q0, q0), s * (v0.x * e0.y - v0.y * e0.x)), vec2(dot(q1, q1), s * (v1.x * e1.y - v1.y * e1.x))), vec2(dot(q2, q2), s * (v2.x * e2.y - v2.y * e2.x)));
  return -sqrt(max(d.x, 0.)) * sign(d.y);
}
float sdEll(vec2 p, vec2 r){ return (length(p / max(r, vec2(1e-3))) - 1.) * min(r.x, r.y); }
vec2 rot(vec2 p, float a){ float c = cos(a), s = sin(a); return vec2(c * p.x - s * p.y, s * p.x + c * p.y); }
// guarded polynomial arctangent: the angle of v in (-pi, pi]
float ang2(vec2 v){
  vec2 a = abs(v); float t = min(a.x, a.y) / max(max(a.x, a.y), 1e-4), s = t * t;
  float r = ((-.0464964749 * s + .15931422) * s - .327622764) * s * t + t;
  if (a.y > a.x) r = 1.57079637 - r;
  if (v.x < 0.) r = 3.14159265 - r;
  return v.y < 0. ? -r : r;
}
// a lens leaf: l.x along it, r its half sizes, g growth 0..1; mid green with a pale half and a vein
void leaf(vec2 l, vec2 r, float g){
  if (g < .03) return;
  float d = sdEll(l, r * g);
  wash(d, .55, vec2(1., .2), uPigLeaf);
  lay(max(d + .07, l.y), .2, vec2(1., .2), uPigLeaf);
  ink(max(abs(l.y), d + .12), .03, 1.);
}
// what a curl ends in: pomegranate, carnation, tulip or lemon; blossom (after rain); lantern (dusk)
void bloom(vec2 p, float id, float open){
  float s = 2.5 * (.4 + .6 * open) * (1. + .03 * sin(uTime * 1.1 + id * 3.)), r = length(p);
  if (r > s * 1.9) return;
  if (open < .03) { wash(r - .5, .55, vec2(0., 1.), uPigLeaf); return; }
  vec2 q = p / s; float k = floor(h11(id * 5.3 + 2. + uSeed) * 4.);
  if (uLook > 1.5) k = k < 2.5 ? 4. : 0.; else if (uLook > .5) k = k < 2.5 ? 5. : 4.;
  if (k < .5) {
    wash(sdTri(vec2(abs(q.x), q.y), vec2(0., .8), vec2(.55, .85), vec2(.3, 1.55)) * s, 1., vec2(0., 1.), uPigDark);
    wash((length(q) - 1.) * s, .55, vec2(.7, .7), uPigSun);
    lay(sdEll(q - vec2(-.3, .3), vec2(.4, .3)) * s, .2, vec2(.7, .7), uPigSun);
    wash(sdEll(q - vec2(.2, -.1), vec2(.34, .62)) * s, 1., vec2(0., 1.), uPigDark);
  } else if (k < 1.5) {
    wash(sdEll(q - vec2(0., -.55), vec2(.36, .6)) * s, .55, vec2(0., 1.), uPigLeaf);
    float fan = max(length(q) - 1.05 - .13 * abs(fract(q.x * 3.2) - .5), -q.y - .25 + .9 * abs(q.x));
    wash(fan * s, .55, vec2(0., 1.), uPigDark);
    lay(max(fan + .12, abs(fract(q.x / max(q.y + .9, .3) * 1.6) - .5) - .16) * s, 1., vec2(0., 1.), uPigDark);
  } else if (k < 2.5) {
    wash(sdEll(q - vec2(0., -1.), vec2(.2, .5)) * s, .55, vec2(0., 1.), uPigLeaf);
    float cup = max(sdEll(q, vec2(.8, 1.05)), q.y - .3 - .75 * abs(fract(q.x * 1.25) - .5) * 2.);
    wash(cup * s, .55, vec2(0., 1.), uPigSun);
    lay(max(cup + .1, abs(abs(q.x) - .4) - .09) * s, 1., vec2(0., 1.), uPigDark);
  } else if (k < 3.5) {
    vec2 l = rot(q, .5);
    wash(sdEll(rot(q - vec2(-.75, .8), -.6), vec2(.66, .27)) * s, .55, vec2(.7, .7), uPigLeaf);
    wash(min(sdEll(l, vec2(1.08, .74)), length(l - vec2(1.1, 0.)) - .2) * s, .55, vec2(1., .5), uPigSun);
    lay(sdEll(l - vec2(-.2, .25), vec2(.5, .2)) * s, .2, vec2(1., .5), uPigSun);
  } else if (k < 4.5) {
    float pa = mod(ang2(q) + .6283, 1.2566) - .6283, rq = length(q);
    wash(sdEll(rq * vec2(cos(pa), sin(pa)) - vec2(.62, 0.), vec2(.5, .36)) * s, .2, vec2(0., 1.), uPigSun);
    lay((rq - .24) * s, .55, vec2(1., 0.), uPigDark);
  } else {
    float body = sdEll(q, vec2(.7, .92));
    wash(max(abs(q.x) - .42, abs(abs(q.y) - .98) - .13) * s, 1., vec2(1., 0.), uPigDark);
    wash(body * s, .2, vec2(0., 1.), uPigSun);
    lay(sdEll(q, vec2(.36, .6)) * s, .6 + .2 * sin(uTime * 3. + id * 5.), vec2(0., 1.), uPigSun);
    ink(max(abs(abs(q.x) - .36), body + .05) * s, .035, 1.);
    gGlow = max(gGlow, max(1. - smoothstep(-.1, .1, sdEll(q, vec2(.36, .6)) * s), .4 * (1. - smoothstep(-.5, 3.2, body * s))) * (.85 + .15 * sin(uTime * 3. + id * 5.)));
  }
}
// one curl off a stem. p from the stem's turning point; up = +1 it stands in a trough, -1 it hangs under a crest
void curl(vec2 p, float up, float id){
  if (abs(p.x) > 9.5 || p.y * up < -2.5 || p.y * up > 13.) return;
  float h0 = h11(id * 7.13 + uSeed), h1 = h11(id * 3.71 + 4.3 + uSeed);
  float g = clamp(uGrow * 1.5 - h0 * .5, 0., 1.), sg = h1 < .5 ? 1. : -1.;
  vec2 q = vec2(p.x * sg, p.y * up);
  const float R1 = 5.4, R2 = 2.95, A1 = 4.3, A2 = 3.4;
  float Lg = g * (R1 * A1 + R2 * A2);
  vec2 v = q - vec2(0., R1); float a = ang2(vec2(-v.y, v.x)); if (a < -.9) a += 6.2832;
  float ac = clamp(a, 0., min(Lg / R1, A1));
  float d1 = length(v - R1 * vec2(sin(ac), -cos(ac)));
  vec2 c2 = vec2(0., R1) + (R1 - R2) * vec2(sin(A1), -cos(A1)), v2 = q - c2;
  float b = mod(ang2(vec2(-v2.y, v2.x)) - A1 + .9, 6.2832) - .9;
  float bc = clamp(b, 0., clamp((Lg - R1 * A1) / R2, 0., A2));
  float d2 = Lg > R1 * A1 ? length(v2 - R2 * vec2(sin(bc + A1), -cos(bc + A1))) : 1e3;
  float s = ac * R1, kk = floor(s / 2.7), fs = s - (kk + .5) * 2.7, side = mod(kk, 2.) * 2. - 1.;
  float gl = clamp((Lg - (kk + .5) * 2.7) / 3., 0., 1.) * step(kk, 6.5) * step(abs(a - ac), .02);
  leaf(rot(vec2(fs, (length(v) - R1) * side - 1.2), -.55 + .09 * sin(uTime * 1.6 + kk * 2.1 + id)), vec2(1.45, .6), gl);
  wash(min(d1 - .34, d2 - .25), .55, vec2(-v.y * sg, v.x * up), uPigDark);
  bloom(v2 * vec2(sg, up), id, smoothstep(.8, 1., g));
}
// the tree of life: two sine-ribbon stems (period 60 m), leaves along them and a curl at every turning point
void tree(vec2 p){
  const float K = .10472;
  float sn = sin(p.x * K), cs = cos(p.x * K);
  float y1 = 13. + 5.2 * sn, y2 = 29.5 - 4.6 * sn, m1 = 5.2 * K * cs, m2 = -4.6 * K * cs;
  float j = floor(p.x / 6.), xj = (j + .5) * 6., sd = mod(j, 2.) * 2. - 1., sj = sin(xj * K);
  float lg = smoothstep(.1, .55, uGrow) * (abs(mod(j, 5.) - 2.) < .5 ? 0. : 1.);
  leaf(rot(vec2(p.x - xj, (p.y - 13. - 5.2 * sj) * sd - 1.35), -.6 + .09 * sin(uTime * 1.5 + j)), vec2(1.9, .76), lg);
  leaf(rot(vec2(p.x - xj, (p.y - 29.5 + 4.6 * sj) * -sd - 1.3), -.6 + .09 * sin(uTime * 1.7 + j * 1.3)), vec2(1.8, .72), lg);
  wash(abs(p.y - y1) / sqrt(1. + m1 * m1) - .42, .55, vec2(1., m1), uPigDark);
  wash(abs(p.y - y2) / sqrt(1. + m2 * m2) - .36, .55, vec2(1., m2), uPigDark);
  float n = floor(p.x / 30.), xc = n * 30. + 15., par = mod(n, 2.) * 2. - 1.;
  curl(vec2(p.x - xc, p.y - (13. - 5.2 * par)), par, n);
  curl(vec2(p.x - xc, p.y - (29.5 + 4.6 * par)), -par, n + 40.);
}
// a songbird: ellipse, circle, wedge. p from its feet, face = +1 looks toward +x, s its size
void songbird(vec2 p, float face, float id, float s){
  vec2 q = vec2(p.x * face, p.y) / s;
  if (abs(q.x) > 2.2 || q.y < -.3 || q.y > 2.3) return;
  vec3 pg = h11(id * 9.1) < .5 ? uPigSun : uPigDark;
  wash(sdTri(q, vec2(-.6, .75), vec2(-1.9, .2), vec2(-1.75, .7)) * s, .55, vec2(1., .3), uPigDark);
  ink(max(abs(q.x - .1), abs(q.y - .08) - .14) * s, .04, 1.);
  wash(sdEll(rot(q - vec2(0., .8), -.35), vec2(1., .62)) * s, .55, vec2(1., .3), pg);
  lay(sdEll(rot(q - vec2(-.2, .85), -.5), vec2(.62, .3)) * s, 1., vec2(1., .3), uPigLeaf);
  wash(sdTri(q, vec2(1.2, 1.52), vec2(1.2, 1.24), vec2(1.78, 1.33)) * s, .55, vec2(1., 0.), uPigSun);
  wash((length(q - vec2(.85, 1.4)) - .44) * s, .55, vec2(1., 0.), pg);
  lay((length(q - vec2(.98, 1.48)) - .09) * s, 1., vec2(1., 0.), uPigLine);
}
// songbirds perch on the stems and hop to a new perch every few seconds
void songbirds(vec2 p){
  float c = floor(p.x / 20.), top = step(21., p.y), id = c + 30. * top + uSeed;
  if (h11(id * 2.3) > .8) return;
  float T = uTime / (1.7 + 1.5 * h11(id)) + h11(id * 1.7) * 9., k = floor(T), f = T - k;
  float xa = (h11(k * 1.9 + id * 3.) - .5) * 11., xb = (h11((k + 1.) * 1.9 + id * 3.) - .5) * 11.;
  float e = smoothstep(.7, 1., f), x = (c + .5) * 20. + mix(xa, xb, e);
  float ys = top > .5 ? 29.5 - 4.6 * sin(x * .10472) : 13. + 5.2 * sin(x * .10472);
  songbird(vec2(p.x - x, p.y - ys - .4 - 2.2 * sin(e * 3.14159)), xb > xa ? 1. : -1., id, 1.5);
}
// bees circling (moths at dusk)
void bees(vec2 p){
  vec2 g = vec2(15., 9.), c = floor(p / g); float id = c.x + c.y * 17. + uSeed;
  if (h11(id * 1.3) > .78) return;
  float ph = uTime * (1.6 + h11(id * 2.1)) + h11(id) * 6.28;
  vec2 q = (p - (c + .35 + .3 * vec2(h11(id * 3.1), h11(id * 4.7))) * g - 2.4 * vec2(cos(ph), .45 * sin(ph * 1.31))) / 1.6;
  if (dot(q, q) > 1.8) return;
  gW /= 1.6;
  float fl = .75 + .25 * sin(uTime * 31. + id);
  if (uLook > .5 && uLook < 1.5) {
    wash(sdTri(vec2(abs(q.x), q.y), vec2(.06, -.2), vec2(.95, .55 * fl), vec2(.75, -.5)), .2, vec2(1., 0.), uPigDark);
    lay(sdEll(q, vec2(.14, .42)), 1., vec2(0., 1.), uPigDark);
  } else {
    ink(sdEll(q - vec2(-.1, .32 * fl), vec2(.3, .2)), .035, 1.); ink(sdEll(q - vec2(.22, .3 * fl), vec2(.24, .17)), .035, 1.);
    float bd = sdEll(q, vec2(.42, .27));
    wash(bd, .55, vec2(1., 0.), uPigSun);
    lay(max(bd, abs(fract(q.x * 3.2) - .5) - .22), 1., vec2(0., 1.), uPigDark);
  }
  gW *= 1.6;
}
// blossom blowing from tile to tile (after rain)
void petals(vec2 p){
  vec2 q = p - vec2(uTime * 2.4, 1.3 * sin(p.x * .1309 + uTime * .7)), g = vec2(8., 6.), c = floor(q / g);
  float id = mod(c.x, 30.) * 1.7 + c.y * 13.3;
  if (h11(id) > .55) return;
  vec2 l = rot(q - (c + .25 + .5 * vec2(h11(id * 3.3), h11(id * 5.9))) * g, uTime * (1. + h11(id * 2.)) + id);
  wash(sdEll(l, vec2(.42, .24)), .2, vec2(1., 0.), uPigSun);
}
// the mound the tree grows from and the great bird walks on
void mound(vec2 p){
  float ym = 5.6 + .42 * sin(p.x * .4189) + .22 * sin(p.x * 1.0472 + 1.);
  if (p.y > ym + 1.6) return;
  float j = floor(p.x / 2.), hh = h11(j + 7.), fx = p.x - (j + .5) * 2. - (hh - .5) * .6;
  wash(sdTri(vec2(abs(fx), p.y), vec2(0., ym + .5 + .7 * hh), vec2(.34, ym - .2), vec2(0., ym - .2)), .55, vec2(0., 1.), uPigLeaf);
  wash(p.y - ym, .2, vec2(1., 0.), uPigLeaf);
  lay(max(abs(p.y - ym + .55) - .07, abs(fract(p.x / 1.5) - .5) * 1.5 - .42), .55, vec2(1., 0.), uPigLeaf);
}
// the bough the small flock carries: lemons, or finches. p.x from its centre
void sprig(vec2 p){
  if (abs(p.x) > 17.5 || p.y < 9. || p.y > 33.) return;
  float yb = 24. + 3.2 * sin(p.x * .11 + .5) - .012 * p.x * p.x, m = .352 * cos(p.x * .11 + .5) - .024 * p.x;
  float n = clamp(floor(p.x / 6.4 + .5), -2., 2.), xc = n * 6.4, yc = 24. + 3.2 * sin(xc * .11 + .5) - .012 * xc * xc;
  float n2 = clamp(floor(p.x / 6.4), -3., 2.), xl = (n2 + .5) * 6.4, yl = 24. + 3.2 * sin(xl * .11 + .5) - .012 * xl * xl;
  leaf(rot(vec2(p.x - xl - .8, p.y - yl - 1.6), -.75), vec2(2.5, .95), 1.);
  leaf(rot(vec2(p.x - xl + 1.2, p.y - yl + 1.3), .5), vec2(2.1, .8), 1.);
  wash(max(abs(p.y - yb) / sqrt(1. + m * m) - .5 * (1. - abs(p.x) / 19.), abs(p.x) - 16.5), .55, vec2(1., m), uPigDark);
  if (uSecond < .5) {
    float hh = h11(n + 3.);
    ink(max(abs(p.x - xc), abs(p.y - yc + .7) - .7), .05, 1.);
    vec2 l = rot(vec2(p.x - xc, p.y - yc + 3.1 + .6 * hh), .25 + .5 * hh);
    wash(min(sdEll(l, vec2(1.55, 2.1)), length(l + vec2(0., 2.2)) - .4), .55, vec2(.4, 1.), uPigSun);
    lay(sdEll(l - vec2(-.5, .5), vec2(.45, 1.)), .2, vec2(.4, 1.), uPigSun);
  } else songbird(vec2(p.x - xc, p.y - yc - .4), mod(n, 2.) * 2. - 1., n + 50., 2.6);
}
`,qe=`
// sickle plumes: polar about the rump, the angle sheared by radius, divided by the flare and repeated eleven times
void sickles(vec2 p, float flare){
  float r = length(p);
  if (r > 22.5 || r < .4) return;
  float ts = ang2(rot(p, -mix(2.2, 1.75, flare))) - mix(1.15, .45, flare) * (1. + .07 * sin(uTime * 1.3 - r * .2)) * r * r / 400.;
  float dA = .286 * flare, fi = clamp(floor(ts / dA + 5.5), 0., 10.), dth = ts - (fi - 5.) * dA;
  float L = 15.5 + 6. * h11(fi * 3.7 + 1.3), t = r / L;
  float hw = 1.5 * min(t * 4., 1.) * max(1. - t * t, 0.), sd = max(r * abs(dth) - hw, r - L), m3 = mod(fi, 3.);
  vec3 pg = m3 < .5 ? uPigLeaf : (m3 < 1.5 ? uPigSun : uPigDark);
  lay(sd, .55, p / r, pg);
  lay(max(sd + .1, r * dth + .35 * hw), .2, p / r, pg);
  ink(max(abs(r * dth), sd + .25), .04, 1.);
  ink(r * (dA * .5 - abs(dth)) + step(0., sd) * 1e3, .05, 1.);
  ink(sd, .06, 1.);
}
// a two-bone leg whose foot stays planted in frieze space through its stance: f = this foot's gait phase
float leg(vec2 p, vec2 hip, float f, float l){
  const float S = ${Me.toFixed(2)};
  float rel = f < .6 ? S * (.3 - f) : S * (-.3 + .6 * smoothstep(.6, 1., f));
  float lift = f < .6 ? 0. : 1.8 * sin(3.14159 * (f - .6) / .4);
  vec2 F = vec2(hip.x + rel, lift), d = F - hip; float len = max(length(d), 1e-3), a = min(len, 2. * l - .05) * .5;
  vec2 dn = d / len, kn = hip + dn * a + vec2(dn.y, -dn.x) * sqrt(max(l * l - a * a, 0.)), sp = mix(kn, F, .6);
  float sd = min(sdSeg(p, hip, kn) - .42, sdSeg(p, kn, F) - .27);
  sd = min(sd, min(sdSeg(p, F, F + vec2(2., -.05)) - .2, sdSeg(p, F, F + vec2(1.55, .55)) - .17));
  return min(sd, min(sdSeg(p, F, F + vec2(-.95, 0.)) - .17, sdSeg(p, sp, sp + vec2(-.8, .25)) - .12));
}
// the cockerel. p from the ground under him; he faces +x. uGait walks him, uCrow stretches him, uFlare fans the tail
void cockerel(vec2 p){
  if (p.x < -29. || p.x > 14. || p.y < -.6 || p.y > 35.) return;
  vec2 H = vec2(-.3, 7.1);
  vec2 u = H + rot(p - H, -(.2 * uCrow + .035 * sin(12.566 * uGait) + uShake));
  wash(leg(p, H + vec2(.5, 0.), fract(uGait + .5), 4.6), .55, vec2(0., 1.), uPigSun);
  sickles(u - vec2(-5.4, 11.6), uFlare);
  vec2 e = rot(u - vec2(0., 10.2), -.18); float body = sdEll(e, vec2(6.6, 4.4) * (1. + .012 * sin(uTime * 2.1)));
  wash(body, 1., vec2(1., .2), uPigDark);
  lay(max(body + .45, abs(length(vec2((fract(e.x / 1.8) - .5) * 1.8, (fract(e.y / 1.5) - .5) * 1.5)) - .5) - .07) + step(e.x, 1.6) * 1e3, .55, vec2(1., 0.), uPigSun);
  vec2 sq = rot(u - vec2(-3.9, 12.3), .45); float sdl = sdEll(sq, vec2(3., 1.5));
  wash(sdl, .55, vec2(1., -.4), uPigSun);
  lay(max(sdl + .15, abs(fract(sq.y / .8) - .5) * .8 - .14), 1., vec2(1., -.4), uPigSun);
  vec2 wq = rot(u - vec2(-.6, 10.7), .22); float wg = sdEll(wq, vec2(4.1, 2.35));
  wash(wg, .55, vec2(1., -.2), uPigLeaf);
  lay(sdEll(wq - vec2(.9, .45), vec2(2.5, 1.2)), .2, vec2(1., -.2), uPigLeaf);
  ink(max(abs(wq.y + .55), wg + .3), .04, 1.); ink(max(abs(wq.y + 1.3), wg + .3), .04, 1.);
  wash(leg(p, H, fract(uGait), 4.6), .55, vec2(0., 1.), uPigSun);
  wash(sdEll(u - vec2(-.2, 6.7), vec2(1.9, 2.4)), 1., vec2(0., 1.), uPigDark);
  // neck under its cape of hackle lancets
  vec2 S = vec2(4.3, 12.4), N = mix(vec2(7.1, 18.4), vec2(6.3, 21.2), uCrow), nv = N - S; float nl = length(nv); vec2 nd = nv / nl;
  float al = dot(u - S, nd), cr = dot(u - S, vec2(-nd.y, nd.x)), hh = clamp(al / nl, 0., 1.);
  float dn = length(u - S - nd * clamp(al, 0., nl)) - mix(3.1, 1.4, hh);
  dn = max(dn, -(al + 2.5 - 1.4 * abs(fract(cr / 1.1) - .5) * 2.));
  wash(dn, .55, nd, uPigSun);
  lay(max(dn + .2, abs(fract(cr / 1.1 + .5) - .5) * 1.1 - .17 - .1 * (1. - hh)), 1., nd, uPigSun);
  // head: five-lobed comb, wattles, the bill that opens
  const float HS = 1.3;
  vec2 hp = rot(u - N - rot(vec2(1.3, 1.5), .5 * uCrow), -.9 * uCrow - .1 * sin(uTime * .8) * (1. - uCrow)) / HS;
  float cb = min(min(length(hp - vec2(-1.55, 1.05)) - .72, length(hp - vec2(-.8, 1.75)) - .85), min(min(length(hp - vec2(.15, 2.05)) - .9, length(hp - vec2(1.05, 1.75)) - .78), length(hp - vec2(1.7, 1.1)) - .58));
  wash(cb * HS, 1., vec2(0., 1.), uPigDark);
  wash(min(sdEll(hp - vec2(1.05, -1.85), vec2(.55, 1.15)), sdEll(hp - vec2(.4, -1.7), vec2(.45, .95))) * HS, 1., vec2(0., 1.), uPigDark);
  wash(min(sdTri(hp, vec2(1.3, .6), vec2(1.3, -.05), vec2(3.5, .1 + .6 * uCall)), sdTri(hp, vec2(1.3, -.05), vec2(1.3, -.6), vec2(3.1, -.4 - .9 * uCall))) * HS, .55, vec2(1., 0.), uPigSun);
  wash((length(hp) - 1.7) * HS, .55, vec2(1., 0.), uPigSun);
  lay(sdEll(hp - vec2(.6, .05), vec2(.9, .72)) * HS, .55, vec2(1., 0.), uPigDark);
  lay((length(hp - vec2(.62, .32)) - .34) * HS, 0., vec2(1., 0.), uPigDark); ink((length(hp - vec2(.62, .32)) - .34) * HS, .04, 1.);
  lay((length(hp - vec2(.7, .32)) - .15) * HS, 1., vec2(1., 0.), uPigLine);
}
// a long-tailed pheasant running; uCrow makes it burst up. ph offsets its gait
void pheasant(vec2 p, float ph){
  if (p.x < -26. || p.x > 11. || p.y < -.6 || p.y > 30.) return;
  float up = uCrow, g = fract(uGait + ph);
  vec2 H = vec2(-.2, 5.3), pl = p - vec2(0., 9. * up);
  vec2 u = H + rot(pl - H, -(.55 * up + .04 * sin(12.566 * g) + uShake));
  wash(leg(pl, H + vec2(.4, 0.), fract(g + .5), 3.75), .55, vec2(0., 1.), uPigDark);
  vec2 tq = rot(u - vec2(-4.3, 7.4), -2.92); float tt = clamp(tq.x / 19., 0., 1.);
  float tsd = max(abs(tq.y) - 1.05 * (1. - tt) - .08, max(-tq.x, tq.x - 19.));
  wash(tsd, .55, vec2(-1., .2), uPigDark);
  lay(max(tsd + .12, abs(fract(tq.x / 1.7) - .5) * 1.7 - .28), 1., vec2(0., 1.), uPigDark);
  if (up > .05) {
    vec2 w2 = rot(u - vec2(.5, 9.2), -1.9); float wd = sdEll(w2 - vec2(4.6 * up, 0.), vec2(4.8 * up, 2.2));
    wash(wd, .55, vec2(0., 1.), uPigLeaf);
    lay(max(wd + .12, abs(fract(w2.x / 1.5) - .5) * 1.5 - .3), 1., vec2(1., 0.), uPigLeaf);
  }
  vec2 e = rot(u - vec2(0., 7.5), -.12); float body = sdEll(e, vec2(5.1, 3.05));
  wash(body, 1., vec2(1., .1), uPigDark);
  lay(max(body + .4, abs(length(vec2((fract(e.x / 1.6) - .5) * 1.6, (fract(e.y / 1.3) - .5) * 1.3)) - .45) - .07), .2, vec2(1., 0.), uPigDark);
  vec2 wq = rot(u - vec2(-.5, 7.9), .15); float wg = sdEll(wq, vec2(3.3, 1.75));
  wash(wg, .55, vec2(1., -.1), uPigLeaf);
  lay(sdEll(wq - vec2(.7, .3), vec2(2., .85)), .2, vec2(1., -.1), uPigLeaf);
  ink(max(abs(wq.y + .5), wg + .25), .04, 1.);
  wash(leg(pl, H, g, 3.75), .55, vec2(0., 1.), uPigDark);
  wash(sdEll(u - vec2(-.1, 5.2), vec2(1.5, 1.8)), 1., vec2(0., 1.), uPigDark);
  vec2 S = vec2(3.6, 8.8), N = vec2(5.6, 12.6), nv = N - S; float nl = length(nv); vec2 nd = nv / nl;
  float al = dot(u - S, nd), dn = length(u - S - nd * clamp(al, 0., nl)) - mix(1.9, 1., clamp(al / nl, 0., 1.));
  wash(dn, 1., nd, uPigLeaf);
  lay(max(dn, abs(al - nl * .32) - .42), 0., nd, uPigLeaf); ink(max(abs(abs(al - nl * .32) - .42), dn), .04, 1.);
  vec2 hp = u - N - vec2(.6, .7);
  wash(sdTri(hp, vec2(-.6, .9), vec2(-1., .3), vec2(-1.9, 1.3)), 1., vec2(1., 0.), uPigLeaf);
  wash(sdTri(hp, vec2(1., .35), vec2(1., -.25), vec2(2.3, -.05)), .2, vec2(1., 0.), uPigSun);
  wash(length(hp) - 1.2, 1., vec2(1., 0.), uPigLeaf);
  lay(sdEll(hp - vec2(.4, 0.), vec2(.72, .6)), .55, vec2(1., 0.), uPigDark);
  lay(length(hp - vec2(.45, .15)) - .2, 0., vec2(1., 0.), uPigDark); lay(length(hp - vec2(.5, .15)) - .09, 1., vec2(1., 0.), uPigLine);
}
// a broad wing: w.x from root to tip, slotted at the tip
float wingLobe(vec2 w, float len){
  return max(sdEll(w - vec2(len * .5, 0.), vec2(len * .5, 4.3)), min(.16 - abs(fract(w.y / 1.5) - .5) * 1.5, w.x - len * .7));
}
// the barn owl gliding toward +x with her face turned out of the wall; uCrow banks her up. p from her breast
void owl(vec2 p){
  if (abs(p.x) > 24. || abs(p.y) > 24.) return;
  float up = uCrow, beat = .42 * sin(uTime * 1.3);
  vec2 u = rot(p - vec2(0., 4. * up), -.5 * up);
  vec2 w2 = rot(u - vec2(1., 1.5), -mix(1.2 + beat, .95, up)); float d2 = wingLobe(w2, 16.);
  wash(d2, .2, vec2(0., 1.), uPigDark);
  lay(max(d2 + .15, abs(fract(w2.x / 2.6) - .5) * 2.6 - .45), .55, vec2(0., 1.), uPigDark);
  float tl = sdTri(u, vec2(-4., 0.), vec2(-10., 2.6), vec2(-10.4, -1.8));
  wash(tl, .55, vec2(1., 0.), uPigDark);
  lay(max(tl + .12, abs(fract(u.x / 1.6) - .5) * 1.6 - .3), 1., vec2(0., 1.), uPigDark);
  wash(sdSeg(u, vec2(-3.4, -2.5), vec2(-5.3, -3.3)) - .32, .55, vec2(1., 0.), uPigSun);
  float body = sdEll(u, vec2(5.8, 3.1));
  wash(body, .55, vec2(1., 0.), uPigSun);
  lay(max(body + .3, length(vec2((fract(u.x / 1.4) - .5) * 1.4, (fract(u.y / 1.2 + .5 * floor(u.x / 1.4)) - .5) * 1.2)) - .17), 1., vec2(1., 0.), uPigDark);
  vec2 w1 = rot(u - vec2(.8, 1.2), -mix(1.75 + beat, 2.35, up)); float d1 = wingLobe(w1, 17.);
  wash(d1, .55, vec2(0., 1.), uPigDark);
  lay(max(d1 + .15, abs(fract(w1.x / 2.6) - .5) * 2.6 - .5), 1., vec2(0., 1.), uPigDark);
  lay(max(d1 + .15, w1.y + 1.7), .55, vec2(0., 1.), uPigSun);
  ink(max(abs(w1.y + 1.7), d1 + .15), .04, 1.);
  vec2 hq = u - vec2(5.9, .9); float fd = max(sdEll(hq, vec2(2.15, 2.3)), .75 - length(hq - vec2(0., 2.7)));
  wash(fd, .2, vec2(0., 1.), uPigSun); lay(fd + .4, 0., vec2(0., 1.), uPigSun);
  lay(length(vec2(abs(hq.x) - .78, hq.y - .35)) - .4, 1., vec2(1., 0.), uPigDark);
  wash(sdTri(hq, vec2(-.22, .1), vec2(.22, .1), vec2(0., -.75)), .55, vec2(0., 1.), uPigSun);
}
// the painted sun (a plain disc, no face) or the moon, and the long ray brushed in tile by tile. q from the disc
void orb(vec2 q, float along, float ray){
  if (q.x > 7. || q.x < -37. || abs(q.y + 4.) > 11.5) return;
  float r = length(q); vec2 dir = vec2(-.970, -.243);
  float al = dot(q, dir), ac = dot(q, vec2(-dir.y, dir.x));
  float band = max(abs(ac) - .7 - al * .07, max(5.2 - al, al - 34.6)) + step(5.2 + 29.4 * ray, along) * 1e3;
  if (uLook < .5) {      // only the sun has a ray: the moon keeps her glow to herself
    lay(band, .2, dir, uPigSun); lay(max(band + .1, abs(ac) - .13), .55, dir, uPigSun);
    float pr = mod(ang2(q) + .2618, .5236) - .2618;
    wash(max(r * abs(pr) - .62 * (1. - (r - 3.7) / 2.7), 3.7 - r), .55, q / max(r, 1e-3), uPigSun);
    wash(r - 3.1, .55, vec2(1., 0.), uPigSun); lay(r - 2.3, .2, vec2(1., 0.), uPigSun);
  } else {
    wash(r - 3.2, .2, vec2(1., 0.), uPigSun);
    lay(max(r - 3.1, 2.75 - length(q - vec2(1.3, .6))), .55, vec2(1., 0.), uPigDark);
  }
}
// a dado hen and her two chicks. p from her feet; run 0..1 makes them hop
void hen(vec2 p, float face, float run){
  vec2 q = vec2(p.x * face, p.y - .25 * run * abs(sin(uTime * 13.)));
  if (abs(q.x) > 4.2 || q.y > 3.4) return;
  float hop = .2 * abs(sin(uTime * 7. + q.x)) * (.3 + run);
  wash(min(min(length(q - vec2(-2.3, .38 + hop)) - .36, length(q - vec2(-1.98, .74 + hop)) - .22), min(length(q - vec2(-3.4, .38)) - .34, length(q - vec2(-3.1, .72)) - .21)), .55, vec2(1., 0.), uPigSun);
  wash(sdTri(q, vec2(-.7, 1.3), vec2(-1.75, 2.35), vec2(-1.1, .9)), .55, vec2(1., 1.), uPigDark);
  ink(max(abs(abs(q.x) - .25), abs(q.y - .25) - .28), .04, 1.);
  wash(sdEll(rot(q - vec2(0., 1.15), -.15), vec2(1.15, .78)), 1., vec2(1., 0.), uPigDark);
  lay(sdEll(q - vec2(-.15, 1.2), vec2(.6, .36)), .55, vec2(1., 0.), uPigSun);
  wash(sdTri(q, vec2(1.3, 2.15), vec2(1.3, 1.9), vec2(1.75, 2.)), .55, vec2(1., 0.), uPigSun);
  wash(min(length(q - vec2(.95, 2.05)) - .4, length(q - vec2(.9, 2.5)) - .2), 1., vec2(1., 0.), uPigDark);
}
// the dado: a running vine, a bead row, and a hen with chicks every 14 m who scatter from the great bird
void dado(vec2 p, float dxBird){
  float y = p.y;
  lay(y - .75, .55, vec2(1., 0.), uPigLeaf); ink(y - .75, .06, 1.);
  float sv = 2.45 + .6 * sin(p.x * 1.0472), mv = .628 * cos(p.x * 1.0472);
  float j = floor(p.x / 3.), xj = (j + .5) * 3., sd = mod(j, 2.) * 2. - 1.;
  leaf(rot(vec2(p.x - xj, (y - 2.45 - .6 * sin(xj * 1.0472)) * sd - .55), -.7), vec2(.78, .34), 1.);
  wash(abs(y - sv) / sqrt(1. + mv * mv) - .11, .55, vec2(1., mv), uPigDark);
  wash(length(vec2((fract(p.x / 6. + .25) - .5) * 6., y - 3.45)) - .3, .55, vec2(1., 0.), uPigSun);
  ink(y - 4.02, .07, 1.); ink(y - 4.36, .045, 1.);
  lay(max(abs(y - 4.19) - .09, abs(fract(p.x / .75) - .5) * .75 - .2), .55, vec2(1., 0.), uPigSun);
  float n = floor(p.x / 14.), xc = (n + .5) * 14., dh = dxBird - (p.x - xc), amt = exp(-dh * dh / 260.), sg = dh < 0. ? -1. : 1.;
  hen(vec2(p.x - xc - 2.5 * amt * sg, y - .75), amt > .08 ? sg : (h11(n + 2.) < .5 ? -1. : 1.), amt);
}
// pigment density at a frieze point (its absorbance is left in gA); w = pixel footprint in metres
float MURAL(vec2 p, float w){
  gD = 0.; gGlow = 0.; gA = vec3(1.1, 1., .85); gDir = vec2(1., 0.); gW = max(w, .015); gPool = 1. - smoothstep(.04, .14, w);
  float bx = p.x < 1440. ? uBird.x : (p.x < 2880. ? uBird.y : -1e5);
  vec2 pm = vec2(mod(p.x, ${Xe.toFixed(1)}), p.y);
  if (p.y < 4.5) dado(pm, p.x - bx);
  else if (p.y > 40.5) {
    ink(p.y - 40.62, .07, 1.); lay(abs(p.y - 41.3) - .42, .55, vec2(1., 0.), uPigLeaf);
    lay(abs(fract(p.x / 1.5) - .5) * 1.5 + abs(p.y - 41.3) - .34, .55, vec2(1., 0.), uPigSun);
  } else {
    tree(pm);
    if (uLook > 1.5) petals(pm);
    bees(pm); songbirds(pm);
    sprig(vec2(p.x - (p.x > 2880. ? uSprig.x : uSprig.y), p.y));
    if (uLook < 1.5) {
      float ox = p.x < 1440. ? uOrb.x : (p.x < 2880. ? uOrb.y : -1e5); vec2 cc = (floor(p / .75) + .5) * .75;
      orb(vec2(p.x - ox, p.y - 33.2), dot(vec2(cc.x - ox, cc.y - 33.2), vec2(-.970, -.243)), p.x < 1440. ? uRay : 1.);
    }
    mound(pm);
    vec2 q = vec2(p.x - bx, p.y - 6.1);
    if (uLook < .5) cockerel(q); else if (uLook < 1.5) { gW /= 1.15; owl(vec2(q.x, q.y - 14.) / 1.15); gW *= 1.15; } else { pheasant(q + vec2(23., 0.), .37); pheasant(q, 0.); }
    ink(p.y - 4.62, .06, 1.);
  }
  // the hand: brush hairs along the stroke, dry-brush breaks where the wash thins
  float hf = 1. - smoothstep(.03, .07, w);
  vec2 dir = gDir / max(length(gDir), 1e-4), q = vec2(dot(p, dir) / 1.08, dot(p, vec2(-dir.y, dir.x)) / .09);
  float n = vnoise(q), n2 = vnoise(q * vec2(.6, .11) + 40.);
  gD *= mix(1., .7 + .6 * n, hf);
  gD *= 1. - .6 * hf * smoothstep(.62, .85, n2) * (1. - smoothstep(.2, .5, gD));
  return gD;
}
`,ze=`
uniform vec4 uFires[12]; uniform float uFireR[12], uLamp; uniform vec3 uFireCol;
vec3 fireAt(vec3 P, vec3 Nw){
  float s = 0.;
  for (int i = 0; i < 12; i++) { vec3 a = uFires[i].xyz - P; float d = dot(a, a), f = uFireR[i] / (d + uFireR[i]);
    s += uFires[i].w * clamp(dot(Nw, a) * inversesqrt(max(d, 1e-4)) * .7 + .3, 0., 1.) * f * (.12 + .88 * f); }
  return uFireCol * s;
}
// the fires mirrored in a glossy surface: a soft warm highlight under each one
vec3 fireSpec(vec3 P, vec3 R){
  float s = 0.;
  for (int i = 0; i < 12; i++) { vec3 a = uFires[i].xyz - P; float d = dot(a, a), k = max(dot(R, a) * inversesqrt(max(d, 1e-4)), 0.), f = 2. * uFireR[i] / (d + 2. * uFireR[i]);
    k *= k; k *= k; k *= k; k *= k; s += uFires[i].w * k * (.3 + .7 * k) * f * (.2 + .8 * f); }
  return uFireCol * s * 1.6;
}
vec3 lampAt(vec3 P){
  float dE = P.z > -330. ? 32.5 - P.x : 1e3, dS = P.x > 32.5 ? -330. - P.z : 1e3;
  float dw = max(min(min(dE, P.x + 32.5), min(P.z + 395., dS)), 0.);
  return uFireCol * uLamp * exp(-dw / 9.) * smoothstep(.4, 3., dw) * (1. - smoothstep(3., 24., P.y)) * (.8 + .2 * sin(P.x * .21 + P.z * .19));
}
`,re=`
uniform vec3 uGoldCol;
float goldAt(vec3 P, vec3 Nw, out float fall){
  vec3 a = vec3(34., 9., -362.), ab = vec3(144., -6., 0.);            // the lit axis: from the crossing to the middle of the door pool
  float h = clamp(dot(P - a, ab) / dot(ab, ab), 0., 1.);
  vec3 k = a + ab * h - P; float d = max(length(k), 1e-3);
  fall = exp(-max(d - 30., 0.) / 45.) * mix(1., .34, smoothstep(.03, .3, h)) * (1. - .75 * smoothstep(24., 50., P.y));
  return fall * (.58 + .42 * dot(Nw, k) / d);
}
vec3 keyLight(vec3 amb, vec3 P, vec3 Nw, float ld, float inside){
  float fall, g = goldAt(P, Nw, fall) * uKey.y * inside;
  float tk = max((uDoor.w - P.z) / max(uSun.z, 1e-4), 0.), ek = 5. + tk * .12; vec3 hk = P + uSun * tk;
  float halo = step(P.z, uDoor.w) * smoothstep(uDoor.x - ek, uDoor.x + ek, hk.x) * (1. - smoothstep(uDoor.y - ek, uDoor.y + ek, hk.x)) * (1. - smoothstep(uDoor.z - ek, uDoor.z + ek, hk.y));
  float on = min(uKey.x, 1.), pool = on * inside * ld * clamp(.8 + .5 * dot(Nw, uSun), 0., 1.);
  float k = clamp(g + on * inside * halo * .3 + pool, 0., 1.);
  return mix(amb, uGoldCol * (1. + .25 * pool), k);
}
`,Se=`
float poolDoor(vec3 P){
  float t = (uDoor.w - P.z) / max(uSun.z, 1e-4);
  if (t < 0.) return 0.;
  vec3 h = P + uSun * t; float e = .3 + t * .02;
  return smoothstep(uDoor.x - e, uDoor.x + e, h.x) * (1. - smoothstep(uDoor.y - e, uDoor.y + e, h.x)) * (1. - smoothstep(uDoor.z - e, uDoor.z + e, h.y)) * step(0., h.y);
}
float poolChim(vec3 P){
  return (.72 + .28 * vnoise(P.xz * .22 + uTime * vec2(.35, .5))) * max(1. - smoothstep(6., 10.5, length(P.xz - uChim.xy)), 1. - smoothstep(6., 10.5, length(P.xz - uChim.zw)));
}
// what the glaze mirrors: the door, the chimney sky discs and cones, the pools on the floor, the fires.
// Every hit has a wide soft edge (so a tile's pillow breaks it across the tile, never a whole lit square), keeps the
// colour of its source, is capped below white and thins with distance from the eye (fd).
vec3 envGloss(vec3 P, vec3 R, float fd){
  vec3 g = fireSpec(P, R);
  vec3 pd = uPortalL.xyz - P; float pl = dot(pd, pd), ps = max(dot(R, pd) * inversesqrt(max(pl, 1e-4)), 0.);
  ps *= ps; ps *= ps; ps *= ps; ps *= ps; ps *= ps;                  // the portal's glow runs down the floor toward the eye
  g += uPortalCol * uPortalL.w * ps * 5000. / (pl + 5000.);
  if (R.z > .02) { float t = (uDoor.w - P.z) / R.z;
    if (t > 0.) { vec3 h = P + R * t; float e = 2.6 + .09 * t;      // a wide soft edge: the door lies across the wall as one sheen, never as lit squares
      g += uDoorCol * (.1 + .36 * step(.01, uSunCol.r)) * smoothstep(uDoor.x - e, uDoor.x + e, h.x) * (1. - smoothstep(uDoor.y - e, uDoor.y + e, h.x)) * (1. - smoothstep(uDoor.z - e, uDoor.z + e, h.y)) * smoothstep(-e, e, h.y) * (.6 + .4 * vnoise(vec2(h.x * .3 + uTime * .5, h.y * .3 - uTime * .25))); } }
  if (R.y > .02) {
    vec3 h = P + R * ((95. - P.y) / R.y), h2 = P + R * ((55. - P.y) / R.y);
    float d1 = min(length(h.xz - uChim.xy), length(h.xz - uChim.zw)), d2 = min(length(h2.xz - uChim.xy), length(h2.xz - uChim.zw));
    float open = 1. - smoothstep(11., 17., d2), disc = 1. - smoothstep(4., 9., d1);
    g += open * uSky * vec3(1., .93, .8) * (.62 * disc * (.6 + .4 * vnoise(h.xz * .45 + uTime * vec2(.5, .8))) + .26 * (1. - disc));
  }
  if (R.y < -.02) { vec3 h = P + R * (-P.y / R.y); g += (uSunCol * .55 * uKey.z + uGoldCol * .9 * min(uKey.x, 1.)) * poolDoor(h) + uSky * .6 * poolChim(h); }
  return min(g, vec3(1.15, .92, .74)) * fd;
}
float craze(vec2 p){          // distance-to-edge of a small Voronoi, 0 at the cracks
  vec2 i = floor(p), f = fract(p); float d1 = 8., d2 = 8.;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 o = vec2(float(x), float(y)); vec2 r = o + vec2(h21(i + o), h21(i + o + 19.7)) - f; float d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d;
  }
  return sqrt(max(d2, 0.)) - sqrt(max(d1, 0.));
}
vec3 lightAt(vec3 P, vec3 Nw, out float ld){
  ld = poolDoor(P); float lc = poolChim(P);
  float reach = min(15. / max(uSun.y, .05), 44.);       // the middle of the door pool
  vec3 dc = P - vec3((uDoor.x + uDoor.y) * .5 - uSun.x * reach, 0., uDoor.w - uSun.z * reach), c1 = P - vec3(uChim.x, 0., uChim.y), c2 = P - vec3(uChim.z, 0., uChim.w);
  float ao = 1. - .3 * (1. - smoothstep(0., 3.5, P.y)) * (1. - abs(Nw.y)) - .34 * smoothstep(6., 56., P.y);
  ao *= 1. - .2 * min(uKey.x, 1.) * smoothstep(26., 50., P.y);                 // first light: the vault a full step darker than the walls
  vec3 amb = uAmb * (.8 + .2 * Nw.y) * ao + uSunCol * uBounce.y * uBounce.x / (dot(dc, dc) + uBounce.x)
    + uSky * .22 * (170. / (dot(c1, c1) + 170.) + 170. / (dot(c2, c2) + 170.)) + fireAt(P, Nw) + lampAt(P)
    + uDoorCol * 150. / (dot(P - vec3((uDoor.x + uDoor.y) * .5, 10., uDoor.w - 4.), P - vec3((uDoor.x + uDoor.y) * .5, 10., uDoor.w - 4.)) + 1500.);
  amb = keyLight(amb, P, Nw, ld, 1.);
  return amb + uSunCol * uKey.z * clamp((dot(Nw, uSun) + .25) / 1.25, 0., 1.) * ld + uSky * clamp(Nw.y, 0., 1.) * lc * 1.5;
}
vec3 mortar(vec2 fz, vec2 lp, float e, float hA, float w){
  vec3 m = uBiscuit * vec3(1.16, 1.13, 1.04) * (.8 + .16 * vnoise(fz * 2.3) + .08 * vnoise(fz * 11.)) * (.95 + .08 * hA);
  m *= .84 + .24 * vnoise(fz * .13 + 7.);                                   // damp patches
  vec2 tb = floor(fz / 3.2), tl = fz - (tb + vec2(h21(tb), h21(tb + 5.) - .4)) * 3.2;   // trowel sweeps fanned across each bay
  m *= 1. - .1 * clamp(.12 / max(w, 1e-4), 0., 1.) * smoothstep(.3, .5, abs(fract(length(tl) / .42) - .5) * 2.);
  float d1 = abs(fract((fz.x + fz.y) / .55) - .5) * .55, d2 = abs(fract((fz.x - fz.y) / .55) - .5) * .55;
  float fade = clamp(.05 / max(w, 1e-4), .15, 1.);
  m *= 1. - .16 * fade * (1. - smoothstep(.012, .022 + w, min(abs(lp.x - lp.y), abs(lp.x + lp.y)) * .70711));   // the print of each tile's scored back
  m *= 1. - .38 * fade * (1. - smoothstep(.012, .014 + w, min(d1, d2)));
  float chalk = (1. - smoothstep(.01, .014 + w, e + .02 * vnoise(fz * 1.7))) * (.35 + .65 * vnoise(fz * 7. + 3.));
  return mix(m, vec3(.8, .78, .74), chalk * .85 * clamp(.09 / max(w, 1e-4), .3, 1.));
}
// full shading of one point of tiled face. band: 0 mural, 1 floor, 2 vault, 3 border, 4 mortar
vec3 SHADE(vec2 fz, float band, vec3 P, vec3 T, vec3 N, vec3 V, float w, float away){
  vec3 Bv = abs(N.y) < .7 ? normalize(vec3(0., 1., 0.) - N * N.y) : cross(N, T);
  float sz = (band > .5 && band < 1.5) ? 1.5 : .75;
  vec2 uvs = (band > .5 && band < 1.5) ? vec2(fz.x + fz.y, fz.y - fz.x) * .70711 : fz;
  vec2 cell = floor(uvs / sz), lp = (fract(uvs / sz) - .5) * sz;
  float hA = h21(cell), hB = h21(cell + 71.3), hC = h21(cell + 13.7);
  float e = sz * .5 - max(abs(lp.x), abs(lp.y));
  float ld; vec3 col;
  if (away > .5 || band > 3.5) {
    vec3 Nm = normalize(N + (T * (vnoise(fz * 9.) - .5) + Bv * (vnoise(fz * 9. + 5.) - .5)) * .25);
    return max(mortar(fz, lp, e, hA, w) * lightAt(P, Nm, ld), vec3(0.));
  }
  vec2 rp = lp + vec2(-lp.y, lp.x) * (hA - .5) * .021 + (vec2(hB, hC) - .5) * .03;      // register error
  float dm = 0.;
  if (band < .5) dm = MURAL((cell + .5) * sz + rp, w);
  else {
    gD = 0.; gGlow = 0.; gA = vec3(1.1, 1., .85); gDir = vec2(1., 0.); gW = max(w, .015); gPool = 1. - smoothstep(.04, .14, w);
    if (band < 1.5) {
      float par = mod(cell.x + cell.y, 2.), b = max(abs(rp.x), abs(rp.y));
      if (par > .5) { lay(b - .66, .2, vec2(.7, .7), uPigLeaf); lay(abs(rp.x) + abs(rp.y) - .5, .55, vec2(.7, .7), uPigLeaf); lay(abs(rp.x) + abs(rp.y) - .26, .55, vec2(1., 0.), uPigSun); ink(b - .66, .03, .8); }
      else { ink(abs(rp.x) + abs(rp.y) - .42, .035, .55); lay(length(rp) - .13, .55, vec2(1., 0.), uPigLeaf); }
    } else if (band < 2.5) {
      float st = min(max(abs(rp.x), abs(rp.y)) - .15, (abs(rp.x) + abs(rp.y)) * .70711 - .15);
      float vf = clamp(.07 / max(w, 1e-4), 0., 1.);       // the fine vault pattern fades to plain white with distance
      lay(abs(length(abs(rp) - .375) - .1) - .014, .55 * vf, vec2(1., 0.), uPigLeaf);
      lay(st + .07, .55 * vf, vec2(.7, .7), uPigSun); lay(length(rp) - .03, 0., vec2(1., 0.), uPigSun);
      vec2 gq = (cell + .5) * sz + rp, ab = vec2(gq.x + gq.y, gq.x - gq.y) / 9.;
      vec2 fa = (fract(ab + .5) - .5) * 6.364, fc = (fract(ab) - .5) * 6.364;
      float rope = min(abs(fa.x), abs(fa.y)), ring = length(fc);
      lay(abs(ring - 1.7) - .2, .2, vec2(1., 0.), uPigLeaf);
      lay(ring - .62, .55, vec2(1., 0.), uPigSun);
      wash(rope - .3, .55, vec2(.7, .7), uPigLeaf);
      lay(max(rope - .3, abs(fract((fa.x + fa.y) / .9) - .5) * .9 - .2), 1., vec2(.7, .7), uPigLeaf);
      float star = min(max(abs(fa.x), abs(fa.y)) - 1.25, (abs(fa.x) + abs(fa.y)) * .70711 - 1.25);
      wash(star, .55, vec2(1., 0.), uPigSun); lay(length(fa) - .5, 1., vec2(1., 0.), uPigDark);
    } else { lay(abs(max(abs(rp.x), abs(rp.y)) - .29) - .035, .55, vec2(1., 0.), uPigLeaf); lay(length(rp) - .06, .55, vec2(1., 0.), uPigSun); }
    float n = vnoise(vec2(rp.x + rp.y, rp.x - rp.y) * vec2(1., 11.) + cell * 3.);
    dm = gD * mix(1., .72 + .56 * n, 1. - smoothstep(.03, .07, w));
  }
  float D = dm * (1. + (hB - .5) * .24 * (1. - .6 * smoothstep(.4, .95, dm))); D *= 1. + .6 * D;
  float near = 1. - smoothstep(.02, .045, w), cz = 1.;
  if (near > 0.) { cz = craze(uvs / .12 + hA * 30.); D += .16 * near * (1. - smoothstep(.0, .07, cz)); }
  float k = (hA - .5) * .06;
  vec3 alb = uTin * vec3(1. + k, 1., 1. - k) * exp(-D * gA);
  float jm = (1. - smoothstep(-max(w, 1e-4), max(w, 1e-4), e - .006)) * clamp(.02 / max(w, 1e-3), 0., 1.);
  alb = mix(alb, vec3(.33, .31, .29), jm);
  // normal: tilt, pillow, bevel; the landing shiver is a band of extra tilt on the north wall
  float fadeT = clamp(sz / max(w, 1e-4) * .5 - .6, 0., 1.);
  float shv = (fz.x > 1440. && fz.x < 2880.) ? uShiver * exp(-(fz.x - uPB.x - uPB.y * (1. - (uU - .63) / .11)) * (fz.x - uPB.x - uPB.y * (1. - (uU - .63) / .11)) / 90.) : 0.;
  float fadeK = clamp(sz / max(w, 1e-4) * .12 - .3, 0., 1.);        // a tile's own tilt only where the tile is many pixels wide: far walls mirror smoothly
  vec2 nxy = (vec2(hC, hA) - .5) * .034 * (1. + .9 * shv * sin(uTime * 23. + hB * 6.283)) * fadeK - lp / sz * (.05 + .025 * shv * sin(uTime * 19. + hB * 6.283)) * fadeT;
  float bev = (1. - smoothstep(.02, .034, e)) * clamp(.03 / max(w, 1e-4), 0., 1.);
  nxy += (abs(lp.x) > abs(lp.y) ? vec2(sign(lp.x), 0.) : vec2(0., sign(lp.y))) * .7 * bev;
  nxy += (vnoise(uvs * 5.) - .5) * .012 * near;
  vec3 Nw = normalize(N + T * nxy.x + Bv * nxy.y);
  vec3 Lt = lightAt(P, Nw, ld);
  col = alb * (Lt + uFireCol * gGlow * .5);      // painted lanterns shed a little painted light
  float gloss = 1. - jm, ndv = clamp(dot(Nw, V), 0., 1.), fr = 1. - ndv; fr = fr * fr * fr * fr * fr;
  vec3 R = reflect(-V, Nw); float dist = length(vCam - P);
  // the room is mirrored off a flatter normal than the one that takes the light, so a pool or a chimney reads as one soft
  // shape lying across many tiles and not as a dash in every tile
  col += envGloss(P, reflect(-V, normalize(N + (T * nxy.x + Bv * nxy.y) * .38)), 1. - .6 * smoothstep(40., 220., dist)) * gloss * (.5 + .5 * fr);
  col += Lt * gloss * (.03 + .5 * fr);           // the sheen takes the colour of the light where it lies: pearl, gold or the vault's dusk
  if (uKey.y > 0.) {                             // first light: the glaze mirrors the gold end of the room as a long soft reflection
    float tw = R.z < -.02 ? (-395. - P.z) / R.z : 90., gf; vec3 hp = P + R * clamp(tw, 0., 150.);
    goldAt(hp, -R, gf);
    col += uGoldCol * uKey.y * gf * step(-1., hp.y) * (1. - smoothstep(34., 46., hp.y)) * gloss * (.03 + .97 * fr) * mix(.25, .85, smoothstep(.5, .9, N.y));
  }
  float sg = max(dot(R, uSun), 0.); sg *= sg; sg *= sg; sg *= sg; sg *= sg; sg *= sg; sg *= sg;
  col += uSunCol * 1.5 * sg * sg * ld * gloss;
  return max(col, vec3(0.));
}
vec3 BISCUIT(vec2 lp, float side, vec3 P, vec3 N, float seed){
  vec3 b = uBiscuit * vec3(.72, .62, .5) * (.8 + .25 * vnoise(lp * 14. + seed * 50.) + .1 * seed);
  float sc = min(abs(lp.x - lp.y), abs(lp.x + lp.y)) * .70711;
  b *= 1. - .3 * (1. - side) * (1. - smoothstep(.012, .03, sc)) - .18 * (1. - side) * smoothstep(.3, .34, max(abs(lp.x), abs(lp.y)));
  float ld; return max(b * lightAt(P, N, ld), vec3(0.));
}
`,ea=`
attribute vec2 aFrieze; attribute vec3 aTan; attribute float aBand;
uniform mat4 uInv;
varying vec2 vFz; varying vec3 vP, vT, vN, vCam; varying float vBand;
#include <fog_pars_vertex>
void main(){
  vFz = aFrieze; vBand = aBand; vP = position; vT = aTan; vN = normal;
  vCam = (uInv * vec4(cameraPosition, 1.)).xyz;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,aa=`
varying vec2 vFz; varying vec3 vP, vT, vN, vCam; varying float vBand;
#include <fog_pars_fragment>
${ee}${ze}${ne}${qe}${re}${Se}
float inP(vec2 c, vec4 p){ return step(0., c.x) * step(c.x, p.y / .75 - .5) * step(0., c.y) * step(c.y, p.w / .75 - .5); }
void main(){
  vec2 fw = fwidth(vFz); float w = max(fw.x, fw.y), away = 0.;
  if (vBand < .5) {
    vec2 cell = floor(vFz / .75);
    vec2 ca = cell - floor(uPA.xz / .75 + .5), cb = cell - floor(uPB.xz / .75 + .5), cc = cell - floor(uPC.xz / .75 + .5), cd = cell - floor(uPD.xz / .75 + .5);
    float ia = inP(ca, uPA), ib = inP(cb, uPB), ic = inP(cc, uPC), id = inP(cd, uPD);
    away = ia * step(tLaunchG(ca), uU) + ib * (1. - step(tLandG(cb), uU)) + ic * step(tLaunchS(cc), uU) + id * (1. - step(tLandS(cd), uU));
    if (uRare > .5 && ia + ib + ic + id < .5 && vFz.y > 4.5) away = step(tPeelR(cell), uU) * (1. - step(tBackR(cell), uU));
  }
  vec3 Vd = vCam - vP; vec3 V = Vd / max(length(Vd), 1e-4);
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)), T = normalize(vT + vec3(1e-5, 0., 0.));
  vec3 col = SHADE(vFz, vBand, vP, T, N, V, w, away);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,ta=`
attribute vec4 aCell;      // column, row, flock (0 great flock, 1 bough flock, 2/3 blizzard), seed
uniform mat4 uInv; uniform vec3 uC1, uC2, uS1, uS2; uniform vec4 uTube, uPost;
varying vec2 vFz, vLp; varying vec3 vP, vT, vN, vCam; varying float vFace, vSeed, vLemon;
#include <fog_pars_vertex>
${ee}
const float OFFE = ${D.toFixed(2)}, OFFN = ${V.toFixed(2)}, OFFW = ${J.toFixed(2)};
vec3 rotAx(vec3 v, vec3 ax, float a){ float c = cos(a), s = sin(a); return v * c + cross(ax, v) * s + ax * dot(ax, v) * (1. - c); }
// loose tiles keep out of a tube round the camera's route and away from the eye
vec3 tubePush(vec3 p, vec3 cam, float wgt, float s){
  vec2 c = vec2(uTube.x + uTube.z, uTube.y); vec3 cp;
  if (p.z > c.y) cp = vec3(uTube.x, uTube.w, p.z);
  else if (p.x > c.x) cp = vec3(p.x, uTube.w, c.y - uTube.z);
  else { vec2 d = p.xz - c; float l = max(length(d), 1e-3); cp = vec3(c.x + d.x / l * uTube.z, uTube.w, c.y + d.y / l * uTube.z); }
  vec3 dv = p - cp + vec3(.02 * (s - .5), .03, 0.); float l = max(length(dv), 1e-3);
  p += dv / l * max(9. - l, 0.) * wgt;
  dv = p - cam + vec3(0., .03, .02 * (s - .5)); l = max(length(dv), 1e-3);
  return p + dv / l * max(6. - l, 0.) * wgt;
}
void main(){
  float col = aCell.x, row = aCell.y, fl = aCell.z, sd = aCell.w;
  float s2 = h11(sd * 7.31 + .2), s3 = h11(sd * 3.17 + .6), s4 = h11(sd * 5.1 + .4);
  float h = 4.5 + (row + .5) * .75, lat = (s2 - .5) * 2.;
  vec3 A, B, P1, P2; float tL, tA, phiA, phiB, sigA, sigB, fzA, fzB, tube = 0., isB = 0., pitch = 0., drift = 2.4; vec2 bp = vec2(0.);
  if (fl < .5) {
    fzA = uPA.x + (col + .5) * .75; fzB = uPB.x + (col + .5) * .75;
    A = vec3(32.47, h, 40. - (fzA - OFFE)); B = vec3(fzB - OFFN - 32.5, h, -394.97);
    bp = vec2((col + .5) * .75 - ${(R-k[0]).toFixed(2)}, h - 6.1);
    isB = birdIn(vec2(col, row));
    // every tile that is not the bird joins one ribbon: up off the wall, round the outside of the corner under the vault
    // and down the north wall, rows laid across it like the scales of a fish, glazed faces down toward the room
    float b = (row + .5) / 25. - 1.;
    P1 = uC1 + vec3(b * 2.5 + lat * 1.5, (s4 - .5) * 5., b * 5.);
    P2 = uC2 + vec3(lat * 2., (s4 - .5) * 5., 5.5 + b * 5.5);
    tL = tLaunchG(vec2(col, row)); tA = tLandG(vec2(col, row)); phiA = -1.5708; phiB = 0.; sigA = -1.; sigB = 1.; tube = 1. - isB; pitch = .8; drift = 1.1;
  } else if (fl < 1.5) {
    fzA = uPC.x + (col + .5) * .75; fzB = uPD.x + (col + .5) * .75;
    A = vec3(-32.47, h, 40. - (fzA - OFFW)); B = vec3(32.47, h, 40. - (fzB - OFFE));
    float a = (col + .5) / 24. - 1., b = (row + .5) / 20. - 1.;
    P1 = uS1 + vec3(a * 4., b * 3.6, lat * 1.6 - a * 3.); P2 = uS2 + vec3(a * 4., b * 3.6, lat * 1.6 - a * 3.);
    tL = tLaunchS(vec2(col, row)); tA = tLandS(vec2(col, row)); phiA = 1.5708; phiB = -1.5708; sigA = 1.; sigB = -1.; pitch = .5; drift = .9;
  } else {
    float xw = (col + .5) * .75;
    if (fl < 2.5) { fzA = OFFW + xw; A = vec3(-32.47, h, 40. - xw); phiA = 1.5708; sigA = 1.; }
    else { fzA = OFFE + xw; A = vec3(32.47, h, 40. - xw); phiA = -1.5708; sigA = -1.; }
    B = A; fzB = fzA; phiB = phiA; sigB = sigA;
    vec2 g = floor(vec2(fzA, h) / .75);
    tL = tPeelR(g); tA = tBackR(g); tube = 1.;
    vec3 mid = mix(vec3(5., 17., -316.), vec3(42., 17., -372.), s4 * .7);
    P1 = mid + vec3(lat * 22., (s3 - .35) * 30., (s4 - .5) * 60. + 30.); P2 = mid + vec3((s3 - .5) * 44., (s2 - .35) * 30., (s4 - .5) * 40.);
  }
  float q = clamp((uU - tL) / max(tA - tL, 1e-3), 0., 1.);
  float e = q * q * (3. - 2. * q), qp = mix(q, e, .7), iq = 1. - qp;
  vec3 pos = A * iq * iq * iq + P1 * 3. * iq * iq * qp + P2 * 3. * iq * qp * qp + B * qp * qp * qp;
  if (fl < .5) {      // the wall's loose tiles first slide up the wall as a sheet (one more control point above each tile's own place), then cross under the vault
    vec3 P0 = vec3(A.x - 6. - 3. * s2, 47. + (s4 - .5) * 4., A.z - 14. - 8. * s3);
    pos = A * iq * iq * iq * iq + P0 * 4. * iq * iq * iq * qp + P1 * 6. * iq * iq * qp * qp + P2 * 4. * iq * qp * qp * qp + B * qp * qp * qp * qp;
  }
  float env = sin(q * 3.14159265); env *= env;
  pos += env * smoothstep(.04, .45, q) * drift * vec3(sin(sd * 40. + q * 9. + uTime * .6), sin(sd * 63. + q * 7.3 + uTime * .5), sin(sd * 91. + q * 8.1 + uTime * .7));
  vec3 cam = (uInv * vec4(cameraPosition, 1.)).xyz;
  float fF = 0., th = 0.;
  if (isB > .5) {
    // the great bird flies as one picture: his tiles keep their places in a sheet that turns to face the eye. To face the
    // way he flies he folds like a pair of wings (every tile swings toward the room about his middle) and opens mirrored.
    vec3 rF = vec3(cos(uFP.w), 0., -sin(uFP.w)), nF = vec3(sin(uFP.w), 0., cos(uFP.w));
    vec2 d = vec2(bp.x - uFQ.w, bp.y) * uFQ.y;
    float t0 = uFQ.x + .012 * clamp(.5 - d.x / 40., 0., 1.);
    th = 3.14159265 * smoothstep(t0, t0 + .034, uU);
    float wv = sin(uTime * 1.5 + bp.x * .21 + bp.y * .33) + .5 * sin(uTime * 2.3 - bp.x * .37 + sd * 6.);
    vec3 f = uFP.xyz - rF * (d.x * cos(th)) + nF * (abs(d.x) * sin(th) + uFQ.z * wv + (s4 - .5) * .25) + vec3(0., d.y, 0.);
    float k1 = clamp((uU - tL) / .03, 0., 1.); k1 = k1 * k1 * (3. - 2. * k1);
    float k2 = clamp((uU - (tA - .018)) / .016, 0., 1.); k2 = k2 * k2 * (3. - 2. * k2);
    pos = mix(mix(A, f, k1), B + vec3(0., 0., .7 * sin(3.14159265 * k2)), k2); fF = k1 * (1. - k2);
  }
  if (tube > .5) pos = tubePush(pos, cam, smoothstep(0., .15, q) * (1. - smoothstep(.88, 1., q)), s3);
  { vec2 pd = pos.xz - uPost.xy + vec2(.01, .013); float pl = max(length(pd), 1e-3);       // round the masons' tower, not through it
    pos.xz += pd / pl * max(uPost.z - pl, 0.) * (1. - smoothstep(uPost.w, uPost.w + 4., pos.y)) * smoothstep(0., .1, q) * (1. - smoothstep(.9, 1., q)) * (1. - isB); }
  float tau = max(uU - tA, 0.) * uDur, hit = step(tA, uU) * exp(-tau * 4.5);
  float fc = .36 + .5 * s4, wEnv = (.3 + .7 * smoothstep(.15, .5, q)) * smoothstep(0., .07, q) * (1. - smoothstep(.9, 1., q));
  // only the blizzard tumbles: the flocks keep their glazed faces to the room, each tile rocking a little so the light runs over them
  float turn = fl > 1.5 ? step(s3, .7) : 0., rock = fl > 1.5 ? 1. : (isB > .5 ? .16 : .42);
  float ang = 6.2832 * turn * smoothstep(fc - .08, fc + .08, q) + .1 * hit * sin(tau * 17.)
    + wEnv * rock * (.55 * sin(sd * 50. + q * 16. + uTime * 1.3) + .3 * sin(sd * 23. + uTime * 2.1));
  vec3 ax = normalize(vec3(cos(sd * 6.2832), sin(sd * 6.2832), (s2 - .5) * .7));
  bool first = isB > .5 ? th < 1.5708 : q < .5;      // which wall's picture the tile shows
  float phi = mix(mix(phiA, phiB, e), uFP.w, fF), sig = first ? sigA : sigB;
  vec3 r = vec3(cos(phi), 0., -sin(phi)), n = vec3(sin(phi), 0., cos(phi));
  // lift-off: each tile hinges on its top edge like a scale before it lets go; in the ribbon it lies tipped face down
  float hg = -.95 * sin(3.14159265 * clamp(q / .09, 0., 1.)) * (.6 + .4 * s2) * (1. - isB)
    + pitch * (1. - isB) * smoothstep(.1, .3, q) * (1. - smoothstep(.7, .96, q)), ch = cos(hg), sh = sin(hg);
  float vis = step(tL - .0005, uU) * (1. - step(tA + .03, uU));      // at rest the wall paints the tile: the loose one is put away
  vec3 p0 = position * vis - vec3(0., .375, 0.), n0 = normal;
  p0 = vec3(p0.x, p0.y * ch - p0.z * sh, p0.y * sh + p0.z * ch) + vec3(0., .375, 0.);
  n0 = vec3(n0.x, n0.y * ch - n0.z * sh, n0.y * sh + n0.z * ch);
  vec3 v = rotAx(p0, ax, ang), nl = rotAx(n0, ax, ang), tl = rotAx(vec3(1., 0., 0.), ax, ang);
  pos += r * v.x + vec3(0., v.y, 0.) + n * v.z + n * (.15 * hit * abs(sin(tau * 13.)));
  vP = pos; vN = r * nl.x + vec3(0., nl.y, 0.) + n * nl.z; vT = (r * tl.x + vec3(0., tl.y, 0.) + n * tl.z) * sig;
  vFz = vec2((first ? fzA : fzB) + sig * position.x * .997, h + position.y * .997);
  vLp = position.xy; vFace = normal.z; vSeed = sd; vCam = cam;
  vLemon = (fl > .5 && fl < 1.5) ? step(.38, s4) * smoothstep(.02, .14, q) * (1. - smoothstep(.86, .98, q)) : 0.;   // the bough flock: lemon-glazed tiles in flight
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,oa=`
varying vec2 vFz, vLp; varying vec3 vP, vT, vN, vCam; varying float vFace, vSeed, vLemon;
#include <fog_pars_fragment>
${ee}${ze}${ne}${qe}${re}${Se}
void main(){
  vec2 fw = fwidth(vFz); float w = max(fw.x, fw.y);
  vec3 Vd = vCam - vP; vec3 V = Vd / max(length(Vd), 1e-4);
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)), T = normalize(vT + vec3(1e-5, 0., 0.));
  if (dot(N, V) < 0. && vFace < .5) N = -N;
  vec3 col;
  if (vFace > .5) col = SHADE(vFz, 0., vP, T, N, V, min(w, .2), 0.);
  else col = BISCUIT(vLp, step(-.5, vFace), vP, N, vSeed);
  col *= mix(vec3(1.), vec3(1.5, 1.12, .2), vLemon);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`;function H(t,o){const{o:u,along:v,up:p,len:y,height:b,fz0:h,normal:x,band:_}=o,q=Math.max(1,Math.ceil(y/32)),m=v[1]*p[2]-v[2]*p[1],n=v[2]*p[0]-v[0]*p[2],ue=v[0]*p[1]-v[1]*p[0],te=m*x[0]+n*x[1]+ue*x[2]<0;for(let L=0;L<q;L++){const I=y*L/q,z=y*(L+1)/q,C=o.y0a!==void 0?o.y0a+(o.y0b-o.y0a)*(L/q):0,E=o.y0a!==void 0?o.y0a+(o.y0b-o.y0a)*((L+1)/q):0,S=[[I,C],[z,E],[z,b],[I,b]],oe=te?[0,2,1,0,3,2]:[0,1,2,0,2,3];for(const O of oe){const[A,M]=S[O];t.pos.push(u[0]+v[0]*A+p[0]*M,u[1]+v[1]*A+p[1]*M,u[2]+v[2]*A+p[2]*M),t.nor.push(x[0],x[1],x[2]),t.tan.push(v[0],v[1],v[2]),t.fz.push(h[0]+A,h[1]+M),t.band.push(_)}}}function Ge(t){const o=new l.BufferGeometry;return o.setAttribute("position",new l.Float32BufferAttribute(t.pos,3)),o.setAttribute("normal",new l.Float32BufferAttribute(t.nor,3)),o.setAttribute("aTan",new l.Float32BufferAttribute(t.tan,3)),o.setAttribute("aFrieze",new l.Float32BufferAttribute(t.fz,2)),o.setAttribute("aBand",new l.Float32BufferAttribute(t.band,1)),o.computeBoundingSphere(),o}const Ve=()=>({pos:[],nor:[],tan:[],fz:[],band:[]});function la(){const t=G/2,o=t-.03,u=-.09,v=[],p=[],y=(h,x,_,q,m)=>{for(const n of[h,x,_,h,_,q])v.push(n[0],n[1],n[2]),p.push(m[0],m[1],m[2])};y([-t,-t,0],[t,-t,0],[t,t,0],[-t,t,0],[0,0,1]),y([o,-o,u],[-o,-o,u],[-o,o,u],[o,o,u],[0,0,-1]),y([t,-t,0],[o,-o,u],[o,o,u],[t,t,0],[1,0,0]),y([-t,t,0],[-o,o,u],[-o,-o,u],[-t,-t,0],[-1,0,0]),y([t,t,0],[o,o,u],[-o,o,u],[-t,t,0],[0,1,0]),y([-t,-t,0],[-o,-o,u],[o,-o,u],[t,-t,0],[0,-1,0]);const b=new l.BufferGeometry;return b.setAttribute("position",new l.Float32BufferAttribute(v,3)),b.setAttribute("normal",new l.Float32BufferAttribute(p,3)),b}const _e={cockerel:{id:0,pig:[[2.6,1.75,.57],[2.6,1,1.5],[.03,.5,3.6],[1.3,2.1,1.5]],sun:[.62,.24,.74],sunCol:[1.25,.74,.25],amb:[.255,.268,.3],sky:[.6,.78,1.08],door:[3,1.5,.45],bounce:[5e3,0],key:[1,1,0],gold:[1,.4,.08]},owl:{id:1,pig:[[1.7,2.6,1.9],[1,1.65,1.2],[.03,.5,3.6],[1.3,2.1,1.5]],sun:[.62,.24,.74],sunCol:[0,0,0],amb:[.14,.175,.33],sky:[.1,.17,.42],door:[.5,.8,1.9],bounce:[9e3,0],key:[0,0,1],lamp:.06},pheasant:{id:2,pig:[[1.7,2.6,1.9],[2.6,1,1.5],[.75,1.5,1],[1.3,2.1,1.5]],sun:[.15,.8,.58],sunCol:[2,1.9,1.77],amb:[.72,.75,.78],sky:[.7,.9,1.3],door:[3.4,3.3,3.1],bounce:[300,.075],key:[0,0,1]}},ae=82,sa=[[0,ae],[.02,ae],[.09,112],[.12,133],[.17,146],[.37,R],[1,R]];function ca(t,o){if(o<=t[0][0])return t[0][1];for(let u=1;u<t.length;u++)if(o<=t[u][0]){const v=t[u-1],p=t[u];return v[1]+(p[1]-v[1])*(o-v[0])/Math.max(p[0]-v[0],1e-6)}return t[t.length-1][1]}const Ae=t=>{let o=0;for(let u=-3;u<=3;u++)o+=ca(sa,Math.min(Math.max(t+u*.008,0),.47));return o/7},Fe=t=>{const o=Math.min(Math.max((t-.754)/.151,0),1);return Z+86*(1-Math.pow(1-o,1.6))},ia=t=>.05+(t<.6?Ae(t)-ae:R-ae+Fe(t)-Z)/Me;async function ua(t,o={}){const u=t.rng.fork?t.rng.fork("cockerel-hero"):t.rng,v=(o.palette&&o.palette.length>=7?o.palette:Ze).map(e=>new l.Color(e)),p=t.vary||{},y=t.quality&&t.quality.detail||1;let b=o.look;if(!_e[b]){const e=u.pick(["cockerel","cockerel","owl","pheasant","owl","pheasant"]);b=p.hour==="night"?"owl":p.hour==="day"?"pheasant":p.hour==="dawn"||p.hour==="golden"?"cockerel":e}const h=_e[b],x=o.rare!==void 0?!!o.rare:!!p.rare,_=new l.Vector3().fromArray(o.sun||h.sun).normalize(),q=o.second==="finches"?1:o.second==="lemons"||u()<.5?0:1,m=e=>({value:new l.Vector3().fromArray(e)}),n=l.UniformsUtils.merge([l.UniformsLib.fog,{uTime:{value:0},uU:{value:0},uWake:{value:1},uLook:{value:h.id},uSeed:{value:Math.floor(u.range(0,40))+u()},uRare:{value:x?1:0},uDur:{value:40},uShiver:{value:0},uGait:{value:.05},uCrow:{value:0},uFlare:{value:.45},uCall:{value:0},uRay:{value:0},uGrow:{value:1},uSecond:{value:q},uShake:{value:0},uBird:{value:new l.Vector2(D+ae,V+Z)},uOrb:{value:new l.Vector2(D+R+27,V+Z+27)},uSprig:{value:new l.Vector2(J+F[0]+F[1]/2,D+B[0]+B[1]/2)},uSun:{value:_},uSunCol:m(h.sunCol),uAmb:m(h.amb),uSky:m(h.sky),uDoorCol:m(h.door),uFireCol:m([3.2,1.5,.45]),uFires:{value:Array.from({length:12},()=>new l.Vector4(0,9,-158,0))},uFireR:{value:Array.from({length:12},()=>500)},uLamp:{value:h.lamp||0},uPortalL:{value:new l.Vector4(281,12,-362.5,0)},uPortalCol:m([1,.8,.45]),uBounce:{value:new l.Vector2(h.bounce[0],h.bounce[1])},uKey:m(h.key||[0,0,1]),uGoldCol:m(h.gold||[0,0,0]),uTin:{value:new l.Vector3(v[0].r,v[0].g,v[0].b).multiplyScalar(.84)},uPigLine:m(h.pig[0]),uPigLeaf:m(h.pig[1]),uPigSun:m(h.pig[2]),uPigDark:m(h.pig[3]),uBiscuit:{value:new l.Vector3(v[6].r,v[6].g,v[6].b)},uDoor:{value:new l.Vector4(196,216,30,-330)},uChim:{value:new l.Vector4(0,-175,120,-362.5)},uPA:{value:new l.Vector4(D+k[0],k[1],k[2],k[3])},uPB:{value:new l.Vector4(V+j[0],j[1],j[2],j[3])},uPC:{value:new l.Vector4(J+F[0],F[1],F[2],F[3])},uPD:{value:new l.Vector4(D+B[0],B[1],B[2],B[3])},uInv:{value:new l.Matrix4},uC1:{value:new l.Vector3(-40,44,-350)},uC2:{value:new l.Vector3(-30,36,-392)},uTube:{value:new l.Vector4(-10,-292.5,70,14)},uPost:{value:new l.Vector4(0,0,0,0)},uS1:{value:new l.Vector3(-10,34,-128)},uS2:{value:new l.Vector3(14,34,-160)},uFP:{value:new l.Vector4(32.47,6.1,40-R,-Math.PI/2)},uFQ:{value:new l.Vector4(.462,1,0,0)}}]),ue=["fogColor","fogDensity","fogNear","fogFar"],te=()=>{const e={};for(const a in n)e[a]=ue.includes(a)?{value:n[a].value.clone?n[a].value.clone():n[a].value}:n[a];return e},L=[],I=(e={})=>{const a=new l.ShaderMaterial({uniforms:te(),vertexShader:ea,fragmentShader:aa,fog:!0,side:e.side!==void 0?e.side:l.FrontSide});return L.push(a),a},z=new l.Group;z.name="cockerel-wall-hero";const C=Ve(),E=[0,1,0],S=(e,a,s,i,r,f={})=>H(C,{o:e,along:a,up:E,len:s,height:ke,fz0:[i,0],normal:r,band:0,...f});S([32.5,0,40],[0,0,-1],370,D,[-1,0,0]),S([-32.5,0,40],[0,0,-1],435,J,[1,0,0]),S([-32.5,0,-395],[1,0,0],315,V,[0,0,1]),S([-32.5,0,40],[1,0,0],65,Ne,[0,0,-1]),S([32.5,0,-330],[1,0,0],163.5,ce,[0,0,-1]),H(C,{o:[196,0,-330],along:[1,0,0],up:E,len:20,height:ke,fz0:[ce+163.5,0],normal:[0,0,-1],band:0,y0a:30,y0b:30}),S([216,0,-330],[1,0,0],66.5,ce+183.5,[0,0,-1]),S([282.5,0,-330],[0,0,-1],19.5,ie,[-1,0,0]),S([282.5,0,-375.5],[0,0,-1],19.5,ie+45.5,[-1,0,0]);const oe=e=>11+Math.sqrt(Math.max(169-(e-13)*(e-13),0));for(let e=0;e<13;e++)H(C,{o:[282.5,0,-349.5-e*2],along:[0,0,-1],up:E,len:2,height:ke,fz0:[ie+19.5+e*2,0],normal:[-1,0,0],band:0,y0a:oe(e*2),y0b:oe(e*2+2)});o.floor!==!1&&(H(C,{o:[-32.5,0,40],along:[1,0,0],up:[0,0,-1],len:65,height:435,fz0:[-32.5,-40],normal:E,band:1}),H(C,{o:[32.5,0,-330],along:[1,0,0],up:[0,0,-1],len:250,height:65,fz0:[32.5,330],normal:E,band:1}));const O=new l.Mesh(Ge(C),I());O.name="mural-walls",O.frustumCulled=!1,z.add(O),await t.yield?.();const A=k[1]/G*(k[3]/G),M=F[1]/G,Le=F[3]/G,K=M*Le,le=x?Math.round(2400*Math.min(1,y)):0,Ue=A+K+le,g=new Float32Array(Ue*4);let w=0;const De=new Float32Array(A);for(let e=0;e<A;e++)De[e]=u();for(let e=0;e<Le;e++)for(let a=0;a<M;a++)g[w++]=a,g[w++]=e,g[w++]=1,g[w++]=u();{let e=0;for(let a=0;a<k[3]/G;a++)for(let s=0;s<k[1]/G;s++)g[w++]=s,g[w++]=a,g[w++]=0,g[w++]=De[e++]}for(let e=0;e<le;e++){const a=u()<.55;g[w++]=a?u.int(322,572):u.int(134,326),g[w++]=u.int(0,49),g[w++]=a?2:3,g[w++]=u()}const $=la(),T=new l.InstancedBufferGeometry;T.setAttribute("position",$.getAttribute("position")),T.setAttribute("normal",$.getAttribute("normal")),T.setAttribute("aCell",new l.InstancedBufferAttribute(g.slice(K*4),4)),T.instanceCount=A+le,T.boundingSphere=new l.Sphere(new l.Vector3(60,20,-250),400);const N=new l.InstancedBufferGeometry;N.setAttribute("position",$.getAttribute("position")),N.setAttribute("normal",$.getAttribute("normal")),N.setAttribute("aCell",new l.InstancedBufferAttribute(g.slice(0,K*4),4)),N.instanceCount=K,N.boundingSphere=T.boundingSphere;const ve=new l.ShaderMaterial({uniforms:te(),vertexShader:ta,fragmentShader:oa,fog:!0,side:l.FrontSide});L.push(ve);const he=new l.Mesh(T,ve);he.name="tile-flocks",he.frustumCulled=!1,z.add(he);const fe=new l.Mesh(N,ve);fe.name="tile-bough-flock",fe.frustumCulled=!1,z.add(fe),await t.yield?.();let Ce=-1,pe=0,de=null;const c=(e,a,s)=>new l.Vector3(e,a,s),Te=n.uInv.value,me=c(0,0,0),ge=c(2,15,-302),U=(e,a,s,i,r)=>{const f=1-r;return e*f*f*f+3*a*f*f*r+3*s*f*r*r+i*r*r*r},d=(e,a,s)=>{const i=Math.min(Math.max((s-e)/(a-e),0),1);return i*i*(3-2*i)},We=(e,a=c(0,0,0))=>{const s=Math.min(Math.max((e-.445)/.24,0),1),i=s*s*(3-2*s),r=s+(i-s)*.7,f=n.uC1.value,P=n.uC2.value;return a.set(U(32.5,f.x,P.x,162,r),U(23,f.y,P.y,23,r),U(-288,f.z,P.z,-395,r))},Q=Qe(),je=.088,He=h.id===1?5:14.5,Be=h.id===1?1:.8,Ie=h.id===1?25:15,Oe=.462,xe=h.id===0?-6.5:h.id===1?-4:-14.5;let ye=(e,a)=>{const s=Math.min(Math.max(e,0),1)*(Q.length-1),i=Math.min(Math.floor(s),Q.length-2);return a.copy(Q[i]).lerp(Q[i+1],s-i)};const W=c(32.47,6.1,40-R-xe),we=c(Z-32.5+xe,6.1,-394.97),be=c(0,0,0),Y=c(0,0,0),Re=(e,a,s,i)=>{const r=d(.447,.5,e),f=d(.685,.728,e);ye(e,be),ye(Math.min(e+je,1),Y),Y.y=He+.6*Math.sin(a*.8);const P=W.x+(Y.x-W.x)*r,Ee=W.y+(Y.y-W.y)*r,Pe=W.z+(Y.z-W.z)*r;let X=Math.atan2(be.x-P,be.z-Pe);X>.3&&(X-=Math.PI*2),X=Math.min(Math.max(X,-2.6),-.25)+.05*Math.sin(a*.6);const Ye=(-Math.PI/2+(X+Math.PI/2)*r)*(1-Math.min(1,f*1.12));return s.set(P+(we.x-P)*f,Ee+(we.y-Ee)*f,Pe+(we.z-Pe)*f,Ye),i&&i.set(Oe,1+(Be-1)*r*(1-f),.4*r*(1-f),xe),s},se=new l.Vector4,Ke=(e,a=c(0,0,0))=>{if(a.set(32.5,19,40-Ae(e)-3),e>.44){Re(e,0,se,null);const s=d(.44,.48,e),i=d(.715,.75,e),r=1+(Be-1)*d(.447,.5,e)*(1-d(.685,.728,e));a.set(a.x+(se.x-a.x)*s,19+(se.y+Ie*r-19)*s,a.z+(se.z-a.z)*s),a.set(a.x+(Fe(e)-32.5+3-a.x)*i,a.y+(19-a.y)*i,a.z+(-395-a.z)*i)}return a},$e=(e,a)=>{const s=d(0,.05,e),i=de===null?a:a-de;de=a,pe=i>=0?pe+i*(.35+.65*s):a,n.uTime.value=pe,n.uU.value=e,n.uWake.value=s,n.uBird.value.set(D+Ae(e),V+Fe(e)),n.uGait.value=ia(e);const r=1-d(.745,.762,e);n.uCrow.value=d(.372,.4,e)*r,n.uCall.value=d(.385,.4,e)*r*(e<.43?.75+.25*Math.sin(a*11):1),n.uFlare.value=.45+.55*d(.38,.41,e)*(1-d(.748,.78,e)),n.uRay.value=d(.376,.415,e),n.uShake.value=.07*Math.sin(a*24)*d(.744,.75,e)*(1-d(.756,.775,e)),n.uGrow.value=x?.1+.9*d(.52,.68,e):.45+.55*d(0,.1,e),n.uShiver.value=d(.63,.65,e)*(1-d(.74,.775,e)),Re(e,a,n.uFP.value,n.uFQ.value)};function Qe(){return[c(-6,16,2),c(13,16,-21.5),c(19.5,15,-52),c(10.5,13.2,-91),c(-10,11.6,-142),c(-10,11,-200),c(-10,12.6,-265),c(-10,14,-292.5),c(10.5,14,-342),c(60,14,-362.5),c(120,14,-362.5),c(222.5,14,-362.5),c(282.5,14,-362.5)]}return{object:z,radius:6,height:14,center:ge,ground:!1,groundY:0,look:b,rare:x,tile:{material:I,uniforms:n,quad:e=>{const a=Ve();for(const s of e)H(a,s);return Ge(a)},glsl:{common:ee,mural:ne+qe,key:re,tile:Se},offsets:{E:D,N:V,W:J,S:ce,H:ie,X:Ne,free:Je}},anchors:{entry:{position:c(-6,16,2),heading:c(Math.sin(.733),0,-Math.cos(.733))},flyThrough:Q,portalSeat:{position:c(282.5,14,-362.5),facing:c(-1,0,0)},hearthMouth:{center:c(282.5,12,-362.5),width:26,height:24},door:{x0:196,x1:216,height:30,z:-330},chimneys:[c(0,95,-175),c(120,95,-362.5)],launchPatch:{center:c(32.5,23.25,40-k[0]-42),normal:c(-1,0,0),width:84,height:37.5},landingPatch:{center:c(j[0]+42-32.5,23.25,-395),normal:c(0,0,1),width:84,height:37.5},secondLaunch:{center:c(-32.5,19.5,40-F[0]-18),normal:c(1,0,0),width:36,height:30},secondLanding:{center:c(32.5,19.5,40-B[0]-18),normal:c(-1,0,0),width:36,height:30},viewpoints:{closePass:{position:c(19.5,14.6,-58),target:c(32.5,16,-80)},peel:{position:c(-10,12.6,-262),target:c(32.5,20,-285)},insideFlock:{position:c(0,14,-328),target:c(120,14,-362.5)},landing:{position:c(70,14,-362.5),target:c(138,20,-395)}},bounds:{min:c(-32.5,0,-395),max:c(282.5,42,40)}},figureAt:Ke,flockCentre:We,second:q?"finches":"lemons",setProgress(e){Ce=Math.min(Math.max(e,0),1)},setRoute(e,a,s){e&&n.uC1.value.copy(e),a&&n.uC2.value.copy(a),s&&n.uTube.value.copy(s)},setFlock(e={}){e.s1&&n.uS1.value.copy(e.s1),e.s2&&n.uS2.value.copy(e.s2),e.post&&n.uPost.value.copy(e.post)},setPath(e){typeof e=="function"&&(ye=e)},setFire(e,a,s,i,r,f=500){e>=0&&e<12&&(n.uFires.value[e].set(a,s,i,r),n.uFireR.value[e]=f)},setPortalLight(e,a,s,i,r){n.uPortalL.value.set(e,a,s,i),r&&n.uPortalCol.value.set(r.r,r.g,r.b)},secondCentre(e,a=c(0,0,0)){const s=Math.min(Math.max((e-.128)/.078,0),1),i=s*s*(3-2*s),r=s+(i-s)*.7,f=n.uS1.value,P=n.uS2.value;return a.set(U(-32.5,f.x,P.x,32.5,r),U(19.5,f.y,P.y,19.5,r),U(40-F[0]-18,f.z,P.z,40-B[0]-18,r))},update(e,a,s){z.updateMatrixWorld(),Te.copy(z.matrixWorld).invert();let i=Ce;if(i<0&&(i=.5,s)){me.setFromMatrixPosition(s.matrixWorld).applyMatrix4(Te);let r=Math.atan2(me.x-ge.x,me.z-ge.z);r<-.8&&(r+=Math.PI*2),i=.465+(r+.3)*.026+(a-12)*.004,i=Math.min(Math.max(i,0),1)}$e(i,a),N.instanceCount=i>.1&&i<.27?K:0,T.instanceCount=i>.41&&i<.8?A+(i>.495&&i<.76?le:0):0},dispose(){$.dispose()}}}export{ee as GLSL_COMMON,ze as GLSL_FIRE,re as GLSL_KEY,ne as GLSL_MURAL,ua as buildHero};
