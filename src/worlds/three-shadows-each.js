import*as c from"three";import{makePath as Xo,clamp as qe,lerp as Y,smoothstep as Ve,makeRng as Yo,hashSeed as uo,makeNoise as Es}from"../kit/core.js";import{buildHero as Ts,makeNeedleGeometry as mo,makeHeapGeometry as Rs,makeGiant as ks,mergeGeoms as po,heapStones as Ko,keepStones as zs,makePyramid as Fs,PYRAMID as ct,PYRAMID_DRESS as Ns,makeBoulderGeometry as Ds,makeRising as Ls}from"../parts/three-shadows-each.js";const ve=Math.PI/180,O=Math.PI*2,Hs=u=>{const G=new c.Color(u);return[G.r,G.g,G.b]},jt=[{col:[.5,.74,1],S:1,r0:1.7,r1:3.5,g:1,disc:[.8,1.5,3.3]},{col:[1,.85,.48],S:.95,r0:2,r1:4.2,g:1.2,disc:[3.1,2.2,.7]},{col:[1,.33,.1],S:1.3,r0:1.7,r1:6.4,g:1.8,disc:[3.3,.7,.14]}],Ps=14,Is=0;function $o(u,G){const ae=[];for(let b=0;b<21;b++)ae.push(23+(b+u.range(.15,.85))*18/21);u.shuffle(ae);let k=0;const K=()=>({w:O/ae[k++],p:u.range(0,O)}),M=[0,1,2].map(b=>({s:[K(),K(),K(),K(),K()],k:jt[b]})),ge=[K(),K(),K(),K(),K(),K()],C=u.range(0,O),Pe=u.shuffle([0,1,2]),q=u.chance(.5)?1:-1,le=Is+u.range(-.25,.25),ke=[15.6,10,13.3],F=[-.096,1.876,3.368],g=(b,ce,E)=>.6*Math.sin(b.w*E+b.p)+.4*Math.sin(ce.w*E+ce.p);return function(ce,E){const W=ce+G;let ze=0;const fe=le+.3*g(ge[0],ge[1],W),S=14.5+2.5*g(ge[2],ge[3],W),he=C+2.2*g(ge[4],ge[5],W);for(let P=0;P<3;P++){const p=M[P].s,Q=M[P].k,$=E.sun[P],ne=he+q*F[Pe[P]]+.19*g(p[0],p[1],W),U=ke[Pe[P]]*(1+.12*Math.sin(p[2].w*W+p[2].p));$.elDeg=S+U*Math.sin(ne),$.az=fe+U*Math.cos(ne)*ve/Math.max(Math.cos($.elDeg*ve),.8);const re=.5+.5*(.68*Math.sin(p[3].w*W+p[3].p)+.32*Math.sin(p[4].w*W+p[4].p));$.near=Math.pow(qe(re,0,1),Q.g),$.radDeg=Q.r0+(Q.r1-Q.r0)*$.near,ze+=Math.exp(.3*$.elDeg)}const ue=Math.log(ze)/.3,Fe=Math.log(1+Math.exp(.45*(Ps-ue)))/.45;let H=0;for(let P=0;P<3;P++){const p=E.sun[P],Q=M[P].k,$=(p.elDeg+Fe)*ve,ne=Math.cos($);p.el=$,p.rad=p.radDeg*ve,p.dir[0]=Math.sin(p.az)*ne,p.dir[1]=Math.sin($),p.dir[2]=-Math.cos(p.az)*ne,p.up=Ve(-1.5*ve,4.5*ve,$),p.flux=Q.S*Math.pow(p.radDeg,1.6)*p.up,H+=p.flux*Math.max(0,p.dir[1]+.12)}return E.heat=H,E}}const Qo=u=>(1.86-Math.log(Math.max(u,.5)))/.85,Zo=200,vo=(u,G,ie)=>{let ae=0;for(let k=0;k<7;k++)ae+=Qo(u(G-.5*k,ie).heat);return ae/7},go=u=>.8*Math.tanh(u/.7),wo=()=>({heat:0,sun:[0,1,2].map(()=>({az:0,el:0,elDeg:0,rad:0,radDeg:0,near:0,up:0,flux:0,dir:[0,1,0]}))}),ft="1.15",Xt=[.86,.84,.8],Yt=[.085,.3,.56],Jo=.8,yo=`vec3(${Xt.join(", ")})`,es=`vec3(${Yt.join(", ")})`,xo=`
float tseHash(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float tseNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(tseHash(i), tseHash(i + vec2(1., 0.)), f.x), mix(tseHash(i + vec2(0., 1.)), tseHash(i + vec2(1., 1.)), f.x), f.y); }
float tseFbm(vec2 p){ float a = .5, s = 0.; for (int i = 0; i < 4; i++){ s += a * tseNoise(p); p = p * 2.03 + vec2(17.1, 9.3); a *= .5; } return s; }
`,Ht=`
uniform vec3 uSunDir[3]; uniform vec3 uSunDisc[3]; uniform vec3 uSunGlow[3]; uniform float uSunRad[3];
uniform vec3 uSunE[3]; uniform vec3 uAmb; uniform vec3 uSkyTint; uniform vec3 uCloudCol; uniform vec4 uCirrus;
uniform float uTime; uniform float uFogK; uniform vec4 uFar; uniform vec2 uRowLit;
${xo}
// the air: the sky's colour in a direction with each sun's glow; no cloud, no discs
vec3 tseAir(vec3 d){
  float h = clamp(d.y, 0., 1.);
  vec3 c = mix(vec3(0.6, 0.42, 0.31), ${es}, smoothstep(0., .16, h));
  c = mix(c, vec3(0.018, 0.12, 0.31), smoothstep(.08, .7, h)) * uSkyTint;
  for (int i = 0; i < 3; i++){
    float ang = sqrt(max(2. - 2. * dot(d, uSunDir[i]), 0.)), r = max(uSunRad[i], 1e-4);
    c += uSunGlow[i] * (.9 * exp(-ang / (2. * r)) + .25 * exp(-ang / (6. * r)) + .06 * exp(-ang / .6));
  }
  return c;
}
// WHAT BRINE GIVES BACK OF THE AIR: its blue and a pale cool horizon, a little of the sky's own tint; never the suns'
// warm glow, never the warm haze under the far ranges (no water of this place lies as a warm-tinted patch)
vec3 tseAirCool(vec3 d){ float h = clamp(d.y, 0., 1.);
  vec3 c = mix(vec3(.6, .68, .74), ${es}, smoothstep(0., .2, h));
  return mix(c, vec3(.018, .12, .31), smoothstep(.08, .7, h)) * mix(vec3(dot(uSkyTint, vec3(.3333))), uSkyTint, .4); }
vec3 tseCloud(vec3 c, vec3 d){
  float up = smoothstep(.03, .3, d.y);
  vec2 q = d.xz / (max(d.y, 0.) + .16);
  q = vec2(q.x * uCirrus.x + q.y * uCirrus.y, -q.x * uCirrus.y + q.y * uCirrus.x);
  float n = tseFbm(vec2(q.x * .55 + uTime * .006 + uCirrus.z, q.y * 3.4 + uCirrus.w));
  float m = tseNoise(q * .7 + 5.);
  return mix(c, uCloudCol, smoothstep(.46, .76, n) * smoothstep(.22, .7, m) * up * .7);
}
// THE FAR RANGES: three layers of mountains round the whole basin, painted on the sky (they are 7 to 9 km off and
// about half a kilometre high: nothing of the flight moves against them). Serrated crests; each layer high to one side and low to another, with a gap;
// each farther one paler in the haze, and the haze takes the colour of whichever sun stands over it. NO CREST STANDS
// HIGHER THAN 4.2 DEGREES over the level (the crests' height is bent over to that bound), so that the far giants,
// which stand nearer and are dealt taller than that from every place of the flight, always stand clear above them.
vec3 tseFar(vec3 c, vec3 d){
  float el = d.y / max(length(d.xz), 1e-4);
  if (el > .08) return c;
  float th = atan(d.x, -d.z); vec2 ring = vec2(cos(th), sin(th));
  vec3 hz = tseAir(normalize(vec3(d.x, .02, d.z))), sun = uAmb * 1.6;
  for (int i = 0; i < 3; i++) sun += uSunE[i] * (.3 + .7 * max(dot(normalize(vec3(-d.x, .5, -d.z)), uSunDir[i]), 0.));
  for (int k = 2; k >= 0; k--){
    float fk = float(k), ph = uFar.x + fk * 1.9;
    float gq = sin(.5 * (th - uFar.y - fk * .7)) / .16, env = (.3 + .7 * smoothstep(-.6, .75, sin(th + ph))) * (1. - .88 * exp(-gq * gq));
    vec2 q = ring * (4.2 + fk * 2.3) + uFar.zw + fk * 13.7;
    float n = tseFbm(q), nr = 1. - abs(2. * tseFbm(q * 2.6 + 5.) - 1.), h = .012 + .062 * (1. - exp(-(.118 - fk * .03) * env * (.2 + .78 * n + .6 * nr * nr) / .062));
    float m = 1. - smoothstep(h - .0012, h + .0012, el);
    if (m > .0){
      float rel = clamp(el / max(h, 1e-3), 0., 1.), gul = tseNoise(q * 5.5 + vec2(rel * 3.2, 0.));
      vec3 rock = vec3(.3, .23, .215) * sun * (.5 + .5 * rel + .4 * (gul - .5));
      vec3 lay = mix(rock, hz, .44 + fk * .19);
      c = mix(c, mix(hz, lay, smoothstep(.0, .016, el)), m);
    }
  }
  return c;
}
// the sky as seen: air, thin high cloud, the three discs (a white-hot heart, a coloured limb) and the far ranges
// THE AIR ABOUT THE ROW BRIGHTENS TO ONE HALO THAT JOINS THE THREE DISCS: light about the straight stretch of sky
// from the lowest disc to the highest, strongest on it (some three and a half degrees wide: a little wider than the
// largest disc) and thinning over some ten degrees; it gathers by the fourth power of the row's own measure
// (uRowLit.x), so only as the three come together; it adds the suns' own glow and takes nothing: the sky stays daylit.
vec3 tseHalo(vec3 d){
  vec3 ab = uSunDir[0] - uSunDir[2]; float t = clamp(dot(d - uSunDir[2], ab) / max(dot(ab, ab), 1e-6), 0., 1.), dh = length(d - uSunDir[2] - ab * t), k = uRowLit.x * uRowLit.x;
  return (uSunGlow[0] + uSunGlow[1] + uSunGlow[2]) * (k * k * (.55 * exp(-dh * dh / .0036) + .16 * exp(-dh * dh / .03)));
}
vec3 tseSky(vec3 d){
  vec3 c = tseCloud(tseAir(d), d) + tseHalo(d);
  for (int i = 0; i < 3; i++){
    float ang = sqrt(max(2. - 2. * dot(d, uSunDir[i]), 0.)), r = max(uSunRad[i], 1e-4);
    float x = clamp(ang / r, 0., 1.), mu = sqrt(max(1. - x * x, 0.));
    float edge = 1. - smoothstep(r - max(.0014, r * .05), r + .0008, ang);
    vec3 face = uSunDisc[i] * (.45 + .75 * mu) + vec3(max(uSunDisc[i].r, uSunDisc[i].b)) * mu * mu * mu * mu * .42;
    c = mix(c, face, edge);
  }
  return tseFar(c, d);
}
float tseFog(float d){ float x = d * uFogK; return 1. - exp(-x * x); }
`,ts=`
uniform sampler2D tField; uniform vec4 uField; uniform vec4 uCold; uniform vec3 uHollow;
// how far a place is from the nearest cold hollow, in cells
float tseHol(vec2 x){
  vec2 n = floor(x), f = fract(x); float d = 8.;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++){
    vec2 g = vec2(float(i), float(j)), o = vec2(tseHash(n + g + 7.7), tseHash(n + g + 43.3)) * .9 + .05; d = min(d, length(g + o - f));
  }
  return d;
}
float tseTheta(vec2 p, float grove){
  vec2 w = p + 140. * (vec2(tseNoise(p * .0037 + 3.), tseNoise(p * .0037 + 71.)) - .5) + 36. * (vec2(tseNoise(p * .019 + 9.), tseNoise(p * .019 + 27.)) - .5);
  vec2 q = vec2(dot(w, uCold.zw) / 1.5, dot(w, vec2(-uCold.w, uCold.z))) / max(uField.w, 1.), hq = (p - uHollow.xy) / max(uHollow.z, 1.);
  return -1.15 + 2.25 * smoothstep(0., .8, tseHol(q)) - .3 * grove - .25 * exp(-dot(hq, hq))
    + (tseNoise(p * .04) - .5) * .24 + (tseFbm(p * .085 + 5.) - .5) * .3 + (tseNoise(p * .7) - .5) * .1;
}
// how much vapour lies at a place whose measure is th: a little way in over the frost that is going (about 8 m),
// trailing over the crust it has just left (about 35 m); strongest while the plain thaws fast (uCold.y)
float tseBand(float th){ float bd = uCold.x - th, bx = bd / (bd > 0. ? .1 : .45); return exp(-bx * bx) * (.25 + .75 * uCold.y); }
`,os=ts+`
uniform vec3 uCrust; uniform vec3 uRim; uniform vec3 uSeam; uniform vec3 uBrine; uniform vec3 uFrostCol;
struct TseSurf { vec3 alb; vec3 n; float pool; float frost; float th; float deep; float mid; };
// BRINE LIES IN POOLS, NEVER IN PUDDLES: over .5 of the baked field is brine. The field carries the pools alone (the
// build takes out of it everything that is under 15 m across, gives every pool a middle of deep brine, and lets
// the salt of a shore reach 18 m from a pool and no farther). The shore is made ragged by reading the field a little aside (the place
// bent by up to 2 m, slowly), never by adding to it: a bent shore is still one shore, so no puddle can part from a
// pool and none can stand alone. (Before this a fine noise was added to the field: wherever the field lay near its
// threshold it cut wet patches of 2 to 7 m loose beside the pools and raised others on open ground, each with its
// own hard edge, its own pale salt and a sun's warm glow in it.)
vec2 tsePoolAt(vec2 p){ vec2 q = vec2(p.x * .81 - p.y * .59, p.x * .59 + p.y * .81);
  return p + (vec2(tseNoise(q * .07), tseNoise(q * .07 + 31.)) - .5) * 3.2 + (vec2(tseNoise(q * .19 + 7.), tseNoise(q * .19 + 53.)) - .5) * .8; }
// salt polygons: x = distance to the nearest seam (in cells), yz = the direction to that seam
vec3 tseCells(vec2 x){
  vec2 n = floor(x), f = fract(x), mg = vec2(0.), mr = vec2(0.); float md = 8.;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++){
    vec2 g = vec2(float(i), float(j)), o = vec2(tseHash(n + g), tseHash(n + g + 71.7)) * .96 + .02, r = g + o - f; float d = dot(r, r);
    if (d < md){ md = d; mr = r; mg = g; }
  }
  float e = 8.; vec2 en = vec2(0., 1.);
  for (int j = -2; j <= 2; j++) for (int i = -2; i <= 2; i++){
    vec2 g = mg + vec2(float(i), float(j)), o = vec2(tseHash(n + g), tseHash(n + g + 71.7)) * .96 + .02, r = g + o - f;
    vec2 dr = r - mr; float l2 = dot(dr, dr);
    if (l2 > 1e-5){ vec2 u = dr / sqrt(max(l2, 1e-5)); float d = dot(.5 * (mr + r), u); if (d < e){ e = d; en = u; } }
  }
  return vec3(e, en);
}
// the larger order of salt polygons: how far a place is from the border between its two nearest centres (in cells)
float tseSeam(vec2 x){
  vec2 n = floor(x), f = fract(x); float d1 = 8., d2 = 8.;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++){
    vec2 g = vec2(float(i), float(j)), o = vec2(tseHash(n + g + 19.3), tseHash(n + g + 53.1)) * .8 + .1, r = g + o - f; float d = dot(r, r);
    if (d < d1){ d2 = d1; d1 = d; } else if (d < d2) d2 = d;
  }
  return sqrt(max(d2, 0.)) - sqrt(max(d1, 0.));
}
// how much of a sun's light the rough crust takes at a slant: more than the cosine law for a low sun
float tseLit(vec3 n, vec3 d){ float c = max(dot(n, d), 0.); return 1.12 * c / (c + .12); }
// the ground at a place: its colour, its facing, how much of it is brine, how much frost. fw: a pixel in cells.
TseSurf tseSurfAt(vec2 p, float fw){
  TseSurf s; s.n = vec3(0., 1., 0.); s.frost = 0.;
  float big = tseFbm(p * .013 + 3.7), mid = tseNoise(p * .21);
  vec3 alb = uCrust * (.8 + .4 * big);
  alb = mix(alb, alb * vec3(1.1, .95, .84), smoothstep(.35, .7, tseNoise(p * .034 + 11.)));
  // THE CRUST IN TWO ORDERS, IN PATCHES: small polygons inside large ones with heavier raised seams; patches of
  // rough crust (strong ridges) and of smooth crust (faint ones); long low welts of salt that wander over it. NO
  // TILE: the ground both orders are laid on is pulled about by the place's own noise (at two scales each, by
  // about two fifths of its own measure), so the polygons are unlike in size and shape (the small ones from half a
  // metre to 2 m across, the large from 4 to 14 m: three to one and more), their borders bend, and no rows run
  // through them; every border is broken (it fades out along about a third of its length) and of a width that
  // changes along it. Each is kept as far as its own lines are wider than a pixel's footprint and then falls
  // to the floor's mean tone (as a filtered pattern does): the large order and the welts hold into the middle distance.
  float rough = smoothstep(.38, .62, tseNoise(p * .012 + 31.)), fw2 = fw * ${ft} / 9., det2 = 1. - smoothstep(.1, .45, fw2), seam2 = 0.;
  if (det2 > .001){
    float e2 = tseSeam((p + 18. * vec2(tseNoise(p * .024 + 3.), tseNoise(p * .024 + 47.)) + 4. * vec2(tseNoise(p * .1 + 61.), tseNoise(p * .1 + 83.))) / 9.);
    seam2 = (1. - smoothstep(.02, .04 + .07 * tseNoise(p * .17 + 3.) + fw2, e2)) * det2 * (.3 + .7 * smoothstep(.3, .55, tseNoise(p * .11 + 77.)));
    alb = mix(alb, uRim * .98, seam2 * (.35 + .3 * rough));
  }
  { float wq = tseNoise(p * .028 + 13.), wl = smoothstep(.93, .99, 1. - abs(2. * wq - 1.)) * (1. - smoothstep(.6, 2.5, fw * ${ft}));
    alb = mix(alb, uRim, wl * .45); }
  float det = 1. - smoothstep(.07, .3, fw), rdg = 0., r3 = 0., det3 = 0., grit = .5, gritD = 0.; vec3 tilt3 = vec3(0.);
  if (det > .001){
    vec2 wp = p + 4. * vec2(tseNoise(p * .11), tseNoise(p * .11 + 40.)) + .9 * vec2(tseNoise(p * .45 + 9.), tseNoise(p * .45 + 23.));
    vec3 c = tseCells(wp / ${ft});
    // salt polygons 1 to 3 m across: a fine raised ridge of pale salt along every border, a hairline crack on its crest
    float e = c.x, brk = .25 + .75 * smoothstep(.3, .55, tseNoise(wp * .37 + 5.));
    float ridge = (1. - smoothstep(.015, .03 + .055 * tseNoise(wp * .53 + 9.) + fw * .9, e)) * (.1 / (.1 + fw)) * brk, crack = (1. - smoothstep(.0, .011 + fw * .6, e)) * (.012 / (.012 + fw)) * brk;
    ridge *= .35 + .75 * rough; crack *= .3 + .8 * rough; rdg = ridge * det;
    vec3 a2 = mix(alb * (.88 + .24 * mid) * (.92 + .16 * tseNoise(p * 3.1)), uRim, ridge * .8); a2 = mix(a2, uSeam, crack * .15);
    alb = mix(alb, a2, det);
    float sl = smoothstep(.006, .03, e) * (1. - smoothstep(.04, .1, e));
    s.n = normalize(vec3(-c.y * sl * .32 * det * (.4 + .8 * rough), 1., -c.z * sl * .32 * det * (.4 + .8 * rough)));
  }
  // NEAR THE EYE THE GROUND SHOWS ITS FINER MEASURE: inside every polygon small plates a hand or two across with
  // thin raised edges of pale salt (their ground pulled about like the larger orders', so no rows run through
  // them), and grit at two finer measures laid across one another. Each is kept only while it is wider than what
  // one dot of the screen covers there, like every order of the crust. THE HOAR SHOWS IT TOO (below): frost lies
  // thinner on every raised edge, of the polygons and of the small plates, takes the grit's grain, and keeps the
  // plates' own slopes, so frosted ground near the eye is no smooth white.
  { float fwm = fw * ${ft}; det3 = 1. - smoothstep(.03, .09, fwm); gritD = 1. - smoothstep(.012, .035, fwm);
    if (det3 > .001){
      vec2 gp = p + .3 * vec2(tseNoise(p * 1.3 + 3.), tseNoise(p * 1.3 + 57.)) + .07 * vec2(tseNoise(p * 5.1 + 21.), tseNoise(p * 5.1 + 33.)), gr = vec2(gp.x * .8 - gp.y * .6, gp.x * .6 + gp.y * .8);
      vec3 c3 = tseCells(gp * 4.6); float f3 = fwm * 4.6, brk3 = .2 + .8 * smoothstep(.3, .6, tseNoise(gp * 2.3 + 15.));
      r3 = (1. - smoothstep(.03, .08 + .1 * tseNoise(gp * 3.7 + 9.) + f3, c3.x)) * (.12 / (.12 + f3)) * brk3 * (.45 + .55 * rough) * det3;
      grit = tseNoise(gp * 17.) * .55 + tseNoise(gr * 41.) * .45;
      alb = mix(alb * mix(1., .86 + .28 * grit, gritD), uRim, r3 * .55);
      tilt3 = vec3(-c3.y, 0., -c3.z) * (smoothstep(.01, .06, c3.x) * (1. - smoothstep(.08, .2, c3.x)) * .2 * det3 * brk3);
    } }
  vec2 fuv = (p - uField.xy) / (2. * uField.z) + .5; float fo = 3.4 / (2. * uField.z);
  vec4 fld = texture2D(tField, fuv);
  vec2 puv = (tsePoolAt(p) - uField.xy) / (2. * uField.z) + .5;
  float tA = texture2D(tField, puv + vec2(fo, fo)).r, tB = texture2D(tField, puv + vec2(-fo, fo)).r, tC = texture2D(tField, puv + vec2(fo, -fo)).r, tD = texture2D(tField, puv - vec2(fo, fo)).r;
  fld.r = .25 * (tA + tB + tC + tD);
  // (the way to the brine on the ground: up the field, from the same four readings)
  vec2 pg = vec2(tA + tC - tB - tD, tA + tB - tC - tD); pg /= max(length(pg), 1e-4);
  float pf = fld.r, pm = smoothstep(.492, .508, pf);
  // FROST lies plainly white wherever the cold holds; its edge is feathered and fingered by the fine noise of the
  // place's measure. The hoar is thin where it is young or going (for about forty metres behind its edge the
  // crust's colour shows through it) and deep behind that; the raised seams of the large polygons stand a little out of it.
  s.th = tseTheta(p, fld.g);
  float fin = uCold.x - s.th;
  s.frost = smoothstep(-.04, .04, fin) * (1. - pm);
  float hoar = (1. - .5 * rdg) * (1. - .4 * r3) * mix(1., .84 + .32 * (tseNoise(p * 2.7 + 5.) * .5 + tseNoise(vec2(p.x * .8 - p.y * .6, p.x * .6 + p.y * .8) * 6.3) * .5), det);
  alb = mix(alb, uFrostCol * (.9 + .1 * tseNoise(p * 1.9)) * mix(1., .9 + .2 * grit, gritD) * mix(vec3(.86, .93, 1.), vec3(1.), hoar) * hoar, s.frost * (.5 + .22 * smoothstep(0., .5, fin) + .14 * smoothstep(.3, .7, tseNoise(p * .23 + 3.))) * (1. - .4 * seam2) * (1. - .5 * rdg) * (1. - .45 * r3));
  s.n = normalize(mix(s.n, vec3(0., 1., 0.), s.frost * .6) + tilt3);
  // THE SHORE MELTS INTO THE CRUST AND FALLS TO THE WATER: a pale bloom of salt that begins raggedly 8 to 18 m out
  // and thickens toward the water; A CRUST OF WHITE SALT from about 6 m out; then A DARK BAND OF DAMP SALT over the
  // last metre and a half, where the brine has wetted the crust (the same salt, darker by half and cooler).
  // A POOL LIES IN A HOLLOW: over those last metres the ground falls to the water (its facing leans toward the
  // brine by up to three tenths), so every sun lights the bank that faces it and leaves the other in half shade.
  // THE BRINE IS PALE IN ITS SHALLOWS AND DARK IN ITS MIDDLE: for the first 6 m from the shore its bed shows
  // through it, white salt under a hand of brine (a pale blue-green: never the dry crust's grey or tan), deepening
  // to dark brine (s.deep: how far the brine has deepened; s.mid: how far it lies toward a pool's middle, from 3 m
  // to 12 m from the shore). No brine has a colour of its own that is not blue, slate or the sky over it.
  float salt = smoothstep(.2 + .16 * tseNoise(p * .045 + 17.), .49, pf) * (1. - pm), crustW = smoothstep(.40, .45 + .012 * tseNoise(p * .8), pf) * (1. - pm);
  float damp = smoothstep(.462 + .01 * tseNoise(p * .5 + 9.), .49, pf) * (1. - pm);
  alb = mix(alb, ${yo}, salt * .5); alb = mix(alb, ${yo}, crustW * .85);
  alb = mix(alb, alb * vec3(.44, .48, .54), damp * .9);
  s.n = normalize(s.n + vec3(pg.x, 0., pg.y) * (smoothstep(.40, .475, pf) * (1. - pm) * .3));
  s.deep = smoothstep(.5, .6, pf); s.mid = smoothstep(.55, .7, pf);
  s.alb = mix(alb, mix(${yo} * vec3(.36, .68, .84), uBrine, s.deep), pm); s.n = normalize(mix(s.n, vec3(0., 1., 0.), pm)); s.pool = pm;
  return s;
}
// how much of what is seen at a place of brine is the sky's mirror (the rest is its bed in the suns' light): three
// fifths seen from straight above, all of it at a slant; only the pale shallows show their bed
float tseFres(vec3 V, TseSurf s){ return mix(.62, 1., pow(1. - clamp(V.y, 0., 1.), 3.2)) * (.3 + .7 * s.deep) * s.pool; }
// how much of what is seen at a place is the vapour that lies on it (the frost's edge smoking off, in drifting wisps)
float tseVeil(vec2 p, TseSurf s){
  float puff = tseNoise(p * .045 + vec2(uTime * .09, -uTime * .06)) * .6 + tseNoise(p * .12 - vec2(uTime * .16, uTime * .11)) * .4;
  return clamp(tseBand(s.th) * (1. - s.pool) * (.35 + .65 * smoothstep(.3, .7, puff)) * 1.1, 0., .7);
}
`,ss=`
varying vec3 vD;
void main(){ vD = position; vec4 p = projectionMatrix * viewMatrix * vec4(position + cameraPosition, 1.); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }`,Os=Ht+`
varying vec3 vD;
void main(){ vec3 d = vD / max(length(vD), 1e-4); gl_FragColor = vec4(d.y < 0. ? tseAir(normalize(vec3(d.x, .02, d.z))) : tseSky(d), 1.); }`,as=`
invariant gl_Position;
varying vec3 vW;
void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,Cs=Ht+os+`
uniform vec4 uMir[48]; uniform vec4 uWave[6]; uniform vec4 uRuf; uniform vec4 uPyrAt; uniform vec3 uPyrIs; uniform vec3 uSalt; uniform vec3 uSkyFill;
varying vec3 vW;
void main(){
  vec3 toEye = cameraPosition - vW; float dist = length(toEye); vec3 V = toEye / max(dist, 1e-3);
  vec2 p = vW.xz; float fw = max(fwidth(p.x), fwidth(p.y)) / ${ft};
  TseSurf s = tseSurfAt(p, fw);
  vec3 col = s.alb * uAmb;
  for (int i = 0; i < 3; i++) col += s.alb * uSunE[i] * tseLit(s.n, uSunDir[i]);
  if (s.pool > .001){
    // brine mirrors the air and the three discs along the mirrored line, and IT IS WATER: FINE RIPPLES TRAVEL OVER IT
    // WITH THE CLOCK, AND THEY MAKE NO GRID. Six trains of ripples (uWave) all run one way, within an eighth of a
    // radian of the place's wind, so no two of them cross at any angle near a right one; their lengths are unlike
    // (a quarter of a metre to 3.4 m), each has its own seeded phase and its own steady rate, and their crests are
    // bent by the place's noise. EVERY TRAIN IS BROKEN INTO RUFFLES OF ITS OWN SIZE: it runs only in patches some
    // three of its lengths long and half as wide, which travel with it at half its speed, so near the eye the
    // brine shows short broken ruffles of unlike sizes and never one even weave. Each train is told as far as its
    // length is some ten times a pixel's footprint and is gone at two and a half times (as a filtered pattern
    // goes). The wind does not lie evenly on a pool: slow patches of ruffled brine drift over it (ruf: they lie where
    // two dice of the ripples' own stream put them and drift along the place's wind, the larger at 1.4 m a second
    // and the smaller at 0.8), where the
    // ripples stand higher and, too far off to be told one by one, give back the air from a little higher up, so
    // the far brine carries drifting streaks of deeper blue on its pale mirror. Everything here is a sine or a
    // noise of the clock at a steady rate: bounded, and nothing of it grows with the clock. (No noise of the
    // ground's own lattice tilts the brine: every noise here is read on ground turned off the lattice's lines.)
    float rip = 1. - smoothstep(.15, 1.2, fw), fwm = fw * ${ft};
    vec2 pr = vec2(p.x * .81 - p.y * .59, p.x * .59 + p.y * .81);
    vec2 rw = vec2(uRuf.x * .81 - uRuf.y * .59, uRuf.x * .59 + uRuf.y * .81);
    float ruf = smoothstep(.3, .72, tseNoise(pr * .043 + uRuf.zw - rw * (uTime * .06)) * .65 + tseNoise(pr * .13 + uRuf.wz - rw * (uTime * .108)) * .35);
    vec2 rn = vec2(0.);
    float bend = (tseNoise(pr * .09 + 3.) - .5) * 6., told = 0.;
    for (int i = 0; i < 6; i++){
      vec4 wv6 = uWave[i]; float k = length(wv6.xy), see = 1. - smoothstep(.1, .4, fwm * k / 6.2832); vec2 wd = wv6.xy / k;
      vec2 wq = vec2(dot(p, wd) * k * .053 - uTime * wv6.w * .0265, dot(p, vec2(-wd.y, wd.x)) * k * .106) + float(i) * 17.3;
      rn += wd * cos(dot(p, wv6.xy) + bend * (1. + .4 * float(i)) - uTime * wv6.w + wv6.z) * see * smoothstep(.3, .7, tseNoise(wq)) * (.018 + .04 * ruf); told += see / 6.;
    }
    vec3 nr = normalize(vec3(rn.x, 1., rn.y));
    vec3 R = reflect(-V, nr); R.y = abs(R.y) + .003 + .035 * ruf * (1. - told); R = normalize(R);
    // BRINE IS A MIRROR AT EVERY ANGLE (dense and calm): seen from straight above it gives back three fifths of the air all the same; only its shallows show their bed
    float fres = tseFres(V, s);
    // THE NEEDLES MIRRORED: the tallest needles of the pools' shores (uMir: x, z, half width, height) stand upside down in
    // the brine along the same mirrored line, as upright stones that taper, swell and bow as the needles do, soft at the
    // edge and fainter the higher up the stone (so the images soften away from the far shore); the ripples bend them sideways
    vec3 sky = tseAirCool(R); float rl = max(length(R.xz), 1e-4), slope = R.y / rl, hit = 0.; vec2 rd = R.xz / rl;
    float wv = (tseNoise(vec2(dot(p, vec2(-rd.y, rd.x)) * .21, dot(p, rd) * .8 + uTime * .4)) - .5) * (1. - smoothstep(.25, 1.4, fw));
    // THE BRINE IS A MIRROR, NOT A STAIN. EACH SUN'S OWN DISC stands in it where the mirrored line meets that sun
    // (a little dimmer than the sun; the ripples break it near the eye and leave it whole far off), and the halo
    // that joins the three when the row stands; what stands on the shore is drawn over them.
    sky += tseHalo(R) * .8;
    for (int i = 0; i < 3; i++){
      float ang = sqrt(max(2. - 2. * dot(R, uSunDir[i]), 0.)), r = max(uSunRad[i], 1e-4);
      sky = mix(sky, uSunDisc[i] * .85, (1. - smoothstep(r * .85, r * 1.15 + .004, ang)) * smoothstep(-.02, .03, uSunDir[i].y));
    }
    // THE PYRAMID MIRRORED WITH ITS OWN LIT COLOURS AND PARTS: along the mirrored line the brine gives back the
    // pyramid's outline (its base as broad as it is seen from that side, narrowing evenly to the house on its
    // top) and the risers of the side that looks back along that line (from under the brine's level only the
    // faces that stand are seen), IN THE STONE'S OWN LAW OF LIGHT: each sun by how far the riser is turned to
    // it (the stone's own wrap), half the sky's lamp and half the air's blue from above, and from below half
    // of what the white salt gives off under the light that falls on level ground; every tier with its lit
    // edge, the shade under that edge and its darkening to the foot (the dress's own shares), and on the
    // side toward the ring the paler stair with its steps (the joints, streaks and mottle of single stones
    // are not carried); a quarter of that light is lost in the mirror and the brine's own colour fills a
    // share of it back, so the whole stands no more than about a fifth dimmer than the thing; the ripples
    // bend its edge.
    { vec2 dp = uPyrAt.xy - p; float t = dot(dp, rd), y = t * slope;
      if (t > 0. && y < uPyrIs.y){
        float ca = dot(rd, uPyrAt.zw), sa = rd.x * uPyrAt.w - rd.y * uPyrAt.z;
        float q = y / uPyrIs.y, r = mix(uPyrIs.x, uPyrIs.z, q) * (abs(ca) + abs(sa));
        float ls = dp.x * rd.y - dp.y * rd.x + wv * t * .03, lat = abs(ls);
        vec2 fh = abs(ca) >= abs(sa) ? -sign(ca) * uPyrAt.zw : sign(sa) * vec2(-uPyrAt.w, uPyrAt.z);
        vec3 fn = vec3(fh.x, 0., fh.y), gnd = uAmb, lit = vec3(0.);
        for (int i = 0; i < 3; i++){ float c = max(uSunDir[i].y, 0.); gnd += uSunE[i] * 1.12 * c / (c + .12); lit += uSunE[i] * max((dot(fn, uSunDir[i]) + .42) / 1.42, 0.); }
        lit += .5 * (uAmb + vec3(.1, .13, .17) + uSkyFill + vec3(.86, .84, .8) * gnd);
        float hh = 1. - fract(y / 16.5), lip = 1. - smoothstep(.06, .1, hh), stair = (abs(ca) >= abs(sa) && ca > 0. ? 1. : 0.) * (1. - smoothstep(26., 32., lat));
        vec3 pc = vec3(.64, .47, .37) * lit * mix(1., .58, smoothstep(.7, 1., hh)) * (1. + .16 * lip) * (1. - .3 * (1. - lip) * (1. - smoothstep(.12, .3, hh))) * (1. - .1 * smoothstep(.8, 1., fract(y / 4.125)));
        pc = mix(pc, pc * vec3(1.14, 1.12, 1.08) * (.92 + .14 * step(.5, fract(y / 4.125))), stair);
        // (the row's light on the stair stands in the brine as it stands on the stone: above the light's front only)
        float qy = ${(ct.tier*ct.tiers+8).toFixed(1)} * (1. - uRowLit.y) - 8.;
        pc += vec3(.64, .47, .37) * (uSunE[0] + uSunE[1] + uSunE[2]) * (${Jo.toFixed(2)} * uRowLit.x * smoothstep(qy - 8., qy + 8., y) * stair);
        sky = mix(sky, pc * .74, (1. - smoothstep(r - 2., r + 3. + t * .01, lat)) * (1. - smoothstep(.96, 1., q)));
      } }
    for (int i = 0; i < 48; i++){
      vec4 m = uMir[i]; vec2 dp = m.xy - p; float t = dot(dp, rd), y = t * slope;
      if (t > 0. && y < m.w){
        float mz = max(m.z, .1), q = y / max(m.w, 1e-3), r = mz * (.22 + .78 * pow(max(1. - q, 0.), .75)) * (1. + .22 * sin(y * 4.4 / mz + m.x * .37) + .12 * sin(y * 9.7 / mz + m.y * .53)) + .1;
        float lat = dp.x * rd.y - dp.y * rd.x + mz * .5 * sin(q * 5. + m.x) * q + wv * t * .03;
        hit = max(hit, (1. - smoothstep(r * .5, r * 1.25 + t * .012, abs(lat))) * (1. - smoothstep(.2, .85, q)));
      }
    }
    // A POOL FAR OFF IS NO FLAT PATCH: where the mirrored line, followed 40, 110 and 240 m out over the ground,
    // comes among standing needles (the field's own count of how thick they stand), the brine gives back their
    // dark heads as a broken row, each as tall as the line's slope lets it show; so a far pool carries the dark
    // stones of its far shore under the pale air of the horizon. A HEAD IS A PLACE OF THE SHORE: how tall it stands
    // is read at the shore's own place on the ground (ps), in the world's metres, on ground turned off the lattice's
    // lines like every noise here, in cells 4 m wide (about a needle's width), and never along the eye's own line:
    // so a head belongs to a spot of the far shore, stands as tall whoever looks and passes with the shore. (Where
    // such a cell is narrower than a dot of the screen its height cannot be drawn and is left at the mean of all.)
    for (int j = 0; j < 3; j++){
      float t = j == 0 ? 40. : j == 1 ? 110. : 240.; vec2 ps = p + rd * t;
      float dn = texture2D(tField, (ps - uField.xy) / (2. * uField.z) + .5).g;
      vec2 qs = vec2(ps.x * .81 - ps.y * .59, ps.x * .59 + ps.y * .81) * .25; float fs = max(fwidth(qs.x), fwidth(qs.y));
      float hn = (8. + 34. * mix(tseNoise(qs), .5, smoothstep(.5, 1.5, fs))) * smoothstep(.08, .5, dn);
      hit = max(hit, (1. - smoothstep(hn * .6, hn + .01, t * slope)) * .8);
    }
    sky = mix(sky, mix(vec3(.27, .245, .23) * (uAmb * 2.2 + (uSunE[0] + uSunE[1] + uSunE[2]) * .22), sky, .35), hit * .85);
    // THE SUNS ON THE BRINE: each a smooth path of PALE light (its own colour drawn seven tenths of the way to
    // white: at no strength can a sun's light on water lie between the brine's blue and white as a warm tint). The
    // ripples' slopes are spread like a bell, so a sun's image is soft at its edge and drawn out toward the eye where
    // the brine is seen at a slant. There is no wider glitter round it: a pool beside a sun's path is not washed in that sun's colour.
    for (int i = 0; i < 3; i++){
      vec3 hv = V + uSunDir[i]; hv /= max(length(hv), 1e-4); vec2 sl2 = hv.xz / max(hv.y, 1e-3);
      float r = max(uSunRad[i], 1e-4), s2 = .0022 + r * r * .25;
      float up = smoothstep(-.02, .03, uSunDir[i].y), sq = dot(sl2, sl2);
      sky += mix(uSunDisc[i], vec3(dot(uSunDisc[i], vec3(.3, .5, .2))), .7) * exp(-sq / (2. * s2)) * min(1., .55 * r * r / s2) * up;
    }
    // (the ring is not mirrored: the brine could give back only an empty hoop, never what the ring shows)
    // THE DEEP MIDDLE OF A POOL IS DARKER: toward its middle the brine gives back a third less of the air, as slate
    // (seen at a low angle the middle is a whole mirror too: the darkening holds only where the eye looks down into it)
    col = mix(col, sky * mix(vec3(1.), vec3(.6, .66, .74), s.mid * smoothstep(.08, .45, V.y)), fres);
  }
  // THE FRONT'S SMOKE: the frost smokes off. Along its edge a low white vapour lies on the ground in drifting wisps
  // (and stands a little off it as low puffs, drawn by their own mesh):
  // a little way in over the frost that is going (about 20 m) and trailing over the crust it has just left (about
  // 70 m), strongest while the plain thaws fast, a thin mist at the edge while it holds or freezes
  vec3 vapL = uAmb * 2.4 + (uSunE[0] + uSunE[1] + uSunE[2]) * .5;
  col = mix(col, vapL, tseVeil(p, s));
  vec3 hz = tseAir(normalize(vec3(-V.x, .02, -V.z)));
  gl_FragColor = vec4(mix(col, hz, tseFog(dist)), 1.);
}`,ns=`
attribute vec4 aFoot; attribute vec4 aTip;
uniform vec3 uDir; uniform float uTanR;
varying vec3 vW; varying vec4 vS; varying vec2 vT; varying float vLh;
void main(){
  float sy = max(uDir.y, 1e-3), cot = min(sqrt(max(1. - sy * sy, 0.)) / sy, 8.);
  float hl = max(length(uDir.xz), 1e-4); vec2 away = -uDir.xz / hl;
  vec2 ax = aTip.xy + away * (aFoot.w * cot);
  float L = max(length(ax), 1e-3); vec2 ad = ax / L, pd = vec2(-ad.y, ad.x);
  float pen = uTanR * aFoot.w / sy, hw = max(aFoot.z * .62, .85) + pen + .06;
  float along = position.y * 1.1 - .04;
  vec2 g = aFoot.xy + ad * (along * L) + pd * (position.x * 2. * hw);
  vW = vec3(g.x, 0., g.y); vS = vec4(position.x * 2. * hw, along, aFoot.z * .5, pen); vT = aTip.zw; vLh = L / max(aFoot.w, 1e-3);
  gl_Position = projectionMatrix * viewMatrix * vec4(g.x, 0., g.y, 1.);
}`,rs=Ht+os+`
uniform vec3 uDir; uniform vec3 uE; uniform float uCapFade; uniform float uShade; uniform float uMode;
varying vec3 vW; varying vec4 vS; varying vec2 vT; varying float vLh;
void main(){
  float dist = length(cameraPosition - vW);
  vec2 p = vW.xz; float fw = max(fwidth(p.x), fwidth(p.y)) / ${ft}, fa = fwidth(vS.x);
  TseSurf s = tseSurfAt(p, fw);
  float a = vS.x, v = clamp(vS.y, 0., 1.), tr = vT.y < 0. ? -vT.y : clamp(vT.y, .3, .5);
  float hwN = max(vS.z * 1.2, .8) * (tr + (1. - tr) * pow(max(1. - v, 0.), clamp(vT.x, .3, 2.)));
  float f = max(vS.w, 0.) * v + fa * .7 + .03;
  float cov = clamp((min(a + f, hwN) - max(a - f, -hwN)) / (2. * f), 0., 1.);
  cov *= smoothstep(-.04, .0, vS.y) * (1. - smoothstep(.86, 1.06, vS.y)) * (1. - uCapFade * smoothstep(.5, 1., v));
  // WHAT THE STRIP TAKES IS EXACTLY WHAT THE GROUND HAS OF ITS SUN at that place, term for term as the ground's
  // shader lays it (so no colour can be taken under nought): the sun's light on the crust, less the share of the
  // place that is the brine's mirror and the share that is vapour; and of the vapour, the half of the sun's light it carries
  float veil = tseVeil(p, s);
  vec3 mine = uE * tseLit(s.n, uDir), c = s.alb * mine * (1. - tseFres((cameraPosition - vW) / max(dist, 1e-3), s)) * (1. - veil) + uE * .5 * veil;
  // RIME KEPT BY THE SHADE (the second pass of the strips, uMode 1): inside a shadow that truly shades, within about
  // one and a half heights of the stone that throws it, a fine even rime comes sooner and stays longer, feathered
  // at its edge; it is lit by the other two suns and the sky. The buffer's alpha keeps it from being laid twice.
  vec3 rest = uAmb;
  for (int i = 0; i < 3; i++) rest += uSunE[i] * tseLit(s.n, uSunDir[i]);
  float share = dot(mine, vec3(.333)) / max(dot(rest, vec3(.333)), 1e-3);
  rest = max(rest - mine, vec3(0.));
  float core = smoothstep(-.05, .05, uCold.x + uShade - s.th) * (1. - s.frost) * (1. - s.pool) * (1. - smoothstep(.2, 1., abs(a) / max(hwN, .05)))
    * (1. - smoothstep(.4, .9, v)) * (1. - smoothstep(.45, 1.5, v * vLh)) * smoothstep(.1, .3, share) * cov * .62;
  // the rime is never brighter than the lit ground beside it: shade is darker than light everywhere
  float la = dot(s.alb, vec3(.333)), lf = dot(uFrostCol * .95, vec3(.333));
  core = min(core, cov * clamp((.88 / max(1. - share, .05) - 1.) * la / max(lf - la, 1e-3), 0., 1.));
  vec4 shadow = vec4(c * cov * (1. - tseFog(dist)), cov);
  vec4 frost = vec4((uFrostCol * .95 - s.alb) * rest * core * (1. - tseFog(dist)), core);
  gl_FragColor = mix(shadow, frost, uMode);
}`,is="uniform float uA; void main(){ gl_FragColor = vec4(0., 0., 0., uA); }",Bs=1/3,bo=[.35,.9],qs=`
attribute vec4 aRise; attribute vec4 aStone; uniform float uRise; uniform float uTime; uniform float uClear; varying float vTseOpen;
mat3 tseTurn(vec3 k, float a){ float c = cos(a), s = sin(a), t = 1. - c;
  return mat3(t * k.x * k.x + c, t * k.x * k.y + s * k.z, t * k.x * k.z - s * k.y, t * k.x * k.y - s * k.z, t * k.y * k.y + c, t * k.y * k.z + s * k.x, t * k.x * k.z + s * k.y, t * k.y * k.z - s * k.x, t * k.z * k.z + c); }`,Gs=`
  float tseS0 = aRise.x + .2 * aStone.w * (1. - aRise.x), tseB = aRise.w + aStone.w * 40.;
  float tseUp = pow(max(uRise - tseS0, 0.), 1.7) * aRise.y * (1. - .5 * fract(aStone.w * 7.31));
  float tseOff = smoothstep(0., 3., tseUp), tseFree = max(tseUp - uClear, 0.);
  vTseOpen = smoothstep(0., 1. + uClear, tseFree);
  float tseLean = (${bo[0].toFixed(2)} + ${(bo[1]-bo[0]).toFixed(2)} * fract(tseB * 2.17)) * (aRise.z < 0. ? -1. : 1.) / (1. + .1 * uClear);
  mat3 tseR = tseTurn(normalize(vec3(cos(tseB), .35, sin(tseB))), tseLean * vTseOpen * (1. + ${Bs.toFixed(3)} * sin(uTime * clamp(abs(aRise.z) * 12., .04, .6) + tseB * 5.)) + tseFree * aRise.z);
  objectNormal = tseR * objectNormal;`,_s=`
  transformed = aStone.xyz + tseR * (transformed - aStone.xyz);
  vec3 tseGo = vec3(cos(tseB) * .05, 1., sin(tseB) * .05) * tseUp; tseGo.y += sin(uTime * (.5 + .5 * fract(tseB * 1.37)) + tseB * 9.) * .8 * tseOff;
