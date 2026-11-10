import*as h from"three";const M=o=>{const e=new h.Color(o);return[e.r,e.g,e.b]},w={cream:M("#F1E6C8"),russet:M("#B5532A"),sage:M("#8FA57A"),sky:M("#8CC0E4"),vermilion:M("#D8402A"),brass:M("#C9A24A"),steel:M("#2D3F5E"),nickel:M("#D9DEE2"),umber:M("#6E4A2C"),ochre:M("#E3B24F"),green:M("#4E6B45"),black:M("#1B1A19"),white:M("#F7F3E6"),pink:M("#E7B49C"),apple:M("#A8322A"),tin:M("#C9CCCB"),blue:M("#5E8FC4"),plum:M("#6B4A5A"),straw:M("#E9D79A")},S={enamel:0,brick:1,crate:2,hill:3,leaf:4,tin:5,brass:6,steel:7,nickel:8,cloud:9,matt:10,stripe:11,roof:12,apples:13,lid:14},N=(o,e,s)=>[o[0]+(e[0]-o[0])*s,o[1]+(e[1]-o[1])*s,o[2]+(e[2]-o[2])*s],ue=(o,e,s)=>{const a=Math.min(1,Math.max(0,(s-o)/(e-o)));return a*a*(3-2*a)},te=o=>o-Math.floor(o),$=(o,e)=>te(Math.sin(o*127.1+e*311.7)*43758.5453),he=(o,e)=>{const s=Math.floor(o),a=Math.floor(e),c=o-s,i=e-a,l=c*c*(3-2*c),u=i*i*(3-2*i);return($(s,a)*(1-l)+$(s+1,a)*l)*(1-u)+($(s,a+1)*(1-l)+$(s+1,a+1)*l)*u},oe=.449,D=`
uniform float uT; uniform vec3 uSun, uSunC, uSkyC, uGndC, uHazeC, uZen, uMid, uHor, uHaze; uniform vec4 uOrch; uniform float uWall;
uniform vec3 uCream, uRusset, uSage, uSky, uVermilion, uBrass, uSteel, uNickel, uUmber, uOchre, uGreen, uApple, uTin, uStraw;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y); }
vec3 skyc(vec3 d) { vec3 c = mix(uHor, uMid, smoothstep(-.02, .22, d.y)); return mix(c, uZen, smoothstep(.15, .85, d.y)); }
// what a mirror sees: the sky above, the tray's warm tone below
vec3 envc(vec3 r) { return mix(uGndC, skyc(vec3(r.x, abs(r.y), r.z)), smoothstep(-.08, .06, r.y)); }
vec3 hazed(vec3 c, float far) { return mix(c, uHazeC, uHaze.z * (1. - exp(-far / uHaze.x))); }
// what a cam lifts: r.x the cam's place in its turn, r.y how far it lifts (metres), r.z 0 a follower (up and down),
// 1 the cam itself (its middle goes round the shaft)
vec3 ride(vec3 r) { float a = r.x + uT * ${oe.toFixed(3)}; return r.z > .5 ? r.y * vec3(cos(a), sin(a), 0.) : vec3(0., r.y * (.5 + .5 * sin(a)), 0.); }
// is the place p cut off from the sun by the orchard's west or south wall (1 lit, 0 in shade)
float wallShade(vec3 p) { float s = 1.;
  if (p.x < uOrch.y) { float t = (uOrch.y - p.x) / uSun.x, z = p.z + t * uSun.z; if (z > uOrch.z && z < uOrch.w) s = min(s, smoothstep(-1., 1., p.y + t * uSun.y - uWall)); }
  if (p.z > uOrch.z) { float t = (uOrch.z - p.z) / uSun.z, x = p.x + t * uSun.x; if (x > uOrch.x && x < uOrch.y) s = min(s, smoothstep(-1., 1., p.y + t * uSun.y - uWall)); }
  return s; }
`,se=`
attribute vec3 aCol; attribute vec4 aP; attribute vec3 aR;
varying vec3 vW, vN, vCol; varying vec4 vP;
${D}
void main() { vec4 lp = vec4(position, 1.); vec3 n = normal;
#ifdef USE_INSTANCING
  lp = instanceMatrix * lp; n = mat3(instanceMatrix) * n;
#endif
  vec4 w = modelMatrix * lp; w.xyz += ride(aR); vCol = aCol;
#ifdef USE_INSTANCING_COLOR
  vCol *= instanceColor;
#endif
  vW = w.xyz; vN = normalize(mat3(modelMatrix) * n); vP = aP; gl_Position = projectionMatrix * viewMatrix * w; }`,ae=`
varying vec3 vW, vN, vCol; varying vec4 vP;
${D}
// one layer of round brush dabs on a shaken grid S across: its cover, the dab's own number h, and how far up the dab we are (v)
float dabs(vec2 p, float S, float rr, float w, out float h, out float v) { vec2 q = p / S, id = floor(q), f = fract(q) - .5; h = hash(id);
  vec2 o = (vec2(hash(id + 3.1), hash(id + 7.7)) - .5) * .46; float r = rr * (.62 + .5 * hash(id + 1.3)); v = (f.y - o.y) / r;
  return 1. - smoothstep(-w / S, w / S, length(f - o) - r); }
void main() { vec3 n = normalize(vN);
  float far = length(cameraPosition - vW), k = vP.x; vec2 uv = vP.yz; float w = max(max(length(dFdx(uv)), length(dFdy(uv))), 1e-5);
  vec3 col = vCol; float gloss = .55, metal = 0.;
  if (k < .5) { }                                                   // plain enamel, the colour at its corners
  else if (k < 1.5) {                                               // brick: russet courses painted on cream, 6 by 2.4 m
    float row = floor(uv.y / 2.4), fy = abs(fract(uv.y / 2.4) - .5) * 2.4, fx = abs(fract(uv.x / 6. + .5 * mod(row, 2.)) - .5) * 6.;
    float l = max(1. - smoothstep(.16, .16 + w, 1.2 - fy), 1. - smoothstep(.16, .16 + w, 3. - fx));
    l = mix(l, .2, smoothstep(.5, 2.2, w)); col = mix(col, uRusset, l * .8); col *= .94 + .1 * hash(vec2(row, floor(uv.x / 6. + .5 * mod(row, 2.)))) * (1. - smoothstep(1., 4., w)); }
  else if (k < 2.5) {                                               // a crate's side: five slats, corner posts, apples in the gaps
    float fy = fract(uv.y * 5.), gap = 1. - smoothstep(.1, .1 + 5. * w, min(fy, 1. - fy)), post = 1. - smoothstep(.1, .1 + w, min(uv.x, 1. - uv.x));
    float hh, vv; float ap = dabs(uv * vec2(1., 1.) + .13, .2, .36, w, hh, vv);
    vec3 inner = mix(uUmber * .35, uApple * (.8 + .5 * vv * .5), ap * step(.3, hh)); gap *= (1. - post);
    gap = mix(gap, .2, smoothstep(.04, .12, w)); col = mix(col, inner, gap); col = mix(col, vCol * .82, post * .5);
    col *= .95 + .08 * hash(vec2(floor(uv.y * 5.), vP.w)); }
  else if (k < 3.5) {                                               // a hill flat: woods in dabs, fields low down (uv metres, vP.w its height)
    float H = vP.w, lo = 1. - smoothstep(.05 * H, .18 * H, uv.y + 6. * sin(uv.x / 47.));
    col *= .9 + .2 * noise(uv / 60.);
    vec3 fld = mix(uStraw, mix(uSage, uOchre, hash(vec2(floor(uv.x / 52.), 3.))), step(.45, hash(vec2(floor(uv.x / 52.), 9.))));
    float fl = (1. - smoothstep(.3, .3 + w, abs(fract(uv.x / 52.) - .5) * 52. - 24.)); col = mix(col, mix(fld, uGreen, 1. - fl), lo * .8);
    float h1, v1, h2, v2; float d1 = dabs(uv, 16., .44, w, h1, v1) * step(.4, h1) * (1. - lo * .85), d2 = dabs(uv + 37., 9., .4, w, h2, v2) * step(.55, h2) * (1. - lo * .6);
    vec3 t1 = h1 < .55 ? uRusset : h1 < .7 ? uOchre : h1 < .86 ? uSage : uGreen, t2 = h2 < .7 ? uOchre : h2 < .85 ? uRusset : uGreen;
    t1 *= .78 + .34 * smoothstep(-.9, .7, v1); t2 *= .8 + .3 * smoothstep(-.9, .7, v2);
    vec3 mean = mix(mix(col, (uRusset + uOchre + uSage) / 3., .3), (uOchre + uRusset) / 2., .2);
    vec3 fine = mix(mix(col, t1, d1), t2, d2); col = mix(fine, mean, smoothstep(3., 10., w));
    col = mix(col, vCol, .25 * smoothstep(.3, .9, vP.w / 300.)); gloss = .5; }
  else if (k < 4.5) {                                               // a crown of leaves: dabs of the tree's own tones (uv metres)
    float h1, v1; float d1 = dabs(uv, 5.2, .5, w, h1, v1); vec3 t1 = (h1 < .4 ? uOchre : h1 < .7 ? vCol * 1.25 : uRusset) * (.75 + .4 * smoothstep(-.9, .7, v1));
    col = mix(mix(col * .8, t1, d1), mix(col * .8, (uOchre + vCol + uRusset) / 3., .7), smoothstep(1.2, 4., w)); }
  else if (k < 5.5) {                                               // bare tin: a flat's back, stamped ribs and tabs
    float rib = abs(fract(uv.x / 12.) - .5) * 12., tab = step(abs(fract(uv.x / 24.) - .5) * 24., 1.6) * step(abs(uv.y - 6.), 1.);
    col = uTin * (.82 + .12 * noise(uv / 9.)) * (1. - .22 * (1. - smoothstep(.3, .3 + w, rib)) * (1. - smoothstep(2., 8., w))); col = mix(col, uTin * .4, tab * (1. - smoothstep(.5, 2., w)));
    metal = .55; gloss = .6; }
  else if (k < 6.5) { col = uBrass * (.86 + .22 * noise(vec2(uv.x * .35, uv.y * 6.))); metal = .9; gloss = .9; }       // lacquered brass, turned
  else if (k < 7.5) { col = uSteel * (.9 + .2 * noise(uv * vec2(.3, 5.))); metal = .85; gloss = 1.; }                 // blued steel
  else if (k < 8.5) { col = uNickel; metal = .95; gloss = 1.; }                                                    // nickel
  else if (k < 9.5) {                                               // a tin cloud: cream, its underside painted blue grey, brush swirls
    float sw = noise(uv / 9. + vec2(0., noise(uv / 23.) * 3.)); col = mix(col * mix(vec3(.62, .7, .85), vec3(1.), smoothstep(.12, .6, uv.y / max(vP.w, 1.) + .2 * (sw - .5))), col, .0);
    col *= .96 + .08 * sw * (1. - smoothstep(2., 8., w)); gloss = .5; }
  else if (k < 10.5) { gloss = .1; }                                // matt (eyes, tyres)
  else if (k < 11.5) { float st = abs(fract(uv.y / 9. + uv.x * .0) - .5) * 9.; col = mix(uVermilion, uCream, mix(smoothstep(2.25 - w, 2.25 + w, st), .5, smoothstep(2., 7., w))); }   // the striped post
  else if (k < 12.5) { float row = floor(uv.y / 3.), sc = abs(fract(uv.x / 4. + .5 * mod(row, 2.)) - .5) * 4.;                                // a roof of painted scales
    col *= mix(.78 + .3 * smoothstep(0., 3., fract(uv.y / 3.) * 3.) - .12 * (1. - smoothstep(.2, .2 + w, 2. - sc)), .95, smoothstep(1., 4., w)); }
  else if (k < 13.5) {                                              // an apple tree's crown: leaf dabs and apples
    float h1, v1, h2, v2; float d1 = dabs(uv, 5.6, .52, w, h1, v1), d2 = dabs(uv + 11.2, 4.48, .26, w, h2, v2) * step(.45, h2);
    vec3 t1 = (h1 < .5 ? vCol * 1.3 : h1 < .8 ? uOchre : uSage) * (.72 + .45 * smoothstep(-.9, .7, v1));
    vec3 fine = mix(mix(col * .75, t1, d1), uApple * (.8 + .5 * smoothstep(-.6, .8, v2)), d2);
    col = mix(fine, mix(col, uOchre, .3), smoothstep(1.2, 4., w)); }
  else {                                                            // a crate's lid: apples seen from above
    float h1, v1; float d1 = dabs(uv, .2, .42, w, h1, v1), post = 1. - smoothstep(.07, .07 + w, min(min(uv.x, 1. - uv.x), min(uv.y, 1. - uv.y)));
    col = mix(mix(uUmber * .4, uApple * (.75 + .5 * smoothstep(-.6, .8, v1)) * (.8 + .4 * h1), mix(d1, .6, smoothstep(.04, .12, w))), vCol, post); }
  // THE ONE LIGHT
  float sh = wallShade(vW), ndl = max(dot(n, uSun), 0.) * sh;
  vec3 v = normalize(cameraPosition - vW), r = reflect(-v, n), hv = normalize(v + uSun);
  vec3 amb = mix(uGndC * .24, uSkyC * .35, n.y * .5 + .5);
  float f0 = mix(.05, .9, metal), fres = f0 + (1. - f0) * pow(1. - max(dot(n, v), 0.), 5.);
  vec3 dif = col * (uSunC * ndl + amb) * (1. - metal * .8);
  vec3 mir = envc(r) * mix(vec3(1.), col, metal) * fres * (.25 + .75 * gloss) * mix(.55, 1., metal);
  float sp = (pow(max(dot(n, hv), 0.), mix(40., 160., gloss)) * gloss * (.5 + 2.2 * metal) + pow(max(dot(n, hv), 0.), 7.) * .12 * gloss) * sh * step(0., dot(n, uSun));
  vec3 lit = dif + mir + uSunC * mix(vec3(1.), col, metal) * sp;
  gl_FragColor = vec4(hazed(lit, far), 1.); }`,ne=`
uniform vec4 uRiv, uTray, uYard, uApron, uTrkBox; uniform vec4 uTrk[24];      // uTrkBox: the box of the map inside which the toys' slots lie
float segd(vec2 p, vec2 a, vec2 b, out float t) { vec2 pa = p - a, ba = b - a; t = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.); return length(pa - ba * t); }
// the tray's paint at a place: its colour and its gloss (hole is kept at nought: the tray is whole, the slots are painted dark strips)
vec3 trayPaint(vec2 p, float w, out float gloss, out float hole) { gloss = .5; hole = 0.;
  // fields: a shaken, slanted grid, each field one enamel tone with brushed lines
  vec2 g = vec2(p.x + .22 * p.y, p.y - .13 * p.x) / vec2(230., 170.), id = floor(g), f = fract(g); float h = hash(id), h2 = hash(id + 5.3);
  vec3 c = h < .3 ? uStraw : h < .55 ? uSage : h < .78 ? uOchre * .92 : uRusset * 1.05; c = mix(c, uCream, .22);
  float along = h2 < .5 ? f.x * 230. : f.y * 170., line = abs(fract(along / 9. + .3 * sin((h2 < .5 ? f.y : f.x) * 9.)) - .5) * 9.;
  c *= 1. - .17 * (1. - smoothstep(1.2 - w, 1.2 + w, line)) * (1. - smoothstep(3., 9., w)) * step(.2, h);
  // rows of painted plants on the green fields, stooks on the straw ones
  { vec2 dq = vec2(f.x * 230., f.y * 170.) / 11., di = floor(dq), df = fract(dq) - .5; float dot1 = (1. - smoothstep(.27 - w / 11., .27 + w / 11., length(df))) * (1. - smoothstep(1.5, 5., w));
    if (h >= .3 && h < .55) c = mix(c, uGreen * (.8 + .5 * hash(di + id)), dot1 * .75); else if (h < .3 && hash(di + id * 3.) > .8) c = mix(c, uOchre * .8, dot1 * .8); }
  c *= .95 + .1 * noise(p / 37.);
  float hd = min(min(f.x, 1. - f.x) * 230., min(f.y, 1. - f.y) * 170.); c = mix(c, uGreen * (.8 + .4 * noise(p / 6.)), (1. - smoothstep(3.5 - w, 3.5 + w, hd)) * .9);
  // the orchard's floor, the yard, the works' apron and the crate yard
  vec2 oc = vec2(.5 * (uOrch.x + uOrch.y), .5 * (uOrch.z + uOrch.w)), oh = vec2(.5 * (uOrch.y - uOrch.x), .5 * (uOrch.w - uOrch.z)), od = abs(p - oc) - oh; float ob = max(od.x, od.y);
  vec3 grass = uSage * (.84 + .2 * noise(p / 11.)) * (.93 + .12 * step(.5, fract((p.x + p.y) / 28.))); { vec2 aq = p / 13., ai = floor(aq), af = fract(aq) - .5 - (vec2(hash(ai + 2.2), hash(ai + 6.1)) - .5) * .6; grass = mix(grass, uApple, (1. - smoothstep(.085 - w / 13., .085 + w / 13., length(af))) * step(.45, hash(ai)) * (1. - smoothstep(.5, 2., w))); }
  c = mix(c, grass, 1. - smoothstep(-w, w, ob - 26.));
  c = mix(c, uCream * (.9 + .08 * noise(p / 4.)), (1. - smoothstep(-w, w, length(p - uYard.xy) - uYard.z)) * .92);
  c = mix(c, uCream * (.9 + .08 * noise(p / 4.)), (1. - smoothstep(-w, w, max(abs(p.x - uApron.x) - uApron.z, abs(p.y - uApron.y) - uApron.w))) * .85);
  // the tray's own seams and rivets
  vec2 sg = abs(fract(p / 400. + .5) - .5) * 400.; float seam = min(sg.x, sg.y); c *= 1. - .16 * (1. - smoothstep(.6, .6 + w, seam)) * (1. - smoothstep(3., 12., w));
  vec2 rv = abs(fract(p / 20. + .5) - .5) * 20.; c *= 1. + .25 * (1. - smoothstep(.7, .7 + w, length(rv))) * step(seam, 3.) * step(1.2, seam) * (1. - smoothstep(.7, 2.5, w));
  // the slots the toys run in: a dark line between two brass rails
  float td = 1e4, tt; if (p.x > uTrkBox.x && p.x < uTrkBox.y && p.y > uTrkBox.z && p.y < uTrkBox.w) for (int i = 0; i < 24; i++) td = min(td, segd(p, uTrk[i].xy, uTrk[i].zw, tt));
  c = mix(c, uBrass * .8, (1. - smoothstep(2.2 - w, 2.2 + w, td)) * (1. - smoothstep(4., 14., w)) * .8); c = mix(c, vec3(.03, .025, .02), (1. - smoothstep(.9 - w, .9 + w, td)) * (1. - smoothstep(2., 8., w)));
  // THE RIVER: a belt of blued steel ribbons that runs (by the world's clock), each ribbon with its own brightness and passing glints
  float rt; float rd = segd(p, uRiv.xy, uRiv.zw, rt); vec2 rb = normalize(uRiv.zw - uRiv.xy); float ra = dot(p - uRiv.xy, rb), rc = dot(p - uRiv.xy, vec2(-rb.y, rb.x));
  if (rd < 39. && rt > 0. && rt < 1.) { float rib = floor(rc / 3.5), rh = hash(vec2(rib, 2.)), run = ra - uT * (26. + 8. * rh);
    vec3 st = mix(uSteel, uSky, .18 + .3 * rh) * (.8 + .5 * noise(vec2(run / 38., rib)));
    float gl = smoothstep(.8, .97, noise(vec2(run / 11., rib * 3.7))) * (1. - smoothstep(2., 7., w)); st += uSky * gl * .7 + .25 * gl;
    st *= 1. - .3 * (1. - smoothstep(.25, .25 + w, abs(fract(rc / 3.5) - .5) * 3.5 - 1.45 + 1.7)) * 0.;
    st = mix(st, mix(uSteel, uSky, .33), smoothstep(1.2, 5., w) * .6);
    float edge = smoothstep(35. - w, 35. + w, abs(rc)); c = mix(st, uBrass * .85, edge); gloss = mix(1., .8, edge); }
  return c; }
`,X=`
varying vec3 vW;
void main() { vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,re=`
attribute vec3 aR; varying vec3 vW;
${D}
void main() { vec4 lp = vec4(position, 1.);
#ifdef USE_INSTANCING
  lp = instanceMatrix * lp;
#endif
  vec4 w = modelMatrix * lp; w.xyz += ride(aR); float up = max(w.y, 0.);
  vec3 g = w.xyz - uSun * (up / uSun.y); g.y = .05 + .0006 * length(cameraPosition - g);
  vW = g; gl_Position = projectionMatrix * viewMatrix * vec4(g, 1.); }`,K=`
