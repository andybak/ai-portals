import*as a from"three";import{makePath as yn}from"../kit/core.js";import{buildHero as ba}from"../parts/hoopwind-flats.js";const oe=Math.PI*2,E=Math.PI/180,Ge=h=>Math.min(1,Math.max(0,h)),O=(h,v,R)=>{const N=Ge((R-h)/(v-h));return N*N*(3-2*N)},b=(h,v,R)=>h+(v-h)*R,re=`
const float PI = 3.14159265;
uniform vec3 uSunDir, uSunCol, uSkyCol;
uniform vec3 uFogA, uFogB;          // haze colour downwind (lilac) and sunward (peach)
uniform float uFogK, uTime;
vec3 nrm(vec3 v){ return v / max(length(v), 1e-5); }
float hash21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
vec2 hash22(vec2 p){ float n = hash21(p); return vec2(n, hash21(p + n + 19.19)); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash21(i), hash21(i + vec2(1., 0.)), f.x), mix(hash21(i + vec2(0., 1.)), hash21(i + vec2(1., 1.)), f.x), f.y);
}
float fbm(vec2 p){ return vnoise(p) * .5 + vnoise(p * 2.03 + 7.1) * .3 + vnoise(p * 4.1 + 3.7) * .2; }
// haze: colour depends on whether we look sunward; amount is exp2 in distance
vec3 hazeCol(vec3 viewDir){
  vec2 s = uSunDir.xz / max(length(uSunDir.xz), 1e-4);
  vec2 v = viewDir.xz / max(length(viewDir.xz), 1e-4);
  float k = max(dot(v, s), 0.);
  return mix(uFogA, uFogB, k * k);
}
float hazeAmt(float d){ float x = d * uFogK; return 1. - exp(-x * x); }
// the sun as salt in the air takes it: by its height, as the pan does (equal to uSunCol at the default hour's 16 degrees)
vec3 sunLow(){ return uSunCol * (uSunDir.y * .95 + .03) / .292; }
`,Zt=`
const float BANK_H = 10.;
float bankLine(float s, float t){ return 18. * (vnoise(vec2(s * .011, t * .1)) - .5) + 7. * (vnoise(vec2(s * .043 + 5., t * .22)) - .5); }
float bankCol(float s, float t){
  float g = smoothstep(.08, .3, vnoise(vec2(s * .016 + 3., t * .07)));
  return g * (.6 + .62 * vnoise(vec2(s * .037 + 9., t * .18)));
}
float bankF(vec3 q, float t){
  float c = bankCol(q.x, t), H = BANK_H * c + .01;
  float hy = q.y / H;
  float a0 = 5. - .6 * q.y, w = 3.5 + 6. * c;
  float da = (q.z - a0) / w;
  float n = .55 * vnoise(vec2(q.x * .085 - t * .3 + q.z * .06, q.y * .17 - t * .22)) + .45 * vnoise(vec2(q.x * .19 + q.y * .05, q.z * .14 + q.y * .1 + t * .35));
  float lump = vnoise(vec2(q.x * .17 + q.z * .12, q.y * .3 - q.z * .1 + t * .3));      // rounded billows six or eight metres across
  float body = 1.05 - da * da - hy * hy + .7 * (n - .5) + .5 * (lump - .5);
  // wisps ahead of the crest
  float ah = -(q.z - a0) - w;
  float wisp = smoothstep(0., 6., ah) * (1. - smoothstep(10., 30., ah)) * (1. - abs(hy - .82) * 2.6) * smoothstep(.5, .85, vnoise(vec2(q.x * .05 - t * .25, q.z * .07 + t * .5 + q.y * .1))) * .9 * smoothstep(.02, .2, c);
  return max(body, wisp);
}
float bankRho(vec3 q, float t){ return smoothstep(0., .4, bankF(q, t)); }
// the top of the same body as a height over the pan (s along the line, zb behind it, in the body's own scale): a rounded
// crown with a finite slope at its foot, the billows of the body in it
float bankTop(float s, float zb, float t){
  float c = bankCol(s, t), H = BANK_H * c, y = .6 * H;
  float a0 = 5. - .6 * y, w = 3.5 + 6. * c;
  float da = (zb - a0) / w;
  float n = .55 * vnoise(vec2(s * .085 - t * .3 + zb * .06, y * .17 - t * .22)) + .45 * vnoise(vec2(s * .19 + y * .05, zb * .14 + y * .1 + t * .35));
  float lump = vnoise(vec2(s * .17 + zb * .12, y * .3 - zb * .1 + t * .3));
  float f = clamp(1.05 - da * da + .7 * (n - .5) + .5 * (lump - .5), 0., 1.), g = 1. - f;
  // a broad crown (the flanks are short), heaped with rounded billows that crease where they meet
  float b1 = 2. * vnoise(vec2(s * .11 + zb * .04 - t * .16, zb * .13 + t * .12)) - 1., b2 = 2. * vnoise(vec2(s * .27 - t * .24, zb * .29 + t * .27 + 4.)) - 1.;
  return H * (1. - g * g * g) * (.75 + .2 * (1. - b1 * b1) + .06 * (1. - b2 * b2));
}
`,bn=`
varying vec3 vDir;
void main(){
  vDir = position;
  vec4 p = projectionMatrix * viewMatrix * vec4(position * 100. + cameraPosition, 1.);
  if (abs(p.w) < 1e-4) p.w = 1e-4;       // a vertex exactly beside a level camera (the pole) has w = 0
  gl_Position = p.xyww;
}`,kn=`
varying vec3 vDir;
uniform vec3 uZenith, uHorizon, uPlum, uGroundHaze, uCirrus, uDiscCol;
uniform vec2 uPlumDir, uWind;
uniform vec4 uDisc;       // disc cos radius, disc radiance, glow, stars
${re}
void main(){
  vec3 d = nrm(vDir);
  float h = d.y;
  vec2 az = d.xz / max(length(d.xz), 1e-4);
  float up = clamp(h, 0., 1.);
  vec3 col = mix(uHorizon, uZenith, 1. - exp(-up * 4.2));
  // sunward peach wash low down
  vec2 s2 = uSunDir.xz / max(length(uSunDir.xz), 1e-4);
  float sunAz = max(dot(az, s2), 0.);
  col = mix(col, uFogB * 1.08, .75 * sunAz * sunAz * exp(-up * 7.));
  // the plum dust band downwind: the dark quarter everything pale is read against
  float pa = .5 + .5 * dot(az, uPlumDir);
  float band = exp(-up * 6.5) * smoothstep(.1, .75, pa);
  float streak = fbm(vec2(atan(az.y, az.x + step(abs(az.x) + abs(az.y), 1e-5)) * 5. + uTime * .004, up * 40.));
  col = mix(col, uPlum * (.84 + .3 * streak), min(band * 1.1, .9));
  col = mix(col, uZenith * .82, .35 * smoothstep(.2, .9, pa) * exp(-up * 3.) * (1. - band));
  // mares' tails combed downwind
  if (h > .015) {
    vec2 q = d.xz / (h + .11);
    vec2 w = vec2(dot(q, uWind), dot(q, vec2(-uWind.y, uWind.x)));
    w.x -= uTime * .012;
    float warp = vnoise(w * vec2(.35, .9) + 3.) + .5 * vnoise(w * vec2(.9, 2.1) + 13.);
    float a = fbm(vec2(w.x * .55 + warp * 1.6, w.y * 4.6 + warp * 1.2));
    float b = vnoise(vec2(w.x * 1.4, w.y * 26. + warp * 9.));
    float tails = smoothstep(.5, .82, a) * (.3 + .7 * b) * smoothstep(.03, .3, h) * smoothstep(.42, .8, vnoise(w * vec2(.13, .34) + 9.));
    float toSun = max(dot(d, uSunDir), 0.);
    col = mix(col, uCirrus * (1. + .5 * toSun * toSun), tails * .3);
  }
  // sun or moon: a small disc with an analytic glow
  float c = dot(d, uSunDir);
  float disc = smoothstep(uDisc.x - .00006, uDisc.x + .00006, c);
  float g = max(c, 0.); float g2 = g * g; float g8 = g2 * g2 * g2 * g2; float g64 = g8 * g8 * g8 * g8 * g8 * g8 * g8 * g8;
  col += uDiscCol * (disc * uDisc.y + uDisc.z * (.9 * g64 * g64 * g64 + .16 * g8 * g8));
  // stars (night)
  if (uDisc.w > 0. && h > 0.) {
    vec2 sp = d.xz / (h + .35) * 60.; vec2 si = floor(sp);
    float sh = hash21(si);
    float tw = .7 + .3 * sin(uTime * (1. + sh * 3.) + sh * 40.);
    float st = smoothstep(.28, .0, length(fract(sp) - .5 - (hash22(si + 3.) - .5) * .6)) * step(.93, sh);
    col += vec3(.8, .85, 1.) * st * tw * uDisc.w * smoothstep(0., .2, h);
  }
  // below the horizon: the haze the ground fades into
  vec3 gh = hazeCol(d);
  col = mix(col, gh, smoothstep(.012, -.03, h));
  col = mix(col, gh, .5 * exp(-up * 34.) * (1. - min(band, 1.) * .45));      // the plum band sinks into the pan's own haze at its foot: no hard stripe on the horizon
  col += (hash21(gl_FragCoord.xy) - .5) * .006;
  gl_FragColor = vec4(max(col, 0.), 1.);
}`,zn=`
varying vec3 vW; varying vec4 vClip;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.);
  vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
  vClip = gl_Position;
}`,Sn=`
varying vec3 vW; varying vec4 vClip;
uniform sampler2D tShadow; uniform vec3 uFloor;
uniform vec3 uSalt, uZenith, uHorizon, uBrine, uPlumCol;
uniform vec4 uGale;       // smoke strength, wet 0..1, gust front position (along wind), gust strength
uniform float uBankK;     // the bank's size (it gathers salt as it runs: 1 where it catches us, 2 up by the Wheel)
uniform vec4 uRest;       // the resting ground: centre xz, radius, strength of its rose brine pans
uniform vec2 uWindDir;
uniform vec4 uRing;       // the standing ring: xz, and the heading we arrive on
uniform vec3 uPortalCol;
${re}
${Zt}
// the herd's old ways into the resting ground: spiral roads closing on the standing ring, kept wide enough
// (in pixels) to be read from the air. Returns (groove, lip).
vec2 roadSet(vec2 rq, float rr, float arms, float twist, float seed, float fw){
  float ang = atan(rq.y, rq.x + step(abs(rq.x) + abs(rq.y), 1e-4));
  float t = ang / 6.2832 * arms + twist * log(max(rr, 1.)) + .9 * vnoise(rq * .005 + seed);
  float id = floor(t), f = abs(fract(t) - .5);
  float h = hash21(vec2(id, seed));
  float dM = f * rr * 6.2832 / arms * .9;                   // metres from the middle of this road
  float hw = max(.5 + 1.6 * h, fw * 1.15), aa = max(fw, .25);
  float groove = 1. - smoothstep(hw, hw + aa, dM);
  float lip = (1. - smoothstep(hw * 1.7 + .5, hw * 1.7 + .5 + aa, dM)) - groove;
  return vec2(groove, max(lip, 0.) * clamp(1.2 - fw * 2.2, 0., 1.)) * (.5 + .5 * h) * step(.2, h);
}
// the nine great roads: log spirals closing on the ring (the same numbers lay the fallen in the lanes between them).
// Never under two pixels wide. Returns (rutted bed, pale lip).
uniform float uRoadPh;
vec2 greatRoads(vec2 rq, float rr, float fmin, float fmax, out float wetLane){
  float ang = atan(rq.y, rq.x + step(abs(rq.x) + abs(rq.y), 1e-4));
  float t = (ang - uRoadPh - .5 * log(max(rr, 1.))) / 6.2832 * 9. + .25 * (vnoise(rq * .006 + 2.7) - .5);
  float id = mod(floor(t), 9.), f = abs(fract(t) - .5);
  // every other lane between the roads holds the rose brine: from the air the resting ground is a pinwheel of rose and ivory
  wetLane = step(.5, fract(mod(floor(t + .5), 9.) * .5 + .25)) * smoothstep(.05, .17, f);
  float h = hash21(vec2(id, 4.4));
  float dM = f * rr * 6.2832 / 9. * .894;                    // metres from the middle of this road
  float hw = max(3.8 + 2.4 * h, fmin * 2.4), aa = max(fmin, .3);
  float bed = 1. - smoothstep(hw, hw + aa, dM);
  float lip = (1. - smoothstep(hw * 1.18 + .45, hw * 1.18 + .45 + aa, dM)) - bed;
  float ruts = .8 + .2 * sin(dM * 4.2 + 2. * vnoise(rq * .05)) * clamp(1. - fmax * .5, 0., 1.);
  return vec2(bed * ruts, max(lip, 0.) * clamp(1.25 - fmax * 1.6, 0., 1.));
}
// one family of track lines: isolines of a stream function, random width and age per line
vec2 trackSet(vec2 p, float bend, float rot, float spacing, float seed, float fw){
  float c = cos(rot), s = sin(rot);
  vec2 q = vec2(c * p.x - s * p.y, s * p.x + c * p.y);
  float psi = q.y + bend * q.x * q.x + 9. * sin(q.x * .011 + seed) + 22. * vnoise(q * .004 + seed);
  float t = psi / spacing;
  float id = floor(t), f = fract(t);
  float h = hash21(vec2(id, seed));
  float h2 = hash21(vec2(id, seed + 7.7));
  float wdt = mix(.05, 1.5, h * h * h) + .03;                    // half width in metres (5 cm .. 3 m)
  float dist = abs(f - .5 - (h2 - .5) * .7) * spacing;
  float aa = fw * 1.2 + .02;
  float groove = 1. - smoothstep(wdt - aa, wdt + aa, dist);
  float lip = (1. - smoothstep(wdt * 1.25 + .06 - aa, wdt * 1.25 + .06 + aa, dist)) - groove;
  float keep = step(.18, h2) * clamp(1.5 - fw * .7 / max(wdt, .2), 0., 1.);
  return vec2(groove, max(lip, 0.)) * keep * (.45 + .55 * h);
}
void main(){
  vec3 V = cameraPosition - vW; float dist = length(V); V /= max(dist, 1e-4);
  vec2 p = vW.xz;
  float fwx = length(dFdx(p)), fwy = length(dFdy(p));
  float fw = max(fwx, fwy);
  // polygon cells with raised ridges (F2 - F1 of a jittered grid) and their analytic normal
  vec2 pc = p / 2.0 + 2.5 * vec2(vnoise(p * .013), vnoise(p * .013 + 31.));
  vec2 ci = floor(pc), cf = fract(pc);
  float d1 = 8., d2 = 8.; vec2 r1 = vec2(0.), r2 = vec2(0.), id1 = vec2(0.);
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y));
    vec2 r = g + .15 + .7 * hash22(ci + g) - cf; float d = dot(r, r);
    if (d < d1) { d2 = d1; r2 = r1; d1 = d; r1 = r; id1 = ci + g; } else if (d < d2) { d2 = d; r2 = r; }
  }
  float f1 = sqrt(d1), f2 = sqrt(d2);
  float e = f2 - f1;
  vec2 ge = r1 / max(f1, 1e-3) - r2 / max(f2, 1e-3);
  float cfw = fw / 2.0;
  float rw = .065 + cfw * 1.5;
  float ridge = 1. - smoothstep(0., rw, e);
  float detail = (1. - smoothstep(.06, .4, cfw)) * mix(1., .5, smoothstep(45., 120., dist));      // with distance the cells are drawn fine and faint (the air between): the windows of light are the pattern there
  float cellH = hash21(id1);
  float flank = ridge * (1. - ridge) * 4.;
  float grain = vnoise(p * 9.) * .5 + vnoise(p * 31.) * .5;
  vec3 N = nrm(vec3(ge.x * flank * 1.25 * detail + (grain - .5) * .1 * detail, 1., ge.y * flank * 1.25 * detail));
  // albedo: warm salt, cells of slightly different age, chalk ridges, grey-lilac pan staining at large scale
  float stain = fbm(p * .0031 + 4.);
  float crust = vnoise(p * 1.3) * .6 + vnoise(p * 3.7) * .4;
  vec3 alb = uSalt * (.82 + .17 * cellH * detail + .22 * (stain - .5) + .1 * (crust - .5) * detail);
  alb = mix(alb, alb * vec3(.86, .84, .92), detail * step(.8, cellH) * smoothstep(.1, .35, e));
  alb = mix(alb, uSalt * vec3(.93, .9, .98), .35 * smoothstep(.45, .75, fbm(p * .0009 + 11.)));
  alb *= 1. + .15 * ridge * ridge * detail - .12 * smoothstep(.0, .5, e) * (1. - smoothstep(.5, .9, e)) * detail * .5;
  float nod = smoothstep(.62, .8, vnoise(p * 5.3 + cellH * 9.)) * clamp(1. - fw * 14., 0., 1.);
  alb *= .94 + .12 * grain * detail + .14 * nod;
  N = nrm(N + vec3(vnoise(p * 5.3 + 2.) - .5, 0., vnoise(p * 5.3 + 5.) - .5) * .35 * nod);
  // tracks: new set along the flow, two older sets crossing it
  vec2 tr = trackSet(p, .00042, 0., 7.5, 1.3, fw) + .7 * trackSet(p, .0006, .21, 13., 5.1, fw) + .5 * trackSet(p, .0003, -.33, 21., 8.7, fw)
          + .55 * trackSet(p / 7., .003, .08, 9., 3.3, fw / 7.) * vec2(1., .12);        // the broad old roads of the herd, read from the air: a dark groove, its lip a hairline (never a pale bar)
  float wet = uGale.y;
  // from the air the fine cells filter away: broad old plates (17 m) take over, pale-ridged, so the pan stays drawn
  float big = 1. - detail;
  vec2 qc = p / 8. + 1.3 * vec2(vnoise(p * .008 + 3.), vnoise(p * .008 + 17.));
  vec2 qi = floor(qc), qf = fract(qc); float b1 = 8., b2 = 8.; vec2 bid = vec2(0.), rb1 = vec2(0.), rb2 = vec2(0.);
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y));
    vec2 r = g + .15 + .7 * hash22(qi + g + 41.) - qf; float d = dot(r, r);
    if (d < b1) { b2 = b1; rb2 = rb1; b1 = d; rb1 = r; bid = qi + g; } else if (d < b2) { b2 = d; rb2 = r; }
  }
  float eB = sqrt(b2) - sqrt(b1), wB = .04 + fw / 8. * 1.4;
  float ridgeB = (1. - smoothstep(0., wB, eB)) * clamp(1.6 - fw * .25, 0., 1.);
  alb *= 1. + big * (-.3 * ridgeB + .12 * smoothstep(wB, wB * 2.5, eB) * (1. - smoothstep(wB * 2.5, wB * 5., eB)) * clamp(1.6 - fw * .25, 0., 1.) + .12 * (hash21(bid) - .5)) + .05 * ridgeB * detail;
  // roads into the resting ground
  vec2 rq = p - uRing.xy; float rr = length(rq);
  float rk = uRest.w * smoothstep(1000., 600., rr) * smoothstep(14., 40., rr);
  vec2 road = (.5 * roadSet(rq, rr, 13., 2.1, 2.7, fw) + .6 * roadSet(rq, rr, 8., -3.4, 9.1, fw)) * rk * vec2(1., .12);      // dark curved grooves, the lip a hairline (never a pale bar)
  tr = min(tr + road * 1.3, vec2(1.));                    // piled grooves never go darker than one groove
  tr *= 1. - .55 * wet;
  float wetLane;
  vec2 great = greatRoads(rq, rr, min(fwx, fwy), fw, wetLane) * uRest.w * smoothstep(900., 640., rr) * smoothstep(16., 46., rr);
  alb *= 1. - .26 * tr.x;
  alb = mix(alb, vec3(.8, .78, .74), .13 * tr.y * clamp(1.3 - fw * 1.6, 0., 1.));      // lips are fine things: from the air only the grooves are left
  alb = mix(alb, alb * vec3(.32, .29, .44), great.x);       // worn to the dark bed under the crust
  alb = mix(alb, vec3(.84, .82, .78), .45 * great.y);
  tr = max(tr, vec2(great.x * .5, great.y * .5));
  N = nrm(N + vec3(uSunDir.x, 0., uSunDir.z) * (.16 * tr.y - .16 * tr.x) * max(detail, .35));
  float nl = max(dot(N, uSunDir), uSunDir.y * mix(.78, .3, smoothstep(.12, .3, uSunDir.y)));
  alb = mix(alb, uSalt * 1.04, .45 * exp(-rr * rr / 2600.) * uRest.w);          // a pale apron of drifted salt round the ring
  // what the sun has passed through on its way here: the product of every pane above this point (the shadow target)
  vec3 Tsun = texture2D(tShadow, clamp(vClip.xy / max(vClip.w, 1e-4) * .5 + .5, 0., 1.)).rgb;
  vec3 shadeK = uFloor + (1. - uFloor) * Tsun;      // the same, floored by the sky fill: for what is not lit by this shader's own sun term
  // where windows cross and the product of their tints goes dark, the sky's lilac fills in: the darkest ground is plum, never brown or black
  float tMax = max(Tsun.r, max(Tsun.g, Tsun.b));
  vec3 plumFill = vec3(.4, .27, .58) * dot(uSunCol, vec3(.3, .5, .2)) * .24 * max(.4 * smoothstep(.5, .12, tMax) * smoothstep(.3, .1, uSunDir.y), .6 * smoothstep(.2, .03, tMax));      // (all of it at dawn, when every shadow is eight times its hoop; by day only the blackest crossings, so an elder's deep window keeps its colour)
  vec3 col = alb * (uSunCol * nl * Tsun + uSkyCol * (.72 + .28 * N.y) + plumFill);
  col += alb * uPortalCol * (.34 * exp(-rr * rr / 900.) + .1 * exp(-rr * rr / 9000.)) * uRest.w;     // and its light on the salt
  // sparkle of crystal faces near the camera
  float sp = step(.985, hash21(floor(p * 14.) + floor(V.xz * 6.))) * clamp(1. - fw * 9., 0., 1.);
  col += uSunCol * sp * .22 * Tsun;
  // brine: one cell in forty holds shallow water (everywhere after rain); it mirrors the analytic sky
  float pool = max(step(.975, cellH) * smoothstep(.02, .14, e) * detail, wet * (.75 + .25 * smoothstep(.0, .2, e)));
  // the rose brine of the resting ground lies in whole cells: its shore follows the cell edges, with a pale crust line
  float panK = uRest.w * smoothstep(uRest.z, uRest.z * .3, length(p - uRest.xy)) * smoothstep(-16., -80., p.y);
  float laneK = (wetLane - .45) * .34 * smoothstep(40., 90., rr) * smoothstep(840., 620., rr);
  float pf0 = fbm(p * .012 + 20.) + laneK;
  float pf1 = fbm((p + r1 * 2.) * .012 + 20.) + .05 * (cellH - .5) + laneK, pf2 = fbm((p + r2 * 2.) * .012 + 20.) + .05 * (hash21(id1 + 17.) - .5) + laneK;
  float in1 = smoothstep(.525, .535, pf1), in2 = smoothstep(.525, .535, pf2);
  float pb1 = fbm((p + rb1 * 8.) * .012 + 20.) + laneK, pb2 = fbm((p + rb2 * 8.) * .012 + 20.) + laneK;
  float inB1 = smoothstep(.525, .535, pb1), inB2 = smoothstep(.525, .535, pb2);
  float plateK = clamp(1.6 - fw * .25, 0., 1.);                    // (the plates filter away in their turn, far off)
  float pan = panK * mix(mix(smoothstep(.5, .56, pf0), inB1, plateK), in1, detail);
  float crustLine = panK * max(detail * abs(in1 - in2) * (1. - smoothstep(rw * .45, rw * 1.2, e)), (1. - detail) * plateK * abs(inB1 - inB2) * (1. - smoothstep(wB * .55, wB * 1.5, eB)));
  float shoreApron = panK * smoothstep(.455, .525, pf0) * (1. - pan);      // drifted salt just outside the shore
  pool = max(pool, pan * (.82 + .18 * smoothstep(0., .15, e) * detail));
  pool *= 1. - .92 * min(great.x * 1.4 + great.y, 1.);        // the great roads stand dry, even after rain
  // but a film of brine lies before the standing ring, over the road too: the ring and its light stand in it as in glass
  vec2 ra = vec2(dot(rq, uRing.zw), dot(rq, vec2(-uRing.w, uRing.z)));
  float apron = uRest.w * smoothstep(-175., -120., ra.x) * smoothstep(-15., -32., ra.x) * (1. - smoothstep(11., 21., abs(ra.y) * (1. + .4 * smoothstep(-60., -160., ra.x)) + 9. * (vnoise(p * .07 + 3.) - .5)));
  pool = max(pool, apron * (.78 + .2 * smoothstep(0., .15, e) * detail)); pan = max(pan, apron * .4);
  // the ring's light glancing off crystal faces: a broken streak of mint along the salt toward us (dry pan)
  {
    vec2 toR2 = uRing.xy - p; float dR2 = length(toR2);
    vec2 a3 = toR2 / max(dR2, 1e-3), v3 = -V.xz / max(length(V.xz), 1e-3);
    float az3 = a3.x * v3.y - a3.y * v3.x, w3 = 11. / max(dR2, 11.);
    float glit = exp(-az3 * az3 / (w3 * w3 * .5 + 4e-5)) * step(0., dot(a3, v3)) * smoothstep(12., 40., dR2) * exp(-dR2 / 380.);
    col += alb * uPortalCol * glit * (.3 + .7 * vnoise(p * .45 + vec2(uTime * .3, 0.))) * uRest.w * (1. - wet) * .75 * smoothstep(.42, .16, V.y);      // (a glancing light off crystal faces: it is there only at a grazing angle of view, never as a pale beam seen from steeply above)
  }
  if (pool > 0.) {
    vec2 rp = vec2(vnoise(p * 1.7 + uTime * vec2(.5, .3)), vnoise(p * 1.7 + 9. - uTime * vec2(.4, .2))) - .5;
    rp += (vec2(vnoise(p * .37 + uTime * vec2(.22, .1)), vnoise(p * .37 + 5. - uTime * vec2(.15, .2))) - .5) * 1.6 * wet;
    vec3 Nw = nrm(vec3(rp.x * .05, 1., rp.y * .05));
    vec3 R = reflect(-V, Nw); R.y = abs(R.y);
    float cosv = max(dot(V, Nw), 0.);
    float fr = mix(.06, .05, wet) + mix(.94, .95, wet) * pow(max(1. - cosv, 0.), mix(4., 3.4, wet));      // (after rain the film is thin: looked down on it shows its bed, and mirrors the sky only toward the horizon)
    float deep = max(wet, pan);                       // the rose pans hold the deep of the sky too, not the pale horizon
    fr = mix(fr, .16 + .84 * pow(max(1. - cosv, 0.), 1.6), pan * (1. - wet));      // the pans are water: the sky in their far half, the rose bed through the film in the near half
    // after rain the film mirrors the deep of the sky, periwinkle, not the pale haze at the horizon
    vec3 sky = mix(uHorizon, uZenith, 1. - exp(-R.y * mix(3.2, 9., deep)));
    sky = mix(sky, hazeCol(R), exp(-R.y * mix(18., 46., deep)) * (1. - .45 * deep));
    float sg = max(dot(R, uSunDir), 0.); float sg4 = sg * sg * sg * sg; float sg32 = sg4 * sg4 * sg4 * sg4 * sg4 * sg4 * sg4 * sg4;
    sky += uSunCol * sg32 * sg32 * mix(.8, .16, wet) * Tsun;
    sky *= mix(vec3(1.), shadeK, .75);                // a shadow still tints the film: it darkens the bed that shows through the reflection
    // the standing ring, its light and the two tipped rims, drawn out by the ripples into long streaks toward us
    vec3 toR = vec3(uRing.x, 13., uRing.y) - vW; float dR = length(toR.xz);
    vec2 a2 = toR.xz / max(dR, 1e-3), r2d = R.xz / max(length(R.xz), 1e-3);
    float azd = a2.x * r2d.y - a2.y * r2d.x, facing = step(0., dot(a2, r2d));
    float el = 13. / max(dR, 1.) - R.y / max(length(R.xz), 1e-3);
    float wAz = 9.5 / max(dR, 10.);                           // the ring's half width as an angle from here
    float glint = exp(-azd * azd / (wAz * wAz * .5 + 4e-5)) * exp(-el * el * 2.2) * facing * smoothstep(8., 30., dR) * smoothstep(950., 300., dR);
    sky += uPortalCol * glint * (1.1 + .5 * vnoise(vec2(p.x * .9 + uTime, p.y * .9)));
    vec2 side = vec2(-uRing.w, uRing.z);
    for (int k = 0; k < 2; k++) {
      vec2 c2 = uRing.xy + side * (k == 0 ? 36. : -36.) + uRing.zw * 8. - vW.xz; float dk = length(c2);
      vec2 ak = c2 / max(dk, 1e-3); float azk = ak.x * r2d.y - ak.y * r2d.x, wk = 9. / max(dk, 9.);
      float elk = 9. / max(dk, 1.) - R.y / max(length(R.xz), 1e-3);
      sky += (uSunCol * .12 + uSkyCol * .5) * exp(-azk * azk / (wk * wk * .5 + 4e-5)) * exp(-elk * elk * 3.) * step(0., dot(ak, r2d)) * smoothstep(8., 30., dk) * smoothstep(600., 200., dk);
    }
    // the reflected sky holds the plum band downwind
    { vec2 rz = R.xz / max(length(R.xz), 1e-3); sky = mix(sky, uPlumCol * .92, .85 * exp(-R.y * 6.5) * smoothstep(.1, .75, .5 + .5 * dot(rz, uWindDir)) * pan); }
    // the bed under the film: damp salt, paler and more neutral than the dry crust is dark, so coloured light stays coloured
    // on it; under the rose brine the cells are drowned (flat and faint, a little darker along their ridges)
    vec3 drowned = uSalt * (.8 + .22 * (stain - .5)) * (uSunCol * max(uSunDir.y, .1) * Tsun + uSkyCol + plumFill) * (1. - .16 * ridge * detail - .1 * ridgeB * big);
    vec3 bed = mix(col, drowned, .8 * pan * (1. - wet)) * mix(mix(uBrine, vec3(.82, .78, .84), wet), vec3(.76, .24, .38), pan * (1. - wet * .5));
    sky += uSunCol * Tsun * .8 * pan * smoothstep(.76, .88, vnoise(p * 2.1 + uTime * vec2(.55, .2))) * smoothstep(.7, .84, vnoise(p * .9 - uTime * vec2(.2, .35) + 4.));      // glints wandering on the film
    col = mix(col, mix(bed, sky, fr), pool);
  }
  col = mix(col, vec3(.84, .81, .76) * (uSunCol * nl * Tsun + uSkyCol), .3 * shoreApron * (1. - pool));
  col = mix(col, vec3(.9, .87, .82) * (uSunCol * max(nl, uSunDir.y * 1.6) * Tsun + uSkyCol), crustLine * .9);      // the crust round each pan: a thin bright line
  // salt smoke streaming along the ground, and the gust front
  vec2 wq = vec2(dot(p, uWindDir), dot(p, vec2(-uWindDir.y, uWindDir.x)));
  float sm = fbm(vec2(wq.x * .035 - uTime * 1.5, wq.y * .16)) * vnoise(vec2(wq.x * .008 - uTime * .25, wq.y * .02 + 3.));
  float fd = wq.x - uGale.z - bankLine(wq.y, uTime);      // metres ahead of the gust's ragged front line (negative: behind it)
  float tongue = fbm(vec2(wq.x * .045 - uTime * 2.4, wq.y * .3)) * vnoise(vec2(wq.x * .012 - uTime * .5, wq.y * .06 + 7.));
  // behind the front, long soft tongues of salt still stream along the ground
  float front = uGale.w * exp(-max(-fd, 0.) * .03) * smoothstep(4., -10., fd) * smoothstep(.24, .7, tongue) * .6;
  float low = 1. - exp(-.09 / max(V.y, .03));        // a thin sheet hugging the pan: thick along a grazing line of sight, next to nothing looked down through
  // the bank's own shadow: its body, slid down the sun's ray onto the salt (lilac, so the bank stands when seen from the air)
  if (uGale.w > .002 && abs(fd) < 200.) {
    vec2 pr2 = vec2(-uWindDir.y, uWindDir.x); vec2 sr = uSunDir.xz / max(uSunDir.y, .1);
    float bk = max(uBankK, .5);
    vec2 pa = p + sr * 3.5 * bk, pb = p + sr * 8.5 * bk, pd = p + sr * 13.5 * bk;
    float sa = dot(pa, pr2), sb = dot(pb, pr2), sd2 = dot(pd, pr2);
    float od = bankRho(vec3(sa, 3.5, (uGale.z - dot(pa, uWindDir) + bankLine(sa, uTime)) / bk), uTime)
             + bankRho(vec3(sb, 8.5, (uGale.z - dot(pb, uWindDir) + bankLine(sb, uTime)) / bk), uTime)
             + bankRho(vec3(sd2, 13.5, (uGale.z - dot(pd, uWindDir) + bankLine(sd2, uTime)) / bk), uTime);
    col *= mix(vec3(1.), vec3(.5, .47, .76), (1. - exp(-od * 1.2)) * uGale.w * .88);
  }
  float smoke = clamp(smoothstep(.26, .62, sm) * uGale.x * (.08 + .92 * low) + front * .4 * low, 0., .7);
  vec3 smokeCol = (sunLow() * .3 + uSkyCol * .95) * vec3(.82, .8, .78);
  col = mix(col, smokeCol, smoke);
  float f = hazeAmt(dist);
  col = mix(col, hazeCol(-V), f);
  gl_FragColor = vec4(col, 1.);
}`,ct=`
attribute vec4 iA, iB, iC;
uniform float uPix;
uniform vec4 uWheelA, uWheelB;       // hub xyz, radius scale (0 = absent)
uniform vec3 uWheelNA, uWheelNB;
uniform mat3 uWTintA, uWTintB;       // columns: transmittance of green, amber, rose
uniform vec2 uWBand;                 // band radii at scale 1
vec3 hoopRot(vec3 q){
  float cl = cos(iB.y), sl = sin(iB.y);
  q = vec3(q.x, cl * q.y - sl * q.z, sl * q.y + cl * q.z);
  float ch = cos(iA.z), sh = sin(iA.z);
  return vec3(ch * q.x + sh * q.z, q.y, sh * q.x - ch * q.z);
}
vec2 hoopSpin(vec2 p){ float c = cos(iB.x), s = sin(iB.x); return vec2(c * p.x + s * p.y, -s * p.x + c * p.y); }
// pl: metres in the hoop's own disc frame (centre at origin, before the spin)
vec3 hoopXf(vec3 pl){
  vec2 xy = hoopSpin(pl.xy);
  return vec3(iA.x, iB.z, iA.y) + hoopRot(vec3(xy.x, xy.y + iA.w, pl.z));
}
// what the sun has passed through on its way to c: the Wheel's bands (1 = clear air)
vec3 wheelT(vec3 c, vec4 wh, vec3 n, mat3 tint){
  float dn = dot(uSunDir, n);
  float t = dot(wh.xyz - c, n) / (abs(dn) > 1e-3 ? dn : 1e-3);
  vec3 q = c + uSunDir * t - wh.xyz;
  float r = length(q) / max(wh.w, 1e-3);
  vec3 T = vec3(1.);
  T = mix(T, tint[0], smoothstep(27., 33., r));
  T = mix(T, tint[1], smoothstep(uWBand.x - 5., uWBand.x + 5., r));
  T = mix(T, tint[2], smoothstep(uWBand.y - 5., uWBand.y + 5., r));
  T = mix(T, vec3(.3), smoothstep(103., 106., r));
  T = mix(T, vec3(1.), smoothstep(108., 112., r));
  return mix(vec3(1.), T, step(0., t) * step(.5, wh.w));
}
vec3 sunThrough(vec3 c){ return wheelT(c, uWheelA, uWheelNA, uWTintA) * wheelT(c, uWheelB, uWheelNB, uWTintB); }
`,ka=`
uniform vec4 uWheelA, uWheelB; uniform vec3 uWheelNA, uWheelNB; uniform mat3 uWTintA, uWTintB; uniform vec2 uWBand;
`+ct.slice(ct.indexOf("// what the sun has passed")),za=`
attribute vec4 aOff;      // radial offset, axial offset (tube radii), kind (0 rim, 1 hub ring), profile coordinate
attribute vec3 aNrm;      // profile normal (radial, axial), angle round the hoop
varying vec3 vW, vN, vSunT; varying vec4 vK;   // vK: angle (spinning frame), profile coord, kind, radius
varying vec3 vS;          // seed, fade, roll
varying vec4 vT;          // the way round the rim (world); w: how far this part of the rim stands toward the sun
uniform vec2 uThick;      // rim thickness multiplier, terraces per radian (the standing ring)
${re}
${ct}
void main(){
  float R = iA.w;
  vec2 rad = position.xy / max(length(position.xy), 1e-4);
  vec3 c = vec3(iA.x, iB.z + R, iA.y);
  float dist = length(cameraPosition - c);
  float tr = max(R * .02 * mix(1., .62, aOff.z) * uThick.x * mix(1., iC.x, step(.5, uThick.y)), uPix * dist);
  float tph = aNrm.z * uThick.y + iB.w * 7.;       // the ancient ring: a few deep annuli, each swelling and then stepping back
  tr *= 1. + step(.5, uThick.y) * ((hash21(vec2(floor(tph), 3.)) - .5) * .18 + (smoothstep(0., .18, fract(tph)) * (1. - .6 * fract(tph)) - .5) * .46);
  vec3 pl = vec3(position.xy * R + rad * aOff.x * tr, aOff.y * tr * (1. + 1.3 * smoothstep(7., 18., R) * (1. - step(.5, uThick.y))));      // (an elder's rim is deep across: seen edge-on it is a band of stepped horn, never a line)
  vec3 w = hoopXf(pl);
  vec2 n2 = hoopSpin(rad * aNrm.x);
  vN = hoopRot(vec3(n2, aNrm.y));
  vT = vec4(hoopRot(vec3(hoopSpin(vec2(-rad.y, rad.x)), 0.)), dot(hoopRot(vec3(hoopSpin(rad), 0.)), uSunDir));
  vW = w;
  vK = vec4(aNrm.z, aOff.w, aOff.z, R);
  vS = vec3(iB.w, iC.w, iB.x);
  vSunT = sunThrough(c);
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
  if (iC.w <= 0.) gl_Position = vec4(2., 2., 2., 1.);
}`,Sa=`
// a pane seen THROUGH the Wheel's glass: rgb = the tint of the band the line of sight crosses, a = 1 when it does.
// (the Wheel's membrane is drawn before the herd's, so without this the hoops beyond it stand on it as pale cut-outs)
vec4 behindWheel(vec3 w){
  vec3 d = w - cameraPosition; float dn = dot(d, uWheelNA);
  float t = dot(uWheelA.xyz - cameraPosition, uWheelNA) / (abs(dn) > 1e-3 ? dn : 1e-3);
  vec3 q = cameraPosition + d * t - uWheelA.xyz; float rq = length(q) / max(uWheelA.w, 1e-3);
  float k = step(0., t) * step(t, 1.) * smoothstep(28., 32., rq) * (1. - smoothstep(104., 108., rq)) * step(.5, uWheelA.w);
  vec3 T = mix(mix(uWTintA[0], uWTintA[1], smoothstep(uWBand.x - 5., uWBand.x + 5., rq)), uWTintA[2], smoothstep(uWBand.y - 5., uWBand.y + 5., rq));
  return vec4(T, k);
}
`,Ma=`
varying vec3 vW, vN, vSunT; varying vec4 vK; varying vec3 vS; varying vec4 vT;
uniform vec3 uHorn, uAmber, uPlum, uRose, uSalt;
uniform vec2 uThick;
uniform vec4 uWheelA; uniform vec3 uWheelNA; uniform mat3 uWTintA; uniform vec2 uWBand;
${re}
${Sa}
void main(){
  vec3 V = cameraPosition - vW; float dist = length(V); V /= max(dist, 1e-4);
  vec3 N = nrm(vN);
  float R = vK.w, ang = vK.x, pc = vK.y, seed = vS.x;
  float arc = ang * R;                                  // metres round the rim, turning with it
  float px = dist * .0016;                              // rough pixel footprint in metres
  // growth rings: stepped terraces, amber banded, like a ram's horn
  float ringLen = mix(.22, .5, fract(seed * 7.13)) * (1. + .12 * R);
  float gt = arc / ringLen + 1.5 * vnoise(vec2(arc * .6, seed * 9.));
  float gf = fract(gt), gi = floor(gt);
  float ringFade = clamp(1.2 - px / ringLen * 2.2, 0., 1.);
  float step_ = smoothstep(0., .14, gf) * (1. - .55 * gf);
  float gh = hash21(vec2(gi, seed * 31.));
  vec3 horn = uHorn * (.6 + .16 * vnoise(vec2(arc * 1.7, pc * 6. + seed)));
  horn = mix(horn, horn * (.62 + .5 * step_), ringFade);
  horn = mix(horn, uAmber * .5, ringFade * step(.62, gh) * .55 * (1. - smoothstep(.55, .9, abs(pc))) + (1. - ringFade) * .2);
  // lichen in the growth rings of the old
  float old = step(.5, uThick.y);
  float lich = smoothstep(.55, .75, vnoise(vec2(arc * .35 + seed * 20., pc * 2.))) * smoothstep(5., 12., R) * (1. - .75 * old);
  horn = mix(horn, mix(uRose * .55, uAmber * .45, step(.5, fract(seed * 3.7))), lich * .5 * (1. - step_ * .6));
  // the ancient ring: furred rose with lichen away from the sun, ochre toward it
  // (bare pale horn where the sun reaches, deep creases between its annuli; lichen only in the lee and underneath)
  float tf = fract(ang * uThick.y + seed * 7.);
  float crease = old * (1. - smoothstep(0., .09, tf) * (1. - smoothstep(.94, 1., tf)));
  float lee = smoothstep(.3, -.2, vT.w * .8 + dot(nrm(vN), uSunDir) * .5);      // the half of the ring that stands away from the sun, and every underside
  float fur = old * lee * (.6 + .4 * smoothstep(.3, .6, fbm(vec2(arc * .8 + 3., pc * 3. + vW.y * .3))));
  horn = mix(horn, horn * 1.22, old * (1. - fur));
  horn = mix(horn, mix(uRose * .95, uAmber * .6, .3 * vnoise(vec2(arc * 2., pc * 5.))), fur * .9);
  horn *= (1. - .25 * old * (1. - step_)) * (1. - .55 * crease);
  // keel worn chalk white where it runs
  float keel = smoothstep(mix(.72, .86, smoothstep(7., 18., R)), .96, pc) * (1. - vK.z) * (1. - .7 * old);
  horn = mix(horn, vec3(.84, .83, .8), keel * .9);
  // the ballast window on the inner flank: amber glass, with the plum bead riding ahead of the contact
  float inner = smoothstep(-.62, -.86, pc) * (1. - vK.z) * (1. - old);
  float da = mod(ang - vS.z + PI * .5 - .35 + PI, 2. * PI) - PI;
  float bead = 1. - smoothstep(.2, .27, abs(da));
  vec3 glass = mix(uAmber * .75, uPlum * .45, bead);
  horn = mix(horn, glass, inner * .85);
  N = nrm(N + vT.xyz * old * (.22 - 1.3 * (1. - smoothstep(0., .18, tf))) + vec3(0., 1e-4, 0.));       // the step faces of the annuli
  float nl = dot(N, uSunDir);
  // (old horn passes a little light: the sun wraps further round the ancient ring, and the pan lights its lee from below)
  float wrap = max(nl * mix(.85, .55, old) + mix(.15, .45, old), 0.) * mix(1., smoothstep(-.5, .35, vT.w), old);
  vec3 lit = uSunCol * vSunT * wrap + uSkyCol * (.6 + .4 * N.y + .5 * old) + uSalt * uSunCol * (.1 * max(-N.y, 0.) + old * .2 * (.6 - .4 * N.y));
  vec3 col = horn * lit;
  vec3 H = nrm(uSunDir + V);
  float nh = max(dot(N, H), 0.); float s2 = nh * nh; float s8 = s2 * s2 * s2 * s2; float s32 = s8 * s8 * s8 * s8;
  col += uSunCol * vSunT * step(0., nl) * (s32 * s32 * (.5 * keel + 1.2 * inner) + s8 * .05);
  // rim light against the sky so edge-on hoops never vanish
  float fr = 1. - max(dot(N, V), 0.);
  col += uSkyCol * .35 * fr * fr * fr;
  // horn seen THROUGH the Wheel's glass takes the tint of the band it is seen through and sinks into it: a soft ring in the
  // glass's own colour, never a pale cut-out standing on the membrane
  vec4 bw = behindWheel(vW);
  col = mix(col, bw.rgb * bw.rgb * dot(col, vec3(.3, .5, .2)) * .7, bw.a * .88);
  float f = hazeAmt(dist);
  col = mix(col, hazeCol(-V), f);
  gl_FragColor = vec4(col, 1.);
}`,Do=`
uniform vec4 uMem;        // pane density, glow, moth holes 0..1, drum amplitude
uniform float uBody;      // how much of the view behind a pane its own colour hides
const float E0 = .285, E1 = .972;
// trunk veins rooted in the rim that fork twice on the way to the eye. p: unit disc, turning with the hoop
float veinMaskW(vec2 p, float r, float seed, float aa, float wk){
  float nV = 9. + floor(fract(seed * 5.31) * 5.);
  float e = clamp((r - E0) / (E1 - E0), 0., 1.);
  float a = atan(p.y, p.x + step(r, 1e-4));
  float t = a / (2. * PI) * nV + seed;
  float id = floor(t);
  float al = fract(t) - .5 + .035 * sin(e * 9. + id * 2.4) * (1. - e);
  float x = abs(al) - .25 * smoothstep(.74, .44, e);
  x = abs(x) - .125 * smoothstep(.42, .14, e);
  float d = abs(x) * (2. * PI / nV) * r;
  float w = mix(.006, .016, e) * wk;
  return 1. - smoothstep(w - aa, w + aa, d);
}
// wk: vein width (1 on the pane itself; its shadow draws them wider, as leading), vk: how dark a vein is
vec3 paneT2(vec2 p, float r, vec3 tint, float seed, float aa, float wk, float vk, out float vein){
  float e = clamp((r - E0) / (E1 - E0), 0., 1.);
  vein = veinMaskW(p, r, seed, aa, wk);
  float calm = clamp(1. - aa * 40., 0., 1.);
  float rip = .5 + .5 * sin(r * 70. + 4. * vnoise(p * 3. + seed));
  float blot = vnoise(p * 2.3 + seed * 13.);
  vec3 tn = mix(tint, vec3(1.), .3 * smoothstep(.55, 0., e));
  float thick = uMem.x * (.72 + .12 * rip * calm + .3 * blot) + .9 * smoothstep(.03, 0., e) + .9 * smoothstep(.97, 1., e);
  vec3 T = pow(max(tn, vec3(.02)), vec3(thick)) * (1. - vk * vein);
  float hole = uMem.z * smoothstep(.69, .73, vnoise(p * 6.5 + seed * 40.)) * (1. - vein);
  return mix(T, vec3(1.), hole);
}
vec3 paneT(vec2 p, float r, vec3 tint, float seed, float aa, out float vein){ return paneT2(p, r, tint, seed, aa, 1., .78, vein); }
`,Mn=`
varying vec3 vW, vN, vSunT; varying vec2 vP; varying vec4 vI; varying vec2 vS; varying vec3 vCtr;
${re}
${ct}
${Do}
void main(){
  float R = iA.w;
  vec2 p = position.xy;
  float r = length(p);
  float e = clamp((r - E0) / (E1 - E0), 0., 1.);
  float a = atan(p.y, p.x + step(r, 1e-4));
  // drum mode: the membrane booms in gusts (2 % of the radius)
  float ph = uTime * (5.5 - R * .08) + iB.w * 40.;
  float h = uMem.w * .02 * sin(PI * e) * (sin(ph) * .7 + .5 * sin(ph * 1.63 + a * 2.));
  float hr = uMem.w * .02 * PI * cos(PI * e) / (E1 - E0) * (sin(ph) * .7 + .5 * sin(ph * 1.63 + a * 2.));
  vec3 w = hoopXf(vec3(p * R, h * R));
  vec2 rd = p / max(r, 1e-4);
  vec3 nl = vec3(hoopSpin(-rd * hr * 2.5), 1.);
  vN = hoopRot(nl);
  vP = p; vW = w;
  vI = iC; vS = vec2(iB.w, R);
  vSunT = sunThrough(vec3(iA.x, iB.z + R, iA.y));
  vCtr = hoopXf(vec3(0.));
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
  if (iC.w <= 0.) gl_Position = vec4(2., 2., 2., 1.);
}`,An=`
varying vec2 vP;
${re}
${ct}
uniform vec4 uWall;
void main(){
  vP = position.xy;
  gl_Position = projectionMatrix * viewMatrix * vec4(hoopXf(vec3(position.xy * iA.w, 0.)), 1.);
  if (iC.w < .5 || uWall.w <= 0.) gl_Position = vec4(2., 2., 2., 1.);
}`,Cn=`
varying vec2 vP;
void main(){
  float r = length(vP);
  if (r < .285 || r > .985) discard;
  gl_FragColor = vec4(0.);
}`,Tn=`
varying vec3 vW, vN, vSunT; varying vec2 vP; varying vec4 vI; varying vec2 vS; varying vec3 vCtr;
uniform vec3 uHorn;
uniform vec4 uWheelA; uniform vec3 uWheelNA; uniform mat3 uWTintA; uniform vec2 uWBand;
${re}
${Do}
${Sa}
void main(){
  float r = length(vP);
  float aa = max(fwidth(r), 1e-4);
  vec3 V = cameraPosition - vW; float dist = length(V); V /= max(dist, 1e-4);
  float f = hazeAmt(dist);
  float opq = 0.;                       // horn drawn analytically: hub ring (mid, far) and rim (far)
#ifdef FLAT
  if (r < .262 - aa || r > 1.) discard;
  opq = smoothstep(.262 - aa, .262 + aa, r) * (1. - smoothstep(.292 - aa, .292 + aa, r));
#ifdef FARRIM
  float rw = mix(max(.035, aa * 2.2), min(max(.05, aa * 1.7), .13), step(vS.x, 0.));      // the fallen (seed < 0): a broad pale rim
  opq = max(opq, smoothstep(1. - rw - aa, 1. - rw + aa, r) * mix(1., mix(1., .35, smoothstep(.07, .28, aa)), step(vS.x, 0.)));      // (far off a fallen pane is a rose lozenge with a thin pale edge, never a bare outline)
#else
  if (r > .975) discard;
#endif
#endif
  float vein;
  vec3 T = paneT(vP, r, vI.rgb, vS.x, aa, vein);
  T *= mix(mix(vec3(1.), vI.rgb, .4), vec3(1.), step(.995, min(T.r, min(T.g, T.b))));      // pale toward the eye, never white: only a moth hole is clear
  T = mix(T, vec3(0.), opq);
  float fade = clamp(vI.w, 0., 1.);
  // the pane has body: a third of what lies behind it is hidden by its own milky colour, so a herd seen through
  // itself reads as panes of glass one before another, not as a tangle of outlines
  vec3 N = nrm(vN + vec3(0., 0., 1e-4));
  float nv = dot(N, V);
  if (nv < 0.) { N = -N; nv = -nv; }
  float nl = dot(N, uSunDir);
  // (seen from its sunlit side a pane hides more of what is behind it: rose glass in the sun, not a ghost of the horizon)
  // (and it is deeper in its own colour there, to its centre: stained glass seen from the lit side, never a bleached disc)
  T = mix(T, T * mix(vec3(1.), vI.rgb * vI.rgb, .8), smoothstep(-.05, .25, nl) * step(0., vS.x) * (1. - opq));
  float bodyK = uBody * (1. + .4 * smoothstep(0., .3, nl)) * (1. - opq) * step(0., vS.x) * (1. - smoothstep(.86, .99, min(T.r, min(T.g, T.b))));
  vec3 Tb = T * (1. - bodyK);
#ifdef PASS_MULTIPLY
  T = mix(Tb, vec3(1.), f);       // far off a pane sinks into the haze: it never stands as a pale disc of haze before the plum band
  T = mix(T, vec3(1.), behindWheel(vW).a * .6);      // beyond the Wheel's glass it is a soft stain in the Wheel's own colour
  gl_FragColor = vec4(mix(vec3(1.), T, fade), 1.);
#else
  vec3 sun = uSunCol * vSunT;
  float tm = max(T.r, max(T.g, T.b));
  vec3 Tn = T * T / max(tm, .05);
  float milk = 1. - .6 * tm;
  // with the sun: milky sheen; against it: held-up sea glass
  vec3 lit = mix(vec3(.8), vI.rgb, .6) * milk * (sun * max(nl, 0.) * .06 + uSkyCol * .14);
  vec3 H = nrm(uSunDir + V);
  float nh = max(dot(N, H), 0.); float s4 = nh * nh; s4 *= s4; float s16 = s4 * s4; s16 *= s16;
  lit += sun * mix(vec3(1.), vI.rgb, .8) * step(0., nl) * s16 * s16 * s16 * s16 * .13 * (1. - vein);
  float eB = clamp((r - E0) / (E1 - E0), 0., 1.); float fr0 = (1. - nv) * (1. - nv) * (1. - nv);        // (paler toward the eye, deeper at the rim, the veins dark in it: glass, not card)
  // (the passes are order-independent, so the body light of every pane along a ray adds up: it is kept deep in the pane's own
  // colour and modest in the sun, so a file of sunlit panes seen end on stays rose, amber or green and never bleaches to white)
  lit += bodyK * mix(vI.rgb * vI.rgb, Tn, .5) * (sun * (max(nl, 0.) * .13 + .03) + uSkyCol * .66) * (1.16 - .4 * eB) * (1. - .6 * vein);
  // the fallen: wet glass that holds the sky, deep at the rim and pale toward the eye, with stretch ripples; the rim
  // stands proud of it, so its sunward side lays a crescent of shade on the glass and its far side catches the sun
  vec2 rdw = vW.xz - vCtr.xz; rdw /= max(length(rdw), 1e-3);
  vec2 sxz = uSunDir.xz / max(length(uSunDir.xz), 1e-3);
  float sunSide = dot(rdw, sxz), fallen = step(vS.x, 0.);
  float rwF = max(.05, aa * 1.7);
  float cres = fallen * smoothstep(1. - rwF - .15, 1. - rwF - .01, r) * smoothstep(-.1, .7, sunSide);
  float hemSh = fallen * (1. - smoothstep(.3, .4, r)) * smoothstep(-.1, .7, -sunSide);      // and the hub ring's shade, on the far side of the eye
  lit += fallen * vI.rgb * vI.rgb * (uSkyCol * .5 + sun * .04) * (1. - .6 * vein) * (1.45 - .75 * sqrt(eB)) * (.93 + .07 * sin(r * 70.)) * (1. - .55 * cres) * (1. - .4 * hemSh);
  lit += fallen * uSkyCol * .5 * fr0 * (1. - cres);      // the sky's sheen at a glancing angle
  float back = max(-nl, 0.);
  float fwd = max(dot(-V, uSunDir), 0.); float f2 = fwd * fwd; float f8 = f2 * f2 * f2 * f2;
  lit += Tn * sun * uMem.y * (sqrt(back) * .42 * step(nl, 0.) + f8 * .3) * (1. - .7 * f);
  float fr = 1. - nv; fr *= fr;
#ifdef FARRIM
  lit *= mix(vec3(1.), vI.rgb * 1.25, .7) * mix(mix(.16, .8, step(vS.x, 0.)), 1., smoothstep(.04, .4, nv));   // far slivers keep the hoop's own tint, and a hundred of them in line do not add up to white
  lit += uSkyCol * vI.rgb * .12 * fr * milk;
#else
  lit += uSkyCol * .25 * fr * milk;
#endif
#ifdef FLAT
  lit *= mix(1., mix(.5, .85, step(vS.x, 0.)), smoothstep(110., 480., dist));      // far panes are lanterns in their own tint, never froth: their light thins with distance
#endif
  vec3 horn = uHorn * .5 * (sun * (abs(nl) * .12 + .03) + uSkyCol * .75);
#ifdef FARRIM
  horn = mix(horn, vI.rgb * vI.rgb * (uSkyCol * .8 + sun * .09), .88);      // edge-on in the distance a hoop reads as its own colour
#endif
  horn = mix(horn, uHorn * .6 * (sun * (.22 + .4 * abs(nl)) * (1. - .7 * sunSide) + uSkyCol * (.9 - .25 * sunSide)), step(vS.x, 0.));     // the fallen lie in the sun: ivory rings, lit on the flank that faces it
  lit = mix(lit, horn, opq);
  vec3 o = lit * (1. - f);
  vec4 bw = behindWheel(vW);
  o *= 1.12 * mix(vec3(1.), bw.rgb * bw.rgb * .3, bw.a);
  gl_FragColor = vec4(o * fade, 1.);
#endif
}`,Rn=`
varying vec2 vP; varying vec4 vI; varying vec3 vS; varying vec3 vW; varying vec2 vQ;
${re}
${ct}
void main(){
  vQ = hoopSpin(position.xy);      // the disc as it stands: (0, -1) is its foot on the salt
  vec3 w = hoopXf(vec3(position.xy * iA.w, 0.));
  float hgt = max(w.y, 0.);
  w -= uSunDir * ((w.y - .06) / max(uSunDir.y, .03));
  vP = position.xy; vI = iC; vS = vec3(iB.w, hgt / max(iA.w, .1), iA.w); vW = w;
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
  if (iC.w <= 0.) gl_Position = vec4(2., 2., 2., 1.);
}`,Wn=`
varying vec2 vP; varying vec4 vI; varying vec3 vS; varying vec3 vW; varying vec2 vQ;
uniform vec3 uFloor;
uniform float uShadowK;
${re}
${Do}
void main(){
  float r = length(vP);
  float bare = step(1.5, vI.w);               // the standing ring and the tipped rims: no membrane left
  float fwr = max(fwidth(r), 1e-4);
  float soft = min(.012 * vS.y + .008, .034);     // the penumbra: crisp at the foot, soft at the far end
  float aa = min(fwr + soft, mix(10., .1, bare));      // (the bare ring's shadow keeps its edges at a grazing angle)
  if (r > 1.24 + aa) discard;
  // The shadow is the window it was thrown by. Its veins are drawn as leading: wide enough to outlast the penumbra
  // (wider toward the far end), blurred no further than they are wide, and let go only where the whole shadow has
  // thinned to a few pixels; the rim and the hem of the eye are dark lines round it, the eye a hole of bare sunlit salt.
  float aaV = min(fwr * .8 + soft * .35, .02);
  float vein;
  vec3 T = paneT2(vP, r, vI.rgb, vS.x, aaV, 1.5 + 40. * soft, .86 * (1. - smoothstep(.06, .22, fwr)), vein);
  vec3 Tt = vec3(1.);
  float keep = max(bare, step(vS.x, 0.) * .8);       // the shadows of the resting ground stay drawn from the air
  float aaR = min(aa, .016 + fwr);
  vec3 lead = vec3(0.);                         // the rim and the hem are horn: they pass nothing, and cast plain lilac
  Tt = mix(Tt, lead, smoothstep(.25 - aaR, .25 + aaR, r) * (1. - bare));
  Tt = mix(Tt, mix(T, vec3(1.), bare), smoothstep(.3 - aaR, .3 + aaR, r));
  float ri = mix(.94, .76, bare), ro = mix(1., 1.2, bare);
  Tt = mix(Tt, lead, smoothstep(ri - aaR, ri + aaR, r));
  Tt = mix(Tt, vec3(1.), smoothstep(ro - aa, ro + aa, r));
  // where the hoop stands on the salt its shadow begins: a small dark foot under the contact (plain lilac, the rim's own)
  float foot = exp(-(vQ.x * vQ.x * 60. + (vQ.y + 1.) * (vQ.y + 1.) * 9.)) * (1. - bare) * step(0., vS.x) * step(vS.y, .6);
  Tt = mix(Tt, vec3(0.), .85 * foot);
  // at a very low sun the light has come a long way through the salt in the air: a shadow keeps its depth for its first
  // two hoop widths and then fills, so the pan between the files stays light and the braid is of tints, not of darks
  float slide = vS.y * sqrt(max(1. - uSunDir.y * uSunDir.y, 0.)) / max(uSunDir.y, .03);      // radii from the source point to here
  Tt = mix(Tt, vec3(1.), .7 * (1. - exp(-slide / 6.)) * smoothstep(.3, .1, uSunDir.y) * (1. - bare));
  float dist = length(cameraPosition - vW);
  // a shadow whose footprint has thinned to a stripe on screen (seen at a grazing angle, or far off) loses contrast:
  // there they lie as a wash of tinted light, not as hard streaks
  float k = (1. - hazeAmt(dist)) * uShadowK * clamp(vI.w, 0., 1.) * (1. - .6 * smoothstep(.06, .32, fwr) * (1. - keep));
  // T goes into the shadow target (cleared to white, multiplied): the pan is then lit ONCE with sun * T + sky fill, so
  // piles of any depth floor at lilac-plum and two windows that cross mix to a third colour
  gl_FragColor = vec4(mix(vec3(1.), Tt, k), 1.);
}`,Bn=[[1.4,0],[.75,.42],[0,.62],[-.7,.5],[-1,.18],[-1,-.18],[-.7,-.5],[0,-.62],[.75,-.42]],Fn=[[1.4,0],[-1,.62],[-1,-.62]],Dn=[[-1.3,0],[0,.6],[1,0],[0,-.6]];function Po(h){const v=[],R=[],N=[],A=[];let u=0;for(const{segs:I,prof:M,rad:P,kind:Y}of h){const le=M.length,dt=u;for(let me=0;me<=I;me++){const Me=me/I*oe,L=Math.cos(Me),we=Math.sin(Me);for(let W=0;W<=le;W++){const qe=M[W%le],We=M[(W+le-1)%le],J=M[(W+1)%le];let ge=J[1]-We[1],Ae=-(J[0]-We[0]);const Ct=Math.hypot(ge,Ae)||1;ge/=Ct,Ae/=Ct,v.push(L*P,we*P,0),R.push(qe[0],qe[1],Y,Y?0:qe[0]/1.4),N.push(ge,Ae,Me)}}for(let me=0;me<I;me++)for(let Me=0;Me<le;Me++){const L=dt+me*(le+1)+Me,we=L+le+1;A.push(L,we,L+1,we,we+1,L+1)}u+=(I+1)*(le+1)}const g=new a.InstancedBufferGeometry;return g.setAttribute("position",new a.Float32BufferAttribute(v,3)),g.setAttribute("aOff",new a.Float32BufferAttribute(R,4)),g.setAttribute("aNrm",new a.Float32BufferAttribute(N,3)),g.setIndex(A),g}function Pn(h,v,R,N){const A=[],u=[];for(let I=0;I<=v;I++)for(let M=0;M<=h;M++){const P=M/h*oe,Y=b(R,N,I/v);A.push(Math.cos(P)*Y,Math.sin(P)*Y,0)}for(let I=0;I<v;I++)for(let M=0;M<h;M++){const P=I*(h+1)+M,Y=P+h+1;u.push(P,P+1,Y,Y,P+1,Y+1)}const g=new a.InstancedBufferGeometry;return g.setAttribute("position",new a.Float32BufferAttribute(A,3)),g.setIndex(u),g}function At(h){const v=new a.InstancedBufferGeometry;return v.setAttribute("position",new a.Float32BufferAttribute([-h,-h,0,h,-h,0,h,h,0,-h,h,0],3)),v.setIndex([0,1,2,0,2,3]),v}function Qt(h){const v=new a.InstancedBufferAttribute(new Float32Array(h*4),4),R=new a.InstancedBufferAttribute(new Float32Array(h*4),4),N=new a.InstancedBufferAttribute(new Float32Array(h*4),4);for(const u of[v,R,N])u.setUsage(a.DynamicDrawUsage);const A={cap:h,n:0,a:v,b:R,c:N,geos:[],attach(u){return u.setAttribute("iA",v),u.setAttribute("iB",R),u.setAttribute("iC",N),u.instanceCount=0,A.geos.push(u),u},push(u,g,I,M,P,Y,le,dt,me,Me,L,we){if(A.n>=h)return!1;const W=A.n++*4,qe=v.array,We=R.array,J=N.array;return qe[W]=u,qe[W+1]=g,qe[W+2]=I,qe[W+3]=M,We[W]=P,We[W+1]=Y,We[W+2]=le,We[W+3]=dt,J[W]=me,J[W+1]=Me,J[W+2]=L,J[W+3]=we,!0},flush(){for(const u of[v,R,N])u.clearUpdateRanges(),u.addUpdateRange(0,Math.max(A.n,1)*4),u.needsUpdate=!0;for(const u of A.geos)u.instanceCount=A.n}};return A}function Aa(h,v){const R=h.length,N=[],A=new Array(R);for(let u=0;u<R-1;u++)N.push((v[u+1]-v[u])/Math.max(h[u+1]-h[u],1e-6));A[0]=N[0],A[R-1]=N[R-2];for(let u=1;u<R-1;u++)A[u]=N[u-1]*N[u]<=0?0:2*N[u-1]*N[u]/(N[u-1]+N[u]);return u=>{if(u<=h[0])return v[0]+A[0]*(u-h[0]);if(u>=h[R-1])return v[R-1]+A[R-1]*(u-h[R-1]);let g=0;for(;u>h[g+1];)g++;const I=h[g+1]-h[g],M=(u-h[g])/I,P=M*M,Y=P*M;return(2*Y-3*P+1)*v[g]+(Y-2*P+M)*I*A[g]+(-2*Y+3*P)*v[g+1]+(Y-P)*I*A[g+1]}}const Q=(h,v=1)=>new a.Color(h).multiplyScalar(v),qn={golden:{el:16,sun:Q("#FFEFD8",3),sky:Q("#B9B3E6",.36),zenith:"#7C78D2",horizon:"#D6BFD0",plum:"#54458A",fogA:"#8478B8",fogB:"#DDA98E",cirrus:"#F6E4DC",disc:9,glow:.5,stars:0,exposure:1,fogK:88e-5},dawn:{el:7,sun:Q("#FFCBA2",6.4),sky:Q("#B7A9DE",.34),zenith:"#8E8FD0",horizon:"#F0C3B0",plum:"#62508E",fogA:"#B8A6CE",fogB:"#FFC49A",cirrus:"#FFCDB4",disc:9,glow:.65,stars:0,exposure:1,fogK:.00105},high:{el:48,sun:Q("#FFF6E6",1.3),sky:Q("#AEB4EE",.36),zenith:"#7C84DA",horizon:"#CFCBE6",plum:"#6657A0",fogA:"#B3B1DE",fogB:"#D8C4B4",cirrus:"#FFFFFF",disc:10,glow:.4,stars:0,exposure:.96,fogK:75e-5},night:{el:31,sun:Q("#D6DEFF",.95),sky:Q("#6670C0",.26),zenith:"#10143A",horizon:"#39407C",plum:"#171338",fogA:"#2A2E62",fogB:"#4A548E",cirrus:"#7F8AC8",disc:5,glow:.3,stars:1,exposure:1.25,fogK:8e-4}},Nn={glass:{name:"Hoopwind",tints:[[.96,.58,.67],[.97,.74,.36],[.4,.82,.74]],horn:"#E8DCC0",amber:"#F5B24A",holes:0,wheel:["#C9C0AE","#B9B3E6","#F28FA6","#F5B24A","#58C7B0","#E8DCC0","#5B4C8C"]},cobalt:{name:"Hoopwind, Blue Herd",tints:[[.36,.52,.97],[.7,.5,.95],[.84,.95,.62]],horn:"#E2C47A",amber:"#F0B63C",holes:0,wheel:["#C9C0AE","#B9B3E6","#B78CF2","#D9EE9A","#5C86F5","#E2C47A","#3B2F7C"]},autumn:{name:"Hoopwind in Autumn",tints:[[.96,.78,.38],[.86,.46,.3],[.66,.64,.7]],horn:"#D9C9A8",amber:"#E09A3A",holes:1,wheel:["#C9C0AE","#B9B3E6","#D9744C","#F2C45A","#A9A3B4","#D9C9A8","#5B3F4C"]}};var On={id:"hoopwind-flats",name:"Hoopwind",category:"alien",weirdness:.65,media:["air","open"],async build(h){const v=h.rng,R=h.vary||{},N=h.quality||{detail:1},A=50,u=Math.min(1,Math.max(.5,N.detail??1)),g=new a.Scene,I=v.fork?v.fork("look"):v;let M={dawn:"dawn",day:"high",golden:"golden",night:"night"}[R.hour];if(M)I();else{const e=I();M=e<.46?"golden":e<.66?"dawn":e<.86?"high":"night"}const P=!!R.rare,Y=I(),le=P||Y<.5?"clear":Y<.76?"gale":"rain",dt=I(),me=dt<.5?"glass":dt<.76?"cobalt":"autumn",Me=I()<.3,L=qn[M],we=Nn[me],W=le==="gale"?1:0,qe=le==="rain"?1:0,We=L.el*E,J=new a.Vector3(.182*Math.cos(We),Math.sin(We),-.983*Math.cos(We)).normalize(),ge=L.sun.clone(),Ae=L.sky.clone(),Ct=new a.Vector3(Ae.r/(ge.r*J.y+Ae.r),Ae.g/(ge.g*J.y+Ae.g),Ae.b/(ge.b*J.y+Ae.b)),qo=Q(L.fogA),No=Q(L.fogB),_={uSunDir:{value:J},uSunCol:{value:ge},uSkyCol:{value:Ae},uFogA:{value:qo},uFogB:{value:No},uFogK:{value:L.fogK*(1+.35*W)},uTime:{value:0},uPix:{value:.002},uWheelA:{value:new a.Vector4(0,110,0,1)},uWheelB:{value:new a.Vector4(0,110,0,0)},uWheelNA:{value:new a.Vector3(0,0,1)},uWheelNB:{value:new a.Vector3(0,0,1)},uWTintA:{value:new a.Matrix3},uWTintB:{value:new a.Matrix3},uWBand:{value:new a.Vector2(52,76)},uMem:{value:new a.Vector4(1.9,.36,we.holes,1+W)},uHorn:{value:Q(we.horn)},uAmber:{value:Q(we.amber)},uPlum:{value:Q("#5B4C8C")},uRose:{value:Q("#F28FA6")},uSalt:{value:Q("#C6B596")},uThick:{value:new a.Vector2(1,0)},uFloor:{value:Ct},uShadowK:{value:1},uBody:{value:.52},uGust:{value:0},uFrontA:{value:new a.Vector4(-1,0,-1e5,0)}},En=_.uFogK.value;g.fog=new a.FogExp2(qo.clone().lerp(No,.3),_.uFogK.value);const Tt={..._,uZenith:{value:Q(L.zenith)},uHorizon:{value:Q(L.horizon)},uPlum:{value:Q(L.plum)},uCirrus:{value:Q(L.cirrus)},uDiscCol:{value:ge.clone().multiplyScalar(1/Math.max(ge.r,ge.g,ge.b))},uPlumDir:{value:new a.Vector2(-.94,-.34)},uWind:{value:new a.Vector2(-.94,-.34)},uDisc:{value:new a.Vector4(Math.cos((M==="night"?1.5:.75)*E),L.disc,L.glow,L.stars)}},Yt=new a.Mesh(new a.IcosahedronGeometry(1,3),new a.ShaderMaterial({uniforms:Tt,vertexShader:bn,fragmentShader:kn,side:a.BackSide,depthWrite:!1,depthTest:!0}));Yt.frustumCulled=!1,Yt.renderOrder=-1,g.add(Yt),await h.yield();const Le={..._,uZenith:Tt.uZenith,uHorizon:Tt.uHorizon,uPlumCol:Tt.uPlum,uBrine:{value:new a.Vector3(.62,.5,.52)},uGale:{value:new a.Vector4(.5+.5*W,qe,-1e5,0)},uBankK:{value:1},uRest:{value:new a.Vector4(0,0,1,0)},uWindDir:{value:new a.Vector2(-1,0)},uRing:{value:new a.Vector4(0,0,-1,0)},uRoadPh:{value:0},uPortalCol:{value:new a.Color(M==="night"?"#bfe6ff":"#a8f5dc").multiplyScalar(M==="night"?.5:1)}},Jt=new a.WebGLRenderTarget(960,540,{depthBuffer:!1,stencilBuffer:!1,type:a.UnsignedByteType,format:a.RGBAFormat,minFilter:a.LinearFilter,magFilter:a.LinearFilter,generateMipmaps:!1});Le.tShadow={value:Jt.texture};const Rt=new a.Mesh(new a.PlaneGeometry(9e3,9e3,1,1).rotateX(-Math.PI/2),new a.ShaderMaterial({uniforms:Le,vertexShader:zn,fragmentShader:Sn}));Rt.frustumCulled=!1,g.add(Rt);const Eo=new a.Color,Ca=new a.Color(1,1,1);let eo=!1;Rt.onBeforeRender=(e,t,o)=>{if(eo)return;eo=!0;const n=e.getRenderTarget(),s=o.layers.mask,r=e.autoClear,l=e.getClearAlpha();e.getClearColor(Eo),o.layers.mask=2,e.setRenderTarget(Jt),e.setClearColor(Ca,1),e.autoClear=!1,e.clear(!0,!1,!1);try{e.render(t,o)}finally{o.layers.mask=s,e.autoClear=r,e.setClearColor(Eo,l),e.setRenderTarget(n),o.viewport!==void 0&&e.state.viewport(o.viewport),eo=!1}},await h.yield();const Io={sunDir:J,sunColor:ge.clone().multiplyScalar(.6),skyColor:Ae,groundColor:Q("#C9C0AE",.3).multiply(ge).multiplyScalar(.5)},j=await ba(h,{palette:we.wheel,detail:u,density:2.3,glow:.58,drum:1+.6*W,shadowTarget:!0});j.shadowMesh&&j.shadowMesh.layers.set(1),j.setLight(Io),g.add(j.object),await h.yield();let ae=null;const st=190/220,Ne=-80;P&&(ae=await ba(h,{palette:["#C9C0AE","#B9B3E6","#B58CF0","#8F7BE8","#F2A8D8","#E8DCC0","#4B3C8C"],detail:Math.min(u,.8),density:2,glow:.3,pickers:120,terrace:2.8,shadowTarget:!0}),ae.shadowMesh&&ae.shadowMesh.layers.set(1),ae.setLight(Io),ae.object.scale.setScalar(st),g.add(ae.object),await h.yield());const _o=(e,t)=>{const o=t.tints;e.set(o.green.x,o.amber.x,o.rose.x,o.green.y,o.amber.y,o.rose.y,o.green.z,o.amber.z,o.rose.z)};_o(_.uWTintA.value,j.anchors.bands),_.uWBand.value.set(j.anchors.bands.greenToAmber,j.anchors.bands.amberToRose),ae&&_o(_.uWTintB.value,ae.anchors.bands);const to=7*E,Vo=Math.tan(to),Ta=Math.cos(to),Ra=Math.sin(to),In=(e,t,o)=>[e,t-o*Ra,t*Vo+o*Ta],Ee=[[[230,54,330],.43],[[160,47,262],.43],[[98,41,244],.43],[[100,27,150],.45],[[78,11.5,52],.47],[[62,8.5,22],.5],[[34,8.4,14.6],.55],[[19,8.6,13.8],.55],[[6,9.4,13.6],.55],[[12,25,25],.58],[[28,59,50],.58],[[43,92,78],.58],[[54,107,96],.58],[[62,120,124],.56],[[66,130,136.4],.5],[[51,123,105.4],.44],[[36,116,74.4],.42],[[21,109,43.4],.42],[[6,102,12.4],.42],[[-6,96,-12],.42]],Wa=8,Ba=Ee.length-1,Fa=14,Da=190,Ho=6,ft=[];let Go=0;for(let e=0;e<Ee.length;e++){if(e>0){const t=Ee[e-1][0],o=Ee[e][0],n=Ee[e][1],s=t[0]-o[0],r=(o[1]-t[1])**2+(o[2]-t[2])**2,l=1-n*n,i=-2*n*s,f=-(s*s+r),p=(-i+Math.sqrt(Math.max(i*i-4*l*f,0)))/(2*l);Go-=n*p}ft.push(Go)}const Wt=ft[Ho],Pa=.45,Ze=[],Be=[],Qe=new a.Vector3(-Math.cos(30*E),0,-Math.sin(30*E)),oo=new a.Vector3(Ee[0][0][0]+ft[0]-Wt,Ee[0][0][1],Ee[0][0][2]);for(const[e,t,o]of[[637.5,6,-16],[572.5,6,-43],[487.5,6,-69],[397.5,7,-82],[327.5,7.5,-78],[247.5,11,-68],[168,43,-52],[92,62,-30],[36,60,-10]])Ze.push(new a.Vector3(oo.x-Qe.x*e-.5*o,t,oo.z-Qe.z*e+.866*o)),Be.push(ft[0]-Wt+Pa*e*1.035);for(let e=0;e<Ee.length;e++){const t=Ee[e][0];Ze.push(new a.Vector3(t[0]+ft[e]-Wt,t[1],t[2])),Be.push(ft[e]-Wt)}{const e=Ze[Ze.length-1].clone();let t=Be[Be.length-1];const o=P?[-4,-7,-27,-26,-13,-5,-1.5,0]:[-9,-20,-27,-18,-6,-2.5,-1,0],n=[[40,48],[50,51],[60,54],[60,55.5],[60,55],[50,52],[40,49],[36,47.5]].map((s,r)=>[s[0],s[1],o[r]]);for(let s=0;s<3;s++)n.push([Da/3,46,0]);for(const[s,r,l]of n){const i=r*E;e.x-=Math.cos(i)*s,e.z-=Math.sin(i)*s,e.y+=l,t-=.44*Math.hypot(s,l),Ze.push(e.clone()),Be.push(t)}}await h.yield();const C=yn(Ze,{samples:480});await h.yield();const Lo=Ze.map((e,t)=>{const o=C.curve.getLengths(),n=o.length-1,s=t/(Ze.length-1),r=Math.min(n,Math.round(s*n));return o[r]}),ao=Aa(Lo,Be),Ie=e=>ao(Ge(e)*C.length),qa=(Be[0]-Be[Be.length-1])/C.length,Na=e=>{const t=Ge(e)*C.length,o=6;return Math.min(1.6,Math.max(.6,qa*2*o/Math.max(ao(t-o)-ao(t+o),.001)))},xt=e=>Lo[e]/C.length,Ea=xt(9+Ho),Ke=xt(9+Ba),ut=xt(9+Fa),Bt=xt(9+Wa),Ia=xt(9),k=C.end.clone(),V=C.endTangent.clone().setY(0).normalize();await h.yield();const Ce=700,Ko=new Float32Array(Ce+1),no=new Float32Array(Ce+1),_e=new Float32Array(Ce+1),Oo=new Float32Array(Ce+1);{const e=new a.Vector3;for(let t=0;t<=Ce;t++)C.pointAt(t/Ce,e),Ko[t]=e.x,no[t]=e.y,_e[t]=e.z,Oo[t]=e.x-Ie(t/Ce)}const jo=Math.ceil(Ia*Ce),Uo=Math.floor(Ke*Ce),Fe=5,yt=100,$o=async(e,t,o)=>{let n=1e9,s=-1e9,r=1e9,l=-1e9;for(let c=0;c<=Ce;c++)t(c)&&(n=Math.min(n,e[c]),s=Math.max(s,e[c]),r=Math.min(r,_e[c]),l=Math.max(l,_e[c]));const i=n-yt-Fe,f=r-yt-Fe,p=Math.ceil((s-n+2*yt)/Fe)+3,m=Math.ceil((l-r+2*yt)/Fe)+3,y=new Int16Array(p*m).fill(-1),w=new Float32Array(p*m).fill(1e9);for(let c=0;c<=Ce;c++){if((c&7)===0&&await h.yield(),!t(c)||no[c]>62)continue;const U=Math.round((e[c]-i)/Fe),B=Math.round((_e[c]-f)/Fe),x=Math.ceil(yt/Fe);for(let F=-x;F<=x;F++)for(let K=-x;K<=x;K++){const $=U+K,ne=B+F;if($<0||ne<0||$>=p||ne>=m)continue;const se=i+$*Fe-e[c],ke=f+ne*Fe-_e[c],H=se*se+ke*ke,te=ne*p+$;H<w[te]&&(w[te]=H,y[te]=c)}}const z=(c,U)=>{const B=Math.round((c-i)/Fe),x=Math.round((U-f)/Fe);return B<0||x<0||B>=p||x>=m?-1:y[x*p+B]};return{push:(c,U,B,x,F)=>{let K=c,$=U,ne=!1,se=-100;for(let ke=0;ke<3;ke++){const H=z(K,$);if(H<0||Math.abs(H-se)<=8)break;se=H;const te=O(B*2+40,B*2+9,no[H]);if(te<=0)break;let T=e[H],X=_e[H],ve=1,ze=0,Se=1e18;for(let D=Math.max(H-2,0);D<Math.min(H+2,Ce);D++){if(!t(D)||!t(D+1))continue;const ce=e[D+1]-e[D],Re=_e[D+1]-_e[D],ht=Ge(((K-e[D])*ce+($-_e[D])*Re)/Math.max(ce*ce+Re*Re,1e-6)),Xe=e[D]+ce*ht,de=_e[D]+Re*ht,pe=(K-Xe)*(K-Xe)+($-de)*($-de);pe<Se&&(Se=pe,T=Xe,X=de,ve=ce,ze=Re)}Se>1e17&&(Se=(K-T)*(K-T)+($-X)*($-X));const d=Math.sqrt(Se),G=Math.min(60,(x?27:40)+B*1.6);if(d>=(ke?G-.01:G*1.6))break;let Z=K-T,ie=$-X;if(d>.3)Z/=d,ie/=d;else{const D=Math.hypot(ve,ze)||1,ce=F>.5?1:-1;Z=-ze/D*ce,ie=ve/D*ce}if(o&&ie<0&&U>1.5&&X<40&&Math.abs(ve)>Math.abs(ze)){const D=Math.hypot(ve,ze)||1,ce=ve<0?-1:1;Z=-ze/D*ce,ie=ve/D*ce}const He=ke?G:G+d*.375;K=b(K,T+Z*He,te),$=b($,X+ie*He,te),ne=!0}return vt.x=K,vt.z=$,ne},at:z}},vt={x:0,z:0},Xo=await $o(Ko,e=>e<jo||e>Uo),Zo=await $o(Oo,e=>e>=jo&&e<=Uo,!0);await h.yield();const fe=700,bt=fe*30*E,Ye=190,Oe=oo.x-110,Ft=Oe+fe*Math.sin(30*E),Dt=Ye+fe*(1-Math.cos(30*E)),q={x:0,z:0,h:Math.PI,k:0},_a=(e,t)=>{if(e>=0)q.x=Oe-e,q.z=Ye+t,q.h=Math.PI,q.k=0;else if(e>-bt){const o=-e/fe,n=fe-t;q.x=Oe+n*Math.sin(o),q.z=Ye+fe-n*Math.cos(o),q.h=Math.PI+o,q.k=1/fe}else{const o=-bt-e;q.x=Ft-Qe.x*o-.5*t,q.z=Dt-Qe.z*o+.866*t,q.h=Math.PI+30*E,q.k=0}return q},so=(e,t)=>{const o=e-Oe,n=t-(Ye+fe),s=Math.atan2(o,-n);return s<=0||n>0?Oe-e:s<30*E?-fe*s:-bt+(e-Ft)*Qe.x+(t-Dt)*Qe.z},Va=(e,t)=>{const o=e-Oe,n=t-(Ye+fe),s=Math.atan2(o,-n);return s<=0||n>0?t-Ye:s<30*E?fe-Math.hypot(o,n):(e-Ft)*-.5+(t-Dt)*.866},kt={transparent:!0,depthWrite:!1,side:a.DoubleSide,blending:a.CustomBlending,blendEquation:a.AddEquation,blendSrc:a.ZeroFactor,blendDst:a.SrcColorFactor,blendSrcAlpha:a.ZeroFactor,blendDstAlpha:a.OneFactor},io={...kt,blendEquation:a.MaxEquation,blendSrc:a.OneFactor,blendDst:a.OneFactor},Qo=new a.ShaderMaterial({uniforms:_,vertexShader:za,fragmentShader:Ma,side:a.DoubleSide}),pt=(e,t)=>new a.ShaderMaterial({uniforms:_,vertexShader:Mn,fragmentShader:Tn,defines:e,...t}),Yo=new a.ShaderMaterial({uniforms:_,vertexShader:Rn,fragmentShader:Wn,...kt,depthTest:!1}),ro=Math.round(2900*u*b(.82,1.12,Ge(((R.density??1)-.7)/.6))*(P?.85:1)),Ha=96,Ga=Math.round((P?300:460)*u),xe=Qt(Ha),je=Qt(Ga),it=Qt(ro+620),Jo=new a.Group;g.add(Jo);const ye=(e,t,o)=>{const n=new a.Mesh(e,t);return n.frustumCulled=!1,n.renderOrder=o,Jo.add(n),n},La=xe.attach(Po([{segs:56,prof:Bn,rad:.972,kind:0},{segs:28,prof:Dn,rad:.277,kind:1}])),Ka=je.attach(Po([{segs:22,prof:Fn,rad:.972,kind:0}]));ye(La,Qo,0),ye(Ka,Qo,0),await h.yield();const ea=xe.attach(Pn(40,3,.285,.972)),lo=je.attach(At(1)),ho=it.attach(At(1));ye(ea,pt({PASS_MULTIPLY:1},kt),3.2),ye(ea,pt({},io),3.4),ye(lo,pt({PASS_MULTIPLY:1,FLAT:1},kt),2),ye(lo,pt({FLAT:1},io),3),ye(ho,pt({PASS_MULTIPLY:1,FLAT:1,FARRIM:1},kt),2),ye(ho,pt({FLAT:1,FARRIM:1},io),3);for(const e of[xe,je,it])ye(e.attach(At(1.06)),Yo,1).layers.set(1);await h.yield();const he=v.fork?v.fork("herd"):v,mt=1700,co=-250,Oa=285,fo=M==="night"?.4:0,rt=(e,t)=>{const o=we.tints[e];return[b(Ge(o[0]+t*.05),1,fo),b(Ge(o[1]-t*.04),1,fo),b(Ge(o[2]+t*.03),1,fo)]},wt=[],ta=[],ja=Aa([-250,-215,-192,-150,-112,-60,0,40,215,250,285],[40,40,13,13,30,20,12,9.5,9.5,30,40]),oa=Math.round((Oa-co)/9)+1,Ua=mt*oa/ro;for(let e=0,t=0;e<oa&&t<ro+200;e++){await h.yield();const o=co+9*e+he.range(-1.6,1.6),n=he.range(24,27.5);ta.push(o);let s=he()*30,r=0,l=0;for(let i=0;i<400;i++,t++){const f=he()<(Me?.62:.12),p=he(),m=he()<.45,y=f?he.range(3,4.2):m?4.5+35.5*p*p*p:4.5+9*p,w=y/2,z=Math.max(4,Ua-13)*(.25+1.5*he()*he()*2);if(s+=f?z*.5:r+w+z,s>mt-l-w-6)break;f||(r=w,l||(l=w));const S=ja(o),c=(f?y:m?4.5+(y-4.5)*(S-4.5)/35.5:4.5+(y-4.5)*Math.min(1,(S-4.5)/9))/2,U=e+i,B=rt(i%5===4?he.int(0,2):U%3,he.range(-1,1)),x=f?.35:0;wt.push({R:c,l:o+(f?4.5:he.range(-.7,.7)),s0:s,v:f?he.range(32,35):n,juv:f,seed:he(),ph:he()*oe,lean0:he.range(8,14)*E,tr:b(B[0],1,x),tg:b(B[1],1,x),tb:b(B[2],1,x)})}}await h.yield();const De=v.fork?v.fork("rest"):v,_n=new a.Vector3,Vn=new a.Vector3,Ve=new a.Vector3(V.z,0,-V.x);Le.uRest.value.set(k.x-V.x*240,k.z-V.z*240,820,1),Le.uRing.value.set(k.x,k.z,V.x,V.z);const $a=Math.round(300*u),zt=9,uo=.5,aa=Math.atan2(-V.z,-V.x),Pt=[],vo=aa-uo*Math.log(150);Le.uRoadPh.value=vo;const na=[],sa=[],po=19,qt=24,ia=60*E,mo=Math.atan2(V.z,V.x),ra=[{x:k.x,z:k.z,r:po*1.16}];for(const e of[1,-1]){const t=mo+35*E*e,o=Math.sin(ia*e),n=k.x+Ve.x*38*e-V.x*4,s=k.z+Ve.z*38*e-V.z*4;ra.push({x:n+qt*o*Math.sin(t),z:s-qt*o*Math.cos(t),r:qt*1.1})}const Ue=v.fork?v.fork("way"):v,Je=v.fork?v.fork("river"):v,et=v.fork?v.fork("escort"):v,be=v.fork?v.fork("fallen"):v;for(let e=-3;e<=2;e++)for(let t=0;t<2;t++){const o=Ue.range(0,1),n=Ue.int(0,1);for(let s=0;s<16;s++){const r=62*Math.pow(1.15,s+o+.5*t),l=r*oe/zt*.894,i=(t?1:-1)*Ue.range(.17,.3),f=(s+n)%2===0,p=Ue.int(0,2),m=Ue(),y=Ue.range(12,18),w=Ue(),z=Ue.range(-Math.PI,Math.PI),S=Ue();sa.push({r,laneW:l,ang:(e+i)*oe/zt+uo*Math.log(r)+vo,big:f,tk:p,ph:m,per:y,sz:w,h0:z,sd:S})}}await h.yield();for(let e=0;e<2;e++)for(const t of sa){const{r:o,laneW:n,big:s,tk:r,ph:l,per:i,sz:f,h0:p,sd:m}=t;if(s!==(e===0))continue;const y=k.x+Math.cos(t.ang)*o,w=k.z+Math.sin(t.ang)*o,z=(y-k.x)*V.x+(w-k.z)*V.z,S=(y-k.x)*Ve.x+(w-k.z)*Ve.z,c=s?Math.min(24+20*f,Math.max(16,n*.62)):Math.min(14+9*f,Math.max(9,n*.42)),U=C.nearestXZ(y,w);if(U.dist>150||o>760||Math.abs(S)<82&&z>-44&&z<56||w>-42||P&&Math.abs(w-Ne)<c/2+12||s&&ra.some(F=>Math.hypot(y-F.x,w-F.z)<F.r+c+6)||(s?U.dist<c*.5+15&&U.y<c+16||Math.abs(S)<c*.5+22&&z>-430&&z<0:U.dist<c*.5+5)||Pt.some(F=>Math.hypot(y-F.x,w-F.z)<(F.R+c*.5)*(F.elder&&s?1.7:F.elder||s?1.25:1.15)+3))continue;const B=rt(me==="autumn"?r%2:r,0),x=s?{rest:!0,spin:!0,elder:!0,R:c/2,x:y,z:w,h0:p,seed:m,ph:l,period:i,prec:13,tr:B[0],tg:B[1],tb:B[2]}:{rest:!0,spin:!1,R:c/2,x:y,z:w,h0:-1.18+.4*p,seed:m,ph:l*40,period:i,tr:b(B[0],.96,.8),tg:b(B[1],.5,.8),tb:b(B[2],.6,.8)};s&&na.push(x),wt.push(x),Pt.push(x)}await h.yield();for(let e=0,t=0;e<$a&&t<8e4;t++){(t&7)===0&&await h.yield();const o=e%10<7,n=o?58+560*Math.pow(be(),.85):60+430*be()*be(),s=o?be.range(-.95,.95):be.range(.95,oe-.95),r=uo*Math.log(n)+vo,l=n*oe/zt*.894,f=(Math.round((aa+s-r)/oe*zt)+be.range(-.2,.2))*oe/zt+r,p=k.x+Math.cos(f)*n,m=k.z+Math.sin(f)*n,y=(p-k.x)*V.x+(m-k.z)*V.z,w=(p-k.x)*Ve.x+(m-k.z)*Ve.z,z=Math.min(11+25*Math.pow(be(),1.3),Math.max(9,l*.5)),S=be(),c=be.int(0,4),U=be.range(-1,1),B=be()*40,x=be(),F=be.range(8,13),K=be.range(-1,1),$=C.nearestXZ(p,m);if($.dist<z*.5+11&&$.y<z+14||Math.abs(w)<82&&y>-44&&y<56||m>-42||P&&Math.abs(m-Ne)<z*.5+9||na.some(T=>Math.hypot(p-T.x,m-T.z)<T.R*2.1+z*.5+6)||Pt.some(T=>Math.hypot(p-T.x,m-T.z)<(T.R+z*.5)*1.15))continue;const ne=Math.abs(w)<46&&y>-430,se=e%8===0&&!(Math.abs(w)<85&&y>-380),ke=!se&&!ne&&S<.62,H=rt(me==="autumn"?[0,1,2,0,1][c]:c%3,U),te={rest:!0,spin:se,R:z/2,x:p,z:m,h0:se?K*Math.PI:-1.18+.25*K,seed:x,ph:B,period:F,tr:H[0],tg:H[1],tb:H[2]};ke?te.prop=(48+18*S/.62)*E:se||(te.tr=b(H[0],.96,.8),te.tg=b(H[1],.5,.8),te.tb=b(H[2],.6,.8)),wt.push(te),Pt.push(te),e++}await h.yield();const St=Qt(3),Xa=[[1.3,0],[1,.5],[.35,.82],[-.4,.8],[-.95,.4],[-.95,-.4],[-.4,-.8],[.35,-.82],[1,-.5]],Za=St.attach(Po([{segs:220,prof:Xa,rad:.972,kind:0}])),Qa=new a.ShaderMaterial({uniforms:{..._,uThick:{value:new a.Vector2(8.17,3.4)}},vertexShader:za,fragmentShader:Ma,side:a.DoubleSide});ye(Za,Qa,0);const Ya=Math.atan2(V.x,-V.z);St.push(k.x,k.z,Ya,po,.4,0,k.y-po,.37,1,1,1,2);for(const e of[1,-1]){const t=k.x+Ve.x*38*e-V.x*4,o=k.z+Ve.z*38*e-V.z*4;St.push(t,o,mo+35*E*e,qt,1.3*e,ia*e,-8.5,.61+.2*e,.75,1,1,2)}ye(St.attach(At(1.3)),Yo,1).layers.set(1),St.flush(),await h.yield();const wo=new a.Mesh(new a.PlaneGeometry(2,2),new a.ShaderMaterial({uniforms:{..._,uPortalCol:Le.uPortalCol,uC:{value:new a.Vector3(k.x+V.x*5,k.y+1,k.z+V.z*5)}},transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,vertexShader:`
        uniform vec3 uC; varying vec2 vC; varying float vK;
        void main(){
          float d = length(cameraPosition - uC);
          vec4 mv = viewMatrix * vec4(uC, 1.);
          mv.xy += position.xy * (mix(31., 74., smoothstep(30., 110., d)) + d * .13);
          vC = position.xy; vK = (.35 + .65 * smoothstep(40., 190., d)) * (1. - smoothstep(850., 1250., d));
          gl_Position = projectionMatrix * mv;
        }`,fragmentShader:`
        uniform vec3 uPortalCol; uniform float uTime; varying vec2 vC; varying float vK;
        void main(){
          float r2 = dot(vC, vC); if (r2 > 1.) discard;
          float fall = (1. - r2) * (1. - r2);
          float a = (exp(-r2 * 32.) * 1.25 + exp(-r2 * 7.) * .5 + .14 * fall) * fall * vK * (.93 + .07 * sin(uTime * 1.3));
          a += exp(-vC.y * vC.y * 300.) * exp(-vC.x * vC.x * 3.5) * .2 * fall * vK;      // a faint level streak, like light on haze
          gl_FragColor = vec4(uPortalCol * a, 1.);
        }`}));wo.frustumCulled=!1,wo.renderOrder=6,g.add(wo);const Ja=new a.ShaderMaterial({uniforms:_,vertexShader:`
      varying vec3 vW, vN;
      void main(){
        mat4 m = modelMatrix;
        #ifdef USE_INSTANCING
        m = modelMatrix * instanceMatrix;
        #endif
        vec4 w = m * vec4(position, 1.); vW = w.xyz;
        vec3 sc = vec3(length(m[0].xyz), length(m[1].xyz), length(m[2].xyz));      // (the mounds are flattened domes: normals take the inverse scale)
        vN = normalize(mat3(m) * (normal / max(sc * sc, vec3(1e-4))) + vec3(0., 1e-4, 0.)); gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:`
      varying vec3 vW, vN; uniform vec3 uSalt;
      ${re}
      void main(){
        vec3 V = cameraPosition - vW; float dist = length(V); V /= max(dist, 1e-4);
        vec3 N = nrm(vN + vec3(vnoise(vW.xz * 3.) - .5, 0., vnoise(vW.zx * 3. + 7.) - .5) * .3);
        vec3 col = uSalt * (.9 + .12 * vnoise(vW.xz * 11.)) * (uSunCol * max(dot(N, uSunDir) * .55 + .45, 0.) + uSkyCol * (.9 + .3 * N.y));      // drifted salt: the low sun wraps round it, lilac in its own shade
        gl_FragColor = vec4(mix(col, hazeCol(-V), hazeAmt(dist)), 1.);
      }`}),en=new a.SphereGeometry(1,20,8,0,oe,0,Math.PI/2),go=new a.InstancedMesh(en,Ja,3);go.frustumCulled=!1;{const e=new a.Matrix4,t=new a.Quaternion().setFromAxisAngle(new a.Vector3(0,1,0),-mo),o=new a.Vector3,n=(s,r,l,i,f,p)=>e.compose(new a.Vector3(k.x+Ve.x*r+V.x*l,-.05,k.z+Ve.z*r+V.z*l),t,o.set(i,f,p))&&go.setMatrixAt(s,e);n(0,0,.6,9,3.4,29),n(1,44,-1,18,4.6,18),n(2,-44,-1,18,4.6,18)}g.add(go),await h.yield();const tn=`
      varying vec2 vC; varying vec4 vCol; varying float vDist; varying vec3 vDir;
      ${re}
      void main(){
        float r2 = dot(vC, vC); if (r2 > 1.) discard;
        float a = vCol.a * (1. - r2) * (1. - r2);
        vec3 col = mix(vCol.rgb, hazeCol(vDir), hazeAmt(vDist));
        gl_FragColor = vec4(col * a, a);
      }`,Nt={transparent:!0,depthWrite:!1,blending:a.CustomBlending,blendEquation:a.AddEquation,blendSrc:a.OneFactor,blendDst:a.OneMinusSrcAlphaFactor,blendSrcAlpha:a.OneFactor,blendDstAlpha:a.OneMinusSrcAlphaFactor},la=new a.ShaderMaterial({uniforms:_,...Nt,fragmentShader:tn,vertexShader:`
      attribute vec3 aSeed;
      varying vec2 vC; varying vec4 vCol; varying float vDist; varying vec3 vDir;
      uniform vec3 uSalt; uniform vec4 uFrontA;
      ${re}
      ${ct}
      void main(){
        // the gust is where the front is: a plume stands at the foot of each hoop as the front passes it, and dies away behind
        float fd = dot(iA.xy, uFrontA.xy) - uFrontA.z;
        float uGust = uFrontA.w * (fd > 0. ? exp(-fd * fd / 150.) : exp(-fd * fd / 9000.));
        float R = iA.w, sc = sqrt(R) * (1. + .7 * uGust);        // in the gust every contact throws a standing plume
        float t = fract(uTime * (1.5 - .12 * sc) + aSeed.x * 7.);
        float life = .45 * sc;
        float tt = t * life;
        vec3 v = vec3(mix(-(3.2 + 7.5 * aSeed.y), 5. + 9. * aSeed.y, uGust), (.9 + 1.7 * aSeed.z) * (1. - .25 * uGust), (fract(aSeed.x * 13.) - .5) * 5.) * sc * .8;      // (in the gust the salt is carried on DOWNWIND, ahead of the hoop, and stays up: a streaming plume)      // (low: a tail at the foot, never a veil over the hoop)
        vec3 q = v * tt + vec3(-.2 * R * aSeed.y * (1. - uGust), .1 - 4.9 * (1. - .86 * uGust) * tt * tt, 0.);
        q.y = max(q.y, .05);
        float ch = cos(iA.z), sh = sin(iA.z);
        vec3 w = vec3(iA.x, 0., iA.y) + vec3(ch * q.x + sh * q.z, q.y, sh * q.x - ch * q.z);
        vec4 mv = viewMatrix * vec4(w, 1.);
        float size = (.25 + 1.3 * t) * sc * .5 * (1. + (.5 + 2.1 * smoothstep(4., 7., R)) * uGust);      // (the standing plumes are the elders': the lesser hoops only kick up a little more)
        // each puff is drawn out along its own flight (more in the gust): a plume streams back from the contact as a tail
        vec3 vw = vec3(ch * v.x + sh * v.z, v.y - 9.8 * tt, sh * v.x - ch * v.z);
        vec2 dv = (viewMatrix * vec4(vw, 0.)).xy; float dl = length(dv);
        dv = dl > 1e-3 ? dv / dl : vec2(1., 0.);
        float along = 1. + (1.1 + 1.5 * uGust) * clamp(dl / max(6. * sc, 1e-3), 0., 1.);
        mv.xy += (dv * position.x * along + vec2(-dv.y, dv.x) * position.y * (1. - .25 * uGust)) * size;
        vC = position.xy; vDist = -mv.z; vDir = nrm(w - cameraPosition);
        float a = (1. - t) * (1. - t) * smoothstep(0., .08, t) * (.72 - .1 * uGust) * clamp(iC.w, 0., 1.) * step(0., iB.w) * step(iB.z, .3) * smoothstep(1.5, 4., vDist) * (1. - .9 * smoothstep(70., 230., vDist));
        vCol = vec4(uSalt * (sunLow() * sunThrough(w) * .5 + uSkyCol * 1.15), a);
        gl_Position = projectionMatrix * mv;
        if (a <= .002) gl_Position = vec4(2., 2., 2., 1.);
      }`}),ha=e=>{const t=new a.InstancedBufferGeometry,o=[],n=[],s=[];for(let r=0;r<e;r++){const l=De(),i=De(),f=De();o.push(-1,-1,0,1,-1,0,1,1,0,-1,1,0);for(let p=0;p<4;p++)n.push(l,i,f);s.push(r*4,r*4+1,r*4+2,r*4,r*4+2,r*4+3)}return t.setAttribute("position",new a.Float32BufferAttribute(o,3)),t.setAttribute("aSeed",new a.Float32BufferAttribute(n,3)),t.setIndex(s),t};ye(xe.attach(ha(34)),la,4),ye(je.attach(ha(Math.round(9*u))),la,4),await h.yield();const tt={..._,uSalt:_.uSalt,uSmoke:{value:new a.Vector4(-1,0,.5,0)},uFront:{value:new a.Vector2(-1e5,0)}},on=Math.round(520*u),Et=new a.BufferGeometry;{const e=[],t=[],o=[];for(let n=0;n<on;n++){const s=[De(),De(),De(),De()];e.push(-1,-1,0,1,-1,0,1,1,0,-1,1,0);for(let r=0;r<4;r++)t.push(...s);o.push(n*4,n*4+1,n*4+2,n*4,n*4+2,n*4+3)}Et.setAttribute("position",new a.Float32BufferAttribute(e,3)),Et.setAttribute("aS",new a.Float32BufferAttribute(t,4)),Et.setIndex(o)}const an=`
      varying vec2 vC; varying vec4 vCol; varying float vDist; varying vec3 vDir;
      ${re}
      void main(){
        float r2 = dot(vC, vC); if (r2 > 1.) discard;
        float sd = vCol.a * 37.;                                  // (a seed per wisp, good enough)
        float brk = smoothstep(.3, .62, vnoise(vec2(vC.x * 2.6 + sd, sd * 3.1)) * .65 + vnoise(vec2(vC.x * 7. - sd, vC.y * 2. + sd)) * .35);
        float taper = (1. - vC.x * vC.x) * (1. - vC.x * vC.x) * (1. - vC.y * vC.y / max(1. - .7 * abs(vC.x), .05));
        float a = vCol.a * max(taper, 0.) * brk;
        vec3 col = mix(vCol.rgb, hazeCol(vDir), hazeAmt(vDist));
        gl_FragColor = vec4(col * a, a);
      }`,nn=new a.ShaderMaterial({uniforms:tt,...Nt,fragmentShader:an,vertexShader:`
      attribute vec4 aS;
      varying vec2 vC; varying vec4 vCol; varying float vDist; varying vec3 vDir;
      uniform vec3 uSalt; uniform vec4 uSmoke; uniform vec2 uFront;
      ${re}
      void main(){
        const float W = 300.;
        vec2 wind = uSmoke.xy;
        vec2 base = aS.xy * W + wind * uTime * (40. + 22. * aS.z);
        vec2 p = cameraPosition.xz + mod(base - cameraPosition.xz, W) - W * .5;
        // in the gust front the smoke stands up as a low wall: taller, wider, thicker streaks
        float fb = uFront.y * exp(-abs(dot(p, wind) - uFront.x) * .035);
        float y = (.25 + 3.2 * aS.z * aS.z) * (1. + .5 * fb) + .3 * sin(uTime * 2. + aS.w * 30.);      // (the front stands half as high as the near hoops: it never veils them)
        vec3 c = vec3(p.x, y, p.y);
        vec3 along = vec3(wind.x, 0., wind.y);
        vec3 toCam = cameraPosition - c; float d = length(toCam);
        vec3 side = nrm(cross(along, toCam / max(d, 1e-3)) + vec3(0., 1e-3, 0.));
        float len = 7. + 12. * aS.w, wid = (.35 + .6 * aS.z) * (1. + 1.6 * fb);
        vec3 w = c + along * position.x * len + side * position.y * wid;
        vC = position.xy; vDist = d; vDir = nrm(w - cameraPosition);
        float edge = smoothstep(W * .5, W * .36, d) * smoothstep(5., 22., d);
        float a = min(edge * (.1 + .2 * aS.w) * (uSmoke.z + uSmoke.w * exp(-abs(dot(p, wind) - uFront.x) * .009)) * (1. + 1.2 * fb), .42) * smoothstep(.42, .16, (cameraPosition.y - y) / max(d, 1.));      // (a thin thread: lost when looked down on steeply)
        vCol = vec4(uSalt * (sunLow() * .38 + uSkyCol * 1.2), a);
        gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
        if (a <= .002) gl_Position = vec4(2., 2., 2., 1.);
      }`}),xo=new a.Mesh(Et,nn);xo.frustumCulled=!1,xo.renderOrder=5,g.add(xo),tt.uWall={value:new a.Vector4(-1e5,0,17,0)};const yo=new a.BufferGeometry;{const e=[],t=[],s=r=>{const l=e.length/3;e.push(-1,0,r,1,0,r,1,1,r,-1,1,r),t.push(l,l+1,l+2,l,l+2,l+3)};for(let r=0;r<12;r++)s(-24+4.2*r);for(let r=0;r<0;r++)s(100+.1+.15*r);yo.setAttribute("position",new a.Float32BufferAttribute(e,3)),yo.setIndex(t)}const sn=new a.ShaderMaterial({uniforms:tt,...Nt,side:a.DoubleSide,vertexShader:`
      varying vec3 vW; varying float vUp;
      uniform vec4 uSmoke, uWall;
      void main(){
        vec2 wind = uSmoke.xy, perp = vec2(-wind.y, wind.x);
        float s = uWall.y + position.x * 800., sl = position.z, up = step(99., sl);
        // an upright sheet stands sl metres behind the line and rises 1.5 heights; a level one lies from 30 m ahead of the line to 30 m behind it
        float bk = uWall.z / 10.;
        float al = uWall.x - mix(sl, -30. + 60. * position.y, up) * bk;
        float y = mix(position.y * uWall.z * 1.6, (sl - 100.) * uWall.z * 1.3, up);
        vec3 w = vec3(wind.x * al + perp.x * s, y + .06, wind.y * al + perp.y * s);
        vW = w; vUp = up;
        gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
        if (uWall.w <= .002) gl_Position = vec4(2., 2., 2., 1.);
      }`,fragmentShader:`
      varying vec3 vW; varying float vUp;
      uniform vec3 uSalt; uniform vec4 uSmoke, uWall;
      ${re}
      ${ka}
      ${Zt}
      void main(){
        vec3 V = vW - cameraPosition; float dist = length(V); V /= max(dist, 1e-4);
        vec2 wind = uSmoke.xy, perp = vec2(-wind.y, wind.x);
        float t = uTime, s = dot(vW.xz, perp);
        float bk = max(uWall.z / 10., .5);      // the bank's size: its height and depth grow together, its billows with them
        vec3 q = vec3(s, vW.y / bk, (uWall.x - dot(vW.xz, wind) + bankLine(s, t)) / bk);
        float f0 = bankF(q, t);
        float rho = smoothstep(0., .4, f0);
        if (rho <= .003) discard;
        // its shape lights it: the gradient of the body is its surface
        float fs = bankF(q + vec3(2.5, 0., 0.), t) - f0, fy = bankF(q + vec3(0., 1.6, 0.), t) - f0, fa = bankF(q + vec3(0., 0., 2.5), t) - f0;
        vec3 N = nrm(-(vec3(perp.x, 0., perp.y) * fs / 2.5 - vec3(wind.x, 0., wind.y) * fa / 2.5 + vec3(0., 1., 0.) * fy / 1.6) + vec3(0., .02, 0.));
        float hy = q.y / (BANK_H * bankCol(s, t) + .01);
        float nl = clamp(dot(N, uSunDir) * .6 + .4, 0., 1.);
        // lilac in its own shade; warm where the sun comes over the crest and on the flanks of the billows that face it
        // the top of the body and the crowns of its billows take the low sun as the salt does (warm cream); what has smoke
        // above it, and every face turned from the sun, is in the bank's own lilac shade
        float expo = 1. - smoothstep(0., .45, f0 + fy * 1.6);      // how open to the sky this point of the body is (little smoke above it)
        float lit = clamp(max(expo * (.22 + 2.8 * max(dot(N, uSunDir), 0.)), smoothstep(.52, .92, hy) * (.55 + .45 * expo)), 0., 1.);      // (and by its height in the body: the crest is one warm line, the body under it lilac)
        vec3 sun = sunLow() * sunThrough(vW) * .27;
        vec3 shade = vec3(.6, .54, .8) * (uSkyCol * 1.7 + sun * .06), warm = vec3(.95, .82, .62) * (sun * 1.1 + uSkyCol * .8);
        vec3 col = mix(shade, warm, lit);
        col *= .8 + .2 * smoothstep(0., .6, hy);                       // deeper at the foot
        // how squarely this slice is seen: an upright sheet from along the wind, a level one from above
        float sq = mix(abs(dot(V.xz, wind)), abs(V.y), vUp);
        float a = rho * mix(.6, .7, vUp) * smoothstep(.05, .45, sq) * uWall.w * smoothstep(.36, .16, abs(V.y));      // (looked down on, the sheets give way to the body's own crown, below)
        a *= smoothstep(800., 560., abs(s - uWall.y)) * smoothstep(2., 26., dist) * smoothstep(1100., 520., dist);
        col = mix(col, hazeCol(V), hazeAmt(dist));
        gl_FragColor = vec4(col * a, a);
      }`}),bo=new a.BufferGeometry;{const o=[],n=[];for(let s=0;s<=16;s++)for(let r=0;r<=500;r++)o.push(r/500*2-1,s/16,0);for(let s=0;s<16;s++)for(let r=0;r<500;r++){const l=s*501+r,i=l+500+1;n.push(l,l+1,i,i,l+1,i+1)}bo.setAttribute("position",new a.Float32BufferAttribute(o,3)),bo.setIndex(n)}const rn=new a.ShaderMaterial({uniforms:tt,...Nt,side:a.DoubleSide,vertexShader:`
      varying vec3 vW;
      uniform vec4 uSmoke, uWall;
      ${re}
      ${Zt}
      void main(){
        vec2 wind = uSmoke.xy, perp = vec2(-wind.y, wind.x);
        float bk = max(uWall.z / 10., .5), s = uWall.y + position.x * 800., zb = mix(-15., 27., position.y);
        float al = uWall.x + bankLine(s, uTime) - zb * bk;
        vec3 w = vec3(wind.x * al + perp.x * s, bankTop(s, zb, uTime) * bk + .08, wind.y * al + perp.y * s);
        vW = w;
        gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
        if (uWall.w <= .002) gl_Position = vec4(2., 2., 2., 1.);
      }`,fragmentShader:`
      varying vec3 vW;
      uniform vec3 uSalt; uniform vec4 uSmoke, uWall;
      ${re}
      ${ka}
      ${Zt}
      float topAt(vec2 xz, float bk){
        vec2 wind = uSmoke.xy; float s = dot(xz, vec2(-wind.y, wind.x));
        return bankTop(s, (uWall.x - dot(xz, wind) + bankLine(s, uTime)) / bk, uTime) * bk;
      }
      void main(){
        vec3 V = vW - cameraPosition; float dist = length(V); V /= max(dist, 1e-4);
        vec2 wind = uSmoke.xy, perp = vec2(-wind.y, wind.x);
        float bk = max(uWall.z / 10., .5), e = 2.2 * bk;
        float h0 = topAt(vW.xz, bk), hp = topAt(vW.xz + perp * e, bk), hw = topAt(vW.xz + wind * e, bk);
        vec3 N = nrm(vec3(0., 1., 0.) - vec3(perp.x, 0., perp.y) * (hp - h0) / e - vec3(wind.x, 0., wind.y) * (hw - h0) / e);
        float lit = clamp(.12 + .7 * dot(N, uSunDir) + .8 * N.y, 0., 1.);      // cream where it faces the sky and the sun, lilac where it is turned from the sun
        lit *= .5 + .5 * smoothstep(.2, .75, h0 / max(BANK_H * bk, 1.));      // the hollows between the billows and the foot sit in the body's shade
        vec3 sun = sunLow() * sunThrough(vW) * .27;
        vec3 shade = vec3(.6, .54, .8) * (uSkyCol * 1.7 + sun * .06), warm = vec3(.95, .82, .62) * (sun * 1.1 + uSkyCol * .8);
        vec3 col = mix(shade, warm, lit);
        float a = smoothstep(.2, 4., h0 / bk) * smoothstep(.02, .4, abs(dot(N, V))) * .95 * uWall.w;
        a *= smoothstep(.1, .3, -V.y);      // the crown is what is seen from above
        float s = dot(vW.xz, perp);
        a *= smoothstep(800., 560., abs(s - uWall.y)) * smoothstep(2., 26., dist) * smoothstep(1100., 520., dist);
        if (a <= .003) discard;
        col = mix(col, hazeCol(V), hazeAmt(dist));
        gl_FragColor = vec4(col * a, a);
      }`}),ko=new a.Mesh(bo,rn);ko.frustumCulled=!1,ko.renderOrder=5.2,g.add(ko);const zo=new a.Mesh(yo,sn);zo.frustumCulled=!1,zo.renderOrder=5.2,g.add(zo);const ln=new a.ShaderMaterial({uniforms:{..._,uWall:tt.uWall},vertexShader:An,fragmentShader:Cn,transparent:!0,blending:a.NoBlending,colorWrite:!1,depthWrite:!0,side:a.DoubleSide});for(const e of[xe.attach(At(1)),lo,ho])ye(e,ln,5.1);await h.yield();const It=[],Te=(e,t,o,n,s,r={})=>It.push({u0:0,side:e,ahead0:t,rate:o,R:n/2,t:rt(s,0),seed:De(),ph:De()*oe,...r});Te(10.5,30,-300,9,0),Te(-9,30,-260,5,2),Te(30,92,-400,14,1),Te(-26,20,-250,13,0),Te(-25,44,-280,8,2),Te(-62,104,-400,22,1),Te(-38,66,-330,13,0),Te(20,120,-400,6.5,0),Te(-17.5,122,-380,7,1),Te(14,138,-400,20,0),[[13,104,12,0],[-19,98,9,2],[25,128,16,1],[74,140,20,0],[17,162,14,2],[90,164,17,1],[40,148,18,2],[57,118,15,0]].forEach(([e,t,o,n])=>Te(e,t,-400,o,n));for(let e=0;e<3;e++)Te(-8.5-e,-3-6*e,300,3.6+.3*e,e,{juv:!0});for(let e=0;e<12;e++){const t=e%2?1:-1,o=Math.floor(e/2);It.push({u0:.8,side:t*(10.5+3*(o%3)),ahead0:-6-6*o-3*(e%2),rate:0,R:(3.9+.28*(e%4))/2,t:rt(e%3,0),seed:De(),ph:De()*oe,juv:!0,peel:t,hold:24+8*o+3*(e%2)})}await h.yield();for(const[e,t,o]of[[23,30,40],[26,28,38],[28,26,36],[31,26,32],[33,24,30],[36,24,30],[38,24,29],[41,24,30],[43,26,32]]){const n=co+9*e-2.6,s=Je.range(24,27.5),r=mt/5;let l=Je()*r;for(let i=0;i<5;i++){const f=Je.range(t,o),p=rt((i+Math.round(e*2))%3,Je.range(-1,1));wt.push({R:f/2,l:n,s0:l+Je.range(-.22,.22)*r,v:s,juv:!1,elder:!0,seed:Je(),ph:Je()*oe,lean0:Je.range(8,14)*E,tr:p[0],tg:p[1],tb:p[2]}),l+=r}}const So=[];for(let e=0;e<5;e++){const t=e%2===0,o=t?et.int(11,13):et.int(1,3);So.push({dx:-190+95*e+et.range(-14,14),z:-60+9*o-2.6,R:t?et.range(7,15):et.range(9,16),t:rt(me==="autumn"?e%2:(e+et.int(0,2))%3,0),seed:et(),ph:et()*oe})}const ee=new a.Vector2(-.94,-.34),ot=new a.Vector3,ue=new a.Vector3,ca=new a.Vector2,at=C.length,da=9.8;let fa=0;if(ae){let e=Ke;const t=Ne+101*Vo*st+1;for(let o=0;o<400&&C.pointAt(e,ue).z>t;o++)e+=5e-4;fa=ue.x-Ie(e)+3}const hn=(e,t,o,n,s,r,l,i,f,p,m,y,w)=>{const z=e-w.x,S=n-w.y,c=t-w.z,U=Math.sqrt(z*z+S*S+c*c);U<(n>11.5?n*9.5:44+n*4)&&xe.push(e,t,o,n,s,r,l,i,f,p,m,y)||U<330&&je.push(e,t,o,n,s,r,l,i,f,p,m,y)||it.push(e,t,o,n,s,r,l,i,f,p,m,y)},ua=new Float32Array(24),va=new Float32Array(24),Mo=new Float32Array(24),pa=new Float32Array(24);let lt=0;const Ao=60,ma=C.start.x*ee.x+C.start.z*ee.y-117,cn=C.start.x*-ee.y+C.start.z*ee.x,_t=e=>ma+Ao*A*e,dn=e=>O(0,300,Ao*A*e)*(1-O(80,380,_t(e)-Ie(e)*ee.x)),Co=e=>e>0?e/12:e/560;let nt=ma,$e=0;const Pe={x:0,z:0},To={x:0,z:0},Vt=(e,t,o)=>{const n=at*t+e.ahead0+e.rate*t;C.posAtDist(n,ue),C.tangentAtDist(n,ot);const s=Math.hypot(ot.x,ot.z)||1;return o.x=ue.x+ot.z/s*e.side,o.z=ue.z-ot.x/s*e.side,o};for(const e of It){if(e.hold!==void 0)continue;const t=l=>(Vt(e,l,Pe),Pe.x*ee.x+Pe.z*ee.y-_t(l));let o=0,n=1;if(t(0)<=0)n=0;else for(let l=0;l<30;l++){const i=(o+n)/2;t(i)>0?o=i:n=i}e.uc=n,Vt(e,n,Pe),e.sc=so(Pe.x,Pe.z);const s=Va(Pe.x,Pe.z);let r=1e9;e.lc=s;for(const l of ta)Math.abs(l+4.5-s)<r&&(r=Math.abs(l+4.5-s),e.lc=l+4.5);e.vg=(at+e.rate)/A,e.du=1.5*oe*e.R/(e.vg*A)}const wa=(e,t,o)=>{if(t<=e.uc)return Vt(e,t,o);const n=O(0,e.du,t-e.uc),s=_a(e.sc+e.vg*A*(t-e.uc),e.lc),r=s.x,l=s.z;return n>=1?(o.x=r,o.z=l,o):(Vt(e,t,o),o.x=b(o.x,r,n),o.z=b(o.z,l,n),o)},ga=(e,t,o)=>{xe.n=je.n=it.n=0;const n=Ie(t),s=t*at;$e=dn(t),nt=_t(t),tt.uFront.value.set(nt,$e);const r=1+O(540,960,Ao*A*t);tt.uWall.value.set(nt,cn,10*r,$e),Le.uBankK.value=r,_.uFrontA.value.set(ee.x,ee.y,nt,$e),Le.uGale.value.z=nt,Le.uGale.value.w=$e,tt.uSmoke.value.set(ee.x,ee.y,.26+.9*W,$e*.4),lt=0;const l=so(o.x,o.z);for(const i of It){if(t<i.u0)continue;if(i.hold===void 0){wa(i,t,Pe),wa(i,t+2e-4,To);const x=Pe.x,F=Pe.z,K=Math.atan2(To.z-F,To.x-x),$=Ge((t-i.uc)/i.du),ne=so(x,F)-l,se=Math.min(O(-650,-540,ne),O(1050,900,ne));if(se<=0)continue;const ke=x*ee.x+F*ee.y,H=Co(ke-nt),te=$e*Math.exp(-H*H),T=.03*Math.sin(e*1.7+i.ph)+.26*W+te*.23+$*Math.min(.2,Math.atan(i.vg*i.vg*q.k/da)),X=i.juv?.55*Math.abs(Math.sin(e*4.3+i.ph)):0;i.R>=6&&lt<24&&(ua[lt]=x,va[lt]=F,Mo[lt]=K,pa[lt++]=i.R);const ve=(at*t+i.ahead0+i.rate*t)/i.R%oe,ze=i.juv?b(i.t[0],1,.3):i.t[0],Se=i.juv?b(i.t[1],1,.3):i.t[1],d=i.juv?b(i.t[2],1,.3):i.t[2];if(Math.hypot(x-o.x,F-o.z)<250&&xe.push(x,F,K,i.R,ve,T,X,i.seed,ze,Se,d,se))continue;hn(x,F,K,i.R,ve,T,X,i.seed,ze,Se,d,se,o);continue}const f=b(i.ahead0,i.hold,O(i.u0,i.u0+.055,t))+3*Math.sin(e*.6+i.ph)+90*Math.max(0,t-.93),p=s+f;C.posAtDist(p,ue),C.tangentAtDist(p,ot);const m=Math.atan2(ot.z,ot.x),y=Math.sin(m),w=Math.cos(m);let z=i.side,S=.03*Math.sin(e*1.7+i.ph)+.26*W;if(i.peel){const x=Ge((t-.955)/.045);z+=i.peel*x*x*46,S+=-i.peel*.3*Math.sin(Math.PI*Math.min(1,x*1.6))}const c=ue.x+y*z,U=ue.z-w*z,B=.55*Math.abs(Math.sin(e*4.3+i.ph));xe.push(c,U,m,i.R,(e*27+p)/i.R%oe,S,B,i.seed,b(i.t[0],1,.3),b(i.t[1],1,.3),b(i.t[2],1,.3),1)}for(const i of So){const f=n+i.dx,p=Co(f*ee.x+i.z*ee.y-nt),m=.03*Math.sin(e*1.1+i.ph)+.26*W+$e*.2*Math.exp(-p*p);xe.push(f,i.z,Math.PI,i.R,(Oe-f)/i.R%oe,m,0,i.seed,i.t[0],i.t[1],i.t[2],1)}for(let i=0;i<wt.length;i++){const f=wt[i];if(f.rest){const d=f;let G,Z=d.h0,ie=.12,He=d.ph;if(d.spin){const Xt=(e/d.period+d.ph)%1,Fo=d.prec||40;if(Xt<.72){const Mt=Xt/.72;G=(90-60*Math.cbrt(1-Mt))*E,Z+=Fo*(1-Math.sqrt(1-Math.min(Mt,.965)))}else if(Xt<.84)G=90*E,Z+=Fo*.813;else{const Mt=O(.84,1,Xt);G=(90-60*Mt)*E,Z=d.h0+Fo*.813*(1-Mt)}d.elder&&(He=d.ph*9+Z*.8),ie=.12*O(40*E,88*E,G)}else d.prop?(G=d.prop+.075*Math.sin(e*.8+d.ph)+.03*Math.sin(e*2.1+d.ph*1.7),Z+=.06*Math.sin(e*.55+d.ph*.6),ie=0):G=(88.5+1.2*Math.sin(e*.9+d.ph))*E;if(d.elder&&Math.hypot(d.x-o.x,d.z-o.z)<520&&xe.push(d.x,d.z,Z,d.R,He,G,ie,-d.seed-.01,d.tr,d.tg,d.tb,1))continue;const D=d.R,ce=d.x-o.x,Re=D-o.y,ht=d.z-o.z,Xe=Math.sqrt(ce*ce+Re*Re+ht*ht);let de=xe;if((!(Xe<(D>11.5?D*9.5:44+D*4))||de.n>=de.cap)&&(de=je,(!(Xe<330)||de.n>=de.cap)&&(de=it,de.n>=de.cap)))continue;const pe=de.n++*4,jt=de.a.array,Ut=de.b.array,$t=de.c.array;jt[pe]=d.x,jt[pe+1]=d.z,jt[pe+2]=Z,jt[pe+3]=D,Ut[pe]=He,Ut[pe+1]=G,Ut[pe+2]=ie,Ut[pe+3]=-d.seed-.01,$t[pe]=d.tr,$t[pe+1]=d.tg,$t[pe+2]=d.tb,$t[pe+3]=1;continue}const p=f.s0+f.v*e,m=((p-l+650)%mt+mt)%mt-650,y=q,w=l+m,z=f.l;if(w>=0)q.x=Oe-w,q.z=Ye+z,q.h=Math.PI,q.k=0;else if(w>-bt){const d=-w/fe,G=fe-z;q.x=Oe+G*Math.sin(d),q.z=Ye+fe-G*Math.cos(d),q.h=Math.PI+d,q.k=1/fe}else{const d=-bt-w;q.x=Ft-Qe.x*d-.5*z,q.z=Dt-Qe.z*d+.866*z,q.h=Math.PI+30*E,q.k=0}let S=y.x,c=y.z,U=Math.min(O(-650,-540,m),O(1050,900,m));const B=O(300,170,Math.abs(S-n));if(B>0){c>-14&&c<17&&(c=b(c,c>1.5?17:-14,B)),ae&&c>Ne-14&&c<Ne+17&&(c=b(c,c>Ne+1.5?Ne+17:Ne-14,B));for(const d of So){const G=O(d.R*2+70,d.R*2+20,Math.abs(S-n-d.dx)),Z=d.R+f.R+3;G>0&&c>d.z-Z&&c<d.z+Z&&(c=b(c,c>d.z?d.z+Z:d.z-Z,G))}}for(let d=0;d<lt;d++){const G=S-ua[d],Z=c-va[d],ie=pa[d]+f.R+3;if(G>ie||G<-ie||Z>ie||Z<-ie)continue;const He=Math.cos(Mo[d]),D=Math.sin(Mo[d]),ce=G*He+Z*D,Re=-G*D+Z*He,ht=O(ie,ie-5,Math.abs(ce));if(Math.abs(Re)<5){const Xe=((Re<0?-5:5)-Re)*ht;S+=-D*Xe,c+=He*Xe}}!(Xo.at(S,c)<0)&&Xo.push(S,c,f.R,f.juv,f.seed)&&(S=vt.x,c=vt.z),!(Zo.at(S-n,c)<0)&&Zo.push(S-n,c,f.R,f.juv,f.seed)&&(S=vt.x+n,c=vt.z);const x=S*ee.x+c*ee.y,F=Co(x-nt),K=Math.atan(f.v*f.v*y.k/da)*1.6+.26*W+$e*f.lean0*1.25*Math.exp(-F*F)+.035*Math.sin(e*1.3+f.ph),$=f.juv?.5*Math.abs(Math.sin(e*4.1+f.ph)):0,ne=f.R,se=S-o.x,ke=ne-o.y,H=c-o.z,te=Math.sqrt(se*se+ke*ke+H*H);let T=xe;if((!(te<(ne>11.5?ne*9.5:44+ne*4))||T.n>=T.cap)&&(T=je,(!(te<330)||T.n>=T.cap)&&(T=it,T.n>=T.cap)))continue;const X=T.n++*4,ve=T.a.array,ze=T.b.array,Se=T.c.array;ve[X]=S,ve[X+1]=c,ve[X+2]=y.h+.02*Math.sin(e*.6+f.ph),ve[X+3]=ne,ze[X]=p/f.R%oe,ze[X+1]=K,ze[X+2]=$,ze[X+3]=f.seed,Se[X]=f.tr,Se[X+1]=f.tg,Se[X+2]=f.tb,Se[X+3]=U}xe.flush(),je.flush(),it.flush()},fn=96,Ht=new a.Vector3,un=new a.Vector3,Gt=new a.Vector3,Ro=new a.Vector3,gt=new a.Vector3,Lt=new a.Vector3,vn=new a.Vector3,Gn=new a.Vector3,pn=e=>O(47,59,C.pointAt(e,Lt).y),xa=new a.Vector2(J.x+.37,J.z).normalize(),mn=(e,t)=>(C.pointAt(e,t),t.x+=xa.x*112,t.z+=xa.y*112,t.y=0,t),wn=C.tangentAt(Ke,new a.Vector3).normalize(),ya=.09,Wo=ya*(Ke-.002-(Bt-.03)),gn=e=>(C.pointAt(e,ue),_t(e)-(ue.x*ee.x+ue.z*ee.y));let Kt=1;for(let e=0,t=0;t<30;t++){const o=(e+Kt)/2;gn(o)<0?e=o:Kt=o}const Bo=e=>{const t=j.anchors.hub,o=j.anchors.discNormal;C.pointAt(e,ue);const n=Ie(e)+t.x-ue.x,s=t.y-ue.y,r=t.z-ue.z,l=(n*o.x+s*o.y+r*o.z)/J.dot(o);return l>0&&Math.hypot(J.x*l-n,J.y*l-s,J.z*l-r)<j.height/2};let Ot=1;for(let e=2,t=Bo(0);e<=at&&Ot===1;e+=2){const o=Bo(e/at);if(o&&!t){let n=(e-2)/at,s=e/at;for(let r=0;r<30;r++){const l=(n+s)/2;Bo(l)?s=l:n=l}s>Kt&&(Ot=s)}t=o}const xn=P?"Hoopwind, Two Wheels":M==="night"?"Hoopwind by Moonlight":le==="gale"?"Hoopwind in a Salt Gale":le==="rain"?"Hoopwind after Rain":Me?"Hoopwind in Spring":we.name;return await h.yield(),ga(0,0,C.start),await h.yield(),{scene:g,path:C,duration:A,title:xn,pace:Na,camera:{fov:62,near:.4,far:6e3,lookAhead:24,sway:.5,bank:.45},pois:[{at:(e,t)=>{const o=j.anchors.hub;C.pointAt(t,Lt);const n=b(fn,6,O(400,520,Math.hypot(Lt.x-Ie(t),Lt.z)));Ht.set(Ie(t)+o.x,n,o.z*n/o.y);const s=pn(t);return s>0&&(Ht.lerp(mn(t,vn),s),Ht.y-=240*s*(1-s)),Ht},from:Kt,to:Ot,weight:.9,fade:.2},{at:(e,t)=>un.set(Ie(t)-60,11,23),from:Ot,to:Bt+.004,weight:.9,fade:.25},{at:(e,t)=>{const o=j.anchors.hub,n=Ie(t),s=O(Bt+.008,ut-.05,t),r=b(C.pointAt(t,gt).y+10,o.y+3,s);Ro.set(n+b(-48,o.x-20,s)+26*s*(1-s)*4*.5,r,o.z*r/o.y);const l=O(ut-.02,ut+.012,t);if(l<=0)return Ro;const i=O(62,30,Math.hypot(gt.x-n-o.x,gt.y-o.y,gt.z-o.z));return gt.set(n+o.x,o.y+b(8,-9,i),o.z).addScaledVector(wn,b(26,70,i)),Ro.lerp(gt,l)},from:Bt-.03,to:Ke-.002,weight:.9,fade:ya},{at:k.clone(),from:Ke-.002-Wo,to:.9,weight:.62,fade:Wo/(.9-(Ke-.002-Wo))}],portal:{shape:"circle",radius:14.3,color:M==="night"?"#bfe6ff":"#a8f5dc",glow:.9,revealDistance:700},post:{exposure:L.exposure,bloom:{strength:.28,radius:.6,threshold:1.1},grade:{saturation:1.1,contrast:1.09,tint:"#ffffff",shadowTint:M==="night"?"#0a0c22":"#1a1430",vignette:.28,grain:.02,aberration:0}},ride:"none",style:"none",update(e,t,o,n){_.uTime.value=t,h.renderer.getDrawingBufferSize(ca),_.uPix.value=2/Math.max(o.projectionMatrix.elements[5],.1)/Math.max(ca.y,1)*1.25,Gt.setFromMatrixPosition(o.matrixWorld),Rt.position.set(Gt.x,0,Gt.z);const s=Ie(n);j.object.position.set(s,0,0),j.setRoll((Be[0]-s)/110+1.1);const r=O(ut-.05,ut+.005,n);j.setProgress(O(Ea+.02,ut-.03,n)*(1-.8*r)),j.setGather(r),j.setFan(1),j.update(e,t,o);const l=j.anchors.hub;if(_.uWheelA.value.set(s+l.x,l.y,l.z,1),_.uWheelNA.value.copy(j.anchors.discNormal),ae){const i=s+fa;ae.object.position.set(i,0,Ne),ae.setRoll((Be[0]-s)/(110*st)+2.9),ae.setProgress(.5*O(Ke-.02,Ke+.08,n)),ae.setGather(1),ae.update(e,t,o),_.uWheelB.value.set(i+l.x*st,l.y*st,Ne+l.z*st,st),_.uWheelNB.value.copy(j.anchors.discNormal)}ga(t,n,Gt)},dispose(){j.dispose(),ae&&ae.dispose(),Jt.dispose()}}}};export{On as default};
