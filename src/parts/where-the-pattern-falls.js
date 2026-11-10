import*as t from"three";const bt=["#D8A837","#F4DC92","#7E5F1A","#16130F","#F5F1E7","#C3476C","#2C58AA"],$=Math.PI*2;function xe(c){const o=new t.Color(c);return new t.Vector3(o.r,o.g,o.b)}const we=`
  #define TAU 6.2831853
  uniform vec3 uInk[14];   // 0 gold 1 pale gold 2 dark gold 3 black 4 white 5 rose 6 cobalt 7 silver 8 malachite 9 umber 10 bole 11 pool 12 mean gold 13 gold step 2
  uniform float uTime;
  float h11(float p){ p=fract(p*.1031); p*=p+33.33; p*=p+p; return fract(p); }
  float h21(vec2 p){ vec3 p3=fract(vec3(p.xyx)*.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
  vec2 h22(vec2 p){ vec3 p3=fract(vec3(p.xyx)*vec3(.1031,.1030,.0973)); p3+=dot(p3,p3.yzx+33.33); return fract((p3.xx+p3.yz)*p3.zy); }
  vec3 inkAt(float i){ int k=int(clamp(i+.5,0.,13.)); return uInk[k]; }
  float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
    return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x), mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x), f.y); }
`,tt=`
  float edge(float d, float aa){ return smoothstep(-aa, aa, d); }
  vec3 motifW(vec2 uv, float id, float aa, float t){
    float a = max(aa, 1e-4) * .75;
    if (id < .5) {                       // chequer with a small counter-square in every fourth field
      float su = edge(.25 - abs(fract(uv.x*.5) - .5), a*.5), sv = edge(.25 - abs(fract(uv.y*.5) - .5), a*.5);
      float c = mix(su, 1. - su, sv);
      vec2 g = floor(uv), q = abs(fract(uv) - .5);
      float dot2 = edge(.17 - max(q.x, q.y), a) * step(.5, fract((g.x + g.y*2.)*.25 + .1));
      return mix(vec3(1. - c, c, 0.), vec3(0., 0., 1.), dot2);
    } else if (id < 1.5) {               // bars: broad, narrow, and a pinstripe of the third ink
      float x = fract(uv.x*.5)*2.;
      float b1 = edge(.5 - abs(x - .55), a), pin = edge(.07 - abs(x - 1.5), a);
      float yb = edge(.42 - abs(fract(uv.y*.25 + floor(uv.x*.5)*.37) - .5), a*.25);
      return vec3((1. - b1)*(1. - pin) , b1*yb, pin + b1*(1. - yb));
    } else if (id < 2.5) {               // bricks: long rectangles in running bond, no joint
      float row = floor(uv.y*2.); float x = uv.x*.5 + row*.5*.618;
      float k = h21(vec2(floor(x), row));
      float ex = min(fract(x), 1. - fract(x))*2., ey = min(fract(uv.y*2.), 1. - fract(uv.y*2.))*.5;
      float inset = edge(min(ex, ey) - .09, a);
      vec3 w = k < .42 ? vec3(1., 0., 0.) : (k < .8 ? vec3(0., 1., 0.) : vec3(0., 0., 1.));
      return mix(vec3(1., 0., 0.), w, inset);
    } else if (id < 3.5) {               // scales: overlapping discs in offset rows, each with a ring
      vec2 p = vec2(uv.x, uv.y*1.6); float row = floor(p.y);
      vec2 f = vec2(fract(p.x + row*.5) - .5, fract(p.y));
      vec2 f2 = vec2(fract(p.x + (row + 1.)*.5) - .5, fract(p.y) - 1.);
      float d1 = length(vec2(f.x, f.y/1.6 + .1)), d2 = length(vec2(f2.x, f2.y/1.6 + .1));
      float d = d2 < .52 ? d2 : d1;
      float ring = edge(.07 - abs(d - .36), a), core = edge(.16 - d, a);
      return vec3((1. - ring)*(1. - core), ring, core);
    } else if (id < 4.5) {               // ringed eyes on a half-drop grid
      vec2 p = uv*.8; float col = floor(p.x); p.y += col*.5;
      vec2 f = fract(p) - .5; float d = length(f);
      float k = h21(vec2(col, floor(p.y)));
      float r1 = edge(.44 - d, a), r2 = edge(.33 - d, a), r3 = edge(.2 + .05*sin(t*.4 + k*TAU) - d, a), r4 = edge(.09 - d, a);
      vec3 w = vec3(1., 0., 0.);
      w = mix(w, vec3(0., 0., 1.), r1); w = mix(w, vec3(0., 1., 0.), r2);
      w = mix(w, k < .5 ? vec3(1., 0., 0.) : vec3(0., 0., 1.), r3); w = mix(w, vec3(0., 1., 0.), r4);
      return w;
    } else if (id < 5.5) {               // spirals: one slow-winding whorl per cell
      vec2 p = uv*.6; vec2 g = floor(p); vec2 f = fract(p) - .5; float d = length(f);
      float k = h21(g); float dir = k < .5 ? 1. : -1.;
      float ang = atan(f.y + 1e-5, f.x + 1e-5)/TAU;
      float s = fract(ang*dir + d*(3.2 + sin(t*.25 + k*TAU)*.7) + k + t*.03);
      float arm = edge(.25 - abs(s - .5), a*(1.5 + .25/max(d, .05)));
      float disc = edge(.46 - d, a), core = edge(.07 - d, a);
      vec3 w = mix(vec3(1., 0., 0.), vec3(0., 1., 0.), arm);
      w = mix(w, vec3(0., 0., 1.), core);
      return mix(vec3(0., 0., 1.)*.0 + vec3(1., 0., 0.), w, disc);
    } else if (id < 6.5) {               // triangles, point down, alternate rows shifted
      float row = floor(uv.y); vec2 f = vec2(fract(uv.x + row*.5), fract(uv.y));
      float tri = edge(f.y*.5 - abs(f.x - .5) , a);
      float k = h21(vec2(floor(uv.x + row*.5), row));
      return mix(vec3(1., 0., 0.), k < .7 ? vec3(0., 1., 0.) : vec3(0., 0., 1.), tri);
    }
    float y = uv.y + .22*sin(uv.x*TAU*.5 + t*.3);   // waves in three bands
    float f = fract(y*.5)*2.;
    float b1 = edge(.33 - abs(f - .4), a), b2 = edge(.12 - abs(f - 1.25), a);
    float pinl = edge(.03 - abs(f - .4), a) + edge(.045 - abs(fract(uv.x*2. + .5*floor(y*.5)) - .5), a*2.) * edge(.05 - abs(f - 1.72), a);
    b2 = max(b2, min(pinl, 1.));
    return vec3((1. - b1)*(1. - b2), b1*(1. - b2), b2);
  }
  vec3 motifAvg(float id){
    if (id < .5) return vec3(.47, .47, .06); if (id < 1.5) return vec3(.45, .40, .15); if (id < 2.5) return vec3(.55, .28, .17);
    if (id < 3.5) return vec3(.56, .30, .14); if (id < 4.5) return vec3(.48, .30, .22); if (id < 5.5) return vec3(.62, .34, .04);
    if (id < 6.5) return vec3(.5, .35, .15); return vec3(.55, .33, .12);
  }
`,at=`
  attribute vec2 aE;                 // x: metres to the nearest contour edge of the face (big if none), y: 1 on tooled piers
  uniform float uMode; uniform vec3 uCamL;
  varying vec3 vP; varying vec3 vN; varying vec2 vE;
  void main(){
    vP = position; vN = normal; vE = aE;
    vec4 mv = modelViewMatrix * vec4(position, 1.);
    gl_Position = projectionMatrix * mv;
    if (uMode > 1.5) gl_Position.z = gl_Position.w * .9999;
  }`,ot=`
  precision highp float;
  ${we}
  ${tt}
  uniform float uMode, uLeaf, uHiCos, uWalk, uSd; uniform vec3 uSheen; uniform vec4 uCalm; uniform float uDull;
  uniform vec3 uCamL, uWindow, uWindowSky, uHi, uTool, uStep[6], uSeamCol; uniform float uSeamInk, uSeamW, uBoleW, uGold, uPierLift;
  varying vec3 vP; varying vec3 vN; varying vec2 vE;
  float lineCov(float d, float w, float px){ return clamp((w - d) / max(px, 1e-5) + .5, 0., 1.); }
  vec3 rampAt(float i){ return i < .5 ? uStep[0] : (i < 1.5 ? uStep[1] : (i < 2.5 ? uStep[2] : (i < 3.5 ? uStep[3] : uStep[4]))); }
  // a compass-struck whorl: rings every half metre out to 1.5 m and a petalled ring; x = the struck line, y = its pale crescent
  vec2 whorl(vec2 c, float kind, float pw, float px){
    float r = length(c);
    float rr = abs(fract(clamp(r, 0., 1.5) * 2.) - .5) * .5;
    float ring = lineCov(rr, pw, px) * step(r, 1.62);
    float ang = atan(c.y + 1e-5, c.x + 1e-5);
    float pet = lineCov(abs(r - (.75 + .5 * abs(sin(ang * 4. + kind * 40.)))), pw, px) * step(r, 1.5);
    vec2 c2 = c - vec2(pw, -pw) * 1.2; float rr2 = abs(fract(clamp(length(c2), 0., 1.5) * 2.) - .5) * .5;
    return vec2(max(ring, pet), lineCov(rr2, pw, px) * step(length(c2), 1.62) * (1. - ring));
  }
  // the far-view whorl: three struck rings that fill the leaf (5 m), a pale crescent inside each; x = the line, y = its crescent
  vec2 farWhorl(vec2 c, float pw, float px){
    float r = length(c), ring = lineCov(abs(mod(r, 1.65) - .825), pw, px) * step(r, 4.95);
    vec2 c2 = c - vec2(pw, -pw) * 1.3; float r2 = length(c2);
    return vec2(ring, lineCov(abs(mod(r2, 1.65) - .825), pw, px) * step(r2, 4.95) * (1. - ring));
  }
  float meadowHalf(float z){
    float pool = 100. * (.55 + .45 * smoothstep(-6., 42., z));
    float w = pool + 10. * smoothstep(70., 150., z) - 16. * smoothstep(170., 300., z) * (1. - smoothstep(300., 420., z)) + 60. * smoothstep(330., 520., z);
    return w * (1. - .95 * smoothstep(470., 700., z));
  }
  float meadowMid(float z){ return 46. * sin((z - 330.) * .0105) * smoothstep(330., 430., z); }
  float bankD(vec2 xz){                                              // metres outside the outline of the pool and the meadow's bed (as the bed draws it)
    vec2 q = abs(vec2(xz.x, xz.y - 30.)) - vec2(100., 80.) + 46.;
    float d = length(max(q, 0.)) + min(max(q.x, q.y), 0.) - 46.;
    float dB = xz.y > 64. ? max(abs(xz.x - meadowMid(xz.y)) - meadowHalf(xz.y) - 5. - 3. * sin(xz.y * .11), xz.y - 699.) : 1e3;
    return min(d, dB);
  }
  float riverBank(vec2 xz){                                          // metres outside the river's gilded bank panel, on the plateau
    float zeta = clamp((xz.y + 420.) / 420., 0., 1.);
    float hw = 36.5 + 55. * pow(max(zeta, 1e-4), 1.6) + 2.5 * smoothstep(.9, 1., zeta);
    return max(abs(xz.x), length(vec2(xz.x, min(xz.y + 420., 0.) * 1.6))) - hw - 3.4;
  }
  // ---- THE SECOND SCALE (fifth round, round 4a): curls, swags and bands inlaid in the sheet, flat ink ----
  // a field of great curls struck into the gold (the scroll trees' volutes, 20 m across): c in metres, cs = the cell
  float curls(vec2 c, float cs, float wm, float px, out vec2 ctr, out float kk){
    vec2 p = c / cs; p.y += .5 * floor(p.x);
    vec2 g = floor(p), f = fract(p) - .5; float d = length(f), k = h21(g + 17.7), dir = k < .5 ? 1. : -1.;
    ctr = vec2(g.x + .5, g.y + .5 - .5 * g.x) * cs; kk = h21(g * 1.9 + 3.3);
    float s = fract(atan(f.y + 1e-5, f.x + 1e-5) / TAU * dir + d * 3. + k);
    float sc = 3. / cs;
    return clamp((wm * sc * .5 - abs(s - .5)) / max(px * sc, 1e-5) + .5, 0., 1.) * step(d, .47) * step(.05, d);
  }
  // THE INLAID BANDS (the "swags" of round 4a; the first crew's ruling of 2026-10-06, round 4b): five tiers lie right across
  // each flank IN the plane of the cliff, three of flat pattern (0, 2, 4) between two of the bare leaf (1, 3). Each lower
  // edge is a drawn, scalloped line that dips in long unequal waves: a shape, fixed, with no time in it. Nothing stands, tapers
  // or is capped, no two flanks and no stack of edges share a vertical axis, and the tiers run the whole length of the flank.
  // The pattern tiers are trimmed (round 4b: .165, .425, .825) so that ink is two fifths of a flank and under 44 percent of
  // what any view shows of one. p = metres along the flank from the falls' border, and height (12 to 231 m: the top tier stops
  // 19 m under the brink). Returns the tier (0..4) and metres above that tier's lower edge.
  vec2 swagAt(vec2 p, float side){
    float t = clamp((p.y - 12.) / 219., 0., 1.), x = p.x, k = side * 3.7;
    float s1 = abs(sin(x * .145 + k)), s2 = abs(sin(x * .17 + 1.1 - k)), s3 = abs(sin(x * .125 + 2.3 + k)), s4 = abs(sin(x * .19 + .7));
    float h1 = .165 + .04 * sin(x * .019 + 1.3 + k) + .015 * sin(x * .047 - k * 2.) - .042 * s1;
    float h2 = .425 + .04 * sin(x * .027 + 4.1 - k) + .015 * sin(x * .061 + k) - .042 * s2;
    float h3 = .60 + .04 * sin(x * .023 + 2.6 + k * 2.) + .015 * sin(x * .053 + 1.9) - .042 * s3;
    float h4 = .825 + .035 * sin(x * .031 + .4 - k) + .015 * sin(x * .043 + k * 3.) - .042 * s4;
    float ti = step(h1, t) + step(h2, t) + step(h3, t) + step(h4, t);
    float hb = ti < .5 ? -1. : (ti < 1.5 ? h1 : (ti < 2.5 ? h2 : (ti < 3.5 ? h3 : h4)));
    return vec2(ti, (t - hb) * 219.);
  }
  // the ink of a patterned tier (0, 2, 4; tiers 1 and 3 are the gold leaf itself): on the flank by the whorl robe triangles,
  // chequers and bars in black, white and silver; on the flank by the dark robe spirals and ringed rounds in the scheme's colours
  // (round 4b) The inlay does not move: the motif is drawn at time 0. Seen along the face a pixel covers many times more wall
  // one way than the other, so the motif is taken at four points along the pixel's long axis (mj, in motif units) and each is
  // softened only by aaT, the larger of the short axis and a quarter of the long one: edges stay drawn, nothing smears, and
  // under 4 pixels a motif on the long axis the tier is its flat average ink.
  vec3 swagInk(vec2 uv, float ti, float bright, float mpx, vec2 mj, float aaT){
    vec4 pt;
    if (bright < .5) pt = ti < .5 ? vec4(6., 3., 4., 7.) : (ti < 2.5 ? vec4(0., 3., 7., 4.) : vec4(1., 3., 7., 4.));
    else pt = ti < .5 ? vec4(5., 6., 0., 4.) : (ti < 2.5 ? vec4(4., 5., 0., 6.) : vec4(5., 8., 0., 5.));
    vec3 w = vec3(0.);
    for (int i = 0; i < 4; i++) w += motifW(uv + mj * (float(i) * .25 - .375), pt.x, aaT, 0.);
    w *= .25;
    w = mix(motifAvg(pt.x), w, smoothstep(4., 9., mpx));
    return inkAt(pt.y) * w.x + inkAt(pt.z) * w.y + inkAt(pt.w) * w.z;
  }
  void main(){
    vec3 n0, T, B; vec2 q; float cols = 1.;
    if (uMode > 1.5) {
      vec3 d = normalize(vP + vec3(1e-4));
      float R = 420.; float el = asin(clamp(d.y, -1., 1.));
      float row = floor(el * R / uLeaf), bandR = floor(row / 5.) * 5.;      // five courses to a band share their columns: squares stack on squares
      cols = max(6., floor(TAU * R * cos((bandR + 2.5) * uLeaf / R) / uLeaf));
      float az = atan(d.x + 1e-5, d.z + 1e-5) / TAU;                        // 0 downstream, where every band lines up
      q = vec2(az * cols + 1000., el * R / uLeaf);
      n0 = -d; T = normalize(vec3(d.z, 0., -d.x) + vec3(1e-4, 0., 0.)); B = cross(T, n0);
    } else {
      n0 = normalize(vN + vec3(0., 1e-5, 0.));
      if (abs(n0.y) > .7) { T = vec3(1., 0., 0.); B = vec3(0., 0., 1.); q = vP.xz / uLeaf; }
      else { T = normalize(vec3(n0.z, 0., -n0.x)); B = vec3(0., 1., 0.); q = vec2(dot(vP, T), vP.y) / uLeaf; }
    }
    vec2 cell = floor(q), f = fract(q), m = f * uLeaf;
    float lx = length(dFdx(vP)), ly = length(dFdy(vP));
    float px = max(max(lx, ly), 1e-4);                               // metres of leaf per pixel (the coarser axis)
    float leafPx = uLeaf / max(sqrt(lx * ly), 1e-4);                 // leaf size in pixels (by area)
    vec2 hh = h22(cell + 11.3); float bias = h21(cell * 1.7 + 4.1), kind = h21(cell * 2.3 + 9.7);
    vec3 n = normalize(n0 + (T * (hh.x - .5) + B * (hh.y - .5)) * .14);
    vec3 zone = vec3(0.);
    float a, camD = 1e4, hiSel = 0.; vec2 dqA = cell * .115, dqB = cell * .041;     // where the broad drifts of tone are read: several leaves wide
    if (uMode > 1.5) {
      vec3 ws = normalize(uWindowSky + .22 * vec3(sin(uCamL.z / 90.), sin(uCamL.y / 70.) * .6, cos(uCamL.x / 75. + uCamL.z / 130.)));
      float elc = (cell.y + .5) * uLeaf / 420., phc = (cell.x + .5 - 1000.) / max(cols, 1.) * TAU;
      vec3 dc = vec3(sin(phc) * cos(elc), sin(elc), cos(phc) * cos(elc));
      a = dot(normalize(dc + (T * (hh.x - .5) + B * (hh.y - .5)) * .09), ws);
      // THE BLAZE (round 4b): the one leaf the mirror direction falls in, and while that direction is within a seventh of a
      // leaf of the leaf's side the next leaf of the same course with it: one leaf, two as it hands over, never more
      float hx = atan(ws.x + 1e-5, ws.z + 1e-5) / TAU * cols + 1000. - (cell.x + .5); hx -= cols * floor(hx / cols + .5);
      hiSel = step(abs(hx), .64) * step(abs(asin(clamp(ws.y, -1., 1.)) * 420. / uLeaf - (cell.y + .5)), .5);
      dqA = dc.xz * 4.4 + dc.y * 2.7; dqB = dc.xz * 1.6 + dc.y * 1.1;      // on the dome the drifts follow direction, so they run unbroken across the bands
      // the sky's three quarters (by the leaf's own bearing, 0 downstream, + toward the dark robe): dotted, curled, ringed
      float azL = mod(phc * uSd + 3.14159265, TAU) - 3.14159265, elK = smoothstep(.1, .26, elc);
      zone = vec3((1. - smoothstep(.75, 1.2, abs(azL))) * elK, smoothstep(.75, 1.2, azL) * (1. - smoothstep(2.5, 2.95, azL)), smoothstep(.75, 1.2, -azL) * (1. - smoothstep(2.5, 2.95, -azL)) * elK);
    } else {
      vec3 cL = vP + (T * (.5 - f.x) + B * (.5 - f.y)) * uLeaf;  // the leaf's centre: one value for the whole leaf
      vec3 Vc = normalize(uCamL - cL + vec3(1e-4)); camD = length(uCamL - cL);
      a = dot(reflect(-Vc, n), uWindow);
      // on the land every leaf whose mirror direction meets the window blazes (a > uHiCos), as before round 4b
      hiSel = step(uHiCos, a);
    }
    // one number per leaf: a walking hash (steps wander as the eye moves) lifted by the sheen, a broad burnished
    // zone round the mirror direction where pale leaves gather and the blazing one sits. Still one flat step a leaf.
    float s0 = abs(fract(bias + a * uWalk + uTime * .003) * 2. - 1.);     // and the sheet breathes: a leaf now and then changes its step even when the eye is still
    float sh = smoothstep(uSheen.x, 1., a); sh = sh * (.45 + .55 * sh);
    // A calm sheet (uCalm: how much of the ramp a single leaf's own hash spans away from and inside the sheen, how much
    // the drifts span, and which drift): neighbouring leaves keep within a step and tone moves in broad slow drifts, so
    // the pale steps are found only in the burnished quarter. Lacquer keeps its own scatter (black on black hides it).
    float driftN = .62 * vnoise(dqA + 7.3 + vec2(uTime * .006, uTime * .004)) + .38 * vnoise(dqB + 3.1 - vec2(uTime * .002, 0.));
    float drift = mix(vnoise(cell * .27 + 7.3), clamp((driftN - .5) * 1.3 + .5, 0., 1.), uCalm.w);
    float s = s0 * mix(uCalm.x, uCalm.y, sh) + uSheen.y * sh + uSheen.z + (drift - .5) * uCalm.z
      - uDull * (1. - smoothstep(-.65, .15, a));                              // and the side turned from the window is a step duller, in the same broad drifts
    float stepI = s < .29 ? 0. : (s < .52 ? 1. : (s < .8 ? 2. : (s < .935 ? 3. : 4.)));
    stepI = max(stepI, uPierLift * step(.5, vE.y));                  // lacquer: the tooled piers stay gold
    // overlapped seam on two edges: one step paler
    // the rare gold rank: behind gold tiles the cliff's leaves go to the two darkest steps, so every tile stands off the wall
    if (uMode < 1.5 && abs(n0.z) > .7 && vE.y < .5 && abs(vP.x) < 93. && abs(vP.z) < 1.) {
      float sHere = clamp((250. - (cell.y + .5) * uLeaf) / 250., 0., 1.);
      stepI = mix(stepI, min(floor(stepI * .5), 1.), step(1. + sHere, uGold));
    }
    // the overlapped seam on two edges is one step paler. In gold it is never thinner than a pixel and a quarter, so from far
    // off the sheet is ruled in pale overlaps (the dark hairline is lacquer's own).
    float gilt = 1. - uSeamInk;
    float seamW = mix(uSeamW, max(uSeamW, px * 1.25), gilt);
    float seam = max(lineCov(m.x, seamW, px), lineCov(m.y, seamW, px));
    vec3 dark = uStep[0], g1 = uStep[1], g2 = uStep[2], g3 = uStep[3], g4 = uStep[4];
    vec3 col = rampAt(stepI);
    col = mix(col, rampAt(stepI < 3.5 ? stepI + 1. : 3.), seam * gilt);    // (on the palest leaf the overlap is the step below: still a pale rule)
    col = mix(col, mix(uSeamCol, uInk[13], sh), seam * uSeamInk);          // lacquer: a dim hairline that turns gold only in the burnished zone
    // brushed streaks, 16 to 1, in four flat bands: five percent, and twice that where the burnish lies across them
    vec2 sm = kind < .5 ? m : m.yx;
    float streak = vnoise(vec2(sm.x * .55, sm.y * 9.) + cell * 3.1);
    col *= 1. + (floor(streak * 4.) / 3. - .5) * (.09 + .11 * sh * gilt) * smoothstep(8., 30., leafPx);
    // punched tooling: a compass-struck whorl on one leaf in nine (one in five on the cliff), a row of punch dots on others.
    // Far off the same whorl is struck 3.2 times as large, as the hills' motifs and the far tiles are, so the panel is still
    // worked from 300 m; and where the burnish lies on a mid-toned leaf the struck lines catch pale instead of dark.
    float tool = smoothstep(30., 70., leafPx), tooled = step(.5, vE.y);
    float cliffK = (uMode < 1.5 && abs(n0.y) < .7) ? 1. : 0.;
    float pw = max(.035, px * .8);
    vec2 c = m - uLeaf * .5;
    vec3 toolInk = mix(uTool, g4, smoothstep(.15, .5, sh) * step(stepI, 2.5) * gilt);
    if (kind > mix(mix(.89, .8, cliffK), .45, tooled)) {
      vec2 wn = whorl(c, kind, pw, px);
      // far off, on fewer leaves, the whorl is struck leaf-wide: line work one step darker than its leaf (pale where the burnish lies)
      vec2 wf = farWhorl(c, max(.2, px * .7), px) * step(mix(.92, .84, cliffK), kind) * (1. - smoothstep(70., 150., leafPx)) * smoothstep(6., 12., leafPx) * gilt;
      vec3 farInk = mix(mix(stepI > .5 ? rampAt(stepI - 1.) : uStep[0] * .86, uTool, .7), g4, smoothstep(.15, .5, sh) * step(stepI, 2.5));
      col = mix(col, g4, wf.y * .7); col = mix(col, farInk, wf.x * .9);
      col = mix(col, g4, wn.y * tool * .9); col = mix(col, toolInk, wn.x * tool);
    } else if (kind < mix(.16, .4, tooled)) {
      vec2 pm = kind < .08 ? m : m.yx;
      vec2 pd = vec2(fract(pm.x / .75) * .75 - .375, pm.y - (1.1 + h11(kind * 91.) * 2.));
      float dd = abs(length(pd) - .16);
      float ring = lineCov(dd, pw, px), cres = lineCov(abs(length(pd - vec2(pw, -pw)) - .16), pw, px) * (1. - ring);
      col = mix(col, g4, cres * tool * .9); col = mix(col, toolInk, ring * tool);
    }
    // (round 4d) a pier is worked all over: three more punched rows to a leaf, struck where the leaf is passed at arm's length
    // (a leaf over 110 px), so the face of a pier a few metres off is still tooled gold and never a bare sheet
    if (tooled > .5) {
      vec2 pr = vec2(fract(m.x / .75) * .75 - .375, mod(m.y, 3.) - 1.5);
      float rowK = step(3., m.y) * smoothstep(110., 200., leafPx);
      float ringP = lineCov(abs(length(pr) - .16), pw, px), cresP = lineCov(abs(length(pr - vec2(pw, -pw)) - .16), pw, px) * (1. - ringP);
      col = mix(col, g4, cresP * rowK * .9); col = mix(col, toolInk, ringP * rowK);
      // and nearer still (a leaf over 300 px: the pass in front of the falls goes by a pier 4 to 9 m off) the ground between
      // those rows is punched too: a small ring every 0.75 m in each metre row, alternate rows set half a step along, and a
      // ruled double line half a metre inside the leaf's edge. All of it tooling in the leaf's own gold.
      float nearK = smoothstep(300., 520., leafPx), rowI = floor(m.y);
      vec2 pf = vec2(fract(m.x / .75 + .5 * mod(rowI, 2.)) * .75 - .375, m.y - rowI - .5);
      float bare = 1. - step(3., m.y) * step(abs(mod(m.y, 3.) - 1.5), .5);
      float ringF = lineCov(abs(length(pf) - .07), pw * .8, px), cresF = lineCov(abs(length(pf - vec2(pw, -pw)) - .07), pw * .8, px) * (1. - ringF);
      float eT = min(min(m.x, m.y), min(uLeaf - m.x, uLeaf - m.y));
      float rule = max(lineCov(abs(eT - .5), pw, px), lineCov(abs(eT - .68), pw * .7, px));
      col = mix(col, g4, cresF * bare * nearK * .8); col = mix(col, toolInk, max(ringF * bare, rule) * nearK * .85);
    }
    // bole at worn edges and in hairline cracks, never thinner than a pixel and a half
    float e = min(min(m.x, m.y), min(uLeaf - m.x, uLeaf - m.y));
    float wob = vnoise(q * 37. + 5.);
    float bw = mix(.03, .11, wob) * (.5 + bias) * uBoleW;
    float bole = max(lineCov(e, bw, px), lineCov(e, px * .75, px) * .55 * smoothstep(9., 26., leafPx) * mix(.22, 1., uSeamInk));
    // worn leaves: on one leaf in five the gold has rubbed through along an edge or round a corner, in ragged flat patches
    // one to three metres deep: bole enough to be seen in a wide frame
    float wornLeaf = step(h21(cell * 3.7 + 1.9), uMode > 1.5 ? .12 : .21) * gilt * smoothstep(9., 20., leafPx);   // (fewer on the sky, and none where a leaf is a few pixels)
    vec2 wc = vec2(hh.x < .5 ? m.x : uLeaf - m.x, hh.y < .5 ? m.y : uLeaf - m.y);
    float ragged = .65 * vnoise(m * .8 + cell * 5.3) + .35 * vnoise(m * 2.9 + cell * 2.1);
    float wearW = min((.5 + 3. * bias) * max(ragged - .3, 0.) * 3., 3.2);
    float wearD = kind < .5 ? wc.x : min(wc.x, wc.y) + .12 * max(wc.x, wc.y);
    bole = max(bole, lineCov(wearD, wearW, px) * step(.02, wearW) * wornLeaf);
    if (kind > .3 && kind < .62) {
      float cy = mix(2., 10., hh.x) + (hh.y - .5) * 1.4 * (sm.x - 6.) + (vnoise(vec2(sm.x * .9, kind * 50.)) - .5) * 2.2;
      float seg = smoothstep(0., 1.5, sm.x - hh.y * 5.) * smoothstep(0., 1.5, hh.y * 5. + 6.5 - sm.x);
      bole = max(bole, lineCov(abs(sm.y - cy), max(.018, px * .75), px) * seg * smoothstep(mix(10., 20., uSeamInk), mix(24., 50., uSeamInk), leafPx));
    }
    col = mix(col, uInk[10], bole);
    // too small to read: the mean of the sheet
    col = mix(uStep[5], col, smoothstep(2.5, 6., leafPx));
    // ---- THE SECOND SCALE on sky and ground (fifth round, corrected in round 4a: gold only) ----
    // Sky: one quarter dotted with struck coins (downstream, over the river run), one hung with great curls (beyond the dark
    // robe), one with rows of punch dots and great punched rounds (beyond the whorl robe). Lower country: the pool and the
    // meadow wear a border of gold chequers between drawn rules, and great curls are struck in the ground beyond it. Plateau:
    // a border of gold triangles along the river's bank, curls beyond.
    vec3 curlInk = mix(uInk[2], uInk[13], uSeamInk);
    vec2 cC; float cK;
    if (uMode > 1.5) {
      vec3 dd = normalize(vP + vec3(1e-4));
      vec2 cc = m - uLeaf * .5; float cr = length(cc);
      // (round 4d) a coin on one leaf in four at most, in the heart of the downstream quarter, and they are the leaves the whorls
      // are struck on first (the same number picks both): where the quarter thins out the marked leaves fall to the whorls' own one
      // in nine, so nowhere in the sky is more than one leaf in four marked
      float coin = step(1. - .25 * zone.x, kind) * step(.001, zone.x);
      col = mix(col, mix(uStep[0] * .86, uInk[13], uSeamInk), lineCov(cr, 3.1, px) * coin * smoothstep(3., 7., leafPx));
      col = mix(col, mix(g3, uInk[1], uSeamInk), lineCov(abs(cr - 1.75), .34, px) * coin * smoothstep(8., 14., leafPx));
      vec2 sc = dd.xz / (1. + max(dd.y, -.6)) * 420.;
      float pxS = max(max(length(dFdx(sc)), length(dFdy(sc))), 1e-4);
      float cu = curls(sc, 74., 3.6, pxS, cC, cK);
      float azC = atan(cC.x * uSd + 1e-5, cC.y + 1e-5);
      float zc = smoothstep(.75, 1.2, azC) * (1. - smoothstep(2.5, 2.95, azC));
      // (round 4d) the sky's curls are struck, not inked: the line is the step of gold under the leaf it crosses, with a punch's
      // pale crescent beside it, so a curl is always gold on gold and never a brown line on a pale leaf
      float cuK = step(cK, zc * 1.1 - .05), cuO = max(1.2, pxS * .8);
      vec2 cC2; float cK2;
      float cuP = curls(sc - vec2(cuO, -cuO), 74., 3.6, pxS, cC2, cK2) * (1. - cu) * cuK * step(abs(cC2.x - cC.x) + abs(cC2.y - cC.y), 1.);
      col = mix(col, mix(g4, uInk[13], uSeamInk), cuP * .55 * gilt);
      col = mix(col, mix(stepI > .5 ? rampAt(stepI - 1.) : uStep[0] * .86, uInk[13], uSeamInk), cu * mix(.9, .8, uSeamInk) * cuK);   // (lacquer's gold curl is as it was)
      // the ringed quarter (round 4a; no ink but gold in the sky): rows of punch dots along every third course of leaves, and
      // great punched rounds, 60 to 76 m across on the sheet: four struck rings in dark gold, each with its pale crescent, a
      // punched heart and a ring of punch dots outside
      float dotRow = step(mod(cell.y, 3.), .5) * zone.z * smoothstep(6., 10., leafPx);
      float pwD = max(.5, px * .8);
      col = mix(col, uInk[1], lineCov(abs(length(cc - vec2(pwD, -pwD)) - 2.3), pwD, px) * dotRow * .9);
      col = mix(col, curlInk, lineCov(abs(cr - 2.3), pwD, px) * dotRow);
      vec2 ePq = sc / 90.; ePq.y += .5 * floor(ePq.x);
      vec2 eG = floor(ePq), eC = vec2(eG.x + .5, eG.y + .5 - .5 * eG.x) * 90.;
      float eK = h21(eG * 2.7 + 6.1), eR = length(eC) / 420., eAz = atan(eC.x * uSd + 1e-5, eC.y + 1e-5);
      // (round 4d) a rule of the sky: no great round nearer downstream than 54 degrees
      float eZone = smoothstep(.95, 1.3, -eAz) * (1. - smoothstep(2.5, 2.95, -eAz)) * step(eR, .93) * step(.3, eR);
      if (eK < .72 * eZone) {
        vec2 eD = sc - eC - (h22(eG + 4.4) - .5) * 20.;
        float R0 = 30. + 8. * h21(eG * 3.3 + 1.2), er = length(eD), gap = R0 * .25, pwR = max(1.2, pxS * .8);
        vec2 eD2 = eD - vec2(pwR, -pwR) * 1.3; float er2 = length(eD2);
        float ring = lineCov(abs(mod(er, gap) - gap * .5), pwR, pxS) * step(er, R0);
        float cres = lineCov(abs(mod(er2, gap) - gap * .5), pwR, pxS) * step(er2, R0) * (1. - ring);
        float ea2 = atan(eD.y + 1e-5, eD.x + 1e-5) / TAU * 18.;
        vec2 pd = vec2((fract(ea2) - .5) * TAU / 18. * er, er - R0 * 1.16);
        float dotR = lineCov(length(pd), 2.4, pxS), dotC = lineCov(length(pd - vec2(pwR, -pwR)), 2.4, pxS) * (1. - dotR);
        float heart = lineCov(er, 3.2, pxS);
        col = mix(col, uInk[1], max(cres, dotC) * .9);
        col = mix(col, curlInk, max(max(ring, dotR), heart));
      }
    } else if (abs(n0.y) > .7) {
      float rw = max(.3, px * 1.6);
      if (vP.y < 100.) {
        float bd = bankD(vP.xz);
        float cu = curls(vP.xz, 62., 3.2, px, cC, cK) * (1. - smoothstep(1.6, 3.6, px));
        col = mix(col, curlInk, cu * .8 * step(34., bankD(cC)) * step(cK, .62));
        if (bd > 3. && bd < 18.) {
          col = uInk[1];
          if (bd < 14.5) {
            vec3 w = motifW(vP.xz / 4.6, 0., px / 4.6, uTime);
            w = mix(motifAvg(0.), w, smoothstep(4., 9., 4.6 / px));
            col = uInk[2] * w.x + uInk[1] * w.y + uInk[13] * w.z;                  // tooled in gold: dark against pale (round 4a)
          }
        }
        col = mix(col, uInk[9], max(max(lineCov(abs(bd - 3.), rw, px), lineCov(abs(bd - 14.5), rw, px)), lineCov(abs(bd - 18.), rw, px)));
      } else {
        float bk = riverBank(vP.xz);
        float cu = curls(vP.xz + 31., 62., 3.2, px, cC, cK) * (1. - smoothstep(1.6, 3.6, px));
        col = mix(col, curlInk, cu * .8 * step(30., riverBank(cC - 31.)) * step(cK, .62));
        if (bk > 1.5 && bk < 10.5) {
          vec3 w = motifW(vP.xz / 4.5, 6., px / 4.5, uTime);
          w = mix(motifAvg(6.), w, smoothstep(4., 9., 4.5 / px));
          col = uInk[13] * w.x + uInk[2] * w.y + uInk[1] * w.z;
        }
        col = mix(col, uInk[9], max(lineCov(abs(bk - 1.5), rw, px), lineCov(abs(bk - 10.5), rw, px)) * step(-450., vP.z));
      }
    }
    // the one blazing leaf (kept to the last)
    float hi = hiSel * (1. - bole * .7) * smoothstep(.6, 1.5, leafPx);
    hi *= smoothstep(110., 240., camD);                               // on the land it blazes only at a distance: a leaf under the eye keeps its pale step and cannot flood the frame
    col = mix(col, uHi, hi);                                          // the whole leaf, edge to edge (round 4e: no pale rim inside it)
    float cw = max(.09, px * 1.6);
    // the river's punched bank panel runs on over the brink and down the cliff: a gilded border either side of the falls
    // and the cliff is panelled with it: the same border every 96 m along the face, under the brink, at mid height and above the foot
    float ax = abs(vP.x) - 93.5;
    vec2 dpx = max(vec2(length(vec2(dFdx(vP.x), dFdy(vP.x))), length(vec2(dFdx(vP.y), dFdy(vP.y)))), vec2(1e-4));
    vec2 wdx = vec2(dFdx(vP.x) * sign(vP.x), dFdx(vP.y)), wdy = vec2(dFdy(vP.x) * sign(vP.x), dFdy(vP.y));   // the pixel's two axes on the cliff face (metres)
    if (uMode < 1.5 && abs(n0.z) > .7 && vE.y < .5 && abs(vP.z) < 1. && ax > 0.) {
      // THE FRIEZE (round 4a, held to the ruling in round 4b): bands of ornament inlaid in the panel. Great curls are struck
      // in the leaf over the whole flank; three tiers of flat pattern lie across it between two tiers of the leaf itself, each
      // lower edge scalloped and edged in umber with a pale band; a band of tooled gold chequers runs along the foot and a
      // band of punched gold almonds under the brink. Nothing on the wall stands, tapers, is capped, hangs or moves.
      float side = vP.x * uSd > 0. ? 1. : 0.;
      float fcw = max(.45, px * 1.7);
      // (round 4d) THE PANELS. The inlay keeps every tier, hem, ink and its origin, and is masked in two places. Beside the falls
      // it begins 12 m from the outer curtain's edge (ax 8.5): a pier's width of bare leaf, foot to brink, with nothing on it.
      // And every 96 m it stops for the width of a border (6 m) and the leaf itself goes through: a flat band of the panel's own
      // gold with the leaf's own tooling, no fill, no beads, no rules of its own. Where a panel is ink its end is one drawn umber
      // edge, and only while the band beside it is ten pixels wide or more, so a far band is a plain gold gap and never a line.
      float bx = mod(ax, 96.), pxB = dpx.x;
      float endD = min(min(bx - 6., 96. - bx), ax - 8.5);              // metres into a panel from its nearer end: negative on the strip and on a band
      vec2 cuC; float cuK;
      float cu = curls(vec2(ax + 23. * side, vP.y), 46., 2.6, px, cuC, cuK) * (1. - smoothstep(1.4, 3.2, px));
      cu *= step(8.5 + .47 * 46., cuC.x - 23. * side);                 // a curl is struck whole or not at all: none reaches into the strip
      col = mix(col, mix(uInk[2], uInk[13], uSeamInk), cu * .85);
      if (endD > -pxB) {
        vec3 leafCol = col; float inkK = step(vP.y, 246.);              // (the top 4 m under the brink are leaf)
        if (vP.y > 12. && vP.y < 231.) {
          vec2 sw = swagAt(vec2(ax, vP.y), side);
          // (round 4e) a rule of the wall: on the flank the flight leaves the face by (the whorl robe's side: side 0) the lowest
          // tier begins at the second panel. In the first panel it is left as the leaf itself, with its scalloped hem above it
          // and the foot band below it
          inkK = (1. - step(.5, mod(sw.x, 2.))) * (1. - step(sw.x, .5) * step(ax, 96.) * (1. - side));
          if (inkK > .5) {
            float fm = 9.5 + .9 * sw.x;
            bool wide = dot(wdx, wdx) > dot(wdy, wdy);
            vec2 mj = (wide ? wdx : wdy) / fm, mn = (wide ? wdy : wdx) / fm;
            col = swagInk(vec2(ax, vP.y) / fm + sw.x * 3.1 + side * 7.7, sw.x, side, fm / px, mj, max(length(mn), length(mj) * .25));
          }
          float hemK = step(.5, sw.x);
          inkK = max(inkK, step(sw.y, 2.8 + fcw) * hemK);
          col = mix(col, uInk[1], step(sw.y, 2.8) * hemK);               // each hem: a plain pale band between two drawn lines
          col = mix(col, uInk[9], max(lineCov(sw.y, fcw, px), lineCov(abs(sw.y - 2.8), fcw * .6, px)) * hemK);
        } else if (vP.y <= 12.) {                                        // the foot: chequers tooled in gold, dark against pale
          vec3 w = motifW(vec2(ax, vP.y) / 4., 0., px / 4., uTime);
          w = mix(motifAvg(0.), w, smoothstep(4., 9., 4. / px));
          col = uInk[2] * w.x + uInk[1] * w.y + uInk[13] * w.z;
        } else if (vP.y < 246.) {                                        // under the brink: a row of punched almonds, gold on dark gold
          vec2 ep = vec2(mod(ax + 5., 17.) - 8.5, vP.y - 238.5) / 5.6;
          float ed2 = 1. - max(length(ep - vec2(0., .6)), length(ep + vec2(0., .6))), er = length(ep), ea = px / 5.6;
          float pwE = max(.035, ea * .8);
          col = uInk[13];
          col = mix(col, uInk[1], smoothstep(-ea, ea, ed2));
          col = mix(col, uInk[2], clamp((pwE - abs(er - .31)) / max(ea, 1e-5) + .5, 0., 1.) * step(0., ed2));
          col = mix(col, uInk[2], smoothstep(-ea, ea, .15 - er));
          col = mix(col, uInk[9], clamp((fcw * .6 / 5.6 - abs(ed2)) / max(ea, 1e-5) + .5, 0., 1.));
          col = mix(mix(uInk[13], uInk[1], .3), col, smoothstep(2., 5., 5.6 / px));        // too small to read: its mean, a mid gold
        }
        col = mix(col, uInk[9], max(lineCov(abs(vP.y - 12.), fcw, dpx.y), max(lineCov(abs(vP.y - 231.), fcw, dpx.y), lineCov(abs(vP.y - 246.), fcw, dpx.y))));
        col = mix(col, uInk[9], lineCov(endD, max(.4, pxB * 1.2), pxB) * inkK * smoothstep(10., 20., 6. / max(pxB, 1e-4)));
        col = mix(leafCol, col, clamp(endD / max(pxB, 1e-4) + .5, 0., 1.));         // the end of a panel is a drawn edge: covered, never stepped
      }
    }
    // umber contour where a face ends (brink, foot, pier arrises)
    float ed = vE.x;
    col = mix(col, uInk[9], lineCov(ed, cw, px));
    gl_FragColor = vec4(col, 1.);
  }`,kt=`
  attribute vec4 aA;      // stage (0 river, 1 fall, 2 meadow), lane (river: -1..1, fall: x in metres, meadow: -1..1), phase, seed
  attribute vec4 aB;      // top ink (0 black 1 white 2 silver), shape seed, landed radius, fall layer z
  #define TAU 6.2831853
  uniform float uTime, uViewH, uTanHalf, uMeadowLen, uGold; uniform vec3 uCamL, uRate;
  varying vec2 vQ; varying vec2 vBh; varying vec4 vS; varying vec4 vM;
  float meadowHalf(float z){
    float pool = 100. * (.55 + .45 * smoothstep(-6., 42., z));
    float w = pool + 10. * smoothstep(70., 150., z) - 16. * smoothstep(170., 300., z) * (1. - smoothstep(300., 420., z)) + 60. * smoothstep(330., 520., z);
    return w * (1. - .95 * smoothstep(470., 700., z));               // past the peaks it spreads, wanders and thins away to nothing
  }
  float meadowMid(float z){ return 46. * sin((z - 330.) * .0105) * smoothstep(330., 430., z); }
  void main(){
    float stage = aA.x, seed = aA.w, f = 0., sc = 1., life = 0.;
    vec3 C, Tx, Ty;
    if (stage < .5) {
      float zeta = fract(aA.z + uTime * uRate.x);
      float z = -420. + zeta * 421.6;
      float hw = 35. + 55. * pow(max(zeta, 1e-4), 1.6), u = aA.y;
      float ci = clamp(floor((u + 1.) * 1.5), 0., 2.), loc = (u + 1.) * 1.5 - ci;
      float x = mix(u * hw, (ci - 1.) * 64. + (loc - .5) * 49., smoothstep(-96., -46., z));
      float lean = 1.22 * smoothstep(-3.4, .7, z), over = max(z, 0.);
      vec3 base = vec3(x, 250.45 - over * over * .9, z);
      vec3 tc = uCamL - base; float sg = tc.z < 0. ? -1. : 1.;
      float yw = atan(tc.x, abs(tc.z) + 1e-3);                      // abeam of the camera a tile turns part way to it: never edge-on
      yw *= smoothstep(.45, 1.25, abs(yw)) * .72 * (1. - smoothstep(-3.4, .7, z));
      Tx = vec3(cos(yw), 0., -sin(yw) * sg); Ty = vec3(0., cos(lean), sin(lean));
      C = base + Ty * .8;
      sc = smoothstep(0., .02, zeta) * (1. - smoothstep(.9972, 1., zeta)); life = zeta;
    } else if (stage < 1.5) {
      float s = fract(aA.z + uTime * uRate.y), dist = s * 250.;
      float lean = 1.22 * (1. - smoothstep(0., .04, s));
      float ang = (seed < .5 ? -1. : 1.) * (.04 + .035 * (fract(seed * 2.) - .5) * smoothstep(.08, .6, s)) * dist * smoothstep(.01, .09, s);   // a rank turns as one, then loosens
      float ca = cos(ang), sa = sin(ang), cl = cos(lean), sl = sin(lean);
      Tx = vec3(ca, sa * cl, sa * sl); Ty = vec3(-sa, ca * cl, ca * sl);
      C = vec3(aA.y + sin(dist * .031 + seed * TAU) * 1.4 * s, 251.2 - dist, mix(.9, aB.w + (seed - .5) * .85, smoothstep(0., .035, s)));
      f = s; sc = smoothstep(0., .012, s) * (1. - smoothstep(.978, 1., s)); life = 1. + s;
    } else {
      float s = fract(aA.z + uTime * uRate.z);
      float z = 3. + uMeadowLen * (.22 * s + .78 * pow(max(s, 1e-4), 2.2));
      float x = meadowMid(z) + aA.y * meadowHalf(z) + sin(z * .021 + aA.y * 3. + seed * 2.) * 5. * smoothstep(40., 160., z);
      float settle = smoothstep(0., .03, s);
      C = vec3(x, .55 + seed * .9 + .12 * sin(uTime * .9 + seed * 40.) + 1.6 * (1. - settle), z);
      vec3 tc = uCamL - C; vec3 h = normalize(vec3(tc.x, 0., tc.z) + vec3(1e-4, 0., 1e-4));
      float tip = (.24 + .37 * aB.y) * settle;
      vec3 N = normalize(mix(vec3(0., 0., 1.), vec3(0., cos(tip), 0.) + h * sin(tip), settle));
      Tx = normalize(cross(vec3(0., .5, -.866), N) + vec3(1e-5, 0., 0.)); Ty = cross(N, Tx);
      f = 1.; sc = smoothstep(0., .022, s) * (1. - smoothstep(.94, 1., s)); life = 2. + s;
      // the banks and the far end thin out tile by tile instead of stopping on a line
      sc *= step(fract(seed * 7.77 + aB.y * 5.3), 1. - .82 * max(smoothstep(.84, 1., abs(aA.y)), smoothstep(430., 690., z)));
    }
    float R = aB.z;
    vec2 b = mix(vec2(.3, .8), vec2(R), f);
    float dC = max(length(uCamL - C), .5);
    // seen from far off (the portrait of the falls) one falling tile in four is drawn 2.7 times its size and stands for its
    // neighbours, which shrink away: the motif grows with distance, as on the hills, so the change of shape still reads at 250 m
    // (the meadow the same from the height: beyond 100 m one disc in eight is drawn 3.4 times its size over the dark bed)
    float pick = fract(seed * 17.31 + aB.y * 3.7);
    float farK = stage < .5 ? 0. : (stage < 1.5 ? smoothstep(70., 230., dC) : smoothstep(100., 300., dC));
    float mag = mix(1., stage < 1.5 ? step(pick, .26) * 2.7 : step(pick, .13) * 3.4, farK);
    sc *= mag;
    float pxM = dC * 2. * uTanHalf / max(uViewH, 1.) / max(mag, .05);
    float cw = min(max(.05, 1.6 * pxM), .45 * min(b.x, b.y));
    vec2 ext = b + cw + pxM;
    vec3 P = C + (Tx * position.x * ext.x + Ty * position.y * ext.y) * sc;
    vQ = position.xy * ext; vBh = b; vS = vec4(f, aB.x, seed, R); vM = vec4(pxM, aB.y, step(life, uGold - seed * .02), cw);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(P, 1.);
  }`,yt=`
  precision highp float;
  ${we}
  uniform vec3 uGoldInk;
  varying vec2 vQ; varying vec2 vBh; varying vec4 vS; varying vec4 vM;
  float band(float x, float lo, float hi, float aa){ return smoothstep(-aa, aa, x - lo) - smoothstep(-aa, aa, x - hi); }
  void main(){
    float f = vS.x, ci = vS.y, seed = vS.z, R = max(vS.w, .1), sh = vM.y, px = max(vM.x, 1e-4), cw = vM.w;
    vec2 b = vBh, ext = b + cw + px, p = clamp(vQ, -ext, ext);        // the across coordinate, held to the quad's own extent before anything squares it
    float c = min(mix(.03, R, smoothstep(.1, .7, f)), min(b.x, b.y));
    vec2 q = abs(p) - b + c;
    float d = length(max(q, 0.)) + min(max(q.x, q.y), 0.) - c;        // rectangle whose corners round until it is a disc
    float late = smoothstep(.6, .92, f);
    float r = length(p), th = atan(p.y + 1e-5, p.x + 1e-5) + uTime * (.2 + .5 * seed) * (seed > .5 ? 1. : -1.) * late;
    if (sh > .3 && sh < .52) {                                        // almond: two discs intersected
      float k = .75 * R, ra = 1.25 * R;
      d = mix(d, max(length(p - vec2(0., k)), length(p + vec2(0., k))) - ra, late);
    } else if (sh > .76) {                                            // eight petals
      d = mix(d, r - R * (.8 + .2 * abs(cos(th * 4.))), late);
    }
    float aa = px * .75, dep = -d, lod = smoothstep(3., 7., R / px);
    vec3 top = ci < .5 ? uInk[3] : (ci < 1.5 ? uInk[4] : uInk[7]);
    bool pearl = fract(seed * 2.) < .45;
    vec3 landed = ci < .5 ? uInk[6] : (ci < 1.5 ? (pearl ? uInk[4] : uInk[8]) : uInk[5]);
    vec3 ringInk = ci < .5 ? uInk[0] : (ci < 1.5 ? (pearl ? uInk[6] : uInk[4]) : uInk[0]);
    vec3 coreInk = ci < .5 ? uInk[4] : (ci < 1.5 ? (pearl ? uInk[3] : uInk[0]) : uInk[3]);
    vec3 hairInk = ci < .5 ? uInk[7] : (ci < 1.5 ? uInk[7] : uInk[4]);
    if (vM.z > .5) { top = uInk[1]; landed = uInk[1]; ringInk = uInk[3]; coreInk = uInk[3]; hairInk = uInk[3]; }
    float g = smoothstep(.3, .84, f), md = min(b.x, b.y);
    vec3 col = mix(top, landed, smoothstep(-aa, aa, dep - md * (1. - g) * 1.02) * step(.002, g));
    // the upright tile: an inset hairline and, on one in four, a small gold lozenge
    float rect = (1. - smoothstep(.3, .62, f)) * (1. - smoothstep(.025, .07, px));
    col = mix(col, hairInk, band(dep, .075, .075 + max(.022, px * 1.2), aa) * rect);
    float loz = smoothstep(-aa, aa, .11 - abs(p.x) - abs(p.y - .32) * .55) * max(step(.74, fract(seed * 7.31)), vM.z);
    // and bolder marks that hold to 60 m, so the ranks are a pattern of tablets and not plain slabs: on about one in three a
    // block in the upper half, on one in four three small squares up the middle, on some a bar; white on black, black on white and silver
    float rect2 = (1. - smoothstep(.3, .62, f)) * (1. - smoothstep(.09, .2, px)) * (1. - vM.z);
    float mk = 0.;
    if (sh < .3) mk = smoothstep(-aa, aa, min(.13 - abs(p.x), .22 - abs(p.y - .3)));
    else if (sh < .55) mk = smoothstep(-aa, aa, .075 - max(abs(p.x), abs(fract((p.y + .6) / .4) * .4 - .2))) * step(abs(p.y), .6);
    else if (sh < .7) mk = smoothstep(-aa, aa, min(.05 - abs(p.x), .55 - abs(p.y)));
    col = mix(col, ci < .5 ? uInk[4] : uInk[3], mk * rect2);
    col = mix(col, vM.z > .5 ? uInk[3] : uInk[0], loz * rect);
    // the landed ornament: ring bands from the edge distance, a ringed centre, spiral arms on some
    float orn = late * lod;
    float ring = band(dep, .2 * R, .36 * R, aa);
    if (sh > .52 && sh < .76) {
      float sp = fract(th / TAU * 2. + r / R * 1.7);
      ring = smoothstep(-aa, aa, dep - .14 * R) * band(sp, .25, .75, aa * (1. + .3 * R / max(r, .05)) / R);
    }
    col = mix(col, ringInk, ring * orn);
    float cr = (sh > .3 && sh < .52) ? r / (.5 * R) : r / R;      // centres are true circles even in an almond
    col = mix(col, coreInk, (1. - smoothstep(-aa / R, aa / R, cr - .36)) * orn);
    col = mix(col, ringInk, (1. - smoothstep(-aa / R, aa / R, cr - .2)) * orn);
    col = mix(col, coreInk, (1. - smoothstep(-aa / R, aa / R, cr - .1)) * orn * step(.5, fract(seed * 13.7)));
    col = mix(col, uInk[3], band(dep, 0., min(max(.08, px), .24 * md), aa) * vM.z);      // a gold tile wears a black band inside its edge
    // umber contour inside the quad, with a pixel floor; nothing outside it
    col = mix(col, uInk[9], smoothstep(-aa, aa, d));
    if (d > cw) discard;
    gl_FragColor = vec4(col, 1.);
  }`,zt=`
  varying vec3 vP;
  void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,Ct=`
  precision highp float;
  ${we}
  uniform vec3 uRate;
  varying vec3 vP;
  float meadowHalf(float z){
    float pool = 100. * (.55 + .45 * smoothstep(-6., 42., z));
    float w = pool + 10. * smoothstep(70., 150., z) - 16. * smoothstep(170., 300., z) * (1. - smoothstep(300., 420., z)) + 60. * smoothstep(330., 520., z);
    return w * (1. - .95 * smoothstep(470., 700., z));               // past the peaks it spreads, wanders and thins away to nothing
  }
  float meadowMid(float z){ return 46. * sin((z - 330.) * .0105) * smoothstep(330., 430., z); }
  float lineCov(float d, float w, float px){ return clamp((w - d) / max(px, 1e-5) + .5, 0., 1.); }
  void main(){
    float px = max(max(length(dFdx(vP)), length(dFdy(vP))), 1e-4);
    float cw = max(.1, px * 1.6);
    vec3 col; float outside;
    if (vP.y > 100.) {                                   // river bed, fanning from 70 m to 180 m
      float zeta = clamp((vP.z + 420.) / 420., 0., 1.);
      float hw = 36.5 + 55. * pow(max(zeta, 1e-4), 1.6) + 2.5 * smoothstep(.9, 1., zeta);
      float head = length(vec2(vP.x, min(vP.z + 420., 0.) * 1.6));
      float ax = max(abs(vP.x), head);
      float e = hw - ax;                                 // metres inside the bank
      vec2 g = vec2(vP.x / max(hw, 1.) * 30., (vP.z - uTime * uRate.x * 421.6) / 4.4);
      vec2 gi = floor(g), gf = fract(g);
      float k = h21(gi);
      float dash = lineCov(abs(gf.x - .5) * hw / 30., .07, px) * step(abs(gf.y - .5), .12 + .2 * k) * step(.35, k);
      col = mix(uInk[3], uInk[7], dash * (1. - smoothstep(.12, .5, px)));
      col = mix(col, mix(uInk[3], uInk[7], .09), smoothstep(.12, .5, px));
      // the gilded bank panel: a pale fillet, a dark fillet and a row of punch dots, 3.4 m wide
      float bank = -e;
      if (bank > 0.) {
        col = bank < .5 ? uInk[1] : (bank < 2.9 ? uInk[13] : uInk[0]);
        vec2 pd = vec2(fract(vP.z / 1.4) * 1.4 - .7, bank - 1.7);
        float dd = abs(length(pd) - .36), pw = max(.05, px * .8);
        col = mix(col, uInk[1], lineCov(abs(length(pd - vec2(pw, -pw)) - .36), pw, px) * (1. - smoothstep(.1, .3, px)));
        col = mix(col, uInk[2], lineCov(dd, pw, px) * (1. - smoothstep(.1, .3, px)));
        col = mix(col, uInk[9], max(lineCov(abs(bank - .5), cw * .6, px), lineCov(abs(bank - 2.9), cw * .6, px)));
      }
      col = mix(col, uInk[9], lineCov(abs(e), cw, px));
      outside = bank - 3.4;
      col = mix(col, uInk[9], lineCov(abs(outside), cw, px));
    } else {                                             // plunge pool: 200 m across, 110 m long, rounded downstream
      vec2 q = abs(vec2(vP.x, vP.z - 30.)) - vec2(100., 80.) + 46.;
      float d = length(max(q, 0.)) + min(max(q.x, q.y), 0.) - 46.;
      // and the meadow's bed runs on from it: the same dark cobalt between scalloped banks, wandering and tapering away downstream
      float dB = vP.z > 64. ? max(abs(vP.x - meadowMid(vP.z)) - meadowHalf(vP.z) - 5. - 3. * sin(vP.z * .11), vP.z - 699.) : 1e3;
      d = min(d, dB);
      col = uInk[11];
      vec2 g = vP.xz / 13., gi = floor(g);
      vec2 o = (h22(gi) - .5) * 6.; float k = h21(gi + 3.3);
      float ph = fract(uTime * (.09 + .06 * k) + k * 7.);
      float rr = length((fract(g) - .5) * 13. - o);
      float w = max(.05, px * .8) * (1. - ph);
      float rip = max(lineCov(abs(rr - ph * 5.2), w, px), lineCov(abs(rr - ph * 5.2 + 1.1), w * .7, px) * step(1.1, ph * 5.2));
      col = mix(col, uInk[0], rip * (1. - ph) * (1. - smoothstep(.15, .6, px)));
      float foot = lineCov(abs(fract(vP.z / 2.6 - uTime * .35) - .5) * 2.6, max(.05, px * .7), px) * step(vP.z, 9.) * step(.3, h21(vec2(floor(vP.x / 3.), floor(vP.z / 2.6 - uTime * .35))));
      col = mix(col, uInk[0], foot * (1. - smoothstep(.15, .5, px)));
      col = mix(col, uInk[0], step(d, 0.) * lineCov(abs(d + .9), .22, px));     // a gold rim line just inside the edge
      col = mix(col, uInk[9], lineCov(abs(d), cw, px));
      outside = d;
    }
    if (outside > cw) discard;
    gl_FragColor = vec4(col, 1.);
  }`,Pt=`
  attribute vec4 aCM;     // pattern centre xyz (local), motif size in metres
  attribute vec4 aPat;    // motif id, ink indices 0, 1, 2 (into uInk)
  attribute vec4 aHemP;   // hem: base height, drape amplitude, drape phase, scallops round the hem (0 = no hem cut)
  attribute vec2 aHem;    // height along the peak's axis, azimuth
  uniform vec3 uCamL; uniform float uViewH, uTanHalf, uHull;
  varying vec2 vUv; varying vec4 vPat; varying vec4 vHemP; varying vec3 vHem;
  void main(){
    vec3 P = position;
    vec3 C = aCM.xyz; float m = max(aCM.w, .01);
    vec3 fv = C - uCamL; float dC = max(length(fv), 1.); fv /= dC;
    vec3 r = normalize(vec3(fv.z, 0., -fv.x) + vec3(1e-4, 0., 0.));
    vec3 t = cross(r, fv);
    vUv = vec2(dot(P - C, r), dot(P - C, t)) / m;
    float dP = max(length(P - uCamL), .5);
    float pxM = dP * 2. * uTanHalf / max(uViewH, 1.);
    P += normalize(normal + vec3(0., 1e-5, 0.)) * max(.07, 1.6 * pxM) * uHull;
    vPat = aPat; vHemP = aHemP;
    vHem = vec3(aHem, m * uViewH / (2. * uTanHalf * min(dC, dP)));   // motif size in pixels (at the nearer of centre and surface)
    gl_Position = projectionMatrix * modelViewMatrix * vec4(P, 1.);
  }`,It=`
  precision highp float;
  ${we}
  ${tt}
  uniform float uHull;
  varying vec2 vUv; varying vec4 vPat; varying vec4 vHemP; varying vec3 vHem;
  void main(){
    float hd = 1e3, fh = max(fwidth(vHem.x), 1e-4);
    if (vHemP.w > .5) {
      float az = vHem.y;
      float sc = abs(sin(az * vHemP.w * .5 + vHemP.z * 3.));          // scallops, points down between the lobes
      float line = vHemP.x + vHemP.y * sin(az + vHemP.z) + .35 * vHemP.y * sin(az * 2. - vHemP.z * 1.7) - 11. * sc * sc;
      hd = vHem.x - line;
      if (hd < 0.) discard;
    }
    if (uHull > .5) { gl_FragColor = vec4(uInk[9], 1.); return; }
    float px = max(vHem.z, 1e-3);
    float blk = step(7.5, vPat.x), id = vPat.x - 8. * blk;
    vec3 w = motifW(vUv, id, 1. / px, uTime);
    w = mix(motifAvg(id), w, smoothstep(4., 9., px));
    vec2 bu = vec2(vUv.x * .14 + 3.3, vUv.y * .31 + 1.7); bu.x += floor(bu.y) * .37;
    vec2 be = min(fract(bu), 1. - fract(bu)) * vec2(7.1, 3.2);
    float ab = 1. / px;
    float mk = step(h21(floor(bu) + 2.5), .56) * smoothstep(0., 2. * ab, min(be.x, be.y) - .12);
    w = mix(w, vec3(1., 0., 0.), mk * blk);
    vec3 col = inkAt(vPat.y) * w.x + inkAt(vPat.z) * w.y + inkAt(vPat.w) * w.z;
    // the hem: an umber edge, then a plain border band in the robe's second ink
    float cw = max(.12, 1.6 * fh);
    col = mix(col, inkAt(vPat.z), step(hd, 2.6) * step(.5, vHemP.w));
    col = mix(col, uInk[9], clamp((cw - min(hd, abs(hd - 2.6))) / fh + .5, 0., 1.));
    gl_FragColor = vec4(col, 1.);
  }`;function nt(){const c=[],o=[],i=[],L=new t.Vector3,M=new t.Vector3,b=new t.Vector3;function H(d,w,k,y,G=1e3,_=1e3,u=1e3,r=1e3,f=0,h=null){h?b.set(h[0],h[1],h[2]):(L.set(w[0]-d[0],w[1]-d[1],w[2]-d[2]),M.set(y[0]-d[0],y[1]-d[1],y[2]-d[2]),b.crossVectors(L,M).normalize());for(const[v,X]of[[d,G],[w,_],[k,u],[d,G],[k,u],[y,r]])c.push(v[0],v[1],v[2]),o.push(b.x,b.y,b.z),i.push(X,f)}function q(){const d=new t.BufferGeometry;return d.setAttribute("position",new t.Float32BufferAttribute(c,3)),d.setAttribute("normal",new t.Float32BufferAttribute(o,3)),d.setAttribute("aE",new t.Float32BufferAttribute(i,2)),d}return{quad:H,geometry:q}}const A=250,At=450,ae=-700,Et=-420,Mt=52,Wt=12,qe=32,St=210,Tt=300,Bt=100,Lt=300,Kt=8*Math.PI/180;function Rt(){const c=nt(),o=c.quad,i=At,L=760,M=[0,1,0];o([-L,0,0],[-L,0,860],[L,0,860],[L,0,0],1e3,1e3,1e3,1e3,0,M),o([-i,A,ae],[-i,A,0],[i,A,0],[i,A,ae],1e3,1e3,1e3,1e3,0,M);const b=A/2;for(const[d,w,k,y]of[[-i,0,i,0],[i,0,i,ae],[i,ae,-i,ae],[-i,ae,-i,0]])o([d,0,w],[k,0,y],[k,b,y],[d,b,w],0,0,b,b),o([d,b,w],[k,b,y],[k,A,y],[d,A,w],b,b,0,0);const H=[[-6,0],[-6,3.6],[-3.1,6.8],[3.1,6.8],[6,3.6],[6,0]],q=[[0,1.85,2.3],[7,1.7,2.05],[26,1.32,1.5],[70,1.08,1.12],[150,1,1],[234,1,1],[238,1.13,1.2],[247,1.13,1.2],[249.4,1,1],[252.8,1,1]];for(const d of[-1,1]){const w=d*qe,k=(r,f)=>[w+H[r][0]*q[f][1],q[f][0],.02+H[r][1]*q[f][2]];for(let r=0;r<q.length-1;r++)for(let f=0;f<H.length-1;f++){const h=k(f,r),v=k(f+1,r),X=k(f+1,r+1),oe=k(f,r+1),j=(S,E)=>[(S[0]+E[0])/2,(S[1]+E[1])/2,(S[2]+E[2])/2],re=j(h,v),g=j(oe,X),ce=Math.hypot(v[0]-h[0],v[2]-h[2])/2,O=r===5||r===7?0:ce;o(h,re,g,oe,0,O,O,0,1),o(re,v,X,g,O,0,0,O,1)}const y=252.8,G=[w,y,-46],_=[w,y,1.5],u=[...H.map(r=>[w+r[0],y,.02+r[1]]),G];for(let r=0;r<u.length;r++){const f=u[r],h=u[(r+1)%u.length];o(_,f,h,_,5.5,0,0,5.5,1,M)}for(const r of[-1,1]){const f=[w+r*6,A,.02],h=[w,A,-46],v=A+1.4;o(f,h,[h[0],v,h[2]],[f[0],v,f[2]],.4,.4,1.4,1.4,1),o([f[0],v,f[2]],[h[0],v,h[2]],[h[0],y,h[2]],[f[0],y,f[2]],1.4,1.4,0,0,1)}}return c.geometry()}const Ft=[{name:"rose-cobalt-malachite",a:null,b:null,c:"#2F8F5B"},{name:"orange-turquoise-ivory",a:"#E2752B",b:"#1F8F96",c:"#F2E8CF"},{name:"violet-leafgreen",a:"#7A4BB0",b:"#3E2A78",c:"#5FA83A"}],Ht=[{name:"yellow-gold",steps:null,bole:"#8E2F1F",hi:[5,4,2.1],calm:[.42,.5,.36,1],sheen:[.7,.4,.32],dull:.15},{name:"white-gold",steps:["#70757A","#9CA2A5","#C3C6C4","#E3DDC8","#FAF3DC","#B6B9B6"],bole:"#4A6F5C",hi:[1,1.9,3.4],hiCos:.9997,boleW:2.3,seamW:.16,calm:[.42,.5,.36,1],sheen:[.7,.38,.32],dull:.15},{name:"black-lacquer",steps:["#0C0B0A","#131110","#1B1713","#7E5F1A","#D8A837","#151310"],bole:"#5E4716",hi:[5,4,2.1],sheen:[.55,.5,-.12],seamW:.07,seamCol:"#4A3912",pierLift:3}];async function Dt(c,o={}){const i=c.rng.fork?c.rng.fork("pattern-falls"):c.rng,L=Math.min(1,Math.max(.6,o.detail??c.quality?.detail??1)),M=o.palette&&o.palette.length>=7?o.palette:bt,b=i(),H=i(),q=i(),d=i(),w=i(),k=o.metal??F.metal??(b<.72?0:b<.86?1:2),y=o.scheme??F.scheme??(H<.56?0:H<.8?1:2),G=o.march??F.march??(q<.5?0:q<.78?1:2),_=o.swapPeaks??F.swapPeaks??d<.3,u=Ht[k],r=Ft[y],f=[M[2],"#B8892A",M[0],"#E6C463",M[1],"#C99C32"],h=u.steps||f,v=k===1?h:f,X=[v[2],v[4],v[0],M[3],M[4],r.a||M[5],r.b||M[6],"#9FA3A6",r.c,"#3A2410",u.bole,"#131A2E",v[5],v[1]],oe=h.map(e=>xe(e)),j=X.map(e=>xe(e)),re=j[0],g={uInk:{value:j},uTime:{value:0},uGold:{value:0},uCamL:{value:new t.Vector3(0,258,-300)},uViewH:{value:720},uTanHalf:{value:Math.tan(31*Math.PI/180)}},ce=new t.Vector3(...o.window??[.879,.242,.41]).normalize(),O=e=>({...g,uMode:{value:e},uLeaf:{value:12},uHiCos:{value:o.highlightCos??u.hiCos??.9993},uWalk:{value:o.walk??1.1},uSheen:{value:new t.Vector3(...o.sheen??u.sheen??[.3,.42,.08])},uCalm:{value:new t.Vector4(...o.calm??u.calm??[.8,.7,.26,0])},uDull:{value:u.dull??0},uSeamW:{value:u.seamW??.25},uSeamCol:{value:xe(u.seamCol??"#B8892A")},uBoleW:{value:u.boleW??1},uPierLift:{value:u.pierLift??0},uStep:{value:oe},uSeamInk:{value:k===2?1:0},uTool:{value:k===2?j[2]:oe[0].clone().multiplyScalar(.8)},uSd:{value:_?1:-1},uWindow:{value:ce},uWindowSky:{value:new t.Vector3(...o.windowSky??[-.35,.3,.89]).normalize()},uHi:{value:new t.Vector3(...u.hi)}}),S=new t.Group;S.name="where-the-pattern-falls:hero";const E=new t.ShaderMaterial({uniforms:O(0),vertexShader:at,fragmentShader:ot,side:t.DoubleSide,fog:!1}),Ee=new t.Mesh(Rt(),E);Ee.frustumCulled=!1,S.add(Ee),await c.yield();const ne=new t.ShaderMaterial({uniforms:O(2),vertexShader:at,fragmentShader:ot,side:t.BackSide,depthWrite:!1,depthTest:!1,fog:!1});ne.uniforms.uWindow=E.uniforms.uWindow,ne.uniforms.uWindowSky.value=E.uniforms.uWindowSky.value;const ge=new t.SphereGeometry(420,32,20);ge.setAttribute("aE",new t.Float32BufferAttribute(new Float32Array(ge.attributes.position.count*2).fill(0).map((e,a)=>a%2?0:1e3),2));const Y=new t.Mesh(ge,ne);Y.frustumCulled=!1,Y.renderOrder=-.5,Y.visible=o.sky!==!1,S.add(Y),await c.yield(),g.uRate={value:new t.Vector3((o.riverSpeed??7)/421.6,(o.fallSpeed??22)/250,o.meadowRate??.009)};{const e=nt(),a=[0,1,0];e.quad([-100,A+.4,-446],[-100,A+.4,0],[100,A+.4,0],[100,A+.4,-446],0,0,0,0,0,a),e.quad([-280,.4,.05],[-280,.4,706],[280,.4,706],[280,.4,.05],0,0,0,0,0,a);const s=new t.Mesh(e.geometry(),new t.ShaderMaterial({uniforms:g,vertexShader:zt,fragmentShader:Ct,side:t.DoubleSide,fog:!1}));s.frustumCulled=!1,S.add(s)}await c.yield();const C=i.fork?i.fork("tiles"):i,be=54,ke=191,ye=27,fe=3,ze=54,st=be*ke,lt=3*ye*fe*ze,We=Math.round((o.meadowCount??24e3)*L),Ce=st+lt+We,de=new Float32Array(Ce*4),he=new Float32Array(Ce*4);let W=0;const Ke=(e,a)=>C()<.12?Math.floor(C()*3):((e+Math.floor(a/3))%3+3)%3,De=e=>{const a=(e+1)*1.5%1;return G===1?Math.abs(a-.5)*.02:G===2?(e+1)*.016:0};for(let e=0;e<ke;e++){for(let a=0;a<be;a++,W++){const s=(a+.5)/be*2-1;de.set([0,s,e/ke+De(s),C()],W*4),he.set([Ke(e,a),C(),.6+.9*Math.pow(C(),1.6),0],W*4)}e%24===23&&await c.yield()}for(let e=0;e<3;e++)for(let a=0;a<ye;a++){for(let s=0;s<fe;s++)for(let P=0;P<ze;P++,W++){const z=(a+.5)/ye,T=(e-1)*64+(z-.5)*50+(C()-.5)*.7,D=(e+z)/1.5-1;de.set([1,T,(P+s/fe+a%2*.5/fe)/ze+De(D)*1.7,(C()+(P+s)%2)*.5],W*4),he.set([Ke(P+s,a),C(),.6+.9*Math.pow(C(),1.6),1.2+s*.9],W*4)}a%9===8&&await c.yield()}for(let e=0;e<We;e++,W++)de.set([2,C()*2-1,C(),C()],W*4),he.set([Math.floor(C()*3),C(),.6+.9*Math.pow(C(),1.6),0],W*4),e%4e3===3999&&await c.yield();const J=new t.InstancedBufferGeometry;J.setAttribute("position",new t.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),J.setIndex([0,1,2,0,2,3]),J.setAttribute("aA",new t.InstancedBufferAttribute(de,4)),J.setAttribute("aB",new t.InstancedBufferAttribute(he,4)),J.instanceCount=Ce,g.uMeadowLen={value:o.meadowLength??700},g.uGoldInk={value:re};const Ve=new t.Mesh(J,new t.ShaderMaterial({uniforms:g,vertexShader:kt,fragmentShader:yt,side:t.DoubleSide,fog:!1}));Ve.frustumCulled=!1,S.add(Ve),await c.yield();const x=i.fork?i.fork("peaks"):i,se=44,Pe=12,m={pos:[],cm:[],pat:[],hemP:[],hem:[],idx:[]},ee=[],it=(e,a)=>{const s=Math.abs(Math.sin(a*e[3]*.5+e[2]*3));return e[0]+e[1]*Math.sin(a+e[2])+.35*e[1]*Math.sin(a*2-e[2]*1.7)-11*s*s};for(const e of[-1,1]){const a=e<0!==_,s=(a?o.darkPeak:o.brightPeak)||[e*St,Tt],P=Math.abs(s[0]),z=s[1],T=[x()*$,x()*$,x()*$,x()*$],D=1+x()*.22,I=Lt,R=(o.lean??124)*(a?.84:1.08),le=14*Math.sin(T[2]*1.7),Be=n=>{const p=n/I,U=Math.max(0,(p-.82)/.18);return[e*P-e*(R*(.5*p+.5*p*p)+12*U*U)+Math.sin(n/80+T[0])*7*p,z+Math.cos(n/65+T[1])*8*p+le*U*U]},dt=(n,p)=>Bt*(.66*Math.pow(Math.max(0,1-n/I),D)+.34*Math.pow(Math.max(0,1-n/I),6)+.1*Math.min(1,n/60))*(1+.15*Math.sin(2*p+T[2]+n*.006)+.09*Math.sin(3*p+T[3]-n*.011))/1.12,ht=n=>{const p=Math.max(0,(n/I-.92)/.08);return Math.sqrt(Math.max(0,1-p*p))},mt=[0,17,15,12,7,6],pt=[0,8,7,5,3,2],Ze=x.shuffle?x.shuffle(a?[0,1,2,6,1,0]:[5,4,3,7,5,4]):a?[0,1,2,6,1,0]:[5,4,3,7,5,4],ut=a?null:[[5,0,6],[6,0,4],[8,0,5],[0,5,6],[6,8,0],[5,8,4]],vt=Math.floor(x()*6),$e=[0,1,2,3,4].map(()=>{const n=(x.range(-13,13)+13)/26;return .45+1.85*n*n}),xt=$e.reduce((n,p)=>n+p,0),te=[0];for(let n=1;n<6;n++)te.push(te[n-1]+(n===1?22:0)+212*$e[n-1]/xt);for(let n=0;n<6;n++){const p=n?[te[n],x.range(17,37)*(n>3?.55:1),x()*$,5+Math.floor(x()*5)-Math.floor(n*.6)]:[-100,0,0,0],U=n?Math.max(0,te[n]-1.35*p[1]-14):0,Ye=n<5?Math.min(I,te[n+1]+62):I,Je=(Math.max(U,te[n])+Ye)/2,et=Be(Je),wt=(a?x.range(7,11):x.range(9,14))*(o.motifScale??1),Le=[et[0]+x.range(-8,8),Je+x.range(-6,6),et[1]+x.range(-8,8)],Re=a?{0:[3,7,4],1:[3,7,0],2:[3,7,4],6:[3,4,7]}[Ze[n]]:ut[n],Fe=[8+Math.floor(x()*7),x()*$],gt=m.pos.length/3;for(let Q=0;Q<=Pe;Q++){const N=Q/Pe,B=U+(Ye-U)*(n===5?1-(1-N)*(1-N)*.6-.4*(1-N):N),ie=Be(B);for(let Z=0;Z<=se;Z++){const V=Z/se*$,He=B-it(p,V);let ve=dt(B,V)+(n?1+1.5*n+mt[n]*Math.exp(-Math.max(He,0)/20)+pt[n]*(1+Math.cos(V-Fe[1]))*Math.exp(-Math.max(He,0)/70)+2.4*Math.sin(V*Fe[0]+Fe[1])*Math.exp(-Math.max(He,0)/38):0);ve=Math.min(ve,116+.6*B)*ht(B),m.pos.push(ie[0]+Math.cos(V)*ve,B,ie[1]+Math.sin(V)*ve),m.cm.push(Le[0],Le[1],Le[2],wt),m.pat.push(Ze[n]+(a&&n!==vt?8:0),Re[0],Re[1],Re[2]),m.hemP.push(p[0],p[1],p[2],p[3]),m.hem.push(B,V)}}for(let Q=0;Q<Pe;Q++)for(let N=0;N<se;N++){const B=gt+Q*(se+1)+N,ie=B+1,Z=B+se+1,V=Z+1;m.idx.push(B,Z,ie,ie,Z,V)}await c.yield()}const Xe=Be(I);ee.push({dark:a,base:new t.Vector3(e*P,0,z),crown:new t.Vector3(Xe[0],I,Xe[1])})}const K=new t.BufferGeometry;K.setAttribute("position",new t.Float32BufferAttribute(m.pos,3)),K.setAttribute("aCM",new t.Float32BufferAttribute(m.cm,4)),K.setAttribute("aPat",new t.Float32BufferAttribute(m.pat,4)),K.setAttribute("aHemP",new t.Float32BufferAttribute(m.hemP,4)),K.setAttribute("aHem",new t.Float32BufferAttribute(m.hem,2));{const e=m.pos,a=m.idx[0],s=m.idx[1],P=m.idx[2],z=[e[s*3]-e[a*3],e[s*3+1]-e[a*3+1],e[s*3+2]-e[a*3+2]],T=[e[P*3]-e[a*3],e[P*3+1]-e[a*3+1],e[P*3+2]-e[a*3+2]],D=z[1]*T[2]-z[2]*T[1],I=z[0]*T[1]-z[1]*T[0];if(D*(e[a*3]-ee[0].base.x)+I*(e[a*3+2]-ee[0].base.z)<0)for(let R=0;R<m.idx.length;R+=3){const le=m.idx[R];m.idx[R]=m.idx[R+1],m.idx[R+1]=le}}K.setIndex(m.idx),K.computeVertexNormals(),await c.yield();const Ie=e=>new t.ShaderMaterial({uniforms:{...g,uHull:{value:e?1:0}},vertexShader:Pt,fragmentShader:It,side:e?t.BackSide:t.FrontSide,fog:!1}),Ge=Ie(!1);Ge.side=t.DoubleSide;const _e=new t.Mesh(K,Ge),Ue=new t.Mesh(K,Ie(!0));_e.frustumCulled=!1,Ue.frustumCulled=!1,S.add(_e,Ue),await c.yield();{const e=i.fork?i.fork("spray"):i,a=Math.round((o.sprayCount??1500)*L),s=new Float32Array(a*4),P=new Float32Array(a*4);for(let I=0;I<a;I++){const R=Math.floor(e()*3),le=(R-1)*64+(e()-.5)*54;s.set([le,e(),e(),.16+.3*e()*e()],I*4),P.set([(e()-.5)*9,9+13*e(),2+13*e()*e(),.35+.4*e()],I*4)}const z=new t.InstancedBufferGeometry;z.setAttribute("position",new t.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),z.setIndex([0,1,2,0,2,3]),z.setAttribute("aA",new t.InstancedBufferAttribute(s,4)),z.setAttribute("aB",new t.InstancedBufferAttribute(P,4)),z.instanceCount=a;const T=new t.ShaderMaterial({uniforms:g,fog:!1,transparent:!0,depthWrite:!1,blending:t.AdditiveBlending,vertexShader:`
        attribute vec4 aA; attribute vec4 aB;
        uniform float uTime, uViewH, uTanHalf; uniform vec3 uCamL;
        varying vec2 vQ; varying float vK;
        void main(){
          float t = fract(aA.y + uTime * aB.w), T = aB.y / 9.81 * 2.;          // one leap lasts until it lands again
          float tt = t * T;
          vec3 C = vec3(aA.x + aB.x * tt, .9 + aB.y * tt - 4.905 * tt * tt, 1.5 + aB.z * tt);
          vec3 tc = uCamL - C; float d = max(length(tc), .5); tc /= d;
          vec3 r = normalize(vec3(tc.z, 0., -tc.x) + vec3(1e-4, 0., 0.)), u = cross(tc, r);
          float pxM = d * 2. * uTanHalf / max(uViewH, 1.);
          float rad = max(aA.w * (1. - t * t), 0.) + pxM * .75;
          // (round 4d) a dot smaller than the pixel it is drawn on gives that pixel its true share of light: the square of the
          // ratio (it was the ratio itself, five times too much at 300 m, so the foot seen from across the pool was a pale veil
          // that lifted the white discs behind it over the bloom threshold). A dot a pixel across or more is as it was.
          float fill = min(1., aA.w * (1. - t * t) / max(pxM * .75, 1e-4));
          vQ = position.xy; vK = step(.02, 1. - t) * fill * fill;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(C + (r * position.x + u * position.y) * rad, 1.);
        }`,fragmentShader:`
        precision highp float;
        uniform vec3 uInk[14];
        varying vec2 vQ; varying float vK;
        void main(){
          float r = length(clamp(vQ, -1., 1.)); if (r > 1.) discard;     // (the across coordinate is held to the quad's own range before it is squared)
          // (round 4b) a gold dot with a paler heart, flat. Added to the dark pool it lands on mid gold (it was 55 percent of
          // that, an ochre that read as brown); either part adds the same light, 0.40, so over a pale leaf it stays under the bloom
          vec3 col = r < .55 ? uInk[0] * .5 + uInk[1] * .25 : uInk[0] * .9;
          gl_FragColor = vec4(col * clamp(vK, 0., 1.), 1.);
        }`}),D=new t.Mesh(z,T);D.frustumCulled=!1,D.renderOrder=2,S.add(D)}await c.yield();const l=(e,a,s)=>new t.Vector3(e,a,s),me=ee.find(e=>e.dark),pe=ee.find(e=>!e.dark),Ne=Math.sign(me.base.x)||-1,Ae=l(Ne*.5,0,.866),ue=l(me.base.x-Ne*135,9.5,me.base.z-65),Me=ue.clone().addScaledVector(Ae,-120),rt={entry:{position:l(-23,258,-300),facing:l(0,0,1)},flyThrough:[l(-23,258,-300),l(-30,258,-215),l(-70,258,-140),l(-118,258,-75),l(-140,257.5,-30),l(-132,257,0),l(-108,256,10),l(-85,249,11.5),l(-40,199,12),l(10,144,12),l(60,88,12),l(98,46,13),l(120,20,24),l(118,10,52),l(80,9,88),l(30,9,108),Me.clone(),ue.clone()],portalSeat:{position:ue,facing:Ae.clone().negate(),travel:Ae.clone(),radius:7},approach:Me,viewpoints:{entry:{from:l(-23,258,-300),at:l(0,262,0)},brink:{from:l(-108,256,10),at:l(0,215,4)},curtain:{from:l(10,144,12),at:l(34,126,2)},pool:{from:l(80,9,88),at:l(0,4,60)},ring:{from:Me,at:ue}},curtainPoi:l(0,125,2),brink:{y:A,z:0,halfWidth:90},curtains:[-64,0,64].map(e=>({x:e,width:Mt,z:2})),piers:[-qe,qe],pool:{center:l(0,.4,55),halfWidth:100,length:110},peaks:ee,darkPeak:me,brightPeak:pe,whorlHem:l(pe.base.x-Math.sign(pe.base.x)*114,8,pe.base.z),window:ce},je=o.rare??F.rare??w<.08,Se=(e,a,s)=>Math.min(1,Math.max(0,(e-a)/(s-a))),Te=e=>{g.uGold.value=Math.min(3.05,Math.max(0,e))},ct=e=>{je&&Te(.3+.7*Se(e,0,.22)+Se(e,.26,.56)+1.05*Se(e,.56,.8))};F.gold&&Te(F.gold);const Oe=new t.Vector3,ft=new t.Matrix4,Qe=new t.Vector2;return{object:S,radius:F.radius,height:F.height,center:new t.Vector3(...F.center),anchors:rt,ground:!1,groundY:0,bounds:new t.Box3(l(-760,0,-700),l(760,300,860)),uniforms:g,leafUniforms:E.uniforms,skyUniforms:ne.uniforms,variant:{metal:u.name,scheme:r.name,march:["ranks","chevrons","echelon"][G],swap:_,rare:je},makeLeafMaterial:e=>e?ne:E,makePatternMaterial:Ie,inkOf:xe,inks:j,sky:Y,setProgress:ct,setRare:Te,update(e,a,s){g.uTime.value=a,s&&(S.updateWorldMatrix(!0,!1),Oe.setFromMatrixPosition(s.matrixWorld),g.uCamL.value.copy(Oe).applyMatrix4(ft.copy(S.matrixWorld).invert()),Y.position.copy(g.uCamL.value),s.isPerspectiveCamera&&(g.uTanHalf.value=Math.tan(s.fov*Math.PI/360)/(s.zoom||1))),c.renderer&&(c.renderer.getDrawingBufferSize(Qe),g.uViewH.value=Qe.y)},dispose(){}}}const F={radius:107,height:100,center:[0,100,200]};export{Dt as buildHero};
