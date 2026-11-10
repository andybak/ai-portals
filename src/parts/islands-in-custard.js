import*as a from"three";import{clamp as Ce,lerp as Ae,smoothstep as R}from"../kit/core.js";const ra={flat:1,bloom:{strength:0},grade:{saturation:1,contrast:1,vignette:0,grain:0}},na=["#F3D77A","#FBF7EF","#CFC6D6","#6B3A1C","#F2B45A","#8A3E12","#BFDDE0"],Be=`
uniform float uTime; uniform vec3 uSun; uniform vec3 uApricot; uniform float uFar;
float h13(vec3 p){ p = fract(p * vec3(.1031, .1030, .0973)); p += dot(p, p.yzx + 33.33); return fract((p.x + p.y) * p.z); }
float h12(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
vec2 h22(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz) * q.zy); }
float vn3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(mix(h13(i), h13(i + vec3(1,0,0)), f.x), mix(h13(i + vec3(0,1,0)), h13(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(h13(i + vec3(0,0,1)), h13(i + vec3(1,0,1)), f.x), mix(h13(i + vec3(0,1,1)), h13(i + vec3(1,1,1)), f.x), f.y), f.z); }
float vn2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h12(i), h12(i + vec2(1,0)), f.x), mix(h12(i + vec2(0,1)), h12(i + vec2(1,1)), f.x), f.y); }
// the distance law: beyond 300 m toast goes first (x), then shade (y), and all of it pales into apricot (z)
vec3 farLaw(float d){ d *= uFar; return vec3(smoothstep(300., 620., d), smoothstep(480., 1000., d), .82 * smoothstep(300., 1500., d)); }
// the three custard swells (70 m crest to crest, one every 9 s, 1.2 m high in all): height in .x, slope in .yz
vec3 swell(vec2 p, float t){
  vec3 r = vec3(0.);
  vec2 d1 = vec2(.966, .259), d2 = vec2(.731, -.682), d3 = vec2(-.208, .978);
  float a1 = dot(p, d1) * .0898 - t * .698, a2 = dot(p, d2) * .1366 - t * .93, a3 = dot(p, d3) * .0571 - t * .52;
  r.x = .42 * sin(a1) + .13 * sin(a2) + .2 * sin(a3);
  r.yz = d1 * (.42 * .0898 * cos(a1)) + d2 * (.13 * .1366 * cos(a2)) + d3 * (.2 * .0571 * cos(a3));
  return r; }
`,ia=(F,L,n)=>.42*Math.sin((F*.966+L*.259)*.0898-n*.698)+.13*Math.sin((F*.731-L*.682)*.1366-n*.93)+.2*Math.sin((-F*.208+L*.978)*.0571-n*.52),la=`
attribute float aToast; attribute vec3 aPull;
#ifdef INSTANCED
attribute vec4 aBob;
#endif
uniform float uCoat;
#ifdef MASSIF
attribute float aShade;
#endif
varying vec3 vW; varying vec3 vN; varying vec3 vPull; varying float vToast; varying float vCoat; varying vec3 vL; varying float vShade;
${Be}
void main(){
  vec3 p = position, n = normal, pl = aPull; vL = position;
  float coat = uCoat; vShade = 0.;
#ifdef MASSIF
  vShade = aShade;                                    // the peaks' shadows lying on the massif (worked out once, at build)
#endif
#ifdef INSTANCED
  p = (instanceMatrix * vec4(p, 1.)).xyz; n = mat3(instanceMatrix) * n; pl = mat3(instanceMatrix) * pl;
  vec3 c = instanceMatrix[3].xyz; float ph = aBob.x * 6.2832, w = 6.2832 / max(aBob.z, 1.);
  if (aBob.y == 0. && aBob.w == 0.) vShade = clamp(aBob.z - 1., 0., 1.);   // a thing that neither bobs nor tilts (a kiss) keeps its cast shade in the period slot
  float bob = aBob.y * sin(uTime * w + ph), lag = aBob.y * sin((uTime - 1.3) * w + ph);
  float tx = aBob.w * sin(uTime * w * .61 + ph * 1.7), tz = aBob.w * sin(uTime * w * .47 + ph * 2.3), ty = uTime * .02 * (aBob.x - .5) * 4. * min(aBob.y, 1.);
  vec3 q = p - c; float cs = cos(ty), sn = sin(ty); q.xz = mat2(cs, -sn, sn, cs) * q.xz; n.xz = mat2(cs, -sn, sn, cs) * n.xz; pl.xz = mat2(cs, -sn, sn, cs) * pl.xz;
  q.y += q.x * tx + q.z * tz; n.xz -= vec2(tx, tz) * n.y; q.y += bob;
  p = c + q; coat = c.y + uCoat + 1.2 * aBob.y + max(bob - lag, 0.) * 1.6 + bob * .35;
#endif
  vec4 w4 = modelMatrix * vec4(p, 1.); vW = w4.xyz; vN = normalize(mat3(modelMatrix) * n); vPull = mat3(modelMatrix) * pl;
  vToast = aToast; vCoat = vW.y - coat;
  gl_Position = projectionMatrix * viewMatrix * w4;
}`,ca=`
uniform vec3 uWhite, uLilac, uGold, uChestnut, uCustard, uTrough, uAmberLight, uShadeDeep, uBurnt, uDeep, uPale, uDark, uAmber, uCream; uniform sampler2D uNet; uniform mat4 uNetMat; uniform float uNetAmt;
uniform vec4 uSauce; uniform float uTap;
varying vec3 vW; varying vec3 vN; varying vec3 vPull; varying float vToast; varying float vCoat; varying vec3 vL; varying float vShade;
${Be}
void main(){
  vec3 n = normalize(vN + vec3(0., 1e-5, 0.));
  float d = distance(cameraPosition, vW); vec3 far = farLaw(d);
  float near = 1. - smoothstep(35., 110., d), mid = 1. - smoothstep(90., 260., d);
  // spoon striae: tone only, noise squeezed along the pull
  vec3 pa = normalize(vPull + vec3(0., 1e-4, 0.)); vec3 ps = vW - pa * dot(vW, pa) * .96;
  float stria = vn3(ps * 1.25) - .5; float stria2 = vn3(ps * .45 + 7.) - .5;
  // two tones with a soft terminator one twentieth of the form wide
  float l = dot(n, uSun) + stria2 * .035 * mid;
  // FORM: every island is a round solid. The side away from the light deepens from lilac to a cool lilac-grey at its
  // core; the lit side takes a half tone before the terminator; a cast shade (vShade) is the paler lilac of open shade
  float lit = smoothstep(-.11, .13, l) * (1. - vShade * .96);
  float wedge = 0., tapAmb = 0.;
#ifdef MASSIF
  // THE TAP (rare): where a panel of the cage has broken, plain sunlight falls on the wall that faces the sun as a clean
  // white wedge, its point high up the valley, widening downhill as uTap goes 0..1; no amber bar crosses it
  { float fx = -vL.x * sign(uSun.x + 1e-4), t = clamp((66. - vL.y) / 50., 0., 1.), zc = 40. + 34. * t, hw = (1.2 + 15. * t) * uTap;
    float wa = fwidth(vL.z) + .15;
    wedge = (1. - smoothstep(hw - wa, hw + wa, abs(vL.z - zc))) * smoothstep(2.5, 5., fx) * step(.001, uTap) * step(vL.y, 66.) * smoothstep(-.3, .1, l);
    lit = max(lit, wedge);
    tapAmb = (1. - wedge) * uTap * smoothstep(2.5, 5., fx) * (1. - smoothstep(hw + 4., hw + 26., abs(vL.z - zc))) * step(vL.y, 80.); }   // beside it the wall is in the cage's amber light, which is what makes the wedge white
#endif
  float core = 1. - smoothstep(-.8, .12, l);
  vec3 shadeC = mix(uLilac, uShadeDeep, .38 + .62 * core) * (.95 + .07 * smoothstep(-.3, .9, n.y));
  vec3 litC = mix(mix(uWhite, uLilac, .3), uWhite, smoothstep(.08, .7, l));
  vec3 col = mix(shadeC, litC, lit);
  col = mix(col, mix(uLilac, uApricot, .55), (1. - smoothstep(-.75, -.1, n.y)) * (1. - lit) * .8);   // apricot bounce under overhangs
  // matt white turns a shade toward lilac where the form rolls away from the eye: it is what holds a white peak's outline against a pale sky
  { float rim = smoothstep(.7, .98, 1. - abs(dot(n, normalize(cameraPosition - vW + vec3(0., 1e-5, 0.))))); col = mix(col, mix(uWhite, uLilac, .8), rim * lit * .6 * (1. - far.y)); col = mix(col, uShadeDeep, rim * (1. - lit) * .45 * (1. - far.y)); }   // (and in shade, a deeper lilac: a kiss in shade is still round)
  float sb = clamp(stria * 2.6, -.5, .5);
  col *= 1. + sb * (.085 + .03 * (1. - lit)) * mid * (.35 + .65 * near) + stria2 * .035;
  // pinhole pits, close only
  vec3 pc = vW * 1.45, pi = floor(pc); float ph = h13(pi);
  vec3 pf = fract(pc) - .5 - (vec3(h13(pi + 3.1), h13(pi + 5.7), h13(pi + 9.2)) - .5) * .5;
  float pr = .07 + .1 * fract(ph * 7.3);
  float pit = (1. - smoothstep(pr * .6, pr, length(pf))) * step(.5, ph) * near;
  col = mix(col, col * vec3(.78, .75, .82), pit);
  // amber light through the cage, on the sun side only
  vec4 nc = uNetMat * vec4(vW, 1.); vec2 nuv = nc.xy * .5 + .5;
  float net = smoothstep(.04, .8, texture2D(uNet, nuv, -.35).r) * uNetAmt * step(abs(nc.x), 1.) * step(abs(nc.y), 1.);
  // on a steep wall beside the lens fine bars would be smeared pinstripes: there the wall is barred with a few BROAD bands of amber with white windows between.
  // (round firm bars) A BAND HAS AN EDGE: each band's edge is about two and a half pixels broad, 4 cm at least (e1, e2, e3: 1.2 times the band's own change across a pixel), never softer than the
  // soft edge it had before); each band keeps its place, its middle line, its breadth at half strength, its strength and its creep
  { float wall = (1. - smoothstep(34., 80., d)) * (1. - smoothstep(.5, .85, n.y));
    vec2 wp = vec2(vW.z, vW.y) + (vec2(vn2(vW.zy * .045), vn2(vW.yz * .05 + 7.)) - .5) * 10. + vec2(uTime * .25, 0.);   // the bars are arcs, and they creep
    float b1 = abs(fract(dot(wp, vec2(.94, .34)) / 12.) - .5) * 12., b2 = abs(fract(dot(wp, vec2(.5, -.87)) / 16. + .3) - .5) * 16., b3 = abs(fract(dot(wp, vec2(.77, .64)) / 25. + .6) - .5) * 25.;
    float e1 = clamp(fwidth(b1) * 1.2, .02, .4), e2 = clamp(fwidth(b2) * 1.2, .02, .3), e3 = clamp(fwidth(b3) * 1.2, .02, .6);
    float broad = max(1. - smoothstep(.95 - e1, .95 + e1, b1), max((1. - smoothstep(.6 - e2, .6 + e2, b2)) * .8, (1. - smoothstep(1.6 - e3, 1.6 + e3, b3)) * .9)) * uNetAmt * step(abs(nc.x), 1.) * step(abs(nc.y), 1.);   // (under the cage only)
    net = mix(net, broad * .9, wall); }
  net = max(net, tapAmb * .8);
  col = mix(col, col * uAmberLight, clamp(net, 0., 1.) * (1. - wedge) * lit * (1. - .45 * smoothstep(.55, .95, n.y)));   // on level ground the low sun draws the bars out long: paler there
  // toast: a mesh mask through a hard stepped ramp, gold then chestnut; hairline cracks show white beneath
  float tn = vToast + (vn3(vW * .9) - .5) * .22 + (vn3(vW * 4.) - .5) * .08 * mid;
  float aa = fwidth(tn) + 1e-4;
  float g1 = smoothstep(.46 - aa, .46 + aa, tn), g2 = smoothstep(.7 - aa, .7 + aa, tn);
  float g3 = smoothstep(.92 - aa, .92 + aa, tn);                        // the third step: burnt, where the flame stayed
  vec3 toast = mix(mix(uGold, uChestnut, g2), uBurnt, g3 * .85) * mix(.8, 1., lit);
  float cr = abs(vn3(vW * 1.5 + 11.) - .5 + (vn3(vW * 4.3 + 5.) - .5) * .3); float cw = clamp(fwidth(cr), .004, .05);
  float crack = (1. - smoothstep(cw * .8, cw * 1.9, cr)) * (1. - smoothstep(16., 55., d)) * g1;   // a hairline a pixel or two wide, white beneath
  float bead = step(.965, h13(floor(vW * 1.4))) * (1. - smoothstep(.1, .2, length(fract(vW * 1.4) - .5))) * near * g1;
  toast = mix(toast, uWhite * .97, crack); toast = mix(toast, vec3(.95, .62, .2), bead);
  col = mix(col, toast, g1 * (1. - far.x));
#ifdef MASSIF
  // CARAMEL SAUCE (hero space): poured in the hollow, it pools round the hoop's foot and runs down the spoon valley to
  // the sea: pale honey where it is thin at its edge, dark amber where it lies deep, one cream glint along its sunward
  // side, slow streaks sliding downhill. It gives the high ground a floor of its own colour.
  {
    float zc = vL.z, mx = -2.5 * sin(zc * .045 + uSauce.x) + 2.6 * (vn2(vec2(zc * .06, 7.)) - .5);
    mx += 4. * sin(zc * .19 + 2. * uSauce.x) * smoothstep(-12., 6., zc) * (1. - smoothstep(112., 130., zc));   // the poured thread swings from side to side as it runs, eased in below the pad and out between 112 and 130 m down the valley, where its run ends
    float hw = .4 + 1.5 * vn2(vec2(zc * .09, 3.)) * vn2(vec2(zc * .031, 8.)) * 2.;   // a poured thread running downhill: hair-fine in places, fat where it slows
    { float sw = smoothstep(-12., 6., zc) * (1. - smoothstep(112., 130., zc)), lm = 5. - hw; mx = mix(mx, mx / sqrt(1. + mx * mx / (lm * lm)), sw); }   // and it keeps to the spoon's corridor: at its full swing its edge stays within 5 m of the course line (no peak stands inside 4 m of that line, see heightAt's corridor); the limit eases off with the swing, over flat ground at both ends
    float dR = abs(vL.x - mx) - hw + 30. * (1. - smoothstep(-14., -7., zc)) + 30. * smoothstep(126., 134., zc);
    vec2 pp = vL.xz - vec2(0., -15.5);   // (never a sheet: only a small pooled pad where the hoop stands)
    float dP = length(pp * vec2(1., 1.25)) - (5.6 + 4. * (vn2(pp * .21 + 3.) - .5) + 1.6 * (vn2(pp * .6 + 11.) - .5));
    float ds = min(dR, dP), k = -ds, sa = fwidth(ds) + 1e-3;
    float mask = (1. - smoothstep(-sa, sa, ds)) * uSauce.y;
    vec3 sc = mix(uPale, mix(uAmber, uDark, .72), smoothstep(0., .7, k));
    sc *= .86 + .26 * vn2(vec2(vL.x * .9, zc * .1 - uTime * .35));
    sc = mix(sc, uPale, .3 * smoothstep(.55, .9, vn2(pp * .07 + vec2(uTime * .03, 0.))) * smoothstep(1.5, 4., k));
    float rr = length(vL.xz - vec2(0., -17.)); sc *= 1. + .09 * sin(rr * 1.5 - uTime * 1.1) * (1. - smoothstep(3., 15., rr));   // slow rings from the hoop's foot
    // GLOSS: at a grazing angle it takes the pale honey of the steam sky, and the ring's light lies on it as one long soft streak toward the lens
    vec3 vd = normalize(vW - cameraPosition + vec3(0., 1e-5, 0.)); vec3 Rr = reflect(vd, vec3(0., 1., 0.)); vec3 tr = normalize(vec3(0., 62., -18.) - vL);
    float fres = 1. - clamp(-vd.y, 0., 1.); fres *= fres; fres *= fres;
    sc = mix(sc, mix(uPale, uCream, .25), clamp(fres * .8, 0., .42) * smoothstep(.6, 2.6, k));
    float az = abs(Rr.x * tr.z - Rr.z * tr.x), st = (1. - smoothstep(0., .34, az)) * smoothstep(.1, .8, dot(Rr, tr)) * smoothstep(.5, 3., -dP);
    sc = mix(sc, vec3(1., .9, .66), st * st * .5);
    sc *= mix(.8, 1., lit);
    float gl = (1. - smoothstep(.05, .13, abs(k - .32))) * step(0., (vL.x - mx) * uSun.x) * smoothstep(.52, .66, vn2(vec2(zc * .22 - uTime * .22, vL.x * .12)));   // short glints on its sunward shoulder, never a line
    sc = mix(sc, uCream, gl * .9 * (1. - smoothstep(60., 140., d)));
    col = mix(col, col * uAmberLight, (1. - smoothstep(0., 1.6, ds)) * .7 * uSauce.y);   // the meringue beside it is stained
    col = mix(col, sc, mask);
  }
#endif
  // custard coat below a scalloped line
  float sc = vCoat + (vn3(vec3(vW.xz * .55, 3.)) - .5) * 1.5 + abs(sin(vn3(vec3(vW.xz * .23, 9.)) * 12.)) * .5;
  float ca = fwidth(sc) + 1e-4; float coat = 1. - smoothstep(-ca, ca, sc);
  col *= mix(vec3(.8, .765, .83), vec3(1.), smoothstep(-.3, 5., sc + (1. - lit) * 1.5));   // the contact shade: it darkens toward the sea it sits in
  col = mix(col, mix(mix(uDeep, uTrough, .45), mix(uTrough, uCustard, .7), lit), coat);
  col = mix(col, col * vec3(1., .985, .93), (1. - smoothstep(0., .7, sc)) * (1. - coat) * .8);  // the tide mark
  // distance: shade goes, then everything pales into apricot
  col = mix(col, mix(uWhite, col, .35 + .65 * lit), far.y);
  col = mix(col, uApricot, far.z);
  gl_FragColor = vec4(clamp(col, 0., 1.), 1.);
}`,ha=`
varying vec3 vW; varying vec3 vSw;
${Be}
void main(){
  vec4 w4 = modelMatrix * vec4(position, 1.); vSw = swell(w4.xz, uTime); w4.y += vSw.x; vW = w4.xyz;
  gl_Position = projectionMatrix * viewMatrix * w4;
}`,ua=`
uniform vec3 uCustard, uTrough, uSpeck, uCream, uAmberLight; uniform sampler2D uFlow, uShade; uniform vec3 uFlowExt; uniform vec2 uCurrent;
uniform sampler2D uNet; uniform mat4 uNetMat; uniform float uNetAmt; uniform vec3 uCollar, uDeep, uPale, uDark, uAmber;
varying vec3 vW; varying vec3 vSw;
${Be}
// CARAMEL DRAWN ON THE SKIN: where the cook's thread crossed the sea it lies as loose spirals and rings (one to a 46 m
// cell, most cells), a rope half a metre wide with turns 4.6 m apart (so crossing one never flickers), turning slowly.
// Returns (coverage, 0 at the rope's edge .. 1 at its heart, glint).
float cKr(vec2 p, vec3 collar){ return 1. - smoothstep(.85, 1., distance(p, collar.xy) / max(collar.z, 1.)); }
vec3 drizzle(vec2 p, float px){
  vec2 c = floor(p / 46.), f = p - (c + .5) * 46.; float h = h12(c + 3.7);
  if (h < .22) return vec3(0.);
  f -= (h22(c + 9.1) - .5) * 19.;
  float R = mix(6.5, 12.5, h12(c + 5.3)), r = length(f) + (vn2(f * .3 + h * 31.) - .5) * 1.4;
  float th = atan(f.y, abs(f.x) < 1e-4 ? 1e-4 : f.x) + uTime * .02 * (h - .68) * 6.;
  float dl, env;
  if (h > .8) { dl = min(abs(r - R), abs(r - R * .52)); env = 1.; }
  else { float P = 4.6, q = (r - P * th / 6.2832) / P; dl = abs(fract(q + .5) - .5) * P; env = (1. - smoothstep(R, R + .4, r)) * smoothstep(.8, 1.4, r); }
  float w = .09 + .2 * vn2(f * .55 + 5.) * vn2(f * .21 + 9.) * 2.;   // a poured thread: hair-fine, swelling and thinning along its length
  float cov = (1. - smoothstep(w - px * .7, w + px * .7, dl)) * env * clamp(w / max(px * .7, 1e-3), 0., 1.);
  float core = clamp(1. - dl / w, 0., 1.);
  return vec3(cov, core, smoothstep(.55, .8, core) * smoothstep(.62, .8, vn2(f * .5 + uTime * .08)) * (1. - smoothstep(.3, .9, px))); }
// and round DROPS of it, 0.4 to 1 m across, one to a 12 m cell in most cells: small dark things at every distance
vec3 drops(vec2 p, float px){
  vec2 c = floor(p / 12.), f = p - (c + .5) * 12.; float h = h12(c * 1.37 + 21.3);
  if (h < .3) return vec3(0.);
  f -= (h22(c + 4.4) - .5) * 7.; float rd = mix(.4, 1.05, fract(h * 9.7)), dd = length(f);
  float cov = (1. - smoothstep(rd - px * .7, rd + px * .7, dd)) * clamp(rd / max(px * .9, 1e-3), 0., 1.);
  return vec3(cov, clamp(1. - dd / rd, 0., 1.), 1. - smoothstep(rd * .14, rd * .22, length(f - vec2(.34, -.3) * rd))); }
float specks(vec2 uv, float px, float dens, float rs){
  vec2 c = floor(uv), f = fract(uv); vec2 h = h22(c); float k = h12(c + 17.3);
  float r = mix(.05, .2, k * k) * rs; float on = step(1. - dens, h12(c + 41.7));
  float dd = length(f - .5 - (h - .5) * .6);
  float cov = 1. - smoothstep(r - px, r + px, dd);
  return on * mix(cov, 3.14 * r * r, clamp(px * 2.2 - .15, 0., 1.)); }
void main(){
  vec3 V = vW - cameraPosition; float d = length(V); float dxz = length(V.xz) + 1e-3; vec3 far = farLaw(d);
  float px = length(fwidth(vW.xz));                    // metres of custard under one pixel (long at a grazing angle)
  vec2 fuv = (vW.xz - uFlowExt.xy) * uFlowExt.z + .5; vec4 fl = texture2D(uFlow, fuv);
  float inb = step(abs(fuv.x - .5), .499) * step(abs(fuv.y - .5), .499);
  float shore = mix(16., fl.r * 16., inb); vec2 flow = mix(uCurrent, (fl.gb - .5) * 4. * length(uCurrent), inb); float lee = fl.a * inb;
  // the second data texture: R = the islands' shadows lying away from the sun, G = how far the stream function is bent by the islands (m)
  vec4 sh4 = texture2D(uShade, fuv); float shade = sh4.r * inb;
  vec2 cdir = normalize(uCurrent + vec2(1e-4, 0.)); float along = dot(vW.xz, cdir), psi = dot(vW.xz, vec2(-cdir.y, cdir.x)) + sh4.g * inb;
  vec2 sx = normalize(uSun.xz + vec2(1e-4, 0.)); vec2 vx = V.xz / dxz;
  // SATIN. The surface is thick and slow: broad rolls, each with a cream flank toward the sun and the lens and a deep
  // lee and trough. The three swells (vertex) carry the far field; three shorter rolls are tone only and each sinks
  // into flat yellow where it would be narrower than a few pixels, so nothing ever shimmers.
  float hgt = smoothstep(-.6, .5, vSw.x); float sl = dot(vSw.yz, sx), sv = dot(vSw.yz, vx);
  float tone = 0., crest = 0.;
  { vec2 q = vec2(.26, .966); float ph = dot(vW.xz, q) * .2027 - uTime * .31, f = 1. - smoothstep(1.9, 5.2, px);
    tone += f * cos(ph) * (dot(q, vx) * .95 - dot(q, sx) * .8); crest += f * sin(ph); }
  { vec2 q = vec2(-.53, .848); float ph = dot(vW.xz, q) * .3307 + uTime * .27 + 1.7, f = 1. - smoothstep(1.2, 3.2, px);
    tone += .8 * f * cos(ph) * (dot(q, vx) * .95 - dot(q, sx) * .8); crest += .8 * f * sin(ph); }
  { vec2 q = vec2(.69, .724); float ph = dot(vW.xz, q) * .5712 - uTime * .36 + 4.1 + 1.3 * vn2(vW.xz * .03), f = 1. - smoothstep(.55, 1.6, px);
    tone += .6 * f * cos(ph) * (dot(q, vx) * .95 - dot(q, sx) * .8); crest += .6 * f * sin(ph); }
  float big = (-sl * 9. + sv * 6.) * (1. - smoothstep(6., 14., px));
  float kS = clamp(.47 + .36 * tone + big * .95 + .2 * (hgt - .5) + .1 * crest, 0., 1.); kS = kS * kS * (3. - 2. * kS);
  vec3 deep = uDeep;                                    // the deeper yellow of a shadow
  vec3 col = mix(mix(uTrough, deep, .5), uCustard, smoothstep(.02, .6, kS));
  col = mix(col, uCream, .32 * smoothstep(.58, .9, kS) + .2 * smoothstep(.86, .99, kS));   // the flank that faces the sun takes cream, its brow a satin light
  // the glossy skin: on the brow of a roll a soft white light that slides with it
  col = mix(col, mix(uCream, vec3(1.), .5), .5 * smoothstep(.9, .995, kS) * smoothstep(.35, .65, vn2(vW.xz * .16 + vec2(uTime * .1, -uTime * .06))) * (1. - smoothstep(1.5, 4., px)));
  col = mix(col, mix(uTrough, deep, .35), (1. - smoothstep(0., 8., shore)) * .6);
  // the wrinkled skin against every shore: raised folds parallel to it within 10 m, 1.6 m apart (inside uCollar's
  // circle, the massif's landing, they are 5 m folds, because there the course crosses them)
  float cK = 1. - smoothstep(.85, 1., distance(vW.xz, uCollar.xy) / max(uCollar.z, 1.));
  float wl = mix(1.6, 5.2, cK), wph = shore * 6.2832 / wl + vn2(vW.xz * .22) * 3.2 * mix(1., .35, cK);
  float wEnv = (1. - smoothstep(wl * 1.7, wl * 4.2, shore)) * smoothstep(.05, .5, shore) * (1. - smoothstep(wl * .2, wl * .6, px));
  float wr = sin(wph) * wEnv, wr2 = cos(wph) * wEnv;
  col = mix(col, mix(uTrough, deep, .45), clamp(-wr * .85, 0., 1.));
  col = mix(col, uCream, clamp(wr2 * .6, 0., 1.) * (1. - shade));
  col = mix(col, deep * vec3(.9, .82, .7), (1. - smoothstep(.0, 2.6, shore)) * .62);   // the contact shade: a dark rim of custard where each island sits in the sea
  // deeper-yellow shadows of the islands, several island-heights long at the golden hour: full strength, the rolls still showing in them
  col = mix(col, mix(deep * (.9 + .2 * kS), col * deep / max(uCustard, vec3(.02)), .6), shade);   // the same satin, deeper
  // one broad cream sheen: a soft streak a tenth of the frame high in the middle distance, lying toward the sun,
  // broken into lozenges by the rolls, never in shadow
  float dep = (cameraPosition.y - vW.y) / dxz;
  float band = smoothstep(.02, .045, dep) * (1. - smoothstep(.1, .19, dep));
  float hl = band * smoothstep(-.75, .35, dot(vx, sx)) * clamp(.34 + .95 * kS + .25 * tone, 0., 1.) * (1. - shade) * (1. - .5 * smoothstep(500., 1500., dxz));
  col = mix(col, mix(uCream, vec3(1.), .12), hl * .88);
  // VANILLA SPECKS carried by the flow (two phases that hand over so the pattern never stretches), drawn out into
  // STREAMLINES: ribbons a few metres wide, ten and more apart, that go round every island; almost none between them
  float T = 6., t1 = fract(uTime / T), t2 = fract(uTime / T + .5); float w1 = 1. - abs(2. * t1 - 1.);
  float rq = psi / 8.2 + (vn2(vec2(psi * .021, along * .0045)) - .5) * 2.6;
  float rw = .5 + .5 * cos(6.2832 * rq), thin = vn2(vec2(floor(rq + .5) * 7.3, along * .011 - uTime * .004));
  float strk = smoothstep(.62, .94, rw) * smoothstep(.14, .45, thin);
  float dens = clamp(.006 + .95 * strk + .55 * lee * strk + .12 * lee, 0., 1.);
  vec2 u1 = (vW.xz - flow * T * (t1 - .5)) * 3.1, u2 = (vW.xz - flow * T * (t2 - .5)) * 3.1 + 37.7;
  float sp = mix(specks(u2, px * 3.1, dens, 1.), specks(u1, px * 3.1, dens, 1.), w1);
  vec2 u3 = (vW.xz - flow * T * (t1 - .5)) * .6 + 5.3, u4 = (vW.xz - flow * T * (t2 - .5)) * .6 + 71.1;
  sp = max(sp, mix(specks(u4, px * .6, dens * .5, .42), specks(u3, px * .6, dens * .5, .42), w1));
  // far off they sink into a faint flow-line tone
  float spFar = smoothstep(60., 170., d);
  col = mix(col, uSpeck, sp * (1. - spFar) * .92);
  col = mix(col, mix(col, uSpeck, mix(.24, .09, step(dot(uCustard, vec3(.333)), dot(uSpeck, vec3(.333))))), strk * (.62 + .38 * spFar) * (1. - smoothstep(3., 8., px)) * (1. - far.y));   // each ribbon is also a faint stain, so it reads as a line at any distance
  // caramel drawn on the skin (rings and loose spirals), with its glint
  { vec3 dz = drizzle(vW.xz, px), dr = drops(vW.xz, px); if (dr.x > dz.x) dz = vec3(dr.x, dr.y * 1.3, dr.z * (1. - smoothstep(.4, 1.2, px)));
    float on = dz.x * smoothstep(.6, 2.5, shore) * (1. - far.y);
    col = mix(col, mix(mix(uPale, uAmber, .6), mix(uAmber, uDark, .75), smoothstep(.12, .6, dz.y)) * (1. - .3 * shade), on * .96);
    col = mix(col, uCream, dz.z * on * .8 * (1. - shade)); }
  // amber light through the cage
  vec4 nc = uNetMat * vec4(vW, 1.); float net = smoothstep(.04, .8, texture2D(uNet, nc.xy * .5 + .5, -.35).r) * uNetAmt * step(abs(nc.x), 1.) * step(abs(nc.y), 1.);
  col = mix(col, col * uAmberLight, clamp(net, 0., 1.) * .38 * (1. - smoothstep(.08, .4, nc.z)));
  col = mix(col, mix(uCustard, uApricot, .5), far.z * .9);
  gl_FragColor = vec4(clamp(col, 0., 1.), 1.);
}`,da=`
varying vec3 vD;
void main(){ vD = position; vec4 p = projectionMatrix * vec4(mat3(viewMatrix) * mat3(modelMatrix) * position, 1.);
  if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }`,fa=`
uniform vec3 uDuck, uCream, uCustard, uSteam;
varying vec3 vD;
${Be}
void main(){
  vec3 dir = normalize(vD + vec3(0., 1e-5, 0.)); float el = asin(clamp(dir.y, -1., 1.)) * 57.2958;
  vec3 col = mix(uApricot, uDuck, smoothstep(0., 35., el));
  vec2 hz = dir.xz / (length(dir.xz) + 1e-4);
  // steam: faint vertical streaks rising through the lowest 20-odd degrees (noise drawn out upward, sliding up)
  float st = smoothstep(.5, .8, vn3(vec3(hz * 19., el * .045 - uTime * .09))) * (.45 + .55 * vn3(vec3(hz * 5. + 3., el * .16 - uTime * .22)));
  float sEnv = (1. - smoothstep(9., 27., el)) * smoothstep(-1., 2.5, el);
  col = mix(col, uSteam, st * .7 * sEnv);
  float sd = acos(clamp(dot(dir, uSun), -1., 1.)) * 57.2958;
  float haze = smoothstep(0., 22., el);
  col = mix(col, uCream, (1. - smoothstep(2.1, 2.9, sd)) * mix(.45, .95, haze) + (1. - smoothstep(2., 16., sd)) * .16);
  col = mix(col, mix(uCustard, uApricot, .5), 1. - smoothstep(-6., 0., el));
  gl_FragColor = vec4(clamp(col, 0., 1.), 1.);
}`,qt=`
attribute vec3 aA, aB; attribute vec4 aP;
uniform float uClock, uViewH, uDome;
varying float vV; varying float vS; varying float vSet; varying float vThin; varying float vSeed; varying vec3 vW; varying float vPool; varying float vRib;
${Be}
vec3 arc(float s, float g, float age){
  vec3 A = aA, B = aB; float sd = aP.y;
  if (aP.w < 0.) {                                   // the pour: hangs, sways, and stirs its foot at 1.5 turns a second
    vec3 p = mix(A, B, s); float lo = s * s * s;
    p.xz += vec2(sin(uTime * .5 + s * 2.4 + sd * 9.), cos(uTime * .37 + s * 3.1)) * 5. * s * (1. - lo);
    p.xz += vec2(cos(uTime * 9.42), sin(uTime * 9.42)) * 1.5 * smoothstep(.985, 1., s);
    return p; }
  vec3 mid = (A + B) * .5, hf = (B - A) * .5; float th = 3.14159 * s;
  float hh = uDome * length(hf.xz) * aP.w * (.82 + .18 * g);
  vec3 p = mid - hf * cos(th) + vec3(0., hh * sin(th), 0.);
  vec3 lat = normalize(vec3(-hf.z, 0., hf.x) + vec3(1e-4, 0., 0.));
  float tf = min(age, 1.25 + s * 1.6);               // the wobble stops where the setting front has passed
  float env = sin(th); float sgn = sd > .5 ? 1. : -1.;
  float rg = smoothstep(.04, .12, aP.w);              // a height scale under .04 is a rigid sliver (a shard): no wobble, no sag
  float wob = sin(s * 13. + sd * 40. - tf * 6.) * 2.2 + sin(s * 29. + sd * 17. + tf * 9.) * .8;
  p += lat * env * rg * (wob + sgn * 30. * (1. - g) * (1. - g) + .7 * sin(uTime * .8 + sd * 37.));   // set sugar still trembles a hand's width in the warm air
  p.y += rg * (env * sin(s * 9. + sd * 23. + tf * 5.) * 1.4 - env * env * 2.5 * clamp((age - 1.25) / 1.6 - s, 0., 1.));
  return p; }
void main(){
  float age = uClock - aP.x; float g = clamp(age / 1.25, 0., 1.); g = g * g * (3. - 2. * g);
  if (aP.w < 0.) g = 1.;
  float s = min(position.x, g);
  vec3 p0 = arc(s, g, age), p1 = arc(min(s + .012, 1.012), g, age);
  vec4 w0 = modelMatrix * vec4(p0, 1.), w1 = modelMatrix * vec4(p1, 1.);
  vec3 tg = w1.xyz - w0.xyz; tg = normalize(tg + vec3(0., 1e-5, 0.));
  vec3 vd = isOrthographic ? vec3(viewMatrix[0][2], viewMatrix[1][2], viewMatrix[2][2]) : cameraPosition - w0.xyz;
  vec3 sdv = cross(tg, vd); sdv = normalize(sdv + vec3(1e-5, 0., 1e-5));
  float pool = aP.w < 0. ? 0. : 1.8 * exp(-s * 60.) + 1.1 * exp(-(1. - s) * 90.);
  float hw = .5 * aP.z * (1. + pool);
  vRib = smoothstep(.09, .16, aP.z);
#ifdef NET
  // only the ribs of a skein throw a bar of amber light (its first rib a broad one); the hairs let the sun through
  float hwMin = mix(.45, .75, smoothstep(.24, .27, aP.z)); hw = 0.; g *= step(.15, aP.z);
#else
  float dist = length((viewMatrix * w0).xyz);
  float hwMin = isOrthographic ? hw : (.78 + .45 * vRib) * dist * 2. / max(projectionMatrix[1][1] * uViewH, 1.);
#endif
#ifndef NET
  if (aP.w < 0.) hwMin *= 1. + .7 * smoothstep(1., 1.4, aP.z);   // the one fat pouring thread of the entry stays a plain amber line at any distance
#endif
  vThin = clamp(hw / max(hwMin, 1e-4), 0., 1.); hw = max(hw, hwMin) * step(1e-4, g);
  w0.xyz += sdv * hw * position.y;
  vV = position.y; vS = s; vSeed = aP.y; vW = w0.xyz; vPool = pool;
  vSet = aP.w < 0. ? .62 * smoothstep(.6, 1.2, aP.z) + .3 * smoothstep(1.2, 1.4, aP.z) : clamp((age - 1.25) / 1.6 - s + .04, 0., .08) * 12.5;
  gl_Position = projectionMatrix * viewMatrix * w0;
}`,It=`
uniform vec3 uPale, uDark, uCream, uFresh, uAmber; uniform float uFill;
varying float vV; varying float vS; varying float vSet; varying float vThin; varying float vSeed; varying vec3 vW; varying float vPool; varying float vRib;
${Be}
void main(){
#ifdef NET
  gl_FragColor = vec4(vec3(.5 + .5 * vSet) * (1. - vV * vV), 1.);
#else
  float c = sqrt(max(1. - vV * vV, 0.));
  float dk = .25 + .75 * uFill + (fract(vSeed * 7.31) - .5) * .8; vec3 setHair = mix(mix(uPale, uAmber, clamp(dk * 1.6, 0., 1.)), uDark, clamp(dk - .55, 0., .6));
  // hair-fine sugar is pale; a rib thinned only by distance keeps its amber
  vec3 fine = mix(uFresh, uPale, .45 + .55 * fract(vSeed * 13.7)); setHair = mix(uAmber, uDark, clamp(dk - .35, 0., .7));
  vec3 hair = mix(mix(uFresh, uPale, .25 * vRib), mix(fine, setHair, vRib), vSet);
  vec3 core = mix(mix(uFresh, uPale, .6), mix(uAmber, uDark, clamp(.12 + .3 * vPool + (vSeed - .5) * .3, 0., .8)), vSet);
  vec3 thick = mix(mix(uPale, uFresh, .55), core, smoothstep(.0, .75, c));     // pale edge, dark core
  // ONE glint line along each thread, unbroken but for a short gap or two that slide along it as we move
  float gl = (1. - smoothstep(.05, .09, abs(vV - .36))) * smoothstep(-.82, -.6, sin(vS * 11. + vSeed * 30. + dot(cameraPosition, vec3(.05, .03, .04)) - uTime * (.35 + .3 * vSeed)));
  thick = mix(thick, uCream, gl);
  vec3 col = mix(hair, thick, smoothstep(.45, 1., vThin));
  float d = distance(cameraPosition, vW); col = mix(col, uApricot, farLaw(d).z * .6);
  gl_FragColor = vec4(clamp(col, 0., 1.), 1.);
#endif
}`,ct=`
attribute vec2 aG; uniform float uRide; uniform float uRideV;
varying vec3 vW; varying vec3 vN; varying vec2 vG;
${Be}
void main(){ vec4 w4 = modelMatrix * vec4(position, 1.);
  w4.y += uRide * swell(modelMatrix[3].xz, uTime).x;
  w4.y += uRideV * swell(w4.xz, uTime).x;   // rideV: every vertex rides its own swell (many rafts in one mesh)
  float sw = max(-aG.y, 0.);
#ifdef ROPE
  w4.xz += vec2(sin(uTime * 1.1 + modelMatrix[3].x * .7), cos(uTime * .9 + modelMatrix[3].z * .7)) * min(sw, 9.) * .045;   // a hanging drop swings as one rigid thing
#else
  w4.xz += vec2(sin(uTime * 1.1 + position.x * .7), cos(uTime * .9 + position.z * .7)) * sw * .07;
#endif
  //   // a negative growth order = metres below a pivot: drips and beads swing
  vW = w4.xyz; vN = normalize(mat3(modelMatrix) * normal); vG = aG;
  gl_Position = projectionMatrix * viewMatrix * w4; }`,ht=`
uniform vec3 uPale, uDark, uCream, uPod, uAmber; uniform float uGrow;
varying vec3 vW; varying vec3 vN; varying vec2 vG;
${Be}
void main(){
  if (vG.y > uGrow) discard;
  vec3 n = normalize(vN + vec3(0., 1e-5, 0.)); vec3 v = normalize(cameraPosition - vW + vec3(0., 1e-5, 0.));
  float ndv = abs(dot(n, v));
  // ONE UNBROKEN GLINT: on a rope lying in turns the light sits along its upper, sunward shoulder all the way round
  vec3 Hg = normalize(vec3(uSun.x * .36, 1., uSun.z * .36)); float top = smoothstep(.93, .957, dot(n, Hg));
#ifdef POD
  // a vanilla pod (or any small dark thing that floats): nearly black, a warmer lit side, a waxy light along its back
  float lt = smoothstep(-.3, .7, dot(n, uSun));
  vec3 pc = mix(uPod, uPod * 2.4 + vec3(.05, .03, .01), lt * .75);
  pc *= .86 + .28 * step(.5, fract(atan(n.y, length(n.xz) + 1e-3) * 2.2 + vW.x * .0));   // (its long ribs)
  pc = mix(pc, uCream, top * .42);
  gl_FragColor = vec4(clamp(mix(pc, uApricot, farLaw(distance(cameraPosition, vW)).z), 0., 1.), 1.);
#else
#ifdef ROPE
  // SET CARAMEL AS A ROUND SOLID (rope rafts, hanging drops): opaque and depth-written, so turns that lie over one
  // another never multiply to black. Pale honey at its edge, amber at its heart, a deeper amber under its belly (never
  // darker than uDark), sunlight glowing through its sunward side, and ONE unbroken cream glint along its upper shoulder.
  float e = 1. - ndv, dk = clamp(vG.x, 0., 1.);
  // drawn in three tones by where the surface faces, as a cook would paint a rope of sugar: a deep amber belly where it
  // lies on the custard (which is what parts it from the yellow), an amber flank, a honey back, and the glint on the shoulder
  vec3 deepA = mix(uAmber, uDark, .85), flank = mix(uAmber, mix(uAmber, uDark, .55), dk), back = mix(mix(uPale, uAmber, .38), uAmber, dk * .7);
  vec3 rc = mix(deepA, flank, smoothstep(-.42, -.02, n.y));
  rc = mix(rc, back, smoothstep(.3, .62, n.y));
  rc = mix(rc, mix(uPale, uCream, .2), smoothstep(.7, .97, e) * .55 * smoothstep(-.1, .4, n.y));     // a pale honey edge where the light comes through
  rc = mix(rc, uPale, .28 * smoothstep(.3, .95, dot(n, uSun)) * (1. - dk * .6));                     // and through its sunward side
  float gw = fwidth(dot(n, Hg)) * 1.2 + .012; float gl = smoothstep(.925 - gw, .925 + gw, dot(n, Hg));
  rc = mix(rc, mix(uCream, vec3(1.), .4), gl * .95);
  gl_FragColor = vec4(clamp(mix(rc, uApricot, farLaw(distance(cameraPosition, vW)).z), 0., 1.), 1.);
#else
#ifdef GLINT
  vec3 hv = normalize(uSun + v + vec3(0., 1e-4, 0.)); float sp = dot(n, hv);
  float g = smoothstep(.972, .982, sp) + .5 * smoothstep(.9, .94, 1. - ndv) * smoothstep(.2, .6, n.y) + top * 1.3;
  float glow = (1. - ndv) * (1. - ndv) * .16 * (1. - clamp(vG.x, 0., 1.) * .6);   // light through the sugar: its edge glows honey
  gl_FragColor = vec4(uCream * clamp(g, 0., 1.) * .6 + uPale * glow, 1.);
#else
  float d = distance(cameraPosition, vW);
  vec3 bc = vW * 1.1, bi = floor(bc); float bub = step(.8, h13(bi)) * (1. - smoothstep(.12, .2, length(fract(bc) - .5))) * (1. - smoothstep(30., 80., d));
  vec3 tint = mix(uPale, uDark, clamp(vG.x + (vn3(vW * .5) - .5) * .25, 0., 1.));
  float thick = clamp(.3 + .95 * ndv - bub * .5, 0., 1.3);
  vec3 T = pow(tint, vec3(thick * 1.25));
  T = mix(T, vec3(1.), .7 * clamp(-vG.x, 0., 1.)) * mix(1., .55, clamp(vG.x - 1., 0., 1.));   // aG.x below 0: pulled thin and pale; above 1: pooled and darker still
  gl_FragColor = vec4(clamp(T, 0., 1.), 1.);
#endif
#endif
#endif
}`;function ma(F,L={}){const n=L.palette||na,h=c=>new a.Color(c),l={custard:h(n[0]),white:h(n[1]),lilac:h(n[2]),chestnut:h(n[3]),caramelPale:h(n[4]),caramelDark:h(n[5]),duckEgg:h(n[6]),trough:h("#E2B84C"),gold:h("#E0A85A"),speck:h("#2A1F1A"),apricot:h("#F6D9B8"),cream:h("#FFF3C4"),fresh:h("#FBDD98"),amberLight:h("#F9CA8C"),amber:h("#DC8A22"),steam:h("#FFF8EC")};l.shadeDeep=l.lilac.clone().multiply(new a.Color(.72,.7,.84)),l.burnt=h("#3B1D0D"),l.pod=h("#3A2013"),l.deep=l.trough.clone().multiply(new a.Color(.74,.58,.36));const y=(L.sun?new a.Vector3().copy(L.sun):new a.Vector3(Math.cos(.21),Math.sin(.21),0)).normalize(),E=new a.DataTexture(new Uint8Array([0,0,0,255]),1,1);E.needsUpdate=!0;const d=new a.DataTexture(new Uint8Array([255,191,128,0]),1,1);d.needsUpdate=!0;const g={uTime:{value:0},uSun:{value:y},uApricot:{value:l.apricot},uFar:{value:L.far??1},uClock:{value:0},uFill:{value:0},uViewH:{value:450},uDome:{value:L.dome??170/150},uNet:{value:E},uNetMat:{value:new a.Matrix4},uNetAmt:{value:0},uFlow:{value:d},uShade:{value:E},uFlowExt:{value:new a.Vector3(0,0,1/1200)},uCurrent:{value:new a.Vector2(1.6,0)},uCollar:{value:new a.Vector3(0,0,0)},uDeep:{value:l.deep},uWhite:{value:l.white},uLilac:{value:l.lilac},uGold:{value:l.gold},uChestnut:{value:l.chestnut},uCustard:{value:l.custard},uTrough:{value:l.trough},uSpeck:{value:l.speck},uCream:{value:l.cream},uPale:{value:l.caramelPale},uDark:{value:l.caramelDark},uFresh:{value:l.fresh},uAmberLight:{value:l.amberLight},uDuck:{value:l.duckEgg},uAmber:{value:l.amber},uSteam:{value:l.steam},uShadeDeep:{value:l.shadeDeep},uBurnt:{value:l.burnt},uPod:{value:l.pod},uSauce:{value:new a.Vector4(0,0,0,0)},uTap:{value:0}},x=c=>({...g,...c}),C=(c,q,v,G={})=>new a.ShaderMaterial({uniforms:x(v),vertexShader:c,fragmentShader:q,...G}),p={palette:l,uniforms:g,sun:y,POST:ra,swellAt:ia,meringue:(c={})=>C(la,ca,{uCoat:{value:c.coat??1.2}},{defines:c.instanced?{INSTANCED:1}:c.massif?{MASSIF:1}:{}}),custard:()=>C(ha,ua,{}),thread:C(qt,It,{},{side:a.DoubleSide}),threadNet:C(qt,It,{},{side:a.DoubleSide,defines:{NET:1},depthTest:!1,depthWrite:!1,blending:a.AdditiveBlending,transparent:!0}),glass:(c={})=>{const q={uGrow:c.grow||{value:1},uRide:{value:c.ride?1:0},uRideV:{value:c.rideV?1:0}};return[C(ct,ht,q,{transparent:!0,depthWrite:!1,blending:a.CustomBlending,blendEquation:a.AddEquation,blendSrc:a.DstColorFactor,blendDst:a.ZeroFactor,blendSrcAlpha:a.ZeroFactor,blendDstAlpha:a.OneFactor}),C(ct,ht,q,{transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,defines:{GLINT:1}})]},pod:()=>C(ct,ht,{uGrow:{value:1},uRide:{value:0},uRideV:{value:1}},{defines:{POD:1}}),rope:(c={})=>C(ct,ht,{uGrow:c.grow||{value:1},uRide:{value:c.ride?1:0},uRideV:{value:c.rideV?1:0}},{defines:{ROPE:1}}),shadowBlob:()=>C(`attribute float aStr; varying vec2 vU; varying float vS;
void main(){ vU = position.xz; vS = aStr; gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.); }`,`uniform vec3 uShadeDeep, uWhite; varying vec2 vU; varying float vS;
void main(){ float x = vU.x, z = abs(vU.y) * 2., w = mix(.95, .3, clamp(x, 0., 1.));
  float a = (1. - smoothstep(w * .4, w, z)) * smoothstep(-.25, -.02, x) * (1. - smoothstep(.4, 1., x)) * vS * .9;
  gl_FragColor = vec4(mix(vec3(1.), uShadeDeep / max(uWhite, vec3(.05)), a), 1.); }`,{},{transparent:!0,depthWrite:!1,side:a.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,blending:a.CustomBlending,blendEquation:a.AddEquation,blendSrc:a.DstColorFactor,blendDst:a.ZeroFactor,blendSrcAlpha:a.ZeroFactor,blendDstAlpha:a.OneFactor}),glassMeshes(c,q={}){const[v,G]=q.materials||p.glass(q),j=new a.Group,A=new a.Mesh(c,v),S=new a.Mesh(c,G);return A.renderOrder=5,S.renderOrder=6,j.add(A),q.noGlint||j.add(S),j},sky(){const c=new a.Mesh(new a.SphereGeometry(900,32,20),C(da,fa,{},{side:a.BackSide,depthWrite:!1,depthTest:!1}));return c.renderOrder=-.5,c.frustumCulled=!1,p._skies.push(c),c},_skies:[],update(c,q,v){g.uTime.value=q;const G=F.renderer;if(G&&G.getDrawingBufferSize&&(g.uViewH.value=G.getDrawingBufferSize(pa).y),v){_t.setFromMatrixPosition(v.matrixWorld);for(const j of p._skies)j.position.copy(_t)}}};return va(p,F),p}const pa=new a.Vector2,_t=new a.Vector3;function va(F,L){const n=(h,l,y,E)=>{const d=new a.BufferGeometry;return d.setAttribute("position",new a.Float32BufferAttribute(h,3)),d.setAttribute("aToast",new a.Float32BufferAttribute(y,1)),d.setAttribute("aPull",new a.Float32BufferAttribute(E,3)),d.setIndex(l),d.computeVertexNormals(),d};F.peakGeometry=(h={})=>{const l=h.height??2,y=h.radius??l*.42,E=h.curl??2.6,d=h.dir??0,g=h.radial??6,x=h.rings??3,C=h.rnd||(()=>.5),p=h.wob??0,c=h.toast??1,q=h.sink??.08,v=h.bulge??.3,G=h.taper??1.3,j=h.prof,A=h.toastFrom??.52,S=h.ridge||null,ee=O=>Math.atan2(Math.sin(O),Math.cos(O)),V=[],M=[],Q=[],T=[],b=Math.cos(d),z=Math.sin(d),W=C()*6.28,_=C()*6.28,D=.5+C();let X=0,H=0,re=0;for(let O=1;O<=x;O++){const P=1-Math.pow(1-O/x,1.7);X+=Math.cos(E*Math.pow(R(.42,1,(P+re)/2),2))*(P-re),re=P,H=Math.max(H,X)}let he=0,I=-l*q,w=0,K=0;const te=l*(1+q)/Math.max(H,.3);for(let O=0;O<=x;O++){const P=1-Math.pow(1-O/x,1.7),de=R(.42,1,P),ne=E*de*de,xe=E*Math.pow(R(.42,1,(P+K)/2),2),Se=(P-K)*te;he+=Math.sin(xe)*b*Se,I+=Math.cos(xe)*Se,w+=Math.sin(xe)*z*Se,K=P;const tt=Math.sin(ne)*b,Oe=Math.cos(ne),at=Math.sin(ne)*z,ut=Math.cos(ne)*b,Ue=-Math.sin(ne),dt=Math.cos(ne)*z;let ft=j?y*j(P)+l*.004:y*Math.pow(1-P,G)*(1+v*Math.exp(-Math.pow((P-.12)/.16,2)))*(1-.12*Math.exp(-Math.pow((P-.42)/.14,2)))+y*.02*(1-P)+l*.004;for(let be=0;be<g;be++){const ye=be/g*Math.PI*2,le=Math.cos(ye),J=Math.sin(ye);let we=ft*(1+p*(.09*Math.sin(ye*2+W+P*3*D)+.06*Math.sin(ye*3+_-P*5))*(1-P)),ve=Ce((R(A,.96,P)*(.72+.28*-le*Math.min(1,ne))+.1*Math.sin(ye*2+_)*P)*c,0,1.2);if(S){const fe=ee(ye+d-(S.at+S.turn*(S.by?R(0,S.by,P):P)))/S.w,Ee=S.full?R(.02,.09,P)*(1-R(.72,.92,P)):R(0,.1,P)*(1-R(.5,.82,P)),He=Math.exp(-fe*fe);we*=1+(S.amp??.1)*He*Ee*(.75+.25*Math.sin(P*31+W)),ve=Math.max(ve,Ee*Math.exp(-fe*fe*1.7)*((S.full?.98:.75)+.1*Math.sin(P*17+_)+.05*Math.sin(P*43+W))*Math.min(c,1.1))}V.push(he+we*(le*ut-J*z),I+we*(le*Ue),w+we*(le*dt+J*b)),Q.push(ve),T.push(tt,Oe,at)}if(O>0)for(let be=0;be<g;be++){const ye=(O-1)*g+be,le=(O-1)*g+(be+1)%g,J=ye+g,we=le+g;M.push(ye,J,le,le,J,we)}}const $=E,oe=V.length/3;V.push(he+Math.sin($)*b*y*.03,I+Math.cos($)*y*.03,w+Math.sin($)*z*y*.03),Q.push(Math.min(1.2,c)),T.push(0,1,0);for(let O=0;O<g;O++)M.push(x*g+O,oe,x*g+(O+1)%g);const Z=n(V,M,Q,T);return Z.userData.tip=new a.Vector3(he,I,w),Z},F.quenelleGeometry=(h={})=>{const l=h.length??34,y=h.height??15,E=h.width??l*.5,d=h.seg??28,g=h.radial??20,x=h.toast??1,C=h.slump??0,p=h.rnd||(()=>.5),c=p()*6.28,q=(p()-.5)*.3,v=[],G=[],j=[],A=[];for(let S=0;S<=d;S++){const ee=-1+2*S/d,V=Math.sin(ee*Math.PI/2),M=Math.pow(Math.max(1-Math.pow(Math.abs(V),2.3),0),.5),Q=V*l*.5*(1+q*(1-V*V));for(let T=0;T<g;T++){const b=T/g*Math.PI*2,z=1+.17*Math.cos(3*(b-Math.PI/2))+.03*Math.sin(5*b+c+ee*2),W=Math.sin(b),_=Math.cos(b),D=M*z*W*y*.72+y*.28*M-C*y*.25*M*Math.max(_,0);v.push(Q,D,M*z*_*E*.5+C*E*.18*M*(1-W)),j.push(Ce(R(.86,1,W)*R(.25,.8,M)*(.75+.2*Math.sin(ee*7+c))*x,0,1.2)),A.push(1,0,0)}if(S>0)for(let T=0;T<g;T++){const b=(S-1)*g+T,z=(S-1)*g+(T+1)%g,W=b+g,_=z+g;G.push(b,W,z,z,W,_)}}return n(v,G,j,A)},F.glassBuilder=()=>{const h=[],l=[],y=[],E=[],d=new a.Vector3,g=new a.Vector3,x=new a.Vector3,C=new a.Vector3,p=new a.Vector3,c=(v,G)=>typeof v=="function"?v(G):v,q={tube(v,G,j={}){const A=j.radial??5,S=v.length,ee=h.length/3,V=!!j.closed;g.set(.31,.9,.29);for(let M=0;M<S;M++){const Q=v[V?(M-1+S)%S:Math.max(M-1,0)],T=v[V?(M+1)%S:Math.min(M+1,S-1)];d.set(T[0]-Q[0],T[1]-Q[1],T[2]-Q[2]),d.lengthSq()<1e-12&&d.set(0,1,0),d.normalize(),x.crossVectors(d,g),x.lengthSq()<1e-8&&x.set(1,0,0),x.normalize(),g.crossVectors(x,d).normalize();const b=M/(S-1),z=c(G,b),W=c(j.dark??.5,b),_=c(j.grow??0,b);for(let D=0;D<A;D++){const X=D/A*Math.PI*2,H=Math.cos(X),re=Math.sin(X);p.copy(g).multiplyScalar(H).addScaledVector(x,re),h.push(v[M][0]+p.x*z,v[M][1]+p.y*z,v[M][2]+p.z*z),l.push(p.x,p.y,p.z),y.push(W,_)}if(M>0)for(let D=0;D<A;D++){const X=ee+(M-1)*A+D,H=ee+(M-1)*A+(D+1)%A;E.push(X,H,X+A,H,H+A,X+A)}}if(V)for(let M=0;M<A;M++){const Q=ee+(S-1)*A+M,T=ee+(S-1)*A+(M+1)%A,b=ee+M,z=ee+(M+1)%A;E.push(Q,T,b,T,z,b)}return q},lathe(v,G,j={}){const A=j.radial??10,S=G.length,ee=h.length/3;for(let V=0;V<S;V++){const M=G[Math.max(V-1,0)],Q=G[Math.min(V+1,S-1)];let T=Q[0]-M[0],b=-(Q[1]-M[1]);const z=Math.hypot(b,T)||1;b/=-z,T/=-z;for(let W=0;W<A;W++){const _=W/A*Math.PI*2,D=Math.cos(_),X=Math.sin(_);h.push(v[0]+G[V][0]*D,v[1]+G[V][1],v[2]+G[V][0]*X),l.push(b*D,T,b*X),y.push(c(j.dark??.8,V/(S-1)),c(j.grow??0,V/(S-1)))}if(V>0)for(let W=0;W<A;W++){const _=ee+(V-1)*A+W,D=ee+(V-1)*A+(W+1)%A;E.push(_,_+A,D,D,_+A,D+A)}}return q},get triangles(){return E.length/3},build(){const v=new a.BufferGeometry;return v.setAttribute("position",new a.Float32BufferAttribute(h,3)),v.setAttribute("normal",new a.Float32BufferAttribute(l,3)),v.setAttribute("aG",new a.Float32BufferAttribute(y,2)),v.setIndex(E),v}};return q},wa(F,L)}function wa(F,L){F.threadGeometry=(n,h=48)=>{const l=new a.InstancedBufferGeometry,y=[],E=[];for(let p=0;p<=h;p++)if(y.push(p/h,-1,0,p/h,1,0),p>0){const c=(p-1)*2;E.push(c,c+1,c+2,c+1,c+3,c+2)}l.setAttribute("position",new a.Float32BufferAttribute(y,3)),l.setIndex(E);const d=n.length,g=new Float32Array(d*3),x=new Float32Array(d*3),C=new Float32Array(d*4);return n.forEach((p,c)=>{g.set(p.a,c*3),x.set(p.b,c*3),C.set([p.t0??-10,p.seed??.5,p.width??.26,(p.pour?-1:1)*(p.hs??1)],c*4)}),l.setAttribute("aA",new a.InstancedBufferAttribute(g,3)),l.setAttribute("aB",new a.InstancedBufferAttribute(x,3)),l.setAttribute("aP",new a.InstancedBufferAttribute(C,4)),l.instanceCount=d,l.boundingSphere=new a.Sphere(new a.Vector3,1e4),l},F.makeThreads=(n,h=48)=>{const l=new a.Mesh(F.threadGeometry(n,h),F.thread);return l.frustumCulled=!1,l},F.threadPoint=(n,h,l=new a.Vector3)=>{const y=(n.b[0]-n.a[0])/2,E=(n.b[1]-n.a[1])/2,d=(n.b[2]-n.a[2])/2,g=Math.PI*h,x=Math.cos(g),C=Math.sin(g),p=n.seed??.5,c=Math.hypot(y,d)||1,q=F.uniforms.uDome.value*c*(n.hs??1),v=1.25+h*1.6,G=Math.sin(h*13+p*40-v*6)*2.2+Math.sin(h*29+p*17+v*9)*.8;return l.set(n.a[0]+y-y*x-d/c*C*G,n.a[1]+E-E*x+q*C+C*Math.sin(h*9+p*23+v*5)*1.4-C*C*2.5,n.a[2]+d-d*x+y/c*C*G)},F.makeFlow=async(n,h={})=>{const l=h.size??512,y=h.width??1200,E=h.cx??0,d=h.cz??0,g=F.uniforms.uCurrent.value,x=g.length()||1,C=g.x/x,p=g.y/x,c=new Uint8Array(l*l*4),q=n.length;for(let G=0;G<l;G++){const j=d+((G+.5)/l-.5)*y,A=[],S=[];for(let V=0;V<q;V++){const M=n[V],Q=Math.max(M.r*6,M.r+17);Math.abs(j-M.z)<=Q&&(A.push(M),S.push(Q))}const ee=A.length;for(let V=0;V<l;V++){const M=E+((V+.5)/l-.5)*y;let Q=C,T=p,b=1e9,z=0;for(let H=0;H<ee;H++){const re=A[H],he=M-re.x;if(he>S[H]||he<-S[H])continue;const I=j-re.z,w=he*he+I*I,K=re.rf&&w<re.r*re.r*4?re.rf(he,I):re.r,te=K*K;if(w>te*36){b=Math.min(b,Math.sqrt(w)-K);continue}const $=Math.sqrt(w)+1e-6;b=Math.min(b,$-K);const oe=Math.min(te/w,1),Z=he/$,O=I/$,P=Z*C+O*p,de=-Z*p+O*C,ne=P*P-de*de,xe=2*P*de;Q-=oe*(ne*C-xe*p),T-=oe*(ne*p+xe*C),P>.2&&(z=Math.max(z,(P-.2)*1.25*Math.max(0,1-($-K)/(K*1.6))))}const W=(G*l+V)*4,_=b/16,D=Q*.25+.5,X=T*.25+.5;c[W]=_<=0?0:_>=1?255:_*255,c[W+1]=D<=0?0:D>=1?255:D*255,c[W+2]=X<=0?0:X>=1?255:X*255,c[W+3]=z<=0?0:z>=1?255:z*255}L.yield&&await L.yield()}const v=new a.DataTexture(c,l,l,a.RGBAFormat);return v.magFilter=v.minFilter=a.LinearFilter,v.wrapS=v.wrapT=a.ClampToEdgeWrapping,v.needsUpdate=!0,F.uniforms.uFlow.value=v,F.uniforms.uFlowExt.value.set(E,d,1/y),await F.makeShade(n,h.casters||[],{size:h.shadeSize??512,width:y,cx:E,cz:d}),v},F.makeShade=async(n,h,l={})=>{const y=l.size??512,E=l.width??1200,d=l.cx??0,g=l.cz??0,x=F.uniforms.uCurrent.value,C=x.length()||1,p=x.x/C,c=x.y/C,q=F.sun,v=Math.hypot(q.x,q.z)||1,G=-q.x/v,j=-q.z/v,A=Math.max(q.y/v,.12),S=new Uint16Array(y*y*2),ee=new Float32Array(1),V=new Uint32Array(ee.buffer),M=b=>{ee[0]=b;const z=V[0],W=z>>23&255,_=z>>16&32768;return W<113?_:W>142?_|31743:_|W-112<<10|z>>13&1023},Q=h.map(b=>{const z=Math.min(b.h*Math.min(1/A,b.len??3.6),900),W=b.x+G*z,_=b.z+j*z,D=b.r+4+z*.06;return{...b,L:z,z0:Math.min(b.z,_)-D,z1:Math.max(b.z,_)+D,x0:Math.min(b.x,W)-D,x1:Math.max(b.x,W)+D}});for(let b=0;b<y;b++){const z=g+((b+.5)/y-.5)*E,W=Q.filter(D=>z>=D.z0&&z<=D.z1),_=n.filter(D=>Math.abs(z-D.z)<=D.r*8);for(let D=0;D<y;D++){const X=d+((D+.5)/y-.5)*E;let H=0,re=0;for(let I=0;I<W.length;I++){const w=W[I];if(X<w.x0||X>w.x1)continue;const K=X-w.x,te=z-w.z,$=K*G+te*j,oe=Math.abs(-K*j+te*G);let Z;if($<=0)Z=Math.sqrt($*$+oe*oe)-w.r;else if($>=w.L)Z=Math.sqrt(($-w.L)*($-w.L)+oe*oe);else{const ne=$/w.L;Z=oe-w.r*Ae(1-ne,Math.sqrt(1-ne*ne),+w.round||0)}const O=1+($>0?$:0)*.014;if(Z>=O)continue;const P=Z<=-O?1:.5-Z/(2*O),de=P*P*(3-2*P)*(1-.35*($<0?0:$>500?1:$/500));de>H&&(H=de)}for(let I=0;I<_.length;I++){const w=_[I],K=X-w.x,te=w.r*8;if(K>te||K<-te)continue;const $=z-w.z,oe=K*K+$*$,Z=w.r*w.r,O=Math.sqrt(oe);if(O>=te)continue;const P=w.r*4.5,de=O<=P?0:(O-P)/(te-P),ne=1-de*de*(3-2*de);re-=(oe>Z?Z/oe:1)*(-K*c+$*p)*ne}const he=(b*y+D)*2;S[he]=M(H),S[he+1]=M(re)}L.yield&&await L.yield()}const T=new a.DataTexture(S,y,y,a.RGFormat,a.HalfFloatType);return T.magFilter=T.minFilter=a.LinearFilter,T.wrapS=T.wrapT=a.ClampToEdgeWrapping,T.needsUpdate=!0,F.uniforms.uShade.value=T,T}}const ga=F=>{let L=0,n=0;for(const c of F)L+=c.attributes.position.count,n+=c.index.count;const h=new Float32Array(L*3),l=new Float32Array(L*3),y=new Float32Array(L),E=new Float32Array(L*3),d=new Uint32Array(n),g=F[0].attributes.aShade?new Float32Array(L):null;let x=0,C=0;for(const c of F){h.set(c.attributes.position.array,x*3),l.set(c.attributes.normal.array,x*3),y.set(c.attributes.aToast.array,x),E.set(c.attributes.aPull.array,x*3),g&&c.attributes.aShade&&g.set(c.attributes.aShade.array,x);const q=c.index.array;for(let v=0;v<q.length;v++)d[C+v]=q[v]+x;x+=c.attributes.position.count,C+=q.length,c.dispose()}const p=new a.BufferGeometry;return p.setAttribute("position",new a.BufferAttribute(h,3)),p.setAttribute("normal",new a.BufferAttribute(l,3)),p.setAttribute("aToast",new a.BufferAttribute(y,1)),p.setAttribute("aPull",new a.BufferAttribute(E,3)),p.setIndex(new a.BufferAttribute(d,1)),g&&p.setAttribute("aShade",new a.BufferAttribute(g,1)),p};async function ya(F,L={}){const n=F.rng.fork?F.rng.fork("sugar-cage"):F.rng,h=F.noise,l=async()=>{F.yield&&await F.yield()},y=Ce(L.detail??F.quality?.detail??1,.6,1),E=!L.style,d=L.style||ma(F,{palette:L.palette}),g=d.uniforms,x=new a.Group;x.name="sugar-cage";const C=L.duration??42,p=L.rotationY??0,c=d.sun.clone().applyAxisAngle(new a.Vector3(0,1,0),-p),q=L.cage||"dome",v=n.range(0,6.28),G=n.range(0,6.28),j=n.range(0,6.28),A=78,S=44,ee=52,V=e=>126+7*Math.sin(3*e+v)+4.5*Math.sin(5*e+G),M=e=>-2+(132-e)*.467,Q=e=>S+(ee-S)*R(42,-20,e),T=(e,t)=>{const r=Math.hypot(e,t),o=Math.atan2(e,t),s=V(o),u=59-13*Math.cos(7*o)+4*Math.sin(2*o+j);let i;if(r>A){const m=(r-A)/(s-A);i=m<1?u*Math.pow(1-Math.pow(m,1.8),.9):-6*R(1,1.12,m)-.5}else{const m=Q(t);i=m+(u-m)*R(36,A,r)**1.4}if(i+=h.fbm2(e*.02+9,t*.02-4,3)*2.2*R(-2,12,i),t>18){const m=t>42?M(t):Ae(Q(t),M(42),R(18,42,t)),f=(1-R(8,27,Math.abs(e+2.5*Math.sin(t*.045+v))))*R(18,40,t);i=Ae(i,Math.min(i,m),f)}return i},b=[],z=[],W=[],_=n.int(2,4),D=n.int(0,6),X=n.chance(.5)?1:-1,H=32,re=22;for(let e=0;e<7;e++){const t=e===0||e===6,r=(e+.5)*(Math.PI*2/7)+(t?e===0?.09:-.09:n.range(-.07,.07)),o=A+(t?3:n.range(-5,6)),s=Math.sin(r)*o,u=Math.cos(r)*o,i=T(s,u),m=e===_?134:t?n.range(104,118):n.range(98,126),f=i*.42,B=m-f,Y=Ce(B*n.range(.34,.39),30,40),ae=d.peakGeometry({height:B,radius:Y,curl:n.range(2.4,3.6),dir:-r+(X<0?Math.PI:0)+X*n.range(-.9,.4),radial:H,rings:re,wob:1,rnd:n,toast:e===D?1.6:n.range(.85,1.1),sink:0,bulge:0});ae.translate(s,f,u),await l();const N=ae.attributes.position.array,k={x:s,z:u,th0:Math.atan2(N[2]-u,N[0]-s),y:[],r:[],f:[],rmax:0};for(let U=0;U<=7;U++){const se=1-Math.pow(1-U/re,1.7),ie=new Float32Array(H);let ge=0;for(let ze=0;ze<H;ze++){const ke=(U*H+ze)*3;ie[ze]=Math.hypot(N[ke]-s,N[ke+2]-u),ge+=N[ke+1]/H,k.rmax=Math.max(k.rmax,ie[ze])}k.y.push(ge),k.r.push(ie),k.f.push(Ae(1,.9,R(.26,.5,se)));const Pe=Ae(.78,1,R(.06,.36,se));if(Pe<.9995)for(let ze=0;ze<H;ze++){const ke=(U*H+ze)*3;N[ke]=s+(N[ke]-s)*Pe,N[ke+2]=u+(N[ke+2]-u)*Pe}}ae.computeVertexNormals(),W.push(k),z.push(ae),b.push({x:s,z:u,base:i,height:B,top:m,radius:Y*.8}),await l()}const he=(e,t,r,o)=>{let s=(Math.atan2(r,t)-e.th0)/(Math.PI*2);s=(s-Math.floor(s))*H;const u=Math.floor(s)%H,i=(u+1)%H,m=s-Math.floor(s);let f=Ae(e.r[0][u],e.r[0][i],m)*e.f[0];if(o>=f)return e.y[0]-(o-f)*1.9;for(let B=1;B<e.y.length;B++){const Y=Ae(e.r[B][u],e.r[B][i],m)*e.f[B];if(o>=Y)return Ae(e.y[B-1],e.y[B],(f-o)/Math.max(f-Y,.001));f=Y}return e.y[e.y.length-1]},I=(e,t)=>{const r=T(e,t);let o=r;for(const s of W){const u=e-s.x,i=t-s.z,m=Math.hypot(u,i);if(m>s.rmax+12)continue;const f=he(s,u,i,m),B=Math.max(7-Math.abs(o-f),0)/7;o=Math.max(o,f)+B*B*1.75}return r+(o-r)*(1-(1-R(4,11,Math.abs(e)))*R(18,34,t))},w=124,K=140,te=2*K/w,$=new Float32Array((w+1)*(w+1)),oe=new Float32Array((w+1)*(w+1));for(let e=0;e<=w;e++){for(let t=0;t<=w;t++)$[e*(w+1)+t]=T(-K+t*te,-K+e*te),oe[e*(w+1)+t]=I(-K+t*te,-K+e*te);await l()}const Z=(e,t)=>$[Ce(t,0,w)*(w+1)+Ce(e,0,w)],O=[],P=[],de=[],ne=[],xe=new Int32Array((w+1)*(w+1)).fill(-1);for(let e=0;e<=w;e++){for(let t=0;t<=w;t++){const r=-K+t*te,o=-K+e*te,s=Z(t,e),u=Math.hypot(r,o);if(u>V(Math.atan2(r,o))*1.12+te*1.5)continue;const i=oe[e*(w+1)+t];xe[e*(w+1)+t]=O.length/3,O.push(r,i,o);const m=s-(Z(t-3,e)+Z(t+3,e)+Z(t,e-3)+Z(t,e+3)+Z(t-2,e-2)+Z(t+2,e+2)+Z(t-2,e+2)+Z(t+2,e-2))/8;P.push(Ce(R(1.3,4.2,m)*.66*R(20,40,s)*(o>14?R(22,40,Math.abs(r)):1)*(1-R(.6,2.6,i-s)),0,1));const f=(1-R(14,30,Math.abs(r)))*R(10,30,o)+(1-R(30,60,u)),B=Ce(f,0,1),Y=u||1,ae=r/Y*.45*(1-B),N=1-B,k=o/Y*.45*(1-B)+B,U=Math.hypot(ae,N,k)||1;de.push(ae/U,N/U,k/U)}e%8===7&&await l()}await l();for(let e=0;e<w;e++)for(let t=0;t<w;t++){const r=xe[e*(w+1)+t],o=xe[e*(w+1)+t+1],s=xe[(e+1)*(w+1)+t],u=xe[(e+1)*(w+1)+t+1];r<0||o<0||s<0||u<0||ne.push(r,s,o,o,s,u)}await l();const Se=new a.BufferGeometry;Se.setAttribute("position",new a.Float32BufferAttribute(O,3)),Se.setAttribute("aToast",new a.Float32BufferAttribute(P,1)),Se.setAttribute("aPull",new a.Float32BufferAttribute(de,3)),Se.setIndex(ne),Se.computeVertexNormals(),z.push(Se),await l();const tt=Math.hypot(c.x,c.z)||1,Oe=c.x/tt,at=c.z/tt,ut=.9,Ue=w+1,dt=(e,t)=>{const r=(e+K)/te,o=(t+K)/te;if(r<0||o<0||r>=w||o>=w)return-5;const s=r|0,u=o|0,i=r-s,m=o-u,f=u*Ue+s;return(oe[f]*(1-i)+oe[f+1]*i)*(1-m)+(oe[f+Ue]*(1-i)+oe[f+Ue+1]*i)*m},ft=b.map(e=>({x:e.x,z:e.z,y0:e.top-e.height,h:e.height,R:e.radius/.8})),be=(e,t,r)=>{let o=1;for(let i=5;i<190;i+=3.5){const m=e+Oe*i,f=r+at*i,B=t+i*ut;if(B>138)break;let Y=dt(m,f);for(let N=0;N<7;N++){const k=ft[N],U=m-k.x,se=f-k.z,ie=U*U+se*se;if(ie<k.R*k.R){const ge=k.y0+k.h*(1-Math.pow(Math.sqrt(ie)/k.R,.77));ge>Y&&(Y=ge)}}const ae=(B-Y)/(1.5+i*.07);if(ae<o&&(o=ae,o<=0))break}const s=-e*Oe,u=R(3,9,s)*(1-R(40,62,s))*R(22,40,r)*(1-R(120,138,r));return(1-R(0,1,o))*(1-.85*u)};for(const e of z){const t=e.attributes.position.array,r=t.length/3,o=new Float32Array(r);for(let s=0;s<r;s++)o[s]=t[s*3+1]<-1?0:be(t[s*3],t[s*3+1],t[s*3+2]),s%600===599&&await l();e.setAttribute("aShade",new a.BufferAttribute(o,1))}g.uSauce.value.set(v,L.sauce??1,0,0);const ye=new a.Mesh(ga(z),d.meringue({coat:1.2,massif:!0}));ye.name="massif",x.add(ye),await l();const le=new a.Vector3(0,62,-18),J=new a.Vector3(n.range(16,26)*(n.chance(.5)?1:-1),0,n.range(-46,-36));J.y=I(J.x,J.z);const we=[[0,3,330],[0,3,240],[0,5,172],[0,8,134],[0,31,90],[0,55,44],[0,58.5,13],[0,62,-18]].map(e=>new a.Vector3(...e)),ve=new a.Vector3,fe=new a.Vector3,Ee=new a.Vector3,He=(e,t,r)=>{let o=1e9;Ee.set(e,t,r);for(let s=0;s<we.length-1;s++){ve.subVectors(we[s+1],we[s]);const u=Ce(fe.subVectors(Ee,we[s]).dot(ve)/ve.lengthSq(),0,1);o=Math.min(o,fe.copy(we[s]).addScaledVector(ve,u).distanceTo(Ee))}return o},zt=Math.round((L.kisses??700)*y),Ge=[-15,66],kt={height:1,radius:.52,curl:2.9,dir:0,toast:1.45,toastFrom:.4,sink:.1,prof:e=>(.74*(1-R(.04,.56,e))+.26*Math.pow(1-e,.75))*(1-.22*(1-R(0,.13,e)))},Ut=d.peakGeometry({...kt,radial:10,rings:8}),Ht=d.peakGeometry({...kt,radial:6,rings:5}),jt=d.meringue({instanced:!0,coat:-1e3}),Ne=new a.Matrix4,Le=new a.Quaternion,ot=new a.Quaternion,At=new a.Vector3,qe=new a.Vector3(0,1,0),Fe=new a.Vector3,Ie=[],je=[];let St=0;for(let e=0;St<zt&&e<zt*14;e++){e%40===39&&await l();const t=n();let r,o;if(t<.58)r=n.range(7,36)*(n.chance(.5)?1:-1),o=n.range(24,134);else if(t<.78){const k=n.range(0,6.283),U=n.range(14,72);r=Math.sin(k)*U,o=Math.cos(k)*U}else{const k=n.range(0,6.283),U=n.range(60,124);r=Math.sin(k)*U,o=Math.cos(k)*U}let s=n.range(1,3)*(n.chance(.08)?1.5:1);const u=n.range(0,6.283),i=n.range(.8,1.25),m=n(),f=T(r,o);if(f<3||(Fe.set(T(r-.8,o)-T(r+.8,o),1.6,T(r,o-.8)-T(r,o+.8)).normalize(),Fe.y<.5))continue;let B=He(r,f+s*.6,o);if(B<16&&(s=Math.max(s,1.9+m*1.1),B=He(r,f+s*.6,o)),B<6.5+s*.5||Math.hypot(r-le.x,o-le.z)<11||Math.hypot(r-J.x,o-J.z)<7)continue;let Y=!1;for(const k of b)Math.hypot(r-k.x,o-k.z)<k.radius*.95&&(Y=!0);if(Y)continue;Fe.lerp(qe,.8).normalize(),Le.setFromUnitVectors(qe,Fe),ot.setFromAxisAngle(qe,u),Le.multiply(ot);const ae=I(r,o);St++;let N=!1;for(const k of W){const U=r-k.x,se=o-k.z,ie=Math.hypot(U,se);ie<k.rmax+2&&he(k,U,se,ie)>f+s&&(N=!0)}N||Math.hypot(r-Ge[0],o-Ge[1])<5||(Ne.compose(ve.set(r,ae-.05,o),Le,At.set(s*i,s,s*i)),(B<19?Ie:je).push({m:Ne.clone(),sd:m,sh:be(r,ae+s*.6,o),x:r,z:o,y:ae,sc:s}),e%60===59&&await l())}const mt=[];{let e=2654435769;const t=()=>{e=e+1831565813|0;let s=Math.imul(e^e>>>15,1|e);return s=s+Math.imul(s^s>>>7,61|s)^s,((s^s>>>14)>>>0)/4294967296},r=[...Ie,...je],o=new a.Vector3;for(let s=0,u=0;s<7e3&&u<Math.round(185*y);s++){s%40===39&&await l();const i=(6+t()*20)*(t()<.5?1:-1),m=34+t()*96,f=1.3+t()*1.25,B=t()*6.283,Y=.9+t()*.25,ae=t(),N=I(i,m);if(N<3||(o.set(I(i-.8,m)-I(i+.8,m),1.6,I(i,m-.8)-I(i,m+.8)).normalize(),o.y>=.62||o.y<.2)||o.y>=.5&&N<T(i,m)+.5)continue;const k=He(i+o.x*f*.6,N+f*.5,m+o.z*f*.6);if(k<6.3+f*.55||k>30||Math.hypot(i-Ge[0],m-Ge[1])<5.5)continue;let U=!1;for(const ge of r)if(Math.abs(ge.x-i)<2.6&&Math.abs(ge.z-m)<2.6){U=!0;break}if(U)continue;Fe.copy(o).lerp(qe,.4).normalize(),Le.setFromUnitVectors(qe,Fe),ot.setFromAxisAngle(qe,B),Le.multiply(ot);const se=f*.12;Ne.compose(ve.set(i+o.x*se-Fe.x*f*.14,N+o.y*se-Fe.y*f*.14,m+o.z*se-Fe.z*f*.14),Le,At.set(f*Y,f,f*Y));const ie={m:Ne.clone(),sd:ae,sh:be(i+o.x*1.5,N+f*.6,m+o.z*1.5),x:i,z:m,y:N,sc:f,wall:1};mt.push(ie),r.push(ie),u++}await l()}for(const e of mt)Ie.push(e);for(const[e,t,r]of[[Ie,Ut,"kisses-near"],[je,Ht,"kisses"]]){const o=Math.max(e.length,1),s=new a.InstancedMesh(t,jt,o),u=new Float32Array(o*4);e.forEach((i,m)=>{s.setMatrixAt(m,i.m),u[m*4]=i.sd,u[m*4+2]=1+i.sh*.999}),s.count=e.length,t.setAttribute("aBob",new a.InstancedBufferAttribute(u,4)),s.instanceMatrix.needsUpdate=!0,s.frustumCulled=!1,s.name=r,x.add(s)}{const e=[...Ie,...je],t=Math.max(e.length,1),r=new a.BufferGeometry;r.setAttribute("position",new a.Float32BufferAttribute([-.25,0,-.5,1,0,-.5,1,0,.5,-.25,0,.5],3)),r.setIndex([0,2,1,0,3,2]);const o=new a.InstancedMesh(r,d.shadowBlob(),t),s=new Float32Array(t),u=new a.Vector3,i=new a.Vector3,m=new a.Vector3;e.forEach((f,B)=>{i.set(I(f.x-.9,f.z)-I(f.x+.9,f.z),1.8,I(f.x,f.z-.9)-I(f.x,f.z+.9)).normalize(),u.set(-Oe,0,-at),u.addScaledVector(i,-u.dot(i)).normalize(),m.crossVectors(u,i),Ne.makeBasis(u.multiplyScalar(f.sc*(f.wall?1.25:2.2)),i,m.multiplyScalar(f.sc*(f.wall?.95:1.1))),Ne.setPosition(f.x+i.x*.14,f.y+.05+i.y*.14,f.z+i.z*.14),o.setMatrixAt(B,Ne),s[B]=(1-.7*f.sh)*(f.wall?.6:1)}),o.count=e.length,r.setAttribute("aStr",new a.InstancedBufferAttribute(s,1)),o.frustumCulled=!1,o.renderOrder=1,o.name="kiss-shadows",x.add(o),await l()}x.userData.kissCounts=[Ie.length,je.length,mt.length],await l();const Ke=36,me=[],Kt=()=>n.range(150,162);me.push({a:.0533,r:150.5},{a:-.0533,r:150.5});for(let e=0;e<Ke-2;e++)me.push({a:.2+(e+.5+n.range(-.3,.3))*((Math.PI*2-.4)/(Ke-2)),r:Kt()});for(const e of me)e.x=Math.sin(e.a)*e.r,e.z=Math.cos(e.a)*e.r,e.sun=(e.x*c.x+e.z*c.z)/e.r,e.n=0;const Yt=e=>Math.atan2(Math.sin(e),Math.cos(e)),pt=[],$t=e=>{let t=0,r=9;return me.forEach((o,s)=>{const u=Math.abs(Yt(o.a-e));u<r&&(r=u,t=s)}),t};for(let e=0;e<Ke;e++){const t=me[e],r=n.int(6,10),o=[],s=e>=Ke-1?2:e>=Ke-4?1:0,u=e<2?e===0?1:-1:n.chance(.5)?1:-1,i=s===2?1:n.chance(.45)?2:1,m=r>=9?3:2,f=r+4;for(let N=0,k=0;N<i;N++){const U=s===2?n.range(-.1,.1):s===1?u*n.range(.22,.5):u*n.range(.55,1.75)*(N===1?-.8:1),se=me[$t(t.a+Math.PI+U)],ie=N===i-1?f-k:Math.ceil(f/i);for(let ge=0;ge<ie;ge++){const Pe=k+ge<m,ze=Pe?.018:.085,ke=se.a+n.range(-ze,ze),Lt=se.r+(Pe?n.range(-2.5,3):n.range(-5,6)),lt=Pe?1:1.9;o.push({a:[t.x+n.range(-lt,lt),-.4,t.z+n.range(-lt,lt)],b:[Math.sin(ke)*Lt,-.4,Math.cos(ke)*Lt],seed:n(),width:Pe?k+ge===0?n.range(.27,.31):n.range(.17,.23):n.range(.03,.065),hs:Pe?n.range(.975,1.04):n.range(.925,1.075),foot:e,land:me.indexOf(se),rib:Pe})}k+=ie}const B=t.x,Y=t.z;let ae=0;for(const N of o){const k=N.b[0]-B,U=N.b[2]-Y,se=Math.hypot(k,U)||1;ae+=Math.abs(B*U-Y*k)/se}pt.push({th:o,key:s*10+(1-ae/o.length/150)*.5+(.5-.5*t.sun)*.6+n.range(0,.25)+(e<2?-.35:0)})}pt.sort((e,t)=>e.key-t.key);const Ve=[];for(const e of pt)for(const t of e.th)Ve.push(t);for(const e of Ve)e.b[2]>0&&Math.abs(e.b[0])<3&&(e.b[0]=(e.b[0]<0?-1:1)*(3+e.seed*7.31%1));const st=Ve.length,ue=[[0,.14],[16,.367],[25,.667],[31,.867],[37,1]],Tt=e=>{if(e<=0)return ue[0][1];for(let t=1;t<ue.length;t++)if(e<=ue[t][0])return Ae(ue[t-1][1],ue[t][1],(e-ue[t-1][0])/(ue[t][0]-ue[t-1][0]));return 1};Ve.forEach((e,t)=>{const r=(t+.5)/st;let o=-10;if(r>ue[0][1]){for(let s=1;s<ue.length;s++)if(r<=ue[s][1]){o=Ae(ue[s-1][0],ue[s][0],(r-ue[s-1][1])/(ue[s][1]-ue[s-1][1]));break}}t>=st-8&&(o=Math.max(o,37-1.25-(st-1-t)*.14)),e.t0=o-1.25,me[e.foot].n++,me[e.land].n++});const Qt={a:[J.x,420,J.z],b:[J.x,J.y+1.6,J.z],seed:n(),width:.3,pour:!0},rt=d.makeThreads([...Ve,Qt],36);rt.name="cage",rt.renderOrder=2,x.add(rt),await l();const Me=d.glassBuilder(),Ye=(e,t,r,o,s,u,i,m,f=0,B=0)=>{const Y=[],ae=Math.round(u*m);for(let N=0;N<=ae;N++){const k=N/ae,U=k*u*6.283,se=Ae(o,s,k),ie=k*i;Y.push([e+Math.cos(U)*se+ie*f,t+ie,r+Math.sin(U)*se+ie*B])}return Y};me.forEach((e,t)=>{if(!e.n)return;const r=2.6+Math.min(e.n,14)*.2+n.range(0,.8);Me.lathe([e.x,0,e.z],[[0,-.5],[r*.75,-.5],[r,-.1],[r*.92,.3],[r*.55,.62],[r*.25,1],[.5,1.9],[0,2]],{radial:14,dark:i=>1-.5*i});const o=r*n.range(.5,.7),s=n.range(.2,.3);if(t>1&&n.chance(.12)){const i=n.range(0,6.28);Me.tube(Ye(e.x+Math.cos(i)*r*1.1,.3,e.z+Math.sin(i)*r*1.1,o*.7,o*.6,2.2,.5,14,Math.cos(i)*3.2,Math.sin(i)*3.2),s,{radial:4,dark:.55})}else Me.tube(Ye(e.x,.55,e.z,o,o*.55,n.range(1.8,2.6),n.range(1,1.8),14),s,{radial:4,dark:i=>.7-.3*i})}),await l();const $e=new a.Vector3(0,-7,62).normalize(),Qe=new a.Vector3(0,1,0).addScaledVector($e,-$e.y).normalize(),vt=new a.Vector3().crossVectors(Qe,$e),Pt=[],Ct=[],Ft=n.range(0,6.28);for(let e=0;e<72;e++){const t=e/72*6.283,r=7.85+.2*Math.sin(t*3+Ft);Pt.push(ve.copy(le).addScaledVector(vt,Math.cos(t)*r).addScaledVector(Qe,Math.sin(t)*r).toArray())}for(let e=0;e<=150;e++){const t=e/150*6.283*.92+3.6,r=e/150*6.283*7,o=7.9+Math.cos(r)*.82;ve.copy(le).addScaledVector(vt,Math.cos(t)*o).addScaledVector(Qe,Math.sin(t)*o).addScaledVector($e,Math.sin(r)*.82),Ct.push(ve.toArray())}const Zt=e=>.45-1.05*Math.sin(e*6.283);Me.tube(Pt,e=>.64-.2*Math.sin(e*6.283)+.07*Math.sin(e*31+Ft),{radial:10,closed:!0,dark:Zt}),Me.tube(Ct,.26,{radial:4,dark:e=>.4-.8*Math.sin(e*6.283*.92+3.6)});const Vt=I(le.x,le.z),pe=ve.copy(le).addScaledVector(Qe,-7.85).toArray(),Dt=Math.max(pe[1]-Vt,1);Me.tube(Ye(pe[0],Vt-.3,pe[2],3.3,1,5.2,Dt+.4,14),e=>.42-.12*e,{radial:6,dark:e=>.95-.35*e});for(const[e,t,r]of[[-4.2,1.6,.2],[3.6,2.4,.17],[1.2,-3.4,.15]]){const o=I(pe[0]+e,pe[2]+t)-.2;Me.tube([[pe[0]+e*.12,pe[1]+.2,pe[2]+t*.12],[pe[0]+e*.45,pe[1]-Dt*.45,pe[2]+t*.45],[pe[0]+e*.85,o+.5,pe[2]+t*.85],[pe[0]+e*1.25,o,pe[2]+t*1.25]],s=>r*(1+.6*s),{radial:5,dark:.7})}await l();const Bt=(e,t,r,o,s)=>{Me.tube([[e,t,r],[e,t-o*.35,r],[e,t-o*.7,r],[e,t-o,r]],i=>s*(1-.55*i),{radial:4,dark:.3,grow:i=>-i*o});const u=s*n.range(2.6,3.8);Me.lathe([e,t-o-u*1.5,r],[[0,0],[u*.7,u*.3],[u,u*.9],[u*.75,u*1.5],[u*.3,u*2.2],[s*.5,u*2.9]],{radial:7,dark:.75,grow:-o})},Wt=Ve.filter(e=>e.t0<-5),Xt=Math.round(34*y);for(let e=0;e<Xt&&Wt.length;e++){const t=n.pick(Wt),r=n.chance(.5)?n.range(.05,.3):n.range(.7,.95);d.threadPoint(t,r,fe),Bt(fe.x,fe.y,fe.z,n.range(2,9),n.range(.13,.2))}for(const e of[3.75,5.6])fe.copy(le).addScaledVector(vt,Math.cos(e)*7.85).addScaledVector(Qe,Math.sin(e)*7.85),Bt(fe.x,fe.y-.5,fe.z,n.range(1.2,2.2),.14);await l();const wt={a:[Math.sin(.19)*153,-.4,Math.cos(.19)*153],b:[Math.sin(3.6)*155,-.4,Math.cos(3.6)*155],seed:n(),hs:1},Ze=[],Jt=n.range(.24,.3);for(let e=0;e<=26;e++)Ze.push(d.threadPoint(wt,e/26*Jt,fe).toArray());const _e=Ze[Ze.length-1];for(let e=1;e<=7;e++)Ze.push([_e[0]+Math.sin(e*.5)*1.6,_e[1]-e*2.4+e*e*.08,_e[2]+(1-Math.cos(e*.5))*1.6]);Me.tube(Ze,e=>.42-.24*e,{radial:4,dark:.45}),Me.lathe([wt.a[0],0,wt.a[2]],[[0,-.5],[2.4,-.5],[3.1,-.1],[2.6,.35],[1.2,.8],[.45,1.6]],{radial:12,dark:.9}),await l();const ea=Me.build();await l();const nt=d.glassMeshes(ea);nt.name="glass",x.add(nt),await l();const Nt=d.glassBuilder(),Rt={value:0};Nt.tube(Ye(0,0,0,2.3,1.5,6,3.4,16),.3,{radial:5,dark:.35,grow:e=>e});const Xe=d.glassMeshes(Nt.build(),{grow:Rt});Xe.position.copy(J),Xe.position.y+=.9,x.add(Xe);const gt=d.glassBuilder();gt.lathe([J.x,J.y-.3,J.z],[[0,0],[4.6,0],[5.4,.5],[4.4,.95],[1.5,1.3],[0,1.4]],{radial:14,dark:.8}),gt.tube(Ye(J.x+4.6,J.y+.7,J.z+1.5,1.9,1.5,3,.6,14,2.6,1.2),.3,{radial:5,dark:.5});const ta=d.glassMeshes(gt.build(),{materials:[nt.children[0].material,nt.children[1].material]});x.add(ta),await l();const Je=new a.Vector3(Ge[0],0,Ge[1]);Je.y=I(Je.x,Je.z)-.6;const et=new a.Mesh(d.peakGeometry({height:9,radius:3.3,curl:2.9,dir:Math.PI*.35,radial:14,rings:12,wob:1,rnd:n,toast:.9}),d.meringue({coat:-1e3}));et.position.copy(Je),et.name="pulled-peak",x.add(et);const xt=[],Et=new Int32Array(Ve.length).fill(-1);Ve.forEach((e,t)=>{e.rib&&(Et[t]=xt.length,xt.push(e))});const ce=F.renderer;let We=null,it=null,De=null,Te=null;if(ce&&ce.compile){We=new a.WebGLRenderTarget(1024,1024,{depthBuffer:!1,generateMipmaps:!0,minFilter:a.LinearMipmapLinearFilter,magFilter:a.LinearFilter}),We.texture.anisotropy=8,it=new a.Scene,Te=new a.Mesh(d.threadGeometry(xt,32),d.threadNet),Te.frustumCulled=!1,Te.matrixAutoUpdate=!1,it.add(Te),De=new a.OrthographicCamera(-178,178,178,-178,1,1400);const e=ce.getRenderTarget();ce.setRenderTarget(We),ce.compile(Te,De,it),ce.setRenderTarget(e),g.uNet.value=We.texture,g.uNetAmt.value=L.net??1,await l()}const bt={x:0,z:0,r:137,rf:(e,t)=>{const r=Math.cos(p),o=Math.sin(p);return V(Math.atan2(e*r-t*o,e*o+t*r))}};if(L.stage??!0){const e=[],t=[],o=[];for(let i=0;i<=38;i++)o.push(i*12);for(const i of[520,640,820,1100,1500,2100])o.push(i);for(let i=0;i<o.length;i++)for(let m=0;m<128;m++){const f=m/128*6.283;if(e.push(Math.sin(f)*o[i],0,Math.cos(f)*o[i]),i>0){const B=(i-1)*128+m,Y=(i-1)*128+(m+1)%128;t.push(B,B+128,Y,Y,B+128,Y+128)}}const s=new a.BufferGeometry;s.setAttribute("position",new a.Float32BufferAttribute(e,3)),s.setIndex(t),g.uCollar.value.set(0,0,148);const u=new a.Mesh(s,d.custard());u.name="stage-custard",u.frustumCulled=!1,x.add(u),x.add(d.sky()),await l(),await d.makeFlow([bt,...me.filter(i=>i.n).map(i=>({x:i.x,z:i.z,r:3.5}))],{size:384,width:900,shadeSize:256,casters:[{x:0,z:0,r:110,h:56,round:1},...b.map(i=>({x:i.x,z:i.z,r:i.radius*1.25+8,h:i.top,round:.5}))]})}const aa={portalSeat:{position:le.clone(),normal:$e.clone(),radius:7,pitchDeg:6.4},flyThrough:we.map(e=>e.clone()),gate:{left:new a.Vector3(me[1].x,0,me[1].z),right:new a.Vector3(me[0].x,0,me[0].z),center:new a.Vector3(0,6,150.3)},feet:me.filter(e=>e.n).map(e=>new a.Vector3(e.x,0,e.z)),viewpoints:{reveal:new a.Vector3(0,3,390),crossing:new a.Vector3(0,4,220),gate:new a.Vector3(0,6,160),nave:new a.Vector3(0,31,90),hollow:new a.Vector3(0,58.5,13)},lookAt:new a.Vector3(0,80,0),crown:new a.Vector3(0,176,0),pour:J.clone(),pulledPeak:Je.clone(),peaks:b.map(e=>({position:new a.Vector3(e.x,e.base,e.z),top:e.top,radius:e.radius})),brokenStrand:new a.Vector3(_e[0],_e[1],_e[2]),shore:bt,clock:{duration:C,share:ue,threads:st}};let yt=!1,Re=0;const oa=new a.Matrix4,Mt=new a.Vector3,Gt=e=>{g.uClock.value=Re,g.uFill.value=Tt(Re);const t=R(28.5,30,Re),r=Math.max(Re-30,0);et.scale.set(1.25-.25*t,Math.max(.02,t*(1+.22*Math.sin(t*Math.PI))-.07*Math.exp(-r*1.6)*Math.sin(r*8)*t),1.25-.25*t),et.rotation.x=(1-t)*.5;const o=e%5/5,s=R(.84,1,o);Rt.value=Math.min(o/.8,1),Xe.scale.set(1+.5*s,1-.85*s,1+.5*s),Xe.rotation.z=.35*s},sa={object:x,radius:150,height:176,center:new a.Vector3(0,78,0),anchors:aa,style:d,ground:!1,groundY:0,heightAt:I,countAt:Tt,threads:Ve,shore:bt,casters:[{x:0,z:0,r:110,h:56,round:1},...b.map(e=>({x:e.x,z:e.z,r:e.radius*1.25+8,h:e.top,round:.5}))],setProgress(e){yt=!0,Re=Ce(e,0,1)*C},setClock(e){yt=!0,Re=e},setThrow(e,t){const r=rt.geometry.attributes.aP;r.array[e*4]!==t&&(r.array[e*4]=t,r.needsUpdate=!0);const o=Et[e];if(Te&&o>=0){const s=Te.geometry.attributes.aP;s.array[o*4]!==t&&(s.array[o*4]=t,s.needsUpdate=!0)}},update(e,t,r){if(E&&d.update(e,t,r),yt||(Re=(8+t*1)%46),Gt(t),We){x.updateWorldMatrix(!0,!1),Te.matrix.copy(x.matrixWorld),Mt.set(0,85,0).applyMatrix4(x.matrixWorld),De.position.copy(Mt).addScaledVector(d.sun,600),De.up.set(0,1,0),De.lookAt(Mt),De.updateMatrixWorld(!0),g.uNetMat.value.multiplyMatrices(De.projectionMatrix,oa.copy(De.matrixWorld).invert());const o=ce.getRenderTarget(),s=ce.autoClear,u=ce.getClearAlpha();ce.getClearColor(Ot),ce.autoClear=!0,ce.setClearColor(0,1),ce.setRenderTarget(We),ce.clear(),ce.render(it,De),ce.setRenderTarget(o),ce.setClearColor(Ot,u),ce.autoClear=s}},dispose(){We&&We.dispose(),Te&&Te.geometry.dispose(),d.threadNet.dispose()}};return Gt(0),sa}const Ot=new a.Color;export{na as PALETTE,ra as POST,ya as buildHero,ma as makeStyle};
