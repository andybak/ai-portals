import*as L from"three";const Dt=`
#include <common>
#include <shadowmap_pars_vertex>
attribute vec3 aC; attribute vec3 aM; attribute vec4 aQ;
#ifdef TOWN
attribute vec4 iA; attribute vec4 iB; attribute vec4 iC;
varying vec4 vI; varying float vJ;
#endif
varying vec3 vW; varying vec3 vN; varying vec3 vC; varying vec3 vM; varying vec3 vL; varying vec3 vNl;
varying vec4 vQ; varying vec4 vE; varying float vShade;
#ifdef SWAY
uniform float uTime;
#endif
void main() {
  #include <beginnormal_vertex>
  #include <defaultnormal_vertex>
  #include <begin_vertex>
  #ifdef SWAY
    // bare twigs tremble and pennons stir by the clock: aM.z says how free a vertex is to move
    transformed += vec3(sin(uTime * 2.3 + position.x * .9 + position.y * .5), 0., cos(uTime * 1.9 + position.z * .9 + position.y * .3)) * aM.z * .06;
  #endif
  #include <project_vertex>
  #include <worldpos_vertex>
  #include <shadowmap_vertex>
  vec4 wp = vec4(transformed, 1.); vec3 wn = normal;
  #ifdef USE_INSTANCING
    mat3 im3 = mat3(instanceMatrix);
    wn /= vec3(max(dot(im3[0], im3[0]), 1e-6), max(dot(im3[1], im3[1]), 1e-6), max(dot(im3[2], im3[2]), 1e-6));
    wn = im3 * wn; wp = instanceMatrix * wp;
  #endif
  wp = modelMatrix * wp; vW = wp.xyz;
  vN = normalize(mat3(modelMatrix) * wn + vec3(0., 1e-6, 0.));
  vL = position; vNl = normal; vM = aM; vQ = aQ;
  float f = aM.y;
  vE = vec4(mod(f, 2.), mod(floor(f / 2.), 2.), mod(floor(f / 4.), 2.), mod(floor(f / 8.), 2.));
  vec3 c = aC; vShade = -1000.;
  #ifdef TOWN
    if (aM.x > 1.5 && aM.x < 2.5) c *= iA.rgb; else if (aM.x > 2.5 && aM.x < 3.5) c *= iB.rgb;
    vShade = iA.w; vI = vec4(iB.w, iC.x, iC.y, iC.z); vJ = iC.w;
  #endif
  #ifdef SHADEQ
    vShade = aQ.w;
  #endif
  vC = c;
}`,Lt=`
#include <common>
#include <packing>
#include <bsdfs>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
uniform float uEdge; uniform float uTime; uniform float uFogDen; uniform float uSnow; uniform float uHoar;
uniform vec3 uSunDir; uniform vec3 uSunCol; uniform vec3 uSkyCol; uniform vec3 uGndCol;
uniform vec3 uFogCol; uniform vec3 uFogWarm; uniform vec3 uPortalPos; uniform vec3 uPortalCol;
varying vec3 vW; varying vec3 vN; varying vec3 vC; varying vec3 vM; varying vec3 vL; varying vec3 vNl;
varying vec4 vQ; varying vec4 vE; varying float vShade;
#ifdef TOWN
varying vec4 vI; varying float vJ;
#endif
float h21(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
// a ruled line every 'step' of x, 'w' wide, kept soft and faded where it would be thinner than a pixel
float ruled(float x, float w, float fw) { float d = abs(fract(x) - .5); float a = .5 - w; return smoothstep(a - fw, a + fw, d) * clamp(1.2 - fw * 3., 0., 1.); }
`,ye=Dt,xe=Lt,Gt=`
void main() {
  vec3 N = normalize(vN);
  vec3 V = cameraPosition - vW; float dist = length(V); V /= max(dist, 1e-4);
  #ifdef DOUBLE_SIDED
    if (dot(N, V) < 0.) N = -N;
  #endif
  float mat = vM.x; vec3 alb = vC; vec3 emis = vec3(0.); float gloss = 0.; float ao = 1.;
  // kind 10 is kind 0, old stone, with rime on it
  float rime = step(9.5, mat); mat *= 1. - rime;
  #ifdef TOWN
    vec2 wc = abs(vNl.x) > abs(vNl.z) ? vec2(vL.z, vL.y) : vec2(vL.x, vL.y);
    vec4 I = vI; float lampShare = vJ;
  #else
    vec2 wc = abs(N.x) > abs(N.z) ? vec2(vW.z, vW.y) : vec2(vW.x, vW.y);
    // what is no instanced house draws its own share of slid snow by the plot it stands on
    vec4 I = vec4(0., h21(floor(vW.xz / 13.)), .04, 0.); float lampShare = 0.;
  #endif
  float hs = I.x;
  float fwc = max(fwidth(wc.x), fwidth(wc.y));
  float nBig = vn(wc * .09 + hs * 31.);
  float nPatch = vn(vW.xz * .23);
  float up = N.y; float snow = 0., oakQ = 0.; vec3 spill = vec3(0.);
  vec4 dd = vec4(vQ.x, vQ.z - vQ.x, vQ.y, vQ.w - vQ.y) + (1. - vE) * 100.;
  float wear = (1. - smoothstep(.03, .2, min(min(dd.x, dd.y), min(dd.z, dd.w)))) * clamp(1.4 - fwc * 4., .35, 1.);
  if (mat < .5) {
    // old dark ashlar: courses, weathering in patches, pale rain-washed streaks, dark runs, pale worn arrises
    float row = wc.y / .46, ri = floor(row), fr = fwc / .46;
    float cx = wc.x / .92 + mod(ri, 2.) * .5 + h21(vec2(ri, 3.)) * .3;
    float near = clamp(1.2 - fr * 3., 0., 1.);
    // the courses are fine lines of shade in the joints: no block is of another tone than its neighbour; a course
    // is a little its own (four in a hundred), so that one course tells from the next
    alb *= mix(1., .985 + .03 * h21(vec2(floor(cx), ri)), near);
    alb *= .96 + .08 * h21(vec2(ri, 11.));
    alb *= 1. - .4 * max(ruled(row, .034, fr), .75 * ruled(cx, .011, fr * .5)) * (.45 + .55 * vn(wc * 1.3 + 5.));
    alb *= .74 + .52 * nBig;
    float nStreak = vn(vec2(wc.x * 1.1, wc.y * .07));
    alb = mix(alb, alb * 1.55 + .02, smoothstep(.55, .9, nStreak) * .6);
    alb *= 1. - .38 * smoothstep(.62, .95, vn(vec2(wc.x * 2.3 + 9., wc.y * .11)));
    alb = mix(alb, alb * 2.1 + .05, wear * .85);
    // (no snow falls on what stands under a roof: a face whose extra says so, a pier's top under its bridge)
    snow = smoothstep(.5, .85, up) * (.6 + .4 * nPatch) * (1. - smoothstep(.85, .95, vM.z));
    // rime: frost grown on cold courses, most in the joints and in patches, never a coat
    snow = max(snow, rime * (.07 + .2 * smoothstep(.3, .9, vn(wc * .5 + 3.)) + .28 * ruled(row, .05, fr)));
    ao = 1. - .36 * vM.z;
  } else if (mat < 1.5) {
    // lead in sheets with rolled seams; snow on the slopes that look north and west and along the crest
    // every 0.75 m a rolled seam: a line of shade at each foot of the roll, a pale crown on it; the sheets are 2.4 m
    // long and lap (a fine line of shade across each strip, strip by strip at its own height), each sheet a little
    // its own tone; a line of shade under the eaves' drip
    float sfr = fwidth(vQ.x) / .75, sf = abs(fract(vQ.x / .75) - .5), nearS = clamp(1.2 - sfr * 3., 0., 1.);
    float strip = floor(vQ.x / .75), lapY = vQ.y / 2.4 + h21(vec2(strip, 7.)), lfr = fwidth(vQ.y) / 2.4;
    alb *= .86 + .24 * nBig; alb *= 1. - .3 * ruled(vQ.x / .75, .07, sfr);
    alb *= 1. - .42 * (smoothstep(.3, .4, sf) - smoothstep(.43, .47, sf)) * nearS;
    alb *= 1. + .4 * smoothstep(.465, .5, sf) * nearS;
    alb *= mix(1., .9 + .2 * h21(vec2(strip, floor(lapY))), nearS) * (1. - .3 * ruled(lapY, .02, lfr) * nearS);
    alb *= 1. - .3 * (1. - smoothstep(.04, .2, vQ.y)) * vE.z * nearS;
    // snow on the slopes that look north and west (not on a face too steep to hold it): it has slid from the
    // smooth lead and lies in the seams, against every roll, and deeper toward the slope's foot. ON THE SUNWARD
    // SLOPES WHAT IS LEFT OF IT lies in broken lengths against the rolls and in a ragged band at the slope's foot
    float lee = smoothstep(.05, .35, dot(N, vec3(-.38, 0., -.92))) * smoothstep(.22, .45, up);
    float foot = 1. - smoothstep(.1, .62, vQ.y / max(vQ.w, 1.) + (nPatch - .5) * .3);
    float inSeam = smoothstep(.2, .36, sf + (vn(vec2(vQ.x * .9, vQ.y * .35)) - .5) * .22) * mix(.55, 1., nearS);
    snow = max(lee * max(inSeam * (.72 + .28 * nPatch), foot * .9), (1. - smoothstep(.2, .9, vQ.w - vQ.y)) * vE.w);
    float left = smoothstep(.34, .44, sf + (vn(vec2(vQ.x * .9, vQ.y * .35)) - .5) * .2) * smoothstep(.42, .62, vn(vec2(strip * .37 + 3., vQ.y * .21)));
    float band = (1. - smoothstep(.02, .3, vQ.y / max(vQ.w, 1.) + (vn(vec2(vQ.x * .45, 9.)) - .5) * .22)) * smoothstep(.3, .55, vn(vec2(vQ.x * .23 + 5., 3.)));
    snow = max(snow, (1. - lee) * smoothstep(.22, .45, up) * max(left * mix(.4, .9, nearS), band * .85));
    snow = max(snow, smoothstep(.75, .95, up));
    gloss = 1.; ao = 1. - .5 * vM.z;
  } else if (mat < 2.5) {
    // tile or slate in courses; snow by the slope's facing and the house's own draw, the ridge white, thawed at the chimney
    float tr = vQ.y / .32, tfr = fwidth(vQ.y) / .32, near = clamp(1.2 - tfr * 3., 0., 1.);
    float tx = vQ.x / .25 + mod(floor(tr), 2.) * .5;
    // aM.z: 1 a bare patch at a chimney, 2 one long roof over a row of houses (the far town), 3 a landmark's great
    // roof or coping (it holds its snow as one roof, not house by house: only a narrow ragged band has slid from its
    // eaves), 4 a tower's cone (see below)
    float patchQ = step(.5, vM.z) * step(vM.z, 1.5), greatQ = step(2.5, vM.z), coneQ = step(3.5, vM.z), rowQ = step(1.5, vM.z) * (1. - greatQ);
    // A HOUSE'S ROOF HAS ITS OWN STATE (I.w, the world's: 0 on every roof but the southern bank's houses'): 1 the
    // snow lies thick on it to the eaves; 2 it has half slid (see below: it keeps its snow in broken patches, and
    // what is bared is a red-brown tile or a grey slate, weathered in streaks); 3 a roof of lead-grey sheets with
    // rolled seams, from which the snow slides to lie in a broken band at the slope's foot; 4 an old roof with a
    // faint green cast of moss on its dark tile or slate, a little more toward the eaves, with no pattern of its own
    float thickQ = step(.5, I.w) * step(I.w, 1.5), halfQ = step(1.5, I.w) * step(I.w, 2.5), leadQ = step(2.5, I.w) * step(I.w, 3.5), mossQ = step(3.5, I.w);
    float pl = vQ.x / 6.5 + h21(floor(vW.xz / 60.)) * 5., pfr = fwidth(vQ.x) / 6.5, party = ruled(pl, .025, pfr) * rowQ;
    float keep = mix(mix(I.y, h21(vec2(floor(pl), floor(vW.z / 9.))), rowQ), .72, greatQ);
    keep = mix(keep, .92 + .08 * I.y, thickQ); keep = mix(keep, .35 * I.y, max(halfQ, leadQ)); keep = mix(keep, .25 + .4 * I.y, mossQ);
    float sfr = fwidth(vQ.x) / .75, sf = abs(fract(vQ.x / .75) - .5), nearS = clamp(1.2 - sfr * 3., 0., 1.);
    float sheet = (1. - .3 * ruled(vQ.x / .75, .07, sfr)) * (1. - .36 * (smoothstep(.3, .4, sf) - smoothstep(.43, .47, sf)) * nearS) * (1. + .35 * smoothstep(.465, .5, sf) * nearS);
    alb *= mix(mix(1., .78 + .44 * h21(vec2(floor(tx), floor(tr)) + hs * 91.), near) * (1. - .32 * ruled(tr, .1, tfr)), sheet, leadQ);
    alb *= (.8 + .4 * nBig) * mix(1., .75 + .5 * h21(vec2(floor(pl), 5.)), rowQ);
    alb = mix(alb, alb * vec3(.86, .98, .78) + vec3(.0, .008, .0), mossQ * (1. - patchQ) * (.35 + .2 * (1. - vQ.y / max(vQ.w, 1.))));
    // WHAT A HALF-SLID ROOF BARES goes by the roof's own colour at the place: a red-brown tile where it is redder
    // than it is blue (whole tile from 0.05 redder on; its blue taken down, so that the sky's light in the shade
    // never turns it plum), a grey slate where it is not. So a tiled roof bares tile and a blue slate roof slate;
    // a slate roof whose own hue is on the brown side bares a slate that has the tile's tone in it, the more the
    // browner the roof. WEATHERED IN STREAKS down the slope by the house's own draw (0.78 to 1.22 of its tone, a
    // metre broad and some three long), its courses showing as on every roof
    float tileQ = smoothstep(0., .05, alb.r - alb.b);
    alb = mix(alb, mix(vec3(dot(alb, vec3(.3, .5, .2))) * vec3(1.03, 1., .96), alb * vec3(1.02, .88, .68), tileQ) * (.78 + .44 * vn(vec2(vQ.x * 1.1 + hs * 13., vQ.y * .3))), halfQ * (1. - patchQ));
    float lee = smoothstep(-.15, .3, dot(N, vec3(-.38, 0., -.92)));
    // thick on the slopes that look north and west, thinner and patchy on the sunward ones; and by each house's own
    // draw the snow has slid from the eaves, a ragged band of bare roof below it (broader on the sunward slopes)
    // (and the steeper a house's slope, the less it holds; a cone's skirt keeps its snow)
    float slid = (1. - keep) * 3.1 - lee * 1.1 + (nPatch - .5) * 1.7 + (vn(vW.xz * .9) - .5) * .5 + (1. - smoothstep(.5, .76, up)) * 1.8 * (1. - greatQ) * (1. - thickQ) - coneQ * 4.;
    slid += halfQ * (.9 + (1. - lee) * (1.6 + 2.4 * fract(hs * 9.3))) + leadQ * (2.2 + 2. * fract(hs * 9.3)) - thickQ * 1.5;
    snow = smoothstep(.38, .6, lee * .4 + keep * .3 + nPatch * .35 + .2) * smoothstep(slid - .2, slid + .2, vQ.y);
    // A HALF-SLID ROOF KEEPS ITS SNOW IN BROKEN PATCHES over a third to a half of each slope, by the house's own
    // numbers: A BAND UNDER THE RIDGE, ragged at its lower edge (0.24 to 0.32 of the slope on the sunward side,
    // 0.27 to 0.37 on the side that looks north and west), A RAGGED BROKEN LINE AT THE EAVES (0.05 to 0.15 of the
    // slope, four lengths in five of the eaves) and A FEW LONG PATCHES ACROSS THE SLOPE between them where the slab
    // has held (about a twelfth of the slope between). Counted on 4000 roofs by this law: the middle roof keeps its
    // snow on 0.44 of a sunward slope and 0.48 of the other, eight roofs in ten on 0.36 to 0.56. A LEAD ROOF keeps
    // a broken band at each slope's foot (0.1 to 0.26 of the slope, two lengths in three of the eaves), where what
    // slid from the sheets lies. No roof is wholly bare
    float hnR = vQ.y / max(vQ.w, 1.), ragA = vn(vec2(vQ.x * .55, hs * 23. + 1.)), ragB = vn(vec2(vQ.x * 1.7, hs * 41. + 3.));
    float ridgeS = smoothstep(-.03, .03, hnR - 1. + mix(.24 + .08 * I.y, .27 + .1 * I.y, lee) + (ragA - .5) * .16 + (ragB - .5) * .06);
    float eavesS = (1. - smoothstep(-.02, .03, hnR - .05 - .1 * ragB)) * smoothstep(.2, .4, vn(vec2(vQ.x * .35 + 7., hs * 17.)));
    float midS = smoothstep(.76, .84, vn(vQ.xy * vec2(.24, 1.4) + hs * 40. + I.y * 9.));
    snow = mix(snow, max(max(ridgeS, eavesS), midS), halfQ * (1. - patchQ) * (1. - coneQ));
    snow = max(snow, leadQ * (1. - patchQ) * (1. - smoothstep(-.03, .03, hnR - .1 - .16 * ragA)) * smoothstep(.25, .45, vn(vec2(vQ.x * .3 + 3., hs * 29.))));
    // A TOWER'S CONE: its slates are dark and steep, and the snow does not lie on them as on a roof. It lies on the
    // WEATHER SIDE (the faces that look north and west) from the skirt to a little over half way up, ragged at its
    // upper edge; on the other faces only in STREAKS down the slates (narrow tongues some 0.6 m apart, thinning
    // upward) and in a thin line along the skirt; the steep upper cone is bare slate all round
    if (coneQ > .5) {
      float hn = vQ.y / max(vQ.w, 1.), wth = smoothstep(.05, .5, dot(N, vec3(-.38, 0., -.92)));
      float streak = smoothstep(.56, .74, vn(vec2((vW.x * .8 + vW.z * .6) * 1.7, vW.y * .16))) * (1. - smoothstep(.3, .78, hn + (nPatch - .5) * .2));
      snow = max(max(wth * (1. - smoothstep(.46, .66, hn + (nPatch - .5) * .32)), streak * (.55 + .4 * wth)), 1. - smoothstep(.03, .075, hn));
    }
    snow = max(snow, (1. - smoothstep(.25, .8, vQ.w - vQ.y)) * vE.w);
    // UNDER THE SNOW A ROOF IS STILL A ROOF (each of these only where it is broader than the grain): the courses
    // print through it; under the ridge's cap runs the ridge's own line of shade; on two roofs in three the slab has
    // slipped a hand and left a dark crack across the slope (at the roof's own height); here and there a small bare
    // place where it has broken away
    snow *= 1. - .22 * ruled(tr, .1, tfr) * near;
    float housey = (1. - greatQ) * (1. - rowQ) * (1. - patchQ), rd = vQ.w - vQ.y;
    snow *= 1. - .6 * smoothstep(.2, .27, rd) * (1. - smoothstep(.33, .42, rd)) * vE.w * near * housey;
    float crackY = vQ.w * (.3 + .38 * fract(hs * 7.7 + I.y * 3.1)) + .4 * (vn(vec2(vQ.x * .7, hs * 31. + I.y * 17.)) - .5);
    snow *= 1. - .8 * (1. - smoothstep(.03, .09 + tfr * .32, abs(vQ.y - crackY))) * step(.34, fract(hs * 3.3 + I.y * 5.7)) * near * housey;
    snow *= 1. - .9 * smoothstep(.79, .86, vn(vQ.xy * vec2(1.3, .8) + hs * 40. + I.y * 9.)) * near * housey;
    // the roof's own edge shows dark under the snow's lip at the eaves and the verges (a cone has eaves and no verge)
    snow *= mix(smoothstep(.1, .26, min(vQ.y, mix(min(vQ.x, vQ.z - vQ.x), 1., coneQ))), 1., patchQ);
    // a bare patch where a chimney warms the tiles (a small quad of its own, soft at its rim)
    snow *= 1. - patchQ * smoothstep(0., .45, min(min(vQ.x, vQ.z - vQ.x), min(vQ.y, vQ.w - vQ.y)) + (nPatch - .5) * .3);
    // a row's party walls stand a hand over its roof, a dark line through the snow; a chimney's dark foot by each
    float chim = (1. - smoothstep(.05, .08 + pfr, abs(fract(pl) - .3))) * (1. - smoothstep(.45, .6, abs(vQ.w - vQ.y - 1.1))) * rowQ;
    snow *= 1. - max(party * .75, chim);
    alb *= 1. - .5 * max(party, chim);
  } else if (mat < 3.5) {
    // plaster between oak posts, rails and braces; casements, a few of them warm
    // a wall quad holds vM.y storeys (one where each storey is its own quad); the bays divide its breadth evenly
    float sth = vQ.w / max(vM.y, 1.), st = vQ.y / max(sth, .5), si = floor(st), sf = fract(st);
    float nb = max(floor(vQ.z / 1.45 + .5), 1.), bw = max(vQ.z, .5) / nb;
    float bx = vQ.x / bw, bi = floor(bx), bf = fract(bx), fr = fwidth(vQ.x) / bw;
    float near = clamp(1.2 - fr * 3., 0., 1.);
    float hb = h21(vec2(bi, si) + hs * 57.);
    float brace = step(.72, hb) * (1. - smoothstep(.05, .06 + fr * 2., abs(bf - (hb > .86 ? sf : 1. - sf)))) * near;
    float timber = max(max(ruled(bx, .07, fr), ruled(st, .045, fwidth(vQ.y) / max(sth, .5))), brace) * vM.z;
    // casements by each house's own draw: their breadth, their height, how many bays have one; a door at the foot
    float hw2 = h21(vec2(hs * 41., 7.)), wwid = .15 + .1 * hw2, whgt = .13 + .08 * h21(vec2(hs * 23., 3.));
    vec2 wq = vec2(bf - .5, sf - .5);
    float win = step(hb, .26 + .3 * hw2) * (1. - smoothstep(wwid, wwid + .01 + fr, abs(wq.x))) * (1. - smoothstep(whgt, whgt + .01 + fr, abs(wq.y + .04)));
    float door = step(si, .5) * step(.8, h21(vec2(bi, 9.) + hs * 17.)) * (1. - smoothstep(.27, .28 + fr, abs(wq.x))) * (1. - smoothstep(.68, .7, sf));
    float bars = max(1. - smoothstep(.02, .03 + fr, abs(wq.x)), 1. - smoothstep(.015, .025 + fr, abs(wq.y))) * near;
    // plaster: each panel a little its own, damp and dark toward the foot, in the eaves' shade at the top, and a
    // band of shade under every jettied storey
    alb *= mix(1., .88 + .24 * h21(vec2(bi + 11., si) + hs * 3.), near * vM.z);
    alb *= .82 + .36 * nBig;
    alb *= 1. - .3 * smoothstep(.55, .9, vn(vec2(wc.x * 1.7 + hs * 5., wc.y * .12)));
    alb *= mix(.6, 1., smoothstep(0., 6.5, vQ.y)) * mix(.74, 1., smoothstep(0., .9, vQ.w - vQ.y));
    alb *= 1. - .3 * smoothstep(.7, 1., sf) * step(si + 1.5, max(vM.y, 1.)) * vM.z;
    alb = mix(alb, vec3(.125, .118, .11) * (.75 + .5 * nBig), timber * .93);
    float warm = step(1. - I.z, h21(vec2(bi + 3., si) + hs * 7.3));
    win *= 1. - door;
    alb = mix(alb, mix(vec3(.028, .031, .042), vec3(.09, .08, .072), bars), win);
    alb = mix(alb, vec3(.075, .06, .05) * (.7 + .6 * vn(vec2(vQ.x * 9., vQ.y * .8))), door * vM.z);
    emis = vec3(1., .46, .13) * 3. * win * warm * (1. - .7 * bars);
    // A LAMP BEHIND A CASEMENT (lampShare, the world's: how many of this house's casements have one; steady, by the
    // casement's own place on its wall and the house's draw): its glass is the brighter, and its light lies on the
    // sill and on the wall under it, a hand to either side
    float lamp = step(1. - lampShare, h21(vec2(bi + 17., si + 5.) + hs * 13.1)) * step(hb, .26 + .3 * hw2) * (1. - door);
    if (lamp > .5) {
      emis = max(emis, vec3(1.2, .62, .2) * 3.4 * win * (1. - .6 * bars));
      float sx = max(abs(wq.x) - wwid, 0.) / .2, sy = (-(wq.y + .04) - whgt) / .3;
      spill = vec3(2.6, 1.25, .4) * (1. - win) * exp(-sx * sx * 4.) * smoothstep(-.12, 0., sy) * exp(-max(sy, 0.) * 2.6) * (1. - smoothstep(.36, .5, abs(wq.x)));
    }
    snow = smoothstep(.5, .85, up) * .85;
  } else if (mat < 4.5) {
    // cobbles with trodden snow; vM.z says how much snow lies (lanes little, yards and the square more)
    vec2 g = vW.xz / .3; float gfr = max(fwidth(g.x), fwidth(g.y)), near = clamp(1.2 - gfr * 2., 0., 1.);
    g.x += mod(floor(g.y), 2.) * .5;
    vec2 gf = abs(fract(g) - .5);
    alb *= mix(1., .7 + .6 * h21(floor(g)), near);
    alb *= 1. - .4 * smoothstep(.3, .48, max(gf.x, gf.y)) * near;
    alb *= .75 + .5 * nPatch;
    snow = smoothstep(.42, .7, vn(vW.xz * .11) * .65 + nPatch * .35 + vM.z * .55 - .1);
  } else if (mat < 5.5) {
    alb *= .65 + .7 * vn(vec2(wc.x * 9., wc.y * .7));
    snow = smoothstep(.55, .85, up) * .9;
    #ifdef SWAY
      // a hoar-frost morning whitens every twig and pole
      snow = max(snow, uHoar * (.55 + .4 * nPatch));
    #else
      // (its extra: how deep in a hollow it stands; 2: the bell frames' old oak in the towers' hollow: dark brown,
      // under a roof, so that no snow lies on it; its upper faces are worn and dusted paler)
      oakQ = step(1.5, vM.z);
      ao = 1. - .4 * mix(vM.z, .25, oakQ); snow *= 1. - oakQ;
      alb *= 1. + .9 * oakQ * smoothstep(.3, .9, up);
    #endif
  } else if (mat < 6.5) {
    // dark jewel glass in a web of lead: cells of deep colour that make no picture
    vec2 q = vec2(wc.x + wc.y * .5, wc.y) / .21; vec2 qi = floor(q); float hc = h21(qi), fr = fwc / .21, near = clamp(1.2 - fr * 2., 0., 1.);
    vec3 jewel = hc < .42 ? vec3(.02, .045, .17) : hc < .7 ? vec3(.15, .02, .03) : hc < .86 ? vec3(.02, .09, .07) : vec3(.17, .12, .03);
    jewel = mix(vec3(.03, .031, .042), jewel * (.3 + .5 * h21(qi + 7.)), near);
    alb = mix(jewel, vec3(.012), max(ruled(q.x, .09, fr), ruled(q.y, .09, fr)));
    gloss = 2.5;
  } else if (mat < 7.5) {
    // plain, without gloss; its extra is read by nothing here (a pennon's cloth carries in it how free it is to stir)
    alb *= .92 + .12 * nPatch;
  } else if (mat < 8.5) {
    emis = vC * 3.; alb = vec3(.02);
  } else {
    // bell metal: it takes a broad dull shine and mirrors the bright east
    alb *= .92 + .12 * nPatch;
    gloss = 1.3;
  }
  // snow: a pale grey-white, drifted in long soft shades
  float sn = clamp(snow, 0., 1.) * uSnow, drift = vn(vW.xz * .6 + vW.y * .8);
  alb = mix(alb, vec3(.8, .83, .88) * (.9 + .14 * drift), sn);
  // the light: the sun above the edge and outside every standing shadow, the sky's fill everywhere
  float lit = smoothstep(uEdge - 1.25, uEdge + 1.25, vW.y) * smoothstep(vShade - .7, vShade + .7, vW.y) * getShadowMask();
  float nds = dot(N, uSunDir), ndl = max(nds, 0.);
  // snow is no smooth face: its drifts turn small slopes to a sun that only grazes it, so that sunlit snow is rose
  // where a smooth face would hardly be lit (and never where the face looks away from the sun)
  ndl = mix(ndl, min(ndl + (.24 + .24 * drift) * smoothstep(-.12, .06, nds), 1.), sn);
  vec3 sunH = normalize(vec3(uSunDir.x, 0., uSunDir.z) + vec3(1e-5, 0., 0.));
  float east = dot(N, sunH);
  vec3 amb = mix(uGndCol, uSkyCol, up * .5 + .5) * (.9 + .1 * east) + vec3(.07, .035, .01) * max(east, 0.);
  // LIGHT IN THE SHADE ON OLD STONE, by the height of the place alone (no eye, no clock): the snow that lies under
  // a wall throws its pale light up it, warm beside the sky's blue, strongest in the courses next to the snow and
  // gone a few storeys up: the town's snow (its ground's and its roofs', to y 12) for every wall, and the snow of
  // the great church's platform (y 46, over the west block's own plan) for the towers that stand on it; higher
  // up the sky's own fill is a deeper blue. A face the sun strikes keeps its own law (ONE STONE, below)
  float towerQ = step(-3., vW.x) * step(vW.x, 16.) * step(abs(vW.z), 23.5) * smoothstep(42.5, 47., vW.y);
  float nearSnow = max(exp(-max(vW.y - 12., 0.) / 13.), towerQ * exp(-max(vW.y - 46., 0.) / 6.5));
  // (the same light for what hangs and stands within the towers: the bell frames' oak and the bell metal)
  float shadeQ = max(1. - step(.5, mat), max(oakQ, step(8.5, mat))) * (1. - sn) * (1. - lit * smoothstep(0., .2, ndl));
  amb = mix(amb, amb * mix(vec3(.8, .87, 1.03), vec3(1.), nearSnow) + vec3(.2, .155, .115) * nearSnow * clamp(1. - up, 0., 1.), shadeQ);
  // THE TWO TOWERS' STONE IN THE SHADE (a law of the place: over the west block's own plan, coming in up the front
  // from y 30 and whole from y 50, so that no line shows where it begins) is the church's own stone in the sky's
  // cold fill, of one hue with every other shaded stone of the church; only ITS RELIEF IS DEEPER there: what stands
  // in a hollow is the darker by the hollows' own measure, so that a course, a shaft and a moulding tell.
  // WHERE THE LOW SUN TAKES A FACE OR AN EDGE (below, at the sum) the same stone is a warm cream turning to gold
  float towerStone = step(-3., vW.x) * step(vW.x, 16.) * step(abs(vW.z), 23.5) * smoothstep(30., 50., vW.y) * (1. - step(.5, mat)) * (1. - sn);
  amb = mix(amb, amb * (1. - .22 * vM.z), towerStone * (1. - lit * smoothstep(0., .2, ndl)));
  // BELL METAL hangs in the towers' shade and mirrors the warm east that looks in at the openings: a soft warm
  // light lies on it, most on its shoulder
  amb = mix(amb, amb * .5 + vec3(.62, .45, .25) * (.55 + .7 * clamp(up + .3, 0., 1.)), step(8.5, mat));
  // ONE STONE: where the sun strikes old dark stone it is the same dark stone turned rose gold, not a pale one: on
  // the struck face the sky's cold fill counts for half (the eye, full of the sun's gold, no longer sees the blue)
  float stoneLit = (1. - step(.5, mat)) * (1. - sn) * lit * smoothstep(0., .2, ndl);
  // (WITHIN A TOWER'S HOLLOW AND BEHIND ITS BOARDED OPENINGS, a place: inside the three walls that wear slate boards,
  // not the wall toward the gap, which wears none. The sun comes there only between the boards, broken: stone and
  // oak take half of it and their edges' glints a quarter, so that in a boarded opening the bell metal is the
  // brightest thing)
  float hollowQ = step(-.2, vW.x) * step(vW.x, 14.2) * step(8.1, abs(vW.z)) * step(abs(vW.z), 20.7) * step(46.9, vW.y) * step(vW.y, 66.2);
  vec3 col = alb * (uSunCol * ndl * lit * (1. - .1 * stoneLit) * (1. - .5 * hollowQ * step(mat, 5.5)) + amb * ao * (1. - .5 * stoneLit));
  col = mix(col, col * vec3(1.26, 1.27, 1.16) + vec3(.02, .016, .008), stoneLit * towerStone);
  // against the light: a sunlit face that the eye sees edge-on, looking toward the sun, glares in a thin gold rim
  // (a ridge, a ledge, a shaft, a crown's snow), by the same edge and the same standing shadows as all sunlight
  float sunward = clamp(dot(-V, uSunDir), 0., 1.);
  float graze = pow(clamp(1. - abs(dot(N, V)), 0., 1.), 4.) * smoothstep(-.12, .1, nds) * sunward * sunward;
  col += uSunCol * (alb * 1.2 + .04) * graze * lit * (1. + 1.5 * sn) * (1. - .8 * hollowQ);
  // the sun-grazed arris: a worn edge is round, and where the face beyond it stands in the sun the edge's own turn
  // catches the light as a thin gold line (a ledge's snow lip the more). The standing shadows are asked at the place
  // half a metre beyond the edge, so that no arris glows whose neighbour face is itself in shade
  #if defined(USE_SHADOWMAP) && NUM_DIR_LIGHT_SHADOWS > 0
  {
    // (an arris is a hand's breadth of light, 0.16 m: where the eye is too far to see so thin a line, the line it is
    // drawn as is broader and so much the fainter, and a far front full of edges keeps its own tone)
    vec4 aw = max(vec4(.16), vec4(fwidth(vQ.xx), fwidth(vQ.yy)) * 1.6);
    vec4 ar = 1. - smoothstep(vec4(0.), aw, dd), ae = ar * (.16 / aw);
    float arris = max(max(ae.x, ae.y), max(ae.z, ae.w));
    if (arris > .02) {
      vec3 dWx = dFdx(vW), dWy = dFdy(vW);
      vec3 Ts = dWx * dFdx(vQ.x) + dWy * dFdy(vQ.x), Tt = dWx * dFdx(vQ.y) + dWy * dFdy(vQ.y);
      vec3 D = Ts * inversesqrt(max(dot(Ts, Ts), 1e-12)) * (ar.y - ar.x) + Tt * inversesqrt(max(dot(Tt, Tt), 1e-12)) * (ar.w - ar.z);
      D *= inversesqrt(max(dot(D, D), 1e-8));
      float nd2 = dot(D, uSunDir) + (.24 + .24 * drift) * uSnow * smoothstep(.6, .9, D.y);
      if (nd2 > 0.) {
        float gxx = dot(dWx, dWx), gxy = dot(dWx, dWy), gyy = dot(dWy, dWy), det = max(gxx * gyy - gxy * gxy, 1e-12);
        float rx = dot(dWx, D) * .5, ry = dot(dWy, D) * .5;
        vec2 st = clamp(vec2(gyy * rx - gxy * ry, gxx * ry - gxy * rx) / det, -24., 24.);
        vec4 sc = vDirectionalShadowCoord[0] + dFdx(vDirectionalShadowCoord[0]) * st.x + dFdy(vDirectionalShadowCoord[0]) * st.y;
        float sh2 = getShadow(directionalShadowMap[0], directionalLightShadows[0].shadowMapSize, directionalLightShadows[0].shadowIntensity,
          directionalLightShadows[0].shadowBias, directionalLightShadows[0].shadowRadius, sc);
        float edgeLit = smoothstep(uEdge - 1.25, uEdge + 1.25, vW.y) * smoothstep(vShade - .7, vShade + .7, vW.y);
        col += uSunCol * (alb * 1.4 + .12) * min(nd2, 1.) * arris * edgeLit * sh2 * 1.9 * (1. - .75 * hollowQ);
      }
    }
  }
  #endif
  // NOTHING THE SUN STRIKES IS DRAWN AS WHITE: the lit sum lies under a soft shoulder (from .5 up, .9 at the most),
  // each channel alike, so that sunlit snow, plaster and rimed twigs keep their drifts and their form
  col = mix(col, .5 + .4 * (1. - exp(-(col - .5) / .4)), step(.5, col));
  if (gloss > 0.) {
    vec3 R = reflect(-V, N);
    // lead shines broad and dull; dark glass takes the sun as one small glint that runs from pane to pane as the
    // eye goes by; both mirror the sky at a glancing look, and the bright east where they look toward it
    float glassQ = step(2., gloss), rs = clamp(dot(R, uSunDir), 0., 1.);
    float s = mix(pow(rs, 14.) * .22 * gloss, pow(rs, 90.) * 2.2, glassQ);
    float fres = pow(clamp(1. - dot(N, V), 0., 1.), 3.);
    float eastR = pow(clamp(dot(normalize(R.xz + vec2(1e-5, 0.)), sunH.xz), 0., 1.), 3.) * (1. - clamp(R.y, 0., 1.));
    col += uSunCol * lit * (s + .1 * ndl * (1. - glassQ)) + (uSkyCol * .12 + vec3(.5, .34, .2) * eastR) * fres * ao;
  }
  vec3 pd = uPortalPos - vW; float pl = dot(pd, pd);
  col += alb * uPortalCol * max(dot(N, pd * inversesqrt(max(pl, 1e-4))), 0.) / (1. + pl * .035);
  col += emis + alb * spill;
  float fog = 1. - exp(-uFogDen * uFogDen * dist * dist);
  float toSun = pow(clamp(dot(-V, sunH), 0., 1.), 4.), toSunWide = pow(clamp(dot(-V, sunH), 0., 1.), 1.5);
  // a cold haze lies low in the lanes and over the water: what is nearer and higher stands out of it. Toward the sun
  // the air itself shows the light: the haze low over the roofs is warm and brighter there, cold blue away from it
  float low = (1. - exp(-dist * .003)) * (1. - smoothstep(-5., 17., vW.y)) * .5;
  col = mix(col, mix(vec3(.3, .4, .66), vec3(1.05, .74, .46), toSunWide * .8), low);
  low = (1. - exp(-dist * .0016)) * (1. - smoothstep(10., 46., vW.y)) * toSunWide * .42;
  col = mix(col, vec3(1.1, .78, .5), low);
  gl_FragColor = vec4(mix(col, mix(uFogCol, uFogWarm, toSun), fog), 1.);
}`;function Vt(t={}){const o=(a,s=1)=>new L.Color(a).multiplyScalar(s);return{uEdge:{value:t.edge??30},uTime:{value:0},uFogDen:{value:t.fog??75e-5},uSnow:{value:t.snow??1},uHoar:{value:t.hoar??0},uSunDir:{value:(t.sunDir?t.sunDir.clone():new L.Vector3(.92,.087,.382)).normalize()},uSunCol:{value:new L.Color().setRGB(2.5,1.3,.56)},uSkyCol:{value:new L.Color().setRGB(.33,.46,.86)},uGndCol:{value:new L.Color().setRGB(.3,.36,.58)},uFogCol:{value:o("#a9b7d9")},uFogWarm:{value:o("#f6cfa2")},uPortalPos:{value:new L.Vector3(0,-900,0)},uPortalCol:{value:o("#ffb45e",0)}}}function Ut(t,o={}){const a={};return o.town&&(a.TOWN=1),o.shadeQ&&(a.SHADEQ=1),o.sway&&(a.SWAY=1),new L.ShaderMaterial({uniforms:{...L.UniformsUtils.clone(L.UniformsLib.lights),...t},vertexShader:Dt,fragmentShader:Lt+Gt,lights:!0,defines:a,side:o.side??L.FrontSide})}function it(){let t=512,o=0,a=new Float32Array(t*3),s=new Float32Array(t*3),l=new Float32Array(t*3),h=new Float32Array(t*3),e=new Float32Array(t*4),c=new Uint32Array(1024),i=0,n=.5,f=.5,r=.5,d=0,p=0,m=0,u=0,w=0,b=0,Q=1,M=0,O=null,B=null;const V=[],H=()=>{V.push([a,s,l,h,e,m-o]),o=m,t=Math.min(t*2,16384),a=new Float32Array(t*3),s=new Float32Array(t*3),l=new Float32Array(t*3),h=new Float32Array(t*3),e=new Float32Array(t*4)},$=()=>{const v=new Uint32Array(c.length*2);v.set(c),c=v},P={col(v,x=1){return n=v[0]*x,f=v[1]*x,r=v[2]*x,P},mat(v,x=0){return d=v,p=x,P},shade(v){return O=v,P},weights(v,x,I,k){return B=[v,x,I,k],P},at(v=0,x=0,I=0,k=0){return u=v,w=x,b=I,Q=Math.cos(k),M=Math.sin(k),P},get tris(){return i/3},get corners(){return m},matState(){return[d,p]},quad(v,x,I,k,W=0){const q=u+v[0]*Q+v[2]*M,_=w+v[1],N=b-v[0]*M+v[2]*Q,G=u+x[0]*Q+x[2]*M,g=w+x[1],T=b-x[0]*M+x[2]*Q,U=u+I[0]*Q+I[2]*M,S=w+I[1],E=b-I[0]*M+I[2]*Q,A=u+k[0]*Q+k[2]*M,D=w+k[1],Y=b-k[0]*M+k[2]*Q,J=G-q,nt=g-_,rt=T-N,lt=A-q,z=D-_,F=Y-N;let st=nt*F-rt*z,ot=rt*lt-J*F,C=J*z-nt*lt;const ut=Math.hypot(st,ot,C)||1;st/=ut,ot/=ut,C/=ut;const wt=Math.hypot(J,nt,rt),St=Math.hypot(lt,z,F),xt=O===null?St:O;m-o+4>t&&H(),i+6>c.length&&$();let R=(m-o)*3;a[R]=q,a[R+1]=_,a[R+2]=N,a[R+3]=G,a[R+4]=g,a[R+5]=T,a[R+6]=U,a[R+7]=S,a[R+8]=E,a[R+9]=A,a[R+10]=D,a[R+11]=Y;for(let Qt=0;Qt<4;Qt++,R+=3)s[R]=st,s[R+1]=ot,s[R+2]=C,l[R]=n,l[R+1]=f,l[R+2]=r,h[R]=d,h[R+1]=W,h[R+2]=B?B[Qt]:p;return B=null,R=(m-o)*4,e[R+2]=wt,e[R+3]=xt,e[R+4]=wt,e[R+6]=wt,e[R+7]=xt,e[R+8]=wt,e[R+9]=St,e[R+10]=wt,e[R+11]=xt,e[R+13]=St,e[R+14]=wt,e[R+15]=xt,c[i]=m,c[i+1]=m+1,c[i+2]=m+2,c[i+3]=m,c[i+4]=m+2,c[i+5]=m+3,i+=6,m+=4,P},tri(v,x,I){const k=u+v[0]*Q+v[2]*M,W=w+v[1],q=b-v[0]*M+v[2]*Q,_=u+x[0]*Q+x[2]*M,N=w+x[1],G=b-x[0]*M+x[2]*Q,g=u+I[0]*Q+I[2]*M,T=w+I[1],U=b-I[0]*M+I[2]*Q,S=_-k,E=N-W,A=G-q,D=g-k,Y=T-W,J=U-q;let nt=E*J-A*Y,rt=A*D-S*J,lt=S*Y-E*D;const z=Math.hypot(nt,rt,lt)||1;nt/=z,rt/=z,lt/=z;const F=Math.hypot(S,E,A),st=Math.hypot(D,Y,J),ot=O===null?st:O;m-o+4>t&&H(),i+6>c.length&&$();let C=(m-o)*3;a[C]=k,a[C+1]=W,a[C+2]=q,a[C+3]=_,a[C+4]=N,a[C+5]=G,a[C+6]=g,a[C+7]=T,a[C+8]=U;for(let ut=0;ut<3;ut++,C+=3)s[C]=nt,s[C+1]=rt,s[C+2]=lt,l[C]=n,l[C+1]=f,l[C+2]=r,h[C]=d,h[C+2]=p;return C=(m-o)*4,e[C+2]=F,e[C+3]=ot,e[C+4]=F,e[C+6]=F,e[C+7]=ot,e[C+8]=F*.5,e[C+9]=st,e[C+10]=F,e[C+11]=ot,c[i]=m,c[i+1]=m+1,c[i+2]=m+2,i+=3,m+=3,P},box(v,x,I,k,W,q,_=15,N=63){return N&1&&P.quad([v,x,I],[v,x,q],[v,W,q],[v,W,I],_),N&2&&P.quad([k,x,q],[k,x,I],[k,W,I],[k,W,q],_),N&4&&P.quad([v,x,I],[k,x,I],[k,x,q],[v,x,q],_),N&8&&P.quad([v,W,q],[k,W,q],[k,W,I],[v,W,I],_),N&16&&P.quad([k,x,I],[v,x,I],[v,W,I],[k,W,I],_),N&32&&P.quad([v,x,q],[k,x,q],[k,W,q],[v,W,q],_),P},taper(v,x,I,k,W,q,_,N,G=3,g=!0){const T=(U,S,E)=>[v+U*(E?_:W),E?k:I,x+S*(E?N:q)];return P.quad(T(-1,-1,0),T(-1,1,0),T(-1,1,1),T(-1,-1,1),G),P.quad(T(1,1,0),T(1,-1,0),T(1,-1,1),T(1,1,1),G),P.quad(T(1,-1,0),T(-1,-1,0),T(-1,-1,1),T(1,-1,1),G),P.quad(T(-1,1,0),T(1,1,0),T(1,1,1),T(-1,1,1),G),g&&_>.01&&N>.01&&P.quad(T(-1,1,1),T(1,1,1),T(1,-1,1),T(-1,-1,1),15),P},cyl(v,x,I,k,W,q,_=8,N={}){const G=N.a0??0,g=N.a1??Math.PI*2,T=N.phase??0;for(let U=0;U<_;U++){const S=T+G+(g-G)*U/_,E=T+G+(g-G)*(U+1)/_,A=Math.cos(S),D=Math.sin(S),Y=Math.cos(E),J=Math.sin(E);q>.005?P.quad([v+Y*W,I,x+J*W],[v+A*W,I,x+D*W],[v+A*q,k,x+D*q],[v+Y*q,k,x+J*q],N.fl??0):P.tri([v+Y*W,I,x+J*W],[v+A*W,I,x+D*W],[v,k,x]),N.cap&&q>.005&&P.tri([v,k,x],[v+Y*q,k,x+J*q],[v+A*q,k,x+D*q])}return P},beam(v,x,I,k,W=15,q=!1,_=[0,1,0]){let N=x[0]-v[0],G=x[1]-v[1],g=x[2]-v[2];const T=Math.hypot(N,G,g)||1;N/=T,G/=T,g/=T;let U=_[0],S=_[1],E=_[2];Math.abs(N*U+G*S+g*E)>.96&&(U=1,S=0,E=0);let A=G*E-g*S,D=g*U-N*E,Y=N*S-G*U;const J=Math.hypot(A,D,Y)||1;A/=J,D/=J,Y/=J;const nt=D*g-Y*G,rt=Y*N-A*g,lt=A*G-D*N,z=(F,st,ot)=>[F[0]+A*st*I/2+nt*ot*k/2,F[1]+D*st*I/2+rt*ot*k/2,F[2]+Y*st*I/2+lt*ot*k/2];return P.quad(z(v,-1,1),z(v,1,1),z(x,1,1),z(x,-1,1),W&3),P.quad(z(v,1,-1),z(v,-1,-1),z(x,-1,-1),z(x,1,-1),W&3),P.quad(z(v,1,1),z(v,1,-1),z(x,1,-1),z(x,1,1),W&3),P.quad(z(v,-1,-1),z(v,-1,1),z(x,-1,1),z(x,-1,-1),W&3),q&&(P.quad(z(v,-1,-1),z(v,1,-1),z(v,1,1),z(v,-1,1),15),P.quad(z(x,-1,1),z(x,1,1),z(x,1,-1),z(x,-1,-1),15)),P},build(){const v=new L.BufferGeometry,x=[...V,[a,s,l,h,e,m-o]],I=(k,W)=>{const q=new Float32Array(m*W);let _=0;for(const N of x)q.set(N[k].subarray(0,N[5]*W),_),_+=N[5]*W;return q};return v.setAttribute("position",new L.BufferAttribute(I(0,3),3)),v.setAttribute("normal",new L.BufferAttribute(I(1,3),3)),v.setAttribute("aC",new L.BufferAttribute(I(2,3),3)),v.setAttribute("aM",new L.BufferAttribute(I(3,3),3)),v.setAttribute("aQ",new L.BufferAttribute(I(4,4),4)),v.setIndex(m>65535?new L.BufferAttribute(c.slice(0,i),1):new L.BufferAttribute(new Uint16Array(c.subarray(0,i)),1)),v.computeBoundingSphere(),v.computeBoundingBox(),v}};return P}function j(t,o){const a=[o[2],0,-o[0]];return{o:t,n:o,u:a,p:(s,l,h=0)=>[t[0]+a[0]*s-o[0]*h,t[1]+l,t[2]+a[2]*s-o[2]*h]}}function vt(t,o,a,s=5){const l=Math.max(a-o,t),h=(l*l-t*t)/(2*t),e=t+h,c=Math.atan2(l,h),i=(a-o)/l,n=[];for(let f=0;f<=s;f++){const r=c*f/s;n.push([h-e*Math.cos(r),o+e*Math.sin(r)*i])}for(let f=s-1;f>=0;f--){const r=c*f/s;n.push([-(h-e*Math.cos(r)),o+e*Math.sin(r)*i])}return n}function Z(t,o,a,s,l,h,e,c=.5){let i=a;for(const n of e){const f=vt(n.w,n.ys,n.ya,n.n??5),r=n.c-n.w,d=n.c+n.w,p=n.d??1;r>i+.001&&t.quad(o.p(i,l),o.p(r,l),o.p(r,h),o.p(i,h)),n.yb>l+.001&&t.quad(o.p(r,l),o.p(d,l),o.p(d,n.yb),o.p(r,n.yb));for(let m=0;m<f.length-1;m++){const u=f[m],w=f[m+1];t.quad(o.p(n.c+u[0],u[1]),o.p(n.c+w[0],w[1]),o.p(n.c+w[0],h),o.p(n.c+u[0],h))}if(p>0){const m=t.matState();t.mat(m[0],c),t.quad(o.p(r,n.yb,0),o.p(r,n.yb,p),o.p(r,n.ys,p),o.p(r,n.ys,0),1),t.quad(o.p(d,n.yb,p),o.p(d,n.yb,0),o.p(d,n.ys,0),o.p(d,n.ys,p),2);for(let u=0;u<f.length-1;u++){const w=f[u],b=f[u+1];t.quad(o.p(n.c+b[0],b[1],0),o.p(n.c+w[0],w[1],0),o.p(n.c+w[0],w[1],p),o.p(n.c+b[0],b[1],p),4)}n.sill!==!1&&t.quad(o.p(r,n.yb,0),o.p(d,n.yb,0),o.p(d,n.yb,p),o.p(r,n.yb,p),4),t.mat(m[0],m[1])}i=d}return s>i+.001&&t.quad(o.p(i,l),o.p(s,l),o.p(s,h),o.p(i,h)),t}function at(t,o,a,s){const l=vt(a.w,a.ys,a.ya,a.n??5);t.quad(o.p(a.c-a.w,a.yb,s),o.p(a.c+a.w,a.yb,s),o.p(a.c+a.w,a.ys,s),o.p(a.c-a.w,a.ys,s));for(let h=0;h<l.length-1;h++){const e=l[h],c=l[h+1];t.quad(o.p(a.c+e[0],a.ys,s),o.p(a.c+c[0],a.ys,s),o.p(a.c+c[0],c[1],s),o.p(a.c+e[0],e[1],s))}return t}function Et(t,o,a,s,l,h,e,c,i,n,f=24){const r=u=>{const w=Math.cos(u),b=Math.sin(u),Q=1/Math.max(Math.abs(w),Math.abs(b));return[w*Q,b*Q]},d=Math.min(e-a,s-e),p=Math.min(c-l,h-c),m=Math.min(d,p);for(let u=0;u<f;u++){const w=Math.PI*2*u/f,b=Math.PI*2*(u+1)/f,Q=r(w),M=r(b),O=[e+Math.cos(w)*i,c+Math.sin(w)*i],B=[e+Math.cos(b)*i,c+Math.sin(b)*i];t.quad(o.p(O[0],O[1]),o.p(e+Q[0]*m,c+Q[1]*m),o.p(e+M[0]*m,c+M[1]*m),o.p(B[0],B[1]));const V=t.matState();t.mat(V[0],.5),t.quad(o.p(O[0],O[1],0),o.p(B[0],B[1],0),o.p(B[0],B[1],n),o.p(O[0],O[1],n),4),t.mat(V[0],V[1])}return e-m>a+.001&&t.quad(o.p(a,l),o.p(e-m,l),o.p(e-m,h),o.p(a,h)),s>e+m+.001&&t.quad(o.p(e+m,l),o.p(s,l),o.p(s,h),o.p(e+m,h)),c-m>l+.001&&t.quad(o.p(e-m,l),o.p(e+m,l),o.p(e+m,c-m),o.p(e-m,c-m)),h>c+m+.001&&t.quad(o.p(e-m,c+m),o.p(e+m,c+m),o.p(e+m,h),o.p(e-m,h)),t}function ht(t,o,a,s,l,h,e){const c=Math.hypot(s[0]-a[0],s[1]-a[1])||1,i=-(s[1]-a[1])/c*l/2,n=(s[0]-a[0])/c*l/2;return t.quad(o.p(a[0]-i,a[1]-n,h),o.p(s[0]-i,s[1]-n,h),o.p(s[0]+i,s[1]+n,h),o.p(a[0]+i,a[1]+n,h)),t.quad(o.p(a[0]-i,a[1]-n,e),o.p(s[0]-i,s[1]-n,e),o.p(s[0]-i,s[1]-n,h),o.p(a[0]-i,a[1]-n,h)),t.quad(o.p(a[0]+i,a[1]+n,h),o.p(s[0]+i,s[1]+n,h),o.p(s[0]+i,s[1]+n,e),o.p(a[0]+i,a[1]+n,e)),t}function It(t,o,a,s,l,h){for(let e=0;e<a.length-1;e++)ht(t,o,a[e],a[e+1],s,l,h);return t}function et(t,o,a,s,l,h,e,c,i,n,f){const r=[];for(let d=0;d<=c;d++){const p=h+(e-h)*d/c;r.push([a+Math.cos(p)*l,s+Math.sin(p)*l])}return It(t,o,r,i,n,f)}function kt(t,o,a,s,l,h,e,c){const i=l*.14,n=l*.5,f=n*Math.sin(Math.PI/h),r=l*.87,d=r*Math.sin(Math.PI/(2*h)),p=Math.max(.1,l*.028);et(t,o,a,s,i,0,Math.PI*2,h,p*1.2,e,c);for(let m=0;m<h;m++){const u=Math.PI*2*m/h,w=u+Math.PI*2/h,b=(u+w)/2,Q=Math.cos(u),M=Math.sin(u);ht(t,o,[a+Q*i,s+M*i],[a+Q*n,s+M*n],p,e,c),et(t,o,a+Math.cos(b)*n*Math.cos(Math.PI/h),s+Math.sin(b)*n*Math.cos(Math.PI/h),f,b-Math.PI/2,b+Math.PI/2,4,p,e,c)}for(let m=0;m<2*h;m++){const u=Math.PI*m/h,w=u+Math.PI/h,b=(u+w)/2,Q=Math.cos(u),M=Math.sin(u),O=Math.cos(Math.PI/(2*h));ht(t,o,[a+Q*(n+f*(m%2?1:.05)),s+M*(n+f*(m%2?1:.05))],[a+Q*r,s+M*r],p*.85,e,c),et(t,o,a+Math.cos(b)*r*O,s+Math.sin(b)*r*O,d,b-Math.PI/2,b+Math.PI/2,4,p*.85,e,c)}return t}function bt(t,o,a,s,l,h,e,c={}){const i=c.w??.3,n=c.step??.9,f=c.leaf??.2;for(const p of[-1,1]){const m=[a+p*s,l],u=[a,h],w=Math.hypot(s,h-l),b=-p*s/w,Q=(h-l)/w,M=p*Q,O=-p*b;ht(t,o,p<0?m:u,p<0?u:m,i,-e,0);for(let B=n*.6;B<w-n*.4;B+=n){const V=m[0]+b*B+M*i*.5,H=m[1]+Q*B+O*i*.5,$=o.p(V-b*f,H-Q*f,-e*.5),P=o.p(V+b*f,H+Q*f,-e*.5),v=o.p(V+M*f*1.5+b*f*.6,H+O*f*1.5+Q*f*.6,-e*.5);p<0?(t.tri(P,$,v),t.tri($,P,v)):(t.tri($,P,v),t.tri(P,$,v))}}const r=o.p(a,h+.1,-e*.5),d=c.finial??.16;return t.taper(r[0],r[2],r[1],r[1]+d*4,d,d,d*.45,d*.45,0,!1),t.taper(r[0],r[2],r[1]+d*4,r[1]+d*5.4,d*1.5,d*1.5,d*.2,d*.2,0,!0),t}function At(t,o,a,s,l,h=5){const e=vt(a.w+s*.5,a.ys,a.ya+s*.5,h).map(c=>[a.c+c[0],c[1]]);return a.yb<a.ys-.01&&(ht(t,o,[a.c+a.w+s*.5,a.yb],[a.c+a.w+s*.5,a.ys],s,-l,0),ht(t,o,[a.c-a.w-s*.5,a.ys],[a.c-a.w-s*.5,a.yb],s,-l,0)),It(t,o,e,s,-l,0)}function Pt(t,o,a,s,l,h=.14){const e=a.w/2,c=a.ya-a.ys,i=c*.62,n=Math.min(a.w*.32,c*.24);ht(t,o,[a.c,a.yb],[a.c,a.ys+i*.5],h,s,l);for(const f of[-1,1])It(t,o,vt(e,a.ys,a.ys+i,3).map(r=>[a.c+f*e+r[0],r[1]]),h,s,l);return et(t,o,a.c,a.ya-n-c*.14,n,0,Math.PI*2,8,h*.85,s,l)}function ct(t,o,a,s,l,h,e){const c=a[0]-o[0],i=a[1]-o[1],n=Math.hypot(c,i),f=c/n,r=i/n,d=Math.max(2,Math.round(n/h));t.beam([o[0],s+.07,o[1]],[a[0],s+.07,a[1]],.32,.14,3),t.beam([o[0],s+l-.09,o[1]],[a[0],s+l-.09,a[1]],.36,.18,3);for(let p=0;p<=d;p++){const m=o[0]+c*p/d,u=o[1]+i*p/d,w=p%6===0?.13:.06;e&&p%6?(t.tri([m-f*w,s+.14,u-r*w],[m+f*w,s+.14,u+r*w],[m,s+l-.18,u]),t.tri([m+f*w,s+.14,u+r*w],[m-f*w,s+.14,u-r*w],[m,s+l-.18,u])):t.taper(m,u,s+.14,s+l-.18,w,w,w,w,0,!1)}}const y=[.255,.232,.213],K=[.2,.183,.171],X=[.25,.265,.295],mt=[.12,.1,.086],Me=[.11,.115,.13],ft=[1,1,1],Wt=[.275,.218,.132],gt=[1.25,1.02,.64],tt={towerTop:69,towerSide:14,gapHalf:6.5,platform:46,ridge:43,eaves:32,halfNave:7,halfAisle:17,halfBreadth:24,crossing:[78,0],steepleTip:78,apseX:104,transeptW:71,transeptE:85,southFace:31,length:128,navePiers:[20,29,38,47,56,65],choirPiers:[96],apsePiers:14},Se=tt,Yt=[78,6.5,28.5],jt=2+.6;async function Kt(t,o,a,s){const l=j([0,0,0],[-1,0,0]),h=[[-19,-8,-13.5],[-5,5,0],[8,19,13.5]];for(const e of[-20.5,-6.5,6.5,20.5])for(const[c,i,n,f]of[[-2.2,0,18,9.3],[-1.6,24.1,37.4,28.2]]){const r=j([c,0,e],[-1,0,0]),d={c:0,w:.72,yb:f,ys:f+3.5,ya:f+4.7,d:.55,n:4};t.col(K,1.08).mat(0,0).box(c,i,e-1.5,0,n,e+1.5,3,48),Z(t,r,-1.5,1.5,i,n,[d],.5),t.col(K,.8).mat(0,.6),at(t,r,d,.55),t.col(K,1.3).mat(0,0),bt(t,r,0,1.1,f+3.6,f+6.3,.22,{w:.2,step:.6,leaf:.13,finial:.09}),t.box(c-.16,f-1,e-1.62,0,f-.62,e+1.62,15,53),t.quad([c-.16,f-.62,e-1.62],[c-.16,f-.62,e+1.62],[c,f-.2,e+1.5],[c,f-.2,e-1.5],4),a.push([c+.3,f,e,.92])}for(const[e,c,i]of h){await s.yield();const n=i===0,f=n?4.2:3.9,r=n?7.5:6.5,d=n?14:12.6;for(let u=0;u<7;u++){const w=j([-0+u*.5,0,0],[-1,0,0]),b=u===0?e:i-(f-(u-1)*.3),Q=u===0?c:i+(f-(u-1)*.3),M=u===0?18.4:d-(u-1)*.36;t.col(y,.98-u*.022).mat(0,u===0?0:.2+u*.08);const O={c:i,w:f-u*.3,yb:0,ys:r-u*.09,ya:d-u*.36,d:.5,sill:!1,n:6};Z(t,w,b,Q,0,M,[O],.25+u*.09),Ct(o,w,O,.25,.78)}t.col(y,1.25).mat(0,0),bt(t,l,i,f+.9,r+1.6,d+3.7,.3,{w:.34,step:.85,leaf:.2}),t.col(y,.5).mat(0,.7);for(let u=0;u<10;u++){const w=Math.PI*2*u/10,b=Math.PI*2*(u+1)/10;t.tri(l.p(i,d+1.75,-.02),l.p(i+Math.cos(w)*.5,d+1.75+Math.sin(w)*.5,-.02),l.p(i+Math.cos(b)*.5,d+1.75+Math.sin(b)*.5,-.02))}t.col(y,1.25).mat(0,0),et(t,l,i,d+1.75,.56,0,Math.PI*2,10,.12,-.12,0);const p={c:i,w:f-6*.3,yb:0,ys:r-.54,ya:d-2.16,n:6},m=j([3.5,0,0],[-1,0,0]);if(t.col(mt,1.5).mat(5,.5),at(t,m,{...p,ys:r-1.4,ya:r-1.4+.01},0),t.col(y,.9).mat(0,.7),at(t,m,{...p,yb:r-1.4},-.12),t.col(y,1.05).mat(0,.3).box(3.1,0,i-.28,3.5,r-1.4,i+.28,3,49),t.box(3.22,r-1.4,i-p.w,3.5,r-.9,i+p.w,12,13),t.col(n?y:K,n?1:1.12).mat(0,0),n){Et(t,l,e,c,23.6,38,0,31,4.8,.9,28),t.col(ft).mat(6,0);for(let u=0;u<28;u++){const w=Math.PI*2*u/28,b=Math.PI*2*(u+1)/28;t.tri(l.p(0,31,.9),l.p(Math.cos(w)*4.8,31+Math.sin(w)*4.8,.9),l.p(Math.cos(b)*4.8,31+Math.sin(b)*4.8,.9))}t.col(y,1.25).mat(0,.1),kt(t,l,0,31,4.8,12,.45,.88),t.col(y,1.25).mat(0,0),et(t,l,0,31,5,0,Math.PI*2,28,.3,-.2,0)}else{const u=[-2.1,2.1].map(w=>({c:i+w,w:1.5,yb:25.2,ys:32,ya:35.4,d:.8}));Z(t,l,e,c,23.6,38,u,.5);for(const w of u)t.col(ft).mat(6,0),at(t,l,w,.8),t.col(K,1.3).mat(0,.2).box(.5,25.2,w.c-.1,.8,33.6,w.c+.1,3,49);t.col(K,1.3).mat(0,0),At(t,l,{c:i,w:3.95,yb:32.3,ys:32.3,ya:37.2},.3,.2,6);for(const w of u)At(t,l,w,.18,.1);et(t,l,i,35.3,.62,0,Math.PI*2,10,.14,-.1,0),t.col(K,.45).mat(0,.7);for(let w=0;w<10;w++){const b=Math.PI*2*w/10,Q=Math.PI*2*(w+1)/10;t.tri(l.p(i,35.3,-.02),l.p(i+Math.cos(b)*.56,35.3+Math.sin(b)*.56,-.02),l.p(i+Math.cos(Q)*.56,35.3+Math.sin(Q)*.56,-.02))}}}t.col(y,1.2).mat(0,0);for(const[e,c,i]of[[18,.4,2.45],[23.6,.5,2.5],[37.4,.6,1.9]])t.box(-i,e,-22.2,0,e+c,22.2,15,61)}async function Xt(t,o,a){const s=j([-2.3,0,0],[-1,0,0]),l=44/28,h=[];for(let r=0;r<28;r++){const d=-22+l*(r+.5);h.push({c:d,w:.56,yb:18.4,ys:21.9,ya:22.8,d:.3,sill:!1,n:3}),o.push([-1.75,18.4,d])}t.col(y,1.12).mat(0,0),Z(t,s,-22.2,22.2,18.4,23.6,h,.2),t.col(y,1.3).mat(0,0);for(const r of h)ht(t,s,[r.c-.74,22.15],[r.c,23.45],.13,-.3,0),ht(t,s,[r.c,23.45],[r.c+.74,22.15],.13,-.3,0),t.cyl(-2.42,r.c-l/2,18.4,22.1,.085,.085,5);t.cyl(-2.42,22,18.4,22.1,.085,.085,5),t.col(y,.8).mat(0,.75).quad([-1,18.4,-22.2],[-1,18.4,22.2],[-1,23.6,22.2],[-1,23.6,-22.2]);for(const r of[-22.2,22.2])t.col(y,1.05).mat(0,0).box(-2.3,18.4,Math.min(r,r*.99),0,23.6,Math.max(r,r*.99),0,r<0?16:32);await a.yield();const e=j([-1.35,0,0],[-1,0,0]),c=j([-1,0,0],[1,0,0]),i=[],n=[],f=44/34;for(let r=0;r<34;r++){const d=-22+f*(r+.5);i.push({c:d,w:.46,yb:38,ys:43.5,ya:44.9,d:.35,sill:!1,n:4}),n.push({c:-d,w:.46,yb:38,ys:43.5,ya:44.9,d:0,n:4})}n.sort((r,d)=>r.c-d.c),t.col(y,1.2).mat(0,0),Z(t,e,-22.2,22.2,38,45.4,i,.15),t.col(y,.95).mat(0,.3),Z(t,c,-22.2,22.2,38,45.4,n,.15),t.col(y,1.3).mat(0,0);for(let r=0;r<=34;r++){const d=-22+f*r;t.cyl(-1.47,d,38.25,43.4,.1,.1,5),t.cyl(-.86,d,38.25,43.4,.1,.1,5),t.box(-1.6,43.4,d-.16,-.74,43.62,d+.16,0,55),t.box(-1.6,38,d-.16,-.74,38.25,d+.16,0,59)}for(const r of i)for(const d of[-1,1]){const p=e.p(r.c+d*.41,43.85,.12),m=e.p(r.c+d*.27,44.4,.12),u=e.p(r.c+d*.17,43.95,.12);t.tri(p,m,u),t.tri(p,u,m)}await a.yield(),t.col(y,1.15).mat(0,0).box(-1.9,45.4,-22.4,1.6,46,22.4,15,63),t.col(y,1.3).mat(0,0),ct(t,[-1.75,-22.2],[-1.75,22.2],46,1,.42,!1),ct(t,[1.45,-6.3],[1.45,6.3],46,1,.42,!1),t.col(K,.95).mat(0,.45);for(const r of[-1,1])t.quad(...r<0?[[0,37.4,-20.5],[0,37.4,-6.5],[0,46,-6.5],[0,46,-20.5]]:[[0,37.4,6.5],[0,37.4,20.5],[0,46,20.5],[0,46,6.5]]);t.col(K,1).mat(0,0),t.quad([0,38,-6.5],[14,38,-6.5],[14,46.2,-6.5],[0,46.2,-6.5]),t.quad([14,38,6.5],[0,38,6.5],[0,46.2,6.5],[14,46.2,6.5]),t.quad([14,0,-20.5],[0,0,-20.5],[0,46.2,-20.5],[14,46.2,-20.5]),t.quad([0,0,20.5],[14,0,20.5],[14,46.2,20.5],[0,46.2,20.5]),t.quad([14,13,-6.5],[14,13,-20.5],[14,46.2,-20.5],[14,46.2,-6.5]),t.quad([14,13,20.5],[14,13,6.5],[14,46.2,6.5],[14,46.2,20.5]),t.col(y,1).mat(0,0);for(const r of[-1,1])t.quad(...r<0?[[0,0,-24],[0,0,-22],[0,13.6,-22],[0,13.6,-24]]:[[0,0,22],[0,0,24],[0,13.6,24],[0,13.6,22]]);t.col(X).mat(1,0).quad([0,38,6.5],[14,38,6.5],[14,38,-6.5],[0,38,-6.5]),t.col(y,.95).mat(0,.2),t.tri([14,38,-3.18],[14,38,3.18],[14,43,0])}const Jt=1.2,Zt=49.2,$t=13,qt=.5,Nt=35*Math.PI/180,Ft=1.2,te=.03,zt=[53.5,57];async function ee(t,o,a){for(const s of[-13.5,13.5]){await a.yield();const l=[{o:[0,0,s],n:[-1,0,0],gap:!1},{o:[14,0,s],n:[1,0,0],gap:!1},{o:[7,0,s-7],n:[0,0,-1],gap:s>0},{o:[7,0,s+7],n:[0,0,1],gap:s<0}];for(const h of l){const e=j(h.o,h.n),c=[-3,3].map(n=>({c:n,w:1.6,yb:48,ys:61,ya:65,d:1.5,n:6}));t.col(K,1).mat(0,0),Z(t,e,-7,7,46,67,c,.45);const i=j([h.o[0]-h.n[0]*1.5,0,h.o[2]-h.n[2]*1.5],[-h.n[0],0,-h.n[2]]);t.col(K,.8).mat(0,.7),Z(t,i,-5.5,5.5,47,66,c.map(n=>({...n,d:0})),.7),t.col(K,1.25).mat(0,0),t.beam(e.p(0,47.2,-.22),e.p(0,66.4,-.22),.5,.44,3),t.beam(e.p(-7.3,61,-.18),e.p(-4.6,61,-.18),.4,.36,3),t.beam(e.p(4.6,61,-.18),e.p(7.3,61,-.18),.4,.36,3),t.beam(e.p(-1.4,61,-.18),e.p(1.4,61,-.18),.4,.36,3);for(const n of[-4.85,-1.15,1.15,4.85])t.beam(e.p(n,48,-.12),e.p(n,61,-.12),.2,.24,3);t.beam(e.p(-7.3,54.5,-.1),e.p(-4.95,54.5,-.1),.26,.2,3),t.beam(e.p(4.95,54.5,-.1),e.p(7.3,54.5,-.1),.26,.2,3);for(const n of c)At(t,e,n,.34,.22,6),Pt(t,e,n,.14,.44,.2);if(!h.gap)for(const n of c){const f=n.ya-n.ys,r=(f*f-n.w*n.w)/(2*n.w),d=qt/2*Math.sin(Nt);for(let p=0;p<$t;p++){const m=Zt+p*Jt,u=m+d-n.ys,w=u<=0?n.w:Math.sqrt(Math.max((n.w+r)*(n.w+r)-u*u,0))-r-te;if(w<.4)continue;const b=e.p(n.c,m,Ft);h.n[0]<0&&Math.abs(b[2])<12.2&&m>zt[0]&&m<zt[1]||o.push([b[0],b[1],b[2],Math.atan2(h.n[0],h.n[2]),w*2])}}}t.col(K,1.1).mat(0,0);for(const h of[0,1])for(const e of[-1,1]){const c=h?14:0,i=s+e*7;t.box(c-(h?1.9:.45),46,i-(e>0?1.9:.45),c+(h?.45:1.9),67,i+(e>0?.45:1.9),3,51)}for(const h of[-1,1])for(const e of[-1,1]){const c=(h<0?0:14)+h*.45,i=s+e*7.45;t.col(K,1.22).mat(0,0);for(const[n,f]of[[h*.12,e*.12],[h*.14,-e*.8],[-h*.8,e*.14]]){t.cyl(c+n,i+f,46.5,66.9,.27,.27,6);for(const r of[53.2,60.4])t.cyl(c+n,i+f,r,r+.22,.36,.36,6)}t.at(c-h*.5,67.7,i-e*.5),yt(t,.85,K),t.at()}t.col(K,1.3).mat(0,0).box(-.7,67,s-7.7,14.7,67.7,s+7.7,15,55),t.col(K,1.3).box(-.6,46,s-7.6,14.6,46.5,s+7.6,15,59),t.col(X).mat(1,0).quad([-.7,67.7,s+7.7],[14.7,67.7,s+7.7],[14.7,67.7,s-7.7],[-.7,67.7,s-7.7]),t.col(K,1.2).mat(0,0),ct(t,[-.3,s-7.3],[14.3,s-7.3],67.7,1.3,.5,!0),ct(t,[14.3,s+7.3],[-.3,s+7.3],67.7,1.3,.5,!0),ct(t,[-.3,s+7.3],[-.3,s-7.3],67.7,1.3,.5,!0),ct(t,[14.3,s-7.3],[14.3,s+7.3],67.7,1.3,.5,!0),t.col(mt,1.6).mat(5,.5).quad([1.5,47,s+5.5],[12.5,47,s+5.5],[12.5,47,s-5.5],[1.5,47,s-5.5]),t.col(K,.6).mat(0,.8).quad([1.5,66,s-5.5],[12.5,66,s-5.5],[12.5,66,s+5.5],[1.5,66,s+5.5])}}const pt=[[9.5,58.2,14.6,2.6,4.6],[4,56.6,13.1,1.5,3.1],[3.6,56.5,-11.8,1.7,3.3],[7,54,-14.6,1.5,3],[10.4,54,-16.8,1.4,2.8],[3.6,59.6,-16.8,1.2,2.5],[7,59.6,-12.4,1.1,2.2],[10.4,59.6,-14.6,1,2],[77.2,49.6,-1.25,.9,1.9],[78.8,49.6,0,.8,1.75],[77.2,49.6,1.25,.75,1.6],[78.8,52.8,-1.25,.65,1.45],[77.2,52.8,0,.55,1.3],[78.8,52.8,1.25,.5,1.2]],dt=.72,oe=t=>.36+t*.04,ae=t=>t*.5+.35-(.12+t*.07)/2,se=[.15,.1,.065];function ne(t){t.col(se,1).mat(5,2),pt.slice(0,8).forEach(([o,a,s,l],h)=>{const e=oe(l),c=ae(l)+e/2,i=h===0?l*.98:l*.8;for(const n of[-1,1]){const f=s+n*c;if(h===0){t.beam([o-i,47,f],[o-i,a+e/2,f],e,e,3).beam([o+i,47,f],[o+i,a+e/2,f],e,e,3),t.beam([o-i-e/2,a,f],[o+i+e/2,a,f],e,e,3,!0);for(const r of[-1,1])t.beam([o+r*(i-e*.4),a-1.7,f],[o+r*(i-1.7),a-e*.4,f],e,e*.88,3)}else t.beam([o-l*.75,47,f],[o,a,f],e,e,3).beam([o+l*.75,47,f],[o,a,f],e,e,3),t.beam([o-l*.45,47+(a-47)*.4,f],[o+l*.45,47+(a-47)*.4,f],e,e,3)}t.beam([o-i,47.15,s-c-.3],[o-i,47.15,s+c+.3],e,e,3,!0),t.beam([o+i,47.15,s-c-.3],[o+i,47.15,s+c+.3],e,e,3,!0)})}function re(){const t=it(),o=[[.5,-.95],[.455,-.88],[.37,-.74],[.31,-.52],[.285,-.34],[.24,-.2],[.13,-.15]];for(let a=0;a<o.length-1;a++)t.col(a===0?gt:Wt,a===0?1:a===1?2.5:2).mat(9,0).cyl(0,0,o[a][1],o[a+1][1],o[a][0],o[a+1][0],12);t.cyl(0,0,-.15,-.15,.13,0,12),t.col(Wt,.32).cyl(0,0,-.3,-.94,.2,.47,12),t.col(Wt,.2);for(let a=0;a<12;a++){const s=Math.PI*2*a/12,l=Math.PI*2*(a+1)/12;t.tri([0,-.3,0],[Math.cos(s)*.2,-.3,Math.sin(s)*.2],[Math.cos(l)*.2,-.3,Math.sin(l)*.2])}t.col([.3,.3,.33]).cyl(0,0,-.9,-.3,.035,.03,5).cyl(0,0,-1.03,-.95,.03,.09,6).cyl(0,0,-.95,-.87,.09,.03,6),t.col(mt,1.4).mat(5,0).box(-.16,-.16,-.62,.16,.14,.62,15),t.col(mt,1.6);for(let a=0;a<10;a++){const s=Math.PI*2*a/10,l=Math.PI*2*(a+1)/10;t.beam([Math.cos(s)*dt,Math.sin(s)*dt,.5],[Math.cos(l)*dt,Math.sin(l)*dt,.5],.07,.07,3,!1,[0,0,1])}return t.beam([-dt,0,.5],[dt,0,.5],.06,.06,3,!1,[0,0,1]).beam([0,-dt,.5],[0,dt,.5],.06,.06,3,!1,[0,0,1]),t.build()}function Tt(t,o,a,s,l,h,e,c,i,n){const f=j([0,0,o*a],[0,0,o]);for(const[r,d]of s){const p=c.filter(m=>m>r+e.w&&m<d-e.w).map(m=>({...e,c:o*m})).sort((m,u)=>m.c-u.c);t.col(i,n).mat(0,0),Z(t,f,o>0?r:-d,o>0?d:-r,l,h,p,.5);for(const m of p)t.col(ft).mat(6,0),at(t,f,m,m.d),e.tr&&(t.col(i,n*1.25).mat(0,.1),Pt(t,f,m,m.d-.32,m.d-.02,e.tr))}}function Ot(t,o,a,s,l,h,e,c=0){s>h?t.quad([o,l,s],[a,l,s],[a,e,h],[o,e,h],c):t.quad([a,l,s],[o,l,s],[o,e,h],[a,e,h],c)}async function le(t,o){const a=[[14,67.5],[88.5,104]],s=[[14,71],[85,104]],l=[24.5,33.5,42.5,51.5,60.5,92.2,100],h=[];for(const e of l)h.push(e-1.3,e+1.3);for(const e of[-1,1]){await o.yield(),Tt(t,e,24,a,0,11.6,{w:1.7,yb:3.4,ys:7.4,ya:9.9,d:.7,tr:.15},l.concat([16.8]),y,1),Tt(t,e,17,s,13.2,21.2,{w:.85,yb:15,ys:18,ya:19.7,d:.5},h,y,.96),Tt(t,e,7,s,24.2,32,{w:2.3,yb:25.6,ys:28.8,ya:31.2,d:.6,tr:.17},l.concat([16.8,66.2]),y,1.02),t.col(X).mat(1,0);for(const[n,f]of a)Ot(t,n,f,e*24.2,11.6,e*17,13.4);for(const[n,f]of s)Ot(t,n,f,e*17.2,21.2,e*7,24.4);Ot(t,14,104,e*7.6,32,0,43,8),t.col(y,1.22).mat(0,0);for(const[n,f]of a)t.box(n,11,Math.min(e*24,e*24.35),f,11.75,Math.max(e*24,e*24.35),12,(e>0?32:16)|4|8);for(const[n,f]of s)t.box(n,20.7,Math.min(e*17,e*17.3),f,21.35,Math.max(e*17,e*17.3),12,(e>0?32:16)|4|8),t.box(n,31.4,Math.min(e*7,e*7.7),f,32.15,Math.max(e*7,e*7.7),12,(e>0?32:16)|4|8);t.col(y,1.25).mat(0,0);for(const[n,f]of s)ct(t,e>0?[f,7.55]:[n,-7.55],e>0?[n,7.55]:[f,-7.55],32.15,.95,.5,!0);for(const[n,f]of a)ct(t,e>0?[f,24.2]:[n,-24.2],e>0?[n,24.2]:[f,-24.2],11.75,.9,.5,!0);for(const n of l)t.at(n,21.35,e*17.05),yt(t,.62,y,2),t.at();t.col(y,1).mat(0,0);const c=Math.min(e*7,e*31),i=Math.max(e*7,e*31);t.quad([71,0,c],[71,0,i],[71,32,i],[71,32,c]),t.quad([85,0,i],[85,0,c],[85,32,c],[85,32,i]),t.col(y,1.2),t.box(70.7,31.4,c,71,32.15,i,12,13),t.box(85,31.4,c,85.3,32.15,i,12,14)}await o.yield(),t.col(X).mat(1,0),t.quad([70.4,32,-31],[70.4,32,31],[78,43,31],[78,43,-31],8),t.quad([85.6,32,31],[85.6,32,-31],[78,43,-31],[78,43,31],8),t.col(X,1.1).mat(1,0),t.beam([14,43.1,0],[104,43.1,0],.5,.45,0),t.beam([78,43.1,-31],[78,43.1,31],.5,.45,0),t.col(X,.8).mat(7,0);for(let e=14.5;e<103.8;e+=.62){if(Math.abs(e-78)<3.2)continue;const c=[e-.2,43.3,0],i=[e+.2,43.3,0],n=[e,43.95,0];t.tri(c,i,n),t.tri(i,c,n)}for(let e=-30.6;e<30.8;e+=.62){if(Math.abs(e)<3.2)continue;const c=[78,43.3,e-.2],i=[78,43.3,e+.2],n=[78,43.95,e];t.tri(c,i,n),t.tri(i,c,n)}}async function ie(t,o){const a=tt.apseX,s=[[24,0,11.6,{w:1.5,yb:3.4,ys:7.4,ya:9.9,d:.7},1],[17,13.2,21.2,{w:.8,yb:15,ys:18,ya:19.7,d:.5},.96],[7,24.2,32,{w:.62,yb:25.6,ys:29.2,ya:31,d:.4},1.02]];for(const[h,e,c,i,n]of s)for(let f=0;f<13;f++){f===0&&await o.yield();const r=-Math.PI/2+Math.PI*f/13,d=r+Math.PI/13,p=(r+d)/2,m=h*Math.sin(Math.PI/26),u=h*Math.cos(Math.PI/26),w=j([a+Math.cos(p)*u,0,Math.sin(p)*u],[Math.cos(p),0,Math.sin(p)]),b={...i,c:0};t.col(y,n).mat(0,0),Z(t,w,-m,m,e,c,[b],.5),t.col(ft).mat(6,0),at(t,w,b,b.d),h>20&&(t.col(y,1.25).mat(0,.1),Pt(t,w,b,b.d-.32,b.d-.02,.15)),t.col(y,1.22).mat(0,0).beam(w.p(-m,c-.25,-.15),w.p(m,c-.25,-.15),.7,.4,3),t.col(y,1.25);const Q=w.p(-m,0,.15),M=w.p(m,0,.15);if(ct(t,[M[0],M[2]],[Q[0],Q[2]],c+.15,.9,.5,!0),h<20){const O=w.p(h>10?0:-m,0,.1);t.at(O[0],c+.15,O[2],-p),yt(t,h>10?.62:.5,y,2),t.at()}}const l={a0:-Math.PI/2,a1:Math.PI/2};t.col(X).mat(1,0),t.cyl(a,0,11.6,13.4,24.2,17,13,l),t.cyl(a,0,21.2,24.4,17.2,7,13,l),t.cyl(a,0,32,43,7.6,0,13,l)}function Ct(t,o,a,s,l){const h=vt(a.w,a.ys,a.ya,10),e=(i,n,f,r,d,p)=>t.push({p:o.p(a.c+i,n,s),t:[o.u[0]*f,r,o.u[2]*f],n:[o.u[0]*d,p,o.u[2]*d]});for(let i=1.3;i<a.ys-.3;i+=l)e(-a.w,i,0,1,1,0),e(a.w,i,0,1,-1,0);let c=l*.5;for(let i=0;i<h.length-1;i++){const n=h[i],f=h[i+1],r=Math.hypot(f[0]-n[0],f[1]-n[1]),d=(f[0]-n[0])/r,p=(f[1]-n[1])/r;for(;c<r;)e(n[0]+d*c,n[1]+p*c,d,p,p,-d),c+=l;c-=r}}function he(t,o,a,s){const l=j([78,0,tt.southFace],[0,0,1]);for(const r of[-1,1]){const d=78+r*9.3,p=j([d,0,32.2],[0,0,1]);t.col(y,1.06).mat(0,0),t.box(d-1.2,0,28.5,d+1.2,41.5,32.2,3,19),t.quad(p.p(-1.2,0),p.p(1.2,0),p.p(1.2,1.6),p.p(-1.2,1.6),3);for(const[m,u]of[[1.6,13.4],[14.2,26.4],[27.2,40.7]]){const w={c:0,w:.72,yb:m+.7,ys:u-2.6,ya:u-.9,d:.34,n:4};t.col(y,1.06).mat(0,0),Z(t,p,-1.2,1.2,m,u,[w],.5),t.col(y,.86).mat(0,.6),at(t,p,w,.34),t.col(y,1.2).mat(0,0).box(d-1.32,u,28.5,d+1.32,u+.8,32.36,15,43),bt(t,p,0,.95,u-2.4,u-.25,.16,{w:.14,step:.55,leaf:.11,finial:.06})}t.col(y,1.06).mat(0,0),t.box(Math.min(78+r*8.1,78+r*7),0,28.5,Math.max(78+r*8.1,78+r*7),32,30.98,0,16),a.push([d,41.5,30.35,2.2])}for(let r=0;r<5;r++){const d=j([78,0,tt.southFace-r*.7],[0,0,1]),p={c:0,w:8-r*.8,yb:0,ys:5.5+r*.5,ya:14.6-r*.3,d:.7,sill:!1,n:8};t.col(y,1-r*.025).mat(0,r===0?0:.2+r*.1),Z(t,d,r===0?-8.1:-(8-(r-1)*.8),r===0?8.1:8-(r-1)*.8,0,r===0?16.4:14.6-(r-1)*.3,[p],.3+r*.1),Ct(o,d,p,.35,.78)}const h={c:0,w:4.8,yb:0,ys:7.5,ya:13.4,n:8},e=tt.southFace-3.5,c=Math.min(e,s-jt),i=e-c,n=j([78,0,e],[0,0,1]);if(t.col(mt,1.2).mat(5,.6),at(t,j([78,0,c],[0,0,1]),h,0),i>.001){const r=vt(h.w,h.ys,h.ya,h.n);t.col(y,.9).mat(0,.7),t.quad(n.p(-h.w,.5,0),n.p(-h.w,.5,i),n.p(-h.w,h.ys,i),n.p(-h.w,h.ys,0)),t.quad(n.p(h.w,.5,i),n.p(h.w,.5,0),n.p(h.w,h.ys,0),n.p(h.w,h.ys,i));for(let d=0;d<r.length-1;d++)t.quad(n.p(r[d+1][0],r[d+1][1],0),n.p(r[d][0],r[d][1],0),n.p(r[d][0],r[d][1],i),n.p(r[d+1][0],r[d+1][1],i));t.col(y,1.1).mat(0,.2).quad(n.p(-h.w,.5,0),n.p(h.w,.5,0),n.p(h.w,.5,i),n.p(-h.w,.5,i))}t.col(y,1.1).mat(0,.2).box(69.9,0,27.5,86.1,.5,31.6,15,40),t.box(69.3,0,31.6,86.7,.25,32.4,15,43);const f=[];for(let r=0;r<7;r++)f.push({c:-5.7+r*1.9,w:.72,yb:17.4,ys:22.3,ya:23.9,d:.5});t.col(y,1).mat(0,0),Z(t,l,-8.1,8.1,16.4,25,f,.4);for(const r of f)t.col(ft).mat(6,0),at(t,l,r,.5);t.col(y,1).mat(0,0),Et(t,l,-8.1,8.1,25,41.5,0,33,6.5,.9,32),t.col(ft).mat(6,0);for(let r=0;r<32;r++){const d=Math.PI*2*r/32,p=Math.PI*2*(r+1)/32;t.tri(l.p(0,33,.9),l.p(Math.cos(d)*6.5,33+Math.sin(d)*6.5,.9),l.p(Math.cos(p)*6.5,33+Math.sin(p)*6.5,.9))}t.col(y,1.25).mat(0,.1),kt(t,l,0,33,6.5,16,.45,.88),t.col(y,1.25).mat(0,0),et(t,l,0,33,6.72,0,Math.PI*2,32,.34,-.22,0);for(const[r,d]of[[-6.6,26.6],[6.6,26.6],[-6.6,39.6],[6.6,39.6]]){t.col(y,1.25).mat(0,0),et(t,l,r,d,.9,0,Math.PI*2,10,.16,-.12,0),t.col(y,.5).mat(0,.7);for(let p=0;p<10;p++){const m=Math.PI*2*p/10,u=Math.PI*2*(p+1)/10;t.tri(l.p(r,d,-.02),l.p(r+Math.cos(m)*.82,d+Math.sin(m)*.82,-.02),l.p(r+Math.cos(u)*.82,d+Math.sin(u)*.82,-.02))}}t.col(y,1.25).mat(0,0),bt(t,l,0,8.7,9.6,21.8,.45,{w:.42,step:1,leaf:.24,finial:.2}),et(t,l,0,17.4,1.05,0,Math.PI*2,12,.2,-.45,-.1);for(let r=0;r<3;r++){const d=Math.PI/2+Math.PI*2*r/3;et(t,l,Math.cos(d)*.5,17.4+Math.sin(d)*.5,.45,d-2,d+2,5,.1,-.42,-.14)}t.col(y,1.22).mat(0,0);for(const r of[16.4,24.9,41.2])t.box(69.7,r,31,86.3,r+.45,31.3,12,44);t.col(y,1).mat(0,0).tri(l.p(-8.1,41.5),l.p(8.1,41.5),l.p(0,50.3)),t.col(ft).mat(6,0);for(let r=0;r<12;r++){const d=Math.PI*2*r/12,p=Math.PI*2*(r+1)/12;t.tri(l.p(0,44.4,-.03),l.p(Math.cos(d)*1.3,44.4+Math.sin(d)*1.3,-.03),l.p(Math.cos(p)*1.3,44.4+Math.sin(p)*1.3,-.03))}t.col(y,1.25).mat(0,.1),kt(t,l,0,44.4,1.3,6,0,.2),t.col(y,1.25).mat(0,0),et(t,l,0,44.4,1.42,0,Math.PI*2,12,.2,-.16,0),t.beam(l.p(-8.4,41.3,.15),l.p(0,50.5,.15),.5,.6,3),t.beam(l.p(0,50.5,.15),l.p(8.4,41.3,.15),.5,.6,3),bt(t,l,0,8.4,41.5,50.7,.2,{w:.2,step:1,leaf:.24,finial:.01}),t.col(y,.9).mat(0,.2),t.quad([86.1,32,30.7],[69.9,32,30.7],[69.9,41.5,30.7],[86.1,41.5,30.7]),t.tri([86.1,41.5,30.7],[69.9,41.5,30.7],[78,50.3,30.7]),a.push([78,50.2,30.85,1.5])}function ce(t,o){const a=j([78,0,-tt.southFace],[0,0,-1]);for(const s of[-1,1])t.col(y,1.04).mat(0,0).box(78+s*9.3-1.2,0,-32.2,78+s*9.3+1.2,41.5,-28.5,3,51),o.push([78+s*9.3,41.5,-30.35,2.2]);t.col(y,1).mat(0,0),Z(t,a,-8.1,8.1,0,25,[{c:0,w:3.2,yb:0,ys:6,ya:10.5,d:1.6,sill:!1}],.6),t.col(mt,1.2).mat(5,.6),at(t,a,{c:0,w:3.2,yb:0,ys:6,ya:10.5},1.6),t.col(y,1).mat(0,0),Et(t,a,-8.1,8.1,25,41.5,0,33,6,.9,24),t.col(ft).mat(6,0);for(let s=0;s<24;s++){const l=Math.PI*2*s/24,h=Math.PI*2*(s+1)/24;t.tri(a.p(0,33,.9),a.p(Math.cos(l)*6,33+Math.sin(l)*6,.9),a.p(Math.cos(h)*6,33+Math.sin(h)*6,.9))}t.col(y,1).mat(0,0).tri(a.p(-8.1,41.5),a.p(8.1,41.5),a.p(0,50.3)),t.col(y,.9).mat(0,.2),t.quad([69.9,32,-30.7],[86.1,32,-30.7],[86.1,41.5,-30.7],[69.9,41.5,-30.7]),t.tri([69.9,41.5,-30.7],[86.1,41.5,-30.7],[78,50.3,-30.7])}function yt(t,o,a=y,s=4){t.col(a,1.12).mat(0,0),t.taper(0,0,0,o*1.5,o*.5,o*.5,o*.5,o*.5,3,!1),t.taper(0,0,o*1.5,o*1.72,o*.62,o*.62,o*.62,o*.62,15,!0),t.taper(0,0,o*1.72,o*4.4,o*.46,o*.46,.03,.03,3,!1),t.col(a,1.3);for(let l=1;l<=s;l++){const h=l/(s+1.2),e=o*(1.72+2.68*h),c=o*.46*(1-h)+.02,i=o*.12*(s<4?1.3:1);for(const[n,f]of[[1,1],[1,-1],[-1,1],[-1,-1]])t.taper(n*c,f*c,e,e+i*1.6,i,i,i*.3,i*.3,0,!0)}t.taper(0,0,o*4.4,o*4.75,o*.13,o*.13,o*.05,o*.05,0,!0)}function fe(){const t=it();t.col(y,1.04).mat(0,0),t.box(-.95,0,0,.95,11.2,2.6,3,35),t.box(-.85,11.2,-.2,.85,16.5,2.5,3,19),t.quad([-.95,11.2,2.6],[.95,11.2,2.6],[.85,11.9,2.5],[-.85,11.9,2.5],4);const o=j([0,0,2.5],[0,0,1]),a={c:0,w:.42,yb:12.5,ys:14.3,ya:15.2,d:.4,n:3};Z(t,o,-.85,.85,11.2,16.5,[a],.5),t.col(y,.8).mat(0,.6),at(t,o,a,.4),t.col(y,1.25).mat(0,0),bt(t,o,0,.7,14.5,16.2,.16,{w:.14,step:.5,leaf:.1,finial:.06}),t.col(y,1.04),t.box(-.75,16.5,-.2,.75,21.4,2.3,3,51),t.quad([-.85,16.5,2.5],[.85,16.5,2.5],[.75,17.2,2.3],[-.75,17.2,2.3],4),t.quad([-.75,21.4,2.3],[.75,21.4,2.3],[.75,22.6,1.05],[-.75,22.6,1.05],8),t.quad([.75,21.4,-.2],[-.75,21.4,-.2],[-.75,22.6,1.05],[.75,22.6,1.05],8),t.tri([-.75,21.4,-.2],[-.75,21.4,2.3],[-.75,22.6,1.05]),t.tri([.75,21.4,2.3],[.75,21.4,-.2],[.75,22.6,1.05]),t.col(y,1.25).box(-.2,20.6,2.3,.2,20.95,3.7,15,47),t.at(0,22.3,1.05),yt(t,1),t.at();const s=9,l=c=>22+8.3*c,h=c=>13.6+15.6*Math.sin(c*Math.PI/2),e=.42;for(let c=0;c<s;c++){const i=c/s,n=(c+1)/s,f=-.2-16.8*i,r=-.2-16.8*n;t.col(y,1).mat(0,0),t.quad([-e,h(i),f],[-e,l(i),f],[-e,l(n),r],[-e,h(n),r],3),t.quad([e,h(n),r],[e,l(n),r],[e,l(i),f],[e,h(i),f],3),t.col(y,.9).mat(0,.35).quad([-e,h(i),f],[-e,h(n),r],[e,h(n),r],[e,h(i),f],12);const d=.13,p=.14;t.col(y,1.2).mat(0,0),t.quad([-e,l(n),r],[-e,l(i),f],[-e+d,l(i),f],[-e+d,l(n),r],0),t.quad([e-d,l(n),r],[e-d,l(i),f],[e,l(i),f],[e,l(n),r],0),t.col(y,.7).mat(0,.5),t.quad([-e+d,l(n)-p,r],[-e+d,l(i)-p,f],[e-d,l(i)-p,f],[e-d,l(n)-p,r],0),t.quad([-e+d,l(n),r],[-e+d,l(i),f],[-e+d,l(i)-p,f],[-e+d,l(n)-p,r],0),t.quad([e-d,l(n)-p,r],[e-d,l(i)-p,f],[e-d,l(i),f],[e-d,l(n),r],0)}return t.build()}function de(t){const[o,a]=tt.crossing,s=2.6,l=(c,i)=>{const n=Math.PI/8+Math.PI*i/4;return[o+Math.cos(n)*c,a+Math.sin(n)*c]};t.col(X,.95).mat(1,0).cyl(o,a,38.5,47,s+.15,s+.15,8,{phase:Math.PI/8}),t.col(X,1.15).cyl(o,a,46.6,47.1,s+.4,s+.4,8,{phase:Math.PI/8,cap:!0});for(let c=0;c<8;c++){const i=l(s,c),n=l(s,c+1),f=(i[0]+n[0])/2,r=(i[1]+n[1])/2,d=Math.hypot(f-o,r-a),p=[(f-o)/d,0,(r-a)/d],m=Math.hypot(n[0]-i[0],n[1]-i[1])/2,u={c:0,w:m-.3,yb:47.1,ys:53.4,ya:55.3,d:.3,sill:!1,n:4};t.col(X,1.05).mat(1,0),Z(t,j([f,0,r],p),-m,m,47.1,56,[u],.2),t.col(X,.8).mat(1,.4),Z(t,j([f-p[0]*.3,0,r-p[2]*.3],[-p[0],0,-p[2]]),-m+.12,m-.12,47.1,56,[{...u,d:0}],.2)}t.col(mt,1.3).mat(5,.2);for(const c of[49.6,52.8])for(const i of[77.2,78.8])t.beam([i,c+.05,a-2.3],[i,c+.05,a+2.3],.16,.2,3);const h=c=>(s+.25)*(78-c)/22,e=[[56,59.4,1],[59.4,61.4,0],[61.4,65,1],[65,66.6,0],[66.6,78,1]];t.col(X,1.15).mat(1,0).cyl(o,a,55.9,56.3,s+.45,s+.45,8,{phase:Math.PI/8});for(const[c,i,n]of e){if(n){t.col(X,1).mat(1,0).cyl(o,a,c,i,h(c),h(i),8,{phase:Math.PI/8});continue}t.col(X,1.1).mat(1,0);for(let f=0;f<8;f++){const r=l(h(c),f),d=l(h(i),f);t.beam([r[0],c-.05,r[1]],[d[0],i+.05,d[1]],.22,.22,3)}t.col(X,.7).mat(1,.5).cyl(o,a,c,c,h(c),0,8,{phase:Math.PI/8})}t.col(X,1.2).mat(1,0).cyl(o,a,78,78.9,.07,.07,6).cyl(o,a,78.9,79.4,.22,.03,6).cyl(o,a,78.6,78.9,.03,.22,6);for(let c=0;c<8;c++){const i=l(1,c),n=i[0]-o,f=i[1]-a;t.col(X,1.3).mat(1,0);for(const[M,O,B]of e)if(B){const V=l(h(M)+.04,c),H=l(h(Math.min(O,77.6))+.04,c);t.beam([V[0],M,V[1]],[H[0],Math.min(O,77.6),H[1]],.16,.16,3)}{const M=l(s+.2,c);t.beam([M[0],38.6,M[1]],[M[0],46.6,M[1]],.2,.2,3)}for(let M=57.2;M<75;M+=1.5){if(M>59.2&&M<61.6||M>64.8&&M<66.8)continue;const O=h(M)+.1,B=o+n*O,V=a+f*O,H=.1+.12*(78-M)/22;t.tri([B-f*H,M,V+n*H],[B+f*H,M,V-n*H],[B+n*H*2.6,M+H*2.2,V+f*H*2.6]),t.tri([B+f*H,M,V-n*H],[B-f*H,M,V+n*H],[B+n*H*2.6,M+H*2.2,V+f*H*2.6])}const r=l(s+.42,c);t.col(X,1.2).taper(r[0],r[1],55.6,58.9,.17,.17,.02,.02,3,!1);const d=l(s+.06,c),p=l(s+.06,c+1),m=[(d[0]+p[0])/2,(d[1]+p[1])/2],u=.7,w=[m[0]+(d[0]-m[0])*u,56.2,m[1]+(d[1]-m[1])*u],b=[m[0]+(p[0]-m[0])*u,56.2,m[1]+(p[1]-m[1])*u],Q=[m[0],57.9,m[1]];t.col(X,1.1).tri(b,w,Q),t.tri(w,b,Q)}}function me(){const t=it();t.col(y,1.12).mat(0,0),t.taper(0,0,0,.16,.46,.3,.44,.28,3,!0),t.taper(0,0,.16,2.3,.4,.26,.33,.22,3,!1),t.taper(0,0,2.3,2.62,.33,.22,.43,.24,3,!0),t.quad([-.47,2.56,.26],[.47,2.56,.26],[.4,2.7,0],[-.4,2.7,0],0),t.quad([.47,2.56,-.26],[-.47,2.56,-.26],[-.4,2.7,0],[.4,2.7,0],0),t.col(y,1.3);for(const o of[-.24,-.08,.1,.25])t.taper(o,.25,.2,1.75,.035,.03,.03,.03,3,!1);t.beam([-.42,2.25,.14],[-.02,2,.29],.13,.13,3,!0),t.beam([.42,2.25,.14],[.16,1.8,.3],.13,.13,3,!0),t.cyl(.17,.34,1.62,1.74,.02,.1,6).cyl(.17,.34,1.74,1.86,.1,.02,6),t.col(y,1.18),t.cyl(0,.02,2.62,2.74,.1,.17,8).cyl(0,.02,2.74,3,.17,.15,8),t.col(y,1.35).cyl(0,.02,3,3.2,.16,.22,8,{cap:!0});for(let o=0;o<4;o++){const a=Math.PI/4+o*Math.PI/2;t.taper(Math.cos(a)*.19,.02+Math.sin(a)*.19,3.2,3.36,.035,.035,.01,.01,0,!1)}return t.build()}function pe(){const t=it();return t.col(y,1.2).mat(0,.15),t.taper(0,.08,0,.32,.13,.1,.1,.07,3,!0),t.col(y,1.4),t.taper(0,.1,.34,.5,.075,.07,.1,.085,3,!0),t.build()}function ue(){const t=it(),o=qt/2*Math.sin(Nt),a=qt/2*Math.cos(Nt);return t.col([.15,.14,.13],1).mat(7,0).beam([0,o,-a],[0,-o,a],1,.06,0,!1,[0,0,1]),t.build()}function we(t){t.col(y,1.15).mat(0,0);for(let a=0;a<9;a++){const s=-24+a*6;t.taper(-8,s,0,1.05,.2,.2,.15,.15,3,!1),t.taper(-8,s,1.05,1.22,.15,.15,.05,.05,0,!0)}const o=(a,s,l,h)=>{t.col(y,.95).mat(0,0).box(a,0,s,l,2,h,3,51),t.col(y,1.25).box(a-.08,2,s-.08,l+.08,2.2,h+.08,12,63)};o(107.7,31,108.3,62),o(53.4,84.7,62,85.3),o(94,84.7,102.6,85.3);for(const a of[62,94])t.col(y,1.05).mat(0,0).box(a-.55,0,84.45,a+.55,2.7,85.55,3,51),t.taper(a,85,2.7,3.3,.6,.6,.1,.1,0,!0)}const Mt=126,Rt=60,ve=82,Bt=-7.5,_t=[[0,ve],[6,69],[20,43],[35,18],[Rt,Bt]],Ht=(()=>{const t=_t,o=[],a=[0];for(let s=0;s<t.length-1;s++)o.push((t[s+1][1]-t[s][1])/(t[s+1][0]-t[s][0]));for(let s=1;s<t.length-1;s++)a.push(2*o[s-1]*o[s]/(o[s-1]+o[s]));return a.push(0),a})();function be(t){let o=t%Mt;if(o<0&&(o+=Mt),o>Mt-Rt&&(o=Mt-o),o>=Rt)return Bt;const a=_t;let s=0;for(;s<a.length-2&&o>a[s+1][0];)s++;const l=a[s+1][0]-a[s][0],h=(o-a[s][0])/l,e=h*h,c=e*h;return(2*c-3*e+1)*a[s][1]+(c-2*e+h)*l*Ht[s]+(-2*c+3*e)*a[s+1][1]+(c-e)*l*Ht[s+1]}async function Qe(t,o={}){const a=!o.shared,s=o.shared||Vt({edge:40}),l=Ut(s),h=new L.Group,e=new L.Group;h.rotation.y=Math.PI/2,h.position.z=tt.length/2,e.add(h);const c=S=>t.core.makeRng(t.core.hashSeed("towers-"+S+":"+t.seed)),i=c("bells"),n=c("kings"),f=c("forms"),r=o.doorSeat||Yt,d=(S,E=!0)=>{const A=new L.InstancedMesh(S,l,1);return A.castShadow=E,A.receiveShadow=!0,h.add(A),A},p=[],m=[],u=[],w=[];let b=it();await Kt(b,m,p,t),await t.yield(),await Xt(b,p,t),await t.yield(),d(b.build()),await t.yield(),b=it(),await ee(b,u,t),ne(b),await t.yield(),d(b.build()),await t.yield(),b=it(),await le(b,t),await t.yield(),await ie(b,t),await t.yield(),d(b.build()),await t.yield(),b=it(),he(b,m,w,r[2]),await t.yield(),ce(b,w),de(b),await t.yield();for(const[S,E,A,D]of w)b.at(S,E,A),yt(b,D);b.at(),we(b),await t.yield(),d(b.build()),await t.yield();const Q=new L.Matrix4,M=new L.Quaternion,O=new L.Vector3,B=new L.Vector3,V=new L.Vector3(0,1,0),H=new L.Vector3(0,0,1),$=(S,E,A)=>{const D=new L.InstancedMesh(S,l,E);return D.castShadow=A,D.receiveShadow=!0,h.add(D),D},P=[];for(const S of tt.navePiers.concat(tt.choirPiers))P.push([S,24,0],[S,-24,Math.PI]);for(let S=0;S<tt.apsePiers;S++){const E=-Math.PI/2+Math.PI*S/13;P.push([tt.apseX+Math.cos(E)*24,Math.sin(E)*24,Math.PI/2-E])}const v=$(fe(),P.length,!0);P.forEach(([S,E,A],D)=>{Q.compose(O.set(S,0,E),M.setFromAxisAngle(V,A),B.set(1,1,1)),v.setMatrixAt(D,Q)}),v.computeBoundingSphere(),await t.yield();const x=$(me(),p.length,!1);p.forEach(([S,E,A,D=1],Y)=>{Q.compose(O.set(S,E,A),M.setFromAxisAngle(V,-Math.PI/2+n.range(-.07,.07)),B.set(n.range(.94,1.06)*D,n.range(.93,1.03)*D,D)),x.setMatrixAt(Y,Q)}),x.computeBoundingSphere();const I=$(pe(),m.length,!1),k=new L.Vector3,W=new L.Vector3,q=new L.Vector3;m.forEach((S,E)=>{W.set(S.t[0],S.t[1],S.t[2]).normalize(),q.set(S.n[0],S.n[1],S.n[2]).normalize(),k.crossVectors(W,q);const A=f.range(.95,1.35),D=A*f.range(.9,1.3);Q.makeBasis(k.multiplyScalar(A),W.multiplyScalar(D),q.multiplyScalar(A)).setPosition(S.p[0],S.p[1],S.p[2]),I.setMatrixAt(E,Q)}),I.computeBoundingSphere(),await t.yield();const _=$(ue(),u.length,!1);u.forEach(([S,E,A,D,Y],J)=>{Q.compose(O.set(S,E,A),M.setFromAxisAngle(V,D),B.set(Y,1,1)),_.setMatrixAt(J,Q)}),_.computeBoundingSphere();const N=$(re(),pt.length,!1);N.frustumCulled=!1;const G=pt.map(()=>i.range(0,Math.PI*2)),g=(S,E)=>(S===0?.82:.95)*Math.sin(Math.PI*2*E/pt[S][4]+G[S]),T=S=>{for(let E=0;E<pt.length;E++){const A=pt[E];Q.compose(O.set(A[0],A[1],A[2]),M.setFromAxisAngle(H,g(E,S)),B.set(A[3],A[3],A[3])),N.setMatrixAt(E,Q)}N.instanceMatrix.needsUpdate=!0};T(0);const U=S=>new L.Vector3(S[2],S[1],tt.length/2-S[0]);return{object:e,inner:h,shared:s,radius:70,height:79,center:new L.Vector3(0,30,0),ground:!0,groundY:0,anchors:{gapLine:[U([0,57,0]),U([14,57,0])],spireFoot:U([78,47,0]),southDoorSeat:U(r),belfries:[U([7,57,-13.5]),U([7,57,13.5])]},bells:pt,swingAt:g,triangles:()=>{let S=0;return h.traverse(E=>{E.isMesh&&(S+=E.geometry.index.count/3*(E.isInstancedMesh?E.count:1))}),S},update(S,E){T(E),a&&(s.uEdge.value=be(E),s.uTime.value=E)},dispose(){}}}export{Se as CHURCH,Rt as EDGE_DOWN,Bt as EDGE_LOW,Mt as EDGE_PERIOD,ve as EDGE_TOP,xe as SURFACE_FRAG_HEAD,ye as SURFACE_VERT,et as arcBars,at as archFill,vt as archPts,Z as archWall,ht as bar,It as bars,Qe as buildHero,be as edgeAt,it as makeGB,Vt as makeShared,Ut as makeSurface,At as moulding,bt as rakes,kt as roseWeb,Et as roundWall,Pt as tracery,j as wallFrame};
