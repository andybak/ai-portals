import*as o from"three";import{mergeGeometries as Q}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as J,lerp as re}from"../kit/core.js";const ie=["#F1F3EE","#C3CAC8","#8EA89C","#0E6F57","#0A4638","#D7281E","#6C9BC7"],Me=["milk","pearl","greyGreen","viridian","deep","scarlet","blue"],k={R:30,drumH:10,apexY:40,bays:48,lanesPerBay:8,rosetteR:15,poolR:14},W=Math.PI*2,H=`
uniform float uTime;
uniform vec3 uLens;        // world position of the lens (camera), set every frame by style.update
uniform vec3 cMilk, cPearl, cGrey, cVirid, cDeep, cScarlet, cBlue;
float h11(float n){ return fract(sin(n * 127.1 + 1.7) * 43758.5453); }
// 1 inside an arch opening cut in a shell (object space; cutA faces +Z, cutB faces -Z; each = halfWidth, height, rise, on)
float archCut(vec3 op, vec4 cutA, vec4 cutB){
  vec4 c = mix(cutB, cutA, step(0., op.z));
  float x = op.x / max(c.x, 1e-3);
  float top = c.y - c.z + c.z * sqrt(max(0., 1. - x * x));
  return step(abs(x), 1.) * step(op.y, top) * c.w;
}
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float contactS(float d){ return pow(clamp((d - 1.5) / 28.5, 1e-5, 1.), 0.52); }
// what a clear track shows: blue high, pearl lower, snow white at the foot (y = up component, -1..1)
vec3 trackSky(float y){
  vec3 c = mix(cPearl, cBlue, smoothstep(0.12, 0.62, y));
  return mix(mix(cMilk, cPearl, 0.42), c, smoothstep(-0.06, 0.1, y));   // the snow outside is a tone darker than the glass
}
// leaf colour by contact, printed in three flat inks so three depths read in one frame: at the lens the deep green
// carries the blade (viridian only on its ribs and lit pleats), by a few metres full viridian, by 9 m grey-green, milk far away
vec3 leafTint(float s, float fold){
  float hand = 1. - smoothstep(0.0, 0.2, s);                              // within arm's reach
  vec3 near = mix(cVirid, cDeep, clamp(fold + 0.5 * hand, 0., 1.));
  near = mix(near, cDeep * 0.82, hand * smoothstep(0.55, 1., fold) * 0.6);   // the fold of a leaf in contact: the darkest ink in the house
  vec3 c = mix(near, cGrey, smoothstep(0.2, 0.56, s));
  return mix(c, cMilk, smoothstep(0.52, 1.0, s) * 0.86);
}
// THE SECOND KEY (polish 4). The sun, low behind the thin overcast, comes through the ribbed glass and is printed where it
// falls on anything level (floor, water, mist) as flat, hard-edged bands of one pale gold: one band to each bay between
// ribs, each bay let through a little more or less by its fog. Never a gradient, never
// a cast shadow of a thing. Bands lie 13 m apart and slanted to the course, so under the lens they pass less than twice a second.
uniform vec3 cSun; uniform vec4 uSun;      // uSun: xy unit direction across the bands (world xz), z period in metres, w strength
float sunBand(vec2 p, float px){
  float per = max(uSun.z, 1.);
  float t = dot(p, uSun.xy) / per + 0.07 * sin(dot(p, vec2(-uSun.y, uSun.x)) * 0.05);
  float f = fract(t), w = clamp(px / per, 1e-4, 0.2);
  float band = smoothstep(0.1 - w, 0.1 + w, f) * (1. - smoothstep(0.58 - w, 0.58 + w, f));
  // (no bars ruled inside a band: a thin line across the course passes under the lens as a flick; the band's two edges pass about 1.5 times a second)
  return band * (0.72 + 0.28 * h11(floor(t) * 3.7 + 0.5)) * uSun.w;
}
// the same light on anything that stands in it: a bay's beam leans as it comes down, so a thing at height y is lit where
// the floor band, carried up the beam, meets it. Trunks, leaves and the mist shelves are cut by the same flat bands.
float sunAt(vec3 p, float px){ return sunBand(p.xz + uSun.xy * (0.9 * p.y), px); }
`,ee=`
uniform sampler2D uAtlas;
float dapple(vec2 p, float px){
  float m = 0.;
  float lod = clamp(log2(max(px / 0.014, 1.)), 0., 6.);
  float w = clamp(0.06 + px * 0.25, 0.06, 0.3);
  float seen = 1. - smoothstep(0.5, 1.6, px);
  for (int k = 0; k < 2; k++) {
    float fk = float(k);
    vec2 g = p / (4.4 + 1.9 * fk) + fk * 13.7;
    vec2 id = floor(g), f = fract(g) - 0.5;
    float r1 = h21(id + 3.1 + fk), r2 = h21(id + 7.7 + fk * 2.3);
    float a = r1 * 6.2831853 + 0.07 * sin(uTime * 0.6 + r1 * 40.), ca = cos(a), sa = sin(a);
    vec2 q = clamp(mat2(ca, -sa, sa, ca) * f * 0.92 + 0.5, 0., 1.);
    float cell = floor(r2 * 3.99);
    float t = textureLod(uAtlas, (vec2(cell, 1.) + q) / vec2(4., 2.), lod).r;
    m = max(m, smoothstep(0.5 - w, 0.5 + w, t) * step(0.45, fract(r1 * 7.3 + r2)));
  }
  return m * seen;
}
`,te=`
uniform float uRunDensity;  // 0..1 share of lanes that carry drops
uniform float uSyringe;     // 0 normal; 1 = every pane fogged whole (rare event); world drives it
uniform vec2 uFlush;        // rare event: x = how far down (0..1 of L) every lane has let go at once, y = strength
vec2 paneRuns(float x, float v, float L, float wpx){
  float lane = floor(x), fx = fract(x);
  float clear = 0., bead = 0.;
  for (int k = 0; k < 3; k++) {
    float fk = float(k);
    float sd = h11(lane * 1.73 + fk * 31.3);
    float on = step(h11(lane * 0.37 + fk * 3.1), uRunDensity);
    float spd = mix(1.3, 2.8, h11(lane * 3.1 + fk * 7.7));           // metres a second
    float span = L + 16.0 * spd * 0.6;                               // run, then wait while the track mists
    float head = fract(uTime * spd / span + sd) * span;              // metres from the top
    float start = h11(lane * 5.3 + fk * 1.9) * L * 0.45 * fk * 0.5;   // later heads start lower down
    float stray = step(0.93, h11(lane * 9.1 + fk));                  // the run that wanders off its lane
    float wob = 0.5 + (0.10 + 0.07 * stray) * sin(v * (0.33 + 0.2 * sd) + sd * 40.) + 0.05 * sin(v * 1.4 + sd * 9.);
    float hw = max(mix(0.2, 0.3, h11(lane + fk * 5.)), 0.8 * wpx);    // never under ~1.5 px
    float dx = abs(fx - wob);
    float line = 1. - smoothstep(hw - wpx, hw + wpx, dx);
    float behind = min(head, L) - v;
    float age = (head - v) / spd;                                    // seconds since the drop passed here
    float tr = step(0., behind) * step(start, v) * (1. - smoothstep(5.5, 10.0, age));
    tr *= smoothstep(0., 0.6, v - start);
    clear = max(clear, line * tr * on);
    float hd = 1. - smoothstep(0.0, 1.0, length(vec2(dx / max(hw * 1.3, 1e-3), (head - 0.2 - v) * 2.4)));   // the bead rides just inside the head of its track
    bead = max(bead, hd * on * step(v, L) * step(start, v));
  }
  // the syringing: every lane lets go together, and the pane clears from its top edge down
  float fwob = 0.5 + 0.1 * sin(v * 0.4 + lane * 2.3);
  float fhw = max(0.26, 0.8 * wpx);
  float fl = (1. - smoothstep(fhw - wpx, fhw + wpx, abs(fx - fwob))) * (1. - smoothstep(uFlush.x * L - 0.8, uFlush.x * L, v)) * uFlush.y;
  fl *= 1. - 0.8 * smoothstep(0.75, 0.95, fract(v * 0.11 - uTime * 0.28 + h11(lane * 7.7)));   // drops still running in every cleared lane
  float fhd = (1. - smoothstep(0., 1., length(vec2((fx - fwob) / max(fhw * 1.5, 1e-3), (uFlush.x * L - v) * 1.6)))) * uFlush.y * step(v, L);
  return vec2(max(clear * (1. - uSyringe), fl), max(bead * (1. - uSyringe), fhd));
}
`,le=`
#ifdef WALL_DEPTH
uniform vec4 uWall;              // x: the plane (world x) whose depth is written; y, z: the wall's two ends along z; w: its height from the ground
uniform mat4 projectionMatrix;
void wallDepth(vec3 wp){
  float dx = wp.x - cameraPosition.x;
  if (dx <= 0. || wp.x >= uWall.x) discard;                                        // not between this eye and the wall's plane
  vec3 q = cameraPosition + (wp - cameraPosition) * ((uWall.x - cameraPosition.x) / dx);
  if (q.z < uWall.y || q.z > uWall.z || q.y < 0. || q.y > uWall.w) discard;          // the eye's line misses the wall's rectangle
  vec4 c = projectionMatrix * viewMatrix * vec4(q, 1.);
  gl_FragDepth = c.z / c.w * 0.5 + 0.5;
}
#endif
`,ke=`
varying vec2 vUv; varying vec3 vWp; varying vec3 vWn; varying vec3 vOp;
void main(){
  vUv = uv; vOp = position;
  vec4 wp = modelMatrix * vec4(position, 1.);
  vWp = wp.xyz;
  vWn = mat3(modelMatrix) * normal;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,Se=H+te+`
