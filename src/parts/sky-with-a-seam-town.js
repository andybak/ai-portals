import*as i from"three";import{clamp as Ce,lerp as ge,smoothstep as Te}from"../kit/core.js";import*as ye from"../kit/fauna.js";import{GLSL_HASH as xe}from"../kit/fx.js";import{LAMP_LIGHT as be,PAINTS as ke,GLSL_SHADOW as We,SWELL as ue,dirOf as Re}from"./sky-with-a-seam.js";import{Paint as He,PIECES as Ne,houseShape as Oe}from"./sky-with-a-seam-town-b.js";const R={quayA:32,quayTop:1.6,frontA:38,depth:12,pitch:12.5,slot0:-60,slots:20,houseW:10.4,square:[],south:-72,mouth:210,moleTop:2.4,moleW:7,headR:5.5,eastHeadA:22,westHeadA:-36,westA:-131,rootA:56,northB:266,landA:140,boats:{a:15.5,b0:65,n:7,portA:-20,portB0:52.5,portN:9,heading:-25,len:5.6,mast:5.2},boathouses:{a0:23,a1:31.4,floor:1.9,w:8.2,slots:[7,8,9,17,18,19],westA0:-127.6,westA1:-119.2,westB0:77.5,westN:8},posts:{a:33.1,h:4.6,r:.07},pole:{a:40,b:210,h:11.5,r:.085},wind:[-.94,.342],racks:{b0:186.5,b1:203.5,rows:[37.2,43.2,49.2],west:[[-50,-72],[-76,-98],[-102,-124]]},church:{a:66.3,b:228,len:18,w:9.6,eaves:6.2,tower:4.6,towerH:13.6,spire:27.2},light:{r0:2,r1:1.45,h:8.2,lamp:9.6,top:12.2},hill:{tops:[[98,148,46,31],[120,198,50,40],[90,106,36,26]],a0:52,a1:172,b0:68,b1:252,cell:4,edge:140,field:[19,23,.4,.06,.35,.08],heath:[29.5,2.6,.21,1,2.2,.17,.05],path:{a0:58,a1:121,b:204,fall:6,sway:8,turns:7}},washing:[5,10,15],smoke:{bend:21,top:34,lean:6.5,r0:.2,grow:.1},rock:.9},s=n=>{const r=String(Math.round(n*1e4)/1e4);return/[.e]/.test(r)?r:r+"."},te=10,Y=(()=>{const n=Re(ue.from+180),r=2*Math.PI/ue.length;return{x:n.x,z:n.z,k:r,w:Math.sqrt(9.81*r),a:ue.height/2}})(),Ie=`
uniform float uTime; uniform vec2 uCentre;
vec3 seaWave(vec2 xz){ float e = 1. - smoothstep(150., 360., length(xz - uCentre));
  return vec3(0., ${s(Y.a)} * sin(${s(Y.k)} * dot(xz, vec2(${s(Y.x)}, ${s(Y.z)})) - ${s(Y.w)} * uTime) * e, 0.); }
`,Le=`
attribute vec3 color; attribute vec4 aMat, aAxis, aMove;
uniform float uClock, uPix; uniform vec3 uBoatDir, uWind; uniform vec4 uPh;
varying vec3 vCol, vN, vW; varying vec4 vMat; varying float vViewZ, vCover; varying vec2 vProj;
${Ie}
#include <fog_pars_vertex>
void main(){
  vec3 p = position, n = normal, ax = aAxis.xyz;
  if (aMove.w > .5 && aMove.w < 1.5) {
    // a moored boat: it rides the swell at its mooring, takes the water's slope, and rocks a little by the clock
    vec2 pv = aMove.xy, d2 = uBoatDir.xz, s2 = vec2(-d2.y, d2.x);
    float h0 = seaWave(pv).y, hb = seaWave(pv + d2 * 2.).y, hs = seaWave(pv + s2 * .8).y;
    float pitch = (hb - h0) * .4 + .012 * sin(uClock * .83 + aMove.z * 1.7), roll = (hs - h0) * .85 + .034 * sin(uClock * 1.07 + aMove.z);
    vec3 D = vec3(d2.x, 0., d2.y), S = vec3(s2.x, 0., s2.y), P0 = vec3(pv.x, .15, pv.y), up = vec3(0., h0 * .9, 0.);
    vec3 r = p - P0; r += pitch * cross(S, r) + roll * cross(D, r); p = P0 + r + up;
    r = ax - P0; r += pitch * cross(S, r) + roll * cross(D, r); ax = P0 + r + up;
    n += pitch * cross(S, n) + roll * cross(D, n);
  } else if (aMove.w > 1.5 && aMove.w < 2.5) {
    // the pennant: a wave runs down the cloth from the hoist, wider toward the fly; it sags a little
    float s = aMove.z, th = s * 2.3 - uClock * 5.2 + uPh.x, amp = .07 + .16 * s;
    vec3 l = vec3(-uWind.z, 0., uWind.x);
    p += l * (amp * sin(th) * min(s * 2., 1.)) + vec3(0., -.05 * s * s - .05 * s * sin(th * .5 + 1.3), 0.);
    n = normalize(l - uWind * (amp * 2.3 * cos(th) * min(s * 2., 1.)));
  } else if (aMove.w > 2.5 && aMove.w < 3.5) {
    float h = seaWave(aMove.xy).y * .9; p.y += h; ax.y += h;
  } else if (aMove.w > 3.5) {
    // a hung sheet: it swings from its line, the more the lower it hangs, and a slow ripple runs down it
    float h = aMove.z, ph = aMove.x * .9 + aMove.y * .7 + uPh.y, sw = .09 * sin(uClock * 1.15 + ph) + .04 * sin(uClock * 2.6 + ph * 1.7 + h * 2.4);
    p += n * (h * sw); n = normalize(n + vec3(0., 1.2 * sw, 0.));
  }
  vec4 wp = modelMatrix * vec4(p, 1.);
  vec3 eye = cameraPosition;
#ifdef MIRROR
  eye.y = -eye.y;                                     // the image is seen as from the eye's own image under the water
#endif
  // THE THIN-MEMBER LAW (a rule of drawing, the kit's own wire law): a round member thinner than a pixel and a half
  // is drawn a pixel and a half wide AND CARRIES ONLY THE COVER IT TRULY HAS, its own width over the width drawn
  // (vCover: whole, no floor, no share of it kept back). So far off a mast or a rail is a faint line, and it comes
  // up to its full paint as the eye nears it and the member fills its pixels. Where its cover is whole it is laid
  // by the solid coat (its image by the image's own); where it is widened, by the thin coats ('town-thin',
  // 'town-thin-image'), blended by this cover and writing no depth: said at the paint's last lines.
  vCover = 2.;                                         // (2: not a thin member; a thin member's cover is 1 or less)
  if (aAxis.w > 0.) { vec4 cw = modelMatrix * vec4(ax, 1.); float dist = length(eye - cw.xyz);
    float want = max(aAxis.w, .75 * uPix * dist / projectionMatrix[1][1]); wp.xyz = cw.xyz + (wp.xyz - cw.xyz) * (want / aAxis.w); vCover = aAxis.w / want; }
  vW = wp.xyz; vN = mat3(modelMatrix) * n; vCol = color; vMat = aMat; vProj = vec2(projectionMatrix[2][2], projectionMatrix[3][2]);
#ifdef MIRROR
  wp.y = -wp.y;
#endif
  vec4 mvPosition = viewMatrix * wp; vViewZ = -mvPosition.z; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,qe=`
