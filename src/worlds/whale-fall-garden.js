import*as a from"three";import{makePath as Ba,makeRng as jo,hashSeed as Io,clamp as fe,lerp as j,smoothstep as ee}from"../kit/core.js";import*as w0 from"../kit/fx.js";import{buildHero as Na,WFG_GLSL as re}from"../parts/whale-fall-garden.js";const $=Math.PI*2,Ho=["#EDE6D2","#B3122E","#0B6E86","#031B2A","#F29AB2","#E8C23A","#5CFFE6"],Ra={peacock:{title:"The Bone Garden",fog:"#0B6E86",density:.0065,low:"#031B2A",glow:"#1C9AB0",glowGain:1.55,up:.6,lean:6,leanZ:0,key:"#E9F3EF",keyScale:1.12,sky:"#0B6E86",skyScale:.62,bounce:"#C6EEE8",bounceScale:.26,shadow:"#06323F",snow:1,snowCol:["#d9f2f2","#bfe6ea","#f1f6ee"],exposure:1.15,shadowTint:"#06323F",sparks:1,belly:1.8,sat:1.08},jade:{title:"The Bone Garden, Green Season",fog:"#0D766F",density:.0074,low:"#03241F",glow:"#35B79A",glowGain:1.45,up:.55,lean:6,leanZ:0,key:"#EEF4E2",keyScale:1.14,sky:"#0E7F78",skyScale:.48,bounce:"#C6F0DC",bounceScale:.26,shadow:"#06382F",snow:2.3,snowCol:["#e2f4dc","#c9ecd0","#f4f6e4"],exposure:1.2,shadowTint:"#06382F",sparks:1,belly:1.8,sat:1.08},violet:{title:"The Bone Garden at First Light",fog:"#3B4267",density:.0062,low:"#16183E",glow:"#7C7CD4",glowGain:1.05,up:.6,lean:25,leanZ:.35,key:"#EFE4FF",keyScale:1.18,sky:"#3A469A",skyScale:.6,bounce:"#D8CCFF",bounceScale:.28,shadow:"#1A1850",snow:1,snowCol:["#e6defa","#cfd0f4","#f6eef6"],exposure:1.22,shadowTint:"#141238",sparks:1.5,belly:1.6,sat:1.05},moon:{title:"The Bone Garden by Moonlight",fog:"#1C3F60",density:.0064,low:"#030B16",glow:"#86A9C9",glowGain:.9,up:.5,lean:12,leanZ:-.3,key:"#E3EDF6",keyScale:.98,sky:"#24506F",skyScale:.62,bounce:"#C9DCEC",bounceScale:.26,shadow:"#0A2238",snow:.9,snowCol:["#e4eef6","#c6d8e8","#f4f6f8"],exposure:1.3,shadowTint:"#0A2238",sparks:5,belly:1.9,sat:1.08}};function La(o,u){const y=o();return u==="night"?"moon":u==="dawn"||u==="golden"?"violet":u==="day"?y<.62?"peacock":"jade":y<.42?"peacock":y<.64?"jade":y<.84?"violet":"moon"}const le="vec3(0.0, 1e-5, 0.0)",nt=`
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
`,Tt=`
${re.light}
${re.noise}
${re.fogParsFrag}
// THE SHADE OF ROCK, NEAR BY: a rock face in shade falls TO the mood's shadow colour and stops there, never under it to
// black (uShade: the scene value that the grade shows as the mood's shadow tint, worked out in build() from the
// grade's own numbers). Light above the shade is kept, so relief, ledges and crusts stand on it. It is a law of the rock
// seen through clear water (wfgNear(d), d the true distance from the eye to the pixel's own place, the same whichever
// way the lens looks: the fog's own law and density taken on that distance: 1 while such a fog would leave the rock
// 93 parts in a hundred or more of its own light, 0 once it would leave 72 or fewer; with the moods' fogs that is
// whole to 9 to 14 m and gone by 19 to 29 m). Farther off there is no shade and the fog takes a dark rock toward the
// water's blue, as it always did.
uniform vec3 uShade;
float wfgNear(float d){
  #if defined(USE_FOG) && defined(FOG_EXP2)
    return smoothstep(0.72, 0.93, exp(-fogDensity*fogDensity*d*d));
  #else
    return 1.0;
  #endif
}
vec3 wfgShade(vec3 col, float d){ vec3 sh = uShade*wfgNear(d); return pow(col*col*col + sh*sh*sh, vec3(1.0/3.0)); }
vec3 wLit(vec3 alb, vec3 n, vec3 p, float ao, float vivid){
  float ndl = dot(n, uKeyDir);
  float key = smoothstep(-0.30, 1.0, ndl); key *= key; key *= wfgCloud(p);
  vec3 hemi = mix(uBounce, uSky, smoothstep(-1.0, 1.0, n.y));
  vec3 hemiW = vec3(dot(hemi, vec3(0.25, 0.5, 0.25)))*1.6;
  vec3 amb = mix(hemi, hemiW, vivid);
  vec3 col = alb*(uKey*key*mix(0.45, 1.0, ao) + amb*mix(0.30, 1.0, ao));
  return mix(col, uShadow*(0.6 + 0.8*alb.g), (1.0 - ao)*0.35*(1.0 - key));
}
`,Da=`
varying vec3 vDir;
void main(){
  vDir = position;
  vec4 p = projectionMatrix*vec4(mat3(modelViewMatrix)*position, 1.0);
  if (abs(p.w) < 1e-4) p.w = 1e-4;
  gl_Position = p.xyww;
}`,qa=`
varying vec3 vDir;
uniform vec3 uFogCol; uniform vec4 uFogLow; uniform vec4 uFogUp; uniform vec3 uGlow; uniform vec3 uGlowDir; uniform float uTime;
${re.noise}
void main(){
  vec3 d = normalize(vDir + ${le});
  vec3 col = mix(uFogCol, uFogLow.rgb, uFogLow.a*(1.0 - smoothstep(-0.8, -0.05, d.y)));
  col = mix(col, uFogUp.rgb, uFogUp.a*smoothstep(-0.04, 0.8, d.y));
  float c = max(dot(d, uGlowDir), 0.0);
  float spot = smoothstep(0.58, 1.0, c); spot = spot*spot;
  float wide = smoothstep(0.0, 1.0, c);
  float breathe = 1.0 + 0.04*sin(uTime*0.698);
  float dap = 0.82 + 0.36*wfgNoise(vec3(d.xz*3.0/max(d.y + 0.35, 0.2), uTime*0.16));
  col += uGlow*(0.50*spot*dap + 0.20*wide*wide)*breathe;
  float hz = wfgFbm(vec3(d.xz*2.3/max(abs(d.y) + 0.5, 0.3), uTime*0.035 + d.y*1.7));
  col *= 0.90 + 0.20*hz;
  gl_FragColor = vec4(col, 1.0);
}`,Ea=`
attribute vec3 aG;       // rock 0..1, ao, unused (0)
varying vec3 vPos; varying vec3 vN; varying vec3 vG;
uniform vec3 uCamL;
${re.fogParsVert}
void main(){
  vPos = position; vN = normal; vG = aG;
  vec4 mvPosition = modelViewMatrix*vec4(position, 1.0);
  ${nt}
  vFogY = normalize(position - uCamL + ${le}).y;
}`,Ga=`
varying vec3 vPos; varying vec3 vN; varying vec3 vG;
uniform vec3 uSilt; uniform vec3 uMatA; uniform vec3 uMatB; uniform float uMatAmt; uniform float uTime;
uniform vec3 uRock; uniform vec3 uPink; uniform vec3 uYellow; uniform vec4 uProw;     // the entry prow: x, z, reach, unused
uniform vec4 uPale;      // a patch of paler silt: x, z, reach, gain
uniform vec4 uFall;      // the fall's own ellipse on the bed (centre x, z, half length, half width): the mat lies in pale-rimmed patches that thicken toward it
uniform vec3 uFoot;      // the wall's foot: the height of the terrace's silt at the foot of the cliff, how far up its bounce reaches (u), its strength
uniform vec2 uCrustLit;  // the wall's growth: its albedo's gain near by, and how much of the rock a plate hides (its thickness)
uniform vec4 uTree;      // the entry tree: its foot on the prow, and its height (u)
${Tt}
${re.bedTone}
// THE WALL'S PLATES, one size of them: a ball of growth to a jittered cell of a turned lattice (as the coral's polyps
// are dealt: no rows, no print), there or not by the growth's density, of its own drawn size, its edge pushed in and
// out by up to three tenths of its radius by a grain finer than itself (wob: lobes and a ragged rim, no disc). The
// rock's face cuts the balls, so the plates of one size of cell run from the ball's own width down to nothing. A
// plate is all pink or all gold (pinkShare: how many are pink here). seen: 1 where the pixel sees the plates, going
// to 0 as its footprint grows from a quarter of the cell to two thirds of it: then the cell's mean cover stands in
// (0.238: the mean share of a cell that its ball fills). Returns (pink, gold).
vec2 wfgPlate(vec3 q, float dens, float pinkShare, float wob, float seen){
  vec3 ci = floor(q);
  float there = 0.2 + 0.8*dens, sz = mix(0.7, 1.0, dens);
  float r = mix(0.24, 0.5, wfgHash(ci + 23.0))*sz;
  vec3 o = (vec3(wfgHash(ci), wfgHash(ci + 17.0), wfgHash(ci + 31.0)) - 0.5)*2.0*(0.5 - r);
  float d = length(fract(q) - 0.5 - o) + (wob - 0.5)*r;
  float c = (1.0 - smoothstep(0.86*r, r, d))*step(wfgHash(ci + 41.0), there);
  float isPink = step(wfgHash(ci + 5.0), pinkShare);
  return mix(there*0.238*sz*sz*sz*vec2(pinkShare, 1.0 - pinkShare), c*vec2(isPink, 1.0 - isPink), seen);
}
void main(){
  vec3 q = vec3(vPos.x, 0.0, vPos.z);
  float n1 = wfgFbm(q*0.22), n2 = wfgNoise(q*1.7 + 4.0), n3 = wfgNoise(q*7.0);
  float vl = length(uCamL - vPos);
  vec3 gn = normalize(vN + ${le});
  float rock = smoothstep(0.35, 0.65, vG.x + (n2 - 0.5)*0.3);
  float up = smoothstep(0.55, 0.9, gn.y);
  float near = 1.0 - smoothstep(24.0, 95.0, vl);
  // current ripples: the same wave as the hero's bed, so the two join without a seam
  float rp = vPos.x*3.14159 + (n1 - 0.5)*7.0 + sin(vPos.z*0.35)*1.2;
  float rip = sin(rp), ripd = cos(rp);
  float ripAmt = (1.0 - smoothstep(30.0, 110.0, vl))*(1.0 - rock)*up;
  vec3 n = normalize(gn + vec3(-ripd*0.33*ripAmt, 0.0, (n2 - 0.5)*0.30*ripAmt) + ${le});
  vec2 dpl = (vPos.xz - uPale.xy)/max(uPale.z, 1.0);
  vec3 silt = uSilt*(0.72 + 0.4*n1 + 0.12*n3 + 0.07*rip*ripAmt)*(1.0 + uPale.w*exp(-dot(dpl, dpl)));
  // burrows: pin holes with pale rims, and darker drifts of fallen snow in the troughs
  float bur = wfgNoise(q*3.1 + 31.0);
  float nearB = 1.0 - smoothstep(10.0, 42.0, vl);
  float hole = smoothstep(0.905, 0.93, bur)*nearB, rimB = smoothstep(0.80, 0.905, bur)*(1.0 - hole)*nearB;
  silt *= 1.0 + 0.22*rimB;
  silt = mix(silt, silt*0.5, hole*0.6);
  silt *= 0.78 + 0.44*smoothstep(0.3, 0.7, wfgNoise(q*0.06 + 12.0));
  // the trails animals have left: soft meandering furrows
  float tr1 = abs(wfgNoise(q*0.085 + 50.0) - 0.5), tr2 = abs(wfgNoise(q*0.14 + 71.0) - 0.5);
  float trail = (1.0 - smoothstep(0.0, 0.05, tr1)) + 0.7*(1.0 - smoothstep(0.0, 0.065, tr2));
  silt *= 1.0 - 0.11*min(trail, 1.0)*(1.0 - smoothstep(90.0, 170.0, vl));
  // stray rags of bacterial mat away from the bones
  // (the patch fields are read at a point pushed about by finer noise and carry fine grain of their own, and every
  // edge is a wide soft band: a patch feathers into the silt, with no step of one octave's lattice in its outline)
  vec3 qw = q + vec3(wfgNoise(q*1.3 + 8.0) - 0.5, 0.0, n2 - 0.5)*1.9 + vec3(wfgNoise(q*4.3 + 2.0) - 0.5, 0.0, n3 - 0.5)*0.5;
  float fineM = (n3 - 0.5)*0.07 + (wfgNoise(q*2.9 + 15.0) - 0.5)*0.06;
  float p1 = wfgFbm(qw*0.42 + 9.0);
  vec2 dfl = (vPos.xz - uFall.xy)/max(uFall.zw, vec2(1.0));
  float mz = (1.0 - smoothstep(0.85, 2.3, length(dfl)))*(1.0 - rock);      // 1 at the edge of the stain, falling to nothing a fall's length away on every side
  float pm = p1 + fineM + 0.10*mz;
  float mat = smoothstep(0.63, 0.79, pm)*min(uMatAmt, 1.0)*near;
  vec3 matCol = mix(uMatA, uMatB, smoothstep(0.42, 0.58, wfgNoise(q*0.21 + 3.0)));
  float mrim = smoothstep(0.575, 0.665, pm)*(1.0 - smoothstep(0.665, 0.77, pm))*mz*near;      // a ragged pale rim round each patch
  silt = mix(silt, uSilt*vec3(1.55, 1.58, 1.50)*(0.8 + 0.4*n3), mrim*0.55);
  silt = mix(silt, matCol*(0.6 + 0.4*n3), mat*(0.40 + 0.35*mz)*(0.88 + 0.12*sin(uTime*0.8 + n2*20.0)));
  // toward the fall the mat also lies in broader sheets, 8 to 15 u across, lacy inside (windows of silt), each with a
  // ragged pale rim: they read from high on the dive, where the small rags have melted away
  float p2 = wfgFbm(qw*0.15 + 27.0) + 0.05*mz + 0.6*fineM;
  float far2 = 1.0 - smoothstep(120.0, 210.0, vl);
  float sheet = smoothstep(0.58, 0.67, p2)*mz*far2*min(uMatAmt, 1.0);
  float srim = smoothstep(0.53, 0.60, p2)*(1.0 - smoothstep(0.60, 0.675, p2))*mz*far2;
  silt = mix(silt, uSilt*vec3(1.50, 1.54, 1.46)*(0.85 + 0.3*n3), srim*0.45);
  silt = mix(silt, matCol*(0.62 + 0.38*n3), sheet*smoothstep(0.36, 0.56, p1 + 0.2*(n2 - 0.5))*0.55*(0.9 + 0.1*sin(uTime*0.7 + n2*17.0)));
  silt = wfgBedTone(silt);                                                     // the bed's tone (the hero's law): silt, rims and mat keep under the chalk
  // basalt: columns, cracks, silt on every ledge, crusts of pink, yellow and white life
  // fp: the pixel's own footprint on the rock (units of rock under one pixel, longer where the face is seen aslant).
  // Grain finer than the footprint is faded to its mean by it, at every range and every picture size.
  float fp = max(length(dFdx(vPos)), length(dFdy(vPos)));
  float r1 = wfgFbm(vPos*0.13), r2 = wfgNoise(vPos*0.9), r3 = mix(0.5, wfgNoise(vPos*4.0), 1.0 - smoothstep(0.08, 0.25, fp));
  float colm = wfgNoise(vec3(vPos.x*0.55, vPos.y*0.07, vPos.z*0.55));
  float crack = 1.0 - smoothstep(0.0, 0.09, abs(colm - 0.5));
  float strat = 0.85 + 0.3*wfgNoise(vec3(vPos.x*0.03, vPos.y*0.5, vPos.z*0.03));
  vec3 bas = uRock*(0.45 + 0.9*r1 + 0.6*r2*r3)*strat;
  bas *= 1.0 - 0.28*crack*(1.0 - up);
  vec2 dpw = (vPos.xz - uProw.xy)/max(uProw.z, 1.0);
  float pw = exp(-dot(dpw, dpw));                                              // round the entry prow the ledges are dusted paler and crusted thicker
  // the silt that lies on a ledge's top (ledge): the top faces the key and its silt is as pale as the bed's
  float ledge = smoothstep(0.30, 0.8, gn.y)*smoothstep(0.2 - 0.12*pw, 0.55 - 0.15*pw, r2 + 0.3*r3)*0.9;
  bas = mix(bas, silt*(0.9 + 0.55*pw), ledge);
  float c1 = wfgNoise(vPos*0.62 + 17.0), c2 = wfgNoise(vPos*0.85 + 41.0), c3 = wfgNoise(vPos*1.9 + 63.0);
  float side = 1.0 - 0.6*up;
  float zone = wfgNoise(vPos*0.11 + 5.0), cz1 = smoothstep(0.30, 0.55, zone);      // crusts gather in zones, not everywhere
  // THE WALL, by place (wallK): 1 on the cliff's face (within 14 u of the line the cliff is built on, fading out by 22 u)
  // and under its overhang (above y 84 to 92), 0 on the bed's own rock: the outcrops and the slope. A prow that stands
  // out from the face fades with it: the entry prow's top is whole at its tree's foot (14.3 u out) and about a third
  // (0.35) at its tip (18.8 u out).
  // wk: the wall near by (wallK by wfgNear). What follows for the wall near by leaves the bed's rock and every far rock
  // as they were.
  float ww = vPos.x - 94.0, wallZ = -88.0 - 0.5*(ww + sqrt(ww*ww + 144.0));
  float wallK = max(1.0 - smoothstep(14.0, 22.0, vPos.z - wallZ), smoothstep(84.0, 92.0, vPos.y));
  float wk = wallK*wfgNear(vl);
  // the thin film of crust on the bed's rock and on far rock: the patches the crusts always lay in (pinkW, goldW,
  // whiteW), faded to their mean by the pixel's footprint
  float pinkW = smoothstep(0.68 - 0.07*pw, 0.75 - 0.07*pw, c1 + 0.12*r3)*0.6*side*max(cz1, pw);
  float goldW = smoothstep(0.73 - 0.06*pw, 0.79 - 0.06*pw, c2 + 0.10*r3)*0.7*side*(1.0 - 0.6*cz1);
  float whiteW = smoothstep(0.82, 0.86, c3)*0.7*(1.0 - smoothstep(0.18, 0.50, fp));
  float kPatch = 1.0 - smoothstep(0.5, 1.3, fp);
  float pinkK = mix(0.09*side*max(cz1, pw), pinkW, kPatch), goldK = mix(0.06*side*(1.0 - 0.6*cz1), goldW, kPatch);
  // THE WALL'S GROWTH (the wall near by): it grows where growth grows, by one law for the whole wall (no part of the
  // wall is favoured: its threshold leaves about four tenths of the wall near by, by area, with no growth at all). dens:
  // a slow field of the place (zone, 9 u or 2.3 m to a cell, its edge ragged by the basalt's own relief field r1) says
  // where a patch is, and the rock's own facing how dense: full on a ledge's top and a face turned up, half on a sheer flank
  // and there only in a patch's heart, nothing on an underside. Inside a patch the growth stands in plates of three
  // sizes of cell (4.2, 1.5 and 0.55 u: plates from a metre across down to a few centimetres, few big, many small), pink
  // or gold plate by plate (sp: a slower field says which leads), bare basalt between them. Each size fades to its mean
  // cover by the pixel's own footprint. Under the entry tree the colony shades the crust out: no growth within a fifth
  // of the tree's height of its foot, the wall's own growth again from three fifths of it.
  float dens = 0.0;
  if (wk > 0.001) {
    float lean = smoothstep(-0.15, 0.45, gn.y);
    dens = smoothstep(0.38, 0.56, zone + 0.30*(r1 - 0.5) + 0.30*(lean - 0.5))*smoothstep(-0.30, 0.0, gn.y)*mix(0.5, 1.0, lean);
    dens *= smoothstep(0.2*uTree.w, 0.6*uTree.w, length(vPos - uTree.xyz));
    float sp = smoothstep(0.30, 0.70, wfgNoise(vPos*0.07 + 31.0));
    vec3 pq = vec3(dot(vPos, vec3(0.80, 0.36, -0.48)), dot(vPos, vec3(-0.12, 0.88, 0.46)), dot(vPos, vec3(0.59, -0.31, 0.75)));
    vec2 g1 = wfgPlate(pq/4.2, dens, sp, 0.65*c1 + 0.35*c3, 1.0 - smoothstep(1.0, 2.9, fp));
    vec2 g2 = wfgPlate(pq/1.5, dens, sp, 0.65*c3 + 0.35*r3, 1.0 - smoothstep(0.38, 1.05, fp));
    vec2 g3 = wfgPlate(pq/0.55, dens, sp, r3, 1.0 - smoothstep(0.14, 0.38, fp));
    vec2 grow = (1.0 - (1.0 - g1)*(1.0 - g2)*(1.0 - g3))*(uCrustLit.y*smoothstep(0.02, 0.12, dens));
    pinkK = mix(pinkK, grow.x, wk); goldK = mix(goldK, grow.y, wk);
    whiteW *= mix(1.0, smoothstep(0.1, 0.5, dens), wk);                         // the white specks keep to the patches
  }
  float gain = 1.0 + (uCrustLit.x - 1.0)*wk;
  vec3 pinkC = mix(uPink, vec3(0.5, 0.3, 0.4), 0.4)*0.30*(0.6 + 0.7*r3)*gain, goldC = uYellow*0.40*(0.6 + 0.6*r3)*gain;
  bas = mix(bas, pinkC, pinkK);
  bas = mix(bas, goldC, goldK);
  bas = mix(bas, vec3(0.40, 0.42, 0.40)*(0.7 + 0.5*r3), whiteW);
  vec3 alb = mix(silt, bas, rock);
  // THE BASALT'S LIGHT, one law for every rock face of the ground (the cliff along the entry, its overhang, the wall past
  // the tail, the outcrops, the slope). The crust is albedo and nothing more: it takes the rock's own light, by the
  // same normal, key, occlusion and shadow as the basalt it grows on (wLit), bright on a ledge's top and a face turned
  // up, falling with the rock to the shade on a flank and in a recess. A ledge's top takes the key and wears the bed's
  // silt. On the wall near by (wk) the pale silt at its foot throws its bounce up the first metres of the face (uFoot:
  // faces that stand upright or look down take it, a top or a slope does not). What is left in shade falls to the
  // mood's shadow colour and stops there, near by (wfgShade).
  vec3 col = wLit(alb, n, vPos, vG.y, 0.8*rock);
  float footK = exp(-abs(vPos.y - uFoot.x)/max(uFoot.y, 1.0))*(1.0 - smoothstep(0.0, 0.5, gn.y))*wk;
  col = mix(col, wfgShade(col + alb*uBounce*(uFoot.z*footK), vl), rock);
  gl_FragColor = vec4(col, 1.0);
  ${re.fogFrag}
}`,Oa=`
attribute vec4 aSway;    // pivot xyz, reach of the sway in units
attribute float aK;      // 0 coral, 1 sponge, 2 anemone, 3 rock
varying vec3 vCol; varying vec3 vPos; varying vec3 vN; varying vec2 vK; varying vec3 vRest; varying vec2 vWall;
${re.light}
${re.plush}
${re.fogParsVert}
void main(){
  vec3 p = position;
  // vWall.x: 1 for a thing rooted in the cliff's own face or at its very foot: its pivot stands within 13 u of the cliff's foot line (the line
  // cliffZ is built on; between its foot and its overhang the face's relief stands at most 12 u out from that line),
  // or up under the overhang (above y 90). 0 for what stands out on a prow, a spur or the terrace.
  // vWall.y: how far the thing's own root stands on the wall's rock: the ground's own wallK (GROUND_FRAG) at its pivot,
  // 1 within 14 u of the cliff's line or above y 92, fading to 0 by 22 u out and under y 84. One rule for the hangers
  // and for whatever is rooted on the wall's ledges, prows or foot (the entry tree among them); what is rooted farther
  // out, on the terrace or the bed, takes none.
  float ww = aSway.x - 94.0, wallZ = -88.0 - 0.5*(ww + sqrt(ww*ww + 144.0));
  vWall.x = max(1.0 - smoothstep(12.6, 13.6, aSway.z - wallZ), smoothstep(90.0, 93.0, aSway.y));
  vWall.y = max(1.0 - smoothstep(14.0, 22.0, aSway.z - wallZ), smoothstep(84.0, 92.0, aSway.y));
  float w = aSway.w;
  float g = wfgGust(aSway.xyz);
  float ph = aSway.x*0.37 + aSway.z*0.23;
  float shy = 1.0 - 0.85*wfgBare(aSway.xyz)*step(1.5, aK)*step(aK, 2.5);
  vec3 lean = vec3(0.45 + 1.0*g, -0.14, 0.2*sin(uTime*0.6 + ph));
  float osc = 0.6 + 0.4*sin(uTime*0.8 + ph + p.y*0.3);
  p += (lean*osc + vec3(0.12, 0.0, 0.3)*sin(uTime*1.7 + ph*3.0 + p.x*1.3 + p.y*0.9))*w;
  p = mix(aSway.xyz, p, mix(1.0, shy, step(1e-4, w)));
  vCol = color; vPos = p; vN = normal; vK = vec2(aK, w); vRest = position;      // vRest: patterns stay on the skin while it sways
  vec4 mvPosition = modelViewMatrix*vec4(p, 1.0);
  ${nt}
  vFogY = normalize(p - uCamL + ${le}).y;
}`,$a=`
varying vec3 vCol; varying vec3 vPos; varying vec3 vN; varying vec2 vK; varying vec3 vRest; varying vec2 vWall;
uniform float uTime; uniform vec2 uWallCoral;
${Tt}
void main(){
  vec3 n = normalize(vN + ${le});
  if (!gl_FrontFacing) n = -n;
  vec3 vd = uCamL - vPos; float vl = length(vd); vec3 v = vd/max(vl, 1e-4);
  float n1 = wfgNoise(vRest*1.3), n2 = wfgNoise(vRest*5.5), n3 = wfgNoise(vRest*15.0), n4 = wfgNoise(vRest*5.5 + 9.0);
  float fine = 1.0 - smoothstep(22.0, 85.0, vl);
  float k = vK.x;
  float isCoral = 1.0 - smoothstep(0.4, 0.6, k), isSponge = 1.0 - smoothstep(0.4, 0.6, abs(k - 1.0));
  float isAnem = 1.0 - smoothstep(0.4, 0.6, abs(k - 2.0)), isRock = smoothstep(2.4, 2.6, k);
  n = normalize(n + (vec3(n2, n3, n4) - 0.5)*fine*(0.55*isCoral + 0.4*isSponge + 0.5*isRock) + ${le});
  vec3 alb = vCol*(0.80 + 0.28*n1 + 0.14*(n2 - 0.5));
  alb *= 1.0 + uWallCoral.x*vWall.x*isCoral;                                   // the coral hung off the cliff is lit pale pink from above as the entry tree is (the tree's own paleness)
  // polyps: round, one to a jittered cell, standing proud of the branch (the normal leans out round each), pale with a
  // darker mouth, opening and closing in turn; beyond about 45 u they melt into a soft mottle
  float pNear = (1.0 - smoothstep(14.0, 46.0, vl))*isCoral;
  // (the lattice is turned off the axes; a third of the cells are empty; each polyp has its own size, 0.10 to 0.27 of a
  // cell, and the small ones stray further from the cell's middle: no two rows alike, nothing like a print)
  vec3 pq = vec3(dot(vRest, vec3(0.80, 0.36, -0.48)), dot(vRest, vec3(-0.12, 0.88, 0.46)), dot(vRest, vec3(0.59, -0.31, 0.75)))*4.3;
  vec3 pci = floor(pq);
  float pr0 = 0.10 + 0.17*wfgHash(pci + 23.0);
  vec3 pv = fract(pq) - 0.5 - (vec3(wfgHash(pci), wfgHash(pci + 17.0), wfgHash(pci + 31.0)) - 0.5)*2.0*(0.47 - pr0);
  float pd = length(pv);
  float open = 0.5 + 0.5*sin(uTime*0.9 + wfgHash(pci + 5.0)*6.2831853 + vRest.y*0.8);
  float pr = pr0*(0.72 + 0.28*open);
  float polyp = (1.0 - smoothstep(pr - 0.04, pr + 0.03, pd))*pNear*step(0.34, wfgHash(pci + 41.0));
  n = normalize(n + pv*(polyp*smoothstep(0.03, pr, pd)*1.6/max(pd, 0.04)) + ${le});
  alb = mix(alb, vec3(0.80, 0.74, 0.70), polyp*(0.45 + 0.55*open)*0.9);
  alb *= 1.0 - 0.45*polyp*(1.0 - smoothstep(0.02, 0.08, pd));
  float pol = smoothstep(0.60, 0.76, n3)*fine*isCoral*(1.0 - pNear);
  alb = mix(alb, vec3(0.74, 0.70, 0.66), pol*0.55);
  alb *= 1.0 - 0.55*smoothstep(0.66, 0.78, n2)*isSponge*fine;                  // sponge pores
  // THE ANEMONE'S PLUME: the white anemone's head is no plain white ball. It is lobed like a cauliflower (dark creases
  // between lobes a fifth of a unit across, n2) and feathered (the plume's own grain, n3), and it stands a step under the
  // chalk's lit tops (its lit side ends in a soft shoulder of its own, below). Each grain is faded to its mean by the
  // pixel's own footprint on it (fpA), at every range and size
  float fpA = max(length(dFdx(vRest)), length(dFdy(vRest)));
  float lobe = 1.0 - smoothstep(0.0, 0.10, abs(n2 - 0.5));
  alb *= 1.0 - isAnem*(1.0 - mix(0.86, 1.0 - 0.55*lobe, 1.0 - smoothstep(0.05, 0.16, fpA))*mix(0.72, 0.50 + 0.44*n3, 1.0 - smoothstep(0.02, 0.07, fpA)));
  alb *= 1.0 - isRock*(0.5*smoothstep(0.5, 0.7, n2));
  vec3 col = wLit(alb, n, vPos, 1.0, 0.7*(1.0 - isRock));
  float rim = 1.0 - abs(dot(n, v)); rim = rim*rim*rim;
  col += alb*uKey*rim*(0.25 + 0.75*smoothstep(-0.2, 0.8, n.y))*(0.50*isCoral + 0.55*isAnem + 0.15*isSponge);
  col += vCol*uKey*0.23*isCoral;                                               // the top light soaks through the soft coral: candy pink, never grey
  col += alb*uBounce*(uWallCoral.y*vWall.y*isCoral);                           // THE WALL'S BOUNCE ON ITS CORAL: the wall is lit rock now, no black, and throws the water's bounce back on every coral rooted on its rock (vWall.y), one strength for all
  float mxA = max(col.r, max(col.g, col.b));                                   // the anemone's shoulder: its lit side rolls off from 0.34 to 0.52 at most,
  col *= mix(1.0, mxA > 0.34 ? (0.34 + 0.18*(1.0 - exp(-(mxA - 0.34)/0.18)))/mxA : 1.0, isAnem);      // a clear step under the chalk's 0.9 in every light
  col = mix(col, wfgShade(col, vl), isRock);                                       // boulders and stacks: the rock's shade (LIT)
  gl_FragColor = vec4(col, 1.0);
  ${re.fogFrag}
}`,_a=`
attribute vec4 iPos;     // xyz, scale
attribute vec4 iQuat;
attribute vec4 iDat;     // phase, pose, tint mix, speed
attribute vec4 aAnim;    // kind, phase, amount, unused
varying vec3 vCol; varying vec3 vPos; varying vec3 vN; varying vec3 vL;
uniform float uTime; uniform vec3 uCamL; uniform vec3 uTintA; uniform vec3 uTintB; uniform float uBob;
${re.fogParsVert}
vec3 qrot(vec4 q, vec3 v){ return v + 2.0*cross(q.xyz, cross(q.xyz, v) + q.w*v); }
void main(){
  vec3 p = position;
  float t = uTime*iDat.w + iDat.x;
  float kind = aAnim.x;
  if (kind > 0.5 && kind < 1.5) {
    float a = sin(t*6.0 + aAnim.y)*0.30*aAnim.z; float c = cos(a), s = sin(a);
    p.xz = vec2(c*p.x - s*p.z, s*p.x + c*p.z);
    p.y += max(0.0, cos(t*6.0 + aAnim.y))*0.07*aAnim.z;
  } else if (kind > 1.5 && kind < 2.5) {
    float lift = iDat.y*(0.42 + 0.22*sin(t*1.3 + aAnim.y)) + (1.0 - iDat.y)*0.16*max(0.0, sin(t*2.3 + aAnim.y));
    p.y += lift*aAnim.z; p.x -= lift*aAnim.z*0.35;
  } else if (kind > 2.5 && kind < 3.5) {
    p.z += sin(t*2.4 - p.x*1.5)*aAnim.z*0.2;
  } else if (kind > 3.5 && kind < 4.5) {
    p.y += aAnim.z*(0.08 + 0.10*sin(t*0.7 + aAnim.y));
  } else if (kind > 4.5) {
    p.y += aAnim.z*sin(t*1.5 + aAnim.y)*0.55*iDat.y;
  }
  vL = position;
  vec3 wp = iPos.xyz + qrot(iQuat, p*iPos.w);
  wp.y += uBob*sin(uTime*0.5 + iDat.x*3.0);
  vN = qrot(iQuat, normal); vPos = wp;
  vCol = color*mix(uTintA, uTintB, iDat.z);
  vec4 mvPosition = modelViewMatrix*vec4(wp, 1.0);
  ${nt}
  vFogY = normalize(wp - uCamL + ${le}).y;
}`,Ka=`
varying vec3 vCol; varying vec3 vPos; varying vec3 vN; varying vec3 vL;
uniform float uGloss;
${Tt}
void main(){
  vec3 n = normalize(vN + ${le});
  if (!gl_FrontFacing) n = -n;
  vec3 vd = uCamL - vPos; float vl = length(vd); vec3 v = vd/max(vl, 1e-4);
  float fine = 1.0 - smoothstep(10.0, 45.0, vl);
  float m1 = wfgNoise(vL*7.0 + 3.0), m2 = wfgNoise(vL*23.0);
  vec3 alb = vCol*(0.82 + 0.3*(m1 - 0.5)*fine + 0.2*(m2 - 0.5)*fine);
  n = normalize(n + (vec3(m2, m1, wfgNoise(vL*23.0 + 5.0)) - 0.5)*0.3*fine + ${le});
  vec3 col = wLit(alb, n, vPos, 0.55 + 0.45*smoothstep(-0.6, 0.4, n.y), 0.75);
  float rim = 1.0 - abs(dot(n, v)); rim = rim*rim;
  col += alb*uKey*rim*0.22*(0.3 + 0.7*smoothstep(-0.2, 0.8, n.y));
  float spec = max(dot(reflect(-uKeyDir, n), v), 0.0); spec *= spec; spec *= spec; spec *= spec;
  col += uKey*spec*uGloss;
  gl_FragColor = vec4(col, 1.0);
  ${re.fogFrag}
}`,Wa=`
attribute vec4 iPos;     // xyz, arm length
attribute vec4 iDat;     // yaw, phase, tint, lean
varying vec3 vCol; varying float vT;
uniform vec3 uTintA; uniform vec3 uTintB; uniform float uPx;
${re.light}
${re.plush}
${re.fogParsVert}
void main(){
  float arm = position.x, t = position.y, sd = position.z;
  float a = iDat.x + arm*2.2 + 0.6*sin(arm*5.0 + iDat.y);
  float g = wfgGust(iPos.xyz);
  vec3 d0 = vec3(cos(a)*0.5, 0.86, sin(a)*0.5);
  vec3 flow = vec3(0.55 + 0.9*g, -0.25, 0.0)*iDat.w;
  float wv = sin(uTime*1.5 + iDat.y + arm*2.1 - t*3.2)*0.34*t + sin(uTime*0.6 + iDat.y*2.0 + arm)*0.18*t;
  vec3 sidew = vec3(-sin(a), 0.0, cos(a));
  vec3 c = iPos.xyz + iPos.w*(d0*t + flow*t*t*0.6 + sidew*wv + vec3(0.0, 0.10*sin(uTime*1.1 + iDat.y + arm*3.0)*t, 0.0));
  vec3 tang = normalize(d0 + flow*t*1.2 + sidew*wv*0.8 + ${le});
  vec3 vd0 = uCamL - iPos.xyz; float farK = 1.0 - smoothstep(38.0, 78.0, length(vd0));
  c = mix(iPos.xyz, c, farK);
  vec3 vd = uCamL - c; float dist = length(vd);
  vec3 sdv = normalize(cross(tang, vd/max(dist, 1e-4)) + ${le});
  float wid = max(0.034*iPos.w*(1.0 - 0.75*t), dist*uPx*0.8)*farK;
  vec3 p = c + sdv*sd*wid;
  float thin = clamp(0.034*iPos.w/max(dist*uPx*0.8, 1e-5), 0.25, 1.0);
  vec3 base = mix(uTintA, uTintB, iDat.z);
  vec3 hemi = mix(uBounce, uSky, 0.8);
  vec3 hemiW = vec3(dot(hemi, vec3(0.25, 0.5, 0.25)))*1.6;
  vCol = base*(uKey*(0.30 + 0.45*t)*wfgCloud(c) + mix(hemi, hemiW, 0.7))*mix(0.5, 1.0, thin);
  vT = t;
  vec4 mvPosition = modelViewMatrix*vec4(p, 1.0);
  ${nt}
  vFogY = normalize(p - uCamL + ${le}).y;
}`,Ua=`
varying vec3 vCol; varying float vT;
${re.fogParsFrag}
void main(){
  float band = 0.82 + 0.18*sin(vT*40.0);
  gl_FragColor = vec4(vCol*band, 1.0);
  ${re.fogFrag}
}`,Qo=`
attribute vec4 aB;       // t along the body (0 snout .. 1 tail tip), lateral -1..1, height -1 belly .. 1 back, fin 0/1
varying vec3 vPos; varying vec3 vN; varying vec3 vL; varying vec4 vB;
uniform vec3 uCamL; uniform vec4 uSwim; uniform float uLen;     // uSwim: phase, amplitude, bend, unused
${re.fogParsVert}
void main(){
  vec3 p = position;
  float t = aB.x;
  float amp = uSwim.y*(0.010 + 0.10*t*t)*uLen;
  float ph = uSwim.x - t*5.4;
  float xr = max(0.0, 0.32*uLen - p.x);
  p.z += amp*sin(ph) + uSwim.z*xr*xr/uLen;
  float sl = amp*cos(ph)*5.4/uLen - 2.0*uSwim.z*xr/uLen;       // dz/dx, to turn the normal with the body
  vec3 nn = normalize(vec3(normal.x - normal.z*sl, normal.y, normal.z + normal.x*sl) + ${le});
  vec4 wp = modelMatrix*vec4(p, 1.0);
  vPos = wp.xyz; vN = mat3(modelMatrix)*nn; vL = position; vB = aB;
  vec4 mvPosition = viewMatrix*wp;
  ${nt}
  vFogY = normalize(wp.xyz - uCamL + ${le}).y;
}`,Zo=`
varying vec3 vPos; varying vec3 vN; varying vec3 vL; varying vec4 vB;
uniform vec3 uTop; uniform vec3 uBelly; uniform vec3 uEye; uniform float uFeat; uniform float uTime; uniform float uLen; uniform float uBG;
${Tt}
// freckles: one round spot to a jittered cell, of mixed size, two thirds of the cells filled (never square)
float frk(vec3 p){
  vec3 i = floor(p); vec3 f = fract(p) - 0.5 - (vec3(wfgHash(i), wfgHash(i + 13.0), wfgHash(i + 29.0)) - 0.5)*0.5;
  float r = 0.17 + 0.20*wfgHash(i + 7.0);
  return (1.0 - smoothstep(r*0.65, r, length(f)))*step(0.34, wfgHash(i + 3.0));
}
void main(){
  vec3 n = normalize(vN + ${le});
  if (!gl_FrontFacing) n = -n;
  vec3 vd = uCamL - vPos; float vl = length(vd); vec3 v = vd/max(vl, 1e-4);
  float tb = vB.x, lat = vB.y, hgt = vB.z, fin = min(vB.w, 1.0), finU = clamp(vB.w - 1.0, 0.0, 1.0);      // finU: 0 leading edge .. 1 trailing edge
  vec3 ls = vL*(20.0/max(uLen, 1.0));
  float m1 = wfgFbm(ls*0.55), m2 = wfgNoise(ls*2.6 + 7.0), m3 = wfgNoise(ls*9.0);
  float fine = 1.0 - smoothstep(25.0, 90.0, vl);
  float head = (1.0 - smoothstep(0.0, 0.25, tb))*uFeat;
  // brown-grey above, pale below: the pale of the belly comes well up the lower flank and under the whole head
  float back = smoothstep(-0.72, 0.16, hgt + 0.3*(m1 - 0.5) + 0.10*head);
  // a paired fin (pectoral, pelvic: hgt runs -0.62 at its root to -0.3) carries the belly's pale tone onto the underside of its root
  float pfin = fin*step(-0.9, hgt)*step(hgt, -0.25)*(1.0 - smoothstep(-0.4, 0.1, n.y))*(1.0 - smoothstep(-0.62, -0.34, hgt));
  vec3 alb = mix(uBelly, uTop, max(back, fin*(1.0 - 0.85*pfin)));
  alb *= 0.78 + 0.34*m1 + 0.12*(m3 - 0.5)*fine;
  // freckles on the back and flanks: small round spots of two sizes (frk above)
  float fq = 0.4 + 0.6*fine;
  float fr = max(frk(ls*2.3 + 7.0), 0.85*frk(ls*3.9 + 2.0))*fq;
  alb *= 1.0 - 0.58*fr*(0.35 + 0.65*back)*uFeat;
  alb *= 1.0 - 0.40*max(frk(ls*2.7 + 31.0), 0.8*frk(ls*4.4 + 3.0))*fq*(1.0 - back)*(1.0 - fin)*uFeat;            // the freckles carry on under the belly, fainter
  alb *= 1.0 - 0.45*smoothstep(0.45, 1.0, finU)*fin*(1.0 - 0.6*pfin);                                       // fins darken to the trailing edge
  alb = mix(alb, uBelly*0.8, smoothstep(0.74, 0.80, wfgNoise(ls*3.4 + 19.0))*0.30*back*(1.0 - head)*uFeat);
  float ndv0 = abs(dot(n, v));
  // six gill slits each side: long dark curved bars from under the throat (they all but meet below) up the flank
  // behind the jaw, each with a pale flap edge behind it, pumping in turn. gw is how many slits one pixel spans:
  // before they could break into dots they melt into one soft shade. They fade where the skin turns edge-on to the
  // lens, except underneath, where the lens looks up at them as the fish comes over
  float gs = (tb - 0.170 - 0.018*hgt*hgt + 0.006*hgt)/0.0165;
  float gw = fwidth(gs);
  float under = 1.0 - smoothstep(-0.5, 0.0, n.y);
  float slitMask = step(0.0, gs)*step(gs, 6.0)*smoothstep(0.05, 0.30, abs(lat))*(1.0 - smoothstep(0.20, 0.55, hgt))*(1.0 - fin)*uFeat*mix(smoothstep(0.02, 0.15, ndv0), 1.0, under);
  float gfr = fract(gs) - 0.5, gf = abs(gfr);
  float pump = 0.5 + 0.5*sin(uTime*1.5 - floor(gs)*0.55);
  float shw = 0.17 + 0.07*pump;
  float sharp = 1.0 - smoothstep(shw - 0.5*gw - 0.03, shw + 0.5*gw + 0.03, gf);
  float slit = mix(sharp, 2.0*shw, smoothstep(0.35, 0.9, gw))*slitMask;
  float flap = smoothstep(shw, shw + 0.06, gfr)*(1.0 - smoothstep(shw + 0.08, shw + 0.24, gfr))*slitMask*(1.0 - smoothstep(0.25, 0.6, gw));
  alb = mix(alb, alb*1.35 + 0.02, flap*0.6);
  alb = mix(alb, alb*0.13, slit*0.95);
  // the underslung mouth: a dark crescent under the snout, corners swept back, a pale lip ahead of it and behind
  float mz = 0.030 + 0.050*lat*lat;
  float mMask = smoothstep(0.30, 0.55, -hgt)*(1.0 - smoothstep(0.80, 0.97, abs(lat)))*(1.0 - fin)*uFeat;
  float mouth = (1.0 - smoothstep(0.0045, 0.0105, abs(tb - mz)))*mMask;
  float lip = max(1.0 - smoothstep(0.005, 0.017, abs(tb - mz + 0.014)), 0.6*(1.0 - smoothstep(0.004, 0.013, abs(tb - mz - 0.013))))*mMask*(1.0 - mouth);
  alb = mix(alb, uBelly*1.45, lip*0.75);
  alb = mix(alb, vec3(0.012, 0.010, 0.012), mouth*0.90);
  // nostril pits either side of the snout
  vec2 np = vec2((tb - 0.016)/0.007, (abs(lat) - 0.52)/0.13);
  float nost = (1.0 - smoothstep(0.55, 1.0, length(np)))*(1.0 - smoothstep(0.1, 0.45, abs(hgt + 0.05)))*(1.0 - fin)*uFeat;
  alb = mix(alb, vec3(0.015, 0.012, 0.012), nost*0.85);
  n = normalize(n + (vec3(m3, m2, wfgNoise(ls*9.0 + 4.0)) - 0.5)*0.22*fine + ${le});
  // light: the top light on the back; the bounce (pale light thrown up off bone and silt, uBG its gain) is strongest
  // straight below and wraps up the flanks and round the blunt head, because the lit ribs stand on either side: it is
  // what models the belly, the throat, the gills and the undersides of the fins. A cold rim from above on the back.
  float ndl = dot(n, uKeyDir);
  float key = smoothstep(-0.30, 1.0, ndl); key *= key; key *= wfgCloud(vPos);
  float dn = 1.0 - smoothstep(-1.0, 0.9, n.y);
  vec3 hemi = uBounce*uBG*dn*(0.5 + 0.5*dn) + uSky*smoothstep(-0.6, 1.0, n.y);
  vec3 hemiW = vec3(dot(hemi, vec3(0.25, 0.5, 0.25)))*1.6;
  vec3 col = alb*(uKey*key + mix(hemi, hemiW, 0.6));
  float rim = 1.0 - abs(dot(n, v)); rim = rim*rim*rim;
  col += (uBounce*uBG*0.6 + uSky*0.5)*rim*0.20*(0.4 + 0.6*min(alb.g*4.0, 1.4))*uFeat;
  col += uKey*rim*smoothstep(0.1, 0.9, n.y)*0.10;
  float spec = max(dot(reflect(-uKeyDir, n), v), 0.0); spec *= spec; spec *= spec; spec *= spec;
  col += uKey*spec*0.08*(1.0 - 0.7*head);
  // one fluorescent green eye each side
  vec2 e = vec2((tb - 0.064)/0.0105, (hgt - 0.06)/0.17);
  float ed = length(e);
  float eye = (1.0 - smoothstep(0.75, 1.0, ed))*smoothstep(0.45, 0.7, abs(lat))*(1.0 - fin)*uFeat;
  float pupil = 1.0 - smoothstep(0.10, 0.22, length(e*vec2(0.9, 2.2)));
  col = mix(col, uEye*(0.75 + 0.25*sin(uTime*2.1))*(1.0 - 0.9*pupil) + uKey*0.25*(1.0 - smoothstep(0.2, 0.5, length(e - vec2(0.3, 0.35)))), eye);
  gl_FragColor = vec4(col, 1.0);
  ${re.fogFrag}
}`,ja=`
attribute vec4 aC;       // body centre xyz, phase
attribute vec4 aO;       // part (0 mantle, 1 arm, 2 eye), along 0..1, around 0..1, arm phase
varying vec3 vPos; varying vec3 vN; varying vec4 vO; varying vec3 vL;
uniform float uTime; uniform vec3 uCamL;
${re.fogParsVert}
void main(){
  vec3 r = position - aC.xyz;
  float br = sin(uTime*1.15 + aC.w);
  float arm = step(0.5, aO.x)*step(aO.x, 1.5);
  r *= 1.0 + 0.075*br*mix(0.35 + 0.65*smoothstep(-0.3, 0.7, r.y), 0.22, arm);
  float al = aO.y;
  float cu = arm*al*al*0.26*sin(uTime*0.7 + aC.w*1.7 + aO.w + al*2.0);
  vec3 rn = normalize(vec3(r.x, 0.0, r.z) + vec3(1e-4, 0.0, 0.0));
  r += vec3(-rn.z, 0.0, rn.x)*cu + vec3(0.0, cu*0.6, 0.0);
  vec3 p = aC.xyz + r;
  vPos = p; vN = normal; vO = aO; vL = position - aC.xyz;
  vec4 mvPosition = modelViewMatrix*vec4(p, 1.0);
  ${nt}
  vFogY = normalize(p - uCamL + ${le}).y;
}`,Ia=`
varying vec3 vPos; varying vec3 vN; varying vec4 vO; varying vec3 vL;
uniform vec3 uSkin; uniform vec3 uUnder; uniform float uTime;
${Tt}
void main(){
  vec3 n = normalize(vN + ${le});
  if (!gl_FrontFacing) n = -n;
  vec3 vd = uCamL - vPos; float vl = length(vd); vec3 v = vd/max(vl, 1e-4);
  float fine = 1.0 - smoothstep(8.0, 40.0, vl);
  float m1 = wfgNoise(vL*3.1 + 5.0), m2 = wfgNoise(vL*11.0), m3 = wfgNoise(vL*27.0);
  float arm = step(0.5, vO.x)*step(vO.x, 1.5), eyeP = step(1.5, vO.x);
  vec3 alb = uSkin*(0.70 + 0.40*m1 + 0.18*(m2 - 0.5)*fine);
  // mottle (dark mauve blotches), pale papillae, and the creases of a soft wrinkled skin
  float blot = smoothstep(0.50, 0.70, wfgNoise(vL*5.3 + 13.0) + 0.25*(m2 - 0.5));
  alb = mix(alb, uSkin*vec3(0.50, 0.36, 0.58), blot*mix(0.35, 0.8, fine));
  alb = mix(alb, uSkin*vec3(1.25, 1.15, 1.2), smoothstep(0.70, 0.80, m3)*0.55*fine*(1.0 - blot));
  float wr = abs(wfgNoise(vL*vec3(8.0, 3.2, 8.0) + 2.0) - 0.5)*2.0;
  float crease = (1.0 - smoothstep(0.0, 0.16, wr))*fine*(1.0 - eyeP)*(1.0 - arm*0.6);
  alb *= 1.0 - 0.42*crease;
  // arms turned inside out: the pale underside outward, two rows of suckers
  float ar = vO.z, under = arm*(1.0 - smoothstep(0.16, 0.30, abs(ar - 0.5)));
  alb = mix(alb, uUnder*(0.85 + 0.2*m2), under);
  float rowA = abs(ar - 0.44), rowB = abs(ar - 0.56);
  float cell = fract(vO.y*20.0 + step(rowB, rowA)*0.5) - 0.5;
  float sd = length(vec2(min(rowA, rowB)/0.045, cell*1.9));
  float suck = (1.0 - smoothstep(0.55, 0.85, sd))*under*fine*(1.0 - smoothstep(0.85, 1.0, vO.y));
  alb = mix(alb, vec3(0.80, 0.76, 0.78), suck*0.9);
  alb = mix(alb, uUnder*0.35, (1.0 - smoothstep(0.12, 0.3, sd))*suck);
  n = normalize(n + (vec3(m2, m3, wfgNoise(vL*11.0 + 8.0)) - 0.5)*0.55*fine*(1.0 - eyeP) + ${le});
  vec3 col = wLit(alb, n, vPos, (0.5 + 0.5*smoothstep(-0.7, 0.3, n.y))*(1.0 - 0.35*crease), 0.8);
  float ndv = abs(dot(n, v));
  float rim = 1.0 - ndv; rim = rim*rim;
  col += uSkin*uKey*rim*0.28*(0.3 + 0.7*smoothstep(-0.2, 0.8, n.y));
  float spec = max(dot(reflect(-uKeyDir, n), v), 0.0); spec *= spec; spec *= spec; spec *= spec; spec *= spec;
  col += uKey*spec*0.22;
  // the eye (vO.y = height on the eyeball, -1..1): a hood of skin over its top, a pale gold iris, and a dark
  // horizontal slit of pupil across the part that faces whoever looks
  vec3 iris = vec3(0.62, 0.52, 0.30)*(uKey*0.5 + 0.35)*(0.8 + 0.4*m2);
  float pup = (1.0 - smoothstep(0.10, 0.24, abs(vO.y + 0.05)))*smoothstep(0.30, 0.62, ndv);
  float hood = smoothstep(0.30, 0.52, vO.y + 0.25*(m1 - 0.5));
  vec3 eyeCol = mix(iris, vec3(0.01, 0.01, 0.015), pup) + uKey*spec*0.5;
  col = mix(col, mix(eyeCol, col*0.8, hood), eyeP);
  gl_FragColor = vec4(col, 1.0);
  ${re.fogFrag}
}`,Ha=`
attribute vec4 iPos;     // xyz, length
attribute vec4 iDat;     // yaw, phase, tint, speed
varying vec3 vCol; varying vec3 vPos; varying vec3 vN; varying float vS;
uniform float uTime; uniform vec3 uCamL; uniform vec3 uTintA; uniform vec3 uTintB;
${re.fogParsVert}
vec3 hagC(float s, float t, float k){
  float w = 6.2831853*s;
  vec3 loose = vec3((s - 0.5), 0.10 + 0.05*sin(w*1.5 + t*0.8), 0.13*sin(w*1.2 - t*1.6));
  vec3 knot = vec3(0.22*sin(w) + 0.30*sin(w*2.0 + t*0.3), 0.16 + 0.12*cos(w*3.0), 0.22*cos(w) - 0.30*cos(w*2.0 + t*0.3))*0.62;
  return mix(loose, knot, k);
}
void main(){
  float s = position.x, t = uTime*iDat.w + iDat.y;
  float k = smoothstep(-0.15, 0.75, sin(t*0.42 + iDat.y*3.0));
  vec3 c = hagC(s, t, k);
  vec3 tg = normalize(hagC(s + 0.02, t, k) - hagC(s - 0.02, t, k) + vec3(1e-5, 0.0, 0.0));
  vec3 b1 = normalize(cross(tg, vec3(0.0, 1.0, 0.0)) + vec3(0.0, 0.0, 1e-4));
  vec3 b2 = cross(b1, tg);
  float rad = 0.034*(1.0 - 0.6*smoothstep(0.75, 1.0, s))*(0.55 + 0.45*smoothstep(0.0, 0.06, s));
  vec3 nl = b1*position.y + b2*position.z;
  vec3 lp = c + nl*rad;
  float cy = cos(iDat.x), sy = sin(iDat.x);
  vec3 wp = iPos.xyz + iPos.w*vec3(cy*lp.x - sy*lp.z, lp.y, sy*lp.x + cy*lp.z);
  vN = vec3(cy*nl.x - sy*nl.z, nl.y, sy*nl.x + cy*nl.z);
  vPos = wp; vS = s;
  vCol = mix(uTintA, uTintB, iDat.z);
  vec4 mvPosition = modelViewMatrix*vec4(wp, 1.0);
  ${nt}
  vFogY = normalize(wp - uCamL + ${le}).y;
}`,Qa=`
varying vec3 vCol; varying vec3 vPos; varying vec3 vN; varying float vS;
${Tt}
void main(){
  vec3 n = normalize(vN + ${le});
  vec3 v = normalize(uCamL - vPos + ${le});
  vec3 alb = vCol*(0.8 + 0.3*wfgNoise(vPos*6.0));
  alb = mix(alb, vCol*1.5, (1.0 - smoothstep(-0.5, 0.3, n.y))*0.5);
  alb *= 1.0 - 0.5*(1.0 - smoothstep(0.0, 0.03, abs(fract(vS*26.0) - 0.5) - 0.38))*step(0.1, vS);    // slime pores
  vec3 col = wLit(alb, n, vPos, 1.0, 0.8);
  float spec = max(dot(reflect(-uKeyDir, n), v), 0.0); spec *= spec; spec *= spec; spec *= spec; spec *= spec;
  col += uKey*spec*0.5;
  gl_FragColor = vec4(col, 1.0);
  ${re.fogFrag}
}`,Za=`
attribute vec3 aLife;    // born (s), life (s), period (s; 0 = one shot)
attribute float aSize;
varying float vA; varying vec3 vC;
uniform float uTime; uniform float uPxScale; uniform vec3 uSilt; uniform vec3 uKey; uniform vec3 uSky;
${re.fogParsVert}
void main(){
  float age = uTime - aLife.x;
  if (aLife.z > 0.0) age = mod(max(age, 0.0), aLife.z);
  float a = age/max(aLife.y, 0.05);
  float on = step(0.0, a)*step(a, 1.0);
  float aa = clamp(a, 0.0, 1.0);
  vA = on*sin(3.14159*sqrt(aa))*(1.0 - aa)*0.5;
  vec3 p = position + vec3(0.9*aa, 0.25 + 1.3*sqrt(aa), 0.0)*aSize;
  vC = uSilt*(uKey*0.7 + uSky)*1.3;
  vec4 mvPosition = modelViewMatrix*vec4(p, 1.0);
  ${nt}
  vFogY = -0.3;
  gl_PointSize = on > 0.0 ? clamp(aSize*(0.6 + 2.2*sqrt(aa))*uPxScale/max(-mvPosition.z, 0.3), 2.0, 120.0) : 0.0;
}`,Ya=`
varying float vA; varying vec3 vC;
${re.fogParsFrag}
void main(){
  vec2 q = gl_PointCoord - 0.5; float d = dot(q, q)*4.0;
  float s = 1.0 - smoothstep(0.0, 1.0, d); s *= s;
  float al = s*vA;
  gl_FragColor = vec4(wfgFog(vC)*al, al);
}`;class Ye{constructor(u=2048){this.cap=u,this.p=new Float32Array(u*3),this.c=new Float32Array(u*3),this.a=new Float32Array(u*4),this.b=new Float32Array(u*4),this.i=new Uint32Array(u*6),this.ni=0,this.n=0,this.col=[1,1,1],this.A=[0,0,0,0],this.B=[0,0,0,0]}v(u,y,k){if(this.n===this.cap){const L=this.cap*2;for(const[_,q]of[["p",3],["c",3],["a",4],["b",4]]){const R=new Float32Array(L*q);R.set(this[_]),this[_]=R}this.cap=L}const w=this.n,p=w*3,g=w*4,P=this.p,V=this.c,x=this.a,F=this.b,C=this.col,A=this.A,i=this.B;return P[p]=u,P[p+1]=y,P[p+2]=k,V[p]=C[0],V[p+1]=C[1],V[p+2]=C[2],x[g]=A[0],x[g+1]=A[1],x[g+2]=A[2],x[g+3]=A[3],F[g]=i[0],F[g+1]=i[1],F[g+2]=i[2],F[g+3]=i[3],this.n++}tri(u,y,k){let w=this.i;const p=this.ni;if(p+3>w.length){const g=new Uint32Array(w.length*2);g.set(w),this.i=w=g}w[p]=u,w[p+1]=y,w[p+2]=k,this.ni=p+3}build(u={}){const y=new a.BufferGeometry,k=this.n;if(y.setAttribute("position",new a.BufferAttribute(this.p.subarray(0,k*3),3)),u.color!==!1&&y.setAttribute("color",new a.BufferAttribute(this.c.subarray(0,k*3),3)),u.a&&y.setAttribute(u.a,new a.BufferAttribute(this.a.subarray(0,k*4),4)),u.b){const p=u.bSize||4,g=this.b;if(p===4)y.setAttribute(u.b,new a.BufferAttribute(g.subarray(0,k*4),4));else{const P=new Float32Array(k*p);if(p===1)for(let V=0;V<k;V++)P[V]=g[V*4];else for(let V=0;V<k;V++)for(let x=0;x<p;x++)P[V*p+x]=g[V*4+x];y.setAttribute(u.b,new a.BufferAttribute(P,p))}}const w=this.i.subarray(0,this.ni);return y.setIndex(k>65535?new a.BufferAttribute(w.slice(),1):new a.BufferAttribute(new Uint16Array(w),1)),y}}const Fe=new a.Vector3,Ne=new a.Vector3,v0=new a.Vector3,ne=new a.Vector3;async function Wt(o,u){const y=o.attributes.position.array,k=o.index.array,w=new Float32Array(y.length);for(let p=0;p<k.length;p+=3){const g=k[p]*3,P=k[p+1]*3,V=k[p+2]*3,x=y[V]-y[P],F=y[V+1]-y[P+1],C=y[V+2]-y[P+2],A=y[g]-y[P],i=y[g+1]-y[P+1],L=y[g+2]-y[P+2],_=F*L-C*i,q=C*A-x*L,R=x*i-F*A;w[g]+=_,w[g+1]+=q,w[g+2]+=R,w[P]+=_,w[P+1]+=q,w[P+2]+=R,w[V]+=_,w[V+1]+=q,w[V+2]+=R,p%9e3===8997&&await u()}for(let p=0;p<w.length;p+=3){const g=Math.hypot(w[p],w[p+1],w[p+2])||1;w[p]/=g,w[p+1]/=g,w[p+2]/=g,p%6e4===59997&&await u()}o.setAttribute("normal",new a.BufferAttribute(w,3))}function Vt(o,u,y,k,w={}){const p=u.length,g=w.seam?k+1:k,P=o.n;Fe.subVectors(u[1],u[0]).normalize(),w.ref?Ne.copy(w.ref):Ne.set(Math.abs(Fe.y)<.9?0:1,Math.abs(Fe.y)<.9?1:0,0);for(let V=0;V<p;V++){Fe.subVectors(u[Math.min(V+1,p-1)],u[Math.max(V-1,0)]).normalize(),Ne.addScaledVector(Fe,-Ne.dot(Fe)),Ne.lengthSq()<1e-8&&Ne.set(Fe.y,-Fe.x,.01),Ne.normalize(),v0.crossVectors(Fe,Ne),w.onRing&&w.onRing(V);const x=y(V);for(let F=0;F<g;F++){const C=F/k*$,A=w.rf?x*w.rf(V,C):x,i=Math.cos(C)*A,L=Math.sin(C)*A;w.onVert&&w.onVert(V,F,F/k),o.v(u[V].x+Ne.x*i+v0.x*L,u[V].y+Ne.y*i+v0.y*L,u[V].z+Ne.z*i+v0.z*L)}}for(let V=0;V<p-1;V++)for(let x=0;x<k;x++){const F=P+V*g+x,C=P+V*g+(w.seam?x+1:(x+1)%k),A=F+g,i=C+g;o.tri(F,C,A),o.tri(C,i,A)}if(w.cap!==void 0){w.onRing&&w.onRing(p-1),w.onVert&&w.onVert(p-1,0,.5);const V=u[p-1],x=o.v(V.x+Fe.x*w.cap,V.y+Fe.y*w.cap,V.z+Fe.z*w.cap),F=P+(p-1)*g;for(let C=0;C<k;C++)o.tri(F+C,F+(w.seam?C+1:(C+1)%k),x)}return P}function Ut(o,u,y,k,w={}){const p=o.n,g=y.length,P=Math.cos(w.yaw||0),V=Math.sin(w.yaw||0),x=w.sx||1,F=w.sz||1;for(let C=0;C<g;C++){w.onRing&&w.onRing(C);for(let A=0;A<k;A++){const i=A/k*$,L=y[C][0]*(w.rf?w.rf(C,i):1),_=Math.cos(i)*L*x,q=Math.sin(i)*L*F;o.v(u.x+_*P-q*V,u.y+y[C][1],u.z+_*V+q*P)}}for(let C=0;C<g-1;C++)for(let A=0;A<k;A++){const i=p+C*k+A,L=p+C*k+(A+1)%k,_=i+k,q=L+k;o.tri(i,_,L),o.tri(L,_,q)}if(w.top!==void 0){w.onRing&&w.onRing(g-1);const C=o.v(u.x,u.y+w.top,u.z),A=p+(g-1)*k;for(let i=0;i<k;i++)o.tri(A+i,C,A+(i+1)%k)}return p}function Ft(o,u,y,k,w,p){const g=new a.Vector3(u.range(-1,1),u.range(-.15,.15),u.range(-1,1)).normalize();p.fan&&g.copy(p.fan);const P=p.col,V=P.clone().lerp(new a.Color(.75,.62,.62),.45);o.B=[0,0,0,0];const x=(F,C,A,i,L,_)=>{let q=L===0?5:4;const R=[F.clone()],v=[i],m=F.clone(),N=C.clone();for(let K=1;K<=q;K++)N.x+=u.gauss()*.16,N.y+=u.gauss()*.16,N.z+=u.gauss()*.16,N.addScaledVector(p.trop,.14).addScaledVector(g,-N.dot(g)*.7).normalize(),m.addScaledVector(N,A/q),R.push(m.clone()),v.push(i*j(1,.76,K/q)*(1+.26*(u()-.5)));let D=L>=p.depth,O=!1;if(!_&&p.clear){let K=1;for(;K<=q&&!p.clear(R[K],v[K]);)K++;K<=q&&(O=!0,K<3?_=!0:(q=K-1,R.length=K,v.length=K,D=!0))}D&&(v[q]*=1.3);const U=R[q];if(p.tips&&!_){const K=D?U:F,W=D?v[q]:i*1.25;(D||L>=1)&&p.tips.push([K.x,K.y,K.z,W,p.sway*Math.pow(fe(K.distanceTo(y)/w,0,1.2),1.7),y.x,y.y,y.z])}const Z=(K,W)=>{const se=fe(K.distanceTo(y)/w,0,1.2),ae=.55+.45*ee(0,.5,se);o.col=[j(P.r,V.r,W)*ae,j(P.g,V.g,W)*ae,j(P.b,V.b,W)*ae],o.A=[y.x,y.y,y.z,p.sway*Math.pow(se,1.7)]};if(!_)if(p.smooth){const K=new a.CatmullRomCurve3(R,!1,"centripetal"),W=D?q+2:q*2,se=[],ae=[],ue=(F.x*12.9898+F.y*78.233+F.z*37.719)%$,Me=L===0?p.sides:L===1?p.sides-1:D?Math.max(5,p.sides-3):p.sides-2;for(let J=0;J<=W;J++){const te=J/W*q,pe=Math.min(q-1,Math.floor(te)),ge=te-pe,wt=ge*ge*(3-2*ge);se.push(K.getPoint(J/W)),ae.push(j(v[pe],v[pe+1],wt)*(1+.11*Math.sin(te*3.8+ue)+.05*Math.sin(te*8.6+ue*2.3)))}if(D){const J=se[W].clone().sub(se[W-1]).normalize(),te=ae[W];se.push(se[W].clone().addScaledVector(J,te*.55),se[W].clone().addScaledVector(J,te*.95)),ae.push(te*.86,te*.5)}const ce=se.length-1;Vt(o,se,J=>ae[J],Me,{cap:ae[ce]*(D?.45:.8),onRing:J=>Z(se[J],D?Math.min(1,J/W)*.5:0)})}else Vt(o,R,K=>v[K],D&&p.twig?p.twig:p.sides,{cap:v[q]*.8,onRing:K=>Z(R[K],D?K/q*.5:0)});if(L>=p.depth)return;O&&(_=!0);const oe=L===0||u.chance(.35)?3:2;for(let K=0;K<oe;K++){const W=(K-(oe-1)/2)*u.range(.6,.85)+u.gauss()*.12,se=N.clone().applyAxisAngle(g,W).addScaledVector(g,u.gauss()*.14).normalize();x(m,se,A*u.range(.6,.82),v[v.length-1]*.8,L+1,_)}if(L<p.depth-1||u.chance(.5)){const K=R[2],W=N.clone().applyAxisAngle(g,u.sign()*u.range(.8,1.2)).normalize();x(K,W,A*u.range(.45,.6),v[Math.min(2,v.length-1)]*.68,Math.max(L+1,p.depth),_)}};x(y,k.clone().normalize(),w*.42,w*(p.thick||.05),0,!!p.off)}function Yo(o,u,y,k,w,p=!1){const g=u.chance(.45)||p,P=u()*$,V=u.int(4,7),x=u()*$,C=(p===2?[[5,2],[42,0],[58,16],[62,40],[52,66],[34,82],[19,88],[13,84],[8,70]].map(([L,_])=>[L/100,_/100]):p?[[.06,.04],[.62,0],[.93,.17],[1,.38],[.84,.55],[.5,.63],[.12,.6]]:g?[[.2,0],[.26,.1],[.5,.3],[.9,.62],[1.05,.8],[1,.84],[.62,.54],[.12,.14]]:[[.2,0],[.17,.1],[.3,.42],[.48,.86],[.63,1.13],[.72,1.22],[.66,1.25],[.42,.86],[.09,.22]]).map(([L,_])=>[L*k,_*k]),A=p===2?6:p?99:5,i=C.length;o.B=[1,0,0,0],Ut(o,y,C,9,{yaw:x,sx:1,sz:u.range(.75,1),rf:(L,_)=>1+(p?.12:g?.2:.035)*Math.sin(_*V+P)*(p?L>A?0:1:Math.min(1,C[L][1]/k)),onRing:L=>{const _=Math.min(1,L/Math.max(1,Math.min(A,i-1)-1)),q=L>A?(L-A)/(i-1-A):0,R=p===2?L>A?.5-.34*q:.46+.54*Math.min(1,L/3):p?.46+.54*Math.min(1,L/3):L>A?.62-.44*q:L===A?1.06:.58+.42*_;o.col=[w.r*R,w.g*R*(L>A?.94:1),w.b*R*.9],o.A=[y.x,y.y,y.z,!p&&Math.abs(L-A)<=1?.05*k:0]}})}function Xo(o,u,y,k,w){const p=w.clone().normalize(),g=new a.Vector3(Math.abs(p.y)<.9?0:1,Math.abs(p.y)<.9?1:0,0).cross(p).normalize(),P=new a.Vector3().crossVectors(p,g),V=(v,m,N)=>ne.copy(y).addScaledVector(g,Math.cos(m)*v).addScaledVector(P,Math.sin(m)*v).addScaledVector(p,N);o.B=[2,0,0,0];const x=o.n,F=u.range(.92,1.04),C=k*u.range(.28,.4),A=k*.31,i=C+A*.75,L=u()*$;for(let v=0;v<2;v++)for(let m=0;m<5;m++){const N=v?.72:.48;o.col=[.8*F*N,.8*F*N,.76*F*N],o.A=[y.x,y.y,y.z,0],V(k*(v?.14:.18),m/5*$,v*C),o.v(ne.x,ne.y,ne.z)}for(let v=0;v<5;v++){const m=x+v,N=x+(v+1)%5;o.tri(m,m+5,N),o.tri(N,m+5,N+5)}const _=o.n;for(let v=0;v<3;v++)for(let m=0;m<7;m++){const N=[-.62,-.04,.58][v],D=[.58,.76,.88][v];o.col=[D*F,D*F,D*.97*F],o.A=[y.x,y.y,y.z,.03*k],V(A*Math.cos(N)*(.94+.12*u()),L+(m+.5*v)/7*$,i+A*Math.sin(N)),o.v(ne.x,ne.y,ne.z)}o.col=[.9*F,.9*F,.87*F],o.A=[y.x,y.y,y.z,.05*k],V(0,0,i+A*1);const q=o.v(ne.x,ne.y,ne.z);for(let v=0;v<2;v++)for(let m=0;m<7;m++){const N=_+v*7+m,D=_+v*7+(m+1)%7;o.tri(N,N+7,D),o.tri(D,N+7,D+7)}for(let v=0;v<7;v++)o.tri(_+14+v,q,_+14+(v+1)%7);const R=8;for(let v=0;v<R;v++){const m=L+v/R*$+u()*.35,N=u.range(-.1,.95),D=k*u.range(.15,.25),O=.5,U=A*.8;o.col=[.7*F,.71*F,.69*F],o.A=[y.x,y.y,y.z,.03*k],V(U,m-O,i+A*.1);const Z=o.v(ne.x,ne.y,ne.z);V(U,m+O,i+A*.1);const oe=o.v(ne.x,ne.y,ne.z);o.col=[.88*F,.88*F,.85*F],o.A=[y.x,y.y,y.z,.12*k],V(A+Math.cos(N)*D,m,i+A*.1+Math.sin(N)*D);const K=o.v(ne.x,ne.y,ne.z);o.tri(Z,oe,K)}}function Xa(o,u,y,k,w){const p=u()*$,g=Math.cos(w),P=Math.sin(w),V=(C,A,i)=>new a.Vector3(y.x+C*g-i*P,y.y+A,y.z+C*P+i*g);o.A=[y.x,y.y,y.z,p];const x=[u.range(.9,1.1),u.range(.9,1.1),u()*$],F=[[.55,-.38],[.8,-.16],[.86,.12],[.76,.4],[.56,.64],[.3,.82]].map(([C,A])=>[C*k*.8,A*k*.9+k*.12]);o.B=[0,0,0,0],Ut(o,y,F,12,{yaw:w,sz:1.12*x[0],sx:.94*x[1],top:k*.93,rf:(C,A)=>1+.08*Math.sin(A*3+x[2]+C)+.05*Math.sin(A*7+C*1.9+x[2]*2)+.03*Math.sin(A*5-C*2.6)});for(let C=0;C<8;C++){const A=(C+.5)/8*$+u.range(-.2,.2),i=u.range(.75,1.25),L=u.range(.8,1.2),_=u.range(-.9,.9),q=u()*$,R=u.range(-1,1),v=[[.42,-.26],[.92,-.36],[1.16,-.1],[1.08,.3],[.84,.58],[.6,.66],[.5+.14*R,.52-.1*R],[.58+.22*R,.38-.06*Math.abs(R)]],m=new a.CatmullRomCurve3(v.map(([O,U],Z)=>{const oe=Z/7,K=A+_*oe*oe+.5*R*Math.max(0,oe-.7);return V(Math.cos(K)*O*k*i,U*k*L,Math.sin(K)*O*k*i)})),N=8,D=m.getPoints(N);o.B=[1,0,0,q],Vt(o,D,O=>k*j(.17,.032,Math.pow(O/N,.8))*(1+.1*Math.sin(O*1.9+q)),6,{seam:!0,ref:new a.Vector3(0,1,0),cap:k*.05,onVert:(O,U,Z)=>{o.B=[1,O/N,Z,q]}})}for(let C=-1;C<=1;C+=2){const A=V(C*.4*k,.5*k,.5*k),i=o.n,L=.155*k;for(let q=0;q<3;q++)for(let R=0;R<6;R++){const v=-.5+q*.6,m=R/6*$;o.B=[2,Math.sin(v),0,0],o.v(A.x+Math.cos(m)*Math.cos(v)*L,A.y+Math.sin(v)*L,A.z+Math.sin(m)*Math.cos(v)*L)}o.B=[2,1,0,0];const _=o.v(A.x,A.y+L,A.z);for(let q=0;q<2;q++)for(let R=0;R<6;R++){const v=i+q*6+R,m=i+q*6+(R+1)%6;o.tri(v,v+6,m),o.tri(m,v+6,m+6)}for(let q=0;q<6;q++)o.tri(i+12+q,_,i+12+(q+1)%6)}}function Ja(){const o=new Ye,u=new a.Vector3(0,0,0);o.A=[0,0,0,0],Ut(o,u,[[.3,-.1],[.5,0],[.38,.13],[.16,.19]],8,{sz:.78,top:.2,onRing:w=>{const p=[.5,.82,1,.92][w];o.col=[p,p*.97,p*.94]},rf:(w,p)=>1+.08*Math.cos(p*2)+.05*Math.sin(p*5)});for(let w=-1;w<=1;w+=2){for(let F=0;F<4;F++){const C=(F-1.7)*.2,A=(F+(w>0?0:1))*Math.PI,i=[new a.Vector3(w*.36,0,C),new a.Vector3(w*.78,.24,C*1.7-.03),new a.Vector3(w*1.06,-.3,C*2.1-.06)];Vt(o,i,L=>[.065,.05,.016][L],3,{onRing:L=>{o.A=[1,A,L*.5,0];const _=[.8,.95,.7][L];o.col=[_,_*.96,_*.92]}})}const p=[new a.Vector3(w*.3,.02,.26),new a.Vector3(w*.5,.08,.56),new a.Vector3(w*.34,.06,.86)];Vt(o,p,F=>[.07,.085,.1][F],4,{cap:.26,onRing:F=>{o.A=[2,w>0?0:1.7,F*.5,0];const C=[.85,1,1.05][F];o.col=[C,C*.95,C*.9]}}),o.A=[0,0,0,0],o.col=[.05,.05,.06];const g=o.v(w*.13,.13,.33),P=o.v(w*.19,.13,.31),V=o.v(w*.16,.25,.36),x=o.v(w*.16,.12,.38);o.tri(g,P,V),o.tri(P,x,V),o.tri(x,g,V)}const k=o.build({a:"aAnim"});return k.computeVertexNormals(),k}function en(){const o=new Ye;o.A=[0,0,0,0],o.col=[1,.95,.9];const u=o.v(0,.16,0);for(let k=0;k<5;k++){const w=k/5*$,p=w+$/10,g=w-$/10;o.col=[.62,.55,.5],o.A=[0,0,0,0];const P=o.v(Math.cos(g)*.34,0,Math.sin(g)*.34),V=o.v(Math.cos(p)*.34,0,Math.sin(p)*.34);o.col=[1,.95,.9],o.A=[4,k*1.3,.35,0];const x=o.v(Math.cos(w)*.5,.15,Math.sin(w)*.5);o.col=[.85,.8,.74],o.A=[4,k*1.3,1,0];const F=o.v(Math.cos(w)*1,.03,Math.sin(w)*1);o.tri(u,x,P),o.tri(u,V,x),o.tri(x,F,P),o.tri(x,V,F)}const y=o.build({a:"aAnim"});return y.computeVertexNormals(),y}function tn(){const o=new Ye,u=6;o.A=[0,0,0,0];const y=[[1.34,.15,.07,0],[1,.16,.2,0],[.8,.4,.8,.06]];for(let g=0;g<y.length;g++){const[P,V,x,F]=y[g];for(let C=0;C<u;C++){const A=(C+.5*g)/u*$,i=P*(1+.1*Math.sin(A*2+.6)),L=x*(g>1?.9+.1*(C%2):1);o.col=[L,L,L*.96],o.v(Math.cos(A)*i+F,V,Math.sin(A)*i*.84)}}for(let g=0;g<y.length-1;g++)for(let P=0;P<u;P++){const V=g*u+P,x=g*u+(P+1)%u;o.tri(V,V+u,x),o.tri(x,V+u,x+u)}o.col=[1,1,.97];const k=o.v(.16,.6,0),w=(y.length-1)*u;for(let g=0;g<u;g++)o.tri(w+g,k,w+(g+1)%u);const p=o.build({a:"aAnim"});return p.computeVertexNormals(),p}function on(){const o=new Ye,u=[[0,.012,.012,0],[.018,.05,.04,0],[.05,.088,.066,0],[.1,.116,.084,0],[.17,.128,.088,.01],[.25,.12,.078,.04],[.34,.1,.06,.1],[.44,.076,.042,.2],[.56,.05,.026,.36],[.68,.03,.014,.55],[.82,.015,.007,.78],[1,.004,.003,1]],y=g=>.012*Math.sin(Math.min(g,.5)*Math.PI)-.02*g*g,k=u.map(g=>new a.Vector3(.5-g[0],y(g[0]),0));Vt(o,k,g=>u[g][1],10,{ref:new a.Vector3(0,1,0),rf:(g,P)=>{const V=Math.cos(P),x=Math.sin(P),F=u[g][2]/u[g][1];return F/Math.max(1e-4,Math.hypot(F*V,x))*(V<0?.88:1)},onVert:(g,P,V)=>{const x=Math.cos(V*$),F=u[g][0],C=(.5+.5*ee(.45,-.7,x))*(1-.22*ee(.02,0,F))*(.92+.08*Math.sin(F*60));o.col=[C,C,C*1.02],o.A=[3,0,u[g][3],0]}});const w=(g,P,V,x,F)=>{const C=o.n;for(let A=0;A<=x;A++){const i=A/x,L=j(g,P,i),_=.5-L;let q=0;for(;q<u.length-2&&u[q+1][0]<_;)q++;const R=fe((_-u[q][0])/(u[q+1][0]-u[q][0]),0,1),v=j(u[q][1],u[q+1][1],R),m=j(u[q][3],u[q+1][3],R),N=F(i);o.col=[.5,.5,.52],o.A=[3,0,m,0],o.v(L,y(_)+V*v*.92,0),o.col=[.24,.24,.27],o.A=[3,0,Math.min(1,m+.25*N),0],o.v(L-.5*N,y(_)+V*(v*.92+N),0)}for(let A=0;A<x;A++){const i=C+A*2;o.tri(i,i+1,i+2),o.tri(i+1,i+3,i+2)}};w(.3,.13,1,6,g=>.115*Math.pow(Math.sin(Math.PI*Math.min(1,g*.9+.08)),.7)*(1-.45*g)),w(.09,-.5,1,9,g=>.04*Math.pow(Math.sin(Math.PI*(.06+.94*g)),.5)*(1-.8*g)),w(.12,-.5,-1,9,g=>.052*Math.pow(Math.sin(Math.PI*(.06+.94*g)),.5)*(1-.8*g));for(let g=-1;g<=1;g+=2){const P=o.n,V=5,x=.25,F=-.035,C=g*.078,A=-.115,i=-.045,L=g*.2;for(let D=0;D<=V;D++){const O=D/V,U=.058*Math.pow(Math.sin(Math.PI*(.1+.86*O)),.8),Z=x+A*O,oe=F+i*O,K=C+L*O,W=.62-.3*O;o.A=[5,0,O*.35,0],o.col=[W*.7,W*.7,W*.74],o.v(Z+U,oe+U*.25,K),o.col=[W,W,W*1.03],o.v(Z,oe,K),o.col=[W*.6,W*.6,W*.64],o.v(Z-U,oe-U*.25,K)}for(let D=0;D<V;D++)for(let O=0;O<2;O++){const U=P+D*3+O;o.tri(U,U+1,U+3),o.tri(U+1,U+4,U+3)}const _=.5-.085,q=.04,R=g*.074,v=o.n,m=8;o.A=[3,0,0,0];for(let D=0;D<2;D++)for(let O=0;O<m;O++){const U=O/m*$,Z=D?.026:.04,oe=D?.03:.95;o.col=[oe,oe,oe*(D?1.2:.95)],o.v(_+Math.cos(U)*Z,q+Math.sin(U)*Z,R+g*(D?.016:.004))}o.col=[.02,.02,.03];const N=o.v(_,q,R+g*.026);for(let D=0;D<m;D++){const O=v+D,U=v+(D+1)%m;o.tri(O,U,O+m),o.tri(U,U+m,O+m),o.tri(O+m,U+m,N)}}const p=o.build({a:"aAnim"});return p.computeVertexNormals(),p}function $e(o,u,y){const k=new a.InstancedBufferGeometry;k.index=o.index;for(const w in o.attributes)k.setAttribute(w,o.attributes[w]);for(const w in y)k.setAttribute(w,new a.InstancedBufferAttribute(y[w],4));return k.instanceCount=u,k}const st=(()=>{const o=new a.Matrix4,u=new a.Vector3,y=new a.Vector3,k=new a.Vector3,w=new a.Quaternion;return(p,g)=>(y.copy(p).normalize(),u.crossVectors(y,g),u.lengthSq()<1e-6&&u.set(1,0,0).cross(y),u.normalize(),k.crossVectors(u,y),o.makeBasis(u,y,k),w.setFromRotationMatrix(o))})();function Jo(o,u,y,k,w){const p=new Ye,g=v=>{let m=0;for(;m<u.length-2&&u[m+1][0]<v;)m++;const N=u[m],D=u[m+1],O=fe((v-N[0])/(D[0]-N[0]),0,1),U=O*O*(3-2*O),Z=j(O,U,.5);return[j(N[1],D[1],Z)*o,j(N[2],D[2],Z)*o,j(N[3],D[3],Z)*o,j(N[4],D[4],Z),j(N[5],D[5],Z)*o]},P=(v,m,N)=>{const[D,O,U,Z,oe]=g(v),K=Math.cos(m),W=Math.sin(m),se=Math.sign(K)*Math.pow(Math.abs(K),Z),ae=Math.sign(W)*Math.pow(Math.abs(W),Z);return N.set((.5-v)*o,oe+(W>0?O:U)*ae,D*se)},V=p.n,x=new a.Vector3;for(let v=0;v<=y;v++){const m=Math.pow(v/y,1.15)*.999+5e-4;for(let N=0;N<k;N++){const D=N/k*$;P(m,D,x),p.A=[m,Math.cos(D),Math.sin(D),0],p.v(x.x,x.y,x.z)}}for(let v=0;v<y;v++)for(let m=0;m<k;m++){const N=V+v*k+m,D=V+v*k+(m+1)%k,O=N+k,U=D+k;p.tri(N,D,O),p.tri(D,U,O)}const F=new a.Vector3,C=new a.Vector3,A=new a.Vector3,i=new a.Vector3,L=new a.Vector3,_=[];for(const v of w){const m=v.side===0?[0]:[1,-1];for(const N of m){const D=(v.side===0||N>0?v.ang:180-v.ang)*Math.PI/180,O=v.round?8:6,U=v.round?7:5,Z=[];P(v.t0,D,F),P(v.t1,D,C),A.lerpVectors(F,C,.5);const oe=A.x+v.out[0]*o,K=A.y+v.out[1]*o,W=A.z+v.out[2]*o*(v.side===0?1:N),se=(v.tipChord??.25)*(F.x-C.x);i.set(F.x-C.x,F.y-C.y,F.z-C.z).cross(L.set(oe-A.x,K-A.y,W-A.z)).normalize();for(let ae=1;ae>=-1;ae-=2){const ue=p.n;Z.push(ue);for(let Me=0;Me<=U;Me++)for(let ce=0;ce<=O;ce++){const J=ce/O,te=Me/U,pe=j(v.t0,v.t1,J);P(pe,D,x);const ge=Math.pow(te,.85),wt=1-.5*te*te*(1-J),Be=v.round?Math.sqrt(Math.max(0,1-Math.pow(te,5))):1,vt=oe+(.5-J)*se,Bt=j(A.x,oe,ge*(1-.25*te*te)),me=Bt+(j(x.x,vt,ge*wt)-Bt)*Be+(v.scoop||0)*(F.x-C.x)*Math.sin(Math.PI*Math.min(1,te*1.15))*J*J,Re=j(x.y,K,ge)-(v.sag||0)*o*Math.sin(Math.PI*te)-(v.cup||0)*o*Math.sin(Math.PI*J)*Math.sin(Math.PI*Math.min(1,te*1.3)),_e=j(x.z,W,ge),ie=(v.thick??.009)*o*.5*ae*2.6*Math.sqrt(J)*(1-J)*Math.pow(Math.max(0,1-te*te),.75);p.A=[fe(.5-me/o,0,1),v.side===0?0:N,v.side===0?Math.sign(Math.sin(D)):j(-.62,-.3,ee(0,.5,te)),1+J],p.v(me+i.x*ie,Re+i.y*ie,_e+i.z*ie)}for(let Me=0;Me<U;Me++)for(let ce=0;ce<O;ce++){const J=ue+Me*(O+1)+ce,te=J+1,pe=J+O+1,ge=pe+1;ae>0?(p.tri(J,te,pe),p.tri(te,ge,pe)):(p.tri(J,pe,te),p.tri(te,pe,ge))}}for(let ae=0;ae<=U;ae++)for(let ue=0;ue<=O;ue++)(ue===0||ue===O||ae===U)&&_.push(Z[0]+ae*(O+1)+ue,Z[1]+ae*(O+1)+ue)}}const q=p.build({color:!1,a:"aB"});q.computeVertexNormals(),q.boundingSphere=new a.Sphere(new a.Vector3(0,0,0),o);const R=q.attributes.normal.array;for(let v=0;v<_.length;v+=2){const m=_[v]*3,N=_[v+1]*3;let D=R[m]+R[N],O=R[m+1]+R[N+1],U=R[m+2]+R[N+2];const Z=Math.hypot(D,O,U);if(!(Z<.05)){D/=Z,O/=Z,U/=Z;for(const oe of[m,N]){const K=R[oe]+3*D,W=R[oe+1]+3*O,se=R[oe+2]+3*U,ae=Math.hypot(K,W,se)||1;R[oe]=K/ae,R[oe+1]=W/ae,R[oe+2]=se/ae}}}return q}const an=[[0,.006,.004,.004,.8,0],[.012,.063,.019,.015,.7,0],[.04,.094,.031,.024,.66,0],[.085,.107,.043,.033,.68,0],[.15,.105,.057,.045,.78,0],[.23,.096,.068,.062,.88,0],[.33,.088,.071,.068,.95,0],[.46,.073,.064,.061,1,0],[.58,.055,.05,.047,1,.002],[.68,.039,.038,.033,1,.006],[.76,.027,.028,.023,1,.012],[.82,.018,.024,.018,1,.02],[.9,.007,.03,.024,1,.05],[1,.002,.012,.014,1,.105]],nn=[{t0:.25,t1:.365,ang:-28,side:1,out:[-.165,-.07,.135],tipChord:.1,sag:.012,thick:.024,round:1,scoop:.2,cup:.007},{t0:.665,t1:.74,ang:90,side:0,out:[-.055,.05,0],tipChord:.3},{t0:.545,t1:.625,ang:-50,side:1,out:[-.045,-.03,.036],tipChord:.22,sag:.004,thick:.02,round:1,scoop:.16,cup:.004},{t0:.715,t1:.775,ang:-90,side:0,out:[-.04,-.03,0],tipChord:.3},{t0:.83,t1:.905,ang:-90,side:0,out:[-.02,-.055,0],tipChord:.45}],sn=[[0,.004,.003,.003,.9,0],[.03,.026,.014,.022,.85,0],[.1,.052,.03,.05,.85,0],[.25,.066,.05,.07,.92,0],[.42,.064,.056,.06,1,0],[.62,.044,.046,.04,1,0],[.8,.02,.024,.02,1,0],[.93,.009,.011,.011,1,0],[1,.003,.003,.003,1,0]],rn=[{t0:.27,t1:.33,ang:-35,side:1,out:[-.07,-.03,.1],tipChord:.2},{t0:.74,t1:.79,ang:90,side:0,out:[-.03,.022,0],tipChord:.3},{t0:.895,t1:.995,ang:0,side:1,out:[-.075,0,.125],tipChord:.07,thick:.006}];var fn={id:"whale-fall-garden",name:"The Bone Garden",category:"ocean",weirdness:.15,media:["underwater"],async build(o){const u=o.rng,y=o.noise,k=o.quality?.detail??1,w=o.vary||{},p=fe(w.density??1,.7,1.3),g=Math.min(p,1.05),P=new a.Scene,V=La(u.fork("sea"),w.hour||"any"),x=Ra[V],F=u.fork("cast"),C=F.chance(.4),A=F.chance(.45),i=u.fork("garden"),L=u.fork("age")(),_=L<.6?"crimson":L<.8?"white":"reef";P.fog=new a.FogExp2(x.fog,x.density);const q=Ho.map(e=>new a.Color(e)),R=await Na(o,{palette:Ho,bed:!0,demo:!1,sparks:x.sparks,age:_});P.add(R.object);const v=R.uniforms,m=R.anchors,N=R.groundFast||R.groundHeight,D=x.lean*Math.PI/180,O=new a.Vector3(Math.sin(D),Math.cos(D),x.leanZ*Math.sin(D)).normalize();R.setLight({dir:O,key:x.key,keyScale:x.keyScale,sky:x.sky,skyScale:x.skyScale,bounce:x.bounce,bounceScale:x.bounceScale,shadow:x.shadow});const U=new a.Color(x.glow).multiplyScalar(x.glowGain),Z=new a.Color(x.fog).lerp(U,x.up);{const e=new a.Color(x.low);v.uFogLow.value.set(e.r,e.g,e.b,1),v.uFogUp.value.set(Z.r,Z.g,Z.b,1)}{const e=m.straightStart,t=m.portalSeat.position;v.uPale.value.set(j(e.x,t.x,.42),j(e.z,t.z,.42),36,.8)}const oe=1.06;{const e=r=>(r*(r+.0245786)-90537e-9)/(r*(.983729*r+.432951)+.238081),t=new a.Color(x.shadowTint),n=r=>{const l=(.5*r-.5)/oe+.5;let h=0,s=1;for(let f=0;f<30;f++){const c=(h+s)/2;e(c)<l?h=c:s=c}return h*.6/x.exposure};v.uShade={value:new a.Vector3(n(t.r),n(t.g),n(t.b))}}const K=()=>a.UniformsUtils.clone(a.UniformsLib.fog),W=(e,t,n={},r={})=>new a.ShaderMaterial({uniforms:{...K(),...v,...n},vertexShader:e,fragmentShader:t,fog:!0,...r});await o.yield();const se=m.flyThrough,ae=5,ue=se[ae],Me=new a.Vector3().subVectors(se[ae],se[ae+1]).setY(0).normalize(),ce=m.straightStart,J=m.portalSeat.position,te=-60,pe=70,ge=-16,wt=62,Be=Math.tan(27.3*Math.PI/180),vt=.11,Bt=[26,70],me=[-6,18],Re=new a.Vector3(ue.x+(.85*Me.x+.15*Math.SQRT1_2)*6.5,ue.y+.7,ue.z+(.85*Me.z-.15*Math.SQRT1_2)*6.5),_e=(()=>{let e=Re.x-ue.x,t=Re.z-ue.z;const n=Math.hypot(e,t)||1;e/=n,t/=n;const r=(Re.z-te)/(1+e),l=Re.x+r*t,h=Re.z-r*e,s=(Math.atan2(-t,-e)+$)%$,f=(me[0]+me[1])/2,c=Q=>(Be*(Q-f)-(pe-Re.y))/(.5*(Be-vt));let b=ge,M=c(l-b+r*s);const d=fe(M,Bt[0],Bt[1]);b+=(M-d)*.5*(Be-vt)/Be,M=d;const z=l-b,B=z+r*s,G=B-M,S=Re.y+.5*(Be+vt)*M,T=Q=>{if(Q<=z)return[b+Q,te];const de=Math.min(s,(Q-z)/r);return[l+r*Math.sin(de),h-r*Math.cos(de)]},E=Q=>{if(Q<=me[0])return pe;if(Q<me[1])return pe-Be*(Q-me[0])*(Q-me[0])/(2*(me[1]-me[0]));if(Q<=G)return pe-Be*(Q-f);const de=Q-G;return S-Be*de+.5*(Be-vt)*de*de/M},I=b+me[0]-wt,Y=[];for(let Q=0;Q<=3;Q++)Y.push(j(I-b,me[0],Q/3));Y.push(0,6,12,me[1]);const X=Math.max(1,Math.round((z-me[1])/13));for(let Q=1;Q<X;Q++)Y.push(j(me[1],z,Q/X));const H=Math.max(6,Math.round(r*s/10.5));for(let Q=0;Q<H;Q++)Y.push(z+Q/H*r*s);return{pts:Y.map(Q=>{const[de,at]=T(Q);return new a.Vector3(de,E(Q),at)}),R:r,cx:l,cz:h,TH:s,xTip:b,xIn:I,rTop:z,rEnd:B,plan:T,tanAt:Q=>{if(Q<=z)return[1,0];const de=Math.min(s,(Q-z)/r);return[Math.cos(de),Math.sin(de)]},hgt:E,top:new a.Vector3(l,E(z),te),dTip:wt}})();await o.yield();const ie=(()=>{const e=_e.pts.slice();e.push(Re);for(let t=ae;t<se.length-1;t++)e.push(se[t].clone());return e.push(ce.clone().lerp(J,1/3),ce.clone().lerp(J,2/3),J.clone()),Ba(e)})(),he=ie.length;await o.yield();const ea=[ue,m.naveEntry,m.naveExit,m.archPass,ce,_e.top],Y0=[0,0,0,0,0,0],X0=[1e9,1e9,1e9,1e9,1e9,1e9];for(let e=0;e<=600;e++){ie.pointAt(e/600,ne);for(let t=0;t<6;t++){const n=ne.distanceToSquared(ea[t]);n<X0[t]&&(X0[t]=n,Y0[t]=e/600)}}await o.yield();const[g0,y0,ta,oa,aa,na]=Y0,Le=g0*he,J0=_e.dTip,sa=na*he,jt=m.spineTop[0].distanceTo(m.naveEntry),eo=m.naveEntry.distanceTo(m.naveExit),to=m.skullLine[0].distanceTo(m.skullTip),oo=ce.distanceTo(J),ao=e=>{let t=12;return t=j(t,18,ee(J0-6,J0+30,e)),t=j(t,6.8,ee(sa-14,Le,e)),t=j(t,5.5,ee(y0*he-eo/4,y0*he+eo/8,e)),t=j(t,6.8,ee(oa*he-to/2,aa*he+to/2,e)),j(t,8.5,ee(he-oo*2/3,he-oo/3,e))},ye=64,gt=new Float32Array(ye+1),De=new Float32Array(ye+1);for(let e=0;e<=ye;e++)gt[e]=ao(e/ye*he);for(let e=0;e<ye;e++)De[e+1]=De[e]+he/ye*2/(gt[e]+gt[e+1]);const b0=De[ye],no=e=>{const t=fe(e,0,1)*ye,n=Math.min(ye-1,Math.floor(t));return De[n]+(De[n+1]-De[n])*(t-n)},x0=e=>{const t=e/48*b0;let n=0;for(;n<ye-1&&De[n+1]<t;)n++;return fe((n+(t-De[n])/Math.max(1e-6,De[n+1]-De[n]))/ye,0,1)},ia=e=>{const t=fe(e,0,1)*ye,n=Math.min(ye-1,Math.floor(t));return(gt[n]+(gt[n+1]-gt[n])*(t-n))*b0/he},so=43.6,z0=Math.SQRT1_2,M0=-Math.SQRT1_2,ra=(e,t)=>[so+z0*e-z0*t,M0*e+M0*t],[ke,yt]=ra(90,15),It=_e.xIn,Ae=It+56,it=te-14,Ht=15,rt=e=>jo(Io("wfg-"+e+":"+o.seed)),be=jo(Io("wfg-staging2:"+o.seed)),la=e=>(t,n)=>ie.distanceTo(t.x,t.y,t.z)<e+n;await o.yield();const Se={x:-14,z:m.naveLine[4].z*.35},Qt=(e,t)=>{const n=(e-Se.x)/92,r=(t-Se.z)/50;return Math.sqrt(n*n+r*r)},Nt=(e,t)=>ee(.02,.34,y.fbm2(e*.03+11,t*.03-4,3))*ee(1,1.4,Qt(e,t)),k0=e=>{const t=e-94;return-88-.5*(t+Math.sqrt(t*t+144))},Rt=(e,t)=>t-k0(e)-88,io=(e,t)=>(e-so)*z0+t*M0-104,bt=(e,t)=>{let n=N(e,t)-.42;const r=ee(-50,-88,Rt(e,t));n+=16*r*r;const l=-116-e;l>0&&(n-=l<10?.06*l*l:1.2*(l-10)+6);const h=t-96;h>0&&(n-=h<20?.0125*h*h:.5*(h-20)+5);const s=io(e,t);return s>0&&(n-=s<10?.045*s*s:.9*(s-10)+4.5),n+=1.4*y.fbm2(e*.012+40,t*.012,2)*ee(.9,1.6,Qt(e,t)),n},ro=(e,t,n=Nt(e,t))=>{const r=-26-e,l=Math.exp(-(((t-ce.z)/42)**2))*ee(-66,-84,e);let h=ee(.15,.5,ee(8,34,r)*.9*(1-.93*l)+.45*y.fbm2(e*.06,t*.06,3)-.2);return h=Math.max(h,ee(-66,-80,Rt(e,t)),n,ee(100,125,t),ee(2,16,io(e,t))),h},ca=(e,t,n,r)=>{let l=bt(t,n);if(r>.01){const h=e.nearestXZ(t,n),s=Math.max(ee(8,18,h.dist),ee(12,22,h.y-l));l+=3.4*r*(.6+.4*y.n2(t*.1,n*.1))*s}return l},lt=(e,t,n=Nt(e,t))=>ca(ie,e,t,n),Xe=(e,t,n,r,l,h)=>{const s=[];let f=e;for(;f<t;)s.push(f),f+=f>=n&&f<r?l:h;return s.push(t),s};let A0;{const e=Xe(-296,-125,0,0,9,9).concat(Xe(-116,340,-116,126,3,12)),t=Xe(-262,230,-68,64,2.6,12),n=e.length,r=t.length,l=new Float32Array(n*r*3),h=new Float32Array(n*r*3);for(let c=0,b=0;c<r;c++){for(let M=0;M<n;M++,b++){const d=e[M],z=t[c],B=Nt(d,z),G=lt(d,z,B);l[b*3]=d,l[b*3+1]=G,l[b*3+2]=z,h[b*3]=ro(d,z,B),h[b*3+1]=1-.35*ee(-70,-88,Rt(d,z))-.25*B*(1-B)*4*.5,h[b*3+2]=0,M%40===39&&await o.yield()}await o.yield()}const s=new Uint16Array((r-1)*(n-1)*6);for(let c=0,b=0;c<r-1;c++){for(let M=0;M<n-1;M++,b+=6){const d=c*n+M,z=d+1,B=d+n,G=B+1;s[b]=d,s[b+1]=B,s[b+2]=z,s[b+3]=z,s[b+4]=B,s[b+5]=G}c%16===15&&await o.yield()}const f=new a.BufferGeometry;f.setAttribute("position",new a.BufferAttribute(l,3)),f.setAttribute("aG",new a.BufferAttribute(h,3)),f.setIndex(new a.BufferAttribute(s,1)),await o.yield(),await Wt(f,o.yield),await o.yield();var lo={value:new a.Vector4(0,-1e4,0,Ht)},S0=W(Ea,Ga,{uTree:lo,uRock:{value:new a.Color(.088,.104,.122)},uProw:{value:new a.Vector4(Ae+4,it-4,62,0)},uFall:{value:new a.Vector4(Se.x,Se.z,92,50)},uFoot:{value:new a.Vector3(bt(Se.x,k0(Se.x)),12,2)},uCrustLit:{value:new a.Vector2(1.5,.9)}});f.boundingSphere=new a.Sphere(new a.Vector3(25,-60,-16),520),A0=new a.Mesh(f,S0),A0.name="floor",P.add(A0)}await o.yield();let co=0,ho=0;const Pe=(e,t)=>{let n=k0(e)+6*y.fbm2(e*.011+7.7,t*.02,3);const r=Ae;n+=ho*Math.exp(-(((e-r)/8.5)**2))*(1-ee(56,63,t)),n+=co*Math.exp(-(((e-ke)/6.5)**2))*(1-ee(9.5,15.5,t)),n+=27*ee(92,122,t)*(.8+.2*y.n2(e*.03,5.5)),n+=10*ee(26,-6,t),n-=Math.max(0,t-122)*4;{const l=t/13+.35*y.n2(e*.02,t*.01),h=l-Math.floor(l);n+=3.2*h*h*h*(1-Math.exp(-(((e-r)/12)**2)))*(1-Math.exp(-(((e-ke)/11)**2)))}n+=1.6*Math.abs(Math.sin(e*.42+2.5*y.n2(e*.05,t*.03)))+1.5*y.fbm2(e*.09,t*.09,3);{const l=-135-e;n-=.9*(l+Math.sqrt(l*l+900))*ee(-60,-100,e)}return n};co=yt+3.5-Pe(ke,11),ho=it+4.5-Pe(Ae,52);{const e=Xe(-340,-104,-214,-104,7,14).concat(Xe(-100,62,0,0,2.7,2.7),Xe(66.5,240,0,0,4.5,4.5),Xe(249,330,0,0,9,9)),t=Xe(-130,134,14,120,2.8,6).flatMap(S=>S===8?[5,8,11]:[S]),n=e.length,r=t.length,l=new Float32Array(n*r*3),h=new Float32Array(n*r*3);for(let S=0,T=0;S<r;S++){for(let E=0;E<n;E++,T++){const I=e[E],Y=t[S],X=Pe(I,Y);l[T*3]=I,l[T*3+1]=Y,l[T*3+2]=X,h[T*3]=1,h[T*3+1]=fe(.62+.3*y.fbm2(I*.09,Y*.09,3),.35,.92),h[T*3+2]=0}await o.yield()}const s=new Uint16Array((r-1)*(n-1)*6);for(let S=0,T=0;S<r-1;S++){for(let E=0;E<n-1;E++,T+=6){const I=S*n+E,Y=I+1,X=I+n,H=X+1;s[T]=I,s[T+1]=Y,s[T+2]=X,s[T+3]=Y,s[T+4]=H,s[T+5]=X}S%16===15&&await o.yield()}const f=new a.BufferGeometry;f.setAttribute("position",new a.BufferAttribute(l,3)),f.setAttribute("aG",new a.BufferAttribute(h,3)),f.setIndex(new a.BufferAttribute(s,1)),await o.yield(),await Wt(f,o.yield),await o.yield(),f.boundingSphere=new a.Sphere(new a.Vector3(0,0,-150),480);const c=e.findIndex(S=>S>80)-1,b=c*(r-1)*6,M=new Uint16Array(b),d=new Uint16Array(s.length-b);for(let S=0,T=0,E=0,I=0;S<r-1;S++)for(let Y=0;Y<n-1;Y++,T+=6)for(let X=0;X<6;X++)Y<c?M[E++]=s[T+X]:d[I++]=s[T+X];f.setIndex(new a.BufferAttribute(M,1));const z=new a.BufferGeometry;for(const S in f.attributes)z.setAttribute(S,f.attributes[S]);z.setIndex(new a.BufferAttribute(d,1)),z.boundingSphere=f.boundingSphere;const B=new a.Mesh(f,S0);B.name="cliff",P.add(B);{let S=1e9,T=-1e9,E=1e9,I=-1e9;for(let Y=0;Y<r;Y++)for(let X=c;X<n;X++){const H=(Y*n+X)*3;S=Math.min(S,l[H]),T=Math.max(T,l[H]),E=Math.min(E,l[H+2]),I=Math.max(I,l[H+2])}z.boundingSphere=new a.Sphere(new a.Vector3((S+T)/2,2,(E+I)/2),.5*Math.hypot(T-S,264,I-E)+2)}const G=new a.Mesh(z,S0);G.name="cliff-east",P.add(G)}const ha=(e,t,n)=>{const l=(Pe(e+.8,t)-Pe(e-.8,t))/1.6,h=(Pe(e,t+.8)-Pe(e,t-.8))/(2*.8);return n.set(-l,-h,1).normalize()};await o.yield();const fa=new a.Color(x.fog),ua=O.clone().lerp(new a.Vector3(0,1,0),.25).normalize(),Lt=new a.Mesh(new a.SphereGeometry(900,32,20),new a.ShaderMaterial({uniforms:{uFogCol:{value:fa},uFogLow:v.uFogLow,uFogUp:v.uFogUp,uGlow:{value:U},uGlowDir:{value:ua},uTime:v.uTime},vertexShader:Da,fragmentShader:qa,side:a.BackSide,depthWrite:!1,depthTest:!1,fog:!1}));Lt.renderOrder=-1,Lt.frustumCulled=!1,Lt.name="dome",P.add(Lt),await o.yield();const fo=W(Oa,$a,{uWallCoral:{value:new a.Vector2(.5,1.2)}},{vertexColors:!0,side:a.DoubleSide}),pa=q[4].clone().multiplyScalar(.66),uo=q[5].clone().multiplyScalar(.62),qe=new a.Vector3(0,1,0),we=new Ye,xt=new Ye,Zt=e=>{const t=m.naveLine;let n=0;for(;n<t.length-2&&t[n+1].x>e;)n++;const r=fe((t[n].x-e)/Math.max(.001,t[n].x-t[n+1].x),-1,2);return j(t[n].z,t[n+1].z,r)},Dt=(e,t)=>t.set(0,e.y-5.6,e.z-Zt(e.x)).normalize(),po=(e,t,n=we,r=i)=>{n.B=[3,0,0,0],n.A=[e.x,e.y,e.z,0];const l=r()*$;Ut(n,e,[[1.25*t,-.5*t],[1.15*t,.1*t],[.8*t,.5*t],[.35*t,.72*t]],7,{top:.78*t,yaw:l,sz:r.range(.7,1),rf:(h,s)=>1+.16*Math.sin(s*3+l)+.1*Math.sin(s*5+h),onRing:h=>{const s=.05+.03*h;n.col=[s*.85,s,s*1.1]}})},P0=(e=i)=>pa.clone().multiplyScalar(e.range(.85,1.1)).lerp(new a.Color(.55,.16,.2),e.range(0,.25)),Ke=[],mo=[],zt=[],wo=9.4,Yt=la(6),Xt=(e,t,n,r)=>{for(let l=0;l<18;l++){const h=(n+r)/2;Pe(e,h)>t?n=h:r=h}return n};{const e=new a.Vector3(Ae,Xt(Ae,it,44,68)-.5,it);Ft(we,i,e,new a.Vector3(.04,1,-.06),Ht,{depth:3,sides:9,smooth:!0,col:new a.Color(1,.33,.45),sway:1.5,trop:qe,fan:new a.Vector3(1,0,0).applyAxisAngle(qe,rt("entry-fan")()*$),thick:.062,clear:Yt}),zt.push([e.x,e.z,Ht]),lo.value.set(e.x,e.y,e.z,Ht),await o.yield(),Ke.push([e.x+3.6,e.y-1.2,e.z+.6,1.2],[e.x-3,e.y-.6,e.z+2.6,.9],[e.x+1.5,e.y-3,e.z+5.2,1.4]);const t=new a.Vector3(ke,Xt(ke,yt,2,24)-.4,yt);Ft(we,i,t,new a.Vector3(.1,1,.12),wo,{depth:3,sides:8,smooth:!0,col:new a.Color(.95,.38,.5),sway:1.1,trop:qe,fan:new a.Vector3(.74,0,-.67),thick:.06}),zt.push([t.x,t.z,wo]),Ke.push([t.x+3,t.y-.8,t.z+1,1.5],[t.x-2.6,t.y-.5,t.z+2.4,1.1],[t.x+.5,t.y-2.2,t.z+4.6,1.7],[t.x-5,t.y-3.5,t.z+5.5,1.3])}await o.yield();const ve=rt("cliff-coral"),da=Math.round(27*g),ma=new a.Vector3;for(let e=0,t=0;e<da&&t<400;t++){t%8===7&&await o.yield();const n=e<9,r=!n&&e<17,l=n?ve.range(Ae+14,Ae+96):r?ve.range(It-6,Ae-14):ve.range(-150,100),h=n?ve.range(40,96):r?ve.range(36,100):ve.range(40,114),s=n?ve.range(6.5,11):ve.range(4.5,9.5);if(Math.abs(l-Ae)<13&&h>44&&h<84||Math.abs(l-ke)<10&&h<34)continue;const f=h>98,c=Pe(l,h),b=ha(l,h,ma).clone().multiplyScalar(f?.45:.8).add(new a.Vector3(0,f?-.85:.55,0)).normalize();Ft(we,ve,new a.Vector3(l,h,c-.4),b,s,{depth:2,sides:5,col:P0(ve),sway:.55+.06*s,trop:f?new a.Vector3(0,-1,0):qe,thick:.055,clear:Yt}),ve.chance(.5)&&Ke.push([l+ve.range(-4,4),h+ve.range(-3,3),0,ve.range(.9,1.9),1]),e++,await o.yield()}await o.yield();const qt=[];{const e=Math.round(14*g);for(let t=0;t<e;t++){const n=(t+i.range(.15,.85))/e*$,r=i.range(1.02,1.3);qt.push([Se.x+4+Math.cos(n)*100*r,Se.z+Math.sin(n)*58*r,i.range(5,10),i.chance(.4)?3:2])}}const C0=qt.length;{const e=m.heading.x,t=m.heading.z;for(const[n,r,l,h]of[[1,13.5,9,3],[8,-14,10,3],[15,12,8.5,3],[22,-13,9.5,3],[29,13,9,3],[35,-12.5,8.5,2],[41,13.5,8,2],[46,-15,7.5,2],[4,-24,13,2],[11,23,14,2],[19,-26,12.5,2],[26,25,13,2],[33,-23,11,2],[39,24,12,2],[47,21,10,2],[53,-19,11,2],[58,16,9.5,2],[65,-17,10.5,2],[72,20,10,2]])qt.push([ce.x+e*n-t*r,ce.z+t*n+e*r,l,h,1])}for(let e=0;e<qt.length;e++){await o.yield();const[t,n,r,l,h]=qt[e],s=lt(t,n),f=r*.2,c=e<C0&&t<-62||Rt(t,n)<-58||ie.distanceTo(t,s+r*.55,n)<(h?r*.42+6:r*.6+7),b=c?xt:we;po(new a.Vector3(t,s+.3*f,n),f,b),c||zt.push([t,n,r]),Ft(b,i,new a.Vector3(t,s+.85*f,n),new a.Vector3(i.range(-.15,.15),1,i.range(-.15,.15)),r,{depth:l,sides:l===3?6:5,twig:e<C0?5:0,col:P0(),sway:.25+.035*r,trop:qe,thick:.05,clear:e<C0?Yt:null});for(let M=0;M<2;M++){const d=i()*$,z=f*i.range(1.1,1.9),B=i.range(.9,2.2);c||Ke.push([t+Math.cos(d)*z,0,n+Math.sin(d)*z,B,2])}await o.yield()}{const e=rt("grove"),t=Math.round(36*g),n=m.spineTop[0];let r=yt;for(let f=0;f<6;f++)r=Pe(ke,bt(ke,r));const l=n.x-ke,h=n.z-r,s=Math.hypot(l,h)||1;for(let f=0;f<t;f++){await o.yield();const c=e(),b=e.range(-28,28),M=e.range(7,13),d=ke+l*c-h/s*b,z=r+h*c+l/s*b,B=lt(d,z),G=M*.2,S=Rt(d,z)<-58||Qt(d,z)<1||zt.some(([E,I])=>(d-E)*(d-E)+(z-I)*(z-I)<81)||ie.distanceTo(d,B+M*.55,z)<M*.6+7,T=S?xt:we;po(new a.Vector3(d,B+.3*G,z),G,T,e),S||zt.push([d,z,M]),Ft(T,e,new a.Vector3(d,B+.85*G,z),new a.Vector3(e.range(-.15,.15),1,e.range(-.15,.15)),M,{depth:3,sides:6,twig:5,col:P0(e),sway:.25+.035*M,trop:qe,thick:.05,clear:Yt,tips:S?null:mo});for(let E=0;E<2;E++){const I=e()*$,Y=G*e.range(1.1,1.9),X=e.range(.9,2.2);Ke.push([d+Math.cos(I)*Y,0,z+Math.sin(I)*Y,X,2,e,S])}await o.yield()}}{const e=u.fork("stacks");for(const[t,n,r,l]of[[80,150,16,58],[14,146,20,76],[-36,160,24,94],[-80,130,16,64],[-120,114,13,50]]){const h=new a.Vector3(t+e.range(-4,4),lt(t,n)-8,n+e.range(-4,4)),s=e()*$,f=r*e.range(.9,1.1),c=l*e.range(.9,1.12),b=(d,z,B,G)=>Ut(we,d,[[1,0],[.92,.12],[.8,.3],[.76,.46],[.6,.6],[.54,.76],[.36,.86],[.27,.95]].map(([S,T])=>[S*z,T*B]),12,{top:B*.99,yaw:G,sz:e.range(.7,.95),rf:(S,T)=>1+.26*Math.sin(T+G+S*.5)+.15*Math.sin(T*3+S*1.7)+.1*Math.sin(T*5-S*2.3),onRing:S=>{const T=.05+.012*S;we.col=[T*.85,T,T*1.1]}});we.B=[3,0,0,0],we.A=[h.x,h.y,h.z,0],b(h,f,c,s);const M=e()*$;b(new a.Vector3(h.x+Math.cos(M)*f*1.05,h.y,h.z+Math.sin(M)*f*1.05),f*e.range(.6,.8),c*e.range(.45,.62),s+2.1)}await o.yield()}{const e=rt("strewn");for(let t=0;t<15;t++){const n=e()*$,r=e.range(.6,1);Ke.push([Se.x+Math.cos(n)*92*r,0,Se.z+Math.sin(n)*50*r,e.range(1,2.3),2])}}for(const e of m.scapulae)for(let t=0;t<4;t++)Ke.push([e.x+i.range(-2.2,2.2),e.y+.05,e.z+i.range(-2.2,2.2),i.range(.7,1.5)]);for(let e=0,t=0;e<Math.round(34*g)&&t<400;t++){t%40===39&&await o.yield();const n=i.range(-40,120),r=i.range(-58,80);Nt(n,r)<.5||(Ke.push([n,0,r,i.range(1.2,3),2]),e++)}let wa=0;for(const e of Ke){++wa%8===0&&await o.yield();let[t,n,r,l,h,s=i,f=!1]=e;h===1?r=Pe(t,n)-.2:h===2&&(n=lt(t,r)-.3);let c=f||ie.distanceTo(t,n+l*.6,r)<l+5;if(h===2&&!c){const b=ie.nearestXZ(t,r);c=b.dist<8&&b.y-n<16}Yo(c?xt:we,s,new a.Vector3(t,n,r),l,uo.clone().multiplyScalar(s.range(.8,1.15)))}if(await o.yield(),R.age==="reef"){const e=[],t=new a.Vector3,n=new a.Vector3,r=new a.Vector3;for(const s of m.ribs)if(!s.stub)for(let f=1;f<s.points.length;f++)e.push([s.points[f],s.fallen?1:0]);for(const s of m.spineTop)e.push([s,1]);for(const s of m.scapulae)e.push([s,2],[s,2]);const l=rt("reef-sprigs");let h=0;for(let s=0;s<900&&h<30;s++){s%6===5&&await o.yield();const[f,c]=l.pick(e);c===0?(Dt(f,n),l.chance(.2)&&n.multiplyScalar(-1),n.x+=l.range(-.4,.4),n.y+=l.range(.1,.6)):n.set(l.range(-.3,.3),1,l.range(-.3,.3)),n.normalize(),t.copy(f).addScaledVector(n,c===0?.12:.02),c===2?(t.x+=l.range(-2.6,2.6),t.z+=l.range(-2.6,2.6)):c===1&&(t.x+=l.range(-.4,.4),t.z+=l.range(-.8,.8));const b=l.range(1.2,2.2);if(r.copy(t).addScaledVector(n,b*.6),n.y<.3||t.distanceToSquared(m.foramen)<6||ie.distanceTo(r.x,r.y,r.z)<1.9+b*.62||ie.distanceTo(t.x,t.y,t.z)<2.3)continue;const M=new a.Color(.86,.5,.58).lerp(new a.Color(.8,.76,.72),l.range(.1,.55)).multiplyScalar(l.range(.8,.95));Ft(we,l,t.clone(),n.clone().lerp(qe,.25),b,{depth:2,sides:5,col:M,sway:.05+.03*b,trop:qe,thick:.06}),h++}for(let s=0,f=0;s<36&&f<400;f++){f%8===7&&await o.yield();const c=be.pick(m.ribs),b=c.points,M=be.chance(.45),d=M?be.range(0,.12):be.range(.14,.68),z=be.range(.55,.9),B=be.range(-.35,.35),G=be.range(.85,1.1);if(c.stub||c.fallen)continue;const S=d*(b.length-1),T=Math.min(b.length-2,Math.floor(S));t.lerpVectors(b[T],b[T+1],S-T),Dt(t,n),M?(t.x+=B*2,t.y+=.22,t.z-=Math.sign(n.z||1)*.3):(t.addScaledVector(n,.12+.2*z),t.x+=B*.5,t.y-=.3*z),!(ie.distanceTo(t.x,t.y+z*.4,t.z)<1.9+z)&&(Yo(we,be,t.clone(),z,uo.clone().multiplyScalar(G),2),s++)}}await o.yield();{const e=we.build({a:"aSway",b:"aK",bSize:1});await o.yield(),await Wt(e,o.yield),await o.yield(),e.boundingSphere=new a.Sphere(new a.Vector3(40,30,-40),360);const t=new a.Mesh(e,fo);t.name="coral-and-sponge",P.add(t)}await o.yield();const T0=new Ye,Ce=new a.Vector3,xe=new a.Vector3,ct=(e,t,n)=>Xo(ie.distanceTo(e.x,e.y,e.z)>1.9+n&&e.distanceToSquared(m.foramen)>3.6?T0:xt,i,e,n,t),Mt=()=>i.range(.34,.62);let vo=0;for(const e of m.spineTop){++vo%8===0&&await o.yield();const t=i.int(1,3);for(let n=0;n<t;n++)ct(xe.set(e.x+i.range(-.5,.5),e.y-.04,e.z+i.range(-.7,.7)),Ce.set(i.range(-.2,.2),1,i.range(-.3,.3)),Mt())}await o.yield();for(const e of m.ribs){++vo%3===0&&await o.yield();const t=e.points,n=e.stub?2:6;for(let r=0;r<n;r++){const l=e.stub||r<2?r:i.int(2,t.length-1);Dt(t[l],Ce),e.fallen?Ce.set(0,1,0):i.chance(.3)&&Ce.multiplyScalar(-1),Ce.x+=i.range(-.4,.4),Ce.normalize(),ct(xe.copy(t[l]).addScaledVector(Ce,.3),Ce,Mt())}}await o.yield(),await o.yield();for(const e of m.skullLine)if(e.distanceToSquared(m.foramen)>25)for(let t=0;t<3;t++)ct(xe.set(e.x+i.range(-1,1),e.y+.05,e.z+i.range(-2.4,2.4)),Ce.set(0,1,0),Mt());await o.yield();for(const e of m.scapulae)for(let t=0;t<6;t++)ct(xe.set(e.x+i.range(-3,3),e.y+.02,e.z+i.range(-3,3)),Ce.set(0,1,0),Mt());const va=m.occiput||[],Et=m.occiputSeat||null;for(const e of va)ct(xe.copy(e[0]).addScaledVector(e[1],-.06),e[1],i.range(.62,.9));for(const e of m.occiput2||[]){const t=be.range(.66,.92);xe.copy(e[0]).addScaledVector(e[1],-.06),Xo(ie.distanceTo(xe.x,xe.y,xe.z)>1.9+t&&xe.distanceToSquared(m.foramen)>3.6?T0:xt,be,xe,t,e[1])}for(const e of m.flipperLine)for(let t=0;t<2;t++)ct(xe.set(e.x+i.range(-.8,.8),e.y+.25,e.z+i.range(-.8,.8)),Ce.set(0,1,0),Mt());for(const e of m.archTips)for(let t=0;t<3;t++)ct(xe.set(e.x+i.range(-.4,.4),e.y-t*1.2,e.z+i.range(-.4,.4)),Ce.set(i.range(-1,1),.6,i.range(-1,1)).normalize(),Mt());{const e=T0.build({a:"aSway",b:"aK",bSize:1});await o.yield(),await Wt(e,o.yield),e.boundingSphere=new a.Sphere(new a.Vector3(-10,0,0),95);const t=new a.Mesh(e,fo);t.name="anemones",P.add(t)}await o.yield();const go=new Ye,Je=[];{const e=R.age==="white";for(const s of m.octopusSeats)Je.push([s.position.x,s.position.y+.45,s.position.z,1.12,Math.atan2(s.side||.3,.4)]);Et&&Je.push([Et[0].x,Et[0].y+.34,Et[0].z,.86,Et[2],1]);const t=m.spineTop;[.12,.26,.4,.52].concat(e?[.2,.33,.46]:[]).forEach((s,f)=>{const c=t[Math.floor(s*t.length)],b=f%2?1:-1,M=c.x+i.range(-1,1),d=c.z+b*i.range(4.2,5.2);Je.push([M,N(M,d)+.72,d,i.range(.95,1.15),i()*$])});for(const s of m.scapulae)Je.push([s.x+4.6,N(s.x+4.6,s.z+1.5)+.7,s.z+1.5,1.05,i()*$]);const r=m.flipperLine[2];Je.push([r.x+2.4,N(r.x+2.4,r.z)+.72,r.z,1,i()*$]),Je.push([Ae+3.2,Xt(Ae+3.2,it+3.4,44,68)+.5,it+3.4,1.3,.6],[ke-2.2,Xt(ke-2.2,yt+1.6,2,24)+.5,yt+1.6,1.2,.9]);for(let s=0;s<(e?5:2);s++){const f=i.range(-20,50),c=i.range(-52,-40);Je.push([f,bt(f,c)+.75,c,1.1,i()*$])}for(const s of Je){const f=ie.distanceTo(s[0],s[1],s[2])<(s[5]?1.85+s[3]*.95:2.4+s[3]*1.25);Xa(f?xt:go,i,new a.Vector3(s[0],s[1],s[2]),s[3],s[4]),await o.yield()}const l=go.build({color:!1,a:"aC",b:"aO"});await o.yield(),await Wt(l,o.yield),l.boundingSphere=new a.Sphere(new a.Vector3(40,20,-30),230);const h=new a.Mesh(l,W(ja,Ia,{uSkin:{value:new a.Color("#C9B3D6").multiplyScalar(.72)},uUnder:{value:new a.Color(.66,.56,.6)}},{side:a.DoubleSide}));h.name="octopuses",P.add(h)}await o.yield();const Jt=e=>W(_a,Ka,{uTintA:{value:new a.Color(1,1,1)},uTintB:{value:new a.Color(1,1,1)},uBob:{value:0},uGloss:{value:.12},...e},{vertexColors:!0,side:a.DoubleSide}),yo=m.ribs.filter(e=>!e.stub),e0=Math.round(60*p),ga=Math.round(80*p),Gt=e0+ga,Ee=new Float32Array(Gt*4),Ge=new Float32Array(Gt*4),We=new Float32Array(Gt*4),bo=[];{const e=m.spineTop,t=m.skullLine;for(let l=0;l<e0;l++){const h=i();let s,f;if(h<.42){const c=i.int(0,e.length-4);s=e.slice(c,c+i.int(3,4)),f=0}else if(h<.9){const c=i.pick(yo),b=c.fallen?0:i.int(0,6);s=c.points.slice(b,b+i.int(3,5)),f=c.fallen?0:1}else{const c=Math.max(2,i.int(0,Math.max(0,t.length-4)));s=t.slice(c,c+3),f=0}s.length<2&&(s=e.slice(0,3)),bo.push({pts:s,mode:f,rate:i.range(.1,.22),ph:i()*10,inner:f===1&&i.chance(.3)?-1:1,lift:f===1?.56:.2,side:i.range(-.25,.25)}),Ee[l*4+3]=i.range(.42,.6),We[l*4]=i()*$,We[l*4+1]=0,We[l*4+2]=0,We[l*4+3]=i.range(.8,1.3),Ge[l*4+3]=1}const n=new a.Vector3,r=new a.Vector3;for(let l=e0;l<Gt;l++){const h=i();let s,f,c;if(n.set(0,1,0),h<.5){const d=i.pick(yo),z=d.points,B=d.fallen?i.int(2,9):i.int(6,z.length-1);Dt(z[B],n),d.fallen&&n.set(0,1,0),s=z[B].x+n.x*.5,f=z[B].y+n.y*.5,c=z[B].z+n.z*.5}else if(h<.7){const d=i.pick(m.spineTop);s=d.x+i.range(-.4,.4),f=d.y+.1,c=d.z+i.range(-.9,.9)}else if(h<.85){const d=i.pick(t);s=d.x+i.range(-1,1),f=d.y+.14,c=d.z+i.range(-2.2,2.2)}else{const d=i.pick(m.scapulae);s=d.x+i.range(-3,3),f=d.y+.12,c=d.z+i.range(-3,3)}const b=i()*$,M=st(n,r.set(Math.cos(b),.2,Math.sin(b)));Ee[l*4]=s,Ee[l*4+1]=f,Ee[l*4+2]=c,Ee[l*4+3]=i.range(.36,.5),Ge[l*4]=M.x,Ge[l*4+1]=M.y,Ge[l*4+2]=M.z,Ge[l*4+3]=M.w,We[l*4]=i()*$,We[l*4+1]=1,We[l*4+2]=1,We[l*4+3]=i.range(.5,1.1)}}await o.yield();const ht=$e(Ja(),Gt,{iPos:Ee,iQuat:Ge,iDat:We});ht.attributes.iPos.setUsage(a.DynamicDrawUsage),ht.attributes.iQuat.setUsage(a.DynamicDrawUsage),ht.boundingSphere=new a.Sphere(new a.Vector3(-10,0,0),100);const t0=new a.Mesh(ht,Jt({uTintA:{value:C?new a.Color(.62,.07,.06):new a.Color(.7,.7,.66)},uTintB:{value:new a.Color(.74,.4,.22)},uGloss:{value:.3}}));t0.name="crabs",t0.frustumCulled=!1,P.add(t0),await o.yield();const ft=R.feet,xo=ft.length/3,zo=(e,t,n)=>{for(let r=0;r<xo;r++){const l=e-ft[r*3],h=t-ft[r*3+1],s=ft[r*3+2]+n;if(l*l+h*h<s*s)return!0}return!1},V0=(e,t,n)=>{const r=Qt(e,t);if(r>.76&&r<.93)return null;const l=Nt(e,t);return ro(e,t,l)>.45?null:r<=.76?zo(e,t,n)?null:N(e,t)-.03:lt(e,t,l)+.02},kt=rt("bed-scatter"),F0=he-m.portalSeat.radius,B0=async(e,t,n,r,l,h,s=.45)=>{const f=new a.Vector3;for(let c=0,b=0;c<e&&b<e*4;b++){b%30===29&&await o.yield();const M=kt.chance(s);let d,z;if(M){const G=kt()*$,S=Math.min(.78,Math.abs(kt.gauss())*.34+.05);d=Se.x+Math.cos(G)*92*S,z=Se.z+Math.sin(G)*50*S}else ie.posAtDist(kt.range(n,r),f),d=f.x+kt.gauss()*t,z=f.z+kt.gauss()*t;const B=V0(d,z,l);B!==null&&(h(c,d,B,z),c++)}},ze=new a.Vector3,Ot=new a.Vector3,o0=J.clone().sub(ce).normalize(),Mo=new a.Vector3(-o0.z,0,o0.x).normalize(),ya=-70,ko=[],Ue={star:140,shell:110,brittle:80,crab:140},a0=(e,t,n,r,l=1.5,h=4)=>{let s=1e9,f=-1e9,c=1e9,b=-1e9,M=1e9,d=-1e9;for(let G=0;G<n;G++){const S=t[G*h],T=t[G*h+1],E=t[G*h+2];T<-900||(s=Math.min(s,S),f=Math.max(f,S),c=Math.min(c,T),b=Math.max(b,T),M=Math.min(M,E),d=Math.max(d,E))}s>f&&(s=f=c=b=M=d=0);const z=new a.Vector3((s+f)/2,(c+b)/2,(M+d)/2),B=.5*Math.hypot(f-s,b-c,d-M)+l;e.geometry.boundingSphere=new a.Sphere(z,B),e.frustumCulled=!0,ko.push([e,z,(B+r)*(B+r)])},Ao=(e,t)=>[0,1].map(n=>{const r=[];for(let h=0;h<e;h++)(t.iPos[h*4]<ya?1:0)===n&&r.push(h);const l={n:r.length};for(const h in t){const s=new Float32Array(Math.max(1,r.length)*4);for(let f=0;f<r.length;f++)for(let c=0;c<4;c++)s[f*4+c]=t[h][r[f]*4+c];l[h]=s}return l});let N0=null,R0=null,L0=null;const n0=(e,t,n)=>n.set(N(e-.7,t)-N(e+.7,t),2*.7,N(e,t-.7)-N(e,t+.7)).normalize();{const e=Math.round(150*p),t=new Float32Array(e*4),n=new Float32Array(e*4),r=new Float32Array(e*4);for(let s=0;s<e;s++)t[s*4+1]=-999,n[s*4+3]=1;await B0(e,20,Le-jt,F0,.9,(s,f,c,b)=>{n0(f,b,ze);const M=i()*$,d=st(ze,Ot.set(Math.cos(M),0,Math.sin(M)));t.set([f,c,b,i.range(.55,1.15)],s*4),n.set([d.x,d.y,d.z,d.w],s*4),r.set([i()*$,0,i(),i.range(.6,1.2)],s*4)});const l=$e(en(),e,{iPos:t,iQuat:n,iDat:r});l.boundingSphere=new a.Sphere(new a.Vector3(0,0,0),260);const h=new a.Mesh(l,Jt({uTintA:{value:new a.Color(.78,.3,.08)},uTintB:{value:new a.Color(.8,.46,.16)}}));h.name="sea-stars",h.frustumCulled=!1,P.add(h),N0=h}await o.yield();{const e=R.age==="white",t=Math.round((e?1050:800)*p*j(.6,1,k)),n=new Float32Array(t*4),r=new Float32Array(t*4),l=new Float32Array(t*4);for(let d=0;d<t;d++)n[d*4+1]=-999,r[d*4+3]=1;await B0(t,22,Le-jt,F0,.1,(d,z,B,G)=>{n0(z,G,ze),ze.x+=i.range(-.5,.5)*.3,ze.z+=i.range(-.5,.5)*.3;const S=i()*$,T=st(ze,Ot.set(Math.cos(S),0,Math.sin(S))),E=i();n.set([z,B,G,E<.45?i.range(.16,.34):i.range(.08,.24)],d*4),r.set([T.x,T.y,T.z,T.w],d*4),l.set([i()*$,0,E<(e?.6:.45)?i.range(0,.12):i.range(.3,1),0],d*4)});const[h,s]=Ao(t,{iPos:n,iQuat:r,iDat:l}),f=$e(tn(),h.n,{iPos:h.iPos,iQuat:h.iQuat,iDat:h.iDat});f.boundingSphere=new a.Sphere(new a.Vector3(0,0,0),260);const c=new a.Mesh(f,Jt({uTintA:{value:new a.Color(.47,.47,.44)},uTintB:{value:new a.Color(.09,.1,.1)}}));c.name="shells",c.frustumCulled=!1,P.add(c),R0=c;const b=$e(f,s.n,{iPos:s.iPos,iQuat:s.iQuat,iDat:s.iDat});b.boundingSphere=f.boundingSphere;const M=new a.Mesh(b,c.material);M.name="shells-slope",P.add(M),a0(M,s.iPos,s.n,Ue.shell)}await o.yield();{const e=Math.round(2200*p*j(.5,1,(k-.6)/.4)),t=new Float32Array(e*4),n=new Float32Array(e*4);for(let B=0;B<e;B++)t[B*4+1]=-999;await B0(e,15,Le-jt,F0,.25,(B,G,S,T)=>{t.set([G,S-.04,T,i.range(.45,1)],B*4),n.set([i()*$,i()*$,i(),i.range(.6,1.2)],B*4)},.22);const r=new a.BufferGeometry,l=[],h=[],s=3;for(let B=0;B<3;B++){const G=l.length/3;for(let T=0;T<s;T++)l.push(B,T/s,-1,B,T/s,1);l.push(B,1,0);for(let T=0;T<s-1;T++){const E=G+T*2;h.push(E,E+1,E+2,E+1,E+3,E+2)}const S=G+(s-1)*2;h.push(S,S+1,S+2)}r.setAttribute("position",new a.BufferAttribute(new Float32Array(l),3)),r.setIndex(h);const[f,c]=Ao(Math.min(e,2e3),{iPos:t,iDat:n}),b=$e(r,f.n,{iPos:f.iPos,iDat:f.iDat});b.boundingSphere=new a.Sphere(new a.Vector3(0,0,0),260);const M=new a.Mesh(b,W(Wa,Ua,{uTintA:{value:new a.Color(.27,.27,.25)},uTintB:{value:new a.Color(.34,.24,.17)}},{side:a.DoubleSide}));M.name="brittle-stars",M.frustumCulled=!1,P.add(M),L0=M;const d=$e(r,c.n,{iPos:c.iPos,iDat:c.iDat});d.boundingSphere=b.boundingSphere;const z=new a.Mesh(d,M.material);z.name="brittle-stars-slope",P.add(z),a0(z,c.iPos,c.n,Ue.brittle)}await o.yield();const So=[],Po=[[],[]],D0=[null,null];{const e=j(1,.45,ee(1,1.2,p)),t=rt("bed-approach"),n=[t,be],r=(c,b)=>{for(let M=0;M<14;M++){let d,z;if(c===0){const G=t(),S=_e.rEnd-14-136*(.35*G+.65*G*G),T=fe(t.gauss()*b,-30,40),[E,I]=_e.plan(S),[Y,X]=_e.tanAt(S);d=E-X*T,z=I+Y*T}else{const G=be.range(-12,84),S=be.gauss()*b;d=ce.x+o0.x*G+Mo.x*S,z=ce.z+o0.z*G+Mo.z*S}const B=V0(d,z,.6);if(B!==null)return[d,B,z]}return null},l=(c,b,M,d,z,B,G,S=!0)=>{const T=new Float32Array(Math.max(1,d)*4),E=new Float32Array(Math.max(1,d)*4),I=new Float32Array(Math.max(1,d)*4);let Y=0;for(let Te=0;Te<d;Te++){const Ve=r(M,z);Ve&&(G(Ve,Y,T,E,I,n[M]),Y++)}const X=$e(c.geometry,Y,S?{iPos:T,iQuat:E,iDat:I}:{iPos:T,iDat:I}),H=new a.Mesh(X,c.material);H.name=b,P.add(H),a0(H,T,Y,B)},h=([c,b,M],d,z,B,G,S)=>{n0(c,M,ze);const T=S()*$,E=st(ze,Ot.set(Math.cos(T),0,Math.sin(T)));z.set([c,b,M,S.range(.6,1.25)],d*4),B.set([E.x,E.y,E.z,E.w],d*4),G.set([S()*$,0,S(),S.range(.6,1.2)],d*4)},s=([c,b,M],d,z,B,G,S)=>{n0(c,M,ze),ze.x+=S.range(-.15,.15),ze.z+=S.range(-.15,.15);const T=S()*$,E=st(ze,Ot.set(Math.cos(T),0,Math.sin(T)));z.set([c,b,M,S.range(.12,.34)],d*4),B.set([E.x,E.y,E.z,E.w],d*4),G.set([S()*$,0,S.chance(.5)?S.range(0,.12):S.range(.3,1),0],d*4)},f=([c,b,M],d,z,B,G,S)=>{z.set([c,b-.04,M,S.range(.5,1.05)],d*4),G.set([S()*$,S()*$,S(),S.range(.6,1.2)],d*4)};l(N0,"sea-stars-approach",0,Math.round(120*e),21,Ue.star,h),l(N0,"sea-stars-shoulder",1,Math.round(30*e),13,Ue.star,h),await o.yield(),l(R0,"shells-approach",0,Math.round(190*e),19,Ue.shell,s),l(R0,"shells-shoulder",1,Math.round(50*e),13,Ue.shell,s),await o.yield(),l(L0,"brittle-stars-approach",0,Math.round(640*e),13,Ue.brittle,f,!1),l(L0,"brittle-stars-shoulder",1,Math.round(220*e),13,Ue.brittle,f,!1),await o.yield();for(let c=0;c<2;c++){const b=Math.round((c===0?18:9)*e),M=c===0?mo:[],d=Math.min(M.length,Math.round(22*e)),z=b+d,B=new Float32Array(z*4),G=new Float32Array(z*4),S=new Float32Array(z*4),T=[],E=n[c];for(let X=0;X<b;X++){const H=r(c,c===0?12:8)||[J.x,-999,J.z],Te=E()*$,Ve=E.range(2.5,5),Q=H[0]+Math.cos(Te)*Ve,de=H[2]+Math.sin(Te)*Ve,at=V0(Q,de,.6),mt=at===null?H:[Q,at,de];Po[c].push({a:H,b:mt,rate:E.range(.1,.2),ph:E()*10}),T.push(H[0],H[1],H[2],mt[0],mt[1],mt[2]),B[X*4+3]=E.range(.55,.8),G[X*4+3]=1,S.set([E()*$,0,0,E.range(.8,1.3)],X*4)}for(let X=b;X<z;X++){const H=M.splice(E.int(0,M.length-1),1)[0],Te=E()*$,Ve=E.range(.42,.58),Q=st(ze.set(0,1,0),Ot.set(Math.cos(Te),.2,Math.sin(Te)));So.push({k:X,x:H[0],y:H[1]+H[3]*.85,ty:H[1],z:H[2],w:H[4],ph:H[5]*.37+H[7]*.23,px:H[5],py:H[6],pz:H[7]}),T.push(H[0],H[1],H[2]),B.set([H[0],H[1]+H[3]*.85,H[2],Ve],X*4),G.set([Q.x,Q.y,Q.z,Q.w],X*4),S.set([E()*$,1,1,E.range(.5,1.1)],X*4)}const I=$e(ht,z,{iPos:B,iQuat:G,iDat:S});I.attributes.iPos.setUsage(a.DynamicDrawUsage),I.attributes.iQuat.setUsage(a.DynamicDrawUsage);const Y=new a.Mesh(I,t0.material);Y.name=c===0?"crabs-approach":"crabs-shoulder",P.add(Y),a0(Y,T,T.length/3,Ue.crab,3,3),D0[c]={P:B,Q:G,g:I,m:Y},await o.yield()}}await o.yield();{const t=new Float32Array(56),n=new Float32Array(56),r=m.baleen;for(let d=0;d<14;d++){const z=i()*$,B=Math.sqrt(i())*4.2,G=r.x+Math.cos(z)*B,S=r.z+Math.sin(z)*B*.8;t.set([G,Math.max(r.y,N(G,S)+.5)+i.range(0,1.1),S,i.range(1.8,2.4)],d*4),n.set([i()*$,i()*$,i(),i.range(.7,1.2)],d*4)}const l=14,h=6,s=[],f=[];for(let d=0;d<=l;d++)for(let z=0;z<h;z++){const B=z/h*$;s.push(d/l,Math.cos(B),Math.sin(B))}for(let d=0;d<l;d++)for(let z=0;z<h;z++){const B=d*h+z,G=d*h+(z+1)%h;f.push(B,G,B+h,G,G+h,B+h)}const c=new a.BufferGeometry;c.setAttribute("position",new a.BufferAttribute(new Float32Array(s),3)),c.setIndex(f);const b=$e(c,14,{iPos:t,iDat:n});b.boundingSphere=new a.Sphere(new a.Vector3(r.x,r.y,r.z),12);const M=new a.Mesh(b,W(Ha,Qa,{uTintA:{value:new a.Color(.36,.26,.3)},uTintB:{value:new a.Color(.5,.36,.38)}},{side:a.DoubleSide}));M.name="hagfish",M.frustumCulled=!1,P.add(M)}{const t=new Float32Array(68),n=new Float32Array(68),r=new Float32Array(68),l=new a.Vector3,h=new a.Vector3,s=new a.Quaternion,f=new a.Vector3(1,0,0);for(let M=0;M<17;M++){const d=(M+i.range(.15,.85))/17*he,z=i.range(2.5,5),B=i.range(9,14),G=i.range(8,15);let S=i.chance(.5)?1:-1,T=0,E=0,I=0;ie.posAtDist(d,l),ie.tangentAtDist(d,h);const Y=Math.hypot(h.x,h.z)||1,X=h.z/Y,H=-h.x/Y;for(let Q=0,de=!1,at=Math.max(G,l.x<12&&l.x>-72?13:0);Q<16;Q++){T=l.x+X*S*at,I=l.z+H*S*at,E=Math.max(lt(T,I)+z,l.y-B);const mt=I<Pe(T,E)+9,Fa=zt.some(([Ko,Wo,Uo])=>(T-Ko)*(T-Ko)+(I-Wo)*(I-Wo)<(.4*Uo+2.5)*(.4*Uo+2.5));if(mt&&!de){S=-S,de=!0;continue}if(mt||Fa||ie.distanceTo(T,E,I)<8){at+=2.5;continue}break}const Te=i.range(0,$),Ve=i.range(.5,.85);s.setFromUnitVectors(f,h.set(Math.cos(Te)*Math.cos(Ve),-Math.sin(Ve),Math.sin(Te)*Math.cos(Ve))),t.set([T,E,I,A?i.range(2.6,3.2):i.range(2.2,2.8)],M*4),n.set([s.x,s.y,s.z,s.w],M*4),r.set([i()*$,A?1:.2,i(),i.range(.7,1.1)],M*4)}const c=$e(on(),17,{iPos:t,iQuat:n,iDat:r});c.boundingSphere=new a.Sphere(new a.Vector3(0,0,0),200);const b=new a.Mesh(c,Jt({uTintA:{value:A?new a.Color(.5,.54,.6):new a.Color(.34,.33,.34)},uTintB:{value:A?new a.Color(.6,.59,.64):new a.Color(.46,.44,.42)},uBob:{value:.3},uGloss:{value:.35}}));b.name=A?"ratfish":"grenadiers",b.frustumCulled=!1,P.add(b)}await o.yield();const et=20,Co=W(Qo,Zo,{uSwim:{value:new a.Vector4(0,1,0,0)},uLen:{value:et},uFeat:{value:1},uBG:{value:x.belly},uTop:{value:new a.Color(.215,.18,.148)},uBelly:{value:new a.Color(.315,.288,.252)},uEye:{value:new a.Color(.2,1,.4).multiplyScalar(.9)}},{side:a.DoubleSide});await o.yield();const je=new a.Mesh(Jo(et,an,50,24,nn),Co);je.name="sixgill",je.frustumCulled=!1,P.add(je),await o.yield();const Ie=m.sharkLine,s0=m.skullLine,At=m.skullTip,ba=e=>{let t=90;for(;t>0&&!zo(e,t,12);)t-=.5;return t},To=[[64,9.5],[40,9],[16,8.5],[-8,9],[-30,9.5],[-46,8]].map(([e,t])=>[e,t,Math.min(ba(e)-3,Zt(fe(e,-27,7))+6.4+10)]),xa=To.length;await o.yield();const i0=To.concat([[At.x-7,4.2,At.z+12],[At.x-8.5,2.6,At.z+1.5],[At.x-1,5,At.z+.6],[s0[Math.floor(s0.length/2)].x,8,s0[Math.floor(s0.length/2)].z]]).map(e=>new a.Vector3(e[0],e[1],e[2]));for(let e=Ie.length-1;e>=0;e--)i0.push(Ie[e].clone());const Oe=Ie[0];i0.push(new a.Vector3(Oe.x+12,9.8,Oe.z-1),new a.Vector3(Oe.x+28,13.5,Oe.z-5),new a.Vector3(Oe.x+50,22,Oe.z-13),new a.Vector3(Oe.x+84,35,Oe.z-28),new a.Vector3(Oe.x+130,46,Oe.z-46));const ut=new a.CatmullRomCurve3(i0,!1,"centripetal"),tt=ut.getLength();await o.yield();const q0=j(y0,ta,.5)*he;let St=0,E0=0;{const e=ie.posAtDist(q0,new a.Vector3);let t=1e9,n=1e9;const r=i0[xa];for(let l=0;l<=500;l++){ut.getPointAt(l/500,ne);const h=(ne.x-e.x)**2+(ne.z-e.z)**2+(ne.y>12?1e6:0);h<t&&(t=h,St=l/500*tt);const s=ne.distanceToSquared(r);s<n&&(n=s,E0=l/500*tt)}}await o.yield();const za=St+(Le-q0)*.71,Ma=.71*ao(Le),ka=no(g0),G0=new a.Vector3,Pt=new a.Vector3,pt=new a.Vector3,r0=new a.Vector3,Vo=new a.Vector3,Fo=new a.Matrix4,$t=new a.Vector3,l0=new a.Vector3,Bo=new a.Vector3;let O0=0;const Aa=(e,t)=>{const n=e*he-q0,r=fe(e<g0?za-Ma*(ka-no(e)):n<0?St+n*.71:n<30?St+n*.78:St+23.4+(n-30)*1.4,8,tt-.5);O0=r;const l=Math.max(.5,r-.18*et);ut.getPointAt(l/tt,G0),ut.getTangentAt(l/tt,Pt),pt.crossVectors(Pt,qe).normalize(),r0.crossVectors(pt,Pt),je.position.copy(G0).addScaledVector(Pt,-.32*et),je.quaternion.setFromRotationMatrix(Fo.makeBasis(Pt,r0,pt)),je.updateMatrixWorld(),ut.getPointAt(Math.max(0,l-.5*et)/tt,Vo);const h=Vo.sub(G0).addScaledVector(Pt,.5*et).dot(pt),s=Co.uniforms.uSwim.value;if(s.x=t*1.5+r*.3,s.y=1,s.z=fe(4*h/et,-.9,.9),ut.getPointAt(r/tt,$t),$t.x<Ie[0].x+5&&$t.x>Ie[Ie.length-1].x-5&&$t.y>6){R.disturb(0,$t,2.3),l0.set(2.1,-2,4).applyMatrix4(je.matrixWorld),Bo.set(2.1,-2,-4).applyMatrix4(je.matrixWorld);const f=l0.x<Ie[0].x&&l0.x>Ie[Ie.length-1].x;R.disturb(1,f?l0:null,1.8),R.disturb(2,f?Bo:null,1.8)}else R.disturb(0,null),R.disturb(1,null),R.disturb(2,null)};let He=null;const No=new a.Vector3(It+150,pe+48,te+70),Ro=new a.Vector3(It+175,pe+42,te+190),c0=Ro.clone().sub(No).normalize(),Lo=x0(1),Do=x0(12),qo=x0(9);if(w.rare){const e=W(Qo,Zo,{uSwim:{value:new a.Vector4(0,.3,0,0)},uLen:{value:112},uFeat:{value:0},uTop:{value:new a.Color(.035,.05,.06)},uBelly:{value:new a.Color(.13,.17,.19)},uEye:{value:new a.Color(0,0,0)},uBG:{value:1.35}},{side:a.DoubleSide});He=new a.Mesh(Jo(112,sn,30,14,rn),e),He.name="living-whale",He.frustumCulled=!1,P.add(He),pt.crossVectors(c0,qe).normalize(),r0.crossVectors(pt,c0),He.quaternion.setFromRotationMatrix(Fo.makeBasis(c0,r0,pt))}await o.yield();const $0=j(.55,1,(k-.6)/.4),Sa=x.snowCol.map(e=>new a.Color(e).lerp(Z.clone().lerp(new a.Color(x.low),.35),.7)),_0=w0.makeParticles({rng:u.fork("snow"),preset:"snow",count:Math.round(4e3*Math.min(x.snow,2)*$0),box:[180,120,180],velocity:[2.5,-.75,.4],velocityRandom:[.7,.35,.5],turbulence:[.9,.35,.3],size:[.09,.3],colors:Sa,intensity:.44,opacity:.75,additive:.15,shape:"disc",core:.06,near:[6,22],minAngle:.0046,time:v.uTime});_0.object.name="marine-snow",P.add(_0.object);const K0=w0.makeParticles({rng:u.fork("flocs"),preset:"snow",count:Math.round(1500*Math.sqrt(x.snow)*$0),box:[120,84,120],velocity:[3,-.6,.6],velocityRandom:[.9,.4,.6],turbulence:[1.4,.5,.35],size:[.22,.72],colors:x.snowCol,intensity:.72,opacity:.5,additive:.15,shape:"disc",near:[2.5,10],core:.2,time:v.uTime});K0.object.name="snow-flocs",P.add(K0.object),await o.yield();const h0=40,W0=26,U0=new Float32Array(h0*3),f0=new Float32Array(h0*3),j0=new Float32Array(h0),u0=[],_t=[];for(let e=0;e<h0;e++)if(e<W0){const t=i.int(0,xo-1),n=i()*$,r=ft[t*3+2]+.6,l=ft[t*3]+Math.cos(n)*r,h=ft[t*3+1]+Math.sin(n)*r;U0.set([l,N(l,h)+.15,h],e*3),f0.set([-i.range(0,12),i.range(3,4.5),i.range(6,13)],e*3),j0[e]=i.range(.8,1.5)}else{const t=St-34+(e-W0)*6.5;ut.getPointAt(fe(t/tt,0,1),ne);const n=ne.x+i.range(-1,1),r=ne.z+i.range(-2,2);U0.set([n,N(n,r)+.4,r],e*3),f0.set([-100,i.range(4,5.5),0],e*3),j0[e]=i.range(1.6,2.4),u0.push(t),_t.push(!1)}const Kt=new a.BufferGeometry;Kt.setAttribute("position",new a.BufferAttribute(U0,3));const I0=new a.BufferAttribute(f0,3);I0.setUsage(a.DynamicDrawUsage),Kt.setAttribute("aLife",I0),Kt.setAttribute("aSize",new a.BufferAttribute(j0,1)),Kt.boundingSphere=new a.Sphere(new a.Vector3(0,0,0),200);const p0=new a.Points(Kt,W(Za,Ya,{},{transparent:!0,depthWrite:!1,premultipliedAlpha:!0}));p0.name="silt-puffs",p0.frustumCulled=!1,p0.renderOrder=2,P.add(p0);const Eo=ce.clone().sub(J).normalize(),H0=w0.makeGodRays({rng:u.fork("fan"),position:J.clone().addScaledVector(Eo,3).toArray(),direction:Eo.clone().multiplyScalar(.8).add(new a.Vector3(0,.5,0)).normalize().toArray(),radius:6,count:14,length:86,width:[2.2,14],color:"#9FE8FF",intensity:.42,falloff:1.5,speed:.6,near:[1.5,6],fogAmount:.45,time:v.uTime});H0.object.name="portal-fan",P.add(H0.object);const Q0=w0.makeParticles({rng:u.fork("near-snow"),preset:"snow",count:Math.round(1300*Math.sqrt(x.snow)*$0),box:[46,32,46],velocity:[2.8,-.7,.5],velocityRandom:[.8,.35,.5],turbulence:[1,.4,.4],size:[.06,.19],colors:x.snowCol,intensity:.6,opacity:.5,additive:.2,shape:"disc",core:.16,near:[1.4,6],minAngle:.003,time:v.uTime});Q0.object.name="near-snow",P.add(Q0.object),await o.yield();const d0=new a.Vector3,Go=new a.Vector3,Pa=m.spineTop[0],Ct=jt,Oo=ie.nearestXZ(Ae,it).u*he,Ca=new a.Vector3(7,6.5,Zt(7)),Ta=[{at:(e,t)=>{ie.pointAt(t,d0);const n=d0.distanceTo(Pa),r=ee(95,30,n),l=j(-6,7,r);return Go.set(l,j(3,6.5,r),Zt(fe(l,-27,7))).sub(d0).normalize(),Go.multiplyScalar(40).add(d0)},from:Oo/he,to:(Le-Ct*2/3)/he,weight:1,fade:Ct/(Le-Ct*2/3-Oo)},{at:Ca,from:(Le+Ct/3-2*Ct)/he,to:(Le+Ct/3)/he,weight:.7,fade:.5}],dt=new a.Vector3,Qe=new a.Vector3,ot=new a.Vector3,m0=new a.Vector3,Ze=new a.Vector3,$o=new a.Vector3,_o=e=>{let t=1e9;for(let n=0;n<e0;n++){const r=bo[n],l=r.pts,h=l.length-1,s=e*r.rate+r.ph,f=Math.abs((s%2+2)%2-1),c=ee(.08,.92,f)*h,b=Math.min(h-1,Math.floor(c));Qe.lerpVectors(l[b],l[b+1],c-b),m0.subVectors(l[b+1],l[b]),r.mode===1?Dt(Qe,ot).multiplyScalar(r.inner):ot.set(0,1,0),Ze.crossVectors(ot,m0),Ze.lengthSq()<1e-6&&Ze.set(0,0,1),r.mode!==1&&Qe.addScaledVector(Ze.normalize(),r.side);const M=Qe.distanceToSquared(dt);M<t&&(t=M,$o.copy(Qe)),Qe.addScaledVector(ot,r.lift*Ee[n*4+3]/.6);const d=st(ot,Ze);Ee[n*4]=Qe.x,Ee[n*4+1]=Qe.y,Ee[n*4+2]=Qe.z,Ge[n*4]=d.x,Ge[n*4+1]=d.y,Ge[n*4+2]=d.z,Ge[n*4+3]=d.w}ht.attributes.iPos.needsUpdate=!0,ht.attributes.iQuat.needsUpdate=!0,R.disturb(3,t<3600?$o:null,.85)};_o(0);const Z0=(e,t)=>{const n=Po[e],r=D0[e],l=r.P,h=r.Q;for(let s=0;s<n.length;s++){const f=n[s],c=t*f.rate+f.ph,b=Math.abs((c%2+2)%2-1),M=ee(.08,.92,b);m0.set(f.b[0]-f.a[0],0,f.b[2]-f.a[2]),ot.set(0,1,0),Ze.crossVectors(ot,m0),Ze.lengthSq()<1e-6&&Ze.set(0,0,1);const d=st(ot,Ze);l[s*4]=j(f.a[0],f.b[0],M),l[s*4+1]=j(f.a[1],f.b[1],M)+.33*l[s*4+3],l[s*4+2]=j(f.a[2],f.b[2],M),h[s*4]=d.x,h[s*4+1]=d.y,h[s*4+2]=d.z,h[s*4+3]=d.w}if(e===0){const s=v.uTime.value,f=v.uGustAmp.value;for(const c of So){const b=.5+.5*Math.sin($*(s*.2-(c.px+70)/150+.035*Math.sin(c.pz*.21+c.py*.17))),M=.5+.5*Math.sin(s*1.3+c.px*.9+c.pz*.7+c.py*.5),d=f*(.82*b*b*b*b+.18*M*M),z=.6+.4*Math.sin(s*.8+c.ph+c.ty*.3),B=Math.sin(s*1.7+c.ph*3+c.x*1.3+c.ty*.9);l[c.k*4]=c.x+((.45+d)*z+.12*B)*c.w,l[c.k*4+1]=c.y-.14*z*c.w,l[c.k*4+2]=c.z+(.2*Math.sin(s*.6+c.ph)*z+.3*B)*c.w}}r.g.attributes.iPos.needsUpdate=!0,r.g.attributes.iQuat.needsUpdate=!0};Z0(0,0),Z0(1,0);const Va={exposure:x.exposure,bloom:{strength:.3,radius:.6,threshold:.95},grade:{saturation:x.sat,contrast:oe,tint:"#ffffff",shadowTint:x.shadowTint,vignette:.35,grain:.02,aberration:0}};return{scene:P,path:ie,duration:b0,pace:ia,title:x.title,camera:{fov:62,near:.2,far:1400,lookAhead:16,sway:.25,bank:.5},pois:Ta,portal:{shape:"circle",radius:7,color:"#9FE8FF",glow:.8,revealDistance:140,tilt:!0},post:Va,ride:"none",update(e,t,n,r){R.update(e,t,n),n.getWorldPosition(dt),P.fog.density=x.density*j(1,.8,ee(14,44,dt.y-bt(dt.x,dt.z))),Lt.position.copy(dt),Aa(r,t),_o(t);for(const s of ko)s[0].visible=dt.distanceToSquared(s[1])<s[2];for(let s=0;s<2;s++)D0[s].m.visible&&Z0(s,t);const l=O0-et;let h=!1;for(let s=0;s<u0.length;s++)l>=u0[s]&&!_t[s]?(_t[s]=!0,f0[(W0+s)*3]=t+s%3*.25,h=!0):l<u0[s]-2&&_t[s]&&(_t[s]=!1);if(h&&(I0.needsUpdate=!0),He){const s=fe((r-Lo)/(Do-Lo),0,1);He.position.lerpVectors(No,Ro,s).addScaledVector(c0,Math.sin(t*.1)*2),He.material.uniforms.uSwim.value.x=t*.8;const f=v.uCloud.value,c=fe((r-qo)/(Do-qo),0,1);f.set(j(120,-100,c),0,22,.72*ee(0,.12,c)*(1-ee(.84,1,c)))}if(!He){const s=v.uCloud.value,f=je.position,c=Math.max(0,f.y-bt(f.x,f.z));s.set(f.x-c*O.x/O.y,f.z-c*O.z/O.y,9+.6*c,.34*(1-ee(E0-24,E0,O0))*(1-ee(4,22,c)*.6))}_0.update(e,t,n),K0.update(e,t,n),Q0.update(e,t,n),H0.update(e,t,n)},dispose(){R.dispose()}}}};export{fn as default};
