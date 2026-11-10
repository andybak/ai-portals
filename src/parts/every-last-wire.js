import*as o from"three";const g=v=>{const d=new o.Color(v);return[d.r,d.g,d.b]},pe={zinc:g("#B9C2C8"),steel:g("#E6EBEE"),copper:g("#C06A32"),brass:g("#D8AE45"),straw:g("#E8D58A"),green:g("#3E9A4C"),sage:g("#86AE6E"),kale:g("#1F6B45"),hedge:g("#1C5233"),red:g("#C8382E"),cream:g("#F3E9D2"),board:g("#6E4E32"),strand:g("#9CCBEA"),bark:g("#8A4B25"),leaf:g("#4FAE4A"),white:g("#F4F2EA"),blue:g("#4C7FC0"),wool:g("#F2F4F6")},Fe=(v,d,r)=>[v[0]+(d[0]-v[0])*r,v[1]+(d[1]-v[1])*r,v[2]+(d[2]-v[2])*r],Ee=(v,d,r)=>{const x=Math.min(1,Math.max(0,(r-v)/(d-v)));return x*x*(3-2*x)},re=(v,d)=>{const r=Math.sin(v*127.1+d*311.7)*43758.5453;return r-Math.floor(r)},He=(v,d)=>{const r=Math.floor(v),x=Math.floor(d),C=v-r,b=d-x,S=C*C*(3-2*C),k=b*b*(3-2*b);return(re(r,x)*(1-S)+re(r+1,x)*S)*(1-k)+(re(r,x+1)*(1-S)+re(r+1,x+1)*S)*k},me={hex:0,square:1,rows:2,diamond:3,plain:4,clips:5,land:10},le=`
uniform vec3 uSun, uSunC, uSkyC, uGndC, uHazeC, uHaze; uniform float uS, uTime; uniform vec4 uCloud[11]; uniform vec3 uFlock;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y); }
vec2 rot(vec2 p, float a) { float c = cos(a), s = sin(a); return vec2(c * p.x - s * p.y, s * p.x + c * p.y); }
// how much of a pixel w wide, its middle d from a wire's middle line, a wire of half-width r covers
float boxcov(float d, float r, float w) { return clamp((min(d + .5 * w, r) - max(d - .5 * w, -r)) / max(w, 1e-4), 0., 1.); }
// the distance to the middle line of a paperclip one long (the plain wire oval of three bends, as clipPath lays it)
float seg(vec2 p, vec2 a, vec2 b) { vec2 pa = p - a, ba = b - a; return length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0., 1.)); }
float harc(vec2 q, float r, float up) { return q.y * up >= 0. ? abs(length(q) - r) : 1e3; }
float clipd(vec2 p) { float d = min(min(seg(p, vec2(-.14, .22), vec2(-.14, -.36)), seg(p, vec2(.14, -.36), vec2(.14, .39))), min(seg(p, vec2(-.08, .39), vec2(-.08, -.24)), seg(p, vec2(.08, -.24), vec2(.08, .2))));
  return min(d, min(harc(p - vec2(0., -.36), .14, -1.), min(harc(p - vec2(.03, .39), .11, 1.), harc(p - vec2(0., -.24), .08, -1.)))); }
vec3 hazed(vec3 col, float far) { return mix(col, uHazeC, uHaze.z * smoothstep(uHaze.x, uHaze.y, far)); }
// the shade of the steel wool on what lies under it: from the place toward the sun up to each flock's height, and how
// near the flock's middle that is (uCloud: a flock's middle x, its height, its middle z, its half-length; uFlock: its drift)
float shade(vec3 P) { float s = 0.;
  for (int i = 0; i < 11; i++) { vec2 q = P.xz + uSun.xz * (uCloud[i].y - P.y) / uSun.y - uCloud[i].xz - uFlock.xz; q.x *= 300. / uCloud[i].w;
    s = max(s, 1. - smoothstep(170., 330., length(q))); }
  return 1. - .34 * s; }
`,we=`
attribute vec3 aCol; attribute vec4 aK; attribute vec3 aU; attribute vec2 aUV;
#ifdef INST
attribute vec3 iCol; attribute vec4 iK; attribute vec2 iU;
#endif
varying vec3 vCol, vN, vW, vU; varying vec4 vK; varying vec2 vUV;
void main() { vec4 w = vec4(position, 1.); vec3 n = normal;
#ifdef INST
  w = instanceMatrix * w; n = mat3(instanceMatrix) * n; vCol = iCol; vK = iK; vU = vec3(iU, aU.z);
#else
  vCol = aCol; vK = aK; vU = aU;
#endif
  w = modelMatrix * w; vN = mat3(modelMatrix) * n; vW = w.xyz; vUV = aUV; gl_Position = projectionMatrix * viewMatrix * w; }`,xe=`
uniform vec4 uC, uR; uniform vec3 uHeap[10]; uniform vec3 uZen, uMid, uHor, uBoard, uGreen, uCopper, uBrass, uStraw, uKale, uSage, uZinc, uHedge, uStrand, uSteel;
varying vec3 vCol, vN, vW, vU; varying vec4 vK; varying vec2 vUV;
${le}
// the distance to the nearest edge of a tiling of hexagons one across (flat to flat)
float hexd(vec2 p) { const vec2 s = vec2(1., 1.7320508);
  vec4 c = floor(vec4(p, p - vec2(.5, 1.)) / s.xyxy) + .5, h = vec4(p - c.xy * s, p - (c.zw + .5) * s);
  vec2 q = abs(dot(h.xy, h.xy) < dot(h.zw, h.zw) ? h.xy : h.zw); return .5 - max(dot(q, s * .5), q.x); }
// one mesh of kind k, cell S, wire half-width r, at p (all in metres), the pixel w across: how much wire covers the
// pixel; c: the wire's light across its round (its middle bright, its edges dark), which goes into its own mean
// with the footprint as the wire does. The head, 1.
float across(float d, float r, float m) { float c = clamp(d / r, 0., 1.); return mix(.66 + .5 * sqrt(1. - c * c) + .5 * pow(1. - c, 4.), 1.15, m); }
float mesh(float k, vec2 p, float S, float r, float w, out float c) {
  float d, f = 4. * r / S;
  if (k < .5) d = hexd(p / S) * S;
  else if (k < 1.5) { vec2 g = (.5 - abs(fract(p / S) - .5)) * S; d = min(g.x, g.y); }
  else if (k < 2.5) { d = (.5 - abs(fract(p.x / S) - .5)) * S; f = 2. * r / S; }
  else { vec2 g = (.5 - abs(fract(vec2(p.x * .5 + p.y * .866, p.x * .5 - p.y * .866) / S) - .5)) * S; d = min(g.x, g.y); }
  float m = smoothstep(.18 * S, .6 * S, w); c = across(d, r, max(m, smoothstep(.5 * r, 2. * r, w)));
  return mix(boxcov(d, r, w), min(f, 1.), m); }
// a drift of paperclips lying flat: two layers of cells S across, in each cell one clip turned by its own angle
float clips(vec2 p, float S, float r, float w, float lo, float hi, out float c) { float d = 1e3;
  for (int l = 0; l < 2; l++) { vec2 q = rot(p, float(l) * .9) / S + float(l) * vec2(.37, .61), id = floor(q) + float(l) * 17.;
    d = min(d, clipd(rot(fract(q) - .5, hash(id) * 6.2832) / .9) * .9 * S); }
  // (lo, hi: the shares of a cell the pixel is across between which the clips go over into their mean)
  float m = smoothstep(lo * S, hi * S, w); c = across(d, r, max(m, smoothstep(.5 * r, 2. * r, w)));
  return mix(boxcov(d, r, w), min(14. * r / S, .8), m); }
float riverX(float z) { return 220. * sin(z / 900. + .5); }
vec3 skyc(vec3 d) { vec3 c = mix(uHor, uMid, smoothstep(-.02, .2, d.y)); return mix(c, uZen, smoothstep(.12, .8, d.y)); }
// the long shadow of each heap over the ground, away from the low sun (uHeap: a heap's middle x and z, its height;
// a heap stands at its angle of rest, 1.6 out for 1 up): 1 in its shadow
float heapShade(vec2 p) { vec2 d = -normalize(uSun.xz), n = vec2(-d.y, d.x); float k = length(uSun.xz) / uSun.y, sd = 0.;
  for (int i = 0; i < 10; i++) { vec2 v = p - uHeap[i].xy; float hh = uHeap[i].z, R = 1.6 * hh, a = dot(v, d), b = abs(dot(v, n));
    sd = max(sd, smoothstep(0., 10., R * 1.1 * (1. - a / (k * hh)) - b) * smoothstep(0., .4 * R, a)); }
  return sd; }
// BY THE PLACE'S CLOCK: the heaps glitter. In cells s across, about one in two holds a point that flashes now and
// then, each by its own beat; the point is never drawn smaller than the pixel, and a size of cell is left out where
// its points would be under a pixel or its cells over a few pixels (the head, 6)
float spark(vec2 p, float s, float w, float least) { vec2 q = p / s, id = floor(q); float h1 = hash(id);
  float tw = pow(.5 + .5 * sin(uTime * (1.2 + 2.2 * hash(id + 5.3)) + h1 * 6.2832), 24.);
  vec2 f = (fract(q) - .5 - .5 * (vec2(hash(id + 1.7), hash(id + 9.1)) - .5)) * s; float rr = clamp(1.1 * w, .05 * s, .22 * s);
  return tw * step(.4, hash(id + 2.9)) * (1. - smoothstep(.5 * rr, rr, length(f))) * (1. - smoothstep(.2 * s, .32 * s, w)) * mix(1., smoothstep(.02 * s, .05 * s, w), least); }
void main() {
  float kind = floor(vK.x + .5), far = length(cameraPosition - vW), c = 0., cov = 0., sh = 0.;
  vec3 N = normalize(vN) * (gl_FrontFacing ? 1. : -1.), V = (cameraPosition - vW) / far, wire = vCol, gap = vCol * .36;      // a skin is thin: it is lit on the side we see
  float prog = clamp((uS - vU.x) / max(vU.y, 1.), 0., 1.);
  if (vU.z > 1.0001 - prog) discard;                    // BY PLACE: a skin wiped away as it comes undone
  if (kind > 9.5) {
    // ---- THE LAND: fields on the valley's floor, pasture on the hills, bare zinc on the ridges; the middle unmade ----
    vec2 p = vW.xz; float w = max(length(dFdx(p)), length(dFdy(p))), h = vW.y;
    vec2 q = rot(p, .35) / 250.; q += .16 * vec2(sin(q.y * 1.9 + 1.3), sin(q.x * 1.6 + .4));
    vec2 id = floor(q), f = fract(q); float hs = hash(id), ang = floor(hash(id + 7.3) * 6.) * .5236;
    float border = min(min(f.x, 1. - f.x), min(f.y, 1. - f.y)) * 250., k, S, r;
    if (hs < .34) { k = 0.; S = 1.6; r = .15; wire = uGreen; } else if (hs < .55) { k = 2.; S = 9.; r = 1.3; wire = uCopper; }
    else if (hs < .7) { k = 2.; S = 6.5; r = .9; wire = uBrass; } else if (hs < .84) { k = 1.; S = 11.; r = .85; wire = uStraw; }
    else { k = 3.; S = 12.; r = 1.; wire = uKale; }
    // on the hills the fields are pasture: the same meshes in greens, a little of the floor's colour left in some; zinc toward the ridges
    float hl = smoothstep(55., 95., h), pg = hash(id + 3.1); vec3 pas = pg < .4 ? uSage : (pg < .75 ? uGreen : uKale);
    wire = mix(wire, mix(pas, wire, hs > .34 && hs < .84 ? .25 : 0.), hl); wire = mix(wire, uZinc, smoothstep(280., 400., h) * .35);
    // the pasture is mown in swathes 13 m wide, and no field is one flat tone (both go into their mean far off)
    float mow = k < .5 ? mix(.5 + .5 * sin(rot(p, ang).x * .2417), .5, smoothstep(4., 12., w)) : .5;
    wire *= (.965 + .07 * mow) * (.93 + .14 * mix(noise(p / 80.), .5, smoothstep(20., 60., w)));
    // BY THE PLACE'S CLOCK: THE PULL. The country's wire is being drawn in, and the pull runs through its fields as
    // shivers toward the middle, 30 m a second: where one passes, a field's wire stands up into the low sun and
    // catches it. Soft fronts some 250 m apart, bent, uneven and broken; where a pixel is wider than a part of a
    // front they go into their mean, 0.196 of a front's light, patch by patch (the head, 1)
    vec2 pm = p - uC.xy; float rm = length(pm), am = atan(pm.y, pm.x), ph = (rm + uTime * 30.) / 40. + 1.3 * sin(3. * am + rm / 600.) + .9 * sin(5. * am - rm / 330. + 2.);
    float pull = mix(pow(.5 + .5 * sin(ph), 8.), .196, smoothstep(18., 55., w)) * smoothstep(.25, .75, noise(p / 310. + 5.));
    cov = mesh(k, rot(p, ang), S, r, w, c);
    // the square and the diamond mesh are drawn half as wire and half as their own mean (wire, board shadow and frame alike)
    float grid = (k > .5 && k < 1.5) || k > 2.5 ? .5 : 0., gM = min(4. * r / S, 1.); cov = mix(cov, gM, grid); c = mix(c, 1.15, grid);
    // THE BOARD UNDER THE SKIN: on the floor the skin of mesh stands a little way over a dark board, and its shadow
    // falls on the board beside it, along the sun's way; a hill is hollow, and what shows through its skin is its dark inside
    float c2, c3; sh = mix(mesh(k, rot(p - uSun.xz * 4.4, ang), S, r, w, c2), gM, grid) * (1. - hl);
    // between the thick wires an infill of fine mesh of the same wire, so close a weave that from the way it is its own mean
    float fine = min(5.714 * r / S, 1.), catchS = cov + (1. - cov) * fine * .5; c3 = 1.15;
    fine = mix(fine, 1., mix(.4, .6, hl));                  // the infill is close (closer on the hills: pasture)
    vec3 under = uBoard * (.92 + .16 * noise(p / 60.)) * mix(1. - .6 * sh, .5, hl);
    gap = mix(under, wire * (k < .5 ? .86 : .7) * c3 * (1. - .35 * sh), fine);      // (the thick wires' shadow lies on the infill too)
    vec3 col = mix(gap, wire * c, cov);
    // and over all a frame of the same mesh four times as wide, in thick wire: what one still sees of it from far off
    // (near the eye it is not drawn: there one sees the mesh itself; on the hills it is fainter)
    float frameK = smoothstep(.5, 1.6, w) * (1. - .75 * hl) * (1. - .7 * smoothstep(2.5, 7., w));
    frameK *= k < .5 ? 0. : 1.;      // (the fine net of the pasture has no wide frame: far off it is its own mean)
    float cB, covB = mesh(k, rot(p, ang), S * 4., r * 2.8, w, cB), shB = mesh(k, rot(p - uSun.xz * 4.4, ang), S * 4., r * 2.8, w, c2), gB = min(2.8 * r / S, 1.); covB = mix(covB, gB, grid) * frameK; shB = mix(shB, gB, grid) * (1. - hl) * frameK; cB = mix(cB, 1.15, grid);
    col = mix(col * (1. - .45 * shB * (1. - cov)), wire * .9 * cB, covB * .65); catchS = max(catchS, covB);
    // the hedges along the fields' borders: a rope of dark green wire lying along each border, twisted of strands (a
    // strand comes round every 7 m), some 6 m across, lighter along its middle, brighter on its flank toward the sun and
    // darker on the other; and beside it on the field lies its own shadow, away from the sun, as long as a rope 2 m high
    // throws it (far off all of this is the rope's mean, and the rope is never thinner than the pixel is wide: the head, 1)
    float hm = smoothstep(.9, 3.2, w), hx = min(f.x, 1. - f.x), hy = min(f.y, 1. - f.y);
    // (hax: the way across this border over the ground, the fields being turned by .35; hsd: how far across, with its side; hal: how far along)
    vec2 hax = hx < hy ? vec2(.9394, -.3429) : vec2(.3429, .9394);
    float hsd = (hx < hy ? (f.x < .5 ? f.x : f.x - 1.) : (f.y < .5 ? f.y : f.y - 1.)) * 250., hal = (hx < hy ? f.y : f.x) * 250.;
    float tw = mix(.5 + .5 * sin(hal * .9 + hsd * .8), .5, smoothstep(.6, 1.8, w)), hwd = 2.5 + .7 * tw, hr = clamp(border / hwd, 0., 1.);
    float sunx = dot(hax, normalize(uSun.xz)), flank = clamp(hsd / hwd, -1., 1.) * sunx;
    float hd = mix(.9 * boxcov(border, hwd, max(w, .8)), .55 * boxcov(border, max(3., .8 * w), w), hm);
    col *= 1. - .4 * boxcov(border - hwd - 3. * abs(sunx), 3. * abs(sunx), max(w, 1.)) * step(hsd * sunx, 0.) * (1. - hm);
    col = mix(col, uHedge * mix((.75 + 1.05 * (1. - hr * hr)) * (.72 + .56 * tw) * (1. + .3 * flank), 1.5, hm), hd);
    // the river: bright strands along its course; glints run down them by the place's clock
    float rx = p.x - riverX(p.y), rw = boxcov(abs(rx), 24., w), cr;
    float rc = mesh(2., vec2(rx, 0.), 5., 1.2, w, cr), gl = pow(.5 + .5 * sin(p.y / 13. - uTime * 1.7 + hash(vec2(floor(rx / 5.), 3.)) * 6.2832), 8.) * (1. - smoothstep(4., 14., w));
    col = mix(col, mix(uStrand * .34, uStrand * cr + gl * .7, rc), rw);
    // THE MIDDLE, UNMADE (BY PLACE): out to where the unmaking stands the skin is gone; heaps of paperclips lie on the
    // board (vCol.x: how high the heap), and round the pegs the board is bare
    // (its edge is ragged: three sizes of unevenness)
    float RU = clamp(uR.x + uR.y * (uS - uR.z), uR.x, uR.w), dC = length(p - uC.xy) + (noise(p / 420.) - .5) * 70. + (noise(p / 90.) - .5) * 44. + (noise(p / 27.) - .5) * 20.;
    // (the clips' own footprint: between the pixel's short and its long reach over the ground, so that clips near the
    // eye stay clips at a low angle; the head, 1)
    float wn = min(length(dFdx(p)), length(dFdy(p))), wc = mix(wn, w, .5), front = dC - RU, made = smoothstep(-wc, wc, front);
    // (no clip is drawn flat in the skin near the eye: there the clips are real ones, standing at their own angles, and
    // the skin is the bed under them, darker toward the eye; only far off, where they are small in the picture, great
    // flat clips of 56 m to a cell are drawn in it; the head, 1)
    float ccB, ccBs, wB = mix(wn, w, .3), nearB = smoothstep(1.1, 2.4, wB), clB = clips(p + 77.7, 56., 2., wB, .1, .4, ccB) * nearB, clBs = clips(p + 77.7 - uSun.xz * 6., 56., 2., wB, .1, .4, ccBs) * nearB, tB = mix(.2, 1., smoothstep(.66, 1.5, ccB));
    float cl = 0.;
    vec2 hq = (fract(p / 24.) - .5) * 24.; float hole = boxcov(length(hq), 1.6, w) * (1. - smoothstep(4., 14., w));
    // the board is of planks 30 m wide, each its own tone, with a seam between
    float plank = (.5 - abs(fract(p.x / 30.) - .5)) * 30.;
    // (and its grain runs along the planks: streaks of two sizes, lighter and darker, no two alike; they go into their mean with the footprint)
    float grain = mix(.6 * noise(vec2(p.x * 1.1, p.y / 26.)) + .4 * noise(vec2(p.x / 3.5 + 9., p.y / 70.)), .5, smoothstep(.6, 2.5, w));
    vec3 board = uBoard * (.86 + .28 * hash(vec2(floor(p.x / 30.), 7.))) * (.95 + .1 * noise(p / 11.)) * (.86 + .28 * grain) * (1. - .16 * hole) * (1. - .4 * boxcov(plank, .4, w) * (1. - smoothstep(3., 12., w)));
    // THE FIELDS OF CLIPS, far off: where a clip is only a few pixels long the rows go over into their mean on the
    // board, a pale band along each row (the same fields, ways and sizes as the clips themselves stand in; the head, 1)
    float fa = mod(id.x * 2. + id.y * 3., 6.), fm = mod(id.x + 2. * id.y, 3.), sz = fm < .5 ? 22. : (fm < 1.5 ? 28. : 36.);
    float rowD = abs(fract(rot(p, fa * .5236).y / (1.1 * sz)) - .5) * 1.1 * sz, radM = length(p - uC.xy);
    float rows = boxcov(rowD, .2 * sz, w) * smoothstep(.2 * sz, .3 * sz, wn) * smoothstep(10., 14., border) * step(258., radM) * step(radM, 965.) * step(radM + 70., RU);
    // each field's board has its own tone, and a furrow runs midway between its rows
    float inRows = smoothstep(10., 14., border) * step(258., radM) * step(radM, 965.);
    board *= mix(1., .86 + .28 * hash(id + 11.3), inRows) * (1. - .28 * boxcov(1.1 * sz * .5 - rowD, .7, w) * (1. - smoothstep(2., 6., w)) * inRows);
    board = mix(board, vec3(.6, .63, .68), rows * .7);
    // THE SILVER: paperclips lying on paperclips: the top ones bright steel, round (dark at their edges, bright along
    // their middle), their shadow on a finer, darker lot under them, and between those the dark. It catches the low
    // sun hard, it shows a little of the sky it faces, and it glitters (the head, 6)
    // the bed: the mean of clips lying on clips, uneven (two sizes, which go into their mean far off), darker toward the eye
    float deep = mix(.3, 1., smoothstep(.3, 2., wc));
    vec3 heap = vec3(.3, .315, .34) * deep * (.86 + .28 * mix(noise(p / 2.3), .5, smoothstep(.5, 2., wc))) * (.9 + .2 * mix(noise(p / 9. + 4.), .5, smoothstep(2., 8., wc)));
    // (near the eye the bed shows its own clips, small and dim: the deeper lot; they go into their mean with the footprint)
    float cf, clf = clips(p + 5.3, 7., .26, wc, .03, .1, cf); heap *= mix(.6, 1.55, clf);
    heap = mix(heap * (1. - .6 * clBs * (1. - clB)), vec3(.88, .9, .93) * tB, clB) * (.9 + .2 * noise(p / 170.));
    // the heaps' face is never flat: it tips this way and that (two sizes of unevenness, which go into their mean far off)
    // and the clips lie in swathes, ring within ring about the middle, one for every 55 m the unmaking has gone out:
    // each a low ridge, bright toward the sun and dark away from it (they go into their mean far off)
    vec2 outw = normalize(p - uC.xy + vec2(1e-3, 0.)); float ridge = -.3 * sin(6.2832 * dC / 55.) * (1. - smoothstep(12., 30., w));
    vec3 Nt = normalize(N + vec3(outw.x, 0., outw.y) * ridge + vec3(noise(p / 17.) - .5, 0., noise(p / 17. + 37.) - .5) * .3 * (1. - smoothstep(8., 30., w)) + vec3(noise(p / 4.5 + 11.) - .5, 0., noise(p / 4.5 + 71.) - .5) * .15 * (1. - smoothstep(2., 8., w)));
    vec3 Rf = reflect(-V, Nt), env = mix(vec3(.2, .21, .24), skyc(vec3(Rf.x, max(Rf.y, 0.), Rf.z)), smoothstep(-.25, .05, Rf.y));
    float rad = length(p - uC.xy), bare = 1. - smoothstep(.004, .03, vCol.x), sunny = 1. - .85 * heapShade(p);
    float kd = clamp(dot(N, uSun) * .9 + .1, 0., 1.), spec = max(dot(reflect(-uSun, N), V), 0.), kdT = clamp(dot(Nt, uSun) * .9 + .1, 0., 1.), specT = max(dot(reflect(-uSun, Nt), V), 0.);
    vec3 lightG = (mix(uGndC, uSkyC, .5 + .5 * N.y) * .55 + uSunC * kd * sunny) * shade(vW);
    // the glint (the head, 3): the country's wire catches the low sun
    vec3 madeC = col * lightG + uSunC * wire * catchS * pow(spec, 7.) * .5 * mix(1., .15, smoothstep(.8, 3., w)) * shade(vW) * sunny;      // (far off the glint is the mean of many: fainter)
    madeC += uSunC * mix(wire, vec3(1.), .4) * pull * .18 * shade(vW) * sunny;      // the pull's shiver catches the sun
    env = mix(vec3(dot(env, vec3(.3, .5, .2))), env, .4);                // steel shows the sky's light more than its colour
    vec3 fill = mix(vec3(.2, .19, .17), vec3(.5, .62, .85), .5 + .5 * Nt.y) * .42;
    float spk = (spark(p, 6., wc, 0.) + spark(p + 13.1, 24., wc, 1.) + spark(p + 57.3, 96., wc, 1.) + spark(p + 211.7, 384., wc, 1.)) * (.3 + .7 * sunny) * .5;
    vec3 silvC = (heap * (fill + uSunC * kdT * 1.25 * sunny) + max(cl, clB) * env * .22 + uSunC * ((.3 + .7 * max(cl, clB)) * (pow(specT, 12.) * .11 + pow(specT, 80.) * .5) * sunny * deep + spk * 2.2)) * shade(vW);
    col = mix(mix(silvC, board * lightG, bare), madeC, made);
    gl_FragColor = vec4(hazed(col, far), 1.); return; }
  vec2 p = vUV; float w = max(length(dFdx(p)), length(dFdy(p)));
  if (kind < 3.5) cov = mesh(kind, rot(p, vK.w), vK.y, vK.z, w, c);
  else if (kind < 4.5) { cov = 1.; c = 1.; }
  else cov = clips(p, vK.y, vK.z, w, .1, .4, c);
  // BY PLACE: ahead of where it is being wiped away, a skin's wire is already bent into paperclips
  float fz = 1. - prog, band = min(.45, prog * 3.), tz = fwidth(vU.z) + 1e-4, turn = prog > 0. ? smoothstep(fz - band - tz, fz - band + tz, vU.z) : 0.;
  vec3 wcol = wire * c;
  if (turn > 0.) { float ct, cv = clips(p, vK.y * 1.3, vK.y * .06, w, .1, .4, ct); wcol = mix(wcol, uSteel * .85 * ct, turn); gap = mix(gap, uSteel * vec3(.13, .17, .24), turn); wire = mix(wire, uSteel, turn); cov = mix(cov, cv, turn); }
  float kd = clamp(dot(N, uSun) * .9 + .1, 0., 1.), back = gl_FrontFacing ? 1. : .6;
  vec3 light = mix(mix(uGndC, uSkyC, .5 + .5 * N.y) * .55 + uSunC * kd, vec3(.5, .54, .6) * .9 + uSunC * kd * .16, turn) * shade(vW) * back;      // (a skin's wire turned to clips is steel: one plain mean of what thin steel shows, whichever way it is turned)
  vec3 glint = uSunC * wire * pow(max(dot(reflect(-uSun, N), V), 0.), 14.) * .45 * (1. - .6 * turn) * shade(vW);      // the glint (the head, 3)
#ifdef INST
  // a crown of mesh is open: only its wire is drawn, by how much of the pixel it covers, and one sees through it
  if (cov < .01) discard;
  gl_FragColor = vec4(hazed(wcol * light + glint, far), cov);
#else
  gl_FragColor = vec4(hazed(mix(gap, wcol, cov) * light + glint * cov, far), 1.);
#endif
}`,ge=(()=>{const v=ve(1);let d=0;for(let r=1;r<v.length;r++)d+=Math.hypot(v[r][0]-v[r-1][0],v[r][1]-v[r-1][1]);return d})(),ye=`
attribute vec2 aT;
#ifdef LENGTH
attribute vec4 iA, iB, iC, iD; attribute vec3 iCol;
#else
attribute vec3 aTan;
#ifdef STREAM
attribute vec4 iA, iB, iC, iD;
#else
attribute vec4 iK;
#endif
#endif
#ifdef CHAIN
uniform vec4 uChain, uChain2; uniform vec3 uAxis; uniform float uArc[9];
#endif
uniform float uS, uTime;
varying float vX, vT, vRun, vFade, vEnd, vGa; varying vec3 vTan, vW, vCol;
void main() {
  vec3 p, dir; float r, fat = 0., sc = 1., there = 1.; vFade = 1.; vRun = 0.; vT = aT.x; vGa = 0.;      // (there: how much of a clip is there, by place or by the clock; a clip that is not there leaves no dot)
#ifdef LENGTH
  float t = aT.x * (1. - clamp((uS - iD.x) / max(iD.y, 1.), 0., 1.));      // BY PLACE: the length draws back toward its root
  p = mix(mix(iA.xyz, iB.xyz, t), mix(iB.xyz, iC.xyz, t), t); dir = mix(iB.xyz - iA.xyz, iC.xyz - iB.xyz, t); r = iA.w; vCol = iCol;
  vRun = iD.z; vT = t * iD.w + iC.w * 97.;
#else
  vec4 P = vec4(position, 1.); vec3 T = aTan;
#ifdef CHAIN
  // the chain's clip number iK.z travels up the chain by the place's clock: u its share of the way. The chain rises
  // from the hub (uAxis) in one arc, straight up at first and level at last, into the way out (uChain: how many clips,
  // clips a second, how far the arc goes along the ground, how high; uChain2: its direction along the ground, a clip's
  // length; uArc: the arc's angle at every eighth of its length, so that the clips keep their distance). Each clip is
  // turned a quarter against the next, as links hang in a chain
  r = iK.x; vCol = vec3(iK.y); fat = 1.;
  float n = uChain.x, s = mod(iK.z + uTime * uChain.y, n), u = s / n, f8 = u * 8.; int i8 = int(min(floor(f8), 7.));
  float th = mix(uArc[i8], uArc[i8 + 1], f8 - float(i8)), kn = floor(iK.z + .5);
  // (and it bows out to one side on its way, uChain2.w at the most, so that from no place it stands as one line with the standing clip)
  vec3 e = vec3(uChain2.x, 0., uChain2.y), bowS = vec3(-e.z, 0., e.x), c0 = uAxis + e * (uChain.z * (1. - cos(th))) + vec3(0., uChain.w * sin(th), 0.) + bowS * (uChain2.w * sin(2. * th) * sin(2. * th));
  vec3 tg = normalize(e * (uChain.z * sin(th)) + vec3(0., uChain.w * cos(th), 0.) + bowS * (2. * uChain2.w * sin(4. * th))), out1 = normalize(cross(vec3(0., 1., 0.), tg) + vec3(1e-5, 0., 0.)), bn = cross(tg, out1);
  float L = uChain2.z, grow = smoothstep(0., .03, u), roll = (mod(kn, 2.) < .5 ? .785 : -.785) + .2 * sin(kn * 2.4);
  vec3 ax = cos(roll) * out1 + sin(roll) * bn;
  p = c0 + (ax * P.x + tg * P.y) * L * grow; dir = ax * T.x + tg * T.y; sc = L * grow; r *= sc; vFade = 1.; there = grow;
#else
#ifdef STREAM
  // a string of clips travelling down a drawn-off wire by the place's clock, from its far end (the thing coming
  // undone) to its root (the peg). iA, iB, iC: the wire's curve (iA.w the clip's gauge, iB.w its length, iC.w how
  // many on the wire); iD: the route metres between which the string runs (BY PLACE), this clip's number, clips a second
  r = iA.w; vCol = vec3(1.);
  float n = iC.w, t = 1. - fract((iD.z + uTime * iD.w) / n), on = smoothstep(iD.x, iD.x + 30., uS) * (1. - smoothstep(iD.y, iD.y + 30., uS));
  float k = on * smoothstep(0., .05, t) * (1. - smoothstep(.95, 1., t));
  vec3 c0 = mix(mix(iA.xyz, iB.xyz, t), mix(iB.xyz, iC.xyz, t), t), tg = normalize(mix(iA.xyz - iB.xyz, iB.xyz - iC.xyz, t)), ax = normalize(cross(vec3(0., 1., 0.), tg) + vec3(1e-5, 0., 0.));
  float roll = .5 * sin(iD.z * 1.7); vec3 up = cross(tg, ax); ax = cos(roll) * ax + sin(roll) * up;
  p = c0 + (ax * P.x + tg * P.y) * iB.w * k + vec3(0., .5 * iB.w * .3, 0.); dir = ax * T.x + tg * T.y; sc = iB.w * k; r *= sc;
#else
  // a clip placed by its matrix; iK.z to iK.w: the route metres between which it is there (BY PLACE), none: always.
  // (a tone written below nought marks a great clip: it is drawn at every distance. Any other is one of a field's rows:
  // vGa, its gauge, lets the pixel be measured in clip lengths, and it goes into its row's band far off as a card does; the head, 1)
  r = iK.x; vCol = vec3(abs(iK.y)); fat = iK.y < 0. ? 1. : 0.; vGa = fat > .5 ? 0. : iK.x;
  float k = iK.w > iK.z ? smoothstep(iK.z, iK.z + 14., uS) * (1. - smoothstep(iK.w, iK.w + 14., uS)) : 1.;
  p = (modelMatrix * instanceMatrix * vec4(P.xyz * k, 1.)).xyz; dir = mat3(modelMatrix) * mat3(instanceMatrix) * T; sc = length(mat3(instanceMatrix)[1]) * k; r *= sc; there = k;
#endif
#endif
#endif
  dir = normalize(dir + vec3(1e-6, 0., 0.));
  vec3 eye = cameraPosition - p; float dist = length(eye);
  vec3 side = normalize(cross(dir, eye) + vec3(0., 1e-6, 0.));
  float pix = dist * 2. / (projectionMatrix[1][1] * 360.);
#ifdef CHAIN
  r = max(r, .85 * pix * there);      // the chain is one line from afar: its wire never thinner than a pixel (the head, 2)
#else
  r = mix(r, max(r, .6 * pix * there), fat);
#endif
  float hw = r + (vGa > 0. ? 1.1 : .75) * pix;      // the head, 2
  p += side * aT.y * hw; vX = aT.y * hw / max(r, 1e-5); vTan = dir; vW = p;
#ifdef LENGTH
  vEnd = 1e3;
#else
  vEnd = min(aT.x, 1. - aT.x) * ${ge.toFixed(4)} * sc / max(r, 1e-5);      // how far from the clip's cut end, in half-widths of its wire
#endif
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
}`,be=`
varying float vX, vT, vRun, vFade, vEnd, vGa; varying vec3 vTan, vW, vCol;
uniform vec3 uSteel; uniform vec4 uGate;
${le}
#ifndef LENGTH
// what bright steel shows along a direction (the head, 3): the sky, warm and bright toward the sun and blue above; from
// below the board's brown and the far hills' dark under the sky's edge; and at the sky's edge what stands round it,
// dark hills and heaps and the bright gaps between (bands down an upright wire), and on down below the sky's edge, fainter
vec3 envW(vec3 Rr) { float az = dot(normalize(Rr.xz + vec2(1e-4, 0.)), normalize(uSun.xz));
  vec3 skyR = mix(vec3(.95, .8, .58), vec3(.28, .47, .78), smoothstep(0., .6, Rr.y)) * (.72 + .4 * az);
  vec3 gndR = mix(vec3(.3, .24, .19), vec3(.06, .07, .08), smoothstep(-.8, -.05, Rr.y));
  vec3 envc = mix(gndR, skyR, smoothstep(-.03, .05, Rr.y));
  float aa = atan(Rr.z, Rr.x), edge = mix(.75 * smoothstep(-.98, -.75, Rr.y), 1., smoothstep(-.22, -.02, Rr.y)) * (1. - smoothstep(.02, .3, Rr.y)), st = smoothstep(-.3, .3, sin(aa * 2. + 1.3) + .5 * sin(aa * 5. + .4));
  return mix(envc, mix(vec3(.08, .1, .1), vec3(.98, .93, .84), st), edge * .8); }
#endif
void main() {
#ifdef CHAIN
  if (dot(vW, uGate.xyz) > uGate.w) discard;      // BY PLACE: beyond the way out's own plane the chain is in the next world
#endif
  // (a row's clip of wire: never drawn thinner than the pixel is wide, and into its row's band where it is a few pixels long)
  float w = fwidth(vX), cov = boxcov(abs(vX), vGa > 0. ? max(1., .5 * w) : 1., w) * vFade * (1. - smoothstep(.2, .3, length(vec2(dFdx(vX), dFdy(vX))) * vGa));
  if (vEnd < 1.) cov *= 1. - smoothstep(1. - w, 1. + w, length(vec2(vX, 1. - vEnd)));      // a clip's wire ends round
  if (cov < .012) discard;
  vec3 col = vCol.y < -.5 ? uSteel : vCol;
#ifndef LENGTH
  col = uSteel * vCol.x;
#endif
  float far = length(cameraPosition - vW), x = clamp(vX, -1., 1.), thin = smoothstep(.7, 2.2, w);
  vec3 V = (cameraPosition - vW) / far, T = normalize(vTan), S = normalize(cross(T, V) + vec3(0., 1e-6, 0.)), F = cross(S, T);
  vec3 N = normalize(S * x + F * sqrt(1. - x * x)), H = normalize(V + uSun);
  // a round wire: by its own curve where it is some pixels wide; by its direction alone where it is thin (the mean of the round)
  float sT = sqrt(max(1. - dot(T, uSun) * dot(T, uSun), 0.)), kd = mix(clamp(dot(N, uSun) * .8 + .2, 0., 1.), .62 * sT + .1, thin);
  float sp = mix(pow(max(dot(N, H), 0.), 26.), .35 * pow(sqrt(max(1. - dot(T, H) * dot(T, H), 0.)), 26.), thin);
  vec3 lit = (col * (mix(uGndC, uSkyC, .5 + .5 * mix(N.y, 0., thin)) * .55 + uSunC * kd) + uSunC * mix(col, vec3(1.), .5) * sp * .9) * shade(vW);      // the glint (the head, 3)
  // BY THE PLACE'S CLOCK: glints run along a taut line (vRun: how fast, in metres a second)
#ifndef LENGTH
  // a paperclip is bright steel: across its round it shows the sky above and the ground below (the head, 3: envW).
  // What it shows goes over into the mean of its round as the wire grows narrow in the picture, from some seven pixels
  // across to two: a narrow wire with a bright and a dark half breaks into dots along a slant. The mean is of three
  // directions across the round (its middle and to either side), as a clip on a card has it
  { vec3 envc = envW(reflect(-V, N)); float nar = max(thin, smoothstep(.3, 1.1, w));
    if (nar > 0.) envc = mix(envc, (envW(reflect(-V, F)) + envW(reflect(-V, normalize(F * .66 + S * .75))) + envW(reflect(-V, normalize(F * .66 - S * .75)))) / 3., nar);
    lit = (col * (envc * .9 + uSunC * kd * .16) + uSunC * (sp * 1.4 + (1. - thin) * (2.2 * pow(max(dot(N, H), 0.), 140.) - .98 * pow(max(dot(N, H), 0.), 26.)))) * shade(vW); }
#endif
  if (vRun != 0.) lit += uSunC * .8 * pow(.5 + .5 * sin((vT - uTime * vRun) / 9.), 10.);
  gl_FragColor = vec4(hazed(lit, far), cov);
}`,Se=`
attribute vec4 iK; uniform float uS; varying vec2 vUV; varying vec3 vN, vTx, vTy, vW; varying vec4 vK; varying float vH;
void main() { float k = smoothstep(iK.z, iK.z + 14., uS); mat4 M = modelMatrix * instanceMatrix; vec4 w = M * vec4(position * k, 1.);
  vTx = mat3(M)[0]; vTy = mat3(M)[1]; vN = cross(vTx, vTy); vW = w.xyz; vUV = position.xy; vK = iK; vH = w.y - iK.w; gl_Position = projectionMatrix * viewMatrix * w; }`,Ce=`
varying vec2 vUV; varying vec3 vN, vTx, vTy, vW; varying vec4 vK; varying float vH; uniform vec3 uSteel, uHeap[10];
${le}
float heapShade(vec2 p) { vec2 d = -normalize(uSun.xz), n = vec2(-d.y, d.x); float k = length(uSun.xz) / uSun.y, sd = 0.;
  for (int i = 0; i < 10; i++) { vec2 v = p - uHeap[i].xy; float hh = uHeap[i].z, R = 1.6 * hh, a = dot(v, d), b = abs(dot(v, n));
    sd = max(sd, smoothstep(0., 10., R * 1.1 * (1. - a / (k * hh)) - b) * smoothstep(0., .4 * R, a)); }
  return sd; }
// what bright steel shows along a direction: the sky (warm and bright toward the sun, blue above) or the dark of the pile
vec3 envOf(vec3 Rr) { float az = dot(normalize(Rr.xz + vec2(1e-4, 0.)), normalize(uSun.xz));
  vec3 skyR = mix(vec3(.95, .8, .58), vec3(.22, .37, .64), smoothstep(0., .6, Rr.y)) * (.72 + .4 * az);
  vec3 gndR = mix(vec3(.3, .24, .19), vec3(.06, .07, .08), smoothstep(-.8, -.05, Rr.y));
  vec3 envc = mix(gndR, skyR, smoothstep(-.03, .05, Rr.y));
  float aa = atan(Rr.z, Rr.x), edge = smoothstep(-.22, -.02, Rr.y) * (1. - smoothstep(.02, .3, Rr.y)), st = smoothstep(-.3, .3, sin(aa * 2. + 1.3) + .5 * sin(aa * 5. + .4));
  return mix(envc, mix(vec3(.08, .1, .1), vec3(.98, .93, .84), st), edge * .8); }
void main() {
  vec2 p = vUV; float wx = length(dFdx(p)), wy = length(dFdy(p)), w = max(wx, wy), wi = min(wx, wy), d = clipd(p), far = length(cameraPosition - vW);
  // the wire is never drawn thinner than the pixel is wide (the gauge grows); a clip only a few pixels long goes into
  // its row's band on the board, which the land draws from the same measure (the head, 1). Along its legs the pixel is
  // measured across them (wl), so that a clip seen from above keeps its legs as lines; at its bends, the pixel's widest reach
  float wl = mix(length(vec2(dFdx(p.x), dFdy(p.x))), w, max(smoothstep(.16, .3, p.y), 1. - smoothstep(-.34, -.2, p.y)));
  // (a tone written below nought marks a clip lying on a heap: that one keeps its own gauge and goes into the heap's
  // bed where its wire is well under a pixel wide, so that a far heap is its bed and its great clips and not a noise of strokes)
  bool heap = vK.y < 0.;
  float r = heap ? vK.x : min(max(vK.x, .5 * wl), .2), cov = heap ? boxcov(d, r, w) * (1. - smoothstep(2.2, 4.5, w / r)) : boxcov(d, r, wl) * (1. - smoothstep(.2, .3, wi));
  if (cov < .012) discard;
#ifdef SHADOW
  gl_FragColor = vec4(mix(vec3(1.), vec3(.375, .558, .8), .7 * cov * (1. - uHaze.z * smoothstep(uHaze.x, uHaze.y, far)) * (1. - .8 * heapShade(vW.xz))), 1.);
#else
  float e = max(.5 * w, .004); vec2 g = normalize(vec2(clipd(p + vec2(e, 0.)) - clipd(p - vec2(e, 0.)), clipd(p + vec2(0., e)) - clipd(p - vec2(0., e))) + vec2(1e-5, 0.));
  vec3 V = (cameraPosition - vW) / far, Tx = normalize(vTx), Ty = normalize(vTy), G = Tx * g.x + Ty * g.y, T = normalize(Ty * g.x - Tx * g.y);
  vec3 S = normalize(cross(T, V) + vec3(0., 1e-6, 0.)), F = cross(S, T);
  float x = clamp(d / r, 0., 1.) * (dot(G, S) < 0. ? -1. : 1.), thin = smoothstep(.7, 2.2, w / r);
  vec3 N = normalize(S * x + F * sqrt(1. - x * x)), H = normalize(V + uSun), col = uSteel * abs(vK.y);
  float sT = sqrt(max(1. - dot(T, uSun) * dot(T, uSun), 0.)), kd = mix(clamp(dot(N, uSun) * .8 + .2, 0., 1.), .62 * sT + .1, thin);
  float sp = mix(pow(max(dot(N, H), 0.), 26.), .35 * pow(sqrt(max(1. - dot(T, H) * dot(T, H), 0.)), 26.), thin), sunny = 1. - .7 * heapShade(vW.xz);
  // deep in the pile a clip stands among the others: it is darker toward its foot, and what it shows from below is the
  // dark of the pile, not the fields (vH: how high over the ground; iK.w)
  float occ = mix(.5, 1., smoothstep(.5, 9., vH));
  // (a wire too thin to show its round shows the mean of what its round would: the head, 1)
  vec3 envc = envOf(reflect(-V, N));
  if (thin > 0.) envc = mix(envc, (envOf(reflect(-V, F)) + envOf(reflect(-V, normalize(F * .66 + S * .75))) + envOf(reflect(-V, normalize(F * .66 - S * .75)))) / 3., thin);
  vec3 lit = (col * (envc * mix(.5, 1., sunny) + uSunC * kd * .35 * sunny) * occ + uSunC * (sp * 2.4 + (1. - thin) * (2.2 * pow(max(dot(N, H), 0.), 140.) - 1.68 * pow(max(dot(N, H), 0.), 26.))) * sunny * mix(.5, 1., occ)) * shade(vW);
  gl_FragColor = vec4(hazed(lit, far), cov);
#endif
}`,ke="varying vec3 vD; void main() { vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",ze=`
uniform vec3 uSun, uZen, uMid, uHor, uGlow; varying vec3 vD;
void main() { vec3 d = normalize(vD); float y = d.y;
  vec3 c = mix(uHor, uMid, smoothstep(-.02, .2, y)); c = mix(c, uZen, smoothstep(.12, .8, y));
  float s = max(dot(d, uSun), 0.); c += uGlow * (pow(s, 6.) * .12 + pow(s, 80.) * .28 + pow(s, 1500.) * .9 + smoothstep(.99982, .99992, s) * .8);
  gl_FragColor = vec4(c, 1.); }`,Ae=`
attribute vec2 iW; varying vec3 vN, vW, vP; varying vec2 vI;
void main() { vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.); vN = mat3(modelMatrix) * mat3(instanceMatrix) * normal; vW = w.xyz; vP = position; vI = iW; gl_Position = projectionMatrix * viewMatrix * w; }`,Me=`
varying vec3 vN, vW, vP; varying vec2 vI; uniform vec3 uWool;
${le}
void main() { vec3 N = normalize(vN); float far = length(cameraPosition - vW); vec3 V = (cameraPosition - vW) / far;
  float rim = clamp(dot(N, V), 0., 1.), a = smoothstep(.0, .75, rim);                     // the head, 5
  vec2 p = vP.xy * 4. + vP.z * 2.6 + vI.x * 40.; float w = max(length(dFdx(p)), length(dFdy(p)));
  // the wool's fibres: curls of fine wire, going into their mean with the footprint
  float curl = abs(sin(p.x * 3. + 2.6 * noise(p * 1.4)) * sin(p.y * 3.3 + 2.6 * noise(p * 1.4 + 5.))), fib = mix(1. - smoothstep(.03, .12 + w, curl), .2, smoothstep(.015, .09, w));
  float kd = clamp(dot(N, uSun) * .55 + .45, 0., 1.), under = smoothstep(-.7, .5, N.y);
  vec3 col = uWool * (.8 + .2 * noise(p * .3)) * (mix(uSkyC * vec3(.66, .7, .8), uSkyC, under) * .78 + uSunC * kd * .5) + uSunC * fib * (.03 + .08 * kd);
  gl_FragColor = vec4(hazed(col, far * .12), a * vI.y); }`,Te=`
attribute vec4 aS; attribute vec2 aQ; uniform float uS; varying vec2 vQ; varying float vA, vK; varying vec3 vW;
void main() { vQ = aQ; vA = aS.z * (1. - clamp((uS - aS.x) / max(aS.y, 1.), 0., 1.)); vK = aS.w; vW = position; gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.); }`,Be=`
varying vec2 vQ; varying float vA, vK; varying vec3 vW; uniform vec3 uHaze;
void main() { float a = vQ.x, b = vQ.y, sd, mid = (vK + 1.) * .5;
  if (vK > 0.) sd = max(1. - smoothstep(.7, 1., length(vec2((a - mid) / max((1. - vK) * .5, 1e-3), b))), (1. - smoothstep(.05, .13, abs(b))) * (1. - step(mid, a)));
  else sd = (1. - smoothstep(.82, 1., abs(b))) * (1. - smoothstep(.88, 1., a));
  float al = sd * vA * (1. - uHaze.z * smoothstep(uHaze.x, uHaze.y, length(cameraPosition - vW)));
  if (al < .01) discard; gl_FragColor = vec4(.008, .012, .016, al * .8); }`;function ve(v=1){const d=[],r=(C,b,S,k,N,B)=>{B=Math.max(3,Math.round(B*v));for(let F=1;F<=B;F++){const I=k+(N-k)*F/B;d.push([C+S*Math.cos(I),b+S*Math.sin(I)])}},x=Math.PI;return d.push([-.14,.22],[-.14,-.36]),r(0,-.36,.14,x,2*x,10),d.push([.14,.39]),r(.03,.39,.11,0,x,9),d.push([-.08,-.24]),r(0,-.24,.08,x,2*x,7),d.push([.08,.2]),d}function Ke(v={}){const d=e=>new o.Vector3(e[0],e[1],e[2]),r=new o.Vector3(...v.sun||[-.85,.4,.3]).normalize(),x={uS:{value:0},uTime:{value:0},uSun:{value:r},uSunC:{value:d(g("#FFCB8A")).multiplyScalar(1.2)},uSkyC:{value:d(g("#BCD0EE"))},uGndC:{value:d(g("#B9A98A"))},uHazeC:{value:d(g("#EFE4CF"))},uHaze:{value:new o.Vector3(900,9e3,.55)},uZen:{value:d(g("#5A88CC"))},uMid:{value:d(g("#CFE0E6"))},uHor:{value:d(g("#F8CF94"))},uC:{value:new o.Vector4(0,3e3,0,0)},uR:{value:new o.Vector4(620,.2,500,1050)},uChain:{value:new o.Vector4(120,.5,4,1800)},uChain2:{value:new o.Vector4(110,60,46,0)},uAxis:{value:new o.Vector3(0,0,3e3)},uArc:{value:[0,.2,.4,.6,.8,1,1.2,1.4,1.5708]},uGate:{value:new o.Vector4(0,0,1,1e9)},uCloud:{value:Array.from({length:11},()=>new o.Vector4(0,1e7,0,1))},uFlock:{value:new o.Vector3},uHeap:{value:Array.from({length:10},()=>new o.Vector3(0,0,.001))}};for(const e of["board","green","copper","brass","straw","kale","sage","zinc","hedge","strand","steel","wool"])x["u"+e[0].toUpperCase()+e.slice(1)]={value:d(pe[e])};const C=e=>new o.ShaderMaterial({uniforms:x,vertexShader:we,fragmentShader:xe,side:o.DoubleSide,defines:e?{INST:1}:{},transparent:!!e,depthWrite:!e}),b=C(!1),S=C(!0),k=e=>new o.ShaderMaterial({uniforms:x,vertexShader:ye,fragmentShader:be,side:o.DoubleSide,transparent:!0,depthWrite:!0,defines:e}),N=k({LENGTH:1}),B=k({CLIPS:1}),F=k({CHAIN:1}),I=k({STREAM:1}),z=(e,i)=>new o.BufferAttribute(new Float32Array(e),i),ee=()=>{const e=[],i=[],s=[],c=[],n=[],t=[],h=[];let l=0,p=0;return{add:(f,y,m={})=>{const a=f.length,A=!m.norms,H=m.norms||new Float64Array(a*3),ie=m.col||[1,1,1];for(let T=0;T<y.length;T+=3){const Z=y[T],V=y[T+1],W=y[T+2],M=f[Z],_=f[V],j=f[W],oe=(_[1]-M[1])*(j[2]-M[2])-(_[2]-M[2])*(j[1]-M[1]),de=(_[2]-M[2])*(j[0]-M[0])-(_[0]-M[0])*(j[2]-M[2]),ue=(_[0]-M[0])*(j[1]-M[1])-(_[1]-M[1])*(j[0]-M[0]);if(!(oe*oe+de*de+ue*ue<1e-12)){if(A)for(const fe of[Z,V,W])H[fe*3]+=oe,H[fe*3+1]+=de,H[fe*3+2]+=ue;h.push(l+Z,l+V,l+W),p++}}for(let T=0;T<a;T++){const Z=Math.hypot(H[T*3],H[T*3+1],H[T*3+2])||1,V=m.cols?m.cols[T]:ie,W=m.uv?m.uv[T]:[0,0];e.push(f[T][0],f[T][1],f[T][2]),i.push(H[T*3]/Z,H[T*3+1]/Z,H[T*3+2]/Z),s.push(V[0],V[1],V[2]),c.push(m.kind??me.hex,m.cell??3,m.wire??.2,m.ang??0),n.push(m.s0??1e9,m.span??1,m.wipe?m.wipe[T]:0),t.push(W[0],W[1])}l+=a},geometry:()=>{const f=new o.BufferGeometry;return f.setAttribute("position",z(e,3)),f.setAttribute("normal",z(i,3)),f.setAttribute("aCol",z(s,3)),f.setAttribute("aK",z(c,4)),f.setAttribute("aU",z(n,3)),f.setAttribute("aUV",z(t,2)),f.setIndex(l>65535?new o.BufferAttribute(new Uint32Array(h),1):new o.BufferAttribute(new Uint16Array(h),1)),f.computeBoundingSphere(),f},tris:()=>p}},Q=(e,i)=>{const s=new o.Mesh(e.geometry(),b);return s.name=i||"skin",s.frustumCulled=!1,s},he=(e,i,s)=>{const c=e.geometry(),n=new o.InstancedBufferAttribute(new Float32Array(i*3),3),t=new o.InstancedBufferAttribute(new Float32Array(i*4),4),h=new o.InstancedBufferAttribute(new Float32Array(i*2),2);c.setAttribute("iCol",n),c.setAttribute("iK",t),c.setAttribute("iU",h);const l=new o.InstancedMesh(c,S,i);return l.name=s||"skins",l.frustumCulled=!1,l.renderOrder=2,{mesh:l,set:(u,w,f,y,m,a,A,H,ie)=>{l.setMatrixAt(u,w),n.setXYZ(u,f[0],f[1],f[2]),t.setXYZW(u,y,m,a,A),h.setXY(u,H??1e9,ie??1)},tris:e.tris()*i}},te=4,se=e=>{const i=[],s=[];for(let c=0;c<=e;c++)i.push(c/e,-1,c/e,1);for(let c=0;c<e;c++){const n=c*2;s.push(n,n+1,n+3,n,n+3,n+2)}return{t:i,ix:s}},ce=e=>{const i=[],s=(t,h,l,p,u,w={})=>{i.push({p0:t,p1:h,p2:l,r:p,col:u,s0:w.s0??1e9,span:w.span??1,run:w.run||0,seed:w.seed??(t[0]*.013+l[2]*.007)%1})};return{add:s,line:(t,h,l,p,u)=>s(t,[(t[0]+h[0])/2,(t[1]+h[1])/2,(t[2]+h[2])/2],h,l,p,u),done:()=>{i.sort((a,A)=>A.p0[2]+A.p2[2]-(a.p0[2]+a.p2[2]));const t=i.length,h=new Float32Array(t*4),l=new Float32Array(t*4),p=new Float32Array(t*4),u=new Float32Array(t*4),w=new Float32Array(t*3);i.forEach((a,A)=>{const H=Math.hypot(a.p1[0]-a.p0[0],a.p1[1]-a.p0[1],a.p1[2]-a.p0[2])+Math.hypot(a.p2[0]-a.p1[0],a.p2[1]-a.p1[1],a.p2[2]-a.p1[2]);h.set([a.p0[0],a.p0[1],a.p0[2],a.r],A*4),l.set([a.p1[0],a.p1[1],a.p1[2],0],A*4),p.set([a.p2[0],a.p2[1],a.p2[2],a.seed],A*4),u.set([a.s0,a.span,a.run,H],A*4),w.set(a.col,A*3)});const f=se(te),y=new o.InstancedBufferGeometry;y.setAttribute("position",z(new Array((te+1)*6).fill(0),3)),y.setAttribute("aT",z(f.t,2)),y.setIndex(f.ix);for(const[a,A,H]of[["iA",h,4],["iB",l,4],["iC",p,4],["iD",u,4],["iCol",w,3]])y.setAttribute(a,new o.InstancedBufferAttribute(A,H));y.instanceCount=t;const m=new o.Mesh(y,N);return m.name=e||"lengths",m.frustumCulled=!1,m.renderOrder=5,{mesh:m,count:t,tris:t*te*2}},list:i}},$=e=>{const i=ve(e),s=i.length,c=[],n=[],t=[],h=[],l=[0];for(let u=1;u<s;u++)l.push(l[u-1]+Math.hypot(i[u][0]-i[u-1][0],i[u][1]-i[u-1][1]));for(let u=0;u<s;u++){const w=i[Math.max(0,u-1)],f=i[Math.min(s-1,u+1)],y=Math.hypot(f[0]-w[0],f[1]-w[1])||1;for(const m of[-1,1])c.push(i[u][0],i[u][1],0),n.push((f[0]-w[0])/y,(f[1]-w[1])/y,0),t.push(l[u]/l[s-1],m)}for(let u=0;u<s-1;u++){const w=u*2;h.push(w,w+1,w+3,w,w+3,w+2)}const p=new o.BufferGeometry;return p.setAttribute("position",z(c,3)),p.setAttribute("aTan",z(n,3)),p.setAttribute("aT",z(t,2)),p.setIndex(h),{g:p,tris:(s-1)*2}},P=(e,i,s=1)=>{const{g:c,tris:n}=$(s),t=new o.InstancedBufferAttribute(new Float32Array(e*4),4);c.setAttribute("iK",t);const h=new o.InstancedMesh(c,B,e);return h.name=i||"clips",h.frustumCulled=!1,h.renderOrder=6,{mesh:h,set:(p,u,w,f,y,m)=>{h.setMatrixAt(p,u),t.setXYZW(p,w,f??1,y??0,m??0)},tris:n*e}},K=(e,i=.5)=>{const s=[];return{add:(t,h,l,p)=>{for(let u=0;u<p.n;u++)s.push({p0:t,p1:h,p2:l,q:p,j:u})},done:()=>{const{g:t,tris:h}=$(i),l=new o.InstancedBufferGeometry,p=s.length,u=new Float32Array(p*4),w=new Float32Array(p*4),f=new Float32Array(p*4),y=new Float32Array(p*4);l.index=t.index;for(const a of["position","aTan","aT"])l.setAttribute(a,t.getAttribute(a));s.forEach((a,A)=>{u.set([a.p0[0],a.p0[1],a.p0[2],a.q.gauge??.028],A*4),w.set([a.p1[0],a.p1[1],a.p1[2],a.q.len],A*4),f.set([a.p2[0],a.p2[1],a.p2[2],a.q.n],A*4),y.set([a.q.s0,a.q.s1,a.j,a.q.rate??.4],A*4)});for(const[a,A]of[["iA",u],["iB",w],["iC",f],["iD",y]])l.setAttribute(a,new o.InstancedBufferAttribute(A,4));l.instanceCount=p;const m=new o.Mesh(l,I);return m.name=e||"streams",m.frustumCulled=!1,m.renderOrder=6,{mesh:m,count:p,tris:h*p}}}},U=(e,i)=>{const{g:s,tris:c}=$(1),n=new o.InstancedBufferGeometry;n.index=s.index;for(const l of["position","aTan","aT"])n.setAttribute(l,s.getAttribute(l));const t=new Float32Array(e*4);for(let l=0;l<e;l++)t.set([.042,1,l,0],l*4);n.setAttribute("iK",new o.InstancedBufferAttribute(t,4)),n.instanceCount=e;const h=new o.Mesh(n,F);return h.name=i||"chain",h.frustumCulled=!1,h.renderOrder=4,{mesh:h,tris:c*e}},L=e=>new o.ShaderMaterial({uniforms:x,vertexShader:Se,fragmentShader:Ce,side:o.DoubleSide,transparent:!0,depthWrite:!e,defines:e?{SHADOW:1}:{},polygonOffset:!!e,polygonOffsetFactor:e?-2:0,polygonOffsetUnits:e?-2:0,...e?{blending:o.CustomBlending,blendEquation:o.AddEquation,blendSrc:o.DstColorFactor,blendDst:o.ZeroFactor,blendSrcAlpha:o.ZeroFactor,blendDstAlpha:o.OneFactor}:{}}),ne=L(!1),O=L(!0),D=(e,i,s)=>{const c=new o.BufferGeometry;c.setAttribute("position",z([-.4,-.76,0,.4,-.76,0,.4,.76,0,-.4,.76,0],3)),c.setIndex([0,1,2,0,2,3]);const n=new o.InstancedBufferAttribute(new Float32Array(e*4),4);c.setAttribute("iK",n);const t=new o.InstancedMesh(c,s?O:ne,e);return t.name=i,t.frustumCulled=!1,t.renderOrder=s?1:6,{mesh:t,set:(h,l,p,u,w,f)=>{t.setMatrixAt(h,l),n.setXYZW(h,p,u??1,w??-1e9,f??-1e9)},tris:2*e}},G=new o.Matrix4,X=(e,i,s,c)=>{const n=r.x*s[0]+r.y*s[1]+r.z*s[2];if(n<.15)return null;const t=(i[0]*s[0]+i[1]*s[1]+i[2]*s[2])/n,h=s[0]/n,l=s[1]/n,p=s[2]/n;return G.set(1-r.x*h,-r.x*l,-r.x*p,r.x*t,-r.y*h,1-r.y*l,-r.y*p,r.y*t,-r.z*h,-r.z*l,1-r.z*p,r.z*t,0,0,0,1),c.multiplyMatrices(G,e)},J=new o.ShaderMaterial({uniforms:x,vertexShader:Te,fragmentShader:Be,side:o.DoubleSide,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),R=e=>{const i=[],s=[],c=[],n=[];let t=0;const h=Math.hypot(r.x,r.z),l=-r.x/h,p=-r.z/h;return{add:(f,y,m,a,A,H,ie,T,Z)=>{const V=Math.max(2,Math.ceil(m/45));for(let W=0;W<=V;W++)for(const M of[-1,1]){const _=W/V,j=f+l*m*_-p*a*M,oe=y+p*m*_+l*a*M;i.push(j,Z(j,oe)+.7,oe),s.push(_,M),c.push(ie??1e9,T??1,H,A)}for(let W=0;W<V;W++){const M=t+W*2;n.push(M,M+1,M+3,M,M+3,M+2)}t+=(V+1)*2},done:()=>{const f=new o.BufferGeometry;f.setAttribute("position",z(i,3)),f.setAttribute("aQ",z(s,2)),f.setAttribute("aS",z(c,4)),f.setIndex(t>65535?new o.BufferAttribute(new Uint32Array(n),1):new o.BufferAttribute(new Uint16Array(n),1));const y=new o.Mesh(f,J);return y.name=e||"shadows",y.frustumCulled=!1,y.renderOrder=1,{mesh:y,tris:n.length/3}},reach:h/r.y}},Y=new o.ShaderMaterial({uniforms:{uSun:{value:r},uZen:{value:d(g("#5A88CC"))},uMid:{value:d(g("#CFE0E6"))},uHor:{value:d(g("#F8CF94"))},uGlow:{value:d(g("#FFE2A8"))}},vertexShader:ke,fragmentShader:ze,side:o.BackSide,depthWrite:!1,depthTest:!1}),ae=e=>{const i=new o.Mesh(new o.SphereGeometry(e,32,16),Y);return i.name="sky",i.frustumCulled=!1,i.renderOrder=-10,i},E=new o.ShaderMaterial({uniforms:x,vertexShader:Ae,fragmentShader:Me,transparent:!0,depthWrite:!1});return{uniforms:x,sun:r,sheet:ee,mesh:Q,many:he,lengths:ce,clipsMany:P,streams:K,chain:U,sky:ae,wool:e=>{const i=new o.IcosahedronGeometry(1,2),s=new o.InstancedBufferAttribute(new Float32Array(e*2),2);i.setAttribute("iW",s);const c=new o.InstancedMesh(i,E,e);return c.name="wool",c.frustumCulled=!1,c.renderOrder=1,{mesh:c,set:(n,t,h,l)=>{c.setMatrixAt(n,t),s.setXY(n,h,l??1)},tris:320*e}},shadows:R,cards:D,shadowOf:X}}function Re(v,d=8,r=5){const x=[],C=[],b=[],S=[];for(let k=0;k<=r;k++)for(let N=0;N<=d;N++){const B=N/d*Math.PI*2,F=(k/r-.5)*Math.PI;x.push([Math.cos(F)*Math.cos(B),Math.sin(F),Math.cos(F)*Math.sin(B)]),b.push([B,F*1.2]),S.push(.5+.5*Math.cos(F)*Math.cos(B))}for(let k=0;k<r;k++)for(let N=0;N<d;N++){const B=k*(d+1)+N,F=B+1,I=B+d+1,z=I+1;C.push(B,I,z,B,z,F)}return v.add(x,C,{uv:b,wipe:S}),v}function Ne(v,d,r,x,C,b,S={}){const k=S.bark||pe.bark,N=S.leaf||pe.leaf,B=S.wires||5,F=(S.gauge||.011)*C,I=S.s0??1e9,z=S.span??1,ee=Math.PI*2,Q=(P,K=.07)=>I>1e8?{}:{s0:I+P*z,span:z*K},he=.42*C,te=ee*(.7+.5*b()),se=b()*ee,ce=.028*C,$=(P,K)=>{const U=se+P/B*ee+te*K,L=ce*(1-.35*K);return[d+L*Math.cos(U),r+he*K,x+L*Math.sin(U)]};for(let P=0;P<B;P++){for(let D=0;D<3;D++){const G=D/3,X=(D+1)/3,J=$(P,G),R=$(P,X),Y=$(P,(G+X)/2);v.add(J,[2*Y[0]-(J[0]+R[0])/2,Y[1],2*Y[2]-(J[2]+R[2])/2],R,F,k,Q(.9+.03*(2-D),.035))}const K=$(P,1),U=se+P/B*ee+te+.5*(b()-.5),L=(.2+.16*b())*C,ne=(.2+.2*b())*C,O=[K[0]+L*Math.cos(U),K[1]+ne,K[2]+L*Math.sin(U)];v.add(K,[K[0]+.25*L*Math.cos(U),K[1]+.75*ne,K[2]+.25*L*Math.sin(U)],O,F*.9,k,Q(.84,.05));for(let D=0;D<3;D++){const G=U+(D-1)*.9+.4*(b()-.5),X=(.12+.12*b())*C,J=(.08+.16*b())*C,R=[O[0]+X*Math.cos(G),O[1]+J,O[2]+X*Math.sin(G)];v.add(O,[O[0]+.3*X*Math.cos(G),O[1]+.8*J,O[2]+.3*X*Math.sin(G)],R,F*.75,k,Q(.76+.03*b(),.05));const Y=S.twigs??1;for(let ae=0;ae<Y;ae++){let E=R,q=.04+.36*b(),e=null;if(Y>1){const i=G+(ae-(Y-1)/2)*1.1+.5*(b()-.5),s=(.07+.08*b())*C,c=(.02+.12*b())*C;E=[R[0]+s*Math.cos(i),R[1]+c,R[2]+s*Math.sin(i)],e=[R[0]+.4*s*Math.cos(i),R[1]+.9*c,R[2]+.4*s*Math.sin(i)]}S.toward&&(q=.04+.36*Math.min(1,Math.max(0,.5-((E[0]-d)*S.toward[0]+(E[2]-x)*S.toward[1])/(.8*C)+.12*(q-.24)))),e&&v.add(R,e,E,F*.6,k,Q(q+.3,.05));for(let i=0;i<(S.loops??3);i++){const s=b()*ee,c=b()*2-.6,n=(.04+.035*b())*C,t=[Math.cos(s),c*.6,Math.sin(s)],h=[E[0]+t[0]*n*2,E[1]+t[1]*n*2+n,E[2]+t[2]*n*2],l=-t[2]*n*1.6,p=t[0]*n*1.6;v.add(E,[E[0]+l+t[0]*n,E[1]+t[1]*n,E[2]+p+t[2]*n],h,F*.55,N,Q(q,.04)),v.add(h,[E[0]-l+t[0]*n,E[1]+t[1]*n+n*.4,E[2]-p+t[2]*n],E,F*.55,N,Q(q+.04,.04)),S.onClip&&I<1e8&&S.onClip(E,[t[0]*2,t[1]*2+1,t[2]*2],2.3*n,I+(q+.03)*z,I+(e?q+.3:.72)*z)}}}}}export{pe as COL,me as KIND,Re as ball,ve as clipPath,Ke as makeWirework,Fe as mix,He as noise,Ee as ss,Ne as wireTree};
