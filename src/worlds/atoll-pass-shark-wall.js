import*as d from"three";import{makePath as as,clamp as Ge,lerp as le,makeRng as Qe}from"../kit/core.js";import{makeSky as os,makeCloudField as ss,makeLightRig as ns,skyDirection as is}from"../kit/sky.js";import*as rs from"../kit/water.js";import*as ve from"../kit/fauna.js";import*as ls from"../kit/fx.js";import{buildHero as cs,sharkGeometry as hs,makeWriter as Ba,vertexNormalsInSlices as us}from"../parts/atoll-pass-shark-wall.js";const ht=["#0B3C9C","#8DF3D6","#17B093","#F6FCF8","#D9AF98","#0C5078","#FF7B2E"],Oe=50,st=`
float aHash(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float aNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(aHash(i), aHash(i + vec2(1., 0.)), f.x), mix(aHash(i + vec2(0., 1.)), aHash(i + vec2(1., 1.)), f.x), f.y); }
float aFbm(vec2 p){ return aNoise(p) * .5 + aNoise(p * 2.03 + 17.1) * .3 + aNoise(p * 4.1 + 41.7) * .2; }
vec3 aVoro(vec2 p){
  vec2 i = floor(p), f = fract(p); float best = 9.; vec2 bid = i;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y)); vec2 o = vec2(aHash(i + g), aHash(i + g + 71.3));
    float dd = length(g + .15 + .7 * o - f); if (dd < best) { best = dd; bid = i + g; }
  }
  return vec3(best, aHash(bid + 5.7), aHash(bid + 91.1));
}`,qa=`
uniform vec4 uRing;    // centre x, centre z, R0, angle of the pass
uniform vec4 uRingE;   // e2, phi2, e3, phi3
uniform vec4 uIsl;     // islet count n, a1, a2, e5
uniform vec4 uPlate;   // P.x, P.z, k, time
uniform vec4 uRipP;    // flow dir x, z, standing-wave amplitude, chop amplitude
float ringR(float th){ return uRing.z * (1. + uRingE.x * cos(2. * (th - uRingE.y)) + uRingE.z * cos(3. * th - uRingE.w) + uIsl.w * cos(5. * th + 1.3)); }
float angDiff(float a){ return a - 6.2831853 * floor(a / 6.2831853 + .5); }
float islA(float th, float s){
  float f = sin(uIsl.x * th + 1.6 * sin(3. * th + uIsl.y) + .9 * sin(7. * th + uIsl.z));
  float a = smoothstep(-.15, .55, f), sh = abs(s), e = (sh - 260.) / 170.;
  a = max(a, exp(-e * e));
  return a * smoothstep(105., 170., sh);
}
float islH(float a, float d){ float hw = 22. + 58. * a, x = (d + 55.) / hw; return a < .02 ? -1.5 : 3.4 * sqrt(max(a, 0.)) * (1. - x * x) - .6 * (1. - a); }
float ripH(vec2 q, float t){
  vec2 rl = q - uPlate.xy; float a = dot(rl, uRipP.xy), b = dot(rl, vec2(-uRipP.y, uRipP.x));
  float env = exp(-b * b / 2400.) * smoothstep(-125., -78., a) * (1. - smoothstep(150., 330., a));
  float ph = a * .7854 + .8 * sin(b * .15 + t * .3);
  return env * uRipP.z * sin(ph) * (.75 + .25 * sin(b * .31 + t * .7))
       + uRipP.w * (sin(.9 * q.x + .5 * q.y - 1.9 * t) + .7 * sin(-.6 * q.x + 1.3 * q.y - 2.3 * t));
}`,Ut=[[-99,-21,1.25],[-108,25,-1.35],[-118,-3,1.12],[-126,17,-1.22]],fs=Ut.map(([i,t])=>"lens = max(lens, 1. - smoothstep(.3, 1., length(vec2(pa - ("+i.toFixed(1)+"), pb - ("+t.toFixed(1)+")) / vec2(15., 22.)) + .35 * (sn3 - .5)));").join(`
  `),xo=`
uniform vec3 uCobalt, uMint, uJade, uTeal, uSand, uTan, uFoam, uFoamSh, uReefDark, uPassCol;
uniform vec3 uSkyZen, uSkyHor, uHazeCol, uLit, uSunCol, uShadowTint, uSunDir;
uniform vec4 uWind;    // dir x, z, chop 0..1, cloud-shadow strength
uniform vec4 uSunA;    // shadow offset x, z (m per m of height), haze per metre, reflection gain
uniform vec4 uCanoe;   // position x, z, heading x, z
uniform vec4 uCanoe2, uCanoe3;   // the two large canoes out on the open sea (seen from the air: a fleck and a pale V)
uniform vec4 uSquall;  // centre x, z, radius, strength
float gLace = 1.;       // metres per pixel for the foam lace: geometric mean of the two screen directions, set by the caller
float gNet = 1.;        // the rip sheet's close-range foam net (set by RIP_FRAG; 1 everywhere else)
// a canoe's wake: a white V and a churned stern trail, never thinner than a pixel. L: length scale
float wakeOf(vec4 c, vec2 q, float fw, float L){
  vec2 cr = q - c.xy; float cx = -dot(cr, c.zw), cy = dot(cr, vec2(-c.w, c.z));
  float wk = (1. - smoothstep(.3 + cx * .012 + fw * .7, .9 + cx * .03 + 1.4 * fw, abs(abs(cy) - cx * .33))) * (1. - smoothstep(30. * L, 120. * L, cx));
  return max(wk, (1. - smoothstep(.4, 1.3 + fw, abs(cy))) * (1. - smoothstep(4., 40. * L, cx)) * .9) * step(0., cx);
}
// q: plate-space position, N: geometric normal, V: unit vector to the eye, D: apparent distance, fw: metres per pixel
vec3 seaShade(vec2 q, vec3 Ng, vec3 V, float D, float fw, out float foamOut){
  float t = uPlate.w;
  vec2 rel = q - uRing.xy; float r = length(rel) + 1e-3;
  float th = atan(rel.y, abs(rel.x) < 1e-4 ? 1e-4 : rel.x);
  float d = r - ringR(th), s = angDiff(th - uRing.w) * uRing.z;
  float a = islA(th, s), hI = islH(a, d);
  vec2 wd = uWind.xy, wp = vec2(-wd.y, wd.x);
  float n1 = aFbm(q * .0031 + 3.7), n2 = aNoise(q * .021), n3 = aNoise(q * .11 + 9.);
  float nearK = clamp(1.5 - fw * .7, 0., 1.), midK = clamp(1.6 - fw * .12, 0., 1.);
  // ---- lagoon: mint sand shelves, jade at 10 m, teal in the middle, patch reefs in pale halos
  float dl = -d - 165. + 110. * (n1 - .5), dep = smoothstep(0., 430., dl);
  vec3 lag = mix(uMint, uJade, smoothstep(.10, .5, dep));
  lag = mix(lag, uTeal, smoothstep(.45, 1., dep)) * (.88 + .24 * n1);
  lag = mix(lag, uMint * 1.04, (1. - smoothstep(0., .16, dep)) * .6);
  vec3 vr = aVoro(q / 128. + 13.);
  float rr = .05 + .19 * vr.y * vr.y, on = step(.3, vr.z) * smoothstep(.05, .18, dep), aa = fw / 128.;
  float halo = (1. - smoothstep(rr * 1.15, rr * 1.75 + .035 + aa, vr.x + .04 * (n2 - .5))) * on;
  float core = (1. - smoothstep(rr * .8 - aa, rr + aa, vr.x + .05 * (n3 - .5))) * on;
  lag = mix(lag, uMint * 1.02, halo * .7 * (1. - .4 * dep));
  lag = mix(lag, uReefDark * (.8 + .5 * n3), core * .92);
  float stK = aNoise(vec2(dot(q, wp) * .2, dot(q, wd) * .01 - t * .04));
  lag *= 1. + .09 * (stK - .5) * midK * (.4 + .6 * uWind.z);
  vec3 col = lag;
  // ---- reef flat: tan-pink under a hand of water, white sand on its lagoon shore, spur and groove seaward
  float flatM = smoothstep(0., 28., -dl);
  vec3 flatC = mix(uTan, uMint, .22) * (.78 + .3 * n2) * (.9 + .2 * n3 * nearK);
  flatC = mix(flatC, uSand, (1.0 - smoothstep(0., 40., -dl)) * .7);
  flatC = mix(flatC, uTan * .62, smoothstep(.6, .8, aNoise(q * .035 + 31.)) * .5);
  float gr = sin(s * .29 + 2.5 * aNoise(vec2(s * .02, 3.)));
  float grooveK = smoothstep(.15, .7, gr) * smoothstep(5., 50., d + 12. * n2) * midK;
  vec3 slope = mix(uPassCol * 1.25, uCobalt, smoothstep(60., 210., d));
  flatC = mix(flatC, slope, grooveK * .85);
  col = mix(col, flatC, flatM);
  float lace0 = .55 + .45 * aNoise(q * .13 + vec2(t * .3, 0.));
  // ---- open ocean: cobalt, swell wrapping the ring, whitecaps
  float seaM = smoothstep(52., 96., d + 14. * (n2 - .5));
  float wrap = (1.0 - smoothstep(160., 800., d));
  // (two wave trains, the wind's and the one wrapping the ring, cross-faded: one sine of a phase blended between the two ran
  // five times finer wherever the blend changed, and from the air that band showed as ruled lines. Each train, and the long
  // swell below, is faded by how fast its own phase turns per pixel, so nothing finer than nine pixels a wave is ever drawn)
  float swW = 3. * n1 + 2.6 * aNoise(q * .011 + 7.) - t * .8, phA = dot(rel, wd) * .074 + swW, phB = -d * .074 + swW;
  // (fourth polish pass: the fade is by the pixel footprint of the wave itself and much earlier. A train is drawn in full only
  // while one wave spans thirty pixels and is gone at ten: at eleven pixels a wave, full strength, it was a fine ruled banding
  // over the whole open sea in the opening seconds)
  float swell = mix(sin(phA) * clamp(1.45 - fwidth(phA) * 2.4, 0., 1.), sin(phB) * clamp(1.45 - fwidth(phB) * 2.4, 0., 1.), wrap) * (.35 + .65 * aNoise(q * .0052 + vec2(t * .01, 3.)));   // (wave groups: never ruled lines)
  vec3 oc = mix(slope, uCobalt * mix(1., .62, smoothstep(150., 1100., d)), smoothstep(60., 260., d));
  float wcA = dot(q, wd), wcB = dot(q, wp);
  // the open sea is never one flat tone, from any height: the swell wrapping the ring, a longer swell crossing it, and
  // cat's paws (wind-ruffled water lying in long paler patches down the wind, darker slicks between)
  float ph2 = dot(rel, wd * .82 + wp * .57) * .027 - t * .5 + 4. * n1;
  float swell2 = sin(ph2) * clamp(1.45 - fwidth(ph2) * 2.4, 0., 1.) * (.55 + .45 * aNoise(q * .0031 + vec2(9., t * .008)));
  oc *= 1. + .16 * swell * clamp(1.75 - fw * .2, 0., 1.) + .10 * swell2 * clamp(1.7 - fw * .075, 0., 1.);   // (each only while a wave spans 7+ pixels, full from 16: broad bands, never ruled lines)
  float gust = aNoise(vec2(wcA * .0035 - t * .012, wcB * .0105 + 9.)) * .65 + aNoise(vec2(wcA * .011 - t * .03, wcB * .03 + 4.)) * .35;
  oc *= .84 + .40 * smoothstep(.25, .8, gust);
  float wcN = aNoise(vec2(wcA * .3 - t * 1.1, wcB * .05)) * .72 + aNoise(vec2(wcA * .7 - t * 1.6, wcB * .14)) * .28;
  float wc = smoothstep(.67, .80, wcN) * smoothstep(.47, .7, aNoise(vec2(wcA * .035 + 3., wcB * .017) - t * .04)) * min(uWind.z, 1.);
  float wcFar = clamp(1.5 - fw * .22, 0., 1.);   // with range the caps thin out to fewer white flecks, then none (never a haze of dim streaks)
  // lace at every range: three scales, each used only while a pixel still resolves it (crests break into streaks, not blots)
  float wl1 = aNoise(vec2(wcA * .85 - t * 1.5, wcB * .30 + 2.)), wl2 = aNoise(vec2(wcA * 2.5 - t * 2.3, wcB * 1.0 + 7.)), wl3 = aNoise(q * 6.1 + wd * t * 2.);
  float wk1 = clamp(1.6 - gLace * .8, 0., 1.), wk2 = clamp(1.6 - gLace * 2.4, 0., 1.), wk3 = clamp(1.6 - gLace * 6.5, 0., 1.);
  float wLace = mix(.7, wl1, wk1) * .5 + mix(.7, wl2, wk2) * .3 + mix(.7, wl3, wk3) * .2;
  wc *= smoothstep(.38, .66, wLace);
  col = mix(col, oc, seaM);
  wc *= smoothstep((1. - wcFar) * .9, (1. - wcFar) * .9 + .25, wc) * smoothstep(0., .15, wcFar);
  float foam = wc * seaM * smoothstep(160., 260., d) * (.5 + .5 * lace0);
  // ---- surf: breakers rolling in over the reef edge, a chalk swash line that never thins below a pixel
  float lace = lace0;
  float b = fract((d + 16. * n2) / 40. + t * .10);
  float breaker = smoothstep(0., .10, b) * (1. - smoothstep(.10, .8, b)) * lace;
  float surfEnv = (1.0 - smoothstep(118., 150., d)) * smoothstep(46., 66., d);
  float swash = 1. - smoothstep(6. + fw, 15. + 2. * fw, abs(d - 60. - 8. * (n2 - .5)));
  float surf = max(breaker * surfEnv * 1.2, swash * .9);
  // ---- the pass, the tide pouring through it and its tongue in the lagoon
  float tl = max(dl, 0.), oceanSide = max(d - 60., 0.);
  float us = s / (108. + tl * .42 + oceanSide * .5);
  float inPass = 1. - smoothstep(.82, 1.08, abs(us) + .06 * (n2 - .5));
  float tongue = inPass * (1. - smoothstep(260., 430., tl)) * (1. - smoothstep(70., 240., oceanSide));
  vec3 passC = mix(uPassCol, uCobalt, .6 * smoothstep(-120., 110., d));
  passC = mix(passC, mix(uJade, uPassCol, .45), smoothstep(0., 300., tl));
  float chan = tongue * mix(1., .55, smoothstep(40., 330., tl)) * (1. - smoothstep(30., 170., oceanSide));
  col = mix(col, passC, chan);
  vec2 rp = q - uPlate.xy;
  // ---- (sixth polish pass) the apron seaward of the pass: turquoise shallows over its sand, a soft patchy field with no
  // edge anywhere (it runs from 230 m seaward of P to the pass mouth, where the see-through water of the rip sheet takes
  // over in the same colour, so the sheet's near water is never a disc of another colour), and a paler sand lens under
  // each of the approach sharks
  float pa = dot(rp, uRipP.xy), pb = dot(rp, vec2(-uRipP.y, uRipP.x));
  float sn1 = aNoise(rp * .019 + 41.), sn2 = aNoise(rp * .055 + 5.), sn3 = aNoise(rp * .16 + 19.);
  // (seventh pass: its outline is feathered. The side and seaward edges ran on the 18 m noise at full swing over a 100 m
  // ramp and showed from the air as a lobed, blobby border against the deep blue; they now follow the slow 50 m field over
  // a ramp half as wide again, so the turquoise thins out into the cobalt with no edge to see)
  float shoal = smoothstep(-285., -140., pa + 50. * (sn1 - .5)) * (1. - smoothstep(-30., 80., pa + 70. * (sn1 - .5))) * (1. - smoothstep(28., 176., abs(pb) + 46. * (sn1 - .5) + 18. * (sn2 - .5)));
  shoal *= (.45 + .55 * smoothstep(.22, .7, sn2 * .6 + sn3 * .4)) * mix(.4, 1., smoothstep(.2, .42, uPlate.z));   // (from the opening's height a faint pale apron, no more)
  float lens = 0.;
  ${fs}
  // (seventh pass) THE SKIM: once the plate is near full size (k over 0.6, u 0.22 on) the water within some forty-five metres of
  // the lens is the pass's own deep blue again, so every shark under the surface is a dark body in clear dark water; the
  // turquoise of the shallows stays where it is seen from the air and, on the skim, out toward the islets
  { float skimK = smoothstep(.60, .80, uPlate.z) * (1. - smoothstep(18., 70., D));
    shoal *= 1. - .9 * skimK; lens *= 1. - .78 * skimK; }
  col = mix(col, mix(uJade, uMint, .36 + .3 * sn3), shoal * .68);
  col = mix(col, uMint * 1.03, lens * .6);
  float rip = sin(dot(rp, uRipP.xy) * .7854 + .8 * sin(dot(rp, vec2(-uRipP.y, uRipP.x)) * .15 + t * .3) + 2.4 * n2 + 2.2 * aNoise(rp * .08 + 31.));
  col *= 1. + .15 * rip * (.2 + .8 * smoothstep(.3, .7, aNoise(rp * .05 + vec2(t * .04, 7.)))) * (.4 + .6 * min(uWind.z, 1.)) * tongue * clamp(1.5 - fw * 2., 0., 1.);   // (broken wave groups, never ruled stripes)
  float stN = aNoise(vec2(us * 11., d * .014 + t * .22)) * (.6 + .4 * aNoise(vec2(us * 31., d * .05 + t * .6)));
  float lace2 = smoothstep(.34, .62, aNoise(q * .5 + uRipP.xy * t * 1.6) * .65 + aNoise(q * 1.7 + uRipP.xy * t * 2.4) * .35);
  float streak = smoothstep(.42, .62, stN) * tongue * (.35 + .65 * smoothstep(.2, 1., abs(us))) * mix(1., lace2, nearK);
  // (seaward of the surf line the streaks are short broken lengths of foam that thin out and are gone within 130 m: drawn to
  // 240 m in unbroken lines they fanned over the dark sea as long pale smears)
  streak *= mix(1., smoothstep(.42, .66, aNoise(vec2(us * 19., d * .055 + t * .3))), smoothstep(0., 50., oceanSide)) * (1. - smoothstep(40., 130., oceanSide));
  vec3 bo = aVoro(vec2(s, d + t * 5.) / 42. + 3.);
  float boilOn = step(.55, bo.y) * tongue * midK;
  col = mix(col, col * 1.22 + .012, (1.0 - smoothstep(.16, .40, bo.x)) * boilOn * .7);
  foam = max(foam, surf * (1. - inPass));
  // (a boil's foam rim is a ragged arc or two, wandering in radius: never a ruled ellipse, from the air least of all)
  foam = max(foam, streak * .7 + (1.0 - smoothstep(0., .07, abs(bo.x - .36 + .13 * (aNoise(q * .09 + 3.) - .5)))) * smoothstep(.42, .62, aNoise(q * .045 + vec2(17., t * .05))) * boilOn * .3 * lace2);
  // ---- (sixth polish pass) the race from the air: where the tide draws in to the pass its two edges show as lines of foam
  // that converge from 80 m either side, 170 m out, to the pass mouth (three lines a side, 10 m apart, broken into
  // lengths), and two standing crests stand across it between them, 78 and 128 m seaward of P, each a broken line of
  // foam bent back like a chevron with a dark trough on its seaward side. All of it is the from-the-air drawing of the
  // rip: it fades as the plate comes up to size (k 0.62 to 0.8), where the sheet's own waves, bar and lace take over, and
  // from very high it thins to a faint trace.
  { float aw = pa + 12. * (sn2 - .5), bw = abs(pb + 16. * (sn1 - .5) + 5. * (sn3 - .5));
    float eB = 22. + 63. * clamp((10. - aw) / 180., 0., 1.25), sv = (bw - eB) / 10., si = floor(sv + .5), eW = min(max(.13, fw * .14), .3);
    // (seventh pass: each line is a ragged run of lace, not an even stroke. Its width swells and thins along its length,
    // half to one and a half times, on a 6 m noise; a finer field tears gaps in it; it is brighter on its outer side and
    // falls to the foam's blue-violet shadow inside; and it fades over the last third of each run instead of ending round)
    float eRun = aNoise(vec2(aw * .07 - t * .12, si * 7.3 + sign(pb) * 3.1)) * .65 + aNoise(rp * .21 + 13.) * .35;
    float eRag = aNoise(vec2(aw * .17 + si * 3.7, bw * .21 + 9.)), eLace = aNoise(rp * .47 + vec2(23., t * .05)) * .6 + aNoise(rp * 1.1 + 5.) * .4;
    float eWv = eW * mix(.6, 1.8, eRag), eS = sv - si;
    float eL = (1. - smoothstep(eWv * (eS < 0. ? 1.7 : .8), eWv * (eS < 0. ? 1.7 : .8) + .1 + fw * .05, abs(eS))) * mix(1., .6, smoothstep(0., eWv * 1.7, -eS)) * (1. - smoothstep(.6, 1.6, abs(si - .2)));
    eL *= smoothstep(-215., -165., aw) * (1. - smoothstep(-20., 25., aw));
    eL *= smoothstep(.36, .58, eRun) * mix(.5, 1., smoothstep(.46, .60, eRun)) * (.5 + .5 * smoothstep(.26, .50, eLace));
    float cr = 0., crSh = 0., cW = max(1.5, fw * 1.1);
    for (int j = 0; j < 2; j++) {
      float A = j == 0 ? -78. : -128., dC = aw - (A + .16 * bw) - 2.5 * sin(pb * .21 + float(j) * 2.);
      float within = 1. - smoothstep(eB - 16., eB - 4., bw);
      // (a crest's foam is sharp on its seaward lip and trails off down its back in torn lace; its width wanders)
      float cRun = aNoise(vec2(pb * .085 + t * .08, A * .37)) * .6 + aNoise(rp * .27 + 7.) * .4, cWv = cW * mix(.55, 1.5, aNoise(vec2(pb * .19 + A, aw * .13)));
      float cD = dC < 0. ? -dC * 1.6 : dC * .7;
      cr = max(cr, (1. - smoothstep(cWv * .6, cWv + 1.2 + fw, cD)) * mix(1., .6, smoothstep(0., cWv, dC)) * within * smoothstep(.32, .54, cRun) * mix(.55, 1., smoothstep(.40, .56, cRun)) * (.5 + .5 * smoothstep(.24, .50, eLace)));
      crSh += within * (smoothstep(1.5, 4., dC) * (1. - smoothstep(4., 11., dC)) * .6 - smoothstep(-10., -4., dC) * (1. - smoothstep(-4., -1., dC)));
    }
    float airK = smoothstep(.15, .4, fw) * (1. - smoothstep(.62, .8, uPlate.z)) * clamp(2.6 / max(fw, 1e-3), 0., 1.);
    col *= 1. + .16 * crSh * airK;
    foam = max(foam, max(eL * .8, cr) * airK * (.6 + .4 * lace0)); }
  // ---- the canoe's wake
  float wk = max(wakeOf(uCanoe, q, fw, 1.), .62 * max(wakeOf(uCanoe2, q, fw, .5), wakeOf(uCanoe3, q, fw, .5)));
  foam = max(foam, wk * lace * .8);
  // ---- islets: the sand they stand on, and the shadows they throw
  col = mix(col, uSand * (.92 + .1 * n3), smoothstep(-1.3, -.15, hI) * .9);
  vec2 rel2 = rel + uSunA.xy * 9.; float th2 = atan(rel2.y, abs(rel2.x) < 1e-4 ? 1e-4 : rel2.x);
  float h2 = islH(islA(th2, angDiff(th2 - uRing.w) * uRing.z), length(rel2) - ringR(th2));
  col *= mix(vec3(1.), uShadowTint, smoothstep(.9, 2.2, h2) * .6);
  // ---- cloud shadows (jade blots) and the squall's shadow
  float cs = smoothstep(.52, .72, aFbm((q + wd * t * 34.) * .0013 + 5.));   // (34 m/s: from the air the blots visibly slide over the lagoon)
  col *= mix(vec3(1.), vec3(.60, .76, .74), min(1., cs * uWind.w * (1. + .8 * (1. - smoothstep(.2, .45, uPlate.z)))));   // (deeper in the opening view, while the plate is small)
  vec2 sq = (q - uSquall.xy) / max(uSquall.z, 1.);
  col *= mix(vec3(1.), vec3(.27, .34, .40), uSquall.w * (1. - smoothstep(.5, 1.1, length(sq) + .2 * (n1 - .5))));
  // ---- light, foam, sky reflection, sparkle, haze
  col *= uLit;
  float closeK = clamp(1.5 - gLace * 5., 0., 1.);
  float lace3 = smoothstep(.24, .52, aNoise(q * 3.3 + uRipP.xy * t * 2.) * .6 + aNoise(q * 8.1 - uRipP.xy * t * 1.3) * .4);
  foam = clamp(foam, 0., 1.) * mix(1., lace3, closeK) * gNet;
  // foam keeps blue-violet shadow inside it and never goes to flat white
  float fShade = mix(.75, aNoise(q * .8 + 3. - wd * t * .6) * .6 + aNoise(q * 2.9 + wd * t) * .4, clamp(1.6 - gLace * 1.8, 0., 1.));
  col = mix(col, mix(uFoamSh, uFoam, smoothstep(.3, .95, foam) * smoothstep(.2, .7, fShade)) * uLit, foam * .84);
  // ripples only once the plate is near full size and while a wave still spans several pixels (else they moire)
  float kK = smoothstep(.45, .95, uPlate.z);
  vec3 N = Ng; float rpl = kK * clamp(1.5 - fw, 0., 1.) * (.25 + .75 * uWind.z);
  N.xz += rpl * .10 * vec2(sin(q.x * 1.9 + t * 1.7 + sin(q.y * 1.3 - t) * 1.2), sin(q.y * 2.3 - t * 1.4 + sin(q.x * 1.1 + t * .8) * 1.3));
  N.xz += kK * clamp(1.4 - fw * 2.5, 0., 1.) * .07 * vec2(sin(q.x * 5.3 + t * 2.9 + sin(q.y * 4.1 - t)), sin(q.y * 6.1 - t * 2.3 + sin(q.x * 3.7 + t)));
  // capillary ripples in the last few metres before the lens, so the face of a wave is never one flat tone
  N.xz += kK * clamp(1.4 - fw * 14., 0., 1.) * .055 * vec2(sin(q.x * 17. + t * 4.1 + 1.7 * sin(q.y * 11. - t * 1.3)), sin(q.y * 21. - t * 3.7 + 1.5 * sin(q.x * 13. + t * 1.1)));
  col *= 1. + .1 * nearK * (aNoise(q * 1.3 + uRipP.xy * t * 1.2) - .5);
  N = normalize(N);
  float ndv = clamp(dot(N, V), 0., 1.), om = 1. - ndv, fr = .02 + .98 * om * om * om * om * om;
  vec3 Rv = reflect(-V, N);
  vec3 sky = mix(uSkyHor, uSkyZen, pow(clamp(Rv.y, 0., 1.), .45));
  col = mix(col, sky, clamp(fr * uSunA.w, 0., 1.) * (1. - .85 * foam) * (1. - .5 * max(shoal * .9, lens)));   // (the shallows keep their colour under the sky's glare)
  float sp = aNoise(q * 2.3 + vec2(t * 1.3, -t * .9)) * aNoise(q * .83 - vec2(t * .5, t * .7));
  float glit = mix(1., smoothstep(.5, .78, aNoise(q * 7.3 + vec2(t * 2.1, -t * 1.6))), clamp(1.5 - fw * 4., 0., 1.)) * mix(1., 1.6 * smoothstep(.5, .8, aNoise(q * 23. - vec2(t * 3.3, t * 2.7))), clamp(1.5 - fw * 12., 0., 1.));   // near the lens a glint is glitter, not a white patch
  float nearG = smoothstep(3., 9., D);   // the last few metres before the lens are glass: there a glint is a pin-point, never a patch
  col += uSunCol * 1.1 * smoothstep(.60, .78, sp) * glit * clamp(1.4 - fw * 3.5, 0., 1.) * (1. - foam) * (.3 + .7 * min(uWind.z, 1.)) * nearG;   // sparkle only where a glint spans a pixel (no salt-and-pepper from the air)
  float pin = smoothstep(.80, .93, aNoise(q * 57. + vec2(t * 3.7, -t * 3.1))) * smoothstep(.45, .7, sp);
  col += uSunCol * .9 * pin * (1. - nearG) * clamp(1.5 - fw * 60., 0., 1.) * (1. - foam) * (.3 + .7 * min(uWind.z, 1.));
  col = mix(col, uHazeCol, 1. - exp(-D * uSunA.z));
  foamOut = foam;
  return col;
}`,bo=`
varying vec3 vW;
void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,ps=`
uniform vec4 uRip;     // rip sheet centre x, z (plate), radius, disc radius
varying vec3 vW;
${st}
${qa}
${xo}
void main(){
  float k = max(uPlate.z, .01);
  vec2 q = uPlate.xy + (vW.xz - uPlate.xy) / k;
  if (length(q - uRip.xy) < uRip.z * .9) discard;
  vec3 toEye = cameraPosition - vW; float dist = length(toEye);
  float fw = max(length(dFdx(q)), length(dFdy(q)));
  gLace = sqrt(length(dFdx(q)) * length(dFdy(q)));
  float foam; vec3 col = seaShade(q, vec3(0., 1., 0.), toEye / max(dist, 1e-3), dist / k, fw, foam);
  col = mix(col, uHazeCol, smoothstep(.5, .97, dist / uRip.w));
  gl_FragColor = vec4(col, 1.);
}`,ds=`
uniform vec4 uRip;
varying vec3 vW, vN; varying vec2 vQ; varying float vH;
${qa}
void main(){
  vec2 q = position.xz; float t = uPlate.w;
  float edge = 1. - smoothstep(uRip.z * .72, uRip.z * .9, length(q - uRip.xy));
  float h = ripH(q, t) * edge, e = .35;
  float hx = ripH(q + vec2(e, 0.), t) * edge, hz = ripH(q + vec2(0., e), t) * edge;
  vN = normalize(vec3(h - hx, e, h - hz));
  vec4 w = modelMatrix * vec4(q.x, h + .03, q.y, 1.); vW = w.xyz; vQ = q; vH = h;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,ms=`
uniform vec4 uRip;
varying vec3 vW, vN; varying vec2 vQ; varying float vH;
${st}
${qa}
${xo}
// foam lace: 1 on the lines between cells of open water (distance between the two nearest cell centres), 0 inside them
float ripNet(vec2 p, float w){
  vec2 i = floor(p), f = fract(p); float f1 = 9., f2 = 9.;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y)); vec2 o = vec2(aHash(i + g), aHash(i + g + 71.3));
    float dd = length(g + .15 + .7 * o - f);
    if (dd < f1) { f2 = f1; f1 = dd; } else if (dd < f2) { f2 = dd; }
  }
  return 1. - smoothstep(.01, w, f2 - f1);
}
void main(){
  float k = max(uPlate.z, .01), t = uPlate.w;
  vec3 toEye = cameraPosition - vW; float dist = length(toEye); vec3 V = toEye / max(dist, 1e-3);
  float fw = max(length(dFdx(vQ)), length(dFdy(vQ)));
  gLace = sqrt(length(dFdx(vQ)) * length(dFdy(vQ)));
  // (a standing wave under a few pixels wide is flat water to the painter: its tilted faces would mirror the sky in ruled lines)
  vec3 N = normalize(mix(vN, vec3(0., 1., 0.), clamp(fw * 2.2 - .5, 0., 1.)));
  // at close range foam is a net of lines round cells of open water, never a sheet: a coarse net while a 30 cm line
  // still spans a pixel, finer strands inside it nearer still, and within a few metres of the lens only broken lace
  vec2 fl = vQ - uRipP.xy * t * 3.2;
  float warp = aNoise(fl * .7), nearF = smoothstep(1.5, 6., dist);
  float kC = clamp(1.6 - gLace * 7., 0., 1.), kF = clamp(1.6 - gLace * 22., 0., 1.);
  // (the net is read through a second, finer warp, so every strand wanders: no straight bar between two junctions; a strand
  // is a few centimetres wide, never thinner than a pixel and a half, and under a third of each survives the break-up)
  vec2 fn = fl + .35 * vec2(aNoise(fl * 2.3), aNoise(fl * 2.3 + 17.)) + .12 * vec2(aNoise(fl * 6.1 + 3.), aNoise(fl * 6.1 + 29.));
  float netC = ripNet(fn * .42 + .6 * warp, max(.045, gLace * .42 * 1.6)), netF = ripNet(fn * 1.3 + 3.1 + .5 * warp, max(.045, gLace * 1.3 * 1.6));
  float net = mix(1., max(netC, kF * .75 * netF) * smoothstep(.50, .70, aNoise(fl * 1.9 + 5.) * .6 + warp * .4), kC);   // (the lines are broken, never a full net)
  gNet = net * nearF;
  // (sixth polish pass) a short-crested chop rides the standing waves within some forty metres of the lens: their faces
  // mirrored the sky in unbroken bands from one side of the frame to the other; now each band is irregular flecks
  { float chopK = smoothstep(.45, .95, k) * clamp(1.8 - fw * .45, 0., 1.);
    N = normalize(N + chopK * .36 * vec3(aNoise(fl * .37 + 3.) + .6 * aNoise(fl * 1.1 + 11.) - .8, 0., aNoise(fl * .37 + 47.) + .6 * aNoise(fl * 1.1 + 23.) - .8)); }
  float foam; vec3 col = seaShade(vQ, N, V, dist / k, fw, foam);
  // relief: faces toward the sun lift, troughs deepen, foam lace rides the crests while the water races through
  float ndl = clamp(dot(N, uSunDir), 0., 1.);
  // (the relief and the see-through water are a close-range affair: from the air the sheet must match the painted sea round it)
  // (its feather is wide: the relief dies away from a quarter of the sheet's radius out, and with it the standing waves' shading
  // where a wave is under a few pixels; the waves come in groups, not as ruled stripes)
  float rimK = smoothstep(uRip.z * .25, uRip.z * .9, length(vQ - uRip.xy)), farK = max(rimK, smoothstep(60., 150., dist) * (1. - smoothstep(.45, .95, k)));
  float grp = .45 + .55 * smoothstep(.25, .7, aNoise(vQ * .05 + vec2(t * .04, 7.)));
  col *= mix(.66 + .3 * ndl + .42 * vH * grp, 1., max(farK, 1. - clamp(1.7 - fw * 2.2, 0., 1.)));
  vec2 fa = vec2(dot(fl, uRipP.xy) * .4, dot(fl, vec2(-uRipP.y, uRipP.x)));       // streaks drawn out along the flow
  // the near face of a wave is glass: deeper blue in the trough, sky toward the crest, sun glitter scattered along the crest
  float nearW = (1. - smoothstep(8., 34., dist)) * (1. - farK);
  col *= mix(vec3(1.), mix(vec3(.55, .72, .95), vec3(1.15, 1.11, 1.04), smoothstep(-.22, .34, vH)), nearW);
  float crest = smoothstep(.24, .36, vH) * smoothstep(.56, .8, aNoise(fl * 5.3 + 2.) * .6 + aNoise(fl * 13. + 7.) * .4);
  col += uSunCol * .45 * crest * nearW * clamp(1.5 - fw * 6., 0., 1.) * smoothstep(3., 8., dist);
  float cf = smoothstep(.19, .34, vH) * smoothstep(.38, .72, aNoise(fa * .6) * .6 + aNoise(fa * 1.7) * .4) * clamp(1.5 - fw * .6, 0., 1.);
  cf *= mix(1., smoothstep(.34, .62, aNoise(fa * 1.9 + 4.) * .55 + aNoise(fl * 3.1) * .45), clamp(1.6 - gLace * 2.2, 0., 1.));
  cf *= mix(1., smoothstep(.3, .6, aNoise(fl * 3.9) * .6 + aNoise(fl * 8.7) * .4), clamp(1.6 - gLace * 6., 0., 1.));
  // (from the air the crest foam comes in broken groups: a slow field leaves under half of the channel foamed, no run of
  // crest longer than some thirty metres, and the whole term is gone before a wave is two pixels wide)
  cf *= mix(1., smoothstep(.46, .66, aNoise(vQ * .041 + vec2(t * .03, 11.)) * .7 + aNoise(vQ * .13 + 5.) * .3), smoothstep(.12, .5, fw)) * clamp(1.5 - fw * 1.2, 0., 1.);
  cf *= net * nearF;
  // the bar: the standing crests the skim crosses short of the pass mouth break in a line of foam, in pieces a few metres
  // long that ride the crest as it wanders (drawn only while a crest is several pixels deep: never a ruled line from the air)
  vec2 brl = vQ - uPlate.xy; float ba = dot(brl, uRipP.xy), bb = dot(brl, vec2(-uRipP.y, uRipP.x));
  float bar = smoothstep(.80, .95, sin(ba * .7854 + .8 * sin(bb * .15 + t * .3))) * smoothstep(-91., -87., ba) * (1. - smoothstep(-69., -65., ba)) * exp(-bb * bb / 500.);
  bar *= smoothstep(.40, .62, aNoise(vec2(bb * .45 + t * .5, ba * .35)) * .65 + aNoise(fl * 2.9 + 31.) * .35);
  bar *= (.55 + .45 * smoothstep(.3, .7, aNoise(fl * 7.3 + 9.))) * clamp(1.6 - fw * 4., 0., 1.) * smoothstep(2., 5., dist) * (1. - farK);
  cf = max(cf, bar);
  col = mix(col, mix(uFoamSh, uFoam, smoothstep(.15, .8, cf)) * uLit, cf * .72);
  float ndv = clamp(dot(N, V), 0., 1.), om = 1. - ndv;
  float edgeA = smoothstep(uRip.z * .78, uRip.z * .9, length(vQ - uRip.xy));
  // (see-through only within some thirty metres of the lens: further off, and from the air, the sheet is the painted sea,
  // so the pass never shows as a disc of another colour)
  float alpha = max(max(max(mix(.30, .95, om * om * om), max(foam, cf)), edgeA), smoothstep(22., 64., dist));
  gl_FragColor = vec4(col, alpha);
}`,vs=`
uniform vec4 uSpl[12]; attribute vec3 aQ;
varying vec3 vQ; varying float vAge;
void main(){
  vec4 s = uSpl[int(aQ.z + .5)]; float g = clamp(s.w / .8, 0., 1.);
  float w = .3 + .7 * g, h = .35 + 1.9 * g - 1.5 * g * g;        // it widens as it rises and falls back
  vec3 rt = normalize(vec3(viewMatrix[0][0], 0., viewMatrix[2][0]) + vec3(1e-5, 0., 0.));
  vec3 p = vec3(s.x, .02, s.y) + rt * (aQ.x * w) + vec3(0., aQ.y * h, 0.);
  if (s.w < 0.) p = vec3(0., -999., 0.);
  vQ = aQ; vAge = g;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
}`,gs=`
uniform vec3 uCol; varying vec3 vQ; varying float vAge;
${st}
void main(){
  float fan = 1. - smoothstep(.55, 1., abs(vQ.x) / max(.3 + .7 * vQ.y, .05));
  vec2 q = vec2(vQ.x * 13., vQ.y * 17. - vAge * 7.) + vQ.z * 13.7;
  float drops = smoothstep(.42, .68, aNoise(q) * .55 + aNoise(q * 2.7 + 7.) * .45);        // (droplets a few centimetres across)
  float a = fan * max(drops * (.5 + .5 * vQ.y), .5 * (1. - vQ.y) * (1. - vQ.y) * (1. - abs(vQ.x))) * (1. - smoothstep(.7, 1., vQ.y)) * (1. - smoothstep(.45, 1., vAge)) * smoothstep(0., .08, vAge + .02);
  if (a < .02) discard;
  gl_FragColor = vec4(uCol, min(1., a * 1.15));
}`,ws=`
uniform vec3 uPassCol, uLit; uniform vec4 uPlate; uniform float uBedK;
varying vec3 vW;
${st}
void main(){
  vec2 q = uPlate.xy + (vW.xz - uPlate.xy) / max(uPlate.z, .01);
  float n = aFbm(q * .06), c = aNoise(q * .5 + uPlate.w * .4) * aNoise(q * .23 - uPlate.w * .3);
  vec3 col = mix(vec3(.016, .13, .24), vec3(.04, .25, .35), n) + vec3(.10, .32, .34) * smoothstep(.3, .6, c) * .3;
  col = mix(col, uPassCol * (.55 + .5 * n) + col * .25, uBedK);   // (dawn, golden: the bed takes the pass's own slate-teal)
  gl_FragColor = vec4(col * uLit, 1.);
}`,ys=`
varying vec3 vW, vN; varying vec2 vQ; varying float vH;
void main(){ vQ = position.xz; vH = position.y; vN = normalize(mat3(modelMatrix) * normal);
  vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,xs=`
uniform vec3 uSand, uSunDir, uSunCol, uAmb, uHazeCol, uShadowTint; uniform vec4 uPlate, uSunA;
varying vec3 vW, vN; varying vec2 vQ; varying float vH;
${st}
void main(){
  float n = aFbm(vQ * .05), n3 = aNoise(vQ * .6), n4 = aNoise(vQ * .21 + 7.);
  float tH = vH + .5 * (n - .5);
  vec3 alb = uSand * (.82 + .2 * n3) * mix(.72, 1., smoothstep(.0, .35, vH));          // wet sand at the waterline
  alb = mix(alb, vec3(.33, .46, .19) * (.8 + .4 * n3), smoothstep(.85, 1.25, tH));  // naupaka fringe
  alb = mix(alb, vec3(.065, .135, .06) * (.6 + .9 * n4), smoothstep(1.3, 1.9, tH)); // pisonia scrub
  alb = mix(alb, alb * uShadowTint, smoothstep(.45, .7, n4) * smoothstep(1., 1.6, tH) * .7);
  vec3 N = normalize(vN + vec3(n3 - .5, 0., n4 - .5) * .5 * smoothstep(1., 1.8, tH));
  vec3 col = alb * (uSunCol * clamp(dot(N, uSunDir), 0., 1.) + uAmb);
  float D = length(cameraPosition - vW) / max(uPlate.z, .01);
  gl_FragColor = vec4(mix(col, uHazeCol, 1. - exp(-D * uSunA.z)), 1.);
}`,bs=`
attribute vec3 aCol3; attribute float aWind;
uniform vec4 uPlate, uWind;
varying vec3 vW, vN, vC;
void main(){
  vec4 p = vec4(position, 1.); vec3 n = normal;
  #ifdef USE_INSTANCING
  p = instanceMatrix * p; n = mat3(instanceMatrix) * n;
  #endif
  float ph = p.x * .05 + p.z * .07, t = uPlate.w;
  float g = aWind * (.5 + uWind.z);
  p.xz += uWind.xy * g * (.7 + .6 * sin(t * 1.9 + ph) + .3 * sin(t * 4.3 + ph * 3.));
  p.y -= g * .3 * (.5 + .5 * sin(t * 1.9 + ph));
  vec4 w = modelMatrix * p; vW = w.xyz; vN = normalize(mat3(modelMatrix) * n); vC = aCol3;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,zs=`
uniform vec3 uSunDir, uSunCol, uAmb, uBounce, uHazeCol; uniform vec4 uPlate, uSunA;
varying vec3 vW, vN, vC;
void main(){
  vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
  float ndl = clamp(dot(N, uSunDir) * .7 + .3, 0., 1.);
  vec3 col = vC * (uSunCol * ndl + uAmb * (.6 + .4 * N.y) + uBounce * clamp(-N.y, 0., 1.));
  float D = length(cameraPosition - vW) / max(uPlate.z, .01);
  gl_FragColor = vec4(mix(col, uHazeCol, 1. - exp(-D * uSunA.z)), 1.);
}`,Ms=`
attribute vec4 iA, iB;   // x y z length | phase, beat Hz, yaw jitter, -
uniform vec4 uPlate, uRipP;
varying vec3 vN; varying float vDepth;
void main(){
  float t = uPlate.w, t01 = .5 - position.z; vec3 p = position;
  p.x += (.012 + .085 * t01 * t01) * sin(t * 6.2832 * iB.y + iB.x * 6.2832 - t01 * 4.2);
  float cy = cos(iB.z), sy = sin(iB.z); vec2 f = -uRipP.xy;
  vec3 fw3 = vec3(f.x * cy - f.y * sy, 0., f.x * sy + f.y * cy), rt = vec3(fw3.z, 0., -fw3.x);
  vec3 C = iA.xyz + fw3 * (.8 * sin(t * .23 + iB.x * 20.)) + rt * (1.1 * sin(t * .17 + iB.x * 31.));
  vec3 lp = C + (rt * p.x + vec3(0., p.y, 0.) + fw3 * p.z) * iA.w;
  vN = normalize(rt * normal.x + vec3(0., normal.y, 0.) + fw3 * normal.z); vDepth = -lp.y;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(lp, 1.);
}`,Ss=`
uniform vec3 uSharkCol, uWaterCol;
varying vec3 vN; varying float vDepth;
void main(){
  // seen from above: a dark slate back, a paler flank, light rippling along the spine; the water takes it with depth
  float up = normalize(vN).y;
  vec3 c = mix(uSharkCol * 1.9, uSharkCol * .62, smoothstep(-.1, .75, up));
  c += uSharkCol * .9 * smoothstep(.86, 1., up);
  gl_FragColor = vec4(mix(c * .84, uWaterCol, clamp(vDepth * .07 + .02, 0., .5)), 1.);   // (seventh pass: a fifth darker and less taken by the water: dark slate bodies under the skim, not pale ghosts)
}`,ks=`
attribute vec4 iA, iB;
uniform vec4 uPlate, uRipP;
varying vec3 vN; varying float vDepth, vA;
void main(){
  float t = uPlate.w, t01 = .5 - position.z; vec3 p = position;
  p.x += (.012 + .085 * t01 * t01) * sin(t * 6.2832 * iB.y + iB.x * 6.2832 - t01 * 4.2);
  float cy = cos(iB.z), sy = sin(iB.z); vec2 f = -uRipP.xy;
  vec3 fw3 = vec3(f.x * cy - f.y * sy, 0., f.x * sy + f.y * cy), rt = vec3(fw3.z, 0., -fw3.x);
  vec3 C = iA.xyz + fw3 * (.8 * sin(t * .23 + iB.x * 20.)) + rt * (1.1 * sin(t * .17 + iB.x * 31.));
  float dist = distance(cameraPosition, (modelMatrix * vec4(C, 1.)).xyz);
  float L = max(iA.w, min(.19 * dist, 12.5) / max(uPlate.z, .1));
  vec3 lp = C + (rt * p.x + fw3 * p.z) * L + vec3(0., p.y * iA.w * 1.4, 0.);
  vN = normalize(rt * normal.x + vec3(0., normal.y, 0.) + fw3 * normal.z); vDepth = -lp.y; vA = 1. - smoothstep(62., 100., dist);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(lp, 1.);
}`,As=`
uniform vec3 uSharkCol, uWaterCol;
varying vec3 vN; varying float vDepth, vA;
void main(){
  float up = normalize(vN).y;
  vec3 c = mix(uSharkCol * 1.9, uSharkCol * .62, smoothstep(-.1, .75, up));
  c += uSharkCol * .9 * smoothstep(.86, 1., up);
  gl_FragColor = vec4(mix(c, uWaterCol, clamp(vDepth * .10 + .16, 0., .6)), .86 * vA);
}`,Cs=`
attribute vec4 aA; attribute vec2 aB;   // top x, z, length, width | phase, gain
uniform vec3 uRayDir; uniform float uT;
varying vec2 vQ; varying float vI, vSeed, vD;
void main(){
  vec3 top = vec3(aA.x + 1.2 * sin(uT * .07 + aB.x * 40.), 0., aA.y + 1.2 * sin(uT * .06 + aB.x * 71.));
  vec3 mid = top + uRayDir * aA.z * .5;
  vec3 side = normalize(cross(uRayDir, cameraPosition - mid));
  vec3 wp = top + uRayDir * (aA.z * position.y) + side * (position.x * aA.w * (.5 + .9 * position.y));
  float flick = .68 + .32 * sin(uT * (.3 + .4 * aB.x) + aB.x * 6.2831) * sin(uT * .21 + aB.x * 40.);
  vI = aB.y * flick * smoothstep(2., 11., length(cross(cameraPosition - top, uRayDir)));
  vQ = position.xy; vSeed = aB.x;
  vec4 mv = viewMatrix * vec4(wp, 1.); vD = length(mv.xyz); gl_Position = projectionMatrix * mv;
}`,Fs=`
uniform vec3 uRayColor; uniform float uFogK;
varying vec2 vQ; varying float vI, vSeed, vD;
void main(){
  float x = vQ.x, e = 1. - x * x, o = x - .3 * sin(vSeed * 37.);
  float prof = (exp(-x * x * 3.2) + .3 * exp(-o * o * 12.)) * e * e;
  float len = smoothstep(0., .14, vQ.y) * pow(clamp(1. - vQ.y, 0., 1.), 1.7);
  gl_FragColor = vec4(uRayColor * (prof * len * vI * exp(-vD * uFogK)), 1.);
}`,Da=`
uniform vec3 uSunDir, uSunCol, uSkyL, uDeepL; uniform float uSurfY;
vec3 uwLight(vec3 alb, vec3 N, float y){
  float dl = exp(-max(uSurfY - y, 0.) * .028);
  float ndl = clamp((dot(N, uSunDir) + .3) / 1.3, 0., 1.);
  return alb * (uSunCol * dl * ndl + mix(uDeepL, uSkyL, N.y * .5 + .5) * (.5 + .5 * dl));
}`,Ns=`
attribute vec4 iA, iB;   // hover: home xyz, size | phase, wall angle, flinch gain, beat Hz.  stream: side, up, -, size | phase, along, -, Hz
uniform float uT, uMode, uHeadA, uFlinch, uSchoolK;
uniform vec3 uCam, uSchoolPos, uSchoolDir;
varying vec3 vN, vM; varying float vPh, vY;
#include <fog_pars_vertex>
void main(){
  float ph = iB.x, t01 = .5 - position.z, sc = iA.w; vec3 p = position;
  p.x += (.01 + .09 * t01 * t01) * sin(uT * 6.2832 * iB.w + ph * 6.2832 - t01 * 3.6);
  vec3 fwd, C;
  if (uMode < .5) {
    float a = uHeadA + .16 * sin(uT * .9 + ph * 40.); fwd = vec3(sin(a), 0., cos(a));
    C = iA.xyz + vec3(sin(uT * .7 + ph * 30.), sin(uT * .9 + ph * 50.), sin(uT * .6 + ph * 70.)) * .22;
    float fl = (1. - smoothstep(4.5, 11., length(C - uCam))) * uFlinch * iB.z;
    C += vec3(cos(iB.y), -.25, sin(iB.y)) * fl * 1.5; sc *= 1. - .45 * fl;
  } else {
    fwd = normalize(uSchoolDir + vec3(0., 0., 1e-5));
    vec3 r0 = normalize(vec3(fwd.z, 0., -fwd.x) + vec3(1e-5, 0., 0.));
    C = uSchoolPos + fwd * iB.y + r0 * (iA.x + .5 * sin(uT * .8 + iB.y * .15)) + vec3(0., iA.y + .3 * sin(uT * .6 + iB.y * .2), 0.);
    sc *= uSchoolK;
  }
  vec3 rt = normalize(vec3(fwd.z, 0., -fwd.x) + vec3(1e-5, 0., 0.)), up = cross(fwd, rt);
  vec3 lp = C + (rt * p.x + up * p.y + fwd * p.z) * sc;
  vN = normalize(rt * normal.x + up * normal.y + fwd * normal.z); vM = position; vPh = ph; vY = lp.y;
  vec4 mvPosition = modelViewMatrix * vec4(lp, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ps=`
uniform vec3 uTop, uSide, uBelly, uTail; uniform vec4 uStripe; uniform float uPattern, uGlow;
varying vec3 vN, vM; varying float vPh, vY;
#include <fog_pars_fragment>
${Da}
void main(){
  vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
  float y = vM.y;
  vec3 alb = mix(uBelly, uSide, smoothstep(-.07, -.005, y));
  alb = mix(alb, uTop, smoothstep(.02, .075, y));
  alb = mix(alb, uStripe.rgb, uStripe.a * (1. - smoothstep(.010, .028, abs(y - .04 - vM.z * .03))));
  alb = mix(alb, uTail, (1.0 - smoothstep(-.42, -.30, vM.z)));
  alb *= .82 + .36 * fract(vPh * 7.3);
  float sc = sin(vM.z * 95.) * sin(y * 120. + vM.z * 40.);
  alb *= 1. - uPattern * (.22 * smoothstep(0., .6, sc) + .25 * (1. - smoothstep(.0, .012, abs(y - .02 - .5 * (vM.z - .3) * (vM.z - .3)))) * step(.2, vM.z));
  float eye = length(vec2(vM.z - .345, (y - .04) * 1.15));
  alb = mix(alb, vec3(.9, .8, .4), step(.01, uPattern) * (1. - smoothstep(.022, .028, eye)));
  alb = mix(alb, vec3(.015), step(.01, uPattern) * (1. - smoothstep(.011, .016, eye)));
  gl_FragColor = vec4(uwLight(alb, N, vY) + alb * uGlow, 1.);   // uGlow: the anthias hold their orange in the blue
  #include <fog_fragment>
}`,Rs=`
attribute vec3 aSide;    // in-plane offset direction x, y; half width (m at scale 1)
attribute float aFlex;   // 0 at the holdfast .. 1 at the tips
attribute vec4 iA, iB;   // xyz, scale | yaw of the fan plane, phase, tint, -
uniform float uT, uPix, uSinkOn;
uniform vec3 uFlowV, uCam, uBend;   // bend amount, slow flutter, fast flutter
varying float vTint, vFlex, vY; varying vec3 vN;
#include <fog_pars_vertex>
void main(){
  float sc = iA.w, cy = cos(iB.x), sy = sin(iB.x), sink = 1.;
  vec3 ax = vec3(cy, 0., -sy), az = vec3(sy, 0., cy);
  if (uSinkOn > .5) sink = .06 + .94 * smoothstep(7., 17., length(iA.xyz - uCam));
  vec3 wp = iA.xyz + ax * (position.x * sc) + vec3(0., position.y * sc * sink, 0.);
  float fl = aFlex * sc * sink;
  float flut = sin(uT * 2.3 + iB.y * 6.28 + position.y * 1.7) * uBend.y + sin(uT * 5.1 + iB.y * 9. + position.x * 3.) * uBend.z;
  wp += uFlowV * fl * (uBend.x + flut); wp.y -= fl * uBend.x * .35;
  vec4 mv = viewMatrix * modelMatrix * vec4(wp, 1.);
  float wHalf = max(aSide.z * sc, -mv.z * uPix * .8);
  wp += (ax * aSide.x + vec3(0., aSide.y, 0.)) * wHalf;
  vN = az; vTint = iB.z; vFlex = aFlex; vY = wp.y;
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(wp, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Bs=`
uniform vec3 uColA, uColB, uColC;
varying float vTint, vFlex, vY; varying vec3 vN;
#include <fog_pars_fragment>
${Da}
void main(){
  vec3 alb = mix(uColA, uColB, smoothstep(.2, .55, vTint)); alb = mix(alb, uColC, smoothstep(.6, .9, vTint));
  alb *= .55 + .7 * vFlex;
  vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
  N = normalize(N + vec3(0., .7, 0.));
  // (a red fan in blue light goes black: it keeps a floor of the water's own light on a greyed albedo, so in the dim looks
  // it is a deep plum or teal shape a step or two darker than the wall behind, with paler tips)
  vec3 c = max(uwLight(alb, N, vY), (alb * .6 + .075) * (uSkyL * .5 + uDeepL * .6));
  c += (alb * .5 + .06) * uSkyL * .45 * vFlex * vFlex;
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`,zo=`
attribute vec3 aUV;      // signed span fraction -1..1, chord 0 (leading edge) .. 1 (trailing), +1 back / -1 belly / 2 lobes and tail / 3 the hero's whip (aUV.y: disc lengths from its root)
uniform float uT, uFlap, uSpan;
varying vec3 vN, vUV, vWp; varying float vY, vUp;
#include <fog_pars_vertex>
void main(){
  vec3 p = position, n = normal;
  // (seventh pass) the cephalic lobes are tagged with a span of 0.9 so that the fragment shader knows them: they rode the
  // wing beat with the wingtips, up to 1.1 m above and below the head they belong to (a pale bar adrift beside it).
  // They now beat with the body where they are rooted: their true span fraction, at the leading edge.
  bool lob = aUV.z > 1.5 && abs(aUV.x) > .5;
  float w = lob ? abs(position.x) / max(uSpan, .01) : abs(aUV.x), sg = aUV.x < 0. ? -1. : 1.;
  float ph = uT * 2.0 - w * 1.9 - (lob ? 0. : aUV.y) * .6;
  p.y += uFlap * w * w * sin(ph);
  // the hero's whip sways with the body's own beat: the wave that leaves the hind edge (0.6 behind the lip) runs on down it at the
  // wings' own lag (1.9, here to a disc length), growing to a quarter of the wingtips' beat one disc length out and no more beyond
  if (aUV.z > 2.5) { float wy = min(aUV.y, 1.); p.y += uFlap * .25 * wy * wy * sin(uT * 2.0 - .6 - 1.9 * aUV.y); }
  float sl = sg * uFlap / max(uSpan, .01) * (2. * w * sin(ph) - 1.9 * w * w * cos(ph));
  n = normalize(vec3(n.x - sl * n.y, n.y + sl * n.x, n.z)); vUp = n.y;
  vec4 wp = modelMatrix * vec4(p, 1.); vN = normalize(mat3(modelMatrix) * n); vUV = aUV; vY = wp.y; vWp = wp.xyz;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Mo=`
uniform vec3 uBounceM; uniform float uRayK, uT, uHero;
varying vec3 vN, vUV, vWp; varying float vY, vUp;
// the crawling caustic net the reef and the sharks carry (the same three warped sines), so the manta sits in the same light
float mCaus(vec2 p, float t){
  float w = sin(p.x * 1.1 + sin(p.y * .9 + t) * 1.3 + t * .7) + sin(p.y * 1.3 - sin(p.x * .8 - t * .8) * 1.2 + t * .5) + sin((p.x + p.y) * .8 + sin((p.x - p.y) * .7 + t * .6));
  float c = 1. - min(abs(w) * .42, 1.); c = c * c; c = c * c; return c * c;
}
// the pools of shaft light that rake the sharks (the parts file's swShaft), read in the same place
float mShaft(vec2 p, float t){
  float a = sin(p.x * .23 + 1.7 * sin(p.y * .11 + t * .13) + t * .21) * sin(p.y * .19 - 1.3 * sin(p.x * .09 - t * .11) + t * .17);
  return smoothstep(.08, .7, a);
}
#include <fog_pars_fragment>
${st}
${Da}
void main(){
  // the two skins meet along the wing's edges: each is drawn from its own side only, so the black back can never show
  // through the white belly as a comb of triangles at the wingtip (the lobes and the tail, vUV.z of 2 and over, are drawn from both sides)
  if (vUV.z < 1.5 && !gl_FrontFacing) discard;
  vec3 N = normalize(vN);
  float w = abs(vUV.x), c = vUV.y, belly = step(vUV.z, 0.);
  float n1 = aNoise(vec2(vUV.x * 12., c * 8.5) + 3.), n2 = aNoise(vec2(vUV.x * 21., c * 14.) + 9.);
  // back: near-black with pale shoulder chevrons (an eagle ray: brown with pale spots)
  // (seventh pass: charcoal-blue, half as light again as before, with paler shoulder marks: under the low sun of the
  // golden looks the back was the darkest thing in the frame, a black cut-out)
  vec3 back = vec3(.050, .063, .088) * (.8 + .5 * n2);
  // (the shoulder marks are a hook a side, not a patch: a band lying along the leading edge from beside the head to
  // mid-wing, and a spur running back from its inner end, both broad where they meet and tapering to nothing, their
  // edges carried in and out by the skin's own noise. A soft-edged band 0.7 m wide and 0.6 m long, which is what this
  // was, is a pale square on the near shoulder when the back is turned to the lens.)
  float cw = c + (n2 - .5) * .05, ww = w + (n1 - .5) * .04, hwA = mix(.085, .02, smoothstep(.08, .46, ww)), hwB = mix(.07, .018, smoothstep(.14, .44, cw));
  float chev = max((1. - smoothstep(hwA * .35, hwA, abs(cw - .14 - .10 * ww))) * smoothstep(.05, .11, ww) * (1. - smoothstep(.30, .52, ww)),
                   (1. - smoothstep(hwB * .35, hwB, abs(ww - .12 - .10 * (cw - .15)))) * smoothstep(.07, .14, cw) * (1. - smoothstep(.24, .46, cw))) * (.7 + .3 * n1);
  back = mix(back, vec3(.27, .30, .335), chev * (.4 + .6 * chev) * .85);
  // (eighth pass: an eagle ray is dark umber-grey with small round off-white spots: one dot to a cell of some 12 cm, each
  // 4 to 7 cm across, most cells empty over the shoulders and two in three filled toward the hind edge. The spots were a
  // value noise cut at a threshold: large angular cream shards, the harshest thing in the frame under a low sun.)
  vec3 rv = aVoro(vec2(vUV.x * 17., c * 15.) + 4.);
  float rR = mix(.18, .30, rv.y), rSpot = (1. - smoothstep(rR - .07, rR, rv.x)) * step(mix(.72, .34, smoothstep(.12, .62, c)), rv.z);
  vec3 ray = mix(vec3(.118, .100, .084) * (.85 + .3 * n1), vec3(.42, .40, .34), rSpot * .9);
  back = mix(back, ray, uRayK);
  // belly: near-white shading to grey toward the wingtips, soft charcoal blotches clustered between the gill slits and
  // the abdomen, a grey trailing margin, five gill slits a side and the mouth
  vec3 bel = vec3(.80, .81, .79) * (.94 + .08 * n2) * (.75 + .25 * (1. - w)) * (.95 + .05 * sin(c * 9.));
  float zone = (1. - smoothstep(.15, .35, w)) * smoothstep(.20, .40, c) * (1. - smoothstep(.70, .92, c));
  float blot = smoothstep(.55, .72, n1 * .7 + n2 * .3 + .20 * zone - .10) * zone;
  bel = mix(bel, vec3(.05, .055, .065), blot * .92 * (1. - uRayK));
  bel = mix(bel, vec3(.20, .23, .28), clamp(smoothstep(.70, .98, c) * .8 + smoothstep(.62, .98, w) * .8 + (1.0 - smoothstep(.0, .07, c)) * .5, 0., 1.) * (.75 + .25 * n1));   // (a dark margin along the trailing edge, the wingtips and the lip)
  float gz = (c - .2) / .055;
  float gill = step(0., gz) * step(gz, 5.) * (1. - smoothstep(.10, .20, abs(fract(gz) - .5))) * smoothstep(.03, .045, w) * (1. - smoothstep(.17 - .014 * gz, .20 - .014 * gz, w));
  bel *= 1. - .85 * gill;
  // (a manta's mouth is at the lip, between the lobes' roots; a ray's under the head)
  bel *= 1. - .8 * (1. - smoothstep(.012, .026, abs(c - .07 * uRayK))) * (1. - smoothstep(.10 + .05 * (1. - uRayK), .12 + .05 * (1. - uRayK), w));
  // (sixth polish pass) the belly is modelled, not a flat pale sheet: it darkens toward the wing roots and along the body's
  // keel, the pattern keeps a dark margin at the wingtips, and the light is the reef's own: the caustic net crawls over
  // every face turned to the sun (faintly, from the sand's bounce, over the belly too), and a rim of the low sun and the
  // sky runs along the wings' edges, so the animal reads as a manta at a glance
  float rootSh = mix(.70, 1., smoothstep(.03, .36, w)) * mix(.86, 1., smoothstep(.0, .2, abs(c - .5)));
  bel *= rootSh * (1. - .22 * smoothstep(.55, 1., w) * (1. - uRayK));
  back = mix(back, back * 1.9 + .012, smoothstep(.72, 1., w) * .5);                    // the wingtips' backs a step paler
  vec3 alb = mix(back, bel, belly);
  // (seventh pass) the plain rays' lobes are single sheets and the normal is turned to the face in view. The hero manta's are
  // rolled horns that say which face is the upper one (aUV.y): above a small step paler than the back, so the head reads
  // against it and no more (at an albedo of 0.15 the near one was a white bar ahead of the head: this light makes anything
  // over a tenth pale); below pale like the belly. Its whip is the back's own plain tone.
  float lobe = step(1.5, vUV.z) * step(.5, w);
  if (vUV.z > 1.5 && !gl_FrontFacing) N = -N;
  alb = mix(alb, mix(vec3(.50, .52, .52), vec3(.082, .098, .128), smoothstep(.3, .6, c)), lobe * (1. - uRayK));
  alb = mix(alb, mix(vec3(.050, .063, .088), vec3(.118, .100, .084), uRayK), step(2.5, vUV.z));
  vec3 V = normalize(cameraPosition - vWp);
  vec2 cq = vWp.xz - uSunDir.xz * (vWp.y / max(uSunDir.y, .2));
  float ca = mCaus(cq * .85, uT * 1.3) + .6 * mCaus(cq * 1.9 + 7.3, uT * 1.7 + 2.);
  float sunny = smoothstep(-.25, .5, dot(N, uSunDir));
  vec3 col = uwLight(alb, N, vY) * (1. + ca * (1.1 * sunny + .16)) + alb * uBounceM * clamp(.3 - N.y, 0., 1.) * (1. + .55 * ca);
  float fr = 1. - abs(dot(N, V)); fr = fr * fr * fr;
  col += (uSkyL * .8 + uSunCol * .5 * (.35 + .65 * sunny)) * fr * (.22 + .5 * alb) * exp(-max(uSurfY - vY, 0.) * .02);
  // (seventh pass) the back carries the sky: a soft sheen on every face of it that looks up, strongest in a band along the
  // leading edge and over the head, so the head, the shoulders and the dorsal ridge are modelled and the back is never flat
  { float upK = smoothstep(-.05, .85, N.y), leadK = 1. - smoothstep(.02, .26, c);
    col += (uSkyL * (.04 + .11 * leadK) + uSunCol * .045 * leadK * sunny) * upK * (1. - belly) * (1. - lobe) * (1. - .3 * uRayK) * (.55 + .45 * n1) * exp(-max(uSurfY - vY, 0.) * .02); }
  // THE HERO'S LIGHT (uHero; the plain rays keep the light above) is the sharks' own (SHARK_FRAG of the parts file), read in their frame
  // (lp: its floor lies 30 m under the surface): the sun on a wrapped lambert, the caustic net and the shafts' pools in the sun's term
  // alone, on faces that look up, thinning with depth; the sky above and the deep below; their highlight and their rim. It differs by what
  // this skin is: the rim is weighed by the skin's tone against the sharks' back (0.17), light on a dark skin and never a film of the
  // water's colour over it (on a broad back seen along its plane the rim and the sheen lay over all of it: the see-through read); the sand's
  // bounce is the manta's own; and the body shades itself (form): a face that turns from the animal's own dorsal axis has less of every light.
  if (uHero > .5) {
    vec3 lp = vec3(vWp.x, vWp.y - uSurfY + 30., vWp.z);
    vec2 hq = lp.xz - uSunDir.xz * (lp.y / max(uSunDir.y, .2));
    float hc = (mCaus(hq * .85, uT * 1.3) + .6 * mCaus(hq * 1.9 + 7.3, uT * 1.7 + 2.)) * smoothstep(0., 23., lp.y) * smoothstep(-.1, .45, N.y);
    float dl = exp(-max(uSurfY - vY, 0.) * .028), ndl = clamp((dot(N, uSunDir) + .22) / 1.22, 0., 1.), shaft = mShaft(hq, uT);
    float form = mix(.5, 1., smoothstep(.55, 1., abs(vUp)));
    vec3 amb = mix(uDeepL, uSkyL, N.y * .5 + .5) * (.45 + .55 * dl) + uBounceM * clamp(.3 - N.y, 0., 1.);
    col = alb * (uSunCol * dl * ndl * (.55 + 2. * hc) * (.74 + 1.25 * shaft) + amb) * form;
    float ndh = max(dot(N, normalize(uSunDir + V)), 0.), hf = 1. - max(dot(N, V), 0.); hf = hf * hf * hf;
    col += uSunCol * dl * .10 * pow(ndh, 28.) * (1. - belly) * (.5 + hc);
    col += (uSkyL + uSunCol * .35 * shaft * dl) * hf * (.06 + .42 * smoothstep(-.1, .7, N.y)) * min(alb / .17, 1.);
  }
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,qs=`
attribute vec4 iA, iB, iC;   // base xyz, length | phase, speed, width, alpha | drift direction xyz, travel (m)
uniform float uT;
varying vec2 vUv; varying float vA, vPh;
#include <fog_pars_vertex>
void main(){
  float cyc = fract(iB.x + uT * iB.y / max(iC.w, 1.));
  vec3 dir = normalize(iC.xyz + vec3(0., 0., 1e-5)), side = normalize(cross(vec3(0., 1., 0.), dir) + vec3(1e-5, 0., 0.));
  float grow = .6 + .8 * cyc;
  vec3 wp = iA.xyz + dir * ((cyc - .5) * iC.w + position.z * iA.w * grow) + side * (position.x * iB.z * grow) + vec3(0., .22 + .5 * cyc, 0.);
  vUv = position.xz + .5; vA = iB.w * sin(3.14159 * cyc); vPh = iB.x * 37.;
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(wp, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ds=`
uniform vec3 uSmokeCol; uniform float uT;
varying vec2 vUv; varying float vA, vPh;
#include <fog_pars_fragment>
${st}
void main(){
  float r = length((vUv - .5) * 2.), soft = 1. - smoothstep(.2, 1., r);
  // (broken along its length into puffs a metre or two long that roll up the slope: one noise drawn out along the streamer
  // read from the bowl as long pale streaks on the sand)
  float n = aNoise(vec2(vUv.x * 5. + vPh, vUv.y * 8. + uT * .5 + vPh)) * .55 + aNoise(vec2(vUv.x * 11. - vPh, vUv.y * 19. + uT * .9)) * .45;
  gl_FragColor = vec4(uSmokeCol, soft * soft * smoothstep(.42, .86, n) * vA * .9);
  #include <fog_fragment>
}`,O=(i,t,T)=>{const C=Ge((T-i)/(t-i),0,1);return C*C*(3-2*C)};function Ls(i){const t=h=>i.R0*(1+i.e2*Math.cos(2*(h-i.p2))+i.e3*Math.cos(3*h-i.p3)+i.e5*Math.cos(5*h+1.3));return{ringR:t,angDiff:h=>h-Math.PI*2*Math.floor(h/(Math.PI*2)+.5),islA:(h,g)=>{const N=Math.sin(i.n*h+1.6*Math.sin(3*h+i.a1)+.9*Math.sin(7*h+i.a2)),A=Math.abs(g),w=(A-260)/170;return Math.max(O(-.15,.55,N),Math.exp(-w*w))*O(105,170,A)},islH:(h,g)=>{const N=22+58*h,A=(g+55)/N;return h<.02?-1.5:3.4*Math.sqrt(h)*(1-A*A)-.6*(1-h)},ripH:(h,g,N)=>{const A=h-i.px,w=g-i.pz,r=A*i.fx+w*i.fz,p=-A*i.fz+w*i.fx,y=Math.exp(-p*p/2400)*O(-125,-78,r)*(1-O(150,330,r)),P=r*.7854+.8*Math.sin(p*.15+N*.3);return y*i.ripAmp*Math.sin(P)*(.75+.25*Math.sin(p*.31+N*.7))+i.chop*(Math.sin(.9*h+.5*g-1.9*N)+.7*Math.sin(-.6*h+1.3*g-2.3*N))},toPlate:(h,g,N=[0,0])=>{const A=i.thP+h/i.R0,w=t(A)+g;return N[0]=i.cx+Math.cos(A)*w,N[1]=i.cz+Math.sin(A)*w,N}}}function La(){const i=[],t=[],T=[],C=[],D=new d.Color,q={v(x,h,g,N,A=0,w=1){return D.set(N).multiplyScalar(w),i.push(x,h,g),t.push(D.r,D.g,D.b),T.push(A),i.length/3-1},quad(x,h,g,N){C.push(x,h,g,x,g,N)},tri(x,h,g){C.push(x,h,g)},tube(x,h,g,N,A){const w=[];for(let r=0;r<x.length;r++){const p=x[r],y=x[Math.max(0,r-1)],P=x[Math.min(x.length-1,r+1)],R=new d.Vector3(P[0]-y[0],P[1]-y[1],P[2]-y[2]).normalize(),oe=new d.Vector3(1,0,0);Math.abs(R.x)>.9&&oe.set(0,0,1);const I=new d.Vector3().crossVectors(R,oe).normalize(),se=new d.Vector3().crossVectors(R,I),ue=[];for(let ge=0;ge<g;ge++){const Ye=ge/g*Math.PI*2,Le=Math.cos(Ye)*h[r],Ie=Math.sin(Ye)*h[r];ue.push(q.v(p[0]+I.x*Le+se.x*Ie,p[1]+I.y*Le+se.y*Ie,p[2]+I.z*Le+se.z*Ie,N,0,A?A[r]:1))}w.push(ue)}for(let r=0;r<w.length-1;r++)for(let p=0;p<g;p++){const y=(p+1)%g;q.quad(w[r][p],w[r+1][p],w[r+1][y],w[r][y])}},box(x,h,g,N,A,w,r,p=1){const y=[];for(let P=0;P<8;P++)y.push(q.v(x+(P&1?N:-N)*.5,h+(P&2?A:-A)*.5,g+(P&4?w:-w)*.5,r,0,p));q.quad(y[0],y[2],y[3],y[1]),q.quad(y[4],y[5],y[7],y[6]),q.quad(y[0],y[1],y[5],y[4]),q.quad(y[2],y[6],y[7],y[3]),q.quad(y[0],y[4],y[6],y[2]),q.quad(y[1],y[3],y[7],y[5])},build(){const x=new d.BufferGeometry;return x.setAttribute("position",new d.Float32BufferAttribute(i,3)),x.setAttribute("aCol3",new d.Float32BufferAttribute(t,3)),x.setAttribute("aWind",new d.Float32BufferAttribute(T,1)),x.setIndex(C),x.computeVertexNormals(),x}};return q}function Ts(i){const t=La();t.tube([[0,-.5,0],[.5,3.5,.1],[1.4,7.5,.2],[2,10.6,.2]],[.3,.21,.17,.14],4,"#8a765e",[.7,.9,1,.85]);const T=[.15,1.5,2.9,4.1,5],C=[.14,.62,.66,.42,.05];for(let D=0;D<9;D++){const q=D/9*Math.PI*2+i.range(-.25,.25),x=i.range(-.7,.75),h=Math.cos(q),g=Math.sin(q),N=i.range(.85,1.15),A=[0,.95+x*.8,1.1+x*1.3,.35+x*1.5,-1.1+x*1.4];let w=null;for(let r=0;r<5;r++){const p=T[r]*N,y=C[r],P=Math.pow(r/4,1.5)*.85,R=.75+.25*(D%2),oe=r<2?"#2c5f22":r<4?"#4c8a2c":"#7fae3e",I=t.v(2+h*p-g*y,10.6+A[r]-.12*y,.2+g*p+h*y,oe,P,R),se=t.v(2+h*p+g*y,10.6+A[r]-.12*y,.2+g*p-h*y,oe,P,R*.85);w&&t.quad(w[0],w[1],se,I),w=[I,se]}}return t.build()}function Ws(i){const t=La(),T=9,C=[];for(let N=0;N<T;N++){const A=N/(T-1)*2-1,w=A*4.5,r=.46*Math.sqrt(Math.max(0,1-A*A*A*A))+.02,p=.55*A*A*A*A;C.push([t.v(-r,.5+p,w,"#caa46c"),t.v(-r*.8,.05+p*.6,w,"#5d3c22"),t.v(0,-.28+p*.5,w,"#4a2f1b"),t.v(r*.8,.05+p*.6,w,"#5d3c22"),t.v(r,.5+p,w,"#caa46c"),t.v(0,.3+p,w,"#3a2616")])}for(let N=0;N<T-1;N++){const A=C[N],w=C[N+1];for(let r=0;r<4;r++)t.quad(A[r],w[r],w[r+1],A[r+1]);t.quad(A[0],A[5],w[5],w[0]),t.quad(A[5],A[4],w[4],w[5])}t.tube([[-2.7,.1,-3.1],[-2.7,0,-1.5],[-2.7,0,1.5],[-2.7,.22,3.2]],[.05,.19,.19,.05],5,"#6a4526");for(const N of[-1.5,1.4])t.tube([[0,.55,N],[-1.4,.75,N],[-2.7,.15,N]],[.07,.07,.06],4,"#7a5631");t.tube([[0,.3,.9],[.05,5.4,.5]],[.09,.07],4,"#7a5631");const D=[0,.75,3.9],q=[.5,9.6,-1.4],x=[1.5,2.6,-4.2];t.tube([D,q],[.08,.05],4,"#8a6238"),t.tube([D,x],[.08,.05],4,"#8a6238");const h=7,g=[];for(let N=0;N<=h;N++){const A=[];for(let w=0;w<=h;w++){const r=N/h,p=w/h,y=r*(1-.34*Math.sin(Math.PI*p)*r),P=le(q[0],x[0],p),R=le(q[1],x[1],p),oe=le(q[2],x[2],p),I=Math.sin(Math.PI*p)*Math.sin(Math.PI*Math.min(1,r*1.1)*.9)*.75;A.push(t.v(le(D[0],P,y)+I,le(D[1],R,y),le(D[2],oe,y),i,I*.12,(w%2?.74:.82)*(.8+.2*r)))}g.push(A)}for(let N=0;N<h;N++)for(let A=0;A<h;A++)t.quad(g[N][A],g[N+1][A],g[N+1][A+1],g[N][A+1]);for(const N of[-2.6,-.6])t.box(0,.95,N,.42,.75,.36,"#3b2a22"),t.box(0,1.5,N,.24,.26,.24,"#2a1c16");return t.build()}function Es(i,t,T,C,D){const q=Math.cos(D),x=Math.sin(D),h=(p,y,P)=>[t+p*q-P*x,T+y,C+p*x+P*q],g=[[-3,0,-2.2],[3,0,-2.2],[3,0,2.2],[-3,0,2.2]],N=[],A=[];for(const p of g)N.push(i.v(...h(p[0],0,p[2]),"#b59a6c",0,.8),i.v(...h(p[0],2.4,p[2]),"#c8ad7c")),A.push(i.v(...h(p[0]*1.25,2.2,p[2]*1.3),"#8f7748",0,.8));for(let p=0;p<4;p++){const y=(p+1)%4;i.quad(N[p*2],N[y*2],N[y*2+1],N[p*2+1])}const w=i.v(...h(-1.8,4.6,0),"#a48a56"),r=i.v(...h(1.8,4.6,0),"#a48a56");i.quad(A[0],A[1],r,w),i.quad(A[2],A[3],w,r),i.tri(A[1],A[2],r),i.tri(A[3],A[0],w)}function Ks(i,t,T,C){const D="#7a3a22";for(const[q,x]of[[-1,-1],[1,-1],[1,1],[-1,1]])i.tube([[t+q*1.1,T-.5,C+x*1.1],[t+q*.35,T+6,C+x*.35]],[.11,.09],4,D);for(const q of[1.8,3.6,5.4]){const x=le(1.1,.35,(q+.5)/6.5);i.box(t,T+q,C,x*2.1,.14,x*2.1,D,.8)}i.box(t,T+6.5,C,1.1,1,1.1,"#9a4a2a"),i.box(t,T+7.3,C,.5,.6,.5,"#d8d2c0")}function ha(i,t,T,C){const D=[],q=[],x=[];for(const[r,p,y,P]of i){const R=(p+y)*.5,oe=[];for(let I=0;I<t;I++){const se=I/t*Math.PI*2,ue=Math.cos(se),ge=Math.sin(se);oe.push(D.length/3),D.push(P*ge,ue>0?R+(p-R)*ue:R+(R-y)*ue,r)}x.push(oe)}const h=x.length,g=i[h-1][0],N=D.length/3;D.push(0,(i[0][1]+i[0][2])*.5,i[0][0]+.07);for(let r=0;r<t;r++){const p=(r+1)%t;q.push(x[0][r],x[0][p],N);for(let y=0;y<h-1;y++)q.push(x[y][r],x[y+1][r],x[y+1][p],x[y][r],x[y+1][p],x[y][p])}const A=D.length/3;if(D.push(0,.03,g+.02,0,-.03,g+.02,0,T,g-.13,0,0,g-.07,0,-T,g-.13),q.push(A,A+2,A+3,A,A+3,A+1,A+1,A+3,A+4),C>0){const r=i[1],p=i[h-2],y=D.length/3;D.push(0,r[1]*.9,r[0]-.05,0,r[1]+C,r[0]-.14,0,p[1]+C*.8,p[0]+.02,0,p[1]*.9,p[0]-.02),q.push(y,y+1,y+2,y,y+2,y+3);const P=D.length/3;D.push(0,i[2][2]*.9,i[2][0]-.05,0,p[2]-C*.7,p[0]+.04,0,p[2]*.9,p[0]-.02),q.push(P,P+1,P+2)}const w=new d.BufferGeometry;return w.setAttribute("position",new d.Float32BufferAttribute(D,3)),w.setIndex(q),w.computeVertexNormals(),w}const ua=[[.42,.045,-.04,.03],[.24,.11,-.1,.055],[.02,.13,-.12,.06],[-.2,.08,-.075,.035],[-.36,.03,-.03,.012]],Vs=[[.43,.05,-.07,.05],[.33,.21,-.15,.09],[.14,.23,-.18,.105],[-.1,.18,-.15,.08],[-.28,.085,-.075,.035],[-.37,.055,-.05,.016]],_s=[[.44,.02,-.022,.02],[.3,.05,-.045,.04],[0,.06,-.055,.046],[-.22,.045,-.04,.032],[-.38,.022,-.02,.012]];function Ta(i){const t=[],T=[],C=[],D=[];i((h,g,N,A)=>{const w=h.length;for(let r=0;r<w;r++){const p=h[Math.max(0,r-1)],y=h[Math.min(w-1,r+1)];let P=y[0]-p[0],R=y[1]-p[1];const oe=Math.hypot(P,R)||1;P/=oe,R/=oe;const I=le(g,N,r/(w-1)),se=A(h[r][0],h[r][1],r/(w-1));for(const ge of[-1,1])t.push(h[r][0],h[r][1],0),T.push(-R*ge,P*ge,I),C.push(se);const ue=t.length/3-2;r>0&&D.push(ue-2,ue-1,ue+1,ue-2,ue+1,ue)}});const x=new d.BufferGeometry;return x.setAttribute("position",new d.Float32BufferAttribute(t,3)),x.setAttribute("aSide",new d.Float32BufferAttribute(T,3)),x.setAttribute("aFlex",new d.Float32BufferAttribute(C,1)),x.setIndex(D),x}const Is=i=>Ta(t=>{const C=i.range(0,6),D=(q,x)=>Math.min(1,q*q+x*x);t([[0,-.14],[0,.1]],.04,.03,()=>0);for(let q=0;q<9;q++){const x=le(-1,1,(q+i.range(.2,.8))/9),h=(.7+.3*Math.abs(Math.sin(x*2.3+C)))*(.85+.3*Math.cos(x)),g=[];for(let N=0;N<4;N++){const A=[.04,.38,.7,1][N]*h,w=x+.1*Math.sin(N*1.3+q);g.push([Math.sin(w)*A,Math.cos(w)*A])}t(g,.02,.008,D);for(const[N,A]of[[1,-1],[2,1],[2,-1]]){const w=g[N],r=x+A*i.range(.4,.7),p=h*i.range(.2,.32);t([w,[w[0]+Math.sin(r)*p,w[1]+Math.cos(r)*p]],.012,.006,D)}}}),Hs=i=>Ta(t=>{for(let T=0;T<4;T++){const C=i.range(-.25,.25),D=i.range(1.5,2.8),q=i.range(-.25,.25),x=[];for(let h=0;h<7;h++){const g=h/6;x.push([C+q*g*D+.06*Math.sin(g*5+T),g*D])}t(x,.03,.011,(h,g,N)=>Math.pow(N,1.6)*(D/2.8))}}),js=()=>Ta(i=>{i([[0,-.06],[.006,.18],[-.012,.4],[.004,.6],[.035,.78],[.085,.9],[.15,.95]],.042,.034,(t,T,C)=>C*C*.5)});function So(i,t=1.7,T=0){const C=i*.88,D=12,q=7,x=[],h=[],g=[];if(T){const w=T===2,r=2*i,p=r/(w?1.8:2.2),y=w?.13:1/6,P=w?.17:.08,R=w?.66:.68,oe=w?.13:.14,I=28,se=16,ue=.457*p,ge=B=>B<y?w?P*(B/y)**2:.012*(1-(B/y)**2):(w?P:P*O(y,1.7*y,B))+(R-.06-P)*((B-y)/(1-y))**(w?1.1:1.2)+.06*B**7,Ye=B=>1-(1-R-.012)*B**(w?1.2:1.4)-(w?.12:.14)*Math.sin(Math.PI*B**1.5),Le=B=>r*(.007+.081*(1-B)**1.6+(oe-.088)*(1-O(.06,.28,B))),Ie=B=>Math.pow(Math.sin(Math.PI*Math.pow(B,.7)),.8),it=(B,G)=>ue-p*(ge(B)+(Ye(B)-ge(B))*G);for(const B of[1,-1]){const G=x.length/3;for(let S=-I;S<=I;S++){const ie=Math.abs(S)/I,W=ie*(.7+.3*ie),Y=Le(W)*(B>0?.625:-.375);for(let F=0;F<=se;F++){const ce=(F/se)**1.7;x.push(Math.sign(S)*W*i,Y*Ie(ce)-.05*C*W*W,it(W,ce)),h.push(Math.sign(S)*W,ce,B)}}for(let S=0;S<2*I;S++)for(let ie=0;ie<se;ie++){const W=G+S*(se+1)+ie,Y=W+se+1;B>0?g.push(W,Y+1,W+1,W,Y,Y+1):g.push(W,W+1,Y+1,W,Y+1,Y)}}const fa=(2*I+1)*(se+1),Fe=(B,G,S,ie)=>{for(let W=0;W<G-1;W++)for(let Y=0;Y<S;Y++){const F=B+W*S+Y,ce=B+W*S+(Y+1)%S;ie?g.push(F,ce,ce+S,F,ce+S,F+S):g.push(F,ce+S,ce,F,F+S,ce+S)}for(let W=0;W<S;W++){const Y=B+(G-1)*S+W,F=B+(G-1)*S+(W+1)%S;ie?g.push(Y,F,B+G*S):g.push(Y,B+G*S,F)}};if(!w)for(const B of[-1,1]){const G=x.length/3,S=.13*r,ie=.022*r,W=.024*r,Y=B*(y*i+.6*ie),F=-.05*C*y*y-.5*W,ce=ue-.035*p;for(let Ne=0;Ne<=5;Ne++)for(let rt=0;rt<8;rt++){const Se=Ne/5,Pe=1-.55*Se*Se,xe=rt/8*Math.PI*2;x.push(Y-B*.1*S*Se*Se+Math.cos(xe)*ie*Pe,F-.12*S*Se*Se+Math.sin(xe)*W*Pe,ce+S*Se),h.push(B*.9,.5+.5*Math.sin(xe),2)}x.push(Y-B*.1*S,F-.12*S,ce+S+.5*ie),h.push(B*.9,.5,2),Fe(G,6,8,!0)}{const B=x.length/3,G=t*p,S=Math.round(8+6*t),ie=(w?.01:.012)*p,W=-.07*p/G;for(let Y=0;Y<S;Y++)for(let F=0;F<6;F++){const ce=W+(1-W)*Y/(S-1),Ne=Math.max(ce,0),rt=ie*(.3+.7*(1-Ne)**.8),Se=F/6*Math.PI*2;x.push(Math.cos(Se)*rt,.01*p-.12*G*Ne*Ne+Math.sin(Se)*rt,ue-p-G*ce),h.push(0,Ne*t,3)}x.push(0,.01*p-.12*G,ue-p-G-ie),h.push(0,t,3),Fe(B,S,6,!1)}{const B=x.length/3,G=S=>.625*Le(0)*Ie(S)-.004*r;x.push(0,G(.84),it(0,.84),.004*r,G(.9),it(0,.9),0,G(.955),it(0,.955),-.004*r,G(.9),it(0,.9),0,G(.93)+.03*r,it(0,.945)),h.push(0,.84,1,0,.9,1,0,.955,1,0,.9,1,0,.93,1),g.push(B,B+1,B+4,B+1,B+2,B+4,B,B+4,B+3,B+3,B+4,B+2)}const Te=new d.BufferGeometry;Te.setAttribute("position",new d.Float32BufferAttribute(x,3)),Te.setAttribute("aUV",new d.Float32BufferAttribute(h,3)),Te.setIndex(g),Te.computeVertexNormals();const ne=Te.attributes.normal;for(let B=0;B<=2*I;B++){const G=B*(se+1),S=fa+G,ie=ne.getX(G)+ne.getX(S),W=ne.getY(G)+ne.getY(S),Y=ne.getZ(G)+ne.getZ(S),F=Math.hypot(ie,W,Y)||1;ne.setXYZ(G,ie/F,W/F,Y/F),ne.setXYZ(S,ie/F,W/F,Y/F)}return Te}const N=w=>{const r=x.length/3;for(let p=-D;p<=D;p++){const y=Math.abs(p)/D,P=C*(.42-.56*Math.pow(y,1.35)),R=C*(-.5+.375*Math.pow(y,.75)),oe=.115*C*Math.pow(1-y,1.6)+.01*C;for(let I=0;I<=q;I++){const se=I/q,ue=Math.pow(Math.sin(Math.PI*Math.pow(se,.7)),.8);x.push(p/D*i,(w>0?oe:-oe*.6)*ue-.05*C*y*y,P+(R-P)*se),h.push(p/D,se,w)}}for(let p=0;p<2*D;p++)for(let y=0;y<q;y++){const P=r+p*(q+1)+y,R=P+q+1;w>0?g.push(P,R+1,P+1,P,R,R+1):g.push(P,P+1,R+1,P,R+1,R)}};N(1),N(-1);for(const w of[-1,1]){const r=x.length/3;x.push(w*.07*C,.01*C,.38*C,w*.1*C,-.03*C,.6*C,w*.15*C,-.035*C,.56*C,w*.17*C,0,.34*C);for(let p=0;p<4;p++)h.push(w*.9,.95,2);g.push(r,r+1,r+2,r,r+2,r+3)}{const w=x.length/3,r=[-.44,-.44-(t-.44)*.29,-.44-(t-.44)*.64,-t],p=t<1.5?[.024,.016,.01,.003]:[.02,.012,.006,.001];for(let y=0;y<4;y++)for(let P=0;P<4;P++){const R=P/4*Math.PI*2;x.push(Math.cos(R)*p[y]*C,Math.sin(R)*p[y]*C,r[y]*C),h.push(0,.95,2)}for(let y=0;y<3;y++)for(let P=0;P<4;P++){const R=w+y*4+P,oe=w+y*4+(P+1)%4;g.push(R,oe,oe+4,R,oe+4,R+4)}}const A=new d.BufferGeometry;return A.setAttribute("position",new d.Float32BufferAttribute(x,3)),A.setAttribute("aUV",new d.Float32BufferAttribute(h,3)),A.setIndex(g),A.computeVertexNormals(),A}function Us(i,t,T){let C=0;for(;C<i.length-2&&i[C+1][0]<t;)C++;const D=i[Math.max(0,C-1)],q=i[C],x=i[C+1],h=i[Math.min(i.length-1,C+2)],g=Ge((t-q[0])/(x[0]-q[0]),0,1);for(let N=1;N<q.length;N++){const A=D[N],w=q[N],r=x[N],p=h[N];T[N-1]=.5*(2*w+(r-A)*g+(2*A-5*w+4*r-p)*g*g+(3*w-3*r+p-A)*g*g*g)}return T}const nt=(i,t,T)=>{const C=new d.InstancedBufferGeometry;C.setIndex(i.index);for(const D of Object.keys(i.attributes))C.setAttribute(D,i.attributes[D]);for(const D of Object.keys(t))C.setAttribute(D,new d.InstancedBufferAttribute(t[D],4));return C.instanceCount=T,C},Gs=`
attribute vec3 aC, aS;      // centre (world); half width, half height, seed
varying vec2 vUv; varying vec2 vK;
void main(){
  vec4 mv = viewMatrix * vec4(aC, 1.);
  vUv = position.xy; vK = vec2(length(mv.xyz), aS.z);
  mv.xy += position.xy * aS.xy;
  gl_Position = projectionMatrix * mv;
}`,Qs=`
uniform vec3 uWispLit, uWispSh; uniform float uWispT;
varying vec2 vUv; varying vec2 vK;
${st}
void main(){
  vec2 p = vUv * 1.5 + vK.y * 17.3;
  float w = aFbm(p * 1.2 + vec2(uWispT * .05, 0.));
  float n = aFbm(p * vec2(1.1, 2.9) + 1.7 * w + vec2(uWispT * .12, uWispT * .03));      // drawn-out strands
  float a = 1. - smoothstep(.1, 1., length(vUv) + .95 * (n - .42));
  a *= a * (1. - smoothstep(12.6, 16.2, vK.x)) * smoothstep(3., 6., vK.x) * .8;
  gl_FragColor = vec4(mix(uWispSh, uWispLit, smoothstep(.2, .75, n + .25 * vUv.y)), a);
}`,Os={trades:{sky:{preset:"day",zenith:"#1E6FD8",horizon:"#BFE3F5",sunElevation:78},lit:[1,.98,.93],sun:"#FFF8EA",sunK:1,amb:[.3,.38,.52],shadow:[.42,.5,.78],tan:"#D9AF98",refl:.55,wind:1,cloudSh:.55,clouds:30,squall:0,hazeK:11e-5,uwWater:"#1B7FA6",uwDeep:"#0C5078",uwFog:.0082,rays:.8,exposure:1,tint:"#ffffff",satur:1.12},calm:{sky:{preset:"day",zenith:"#2478DC",horizon:"#CBE9F6",sunElevation:78},lit:[1,.99,.95],sun:"#FFF8EA",sunK:1,amb:[.32,.4,.52],shadow:[.42,.5,.78],tan:"#DDB6A0",refl:.8,wind:.07,cloudSh:.25,clouds:9,squall:0,hazeK:8e-5,uwWater:"#1D86AE",uwDeep:"#0C5078",uwFog:.0082,rays:.85,exposure:1,tint:"#ffffff",satur:1.15},squall:{sky:{preset:"day",zenith:"#3A6AA4",horizon:"#C2D0D8",sunElevation:70},lit:[.88,.9,.9],sun:"#FFF4E2",sunK:.86,amb:[.3,.37,.48],shadow:[.4,.47,.72],tan:"#D2A994",refl:.6,wind:1.25,cloudSh:.8,clouds:34,squall:1,hazeK:14e-5,uwWater:"#1A7799",uwDeep:"#0B4A70",uwFog:.0095,rays:.7,exposure:1.02,tint:"#f4f8ff",satur:1.08},golden:{sky:{preset:"goldenHour",sunElevation:25},lit:[.96,.88,.76],sun:"#FFC27A",sunK:.95,amb:[.3,.27,.4],shadow:[.46,.36,.66],tan:"#E6A868",refl:.6,wind:.6,cloudSh:.35,clouds:22,squall:0,hazeK:13e-5,uwWater:"#217A8E",uwDeep:"#0D4868",uwFog:.009,rays:1.3,exposure:1.05,tint:"#fff2e0",satur:1.1,heroSun:[1.25,.82,.5],heroSky:[.2,.52,.6],heroDeep:[.05,.24,.36]},dawn:{sky:{preset:"dawn",sunElevation:7},lit:[.8,.79,.8],sun:"#FFC9B8",sunK:.6,amb:[.42,.38,.5],shadow:[.62,.56,.78],tan:"#D6A6A2",refl:.8,wind:.04,cloudSh:.15,clouds:12,squall:0,hazeK:1e-4,uwWater:"#19688F",uwDeep:"#092F54",uwFog:.0098,rays:.5,exposure:1.18,tint:"#ffeef2",satur:1.05,heroSun:[.36,.56,.72],heroSky:[.15,.42,.6],heroDeep:[.05,.2,.36]}};var Js={id:"atoll-pass-shark-wall",name:"The Pass",category:"ocean",weirdness:.05,media:["air","water","underwater"],async build(i){const t=i.rng.fork("pass-look"),T=i.noise,C=i.quality?.detail??1,D=i.vary||{},q=Ge(D.density??1,.7,1.3),x=new d.Scene,h=Qe("pass-polish:"+(i.seed??0)),g=Qe("pass-polish2:"+(i.seed??0)),N=Qe("pass-polish3:"+(i.seed??0)),A=Qe("pass-polish4:"+(i.seed??0)),w=Qe("pass-polish5:"+(i.seed??0)),r=(e,a,o)=>new d.Vector3(e,a,o),p=e=>new d.Color(e),y=D.hour||"any";let P;if(y==="golden"||y==="night")P="golden";else if(y==="dawn")P="dawn";else if(y==="day")P=t.pick(["trades","trades","calm","squall"]);else{const e=t(),a=typeof D.mood=="number"?D.mood:e;P=a<.42?"trades":a<.64?"golden":a<.78?"squall":a<.9?"calm":"dawn"}const R=Os[P],oe=P==="trades"||P==="calm"||P==="squall",I={rays:t.chance(.33),cuda:t.chance(.4),dolphins:!!D.rare},se=t.chance(.35),ue=t.chance(.4),ge=p(ht[1]),Ye=p(ht[2]),Le=p(ht[0]),Ie=p(ht[5]);se?(ge.lerp(p("#BFF2EA"),.55),Ye.lerp(p("#3CC6B8"),.6)):Ye.offsetHSL(t.range(-.02,.02),0,t.range(-.02,.03));const it=p(ue?"#F2D9CF":"#F6FCF8").multiplyScalar(.8),fa=p(R.tan),Fe=is(R.sky.sunElevation,200),Te=r(Fe.x*.75,Math.max(Fe.y,.55),Fe.z*.75).normalize(),ne=await cs(i,{palette:ht,standalone:!1,sunDir:Te,haze:R.uwWater,hazeDeep:R.uwDeep,footDark:oe?.8:0,sunColor:R.heroSun?new d.Color(...R.heroSun):void 0,skyLight:R.heroSky?new d.Color(...R.heroSky):void 0,deepLight:R.heroDeep?new d.Color(...R.heroDeep):void 0});ne.object.position.set(0,-30,0);const B=ne.anchors,G=e=>r(e.x,e.y-30,e.z);await i.yield();const S=r(.5,0,-.8660254),ie=r(S.z,0,-S.x),W=ie.clone().negate(),Y=G(B.flyThrough[0]),F=Y.clone().addScaledVector(S,-80);F.y=0;const ce=S.clone().multiplyScalar(Math.cos(.21)).addScaledVector(ie,Math.sin(.21)),Ne=r(ce.z,0,-ce.x),rt=F.clone().addScaledVector(S,-45),Se=rt.clone().addScaledVector(ce,-150),Pe=(e,a,o)=>r(Se.x+ce.x*e+Ne.x*a,o,Se.z+ce.z*e+Ne.z*a),xe=(e,a)=>r(F.x+S.x*e,a,F.z+S.z*e),ut=G(B.portalSeat.position),pa=[Pe(0,0,64),Pe(30,0,61),Pe(60,1.5,54),Pe(82,3.5,37),Pe(102,5,17),Pe(122,4.5,5.4),Pe(138,2.5,2.8),xe(-45,2.3),xe(-28,2.05),xe(-12,2),F.clone(),xe(14,-3.4),xe(30,-8.2),xe(50,-11.2),xe(66,-11.9)];for(const e of B.flyThrough)pa.push(G(e));pa.push(r(-2.5,-29.5,-108),r(-3.5,-31.3,-121),ut.clone().add(r(0,-20.5,56.4)),ut.clone().add(r(0,-10.25,28.2)),ut.clone());const Z=as(pa);await i.yield();const Nt=e=>Z.nearestXZ(e.x,e.z).u,we=Nt(F),Pt=Nt(Y),Gt=Nt(r(0,0,40)),Rt=Nt(r(0,0,-64)),Wa=Nt(r(-3.5,0,-121)),da=we*.32,ft=we*.8,Ea=new d.Matrix4,Bt=new d.Vector3,qt=.18,Re=[[0,qt],[.025,qt],[.08,.37],[.12,.43],[.16,.48],[.2,.55],[ft-.05,.72],[ft-.02,.93],[ft,1],[1.01,1]].map(([e,a])=>[e,Math.log(a)]),Ka=(()=>{const e=Re.length,a=[],o=new Array(e).fill(0);for(let s=0;s<e-1;s++)a.push((Re[s+1][1]-Re[s][1])/(Re[s+1][0]-Re[s][0]));for(let s=1;s<e-1;s++)o[s]=a[s-1]*a[s]>0?.5*(a[s-1]+a[s]):0;for(let s=0;s<e-1;s++){if(Math.abs(a[s])<1e-9){o[s]=0,o[s+1]=0;continue}const l=o[s]/a[s],n=o[s+1]/a[s],c=l*l+n*n;if(c>9){const f=3/Math.sqrt(c);o[s]=f*l*a[s],o[s+1]=f*n*a[s]}}return o})(),Qt=e=>{const a=Ge(e,0,1);let o=0;for(;o<Re.length-2&&Re[o+1][0]<a;)o++;const s=Re[o+1][0]-Re[o][0],l=(a-Re[o][0])/s,n=l*l,c=n*l;return Math.exp((2*c-3*n+1)*Re[o][1]+(c-2*n+l)*s*Ka[o]+(-2*c+3*n)*Re[o+1][1]+(c-n)*s*Ka[o+1])},ko=t.range(1380,1520),Ao=t.range(.07,.12),Co=t.range(.02,.05),Fo=t.range(.01,.028),X={R0:ko,e2:Ao,p2:t.range(0,Math.PI),e3:Co,p3:t.range(0,6.28),e5:Fo,n:t.int(12,30),a1:t.range(0,6.28),a2:t.range(0,6.28),px:F.x,pz:F.z,fx:S.x,fz:S.z,ripAmp:.36,chop:.03+.045*Math.min(R.wind,1),thP:Math.atan2(-S.z,-S.x),cx:0,cz:0};{const e=X.R0*(1+X.e2*Math.cos(2*(X.thP-X.p2))+X.e3*Math.cos(3*X.thP-X.p3)+X.e5*Math.cos(5*X.thP+1.3))+85;X.cx=F.x+S.x*e,X.cz=F.z+S.z*e}const pt=Ls(X),No=(e,a,o)=>pt.ripH(e,a,o),We=os({rng:t,...R.sky,sunAzimuth:200,clouds:!1});x.add(We.object),await i.yield();const Po=r(S.x,.035,S.z).normalize(),Dt=We.colorAt(Po,new d.Color),Va=We.colorAt(r(0,1,0),new d.Color),_a=We.colorAt(r(S.x,.12,S.z).normalize(),new d.Color);x.fog=new d.FogExp2(Dt.clone(),7e-5),x.background=Dt.clone();const yt=ns(We,{bounce:.45});x.add(yt.object),await i.yield();const Ia=p(R.sun).multiplyScalar(R.sunK),Ha=[];for(let e=0;e<Math.round(R.clouds*(.7+.3*C));e++){const a=t.range(0,Math.PI*2),o=t.range(1700,3400),s=t.range(240,520);Ha.push([F.x+Math.cos(a)*o,t.range(110,240)+(R.squall?30:0),F.z+Math.sin(a)*o,s])}const ma=ss({rng:t,sky:We,at:Ha,puffs:20,height:.62,farFade:[4300,5600],fogFade:0,wind:[S.x*-3,0,S.z*-3]});x.add(ma.object),await i.yield();const Xe=new d.Group;Xe.name="above-water",x.add(Xe);const be=new d.Group;be.name="plate",Xe.add(be);const xt=F.clone().addScaledVector(S,-10),Ot=150,ja=3800,Be=(e,a,o,s)=>({value:new d.Vector4(e,a,o,s)}),J=e=>({value:e}),Ua=Ie.clone().lerp(Le,.35).multiplyScalar(1.15);P==="dawn"&&Ua.lerp(p("#2F4E66"),.6);const pe={uRing:Be(X.cx,X.cz,X.R0,X.thP),uRingE:Be(X.e2,X.p2,X.e3,X.p3),uIsl:Be(X.n,X.a1,X.a2,X.e5),uPlate:Be(F.x,F.z,qt,0),uRipP:Be(S.x,S.z,X.ripAmp,X.chop),uRip:Be(xt.x,xt.z,Ot,ja),uCobalt:J(P==="dawn"?Le.clone().lerp(p("#2F4E66"),.86).multiplyScalar(.8):(P==="golden"?Le.clone().lerp(p("#0D6488"),.5):Le.clone().lerp(Ie,.25)).multiplyScalar(oe?.85:1)),uMint:J(ge.clone().multiplyScalar(.86)),uJade:J(Ye.clone()),uTeal:J(Ye.clone().lerp(Ie,.7).multiplyScalar(.9)),uSand:J(it),uTan:J(fa.clone().multiplyScalar(.92)),uFoam:J(p("#ffffff").multiplyScalar(.9)),uFoamSh:J(p("#8A9BD8").multiplyScalar(.72)),uReefDark:J(p("#2B5A4C")),uPassCol:J(Ua),uSkyZen:J(Va),uSkyHor:J(_a),uHazeCol:J(Dt),uLit:J(new d.Color(...R.lit)),uSunCol:J(Ia),uShadowTint:J(new d.Color(...R.shadow)),uSunDir:{value:Fe.clone()},uWind:Be(-S.x,-S.z,R.wind,R.cloudSh),uSunA:Be(Fe.x/Fe.y,Fe.z/Fe.y,R.hazeK,R.refl),uCanoe:Be(F.x,F.z,S.x,S.z),uCanoe2:Be(F.x,F.z,S.x,S.z),uCanoe3:Be(F.x,F.z,S.x,S.z),uSquall:Be(0,0,500,0),uAmb:J(new d.Color(...R.amb)),uBounce:J(ge.clone().multiplyScalar(.22)),uBedK:{value:P==="dawn"?.7:P==="golden"?.45:0}};{const o=[0,0,0],s=[];for(let n=1;n<=44;n++){const c=ja*Math.pow(n/44,2.6);for(let f=0;f<72;f++){const u=f/72*Math.PI*2;o.push(Math.cos(u)*c,0,Math.sin(u)*c)}}for(let n=0;n<72;n++)s.push(0,1+(n+1)%72,1+n);for(let n=0;n<43;n++)for(let c=0;c<72;c++){const f=1+n*72+c,u=1+n*72+(c+1)%72;s.push(f,u,u+72,f,u+72,f+72)}const l=new d.BufferGeometry;l.setAttribute("position",new d.Float32BufferAttribute(o,3)),l.setIndex(s);var Yt=new d.Mesh(l,new d.ShaderMaterial({uniforms:pe,vertexShader:bo,fragmentShader:ps,side:d.DoubleSide}));Yt.frustumCulled=!1,Yt.name="sea-disc",Xe.add(Yt)}await i.yield();const Xt=(e,a)=>{const o=X.thP+e/X.R0,s=pt.islA(o,e),l=pt.toPlate(e,a);return{x:l[0],z:l[1],y:pt.islH(s,a),a:s}};{const o=[],s=[],l=new Int32Array(7293).fill(-1),n=new Float32Array(561*13),c=new Float32Array(561*13*2);for(let b=0;b<=560;b++){b%15===14&&await i.yield();const m=b/560*Math.PI*2-Math.PI,z=(m-.7*Math.sin(m))*X.R0;for(let M=0;M<13;M++){const k=-140+M/12*170,L=Xt(z,k),E=b*13+M,K=L.y>.9?.9*(T.fbm2(L.x*.03,L.z*.03,3)+.4):.12*T.n2(L.x*.08,L.z*.08);n[E]=Math.max(-1.5,L.y+K),c[E*2]=L.x,c[E*2+1]=L.z}}await i.yield();const f=b=>(l[b]<0&&(l[b]=o.length/3,o.push(c[b*2],n[b],c[b*2+1])),l[b]);for(let b=0;b<560;b++)for(let m=0;m<12;m++){const z=b*13+m,M=z+13,k=M+1,L=z+1;Math.max(n[z],n[M],n[k],n[L])<-.25||s.push(f(z),f(L),f(k),f(z),f(k),f(M))}await i.yield();const u=new d.BufferGeometry;u.setAttribute("position",new d.Float32BufferAttribute(o,3)),u.setIndex(s),await us(i,u);const v=new d.Mesh(u,new d.ShaderMaterial({uniforms:pe,vertexShader:ys,fragmentShader:xs,side:d.DoubleSide}));v.frustumCulled=!1,v.name="islets",be.add(v)}await i.yield();const $t=new d.ShaderMaterial({uniforms:pe,vertexShader:bs,fragmentShader:zs,side:d.DoubleSide}),Ga=(()=>{const e=pt.toPlate(300,-55);return(e[0]-F.x)*ie.x+(e[1]-F.z)*ie.z>0?1:-1})();{const e=Math.round(600*q*(.6+.4*C)),a=new d.Matrix4,o=new d.Quaternion,s=new d.Euler,l=r(1,1,1),n=r(0,0,0),c=[];for(let m=0;m<e*30&&c.length<e;m++){m%100===99&&await i.yield();const z=t.chance(.6),M=z?(t.chance(.5)?1:-1)*(120+Math.abs(t.gauss())*330):t.range(-Math.PI,Math.PI)*X.R0,k=Xt(M,t.range(-118,8));k.y<1.35||c.push(k)}await i.yield();const f=new d.InstancedMesh(Ts(t),$t,c.length);c.forEach((m,z)=>{const M=t.range(.8,1.4);s.set(t.range(-.12,.12),t.range(0,6.28),t.range(-.12,.12)),o.setFromEuler(s),l.set(M,M*t.range(.85,1.15),M),n.set(m.x,m.y-.3,m.z),a.compose(n,o,l),f.setMatrixAt(z,a)}),f.frustumCulled=!1,f.name="palms",be.add(f),await i.yield();const u=La();[[330,-84,.3],[352,-70,1.2],[374,-88,-.4]].forEach(([m,z,M])=>{const k=Xt(Ga*m,z);Es(u,k.x,Math.max(k.y,.6)-.1,k.z,M+X.thP)});const v=Xt(-Ga*232,-42);Ks(u,v.x,Math.max(v.y,.5),v.z);const b=new d.Mesh(u.build(),$t);b.frustumCulled=!1,b.name="houses-beacon",be.add(b);var Qa=r(v.x,9,v.z)}await i.yield();const $e=new d.Mesh(Ws(ht[6]),$t);$e.frustumCulled=!1,$e.name="canoe",be.add($e);const bt=S.clone().multiplyScalar(-1).addScaledVector(W,.06).normalize(),va=I.dolphins?ft-.08:we+.004,Oa=(()=>{const e=Z.pointAt(va),a=Qt(va),o=I.dolphins?16:9;return r(F.x+(e.x+W.x*o-F.x)/a,0,F.z+(e.z+W.z*o-F.z)/a)})();$e.rotation.y=Math.atan2(bt.x,bt.z);const Ro=[[128,-32,.5],[170,40,-.35]].map(([e,a,o],s)=>{const l=new d.Mesh($e.geometry,$t);l.frustumCulled=!1,l.name="canoe-far-"+s,be.add(l);const n=Pe(e,a,0),c=ce.clone().multiplyScalar(Math.cos(o)).addScaledVector(Ne,Math.sin(o));return l.rotation.y=Math.atan2(c.x,c.z),l.scale.setScalar(2),{m:l,px:F.x+(n.x-F.x)/qt,pz:F.z+(n.z-F.z)/qt,hx:c.x,hz:c.z,yaw:l.rotation.y,u:s?pe.uCanoe3:pe.uCanoe2}});await i.yield();{const a=[],o=[],s=new Int32Array(19881).fill(-1),l=V=>{const Q=V/140*2-1;return Math.sign(Q)*Math.pow(Math.abs(Q),1.7)*(Ot+6)};for(let V=0;V<=140;V++){V%20===19&&await i.yield();for(let Q=0;Q<=140;Q++){const ee=l(Q),te=l(V);Math.hypot(ee,te)<Ot+12&&(s[V*141+Q]=a.length/3,a.push(xt.x+ee,0,xt.z+te))}}await i.yield();for(let V=0;V<140;V++){V%20===19&&await i.yield();for(let Q=0;Q<140;Q++){const ee=s[V*141+Q],te=s[V*141+Q+1],U=s[(V+1)*141+Q+1],me=s[(V+1)*141+Q];ee>=0&&te>=0&&U>=0&&me>=0&&o.push(ee,me,U,ee,U,te)}}await i.yield();const n=new d.BufferGeometry;n.setAttribute("position",new d.Float32BufferAttribute(a,3)),await i.yield(),n.setIndex(o),await i.yield();const c=new d.Mesh(n,new d.ShaderMaterial({uniforms:pe,vertexShader:ds,fragmentShader:ms,transparent:!0,depthWrite:!1,side:d.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-4}));c.frustumCulled=!1,c.renderOrder=1,c.name="rip-sheet",be.add(c),await i.yield();const f=new d.Mesh(new d.CircleGeometry(Ot+4,48).rotateX(-Math.PI/2),new d.ShaderMaterial({uniforms:pe,vertexShader:bo,fragmentShader:ws}));f.position.set(xt.x,-4,xt.z),f.frustumCulled=!1,f.name="pass-bed",be.add(f);const u=[[-60.5,-.8,2.8,-.8,1.3],[-56.5,3.2,2.4,-1,-1.2],[-53,-4.6,2.6,-1,1.1],[-47,.8,2.5,-1.1,-1],[-39,2.4,2.7,-.9,-1],[-33,-2.6,2.1,-1.1,.9],[-27.5,3,2.6,-1,-.75],[-21,-2.3,2.8,-.9,1.05],[-15,3.2,2.3,-1.15,-.9],[-8.8,-2.4,2.8,-.85,.95],[-5.2,2.9,2,-1.2,-.8],[.5,-3,2.6,-1,.85],[5,2.5,2.4,-1.1,-.9]],v=40,b=32,m=v+b+u.length,z=new Float32Array(m*4),M=new Float32Array(m*4);for(let V=0;V<v;V++){const Q=t.range(-78,14),ee=(t.chance(.5)?1:-1)*t.range(2.2,15),te=t.range(1.6,2),U=t.range(-2.8,-1.1),me=le(1.4,2.6,Math.pow(g(),1.3));z.set([F.x+S.x*Q+W.x*ee*.8,U*.72-.1,F.z+S.z*Q+W.z*ee*.8,me+0*te],V*4),M.set([t(),t.range(.5,.8),t.gauss()*.12+g.range(-.45,.45),0],V*4)}for(let V=v;V<v+b;V++){const Q=g.range(-76,12),ee=(g.chance(.5)?1:-1)*g.range(1.6,8),te=le(1.4,2.8,Math.pow(g(),1.2));z.set([F.x+S.x*Q+W.x*ee,g.range(-1.9,-.75),F.z+S.z*Q+W.z*ee,te],V*4),M.set([g(),g.range(.5,.8),g.range(-.7,.7),0],V*4)}u.forEach(([V,Q,ee,te,U],me)=>{const Ue=v+b+me;z.set([F.x+S.x*V+W.x*Q,te,F.z+S.z*V+W.z*Q,ee],Ue*4),M.set([g(),.55,U,0],Ue*4)}),await i.yield();const k=hs(0),L=nt(k,{iA:z,iB:M},m),E=new d.Mesh(L,new d.ShaderMaterial({uniforms:{uPlate:pe.uPlate,uRipP:pe.uRipP,uSharkCol:J(new d.Color(.075,.09,.11).multiply(pe.uLit.value)),uWaterCol:J(new d.Color(.03,.2,.31).multiply(pe.uLit.value))},vertexShader:Ms,fragmentShader:Ss,side:d.DoubleSide}));E.frustumCulled=!1,E.name="surface-sharks",be.add(E);const K=[[-60.3,-2,3,-.75,1.25],[-58,2.4,2.8,-.8,-1.2],[-55.4,-.3,3,-.9,1],[-52,3.8,2.6,-1,-.9],[-49.4,-2.7,3,-.8,1.15],[-43.4,-2.3,2.9,-.75,-1.1],[-36.3,1.1,3,-.85,1.2],[-30.3,-.5,2.8,-.8,-1.05]],_=Qe("pass-skim:"+(i.seed??0)),ae=new Float32Array(K.length*4),$=new Float32Array(K.length*4);K.forEach(([V,Q,ee,te,U],me)=>{ae.set([F.x+S.x*V+W.x*Q,te,F.z+S.z*V+W.z*Q,ee],me*4),$.set([_(),.5+.06*me,U,0],me*4)});const H=new d.Mesh(nt(k,{iA:ae,iB:$},K.length),E.material);H.frustumCulled=!1,H.name="skim-sharks",Xe.add(H);const j=new Float32Array(Ut.length*4),de=new Float32Array(Ut.length*4);Ut.forEach(([V,Q,ee],te)=>{j.set([F.x+S.x*V+W.x*Q,-1.5,F.z+S.z*V+W.z*Q,2.8],te*4),de.set([_(),.5+.05*te,ee,0],te*4)});const _e=new d.Mesh(nt(k,{iA:j,iB:de},Ut.length),new d.ShaderMaterial({uniforms:E.material.uniforms,vertexShader:ks,fragmentShader:As,transparent:!0,depthWrite:!1}));_e.frustumCulled=!1,_e.renderOrder=2,_e.name="approach-sharks",be.add(_e)}{const e=new d.Mesh(new d.PlaneGeometry(84,34),new d.MeshBasicMaterial({colorWrite:!1,depthWrite:!0,transparent:!0,side:d.DoubleSide,fog:!1}));e.position.set(ut.x,-6,ut.z+9.5),e.renderOrder=5.5,e.frustumCulled=!1,e.name="glow-screen",Xe.add(e)}if(R.squall){const e=pt.toPlate(X.R0*t.range(2.35,2.8)*(t.chance(.5)?1:-1),120),a=new d.Mesh(new d.PlaneGeometry(1900,1e3,1,1),new d.ShaderMaterial({uniforms:{uPlate:pe.uPlate,uLit:pe.uLit},transparent:!0,depthWrite:!1,side:d.DoubleSide,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:st+`
uniform vec4 uPlate; uniform vec3 uLit; varying vec2 vUv;
void main(){
  float t = uPlate.w; vec2 p = vUv;
  float n = aFbm(p * vec2(7., 4.) + vec2(t * .008, 0.)), n2 = aNoise(p * vec2(23., 14.) - t * .015);
  float bell = pow(max(sin(3.14159 * clamp(p.x, 0., 1.)), 0.), .7);
  float top = .50 + .36 * bell + .10 * (n - .5) + .03 * n2;
  float base = .40 + .03 * sin(p.x * 9.) + .04 * (aNoise(p * vec2(5., 2.) + 3.) - .5);
  float sx = p.x + .06 * (n - .5);
  float cloud = smoothstep(base - .03, base + .04, p.y) * (1. - smoothstep(top - .06, top + .01, p.y)) * smoothstep(.04, .2, sx) * (1.0 - smoothstep(.8, .96, sx));
  float h01 = clamp((p.y - base) / max(top - base, .05), 0., 1.);
  vec3 cc = mix(vec3(.09, .12, .18), vec3(.80, .83, .88), smoothstep(.15, .85, h01 + .25 * (n - .5) + .1 * (n2 - .5))) * uLit;
  float streak = .62 + .38 * aNoise(vec2(p.x * 95. + p.y * 12., p.y * 2.5 + t * .5));
  float veil = (1. - smoothstep(base - .02, base + .03, p.y)) * smoothstep(.12, .4, p.x) * (1.0 - smoothstep(.6, .88, p.x)) * mix(.5, .9, smoothstep(0., base, p.y)) * streak * smoothstep(-.01, .06, p.y);
  gl_FragColor = vec4(mix(vec3(.17, .23, .31) * uLit, cc, cloud), max(cloud * .97, veil));
}`}));a.position.set(e[0],495,e[1]),a.lookAt(F.x,495,F.z),a.renderOrder=1,a.name="squall",be.add(a),pe.uSquall.value.set(e[0]-(e[0]-X.cx)*.25,e[1]-(e[1]-X.cz)*.25,680,1)}await i.yield();const Ya=e=>"#"+e.getHexString(),Lt={body:"#eef0ec",belly:"#f6f7f6",wingC:"#8e97a5",trail:"#e8ebee",tip:"#22252b",head:"#1d1f24",neckC:"#f2f3f1",beak:"#e8862c",rim:.6},ga={body:"#4a393c",belly:"#5c4a4c",wingC:"#3f3136",trail:"#57464c",tip:"#231c20",tailC:"#2b2327",head:"#33282b",neckC:"#33282b",beak:"#c3bcae",rim:.9,palette:{wing:"gull",fingers:0,fork:1,tail:.44,tailW:.17,girth:.118,span:1.14,chord:.36,beakLen:.2}},lt=(e,a)=>{const o=e.material,s="vec3 alb = vColor;",l="gl_FragColor = vec4(c, uOpacity);",n=a==="frig",c=n?".74":".60",f=n?"1.5":".9",u=n?" float brK = (1. - vThin) * (1. - upF) * smoothstep(.02, .10, vLocal.z) * (1. - smoothstep(.20, .30, vLocal.z)); alb = mix(alb, vec3(.70, .66, .58), brK * .85);":"",v=`alb * uGroundColor * ((1. - upF) * ${n?".8":".45"} * .3183)`;return o.fragmentShader.includes(s)&&o.fragmentShader.includes(l)&&(o.fragmentShader=o.fragmentShader.replace(s,s+` float upF = smoothstep(-.35, .35, N.y); alb *= mix(1., mix(${c}, 1.1, upF), vThin);`+u).replace(l,`{ float rimF = pow(clamp(1. - abs(dot(N, V)), 0., 1.), 2.2); c += uSunColor * (.12 + .6 * alb) * (rimF * ${f} * .3183) + ${v}; }
  `+l)),e},Xa={sunDir:Fe.clone(),sunColor:R.sun,sunIntensity:1.75*R.sunK,sky:Ya(Va.clone().lerp(_a,.5)),skyIntensity:1,ground:Ya(ge),groundIntensity:.7},Ee=ve.makeFauna(x,{light:Xa});await i.yield(),Ee.add(lt(ve.makeFlock({rng:t,species:"gulls",count:Math.round(44*q),size:1.35,...Lt,spread:[18,7,44],cross:{path:Z,u:da+.055,lead:13,span:190,angle:50,side:1,height:-1.5,duration:Oe}}),"tern")),await i.yield(),Ee.add(ve.makeFlock({rng:t,species:"crows",count:Math.round(26*q),size:1,body:"#15171b",wingC:"#1d2026",center:[Qa.x,13,Qa.z],radius:42,height:8})),await i.yield(),Ee.add(lt(ve.makeFlock({rng:t,species:"eagles",count:8,size:2.3,...ga,center:[F.x+S.x*30,110.5,F.z+S.z*30],height:6,spread:[150,26,150],soarRadius:34}),"frig")),await i.yield();{const e=Pe(62,-8,0);Ee.add(lt(ve.makeFlock({rng:h,species:"eagles",count:3,size:2.7,...ga,center:[e.x,84.5,e.z],radius:10,height:3,spread:[46,7,26],soarRadius:15,soarLift:3}),"frig")),await i.yield(),Ee.add(lt(ve.makeFlock({rng:h,species:"gulls",count:7,size:1.7,...Lt,spread:[9,2.5,9],maxSigma:3,wander:[1.1,1,.7,.35],along:{path:Z,side:11,up:-8.2,lead:27,from:-.05,to:da+.03}}),"tern")),await i.yield(),Ee.add(lt(ve.makeFlock({rng:g,species:"gulls",count:12,size:2,...Lt,spread:[10,3,22],maxSigma:3,wander:[1.1,1,.7,.35],keepClear:{path:Z,dist:2.3,step:2,to:.3},cross:{path:Z,u:.1,lead:17,span:170,angle:62,side:-1,height:-3.5,duration:Oe}}),"tern")),await i.yield()}Ee.add(lt(ve.makeFlock({rng:A,species:"eagles",form:"vee",count:1,size:2.6,speed:9,...ga,translucency:.12,wander:[.25,.2,.25,.5],cross:{path:Z,u:.02,lead:9,span:30,angle:20,side:-1,offset:-4,height:3.3,bow:0,window:.0686*30/60}}),"frig")),await i.yield(),Ee.add(lt(ve.makeFlock({rng:N,species:"gulls",form:"vee",count:3,size:1.9,speed:17,spacing:4.3,wander:[1.1,1,.7,.45],...Lt,cross:{path:Z,u:.083,lead:10.5,span:120,angle:68,side:1,height:-3,offset:4.5,bow:0,duration:Oe}}),"tern")),await i.yield();{const e=Qe("pass-flock-near:"+(i.seed??0)),a=-1.5+e.range(-3.5,3.5);Ee.add(lt(ve.makeFlock({rng:e,species:"gulls",form:"vee",count:3,size:1.9,speed:17,spacing:4.3,wander:[1.1,1,.7,.45],...Lt,cross:{path:Z,u:da+.055,lead:16.5,span:190,angle:50,side:1,height:a,duration:Oe}}),"tern")),await i.yield()}const $a=new d.ShaderMaterial({uniforms:{uWispT:{value:0},uWispLit:{value:p("#ffffff").lerp(Ia,.3).multiplyScalar(.84)},uWispSh:{value:Dt.clone().lerp(p("#ffffff"),.35).multiplyScalar(.7)}},vertexShader:Gs,fragmentShader:Qs,transparent:!0,depthWrite:!1});{const e=[],a=[],o=[],s=[],l=r(0,0,0);[[.066,-8.8,-4.6,6.2,4,24],[.105,9,-4.6,6,3.8,27],[.131,9.2,-3.2,6.2,3.6,19],[.152,-9,-4.4,6,3.8,15]].forEach(([f,u,v,b,m,z],M)=>{Z.pointAt(f,l);const k=F.x-l.x,L=F.z-l.z,E=Math.hypot(k,L)||1,K=Math.cos(z*.01745),_=Math.sin(z*.01745),ae=r(k/E*K,-_,L/E*K),$=r(-L/E,0,k/E),H=r().crossVectors($,ae),j=l.clone().addScaledVector(ae,7).addScaledVector($,u).addScaledVector(H,v),de=e.length/3;for(const[_e,V]of[[-1,-1],[1,-1],[1,1],[-1,1]])e.push(_e,V,0),a.push(j.x,j.y,j.z),o.push(b,m,M*.37+.11);s.push(de,de+1,de+2,de,de+2,de+3)});const n=new d.BufferGeometry;n.setAttribute("position",new d.Float32BufferAttribute(e,3)),n.setAttribute("aC",new d.Float32BufferAttribute(a,3)),n.setAttribute("aS",new d.Float32BufferAttribute(o,3)),n.setIndex(s);const c=new d.Mesh(n,$a);c.frustumCulled=!1,c.renderOrder=3,c.name="cloud-wisps",Xe.add(c)}await i.yield();const Bo=[],Tt=[],qo=Qe("pass-dolphins:"+(i.seed??0))();if(I.dolphins)for(const e of[-1,1]){const a=Ee.add(ve.makeDolphins({rng:t,count:3,level:0,light:Xa,length:3.2,top:"#44586c",belly:"#eef1f0",fin:"#34475a",leapHeight:2.6,leapPeriod:3.4,speed:11.5,spread:[2.4,0,1.9],along:{path:Z,side:e*4.4,up:-3.5,lead:6,from:ft-.012,to:we-.01}}));a.uniforms.uLeap.value.z=.12;{const n=a.geometry&&a.geometry.attributes.iA,c=a.geometry&&a.geometry.attributes.iB,f=qo+(e>0?1/12:0);if(n&&c){for(let u=0;u<n.count;u++){const v=e*[0,-.2,3.2][u%3];n.setW(u,u/n.count+f-c.getZ(u)),n.setX(u,W.x*v),c.setW(u,W.z*v),n.setZ(u,-3*u),Tt.push({pod:a,lag:-3*u,ox:W.x*v,oz:W.z*v,ph:u/n.count+f})}n.needsUpdate=!0,c.needsUpdate=!0}}const o=a.material,s="gl_FragColor = vec4(c, uOpacity);",l="vec3 alb = vColor;";o&&typeof o.fragmentShader=="string"&&o.fragmentShader.includes(s)&&o.fragmentShader.includes("vWorld")&&o.fragmentShader.includes(l)&&o.fragmentShader.includes("vLocal")&&(o.fragmentShader=o.fragmentShader.replace(l,l+` { float dz = vLocal.z / 3.2, dy = vLocal.y / 3.2, dx = abs(vLocal.x) / 3.2, body = 1. - vThin;
    float capeY = .030 - .034 * smoothstep(.16, .34, dz) * (1. - smoothstep(.34, .42, dz)) + .012 * sin(dz * 9. + 1.);
    float cape = smoothstep(capeY, capeY + .012, dy), bellyK = 1. - smoothstep(-.050, -.022, dy + .02 * smoothstep(.30, .45, dz));
    alb = mix(alb, vec3(.105, .135, .175), cape * .86 * body);
    float finK = clamp(smoothstep(.074, .082, dx) * step(dy, -.035) + step(dy, -.100) + step(dz, -.44) * smoothstep(.015, .035, dx), 0., 1.);   // flippers and flukes
    alb = mix(alb, vec3(.86, .88, .88), bellyK * .8 * body * (1. - finK));
    alb = mix(alb, vec3(.115, .145, .185), finK * .85);
    alb *= 1. - .55 * body * (1. - smoothstep(.003, .010, abs(dz - .405 - .25 * dy))) * step(dy, .03);
    alb = mix(alb, vec3(.03, .035, .04), body * (1. - smoothstep(.010, .022, length(vec2(dz - .355, (dy - .004) * 1.6)))) * step(.03, dx) * .85);
 }`).replace(s,"c += uSkyColor * (.20 * (1. - vThin) * pow(clamp(N.y, 0., 1.), 10.) * smoothstep(-.2, .3, vWorld.y)); c = mix(c, vec3(.04, .30, .46) * (uSkyColor + uSunColor * .25) * .5, .7 * (1. - smoothstep(-1.5, .15, vWorld.y))); "+s)),Bo.push(a),await i.yield()}const Za={uSpl:{value:Array.from({length:12},()=>new d.Vector4(0,0,0,-1))},uCol:J(pe.uFoam.value.clone().multiply(pe.uLit.value))};if(Tt.length){const e=[],a=[];for(let l=0;l<12;l++){const n=e.length/3;e.push(-1,0,l,1,0,l,1,1,l,-1,1,l),a.push(n,n+1,n+2,n,n+2,n+3)}const o=new d.BufferGeometry;o.setAttribute("position",new d.Float32BufferAttribute(new Float32Array(144),3)),o.setAttribute("aQ",new d.Float32BufferAttribute(e,3)),o.setIndex(a);const s=new d.Mesh(o,new d.ShaderMaterial({uniforms:Za,vertexShader:vs,fragmentShader:gs,transparent:!0,depthWrite:!1,side:d.DoubleSide}));s.frustumCulled=!1,s.renderOrder=6,s.name="dolphin-spray",Xe.add(s),await i.yield()}const ze=new d.Group;ze.name="below-water",ze.visible=!1,x.add(ze),ze.add(ne.object);const Ze=B.coralHead.position,he=B.portalSeat.position,Do=[xe(-90,0),xe(-40,0),r(F.x,0,F.z),xe(40,0),r(Y.x,0,Y.z),r(1,0,70),r(1,0,40),r(2,0,0),r(4,0,-40),r(5.5,0,-64),r(3,0,-90),r(-2,0,-115),r(-4,0,-135),r(-4,0,-186),r(-4,0,-252)],Zt=new d.CatmullRomCurve3(Do,!1,"centripetal"),wa=Zt.getLength(),dt=Math.round(wa/2),ya=e=>e>=90?13:e>=62?13+34.5*O(90,62,e):e>=-42?47.5:e>=-62?47.5-27.5*O(-42,-62,e):20+55*O(-140,-200,e),qe=e=>e>-78?0:e>-112?-8*O(-78,-112,e):e>-128?-8:e>-186?-8+(-128-e)/58*21:13,Lo=e=>24-7*O(-150,-210,e),De=[];{let e=0,a=1e9;const o=r(0,0,0);for(let s=0;s<=dt;s++){Zt.getPointAt(s/dt,o);const l=Math.hypot(o.x-Y.x,o.z-Y.z);l<a&&(a=l,e=s)}for(let s=0;s<=dt;s++){const l=Zt.getPointAt(s/dt),n=Zt.getTangentAt(s/dt),c=s<e?96+(e-s)*(wa/dt):Math.min(l.z,96);De.push({c:l,t:n,nx:-n.z,nz:n.x,s:s/dt*wa,zc:c,hw:ya(c),fl:qe(c),rim:Lo(c)})}}const xa=(e,a,o)=>{const s=4.6*(T.ridged2(e.s*.045+a*37,o*.55+3,3)-.42)*(.55+.45*o)+1.3*T.n3(e.s*.21,o*3.1,a*9),l=.9*T.n3(e.s*.55,o*6.5,a*5.1)+.35*T.n3(e.s*1.3,o*14,a*2.2),n=O(92,66,e.zc)*O(-58,-40,e.zc),c=n*6*O(-.15,.55,T.n2(e.s*.06+a*71.3,4.4+o*.35))*(.45+.55*o),f=n*1.7*Math.exp(-(((o-.84)/.085)**2))*(.55+.45*T.n2(e.s*.09+a*13.1,8.8)),u=e.hw-3*(1-o)*(1-o)+1.4*Math.sin(Math.PI*o)+.9*O(.55,.63,o)+s+l+c-f;return[Math.max(u,9),s+l*1.4+c*.55-f*.8]},mt=(e,a,o,s=0)=>{const l=xa(e,a,o)[0]-s;return r(e.c.x+e.nx*a*l,e.fl+(e.rim-e.fl)*o,e.c.z+e.nz*a*l)},ke=(e,a,o)=>{let s=o.fl+.45*T.fbm2(e*.045,a*.045,3)+.15*T.n2(e*.2,a*.2);const l=Math.hypot(e-Ze.x,a-Ze.z),n=Math.hypot(e-he.x,a-he.z);return s-=.9*O(13,6,l)*O(2.5,5.5,l)+.9*O(12,8.5,n)*O(3.5,6.5,n),s};let fe=Ba();const re=new d.Color,Wt=async e=>{const a=new d.Mesh(await fe.buildAsync(i),ne.rockMaterial);return a.name=e,a.frustumCulled=!1,ne.object.add(a),fe=Ba(),a},To=p(ht[4]).lerp(p(ht[3]),.3).multiplyScalar(.62),Ja=p("#8f8078"),Jt=p("#DC9A46"),ba=p("#8F8A5A"),Et=p("#D48A88"),eo=Jt.clone().lerp(ba,.4);{const o=[2,6,13,24,38],s=[];let l=0;for(const n of De){++l%3===0&&await i.yield();const c=[],f=(u,v,b,m,z)=>c.push(fe.v(n.c.x+n.nx*u,v,n.c.z+n.nz*u,b,m,z));for(const u of[-1,1]){const v=[],b=xa(n,u,1)[0];for(let m=0;m<=6;m++){if(u>0&&m===0)continue;const z=(n.hw-3)*(m/6)*u,M=n.c.x+n.nx*z,k=n.c.z+n.nz*z;re.copy(To).multiplyScalar(.92+.14*T.n2(M*.07+9,k*.07)),v.push([z,ke(M,k,n),re.clone(),.72+.28*(1-m/6),0])}for(let m=1;m<=16;m++){const z=m/16,[M,k]=xa(n,u,z),L=T.n2(z*2.4+n.s*.011,u*5.3+n.s*.004),E=T.n2(n.s*.014+u*11.7,z*2.1+40),K=O(.4,.82,z+.2*L);re.copy(ba).lerp(Jt,O(-.3,.35,L)*(.3+.7*K)).lerp(Et,O(0,.5,E)*(.2+.55*K)),re.lerpColors(Ja,re,.68+.22*K).multiplyScalar((.76+.3*z)*(1-.18*O(.3,2.2,k))),v.push([M*u,n.fl+(n.rim-n.fl)*z+.5*T.n2(n.s*.11,z*7+u),re.clone(),(.5+.5*z)*(1-.45*O(.3,2.4,k)),1])}for(let m=0;m<o.length;m++){const z=(b+o[m])*u,M=n.c.x+n.nx*z,k=n.c.z+n.nz*z;re.copy(eo).lerp(Et,.3*(T.n2(M*.05,k*.05)+.5)).multiplyScalar(.9+.2*T.n2(M*.13,k*.13)),v.push([z,n.rim+.6+1.6*O(0,30,o[m])+.8*T.fbm2(M*.06,k*.06,2),re.clone(),1,1])}u<0&&v.reverse();for(const m of v)f(m[0],m[1],m[2],m[3],m[4])}s.push(c)}await i.yield();for(let n=0;n<s.length-1;n++){n%64===63&&await i.yield();for(let c=0;c<s[n].length-1;c++)fe.quad(s[n][c],s[n+1][c],s[n+1][c+1],s[n][c+1])}}await i.yield(),await Wt("canyon"),await i.yield();const Kt=(e,a)=>De.filter(o=>o.zc<=e&&o.zc>=a),Vt=Kt(150,64).concat(Kt(-48,-150)),zt=Kt(152,-175),Wo=p("#d8dcd4");let ye=t;const Mt=(e,a,o,s,l=1)=>{for(let n=0;n<l;n++){const c=o*(1-.2*n),f=e.x+(n?ye.range(-.3,.3)*o:0),u=e.z+(n?ye.range(-.3,.3)*o:0),v=e.y+n*ye.range(.24,.36),b=12,m=a+ye.range(-.6,.6),z=ye.range(.02,.15),M=ye.range(0,6.28),k=(H,j)=>-(H*Math.cos(m)+j*Math.sin(m))*z,L=fe.v(f,v-.12,u,re.copy(s).multiplyScalar(.6),.8,2),E=fe.v(n?f:f-Math.cos(a)*c*.5,v-(n?.4:.55),n?u:u-Math.sin(a)*c*.5,re.copy(s).multiplyScalar(.4),.4,2),K=[],_=[],ae=[],$=[];for(let H=0;H<b;H++){const j=H/b*Math.PI*2,de=H%2?.64:1,_e=H%2?-.03:.03,V=c*(.88+.09*Math.sin(j*3+M)+.06*Math.sin(j*5-M*2)),Q=Math.cos(j)*V*.5,ee=Math.sin(j)*V*.5,te=Math.cos(j)*V,U=Math.sin(j)*V;K.push(fe.v(f+Q,v-.04+_e*.6+k(Q,ee),u+ee,re.copy(s).multiplyScalar(.84*de),.92,2)),_.push(fe.v(f+te,v+.05+_e+k(te,U),u+U,re.copy(s).lerp(Wo,.3).multiplyScalar(de),1,2)),ae.push(fe.v(f+te*.97,v-.09+k(te,U),u+U*.97,re.copy(s).multiplyScalar(.5),.6,2)),$.push(fe.v(f+te*.28,v-.2+k(te,U)*.28,u+U*.28,re.copy(s).multiplyScalar(.36),.38,2))}for(let H=0;H<b;H++){const j=(H+1)%b;fe.tri(L,K[j],K[H]),fe.quad(K[H],K[j],_[j],_[H]),fe.quad(_[H],_[j],ae[j],ae[H]),fe.quad(ae[H],ae[j],$[j],$[H]),fe.tri($[H],$[j],E)}}},Ae=(e,a,o,s,l=null,n=!1)=>{const c=n?16:l?9:7,f=n?8:l?5:4,u=[],v=ye.range(0,9),b=l?ye.range(.7,1):ye.range(.5,.9),m=l?3:1,z=l?.2:.12;l?re.copy(l):re.copy(Ja).lerp(ye.chance(.4)?Et:eo,ye.range(.1,.5)).multiplyScalar(ye.range(.6,1.05));const M=re.clone();for(let k=0;k<=f;k++){const L=[],E=k/f*Math.PI;for(let K=0;K<c;K++){const _=K/c*Math.PI*2,ae=.78+.3*Math.sin(_*2+v+k)+.16*Math.sin(_*3-v*2+k*1.7)+z*Math.sin(_*5+v*3)*Math.sin(E*4+v),$=Math.sin(E)*s*ae,H=O(-.75,.35,Math.cos(E));L.push(fe.v(e+Math.cos(_)*$*1.3,a+s*.2+Math.cos(E)*s*b,o+Math.sin(_)*$,re.copy(M).multiplyScalar(.62+.38*H),(.34+.66*H)*(.8+.25*ae),m))}u.push(L)}for(let k=0;k<f;k++)for(let L=0;L<c;L++){const E=(L+1)%c;fe.quad(u[k][L],u[k][E],u[k+1][E],u[k+1][L])}},St=p("#b9aca0"),kt=[Jt,ba,Et,Jt.clone().lerp(Et,.5)];for(let e=0;e<112;e++){e%5===4&&await i.yield();const a=t.pick(t.chance(.75)?Vt:zt),o=t.chance(.5)?1:-1,s=t.range(.06,.6),l=t.range(.6,1.4),n=mt(a,o,s,l*.5);n.y+=t.range(.15,.4),Mt(n,Math.atan2(-a.nz*o,-a.nx*o),l,St.clone().lerp(t.pick(kt),t.range(.35,.7)).multiplyScalar(t.range(.8,1.05)),t.int(1,3))}for(let e=0;e<54;e++){e%9===0&&await i.yield();const a=t.pick(zt),o=t.chance(.5)?1:-1,s=mt(a,o,0,t.range(.5,4));Ae(s.x,ke(s.x,s.z,a),s.z,t.range(.3,1))}await i.yield();const He=[p("#C0903E"),p("#8B9A62"),p("#C4787E"),p("#A8A060"),p("#C67E52")];for(let e=0;e<100;e++){e%5===4&&await i.yield();const a=t.pick(t.chance(.7)?Vt:zt),o=t.chance(.5)?1:-1,s=t.range(.04,1),l=t.pick(He),n=t.int(2,4);for(let c=0;c<n;c++){const f=t.range(.45,1.5)*(c?.7:1),u=mt(a,o,Ge(s+t.range(-.06,.06),.02,1),t.range(0,.5)+f*.3);Ae(u.x+t.range(-1.2,1.2)*c,u.y-f*.2,u.z+t.range(-1.2,1.2)*c,f,re.copy(l).multiplyScalar(t.range(.85,1.1)).clone())}}await i.yield(),await Wt("canyon-corals"),await i.yield();const At=e=>De.reduce((a,o)=>o.zc<=96&&Math.abs(o.c.z-e)<Math.abs(a.c.z-e)?o:a,De[De.length-1]),za=[];for(let e=0;e<25;e++){await i.yield();const a=e<7,o=(t.chance(.5)?1:-1)*(a?t.range(8.5,14):t.range(8,40)),s=a?t.range(20,84):t.range(-34,84),l=At(s);if(Math.hypot(o-Ze.x,s-Ze.z)<15||Math.abs(o-l.c.x)>l.hw-9)continue;const n=ke(o,s,l),c=t.pick(He);za.push({x:o,y:n,z:s,st:l});for(let f=0;f<4;f++)Ae(o+t.range(-1.6,1.6),n-.25,s+t.range(-1.6,1.6),t.range(.7,1.9)*(f?.7:1),re.copy(f%2?t.pick(He):c).multiplyScalar(t.range(.85,1.1)).clone());for(let f=0;f<2;f++)Mt(r(o+t.range(-1.5,1.5),n+t.range(1,2),s+t.range(-1.5,1.5)),t.range(0,6.28),t.range(.6,1.2),St.clone().lerp(t.pick(kt),.55).multiplyScalar(.9),2);for(let f=0;f<5;f++){const u=t.range(0,6.28),v=t.range(2.2,5.2);Ae(o+Math.cos(u)*v,ke(o+Math.cos(u)*v,s+Math.sin(u)*v,l)-.05,s+Math.sin(u)*v,t.range(.18,.5))}}for(let e=0;e<8;e++){await i.yield();const a=t.range(-172,-98),o=he.x+(t.chance(.5)?1:-1)*t.range(2.5,11),s=At(a),l=ke(o,a,s),n=t.pick(He);za.push({x:o,y:l,z:a,st:s});for(let c=0;c<3;c++)Ae(o+t.range(-1,1),l-.2,a+t.range(-1,1),t.range(.5,1.2)*(c?.7:1),re.copy(c%2?t.pick(He):n).multiplyScalar(t.range(.85,1.1)).clone());Mt(r(o+t.range(-.8,.8),l+t.range(.7,1.2),a+t.range(-.8,.8)),t.range(0,6.28),t.range(.5,.9),St.clone().lerp(t.pick(kt),.55).multiplyScalar(.9),2);for(let c=0;c<5;c++){const f=t.range(0,6.28),u=t.range(1.6,4.5);Ae(o+Math.cos(f)*u,ke(o+Math.cos(f)*u,a+Math.sin(f)*u,s)-.05,a+Math.sin(f)*u,t.range(.15,.42))}}await i.yield();const Eo=De.reduce((e,a)=>Math.abs(a.c.z-he.z)<Math.abs(e.c.z-he.z)?a:e,De[0]),to=[];for(let e=0;e<15;e++){e%4===3&&await i.yield();const a=t.range(0,Math.PI*2),o=t.range(7.8,11.5),s=he.x+Math.cos(a)*o,l=he.z+Math.sin(a)*o*.8,n=t.int(1,4);for(let c=0;c<n;c++){const f=s+t.range(-1.1,1.1)*c,u=l+t.range(-1.1,1.1)*c,v=c?t.range(.2,.55):t.range(.45,1.25),b=ke(f,u,Eo)-.1;t.chance(.3)?Ae(f,b,u,v*.8,re.copy(t.pick(He)).multiplyScalar(t.range(.85,1.08)).clone()):Ae(f,b,u,v),!c&&t.chance(.45)&&Mt(r(f,b+v*1.1,u),a,t.range(.5,.9),St.clone().lerp(t.pick(kt),.55).multiplyScalar(.9),t.int(1,2)),c||to.push({x:f,y:b+v*.9,z:u})}}await i.yield(),await Wt("canyon-bommies"),await i.yield();const ao=Kt(60,-42),oo=[];ye=g;for(let e=0;e<24;e++){e%3===2&&await i.yield();const a=g.pick(ao),o=g.chance(.5)?1:-1,s=g.chance(.4),l=s?1:g.range(.3,.9),n=g.pick(He),c=g.int(2,3);let f=null;for(let u=0;u<c;u++){const v=g.range(1.3,2.6)*(u?.7:1),b=mt(a,o,Ge(l+g.range(-.05,.05),.02,1),v*.25),m=b.x+g.range(-1.6,1.6)*u,z=b.y-v*.25+(s?.4:0),M=b.z+g.range(-1.6,1.6)*u;Ae(m,z,M,v,re.copy(n).multiplyScalar(g.range(.85,1.1)).clone()),u||(f=r(m,z+v*1.05,M))}g.chance(.75)&&oo.push({p:f,s:g.range(1.5,2.4),yaw:Math.atan2(a.t.x,a.t.z)+g.range(-.4,.4)})}for(let e=0;e<20;e++){e%3===2&&await i.yield();const a=g.pick(ao),o=g.chance(.5)?1:-1,s=g.range(.25,.85),l=g.range(1.5,2.8),n=mt(a,o,s,l*.55);n.y+=g.range(.2,.5),Mt(n,Math.atan2(-a.nz*o,-a.nx*o),l,St.clone().lerp(g.pick(kt),g.range(.4,.7)).multiplyScalar(g.range(.82,1.05)),g.int(2,3))}ye=t,await i.yield(),await Wt("amph-reef"),await i.yield();const Je=e=>e>-90?-1:e>-130?le(-1,-4,(-90-e)/40):-4,ea=[],so=[];ye=h;for(let e=0;e<18;e++){await i.yield();const a=e<4,o=a?he.z+h.range(-7,3):h.range(-176,-84),s=a?e%2?1:-1:h.chance(.5)?1:-1,l=a?h.range(10.5,15):e<11?h.range(7.6,11):h.range(9,16),n=Je(o)+s*l,c=At(o);if(Math.abs(n-c.c.x)>c.hw-7)continue;let f=!0;for(const m of ea)Math.hypot(m.x-n,m.z-o)<6&&(f=!1);if(!f)continue;const u=ke(n,o,c),v=h.pick(He),b=h.range(1,1.5);ea.push({x:n,y:u,z:o,st:c,big:b});for(let m=0;m<5;m++)Ae(n+h.range(-1.7,1.7)*b,u-.3,o+h.range(-1.7,1.7)*b,h.range(.7,1.5)*b*(m?.7:1),re.copy(m%2?h.pick(He):v).multiplyScalar(h.range(.85,1.1)).clone(),m<2);for(let m=0;m<2;m++)Mt(r(n+h.range(-1.5,1.5),u+h.range(.9,1.6)*b,o+h.range(-1.5,1.5)),h.range(0,6.28),h.range(.5,.95),St.clone().lerp(h.pick(kt),.55).multiplyScalar(.9),h.int(1,2));for(let m=0;m<4;m++){const z=h.range(0,6.28),M=h.range(2.4,5.4);Ae(n+Math.cos(z)*M,ke(n+Math.cos(z)*M,o+Math.sin(z)*M,c)-.05,o+Math.sin(z)*M,h.range(.18,.5))}}for(let e=0;e<16;e++){e%4===3&&await i.yield();const a=h.range(-172,-80),o=Je(a)+h.range(-6,6),s=At(a),l=ke(o,a,s);if(Math.hypot(o-he.x,a-he.z)<12)continue;const n=a<he.z+45&&Math.abs(o-Je(a))<4.5,c=fe;n?fe=Ba():so.push({x:o,y:l,z:a});for(let f=0;f<2;f++)Ae(o+h.range(-.7,.7),l-.12,a+h.range(-.7,.7),h.range(.28,.62),re.copy(h.pick(He)).multiplyScalar(h.range(.85,1.1)).clone());for(let f=0;f<2;f++)Ae(o+h.range(-1.6,1.6),l-.04,a+h.range(-1.6,1.6),h.range(.12,.3));fe=c}ye=t,await i.yield();const Ko=await Wt("exit-reef");await i.yield();const et=ne.uniforms,_t=()=>d.UniformsUtils.clone(d.UniformsLib.fog),ta={uSunDir:{value:Te},uSunCol:et.uSunColor,uSkyL:et.uSkyLight,uDeepL:et.uDeepLight,uSurfY:{value:0}},Vo=B.heading.clone().negate(),vt={value:0},Ma={value:r(0,0,0)},no={value:.002},gt=(e,a,o,s,l,n=t)=>{const c=a.length,f=new Float32Array(c*4),u=new Float32Array(c*4);a.forEach((m,z)=>{f.set([m.p.x,m.p.y-30,m.p.z,m.s],z*4),u.set([m.yaw,n(),n(),0],z*4)});const v=new d.ShaderMaterial({uniforms:{..._t(),...ta,uT:vt,uCam:Ma,uPix:no,uSinkOn:{value:l?1:0},uFlowV:{value:Vo},uBend:{value:r(...s)},uColA:J(p(o[0])),uColB:J(p(o[1])),uColC:J(p(o[2]))},vertexShader:Rs,fragmentShader:Bs,fog:!0,side:d.DoubleSide}),b=new d.Mesh(nt(e,{iA:f,iB:u},c),v);return b.frustumCulled=!1,ze.add(b),b},io=e=>{const a=t.pick(e),o=t.chance(.5)?1:-1,s=t(),l=s<.45?t.range(.02,.2):s<.75?t.range(.56,.66):1,n=mt(a,o,l,l===1?t.range(-1.5,.3):t.range(.2,.9));return l===1&&(n.y+=.5),{p:n,st:a,sg:o,yaw:Math.atan2(a.t.x,a.t.z)+t.range(-.35,.35)}},aa=[],Sa=[],ro=[];for(let e=0;e<Math.round(240*q*(.6+.4*C));e++){e%60===59&&await i.yield();const a=io(t.chance(.7)?Vt:zt);a.s=t.range(.75,1.35),a.p.y+=.12*a.s,aa.push(a)}await i.yield();for(let e=0;e<Math.round(200*q*(.6+.4*C));e++){e%60===59&&await i.yield();const a=io(t.chance(.7)?Vt:zt);a.s=t.range(.6,1.15),Sa.push(a)}await i.yield();for(let e=0;e<160;e++){e%40===39&&await i.yield();const a=t.range(-181,-124),o=he.x+(t.chance(.5)?1:-1)*t.range(1.5,15),s=De.reduce((l,n)=>Math.abs(n.c.z-a)<Math.abs(l.c.z-a)?n:l,De[0]);ro.push({p:r(o,ke(o,a,s)-.02,a),s:t.range(.32,.6),yaw:t.range(-.5,.5)})}for(const e of to)if(t.chance(.6)){const a={p:r(e.x,e.y,e.z),s:t.range(.6,1),yaw:t.range(-.4,.4)};e.z>he.z-1&&Math.abs(e.x-he.x)<9||aa.push(a)}for(const e of za)for(let a=0;a<3;a++)(a?aa:Sa).push({p:r(e.x+t.range(-1.8,1.8),e.y+t.range(.9,1.9),e.z+t.range(-1.8,1.8)),s:t.range(.7,1.2),yaw:t.range(-.4,.4)});await i.yield();const ka=gt(Is(t),aa,["#9E2F3A","#B8607A","#C8923E"],[.07,.035,.012]);ka.name="sea-fans",await i.yield();const lo=gt(Hs(t),Sa,["#C23B32","#D4563A","#B8504E"],[.55,.12,.03]);lo.name="whip-corals",await i.yield();const co=gt(js(),ro,["#D8D2C0","#BDB49C","#E8E2D2"],[.14,.06,.02],!0);co.name="garden-eels",await i.yield();const _o=gt(ka.geometry,oo,["#A23340","#C0688A","#D09A44"],[.07,.035,.012],!1,g);_o.name="sea-fans-amphitheatre",await i.yield();const tt=new d.Group;tt.name="exit-dressing",ze.add(tt);{const e=[],a=[],o=[];for(const c of ea)for(let f=0;f<4;f++)(f?e:a).push({p:r(c.x+h.range(-1.9,1.9)*c.big,c.y+h.range(1,2.3)*c.big,c.z+h.range(-1.9,1.9)*c.big),s:f?h.range(.8,1.35):h.range(.6,.95),yaw:h.range(-.4,.4)});for(const c of so)h.chance(.7)&&e.push({p:r(c.x,c.y+.45,c.z),s:h.range(.5,.8),yaw:h.range(-.4,.4)});for(let c=0;c<11;c++){const f=h.range(-180,-126),u=Je(f)+(h.chance(.5)?1:-1)*h.range(2.5,12),v=At(f);for(let b=0;b<26;b++){const m=u+h.gauss()*1.9,z=f+h.gauss()*1.9;o.push({p:r(m,ke(m,z,v)-.02,z),s:h.range(.5,.95),yaw:h.range(-.5,.5)})}}await i.yield();const s=gt(ka.geometry,e,["#9E2F3A","#B8607A","#C8923E"],[.07,.035,.012],!1,h);s.name="sea-fans-exit",tt.add(s);const l=gt(lo.geometry,a,["#C23B32","#D4563A","#B8504E"],[.55,.12,.03],!1,h);l.name="whip-corals-exit",tt.add(l),await i.yield();const n=gt(co.geometry,o,["#D8D2C0","#BDB49C","#E8E2D2"],[.14,.06,.02],!0,h);n.name="garden-eels-exit",tt.add(n)}await i.yield();const Io=Math.atan2(B.heading.x,B.heading.z),It=(e,a,o={})=>new d.ShaderMaterial({uniforms:{..._t(),...ta,uT:vt,uCam:Ma,uMode:{value:e},uHeadA:{value:Io},uFlinch:{value:o.flinch??1},uSchoolK:{value:1},uSchoolPos:{value:r(0,-100,0)},uSchoolDir:{value:S.clone()},uTop:J(p(a[0]).multiplyScalar(o.boost??1)),uSide:J(p(a[1]).multiplyScalar(o.boost??1)),uBelly:J(p(a[2])),uTail:J(p(a[3]).multiplyScalar(o.boost??1)),uStripe:{value:new d.Vector4(...p(a[4]||"#000000").toArray(),a[4]?1:0)},uPattern:{value:o.pattern??0},uGlow:{value:o.glow??0}},vertexShader:Ns,fragmentShader:Ps,fog:!0,side:d.DoubleSide}),ho=ha(ua,4,.13,.05),Ht=ha([ua[0],ua[2],ua[4]],4,.13,0);{const e=Math.round(1e3*q*(.6+.4*C)),a=new Float32Array(e*4),o=new Float32Array(e*4);let s=0;const l=Kt(152,97);for(;s<e;){const c=t.chance(.4),f=t.pick(c?l:t.chance(.8)?Vt:zt),u=t.chance(.5)?1:-1,v=Math.min(e-s,t.int(10,26)),b=Math.atan2(f.nz*u,f.nx*u);let m;if(c){const L=t.range(4.5,7.5)*u;m=r(f.c.x+f.nx*L,0,f.c.z+f.nz*L),m.y=Z.nearestXZ(m.x,m.z).y+30+t.range(-2.6,2.2)}else m=mt(f,u,t.range(.25,.98),t.range(1,2.2));const z=c?.6:.9,M=c?.5:.3,k=c?.7:.45;for(let L=0;L<v;L++,s++)a.set([m.x+t.gauss()*z,m.y-30+t.gauss()*z*.9,m.z+t.gauss()*z,t.range(M,k)],s*4),o.set([t(),b,t()*0+(c?.3:1),t.range(3,5)],s*4)}const n=new d.Mesh(nt(Ht,{iA:a,iB:o},e),It(0,["#FF6420","#FF7430","#FFB480","#E8588C"],{boost:1.2,glow:.45}));n.frustumCulled=!1,n.name="anthias",ze.add(n)}await i.yield();const oa=Math.round(300*(.6+.4*C)),sa=It(1,["#2C7CCB","#5AA8EA","#E6F1F8","#EFC72E","#F5D23C"]);{const e=new Float32Array(oa*4),a=new Float32Array(oa*4);for(let s=0;s<oa;s++)e.set([t.gauss()*1.5,t.gauss()*.9,0,t.range(.36,.5)],s*4),a.set([t(),t.range(-30,30),t(),t.range(2.6,3.6)],s*4);const o=new d.Mesh(nt(ho,{iA:e,iB:a},oa),sa);o.frustumCulled=!1,o.name="fusiliers",ze.add(o)}await i.yield();const Aa=le(we,Pt,.72),na=Z.pointAt(Aa).addScaledVector(W,5).add(r(0,.2,0));{const e=new Float32Array([na.x,na.y,na.z,I.cuda?1.6:1.35]),a=new Float32Array([.3,0,.5,I.cuda?.5:.7]),o=I.cuda?ha(_s,8,.09,.03):ha(Vs,10,.13,.07),s=I.cuda?It(0,["#5E7C88","#A9C2CC","#E6EEF0","#3A4A52"],{flinch:0,pattern:.5}):It(0,["#2C7C88","#3FA890","#93CCB2","#2A6C8E"],{flinch:0,pattern:1});s.uniforms.uHeadA.value=Math.atan2(-S.x,-S.z)+.35;const l=new d.Mesh(nt(o,{iA:e,iB:a},1),s);l.frustumCulled=!1,l.name=I.cuda?"barracuda":"napoleon-wrasse",ze.add(l)}const Ca=(e,a,o,s,l,n,c)=>{const f=a.length*o,u=new Float32Array(f*4),v=new Float32Array(f*4);let b=0;for(const z of a)for(let M=0;M<o;M++,b++)u.set([z.x+h.gauss()*z.r,z.y-30+h.gauss()*z.r*.6,z.z+h.gauss()*z.r*1.3,h.range(s[0],s[1])],b*4),v.set([h(),z.away,z.flinch,h.range(2.4,3.6)],b*4);const m=new d.Mesh(nt(e,{iA:u,iB:v},f),It(0,l,n));return m.frustumCulled=!1,m.name=c,m},Ho=e=>e>46?15+(e-46)*.0625:14+e*(e>0?.022:.03),uo=["#2C7CCB","#5AA8EA","#E6F1F8","#EFC72E","#F5D23C"];let Fa,fo,po;{const e=[];for(let s=0;s<12;s++){const l=le(64,-32,(s+h())/12),n=s%2?1:-1;e.push({x:n*h.range(3.8,10),y:Ho(l)+h.range(-4,3.5),z:l,r:1.3,away:n>0?0:Math.PI,flinch:.5})}Fa=Ca(Ht,e,Math.round(24*(.6+.4*C)),[.36,.5],uo,{},"fusiliers-wall"),ze.add(Fa),await i.yield();const a=ea.map(s=>({x:s.x,y:s.y+2.3*s.big,z:s.z,r:1.25*s.big,away:s.x>Je(s.z)?0:Math.PI,flinch:.4}));fo=Ca(Ht,a,Math.round(20*(.6+.4*C)),[.3,.5],["#FF6420","#FF7430","#FFB480","#E8588C"],{boost:1.2,glow:.45},"anthias-exit"),tt.add(fo);const o=[];for(let s=0;s<6;s++){const l=le(-104,-172,(s+h())/6),n=s%2?1:-1;o.push({x:Je(l)+n*h.range(7,12),y:qe(l)+h.range(3.5,7),z:l,r:1.6,away:n>0?0:Math.PI,flinch:.4})}for(const s of[-1,1])o.push({x:he.x+s*h.range(10,12.5),y:he.y+h.range(-3.5,1),z:he.z+h.range(-3,4),r:1.7,away:s>0?0:Math.PI,flinch:.3});po=Ca(Ht,o,Math.round(26*(.6+.4*C)),[.36,.5],uo,{},"fusiliers-exit"),tt.add(po)}await i.yield();const mo={sunDir:Te.clone(),sunColor:P==="golden"?"#ffd9a8":P==="dawn"?"#a8c8e6":"#bfeaff",sunIntensity:P==="dawn"?1.5:2.5,sky:P==="golden"?"#4aa0b0":"#3fa6c8",skyIntensity:P==="dawn"?1.1:1.6,ground:"#3f7f8c",groundIntensity:P==="dawn"?1:1.6},jt=ve.makeFauna(x,{light:mo}),Ct=G(B.mantaOrbit.center),Na=I.rays?jt.add(ve.makeMantaRay({rng:t,span:.95,count:12,top:"#5a4e44",belly:"#e8e4dc",center:[Ct.x,Ct.y+1,Ct.z],radius:10,height:3,spread:[9,3,9]})):jt.add(ve.makeMantaRay({rng:t,span:2.25,count:2,top:"#34404e",belly:"#f4f4ee",patch:"#c6ced6",bank:26,center:[Ct.x+1.5,Ct.y+.5,Ct.z],radius:B.mantaOrbit.radius,height:2,spread:[1.5,2,12]}));if(Na&&Na.uniforms){const e=Na.uniforms;e.uFill&&(e.uFill.value=.3),e.uRim&&(e.uRim.value=1),e.uGroundColor&&e.uGroundColor.value.multiplyScalar(1.7)}await i.yield();const ia=I.rays?2:2.8,jo=ia/2.8,Ke=new d.Mesh(So(ia,I.rays?2.5:1,I.rays?2:1),new d.ShaderMaterial({uniforms:{..._t(),...ta,uT:vt,uFlap:{value:ia*.5},uSpan:{value:ia},uRayK:{value:I.rays?1:0},uHero:{value:1},uBounceM:J(new d.Color(.55,.49,.37).multiplyScalar((.3*et.uSunColor.value.r+.5*et.uSunColor.value.g+.2*et.uSunColor.value.b)/1.29))},vertexShader:zo,fragmentShader:Mo,fog:!0,side:d.DoubleSide}));Ke.frustumCulled=!1,Ke.visible=!1,Ke.name="manta-over",Ke.rotation.order="YXZ",ze.add(Ke);const Ft=[[-.121,48,3,9.5,0,0,2.9],[-.101,31,2,7.8,2,-14,2.6],[-.086,19.5,.8,6,4,-28,2.1],[-.073,11.4,-.3,4.4,4,-40,1.5],[-.061,6.1,-.6,2.9,4,-44,1],[-.036,5.8,-.5,2.7,4,-40,.8],[-.021,5.7,-.4,2.6,4,-32,.72],[-.006,5.7,-.3,2.6,4,-19,.66],[.009,5.9,-.2,2.65,4,-4,.6],[.019,6.2,-.1,2.75,3,12,.52],[.049,9,0,4.4,0,28,.15],[.089,12,2,7.4,0,12,-.15],[.104,10,2.4,9.2,2,30,-.5],[.124,5,2.6,13,0,40,-.9],[.139,-2,3,15,0,40,-1]],Ce=[0,0,0,0,0,0],vo=[],Uo=Qe("pass-rays:"+(i.seed??0));{const e=So(1),a=new d.ShaderMaterial({uniforms:{..._t(),...ta,uT:vt,uFlap:{value:.17},uSpan:{value:1},uRayK:{value:1},uHero:{value:0},uBounceM:Ke.material.uniforms.uBounceM},vertexShader:zo,fragmentShader:Mo,fog:!0,side:d.DoubleSide});for(const[o,s,l,n,c]of[[-150,8.5,3.2,9,.13],[-166,-9.5,3.5,8,-.11],[-112,7,2.6,7,.12],[-136,-8,3,10,-.1]]){const f=new d.Mesh(e,a);f.frustumCulled=!1,f.rotation.order="YXZ",f.name="sand-ray",tt.add(f),vo.push({m:f,cx:Je(o)+s,cz:o,rx:l,rz:n,w:c,ph:Uo.range(0,6.2832)})}}await i.yield();for(const e of[-1,1])jt.add(ve.makeShark({rng:t,count:Math.round(8*q),length:1.8,speed:9,spread:[2,2.5,10],along:{path:Z,side:e*8.5,up:-.5,lead:12,from:Rt-.03,to:.975,drift:2}})),await i.yield();if(I.dolphins)for(const[e,a]of[[-1,le(we,Pt,.62)],[1,le(we,Pt,.98)]]){const s={len:2.5,speed:13,count:3,light:"underwater",swim:[1.5,.035,4,.2],fin:[.3,.05,.25,1],bank:26,bob:.7,rim:.8,spec:1.2,shine:40,caustics:.6,spread:[1.8,1.3,2]};jt.add(ve.makeSwimmer(ve.dolphinGeometry({len:2.5,top:"#7890a6",belly:"#f2f5f5",fin:"#64798e"}),{rng:t,light:mo,cross:{path:Z,u:a,lead:9.5,angle:62,side:e,height:.4,span:90,sag:2.5,duration:Oe}},t,s)),await i.yield()}{const e=[],a=Math.round(64*Math.min(q,1)),o=r(),s=r();for(let l=0;l<4e3&&e.length<a;l++){const n=le(Rt+.004,.992,Math.pow(t(),.8));Z.pointAt(n,o),Z.tangentAt(n,s);const c=o.z-ne.object.position.z,f=Math.hypot(s.x,s.z)||1,u=n>Wa?le(6,10,O(Wa,.99,n)):2.6,v=Math.min(24,ya(c)-8),b=t.chance(.5)?1:-1,m=b*t.range(u,Math.max(u+1.4,v)),z=o.x-ne.object.position.x+-s.z/f*m,M=c+s.x/f*m,k=Math.max(o.y-ne.object.position.y+t.range(-3,7.5),qe(c)+1.8);let L=!0;for(const E of e)if((E.x-z)**2+((E.y-k)*1.5)**2+(E.z-M)**2<12){L=!1;break}L&&e.push({x:z,y:k,z:M,line:Math.abs(m)})}for(let l=0;l<12;l++){const n=t.range(-176,-134);e.push({x:he.x+(t.chance(.5)?1:-1)*t.range(7,14),y:qe(n)+t.range(2,3.2),z:n,line:9})}ne.addSharks(e,0,{range:125});var Go=e;{const l=[];for(let n=0;n<600&&l.length<18;n++){const c=l.length<11,f=c?-1:1,u=he.z+(c?w.range(3,30):w.range(1,46)),v=he.x+f*(c?w.range(8.5,16):w.range(9.5,23)),b=Math.min(27,qe(u)+(c?w.range(3.5,11):w.range(2.5,14)));let m=Math.abs(v-he.x)<ya(u)-5;for(const z of e)if((z.x-v)**2+((z.y-b)*1.5)**2+(z.z-u)**2<10){m=!1;break}for(const z of l)if((z.x-v)**2+((z.y-b)*1.5)**2+(z.z-u)**2<10){m=!1;break}m&&l.push({x:v,y:b,z:u,line:Math.abs(v-he.x)})}ne.addSharks(l,0,{rng:w,range:125,name:"sharks-portal",offset:9e3})}}await i.yield();{const e=[],a=Math.round(235*Math.min(q,1)*(.6+.4*C)),o=[];for(let f=0;f<=70;f++){const u=-48-f*2;o.push(Z.nearestXZ(Je(u),u).y+30)}await i.yield();const s=f=>{const u=Ge((-48-f)/2,0,69.999),v=Math.floor(u);return le(o[v],o[v+1],u-v)},l=(f,u,v)=>{for(const b of e)if((b.x-f)**2+((b.y-u)*1.5)**2+(b.z-v)**2<11.5)return!1;for(const b of Go)if((b.x-f)**2+((b.y-u)*1.5)**2+(b.z-v)**2<11.5)return!1;return!0};for(let f=0;f<9e3&&e.length<a;f++){f%250===249&&await i.yield();const u=-50-130*Math.pow(h(),1.25),v=At(u),b=Je(u),m=u>-121?4.2:le(6,10,O(-121,-186,u)),z=Math.max(m+2,Math.min(21,v.hw-6.5)),M=h.chance(.5)?1:-1,k=le(m,z,Math.pow(h(),1.3)),L=b+M*k,E=s(u),K=h.chance(.06),_=K?qe(u)+1.4+h.range(.6,.9):le(qe(u)+2.2,Math.min(v.rim-2.5,E+10),h());Math.hypot(L-Ze.x,u-Ze.z)<9||l(L,_,u)&&e.push({x:L,y:_,z:u,line:k,d:k+Math.abs(_-E)*.6})}await i.yield(),e.sort((f,u)=>f.d-u.d);const n=Math.min(e.length,60);[[-40,-92],[-92,-134],[-134,-200]].forEach(([f,u],v)=>{ne.addSharks(e.slice(0,n).filter(b=>b.z<=f&&b.z>u),0,{rng:h,range:125,name:"sharks-rear-near",offset:1e3*(v+1)}),ne.addSharks(e.slice(n).filter(b=>b.z<=f&&b.z>u),1,{rng:h,range:125,name:"sharks-rear-far",offset:1e3*(v+5)})})}await i.yield();const Me=Qe("pass-pacers:"+(i.seed??0)),Pa=[],Ra=new d.Matrix4,go=new d.Euler(0,0,0,"YXZ"),je=B.heading,at=et.uSway.value;{const e=34/Oe*Z.length,a=r(0,0,0),o=r(0,0,0),s=r(0,0,0),l=r(0,0,0),n=[];let c=25/Oe*Z.length+Me.range(0,8),f=Me.range(0,360);for(let u=0;c<=e;u++,c+=Me.range(8,10),f+=120+Me.range(-35,35)){const v=Me.range(2.6,3),b=f*.01745,m=Math.cos(b),z=Math.sin(b),M=v*Me.range(.3,.5),k=Me.range(9,14),L=Me(),E=Me.range(0,6.2832),K=Me(),_=Me.range(-.07,.07),ae=Me.range(-.1,.1);Z.posAtDist(c,a),Z.tangentAtDist(c,o);const $=Math.hypot(o.x,o.z)||1;s.set(-o.z/$,0,o.x/$),l.crossVectors(s,o).normalize();const H=B.crossAngle*.01745+(m<0?.5:0)+Me.range(-.08,.08),j=r(Math.sin(H),0,Math.cos(H)),de=[[j.x*M,0,j.z*M],[j.x*Math.cos(_)*v*.5,Math.sin(_)*v*.5,j.z*Math.cos(_)*v*.5],[je.z*at.x,0,-je.x*at.x]].map(([ee,te,U])=>[ee*s.x+U*s.z,ee*l.x+te*l.y+U*l.z]),_e=ee=>{for(let U=0;U<8;U++){const me=U&1?1:-1,Ue=U&2?1:-1,wt=U&4?1:-1;n[U]=[m*ee+me*de[0][0]+Ue*de[1][0]+wt*de[2][0],z*ee+me*de[0][1]+Ue*de[1][1]+wt*de[2][1]]}let te=1e9;for(let U=0;U<7;U++)for(let me=U+1;me<8;me++){const Ue=n[me][0]-n[U][0],wt=n[me][1]-n[U][1],yo=Ge(-(n[U][0]*Ue+n[U][1]*wt)/Math.max(Ue*Ue+wt*wt,1e-9),0,1);te=Math.min(te,Math.hypot(n[U][0]+Ue*yo,n[U][1]+wt*yo))}return te};let V=Me.range(1.4,3);for(let ee=0;ee<40&&_e(V)<1.2+.25*v*at.w;ee++)V+=.2;const Q=ne.addPacer({length:v,variant:u%3,phase:K});if(!Q)break;Pa.push({q:a.clone().addScaledVector(s,m*V).addScaledVector(l,z*V).sub(ne.object.position),h:j,yaw:Math.atan2(j.x,j.z),pitch:_,roll:ae,surge:M,period:k,ph:L,beat0:E,pc:Q})}}await i.yield();{const e=Math.round(150*(.6+.4*C)),a=new Float32Array(e*4),o=new Float32Array(e*4),s=new Float32Array(e*4);for(let n=0;n<e;n++){const c=t.range(-186,-96),f=he.x+t.range(-17,17),u=De.reduce((m,z)=>Math.abs(z.c.z-c)<Math.abs(m.c.z-c)?z:m,De[0]),v=qe(c-1)-qe(c),b=1/Math.hypot(.25,v,1);a.set([f,ke(f,c,u)-30,c,t.range(6,12)],n*4),o.set([t(),t.range(.9,1.8),t.range(1.6,3.4),t.range(.22,.42)],n*4),s.set([-.25*b,v*b,-b,t.range(5,9)],n*4)}const l=new d.Mesh(nt(new d.PlaneGeometry(1,1).rotateX(-Math.PI/2),{iA:a,iB:o,iC:s},e),new d.ShaderMaterial({uniforms:{..._t(),uT:vt,uSmokeCol:J(et.uSunColor.value.clone().multiply(new d.Color(.42,.44,.4)).add(et.uSkyLight.value.clone().multiplyScalar(.3)))},vertexShader:qs,fragmentShader:Ds,fog:!0,transparent:!0,depthWrite:!1,side:d.DoubleSide}));l.frustumCulled=!1,l.renderOrder=2,l.name="sand-smoke",ze.add(l)}await i.yield();const ct=rs.makeUnderwater({rng:t,sky:We,surfaceY:0,floorY:-34,surfaceAt:No,water:R.uwWater,deep:R.uwDeep,fogDensity:R.uwFog,rayIntensity:R.rays,rays:{count:110,width:2.3},particles:{count:Math.round(900*(.5+.5*C)),range:40,size:.05},bubbles:!1});x.add(ct.object);{const e=ct.rays&&ct.rays.material,a="float len = smoothstep(0.,.16,vQ.y)*pow(1.-vQ.y,2.4);";e&&e.fragmentShader.includes(a)&&e.fragmentShader.includes("float x = vQ.x")&&e.fragmentShader.includes("float prof = ")&&(e.fragmentShader=e.fragmentShader.replace(a,`prof = .24*prof + .78*exp(-x*x*3.4)*(1.-x*x)*(1.-x*x);
  `+a))}if(ct.rays){const e=r();Z.tangentAt(.97,e),e.y=0,e.normalize();const a=-e.z,o=e.x,s=Te.clone().multiplyScalar(-1),l=[],n=[],c=[],f=[];for(let v=0,b=0;v<400&&b<16;v++){const m=(b%2?1:-1)*w.range(9,30),z=w.range(-9,55),M=w.range(24,38),k=w.range(2.2,4.2),L=w(),E=w.range(.3,.6),K=m+(s.x*a+s.z*o)*M;if(K*m<0||Math.abs(K)<8)continue;const _=ut.x+a*m-e.x*z,ae=ut.z+o*m-e.z*z,$=l.length/3;for(const[H,j]of[[-1,0],[1,0],[1,1],[-1,1]])l.push(H,j,0),n.push(_,ae,M,k),c.push(L,E);f.push($,$+1,$+2,$,$+2,$+3),b++}const u=new d.BufferGeometry;u.setAttribute("position",new d.Float32BufferAttribute(l,3)),u.setAttribute("aA",new d.Float32BufferAttribute(n,4)),u.setAttribute("aB",new d.Float32BufferAttribute(c,2)),u.setIndex(f);var ra=new d.Mesh(u,new d.ShaderMaterial({uniforms:{uRayDir:ct.rays.material.uniforms.uRayDir,uRayColor:ct.rays.material.uniforms.uRayColor,uT:vt,uFogK:{value:R.uwFog*1.5}},vertexShader:Cs,fragmentShader:Fs,transparent:!0,depthWrite:!1,blending:d.AdditiveBlending,side:d.DoubleSide}));ra.frustumCulled=!1,ra.renderOrder=4,ra.name="portal-shafts",ze.add(ra)}await i.yield();const la=ls.makeParticles({rng:t.fork("bubbles"),preset:"bubbles",count:Math.round(700*(.5+.5*C)),box:[16,12,16],size:[.02,.1],near:[.3,1.2]});la.setOpacity(0),x.add(la.object);const Qo=G(B.sheet.center),Oo=r(0,0,0),ca=r(0,0,0),Yo=r(0,0,0),Xo=[{at:(e,a)=>Oo.copy(F).addScaledVector(S,420*Qt(a)),from:0,to:ft,weight:.5},{at:(e,a)=>(Z.pointAt(Ge(a,0,1),ca),ca.set(F.x+(ca.x-F.x)*.4,0,F.z+(ca.z-F.z)*.4)),from:.015,to:.155,fade:.5,weight:.6},{at:(e,a)=>Yo.copy(F).addScaledVector(S,420*Qt(a)),from:.085,to:.245,fade:.45,weight:.62},{at:na,from:Aa-.07,to:Aa+.004,weight:.3},{at:Qo,from:Pt-.06,to:Gt+.01,weight:.5},{at:r(Ze.x*.45,Ze.y-30+B.coralHead.crownY+3.5,Ze.z),from:Rt-.1,to:Rt-.004,weight:.28}];await i.yield(),await We.prewarm(i.renderer,null,x);const $o=yt.sun.intensity,Zo=yt.hemi.intensity,Jo={color:Dt.clone(),density:7e-5},Ve=r(0,0,0),ot=r(0,0,0),wo=new d.Vector2,es=$e.rotation.y,ts=le(we,Pt,.55);return{scene:x,path:Z,duration:Oe,camera:{fov:62,near:.3,far:6e3,lookAhead:22,sway:.4,bank:.7},pois:Xo,portal:{shape:"circle",radius:7,color:"#C8FFEC",glow:1,revealDistance:160,tilt:!0},post:{exposure:R.exposure,bloom:{strength:.3,radius:.6,threshold:1},grade:{saturation:R.satur,contrast:1.05,tint:R.tint,shadowTint:"#020a16",vignette:.26,grain:.02,aberration:0}},ride:"none",update(e,a,o,s){const l=o.matrixAutoUpdate===!1;l?Ea.copy(o.matrixWorld):o.updateMatrixWorld(),Bt.setFromMatrixPosition(o.matrixWorld);const n=Qt(s);pe.uPlate.value.z=n,pe.uPlate.value.w=a,be.scale.setScalar(n),be.position.set(F.x*(1-n),0,F.z*(1-n)),Yt.position.set(Bt.x,0,Bt.z);const c=(s-va)*Oe,f=Oa.x+bt.x*5*c,u=Oa.z+bt.z*5*c;$e.position.set(f,pt.ripH(f,u,a)*.8+.14,u),$e.rotation.set(.035*Math.sin(a*1.3),es,-.1+.04*Math.sin(a*.9)),$e.scale.setScalar(1.2/Math.max(n,.8)),pe.uCanoe.value.set(f,u,bt.x,bt.z),ct.update(e,a,o);const v=ct.applyTo(x,o,Jo);Xe.visible=!v,ze.visible=v,We.object.visible=!v,ma.object.visible=!v,We.update(e,a,o),yt.update(e,a,o),ma.update(e,a,o),yt.sun.intensity=$o*(v?.5:1),yt.hemi.intensity=Zo*(v?.8:1),Ee.update(e,a,o,s,!v),jt.update(e,a,o,s,v),ne.update(e,a,o),vt.value=a,Ma.value.copy(Bt),$a.uniforms.uWispT.value=a,i.renderer.getDrawingBufferSize(wo),no.value=2/(Math.max(o.projectionMatrix.elements[5],.1)*Math.max(wo.y,1));const b=Ge(s+(s-ts)*.85+4/Z.length,we+.008,Gt-.02);Z.pointAt(b,Ve),Z.tangentAt(b,ot),sa.uniforms.uSchoolPos.value.set(Ve.x+ot.z*5.5,Ve.y-1.2,Ve.z-ot.x*5.5),sa.uniforms.uSchoolDir.value.copy(ot),sa.uniforms.uSchoolK.value=O(we+.004,we+.03,s)*(1-O(Gt-.06,Gt-.015,s));const m=s-Rt;if(v&&m>Ft[0][0]&&m<Ft[Ft.length-1][0]){Us(Ft,m,Ce),Z.pointAt(s,Ve),Z.tangentAt(s,ot);const M=Math.hypot(ot.x,ot.z)||1,k=ot.x/M,L=ot.z/M,E=Math.cos(Ce[5]),K=Math.sin(Ce[5]),_=le(1,jo,O(-.09,-.06,m)*(1-O(.02,.05,m)));Ce[0]*=_,Ce[1]*=_,Ce[2]*=_,Ke.position.set(Ve.x+k*Ce[0]-L*Ce[2],Ve.y+Ce[1],Ve.z+L*Ce[0]+k*Ce[2]),Ke.rotation.set(Ce[3]*.01745,Math.atan2(k*E+L*K,L*E-k*K),Ce[4]*.01745),Ke.scale.setScalar(.02+.98*O(Ft[0][0],Ft[0][0]+.012,m)),Ke.visible=!0}else Ke.visible=!1;if(Tt.length){const M=!v&&s>ft-.008&&s<we-.012,k=3.4,L=Z.length/Oe,E=Za.uSpl.value;for(let K=0;K<Tt.length&&K<6;K++){const _=Tt[K],ae=a/k+_.ph;for(let $=0;$<2;$++){const H=((ae-($?.48086:.01914))%1+1)%1*k,j=E[K*2+$];M&&H<.8?(_.pod.route.pointAt(_.pod.uniforms.uTravel0.value-_.lag-L*H,Ve),j.set(Ve.x+_.ox,Ve.z+_.oz,K*2+$,H)):j.w=-1}}}for(let M=0;M<Pa.length;M++){const k=Pa[M];if(k.pc)if(v){const L=6.2832*(a/k.period+k.ph),E=k.surge*Math.sin(L),K=k.q.x+k.h.x*E,_=k.q.y,ae=k.q.z+k.h.z*E,$=at.x*Math.sin(at.y*(K*je.x+ae*je.z)+at.z*a+(K*je.z-ae*je.x)*.035+_*.06);go.set(-k.pitch,k.yaw+at.w*.5*Math.cos(at.y*(K*je.x+ae*je.z)+at.z*a),k.roll),Ra.makeRotationFromEuler(go).setPosition(K+je.z*$,_,ae-je.x*$),k.pc.place(Ra,!0,.4*Math.max(0,Math.cos(L)),0,a*3.6+k.beat0,2)}else k.pc.place(Ra,!1)}const z=Bt.z;if(Ko.visible=z<10,tt.visible=z<10,Fa.visible=z<178&&z>-55,v&&z<10)for(const M of vo){const k=M.ph+a*M.w,L=M.cx+Math.cos(k)*M.rx,E=M.cz+Math.sin(k)*M.rz,K=-Math.sin(k)*M.rx*M.w,_=Math.cos(k)*M.rz*M.w,ae=Math.hypot(K,_)||1;M.m.position.set(L,qe(E)-30+1,E),M.m.rotation.set(-Math.atan((qe(E+_/ae)-qe(E))*.9),Math.atan2(K,_),.12*Math.sin(a*.6+M.ph))}for(const M of Ro){const k=M.px+M.hx*4.5*a,L=M.pz+M.hz*4.5*a;M.m.position.set(k,.14,L),M.m.rotation.set(.03*Math.sin(a*1.2+M.px),M.yaw,-.08+.04*Math.sin(a*.8+M.pz)),M.u.value.set(k,L,M.hx,M.hz)}la.setOpacity(v?O(we-.004,we+.003,s)*(1-O(we+.014,we+.034,s)):0),la.update(e,a,o),l&&o.matrixWorld.copy(Ea)},dispose(){We.dispose?.(),ho.dispose(),Ht.dispose()}}}};export{Js as default};
