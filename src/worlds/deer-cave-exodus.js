import*as N from"three";import{makePath as ln,clamp as Lt,lerp as E,smoothstep as W,makeRng as Go,hashSeed as Vo}from"../kit/core.js";import{makeSky as cn,makeLightRig as fn,makeCloudField as hn}from"../kit/sky.js";import*as un from"../kit/terrain.js";import*as Io from"../kit/fauna.js";import*as jo from"../kit/fx.js";import{buildHero as dn,BAT_STROKE_GLSL as mn}from"../parts/deer-cave-exodus.js";const Ee=["#06090A","#17424E","#62B9A1","#F3A869","#BCD6CC","#143322","#2B1D17"],I=(D,lt,X)=>new N.Vector3(D,lt,X),_=D=>new N.Color(D),lo=Math.PI/180,vn={hero:"night",zenith:"#040a1c",mid:"#11244e",horizon:"#3b5e94",wash:"#7e9cd2",washK:.6,cirrusLit:"#9fb2dc",cirrusShade:"#1c2a4c",moonAz:37,moonEl:12,moonSize:4.6,moonCol:"#f1f0ea",moonGlow:"#a9c2ff",moonI:1.5,moon:"#dfe8ff",moonK:1.15,lamp:"#93a8d0",lampI:1.5,haze:"#3c4f78",fog:"#22304c",fogK:85e-5,mist:"#b9c6e2",mistI:.45,mistShade:[.3,.38,.56],glow:"#cfdcf8",glowI:3.2,glowK:1.9,skyCol:"#4a66a0",skyK:1.9,skyGrey:.45,rockK:.95,canopyA:"#27584a",canopyB:"#173a34",canopyC:"#356a58",portal:"#ffc98a",exposure:1.15,shadowTint:"#050814",fireflies:2.2},pn={clear:{},mist:{zenith:"#070b1a",mid:"#1a2444",horizon:"#56567a",wash:"#c9a98a",washK:.7,cirrusLit:"#c9b6a6",moonAz:40,moonEl:8.5,moonSize:5.2,moonCol:"#ffd9a0",moonGlow:"#ffbf8a",moon:"#ffe4c0",lamp:"#c6b6b4",lampI:1.75,haze:"#5a5068",fog:"#2c2f48",mist:"#d9cfc6",mistI:.5,mistShade:[.34,.36,.5],glow:"#f6dfc4",skyCol:"#5a6490",portal:"#9fe0ff",fireflies:1},thunder:{zenith:"#03101a",mid:"#0d2c40",horizon:"#2f6a80",wash:"#86c2c8",cirrusLit:"#8fc0c4",cirrusShade:"#14303a",moonAz:34,moonEl:15,moonSize:4.2,moonCol:"#f4f8f6",moonGlow:"#9fe0e0",moon:"#d8f4f0",lamp:"#9cc8d2",lampI:1.3,haze:"#3d6c7a",fog:"#1c3440",mist:"#b4d4d2",mistShade:[.26,.42,.48],glow:"#c6eeea",skyCol:"#3f7888",canopyA:"#235a50",canopyC:"#32705e",fireflies:1.4}},ee=`
float h31(vec3 p){ p = fract(p * vec3(.1031, .1030, .0973)); p += dot(p, p.yxz + 33.33); return fract((p.x + p.y) * p.z); }
float vn3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(mix(h31(i), h31(i + vec3(1., 0., 0.)), f.x), mix(h31(i + vec3(0., 1., 0.)), h31(i + vec3(1., 1., 0.)), f.x), f.y),
             mix(mix(h31(i + vec3(0., 0., 1.)), h31(i + vec3(1., 0., 1.)), f.x), mix(h31(i + vec3(0., 1., 1.)), h31(i + vec3(1., 1., 1.)), f.x), f.y), f.z); }
float h21(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float vn2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
`,Me=`
uniform vec3 uCam, uLampPos, uLampCol, uHaze; uniform float uHazeK, uTime;
float hC(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float nC(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hC(i), hC(i + vec2(1., 0.)), f.x), mix(hC(i + vec2(0., 1.)), hC(i + vec2(1., 1.)), f.x), f.y); }
vec3 caveFog(vec3 col, vec3 P){
  vec3 d = P - uCam; float dist = length(d); vec3 v = d / max(dist, 1e-3);
  float f = 1. - exp(-dist * uHazeK);
  vec3 oL = uCam - uLampPos; float dl = length(oL); vec3 toM = -oL / max(dl, 1e-3);
  float c = max(dot(v, toM), 0.), c2 = c * c, c8 = c2 * c2; c8 *= c8;
  float b = dot(oL, v), H = sqrt(max(dot(oL, oL) - b * b, 0.) + 900.);
  float air = (atan((dist + b) / H) - atan(b / H)) / H;
  vec3 e1 = normalize(cross(toM, vec3(0., 1., 0.)) + vec3(1e-4, 0., 0.)), e2 = cross(e1, toM);
  vec2 sp = vec2(dot(v, e1), dot(v, e2)); sp /= max(length(sp), 1e-3);
  float rays = nC(sp * 3.5 + uTime * .05) * .6 + nC(sp * 8. - uTime * .07 + 5.) * .4;
  float mk = 1. - smoothstep(-95., -6., P.z);
  vec3 hz = uHaze * (f * (.11 + .2 * c2 * (.3 + .7 * mk) + .4 * c8 * (.85 + .3 * rays) * mk) + air * .36 * (.88 + .24 * rays) * (.3 + .7 * mk));
  return col * (1. - f) + hz;
}
float lampAtt(vec3 P){ return 95. / (length(uLampPos - P) + 60.); }
uniform vec3 uMoonDir, uMoonCol, uHole, uFoot, uBeamDir, uBeamCol, uBounce; uniform float uBeamR;
// moonlight through the keyhole: 1 where the ray from P to the moon leaves by the mouth (the plane z = 0) inside its
// outline, under the comb of stalactites on its rim and over the tops of the forest that stands outside
float moonIn(vec3 P){
  float t = max(-P.z, 0.) / max(uMoonDir.z, .05);
  vec2 q = P.xy + uMoonDir.xy * t;
  float hw = 47.5 * (.6 + .4 * smoothstep(-5., 62., q.y));
  float e = q.y < 72. ? hw - abs(q.x) : 47.5 * (1. - length(vec2(q.x / 47.5, (q.y - 72.) / 48.)));
  e -= nC(vec2(q.x * .3, 7.)) * 9. * smoothstep(64., 100., q.y);
  float trees = q.y - (36. + 10. * nC(vec2(q.x * .09, 2.)));
  return smoothstep(0., 4. + t * .012, min(e, trees)) * (1. - step(0., P.z));
}
// the shaft from the window in the roof: 1 inside it (ragged), 0 outside
float beamIn(vec3 P){
  vec3 d = P - uHole; float al = dot(d, uBeamDir), r = length(d - uBeamDir * al);
  float rag = .8 + .45 * nC(P.xz * .19 + 3.);
  return (1. - smoothstep(uBeamR * .55 * rag, uBeamR * 1.12 * rag, r)) * step(0., al);
}
`,Aa=`
attribute vec3 aCol; varying vec3 vC, vN, vP;
#ifdef STAL
attribute vec2 aSt; varying vec2 vSt;
#endif
void main(){
#ifdef STAL
  vSt = aSt;
#endif
  vC = aCol; vN = normal; vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,Pa=`
