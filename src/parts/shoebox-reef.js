import*as i from"three";const ze=["#B98D5A","#F2668B","#F58A1F","#FFD23F","#43ABE2","#2438A6","#F6F3E8"],Le={red:"#E23B2E",green:"#3FA34D",darkGreen:"#1F7A46",black:"#26242B",grey:"#8E9299",pencil:"#5A5A66",shadow:"#8C86B5",brass:"#C79A2B",wire:"#3A3A44",tape:"#E9DDB4",wool:"#F6F3E8",dowel:"#D8B988"},Ce=19,Ee=17,Fe=5,qe=`
#define SBR_SHEETS 19
#define SBR_SHADOWS 17
uniform float uTime;
uniform vec4 uSheetA[SBR_SHEETS];   // x: plane coordinate, y,z: lo,hi along the sheet, w: 0 = sheet across the course (plane z = x), 1 = lengthwise (plane x = x)
uniform vec2 uSheetB[SBR_SHEETS];   // bottom y, top y
uniform float uSheetN;
uniform vec4 uShA[SBR_SHADOWS];     // caster centre x, z, half-length, half-width (world)
uniform vec4 uShB[SBR_SHADOWS];     // cos, sin of the long axis, caster height y, strength 0..1
uniform vec3 uCard, uBlue, uDeep, uShadowCol, uCrinkleCol;
uniform vec4 uLid;                  // centre x, z, half-width x, half-depth z (world)
uniform float uLidY, uCrinkleAmt, uWaterStep, uRain;
uniform vec2 uSlant;                // horizontal drift of lid light per metre of drop (tan 12 deg)
uniform sampler2D uCrinkle;
uniform vec4 uPool[11];             // where daylight comes down: x, z at height w, radius (0: none). 0: the open lid over centre stage, 1: the daylight by the hole; 2-10: the nine shafts
uniform vec4 uPoolTint;             // what a shaft does to the dark sugar paper it lands on: rgb the hour's tint, w how much paler the paper is in its pool
uniform vec3 uPoolAmt;              // light outside the shafts, light inside them, warmth inside
uniform vec3 uDeepK;                // what the film does to dark paper: the sugar paper's own hue, deeper (blue box, green box)
uniform float uShShift;
uniform vec4 uShAnchor;              // the manta's lid shadow: lean x, z per metre of drop below the anchor height z; w: how far it is drawn out along the lean (0: not at all)
uniform vec3 uVeil;                 // what a sheet does to the dark paper behind it: x the step per sheet (of the way to uDeepK times itself), y the most, z the weight of a sheet far down the box
uniform vec3 uSpot;                 // x, z, radius: a place the manta's shadow never covers (the crab keeps its daylight)
uniform vec4 uTurtle;               // our turtle's lid shadow (slot 5): x how far each flipper is swept forward (radians), y its size, z the wool tail's length in the manta's shadow (metres), w how far the manta's shadow is carried along the light's slant (1: as the light falls, 0: straight below)
uniform vec4 uHinge;                // lid shadow of the manta: x seam of light at each hinge (metres), y size on the coral, z strength of the steps' own crescents under it, w reach of a hung tray's shadow at a low sun
float sbrHash(vec2 p){ p = fract(p * vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.x); }
float sbrNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(sbrHash(i), sbrHash(i + vec2(1., 0.)), f.x), mix(sbrHash(i + vec2(0., 1.)), sbrHash(i + vec2(1., 1.)), f.x), f.y); }
// WATER: how many hung sheets of cellophane the straight line from eye e to point p passes through (hard edged, countable)
float sbrCrossN = -1.;              // (set by sbrSheets in the same stage: the sheets hung ACROSS the course among them; -1 where the count came in as a varying)
float sbrSheets(vec3 e, vec3 p){
  float n = 0., nc = 0.; vec3 d = p - e;
  for (int i = 0; i < SBR_SHEETS; i++) {
    vec4 a = uSheetA[i]; vec2 b = uSheetB[i];
    float along = a.w < 0.5 ? d.z : d.x, from = a.w < 0.5 ? e.z : e.x;
    float den = abs(along) < 1e-4 ? 1e-4 : along;
    float t = (a.x - from) / den;
    vec3 h = e + d * t;
    float s = a.w < 0.5 ? h.x : h.z;
    float hit = step(0., t) * step(t, 1.) * step(a.y, s) * step(s, a.z) * step(b.x, h.y) * step(h.y, b.y) * step(float(i) + 0.5, uSheetN);
    // (a sheet's veil on the paper is the same over the whole sheet and plainest for the sheets near the eye: the ones we are passing split the frame,
    // the ones far down the box lay a finer step, so the far wall keeps its depth)
    n += hit; nc += hit * (a.w < 0.5 ? mix(uVeil.z, 1., 1. - smoothstep(50., 110., abs(a.x - from))) : 1.);
  }
  sbrCrossN = min(nc, 7.);
  return min(n, 7.);
}
// one flat step per sheet, the same over the whole sheet and hard at its hem and border, and every step is DEEPER. Cellophane is a filter: bright paint behind it
// goes a quarter of the way to the film's colour per sheet, and from the second sheet on the film's colour itself sinks toward the deep (one tone after four); dark
// sugar paper behind it goes a step deeper in its own hue (uVeil.x of the way to uDeepK times itself) for every sheet, a full step for the sheets we are passing and a
// finer one for those far down the box, so the wall is nowhere paler than the bare paper and the bare paper round the hole is the most saturated tone in the box
vec3 sbrWaterB(vec3 c, float n, float bright){
  float nc = sbrCrossN < 0. ? n : sbrCrossN;
  vec3 dark = c * pow(max(uDeepK, vec3(1e-3)), vec3(min(uVeil.x * nc, uVeil.y)));   // (each sheet takes the same share of what is left: four even steps from the bare paper down to uDeepK times it)
  float k = min(0.25 * n, 0.76 + 0.03 * n);
  vec3 target = mix(uBlue, uDeep * 0.5, 0.72 * smoothstep(1.0, 4.6, n));
  // a sheet's step is plain on every edition: the paint goes a quarter of the way to the water's colour, and where that colour is nearly the paint's own value
  // (pink in pale water) the water it goes toward is taken deeper, six tenths of the paint's value, so each sheet takes a tenth of the value at the least
  float lc = dot(c, vec3(0.3, 0.55, 0.15)), lt = dot(target, vec3(0.3, 0.55, 0.15));
  target *= min(1., 0.6 * lc / max(lt, 1e-3));
  return mix(dark, mix(c, target, k), bright);
}
vec3 sbrWater(vec3 c, float n){ return sbrWaterB(c, n, smoothstep(0.27, 0.5, dot(c, vec3(0.3, 0.55, 0.15)))); }
// DAYLIGHT: the shafts that come down between the dowels; 1 inside one, 0 outside, soft over a few metres
float sbrPoolP = 0.;                 // (set by sbrPool: the same for the nine shafts alone, whose pools also show on the paper)
float sbrPool(vec3 p){
  float l = 0., lp = 0.;
  for (int i = 0; i < 11; i++) {
    vec4 a = uPool[i]; vec2 q = p.xz - a.xy - uSlant * (a.w - p.y); float r = max(a.z, 0.01);
    float e = (1. - smoothstep(r * 0.9, r * 1.04, sqrt(dot(q, q)))) * step(0.02, a.z);     // (a shaft's edge is firm, like cut paper)
    l = max(l, e); if (i > 1) lp = max(lp, e);
  }
  sbrPoolP = lp;
  return l;
}
// LID SHADOW: soft grey-violet ellipses lying almost straight below their casters; 0 = lit, 1 = full shadow
float sbrTurtleSh = 0.;              // our turtle's shadow (slot 5), kept apart: it lies only on what faces the lid
float sbrShadowSplit(vec3 p, out float others){
  float s = 0., so = 0., sl2 = dot(uSlant, uSlant), sl = sqrt(sl2); sbrTurtleSh = 0.;
  vec2 sd = sl2 > 1e-6 ? uSlant / max(sl, 1e-3) : vec2(1., 0.);
  float st = 1. + 2.6 * smoothstep(0.09, 0.6, sl2);             // a low sun draws the far half of a shadow out long, away from the light (noon's 12 degrees leaves it as it is)
  float offK = sl / (1. + 3. * sl2);                            // and it still falls where the eye can find it: under and a little beyond its caster
  float cap = 3.2 + 4.2 * smoothstep(0.25, 0.7, sl2);           // a low sun draws the steps' and the trays' shadows out two or three times as long
  vec2 c0 = uShA[0].xy;
  float lnl = dot(uShAnchor.xy, uShAnchor.xy); vec2 lnN = lnl > 1e-6 ? uShAnchor.xy * inversesqrt(lnl) : vec2(1., 0.);
  for (int i = 0; i < SBR_SHADOWS; i++) {
    vec4 a = uShA[i], b = uShB[i];
    float drop = b.z - p.y, panel = i < 5 ? 1. : 0.;            // slots 0-4 are the manta's five flats: cut shapes, not ovals
    // the lid is a wide light: the manta's shadow closes in a little as it falls (uHinge.y of its size on the coral 35 m below), and stays the animal's own shape:
    // a pointed body and two flats a side, lying across the top steps and over their edge
    float shr = mix(1., mix(1., uHinge.y, smoothstep(8., 36., drop)), panel);
    float reach = i > 12 ? max(cap, uHinge.w * smoothstep(0.25, 0.7, sl2)) : cap;   // (a hung tray's shadow is drawn out across the floor by a low sun)
    // (the manta's shadow is laid at the height of the coral head's top, uShAnchor.z, and leans from there by uShAnchor.xy per metre of drop: the world leans it
    // along our line of sight while we look down, so the steps do not break its outline and it is seen as the animal's own shape)
    vec2 q;
    if (i < 5) {
      vec2 Q = p.xz - c0 - sd * (0.8 * offK * (b.z - uShAnchor.z) * uTurtle.w) - uShAnchor.xy * (uShAnchor.z - p.y);
      Q -= lnN * (dot(Q, lnN) * uShAnchor.w + uShShift);         // (and drawn out along that line as a slanting light draws a shadow out, so we see it at its full length; uShShift: metres farther along it)
      q = Q - (a.xy - c0) * shr;
    } else q = p.xz - a.xy - sd * min(sl * drop, reach);
    if (i > 12) q -= sd * dot(q, sd) * (1. - 1. / (1. + 0.5 * (st - 1.)));   // (a hung tray's shadow is drawn out long by a low sun; the manta's keeps the animal's own shape at every hour)
    vec2 r = max(a.zw * shr, vec2(0.01));
    q = vec2(q.x * b.x + q.y * b.y, -q.x * b.y + q.y * b.x) / r;
    vec2 qa = abs(q);
    float qo = (i == 3 || i == 4) ? -q.x : q.x;                 // toward the wing tip
    float l = length(q);
    if (i == 0) {
      l = max(qa.y, qa.x + 0.42 * qa.y);                         // the body: straight sides, pointed at nose and tail
      float tx = -q.x * r.x - 0.8 * r.x, tt = tx / max(uTurtle.z, 0.5);          // and the wool tail trailing behind it: a thin line, snaking a little
      float ty = abs(q.y * r.y - 1.2 * tt * sin(tx * 0.3 + uTime * 0.9));
      if (tt > 0. && tt < 1.) l = min(l, ty / (0.8 * (1. - 0.6 * tt)));
    }
    else if (i == 1 || i == 3) l = max(qa.x, qa.y / max(1. - 0.2 * (qo + 1.), 0.2));   // the inner flat: a trapezoid, narrower where the outer one hinges on
    else if (i == 2 || i == 4) l = max(qa.x, abs(q.y + 0.3 * (qo + 1.)) * 0.84 + 0.42 * (qo + 1.));   // the outer flat: a triangle out to the tip, swept back a little
    if (i == 5) {
      vec2 m = q * r / max(uTurtle.y, 0.1);                      // metres in the turtle's own frame: x toward its nose, y to its side
      float lt = length(m / vec2(2.5, 1.85));                    // the shell: a card oval 5 m long
      lt = min(lt, length((m - vec2(3.05, 0.)) / vec2(0.85, 0.6)));   // the head
      float ca = cos(uTurtle.x), sa = sin(uTurtle.x);
      for (int f = 0; f < 2; f++) {                              // two flippers, 3.2 m, turning on their fasteners
        float sg = f == 0 ? 1. : -1.; vec2 a0 = vec2(1.35, sg * 1.45), ba = vec2(sa, sg * ca) * 3.2, pa = m - a0;
        float h = clamp(dot(pa, ba) / 10.24, 0., 1.); vec2 ev = pa - ba * h;
        lt = min(lt, sqrt(dot(ev, ev)) / (0.34 + 0.3 * sin(3.1416 * min(h * 1.25, 1.))));
      }
      l = lt; panel = 1.;
    }
    float soft = min(mix(clamp(drop * 0.03, 0.35, 1.6), 0.07, panel) / max(min(r.x, r.y), 0.5), 0.6);   // the edge is soft over a metre or two, whatever the size of the caster (the manta's panels: a firm half metre)
    float e = 1. - smoothstep(1. - soft, 1. + soft, l);
    // (the five flats are cut shapes with crisp edges; each wing flat stops uHinge.x metres short of its hinge, so a seam of lit paint parts it from its neighbour)
    if (i > 0 && i < 5) e *= smoothstep(uHinge.x - 0.07, uHinge.x + 0.07, (qo + 1.) * r.x);
    if (i == 5) sbrTurtleSh = e * b.w * step(0.5, drop);           // (our turtle's: the same flat violet as the manta's)
    else if (i < 5) s = max(s, e * b.w * smoothstep(24., 32., drop));   // (not on the manta's own wings as they dip under its body)
    else if (i > 5) so = max(so, e * b.w * step(0.5, drop) * ((i > 6 && i < 13) ? mix(1., uHinge.z, s) : 1.));   // (the steps' own crescents are lighter where the manta's shadow lies over them, so its outline is not lost in theirs)
  }
  { vec2 qs = p.xz - uSpot.xy; s *= smoothstep(uSpot.z * 0.7, uSpot.z * 1.05 + 0.01, sqrt(dot(qs, qs))); }
  others = so;
  return s;                                                     // the manta's five panels; others is the rest (the steps, the crab, the turtle)
}
float sbrShadow(vec3 p){ float o; float s = sbrShadowSplit(p, o); return max(max(s, o), sbrTurtleSh); }
`,Oe=`
float sbrCrinkleAt(vec3 p){
  vec2 u1 = p.xz * 0.013 + vec2(uTime * 0.019, uTime * 0.008) + p.y * 0.004;
  vec2 u2 = vec2(p.z, -p.x) * 0.017 + vec2(-uTime * 0.011, uTime * 0.021) + 0.37;
  float a = texture2D(uCrinkle, u1).r, b = texture2D(uCrinkle, u2).r;
  return clamp(max(a, b * 0.7) * 0.75 + a * b * 1.2, 0., 1.);
}
// rain on the window (uRain 1): the net of crinkle light gives way to slow streaks sliding down every face, a bright bead with a tail above it
float sbrRainAt(vec3 p, vec3 n){
  vec2 q = abs(n.y) > 0.6 ? vec2(p.x * 0.9 + 3.1, p.z + 0.3 * p.x) : vec2(p.x * 0.8 + p.z * 0.6, -p.y);
  float col = q.x * 1.1, fw = fwidth(col), id = floor(col), fx = abs(fract(col) - 0.5), h = sbrHash(vec2(id, 7.));
  float v = fract(q.y / 26. - uTime * (0.03 + 0.03 * h) + h * 13.);
  float streak = smoothstep(0.1, 0.5, v) * (1. - smoothstep(0.5, 0.53, v));
  float w = 0.09 + 0.07 * streak;
  float m = (1. - smoothstep(w, w + fw + 0.01, fx)) * streak * 1.3 * min(1., w / max(fw * 0.8, 1e-4));   // a streak thinner than a pixel and a half fades instead of being drawn wider than it is
  return clamp(mix(m, 0.05, smoothstep(0.22, 0.55, fw)), 0., 1.);
}
// everything the light does to a pot colour: lid facing, lid shadow, crinkle light, then the counted water
vec3 sbrLight(vec3 pot, vec3 p, vec3 n, float sheets){
  float up = smoothstep(-0.25, 0.7, n.y);
  // a fifth brighter where it faces the lid, the pot colour midway; a face turned right away from the lid (the underside of a flat) is a tone deeper the squarer it
  // looks down, so the flats of a hinged thing seen from below stand at different tones
  vec3 c = pot * mix(mix(0.83, 0.94, smoothstep(-1., -0.62, n.y)), 1.10, up);
  float potB = smoothstep(0.27, 0.5, dot(pot, vec3(0.3, 0.55, 0.15)));
  float lit = sbrPool(p) * mix(0.12, 1., potB);   // in a shaft of daylight paint is plainly paler and a little warm, outside it a step deeper; the dark sugar paper stays deep in or out of a shaft (the bare wall is the deepest tone in the box)
  c *= mix(vec3(mix(1., uPoolAmt.x, potB)), uPoolAmt.y * vec3(1., 1. - 0.5 * uPoolAmt.z, 1. - uPoolAmt.z), lit);   // (bare sugar paper is its own pot in or out of a shaft: only the sheets make it deeper)
  float dkp = 1. - dot(c, vec3(0.3, 0.55, 0.15)); c += mix(c * 2.6, vec3(1., 0.95, 0.8), 0.4) * (1.4 * uPoolAmt.z * dkp * dkp * lit);
  c = mix(c, c * (1. + uPoolTint.w) + uPoolTint.rgb * (0.07 * uPoolTint.w), sbrPoolP * (1. - potB));   // where one of the nine shafts lands on sugar paper the paper is a pale pool: its own hue, paler, leaning to the hour's light   // dark paper in the shaft is plainly paler, in its own hue; bright paint keeps its pot colour
  float so; float sp = sbrShadowSplit(p, so);
  sp = max(sp, sbrTurtleSh * smoothstep(0.45, 0.75, n.y));
  // under the manta every face is in its shadow (cup walls and risers too, so the five shapes hold together); a step's or the crab's shadow lies only on what faces the lid
  float sh = so * smoothstep(0.3, 0.7, n.y) * (1. - sp);
  // a step's, a tray's or the crab's shadow: pot colour times the shadow's violet, and nearly half of a stronger violet itself, so that it is violet on orange and card too
  // (never brown); on dark sugar paper it is the paper a step deeper. The manta's own shadow is ONE flat violet whatever it lies on: five pieces cut from sugar paper
  vec3 vio = uShadowCol * vec3(0.85, 0.75, 1.12);
  c = mix(c, mix(c * vec3(0.6, 0.58, 0.74), mix(c * uShadowCol * 1.25, vio, 0.45), potB), sh * 0.9);
  c = mix(c, mix(c * vec3(0.6, 0.58, 0.74), vio * (0.97 + 0.03 * smoothstep(-0.3, 0.25, n.y)), mix(0.6, 1., potB)), sp * 0.97);
  sh = max(sh, sp);
  float cr = mix(sbrCrinkleAt(p), sbrRainAt(p, n), uRain) * uCrinkleAmt * (0.45 + 0.55 * up) * (1. - 0.8 * sh) * (1. - sp) * (0.5 + 0.5 * dot(c, vec3(0.3, 0.5, 0.2)));
  // thrown light on dark sugar paper comes back in the paper's own hue (a brighter blue or green, never a grey); on paint it is the light's own colour
  c = mix(c, mix(min(c * 2.4 + 0.02, vec3(1.)), uCrinkleCol, smoothstep(0.22, 0.5, dot(c, vec3(0.3, 0.55, 0.15)))), cr);
  return sbrWaterB(c, sheets, potB);   // (what the film does to a thing goes by its pot: sugar paper is dark paper in or out of a shaft)
}
`,Ge=`
attribute vec4 aPaint;
varying vec3 vWp, vWn, vCol; varying vec4 vPaint; varying float vSheets;
SBR_COMMON
SBR_HOOK_DECL
void main(){
  vec3 pos = position, nrm = normal; vec4 pnt = aPaint;
  SBR_HOOK
  vec4 wp = vec4(pos, 1.); vec3 wn = nrm;
  #ifdef USE_INSTANCING
    wp = instanceMatrix * wp; wn = mat3(instanceMatrix) * wn;
  #endif
  wp = modelMatrix * wp; wn = mat3(modelMatrix) * wn;
  vWp = wp.xyz; vWn = wn; vPaint = pnt;
  vCol = color;
  #ifdef USE_INSTANCING_COLOR
    vCol *= instanceColor;
  #endif
  vSheets = 0.;
  #ifdef SBR_VERT_WATER
    vSheets = sbrSheets(cameraPosition, wp.xyz);
  #endif
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,Ie=`
varying vec3 vWp, vWn, vCol; varying vec4 vPaint; varying float vSheets;
SBR_COMMON
SBR_FRAG
void main(){
  float l2 = dot(vWn, vWn);
  vec3 n = l2 > 1e-8 ? vWn * inversesqrt(l2) : vec3(0., 1., 0.);
  if (!gl_FrontFacing) n = -n;
  float kind = vPaint.w, bu = vPaint.x, bv = vPaint.y;
  vec3 pot = vCol;
  // derivatives first (nothing below sits in a loop, but keep them together)
  float fwV = fwidth(bv), fwU = fwidth(bu), fwE = fwidth(vPaint.z);
  float cut = 0.;
  // (how far across a round stem this fragment sits, 0 on its axis to 1 at its silhouette, and its derivative: taken here, outside any branch)
  vec3 ev = cameraPosition - vWp; ev = ev * inversesqrt(max(dot(ev, ev), 1e-6));
  float fx = abs(dot(n, ev)), xr = sqrt(max(1. - fx * fx, 0.)), fwX = fwidth(xr) + 1e-4;
  if (kind > 7.5) {                       // pipe cleaner: a chenille stem, bu = metres along it. Short bristles stand off both sides (the outer part of its width, cut out between
    float keepB = 1. - smoothstep(0.037, 0.055, fwU);
    // chenille: bristles of differing length, staggered from one side to the other, a few missing, slanting a little toward the tip (drawn while they are 3 px apart
    // or more, the flat tint when finer); the twisted wire a thin darker line down the middle
    float side = step(0., n.x + n.z), bq = (bu + side * 0.047 - xr * 0.05) / 0.094 + 0.35 * sbrNoise(vec2(bu * 5.3, side * 7.));
    float bi = floor(bq), bf = fract(bq), h1 = sbrHash(vec2(bi, 3. + side * 5.)), h2 = sbrHash(vec2(bi * 1.7 + 0.5, 11. + side * 3.));
    float reach = h2 < 0.16 ? 0.5 : 0.6 + 0.4 * h1, wid = 0.36 + 0.3 * h2;
    cut = step(0.52, xr) * max(step(wid, bf), step(reach, xr)) * step(0.5, keepB);
    pot *= mix(0.95, 0.88 + 0.14 * step(bf, wid), keepB);
    float lw = max(0.15, 1.5 * fwX), wire = (1. - smoothstep(lw, lw + fwX, xr)) * (0.72 + 0.28 * step(0.5, fract(bu * 4.5)));
    pot = mix(pot, pot * vec3(0.42, 0.4, 0.45), wire * (1. - smoothstep(0.22, 0.45, fwX)));
    kind = 4.;
  }
  #ifdef SBR_CUT
  if (kind > 6.5) {                       // card punched full of round holes (sea fans): a hex grid of holes 0.56 m across, none near the rim
    vec2 g = vec2(bu, bv) / 0.95; g.x += 0.5 * step(1., mod(floor(g.y), 2.));
    vec2 c = fract(g) - 0.5; float fwG = max(fwU, fwV) / 0.95;
    float keep = 1. - smoothstep(0.22, 0.4, fwG);                 // holes under about 3 px: the flat card, a little darker for the light they would let through
    float hole = (1. - smoothstep(0.30 - fwG, 0.30, length(c))) * smoothstep(0.5, 0.7, vPaint.z);
    cut = step(0.5, hole) * step(0.5, keep);
    pot *= mix(0.9, 1., keep);
    kind = 0.;
  }
  if (kind > 5.5) {                       // crepe paper: bu = metres along the streamer, bv = -1..1 across it, vPaint.z = half width in metres
    float fine = 1. - smoothstep(0.5, 1.5, fwU * 7.);            // the ruffle is drawn while a wave is wider than about 4 px
    float sgn = bv < 0. ? -1. : 1.;
    float ruf = sin(bu * 7.0 + sgn * 1.3 + 0.8 * sin(bu * 1.9)) * 0.6 + sin(bu * 15.5 + sgn * 4.1) * 0.4;
    float e = 1. - abs(bv);
    cut = step(e, (0.13 + 0.11 * ruf) * fine);                    // both edges cut in small waves
    float flute = smoothstep(0.35, 1., abs(bv)) * ruf * fine;     // the ruffle stands off the sheet: its waves catch and lose the lid
    float keepL = 1. - smoothstep(0.35, 1.1, fwU * 52.);          // crosswise crinkle, one line every 12 cm; the flat average once they fall under 3 px
    float cl = sin(bu * 52. + bv * 1.7 + 2.5 * sbrNoise(vec2(bu * 3.1, bv * 2.)));
    // and the coarse crinkle of the crepe itself, a darker line across the streamer every 0.8 m or so (wavering), which still reads when the fine one has gone to its average
    float cph = bu * 7.85 + bv * 0.9 + 2.2 * sbrNoise(vec2(bu * 0.9, bv * 1.3 + 4.));
    float keepC = 1. - smoothstep(0.5, 1.5, fwU * 7.85);
    float cw = clamp(fwU * 7.85 * 0.9, 0.0, 0.6);                 // never thinner than about a pixel and a half
    float cline = smoothstep(0.62 - cw, 0.96, sin(cph));
    pot *= (gl_FrontFacing ? 1.07 : 0.74) * (1. + 0.13 * flute) * (0.94 + 0.12 * cl * keepL) * (1. - 0.2 * cline * keepC);
    pot *= 0.96 + 0.08 * sbrNoise(vec2(bu * 0.6, bv * 1.5 + 9.));
  } else
  #endif
  if (kind < 0.5) {                       // poster paint, brushed flat and streaky along the stroke, stopping short of the rim
    float st = sbrNoise(vec2(bu * 0.33, bv * 4.6));
    float fine = sbrNoise(vec2(bu * 0.9 + 7., bv * 15.));
    float keep = 1. - smoothstep(0.25, 0.8, fwV * 15.);          // too fine to draw: fall back to the flat average
    pot *= 0.94 + 0.105 * mix(0.5, st, 1. - smoothstep(0.3, 1.0, fwV * 4.6)) + 0.03 * (fine - 0.5) * keep;
    pot = mix(pot, uCard, smoothstep(0.78, 0.97, fine) * 0.2 * keep);     // dry brush letting the card through
    float rim = 0.24 + 0.16 * (sbrNoise(vec2(bu * 0.7 + 3., bv * 0.7)) - 0.5);
    float aa = fwE * 0.8 + 0.004;
    pot = mix(uCard * (0.97 + 0.05 * st), pot, smoothstep(rim - aa, rim + aa, vPaint.z));
  } else if (kind < 1.5) {                // the cut edge: two liners and the flute between them
    float ph = bu * 11.4;                 // one flute every 0.55 m
    float fine = smoothstep(0.5, 1.6, fwU * 11.4);
    float wave = 0.5 + 0.27 * sin(ph);
    float aa = fwV * 1.2 + 0.01;
    float liner = 1. - smoothstep(0.17 - aa, 0.17 + aa, min(bv, 1. - bv));
    float flute = 1. - smoothstep(0.10 - aa, 0.10 + aa, abs(bv - wave));
    float tone = mix(0.56, 0.94, max(liner, flute * 0.92));
    pot = uCard * mix(tone, 0.78, fine);
  } else if (kind < 2.5) {                // bare stock
    float g = sbrNoise(vec2(bu * 0.5, bv * 9.));
    pot *= 0.95 + 0.08 * mix(0.5, g, 1. - smoothstep(0.3, 1.0, fwV * 9.));
  } else if (kind < 3.5) {                // brass fastener: a domed head that catches the lid
    vec3 v = cameraPosition - vWp; v = v * inversesqrt(max(dot(v, v), 1e-6));
    vec3 hv = v + vec3(0., 1., 0.); hv = hv * inversesqrt(max(dot(hv, hv), 1e-4));
    float g = max(dot(n, hv), 0.); g = g * g; g = g * g;
    pot = mix(pot * 0.8, vec3(1.0, 0.95, 0.72) * 1.5, smoothstep(0.35, 0.9, g));
  } else if (kind > 4.5) {                // wool: twisted fibres round the strand
    float tw = sin(bu * 9. + bv * 2.094) * 0.5 + 0.5;
    pot *= 0.9 + 0.13 * mix(0.5, tw, 1. - smoothstep(0.25, 0.9, fwU * 9. + fwV * 2.));
  } else {                                // tape, sugar paper
    float g = sbrNoise(vWp.xz * 2.3 + vWp.y * 1.7);
    pot *= 0.975 + 0.05 * mix(0.5, g, 1. - smoothstep(0.2, 0.8, fwU * 2.3 + fwV * 2.3));
  }
  float sheets = vSheets;
  #ifndef SBR_VERT_WATER
    sheets = sbrSheets(cameraPosition, vWp);
  #endif
  vec3 c = kind > 2.5 && kind < 3.5 ? sbrWater(pot, sheets) : sbrLight(pot, vWp, n, sheets);
  gl_FragColor = vec4(c, 1.);
  if (cut > 0.5) discard;
}`;function ee(a,e="",o=""){return a.replace("SBR_COMMON",qe).replace("SBR_FRAG",Oe).replace("SBR_FISHGLSL",Ne).replace("SBR_HOOK_DECL",e).replace("SBR_HOOK",o)}function te(a){return new i.Color(a)}function me(a,e){return a.core&&a.core.makeRng?a.core.makeRng(a.core.hashSeed(e+":"+a.seed)):a.rng.fork(e)}function De(a){const o=document.createElement("canvas");o.width=o.height=512;const s=new i.CanvasTexture(o);return s.wrapS=s.wrapT=i.RepeatWrapping,s.colorSpace=i.NoColorSpace,s.anisotropy=4,s.generateMipmaps=!0,s.minFilter=i.LinearMipmapLinearFilter,{tex:s,bake:async f=>{const u=o.getContext("2d");u.fillStyle="#000",u.fillRect(0,0,512,512),u.globalCompositeOperation="lighter",u.lineCap="round",u.lineJoin="round",await f();const x=54,w=[];for(let l=0;l<x;l++)w.push([a()*512,a()*512]);const t=l=>l-512*Math.round(l/512),y=[];for(let l=0;l<x;l++){const d=[];for(let p=0;p<x;p++)if(p!==l){const c=t(w[p][0]-w[l][0]),v=t(w[p][1]-w[l][1]);d.push([c*c+v*v,p,c,v])}d.sort((p,c)=>p[0]-c[0]);for(let p=0;p<3;p++)(d[p][1]>l||p===2)&&y.push([w[l][0],w[l][1],d[p][2],d[p][3],1.6+a()*2.6,Math.floor(80+a()*150),(a()-.5)*.35])}let h=0;for(let l=0;l<2;l++)for(const[d,p,c,v,b,r,m]of y){++h%6===0&&await f(),u.strokeStyle=l?`rgb(${r},${r},${r})`:`rgba(${r},${r},${r},0.28)`,u.lineWidth=l?b:b*5;for(let M=-512;M<=512;M+=512)for(let S=-512;S<=512;S+=512)d+M+Math.min(c,0)>532||d+M+Math.max(c,0)<-20||p+S+Math.min(v,0)>532||p+S+Math.max(v,0)<-20||(u.beginPath(),u.moveTo(d+M,p+S),u.quadraticCurveTo(d+M+c/2-v*m,p+S+v/2+c*m,d+M+c,p+S+v),u.stroke())}s.needsUpdate=!0}}}const Ne=`
attribute vec4 aFish;    // ring radius, angle on the tier, y of the hanger bar, thread length
attribute vec4 aFish2;   // tier index, seed 0..1, resting tilt (rad), size
uniform float uTierAng[5]; uniform float uTierDir[5]; uniform vec3 uTierTilt[5]; uniform float uBandAng, uGust;
// where a sardine hangs now: top and bottom of its thread, its heading, roll (how far it faces the lid) and nose pitch
void sbrFish(out vec3 top, out vec3 bot, out vec3 ypr, out float band){
  int ti = int(clamp(aFish2.x, 0., 4.) + 0.5);
  float seed = aFish2.y, ang = aFish.y + uTierAng[ti], dir = uTierDir[ti];
  top = vec3(cos(ang) * aFish.x, aFish.z, sin(ang) * aFish.x);
  top.y += dot(uTierTilt[ti].xy, top.xz);
  float d = ang - uBandAng + (aFish.x - 40.) * 0.007 + (aFish.z - aFish.w) * 0.005;
  d = atan(sin(d), cos(d));                                    // wrapped to -pi..pi (never atan(0,0): sin and cos are not both zero)
  band = max(1. - smoothstep(0.0, 1.15, abs(d)), uGust);
  vec2 sw = vec2(sin(uTime * (0.7 + 0.5 * seed) + seed * 40.), sin(uTime * (0.55 + 0.4 * seed) + seed * 71.));
  float amp = min(0.3 + aFish.w * 0.03, 1.5) + 0.8 * band;      // a longer thread swings wider
  bot = top + vec3(sw.x * amp, -aFish.w, sw.y * amp);
  float yaw = -ang - dir * 1.5708 + 0.5 * sin(uTime * 0.6 + seed * 30.) + 0.8 * band * sin(seed * 90.);
  float roll = aFish2.z + 0.16 * sin(uTime * 0.43 + seed * 17.) + band * (0.95 + 0.25 * seed);
  float pitch = (seed > 0.95 ? -0.38 : 0.06 * sin(uTime * 0.8 + seed * 55.)) + 0.12 * (seed - 0.5);
  ypr = vec3(yaw, pitch, roll);
}`,He=`
attribute vec3 aOther; attribute vec3 aLine;
uniform vec2 uRes, uDist; uniform float uMinA, uMaxA, uFade, uFarA, uPale; uniform vec3 uPaleCol;
varying vec3 vCol; varying float vA, vSheets;
SBR_COMMON
#ifdef SBR_FISH
SBR_FISHGLSL
#endif
void main(){
  vec3 a = position, b = aOther;
  #ifdef SBR_FISH
    vec3 top, bot, ypr; float band; sbrFish(top, bot, ypr, band);
    a = mix(bot, top, position.y); b = mix(top, bot, position.y);
  #endif
  vec4 wa = modelMatrix * vec4(a, 1.), wb = modelMatrix * vec4(b, 1.);
  vec4 ca = projectionMatrix * viewMatrix * wa, cb = projectionMatrix * viewMatrix * wb;
  // a long thread whose far end is behind the eye (its top, when we look up a little beside it) is cut off at the eye's plane first:
  // widened from a point behind the eye it would be drawn hundreds of pixels wide, a milky slab over the picture
  bool gone = false;
  if (ca.w < 0.35) { if (cb.w > 0.36) { float t = (0.35 - ca.w) / (cb.w - ca.w); ca = mix(ca, cb, t); wa = mix(wa, wb, t); } else gone = true; }
  else if (cb.w < 0.35) { float t = (0.35 - cb.w) / (ca.w - cb.w); cb = mix(cb, ca, t); }
  vec2 d = (cb.xy * ca.w - ca.xy * cb.w) * uRes;               // screen direction toward the other end, right even when it is behind the eye
  float dl = length(d); d = dl > 1e-9 ? d / dl : vec2(1., 0.);
  float px = aLine.y * projectionMatrix[1][1] * uRes.y * 0.5 / max(ca.w, 0.05);
  float w = max(px, 1.5);
  float ta = clamp(px / 1.5, 0., 1.);
  vA = max(mix(ta, min(ta * ta * 1.7, 1.), uFade), uMinA) * uMaxA;      // uFade 1 (cotton thread): clear near the eye, fainter with distance faster than its width alone
  vec3 ev = wa.xyz - cameraPosition;                                    // cotton beyond arm's length sinks to a faint tint of the water behind it (uDist: plain to x m, faint from y m; uFarA: what is left)
  vA *= mix(uFarA, 1., 1. - smoothstep(uDist.x, uDist.y, sqrt(dot(ev, ev))));
  float sheetsA = sbrSheets(cameraPosition, wa.xyz);
  vA *= exp2(-0.55 * sheetsA) * mix(1., 0.45 + 0.55 * sbrPool(wa.xyz), uFade);   // a line fades with each sheet it is seen through; cotton is bright only where a shaft of daylight crosses it
  vec2 off = vec2(-d.y, d.x) * aLine.x * w / uRes;
  gl_Position = gone ? vec4(2., 2., 2., 1.) : ca + vec4(off * ca.w, 0., 0.);
  // wire (uPale 1): a dark-edged silhouette where it is seen against the lid's daylight, pale where it is seen against the deep (it catches the lid)
  vec2 hl = cameraPosition.xz + ev.xz * ((uLidY - cameraPosition.y) / max(ev.y, 0.5));
  float onLid = step(0.5, ev.y) * (1. - smoothstep(uLid.z - 6., uLid.z, abs(hl.x - uLid.x))) * (1. - smoothstep(uLid.w - 6., uLid.w, abs(hl.y - uLid.y)));
  vCol = mix(color, uPaleCol, uPale * (1. - onLid)); vA *= mix(1., 0.45, uPale * (1. - onLid)); vSheets = sheetsA;
}`,Ye=`
varying vec3 vCol; varying float vA, vSheets;
SBR_COMMON
void main(){ gl_FragColor = vec4(sbrWater(vCol, vSheets), vA); }`,Ue=`
varying vec3 vWp, vWn; varying vec2 vUv; varying float vSheets, vSeed;
SBR_COMMON
SBR_FISHGLSL
void main(){
  vec3 top, bot, ypr; float band; sbrFish(top, bot, ypr, band);
  float s = aFish2.w;
  vec3 p = vec3(position.x, position.y - 0.2, 0.) * s, n = vec3(0., 0., 1.);
  float c = cos(ypr.y), sn = sin(ypr.y);                        // pitch about z (nose up or down)
  p = vec3(c * p.x - sn * p.y, sn * p.x + c * p.y, p.z);
  c = cos(ypr.z); sn = sin(ypr.z);                              // roll about the fish's length: turns its face up to the lid
  p = vec3(p.x, c * p.y - sn * p.z, sn * p.y + c * p.z); n = vec3(0., -sn, c);
  c = cos(ypr.x); sn = sin(ypr.x);                              // yaw on the thread
  p = vec3(c * p.x + sn * p.z, p.y, -sn * p.x + c * p.z); n = vec3(sn * n.z, n.y, c * n.z);
  vec4 wp = modelMatrix * vec4(bot + p, 1.);
  vWp = wp.xyz; vWn = mat3(modelMatrix) * n; vUv = position.xy; vSeed = aFish2.y;
  vSheets = sbrSheets(cameraPosition, wp.xyz);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,Ke=`
uniform float uFoilGain;
varying vec3 vWp, vWn; varying vec2 vUv; varying float vSheets, vSeed;
SBR_COMMON
void main(){
  float l2 = dot(vWn, vWn);
  vec3 n = l2 > 1e-8 ? vWn * inversesqrt(l2) : vec3(0., 1., 0.);
  vec3 v = cameraPosition - vWp; v = v * inversesqrt(max(dot(v, v), 1e-6));
  vec3 nf = dot(n, v) < 0. ? -n : n;
  vec3 r = reflect(-v, nf);
  float white = smoothstep(0.24, 0.62, abs(n.y));               // faces the lid: white. Otherwise it mirrors cellophane: blue
  vec3 blue = mix(uDeep, uBlue, smoothstep(-0.7, 0.55, r.y)) * (0.86 + 0.28 * vSeed);
  float fw = fwidth(vUv.x);
  // "the foil from blue glints to white": seen through a hung sheet a fish shows the blue it mirrors and only a glint of the lid; it is white in our own bay of the box.
  // And a fish drawn under about ten pixels long is a glint too, never a white scratch
  white *= (1. - 0.82 * clamp(vSheets, 0., 1.)) * (1. - 0.6 * smoothstep(0.1, 0.24, fw));
  vec3 c = mix(blue, vec3(1.0, 0.99, 0.965) * uFoilGain, white);
  float eye = 1. - smoothstep(0.04, 0.041 + fw * 1.5, length(vUv - vec2(0.56, 0.035)));
  c = mix(c, uDeep * 0.6, eye * (1. - smoothstep(0.02, 0.05, fw)) * 0.85);
  gl_FragColor = vec4(sbrWater(c, vSheets), 1.);
}`,je=`
varying vec2 vUv; varying vec3 vWp; varying float vSheets, vCatch;
SBR_COMMON
void main(){
  vUv = uv;
  float hang = 1. - uv.y;                                       // 0 at the top dowel: the ripple starts there and runs down
  float ph = uv.y * 11. + uTime * 1.15 + sin(uv.x * 7. + uTime * 0.31) * 1.3;
  float rip = sin(ph) * 0.6 * sqrt(max(hang, 0.)) + sin(uv.x * 19. - uTime * 0.7 + uv.y * 5.) * 0.18 * hang;
  vec4 wp = modelMatrix * vec4(position + normal * rip, 1.);
  vCatch = cos(ph);                                             // the slope of the ripple: creases catch the lid on one flank and lose it on the other
  vWp = wp.xyz;
  vec3 e = cameraPosition - wp.xyz; float el = max(length(e), 1e-3);
  vSheets = sbrSheets(cameraPosition, wp.xyz + e / el * min(2.5, el * 0.5));     // pulled toward the eye so a sheet never counts itself
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,Qe=`
uniform vec2 uCelloSize; uniform float uCelloGain;
varying vec2 vUv; varying vec3 vWp; varying float vSheets, vCatch;
SBR_COMMON
void main(){
  vec2 m = vUv * uCelloSize;                                    // metres across and up the sheet
  float cr = texture2D(uCrinkle, m * 0.016 + vec2(0.13, 0.41)).r;
  float cr2 = texture2D(uCrinkle, m.yx * 0.041 + vec2(0.7, 0.2)).r;
  float lit = smoothstep(-0.2, 0.9, vCatch + (cr2 - 0.3) * 1.2);
  float crease = clamp(cr * 0.9 + cr2 * 0.45, 0., 1.) * lit;
  vec2 edge = min(m, uCelloSize - m);
  float hem = 1. - smoothstep(0.25, 0.25 + fwidth(edge.x) + fwidth(edge.y) + 0.02, min(edge.x, edge.y));     // the cut border reads as a brighter line
  vec3 c = mix(uBlue * 1.05, vec3(0.86, 0.96, 1.0) * uCelloGain, clamp(crease + hem * 0.5, 0., 1.));
  float a = 0.07 + 0.46 * crease + 0.3 * hem;
  gl_FragColor = vec4(sbrWater(c, vSheets), clamp(a, 0., 0.9));
}`;function $e(a,e=ze){const o=De(me(a,"sbr-crinkle")),s=e&&e.length>=7?e:ze,n={card:te(s[0]),pink:te(s[1]),orange:te(s[2]),yellow:te(s[3]),blue:te(s[4]),deep:te(s[5]),white:te(s[6])};for(const t in Le)n[t]=te(Le[t]);const f=t=>Array.from({length:t},()=>new i.Vector4(0,0,1,0)),u={uTime:{value:0},uSheetA:{value:f(Ce)},uSheetB:{value:Array.from({length:Ce},()=>new i.Vector2)},uSheetN:{value:0},uShA:{value:f(Ee)},uShB:{value:f(Ee)},uCard:{value:n.card},uBlue:{value:n.blue},uDeep:{value:n.deep},uShadowCol:{value:n.shadow},uCrinkleCol:{value:new i.Color(.8,.93,1)},uLid:{value:new i.Vector4(0,0,210,120)},uLidY:{value:190},uCrinkleAmt:{value:.36},uWaterStep:{value:.72},uRain:{value:0},uSlant:{value:new i.Vector2(.21,0)},uCrinkle:{value:o.tex},uPool:{value:f(11).map(t=>t.set(0,0,0,0))},uPoolTint:{value:new i.Vector4(1,1,1,0)},uPoolAmt:{value:new i.Vector3(1,1,0)},uDeepK:{value:new i.Vector3(.33,.37,.49)},uHinge:{value:new i.Vector4(.6,.85,.55,26)},uSpot:{value:new i.Vector3(0,0,0)},uVeil:{value:new i.Vector3(.25,1,1)},uShAnchor:{value:new i.Vector4(0,0,45,0)},uShShift:{value:0},uTurtle:{value:new i.Vector4(.5,1,22,1)},uRes:{value:new i.Vector2(1280,720)},uMinA:{value:.3},uMaxA:{value:1},uFade:{value:0},uPale:{value:0},uPaleCol:{value:new i.Color("#7E8B99")},uDist:{value:new i.Vector2(1e5,2e5)},uFarA:{value:1},uTierAng:{value:[0,0,0,0,0]},uTierDir:{value:[1,-1,1,-1,1]},uTierTilt:{value:Array.from({length:5},()=>new i.Vector3)},uBandAng:{value:0},uGust:{value:0},uFoilGain:{value:1.6}};for(const t of u.uShB.value)t.set(1,0,-1e4,0);const x=t=>Object.assign({},u,t||{}),w={pal:n,uniforms:u,baked:!1,async bake(t){w.baked||(w.baked=!0,await o.bake(t))},paintMaterial(t={}){return new i.ShaderMaterial({uniforms:x(t.uniforms),vertexColors:!0,side:t.side??i.FrontSide,defines:Object.assign(t.vertWater?{SBR_VERT_WATER:1}:{},t.cut?{SBR_CUT:1}:{}),vertexShader:ee(Ge,t.hookDecl||"",t.hook||""),fragmentShader:ee(Ie)})},lineMaterial(t={}){return new i.ShaderMaterial({uniforms:x(t.uniforms),vertexColors:!0,transparent:!0,depthWrite:!1,side:i.DoubleSide,defines:t.fish?{SBR_FISH:1}:{},vertexShader:ee(He),fragmentShader:ee(Ye)})},foilMaterial(){return new i.ShaderMaterial({uniforms:x(),side:i.DoubleSide,vertexShader:ee(Ue),fragmentShader:ee(Ke)})},celloMaterial(t,y){return new i.ShaderMaterial({uniforms:x({uCelloSize:{value:new i.Vector2(t,y)},uCelloGain:{value:1.5}}),transparent:!0,depthWrite:!1,side:i.DoubleSide,vertexShader:ee(je),fragmentShader:ee(Qe)})},celloSheet(t){const y=t.hi-t.lo,h=t.y1-t.y0,l=new i.Mesh(w.celloGeo||(w.celloGeo=new i.PlaneGeometry(1,1,40,24)),w.celloMaterial(y,h));return l.scale.set(y,h,1),l.renderOrder=5,t.axis==="x"?(l.rotation.y=Math.PI/2,l.position.set(t.at,(t.y0+t.y1)/2,(t.lo+t.hi)/2)):l.position.set((t.lo+t.hi)/2,(t.y0+t.y1)/2,t.at),l},setSheets(t){const y=Math.min(t.length,Ce);for(let h=0;h<y;h++){const l=t[h];u.uSheetA.value[h].set(l.at,l.lo,l.hi,l.axis==="x"?1:0),u.uSheetB.value[h].set(l.y0,l.y1)}u.uSheetN.value=y},setShadow(t,y,h,l,d,p,c,v=1){u.uShA.value[t].set(y,h,l,d),u.uShB.value[t].set(Math.cos(p),Math.sin(p),c,v)},setLid(t,y,h,l,d){u.uLid.value.set(t,y,h/2,l/2),u.uLidY.value=d},tick(t){u.uTime.value=t,a.renderer&&a.renderer.getDrawingBufferSize(u.uRes.value)}};return w}function re(){return{pos:[],nrm:[],col:[],pnt:[],idx:[],v(a,e,o,s,n,f,u,x,w,t,y){return this.pos.push(a,e,o),this.nrm.push(s,n,f),this.col.push(u.r,u.g,u.b),this.pnt.push(x,w,t,y),this.pos.length/3-1},tri(a,e,o){this.idx.push(a,e,o)},quad(a,e,o,s){this.idx.push(a,e,o,a,o,s)},build(){const a=new i.BufferGeometry;return a.setAttribute("position",new i.Float32BufferAttribute(this.pos,3)),a.setAttribute("normal",new i.Float32BufferAttribute(this.nrm,3)),a.setAttribute("color",new i.Float32BufferAttribute(this.col,3)),a.setAttribute("aPaint",new i.Float32BufferAttribute(this.pnt,4)),a.setIndex(this.idx),a}}}function Xe(a,e){const o=a.length,s=[];for(let n=0;n<o;n++){const f=a[(n+o-1)%o],u=a[n],x=a[(n+1)%o];let w=u[0]-f[0],t=u[1]-f[1],y=x[0]-u[0],h=x[1]-u[1];const l=Math.hypot(w,t)||1,d=Math.hypot(y,h)||1;w/=l,t/=l,y/=d,h/=d;let p=t+h,c=-(w+y);const v=Math.hypot(p,c)||1;p/=v,c/=v;const b=Math.max(.35,p*t-c*w);s.push([u[0]+p*e/b,u[1]+c*e/b])}return s}function Y(a,e,o,s,n,f,u){const x=a.pos,w=x[e*3],t=x[e*3+1],y=x[e*3+2],h=x[o*3]-w,l=x[o*3+1]-t,d=x[o*3+2]-y,p=x[s*3]-w,c=x[s*3+1]-t,v=x[s*3+2]-y;(l*v-d*c)*n+(d*p-h*v)*f+(h*c-l*p)*u>=0?a.tri(e,o,s):a.tri(e,s,o)}function Pe(a,e={}){const o=e.buf||re(),s=a.length,n=e.thick??.3,f=e.y??0,u=e.rim??.55;let x=0;for(let d=0;d<s;d++){const p=a[d],c=a[(d+1)%s];x+=p[0]*c[1]-c[0]*p[1]}const w=Xe(a,x>0?-u:u),t=i.ShapeUtils.triangulateShape(w.map(d=>new i.Vector2(d[0],d[1])),[]),y=(d,p,c,v,b)=>{const r=Math.cos(b),m=Math.sin(b),M=e.ox??0,S=e.oz??0,g=(A,R)=>o.v(A[0],d,A[1],0,p,0,c,(A[0]+M)*r+(A[1]+S)*m,-(A[0]+M)*m+(A[1]+S)*r,R,v),C=o.pos.length/3;for(let A=0;A<s;A++)g(a[A],0);const F=o.pos.length/3;for(let A=0;A<s;A++)g(w[A],u);for(let A=0;A<s;A++){const R=(A+1)%s;Y(o,C+A,C+R,F+R,0,p,0),Y(o,C+A,F+R,F+A,0,p,0)}for(const A of t)Y(o,F+A[0],F+A[1],F+A[2],0,p,0)};y(f+n/2,1,e.top,e.topKind??0,e.brush??0),y(f-n/2,-1,e.bottom||e.top,e.bottomKind??0,e.brushBottom??e.brush??0);let h=e.ox??0;const l=x>0?1:-1;for(let d=0;d<s;d++){const p=a[d],c=a[(d+1)%s],v=c[0]-p[0],b=c[1]-p[1],r=Math.hypot(v,b)||1e-6,m=l*b/r,M=-l*v/r,S=e.top,g=o.v(p[0],f-n/2,p[1],m,0,M,S,h,0,0,1),C=o.v(c[0],f-n/2,c[1],m,0,M,S,h+r,0,0,1),F=o.v(c[0],f+n/2,c[1],m,0,M,S,h+r,1,0,1),A=o.v(p[0],f+n/2,p[1],m,0,M,S,h,1,0,1);Y(o,g,C,F,m,0,M),Y(o,g,F,A,m,0,M),h+=r}return e.buf?o:o.build()}function we(){return{pos:[],oth:[],lin:[],col:[],idx:[],add(a,e,o,s){const n=this.pos.length/3;this.pos.push(a[0],a[1],a[2],a[0],a[1],a[2],e[0],e[1],e[2],e[0],e[1],e[2]),this.oth.push(e[0],e[1],e[2],e[0],e[1],e[2],a[0],a[1],a[2],a[0],a[1],a[2]),this.lin.push(-1,o,0,1,o,0,-1,o,0,1,o,0);for(let f=0;f<4;f++)this.col.push(s.r,s.g,s.b);this.idx.push(n,n+1,n+2,n,n+2,n+3)},path(a,e,o){for(let s=0;s+1<a.length;s++)this.add(a[s],a[s+1],e,o)},build(){const a=new i.BufferGeometry;return a.setAttribute("position",new i.Float32BufferAttribute(this.pos,3)),a.setAttribute("aOther",new i.Float32BufferAttribute(this.oth,3)),a.setAttribute("aLine",new i.Float32BufferAttribute(this.lin,3)),a.setAttribute("color",new i.Float32BufferAttribute(this.col,3)),a.setIndex(this.idx),a}}}function be(a,e,o,s,n,f,u,x=0){const y=a.pos.length/3,h=n*.42,l=o+f*.16;for(let r=0;r<=3;r++){const m=r/3,M=n*Math.cos(m*Math.PI/2),S=l+f*h*Math.sin(m*Math.PI/2),g=Math.sin(m*Math.PI/2)*.8+.2,C=Math.cos(m*Math.PI/2);for(let F=0;F<10;F++){const A=F/10*Math.PI*2;a.v(e+Math.cos(A)*M,S,s+Math.sin(A)*M,Math.cos(A)*C,f*g,Math.sin(A)*C,u,0,0,1,3)}}for(let r=0;r<3;r++)for(let m=0;m<10;m++){const M=y+r*10+m,S=y+r*10+(m+1)%10,g=M+10,C=S+10;Y(a,M,S,C,0,f,0),Y(a,M,C,g,0,f,0)}const d=Math.cos(x),p=Math.sin(x),c=o-f*.17,v=n*2.1,b=n*.36;for(const r of[-1,1]){const m=[[.1*r,-b],[v*r,-b*.7],[v*r,b*.7],[.1*r,b]].map(([M,S])=>a.v(e+M*d-S*p,c,s+M*p+S*d,0,-f,0,u,0,0,1,3));Y(a,m[0],m[1],m[2],0,-f,0),Y(a,m[0],m[2],m[3],0,-f,0)}}const K=5.5,xe=12.5;function Je(a){const e=(u,x=.14)=>[u[0]+(a()-.5)*x,u[1]+(a()-.5)*x],o=u=>{const x=b=>b.map(r=>e([r[0]*u,r[1]])),w=x([[9,6.3],[16,2.4],[19,.2],[20.2,-1.4],[19.6,-2.25],[17,-2.6],[9,-5.4]]),t=e([K*u,7.6],.1),y=e([K*u,-7],.1),h=e([xe*u,4.6],.1),l=e([xe*u,-4],.1),d=[t,w[0],h,[h[0]+.9*u,h[1]-.9],[l[0]+.9*u,l[1]+.7],l,w[6],y].map(b=>[b[0]-K*u,b[1]]),p=[[h[0]-.95*u,h[1]+.2],h,w[1],w[2],w[3],w[4],w[5],l,[l[0]-.95*u,l[1]-.1]].map(b=>[b[0]-xe*u,b[1]]),c=x([[1.25,9],[1.9,11.7],[2.95,11.45],[3.45,8.5]]),v=x([[3.1,-8.5],[1.3,-10.2],[.55,-11.6]]);return{inner:d,outer:p,head:c,tail:v,tabF:[(K+.95)*u,t[1]-.45],tabA:[(K+.95)*u,y[1]+.35],hf:t,ha:y}},s=o(1),n=o(-1);return{body:[[0,8.55],...s.head,s.hf,s.tabF,s.tabA,s.ha,...s.tail,...n.tail.slice().reverse(),n.ha,n.tabA,n.tabF,n.hf,...n.head.slice().reverse()],R:s,L:n}}function Te(a,e,o,s,n,f,u,x,w=12){const t=a.v(e,o,s,0,f,0,u,e,s,1,x),y=a.pos.length/3;for(let h=0;h<w;h++){const l=h/w*Math.PI*2;a.v(e+Math.cos(l)*n,o,s+Math.sin(l)*n*.86,0,f,0,u,e,s,1,x)}for(let h=0;h<w;h++)Y(a,t,y+h,y+(h+1)%w,0,f,0)}function pe(a,e,o,s,n,f,u){let x=null;for(let w=0;w<e.length;w++){const t=e[Math.max(w-1,0)],y=e[Math.min(w+1,e.length-1)],h=y[0]-t[0],l=y[1]-t[1],d=Math.hypot(h,l)||1,p=-l/d*o/2,c=h/d*o/2,v=e[w],b=[a.v(v[0]-p,s,v[1]-c,0,n,0,f,w,0,1,u),a.v(v[0]+p,s,v[1]+c,0,n,0,f,w,1,1,u)];x&&(Y(a,x[0],x[1],b[1],0,n,0),Y(a,x[0],b[1],b[0],0,n,0)),x=b}}function Ze(a,e){const o=a.pal,s=a.paintMaterial(),n=Je(e),f=.3,u=new i.Group,x=o.grey,w=o.white,t=re();Pe(n.body,{buf:t,thick:f,rim:.4,top:x,bottom:w,brush:Math.PI/2+e.range(-.08,.08),brushBottom:Math.PI/2+e.range(-.1,.1),ox:e()*40,oz:e()*40});for(const r of[-1,1]){const m=r>0?n.R:n.L;be(t,K*r+.1*r,-f,m.hf[1]-1.5,.5,-1,o.brass,e()*3),be(t,K*r+.1*r,-f,m.ha[1]+1.5,.5,-1,o.brass,e()*3),Te(t,3.75*r,f/2+.02,8,.4,1,o.black,4),Te(t,3.95*r,-f/2-.02,7.9,.46,-1,o.black,4)}pe(t,[[-1.9,7.55],[-1,7.2],[0,7.08],[1,7.2],[1.9,7.55]],.46,-f/2-.02,-1,o.black,4);const y=[[0,5.2],[0,-5.6]];for(const r of y)pe(t,[[r[0]-.9,r[1]-.2+e()*.4],[r[0]+.9,r[1]-.2+e()*.4]],1.2,f/2+.03,1,o.tape,4);pe(t,[[-.7,-10.6],[.75,-10.4]],1.2,f/2+.03,1,o.tape,4),pe(t,[[-.7,-10.5],[.75,-10.7]],1.2,-f/2-.03,-1,o.tape,4);const h=new i.Mesh(t.build(),s);u.add(h);const l={},d=[{obj:u,p:new i.Vector3(0,f/2,5.2)},{obj:u,p:new i.Vector3(0,f/2,-5.6)}];for(const r of[-1,1]){const m=r>0?n.R:n.L,M=r>0?"R":"L",S=new i.Group;S.position.set(K*r,-f-.02,0),u.add(S);const g=re();Pe(m.inner,{buf:g,thick:f,rim:.4,top:x,bottom:w,brush:e.range(-.12,.12),brushBottom:e.range(-.15,.15),ox:e()*40,oz:e()*40});const C=(xe-K)*r,F=m.inner[2][1],A=m.inner[5][1];be(g,C+.15*r,.02,F-1.3,.5,-1,o.brass,e()*3),be(g,C+.15*r,.02,A+1.3,.5,-1,o.brass,e()*3),pe(g,[[4.6*r-.9,.6+e()*.3],[4.6*r+.9,.4+e()*.3]],1.2,f/2+.03,1,o.tape,4),S.add(new i.Mesh(g.build(),s));const R=new i.Group;R.position.set(C,f+.02,0),S.add(R),R.add(new i.Mesh(Pe(m.outer,{thick:f,rim:.4,top:x,bottom:w,brush:e.range(-.3,.1)*r,brushBottom:e.range(-.35,.1)*r,ox:e()*40,oz:e()*40}),s)),l[M]={inner:S,outer:R,s:r},d.push({obj:S,p:new i.Vector3(4.6*r,f/2,.6)})}const p=we(),c=-f/2-.035,v=o.pencil;for(const r of[-1,1])for(let m=0;m<5;m++){const M=r*(2.75-.13*m+e.range(-.05,.05)),S=5.3-1.12*m+e.range(-.07,.07),g=1-.07*m,C=[];for(let F=0;F<=5;F++){const A=F/5-.5;C.push([M+r*A*2*g,c,S-.55*A-1.1*A*A+.25])}p.path(C,.085,v)}p.path([[.12,c,6.6],[.02,c,.5],[-.1,c,-9.6]],.06,v);for(const r of[-1,1])p.path([[(K-.55)*r,c,6.9],[(K-.5)*r,c,-6.4]],.06,v);const b=new i.Mesh(p.build(),a.lineMaterial());return b.renderOrder=2,u.add(b),{group:u,piv:l,threads:d,tail:new i.Vector3(0,0,-10.9)}}function de(a,e,o,s,n,f,u,x=!0,w=s){const t=new i.Vector3(o[0]-e[0],o[1]-e[1],o[2]-e[2]),y=t.length()||1e-6;t.divideScalar(y);const h=new i.Vector3(0,1,0);Math.abs(t.y)>.9&&h.set(1,0,0);const l=new i.Vector3().crossVectors(t,h).normalize(),d=new i.Vector3().crossVectors(t,l),p=a.pos.length/3;for(let c=0;c<2;c++)for(let v=0;v<=n;v++){const b=v/n*Math.PI*2,r=Math.cos(b)*l.x+Math.sin(b)*d.x,m=Math.cos(b)*l.y+Math.sin(b)*d.y,M=Math.cos(b)*l.z+Math.sin(b)*d.z,S=c?o:e,g=c?w:s;a.v(S[0]+r*g,S[1]+m*g,S[2]+M*g,r,m,M,f,c*y,v/n*s*6.28,1,u)}for(let c=0;c<n;c++){const v=p+c,b=v+1,r=v+n+1,m=r+1;a.tri(v,r,b),a.tri(b,r,m)}if(x)for(let c=0;c<2;c++){const v=c?o:e,b=c?1:-1,r=c?w:s,m=a.v(v[0],v[1],v[2],t.x*b,t.y*b,t.z*b,f,0,0,1,u),M=a.pos.length/3;for(let S=0;S<n;S++){const g=S/n*Math.PI*2;a.v(v[0]+(Math.cos(g)*l.x+Math.sin(g)*d.x)*r,v[1]+(Math.cos(g)*l.y+Math.sin(g)*d.y)*r,v[2]+(Math.cos(g)*l.z+Math.sin(g)*d.z)*r,t.x*b,t.y*b,t.z*b,f,Math.cos(g)*r,Math.sin(g)*r,1,u)}for(let S=0;S<n;S++)Y(a,m,M+S,M+(S+1)%n,t.x*b,t.y*b,t.z*b)}}const et="uniform float uTailAmp;",tt=`
  { float t = aPaint.x; float k = t * uTailAmp;
    pos.x += sin(uTime * 0.9 - t * 0.31) * k * 0.085 + sin(uTime * 0.37 + t * 0.11) * k * 0.05;
    pos.y += -t * t * 0.0035 + sin(uTime * 1.25 - t * 0.42) * k * 0.028; }`;function at(a,e,o,s){const n=re(),f=a.pal,u=28,x=Math.round(100*s),w=6,t=e.shuffle([f.white,f.grey,e.pick([f.pink,f.pink,f.orange,f.yellow])]);for(let l=0;l<3;l++){const d=n.pos.length/3,p=l/3*Math.PI*2;for(let c=0;c<=x;c++){const v=c/x*u,b=Math.max(0,(v-25.4)/2.6),r=v*2.1,m=.2+b*.8,M=o.x+Math.sin(r+p)*m+b*Math.sin(p*2.3+1)*.5,S=o.y+Math.sin(2*r+2*p)*.1*(1+b*2),g=o.z-v,C=.145*(1-.35*b)*(c===0?.6:1);for(let F=0;F<w;F++){const A=F/w*Math.PI*2+c*.5;n.v(M+Math.cos(A)*C,S+Math.sin(A)*C,g,Math.cos(A),Math.sin(A),0,t[l],v,F,1,5)}}for(let c=0;c<x;c++)for(let v=0;v<w;v++){const b=d+c*w+v,r=d+c*w+(v+1)%w,m=b+w,M=r+w;n.tri(b,r,m),n.tri(r,M,m)}}const y={value:1},h=new i.Mesh(n.build(),a.paintMaterial({hook:tt,hookDecl:et,uniforms:{uTailAmp:y},side:i.DoubleSide,vertWater:!0}));return h.frustumCulled=!1,{mesh:h,uTailAmp:y}}function ge(a,e,o,s,n,f,u){const x=Math.cos(o),w=Math.sin(o),t=s/10,y=s*.21+t*1.1,h=(c,v)=>[e[0]+x*c,e[1]+v,e[2]+w*c],l=1+(u()-.5)*.25,d=[h(-.12*t,-1.5*t),h(-s/2,-y*l),h(-s/2-.25*t,-y*l-.3*t),h(-s/2+.3*t,-y-.55*t),h(s/2-.3*t,-y-.55*t),h(s/2+.25*t,-y/l-.3*t),h(s/2,-y/l),h(.12*t,-1.5*t),h(-.1*t,-1.25*t),h(.08*t,-1.05*t),h(0,-.85*t)];for(let c=0;c<=7;c++){const v=-Math.PI/2+c/7*Math.PI*1.72,b=.42*t;d.push(h(Math.cos(v)*b,-.43*t+Math.sin(v)*b))}a.path(d,n,f);const p=-y-.55*t;return{l:h(-s/2+.3*t,p),r:h(s/2-.3*t,p),m:h(0,p),y:e[1]+p,cx:x,sx:w}}const ve=[{r:17,hubR:2,hubY:74,tipY:67,arms:5,yokeW:8.5,subW:6.6,count:260,bands:[[47,59,1]],speed:.115},{r:37,hubR:9.5,hubY:154,tipY:112,arms:11,yokeW:13,subW:10.5,count:800,bands:[[79.5,90,1]],speed:.085,eye:{r:43.6,tipY:110,arms:9,yokeW:14,band:[78,81],every:5}},{r:50,hubR:9.5,hubY:160,tipY:141,arms:10,yokeW:15,subW:12,count:240,bands:[[83,102,1]],speed:.075},{r:57.5,hubR:9.5,hubY:166,tipY:148,arms:12,yokeW:15,subW:12.5,count:350,bands:[[86,122,1]],speed:.07,eye:{arms:0,band:[78,81],every:4}},{r:65.5,hubR:9.5,hubY:172,tipY:155,arms:13,yokeW:15.5,subW:12.5,count:350,bands:[[94,130,1]],speed:.064,eye:{arms:0,band:[78,81],every:4}}];function ot(){const a=[[.81,0],[.56,.125],[.2,.2],[.02,.2],[-.1,.3],[-.24,.17],[-.6,.05],[-.82,.21],[-.71,0],[-.82,-.2],[-.6,-.05],[-.3,-.135],[.15,-.19],[.56,-.13]],e=i.ShapeUtils.triangulateShape(a.map(n=>new i.Vector2(n[0],n[1])),[]),o=new i.InstancedBufferGeometry,s=[];for(const n of a)s.push(n[0],n[1],0);return o.setAttribute("position",new i.Float32BufferAttribute(s,3)),o.setIndex(e.flat()),o}async function st(a,e,o,s,n,f){const u=e.pal,x=[],w=[],t=[],y=e.lineMaterial({uniforms:{uMinA:{value:.3},uMaxA:{value:1}}}),h=u.wire,l=u.white;for(let S=0;S<Fe;S++){const g=ve[S],C=we(),F=[],A=o()*6.283,R=S?.17:.1,he=[];for(let P=0;P<=24;P++){const q=P/24*Math.PI*2;he.push([Math.cos(q)*g.hubR,g.hubY+Math.sin(q*3+S)*.12,Math.sin(q)*g.hubR])}C.path(he,R*1.3,h);for(let P=0;P<g.arms;P++){const q=A+(P+o.range(-.12,.12))/g.arms*Math.PI*2,T=Math.cos(q),B=Math.sin(q),G=[],_=g.r+o.range(-1.2,1.2),O=g.tipY+o.range(-1.5,1.5),N=o.range(.8,2.2);for(let I=0;I<=5;I++){const D=I/5,Q=g.hubR+(_-g.hubR)*D,oe=g.hubY+(O-g.hubY)*D-Math.sin(D*Math.PI)*N;G.push([T*Q,oe,B*Q])}G.push([T*(_+.5),O+.55,B*(_+.5)],[T*(_+.1),O+.9,B*(_+.1)]),C.path(G,R+.03,h);const U=q+Math.PI/2+o.range(-.28,.28),W=ge(C,[T*_,O+.1,B*_],U,g.yokeW*o.range(.86,1.1),R,h,o);for(const I of[W.l,W.r])F.push(ge(C,[I[0],I[1]+.05,I[2]],U+o.range(-1,1),g.subW*o.range(.8,1.15),R*.9,h,o));if(S===0)continue;const j=o.range(2.2,4.6);C.add(W.m,[W.m[0],W.m[1]-j,W.m[2]],.05,l),F.push(ge(C,[W.m[0],W.m[1]-j,W.m[2]],U+Math.PI/2+o.range(-.5,.5),g.subW*o.range(.75,1),R*.9,h,o))}const se=[];if(g.eye&&n&&g.eye.arms){const P=g.eye,q=n()*6.283;for(let T=0;T<P.arms;T++){const B=q+(T+n.range(-.1,.1))/P.arms*Math.PI*2,G=Math.cos(B),_=Math.sin(B),O=[],N=P.tipY+n.range(-.8,.8),U=n.range(.8,1.8);for(let W=0;W<=5;W++){const j=W/5,I=g.hubR+(P.r-g.hubR)*j;O.push([G*I,g.hubY+(N-g.hubY)*j-Math.sin(j*Math.PI)*U,_*I])}O.push([G*(P.r+.5),N+.55,_*(P.r+.5)],[G*(P.r+.1),N+.9,_*(P.r+.1)]),C.path(O,R+.03,h),se.push(ge(C,[G*P.r,N+.1,_*P.r],B+Math.PI/2+n.range(-.06,.06),P.yokeW*n.range(.92,1.08),R,h,n))}}for(let P=0;P<g.count;P++){const q=!!(g.eye&&n)&&P%g.eye.every===0,T=q?n:o,B=q&&se.length?se[(P/g.eye.every|0)%se.length]:F[P%F.length],G=.5+T.range(-.5,.5),_=B.l[0]+(B.r[0]-B.l[0])*G,O=B.l[2]+(B.r[2]-B.l[2])*G,N=g.bands[0],U=T(),W=q?Math.max(g.eye.band[0],f?f(Math.hypot(_,O))+1:0):0,j=q?W+(g.eye.band[1]-g.eye.band[0])*U:N[0]+(N[1]-N[0])*U,I=T();w.push(Math.hypot(_,O),Math.atan2(O,_),B.y,Math.max(2,B.y-j)),t.push(S,I,T.range(-.13,.13),T.range(.86,1.18))}const ae=new i.Mesh(C.build(),y);ae.frustumCulled=!1,ae.renderOrder=3,ae.position.y=-g.hubY;const $=new i.Group;$.position.y=g.hubY,$.add(ae),x.push({mesh:ae,nod:$,ph:o()*6.283,amp:(S?.008:.02)*o.range(.8,1.2),dir:(S%2?1:-1)*s,speed:g.speed*o.range(.92,1.08)}),await a("tier"+S)}const d=w.length/4,p=new i.InstancedBufferAttribute(new Float32Array(w),4),c=new i.InstancedBufferAttribute(new Float32Array(t),4),v=ot();v.setAttribute("aFish",p),v.setAttribute("aFish2",c),v.instanceCount=d;const b=new i.Mesh(v,e.foilMaterial());b.frustumCulled=!1;const r=new i.InstancedBufferGeometry;r.setAttribute("position",new i.Float32BufferAttribute([0,0,0,0,0,0,0,1,0,0,1,0],3)),r.setAttribute("aLine",new i.Float32BufferAttribute([-1,.024,0,1,.024,0,-1,.024,0,1,.024,0],3)),r.setAttribute("aOther",new i.Float32BufferAttribute(new Float32Array(12),3));const m=u.white;r.setAttribute("color",new i.Float32BufferAttribute([m.r,m.g,m.b,m.r,m.g,m.b,m.r,m.g,m.b,m.r,m.g,m.b],3)),r.setIndex([0,1,2,0,2,3]),r.setAttribute("aFish",p),r.setAttribute("aFish2",c),r.instanceCount=d;const M=new i.Mesh(r,e.lineMaterial({fish:!0,uniforms:{uMinA:{value:.02},uMaxA:{value:.5},uFade:{value:1},uDist:{value:new i.Vector2(11,26)},uFarA:{value:.07}}}));return M.frustumCulled=!1,M.renderOrder=4,{tiers:x,shoal:b,threads:M,count:d,wire:y}}const le=82.3,V=184,Re=190,it=7,Ve=new i.Vector3(0,1,0);async function nt(a,e={}){const o=me(a,"sbr-manta"),s=e.style||$e(a,e.palette||ze),n=s.pal,f=e.bandPhase??0,u=e.beatPhase??0,x=e.spin===-1?-1:1,w=e.stage!==!1,t=Math.min(1,Math.max(.6,e.detail??a.quality?.detail??1)),y=typeof e.view=="string"?e.view:null,h=new i.Group;h.name="shoebox-reef-hero";const l=async()=>{await a.yield()};await l("style"),await s.bake(()=>l("bake")),await l("baked");const d=Ze(s,o);d.group.position.y=le,h.add(d.group),await l("manta"),await l("tail");const p=at(s,o,d.tail,t);d.group.add(p.mesh),await l("rig");const c=re(),v=o.range(-.14,.14),b=Math.cos(v),r=Math.sin(v),m=13.2;de(c,[-m,V,0],[m+o.range(-.8,.8),V,0],.42,10,n.dowel,2),de(c,[-r*m,V+.84,-b*m],[r*m,V+.84,b*(m+o.range(-.8,.8))],.42,10,n.dowel,2),de(c,[-.75,V,.02],[.75,V,-.02],.5,10,n.tape,4,!1),de(c,[.03,V+.84,-.7],[-.03,V+.84,.7],.5,10,n.tape,4,!1);const M=we(),S=[[9.5,V,0],[-9.5,V,0],[r*9.5,V+.84,b*9.5],[-r*9.5,V+.84,-b*9.5]];for(const k of S){M.add(k,[k[0],ve[1].hubY,k[2]],.05,n.white);const z=Math.abs(k[0])>5?[.6,0,0]:[0,0,.6];de(c,[k[0]-z[0],k[1],k[2]-z[2]],[k[0]+z[0],k[1],k[2]+z[2]],.47,8,n.tape,4,!1)}for(const k of[-5.5,6.2])M.add([k,V+.4,0],[k+o.range(-.3,.3),Re,0],.06,n.white);M.add([0,le-.2,0],[0,ve[0].hubY,0],.05,n.white);for(let k=0;k<3;k++){const z=k*2.094+.4;M.add([0,ve[0].hubY+2.6,0],[Math.cos(z)*2,ve[0].hubY,Math.sin(z)*2],.05,n.white)}const g=s.paintMaterial(),C=s.lineMaterial(),F=new i.Mesh(c.build(),g);h.add(F);const A=new i.Mesh(M.build(),C);A.renderOrder=3,A.frustumCulled=!1,h.add(A);const R=[[.25,V+.84,4.3],[-.2,V+.84,-4.7],[-7.4,V,.3],[7.4,V,.3]],he=we();he.add([0,0,0],[0,1,0],.07,n.white);const se=he.build(),ae=R.map(k=>{const z=new i.Mesh(se,C);return z.position.set(k[0],k[1],k[2]),z.frustumCulled=!1,z.renderOrder=3,h.add(z),z});await l("shoal");const $=await st(l,s,me(a,"sbr-shoal"),x,me(a,"sbr-low"),typeof e.overSight=="function"?e.overSight:null);for(const k of $.tiers)h.add(k.nod);if(h.add($.shoal,$.threads),await l("x1"),w){const k=re();Te(k,0,0,0,125,1,n.deep,4,48);const z=new i.Mesh(k.build(),g);z.scale.z=1/.86,h.add(z)}if(y&&y.includes("steps")){const k=[{axis:"x",at:8,lo:-110,hi:110,y0:0,y1:118},{axis:"z",at:-6,lo:-110,hi:2,y0:0,y1:190},{axis:"z",at:30,lo:-60,hi:110,y0:40,y1:190}];s.setSheets(k);for(const z of k)h.add(s.celloSheet(z))}y&&y.includes("sheets")&&s.setSheets([{axis:"z",at:-34,lo:-150,hi:21,y0:0,y1:190},{axis:"z",at:-34,lo:39,hi:150,y0:0,y1:190},{axis:"z",at:32,lo:-150,hi:19,y0:0,y1:190},{axis:"z",at:50,lo:-150,hi:20,y0:0,y1:190},{axis:"x",at:-75,lo:-110,hi:95,y0:0,y1:190}]);const P=[[36,66,-70],[36,66,-34]];for(let k=0;k<=12;k++){const z=k/12*Math.PI*2*x;P.push([36*Math.cos(z),66+8*(k/12),36*Math.sin(z)*x*x])}P.push([36,74,40],[36,74,95]);const q={axis:new i.Vector3(0,0,0),mantaCentre:new i.Vector3(0,le,0),bellyY:82,crossY:V,lidY:Re,orbit:{radius:36,yStart:66,yEnd:74,innerClear:22.5,outerClear:44,fishFreeY:[60,79]},flyThrough:P.map(k=>new i.Vector3(k[0],k[1],k[2])),portalSeat:{position:new i.Vector3(36,74,95),facing:new i.Vector3(0,0,-1),radius:7},viewpoints:{entry:{position:new i.Vector3(4,58,-140),target:new i.Vector3(0,80,0)},belly:{position:new i.Vector3(0,67,36),target:new i.Vector3(0,le,0)},image:{position:new i.Vector3(19,73.6,-30.5),target:new i.Vector3(6,77,50)}},wireArm:{pivot:new i.Vector3(0,152,0),reach:36},shadowSlots:[0,1,2,3,4]};let T=0,B=0,G=null,_=0,O=0,N=0;const U=new i.Quaternion,W=new i.Quaternion,j=new i.Vector3,I=new i.Matrix4,D=new i.Vector3,Q=new i.Vector3,oe=s.uniforms,We=(k,z)=>z.applyMatrix4(k.matrixWorld).applyMatrix4(I),ye=new i.Vector3,ce=(k,z,X,ie,J,ue,ke)=>{D.set(X,0,ie).applyMatrix4(z.matrixWorld),Q.set(X+(J?1:0),0,ie+(J?0:1)).applyMatrix4(z.matrixWorld).sub(D);const H=Math.hypot(Q.x,Q.z),Z=ue*Math.max(H*Math.sqrt(H),.06);if(J&&H>1e-4){const L=X<0?-1:1;ye.set(X-L*ue,0,ie).applyMatrix4(z.matrixWorld),D.x=ye.x+L*Q.x/H*Z,D.z=ye.z+L*Q.z/H*Z}s.setShadow(k,D.x,D.z,Z,ke,H>1e-4?Math.atan2(Q.z,Q.x):0,D.y,1)};function Be(k,z){s.tick(z);const X=G===null?0:Math.min(Math.max(z-G,0),.1);G=z,B+=X*T*2.5;const ie=z/it*Math.PI*2+u,J=ie+.3*Math.sin(ie),ue=.5*Math.sin(J)+.03,ke=1*Math.sin(J-.7);for(const L of["L","R"]){const E=d.piv[L];E.inner.rotation.z=E.s*ue,E.outer.rotation.z=E.s*(ke-ue)}const H=d.group;H.position.y=le-.9*Math.sin(J+.2),H.position.x=.5*Math.sin(z*.29),H.position.z=.6*Math.sin(z*.21+1),H.rotation.set(.035*Math.sin(J+1.2),.05*Math.sin(z*.23),.02*Math.sin(z*.31+1));const Z=Math.hypot(O,N);U.identity(),Z>1e-5&&U.setFromAxisAngle(j.set(-N/Z,0,O/Z),Z),H.quaternion.premultiply(U.multiply(W.setFromAxisAngle(Ve,_)));for(let L=0;L<Fe;L++){const E=$.tiers[L],ne=E.dir*E.speed*(z+B);oe.uTierAng.value[L]=ne,oe.uTierDir.value[L]=E.dir,E.mesh.rotation.y=-ne;const fe=E.amp*Math.sin(z*(.47+.05*L)+E.ph)*(1+2*T),_e=E.amp*Math.sin(z*(.39+.04*L)+E.ph*1.7)*(1+2*T);E.nod.rotation.z=fe,E.nod.rotation.x=-_e,oe.uTierTilt.value[L].set(fe,_e,0)}oe.uBandAng.value=x*(z*(Math.PI*2/8)+f),oe.uGust.value=T,p.uTailAmp.value=1+T*1.5,h.updateMatrixWorld(!0),I.copy(h.matrixWorld).invert();for(let L=0;L<4;L++){const E=d.threads[L],ne=ae[L];D.copy(E.p),We(E.obj,D).sub(ne.position);const fe=Math.max(D.length(),.001);ne.scale.set(1,fe,1),ne.quaternion.setFromUnitVectors(Ve,D.divideScalar(fe))}ce(0,H,0,-1,!1,10.4,5.45),ce(1,d.piv.R.inner,3.5,.3,!0,3.5,7.3),ce(2,d.piv.R.outer,3.75,.3,!0,3.75,3.6),ce(3,d.piv.L.inner,-3.5,.3,!0,3.5,7.3),ce(4,d.piv.L.outer,-3.75,.3,!0,3.75,3.6)}Be(0,0);let Se=72,Me=Re,Ae=new i.Vector3(0,le,0);return y&&y.includes("in")?(Se=14,Me=-40,Ae=new i.Vector3(0,74,0)):y&&y.includes("low")&&(Se=42,Me=-70,Ae=new i.Vector3(0,82,0)),{object:h,radius:Se,height:Me,center:Ae,anchors:q,style:s,update:Be,dispose(){},ground:!1,groundY:0,setGust(k){T=Math.min(Math.max(k,0),1)},setPose(k,z,X){_=k,O=z,N=X},tierCount:Fe,sardines:$.count}}export{Le as SBR_EXTRA,Ee as SBR_MAX_SHADOWS,Ce as SBR_MAX_SHEETS,ze as SBR_PALETTE,Fe as SBR_TIERS,ve as SBR_TIER_DEFS,Oe as STYLE_FRAG_GLSL,qe as STYLE_GLSL,de as addCylinder,be as addFastener,nt as buildHero,Pe as cardGeometry,$e as createStyle,re as paintBuffers,we as ribbonBuffers};