varying vec3 vW;
${D}
${ne}
void main() { float far = length(cameraPosition - vW); vec2 p = vW.xz; float w = max(max(length(dFdx(p)), length(dFdy(p))), 1e-5);
#ifdef BENCH
  // the bench the tray stands on: planed wood, its grain running north, to the horizon
  float gr = noise(vec2(p.x / 26., p.y / 900.)) + .5 * noise(vec2(p.x / 7., p.y / 400.)); vec3 c = mix(vec3(.2, .1, .045), vec3(.36, .2, .09), smoothstep(.3, 1.2, gr)) * (.9 + .2 * noise(p / 300.));
  c *= 1. - .35 * (1. - smoothstep(2., 2. + w, abs(fract(p.x / 520.) - .5) * 520.)) * (1. - smoothstep(20., 80., w));
  float gloss = .35, sun = 1.;
#else
  if (p.x < uTray.x || p.x > uTray.y || p.y < uTray.z || p.y > uTray.w) discard;
  float gloss, hole; vec3 c = trayPaint(p, w, gloss, hole); if (hole > .5) discard;
#ifdef SHADOW
  float sun = 0.;
#else
  float sun = 1.;
#endif
#endif
  vec3 v = normalize(cameraPosition - vW), n = vec3(0., 1., 0.), r = reflect(-v, n);
  vec3 lit = c * (uSunC * uSun.y * sun + mix(uGndC * .24, uSkyC * .35, 1.));
  float fres = .05 + .95 * pow(1. - max(v.y, 0.), 5.); lit = mix(lit, skyc(r), fres * gloss * .55);
  lit += uSunC * pow(max(dot(n, normalize(v + uSun)), 0.), 220.) * gloss * sun * 1.2;
  gl_FragColor = vec4(hazed(lit, far), 1.); }`,ie="varying vec3 vD; void main() { vD = position; gl_Position = projectionMatrix * viewMatrix * vec4(position + cameraPosition, 1.); gl_Position.z = gl_Position.w; }",ce=`