varying vec3 vC, vN, vP; uniform vec3 uAmbCol; uniform float uFloorK;
#ifdef STAL
varying vec2 vSt;
#endif
${ee}${Me}
// Solution pockets: round-edged hollows on a jittered grid, each of its own size and a little wider than tall, a
// cell left empty wherever the cluster mask (keep, 0..1) says so. p: metres along the wall and up it, sc: cells to
// the metre. Returns x = 1 at the pocket's floor, 0 on its edge, below 0 outside; y = +1 at its upper edge, -1 at
// its lower one.
vec2 pockets(vec2 p, float sc, float keep, float big){
  vec2 q = p * sc, i = floor(q), f = fract(q), best = vec2(-9., 0.);
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y)), id = i + g; float h = h21(id + 3.7), h2 = h21(id + 9.1);
    vec2 c = f - (g + .22 + .56 * vec2(h21(id), h21(id + 17.3)));
    float R = mix(mix(.1, .47, h * h), mix(.22, .47, h), big) * step(h2, keep);
    vec2 e = c / vec2(max(R * (1.15 + .5 * h2), 1e-3), max(R, 1e-3));
    float d = (1. - dot(e, e)) * step(1e-3, R) - 9. * (1. - step(1e-3, R));
    if (d > best.x) best = vec2(d, e.y);
  }
  return best;
}
void main(){
  vec3 V = normalize(uCam - vP + vec3(1e-4, 0., 0.));
  vec3 N0 = normalize(vN + vec3(0., 1e-4, 0.)); if (dot(N0, V) < 0.) N0 = -N0;
  float dist = length(uCam - vP), nearK = 1. - smoothstep(30., 130., dist), midK = 1. - smoothstep(110., 300., dist);
  float thr = smoothstep(-74., -14., vP.z);
  float nr = (1. - smoothstep(70., 160., dist)) * (1. - uFloorK), nr2 = (1. - smoothstep(14., 40., dist)) * (1. - uFloorK);      // the passage is 170 m wide: its walls are seen from 40 to 100 m
#ifndef STAL
  // the wall's broad shading follows the round of the passage where the two agree, so the mesh's cells never show as facets
  vec3 Ns = normalize(vec3(-vP.x, (52. - vP.y) * .55, 0.) + vec3(1e-4, 0., 0.));
  N0 = normalize(mix(N0, Ns, .75 * smoothstep(.72, .93, dot(N0, Ns)) * (1. - smoothstep(60., 160., dist))) + vec3(0., 1e-4, 0.));
#endif
  float warp = vn3(vP * .035);
  float curtain = vn3(vec3(vP.x * .10, vP.y * .026, vP.z * .10) + warp * 2.);     // broad runs, stretched down the wall
  float rib = vn3(vec3(vP.x * .8, vP.y * .05, vP.z * .8) + 9.);
  float bed = vn3(vec3(vP.x * .03, vP.y * .13 + warp * 1.2, vP.z * .03) + 4.) * .6 + vn3(vec3(vP.x * .07, vP.y * .3, vP.z * .07) + 9.) * .4;      // lenses of massive rock four times as long as they are deep, each dying out sideways: bedding without a level line
  float hq = vP.z + vP.x * .38, fl3 = 1. - smoothstep(18., 60., dist);             // metres along the wall; what is finer than a metre shows only this close
  float fine = vn3(vP * 1.7 + 3.);
  float wall = 1. - smoothstep(.5, .85, abs(N0.y));
  float run = smoothstep(.3, .62, vn3(vP * .013 + 7.));                           // flowstone here, massive bedded rock there
  float stepK = smoothstep(-115., -45., vP.z) * (1. - smoothstep(-30., -8., vP.x));        // the stepped right-hand side of the mouth: ledges, which upright columns would cut into a sawtooth
  float colK = wall * mix(.3 + .7 * run, 1., thr) * (.72 + .28 * max(thr, midK)) * (1. - uFloorK) * (1. - stepK);      // the floor, its banks and boulders carry no flowstone columns
#ifdef STAL
  colK = 0.;
#endif
  // the flowstone hangs in tiers 45 m tall, each with its own columns: bold ones and flat ones, of unequal width
  float c0 = vP.z * .13 + vP.x * .05;
  float tr = vP.y * .023 + vn2(vec2(vP.z * .012, vP.x * .012 + 3.)) * .8 + vP.z * .0035 + .1 * sin(c0 * 3.1416) + .24 * vn2(vec2(c0 * .9, 5.)), tier = floor(tr), tf = fract(tr);      // each hem dips along the cave and hangs in scallops from column to column
  float cu = hq * .07 + (vn2(vec2(vP.z * .017, vP.y * .013 + tier * 3.7)) - .5) * 1.3 + h21(vec2(tier, 2.1)) * 9.;
  float hemK = smoothstep(0., .1, tf) * (1. - smoothstep(.84, 1., tf));          // the columns die away into each hem, so no groove jumps sideways across one
  float colA = colK * hemK;
  // the columns are the swells of one smooth profile along the wall, no two alike, 10 to 30 m across: each has a
  // lit flank and a dark one, the hollow between two is a broad shade, and nothing in it repeats or draws a line
  float ch0 = vn2(vec2(cu, tier * 7.3 + 1.)) * .65 + vn2(vec2(cu * .43 + 3., tier * 5.1)) * .35, ch1 = vn2(vec2(cu + .3, tier * 7.3 + 1.)) * .65 + vn2(vec2(cu * .43 + 3.129, tier * 5.1)) * .35;
  float nb = clamp((ch0 - ch1) * 3.4, -1., 1.), cid = ch0, amp = (.4 + .6 * smoothstep(.3, .75, ch0)) * colA;
  float bulge = smoothstep(.22, .78, ch0), groove = 1. - smoothstep(.1, .45, ch0);
  float nf = fract(cu * 5. + cid * 2.) * 2. - 1.;                                 // flutes on each column, close to
  float streak = vn2(vec2(cu * 9., vP.y * .05)) * (1. - smoothstep(25., 80., dist));
  // each hem shows only in lengths, and beyond 50 m at a third of its strength
  float hemSeg = smoothstep(.4, .62, vn2(vec2(hq * .033 + tier * 5.1, tier * 3.1 + 2.))) * mix(1., .33, smoothstep(50., 110., dist));
  float hemS = smoothstep(.88, .98, tf) * (1. - smoothstep(.98, 1., tf)) * colK * .5 * hemSeg, hemL = smoothstep(0., .012, tf) * (1. - smoothstep(.012, .05, tf)) * colK * .45 * hemSeg;    // the shadow under each tier's hem, and the hem's pale edge
  // a few bedding ledges: two levels in five carry one, each in broken lengths, fainter far off
  float by = vP.y * .1 + warp * .8 + vn2(vec2(vP.z * .02, vP.x * .02)) * .8, bf = fract(by), bi = floor(by);
  float ledSeg = smoothstep(.42, .6, vn2(vec2(hq * .028 + bi * 3.3, bi * 2.7))) * mix(1., .35, smoothstep(50., 120., dist));
  float ledK = max(wall * (1. - run) * (1. - thr) * midK * step(.6, h21(vec2(bi, 1.7))), wall * stepK * .7) * (1. - uFloorK) * ledSeg;
  float under = max(smoothstep(.78, 1., bf) * ledK, hemS), lipT = max((1. - smoothstep(0., .16, bf)) * ledK, hemL);
  vec3 tz = vec3(0., 0., 1.) - N0 * N0.z; tz /= max(length(tz), .25);             // along the passage, in the surface
  float cuK = mix(1., .4, smoothstep(35., 110., dist));                              // far off the damp runs are a faint mottle: the rock's form carries, not a cloud pattern
  vec3 N = normalize(N0 + tz * (nb * (.45 + .55 * abs(nb)) * 1.75 * amp + (nf * (1. - nf * nf) * .5 * colA + (rib - .5) * .3) * fl3 + (curtain - .5) * .45 * cuK * (1. - .6 * thr))
    + vec3(0., (bed - .5) * .4 + lipT * .3 - under * .3, 0.) + vec3(0., 1e-4, 0.));
  vec3 alb = vC * (.9 - .28 * cuK + .56 * cuK * curtain) * (.98 - .14 * cuK + .28 * cuK * bed) * (.9 + .2 * fine * nearK) * (1. + (streak - .5) * .25 * colK);
  // guano banks and rubble: soft mounds and a pebbled grain, pale drift lines, none of the wall's vertical runs
  float mound = vn2(vP.xz * .16 + 4.), peb = vn2(vP.xz * 1.4) * .6 + vn2(vP.xz * 3.7 + 9.) * .4;
  alb = mix(alb, vC * (.6 + .7 * mound) * (.78 + .44 * peb * nearK), uFloorK);
  N = normalize(N + vec3(vn2(vP.xz * .16 + vec2(1.3, 4.)) - mound, 0., vn2(vP.xz * .16 + vec2(0., 5.3)) - mound) * (1.6 * uFloorK) + vec3(0., 1e-4, 0.));
  // the underside of the brow: flowstone ribs that run out toward the light, lumpy, darker toward the lip so it frames the sky
  float ceilK = (1. - wall) * thr;
  float ribC = abs(fract(vP.x * .17 + vn2(vec2(vP.x * .4, vP.z * .05)) * .9) * 2. - 1.), lumpC = vn2(vP.xz * .8 + 11.);
  alb *= mix(1., (.4 + .85 * ribC) * (.65 + .6 * lumpC) * mix(1., .5, smoothstep(-22., -1., vP.z)), ceilK);
  N = normalize(N + vec3((ribC - .5) * 1.1 * ceilK, 0., (lumpC - .5) * .7 * ceilK) + vec3(0., 1e-4, 0.));
  alb *= mix(1., (.7 + .46 * bulge) * (1. - .42 * groove) * (1. - .1 * fl3 * smoothstep(.7, 1., abs(nf))), colA) * (1. - .6 * under) * (1. + .18 * lipT);
  // ---- limestone at close range ----
  float bare = wall * (1. - .7 * colA * smoothstep(45., 110., dist)), nrR = (1. - smoothstep(30., 85., dist)) * (1. - uFloorK);       // close to, the flowstone's columns are limestone too: rills, pockets and stains on both walls
  float rwn = vn2(vec2(hq * .27 + 2., vP.y * .028 + warp * 2.)), r1 = abs(rwn * 2. - 1.);                  // rills 2 to 5 m apart: they wander as they fall
  float r2 = abs(vn2(vec2(hq * 1.9 + 11., vP.y * .16)) * 2. - 1.);                                         // and small ones between them, close to
  float life = smoothstep(.28, .6, vn2(vec2(hq * .06 + 5., vP.y * .09)));                                 // each one runs a bed or two and dies out
  float gw = .09 + dist * .0019;
  float g1 = (1. - smoothstep(gw * .25, gw * 1.5, r1)) * life * bare * nrR, g2 = (1. - smoothstep(.04, .2, r2)) * (1. - life * .5) * bare * nr2;
  // solution pockets from a hand to a couple of metres across, in clusters with bare rock between: a dark upper
  // lip (the overhang's shade), a floor in half shade, a pale rim along the lower edge where the light catches it
  vec2 pw = vec2(hq, vP.y) + (vec2(vn2(vec2(hq, vP.y) * .55 + 3.), vn2(vec2(hq, vP.y) * .55 + 23.)) - .5) * 1.1;
  float clu = smoothstep(.47, .66, vn2(pw * .043 + 5.) * .62 + vn2(pw * .12 + 2.) * .38);
  vec2 pA = pockets(pw, .27, clu * .8, 0.), pB = pockets(pw + 31.7, .86, clu * .62, 0.);
  float gA = bare * (1. - smoothstep(110., 250., dist)) * (1. - uFloorK), gB = bare * (1. - smoothstep(26., 85., dist)) * (1. - uFloorK);      // the larger pockets carry as far as they are two pixels wide
  // and alcoves, 6 to 16 m across, in loose groups 90 m apart: scoops the old stream cut, each with its roof in
  // shade and its sill catching the light. They carry down the whole passage, where the small pockets are too fine.
  vec2 pwC = vec2(hq, vP.y * 1.25) + (vec2(vn2(vec2(hq, vP.y) * .09 + 13.), vn2(vec2(hq, vP.y) * .09 + 41.)) - .5) * 7.;
  vec2 pC = pockets(pwC + 77.3, .058, smoothstep(.24, .46, vn2(pwC * .012 + 9.)), 1.);
  float gC = wall * (1. - uFloorK) * (1. - .6 * thr * (1. - stepK)) * (.55 + .45 * smoothstep(30., 90., dist));
#ifdef STAL
  gA = 0.; gB *= .5; gC = 0.;
#endif
  float inC = smoothstep(-.05, .45, pC.x) * gC, lipC = inC * smoothstep(-.6, .7, pC.y);
  float rimC = (1. - smoothstep(0., .4, abs(pC.x - .04))) * smoothstep(0., .8, -pC.y) * gC * step(-1., pC.x);
  float inA = smoothstep(-.06, .5, pA.x) * gA, inB = smoothstep(-.06, .5, pB.x) * gB;
  float pock = max(inA, inB * .8);
  float pockH = max(smoothstep(-.1, 1., pA.x) * gA, smoothstep(-.1, 1., pB.x) * gB * .5) * (1. - smoothstep(22., 75., dist));          // the hollow's depth is a soft bowl, and only close to: far off the shade alone carries it
  float lipD = max(inA * smoothstep(-.5, .8, pA.y), inB * .8 * smoothstep(-.5, .8, pB.y));
  float rimP = max((1. - smoothstep(.0, .55, abs(pA.x - .05))) * smoothstep(0., .8, -pA.y) * gA * step(-1., pA.x), (1. - smoothstep(.0, .55, abs(pB.x - .05))) * smoothstep(0., .8, -pB.y) * gB * .7 * step(-1., pB.x));
  float pit = smoothstep(.64, .8, vn3(vP * 2.3 + 11.)) * nr2;
  float mott = vn3(vP * .21 + 2.) * .6 + vn3(vP * .67 + 9.) * .4;
  float sb = vP.y * .2 + warp * 2.4 + vn2(vec2(hq * .022, vP.y * .03)) * 1.8, sf = abs(fract(sb) - .5);
  float sj = (1. - smoothstep(.006, .03 + dist * .0012, sf)) * smoothstep(.36, .6, vn2(vec2(hq * .04, floor(sb) * 3.3))) * step(.6, h21(vec2(floor(sb), 4.4))) * bare * nrR;                  // bedding joints 5 m apart, in lengths that fade in and out
  float drip = smoothstep(.45, .75, vn2(vec2(hq * .36, floor(by) * 5.3 + 1.))) * smoothstep(.05, .95, bf) * ledK;                        // stains that run down from under each ledge
  float seep = smoothstep(.54, .8, vn2(vec2(hq * .11 + 9., vP.y * .03 + warp))) * bare * (1. - uFloorK) * (1. - .7 * smoothstep(40., 120., dist));                              // long dark seeps
  alb *= mix(1., (.62 + .78 * mott) * .9, bare * nr) * (1. - .6 * g1) * (1. - .4 * g2) * (1. - .3 * pock - .42 * lipD) * (1. + .3 * rimP) * (1. - .24 * inC - .56 * lipC) * (1. + .4 * rimC) * (1. - .45 * pit) * (1. - .38 * sj) * (1. - .5 * drip) * mix(vec3(1.), vec3(.5, .56, .6), seep * .75);
  alb = mix(alb, vec3(dot(alb, vec3(.3333))) * vec3(1.1, 1., .86), .5 * bare * nr);                                                    // grey-buff, not jade ice
#ifdef STAL
  // growth rims: thin terraces a hand high stacked up each tier, pale lips over dark undersides; dark feet
  float rm = fract(vSt.x * 1.9 + vSt.y * 3. + .4 * vn2(vP.xz * .6 + vSt.y)), tfS = fract(vSt.y);
  float rimH = rm * rm * (1. - smoothstep(.86, 1., rm));
  alb *= (.9 + .18 * rm) * (1. - .22 * (1. - smoothstep(.0, .12, rm)) * nearK) * mix(.3, 1., smoothstep(.2, 5., vSt.x)) * (.92 + .2 * smoothstep(.7, .95, tfS));
  float hgt = (-g1 * .22 - g2 * .035 - pockH * .12 - pit * .06 + (fine - .5) * .04 * nr2 + rimH * .07 * nearK);
#else
  alb *= mix(vec3(1.), mix(vec3(.5, .45, .4), vec3(1.), smoothstep(8., 44., vP.y)), wall * (1. - uFloorK) * (1. - thr));                    // the foot of every wall is damp and dark
  float hgt = (-g1 * .28 - g2 * .035 - pockH * .16 - pit * .06 + (fine - .5) * .04 * nr2 - sj * .1 + (mott - .5) * .25 * bare * nr - smoothstep(-.1, 1., pC.x) * gC * .9 * (1. - smoothstep(50., 170., dist)));
#endif
  {                                                                                  // one bump of true depth (metres) from all of it
    vec3 dpx = dFdx(vP), dpy = dFdy(vP); float hx = dFdx(hgt), hy = dFdy(hgt);
    vec3 R1 = cross(dpy, N0), R2 = cross(N0, dpx); float det = dot(dpx, R1);
    vec3 gr = (hx * R1 + hy * R2) * (sign(det) / max(abs(det), 1e-7));
    N = normalize(N - clamp(gr, -3., 3.) * 1.2 + vec3(0., 1e-4, 0.));
  }
  alb += vec3(.021, .024, .03) * (.6 + .4 * curtain);                              // the darkest jade rock still gives back a little of the night: dim form, not black
  vec3 L = uLampPos - vP; float dl = length(L); L /= max(dl, 1e-3);
  float att = min(95. / (dl + 60.), .95) + .12;
  float hl = .5 + .5 * dot(N, L);
  vec3 H = normalize(L + V + vec3(0., 1e-4, 0.));
  float ndh = max(dot(N, H), 0.), s8 = ndh * ndh; s8 *= s8; s8 *= s8; float s32 = s8 * s8; s32 *= s32;
  float wet = smoothstep(.5, .8, curtain) * (.35 + .65 * rib);                   // wet runs follow the curtains
  vec3 sc = vP * 3.1; float sh = h31(floor(sc));
  float spark = step(.9, sh) * (.55 + .45 * sin(uTime * 2.6 + sh * 400.)) * (1. - smoothstep(.05, .2, length(fract(sc) - .5))) * (1. - smoothstep(45., 150., dist));   // drops that catch the keyhole
  float lip = mix(1. - .6 * thr, 1. + .2 * thr, nearK);                                                    // from deep inside the throat stays darker than the sky it frames; close to, it is the best-lit rock
  float hlq = mix(hl * hl, .3 + .25 * hl, .7 * thr * (1. - .65 * nr));                       // the throat is lit from all of the sky: soft, no facet shows; close to, its relief takes the light
  vec3 col = alb * uLampCol * att * lip * (hlq * 1.3 + .05) + alb * uAmbCol * (.55 + .45 * abs(N.y)) * (.55 + .45 * hl) * (1. - .45 * thr * (1. - nearK));
  col += alb * uBounce * ((.74 - .26 * N.y) * (.7 + .3 * hl) * (1. - .5 * thr * (1. - nearK)));          // the cave's own bounce, warm grey: form shows in every shadow
  // the moon, where it shines in through the keyhole; the shaft from the roof window and the glow of its pool
  float mIn = moonIn(vP), bIn = beamIn(vP), ml = max(dot(N, uMoonDir), 0.);
  vec3 Hm = normalize(uMoonDir + V + vec3(0., 1e-4, 0.)); float nhm = max(dot(N, Hm), 0.), sm = nhm * nhm; sm *= sm; sm *= sm; sm *= sm;
  col += alb * uMoonCol * (mIn * (ml * 1.3 + .05)) + uMoonCol * (mIn * sm * (.03 + .16 * wet * rib));
  vec3 toF = uFoot + vec3(0., 7., 0.) - vP; float dF = length(toF);
  col += alb * uBeamCol * (bIn * (max(dot(N, -uBeamDir), 0.) * 1.5 + .22 + .5 * max(N.y, 0.)) + (.7 * max(dot(N, toF / max(dF, 1e-3)), 0.) + .1) / (1. + dF * dF / 1300.));
  col += uLampCol * att * lip * (s32 * (.03 + .4 * wet * rib * (1. - .8 * thr) + .09 * thr * bulge) + s8 * spark * (.4 + wet) * 5.);
  float fr = 1. - abs(dot(N, V)); fr *= fr;
  col += uLampCol * (fr * fr * thr * thr * (.03 + .15 * bulge));                 // a thin rim where the rock turns out to the sky
  // the window in the roof: a ragged hole of moonlit sky with a lit throat round it
  float hd = length(vP.xz - uHole.xz) + (vn2(vP.xz * .23) - .5) * 5., hy = smoothstep(uHole.y - 20., uHole.y - 9., vP.y);
  col = mix(col, uBeamCol * (.55 + .35 * vn2(vP.xz * .7)), (1. - smoothstep(uBeamR * .8, uBeamR * 1.05, hd)) * hy);
  col += alb * uBeamCol * (.8 * hy * smoothstep(uBeamR * 2.4, uBeamR, hd) * smoothstep(uBeamR * .8, uBeamR * 1.05, hd));
#ifdef STAL
  {                                                                                  // wet: a highlight on the side turned to the roof window, brightest in the shaft and near its pool
    vec3 Lw = normalize(uHole - vP), Hw = normalize(Lw + V + vec3(0., 1e-4, 0.)); float nw = max(dot(N, Hw), 0.), w8 = nw * nw; w8 *= w8; w8 *= w8; float w32 = w8 * w8; w32 *= w32;
    col += uBeamCol * ((w32 * .5 + w8 * .05) * (.22 + .9 * bIn + .5 / (1. + dF * dF / 900.)) * (.5 + .5 * smoothstep(.7, .95, fract(vSt.y))) * max(dot(N, Lw), 0.));
  }
#endif
  vec3 fogged = caveFog(col, vP);
  gl_FragColor = vec4(mix(col, fogged, .5 + .5 * smoothstep(10., 48., dist)), 1.);      // the haze thins on rock a few metres off
}`,gn=`
attribute vec3 aRoot, aTarget; attribute vec4 aSeed;
uniform float uTime, uPx, uU; uniform vec3 uCam;
varying vec2 vQ; varying float vFly, vRnd; varying vec3 vP; varying vec4 vW;
void main(){
  float peel = min(aSeed.z, 1.), keyed = step(1.5, aSeed.z);
  float ph = mix(fract(uTime * .07 + aSeed.y), .36 + .64 * clamp((uU - aSeed.y) / .085, 0., 1.), keyed);
  float fly = peel * smoothstep(.5, .57, ph), k = peel * smoothstep(.5, .96, ph);
  float fade = 1. - peel * (smoothstep(.9, .97, ph) + (1. - keyed) * (1. - smoothstep(0., .06, ph)));
  vec3 mid = mix(aRoot + vec3(0., -7., 6.), mix(aRoot, aTarget, .4) + vec3(0., -11., 0.), keyed);
  vec3 p = mix(mix(aRoot, mid, k), mix(mid, aTarget, k), k);
  p += fly * vec3(sin(uTime * 2.3 + aSeed.x * 40.), cos(uTime * 1.9 + aSeed.x * 60.), 0.) * .5;
  float shiver = sin(uTime * 21. + aSeed.x * 60.) * (.02 + .09 * peel * smoothstep(.3, .5, ph)) * (1. - fly);
  vec3 toC = uCam - p; float dist = length(toC);
  vec3 R = normalize(cross(vec3(0., 1., 0.), toC) + vec3(1e-4, 0., 0.));
  vec3 Uf = normalize(cross(toC, R) + vec3(0., 1e-4, 0.));
  vec3 U = normalize(mix(vec3(0., 1., 0.), Uf, fly * .6));
  float sz = max(aSeed.w, dist * uPx * 1.3) * fade;
  vec2 q = position.xy;
  vec3 lp = p + R * (q.x * sz * mix(.5, 1.25, fly) + shiver) + U * ((q.y - 1. + fly) * sz * mix(1., .8, fly));
  float fp = uTime * 55. * (.9 + .2 * aSeed.x) + aSeed.x * 62.8, a1 = .12 + .78 * sin(fp), a2 = a1 - .25 + .65 * sin(fp - 1.1);
  vQ = q; vFly = fly; vRnd = aSeed.x; vP = lp; vW = vec4(sin(a1), sin(a2), cos(a1), cos(a2));
  gl_Position = projectionMatrix * modelViewMatrix * vec4(lp, 1.);
}`,yn=`
varying vec2 vQ; varying float vFly, vRnd; varying vec3 vP; varying vec4 vW; uniform vec3 uBat, uAmbCol;
${Me}${mn}
void main(){
  // hanging: a folded teardrop, feet up; flying: the beating wing line seen from behind
  float w = .26 + .6 * (1. - smoothstep(-.6, .9, vQ.y));
  float hang = 1. - smoothstep(.75, 1., length(vec2(vQ.x / max(w, .05), vQ.y * .98)));
  vec2 wb = batStroke(vQ, vW, vec3(1., .3, .07));
  float a = mix(hang, max(wb.x, wb.y), step(.5, vFly));
  if (a < .5) discard;
  float edge = smoothstep(.25, 1., abs(vQ.x) / max(w, .05)) * (1. - vFly);
  float att = lampAtt(vP);
  vec3 col = uBat * (.75 + .5 * vRnd) * (uBounce * 1.9 + uAmbCol * 1.2 + uLampCol * att * (.12 + .38 * edge));
  gl_FragColor = vec4(caveFog(col, vP) * mix(1., .8, vFly), 1.);
}`,wn=`
attribute vec3 aTop; attribute vec4 aD; attribute vec2 aS;
uniform float uTime, uPx; uniform vec3 uCam;
varying float vA, vX; varying vec3 vP;
void main(){
  float cyc = fract(uTime * aD.y / aD.x + aD.z), t = position.y;
  float fall = max(cyc * aD.x - t * aD.w * (.35 + cyc), 0.);
  vec3 p = aTop - vec3(0., fall, 0.);
  float fr = fall / aD.x, fan = aD.z * 6.2832 * 7.;
  p.xz += aS.y * (fr * sqrt(fr) * 9. * (.3 + .7 * fract(aD.z * 13.7))) * vec2(cos(fan), sin(fan));          // each thread leaves on its own line
  p.xz += aS.y * fr * vec2(sin(uTime * 1.1 - fall * .09 + aD.z * 3.), cos(uTime * .8 - fall * .07 + aD.z * 5.)) * 5.5;   // and the whole fall sways
  vec3 toC = uCam - p; float dist = length(toC);
  vec3 R = normalize(cross(vec3(0., 1., 0.), toC) + vec3(1e-4, 0., 0.));
  float wMin = dist * uPx * .85, w = max(aS.x * (1. + 7. * fr * aS.y), wMin);
  p += R * position.x * w;
  vA = mix(1. - t * .8, 4. * t * (1. - t), aS.y) * smoothstep(0., .04, cyc) * (1. - smoothstep(.93, 1., cyc)) * min(1., aS.x / max(wMin, 1e-4)) * smoothstep(1.2, 4., dist);
  vA *= .35 + .65 * fract(aD.z * 7.31);
  vA *= mix(1., (.3 + .7 * (.5 + .5 * sin(fall * .4 - uTime * 5. + aD.z * 40.))) * (1. - .55 * fr) * .5, aS.y);        // beads and thinning spray
  vX = position.x; vP = p;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
}`,xn=`
varying float vA, vX; varying vec3 vP; uniform float uGain;
${Me}
void main(){
  float a = vA * (1. - vX * vX);
  vec3 col = uLampCol * (lampAtt(vP) * .9 + .12) * uGain;
  float dist = length(vP - uCam);
  gl_FragColor = vec4(col * a * exp(-dist * uHazeK * .6), 1.);
}`,bn=`
attribute vec2 aUv; varying vec2 vUv; varying vec3 vP;
void main(){ vUv = aUv; vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,Mn=`
varying vec2 vUv; varying vec3 vP;
${ee}${Me}
void main(){
  float e = 1. - abs(vUv.x); e = smoothstep(0., .45, e);
  float rip = vn2(vec2(vUv.x * 3., vUv.y * .35 - uTime * .55)) * .6 + vn2(vec2(vUv.x * 7., vUv.y * 1.3 - uTime * 1.1)) * .4;
  float glint = smoothstep(.62, .9, rip);
  vec3 col = uLampCol * (.16 + .34 * rip + 1.5 * glint) * (.35 + .65 * lampAtt(vP));
  gl_FragColor = vec4(caveFog(col * e, vP), 1.);
}`,Uo=`
attribute vec3 aCol;
#ifdef TUFT
attribute vec3 iCol;
#endif
uniform float uTime;
varying vec3 vC, vN, vP;
void main(){
  vec3 p = position, n = normal, c = aCol;
#ifdef TUFT
  vec4 wp = instanceMatrix * vec4(position, 1.);
  mat3 im = mat3(instanceMatrix);
  n = normalize(im * (normal / vec3(dot(im[0], im[0]), dot(im[1], im[1]), dot(im[2], im[2]))) + vec3(0., 1e-4, 0.));
  vec3 org = instanceMatrix[3].xyz; float hgt = max(wp.y - org.y, 0.);
  float g = .5 + .5 * sin(dot(org.xz, vec2(.021, .013)) - uTime * .55);
  float sway = hgt * .045 * (.3 + g * g);
  wp.x += sin(uTime * 1.1 + org.z * .15 + hgt * .2) * sway; wp.z += cos(uTime * .9 + org.x * .13 + hgt * .17) * sway * .8;
  p = wp.xyz; c *= iCol;
#endif
  vC = c; vN = n; vP = p;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
}`,Sa=`
uniform float uCovA, uCovB, uAmp, uSheetY, uLayD, uMistGl; uniform vec2 uOffM; uniform vec3 uMistShade;
vec2 h22m(vec2 p){ vec3 q = fract(p.xyx * vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz) * q.zy); }
// cauliflower heads: round domes of unequal size on a jittered grid, 1 on a crown, 0 in the gaps between heads
float domeM(vec2 p){
  vec2 i = floor(p), f = fract(p); float h = 0.;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y)), o = h22m(i + g), r = g + .14 + .72 * o - f;
    float rad = .5 + .38 * fract(o.x * 7.13 + o.y * 3.71);
    h = max(h, 1. - dot(r, r) / (rad * rad));
  }
  return sqrt(max(h, 0.));
}
vec2 warpM(vec2 xz){ return xz + (vec2(vn2(xz * .011 + 3.), vn2(xz * .011 + 17.)) - .5) * 30.; }
float coverM(vec2 xz){
  vec2 q = xz * .013 + vec2(uTime * .006, uTime * .004) + uOffM;
  return smoothstep(uCovA, uCovB, vn2(q) * .55 + vn2(q * 2.3 + 7.) * .3 + vn2(q * 5.7 - uTime * .015) * .15);
}
// height of the cloud top above the sheet level in units of uAmp: slow swells only, which the mesh carries exactly
// and which keep the sheet clear above the canopy floor (k fades the smaller one with distance). The holes and
// the heads are drawn by the shading alone, so no edge of the sheet's or the canopy's triangles ever shows.
float mistH(vec2 xz, float k){
  return (vn2(xz * .0085 + uTime * .005 + 5.) - .5) * 1.7 + (vn2(xz * .023 - uTime * .007 + 11.) - .5) * 1.1 * k;
}
float mistK(float d){ return 1. - smoothstep(170., 520., d); }
`,zn=`
// 35 m heads carrying 13 m heads
float headsM(vec2 pa, vec2 pb, float kf){ float a = domeM(pa), b = domeM(pb); return a * (1. - .38 * kf) + b * .38 * kf * (.3 + .7 * a); }
// the cloud sea at xz, seen from d metres away: rgb = its colour, a = ragged cover, top = world height of its surface
vec4 mistLook(vec2 xz, float d, out float top){
  float cover = coverM(xz), h0 = mistH(xz, mistK(d));
  vec2 gd = normalize(uGlowDir.xz + vec2(1e-4, 0.)), w = warpM(xz);
  float kf = 1. - smoothstep(130., 480., d), kf2 = 1. - smoothstep(30., 140., d), kA = 1. - smoothstep(500., 1500., d);
  vec2 pa = w * .027 + uTime * vec2(.004, .003), pb = w * .074 - uTime * vec2(.006, .002) + 3., pc = w * .21 + uTime * vec2(.011, -.007);
  float hh = headsM(pa, pb, kf), h1 = headsM(pa + gd * .0675, pb + gd * .185, kf);
  float c = mix(.6, clamp(hh * (.8 + .2 * mix(1., domeM(pc), kf2)), 0., 1.), kA);   // 5 m florets on them, near only
  float lit = clamp(.5 - (h1 - hh) * 2.4 * kA, 0., 1.);                              // flanks turned to the glow
  float sw = vn2(xz * .0085 + uTime * .005 + 5.), k = smoothstep(.12, .85, c);
  vec3 col = mix(uMistCol * mix(uMistShade, vec3(1.), .35), uMistCol * (.5 + .14 * c), k) * (mix(.7, 1.1, smoothstep(.2, .8, lit)) * (.86 + .28 * sw));
  col += uGlowCol * (.15 * uMistGl * lit * lit * k);
  top = uSheetY + uAmp * h0 + (c - .5) * 5. * kA;                                   // what stands in it is cut off along the heads
  return vec4(col, smoothstep(.1, .42, cover * (.08 + 1.7 * c)));                   // edges scalloped by the heads
}`,Cs=`
// x = height 0..1 of the heads at p, yz = its slope
vec3 blobM(vec2 p){
  vec2 i = floor(p), f = fract(p), gr = vec2(0.); float s = 0.;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y)), o = h22m(i + g), r = g + .14 + .72 * o - f;
    float rad = .55 + .4 * fract(o.x * 7.13 + o.y * 3.71), v = max(1. - dot(r, r) / (rad * rad), 0.);
    s += v * v; gr += r * (4. * v / (rad * rad));
  }
  float e = exp(-1.6 * s);
  return vec3(1. - e, gr * (1.6 * e));
}
vec4 mistLayer(vec2 xz, float lay, float d){
  float kA = 1. - smoothstep(110., 340., d), kf = 1. - smoothstep(40., 170., d);       // far off the heads melt into one level sea
  vec2 w = warpM(xz), q = xz * .013 + vec2(uTime * .006, uTime * .004) + uOffM;
  float cn = vn2(q) * .62 + vn2(q * 2.3 + 7.) * .38;
  vec2 gd = normalize(uGlowDir.xz + vec2(1e-4, 0.));
  vec3 A = blobM(w * .027 + uTime * vec2(.004, .003)), B = blobM(w * .074 - uTime * vec2(.006, .002) + 3.);      // 37 m heads carrying 13 m heads
  float fl = vn2(w * .19 + uTime * vec2(.011, -.007)) * .6 + vn2(w * .43 - uTime * vec2(.013, .009) + 5.) * .4;   // soft curls, near only
  float kb = .34 * (.3 + .7 * A.x), h0 = A.x * (1. - .34) + B.x * kb + (fl - .5) * .2 * kf;
  vec2 gh = A.yz * (.027 * (1. - .34 + .24 * B.x)) + B.yz * (.074 * kb);                                         // slope of the heads, per metre
  float h = mix(.6, clamp(h0, 0., 1.), kA);
  float cov = smoothstep(uCovA, uCovB, cn + (h - .5) * .16 - lay * .02);          // torn holes, wider higher up, scalloped by the heads
  float t = .1 + .17 * lay;                                                       // the heads reach 0.75: a quarter of the sea carries the top layer
  float a = cov * (lay < .5 ? .46 + .44 * smoothstep(.05, .4, h) : .88 * smoothstep(t, t + .17, h));
  float lit = clamp(.5 - dot(gh, gd) * 9. * kA, 0., 1.);                          // flanks turned to the glow
  float up = smoothstep(.0, .6, h);
  vec3 col = mix(uMistCol * uMistShade * 1.05, uMistCol * (.5 + .17 * h), up) * mix(.46, 1.16, smoothstep(.2, .8, lit)) * (.94 + .06 * lay);
  col += uGlowCol * (.22 * uMistGl * lit * lit * up);
  return vec4(col, a);
}`,kn=`
attribute float aLay; varying vec3 vW; varying float vLay; uniform vec3 uCam; uniform float uTime;
${ee}${Sa}
void main(){
  vec4 w = modelMatrix * vec4(position, 1.);
  w.y += uAmp * mistH(w.xz, mistK(length(w.xz - uCam.xz)));
  vW = w.xyz; vLay = aLay; gl_Position = projectionMatrix * viewMatrix * w;
}`,Cn=`
varying vec3 vW; varying float vLay; uniform float uOp, uFogK, uTime; uniform vec3 uCam, uMistCol, uGlowCol, uFogCol, uGlowDir;
${ee}${Sa}${Cs}
void main(){
  vec3 d = vW - uCam; float dist = length(d);
  vec4 L = mistLayer(vW.xz, floor(vLay + .5), length(d.xz));
  float a = uOp * L.a * smoothstep(30., 90., vW.z) * (1. - smoothstep(1500., 2800., dist)) * smoothstep(3., 14., abs(d.y));
  if (a < .004) discard;
  float f = 1. - exp(-uFogK * uFogK * dist * dist);
  gl_FragColor = vec4(mix(L.rgb, uFogCol, f), a);
}`,An=`
varying vec3 vW;
void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,Pn=`
varying vec3 vW; uniform float uOp, uFogK, uTime; uniform vec3 uCam, uMistCol, uGlowCol, uFogCol;
${ee}
void main(){
  vec3 d = vW - uCam; float dist = length(d);
  vec2 q = vW.xz * vec2(.009, .03) + vec2(uTime * .012, uTime * .003);
  float n = vn2(q) * .5 + vn2(q * 2.7 + 3.) * .3 + vn2(q * 6.3 - uTime * .02) * .2;
  float a = uOp * smoothstep(.56, .82, n) * smoothstep(40., 110., vW.z) * (1. - smoothstep(500., 1300., dist)) * smoothstep(6., 22., abs(d.y));
  if (a < .004) discard;
  float f = 1. - exp(-uFogK * uFogK * dist * dist);
  gl_FragColor = vec4(mix(uMistCol * .56 + uGlowCol * .025, uFogCol, f), a);
}`,Eo=`
varying vec3 vC, vN, vP;
uniform float uTime, uMistOp, uFogK, uSoft; uniform vec3 uCam, uSkyCol, uGlowCol, uGlowDir, uMistCol, uFogCol, uVeil, uHazeFar;
#ifdef TUFT
#define TUFTK 1.7
#else
#define TUFTK 1.
#endif
#ifdef SCRUB
#define LS 7.
#else
#define LS 1.
#endif
${ee}${Sa}
#ifdef DEEP
${Cs}
#else
${zn}
#endif
// leaf clumps as cells: x = dome height (1 at a cell's centre, 0 in the gaps), yz = vector to that centre
vec3 clumps(vec2 p){
  vec2 i = floor(p), f = fract(p); float best = 9.; vec2 bd = vec2(0.);
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y)), o = vec2(h21(i + g), h21(i + g + 17.3));
    vec2 d = g + .15 + .7 * o - f; float l = dot(d, d);
    if (l < best) { best = l; bd = d; }
  }
  return vec3(1. - min(best * 1.6, 1.), bd);
}
void main(){
  vec3 Vv = uCam - vP; float dist = length(Vv); vec3 V = Vv / max(dist, 1e-3);
#ifdef SCRUB
  float lf = 1. - smoothstep(20., 130., dist), lf2 = 1. - smoothstep(5., 45., dist);
#else
  float lf = 1. - smoothstep(60., 400., dist), lf2 = 1. - smoothstep(16., 110., dist);
#endif
  vec3 N0 = normalize(vN + vec3(0., 1e-4, 0.)), q = vP * LS; float lift = 0.;
#ifndef TUFT
  N0 = normalize(mix(N0, vec3(0., 1., 0.), .8 * (1. - smoothstep(60., 230., dist))) + vec3(0., 1e-3, 0.));
#endif
#ifdef PLAIN
  vec3 N = N0; if (dot(N, V) < 0.) N = -N;
  vec3 alb = vC * (.8 + .4 * vn3(vP * 2.3));
#else
  // The cells are looked up through a warp, so no boundary between two leaf masses runs straight; within 45 m a
  // third octave draws the leaves themselves (sprays 0.4 m across: lit tops, dark gaps), which also frays the rim.
#ifdef SCRUB
  float lf3 = 0.;
#else
  float lf3 = 1. - smoothstep(9., 48., dist);
#endif
  vec2 wq = vec2(vn3(q * .42 + 3.), vn3(q * .42 + 23.)) - .5;
  vec2 wq2 = vec2(vn3(q * 1.37 + 11.), vn3(q * 1.37 + 41.)) - .5;                // and a finer one: the edge between two masses is a ragged line of leaves, never a straight crease
  vec2 cp = q.xz * .30 + vec2(q.y * .21, -q.y * .17) + wq * .6 + wq2 * .34;
  vec3 c1 = clumps(cp), c2 = clumps(cp * 2.9 + 3.1 + wq * .9), c3 = vec3(.6, 0., 0.);
  if (lf3 > 0.) c3 = clumps(cp * 8.7 + 7.7 + (vec2(vn3(q * 1.9 + 5.), vn3(q * 1.9 + 31.)) - .5) * .8);
  float ndv0 = abs(dot(N0, V));
#ifdef TUFT
  float rag = vn3(q * 1.1 + 7.) * .6 + vn3(q * 2.9) * .4;
  rag = mix(rag, rag * .6 + .55 * (1. - c3.x) + .25 * (1. - c2.x), .7 * lf3);
  if (ndv0 < rag * .66 * (.3 + .7 * lf)) discard;                            // ragged leafy silhouette
  if ((c2.x * .7 + c3.x * .5) * (.25 + ndv0) < .15 * lf3) discard;           // and close to, small holes between the sprays toward the rim
#endif
  float dome = mix(.6, c1.x, lf) * mix(1., .55 + .45 * c2.x, lf2) * mix(1., .5 + .62 * c3.x, lf3);
  vec3 N = normalize(N0 + vec3(-c1.y, 0., -c1.z) * (1.05 * lf) + vec3(-c2.y, 0., -c2.z) * (.7 * lf2) + vec3(-c3.y, 0., -c3.z) * (.75 * lf3)
    + (vec3(vn3(q * .33), vn3(q * .33 + 17.), vn3(q * .33 + 31.)) - .5) * .5
    + (vec3(vn3(q * 2.7 + 5.), vn3(q * 2.7 + 19.), vn3(q * 2.7 + 37.)) - .5) * (.9 * lf2) + vec3(0., 1e-4, 0.));
  float n = vn3(q * .2) * .5 + vn3(q * vec3(.55, .8, .55) + 5.) * .5;
  vec3 alb = vC * (.6 + .6 * n) * (.14 + .95 * dome) * (.88 + .3 * vn2(vP.xz * .03)) * TUFTK;
#ifndef TUFT
  {                                                                            // far off the forest floor is drawn as whole crowns 19 m across: moonlit tops, dark gaps
    float kc = smoothstep(120., 400., dist) * (1. - smoothstep(1100., 2200., dist));
    vec3 c0 = clumps(vP.xz * .052 + 3.3 + (vec2(vn2(vP.xz * .019), vn2(vP.xz * .019 + 9.)) - .5) * .9);
    alb *= mix(1., .42 + .95 * c0.x, kc);
    lift = (c0.x * 12. - 3.) * smoothstep(90., 260., dist);                    // and each of them stands that much out of the mist: pools between the crowns
    N = normalize(N + vec3(-c0.y, 0., -c0.z) * (1.5 * kc) + vec3(0., 1e-4, 0.));
  }
#endif
#endif
  float gust = .5 + .5 * sin(dot(vP.xz, vec2(.021, .013)) - uTime * .55); gust *= gust;
  alb *= 1. + .4 * gust * vn2(vP.xz * .06 + uTime * .12);                       // pale leaf backs as a gust band crosses
  float up = .5 + .5 * N.y, rim = .5 + .5 * dot(N, uGlowDir); rim *= rim;
  vec3 sky = mix(uSkyCol, vec3(dot(uSkyCol, vec3(.3333))), .35);
  float kd = max(dot(N, uGlowDir), 0.), lit = 1.;
  vec3 col = alb * (sky * (.2 + .8 * up * up) + uGlowCol * ((rim * rim * .9 + kd * sqrt(kd) * 1.3) * lit));
  float fr = 1. - abs(dot(N0, V)); fr *= fr;
  col += (alb * 1.4 + vC * .25) * uGlowCol * (fr * max(dot(N0, uGlowDir) + .2, 0.) * lit);    // warm edge on the glow side of each crown
  col = mix(vec3(dot(col, vec3(.3, .59, .11))), col, .74) * .86;
  float mz = smoothstep(30., 90., vP.z);                                        // the cave breathes the mist away from its mouth
#ifdef DEEP
  if (mz > 0.) {                                                                // the vapour between this point and the layer next above it
    float dH = length(vP.xz - uCam.xz), base = uSheetY + uAmp * mistH(vP.xz, mistK(dH)), lj = floor((vP.y - base) / uLayD);
    if (lj >= 0. && lj < 4.) {
      vec4 L = mistLayer(vP.xz, lj, dH);
      col = mix(col, L.rgb, L.a * mz * clamp((base + (lj + 1.) * uLayD - vP.y) / uLayD, 0., 1.));
    }
  }
#else
  if (mz > 0. && vP.y < uSheetY + uAmp * 2.3 + uSoft + 7.5) {
    float dM = length(vP.xz - uCam.xz), nb = 1. - smoothstep(25., 170., dM);
    float top; vec4 L = mistLook(vP.xz, dM, top);
    // near the lens a pool's edge is vapour: its level wanders by the metre, so it never follows a triangle of the floor
    top += ((vn2(vP.xz * .2 + uTime * .02) - .5) * 4. + (vn2(vP.xz * .63 - uTime * .03) - .5) * 1.8) * nb + (vn2(vP.xz * .07 + 9.) - .5) * 3.6 * (1. - nb);
#ifdef TUFT
    float sb = uSoft, op = uMistOp;                                             // crowns and trunks dissolve over a soft band
#else
    float sb = 2.5 + 3.2 * nb;                                                  // the canopy floor meets it along the heads, not along its own triangles
    // near the lens what lies well under the mist's top is one even shade under whole vapour: no cell of the floor shows through it
    float dk = smoothstep(.5, 6., top - vP.y - lift) * nb, op = mix(uMistOp, 1., dk);
    col = mix(col, uFogCol * 1.5, .85 * dk);
#endif
    float m = (1. - smoothstep(top - sb * .35, top + sb, vP.y + lift)) * op * mz * (.05 + .95 * L.a);
    col = mix(col, L.rgb * (.55 + .45 * lit), m);                                                   // sinking into the cloud sea over a soft band
  }
#endif
  float f = 1. - exp(-uFogK * uFogK * dist * dist);
  col = mix(mix(col, uFogCol, f), uHazeFar, .9 * (1. - exp(-max(dist - 250., 0.) * .0021)));      // far off the forest goes into pale haze before the hills
  gl_FragColor = vec4(col + uVeil * (1. - exp(-max(vP.z, 0.) * .014)), 1.);
}`,Sn=`
varying float vT;
void main(){ vT = uv.y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,Fn=`
varying float vT; uniform vec3 uHazeFar; uniform float uOp;
void main(){ float a = 1. - smoothstep(0., 1., vT); gl_FragColor = vec4(uHazeFar, a * sqrt(max(a, 0.)) * uOp * smoothstep(0., .08, vT)); }`,qn=`
attribute vec3 aP; attribute vec2 aR;
uniform float uTime, uPx, uFogK; uniform vec3 uCam;
varying vec2 vQ; varying float vB;
void main(){
  vec3 p = aP + vec3(sin(uTime * .7 + aR.x * 40.), sin(uTime * .9 + aR.x * 70.), cos(uTime * .6 + aR.x * 50.)) * .45;
  float dist = length(uCam - p);
  float ph = uTime * 3.3 - dot(aP.xz, vec2(.013, .021)) + (aR.y - .5) * .9;
  float b = max(sin(ph), 0.); b *= b; b *= b;
  float px = dist * uPx, sz = clamp(max(.5, px * 3.), .5, 3.4);                 // never under two pixels, never a big disc
  vec4 mv = viewMatrix * vec4(p, 1.); mv.xy += position.xy * sz;
  vQ = position.xy;
  vB = (.06 + .94 * b) * (.4 + .6 * aR.y) * smoothstep(4., 12., dist) * min(1., (.5 / sz) * (.5 / sz) * 4.) * exp(-uFogK * uFogK * dist * dist);
  gl_Position = projectionMatrix * mv;
}`,Tn=`
varying vec2 vQ; varying float vB; uniform vec3 uFlyCol;
void main(){
  float d = dot(vQ, vQ), a = exp(-d * 6.) * (1. - smoothstep(.55, 1., d));
  gl_FragColor = vec4(uFlyCol * (vB * a), 1.);
}`,Fa=`
attribute vec3 aCol;
#ifdef FIN
attribute vec2 aLH;
#endif
varying vec3 vC, vN, vP; varying vec4 vF;
void main(){
  vec3 p = position, n = normal;
#ifdef FIN
  vec4 wp = instanceMatrix * vec4(position, 1.); mat3 im = mat3(instanceMatrix);
  n = normalize(im * (normal / vec3(dot(im[0], im[0]), dot(im[1], im[1]), dot(im[2], im[2]))) + vec3(0., 1e-4, 0.));
  p = wp.xyz; vF = vec4(aLH.x + instanceMatrix[3].x * .37, 0., 1., 0.);
#else
  vF = vec4(p.x, p.z, abs(n.z) + .02, abs(n.x) + .02);
#endif
  vC = aCol; vN = n; vP = p;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
}`,qa=`
varying vec3 vC, vN, vP; varying vec4 vF;
uniform float uTime, uMistYR, uMistOpR, uFogK, uRimN; uniform vec3 uCam, uSkyCol, uGlowCol, uGlowDir, uMistCol, uFogCol, uMoss, uVeil;
${ee}
float flute(vec2 p){ return abs(vn2(p) * 2. - 1.); }
// distance to the nearest cell wall: the cracks of a limestone pavement
float cellEdge(vec2 p){
  vec2 i = floor(p), f = fract(p); float d1 = 9., d2 = 9.;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y)), o = vec2(h21(i + g), h21(i + g + 17.3));
    vec2 d = g + .1 + .8 * o - f; float l = dot(d, d);
    if (l < d1) { d2 = d1; d1 = l; } else if (l < d2) d2 = l;
  }
  return sqrt(d2) - sqrt(d1);
}
void main(){
  vec3 Vv = uCam - vP; float dist = length(Vv); vec3 V = Vv / max(dist, 1e-3);
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.)); if (dot(N, V) < 0.) N = -N;
  vec3 Ng = N;
  float steep = 1. - smoothstep(.45, .82, N.y), nk = 1. - smoothstep(70., 380., dist), nk2 = 1. - smoothstep(12., 80., dist);
  // every pattern is dropped before it gets thinner than about 3 px: 2 m runnels by 400 m, 1 m flutes by 80 m
  float nkB = 1. - smoothstep(110., 400., dist), nkC = 1. - smoothstep(22., 80., dist);
  float y = vP.y, ws = vF.z + vF.w, flat1 = 1. - steep, fw = 0.;
#ifndef FIN
  fw = 1.7 * vn2(vec2((vF.x * vF.z + vF.y * vF.w) / ws * .045, y * .06));                                // on the bedded face the runnels wander and lean: none stands plumb
#endif
  float flx = flute(vec2(vF.x * .5 + fw, y * .03)), flz = flute(vec2(vF.y * .5 + 7. + fw, y * .03));               // 2 m runnels
  float fbx = flute(vec2(vF.x * 1.1 + 3. + fw * 2., y * .07)), fbz = flute(vec2(vF.y * 1.1 + 11. + fw * 2., y * .07));       // 1 m flutes, close up only
  float fl = mix(.5, (flx * vF.z + flz * vF.w) / ws, nkB), fb = mix(.5, (fbx * vF.z + fbz * vF.w) / ws, nkC);
  float bed = 0., ledge = 0., fa = .57, joint = 0., crackM = 0., pit = 0., course = 1.;
#ifdef FIN
  float crack = (1. - smoothstep(0., .3, fl)) * steep, crackB = (1. - smoothstep(0., .3, fb)) * steep * nk;
#ifdef BLOCK
  crack *= .2; crackB *= .5;
#endif
#else
  // bedded face: the ledges are in the mesh (beds 7 to 24 m thick that dip, roll and wander with the same three
  // sines, each ledge dying out into plain face for stretches); here each gets a dark undercut below its lip, broken
  // along its length, and a mossy top. Down the face run broad flutes 9 m across, which carry at any distance, with
  // runnels and small flutes inside them close up, in broken stretches; their flanks turn to and from the glow.
  float nk3 = 1. - smoothstep(250., 800., dist);
  float hc = (vF.x * vF.z + vF.y * vF.w) / ws;
  float dip = 2.2 * sin(vP.x * .013 + vP.z * .007) + 1.2 * sin(vP.x * .041 - vP.z * .02 + 1.7) + .9 * sin(vP.x * .097 + vP.z * .043 + .4);
  float wv = y + dip + 2.6 * sin((y + dip) * .21 + .7), bq = wv / 11., bf = fract(bq), bi = floor(bq);
  bed = smoothstep(.77 + .08 * vn2(vec2(hc * .06, bi * 1.9)), .87, bf) * steep * nk3 * smoothstep(.38, .6, vn2(vec2(hc * .03 + bi * 7.3, bi * 3.1))) * (.4 + .6 * smoothstep(.3, .6, vn2(vec2(hc * .11 + bi * 3.7, bi * 5.3))));   // deep here, gone there
  ledge = (1. - smoothstep(.1, .3, bf)) * smoothstep(40., 52., y);
  // the middle range, 40 to 300 m: every bed is four courses parted by thin dark joints, the courses cut into blocks
  // by upright cracks that are staggered from course to course, the blocks pitted. Joints and cracks keep a width
  // of about 3 px, so they neither vanish nor shimmer; all of it is gone by 420 m.
  float nkM = (1. - smoothstep(240., 420., dist)) * steep, hw = max(.07, dist * .0022), farM = 1. - .5 * smoothstep(110., 300., dist);
  float cy = wv / 3.1 + 1.3 * vn2(vec2(hc * .028, y * .05)), cf = fract(cy), crs = floor(cy), cj = min(cf, 1. - cf) * 3.1, crs2 = floor(cy * .5 + .25);
  float jr = crs + step(.5, cf);
  joint = (1. - smoothstep(hw * .6, hw * 1.4, cj)) * nkM * farM * smoothstep(.5, .62, vn2(vec2(hc * .05 + jr * 5.1, jr * 1.3)));      // short lengths of joint, most of each course without one
  float ce = cellEdge(vec2(hc * .075 + h21(vec2(crs2, 9.1)) * 7., crs2 * 1.7)) / .15;       // a crack every 13 m or so, as wide as 3 px
  crackM = (1. - smoothstep(hw * 1.3, hw * 2.6, ce)) * nkM * (1. - .5 * bed) * smoothstep(.35, .6, vn2(vec2(hc * .04 + 7., wv * .05)));
  float seg = smoothstep(.44, .62, vn2(vec2(hc * .07 + 3., wv * .09)));                                     // runnels come in patches a bed or two tall, the face between them massive
  float stainV = smoothstep(.5, .8, vn2(vec2(hc * .06 + 2., wv * .008)));                                  // long seeps
  pit = smoothstep(.5, .78, vn3(vP * vec3(.6, .9, .6) + 3.)) * nkM * (1. - smoothstep(90., 260., dist) * .6);
  course = mix(1., .84 + .3 * h21(vec2(crs, 5.3)) * (.5 + .5 * vn2(vec2(hc * .12, crs))), nkM);
  float run = smoothstep(.34, .6, vn2(vec2(hc * .028 + 9., y * .035)));                                    // fluted stretches and massive ones
  float crack = (1. - smoothstep(0., .16 + dist * .004, fl)) * steep * (.25 + .75 * run) * mix(1., .45, smoothstep(30., 160., dist)) * seg;
  float crackB = (1. - smoothstep(0., .2, fb)) * steep * (.4 + .6 * run) * .7 * (.3 + .7 * seg);
  float fax = flute(vec2(vF.x * .11 + 1., y * .01)), faz = flute(vec2(vF.y * .11 + 5., y * .01));
  fa = (fax * vF.z + faz * vF.w) / ws;
  float dx0 = flute(vec2((vF.x + 1.5) * .11 + 1., y * .01)) - fax, dz0 = flute(vec2((vF.y + 1.5) * .11 + 5., y * .01)) - faz;
  float dx1 = (flute(vec2((vF.x + .5) * .5 + fw, y * .03)) - flx) * nkB * (.3 + .7 * seg), dz1 = (flute(vec2((vF.y + .5) * .5 + 7. + fw, y * .03)) - flz) * nkB * (.3 + .7 * seg);
  float dx2 = (flute(vec2((vF.x + .25) * 1.1 + 3. + fw * 2., y * .07)) - fbx) * nkC, dz2 = (flute(vec2((vF.y + .25) * 1.1 + 11. + fw * 2., y * .07)) - fbz) * nkC;
  vec3 G = vec3((dx0 * 3. + dx1 * 2. + dx2 * 2.) * vF.z, 0., (dz0 * 3. + dz1 * 2. + dz2 * 2.) * vF.w) / ws;   // slope of the flutes along the face
  N = normalize(N - (G - N * dot(G, N)) * (1.5 * steep) + vec3(0., -bed * .7 - joint * .45, 0.) + vec3(0., 1e-4, 0.));
#endif
  float grike = max(1. - smoothstep(0., .07, cellEdge(vP.xz * .16)), (1. - smoothstep(0., .09, cellEdge(vP.xz * .47 + 5.))) * nk2 * .8) * flat1 * nk;   // cracks of the pavement on top
  float grain = vn3(vP * 1.3) * .5 + vn3(vP * 4.7) * .5, blotch = vn3(vP * .12);
  vec3 alb = vC * (.62 + .5 * fl * steep + .3 * flat1) * (.8 + .35 * fa * steep + .2 * flat1) * (.8 + .4 * blotch) * (1. + .4 * (grain - .5) * nk2);
#ifdef FIN
  alb *= (1. - .6 * crack) * (1. - .45 * crackB) * (1. - .7 * grike);
#else
  alb *= (1. - .85 * crack) * (1. - .5 * crackB) * (1. - .66 * bed) * (1. + .2 * ledge) * (1. - .7 * grike) * (1. - .36 * joint) * (1. - .16 * crackM) * (1. - .3 * pit) * course * (1. - .28 * stainV * steep);
#endif
  float moss = flat1 * smoothstep(.52, .72, vn2(vP.xz * .06 + 3.) * .7 + vn2(vP.xz * .31) * .3) * .9 + ledge * flat1 * .55 * smoothstep(.3, .6, vn2(vP.xz * .11 + y * .05));
  alb = mix(alb, uMoss * (.5 + .9 * vn2(vP.xz * .7) * (.6 + .8 * grain)), clamp(moss, 0., .9));
  float up = .5 + .5 * N.y, key = max(dot(N, uGlowDir), 0.), wr = .5 + .5 * dot(N, uGlowDir);
  float rib = mix(1., .35 + 1.5 * fb * (.4 + .6 * fl), steep);
  vec3 sky = mix(uSkyCol, vec3(dot(uSkyCol, vec3(.3333))), .4);
  vec3 col = alb * (sky * (.3 + .7 * up) * mix(.8, 1.15, steep) * mix(1., .6 + .6 * fb, steep) + mix(uGlowCol, vec3(dot(uGlowCol, vec3(.3333))), .3) * (key * sqrt(key) * .8 + wr * wr * .1) * rib);
  float fr = 1. - max(dot(mix(Ng, N, .4), V), 0.); fr *= fr * fr;
  col += alb * uGlowCol * (fr * wr * wr * uRimN);                               // the moon's silver on every edge turned toward it
  float mn = vn2(vP.xz * .011 + vec2(uTime * .012, uTime * .008));
  float m = 1. - smoothstep(uMistYR - 4. + 8. * mn, uMistYR + 12. + 8. * mn, vP.y);
  col = mix(col, uMistCol * (.5 + .16 * mn), m * uMistOpR);                      // the foot of the ridge stands in mist
  float f = 1. - exp(-uFogK * uFogK * dist * dist);
  float mcap = dot(uMistCol, vec3(.3, .59, .11)) * .92, mkn = .55 * mcap, mlum = max(dot(col, vec3(.3, .59, .11)), mkn);
  col *= clamp((mkn + (mcap - mkn) * (1. - exp(-(mlum - mkn) / max(mcap - mkn, 1e-4)))) / max(mlum, 1e-4), 0., 1.);
  gl_FragColor = vec4(mix(col, uFogCol, f) + uVeil * (1. - exp(-max(vP.z, 0.) * .014)), 1.);
}`,Rn=`
attribute vec3 aCol, aTw; attribute vec2 aRd; varying vec3 vC, vN, vP, vT; varying vec2 vR;
void main(){ vC = aCol; vN = normal; vP = position; vT = aTw; vR = aRd; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,Nn=`
varying vec3 vC, vN, vP, vT; varying vec2 vR;
uniform float uTime, uMistYR, uMistOpR, uFogK, uRimN; uniform vec3 uCam, uSkyCol, uGlowCol, uGlowDir, uMistCol, uFogCol, uMoss, uVeil;
${ee}
float tri(float x){ return abs(fract(x) * 2. - 1.); }
// the face at q (metres along it, metres up it): x = how far it stands out, in metres; y = how open it is to the sky
// (1 on a rib or a proud block, less in a runnel, a joint, a pit or a hole where a block fell out)
vec2 relief(vec2 q, float ph, float k1, float k2){
  float run = smoothstep(.3, .62, vn2(vec2(q.x * .021 + ph, q.y * .016)));                 // fluted stretches and massive ones
  float f1 = tri(q.x * .29 + ph * 3. + (vn2(vec2(q.x * .06, q.y * .022 + ph)) - .5) * 1.5); f1 = f1 * f1 * (3. - 2. * f1);      // runnels 3.4 m apart
  float f2 = tri(q.x * .83 + ph * 5. + (vn2(vec2(q.x * .15, q.y * .05 + ph)) - .5) * 1.2);                                        // and 1.2 m apart, close to
  float cy = q.y * .16 + ph + (vn2(vec2(q.x * .03, q.y * .05)) - .5) * .9, row = floor(cy);
  float cx = q.x * .2 + h21(vec2(row, ph)) * 7., col = floor(cx);
  vec2 f = vec2(fract(cx), fract(cy));
  float hb = h21(vec2(col, row) + ph), proud = (hb - .45) * 1.5;                          // -0.7 (fallen out) .. 0.8 (standing proud)
  float e = min(min(f.x, 1. - f.x) * 5., min(f.y, 1. - f.y) * 6.2), bev = smoothstep(0., .9, e);
  float mass = 1. - .75 * run;
  float pit = smoothstep(.62, .82, vn2(q * vec2(.21, .15) + ph * 9.));
  float h = (f1 * .9 * run + proud * bev * mass - pit * .7) * k1 + (f2 * .28 * (.4 + .6 * run) + (vn2(q * .9 + ph) - .5) * .5) * k2;
  float opn = mix(1., (.55 + .45 * f1), run * k1) * mix(1., (.62 + .38 * bev) * (1. + .3 * proud), mass * k1) * (1. - .5 * pit * k1) * mix(1., .75 + .25 * f2, k2);
  return vec2(h, opn);
}
void main(){
  vec3 Vv = uCam - vP; float dist = length(Vv); vec3 V = Vv / max(dist, 1e-3);
  vec3 Ng = normalize(vN + vec3(0., 1e-4, 0.)); if (dot(Ng, V) < 0.) Ng = -Ng;
  float steep = 1. - smoothstep(.5, .86, Ng.y), flat1 = 1. - steep;
  float k1 = (1. - smoothstep(170., 520., dist)) * steep, k2 = (1. - smoothstep(30., 110., dist)) * steep;
  vec2 q = vec2(vT.x, vP.y); float ph = vT.y, ao = vT.z;
  float e1 = max(.4, dist * .0045);                                                          // never finer than about two pixels
  vec2 r0 = relief(q, ph, k1, k2), rs = relief(q + vec2(e1, 0.), ph, k1, k2), ry = relief(q + vec2(0., e1), ph, k1, k2);
  vec3 Th = normalize(cross(vec3(0., 1., 0.), Ng) + vec3(1e-4, 0., 0.)), Tv = cross(Ng, Th);    // Th runs against the metres round the tower
  vec3 N = normalize(Ng + (Th * (rs.x - r0.x) - Tv * (ry.x - r0.x)) * (1.15 / e1) + vec3(0., 1e-4, 0.));
  float stain = vn2(vec2(q.x * .13 + ph * 2., q.y * .012)), stain2 = vn2(vec2(q.x * .45, q.y * .03 + ph));
  float grain = vn3(vP * 1.3) * .5 + vn3(vP * 4.7) * .5;
  vec3 alb = vC * (.6 + .6 * stain) * (.84 + .3 * stain2 * k1) * (1. + .35 * (grain - .5) * k2);
  alb = mix(alb, alb * vec3(.48, .55, .55), smoothstep(.55, .8, vn2(vec2(q.x * .05 + 9., q.y * .009 + ph))) * .7 * steep);      // long dark stains where water runs down
  float moss = flat1 * smoothstep(.3, .6, vn2(vP.xz * .09 + 3.) * .6 + vn2(vP.xz * .31) * .4 + .25) + steep * ao * .35 * smoothstep(.4, .7, vn2(vec2(q.x * .2, q.y * .1)));
  alb = mix(alb, uMoss * (.5 + .9 * vn2(vP.xz * .7) * (.6 + .8 * grain)), clamp(moss, 0., .9));
  float opn = r0.y * (1. - .55 * ao);
  // Night light on limestone: the sky's blue from above, brighter from the moon's half of it, so the ribs between
  // runnels and the faces of proud blocks stand out of their own shade; the pale mist's light from below under the
  // lips; the moon itself only on faces turned to it. The silver rim follows the tower's own round (vR), not the
  // relief, so it draws the edge of the mass and not every runnel.
  vec3 Lh = normalize(vec3(uGlowDir.x, 0., uGlowDir.z) + vec3(1e-4, 0., 0.));
  float up = .5 + .5 * N.y, side = .5 + .5 * dot(N, Lh), key = max(dot(normalize(mix(Ng, N, .45)), uGlowDir), 0.);
  vec3 sky = mix(uSkyCol, vec3(dot(uSkyCol, vec3(.3333))), .4);
  vec3 col = alb * (sky * ((.26 + .5 * up) * (.55 + .9 * side * side) * opn)
    + uMistCol * ((.2 + .5 * max(.3 - N.y, 0.)) * (1. - smoothstep(60., 150., vP.y)) * opn)
    + mix(uGlowCol, vec3(dot(uGlowCol, vec3(.3333))), .3) * (key * .55 * (.45 + .55 * opn)));
  vec3 Nr = normalize(mix(Ng, vec3(vR.x, 0., vR.y), steep) + vec3(0., 1e-4, 0.));
  float fr = 1. - max(dot(Nr, V), 0.); fr *= fr; fr *= fr;
  col += alb * uGlowCol * (fr * smoothstep(-.25, .55, dot(Nr, Lh)) * (.5 + .5 * opn) * uRimN * .5);
  float mn = vn2(vP.xz * .011 + vec2(uTime * .012, uTime * .008));
  float m = 1. - smoothstep(uMistYR - 4. + 8. * mn, uMistYR + 12. + 8. * mn, vP.y);
  col = mix(col, uMistCol * (.5 + .16 * mn), m * uMistOpR);                      // the foot stands in mist
  float f = 1. - exp(-uFogK * uFogK * dist * dist);
  float mcap = dot(uMistCol, vec3(.3, .59, .11)) * .92, mkn = .55 * mcap, mlum = max(dot(col, vec3(.3, .59, .11)), mkn);
  col *= clamp((mkn + (mcap - mkn) * (1. - exp(-(mlum - mkn) / max(mcap - mkn, 1e-4)))) / max(mlum, 1e-4), 0., 1.);
  gl_FragColor = vec4(mix(col, uFogCol, f) + uVeil * (1. - exp(-max(vP.z, 0.) * .014)), 1.);
}`,Bn=`
attribute vec3 aP, aF; attribute vec4 aSeed;
uniform float uPx;
varying vec2 vQ, vWs; varying vec3 vS, vPw; varying float vA;
${Me}
void main(){
  vec3 F = normalize(aF + vec3(0., 0., 1e-4));
  vec3 toC = uCam - aP; float dist = length(toC); vec3 Vd = toC / max(dist, 1e-3);
  vec3 R0 = normalize(cross(vec3(0., 1., 0.), F) + vec3(1e-4, 0., 0.)), U0 = cross(F, R0);
  float roll = .9 * sin(uTime * 1.6 + aSeed.x * 40.) + .45 * sin(uTime * 3.7 + aSeed.w * 90.);
  vec3 Rb = R0 * cos(roll) + U0 * sin(roll), Ub = cross(F, Rb);
  vec3 A2 = normalize(cross(Vd, Rb) + vec3(0., 1e-3, 0.)); if (dot(A2, Ub) < 0.) A2 = -A2;
  float k = clamp(dist * uPx * 4.2, 1., 3.8), hs = .62 * abs(aSeed.y) * k;
  vec3 lp = aP + (Rb * position.x + A2 * position.y) * hs;
  float gl = smoothstep(.1, .6, sin(uTime * 2.3 + aSeed.z * 30.));
  float fl = sin(uTime * 75. * (.9 + .2 * aSeed.w) + aSeed.w * 62.8) * (1. - gl);
  vWs = vec2(.12 + .42 * fl, -.3 + .22 * fl);                                    // slope of the arm, slope of the hand: tips bowed down
  vQ = position.xy; vPw = lp;
  vS = vec3(dot(Ub, A2), dot(F, A2), clamp(1.5 * dist * uPx / hs, .03, .3));
  vA = smoothstep(1.2, 2.6, dist) * step(.5, aSeed.y) / pow(k, .4);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(lp, 1.);
}`,Ln=`
varying vec2 vQ, vWs; varying vec3 vS, vPw; varying float vA; uniform vec3 uSwRim, uAmbCol;
${Me}
// q: x along the span (-1..1), y across it; W: slopes of arm and hand; S: (bird up . quad up, heading . quad up,
// least half thickness). Returns (cover, rim along the upper edge).
vec2 swift(vec2 q, vec2 W, vec3 S){
  float ax = abs(q.x), x1 = min(ax, .28), x2 = max(ax - .28, 0.);
  float fh = W.x * x1 + W.y * x2 * (1. + .7 * x2);                               // the wing line seen from behind: a scythe
  float sweep = .1 - .62 * ax * ax;                                              // and from above: tips swept back
  float hc = .17 * pow(max(1. - ax, 0.), .75) * (1. + .5 * exp(-ax * 9.));       // half chord, down to a point at the tip
  float sy = abs(S.y), yc = S.x * fh + S.y * sweep;
  float th = max(sy * hc, S.z * (.3 + .7 * (1. - ax))) * (1. - smoothstep(.86, 1., ax)), e = S.z * .7 + .012;
  float d = abs(q.y - yc);
  float wing = 1. - smoothstep(th - e, th + e, d);
  vec2 bq = vec2(q.x, q.y - S.y * .03) / vec2(.06 + S.z * .5, max(.3 * sy, .07) + S.z * .5);
  float body = 1. - smoothstep(.6, 1., dot(bq, bq));
  float yh = q.y * sign(S.y + 1e-4), tq = (-yh - .2 * sy) / max(.26 * sy, 1e-3);    // 0 at the rump, 1 at the tail's tips
  float tw = .022 + .05 * clamp(tq, 0., 1.);
  float tail = step(0., tq) * step(tq, 1.) * (1. - smoothstep(tw - e * .6, tw + e * .6, ax)) * smoothstep(-.2, .5, ax / tw - (tq - .45)) * step(.25, sy);
  float rim = wing * smoothstep(-.2, .9, (q.y - yc) / max(th, 1e-3)) * (1. - body);
  return vec2(max(max(wing, body), tail), rim);
}
void main(){
  vec2 sw = swift(vQ, vWs, vS);
  float a = sw.x * vA;
  if (a < .02) discard;
  float dS = length(vPw - uCam), nearS = 1. - smoothstep(12., 55., dS);                 // far off a bird is a dark scythe on the keyhole; close to, it is a grey-brown bird in the cave's light
  vec3 col = vec3(.006, .006, .01) + vec3(.05, .047, .047) * (uBounce * 1.5 + uAmbCol) * nearS + uSwRim * (sw.y * (.3 - .08 * nearS));
  col += uBeamCol * (beamIn(vPw) * (.05 + .5 * sw.y));                           // and they flash as they cross the shaft
  gl_FragColor = vec4(caveFog(col, mix(uCam, vPw, .45)), a);            // less of the cave's haze than their distance asks, so the string holds its dark on the keyhole
}`,Dn=`
varying vec3 vP;
void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,Kn=`
varying vec3 vP; uniform vec3 uAirCol; uniform float uAirK;
${Me}
void main(){
  vec3 d = vP - uCam; float dist = length(d); vec3 v = d / max(dist, 1e-3);
  vec3 oL = uCam - uLampPos; float dl = length(oL); vec3 toM = -oL / max(dl, 1e-3);
  float b = dot(oL, v), H = sqrt(max(dot(oL, oL) - b * b, 0.) + 4900.);
  float air = (1.5708 - atan(b / H)) * 70. / (3.1416 * H);
  vec3 e1 = normalize(cross(toM, vec3(0., 1., 0.)) + vec3(1e-4, 0., 0.)), e2 = cross(e1, toM);
  vec2 sp = vec2(dot(v, e1), dot(v, e2)); sp /= max(length(sp), 1e-3);
  float rays = nC(sp * 3.5 + uTime * .05) * .6 + nC(sp * 8. - uTime * .07 + 5.) * .4;
  float g = uAirK * (.16 + .84 * air * air * (.7 + .6 * rays)) * smoothstep(8., 46., vP.y);
  gl_FragColor = vec4(uAirCol * g, 1.);
}`,Gn=`
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,Vn=`
varying vec2 vUv; uniform float uTime, uFlash, uMode; uniform vec3 uCol;
${ee}
void main(){
  vec2 c = vUv * 2. - 1.;
  if (uMode < .5) {                                  // rain curtain: slanted streaks, dense at the top
    float s = vn2(vec2(vUv.x * 46. + vUv.y * 5., vUv.y * 2.5 + uTime * .35)) * .6 + vn2(vec2(vUv.x * 9., vUv.y + uTime * .1)) * .4;
    float a = smoothstep(.25, .8, s) * (1. - c.x * c.x) * smoothstep(0., .25, vUv.y) * (.35 + .65 * vUv.y);
    gl_FragColor = vec4(uCol, a * .55);
  } else {                                           // sheet lightning: a glow inside the cloud
    float r = dot(c, c), g = max(1. - r, 0.); g *= g;
    float n = .6 + .4 * vn2(vUv * 5. + 3.);
    gl_FragColor = vec4(uCol * (uFlash * g * n), 1.);
  }
}`,As=D=>{const lt=Math.sin(D*127.1+311.7)*43758.5453;return lt-Math.floor(lt)};function In(D){const X=Math.floor(D/3.4),mt=D-(X*3.4+As(X)*.8);return mt<0||As(X+77.7)<.25?0:mt<.12?mt/.12:Math.exp(-(mt-.12)/.4)}function ft(){const D=[],lt=[],X=[];return{pos:D,col:lt,idx:X,v(mt,nt,tt,et,ut=1){return D.push(mt,nt,tt),lt.push(et.r*ut,et.g*ut,et.b*ut),D.length/3-1},quad(mt,nt,tt,et){X.push(mt,nt,tt,nt,et,tt)},grid(mt,nt,tt){for(let et=0;et<nt-1;et++)for(let ut=0;ut<tt-1;ut++){const at=mt+et*tt+ut;X.push(at,at+tt,at+1,at+1,at+tt,at+tt+1)}},gridUp(mt,nt,tt){for(let et=0;et<nt-1;et++)for(let ut=0;ut<tt-1;ut++){const at=mt+et*tt+ut;X.push(at,at+1,at+tt,at+1,at+tt+1,at+tt)}},build(){const mt=new N.BufferGeometry,nt=new Float32Array(D),tt=nt.length,et=new Float32Array(tt),ut=tt/3>65535?new Uint32Array(X):new Uint16Array(X);for(let at=0;at<ut.length;at+=3){const yt=ut[at]*3,Dt=ut[at+1]*3,Ot=ut[at+2]*3,co=nt[Ot]-nt[Dt],fo=nt[Ot+1]-nt[Dt+1],He=nt[Ot+2]-nt[Dt+2],oe=nt[yt]-nt[Dt],ze=nt[yt+1]-nt[Dt+1],st=nt[yt+2]-nt[Dt+2],j=fo*st-He*ze,$=He*oe-co*st,Wt=co*ze-fo*oe;et[yt]+=j,et[yt+1]+=$,et[yt+2]+=Wt,et[Dt]+=j,et[Dt+1]+=$,et[Dt+2]+=Wt,et[Ot]+=j,et[Ot+1]+=$,et[Ot+2]+=Wt}for(let at=0;at<tt;at+=3){const yt=Math.hypot(et[at],et[at+1],et[at+2])||1;et[at]/=yt,et[at+1]/=yt,et[at+2]/=yt}return mt.setAttribute("position",new N.BufferAttribute(nt,3)),mt.setAttribute("aCol",new N.BufferAttribute(new Float32Array(lt),3)),mt.setAttribute("normal",new N.BufferAttribute(et,3)),mt.setIndex(new N.BufferAttribute(ut,1)),mt}}}var _n={id:"deer-cave-exodus",name:"Three Million Wings",category:"wilderness",weirdness:.05,media:["interior","air"],async build(D){const lt=D.rng,X=D.noise,mt=D.vary||{},nt=D.quality?.detail??1,tt=Go(Vo("deer-cave-extra:"+D.seed)),et=Go(Vo("deer-cave-r8:"+D.seed)),ut=Go(Vo("deer-cave-r9:"+D.seed)),at=Go(Vo("deer-cave-r10:"+D.seed)),yt=lt.fork("look"),Dt=yt(),Ot=yt(),co=yt(),fo=yt(),He=!!mt.rare,oe=Lt(mt.density??1,.7,1.3),ze=Ot<.5?"clear":Ot<.78?"mist":"thunder",st=ze==="mist",j={...vn,...pn[ze]},$=new N.Scene,Wt=_(j.fog),ke=_(j.mist).multiplyScalar(j.mistI);st&&Wt.lerp(ke,.35),$.fog=new N.FogExp2(Wt,j.fogK*(st?1.25:1)),$.background=Wt.clone().multiplyScalar(.5);const Ta=j.moonAz+yt.range(-2,2)*.5,Ps=j.moonEl+yt.range(-1,1)*.6;await D.yield();const fe=cn({rng:lt,renderer:D.renderer,preset:"night",bake:!0,clouds:!1,stars:.8,starDensity:.5,twinkle:.6,zenith:j.zenith,mid:j.mid,horizon:j.horizon,horizonPow:3,sunElevation:-2,sunAzimuth:180-Ta,sunIntensity:0,sunGlow:0,scatterColor:j.wash,scatter:j.washK,scatterPow:7,scatterHigh:.05,scatterFall:2.6,bodyOverrides:{0:{elevation:Ps,azimuth:180-Ta,size:j.moonSize,color:j.moonCol,phase:.97,intensity:j.moonI,glow:.5,glowSize:4.5,glowColor:j.moonGlow}},clouds2:{coverage:.3,stretch:1,opacity:.42,scale:.8,lit:j.cirrusLit,shade:j.cirrusShade,wind:[.006,.002]},lightIntensity:1.6,ambientIntensity:2.2,lightElevationMin:12});$.add(fe.object),await D.yield();const Ra=fn(fe,{bounce:.3});$.add(Ra.object),await D.yield();const Vt=fe.bodyDirections[0].clone().normalize(),Ce=Math.atan2(Vt.x,Vt.z),_e=Math.asin(Lt(Vt.y,-1,1))/lo,Na=t=>Math.tan(t*lo),ho=110,uo=235,Ae=Math.sin(Ce),Pe=Math.cos(Ce),mo=[ho*(1-Pe),ho*Ae],Oe=(t,e=0)=>[mo[0]+Ae*t-Pe*e,mo[1]+Pe*t+Ae*e],It=120+(_e-12)*1.6,vo=Oe(uo),Ba=Pe+.75*Ae,La=-Ae+.75*Pe,Da=Math.hypot(Ba,La),Ss=Ba/Da,Fs=La/Da,Se=(t,e,a)=>[vo[0]+Ss*t+Ae*e,a,vo[1]+Fs*t+Pe*e],po=[181,92,632],Ka=5*lo,Ho=[170,70,470],_o=(t,e,a)=>[Ho[0]+e*Math.sin(Ce+t*lo),Ho[1]+e*Na(a),Ho[2]+e*Math.cos(Ce+t*lo)],go=[po[0]+Math.sin(Ka)*40,po[1]+62,po[2]+Math.cos(Ka)*40],qs=[[2,74,-330],[2,79,-270],[1,89,-130],[0,100,0],[-6,106,60],[0,113,130],[24,It-3,190],Se(-78,-8,It-1.5),Se(0,0,It),Se(62,6,It+7),Se(125,12,It+20),Se(190,20,It+38),[560,180,290],[780,200,262],[1e3,222,340],[1120,236,540],[1080,236,760],[900,215,880],_o(15,620,_e-2),_o(0,450,_e),go,[60,160,600],[-70,162,520],[-220,172,470],[-380,190,520],[-520,215,660]],ot=await dn(D,{palette:Ee,hour:j.hero,density:oe,form:"rope",hawks:0,mistFloor:!1,lipDark:.85,coil:22,coilV:.55,pitch:170,thickness:28,coilNear:{r:22,v:.75,z:[100,200],node:Se(26,0,It+3),end:[1e3,222,340]},lensClear:3,line:qs,seat:po,seatYaw:5,coilStart:[430,720],coilEnd:[1300,1470],flare:.35,ramp:80,tail:300,window:150,mid:3200,maxMid:3400,far:28500,maxFar:3e4,farWindow:800,farLead:260,farScale:[2.6,4,.2],midScale:[1.7,2.8],tubeNear:1});$.add(ot.object),await D.yield();const Ga=ot.stationNear(I(go[0],go[1],go[2]))*ot.length,Oo=ot.stationNear(I(780,200,262))*ot.length+60,Va=ot.stationNear(I(..._o(15,620,_e-2)))*ot.length+40,qt=[];{const t=I();for(let e=0;e<=Oo;e+=15)ot.centerAt(e/ot.length,t),qt.push(t.x,t.y,t.z,ot.ropeRadiusAt(e/ot.length)+9)}const Ia=(t,e,a,i)=>{for(let r=0;r<qt.length;r+=4)if(Math.hypot(qt[r]-t,qt[r+2]-e)<a+qt[r+3]-9&&i>qt[r+1]-qt[r+3]-3)return!0;return!1};await D.yield();const ja=ot.anchors,ct=ja.portalSeat,wt=ja.mouthOutline,dt=wt.length-1,Fe=st?12:0,Ts=ct.position.clone().addScaledVector(ct.direction,-96),Rs=ct.position.clone().addScaledVector(ct.direction,-48),Ua=[ho*(1-Math.cos(Ce/2)),ho*Math.sin(Ce/2)],Ea=Oe(62),Ha=Oe(uo-80),_a=Oe(uo-46),Wo=Oe(uo-6,11),Q=ln([[0,30,-276],[0,30,-246],[0,30.5,-216],[-1,44,-196],[-2,60,-175],[-1,69,-153],[1,72,-128],[3,75.5,-100],[2,84,-64],[0,94,-30],[0,100,0],[Ua[0],98,Ua[1]],[mo[0],94.5,mo[1]],[Ea[0],95,Ea[1]],[Ha[0],It-80*Na(_e+1.5),Ha[1]],[_a[0],It-20,_a[1]],[Wo[0],Math.max(It-29,80+Fe*.75),Wo[1]],[(Wo[0]+152)/2+5,84+Fe*.5,304],[162,74+Fe,356],[166,67+Fe,406],[169,68+Fe,452],[171.5,76+Fe*.6,494],Ts,Rs,ct.position.clone()]);let yo=0;{const t=I();for(let e=0;e<Q.length;e+=2)if(Q.posAtDist(e,t),t.z>=0){yo=e;break}}const Oa=Q.nearestXZ(vo[0],vo[1]).u*Q.length,Tt=I().crossVectors(I(0,1,0),ct.direction).normalize(),gt=I(ct.direction.x,0,ct.direction.z).normalize(),jn=I(0,1,0);await D.yield();const Wa=I(0,74,26),Xa=tt.fork("mistoff"),wo=I(-.24,-1,-.12).normalize(),Xo=I(20,4,-200),Za=9.5,xo=I(46,112,-187),bt={uTime:{value:0},uCam:{value:I(0,30,-276)},uPx:{value:.003},uLampPos:{value:Wa},uLampCol:{value:_(j.lamp).lerp(_("#c8c8c8"),.22).multiplyScalar(j.lampI)},uHaze:{value:_(j.haze).multiplyScalar(1.6)},uHazeK:{value:.0037},uU:{value:0},uAmbCol:{value:_(j.lamp).multiplyScalar(.47*j.lampI/1.3).add(_("#3a2c22").multiplyScalar(.08))},uMoss:{value:_(j.canopyA).lerp(_(j.canopyC),.4).multiplyScalar(1.15)},uBat:{value:new N.Color().setRGB(.051,.0465,.043)},uMoonDir:{value:Vt},uMoonCol:{value:_(j.moon).multiplyScalar(j.moonK)},uHole:{value:xo},uFoot:{value:Xo},uBeamDir:{value:wo},uBeamCol:{value:_(j.moon).multiplyScalar(1.5)},uBeamR:{value:Za},uSwRim:{value:_(j.moon).multiplyScalar(.2)},uRimN:{value:3},uBounce:{value:_("#91877c").multiplyScalar(.8)},uSkyCol:{value:_(j.skyCol).lerp(_("#9a9a9a"),j.skyGrey).multiplyScalar(j.skyK)},uGlowCol:{value:_(j.glow).multiplyScalar(j.glowK)},uGlowDir:{value:Vt},uMistCol:{value:ke},uMistShade:{value:I(j.mistShade[0],j.mistShade[1],j.mistShade[2])},uMistOp:{value:st?.94:.8},uSoft:{value:st?6.5:4.5},uSheetY:{value:st?48:34.5},uAmp:{value:st?3:2.6},uLayD:{value:5.2},uMistGl:{value:1},uCovA:{value:st?.38:.4},uCovB:{value:st?.52:.64},uOffM:{value:new N.Vector2(Xa.range(0,40),Xa.range(0,40))},uMistYR:{value:st?58:35},uMistOpR:{value:st?.9:.7},uFogCol:{value:Wt},uFogK:{value:$.fog.density},uVeil:{value:new N.Color(0,0,0)},uHazeFar:{value:ke.clone().multiplyScalar(.75).lerp(_(j.horizon),.3)}},Ns=_(j.lamp).multiplyScalar(.36),bo=st?{DEEP:1}:{},pt=(t,e,a={},i={})=>new N.ShaderMaterial({uniforms:{...bt,...i},vertexShader:t,fragmentShader:e,...a}),Xt=_(Ee[4]).multiplyScalar(.36),he=_(Ee[1]).multiplyScalar(1.1).lerp(_(Ee[4]).multiplyScalar(.36),.22),Zo=_(Ee[6]).multiplyScalar(1.5),Bs=_("#6a5646"),ue=_("#cfd8c8").multiplyScalar(.5),O=new N.Color,jt=(t,e,a)=>Q.distanceTo(t,e,a),Zt=[];for(let t=0;t<=dt;t++){const e=wt[Math.max(0,t-2)],a=wt[Math.min(dt,t+2)],i=a.x-e.x,r=a.y-e.y,l=Math.hypot(i,r)||1;Zt.push([-r/l,i/l])}Zt[0][0]*wt[0].x<0&&Zt.forEach(t=>{t[0]=-t[0],t[1]=-t[1]});let de=dt/2;for(let t=1;t<=dt;t++)if(wt[t-1].x>=0&&wt[t].x<0){de=t-1+wt[t-1].x/Math.max(1e-6,wt[t-1].x-wt[t].x);break}const Yo=[0,0],Qo=[0,0],Ya=(t,e)=>{const a=Math.min(dt-1,Math.max(0,Math.floor(t))),i=t-a;return e[0]=E(wt[a].x,wt[a+1].x,i),e[1]=E(wt[a].y,wt[a+1].y,i),a};function kt(t,e,a){t=Lt(t,0,dt);const i=Ya(t,Yo),r=t-i;let l=Yo[0],n=Yo[1];const v=W(-36,-270,e),x=W(-40,-95,e);if(t>de&&e<-18){Ya(de*(1-(t-de)/(dt-de)),Qo);const C=W(-18,-74-26*X.n2(n*.04,6.3),e);l=E(l,-Qo[0],C),n=E(n,Qo[1],C)}const f=E(1,1.72+.14*X.n2(e*.006,3.1),v),m=E(1,.925+.035*X.n2(e*.008,9.7),v),o=l*f,c=-14+(n+14)*m,w=l,S=n-50,A=Math.hypot(w,S)||1,u=X.fbm3(o*.016,c*.016,e*.016,3),M=X.n3(o*.042+5,c*.042,e*.042)*1.25,b=e<-36?4:e<-22?E(4,2.2,(e+36)/14):e<-8?E(2.2,.6,(e+22)/14):E(.6,0,Lt((e+8)/8,0,1)),P=E(E(2.5,b-2.3,W(-44,-30,e)),5+2*v+u*E(4.5,7,v)+M*1.7,x),q=W(-70,-40,e),T=w/A,y=S/A,s=E(T,E(Zt[i][0],Zt[i+1][0],r),q),p=E(y,E(Zt[i][1],Zt[i+1][1],r),q),z=Math.hypot(s,p)||1;if(kt.ao=Lt(.92-u*.55*x-M*.3*x,.4,1.3),a.x=o+s/z*P,a.y=c+p/z*P,a.z=e+5*W(78,112,n)*W(-12,1,e),Math.abs(a.x)<34&&a.y>100){const C=jt(a.x,a.y,e);C<13&&(a.y+=13-C)}return a}const Ls=lt.range(0,6.28),me=t=>24*Math.sin(t*.011+Ls)+8*Math.sin(t*.031+1.3);function Qa(t,e){const a=X.fbm2(t*.012+3,e*.012,3),i=Math.max(0,X.n2(t*.06,e*.06+20)-.3)*11,r=t-me(e),l=Math.exp(-(r*r)/130);return-4+9*a+i*(1-l)+Math.pow(Math.abs(t)/80,2.2)*15-4.5*l}const K=I(),qe=50,$o=[new Float32Array(qe),new Float32Array(qe)];for(let t=0;t<qe;t++){const e=E(-474,16,t/(qe-1));for(let a=0;a<2;a++){let i=0;for(let r=0;r<dt*.3&&(kt(a?dt-r:r,e,K),i=Math.abs(K.x),!(K.y>Qa(K.x,e)+1));r+=.5);$o[a][t]=i}(t&7)===7&&await D.yield()}const Te=(t,e)=>{const a=Lt((t+474)/490,0,1)*(qe-1),i=Math.min(qe-2,Math.floor(a));return E($o[e][i],$o[e][i+1],a-i)};function Ut(t,e){const a=Qa(t,e),i=t>=0?0:1,r=Te(e,i)-Math.abs(t);if(r>34||e>-6)return a;const l=Math.max(3,12+9*X.n2(e*.035,1.7+i*5)+5*X.n2(e*.11,8.3+i*3)),n=W(34,2,r);return a+(l*n*n+2.6*X.n2(t*.19,e*.19+40)*W(34,8,r)+.9*Math.max(0,-r))*W(-6,-30,e)}const Mt=ft(),Mo=ft(),Ct=ft(),ve=ft();{const e=Math.floor(dt/2)+1,a=Mt.pos.length/3;for(let n=0;n<110;n++){const v=E(-474,1,Math.pow(n/109,.92));for(let x=0;x<e;x++){kt(x*(dt/(e-1)),v,K);const f=X.fbm2(K.x*.03+v*.01,K.y*.04+11,2)*.5+.5,m=W(.55,.85,X.n3(K.x*.025,K.y*.025,v*.025)*.5+.5),o=X.n3(K.x*.019+40,K.y*.021+7,v*.017+23)*.5+.5;O.copy(Xt).lerp(he,W(.25,.8,o)*.6).lerp(ue,W(.5,1,f)*.42*(1-.6*W(.25,.8,o))).lerp(Bs,m*.45),Mt.v(K.x,K.y,K.z,O,kt.ao*(.92+.14*X.n2(K.x*.05,v*.05+K.y*.05)))}n&1&&await D.yield()}Mt.grid(a,110,e),await D.yield();const i=35,r=118,l=Mo.pos.length/3;for(let n=0;n<r;n++){const v=E(-474,16,n/(r-1)),x=Math.max(100,Te(v,0)+10),f=Math.max(100,Te(v,1)+10);for(let m=0;m<i;m++){const o=m/(i-1)*2-1,c=Math.sign(o)*Math.pow(Math.abs(o),.72)*(o>0?x:f),w=Ut(c,v),S=W(2,7,Math.max(0,X.n2(c*.06,v*.06+20)-.3)*11);O.copy(Zo).lerp(Xt,S*.8+W(8,22,w)*.5),Mo.v(c,w,v,O,.75+.35*X.n2(c*.15+9,v*.15))}(n&7)===7&&await D.yield()}Mo.grid(l,r,i)}await D.yield();const We=[],At=lt.fork("formations"),Jo=ft();for(let t=0;t<380;t++){(t&15)===15&&await D.yield();const e=dt*(At()<.6?At.range(.38,.62):At.range(.24,.76)),a=At.range(-458,-34),i=a<-110?Jo:Mt;kt(e,a,K);const r=K.x,l=K.y+.8;let n=E(2.5,14,Math.pow(At(),1.8));const v=At.range(.08,.22),x=At.range(0,6.28),f=At.range(.7,1.2),m=jt(r,l-n,a+v*n);if(m<8.5&&(n-=9-m),n<2)continue;const o=.3+n*At.range(.06,.1),c=n>6.5?9:6,w=n>6.5?[0,.1,.28,.52,.78,1]:[0,.14,.42,.74,1],S=i.pos.length/3;for(const A of w){const u=o*(Math.pow(1-A,1.45)*.86+.14*(1-A))*(1+.22*Math.sin(A*13+x));O.copy(Xt).lerp(he,.25+.6*A).lerp(ue,.3*Math.max(0,Math.sin(A*9+x)));for(let M=0;M<c;M++){const b=M/c*6.2832+A*.6,P=u*(1+.24*Math.sin(b*3+x));i.v(r+Math.cos(b)*P,l-A*n,a+Math.sin(b)*P+v*n*A*A,O,f*(.95+.14*Math.sin(b*2+x)))}}for(let A=0;A<w.length-1;A++)for(let u=0;u<c;u++){const M=S+A*c+u,b=S+A*c+(u+1)%c;i.quad(M,b,M+c,b+c)}We.push([r,l-n,a+v*n])}for(let t=0;t<70;t++){(t&7)===7&&await D.yield();const e=dt*At.range(.36,.64),a=At.range(-450,-60),i=At.range(8,19),r=At.range(0,6.28),l=Math.round(i*1.3),n=4,v=a<-110?Jo:Mt,x=v.pos.length/3;let f=At.range(3,8.5);kt(e,a+i/2,K);const m=jt(K.x,K.y-f,a+i/2);if(m<9.5&&(f-=10-m),!(f<1.5)){for(let o=0;o<=l;o++){const c=o/l,w=a+c*i;kt(e,w,K);const S=Math.sin(c*i*1.25+r),A=f*(.35+.65*Math.sin(Math.PI*c))*(.8+.2*Math.sin(c*i*2.5+r));for(let u=0;u<n;u++){const M=u/(n-1);O.copy(ue).lerp(he,.3+.5*Math.abs(S)),v.v(K.x+(.25+.9*M)*S+.3*M*Math.sin(c*i*3.1+r*2),K.y+.8-A*Math.pow(M,.9),w,O,.7+.5*M*(.75+.25*S))}}v.grid(x,l+1,n)}}await D.yield();{const t=tt.fork("fringe"),e=tt.fork("sill"),a=_("#3c423a"),i=_(Ee[5]).multiplyScalar(1.5),r=_("#2c6a40");for(let u=0;u<84;u++){const M=u%3,b=dt*(M===0?t.range(.285,.42):M===1?t.range(.58,.715):t.range(.4,.6)),P=u<54?t.range(-27,-4):t.range(-11,.5);kt(b,P,K);const q=K.x,T=K.y+.8,y=t.range(.06,.18),s=t.range(0,6.28),p=t.range(.7,1.1);let z=E(4,13,Math.pow(t(),1.3));const C=jt(q,T-z,P+y*z);if(C<9.5&&(z-=10-C),z<2.5)continue;const R=.3+z*t.range(.06,.09),d=z>6.5?9:6,h=[0,.1,.28,.52,.78,1],g=Mt.pos.length/3;for(const k of h){const F=R*(Math.pow(1-k,1.45)*.86+.14*(1-k))*(1+.22*Math.sin(k*13+s));O.copy(Xt).lerp(he,.25+.6*k).lerp(ue,.3*Math.max(0,Math.sin(k*9+s)));for(let L=0;L<d;L++){const V=L/d*6.2832+k*.6,G=F*(1+.24*Math.sin(V*3+s));Mt.v(q+Math.cos(V)*G,T-k*z,P+Math.sin(V)*G+y*z*k*k,O,p*(.95+.14*Math.sin(V*2+s)))}}for(let k=0;k<h.length-1;k++)for(let F=0;F<d;F++){const L=g+k*d+F,V=g+k*d+(F+1)%d;Mt.quad(L,V,L+d,V+d)}We.push([q,T-z,P+y*z])}await D.yield();const l=et.fork("rim"),n=(u,M,b,P,q,T,y)=>{const s=.3+q*l.range(.06,.09),p=[0,.1,.28,.52,.78,1],z=u.pos.length/3,C=l.range(0,6.28),R=l.range(.7,1.1);for(const d of p){const h=s*(Math.pow(1-d,1.45)*.86+.14*(1-d))*(1+.22*Math.sin(d*13+C));O.copy(Xt).lerp(he,.25+.6*d).lerp(ue,.3*Math.max(0,Math.sin(d*9+C)));for(let g=0;g<y;g++){const k=g/y*6.2832+d*.6,F=h*(1+.24*Math.sin(k*3+C));u.v(M+Math.cos(k)*F,b-d*q,P+Math.sin(k)*F+T*q*d*d,O,R*(.95+.14*Math.sin(k*2+C)))}}for(let d=0;d<p.length-1;d++)for(let h=0;h<y;h++){const g=z+d*y+h,k=z+d*y+(h+1)%y;u.quad(g,k,g+y,k+y)}We.push([M,b-q,P+T*q])};let v=dt-1;{let u=1e9;for(let M=Math.ceil(de)+1;M<dt;M++)if(wt[M].x<-20){const b=Math.abs(wt[M].y-87);b<u&&(u=b,v=M)}}const x=[];for(const[u,M,b,P,q]of[[.93,-24,3.6,4.2,6],[.865,-15,3.2,3.8,5],[.965,-11,2.8,3.2,4.4],[v/dt,-15,10,5.2,9]]){kt(dt*u,M,K);const T=-Math.sign(K.x)||-1,y=K.x-T*b*.1,s=K.y,p=10,z=6,C=Mt.pos.length/3,R=l()*6.28;if(jt(y+T*b,s,M)<16)continue;x.push({cx:y,cy:s,zc:M,sx:T,A:b,B:P,Cz:q});for(let h=0;h<=z;h++){const g=-1.25+h/z*(Math.PI/2+1.25),k=Math.sin(g),F=Math.cos(g);for(let L=0;L<p;L++){const V=L/p*6.2832+h*.35,G=1+.2*Math.sin(L*2.3+h*1.9+R)+.1*Math.sin(L*4.1+h*3.1+R*2),B=Math.cos(V)*F*G,U=Math.sin(V)*F*G,Y=1+.45*Math.max(0,B);O.copy(Xt).lerp(he,.3+.4*(1-h/z)).lerp(ue,.25*W(.3,.9,k)),Mt.v(y+T*B*b*Y,s+(k>0?k*P*.85:k*P*(1-.3*Math.max(0,B))),M+U*q,O,.72+.34*(h/z))}}for(let h=0;h<z;h++)for(let g=0;g<p;g++){const k=C+h*p+g,F=C+h*p+(g+1)%p;Mt.quad(F,k,F+p,k+p)}const d=Mt.v(y+T*b*.2,s+P*.9,M,ue,1);for(let h=0;h<p;h++)Mt.idx.push(C+z*p+(h+1)%p,C+z*p+h,d);for(let h=0;h<5;h++){const g=l.range(.55,1.3),k=M+l.range(-.7,.7)*q*(1.2-.5*g),F=l.range(3,9)*(.6+.4*g);jt(y+T*b*g,s-P*.5-F,k)>14&&n(Mt,y+T*b*g,s-P*(.75-.3*g),k,F,l.range(.04,.14),6)}}for(let u=0,M=0;u<200&&M<16;u++){const b=dt*l.range(.6,.97),P=Math.round(b),q=l.range(-30,-3),T=l.range(2.5,7.5);Zt[P][1]<.7||wt[P].y<14||(kt(b,q,K),!(jt(K.x,K.y-T,q)<14)&&(n(Mt,K.x+l.range(.6,1.6),K.y+.6,q,T,l.range(.04,.14),6),M++))}await D.yield();const f=(u,M,b,P=e)=>{const q=Ut(u,M)+b*.2,T=7,y=4,s=Ct.pos.length/3,p=P()*6.28,z=P.range(.55,.85);for(let C=0;C<=y;C++){const R=-.9+C/y*(Math.PI/2+.9),d=Math.sin(R),h=Math.cos(R);for(let g=0;g<T;g++){const k=g/T*6.2832+C*.4,F=1+.22*Math.sin(g*2.3+C*1.9+p)+.12*Math.sin(g*4.1+C*3.1+p*2);O.copy(a).lerp(i,W(.3,.9,d)*.6),Ct.v(u+Math.cos(k)*h*F*b,q+d*b*z,M+Math.sin(k)*h*F*b*.85,O,.5+.5*(C/y))}}for(let C=0;C<y;C++)for(let R=0;R<T;R++){const d=s+C*T+R,h=s+C*T+(R+1)%T;Ct.quad(h,d,h+T,d+T)}return q+b*z},m=(u,M,b,P,q=e)=>{const y=q()*6.28;for(let s=0;s<8;s++){const p=y+s/8*6.2832+q.range(-.2,.2),z=Math.cos(p),C=Math.sin(p),R=P*q.range(.8,1.15),d=Ct.pos.length/3;for(let h=0;h<=3;h++){const g=h/3,k=R*(.12+.8*g),F=M+R*(.8*g-.5*g*g),L=R*.2*Math.sin(Math.PI*(.12+.88*g))+.03;Ct.v(u+z*k-C*L,F,b+C*k+z*L,r,.55+.6*g),Ct.v(u+z*k+C*L,F,b+C*k-z*L,r,.7+.6*g)}for(let h=0;h<3;h++){const g=d+h*2;Ct.quad(g,g+1,g+2,g+3)}}};for(let u=0;u<30;u++){const M=e.range(-46,46),b=e.range(-18,7),P=E(1.5,4.8,Math.pow(e(),1.6));if(Math.abs(M-me(b))<P+4)continue;const q=f(M,b,P);e()<.65&&m(M+e.range(-.3,.3)*P,q-.2,b+e.range(-.3,.3)*P,e.range(1.6,2.7))}for(let u=0;u<34;u++){const M=e.range(-45,45),b=e.range(-14,9);Math.abs(M-me(b))<4||m(M,Ut(M,b)-.1,b,e.range(1.7,3.1))}const o=ut.fork("mounds"),c=[],w=at.fork("sill"),S=[];for(let u=0;u<600&&S.length<8;u++){const M=w.range(-23,-3),b=w()<.5?0:1,P=Math.min(44,Te(M,b)-3),q=(b?-1:1)*w.range(0,Math.max(P,1)),T=w.range(7.5,17);Math.abs(q-me(M))<8||S.some(y=>Math.hypot(y[0]-q,y[1]-M)<8)||jt(q,Ut(q,M)+5,M)<16||S.push([q,M,T])}S.forEach(([u,M,b],P)=>{let q;if(P%2===0){const T=3.2+b*.2,y=Math.min(4.4,2+b*.15),s=Ut(u,M)-.7,p=10,z=4,C=ve.pos.length/3,R=o()*6.28;for(let h=0;h<=z;h++){const g=h/(z+.8)*1.5708,k=Math.cos(g),F=Math.sin(g);for(let L=0;L<p;L++){const V=L/p*6.2832+h*.3,G=1+.18*Math.sin(L*2.3+h*1.3+R)+.09*Math.sin(L*4.1+h*2.9+R*2);O.copy(Zo).lerp(Xt,.2+.3*F),ve.v(u+Math.cos(V)*k*G*T,s+y*F,M+Math.sin(V)*k*G*T*.86,O,.7+.4*F)}}for(let h=0;h<z;h++)for(let g=0;g<p;g++){const k=C+h*p+g,F=C+h*p+(g+1)%p;ve.quad(F,k,F+p,k+p)}const d=ve.v(u,s+y,M,Zo,1.1);for(let h=0;h<p;h++)ve.idx.push(C+z*p+(h+1)%p,C+z*p+h,d);q=s+y,c.push([u,s,M,T,y])}else q=f(u,M,2.3+b*.07,o);m(u,q-.15,M,.75,o);for(let T=0;T<2;T++){const y=o()*6.2832,s=o.range(4,7),p=o.range(.8,1.7);Math.abs(u+Math.cos(y)*s-me(M+Math.sin(y)*s))>p+4&&f(u+Math.cos(y)*s,M+Math.sin(y)*s,p,o)}});{const u=ut.fork("ledge-plants"),M=_("#4c8a55"),b=_("#2f6a4c"),P=(T,y,s,p,z,C,R,d,h,g,k=3)=>{const F=Math.sin(p),L=Math.cos(p),V=Ct.pos.length/3;for(let G=0;G<=k;G++){const B=G/k,U=z*B,Y=y+z*(R*B-d*B*B),Z=C*Math.pow(Math.sin(Math.PI*(.1+.86*B)),.7)+.01;Ct.v(T+F*U-L*Z,Y+Z*.3,s+L*U+F*Z,h,g*(.6+.5*B)),Ct.v(T+F*U,Y,s+L*U,h,g*(.45+.4*B)),Ct.v(T+F*U+L*Z,Y+Z*.3,s+L*U-F*Z,h,g*(.75+.5*B))}for(let G=0;G<k;G++){const B=V+G*3;Ct.quad(B,B+1,B+3,B+4),Ct.quad(B+1,B+2,B+4,B+5)}},q=(T,y,s)=>{const p=u.range(.8,1.3);if(u()<.78)P(T,y-.06,s,u.range(-.9,.9),.6*u.range(.9,1.15),.2,.62,.7,M,p);else{const z=6+Math.floor(u()*3),C=u()*6.28;for(let R=0;R<z;R++){const d=C+R/z*6.2832+u.range(-.3,.3),h=u.range(.04,.2);P(T+Math.sin(d)*h,y-.04+u.range(0,.14),s+Math.cos(d)*h,d,u.range(.2,.3),.09,.5,.75,b,p*u.range(.8,1.15),1)}}};for(const T of x){const y=Math.round(6+T.A*4.5);for(let s=0;s<y;s++){const p=u()*6.2832,z=Math.sqrt(u())*.76,C=Math.cos(p)*z,R=Math.sin(p)*z,d=T.cx+T.sx*C*T.A*(1+.45*Math.max(0,C)),h=T.zc+R*T.Cz,g=T.cy+Math.sqrt(Math.max(0,1-z/.86*(z/.86)))*T.B*.85-.05;s%7===3?m(d,g+.05,h,.75,u):q(d,g,h)}}for(let T=0,y=0;T<1200&&y<120;T++){const s=u.range(de+4,dt-2),p=Math.round(s),z=u.range(-22,-1.5);Zt[p][1]>-.45||wt[p].y<18||(kt(s,z,K),!(jt(K.x,K.y,K.z)<12)&&(y++,y%9===4?m(K.x,K.y+.1,K.z,.75,u):q(K.x,K.y+.02,K.z)))}for(const[T,y,s,p,z]of c)for(let C=0;C<5;C++){const R=u()*6.2832,d=u.range(.25,.7);q(T+Math.cos(R)*d*p,y+z*Math.sqrt(1-d*d)-.05,s+Math.sin(R)*d*p*.86)}}const A=lt.fork("junction");for(let u=0;u<56;u++){const M=u&1,b=E(-255,-16,(u+A())/56),P=E(1.6,5.2,Math.pow(A(),1.5)),q=(M?-1:1)*(Te(b,M)-A.range(1,10)-P*.5);f(q,b,P),(u&15)===15&&await D.yield()}for(let u=0;u<20;u++){const M=u%3?1:0,b=E(-136,-44,(u+A())/20),P=E(2.2,6,Math.pow(A(),1.4)),q=(M?-1:1)*(Te(b,M)-A.range(0,8)-P*.4);f(q,b,P)}await D.yield()}const Re=ft(),ta=[];{const t=tt.fork("stalagmites"),e=_("#cfd8c8").multiplyScalar(.62),a=tt.fork("stal-tiers"),i=[[0,0,.55],[.55,.97,.86],[.88,1,1.12],[1,.95,1.02]],r=[[0,0,.6],[.7,1,1.08],[1,.94,1]],l=(f,m,o,c,w,S)=>{const A=Ut(f,m)-1.5,u=o+1.5,M=Re.pos.length/3,b=t()*6.28,P=t.range(-.05,.05),q=t.range(.85,1.2),T=w>6?i:r,y=Math.max(.9,o/(2.2+o/7)),s=[];let p=0;for(;p<u;){const g=y*a.range(.5,1.6)*(1-.4*p/u);s.push(g),p+=g}let z=0,C=0,R=0,d=0;for(let g=0;g<s.length;g++){const k=s[g]*u/p,F=g===s.length-1,L=a()*6.28,V=a.range(.74,.92),G=a.range(1.01,1.13);g&&(R+=a.range(-.07,.07)*c,d+=a.range(-.07,.07)*c);for(const[B,U,Y]of T){const Z=U===0?V:U===1?G:U,J=z+k*(g?.03+.97*B:B),it=Math.min(1,J/u),St=(.46+.54*Math.pow(1-it,.8))*Math.sqrt(Math.max(.03,1-Math.pow(it,5))),vt=1+.9*Math.pow(1-it,7),Ft=c*St*vt*Z*(F&&B===1?.4:1),te=A+J;O.copy(Xt).lerp(e,.08+.3*W(.6,1,B)).lerp(he,.5*(1-W(0,.5,B)));for(let io=0;io<w;io++){const Ue=io/w*6.2832+it*.9+b,ks=Ft*(1+.14*Math.sin(Ue*3+b+it*4)+.07*Math.sin(Ue*7-it*9+b*2)+.07*Math.sin(Ue*2+L));Re.v(f+R+Math.cos(Ue)*ks+P*u*it,te,m+d+Math.sin(Ue)*ks,O,q*(.7+.36*it)*Y*(.92+.16*Math.sin(Ue*2+b))),ta.push(J-1.5,g+B*.999)}C++}z+=k}const h=Re.v(f+R+P*u,A+u+c*.1,m+d,Xt,q);ta.push(u-1.5,s.length-.001);for(let g=0;g<C-1;g++)for(let k=0;k<w;k++){const F=M+g*w+k,L=M+g*w+(k+1)%w;Re.quad(L,F,L+w,F+w)}for(let g=0;g<w;g++)Re.idx.push(M+(C-1)*w+g,M+(C-1)*w+(g+1)%w,h)},n=(f,m,o,c)=>{const w=Ut(f,m);for(const S of[.15,.5,.8,1])if(jt(f,w+o*S,m)<c*(1.15-.8*S)+9)return!1;return Math.hypot(f,m+276)>17+c&&Math.abs(f-me(m))>c+3},v=[],x=(f,m,o)=>{const c=1.5+o*.115;!n(f,m,o,c)||v.some(w=>Math.hypot(w[0]-f,w[1]-m)<(w[2]+c)*.9)||(v.push([f,m,c]),l(f,m,o,c,12,o>18?14:10))};for(const[f,m,o]of[[-3,5,31],[7,-6,22],[10,8,16],[-8,-10,25],[15,0,13],[3,15,14],[0,-17,19],[-12,14,11]])x(Xo.x+f,Xo.z+m,o);for(const[f,m,o]of[[-13,-236,21],[-19,-205,27],[14,-150,24],[-12,-128,17],[-24,-262,15],[13,-252,12]])x(f,m,o);await D.yield();for(let f=0;f<70&&v.length<30;f++)x(t.range(-62,64),t.range(-268,-120),E(9,26,Math.pow(t(),1.6))),(f&7)===7&&await D.yield();for(let f=0;f<88;f++){const m=v[Math.floor(t()*v.length)],o=t()*6.2832,c=m[2]+t.range(.5,9),w=t()<.7,S=t.range(-60,60),A=t.range(-270,-120),u=w?m[0]+Math.cos(o)*c:S,M=w?m[1]+Math.sin(o)*c:A,b=E(1.2,6.5,Math.pow(t(),1.8));n(u,M,b,1)&&l(u,M,b,.4+b*.17,6,6),(f&15)===15&&await D.yield()}}await D.yield();const ea=pt(Aa,Pa,{side:N.DoubleSide},{uFloorK:{value:0}}),$a=pt(Aa,Pa,{side:N.DoubleSide},{uFloorK:{value:1}}),Ne=(t,e,a,i)=>{const r=t.index.array,l=t.attributes.position.array,n=i.length+1,v=new Int32Array(n),x=new Uint8Array(r.length/3),f=new Float32Array(n).fill(-1e9),m=[];for(let o=0,c=0;o<r.length;o+=3,c++){const w=l[r[o]*3+2],S=l[r[o+1]*3+2],A=l[r[o+2]*3+2],u=(w+S+A)/3;let M=0;for(;M<i.length&&u>i[M];)M++;x[c]=M,v[M]++,f[M]=Math.max(f[M],w,S,A)}for(let o=0;o<n;o++){if(!v[o])continue;const c=new r.constructor(v[o]*3);let w=0;for(let u=0;u<x.length;u++)x[u]===o&&(c[w++]=r[u*3],c[w++]=r[u*3+1],c[w++]=r[u*3+2]);const S=new N.BufferGeometry;for(const u in t.attributes)S.setAttribute(u,t.attributes[u]);S.setIndex(new N.BufferAttribute(c,1));const A=new N.Mesh(S,e);A.name=a,A.frustumCulled=!1,A.userData.zMax=f[o],$.add(A),m.push(A)}return m},Ds=Mt.build();await D.yield();const Ks=Ne(Ds,ea,"cave",[-400,-340,-280,-220,-160,-100,-40]);await D.yield();const Gs=Ne(Mo.build(),$a,"cave-floor",[-330,-190,-60]);await D.yield();const Ja=Ne(Ct.build(),ea,"cave-sill",[-140,-60]);await D.yield(),ve.pos.length&&Ja.push(...Ne(ve.build(),$a,"cave-sill-mounds",[])),await D.yield();const Vs=Ne(Jo.build(),ea,"cave-formations",[-380,-300,-220,-150]);await D.yield();const ts=Re.build();ts.setAttribute("aSt",new N.BufferAttribute(new Float32Array(ta),2));const Is=Ne(ts,pt(Aa,Pa,{side:N.DoubleSide,defines:{STAL:1}},{uFloorK:{value:0}}),"cave-stalagmites",[-240,-205,-170]);await D.yield();const es=jo.makeGodRays({rng:tt.fork("rays"),time:bt.uTime,position:[xo.x,xo.y,xo.z],direction:[wo.x,wo.y,wo.z],radius:Za*.8,count:16,length:114,width:[2,4.6],color:_(j.moon),intensity:.22,falloff:.9,speed:.6,fogAmount:.3});$.add(es.object),await D.yield();const oa={uAirCol:{value:_(j.lamp).lerp(_(j.haze),.3).multiplyScalar(.18)},uAirK:{value:0}},Kt=new N.Mesh(new N.PlaneGeometry(900,520),pt(Dn,Kn,{transparent:!0,depthWrite:!1,blending:N.AdditiveBlending,side:N.DoubleSide},oa));Kt.position.set(0,150,10),Kt.updateMatrix(),Kt.geometry.applyMatrix4(Kt.matrix),Kt.position.set(0,0,0),Kt.updateMatrix(),Kt.renderOrder=3.5,Kt.frustumCulled=!1,Kt.name="mouth-air",$.add(Kt),await D.yield();let Xe;{const a=[-.035,.012,.05,.09,.135,.18,.225],i=48,r=4256+a.length*i,l=new Float32Array(r*3),n=new Float32Array(r*3),v=new Float32Array(r*4),x=lt.fork("roost"),f=I();for(let o=0;o<38;o++){const c=dt*x.range(.34,.66),w=x.range(-440,-55),S=x.range(4,8),A=x();ot.centerAt(ot.stationNear(f.set(0,98,Math.min(-10,w+70))),f);for(let u=0;u<112;u++){const M=o*112+u,b=Math.sqrt(x())*S,P=x()*6.2832;kt(c+Math.cos(P)*b/1.4,w+Math.sin(P)*b,K),l[M*3]=K.x,l[M*3+1]=K.y-.15,l[M*3+2]=K.z,n[M*3]=f.x+x.range(-3,3),n[M*3+1]=f.y+x.range(-3,3),n[M*3+2]=f.z+x.range(-8,8);const q=u<112*.16?1:0;v[M*4]=x(),v[M*4+1]=q?A+u*.011:x(),v[M*4+2]=q,v[M*4+3]=x.range(.36,.5)}o&1&&await D.yield()}a.forEach((o,c)=>{const w=Q.pointAt(Math.max(0,o)+.045,I()),S=Q.pointAt(Math.max(0,o)+.12,I()),A=c%2?1:-1,u=w.x+A*x.range(4,9);kt(dt*.5-u/1.9,w.z,K);const M=dt*.5-u/1.9;ot.centerAt(ot.stationNear(S),f);for(let b=0;b<i;b++){const P=4256+c*i+b,q=Math.sqrt(x())*3.2,T=x()*6.2832;kt(M+Math.cos(T)*q/1.4,w.z+Math.sin(T)*q,K),l[P*3]=K.x,l[P*3+1]=K.y-.15,l[P*3+2]=K.z,n[P*3]=f.x+x.range(-2,2),n[P*3+1]=f.y+x.range(-2,2),n[P*3+2]=f.z+x.range(-6,6),v[P*4]=x(),v[P*4+1]=o+b*.0011,v[P*4+2]=2,v[P*4+3]=x.range(.4,.52)}});const m=new N.InstancedBufferGeometry;m.setAttribute("position",new N.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),m.setIndex([0,1,2,0,2,3]),m.setAttribute("aRoot",new N.InstancedBufferAttribute(l,3)),m.setAttribute("aTarget",new N.InstancedBufferAttribute(n,3)),m.setAttribute("aSeed",new N.InstancedBufferAttribute(v,4)),m.instanceCount=r,Xe=new N.Mesh(m,pt(gn,yn,{side:N.DoubleSide})),Xe.frustumCulled=!1,Xe.name="roost",$.add(Xe)}await D.yield();let Ze;{const t=[],e=[],a=[],i=lt.fork("drips"),r=Q.pointAt(.2,I()),l=Math.min(We.length,Math.round(240*nt));for(let S=0;S<l;S++){const A=We[S];t.push(A[0],A[1],A[2]),e.push(Math.max(20,A[1]-Ut(A[0],A[2])),i.range(26,40),i(),i.range(1.2,2.6)),a.push(.035,0)}for(let S=0;S<70;S++){const A=i.range(-42,42);t.push(A,119-Math.abs(A)*.28-i.range(0,9),i.range(1,9)),e.push(100,i.range(26,40),i(),i.range(1.2,2.6)),a.push(.035,0)}kt(dt*.5-(r.x+19)/1.9,r.z,K);const n=K.y,v=r.x+19,x=r.z+6;for(let S=0;S<170;S++)t.push(v+i.range(-2.4,2.4),n+3,x+i.range(-2.4,2.4)),e.push(n-Ut(v,x),i.range(26,48),i(),i.range(5,16)),a.push(i.range(.05,.16),1);const f=t.length/3,m=new N.InstancedBufferGeometry,o=4,c=[],w=[];for(let S=0;S<=o;S++)c.push(-1,S/o,0,1,S/o,0);for(let S=0;S<o;S++){const A=S*2;w.push(A,A+1,A+2,A+1,A+3,A+2)}m.setAttribute("position",new N.Float32BufferAttribute(c,3)),m.setIndex(w),m.setAttribute("aTop",new N.InstancedBufferAttribute(new Float32Array(t),3)),m.setAttribute("aD",new N.InstancedBufferAttribute(new Float32Array(e),4)),m.setAttribute("aS",new N.InstancedBufferAttribute(new Float32Array(a),2)),m.instanceCount=f,Ze=new N.Mesh(m,pt(wn,xn,{side:N.DoubleSide,transparent:!0,depthWrite:!1,blending:N.AdditiveBlending},{uGain:{value:.55}})),Ze.frustumCulled=!1,Ze.renderOrder=4,$.add(Ze)}await D.yield();{const t=[],e=[],a=[];for(let l=0;l<=100;l++){const n=E(-472,14,l/100),v=me(n),x=Ut(v,n)+1.3,f=3.4+1.6*X.n2(n*.03,5);if(t.push(v-f,x,n,v+f,x,n),e.push(-1,n,1,n),l<100){const m=l*2;a.push(m,m+1,m+2,m+1,m+3,m+2)}}const r=new N.BufferGeometry;r.setAttribute("position",new N.Float32BufferAttribute(t,3)),r.setAttribute("aUv",new N.Float32BufferAttribute(e,2)),r.setIndex(a),$.add(new N.Mesh(r,pt(bn,Mn,{side:N.DoubleSide})))}const zo=jo.makeParticles({rng:lt.fork("dust"),preset:"dust",time:bt.uTime,count:Math.round(1100*nt),box:[44,28,44],colors:[_(j.lamp),_(j.lamp).lerp(_("#ffffff"),.3),_(j.haze)],intensity:.45,size:[.025,.06]});$.add(zo.object),await D.yield();const js=lt.range(0,1e3),Et=17,H={x:0,z:0,r:0,h:0,t:0},ae=(t,e,a)=>{const i=Math.sin(t*127.1+e*311.7+a*74.7+js)*43758.5453;return i-Math.floor(i)},aa=(t,e)=>(H.x=(t+.15+.7*ae(t,e,1))*Et,H.z=(e+.15+.7*ae(t,e,2))*Et,H.r=7.5+5.5*ae(t,e,3),H.h=36+8*ae(t,e,4),H.t=ae(t,e,5),H),ko=(t,e)=>X.fbm2(t*.0035,e*.0035,2)*3,pe=t=>W(2,30,t),Ye=780,ge=1040,Co=-420,Ao=800,Be=748,sa=1320,os=(t,e)=>t>330?4.5*X.fbm2(t*.011+3,e*.011+7,2)*W(330,520,t):0,Po=(t,e)=>(35+1.6*ko(t,e)+7*X.fbm2(t*.0026+5,e*.0026+1,2))*pe(e),So=tt.fork("towers"),Us=tt.fork("tower-form"),xt=20,ye=[[225,309,21,112,0,1],[98,348,26,120,0,1],[-28,195,24,97,0,0],[-95,120,26,100,0,0],[310,450,34,126,0,0],[405,200,38,124,0,0],[-45,340,30,110,0,0],[40,485,32,120,0,0],[275,232,22,84,0,0]];for(const t of ye){const e=t[5]?2:5,a=Us;t[0]+=So.range(-e,e),t[1]+=So.range(-e,e),t[3]*=So.range(.96,1.05),t[4]=So()*6.28;const i={e:a.range(.7,.9),ea:a()*3.14,l3:a.range(.06,.14),nf:5+Math.floor(a()*4),lx:a.range(-.07,.07),lz:a.range(-.07,.07),cl:[],ov:[],sa:a()*6.28,sh:a.range(.48,.72),sw:a.range(.7,1.2),sd:a.range(.18,.34)},r=2+(a()<.5?1:0),l=a()*6.28,n=t[5]?1:1.5;for(let x=0;x<r;x++)i.cl.push({a:l+(x+a.range(-.22,.22))*6.2832/r,w:a.range(.13,.2)*n,d:a.range(.36,.56),p:a()*6.28});const v=4+Math.floor(a()*3);for(let x=0;x<v;x++)i.ov.push({a:a()*6.28,w:a.range(.5,.95),t:a.range(.22,.86),A:a.range(.14,.26),h:a.range(.1,.22)});t[6]=i}const Fo=(t,e)=>{let a=(t-e)%6.2832;return a>3.1416?a-=6.2832:a<-3.1416&&(a+=6.2832),a},na={ao:0},Qe=(t,e)=>{const a=t[6],i=Fo(e,a.sa);return t[3]+7*X.n2(Math.cos(e)*2.2+t[4],Math.sin(e)*2.2)+2.5*Math.sin(e*3+t[4])-9*W(.1,.5,X.n2(Math.cos(e)*4.1,Math.sin(e)*4.1+t[4]))-10*Math.exp(-(i*i)/(a.sw*a.sw))},$e=(t,e,a)=>{const i=t[6],r=t[4],l=t[2],n=Math.cos(e-i.ea),v=Math.sin(e-i.ea);let x=l*i.e/Math.sqrt(i.e*i.e*n*n+v*v),f=0;x*=1+i.l3*Math.sin(e*3+r+a*1.2)+.05*Math.sin(e*5-r*2+a*2.5),x*=(1-.04*a)*(1+.22*Math.pow(1-a,5));const m=Fo(e,i.sa);x*=1-i.sd*W(i.sh-.03,i.sh+.03,a+.05*X.n2(e*2+r,3.3))*Math.exp(-(m*m)/(i.sw*i.sw));for(const o of i.ov){const c=Fo(e,o.a),w=Math.exp(-(c*c)/(o.w*o.w)),S=o.t+.03*Math.sin(e*4+o.a*7)-a;if(S>0){const A=w*Math.exp(-S/o.h);x-=l*o.A*A*W(0,.014,S),f=Math.max(f,A*.8)}else x+=l*o.A*.35*w*Math.exp(S/(o.h*.6))}for(const o of i.cl){const c=Fo(e,o.a+.12*Math.sin(a*5+o.p)+.05*Math.sin(a*13+o.p*2)),w=Math.exp(-Math.pow(Math.abs(c)/o.w,2.6))*(.78+.22*Math.sin(a*3.1+o.p));x-=l*o.d*w*W(-.02,.1,a),f=Math.max(f,w)}if(x+=l*.04*Math.sin(e*i.nf*2+r*3+.7*Math.sin(a*4+e*3))*(.4+.6*W(.1,.5,a)),x+=1.7*X.fbm2(Math.cos(e)*3+r,a*5+Math.sin(e)*3,2),t[5]){const o=Math.floor(a*11+r),c=Math.floor(e*6+o*1.7);x+=1.5*(ae(c,o,7)-.45)*(ae(c,o,11)<.55?1:.2)}if(a>.92){const o=(a-.92)/.08;x*=1-.2*o*o}return na.ao=Lt(f,0,1),Math.max(x,l*.22)},ra=(t,e,a,i)=>{const r=Qe(t,e),l=$e(t,e,1)*a,n=t[6],v=r+(1-a*a)*1.5+2.6*X.n2(e*3+t[4],a*4);return i.set(t[0]+Math.cos(e)*l+n.lx*(v-xt),v,t[1]+Math.sin(e)*l+n.lz*(v-xt))},Le=(t,e,a)=>ye.some(i=>Math.hypot(t-i[0],e-i[1])<i[2]*1.22+a),Es=[[130,150,80,16],[160,430,85,17],[40,262,70,14],[280,330,70,14],[-70,205,65,13]],ia=(t,e)=>{let a=8*W(.08,.5,X.fbm2(t*.0045+9,e*.0045+2,2));for(const[i,r,l,n]of Es){const v=Math.hypot(t-i,e-r)/l;v<1&&(a=Math.max(a,n*(1-v*v)*(1-v*v)))}return a*W(40,110,e)},De={t:-1};function se(t,e){const a=Math.floor(t/Et),i=Math.floor(e/Et);let r=33+1.5*X.n2(t*.05,e*.05);De.t=-1;for(let l=-1;l<=1;l++)for(let n=-1;n<=1;n++){aa(a+l,i+n);const v=(t-H.x)*(t-H.x)+(e-H.z)*(e-H.z),x=H.r*H.r;if(v<x){const f=1-v/x,m=H.h-H.r*.3+H.r*.55*f-Math.max(0,H.h-H.r*.3-34.5)*(1-f)*(1-f)*(1-f);m>r&&(r=m,De.t=H.t)}}return(r+ko(t,e)-ia(t,e)+os(t,e))*pe(e)}const Ke=_(j.canopyA),la=_(j.canopyB),Hs=_(j.canopyC),Ht=(t,e)=>t<0?e.copy(la).multiplyScalar(.5):t<.45?e.copy(Ke):t<.8?e.copy(la).lerp(Ke,.35):e.copy(Hs),we=-170,Ge=330,Je=800,ca=35.5;let Yt=null;const qo=pt(Uo,Eo,{defines:{...bo}});{const t=ft(),e=st?72:92,a=st?110:142;for(let f=0;f<e;f++){const m=E(we,Ge,f/(e-1));for(let o=0;o<a;o++){const c=E(0,Je,o/(a-1)),w=W(0,45,Math.min(m-we,Je-c)),S=Math.max(E(Po(m,c),se(m,c),w),ca*pe(c));Ht(De.t,O),t.v(m,S,c,O,(.3+.8*W(34,44,S))*(.92+.16*X.n2(m*.06,c*.06)))}f&1&&await D.yield()}t.gridUp(0,e,a),$.add(new N.Mesh(t.build(),qo)),await D.yield();{const f=ft(),m=Ge-12,o=st?24:48,c=st?54:107;for(let w=0;w<c;w++){const S=E(ge,0,w/(c-1));for(let A=0;A<o;A++){const u=E(m,Ye,A/(o-1)),M=W(0,60,Math.min(Ye-u,ge-S)),b=Math.max(E(Po(u,S),se(u,S),M),ca*pe(S))-(A===0?1.5:0);Ht(De.t,O),f.v(u,b,S,O,(.3+.8*W(34,44,b))*(.92+.16*X.n2(u*.06,S*.06)))}(w&3)===3&&await D.yield()}f.gridUp(0,c,o),Yt=new N.Mesh(f.build(),qo),Yt.frustumCulled=!1,Yt.name="left-field",$.add(Yt),Yt.userData.rowTris=(o-1)*6,Yt.userData.dz=ge/(c-1),Yt.userData.rows=c-1}await D.yield();const i=ft(),r=-2600,l=2800,n=3800,v=73,x=52;for(let f=0;f<v;f++)for(let m=0;m<x;m++){const o=E(r,l,f/(v-1)),c=E(0,n,Math.pow(m/(x-1),1.6)),w=o>we+50&&o<Ge-50&&c<Je-50||o>=Ge-50&&o<Ye-80&&c<ge-80||o>Co+80&&o<Ao-80&&c<sa-80&&c>(o>we+50?Je-51:Be+80);O.copy(Ke).lerp(la,ae(f,m,3)),i.v(o,Po(o,c)-(w?14*pe(c):0),c,O,.95)}i.gridUp(0,v,x),$.add(new N.Mesh(i.build(),qo))}await D.yield();let to=null;{const t=ft(),e=112,a=38,i=[];for(let l=0;l<a;l++){const n=l/(a-1);i.push(Be+(sa-Be)*(.55*n+.45*n*n))}for(let l=0;l<a;l++){const n=i[l];for(let v=0;v<e;v++){const x=E(Co,Ao,v/(e-1)),f=x>we+45&&x<Ye-60,m=W(0,60,Math.min(x-Co,Ao-x,sa-n,f?1e9:n-Be)),o=9*W(.1,.55,X.fbm2(x*.004+70,n*.004+13,2))*W(Be+30,Be+130,n)*(1-W(880,1e3,n)),c=46*W(900,1190,n)*(.8+.2*X.fbm2(x*.0031+11,n*.0031+5,2)),w=se(x,n)-o,S=Math.max(E(Po(x,n),w+c,m),ca);Ht(De.t,O),t.v(x,S,n,O,(.3+.8*W(34,44,w))*(.92+.16*X.n2(x*.06,n*.06)))}l&1&&await D.yield()}const r=(l,n)=>E(Co,Ao,l/(e-1))>Ge+15&&i[n]<ge-80;for(let l=0;l<a-1;l++)for(let n=0;n<e-1;n++){if(r(n,l)&&r(n+1,l)&&r(n,l+1)&&r(n+1,l+1))continue;const v=l*e+n;t.idx.push(v,v+e,v+1,v+1,v+e,v+e+1)}to=new N.Mesh(t.build(),qo),to.frustumCulled=!1,to.name="back-field",$.add(to)}await D.yield();const Rt=[];{const t=lt.fork("emergents"),e=I(),a=I(),i=Math.round(E(26,34,(oe-.7)/.6));for(let r=0;r<i;r++){const l=r<12,n=l?E(.42,.8,(r+t())/12):t.range(.5,.8);Q.pointAt(n,e),Q.tangentAt(n,a),a.y=0,a.normalize();const v=l?t.range(-15,15):(t()<.5?-1:1)*t.range(28,150),x=e.x-a.z*v,f=e.z+a.x*v,m=l?Math.min(73,e.y-8.5-t.range(0,2.5)):t.range(58,71),o=t()*6.28,c=t.range(10.5,13.5);Rt.some(w=>Math.hypot(w.x-x,w.z-f)<24)||Le(x,f,16)||Rt.push({x,z:f,top:m,rot:o,R:c})}}const fa=new N.Color(1,1,1),xe=(t,e,a,i,r,l,n,v,x,f)=>{const m=t.pos.length/3;for(let w=0;w<=v;w++){const S=w/v,A=-.85+S*(Math.PI/2+.85-.22),u=Math.sin(A),M=Math.cos(A);for(let b=0;b<n;b++){const P=b/n*6.2832+w*.5,q=1+.17*Math.sin(b*2.4+w*1.7+f)+.1*Math.sin(b*5.1+w*3.3+f*2.3);t.v(e+Math.cos(P)*M*q*r,a+(u>0?u*l:u*l*.55)*(.92+.14*Math.sin(b*1.3+w+f)),i+Math.sin(P)*M*q*r,fa,x*(.34+.86*S))}}const o=t.v(e,a+l*1,i,fa,x*1.25),c=t.v(e,a-l*.42,i,fa,x*.25);for(let w=0;w<v;w++)for(let S=0;S<n;S++){const A=m+w*n+S,u=m+w*n+(S+1)%n;t.quad(u,A,u+n,A+n)}for(let w=0;w<n;w++)t.idx.push(m+v*n+(w+1)%n,m+v*n+w,o),t.idx.push(m+w,m+(w+1)%n,c)},eo=pt(Uo,Eo,{defines:{TUFT:1,...bo},side:N.DoubleSide}),_t=pt(Uo,Eo,{defines:{TUFT:1,PLAIN:1,...bo},side:N.DoubleSide}),ne=new N.Matrix4,be=new N.Quaternion,ha=I(0,1,0),Qt=(t,e,a)=>{const i=a.length,r=new N.InstancedMesh(t,e,Math.max(1,i)),l=new Float32Array(Math.max(1,i)*3);return a.forEach((n,v)=>{be.setFromAxisAngle(ha,n[6]),ne.compose(I(n[0],n[1],n[2]),be,I(n[3],n[4],n[5])),r.setMatrixAt(v,ne),l[v*3]=n[7],l[v*3+1]=n[8],l[v*3+2]=n[9]}),t.setAttribute("iCol",new N.InstancedBufferAttribute(l,3)),r.count=i,r.frustumCulled=!1,$.add(r),r},oo=(t,e)=>{const a=Math.abs(t)-64;return a<=0?1e6:Math.min(1e6,64*Math.max(e,1)/a)},ao=(t,e)=>oo(e[0],e[2])-oo(t[0],t[2]),as=[],ss=(t,e)=>(as.push([t,e.map(a=>oo(a[0],a[2]))]),t),ns=[],Nt=(t,e,a,i,r=0)=>{const l=new Map;let n=!0;for(const v of a){const x=Math.min(8,Math.max(0,Math.floor((Q.nearestXZ(v[0],v[2]).u-.28)/.07)));l.has(x)||l.set(x,[]),l.get(x).push(v)}for(const[,v]of l){v.sort(ao);const x=ss(Qt(n?t:t.clone(),e,v),v),f=new Float32Array(v.length*4);n=!1,v.forEach((m,o)=>{f[o*4]=m[0],f[o*4+1]=m[1],f[o*4+2]=m[2],f[o*4+3]=i*Math.max(m[3],m[4],m[5])}),ns.push({im:x,a:f,main:r})}},rs=(t=.62)=>{const e=ft();return xe(e,0,0,0,1,t,8,3,1,.7),e.build()};{const t=[],e=lt.fork("tufts"),a=[],i=et.fork("lobes"),r=ut.fork("lobes");let l=0;for(let A=Math.floor(we/Et);A<Ge/Et;A++)for(let u=1;u<Je/Et;u++){(++l&255)===0&&await D.yield(),aa(A,u);const M=Q.nearestXZ(H.x,H.z).dist;if(M>160||H.z<14||Le(H.x,H.z,H.r*.4))continue;const b=(H.h+H.r*.25+ko(H.x,H.z)-ia(H.x,H.z))*pe(H.z),P=H.r*.8;if(M<23){const q=i()*6.2832;for(let T=0;T<3;T++){const y=q+T*2.094+i.range(-.4,.4),s=H.r*i.range(.6,.82),p=H.r*i.range(.34,.47);a.push([H.x+Math.cos(y)*s,b-H.r*i.range(.34,.5),H.z+Math.sin(y)*s,p,p*i.range(.95,1.25),p,H.t])}}else if(M<36){const q=r()*6.2832;for(let T=0;T<2;T++){const y=q+T*3.1416+r.range(-.6,.6),s=H.r*r.range(.6,.82),p=H.r*r.range(.34,.47);a.push([H.x+Math.cos(y)*s,b-H.r*r.range(.34,.5),H.z+Math.sin(y)*s,p,p*r.range(.95,1.25),p,H.t])}}if(t.push([M,H.x,b-P*.2,H.z,P,P*.85,H.t]),M<95){const q=e()*6.2832,T=H.r*e.range(.45,.75),y=H.r*e.range(.4,.55);t.push([M+30,H.x+Math.cos(q)*T,b-H.r*.3,H.z+Math.sin(q)*T,y,y*.95,H.t])}}t.sort((A,u)=>A[0]-u[0]),t.length=Math.min(t.length,Math.round((st?400:480)*nt));const n=t.map(A=>{Ht(A[6],O);const u=.85+.4*e();return[A[1],A[2],A[3],A[4],A[5],A[4],e()*6.2832,O.r*u,O.g*u,O.b*u]}),v=tt.fork("bank");for(let A=0;A<46;A++){const u=v.range(-66,66),M=v.range(5,31),b=v.range(4,7.5),P=se(u,M);Ht(v(),O);const q=.8+.45*v();n.push([u,P+b*.12,M,b,b*.8,b,v()*6.2832,O.r*q,O.g*q,O.b*q])}for(const A of ye)for(let u=0,M=A[5]?14:9;u<M;u++){const b=v()*6.2832,P=u===0?v.range(6,8):v.range(3,5.6);ra(A,b,u===0?0:v.range(.25,.92),K),Ht(v(),O);const q=.9+.4*v();n.push([K.x,K.y+P*.35,K.z,P,P*.8,P,v()*6.2832,O.r*q,O.g*q,O.b*q])}await D.yield(),Nt(rs(),eo,n,1.35),await D.yield();const x=t.length?t[t.length-1][0]:60,f=[],m=I(),o=et.fork("far-tufts");let c=0;for(let A=Math.floor(we/Et);A<(Ye-70)/Et;A++)for(let u=1;u<(ge-80)/Et;u++){if((++c&255)===0&&await D.yield(),aa(A,u),H.z<40||Le(H.x,H.z,H.r*.4))continue;const M=Q.nearestXZ(H.x,H.z),b=M.dist;if(b<=x||b>280)continue;const P=H.x-ct.position.x,q=H.z-ct.position.z,T=P*Tt.x+q*Tt.z,y=P*gt.x+q*gt.z-35e-5*T*T;if(Math.abs(y)<72)continue;Q.pointAt(M.u,K),Q.tangentAt(M.u,m);const s=(H.x-K.x)*m.z-(H.z-K.z)*m.x>0&&M.u>.3&&M.u<.68;!s&&b>150||f.push([b/(s?2.6:1),H.x,H.z,H.r,H.h,H.t])}f.sort((A,u)=>A[0]-u[0]),f.length=Math.min(f.length,Math.round((st?60:460)*nt));const w=[];for(const[,A,u,M,b,P]of f){const q=(b+M*.25+ko(A,u)-ia(A,u)+os(A,u))*pe(u),T=M*o.range(.88,1.02);Ht(P,O);const y=.85+.4*o();w.push([A,q-T*.24,u,T,T*o.range(.95,1.2),T,o()*6.2832,O.r*y,O.g*y,O.b*y])}for(const[A,u,M,b,P,q,T]of a){Ht(T,O);const y=.8+.4*o();w.push([A,u,M,b,P,q,o()*6.2832,O.r*y,O.g*y,O.b*y])}const S=ft();xe(S,0,0,0,1,.62,6,2,1,2.3),Nt(S.build(),eo,w,1.35)}await D.yield();let is=null;const ls=(t,e,a=e?3:1)=>{const i=ft(),r=ft(),l=ft(),n=ft(),v=_("#b9b29c"),x=e?7:5,f=e?8:6,m=3,o=t()*6.28;let c=i,w=r;const S=(b,P,q,T,y)=>{const s=e?5:3,p=e?5:4,z=w.pos.length/3,C=I(),R=I(),d=I(),h=I();for(let g=0;g<=s;g++){const k=g/s,F=(1-k)*(1-k),L=2*k*(1-k),V=k*k;h.set(b.x*F+P.x*L+q.x*V,b.y*F+P.y*L+q.y*V,b.z*F+P.z*L+q.z*V),C.set((P.x-b.x)*(1-k)+(q.x-P.x)*k,(P.y-b.y)*(1-k)+(q.y-P.y)*k,(P.z-b.z)*(1-k)+(q.z-P.z)*k).normalize(),R.set(C.z,0,-C.x),R.lengthSq()<1e-4&&R.set(1,0,0),R.normalize(),d.crossVectors(C,R);const G=E(T,y,k);for(let B=0;B<p;B++){const U=B/p*6.2832;w.v(h.x+(R.x*Math.cos(U)+d.x*Math.sin(U))*G,h.y+(R.y*Math.cos(U)+d.y*Math.sin(U))*G,h.z+(R.z*Math.cos(U)+d.z*Math.sin(U))*G,v,.42+.3*k+.12*(B%2))}}for(let g=0;g<s;g++)for(let k=0;k<p;k++){const F=z+g*p+k,L=z+g*p+(k+1)%p;w.quad(F,L,F+p,L+p)}};for(let b=0;b<x;b++){const P=o+b/x*6.2832+t.range(-.25,.25),q=Math.cos(P),T=Math.sin(P),y=t.range(7.2,9.6),s=t.range(5.4,7.6),p=t.range(.82,1.15),z=I(q*y,s,T*y),C=I(q*y*.5,s*.62,T*y*.5);S(I(0,-2.5,0),I(q*y*.22,s*.75,T*y*.22),z,.5,.14),xe(c,z.x,z.y+.6,z.z,t.range(3.4,4.5),t.range(1.5,2.1),f,m,p,t()*6.28);const R=a;c=l,w=n;for(let d=0;d<R;d++){const h=P+(d-1)*1.15+t.range(-.3,.3),g=t.range(2.6,4.2),k=t.range(1.9,2.8);xe(c,z.x+Math.cos(h)*g,z.y-t.range(.6,2.1),z.z+Math.sin(h)*g,k,k*.55,f,m,p*t.range(.8,1.05),t()*6.28)}if(e||b%2===0){const d=P+t.range(.35,.6)*(b%2?1:-1),h=y*t.range(.55,.75),g=I(Math.cos(d)*h,s*t.range(.25,.42),Math.sin(d)*h);S(C,I((C.x+g.x)*.5,C.y,(C.z+g.z)*.5),g,.24,.1),xe(c,g.x,g.y+.4,g.z,t.range(2.4,3.3),t.range(1,1.4),f,m,p*.78,t()*6.28)}c=i,w=r}for(let b=0;b<(e?4:2);b++){const P=o+b*1.7+.4,q=b===0?0:t.range(2.5,4.5),T=t.range(3.2,4.3);b===0&&S(I(0,-2.5,0),I(.3,3,-.2),I(0,8.2,0),.5,.14),xe(c,Math.cos(P)*q,t.range(8.2,9.4),Math.sin(P)*q,T,T*.5,f,m,t.range(.95,1.2),t()*6.28)}const A=(b,P)=>{const q=b.pos.length/3,T=b.idx.length;for(const y of P.pos)b.pos.push(y);for(const y of P.col)b.col.push(y);for(const y of P.idx)b.idx.push(y+q);return T},u=A(i,l),M=A(r,n);return{leaf:i.build(),wood:r.build(),leafMain:u,woodMain:M}};{const t=lt.fork("crowns"),e=_("#b9b29c"),a=Rt.slice().sort((f,m)=>Q.nearestXZ(f.x,f.z).dist-Q.nearestXZ(m.x,m.z).dist).slice(0,10),i=Rt.filter(f=>!a.includes(f)),r=(f,m)=>{Ht(f.sh,O);const o=f.R/12;return[f.x,f.top-11*o,f.z,o,o,o,f.rot,O.r*m,O.g*m,O.b*m]};for(const f of Rt)f.sh=.5+.5*t();for(const[f,m]of[[a,!0],[i,!1]]){if(!f.length)continue;const o=ls(t,m),c=f.map(S=>r(S,1.05+.3*t())).sort(ao),w=f.map(S=>{const A=r(S,1);return A[7]=A[8]=A[9]=1,A}).sort(ao);Nt(o.leaf,eo,c,15.5,o.leafMain),Nt(o.wood,_t,w,15.5,o.woodMain),await D.yield()}const l=new N.CylinderGeometry(.55,1.15,1,8,5,!0),n=l.attributes.position,v=new Float32Array(n.count*3);for(let f=0;f<n.count;f++){const m=n.getY(f)+.5,o=Math.atan2(n.getZ(f),n.getX(f)),c=1+.5*Math.pow(1-m,6)*(1+.6*Math.sin(o*4));n.setXYZ(f,n.getX(f)*c,m,n.getZ(f)*c);const w=.34+.3*m+.1*Math.sin(m*31+o*2);v[f*3]=e.r*w,v[f*3+1]=e.g*w,v[f*3+2]=e.b*w*.95}l.setAttribute("aCol",new N.BufferAttribute(v,3)),l.deleteAttribute("uv"),l.computeVertexNormals();const x=Rt.map(f=>{const m=f.R/12,o=16,c=f.top-13*m,w=.085*f.R;return[f.x,o,f.z,w,c-o,w,f.rot,1,1,1]}).sort(ao);Nt(l,_t,x,1.15),is=l}await D.yield();const re=[];{const t=ut.fork("giants"),e=at.fork("giants"),a=I(),i=I();for(let y=0;y<36;y++)t();let r=yo;for(;r<Oa&&(Q.posAtDist(r,a),!(a.z>=58));r+=2);let l=e()<.5?-1:1;for(let y=r+e.range(0,10);y<Oa;y+=e.range(20,30)){const s=e.range(4,26),p=e.range(12,13.5),z=e()*6.28,C=.5+.5*e(),R=e.range(4,13),d=e.range(-3,3),h=[s,s+6,s-6,s+12,s-12,s+18,s-18].filter(k=>k>=4&&k<=26);let g=!1;for(let k=0;k<h.length*10&&!g;k++){const F=k<h.length*5?l:-l,L=F*h[Math.floor(k/5)%h.length],V=y+d+[0,5,-5,9,-9][k%5];Q.posAtDist(V,a),Q.tangentAtDist(V,i),i.y=0,i.normalize();const G=a.x-i.z*L,B=a.z+i.x*L;if(B<58||Rt.some(Z=>Math.hypot(Z.x-G,Z.z-B)<19)||re.some(Z=>Math.hypot(Z.x-G,Z.z-B)<25)||Le(G,B,15))continue;const U=Q.nearestXZ(G,B);if(U.dist<Math.abs(L)-3)continue;let Y=U.y-Math.max(R,E(8.5,4,Lt((U.dist-p)/8,0,1)));Ia(G,B,p,Y)&&(Y=U.y-13,Ia(G,B,p,Y))||(re.push({x:G,z:B,top:Y,rot:z,R:p,sh:C,lat:L}),g=!0)}l=-l}const n=.82,v=(y,s,p)=>{Ht(y.sh,O);const z=y.R/13.5;return[y.x,y.top-11.5*z*n,y.z,z,z*n,z,y.rot,p?1:O.r*s,p?1:O.g*s,p?1:O.b*s]};for(let y=0;y<2;y++){const s=re.filter((z,C)=>C%2===y);if(!s.length)continue;const p=ls(t,!0,2);Nt(p.leaf,eo,s.map(z=>v(z,1.1+.25*t(),!1)),15.5,p.leafMain),Nt(p.wood,_t,s.map(z=>v(z,1,!0)),15.5,p.woodMain),await D.yield()}const x=y=>y.top-13.5*(y.R/13.5)*n;Nt(is.clone(),_t,re.map(y=>{const s=.11*y.R;return[y.x,16,y.z,s,x(y)-16,s,y.rot,1.12,1.1,1.02]}),1.15),await D.yield();const f=(y,s,p,z,C,R,d,h)=>{const g=y.pos.length/3,k=s.length,F=I(),L=I(),V=I();for(let G=0;G<k;G++){const B=s[G],U=G/(k-1),Y=E(p,z,U);F.copy(s[Math.min(k-1,G+1)]).sub(s[Math.max(0,G-1)]).normalize(),L.set(F.y,-F.x,0),L.lengthSq()<1e-4&&L.set(1,0,0),L.normalize(),V.crossVectors(F,L);for(let Z=0;Z<C;Z++){const J=Z/C*6.2832;y.v(B.x+(L.x*Math.cos(J)+V.x*Math.sin(J))*Y,B.y+(L.y*Math.cos(J)+V.y*Math.sin(J))*Y,B.z+(L.z*Math.cos(J)+V.z*Math.sin(J))*Y,R,E(d,h,U)*(.85+.3*(Z%2)))}}for(let G=0;G<k-1;G++)for(let B=0;B<C;B++){const U=g+G*C+B,Y=g+G*C+(B+1)%C;y.quad(U,Y,U+C,Y+C)}},m=re.filter(y=>Math.abs(y.lat)>=9),o=m.length?m[Math.floor(e()*m.length)]:re[0];if(o){const y=ft(),s=_("#a59f8c"),p=17,z=x(o)+1.5,C=.11*o.R,R=[],d=h=>{const g=Lt((h-16)/Math.max(1,z-16),0,1);return C*E(1.15,.55,g)*(1+.5*Math.pow(1-g,6))+.14};for(let h=0;h<6;h++){const g=h%2?1:-1,k=h/6*6.2832+t.range(-.3,.3),F=t.range(11,17),L=[],V=30;for(let G=0;G<=V;G++){const B=E(p,z,G/V),U=k+g*(B-p)*6.2832/F+.35*Math.sin(B*.31+h),Y=d(B);L.push(I(Math.cos(U)*Y,B,Math.sin(U)*Y))}f(y,L,t.range(.2,.28),t.range(.1,.15),4,s,.5,.85)}for(let h=0;h<6;h++){const g=t()*6.2832,k=t.range(3.5,9)*(o.R/13.5),F=z+t.range(1.5,4),L=t.range(36,44),V=[],G=t.range(-.6,.6);for(let B=0;B<=5;B++){const U=B/5;V.push(I(Math.cos(g)*k+G*Math.sin(U*3.1416),E(F,L,U),Math.sin(g)*k+G*.6*Math.sin(U*3.1416+1)))}f(y,V,.09,.05,3,s,.8,.5)}Nt(y.build(),_t,[[o.x,0,o.z,1,1,1,0,1,1,1]],95);for(let h=0;h<6;h++){const g=t()*6.2832,k=t.range(1.5,4.5),F=t.range(2.2,3.4),L=t.range(.55,.8);R.push([o.x+Math.cos(g)*k,z-t.range(1,7),o.z+Math.sin(g)*k,F,F*.75,F,t()*6.28,Ke.r*L,Ke.g*L,Ke.b*L])}Nt(rs(),eo,R,1.35)}await D.yield();const c=ut.fork("palms"),w=_("#4f8a50"),S=_("#8d8672"),A=()=>{const y=ft(),s=13,p=c()*6.28,z=I(),C=I(),R=I(),d=I(),h=I(),g=y.pos.length/3;for(let k=0;k<=1;k++)for(let F=0;F<5;F++){const L=F/5*6.2832;y.v(Math.cos(L)*(k?.13:.2),k?0:-11,Math.sin(L)*(k?.13:.2),S,.5+.3*k)}for(let k=0;k<5;k++)y.quad(g+k,g+(k+1)%5,g+5+k,g+5+(k+1)%5);for(let k=0;k<s;k++){const F=p+k*2.39996+c.range(-.15,.15),L=E(1.15,-.45,Math.pow(k/(s-1),.8))+c.range(-.1,.1),V=c.range(1.2,1.7),G=c.range(1,1.25),B=c.range(.8,1.15);C.set(Math.cos(F)*Math.cos(L),Math.sin(L),Math.sin(F)*Math.cos(L)),R.set(-Math.sin(F),0,Math.cos(F)),d.crossVectors(R,C),z.copy(C).multiplyScalar(V);const U=y.v(0,.1,0,S,.6),Y=y.v(z.x+R.x*.05,z.y,z.z+R.z*.05,w,.6*B),Z=y.v(z.x-R.x*.05,z.y,z.z-R.z*.05,w,.6*B);y.idx.push(U,Y,Z);const J=y.v(z.x,z.y,z.z,w,.55*B),it=9,St=y.pos.length/3;for(let vt=0;vt<=it;vt++){const Ft=E(-2.5,2.5,vt/it),te=G*(.82+.18*Math.cos(Ft*.5))*(vt%2?1:.9),io=(vt%2?.12:-.1)*G-.25*G*(1-Math.cos(Ft*.5));h.copy(z).addScaledVector(C,Math.cos(Ft)*te).addScaledVector(R,Math.sin(Ft)*te).addScaledVector(d,io),y.v(h.x,h.y,h.z,w,B*(vt%2?1.15:.7))}for(let vt=0;vt<it;vt++)y.idx.push(J,St+vt,St+vt+1)}return y.build()},u=()=>{const y=ft(),s=8,p=c()*6.28,z=_("#5c9456"),C=I(),R=I(),d=I();for(let h=0;h<s;h++){const g=p+h/s*6.2832+c.range(-.3,.3),k=Math.cos(g),F=Math.sin(g),L=c.range(4.2,5.6),V=c.range(.75,1.25),G=c.range(.8,1.15),B=6;d.set(-F,0,k);const U=(Z,J)=>J.set(k*L*(.1+.8*Z),L*(V*Z-.95*Z*Z),F*L*(.1+.8*Z)),Y=y.pos.length/3;for(let Z=0;Z<=B;Z++){const J=Z/B;U(J,C);const it=.07*(1-.7*J);y.v(C.x-d.x*it,C.y,C.z-d.z*it,z,.5*G),y.v(C.x+d.x*it,C.y,C.z+d.z*it,z,.5*G)}for(let Z=0;Z<B;Z++){const J=Y+Z*2;y.quad(J,J+1,J+2,J+3)}for(let Z=1;Z<=9;Z++){const J=.12+.86*(Z/9),it=.95*Math.sin(3.1416*(.15+.8*J))+.2;U(J,C),U(Math.min(1,J+.07),R);for(const St of[-1,1]){const vt=y.v(C.x,C.y,C.z,z,.6*G),Ft=y.v(R.x,R.y,R.z,z,.7*G),te=y.v((C.x+R.x)*.5+d.x*St*it,(C.y+R.y)*.5-.3*it,(C.z+R.z)*.5+d.z*St*it,z,(St>0?1.2:.95)*G);y.idx.push(vt,Ft,te)}}}return y.build()},M=[],b=[],P=I(),q=I(),T=(y,s,p,z)=>!y.some(C=>Math.hypot(C[0]-s,C[2]-p)<z);for(let y=0;y<900&&(M.length<26||b.length<12);y++){const s=c.range(.325,.65),p=(c()<.5?-1:1)*(5+70*Math.pow(c(),1.5)),z=c()*6.28,C=c(),R=c.range(.8,1.2);Q.pointAt(s,P),Q.tangentAt(s,q),q.y=0,q.normalize();const d=P.x-q.z*p,h=P.z+q.x*p;if(h<46||Le(d,h,6))continue;const g=se(d,h),k=De.t<0;if(k&&M.length<26&&T(M,d,h,7)&&!re.some(F=>Math.hypot(F.x-d,F.z-h)<4)&&!Rt.some(F=>Math.hypot(F.x-d,F.z-h)<4)){const F=E(1.35,2.1,C);M.push([d,E(42,48,C)+2*R,h,F,F,F,z,R,R,R])}else if(!k&&g>39&&b.length<12&&T(b,d,h,12)){const F=E(.9,1.35,C);b.push([d,g+.6,h,F,F,F,z,R,R,R])}(y&63)===63&&await D.yield()}for(let y=0;y<2;y++){const s=M.filter((p,z)=>z%2===y);s.length&&Nt(A(),_t,s,4.2)}await D.yield();for(let y=0;y<2;y++){const s=b.filter((p,z)=>z%2===y);s.length&&Nt(u(),_t,s,6)}await D.yield()}const _s=pt(Fa,qa,{side:N.DoubleSide}),Os=pt(Fa,qa,{defines:{FIN:1},side:N.DoubleSide}),Ws=(t,e)=>2.2*Math.sin(t*.013+e*.007)+1.2*Math.sin(t*.041-e*.02+1.7)+.9*Math.sin(t*.097+e*.043+.4),cs=t=>t+2.6*Math.sin(t*.21+.7),Xs=t=>{let e=t;for(let a=0;a<4;a++)e-=(cs(e)-t)/(1+.546*Math.cos(e*.21+.7));return e},Zs=(t,e,a)=>{const i=X.fbm2(t*.006+31,e*.01,3),r=X.fbm2(t*.03+7,e*.03,2),l=50+12*X.n2(t*.004,2.2),n=e+7*X.fbm2(t*.035,4.4,2)+3*X.n2(t*.12,e*.05),v=W(1,.52,Math.abs(n)/l);let x=36+(83+17*i-36)*v+r*5*v;const f=x+a,m=cs(f)/11,o=Math.floor(m),c=W(.3,.55,.5+.5*X.n2(t*.019+o*7.3,o*3.1));return x=E(f,Xs((o+W(.7,.96,m-o))*11)*.8+f*.2,.2+.8*c)-a,x-6*Math.exp(-(t*t)/260)*v+1.3*X.fbm2(t*.21,e*.21,2)*v},fs=(t,e,a)=>(a.copy(ct.position).addScaledVector(Tt,t).addScaledVector(gt,e+35e-5*t*t),a.y=Zs(t,e,Ws(a.x,a.z)),a),Gt=(t,e)=>{fs(t,e,K);const a=Q.nearestXZ(K.x,K.z);return a.dist<26?Math.min(K.y,a.y-8.5-3*W(8,26,a.dist)+12*W(14,26,a.dist)):K.y},To=_("#a4aaa6").multiplyScalar(j.rockK),ua=_("#59625f").multiplyScalar(j.rockK),Ve=_("#c3c6bd").multiplyScalar(j.rockK),da=_(j.canopyA).multiplyScalar(1.2),Ie=[],Ro=[],ma=[];let hs=null,va=0;{const t=ft(),e=ft(),a=[],i=[],r=[],l=[],n=tt.fork("tower-scrub"),v=_(j.canopyC).lerp(_(j.canopyA),.3),x=I();for(const o of ye){const c=o[6],w=o[5],S=w?96:44,A=oo(o[0]-Math.sign(o[0])*o[2],o[1])>330,u=A?t:e,M=A?a:i,b=A?r:l;A||(va=Math.max(va,oo(o[0]-Math.sign(o[0])*o[2]*1.3,o[1])));const P=Q.nearestXZ(o[0],o[1]);Q.pointAt(P.u,x);const q=Math.atan2(o[1]-x.z,o[0]-x.x),T=Math.ceil((o[3]-xt)/(w?2.3:4.6)),y=[.74,.46,.2],s=T+y.length,p=u.pos.length/3,z=S+1;for(let d=0;d<s;d++){const h=d<T?d/(T-1):1,g=d<T?1:y[d-T];for(let k=0;k<z;k++){const F=q+k/S*6.2832;let L,V,G,B=0;if(d<T){const Y=$e(o,F,h);B=na.ao,V=xt+h*(Qe(o,F)-xt),L=o[0]+Math.cos(F)*Y+c.lx*(V-xt),G=o[1]+Math.sin(F)*Y+c.lz*(V-xt)}else ra(o,F,g,x),L=x.x,V=x.y,G=x.z;const U=X.fbm2(F*3+o[4],V*.035,2)*.5+.5;O.copy(To).lerp(ua,W(.4,.75,U)*.6).lerp(Ve,W(.6,.9,X.n2(F*2+5,V*.05)*.5+.5)*.5).lerp(da,(1-W(38,52,V))*.9),u.v(L,V,G,O,.85+.25*X.n2(F*7+o[4],V*.11)),M.push(k/S*6.2832*o[2],o[4],B),b.push(Math.cos(F),Math.sin(F))}(d&3)===3&&await D.yield()}ra(o,0,0,x);const C=u.v(x.x,x.y+.5,x.z,Ve,1);M.push(0,o[4],0),b.push(0,0);for(let d=0;d<s-1;d++)for(let h=0;h<S;h++){const g=p+d*z+h,k=g+1;u.quad(k,g,k+z,g+z)}for(let d=0;d<S;d++)u.idx.push(p+(s-1)*z+d,p+(s-1)*z+d+1,C);await D.yield();const R=P.dist<80;for(let d=0,h=0;d<160&&h<(w?34:9);d++){const g=n()*6.2832,k=n.range(.16,.95),F=$e(o,g,k);if(na.ao<.3&&n()>.3)continue;const L=xt+k*(Qe(o,g)-xt),V=o[0]+Math.cos(g)*(F-.4)+c.lx*(L-xt),G=o[1]+Math.sin(g)*(F-.4)+c.lz*(L-xt),B=n.range(1.2,2.4)*(w?1:1.5),U=n.range(.8,1.3)*1.2;h++,ma.push([[V,L-B*.1,G,B*.9,B*.72*n.range(.95,1.4),B*.9,n()*6.28,v.r*U,v.g*U,v.b*U],R])}for(let d=0,h=w?18:7;d<h;d++){const g=c.ov[d%c.ov.length],k=d%3!==0,F=k?g.a+n.range(-.7,.7)*g.w:n()*6.2832,L=k?g.t+.03*Math.sin(F*4+g.a*7)+.012:n.range(.9,.97),V=$e(o,F,L)+.5,G=xt+L*(Qe(o,F)-xt),B=o[0]+Math.cos(F)*V+c.lx*(G-xt),U=o[1]+Math.sin(F)*V+c.lz*(G-xt),Y=n.range(1.3,2.3)*(w?1:1.4),Z=Y*n.range(2.6,5.2),J=n.range(.75,1.2)*1.15;ma.push([[B,G+.6,U,Y*.8,-Z,Y*.8,n()*6.28,v.r*J,v.g*J,v.b*J],R])}await D.yield()}const f=pt(Rn,Nn,{side:N.DoubleSide}),m=(o,c,w,S)=>{const A=o.build();A.setAttribute("aTw",new N.BufferAttribute(new Float32Array(c),3)),A.setAttribute("aRd",new N.BufferAttribute(new Float32Array(w),2));const u=new N.Mesh(A,f);return u.name=S,u.frustumCulled=!1,$.add(u),u};m(t,a,r,"towers"),await D.yield(),hs=m(e,i,l,"towers-outer")}await D.yield();const pa=[],ga=(t,e,a,i,r,l,n=!1)=>{const v=[],x=[],f=[],m=[],o=[],c=t.int(4,6),w=t()*6.28,S=t.range(-.06,.06),A=t.int(0,c-1);for(let b=0;b<c;b++)o.push([E(-.8,.8,(b+t.range(.25,.75))/c),b===A?1:t.range(.62,.95),t.range(.2,.36)]);const u=b=>{let P=0;for(const[q,T,y]of o)P=Math.max(P,T*Math.pow(Math.max(0,1-Math.abs(b-q)/y),.8));return i*Math.pow(Math.max(0,1-Math.pow(Math.abs(b),3.2)),.55)*(.4+.6*P)*(1+.04*Math.sin(b*23+w))};for(let b=0;b<=l;b++){const P=b/l,q=Math.pow(1-P,.75)*(1+.7*Math.pow(1-P,4));for(let T=0;T<r;T++){const y=T/r*6.2832,s=Math.cos(y),p=Math.sin(y),z=u(s),C=-6+(z+6)*Math.pow(P,.92),R=s*(e/2)*(1-.18*P)+.5*Math.sin(C*.21+w),d=Math.pow(Math.abs(Math.sin(R*1.45+w+.5*Math.sin(C*.11))),.55),h=Math.abs(Math.sin(R*.41+w*2+C*.03)),g=(1-d)*(.5+.5*P)*1.2+(1-h)*1,k=Math.max(.04*(1-P),a/2*Math.pow(Math.abs(p),.8)*q-g*Math.min(1,Math.abs(p)*2.5)*(1-P*P*.6));v.push(R,C,Math.sign(p)*k+S*C),f.push(R,C);const F=.5+.5*Math.sin(C*.33+R*.05+w),L=(.74+.3*d)*(.86+.2*F);O.copy(To).lerp(ua,.55*(1-h)).lerp(Ve,.5*W(.6,1,P)).lerp(da,(1-W(-2,9,C))*.8),x.push(O.r*L,O.g*L,O.b*L)}}for(let b=0;b<l;b++)for(let P=0;P<r;P++){const q=b*r+P,T=b*r+(P+1)%r;m.push(q,q+r,T,T,q+r,T+r)}const M=new N.BufferGeometry;if(M.setAttribute("position",new N.Float32BufferAttribute(v,3)),M.setAttribute("aCol",new N.Float32BufferAttribute(x,3)),M.setAttribute("aLH",new N.Float32BufferAttribute(f,2)),M.setIndex(m),M.computeVertexNormals(),n){const b=m.length;for(let P=0;P<l;P+=2)for(let q=0;q<r;q+=2){const T=P*r+q,y=P*r+(q+2)%r;m.push(T,T+2*r,y,y,T+2*r,y+2*r)}M.setIndex(m),M.userData.lod=[b,b,m.length-b]}return M},ya=(t,e,a=16,i=38)=>{const r=new N.InstancedMesh(t,Os,Math.max(1,e.length));return e.forEach((l,n)=>{be.setFromAxisAngle(ha,l[3]),ne.compose(I(l[0],l[1],l[2]),be,I(l[4],l[5],l[6])),r.setMatrixAt(n,ne)}),r.count=e.length,r.frustumCulled=!1,$.add(r),r};{const t=lt.fork("blades"),e=Math.atan2(-gt.z,gt.x),a=[];for(let s=0;s<62;s++){const p=s%2?1:-1,z=p*(30+Math.pow((s>>1)/31,1.5)*760+t.range(-6,6)),C=t.range(-16,16);fs(z,C,K);const R=Q.nearestXZ(K.x,K.z).dist;R<19||a.push({d:R,it:[K.x,K.y-1,K.z,e+t.range(-1.2,1.2),t.range(.75,1.2),t.range(.72,1.12)*(1-.25*W(300,760,Math.abs(z))),t.range(.8,1.25)]})}a.sort((s,p)=>s.d-p.d);const i=a.slice(0,6),r=a.slice(6);for(let s=0;s<2;s++){const p=t.range(15,19),z=t.range(4.4,5.6),C=t.range(36,42);pa.push(ya(ga(t,p,z,C,76,16,!0),i.filter((R,d)=>d%2===s).map(R=>R.it),p,C)),await D.yield()}for(let s=0;s<3;s++){const p=t.range(13,20),z=t.range(4.2,6),C=t.range(34,44),R=ga(t,p,z,C,24,7),d=r.filter((h,g)=>g%3===s).map(h=>h.it).sort(ao);ss(ya(R,d,p,C),d),await D.yield()}for(let s=0;s<2;s++){const p=s?-1:1;K.copy(ct.position).addScaledVector(Tt,p*(s?21.5:20.5)).addScaledVector(gt,s?-2:-5),pa.push(ya(ga(t,s?25:23,6.4,s?56:50,104,22,!0),[[K.x,72,K.z,e-p*(s?.95:.8),1,1,1]],s?25:23,s?56:50)),await D.yield()}await D.yield();const l=lt.fork("scrub"),n=[],v=[],x=_(j.canopyC).lerp(_(j.canopyA),.3);for(let s=0;s<420&&(n.length<110||v.length<36);s++){const p=s%2===0,z=p?l.range(-1,1)*l.range(8,70):l.range(-1,1)*l.range(40,260),C=p?l.range(-95,30):l.range(-55,48),R=Gt(z,C);if(Q.nearestXZ(K.x,K.z).dist<5||R<50)continue;const d=l.range(.8,1.35);if((s&31)===31&&await D.yield(),s%3===0&&v.length<36){const h=l.range(.75,1.3);v.push([K.x,R-.3,K.z,h,h,h,l()*6.28,d,d,d])}else if(n.length<110){const h=l.range(.9,2);n.push([K.x,R+h*.2,K.z,h,h*l.range(.95,1.4),h,l()*6.28,x.r*d*1.25,x.g*d*1.25,x.b*d*1.25])}}await D.yield();const f=tt.fork("ledges");for(let s=0,p=0;s<420&&p<54;s++){(s&31)===31&&await D.yield();const z=f.range(-150,150),C=f.range(-72,-16),R=f.range(.8,1.7),d=f.range(.85,1.35),h=f()*6.28,g=Gt(z,C+1.2)-Gt(z,C-1.2),k=Gt(z,C+7),F=Gt(z,C);Math.abs(g)>1.5||F<43||k<F+4||Q.nearestXZ(K.x,K.z).dist<9||(n.push([K.x,F+R*.2,K.z,R,R*f.range(.8,1.2),R,h,x.r*d*1.25,x.g*d*1.25,x.b*d*1.25]),p++)}await D.yield();const m=[],o=[],c=[];for(const s of n){const p=s[3],z=s[1]-p*.2,C=[s[0],z-p*.12,s[2],p*.9,p*.72*(s[4]/p),p*.9,s[6],s[7],s[8],s[9]];(Q.nearestXZ(s[0],s[2]).dist<70?m:o).push(C),c.push([s[0],s[2],p*p*2.9,z,p*1.5])}for(const s of v)c.push([s[0],s[2],6.5,s[1]+.3,2.1]);const w=[];for(const[s,p]of ma)(p?w:o).push(s);{const s=[],p=[];for(let d=-58;d<=58;d++)s.push(d*2.4);for(let d=1;d<=32;d++){const h=139.2+810.8*(Math.pow(1.09,d)-1)/(Math.pow(1.09,32)-1);s.push(h),s.unshift(-h)}for(let d=0;d<7;d++)p.push(E(-125,-76,d/7));for(let d=0;d<=50;d++)p.push(E(-76,-14,d/50));for(let d=1;d<=8;d++)p.push(E(-14,16,d/8));for(let d=1;d<=11;d++)p.push(E(16,125,Math.pow(d/11,1.5)));const z=s.length,C=p.length,R=ft();for(let d=0;d<z;d++){const h=s[d],g=Math.abs(h)<270;for(let k=0;k<C;k++){const F=p[k],L=Gt(h,F),V=X.fbm2(h*.16,L*.035,2)*.5+.5;O.copy(To).lerp(ua,W(.4,.75,V)*.7).lerp(Ve,W(.6,.9,X.n2(h*.02,F*.05+9)*.5+.5)*.5).lerp(da,(1-W(42,54,L))*.9);let G=.8+.3*X.n2(h*.11,F*.11);if(g&&L>=49)for(const B of c){const U=K.x-B[0],Y=K.z-B[1],Z=U*U+Y*Y;Z<B[2]&&(G*=.4+.6*Z/B[2])}R.v(K.x,L,K.z,O,G)}await D.yield()}for(let d=0;d<z-1;d++)for(let h=0;h<C-1;h++){const g=d*C+h;R.idx.push(g,g+1,g+C,g+1,g+C+1,g+C)}await D.yield(),$.add(new N.Mesh(R.build(),_s))}await D.yield();{const s=f.fork("blocks"),p=ft(),z=8,C=5,R=[],d=[];for(let V=0;V<=C;V++){const G=-1.1+V/C*(Math.PI/2+1.1-.3),B=Math.sin(G),U=Math.cos(G);for(let Y=0;Y<z;Y++){const Z=Y/z*6.2832+V*.45,J=1+.26*Math.sin(Y*2.3+V*1.9+.7)+.14*Math.sin(Y*4.1+V*3.1+2.1),it=Math.pow(Math.abs(B),.7)*Math.sign(B);O.copy(To).lerp(Ve,.25+.4*Math.max(0,B)),p.v(Math.cos(Z)*U*J,it*(.85+.12*Math.sin(Y*1.7+V)),Math.sin(Z)*U*J*.85,O,.42+.5*(V/C)),R.push(Math.cos(Z)*U*J*3,it)}}const h=p.v(0,.92,0,Ve,.9);R.push(0,1);for(let V=0;V<C;V++)for(let G=0;G<z;G++){const B=V*z+G,U=V*z+(G+1)%z;p.quad(U,B,U+z,B+z)}for(let V=0;V<z;V++)p.idx.push(C*z+(V+1)%z,C*z+V,h);const g=p.build();g.setAttribute("aLH",new N.Float32BufferAttribute(R,2));for(let V=0;V<30;V++){const G=s.range(-150,150),B=s.range(-76,-57),U=Gt(G,B),Y=s.range(1.5,3.6);Q.nearestXZ(K.x,K.z).dist<12||d.push([K.x,U-Y*.15,K.z,s()*6.28,s.range(2.4,5.5),Y,s.range(2.2,4.6),s.range(-.25,.25)])}const k=pt(Fa,qa,{defines:{FIN:1,BLOCK:1},side:N.DoubleSide}),F=new N.InstancedMesh(g,k,Math.max(1,d.length)),L=new N.Euler;d.forEach((V,G)=>{be.setFromEuler(L.set(V[7],V[3],V[7]*.6,"YXZ")),ne.compose(I(V[0],V[1],V[2]),be,I(V[4],V[5],V[6])),F.setMatrixAt(G,ne)}),F.count=d.length,F.frustumCulled=!1,$.add(F),Ie.push(F)}await D.yield();const S=pt(Uo,Eo,{defines:{TUFT:1,SCRUB:1,...bo},side:N.DoubleSide}),A=(s,p,z,C)=>{const R=ft(),d=ft(),h=_("#77705f");for(let g=0;g<p;g++){const k=g/Math.max(1,p-1)*6.2832+s.range(-.4,.4),F=g===0?0:s.range(.4,.8),L=g===0?s.range(.5,.62):s.range(.32,.5),V=g===0?s.range(.8,1):s.range(.4,.8),G=Math.cos(k)*F,B=Math.sin(k)*F;if(xe(R,G,V,B,L,L*s.range(.7,1),z,2,s.range(.75,1.2),s()*6.28),!C)continue;const U=d.pos.length/3,Y=G*.45+s.range(-.1,.1),Z=B*.45+s.range(-.1,.1);for(const[J,it,St,vt]of[[0,-.15,0,.06],[Y,V*.5,Z,.045],[G,V-L*.1,B,.03]])for(let Ft=0;Ft<3;Ft++){const te=Ft*2.094;d.v(J+Math.cos(te)*vt,it,St+Math.sin(te)*vt,h,.5+.25*Ft)}for(let J=0;J<2;J++)for(let it=0;it<3;it++){const St=U+J*3+it,vt=U+J*3+(it+1)%3;d.quad(St,vt,St+3,vt+3)}}return{leaf:R.build(),wood:C?d.build():null}},u=tt.fork("bush"),M=A(u,5,6,!0),b=A(u,3,5,!1),P=s=>[s[0],s[1],s[2],s[3],s[4],s[5],s[6],1,1,1];Ro.push([Qt(M.leaf,S,m),Qt(M.wood,_t,m.map(P)),Qt(b.leaf.clone(),S,m),ct.position.x,ct.position.z]),Ro.push([Qt(M.leaf.clone(),S,w),Qt(M.wood.clone(),_t,w.map(P)),Qt(b.leaf.clone(),S,w),161,328]);for(const s of Ro)s[0].visible=s[1].visible=s[2].visible=!1;Ie.push(Qt(b.leaf,S,o));{const s=new N.CircleGeometry(1,10);s.rotateX(-Math.PI/2);const p=new N.InstancedMesh(s,new N.ShaderMaterial({uniforms:{uCam:bt.uCam,uFogCol:bt.uFogCol,uFogK:bt.uFogK},transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,vertexShader:"varying vec2 vQ; varying vec3 vP; void main(){ vQ = position.xz; vec4 w = instanceMatrix * vec4(position, 1.); vP = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`varying vec2 vQ; varying vec3 vP; uniform vec3 uCam, uFogCol; uniform float uFogK;
            void main(){ float a = (1. - smoothstep(.2, 1., length(vQ))) * .8, d = length(vP - uCam), f = 1. - exp(-uFogK * uFogK * d * d); gl_FragColor = vec4(mix(vec3(.004, .009, .007), uFogCol, f), a * (1. - f)); }`}),Math.max(1,c.length)),z=I();c.forEach((C,R)=>{const d=C[0]-ct.position.x,h=C[1]-ct.position.z,g=d*Tt.x+h*Tt.z,k=d*gt.x+h*gt.z-35e-5*g*g,F=(Gt(g+1,k)-Gt(g-1,k))/2,L=(Gt(g,k+1)-Gt(g,k-1))/2;z.set(0,1,0).addScaledVector(Tt,-F).addScaledVector(gt,-L).normalize(),ne.compose(I(C[0],C[3],C[1]).addScaledVector(z,.2),be.setFromUnitVectors(ha,z),I(C[4],1,C[4])),p.setMatrixAt(R,ne)}),p.count=c.length,p.frustumCulled=!1,p.renderOrder=1,$.add(p),Ie.push(p)}await D.yield();const q=ft(),T=_("#8a8372"),y=_(j.canopyC).lerp(_("#8fae6a"),.35);for(let s=0;s<3;s++){const p=[0,.9,-.7][s],z=[0,.4,.8][s],C=[5.2,3.9,4.4][s],R=q.pos.length/3;for(let d=0;d<=3;d++){const h=d/3,g=.16*(1-.4*h);q.v(p*h*h-g,C*h,z*h*h,T,.6),q.v(p*h*h+g,C*h,z*h*h,T,.85),q.v(p*h*h,C*h,z*h*h+g*1.6,T,.7)}for(let d=0;d<3;d++)for(let h=0;h<3;h++){const g=R+d*3+h,k=R+d*3+(h+1)%3;q.quad(g,k,g+3,k+3)}for(let d=0;d<10;d++){const h=d*2.4+s,g=.25+.75*l(),k=l.range(1.7,2.6),F=Math.cos(h),L=Math.sin(h),V=q.pos.length/3;for(let G=0;G<=3;G++){const B=G/3,U=k*B*Math.cos(g*(1-.5*B)),Y=C+k*(B*Math.sin(g)-.75*B*B),Z=.17*(1-B*B)+.015;q.v(p+F*U-L*Z,Y,z+L*U+F*Z,y,.55+.6*B),q.v(p+F*U+L*Z,Y,z+L*U-F*Z,y,.7+.6*B)}for(let G=0;G<3;G++){const B=V+G*2;q.quad(B,B+1,B+2,B+3)}}}Ie.push(Qt(q.build(),_t,v));for(const s of Ie)s.visible=!1}await D.yield();const us=un.makeHorizonRidges({rng:lt.fork("far"),layers:3,radius:[1700,3300],height:[130,400],base:0,fog:$.fog,sunDir:Vt,sunColor:j.glow,rim:.4,coverage:.7});$.add(us.object),await D.yield();const Ys=(t,e)=>{const a=[],i=[];for(let n=0;n<=t;n++){const v=6*Math.pow(550,n/t);for(let x=0;x<e;x++){const f=x/e*6.2832+n%2*3.1416/e;a.push(Math.cos(f)*v,0,Math.sin(f)*v)}}const r=a.length/3;a.push(0,0,0);for(let n=0;n<e;n++)i.push(r,n,(n+1)%e);for(let n=0;n<t;n++)for(let v=0;v<e;v++){const x=n*e+v,f=n*e+(v+1)%e;i.push(x,x+e,f,f,x+e,f+e)}const l=new N.BufferGeometry;return l.setAttribute("position",new N.Float32BufferAttribute(a,3)),l.setIndex(i),l},No=[];if(st){const t=Ys(56,48),e=t.attributes.position,a=t.index,i=e.count,r=4,l=new Float32Array(i*3*r),n=new Float32Array(i*r),v=new Uint32Array(a.count*r);for(let m=0;m<r;m++){for(let o=0;o<i;o++){const c=(m*i+o)*3;l[c]=e.getX(o),l[c+1]=m*bt.uLayD.value,l[c+2]=e.getZ(o),n[m*i+o]=m}for(let o=0;o<a.count;o++)v[m*a.count+o]=a.getX(o)+m*i}t.dispose();const x=new N.BufferGeometry;x.setAttribute("position",new N.BufferAttribute(l,3)),x.setAttribute("aLay",new N.BufferAttribute(n,1)),x.setIndex(new N.BufferAttribute(v,1)),await D.yield();const f=new N.Mesh(x,pt(kn,Cn,{transparent:!0,depthWrite:!1,side:N.DoubleSide},{uOp:{value:1}}));f.position.set(0,bt.uSheetY.value,0),f.renderOrder=2,f.frustumCulled=!1,$.add(f),No.push(f)}{const t=new N.PlaneGeometry(3e3,3e3);t.rotateX(-Math.PI/2);const e=new N.Mesh(t,pt(An,Pn,{transparent:!0,depthWrite:!1,side:N.DoubleSide},{uOp:{value:.3}}));e.position.set(0,st?75:53.5,0),e.renderOrder=3,e.frustumCulled=!1,$.add(e),No.push(e)}{const t=new N.Mesh(new N.CylinderGeometry(1550,1550,150,48,1,!0),new N.ShaderMaterial({uniforms:{uHazeFar:bt.uHazeFar,uOp:{value:st?.55:.95}},vertexShader:Sn,fragmentShader:Fn,transparent:!0,depthWrite:!1,side:N.BackSide}));t.position.set(0,91,0),t.renderOrder=1,t.frustumCulled=!1,t.name="horizon-haze",$.add(t),No.push(t)}const ie=[],Pt=lt.fork("mist"),ht=I(),zt=I();for(let t=0;t<Math.round(64*nt);t++){const e=Pt.range(.47,.84);Q.pointAt(e,ht),Q.tangentAt(e,zt);const a=(Pt()<.5?-1:1)*Pt.range(22,170);ie.push([ht.x-zt.z*a,(st?60:36)+Pt.range(0,8),ht.z+zt.x*a])}for(const t of Rt)for(let e=0;e<2;e++)ie.push([t.x+Pt.range(-7,7),(st?61:38)+Pt.range(0,9),t.z+Pt.range(-7,7)]);for(const t of ye)for(let e=0;e<2;e++){const a=tt()*6.2832,i=t[2]+tt.range(6,16);ie.push([t[0]+Math.cos(a)*i,(st?60:37)+tt.range(0,8),t[1]+Math.sin(a)*i])}for(let t=0;t<12;t++){const e=t%2?1:-1;ht.copy(ct.position).addScaledVector(Tt,e*Pt.range(22,70)).addScaledVector(gt,Pt.range(-30,20)),ie.push([ht.x,Pt.range(74,84),ht.z])}for(let t=0;t<16;t++)ht.copy(ct.position).addScaledVector(Tt,Pt.range(-260,260)).addScaledVector(gt,Pt.range(-75,-45)),ie.push([ht.x,(st?59:44)+Pt.range(0,12),ht.z]);{const t=ut.fork("mist"),e=at.fork("giant-mist");for(const a of re)for(let i=0;i<3;i++){const r=e()*6.2832,l=a.R*e.range(1.1,2.2);ie.push([a.x+Math.cos(r)*l,E(st?62:46,a.top-6,i/2)+e.range(-3,3),a.z+Math.sin(r)*l])}for(let a=0;a<81;a++)t();for(let a=0;a<12;a++){const i=t.range(150,520);ht.copy(ct.position).addScaledVector(Tt,t.range(-240,240)).addScaledVector(gt,i),ie.push([ht.x,E(56,80,(i-150)/370)+t.range(-3,6),ht.z])}}const wa=ke.clone().multiplyScalar(.72),xa=jo.makeMist({rng:Pt,time:bt.uTime,positions:ie,size:[24,58],color:wa,opacity:st?.13:.24,drift:[.5,.25,.3]});xa.object.renderOrder=6,$.add(xa.object);const ds=[];if(!st){const t=tt.fork("plumes"),e=at.fork("plume-places"),a=[];let i=Q.length;for(let r=yo;r<Q.length;r+=4)if(Q.posAtDist(r,ht),(ht.x-ct.position.x)*gt.x+(ht.z-ct.position.z)*gt.z>-130){i=r;break}for(let r=0;r<200&&a.length<5;r++){let l=null;for(let n=0;n<4;n++){const v=e.range(yo+40,i),x=(e()<.5?-1:1)*e.range(35,70);Q.posAtDist(v,ht),Q.tangentAtDist(v,zt),zt.y=0,zt.normalize();const f=ht.x-zt.z*x,m=ht.z+zt.x*x,o=Q.nearestXZ(f,m).dist;if(m<60||o<34.5||o>70||Le(f,m,14)||a.some(w=>Math.hypot(w[0]-f,w[1]-m)<60))continue;const c=se(f,m);(!l||c<l[2])&&(l=[f,m,c])}l&&a.push(l)}for(const[r,l]of a){const n=jo.makeSmokeColumn({rng:t,time:bt.uTime,position:[r,35,l],height:42,radius:[5,16],size:[12,32],count:54,color:wa,colorTop:wa.clone().multiplyScalar(.85),shadowColor:ke.clone().multiply(_("#5f8f95")),ambient:ke.clone().multiplyScalar(.08),opacity:.4,rate:.03,wind:[.35,0,.5],bend:.35,rim:.15,scatter:.25,sunDir:Vt,sunColor:_(j.glow).multiplyScalar(.5)});n.object.renderOrder=6,$.add(n.object),ds.push(n),await D.yield()}}await D.yield();const ba=Io.makeFauna($,{light:Io.lightFrom($)}),le=Math.round(Lt(E(520,640,fo)*oe,460,700)),Bo=new Float32Array(le*3),Lo=new Float32Array(le*3),$t=new Float32Array(le*4),je=new Float32Array(le*3),Jt=lt.fork("string"),Qs=260,so=200,Bt=new Float32Array((so+1)*3),ms=new N.CatmullRomCurve3([I(-58,66,95),I(-33,55,0),I(-18,54,-45),I(6,53,-82),I(24,52,-112),I(24,51,-145),I(14,49,-170),I(7,45.5,-190),I(11,43.5,-212),I(19,44,-240),I(25,47,-278),I(16,50,-330),I(-5,52,-420)],!1,"centripetal"),vs=ms.getLength();{const t=I();for(let e=0;e<=so;e++)ms.getPointAt(e/so,t),Bt[e*3]=t.x,Bt[e*3+1]=t.y,Bt[e*3+2]=t.z}for(let t=0;t<le;t++)je[t*3]=Qs*Math.pow((t+Jt())/le,.85),je[t*3+1]=Jt.range(-2,2)*(.5+Jt()),je[t*3+2]=Jt.range(-1.3,1.7)*(.5+Jt()),$t[t*4]=Jt(),$t[t*4+1]=Jt.range(.85,1.15),$t[t*4+2]=Jt(),$t[t*4+3]=Jt();const ce=new N.InstancedBufferGeometry;ce.setAttribute("position",new N.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),ce.setIndex([0,1,2,0,2,3]);const Ma=new N.InstancedBufferAttribute(Bo,3),za=new N.InstancedBufferAttribute(Lo,3);Ma.setUsage(N.DynamicDrawUsage),za.setUsage(N.DynamicDrawUsage),ce.setAttribute("aP",Ma),ce.setAttribute("aF",za),ce.setAttribute("aSeed",new N.InstancedBufferAttribute($t,4)),ce.instanceCount=le;const no=new N.Mesh(ce,pt(Bn,Ln,{transparent:!0,depthWrite:!1,side:N.DoubleSide}));no.frustumCulled=!1,no.renderOrder=7,$.add(no);const ps=(t,e)=>{const a=235+1250*t,i=vs/so;for(let r=0;r<le;r++){const l=$t[r*4+3],n=a-je[r*3]+3*Math.sin(e*.9+l*30),v=Lt(n/i,0,so-1.001),x=Math.floor(v),f=v-x,m=x*3,o=Bt[m+3]-Bt[m],c=Bt[m+4]-Bt[m+1],w=Bt[m+5]-Bt[m+2],S=Math.hypot(o,w)||1,A=je[r*3+1]+.5*Math.sin(e*1.7+l*40),u=je[r*3+2]+.4*Math.sin(e*2.3+l*70),M=.25*Math.cos(e*1.7+l*40);Bo[r*3]=Bt[m]+o*f+w/S*A,Bo[r*3+1]=Bt[m+1]+c*f+u,Bo[r*3+2]=Bt[m+2]+w*f-o/S*A,Lo[r*3]=o+w/S*M*i,Lo[r*3+1]=c,Lo[r*3+2]=w-o/S*M*i,$t[r*4+1]=n>2&&n<vs-4?Math.abs($t[r*4+1]):-Math.abs($t[r*4+1])}Ma.needsUpdate=!0,za.needsUpdate=!0,gs.needsUpdate=!0},gs=ce.getAttribute("aSeed");gs.setUsage(N.DynamicDrawUsage),ps(0,0);const $s={body:"#1d1a22",belly:"#3a3640",wingC:"#17151c",trail:"#221f28",tip:"#0e0d12",head:"#17151c"},ka=[[ct.position.x+Tt.x*60-gt.x*10,106,ct.position.z+Tt.z*60-gt.z*10]];for(const t of[.88,.8,.72,.64,.56,.48,.4])Q.pointAt(t,ht),Q.tangentAt(t,zt),zt.y=0,zt.normalize(),ka.push([ht.x+zt.z*16,ht.y-6,ht.z-zt.x*16]);ka.push([-40,76,70],[-30,72,0],[-20,62,-60]);const ys=Io.makeFlock({rng:lt.fork("swifts"),species:"swifts",count:Math.round(50*oe),speed:17,spread:[5,3.5,150],...$s,route:ka,closed:!1});ba.add(ys,{always:!0});const ws=[],ro=lt.fork("fireflies"),Ca=Math.round(170*j.fireflies*oe*nt);for(let t=0;t<Ca;t++){const e=ro.range(.45,.86);Q.pointAt(e,ht),Q.tangentAt(e,zt);const a=(ro()<.5?-1:1)*ro.range(6,110),i=ht.x-zt.z*a,r=ht.z+zt.x*a;ws.push([i,se(i,r)+ro.range(.5,5),r])}Ca>0&&!He&&ba.add(Io.makeFireflies({rng:ro,count:Ca,positions:ws,size:.42,color:"#d8ff7a",color2:"#ffd070",blink:.4,nearFade:[3,9]})),await D.yield();let Do=null;const xs={uFlash:{value:0},uMode:{value:1},uCol:{value:_("#b9c8ff").multiplyScalar(1.5)}};if(ze==="thunder"){Do=hn({rng:lt.fork("storm"),sky:fe,mode:"cumulus",at:[[-760,240,1900,950],[-300,260,2300,520],[-1250,230,1600,640]],puffs:44,height:.95,wind:[.5,0,.15]}),$.add(Do.object);const t=(e,a,i,r,l,n,v)=>{const x=new N.Mesh(new N.PlaneGeometry(e,a),pt(Gn,Vn,{transparent:!0,depthWrite:!1,side:N.DoubleSide,blending:v},n));x.position.set(i,r,l),x.lookAt(40,r,250),x.renderOrder=3,$.add(x)};t(620,260,-800,125,1850,{uFlash:{value:0},uMode:{value:0},uCol:{value:Wt.clone().multiplyScalar(.55)}},N.NormalBlending),t(1100,620,-780,470,1820,xs,N.AdditiveBlending)}if(He){const t=tt.fork("sync"),e=Math.round(3200*nt),a=new Float32Array(e*3),i=new Float32Array(e*2),r=I(),l=I();for(let x=0;x<e;x++){const f=t();let m,o,c;if(f<.2){const w=ye[Math.floor(t()*ye.length)],S=t()*6.2832,A=t.range(.2,1),u=$e(w,S,A)+.8;m=w[0]+Math.cos(S)*u,c=w[1]+Math.sin(S)*u,o=xt+A*(Qe(w,S)-xt)+t.range(.3,2.5)}else if(f<.45&&Rt.length){const w=Rt[Math.floor(t()*Rt.length)],S=t()*6.2832,A=Math.sqrt(t())*w.R;m=w.x+Math.cos(S)*A,c=w.z+Math.sin(S)*A,o=w.top-t.range(0,7)*(w.R/12)}else{const w=t.range(.33,.8);Q.pointAt(w,r),Q.tangentAt(w,l);const S=(t()<.5?-1:1)*Math.pow(t(),1.4)*180;m=r.x-l.z*S,c=r.z+l.x*S,o=se(m,c)+t.range(-.5,3.5),(m-ct.position.x)*gt.x+(c-ct.position.z)*gt.z>-80&&(o=-500)}a[x*3]=m,a[x*3+1]=o,a[x*3+2]=c,i[x*2]=t(),i[x*2+1]=t(),(x&255)===255&&await D.yield()}const n=new N.InstancedBufferGeometry;n.setAttribute("position",new N.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),n.setIndex([0,1,2,0,2,3]),n.setAttribute("aP",new N.InstancedBufferAttribute(a,3)),n.setAttribute("aR",new N.InstancedBufferAttribute(i,2)),n.instanceCount=e;const v=new N.Mesh(n,pt(qn,Tn,{transparent:!0,depthWrite:!1,blending:N.AdditiveBlending},{uFlyCol:{value:_("#d2ff76").multiplyScalar(3.6)}}));v.frustumCulled=!1,v.renderOrder=6,v.name="fireflies-in-step",$.add(v)}await D.yield(),await fe.prewarm(D.renderer,null,$);const rt=I(),bs=new N.Vector2,Ms=I(),zs=new N.Color,Js=_(j.glow).lerp(_("#c9d2e6"),st?.6:.15).multiplyScalar(j.glowI*(st?.6:.85)),tn=_(j.lamp).multiplyScalar(1.6),en=new N.Color(1.2,1.18,1.17),on=_(j.skyCol).lerp(_("#9a9a9a"),.5).multiplyScalar(1.5),an=Q.pointAt(0,I()),sn=Q.tangentAt(0,I()).normalize(),nn=I();ot.setLeg(Oo,Va,0),ot.setKeyThin(-140,-30,.055,110),ot.setSway(9,8,ot.stationNear(I(0,113,130))*ot.length,220);const Ko=I();function rn(t,e,a,i){bt.uTime.value=e,bt.uU.value=i,rt.setFromMatrixPosition(a.matrixWorld),bt.uCam.value.copy(rt),D.renderer.getDrawingBufferSize(bs),bt.uPx.value=2/((a.projectionMatrix.elements[5]||1.6)*Math.max(bs.y,8));const r=W(-50,22,rt.z);i>0?(ot.setPark(null),ot.setSquadHeading(Q.tangentAt(i,nn).normalize())):(ot.setPark(an,sn),ot.setSquadHeading(null)),a.getWorldDirection(Ko);let l=-1;if(i>0){const o=a.matrixWorld.elements,c=a.projectionMatrix.elements,w=1/(c[0]||.9),S=1/(c[5]||1.6),A=1/Math.hypot(1,w),u=1/Math.hypot(1,S);l=1e9;for(let M=0;M<qt.length&&l>-40;M+=4){const b=qt[M]-rt.x,P=qt[M+1]-rt.y,q=qt[M+2]-rt.z,T=b*o[0]+P*o[1]+q*o[2],y=b*o[4]+P*o[5]+q*o[6],s=-(b*o[8]+P*o[9]+q*o[10]),p=Math.max((Math.abs(T)-s*w)*A,(Math.abs(y)-s*S)*u)-qt[M+3];p<l&&(l=p)}}const n=W(0,8,l);if(n>0){const o=ot.stationNear(rt)*ot.length;ot.setWindow(E(o,Ga,n),E(o+260,Ga-110,n))}else ot.setWindow(null);ot.setLeg(Oo,Va,i>0?W(-40,-8,l):0),Ms.copy(Wa).sub(rt).normalize().lerp(Vt,r).normalize(),zs.copy(tn).lerp(Js,r),ot.setLight({glowDir:Ms,glowColor:zs,open:.1+.9*r,rim:E(.15,.035,r),through:E(.6,.2,r),dif:.5,spread:r,follow:E(.75,.6,r),phase:Math.max(0,i)*30,batAmb:en,batAmbOut:on,inside:1-r}),ot.update(t,e,a),fe.update(t,e,a),Ra.update(t,e,a),us.update(t,e,a);for(const o of No)o.position.x=rt.x,o.position.z=rt.z;const v=rt.z>25,x=rt.z<5,f=rt.z<-30,m=rt.z<22;for(const o of ns){const c=o.a;let w=!1,S=!o.main;for(let A=0;A<c.length&&!(w&&S);A+=4){const u=c[A]-rt.x,M=c[A+1]-rt.y,b=c[A+2]-rt.z;u*Ko.x+M*Ko.y+b*Ko.z>-c[A+3]&&(w=!0),u*u+b*b<48400&&(S=!0)}o.im.visible=w,o.main&&o.im.geometry.setDrawRange(0,S?1/0:o.main)}oa.uAirK.value=1-W(-190,-45,rt.z),Kt.visible=oa.uAirK.value>.001,to.visible=rt.z>330;{const o=Math.hypot(rt.x-ct.position.x,rt.z-ct.position.z)>300;for(const c of pa){const w=c.geometry.userData.lod;c.geometry.setDrawRange(o?w[1]:0,o?w[2]:w[0])}}for(const o of Ie)o.visible=v;for(const o of Ro){const c=v&&Math.hypot(rt.x-o[3],rt.z-o[4])<215&&(o[4]>400||rt.z<430);o[0].visible=o[1].visible=c,o[2].visible=v&&!c}{const o=Yt.userData,c=-rt.z,w=c<=5?o.rows:Lt(Math.ceil((ge-c*3.9)/o.dz),0,o.rows);Yt.geometry.setDrawRange(0,w*o.rowTris)}hs.visible=rt.z>-va-12;{const o=-rt.z;for(const[c,w]of as){let S=w.length;if(o>5)for(S=0;S<w.length&&w[S]>=o;)S++;c.count=S}}Xe.visible=x,Ze.visible=x,zo.object.visible=x,es.object.visible=f;{const o=rt.z-25;for(const c of Vs)c.visible=f&&c.userData.zMax>o;for(const c of Is)c.visible=f&&c.userData.zMax>o;for(const c of Ks)c.visible=m&&c.userData.zMax>o;for(const c of Gs)c.visible=m&&c.userData.zMax>o;for(const c of Ja)c.visible=m&&c.userData.zMax>o}ot.setMouthVisible(m),no.visible=rt.z<60,no.visible&&ps(i,e),ba.update(t,e,a,i),ys.object.visible=rt.z>-60,xa.update(t,e,a),zo.update(t,e,a),zo.setOpacity(1-r);for(const o of ds)o.update(t,e);bt.uVeil.value.copy(Ns).multiplyScalar(1-W(-200,-60,rt.z)),Do&&(Do.update(t,e,a),xs.uFlash.value=In(e))}return{scene:$,path:Q,duration:51,pace:t=>.78+.37*W(.05,.13,t)-.1*W(.2,.28,t)-.27*W(.47,.52,t)+.34*W(.555,.62,t)-.1*W(.7,.8,t),camera:{fov:62,near:.3,far:4200,lookAhead:26,sway:.5,bank:1},pois:[{at:I(0,50,12),from:0,to:.1,weight:.6},{at:I(0,99,12),from:.06,to:.3,weight:.7},{at:Vt.clone().multiplyScalar(4e3).add(I(80,100,170)),from:.33,to:.57,weight:.3},{at:Vt.clone().multiplyScalar(4e3).add(I(80,100,170)),from:.5,to:.64,weight:.75},{at:ct.position.clone(),from:.64,to:1,weight:.5}],portal:{shape:"circle",radius:7,color:j.portal,glow:1,revealDistance:420,tilt:!0},post:{exposure:j.exposure,bloom:{strength:.34,radius:.6,threshold:.9},grade:{saturation:1.1,contrast:1.05,tint:"#ffffff",shadowTint:j.shadowTint,vignette:.3,grain:.03,aberration:0}},ride:"none",update:rn,dispose(){fe.dispose(),ot.dispose()}}}};export{_n as default};
