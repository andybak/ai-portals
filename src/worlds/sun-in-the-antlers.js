import*as t from"three";import{makePath as yt,clamp as be,lerp as ue,smoothstep as R}from"../kit/core.js";import{buildHero as bt,poseElk as St,ELK_VERT as zt}from"../parts/sun-in-the-antlers.js";const ee=Math.PI*2,j=28,B={x0:-4100,z0:-500,w:4800,d:2800},Mt={dawn:{sky:["#F7C9A3","#F29B4B","#F6E3B4","#DCE8FF","#8FA3DC"],twilight:"#27306A",snowLit:"#EAF2FB",snowWarm:"#F7C9A3",shade:"#8FA3DC",spruce:"#1F3B3A",spruceLit:"#35594F",gold:"#FFD277",apricot:"#F29B4B",nightSnow:"#2C3A78",nightTree:"#0E1A2E",haze:"#EBC9BC",ice:"#DCE8FF",mount:"#7F93CE",exposure:.9,sunElev:.339,bone:"#7686CE",sunCols:["#FFCB2E","#F7A233","#EC7A2A"],forest:"#16302F",cobalt:"#5F74C8"},blue:{sky:["#E9A58C","#E5683A","#C9A2B6","#8E9AD2","#4A5AA6"],twilight:"#1C2356",snowLit:"#C3CEF0",snowWarm:"#EBB4A0",shade:"#6A70C2",spruce:"#182F3A",spruceLit:"#2A4A52",gold:"#FFB25E",apricot:"#E5683A",nightSnow:"#2A3880",nightTree:"#101B36",haze:"#B79FC2",ice:"#B9C6F2",mount:"#5562AE",exposure:.98,sunElev:.27,bone:"#343E8C",sunCols:["#FFB23A","#F27A2C","#D9521F"],forest:"#12263A",cobalt:"#4450A8"},lemon:{sky:["#FBEFC4","#FFE08A","#F3F4D8","#D3E6FA","#86AEE2"],twilight:"#2B3A7C",snowLit:"#F2F5F6",snowWarm:"#FBEFC4",shade:"#86A6E0",spruce:"#1E4038",spruceLit:"#3C6652",gold:"#FFE9A6",apricot:"#F2B65A",nightSnow:"#2E4084",nightTree:"#0F1E36",haze:"#E6E4D2",ice:"#D6E8FF",mount:"#7C9CD8",exposure:.86,sunElev:.4,bone:"#5F7ECC",sunCols:["#FFD21F","#F9AE2E","#EE8A26"],forest:"#17362F",cobalt:"#5A7ED0"}},P=`
uniform float uScroll; uniform float uTime; uniform sampler2D uMask; uniform vec4 uMaskRect; uniform vec3 uSun;
uniform vec3 uHaze; uniform float uHazeK;
float h11(float n) { return fract(sin(n * 127.1) * 43758.5453); }
float h21(vec2 p) { vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
vec4 h24(vec2 p) { vec4 q = fract(vec4(p.xyxy) * vec4(.1031, .1030, .0973, .1099)); q += dot(q, q.wzxy + 33.33); return fract((q.xxyz + q.yzzw) * q.zywx); }
float vn2(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y);
}
// dry-brush: streaky value noise, stretched 5:1
float brush2(vec2 p) { return vn2(p * vec2(1., 5.)) * .6 + vn2(p * vec2(2.3, 13.) + 7.) * .4; }
float riverZ(float gx) { return 690. + 22. * sin(gx * .0021 + .6) + 10. * sin(gx * .0057 + 2.); }
// world-fixed easing of the relief: low under the camera's low run and along the elk's own line
float reliefK(vec2 w) {
  float zc = mix(650., 300., smoothstep(-1750., -800., w.x));
  float cor = mix(.26, 1., smoothstep(40., 330., abs(w.y - zc)));
  cor = mix(cor, 1., smoothstep(-760., -400., w.x));
  float track = mix(.1, 1., smoothstep(150., 430., abs(w.y)));
  track = mix(1., track, smoothstep(-1700., -1150., w.x) * (1. - smoothstep(500., 1000., w.x)));
  return min(cor, track);
}
float rollN(vec2 g) {
  float n = sin(g.x * .0031 + 1.3 + 1.7 * sin(g.y * .0017)) * sin(g.y * .0027 + .4) * .5
          + sin(dot(g, vec2(.0062, .0041)) + 2.1) * .25 + sin(dot(g, vec2(-.0093, .0121)) + .7) * .13
          + sin(dot(g, vec2(.021, -.017))) * .06;
  return clamp(n, -1., 1.);
}
// ground height at a WORLD xz
float groundH(vec2 w) {
  vec2 g = w + vec2(uScroll, 0.);
  float bank = smoothstep(38., 150., abs(g.y - riverZ(g.x)));
  return (22. + 22. * rollN(g)) * bank * reliefK(w);
}
// x = night (the elk's shadow), y = meadow (the calf's shadow); edge wobbled like a brush stroke
vec2 maskAt(vec2 w) {
  vec2 g = w + vec2(uScroll, 0.);
  vec2 q = w + (vec2(vn2(g * .045), vn2(g * .045 + 31.)) - .5) * 16.;
  vec2 uv = clamp((q - uMaskRect.xy) * uMaskRect.zw, 0., 1.);
  vec2 m = textureLod(uMask, uv, 0.).rg;
  return smoothstep(vec2(.42), vec2(.58), m);
}
vec2 maskSoft(vec2 w) {
  vec2 uv = clamp((w - uMaskRect.xy) * uMaskRect.zw, 0., 1.);
  return textureLod(uMask, uv, 0.).rg;
}
// distance as three flat haze planes with dry-brushed joins
vec3 hazed(vec3 c, float dist, vec2 w) {
  float f = 1. - exp(-dist * uHazeK * mix(1., .42, smoothstep(260., 1000., cameraPosition.y)));
  float q = floor(clamp(f * 3.999 + (brush2(w * .0016 + 3.) - .5) * .5, 0., 3.999)) / 3.;
  return mix(c, uHaze, q * .7);
}
// three flat tones
vec3 tone3(float s, vec3 shade, vec3 mid, vec3 lit) { return mix(mix(shade, mid, step(.40, s)), lit, step(.68, s)); }
`,ve=p=>690+22*Math.sin(p*.0021+.6)+10*Math.sin(p*.0057+2);function At(p,a){const f=ue(650,300,R(-1750,-800,p));let s=ue(.26,1,R(40,330,Math.abs(a-f)));s=ue(s,1,R(-760,-400,p));let h=ue(.1,1,R(150,430,Math.abs(a)));return h=ue(1,h,R(-1700,-1150,p)*(1-R(500,1e3,p))),Math.min(s,h)}function Ct(p,a){const f=Math.sin(p*.0031+1.3+1.7*Math.sin(a*.0017))*Math.sin(a*.0027+.4)*.5+Math.sin(p*.0062+a*.0041+2.1)*.25+Math.sin(-p*.0093+a*.0121+.7)*.13+Math.sin(p*.021-a*.017)*.06;return be(f,-1,1)}function Qt(p,a,f){const s=p+f,h=R(38,150,Math.abs(a-ve(s)));return(22+22*Ct(s,a))*h*At(p,a)}const it=`
uniform float uDensity;
// stands and clearings: three scales of noise cut hard, so trees gather in clumps of ten to thirty with open snow between
float forestK(vec2 g) { return vn2(g * .0019 + 5.) * .42 + vn2(g * .0056 + 1.) * .3 + vn2(g * .0127 + 9.) * .28; }
float standK(vec2 g) { return smoothstep(.45, .52, forestK(g)); }
// xy = ground position of the tree, z = height, w = exists
vec4 treeCell(vec2 id) {
  vec4 h = h24(id + 71.);
  vec2 g = (id + .04 + .92 * h.xy) * ${j}.;      // jitter over the whole cell: no rows
  float keep = step(h.w, (.015 + .985 * standK(g)) * uDensity);
  keep *= step(92., abs(g.y - riverZ(g.x)));
  return vec4(g, mix(17., 31., h.z), keep);
}`,kt=`
varying vec3 vDir;
void main() { vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,Ft=`
${P}
uniform vec3 uBand[5]; uniform vec3 uTwilight; uniform float uTwi; uniform vec2 uSunAz; uniform float uCloud;
varying vec3 vDir;
void main() {
  vec3 d = vDir / max(length(vDir), 1e-4);
  float e = asin(clamp(d.y, -1., 1.)) * 57.2958;                       // elevation, degrees
  float ax = abs(d.x) < 1e-5 ? 1e-5 : d.x;
  float az = atan(d.z, ax);
  float br = brush2(vec2(az * 2.2, e * .09)) - .5;                    // long horizontal strokes
  float e2 = e + br * 5. + (brush2(vec2(az * 13., e * .45) + 5.) - .5) * 2.6;
  float lh = length(d.xz);
  float cs = dot(d.xz / max(lh, 1e-4), uSunAz);                        // 1 toward the sun's side
  vec3 col = uBand[0];
  col = mix(col, uBand[2], step(7., e2));
  col = mix(col, uBand[3], step(17., e2));
  col = mix(col, uBand[4], step(34., e2));
  // apricot wedge low on the sun's side only, and the brighter notch where it ought to have risen
  float wedge = smoothstep(.2, .95, cs);
  col = mix(col, uBand[1], step(e2, 10. * wedge) * step(.02, wedge));
  col = mix(col, mix(uBand[2], vec3(1.), .25) * 1.05, step(e2, 3.6 * smoothstep(.86, .99, cs)) * step(.87, cs));
  // inside the shadow: twilight above 30 degrees, the dawn ring stays round the horizon
  // (the join is dry-brushed in three ragged steps, and the cap itself is the lighter twilight violet, never a slab)
  float e3 = e2 + (brush2(vec2(az * 6., e * .16) + 11.) - .5) * 15. + (brush2(vec2(az * 23., e * .5) + 2.) - .5) * 5.;
  float tw = uTwi * step(35., e3);
  vec3 twiC = mix(uTwilight, uBand[4], .3) * 1.12;
  vec3 night = twiC * (1. + .12 * step(.5, vn2(d.xz * 5. + 3.)));
  col = mix(col, mix(col, twiC, .38), uTwi * step(15., e3));
  col = mix(col, mix(col, twiC, .62), uTwi * step(25., e3));
  col = mix(col, night, tw);
  vec2 sp = d.xz / (.35 + abs(d.y)) * 13.;
  vec2 id = floor(sp), f = fract(sp) - .5; vec4 hs = h24(id + 9.);
  float star = (1. - smoothstep(.03 + .05 * hs.z, .05 + .07 * hs.z, length(f - (hs.xy - .5) * .6))) * step(hs.w, .5);
  col += vec3(.9, .92, 1.) * star * tw * (.65 + .35 * sin(uTime * (1.5 + 3. * hs.x) + hs.y * 40.));
  // three flat lens clouds, low and far to the right: peach under, lilac over
  if (d.z > .05) {
    float a = d.x / d.z;
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      vec2 c = vec2(-.9 + fi * .85 + uCloud + uTime * .0012, 5.5 + 2.6 * h11(fi + uCloud * 7.));
      vec2 r = vec2(.32 + .1 * h11(fi + 3.), 1.5 + .5 * h11(fi + 5.));
      vec2 q = (vec2(a, e) - c) / r;
      float top = q.y > 0. ? q.y : q.y * 2.6;                           // flat-bottomed lens
      float lens = step(q.x * q.x + top * top + br * .5, 1.);
      vec3 cc = mix(uBand[0] * 1.04, mix(uBand[4], uBand[3], .35), step(-.05 + br * .6, q.y));
      col = mix(col, mix(cc, uTwilight * 1.5, uTwi * .6), lens);
    }
  }
  col = mix(uHaze, col, smoothstep(-2.5, .5, e + br * 2.));          // below the horizon: the far haze plane
  col *= .97 + .06 * h21(floor(gl_FragCoord.xy * .5));
  gl_FragColor = vec4(col, 1.);
}`,Tt=`
${P}
varying vec3 vW;
void main() {
  vec3 w = position;
  w.y = groundH(w.xz);
  vW = w;
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
}`,Bt=`
${P}
${it}
uniform vec3 uSnowLit; uniform vec3 uSnowWarm; uniform vec3 uShade; uniform vec3 uSpruce; uniform vec3 uNightSnow; uniform vec3 uNightTree;
uniform vec3 uIce; uniform vec3 uApricot; uniform vec3 uGold; uniform vec4 uPrint[4]; uniform vec3 uForest; uniform vec3 uCobalt; uniform vec4 uShake[2]; uniform vec4 uCab[3];
varying vec3 vW;
float massAt(vec2 g) { return step(.5, standK(g) * .66 + (brush2(g * .004 + 2.) - .5) * .3 + vn2(g * .011) * .1); }
// footprint (x) and spruce-shaped cobalt shadow (y) of the tree in lattice cell id
vec2 treePaint(vec2 id, vec2 g, vec2 sun, float lenK) {
  vec4 t = treeCell(id);
  vec2 v = g - t.xy;
  float r = t.z * .25, L = t.z * lenK;
  float al = dot(v, -sun), ac = abs(dot(v, vec2(-sun.y, sun.x)));
  float k = clamp(al / L, 0., 1.);
  float sh = step(0., al) * step(al, L) * step(ac, r * (1. - k) * (.7 + .3 * step(.5, fract(k * 5.))));
  return vec2(step(dot(v, v), r * r), sh) * t.w;
}
void main() {
  vec2 w = vW.xz, g = w + vec2(uScroll, 0.);
  float dist = length(vW - cameraPosition);
  float near = 1. - smoothstep(350., 1100., dist), close = 1. - smoothstep(120., 420., dist);
  // slope light: flat snow sits in the middle tone, sun-facing slopes warm, lee slopes cobalt
  float e = 4.;
  float h0 = vW.y, hx = groundH(w + vec2(e, 0.)), hz = groundH(w + vec2(0., e));
  vec3 n = normalize(vec3(h0 - hx, e, h0 - hz));
  vec2 sunXZ = uSun.xz / max(length(uSun.xz), 1e-4);
  float br = brush2(g * .021);
  float s = (dot(n, uSun) - uSun.y) * 2.6 + .56 + (br - .5) * .2;
  // terraced drifts: contour bands with scalloped lee edges throwing cobalt shapes
  float hh = h0 / 4.5 + vn2(g * .012) * 1.3;
  float fr = fract(hh);
  float lee = step(dot(n.xz, sunXZ), .02);
  float riser = step(fr, .1 + .16 * vn2(g * .09)) * step(.6, h0);
  s -= riser * mix(.1, .3, lee);
  s += step(.82, fr) * .07;
  // sastrugi: wind ripples as thin lilac lenses
  vec2 rg = vec2(g.x * .82 + g.y * .57, -g.x * .57 + g.y * .82);
  float sas = step(.66, vn2(rg * vec2(.05, .38)) * .75 + vn2(rg * vec2(.013, .09) + 9.) * .35);
  s -= sas * .2 * near;
  // spindrift: bands of blown snow travelling downwind, long strokes near and broad ones far
  vec2 wd = vec2(g.x * .8 + g.y * .6, -g.x * .6 + g.y * .8);
  vec2 so = vec2(sunXZ.x * .8 + sunXZ.y * .6, -sunXZ.x * .6 + sunXZ.y * .8);
  vec2 d1 = vec2((wd.x - uTime * 18.) * .004, wd.y * .03), d2 = vec2((wd.x - uTime * 55.) * .0008, wd.y * .0034) + 7.;
  float drift = step(.68, brush2(d1)) * near + step(.66, brush2(d2)) * (1. - near);
  float driftSh = step(.68, brush2(d1 + so * vec2(.004, .03) * 5.)) * near + step(.66, brush2(d2 + so * vec2(.0008, .0034) * 36.)) * (1. - near);
  s += drift * .15 - driftSh * (1. - drift) * .2;
  // tussock humps and half-buried boulders
  vec2 tc = g / 9., tid = floor(tc), tf = fract(tc) - .5; vec4 th = h24(tid + 5.);
  vec2 tv = (tf - (th.xy - .5) * .6) * 9.;
  float tr = .7 + 1.5 * th.z;
  float hump = step(length(tv), tr) * step(th.w, .55);
  float crescent = step(length(tv + sunXZ * tr * .75), tr * 1.05) * step(th.w, .55) * (1. - hump);
  s += (hump * .13 - crescent * .3) * close;
  float rock = step(length(tv + vec2(0., tr * .25)), tr * .55) * step(th.w, .12) * close;
  // the elk's own cloven prints, one stride apart, going back along its line
  float print = 0.;
  for (int i = 0; i < 4; i++) {
    vec4 P = uPrint[i];
    float dx = mod(g.x - P.x + 180., 360.) - 180.;
    vec2 pv = vec2(dx, abs(w.y - P.y) - 15.);
    float lobe = step(pv.x * pv.x / 1700. + pv.y * pv.y / 150., 1.);
    float rim = step((pv.x - 6. * sunXZ.x) * (pv.x - 6. * sunXZ.x) / 1700. + pv.y * pv.y / 150., 1.);
    print = max(print, (lobe * .6 + rim * .4) * step(g.x, P.x + 45.) * P.w);
  }
  s -= print * .34;
  // frozen river: ice, swept lilac, a braided ribbon of tracks
  float rz = riverZ(g.x), rd = abs(g.y - rz);
  float ice = 1. - step(34. + 6. * vn2(g * .03), rd);
  float sweep = step(.55, brush2(vec2(g.y * .02, g.x * .004) + 4.));
  float braid = step(abs(sin((g.y - rz) * .19 + 2.5 * vn2(vec2(g.x * .012, 2.)))), .13) * step(rd, 15.) * near;
  float lip = step(rd, 44.) * (1. - ice) * step(0., (g.y - rz) * sunXZ.y);
  vec3 lit = mix(uSnowLit, uSnowWarm, .45) * .78, mid = uSnowLit * .73, shade = mix(uShade, uSnowLit, .12) * .68;
  vec3 day = tone3(s - lip * .25, shade, mid, lit);
  vec3 iceC = mix(uIce * .66, mix(uShade, uIce, .5) * .6, sweep);
  iceC = mix(iceC, uSnowLit * .74, step(.6, vn2(g * vec2(.02, .07) + 2.)));
  day = mix(day, mix(iceC, uShade * .55, braid), ice);
  // starlit snow in two blues: broad dry-brushed drifts of a paler, greyer blue over the deep one
  float s2 = s + (brush2(g * .0052 + 7.) - .5) * .62 + (vn2(g * .0031) - .5) * .3;
  vec3 ngt = tone3(s2, uNightSnow * .74, uNightSnow, mix(uNightSnow, uShade, .36) * 1.3);
  ngt = mix(ngt, mix(uNightSnow * 1.12, uNightSnow * .7, max(braid, sweep * .5)), ice);
  // sled tracks: two runner lines from the near cabins down onto the ice and away up the river
  float tz = rz - mix(62., 25., smoothstep(-2225., -2090., g.x)) + 3. * sin(g.x * .013);
  float sled = step(abs(abs(g.y - tz) - .9), .16 + dist * .0022) * step(-2232., g.x) * (1. - smoothstep(700., 1100., dist));
  day = mix(day, shade * .82, sled);
  ngt = mix(ngt, mix(uNightSnow, uShade, .5) * 1.5, sled);
  // trees: footprint and shadow, this cell and the two cells toward the sun
  vec2 cid = floor(g / ${j}.);
  vec2 sc = sunXZ * ${j}.;
  float lenK = min(2.4, .82 / max(uSun.y, .2));
  vec2 tp = treePaint(cid, g, sunXZ, lenK);
  tp = max(tp, treePaint(floor((g + sc) / ${j}.), g, sunXZ, lenK));
  tp = max(tp, treePaint(floor((g + sc * 1.9) / ${j}.), g, sunXZ, lenK));
  tp *= (1. - ice) * (1. - smoothstep(800., 1500., dist));
  day = mix(day, shade * .92, tp.y * (1. - step(s, .4) * .5));
  day = mix(day, uSpruce * .8, tp.x);
  day = mix(day, uShade * .3, rock);
  // each hoof-fall plume lays one long cobalt shape down-sun, torn at the edge
  float plume = 0.;
  for (int i = 0; i < 2; i++) {
    vec4 sh = uShake[i];
    vec2 pv = w - sh.xy;
    float al = dot(pv, -sunXZ), ac = dot(pv, vec2(-sunXZ.y, sunXZ.x)), kk = clamp(al / 300., 0., 1.);
    float q = length(vec2((al - 140.) / 185., ac / (125. * (1. - .4 * kk))));
    plume = max(plume, sh.z * step(q + (vn2(g * .021) - .5) * .34 + (brush2(g * .006 + 1.) - .5) * .3, 1.));
  }
  day = mix(day, mix(uCobalt * 1.12, uSpruce * .7, tp.x), plume * (1. - ice));
  // far away the dots merge into flat forest shapes with dry-brushed edges
  float open = (1. - ice) * step(92., rd);
  float mass = massAt(g) * open;
  float far = smoothstep(500., 1500., dist) * uDensity;
  float mtone = step(.56, s + (vn2(g * .006 + 4.) - .5) * .5);
  // from high up: the snow settles to two pale tones, the forest to dark masses that throw cobalt shadow shapes
  float hi = smoothstep(420., 1050., cameraPosition.y) * smoothstep(500., 1500., dist);
  day = mix(day, tone3(mix(s, .62, .7), shade, mid, lit), hi);
  float massSh = massAt(g + sunXZ * (46. + 30. * vn2(g * .008))) * open * (1. - mass);
  day = mix(day, uCobalt, massSh * hi);
  vec3 mcol = mix(uSpruce * .8, mix(uSpruce, uShade, .3) * 1.15, mtone);
  mcol = mix(mcol, mix(uForest * .7, uForest * 1.25, mtone), hi);
  day = mix(day, mcol, mass * mix(far * .92, 1., hi));
  ngt = mix(ngt, uNightTree * mix(1., 1.6, mtone), mass * far * .9);
  ngt = mix(ngt, uNightTree * 1.1, max(tp.x, rock));
  ngt = mix(ngt, uNightSnow * .62, tp.y * .6);
  // the night shadow: starlight palette, glints, and an apricot-to-violet fringe along its edge
  vec2 m = maskAt(w), ms = maskSoft(w);
  vec2 gc = g / 13., gid = floor(gc), gf = fract(gc) - .5; vec4 gh = h24(gid + 3.);
  float gr = max(.05, dist * .0002);
  float glint = (1. - smoothstep(gr * .6, gr, length(gf - (gh.xy - .5) * .7))) * step(gh.w, .6) * (.5 + .5 * sin(uTime * (1.2 + 2.5 * gh.z) + gh.x * 30.));
  // a second, finer field of stars near the lens, so the ground reads as night with stars in it
  vec2 gc2 = g / 5.5 + 17., gid2 = floor(gc2), gf2 = fract(gc2) - .5; vec4 gh2 = h24(gid2 + 41.);
  float gr2 = max(.035, dist * .00042);
  float glint2 = (1. - smoothstep(gr2 * .6, gr2, length(gf2 - (gh2.xy - .5) * .7))) * step(gh2.w, .5) * (.45 + .55 * sin(uTime * (1.5 + 2.5 * gh2.z) + gh2.x * 30.));
  glint = max(glint, glint2 * (.55 + .45 * gh2.z) * (1. - smoothstep(160., 420., dist)));
  // the near cabins' windows each lay a small warm patch on the blue snow
  float warm = 0.;
  for (int i = 0; i < 3; i++) {
    vec4 cb = uCab[i]; vec2 dv = (g - cb.xy) / 1.5;
    vec2 lc = vec2(dv.x * cb.z - dv.y * cb.w, dv.x * cb.w + dv.y * cb.z);
    vec2 wq = vec2((lc.x + 1.52) / 2.5, (abs(lc.y) - 6.9) / 3.2);
    float d2 = dot(wq, wq) + (vn2(g * .8) - .5) * .35;
    warm = max(warm, step(d2, 1.) * .5 + step(d2, .42) * .5);
  }
  ngt = mix(ngt, mix(uNightSnow, uGold, .62) * .95, warm * .9);
  ngt += vec3(.75, .82, 1.) * glint * (1. - tp.x) * (.4 + .6 * near);
  vec3 col = mix(day, ngt, m.x);
  float fringe = smoothstep(.12, .42, ms.x) * (1. - smoothstep(.42, .7, ms.x)) * (1. - m.x);
  col = mix(col, mix(uApricot, uShade, .35) * .8, fringe * .75);
  // rare: the calf's shadow is a midsummer meadow
  if (m.y > .01) {
    float gs = (dot(n, uSun) - uSun.y) * 2.6 + .5 + (br - .5) * .45 + (vn2(g * .05) - .5) * .5;
    vec3 mead = tone3(gs, vec3(.07, .26, .12), vec3(.2, .46, .16), vec3(.47, .66, .22));
    vec2 fc = g / 5., fid = floor(fc), ff = fract(fc) - .5; vec4 fh = h24(fid + 17.);
    float fl = step(length(ff - (fh.xy - .5) * .6), .1 + .09 * fh.z + dist * .00035) * step(fh.w, .6);
    vec3 fcol = fh.z < .4 ? vec3(.95, .93, .86) : (fh.z < .75 ? vec3(1., .78, .2) : vec3(.92, .42, .55));
    mead = mix(mead, fcol * .85, fl);
    mead = mix(mead, vec3(.05, .2, .1), max(tp.y * .7, tp.x));
    col = mix(col, mead, m.y);
  }
  col *= mix(1., .955 + .09 * h21(floor(g * 4.)), close);                 // paper tooth
  col = hazed(col, dist, g);
  gl_FragColor = vec4(col, 1.);
}`,nt=`
${P}
${it}
attribute float aKind; attribute vec2 aCell;
uniform float uN; uniform vec2 uRing; uniform float uCellK; uniform float uScale; uniform vec4 uShake[2];
varying vec3 vO; varying float vKind; varying float vS; varying vec2 vM; varying float vDist; varying vec2 vG; varying float vFall;
void main() {
  vec2 cg = cameraPosition.xz + vec2(uScroll, 0.);
  float show, hgt; vec2 gxz; vec4 hs;
  #ifdef RIVERSIDE
    float cc = floor(cg.x / 13.);
    float ix = cc + mod(aCell.x - cc + uN * .5, uN) - uN * .5;
    hs = h24(vec2(ix, aCell.y + 40.));
    gxz.x = (ix + hs.x * .7) * 13.;
    gxz.y = riverZ(gxz.x) + aCell.y * (41. + 16. * hs.y);
    show = step(hs.w, .72) * step(abs(mod(hs.z * 2., 1.) - .5) * 2., 2.) * (aKind < 3.5 ? step(hs.z, .55) : step(.55, hs.z));
    hgt = aKind < 3.5 ? mix(7., 11.5, hs.x) : mix(4., 6.5, hs.y);
  #else
    vec2 cc = floor(cg / (${j}. * uCellK));
    vec2 id = (cc + mod(aCell - cc + uN * .5, uN) - uN * .5) * uCellK;
    if (uCellK > 1.5) id += floor(h24(id + 3.).xy * uCellK * .999);   // far ring: a random cell of each block, never a row
    vec4 t = treeCell(id);
    hs = h24(id + 13.);
    gxz = t.xy; hgt = t.z * uScale;
    float dc = length(gxz - cg);
    show = t.w * smoothstep(uRing.x - 14., uRing.x, dc) * (1. - smoothstep(uRing.y - 14., uRing.y, dc));
  #endif
  vec2 wxz = gxz - vec2(uScroll, 0.);
  float ca = cos(hs.x * 6.283), sa = sin(hs.x * 6.283);
  vec3 p = vec3(position.x * ca - position.z * sa, position.y, position.x * sa + position.z * ca);
  vec3 n = vec3(normal.x * ca - normal.z * sa, normal.y, normal.x * sa + normal.z * ca);
  p *= hgt * show;
  // hoof-fall: every spruce round it drops its snow
  float fall = 0.;
  for (int i = 0; i < 2; i++) {
    vec4 sh = uShake[i];
    fall = max(fall, sh.z * (1. - smoothstep(sh.w * .55, sh.w, length(wxz - sh.xy))));
  }
  if (aKind > .5 && aKind < 1.5) { p.xz *= 1. - fall * .9; p.y -= fall * fall * position.y * hgt * .8; }
  // tips nod in a light wind
  float sway = sin(uTime * (.9 + hs.y) + hs.z * 20. + gxz.x * .02) * .012 + sin(uTime * 2.7 + hs.w * 9.) * .004;
  p.xz += vec2(.8, .6) * sway * position.y * position.y * hgt * (aKind > 3.5 ? 3. : 1.);
  vec3 w = vec3(wxz.x + p.x, groundH(wxz) - .3 + p.y, wxz.y + p.z);
  vO = position * hgt + hs.xyz * 30.; vKind = aKind; vG = gxz; vFall = fall;
  vS = dot(normalize(n + vec3(0., 1e-4, 0.)), uSun) * .5 + .5;
  vM = maskAt(wxz);
  vec4 mv = viewMatrix * vec4(w, 1.); vDist = length(mv.xyz);
  gl_Position = projectionMatrix * mv;
}`,st=`
${P}
uniform vec3 uSnowLit; uniform vec3 uSnowWarm; uniform vec3 uShade; uniform vec3 uSpruce; uniform vec3 uSpruceLit;
uniform vec3 uNightSnow; uniform vec3 uNightTree; uniform vec3 uApricot;
varying vec3 vO; varying float vKind; varying float vS; varying vec2 vM; varying float vDist; varying vec2 vG; varying float vFall;
void main() {
  float br = brush2(vO.xy * .35 + vO.z * .2) - .5;
  float s = vS + br * .3;
  vec3 day, ngt;
  if (vKind < .5) {                               // skirt
    day = tone3(s, uSpruce * .62, uSpruce, uSpruceLit);
    ngt = mix(uNightTree, uNightTree * 1.9, step(.6, s));
    // snow dusted over the boughs in dry strokes; the trees round a hoof-fall have dropped theirs and stand dark and bare
    float dust = step(.6, brush2(vO.xz * .7 + vO.y * .9 + 3.) + (vS - .5) * .5) * (1. - vFall);
    day = mix(day * mix(1., .7, vFall), mix(mix(uShade, uSnowLit, .1) * .7, uSnowLit * .74, step(.5, s)), dust);
    ngt = mix(ngt, uNightSnow * 1.15, dust);
  } else if (vKind < 1.5) {                       // its snow load
    day = tone3(s + .08, mix(uShade, uSnowLit, .1) * .7, uSnowLit * .74, mix(uSnowLit, uSnowWarm, .4) * .8);
    ngt = mix(uNightSnow * .9, uNightSnow * 1.5, step(.55, s));
  } else if (vKind < 2.5) {                       // trunk
    day = uSpruce * .45; ngt = uNightTree * .8;
  } else if (vKind < 3.5) {                       // birch: pale bark, dark ticks, lilac shade
    float tick = step(.8, vn2(vec2(vO.y * 1.7, vO.x * .4)));
    day = mix(mix(uShade * .78, uSnowLit * .8, step(.5, s)), uSpruce * .5, tick);
    ngt = mix(uNightSnow * 1.25, uNightTree, tick);
  } else {                                        // willow: red-gold twigs
    day = mix(vec3(.5, .13, .07), mix(uApricot, vec3(.8, .3, .1), .45), step(.45, s + br));
    ngt = mix(uNightTree * 1.5, vec3(.16, .1, .22), step(.5, s));
  }
  vec3 col = mix(day, ngt, vM.x);
  col = mix(col, col * vec3(.75, 1.15, .7) + vec3(0., .05, 0.) * step(vKind, 1.5) * step(.5, vKind), vM.y);   // meadow shade: thawed green
  col *= .96 + .08 * h21(floor(vO.xy * 3.));
  gl_FragColor = vec4(hazed(col, vDist, vG), 1.);
}`;function Le(p,a,f,s){const h=[],c=[],i=[],n=(l,m,x,z)=>(h.push(l,m,x),c.push(z),h.length/3-1);for(let l=0;l<p;l++){const m=l/p,x=.1+m*.84,z=Math.min(1,x+1.25/p+.05),K=.27*(1-m*.78),N=f?a*2:a,L=s()*ee,de=n(0,z,0,0),T=h.length/3;for(let F=0;F<N;F++){const A=L+F/N*ee,D=K*(f&&F%2?.74:1),H=f&&F%2?.035:0;n(Math.cos(A)*D,x+H-.02,Math.sin(A)*D,0)}for(let F=0;F<N;F++)i.push(de,T+(F+1)%N,T+F);const te=n(0,z+.012,0,1),oe=h.length/3,I=z-x;for(let F=0;F<a;F++){const A=L+.3+F/a*ee,D=.5+.32*s(),H=K*D*1.12;n(Math.cos(A)*H,z-I*D+.02,Math.sin(A)*H,1)}for(let F=0;F<a;F++)i.push(te,oe+(F+1)%a,oe+F)}if(f){const l=n(0,.3,0,2),m=h.length/3;for(let x=0;x<3;x++)n(Math.cos(x*2.1)*.03,0,Math.sin(x*2.1)*.03,2);for(let x=0;x<3;x++)i.push(l,m+(x+1)%3,m+x)}const e=new t.BufferGeometry;return e.setAttribute("position",new t.Float32BufferAttribute(h,3)),e.setAttribute("aKind",new t.Float32BufferAttribute(c,1)),e.setIndex(i),e.computeVertexNormals(),e}function Pt(p){const a=[],f=[],s=[],h=(i,n,e,l)=>{const m=a.length/3;a.push(...i,...n,...e),f.push(l,l,l),s.push(m,m+1,m+2)};for(let i=0;i<2;i++){const n=i?.022:0,e=i?0:.022;h([-n,0,-e],[n,0,e],[n*.3,1,e*.3],3),h([-n,0,-e],[n*.3,1,e*.3],[-n*.3,1,-e*.3],3)}for(let i=0;i<9;i++){const n=.32+.065*i,e=i*2.4+p()*.6,l=.36*(1-(n-.3)*.75),m=.75+p()*.3,x=Math.cos(e)*l,z=Math.sin(e)*l;h([0,n-.012,0],[0,n+.014,0],[x,n+l*m,z],3),h([x*.5,n+l*m*.45,z*.5],[x*.52,n+l*m*.5,z*.52],[x*.5+Math.cos(e+1)*l*.4,n+l*m*.95,z*.5+Math.sin(e+1)*l*.4],3)}for(let i=0;i<12;i++){const n=i*.52+p()*.4,e=.28+p()*.3,l=.65+p()*.35,m=.045;h([Math.cos(n+1.57)*m,0,Math.sin(n+1.57)*m],[-Math.cos(n+1.57)*m,0,-Math.sin(n+1.57)*m],[Math.cos(n)*e,l,Math.sin(n)*e],4)}const c=new t.BufferGeometry;return c.setAttribute("position",new t.Float32BufferAttribute(a,3)),c.setAttribute("aKind",new t.Float32BufferAttribute(f,1)),c.setIndex(s),c.computeVertexNormals(),c}class Nt{constructor(){this.pos=[],this.kind=[],this.base=[],this.loc=[],this.m=new t.Matrix4,this.v=new t.Vector3}at(a,f,s,h=1){return this.m.makeRotationY(s).scale(this.v.set(h,h,h)),this.gx=a,this.gz=f,this}tri(a,f,s,h){for(const c of[a,f,s])this.v.set(c[0],c[1],c[2]),this.loc.push(this.v.x,this.v.y,this.v.z),this.v.applyMatrix4(this.m),this.pos.push(this.v.x+this.gx,this.v.y,this.v.z+this.gz),this.kind.push(h),this.base.push(this.gx,this.gz)}quad(a,f,s,h,c){this.tri(a,f,s,c),this.tri(a,s,h,c)}box(a,f,s,h,c,i,n){const e=a-h/2,l=a+h/2,m=s-i/2,x=s+i/2,z=f+c;this.quad([e,f,x],[l,f,x],[l,z,x],[e,z,x],n),this.quad([l,f,m],[e,f,m],[e,z,m],[l,z,m],n),this.quad([l,f,x],[l,f,m],[l,z,m],[l,z,x],n),this.quad([e,f,m],[e,f,x],[e,z,x],[e,z,m],n),this.quad([e,z,x],[l,z,x],[l,z,m],[e,z,m],n)}prism(a,f,s,h){for(let e=0;e<s.length-1;e++){const[l,m]=s[e],[x,z]=s[e+1];this.quad([a,m,l],[a,z,x],[f,z,x],[f,m,l],h)}const c=s[Math.floor(s.length/2)];for(let e=0;e<s.length-1;e++)e===Math.floor(s.length/2)||e+1===Math.floor(s.length/2)||(this.tri([a,s[e][1],s[e][0]],[a,c[1],c[0]],[a,s[e+1][1],s[e+1][0]],h),this.tri([f,s[e][1],s[e][0]],[f,s[e+1][1],s[e+1][0]],[f,c[1],c[0]],h));const i=s[0],n=s[s.length-1];this.tri([a,i[1],i[0]],[a,n[1],n[0]],[a,c[1],c[0]],h),this.tri([f,i[1],i[0]],[f,c[1],c[0]],[f,n[1],n[0]],h)}cabin(a,f,s,h,c){this.at(a,f,s,h);const i=9.5,n=6.6,e=3.5;this.box(0,-1,0,i,e+1,n,0),this.prism(-i/2,i/2,[[n/2,e],[0,e+2.9],[-n/2,e]],0),this.prism(-i/2-.7,i/2+.7,[[n/2+1.1,e-.5],[n/2+.6,e+.9],[0,e+4.1],[-n/2-.6,e+.9],[-n/2-1.1,e-.5]],1),this.box(i*.24,e+1.6,n*.16,.9,3.4,.9,3),this.box(i*.24,e+5,n*.16,1.25,.45,1.25,1);for(const l of[1,-1]){const m=l*(n/2+.06),x=-i*.16;this.quad([x-1*l,1,m],[x+1*l,1,m],[x+1*l,2.7,m],[x-1*l,2.7,m],2),this.box(x,.72,l*(n/2+.2),2.4,.26,.4,1)}return this.quad([i/2+.06,1.2,.8],[i/2+.06,1.2,-.8],[i/2+.06,2.8,-.8],[i/2+.06,2.8,.8],2),this.quad([-i/2-.06,-.2,-.7],[-i/2-.06,-.2,.7],[-i/2-.06,2.3,.7],[-i/2-.06,2.3,-.7],3),this.prism(-i/2-4,-i/2-1.6,[[2.2,-.4],[1.2,.9],[0,1.25],[-1.2,.9],[-2.2,-.4]],1),{gx:a+Math.cos(s)*i*.24*h,gz:f-Math.sin(s)*i*.24*h,top:(e+5.6)*h}}hayRack(a,f,s,h=1){this.at(a,f,s,h),this.prism(-3,3,[[1.8,.3],[0,3.3],[-1.8,.3]],4),this.prism(-3.3,3.3,[[1.1,2.1],[.6,3.2],[0,3.75],[-.6,3.2],[-1.1,2.1]],1);for(const c of[-3.2,3.2])this.box(c,-1,0,.3,4.6,.3,3)}bridge(a,f,s){this.at(a,f,Math.PI/2,1),this.box(0,2.2,0,s,.5,5,3),this.box(0,2.7,0,s*.96,.35,3.4,1);for(let h=0;h<=8;h++){const c=(h/8-.5)*s;for(const i of[-2.4,2.4])this.box(c,2.6,i,.35,1.7,.35,3),this.box(c,4.3,i,.6,.3,.6,1);h%2===0&&this.box(c,-2,0,.8,4.4,4.4,3)}for(const h of[-2.4,2.4])this.box(0,3.7,h,s,.22,.22,3)}church(a,f,s){this.at(a,f,s,1.25),this.box(0,-1,0,15,7,7.4,0),this.prism(-7.5,7.5,[[3.7,6],[0,10.4],[-3.7,6]],0),this.prism(-8.2,8.2,[[4.9,5.4],[4.2,7.2],[0,11.8],[-4.2,7.2],[-4.9,5.4]],1),this.box(9.6,-1,0,4.4,15,4.4,0);const h=14,c=3.1,i=[9.6,25,0],n=[[9.6-c,h,-c],[9.6+c,h,-c],[9.6+c,h,c],[9.6-c,h,c]];for(let e=0;e<4;e++)this.tri(n[e],i,n[(e+1)%4],e<2?1:3);for(const e of[1,-1])for(const l of[-4.5,-1,2.5]){const m=e*3.76;this.quad([l-.7*e,1.4,m],[l+.7*e,1.4,m],[l+.7*e,4.4,m],[l-.7*e,4.4,m],2)}this.quad([11.86,9.5,.7],[11.86,9.5,-.7],[11.86,11.5,-.7],[11.86,11.5,.7],2)}geometry(){const a=new t.BufferGeometry;return a.setAttribute("position",new t.Float32BufferAttribute(this.pos,3)),a.setAttribute("aLoc",new t.Float32BufferAttribute(this.loc,3)),a.setAttribute("aKind",new t.Float32BufferAttribute(this.kind,1)),a.setAttribute("aBase",new t.Float32BufferAttribute(this.base,2)),a.computeVertexNormals(),a}}const Lt=`
${P}
attribute float aKind; attribute vec2 aBase; attribute vec3 aLoc;
varying vec3 vL; varying float vKind; varying float vS; varying vec2 vM; varying float vDist; varying vec2 vG;
void main() {
  vec2 bw = aBase - vec2(uScroll, 0.);
  vec3 w = vec3(position.x - uScroll, position.y + groundH(bw), position.z);
  vL = aLoc; vKind = aKind; vG = aBase; vM = maskAt(bw);
  vS = dot(normalize(normal + vec3(0., 1e-4, 0.)), uSun) * .5 + .5;
  vec4 mv = viewMatrix * vec4(w, 1.); vDist = length(mv.xyz);
  gl_Position = projectionMatrix * mv;
}`,Et=`
${P}
uniform vec3 uSnowLit; uniform vec3 uSnowWarm; uniform vec3 uShade; uniform vec3 uNightSnow; uniform vec3 uNightTree; uniform vec3 uGold;
varying vec3 vL; varying float vKind; varying float vS; varying vec2 vM; varying float vDist; varying vec2 vG;
void main() {
  float br = brush2(vL.xy * .5 + vL.z * .3) - .5, s = vS + br * .25;
  vec3 day, ngt;
  if (vKind < .5) {                               // logs: warm lit, violet-brown shade, a dark seam per log
    float seam = step(fract(vL.y / .52), .16);
    day = tone3(s, vec3(.2, .13, .2), vec3(.36, .2, .15), vec3(.58, .34, .2)) * (1. - seam * .35);
    ngt = mix(uNightTree * 1.25, uNightTree * 2.1, step(.55, s)) * (1. - seam * .3);
  } else if (vKind < 1.5) {                       // heaped snow
    day = tone3(s + .06, mix(uShade, uSnowLit, .1) * .7, uSnowLit * .75, mix(uSnowLit, uSnowWarm, .4) * .8);
    ngt = mix(uNightSnow * .95, uNightSnow * 1.55, step(.55, s));
  } else if (vKind < 2.5) {                       // the window: lit while the night is on it
    day = uGold * .3; ngt = uGold * 2.3;
  } else if (vKind < 3.5) {
    day = mix(vec3(.12, .08, .13), vec3(.3, .17, .12), step(.55, s)); ngt = uNightTree;
  } else {
    day = mix(vec3(.45, .32, .14), vec3(.74, .58, .26), step(.5, s + br)); ngt = uNightTree * 1.8;
  }
  float night = vKind > 1.5 && vKind < 2.5 ? smoothstep(.0, 1., vM.x) : vM.x;
  vec3 col = mix(day, ngt, night);
  if (vKind < 1.5 || vKind > 2.5) col *= .96 + .08 * h21(floor(vL.xy * 4.));
  gl_FragColor = vec4(hazed(col, vDist, vG) , 1.);
}`,qt=`
${P}
attribute vec2 aPart; attribute vec4 aI; uniform vec4 uHerd;      // x = stream centre (world x), y = gait time, z = show, w = lane wobble time
varying vec3 vO; varying float vKind; varying float vS; varying vec2 vM; varying float vDist; varying vec2 vG;
void main() {
  float ph = uHerd.y * (5.2 + aI.w) + aI.z * 6.283;
  vec3 p = position;
  float part = aPart.x;
  if (part > 2.5 && part < 3.5) {                 // legs swing from the hip, fore and hind half a beat apart
    float a = sin(ph + aPart.y) * .85, c = cos(a), s = sin(a);
    vec2 q = p.xy - vec2(position.z > 5. ? 0. : (p.x > 0. ? .62 : -.62), 1.22);
    q = vec2(q.x * c - q.y * s, q.x * s + q.y * c);
    p.xy = q + vec2(p.x > 0. ? .62 : -.62, 1.22);
    p.y += max(0., sin(ph + aPart.y + 1.2)) * .12;
  } else if (part > 3.5) {                        // snow kicked up behind the hooves
    float t = fract(ph / 6.283 + aPart.y);
    p.xy = vec2(-.9 - t * 2.6, .15 + t * (1. - t) * 2.4) + (p.xy - vec2(-1., .3)) * (.4 + 1.6 * t) * (1. - t * t);
  } else {
    float rock = sin(ph) * .09;                   // body rocks and bounds
    p.xy = vec2(p.x * cos(rock) - (p.y - 1.3) * sin(rock), p.x * sin(rock) + (p.y - 1.3) * cos(rock) + 1.3);
  }
  p.y += abs(sin(ph)) * .16;
  p *= 1.4 + .25 * aI.z;
  float x = uHerd.x + aI.x + sin(uHerd.w * .7 + aI.z * 9.) * 4.;
  float gx = x + uScroll;
  float z = riverZ(gx) + aI.y + sin(gx * .013 + aI.z * 20.) * 4.;
  float sl = (riverZ(gx + 6.) - riverZ(gx)) / 6.;
  vec2 f = normalize(vec2(1., sl));
  vec3 w = vec3(x + p.x * f.x - p.z * f.y, p.y * uHerd.z + .1, z + p.x * f.y + p.z * f.x);
  vec3 n = normalize(normal + vec3(0., 1e-4, 0.));
  vS = dot(vec3(n.x * f.x - n.z * f.y, n.y, n.x * f.y + n.z * f.x), uSun) * .5 + .5;
  vO = position; vKind = part; vG = vec2(gx, z); vM = maskAt(vec2(x, z));
  vec4 mv = viewMatrix * vec4(w, 1.); vDist = length(mv.xyz);
  gl_Position = projectionMatrix * mv;
}`,Rt=`
${P}
uniform vec3 uSnowLit; uniform vec3 uShade; uniform vec3 uNightSnow; uniform vec3 uNightTree; uniform vec3 uGold;
varying vec3 vO; varying float vKind; varying float vS; varying vec2 vM; varying float vDist; varying vec2 vG;
void main() {
  float s = vS + (brush2(vO.xy * 1.6 + vO.z) - .5) * .3;
  vec3 day, ngt;
  if (vKind < .5 || (vKind > 2.5 && vKind < 3.5)) {
    day = tone3(s, vec3(.17, .12, .2), vec3(.36, .27, .25), vec3(.62, .47, .36));
    ngt = mix(uNightTree * .9, uNightSnow * .8, step(.6, s));
  } else if (vKind < 1.5) {
    day = tone3(s, uShade * .7, uSnowLit * .7, uSnowLit * .8); ngt = mix(uNightSnow, uNightSnow * 1.6, step(.5, s));
  } else if (vKind < 2.5) {
    day = mix(uShade * .6, mix(uSnowLit, uGold, .3) * .74, step(.45, s)); ngt = uNightSnow * 1.35;
  } else {
    day = mix(uShade * .8, uSnowLit * .8, step(.4, s)); ngt = uNightSnow * 1.5;
  }
  gl_FragColor = vec4(hazed(mix(day, ngt, vM.x), vDist, vG), 1.);
}`;function Dt(){const p=[],a=[],f=[],s=(i,n,e,l,m=0)=>(p.push(i,n,e),a.push(l,m),p.length/3-1),h=(i,n,e=6)=>{const l=p.length/3;i.forEach(([m,x,z,K])=>{for(let N=0;N<e;N++){const L=N/e*ee+.5;s(m,x+Math.sin(L)*z,Math.cos(L)*K,n)}});for(let m=0;m<i.length-1;m++)for(let x=0;x<e;x++){const z=l+m*e+x,K=l+m*e+(x+1)%e,N=z+e,L=K+e;f.push(z,N,K,K,N,L)}};h([[-1,1.42,.02,.02],[-.86,1.4,.3,.24],[-.2,1.3,.36,.3],[.5,1.36,.4,.3],[.9,1.5,.32,.23],[1.2,1.68,.24,.17],[1.44,1.8,.17,.14],[1.84,1.66,.1,.09],[1.92,1.63,.01,.01]],0),h([[.6,1.16,.24,.2],[.98,1.3,.34,.25],[1.2,1.5,.2,.18]],1,5),h([[-1.08,1.5,.02,.02],[-.98,1.46,.18,.16],[-.86,1.42,.02,.02]],1,4);for(const i of[.62,-.62])for(const n of[.17,-.17]){const e=(i>0?0:Math.PI)+(n>0?0:.7),l=p.length/3;s(i-.12,1.22,n,3,e),s(i+.12,1.22,n,3,e),s(i+.05,.62,n,3,e),s(i-.07,.62,n,3,e),s(i+.06,0,n,3,e),s(i-.04,0,n,3,e),f.push(l,l+1,l+2,l,l+2,l+3,l+3,l+2,l+4,l+3,l+4,l+5)}for(const i of[1,-1]){const n=[[1.4,1.9,.1*i],[.95,2.7,.5*i],[1.45,3.3,.66*i]],e=(l,m,x)=>{const z=p.length/3;s(l[0]-x,l[1],l[2],2),s(l[0]+x,l[1],l[2],2),s(m[0],m[1],m[2],2),f.push(z,z+1,z+2)};e(n[0],n[1],.08),e(n[1],n[2],.07),e(n[1],[.55,3.1,.6*i],.06),e([1.2,2.25,.28*i],[1.75,2.5,.3*i],.055),e([1.2,3,.58*i],[1.8,3.2,.72*i],.05),e([1.42,1.95,.1*i],[1.95,2.2,.16*i],.05)}for(let i=0;i<3;i++){const n=p.length/3,e=(i-1)*.3,l=i/3;s(-1.25,.1,e,4,l),s(-.75,.1,e,4,l),s(-.8,.62,e+.1,4,l),s(-1.2,.55,e-.1,4,l),f.push(n,n+1,n+2,n,n+2,n+3)}const c=new t.BufferGeometry;return c.setAttribute("position",new t.Float32BufferAttribute(p,3)),c.setAttribute("aPart",new t.Float32BufferAttribute(a,2)),c.setIndex(f),c.computeVertexNormals(),c}const Kt=`
${P}
attribute vec4 aP; attribute float aT;        // aP: chimney ground x, z, mouth height, seed
varying vec2 vUv; varying vec2 vM; varying float vT; varying float vDist; varying vec2 vG;
void main() {
  float t = fract(uTime * .11 + aT + aP.w);
  vec2 bw = aP.xy - vec2(uScroll, 0.);
  vec3 c = vec3(bw.x, groundH(bw) + aP.z, bw.y) + vec3(.55, 0., .35) * t * t * 22. + vec3(0., t * 13., 0.);
  c.x += sin(t * 5. + aP.w * 30.) * 1.2 * t;
  float r = (.7 + 2.6 * t) * (1. - smoothstep(.72, 1., t));
  vec4 mv = viewMatrix * vec4(c, 1.); mv.xy += position.xy * r;
  vUv = position.xy; vM = maskAt(bw); vT = t + aP.w; vDist = length(mv.xyz); vG = aP.xy;
  gl_Position = projectionMatrix * mv;
}`,rt=`
${P}
uniform vec3 uSnowLit; uniform vec3 uShade; uniform vec3 uNightSnow; uniform vec3 uSnowWarm;
varying vec2 vUv; varying vec2 vM; varying float vT; varying float vDist; varying vec2 vG;
void main() {
  float a = atan(vUv.y, abs(vUv.x) < 1e-4 ? 1e-4 : vUv.x);
  float edge = .86 + .12 * abs(sin(a * 3.5 + vT * 9.));
  if (length(vUv) > edge) discard;
  float s = dot(vUv, normalize(vec2(-.6, .8))) * .5 + .5 + (vn2(vUv * 2. + vT * 7.) - .5) * .3;
  vec3 day = mix(mix(uShade, uSnowLit, .3) * .72, mix(uSnowLit, uSnowWarm, .5) * .8, step(.45, s));
  vec3 ngt = mix(uNightSnow * 1.15, uNightSnow * 1.7, step(.45, s));
  gl_FragColor = vec4(hazed(mix(day, ngt, vM.x), vDist, vG), 1.);
}`,Gt=`
${P}
uniform mat4 uHead;
attribute vec4 aP; attribute float aT;        // aP: tine tip (elk axes, rest pose), seed
varying vec2 vUv; varying vec2 vM; varying float vT; varying float vDist; varying vec2 vG;
void main() {
  float t = fract(uTime * (.16 + .05 * aP.w) + aT + aP.w * 3.);
  vec3 wind = normalize(vec3(-1., -.1, .16 + .2 * (aP.w - .5)));
  vec3 c = (uHead * vec4(aP.xyz, 1.)).xyz + wind * (2. + t * (64. + 34. * aP.w));
  c.y += -t * t * 9. + sin(t * 9. + aP.w * 40. + uTime * .9) * 1.6 * t;
  c.z += sin(t * 6. + aP.w * 17. + uTime * .5) * 3.2 * t;
  // a stroke lying along the wind, turned to face the camera: long and thin, tapering away
  vec3 side = cross(wind, c - cameraPosition); side /= max(length(side), 1e-3);
  float wid = (.9 + 2.3 * t) * (1. - smoothstep(.55, 1., t)) * smoothstep(0., .05, t);
  float len = 5. + 9. * t;
  // blown snow is flown through: near the eye a stroke thins to nothing with its true distance from the lens, taken to the
  // middle line of its quad (the quad's nearest point, since it turns about that line to face the camera; the paint ends a
  // little short of the quad's ends, so off an end this errs toward thinning); 12 m and beyond is live's
  vec3 eye = cameraPosition - c; float eyeD = length(eye - wind * clamp(dot(eye, wind), -len, len));
  wid *= smoothstep(3., 12., eyeD);
  vec3 wp = c + wind * position.x * len + side * position.y * wid;
  vec4 mv = viewMatrix * vec4(wp, 1.);
  vUv = position.xy; vM = vec2(0.); vT = t * .4 + aP.w + aT; vDist = length(mv.xyz) * .25; vG = c.xz;
  gl_Position = projectionMatrix * mv;
}`,Wt=`
uniform float uTime; uniform float uPx; uniform float uBox; uniform float uSize; uniform float uScrollV;
attribute vec4 aS;
varying float vA; varying float vK;
void main() {
  vec3 p = position * uBox;
  p.y -= uTime * (2.2 + 2.8 * aS.x) * uSize;
  p.x += sin(uTime * (.4 + aS.y) + aS.z * 20.) * 4. - uTime * 6. - uScrollV;
  p.z += cos(uTime * (.3 + aS.z) + aS.x * 20.) * 4.;
  p = cameraPosition + mod(p - cameraPosition + uBox * .5, uBox) - uBox * .5;
  vec4 mv = viewMatrix * vec4(p, 1.);
  float d = max(-mv.z, 1.);
  float px = uSize * (.6 + .8 * aS.w) * uPx / d;
  gl_PointSize = clamp(px, 2., 15.);
  vA = clamp(px / 1.6, .3, 1.) * smoothstep(1.5, 5., d) * (1. - smoothstep(uBox * .38, uBox * .5, d));
  vK = aS.w + uTime * (1. + aS.x);
  gl_Position = projectionMatrix * mv;
}`,_t=`
uniform vec3 uCol; uniform float uTwinkle;
varying float vA; varying float vK;
void main() {
  vec2 q = gl_PointCoord - .5;
  float d = 1. - smoothstep(.3, .5, length(q));
  float tw = mix(1., .35 + .65 * step(.2, sin(vK * 3.)), uTwinkle);
  gl_FragColor = vec4(uCol, d * vA * tw);
}`,Vt=`
varying vec3 vW;
void main() { vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,It=`
${P}
uniform vec3 uFogCol; uniform vec3 uNightSnow; uniform vec3 uShade; uniform vec3 uSnowWarm; uniform float uLayer;
varying vec3 vW;
void main() {
  vec2 g = vW.xz + vec2(uScroll * .8 + uTime * 3., uLayer * 700.);
  float zc = mix(650., 300., smoothstep(-1750., -800., vW.x));
  float keep = smoothstep(240., 520., zc - vW.z) + smoothstep(-650., -350., vW.x);           // the elk's side only, never across the rail
  float n = vn2(g * .0016) * .6 + vn2(g * .0052 + 9.) * .3 + brush2(g * .004) * .2;
  if (n * clamp(keep, 0., 1.) < .5 + uLayer * .035) discard;
  float dist = length(vW - cameraPosition);
  vec2 m = maskAt(vW.xz);
  // billows as three flat tones, drifting with the sheet
  float tn = vn2(g * .0047 + uLayer * 3.) * .65 + brush2(g * .0023 + 5.) * .5;
  vec3 day = mix(mix(mix(uShade, uFogCol, .4) * .86, uFogCol, step(.46, tn)), mix(uFogCol, uSnowWarm, .45), step(.74, tn));
  vec3 ngt = mix(uNightSnow * 1.2, uNightSnow * 1.7, step(.5, tn));
  vec3 col = mix(day * (1. - uLayer * .04), ngt, m.x);
  gl_FragColor = vec4(hazed(col, dist, g), 1.);
}`,Ht=`
varying vec3 vW; varying float vH;
void main() { vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vH = uv.y; gl_Position = projectionMatrix * viewMatrix * w; }`,Ot=`
${P}
uniform vec3 uMount; uniform vec3 uSnowLit; uniform vec3 uSnowWarm; uniform float uLayer;
varying vec3 vW; varying float vH;
void main() {
  vec2 q = vec2(atan(vW.z + 300., abs(vW.x + 900.) < 1. ? 1. : vW.x + 900.) * 40., vW.y * .004);
  float br = brush2(q * vec2(.6, 1.2) + uLayer * 5.);
  float cap = step(.62 + (br - .5) * .5, vH + vW.y * .0005);
  vec2 dir = normalize(vW.xz + vec2(900., -300.));
  float lit = step(.2, dot(dir, -normalize(uSun.xz + 1e-4)) + (br - .5) * .8);
  vec3 col = mix(uMount, mix(uMount, uHaze, .5), uLayer);
  col = mix(col, mix(mix(uMount, uSnowLit, .55), mix(uSnowLit, uSnowWarm, .5) * .9, 1. - lit), cap);
  col = mix(col, uHaze, .12 + .3 * uLayer);
  gl_FragColor = vec4(col, 1.);
}`,jt=`
uniform float uTime; attribute float aW;
varying float vW2;
void main() {
  vec3 p = position;
  float flap = sin(uTime * 5.5 + instanceMatrix[3][0] * .1) * .7;
  p.y += abs(p.x) * flap * aW * .55; p.x *= 1. - aW * .12 * (1. - cos(flap));
  vW2 = aW;
  gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(p, 1.);
}`,Zt=`
uniform vec3 uCol; uniform vec3 uCol2; varying float vW2;
void main() { gl_FragColor = vec4(mix(uCol, uCol2, step(.82, vW2)), 1.); }`,Xt=`
uniform float uPass; uniform float uTime; uniform vec3 uSunW; uniform vec3 uGold;
varying vec3 vW; varying vec3 vN; varying vec3 vO; varying float vDepth;
float ch21(vec2 p) { vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float cvn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(ch21(i), ch21(i + vec2(1., 0.)), f.x), mix(ch21(i + vec2(0., 1.)), ch21(i + vec2(1., 1.)), f.x), f.y); }
void main() {
  if (uPass > 1.5) { gl_FragColor = vec4(0., 1., 0., 1.); return; }                      // meadow mask
  if (uPass > .5) {                                                                       // white-gold outline
    float s = dot(vN, uSunW) * .5 + .5;
    gl_FragColor = vec4(mix(uGold * .7, mix(uGold, vec3(1.), .5) * 1.02, step(.5, s)), 1.); return;
  }
  vec3 d = vW - cameraPosition; d /= max(length(d), 1e-4);
  float e = d.y;
  vec3 col = mix(vec3(.05, .27, .8), vec3(.012, .1, .56), smoothstep(-.25, .5, e + (cvn(d.xz * 7.) - .5) * .1));
  // cumulus: one per cell of view direction, three bumps on a flat base
  vec2 p = vec2(atan(d.z, abs(d.x) < 1e-5 ? 1e-5 : d.x) + uTime * .004, e * 1.15) / vec2(.15, .1);
  vec2 id = floor(p), q = fract(p) - .5;
  float hk = ch21(id + 3.), hx = ch21(id + 17.), hs = .75 + .5 * ch21(id + 31.);
  q = (q - vec2((hx - .5) * .3, 0.)) / hs;
  float bumps = max(max(step(length(q - vec2(-.2, -.04)), .15), step(length(q - vec2(.02, .04)), .21)), step(length(q - vec2(.22, -.05)), .14));
  bumps = max(bumps, step(abs(q.x), .3) * step(q.y, 0.));
  float cloud = bumps * step(-.17, q.y) * step(hk, .72);
  float under = step(q.y, -.09 + .03 * sin(q.x * 14.));
  col = mix(col, mix(vec3(.93, .93, .9), vec3(.55, .6, .86), under), cloud);
  col *= .96 + .08 * ch21(floor(gl_FragCoord.xy * .5));
  gl_FragColor = vec4(col, 1.);
}`,C=(p,a=1)=>new t.Color(p).multiplyScalar(a);function he(p,a,f,s){const h=new t.InstancedBufferGeometry;h.index=p.index;for(const c in p.attributes)h.setAttribute(c,p.attributes[c]);return h.setAttribute(a,new t.InstancedBufferAttribute(f,s)),h.instanceCount=f.length/s,h}var Jt={id:"sun-in-the-antlers",name:"The Elk Who Carries the Sun",category:"bizarre",weirdness:.85,media:["air","snow"],async build(p){const a=p.rng,f=p.vary||{},s=p.quality?.detail??1,h=be(f.density??1,.7,1.3),c=p.renderer,i=[];let n=a.pick(["dawn","blue","lemon","dawn"]);f.hour==="dawn"||f.hour==="golden"?n="dawn":f.hour==="night"?n="blue":f.hour==="day"&&(n="lemon");const e=Mt[n],l=a.pick(["milkyway","comet","moon","aurora"]),m=a.pick(["clear","flakes","fog"]),x=a.chance(.45),z=a.pick(["cranes","swans","ravens"]),K=!!f.rare,N={cranes:null,swans:["#ECE9E0","#AAB5EA","#1C2350","#F2B02C"],ravens:["#1A1D30","#4A5296","#0C0E1C","#1A1D30"]}[z],L=[-100,0,760],de=.475,T=new t.Scene;T.fog=new t.FogExp2(new t.Color(e.haze),16e-5);const te=.339,oe=.307,I=new t.Vector3(Math.cos(te)*Math.cos(oe),Math.sin(te),-Math.cos(te)*Math.sin(oe)),F=[e.snowLit,e.sky[0],"#0B1033",e.ice,e.gold,e.spruce,e.apricot],A=await bt(p,{palette:F,detail:s,shadow:!1,night:l,fogK:.5,sunDir:I.toArray(),phase0:de,craneColors:N,birdKind:z,cobalt:e.cobalt,craneScale:z==="swans"?1.9:1.7,boneShade:C(e.bone,.7),sunColors:e.sunCols});A.object.rotation.y=Math.PI/2,T.add(A.object);const D=A.anchorsElk;await p.yield();const H=new t.WebGLRenderTarget(1024,512,{depthBuffer:!1,generateMipmaps:!1,minFilter:t.LinearFilter,magFilter:t.LinearFilter}),ae=new t.Scene;ae.add(A.shadow);const U=new t.OrthographicCamera(-B.w/2,B.w/2,B.d/2,-B.d/2,1,4e3);U.position.set(B.x0+B.w/2,2500,B.z0+B.d/2),U.up.set(0,0,-1),U.lookAt(B.x0+B.w/2,0,B.z0+B.d/2),U.updateMatrixWorld(!0),i.push(H,A.shadowMat);const W={uScroll:{value:0},uTime:{value:0},uMask:{value:H.texture},uMaskRect:{value:new t.Vector4(B.x0,B.z0+B.d,1/B.w,-1/B.d)},uSun:{value:I.clone()},uHaze:{value:C(e.shade,.86).lerp(C(e.haze),.3)},uHazeK:{value:1/7e3},uDensity:{value:.92*h},uSnowLit:{value:C(e.snowLit)},uSnowWarm:{value:C(e.snowWarm)},uShade:{value:C(e.shade)},uSpruce:{value:C(e.spruce)},uSpruceLit:{value:C(e.spruceLit)},uNightSnow:{value:C(e.nightSnow)},uNightTree:{value:C(e.nightTree)},uIce:{value:C(e.ice)},uApricot:{value:C(e.apricot)},uGold:{value:C(e.gold)}},_=(o,r,v={},d={})=>new t.ShaderMaterial({uniforms:{...W,...v},vertexShader:o,fragmentShader:r,...d}),Ee={uBand:{value:e.sky.map(o=>C(o,.92))},uTwilight:{value:C(e.twilight)},uTwi:{value:0},uSunAz:{value:new t.Vector2(I.x,I.z).normalize()},uCloud:{value:a.range(0,.5)}},fe=new t.Mesh(new t.SphereGeometry(12500,40,24),_(kt,Ft,Ee,{side:t.BackSide,depthWrite:!1,depthTest:!1}));fe.renderOrder=-1,fe.frustumCulled=!1,T.add(fe);const Se=p.noise;for(let o=0;o<2;o++){const r=o?8600:10800,v=220,d=[],b=[],M=[];for(let g=0;g<=v;g++){const w=g/v*ee,y=Math.cos(w),k=Math.sin(w),E=Se.ridged2?Se.ridged2(y*3.1+o*9,k*3.1,4):Math.abs(Se.fbm2(y*3.1+o*9,k*3.1,4)),q=(o?380:820)*(.35+.65*be(E,0,1))*(.75+.25*Math.sin(w*3+o));d.push(-900+y*r,-260,300+k*r,-900+y*r,q,300+k*r),b.push(g/v,0,g/v,q/820),g<v&&M.push(g*2,g*2+1,g*2+2,g*2+1,g*2+3,g*2+2)}const S=new t.BufferGeometry;S.setAttribute("position",new t.Float32BufferAttribute(d,3)),S.setAttribute("uv",new t.Float32BufferAttribute(b,2)),S.setIndex(M);const u=new t.Mesh(S,_(Ht,Ot,{uMount:{value:C(e.mount,.8)},uLayer:{value:o}},{side:t.DoubleSide}));u.frustumCulled=!1,T.add(u)}const qe={value:[0,1,2,3].map(()=>new t.Vector4(0,0,0,0))},Re={value:[0,1,2].map(()=>new t.Vector4(0,0,1,0))},me={value:[new t.Vector4(0,0,0,1),new t.Vector4(0,0,0,1)]};{const v=new Float32Array(98301),d=[];let b=0;for(let u=0;u<=150;u++)for(let g=0;g<=216;g++){const w=g/216*2-1,y=u/150*2-1;v[b++]=-1150+1500*w+10800*Math.pow(w,7),v[b++]=0,v[b++]=380+1e3*y+11e3*Math.pow(y,7)}for(let u=0;u<150;u++)for(let g=0;g<216;g++){const w=u*217+g,y=w+1,k=w+216+1,E=k+1;d.push(w,k,y,y,k,E)}const M=new t.BufferGeometry;M.setAttribute("position",new t.BufferAttribute(v,3)),M.setIndex(d);const S=new t.Mesh(M,_(Tt,Bt,{uPrint:qe,uShake:me,uCab:Re,uForest:{value:C(e.forest)},uCobalt:{value:C(e.cobalt,.62)}}));S.frustumCulled=!1,T.add(S)}await p.yield();const ge=a.fork?a.fork("flora"):a,ze=(o,r,v,d,b,M)=>{const S=new Float32Array(r*r*2);for(let g=0,w=0;g<r;g++)for(let y=0;y<r;y++)S[w++]=y,S[w++]=g;const u=new t.Mesh(he(o,"aCell",S,2),_(nt,st,{uN:{value:r},uRing:{value:new t.Vector2(d,b)},uCellK:{value:v},uScale:{value:M},uShake:me}));return u.frustumCulled=!1,T.add(u),u},De=18,Ke=2*Math.round(24*Math.sqrt(s)),Ge=2*Math.round(36*Math.sqrt(s)),We=De*j/2-2,_e=Ke*j/2-2;ze(Le(5,8,!0,ge),De,1,-100,We,1),ze(Le(3,6,!1,ge),Ke,1,We,_e,1),ze(Le(1,3,!1,ge),Ge,3,_e,Ge*j*3/2-20,1.45),await p.yield();{const r=new Float32Array(520);for(let d=0,b=0;d<130;d++)for(const M of[-1,1])r[b++]=d,r[b++]=M;const v=new t.Mesh(he(Pt(ge),"aCell",r,2),_(nt,st,{uN:{value:130},uRing:{value:new t.Vector2(0,1)},uCellK:{value:1},uScale:{value:1},uShake:me},{defines:{RIVERSIDE:1},side:t.DoubleSide}));v.frustumCulled=!1,T.add(v)}const $=new Nt,G=a.fork?a.fork("built"):a,Me=[],ie=(o,r,v)=>ve(o)+r*v,ne=(o,r,v,d=1.1,b)=>{const M=(ve(o+5)-ve(o-5))/10,S=-Math.atan(M)+G.range(-.25,.25)+(G.chance(.3)?Math.PI/2:0),u=G.range(.95,1.15);Me.push($.cabin(o,ie(o,r,v),b??S,b===void 0?d*u:d,G))};if([[-2222,78,2.05],[-2190,46,1.2],[-2142,92,2.3]].forEach(([o,r,v],d)=>{ne(o,-1,r,1.5,v),Re.value[d].set(o,ie(o,-1,r),Math.cos(v),Math.sin(v))}),ne(-2075,-1,52),$.hayRack(-2168,ie(-2168,-1,66),.5,1.5),$.hayRack(-1960,ie(-1960,1,66),-.3),$.bridge(-1840,ve(-1840),96),x){$.church(-1915,ie(-1915,1,86),.2);for(const[o,r,v]of[[-2010,1,64],[-1975,1,96],[-1880,-1,60],[-1790,1,62],[-1760,-1,70],[-1820,1,100],[-1700,1,66]])ne(o,r,v,1);for(let o=0;o<4;o++)ne(-1500+o*420+G.range(-60,60),o%2?1:-1,G.range(56,80))}else for(let o=0;o<11;o++)ne(-1880+o*250+G.range(-70,70),G.chance(.5)?1:-1,G.range(56,84));const Ve=new t.Mesh($.geometry(),_(Lt,Et,{},{side:t.DoubleSide}));Ve.frustumCulled=!1,T.add(Ve);{const r=Me.length*8,v=new Float32Array(r*4),d=new Float32Array(r);Me.forEach((S,u)=>{const g=G();for(let w=0;w<8;w++)v.set([S.gx,S.gz,S.top,g],(u*8+w)*4),d[u*8+w]=w/8});const b=he(new t.PlaneGeometry(2,2),"aP",v,4);b.setAttribute("aT",new t.InstancedBufferAttribute(d,1));const M=new t.Mesh(b,_(Kt,rt));M.frustumCulled=!1,T.add(M)}{const o=[...A.antlers.right.tines,...A.antlers.left.tines.filter((u,g)=>g%2===0)].map(u=>u.pts[u.pts.length-1]),r=Math.max(14,Math.round(24*s)),v=o.length*r,d=new Float32Array(v*4),b=new Float32Array(v);o.forEach((u,g)=>{const w=G();for(let y=0;y<r;y++)d.set([u.x,u.y,u.z,w],(g*r+y)*4),b[g*r+y]=y/r});const M=he(new t.PlaneGeometry(2,2),"aP",d,4);M.setAttribute("aT",new t.InstancedBufferAttribute(b,1));const S=new t.Mesh(M,_(Gt,rt,{uHead:{value:A.uniforms.uSeg.value[3]}}));S.material.side=t.DoubleSide,S.frustumCulled=!1,S.renderOrder=2,T.add(S)}await p.yield();const Ie=Math.round(160*(s<.8?.6:1)),He={value:new t.Vector4(-1700,0,1,0)};{const o=a.fork?a.fork("herd"):a,r=new Float32Array(Ie*4);for(let d=0;d<Ie;d++){const b=o.range(-1,1);r.set([b*200,o.gauss()*9*(1-.5*Math.abs(b)),o(),o.range(-.6,.6)],d*4),r[d*4+1]=be(r[d*4+1],-24,24)}const v=new t.Mesh(he(Dt(),"aI",r,4),_(qt,Rt,{uHerd:He},{side:t.DoubleSide}));v.frustumCulled=!1,T.add(v)}const Oe=[],je=(o,r,v,d,b)=>{const M=new Float32Array(o*3),S=new Float32Array(o*4),u=a.fork?a.fork("flakes"+r):a;for(let k=0;k<o;k++)M.set([u(),u(),u()],k*3),S.set([u(),u(),u(),u()],k*4);const g=new t.BufferGeometry;g.setAttribute("position",new t.BufferAttribute(M,3)),g.setAttribute("aS",new t.BufferAttribute(S,4));const w=new t.ShaderMaterial({uniforms:{uTime:W.uTime,uPx:{value:500},uBox:{value:r},uSize:{value:v},uScrollV:{value:0},uCol:{value:d},uTwinkle:{value:b}},vertexShader:Wt,fragmentShader:_t,transparent:!0,depthWrite:!1}),y=new t.Points(g,w);y.frustumCulled=!1,y.renderOrder=4,T.add(y),Oe.push(w)};if(je(Math.round(3400*s),220,.3,C(e.snowLit,1.15),1),m==="flakes"&&je(Math.round(2600*s),190,.5,C(e.snowLit,.95),0),m==="fog"){const o=new t.PlaneGeometry(13e3,13e3);o.rotateX(-Math.PI/2);for(let r=0;r<3;r++){const v=new t.Mesh(o,_(Vt,It,{uFogCol:{value:C(e.snowLit,.8).lerp(C(e.haze),.35)},uLayer:{value:r}},{side:t.DoubleSide}));v.position.set(-900,70+r*45,300),v.frustumCulled=!1,T.add(v)}}await p.yield();const pe=D.flyThrough,Ae=D.portalSeat.position,Ce=o=>D.gate.clone().addScaledVector(D.portalSeat.facing,-o).toArray(),lt=[[-2450,30,700],[-2390,30,685],[-2250,30,656],[-2090,26,664],[-1930,16,690],[-1790,14,690],[-1650,15,688],[-1480,36,640],[-1250,88,505],[-1010,150,350],[-800,215,290],[-690,330,385],[-560,450,470],[-470,600,540],[-360,760,560],[-270,930,500],[-250,1090,380],[-310,1230,230],[-410,1325,90],Ce(780),Ce(520),Ce(260),pe[3].toArray(),pe[4].toArray(),pe[4].clone().lerp(Ae,.33).toArray(),pe[4].clone().lerp(Ae,.66).toArray(),Ae.toArray()],Z=yt(lt),V=Z.length/3747,ct=Z.length-D.straightLength;A.earU=.8*V;const ut=D.hocks[1],ke=new t.Vector3(-735,285,255).lerp(ut,.05),xe=new t.BufferGeometry;{const o=[],r=[],v=[],d=(y,k,E,q)=>(o.push(y,k,E),r.push(q),o.length/3-1),b=d(0,0,1.1,0),M=d(.24,0,0,0),S=d(0,0,-.9,0),u=d(-.24,0,0,0),g=d(.3,0,-1.45,0),w=d(-.3,0,-1.45,0);v.push(b,M,u,M,S,u,S,g,w);for(const y of[1,-1]){const k=d(y*.15,0,.4,0),E=d(y*.15,0,-.35,0),q=d(y*1.2,0,.3,.5),Q=d(y*1.2,0,-.45,.5),X=d(y*2.2,0,-.1,1),le=d(y*2,0,-.6,1);v.push(k,q,E,E,q,Q,q,X,Q,Q,X,le)}xe.setAttribute("position",new t.Float32BufferAttribute(o,3)),xe.setAttribute("aW",new t.Float32BufferAttribute(r,1)),xe.setIndex(v)}const we=new t.InstancedMesh(xe,new t.ShaderMaterial({uniforms:{uTime:W.uTime,uCol:{value:C("#161A30")},uCol2:{value:C("#3A4270")}},vertexShader:jt,fragmentShader:Zt,side:t.DoubleSide}),2);we.frustumCulled=!1,T.add(we);const se=new t.Object3D;let Y=null;if(K){const o=Array.from({length:A.segCount},()=>new t.Matrix4),r={uSeg:{value:o},uRim:{value:3.2},uPxK:{value:.004},uSunW:{value:I.clone()},uGroundW:{value:.6},uTime:W.uTime,uGold:W.uGold},v=(y,k)=>new t.ShaderMaterial({uniforms:{...r,uPass:{value:y}},vertexShader:zt,fragmentShader:Xt,side:k}),d=new t.Group,b=.372;d.position.set(L[0],L[1],L[2]),d.scale.setScalar(b);const M=new t.Mesh(A.elkGeo,v(0,t.FrontSide)),S=new t.Mesh(A.elkGeo,v(1,t.BackSide));M.renderOrder=1,S.renderOrder=2;const u=v(2,t.DoubleSide);u.uniforms.uSunW={value:new t.Vector3(.3,.74,.6).normalize()};const g=new t.Mesh(A.elkGeo,u),w=new t.Group;w.position.copy(d.position),w.scale.copy(d.scale),w.add(g),ae.add(w);for(const y of[M,S,g])y.frustumCulled=!1;d.add(M,S),T.add(d),i.push(g.material),Y={segs:o,cu:r,K:b,hoofs:Array.from({length:4},()=>({x:0,y:0,z:0,down:1,c:0}))}}const Fe=new t.Vector3,Ze=new t.Vector3,Te=new t.Vector3,Xe=new t.Vector3,Ue=new t.Vector3,Be=(o,r,v,d,b,M,S,u)=>{Fe.set(r,v,d),Ze.set(b,M,S),Ue.subVectors(Ze,Fe);let g=1e9;for(let w=0;w<=6;w++){Te.copy(Fe).addScaledVector(Ue,w/6).sub(o);const y=Math.max(0,Te.dot(I));Xe.copy(I).multiplyScalar(y).sub(Te),g=Math.min(g,Xe.length())}return 1-R(u*.8,u*1.25,g)},vt=o=>{let r=Math.max(Be(o,-800,690,0,20,730,0,190),Be(o,60,800,0,560,930,0,95));for(let v=0;v<4;v++){const d=A.hoof(v),b=v%2===0;r=Math.max(r,Be(o,d.pos.z,40+d.pos.y,-d.pos.x,b?-715:8,640,-d.pos.x,46))}return r},ht=Z.endTangent.clone().normalize(),ye={value:300};{const r=new t.TorusGeometry(15.2,2.3,10,64),v=[],d=[],b=[],M=a.fork?a.fork("ring"):a;for(let ce=0;ce<72;ce++){const tt=ce%12===6,ot=ce%4===0,O=ce/72*ee+M.range(-.03,.03),Pe=M.range(3.5,7)*(ot?1.75:1)*(tt?2.6:1),J=(.05+(ot?.02:0))*(tt?.6:1),Ne=v.length/3,at=M.range(-1.5,1.5);v.push(Math.cos(O-J)*(15.2+1.2),Math.sin(O-J)*(15.2+1.2),0,Math.cos(O+J)*(15.2+1.2),Math.sin(O+J)*(15.2+1.2),0,Math.cos(O)*(15.2+2+Pe),Math.sin(O)*(15.2+2+Pe),at),d.push(O,-J,15.2+1.2,0,O,J,15.2+1.2,0,O,0,15.2+2+Pe,at),b.push(Ne,Ne+1,Ne+2)}const S=new t.BufferGeometry;S.setAttribute("position",new t.Float32BufferAttribute(v,3)),S.setAttribute("aBl",new t.Float32BufferAttribute(d,4)),S.setIndex(b);const u=`uniform vec3 uSun; uniform vec3 uA; uniform vec3 uB; uniform vec3 uC; varying vec3 vN; varying vec3 vP;
          float h(vec2 p) { vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
          void main() { float s = abs(dot(vN, uSun)) * .6 + .34 + (h(floor(vP.xy * 1.2)) - .5) * .34;
            gl_FragColor = vec4(mix(mix(uA, uB, step(.42, s)), uC, step(.66, s)), 1.); }`,g={uSun:W.uSun,uA:{value:C(e.ice,.8)},uB:{value:C(e.snowLit,.98)},uC:{value:C("#FFFFFF",1.22)},uDist:ye},w=new t.ShaderMaterial({uniforms:g,vertexShader:"varying vec3 vN; varying vec3 vP; void main() { vN = normalize(mat3(modelMatrix) * normal + vec3(0., 1e-5, 0.)); vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:u,side:t.DoubleSide}),y=new t.ShaderMaterial({uniforms:g,vertexShader:`attribute vec4 aBl; uniform float uDist; varying vec3 vN; varying vec3 vP;
          void main() {
            float boost = 1. - smoothstep(1150., 1500., uDist);
            float kL = mix(1., max(1., uDist * .065 / 27.), boost), kW = mix(1., clamp(uDist / 170., 1., 5.), boost);
            float ang = aBl.x + aBl.y * kW, rad = ${15.2.toFixed(1)} + (aBl.z - ${15.2.toFixed(1)}) * kL;
            vec3 p = vec3(cos(ang) * rad, sin(ang) * rad, aBl.w);
            vN = normalize(mat3(modelMatrix) * vec3(.3 * cos(ang), .3 * sin(ang), 1.));
            vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.); }`,fragmentShader:u,side:t.DoubleSide}),k=new t.ShaderMaterial({uniforms:{uCol:{value:C(e.ice,1).lerp(C("#FFFFFF"),.4)},uTime:W.uTime,uDist:ye,uThru:{value:0}},vertexShader:"varying vec2 vP; void main() { vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`uniform vec3 uCol; uniform float uTime; uniform float uDist; uniform float uThru; varying vec2 vP;
          float h(vec2 p) { vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
          float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(h(i), h(i + vec2(1., 0.)), f.x), mix(h(i + vec2(0., 1.)), h(i + vec2(1., 1.)), f.x), f.y); }
          void main() { float r0 = length(vP), a = atan(vP.y, abs(vP.x) < 1e-4 ? 1e-4 : vP.x);
            float boost = 1. - smoothstep(1150., 1500., uDist);          // from further off it is its true size: no second light in the antlers
            float kh = mix(1., max(1., uDist * .065 / 27.), boost), far = smoothstep(200., 620., uDist) * boost, r = r0 / kh;
            float tear = vn(vec2(a * 3.5, r * .08 + uTime * .05)) - .5;
            float g = (1. - step(27. + tear * 6., r)) * (.2 + .3 * far) + (1. - step(39. + tear * 11., r)) * (.1 + .1 * far);
            g *= mix(1., .55 * smoothstep(240., 430., uDist) * (1. - smoothstep(640., 760., uDist)), uThru);   // the far glare, see below
            gl_FragColor = vec4(uCol * g * step(12.5, r0), 1.); }`,transparent:!0,blending:t.AdditiveBlending,depthWrite:!1,side:t.DoubleSide}),E=new t.Group,q=new t.Mesh(new t.PlaneGeometry(300,300),k);q.position.z=-1.5,q.renderOrder=3;const Q=new t.Mesh(S,y);Q.frustumCulled=!1;const X=k.clone();X.uniforms.uTime=W.uTime,X.uniforms.uDist=ye,X.uniforms.uThru={value:1},X.depthTest=!1;const le=new t.Mesh(q.geometry,X);le.position.z=-1.5,le.renderOrder=6,E.add(new t.Mesh(r,w),Q,q,le),E.position.copy(Z.end),E.lookAt(Z.end.clone().add(ht)),T.add(E)}const $e=new t.Vector2,Ye=new t.Color,re=new t.Vector3,dt=()=>{const o=c.getRenderTarget(),r=c.getClearAlpha(),v=c.autoClear;c.getClearColor(Ye),A.uniforms.uMask.value=1,c.setRenderTarget(H),c.setClearColor(0,0),c.autoClear=!0,c.clear(),c.render(ae,U),A.uniforms.uMask.value=0,c.setRenderTarget(o),c.setClearColor(Ye,r),c.autoClear=v};{const o=c.getRenderTarget();c.setRenderTarget(H);const r=c.compileAsync?c.compileAsync(ae,U):null;c.setRenderTarget(o),await p.yield(),r&&await r,await p.yield()}let Qe=0;const ft=new t.Vector3,mt=new t.Vector3(350,1e3,60),gt=new t.Vector3,pt=new t.Vector3,xt=new t.Vector3(900,1150,-60),Je=o=>-1750+(o-.15)*(o<.15?2600:2400),et=[0,1,2,3];function wt(o,r,v,d){const b=d*V,M=1800*b;W.uScroll.value=M,W.uTime.value=r,A.craneClock=d*Z.length-ct,A.setProgress(b),A.update(o,r,v),c.getDrawingBufferSize($e);const S=v.projectionMatrix.elements[5]*Math.max($e.y,1);Y&&(St(Y.segs,Y.hoofs,(5*b+de)/Y.K,r,0),Y.cu.uPxK.value=5/Math.max(.001,S)),(s>=.8||Qe%2===0)&&dt(),Qe++,re.setFromMatrixPosition(v.matrixWorld),fe.position.copy(re),Ee.uTwi.value=vt(re)*(1-R(70,210,re.y)),ye.value=Math.min(6e3,re.distanceTo(Z.end)),et.sort((u,g)=>A.hoof(u).cycle-A.hoof(g).cycle);for(let u=0;u<4;u++){const g=A.hoof(u),w=u%2===0?-593:139;qe.value[u].set(w+M-g.cycle*360,-g.pos.x,0,1)}for(let u=0;u<2;u++){const g=et[u],w=A.hoof(g),y=w.cycle,k=g%2===0?-593:139;me.value[u].set(k-y*360,-w.pos.x,R(0,.035,y)*(1-R(.34,.5,y)),215)}He.value.set(Je(b),r,1,r);for(let u=0;u<2;u++){const g=r*.42+u*Math.PI,w=30+6*Math.sin(r*.3+u);se.position.set(ke.x+Math.cos(g)*w,ke.y+Math.sin(g*.5+u)*7,ke.z+Math.sin(g)*w*.8),se.rotation.set(0,-g,-.5,"YXZ"),se.scale.setScalar(1.5),se.updateMatrix(),we.setMatrixAt(u,se.matrix)}we.instanceMatrix.needsUpdate=!0;for(const u of Oe)u.uniforms.uPx.value=S*.5,u.uniforms.uScrollV.value=M}return{scene:T,path:Z,duration:50,title:"The Elk Who Carries the Sun",camera:{fov:62,near:1.5,far:14e3,lookAhead:45,sway:.2,bank:.6},pois:[{at:[-420,430,0],from:0,to:.13/V,weight:.3},{at:(o,r)=>gt.set(Je(r*V)+30,0,690),from:.11/V,to:.25/V,weight:.4},{at:[-640,60,110],from:.3/V,to:.52/V,weight:.72},{at:(o,r)=>ft.set(-150,330,-60).lerp(mt,R(.52,.76,r*V)),from:.43/V,to:.56,weight:.6},...K?[{at:[L[0]+40,70,L[2]-170],from:.385,to:.475,weight:.9,fade:.25}]:[],{at:(o,r)=>pt.set(420,1130,30).lerp(xt,R(.64,.76,r)),from:.46,to:.87,weight:.85,fade:.14}],portal:{shape:"circle",radius:12,tilt:!0,color:"#DCE8FF",glow:1,revealDistance:1500},post:{exposure:e.exposure,bloom:{strength:.35,radius:.6,threshold:.92},grade:{saturation:1.05,contrast:1.03,tint:"#ffffff",shadowTint:"#0b1033",vignette:.26,grain:.03,aberration:0}},ride:"none",style:"none",companion:"none",update:wt,dispose(){ae.traverse(o=>{o.geometry&&o.geometry.dispose(),o.material&&o.material.dispose()});for(const o of i)o.dispose();A.dispose()}}}};export{Jt as default};