#ifdef USE_INSTANCING
  tseGo = inverse(mat3(instanceMatrix)) * tseGo;
#endif
  transformed += tseGo;`,Vs=`
attribute vec4 aPuff;
uniform float uTime;
${xo}
${ts}
varying vec3 vW; varying vec3 vQ; varying float vA;
void main(){
  vec2 p = aPuff.xy + 3. * vec2(sin(uTime * .21 + aPuff.w * 40.), cos(uTime * .17 + aPuff.w * 23.));
  vec4 fld = texture2D(tField, (p - uField.xy) / (2. * uField.z) + .5);
  float a = tseBand(tseTheta(p, fld.g)) * (1. - smoothstep(.47, .5, fld.r)) * (.55 + .45 * sin(uTime * (.5 + .5 * aPuff.w) + aPuff.w * 60.));
  float on = smoothstep(.04, .2, a) * step(0., aPuff.z), w = (9. + 9. * aPuff.z) * on, h = (1.5 + 1.3 * aPuff.z) * on;
  vec2 toEye = cameraPosition.xz - p; vec2 side = vec2(toEye.y, -toEye.x) / max(length(toEye), 1e-3);
  vW = vec3(p.x + side.x * position.x * w, position.y * h, p.y + side.y * position.x * w);
  vQ = vec3(position.x * 2., position.y, aPuff.w); vA = a;
  gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.);
}`,Ws=Ht+`
varying vec3 vW; varying vec3 vQ; varying float vA;
void main(){
  // soft at both sides and on the ground, ragged and thin at the top
  float n = tseNoise(vec2(vQ.x * 1.7 + vQ.z * 31., vQ.y * 1.3 - uTime * .12 + vQ.z * 17.)), top = .35 + .6 * n;
  float body = max(1. - vQ.x * vQ.x, 0.) * (1. - smoothstep(top * .3, top, vQ.y)) * smoothstep(0., .1, vQ.y);
  vec3 vapL = uAmb * 2.4 + (uSunE[0] + uSunE[1] + uSunE[2]) * .5;
  gl_FragColor = vec4(vapL, clamp(vA, 0., 1.) * body * body * .5 * (1. - tseFog(length(cameraPosition - vW))));
}`,Us=`#include <color_fragment>
  float tseH = dot(vTseP - uBedFoot, uBedAxis); vec2 tseX = (vTseP - uBedAxis * tseH).xz;
  float tseDip = (tseNoise(tseX * .016 + vec2(tseH * .0047, -tseH * .0031)) - .5) * 2. + (tseNoise(tseX * .05 + vec2(-tseH * .013, tseH * .017) + 7.) - .5) * .5
    + (tseNoise(tseX * .31 + vec2(tseH * .21, tseH * .13) + 19.) - .5) * .1;
  float tseY0 = tseH * .42 + tseDip, tseY = tseY0 + (tseNoise(vec2(tseY0 * .8, 3.3)) - .5) * .9;
  float tseBi = floor(tseY), tseBf = fract(tseY), tseFw = fwidth(tseY), tseDet = 1. - smoothstep(.6, 2., tseFw);
  float tseTone = tseHash(vec2(tseBi, 3.7)), tseHard = tseHash(vec2(tseBi, 8.1));
  float tsePart = (1. - smoothstep(.0, .035 + tseFw, min(tseBf, 1. - tseBf))) * tseDet * (.3 + .7 * tseHard);
  float tseDot = max(fwidth(tseX.x) + fwidth(tseX.y), fwidth(tseH)), tsePd = 1. - smoothstep(.06, .2, tseDot);
  float tsePit = tseNoise(tseX * 1.9 + tseH * 1.3) * .6 + mix(.5, tseNoise(tseX * 4.7 - tseH * 3.1), tsePd) * .4;
  float tseMot = tseNoise(tseX * .37 + tseH * .23) * .6 + tseNoise(tseX.yx * .9 - tseH * .5 + 4.) * .4;
  float tseBig = tseNoise(vec2(tseH * .07 + tseDip * .2, 1.3));
  float tseFd = 1. - smoothstep(.25, .7, fwidth(tseX.x) + fwidth(tseX.y));
  vec2 tseXw = tseX + (vec2(tseNoise(vec2(tseH * .13, 7.)), tseNoise(vec2(tseH * .13, 19.))) - .5) * 3.2;
  float tseGd = 1. - smoothstep(.03, .14, fwidth(vTseP.y) + fwidth(vTseP.x) + fwidth(vTseP.z));
  float tseGr = tseNoise(tseX * 9. + tseH * 7.) * .55 + tseNoise(tseX.yx * 23. - tseH * 19.) * .45;
  float tsePale = step(.8, tseHash(vec2(tseBi, 5.3))) * tseDet;
  float tseLy = tseY * 8. + (tseNoise(tseX * 1.1 + vec2(tseH * .31, -tseH * .2)) - .5) * 1.2, tseLf = fract(tseLy), tseLd = 1. - smoothstep(.5, 1.6, fwidth(tseLy)), tseLr = 1. - smoothstep(.12, .35, fwidth(tseLy));
  float tseLt = tseHash(vec2(floor(tseLy), 1.7));
  float tseL2 = tseLy * 5. + (tseNoise(tseX * 3.3 + vec2(tseH * 1.1, -tseH * .7)) - .5) * 1.6, tseL2w = fwidth(tseL2), tseL2d = 1. - smoothstep(.3, 1.1, tseL2w), tseL2f = fract(tseL2);
  float tseL2t = tseHash(vec2(floor(tseL2), 4.9)), tseL2p = (1. - smoothstep(0., .1 + tseL2w, min(tseL2f, 1. - tseL2f))) * tseL2d * (.4 + .6 * tseHash(vec2(floor(tseL2), 9.3)));
  float tseG2d = 1. - smoothstep(.008, .04, fwidth(vTseP.y) + fwidth(vTseP.x) + fwidth(vTseP.z));
  vec2 tseXr = vec2(tseX.x * .8 - tseX.y * .6, tseX.x * .6 + tseX.y * .8);
  float tseG2 = tseNoise(tseX * 43. + tseH * 37.) * .5 + tseNoise(tseXr * 101. - tseH * 89.) * .5;
  diffuseColor.rgb *= mix(1., .78 + .4 * tseTone, tseDet) * (.82 + .3 * tseBig) * (.8 + .36 * tsePit) * (.76 + .46 * tseMot) * (1. - .46 * tsePart)
    * mix(1., .84 + .32 * tseGr, tseGd) * (1. + .3 * tsePale) * mix(1., .84 + .32 * tseLt, tseLd) * mix(.72, 1., smoothstep(0., 7., vTseP.y))
    * mix(1., .87 + .26 * tseL2t, tseL2d) * (1. - .2 * tseL2p) * mix(1., .84 + .32 * tseG2, tseG2d);
  float tseFl = tseNoise(tseXw * 1.3 + vec2(tseH * .05, -tseH * .037)) * .55 + tseNoise(tseXw * .47 + vec2(-tseH * .043, tseH * .031) + 17.) * .45;
  float tseFm = smoothstep(.35, .65, tseNoise(tseX * .21 + tseH * .06 + 31.)) * (.25 + .75 * smoothstep(.3, .7, tseNoise(vec2(tseH * .09 + 3., tseX.x * .05 + tseX.y * .07))));
  float tseEw = .1 + tseFw * 1.5;
  float tseRel = (tseHard - .45) * .8 * (1. - smoothstep(.12, .4, tseFw)) * smoothstep(0., tseEw, tseBf) * smoothstep(0., tseEw, 1. - tseBf) + (tseFl - .5) * .5 * tseFm * tseFd
    + (tseLt - .5) * .14 * smoothstep(0., .3, tseLf) * smoothstep(0., .3, 1. - tseLf) * tseLr + (tsePit - .5) * .25 * tsePd
    + (tseL2t - .5) * .025 * smoothstep(0., .3, tseL2f) * smoothstep(0., .3, 1. - tseL2f) * tseL2d + (tseG2 - .5) * .006 * tseG2d;
  float tseFk = tseFd * (.3 + .7 * smoothstep(.3, .7, tseNoise(tseX * .13 + tseH * .07 + 51.)));
  vec3 tseFac = vec3((tseNoise(tseXw * .55 + vec2(tseH * .04, 0.)) - .5) * tseFk, (tseBf - .5) * .5 * (.3 + .7 * tseHard) * tseDet, (tseNoise(tseXw * .55 + vec2(31., tseH * .04)) - .5) * tseFk) * vec3(.55, .5, .55);`,js=`#include <normal_fragment_maps>
  { vec3 tseNn = normal + (viewMatrix * vec4(tseFac, 0.)).xyz; normal = tseNn / max(length(tseNn), 1e-4);
    vec3 tsePx = dFdx(-vViewPosition), tsePy = dFdy(-vViewPosition), tseR1 = cross(tsePy, normal), tseR2 = cross(normal, tsePx);
    float tseDt = dot(tsePx, tseR1);
    vec3 tseG = (dFdx(tseRel) * tseR1 + dFdy(tseRel) * tseR2) * sign(tseDt) / max(abs(tseDt), 1e-7);
    tseG *= min(1., 1.6 / max(length(tseG), 1e-4));
    normal = normalize(normal - tseG); }`,Pt=[14,-40,0,-1,42,30],Ue=[-4,-124,38,46],Xs=26,ls=10,hs=25,Ys=40,Kt=70,cs=9,It=150,Re=[0,-660],Le=1280,ee=512,Ks=ct.half,$s=ct.height,Qs=882,So=(u,G)=>[u[0]*Math.cos(G)-u[1]*Math.sin(G),u[0]*Math.sin(G)+u[1]*Math.cos(G)],dt=(u,G)=>{const ie=Math.hypot(u,G)||1;return[u/ie,G/ie]},Zs=-1,fs=[.72,.14],Mo=6,Ao=30,ds=130,Js=100;function ea(u){const G=u.range(-.1,.1),ie=u.range(800,900),ae=[Math.sin(G)*ie,-Math.cos(G)*ie],k=[];for(let R=0;R<18;R++){const He=u.range(0,O),De=u(),we=R===0?0:R===1?It+35*De:70+270*Math.sqrt(De);k.push({x:ae[0]+Math.cos(He)*we,z:ae[1]+Math.sin(He)*we,h:u.range(250,340),sl:u.range(9,11),blunt:u.chance(.2)})}const K=u(),M=u.range(.22,.3),ge=u.range(-1,1),C=u.range(320,380),Pe=u.chance(.5)?1:-1,q=u.range(110,130),le=[];for(let R=0;R<6;R++)le.push({a:u.range(0,O),d:u.range(It,250),h:u.range(250,330),sl:u.range(9,11)});const ke=(R,He,De)=>R.every(we=>Math.hypot(we.x-He,we.z-De)>=It);let F=[];k.forEach((R,He)=>{F.length<6&&ke(F,R.x,R.z)&&F.push({x:R.x,z:R.z,h:R.h,w:R.h/R.sl,blunt:R.blunt,who:"family"+He})});const g=F[0];let b=F[1];for(const R of F)R!==g&&Math.hypot(R.x-g.x,R.z-g.z)<Math.hypot(b.x-g.x,b.z-g.z)&&(b=R);const ce=Math.hypot(b.x-g.x,b.z-g.z),E=dt(b.x-g.x,b.z-g.z),W=Math.min((56+7*K)*ve,Math.acos(1.22*ce/395)),ze=ce/Math.cos(W),fe=Math.min(ze*(1+M),395),S=fe/10;Object.assign(g,{h:fe*Math.sin(W),w:S,blunt:!1,leanTo:[E[0]*fe*Math.cos(W),E[1]*fe*Math.cos(W)],bow:[0,0],lean:W,len:fe}),Object.assign(b,{h:(ce-.3*S)*Math.tan(W)+3,blunt:!0}),b.w=b.h/9.5,g.who="pass-toppled",b.who="pass-rest";const he=[g.x+E[0]*ce*.56,g.z+E[1]*ce*.56],ue=(.56*ce-.4*S)*Math.tan(W),Fe=dt(he[0],he[1]),H=55*ve;let P=Math.atan2(E[0]*Fe[1]-E[1]*Fe[0],E[0]*Fe[0]+E[1]*Fe[1]);Math.abs(P)<H?P=P<0?-H:H:Math.abs(P)>Math.PI-H&&(P=P<0?H-Math.PI:Math.PI-H);const p=(P<0?-1:1)*Zs*(fs[0]+fs[1]*Math.abs(ge)),Q=So(E,P),$=So(Q,p),ne=[he[0]+$[0]*C,he[1]+$[1]*C],U=[he[0]+Q[0]*80,he[1]+Q[1]*80],re=dt(ne[0]-U[0],ne[1]-U[1]),j=[ne[0]+Pe*70*re[1]-6*re[0],ne[1]-Pe*70*re[0]-6*re[1]],A=dt(j[0]-U[0],j[1]-U[1]),Ne=Math.hypot(j[0]-U[0],j[1]-U[1]),Ie=[-A[1],A[0]],et=(he[0]-j[0])*Ie[0]+(he[1]-j[1])*Ie[1]<0?1:-1,Oe=(Mo+.5)*40+8,je={x:j[0]+et*Ie[0]*Oe,z:j[1]+et*Ie[1]*Oe,h:400,w:40,hero:!0,who:"tallest"};F=F.filter(R=>R===g||R===b||ke([je],R.x,R.z));const Xe=[];return le.forEach((R,He)=>{const De=ne[0]+Math.cos(R.a)*R.d,we=ne[1]+Math.sin(R.a)*R.d,Me=qe((De-U[0])*A[0]+(we-U[1])*A[1],0,Ne+80);Xe.length<2&&Math.hypot(De-U[0]-A[0]*Me,we-U[1]-A[1]*Me)>=(Mo+.5)*R.h/R.sl+8&&ke([je,...F,...Xe],De,we)&&Xe.push({x:De,z:we,h:R.h,w:R.h/R.sl,who:"ring"+He})}),{C:ae,giants:[je,...F,...Xe],top:g,nb:b,pass:he,dir:Q,after:U,ring:j,endDir:A,under:ue,passH:qe(.28*ue,28,38),ringPool:[j[0]-90*A[0],j[1]-90*A[1],A[0],A[1],q,44]}}function ta(u){const G=l=>Yo(uo(l+":"+u)),ie=G("tse-alone"),ae=G("tse-way"),k=G("tse-far"),K=Es(uo("tse-noise:"+u)),M=ea(G("tse-giants")),ge=M.pass,C=M.endDir,Pe=Qs,q={x:M.ring[0]+C[0]*Pe,z:M.ring[1]+C[1]*Pe,dir:[C[0],C[1]],half:Ks,h:$s,away:Pe},le=[0,Pt[1]-Pt[4]],ke=[ge[0]-M.dir[0]*110,ge[1]-M.dir[1]*110],F=l=>[M.ring[0]-l*C[0],M.ring[1]-l*C[1]],g=(l,x,y,w,T)=>{const z=Math.hypot(y[0]-l[0],y[1]-l[1]),L=T*T,B=L*T,X=2*B-3*L+1,Z=(B-2*L+T)*z,ye=3*L-2*B,N=(B-L)*z;return[X*l[0]+Z*x[0]+ye*y[0]+N*w[0],X*l[1]+Z*x[1]+ye*y[1]+N*w[1]]},b=[[0,0],[0,le[1]/2],le],ce=[0,-1],E=dt(ke[0]-le[0],ke[1]-le[1]),W=[-E[1],E[0]],ze=Math.hypot(ke[0]-le[0],ke[1]-le[1]),fe=[],S=[];let he=M.dir[0]*W[0]+M.dir[1]*W[1]<0?1:-1;for(let l=0;l<2;l++){const x=l===0?ae.range(.26,.32):ae.range(.68,.74),y=ae.range(0,30)*he,w=ae.range(260,340),T=w/ae.range(9,10.5),z=hs+1.05*T+ae.range(8,16),L={x:le[0]+E[0]*x*ze+W[0]*y,z:le[1]+E[1]*x*ze+W[1]*y,h:w,w:T,way:!0,who:"way"+l};fe.push(L),S.push([L.x-W[0]*he*z,L.z-W[1]*he*z]),he=-he}const ue=(l,x,y,w)=>[g(l,x,y,w,1/3),g(l,x,y,w,2/3),y];b.push(...ue(le,ce,S[0],E),...ue(S[0],E,S[1],E),...ue(S[1],E,ke,M.dir));const Fe=F(100);b.push(ge,M.after,g(M.after,M.dir,Fe,C,1/3),g(M.after,M.dir,Fe,C,2/3),Fe,F(56),F(28),M.ring);const H=Xo(b.map(l=>[l[0],0,l[1]])),P=H.length,p=[],Q=new c.Vector3;for(let l=0;l<=P;l+=2)H.posAtDist(l,Q),p.push(Q.x,Q.z);const $=(l,x)=>{let y=1e9,w=0;for(let T=0;T<p.length;T+=2){const z=Math.hypot(p[T]-l,p[T+1]-x);z<y&&(y=z,w=T)}return w},ne=$(le[0],le[1]),U=$(ge[0],ge[1]),re=[-C[1],C[0]],j=[q.x-C[0]*q.half+re[0]*q.half*1.2,q.z-C[1]*q.half+re[1]*q.half*1.2],A=[q.x-C[0]*q.half-re[0]*q.half*1.2,q.z-C[1]*q.half-re[1]*q.half*1.2],Ne=(l,x,y,w,T,z)=>{const L=T-y,B=z-w,X=qe(((l-y)*L+(x-w)*B)/Math.max(L*L+B*B,1e-9),0,1);return Math.hypot(l-y-L*X,x-w-B*X)},Ie=(l,x,y,w,T)=>{const z=(j[0]-l)*(w-x)-(j[1]-x)*(y-l),L=(A[0]-j[0])*(w-j[1])-(A[1]-j[1])*(y-j[0]),B=(l-A[0])*(w-A[1])-(x-A[1])*(y-A[0]);return z>=0&&L>=0&&B>=0||z<=0&&L<=0&&B<=0?!0:Math.min(Ne(y,w,l,x,j[0],j[1]),Ne(y,w,j[0],j[1],A[0],A[1]),Ne(y,w,A[0],A[1],l,x))<T},et=[[M.nb.x,M.nb.z,.5*M.nb.w]];for(let l=0;l<=12;l++)et.push([M.top.x+M.top.leanTo[0]*l/12,M.top.z+M.top.leanTo[1]*l/12,.5*M.top.w]);let Oe=U;for(let l=p.length-2;l>U;l-=2)if(et.some(x=>Ie(p[l],p[l+1],x[0],x[1],x[2]))){Oe=l+2;break}Oe=Math.min(Oe,p.length-2-ds-Js);const je=(l,x,y)=>{for(let w=2*Math.ceil(_e/2),T=2*Math.floor(st/2);w<=T;w=w<T&&w+8>T?T:w+8)if(Ie(p[w],p[w+1],l,x,y))return!0;for(let w=Oe;w<p.length;w+=8)if(Ie(p[w],p[w+1],l,x,y))return!0;return Ie(p[p.length-2],p[p.length-1],l,x,y)},Xe=(l,x)=>{let y=1e9;for(let w=U;w<p.length;w+=2){const T=Math.hypot(p[w]-l,p[w+1]-x);T<y&&(y=T)}return y},R=l=>Xe(l.x,l.z)-.5*l.w>=Mo*l.w&&!je(l.x,l.z,.5*l.w),He=Math.tan(15*ve),De=l=>1.25*Math.abs(l)/He,we=Kt;let Me=ne;for(let l=ne;l<ne+300&&l<p.length;l+=2)Math.hypot(p[l]-Ue[0],p[l+1]-Ue[1])<Ue[2]&&(Me=l);const tt=dt(M.nb.x-M.top.x,M.nb.z-M.top.z),Ge=.5*M.top.w/Math.max(Math.abs(M.dir[0]*tt[1]-M.dir[1]*tt[0]),.5),_e=Math.max($(S[1][0],S[1][1]),Me+De(Kt-8)),Ye=U-Ge,ot=U+Ge,st=Ye-De(Kt-M.passH),ut=(l,x,y)=>{const w=qe((y-l)/(x-l),0,1);return .5*(w+w*w*(3-2*w))};let Ae=Me;for(;Ae<_e&&5+(Kt-5)*ut(Me,_e,Ae)<25;)Ae+=2;let at=0;for(let l=0;l<=Ae&&l<p.length;l+=2)at=Math.max(at,Math.abs(p[l]));at+=60;const yt=l=>(6+9*Ve(-.1,.6,K.n2(l*.017,3.1)))*(1-Ve(Ae-50,Ae,l)),xt=(l,x)=>{let y=Math.max((K.fbm2(l*.0052+7.1,x*.0052-3.3,3)-.37)*200,(K.fbm2(l*.021+1.3,x*.021+5.9,2)-.45)*46);const w=Le-Math.max(Math.abs(l-Re[0]),Math.abs(x-Re[1]));w<480&&(y-=260*(1-Ve(60,360,w+120*K.n2(l*.004+31.7,x*.004-12.9)))),w-60<y&&(y=w-60);const T=K.fbm2(l*.023+3.7,x*.023+9.1,2)*9;for(const z of[Pt,M.ringPool]){const L=l-z[0],B=x-z[1],X=(L*z[2]+B*z[3])/z[4],Z=(-L*z[3]+B*z[2])/z[5],ye=1-(y-T)/z[5]+1e-6;if(ye<0||X*X+Z*Z>ye*ye*(1+1e-9))continue;const N=(1-Math.hypot(X,Z))*z[5]+T;N>y&&(y=N)}if(x<40&&x>-(Ae+60)&&Math.abs(l)<at){const z=Math.max(0,ne-20);let L=1e300;for(let N=z;N<=Ae&&N<p.length;N+=2){const Ee=p[N]-l,de=p[N+1]-x,_=Ee*Ee+de*de;_<L&&(L=_)}const B=L*(1+1e-9);let X=1e9,Z=0;for(let N=z;N<=Ae&&N<p.length;N+=2){const Ee=p[N]-l,de=p[N+1]-x;if(Ee*Ee+de*de<=B){const _=Math.hypot(Ee,de);_<X&&(X=_,Z=N)}}const ye=yt(Z)-X+T*.3;ye>y&&(y=ye)}for(const z of rt){const L=l-z[0],B=x-z[1],X=y+(z[2]*.8+5);if(X>=0&&L*L+B*B>X*X*(1+1e-9))continue;const Z=Math.hypot(L,B)-(z[2]*.8+5);Z<y&&(y=Z)}return y},nt=(l,x)=>{let y=1e9;for(let w=0;w<p.length;w+=2){const T=Math.hypot(p[w]-l,p[w+1]-x);T<y&&(y=T)}return y},Ce=M.giants.filter(l=>l.hero||l===M.top||l===M.nb||nt(l.x,l.z)>=hs+1.05*l.w&&fe.every(x=>Math.hypot(l.x-x.x,l.z-x.z)>=It)&&R(l));Ce.push(...fe);const rt=Ce.map(l=>[l.x,l.z,l.w]),it=[];for(const l of[fe[0],fe[1],M.giants[0]]){const x=l.h*ie.range(.12,.16),y=x/ie.range(6,9.5),w=ie.range(0,O),T=ie(),z=ie.chance(.5)?1:-1,L=[ie.range(60,110)*ve*z,-ie.range(60,110)*ve*z],B=.8*l.w+2*y+ie.range(3,9);let X=1e9,Z=0;for(let _=0;_<p.length;_+=2){const xe=Math.hypot(p[_]-l.x,p[_+1]-l.z);xe<X&&(X=xe,Z=_)}const ye=dt(p[Z]-l.x,p[Z+1]-l.z),N=L.map(_=>{const xe=So(ye,_);return[l.x+xe[0]*B,l.z+xe[1]*B]}),Ee=_=>Math.min(nt(_[0],_[1])-ls-2*y,...Ce.filter(xe=>xe!==l).map(xe=>Math.hypot(_[0]-xe.x,_[1]-xe.z)-xe.w*1.5-14-2*y)),de=N.find(_=>Ee(_)>=0)||N.reduce((_,xe)=>Ee(xe)>Ee(_)?xe:_);it.push({x:de[0],z:de[1],h:x,w:y,yaw:w,v:T})}for(const l of it)rt.push([l.x,l.z,l.w]);rt.push([q.x,q.z,(q.half*1.42+35)/.8]);const Ke=(l,x)=>5+3*Ve(10,50,-xt(l,x)),Ot=(l,x,y)=>{const w=Ke(x,y);let T=Y(w,we,ut(Me,_e,l));return T=Y(T,M.passH,ut(st,Ye,l)),Y(T,cs,ut(ot,P-100,l))},Ct=Math.round(P/40),bt=[];for(let l=0;l<=Ct;l++){const x=P*l/Ct;H.posAtDist(x,Q),bt.push([Q.x,Ot(x,Q.x,Q.z),Q.z])}const St=Xo(bt),Mt=[];for(let l=0;l<40;l++){const x=k.range(0,O),y=1500+1100*Math.sqrt(k()),w=k.range(350,400),T={x:Re[0]+Math.cos(x)*y,z:Re[1]+Math.sin(x)*y,h:w,w:w/k.range(9,11),yaw:k.range(0,O),v:k()};Math.hypot(T.x-q.x,T.z-q.z)>=q.half*1.42+250&&!je(T.x,T.z,.5*T.w)&&Mt.push(T)}return{F:M,giants:Ce,alones:it,farG:Mt,pyr:q,path:St,flat:H,RT:p,sS1:ne,sR0:Me,sTop:_e,sD0:st,sL0:Ye,sL1:ot,sCE:Ae,sP:U,sLook:Oe,topH:we,poolSD:xt,noise:K,ring:[M.ring[0],cs,M.ring[1]],endDir:C,duration:Math.round(St.length/Xs*10)/10}}var aa={id:"three-shadows-each",name:"Three Shadows Each",category:"screen",placeKind:"alien",screen:"3 Body Problem",screenYear:"2024",screenKind:"series",media:["air"],weirdness:.75,async build(u){const G=u.vary||{},ie=u.quality&&u.quality.detail||1,ae=String(u.seed),k=e=>Yo(uo(e+":"+ae)),K=k("tse-law"),M=k("tse-shape"),ge=k("tse-hero"),C=k("tse-look"),Pe=k("tse-under"),q=$o(K,K.range(0,600)),le=G.mood??.5,ke=qe(G.density??1,.7,1.3),F=new c.Scene,g=ta(ae),b=g.path,ce=g.poolSD,E=g.giants,W=g.ring,ze=g.endDir,fe=g.F.pass,S=g.pyr;await u.yield();const he=g.sD0/g.flat.length,ue=g.sL0/g.flat.length,Fe=Math.atan2(ze[0],-ze[1]),H=[[0,1,.25],[0,1.5,.45],[0,2.4,1]];H[2][0]=Math.atan(S.h/S.away)/ve+H[2][1]+.4,H[1][0]=H[2][0]+H[2][1]+H[1][1]+.5,H[0][0]=H[1][0]+H[1][1]+H[0][1]+.5;const P=(H[0][0]+H[1][0]+H[2][0])/3*ve,p=e=>Ve(he,ue,e),Q=e=>qe((e-ue)/(1-ue),0,1),$=(e,t,o)=>{const r=e-S.x,s=t-S.z;return Math.max(Math.abs(r*S.dir[0]+s*S.dir[1]),Math.abs(-r*S.dir[1]+s*S.dir[0]))<S.half+o},ne=(()=>{const e=new c.Vector3,t=b.length,o=[],r=S.x-S.dir[0]*S.half,s=S.z-S.dir[1]*S.half,h=-S.dir[1]*S.half*1.2,i=S.dir[0]*S.half*1.2;for(let f=ue*t;f<t+8;f+=8)b.posAtDist(Math.min(f,t),e),o.push(e.x,e.z);const a=[1e9,-1e9,1e9,-1e9],n=[r+h,s+i,r-h,s-i];for(let f=0;f<o.length+4;f+=2){const d=f<o.length?o[f]:n[f-o.length],m=f<o.length?o[f+1]:n[f-o.length+1];a[0]=Math.min(a[0],d),a[1]=Math.max(a[1],d),a[2]=Math.min(a[2],m),a[3]=Math.max(a[3],m)}return{tips:o,c:n,box:a}})(),U=(e,t,o,r,s,h)=>{const i=s-o,a=h-r,n=qe(((e-o)*i+(t-r)*a)/Math.max(i*i+a*a,1e-9),0,1);return Math.hypot(e-o-i*n,t-r-a*n)},re=(e,t,o)=>{const{tips:r,c:s,box:h}=ne;if(o+=.5,e<h[0]-o||e>h[1]+o||t<h[2]-o||t>h[3]+o)return!1;for(let i=0;i<r.length;i+=2){const a=r[i],n=r[i+1],f=(s[0]-a)*(t-n)-(s[1]-n)*(e-a),d=(s[2]-s[0])*(t-s[1])-(s[3]-s[1])*(e-s[0]),m=(a-s[2])*(t-s[3])-(n-s[3])*(e-s[2]);if(f>=0&&d>=0&&m>=0||f<=0&&d<=0&&m<=0||U(e,t,a,n,s[0],s[1])<o||U(e,t,a,n,s[2],s[3])<o)return!0}return U(e,t,s[0],s[1],s[2],s[3])<o},j=(e,t,o)=>{q(e,o);const r=p(t);if(r>0)for(let s=0;s<3;s++){const h=o.sun[s],i=((Fe-h.az)%O+O+Math.PI)%O-Math.PI,a=h.az+i*r,n=Y(h.el,H[s][0]*ve,r),f=Math.cos(n);h.az=a,h.el=n,h.radDeg=Y(h.radDeg,H[s][1],r),h.rad=h.radDeg*ve,h.near=Y(h.near,H[s][2],r),h.dir[0]=Math.sin(a)*f,h.dir[1]=Math.sin(n),h.dir[2]=-Math.cos(a)*f,h.up=Ve(-1.5*ve,4.5*ve,n),h.flux=jt[s].S*Math.pow(h.radDeg,1.6)*h.up}return o},A=[];{const e=new c.Vector3;for(let t=0;t<=b.length;t+=2)b.posAtDist(t,e),A.push(e.x,e.y,e.z)}const Ne=A.length/3;await u.yield();const Ie=(e,t,o,r,s)=>{const h=Math.hypot(A[e]-t,A[e+2]-o)-s,i=A[e+1]-r;return i>0?Math.hypot(Math.max(h,0),i):h},et=(e,t,o,r)=>{let s=1e300,h=0;for(let f=0;f<Ne*3;f+=3){const d=A[f]-e,m=A[f+2]-t,v=d*d+m*m;v<s&&(s=v,h=f)}let i=Ie(h,e,t,o,r);const a=i+r,n=a*a*(1+1e-9);for(let f=0;f<Ne*3;f+=3){const d=A[f]-e,m=A[f+2]-t;if(d*d+m*m<=n){const v=Ie(f,e,t,o,r);v<i&&(i=v)}}return i};let Oe=1e9;for(let e=0;e<Ne;e+=2)Oe=Math.min(Oe,A[e*3+1]);const je=(e,t)=>{let o=1e300,r=0;for(let a=0;a<Ne*3;a+=6){const n=A[a]-e,f=A[a+2]-t,d=n*n+f*f;d<o&&(o=d,r=a)}let s=Math.hypot(A[r]-e,A[r+2]-t)+A[r+1];const h=s-Oe,i=h*h*(1+1e-9);for(let a=0;a<Ne*3;a+=6){const n=A[a]-e,f=A[a+2]-t;if(n*n+f*f<=i){const d=Math.hypot(n,f)+A[a+1];d<s&&(s=d)}}return s},Xe=[],R=(e,t)=>{const o=k("tse-grove-"+e),r=t(o);r&&(r.rng=o,Xe.push(r))};E.forEach(e=>R("giant-"+e.who,()=>({x:e.x,z:e.z,r:60+e.w,n:9,big:.9}))),R("first",()=>({x:Ue[0],z:Ue[1],r:Ue[2],n:Ue[3],big:.8,tall:!0}));{const e=g.F.ringPool,t=3+(k("tse-ring").chance(.5)?1:0);for(let o=0;o<t;o++)R("ring"+o,r=>{const s=r.range(0,O),h=r.range(20,60),i=r.range(40,58),a=Math.round(r.range(34,52)),n=Math.cos(s),f=Math.sin(s),d=1/Math.hypot(n/e[4],f/e[5])+h,m=e[0]+(n*e[2]-f*e[3])*d,v=e[1]+(n*e[3]+f*e[2])*d;return E.every(I=>Math.hypot(m-I.x,v-I.z)>=I.w*1.5+12)?{x:m,z:v,r:i,n:a,big:.8,tall:!0}:null})}{const e=new c.Vector3;let t=g.sS1;for(let s=g.sS1;s<g.sS1+300;s+=2)b.posAtDist(s,e),Math.hypot(e.x-Ue[0],e.z-Ue[1])<Ue[2]&&(t=s);let o=Pe.chance(.5)?1:-1,r=0;for(let s=t+Pe.range(0,40);s<b.length-90-g.F.ringPool[4];s+=40,r++){const h=o;o=-o,R("way"+r,i=>{const a=s+i.range(-16,16),n=b.posAtDist(a,new c.Vector3),f=b.tangentAtDist(a,new c.Vector3),d=i.range(16,50)*h,m=Math.hypot(f.x,f.z)||1;return{x:n.x-f.z/m*d,z:n.z+f.x/m*d,r:i.range(30,48),n:Math.round(i.range(22,38)),big:i.range(.6,1),tall:!0}})}}const He=Re,De=Math.round(100*ke),we=(e,t)=>g.noise.n2(e*.0026+41.9,t*.0026+23.3)>.05;for(let e=0;e<De;e++)R("plain"+e,t=>{const o=t.range(0,O),r=1500*Math.pow(t(),.78),s=t.range(28,70),h=Math.round(t.range(12,40)),i=t.range(.25,1);return{x:He[0]+Math.cos(o)*r,z:He[1]+Math.sin(o)*r,r:s,n:h,big:i,plain:!0}});const Me=new Uint8Array(ee*ee*4),tt=new Float32Array(ee*ee);await u.yield();for(let e=0;e<ee;e++){const t=Re[1]+((e+.5)/ee*2-1)*Le;for(let o=0;o<ee;o++){const r=Re[0]+((o+.5)/ee*2-1)*Le,s=e*ee+o;tt[s]=qe(.5+ce(r,t)/60,0,1),Me[s*4+3]=255}e%4===3&&await u.yield()}{const e=ee,t=2*Le/e,o=t,r=t*Math.SQRT2,s=new Uint8Array(e*e);for(let n=1;n<e-1;n++){for(let f=1;f<e-1;f++){const d=n*e+f;let m=!0;for(let v=-e;v<=e&&m;v+=e)for(let I=-1;I<=1;I++)if(!(tt[d+v+I]>.5)){m=!1;break}if(m)for(let v=-e;v<=e;v+=e)for(let I=-1;I<=1;I++)s[d+v+I]=1}n%32===31&&await u.yield()}const h=async n=>{for(let f=0;f<e;f++){for(let d=0;d<e;d++){const m=f*e+d;let v=n[m];d>0&&(v=Math.min(v,n[m-1]+o)),f>0&&(v=Math.min(v,n[m-e]+o),d>0&&(v=Math.min(v,n[m-e-1]+r)),d<e-1&&(v=Math.min(v,n[m-e+1]+r))),n[m]=v}f%32===31&&await u.yield()}for(let f=e-1;f>=0;f--){for(let d=e-1;d>=0;d--){const m=f*e+d;let v=n[m];d<e-1&&(v=Math.min(v,n[m+1]+o)),f<e-1&&(v=Math.min(v,n[m+e]+o),d<e-1&&(v=Math.min(v,n[m+e+1]+r)),d>0&&(v=Math.min(v,n[m+e-1]+r))),n[m]=v}f%32===0&&await u.yield()}},i=new Float32Array(e*e),a=new Float32Array(e*e);for(let n=0;n<e*e;n++)i[n]=s[n]?0:1e9,a[n]=s[n]?1e9:0;await u.yield(),await h(i),await h(a);for(let n=0;n<e*e;n++)(n&32767)===32767&&await u.yield(),Me[n*4]=Math.round(qe(s[n]?Math.max(tt[n],Math.min(.5+(a[n]-.5*t)/60,.7)):Math.min(tt[n],.5-(i[n]-.5*t)/60),0,1)*255)}const Ge=new c.DataTexture(Me,ee,ee,c.RGBAFormat);Ge.minFilter=Ge.magFilter=c.LinearFilter,Ge.wrapS=Ge.wrapT=c.ClampToEdgeWrapping,Ge.needsUpdate=!0,await u.yield();const _e=(e,t,o=!1,r=0,s=null)=>{const h=new c.MeshLambertMaterial({vertexColors:!0});return h.onBeforeCompile=i=>{i.uniforms.uSunDir=D.uSunDir,i.uniforms.uSunE=D.uSunE,i.uniforms.uBedAxis={value:e},i.uniforms.uBedFoot={value:t},o&&(i.uniforms.uRise=D.uRise,i.uniforms.uTime=D.uTime,i.uniforms.uClear={value:r}),(o||s)&&(i.uniforms.uSalt=D.uSalt,i.uniforms.uSkyFill=D.uSkyFill),s&&(i.uniforms.uPyrInv={value:s},i.uniforms.uRowLit=D.uRowLit),i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vTseP;`+(s?`
attribute float aPyr; varying float vTsePyrK;`:"")+(o?qs:"")).replace("#include <begin_vertex>",`#include <begin_vertex>
#ifdef USE_INSTANCING
 vTseP = (instanceMatrix * vec4(position, 1.)).xyz;
#else
 vTseP = position;
#endif`+(s?`
 vTsePyrK = aPyr;`:"")+(o?_s:"")),o&&(i.vertexShader=i.vertexShader.replace("#include <beginnormal_vertex>","#include <beginnormal_vertex>"+Gs)),i.fragmentShader=i.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vTseP;