varying vec3 vD;
${D}
void main() { vec3 d = normalize(vD); vec3 c = skyc(d);
  float s = max(dot(d, uSun), 0.); c += uSunC * (pow(s, 5.) * .1 + pow(s, 40.) * .16);
  // brushed clouds, painted: long strokes with a hard edge and a blue grey underside
  vec2 q = vec2(atan(d.x, d.z) * 2.6, d.y * 13.); float n1 = noise(q * 1.3) * .6 + noise(q * 3.1 + 7.) * .3 + noise(q * vec2(9., 5.) + 3.) * .1;
  float band = smoothstep(.03, .1, d.y) * (1. - smoothstep(.3, .5, d.y)), cl = smoothstep(.56, .585, n1) * band;
  float n2 = noise((q + vec2(0., .22)) * 1.3) * .6 + noise((q + vec2(0., .22)) * 3.1 + 7.) * .3 + noise((q + vec2(0., .22)) * vec2(9., 5.) + 3.) * .1;
  vec3 cc = mix(vec3(.72, .78, .9), vec3(1., .97, .9), smoothstep(.56, .64, n2)); c = mix(c, cc * (uCream * .5 + .5), cl * .85);
  gl_FragColor = vec4(c, 1.); }`;function F(){const o=[],e=[],s=[],a=[],c=[];return{P:o,N:e,C:s,A:a,R:c,v:(l,u,v,r,t)=>{o.push(l.x,l.y,l.z),e.push(u.x,u.y,u.z),s.push(v[0],v[1],v[2]),a.push(r[0],r[1],r[2],r[3]),c.push(t[0],t[1],t[2])},tris:()=>o.length/9,geometry(){const l=new h.BufferGeometry;return l.setAttribute("position",new h.Float32BufferAttribute(o,3)),l.setAttribute("normal",new h.Float32BufferAttribute(e,3)),l.setAttribute("aCol",new h.Float32BufferAttribute(s,3)),l.setAttribute("aP",new h.Float32BufferAttribute(a,4)),l.setAttribute("aR",new h.Float32BufferAttribute(c,3)),l.computeBoundingSphere(),l}}}const _=[0,0,0],V=new h.Vector3,j=new h.Vector3,W=new h.Vector3,L=new h.Vector3,B=new h.Vector3,E=new h.Matrix3,G=(o,e)=>typeof o=="function"?o(e):o;function J(o,e,s,a,c,i,l,u,v,r=0,t=_,k=null){V.set(s[0],s[1],s[2]).applyMatrix4(e),j.set(a[0],a[1],a[2]).applyMatrix4(e),W.set(c[0],c[1],c[2]).applyMatrix4(e),L.set(i[0],i[1],i[2]).applyMatrix4(e),B.copy(j).sub(V).cross(W.clone().sub(V)).normalize();const g=Array.isArray(l[0])?l:[l,l,l,l],p=v||[[0,0],[1,0],[1,1],[0,1]],m=f=>[u,p[f][0],p[f][1],r],n=(f,d,b,y,z)=>o.v(f,b,z||g[d],y||m(d),t);if(n(V,0,B),n(j,1,B),n(W,2,B),n(V,0,B),n(W,2,B),n(L,3,B),k){const f=B.clone().negate(),d=y=>[k.kind,p[y][0],p[y][1],k.w??r],b=k.col;n(V,0,f,d(0),b),n(W,2,f,d(2),b),n(j,1,f,d(1),b),n(V,0,f,d(0),b),n(L,3,f,d(3),b),n(W,2,f,d(2),b)}}function Q(o,e,s,a,c,i,l,u={}){const v=s/2,r=a/2,t=c/2,k=u.w??0,g=u.r||_,p=u.metres;[[[-v,-r,t],[v,-r,t],[v,r,t],[-v,r,t],s,a],[[v,-r,-t],[-v,-r,-t],[-v,r,-t],[v,r,-t],s,a],[[v,-r,t],[v,-r,-t],[v,r,-t],[v,r,t],c,a],[[-v,-r,-t],[-v,-r,t],[-v,r,t],[-v,r,-t],c,a],[[-v,r,t],[v,r,t],[v,r,-t],[-v,r,-t],s,c],[[-v,-r,-t],[v,-r,-t],[v,-r,t],[-v,-r,t],s,c]].forEach((n,f)=>{if(u.skip&&u.skip.includes(f))return;const d=p?n[4]:1,b=p?n[5]:1,y=f===4&&u.top!==void 0?u.top:l;J(o,e,n[0],n[1],n[2],n[3],f===4&&u.topCol?u.topCol:i,y,[[0,0],[d,0],[d,b],[0,b]],k,g)})}function C(o,e,s,a,c,i,l=0,u={}){const v=u.nu||14,r=u.nv||9,t=u.w??0,k=u.r||_,g=u.us||1;E.getNormalMatrix(e);const p=(n,f)=>{const d=n/v*Math.PI*2,b=f/r*Math.PI,y=Math.sin(b);return[y*Math.sin(d),Math.cos(b),y*Math.cos(d),d]},m=n=>{const f=new h.Vector3(n[0]*s,n[1]*a,n[2]*c).applyMatrix4(e),d=new h.Vector3(n[0]/s,n[1]/a,n[2]/c).applyMatrix3(E).normalize();o.v(f,d,G(i,n),u.cyl?[l,n[3]*g,n[1]*g,t]:[l,n[0]*g,n[1]*g,t],k)};for(let n=0;n<r;n++)for(let f=0;f<v;f++){const d=p(f,n),b=p(f+1,n),y=p(f+1,n+1),z=p(f,n+1);n>0&&(m(d),m(z),m(b)),n<r-1&&(m(b),m(z),m(y))}}function O(o,e,s,a,c,i,l=0,u={}){const v=u.n||10,r=u.w??0,t=u.r||_;E.getNormalMatrix(e);const k=(s-a)/c,g=(p,m,n)=>{const f=new h.Vector3(Math.sin(p)*n,m,Math.cos(p)*n).applyMatrix4(e),d=new h.Vector3(Math.sin(p),k,Math.cos(p)).applyMatrix3(E).normalize();o.v(f,d,G(i,[Math.sin(p),m/c,Math.cos(p)]),[l,p*n,m,r],t)};for(let p=0;p<v;p++){const m=p/v*Math.PI*2,n=(p+1)/v*Math.PI*2;g(m,0,s),g(n,0,s),g(n,c,a),g(m,0,s),g(n,c,a),g(m,c,a)}if(u.caps)for(const[p,m,n]of[[c,a,1],[0,s,-1]]){if(m<1e-6)continue;const f=new h.Vector3(0,n,0).applyMatrix3(E).normalize(),d=new h.Vector3(0,p,0).applyMatrix4(e);for(let b=0;b<v;b++){const y=b/v*Math.PI*2,z=(b+1)/v*Math.PI*2,I=new h.Vector3(Math.sin(y)*m,p,Math.cos(y)*m).applyMatrix4(e),U=new h.Vector3(Math.sin(z)*m,p,Math.cos(z)*m).applyMatrix4(e),T=G(u.capCol||i,[0,p/c,0]),R=u.capKind??l;n>0?(o.v(d,f,T,[R,0,0,r],t),o.v(I,f,T,[R,Math.sin(y)*m,Math.cos(y)*m,r],t),o.v(U,f,T,[R,Math.sin(z)*m,Math.cos(z)*m,r],t)):(o.v(d,f,T,[R,0,0,r],t),o.v(U,f,T,[R,Math.sin(z)*m,Math.cos(z)*m,r],t),o.v(I,f,T,[R,Math.sin(y)*m,Math.cos(y)*m,r],t))}}}function H(o,e,s,a,c,i,l={}){const u=l.w??0,v=l.r||_,r=l.back,t=l.uvScale||1;E.getNormalMatrix(e);const k=new h.Vector3(0,0,1).applyMatrix3(E).normalize(),g=k.clone().negate(),p=n=>new h.Vector3(n[0],n[1],0).applyMatrix4(e),m=s.length;for(let n=0;n<m;n++){const f=s[n],d=s[(n+1)%m],b=[a,f,d];for(const y of b)o.v(p(y),k,G(c,y),[i,y[0]*t,y[1]*t,u],v);for(const y of[a,d,f])o.v(p(y),g,G(r?r.col:c,y),[r?r.kind:i,y[0]*t,y[1]*t,r?.w??u],v)}}function ve(o,e,s,a,c,i,l={}){const u=l.w??0,v=l.r||_,r=l.y0||0;for(let t=0;t<s.length-1;t++)J(o,e,[s[t],r,0],[s[t+1],r,0],[s[t+1],a[t+1],0],[s[t],a[t],0],c,i,[[s[t],r],[s[t+1],r],[s[t+1],a[t+1]],[s[t],a[t]]],u,v,l.back||null)}function fe(o={}){const e=t=>new h.Vector3(t[0],t[1],t[2]),s=new h.Vector3(...o.sun||[.34,.36,-.87]).normalize(),a={uT:{value:0},uSun:{value:s},uSunC:{value:e(M("#FFE6C0")).multiplyScalar(2)},uSkyC:{value:e(M("#CFE0F2"))},uGndC:{value:e(M("#C9B48A"))},uHazeC:{value:e(M("#EFE6CE"))},uHaze:{value:new h.Vector3(5200,0,.27)},uZen:{value:e(M("#6FA8DC"))},uMid:{value:e(M("#BFDDF0"))},uHor:{value:e(M("#F6ECCB"))},uOrch:{value:new h.Vector4(-260,260,1700,2120)},uWall:{value:22},uRiv:{value:new h.Vector4(-585,690,60,1120)},uTray:{value:new h.Vector4(-1330,1330,100,3640)},uYard:{value:new h.Vector4(120,1150,95,0)},uApron:{value:new h.Vector4(-150,3150,420,330)},uTrkBox:{value:new h.Vector4(-600,700,900,2400)},uTrk:{value:Array.from({length:24},()=>new h.Vector4(1e6,1e6,1000001,1e6))}};for(const t of["cream","russet","sage","sky","vermilion","brass","steel","nickel","umber","ochre","green","apple","tin","straw"])a["u"+t[0].toUpperCase()+t.slice(1)]={value:e(w[t])};const c=new h.ShaderMaterial({uniforms:a,vertexShader:se,fragmentShader:ae}),i=new h.ShaderMaterial({uniforms:a,vertexShader:re,fragmentShader:K,side:h.DoubleSide,defines:{SHADOW:1},depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),l=new h.ShaderMaterial({uniforms:a,vertexShader:X,fragmentShader:K}),u=new h.ShaderMaterial({uniforms:a,vertexShader:X,fragmentShader:K,defines:{BENCH:1}}),v=new h.ShaderMaterial({uniforms:a,vertexShader:ie,fragmentShader:ce,side:h.BackSide,depthWrite:!1,depthTest:!1}),r=(t,k,g=0)=>(t.name=k,t.frustumCulled=!1,t.renderOrder=g,t);return{uniforms:a,sun:s,tinMat:c,shadeMat:i,sky(t){return r(new h.Mesh(new h.SphereGeometry(t,32,16),v),"sky",-10)},tray(t,k,g,p,m){const n=new h.Group,f=(d,b,y,z,I,U,T,R)=>{const Z=new h.BufferGeometry;Z.setAttribute("position",new h.Float32BufferAttribute([b,d,z,b,d,I,y,d,I,b,d,z,y,d,I,y,d,z],3)),n.add(r(new h.Mesh(Z,U),T,R))};return f(0,t,k,g,p,l,"tray",-6),f(-m,-3e4,3e4,-3e4,3e4,u,"bench",-8),n},mesh(t,k){return r(new h.Mesh(t.geometry(),c),k)},shade(t,k){return r(new h.Mesh(t,i),k+"-shade",-4)},many(t,k,g){const p=new h.InstancedMesh(t,c,k);return r(p,g)},manyShade(t,k){const g=new h.InstancedMesh(t.geometry,i,t.count);return g.instanceMatrix=t.instanceMatrix,r(g,k+"-shade",-4)}}}const q=()=>new h.Matrix4,x=(o,e,s)=>q().makeTranslation(o,e,s),P=o=>q().makeRotationX(o),le=o=>q().makeRotationY(o),Y=o=>q().makeRotationZ(o),A=(...o)=>o.reduce((e,s)=>e.clone().multiply(s));function ee(o,e,s,a){Q(o,x(0,2.6,0),e,.9,s,a,S.enamel);for(const c of[-1,1])for(const i of[-1,1]){const l=A(x(c*(e/2+.2),2.1,i*(s/2-2.4)),Y(Math.PI/2),x(0,-.6,0));O(o,l,2.1,2.1,1.2,w.black,S.matt,{n:12,caps:!0,capCol:w.nickel,capKind:S.nickel})}}function pe(o=0){const e=F(),s=w.vermilion,a=w.white,c=w.black;ee(e,9,12,N(w.umber,w.black,.4));for(const i of[-1,1])O(e,x(i*2.1,3,.4),1.5,1.3,3.2,c,S.enamel,{n:8});C(e,x(0,11.6,0),4.6,7.4,4.3,i=>i[2]>.25&&i[1]<.75&&Math.abs(i[0])<.62?a:s),C(e,A(x(0,7.4,-6.6),P(-.6)),2.5,2.3,6.4,i=>i[2]<-.55?a:s,0,{nu:10,nv:8}),C(e,x(0,20.6,1),3.7,3.2,3.6,i=>i[1]<-.2&&i[2]>.1?a:s,0,{nu:12,nv:8}),O(e,A(x(0,19.9,3.6),P(Math.PI/2-.12)),2,.6,5,i=>i[2]<-.1?a:s,0,{n:10}),C(e,x(0,20.5,8.6),.8,.7,.8,c,S.matt,{nu:8,nv:5});for(const i of[-1,1]){H(e,A(x(i*2.2,22.6,.6),Y(-i*.22),P(-.12)),[[-1.5,0],[1.5,0],[.2,4.6]],[0,1.4],u=>u[1]>3?c:s,S.enamel),C(e,x(i*1.55,21.3,4.2),.62,.72,.4,c,S.matt,{nu:8,nv:5}),C(e,x(i*1.4,21.6,4.5),.2,.2,.14,a,0,{nu:6,nv:4});const l=o?A(x(i*3.7,15,1.4),P(.72),Y(i*.5)):A(x(i*4,15,1),P(1.15),Y(-i*.1));O(e,l,1.15,.95,o?7.6:6.4,u=>u[1]>.72?c:s,0,{n:8,caps:!0})}return O(e,A(x(0,13.2,-4),P(-Math.PI/2)),.9,.9,1.6,w.brass,S.brass,{n:8}),e}function me(o=0){const e=F(),s=w.cream,a=w.white,c=w.black,i=o?.72:1;ee(e,8.4,10.5,N(w.sage,w.black,.45)),C(e,x(0,3+6.3*i,0),4.3,6.3*i,4.8,u=>u[2]>.4&&Math.abs(u[0])<.5?a:s),C(e,x(0,3+3.4*i,2.6),3,3.3*i,3.2,s,0,{nu:10,nv:7}),C(e,x(0,3.2+2.2*i,-4.9),1.7,1.7,1.7,a,0,{nu:8,nv:6});const l=3+13.6*i;C(e,x(0,l,1.5),3,2.9,3.4,s,0,{nu:12,nv:8}),C(e,x(0,l-.5,4.7),.6,.5,.5,w.pink,S.matt,{nu:6,nv:4});for(const u of[-1,1]){C(e,x(u*1.75,l+.7,3.6),.6,.7,.4,c,S.matt,{nu:8,nv:5}),C(e,x(u*1.6,l+1,3.9),.2,.2,.14,a,0,{nu:6,nv:4});const v=A(x(u*1.2,l+2.2,.4),Y(-u*(o?.25:.1)),P(o?-1.25:-.1));H(e,v,[[-1.2,0],[1.2,0],[1.45,5.5],[.5,9.6],[-.5,9.6],[-1.45,5.5]],[0,4.5],t=>Math.abs(t[0])<.75&&t[1]>1&&t[1]<8.4?w.pink:s,S.enamel,{back:{col:s,kind:S.enamel}})}return O(e,A(x(0,3+7*i,-4.5),P(-Math.PI/2)),.9,.9,1.6,w.brass,S.brass,{n:8}),e}function de(){const o=F();O(o,A(P(-Math.PI/2)),.55,.55,3.6,w.brass,S.brass,{n:8});for(const e of[-1,1]){const s=[];for(let a=0;a<12;a++){const c=a/12*Math.PI*2;s.push([e*2.3+1.9*Math.cos(c),1.5*Math.sin(c)])}H(o,A(x(0,0,-4.4),P(Math.PI/2)),s,[e*2.3,0],w.brass,S.brass)}return o}function we(){const o=F();return Q(o,q(),1,1,1,w.white,S.crate,{top:S.lid}),o}function xe(){const o=F(),e=N(w.cream,w.tin,.35),s=N(w.umber,w.cream,.35);C(o,x(0,0,0),2.4,2.2,5.6,a=>a[1]<-.2?w.white:a[2]<-.5?s:e,0,{nu:10,nv:8}),O(o,A(x(0,.4,4.6),P(1.2)),1.2,.8,5.2,e,0,{n:8}),C(o,x(0,2.4,9.6),1.15,1.05,1.5,e,0,{nu:8,nv:6}),O(o,A(x(0,2.3,10.6),P(Math.PI/2)),.6,.1,2.2,w.ochre,0,{n:6});for(const a of[-1,1])C(o,x(a*.75,2.75,10.2),.22,.24,.2,w.black,S.matt,{nu:6,nv:4});return H(o,A(x(0,.4,-5.2),P(-Math.PI/2+.15)),[[-2.2,0],[2.2,0],[1.4,3.4],[-1.4,3.4]],[0,1.6],s,S.enamel),o}function ye(o){const e=F(),s=N(w.cream,w.tin,.35),a=N(w.umber,w.cream,.35),c=o,i=[[0,-2.6],[c*4,-3.2],[c*9.5,-1.6],[c*10.5,.4],[c*6,2.4],[0,2.6]];return c<0&&i.reverse(),H(e,P(-Math.PI/2),i,[c*4,0],l=>Math.abs(l[0])>6.5?a:s,S.enamel),e}function be(){const o=F();return C(o,x(0,.6,0),3.2,2.6,8,e=>e[1]>-.1?w.cream:w.russet,0,{nu:10,nv:8}),O(o,x(0,1,.5),.3,.25,15,w.steel,S.steel,{n:6}),H(o,A(x(0,3.5,.5),le(Math.PI/2-.5)),[[.3,0],[7.5,.6],[.3,12]],[2.2,3.5],w.cream,S.enamel),o}export{w as COL,S as KIND,oe as WAVE,C as ball,O as bar,be as boatSheet,Q as box,we as crateSheet,H as cut,ve as flat,pe as foxSheet,xe as gooseSheet,me as hareSheet,$ as hash,de as keySheet,fe as makeTinwork,N as mix,he as noise,J as quad,F as sheet,ue as ss,ye as wingSheet};
