import*as x from"three";import{makePath as ro,clamp as $,lerp as E,smoothstep as z}from"../kit/core.js";import{buildHero as io}from"../parts/pointillist-nursery.js";import{DECK_GLSL as lo}from"../parts/pointillist-nursery.js";const F=Math.PI*2,co={rose:{name:"Nursery of Dots",pal:["#141A3C","#2B3FA8","#5B3C9E","#1F8F78","#E0607E","#F28A2E","#FFF4C2"],primeK:2.2,glow:0,portal:"#FFF4C2"},gold:{name:"Nursery of Dots, Gold and Teal",pal:["#10203A","#1C5F8E","#6A3FA0","#17A096","#E7A63C","#F27F22","#FFF0B4"],primeK:2.2,glow:.04,portal:"#FFF0B4"},nocturne:{name:"Nursery of Dots, Nocturne",pal:["#0C1130","#2536A6","#4B2F96","#24489E","#6C48B4","#E8842E","#FFEEB8"],primeK:2.4,glow:-.02,portal:"#FFEEB8"},dawn:{name:"Nursery of Dots, Dawn Canvas",pal:["#D8CCB2","#4F6FC4","#8E6FC0","#35B8AC","#EE86A2","#F59A52","#FFF7D6"],primeK:1,glow:.1,portal:"#FFF7D6"}},Ra={rose:1,gold:1,nocturne:.35,dawn:1},ho=!0,fo=`
varying vec3 vDir;
void main(){
  vDir = position;
  vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.);
  gl_Position = p;
}`,uo=`
uniform vec3 uPig[12];
uniform vec3 uCluster[5];
uniform vec3 uKey;
uniform mat3 uRot;
uniform vec3 uHeroDir;
uniform vec3 uFlank[4];
uniform float uTime, uN, uManner, uPrimeK, uGlow, uSpark, uFlankK, uNarrow;
uniform vec3 uCam, uDeckK, uDeckDeep;   // uDeckK: the deck's world height, pixels per radian, unused
uniform vec4 uDeckPh, uFoot[12];        // uFoot: a pillar's foot on the deck (x, z, radius, length of its painted shadow)
uniform vec2 uLh;                       // the key direction laid flat
uniform vec4 uBank[12];                  // a bank of gas hanging over the deck: (x, z, radius of the ground under it, how near the deck it hangs)
varying vec3 vDir;
vec3 turn(vec3 d, float a, float b){
  float ca = cos(a), sa = sin(a), cb = cos(b), sb = sin(b);
  d = vec3(d.x * ca - d.y * sa, d.x * sa + d.y * ca, d.z);
  return vec3(d.x, d.y * cb - d.z * sb, d.y * sb + d.z * cb);
}
float h31(vec3 p){ p = fract(p * vec3(.1031, .1030, .0973)); p += dot(p, p.yxz + 33.33); return fract((p.x + p.y) * p.z); }
float vn(vec3 p){
  vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  float a = mix(mix(h31(i), h31(i + vec3(1,0,0)), f.x), mix(h31(i + vec3(0,1,0)), h31(i + vec3(1,1,0)), f.x), f.y);
  float b = mix(mix(h31(i + vec3(0,0,1)), h31(i + vec3(1,0,1)), f.x), mix(h31(i + vec3(0,1,1)), h31(i + vec3(1,1,1)), f.x), f.y);
  return mix(a, b, f.z);
}
// one generation of dots: (hash, hash2, mask)
vec3 gen(vec3 d, float n, float seed){
  vec3 p = d * n + seed; vec3 c = floor(p); vec3 f = p - c - .5;
  float h = h31(c + seed), h2 = h31(c + seed + 19.7);
  vec3 q = f - (vec3(h, h2, fract(h * 7.13 + h2 * 3.7)) - .5) * .16;
  float dl = (uManner > .5 && uManner < 1.5) ? max(abs(q.x), max(abs(q.y), abs(q.z))) * 1.22 : length(q);
  return vec3(h, h2, step(dl, .545 + .05 * h2));   // three lattices of these cover well over nine tenths: the wall fuses
}
// Three tiers of tone and the edge between two of them. Inside a tier the hue varies and the value stays close, and
// the tints are pale, so that from across the nebula the wall fuses into quiet graded tone: pearl (pale rose beside
// pale viridian, a little gold), pale ultramarine (a little pale rose and rose pricked through), and the deep
// (ultramarine and violet, a few rose sparks); where the pale ultramarine meets the deep the two are laid side by
// side in a narrow edge, one hue in two values.
// The strongest lights (lemon) and the deepest darks (the dark violet, the priming) are left to the forms in front.
float pick(float g, float h){
  if (g > .70) return h < .48 ? 7. : h < .90 ? 11. : 9.;
  if (g > .46) return h < .84 ? 5. : h < .93 ? 7. : 6.;
  if (g > .40) return h < .5 ? 5. : h < .8 ? 2. : 3.;
  return h < .50 ? 2. : h < .88 ? 3. : h < .88 + uSpark ? 6. : 2.;
}
// ---------- the deck: the level top of the dark cloud the pillars rise from, painted where it lies in the world ----------
// (a plane at one world height; the same swells, rollers, gaps, feet, lights and painted shadows are laid in real dabs by the world)
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float swell(vec2 p){
  vec2 q = p * .001;
  return .5 * sin(q.x * 1.1 + 1.3 * sin(q.y * .7 + uDeckPh.x)) * sin(q.y * 1.3 + uDeckPh.y)
    + .3 * sin(q.x * 2.3 + q.y * 1.7 + uDeckPh.z) + .2 * sin(q.y * 4.1 - q.x * 2.9 + uDeckPh.w);
}
float ripple(vec2 p){ vec2 q = p * .001; return sin(q.x * 9.7 + q.y * 6.1 + uDeckPh.y * 3.) * sin(q.y * 8.3 - q.x * 3.9 + uDeckPh.z * 2.); }
float gapF(vec2 p){ vec2 q = p * .001; return sin(q.x * .83 + uDeckPh.w * 2. + .9 * sin(q.y * .61 + uDeckPh.x * 3.)) * sin(q.y * .97 + uDeckPh.z * 5. + .8 * sin(q.x * .53)); }
// the rollers of the cloud top: long ridges some 1200 m from crest to crest, a sharp crest and a round trough, the
// crests lying square to the key so that every one has a face turned to the cluster and a face turned away; they
// wander, and the broad swell bends them. (al, ac: kilometres toward the key and across it, from the foot of the hero pillar)
float roll(vec2 p, float s0){
  vec2 q = p * .001; float al = dot(q, uLh), ac = q.x * uLh.y - q.y * uLh.x;
  float ph = al * 2.6 + .75 * sin(ac * 1.1 + uDeckPh.x) + .4 * sin(ac * 2.9 + al * 1.3 + uDeckPh.z) + .9 * sin(al * .8 + ac * .5 + uDeckPh.y) + .6 * s0;
  // (no roller runs on for ever: each is a billow some 1300 m long, and the billows of one rank stand between those of the next)
  float bead = smoothstep(.1, .8, .5 + .5 * sin(ac * 2.3 + .5 * ph + 1.1 * sin(al * .9 + uDeckPh.w) + uDeckPh.x * 2.));
  return (1. - abs(sin(ph))) * bead;
}
// tone of the deck at a place, 0 deep .. 1 light: slopes turned to the key are lighter and the creases between the
// rollers deep; a broad reach of ground on the side the cluster's light comes from is lighter; each pillar lays a
// painted shadow away from the key, and the far lip of a gap catches the light.
// warm: the burning rim of a pillar lights the ground round its foot on the side turned to the key, thinning away.
// gas: the bank of gas that hangs over a place tints it (x rose, under the side of the bank turned to the key;
// y viridian, under the side turned away).
float deckTone(vec2 p, float dist, out float gap, out float warm, out vec2 gas){
  float e = 40.;
  float s0 = swell(p), r0 = ripple(p), near = .04;
  vec2 grad = vec2(swell(p + vec2(e, 0.)) - s0 + near * (ripple(p + vec2(e, 0.)) - r0), swell(p + vec2(0., e)) - s0 + near * (ripple(p + vec2(0., e)) - r0)) / e;
  float alK = dot(p, uLh), acK = p.x * uLh.y - p.y * uLh.x;   // metres toward the key and across it, from the foot of the hero pillar
  float ro = roll(p, s0), lr = (ro - roll(p + uLh * e, swell(p + uLh * e))) * 10.;
  float amp = .25 + .75 * (.5 + .5 * sin(acK * .0009 + alK * .0005 + uDeckPh.w));   // (the rollers run high in some reaches and low in others)
  amp *= 1. - smoothstep(3500., 9000., dist);   // (and far off they are too fine to paint: the broad forms carry the distance)
  // (a roller's two faces are planes: one lit from crest to trough, one in shade, and the crest between them a sharp line)
  float t = .45 + .07 * s0 - 100. * dot(grad, uLh) + amp * (.26 * smoothstep(0., .45, lr) - .2 * smoothstep(0., .45, -lr) + .1 * (ro - .4));
  t += .18 * smoothstep(-2500., 3000., alK) * (1. - .6 * smoothstep(2500., 6000., abs(acK)));
  float sh = 0., keep = 1.;
  warm = 0.;
  for (int i = 0; i < 12; i++) {
    vec4 ft = uFoot[i];
    if (ft.z > 0.) {
      vec2 rel = p - ft.xy; float al = -dot(rel, uLh), ac = abs(rel.x * uLh.y - rel.y * uLh.x), dl = length(rel);
      sh = max(sh, smoothstep(-ft.z, ft.z * .6, al) * (1. - smoothstep(ft.w * .55, ft.w, al)) * (1. - smoothstep(ft.z * .7, ft.z * 1.2 + al * .06, ac)));
      keep *= smoothstep(ft.z * 2., ft.z * 5., dl);
      warm = max(warm, (1. - smoothstep(ft.z * .9, ft.z * 3.4, dl)) * smoothstep(-.25, .55, -al / max(dl, 1.)));
    }
  }
  gas = vec2(0.);
  for (int i = 0; i < 12; i++) {
    vec4 bk = uBank[i];
    if (bk.z > 0.) {
      vec2 rel = p - bk.xy;
      float w = bk.w * (1. - smoothstep(bk.z * .3, bk.z * 1.1, length(rel))), sd = smoothstep(-.4, .4, dot(rel, uLh) / bk.z);
      gas += w * vec2(sd, 1. - sd);
    }
  }
  float gf = gapF(p) * keep;
  gap = smoothstep(.9, .93, gf);
  t += 2.2 * (gapF(p + uLh * 60.) * keep - gf) * smoothstep(.7, .9, gf) - .42 * sh;
  warm *= 1. - sh;
  return clamp(t, 0., 1.);
}
vec3 cell2(vec2 g, float rad, float seed){
  float row = floor(g.y); g.x += .5 * mod(row, 2.);
  vec2 id = floor(g), f = fract(g) - .5;
  float h = h21(id + seed), h2 = h21(id + seed + 17.3);
  return vec3(h, h2, step(length(f - (vec2(h, h2) - .5) * .4), rad * (.86 + .3 * h2)));
}
${lo}
float wallTone(vec3 dw);
vec3 deckPaint(vec3 dw){
  float hgt = max(uCam.y - uDeckK.x, 1.), t = hgt / max(-dw.y, 1e-4);
  vec2 p = uCam.xz + dw.xz * t;
  float gap, warm; vec2 gas;
  float tone = deckTone(p, t, gap, warm, gas);
  // the law of distance (by t, the metres to the place, alone): toward the level line the ground goes paler and
  // nearer the tones of the wall that stands over it, its lights sparser and its neighbours closer in value
  float air = deckAir(t);
  // dots laid on the plane, sized as the hulls' dots are (a few pixels deep at any distance): far off they lie flat, as bands
  float cw = max(4. * t * t / (hgt * uDeckK.y), 9. * t / uDeckK.y);
  float lg = log2(max(cw, 1.)), i = floor(lg), f = lg - i, cA = exp2(i);
  vec3 a = cell2(p / cA, .5 * (1. - smoothstep(.45, 1., f)), 0.), b = cell2(p / (cA * 2.) + 3.7, .5 * smoothstep(0., .55, f), 40.);
  vec3 k = vec3(.5, .5, 0.);
  if (b.z > .5) k = b;
  if (a.z > .5) k = a;
  // Far off the plane's cells would lie flat as long dashes, so from about 5 km the dots are the wall's own: laid on
  // the sphere of directions, round at any range, a coarser generation through the middle distance and the wall's
  // fine one from about 8.5 km (the changes of generation wander with a slow noise of the direction: no ruled line).
  // What a dot is painted with is still the place on the plane it lies over.
  float sw = t * .001 + 1.2 * (vn(dw * 23.) - .5);
  vec3 dq = uRot * dw;
  if (sw > 5.) {
    float n = sw > 8.5 ? uN : uN * .5, sd = sw > 8.5 ? 0. : 57.;
    vec3 c3 = gen(turn(dq, 1.1, .7), n * 1.5, 31.7 + sd), b3 = gen(turn(dq, -.6, 2.1), n * .9, 11.3 + sd), a3 = gen(turn(dq, .37, -.52), n, sd);
    k = vec3(.5, .5, 0.);
    if (c3.z > .5) k = c3;
    if (b3.z > .5) k = b3;
    if (a3.z > .5) k = a3;
  }
  // the tiers of tone are the deck's rule (deckPick); a dot strays less from its tier the farther off it lies
  float T = deckFarT(tone * 5. + (k.y - .5) * .6 * (1. - .6 * air), air), pig = deckPick(T, k.x, air);
  float h3 = fract(k.x * 57.31 + k.y * 7.7), h4 = fract(k.x * 23.17 + k.y * 41.3), h5 = fract(k.x * 91.7 + k.y * 13.1);
  bool pool = gap > .5 && h5 > smoothstep(.3, .7, air);   // (a gap far off is dotted over, dot by dot: no dark dash lies on the pale distance)
  bool deep = pool || T < 1.;
  if (pool) pig = k.x < .7 ? 0. : uLandDeep;
  else if (T >= 1.) {
    // the gas overhead: rose, or viridian, laid dot beside dot among the deck's own (their pale tints on a lit slope)
    float gs = gas.x + gas.y;
    if (h4 < .5 * min(gs, 1.) * (1. - .7 * air)) pig = fract(h4 * 37.3) * gs < gas.x ? (T < 3.2 ? 6. : 7.) : (T < 3.2 ? 4. : 11.);
    // the burning rim near by: lemon and gold closest to the foot, then orange, then rose, beside the deck's own
    // ultramarine and violet
    if (h3 < .7 * warm * uLandWarm * (1. - .7 * air)) {
      float heat = warm + (k.y - .5) * .3;
      pig = heat > .72 ? (k.x < .34 ? 10. : k.x < .64 ? 9. : 8.) : heat > .42 ? (k.x < .48 ? 8. : k.x < .8 ? 6. : 9.) : (k.x < .55 ? 6. : k.x < .8 ? 8. : 7.);
    }
  }
  float br = .93 + .07 * sin(uTime * (.35 + k.x * .9) + k.y * 90.);
  vec3 col = pig < .5 ? uDeckDeep : uPig[int(pig + .5)] * (.88 + .14 * k.y) * br;
  // between the dots: the tier's own darker neighbour beside us; with distance the next lighter, so that dot and
  // ground draw together (the switch is dithered cell by cell, never a ruled line)
  float hb = sw > 5. ? h31(floor(dq * uN * .25) + 3.1) : h21(floor(p / 160.) + 7.3);
  bool farB = hb < air * 1.5 - .25;
  if (k.z < .5) col = deep ? uDeckDeep : T < 3.2 ? uPig[farB ? 2 : int(uLandDeep + .5)] * .9 : farB ? uPig[5] * .8 : uPig[2] * .9;
  // the last of the ground before the level line is painted in the wall's own pigments, those of the wall just
  // above the level line in the same direction: ground and wall meet in one band of fused dots
  float sB = smoothstep(.9, .985, air);
  if (sB > 0.) {
    float gh = wallTone(normalize(vec3(dw.x, 0., dw.z)));
    if (k.z > .5) { if (h5 < sB) col = uPig[int(pick(gh + (k.y - .5) * .13, k.x) + .5)] * (.9 + .14 * k.y) * (.9 + .1 * sin(uTime * (.35 + k.x * .9) + k.y * 90.)); }
    else if (hb < sB * 1.2 - .1) col = gh > .70 ? uPig[5] * .95 : gh > .46 ? uPig[5] * .8 : gh > .40 ? uPig[2] : uPig[0] * uPrimeK * .9;
  }
  return col;
}
// the tone of the wall in a direction of the world (its tiers are read off it by pick)
float wallTone(vec3 dw){
  vec3 d = uRot * dw;
  // the glowing gas: a slow curling field, brighter toward the cluster, deeper below
  vec3 w = d * 1.9 + vec3(uTime * .006, 0., -uTime * .004);
  w += .45 * vec3(vn(d * 2.6 + uTime * .012), vn(d * 2.6 + 5.2), vn(d * 2.6 + 9.1 - uTime * .009));
  float g = .64 * vn(w * 1.4) + .30 * vn(w * 3.1 + 7.) + .06 * vn(w * 6.7 + 13.);
  g = .5 + (g - .5) * .85;   // the curling gas is a slow change of tone, not a field of stains
  // value in two masses: one luminous pale passage behind the hero, deep ultramarine and violet everywhere else
  // (at the entry the passage is wide and lies behind all the pillars, each a dark figure on pearl; once we are
  // on the rim it draws in round the egg)
  float hd = max(dot(d, uHeroDir), 0.);
  float fd = max(max(dot(d, uFlank[0]), dot(d, uFlank[1])), max(dot(d, uFlank[2]), dot(d, uFlank[3])));
  hd = max(hd, uFlankK * fd);
  float kd = dot(d, uKey);
  // (graded from one key: lighter toward the cluster, deeper away from it; a pale band stands on the level line
  // where the wall meets the deck, and the wall deepens toward the zenith)
  // The wall is the middle tone of the canvas: pearl only in the glow round the cluster, pale ultramarine on the
  // side toward it, the deep on the side away. So a form in front of it can be both lighter than it (its lights)
  // and darker (its shade). A little of the pale passage stays behind the hero.
  g += mix(.06 * hd * hd, .07 * hd * hd * hd, uNarrow) + .12 * kd + .2 * smoothstep(.86, .97, kd) - .07 + uGlow
    + .08 * (1. - smoothstep(0., .3, dw.y)) - .1 * smoothstep(.45, 1., dw.y);
  // a shadow passage behind the cluster, so its five dabs are the key light (lighter where a pillar stands before it)
  g -= .26 * smoothstep(.935, .982, kd) * (1. - .55 * uFlankK * smoothstep(.93, .99, fd));
  return g;
}
void main(){
  vec3 dw = normalize(vDir);
  if (dw.y < 0.) { gl_FragColor = vec4(deckPaint(dw), 1.); return; }
  vec3 d = uRot * dw;
  float g = wallTone(dw);
  // (between the dots the ground is the tier's own darker neighbour, and the priming only in the deep: no dark prick breaks a pale passage)
  vec3 col = g > .70 ? uPig[5] * .95 : g > .46 ? uPig[5] * .8 : g > .40 ? uPig[2] : uPig[0] * uPrimeK * .9;
  vec3 c = gen(turn(d, 1.1, .7), uN * 1.5, 31.7);
  vec3 b = gen(turn(d, -.6, 2.1), uN * .9, 11.3);
  vec3 a = gen(turn(d, .37, -.52), uN, 0.);
  vec3 k = vec3(0.);
  if (c.z > .5) k = c;
  if (b.z > .5) k = b;
  if (a.z > .5) k = a;
  if (k.z > .5) {
    float pig = pick(g + (k.y - .5) * .13, k.x);   // (a dot strays at most into the tier next to its own)
    if (a.z > .5 && fract(k.x * 91.7 + k.y * 13.1) > .988) pig = 10.;   // an ordinary star: one pale dab
    float br = .9 + .1 * sin(uTime * (.35 + k.x * .9) + k.y * 90.);
    col = uPig[int(pig + .5)] * br * (.9 + .14 * k.y);
  }
  // the cluster: five loaded dabs of lemon, each with a ridge of paint toward the studio light and two rings of
  // halo dots that swap violet and orange, slowly
  for (int i = 0; i < 5; i++) {
    vec3 s = uCluster[i];
    if (dot(d, s) > .98) {
      vec3 t1 = normalize(cross(s, vec3(0., 1., 0.))); vec3 t2 = cross(s, t1);   // right, down
      float sz = i == 0 ? 1. : .84;
      vec2 q = vec2(dot(d, t1), dot(d, t2)) / (.0225 * sz);
      float r = length(q);
      if (r < 1.) {
        vec2 qn = q / max(r, 1e-3);
        float v = smoothstep(.35, .85, r) * dot(qn, vec2(-.707, -.707)) * 1.3 + .34 * sin(q.y * 8. + q.x * 2.5 + float(i) * 3.);
        float tone = v > .4 ? 1. : v < -.4 ? -1. : 0.;
        col = tone < -.5 ? uPig[9] * 1.02 : uPig[10] * (1.06 + .12 * tone + .05 * sin(uTime * .8 + float(i) * 2.1));
      } else if (r < 4.1) {
        float kk = r < 2.55 ? 0. : 1.;
        float rc = 1.8 + 1.5 * kk, n = 10. + 8. * kk;
        float an = atan(q.y, q.x) / 6.2832 + .5 + .13 * kk;
        float cell = floor(an * n);
        vec2 f = vec2((fract(an * n) - .5) * 6.2832 * rc / n, r - rc);
        float hc = h31(vec3(cell, kk, float(i) * 7.));
        float fl = length(f);
        if (fl < .56 - .05 * kk) {
          float par = mod(cell + kk + floor(uTime * .32 + hc * 3.), 2.);
          float tn = dot(f, vec2(-.707, -.707)) > .16 ? 1.14 : 1.;
          col = par < .5 ? uPig[3] * 1.3 * tn : uPig[8] * tn;      // the violet a touch lighter than the shadow it lies on
        }
      }
    }
  }
  gl_FragColor = vec4(col, 1.);
}`,go=`
uniform float uPeriod, uK;
void main(){
  vec2 p = gl_FragCoord.xy / uPeriod;
  vec2 c = floor(p), f = fract(p) - .5;
  float par = mod(c.x + c.y, 2.);
  float t = par > .5 ? cos(f.x * 3.1416) * (1. - .5 * abs(f.y)) : cos(f.y * 3.1416) * (1. - .5 * abs(f.x));
  float slub = fract(sin(dot(c, vec2(12.9898, 78.233))) * 43758.5453);
  gl_FragColor = vec4(vec3(1. - uK * (1. - t) - uK * .35 * slub), 1.);
}`,po=`
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,mo=`
uniform vec3 uPig[12];
uniform vec4 uSeg[100];
uniform vec2 uSize;
uniform float uFill, uPrimeK, uTime, uGone;
varying vec2 vUv;
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float segD(vec2 p, vec4 s){ vec2 a = s.xy, b = s.zw; vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-4), 0., 1.); return length(pa - ba * h); }
// distance in from the torn edge of the bank, in metres (a ragged bank, not a card)
float tearF(vec2 p){
  vec2 ec = abs(p / uSize - .5) * 2.;
  float se = 1. - pow(ec.x * ec.x * sqrt(ec.x) + ec.y * ec.y * sqrt(ec.y) + 1e-6, .4);   // rounder than a card: no straight side
  return se * .5 * uSize.x - 40. - 320. * (.6 * vn2(p * .0042 + 3.) + .28 * vn2(p * .013 + 11.) + .12 * vn2(p * .041 + 5.)) - uGone * 900.;   // once behind us it frays away to nothing
}
// one loose lattice of dabs, turned so that no two lattices share a row; the painter works upward and a dab
// swells as it lands, each a little early or late so the working edge is ragged. Returns (hash, hash2, covered).
vec3 lay(vec2 p, float cell, float ang, float seed, out vec2 ctr){
  float ca = cos(ang), sa = sin(ang);
  vec2 g = vec2(p.x * ca + p.y * sa, -p.x * sa + p.y * ca) / cell + seed;
  float row = floor(g.y), sh = .5 * mod(row, 2.); g.x += sh;
  vec2 id = floor(g), f = fract(g) - .5;
  float h = h21(id + seed), h2 = h21(id + seed + 41.);
  vec2 cl = (id + .5 - vec2(sh, 0.) - seed) * cell;
  ctr = vec2(cl.x * ca - cl.y * sa, cl.x * sa + cl.y * ca);
  float front = uFill * (uSize.y + 300.) - 150. + 46. * sin(ctr.x * .011 + seed) + 28. * sin(ctr.x * .037 + seed * 2.);
  float land = clamp((front - ctr.y) / 60. + (h - .5) * 2.4, 0., 1.);
  // the painter has already worked in from the torn edge: a ragged border of dabs is there from the first frame
  land = max(land, clamp(1.25 - tearF(ctr) / (70. + 150. * h2), 0., 1.) * step(.22, h));
  vec2 q = f - (vec2(h, h2) - .5) * .34;
  q.x *= 1. + .35 * h;
  return vec3(h, h2, step(length(q), (.2 + .12 * h2) * land) * step(.001, land));
}
void main(){
  vec2 p = vUv * uSize;                       // metres on the canvas
  float aa = max(fwidth(p.x) + fwidth(p.y), 1e-3);
  float tear = tearF(p);
  if (tear < 0.) discard;
  // bare linen: warm ecru, the blue priming scrubbed thinly over part of it, and a weave coarse enough to see from
  // across the nebula (its thread never under about four pixels: the period doubles with distance)
  float per = 9. * exp2(ceil(log2(max(aa * 4. / 9., 1.))));
  vec2 th = p / per; vec2 tc = floor(th), tf = fract(th) - .5;
  float wv = mod(tc.x + tc.y, 2.) > .5 ? cos(tf.x * 3.1416) * (1. - .6 * abs(tf.y)) : cos(tf.y * 3.1416) * (1. - .6 * abs(tf.x));
  float slub = h21(tc);
  float wash = smoothstep(.42, .62, .6 * vn2(p * .0031 + 7.) + .4 * vn2(p * .011 + 2.));
  vec3 linen = vec3(.40, .35, .28) * (.72 + .36 * wv + .1 * slub);
  // the ground is the canvas's own priming, scrubbed over the linen: thinner in places, where the thread shows warmer
  vec3 col = mix(mix(uPig[0] * uPrimeK, uPig[2], .34) * (.8 + .3 * wv + .08 * slub), linen, .05 + .1 * wash);
  // charcoal: three pillars, the fingers, the egg, hatching on the shade side, the construction lines
  float dmin = 1e5;
  for (int i = 0; i < 100; i++) dmin = min(dmin, segD(p, uSeg[i]));
  // (a charcoal line is never thinner than two pixels, and its grain shows only close to)
  float grit = mix(1., .5 + .5 * h21(floor(p / 5.)), clamp(4. / aa, 0., 1.));
  float lw = max(4., aa * 1.15);
  float line = (1. - smoothstep(lw, lw + aa * 1.1 + 1.5, dmin + 3. * vn2(p * .05) * clamp(4. / aa, 0., 1.))) * grit;
  col = mix(col, vec3(.05, .04, .045), line * .4);
  // the dots: four lattices of different sizes; inside the drawn pillar they are shade and a burning left edge
  vec2 ca, cb, cc, cd, ck;
  vec3 a = lay(p, 69., 0., 3., ca), b = lay(p, 51., .55, 17., cb), c = lay(p, 30., -.35, 29., cc), d = lay(p, 39., 1.1, 43., cd);
  vec3 k = vec3(0.); ck = p;
  if (a.z > .5) { k = a; ck = ca; }
  if (b.z > .5) { k = b; ck = cb; }
  if (d.z > .5) { k = d; ck = cd; }
  if (c.z > .5) { k = c; ck = cc; }
  if (k.z > .5) {
    float h = k.x;
    float cxx = uSize.x * .62 - .2131 * ck.y;
    float hww = mix(200., 120., clamp(ck.y / 1100., 0., 1.)) * (1. + .12 * sin(ck.y * .011));
    float sx = (ck.x - cxx) / hww;
    vec2 eg = (ck - vec2(uSize.x * .62 - .2131 * 1100. - 60., 1420.)) / vec2(150., 175.);
    bool inE = dot(eg, eg) < 1.;
    float pig = h < .28 ? 6. : h < .50 ? 4. : h < .66 ? 7. : h < .78 ? 5. : h < .90 ? 11. : 8.;
    if ((ck.y < 1100. && abs(sx) < 1.) || inE) {
      float lit = inE ? -eg.x - .3 * eg.y : -sx;
      pig = lit > .5 ? (h < .45 ? 8. : h < .75 ? 10. : 9.) : (h < .42 ? 1. : h < .74 ? 2. : h < .92 ? 3. : 5.);
    }
    col = uPig[int(pig + .5)] * (.9 + .1 * sin(uTime * (.4 + h) + k.y * 60.));
  }
  gl_FragColor = vec4(col, 1.);
}`;var zo={id:"pointillist-nursery",name:"Nursery of Dots",category:"sky",weirdness:.5,media:["space"],async build(h){const f=h.rng,Te=h.noise,Dt=h.vary||{hour:"any",rare:!1,density:1,mood:.5},jt=h.quality&&h.quality.detail||1,R=(e,t,o)=>new x.Vector3(e,t,o),ve=new x.Scene,it=Dt.hour||"any",ge=f.fork("variation"),ke=it==="night"?"nocturne":it==="golden"?"gold":it==="dawn"?ge.chance(.6)?"dawn":"rose":it==="day"?ge.pick(["rose","rose","dawn","gold"]):ge.pick(["rose","rose","rose","gold","nocturne","dawn"]),he=co[ke],lt=ge.pick([0,0,1,2]),fe=lt===1?ge.range(1.1,1.5):lt===2?ge.range(.9,1.25):ge.range(.75,1.15),Rt=ge.pick(["three","three","colossus","wall"]),ct=$(Dt.density??1,.7,1.3),Pa=(.75+.25*ct)*(jt<1?.45+.55*jt:1),dt=!!Dt.rare;ve.background=new x.Color(he.pal[0]);const Ea=ge.fork("hero-dabs"),q=ge.fork("flank-crust"),le=await io(h,{palette:he.pal,progress:0,manner:lt,primeK:he.primeK,dabScale:fe,dabRng:Ea,tadpoles:Math.round($(f.range(10,60)*ct,10,60)),planets:f.int(1,3),density:$(.62+.38*ct,.6,1)});ve.add(le.object);const K=le.anchors,N=le.kit,d=N.P,ze=le.uniforms;ze.uLandWarm.value=Ra[ke],ze.uLandDeep.value=ke==="dawn"?d.ULTRA:d.DVIOLET;const oe=K.globuleCenter,xe=K.discNormal,Se=K.portalSeat.position,C=K.clusterDir,p=R(C.x,0,C.z).normalize();await h.yield();const k=R(0,0,0),Be=R(0,0,0),_=R(0,0,0),Yt=K.litU*F,se=[];for(let e=0;e<=8;e++){const t=e/8,o=Yt-.95+1.3*(1-Math.pow(1-t,1.8)),a=E(.69,.925,t);K.pillarPoint((o/F%1+1)%1,a,k),K.axisAt(a,_),Be.set(k.x-_.x,0,k.z-_.z).normalize(),k.addScaledVector(Be,30+12*t+70*z(.55,1,t)*t);for(let n=0;n<80&&K.hullDist(k)<38;n++)k.addScaledVector(Be,3);if(e){const n=se[se.length-1],s=n.y+Math.hypot(k.x-n.x,k.z-n.z)*1.28;if(k.y>s){k.y=s;for(let l=0;l<80&&K.hullDist(k)<38;l++)k.addScaledVector(Be,3)}}if(e>1&&Math.hypot(k.x-se[se.length-1].x,k.z-se[se.length-1].z)<36){if(e<8)continue;se.pop()}se.push(k.clone())}const Qt=600,ht=R(xe.x,0,xe.z).normalize(),ft=R(-ht.z,0,ht.x),et=se[se.length-1];k.subVectors(et,oe).dot(ft)<0&&ft.negate();const Va=k.subVectors(Se,oe).dot(ft),ut=Se.clone().addScaledVector(xe,Qt),Pt=170,Ta=k.subVectors(ut,oe).dot(ht)+125,Aa=Va+Pt,De=[];for(let e=0;e<14;e++){const t=x.MathUtils.degToRad(150-45*e);De.push(oe.clone().addScaledVector(ht,Ta+Pt*Math.cos(t)).addScaledVector(ft,Aa+Pt*Math.sin(t)))}{const e=et.y,t=ut.y+55,o=[];let a=0,n=et.x,s=et.z;for(const l of De)a+=Math.hypot(l.x-n,l.z-s),o.push(a),n=l.x,s=l.z;De.forEach((l,c)=>{l.y=e+(t-e)*(1-Math.pow(1-o[c]/a,1.3));for(let u=0;u<60&&K.hullDist(l)<60;u++)l.addScaledVector(k.subVectors(l,oe).normalize(),6)})}const Ae=se[0],ne=R(-.27,0,-.963).normalize(),Ue=R(-ne.z,0,ne.x),ce=Ae.clone().addScaledVector(ne,-2330);ce.y=Ae.y-6;const Zt=1380,pe=(e,t,o)=>Ae.clone().addScaledVector(ne,-e).addScaledVector(Ue,t).setY(Ae.y+o),tt=pe(3400,130,540),Et=[tt,pe(3200,128,536),pe(2600,100,430),pe(1950,45,240),pe(Zt,0,70),pe(850,0,-6),Ae.clone().addScaledVector(ne,-330).add(R(30,-12,0)),...se,...De,ut,Se.clone().addScaledVector(xe,Qt-140),Se.clone().addScaledVector(xe,340),Se.clone().addScaledVector(xe,210),Se.clone().addScaledVector(xe,70),Se.clone()];await h.yield();const V=ro(Et,{samples:480});await h.yield();const me=e=>{let t=1e18,o=0;for(let a=0;a<=400;a++){V.pointAt(a/400,k);const n=k.distanceToSquared(e);n<t&&(t=n,o=a/400)}return o},J=me(se[1]),I=me(et);await h.yield();const Le=me(ut);await h.yield();const Vt=me(De[5]),$t=me(De[7]),re=E(Vt,$t,.6);await h.yield();const gt=me(De[3]);await h.yield();const M=e=>e/V.length,at=me(Et[4]),y=R(0,0,0),ue=R(0,0,0),pt=R(0,0,0),T=R(0,0,0),b=R(0,0,0),mt=R(0,0,0),X=(e,t,o)=>{const n=Math.min(o,.996);e(t,n,y),e(t+.004,n,ue),e(t,n+.004,pt),b.subVectors(ue,y),mt.subVectors(pt,y),T.crossVectors(mt,b),T.lengthSq()<1e-10&&T.set(0,1,0),T.normalize(),b.normalize(),mt.normalize()},Tt=(e,t=f)=>Te.n3(e.x*.002,e.y*.002,e.z*.002)*Math.PI+t.range(-.35,.35),wt={add(){}},de=(e,t,o=0,a=f,n=mt)=>{const s=T.dot(C)*.5+.5+o+(a()-.5)*.16,l=N.pickPigment(s,a()),c=t*fe;e.add(y.x+T.x*c*.15,y.y+T.y*c*.15,y.z+T.z*c*.15,c,a(),l,Tt(y,a),n.x,n.y,n.z,0);const u=a();if(u<(s>.76?.36:.07)){const m=.6*c*a.sign(),v=a(),i=Tt(y,a);(s>.76||u<.035)&&e.add(y.x+b.x*m+T.x*c*.2,y.y+b.y*m+T.y*c*.2,y.z+b.z*m+T.z*c*.2,c*.55,v,s>.76?N.COMPLEMENT[l]:d.ORANGE,i,n.x,n.y,n.z,0)}},O=e=>Math.round(e*Pa),ie=-900,B=-120,Jt=Math.atan2(p.z,p.x),we=(e,t=f)=>{const o=t.range(-40,40),a=t.range(-40,40),n=e.H*.38/2.4,s=(c,u)=>{const m=Math.max(0,c)/e.H,v=Math.tan(e.lean)*e.H*Math.min(m,e.curl?.62:1);if(u.set(e.x+p.x*v+40*Math.sin(m*4+o)*m,c,e.z+p.z*v+30*Math.sin(m*3+a)*m),e.curl&&m>.62){const i=(m-.62)*e.H/n;return u.y=.62*e.H+n*Math.sin(i),u.x+=p.x*n*(1-Math.cos(i))*1.25,u.z+=p.z*n*(1-Math.cos(i))*1.25,i}return 0};return{o:e,fn:(c,u,m)=>{const v=c*F,i=E(ie,e.H,u),r=Math.max(0,i)/e.H,g=s(i,_);let w=e.R*E(1.25,.7,e.skirt?0:r)*(1+1.5*z(0,ie,i));e.curl&&(w*=1-.55*z(.62,1,r)),r>.9&&!e.skirt&&(w*=Math.sqrt(Math.max(0,1-Math.pow((r-.9)/.1,2)))),e.skirt&&(w*=1+.12*z(.8,1,u));const A=Math.cos(v),L=Math.sin(v);w*=1+.26*Te.fbm3(A*1.4+o,i*.004+a,L*1.4,3)+.07*Te.n3(A*4+a,i*.014,L*4+o)+(e.skirt?0:.3*Math.sin(v*3+o)*z(.7,.93,r));let Y=A*w,G=0,U=L*w*.85;if(g){const D=Y*p.x+U*p.z,ae=Math.cos(g)-1,Q=Math.sin(g);Y+=D*p.x*ae,U+=D*p.z*ae,G=-D*Q}return m.set(_.x+Y,_.y+G,_.z+U)},axis:s}},ee=[],At=we({x:0,z:0,H:150,R:300,lean:0,skirt:!0}),Xt=ce,Fe=(e,t)=>({x:Xt.x+ne.x*e+Ue.x*t,z:Xt.z+ne.z*e+Ue.z*t}),Oe=()=>x.MathUtils.degToRad(f.range(10,14));Rt==="three"?(ee.push(we({...Fe(4300+f.range(-200,300),-950+f.range(-150,150)),H:f.range(2e3,2250),R:f.range(250,300),lean:Oe()})),ee.push(we({...Fe(1500+f.range(-100,200),980+f.range(-40,120)),H:f.range(1020,1180),R:f.range(190,230),lean:Oe()}))):Rt==="colossus"?ee.push(we({...Fe(4500+f.range(-200,300),-1150+f.range(-150,150)),H:f.range(3e3,3400),R:f.range(380,440),lean:Oe(),curl:!0})):(ee.push(we({...Fe(4300,-950),H:f.range(1900,2200),R:f.range(230,270),lean:Oe()})),ee.push(we({...Fe(1250,580),H:f.range(1e3,1150),R:f.range(180,215),lean:Oe()})),ee.push(we({...Fe(4700,900),H:f.range(1700,1950),R:f.range(210,250),lean:Oe()})),ee.push(we({...Fe(3300,-2100),H:f.range(1350,1600),R:f.range(200,240),lean:Oe()})));const P=h.core.makeRng(h.core.hashSeed("lesser-pillars:"+h.seed)),qe=[];for(const e of[-1,1]){const t=we({x:0,z:0,H:e<0?P.range(1750,1950):P.range(1500,1650),R:P.range(105,130),lean:x.MathUtils.degToRad(P.range(4,6))},P),o=pe(Zt+P.range(-70,70),e*P.range(190,225),70);t.axis(o.y,_),t.o.x=o.x-_.x,t.o.z=o.z-_.z,t.gate=e;for(let a=0;a<4;a++){let n=1e9;for(let s=0;s<=14;s++)for(let l=0;l<24;l++)t.fn(l/24,(E(o.y-420,Math.min(o.y+420,t.o.H),s/14)-ie)/(t.o.H-ie),k),n=Math.min(n,V.distanceTo(k.x,k.y,k.z));if(n>=55)break;t.o.x+=Ue.x*e*(60-n),t.o.z+=Ue.z*e*(60-n)}qe.push(t),await h.yield()}for(let e=0,t=0;e<5&&t<80;t++){const o=pe(P.range(450,3e3),(e%2?1:-1)*P.range(430,1250),0),a=P.range(380,820),n=P.range(120,200),s=x.MathUtils.degToRad(P.range(3,8));Math.hypot(o.x+180,o.z)<900||[...ee,...qe].some(l=>Math.hypot(o.x-l.o.x,o.z-l.o.z)<l.o.R+n+350)||(qe.push(we({x:o.x,z:o.z,H:a,R:n,lean:s},P)),e++)}const Lt=[N.gridGeometry(32,10,At.fn,2048,1024)];for(const e of ee)Lt.push(N.gridGeometry(36,30,e.fn,2048,Math.round((e.o.H-ie)/256)*256)),await h.yield();for(const e of qe){const t=(B-60-ie)/(e.o.H-ie);Lt.push(N.gridGeometry(e.gate?30:24,e.gate?26:12,(o,a,n)=>e.fn(o,t+(1-t)*a,n),e.gate?768:1024,Math.max(128,Math.round((e.o.H-B+60)/128)*128))),await h.yield()}const ea=new x.Mesh(N.mergeGrids(Lt),N.hullMat(0,x.DoubleSide));ea.frustumCulled=!1,ve.add(ea),await h.yield();const ye=new N.Bank,ta=new N.Bank,Ie=(Jt/F%1+1)%1,La=()=>{const e=f();return e<.46?d.ORANGE:e<.72?d.LEMON:e<.93?d.GOLD:d.ROSE};await h.yield();const Fa=ee.reduce((e,t)=>e+t.o.H*t.o.R,0)||1;for(const e of ee){const t=e.o.H*e.o.R/Fa,o=(-250-ie)/(e.o.H-ie),a=$(Math.hypot(e.o.x-ce.x,e.o.z-ce.z)/2600,1,1.7),n=e.o.x-ce.x,s=e.o.z-ce.z;let l=Math.atan2(-n,s)-Jt;l-=Math.round(l/F)*F;const c=l>.35,u=c?.05:-.05,m=c?.04:0;for(let r=0,g=O(1400*t);r<g;r++)X(e.fn,r%2?(Ie+u+f.gauss()*.05*a+2)%1:f(),f.range(o,.99)),de(wt,f.range(44,70)*(r%2?a:1),r%2?.2:-.15),(r&255)===255&&await h.yield();for(let r=0,g=O(11e3*t);r<g;r++)X(e.fn,r%3?(Ie+m+f.gauss()*.07+2)%1:f(),f.range(o,.99)),de(wt,f.range(20,32),r%3?.03:-.15),(r&255)===255&&await h.yield();for(let r=0,g=O(12500*t);r<g;r++)X(e.fn,r%4?(Ie+m+f.gauss()*.06+2)%1:f(),E(o,.99,Math.pow(f(),.7))),de(wt,f.range(9,15),r%4?.05:-.15),(r&255)===255&&await h.yield();await h.yield();const v=e.o.H-ie,i=(r,g)=>(Math.floor(r*v/g)+.5)*g/v;for(let r=0,g=O(2400*t);r<g;r++)X(e.fn,r%2?(Ie+u+q.gauss()*.05*a+2)%1:q(),i(q.range(o,.99),56)),de(ye,q.range(44,70)*(r%2?a:1),0,q,b),(r&255)===255&&await h.yield();for(let r=0,g=O(11e3*t);r<g;r++)X(e.fn,r%2?(Ie+m+q.gauss()*.09+2)%1:q(),i(q.range(o,.99),25)),de(ye,q.range(20,32),0,q,b),(r&255)===255&&await h.yield();await h.yield();for(let r=0,g=O(12500*t);r<g;r++)X(e.fn,r%2?(Ie+m+q.gauss()*.09+2)%1:q(),i(E(o,.99,Math.pow(q(),.7)),11.5)),de(ye,q.range(9,15),0,q,b),(r&255)===255&&await h.yield();for(let r=0,g=O(4200*t*(c?.45:1));r<g;r++){X(e.fn,(Ie+m+f.gauss()*(c?.05:.08)+2)%1,f.range(c?.7:.5,.99));const w=f(),A=Math.min(w<.5?f.range(9,15):w<.85?f.range(18,30):f.range(36,56),c?26:56)*fe;k.set(-.5+T.x*.3+f.range(-.15,.15),.75+f.range(-.15,.2),.25+T.z*.3+f.range(-.15,.15)).normalize().multiplyScalar(f.range(400,900)),ta.add(y.x+T.x*4,y.y+T.y*4,y.z+T.z*4,A,f(),La(),f.range(0,3),k.x,k.y,k.z,f.range(.025,.06)),(r&255)===255&&await h.yield()}await h.yield()}for(let e=0,t=O(1500);e<t;e++)X(At.fn,f(),f.range(.45,.99)),de(wt,e%3?f.range(20,32):f.range(44,70)),(e&255)===255&&await h.yield();for(let e=0,t=O(1500);e<t;e++)X(At.fn,q(),q.range(.45,.99)),de(ye,e%3?q.range(20,32):q.range(44,70),0,q,b),(e&255)===255&&await h.yield();await h.yield();for(const e of qe){const t=e.o.H-ie,o=(B-ie)/t,a=(s,l)=>(Math.floor(s*t/l)+.5)*l/t,n=$(e.o.H*e.o.R/2e5,.3,1.2);for(let s=0,l=O(260*n);s<l;s++)X(e.fn,P(),a(P.range(o,.99),56)),de(ye,P.range(44,70),0,P,b);await h.yield();for(let s=0,l=O(1100*n);s<l;s++)X(e.fn,P(),a(P.range(o,.99),25)),de(ye,P.range(20,32),0,P,b),(s&255)===255&&await h.yield();await h.yield();for(let s=0,l=O(3200*n);s<l;s++)X(e.fn,P(),a(E(o,.99,Math.pow(P(),.8)),11.5)),de(ye,P.range(9,15),0,P,b),(s&255)===255&&await h.yield();if(await h.yield(),e.gate)for(let s=0,l=O(3e3);s<l;s++)X(e.fn,P(),a((Ae.y+70+P.range(-190,230)-ie)/t,2.7)),de(ye,P.range(2.2,3.4),0,P,b),(s&255)===255&&await h.yield();await h.yield()}const H=h.core.makeRng(h.core.hashSeed("deck:"+h.seed)),W=new x.Vector4(H.range(0,F),H.range(0,F),H.range(0,F),H.range(0,F)),_e=(e,t)=>{const o=e*.001,a=t*.001;return .5*Math.sin(o*1.1+1.3*Math.sin(a*.7+W.x))*Math.sin(a*1.3+W.y)+.3*Math.sin(o*2.3+a*1.7+W.z)+.2*Math.sin(a*4.1-o*2.9+W.w)},Ft=(e,t)=>Math.sin(e*.0097+t*.0061+W.y*3)*Math.sin(t*.0083-e*.0039+W.z*2),aa=(e,t)=>{const o=e*.001,a=t*.001;return Math.sin(o*.83+W.w*2+.9*Math.sin(a*.61+W.x*3))*Math.sin(a*.97+W.z*5+.8*Math.sin(o*.53))},oa=e=>Math.min((e-B)*Math.hypot(C.x,C.z)/C.y,2600),We=[new x.Vector4(0,0,430,oa(K.tipTop.y+500))];for(const e of[...ee,...qe])We.push(new x.Vector4(e.o.x,e.o.z,e.o.R*1.25,oa(e.o.H)));const Ke={t:0,gap:0,foot:0,warm:0,rose:0,virid:0},na=(e,t,o)=>{const a=(e*p.x+t*p.z)*.001,n=(e*p.z-t*p.x)*.001,s=a*2.6+.75*Math.sin(n*1.1+W.x)+.4*Math.sin(n*2.9+a*1.3+W.z)+.9*Math.sin(a*.8+n*.5+W.y)+.6*o,l=z(.1,.8,.5+.5*Math.sin(n*2.3+.5*s+1.1*Math.sin(a*.9+W.w)+W.x*2));return(1-Math.abs(Math.sin(s)))*l},ot=[],sa=(e,t)=>{const a=_e(e,t),n=Ft(e,t),s=(_e(e+40,t)-a+.04*(Ft(e+40,t)-n))/40,l=(_e(e,t+40)-a+.04*(Ft(e,t+40)-n))/40,c=e*p.x+t*p.z,u=e*p.z-t*p.x,m=na(e,t,a),v=(m-na(e+p.x*40,t+p.z*40,_e(e+p.x*40,t+p.z*40)))*10,i=.25+.75*(.5+.5*Math.sin(u*9e-4+c*5e-4+W.w));let r=.45+.07*a-100*(s*p.x+l*p.z)+i*(.26*z(0,.45,v)-.2*z(0,.45,-v)+.1*(m-.4)),g=0,w=1,A=0,L=0;r+=.18*z(-2500,3e3,c)*(1-.6*z(2500,6e3,Math.abs(u)));for(const D of We){const ae=e-D.x,Q=t-D.y,Z=-(ae*p.x+Q*p.z),Xe=Math.abs(ae*p.z-Q*p.x),Ge=Math.hypot(ae,Q);g=Math.max(g,z(-D.z,D.z*.6,Z)*(1-z(D.w*.55,D.w,Z))*(1-z(D.z*.7,D.z*1.2+Z*.06,Xe))),w*=z(D.z*2,D.z*5,Ge),L=Math.max(L,(1-z(D.z*.9,D.z*3.4,Ge))*z(-.25,.55,-Z/Math.max(Ge,1))),Ge<D.z&&(A=1)}let Y=0,G=0;for(const D of ot){const ae=e-D.x,Q=t-D.y,Z=D.w*(1-z(D.z*.3,D.z*1.1,Math.hypot(ae,Q))),Xe=z(-.4,.4,(ae*p.x+Q*p.z)/D.z);Y+=Z*Xe,G+=Z*(1-Xe)}const U=aa(e,t)*w;return r+=2.2*(aa(e+p.x*60,t+p.z*60)*w-U)*z(.7,.9,U)-.42*g,Ke.t=$(r,0,1),Ke.gap=z(.9,.93,U),Ke.foot=A,Ke.warm=L*(1-g),Ke.rose=Y,Ke.virid=G,Ke},Oa=Ra[ke],ra=(e,t,o,a)=>{const n=u=>u-Math.floor(u),s=n(o*57.31+a*7.7),l=n(o*23.17+a*41.3);let c=15;if(e>=1){const u=t.rose+t.virid;if(l<.5*Math.min(u,1)&&(c=n(l*37.3)*u<t.rose?e<3.2?d.ROSE:d.PROSE:e<3.2?d.VIRID:d.PVIRID),s<.7*t.warm*Oa){const m=t.warm+(a-.5)*.3;c=m>.72?o<.34?d.LEMON:o<.64?d.GOLD:d.ORANGE:m>.42?o<.48?d.ORANGE:o<.8?d.ROSE:d.GOLD:o<.55?d.ROSE:o<.8?d.ORANGE:d.PROSE}}return c+16*Math.round($(e,0,5)*50)},Ot=new N.Bank,ia=new N.Bank,je=[],qa=(e,t)=>{if(e.y<2400&&Math.hypot(e.x+180,e.z)<420+t)return!0;for(const o of ee)if(o.axis($(e.y,0,o.o.H),_),e.y<o.o.H+250&&Math.hypot(e.x-_.x,e.z-_.z)<o.o.R*1.5+t)return!0;for(const o of qe)if(o.axis($(e.y,0,o.o.H),_),e.y<o.o.H+250&&Math.hypot(e.x-_.x,e.z-_.z)<o.o.R*1.5+t)return!0;return!1},la=(e,t)=>e<1?d.DVIOLET:e<3.3?t<.62?d.VIOLET:d.ULTRA:e<4.2?t<.6?d.PULTRA:d.ROSE:t<.7?d.PULTRA:d.PROSE,S=h.core.makeRng(h.core.hashSeed("gas-banks:"+h.seed)),ca=K.tipTop.clone().lerp(oe,.3),qt=ca.clone().sub(tt).normalize(),da=[K.tipTop.clone(),oe.clone()];for(const e of ee){const t=R(0,0,0);e.axis(e.o.H*.75,t),da.push(t)}const It=[];for(let e=0;e<=at*V.length;e+=100)It.push(V.posAtDist(e,R(0,0,0)));const Kt=(e,t,o)=>{k.subVectors(t,o);const a=$(Be.subVectors(e,o).dot(k)/k.lengthSq(),0,1);return Be.addScaledVector(k,-a).length()},Ia=e=>{const t=k.subVectors(e,ce).dot(ne),o=k.subVectors(e,ca).dot(ne);return{along:t,across:k.addScaledVector(ne,-o).length()}},Ye=ce.clone().addScaledVector(ne,2050).addScaledVector(Ue,(Rt==="colossus"?1:-1)*1250);Ye.y=ce.y-140;const Ka=Math.round(18*(.8+.2*ct));for(let e=0;je.length<Ka&&e<900;e++){(e&31)===31&&await h.yield();const t=je.length<9,o=t?S.range(500,900):S.range(340,920),a=t?R(S.range(-2600,2400),S.range(-500,150),S.range(-2800,2600)):R(S.range(-4300,3900),S.range(-300,3700),S.range(-4900,3100)),n=t?S.range(.3,.5):S.range(.45,1),s=R(-C.x+S.range(-.5,.5),S.range(-.1,.5),-C.z+S.range(-.5,.5)).normalize(),l=S.range(1,1.9);if(V.distanceTo(a.x,a.y,a.z)<900+o||a.distanceTo(oe)<760+o*.6||!t&&qa(a,o*.45))continue;let c=!1;for(const v of It){for(const i of da)Kt(a,i,v)<180+o*(t?.45:.85)&&(c=!0);if(dt&&Kt(a,Ye,v)<560+o*.8&&(c=!0),c)break}if(c||dt&&a.distanceTo(Ye)<800+o)continue;const u=Ia(a),m=u.along>0?u.along/Math.hypot(u.along,u.across):0;je.push({p:a,r:o,low:t,glow:.42*m*m*m*m-.16,sq:n,flow:s,el:l})}const Ha=je.reduce((e,t)=>e+t.r*t.r,0)||1;for(const e of je)!e.low&&ot.length<12&&ot.push(new x.Vector4(e.p.x,e.p.z,e.r,1-.75*z(400,3200,e.p.y-B)));const Na=(e,t)=>S()>=t?e:e===d.ROSE?d.PROSE:e===d.VIRID?d.PVIRID:e===d.GOLD||e===d.LEMON||e===d.PROSE||e===d.PVIRID?e:d.PULTRA,Ca=e=>{const t=S();return e>.62?t<.3?d.PROSE:t<.55?d.PULTRA:t<.75?d.PVIRID:t<.9?d.ROSE:d.GOLD:e>.4?t<.34?d.ROSE:t<.6?d.VIRID:t<.85?d.PULTRA:d.VIOLET:t<.4?d.ULTRA:t<.65?d.VIOLET:t<.85?d.DVIOLET:d.VIRID};let Ga=0;for(const e of je){const t=O(26e3*e.r*e.r/Ha),o=.6*z(2500,4400,e.p.distanceTo(ce));for(let a=0;a<t;a++){k.set(S.gauss(),S.gauss()*e.sq,S.gauss()).multiplyScalar(e.r*.5);const n=S.gauss()*e.r*.5*(e.el-1);k.addScaledVector(e.flow,n);const s=.62+.55*k.dot(C)/e.r+(S()-.5)*.2+he.glow+e.glow,l=e.p.x+k.x,c=e.p.y+k.y,u=e.p.z+k.z,m=(S()<.55?S.range(40,72):S.range(15,27))*fe,v=Math.atan2(e.flow.y,e.flow.x)+S.range(-.4,.4),i=S()>z(B+130,B+400,c)||e.low,r=i?la(.8+(s-.3)*3.2,S()):Na(Ca(s),o);if(a%2)Ot.add(l,c,u,m,S(),r,v,e.flow.x,e.flow.y,e.flow.z,0);else{const g=S.range(160,460);ia.add(l,c,u,m,S(),r,v,e.flow.x*g,e.flow.y*g,e.flow.z*g,S.range(.012,.03))}S()<.22&&Ot.add(l+m*.6,c+S.range(-.3,.3)*m,u,m*.55,S(),i?la(1.4+(s-.3)*3.2,S()):N.COMPLEMENT[r],v,e.flow.x,e.flow.y,e.flow.z,0),(a&511)===511&&await h.yield()}await h.yield(),Ga++}await h.yield();const ha=new N.Bank,Ba=()=>{const e=f();return e<.22?d.ROSE:e<.4?d.VIRID:e<.54?d.ULTRA:e<.62?d.VIOLET:e<.75?d.PULTRA:e<.84?d.DVIOLET:e<.91?d.ORANGE:e<.95?d.PROSE:e<.98?d.LEMON:d.PVIRID};for(const[e,t,o,a]of[[6e3,110,.45,.75],[7e3,470,2,3.2],[2500,2300,9.5,15]]){const n=t*.022;for(let s=0,l=O(e);s<l;s++)ha.add(f(),f(),f(),f.range(o,a)*fe,f(),Ba(),f.range(0,F),t,(-C.x+f.range(-.3,.3))*n/t,(.25+f.range(-.3,.3))*n/t,(-C.z+f.range(-.3,.3))*n/t);await h.yield()}await h.yield();const yt=new N.Bank,He=ze.uTail.value;let fa=0;const te=h.core.makeRng(h.core.hashSeed("route-tadpoles:"+h.seed)),Ht=[],Re={add:(...e)=>{Ht.push(e)}},vt=e=>{if(e){for(const t of Ht)yt.add(...t);fa++}return Ht.length=0,e},nt=J*V.length,ua=I*V.length,Nt=(Le*V.length-nt)/7,Ua=te.range(0,Nt);for(let e=0;e<7;e++){const t=nt+Ua+e*Nt+te.range(-.2,.2)*Nt,o=te.range(15,21)*te.sign(),a=te.range(13,22),n=te();V.posAtDist(t,y),V.tangentAtDist(t,b),T.crossVectors(b,He);const s=T.lengthSq()<.01;s||y.addScaledVector(T.normalize(),o),Re.add(y.x,y.y,y.z,a*.36,te(),d.VIOLET,.3,0,0,0,n),Re.add(y.x,y.y,y.z,a*.24,te(),d.DVIOLET,1.2,a*.13,a*.05,-a*.04,n),Re.add(y.x,y.y,y.z,a*.2,te(),d.ULTRA,2,a*.05,-a*.09,a*.06,n);for(let c=0;c<5;c++){const u=c/5*F;Re.add(y.x,y.y,y.z,a*te.range(.1,.15),te(),c%3?d.ORANGE:d.LEMON,u,-a*.17,Math.cos(u)*a*.11,Math.sin(u)*a*.11,n)}for(let c=0;c<18;c++){const u=E(.22,1.7,c/17)*a,m=a*.04*(1+c*.12);Re.add(y.x,y.y,y.z,a*E(.2,.06,c/17),te(),c%5===4?d.VIRID:c%7===3?d.PROSE:d.ROSE,te.range(0,3),u,te.gauss()*m,te.gauss()*m,n)}let l=!s&&K.hullDist(y)>30;for(let c=-75;c<=115&&l;c+=10)V.distanceTo(y.x+He.x*c,y.y+He.y*c,y.z+He.z*c)<9&&(l=!1);vt(l)}await h.yield();const _a=(e,t,o,a,n=yt)=>{n.add(e.x,e.y,e.z,t*.34,a(),d.VIOLET,.3,0,0,0,o);for(let s=0;s<9;s++)n.add(e.x,e.y,e.z,t*a.range(.2,.27),a(),s%3===0?d.ULTRA:s%3===1?d.DVIOLET:d.VIOLET,a.range(0,3),t*a.range(-.06,.2),a.gauss()*t*.09,a.gauss()*t*.09,o);for(let s=0;s<10;s++){const l=s/10*F,c=s%2?.16:.08;n.add(e.x,e.y,e.z,t*a.range(.17,.22),a(),s%3?d.ORANGE:d.LEMON,l,-t*(.25-c*.4),Math.cos(l)*t*c,Math.sin(l)*t*c,o)}for(let s=0;s<24;s++){const l=E(.3,2.1,s/23)*t,c=t*.035*(1+s*.12);n.add(e.x,e.y,e.z,t*E(.2,.06,s/23),a(),s%5===4?d.VIRID:s%7===3?d.PROSE:d.ROSE,a.range(0,3),l,a.gauss()*c,a.gauss()*c,o)}},kt=(e,t,o,a=145)=>{if(K.hullDist(e)<t)return!1;for(let n=-80;n<=a;n+=10)if(V.distanceTo(e.x+He.x*n,e.y+He.y*n,e.z+He.z*n)<o)return!1;return!0},be=R(0,0,0),j=f.fork("near-tadpoles"),zt=(e,t,o,a,n,s,l,c=1,u=j,m=yt)=>{const v=t*.16;for(let i=0;i<n;i++)m.add(e.x,e.y,e.z,a*u.range(.9,1.15),u(),i%3===0?d.VIOLET:i%3===1?d.DVIOLET:d.ULTRA,u.range(0,3),u.gauss()*v*.4,u.gauss()*v*.4,u.gauss()*v*.4,o);for(let i=0;i<s;i++){const r=i?u.range(.5,1.25):0,g=i/Math.max(1,s-1)*F+u.range(-.2,.2),w=v*1.12;m.add(e.x,e.y,e.z,a*c*u.range(.82,1),u(),i%3===0?d.LEMON:d.ORANGE,g,-w*Math.cos(r),w*Math.sin(r)*Math.cos(g),w*Math.sin(r)*Math.sin(g),o)}for(let i=0;i<l;i++){const r=i/(l-1),g=E(.24,2.1,r)*t,w=t*.022*(1+3*r);m.add(e.x,e.y,e.z,a*E(.95,.42,r),u(),i%4===3?d.PROSE:d.ROSE,u.range(0,3),g,u.gauss()*w,u.gauss()*w,o)}},ga=(e,t,o)=>{zt(e,t,o,t*.25,3,7,8,1,j,Re),zt(e,t,o,t*.09,22,16,12,1,j,Re)},pa=(ua-nt)/9,Wa=j.range(0,pa);for(let e=0;e<9;e++){const t=nt+Wa+e*pa;V.posAtDist(t,ue),V.tangentAtDist(t,b),be.set(b.z,0,-b.x).normalize();for(let o=0,a=!1;o<6;o++){const n=j.range(60,115),s=j.range(9,26),l=j.range(4,22),c=j.range(15,20),u=j();y.copy(ue).addScaledVector(b,n).addScaledVector(be,s),y.y+=l,ga(y,c,u),a=vt(!a&&kt(y,26,8))||a}}for(let e=0;e<10;e++){const t=E(nt,ua,j());V.posAtDist(t,ue),V.tangentAtDist(t,b),be.set(b.z,0,-b.x).normalize();const o=j.range(70,190),a=j.range(40,240),n=j.range(-40,60),s=j.range(19,25),l=j();y.copy(ue).addScaledVector(be,o).addScaledVector(b,a),y.y+=n,ga(y,s,l),vt(kt(y,40,30))}await h.yield();const Pe=j.fork("left-of-the-climb"),Ct=[],ma=75;for(let e=J*V.length+Pe.range(0,ma);e<I*V.length;e+=ma){V.posAtDist(e,ue),V.tangentAtDist(e,b),be.set(b.z,0,-b.x).normalize();for(let t=0,o=0;t<12&&o<2;t++){const a=Pe.range(70,140),n=Pe.range(40,200),s=Pe.range(-30,50),l=Pe.range(48,70),c=Pe();y.copy(ue).addScaledVector(be,a).addScaledVector(b,n),y.y+=s,kt(y,46,26,210)&&!Ct.some(u=>u[0].distanceTo(y)<80)&&(Ct.push([y.clone(),l,c]),o++)}}for(const[e,t,o]of Ct)fa++,zt(e,t,o,t*.13,10,12,12,1.5,Pe),zt(e,t,o,t*.06,36,30,18,1.5,Pe);await h.yield();const Me=h.core.makeRng(h.core.hashSeed("helix-shoals:"+h.seed)),ja=me(De[0]);for(const[e,t]of[[E(I,re,.3),1],[E(I,re,.6),1],[E(I,re,.92),1],[E(I,ja,Me()),0],[E(I,re,.5),0]]){V.pointAt(e,ue),t?b.subVectors(oe,ue).normalize():V.tangentAt(e,b),be.set(b.z,0,-b.x).normalize(),pt.crossVectors(be,b).normalize();for(let o=0,a=Me.int(3,4);o<a;o++){const n=Me.range(0,F),s=Me.range(t?70:95,t?150:180),l=t?Me.range(170,290):Me.range(180,360),c=Me.range(28,40),u=Me();y.copy(ue).addScaledVector(b,l).addScaledVector(be,Math.cos(n)*s).addScaledVector(pt,Math.sin(n)*s*.75),_a(y,c,u,Me,Re),vt(kt(y,40,16))}await h.yield()}for(let e=0,t=O(5200);e<t;e++){const o=f(),a=Yt-.95+1.3*(1-Math.pow(1-o,1.8)),n=E(.685,.93,o)+f.gauss()*.022;X(K.pillarPoint,((a/F+f.gauss()*.03)%1+1)%1,(Math.floor($(n,.6,.985)*640)+.5)/640);const s=f(),l=s<.4?d.ORANGE:s<.62?d.LEMON:s<.75?d.GOLD:d.ULTRA,c=(f()<.7?f.range(1.5,2.6):f.range(3,4.6))*fe;ye.add(y.x+T.x*(.4+c*.2),y.y+T.y*(.4+c*.2),y.z+T.z*(.4+c*.2),c,f(),l,Tt(y),b.x,b.y,b.z,0),(e&255)===255&&await h.yield()}await h.yield();const Gt=6e3,xt=[],wa=pe(1700,0,0),Bt=6500,Ya=Math.hypot(C.x,C.z)/C.y,Qa=(e,t,o,a,n,s)=>{const l=o*n,c=Math.sqrt(1-s*s),u=o*.5+o*.6+a*Ya,m=(v,i)=>Math.hypot(v-wa.x,i-wa.z);return m(e,t)+o>Bt||m(e-p.x*u,t-p.z*u)+.8*o>Bt||m(e+p.x*a*.35-p.x*c*l,t+p.z*a*.35-p.z*c*l)+.22*o+.12*l>Bt},Za=(e,t,o,a,n,s)=>{const l=o*n,c=Math.sqrt(1-s*s),u=e+p.x*a*.35,m=t+p.z*a*.35,v=R(0,0,0);for(let i=-1;i<=6;i++){const r=l*Math.max(i,0)/6,g=i<0?o:.22*o+.12*r;if(i<0?v.set(e,B+a*.5,t):v.set(u-p.x*c*r,B+a*.8+s*r,m-p.z*c*r),v.distanceTo(Ye)<800+g)return!0;for(const w of It)if(Kt(v,Ye,w)<560+g)return!0}return!1};if(ho){const e=h.core.makeRng(h.core.hashSeed("deck-knots:"+h.seed));for(let t=0,o=Math.round(.8*Math.PI*Gt*Gt/1e6);t<o;t++){const a=e.range(0,F),n=Gt*Math.sqrt(e()),s=e.range(150,380),l=s*e.range(.5,.9),c=e.range(-40,40),u=e.range(-40,40),m=e.range(2.2,3.6),v=e.range(.4,.62),i=Math.cos(a)*n,r=Math.sin(a)*n;if(sa(i,r).gap>.5||We.some(w=>Math.hypot(i-w.x,r-w.y)<w.z*1.6+s)||xt.some(w=>Math.hypot(i-w.x,r-w.z)<w.R+s+120)||Qa(i,r,s,l,m,v)||dt&&Za(i,r,s,l,m,v))continue;const g=(w,A,L)=>{const Y=w*F,G=A*Math.PI/2,U=Math.cos(G),D=Math.sin(G),ae=Math.cos(Y),Q=Math.sin(Y),Z=s*Math.pow(U,.7)*(1+.28*Te.fbm3(ae*1.3+c,D*2+u,Q*1.3,3));return L.set(i+p.x*l*.35*D*D+ae*Z,B-40+(l+40)*D,r+p.z*l*.35*D*D+Q*Z*.85)};xt.push({x:i,z:r,R:s,H:l,tailK:m,rise:v,fn:g})}await h.yield()}const Ne=(e,t,o)=>{if(!e.count)return null;const a=N.dabMesh(e,t,o);return ve.add(a),a};Ne(ye,0,.6),await h.yield(),Ne(ta,1,0),await h.yield(),Ne(Ot,0,0),await h.yield(),Ne(ia,1,0),await h.yield(),Ne(ha,6,0),await h.yield(),Ne(yt,5,0),await h.yield();const Qe=new N.Bank,ya=pe(1700,0,0);for(let e=0,t=O(26e3);e<t;e++){const o=H.range(0,F),a=6500*Math.pow(H(),.7),n=ya.x+Math.cos(o)*a,s=ya.z+Math.sin(o)*a,l=H.range(46,78)*fe,c=H(),u=H(),m=H.range(-.4,.4),v=H(),i=sa(n,s);(e&255)===255&&await h.yield(),!(i.gap>.5||i.foot)&&(c*7.77%1<z(4e3,6500,a)||Qe.add(n,B+6+45*(.5+.5*_e(n,s)),s,l,c,ra(i.t*5+(v-.5)*.6,i,u,v),m,-p.x,0,-p.z,-.25))}await h.yield();const va={warm:0,rose:0,virid:0};for(const e of We){for(let t=0,o=O(420);t<o;t++){const a=H.range(0,F),n=H()*H(),s=e.z*(.9+.6*n),l=H.range(34,56)*fe,c=H(),u=H(),m=H(),v=.5+.5*(Math.cos(a)*p.x+Math.sin(a)*p.z);va.warm=v*v,Qe.add(e.x+Math.cos(a)*s,B+10+170*(1-n)*(1-n),e.y+Math.sin(a)*s,l,c,ra(.6+3.3*v*v+(m-.5)*.6,va,u,m),H.range(-.4,.4),-Math.sin(a),0,Math.cos(a),-.25)}await h.yield()}if(xt.length){const e=h.core.makeRng(h.core.hashSeed("deck-knot-dabs:"+h.seed)),t=Math.hypot(C.x,C.z)/C.y,o=a=>16*Math.round(a*50);for(const a of xt){const n=Math.max(3,Math.round((a.H+a.R)/45)),s=i=>(Math.floor(i*n)+.5)/n;for(let i=0,r=O(a.R*a.R*.003);i<r;i++){X(a.fn,e(),s(e.range(.06,.98)));const g=T.dot(C)*.5+.36+(e()-.5)*.16,w=e.range(44,76)*fe,A=N.pickPigment(g,e());Qe.add(y.x+T.x*w*.15,y.y+T.y*w*.15,y.z+T.z*w*.15,w,e(),(g>.66?A:15)+o(g>.66?3.5:g>.5?2.4:g>.2?1.5:.7),e.range(-.4,.4),b.x,b.y,b.z,-.3)}const l=a.R*.6+a.H*t;for(let i=0,r=O(a.R*l*3e-4);i<r;i++){const g=e()*l,w=e.range(-.8,.8)*a.R*(1-.5*g/l),A=e.range(40,66)*fe,L=e(),Y=e(),G=a.x-p.x*(a.R*.5+g)+p.z*w,U=a.z-p.z*(a.R*.5+g)-p.x*w;Qe.add(G,B+8+45*(.5+.5*_e(G,U)),U,A,L,15+o(.7+1.1*Y),e.range(-.4,.4),-p.x,0,-p.z,-.3)}const c=a.R*a.tailK,u=a.x+p.x*a.H*.35,m=a.z+p.z*a.H*.35,v=Math.sqrt(1-a.rise*a.rise);for(let i=0,r=O(a.R*a.R*.002);i<r;i++){const g=Math.pow(e(),1.5),w=g*c,A=.22*a.R+.12*w,L=e.gauss()*A*.5,Y=e.gauss()*A*.35,G=e(),U=G<.5-.3*g?d.ROSE:G<.8?d.PROSE:G<.93?15:d.PVIRID;Qe.add(u-p.x*v*w+p.z*L,B+a.H*.8+a.rise*w+Y,m-p.z*v*w-p.x*L,E(62,30,g)*e.range(.8,1.2)*fe,e(),U+o(3.6),e.range(-.4,.4),-p.x*v,a.rise,-p.z*v,-.3)}await h.yield()}}Ne(Qe,0,0);const st=new x.Mesh(new x.CircleGeometry(8800,48),new x.MeshBasicMaterial({colorWrite:!1,side:x.DoubleSide}));st.rotation.x=-Math.PI/2,st.position.y=B,st.renderOrder=-.5,st.frustumCulled=!1,ve.add(st),await h.yield();const $a=(e,t,o)=>{const a=x.MathUtils.degToRad(t),n=Math.cos(a),s=Math.sin(a);return o.set(e.x*n+e.z*s,0,-e.x*s+e.z*n)},Ja=f.range(30,37),ka=x.MathUtils.degToRad(f.range(21,25)),Ee=$a(ne,Ja,R(0,0,0)).multiplyScalar(Math.cos(ka));Ee.y=Math.sin(ka),Ee.normalize();const za=R(0,0,0).crossVectors(Ee,R(0,1,0)).normalize(),Xa=R(0,0,0).crossVectors(Ee,za),xa=[Ee.clone()],Ut=ke==="nocturne";for(let e=0;e<4;e++){const t=e/4*F+f.range(-.4,.4),o=Ut?9:f.range(.15,.25);xa.push(Ut?Ee.clone():Ee.clone().addScaledVector(za,Math.cos(t)*o).addScaledVector(Xa,Math.sin(t)*o*.75).normalize())}const Ce=qt.clone(),eo=K.tipTop.clone().lerp(oe,.3),ba=ee.slice(0,4).map(e=>{const t=R(0,0,0);return e.axis(e.o.H*.62,t),t}),Ze=[0,1,2,3].map(()=>qt.clone()),Ve={uPig:{value:le.pigments},uCluster:{value:xa},uKey:{value:Ee},uHeroDir:{value:Ce},uFlank:{value:Ze},uFlankK:{value:.94},uNarrow:{value:0},uRot:{value:new x.Matrix3},uTime:{value:0},uN:{value:64},uManner:{value:lt},uPrimeK:{value:he.primeK},uGlow:{value:he.glow},uSpark:{value:Ut?.05:.08},uCam:{value:R(tt.x,tt.y,tt.z)},uDeckK:{value:R(B,400,0)},uDeckPh:{value:W},uLh:{value:new x.Vector2(p.x,p.z)},uBank:{value:[0,1,2,3,4,5,6,7,8,9,10,11].map(e=>ot[e]?ot[e].clone():new x.Vector4(0,0,0,0))},uLandWarm:ze.uLandWarm,uLandDeep:ze.uLandDeep,uDeckDeep:{value:ke==="dawn"?le.pigments[1].clone().multiplyScalar(.7):le.pigments[0].clone().multiplyScalar(he.primeK*.9)},uFoot:{value:[0,1,2,3,4,5,6,7,8,9,10,11].map(e=>We[e]?We[e].clone():new x.Vector4(0,0,0,0))}},bt=new x.Mesh(new x.SphereGeometry(8200,32,20),new x.ShaderMaterial({uniforms:Ve,vertexShader:fo,fragmentShader:uo,side:x.BackSide,depthWrite:!1,depthTest:!1}));bt.renderOrder=-1,bt.frustumCulled=!1,ve.add(bt);const to=R(.2,1,.1).normalize(),Ma=new x.Matrix4,Sa={uPeriod:{value:3},uK:{value:ke==="dawn"?.12:.1}},_t=new x.Mesh(new x.PlaneGeometry(2,2),new x.ShaderMaterial({uniforms:Sa,vertexShader:"void main(){ gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:go,depthTest:!1,depthWrite:!1,transparent:!0,blending:x.CustomBlending,blendSrc:x.DstColorFactor,blendDst:x.ZeroFactor,blendEquation:x.AddEquation}));_t.frustumCulled=!1,_t.renderOrder=60,ve.add(_t);let $e=null,Mt=.3;if(dt){const o=[],n=(i,r,g,w)=>o.push(new x.Vector4(i,r,g,w)),s=i=>806-Math.tan(.21)*i,l=i=>E(200,120,$(i/1100,0,1))*(1+.12*Math.sin(i*.011)),c=(i,r,g,w,A,L,Y,G)=>{for(const U of[-1,1]){let D=0,ae=0;for(let Q=0;Q<=Y;Q++){const Z=E(A,L,Q/Y),Xe=(Z-A)/(L-A),Ge=i-r*Z+U*E(g,w,Xe)*(1+.16*Te.n2(Z*.006+G,U*7.3+G));Q&&n(D,ae,Ge,Z),D=Ge,ae=Z}}n(i-r*L-w*.9,L,i-r*L+w*.9,L+w*.25)};for(const i of[-1,1])for(let r=0;r<24;r++){const g=E(70,1100,r/24),w=E(70,1100,(r+1)/24),A=L=>1+.07*Te.n2(L*.008,i*3.1)+.03*Te.n2(L*.03,i*5.7);n(s(g)+i*l(g)*A(g),g,s(w)+i*l(w)*A(w),w)}for(let i=0;i<3;i++){const r=s(1100)+(i-1)*85,g=r-40-i*12,w=1190+(i===1?60:0);n(r-35,1100,g,w),n(g,w,r+35,1100)}const u=s(1100)-60,m=1420;for(let i=0;i<8;i++){const r=i/8*F,g=(i+1)/8*F;n(u+Math.cos(r)*150,m+Math.sin(r)*175,u+Math.cos(g)*150,m+Math.sin(g)*175)}c(330,.2,78,50,60,1330,5,1.7),c(1150,.2,92,58,60,720,4,5.2),n(s(40),40,s(1640),1640);for(let i=0;i<6;i++){const r=190+i*150;n(s(r)+l(r)*.34,r,s(r)+l(r)*.8,r+52)}for(let i=0;i<4;i++){const r=240+i*250;n(330-.2*r+14,r,330-.2*r+56,r+46)}for(let i=0;i<2;i++){const r=260+i*240;n(1150-.2*r+18,r,1150-.2*r+70,r+52)}for(;o.length<100;)o.push(o[0].clone());$e={uPig:{value:le.pigments},uSeg:{value:o.slice(0,100)},uSize:{value:new x.Vector2(1300,1700)},uFill:{value:0},uPrimeK:{value:he.primeK},uTime:{value:0},uGone:{value:0}};const v=new x.Mesh(new x.PlaneGeometry(1300,1700),new x.ShaderMaterial({uniforms:$e,vertexShader:po,fragmentShader:mo,side:x.DoubleSide}));v.scale.setScalar(.85),v.position.copy(Ye),v.lookAt(k.copy(ce).addScaledVector(ne,700)),ve.add(v),Mt=me(ce.clone().addScaledVector(ne,1150))}await h.yield();const ao=K.tipTop.clone().lerp(oe,.45),oo=Ae.clone().addScaledVector(p,4e3).setY(B+400),St=Math.max(1,(J-me(Et[6]))*V.length),no=oe.clone().addScaledVector(xe,45),Je=le.stage,Da=e=>{Je.peel=z(gt,Vt,e),Je.star=z(re-M(200),re,e),Je.jets=$((e-re)/M(460),0,1),Je.front=$((e-re)/(1+M(115)-re),0,1),Je.reveal=z(I-M(175),I+M(175),e),le.setStage(Je)};Da(0),ze.uStorm.value=.1;const Wt=new x.Vector2,rt=R(0,0,0),so=e=>.66+.7*z(M(200),at-M(500),e)-.3*z(J-M(580),J,e)+.2*z(I,I+M(230),e)*(1-z(gt-M(230),gt+M(115),e))-.34*z(re-M(460),re-M(58),e)+.22*z(re+M(580),Le,e)+.1*z(1-M(400),1-M(115),e);return{scene:ve,path:V,duration:$(V.length/118,38,50),pace:so,title:he.name,ride:"none",style:"none",marks:{G:oe,A:xe,S:Se,uGate:at,uRim:J,uTop:I,uPeel0:gt,uIn:Vt,uNear:$t,uFar:re,uDive:Le,hullDist:K.hullDist},camera:{fov:65,near:.5,far:9e3,lookAhead:60,sway:.6,bank:.8},pois:[{at:ao,from:0,to:J-M(700),weight:.5},{at:oo,from:J-M(St),to:I+M(St),weight:.7,fade:M(St)/(I-J+2*M(St))},{at:no,from:I-M(200),to:Le+M(200),weight:1,fade:M(470)/(Le-I+M(400))}],portal:{shape:"circle",radius:14,color:he.portal,glow:1.5,tilt:!0,revealDistance:1300,veil:he.pal[1]},post:{exposure:ke==="dawn"?.92:1.05,bloom:{strength:.16,radius:.35,threshold:1},grade:{saturation:ke==="nocturne"?1:1.1,contrast:1.03,tint:"#ffffff",shadowTint:"#0a0c24",vignette:.18,grain:0,aberration:0}},update(e,t,o,a){Da(a),le.update(e,t,o),o.getWorldPosition(rt),bt.position.copy(rt),Ve.uTime.value=t,Ve.uCam.value.copy(rt),Ve.uDeckK.value.y=ze.uPxScale.value,h.renderer.getDrawingBufferSize(Wt),Ve.uN.value=$(ze.uPxScale.value/Math.max(2.8,Wt.y*.0047),60,400),Ce.copy(eo).lerp(oe,z(J-M(350),I,a)).sub(rt),Ce.lengthSq()<1?Ce.copy(qt):Ce.normalize();for(let n=0;n<4;n++)n<ba.length?(Ze[n].subVectors(ba[n],rt),Ze[n].lengthSq()<1?Ze[n].copy(Ce):Ze[n].normalize()):Ze[n].copy(Ce);Ve.uFlankK.value=.94*(1-z(J-M(520),J+M(115),a)),Ve.uNarrow.value=z(J-M(350),I,a),Ma.makeRotationAxis(to,t*.0025),Ve.uRot.value.setFromMatrix4(Ma),Sa.uPeriod.value=Math.max(3,Wt.y/110),ze.uStorm.value=E(.1,1,z(at,at+M(600),a))*(1-.75*z(J-M(230),J+M(115),a))*(1-.85*z(I-M(115),I+M(230),a)*(1-z(Le-M(290),Le+M(230),a))),$e&&($e.uTime.value=t,$e.uFill.value=.35+.65*z(M(115),Mt,a),$e.uGone.value=z(Mt+M(290),Mt+M(810),a))},dispose(){le.dispose()}}}};export{zo as default};
