import*as e from"three";import{W_COMMON as L,W_SKY as G,TL as ee,SAG_RUN as te,SAG_LAG as oe,W_FILM_CLOCK as se,W_GLASS_DISC as ae}from"./what-the-ocean-builds.js";const I=`
uniform float uCalm, uRing, uShine, uSwell, uArch;      // uArch: the progress an arch takes to close
uniform vec4 uPier[13];           // half width, z, radius, birth
${ae}
float wGlass(vec2 p){      // the disc of sea that has turned to glass: 1 inside, 0 on the living sea (the disc itself: wGlassR, given out once by the hero part)
  return 1.0 - smoothstep(0.8, 1.0, wGlassR(p) + 0.13*(wN2(p/55.0) - 0.5) + 0.07*(wN2(p/17.0 + 3.0) - 0.5));      // a wandering, feathered edge
}
float wCalm(vec2 p){ return wGlass(p)*uCalm; }
float wSeaH(vec2 p, float t){
  float h = 0.45*sin(dot(p, vec2(0.0429, 0.0133)) - t*0.265) + 0.36*sin(dot(p, vec2(0.0525, -0.0287)) - t*0.306 + 1.7)
          + 0.28*sin(dot(p, vec2(0.0343, 0.0675)) - t*0.345 + 4.1) + 0.2*sin(dot(p, vec2(0.0159, -0.0924)) - t*0.383 + 2.6)
          + 0.16*sin(dot(p, vec2(-0.0698, 0.0781)) - t*0.405 + 0.4);
  h += 0.9*(wN2(p/170.0 + vec2(t*0.012, -t*0.009)) - 0.5);                       // slow heave, like muscle under a skin
  return h*uSwell;
}
// x: F1, y: F2 - F1 (small on a cell wall)
vec2 wCells(vec2 p){
  vec2 i = floor(p), f = fract(p); float d1 = 9.0, d2 = 9.0;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 o = vec2(float(x), float(y)), c = i + o;
    vec2 r = o + vec2(wH2(c), wH2(c + 17.7))*0.84 + 0.08 - f; float d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d;
  }
  d1 = sqrt(max(d1, 0.0)); d2 = sqrt(max(d2, 0.0)); return vec2(d1, d2 - d1);
}`,Q=`
${L}
${I}
varying vec3 vW;
void main(){
  vec3 wp = vec3(position.x + cameraPosition.x, 0.0, position.z + cameraPosition.z);
  float r = length(position.xz);
  wp.y = wSeaH(wp.xz, uTime)*(1.0 - wCalm(wp.xz))*(1.0 - smoothstep(700.0, 1800.0, r));
  vW = wp;
  gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.0);
}`,ge=Q,xe=I,re=`
${L}
${I}
uniform vec4 uMound;
varying vec3 vW;
void main(){
  vec2 xz = uMound.xy + position.xz*uMound.z; float q = clamp(1.0 - dot(position.xz, position.xz), 0.0, 1.0);
  vec3 wp = vec3(xz.x, wSeaH(xz, uTime)*(1.0 - wCalm(xz)) + uMound.w*q*q, xz.y);
  vW = wp;
  gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.0);
}`,Y=`
// the hall's own laws, CALLED from the hero part (not copied): a bay's share of the fall, a film's clock (wFilmClock)
#define W_SAG_RUN ${te.toFixed(2)}
#define W_SAG_LAG ${oe.toFixed(2)}
// FOOTPRINT FADES OF THE POLISH ROUND, declared once. fp is the pixel's footprint on the sea (metres of sea under one
// pixel). By it, and by nothing of the eye's place: the glints of a road and of the crests go over into their mean
// (0.08 to 0.9 m); the swell's breaking of a road into its mean (2 to 12 m); the froth rafts under the hall (4 to
// 14 m); the fallen rags (6 to 20 m); their rings (2 to 8 m); the tower's froth to half (8 to 30 m). A small thing of
// the sea goes over into the sea when a pixel covers 0.35 to 1 of its own radius; a froth raft's edge is 0.03 of its
// cell wide and wider by 0.04 of a cell for every metre of footprint. In the hero part: a film's edge is one pixel wide
// at the least; the ribs' fine grain goes over into its mean at 0.15 to 0.6 m; a thread strung across a tear is
// 1.2 cm wide and wider by the pixel's footprint on the film, and dims as it widens (whole at 5 cm of footprint, never
// under 0.15); a shred's pointed end is soft over 4 cm and one pixel's footprint more
${L}
${se}
${G}
${I}
uniform vec3 uBody; uniform vec3 uShadA, uShadB;      // shadow direction on the floor (x, z) and length per metre of height
uniform vec4 uDome, uTower;                           // the dome (radius, height, torn) and the tower (height, -, strength), to mirror them
uniform vec4 uElseA, uElseB;                          // the two swellings beside the hall: x, z, radius, height now
varying vec3 vW;
// a swelling at p: xy the slope it gives the surface, z the foam at its foot and on the rings that run out from it
vec3 wElse(vec2 p, vec4 e, float t){
  vec2 d = p - e.xy; float R = max(e.z, 1.0), rl = length(d), rho = rl/R, q = clamp(1.0 - rho*rho, 0.0, 1.0), up = clamp(e.w/(0.3*R), 0.0, 1.0);
  vec2 sl = (d/max(rl, 1e-3))*(-4.0*rho*q*e.w/R);
  float lace = smoothstep(0.35, 0.7, wN2(p/3.1 + vec2(t*0.1, 0.0)))*smoothstep(0.8, 1.0, rho)*(1.0 - smoothstep(1.05, 1.5, rho));
  float rg = max(sin((rl - R)*0.42 - t*1.1), 0.0); rg *= rg; rg *= rg;
  float rings = rg*smoothstep(1.0, 1.15, rho)*(1.0 - smoothstep(1.3, 3.4, rho))*smoothstep(0.3, 0.7, wN2(p/17.0 + 9.0));
  return vec3(sl, smoothstep(0.0, 0.25, up)*(0.75*lace + 0.4*rings));
}
// WHAT THE HALL GIVES BACK FLOATS (polish 1, Q3 c). uWind: the world's one wind (its heading, a unit vector).
// wFallAt: a bay's share of the fall at the place z along the hall (the ribs' own measure: the fall x 1.3 - 0.6 x the
// place from the far end; the far bays first). wFoot: the hall's footprint (1 under the nave and the galleries, which
// reach nine half widths out; soft at its rim). Nothing here has a time of its own: a rag lies where a film fell
// from the moment its own film goes to tatters (the film's clock at 1: wFilmClock, the hero part's one piece of
// shader text, called with the rag's dealt lag), spreads, sinks before that clock reaches 2 and leaves a ring.
// (Third part, U6) A rag stays where it fell: it stirs and is washed over on the world's clock, the more the more
// of the swell has come back to the place (the sea's own calm, called); nothing of it is carried by the fall
uniform vec2 uWind;
float wFallAt(float z){ return clamp(uSag*W_SAG_RUN - W_SAG_LAG*(1.0 - clamp(z/min(uPier[12].y, -1.0), 0.0, 1.0)), 0.0, 1.0); }
float wFoot(vec2 p){
  float f = clamp(p.y/min(uPier[12].y, -1.0), 0.0, 1.0), w = mix(uPier[0].x, uPier[12].x, f);
  return (1.0 - smoothstep(6.5*w, 9.5*w, abs(p.x)))*smoothstep(uPier[12].y - 40.0, uPier[12].y, p.y)*(1.0 - smoothstep(0.0, 40.0, p.y));
}
// x: how much of the place a fallen rag covers; y: its light (pale, mottled, darker as it sinks); z: a ring's crest
vec3 wFlotsam(vec2 p, float t){
  vec2 pd = p, ci = floor(pd/24.0); float cover = 0.0, light = 0.0, rings = 0.0;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 c = ci + vec2(float(i), float(j)); float h = wH2(c + 41.3), hb = wH2(c + 77.1), hc = wH2(c + 13.9);
    vec2 home = (c + 0.2 + 0.6*vec2(hb, hc))*24.0;
    float k = clamp(wFilmClock(h) - 1.0, 0.0, 1.0);      // (second part, R6 e; third part, U6) the rag's film: the film's own clock, called with the rag's dealt lag; the rag falls as that film goes to tatters (clock 1 to 2)
    if (k <= 0.0 || wH2(c + 55.5) > 0.33*wFoot(home)) continue;                 // (fourth part, D3 d: one place in three under the hall carries one; three in five before)
    float sw = 1.0 - wCalm(home);      // how much of the swell is back at the place
    vec2 ctr = home + uWind*((0.5 + 2.0*sw)*sin(t*0.043 + 6.283*h)) + (0.4 + 1.2*sw)*vec2(sin(t*0.21 + 6.283*hb), cos(t*0.17 + 6.283*hc)), d = pd - ctr;
    float a = 6.283*hc, dl = length(d); d = vec2(cos(a)*d.x + sin(a)*d.y, -sin(a)*d.x + cos(a)*d.y);
    float R = (4.0 + 9.0*hb*hb)*(0.45 + 0.55*smoothstep(0.0, 0.5, k));
    vec2 dn = d/max(R, 1e-3);
    float rr = length(dn*vec2(1.0, 1.0 + 1.2*h)) + 1.5*(wN2(dn*1.7 + 9.0*h) - 0.5) + 0.8*(wN2(dn*5.1 + 4.0*hb) - 0.5) + 0.25*(wN2(p/0.6 + 2.0) - 0.5);      // a torn outline at the rag's own scale: no two alike, none round, none clean
    float sink = 1.0 - smoothstep(0.35, 0.8, k), on = 0.7*smoothstep(0.0, 0.08, k)*sink*(1.0 - smoothstep(0.15, 0.95, rr));      // (second part, R5) a limp rag of skin: it thins out over most of its width, darkens and sinks
    on *= 1.0 - 0.3*sw*(0.5 + 0.5*sin(t*0.37 + 6.283*hb));      // the swell washes over it, on the world's clock
    if (on > cover) { cover = on; light = (0.5 + 0.3*smoothstep(0.3, 0.9, rr))*(0.3 + 0.7*sink)*(0.8 + 0.4*wN2(p/2.7 + 5.0*h)); }
    float rs = clamp((k - 0.8)/0.2, 0.0, 1.0), rad = R*(0.3 + 2.4*rs);      // the ring comes when the rag has gone under, from its middle, in pieces
    rings = max(rings, smoothstep(0.0, 0.2, rs)*(1.0 - rs)*exp(-min((dl - rad)*(dl - rad)/(1.5 + 5.0*rs), 30.0)));      // one soft low crest, widening as it runs out
  }
  return vec3(cover, light, rings);
}
// THE HALL'S SHADOW FROM ONE SUN (polish 1, Q3 b), at the place p of the floor. L: the direction to that sun; deg: the
// sun's radius in degrees (its shadows are as soft as its disc is wide: 2.2 degrees smear a rib's shadow over 11 m at
// 300 m, half a degree over 2.6 m). x: the ribs (the light's way from p to the sun is met with the plane of every arch,
// and the arch's own curve decides whether a rib stands in it: the mirror's own test, turned to the sun); y: the bulk
// of films and galleries (the way is followed up through six heights; the hall's body is a ridge 0.9 arch heights
// high over the nave that steps down to nothing ten half widths out, as the gallery chains do, and stands only where
// the froth has built it). Both turn with the suns: nothing here knows the eye
vec2 wHallShade(vec2 p, vec3 L, float deg){
  float ly = max(L.y, 0.03), rib = 0.0, tau = 0.0; vec4 a0 = uPier[0], a1 = uPier[12];
  for (int i = 0; i < 13; i++) {
    vec4 pr = uPier[i]; float grown = smoothstep(pr.w + 0.1*uArch, pr.w + 0.8*uArch, uU), H = pr.x*5.0;
    float tz = (pr.y - p.y)/(abs(L.z) < 1e-3 ? 1e-3 : L.z);
    float hx = abs(p.x + tz*L.x), hy = tz*ly, c = clamp(hy/max(H, 1.0), 0.0, 1.0);
    float ch = 1.0 + (1.0 - c)*5.1323;
    float xa = pr.x*log(ch + sqrt(max(ch*ch - 1.0, 0.0)))/2.5, rad = pr.z*mix(1.0, 0.33, c), blur = rad + max(tz, 0.0)*0.0175*deg + 0.4;
    rib = max(rib, grown*step(0.0, tz)*step(hy, H)*(1.0 - smoothstep(blur*0.5, blur*1.2, abs(hx - xa)))*min(1.5*rad/blur, 1.0));
  }
  for (int k = 0; k < 6; k++) {
    float y = 8.0 + 22.0*float(k); vec2 q = p + (y/ly)*L.xz;
    float f = clamp(q.y/min(a1.y, -1.0), 0.0, 1.0), w = mix(a0.x, a1.x, f), born = smoothstep(0.1*uArch, 0.9*uArch, uU - mix(a0.w, a1.w, f));
    float inZ = smoothstep(a1.y - 30.0, a1.y, q.y)*(1.0 - smoothstep(0.0, 30.0, q.y));
    tau += inZ*born*smoothstep(-14.0, 14.0, w*(4.5 - 0.425*abs(q.x)/max(w, 1.0)) - y);
  }
  return vec2(rib, 1.0 - exp(-0.45*tau));
}
void main(){
  vec2 p = vW.xz; float t = uTime;
  vec3 Vv = vW - cameraPosition; float dist = length(Vv); vec3 V = Vv/max(dist, 1e-3);
  float fp = max(length(dFdx(p)), length(dFdy(p)));
  float glass = wGlass(p), calm = glass*uCalm, rough = 1.0 - calm;
  float e = 0.8, h0 = wSeaH(p, t);
  vec2 slope = vec2(wSeaH(p + vec2(e, 0.0), t) - h0, wSeaH(p + vec2(0.0, e), t) - h0)/e;
  slope *= rough*(1.0 - smoothstep(900.0, 2600.0, dist));
  float det = rough*(1.0 - smoothstep(0.25, 3.0, fp));
  vec2 rp = p*0.8 + vec2(t*0.35, t*0.2);
  slope += det*0.16*(vec2(wN2(rp + 7.0), wN2(rp*1.37 + 19.0)) - 0.5);
  // shiver: patches 20 to 60 m across twitch for a second as if touched
  float twitchy = smoothstep(0.66, 0.76, wN2(p/42.0 + vec2(t*0.06, -t*0.045)));
  float touch = smoothstep(0.55, 1.0, sin(t*1.7 + 14.0*wN2(p/230.0)));
  float shiver = twitchy*touch*rough*(1.0 - smoothstep(0.1, 1.2, fp));
  slope += shiver*0.5*(vec2(wN2(p*3.3 + vec2(t*4.0, 0.0)), wN2(p*3.3 + vec2(5.0, -t*3.6))) - 0.5);
  // the glass is still the ocean: a slow swell goes on under its skin and bends what is mirrored in it
  slope += calm*(0.02*(vec2(wN2(p/41.0 + vec2(t*0.03, 0.0)), wN2(p/41.0 + vec2(5.0, -t*0.025))) - 0.5)
               + 0.014*(vec2(wN2(p/5.0 + vec2(t*0.07, 3.0)), wN2(p/5.0 + vec2(9.0, -t*0.06))) - 0.5)*(1.0 - smoothstep(0.5, 4.0, fp)));
  vec3 elA = wElse(p, uElseA, t), elB = wElse(p, uElseB, t);
  float rhoA = length(p - uElseA.xy)/max(uElseA.z, 1.0), rhoB = length(p - uElseB.xy)/max(uElseB.z, 1.0);      // on a swelling's place: 1 on the mound, 0 off it, for as long as it stands (fourth part: it keeps only this round's own things off the mound, the road's glints and what floats; nothing of live is taken out there)
  float onElse = max((1.0 - smoothstep(1.0, 1.25, rhoA))*smoothstep(0.0, 0.02, uElseA.w/max(uElseA.z, 1.0)), (1.0 - smoothstep(1.0, 1.25, rhoB))*smoothstep(0.0, 0.02, uElseB.w/max(uElseB.z, 1.0)));
  float topElse = 1.0 - smoothstep(0.2, 0.5, min(rhoA, rhoB));
  slope += elA.xy + elB.xy;
  // rings run out over the glass from the place of the eruption
  float rr = length(p), front = uRing*520.0;
  float ringEnv = calm*smoothstep(0.0, 0.08, uRing)*(1.0 - smoothstep(0.75, 1.0, uRing))*smoothstep(55.0, 75.0, rr)*(1.0 - smoothstep(front - 40.0, front + 10.0, rr));
  float ring = sin(rr*0.11 - uRing*42.0);
  slope += (p/max(rr, 1.0))*ring*0.12*ringEnv;
  vec3 N = normalize(vec3(-slope.x, 1.0, -slope.y));
  vec3 R = reflect(V, N); R.y = abs(R.y) + 0.002; R /= max(length(R), 1e-4);
  float om = 1.0 - clamp(dot(N, -V), 0.0, 1.0), f0 = mix(0.035, 0.1, calm), fres = f0 + (1.0 - f0)*om*om*om*om*om;
  float sa = clamp(dot(R, uSunA), 0.0, 1.0), sb = clamp(dot(R, uSunB), 0.0, 1.0);
  // each sun's image is as sharp as its own disc is small (a 2.2 degree disc: 970; a half degree one: 4260), and it
  // never burns to a flat white: above 1.6 it rises a tenth as fast, so the ripples stay readable inside the glitter
  vec3 spec = uRadA.rgb*uDisc.z*(uRadA.w*exp(-min((1.0 - sa)*2130.0/max(uDisc.x, 0.2), 30.0)) + 0.3*pow(sa, 24.0))
            + uRadB.rgb*uDisc.w*(uRadB.w*0.6*exp(-min((1.0 - sb)*2130.0/max(uDisc.y, 0.2), 30.0)) + 0.3*pow(sb, 24.0));
  spec = min(spec, 1.6 + 0.1*(spec - 1.6));
  vec3 refl = wSky(R)*(0.7 + 0.3*calm) + spec;
  // the floor of the hall: shadow bars of the piers from each sun, froth round the pier feet, and THE HALL MIRRORED:
  // the reflected ray is met with the plane of every arch, and the arch's own curve decides whether it strikes a rib
  float shA = 0.0, shB = 0.0, terr = 0.0, img = 0.0;
  if (calm > 0.01) {
    vec2 dA = uShadA.xy, dB = uShadB.xy;
    for (int i = 0; i < 13; i++) {
      vec4 pr = uPier[i]; float grown = smoothstep(pr.w + 0.1*uArch, pr.w + 0.8*uArch, uU), H = pr.x*5.0;
      for (int s = 0; s < 2; s++) {
        vec2 f = vec2(s == 0 ? -pr.x : pr.x, pr.y), q = p - f;
        float aA = dot(q, dA), pA = abs(q.x*dA.y - q.y*dA.x), lA = H*uShadA.z;
        shA = max(shA, grown*step(0.0, aA)*(1.0 - smoothstep(lA*0.6, lA, aA))*(1.0 - smoothstep(pr.z*0.7, pr.z*1.2 + aA*0.035, pA)));
        float aB = dot(q, dB), pB = abs(q.x*dB.y - q.y*dB.x), lB = H*uShadB.z;
        shB = max(shB, grown*step(0.0, aB)*(1.0 - smoothstep(lB*0.6, lB, aB))*(1.0 - smoothstep(pr.z*0.7, pr.z*1.2 + aB*0.035, pB)));
        float d = length(q) + pr.z*0.9*(wN2(p*0.3) - 0.5);
        terr = max(terr, grown*(1.0 - smoothstep(pr.z*1.3, pr.z*2.6, d)));
      }
      float tz = (pr.y - p.y)/(abs(R.z) < 1e-3 ? 1e-3 : R.z);
      float hx = abs(p.x + tz*R.x), hy = tz*R.y, c = clamp(hy/max(H, 1.0), 0.0, 1.0);
      float ch = 1.0 + (1.0 - c)*5.1323;                                              // cosh(2.5 qq) on the arch at that height
      float xa = pr.x*log(ch + sqrt(max(ch*ch - 1.0, 0.0)))/2.5, rad = pr.z*mix(1.0, 0.33, c)*(1.0 + 0.012*max(tz, 0.0));
      float hit = step(0.0, tz)*step(hy, H*min(1.0, 0.15 + 1.2*grown))*(1.0 - smoothstep(rad*0.7, rad*1.15 + 0.3, abs(hx - xa)));
      img = max(img, hit*grown*exp(-max(tz, 0.0)*0.0035));
    }
  }
  vec3 frothC = uFroth*(uAmbHi + uFill + 0.26*(uSunACol + uSunBCol));               // what the pale things look like in a dark mirror
  refl = mix(refl, frothC, img);
  // the dome and the tower stand in the glass too
  vec3 o = vec3(p.x, 0.0, p.y);
  { float ry = max(uDome.y, 1.0), rx = max(uDome.x, 1.0); vec3 dd = vec3(R.x, R.y*rx/ry, R.z); float dl = max(length(dd), 1e-4); dd /= dl;
    float bq = dot(o, dd), hq = bq*bq - (dot(o, o) - rx*rx);
    if (hq > 0.0 && bq < 0.0) { vec3 hn = o + dd*(-bq - sqrt(max(hq, 0.0))); hn = vec3(hn.x, hn.y*rx/ry, hn.z); hn /= max(length(hn), 1e-4);
      vec3 r2 = reflect(R, hn); r2.y = abs(r2.y) + 0.002; r2 /= max(length(r2), 1e-4);
      refl = mix(refl, wSky(r2)*0.8 + uRadA.rgb*uDisc.z*2.0*pow(clamp(dot(r2, uSunA), 0.0, 1.0), 60.0), smoothstep(0.0, 0.02*rx*rx, hq)*(1.0 - clamp(uDome.z*0.5 + uDome.w*3.0, 0.0, 1.0))); } }
  { vec2 pt = p + vec2(7.0*sin(p.y*0.19 + uTime*0.3) + 14.0*(wN2(vec2(p.y*0.06, uTime*0.05)) - 0.5), 0.0);      // the glass's slow swell bends the image: no straight side
    vec2 d2 = R.xz; float a2 = max(dot(d2, d2), 1e-4), b2 = dot(pt, d2), rT = 46.0 + 6.0*wN2(vec2(atan(p.x, abs(p.y) + 1e-3)*3.0, uU*40.0));
    float h2 = b2*b2 - a2*(dot(pt, pt) - rT*rT), tq = (-b2 - sqrt(max(h2, 0.0)))/a2;
    float bil = wN2(vec2(p.x*0.045 + 3.0, tq*R.y*0.05 - uU*30.0)), bil2 = wN2(vec2(p.x*0.13, tq*R.y*0.12 + 7.0));
    float inT = smoothstep(0.0, 0.5*rT*rT, h2 + (bil - 0.5)*0.9*rT*rT);                                              // its flanks billow: no straight side
    float topT = 1.0 - smoothstep(0.55*uTower.x, uTower.x + 1.0, tq*R.y + (bil2 - 0.5)*0.3*uTower.x);                // its head fades raggedly
    refl = mix(refl, frothC*(0.45 + 0.5*bil2), 0.5*inT*step(0.0, tq)*topT*clamp(uTower.z, 0.0, 1.0)*(1.0 - clamp(uTower.y*1.4, 0.0, 1.0))); }
  vec3 col = uBody*0.5 + refl*fres;
  // every face of the swell that leans toward a sun takes a broad dull sheen of its colour; its crests glint
  float crest = smoothstep(0.25, 1.0, h0/max(uSwell, 0.1))*rough;
  col += (uRadA.rgb*uDisc.z*pow(sa, 9.0)*0.16 + uRadB.rgb*uDisc.w*pow(sb, 9.0)*0.12)*(0.2 + 0.8*fres)*(1.0 - 0.6*calm);
  col += (uSunACol*0.022*uDisc.z + uSunBCol*0.02*uDisc.w)*crest*(0.4 + 0.6*wN2(p*0.9 + vec2(t*0.5, 0.0)));
  // (polish 1, second part, R1) THE OCEAN'S BODY IS BLACK. A rule of the place: the sea takes a sun's colour only as that
  // sun's ROAD and as glints on the crests of its slow swell; between the roads it is black and glossy, as live has it
  // (no tint lies over the surface: no lit flanks, no paler backs, no sheens, no sprinkle of glints everywhere). A road
  // lies under its sun (the law of reflection: where the look runs toward that sun): broad, strong, made of glints that
  // come and go on the world's clock, and BROKEN BY THE SWELL: the swell's backs carry it, its troughs are black gaps
  { vec3 cA = uSunACol/max(max(uSunACol.r, uSunACol.g), max(uSunACol.b, 1e-3)), cB = uSunBCol/max(max(uSunBCol.r, uSunBCol.g), max(uSunBCol.b, 1e-3));
    float hs = h0/max(uSwell, 0.1);
    vec2 vh = V.xz/max(length(V.xz), 1e-3);
    float pA = pow(clamp(dot(vh, uAzA), 0.0, 1.0), 44.0), pB = pow(clamp(dot(vh, uAzB), 0.0, 1.0), 90.0);
    float g1 = wN2(p*5.3 + vec2(t*1.1, t*0.7)), g2 = wN2(p*11.9 - vec2(t*0.9, t*1.3));
    float spark = mix(smoothstep(0.5, 0.82, 2.0*g1*g2), 0.14, smoothstep(0.08, 0.9, fp));
    float back = mix(smoothstep(0.0, 0.7, hs + 0.4*(wN2(p/13.0 + vec2(t*0.15, 4.0)) - 0.5)), 0.45, smoothstep(2.0, 12.0, fp));      // (third part, P6) the crests of the slow swell carry the road: the upper part of each swell, the troughs black
    col += (uRadA.rgb*uDisc.z*pA + uRadB.rgb*uDisc.w*pB*1.1)*(0.04 + 0.96*spark)*back*rough*(1.0 - onElse*(1.0 - topElse));      // (third part, P2: nothing of it is added on the glass; P4: on a swelling only on its top)
    float sdA = pow(clamp(dot(vh, uAzA), 0.0, 1.0), 10.0), sdB = pow(clamp(dot(vh, uAzB), 0.0, 1.0), 16.0);      // (fourth part, D4: the crests' glints keep to the band of the road, a little wider than it; the third part let them lie over a sun's whole side)
    float few = mix(smoothstep(0.62, 0.9, 2.0*g1*g2), 0.06, smoothstep(0.08, 0.9, fp));
    col += (cA*0.22*uDisc.z*sdA*sdA + cB*0.2*uDisc.w*sdB*sdB)*crest*crest*few*(1.0 - onElse*(1.0 - topElse)); }      // glints gathered on the crests of the slow swell on a sun's side, nowhere else
  // foam nets: blood-pink cells whose walls thicken and thin on the 5.2 s breath; froth rafts drift among them
  float breath = 0.5 + 0.5*sin(t*1.2083 + 3.0*wN2(p/300.0));
  // THE BLACK OCEAN: foam is a thin, torn net gathered in the troughs over about a third of the open sea: soft-sided
  // strands along the walls of drifting, warped cells 4 to 9 m across, most of each wall missing (no closed cell, no
  // line of even width), swelling and thinning on the breath, with a little fine lace where the strands are thickest
  float trough = 0.55*wN2(p/120.0 + vec2(t*0.008, 0.0)) + 0.45*wN2(p/47.0 + 31.0) - 0.22*h0;
  float cover = smoothstep(0.54, 0.68, trough);                                   // about a third of the surface
  vec2 warp = 9.0*(vec2(wN2(p/21.0), wN2(p/21.0 + 5.0)) - 0.5) + 4.2*(vec2(wN2(p/5.3 + 2.0), wN2(p/5.3 + 8.0)) - 0.5);      // no cell keeps a straight wall
  vec2 pw = p + warp + vec2(t*0.11, t*0.04);
  float thick = (0.6 + 0.8*wN2(p/3.3 + 1.0))*(0.6 + 0.8*breath);                  // strands swell and thin on the breath
  vec2 k1 = wCells(pw/7.5), k2 = wCells(pw/2.4 + 7.0);
  float strand = smoothstep(0.5, 0.64, wN2(pw/3.9 + 13.0))*(1.0 - smoothstep(0.5, 0.62, k1.x));      // the net is torn: a strand runs a few metres and is gone, and none reaches a joint (near a cell's corner, far from its seed, the strand is broken)
  float l1 = (1.0 - smoothstep(0.01*thick, 0.17*thick + 0.16*fp, k1.y))*strand;
  float l2 = (1.0 - smoothstep(0.02*thick, 0.12*thick + 0.4*fp, k2.y))*smoothstep(0.25, 0.75, l1);      // fine lace only inside a strand
  float net = (0.75*l1 + 0.35*l2)*(0.6 + 0.4*wN2(p*0.9 + 3.0));
  net = mix(net, 0.08, smoothstep(0.6, 4.0, fp))*cover;
  float edge = smoothstep(0.02, 0.15, glass)*(1.0 - smoothstep(0.2, 0.6, glass));                               // the nets stop at the edge of the glass, gathered along it in a narrow broken line
  net = max(net*rough, edge*smoothstep(0.35, 0.65, wN2(p/9.0))*(0.45 + 0.5*max(l1, l2)));      // the stilled patch's foam edge: a broad broken band, seen from above
  vec2 pr2 = p + vec2(t*0.3, t*0.12), cr = wCells(pr2/11.0);                      // froth rafts 1 to 4 m across, drifting
  float rsz = 0.05 + 0.13*wH2(floor(pr2/11.0) + 3.0), rd = cr.x + 0.035*wN2(p*1.4);
  float raft = (1.0 - smoothstep(rsz, rsz + 0.02 + 0.03*fp, rd))*(1.0 - smoothstep(3.0, 12.0, fp))*step(0.55, wH2(floor(pr2/11.0)));
  float raftLit = 0.75 + 0.5*wN2(p*2.3) - 0.5*smoothstep(rsz*0.5, rsz, rd);
  vec3 lit = vec3(0.3, 0.27, 0.3) + uFill + 0.07*uSunACol*uDisc.z + 0.09*uSunBCol*uDisc.w;      // foam is matte: the sky's light on it, a little of each sun
  col = mix(col, mix(uRose, uFroth, 0.3)*lit*(0.65 + 0.7*wN2(p*1.9)), clamp(net, 0.0, 1.0));
  col = mix(col, uFroth*1.3*lit*raftLit, raft*rough);
  // the skirt: where the froth meets the sea it boils out over the glass in a ragged ring of foam, widest while the
  // tower stands and drawn back in as it falls away (the same reach as the lumps of the skirt in the hero part)
  { float az = atan(p.x, p.y + 1e-5), reach = uTower.w + 6.0 + 44.0*(1.0 - 0.6*uTower.y);
    float rag = 0.5*wN2(vec2(az*4.0, rr*0.05 - t*0.15)) + 0.3*wN2(vec2(az*11.0 + 5.0, rr*0.11 - t*0.3)) + 0.2*wN2(p*0.35 + vec2(t*0.2, 0.0));
    float sk = clamp(uTower.z, 0.0, 1.0)*(1.0 - smoothstep(0.55, 0.95, uTower.y))*(1.0 - smoothstep(reach*(0.35 + 0.75*rag), reach*(0.6 + 0.75*rag), rr));
    vec2 kc = wCells(p/3.1 + vec2(t*0.2, -t*0.13));
    col = mix(col, uFroth*1.5*lit*(0.7 + 0.5*wN2(p*0.7 + vec2(0.0, t*0.4))), sk*(0.5 + 0.5*smoothstep(0.1, 0.45, kc.y))); }
  // (polish 1, Q4) THE TOWER'S SLUMP STAYS ON THE SEA as a raft of froth: it spreads as the tower sloughs and breaks up
  // into pieces with widening leads as the last of the tower goes (both by the tower's own fall, uTower.y: 0.15 to
  // 0.8 and 0.6 to 1), shifted 45 m down the wind by the breaking; its pieces drift on down the wind on the world's clock.
  // (Fourth part, D4) It does not stay: when the last of the tower has gone the raft has gone with it
  { float slump = smoothstep(0.15, 0.8, uTower.y), brk = smoothstep(0.6, 1.0, uTower.y);      // (second part, R6 d) both by the tower's own fall, the hero's own uniform: no window of the flight
    vec2 pd = p - uWind*(45.0*brk); float rd = length(pd), R = uTower.w + 6.0 + 24.0*slump + 40.0*brk;
    float rag2 = 0.55*wN2(vec2(atan(pd.x, pd.y + 1e-5)*3.0, 2.0)) + 0.45*wN2(pd/31.0 + 4.0);
    float mass = slump*(1.0 - smoothstep(R*(0.35 + 0.6*rag2), R*(0.75 + 0.6*rag2), rd));
    // (second part, P5) CLUMPS OF FROTH OF UNLIKE SIZE, gathered and torn, the dark sea between them from the first: two
    // sets of rounded clumps (2 to 9 m and 1 to 3 m across, each of its own size, its outline bent), no plate, no band.
    // As the last of the tower goes every clump shrinks to nothing and the dark water between them widens (fourth part)
    vec2 pb = pd - uWind*(0.2*t) + 9.0*(vec2(wN2(pd/19.0 + 1.0), wN2(pd/19.0 + 6.0)) - 0.5);      // its pieces drift down the wind on the world's clock, 0.2 m/s
    vec2 kc2 = wCells(pb/8.5 + 5.0), kc3 = wCells(pb/3.9 + 11.0);
    float wob = 0.3*(wN2(pb/2.7 + 12.0) - 0.5), keepK = (1.0 - brk)*(0.55 + 0.45*mass);      // (fourth part, D4: every clump shrinks to nothing as the last of the tower goes; then the glass is bare, as live has it, and mirrors the trunks whole)
    float inA = (0.14 + 0.38*wH2(floor(pb/8.5 + 5.0)))*keepK - kc2.x - wob;
    float inB = ((0.08 + 0.34*wH2(floor(pb/3.9 + 11.0) + 3.0))*keepK - kc3.x - wob)*step(0.3, wH2(floor(pb/3.9 + 11.0) + 9.0));
    float inC = max(inA, inB), piece = smoothstep(0.0, 0.07, inC), thickF = smoothstep(0.0, 0.2, inC);
    // bubbles of two unlike sizes, in patches (the place bent first: no two rows run alike), under a mottle: thin and
    // rose at a clump's edge, heaped and pale in its middle; no drawn line, no even pavement
    vec2 kbA = wCells(pb/1.5 + vec2(t*0.04, 0.0)), kbB = wCells(pb/4.9 + 3.0);
    float big = smoothstep(0.42, 0.6, wN2(pb/9.0 + 7.0)), bub = mix(1.0 - smoothstep(0.1, 0.62, kbA.x), 1.0 - smoothstep(0.12, 0.7, kbB.x), big);
    vec3 raftC = mix(uRose*0.4, uFroth*0.95, thickF)*lit*(0.36 + 0.26*bub*(0.3 + 0.7*thickF) + 0.9*wN2(pd/6.0 + 3.0)*wN2(pd/1.3 + 8.0));
    col = mix(col, raftC, mass*piece*(0.92 - 0.3*brk)*(1.0 - smoothstep(8.0, 30.0, fp)*0.5)); }
  // the fall: where a piece drops into the floor a slow thick crown runs out (the same 30 m cells as the pieces)
  vec2 cell = floor(vec2(p.x/30.0, -p.y/30.0));
  float inHall = step(-4.5, cell.x)*step(cell.x, 3.5)*step(-0.5, cell.y)*step(cell.y, 20.5);
  float cT = 5.0 + 4.0*wH2(cell + 9.2), cph = fract(t/cT + wH2(cell + 2.9)), cact = smoothstep(0.0, 0.06, uSag - 0.5*wH2(cell + 6.6))*inHall*glass;
  vec2 cc = vec2((cell.x + 0.5)*30.0 + (wH2(cell + 1.3) - 0.5)*10.0, -(cell.y + 0.5)*30.0 + (wH2(cell + 5.1) - 0.5)*10.0);
  cc.x += sign(cc.x)*8.0;
  float ck = clamp((cph - 0.62)/0.38, 0.0, 1.0), cd = length(p - cc), cR = 2.0 + 22.0*ck;
  float crown = cact*step(0.62, cph)*(1.0 - ck)*(1.0 - ck)*exp(-min((cd - cR)*(cd - cR)/(2.5 + 6.0*ck), 30.0));      // a slow thick crown runs out
  float plug = cact*step(0.62, cph)*(1.0 - smoothstep(0.0, 0.35, ck))*(1.0 - smoothstep(2.0, 6.0, cd));
  // a thin dust of froth lies on the glass and takes the suns' light: where a pier blocks one sun the other's colour is left
  col += calm*uRose*0.026*(uSunACol*(1.0 - shA)*uDisc.z + uSunBCol*(1.0 - shB)*uDisc.w);
  // THE HALL'S TWO SHADOWS (polish 1, Q3 b). The floor takes each sun's light on the dust of froth that lies on it (the
  // glass more, the living sea a little); where the hall stands between the place and a sun that sun's light is gone
  // and the other's colour is left: the red sun's shadow is blue, the blue sun's is red. The films let half the light
  // through while they stand (they go as their own clock runs from 1 to 2)
  vec2 hA = wHallShade(p, uSunA, uDisc.x), hB = wHallShade(p, uSunB, uDisc.y);
  float films = 0.55*(1.0 - 0.5*(clamp(wFilmClock(0.25) - 1.0, 0.0, 1.0) + clamp(wFilmClock(0.75) - 1.0, 0.0, 1.0)));      // (second part, R6 e; third part, U6) the films that still stand, by the film's own clock, called: two films, a quarter and three quarters through the dealt lags, each going as its clock runs from 1 to 2
  float stands = 1.0 - wFallAt(p.y);      // (fourth part, D3 d) the shadow of a bay goes as the bay falls (the hall's own law, called)
  float inA = max(hA.x, films*hA.y)*uDisc.z*stands, inB = max(hB.x, films*hB.y)*uDisc.w*stands;
  vec3 nA = uSunACol/max(max(uSunACol.r, uSunACol.g), max(uSunACol.b, 1e-3)), nB = uSunBCol/max(max(uSunBCol.r, uSunBCol.g), max(uSunBCol.b, 1e-3));
  vec3 tA = mix(vec3(dot(nA, vec3(0.3, 0.5, 0.2))), nA, 0.6), tB = mix(vec3(dot(nB, vec3(0.3, 0.5, 0.2))), nB, 0.6);      // a sun's light on pale dust: its colour, a little greyed
  col += 0.007*calm*uRose*(tA*uDisc.z*(1.0 - inA) + tB*uDisc.w*(1.0 - inB))*(0.75 + 0.5*wN2(p/7.0 + 2.0));      // (second part, R1 b) a breath of light, a fifth of the first part's: the floor is black glass
  vec3 shadeV = max(vec3(1.0) - 0.32*inA*(vec3(1.0) - 0.6*nB*uDisc.w) - 0.32*inB*(vec3(1.0) - 0.6*nA*uDisc.z), vec3(0.25));
  col *= shadeV;
  col = mix(col, uFroth*1.5*lit*(0.8 + 0.4*wN2(p*1.3)), terr*calm*(0.3 + 0.7*max(l1, l2)));      // lace of froth round every pier's foot
  // (polish 1, Q3 c) what the hall gives back: fallen films as pale veined sheets, froth as rafts that gather under the
  // hall as its bays fall (more of them the further a bay's fall has gone) and drift down the wind, rings where one sank
  { vec3 flo = wFlotsam(p, t)*(1.0 - onElse); float gather = wFallAt(p.y)*wFoot(p)*(1.0 - onElse);
    vec2 pf = p - uWind*(t*0.25) + 3.0*(vec2(wN2(p/4.3 + 1.0), wN2(p/4.3 + 6.0)) - 0.5), cf = wCells(pf/13.0 + 3.3), idf = floor(pf/13.0 + 3.3);
    float rsF = 0.05 + 0.3*wH2(idf + 8.8)*wH2(idf + 2.2), rdF = cf.x + 0.05*wN2(p*1.4);                                  // 0.6 to 4.5 m, most of them small; lumpy, never round
    float raftF = (1.0 - smoothstep(rsF, rsF + 0.03 + 0.04*fp, rdF))*smoothstep(0.0, 0.1, 0.3*gather - wH2(idf + 5.5))*(1.0 - smoothstep(4.0, 14.0, fp));      // (fourth part, D3 d: three cells in ten at the most carry a raft; five before)
    vec3 sheetC = mix(uRose, uFroth, 0.6)*0.95*lit*flo.y*(0.85 + 0.3*wN2(p*1.1))*shadeV;
    col = mix(col, sheetC, 0.88*flo.x*(1.0 - smoothstep(6.0, 20.0, fp)));
    col = mix(col, uFroth*1.4*lit*shadeV*(0.75 + 0.5*wN2(p*2.3) - 0.4*smoothstep(rsF*0.4, rsF, rdF)), raftF);
    col += uFroth*0.07*lit*flo.z*(1.0 - smoothstep(2.0, 8.0, fp)); }
  col = mix(col, uFroth*1.5*lit, clamp(0.85*crown + plug + max(elA.z, elB.z), 0.0, 1.0));      // (live's line; fourth part, D3 a: after what floats, so live's crowns and plugs lie over it)
  // the light under the skin of the glass before it bursts, and the crests of the rings
  // (veins of light, the ocean's own: the place is bent twice before the pattern is read and the pattern is two fields
  // on lattices turned against each other, so no vein runs straight or turns square; they branch, and their width
  // and strength are unequal along them)
  vec2 pg = p + 26.0*(vec2(wN2(p/57.0 + 3.0), wN2(p/57.0 + 11.0)) - 0.5) + 7.0*(vec2(wN2(p/11.0 + 5.0), wN2(p/11.0 + 17.0)) - 0.5);
  vec2 pr = vec2(0.809*pg.x - 0.588*pg.y, 0.588*pg.x + 0.809*pg.y);
  float glv = 0.6*wN2(pg/31.0 + vec2(0.0, t*0.03)) + 0.4*wN2(pr/19.0 + vec2(7.0, -t*0.02));
  float glw = (1.0 - smoothstep(0.0, 0.025 + 0.06*wN2(p/37.0 + 2.0), abs(glv - 0.5)))*smoothstep(0.25, 0.6, wN2(p/63.0 + 8.0));
  col += uFroth*uShine*calm*exp(-min(rr/150.0, 30.0))*(0.04 + 0.5*glw*glw)*(0.35 + 0.65*(1.0 - fres));
  // (polish 1, Q3 d) every pier's foot stands in a skirt of froth: a ragged heap of bubbles as wide again as the pier.
  // (second part, R3: the veins of light that the first part ran from the piers' feet over the whole disc are gone)
  { float skirtF = 0.0;
    for (int i = 0; i < 13; i++) { vec4 pr = uPier[i]; float grown = smoothstep(pr.w + 0.1*uArch, pr.w + 0.8*uArch, uU);
      float d = length(vec2(abs(p.x) - pr.x, p.y - pr.y));
      skirtF = max(skirtF, grown*(1.0 - smoothstep(pr.z*0.9, pr.z*1.9, d + pr.z*0.8*(wN2(p*0.45 + 3.0) - 0.5)))); }
    vec2 kb = wCells(p/1.4 + vec2(t*0.05, 0.0)); col = mix(col, uFroth*1.5*lit*(0.62 + 0.5*smoothstep(0.04, 0.3, kb.y)), skirtF); }
  col += uFroth*0.16*ringEnv*max(ring, 0.0)*max(ring, 0.0)*(1.0 - smoothstep(1.0, 6.0, fp))*smoothstep(0.3, 0.7, wN2(p/23.0 + 4.0));      // the rings' crests: faint, broken glints, never drawn bands
  gl_FragColor = vec4(wFog(col, vW), 1.0);
}`;function be(b,R,i,c={}){const A=[],w=[];for(let t=0;t<=120;t++){const o=t===0?0:1.2*Math.pow(5416.666666666667,(t-1)/119);for(let x=0;x<150;x++){const N=x/150*Math.PI*2;A.push(Math.cos(N)*o,0,Math.sin(N)*o)}}for(let t=0;t<120;t++)for(let o=0;o<150;o++){const x=t*150+o,N=t*150+(o+1)%150,F=x+150,k=N+150;w.push(x,N,F,N,k,F)}const p=new e.BufferGeometry;p.setAttribute("position",new e.BufferAttribute(new Float32Array(A),3)),p.setIndex(w),p.boundingSphere=new e.Sphere(new e.Vector3,1e5);const g=i.arches.map(t=>new e.Vector4(t.w,t.z,4*t.s,t.birth)),n={...R,uDome:c.uDome||{value:new e.Vector4(1,1,9,0)},uTower:c.uTower||{value:new e.Vector4(0,0,0,0)},uCalm:{value:1},uRing:{value:0},uShine:{value:0},uSwell:{value:1},uArch:{value:ee.arch},uPier:{value:g},uBody:{value:new e.Color("#120609")},uShadA:{value:new e.Vector3(.6,.8,8)},uShadB:{value:new e.Vector3(-.6,.8,8)},uWind:{value:new e.Vector2(1,0)}};n.uElseA=c.uElseA||{value:new e.Vector4(0,0,1,0)},n.uElseB=c.uElseB||{value:new e.Vector4(0,0,1,0)};const S=new e.Mesh(p,new e.ShaderMaterial({uniforms:n,vertexShader:Q,fragmentShader:Y}));S.frustumCulled=!1,S.renderOrder=-3;const u=[0,0,0],s=[],f=24,l=48;for(let t=1;t<=f;t++)for(let o=0;o<l;o++){const x=o/l*Math.PI*2;u.push(Math.cos(x)*t/f,0,Math.sin(x)*t/f)}for(let t=0;t<l;t++)s.push(0,1+(t+1)%l,1+t);for(let t=1;t<f;t++)for(let o=0;o<l;o++){const x=1+(t-1)*l+o,N=1+(t-1)*l+(o+1)%l,F=x+l,k=N+l;s.push(x,N,F,N,k,F)}const a=new e.BufferGeometry;a.setAttribute("position",new e.BufferAttribute(new Float32Array(u),3)),a.setIndex(s),a.boundingSphere=new e.Sphere(new e.Vector3,1e5);const h=new e.Group;h.add(S);const z=[n.uElseA,n.uElseB].map(t=>{const o=new e.Mesh(a,new e.ShaderMaterial({uniforms:{...n,uMound:t},vertexShader:re,fragmentShader:Y}));return o.frustumCulled=!1,o.renderOrder=-3,o.visible=!1,o.userData.e=t,h.add(o),o});return{object:h,uniforms:n,mounds:z}}const le=560,E=1100,Z=10,_=1170,ne=.6,J=190,ie=`
${L}
${I}
attribute vec4 aW, aV;
varying vec3 vW, vN; varying float vR; varying vec4 vWk;      // vWk: place from its middle (0..1), kind, ring (0..1 as it spreads), seed
void main(){
  vec2 home = aW.xy; vR = aW.z;
  float s = fract(uTime/max(aV.z, 1.0) + aV.y), kind = aV.x, rho = position.x, th = position.y + aV.w*6.2832;
  float up = smoothstep(0.0, 0.28, s)*(1.0 - smoothstep(0.55, 0.8, s)), ringK = smoothstep(0.79, 0.82, s), ring = clamp((s - 0.8)/0.2, 0.0, 1.0);
  float live = 1.0 - wGlass(home);
  float R = aW.z*live, H = aW.w*up*live, q = clamp(1.0 - rho*rho, 0.0, 1.0);
  float lump = 0.75 + 0.5*wN2(home*0.7 + 3.0*vec2(cos(th), sin(th))*rho + aV.w*9.0);
  // a blister is a smooth low cap; a raft a flat lumpy plate; a knot a rounded heap of lumps, level at its top and at its foot
  float prof = kind < 0.5 ? q*(0.8 + 0.2*lump) : (kind < 1.5 ? (1.0 - rho*rho*rho*rho)*(0.3 + 0.9*lump*lump) : q*q*lump);
  float steep = kind < 0.5 ? 2.0*rho : (kind < 1.5 ? 4.0*rho*rho*rho : 4.0*rho*q);
  vec2 dir = vec2(cos(th), sin(th));
  float lobe = 0.55 + 0.9*wN2(aW.xy*0.37 + 1.3*vec2(cos(th), sin(th)) + aV.w*5.0);      // its outline is lobed: a blob, never an oval
  float Rr = mix(R*lobe*(0.3 + 0.7*smoothstep(0.0, 0.2, s)), R*(1.2 + 3.0*ring), ringK);
  vec2 xz = home + dir*rho*Rr;
  vec3 wp = vec3(xz.x, wSeaH(xz, uTime)*(1.0 - wCalm(xz)) + mix(H*prof - 0.25*(1.0 - up), 0.06, ringK), xz.y);
  vN = vec3(dir.x, 0.0, dir.y)*steep*H/max(Rr, 0.2)*(1.0 - ringK) + vec3(0.0, 1.0, 0.0);
  vW = wp; vWk = vec4(rho, kind, ringK*(1.0 - ring), aV.w);
  gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.0);
}`,he=`
${L}
${G}
uniform vec3 uBody;
varying vec3 vW, vN; varying float vR; varying vec4 vWk;
void main(){
  vec3 N = vN/max(length(vN), 1e-4), Vv = vW - cameraPosition; float dist = length(Vv); vec3 V = Vv/max(dist, 1e-3);
  if (dot(N, V) > 0.0) N = -N;
  float rho = clamp(vWk.x, 0.0, 1.0), kind = vWk.y, ringA = vWk.z;
  vec3 R = reflect(V, N); R.y = abs(R.y) + 0.002; R /= max(length(R), 1e-4);
  float om = 1.0 - clamp(dot(N, -V), 0.0, 1.0), fres = 0.07 + 0.93*om*om*om*om*om;
  float sa = clamp(dot(R, uSunA), 0.0, 1.0), sb = clamp(dot(R, uSunB), 0.0, 1.0);
  // (second part, R2) every kind is pale froth, lit by the two suns and the sky as the hall's froth is, never darker
  // than that; a blister is the same pale skin drawn smooth, with a soft sheen of each sun; foam lies at every foot
  float grain = wN(vW*1.3 + vWk.w*30.0);
  vec3 froth = (wFrothLight(mix(uRose, uFroth, 0.7)*(0.75 + 0.3*grain), N, V, 0.3) + uFroth*(uFill*0.8 + uAmbHi*0.5))*(0.3 + 0.26*smoothstep(0.35, 0.7, wN(vW*3.1 + 7.0)));
  vec3 skinP = froth*1.1 + (uRadA.rgb*uDisc.z*pow(sa, 40.0) + uRadB.rgb*uDisc.w*pow(sb, 60.0))*0.2*fres;
  float tornE = wN(vec3(vW.xz*0.45, vWk.w*9.0));
  float soft = 1.0 - smoothstep(mix(0.35, 0.7, step(kind, 0.5)), mix(0.9, 1.0, step(kind, 0.5)), rho + mix(0.9, 0.35, step(kind, 0.5))*(tornE - 0.5) + 0.2*(grain - 0.5));      // every foot runs out raggedly into the sea: a torn outline, never an oval
  soft *= mix(smoothstep(0.3, 0.52, wN(vec3(vW.xz*0.8, vWk.w*17.0)) + 0.55*(1.0 - rho)), 1.0, step(kind, 0.5));      // clumps: the froth is whole in the middle and in pieces toward the foot
  float foot = smoothstep(0.55, 0.9, rho + 0.3*(grain - 0.5));
  vec3 col = mix(kind < 0.5 ? skinP : froth, uFroth*(0.3 + uFill + 0.08*(uSunACol + uSunBCol)), 0.6*foot);
  // where it went under a ring spreads: a pale broken crest
  float crest = exp(-min((rho - 0.82)*(rho - 0.82)/0.006, 30.0))*smoothstep(0.3, 0.6, wN(vec3(vW.xz*0.8, vWk.w*9.0)));
  float al = mix(soft, 0.5*crest, step(1e-3, ringA))*mix(1.0, ringA, step(1e-3, ringA));
  col = mix(col, uFroth*(0.5 + uFill + 0.1*(uSunACol + uSunBCol)), step(1e-3, ringA));
  al *= 1.0 - smoothstep(0.35, 1.0, max(length(dFdx(vW.xz)), length(dFdy(vW.xz)))/max(vR, 0.5));      // smaller than a pixel: it goes over into the sea (the declared footprint fade)
  if (al < 0.01) discard;
  gl_FragColor = vec4(wFog(wKnee(col), vW)*al, al);
}`;function ye(b,R,i,c,m=[]){const w=[0,0,0],p=[];for(let r=1;r<=3;r++)for(let d=0;d<8;d++)w.push(r/3,d/8*Math.PI*2,0);for(let r=0;r<8;r++)p.push(0,1+r,1+(r+1)%8);for(let r=1;r<3;r++)for(let d=0;d<8;d++){const C=1+(r-1)*8+d,W=1+(r-1)*8+(d+1)%8,v=C+8,M=W+8;p.push(C,v,W,W,v,M)}const g=[],n=[];let S=0;const u=i.uPier?i.uPier.value:null,s=u?.5*(u[0].y+u[u.length-1].y):0;let f=1e9,l=-1e9,a=1e9,h=-1e9;for(const[r,,d]of m)f=Math.min(f,r),l=Math.max(l,r),a=Math.min(a,d),h=Math.max(h,d);const z=(r,d,C)=>{let W=1e12;if(r<f-C||r>l+C||d<a-C||d>h+C)return 1e6;for(let v=1;v<m.length;v++){const M=m[v-1][0],D=m[v-1][2],T=m[v][0]-M,B=m[v][2]-D,V=r-M,K=d-D,q=Math.min(1,Math.max(0,(V*T+K*B)/Math.max(T*T+B*B,1e-9))),P=V-q*T,H=K-q*B;W=Math.min(W,P*P+H*H)}return Math.sqrt(W)},t=(r,d)=>j(Math.sin(r*127.1+d*311.7)*43758.5453),o=(r,d)=>j(Math.sin(r*269.5+d*183.3+17)*43758.5453),x=r=>r*r*(3-2*r),N=(r,d)=>{const C=r/J,W=d/J,v=Math.floor(C),M=Math.floor(W),D=x(C-v),T=x(W-M),B=o(v,M)+(o(v+1,M)-o(v,M))*D,V=o(v,M+1)+(o(v+1,M+1)-o(v,M+1))*D;return B+(V-B)*T},F=[i.uElseA,i.uElseB].filter(Boolean).map(r=>r.value);for(let r=0;r<le;r++){const d=(c()-.5)*E,C=(c()-.5)*E,W=c(),v=c(),M=c(),D=c(),T=W<.45?0:W<.7?1:2,B=T===0?1.5+4.5*v*v:T===1?2+5*v*v:1+1.8*v,V=T===0?B*(.35+.3*D):T===1?.25+.1*B:B*(.3+.15*D),K=22+38*j(D*13.7+v*5.3);if(!u){g.push(d,C,B,V),n.push(T,M,K,D);continue}for(let q=Math.ceil((-_-d)/E);d+q*E<=_;q++)for(let P=Math.ceil((s-_-C)/E);C+P*E<=s+_;P++){const H=d+q*E,O=C+P*E;if(!(H*H+(O-s)*(O-s)>_*_)&&!(N(H,O)<ne)){if(F.some(U=>Math.hypot(H-U.x,O-U.y)<U.z+1.5*B)||m.length>1&&z(H,O,1.5*B+Z)<1.5*B+Z){S++;continue}g.push(H,O,B,V),n.push(T,j(M+t(q,P)),K,D)}}}const k=new e.InstancedBufferGeometry;k.setAttribute("position",new e.BufferAttribute(new Float32Array(w),3)),k.setIndex(p),k.setAttribute("aW",new e.InstancedBufferAttribute(new Float32Array(g),4)),k.setAttribute("aV",new e.InstancedBufferAttribute(new Float32Array(n),4)),k.instanceCount=g.length/4,k.boundingSphere=new e.Sphere(new e.Vector3,1e5);const X=new e.ShaderMaterial({uniforms:i,vertexShader:ie,fragmentShader:he,side:e.DoubleSide,transparent:!0,depthWrite:!1,blending:e.CustomBlending,blendSrc:e.OneFactor,blendDst:e.OneMinusSrcAlphaFactor,blendSrcAlpha:e.OneFactor,blendDstAlpha:e.OneMinusSrcAlphaFactor}),$=new e.Mesh(k,X);return $.frustumCulled=!1,{object:$,count:g.length/4,left:S}}const j=b=>b-Math.floor(b),ce=`
varying vec3 vD;
void main(){ vD = position; vec4 p = projectionMatrix*viewMatrix*vec4(position + cameraPosition, 1.0); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p; }`,pe=`
${L}
${G}
uniform float uStars;
varying vec3 vD;
void main(){
  vec3 d = vD/max(length(vD), 1e-3);
  vec3 col = wSky(d);
  vec2 hz = d.xz/max(length(d.xz), 1e-3);
  float toA = clamp(dot(hz, uAzA)*0.5 + 0.5, 0.0, 1.0), toB = clamp(dot(hz, uAzB)*0.5 + 0.5, 0.0, 1.0);
  // a few short thin wisps of cloud, high up: red-lit on the flank toward sun A, taking sun B's colour as it comes
  float az = atan(d.x, -d.z + 1e-5), el = clamp(d.y, 0.0, 1.0);
  float cl = smoothstep(0.76, 0.98, wN2(vec2(az*3.6 + uTime*0.004, el*52.0 + 3.0)) + 0.2*wN2(vec2(az*9.0 - uTime*0.01, el*90.0)))*smoothstep(0.14, 0.26, el)*(1.0 - smoothstep(0.36, 0.55, el));      // thin, few, soft-edged, broken along their length: wisps, never rings
  vec3 cloudLit = uZen*1.5 + uSunACol*0.22*toA*toA + uSunBCol*0.2*toB*toB;
  col = mix(col, cloudLit, cl*0.26);
  // overhead the two suns' glows meet: red from A's side, blue from B's, a deep violet where they mix across the zenith
  col += (uSunACol*0.012*(0.3 + 0.7*toA) + uSunBCol*0.016*(0.3 + 0.7*toB) + vec3(0.026, 0.008, 0.046))*smoothstep(0.02, 0.75, el);
  // high thin vapour, in broad soft slow fields (no bands): it takes red on the side toward A and blue toward B
  { vec2 q = d.xz/(el + 0.35);
    float vp = 0.6*wN2(q*1.1 + vec2(uTime*0.003, 7.0)) + 0.4*wN2(q*2.7 - vec2(3.0, uTime*0.004));
    vp = smoothstep(0.45, 0.85, vp)*smoothstep(0.2, 0.6, el);
    col += vp*(uSunACol*0.022*toA + uSunBCol*0.028*toB + uZen*0.25); }
  // (polish 1, Q2 b; second part, R1 d) A FEW BANDS OF CLOUD lie low over the horizon: dark bodies, lit a little from
  // beneath in each sun's colour on that sun's side (the under side of a band is where it thickens upward). The sky's
  // own colours are live's: nothing else is added to them
  { float bn = wN2(vec2(az*2.4 + uTime*0.002, el*34.0 + 11.0)) + 0.35*wN2(vec2(az*7.0 - uTime*0.003, el*80.0));
    float bu = wN2(vec2(az*2.4 + uTime*0.002, (el + 0.014)*34.0 + 11.0)) + 0.35*wN2(vec2(az*7.0 - uTime*0.003, (el + 0.014)*80.0));
    float win = smoothstep(0.035, 0.07, el)*(1.0 - smoothstep(0.2, 0.32, el));
    float bandB = smoothstep(0.92, 1.12, bn)*win, under = clamp((bu - bn)*5.0, 0.0, 1.0)*smoothstep(0.86, 1.06, bn)*win;      // (second part, R1 d) dark and few
    col *= 1.0 - 0.5*bandB;
    col += under*(uSunACol*0.08*toA*toA*toA*uDisc.z + uSunBCol*0.065*toB*toB*toB*uDisc.w); }
  // sun A: a big dull disc, flattened and banded by the haze, soft enough to look at
  vec3 da = d - uSunA; da.y *= 1.3; float angA = length(da)*57.3;
  float discA = 1.0 - smoothstep(uDisc.x*0.88, uDisc.x*1.06, angA);
  float band = 0.72 + 0.28*sin(da.y*520.0 + 2.0*sin(da.x*40.0));
  col += uRadA.rgb*uRadA.w*discA*band*uDisc.z;
  col += uRadA.rgb*uDisc.z*(0.5*exp(-angA*0.42) + 0.16*exp(-angA*0.1));
  // sun B: a small fierce disc with a wide silver glow
  float angB = length(d - uSunB)*57.3, upB = smoothstep(-0.11, 0.0, uSunB.y);
  col += uRadB.rgb*uRadB.w*(1.0 - smoothstep(uDisc.y*0.8, uDisc.y*1.25, angB))*uDisc.w;
  col += uRadB.rgb*upB*(1.6*exp(-angB*0.9) + 0.42*exp(-angB*0.16) + 0.1*exp(-angB*0.05));
  // forty faint stars near the zenith, gone as the second sun comes
  vec2 sg = d.xz/max(d.y, 0.2)*7.0; vec2 si = floor(sg), sf = fract(sg) - 0.5;
  float star = step(0.9, wH2(si))*smoothstep(0.45, 0.7, d.y)*(1.0 - smoothstep(0.012, 0.04, length(sf - 0.3*(vec2(wH2(si + 3.0), wH2(si + 9.0)) - 0.5))));
  col += vec3(0.6, 0.56, 0.75)*star*uStars*(0.6 + 0.4*sin(uTime*2.0 + wH2(si)*40.0));
  gl_FragColor = vec4(col, 1.0);
}`;function Ae(b,R){const i={...R,uStars:{value:1}},c=new e.Mesh(new e.SphereGeometry(8200,48,24),new e.ShaderMaterial({uniforms:i,vertexShader:ce,fragmentShader:pe,side:e.BackSide,depthWrite:!1,depthTest:!1}));return c.renderOrder=-10,c.frustumCulled=!1,{object:c,uniforms:i}}const ue=`
varying vec3 vW, vN;
void main(){ vec4 wp = modelMatrix*vec4(position, 1.0); vW = wp.xyz; vN = mat3(modelMatrix)*normal; gl_Position = projectionMatrix*viewMatrix*wp; }`,de=`
${L}
${G}
uniform vec4 uFar;      // haze kept (0..1 of the fog), pulse, metal 0..1, extra light from sun B (the Station is high and catches the dawn first)
uniform vec3 uTint;
varying vec3 vW, vN;
void main(){
  vec3 N = vN/max(length(vN), 1e-4); vec3 Vv = vW - cameraPosition; vec3 V = Vv/max(length(Vv), 1e-3);
  float da = clamp(dot(N, uSunA)*0.6 + 0.4, 0.0, 1.0), db = clamp(dot(N, uSunB)*0.6 + 0.4, 0.0, 1.0);
  vec3 amb = mix(uAmbLo, uAmbHi, clamp(N.y*0.5 + 0.5, 0.0, 1.0));
  vec3 col = uTint*(amb + uFill*(0.6 + 0.8*uFar.z) + 0.6*uSunACol*da*da + 0.6*(uSunBCol + vec3(0.74, 0.83, 1.0)*uFar.w)*db*db);
  float rim = 1.0 - clamp(dot(N, -V), 0.0, 1.0);
  col += uTint*uFar.z*rim*rim*rim*(uSunACol*clamp(dot(N, uSunA), 0.0, 1.0) + (uSunBCol + vec3(0.74, 0.83, 1.0)*uFar.w)*clamp(dot(N, uSunB), 0.0, 1.0))*1.5;
  col += uPulseCol*uFar.y*0.35*smoothstep(0.8, 1.0, sin(vW.y*0.012 - uTime*1.2083));
  // far things are ghosts: what is left of them after the air (and, low down, the haze that lies on the sea) is laid
  // over the sky behind them, a little paler than it
  float mist = exp(-max(vW.y, 0.0)/90.0)*smoothstep(1500.0, 4000.0, length(Vv));
  float keep = 1.0 - max(wFogAmt(vW)*uFar.x, 0.92*mist);
  vec3 sk = wSky(vec3(V.x, max(V.y, 0.0) + 0.01, V.z)/max(length(vec3(V.x, max(V.y, 0.0) + 0.01, V.z)), 1e-4));
  // ... a little paler than it: a far thing is never darker than the sky behind it, and the further the fainter
  float farK = smoothstep(1500.0, 6000.0, length(Vv));
  vec3 pale = max(col*1.3 + uTint*0.15*farK, sk*(1.0 + 0.3*farK) + 0.035*farK);
  gl_FragColor = vec4(sk + (pale - sk)*keep*(1.0 - 0.4*farK), 1.0);
}`;function fe(b,R,i,c,m,y){const A=c.length/3,w=b.length,p=new e.Vector3,g=new e.Vector3,n=new e.Vector3,S=new e.Vector3(1,0,0),u=new e.Vector3(0,0,1);for(let s=0;s<w;s++){const f=b[Math.max(0,s-1)],l=b[Math.min(w-1,s+1)],a=b[s];p.set(l[0]-f[0],l[1]-f[1],l[2]-f[2]).normalize(),g.crossVectors(p,Math.abs(p.z)>.9?S:u).normalize(),n.crossVectors(p,g);const h=typeof R=="function"?R(s/(w-1)):R;for(let z=0;z<i;z++){const t=z/i*Math.PI*2,o=Math.cos(t),x=Math.sin(t),N=g.x*o+n.x*x,F=g.y*o+n.y*x,k=g.z*o+n.z*x;c.push(a[0]+N*h,a[1]+F*h,a[2]+k*h),m.push(N,F,k)}}for(let s=0;s<w-1;s++)for(let f=0;f<i;f++){const l=A+s*i+f,a=A+s*i+(f+1)%i,h=l+i,z=a+i;y.push(l,h,a,a,h,z)}}const me=(b,R,i,c,m=0,y=18)=>{const A=[];for(let w=0;w<=y;w++){const p=-1+2*w/y,g=Math.sign(p)*(1-Math.pow(1-Math.abs(p),1.8)),n=1-(Math.cosh(2.4*g)-1)/(Math.cosh(2.4)-1);A.push([b+(R-b)*(.5+.5*g),m+c*n,i])}return A};function we(b,R,i){const c=(m,y,A,w,p,g)=>{const n=b.length/3,S=6*g;for(let u=0;u<=S;u++){const s=u/S,f=m+(y-m)*s,l=1-.45*s,a=Math.abs(Math.sin(Math.PI*g*s)),h=w*l,z=p*l+(h-p*l)*.78*Math.sqrt(a);b.push(f,h,A,f,z,A),R.push(0,.3,1,0,0,1)}for(let u=0;u<S;u++){const s=n+2*u;i.push(s,s+1,s+2,s+1,s+3,s+2)}};for(let m=0;m<9;m++){const y=Math.pow(.88,m),A=-70*(1-y)/.12,w=150*y,p=34*y,g=me(-p,p,A,w);fe(g,n=>8*y*(.6+.9*Math.abs(2*n-1)),6,b,R,i);for(const n of[-1,1])[[.3,0,230,5],[.54,.3,160,4],[.76,.54,90,3]].forEach(([S,u,s,f])=>c(n*p*.7,n*(p+s*y),A,S*w,u*w,f))}}async function ke(b,R,i={}){const c=new e.Group,m=i.forks.older,y=i.forks.far,A=(a,h)=>new e.ShaderMaterial({uniforms:{...R,uFar:{value:new e.Vector4(...a)},uTint:{value:new e.Color(h)}},vertexShader:ue,fragmentShader:de,side:e.DoubleSide}),w=[],p=[[-2400,-5200,2.6,.3]];for(let a=1;a<(i.structures??1);a++){const h=(m()-.5)*2.4,z=5200+2600*m();p.push([Math.sin(h)*z,-Math.cos(h)*z,1.5+.9*m(),(m()-.5)*2])}const g=y()*Math.PI*2,n=[y()*6.2832,y()*6.2832,y()*6.2832,y()*6.2832];for(const[a,h,z,t]of p){const o=[],x=[],N=[];we(o,x,N);const F=new e.BufferGeometry;F.setAttribute("position",new e.BufferAttribute(new Float32Array(o),3)),F.setAttribute("normal",new e.BufferAttribute(new Float32Array(x),3)),F.setIndex(N);const k=new e.Mesh(F,A([.96,0,0,0],"#D9C8CC"));k.position.set(a,-20*w.length,h),k.scale.setScalar(z*1.8),k.rotation.y=t,c.add(k),w.push(k),await b.yield()}const S=new e.Mesh(new e.SphereGeometry(1,24,10,0,Math.PI*2,0,Math.PI/2),A([.5,0,0,0],"#E6DADC"));S.position.set(3800,-6,-4800),S.scale.set(760,96,520),c.add(S);const u=new e.Mesh(new e.SphereGeometry(1,40,14),A([1,0,0,0],"#9A8790")),s=i.side??-1;u.position.set(s*1200,-20,-650),u.scale.set(190,80,900),u.rotation.y=s*.06,c.add(u);const f=[];for(let a=0;a<=10;a++){const h=-Math.PI/2+a/10*Math.PI;f.push(new e.Vector2(100*Math.pow(Math.cos(h),.55)+.01,14*Math.sin(h)))}const l=new e.Mesh(new e.LatheGeometry(f,30),A([.45,0,1,0],"#B9BCC8"));return l.position.set(800,820,-2700),l.rotation.set(.1,0,.07),c.add(l),await b.yield(),{object:c,station:l,swelling:u,older:w,mound:S,update(a,h,z){u.position.y=-30+12*Math.sin(h*9+n[3]);const t=g+a*1.7/400;l.position.set(800+400*Math.cos(t),820+6*Math.sin(a*.21+n[0]),-2700+400*Math.sin(t)),l.rotation.set(.1+.03*Math.sin(a*.17+n[1]),a*.05,.07+.03*Math.sin(a*.13+n[2])),l.material.uniforms.uFar.value.w=z}}}export{Z as WORK_CLEAR,ne as WORK_GROUP,J as WORK_LANE,le as WORK_N,_ as WORK_REACH,E as WORK_TILE,ke as buildFar,be as buildSea,Ae as buildSky,ye as buildWork,xe as seaLib,ge as seaVS};
