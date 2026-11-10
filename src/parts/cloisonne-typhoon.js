import*as e from"three";import{clamp as nt,lerp as Ie,smoothstep as de}from"../kit/core.js";const Xe=["#17A3A8","#1C3F94","#8C1D18","#F4EFE0","#E9B949","#0C1A3A","#C4502F"],Ze=1500,Ge=450,it={none:0,ruyi:1,scales:2,filler:3,brick:4,tile:5,net:6,volute:7,bands:8,eye:9,contour:10,line:11},tt=[.066,.33,.585,.78,.9,.155],Qe=46,lt=`
float h11(float n){ return fract(sin(n * 127.1) * 43758.5453); }
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y);
}
float satan(float y, float x){ return atan(y, abs(x) < 1e-5 ? 1e-5 : x); }

vec3 gCol;        // cell colour chosen by the pattern (used when gUse > 0.5)
float gUse;       // 1: gCol replaces the vertex colour, 0: gCol multiplies it
float gOut;       // distance to the nearest outline wire (never faded)
float gIn;        // distance to the nearest inner wire (faded when finer than a few pixels)
float gPeriod;    // spacing of the inner wires, for the footprint fade
float gFill;      // wire brightness (1 outline, 0.4 filler)
float gCid;       // cell id 0..1
float gAlpha;     // 0 = cut away
vec2 gCell;       // cell centre in pattern space
vec3 gAvg;        // average colour of the motif (x < 0: none), used when its bands get finer than a pixel
float gSize;      // size of the outlined motif, for fading outlines that get too small

// one ruyi head, q in head units (about -1..1). Returns the outline sdf (negative inside).
float ruyiSdf(vec2 q, float tail){
  vec2 a = vec2(abs(q.x), q.y);
  float d = length(q - vec2(0., .40)) - .52;
  d = min(d, length(a - vec2(.52, -.02)) - .43);
  d = min(d, length(q - vec2(0., -.50)) - .66);
  d = min(d, length(q - vec2(0., -1.05)) - .50 + (1. - tail) * 2.);
  return d;
}
// interior of a head: nested lines, then a volute in each side lobe. Sets gIn (head units) and a band index.
float ruyiInner(vec2 q, float d, float spin){
  float g = .105, dep = -d;
  float band = min(floor(dep / g), 3.);
  float w = dep < 3.5 * g ? abs(fract(dep / g + .5) - .5) * g : dep - 3. * g;
  if (dep < .5 * g) w = g - dep;                       // the outline itself is handled by gOut
  vec2 v = vec2(abs(q.x), q.y) - vec2(.52, -.02);
  float rr = length(v), rc = .43 - 2. * g;
  if (rr < rc) {
    float pitch = .105;
    float sp = rr / pitch + satan(v.y, v.x) / 6.2831853 + spin;
    w = min(rc - rr, abs(fract(sp) - .5) * pitch);
    band = 4. + mod(floor(sp + .5), 2.);
    gPeriod = pitch;
  } else gPeriod = g;
  gIn = w;
  return band;
}
vec3 stormBand(float band, float tone, float hs){
  // tone 1 = crest (white), 0 = underside (navy); stepped, never a gradient
  vec3 c;
  float st = floor(clamp(1. - tone + (hs - .5) * .5, 0., .999) * 4.) / 4.;
  if (band < .5) c = uWhite;
  else if (band < 1.5) c = st < .2 ? uWhite * .9 : uCeladon;
  else if (band < 2.5) c = mix(uTurq, uCeladon, st < .2 ? .75 : .4);
  else if (band < 3.5) c = uTurq;
  else if (band < 4.5) c = uWhite;
  else c = mix(uCeladon, uTurq, .45);
  if (st > .7) c = mix(uNavy, uLapis, band < .5 ? .85 : (band > 3.5 ? .6 : .3));
  else if (st > .45) c = mix(c, uLapis, band < .5 ? .3 : .8);
  else if (st > .2) c = mix(c, mix(uTurq, uLapis, .3), band < .5 ? .0 : (band > 3.5 ? .25 : .45));
  return c;
}
// (1) the storm wall: overlapping ruyi heads banked like scales; heads above the crest line or below
// the base line do not exist, so the silhouette is real trefoil heads. vLay = (headSize, crest, base, layer).
void patRuyi(vec2 p, vec4 lay){
  // the layer index arrives as an interpolated constant: round it, or the hashes flicker per pixel
  // (flat sheets carry a fractional index below -1: snapped to tenths for the same reason)
  float lw = lay.w < -1. ? floor(lay.w * 10. + .5) * .1 : floor(lay.w + .5);
  float S = lay.x, cw = S * 1.46, rh = S * .60;
  float jr = floor(p.y / rh);
  float minOut = 1e4; gAlpha = 0.; gOut = 1e4; gIn = 1e4; gPeriod = 1e4; gUse = 1.;
  bool found = false;
  for (int jj = -1; jj <= 3; jj++) {
    float j = jr + float(jj);
    float off = mod(j, 2.) * .5 + lw * .31;
    float i0 = floor(p.x / cw - off);
    for (int ii = -1; ii <= 1; ii++) {
      if (found) continue;
      float i = i0 + float(ii);
      vec2 id = vec2(i, j + lw * 57.);
      float hs = h21(id + uSeed);
      vec2 c = vec2((i + off + .5 + (hs - .5) * .16) * cw, (j + (h21(id + 7.3) - .5) * .3) * rh);
      float crest = lay.y * (.70 + .17 * sin(c.x * .0041 + lw * 1.9 + uSeed * 6.) + .13 * sin(c.x * .0113 + lw * 4.3 + uSeed * 11.));
      float sT = c.x - uDrift * (1. + lw * .4);
      crest *= (1. - .78 * smoothstep(700., 1500., sT)) * smoothstep(-1570., -1400., sT) * (1. - smoothstep(1330., 1540., sT));
      // a base line far up the sheet (the arm's underside while it is still growing) keeps a ragged edge of constant depth
      float hb = h11(i * .37 + lw + floor(uSeed * 50.));
      float base = lay.z > 200. ? lay.z + (hb - .5) * 100. : lay.z * (.75 + .5 * hb);
      if (c.y > crest || c.y < base || crest < 30.) continue;
      float sz = S * (.92 + .16 * h21(id + 3.1));
      vec2 q = (p - c) / sz;
      float d = ruyiSdf(q, 0.);
      if (d < 0.) {
        found = true;
        float spin = hs * 7. + uTime * (.035 + .03 * hs) * uRoll;
        float band = ruyiInner(q, d, spin);
        gIn *= sz; gPeriod *= sz; gOut = min(minOut, -d * sz);
        float tone = clamp((c.y - base) / max(crest - base, 1.), 0., 1.);
        vec2 hd = (c - vec2(uDrift * (1. + lw * .4), ${Ge}.0)) * vec2(.52, 1.);
        if (lw >= 0.) tone *= .25 + .75 * smoothstep(150., 520., length(hd) + (hs - .5) * 160.);
        gCol = stormBand(band, tone, hs);
        gCid = hs; gCell = c; gAlpha = 1.;
        gAvg = stormBand(1., tone, hs); gSize = sz;
      } else minOut = min(minOut, d * sz);
    }
  }
}
// (7) one free head filling uv -1..1 (the instanced scroll heads); vAux.x = spin, vAux.y = tone, vAux.z = id
void patVolute(vec2 q, vec3 aux){
  float d = ruyiSdf(q, 1.);
  float S = max(vScl.x, 1e-3);
  gUse = 1.; gCid = aux.z; gCell = vec2(0.);
  if (d > 0.) { gAlpha = 0.; return; }
  float band = ruyiInner(q, d, aux.x);
  gIn *= S; gPeriod *= S; gOut = -d * S;
  gCol = stormBand(band, aux.y, aux.z);
  gAvg = stormBand(1., aux.y, aux.z); gSize = S;
}
// (8) the spiral arm: p.x runs along the arm (metres), p.y across (-1..1). Nested bands with gold wires.
void patBands(vec2 p, vec3 aux){
  float a = abs(p.y), hw = max(aux.x, 1.);           // half width in metres
  float n = 3.;
  float e = (1. - a) * n;                             // 0 at the edge, n at the spine
  float band = min(floor(e), n - 1.);
  gOut = min(1. - a, abs(a - (1. - 1. / n))) * hw;
  gIn = abs(a - (1. - 2. / n)) * hw;
  // comma-shaped scallops along the spine band
  float L = hw * 1.3, k = p.x, kf = fract(k) - .5;
  if (band > 1.5) { float r = length(vec2(kf * L, (p.y) * hw + hw * .34 * sign(p.y + 1e-4))); gIn = min(gIn, abs(r - hw * .30)); }
  gPeriod = hw / n; gUse = 1.; gCid = h11(floor(k) + band * 3.); gCell = vec2((floor(k) + .5) * L, 0.);
  gCol = band < .5 ? uWhite : (band < 1.5 ? uCeladon : mix(uLapis, uNavy, step(.5, gCid) * .6));
  if (aux.y < .5) gCol = mix(gCol, uLapis, band < .5 ? .2 : .55);
  gAvg = mix(uCeladon, uLapis, .3); gSize = hw;
}
// (9) the hub: navy eye, concentric lapis rings and a three-armed wire spiral that turns
void patEye(vec2 q){
  float r = length(q), th = satan(q.y, q.x);
  gUse = 1.; gCell = vec2(0.);
  if (r > 1.) { gAlpha = 0.; return; }
  float rings = abs(fract(r * 3. + .5) - .5) / 3.;
  float sp = r * 1.6 - th * 3. / 6.2831853 + uTime * .05;
  float sw = abs(fract(sp) - .5) / 1.6 * (.3 + r);
  gOut = min(1. - r, rings) * uPatScale; gIn = (r > .34 ? sw : rings) * uPatScale; gPeriod = uPatScale * .3;
  float band = floor(r * 3.), par = mod(floor(sp + .5), 2.);
  gCid = h11(band + par * 5.);
  gCol = band < .5 ? mix(uNavy, uLapis, .15) : mix(uNavy, uLapis, .3 + par * (.3 + .2 * band));
  if (band > 1.5) gCol = mix(gCol, uCeladon, par * .6);
  gSize = uPatScale;
}
// (2) scale-arcs (seigaiha) for the sea: concentric arcs in overlapping fans, radius uPatScale
void patScales(vec2 p, float R){
  float rh = R * .5, jr = floor(p.y / rh), minOut = 1e4, n = 4.;
  bool found = false; gOut = 1e4; gIn = 1e4; gPeriod = R / n; gUse = 0.; gCol = vec3(1.); gSize = R;
  for (int jj = -2; jj <= 2; jj++) {
    if (found) continue;
    float j = jr + float(jj);
    float off = mod(j, 2.) * R;
    vec2 c = vec2(floor((p.x - off) / (2. * R) + .5) * 2. * R + off, j * rh);
    float r = length(p - c);
    if (r < R) {
      found = true;
      float band = floor(r / R * n);
      gIn = abs(fract(r / R * n + .5) - .5) * R / n; gOut = min(minOut, R - r);
      gCid = h21(c * .13 + 1.7); gCell = c;
      gCol = band > 2.5 ? vec3(1.) : (band > 1.5 ? vec3(.80, .86, .90) : (band > .5 ? vec3(.62, .72, .86) : vec3(.86, .93, .95)));
      if (band > 2.5 && gCid > 1. - uCrestFoam) { gUse = 1.; gCol = uWhite; }
    } else minOut = min(minOut, r - R);
  }
}
// (3) filler: one small C-scroll per cell, drawn at 40 percent
void patFiller(vec2 p){
  float G = uPatScale; vec2 id = floor(p / G), f = fract(p / G) - .5;
  float hs = h21(id + 2.2); f -= (vec2(hs, h21(id + 9.1)) - .5) * .18;
  float r = length(f), pitch = .13, hand = hs > .5 ? 1. : -1.;
  float sp = r / pitch + hand * satan(f.y, f.x) / 6.2831853 + hs * 5.;
  gOut = 1e4; gIn = (r < .40 ? abs(fract(sp) - .5) * pitch : r - .40 + pitch * .5) * G;
  gPeriod = pitch * G; gFill = .4; gUse = 0.; gCol = vec3(1.); gCid = hs; gCell = (id + .5) * G;
}
// (4) brick: running bond, uPatScale = brick length
void patBrick(vec2 p){
  float L = uPatScale, H = L * .32, row = floor(p.y / H);
  float x = p.x + mod(row, 2.) * L * .5, col = floor(x / L);
  vec2 f = vec2(x - col * L, p.y - row * H);
  gOut = 1e4; gIn = min(min(f.x, L - f.x), min(f.y, H - f.y)); gPeriod = H; gFill = .7; gUse = 0.;
  gCid = h21(vec2(col, row)); gCell = vec2((col + .5) * L, (row + .5) * H);
  gCol = vec3(.82 + .3 * gCid, .84 + .22 * h11(gCid * 9.), .9 + .15 * gCid);
}
// (5) round roof tile: columns with scalloped ends, uPatScale = tile width
void patTile(vec2 p){
  float W = uPatScale, L = W * 1.6, col = floor(p.x / W), row = floor(p.y / L);
  vec2 f = vec2(p.x - (col + .5) * W, p.y - row * L);
  float arc = abs(length(f) - W * .5);
  gOut = 1e4; gIn = min(.5 * W - abs(f.x), f.y < W * .5 ? arc : f.y - W * .5 + .02 * W); gPeriod = W; gFill = .7; gUse = 0.;
  gCid = h21(vec2(col, row)); gCell = vec2((col + .5) * W, (row + .5) * L);
  gCol = vec3(.86 + .22 * gCid);
}
// (6) net: diamond lattice of wire, cells cut away; uPatScale = mesh size close to (px = metres per pixel)
void patNet(vec2 p, float px){
  // a size ladder like the sea's: the mesh doubles with distance so its period never drops under ~12 pixels
  // (every wire of a coarser step is also a wire of the finer one, so the change only drops alternate wires)
  float mesh = uPatScale * exp2(ceil(log2(max(12. * px / max(uPatScale, 1e-4), 1.))));
  vec2 k = vec2(p.x + p.y * .6, p.x - p.y * .6) / mesh;
  vec2 f = abs(fract(k + .5) - .5);
  gOut = min(f.x, f.y) * mesh * .7; gIn = 1e4; gPeriod = mesh; gUse = 0.; gCol = vec3(1.); gSize = mesh;
  gCid = h21(floor(k)); gCell = p; gAlpha = -1.;      // -1: keep only the wire
}
`,rt=`
#include <common>
#include <fog_pars_vertex>
uniform float uTime, uSpin, uDrift, uPatScale;
uniform vec2 uPatOffset;
uniform vec4 uLay;
attribute vec3 aCol;
#ifdef HAS_EDGE
attribute vec3 aEdge; attribute vec4 aCell;
#endif
#ifdef HAS_SWAY
attribute float aSway;
#endif
#if VMODE == 1 || VMODE == 3 || VMODE == 8
attribute vec4 aLay;
#endif
#if VMODE == 2 || VMODE >= 5
attribute vec4 iA, iB;
#endif
#if VMODE >= 5
attribute vec4 iC;
#endif
uniform vec4 uCam;        // xy = camera world xz, z = trip progress, w = spare
uniform vec4 uSea;        // x = swell amplitude, y = z of the harbour mouth (calm beyond), z = calm share
uniform vec4 uFront;      // the dark front (as in the fragment shader): shutters swing shut behind it
varying vec3 vW, vN, vCol, vCellW;
varying vec2 vUv, vScl;
varying vec3 vEdge3; varying float vCellId;
varying vec4 vLay;
varying vec3 vAux;
const float RC = ${Ze}.0;
vec3 wallMap(vec2 sy, float depth){ float a = sy.x / RC, r = RC + depth; return vec3(r * sin(a), sy.y, RC - r * cos(a)); }
vec3 wallNrm(float s){ float a = s / RC; return vec3(-sin(a), 0., cos(a)); }
vec2 spiralP(float t, float arm){
  float ph = uSpin + arm * 3.14159265 + t * 8.6;
  float r = 75. * exp(1.9 * t), sx = mix(1.25, 2.7, smoothstep(0., 1., t));
  return vec2(r * cos(ph) * sx, r * sin(ph)) + vec2(0., ${Ge}.0);
}
void main(){
  vec3 pos = position, nrm = normal;
  vCol = aCol; vEdge3 = vec3(1e3); vCellId = 0.; vLay = uLay; vAux = vec3(0.); vScl = vec2(1.);
  vec2 puv = uv;
  vec3 cellL = position;
#ifdef HAS_EDGE
  vEdge3 = aEdge; cellL = aCell.xyz; vCellId = aCell.w;
#endif
#if VMODE == 1
  vLay = aLay;
  puv = position.xy + vec2(uDrift * (1. + aLay.w * .4), 0.);
  pos = wallMap(position.xy, position.z); nrm = wallNrm(position.x); cellL = pos;
#elif VMODE == 3
  float t = position.x, arm = aLay.x;
  vec2 c0 = spiralP(t, arm), c1 = spiralP(t + .004, arm);
  vec2 tg = c1 - c0; tg /= max(length(tg), 1e-4);
  vec2 nn = vec2(-tg.y, tg.x);
  float hw = (75. * exp(1.9 * t)) * .29 + 12.;
  hw *= smoothstep(0., .05, t) * (1. - .7 * smoothstep(.8, 1., t));
  vec2 sy = c0 + nn * position.y * hw;
  pos = wallMap(sy, position.z - 14. * (1. - position.y * position.y)); nrm = wallNrm(sy.x); cellL = pos;
  puv = vec2(t * 45., position.y); vAux = vec3(hw, aLay.y, 0.); vScl = vec2(hw * 1.3, hw);
#elif VMODE == 2
  vec2 cen = iA.xy; float roll = iB.x, sd = iB.y, size = iA.w;
  if (iB.z >= 0.) {
    vec2 c0 = spiralP(iB.z, iB.w), c1 = spiralP(iB.z + .004, iB.w);
    vec2 tg = c1 - c0; tg /= max(length(tg), 1e-4);
    vec2 nn = vec2(-tg.y, tg.x);
    float rr = 75. * exp(1.9 * iB.z);
    size *= (rr * .29 + 12.) * smoothstep(0., .05, iB.z) * (1. - .45 * smoothstep(.8, 1., iB.z));
    float side = clamp(roll, -1., 1.);
    cen = c0 + nn * side * size * .55;
    vec2 up = nn * side + tg * .55;
    roll = atan(-up.x, up.y);
  }
  roll += sin(uTime * .45 + sd * 40.) * .16;
  float lean = .22 + .2 * sin(uTime * .33 + sd * 23.);
  float cr = cos(roll), sr = sin(roll);
  vec2 lp = position.xy * size;
  vec2 sy = cen + vec2(cr * lp.x - sr * lp.y, sr * lp.x + cr * lp.y);
  pos = wallMap(sy, iA.z - position.z * size - max(position.y, -.3) * size * lean);
  vec3 wn = wallNrm(cen.x), wt = vec3(wn.z, 0., -wn.x);
  nrm = normalize(wn + wt * (fract(sd * 7.13) - .42) * 2.6 + vec3(0., lean - .1, 0.));
  cellL = wallMap(cen, iA.z);
  puv = position.xy; vScl = vec2(size);
  vAux = vec3(sd * 7. + uTime * (.09 + .08 * fract(sd * 3.7)), clamp(.35 + cen.y / 1100. + (fract(sd * 5.3) - .5) * .5, 0., 1.), sd);
  vCellId = sd;
#endif
#if VMODE == 5
  // critters. iA = anchor xyz + heading, iB = speed, range, phase, kind, iC = size, flap rate, flap amplitude, spare.
  // kind 0 streaming flyer, 1 circling hunter, 2 percher that opens its wings as the camera nears, 3 paddler, 4 leaper
  {
    float kind = iB.w, ph = iB.z, hd = iA.w, show = 1., fold = 1., tiltB = 0.;
    vec3 c = iA.xyz;
    float flap = sin(uTime * iC.y + ph * 40.) * iC.z;
    if (kind < .5) {
      float sK = mod(iB.x * uTime + ph * iB.y, max(iB.y, 1.)) - .5 * iB.y;
      c.xz += vec2(sin(hd), cos(hd)) * sK + vec2(cos(hd), -sin(hd)) * sin(uTime * .31 + ph * 20.) * 4.;
      c.y += sin(uTime * .7 + ph * 9.) * 1.5;
    } else if (kind < 1.5) {
      float a = uTime * iB.x / max(iB.y, 1.) + ph * 6.2831853;
      c.xz += vec2(sin(a), .6 * cos(a)) * iB.y; c.y += sin(a * 3.) * .9;
      hd += atan(cos(a), -.6 * sin(a) + 1e-4);
    } else if (kind < 2.5) {
      float nearK = 1. - smoothstep(14., 44., distance(uCam.xy, c.xz));
      flap = nearK * (1.0 + .14 * sin(uTime * 2.3 + ph * 30.)); tiltB = 1.15;
    } else if (kind < 3.5) {
      float sK = mod(iB.x * uTime + ph * iB.y, max(iB.y, 1.));
      c.xz += vec2(sin(hd), cos(hd)) * sK; c.y += sin(uTime * 1.9 + ph * 30.) * .04; fold = .25; flap = .0;
    } else if (kind < 4.5) {
      float sK = fract(uTime * iB.x + ph); show = step(sK, .34); sK /= .34;
      c.xz += vec2(sin(hd), cos(hd)) * sK * iB.y; c.y += sin(sK * 3.14159) * 1.5 - .25; tiltB = -cos(sK * 3.14159) * .7; flap = .3;
    } else if (kind < 5.5) {
      // 5: a modelled percher (cormorant): wings tucked until the camera nears, then spread wide to dry
      float nearK = 1. - smoothstep(14., 46., distance(uCam.xy, c.xz));
      fold = mix(.1, 1., nearK); flap = nearK * (.2 + .12 * sin(uTime * 2.3 + ph * 30.)) - (1. - nearK) * .55;
    } else {
      // 6: a modelled paddler (duck)
      float sK = mod(iB.x * uTime + ph * iB.y, max(iB.y, 1.));
      c.xz += vec2(sin(hd), cos(hd)) * sK; c.y += sin(uTime * 1.9 + ph * 30.) * .03; flap = 0.;
      tiltB = sin(uTime * 1.3 + ph * 50.) * .06;
    }
    float szK = max(iC.x, distance(c, cameraPosition) * .0021) * show;
    float solid = step(4.5, kind), axK = abs(position.x), wingK = mix(axK, max(axK - .2, 0.), solid);
    vec3 q = vec3(sign(position.x) * (axK - wingK + wingK * fold), position.y + wingK * flap, position.z);
    q.x *= 1. - .25 * min(flap * flap, 1.) * (1. - solid);
    float ct = cos(tiltB), st = sin(tiltB);
    q = vec3(q.x, q.y * ct + q.z * st, q.z * ct - q.y * st);
    float ch = cos(hd), sh = sin(hd);
    pos = c + vec3(q.x * ch + q.z * sh, q.y, -q.x * sh + q.z * ch) * szK;
    nrm = normalize(vec3(-sign(position.x) * flap * ch, 1., sign(position.x) * flap * sh));
    if (solid > .5) nrm = normalize(vec3(normal.x * ch + normal.z * sh, normal.y + 1e-4, -normal.x * sh + normal.z * ch));
    cellL = c; vCellId = fract(ph * 7.31);
    vCol = aCol * (iC.w < .5 ? vec3(1.) : (iC.w < 1.5 ? vec3(.10, .14, .28) : vec3(.55, .40, .22)));
#ifdef HAS_EDGE
    vEdge3 = aEdge * szK;
#endif
  }
#elif VMODE == 6
  // beads: a ballistic loop. iA = origin xyz + phase, iB = velocity xyz + life, iC = size, gravity, duty, spare
  float bS = 1.;
  vec3 bC = iA.xyz;
  {
    float life = max(iB.w, .1), sK = fract(uTime / life + iA.w), duty = clamp(iC.z, .05, 1.);
    float on = step(sK, duty); sK /= duty; float tl = sK * life * duty;
    bC += iB.xyz * tl + vec3(0., -.5 * iC.y * tl * tl, 0.);
    bS = iC.x * on * (1. - sK * sK * sK);
    pos = bC; cellL = bC; vCellId = fract(iA.w * 5.7);
  }
#elif VMODE == 7
  // lanterns: upright billboards hung from iA.xyz, swinging. iA.w = phase, iB = lit-from progress, swing, size, glow
  float bS = 1.;
  vec3 bC = iA.xyz;
  pos = bC; cellL = bC; vCellId = fract(iA.w * 5.7);
  vAux.z = smoothstep(iB.x, iB.x + .02, uCam.z + 1e-4) * iB.w * (.86 + .14 * sin(uTime * 5.3 + iA.w * 50.));
#elif VMODE == 8
  // free scroll heads on plain quads (uv spans the head, about -1..1). aLay = size m, seed, tone, spare
  vScl = vec2(max(aLay.x, 1e-3)); vCellId = aLay.y;
  vAux = vec3(aLay.y * 7. + uTime * (.09 + .08 * fract(aLay.y * 3.7)), aLay.z, aLay.y);
#endif
  vec4 lp4 = vec4(pos, 1.), lc4 = vec4(cellL, 1.);
#ifdef USE_INSTANCING
  lp4 = instanceMatrix * lp4; lc4 = instanceMatrix * lc4; nrm = mat3(instanceMatrix) * nrm;
#endif
  vec4 wp = modelMatrix * lp4;
#ifdef HAS_SWAY
  float ph = uTime * 3.1 + wp.x * .31 + wp.z * .27 + position.y * .9;
  wp.xyz += vec3(sin(ph), .25 * sin(ph * 1.7), cos(ph * .8)) * max(aSway, 0.);
#ifdef HAS_EDGE
  if (aSway < -.5) {
    // a shutter leaf hinged on the vertical through its cell centre (aSway -1 / -2 = which way it swings):
    // open until the dark front reaches it, then it swings shut
    vec3 hgK = (modelMatrix * lc4).xyz;
    float sFK = dot(hgK.xz, uFront.xy) - uFront.z + (aCell.w - .5) * 26.;
    float shutK = uFront.w * (1. - smoothstep(-42., 4., sFK));
    float angK = (aSway < -1.5 ? -1. : 1.) * (1.2 + .8 * fract(aCell.w * 7.3)) * (1. - shutK);
    vec2 dK = wp.xz - hgK.xz; float cK = cos(angK), sK2 = sin(angK);
    wp.xz = hgK.xz + vec2(dK.x * cK + dK.y * sK2, -dK.x * sK2 + dK.y * cK);
  }
#endif
#endif
#if VMODE == 4
  // the sea: three swell waves running north, calm inside the harbour; the normal follows the swell
  {
    float amp = uSea.x * mix(uSea.z, 1., smoothstep(uSea.y - 45., uSea.y + 30., wp.z));
    float p1 = wp.z * .105 + uTime * 1.0, p2 = (wp.z * .95 - wp.x * .3) * .19 + uTime * 1.35 + 1.7, p3 = (wp.z * .9 + wp.x * .44) * .41 + uTime * 2.0 + 4.1;
    wp.y += amp * (.55 * sin(p1) + .3 * sin(p2) + .12 * sin(p3));
    float dz = amp * (.55 * .105 * cos(p1) + .3 * .19 * .95 * cos(p2) + .12 * .41 * .9 * cos(p3));
    float dx = amp * (-.3 * .19 * .3 * cos(p2) + .12 * .41 * .44 * cos(p3));
    nrm = normalize(vec3(-dx, 1., -dz));
  }
#endif
#if VMODE == 6 || VMODE == 7
  {
    vec3 cr = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), cu = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
    float dK = distance(wp.xyz, cameraPosition);
#if VMODE == 6
    float szK = max(bS, dK * .0016 * step(1e-4, bS));
    wp.xyz += (cr * position.x + cu * position.y) * szK;
#else
    float szK = max(iB.z, dK * .0030), aK = sin(uTime * 1.7 + iA.w * 30.) * iB.y;
    vec2 qK = vec2(position.x * cos(aK) - position.y * sin(aK), position.x * sin(aK) + position.y * cos(aK)) * szK;
    cr = normalize(vec3(cr.x, 0., cr.z) + vec3(1e-5, 0., 0.));
    wp.xyz += cr * qK.x + vec3(0., qK.y, 0.);
#endif
#ifdef HAS_EDGE
    vEdge3 = aEdge * szK;
#endif
    nrm = normalize(cameraPosition - wp.xyz + vec3(0., .35 * dK, 0.));
  }
#endif
  vW = wp.xyz; vCellW = (modelMatrix * lc4).xyz;
  vN = normalize(mat3(modelMatrix) * nrm + vec3(0., 1e-5, 0.));
#ifdef COORDS_WORLD
  puv = wp.xz;
#endif
#if VMODE == 4
  puv = vec2(wp.x, -wp.z);
#endif
  vUv = puv + uPatOffset;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,st=`