${We}
uniform float uClock, uKey, uFill, uPlane, uLit; uniform vec3 uLampCol, uFillCol, uSkyCol, uHazeCol, uBounce, uGlowCol; uniform vec4 uPf;
uniform vec4 uOrg, uPosts, uMastS, uMastP, uPole, uLH; uniform vec3 uPostH, uMastH; uniform vec4 uBoxA[${te}], uBoxB[${te}];
varying vec3 vCol, vN, vW; varying vec4 vMat; varying float vViewZ, vCover;
#include <fog_pars_fragment>
${xe}
float hash1(vec2 p){ return hash12(p); }                // (the kit's hash12, from its fx: every tone, grain and ripple of this paint is dealt by it)
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash1(i), hash1(i + vec2(1., 0.)), f.x), mix(hash1(i + vec2(0., 1.)), hash1(i + vec2(1., 1.)), f.x), f.y); }
float band(float x, float d, float w){ w = max(w, 1e-4); float a = x - .5 * w, b = x + .5 * w;
  return clamp(((floor(b) * d + min(fract(b), d)) - (floor(a) * d + min(fract(a), d))) / w, 0., 1.); }
// the town's own axes: x = metres to starboard of the line, z = metres along it from the entry
vec3 toTown(vec3 p){ vec2 q = p.xz - uOrg.xy; return vec3(dot(q, vec2(-uOrg.w, uOrg.z)), p.y, dot(q, uOrg.zw)); }
// a row of upright round members, all alike and evenly spaced (row: a, the first b, the pitch, how many; h: foot, top, radius)
float rowShade(vec3 P, vec3 D, float T, vec4 row, vec3 h, float foot){
  float da = abs(D.x) < 1e-4 ? 1e-4 : D.x, t = (row.x - P.x) / da;
  float b = P.z + D.z * t, y = P.y + D.y * t;
  float k = clamp(floor((b - row.y) / row.z + .5), 0., row.w - 1.), off = abs(b - (row.y + k * row.z)) * abs(da) / max(length(D.xz), 1e-4);
  // (across its line a member's shade is the share of a window of half width pen, the lamp's own soft edge there and
  // half the pixel's footprint, that the member's own width covers: whole while the window is narrower than the
  // member, and as the window outgrows it ITS OWN MEAN, h.z / pen: the thin shade is never thinned below that)
  float pen = .0035 * max(t, 0.) + .5 * foot + .004;
  float s = clamp((h.z + pen - off) / (2. * pen), 0., min(1., h.z / pen)) * smoothstep(h.x - pen, h.x + pen, y) * (1. - smoothstep(h.y - pen, h.y + pen, y));
  return s * step(.05, t) * step(t, T); }
// a box of the town's axes (c: its middle, h: its half sizes): the shade by the length of the light's way through it
float boxShade(vec3 P, vec3 D, float T, vec3 c, vec3 h, float soft){
  vec3 sd = mix(vec3(-1.), vec3(1.), step(0., D)), inv = sd / max(abs(D), 1e-5);
  vec3 t0 = (c - h - P) * inv, t1 = (c + h - P) * inv, tn = min(t0, t1), tf = max(t0, t1);
  float a = max(max(tn.x, tn.y), max(tn.z, .02)), b = min(min(tf.x, tf.y), min(tf.z, T));
  return smoothstep(0., soft, b - a); }
float townShade(vec3 Pw, vec3 Lw, float foot){
  vec3 P = toTown(Pw), Q = toTown(Lw), D = Q - P; float T = max(length(D), 1e-3); D /= T;
  float s = rowShade(P, D, T, uPosts, uPostH, foot);
  s = max(s, rowShade(P, D, T, uMastS, uMastH, foot)); s = max(s, rowShade(P, D, T, uMastP, uMastH, foot));
  s = max(s, rowShade(P, D, T, vec4(uPole.x, uPole.y, 1., 1.), vec3(0., uPole.z, uPole.w), foot));
  float soft = .12 + 2. * foot;
  for (int i = 0; i < ${te}; i++) s = max(s, boxShade(P, D, T, uBoxA[i].xyz, uBoxB[i].xyz, soft) * uBoxB[i].w);
  return s; }
#ifdef MIRROR
// the stone's own footprint on the still water (the quay and the land, the breakwaters, the mole, the basin's inner
// end as boxes a0, b0, a1, b1; the two round heads): an image lies on water only, never across a wall's foot
uniform vec4 uStone[6], uHeads;
float onStone(vec2 p){
  float s = 0.;
  for (int i = 0; i < 6; i++) s += step(uStone[i].x, p.x) * step(p.x, uStone[i].z) * step(uStone[i].y, p.y) * step(p.y, uStone[i].w);
  vec2 e = p - uHeads.xy, w = p - vec2(uHeads.z, uHeads.y);
  return s + step(dot(e, e), uHeads.w) + step(dot(w, w), uHeads.w); }
