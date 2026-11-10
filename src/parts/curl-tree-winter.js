import*as e from"three";import{smoothstep as J,clamp as G}from"../kit/core.js";const wt=["#EAD9B0","#C9A56A","#7A4A22","#F4B45A","#FFD98A","#F3E8CF","#B8C6D2"],q=Math.PI*2,we=`
uniform vec3 uSun;        // unit vector toward the sun
uniform vec3 uCam;        // camera world position
uniform float uTime;
uniform float uGlow;      // peak of backlit amber (1.5)
uniform vec3 cCream, cGrain, cKnot, cAmber, cAmberHi, cDust, cSky, cStraw, cShade;   // cShade = umber/cream ratio
// THE KEY (set in makeStyle; all linear, chosen so that the tone map SHOWS the brief's colours):
//   cAmberB / cAmberE / cAmberD = backlit shaving: body (shows as the palette amber), torn edge and single thickness square
//   to the sun (shows as the palette honey), overlap (burnt amber). cSkyLo = the sky away from the sun, cHalo = the straw
//   round it, cLitB = how much of the low sun the level board takes. uKey = (shade depth on board, shade depth on wood, halo tightness, streaks in the wood).
uniform vec3 cAmberB, cAmberE, cAmberD, cSkyLo, cHalo, cLitB; uniform vec4 uKey;
// POLISH 2, the second colour (all from the palette: sawdust #F3E8CF and the sky's grey-blue #B8C6D2). uFrost = (sawdust lying on
// the board like snow, how far shade is filled by the cold sky instead of umber, how pale the lit face of a shaving is, how far a SHAVING's shade stays umber whatever the second slot says).
uniform vec4 uFrost;
// POLISH 4: cSunC = the low sun's colour on a lit face; uSkyK = (how deep the sky is overhead, the honey aureole round the sun, the honey every shaving on the sun's side keeps, spare).
// The world sinks the sun and warms these through the flight, so the end is lit differently from the arrival.
uniform vec3 cSunC; uniform vec4 uSkyK;
uniform vec4 uMoon;       // NIGHT 1, the night alone: rgb = the moon's light as thin wood passes it (linear; the world's piece C moves it half of the way the disc goes), w = the disc's radius in radians; zero at every other hour, and every statement that reads it stands behind uMoon.w != 0.
uniform vec3 cDisc;       // PIECE C (the world's twelfth round), the night alone: the moon's light as the heart of its disc shows it in the sky and as its track shows it on the ice (linear; the world starts it as uMoon.rgb and turns it golden by place); zero at every other hour, read only behind uMoon.w != 0.
uniform vec3 cRim, cDiscLo, cRimLo;   // THE MOON AS A BALL (the world's thirteenth round), the night alone: three more colours of the disc, each solved by the world at the build (style.shownShare) and keyed by it exactly as cDisc is: at each end of the world's key (a straight line between the two solves in between) cRim = the linear colour the tone map SHOWS as cDisc's shown colour at 0.70 of its light (the golden disc at its rim; how much of it the disc takes is uBall's); cDiscLo and cRimLo = the same two as low air shows them (0.90 of their shown light). At the night's own end cRim and cRimLo are never shown as they stand (uBall is 0 there): they only give the line the disc darkens along once the key begins. Zero at every other hour, read only behind uMoon.w != 0.
uniform float uBall;      // THE MOON AS A BALL, the night alone: how far the disc is a ball, keyed by the world with the disc's colour (the same kp): 0 at the night's own pale moon (no darker toward its rim), 1 at the golden moon (the rim at 0.70 of the heart's shown light). 0 at every other hour, read only behind uMoon.w != 0.
uniform vec3 cWarmT;      // PIECE C, the night alone: the mend's ratio, the night's own lamp body over the lamp body as the world's key has it now, channel by channel; (1, 1, 1) at every other hour and until the key begins; read only behind uMoon.w != 0.
uniform vec3 cMoonE;      // NIGHT 2, the night alone: the night's own honey for the aureole round the moon, whatever the wood (the world copies the night's cAmberE into it before a cedar's is keyed); zero at every other hour, read only behind uMoon.w != 0.
vec3 skyFill(){ return cSkyLo * vec3(0.84, 0.98, 1.18); }
vec3 coolAlb(vec3 a){ return mix(a, vec3(dot(a, vec3(0.3333))), 0.68); }   // limewood is yellow: under sky light alone it would go olive, so the fill sees it nearly neutral
vec3 skyCol(vec3 d){
  float c = max(dot(d, uSun), 0.), h = max(d.y, 0.);
  vec2 dh = d.xz / max(length(d.xz), 1e-3), sh = uSun.xz / max(length(uSun.xz), 1e-3);
  float az = dot(dh, sh) * 0.5 + 0.5;                                                   // 1 toward the sun's side, 0 behind us
  vec3 col = mix(cSkyLo * 1.16, cSkyLo * uSkyK.x, smoothstep(0.0, 0.62, h));            // cool grey-blue, clearly deeper overhead, pale at the horizon
  float band = (1. - smoothstep(0.0, 0.30 + 0.16 * az, h));
  col = mix(col, mix(cSkyLo * 1.2, cHalo * 0.92, 0.25 + 0.75 * az * az), band * band * (0.30 + 0.60 * az));   // cream to straw along the horizon, warmest under the sun
  col = mix(col, cHalo * 0.78, c*c*c*c * 0.55 * (1. - smoothstep(0.10, 0.70, h)));      // a wide breath of warmth toward the sun
  col = mix(col, cHalo, pow(c, uKey.z));                                                // the straw halo, kept round the sun
  float c16 = c*c; c16 *= c16; c16 *= c16; c16 *= c16; float c128 = c16*c16; c128 *= c128; c128 *= c128;
  return col + (uMoon.w != 0. ? cMoonE : cAmberE) * uSkyK.y * (0.75 * c128 * c16 * c16 + 0.25 * c16 * c16 * c16);   // and inside it a honey aureole, hottest at the disc; NIGHT 2: at night the aureole is the night's honey, not the wood's (one moon over every wood)
}
float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(h1(i), h1(i+vec2(1.,0.)), f.x), mix(h1(i+vec2(0.,1.)), h1(i+vec2(1.,1.)), f.x), f.y); }
// g.x = metres across the grain, g.y = metres along it. Returns albedo: cream, grain lines about every 15 cm, rare knots.
vec3 woodAlbedo(vec2 g, float knots){
  float wob = vn(vec2(g.x*1.7, g.y*0.045));
  float a = g.x*6.6 + wob*1.3;
  float fw = fwidth(a);
  float d = abs(fract(a) - 0.5);
  float line = mix(0.21, 1. - smoothstep(0.05, 0.16 + fw, d), clamp(1.2 - fw*3.2, 0., 1.));   // far off the lines melt into their own average tone, with no step
  float wide = vn(vec2(g.x*0.9, g.y*0.02));                    // broad early/late wood bands
  float fine = vn(vec2(g.x*23., g.y*0.6));
  vec3 c = mix(cCream, cGrain, line*(0.35 + 0.4*wob) + wide*0.16 + smoothstep(0.52, 0.66, wide)*0.14 + fine*0.05);
  vec2 cell = vec2(2.6, 11.), id = floor(g/cell), q = fract(g/cell) - 0.5;
  float r = h1(id + 7.3);
  q -= (vec2(h1(id+1.1), h1(id+2.7)) - 0.5) * 0.5;
  float kd = length(q * cell * vec2(1., 0.42));
  float kn = step(1. - 0.16*knots, r) * (1. - smoothstep(0.10, 0.34, kd));
  float ringK = step(1. - 0.16*knots, r) * (1. - smoothstep(0.3, 0.9, kd)) * (0.5 + 0.5*sin(kd*46.));
  c = mix(c, cGrain, ringK*0.5);
  c = mix(c, cKnot, kn*0.85);
  return c;
}
// Opaque wood: soft (hard=0) or chip-hard (hard=1) sun, warm umber shade, a breath of sky from above.
vec3 woodLight(vec3 alb, vec3 N, float hard, float sh){
  float ndl = dot(N, uSun);
  float lit = mix(smoothstep(-0.42, 0.50, ndl), smoothstep(0.0, 0.07, ndl), hard) * sh;
  vec3 shade = alb * cShade * uKey.y + alb * cSkyLo * (0.30 + 0.14*N.y);
  shade = mix(shade, alb * cShade * uKey.y * 0.40 + coolAlb(alb) * skyFill() * (0.62 + 0.16*N.y), uFrost.y);   // the shaded side of a pole takes the sky: a cool value under the lit cream (repair 5: paler, more of the sky's grey-blue and less umber, so a bare pole against the light is a pale pole, not a dark spike)
  float gr = min(dot(alb, vec3(0.33)) / max(dot(cCream, vec3(0.33)), 1e-3), 1.);
  shade *= mix(1., gr*gr, 0.75) * (0.74 + 0.50 * abs(N.x) + 0.10 * N.y) * (1. + 0.20 * sin(N.x*31. + N.z*17. + N.y*9.));       // POLISH 3: each knife flat takes the sky by its own turn, and the grain is drawn in the shade too
  return mix(shade, alb * cSunC * 0.9, lit);
}
// In the lane every pole ahead throws a shadow many times its height down the grain: umber stripes with cream slits of sun.
// P = world xz, cover 0..1 = under an opened tree's cone (more shade, narrower slits). Returns 0..1 shade.
float laneStripes(vec2 P, float cover){
  vec2 sd = -uSun.xz / max(length(uSun.xz), 1e-3);
  float crs = P.x*sd.y - P.y*sd.x, al = dot(P, sd);
  float st = vn(vec2(crs*1.05, al*0.004)) * 0.62 + vn(vec2(crs*2.3 + 17., al*0.007)) * 0.38;   // long: under an 8 degree sun a 30 to 70 m pole throws 200 to 500 m of shadow down the grain
  st += (vn(vec2(crs*0.8 + 3., al*0.12)) - 0.5) * 0.17 * (0.45 + 0.55*cover);   // POLISH 3: a shadow of tiers of curls is dappled along its length (scalloped edges, strings of patches), not one drawn-out streak
  float fw = fwidth(crs) * 1.05, thr = mix(0.515, 0.40, cover);
  return mix(smoothstep(thr - 0.035 - fw, thr + 0.035 + fw, st), 0.42 + 0.3*cover, clamp(fw*1.6 - 0.25, 0., 1.));
}
// Shaving. N must face the viewer; T = unit tangent along the ribbon; V = unit vector to the camera;
// v = -1..1 across; edgeM = metres from the nearer edge; over = 0..1 layers overlapping; inner = 0..1 depth inside a tree.
float gCast = 0.;         // 0..1: this point stands in the shadow another curl throws (set by the caller before shavingLight)
float gEdgeW = 0.16;     // metres: width of the paler torn edge (the caller may widen it for a ribbon metres wide seen far off, so that its rim shows there too)
float gThin = 0.;   // NIGHT 2, the night alone (0 at every other hour; the shaving's main sets it behind uMoon.w): gThin 0..1 = how thin the shaving is at this point of its width (the lens law: 0 down its middle, 1 at its margins). NIGHT 4: 0 on the two gilt things (uGilt), which are not shaving
vec3 shavingLight(vec3 alb, vec3 N, vec3 T, vec3 V, float edgeM, float over, float inner, float shadowed){
  float ndl = dot(N, uSun);
  float back = clamp(-ndl * 1.7 + 0.10, 0., 1.);               // the sun is on the far face: it shines through
  float fs = max(dot(V, -uSun), 0.);                           // 1 when we look straight at the sun
  float Tr = back * (0.70 + 0.30 * (0.6*fs*fs + 0.4*fs));      // thin wood glows all round, most toward the lens
  Tr = max(Tr, uSkyK.z * (1. - 0.75*shadowed) * (1. - 0.6*inner) * (0.55 + 0.45*smoothstep(-0.5, 0.3, ndl)));   // polish 4: on the sun's side of a tree every shaving holds some of its honey, whichever way it faces
  float edge = 1. - smoothstep(0.0, gEdgeW, edgeM);
  float layers = smoothstep(0.16, 0.80, clamp(over + inner*0.55 + shadowed*0.32 + gCast*0.30, 0., 1.));   // a step you can count: one layer or two
  float g = dot(alb, vec3(0.33)) / max(dot(cCream, vec3(0.33)), 1e-3);        // grain lines hold the light back
  float gk = uGlow / 1.5;
  vec3 single = mix((uMoon.w != 0. ? mix(cAmberB, uMoon.rgb, gThin) : cAmberB), cAmberE, 0.55 * back * back * fs) * gk;          // squarer to the sun: honey; NIGHT 2, the lens law for every shaving: thin wood, at the margins, passes the moon's light (uMoon.rgb), the thicker heart colours it straw (uMoon.rgb is over cAmberB on every channel: it only adds). PIECE C: until the world's key begins uMoon.rgb is the colour the disc's heart shows; from then on the heart shows cDisc, which goes the whole way to golden, and thin wood passes uMoon.rgb, which goes half of the way
  vec3 amber = mix(single, cAmberD * gk, layers) * (0.46 + 0.54*g*g);
  if (uMoon.w != 0.) amber *= 1. + (cWarmT - 1.) * (1. - smoothstep(0.30, 0.80, Tr));   // PIECE C, THE MEND (the night alone; times one while cWarmT is (1, 1, 1)): wood that passes little light (Tr under 0.30: a face turned to the moon or nearly edge-on to it) takes the whole ratio, which brings its body and its two layers back to the night's own straw, so that mixed into its blue-grey shade it stays a grey of the wood and does not go pink; only wood the moon shines well through (Tr 0.80 and over) is left wholly the warmed colour. The 0.30 and 0.80 are TYPED, not worked out. The honey (squarer to the sun) and the moon's light at the margins, both mixed into a single thickness on the line above, lie under this factor with the body; the torn edge is mixed in on the next line, after it, and is not mended
  amber = mix(amber, cAmberE * gk, edge * 0.92 * (1. - 0.6*layers));
  float lit = smoothstep(-0.34, 0.50, ndl) * (1. - 0.80*inner*inner) * (1. - 0.55*shadowed) * (1. - 0.55*over) * (1. - 0.50*gCast);   // raking light wraps round thin wood
  vec3 shade = alb * cShade * (uKey.y + 0.25 + 0.4*back) + alb * cSkyLo * 0.22;
  vec3 pale = mix(alb, cDust * mix(1., g*g*g, 0.85), 0.62 * uFrost.z);          // the lit face of a shaving: pale paper, not board; POLISH 3: it keeps its grain lines (darker, drawn), so a near curl is ruled wood, not a blank strip
  shade = mix(shade, pale * cShade * 0.22 + coolAlb(pale) * skyFill() * 0.84, uFrost.y);      // polish 2: filled with the sky's grey-blue (repair 5: on every hour; the next lines give the cast shade back its umber)
  // REPAIR 3 (uFrost.w): a shaving's shade is the wood's own warm umber (the brief: "warm umber shade", "cream paper with long umber shadows").
  // REPAIR 5: that is the shade that is CAST: the shadow another curl throws on it (gCast: the brief's "long umber shadows on the tiers
  // beneath"), the inside of its own tree, two layers lying over one another. A face out in the open air that is only turned from the sun
  // is lit by the sky (the brief: "cool grey-blue #B8C6D2 overhead and behind us") and takes its grey-blue, as board and stick do: so on
  // every tree the cool colour stands beside the amber.
  float warm = clamp(max(gCast * (1. - shadowed), 0.8 * inner * inner + 0.3 * over), 0., 1.);   // a shadow is cast only where the sun would reach: on the tree's side away from the sun every open face has the sky alone
  shade = mix(shade, alb * cShade * (uKey.y + 0.12 + 0.3*back) + alb * cSkyLo * 0.08, uFrost.w * (0.22 + 0.78 * warm));
  alb = mix(alb, pale * vec3(1.06, 1.04, 1.04), uFrost.z);
  vec3 H = normalize(V + uSun + vec3(0., 1e-4, 0.));
  float th = dot(T, H);
  float sheen = pow(max(1. - th*th, 0.), 24.) * max(ndl, 0.) * 0.22;
  vec3 cream = mix(shade, alb * cSunC + cDust * sheen, lit);
  cream = mix(cream, cDust * mix(0.5, 0.9, lit), edge * 0.45);         // torn edge paler than the middle
  cream *= 1. - 0.22 * smoothstep(gEdgeW, gEdgeW + 0.24, edgeM) * (1. - smoothstep(gEdgeW + 0.24, gEdgeW + 0.94, edgeM));   // and inside it a soft darker margin, the shaving's thickness turning away: the edge is drawn
  return mix(cream, amber, clamp(Tr, 0., 1.));
}
`,Ae=`
uniform float uHaze;      // aerial haze per metre (distance pales toward the sky, straw toward the sun)
vec3 hazed(vec3 col, vec3 W){
  vec3 d = W - uCam; float dist = length(d);
  float f = 1. - exp(-dist * uHaze);
  float toSun = max(dot(d / max(dist, 1e-3), uSun), 0.);
  float t2 = toSun*toSun, t8 = t2*t2*t2*t2;
  return mix(col, mix(cSkyLo * 1.06, cHalo * 0.8, t8*t8*0.8), f);
}
`,X=32,Q=24,Wt=`
uniform float uTime; uniform vec3 uSun; uniform float uTierT[${X}];
attribute vec4 aRoot, aShape, aPose, aMisc; attribute vec3 aBase;   // aBase: foot of this curl's tree in the mesh (0 when one mesh is one tree)
varying vec3 vN, vT, vW; varying vec4 vUv; varying vec2 vInner;
vec2 dir(float a){ return vec2(cos(a), sin(a)); }
void main(){
  float t = position.x, v = position.y;
  int ti = int(clamp(aRoot.w + 0.5, 0., ${X-1}.));
  float tau = uTime - uTierT[ti] - aMisc.w;
  float tp = max(tau, 0.);
  float o = clamp(tp / 0.4, 0., 1.); o = o*o*(3. - 2.*o);
  float em = smoothstep(0., 0.10, tp);
  float ring = exp(-5.*tp) * cos(13.*tp);
  float L = aShape.x, W = aShape.y, A = aShape.z * o, rhoE = max(aShape.w, 0.05), k = max(aMisc.x, 0.02);
  float sk = sqrt(1. + k*k);
  float rollLen = max(L - A, 0.01);
  float rho0 = rhoE + rollLen * k / sk;
  float PHI = log(rho0 / rhoE) / k;
  float seed = aPose.w;
  float amb = 0.030*sin(uTime*1.9 + seed*40.) + 0.016*sin(uTime*3.3 + seed*17.);
  float a0 = aPose.x + ring*0.55 + amb*0.4, a1 = aPose.y + ring*1.15 + amb;
  float ta = 0.24 * o;
  vec2 d0 = dir(a0), d1 = dir(a1), p, tg; float s, phi = 0.;
  if (t < ta) {
    float g = t / max(ta, 1e-4);
    p = A*0.5*(d0*(2.*g - g*g) + d1*(g*g));
    tg = normalize(d0*(1. - g) + d1*g + vec2(1e-5, 0.));
    s = A*g;
  } else {
    float f = (t - ta) / max(1. - ta, 1e-4);
    phi = PHI * f;
    float e = exp(-k*phi);
    float beta = a1 + 1.5708 + atan(k);
    p = A*0.5*(d0 + d1) + rho0*(e*dir(beta - phi) - dir(beta));
    tg = dir(a1 - phi);
    s = A + rollLen * (1. - e) / max(1. - exp(-k*PHI), 1e-3);
  }
  float sl = s / max(L, 1e-3);
  float w = W*0.5 * mix(1., 0.28, smoothstep(0.84, 1., sl)) * mix(0.42, 1., smoothstep(0., 0.10, sl)) * em;
  float yaw = aRoot.x + aPose.z;
  vec3 er = vec3(sin(yaw), 0., cos(yaw)), et = vec3(cos(yaw), 0., -sin(yaw)), up = vec3(0., 1., 0.);
  vec3 T3 = tg.x*er + tg.y*up, N3 = -tg.y*er + tg.x*up;
  float lat = aMisc.y * W * phi / 6.2832 + sl*sl * L * 0.022 * sin(uTime*0.8 + seed*31.);
  float tw = sl * (0.22*sin(uTime*0.6 + seed*11.) + 0.5*(seed - 0.5));
  vec3 across = cos(tw)*et + sin(tw)*N3;
  vec3 root = vec3(sin(aRoot.x)*aRoot.z, aRoot.y, cos(aRoot.x)*aRoot.z);
  vec3 pos = root + em*(p.x*er + p.y*up + lat*et) + across * (v * w);
  vec3 nrm = cos(tw)*N3 - sin(tw)*et;
  vec4 wp = modelMatrix * vec4(pos + aBase, 1.);
  vW = wp.xyz; vN = mat3(modelMatrix) * nrm; vT = mat3(modelMatrix) * T3;
  float over = smoothstep(2.4, max(PHI, 2.5), phi) * (1. - 0.55*clamp(aMisc.y, 0., 1.));
  vUv = vec4(s, v, w, over);
  float rad = length(pos.xz);
  float inn = clamp(1. - (rad - aRoot.z) / max(aMisc.z, 1.), 0., 1.);
  vec2 sx = uSun.xz / max(length(uSun.xz), 1e-3);
  float side = dot(pos.xz, sx) / max(aMisc.z + aRoot.z, 1.);            // -1 far side from the sun .. +1 sun side
  vInner = vec2(pow(inn, 0.9), (1. - smoothstep(-0.45, 0.35, side))) * step(0., aMisc.z);   // polish 5: reach < 0 marks a loose curl lying alone: no tree shades it
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,Nt=`
attribute vec3 aTan; attribute vec4 aSV; uniform float uTime, uWave; uniform vec2 uWaveEnd;   // uWaveEnd = (s where the free end starts, extra swing in metres)
varying vec3 vN, vT, vW; varying vec4 vUv; varying vec2 vInner;
void main(){
  float fe = smoothstep(uWaveEnd.x, uWaveEnd.x + 34., aSV.x);
  vec3 pw = position + normal * ((sin(uTime*1.3 + aSV.x*0.09) * 0.22 + sin(uTime*2.9 + aSV.x*0.31) * 0.06) * uWave
    + fe * fe * uWaveEnd.y * (sin(uTime*2.3 - aSV.x*0.12) + 0.35 * sin(uTime*6.1 - aSV.x*0.3)));   // a loose shaving breathes; its free end quivers
  vec4 wp = modelMatrix * vec4(pw, 1.);
  vW = wp.xyz; vN = mat3(modelMatrix) * normal; vT = mat3(modelMatrix) * aTan; vUv = aSV; vInner = vec2(0.);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,He=`
${we}${Ae}
uniform float uGloss, uRule, uGilt;   // uRule (the Old Stick's curls only): its ribbons are metres wide, so their torn edge holds a pixel or two at any distance; uGilt (NIGHT 4; read only behind uMoon.w): 1 on the two GILT things, the hoop with its tail and the scroll (made things set into the wood, not wood: the night's lens law does not thin them, and the world gives them the night's own gold whatever the wood), 0 on everything cut of the wood: every curl, the fallen curl, the Old Stick's over-long curl with its rail and the exit ring
#ifdef ICE
uniform vec4 uShA[${Q}], uShB[${Q}];
#endif
varying vec3 vN, vT, vW; varying vec4 vUv; varying vec2 vInner;
void main(){
  float s = vUv.x, v = vUv.y, w = vUv.z;
  float tear = vn(vec2(s*1.1, v*2.5 + 5.)) * 0.30 * smoothstep(0.2, 1.2, w) + vn(vec2(s*5.3, 9. + v)) * 0.07;
  float edgeM = (1. - abs(v)) * w - tear;
  if (edgeM < 0.) discard;
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)) * (gl_FrontFacing ? 1. : -1.);
  vec3 T = normalize(vT + vec3(1e-5, 0., 0.));
  vec3 V = normalize(uCam - vW + vec3(0., 1e-4, 0.));
  vec3 alb = woodAlbedo(vec2(v*w, s), 0.25);
  if (uRule > 0.) {
    // REPAIR 3: the Old Stick's ribbons are 2 to 5 m wide, and beyond about 20 m their 12 cm torn edge is under a pixel: the edge holds a pixel
    // or two however far off (never more than a seventh of the ribbon's half width): "at 50 m each curl is a separate spiral with a bright rim".
    // ROUND 2: the coarse grain lines half a metre apart that round 1 drew on these ribbons are gone (the brief has grain lines at 5 m, none at
    // 50 m; they showed as pinstripes on the crown's ribbons in the close pass).
    gEdgeW = max(0.16, min(1.7 * fwidth(edgeM), 0.15 * w) * uRule);
  }
  float ch = 0.5 + 0.5*sin(s*7.3 + vn(vec2(v*2., s*0.3))*2.);            // faint chatter ridges across the shaving
  alb *= 1. - 0.06*ch*ch;
  {                                                                      // the long soft shadows curls throw on one another: a pattern fixed along the sun's own line,
    vec2 sxz = uSun.xz / max(length(uSun.xz), 1e-3);                     // so a shadow keeps its shape from curl to curl and lies down the tiers; deeper in the tower, more of it
    float al = dot(vW.xz, sxz), tanE = uSun.y / max(length(uSun.xz), 1e-3);
    vec2 sq = vec2(vW.x*sxz.y - vW.z*sxz.x, vW.y - al * tanE);
    // POLISH 3: the shade lies in long bands ALONG the grain (the ribbon's own length), a few to each width, drifting slowly with the
    // sun's line so neighbours differ; it was a round world-space noise that read as grey camouflage patches on pale shaving.
    float sn = vn(vec2(v*w*0.55 + sq.x*0.05 + 3.1, s*0.045 + sq.y*0.03)) * 0.62 + vn(vec2(v*w*1.3 + 17., s*0.11 + sq.x*0.04)) * 0.38;
    float thr = mix(0.60, 0.36, clamp(vInner.y * 0.75 + vInner.x * 0.55, 0., 1.));
    gCast = smoothstep(thr - 0.04, thr + 0.04, sn);
  }
  if (uMoon.w != 0.) gThin = (1. - uGilt) * (1. - (1. - v*v) * (1. - v*v));   // NIGHT 2: a shaving is lens-shaped across its width, thickest down its middle, (1 - v*v) squared (the law the fallen curl had alone); NIGHT 4: a gilt thing is not a shaving and is not thinned, so its single thickness is the seventh's line to the letter; the line below stays letter for letter (the world's ANCHOR looks for it)
  vec3 col = shavingLight(alb, N, T, V, edgeM, vUv.w, vInner.x, vInner.y);
  #ifdef ICE
  {                                                                      // ice (the stream): the planed face is a pale cool mirror of the sky
    float nv = max(dot(N, V), 0.), q = 1. - nv;
    float F = 0.80 + 0.20 * q*q;
    vec3 R = reflect(-V, N); R.y = abs(R.y) + 0.02; R = normalize(R);
    float rl = max(length(R.xz), 1e-3); vec2 rh = R.xz / rl; float rise = R.y / rl;
    float slide = 0.96 + 0.08 * vn(vec2(v*w*0.7 + R.x*9., s*0.04 + R.z*5.));         // long streaks of sheen that slide as we move
    float gr = dot(alb, vec3(0.33)) / max(dot(cCream, vec3(0.33)), 1e-3);
    vec3 refl = skyCol(R) * 1.10 * slide;
    float am = 0., pole = 0., blob = 0.;
    float fRise = fwidth(rise), fP = fwidth(vW.x) + fwidth(vW.z);        // derivatives are taken before the loop
    for (int i = 1; i < ${Q}; i++) {                                   // every caster of the board's shadow slots but slot 0 stands in it upside down: a pole and, up to its cut, tiers of rings
      vec4 a = uShA[i], b = uShB[i];
      vec2 r = a.xy - vW.xz;
      float al = dot(r, rh), px = r.x*rh.y - r.y*rh.x, ax = abs(px);
      float hgt = al * rise, fH = abs(al) * fRise + fP * rise + 1e-4;
      float taper = clamp(1. - hgt / max(b.z, 1.), 0., 1.);
      float wC = b.x * (0.3 + 0.7*taper) + 0.5;
      float in0 = step(0., al) * (1. - smoothstep(b.z - fH, b.z, hgt));
      float open = smoothstep(hgt - 1., hgt + 1., b.y) * smoothstep(5.5, 6.5 + fH, hgt);
      vec2 cq = vec2(px / 2.9, hgt / 3.1); cq.x += 0.5 * mod(floor(cq.y), 2.) + float(i) * 0.37;
      vec2 cf = fract(cq) - 0.5; float hsh = h1(floor(cq) + float(i) * 3.7);
      float rd = length(cf + (vec2(hsh, fract(hsh * 7.3)) - 0.5) * 0.14), aw = max(fH / 3.1, fP / 2.9) * 1.2 + 0.01;
      float ring = smoothstep(0.17 - aw, 0.17 + aw, rd) * (1. - smoothstep(0.43 - aw, 0.43 + aw, rd)) * step(0.12, hsh);
      float shut = clamp(aw * 3.5 - 0.35, 0., 1.);                                // how far the rings have closed: 0 while aw (above) is at most 0.1, 1 once it reaches 1.35 / 3.5. aw is 1.2 times the greater of two spans of a pixel, each as a share of a cell, plus 0.01: the ground it covers (fP, metres) over the cell's 2.9 m across, the mirrored height it covers (fH, metres) over the cell's 3.1 m. So shut is 0 while the greater share is at most 0.075 and 1 from about 0.313 on (a ring's own width is 0.26 of a cell)
      ring = mix(ring, 0.42, shut);                                               // far off the rings close up into their own average
      float m = (1. - smoothstep(wC, wC + 0.4 + fP * 2., ax)) * open * in0 * b.w * ring;
      if (m > am) { am = m; blob = mix(smoothstep(0.3, 0.7, hsh), (0.5 * (0.7 - 0.3) + (1. - 0.7)) / (1. - 0.12), shut * 0.42 / max(ring, 1e-4)); }   // blob: the lamp's colour factor, 0 the torn edge's (cAmberE), 1 the body's (cAmberB), a cell's own by its hash. THE FAR ICE: of a cell's light (ring) the share shut * 0.42 is the closed rings' average and takes the cells' AVERAGE factor; the rest is the ring's own shape and keeps the cell's own. The average: over the cells that carry a ring (hsh from 0.12 to 1, taken as even) the mean of smoothstep(0.3, 0.7, hsh) is half the step's width plus what lies above the step, over the share of cells that carry a ring: it is written out in the line from the line's own 0.3, 0.7 and 0.12 (the designer's term: worked in the code, not typed as a finished figure). While shut is 0 the factor is the cell's own, to the bit. (In the eleventh version the rings closed and the colour did not: far off each cell was flat and kept its own colour between the two. A cell is 2.9 m across and 3.1 m of the caster's height.)
      pole = max(pole, (1. - smoothstep(a.z*0.5, a.z*0.5 + 0.08 + fP * 1.5, ax)) * in0 * b.w);
    }
    float gk = uGlow / 1.5;
    refl = mix(refl, cCream * cShade * 0.55 + cSkyLo * 0.2, pole * 0.7);
    refl = mix(refl, mix(cAmberE, cAmberB, blob) * gk * 0.80, am * 0.92);
    vec2 sx = uSun.xz / max(length(uSun.xz), 1e-3), pc = vW.xz - uCam.xz;             // the sun's straw path, laid from the horizon to the lens
    float cr = pc.x*sx.y - pc.y*sx.x, ahead = dot(pc, sx), pw = 0.36 + 0.0072 * max(ahead, 0.);
    float sp = exp(-cr*cr / (pw*pw)) * smoothstep(0., 2.5, ahead) * (0.80 + 0.20 * vn(vec2(cr*2.3, s*0.33 + ahead*0.4)));
    float sg = max(dot(R, uSun), 0.), sg2 = sg*sg, sg8 = sg2*sg2*sg2*sg2, sg64 = sg8*sg8*sg8*sg8*sg8*sg8*sg8*sg8;
    refl = mix(refl, cHalo * 1.12, sp * 0.82 * (1. - 0.8*am));
    if (uMoon.w != 0.) { float k5 = sp * 0.82 * (1. - 0.8*am); refl = (refl - cHalo * 1.12 * k5) / (1. - k5); }   // NIGHT 1: the line above is taken out again at night, exactly (k5 is never over 0.82): the keyed straw is darker than the mirrored halo it lies on and would run as a greyer seam down the moon's track
    refl += cHalo * sg64 * sg64 * 0.25;
    float far = smoothstep(196., 228., vW.z), sg4 = sg2*sg2;                           // out in the clearing the ice lies off the sun's line: a long soft streak of its straw slides on the far half
    refl = mix(refl, cHalo * 1.02, far * sg4*sg4*sg2 * 0.62 * smoothstep(0.25, 0.75, vn(vec2(v*w*0.9 + R.x*7., s*0.03))) * (1. - 0.8*am));
    if (uMoon.w != 0.) {                                                               // NIGHT 1, the moon's track: a flat mirror shows a disc as wide as the disc, so its half width grows by the tangent of the moon's radius per metre ahead
      float tw = 0.36 + tan(uMoon.w) * max(ahead, 0.);                                  // on the path's own 0.36 m at the lens; broken along travel by the path's own lengthwise noise; the casters mirrored in the ice stay in front; (1 - far): where the ice leaves the light's line
      float tr = exp(-cr*cr / (tw*tw)) * smoothstep(0., 2.5, ahead) * (0.80 + 0.20 * vn(vec2(cr*2.3, s*0.33 + ahead*0.4))) * (1. - 0.8*am) * (1. - 0.7*pole) * (1. - far);
      refl = mix(refl, cDisc, 0.40 * tr);                                               // the colour of the disc's heart (PIECE C: cDisc, the value the sky draws the disc's heart in; since the thirteenth round the golden disc is darker toward its rim and the track is not), so disc and track are one light; a mix toward it never passes the heart's 0.85, so the track does not bloom
    }
    float rim = 1. - smoothstep(0.0, 0.5, edgeM);                                     // sawdust lies along its torn edge: the rim stays matte
    float chat = 0.5 + 0.5 * sin(s * 0.4488 + 1.3 * vn(vec2(v * 1.5, s * 0.05)));          // faint chatter ridges across the shaving, at the board's own 14 m period
    refl *= 1. - 0.06 * chat * chat * (1. - smoothstep(70., 220., length(vW - uCam)));
    col = mix(col * 0.8, refl * (0.94 + 0.06 * gr * gr), uGloss * F * (1. - 0.75*rim));
    col = mix(col, max(col, cDust * cLitB * 1.45), (1. - smoothstep(0.0, 0.26, edgeM)) * 0.55);   // its torn feathered edge is paler than its middle
  }
  #endif
  gl_FragColor = vec4(hazed(col, vW), 1.);
}`,Ht=`
uniform float uCutY;
#ifdef CUT
attribute vec3 aScoop;
#endif
varying vec3 vW, vL; varying float vCut;
void main(){
  vec3 p = position; vCut = 0.;
  #ifdef CUT
    float c = smoothstep(-0.5, 1.0, uCutY - aScoop.x) * step(1e-4, aScoop.y);
    p.xz -= p.xz / max(length(p.xz), 1e-3) * aScoop.y * c; vCut = c;
  #endif
  vL = p;
  #ifdef USE_INSTANCING
    p = (instanceMatrix * vec4(p, 1.)).xyz;
  #endif
  vec4 wp = modelMatrix * vec4(p, 1.);
  vW = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,Dt=`
${we}${Ae}
uniform float uCutY, uKnots, uTone, uBark;
varying vec3 vW, vL; varying float vCut;
void main(){
  vec3 N = normalize(cross(dFdx(vW), dFdy(vW)) + vec3(0., 1e-9, 0.));
  vec3 V = normalize(uCam - vW + vec3(0., 1e-4, 0.));
  if (dot(N, V) < 0.) N = -N;
  #if GRAIN == 0
    vec2 tn = normalize(vec2(N.z, -N.x) + vec2(1e-4, 0.));
    vec2 g = vec2(dot(vL.xz, tn), vL.y);
  #elif GRAIN == 1
    vec2 g = vec2(vL.x + vL.y*0.6, vL.z);
  #else
    vec2 g = vec2(vL.z + vL.y*0.6, vL.x);
  #endif
  vec3 alb = woodAlbedo(g, uKnots) * uTone;
  if (uBark > 0.) {                                                         // birch: white bark with dark dashes across the stick
    vec2 bc = vec2(g.x*0.9, g.y*2.2), bi = floor(bc), bf = fract(bc);
    float dash = step(0.62, h1(bi + 3.1)) * (1. - smoothstep(0.10, 0.22, abs(bf.y - 0.5))) * smoothstep(0.02, 0.12, bf.x) * (1. - smoothstep(0.55 + 0.4*h1(bi), 0.98, bf.x));
    alb = mix(alb, mix(vec3(0.86, 0.85, 0.82), cKnot * 0.6, dash), uBark);
  }
  float bl = 0.;
  #ifdef CUT
    alb = mix(alb * vec3(0.95, 0.93, 0.90), mix(alb, cDust, 0.5), vCut);   // old surface a little duller, fresh scoop pale
    bl = 1. - smoothstep(0.0, 1.5, abs(vL.y - uCutY));
  #endif
  vec3 col = woodLight(alb, N, HARD, 1.);
  {                                                                       // polish 4: against the sun a pole is not a grey spike: its flats that turn away catch a warm rim, each flat its own
    float fsV = max(dot(V, -uSun), 0.), q = 1. - abs(dot(N, V));
    col += alb * cHalo * (0.07 + 0.62 * q * q) * fsV * (0.6 + 0.4 * fsV);
  }
  col = mix(col, cAmberHi * 1.25, bl * 0.85);                             // the blade's bright fresh-cut line
  gl_FragColor = vec4(hazed(col, vW), 1.);
}`,Gt=`
${we}${Ae}
uniform vec4 uShA[${Q}], uShB[${Q}]; uniform float uBoardW; uniform vec4 uClear;   // uClear = (x, z, radius of the clearing, half width of the lane)
varying vec3 vW;
void main(){
  vec2 P = vW.xz;
  float dist = length(vW - uCam);
  float far = smoothstep(120., 260., dist);
  float bx = P.x / uBoardW, id = floor(bx + 0.5);
  float fwb = fwidth(P.x);
  float joint = 1. - smoothstep(0.03, 0.07 + fwb, abs(P.x - id*uBoardW));
  joint *= clamp(1.4 - fwb*0.6, 0., 1.);
  vec3 alb = woodAlbedo(vec2(P.x + id*3.7, P.y + id*41.), 0.5);
  alb *= 0.955 + 0.09*h1(vec2(id, 3.));                                   // each board its own tone
  float zb = (P.y + h1(vec2(id, 9.))*56.) / 56.;                           // butt joints, 56 m apart per board
  float butt = (1. - smoothstep(0.04, 0.09 + fwidth(P.y), abs(fract(zb) - 0.5)*56.)) * 0.35;
  float chat = 0.5 + 0.5*sin(P.y * 0.4488 + id*1.3);                       // plane chatter, 14 m period, 2 percent
  alb *= 1. - 0.022*chat;
  alb = mix(alb, cGrain*0.8, max(joint*0.55, butt));
  alb = mix(alb, cCream*0.93, far*0.8);
  vec2 sd = -uSun.xz / max(length(uSun.xz), 1e-3);                         // shadows lie away from the sun, along the grain
  float tanE = uSun.y / max(length(uSun.xz), 1e-3);
  float sh = 1., cores = 0., cover = 0., road = 0., roadCore = 0.;
  for (int i = 0; i < ${Q}; i++) {
    vec4 a = uShA[i], b = uShB[i];
    vec2 r = P - a.xy;
    float d = dot(r, sd), x = abs(r.x*sd.y - r.y*sd.x);
    float hgt = d * tanE;
    float taper = clamp(1. - hgt / max(b.z, 1.), 0., 1.);
    float wTrunk = a.z * (0.25 + 0.75*taper);
    float wCone = b.x * taper + 1.;
    float open = smoothstep(hgt - 4., hgt + 4., b.y);
    float soft = 1.2 + d * 0.03;
    float along = smoothstep(-1., 2., d) * (1. - smoothstep(a.w * (i == 0 ? 0.72 : 0.3), a.w, d)) * step(hgt, b.z);   // the Old Stick's shadow is a road 400 m long: it holds its depth for most of that
    float core = (1. - smoothstep(wTrunk - soft*0.5, wTrunk + soft*0.5, x));
    if (i == 0) {                                                        // the Old Stick's own road (drawn below, after the loop)
      float pen = 0.5 + d * 0.012;                                       // the trunk's own shadow keeps a clean edge: the sun's small disc blurs it by a metre or two in a hundred
      roadCore = (1. - smoothstep(wTrunk - pen*0.5, wTrunk + pen*0.5, x)) * along * b.w;
      road = (1. - smoothstep(wCone*0.55, wCone + soft*2., x)) * open * along * b.w;
    }
    else {                                                               // the lane: each trunk a stripe of its own, the opened tiers a field the slits run through
      cores = max(cores, (1. - smoothstep(wTrunk + 0.2 - soft*0.3, wTrunk + 0.2 + soft*0.5, x)) * along * b.w);
      cover = max(cover, (1. - smoothstep(wCone*0.75, wCone + soft*2., x)) * open * along * b.w);
    }
  }
  // in the wood every pole throws a shadow many times its height: the floor there is long streaks of shade with slits of sun, all along the grain
  float crs = P.x*sd.y - P.y*sd.x, alongS = dot(P, sd);
  float inWood = smoothstep(uClear.z - 6., uClear.z + 40., length(P - uClear.xy)) * smoothstep(uClear.w, uClear.w + 16., abs(P.x) + 30.*smoothstep(290., 336., P.y));   // the lane's floor runs as far as its rows do (they stand to z 318, at the clearing's edge; it closed at z 215, and from there to the clearing the floor under the lens was the far wood's broad soft streaks)
  float st = vn(vec2(crs*0.15, alongS*0.006)) * 0.62 + vn(vec2(crs*0.47 + 31., alongS*0.011)) * 0.38 + (vn(vec2(crs*0.5 + 7., alongS*0.07)) - 0.5) * 0.10;
  float fwS = fwidth(crs) * 0.15;
  float streak = smoothstep(0.40 - fwS, 0.56 + fwS, st) * mix(1., 0.75, far);
  float wood = smoothstep(uClear.z - 6., uClear.z + 40., length(P - uClear.xy)), lane = wood * (1. - inWood);
  // REPAIR 3: the Old Stick's road is the shadow of tiers of curls, so it is drawn as the lane's shadows are: long umber stripes down the grain
  // with slits of sun between them, cut clean (fwidth-filtered) at any distance from the lens. It was one wide soft field mottled by a slow
  // noise, which under the lens (the course runs up it for 250 m) was a dark smear with nothing sharp in it. One call serves lane and road.
  // ROUND 2: the stripes of the road stand on sunlit sawdust (no fill of shade between them, and less dappled along their length: the fill
  // was the soft dark field under the lens); down its middle runs the trunk's own shadow, one clean dark stripe, and sawdust lies along the
  // road as evenly as in the open (in its shade the bare boards between the drifts of sawdust were dark blotches).
  float stripes = laneStripes(P, max(cover, 0.3 * road));
  sh *= 1. - max(roadCore * 0.9, road * 0.9 * stripes);
  sh *= 1. - max(cores * 0.95, lane * 0.93 * stripes);     // in the lane the stripes stand apart: umber, with cream slits of sun
  sh *= 1. - uKey.w * inWood * streak;
  // POLISH 2: the open clearing is striped too: the wood on its sun side throws shadows hundreds of metres long over the sawdust
  float stC = vn(vec2(crs*0.21 + 5., alongS*0.004)) * 0.6 + vn(vec2(crs*0.9 + 11., alongS*0.008)) * 0.4 + (vn(vec2(crs*0.6 + 2., alongS*0.06)) - 0.5) * 0.07;
  float fwC = fwidth(crs) * 0.3;
  sh *= 1. - 0.66 * (1. - wood) * uFrost.x * smoothstep(0.53 - fwC, 0.60 + fwC, stC) * mix(1., 0.6, far);
  vec3 V = normalize(uCam - vW + vec3(0., 1e-4, 0.));
  // sawdust lies on the board like snow, in long drifts down the grain, deepest in the open; the boards show through between
  float fr = vn(vec2(P.x*0.11, P.y*0.028)) * 0.55 + vn(vec2(P.x*0.41 + 9., P.y*0.085)) * 0.30 + vn(vec2(P.x*1.7 + 3., P.y*0.30)) * 0.15;
  float snow = uFrost.x * smoothstep(0.34, 0.60, fr + 0.38 * (1. - wood) + 0.18 * lane + 0.10 * far + 0.34 * road) * (1. - 0.55 * joint);
  alb = mix(alb, cDust * (0.96 + 0.06 * vn(P * vec2(3.1, 0.7))), snow * 0.9);
  vec3 shadeC = mix(alb * cShade * uKey.x + alb * cSkyLo * 0.20, alb * cShade * uKey.x * 0.30 + coolAlb(alb) * skyFill() * (0.66 + 0.20 * snow), uFrost.y);
  vec3 col = mix(shadeC, alb * cLitB * (1.10 + 0.24 * lane + 0.30 * (1. - wood)) * (1. + 0.42 * snow), sh);
  float gl = pow(max(dot(reflect(-V, vec3(0., 1., 0.)), uSun), 0.), 90.);
  col += cHalo * gl * 0.16 * sh;
  gl_FragColor = vec4(hazed(col, vW), 1.);
}`,_t=`
${we}${Ae}
varying vec3 vD;
void main(){
  vec3 d = normalize(vD + vec3(0., 1e-5, 0.));
  float c = dot(d, uSun), h = d.y;
  vec3 col = skyCol(d);
  float c1 = max(c, 0.), k = c1*c1; k = k*k; k = k*k; k = k*k; k = k*k; k = k*k;   // c^64
  col += cHalo * k * k * k * 0.30;
  col += cHalo * smoothstep(0.99935, 0.99975, c) * 2.4;                          // the sun: a small soft disc, bright enough to bloom; at night the moon's disc (below) covers this dot and does not bloom
  if (uMoon.w != 0.) {   // NIGHT 1: the full moon on the light's own direction; it covers the dot above; no rays, no face. THE MOON AS A BALL (the thirteenth round): the disc is no longer one flat colour.
    float ang = atan(length(cross(d, uSun)), c), q = min(ang / uMoon.w, 1.), low = 1. - smoothstep(0., uSun.y, h);   // q: 0 at the disc's heart, 1 at its rim; low: 0 from the light's own height up, 1 at the horizon (at night the light stands 6.5 to 8 degrees up)
    vec3 w = vec3(q * q * uBall), hi = cDisc * pow(cRim / cDisc, w), lo = cDiscLo * pow(cRimLo / cDiscLo, w), body = hi * pow(lo / hi, vec3(low));   // a ball lit from our side is darker toward its rim: heart to rim by the square of the distance from the heart, as deep as uBall says (not at all at the night's own pale moon, wholly at the golden moon), and the air's small dimming toward the horizon (through the whole night).
    // The three colours beside cDisc are solved, not typed: at each end of the world's key each is the linear colour the tone map shows as the disc's own shown colour (cDisc's) at a share of its light (rim 0.70, low air 0.90, both 0.63),
    // so under this world's own grade the rim is darker in VALUE and keeps the disc's own hue (not on a device without float buffers, where the golden heart's red is cut at 1 and the rim shows redder than the heart, nor under another world's grade);
    // between the ends the world keys each on a straight line, and the disc's hue then stands up to 1.4 degrees toward yellow of its heart's (counted before rounding). Darkening the linear colour instead turns it orange under the tone map:
    // a rim that goes red says setting sun. Between two solved colours each channel goes by equal RATIOS, not equal steps (a straight mix passes through colours up to 1.7 degrees redder on the way; by ratios 0.7);
    // all four are above zero at night in every channel (cDisc is the night's honey and the golden amber at luminance 0.85, the three are solves of shown colours above zero, and a straight line between two such stays above zero). cDisc, the three colours and uBall are keyed by the world's piece C key, as cDisc has been since the twelfth round; nothing here reads the lens, the seed or the clock.
    col = mix(col, body, 1. - smoothstep(uMoon.w - 0.008, uMoon.w + 0.008, ang));   // a soft limb 0.016 rad wide (0.9 degrees, a seventh of its radius; it was 0.007 rad)
  }
  vec3 dh = normalize(vec3(d.x, 0., d.z) + vec3(0., 0., 1e-5));
  vec3 ground = hazed(cCream * 0.93 * mix(cLitB, cShade * uKey.x, 0.3), uCam + dh * 3400.);    // what the board fades to at its far edge
  col = mix(col, ground, (1. - smoothstep(-0.03, 0.0, h)));
  gl_FragColor = vec4(col, 1.);
}`,Ot=`
uniform float uTime, uPx; uniform float uTierT[${X}]; uniform vec3 uCam;
attribute vec4 aDust; varying float vA;
void main(){
  float seed = aDust.x, ph = fract(uTime * (0.05 + 0.05*fract(seed*7.3)) + seed);
  vec3 p = position;
  p.y -= ph * aDust.z;
  p.x += sin(uTime*0.4 + seed*50.) * 1.5 + ph * 3.; p.z += cos(uTime*0.33 + seed*31.) * 1.5 - ph * 5.;
  float on = 1.;
  if (aDust.w > -0.5) on = smoothstep(0., 0.6, uTime - uTierT[int(clamp(aDust.w + 0.5, 0., ${X-1}.))]);
  vec4 wp = modelMatrix * vec4(p, 1.);
  vec4 mv = viewMatrix * wp;
  vA = on * smoothstep(0., 0.12, ph) * (1. - smoothstep(0.7, 1., ph)) * step(0., wp.y);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp(aDust.y * uPx / max(-mv.z, 0.5), 1.5, 4.);
}`,vt=`
${we}
varying float vA;
void main(){
  vec2 q = gl_PointCoord - 0.5; float r = dot(q, q) * 4.;
  float a = (1. - smoothstep(0.2, 1., r)) * vA;
  if (a < 0.01) discard;
  gl_FragColor = vec4(cDust * 0.60, a * 0.6);
}`;function ie(a,s=2.6){const r=h=>(h*(h+.0245786)-90537e-9)/(h*(.983729*h+.432951)+.238081),i=h=>h<0?0:h>1?1:h,l=a.r,d=a.g,v=a.b;let g=l,S=d,y=v;for(let h=0;h<900;h++){const L=g/.6,u=S/.6,z=y/.6,C=r(.59719*L+.35458*u+.04823*z),m=r(.076*L+.90834*u+.01566*z),n=r(.0284*L+.13383*u+.83777*z),f=i(1.60475*C-.53108*m-.07367*n),p=i(-.10208*C+1.10813*m-.00605*n),b=i(-.00327*C-.07276*m+1.07602*n);g=G(g+(l-f)*.5*(.2+g),0,s),S=G(S+(d-p)*.5*(.2+S),0,s),y=G(y+(v-b)*.5*(.2+y),0,s)}return new e.Vector3(g,S,y)}function Kt(a,s){const r=h=>(h*(h+.0245786)-90537e-9)/(h*(.983729*h+.432951)+.238081),i=h=>h<0?0:h>1?1:h,l=a.x/.6,d=a.y/.6,v=a.z/.6,g=r(.59719*l+.35458*d+.04823*v),S=r(.076*l+.90834*d+.01566*v),y=r(.0284*l+.13383*d+.83777*v);return ie({r:s*i(1.60475*g-.53108*S-.07367*y),g:s*i(-.10208*g+1.10813*S-.00605*y),b:s*i(-.00327*g-.07276*S+1.07602*y)})}function Ut(a,s={}){const r=s.palette||wt,i=n=>new e.Color(n),l={cream:i(r[0]),grain:i(r[1]),knot:i(r[2]),amber:i(r[3]),amberHi:i(r[4]),sawdust:i(r[5]),sky:i(r[6]),straw:i("#F2E3B6"),umber:i("#8A6A44")},d=(s.sunElevation??8)*Math.PI/180,v=(s.sunAzimuth??0)*Math.PI/180,g=l.umber,S=l.cream,y={uSun:{value:new e.Vector3(Math.sin(v)*Math.cos(d),Math.sin(d),Math.cos(v)*Math.cos(d))},uCam:{value:new e.Vector3(0,2,0)},uTime:{value:0},uGlow:{value:s.glow??1.5},uHaze:{value:s.haze??45e-5},uPx:{value:600},cCream:{value:l.cream},cGrain:{value:l.grain},cKnot:{value:l.knot},cAmber:{value:l.amber},cAmberHi:{value:l.amberHi},cDust:{value:l.sawdust},cSky:{value:l.sky},cStraw:{value:l.straw},cShade:{value:new e.Vector3(g.r/S.r,g.g/S.g,g.b/S.b)},cAmberB:{value:new e.Vector3},cAmberE:{value:new e.Vector3},cAmberD:{value:new e.Vector3},cSkyLo:{value:new e.Vector3},cHalo:{value:new e.Vector3},cLitB:{value:new e.Vector3},uKey:{value:new e.Vector4},uFrost:{value:new e.Vector4(0,0,0,0)},cSunC:{value:new e.Vector3(1.03,.93,.76)},uSkyK:{value:new e.Vector4(.74,.2,.24,0)},uMoon:{value:new e.Vector4(0,0,0,0)},cMoonE:{value:new e.Vector3},cRim:{value:new e.Vector3},cDiscLo:{value:new e.Vector3},cRimLo:{value:new e.Vector3},uBall:{value:0},cDisc:{value:new e.Vector3},cWarmT:{value:new e.Vector3(1,1,1)}},h=(n,f=1)=>new e.Vector3(n.r*f,n.g*f,n.b*f),L=(n={})=>{const f=y,p=l,b=p.umber,w=p.cream;f.cShade.value.set(b.r/w.r,b.g/w.g,b.b/w.b),n.rekey??s.rekey??!0?(f.cAmberB.value.copy(ie(p.amber)),f.cAmberE.value.copy(ie(p.amberHi)),f.cAmberD.value.copy(f.cAmberB.value).multiply(new e.Vector3(.4,.36,.5)),f.cSkyLo.value.copy(ie(p.sky.clone().multiplyScalar(n.sky??.8))),f.cHalo.value.copy(ie(p.straw)).multiplyScalar(.74),f.cLitB.value.set(.53,.48,.4).multiplyScalar(n.board??1),f.uKey.value.set(n.shadeBoard??.28,n.shadeWood??.6,n.halo??40,n.streaks??.72)):(f.cAmberB.value.copy(h(p.amber.clone().lerp(p.amberHi,.3),1.35)),f.cAmberE.value.copy(h(p.amberHi,1.5)),f.cAmberD.value.copy(h(p.amber,.87)).multiply(new e.Vector3(.9,.62,.38)),f.cSkyLo.value.copy(h(p.sky,.92)),f.cHalo.value.copy(h(p.straw,1.3)),f.cLitB.value.setScalar(.66*(n.board??1)),f.uKey.value.set(n.shadeBoard??1.1,n.shadeWood??.92,n.halo??5,n.streaks??.5))};L();const u=()=>new Float32Array(X).fill(-1e3),z=[],C=[];for(let n=0;n<Q;n++)z.push(new e.Vector4(0,0,1,1)),C.push(new e.Vector4(0,0,1,0));const m={palette:l,uniforms:y,NT:X,NSH:Q,rekey:L,shown:ie,shownShare:Kt,wood({grain:n="y",chip:f=!1,cut:p=!1,knots:b=.6,tone:w=1,bark:M=0,side:E=e.FrontSide}={}){const F={GRAIN:n==="y"?0:n==="z"?1:2,HARD:f?"1.":"0."};return p&&(F.CUT=""),new e.ShaderMaterial({defines:F,side:E,vertexShader:Ht,fragmentShader:Dt,uniforms:{...y,uCutY:{value:-1e4},uKnots:{value:b},uTone:{value:w},uBark:{value:M}}})},shaving({gloss:n=0,wave:f=0}={}){const p=n>0;return new e.ShaderMaterial({side:e.DoubleSide,defines:p?{ICE:""}:{},vertexShader:Nt,fragmentShader:He,uniforms:{...y,uGloss:{value:n},uGilt:{value:0},uWave:{value:f},uWaveEnd:{value:new e.Vector2(1e5,0)},...p?{uShA:{value:z},uShB:{value:C}}:{}}})},curl(n=u()){return new e.ShaderMaterial({side:e.DoubleSide,vertexShader:Wt,fragmentShader:He,uniforms:{...y,uGloss:{value:0},uGilt:{value:0},uTierT:{value:n}}})},dust(n=u()){return new e.ShaderMaterial({transparent:!0,depthWrite:!1,vertexShader:Ot,fragmentShader:vt,uniforms:{...y,uTierT:{value:n}}})},slotTimes:u,board:new e.ShaderMaterial({vertexShader:"varying vec3 vW; void main(){ vec4 wp = modelMatrix*vec4(position,1.); vW = wp.xyz; gl_Position = projectionMatrix*viewMatrix*wp; }",fragmentShader:Gt,uniforms:{...y,uShA:{value:z},uShB:{value:C},uBoardW:{value:9},uClear:{value:new e.Vector4(0,0,1e5,1e5)}}}),setShadow(n,f,p,b,w,M=0,E=0,F=50,I=.8){z[n].set(f,p,b,w),C[n].set(M,E,F,I)},sky:new e.ShaderMaterial({side:e.BackSide,depthWrite:!1,depthTest:!1,uniforms:y,vertexShader:"varying vec3 vD; void main(){ vD = position; vec4 p = projectionMatrix*viewMatrix*vec4(position + cameraPosition, 1.); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }",fragmentShader:_t}),skyMesh(){const n=new e.Mesh(new e.IcosahedronGeometry(10,3),m.sky);return n.renderOrder=-10,n.frustumCulled=!1,n},update(n,f,p){if(y.uTime.value=f,p){p.getWorldPosition(y.uCam.value);let b=720;a.renderer&&(b=a.renderer.getDrawingBufferSize(qt).y),y.uPx.value=b*.5*p.projectionMatrix.elements[5]}},curlGeometry:gt,curlMesh:pt,ribbonGeometry:De,stickGeometry:bt};return m}const qt=new e.Vector2;function gt(a=56){const s=new Float32Array((a+1)*2*3),r=[];for(let l=0;l<=a;l++){const d=Math.pow(l/a,1.15);if(s.set([d,-1,0,d,1,0],l*6),l<a){const v=l*2;r.push(v,v+2,v+1,v+1,v+2,v+3)}}const i=new e.InstancedBufferGeometry;return i.setAttribute("position",new e.BufferAttribute(s,3)),i.setIndex(r),i}function pt(a,s,r=56,i=null){const l=gt(r),d=a.length,v=new Float32Array(d*4),g=new Float32Array(d*4),S=new Float32Array(d*4),y=new Float32Array(d*4),h=new Float32Array(d*3);a.forEach((u,z)=>{v.set([u.az,u.y,u.r,u.slot??0],z*4),g.set([u.L,u.W,u.A,u.rhoE],z*4),S.set([u.a0,u.a1,u.yaw??0,u.seed??.5],z*4),y.set([u.k,u.pitch??.5,u.reach??10,u.delay??0],z*4),h.set([u.bx??0,u.by??0,u.bz??0],z*3)}),l.setAttribute("aRoot",new e.InstancedBufferAttribute(v,4)),l.setAttribute("aShape",new e.InstancedBufferAttribute(g,4)),l.setAttribute("aPose",new e.InstancedBufferAttribute(S,4)),l.setAttribute("aMisc",new e.InstancedBufferAttribute(y,4)),l.setAttribute("aBase",new e.InstancedBufferAttribute(h,3)),l.instanceCount=d;const L=new e.Mesh(l,s);return i?l.boundingSphere=new e.Sphere(i[0],i[1]):L.frustumCulled=!1,L}function De(a,s,r=1,i=null){const l=a.length,d=new Float32Array(l*6),v=new Float32Array(l*6),g=new Float32Array(l*6),S=new Float32Array(l*8),y=[];let h=0,L=0;const u=new e.Vector3,z=new e.Vector3;for(let m=1;m<l;m++)L+=a[m].distanceTo(a[m-1]);for(let m=0;m<l;m++){m>0&&(h+=a[m].distanceTo(a[m-1])),u.subVectors(a[Math.min(m+1,l-1)],a[Math.max(m-1,0)]).normalize(),z.crossVectors(u,s[m]).normalize();const n=h/Math.max(L,1e-6),f=typeof r=="function"?r(m,n):r,p=i?i(m,n):0;for(let b=0;b<2;b++){const w=b?1:-1,M=(m*2+b)*3;d[M]=a[m].x+z.x*f*w,d[M+1]=a[m].y+z.y*f*w,d[M+2]=a[m].z+z.z*f*w,v[M]=s[m].x,v[M+1]=s[m].y,v[M+2]=s[m].z,g[M]=u.x,g[M+1]=u.y,g[M+2]=u.z,S.set([h,w,f,p],(m*2+b)*4)}if(m<l-1){const b=m*2;y.push(b,b+1,b+2,b+1,b+3,b+2)}}const C=new e.BufferGeometry;return C.setAttribute("position",new e.BufferAttribute(d,3)),C.setAttribute("normal",new e.BufferAttribute(v,3)),C.setAttribute("aTan",new e.BufferAttribute(g,3)),C.setAttribute("aSV",new e.BufferAttribute(S,4)),C.setIndex(y),C.computeBoundingSphere(),C}function bt({height:a=50,r0:s=1,r1:r=.2,cols:i=12,ring:l=2.5,facet:d=12,scoops:v=[],rng:g=null,taper:S=.85,dealOnly:y=!1}={}){const h=[],L=[];for(let w=0;w<i;w++){L.push(g?g()*d:w*5.3%d),h.push([]);for(let M=0;M<Math.ceil(a/d)+2;M++)h[w].push(g?g.range(-1,1):Math.sin(w*12.9+M*78.2))}if(y)return null;const u=Math.max(2,Math.round(a/l)),z=(u+1)*i+1,C=new Float32Array(z*3),m=new Float32Array(z*3),n=[],f=Array.from({length:i},()=>[]);for(const w of v)f[(w.col%i+i)%i].push(w);for(let w=0;w<=u;w++){const M=w/u*a,E=M/a,F=r+(s-r)*Math.pow(1-E,S);for(let I=0;I<i;I++){const ae=I/i*q,N=F*(1+.045*h[I][Math.floor((M+L[I])/d)])+(w===0?F*.06:0);let ee=0;for(const H of f[I]){const B=(M-(H.y-H.len))/H.len;B>0&&B<=1.0001&&(ee=Math.max(ee,H.depth*Math.pow(B,.6)))}const j=(w*i+I)*3;if(C[j]=Math.sin(ae)*N,C[j+1]=M,C[j+2]=Math.cos(ae)*N,m[j]=M,m[j+1]=Math.min(ee,F*.45),m[j+2]=0,w<u){const H=w*i+I,B=w*i+(I+1)%i,te=H+i,se=B+i;n.push(H,B,te,B,se,te)}}}const p=z-1;C[p*3+1]=a+r*2.5,m[p*3]=a;for(let w=0;w<i;w++)n.push(u*i+w,u*i+(w+1)%i,p);const b=new e.BufferGeometry;return b.setAttribute("position",new e.BufferAttribute(C,3)),b.setAttribute("aScoop",new e.BufferAttribute(m,3)),b.setIndex(n),b.computeBoundingSphere(),b}const _=210,Ge=4.5,_e=.45,O=30,Oe=14,yt=21,$t=204,$=8,Me=a=>_e+(Ge-_e)*Math.pow(Math.max(1-a/_,0),.85),le=a=>yt+a/(O-1)*($t-yt);async function Xt(a,s={}){const r=a.rng,i=s.detail??1,l=!s.style,d=s.style||Ut(a,{palette:s.palette||wt}),v=new e.Group,g=d.slotTimes().fill(1e6);await a.yield();const S=Oe*2,y=[],h=[],L=.2+.6*r(),u=s.longAz??-.78,z=r.range(.85,1.15),C=r.range(-.08,.08),m=s.span??1,n=s.wide??1;let f=0;for(let t=0;t<O;t++){const o=t/(O-1),k=le(t),x=Me(k),c=30*Math.pow(1-o,.9)+.9,T=3.9*Math.pow(1-o,.75)+.8*o+.3,P=r.chance(.3)?r.int(0,Oe-1):-1;for(let V=0;V<Oe;V++){const D=(V*2+t%2)%S;let A=D/S*q;y.push({col:D,y:k,len:Math.min(12,k-2),depth:x*r.range(.16,.26)});const W=t===$&&Math.abs((A-u+Math.PI*3)%q-Math.PI)<q/S+.001,R=r(),U=r(),Z=r(),fe=r(),ye=r(),me=r();if(W){f=D;continue}const Ne=V===P?2:1;for(let ne=0;ne<Ne;ne++){const xe=c*(.82+.36*R)*z*(ne?.7:1),Se=xe*m,Et=T*n*(.85+.3*U)/Ne,ft=Math.max(xe*(1.05+.5*Z)+1.5-(Se-xe),.55*xe),mt=.3*T+.3,ke=.11+.05*fe,Ft=mt+ft*ke/Math.sqrt(1+ke*ke);h.push({az:A,y:k,r:x*.97,slot:t,L:Se+ft,W:Et,A:Se,rhoE:mt,k:ke,a0:.22+.25*ye+o*.25,a1:-.92+.3*me+C+o*.2+ne*.2,yaw:(U-.5)*.22+(Ne>1?(ne-.5)*.16:0),seed:R*.6+ye*.4,pitch:(.35+.55*Z)*(fe>L?1:-1),reach:Se*.8+Ft,delay:.03+.3*me+ne*.12})}}}await a.yield();const p=d.wood({grain:"y",cut:!0,knots:.8});await a.yield();const b=new e.Mesh(bt({height:_,r0:Ge,r1:_e,cols:S,ring:2.1,facet:12,scoops:y,rng:r.fork?r.fork("facets"):r}),p);v.add(b),await a.yield();const w=d.curl(g);await a.yield(),w.uniforms.uRule={value:s.rule??0};const M=pt(h,w,s.curlSegs??56,[new e.Vector3(0,_*.5,0),_*.62]);v.add(M),await a.yield();const E=new e.Vector3(s.seatX??15,s.seatY??92,s.seatZ??67),F=s.ringScale??1,I=(s.seatHeading??50)*Math.PI/180,ae=(s.seatPitch??25)*Math.PI/180,N=new e.Vector3(Math.sin(I)*Math.cos(ae),Math.sin(ae),Math.cos(I)*Math.cos(ae)),ee=new e.Vector3(Math.cos(I),0,-Math.sin(I)),j=new e.Vector3().crossVectors(N,ee).normalize(),H=8.2*F,B=s.railPsi??-.35,te=s.railJoin??-44,se=-16,Y=(t,o=new e.Vector3)=>o.copy(ee).multiplyScalar(Math.cos(t)).addScaledVector(j,Math.sin(t)),he=f/S*q,Ke=le($),Ue=Me(Ke)*.97;for(const t of h){const o=Math.abs((t.az-he+Math.PI*3)%q-Math.PI);(t.slot>$&&t.slot<=$+4||s.railPsi!==void 0&&t.slot<$&&t.slot>=$-5)&&o<.62&&(t.A*=.45,t.L*=.5,t.reach*=.5)}if(s.fit)for(let t=0;t<h.length;t++)s.fit(h[t]),t%16===15&&await a.yield();if(s.toward)for(const t of h){if(t.slot<1||t.slot>=$)continue;const o=s.toward(t.y);if(!o)continue;const k=Math.abs((t.az-o.az+Math.PI*3)%q-Math.PI);if(k>.44)continue;const x=G((o.dist-10)/Math.max(t.reach,1),1,1.7),c=t.A*(x-1)*(1-.5*k/.44);t.A+=c,t.L+=c,t.reach+=c*.8}{const t=M.geometry,o=t.getAttribute("aShape"),k=t.getAttribute("aMisc"),x=t.getAttribute("aPose");h.forEach((c,T)=>{o.setXYZW(T,c.L,c.W,c.A,c.rhoE),x.setXYZ(T,c.a0,c.a1,c.yaw??0),k.setZ(T,c.reach)})}const oe=[],ce=[];await a.yield();const Te=new e.Vector3(Math.sin(he)*Ue,Ke,Math.cos(he)*Ue),xt=new e.Vector3(Math.sin(he),0,Math.cos(he)),ze=E.clone().addScaledVector(N,te).add(Y(B).multiplyScalar(H)),St=ee.clone().multiplyScalar(-Math.sin(B)).addScaledVector(j,Math.cos(B)),kt=Te.clone().addScaledVector(xt,s.railSide?24:17).add(new e.Vector3(0,6,0)),At=s.railSide?ze.clone().addScaledVector(St,-s.railSide):ze.clone().addScaledVector(N,-17),Ce=s.railBank??0,qe=Y(B-Ce),Mt=s.railHalf??2,$e=new e.CubicBezierCurve3(Te,kt,At,ze),jt=Y(B),Tt=new e.Vector3;for(let t=0;t<44;t++){const o=t/44,k=$e.getPoint(o),x=$e.getTangent(o),c=Tt.set(0,qe.y<-.5?-1:1,0).lerp(qe,o*o*(3-2*o)).clone();c.addScaledVector(x,-c.dot(x)).normalize(),oe.push(k),ce.push(c)}if(Math.abs(se-te)>.5)for(let t=0;t<12;t++){const o=te+t/12*(se-te);oe.push(E.clone().addScaledVector(N,o).add(Y(B).multiplyScalar(H))),ce.push(Y(B-Ce*(1-.35*J(.6,1,t/12))))}const Ve=-9.5*F,zt=.5,Re=10.4*F,Ct=9*F,Vt=3.3,je=5.6,Ye=(t,o,k=new e.Vector3)=>Y(t,k).multiplyScalar(Math.cos(o)).addScaledVector(N,Math.sin(o)),Ze=t=>.9+.14*Math.sin(t*1.3+1.1),Je=70,Yt=oe.length;for(let t=0;t<=Je;t++){const o=t/Je,k=o*o*(3-2*o),x=se+(Ve-se)*o,c=B+je*o;oe.push(E.clone().addScaledVector(N,x).addScaledVector(Y(c),H+(Re-H)*k)),ce.push(Ye(c-.65*Ce*(1-J(0,.3,o)),Ze(c)*k))}const Zt=oe.length;await a.yield();const Rt=De(oe,ce,(t,o)=>(s.railSide?.9+1.1*J(.62,.9,o):Mt)*(.55+.45*J(0,.04,o))*(.55+.45*(1-J(.985,1,o))),null),re={};await a.yield();{const t=[],o=[],x=d.uniforms.uSun.value;for(let A=0;A<=230;A++){const W=A/230,R=B+je+W*Vt*q;t.push(E.clone().addScaledVector(N,Ve+(zt-Ve)*W).addScaledVector(Y(R),Re+(Ct-Re)*W)),o.push(Ye(R,Ze(R)))}const c=De(t,o,(A,W)=>1.9*F*(.75+.25*J(0,.05,W))*(.35+.65*(1-J(.94,1,W))),null),T=c.getAttribute("position"),P=c.getAttribute("aSV"),V=new e.Vector3,D=new e.Vector3;await a.yield();for(let A=0;A<=230;A++)for(let W=0;W<2;W++){const R=A*2+W;V.fromBufferAttribute(T,R);let U=0;for(let Z=0;Z<=230;Z+=2){if(Math.abs(Z-A)<40)continue;const fe=D.subVectors(t[Z],V).dot(x),ye=Math.sqrt(Math.max(D.lengthSq()-fe*fe,0)),me=P.getZ(Z*2);U=Math.max(U,1-J(me*.5,me*1.15,ye))}P.setW(R,.05+.9*U),W===1&&A%20===19&&await a.yield()}re.geo=c,re.p=t,re.n=o}await a.yield();const Pt=`
attribute vec3 aTan; attribute vec4 aSV;
uniform float uFront, uRollR, uLen, uTime, uShow; uniform vec3 uFP, uFT, uFN; uniform vec2 uWob;
varying vec3 vN, vT, vW; varying vec4 vUv; varying vec2 vInner;
void main(){
  vec3 p = position, n = normal, tg = aTan;
  float d = aSV.x - uFront, sl = aSV.x / max(uLen, 1.);
  if (d > 0.) {                                             // not yet unrolled: wound on the roll that rides the front
    float th = d / max(uRollR, 0.2), rr = uRollR * exp(-0.035*th);
    p = uFP + uFN*uRollR + rr*(sin(th)*uFT - cos(th)*uFN) + cross(uFT, uFN) * (aSV.y * aSV.z);
    n = cos(th)*uFN - sin(th)*uFT; tg = cos(th)*uFT + sin(th)*uFN;
  } else {
    p += n * (sin(uTime*1.3 + aSV.x*0.09) * 0.22 + sin(uTime*2.9 + aSV.x*0.31) * 0.06) * uWob.x * mix(1., smoothstep(0.03, 0.4, sl), uWob.y);
  }
  p = mix(uFP, p, uShow);
  vec4 wp = modelMatrix * vec4(p, 1.);
  vW = wp.xyz; vN = mat3(modelMatrix)*n; vT = mat3(modelMatrix)*tg; vUv = vec4(aSV.xy, aSV.z * uShow, aSV.w); vInner = vec2(0.);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,Xe=(t,o,k,x)=>{const c=t.length,T=new Float32Array(c),P=[];for(let A=0;A<c;A++)T[A]=A?T[A-1]+t[A].distanceTo(t[A-1]):0,P.push(new e.Vector3().subVectors(t[Math.min(A+1,c-1)],t[Math.max(A-1,0)]).normalize());const V={uFront:{value:0},uRollR:{value:6},uFP:{value:t[0].clone()},uFT:{value:P[0].clone()},uFN:{value:o[0].clone()},uLen:{value:T[c-1]},uShow:{value:0},uWob:{value:new e.Vector2(k,x)}},D=(A,W)=>{let R=0;for(;R<c-2&&T[R+1]<A;)R++;const U=G((A-T[R])/Math.max(T[R+1]-T[R],1e-4),0,1);V.uFront.value=W?T[c-1]+1:A,V.uFP.value.lerpVectors(t[R],t[R+1],U),V.uFT.value.lerpVectors(P[R],P[R+1],U).normalize(),V.uFN.value.lerpVectors(o[R],o[R+1],U).normalize()};return{U:V,len:T[c-1],setFront:D,mat:new e.ShaderMaterial({side:e.DoubleSide,vertexShader:Pt,fragmentShader:He,uniforms:{...d.uniforms,uGloss:{value:0},uGilt:{value:0},...V}})}},ve=Xe(oe,ce,1,1),Qe=ve.len,et=ve.U,tt=new e.Mesh(Rt,ve.mat);tt.frustumCulled=!1,v.add(tt),await a.yield();const de=Xe(re.p,re.n,.3,0),Pe=3.6,ot=2.2,Le=new e.Mesh(re.geo,de.mat);Le.frustumCulled=!1,Le.name="exit-ring",v.add(Le),await a.yield();const ge=Math.round(O*110*i),at=new Float32Array(ge*3),st=new Float32Array(ge*3),rt=new Float32Array(ge*4);for(let t=0;t<ge;t++){const o=t%O,k=le(o),x=r()*q,c=Me(k),T=r.range(3,11)*(1-.6*o/O);at.set([Math.sin(x)*c,k-r()*6,Math.cos(x)*c],t*3),st.set([Math.sin(x)*T,r.range(-1,4),Math.cos(x)*T],t*3),rt.set([r(),r.range(.16,.42)*(1.3-o/O),o,r()*.7],t*4),t%256===255&&await a.yield()}const pe=new e.BufferGeometry;pe.setAttribute("position",new e.BufferAttribute(at,3)),pe.setAttribute("aVel",new e.BufferAttribute(st,3)),pe.setAttribute("aDust",new e.BufferAttribute(rt,4));const Lt=new e.ShaderMaterial({transparent:!0,depthWrite:!1,fragmentShader:vt,uniforms:{...d.uniforms,uTierT:{value:g}},vertexShader:`
uniform float uTime, uPx; uniform float uTierT[${X}];
attribute vec3 aVel; attribute vec4 aDust; varying float vA;
void main(){
  float age = uTime - uTierT[int(clamp(aDust.z + 0.5, 0., ${X-1}.))] - aDust.w;
  float a = max(age, 0.);
  vec3 p = position + aVel * (1. - exp(-1.5*a)) / 1.5 + vec3(0.6, -0.9, -1.4) * a * (0.5 + aDust.x);
  vec4 mv = viewMatrix * modelMatrix * vec4(p, 1.);
  vA = step(0., age) * smoothstep(0., 0.08, a) * (1. - smoothstep(1.2, 4.5, a)) * 0.8;
  gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp(aDust.y * (1. + a*0.5) * uPx / max(-mv.z, 0.5), 1.5, 4.5);
}`}),nt=new e.Points(pe,Lt);nt.frustumCulled=!1,v.add(nt),await a.yield();const Be=Math.round(900*i),it=new Float32Array(Be*3),lt=new Float32Array(Be*4);for(let t=0;t<Be;t++){const o=r.int(0,O-1),k=le(o),x=r()*q,c=Me(k)+r()*(26*(1-o/O)+2);it.set([Math.sin(x)*c,k-r()*8,Math.cos(x)*c],t*3),lt.set([r(),r.range(.12,.3),r.range(14,34),o],t*4)}const Ie=new e.BufferGeometry;Ie.setAttribute("position",new e.BufferAttribute(it,3)),Ie.setAttribute("aDust",new e.BufferAttribute(lt,4));const ht=new e.Points(Ie,d.dust(g));ht.frustumCulled=!1,v.add(ht),await a.yield();const Bt=s.shadowSlot??0;if(l&&s.backdrop!==!1){const t=d.skyMesh();t.renderOrder=-.5,v.add(t);const o=new e.Mesh(new e.PlaneGeometry(7e3,7e3),d.board);o.rotation.x=-Math.PI/2,v.add(o)}const ct=s.view==="low",Ee=s.view==="close",ue=E.clone().addScaledVector(N,-60),dt={portalSeat:{position:E.clone(),direction:N.clone(),facing:N.clone().negate(),radius:7*F,ringRadius:H},exitStart:ue,flyThrough:[[0,2,-105],[0,2,-80],[-23.7,4,-57.3],[-37,14,-36.5],[-44.6,27,-17.7],[-46,40,1],[-40.2,53,18],[ue.x,ue.y,ue.z],[E.x,E.y,E.z]].map(t=>new e.Vector3(...t)),viewpoints:{reveal:new e.Vector3(0,2,-130),climb:new e.Vector3(-46,40,1),rail:ue.clone().addScaledVector(N,20)},longCurlRoot:Te.clone(),crown:new e.Vector3(0,_,0),cutAbove:20,shadowLength:400,longTier:$,longSeconds:Pe+ot,tierHeights:Array.from({length:O},(t,o)=>le(o)),reachAt:t=>4+34*Math.pow(G(1-(t-6)/(_-6),0,1),.9)};let K=-8,be=!1,Fe=null;const It=s.cutRate??5,We=new e.Vector3,ut={object:v,radius:Ee?20:75,height:Ee?20:ct?40:_,center:new e.Vector3(0,Ee?52:ct?58:84,0),anchors:dt,style:d,ground:!(l&&s.backdrop!==!1),groundY:0,setCut(t,o=null){be=!0,K=t,Fe=o},setProgress(t){be=!0,K=-8+G(t,0,1)*(_+20)},getCut:()=>K,setTone(t){p.uniforms.uTone.value=t},update(t,o,k){l&&d.update(t,o,k),be||(K=G((o%46-3)*12,-8,_+12));for(let P=0;P<O;P++){const V=le(P);K<V?g[P]=1e6:be?(g[P]>1e5||o<g[P])&&(g[P]=o-Math.min(Fe?Fe(V):(K-V)/It,60)):g[P]=o-(K-V)/12}p.uniforms.uCutY.value=K>_+4?1e4:K;const x=o-g[$],c=g[$]<1e5&&x>0,T=x-Pe;if(et.uShow.value=c?G(x/.15,0,1):0,de.U.uShow.value=c&&T>0?G(T/.15,0,1):0,c){const P=G(x/Pe,0,1),V=Qe*(1-Math.pow(1-P,2.2));if(ve.setFront(V,P>=1),et.uRollR.value=1.6+5*(1-V/Qe),T>0){const D=G(T/ot,0,1);de.setFront(de.len*(1-Math.pow(1-D,1.7)),D>=1),de.U.uRollR.value=1.6-.9*D}}v.getWorldPosition(We),d.setShadow(Bt,We.x,We.z,Ge,dt.shadowLength,34,Math.max(K,0),_,.93)},dispose(){}};return ut.update(0,0,null),ut}export{Ae as HAZE_GLSL,wt as PALETTE,we as WOOD_GLSL,Xt as buildHero,gt as curlGeometry,pt as curlMesh,Ut as makeStyle,De as ribbonGeometry,bt as stickGeometry};