#include <common>
#include <fog_pars_fragment>
uniform float uTime, uSeed, uPatScale, uWire, uRoll, uDrift, uCrestFoam, uFogAmt, uSpec, uEmis, uCellSize;
uniform vec2 uGraze;      // GRAZE_FADE: |N.V| range over which a sheet's wires and pattern come in
uniform vec3 uSun, uWhite, uCeladon, uTurq, uLapis, uNavy, uGold, uRed;
uniform vec4 uGlint;      // xy = sweep direction (world xz), z = speed m/s, w = spacing m
uniform vec4 uFront;      // xy = direction (world xz), z = offset m, w = 1 on: cells behind the line flood to lapis
uniform vec4 uFlash;      // xyz = world position of the lightning, w = intensity 0..1
uniform vec3 uFlashUv;    // the same in wall coordinates (s, y, radius)
uniform vec4 uPale;       // rgb = pale distance tone, w = metres per step (0 = off)
uniform vec4 uShaft;      // xy = unit normal of the sun stripe (world xz), z = strength, w = half width m (0 = off)
uniform vec4 uShaftB;     // xy = centre of the stripe (world xz), z = reach m
uniform vec4 uCam;
uniform vec4 uFlood;      // rgb = the tone cool cells flood to behind the dark front, w = how far (0..1)
uniform vec4 uFloodB;     // z = 1: blue-and-white flood, cell by cell: each cell floods by x or by y (w is then unused)
varying vec3 vW, vN, vCol, vCellW;
varying vec2 vUv, vScl;
varying vec3 vEdge3; varying float vCellId;
varying vec4 vLay;
varying vec3 vAux;
`,ct=`
void main(){
  // derivatives once, before any loop
  float vEdge = min(vEdge3.x, min(vEdge3.y, vEdge3.z));
  vec2 fw = fwidth(vUv) * vScl;
  float px = max(max(fw.x, fw.y), 1e-5);
  float ePx = max(fwidth(vEdge), 1e-5);
  vec3 dpx = dFdx(vW), dpy = dFdy(vW);

  gCol = vec3(1.); gUse = 0.; gOut = 1e4; gIn = 1e4; gPeriod = 1e4; gFill = 1.; gCid = vCellId; gAlpha = 1.; gCell = vUv;
  gAvg = vec3(-1.); gSize = 1e4;
#if PATTERN == 1
  patRuyi(vUv, vLay);
#elif PATTERN == 2
  // the sea: the same scale-arcs at three sizes, each drawn only where it is between ~3 and ~35 pixels, so the
  // near water has small arcs, the far water large ones, and the change is a cross-fade of wire width
  float seaW = 0., seaT = 4., seaCid = 0., seaAcc = 0., seaBi = 0.; vec3 seaC = vec3(0.); vec2 seaCell = vUv;
  {
    float R = uPatScale;
    vec3 avg = vCol * vec3(.80, .86, .90);
    for (int k = 0; k < 3; k++) {
      patScales(vUv, R);
      float v = smoothstep(2.5, 7., R / px);
      if (k > 0) v *= 1. - smoothstep(12.5, 35., R / px);
      float hw = max(uWire * .5 * (1. + 1.5 * float(k)), .75 * px), aa = px / hw * .7;
      float vi = smoothstep(3.5, 7.5, gPeriod / px) * v;
      float mo = (1. - smoothstep(1. - aa, 1. + aa, gOut / hw)) * v;
      float mi = (1. - smoothstep(1. - aa, 1. + aa, gIn / (hw * .8))) * vi * .75;
      seaW = max(seaW, max(mo, mi));
      seaT = min(seaT, min(mix(4., gOut / hw, v), mix(4., gIn / (hw * .8), vi)));
      vec3 ck = mix(vCol * gCol, gCol, gUse);
      ck = mix(ck, mix(ck, uLapis, .35), step(.82, gCid) * (1. - gUse));
      ck = mix(avg, ck, max(vi, gUse * v));
      float wK = v * (1. - seaAcc);
      seaC += ck * wK; seaBi += step(.45, fract(gCid * 7.31 + .13)) * wK; seaAcc += wK;
      if (k == 0) { seaCid = gCid; seaCell = gCell; }
      R *= 5.;
    }
    seaC += avg * (1. - seaAcc); seaBi += .68 * (1. - seaAcc);
    gOut = 1e4; gIn = 1e4; gPeriod = 1e4; gUse = 1.; gCol = seaC; gCid = seaCid; gCell = seaCell; gSize = 1e4;
  }
#elif PATTERN == 10
  // contour bands on terrain: a wire along every uPatScale metres of height, a tint per band
  {
    float e = vW.y / uPatScale, gK = max(length(vec2(dpx.y, dpy.y)) / uPatScale, 1e-6);
    float bandK = floor(e);
    gIn = abs(fract(e + .5) - .5) / gK * px; gPeriod = px / gK; gFill = .75; gUse = 0.;
    gCid = h11(bandK * .37 + 3.1); gCell = vec2(bandK * 7., 0.);
    gCol = vec3(.80 + .34 * gCid, .84 + .28 * h11(bandK * 1.7 + .3), .84 + .30 * gCid);
    float tK = mod(bandK, 3.);
    gCol *= tK < .5 ? vec3(1.) : (tK < 1.5 ? vec3(.84, 1.02, 1.08) : vec3(.66, .84, 1.16));
  }
#elif PATTERN == 11
  // a single wire along uv.y = 0 (cords, stays, sheets): uv.y is metres from the centre line
  gOut = abs(vUv.y); gAlpha = -1.; gUse = 0.;
#elif PATTERN == 3
  patFiller(vUv);
#elif PATTERN == 4
  patBrick(vUv);
#elif PATTERN == 5
  patTile(vUv);
#elif PATTERN == 6
  patNet(vUv, px);
#elif PATTERN == 7
  patVolute(vUv, vAux);
#elif PATTERN == 8
  patBands(vUv, vAux);
#elif PATTERN == 9
  patEye(vUv / max(uPatScale, 1e-3));
#endif
  if (gAlpha == 0.) discard;

  // wires: normalised coordinate t (0 on the centre line, 1 at the bead's edge)
  float hwP = max(uWire * .5, .75 * px), hwE = max(uWire * .5, .75 * ePx);
  float vis = smoothstep(3.5, 7.5, gPeriod / px);
  float visE = smoothstep(2.5, 6., uCellSize / ePx);
  float tO = gOut / hwP, tI = gIn / (hwP * .8), tE = vEdge / hwE;
  float aaP = px / hwP * .7, aaE = ePx / hwE * .7;
  float visO = smoothstep(2.5, 7., gSize / px);
  float mO = (1. - smoothstep(1. - aaP, 1. + aaP, tO)) * visO;
  float mI = (1. - smoothstep(1. - aaP, 1. + aaP, tI)) * vis * gFill;
  float mE = (1. - smoothstep(1. - aaE, 1. + aaE, tE)) * visE;
  float wire = max(max(mO, mI), mE);
  float t = min(min(mix(4., tO, visO), mix(4., tE, visE)), mix(4., tI, vis));
#if PATTERN == 2
  wire = seaW; t = seaT;
#endif
  if (gAlpha < 0. && wire < .5) discard;        // nets, cords: only the wire itself is ever drawn

  vec3 N = normalize(vN);
  if (!gl_FrontFacing) N = -N;
  vec3 V = cameraPosition - vW; float dist = length(V); V /= max(dist, 1e-4);
  vec3 L = uSun, H = normalize(L + V + vec3(0., 1e-4, 0.));

  // round bead: bend the normal across the wire along the surface gradient of t
  float gx = dFdx(t), gy = dFdy(t);
  vec3 r1 = cross(dpy, N), r2 = cross(N, dpx);
  vec3 grad = gx * r1 + gy * r2; grad *= sign(dot(dpx, r1) + 1e-12);
  float gl2 = length(grad);
  vec3 T = gl2 > 1e-9 ? grad / gl2 : vec3(0.);
  float tc = clamp(t, 0., 1.);
  vec3 Nb = normalize(N * sqrt(max(1. - tc * tc, 0.)) + T * tc + N * 1e-3);

  // enamel cell: flat, two tones by facing, broad gloss, pooled mottling, pinprick pits
  if (gAvg.x >= 0.) {
#ifdef GRAZE_FADE
    // sheets seen from below at a slant: their nested bands settle to the average well before they alias
    gCol = mix(gAvg, gCol, smoothstep(2.2, 5., gPeriod / px));
#else
    gCol = mix(gAvg, gCol, smoothstep(.8, 2.4, gPeriod / px));
#endif
    gCol = mix(mix(uCeladon, uLapis, .3), gCol, smoothstep(.7, 2.2, gSize / px));
  }
  vec3 cell = mix(vCol * gCol, gCol, gUse);
  vec2 cellP = gCell;
  float fl = uFlash.w * (1. - smoothstep(.25, 1., distance(vCellW, uFlash.xyz) / max(uFlashUv.z, 1.) + (gCid - .5) * .35));
#if PATTERN == 9
  fl *= .2;
#endif
#if PATTERN == 1
  if (vLay.w >= 0.) fl = uFlash.w * (1. - smoothstep(.25, 1., distance(gCell - vec2(uDrift * (1. + floor(vLay.w + .5) * .4), 0.), uFlashUv.xy) / max(uFlashUv.z, 1.) + (gCid - .5) * .35));
#endif
  float shaft = 0.;
  if (uShaft.w > 0.) {
    vec2 dq = vCellW.xz - uShaftB.xy;
    shaft = step(abs(dot(dq, uShaft.xy)) + (gCid - .5) * 6., uShaft.w) * step(length(dq) + (gCid - .5) * 30., uShaftB.z) * uShaft.z;
  }
  if (uFront.w > .5) {
    float sF = dot(vCellW.xz, uFront.xy) - uFront.z + (gCid - .5) * 26.;
    // only the cool cells flood to lapis; reds (sails, lanterns, brick) just sink a little
    float redK = smoothstep(.06, .3, cell.r - max(cell.g, cell.b));
    float fAmt = uFlood.w;
    if (uFloodB.z > .5) {
      // porcelain: a cell floods nearly all the way or hardly at all (the sea by scale-fan, plain cells by cell id;
      // fine patterns take the mean, so nothing speckles at distance)
      float bi = .68;
#if PATTERN == 0
      bi = step(.45, fract(gCid * 7.31 + .13));
#elif PATTERN == 2
      bi = seaBi;
#endif
      fAmt = mix(uFloodB.x, uFloodB.y, bi);
    }
    if (sF < 0.) cell = mix(cell, mix(uFlood.rgb * (.45 + dot(cell, vec3(.3, .5, .2))), cell * .8, redK), fAmt * uFront.w * (1. - shaft));
  }
  cell *= 1. + .3 * shaft; cell += vec3(.07, .05, .0) * shaft;
  float lit = step(-.05, dot(N, L));
  cell *= mix(vec3(.50, .58, .74), vec3(1.), lit);
  float mott = vnoise(vUv * vScl * .021 + gCid * 31.) + .5 * vnoise(vUv * vScl * .09 + 7.);
  cell *= .93 + .09 * mott;
  float pitF = 1. - smoothstep(.15, .5, px);
  cell *= 1. - .22 * pitF * step(.988, h21(floor(vUv * vScl * 2.3) + .5));
  float gloss = pow(max(dot(N, H), 0.), 14.) * .13 + pow(1. - max(dot(N, V), 0.), 3.) * .05;
  cell += vec3(gloss) * lit;
  cell = mix(cell, uWhite * 1.3, clamp(fl, 0., 1.) * .8);
  if (uPale.w > 0.) cell = mix(cell, uPale.rgb, floor(min(dist / uPale.w, 3.)) / 3. * .55);

  // gold wire: lit bead, tight highlight, travelling glint band
  float band = mod(dot(vW.xz, uGlint.xy) - uTime * uGlint.z, max(uGlint.w, 1.)) - .5 * uGlint.w;
  float glint = exp(-band * band / 3600.);
  float kd = .20 + .58 * max(dot(Nb, L), 0.);
  float spec = pow(max(dot(Nb, H), 0.), 200.) * uSpec;
  float fillB = mix(gFill, 1., max(mO, mE));
  vec3 wcol = uGold * (kd + 1.6 * glint) * fillB + vec3(1., .86, .55) * spec * (1. + 3. * glint) * fillB;
  wcol += vec3(1., .9, .7) * fl * .8;
  // inner wires fading below the footprint leave a trace of their average colour in the cell
  cell *= 1. + uGold * .22 * max((1. - vis) * step(gPeriod, 9e3), (1. - visE) * step(vEdge, 9e2) * .6);
#ifdef GRAZE_FADE
  // a sheet seen nearly edge-on (the overhead arm from far off): its pattern settles to the average colour
  // and its wires stop glittering
  {
    float gzK = smoothstep(uGraze.x, uGraze.y, abs(dot(N, V)));
    wire *= gzK;
    if (gAvg.x >= 0.) cell = mix(gAvg * mix(vec3(.50, .58, .74), vec3(1.), lit), cell, gzK);
  }
#endif
#if VMODE == 7
  vec3 col = mix(cell, wcol, wire) + vCol * uEmis * vAux.z;
#else
  vec3 col = mix(cell, wcol, wire) + vCol * uEmis;
#endif
  if (gAlpha < 0.) col = wcol;                     // wire-only patterns never show a cell colour

  gl_FragColor = vec4(max(col, 0.), 1.);
  vec3 pre = gl_FragColor.rgb;
  #include <fog_fragment>
  gl_FragColor.rgb = max(mix(pre, gl_FragColor.rgb, uFogAmt), 0.);
}
`;function ft(y={}){const p=(y.palette&&y.palette.length>=7?y.palette:Xe).map(l=>new e.Color(l)),a=l=>new e.Vector3(l.r,l.g,l.b),C=p[0].clone().lerp(p[3],.5),b={uTime:{value:0},uSeed:{value:y.seed??.37},uSpin:{value:0},uDrift:{value:0},uSun:{value:(y.sun?y.sun.clone():new e.Vector3(-.52,.31,.8)).normalize()},uWhite:{value:a(p[3]).multiplyScalar(.8)},uCeladon:{value:a(C).multiplyScalar(.9)},uTurq:{value:a(p[0])},uLapis:{value:a(p[1])},uNavy:{value:a(p[5])},uGold:{value:a(p[4])},uRed:{value:a(p[2])},uGlint:{value:new e.Vector4(1,0,900/7,900)},uFront:{value:new e.Vector4(1,0,0,0)},uFlash:{value:new e.Vector4(0,0,0,0)},uFlashUv:{value:new e.Vector3(0,0,420)},uPale:{value:new e.Vector4(.8,.92,.9,0)},uShaft:{value:new e.Vector4(0,1,1,0)},uShaftB:{value:new e.Vector4(0,0,200,0)},uFlood:{value:new e.Vector4(p[1].r,p[1].g,p[1].b,.78)},uFloodB:{value:new e.Vector4(0,0,0,0)},uCam:{value:new e.Vector4(0,0,0,0)},uSea:{value:new e.Vector4(1,-50,.12,0)},uFogAmt:{value:y.fogAmount??.06}},$=[];function v(l={}){const w={PATTERN:it[l.pattern??"none"]??0,VMODE:l.vmode??0};l.edge&&(w.HAS_EDGE=1),l.sway&&(w.HAS_SWAY=1),l.coords==="worldXZ"&&(w.COORDS_WORLD=1),l.graze&&(w.GRAZE_FADE=1);const u=e.UniformsUtils.merge([e.UniformsLib.fog,{uPatScale:{value:l.patScale??1},uPatOffset:{value:new e.Vector2},uWire:{value:l.wire??.06},uRoll:{value:l.roll??1},uCrestFoam:{value:l.foam??.12},uSpec:{value:l.spec??5},uEmis:{value:l.emissive??0},uCellSize:{value:l.cellSize??3},uGraze:{value:new e.Vector2(...l.grazeRange??[.1,.28])},uLay:{value:l.lay?new e.Vector4(...l.lay):new e.Vector4(100,400,0,0)}}]);for(const L in b)u[L]=b[L];const k=new e.ShaderMaterial({defines:w,uniforms:u,fog:!0,side:l.side??e.DoubleSide,vertexShader:rt,fragmentShader:st+lt+ct});return $.push(k),k}return{uniforms:b,palette:p,celadon:C,material:v,update(l){b.uTime.value=l}}}function at(y,p={}){const a=y.index?y.toNonIndexed():y.clone(),C=a.attributes.position.array,b=C.length/9,$=Math.cos(p.angle??.15),v=a.attributes.color?a.attributes.color.array:null,l=new Int32Array(b*3),w=new Map;for(let t=0;t<b*3;t++){const f=Math.round(C[t*3]*500)+","+Math.round(C[t*3+1]*500)+","+Math.round(C[t*3+2]*500);let m=w.get(f);m===void 0&&(m=w.size,w.set(f,m)),l[t]=m}const u=new Float32Array(b*3),k=new Float32Array(b*3),L=new Float32Array(b),ee=new Array(b),Y=new e.Vector3,Ce=new e.Vector3,Se=new e.Vector3,re=new e.Vector3,ne=new e.Vector3;for(let t=0;t<b;t++){Y.fromArray(C,t*9),Ce.fromArray(C,t*9+3),Se.fromArray(C,t*9+6),re.subVectors(Ce,Y).cross(ne.subVectors(Se,Y));const f=re.length()*.5;L[t]=f,f>1e-12&&re.multiplyScalar(.5/f),re.toArray(u,t*3),ne.copy(Y).add(Ce).add(Se).multiplyScalar(1/3),ne.toArray(k,t*3),ee[t]=p.cellKey?p.cellKey(ne,re,t):0}const O=new Int32Array(b);for(let t=0;t<b;t++)O[t]=t;const se=t=>{for(;O[t]!==t;)O[t]=O[O[t]],t=O[t];return t},ce=new Map,fe=w.size+1,Me=(t,f)=>{const m=l[t*3+f],K=l[t*3+(f+1)%3];return m<K?m*fe+K:K*fe+m};for(let t=0;t<b;t++)for(let f=0;f<3;f++){const m=Me(t,f),K=ce.get(m);if(K===void 0){ce.set(m,[t]);continue}for(const A of K){if(ee[A]!==ee[t])continue;if(u[A*3]*u[t*3]+u[A*3+1]*u[t*3+1]+u[A*3+2]*u[t*3+2]>=$){const W=se(A),U=se(t);W!==U&&(O[W]=U)}}K.push(t)}const ue=new Map;for(let t=0;t<b;t++){const f=se(t);let m=ue.get(f);m||(m={id:ue.size,n:new e.Vector3,c:new e.Vector3,a:0,col:new e.Color(0,0,0),key:ee[t]},ue.set(f,m));const K=L[t];if(m.a+=K,m.n.x+=u[t*3]*K,m.n.y+=u[t*3+1]*K,m.n.z+=u[t*3+2]*K,m.c.x+=k[t*3]*K,m.c.y+=k[t*3+1]*K,m.c.z+=k[t*3+2]*K,v)for(let A=0;A<3;A++)m.col.r+=v[(t*3+A)*3]*K/3,m.col.g+=v[(t*3+A)*3+1]*K/3,m.col.b+=v[(t*3+A)*3+2]*K/3}for(const t of ue.values()){const f=Math.max(t.a,1e-9);t.c.multiplyScalar(1/f),t.n.normalize(),v?t.col.multiplyScalar(1/f):t.col.setRGB(1,1,1),p.color&&t.col.copy(p.color(t.n,t.c,t.id,t.key))}const s=new Float32Array(b*9),c=new Float32Array(b*9).fill(1e3),d=new Float32Array(b*12),i=a.attributes.normal?a.attributes.normal.array:new Float32Array(b*9);for(let t=0;t<b;t++){const f=se(t),m=ue.get(f),K=m.id*.6180339%1;for(let A=0;A<3;A++){const V=ce.get(Me(t,A));let W=!0;for(const U of V)U!==t&&se(U)===f&&(W=!1);if(W){const U=t*9+A*3,D=t*9+(A+1)%3*3,te=(A+2)%3,j=Math.hypot(C[D]-C[U],C[D+1]-C[U+1],C[D+2]-C[U+2]),ie=2*L[t]/Math.max(j,1e-9);for(let he=0;he<3;he++)c[(t*3+he)*3+A]=he===te?ie:0}}for(let A=0;A<3;A++){const V=t*3+A;s[V*3]=m.col.r,s[V*3+1]=m.col.g,s[V*3+2]=m.col.b,d[V*4]=m.c.x,d[V*4+1]=m.c.y,d[V*4+2]=m.c.z,d[V*4+3]=K,(!p.smooth||!a.attributes.normal)&&(i[V*3]=m.n.x,i[V*3+1]=m.n.y,i[V*3+2]=m.n.z)}}return a.setAttribute("normal",new e.BufferAttribute(i,3)),a.setAttribute("aCol",new e.BufferAttribute(s,3)),a.setAttribute("aEdge",new e.BufferAttribute(c,3)),a.setAttribute("aCell",new e.BufferAttribute(d,4)),a.attributes.color&&a.deleteAttribute("color"),a}function ot(){const y=[],p=[],a=(v,l,w,u)=>{y.push(v[0],v[1],v[2],l[0],l[1],l[2],w[0],w[1],w[2]),p.push(u)},C=(v,l,w,u,k)=>{a(v,l,w,k),a(v,w,u,k)};return{tri:a,quad:C,box:(v,l,w,u,k,L,ee,Y=1)=>{const Ce=v-u/2,Se=v+u/2,re=l-k/2,ne=l+k/2,O=w-L/2,se=w+L/2,ce=u/2*Y,fe=L/2*Y,Me=[Ce,re,O],ue=[Se,re,O],s=[Se,re,se],c=[Ce,re,se],d=[v-ce,ne,w-fe],i=[v+ce,ne,w-fe],t=[v+ce,ne,w+fe],f=[v-ce,ne,w+fe];C(Me,d,i,ue,ee+":a"),C(ue,i,t,s,ee+":b"),C(s,t,f,c,ee+":c"),C(c,f,d,Me,ee+":d"),C(d,f,t,i,ee+":t")},keys:p,geometry:()=>{const v=new e.BufferGeometry;return v.setAttribute("position",new e.Float32BufferAttribute(y,3)),v}}}function ut(y,p=Xe){const a=p.map(s=>new e.Color(s)),[C,b,$,v,l,w]=a,u=ot(),k=8,L=12,ee=s=>{const c=-1+2*s/k,d=c*L,i=3.25*(1-.72*Math.pow(Math.max(c,0),2.2)-.28*Math.pow(Math.max(-c,0),2.6)),t=2+1.2*c*c+(c<0?2:.9)*c*c,f=-.7+1.5*Math.abs(c*c*c);return{z:d,hb:i,gy:t,ky:f,pts:[[i,t],[i*.97,Ie(f,t,.62)],[i*.8,Ie(f,t,.26)],[i*.3,f]]}},Y=[];for(let s=0;s<=k;s++)Y.push(ee(s));for(let s=0;s<k;s++){const c=Y[s],d=Y[s+1];for(let i=0;i<3;i++)for(const t of[1,-1]){const f=[c.pts[i][0]*t,c.pts[i][1],c.z],m=[d.pts[i][0]*t,d.pts[i][1],d.z],K=[d.pts[i+1][0]*t,d.pts[i+1][1],d.z],A=[c.pts[i+1][0]*t,c.pts[i+1][1],c.z],V="h"+i+":"+t+":"+(i===1?s>>1:s);t>0?u.quad(f,m,K,A,V):u.quad(f,A,K,m,V)}u.quad([-c.pts[3][0],c.ky,c.z],[c.pts[3][0],c.ky,c.z],[d.pts[3][0],d.ky,d.z],[-d.pts[3][0],d.ky,d.z],"k"),u.quad([-c.hb*.97,c.gy-.3,c.z],[-d.hb*.97,d.gy-.3,d.z],[d.hb*.97,d.gy-.3,d.z],[c.hb*.97,c.gy-.3,c.z],"d"+(s>>1))}for(const[s,c]of[[Y[0],"ts"],[Y[k],"tb"]]){const d=s===Y[0]?-1:1,i=s.pts;for(let t=0;t<3;t++){const f=[[-i[t][0],i[t][1],s.z],[i[t][0],i[t][1],s.z],[i[t+1][0],i[t+1][1],s.z],[-i[t+1][0],i[t+1][1],s.z]];d>0?u.quad(f[0],f[3],f[2],f[1],c+t):u.quad(f[0],f[1],f[2],f[3],c+t)}}u.box(0,Y[k].gy+.9,L-.1,.5,2.4,.6,"stem",.6),u.box(0,.6,-L-.5,.3,3.4,1.6,"rud"),u.box(0,Y[1].gy+.7,-8.6,4.2,2,5.2,"cab",.92),u.box(0,Y[1].gy+1.95,-8.6,5,.5,6,"roof",.55),u.box(0,Y[4].gy+.3,-2.6,2.6,1.2,3,"hse",.85);const Ce=[{z:7.4,h:12.5,w:7.5,yaw:.42},{z:.6,h:18.5,w:11,yaw:-.3},{z:-8.4,h:11.5,w:6.5,yaw:.36}];for(const s of Ce)u.box(0,s.h/2+1.5,s.z,.5,s.h+1,.5,"mast"+s.z,.5);for(const s of[1,-1]){const c=Y[k-1],d=(c.hb+.06)*s,i=Ie(c.pts[1][1],c.gy,.45),t=c.z+.4;for(const[f,m,K]of[[.62,"eyeW",0],[.3,"eyeP",.03]])for(let A=0;A<8;A++){const V=A/8*Math.PI*2,W=(A+1)/8*Math.PI*2,U=d+K*s,D=[U,i,t],te=[U,i+Math.sin(V)*f,t+Math.cos(V)*f*1.3],j=[U,i+Math.sin(W)*f,t+Math.cos(W)*f*1.3];s>0?u.tri(D,te,j,m+s):u.tri(D,j,te,m+s)}}const Se=u.keys,re=v.clone().lerp(l,.35).multiplyScalar(.62),ne=l.clone().lerp($,.45).multiplyScalar(.5),O=at(u.geometry(),{angle:Math.PI,cellKey:(s,c,d)=>Se[d],color:(s,c,d,i)=>i.startsWith("h0")?v.clone().multiplyScalar(.85):i.startsWith("h1")?b.clone().lerp(C,d*7%3*.12):i.startsWith("h2")||i==="k"?w.clone().multiplyScalar(1.2):i.startsWith("d")?re:i.startsWith("tb")||i.startsWith("ts")?i.endsWith("0")?v.clone().multiplyScalar(.85):b:i.startsWith("roof")?i.endsWith(":t")?C.clone().multiplyScalar(.8):C:i.startsWith("cab")||i.startsWith("hse")?i.endsWith(":t")?re:v.clone().multiplyScalar(.8):i.startsWith("eyeW")?v:i.startsWith("eyeP")?w:i.startsWith("stem")?$:ne}),se=ot(),ce=[],fe=s=>{for(const c of s)ce.push(c)};Ce.forEach((s,c)=>{const d=c===1?6:5,i=Math.cos(s.yaw),t=Math.sin(s.yaw),f=3.2+(c===1?0:.6),m=s.h-f+1.2,K=(W,U,D)=>[W*i+D*t,U,s.z-W*t+D*i];for(let W=0;W<d;W++){const U=j=>{const ie=j/d,he=s.w*.66*(.82+.2*Math.sin(ie*2.6)),Ue=-s.w*.34,Ne=f+m*ie*.84,$e=f+m*(ie*.84+.16*ie*ie)+.3*ie,qe=[];for(let He=0;He<=3;He++){const Ye=He/3,n=Ie(Ue,he,Ye);qe.push({p:K(n,Ie(Ne,$e,Ye),Math.sin(Ye*Math.PI)*s.w*.13+.25),dx:Math.abs(n)})}return qe},D=U(W),te=U(W+1);for(let j=0;j<3;j++){se.quad(D[j].p,D[j+1].p,te[j+1].p,te[j].p,"s"+c+":"+W);const ie=D[j].dx*.03,he=D[j+1].dx*.03,Ue=te[j+1].dx*.03,Ne=te[j].dx*.03;fe([ie,he,Ue,ie,Ue,Ne])}}const A=s.h+2,V=4.2+c%2;for(let W=0;W<3;W++){const U=W/3,D=(W+1)/3,te=.7*(1-U*.8),j=.7*(1-D*.8);se.quad([0,A-te,s.z+.3+U*V],[0,A-j,s.z+.3+D*V],[0,A+j,s.z+.3+D*V],[0,A+te,s.z+.3+U*V],"p"+c+":"+W),fe([U*.5,D*.5,D*.5,U*.5,D*.5,U*.5])}});const Me=se.keys,ue=at(se.geometry(),{angle:Math.PI,cellKey:(s,c,d)=>Me[d],color:(s,c,d,i)=>i[0]==="p"?$.clone().multiplyScalar(1.7):$.clone().multiplyScalar(d%2?1.25:1)});return ue.setAttribute("aSway",new e.Float32BufferAttribute(ce,1)),{hull:O,sails:ue}}function dt(y,p){const a=Math.abs(y);return Math.min(Math.hypot(y,p-.4)-.52,Math.hypot(a-.52,p+.02)-.43,Math.hypot(y,p+.5)-.66,Math.hypot(y,p+1.05)-.5)}function ht(y=44){const C=[];for(let w=0;w<y;w++){const u=w/y*Math.PI*2,k=Math.sin(u),L=Math.cos(u);let ee=2.2;for(;ee>.05&&dt(0+k*ee,-.15+L*ee)>0;)ee-=.01;C.push(ee+.045)}const b=[],$=[],v=[.5,1];b.push(0,-.15,.16);for(const w of v)for(let u=0;u<y;u++){const k=u/y*Math.PI*2;b.push(0+Math.sin(k)*C[u]*w,-.15+Math.cos(k)*C[u]*w,.16*(1-w*w))}for(let w=0;w<y;w++){const u=(w+1)%y;$.push(0,1+u,1+w),$.push(1+w,1+u,1+y+u,1+w,1+y+u,1+y+w)}const l=new e.BufferGeometry;return l.setAttribute("position",new e.Float32BufferAttribute(b,3)),l.setAttribute("normal",new e.Float32BufferAttribute(new Float32Array(b.length).fill(0),3)),l.setAttribute("aCol",new e.Float32BufferAttribute(new Float32Array(b.length).fill(1),3)),l.setAttribute("uv",new e.Float32BufferAttribute(new Float32Array(b.length/3*2),2)),l.setIndex($),l}function et(y,p,a,C=new e.Vector3){const b=y/Ze,$=Ze+a;return C.set($*Math.sin(b),p,Ze-$*Math.cos(b))}function gt(y,p,a){const C=a+p*Math.PI+y*8.6,b=75*Math.exp(1.9*y),$=Ie(1.25,2.7,de(0,1,y));return[b*Math.cos(C)*$,b*Math.sin(C)+Ge]}async function mt(y,p={}){const a=y.rng.fork?y.rng.fork("cloisonne-typhoon"):y.rng,C=p.palette&&p.palette.length>=7?p.palette:Xe,b=y.quality?.detail??1,$=a(),v=ft({palette:C,seed:$,sun:p.sun,fogAmount:p.fogAmount??.06}),l=v.uniforms,w=a.chance(.5)?1:-1,u=a.range(0,Math.PI*2),k=new e.Group;k.name="cloisonne-typhoon";const L=new e.Group;k.add(L);const ee=p.advance??300,Y=[{depth:0,S:95,crest:400,base:95},{depth:75,S:130,crest:590,base:70},{depth:160,S:175,crest:790,base:45},{depth:255,S:235,crest:960,base:0}];Y.forEach((n,x)=>{n.S*=a.range(.9,1.12),n.crest*=a.range(.93,1.04),n.l=x});const Ce=(n,x)=>x.crest*(.7+.17*Math.sin(n*.0041+x.l*1.9+$*6)+.13*Math.sin(n*.0113+x.l*4.3+$*11))*(1-.78*de(700,1500,n))*de(-1570,-1400,n);{const n=[],x=[],B=[];for(const o of Y){const r=n.length/3,G=o.crest+o.S*1.15;for(let N=0;N<=8;N++)for(let X=0;X<=72;X++)n.push(-1580+3160*X/72,-o.S*1.7*(N===0?1:0)+G*N/8,o.depth),x.push(o.S,o.crest,o.base,o.l);for(let N=0;N<8;N++)for(let X=0;X<72;X++){const H=r+N*73+X,Le=H+1,Z=H+72+1,I=Z+1;B.push(H,Le,I,H,I,Z)}}const M=new e.BufferGeometry;M.setAttribute("position",new e.Float32BufferAttribute(n,3)),M.setAttribute("aLay",new e.Float32BufferAttribute(x,4)),M.setAttribute("aCol",new e.Float32BufferAttribute(new Float32Array(n.length).fill(1),3)),M.setIndex(B);const P=new e.Mesh(M,v.material({pattern:"ruyi",vmode:1,wire:2.2,spec:4}));P.frustumCulled=!1,P.name="storm-shells",L.add(P)}await y.yield?.();{const n=[],x=[],B=[];for(let I=0;I<2;I++){const ae=n.length/3;for(let oe=0;oe<=230;oe++)for(let le=0;le<=4;le++)n.push(oe/230,-1+2*le/4,-42-I*6),x.push(I,1-I*0,0,0);for(let oe=0;oe<230;oe++)for(let le=0;le<4;le++){const Ae=ae+oe*5+le,ye=Ae+1,pe=Ae+4+1,ze=pe+1;B.push(Ae,pe,ze,Ae,ze,ye)}}const M=new e.BufferGeometry;M.setAttribute("position",new e.Float32BufferAttribute(n,3)),M.setAttribute("aLay",new e.Float32BufferAttribute(x,4)),M.setAttribute("aCol",new e.Float32BufferAttribute(new Float32Array(n.length).fill(1),3)),M.setIndex(B);const P=new e.Mesh(M,v.material({pattern:"bands",vmode:3,wire:2.4,spec:5}));P.frustumCulled=!1,P.name="storm-spiral",L.add(P);const o=150*a.range(.92,1.1),r=[0,Ge,-78],G=[],N=[0,0,0,-2.5],X=40;for(let I=0;I<X;I++){const ae=I/X*Math.PI*2;r.push(Math.cos(ae)*o*1.02,Ge+Math.sin(ae)*o*1.02,-60),N.push(0,0,0,-2.5),G.push(0,1+I,1+(I+1)%X)}const H=new e.BufferGeometry;H.setAttribute("position",new e.Float32BufferAttribute(r,3)),H.setAttribute("aLay",new e.Float32BufferAttribute(N,4)),H.setAttribute("aCol",new e.Float32BufferAttribute(new Float32Array(r.length).fill(1),3)),H.setIndex(G);const Le=v.material({pattern:"eye",vmode:1,wire:2.4,patScale:o,spec:6});Le.uniforms.uPatOffset.value.set(0,-Ge);const Z=new e.Mesh(H,Le);Z.frustumCulled=!1,Z.name="storm-hub",L.add(Z)}{const n=[],x=[],B=Math.round(46*b);for(let o=0;o<2;o++)for(let r=0;r<B;r++){const G=.1+.88*(r+a.range(.1,.9))/B,N=a.chance(.78);n.push(0,0,-52-a.range(0,26),a.range(.5,.95)*(N?1:.7)),x.push(N?-1:1,a(),G,o)}for(let o=0;o<2;o++)n.push(0,0,-64,1.9),x.push(-.12,a(),.992,o);for(const o of Y){const r=Math.round((o.l===3?20:16)*b);for(let G=0;G<r;G++){const N=-1450+2800*(G+a.range(.15,.85))/r,X=Ce(N,o);X<o.base+60||(n.push(N,X*a.range(.78,1.06),o.depth-a.range(18,40),o.S*a.range(.6,1)),x.push(a.range(-.55,.55),a(),-1,0))}}const S=Math.round(18*b);for(let o=0;o<S;o++){const r=-1350+2600*(o+a.range(.1,.9))/S;n.push(r,a.range(70,190),-a.range(50,130),a.range(48,85)),x.push(a.range(-.9,.9),a(),-1,0)}const _=ht(44),M=new e.InstancedBufferGeometry;M.index=_.index;for(const o in _.attributes)M.setAttribute(o,_.attributes[o]);M.setAttribute("iA",new e.InstancedBufferAttribute(new Float32Array(n),4)),M.setAttribute("iB",new e.InstancedBufferAttribute(new Float32Array(x),4)),M.instanceCount=n.length/4;const P=new e.Mesh(M,v.material({pattern:"volute",vmode:2,wire:2,spec:5}));P.frustumCulled=!1,P.name="storm-heads",L.add(P)}await y.yield?.();const Se={uTime:l.uTime,uDrift:l.uDrift,uGold:l.uGold,uGlint:l.uGlint,uFogAmt:l.uFogAmt},re=`
    #include <common>
    #include <fog_pars_vertex>
    uniform float uTime, uDrift;
    const float RC = ${Ze}.0;
    vec3 wallMap(vec2 sy, float depth){ float a = sy.x / RC, r = RC + depth; return vec3(r * sin(a), sy.y, RC - r * cos(a)); }
  `;if(p.rain!==!1){const n=Math.round(600*b),x=[],B=a.range(.3,.44)*(a.chance(.5)?1:-1);for(let P=0;P<n;P++){const o=a.range(-95,215);x.push(a.range(-1420,1380),o<20?a.range(95,210):a.range(120,330),o,a())}const S=new e.InstancedBufferGeometry;S.setAttribute("position",new e.Float32BufferAttribute([-1,0,0,1,0,0,1,1,0,-1,1,0],3)),S.setIndex([0,1,2,0,2,3]),S.setAttribute("iR",new e.InstancedBufferAttribute(new Float32Array(x),4)),S.instanceCount=n;const _=new e.ShaderMaterial({uniforms:e.UniformsUtils.merge([e.UniformsLib.fog,{uSlant:{value:B}}]),transparent:!0,depthWrite:!1,side:e.DoubleSide,fog:!0,vertexShader:re+`
        attribute vec4 iR; uniform float uSlant;
        varying vec3 vA; varying vec3 vWp; varying float vHalf;
        void main(){
          float top = iR.y, y = mix(-4., top, position.y);
          float sw = sin(uTime * .23 + iR.x * .004) * 30.;
          float s = iR.x + uDrift * .6 + sw + (top - y) * uSlant;
          s = mod(s + 1450., 2850.) - 1450.;
          vec3 pc = (modelMatrix * vec4(wallMap(vec2(s, y), iR.z), 1.)).xyz;
          vHalf = max(3.2, distance(pc, cameraPosition) * .004);
          vec3 p = wallMap(vec2(s + position.x * vHalf, y), iR.z);
          vA = vec3(position.x, position.y * top, iR.w);
          vec4 wp = modelMatrix * vec4(p, 1.); vWp = wp.xyz;
          vec4 mvPosition = viewMatrix * wp;
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        #include <common>
        #include <fog_pars_fragment>
        uniform float uTime, uFogAmt; uniform vec3 uGold; uniform vec4 uGlint;
        varying vec3 vA; varying vec3 vWp; varying float vHalf;
        void main(){
          float fa = max(fwidth(vA.x), 1e-5);
          float hw = max(.4 / max(vHalf, 1.), .75 * fa);
          float m = (1. - smoothstep(hw - .6 * fa, hw + .6 * fa, abs(vA.x))) * clamp(1. / hw, 0., 1.);
          float d = fract(vA.y / 85. + vA.z * 7. + uTime * (.42 + .3 * vA.z));
          m *= smoothstep(0., .06, d) * (1. - smoothstep(.5, .66, d));
          m *= .45 + .55 * smoothstep(-.2, .5, sin(vWp.x * .0047 + vWp.z * .003 - uTime * .31 + vA.z));
          if (m < .01) discard;
          float band = mod(dot(vWp.xz, uGlint.xy) - uTime * uGlint.z, max(uGlint.w, 1.)) - .5 * uGlint.w;
          float glint = exp(-band * band / 3600.);
          gl_FragColor = vec4(uGold * (1.15 + 1.3 * glint) + vec3(.3, .25, .15) * glint, m * .85);
          vec3 pre = gl_FragColor.rgb;
          #include <fog_fragment>
          gl_FragColor.rgb = mix(pre, gl_FragColor.rgb, uFogAmt);
        }`});for(const P in Se)_.uniforms[P]=Se[P];const M=new e.Mesh(S,_);M.frustumCulled=!1,M.renderOrder=2,M.name="storm-rain",L.add(M)}const ne=[];let O=null,se="";const ce=(n,x,B,S,_,M,P,o=1,r=a)=>{const G=(Z,I,ae,oe,le,Ae,ye)=>{const pe=ae-Z,ze=oe-I,Fe=Math.max(Math.hypot(pe,ze),.001),De=-ze/Fe*le,Re=pe/Fe*le,Be=n.pos.length/3,ke=pe/Fe*le*.5,Pe=ze/Fe*le*.5;n.pos.push(...x(Z-ke-De,I-Pe-Re),...x(Z-ke+De,I-Pe+Re),...x(ae+ke+De,oe+Pe+Re),...x(ae+ke-De,oe+Pe-Re)),n.aux.push(-1,B,Ae,1,B,Ae,1,B,ye,-1,B,ye),n.idx.push(Be,Be+1,Be+2,Be,Be+2,Be+3)},X=r.range(-.5,.5),H={x:S,y:_},Le=[[S,_]];for(let Z=1;Z<=11;Z++){const I=Ie(H.y,M,Z/11),ae=S+(H.y-M)/11*(X+r.range(-1.1,1.1));G(S,_,ae,I,P,(Z-1)/11,Z/11),S=ae,_=I,Le.push([S,_])}for(let Z=0;Z<4;Z++){const I=r.int(2,8);let[ae,oe]=Le[I];const le=r.sign(),Ae=r.int(3,5);for(let ye=0;ye<Ae;ye++){const pe=ae+le*r.range(18,70)*o,ze=oe-r.range(18,48)*o;G(ae,oe,pe,ze,P*.75,(I+ye)/11,(I+ye+1)/11),ae=pe,oe=ze}}return{s:Ie(H.x,S,.45),y:Ie(H.y,M,.45)}};if(p.lightning!==!1){const n={pos:[],aux:[],idx:[]},x=(r,G)=>[r,G,-140],B=n.pos,S=n.aux,_=n.idx,M=[[150,340],[-780,-640],[-360,-180],[660,860],[-1100,-940]];for(let r=0;r<5;r++){if(r>=2&&p.arm!==!1){ne.push(null);continue}ne.push(ce(n,x,r,a.range(M[r][0],M[r][1]),a.range(560,720),a.range(130,230),12))}const P=new e.BufferGeometry;P.setAttribute("position",new e.Float32BufferAttribute(B,3)),P.setAttribute("aAux",new e.Float32BufferAttribute(S,3)),P.setIndex(_),O=new e.ShaderMaterial({uniforms:e.UniformsUtils.merge([e.UniformsLib.fog,{uStrike:{value:0},uI:{value:0},uCrack:{value:0}}]),transparent:!0,depthWrite:!1,side:e.DoubleSide,fog:!0,vertexShader:re+`
        attribute vec3 aAux; varying vec3 vA;
        void main(){
          vA = aAux;
          vec4 wp = modelMatrix * vec4(wallMap(position.xy, position.z), 1.);
          vec4 mvPosition = viewMatrix * wp;
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:se=`
        #include <common>
        #include <fog_pars_fragment>
        uniform float uStrike, uI, uCrack, uFogAmt;
        varying vec3 vA;
        void main(){
          float fa = max(fwidth(vA.x), 1e-5);
          if (abs(vA.y - uStrike) > .5) discard;
          float hw = max(.22, .75 * fa);
          float core = (1. - smoothstep(hw - .6 * fa, hw + .6 * fa, abs(vA.x))) * clamp(1. / hw, 0., 1.);
          float halo = (1. - abs(vA.x)); halo *= halo;
          float grow = smoothstep(vA.z - .25, vA.z, uI * 1.3 + uCrack * 2.);
          float a = clamp(core * (uI * 1.6 + uCrack * .85) + halo * uI * .35, 0., 1.) * grow;
          if (a < .01) discard;
          gl_FragColor = vec4(mix(vec3(.93, .9, .78), vec3(1., .93, .7) * 7., uI) * core + vec3(1., .85, .5) * halo * uI * 2., a);
          vec3 pre = gl_FragColor.rgb;
          #include <fog_fragment>
          gl_FragColor.rgb = mix(pre, gl_FragColor.rgb, uFogAmt);
        }`}),O.uniforms.uTime=l.uTime,O.uniforms.uDrift=l.uDrift,O.uniforms.uFogAmt=l.uFogAmt;const o=new e.Mesh(P,O);o.frustumCulled=!1,o.renderOrder=3,o.name="storm-lightning",L.add(o)}await y.yield?.();const fe=[[520,0,130],[400,0,420],[190,0,760],[-40,0,1080],[-165,0,1350],[-133,0,1576]].map(n=>new e.Vector3(n[0],n[1],n[2])),Me=new e.CatmullRomCurve3(fe,!1,"centripetal"),ue=Me.getLength(),s=430,c=[];let d=null,i=null;if(p.fleet!==!1){const n=ut(a,C),x=60;d=new e.InstancedMesh(n.hull,v.material({edge:!0,wire:.14,spec:4}),x),i=new e.InstancedMesh(n.sails,v.material({edge:!0,sway:!0,wire:.14,spec:4,emissive:.12}),x);for(const B of[d,i])B.frustumCulled=!1,B.instanceMatrix.setUsage(e.DynamicDrawUsage),k.add(B);d.name="fleet-hulls",i.name="fleet-sails";for(let B=0;B<x;B++){const S=(B+a.range(.1,.9))/x;c.push({s0:30+S*(ue-s-60),lat:(B%2?1:-1)*a.range(7,30)*(.5+S),speed:a.range(.9,1.06),scale:a.range(1.15,1.6),ph:a.range(0,6.28),yaw:a.range(-.08,.08),heave:a.range(.35,.7)})}}let t=null,f=null,m=[];const K=new e.Vector3,A=p.armUnder??640,V=p.armEnd??0,W=p.armHeight??1,U=-a.range(1,1.3)+V*.5;if(p.arm!==!1){const B=[],S=[],_=[],P=[],o=[],r=[],G=[],N=[],X=[],H=[],Z=A,I=4,ae=[],oe=[],le=[],Ae=[],ye=[],pe=5,ze=p.armBank===!1?[]:[{back:24,lean:.3,S:80,crest:300,layer:-5.5,pos:[],uv:[],idx:[]},{back:160,lean:.36,S:120,crest:520,layer:-6.5,pos:[],uv:[],idx:[]}],Fe=p.armBillows===!1?[]:[{off:250,Hm:200,S:84,layer:-2.3,u0:.36,u1:.5},{off:440,Hm:215,S:96,layer:-2.7,u0:.46,u1:.62},{off:636,Hm:230,S:108,layer:-2.4,u0:.56,u1:.74}];for(const h of Fe)h.pos=[],h.uv=[],h.idx=[],h.top=[],h.drop=[],h.g=-1;const De=[-.6,0,.5,1],Re=(h,E,T,ge,q,R,z,F,Q,Ee,Ve)=>{const We=Math.cos(Q),be=Math.sin(Q),Te=G.length/3;for(const[Oe,_e]of[[-1.15,-1.7],[1.15,-1.7],[1.15,1.05],[-1.15,1.05]]){const g=(Oe*We-_e*be)*F,J=(Oe*be+_e*We)*F;G.push(h+ge*g+R*J*.3,E-J*.95,T+q*g+z*J*.3),N.push(Oe,_e),X.push(F,Ee,Ve,0)}H.push(Te,Te+1,Te+2,Te,Te+2,Te+3)};let Be=0,ke=0;for(let h=0;h<=72;h++){const E=h/72,T=.25+1.5*Math.pow(E,1.5),ge=(800+250*Math.sin(E*Math.PI*.8))*W,q=1-de(.84,1,E);for(let R=0;R<=3;R++){const z=R/3,F=(z-.4)*520*(.3+.7*q);B.push(Be+Math.cos(T)*F,ge-(70*(1-Math.pow(2*z-1,2))+40*z)*W,ke-Math.sin(T)*F),S.push(-900+2e3*E,z*520)}{const R=Math.cos(T),z=-Math.sin(T),F=Be+R*.12*520,Q=ke+z*.12*520,Ee=ge-92*W,Ve=Math.sin(T),We=Math.cos(T),be=de(0,.06,E)*(1-.45*de(.7,1,E))*q,Te={ex:F,ey:Ee,ez:Q,tx:Ve,tz:We,ox:R,oz:z,uk:0};ye.push(Te);const Oe=de(0,.1,E)*(1-.5*de(.72,1,E))*q,_e=de(0,.07,E)*(.08+.92*(1-de(.84,1,E)));Te.uk=Oe;for(const g of ze){const J=g.crest+g.S*1.25,me=g.pos.length/3;for(let ve=0;ve<=pe;ve++){const Ke=ve/pe,we=Ke*J*_e,xe=g.back+g.lean*we-20*Math.sin(Ke*Math.PI)*_e;g.pos.push(F-R*xe,Ee-14+we,Q-z*xe),g.uv.push(-1350+1900*E+g.back*.4,Ke*J)}if(h<72)for(let ve=0;ve<pe;ve++){const Ke=me+ve,we=Ke+pe+1;g.idx.push(Ke,we,we+1,Ke,we+1,Ke+1)}}for(const g of Fe){const J=g.pos.length/3,me=Math.min(1,g.off/Z),ve=g.off*Oe,Ke=Ee+14+(Math.sin(me*Math.PI)*26+me*14)*W;for(let we=0;we<4;we++){const xe=De[we],je=xe>0?Math.sin(xe*Math.PI)*20+xe*16:0;g.pos.push(F+R*(ve+je),Ke-xe*g.Hm*be,Q+z*(ve+je)),g.uv.push(-900+2e3*E-g.off*.9,xe*g.Hm),g.top.push(Ke),g.drop.push(xe*g.Hm*be)}if(h<72)for(let we=0;we<3;we++){const xe=J+we,je=xe+4;g.idx.push(xe,je,je+1,xe,je+1,xe+1)}}for(let g=0;g<=I;g++){const J=g/I,me=J*Z*Oe;ae.push(F+R*me,Ee+6+(Math.sin(J*Math.PI)*26+J*14)*W,Q+z*me),oe.push(-900+2e3*E,(1-J)*Z),le.push(0,-1,0)}for(let g=0;g<=2;g++){const J=g/2,me=Math.sin(J*Math.PI)*26+J*22;P.push(F+R*(me-14),Ee+10-J*150*be,Q+z*(me-14)),o.push(-900+2e3*E,J*165)}if(h<72){const g=h*3;r.push(g,g+3,g+4,g,g+4,g+1,g+1,g+4,g+5,g+1,g+5,g+2)}if(h%4===2&&h<70){const g=a.range(34,48)*(.75+.25*be)*(.5+.5*q),J=150*be*a.range(.5,.74),me=a(),ve=a.range(-.35,.35);Re(F+R*34,Ee-J,Q+z*34,Ve,We,R,z,g,ve,me,a.range(.72,1))}if(h%4===0&&h>=4&&h<70){const g=a.range(24,33)*(.75+.25*be)*(.5+.5*q),J=150*be*a.range(.16,.34),me=a(),ve=a.range(-.3,.3);Re(F+R*25,Ee-J,Q+z*25,Ve,We,R,z,g,ve,me,a.range(.6,.9))}}h<72&&(Be+=Math.sin(T)*2e3/72,ke+=Math.cos(T)*2e3/72)}K.set(Be,900*W,ke);{const h=ye[72];Re(h.ex+h.tx*12,h.ey+4,h.ez+h.tz*12,h.tx,h.tz,h.ox,h.oz,62,-Math.PI/2,.37,.95)}for(let h=0;h<72;h++)for(let E=0;E<3;E++){const T=h*4+E,ge=T+1,q=T+3+1,R=q+1;_.push(T,q,R,T,R,ge)}for(let h=0;h<72;h++)for(let E=0;E<I;E++){const T=h*(I+1)+E,ge=T+1,q=T+I+1,R=q+1;Ae.push(T,q,R,T,R,ge)}const Pe=new e.BufferGeometry;Pe.setAttribute("position",new e.Float32BufferAttribute(B,3)),Pe.setAttribute("uv",new e.Float32BufferAttribute(S,2)),Pe.setAttribute("aCol",new e.Float32BufferAttribute(new Float32Array(B.length).fill(1),3)),Pe.setIndex(_),Pe.computeVertexNormals();const Je=new e.Mesh(Pe,v.material({pattern:"ruyi",wire:2.2,spec:4,graze:!0,lay:[82*a.range(.9,1.15),400,40,-2.5]}));Je.frustumCulled=!1,Je.name="storm-arm",t=new e.Group,et(-1380,0,130,t.position),t.add(Je),L.add(t);{const h=new e.BufferGeometry;h.setAttribute("position",new e.Float32BufferAttribute(ae,3)),h.setAttribute("uv",new e.Float32BufferAttribute(oe,2)),h.setAttribute("normal",new e.Float32BufferAttribute(le,3)),h.setAttribute("aCol",new e.Float32BufferAttribute(new Float32Array(ae.length).fill(1),3)),h.setIndex(Ae);const E=new e.Mesh(h,v.material({pattern:"ruyi",wire:1.8,spec:3,graze:!0,grazeRange:[.5,.8],lay:[66,3200,84,-2.6]}));f=E.material.uniforms.uLay.value,E.frustumCulled=!1,E.name="storm-arm-underside",t.add(E);const T=new e.BufferGeometry;T.setAttribute("position",new e.Float32BufferAttribute(P,3)),T.setAttribute("uv",new e.Float32BufferAttribute(o,2)),T.setAttribute("aCol",new e.Float32BufferAttribute(new Float32Array(P.length).fill(1),3)),T.setIndex(r),T.computeVertexNormals();const ge=new e.Mesh(T,v.material({pattern:"ruyi",wire:1.6,spec:4,graze:!0,lay:[42,120,-60,-3.5]}));ge.frustumCulled=!1,ge.name="storm-arm-face",t.add(ge);const q=new e.BufferGeometry;q.setAttribute("position",new e.Float32BufferAttribute(G,3)),q.setAttribute("uv",new e.Float32BufferAttribute(N,2)),q.setAttribute("aCol",new e.Float32BufferAttribute(new Float32Array(G.length).fill(1),3)),q.setAttribute("aLay",new e.Float32BufferAttribute(X,4)),q.setIndex(H),q.computeVertexNormals();const R=new e.Mesh(q,v.material({pattern:"volute",vmode:8,wire:1.6,spec:4}));R.frustumCulled=!1,R.name="storm-arm-heads",t.add(R);for(const z of ze){const F=new e.BufferGeometry;F.setAttribute("position",new e.Float32BufferAttribute(z.pos,3)),F.setAttribute("uv",new e.Float32BufferAttribute(z.uv,2)),F.setAttribute("aCol",new e.Float32BufferAttribute(new Float32Array(z.pos.length).fill(1),3)),F.setIndex(z.idx),F.computeVertexNormals();const Q=new e.Mesh(F,v.material({pattern:"ruyi",wire:1.8,spec:4,graze:!0,lay:[z.S,z.crest,-34,z.layer]}));Q.frustumCulled=!1,Q.name="storm-arm-bank",t.add(Q)}for(const z of Fe){const F=new e.BufferGeometry;z.attr=new e.Float32BufferAttribute(z.pos,3),z.attr.setUsage(e.DynamicDrawUsage),F.setAttribute("position",z.attr),F.setAttribute("uv",new e.Float32BufferAttribute(z.uv,2)),F.setAttribute("aCol",new e.Float32BufferAttribute(new Float32Array(z.pos.length).fill(1),3)),F.setIndex(z.idx),F.computeVertexNormals();const Q=new e.Mesh(F,v.material({pattern:"ruyi",wire:1.8,spec:4,graze:!0,lay:[z.S,z.Hm-1.1*z.S,-.35*z.S,z.layer]}));Q.frustumCulled=!1,Q.name="storm-arm-billow",t.add(Q)}m=Fe}if(O){const h={pos:[],aux:[],idx:[]},E=Fe.length>0;(E?[60,46,43]:[36,29,43]).forEach((R,z)=>{const F=ye[R],Q=E?Fe[0].off*F.uk+46:54,Ee=E?-100:0,Ve=(be,Te)=>[F.ex+F.tx*be+F.ox*Q,F.ey+Ee+Te,F.ez+F.tz*be+F.oz*Q],We=ce(h,Ve,2+z,a.range(-90,90),4,-a.range(175,225),8,.7);ne[2+z]={arm:!0,p:new e.Vector3(...Ve(We.s,We.y))}});const T=new e.BufferGeometry;T.setAttribute("position",new e.Float32BufferAttribute(h.pos,3)),T.setAttribute("aAux",new e.Float32BufferAttribute(h.aux,3)),T.setIndex(h.idx);const ge=new e.ShaderMaterial({uniforms:O.uniforms,transparent:!0,depthWrite:!1,side:e.DoubleSide,fog:!0,vertexShader:`
          #include <common>
          #include <fog_pars_vertex>
          attribute vec3 aAux; varying vec3 vA;
          void main(){
            vA = aAux;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
            gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:se}),q=new e.Mesh(T,ge);q.frustumCulled=!1,q.renderOrder=3,q.name="storm-arm-lightning",t.add(q)}K.add(t.position)}if(O){const n=a.fork?a.fork("ct-strike5"):a,x={pos:[],aux:[],idx:[]};ne[5]=ce(x,(_,M)=>[_,M,-140],5,n.range(-1185,-1150),n.range(600,680),n.range(150,210),12,1,n);const B=new e.BufferGeometry;B.setAttribute("position",new e.Float32BufferAttribute(x.pos,3)),B.setAttribute("aAux",new e.Float32BufferAttribute(x.aux,3)),B.setIndex(x.idx);const S=new e.Mesh(B,O);S.frustumCulled=!1,S.renderOrder=3,S.name="storm-lightning-5",L.add(S)}let D=-1;const te=new e.Object3D;te.rotation.order="YXZ";const j=new e.Vector3,ie=new e.Vector3,he=new e.Vector3,Ue=n=>n*n*(3-2*n);function Ne(n,x,B){const S=D>=0?D:x%Qe/Qe;v.update(x),l.uSpin.value=u+w*x*.012,l.uDrift.value=w*x*2.2,L.position.z=ee*S,t&&(t.rotation.y=Ie(U,V,de(0,1,S))),f&&(f.z=84+A-Ie(Math.min(120,A),A,de(.45,.8,S)));for(let o=0;o<m.length;o++){const r=m[o],G=de(r.u0,r.u1,S);if(G===r.g)continue;r.g=G;const N=r.attr.array,X=r.top.length;for(let H=0;H<X;H++)N[H*3+1]=r.top[H]-r.drop[H]*G;r.attr.needsUpdate=!0}let _=0,M=0,P=0;for(let o=0;o<tt.length;o++){const r=(S-tt[o])*Qe;r<0||r>4||(P=o,_=r<.25?Ue(r/.25):r<.85?1-Ue((r-.25)/.6):0,M=de(.1,.3,r)*(1-de(.85,3.85,r)))}if(O){O.uniforms.uStrike.value=P,O.uniforms.uI.value=_,O.uniforms.uCrack.value=M;const o=ne[P];l.uFlash.value.w=o?_*.9+M*.08:0,o&&o.arm?(l.uFlashUv.value.set(-1e5,0,300),he.copy(o.p).applyMatrix4(t.matrixWorld)):o&&(l.uFlashUv.value.set(o.s,o.y,250),et(o.s,o.y,-140,he).applyMatrix4(L.matrixWorld)),l.uFlash.value.x=he.x,l.uFlash.value.y=he.y,l.uFlash.value.z=he.z}if(d){for(let o=0;o<c.length;o++){const r=c[o],G=Math.min(r.s0+S*s*r.speed,ue-1),N=G/ue;Me.getPointAt(N,j),Me.getTangentAt(N,ie),te.position.set(j.x+ie.z*r.lat,Math.sin(x*.8+r.ph)*r.heave-.2,j.z-ie.x*r.lat),te.rotation.set(Math.sin(x*.8+r.ph+1.3)*.05,Math.atan2(ie.x,ie.z)+r.yaw+Math.sin(x*.21+r.ph)*.05,0),te.scale.setScalar(r.scale),te.updateMatrix(),d.setMatrixAt(o,te.matrix),i.setMatrixAt(o,te.matrix)}d.instanceMatrix.needsUpdate=!0,i.instanceMatrix.needsUpdate=!0}}Ne(0,0,null);const $e=et(0,Ge,-70),qe=fe[fe.length-1],He=[[430,3.2,330],[330,3.2,600],[130,3.2,900],[-90,3.2,1180],[-215,3.2,1400],[-190,3.2,1600]].map(n=>new e.Vector3(n[0],n[1],n[2])),Ye={hub:$e,entryView:{position:new e.Vector3(0,3.2,1701),target:new e.Vector3(-420,180,600)},fleetFile:fe.map(n=>n.clone()),fleetHead:qe.clone(),flyThrough:He,portalSeat:{position:new e.Vector3(qe.x,8,qe.z+60),facing:new e.Vector3(.2,0,-.98).normalize()},viewpoints:[{position:new e.Vector3(0,3.2,1701),target:$e.clone()},{position:new e.Vector3(260,6,520),target:new e.Vector3(-200,330,60)},{position:new e.Vector3(-900,40,1500),target:new e.Vector3(200,420,100)}],armTip:K};return{object:k,radius:1080,height:950,center:new e.Vector3(0,400,250),anchors:Ye,enamel:v,setProgress(n){D=n==null||n<0?-1:nt(n,0,1)},setSun(n){l.uSun.value.copy(n).normalize()},update:Ne,dispose(){},ground:!0,groundY:-1.5}}export{mt as buildHero,ft as createEnamel,at as enamelize,ut as makeJunkGeometries};