#endif
`,u=R.hill.field,D=R.hill.heath,A=R.hill.path,$e=`
varying vec2 vProj;
void main(){
  // every footprint is taken here, before any branch
  float fu = fwidth(vMat.y), fv = fwidth(vMat.z), foot = max(length(fwidth(vW)), 1e-4);
  vec3 E = cameraPosition;
#ifdef MIRROR
  // the still water's place where the eye's ray to the image crosses it, and the ripples' footprint there
  float k0 = clamp(E.y / max(E.y + vW.y, 1e-3), 0., 1.); vec2 wxz = E.xz + (vW.xz - E.xz) * k0; float fww = max(length(fwidth(wxz)), 1e-4);
  E.y = -E.y;
#endif
  vec3 N = normalize(vN + 1e-5), V = E - vW; float vd = max(length(V), 1e-3); V /= vd;
  float kind = floor(mod(vMat.x + .5, 16.)), layer = floor((vMat.x + .5) / 16.);
  if (kind > 6.5 && kind < 7.5 && dot(N, V) < 0.) N = -N;                 // cloth is seen from both sides
  vec3 alb = vCol, glow = vec3(0.), Ng = N; float gloss = .05, glass = 0.;
  if (kind < .5) { }
  else if (kind < 1.5) {                                                   // clapboard: the lap's shadow line under every board
    float q = vMat.z / .15, w = fv / .15;
    alb *= (1. - .3 * band(q, .16, w)) * (1. + .06 * (hash1(vec2(floor(q), 3.)) - .5) * (1. - smoothstep(.3, 1., w)));
  } else if (kind < 2.5) {                                                 // slate: courses, staggered joints, slate by slate a tone
    float q = vMat.z / .24, w = fv / .24, row = floor(q), u2 = (vMat.y + .2 * mod(row, 2.)) / .4, fade = 1. - smoothstep(.4, 1.2, max(w, fu / .4));
    // (the upright joint: a dark line over a tenth of every slate's 0.4 m, at strength .22. Where the footprint outgrows
    // the slate it is let go TO ITS OWN MEAN, .22 x .1 = .022 of the tone, never to bare slate; the slate-by-slate tone
    // is as often light as dark, so its own mean is nothing; the courses' line comes to its mean, .3 x .14, by band())
    alb *= (1. - .3 * band(q, .14, w)) * (1. - mix(.022, .22 * band(u2, .1, fu / .4), fade)) * (1. + .2 * (hash1(vec2(floor(u2), row)) - .5) * fade);
    gloss = .16;
    // (slate takes the sky's sheen, the more the flatter it is seen: a roof turned from the lamp is a dark slope, not a black blank)
    float fz = 1. - clamp(dot(N, V), 0., 1.); glow = mix(uHazeCol, uSkyCol, clamp(reflect(-V, N).y * 2.5, 0., 1.)) * (.02 + .11 * fz * fz);
  } else if (kind < 3.5) {                                                 // a window: axes, white bars, glass with its curtain
    float lampIn = step(99.5, vMat.w), par = vMat.w - 100. * lampIn;       // (a figure over 100: a room's lamp burns behind this one)
    float cols = floor(par / 10. + .01), rows = par - cols * 10.; vec2 f = vec2(.11, .075), q = (vMat.yz - f) / (1. - 2. * f), fq = vec2(fu, fv) / (1. - 2. * f);
    float inside = smoothstep(-fq.x, fq.x, q.x) * smoothstep(-fq.x, fq.x, 1. - q.x) * smoothstep(-fq.y, fq.y, q.y) * smoothstep(-fq.y, fq.y, 1. - q.y);
    float bars = 1. - (1. - band(q.x * cols + .06, .12, fq.x * cols)) * (1. - band(q.y * rows + .05, .1, fq.y * rows));
    glass = inside * (1. - bars);
    // the curtain: a pelmet and two straight side strips (plain upright shapes: nothing a mirror could turn into a sign)
    float curtain = .55 * smoothstep(.7, .78, q.y) + .3 * (1. - smoothstep(.1, .18, min(q.x, 1. - q.x)));
    vec3 pane = mix(vec3(.035, .045, .06), vec3(.42, .4, .37), curtain);
    alb = mix(alb, pane, glass); gloss = mix(.08, 1., glass);
    // old glass: every pane hangs a little out of true (the same panes in every window), so the low lamp-sun is
    // caught pane by pane; and in the LOW SUN look a room's lamp burns warm behind a few windows, evenly spaced
    vec2 pn = floor(clamp(q, 0., .999) * vec2(cols, rows)), tl = (vec2(hash1(pn + 3.), hash1(pn.yx + 11.)) - .5) * .16;
    vec3 T2 = vec3(-N.z, 0., N.x); Ng = normalize(N + (T2 * tl.x + vec3(0., tl.y, 0.)) * glass);
    glow = vec3(1., .55, .2) * (uLit * lampIn * glass * (1.6 + 2.2 * curtain));
  } else if (kind < 4.5) {                                                 // dressed stone: courses and staggered joints, the tide's stain
    float q = vMat.z / .5, w = fv / .5, row = floor(q), u2 = (vMat.y + .55 * mod(row, 2.)) / 1.1, fade = 1. - smoothstep(.4, 1.2, max(w, fu / 1.1));
    // (the upright joint: a dark line over a twentieth of every stone's 1.1 m, at strength .35; let go to ITS OWN MEAN,
    // .35 x .05 = .0175 of the tone, as the footprint outgrows the stone; the stone-by-stone tone's mean is nothing)
    alb *= (1. - .4 * band(q, .1, w)) * (1. - mix(.0175, .35 * band(u2, .05, fu / 1.1), fade)) * (1. + .26 * (hash1(vec2(floor(u2), row)) - .5) * fade);
    float wet = 1. - smoothstep(.25, .8, vW.y + .15 * vnoise(vec2(vMat.y * .7, 3.)));
    alb = mix(alb, alb * vec3(.34, .4, .33), wet); gloss = mix(.03, .3, wet);
  } else if (kind < 5.5) {                                                 // the lighthouse's lamp: its beam turns by the clock
    vec2 r = vW.xz - uLH.xy; r /= max(length(r), 1e-3); float th = uClock * uLH.w + uLH.z;
    float beam = max(dot(r, vec2(cos(th), sin(th))), 0.); beam = beam * beam; beam = beam * beam; beam = beam * beam * beam;
    glow = uGlowCol * (.5 + 7. * beam); alb = vec3(.1); gloss = .6;
  } else if (kind < 6.5) {                                                 // the hill: painted by its place on the ground (vMat.yz: metres), its height and its steepness
    vec2 p = vMat.yz; float hy = vW.y, fp = foot;
    float r0 = vnoise(p * .045) * .65 + vnoise(p * .11 + 5.) * .35, r1 = vnoise(p * .31 + 9.);
    // fields on the slopes, a tone to each and one in four mown, parted by dry-stone walls (built ones stand on
    // these lines); heath and heather above the heath line; bare rock where the slope is steepest
    vec2 c = vec2(p.x / ${s(u[0])} + ${s(u[2])} * sin(p.y * ${s(u[3])}), p.y / ${s(u[1])} + ${s(u[4])} * sin(p.x * ${s(u[5])})), ci = floor(c);
    float hl = ${s(D[0])} + ${s(D[1])} * sin(p.x * ${s(D[2])} + ${s(D[3])}) + ${s(D[4])} * sin(p.y * ${s(D[5])} + p.x * ${s(D[6])});
    float low = 1. - smoothstep(hl - .8, hl + .8, hy), tone = hash1(ci);
    vec3 field = mix(mix(vec3(.1, .27, .035), vec3(.27, .4, .07), tone), vec3(.47, .41, .14), step(.74, hash1(ci + 7.3)));
    vec3 heath = mix(mix(vec3(.25, .19, .06), vec3(.42, .31, .1), r0), vec3(.36, .16, .2), .45 * smoothstep(.5, .66, r1));
    vec3 land = mix(heath, field, low);
    land *= (1. + .22 * (vnoise(p * vec2(1.3, 1.1)) - .5) * (1. - smoothstep(.25, 1., fp))) * (.84 + .32 * r0);
    // THE WALLS' PAINTED FOOT: 0.7 m of wall in every field's ${u[0]} m and in every ${u[1]} m, AT ITS TRUE WIDTH (never widened
    // for the pixel). Each of the two families is filtered by band() over its own footprint (wx, wy: the footprint of
    // the field's own measure, worked from the ground's footprints taken above and the walls' sway), so as the
    // footprint outgrows the field the line comes OF ITSELF TO ITS OWN MEAN and stays there: 0.7 / ${u[0]} = ${s(.7/u[0])} and
    // 0.7 / ${u[1]} = ${s(.7/u[1])} of the ground, the two together ${s(.7/u[0]+.7/u[1]-.49/(u[0]*u[1]))} (their sum less their crossings), at the wall's tone
    // and the .9 it is laid at. No ramp lets it go to bare grass.
    float wx = fu / ${s(u[0])} + abs(${s(u[2]*u[3])} * cos(p.y * ${s(u[3])})) * fv, wy = fv / ${s(u[1])} + abs(${s(u[4]*u[5])} * cos(p.x * ${s(u[5])})) * fu;
    float wall = 1. - (1. - band(c.x, ${s(.7/u[0])}, wx)) * (1. - band(c.y, ${s(.7/u[1])}, wy));
    land = mix(land, vec3(.4, .39, .36), .9 * wall * low);
    // (rock: where the slope stands over some 55 degrees, and in small outcrops on the heath)
    float crag = max((1. - smoothstep(.5, .6, abs(N.y))) * smoothstep(.3, .55, r1 * .6 + r0 * .5), (1. - low) * smoothstep(.74, .8, vnoise(p * .47 + 17.)));
    land = mix(land, vec3(.41, .4, .38) * (.72 + .5 * vnoise(p * .9 + 3.)), crag);
    // THE PATH that winds up from behind the houses to the cairn, AT ITS TRUE WIDTH: trodden earth whole to 0.48 m
    // from its middle and worn out to 0.8 m (1.28 m of earth across, counted whole). pc is the share of the path
    // in a window laid across it: the window is the path's own worn edge (0.32 m) and the pixel's footprint across
    // the path (pf: from the ground's footprints taken above and the path's own slant). So near it is the path as it
    // was, and as the footprint outgrows it its cover is its true width over the width drawn, 1.28 / pf: its own
    // mean, never widened for the pixel and never let go to bare ground.
    float ps = clamp((p.x - ${s(A.a0)}) / ${s(A.a1-A.a0)}, 0., 1.), pa = ps * ${s(A.turns)}, pd = abs(p.y - (${s(A.b)} - ${s(A.fall)} * ps + ${s(A.sway)} * sin(pa)));
    float pf = .32 + fv + abs(${s(-A.fall/(A.a1-A.a0))} + ${s(A.sway*A.turns/(A.a1-A.a0))} * cos(pa)) * fu, pc = clamp((min(pd + .5 * pf, .64) - max(pd - .5 * pf, -.64)) / pf, 0., 1.);
    land = mix(land, vec3(.56, .5, .36), .9 * pc * step(${s(A.a0)}, p.x) * step(p.x, ${s(A.a1)}));
    land *= mix(.5, 1., smoothstep(.2, 1.1, hy));                           // dark and wet where its east foot stands in the water
    alb = land * vCol; gloss = 0.;                                         // (vCol: the hollows' shade, laid at the build)
  } else if (kind < 8.5 && kind > 7.5) {                                   // upright boards with a shadow gap between
    float q = vMat.y / .22, w = fu / .22; alb *= 1. - .34 * band(q, .1, w);
  } else if (kind > 8.5 && kind < 9.5) {                                // the shore's own rock: mottled, dark and wet at the water
    float wet = 1. - smoothstep(.2, .7, vW.y + .2 * vnoise(vW.xz * .9));
    alb *= (.8 + .4 * vnoise(vW.xz * .8 + vW.y * 1.7)) * mix(1., .42, wet); gloss = mix(.03, .35, wet);
  }
  vec3 L = uLamp - vW; float ld = max(length(L), 1.); L /= ld;
  float ndl = max(dot(N, L), 0.); ndl = max(ndl, .7 * step(6.5, kind) * step(kind, 7.5) * max(-dot(N, L), 0.));   // (thin cloth lets the lamp through)
  float sh = max(townShade(vW, uLamp, foot), boatShade(vW, min(foot, 2.)));
  vec3 lit = uFillCol * uFill * (.6 + .4 * N.y) + uBounce * (.5 - .5 * N.y) + uLampCol * (uKey * 1.25 * ndl * (1. - sh));
  lit += uLampCol * (uKey * .28 * max(-dot(N.xz, L.xz), 0.));             // the lit sky wall's return: what is turned from the lamp is not a dark shape against it
  // fresh paint's sheen and the glass: the sky's light in a pane, and the lamp caught in it
  vec3 R = reflect(-V, Ng); float rdl = max(dot(R, L), 1e-4), ndv = clamp(dot(N, V), 0., 1.);
  float r2 = rdl * rdl, r8 = r2 * r2 * r2 * r2, r32 = r8 * r8 * r8 * r8, r128 = r32 * r32 * r32 * r32, fres = 1. - ndv; fres = fres * fres * fres;
  // (the glass's catch: the lamp's own image sharp, a wide warm glint round it, and a faint sheen on every lit pane)
  vec3 c = alb * lit + uLampCol * (uKey * (1. - sh) * step(1e-3, ndl)) * (gloss * .12 * r8 + glass * (.02 * ndl + 1.2 * r8 + .9 * r32 + 9. * r128 * r128));
  c += glass * mix(uHazeCol, uSkyCol, clamp(R.y * 2.5, 0., 1.)) * (.1 + .5 * fres) + glow;
  gl_FragColor = vec4(c, clamp(vCover, 0., 1.));                           // (a thin member's own cover; whole on everything else)
  #include <fog_fragment>
#ifdef MIRROR
  // the image in the basin: stronger the flatter the eye's ray lies on the water, broken by the ripples at the
  // water's own place (their pattern is let go to ITS OWN MEAN, .5, as its footprint outgrows it: the ripples'
  // two noises stand as often over their middle as under it), and standing just over the still water in depth
  float cosT = cameraPosition.y / max(length(vec3(wxz.x - cameraPosition.x, cameraPosition.y, wxz.y - cameraPosition.z)), 1e-3), g = 1. - clamp(cosT, 0., 1.);
  float rp = vnoise(wxz * vec2(.55, .55) + uClock * vec2(.1, .16) + uPf.xy) * .55 + vnoise(wxz * 1.9 - uClock * vec2(.27, .12) + uPf.yx) * .45;
  float broken = mix(smoothstep(.36, .64, rp), .5, smoothstep(.5, 2., fww));
  float al = (.74 + .24 * g * g) * mix(1., broken, .24);
  al *= gl_FragColor.a;                                                    // (a thin member's image carries the member's own cover)
  gl_FragColor = vec4(gl_FragColor.rgb * (.88 * al), al);
  float kp = clamp((cameraPosition.y - uPlane) / max(cameraPosition.y + vW.y, 1e-3), 1e-3, 1.), zp = max(vViewZ * kp, 1e-3);
  gl_FragDepth = clamp(.5 * (-vProj.x + vProj.y / zp) + .5 - (.02 + 8e-4 * layer) * (1. - gl_FragCoord.z), 0., 1.);   // (trim stands before its wall by a share of its own depth: no tie)
  vec3 wt = toTown(vec3(wxz.x, 0., wxz.y));
  // what stands under the water has no image, and no image lies on stone; and of a thin member's image only the
  // near half is laid: a thin triangle is wound toward its own axis (below), and the image turns every face about,
  // so in the image the half that faces the eye shows its FRONTS and the far half, let go here, its backs
  if (vW.y < 0. || onStone(wt.xz) > .5 || (vCover < 1.5 && !gl_FrontFacing)) discard;
#endif
  // A THIN MEMBER'S TWO COATS. Where it is drawn at its own width (its cover whole, to a thousandth: the varying's
  // own rounding) it is a solid thing: the town's solid coat lays it, and the image's own lays its image, and each
  // writes its depth. Where it is widened for the pixel the thin coats lay it by its cover and WRITE NO DEPTH, so
  // a faint line hides no more than the cover it has. A member is round, and a widened coat lays only the half
  // that faces the eye, so its cover is laid once. WHICH HALF THAT IS: every thin triangle is wound TOWARD its own
  // axis in the world (the builder winds a tube away from its axis in the town's own axes, and those axes are
  // laid in the world by a mirror, sx = -fz, sz = fx; the proof counts the winding on every seed), so the half
  // that faces the eye shows its BACKS, and the fronts, the far half, are let go.
#ifdef THIN
  if (vCover >= .999) discard;
#ifndef MIRROR
  if (gl_FrontFacing) discard;
#endif
#else
  if (vCover < .999) discard;
#endif
}`;function Ee(n,r,L,p,w){const q=ke[n],m=be[n],t=R,N=p.uniforms,C=t.quayTop,l=(g=0,S=0,I=0,O=0)=>new i.Vector4(g,S,I,O),$=(g,S)=>new i.Vector3(g*r.sx+S*r.fx,0,g*r.sz+S*r.fz),T=t.boats.heading*Math.PI/180,v=[],y=[],o=t.moleW/2,f=t.mouth-o,M=(g,S,I,O,G,U)=>{v.push(l((g+S)/2,(I+O)/2,(G+U)/2,0)),y.push(l((S-g)/2,(O-I)/2,(U-G)/2,1))},x=g=>t.slot0+t.pitch*g,d=t.boathouses;for(const g of d.slots)M(d.a0,d.a1,d.floor,d.floor+2.5,x(g)-d.w/2,x(g)+d.w/2);for(;v.length<te;)v.push(l()),y.push(l());const b={...i.UniformsUtils.clone(i.UniformsLib.fog),uTime:N.uTime,uCentre:N.uCentre,uLamp:L.shadow.uLamp,uBoat:L.shadow.uBoat,uClock:{value:0},uPix:{value:2/720},uPlane:{value:.24},uBoatDir:{value:$(Math.sin(T),Math.cos(T))},uWind:{value:$(t.wind[0],t.wind[1])},uLampCol:{value:new i.Color().setRGB(m.color[0],m.color[1],m.color[2])},uFillCol:{value:new i.Color(q.fill)},uKey:{value:m.key},uFill:{value:m.fill},uSkyCol:{value:new i.Color(q.mid)},uHazeCol:{value:new i.Color(q.haze)},uBounce:{value:new i.Color(n?"#3a2c22":"#2e2e2a")},uGlowCol:{value:new i.Color(n?"#ffd9a0":"#fff2d2")},uLit:{value:n?1:0},uOrg:{value:l(r.ox,r.oz,r.fx,r.fz)},uPosts:{value:l(t.posts.a,t.slot0+t.pitch/2,t.pitch,t.slots+1)},uPostH:{value:new i.Vector3(C,C+t.posts.h,t.posts.r)},uMastS:{value:l(t.boats.a,t.boats.b0,t.pitch,t.boats.n)},uMastP:{value:l(t.boats.portA,t.boats.portB0,t.pitch,t.boats.portN)},uMastH:{value:new i.Vector3(.3,.3+t.boats.mast,.06)},uPole:{value:l(t.pole.a,t.pole.b,t.moleTop+t.pole.h,t.pole.r)},uLH:{value:l(r.ox+t.eastHeadA*r.sx+t.mouth*r.fx,r.oz+t.eastHeadA*r.sz+t.mouth*r.fz,w.lamp,.75)},uPh:{value:l(w.pennant,w.sheets,w.lean,w.billow)},uPf:{value:l(w.ripple[0],w.ripple[1],w.puff[0],w.puff[1])},uBoxA:{value:v},uBoxB:{value:y},uStone:{value:[l(t.quayA,t.south-10,1e4,f),l(t.rootA,f,1e4,t.northB),l(t.eastHeadA,f,t.rootA,t.mouth+o),l(t.westA-3,f,t.westHeadA,t.mouth+o),l(t.westA-3,t.south-10,t.westA+3,f),l(t.westA+3,t.south-10,t.quayA,t.south)]},uHeads:{value:l(t.eastHeadA,t.mouth,t.westHeadA,(t.headR+.27)*(t.headR+.27))}},z={uniforms:b,vertexShader:Le,fragmentShader:qe+$e,fog:!0,side:i.DoubleSide},k=new i.ShaderMaterial(z),c=new i.ShaderMaterial({...z,defines:{MIRROR:1},transparent:!0,premultipliedAlpha:!0,depthWrite:!0}),B=new i.ShaderMaterial({...z,defines:{THIN:1},transparent:!0,depthWrite:!1}),F=new i.ShaderMaterial({...z,defines:{MIRROR:1,THIN:1},transparent:!0,premultipliedAlpha:!0,depthWrite:!1});return{U:b,town:k,image:c,thin:B,thinImage:F}}const Be={boats:0,boathouses:1,shore:2,stone:3,lighthouse:4,dress:5,houses:6,racks:7,church:8,hills:9};function Fe(n,r,L,p){const w=n.P,q=n.M,m=w.length/9,t=new Float64Array(m),N=new Float32Array(m).fill(-1),C=new Float32Array(m),l=o=>Math.abs((w[o*3]-p.ox)*p.sx+(w[o*3+2]-p.oz)*p.sz),$=o=>(w[o*3]-p.ox)*p.fx+(w[o*3+2]-p.oz)*p.fz;for(const o of L){if(o.chunk!==r)continue;let f=1/0,M=1/0;for(let x=o.start;x<o.end;x++)f=Math.min(f,l(x)),M=Math.min(M,$(x));for(let x=Math.floor(o.start/3);x*3<o.end;x++)N[x]=Math.round(f),C[x]=Math.round(M)}for(let o=0;o<m;o++){const f=o*3,M=(l(f)+l(f+1)+l(f+2))/3;N[o]<0&&(N[o]=Math.round(M),C[o]=Math.round($(f))),t[o]=N[o]*1e9+(C[o]+500)*1e5+(15-Math.floor((q[f*4]+.5)/16))*1e3+M}const T=Array.from({length:m},(o,f)=>f).filter(o=>!(n.A[o*12+3]>0)).sort((o,f)=>t[o]-t[f]),v=T.length,y=new Uint32Array(v*3);for(let o=0;o<v;o++){const f=T[o]*3;y[o*3]=f,y[o*3+1]=f+1,y[o*3+2]=f+2}return y}const _e=`
attribute vec3 aSm;                                   // how far up the column (0..1), metres above the pot, metres it leans
uniform float uClock; uniform vec3 uWind; uniform vec4 uPh;
varying vec3 vW, vN, vSm; varying float vViewZ, vLean; varying vec2 vProj;
#include <fog_pars_vertex>
void main(){
  vec4 wp = modelMatrix * vec4(position, 1.);
  float br = .14 * sin(uClock * .31 + uPh.z) + .05 * sin(uClock * .83 + aSm.y * .2 + uPh.z * 1.7);
  wp.xyz += uWind * (aSm.z * br);                                           // the lean breathes, every column as one
  // (how far the column's line leans in a metre of height, for the cover's law: the built lean is ${s(R.smoke.lean)} t^2 m, t the
  // share of the way from the bend to the top, so its slope is 2 sqrt(${s(R.smoke.lean)} x the lean) / ${s(R.smoke.top-R.smoke.bend)}; it breathes with the lean)
  vLean = ${s(2*Math.sqrt(R.smoke.lean)/(R.smoke.top-R.smoke.bend))} * sqrt(max(aSm.z, 1e-6)) * (1. + br);
  // it billows: swellings travel up the column by the clock (no straight-sided sleeve: a pipe is not smoke)
  float bil = .3 * sin(aSm.y * .9 - uClock * 1.3 + uPh.w) + .18 * sin(aSm.y * 2.1 - uClock * 2.2 + uPh.z + uPh.w);
  wp.xyz += mat3(modelMatrix) * normal * ((${s(R.smoke.r0)} + ${s(R.smoke.grow)} * aSm.y) * bil * smoothstep(0., 2., aSm.y));
  vW = wp.xyz; vN = mat3(modelMatrix) * normal; vSm = aSm; vProj = vec2(projectionMatrix[2][2], projectionMatrix[3][2]);
#ifdef MIRROR
  wp.y = -wp.y;
#endif
  vec4 mvPosition = viewMatrix * wp; vViewZ = -mvPosition.z; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,De=`
uniform float uClock, uKey, uFill, uPlane; uniform vec3 uLamp, uLampCol, uFillCol, uWind; uniform vec4 uOrg, uStone[6], uHeads, uPf;
varying vec3 vW, vN, vSm; varying float vViewZ, vLean; varying vec2 vProj;
#include <fog_pars_fragment>
${xe}
float hashW(vec2 p){ p.y = mod(p.y, 64.); return hash12(p); }   // (the kit's hash12 on a lattice that closes on itself every 64 rows)
float puff(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hashW(i), hashW(i + vec2(1., 0.)), f.x), mix(hashW(i + vec2(0., 1.)), hashW(i + vec2(1., 1.)), f.x), f.y); }
#ifdef MIRROR
// (the town's paint's own soft noise, written out again: the ripples of the one mirror break the smoke's image too)
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash12(i), hash12(i + vec2(1., 0.)), f.x), mix(hash12(i + vec2(0., 1.)), hash12(i + vec2(1., 1.)), f.x), f.y); }
#endif
void main(){
  vec3 E = cameraPosition;
#ifdef MIRROR
  E.y = -E.y;
#endif
  vec3 N = normalize(vN + 1e-5), V = E - vW; V /= max(length(V), 1e-3);
  float s = vSm.x, rnd = N.x * 1.7 + N.z * 1.1;
  float pat = puff(vec2(rnd + vSm.y * .13, vSm.y * .6 - mod(uClock * .9 + uPf.z, 64.))) * .6 + puff(vec2(rnd * 1.9 + 4., vSm.y * 1.3 - mod(uClock * 1.6 + uPf.w, 64.))) * .4;
  // wisps, not a sleeve: the puffs part it and it is gone before its top. THE COVER, AS LIGHT TAKES IT (the law is
  // said at this paint's head): u = the ray's level way through the column, the column's lean taken off; mu = the
  // cosine at the skin; the smoke gathered is (4/3) rho R mu^3 / |u|, where (4/3) rho R, the smoke through the
  // column's middle seen level, is .2 where a puff is thinnest and 1.15 where it is thickest (a cover of .18 to
  // .68 there: 1 - exp(-.2), 1 - exp(-1.15)), thinned by the column's own law of height
  vec2 u = V.xz - uWind.xz * (vLean * V.y); float ul = sqrt(max(dot(u, u), .01)), mu = clamp(dot(N.xz, u) / ul, 0., 1.);
  float dens = smoothstep(.25, .75, pat), through = (.2 + .95 * dens) * smoothstep(0., .05, s) * (1. - smoothstep(.18, .85, s));
  float al = 1. - exp(-through * mu * mu * mu / ul);
  vec3 L = uLamp - vW; L /= max(length(L), 1.);
  vec3 c = vec3(.86, .86, .87) * (.85 + .25 * pat) * (uFillCol * (uFill * 1.05) + uLampCol * (uKey * (.3 + .45 * max(dot(N, L), 0.))));
  gl_FragColor = vec4(c, al);
  #include <fog_fragment>
#ifdef MIRROR
  float k0 = clamp(cameraPosition.y / max(cameraPosition.y + vW.y, 1e-3), 0., 1.); vec2 w = cameraPosition.xz + (vW.xz - cameraPosition.xz) * k0, q = w - uOrg.xy;
  float cosT = cameraPosition.y / max(length(vec3(w.x - cameraPosition.x, cameraPosition.y, w.y - cameraPosition.z)), 1e-3), g = 1. - clamp(cosT, 0., 1.);
  // THE SMOKE'S IMAGE IS THE SMOKE IN THE TOWN'S OWN MIRROR, nothing of it held back: its own cover times the
  // mirror's law exactly as the town's image takes it (the paint's MIRROR lines): stronger the flatter the eye's
  // ray lies on the water, broken by the same ripples at the water's own place (let go to their own mean, .5, as
  // their footprint outgrows them), and the water's .88 of the colour
  float fww = max(length(fwidth(w)), 1e-4);
  float rp = vnoise(w * vec2(.55, .55) + uClock * vec2(.1, .16) + uPf.xy) * .55 + vnoise(w * 1.9 - uClock * vec2(.27, .12) + uPf.yx) * .45;
  al *= (.74 + .24 * g * g) * mix(1., mix(smoothstep(.36, .64, rp), .5, smoothstep(.5, 2., fww)), .24);
  gl_FragColor.rgb *= .88;
  float kp = clamp((cameraPosition.y - uPlane) / max(cameraPosition.y + vW.y, 1e-3), 1e-3, 1.), zp = max(vViewZ * kp, 1e-3);
  gl_FragDepth = clamp(.5 * (-vProj.x + vProj.y / zp) + .5 - .02 * (1. - gl_FragCoord.z), 0., 1.);
  vec2 p = vec2(dot(q, vec2(-uOrg.w, uOrg.z)), dot(q, uOrg.zw)), he = p - uHeads.xy, hw = p - vec2(uHeads.z, uHeads.y); float on = step(dot(he, he), uHeads.w) + step(dot(hw, hw), uHeads.w);
  for (int i = 0; i < 6; i++) on += step(uStone[i].x, p.x) * step(p.x, uStone[i].z) * step(uStone[i].y, p.y) * step(p.y, uStone[i].w);
  al *= 1. - step(.5, on);                                                 // no image lies on stone
#endif
  gl_FragColor = vec4(gl_FragColor.rgb * al, al);
}`;function Ve(n,r,L){const p=n.smoke,w=8,q=14,m=[],t=[],N=[],C=Math.hypot(n.wind[0],n.wind[1])||1,l=n.wind[0]/C,$=n.wind[1]/C;for(let v=0;v<n.slots;v++){if(L<.8&&v%2)continue;const y=Oe(n,v),o=y.ridge+1.62,f=y.a0+4,M=y.bc,x=d=>{const b=d/q,z=o+(p.top-o)*b,k=Math.max(z-p.bend,0)/(p.top-p.bend),c=p.lean*k*k;return{s:b,y:z,lean:c,r:p.r0+p.grow*(z-o),a:f+l*c,b:M+$*c}};for(let d=0;d<q;d++){const b=x(d),z=x(d+1);for(let k=0;k<w;k++)for(const[c,B]of[[b,k],[b,k+1],[z,k+1],[b,k],[z,k+1],[z,k]]){const F=B/w*2*Math.PI,g=Math.cos(F),S=Math.sin(F),I=c.a+g*c.r,O=c.b+S*c.r;m.push(r.ox+I*r.sx+O*r.fx,c.y,r.oz+I*r.sz+O*r.fz),t.push(g*r.sx+S*r.fx,0,g*r.sz+S*r.fz),N.push(c.s,c.y-o,c.lean)}}}const T=new i.BufferGeometry;return T.setAttribute("position",new i.Float32BufferAttribute(m,3)),T.setAttribute("normal",new i.Float32BufferAttribute(t,3)),T.setAttribute("aSm",new i.Float32BufferAttribute(N,3)),T.computeBoundingSphere(),T.boundingSphere.radius+=2.5,T}async function Ze(n,r){const{path:L,look:p,sky:w,ocean:q}=r,m=R,t=r.detail||n.quality&&n.quality.detail||1,N=n.core.makeRng(n.core.hashSeed("town-paint:"+n.seed)),C=n.core.makeRng(n.core.hashSeed("town-clock:"+n.seed)),l=()=>C()*2*Math.PI,$={lamp:l(),pennant:l(),sheets:l(),lean:l(),billow:l(),ripple:[C()*64,C()*64],puff:[C()*64,C()*64],boats:Array.from({length:m.boats.n+m.boats.portN},l)},T=L.pointAt(0,new i.Vector3),v=L.tangentAt(0,new i.Vector3),y=Math.hypot(v.x,v.z)||1,o={ox:T.x,oz:T.z,fx:v.x/y,fz:v.z/y,sx:-v.z/y,sz:v.x/y},f=(e,a,h,W=new i.Vector3)=>W.set(o.ox+e*o.sx+h*o.fx,a,o.oz+e*o.sz+h*o.fz),M=new He(o),x={rng:N,detail:t,clock:$};for(const e of Ne)e(M,m,x),await n.yield();M.end();const d=Ee(p,o,w,q,$),b=new i.Group;b.name="the-town";let z=0;const k=[["P",3,"position"],["N",3,"normal"],["C",3,"color"],["M",4,"aMat"],["A",4,"aAxis"],["V",4,"aMove"]],c=M.chunks,B=[],F={},g=e=>e.reduce((a,h)=>a+h,0);let S=0;for(const e of c)B.push(S),S+=e.P.length/3;for(const[e,a]of k)F[e]=new Float32Array(S*a);const I=c.map(e=>e.P.length/9),O=c.map(e=>{let a=0;for(let h=3;h<e.A.length;h+=12)e.A[h]>0&&a++;return a}),G=e=>Be[c[e].name.split("-")[0]]??5,U=c.map(e=>{let a=1/0;for(let h=0;h<e.P.length;h+=9)a=Math.min(a,(e.P[h]-o.ox)*o.fx+(e.P[h+2]-o.oz)*o.fz);return a}),Me=c.map((e,a)=>a).filter(e=>c[e].mirror&&I[e]>O[e]).sort((e,a)=>G(e)-G(a)||U[e]-U[a]),oe=[];let V=0;for(const e of Me)oe[e]=V,V+=(I[e]-O[e])*3;const K=new Uint32Array(3*g(O)),_=new Uint32Array(V+3*g(O.filter((e,a)=>c[a].mirror)));let ae=0,se=V;for(let e=0;e<c.length;e++){const a=c[e],h=I[e],W=B[e];if(h){for(const[H,P]of k)F[H].set(a[H],W*P);for(let H=0;H<h;H++){if(!(a.A[H*12+3]>0))continue;const P=W+H*3;K[ae++]=P,K[ae++]=P+1,K[ae++]=P+2,a.mirror&&(_[se++]=P,_[se++]=P+1,_[se++]=P+2)}if(oe[e]!==void 0){await n.yield();const H=Fe(a,e,M.bodies,o);for(let P=0,J=oe[e];P<H.length;P++)_[J+P]=H[P]+W}a.P=a.N=a.C=a.M=a.A=a.V=null,await n.yield()}}{const e={};for(const[E,Z,ee]of k)e[ee]=new i.BufferAttribute(F[E],Z);const a=E=>{const Z=new i.BufferGeometry;for(const ee in e)Z.setAttribute(ee,e[ee]);return E&&Z.setIndex(new i.BufferAttribute(E,1)),Z},h=a(null),W=a(_),H=a(K),P=a(_.subarray(V));h.computeBoundingSphere(),h.boundingSphere.radius+=2.5,H.boundingSphere=h.boundingSphere.clone(),W.boundingSphere=new i.Sphere(h.boundingSphere.center.clone().setY(-h.boundingSphere.center.y),h.boundingSphere.radius),P.boundingSphere=W.boundingSphere.clone();const J=new i.Mesh(h,d.town),he=new i.Mesh(W,d.image),fe=new i.Mesh(H,d.thin),de=new i.Mesh(P,d.thinImage);J.name="town:all",he.name="town-image",fe.name="town-thin",de.name="town-thin-image",he.renderOrder=1.55,de.renderOrder=1.66,fe.renderOrder=1.8;for(const E of[J,he,fe,de])E.matrixAutoUpdate=!1,E.visible=!E.geometry.index||E.geometry.index.count>0,b.add(E);z=(S+_.length+K.length+_.length-V)/3,await n.yield()}const me={uniforms:d.U,vertexShader:_e,fragmentShader:De,fog:!0,side:i.DoubleSide,transparent:!0,premultipliedAlpha:!0,depthWrite:!1},ce=new i.ShaderMaterial(me),pe=new i.ShaderMaterial({...me,defines:{MIRROR:1}}),j=Ve(m,o,t),ne=new i.BufferGeometry;for(const e of["position","normal","aSm"])ne.setAttribute(e,j.getAttribute(e));ne.boundingSphere=new i.Sphere(j.boundingSphere.center.clone().setY(-j.boundingSphere.center.y),j.boundingSphere.radius);const Q=new i.Mesh(j,ce),X=new i.Mesh(ne,pe);Q.name="town-smoke",X.name="town-smoke-image",Q.matrixAutoUpdate=X.matrixAutoUpdate=!1,Q.renderOrder=1.85,X.renderOrder=1.7,b.add(Q,X),z+=2*j.getAttribute("position").count/3,await n.yield();const ze=w.shadow.uLamp.value,ie=be[p],we=ke[p],re=ye.makeFauna(b,{light:{sunDir:ze.clone().sub(f(0,0,100)).normalize(),sunColor:new i.Color().setRGB(ie.color[0],ie.color[1],ie.color[2]),sunIntensity:2.6,sky:we.fill,skyIntensity:1.1,ground:we.haze,groundIntensity:.5}}),le=[],Se={path:L,dist:2,step:2,each:!0,from:0,to:Math.min(1,(m.mouth+140)/r.length)},Pe=[{name:"gulls over the basin",at:[8,16,150],radius:46,count:5},{name:"gulls by the west breakwater",at:[-78,12,186],radius:30,count:3},{name:"gulls over the quay",at:[30,24,104],radius:34,count:6},{name:"gulls over the inner basin",at:[-8,20,48],radius:38,count:5},{name:"gulls by the lighthouse",at:[27,19,198],radius:22,count:4}];for(const e of Pe){await n.yield();const a=f(e.at[0],e.at[1],e.at[2]),h=await ye.makeFlockAsync({rng:n.core.makeRng(n.core.hashSeed(e.name+":"+n.seed)),species:"gulls",count:Math.max(2,Math.round(e.count*Math.min(1,t))),center:[a.x,a.y,a.z],radius:e.radius,height:2.5,spread:[8,2.5,16],wander:[1.4,.7,1.4,.35],maxSigma:3,keepClear:Se},n.yield);re.add(h),le.push({name:e.name,flock:h})}await n.yield();const ve=new i.Vector2,Ae=M.bodies.map(e=>({name:e.name,kind:e.kind,pad:e.pad,mesh:"town:all",start:B[e.chunk]+e.start,end:B[e.chunk]+e.end}));return r.scene&&r.scene.add(b),{object:b,bodies:Ae,triangles:z,flocks:le,axes:o,fauna:re,uniforms:d.U,quay(e,a=new i.Vector3){const h=Ce(e*r.length+50,150,m.mouth+4),W=Te(185,m.mouth+4,h);return f(ge(m.frontA,m.eastHeadA+2,W),ge(m.quayTop+5.5,9,W),h,a)},update(e,a,h,W){d.U.uClock.value=a,n.renderer&&(n.renderer.getDrawingBufferSize(ve),d.U.uPix.value=2/Math.max(ve.y,1)),re.update(e,a,h,W)},dispose(){b.traverse(e=>{e.isMesh&&e.name.startsWith("town")&&e.geometry.dispose()}),d.town.dispose(),d.image.dispose(),d.thin.dispose(),d.thinImage.dispose(),ce.dispose(),pe.dispose();for(const e of le){e.flock.geometry.dispose(),e.flock.material.dispose();const a=e.flock.route&&e.flock.route.texture;a&&a.dispose&&a.dispose()}}}}export{R as TOWN,Ze as makeTown};