uniform vec3 uSunDir[3]; uniform vec3 uSunE[3]; uniform vec3 uBedAxis; uniform vec3 uBedFoot;
`+(o?`varying float vTseOpen;
`:"")+(o||s?`uniform vec3 uSalt; uniform vec3 uSkyFill;
`:"")+(s?`varying float vTsePyrK; uniform mat4 uPyrInv; uniform vec2 uRowLit;
`:"")+xo).replace("#include <color_fragment>",s?"#include <color_fragment>"+Ns:Us).replace("#include <lights_fragment_end>",`#include <lights_fragment_end>
          // rough stone takes a low sun's light a little way round its flank: each sun rims the needles in its own hue
          { vec3 tseN = inverseTransformDirection(normal, viewMatrix);
            for (int i = 0; i < 3; i++){ float nl = dot(tseN, uSunDir[i]); reflectedLight.directDiffuse += diffuseColor.rgb * uSunE[i] * (max((nl + .42) / 1.42, 0.) - max(nl, 0.)); }`+(o||s?`
            // A LOOSE STONE THAT HAS LEFT ITS BED IS LIT FROM BELOW BY THE PLAIN AND FROM ABOVE BY THE AIR: its faces
            // take the salt's light by how far they are turned down and the air's blue by how far they are turned up
            // (the pyramid's own stone takes both at all times: it stands over the open salt)
            reflectedLight.indirectDiffuse += diffuseColor.rgb * (uSalt * (.5 - .5 * tseN.y) + uSkyFill * (.5 + .5 * tseN.y)) * ${s?"1.":"vTseOpen"};`:"")+(s?`
            // WHEN THE ROW STANDS, ITS LIGHT RUNS DOWN THE STAIR: the share of the row's light a place of the pyramid
            // takes (tseQ, by the dress: the stair, its walls and the house whole, a tier's lit edge more, above
            // the light's front only) times the three suns' light together and ROW_LIGHT. Lit stone and no more.
            reflectedLight.directDiffuse += diffuseColor.rgb * (uSunE[0] + uSunE[1] + uSunE[2]) * (${Jo.toFixed(2)} * tseQ);`:"")+" }"),s||(i.fragmentShader=i.fragmentShader.replace("#include <normal_fragment_maps>",js))},h.customProgramCacheKey=()=>"tse-stone-18"+(o?"-loose":"")+(s?"-pyr":""),h},Ye=_e(new c.Vector3(0,1,0),new c.Vector3),ot=_e(new c.Vector3(0,1,0),new c.Vector3,!0);ot.side=c.DoubleSide;const st=(e,t)=>{const o=e.attributes.position.count,r=new Float32Array(o*4);if(t)for(const s of Ko(e)){const h=t();for(let i=s.v0;i<s.v0+13;i++)r.set([s.cx,s.cy,s.cz,h],i*4)}else{e.computeBoundingBox();const s=e.boundingBox.getCenter(new c.Vector3);for(let h=0;h<o;h++)r.set([s.x,s.y,s.z,0],h*4)}return e.setAttribute("aStone",new c.BufferAttribute(r,4)),e},ut=.5,Ae=e=>()=>{const t=e();return[.9*t*t,(80+260*e())*(1-.5*t),e.range(.012,.05)*(e.chance(.5)?1:-1),e.range(0,O)]},at=e=>14+12*e,yt=new Int32Array(Ne+1),xt=(e,t,o)=>{let r=1e300,s=0;for(let a=o*3;a<Ne*3;a+=3){const n=A[a]-e,f=A[a+2]-t,d=n*n+f*f;d<r?(d*(1+1e-9)<r&&(s=0),r=d,yt[s++]=a):d<=r*(1+1e-9)&&(yt[s++]=a)}const h=r*(1+1e-9);let i=1e9;for(let a=0;a<s;a++){const n=yt[a],f=A[n]-e,d=A[n+2]-t;if(f*f+d*d<=h){const m=Math.hypot(f,d);m<i&&(i=m)}}return i},nt=(e,t)=>xt(e,t,0),Ce=[.6,.53,.54],rt=(e,t)=>Ve(.1,.35,g.noise.n2(e*.0021+11.3,t*.0021-4.7)),it=(e,t,o)=>{const r=e.attributes.color,s=rt(t,o),h=Ce.map(i=>Y(1,i,s));for(let i=0;i<r.count;i++)r.setXYZ(i,r.getX(i)*h[0],r.getY(i)*h[1],r.getZ(i)*h[2])},Ke=await Ts(u,{rng:ge,material:Ye,height:E[0].h,width:E[0].w,fused:0});Ke.object.position.set(E[0].x,0,E[0].z),F.add(Ke.object),Ke.object.traverse(e=>{e.isMesh&&it(e.geometry,E[0].x,E[0].z)}),await u.yield();const Ot=[],Ct=40,bt=(e,t,o,r)=>{it(e,t,o);const s=e.attributes.position.count,h=new Float32Array(s*4),i=new Float32Array(s*4);for(const a of Ko(e)){const n=r(),f=nt(a.cx,a.cz)<at(a.rad)||re(a.cx,a.cz,a.rad+.05*n[1])?[1,0,0,0]:n;for(let d=a.v0;d<a.v0+13;d++)h.set([a.cx,a.cy,a.cz,0],d*4),i.set(f,d*4)}e.setAttribute("aStone",new c.BufferAttribute(h,4)),e.setAttribute("aRise",new c.BufferAttribute(i,4)),Ot.push(e)};Ke.rubble.translate(E[0].x,0,E[0].z),bt(Ke.rubble,E[0].x,E[0].z,Ae(k("tse-rise-"+E[0].who)));const St=[],Mt=[],l=[];let x=Ye;for(let e=1;e<E.length;e++){const t=E[e],o=ks(k("tse-giant-"+t.who),{x:t.x,z:t.z,h:t.h,w:t.w,broken:!!t.blunt,leanTo:t.leanTo||null,bow:t.bow||null});for(const r of o.parts)it(r,t.x,t.z);t.leanTo?(l.push(...o.parts),x=_e(new c.Vector3(t.leanTo[0],t.h,t.leanTo[1]).normalize(),new c.Vector3(t.x,0,t.z))):St.push(...o.parts),t.leanTo&&zs(o.rubble,r=>nt(r.cx,r.cz)-r.rad>=Ct),bt(o.rubble,t.x,t.z,Ae(k("tse-rise-"+t.who))),Mt.push(...o.casters),await u.yield()}{const e=new c.Mesh(po(Ot,[["aStone",4],["aRise",4]]),ot);e.name="tse-rubble",e.frustumCulled=!1,F.add(e)}const y=po(St),w=new c.Mesh(y,Ye);w.name="tse-giants",w.frustumCulled=!1,F.add(w);{const e=new c.Mesh(po(l),x);e.name="tse-giants",e.frustumCulled=!1,F.add(e)}await u.yield();const T=e=>[e(),e(),e(),e(),e(),e(),e()],z=[],L=(e,t)=>{let o=1e9;for(const r of g.alones)o=Math.min(o,Math.hypot(e-r.x,t-r.z));return o};for(const e of Xe){await u.yield();const t=e.rng;for(let o=0;o<e.n*3;o++){const r=t.range(0,O),s=e.r*Math.sqrt(-Math.log(1-t()*.985))*.62,h=Math.exp(-s/e.r),i=t(),a=t(),n=e.tall?(15+30*Math.pow(i,1.4))*(.9+.2*a):i<.14?5+5*a:i<.8-.3*e.big*h?10+15*a:25+20*a;z.push({x:e.x+Math.cos(r)*s,z:e.z+Math.sin(r)*s,h:n,w:qe(n/t.range(6,9.5),1,5),yaw:t.range(0,O),v:t(),g:e,d6:T(t)})}}z.sort((e,t)=>e.d6[6]-t.d6[6]),z.unshift(...g.alones.map(e=>({x:e.x,z:e.z,h:e.h,w:e.w,yaw:e.yaw,v:e.v,g:null,alone:!0,d6:[1,0,0,1,0,0,0]}))),await u.yield();const B=[],X=[],Z=[],ye=[];for(let e=0;e<8;e++)B.push(mo(M,{rings:14,sides:9,lumps:12}));await u.yield();for(let e=0;e<4;e++)X.push(mo(M,{rings:8,sides:7,lumps:8}));for(let e=0;e<4;e++)Z.push(mo(M,{rings:4,sides:6,lumps:4}));for(let e=0;e<4;e++)ye.push(Rs(M,{count:5}));{const e=k("tse-heap-stones");for(const t of ye)st(t,e)}await u.yield();const N=[],Ee=new Map,de=16,_=Math.round((2450+250*ke)*(.55+.45*ie)),xe=60,us=(e,t)=>Math.floor(e/de)*4096+Math.floor(t/de),ms=(e,t,o,r)=>{const s=Math.floor(e/de),h=Math.floor(t/de);for(let i=-1;i<=1;i++)for(let a=-1;a<=1;a++){const n=Ee.get((s+i)*4096+h+a);if(n){for(const f of n)if(Math.hypot(f.x-e,f.z-t)<Math.max(r,1.5*(f.w+o)))return!0}}return!1},Bt=e=>{const t=us(e.x,e.z);let o=Ee.get(t);o||Ee.set(t,o=[]),o.push(e),N.push(e)};for(const e of Ke.needles)Bt({x:E[0].x+e.x,z:E[0].z+e.z,w:e.w,h:e.h,tx:e.tipX,tz:e.tipZ,pw:e.pw,tipR:e.tipR,hero:!0});for(const e of Mt)Bt({x:e.x,z:e.z,w:e.w,h:e.h,tx:e.tipX,tz:e.tipZ,pw:e.pw,tipR:e.tipR,hero:!0});Bt({x:S.x,z:S.z,w:2*S.half,h:S.h,tx:0,tz:0,pw:1,tipR:-ct.top/ct.half,hero:!0,pyr:!0});let Eo=0;const qt=new c.Vector3,Gt=new c.Vector3(0,1,0),$t=new c.Vector3,Qt=(e,t,o,r,s,h,i,a)=>{const n=e.d6,f=!e.alone&&n[0]<.22?.05+.16*(n[0]/.22):0,d=n[1]*O,m=je(t,o),v=m<100?0:m<250?1:2,I=v===0,me=I?8:4,pe=Math.floor(i*me)%me,J=[B,X,Z][v][pe],te=r*Math.max(J.userData.reach,1.5)+s*Math.sin(f);if(e.g&&e.g.plain&&!we(t,o))return!1;let Te=e.alone||L(t,o)>Ys;for(const We of E)Math.hypot(t-We.x,o-We.z)<(e.alone?We.w*.8+te:We.w*1.5+te+12)&&(Te=!1);return!Te||!e.alone&&Math.hypot(t-fe[0],o-fe[1])<xe+te||o>-4&&o<75+te&&Math.abs(t)<17+te||$(t,o,60+te)||ce(t,o)>-(1.5+.8*r)||a&&ms(t,o,r,v<2?9:5)||v<2&&et(t,o,s*1.03,te)<ls?!1:(qt.set(J.userData.tipX*r,s,J.userData.tipZ*r).applyAxisAngle(Gt,h).applyAxisAngle($t.set(Math.cos(d),0,Math.sin(d)),f),Bt({x:t,z:o,w:r,h:s,hs:qt.y,yaw:h,tilt:f,ta:d,tx:qt.x,tz:qt.z,pw:J.userData.pw,tipR:J.userData.tipR,alone:!!e.alone,near:I,tier:v,vi:pe,hv:Math.floor(i*977)%4,tint:i*131.7%1,die:i}),!0)};for(const e of z){if(N.length>=_)break;++Eo%100===0&&await u.yield();const t=e.d6;if(!e.alone&&t[2]>.97?(e.h=46+34*((t[2]-.97)/.03),e.w=e.h/7.5):!e.alone&&t[2]>.9&&(e.h=28+24*((t[2]-.9)/.07),e.w=e.h/13),!!Qt(e,e.x,e.z,e.w,e.h,e.yaw,e.v,!0)){if(e.g&&t[3]<.16)for(let o=0,r=t[3]<.05?2:1;o<r;o++){const s=t[4]*O+o*2.3,h=e.w*(.55+.3*t[5]),i=e.h*(.45+.4*((t[5]*7.3+o*.37)%1)),a=(e.w+h)*.42;Qt(e,e.x+Math.cos(s)*a,e.z+Math.sin(s)*a,h,i,(t[4]*11+o)%O,(e.v*3.7+.31*(o+1))%1,!1)}if(e.g&&t[3]>=.16&&t[3]<.24){const o=t[4]*O,r=e.w*(.85+.15*t[5]),s=(e.w+r)*.36;Qt(e,e.x+Math.cos(o)*s,e.z+Math.sin(o)*s,r,e.h*(.8+.17*t[5]),t[4]*11%O,(e.v*3.7+.31)%1,!1)}}}await u.yield();{const e=new Float32Array(ee*ee),t=2*Le/ee,o=9;for(let r=0;r<N.length;r++){r%200===199&&await u.yield();const s=N[r],h=Math.floor((s.x-Re[0]+Le)/t),i=Math.floor((s.z-Re[1]+Le)/t);for(let a=-o;a<=o;a++)for(let n=-o;n<=o;n++){const f=h+n,d=i+a;f<0||d<0||f>=ee||d>=ee||(e[d*ee+f]+=.2*Math.exp(-(n*n+a*a)/22))}}for(let r=0;r<e.length;r++)(r&32767)===32767&&await u.yield(),Me[r*4+1]=Math.round(Math.min(1,e[r])*255);Ge.needsUpdate=!0}await u.yield();const be=new c.Object3D,ps=Math.max(0,Math.floor((ue*b.length-30)/2)),vs=(e,t)=>xt(e,t,ps),At=(e,t,o,r)=>{if(!t.length)return null;const s=new c.InstancedMesh(e,o?ot:Ye,t.length);if(s.name=r,o){const a=new Float32Array(t.length*4);t.forEach((n,f)=>{const d=k("tse-heap-"+n.die),m=Ae(d)(),v=d()>=ut;a.set(v||vs(n.x,n.z)<at(.5*n.w)||re(n.x,n.z,1.7*n.w+.05*m[1])?[1,0,0,0]:m,f*4)}),e.setAttribute("aRise",new c.InstancedBufferAttribute(a,4))}const h=new c.Quaternion;t.forEach((a,n)=>{be.position.set(a.x,0,a.z),o?be.quaternion.setFromAxisAngle(Gt,a.yaw*1.7):be.quaternion.setFromAxisAngle($t.set(Math.cos(a.ta||0),0,Math.sin(a.ta||0)),a.tilt||0).multiply(h.setFromAxisAngle(Gt,a.yaw)),be.scale.set(a.w,o?a.w:a.h,a.w),be.updateMatrix(),s.setMatrixAt(n,be.matrix)});const i=new c.Color;return t.forEach((a,n)=>{const f=a.tint??.5,d=.93+.14*(f*7.3%1),m=rt(a.x,a.z);i.setRGB(d*(.96+.08*f)*Y(1,Ce[0],m),d*(.98+.03*f)*Y(1,Ce[1],m),d*(1.05-.1*f)*Y(1,Ce[2],m)),s.setColorAt(n,i)}),s.instanceMatrix.needsUpdate=!0,s.instanceColor&&(s.instanceColor.needsUpdate=!0),s.frustumCulled=!1,F.add(s),s};for(let e=0;e<8;e++)At(B[e],N.filter(t=>!t.hero&&t.near&&t.vi===e),!1,"tse-needle-near");await u.yield();for(let e=0;e<4;e++)At(X[e],N.filter(t=>!t.hero&&t.tier===1&&t.vi===e),!1,"tse-needle-mid");for(let e=0;e<4;e++)At(Z[e],N.filter(t=>!t.hero&&t.tier===2&&t.vi===e),!1,"tse-needle-far");await u.yield();for(let e=0;e<4;e++)At(ye[e],N.filter(t=>!t.hero&&t.near&&t.hv===e),!0,"tse-heap");for(let e=0;e<4;e++)At(Z[e],g.farG.filter(t=>Math.floor(t.v*4)%4===e).map(t=>({x:t.x,z:t.z,w:t.w,h:t.h,yaw:t.yaw,tint:t.v})),!1,"tse-far-giant");await u.yield();const Qe=Fs(k("tse-pyramid")),To=Math.atan2(-S.dir[0],-S.dir[1]),Zt=new c.Matrix4().makeRotationY(To).setPosition(S.x,0,S.z);Qe.solid.applyMatrix4(Zt);const Ro=Zt.clone().invert();{const e=new c.Mesh(Qe.solid,_e(new c.Vector3(0,1,0),new c.Vector3,!1,0,Ro));e.name="tse-pyramid",e.frustumCulled=!1,F.add(e)}{const e=new c.Color,t=k("tse-pyramid-blocks");Qe.blockGeo.computeBoundingBox();const o=Qe.blockGeo.boundingBox.getSize(new c.Vector3),r=_e(new c.Vector3(0,1,0),new c.Vector3,!0,.5*Math.max(o.x,o.z),Ro);r.side=c.DoubleSide;const s=(h,i)=>{const a=new c.InstancedMesh(h,r,i.length),n=new Float32Array(i.length*4);a.name="tse-pyramid-block",i.forEach((f,d)=>{be.position.set(f[0],f[1],f[2]).applyMatrix4(Zt),be.quaternion.setFromAxisAngle(Gt,To),be.scale.set(1,1,1),be.updateMatrix(),a.setMatrixAt(d,be.matrix);const m=t.range(.93,1.05);e.setRGB(m,m*t.range(.98,1.01),m*t.range(.96,1.02)),a.setColorAt(d,e),n.set([1,0,0,0],d*4)}),st(h,null).setAttribute("aRise",new c.InstancedBufferAttribute(n,4)),a.instanceMatrix.needsUpdate=!0,a.instanceColor.needsUpdate=!0,a.frustumCulled=!1,F.add(a)};s(Qe.blockGeo,Qe.blocks),s(Qe.doorGeo,[Qe.door])}await u.yield();const Jt=new c.Vector3,Et=new c.Vector3,Tt=[0,0],ko=(e,t,o)=>{if(e<=b.length){b.posAtDist(e,Jt),b.tangentAtDist(e,Et);const r=Math.hypot(Et.x,Et.z)||1;Tt[0]=Jt.x-Et.z/r*o*t,Tt[1]=Jt.z+Et.x/r*o*t}else Tt[0]=W[0]+ze[0]*(e-b.length)-ze[1]*o*t,Tt[1]=W[2]+ze[1]*(e-b.length)+ze[0]*o*t;return Tt},gs=200,Rt=async(e,t,o,r,s,h=14,i=null)=>{const a=[],n=[];for(let d=0;d<t*gs&&a.length<t*3;d++){d%120===119&&await u.yield();const m=e.range(o,r),v=e.chance(.5)?1:-1,I=e(),me=(i?Math.max(h,i(m,v)):h)+426*(.3*I+.7*I*I*I),pe=ko(m,v,me),J=pe[0],te=pe[1];if(s(J,te)){const Te=nt(J,te);Te>=h&&(a.push(J,te,Te),n.push(d))}}const f=new Float32Array(a);return f.tries=n,f},kt=ue*b.length-100,eo=b.length+S.away+S.half,mt=Math.ceil((eo-kt)/8),zo=[new Float32Array(mt+1),new Float32Array(mt+1)];for(let e=0;e<=mt;e++){e%8===7&&await u.yield();const t=kt+(eo-kt)*e/mt;for(let o=0;o<2;o++){let r=14;for(;r<1500;r+=6){const s=ko(t,o?1:-1,r);if(!$(s[0],s[1],40)&&!re(s[0],s[1],30))break}zo[o][e]=r}}const zt=(e,t)=>{const o=qe((e-kt)/(eo-kt),0,1)*mt,r=Math.min(mt-1,Math.floor(o)),s=zo[t>0?1:0];return Math.max(s[r],s[r+1])},to=(e,t)=>ce(e,t)<-1.5&&E.every(o=>Math.hypot(e-o.x,t-o.z)>o.w+4)&&!$(e,t,40),Fo=(e,t)=>we(e,t)&&to(e,t)&&!re(e,t,27);{const e=k("tse-loose-shapes"),t=new c.Color,o=await Rt(k("tse-loose-way"),1100,ue*b.length-100,b.length,Fo,14,zt),r=await Rt(k("tse-loose-beyond"),1200,b.length,b.length+S.away+S.half,Fo,14,zt),s=[];for(const[i,a]of[[o,"tse-loose-way-"],[r,"tse-loose-beyond-"]])for(let n=0;n<i.length;n+=3)s.push({x:i[n],z:i[n+1],gap:i[n+2],n:i.tries[n/3],own:a+i.tries[n/3]});const h=(i,a,n)=>{let f=n;for(let d=Math.floor((i-n)/de),m=Math.floor((i+n)/de);d<=m;d++)for(let v=Math.floor((a-n)/de),I=Math.floor((a+n)/de);v<=I;v++){const me=Ee.get(d*4096+v);if(me)for(const pe of me){if(pe.hero)continue;const J=pe.x-i,te=pe.z-a;if(J>n||J<-n||te>n||te<-n)continue;const Te=Math.hypot(J,te)-.5*pe.w;Te<f&&(f=Te)}}for(const d of E){const m=Math.hypot(d.x-i,d.z-a)-d.w;m<f&&(f=m)}return f};for(let i=0;i<6;i++){const a=Ds(e,20),n=s.filter(v=>v.n%6===i);a.computeBoundingSphere();const f=a.boundingSphere.radius+a.boundingSphere.center.length(),d=new c.InstancedMesh(a,ot,n.length),m=new Float32Array(n.length*4);d.name="tse-loose",n.forEach((v,I)=>{const me=k(v.own),pe=Math.min((1+2.2*Math.pow(me(),2))*(1+Math.min(v.gap,300)/150),Math.max(.4,(v.gap-10)/16)),J=Math.min(pe,Math.max(.4,h(v.x,v.z,f*pe+3)/f)),te=me.range(0,O),Te=me.range(-1,1),We=Math.sqrt(1-Te*Te);be.position.set(v.x,.2*J,v.z),be.quaternion.setFromAxisAngle($t.set(Math.cos(te)*We,Te,Math.sin(te)*We),me.range(0,O)),be.scale.set(J,J,J),be.updateMatrix(),d.setMatrixAt(I,be.matrix);const vt=me.range(.8,1.05),gt=rt(v.x,v.z);t.setRGB(vt*Y(1,Ce[0],gt),vt*Y(1,Ce[1],gt),vt*Y(1,Ce[2],gt)),d.setColorAt(I,t);const Lt=Ae(me)();m.set(re(v.x,v.z,f*J+.05*Lt[1])?[1,0,0,0]:Lt,I*4)}),st(a,null).setAttribute("aRise",new c.InstancedBufferAttribute(m,4)),d.instanceMatrix.needsUpdate=!0,d.instanceColor&&(d.instanceColor.needsUpdate=!0),d.frustumCulled=!1,F.add(d),await u.yield()}}const oo=[];for(const e of N){if(e.pyr)continue;const t=Math.max(0,-ce(e.x,e.z));t<(e.hero?420:70)&&oo.push({n:e,s:e.h/(t+12)/(1+je(e.x,e.z)/150)})}oo.sort((e,t)=>t.s-e.s);const No=[];for(let e=0;e<48;e++){const t=oo[e];No.push(t?new c.Vector4(t.n.x+(t.n.tx||0)*.3,t.n.z+(t.n.tz||0)*.3,t.n.w*.5,t.n.h):new c.Vector4(0,0,0,-1))}const Se=()=>new c.Vector3,Do=(e,t=1)=>{const o=Hs(e);return new c.Vector3(o[0]*t,o[1]*t,o[2]*t)},Lo=C.range(0,O),Ho=C.range(0,O),pt=k("tse-ripples"),so=pt.range(0,O),ws=[.25,.42,.7,1.2,2,3.4].map(e=>{const t=so+pt.range(-.125,.125),o=O/(e*pt.range(.86,1.14));return new c.Vector4(Math.cos(t)*o,Math.sin(t)*o,pt.range(0,O),.5*Math.sqrt(9.81*o))}),ys=new c.Vector4(Math.cos(so),Math.sin(so),pt.range(0,64),pt.range(0,64)),_t=new c.Vector3(.45,.315,.255).lerp(new c.Vector3(.45,.34,.235),le*.8),D={uSunDir:{value:[Se(),Se(),Se()]},uSunDisc:{value:[Se(),Se(),Se()]},uSunGlow:{value:[Se(),Se(),Se()]},uSunRad:{value:[.05,.05,.05]},uSunE:{value:[Se(),Se(),Se()]},uAmb:{value:Se()},uSkyTint:{value:new c.Vector3(1,1,1)},uCloudCol:{value:Se()},uCirrus:{value:new c.Vector4(Math.cos(Lo),Math.sin(Lo),C.range(0,50),C.range(0,50))},uTime:{value:0},uFogK:{value:1/Y(6200,4800,le)},uFar:{value:new c.Vector4(C.range(0,O),C.range(0,O),C.range(0,40),C.range(0,40))},uHollow:{value:new c.Vector3(g.F.C[0],g.F.C[1],2*It)},uMir:{value:No},tField:{value:Ge},uField:{value:new c.Vector4(Re[0],Re[1],Le,Zo)},uCrust:{value:_t},uRim:{value:Do("#f0dccb")},uSeam:{value:Do("#5b4038")},uBrine:{value:new c.Vector3(.016,.06,.075)},uFrostCol:{value:new c.Vector3(.8,.86,.96)},uCold:{value:new c.Vector4(0,0,Math.cos(Ho),Math.sin(Ho))},uSalt:{value:Se()},uSkyFill:{value:Se()},uWave:{value:ws},uRuf:{value:ys},uPyrAt:{value:new c.Vector4(S.x,S.z,S.dir[0],S.dir[1])},uPyrIs:{value:new c.Vector3(S.half,S.h,ct.top)},uRise:{value:0},uRowLit:{value:new c.Vector2},uRowDir:{value:new c.Vector3(Math.sin(Fe)*Math.cos(P),Math.sin(P),-Math.cos(Fe)*Math.cos(P))}},Ft=new c.Mesh(new c.SphereGeometry(100,32,16),new c.ShaderMaterial({uniforms:D,vertexShader:ss,fragmentShader:Os,side:c.BackSide,depthWrite:!1,depthTest:!1}));Ft.renderOrder=-10,Ft.frustumCulled=!1,F.add(Ft);const Vt=new c.PlaneGeometry(13e3,13e3,40,40);Vt.rotateX(-Math.PI/2);const ao=new c.Mesh(Vt,new c.ShaderMaterial({uniforms:D,vertexShader:as,fragmentShader:Cs}));ao.renderOrder=-5,ao.frustumCulled=!1,F.add(ao),await u.yield();const no=N.length,Po=new Float32Array(no*4),Io=new Float32Array(no*4);N.forEach((e,t)=>{Po.set([e.x,e.z,e.w,e.hs??e.h],t*4),Io.set([e.tx,e.tz,e.pw,e.tipR],t*4)});const lt=new c.InstancedBufferGeometry;lt.setAttribute("position",new c.BufferAttribute(new Float32Array([-.5,0,0,.5,0,0,-.5,1,0,.5,1,0]),3)),lt.setIndex([0,1,2,2,1,3]),lt.setAttribute("aFoot",new c.InstancedBufferAttribute(Po,4)),lt.setAttribute("aTip",new c.InstancedBufferAttribute(Io,4)),lt.instanceCount=no;const ro=[],Oo={transparent:!0,depthWrite:!1,blending:c.CustomBlending,blendEquation:c.AddEquation,blendSrc:c.ZeroFactor,blendDst:c.OneFactor,blendSrcAlpha:c.OneFactor,blendDstAlpha:c.ZeroFactor},Co=new c.ShaderMaterial({uniforms:{uA:{value:1}},vertexShader:as,fragmentShader:is,...Oo,polygonOffset:!0,polygonOffsetFactor:0,polygonOffsetUnits:-2}),Bo=e=>new c.ShaderMaterial({uniforms:{uA:{value:e}},vertexShader:ss,fragmentShader:is,...Oo,side:c.BackSide,depthTest:!1}),Wt=(e,t,o)=>{const r=new c.Mesh(e,t);r.frustumCulled=!1,r.renderOrder=o,F.add(r)};Wt(Ft.geometry,Bo(0),8),Wt(Vt,Co,9);const qo=-1;for(let e=0;e<3;e++){const t={...D,uDir:{value:D.uSunDir.value[e]},uE:{value:D.uSunE.value[e]},uTanR:{value:.05},uCapFade:{value:0},uShade:{value:.45},uMode:{value:0}},o=new c.ShaderMaterial({uniforms:t,vertexShader:ns,fragmentShader:rs,transparent:!0,depthWrite:!1,side:c.DoubleSide,blending:c.CustomBlending,blendEquation:c.ReverseSubtractEquation,blendSrc:c.DstAlphaFactor,blendDst:c.OneFactor,blendEquationAlpha:c.AddEquation,blendSrcAlpha:c.ZeroFactor,blendDstAlpha:c.OneMinusSrcAlphaFactor,polygonOffset:!0,polygonOffsetFactor:qo,polygonOffsetUnits:-8}),r=new c.Mesh(lt,o);r.frustumCulled=!1,r.renderOrder=10+e*2,F.add(r),ro.push(t),Wt(Vt,Co,11+e*2);const s=new c.ShaderMaterial({uniforms:{...t,uMode:{value:1}},vertexShader:ns,fragmentShader:rs,transparent:!0,depthWrite:!1,side:c.DoubleSide,blending:c.CustomBlending,blendEquation:c.AddEquation,blendSrc:c.DstAlphaFactor,blendDst:c.OneFactor,blendEquationAlpha:c.AddEquation,blendSrcAlpha:c.ZeroFactor,blendDstAlpha:c.OneMinusSrcAlphaFactor,polygonOffset:!0,polygonOffsetFactor:qo,polygonOffsetUnits:-8}),h=new c.Mesh(lt,s);h.frustumCulled=!1,h.renderOrder=16+e,F.add(h)}Wt(Ft.geometry,Bo(1),19),await u.yield();{const e=k("tse-vapour"),t=141,o=2*Le/t,r=new Float32Array(t*t*4),s=19,h=[1e9,-1e9,1e9,-1e9];for(let n=0;n<Ne;n++)h[0]=Math.min(h[0],A[n*3]-s),h[1]=Math.max(h[1],A[n*3]+s),h[2]=Math.min(h[2],A[n*3+2]-s),h[3]=Math.max(h[3],A[n*3+2]+s);for(let n=0;n<t;n++){for(let f=0;f<t;f++){const d=Re[0]-Le+(f+e())*o,m=Re[1]-Le+(n+e())*o,v=e(),I=e();r.set([d,m,d>h[0]&&d<h[1]&&m>h[2]&&m<h[3]&&nt(d,m)<s?-1:v,I],(n*t+f)*4)}n%24===23&&await u.yield()}const i=new c.InstancedBufferGeometry;i.setAttribute("position",new c.BufferAttribute(new Float32Array([-.5,0,0,.5,0,0,-.5,1,0,.5,1,0]),3)),i.setIndex([0,1,2,2,1,3]),i.setAttribute("aPuff",new c.InstancedBufferAttribute(r,4)),i.instanceCount=t*t;const a=new c.Mesh(i,new c.ShaderMaterial({uniforms:D,vertexShader:Vs,fragmentShader:Ws,transparent:!0,depthWrite:!1,side:c.DoubleSide}));a.frustumCulled=!1,a.renderOrder=30,F.add(a)}await u.yield();const xs=(e,t)=>{const o=2*Le/ee,r=Math.floor((e-Re[0]+Le)/o),s=Math.floor((t-Re[1]+Le)/o);return r<0||s<0||r>=ee||s>=ee?0:Me[(s*ee+r)*4]/255};let Ut=null;{const e=ue*b.length-60,t=b.length+400,o={"tse-rise-plates":"plates","tse-rise-glitter":"frost","tse-rise-beads":"beads","tse-rise-ropes":"ropes"},r=await Rt(k("tse-homes-beads"),900,e,t,(i,a)=>xs(i,a)>.535&&!re(i,a,4),14,zt),s=await Rt(k("tse-homes-plates"),2200,e,t,(i,a)=>to(i,a)&&!re(i,a,6),16,zt),h=await Rt(k("tse-homes-frost"),1700,e,t,(i,a)=>to(i,a)&&!re(i,a,3),14,zt);await u.yield(),Ut=Ls({rng:k("tse-rise-small"),rngOf:i=>k("tse-pieces-"+o[i]),rngAt:(i,a)=>k("tse-pieces-"+o[i]+"-"+a),U:D,glsl:Ht,homes:{plates:s,glitter:h,beads:r}}),F.add(Ut.group)}await u.yield();const Go=[0,1,2].map(()=>{const e=new c.DirectionalLight(16777215,Math.PI);return F.add(e),F.add(e.target),e}),io=new c.HemisphereLight(16777215,16777215,1);F.add(io),F.fog=new c.FogExp2(16777215,D.uFogK.value);const Nt=wo(),_o=wo(),bs=1.34,Dt=new c.Vector3,Ss=[1,.8,.55],Vo=(e,t)=>{j(e,t,Nt);const o=Q(t);D.uRise.value=o,D.uRowLit.value.set(p(t),o);let r=0;for(let V=0;V<3;V++)r+=Nt.sun[V].flux;const s=bs/(3+r),h=D.uAmb.value.set(.05,.075,.115),i=D.uCloudCol.value.set(.3,.33,.38),a=F.fog.color.setRGB(.62,.43,.31),n=io.groundColor.setRGB(0,0,0);let f=h.x,d=h.y,m=h.z,v=.3,I=.3,me=.34;for(let V=0;V<3;V++){const oe=Nt.sun[V],se=jt[V],Be=Ve(0,.3,oe.dir[1]),$e=oe.flux*s,ht=se.col[0],Ze=se.col[1]*Y(.7,1,Be),Je=se.col[2]*Y(.5,1,Be);D.uSunDir.value[V].set(oe.dir[0],oe.dir[1],oe.dir[2]);const ho=D.uSunE.value[V].set(ht*$e,Ze*$e,Je*$e),jo=Math.max(oe.dir[1],0),co=1.12*jo/(jo+.12);f+=ho.x*co,d+=ho.y*co,m+=ho.z*co;const fo=$e*Ss[V];v+=ht*fo,I+=Ze*fo,me+=Je*fo,D.uSunDisc.value[V].set(se.disc[0],se.disc[1]*Y(.7,1,Be),se.disc[2]*Y(.5,1,Be)).multiplyScalar(.25+.75*oe.up);const wt=.3*oe.up*(.6+.5*oe.near);D.uSunGlow.value[V].set(ht*wt,Ze*wt,Je*wt),D.uSunRad.value[V]=oe.rad,a.r+=ht*wt*.12,a.g+=Ze*wt*.12,a.b+=Je*wt*.12,ro[V].uTanR.value=Math.tan(oe.rad)*.14,ro[V].uCapFade.value=Ve(4.5,8,Math.cos(oe.el)/Math.max(Math.sin(oe.el),.001))}const pe=(f+d+m)/3,J=Y(1,1.07*pe/f,.55),te=Y(1,pe/d,.55),Te=Y(1,.9*pe/m,.55),We=Y(1,v/1,.7),vt=Y(1,I/.88,.55),gt=Y(1,me/.84,.7);D.uSkyTint.value.set(We,vt,gt),a.r*=We,a.g*=vt,a.b*=gt,h.x*=J,h.y*=te,h.z*=Te;for(let V=0;V<3;V++){const oe=Nt.sun[V],se=D.uSunE.value[V];se.x*=J,se.y*=te,se.z*=Te,Go[V].position.set(oe.dir[0]*900,oe.dir[1]*900,oe.dir[2]*900),Go[V].color.setRGB(se.x,se.y,se.z),h.addScaledVector(se,.085),i.addScaledVector(se,.55);const Be=(.25+Math.max(oe.dir[1],0))*.42;n.r+=se.x*Be*_t.x,n.g+=se.y*Be*_t.y,n.b+=se.z*Be*_t.z}const Lt=go(vo(q,e,_o));D.uCold.value.x=Lt-.9*o,D.uCold.value.y=Ve(.004,.05,(go(vo(q,e-.5,_o))-Lt)/.5);{let V=h.x,oe=h.y,se=h.z;for(let $e=0;$e<3;$e++){const ht=Math.max(Nt.sun[$e].dir[1],0),Ze=1.12*ht/(ht+.12),Je=D.uSunE.value[$e];V+=Je.x*Ze,oe+=Je.y*Ze,se+=Je.z*Ze}D.uSalt.value.set(Math.max(Xt[0]*V-n.r,0),Math.max(Xt[1]*oe-n.g,0),Math.max(Xt[2]*se-n.b,0));const Be=D.uSkyTint.value;D.uSkyFill.value.set(.5*Yt[0]*Be.x,.5*Yt[1]*Be.y,.5*Yt[2]*Be.z)}io.color.setRGB((h.x+.1)*Math.PI,(h.y+.13)*Math.PI,(h.z+.17)*Math.PI),n.multiplyScalar(Math.PI)};Vo(0,0);const Wo=wo(),Ms=(e,t)=>{b.posAtDist(t*b.length,Dt),j(e,t,Wo);let o=0,r=0,s=0;for(let i=0;i<3;i++){const a=Wo.sun[i],n=a.up*(.02+Math.pow(a.near,4));o+=a.dir[0]*n,r+=a.dir[1]*n,s+=a.dir[2]*n}const h=Math.hypot(o,r,s)||1;return Dt.set(Dt.x+o/h*3e3,Dt.y+r/h*3e3,Dt.z+s/h*3e3)},Uo=b.length-100,As=Pt[4]-Pt[1],lo=Ao+Math.max(ds,g.sLook-g.sP);return{scene:F,path:b,duration:g.duration,counted:{candidates:z.length,tested:Eo,needles:N.length,full:_,alone:N.filter(e=>e.alone).length},camera:{fov:54,near:.3,far:6500,lookAhead:24,sway:.5,bank:.3},pois:[{at:Ms,from:0,to:Uo/b.length,weight:.3,fade:As/Uo,arc:!0},{at:[fe[0],0,fe[1]],from:g.sR0/g.flat.length,to:g.sL0/g.flat.length,weight:.5,fade:(g.sL0-g.sD0)/(g.sL0-g.sR0),arc:!0},{at:[S.x,S.h,S.z],from:(g.sP-Ao)/g.flat.length,to:1+lo/g.flat.length,weight:.85,fade:lo/(g.flat.length+lo-g.sP+Ao),arc:!0}],portal:{shape:"circle",radius:7,color:"#ffd9a8",glow:1.1,revealDistance:Math.round(b.length-g.sL1)},post:{exposure:1,bloom:{strength:.42,radius:.6,threshold:.92},grade:{saturation:1.08,contrast:1.05,tint:"#ffffff",shadowTint:"#3f3f3f",vignette:.26,grain:.02,aberration:0}},update(e,t,o,r){D.uTime.value=t,Vo(t,r||0)},dispose(){F.traverse(e=>{e.isMesh&&(e.geometry.dispose(),e.material.dispose(),e.isInstancedMesh&&e.dispose())});for(const e of[...B,...X,...Z,...ye,y])e.dispose();Ge.dispose(),Ke.dispose(),Ye.dispose(),Ut&&Ut.dispose()}}}};export{Zo as HOLLOW_CELL,jt as KINDS,Qo as coldOf,aa as default,vo as groundCold,ta as layPlan,$o as makeSunLaw,wo as newSunState,go as seenCold};