uniform sampler2D uCond;   // R bead height, G lane seed, B fine grain (tiling)
uniform float uL;          // length of a run on this pane group, metres
uniform float uBars;       // glazing bars per lane unit
uniform float uLap;        // metres between glass laps
uniform float uOutside;    // 0: inside face (opaque, a clear track shows the sky); 1: outside face (alpha = fog)
uniform float uReflect;    // outside only: how far a clear track is filled with sky colour instead of being see-through
uniform float uMilk;       // tone offset of this pane group (the hand: panes that do not quite match)
uniform vec2 uCrack;       // the cell (bar, lap) of the one cracked pane of this group, puttied over
uniform vec3 cHoney; uniform float uHoney, uHoneyX;   // golden hour: honey on the lit side (uHoneyX = sign / half width of the house)
uniform vec4 uWipe;        // a leaf that wipes this pane: xyz world position of its stalk, w its reach in metres (0 = none)
uniform vec3 uWipeA;       // x: the leaf's angle now (radians from up, about the pane's normal), y: half its swing, z: 1 if the pane faces -X/+X (use zy) else xy
uniform vec4 uCutA, uCutB;
varying vec2 vUv; varying vec3 vWp; varying vec3 vWn; varying vec3 vOp;
${le}
void main(){
  if (archCut(vOp, uCutA, uCutB) > 0.5) discard;
  #ifdef WALL_DEPTH
  wallDepth(vWp); gl_FragColor = vec4(0.); return;     // (n8b) this pane's own geometry, drawn as the wall's depth where it stands before the wall
  #endif
  float wpx = max(fwidth(vUv.x), 1e-5);
  float wpy = max(fwidth(vUv.y), 1e-5);
  vec2 run = paneRuns(vUv.x, vUv.y, uL, wpx);
  float bx = vUv.x * uBars, by = vUv.y / max(uLap, 1e-3);
  vec2 cell = vec2(floor(bx), floor(by));
  float bw = wpx * uBars;                                  // one pixel in bar units
  float lw = wpy / max(uLap, 1e-3);                        // one pixel in lap units
  // THE BODY OF THE GLASS. Every pane is its own white: four quiet steps of pearl, the cast of the crate it was cut
  // from, about one in fifteen clearly odd, a share of them a touch warm. Held where a pane is a few pixels each way.
  float tone = h21(cell + 3.7), t2 = h21(cell + 17.9), t3 = h21(cell + 5.3);
  float batch = h21(floor(cell / vec2(6., 4.)) + 41.3);
  float paneSeen = smoothstep(1.5, 5., min(1. / bw, 1. / lw));
  float odd = step(0.935, t2);
  float quilt = floor(tone * 4.) * 0.055 + (batch - 0.5) * 0.07 + odd * 0.17;
  quilt = mix(0.085 + (batch - 0.5) * 0.07, quilt, paneSeen);
  float warm = step(0.72, t3) * (0.45 + 0.55 * odd) * paneSeen;
  vec4 cd = texture2D(uCond, vec2(vUv.x * 0.19, vUv.y * 0.47));
  vec4 cs = texture2D(uCond, vec2(vUv.x * 0.085, vUv.y * 0.21) + 0.37);   // the same beads at twice the size: a stipple that carries across a hall
  float near = 1. - smoothstep(0.012, 0.05, wpy);                        // beads only where a pixel is under ~3 cm
  float swell = cd.r + 0.12 * sin(uTime * 0.7 + cd.g * 6.283);
  float bead = smoothstep(0.62, 0.8, swell) * near;
  float stip = smoothstep(0.25, 0.7, cs.r + 0.08 * sin(uTime * 0.5 + cs.g * 6.283));
  float F = clamp(1. - run.x * 0.96 - bead * 0.3, 0.04, 1.);
  F = mix(F, 1., uSyringe * (1. - uFlush.y));
  F = max(F * (1. - run.x * uFlush.y), 0.04);
  if (uWipe.w > 0.) {
    vec3 wv = vWp - uWipe.xyz;
    vec2 w2 = mix(wv.xy, vec2(wv.z, wv.y), uWipeA.z);
    float wr = length(w2);
    float wa = atan(w2.x, w2.y + 1e-5 + step(wr, 1e-4));
    float band = smoothstep(0.3, 0.42, wr / uWipe.w) * (1. - smoothstep(0.93, 1.0, wr / uWipe.w));
    float inArc = 1. - smoothstep(uWipeA.y, uWipeA.y + 0.07, abs(wa));
    float fresh = 0.66 + 0.34 * exp(-abs(wa - uWipeA.x) * 3.2);
    float smear = 0.82 + 0.18 * sin(wr * 23. + 2. * sin(wa * 7.));
    F = mix(F, 0.04, band * inArc * fresh * smear * (1. - uSyringe));
  }
  vec3 milk = mix(cMilk, cPearl, clamp(uMilk + quilt + stip * 0.085 + (cd.b - 0.5) * 0.08 * near, 0., 1.));
  milk *= mix(vec3(1.), vec3(1., 0.972, 0.9), warm);
  // golden hour: the panes on the lit side of the house turn honey, the far side stays milk
  milk = mix(milk, cHoney * (1. - 0.6 * quilt), uHoney * smoothstep(-0.25, 0.9, vWp.x * uHoneyX));
  milk = mix(milk, cMilk, smoothstep(0.86, 0.97, cs.r) * 0.7);          // the one soft sheen on a bead
  // the syringing: the spray sheets down the fogged glass in pearl veils
  float veil = texture2D(uCond, vec2(vUv.x * 0.043, (vUv.y - uTime * 1.3) * 0.031)).r;
  milk = mix(milk, cPearl, uSyringe * 0.5 * smoothstep(0.4, 0.75, veil));
  vec3 n = normalize(vWn + vec3(0., 1e-4, 0.));
  vec3 dir = vWp - uLens; dir /= max(length(dir), 1e-4);
  float high = smoothstep(10., 22., vWp.y) * 0.62;                      // blue high on a vault, pearl lower down, whatever the gaze
  vec3 sky = mix(trackSky(max(dir.y, high)), trackSky(n.y * 0.75 + 0.12), uOutside);
  vec3 col = mix(sky, milk, F);
  col = mix(col, vec3(1.), max(run.y * 0.85, bead * smoothstep(0.8, 0.95, swell) * 0.5));   // the one soft white sheen
  float alpha = mix(1., 1. - (1. - F) * (1. - uReflect), uOutside);
  // the cracked pane, puttied over (one the glazier chose: uCrack; and one in several hundred besides)
  vec2 cq = abs(cell - uCrack);
  float crack = max(step(0.9982, h21(cell + 11.3)), step(cq.x + cq.y, 0.5));
  float cside = (fract(bx) - 0.3) - (fract(by) - 0.5) * 0.55 - 0.1 * sin(fract(by) * 9.);
  float pw = max(0.05, 1.3 * bw);                                       // the putty line, never under ~2.5 px
  float putty = crack * (1. - smoothstep(pw, pw + bw, abs(cside)));
  col = mix(col, mix(cMilk, cPearl, 0.22), crack * step(0., cside) * F * paneSeen);   // the two halves never sat flush again
  col = mix(col, mix(cPearl, cGrey, 0.55), putty); alpha = max(alpha, putty);
  #ifdef BARS_ONLY
  alpha = 0.;     // (n8) a sheet that draws this pane's own laps and bars and nothing else of it
  #endif
  // glass laps: a faint pearl line across
  float ld = 0.5 - abs(fract(by) - 0.5);
  float lap = (1. - smoothstep(0.75 * lw, 1.75 * lw, ld)) * smoothstep(6., 30., 1. / lw) * 0.3;
  col = mix(col, cPearl, lap * F);
  #ifdef BARS_ONLY
  alpha = lap * F;
  #endif
  // glazing bars: white iron with a grey-green rebate each side, never under 1.5 px
  float bd = 0.5 - abs(fract(bx) - 0.5);                   // distance to the nearest bar, bar units
  float seen = smoothstep(4., 14., 1. / bw);               // fade where bars converge under a few pixels
  float coreW = 0.022;
  float reb = 1. - smoothstep(max(coreW + 0.018, 0.9 * bw), max(coreW + 0.018, 0.9 * bw) + bw, bd);
  float core = 1. - smoothstep(coreW - 0.5 * bw, coreW + 0.5 * bw, bd);
  col = mix(col, cGrey, reb * seen * mix(0.5, 0.9, smoothstep(10., 60., 1. / bw)));
  col = mix(col, cMilk, core * seen);
  alpha = max(alpha, reb * seen);
  gl_FragColor = vec4(col, alpha);
}`,ze=`
attribute float aW;
varying vec2 vUv; varying float vW; varying vec3 vOp;
void main(){
  vUv = uv; vW = aW;
  vec4 p = vec4(position, 1.);
  #ifdef USE_INSTANCING
  p = instanceMatrix * p;
  #endif
  vOp = p.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * p;
}`,Re=H+`
uniform float uRivet;      // spacing of rivets in metres (0 = none)
uniform float uTone;       // 0 white iron ... 1 pearl (stone kerbs)
uniform vec4 uCutA, uCutB;
varying vec2 vUv; varying float vW; varying vec3 vOp;
void main(){
  if (archCut(vOp, uCutA, uCutB) > 0.5) discard;
  float px = max(fwidth(vUv.x), 1e-5);
  float e = 0.5 - abs(vUv.x - 0.5);                                     // 0 at either edge of the face
  float lw = max(0.012 / max(vW, 0.01), 0.8 * px);                      // 1.2 cm, never under ~1.5 px
  float line = 1. - smoothstep(lw, lw + px, e);
  line *= 1. - 0.2 * smoothstep(0.25, 0.6, px);                         // a face only a pixel or two wide still holds its line
  vec3 col = mix(mix(cMilk, cPearl, uTone), cGrey, line * 0.92);
  float sp = max(uRivet, 1e-3);
  vec2 rv = vec2((vUv.x - 0.5) * vW, (fract(vUv.y / sp) - 0.5) * sp);
  float pr = max(fwidth(vUv.y), 1e-5);
  float dot_ = (1. - smoothstep(0.016, 0.016 + pr, length(rv))) * step(1e-3, uRivet) * (1. - smoothstep(0.004, 0.012, pr));
  col = mix(col, cGrey, dot_ * 0.8 * step(0.08, vW));
  gl_FragColor = vec4(col, 1.);
}`,Ce=H+`
attribute vec4 aLeaf;
uniform float uInside;     // 1: sharpness follows the lens; 0 (seen from the snow): it follows the nearest pane
uniform vec2 uCentre;      // card-space point the card grows about
uniform float uConformR;   // > 0: lay the card onto the inside of a sphere of this radius (pressed prints)
uniform float uSway;       // radians a leaf swings on its stalk
uniform float uBreath;     // share by which a pressed leaf swells and shrinks
uniform float uHold;       // 0..1: how far a thing lying on the mirror (a lily pad) keeps its contact however far the lens is
uniform float uReach;      // scales the one distance: the accent holds its contact out to about 4 m (0.6), all else 1
uniform vec2 uCoreS;       // (polish 7) x: a card is a cut, opaque shape while s is under this (0.25; more = it keeps its cut edge as it pales: a tonal step, never a blur); y: the soft pass draws it only from this s on
varying vec2 vQ; varying float vS; varying float vSeed; varying float vCell; varying float vPress; varying vec3 vWp;
#ifdef ACCENT_LEAF
uniform float uLeafReach, uLeafHold; varying float vT;     // (n8) a flower of the accent carried by a plant: the reach and hold of that plant's OWN leaf material (its uniforms themselves), and the s a leaf of it has at this card's distance
#endif
void main(){
  mat4 im = instanceMatrix;
  float sc = length(im[0].xyz);
  vec4 cw = modelMatrix * im * vec4(uCentre, 0., 1.);
  float d = mix(aLeaf.x, distance(cw.xyz, uLens), uInside);
  if (aLeaf.x < 0.) d = 0.;                                  // pressed on a pane: contact, always crisp
  float s = contactS(d * uReach) * (1. - uHold);
  #ifdef ACCENT_LEAF
  vT = contactS(d * uLeafReach) * (1. - uLeafHold);
  #endif
  vS = s; vSeed = aLeaf.y; vCell = aLeaf.w; vQ = position.xy; vPress = aLeaf.x < 0. ? 1. : 0.;
  vec3 p = position;
  float ang = uSway * (sin(uTime * 0.7 + aLeaf.y * 39.) + 0.5 * sin(uTime * 1.9 + aLeaf.y * 17.)) * (0.4 + 0.6 * s);
  float ca = cos(ang), sa = sin(ang);
  p.xy = mat2(ca, -sa, sa, ca) * p.xy;
  float grow = (1. + 0.6 * s) * (1. + uBreath * sin(uTime * 0.45 + aLeaf.y * 21.));
  p.xy = uCentre + (p.xy - uCentre) * grow;
  float r2 = dot(p.xy, p.xy);
  p.z -= aLeaf.z * r2 * (1. + 0.15 * sin(uTime * 0.9 + aLeaf.y * 50.));
  if (uConformR > 0.) p.z += r2 * sc / (2. * uConformR);
  vec4 wp = modelMatrix * im * vec4(p, 1.);
  vWp = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
  #ifdef CORE
  if (s >= uCoreS.x) gl_Position = vec4(0., 0., 2., 1.);
  #else
  if (s < uCoreS.y) gl_Position = vec4(0., 0., 2., 1.);
  #endif
}`,Ae=H+`
uniform sampler2D uAtlas;  // 4 x 2 cells: R silhouette, G veins and folds
uniform float uGhost;      // soft pass only: overall opacity (ghosts seen through fog use < 1)
uniform float uFade;       // soft pass only: how far a card thins out as it loses contact (a big fan must not read as a shadow on the hull)
uniform float uScarlet;    // 1: the one accent (hibiscus); gone to milk by 4 m
uniform float uWhite;      // 1: a white flower (lily): milk with pearl folds
uniform float uMoth;       // 1: a butterfly wing, pearl with one viridian band; 2: a white moth (no band)
uniform float uInside; uniform vec2 uCoreS; uniform float uHoldCol;
varying vec2 vQ; varying float vS; varying float vSeed; varying float vCell; varying float vPress; varying vec3 vWp;
#ifdef ACCENT_LEAF
varying float vT;
#endif
${le}
void main(){
  float s = vS;
  float seed = floor(vSeed * 1024. + 0.5) / 1024.;      // an interpolated constant is not exact: never hash it raw (speckled tips)
  float mask, fold, vein;
  #ifdef FAN
  float r = length(vQ);
  float a = atan(vQ.x, vQ.y + 1e-5 + step(r, 1e-4));
  float A = 2.8;
  float t = a / A;
  float seg = (t * 0.5 + 0.5) * 30.;
  float tri = abs(fract(seg) - 0.5) * 2.;                                 // 0 on a segment's midrib, 1 in the fold between two
  float id = floor(seg);
  float Rb = 1. - 0.12 * t * t + 0.05 * (h11(id + seed * 91.) - 0.5) * (1. - s);
  float split = (0.14 + 0.2 * h11(id * 3.3 + seed * 13.)) * (1. - 0.5 * s);     // tips split deeper on some segments
  float Rr = Rb * (1. - split * tri * tri);
  float pr = max(fwidth(r), 1e-4);
  float w = max(pr, max(s - 0.2, 0.) * 0.45);     // (polish 4) a fan still dark enough to be a shape keeps a cut edge: a dark soft fan read as a smear
  mask = (1. - smoothstep(Rr - w, Rr + w, r)) * smoothstep(-w, w, (A - abs(a)) * r + 0.02);
  float pa = max(fwidth(seg), 1e-4);
  // a soft fan still shows its fingers: milk between the segments, so it reads as a leaf and never as a cast shadow
  float ray = smoothstep(0.45, 0.95, tri) * smoothstep(0.22, 0.5, s) * (1. - smoothstep(0.3, 1.0, pa)) * smoothstep(0.1, 0.4, r);
  mask *= 1. - 0.62 * ray;
  float crisp = 1. - smoothstep(0.0, 0.3, s);
  fold = mix(0.42, smoothstep(0.5, 1., tri) * 0.75 + 0.25 * mod(id, 2.), (1. - smoothstep(0.35, 1.2, pa)) * smoothstep(0.03, 0.25, r));
  fold = mix(0.3, fold, crisp);
  fold = clamp(fold + (h11(seed * 37.7 + 0.19) - 0.45) * 0.75 * crisp + 0.3 * crisp * (1. - smoothstep(0.1, 0.55, r)), 0., 1.);   // each fan its own green, deeper toward its hub
  vein = (1. - smoothstep(0.035, 0.035 + pa, tri)) * crisp * smoothstep(0.22, 0.6, r) * (1. - smoothstep(0.03, 0.12, pa));
  vein = max(vein, (1. - smoothstep(0.017 - pr, 0.017 + pr, r)) * crisp * (1. - smoothstep(0.004, 0.02, pr)));   // the hastula, pale: a small cut disc (polish 4: it was a soft round patch of haze on every near fan)
  #elif defined(WING)
  // a butterfly's wing, worked out: a fore and a hind lobe out from the hinge (the card's line y = 0.25), half the
  // body lying along it. vCell is +1 or -1: which way the head points along the card's x.
  float dirn = vCell < 0. ? -1. : 1.;
  vec2 wq = vec2(vQ.x * dirn * 2., (vQ.y - 0.25) * 2.);                  // (along the body, head +; out along the wing, 0..1)
  float df = length((wq - vec2(0.2, 0.5)) / vec2(0.4, 0.5));
  float dh = length((wq - vec2(-0.3, 0.29)) / vec2(0.28, 0.31));
  float dd = -log(exp(-7. * df) + exp(-7. * dh)) / 7.;                    // the two lobes as one outline (no seam between fore and hind wing)
  float pw = max(fwidth(dd), 1e-4);
  float ww = max(pw, s * 0.55);
  float crisp = 1. - smoothstep(0.0, 0.3, s);
  float wBody = (1. - smoothstep(1. - 3. * pw - s, 1. + 3. * pw + s, length(wq / vec2(0.52, 0.085)))) * step(-0.1, wq.y);
  mask = max((1. - smoothstep(1. - ww, 1. + ww, dd)) * smoothstep(-0.02 - ww * 0.3, 0.02 + ww * 0.3, wq.y), wBody);
  // (polish 4) drawn as an insect, not a striped card: a milk wing with a broad deep-green margin scalloped along its edge,
  // the one viridian band a row of spots inside it, a dark body; no rays
  float wEdge = smoothstep(0.74, 0.8, dd + 0.3 * max(wq.x, 0.) * wq.y);       // broadest at the forewing's tip
  float wSpot = (1. - smoothstep(0.07, 0.1, length(wq - vec2(0.24, 0.52)))) * step(uMoth, 1.5);
  fold = 0.; vein = 0.;
  vec3 wingCol = mix(mix(cMilk, cPearl, 0.12), mix(cMilk, cPearl, 0.6), step(1.5, uMoth));     // (polish 6) pearl, as the brief has it: a cream wing was an eighth colour and a sticker
  wingCol = mix(wingCol, cVirid, wSpot * 0.0);
  wingCol = mix(wingCol, mix(mix(cVirid, cDeep, 0.35), mix(cPearl, cGrey, 0.8), step(1.5, uMoth)), wEdge);     // the margin, and the one viridian band across the wing
  wingCol = mix(wingCol, cDeep, wBody);
  wingCol = mix(wingCol, cMilk, smoothstep(0.1, 0.7, s) * 0.8);
  #else
  vec2 q = vec2(clamp(vQ.x + 0.5, 0., 1.), clamp(vQ.y, 0., 1.));
  float cellI = floor(vCell + 0.5);                          // a varying is never exactly 4.0: round it, or cell 4 wraps
  vec2 uv = (vec2(cellI - 4. * step(3.5, cellI), 1. - step(3.5, cellI)) + q) / vec2(4., 2.);
  vec4 tx = texture2D(uAtlas, uv, 5.2 * s * s * sqrt(max(s, 0.)) + 0.8 * step(0.5, cellI) * step(cellI, 1.5));   // a frond keeps its outline and rows of pinnae well past arm's length
  float edge = mix(0.5, 0.25, s);
  float aw = max(fwidth(tx.r), 0.02) + s * (0.15 + 0.3 * s);
  mask = smoothstep(max(edge - aw, 0.04), edge + aw, tx.r);
  vec2 bq = min(q, 1. - q);
  mask *= smoothstep(0.0, 0.14, min(bq.x, bq.y));                     // alpha is zero at the card's border, whatever the bias
  float crisp = 1. - smoothstep(0.0, 0.3, s);
  fold = mix(0.3, tx.b, crisp);
  // a frond's pinnae are not all one green: each card its own depth of fold, so a crown in contact is leaves on leaves, never one flat mass
  float isFr = step(0.5, cellI) * step(cellI, 1.5);
  float own = h11(seed * 57.3 + 0.31);
  fold = clamp(fold + isFr * (own - 0.42) * 0.8 * crisp, 0., 1.);
  s = clamp(s + isFr * (own - 0.5) * 0.16 * smoothstep(0.2, 0.4, s), 0., 1.);
  vein = tx.g * crisp * (1. - smoothstep(0.012, 0.035, max(fwidth(q.x), fwidth(q.y))));   // no veins on a card under ~40 px: they alias into ladders
  #endif
  vec3 col = leafTint(s, fold);
  vec3 acc = mix(cScarlet, mix(cScarlet, cDeep, 0.78), clamp(fold * 1.25, 0., 1.) * crisp);     // the throat and the petals' overlaps, darker
  col = mix(col, mix(acc, cMilk, smoothstep(0.18, 0.44, s) * 0.9 * (1. - uHoldCol) + uHoldCol * 0.45 * smoothstep(0.25, 0.6, s)), uScarlet);
  #ifdef ACCENT_LEAF
  // (n8) the flower has gone from its accent toward milk by exactly the share a flat leaf of its own plant has gone from viridian toward milk at this distance (the leaf's own law, leafTint, at the leaf's own s)
  { vec3 lt = leafTint(vT, 0.), va = cMilk - cVirid; col = mix(col, mix(acc, cMilk, clamp(dot(lt - cVirid, va) / dot(va, va), 0., 1.)), uScarlet); }
  #endif
  col = mix(col, mix(mix(cMilk, cGrey, fold * 0.55 + 0.08), cMilk, s), uWhite);
  col = mix(col, mix(cGrey, cMilk, 0.35 + 0.65 * uScarlet), vein * (0.6 + 0.35 * uScarlet));
  float sheen = (1. - smoothstep(0.0, 0.15, abs(vQ.y * 0.8 + vQ.x * 0.45 - 0.42 - 0.2 * vSeed))) * crisp * 0.09;
  #ifdef FAN
  sheen = 0.;                                         // (polish 4) nor on a fan: a straight soft band across a big near fan read as a seam; its pleats carry its light
  #endif
  col = mix(col, cMilk, sheen * (1. - vPress));       // not on a pressed print: across the rosette the sheen bands read as pale smears
  // (tried and withdrawn: gold over green prints as khaki and turns the scarlet to peach; leaves keep their own inks, the
  // light is carried by floor, water, mist and trunks)
  #ifdef WING
  col = wingCol;
  #endif
  float alpha = mask * mix(1., 0.5, smoothstep(uCoreS.x, 1., s));
  alpha *= smoothstep(0.3, 0.75, distance(vWp, uLens));     // (polish 6) no card is drawn through the lens itself
  #ifdef CORE
  if (alpha < 0.5) discard;
  gl_FragColor = vec4(col, 1.);
  #else
  alpha *= uGhost * (1. - uFade * smoothstep(max(0.3, uCoreS.x), max(0.62, uCoreS.x + 0.11), s));     // (polish 7) where a card keeps its cut edge further, it lets go just beyond: no pale soft shapes standing as haze behind the cut ones
  if (alpha < 0.012) discard;
  gl_FragColor = vec4(col, alpha);
  #endif
  #ifdef WALL_DEPTH
  wallDepth(vWp);     // (n8b) these cards drawn again as the wall's depth: each cut by its own outline (the discards above), each where its own matrix has it
  #endif
}`,Ve=H+`
uniform float uInside;
uniform float uReach;      // scales the one distance (the great trunk holds its bark from across the pool)
attribute float aPane;     // metres to the nearest pane
varying vec2 vUv; varying float vS; varying float vFace; varying vec3 vWp;
void main(){
  vUv = uv;
  vec4 wp = modelMatrix * vec4(position, 1.); vWp = wp.xyz;
  float d = mix(aPane, distance(wp.xyz, uLens), uInside);
  vS = contactS(d * uReach);
  vec3 wn = normalize(mat3(modelMatrix) * normal + vec3(0., 1e-5, 0.));
  vec3 v = uLens - wp.xyz; v /= max(length(v), 1e-4);
  vFace = abs(dot(wn, v));
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,We=H+`
uniform float uScales;     // old leaf bases round the stem (0 = a plain stalk)
uniform float uFar;        // opacity left when contact is lost (a trunk stays a pale column, a stalk all but goes)
uniform float uInside;
varying vec2 vUv; varying float vS; varying float vFace; varying vec3 vWp;
void main(){
  float s = vS;
  float crisp = 1. - smoothstep(0.3, 0.8, s);
  vec2 p = vec2(vUv.x * max(uScales, 1.), vUv.y * 1.15);
  float row = floor(p.y);
  p.x += 0.5 * mod(row, 2.) + 0.13 * sin(row * 7.3);
  vec2 f = vec2(fract(p.x) - 0.5, fract(p.y));
  float shield = abs(f.x) * 1.5 + (1. - f.y) * 0.75;                 // an old leaf base: a shield hanging point down
  float pw = max(fwidth(shield), 1e-4);
  float edge = 1. - smoothstep(0.0, 0.07 + pw, abs(shield - 0.78));
  float under = smoothstep(0.78, 1.25, shield);                      // the fold under the next base up
  float fib = 0.5 + 0.5 * sin(vUv.x * 520. + sin(vUv.y * 9. + row) * 2.5 + f.y * 4.);
  float fw = max(fwidth(vUv.x * 520.), 1e-4);
  fib *= 1. - smoothstep(0.6, 2.2, fw);
  float fold = clamp(edge * 0.85 + under * 0.7 + fib * 0.22, 0., 1.) * step(0.5, uScales) + (1. - step(0.5, uScales)) * 0.35;
  vec3 near = mix(mix(mix(cGrey, cPearl, 0.25), mix(cGrey, cVirid, 0.7), step(0.5, uScales)), cDeep, fold * 0.9);
  near = mix(near, cVirid, 0.16);
  near = mix(mix(cVirid, cDeep, 0.62), near, step(0.5, uScales));      // (polish 4) a stalk at the lens is the dark ink of its leaf: a mid-green stalk lay across a near fan as a pale smear
  vec3 far = mix(cGrey, cMilk, 0.12 + 0.2 * smoothstep(0.6, 1., s));
  far = mix(mix(cVirid, cGrey, 0.65), far, step(0.5, uScales));      // a stalk goes by fading, not by whitening
  vec3 col = mix(far, near, crisp);
  col = mix(col, cMilk, (1. - smoothstep(0.0, 0.3, abs(vFace - 0.82))) * 0.16 * crisp * step(0.5, uScales));   // the one soft sheen (on trunks only)
  // (polish 4) where it stands in a bay's light: gold laid flat across it. (polish 6) only on the pale ground between the old leaf
  // bases: every base stays drawn in its dark ink, so a trunk in the sun is still a trunk and never a cream pole
  col = mix(col, cSun, sunAt(vWp, max(fwidth(vWp.y), 0.02)) * uInside * 0.56 * (1. - smoothstep(0.12, 0.45, fold) * crisp));
  float soft = mix(0.02, 0.75, s);
  float alpha = smoothstep(0.0, soft, vFace) * mix(1., uFar, smoothstep(0.25, 0.62, s));
  alpha *= mix(smoothstep(0.55, 1.4, distance(vWp, uLens)), 1., step(0.5, uScales));     // (polish 6) a stalk or a frond's rib lets go within arm's length: at the lens it was a grey blade across the frame
  if (alpha < 0.2 * step(0.5, uScales) + 0.01) discard;                // a trunk's faded rim must not hold depth against the prints behind
  gl_FragColor = vec4(col, alpha);
}`,ae=`
varying vec3 vWp; varying vec3 vOp; varying vec2 vUv;
void main(){ vOp = position; vUv = uv; vec4 wp = modelMatrix * vec4(position, 1.); vWp = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }`,Pe=H+te+ee+`
uniform vec3 uDomeC;       // world position of the hull's centre (on the axis at the springing)
uniform vec4 uDome;        // R, run length L, arc from apex to rosette rim, lanes round the dome
uniform vec4 uRos;         // rosette: radius, scallops, phase, bays
varying vec3 vWp;
void main(){
  vec3 V = vWp - uLens; V /= max(length(V), 1e-4);
  vec2 nr = vec2(0.); float crest = 0.;
  vec2 pl = vWp.xz - uDomeC.xz;
  for (int k = 0; k < 5; k++) {                       // rings: a frog, a drop from a rib; each lives about 3.5 s
    float fk = float(k);
    float T = uTime / (3.4 + fk * 0.41) + fk * 0.23;
    float cyc = floor(T), ph = fract(T);
    vec2 c = (vec2(h21(vec2(cyc, fk)), h21(vec2(fk + 7., cyc))) - 0.5) * 21.;
    vec2 dl = pl - c; float dist = length(dl);
    float rad = ph * 3.4;
    float env = exp(-abs(dist - rad) * 2.4) * (1. - ph) * (1. - ph);
    float wv = sin((dist - rad) * 8.) * env;
    nr += dl / max(dist, 1e-3) * wv * 0.1;
    crest += max(wv, 0.) * env;
  }
  nr += 0.0035 * vec2(sin(vWp.x * 1.7 + uTime * 0.6) + sin(vWp.z * 2.3 - uTime * 0.5), sin(vWp.z * 1.9 + uTime * 0.7) + sin(vWp.x * 2.6 + uTime * 0.4));
  vec3 Rd = reflect(V, normalize(vec3(nr.x, 1., nr.y)));
  // a painter's mirror: the water is tilted toward what is overhead, so the rosette and its meridians are doubled
  // between the pads from the walk as well as from above
  Rd.y = abs(Rd.y) + 1.25; Rd /= max(length(Rd), 1e-4);
  vec3 oc = vWp - uDomeC;
  float R = uDome.x;
  float b = dot(oc, Rd), c = dot(oc, oc) - R * R;
  vec3 hit = oc + Rd * (-b + sqrt(max(b * b - c, 0.)));
  if (hit.y < 0.) {
    float a = max(dot(Rd.xz, Rd.xz), 1e-5), bb = dot(oc.xz, Rd.xz), cc = dot(oc.xz, oc.xz) - R * R;
    hit = oc + Rd * ((-bb + sqrt(max(bb * bb - a * cc, 0.))) / a);
  }
  float hz = hit.z; if (abs(hz) < 1e-4) hz = 1e-4;
  float turn = fract(atan(hit.x, hz) / 6.2831853 + 1.);
  float lane = turn * uDome.w;
  float e = asin(clamp(hit.y / R, 0., 1.));
  float v = hit.y >= 0. ? R * (1.5707963 - e) - uDome.z : R * 1.5707963 - uDome.z - hit.y;
  float wpx = min(max(fwidth(lane), 1e-5), 0.5);
  float wb = min(fwidth(turn * uRos.w), 0.5);
  float rh = length(hit.xz);
  float pr = max(fwidth(rh), 1e-3);
  vec2 run = paneRuns(lane, v, uDome.y, wpx);
  vec3 col = mix(trackSky(Rd.y), cMilk, 1. - run.x * 0.96);
  float rb = 0.5 - abs(fract(turn * uRos.w) - 0.5);
  float rw = 0.035 / max(cos(e), 0.2);
  col = mix(col, cGrey, (1. - smoothstep(rw, rw + wb, rb)) * 0.6);
  float az = turn * 6.2831853;
  float edgeR = uRos.x - 1.5 * abs(sin(az * uRos.y * 0.5 + uRos.z));
  float ros = (1. - smoothstep(edgeR - pr - 0.1, edgeR + pr + 0.1, rh)) * step(0., hit.y);
  ros *= 1. - 0.8 * (1. - smoothstep(0.25, 0.7, abs(rh - 9.9))) * step(0.3, abs(sin(az * 5. + 1.)));
  float pleat = abs(fract(az * uRos.y * 4.77) - 0.5) * 2.;
  float pfw = fwidth(az * uRos.y * 4.77);
  pleat = mix(0.5, pleat, 1. - smoothstep(0.15, 0.6, pfw));      // no pleat a pixel cannot hold (it broke into moire under the lens)
  col = mix(col, mix(mix(cGrey, cVirid, 0.55), cVirid, smoothstep(0.4, 1., pleat) * 0.7), ros * 0.34);   // a reflection, a tone paler than any leaf
  float ax = abs(oc.x * Rd.z - oc.z * Rd.x) / max(length(Rd.xz), 1e-3);
  col = mix(col, mix(cGrey, cMilk, 0.55), (1. - smoothstep(0.4, 1.7, ax)) * step(dot(oc.xz, Rd.xz), 0.) * 0.6);
  // the water: dark and still under the glass it mirrors (grey-green going to viridian), so the gold that falls across it glows
  float lum = dot(col, vec3(0.3, 0.5, 0.2));
  col = mix(mix(cVirid, cDeep, 0.22), col, 0.12 + 0.3 * (1. - smoothstep(0.5, 0.8, lum)));     // (polish 6) deeper: the one dark mirror under the white hull
  float pxw = max(fwidth(vWp.x), fwidth(vWp.z));
  float sun = sunBand(vWp.xz + nr * 9., pxw) * (1. - 0.85 * dapple(vWp.xz * 0.8 + nr * 9. + 31., pxw));     // (polish 7) the crown stands in the light: fan and leaf shapes lie in the gold on the water
  col = mix(col, mix(cSun, col, 0.3), sun);
  col = mix(col, cMilk, clamp(crest, 0., 1.) * 0.7);    // one soft white sheen on a ring's crest
  gl_FragColor = vec4(col, 1.);
}`,Fe=H+ee+`
uniform float uInside;
varying vec3 vWp; varying vec3 vOp;
void main(){
  float r = length(vOp.xz), a = atan(vOp.x, vOp.z + 1e-4);
  float s = contactS(mix(12., distance(vWp, uLens), uInside));
  float ring = floor(r / 1.5);
  vec2 p = vec2(a / 6.2831853 * floor(6.2831853 * (ring + 0.5) * 1.5 / 2.2) + 0.37 * ring, r / 1.5);
  vec2 f = 0.5 - abs(fract(p) - 0.5);
  vec2 w = max(fwidth(p), vec2(1e-4));
  w.x = min(w.x, 0.5);
  // joints are soft grooves, never a drawn line (the only hard line in this house is iron)
  float jt = max((1. - smoothstep(0.0, 0.05 + w.x, f.x)) * (1. - smoothstep(0.15, 0.4, w.x)), (1. - smoothstep(0.0, 0.075 + w.y, f.y)) * (1. - smoothstep(0.15, 0.4, w.y)));
  vec3 col = mix(mix(cPearl, cMilk, 0.45 + 0.2 * h21(vec2(floor(p.x), ring))), cMilk, 0.35 + 0.13 * smoothstep(0.3, 1., s));
  col = mix(col, mix(cPearl, cGrey, 0.3), jt * 0.5 * (1. - smoothstep(0.35, 0.85, s)));
  // the second key: wet stone out of the sun is a full tone of pearl under the glass; where a bay's light falls it is gold
  float pxm = max(fwidth(vWp.x), fwidth(vWp.z));
  float sun = sunBand(vWp.xz, pxm) * uInside * (1. - 0.9 * dapple(vWp.xz, pxm) * smoothstep(17., 19., r));     // leaves stand in the light over the walk and the beds, not over the pool's kerb
  col = mix(col, mix(cPearl, cGrey, 0.4 + 0.2 * jt), 0.74 * uInside * (1. - 0.45 * smoothstep(0.5, 1., s)));
  float bed = smoothstep(20.5, 20.62, r) * (1. - (1. - smoothstep(4.0, 4.2, abs(vOp.x))) * step(12., abs(vOp.z))) * uInside;
  float edging = (1. - smoothstep(0.1, 0.16, abs(r - 20.4))) * uInside;
  col = mix(col, mix(mix(cGrey, cVirid, 0.7), mix(cPearl, cGrey, 0.75), smoothstep(0.55, 1.0, contactS(mix(12., distance(vWp, uLens), uInside) * 0.4))), bed);     // (polish 7) planted earth holds its ink across the hall
  col = mix(col, cSun * (1. - 0.07 * jt), sun * (1. - 0.72 * bed));
  col = mix(col, mix(cMilk, cPearl, 0.3), edging);
  gl_FragColor = vec4(col, 1.);
}`,Te=H+`
uniform float uInside; uniform float uStrength; uniform float uEdge; uniform vec2 uSpan;
varying vec3 vWp; varying vec3 vOp; varying vec2 vUv;
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
void main(){
  vec2 dl = vWp.xz - uLens.xz;
  float dy = abs(vWp.y - uLens.y);
  float curl = 1.4 * exp(-dot(dl, dl) / 40.) * (1. - smoothstep(0., 4., dy));       // it curls where the lens breaks through
  vec2 p = vOp.xz + vec2(-dl.y, dl.x) * curl * 0.35 + vec2(uTime * 0.4 + vOp.y * 7.3, vOp.y * 3.1);
  float n = vnoise(p * 0.085) * 0.6 + vnoise(p * 0.21 + 3.7) * 0.28 + vnoise(p * 0.55 - uTime * 0.05) * 0.12;
  float a = smoothstep(0.42, 0.74, n) * uStrength * uInside;
  a *= 0.05 + 0.95 * smoothstep(9., 22., length(vOp.xz));                              // thin over the middle, so the vault stays readable
  a *= smoothstep(0.6, 2.6, vWp.y - uLens.y);     // (polish 7) a shelf is only ever seen from below, against the glass: looked down through, it lay over the pool as a pane of haze
  a *= 1. - smoothstep(uEdge - 6., uEdge, length(vOp.xz));
  // POLISH 4: mist is never a slab. It has no straight edge (it frays out by its own noise well short of every edge of its
  // sheet, vUv), it is never laid over what the lens is close to (nothing within 16 m, so no leaf in contact is cut by it),
  // and it thins to wisps: only the crests of the noise are left.
  vec2 eb = min(vUv, 1. - vUv) * uSpan;                                            // metres to the sheet's nearest edges
  float fray = min(eb.x, eb.y) - 9. * vnoise(vOp.xz * 0.13 + 5.);
  a *= smoothstep(1., 9., fray);
  a *= smoothstep(13., 30., length(dl));
  a *= smoothstep(0.5, 0.8, n);
  float sun = sunAt(vWp, 0.3);
  gl_FragColor = vec4(mix(cMilk, cSun, sun * 0.8), a * (1. + 0.8 * sun));
}`,Le=H+`
attribute vec4 aDrop;
uniform float uResY; uniform float uFloorY;
varying float vA; varying vec2 vQ;
void main(){
  float ph = fract(uTime / 5.5 + aDrop.w) * 5.5;
  float y = aDrop.y - 4.9 * ph * ph;
  float live = step(uFloorY, y);
  float len = 0.12 + 0.045 * 9.8 * ph;
  vec4 mv = viewMatrix * modelMatrix * vec4(aDrop.x, y, aDrop.z, 1.);
  vec4 up = viewMatrix * modelMatrix * vec4(0., 1., 0., 0.);
  float px = 2. * max(-mv.z, 0.1) / max(projectionMatrix[1][1] * uResY, 1.);
  mv.xyz += up.xyz * position.y * len * 0.5;
  mv.x += position.x * max(0.011, 0.8 * px);
  vA = live * (1. - smoothstep(25., 60., -mv.z)) * smoothstep(3., 7., -mv.z); vQ = position.xy;     // (polish 6: a drop a hand's breadth from the lens was a grey blade across the frame)
  gl_Position = projectionMatrix * mv;
  if (live < 0.5) gl_Position = vec4(0., 0., 2., 1.);
}`,Be=H+`
uniform float uInside;
varying float vA; varying vec2 vQ;
void main(){
  float a = vA * uInside * (1. - abs(vQ.x)) * smoothstep(-1., 0.6, vQ.y) * 0.85;
  gl_FragColor = vec4(mix(cGrey, cMilk, smoothstep(0.2, 1., vQ.y) * 0.7), a);
}`;function ce(t){const e=new Uint8Array(1048576);let f=t()*4294967295>>>0;for(let i=0;i<e.length;i+=4)f=Math.imul(f,1664525)+1013904223>>>0,e[i+2]=96+(f>>>26),e[i+3]=255;return e}function he(t,s,e){for(let i=0;i<e;i++){const l=s()*512,v=s()*512,c=s()<.12,u=c?5+s()*5:1.6+s()*3.2,y=Math.floor(s()*255),n=u*(1.05+s()*.35),d=Math.floor(l-u),a=Math.ceil(l+u),r=Math.floor(v-n),h=Math.ceil(v+n);for(let p=r;p<=h;p++)for(let x=d;x<=a;x++){const g=Math.hypot((x-l)/u,(p-v)/n);if(g>=1)continue;const w=Math.round(255*(1-g*g*g)),m=((p%512+512)%512*512+(x%512+512)%512)*4;w>t[m]&&(t[m]=w,t[m+1]=y)}}}function fe(t){const e=new o.DataTexture(t,512,512,o.RGBAFormat,o.UnsignedByteType);return e.wrapS=e.wrapT=o.RepeatWrapping,e.colorSpace=o.NoColorSpace,e.magFilter=o.LinearFilter,e.minFilter=o.LinearMipmapLinearFilter,e.generateMipmaps=!0,e.needsUpdate=!0,e}function Ie(t){const s=ce(t);return he(s,t,1300),fe(s)}function oe(t,s,e,f,i=1,l=1){const v=new o.PlaneGeometry(s-t,f-e,i,l);return v.translate((t+s)/2,(e+f)/2,0),v}function q(t,s,e){const f=t.length,i=[],l=[],v=[],c=[],u=new o.Vector3,y=new o.Vector3,n=new o.Vector3,d=[];let a=0;for(let h=0;h<f;h++)u.subVectors(t[Math.min(f-1,h+1)],t[Math.max(0,h-1)]),u.lengthSq()<1e-10&&u.set(0,1,0),u.normalize(),y.crossVectors(u,s[h]),y.lengthSq()<1e-10&&y.set(1,0,0),y.normalize(),h>0&&(a+=t[h].distanceTo(t[h-1])),d.push([s[h].clone(),y.clone(),a]);for(const h of e){const p=Math.hypot(h[2]-h[0],h[3]-h[1]),x=i.length/3;for(let g=0;g<f;g++){const[w,m,b]=d[g];for(let M=0;M<2;M++)n.copy(t[g]).addScaledVector(w,h[M*2]).addScaledVector(m,h[M*2+1]),i.push(n.x,n.y,n.z),l.push(M,b),v.push(p);if(g<f-1){const M=x+g*2;c.push(M,M+1,M+2,M+1,M+3,M+2)}}}const r=new o.BufferGeometry;return r.setAttribute("position",new o.Float32BufferAttribute(i,3)),r.setAttribute("uv",new o.Float32BufferAttribute(l,2)),r.setAttribute("aW",new o.Float32BufferAttribute(v,1)),r.setIndex(c),r}const ue=(t=.3,s=.14)=>[[-t/2,0,t/2,0],[t/2,-s/2,t/2,s/2],[-t/2,-s/2,-t/2,s/2]],B=(t=.08,s=.08)=>[[-t/2,-s/2,t/2,-s/2],[t/2,-s/2,t/2,s/2],[t/2,s/2,-t/2,s/2],[-t/2,s/2,-t/2,-s/2]];async function Ke(t){const s=t.rng.fork?t.rng.fork("fph-style"):t.rng;await t.yield();const e=ce(s);await t.yield();for(let l=0;l<4;l++)he(e,s,325),await t.yield();const f=fe(e);await t.yield();const i=we(s);return await t.yield(),{cond:f,atlas:i}}function De(t,s={}){const e=s.palette||ie,f={};Me.forEach((a,r)=>{f[a]=new o.Color(e[r]||ie[r])});const i=s.tex||null,l=i?null:t.rng.fork?t.rng.fork("fph-style"):t.rng,v=i?i.cond:Ie(l),c=i?i.atlas:we(l),u={uTime:{value:0},uLens:{value:new o.Vector3(0,3,-1e3)},cMilk:{value:f.milk},cPearl:{value:f.pearl},cGrey:{value:f.greyGreen},cVirid:{value:f.viridian},cDeep:{value:f.deep},cScarlet:{value:f.scarlet},cBlue:{value:f.blue},uRunDensity:{value:s.runDensity??.8},uSyringe:{value:0},uFlush:{value:new o.Vector2(0,0)},uInside:{value:0},uCond:{value:v},uAtlas:{value:c},uResY:{value:720},cSun:{value:new o.Color(s.sun||"#F6E2A6")},uSun:{value:new o.Vector4(.42*(s.sunX??1),.9075,13,s.sunK??1)},cHoney:{value:new o.Color(s.honey||"#EBD29A")},uHoney:{value:s.honey?s.honeyK??1:0},uHoneyX:{value:s.honeyX??1/14}},y=[],n=a=>(y.push(a),a),d={palette:f,uniforms:u,textures:{cond:v,atlas:c},cardGeometry:oe,ironSweep:q,iSection:ue,boxSection:B,DOME:k,glsl:{common:H,runs:te,dapple:ee},glass(a={}){const r=!!a.outside;return n(new o.ShaderMaterial({vertexShader:ke,fragmentShader:Se,uniforms:{...u,uL:{value:a.L??12},uBars:{value:a.bars??.75},uLap:{value:a.lap??1.2},uOutside:{value:r?1:0},uReflect:{value:a.reflect??0},uMilk:{value:a.milk??0},uCrack:{value:a.crack||new o.Vector2(-999,-999)},uWipe:{value:a.wipe||new o.Vector4(0,0,0,0)},uWipeA:{value:a.wipeA||new o.Vector3(0,.6,0)},uCutA:{value:a.cutA||new o.Vector4(1,0,0,0)},uCutB:{value:a.cutB||new o.Vector4(1,0,0,0)}},side:a.side??(r?o.FrontSide:o.BackSide),transparent:r,depthWrite:!r}))},iron(a={}){return n(new o.ShaderMaterial({vertexShader:ze,fragmentShader:Re,uniforms:{...u,uRivet:{value:a.rivet??0},uTone:{value:a.tone??0},uCutA:{value:a.cutA||new o.Vector4(1,0,0,0)},uCutB:{value:a.cutB||new o.Vector4(1,0,0,0)}},side:o.DoubleSide}))},leaf(a={}){const r=!!a.core,h=new o.ShaderMaterial({vertexShader:Ce,fragmentShader:Ae,defines:{},uniforms:{...u,uCentre:{value:new o.Vector2(...a.centre||(a.fan?[0,.3]:[0,.5]))},uConformR:{value:a.conformR??0},uSway:{value:a.sway??.05},uBreath:{value:a.breath??0},uHold:{value:a.hold??0},uReach:{value:a.reach??1},uCoreS:{value:new o.Vector2(a.coreS??.25,a.softFrom??0)},uHoldCol:{value:a.holdCol??0},uGhost:{value:a.ghost??1},uFade:{value:a.fade??0},uScarlet:{value:a.scarlet?1:0},uWhite:{value:a.white?1:0},uMoth:{value:a.moth??0}},side:o.DoubleSide,transparent:!r||!!a.afterGlass,depthWrite:r,depthTest:!0});return a.fan&&(h.defines.FAN=1),r&&(h.defines.CORE=1),a.moth&&!a.fan&&(h.defines.WING=1),a.accentLeaf&&(h.defines.ACCENT_LEAF=1,h.uniforms.uLeafReach=a.accentLeaf.uniforms.uReach,h.uniforms.uLeafHold=a.accentLeaf.uniforms.uHold),n(h)},stem(a={}){return n(new o.ShaderMaterial({vertexShader:Ve,fragmentShader:We,uniforms:{...u,uScales:{value:a.scales??0},uFar:{value:a.far??.7},uReach:{value:a.reach??1}},transparent:!0,depthWrite:a.depthWrite??!0,side:o.FrontSide}))},pool(a={}){return n(new o.ShaderMaterial({vertexShader:ae,fragmentShader:Pe,uniforms:{...u,uDomeC:{value:new o.Vector3(0,k.drumH,0)},uDome:{value:new o.Vector4(k.R,a.L??41.4,k.R*Math.asin(k.rosetteR/k.R),k.bays*k.lanesPerBay)},uRos:{value:new o.Vector4(k.rosetteR,a.scallops??15,a.phase??0,k.bays)}}}))},floor(){return n(new o.ShaderMaterial({vertexShader:ae,fragmentShader:Fe,uniforms:{...u}}))},mist(a={}){return n(new o.ShaderMaterial({vertexShader:ae,fragmentShader:Te,uniforms:{...u,uStrength:{value:a.strength??.36},uEdge:{value:a.edge??29},uSpan:{value:new o.Vector2(...a.span||[60,60])}},transparent:!0,depthWrite:!1,side:o.DoubleSide}))},drops(a={}){return n(new o.ShaderMaterial({vertexShader:Le,fragmentShader:Be,uniforms:{...u,uResY:u.uResY,uFloorY:{value:a.floorY??.4}},transparent:!0,depthWrite:!1,side:o.DoubleSide}))},leafAttr(a,r){const h=new Float32Array(r.length*4);for(let p=0;p<r.length;p++)h.set(r[p],p*4);return a.setAttribute("aLeaf",new o.InstancedBufferAttribute(h,4)),a},setInside(a){u.uInside.value=a},setSyringe(a){u.uSyringe.value=J(a,0,1)},setFlush(a,r){u.uFlush.value.set(a,J(r,0,1))},_v2:new o.Vector2,update(a,r,h){u.uTime.value=r,h&&u.uLens.value.setFromMatrixPosition(h.matrixWorld),t.renderer&&(u.uResY.value=t.renderer.getDrawingBufferSize(d._v2).y)},dispose(){v.dispose(),c.dispose();for(const a of y)a.dispose()}};return d}const Ge={hw:11,h:22,rise:11},Ee={hw:11.5,h:12,rise:6.5},Oe=(t,s)=>t.h-t.rise+t.rise*Math.sqrt(Math.max(0,1-s/t.hw*(s/t.hw)));function de(t,s,e,f=new o.Vector3){const i=k.R,l=Math.max(0,s-k.drumH);return f.set(t,s,e*Math.sqrt(Math.max(.01,i*i-t*t-l*l)))}function qe(){const{R:t,drumH:s,bays:e,lanesPerBay:f,rosetteR:i}=k,l=e*2,v=[],c=t*Math.asin(i/t);for(let p=0;p<=4;p++)v.push({r:t,y:s*p/4,ny:0,nr:1,v:t*Math.PI/2-c+s*(1-p/4)});const u=26;for(let p=1;p<=u;p++){const x=p/u*Math.PI/2;v.push({r:Math.max(t*Math.cos(x),.02),y:s+t*Math.sin(x),ny:Math.sin(x),nr:Math.cos(x),v:t*(Math.PI/2-x)-c})}const y=[],n=[],d=[],a=[];for(let p=0;p<v.length;p++){const x=v[p];for(let g=0;g<=l;g++){const w=g/l*W,m=Math.sin(w),b=Math.cos(w);y.push(x.r*m,x.y,x.r*b),n.push(x.nr*m,x.ny,x.nr*b),d.push(g/l*e*f,x.v)}}const r=l+1;for(let p=0;p<v.length-1;p++)for(let x=0;x<l;x++){const g=p*r+x,w=g+1,m=g+r,b=m+1;a.push(g,w,m,w,b,m)}const h=new o.BufferGeometry;return h.setAttribute("position",new o.Float32BufferAttribute(y,3)),h.setAttribute("normal",new o.Float32BufferAttribute(n,3)),h.setAttribute("uv",new o.Float32BufferAttribute(d,2)),h.setIndex(a),h}function pe(t,s,e){const{R:f,drumH:i}=k,l=[],v=[];for(let u=0;u<=5;u++)l.push(new o.Vector3(0,i*u/5,f)),v.push(new o.Vector3(0,0,1));const c=Math.max(4,Math.round(t/(Math.PI/2)*30));for(let u=1;u<=c;u++){const y=t*u/c;l.push(new o.Vector3(0,i+f*Math.sin(y),f*Math.cos(y))),v.push(new o.Vector3(0,Math.sin(y),Math.cos(y)))}return q(l,v,ue(s,e))}function X(t,s,e,f=0){const{R:i,drumH:l}=k,v=[],c=[],u=t<0?i:i*Math.cos(t),y=t<0?s:l+i*Math.sin(t),n=new o.Vector3(t<0?1:Math.cos(t),t<0?0:Math.sin(t),0),d=u>12?192:96;for(let a=0;a<=d;a++){const r=a/d*W,h=Math.sin(r),p=Math.cos(r);v.push(new o.Vector3((u+f*n.x)*h,y+f*n.y,(u+f*n.x)*p)),c.push(new o.Vector3(n.x*h,n.y,n.x*p))}return q(v,c,e)}function me(t,s,e){const f=[],i=[],v=new o.Vector3(0,k.drumH,0),c=(y,n)=>{const d=de(y,n,s);f.push(d);const a=d.clone().sub(v);n<=k.drumH&&(a.y=0),i.push(a.normalize())},u=t.h-t.rise;for(let y=0;y<6;y++)c(-t.hw,u*y/6);for(let y=0;y<=56;y++){const n=-1+2*y/56,d=t.hw*Math.sin(n*Math.PI/2);c(d,Oe(t,d))}for(let y=5;y>=0;y--)c(t.hw,u*y/6);return q(f,i,e)}const ve={hand:0,frond:1,lance:2,fatsia:3,flower:4,pad:5,gecko:6,heart:7};function we(t){const s=document.createElement("canvas");s.width=1024,s.height=512;const e=s.getContext("2d");e.fillStyle="#000",e.fillRect(0,0,1024,512),e.lineCap="round",e.lineJoin="round";const f="#ff0000",i="#00ff00",l="#0000ff",v=(n,d,a,r,h,p=.45)=>{e.save(),e.translate(n,d),e.rotate(-a),e.beginPath(),e.moveTo(0,0),e.bezierCurveTo(h,r*.15,h,r*p,0,r),e.bezierCurveTo(-h,r*p,-h,r*.15,0,0),e.fill(),e.restore()},c=(n,d,a,r,h)=>{e.lineWidth=h,e.beginPath(),e.moveTo(n,d),e.lineTo(n+Math.sin(a)*r,d+Math.cos(a)*r),e.stroke()},u=(n,d)=>{e.save(),e.beginPath(),e.rect(n%4*256,Math.floor(n/4)*256,256,256),e.clip(),e.translate(n%4*256+128,Math.floor(n/4)*256+128),e.scale(64,-64),e.globalCompositeOperation="lighter",d(),e.restore()};u(0,()=>{for(let n=-6;n<=6;n++){const d=n*.36,a=1.75-.045*n*n+t.range(-.05,.05);e.fillStyle=f,v(0,-.72,d,a,.13),e.strokeStyle=i,c(0,-.72,d,a*.9,.022),e.strokeStyle=l,c(0,-.72,d+.18,a*.62,.05)}e.strokeStyle=f,c(0,-1,0,.3,.07)}),u(1,()=>{for(let n=0;n<13;n++){const d=-.95+n*.15,a=.62*Math.sin(Math.PI*(.18+.8*(1-n/13)))+.1;for(const r of[-1,1])e.fillStyle=f,v(0,d,r*1.15,a,.07,.5),e.strokeStyle=l,c(0,d,r*1.15,a*.8,.02)}e.fillStyle=f,v(0,.75,0,.3,.06),e.strokeStyle=i,c(0,-1,0,1.9,.03)}),u(2,()=>{e.fillStyle=f,v(0,-.8,0,1.8,.42,.5),e.strokeStyle=f,c(0,-1,0,.25,.06),e.strokeStyle=i,c(0,-.8,0,1.7,.03),e.strokeStyle=l;for(const n of[-.16,.16,-.3,.3])e.lineWidth=.035,e.beginPath(),e.moveTo(0,-.75),e.quadraticCurveTo(n*2,.1,0,.95),e.stroke()}),u(3,()=>{for(let n=-3;n<=3;n++){const d=n*.62,a=1.25-.06*n*n;e.fillStyle=f,v(0,-.3,d,a,.3,.55),e.strokeStyle=i,c(0,-.3,d,a*.85,.028),e.strokeStyle=l,c(0,-.3,d+.31,.5,.06)}e.strokeStyle=f,c(0,-1,0,.75,.06)}),u(4,()=>{for(let n=0;n<5;n++){const d=n*W/5+.2;e.fillStyle=f,v(0,0,d,1,.56,.86),e.save(),e.rotate(-d),e.strokeStyle=l,e.lineWidth=.05,e.beginPath(),e.moveTo(0,.05),e.bezierCurveTo(.56,.15,.56,.86,.06,.99),e.stroke(),e.lineWidth=.022,e.beginPath(),e.moveTo(0,.3),e.quadraticCurveTo(-.07,.6,-.03,.84),e.stroke(),e.beginPath(),e.moveTo(-.1,.3),e.quadraticCurveTo(-.24,.52,-.2,.7),e.stroke(),e.restore()}e.fillStyle="#000050",e.beginPath(),e.arc(0,0,.42,0,W),e.fill(),e.fillStyle="#000060",e.beginPath(),e.arc(0,0,.32,0,W),e.fill(),e.fillStyle="#000060",e.beginPath(),e.arc(0,0,.21,0,W),e.fill(),e.fillStyle=i,e.beginPath(),e.arc(0,0,.075,0,W),e.fill();for(let n=0;n<8;n++){const d=n*W/8+.3,a=.17+.03*(n%2);e.beginPath(),e.arc(Math.sin(d)*a,Math.cos(d)*a,.036,0,W),e.fill()}}),u(5,()=>{e.fillStyle=f,e.beginPath(),e.moveTo(0,0),e.arc(0,0,.97,-Math.PI/2+.16,Math.PI*1.5-.16),e.closePath(),e.fill(),e.strokeStyle=l,e.lineWidth=.1,e.beginPath(),e.arc(0,0,.9,-Math.PI/2+.2,Math.PI*1.5-.2),e.stroke(),e.strokeStyle=i;for(let n=0;n<11;n++)c(0,0,(n+.5)*W/11+Math.PI,.8,.022)}),u(6,()=>{e.scale(1.3,1.3),e.strokeStyle=f,e.lineWidth=.34,e.beginPath(),e.moveTo(-.03,.5),e.bezierCurveTo(.16,.28,-.16,-.02,.02,-.3),e.stroke(),e.fillStyle=f,e.beginPath(),e.ellipse(-.05,.74,.19,.25,.12,0,W),e.fill();let n=.02,d=-.3;for(let a=0;a<10;a++){const r=a/9,h=Math.PI-.25+1.5*Math.sin(r*2.6),p=n+Math.sin(h)*.085,x=d+Math.cos(h)*.085;e.lineWidth=.27*(1-r)+.07,e.beginPath(),e.moveTo(n,d),e.lineTo(p,x),e.stroke(),n=p,d=x}for(const[a,r,h,p]of[[.1,.4,1,.25],[-.13,.42,-1.25,-.5],[.08,-.2,2.15,2.75],[-.1,-.16,-1.75,-2.5]]){e.strokeStyle=f,c(a,r,h,.3,.14);const x=a+Math.sin(h)*.3,g=r+Math.cos(h)*.3;c(x,g,p,.19,.12);const w=x+Math.sin(p)*.19,m=g+Math.cos(p)*.19;e.fillStyle=f,e.beginPath(),e.arc(w,m,.075,0,W),e.fill();for(let b=-2;b<=2;b++){const M=p+b*.52;c(w,m,M,.13,.05),e.beginPath(),e.arc(w+Math.sin(M)*.15,m+Math.cos(M)*.15,.047,0,W),e.fill()}}e.fillStyle=i;for(const a of[-.15,.06])e.beginPath(),e.arc(a,.8,.04,0,W),e.fill();e.strokeStyle=l,e.lineWidth=.08,e.beginPath(),e.moveTo(-.03,.5),e.bezierCurveTo(.16,.28,-.16,-.02,.02,-.3),e.stroke()}),u(7,()=>{e.fillStyle=f,e.beginPath(),e.moveTo(0,-.55),e.bezierCurveTo(-.5,-1.05,-1.05,-.3,-.72,.25),e.bezierCurveTo(-.5,.65,-.12,.8,0,1),e.bezierCurveTo(.12,.8,.5,.65,.72,.25),e.bezierCurveTo(1.05,-.3,.5,-1.05,0,-.55),e.fill(),e.strokeStyle=f,c(0,-1,0,.5,.06),e.strokeStyle=i,c(0,-.55,0,1.45,.03);for(const n of[-1,1])for(let d=0;d<4;d++)e.strokeStyle=d%2?l:i,c(0,-.5+d*.3,n*(1.9-d*.3),.6-d*.08,.025)});const y=new o.CanvasTexture(s);return y.colorSpace=o.NoColorSpace,y.generateMipmaps=!0,y.minFilter=o.LinearMipmapLinearFilter,y.magFilter=o.LinearFilter,y.anisotropy=2,y}async function _e(t,s,e,f,i){const{R:l,drumH:v}=k,c=new o.Vector4(f.hw,f.h,f.rise,1),u=new o.Vector4(i.hw,i.h,i.rise,1),y=l*(Math.PI/2-Math.asin(k.rosetteR/l))+v,n=qe(),d=new o.Vector2(262,21),a=new o.Mesh(n,s.glass({L:y,bars:.75,lap:1.31,cutA:c,cutB:u,crack:d})),r=new o.Mesh(n,s.glass({outside:!0,L:y,bars:.75,lap:1.31,reflect:.78,cutA:c,cutB:u,crack:d}));r.renderOrder=2,e.add(a,r),await t.yield();const h=Math.acos(k.rosetteR/l),p=Math.acos(1.6/l),x=s.iron({rivet:.3,cutA:c,cutB:u}),g=new o.Matrix4,w=(C,S)=>{const z=[];for(let L=0;L<k.bays;L++)S(L)&&z.push(L);const R=new o.InstancedMesh(C,x,z.length);return z.forEach((L,_)=>R.setMatrixAt(_,g.makeRotationY(L/k.bays*W))),R.frustumCulled=!1,e.add(R),R};w(pe(p,.42,.24),C=>C%4===0),w(pe(h,.32,.18),C=>C%4!==0),await t.yield();const m=[X(-1,.5,B(.5,1)),X(-1,5,B(.14,.12)),X(-1,v,B(.5,.5))];await t.yield(),m.push(X(h,0,B(.3,.2)),X(p,0,B(.3,.3))),await t.yield();for(const C of[.21,.42,.63,.84])m.push(X(C,0,B(.12,.1))),C===.42&&await t.yield();await t.yield();const b=new o.Mesh(Q(m),x);e.add(b);for(const C of m)C.dispose();await t.yield();const M=[me(f,1,B(.7,.5)),me(i,-1,B(.7,.5))];await t.yield();const V=Ue(t.rng);await t.yield();const P=new o.Mesh(Q(V.cut),x);e.add(P);for(const C of V.cut)C.dispose();return M.push(...V.free),{frames:M,cutA:c,cutB:u,stair:V.stair}}const se=(t,s,e)=>s>k.drumH?k.R-Math.hypot(t,s-k.drumH,e):k.R-Math.hypot(t,e);function ne(t,s,e,f=1){const i=t.length,l=[],v=[],c=[],u=[],y=[],n=new o.Vector3,d=new o.Vector3(1,0,0),a=new o.Vector3,r=new o.Vector3,h=new o.Vector3;let p=0;for(let g=0;g<i;g++){n.subVectors(t[Math.min(i-1,g+1)],t[Math.max(0,g-1)]).normalize(),a.crossVectors(n,d),a.lengthSq()<1e-6&&a.crossVectors(n,d.set(0,0,1)),a.normalize(),d.crossVectors(a,n).normalize(),g>0&&(p+=t[g].distanceTo(t[g-1]));for(let w=0;w<=e;w++){const m=w/e*W;h.copy(d).multiplyScalar(Math.cos(m)).addScaledVector(a,Math.sin(m)),r.copy(t[g]).addScaledVector(h,s[g]),l.push(r.x,r.y,r.z),v.push(h.x,h.y,h.z),c.push(w/e*f,p),u.push(Math.max(0,se(r.x,r.y,r.z)))}if(g<i-1)for(let w=0;w<e;w++){const m=g*(e+1)+w,b=m+e+1;y.push(m,m+1,b,m+1,b+1,b)}}const x=new o.BufferGeometry;return x.setAttribute("position",new o.Float32BufferAttribute(l,3)),x.setAttribute("normal",new o.Float32BufferAttribute(v,3)),x.setAttribute("uv",new o.Float32BufferAttribute(c,2)),x.setAttribute("aPane",new o.Float32BufferAttribute(u,1)),x.setIndex(y),x}async function He(t,s,e,f){const i=t.rng,{R:l,drumH:v}=k,c=new o.Vector3(0,v,0),u=i.range(.3,1.1),y=i.range(0,W),n=i.range(32,33.2),d=1.1,a=new o.Vector3(Math.cos(y)*u,n,Math.sin(y)*u),r=[],h=[];for(let A=0;A<=44;A++){const F=A/44,G=F*F*(3-2*F)+.25*Math.sin(F*Math.PI*2)*(1-F)*.4;r.push(new o.Vector3(a.x*G,re(d-.4,n,F),a.z*G)),h.push(.8*(1+.55*Math.exp(-F*14)-.1*F+.16*Math.exp(-(1-F)*(1-F)*90)))}const p=[ne(r,h,18,1)],x=96,g=new o.Vector3,w=new o.Vector3;for(let A=0;A<x;A++){const F=1-A/x*.36-i()*.01,G=A*2.39996+i.range(-.3,.3),E=Math.min(44,Math.floor(F*44)),I=g.set(Math.cos(G),0,Math.sin(G)),T=i.range(.55,1.2)*(.6+.4*F),D=i.range(.5,1.1),O=r[E].clone().addScaledVector(I,h[E]*.8),Z=O.clone().addScaledVector(I,T*.55).add(w.set(0,T*D*.5,0)),be=O.clone().addScaledVector(I,T).add(w.set(0,T*D,0));p.push(ne([O,Z,be],[.16,.11,.04],4,.25)),A%8===7&&await t.yield()}const m=new o.Mesh(Q(p),s.stem({scales:13,far:.95,reach:.3}));m.renderOrder=1,e.add(m);for(const A of p)A.dispose();await t.yield();const b=[],M=[],V=[],P=[],C=new o.Vector3,S=new o.Vector3,z=new o.Vector3,R=new o.Vector3,L=new o.Matrix4,_=(A,F)=>{const G=[],E=[],I=a.clone().lerp(A,.45);I.y+=F;for(let T=0;T<=8;T++){const D=T/8;G.push(new o.Vector3().copy(a).multiplyScalar((1-D)*(1-D)).addScaledVector(I,2*D*(1-D)).addScaledVector(A,D*D)),E.push(re(.085,.035,D))}V.push(ne(G,E,5,.3))},j=[[i.int(4,5),2.6,3],[i.int(9,11),6.9,3],[0,11.7,3]];j[2][0]=30-j[0][0]-j[1][0];for(const[A,F,G]of j){const E=i()*W;for(let I=0;I<A;I++){const T=E+I/A*W+i.range(-.06,.06),D=F+i.range(-.5,.5),O=D/l;z.set(-Math.sin(O)*Math.sin(T),-Math.cos(O),-Math.sin(O)*Math.cos(T)),R.copy(c).addScaledVector(z,-(l-.8+b.length*.012)),S.set(Math.cos(O)*Math.sin(T),-Math.sin(O),Math.cos(O)*Math.cos(T)),C.crossVectors(S,z),S.applyAxisAngle(z,i.range(-.3,.3)),C.crossVectors(S,z).normalize();const Z=G*i.range(.92,1.08);L.makeBasis(C,S,z).scale(new o.Vector3(Z,Z,Z)).setPosition(R),b.push([L.clone(),[-1,i(),0,0]]),_(R.clone().addScaledVector(z,.1),1.5+F*.12),P.push(R.clone())}}{const A=t.core.makeRng(t.core.hashSeed("fph-rosette-fill:"+t.seed));for(const[F,G]of[[7,4.7],[13,9.3]]){const E=A()*W;for(let I=0;I<F;I++){const T=E+I/F*W+A.range(-.08,.08),D=(G+A.range(-.4,.4))/l;z.set(-Math.sin(D)*Math.sin(T),-Math.cos(D),-Math.sin(D)*Math.cos(T)),R.copy(c).addScaledVector(z,-(l-.86-(b.length-30)*.012)),S.set(Math.cos(D)*Math.sin(T),-Math.sin(D),Math.cos(D)*Math.cos(T)),C.crossVectors(S,z),S.applyAxisAngle(z,A.range(-.5,.5)),C.crossVectors(S,z).normalize();const O=3*A.range(.9,1.06);L.makeBasis(C,S,z).scale(new o.Vector3(O,O,O)).setPosition(R),b.push([L.clone(),[-1,A(),0,0]]),_(R.clone().addScaledVector(z,.1),1.5+G*.12)}}}const K=Math.round(i.int(24,30)*(.6+.4*f));for(let A=0;A<K;A++){const F=A*2.39996+i.range(-.4,.4),G=A<7,E=G?i.range(-.36,-.2):i.range(-.15,.75),I=G?i.range(8.5,11):i.range(4.5,9.5);S.set(Math.cos(E)*Math.cos(F),Math.sin(E),Math.cos(E)*Math.sin(F)),R.copy(a).addScaledVector(S,I),se(R.x,R.y,R.z)<4&&R.lerp(a,.3),S.y-=.25,S.normalize(),z.set(0,1,0).addScaledVector(S,-S.y).normalize().applyAxisAngle(S,i.range(-.7,.7)),C.crossVectors(S,z).normalize();const T=2.5*i.range(.85,1.12);L.makeBasis(C,S,z).scale(new o.Vector3(T,T,T)).setPosition(R),M.push([L.clone(),[Math.max(.5,se(R.x,R.y,R.z)),i(),i.range(.05,.16),0]]),_(R.clone(),G?2.2:1.2),P.push(R.clone())}const N=new o.Mesh(Q(V),s.stem({scales:0,far:0,depthWrite:!1}));N.renderOrder=2.9,e.add(N);for(const A of V)A.dispose();await t.yield();const Y=oe(-1.5,1.5,-1.05,1.5,6,6),$=(A,F,G)=>{const E=s.leafAttr(Y.clone(),A.map(T=>T[1])),I=new o.InstancedMesh(E,F,A.length);return A.forEach((T,D)=>I.setMatrixAt(D,T[0])),I.frustumCulled=!1,I.renderOrder=G,e.add(I),I},ye=$(b,s.leaf({fan:!0,core:!0,afterGlass:!0,conformR:l,breath:.03,sway:.012}),3),xe=$(M,s.leaf({fan:!0,core:!0,sway:.05,reach:.4}),0),ge=$(M,s.leaf({fan:!0,sway:.05,reach:.4,fade:.55}),2.5);return Y.dispose(),{top:a,trunkPts:r,rosette:ye,cores:xe,soft:ge,hubs:P,scallops:j[2][0],phase:0}}function Ue(t){const{R:s,drumH:e}=k,f=[],i=[],l=(w,m,b)=>new o.Vector3(w,m,b),v=l(0,1,0),c=(w,m,b)=>l(w*Math.sin(m),b,w*Math.cos(m)),u=(w,m,b,M)=>w.push(q(m,M||m.map(()=>v),b)),y=e+s*Math.sin(Math.acos(1.6/s));i.push(U(1.6,y+.25,B(.3,.3),32),U(1.25,y+1.9,B(.16,.2),32));for(let w=0;w<8;w++){const m=w/8*W,b=[],M=[];for(let V=0;V<=12;V++){const P=V/12,C=P<.4?1.5-.25*(P/.4):1.25*Math.pow(1-(P-.4)/.6,.55)+.05;b.push(c(C,m,y+.3+P*4.6)),M.push(c(1,m,0))}i.push(q(b,M,B(.12,.1)))}u(i,[l(0,y+4.6,0),l(0,y+8.2,0)],B(.12,.12),[l(1,0,0),l(1,0,0)]),i.push(U(.42,y+5.6,B(.3,.14),16),U(.24,y+6.5,B(.18,.1),12)),f.push(U(s+.42,e+.75,B(.06,.06),192));for(let w=0;w<96;w++){const m=(w+.5)/96*W,b=w%2?.8:1.25;f.push(q([c(s+.42,m,e+.2),c(s+.42,m,e+.2+b*.7),c(s+.42,m,e+.2+b)],[c(1,m,0),c(1,m,0),c(1,m,0)],[[-.03,-.09,-.03,.09],[.03,-.09,.03,.09]]))}const n=e,d=s-2.4;f.push(U(s-1.25,n,[[0,-1.15,0,1.15]],192),U(d,n-.12,B(.24,.1),192),U(d+.05,n+1.1,B(.07,.09),192),U(d+.05,n+.55,B(.035,.035),192));for(let w=0;w<192;w++){const m=w/192*W;f.push(q([c(d+.05,m,n),c(d+.05,m,n+1.1)],[c(1,m,0),c(1,m,0)],[[-.02,0,.02,0],[0,-.02,0,.02]]))}for(let w=0;w<k.bays;w++){const m=w/k.bays*W,b=c(1,m+Math.PI/2,0),M=[],V=[],P=[],C=[];for(let S=0;S<=8;S++){const z=S/8*Math.PI/2;M.push(c(s-.25-2.15*Math.sin(z),m,n-.2-2.4*Math.cos(z))),V.push(b)}for(let S=0;S<=12;S++){const z=S/12*W;P.push(c(s-.95+.52*Math.cos(z),m,n-.9+.52*Math.sin(z))),C.push(b)}f.push(q(M,V,[[-.05,-.07,-.05,.07],[.05,-.07,.05,.07],[-.05,0,.05,0]]),q(P,C,[[-.04,-.05,-.04,.05],[.04,-.05,.04,.05]]))}const a=t.pick([2.2,4.1])+t.range(-.15,.15),r=c(s-4.4,a,0),h=44,p=2.25;u(i,[l(r.x,0,r.z),l(r.x,n+1.2,r.z)],B(.16,.16),[l(1,0,0),l(1,0,0)]);const x=[],g=[];for(let w=0;w<=h;w++){const m=w/h,b=a+Math.PI+m*p*W,M=m*n,V=l(Math.sin(b),0,Math.cos(b));w<h&&i.push(q([l(r.x+V.x*.1,M+.2,r.z+V.z*.1),l(r.x+V.x*1.45,M+.2,r.z+V.z*1.45)],[v,v],[[0,-.16,0,.16],[-.03,-.16,-.03,.16]])),x.push(l(r.x+V.x*1.45,M+1.25,r.z+V.z*1.45)),g.push(v),w%2===0&&w<h&&i.push(q([l(r.x+V.x*1.45,M+.2,r.z+V.z*1.45),l(r.x+V.x*1.45,M+1.25,r.z+V.z*1.45)],[V,V],[[-.02,0,.02,0],[0,-.02,0,.02]]))}return i.push(q(x,g,B(.06,.06))),{cut:f,free:i,stair:r}}function U(t,s,e,f=96){const i=[],l=[];for(let v=0;v<=f;v++){const c=v/f*W;i.push(new o.Vector3(t*Math.sin(c),s,t*Math.cos(c))),l.push(new o.Vector3(0,1,0))}return q(i,l,e)}function je(t,s,e,f=64){const i=new o.RingGeometry(Math.max(t,.001),s,f,1);i.rotateX(-Math.PI/2),i.translate(0,e,0);const l=i.attributes.position.count,v=i.attributes.uv,c=new Float32Array(l).fill(1);for(let u=0;u<l;u++)v.setXY(u,.5,0);return i.setAttribute("aW",new o.BufferAttribute(c,1)),i.deleteAttribute("normal"),i}async function Ne(t,s,e,f,i){const l=t.rng,{poolR:v}=k,c=.42,u=(P,C,S,z)=>{const R=new o.RingGeometry(P,C,z,1);return R.rotateX(-Math.PI/2),R.translate(0,S,0),R},y=new o.Mesh(u(2.6,v,c,96),s.pool({scallops:i.scallops,phase:i.phase}));e.add(y);const n=new o.Mesh(u(v+.4,k.R-.02,.02,96),s.floor());e.add(n);const d=[U(v+.25,.33,B(.66,.6)),U(3,.5,B(1,.7),48),U(2.1,.95,B(.5,1.2),40),je(0,2.6,1,40)],a=new o.Mesh(Q(d),s.iron({tone:.75}));e.add(a);for(const P of d)P.dispose();await t.yield();const r=[],h=[],p=[],x=new o.Vector3,g=new o.Vector3,w=new o.Vector3(0,1,0),m=new o.Matrix4,b=Math.round(40*(.7+.3*f));for(let P=0,C=0;P<b&&C<900;C++){const S=Math.sqrt(l.range(21.159999999999997,158.76)),z=l()*W,R=Math.cos(z)*S,L=Math.sin(z)*S;let _=!0;for(const Y of p)if((Y[0]-R)*(Y[0]-R)+(Y[1]-L)*(Y[1]-L)<2.25*2.25){_=!1;break}if(!_)continue;p.push([R,L]),P++;const j=l()*W,K=l.range(1.7,2.25),N=K/.485;g.set(Math.cos(j),0,Math.sin(j)),x.crossVectors(g,w),m.makeBasis(x,g,w).scale(new o.Vector3(N,N,N)).setPosition(R-g.x*N*.5,c+.03+P*6e-4,L-g.z*N*.5),r.push([m.clone(),[Math.max(1,k.R-S-4),l(),0,ve.pad]])}for(let P=0;P<5;P++){const C=p[Math.floor(l()*p.length)],S=l()*W,z=l.range(1.3,1.8),R=C[0]+Math.cos(S)*1.25,L=C[1]+Math.sin(S)*1.25,_=l()*W;g.set(Math.cos(_),0,Math.sin(_)),x.crossVectors(g,w),m.makeBasis(x,g,w).scale(new o.Vector3(z,z,z)).setPosition(R-g.x*z*.5,c+.16,L-g.z*z*.5),h.push([m.clone(),[12,l(),-.25,ve.flower]])}const M=oe(-.5,.5,0,1,2,2),V=(P,C,S)=>{const z=s.leafAttr(M.clone(),P.map(L=>L[1])),R=new o.InstancedMesh(z,C,P.length);return P.forEach((L,_)=>R.setMatrixAt(_,L[0])),R.frustumCulled=!1,R.renderOrder=S,e.add(R),R};return V(r,s.leaf({core:!0,sway:.03,hold:.82,reach:.5}),0),V(r,s.leaf({sway:.03,hold:.82,reach:.5}),2.2),V(h,s.leaf({white:!0,sway:.02,breath:.08}),2.3),M.dispose(),{waterY:c,spots:p}}function Ye(t,s,e,f,i,l){const v=t.rng,c=[7,14.5,21],u=[];for(const p of c){const x=new o.CircleGeometry(29.2,48);x.rotateX(-Math.PI/2),x.translate(0,p+v.range(-.6,.6),0),u.push(x)}const y=new o.Mesh(Q(u),s.mist({strength:.36,edge:29,span:[400,400]}));y.renderOrder=5,e.add(y);for(const p of u)p.dispose();const n=f.hubs.filter(p=>{const x=Math.hypot(p.x,p.z);return x>3.4&&x<k.poolR-.8}),d=Math.max(8,Math.round(Math.min(n.length,44)*l)),a=new Float32Array(d*4);for(let p=0;p<d;p++){const x=n[p%n.length];a.set([x.x+v.range(-1.2,1.2),x.y-v.range(.5,2),x.z+v.range(-1.2,1.2),v()],p*4)}const r=new o.PlaneGeometry(2,2);r.setAttribute("aDrop",new o.InstancedBufferAttribute(a,4));const h=new o.InstancedMesh(r,s.drops({floorY:i.waterY}),d);return h.frustumCulled=!1,h.renderOrder=4,e.add(h),{shelves:c}}async function $e(t,s={}){const e=s.style||De(t,{palette:s.palette,runDensity:s.runDensity}),f=!s.style;await t.yield();const i=J(s.detail??t.quality?.detail??1,.6,1),l={...Ge,...s.archOut||{}},v={...Ee,...s.archIn||{}},c=new o.Group;c.name="fogged-palm-house-hero";const u=await _e(t,e,c,l,v),y=new o.Mesh(Q(u.frames),e.iron({rivet:.3}));c.add(y);for(const m of u.frames)m.dispose();await t.yield();const n=await He(t,e,c,i);await t.yield();const d=await Ne(t,e,c,i,n);await t.yield();const a=Ye(t,e,c,n,d,i);await t.yield();const r=(m,b,M)=>new o.Vector3(m,b,M),h=k.R,p=new o.Vector3,x=new o.Vector3,g=c.children.find(m=>m.material&&m.material.uniforms&&m.material.uniforms.uDomeC).material;return{object:c,radius:h,height:k.apexY,center:r(0,20,0),ground:!0,groundY:0,style:e,anchors:{entryArch:{position:r(0,0,-h),halfWidth:v.hw,height:v.h,rise:v.rise,facing:r(0,0,-1)},exitArch:{position:r(0,0,de(0,l.h,1).z),rim:r(0,0,h),halfWidth:l.hw,height:l.h,rise:l.rise,facing:r(0,0,1)},flyThrough:[r(0,5,-30),r(16,8,0),r(0,13.5,15),r(-14,19,0),r(0,24,-12),r(8,24,0),r(0,13,36)],crown:n.top.clone().add(r(0,3,0)),trunkTop:n.top.clone(),apex:r(0,k.apexY,0),rosetteRadius:k.rosetteR,pool:{center:r(0,d.waterY,0),radius:k.poolR,kerbTop:.66},island:r(0,1,0),kerbSeat:r(Math.sin(.6)*(k.poolR+.25),.66,-Math.cos(.6)*(k.poolR+.25)),stair:u.stair.clone(),chairSeat:u.stair.clone().multiplyScalar(.86),galleryY:k.drumH,mistShelves:a.shelves,viewpoints:{fromSnow:r(0,3,-150),poolSide:r(16,8,0),underFans:r(8,24,0)}},setSyringe(m){e.setSyringe(m)},update(m,b,M){f&&(e.update(m,b,M),M&&(p.setFromMatrixPosition(M.matrixWorld),c.worldToLocal(p),e.setInside(p.x*p.x+p.z*p.z<h*h&&p.y<41?1:0))),c.updateWorldMatrix(!0,!1),g.uniforms.uDomeC.value.copy(x.set(0,k.drumH,0).applyMatrix4(c.matrixWorld))},dispose(){f&&e.dispose()}}}export{ve as ATLAS_CELLS,k as DOME,ie as PALETTE,B as boxSection,$e as buildHero,oe as cardGeometry,ue as iSection,q as ironSweep,De as makeStyle,Ke as makeStyleTextures};
