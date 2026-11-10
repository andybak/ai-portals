import*as P from"three";import{clamp as Q,lerp as nt,smoothstep as pt}from"../kit/core.js";const kt=["#EDE3CC","#2F62A6","#3F8F5C","#B5532B","#DBA640","#1C1A18","#F8F4E9"],Wt="#7A3B22",Et=(n,s)=>`
  vec3 ${n}(vec2 p, vec2 rot, float cell, float tA, float tB, float jit, float base, vec2 grad, out vec2 nA, out vec2 nB, out vec2 cA){
    vec2 q = vec2(rot.x*p.x - rot.y*p.y, rot.y*p.x + rot.x*p.y)/cell, i0 = floor(q), f = q - i0;
    float lA = 9., kA = 9., lB = 9., kB = 9.;
    vec2 plA = vec2(0.), pkA = vec2(1., 0.), plB = vec2(0.), pkB = vec2(1., 0.);
    for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
      vec2 o = vec2(float(x), float(y)), i = i0 + o; float h = h21(i + 11.1);
      vec2 c = o + 0.5 + (vec2(h, fract(h*91.7)) - 0.5)*0.84;
      vec2 wr = (i0 + c)*cell, w = vec2(rot.x*wr.x + rot.y*wr.y, -rot.y*wr.x + rot.x*wr.y);
      float v = base + dot(grad, w - p)${s?" + 0.38*vnoise(w*0.085 + 7.)":""} + (fract(h*517.3) - 0.5)*jit;
      vec2 r = c - f; float d = dot(r, r);
      if (v > tA) { if (d < lA) { lA = d; plA = c; } } else if (d < kA) { kA = d; pkA = c; }
      if (v > tB) { if (d < lB) { lB = d; plB = c; } } else if (d < kB) { kB = d; pkB = c; }
    }
    vec2 a = pkA - plA, b = pkB - plB; float la = max(length(a), 1e-3), lb = max(length(b), 1e-3);
    a /= la; b /= lb;
    nA = vec2(rot.x*a.x + rot.y*a.y, -rot.y*a.x + rot.x*a.y); nB = vec2(rot.x*b.x + rot.y*b.y, -rot.y*b.x + rot.x*b.y);
    cA = (plA - f)*cell;
    return vec3((kA - lA)/(2.*la)*cell, h21(i0 + floor(plA) + 5.5), (kB - lB)/(2.*lb)*cell);
  }`,At=`
  uniform vec3 uPig[7];
  uniform vec3 uLineC, uShadeC, uSunL, uRimC;
  uniform vec4 uFront;
  uniform float uTime, uFrontW, uFrontX, uWeather, uFrontMin;
  float h21(vec2 p){ p = fract(p*vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x*p.y); }
  float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
    return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
  // dressed limestone: long diagonal chisel strokes as fine grey hatching, mean = uPig[0]. p in metres on the
  // surface, px = metres per pixel there (take fwidth outside any loop). Strokes melt into the flat tint when small.
  vec3 stoneAt(vec2 p, float px){
    vec2 q = vec2(p.x*0.8 + p.y*0.6, -p.x*0.6 + p.y*0.8);
    float near = 1. - smoothstep(0.05, 0.16, px), mid = 1. - smoothstep(0.35, 1.1, px);
    float a = vnoise(vec2(q.x*0.42, q.y*9.)) - 0.5;            // fine tooth strokes, 11 cm apart, 2.4 m long
    float b = vnoise(vec2(q.x*0.11 + 3., q.y*1.7 + 9.)) - 0.5; // the broader passes of the claw chisel
    float c = vnoise(p*0.035 + 17.) - 0.5;                     // the bed of the stone
    float nick = smoothstep(0.80, 0.86, vnoise(vec2(q.x*0.9 + 40., q.y*14.)))*near;
    return uPig[0]*(1. + 0.085*a*near + 0.075*b*mid + 0.035*c - 0.07*nick);
  }
  // the edge term, the only shading there is: e > 0 a wall facing the sun (lit rim, to 1.25),
  // e < 0 a wall turned from it (shadow line 0.55, tinted blue-grey). Returns the colour as it is seen.
  // (a chip of lost paint, found by paintAt, brings its own hairline and the red sketch that shows inside it)
  float gChipE = 0., gChipS = 0.;
  vec3 edgeTone(vec3 col, float e){
    col = mix(col, uPig[3], gChipS);
    e = mix(e, gChipE, step(0.05, abs(gChipE)));
    vec3 sh = mix(col, col*uShadeC*1.75, 0.9)*0.56;
    vec3 d = mix(col, sh, clamp(-e, 0., 1.));
    vec3 r = mix(vec3(1.), uRimC*1.25, clamp(e, 0., 1.));         // the lit wall of a cut: d*r, eased so it never passes 1
    return d*r/max(1. + (r - 1.)*d, 0.2);
  }
  // stage of the work at p (in the garden's own space): 0 bare, 1 grid, 2 outline, 3 cut, 4 colour.
  // The work stands in BANDS, each uFrontW metres deep, with a ragged but hard brush edge between one and the
  // next: colour (4.7) | cut, unpainted (3.5) | black outline (2.5) | the red grid being ruled (1..1.9) | bare.
  float stageAt(vec3 p){
    float B = max(uFrontW, 1.), T = max(0.1*B, 1.2), G = 3.*B;
    float rag = (vnoise(p.xz*0.07 + p.y*0.05) - 0.5)*min(0.55*B, 26.) + (vnoise(p.xz*0.43 + p.y*0.37 + 5.) - 0.5)*0.14*B;
    float s = dot(uFront.xyz, p) + uFront.w - uFrontX*abs(p.x) + rag;
    T = max(0.7*fwidth(s), 1e-3);                      // a brush edge is hard: one pixel of the stage value, no ramp
    float st = clamp((s + 2.*B + 2.*G)/G, 0., 1.) + 0.9*clamp((s + 2.*B + G)/G, 0., 1.)
      + 0.6*smoothstep(-T, T, s + 2.*B) + smoothstep(-T, T, s + B) + 1.2*smoothstep(-T, T, s);
    return max(st, uFrontMin*smoothstep(2., 6., p.y));
  }
  // the draughtsman's red grid, squares of 6 m, ruled line by line as the stage passes 0..1; g = line coverage
  float gridAt(vec2 p, float px, float st){
    vec2 c = p/6., f = abs(fract(c + 0.5) - 0.5)*6.;
    float w = max(0.08, 0.8*px);
    vec2 ln = (1. - smoothstep(w, w + px, f))*min(0.08/w + 0.4, 1.);
    float draw = clamp(st, 0., 1.);
    // each line is ruled whole, from the finished side outward: one threshold per line, so lines end at different lengths
    float gx = ln.x*step(fract(floor(c.x + 0.5)*0.618 + 0.11)*0.94, draw);
    float gy = ln.y*step(fract(floor(c.y + 0.5)*0.382 + 0.37)*0.94, draw);
    return max(gx, gy)*(1. - smoothstep(1.2, 2.6, px));
  }
  // old paint lets go as weathering, not as a pattern: a slow loss field (tens of metres) takes the paint away
  // wholesale and leaves whole fields intact; the border between paint and stone is broken into angular chips,
  // the cells of two jittered tessellations turned against each other (large chips, and small ones a third their
  // size that nibble the edge, lie loose in the paint just outside it and stay behind as specks just inside).
  // gLoss: set before paintAt to bias the loss (the fan's panel loses more with height).
  float gLoss = 0., gLost = 0.;
  // value noise with its gradient (x: value, yz: d/dp), from the same four hashes
  vec3 vnoised(vec2 p){ vec2 i = floor(p), f = fract(p), u = f*f*(3. - 2.*f), du = 6.*f*(1. - f);
    float a = h21(i), b = h21(i + vec2(1, 0)), c = h21(i + vec2(0, 1)), d = h21(i + vec2(1, 1)), k1 = b - a, k2 = c - a, k4 = a - b - c + d;
    return vec3(a + k1*u.x + k2*u.y + k4*u.x*u.y, du*vec2(k1 + k4*u.y, k2 + k4*u.x)); }
${Et("chipBig",!0)}${Et("chipSmall",!1)}  // paint at this stage: pigment floods the cut in one ragged brush edge as the stage passes 3.7..4; old paint
  // has let go (uWeather 0..1 = how much is gone). Leaves in gLost how much of the finished paint is lost here.
  float paintAt(vec2 p, float st, float px){
    float fine = 1. - smoothstep(0.25, 1.1, px);
    float n = mix(0.5, vnoise(p*0.55), fine)*0.6 + vnoise(p*0.06 + 11.)*0.4;
    float flood = smoothstep(3.7, 4.0, st - (n - 0.5)*0.3);
    vec2 s2 = vec2(uSunL.x, uSunL.z + uSunL.y); s2 /= max(length(s2), 1e-3);
    float thr = mix(0.84 - 0.6*uWeather, 0.41, smoothstep(0.2, 0.6, uWeather)), pxp = 0.4*px;
    const float C1 = 2.3, C2 = 0.72;
    vec2 n1, n1b, c1, n2a, n2b, c2;
    // the loss field here and its slope: the slow octave is carried to the seeds by its slope, the faster one is
    // read at each large seed; the small seeds take both by slope (they are within a metre)
    vec3 nA = vnoised(p*0.035 + 31.), nB = vnoised(p*0.085 + 7.);
    float LA = 0.62*nA.x + gLoss, L0 = LA + 0.38*nB.x; vec2 gA = nA.yz*0.0217, gB = nB.yz*0.0323;
    vec3 k1 = chipBig(p, vec2(0.8776, 0.4794), C1, thr, thr, 0.05, LA, gA, n1, n1b, c1);
    vec3 k2 = chipSmall(p + 5.3, vec2(0.6216, -0.7833), C2, thr + 0.05, thr - 0.055, 0.19, L0, gA + gB, n2a, n2b, c2);
    float on2 = 1. - smoothstep(0.1*C2, 0.26*C2, pxp), far = smoothstep(0.12*C1, 0.27*C1, pxp);
    float sdA = mix(-4., k2.x, on2), sdB = mix(4., k2.z, on2);
    float sd = k1.x; vec2 nrm = n1;
    if (sdB < sd) { sd = sdB; nrm = n2b; }
    if (sdA > sd) { sd = sdA; nrm = n2a; }
    float m = smoothstep(-pxp, pxp, sd);
    float l0 = L0 - thr, lf = smoothstep(-0.006 - 0.02*pxp, 0.006 + 0.02*pxp, l0);
    float lost = mix(m, lf, far);
    float hl = max(0.05, 2.2*pxp), band = m*(1. - smoothstep(hl - pxp, hl + pxp, sd))*(1. - far);
    gChipE = band*(dot(nrm, s2) > 0. ? -0.9 : 0.45)*flood;
    // the red first sketch shows again where the paint has gone: one stroke through a large chip, here and there
    float lw = max(0.04, 1.6*pxp), sa = k1.y*40.;
    float sk = (1. - smoothstep(lw, lw + pxp, abs(dot(c1, vec2(cos(sa), sin(sa))) - 0.3)))*step(0.72, k1.y)*(1. - smoothstep(0.05*C1, 0.15*C1, pxp));
    gChipS = sk*m*(1. - band)*0.4*flood*smoothstep(0., 0.3, k1.x);
    gLost = lost*flood;
    return flood*(1. - lost);
  }
`,Gt=`
  // one row: x = coverage of the soot line, y = the lit rim beside it, z = the shadow line on its other side.
  // The line is never more than ~4 px thick however near; rim and shadow are hard bands 1.5-3 px wide, no ramp.
  vec2 gFwW = vec2(0.01), gDxW = vec2(0.01, 0.), gDyW = vec2(0., 0.01);   // derivatives of the water's own coordinates, taken once in waterAt
  vec3 zigRow(vec2 p, float P, float px, vec2 sun2){
    float row = floor(p.y/P), dir = mod(row, 2.)*2. - 1.;
    float lam = 0.9*P, A = 0.22*P;
    float x = p.x + dir*uTime*0.42*sqrt(P) + row*1.37;
    float ph = fract(x/lam), up = step(0.5, ph)*2. - 1.;
    float tri = (abs(ph - 0.5)*4. - 1.)*A;
    float sd = (p.y - (row + 0.5)*P - tri)*0.714;          // signed distance to the line (slope ~0.98)
    vec2 n = vec2(-up*0.70, 0.714);                        // normal of this arm of the zigzag
    // what one pixel is worth ACROSS THIS ARM: the footprint measured along the arm's own normal, so the arm that
    // runs toward the eye (where a pixel is long in depth) is as thin on screen as the arm that runs across
    float pl = max(length(vec2(dot(n, gDxW), dot(n, gDyW))), 1e-4);
    float hw0 = 0.058*P, hw = clamp(hw0, 0.75*pl, max(2.1*pl, 0.012)), aa = 0.5*pl, bw = max(0.012, 1.9*pl), ad = abs(sd);
    float cov = (1. - smoothstep(hw - aa, hw + aa, ad))*min(hw0/hw + 0.1, 1.);
    float band = smoothstep(hw - aa, hw + aa, ad)*(1. - smoothstep(hw + bw - aa, hw + bw + aa, ad))*(1. - smoothstep(0.014*P, 0.034*P, px));
    float s = sign(sd)*dot(n, sun2);
    return vec3(cov, band*step(0.15, s), band*step(0.15, -s));
  }
  float gZig = 0.;        // set before waterAt: extra octaves of pitch (the bare black outline of the water is drawn bolder)
  vec4 waterAt(vec2 p, float px, vec2 sun2, float far, out float cov){
    gDxW = dFdx(p); gDyW = dFdy(p); gFwW = abs(gDxW) + abs(gDyW);
    float lv0 = log2(max(px, 1e-4)*2.6), lvl = clamp(lv0 + 0.7 + gZig, -1., 4.), l0 = floor(lvl), f = smoothstep(0.78, 1., lvl - l0);
    vec3 a = zigRow(p, 3.*exp2(l0), px, sun2), b = zigRow(p, 6.*exp2(l0), px, sun2);
    vec3 z = mix(a, b, f);
    float melt = max(smoothstep(2.9, 3.6, lv0), far);      // held steady: flat tint before the rows can shimmer
    z = mix(z, vec3(0.16, 0., 0.), melt); cov = z.x;
    float grain = (vnoise(p*7.) - 0.5)*(1. - smoothstep(0.04, 0.2, px));   // Egyptian blue is laid coarse
    vec3 col = mix(uPig[1]*(1. + 0.16*grain), uPig[5], z.x);
    col = mix(col, uPig[0], max(z.y, z.z));                // the rib's walls are stone: lit cream, or blue-grey in shadow
    return vec4(col, z.y - z.z);
  }
  // the skiff's wake: two zigzags of doubled height that run back from the bow and march astern.
  // uWake: bow x, bow z, strength. Returns x coverage, y rim, z shadow, w the strip of water the wake keeps clear.
  uniform vec4 uWake;
  vec4 wakeAt(vec2 p, float px, vec2 sun2){
    float sg = p.x < uWake.x ? -1. : 1.;
    vec2 q = vec2(abs(p.x - uWake.x) - 1.25, p.y - uWake.y);
    float al = dot(q, vec2(0.584, 0.811)), ac = q.x*0.811 - q.y*0.584;
    float lam = 1.7, A = 0.62, ph = fract((al - uTime*2.4)/lam), up = step(0.5, ph)*2. - 1.;
    float sd = (ac - (abs(ph - 0.5)*4. - 1.)*A)*0.565, ad = abs(sd);
    vec2 nl = vec2(-up*0.825, 0.565);                      // normal of this arm in (along, across)
    vec2 nw = nl.x*vec2(sg*0.584, 0.811) + nl.y*vec2(sg*0.811, -0.584);
    float pl = max(length(vec2(dot(nw, gDxW), dot(nw, gDyW))), 1e-4);
    float hw = clamp(0.09, 0.75*pl, max(2.4*pl, 0.012)), aa = 0.5*pl, bw = max(0.012, 1.9*pl);
    float on = uWake.z*step(0., al)*(1. - smoothstep(46., 52., al))*(1. - smoothstep(0.25, 0.6, px));
    float cov = 1. - smoothstep(hw - aa, hw + aa, ad);
    float band = smoothstep(hw - aa, hw + aa, ad)*(1. - smoothstep(hw + bw - aa, hw + bw + aa, ad));
    float s = sign(sd)*dot(nw, sun2);
    float clearW = on*(1. - smoothstep(A + 0.42 - aa, A + 0.42 + aa, abs(ac)));
    return vec4(cov, band*step(0.15, s), band*step(0.15, -s), clearW);
  }
`,ee=`
  attribute vec4 aOrg, aAnim, aAux;
  uniform float uTime, uFlight, uFish, uPxAng, uSlide;
  uniform vec3 uCamL, uEyeL;   // uCamL: the camera that triggers hinging; uEyeL: the eye that is drawing, both in garden space
  uniform vec4 uRise;          // x: all rise 0..1 override (-1 = by camera), y: finish fraction, z: look yaw, w: fish range
  uniform vec4 uFront; uniform float uFrontW, uFrontX;
  varying vec2 vUv; varying vec3 vG, vT, vB, vN; varying float vFace, vMode, vHide, vThin, vFlat, vStage, vInk;
  float vh21(vec2 p){ p = fract(p*vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x*p.y); }
  float vvn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
    return mix(mix(vh21(i), vh21(i + vec2(1, 0)), f.x), mix(vh21(i + vec2(0, 1)), vh21(i + vec2(1, 1)), f.x), f.y); }
  float kUp, cy, sy, flapA, hingeA; vec2 flight;
  vec3 rig(vec3 v, float w){
    int mode = int(aAnim.x + 0.5);
    // secondary hinge in the plane of the slab (tails, heads, feet, crowns), or a wing about the body's axis
    vec2 h = aAux.xy*w;
    if (mode == 3) { float c = cos(flapA), s = sin(flapA); v.y -= h.y; v = vec3(v.x, v.y*c - v.z*s, v.y*s + v.z*c); v.y += h.y; }
    else { float c = cos(hingeA), s = sin(hingeA); v.xy -= h; v = vec3(v.x*c - v.y*s, v.x*s + v.y*c, v.z); v.xy += h; }
    // lie down: -90 deg about x at the pivot when kUp = 0 (up goes to -z of the figure, the face looks at the sky)
    float a = -1.5707963*(1. - kUp), c = cos(a), s = sin(a);
    v = vec3(v.x, v.y*c - v.z*s, v.y*s + v.z*c);
    v = vec3(v.x*cy + v.z*sy, v.y, -v.x*sy + v.z*cy);
    return v;
  }
  void main(){
    int mode = int(aAnim.x + 0.5);
    float ph = aAnim.z*6.2831853;
    cy = cos(aOrg.w); sy = sin(aOrg.w);
    vec3 org = aOrg.xyz; kUp = 1.; flapA = 0.; flight = vec2(0.); vHide = 0.;
    hingeA = aAux.w < 0. ? aAux.z*uRise.z : aAux.z*sin(uTime*aAux.w + ph);
    if (mode == 1) {
      float d = uCamL.z - org.z;
      float k = 1. - smoothstep(aAnim.y*uRise.y, aAnim.y, d);
      k = uRise.x >= 0. ? clamp(uRise.x*1.6 - aAnim.z*0.6, 0., 1.) : k;
      kUp = k*k*(3. - 2.*k); kUp += 0.06*sin(kUp*3.14159)*sin(uTime*5. + ph);       // a stiff shudder on the way up
      // a lotus lies shut and opens like a fan as it comes upright (its two outer petals are the hinged parts)
      hingeA = hingeA*kUp - 2.7*aAux.z*step(0.1, abs(aAux.z))*step(aAux.w, 2.)*(1. - smoothstep(0.5, 1., kUp));
      org.y += 0.05 + 0.35*sin(kUp*3.14159) + aAnim.w*0.14*kUp*sin(uTime*1.9 + ph);
      org.x += aAnim.w*sign(org.x)*4.5*(1. - smoothstep(0., 45., d))*kUp;
    } else if (mode == 2) {
      kUp = 0.; float dir = aAnim.w, rng = uRise.w;
      float z = mod(org.z - uFish + dir*uTime*aAnim.y + rng*0.5, rng) - rng*0.5;
      org.z = z + uFish; org.y += 0.05; org.x += 0.6*sin(uTime*0.7 + ph);
    } else if (mode == 3) {
      float q = max(uFlight - aAnim.y*1.0 - aAnim.z*0.25, 0.);
      float lift = smoothstep(0., 1.2, q);
      flapA = aAux.z*lift*(0.25 + 0.75*(0.5 + 0.5*sin(uTime*aAux.w + ph*3. + aAnim.y)));
      float rise = 1.7*(q - (1. - exp(-q)));
      org += vec3(aAnim.w*(0.75*q + 2.*(1. - exp(-q*0.5))), rise + 0.5*sin(uTime*2.1 + ph)*lift, 0.8*q + 6.*(1. - exp(-q*0.7)));
      hingeA = 0.;
    } else if (mode == 4 || mode == 5) { kUp = 0.; hingeA = 0.; org.y += mode == 4 ? 0.02 : 0.05; }
    else if (mode == 6) hingeA = 0.;
    float run = 1.;
    if (mode == 7) {
      float rg = max(aAnim.y, 1.), sl = mod(aAnim.z*rg + uTime*aAnim.w + uSlide, rg) - rg*0.5;
      org += vec3(cy, 0., -sy)*sl; run = smoothstep(0., 5., rg*0.5 - abs(sl));
      org.y += 0.12*abs(sin(uTime*aAnim.w*1.4 + ph));
    }
    // rank -1: the umbels the far line drawing keeps are drawn larger there, so each stays a shape and not a dot
    if (mode == 0 && aAnim.y < -0.5) run *= 1. + 1.55*smoothstep(0.26, 0.6, uPxAng*distance(aOrg.xyz, uEyeL));
    // A THING THAT IS ONLY DRAWN IS NOT A SLAB YET. While a figure lies on the board ahead of the cutting front
    // (stage under 4: grid, black outline, or cut but not yet painted) it has no thickness, and its rim is laid out flat round it as the
    // draughtsman's contour: one closed band about two pixels wide on screen whatever the distance and however the
    // board is tipped (the band is widened along the line of sight by 1/sin of the grazing angle). The slab takes
    // its full thickness as the paint front passes.
    vec3 lp = position*run; vFlat = 0.; vStage = -1.; vInk = 1.; vec3 skirt = vec3(0.);
    // (the same holds for a tree that has already stood up beyond the paint front: its contour is its own rim)
    float lie = (mode == 1 || mode == 2 || mode == 5) ? 1. : 0.;
    if (lie > 0.) {
      float FB = max(uFrontW, 1.);
      float rag = (vvn(org.xz*0.07 + org.y*0.05) - 0.5)*min(0.55*FB, 26.) + (vvn(org.xz*0.43 + org.y*0.37 + 5.) - 0.5)*0.14*FB;
      float sF = dot(uFront.xyz, org) + uFront.w - uFrontX*abs(org.x) + rag;
      // the work reaches a lying figure WHOLE, figure by figure (its stage is read once, at its root, and handed to the
      // fragment shader), so its contour, its cut and its paint never disagree across it
      float FR = 0.12*FB, FG = 3.*FB;
      float stv = clamp((sF + 2.*FB + 2.*FG)/FG, 0., 1.) + 0.9*clamp((sF + 2.*FB + FG)/FG, 0., 1.)
        + 0.6*smoothstep(-FR, FR, sF + 2.*FB) + smoothstep(-FR, FR, sF + FB) + 1.2*smoothstep(-FR, FR, sF);
      vStage = stv;
      vec3 ve = org - uEyeL, fn = rig(vec3(0., 0., 1.), 0.);      // fn: the normal of the figure's face, in garden space
      float vl = max(length(ve), 1e-3), sinG = abs(dot(ve, fn))/vl, mpp = uPxAng*vl;
      // flat until the colour comes; and only where the figure's own drawn lines are too fine to carry it (beyond
      // ~35-80 m): near the eye it is the slab it always was, drawn with the lines of its atlas
      vFlat = lie*(1. - smoothstep(3.6, 4.4, stv))*smoothstep(0.09, 0.2, mpp);
      // where the board is seen so flat that a crown is under three pixels deep, the contour stands back to a light line
      // (a mark under three pixels is stipple, not a line); this is a rule of the cutting on the board, never of distance
      vInk = mix(0.5, 1., smoothstep(1.0, 2.8, 5.*sinG/max(mpp, 1e-5)));
      // and a figure under about ten pixels long (a pad, a bud) is left undrawn until it can be a shape: never a ring-dot
      float fsize = mode == 1 ? aAnim.y*0.12 : mode == 2 ? 9. : 3.;
      // one ramp: nothing under 6 pixels, and from 11 pixels of length on the contour is at full strength whatever the angle
      float big = smoothstep(6., 11., fsize/max(mpp, 1e-5)); vInk = mix(vInk, 1., big)*big;
      if (normal.z < 0.5) {
        // the rim is laid a finger above the face, so a neighbour's blank stone never covers part of a contour
        if (normal.z < 0.2 && position.z < 0.) lp.z = mix(lp.z, -lp.z + 0.06, vFlat); else lp.z += 0.22*vFlat;
        vec2 n2 = normal.xy/max(length(normal.xy), 1e-3);
        vec3 ng = rig(vec3(n2, 0.), 0.);
        vec3 vin = ve - fn*dot(ve, fn); vin /= max(length(vin), 1e-3);       // the line of sight laid into the figure's plane
        ng += vin*dot(ng, vin)*(1./clamp(sinG, 0.16, 1.) - 1.);
        skirt = ng*(1.3*uPxAng*vl*smoothstep(0.3, 0.7, vFlat));
      }
    }
    vec3 p = rig(lp, 1.) + org + skirt;
    if (mode == 0 || mode == 6) {       // stems, umbels, wreath: sway that grows with height, shared so that parts stay joined
      float hh = p.y*0.0143; float sw = aAnim.w*hh*hh*(sin(uTime*0.9 + p.x*0.05) + 0.4*sin(uTime*2.3 + ph));
      p.x += sw; p.z += 0.3*sw;
    }
    if (mode == 6) {       // a thin ribbon never draws under ~1.6 px: aAux.xy = offset from its centre line, aAux.z = its width there
      float k = max(1., uPxAng*distance(p, uEyeL)*2.8/max(aAux.z, 1e-3)); p += rig(vec3(aAux.xy, 0.), 0.)*(k - 1.);
    }
    vN = rig(normal, 0.); vT = rig(vec3(1., 0., 0.), 0.); vB = rig(vec3(0., 1., 0.), 0.);
    vFace = step(0.9, abs(normal.z)); vMode = aAnim.x; vUv = uv; vG = p;
    // far off, while a thing is only drawn, the drawing is kept bold and sparse: most stems, umbels and birds are left out
    vThin = (mode == 3 ? 1. : (mode == 0 || mode == 6) ? aAnim.y : 0.) - 1. + smoothstep(0.2, 0.34, uPxAng*distance(p, uEyeL));
    gl_Position = projectionMatrix*modelViewMatrix*vec4(p, 1.);
  }`,oe=`
  ${At}
  uniform sampler2D uAtlasC, uAtlasD;     // C: display colour with the outline painted in. D: r depth of cut, g paint, b outline
  varying vec2 vUv; varying vec3 vG, vT, vB, vN; varying float vFace, vMode, vThin, vFlat, vStage, vInk;
  void main(){
    vec2 fw = fwidth(vG.xz) + fwidth(vG.y); float px = max(max(fw.x, fw.y)*0.6, 1e-4);
    float uvpx = length(fwidth(vUv));
    vec4 d = texture2D(uAtlasD, vUv); float fgr = max(fwidth(d.r), 1e-4);      // taken here, outside every branch; never 0
    float st = stageAt(vG); if (vStage > -0.5) st = vStage;     // a figure of the garden is worked whole (see SLAB_VS)
    if (vThin > 0. && st < 3.65) discard;
    vec3 col; float e;
    vec2 sp = vG.xz + vG.y*vec2(0.31, 0.95);
    vec3 stone = stoneAt(sp, px);
    if (vFace > 0.5) {
      vec3 c = texture2D(uAtlasC, vUv).rgb;
      vec2 L = vec2(dot(uSunL, vT), dot(uSunL, vB)); L /= max(length(L), 0.45);
      vec2 o = L*max(5.5/2048., 1.3*uvpx);
      float cut = smoothstep(2.5, 3.5, st);
      float farFlat = vFlat*smoothstep(0.12, 0.3, px);             // far off, a figure not yet painted is a clean drawing: no relief inside it
      e = (texture2D(uAtlasD, vUv + o).r - texture2D(uAtlasD, vUv - o).r)*1.5*cut*(1. - farFlat);
      float sock = step(3.5, vMode)*step(vMode, 4.5);
      float paint = d.g*paintAt(sp, st, px)*(1. - 0.86*sock); gChipE *= d.g; gChipS *= d.g*(1. - d.b);
      vec3 thin = mix(c, stone, 0.22*step(c.r + 0.06, c.g)*vnoise(sp*1.3));       // malachite goes thin
      col = mix(stone*(1. - 0.045*d.r*cut*(1. - farFlat)), thin, paint);
      // the outline drawn before the colour: soot, and never thinner than about 1.5 px however far the figure is
      float lpx = 3./2048./max(uvpx, 1e-6), drawn = smoothstep(1.9, 2.5, st)*(1. - smoothstep(3.6, 4.4, st));
      // far off its inner lines cannot be told apart, so a figure that is only drawn is its contour: one line about
      // two pixels wide where the cut begins (an umbel is an open bell, the cat a shape), from the smooth depth mask
      float contour = 1. - smoothstep(0.7*fgr, 1.7*fgr, abs(d.r - 0.45));
      // (a figure lying on the board has its contour laid round it as geometry, see SLAB_VS: none is read from the mask)
      // and inside it stays clean stone until its inner lines can be told apart; a socket under a lying figure draws no black)
      float first = mix(contour*step(2e-4, fgr)*(1. - vFlat), min(d.b*clamp(2.3/lpx, 1., 8.), 1.), smoothstep(0.4 + 0.3*vFlat, 0.85 + 0.3*vFlat, lpx))*drawn*(1. - sock);
      first = max(first, step(5.5, vMode)*step(vMode, 6.5)*smoothstep(0.12, 0.3, px)*drawn);   // a far stem is one drawn line
      col = mix(col, uPig[5], first*0.96);
      col = mix(col, c, d.b*smoothstep(3.7, 4.2, st)*(1. - paint));               // the outline outlasts the paint it bounds
      col = mix(col, uPig[3], sock*d.b*0.5);                                      // the red sketch left in the socket
      col = mix(col, uPig[3], gridAt(sp, px, st - 1.)*0.55*(1. - smoothstep(3.6, 4.6, st))*(1. - 0.6*smoothstep(1.9, 2.5, st))*(1. - first));
    } else {
      vec3 N = vN/max(length(vN), 1e-4);
      col = stone; e = clamp(dot(N, uSunL)*1.7, -1., 1.);
      e *= max(smoothstep(2.5, 3.5, st), 1. - smoothstep(0.15, 0.5, px));      // far off, what is only drawn has no wall yet
      // the rim of a figure that is only drawn is its black contour (laid flat round it in SLAB_VS)
      float ring = smoothstep(0.3, 0.7, vFlat)*smoothstep(1.9, 2.5, st)*(1. - smoothstep(3.6, 4.4, st));
      col = mix(col, uPig[5], 0.96*ring*vInk); e *= 1. - vFlat;
    }
    gl_FragColor = vec4(edgeTone(col, clamp(e, -1., 1.)), 1.);
  }`,ae=`
  varying vec3 vG, vN;
  void main(){ vG = position; vN = normal; gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.); }`,se=`
  ${At}
  ${Gt}
  uniform vec4 uPool;            // centre x, z, half x, half z
  uniform vec4 uSlab;            // half x, half z, water rise (m, for vertical water panels), panel flag
  uniform vec3 uEyeL;
  uniform vec2 uSeason;          // x: metres the inundation covers beyond the basin, y: width of the low-water mud margin
  varying vec3 vG, vN;
  // edge term inside a sunk rectangle (q from its centre, half size hf), band w metres wide
  float pitEdge(vec2 q, vec2 hf, vec2 s2, float w, float px){
    vec2 dd = hf - abs(q); float inside = step(0., min(dd.x, dd.y));
    vec2 b = (1. - smoothstep(w, w + px, dd))*inside;
    float ex = -sign(q.x)*s2.x*b.x, ey = -sign(q.y)*s2.y*b.y;
    return clamp((abs(ex) > abs(ey) ? ex : ey)*2.2, -1., 1.);
  }
  void main(){
    vec2 p = vG.xz; vec2 fw = fwidth(p); float px = max(max(fw.x, fw.y)*0.75, 1e-4);
    vec3 N = vN/max(length(vN), 1e-4);
    float st = stageAt(vG), cut = smoothstep(2.5, 3.5, st), ink = smoothstep(1.9, 2.5, st);
    vec3 stone = stoneAt(p + vG.y*vec2(0.3, 0.9), px); vec3 col = stone; float e = 0.;
    vec2 sun2 = uSunL.xz/max(length(uSunL.xz), 1e-3);
    if (N.y < 0.7) {                           // real walls: the basin and the edge of the board
      e = clamp(dot(N, uSunL)*1.7, -1., 1.)*max(cut, step(uSlab.x - 1., abs(p.x)) + step(uSlab.y - 1., abs(p.y)));
    } else {
      vec2 q = p - uPool.xy; vec2 dq = abs(q) - uPool.zw; float d = max(dq.x, dq.y);
      float farM = smoothstep(300., 400., distance(vG, uEyeL))*smoothstep(3.6, 4.0, st);
      gZig = 1.3*(1. - smoothstep(3.6, 4.0, st));
      float lw = max(0.09, 0.8*px), lk = min(0.09/lw + 0.15, 1.);
      if (d < uSeason.x) {                     // the pool, in plan (in the inundation it covers the banks)
        float zc; vec4 w = waterAt(p, px, sun2, farM, zc);
        vec4 wk = wakeAt(p, px, sun2);
        w = mix(w, vec4(mix(mix(uPig[1], uPig[5], wk.x), uPig[0], max(wk.y, wk.z)), wk.y - wk.z), wk.w); zc = mix(zc, wk.x, wk.w);
        float pnt = paintAt(p*0.5, st, px);
        vec3 bare = mix(stone*(1. - 0.04*cut), mix(uPig[5], uPig[3], gLost), ink*zc*mix(0.85, 0.7, gLost));
        col = mix(bare, w.rgb, pnt);
        e = w.a*cut*step(0.5, pnt + 0.5*cut);
        float mud = smoothstep(-0.5, 0.5, d + uSeason.y + 3.*(vnoise(p*0.21) - 0.5))*step(0.01, uSeason.y)*step(d, 0.);
        col = mix(col, mix(uPig[5], uPig[3], 0.22 + 0.5*step(0.72, vnoise(p*1.7))), mud*pnt); e *= 1. - mud;
        float pe = pitEdge(q, uPool.zw, sun2, 1.3, px)*cut; e = abs(pe) > 0.05 ? min(pe, 0.) : e;
      } else {
        // coping line, then the block border: blue, red, green, yellow between white bars
        float cop = (1. - smoothstep(lw, lw + px, abs(d - 1.1)))*lk;
        float along = dq.x > dq.y ? q.y : q.x, v = d - 5.;              // v across the band, -1.6..1.6
        float cell = floor(along/3.2), f = (fract(along/3.2) - 0.5)*3.2;
        vec2 bq = vec2(f, v), bh = vec2(1.25, 1.25);
        float inB = step(abs(f), bh.x)*step(abs(v), bh.y)*step(max(dq.x, dq.y) , 7.)*(1. - smoothstep(0.5, 1.6, px));
        float inBand = step(abs(v), 1.9);
        float k = mod(cell, 4.);
        vec3 pg = k < 0.5 ? uPig[1] : k < 1.5 ? uPig[3] : k < 2.5 ? uPig[2] : uPig[4];
        vec3 bandFar = mix(uPig[6], (uPig[1] + uPig[3] + uPig[2] + uPig[4])*0.25, 0.5);
        float pnt = paintAt(p*0.5 + 9., st, px); gChipE *= inBand; gChipS *= inBand;
        vec3 bandC = mix(mix(uPig[6], pg, inB), bandFar, smoothstep(0.5, 1.6, px));
        col = mix(col, bandC, inBand*pnt);
        float bl = max(1. - smoothstep(lw, lw + px, abs(abs(v) - 1.9)), inB > 0.5 ? 1. - smoothstep(lw, lw + px, min(bh.x - abs(f), bh.y - abs(v))) : 0.)*lk;
        col = mix(col, mix(uPig[5], uLineC, smoothstep(3.6, 4.4, st)), max(bl*step(abs(v), 2.1), cop)*ink);
        e = pitEdge(bq, bh, dq.x > dq.y ? sun2.yx : sun2, 0.22, px)*inB*cut;
        // the ruled double baseline round the edge of the board
        vec2 ds = uSlab.xy - abs(p); float de = min(ds.x, ds.y);
        float base = max(1. - smoothstep(lw, lw + px, abs(de - 2.)), 1. - smoothstep(lw, lw + px, abs(de - 2.8)))*lk;
        col = mix(col, uLineC, base*ink);
      }
      col = mix(col, uPig[3], gridAt(p, px, st - 1.)*0.6*(1. - smoothstep(3.6, 4.6, st)));
    }
    gl_FragColor = vec4(edgeTone(col, e), 1.);
  }`;function ne(n=kt,s=Wt){const t=n.slice(0,7).map(c=>new P.Color(c));for(;t.length<7;)t.push(new P.Color(kt[t.length]));return{uPig:{value:t},uLineC:{value:new P.Color(s)},uShadeC:{value:new P.Color("#8fa3c4")},uRimC:{value:new P.Vector3(1.27,1.27,1.27)},uSunL:{value:new P.Vector3(.6,.28,.75).normalize()},uFront:{value:new P.Vector4(0,0,1,1e4)},uFrontW:{value:130},uFrontX:{value:.35},uFrontMin:{value:0},uWeather:{value:0},uTime:{value:0},uFlight:{value:0},uCamL:{value:new P.Vector3(0,40,400)},uEyeL:{value:new P.Vector3(0,40,400)},uPxAng:{value:.0012},uRise:{value:new P.Vector4(-1,.25,0,280)},uAtlasC:{value:null},uAtlasD:{value:null},uFish:{value:30},uSlide:{value:0},uWake:{value:new P.Vector4(0,0,0,0)}}}function ie(n){return new P.ShaderMaterial({uniforms:n,vertexShader:ee,fragmentShader:oe,side:P.DoubleSide})}function Rt(n,s={},t=se,c=ae){return new P.ShaderMaterial({uniforms:{...n,...s},vertexShader:c,fragmentShader:t})}const Y=Math.PI*2;function C(n,s=5){const t=n.length,c=[];for(let l=0;l<t;l++){const i=n[(l+t-1)%t],e=n[l],r=n[(l+1)%t],o=n[(l+2)%t];for(let h=0;h<s;h++){const f=h/s,x=f*f,d=x*f;c.push([.5*(2*e[0]+(r[0]-i[0])*f+(2*i[0]-5*e[0]+4*r[0]-o[0])*x+(3*e[0]-i[0]-3*r[0]+o[0])*d),.5*(2*e[1]+(r[1]-i[1])*f+(2*i[1]-5*e[1]+4*r[1]-o[1])*x+(3*e[1]-i[1]-3*r[1]+o[1])*d)])}}return c}const le=n=>{let s=0;for(let t=0,c=n.length;t<c;t++){const l=n[(t+1)%c];s+=n[t][0]*l[1]-l[0]*n[t][1]}return s},j=n=>le(n)<0?n.slice().reverse():n;function $(n,s){const t=n.length,c=[];for(let l=0;l<t;l++){const i=n[(l+t-1)%t],e=n[l],r=n[(l+1)%t];let o=e[1]-i[1]+(r[1]-e[1]),h=-(e[0]-i[0])-(r[0]-e[0]);const f=Math.hypot(o,h)||1;c.push([e[0]+o/f*s,e[1]+h/f*s])}return c}const re=(n,s,t,c,l=14,i=0)=>{const e=[],r=Math.cos(i),o=Math.sin(i);for(let h=0;h<l;h++){const f=h/l*Y,x=Math.cos(f)*t,d=Math.sin(f)*c;e.push([n+x*r-d*o,s+x*o+d*r])}return e},q=(n,s,t,c,l,i=5,e=.4)=>{const r=t-n,o=c-s,h=Math.hypot(r,o)||1,f=-o/h,x=r/h,d=[];for(let F=0;F<=i;F++){const y=F/i,p=Math.sin(Math.PI*Math.pow(y,1-e*.6))*l;d.push([n+r*y+f*p,s+o*y+x*p])}for(let F=i-1;F>0;F--){const y=F/i,p=Math.sin(Math.PI*Math.pow(y,1-e*.6))*l;d.push([n+r*y-f*p,s+o*y-x*p])}return d},Pe=(n,s,t=s,c=0,l=0)=>n.map(i=>[i[0]*s+c,i[1]*t+l]);function ce(n,s,t){const c=()=>{const y=document.createElement("canvas");return y.width=y.height=n,y},l=c(),i=c(),e=l.getContext("2d"),r=i.getContext("2d");e.fillStyle=s[0],e.fillRect(0,0,n,n),r.fillStyle="#000",r.fillRect(0,0,n,n),e.lineJoin=r.lineJoin="round",e.lineCap=r.lineCap="round";let o=8,h=8,f=0;const x=(y,p,A=!0)=>{y.beginPath(),y.moveTo(p[0][0],p[0][1]);for(let v=1;v<p.length;v++)y.lineTo(p[v][0],p[v][1]);A&&y.closePath()};function d(y,p,A){o+y+8>n&&(o=8,h+=f+16,f=0);const v=o,m=h;o+=y+16,f=Math.max(f,p);const S=y/(A[2]-A[0]),k=p/(A[3]-A[1]),M=Math.min(S,k);for(const T of[e,r])T.setTransform(S,0,0,-k,v-A[0]*S,m+p+A[1]*k);const R=Math.max(.085,2.2/M),V={lw:R,ppm:M,poly(T,D,O={}){O.sketch!==!1&&(e.save(),e.translate(R*.9,R*.6),x(e,T),e.strokeStyle=s[3],e.globalAlpha=.55,e.lineWidth=R*.6,e.stroke(),e.restore()),x(e,T),e.fillStyle=s[D],e.fill(),x(r,T),r.fillStyle=D===0?"#ff0000":"#ffff00",r.fill(),O.line!==!1&&(e.strokeStyle=t,e.lineWidth=R,e.stroke(),r.strokeStyle="#a0ffff",r.lineWidth=R,r.stroke())},ridge(T,D=-1,O=1,Z=!1){x(e,T,Z),e.strokeStyle=D<0?t:s[D],e.lineWidth=R*O,e.stroke(),x(r,T,Z),r.strokeStyle="#00ffff",r.lineWidth=R*O*1.15,r.stroke()},flat(T,D){x(e,T),e.fillStyle=s[D],e.fill()},dot(T,D,O,Z,I=!0){V.poly(re(T,D,O,O,10),Z,{sketch:!1,line:I})}};return V.uv=(T,D)=>[(v+(T-A[0])*S)/n,1-(m+p-(D-A[1])*k)/n],V}return{tile:d,finish:y=>{const p=(A,v)=>{const m=new P.CanvasTexture(A);return m.colorSpace=v?P.SRGBColorSpace:P.NoColorSpace,m.anisotropy=4,m.generateMipmaps=!0,m.minFilter=P.LinearMipmapLinearFilter,m};return[p(l,!0),p(i,!1)]}}}function K(n,s,t={}){const c=t.thick??.5,l=t.bevel??.16,i=j(n),e=i.length,r=$(i,-l),o=P.ShapeUtils.triangulateShape(r.map(p=>new P.Vector2(p[0],p[1])),[]),h=e*4,f=new Float32Array(h*3),x=new Float32Array(h*3),d=new Float32Array(h*2),F=[],y=(p,A,v,m,S,k,M)=>{f[p*3]=A,f[p*3+1]=v,f[p*3+2]=m,x[p*3]=S,x[p*3+1]=k,x[p*3+2]=M;const R=s(A,v);d[p*2]=R[0],d[p*2+1]=R[1]};for(let p=0;p<e;p++){const A=i[(p+e-1)%e],v=i[p],m=i[(p+1)%e];let S=v[1]-A[1]+(m[1]-v[1]),k=-(v[0]-A[0])-(m[0]-v[0]);const M=Math.hypot(S,k)||1;S/=M,k/=M,y(p,r[p][0],r[p][1],c/2,0,0,1),y(e+p,r[p][0],r[p][1],c/2,S*.6,k*.6,.8),y(2*e+p,v[0],v[1],c/2-l,S*.92,k*.92,.39),y(3*e+p,v[0],v[1],-c/2,S,k,0)}for(const p of o)F.push(p[0],p[1],p[2]);for(let p=0;p<e;p++){const A=(p+1)%e;for(const v of[e,2*e])F.push(v+p,v+e+p,v+A,v+A,v+e+p,v+e+A)}return{pos:f,nrm:x,uv:d,idx:F,nv:h}}function Dt(n){const s=new Float32Array(n*3),t=new Float32Array(n*3),c=new Float32Array(n*2),l=new Float32Array(n*4),i=new Float32Array(n*4),e=new Float32Array(n*4),r=[];let o=0;return{get count(){return o},add(h,f,x,d,F=[0,0,0,0],y=1,p=!1,A=0){if(o+h.nv>n)return;const v=p?-1:1,m=Math.cos(A),S=Math.sin(A);for(let k=0;k<h.nv;k++){const M=o+k;if(s[M*3]=h.pos[k*3]*y*v,s[M*3+1]=h.pos[k*3+1]*y,s[M*3+2]=h.pos[k*3+2]*Math.min(y,1.5),t[M*3]=h.nrm[k*3]*v,t[M*3+1]=h.nrm[k*3+1],t[M*3+2]=h.nrm[k*3+2],c[M*2]=h.uv[k*2],c[M*2+1]=h.uv[k*2+1],l[M*4]=f[0],l[M*4+1]=f[1],l[M*4+2]=f[2],l[M*4+3]=x,i[M*4]=d[0],i[M*4+1]=d[1],i[M*4+2]=d[2],i[M*4+3]=d[3],e[M*4]=F[0]*y*v,e[M*4+1]=F[1]*y,e[M*4+2]=F[2]*v,e[M*4+3]=F[3],h.off&&(e[M*4]=h.off[k*2]*y*v,e[M*4+1]=h.off[k*2+1]*y,e[M*4+2]=h.wid[k]*y),A){const R=s[M*3],V=s[M*3+1],T=t[M*3],D=t[M*3+1],O=e[M*4],Z=e[M*4+1];s[M*3]=R*m-V*S,s[M*3+1]=R*S+V*m,t[M*3]=T*m-D*S,t[M*3+1]=T*S+D*m,e[M*4]=O*m-Z*S,e[M*4+1]=O*S+Z*m}}if(p)for(let k=0;k<h.idx.length;k+=3)r.push(o+h.idx[k],o+h.idx[k+2],o+h.idx[k+1]);else for(let k=0;k<h.idx.length;k++)r.push(o+h.idx[k]);o+=h.nv},mesh(h){const f=new P.BufferGeometry,x=(F,y)=>new P.BufferAttribute(F.subarray(0,o*y),y);f.setAttribute("position",x(s,3)),f.setAttribute("normal",x(t,3)),f.setAttribute("uv",x(c,2)),f.setAttribute("aOrg",x(l,4)),f.setAttribute("aAnim",x(i,4)),f.setAttribute("aAux",x(e,4)),f.setIndex(o>65535?new P.BufferAttribute(new Uint32Array(r),1):new P.BufferAttribute(new Uint16Array(r),1));const d=new P.Mesh(f,h);return d.frustumCulled=!1,d}}}const it=.3,E=(n,s,t={})=>({uvf:n.uv,outline:s,geo:K(s,n.uv,t),hinge:t.hinge??[0,0],amp:t.amp??0,freq:t.freq??0});function he(n,s){const t=n.tile(300,440,[-9,-.3,9,23]),c=C([[-1.9,0],[-1.1,3.2],[-1.3,6.6],[-6.2,8.4],[-8.4,13.2],[-6.8,19.2],[0,22.4],[6.8,19.2],[8.4,13.2],[6.2,8.4],[1.3,6.6],[1.1,3.2],[1.9,0]],4);t.poly([[-1.4,.25],[-.75,3.2],[-.8,7.9],[.8,7.9],[.75,3.2],[1.4,.25]],3),t.ridge([[-.2,.8],[-.1,7.2]]),t.ridge([[.35,1.5],[.3,6.4]]);const l=C([[-5.4,8.9],[-7.9,13.2],[-6.4,18.9],[0,22],[6.4,18.9],[7.9,13.2],[5.4,8.9],[0,8.1]],5);t.poly(l,2);for(let i=0;i<6;i++){const e=10.3+i*1.95,r=7.4*Math.sqrt(Math.max(1-((e-14.6)/7.6)**2,.02))-.7,o=Math.max(2,Math.round(r/1.15)),h=[];for(let f=0;f<=o*6;f++){const x=f/(o*6),d=-r+2*r*x;h.push([d,e+.75*Math.abs(Math.sin(x*o*Math.PI+i%2*1.57))])}t.ridge(h,5,.8)}for(let i=0;i<9;i++){const e=s()*Y,r=1.5+s()*4;t.dot(Math.cos(e)*r*1.05,14.8+Math.sin(e)*r*1.1,.5,3)}return{parts:[E(t,c)],h:22.4}}function fe(n,s){const t=n.tile(300,440,[-9,-.3,9,23]),c=[0,15.2],l=[],i=9,e=[[1.5,0],[.75,5],[.85,9.5],[3.2,8.4],[4.4,9.2],[3.5,11.7],[2.5,13.1],[3.7,13.7]];for(let o=0;o<i;o++)l.push(-.42+(Math.PI+.84)*o/(i-1));l.forEach((o,h)=>{const f=7.3-.9*Math.abs(Math.cos(o))*(h%2);if(e.push([c[0]+Math.cos(o-.1)*f,c[1]+Math.sin(o-.1)*f*.98],[c[0]+Math.cos(o+.1)*f,c[1]+Math.sin(o+.1)*f*.98]),h<i-1){const x=o+(l[1]-l[0])/2;e.push([c[0]+Math.cos(x)*4.4,c[1]+Math.sin(x)*4.4])}}),e.push([-3.7,13.7],[-2.5,13.1],[-3.5,11.7],[-4.4,9.2],[-3.2,8.4],[-.85,9.5],[-.75,5],[-1.5,0]);const r=[[-1.05,.25],[-.45,5],[-.5,14.4],[.5,14.4],[.45,5],[1.05,.25]];t.poly(r,3);for(let o=1.4;o<14;o+=1.25)t.ridge([[-.55,o+.5],[0,o],[.55,o+.5]],5,.7);for(const o of[-1,1])t.poly(q(o*.9,13.6,o*3.5,9.3,.95,5,.1),4),t.ridge([[o*1.2,13.1],[o*3.2,9.9]],3,.7);return l.forEach((o,h)=>{const f=6.9-.9*Math.abs(Math.cos(o))*(h%2),x=c[0]+Math.cos(o)*f,d=c[1]+Math.sin(o)*f*.98;t.poly(q(c[0]+Math.cos(o)*1,c[1]+Math.sin(o)*1,x,d,.82,5,.25),2),t.ridge([[c[0]+Math.cos(o)*1.4,c[1]+Math.sin(o)*1.4],[c[0]+Math.cos(o)*(f-.8),c[1]+Math.sin(o)*(f-.8)*.98]],5,.6)}),t.dot(c[0],c[1]-.1,.95,4),{parts:[E(t,C(e,2))],h:22.5}}function pe(n,s){const t=n.tile(300,440,[-9,-.3,9,23]),c=(r,o,h)=>{const f=[];for(let x=0;x<=12;x++){const d=h-1.75+3.5*x/12,F=x%2?5.3:4.5;f.push([r+Math.sin(d)*F,o+Math.cos(d)*F])}return f},l=c(-4.4,15.6,-.28),i=c(4.4,15.6,.28),e=[[1.5,0],[.8,4.5],[1.2,8.2],[4.6,12.6],...i.slice().reverse(),[2.6,13.4],[0,10.6],[-2.6,13.4],...l.slice().reverse(),[-4.6,12.6],[-1.2,8.2],[-.8,4.5],[-1.5,0]];t.poly([[-1.05,.25],[-.5,4.5],[-.75,8.3],[-4.6,14.4],[-3.7,14.9],[0,9.6],[3.7,14.9],[4.6,14.4],[.75,8.3],[.5,4.5],[1.05,.25]],3);for(let r=1.3;r<8;r+=1.1)t.ridge([[-.6,r],[.6,r]],5,.7);for(const[r,o]of[[-4.4,-.28],[4.4,.28]]){for(let h=0;h<7;h++){const f=o-1.5+3*h/6;t.poly(q(r+Math.sin(f)*.9,15.6+Math.cos(f)*.9,r+Math.sin(f)*4.9,15.6+Math.cos(f)*4.9,.72,4,.5),2,{sketch:h%2===0})}for(let h=0;h<3;h++)t.dot(r-1+h,14.3-h%2*.5,.52,4)}return{parts:[E(t,C(e,2))],h:21}}function ue(n,s){const t=n.tile(260,300,[-6,-.3,6,13.5]),c=C([[-1.2,0],[-.7,2.2],[-3.9,3.9],[-5.4,7.6],[-3.8,11.6],[0,13.1],[3.8,11.6],[5.4,7.6],[3.9,3.9],[.7,2.2],[1.2,0]],4);t.poly([[-.8,.25],[-.35,2.4],[-.3,5],[.3,5],[.35,2.4],[.8,.25]],3),t.poly(C([[-3.3,4.4],[-4.7,7.6],[-3.3,11.1],[0,12.5],[3.3,11.1],[4.7,7.6],[3.3,4.4],[0,3.7]],4),2);for(const l of[-1,1])for(let i=0;i<3;i++)t.ridge([[0,4.2+i*2.2],[l*(2.4+i*.3),6+i*2.1]],3,.9);for(let l=0;l<26;l++){const i=l*2.39996,e=.7+3*Math.sqrt((l+.5)/26),r=Math.cos(i)*e*1.05,o=8.2+Math.sin(i)*e*1.05;l%4===3?(t.dot(r,o,.56,3),t.flat([[r-.2,o+.5],[r,o+.85],[r+.2,o+.5]],3)):t.ridge(q(r-.6,o-.25+l%3*.25,r+.6,o+.25-l%3*.25,.3,3),5,.6,!0)}return{parts:[E(t,c)],h:13.1}}function It(n,s){const t=n.tile(190,280,[-3,-.3,3,8.6]),c=[[.75,0],[.5,4.7],[1.25,5.3],[1.5,7.2],[.75,8.2],[0,8.45],[-.75,8.2],[-1.5,7.2],[-1.25,5.3],[-.5,4.7],[-.75,0]];t.poly([[-.22,.2],[-.2,5],[.2,5],[.22,.2]],2,{sketch:!1});for(const i of[-1,0,1])t.poly(q(i*.3,5.1,i*.85,8.1-Math.abs(i)*.5,.42,5,.3),s),s===6?t.flat(q(i*.62,6.9-Math.abs(i)*.3,i*.83,7.95-Math.abs(i)*.5,.17,3),1):t.ridge([[i*.4,5.6],[i*.75,7.4-Math.abs(i)*.4]],6,.5);t.poly(q(-.62,5,.62,5,.34,4,0),2,{sketch:!1});const l=i=>(t.poly(q(i*.75,5.15,i*2.3,7.5,.47,5,.3),2),t.ridge([[i*.95,5.5],[i*2.05,7.1]],6,.6),C([[i*.55,4.75],[i*1.9,5.6],[i*2.85,7.6],[i*2.3,8],[i*1.05,6.6]],3));return{parts:[E(t,C(c,2),{thick:.4}),E(t,l(1),{thick:.3,hinge:[.55,5],amp:-.2,freq:.9}),E(t,l(-1),{thick:.3,hinge:[-.55,5],amp:.2,freq:.9})],h:8.4}}function de(n){const s=n.tile(150,150,[-2.4,-2.4,2.4,2.4]),t=[];for(let c=0;c<=22;c++){const l=.3+(Y-.6)*c/22;t.push([Math.cos(l)*2,Math.sin(l)*2])}t.push([.25,0]),s.poly(t,2);for(let c=1;c<8;c++){const l=c*Y/8;s.ridge([[Math.cos(l)*.3,Math.sin(l)*.3],[Math.cos(l)*1.6,Math.sin(l)*1.6]],5,.6)}return{parts:[E(s,$(j(t),it),{thick:.2,bevel:.1})],h:4}}function me(n,s){const t=n.tile(300,220,[-3.2,-1.4,3.2,3.3]),c=C([[-2.9,1],[-1.9,.05],[.4,-.25],[1.6,.25],[1.75,1.3],[2.2,2],[3,2],[2.95,2.35],[2.2,2.95],[1.4,2.8],[1,1.9],[-.6,1.75],[-2.2,1.55]],4);t.poly($(j(c),-it),4),t.poly(C([[1.25,1.9],[1.5,2.6],[2.1,2.7],[2.3,2.2],[1.8,1.65]],3),2,{sketch:!1}),t.poly([[2.3,2.3],[2.9,2.2],[2.3,2.05]],3,{sketch:!1}),t.dot(1.95,2.42,.11,5,!1),t.poly(q(-1.9,.9,.9,.85,.5,5,.3),6),t.ridge([[-1.3,.75],[.5,.7]],5,.6),t.ridge([[-1.5,1.05],[.3,1]],5,.6),t.poly([[-2.6,1.05],[-1.9,1.35],[-1.95,.75]],5,{sketch:!1});const l=i=>{const e=[[i-.12,-.1],[i+.12,-.1],[i+.1,-.75],[i+.6,-1],[i-.5,-1],[i-.1,-.75]];return t.poly(e,3,{sketch:!1}),$(j(e),.16)};return{parts:[E(t,c,{thick:.45}),E(t,l(-.5),{thick:.25,bevel:.08,hinge:[-.5,-.1],amp:.55,freq:5}),E(t,l(.6),{thick:.25,bevel:.08,hinge:[.6,-.1],amp:-.55,freq:5})],h:3}}function Nt(n,s){const t=n.tile(400,200,[-4,-1.9,4.2,2.2]),c=C([[-3.8,1.3],[-3,.1],[-3.8,-1.2],[-2.5,-.55],[-.8,-1.3],[.4,-1.75],[1.6,-1.2],[3.1,-.65],[s?4.1:3.6,0],[3,.75],[1.8,1.45],[.6,2.05],[-1.2,1.75],[-2.4,.75]],3);t.poly(C([[-2.5,.1],[-.9,-1],[1.4,-.95],[3.2,-.05],[1.6,1],[-.8,1.05]],4),1),t.flat(C([[-2.2,-.05],[-.8,-.8],[1.4,-.75],[2.9,-.15],[1.2,-.25],[-.8,-.3]],4),6);for(let l=0;l<3;l++){const i=[];for(let e=0;e<=30;e++){const r=e/30;i.push([-1.9+3.6*r,.62-l*.42+.17*Math.abs(Math.sin(r*9*Math.PI+l*1.57))])}t.ridge(i,5,.6)}t.poly([[-1.3,1.1],[-.9,1.6],[.6,1.8],[1.6,1.15],[.2,1.12]],4);for(let l=0;l<6;l++)t.ridge([[-.8+l*.4,1.15],[-.7+l*.4,1.6]],3,.5);return t.poly([[-.6,-1],[.3,-1.5],[1.2,-.98]],4,{sketch:!1}),t.poly([[-2.55,.08],[-3.55,1.05],[-3.15,.1],[-3.55,-.95]],4),t.dot(2.35,.25,.2,6),t.dot(2.4,.25,.09,5,!1),t.ridge([[1.75,.8],[1.6,0],[1.8,-.7]],5,.7),s&&t.poly(q(3.2,-.05,4,0,.2,4),1,{sketch:!1}),{parts:[E(t,c,{thick:.5})],h:4}}function ut(n,s){const{L:t,H:c,neck:l,up:i,hh:e,bill:r,tail:o,span:h}=s,f=t+l,x=c+h+.5,d=n.tile(s.tw??280,s.th??250,[-t-o-.6,-c-.9-(s.legs??0)*.3,f+e+r+.6,x]),F=C([[-t-o,.25],[-t*.75,-c*.75],[0,-c],[t*.75,-c*.72],[t+l*.5,i*.45-e*.9],[f,i-e],[f+e*.8,i-e*.55],[f+e+r,i],[f+e*.7,i+e*.75],[f,i+e],[t+l*.5,i*.5+e*.9],[t*.55,c],[-t*.5,c*.85],[-t,c*.5],[-t-o,.55]],2),y=$(j(F),-.24);d.poly(y,s.body),s.belly!=null&&d.flat(C([[-t*.7,-c*.2],[0,-c*.72],[t*.7,-c*.5],[t*.6,-c*.1],[0,-c*.25]],3),s.belly),d.poly(C([[f-e*.5,i-e*.7],[f+e*.7,i-e*.45],[f+e*.75,i+e*.5],[f-e*.2,i+e*.72],[f-e*.9,i]],3),s.head,{sketch:!1}),d.poly([[f+e*.7,i+e*.3],[f+e+r-.12,i],[f+e*.7,i-e*.3]],s.billPig??3,{sketch:!1}),d.dot(f+e*.15,i+e*.2,Math.max(.09,e*.2),5,!1);for(let S=0;S<3;S++)d.poly(q(-t*.8,.1+S*.15,-t-o+.3,.2+S*.12,.13,3),s.tailPig??5,{sketch:!1,line:!1});if(s.ring!=null&&d.ridge([[t+l*.3,i*.3-e*.6],[t+l*.3,i*.3+e*.7]],s.ring,1.4),s.crest)for(let S=0;S<5;S++){const k=.5+S*.36;d.poly(q(f,i+e*.6,f-Math.cos(k)*e*2.6+.3,i+e*.6+Math.sin(k)*e*2.6,.16,3),4,{sketch:!1}),d.dot(f-Math.cos(k)*e*2.5+.3,i+e*.6+Math.sin(k)*e*2.5,.13,5,!1)}if(s.legs)for(let S=0;S<2;S++)d.ridge([[-t*.5,-c*.6],[-t-o*.6,-c-.2-S*.25],[-t-o,-c-.5-S*.2]],5,1.1);const p=c*.55,A=C([[t*.5,p-.15],[t*.62,p+h*.45],[t*.2,p+h*.86],[-t*.25,p+h],[-t*.8,p+h*.8],[-t*1.05,p+h*.42],[-t*.7,p-.15]],2);d.poly($(j(A),-.22),s.wing);const v=6;for(let S=0;S<v;S++){const k=(S+.7)/v,M=t*.42-k*t*1.05,R=t*.3-k*t*1.25,V=p+h*(.92-.5*k*k);d.ridge([[M,p+h*.3],[R,V-.2]],s.bar??5,.75)}s.bar!=null&&d.flat(C([[t*.4,p+h*.2],[-t*.75,p+h*.2],[-t*.8,p+h*.4],[t*.45,p+h*.4]],2),s.bar);const m={thick:.22,bevel:.09,hinge:[0,p]};return{parts:[E(d,F,{thick:.4,bevel:.12}),E(d,A,{...m,amp:1.25,freq:s.hz*Y}),E(d,A,{...m,amp:-1.25,freq:s.hz*Y})],h:x,len:2*t+l+o}}function ve(n){const s=n.tile(190,190,[-1.9,-.6,1.9,3.2]),t=q(-1.2,0,1.3,0,.24,5);s.poly(t,5,{sketch:!1}),s.ridge([[1.2,.1],[1.75,.75]],5,.7),s.ridge([[1.2,.1],[1.55,.95]],5,.7);const c=C([[.5,.2],[1.5,1.3],[1.45,2.6],[.5,2.95],[-.5,2.3],[-1.5,2],[-1.6,1],[-.7,.2]],3),l=$(j(c),-.2);s.poly(l,4);for(let e=0;e<4;e++)s.flat(q(-1.1+e*.75,.75+e%2*.2,-.8+e*.75,2.1+(e>1?.4:0),.15,3),5);s.dot(.9,2.2,.2,6,!1),s.dot(-1.05,1.5,.17,6,!1);const i={thick:.16,bevel:.07,hinge:[0,.1]};return{parts:[E(s,$(j(t),.2),{thick:.3,bevel:.08}),E(s,c,{...i,amp:1.35,freq:2.2*Y}),E(s,c,{...i,amp:-1.35,freq:2.2*Y})],h:3,len:3}}function ge(n,s){const t=n.tile(660,430,[-7.8,-3.8,7.8,6.6]),c=C([[-4,.3],[-3.7,-1.6],[-3.9,-3],[-3.2,-3.45],[-2.3,-3.1],[-2.2,-1.3],[-.6,-1.25],[1.9,-1.1],[2.9,-1.8],[2.6,-3],[3.4,-3.45],[4.3,-3.1],[4.6,-1.2],[5.1,.6],[4.5,2.2],[1.6,2.55],[-1.4,2.25],[-3.2,2.4],[-4.1,1.7]],3);t.poly($(j(c),-it),4),t.flat(C([[-3.3,-.4],[-1,-.95],[2,-.8],[3.6,-.2],[1.8,-.3],[-1.2,-.45]],3),6);for(let e=0;e<9;e++){const r=-3+e*.92,o=2+.2*Math.sin(e*1.3),h=q(r,o,r+.35-e%2*.3,.35-e%3*.25,.2,4,.1);t.flat(h,5),e%3===1&&t.ridge([[r,o-.1],[r+.35-e%2*.3,.5-e%3*.25]],5,2.6)}for(const e of[-3.05,3.45]){for(let r=0;r<3;r++)t.flat([[e-.55,-1.5-r*.5],[e+.6,-1.4-r*.5],[e+.6,-1.6-r*.5],[e-.55,-1.72-r*.5]],5);for(let r=-1;r<=1;r++)t.ridge([[e+r*.3,-3.15],[e+r*.3,-2.8]],5,.6)}const l=C([[-4.35,.75],[-5.5,.15],[-6.9,.7],[-7.45,1.75],[-6.9,2.75],[-6.75,4.2],[-5.85,3.35],[-5.1,4.3],[-4.45,3.2],[-4.1,1.9]],3);t.poly($(j(l),-it),4),t.flat(C([[-6.9,1.1],[-6.2,.6],[-5.6,1],[-6.3,1.6]],3),6),t.poly([[-7.1,1.75],[-6.75,1.95],[-6.75,1.5]],3,{sketch:!1}),t.poly(q(-6.5,2.35,-5.45,2.6,.3,5),2,{sketch:!1}),t.poly(q(-6.02,2.2,-5.96,2.75,.1,3),5,{sketch:!1,line:!1});for(let e=0;e<3;e++)t.ridge([[-5.2+e*.3,3+e*.1],[-4.75+e*.2,2.2]],5,.8),t.ridge([[-6.6,1.25-e*.12],[-5.2,1.5-e*.3]],5,.4);t.flat([[-6.5,3.6],[-6.62,3.05],[-6.2,3.2]],3),t.flat([[-5.1,3.7],[-5.3,3.2],[-4.85,3.2]],3);const i=C([[4.3,.9],[6,.9],[7.25,2.4],[7.2,4.9],[6.3,6.3],[5.5,5.8],[6.2,4.6],[6.15,3],[5.4,2.2],[4.3,2.1]],3);t.poly($(j(i),-it),4);for(const[e,r,o]of[[5.7,1.6,1.2],[6.5,2.5,.5],[6.7,3.6,.05],[6.6,4.6,-.4],[6.1,5.5,-.9]])t.flat(q(e-Math.cos(o)*.52,r-Math.sin(o)*.52,e+Math.cos(o)*.52,r+Math.sin(o)*.52,.16,3),5);return{parts:[E(t,c),E(t,l,{hinge:[-4.2,1.6],amp:1,freq:-1}),E(t,i,{hinge:[4.7,1.5],amp:.2,freq:1.3})],h:6}}function xe(n){const s=n.tile(230,260,[-3.3,-.3,3.3,7]),t=C([[.55,0],[1,1.7],[2.7,4.3],[3.05,5.5],[1.6,6.35],[0,6.6],[-1.6,6.35],[-3.05,5.5],[-2.7,4.3],[-1,1.7],[-.55,0]],2),c=C([[.3,.9],[.8,2],[2.35,4.4],[2.6,5.1],[1.4,5.5],[0,5.65],[-1.4,5.5],[-2.6,5.1],[-2.35,4.4],[-.8,2],[-.3,.9]],3);s.poly(c,2);for(let l=-5;l<=5;l++){const i=l*.085;s.ridge([[Math.sin(i)*2.2,1.5+Math.abs(l)*.1],[Math.sin(i)*5.2*.92,.5+Math.cos(i)*4.75]],5,.55)}for(let l=-6;l<=6;l++){const i=l*.42,e=5.55-Math.abs(l)*Math.abs(l)*.014;s.poly(q(i,e,i*1.07,e+.62,.15,3),3,{sketch:!1,line:!1})}for(const l of[-1,0,1])s.poly(q(l*.18,.15,l*.75,2.1-Math.abs(l)*.3,.3,4,.2),4,{sketch:l===0});return{parts:[E(s,t,{thick:.45})],h:6.6}}function ye(n){const s=n.tile(48,400,[-.6,0,.6,16]);return s.poly([[-.34,-1],[-.34,17],[.34,17],[.34,-1]],2,{sketch:!1}),s.ridge([[-.08,0],[-.08,16]],5,.5),s.flat([[-.3,0],[.3,0],[.02,2.6]],4),s}function we(n){const s=n.tile(400,560,[-6.6,-.2,6.6,18]),t=[[1.9,0],[1.95,5.6]],c=9,l=[];for(let i=0;i<c;i++){const e=-1.12+2.24*i/(c-1),r=11.6-2.4*Math.abs(Math.sin(e));l.push([Math.sin(e)*r*.52,5.6+Math.cos(e)*r,e])}for(let i=c-1;i>=0;i--){const e=l[i];t.push([e[0]+.5,e[1]-.25],[e[0]-.5,e[1]+.05]),i>0&&t.push([(e[0]+l[i-1][0])*.5*.86,(e[1]+l[i-1][1])*.5-1.5])}return t.push([-1.95,5.6],[-1.9,0]),[1,2,3,1,2].forEach((i,e)=>{s.poly([[-1.6,.3+e*1.05],[1.6,.3+e*1.05],[1.6,1.1+e*1.05],[-1.6,1.1+e*1.05]],i,{sketch:!1})}),l.forEach((i,e)=>{const r=Math.sin(i[2])*1.5,o=5.9;s.poly(q(r,o,i[0]*.97,i[1]-.45,.62,6,.3),e%2?2:e%4?1:3),s.ridge([[r*1.05,o+.6],[i[0]*.93,i[1]-1.3]],6,.6)}),{parts:[E(s,C(t,2),{thick:2.2,bevel:.3})],h:17.6}}function be(n){const s=n.tile(110,400,[-2.2,0,2.2,16]);s.poly([[-1.3,-1],[-1.3,17],[1.3,17],[1.3,-1]],6,{sketch:!1});for(const t of[-.8,0,.8])s.ridge([[t,0],[t,16]],4,.8);return[[.4,5],[1.6,1],[14.2,3],[15.2,1]].forEach(([t,c])=>s.poly([[-1.3,t],[1.3,t],[1.3,t+.8],[-1.3,t+.8]],c,{sketch:!1})),s}function ke(n){const s=n.tile(420,170,[-.2,-.3,12.2,4.6]),t=(o,h)=>h(o),c=t(1.4,o=>{for(const h of[-1,0,1])s.poly(q(o+h*.3,.35,o+h*.95,3.9-Math.abs(h)*.5,.42,5,.3),h?1:6,{sketch:!1});return s.poly(q(o-.6,.4,o+.6,.4,.3,4),2,{sketch:!1}),C([[o-.9,0],[o-1.45,3.2],[o-.9,4],[o,4.35],[o+.9,4],[o+1.45,3.2],[o+.9,0]],2)}),l=t(4.6,o=>{s.poly(C([[o-.25,.3],[o-1.05,2.9],[o,3.4],[o+1.05,2.9],[o+.25,.3]],3),2,{sketch:!1});for(let h=-3;h<=3;h++)s.poly(q(o+h*.3,3.1,o+h*.36,3.75,.13,3),3,{sketch:!1,line:!1});return C([[o-.6,0],[o-1.45,3],[o-.8,4.1],[o+.8,4.1],[o+1.45,3],[o+.6,0]],2)}),i=t(7.6,o=>(s.poly(q(o,.3,o,3.9,.8,6,.1),2,{sketch:!1}),s.ridge([[o,.6],[o,3.5]],5,.6),s.dot(o+.75,.75,.36,4),C([[o-.45,0],[o-1.2,2],[o-.5,4.1],[o+.5,4.1],[o+1.2,2],[o+1.25,.4],[o+.45,0]],2))),e=10.6;s.poly([[e-.7,0],[e+.7,0],[e+.7,4.4],[e-.7,4.4]].map(o=>[o[0],o[1]-.1]),3,{sketch:!1});for(let o=.3;o<4.3;o+=.55)s.ridge([[e-.6,o],[e+.6,o+.3]],5,.55);const r=(o,h)=>K(o.map(f=>[f[0]-h,f[1]]),(f,x)=>s.uv(f+h,x),{thick:.5,bevel:.12});return{P:s,pieces:[r(c,1.4),r(l,4.6),r(i,7.6)],cord:(o,h)=>K([[-o,-h],[o,-h],[o,h],[-o,h]],(f,x)=>s.uv(e+f*.5/o,2.1+x*1.9/h),{thick:.5,bevel:.14})}}function Ae(n,s,t){const c=[],l=[],i=[],e=(S,k,M,R,V)=>{const T=c.length/3;c.push(...S,...k,...M,...R);for(let D=0;D<4;D++)l.push(...V);i.push(T,T+1,T+2,T,T+2,T+3)},[r,o,h,f]=t,x=r-h,d=r+h,F=o-f,y=o+f,p=[0,1,0],A=-.6,v=-8;e([-n,0,y],[-n,0,s],[n,0,s],[n,0,y],p),e([-n,0,-s],[-n,0,F],[n,0,F],[n,0,-s],p),e([-n,0,F],[-n,0,y],[x,0,y],[x,0,F],p),e([d,0,F],[d,0,y],[n,0,y],[n,0,F],p),e([x,A,F],[x,A,y],[d,A,y],[d,A,F],p),e([x,0,F],[x,0,y],[x,A,y],[x,A,F],[1,0,0]),e([d,0,y],[d,0,F],[d,A,F],[d,A,y],[-1,0,0]),e([d,0,F],[x,0,F],[x,A,F],[d,A,F],[0,0,1]),e([x,0,y],[d,0,y],[d,A,y],[x,A,y],[0,0,-1]),e([-n,0,s],[-n,v,s],[n,v,s],[n,0,s],[0,0,1]),e([n,0,-s],[n,v,-s],[-n,v,-s],[-n,0,-s],[0,0,-1]),e([n,0,s],[n,v,s],[n,v,-s],[n,0,-s],[1,0,0]),e([-n,0,-s],[-n,v,-s],[-n,v,s],[-n,0,s],[-1,0,0]);const m=new P.BufferGeometry;return m.setAttribute("position",new P.Float32BufferAttribute(c,3)),m.setAttribute("normal",new P.Float32BufferAttribute(l,3)),m.setIndex(i),m}async function Fe(n,s={}){const t=n.rng,c=Q(s.detail??n.quality?.detail??1,.6,1),l=s.palette&&s.palette.length>=7?s.palette.slice(0,7):kt,i=s.outline??Wt,e=ne(l,i),r=120,o=210,h=[0,30,55,150],f=-165,x=-159,d=new P.Vector3(0,44,-156.6),F=new P.Group,y=new P.Group,p=new P.Group;p.position.set(0,0,o),y.position.set(0,0,-o),p.add(y),F.add(p);const A={fishBud:t.int(0,3),lotusMix:t.range(.3,.7),tall:t.shuffle([0,1,2]),catSide:1,weather:t.chance(.25)?t.range(.25,.5):t.range(0,.12),rowPhase:t.int(0,2)};e.uWeather.value=s.weather??A.weather,await n.yield();const v=ce(2048,l,i);await n.yield();const m={};m.trees=[he(v,t)],await n.yield(),m.trees.push(fe(v,t)),await n.yield(),m.trees.push(pe(v,t)),await n.yield(),m.pom=ue(v,t),await n.yield(),m.lotus=[It(v,1),It(v,6)],await n.yield(),m.pad=de(v),await n.yield(),m.duck=me(v,t),await n.yield(),m.fish=[Nt(v,!1),Nt(v,!0)],await n.yield();const S={L:2,H:.8,neck:1.5,up:.5,hh:.42,bill:.6,tail:.8,span:2.5};m.birds=[ut(v,{...S,body:6,head:5,wing:6,bar:5,belly:4,ring:6,billPig:3,hz:2}),ut(v,{...S,L:1.6,H:.68,neck:1.1,tail:1.2,span:2.1,body:4,head:2,wing:1,belly:6,ring:6,billPig:5,hz:2.6}),ut(v,{...S,L:1.15,H:.5,neck:.35,up:.3,hh:.36,bill:.95,tail:.9,span:1.9,body:3,head:3,wing:6,bar:5,billPig:5,crest:!0,hz:3})],await n.yield(),m.birds.push(ut(v,{...S,L:1.7,H:.62,neck:2.3,up:1,hh:.36,bill:1,tail:1.5,span:2.8,body:6,head:6,wing:6,billPig:4,legs:2,tailPig:6,hz:2})),await n.yield(),m.fly=ve(v),await n.yield(),m.cat=ge(v,l),await n.yield(),m.umbel=xe(v);const k=ye(v);await n.yield(),m.cap=we(v),await n.yield();const M=be(v);m.wreath=ke(v),await n.yield();const[R,V]=v.finish(n.renderer);e.uAtlasC.value=R,e.uAtlasD.value=V;const T=(a,u)=>K([[a[0],a[1]],[a[2],a[1]],[a[2],a[3]],[a[0],a[3]]],u,{thick:.02,bevel:.001}),D=Rt(e,{uPool:{value:new P.Vector4(...h)},uSlab:{value:new P.Vector4(r,o,0,0)},uSeason:{value:new P.Vector2(s.season===1?90:0,s.season===2?10:0)}}),O=new P.Mesh(Ae(r,o,h),D);O.frustumCulled=!1,y.add(O);const Z=ie(e),I=Dt(Math.round(12e4+4e4*c)),U=Dt(Math.round(52e3+26e3*c)),Ut=a=>{if(a.sock)return a.sock;if(a.parts.length===1&&a.parts[0].outline)return a.sock=K($(j(a.parts[0].outline),.22),a.parts[0].uvf,{thick:.02,bevel:.001});let u=1e9,g=1e9,b=-1e9,z=-1e9;for(const w of a.parts)for(let B=0;B<w.geo.nv;B++){const L=w.geo.pos[B*3],G=w.geo.pos[B*3+1];u=Math.min(u,L),b=Math.max(b,L),g=Math.min(g,G),z=Math.max(z,G)}return a.sock=T([u-.2,g-.2,b+.2,z+.2],a.parts[0].uvf)},N=(a,u,g,b,z,w={})=>{const B=w.ph??t(),L=w.s??1;u.parts.forEach((G,X)=>a.add(G.geo,g,b,[z[0],z[1],B,z[2]??0],X===0&&w.rock?[0,0,w.rock[0],w.rock[1]]:[G.hinge[0],G.hinge[1],G.amp,G.freq],L,!!w.mir,w.rot??0)),w.sock&&a.add(Ut(u),g,b,[4,0,B,0],void 0,L,!!w.mir,0)},Mt=a=>m.trees[A.tall[a%3]];let lt=0;for(const a of[-1,1])for(let u=0;u<2;u++){for(let b=0;b<22;b++){const z=171-b*13.1-u*6.5,w=a*(h[2]+13.5+u*24.5),B=(b+u*2+A.rowPhase+(a>0?1:0))%4===3?2:(b+u)%2;N(I,Mt(B),[w,0,z],-a*Math.PI/2,[1,150,0],{s:t.range(.93,1.02),mir:t.chance(.5),sock:!0,rock:[.02,t.range(.6,1)]}),lt++,b%6===5&&await n.yield()}await n.yield()}for(let a=0;a<2;a++)for(let u=-9;u<=9;u++){const g=u*11.2+(a?5.6*Math.sign(u||1):0);Math.abs(g)<13||Math.abs(g)>r-8||(N(I,a?m.trees[0]:m.pom,[g,0,183.6+a*12.8],Math.PI,[1,70,0],{s:t.range(.84,.92)*(a?.585:1),mir:t.chance(.5),sock:!0,rock:[.025,t.range(.7,1.1)]}),lt++)}for(const a of[-1,1])for(let u=0;u<3;u++)N(I,Mt(u+1),[a*(79+u*14.5),0,-125],0,[1,120,0],{s:.97,sock:!0,rock:[.02,.8]}),lt++;await n.yield();let dt=0;for(const a of[8.3,52])for(const u of[-1,1])for(let g=0;g<13;g++){const b=a<10||c>.75||g%2===0,z=t()<A.lotusMix,w=t.range(-2,2),B=t();if(!b)continue;const L=u*a,G=166-g*21.5+w-(a>10?9:0);N(I,m.lotus[z?0:1],[L,-.6,G],0,[1,62,0],{s:.75,ph:B}),dt++,(c>.75||g%2)&&N(I,m.pad,[L-u*(a>10?4.6:-4.6),-.6,G+3.2],0,[5,0,0],{s:.9,rot:B*Y})}await n.yield();for(const a of[-1,1])for(const u of[3,5,7,9]){const g=166-(u+.5)*21.5;N(I,m.lotus[(u>>1)%2===(a>0?1:0)?0:1],[a*7,-.6,g],0,[1,62,0],{s:.75,ph:(u*.37+a*.11+1)%1}),dt++}let rt=0;for(let a=0;a<30;a++){if(a===3||a===4)continue;const u=a%2?1:-1,g=13+10*((a>>1)%4),b=160-(a>>1)*17.8+t.range(-3,3),z=u*(g+.8+t.range(-.4,.4));N(I,m.duck,[z,-.6,b],0,[1,75,1],{s:1.2,mir:u<0,rock:[.05,1.7]}),rt++}for(let a=0;a<20;a++){const u=a%2?1:-1,g=a>>1,b=g%2?47.5:18,z=g%2?1:-1;N(I,m.fish[a<A.fishBud?1:0],[u*b,-.6,165-a*13.7],-z*Math.PI/2,[2,g%2?1.7:2.3,z],{s:1.25})}N(I,m.fish[1],[-33,-.6,120],Math.PI/2,[2,0,-1],{s:2.9,ph:.2}),N(I,m.fish[0],[33,-.6,20],-Math.PI/2,[2,0,1],{s:3,ph:.7}),N(I,m.duck,[30,-.6,143.5],0,[1,75,.4],{s:2.3,mir:!0,ph:.15,rock:[.03,1.1]}),rt++;for(let a=0;a<4;a++)N(I,m.duck,[23.3+a*5.6,-.6,132.4],0,[1,75,1],{s:.72,mir:!0,ph:.3+a*.17,rock:[.07,2.3]}),rt++;for(let a=0;a<64;a++){const u=a%2?1:-1,g=168-a*4.3,b=u*(3.6+.2*(a*7%3));a%3===2?N(I,m.fish[0],[b,-.6,g],(a%4<2?1:-1)*Math.PI/2,[5,0,0],{s:.2,ph:.5}):N(I,m.pad,[b,-.6,g],0,[5,0,0],{s:.3,ph:.5,rot:a*1.9})}await n.yield();const Ot=I.mesh(Z);y.add(Ot),await n.yield();const _t=`
    ${At}
    ${Gt}
    uniform float uWater;
    varying vec3 vG, vN;
    void main(){
      vec2 p = vG.xy; vec2 fw = fwidth(p); float px = max(max(fw.x, fw.y)*0.75, 1e-4);
      vec3 N = vN/max(length(vN), 1e-4);
      float st = stageAt(vG), cut = smoothstep(2.5, 3.5, st), ink = smoothstep(1.9, 2.5, st);
      vec3 stone = stoneAt(p*vec2(1., 0.93) + 50., px), col = stone; float e = 0.;
      if (abs(N.z) < 0.7) e = clamp(dot(N, uSunL)*1.7, -1., 1.);
      else if (!gl_FrontFacing) col = mix(col, uPig[3], gridAt(p, px, 1.)*0.6);     // the back is still only ruled
      else {
        vec2 s2 = uSunL.xy/max(length(uSunL.xy), 1e-3);
        float lw = max(0.09, 0.8*px), lk = min(0.09/lw + 0.15, 1.);
        float top = uWater + 0.25*sin(p.x*0.21 + uTime*1.3);
        float inW = 1. - smoothstep(top - px, top + px, p.y), zc;
        vec4 w;
        gZig = 1.3*(1. - smoothstep(3.6, 4.0, st));
        w = waterAt(p, px, s2, 0., zc);
        gLoss = uWeather*(0.6*smoothstep(8., 55., p.y) - 0.26);
        float pnt = paintAt(p*0.5, st, px); gChipE *= inW; gChipS *= inW;
        col = mix(mix(stone, mix(uPig[5], uPig[3], gLost), ink*zc*inW*mix(0.85, 0.42, gLost)), w.rgb, inW*pnt); e = w.a*inW*cut*step(0.5, pnt);
        float base = 1. - smoothstep(lw, lw + px, abs(fract((p.y - 7.)/10. + 0.5) - 0.5)*10.);      // the ruled baselines of the registers
        float brim = 1. - smoothstep(lw*1.4, lw*1.4 + px, abs(p.y - top));
        col = mix(col, uLineC, base*lk*ink*(1. - inW)); col = mix(col, uPig[5], brim*lk*ink);
        // far off and only drawn, the thicket is one clean contour: a fan with a V notch over the course
        float ax = abs(p.x), xo = 48. + 0.27*p.y, xi = 5. + 0.2*p.y, cw = max(0.2, 1.15*px);
        float fd = min(abs(ax - xo)*0.965, abs(ax - xi)*0.98);
        fd = min(fd, abs(p.y - 69.5) + 1e3*(step(ax, xi) + step(xo, ax))) + 1e3*step(69.5 + cw, p.y);
        float fc = (1. - smoothstep(cw, cw + px, fd))*ink*(1. - smoothstep(3.6, 4.4, st))*smoothstep(0.16, 0.3, px);
        // inside the fan's contour the red grid stands back to a third of the outline's strength while the thicket is only drawn
        col = mix(col, uPig[3], gridAt(p, px, st - 1.)*0.6*(1. - smoothstep(3.6, 4.6, st))*mix(1., 0.33, ink*step(ax, xo + 1.)*step(p.y, 71.))*(1. - fc));
        col = mix(col, uPig[5], fc);
        // THE PANEL'S TWO SIDE EDGES TAKE A BORDER REGISTER: the board's own block border (the band of the pool's
        // coping, FLOOR_FS: blue, red, green and yellow blocks of 2.5 m between white bars, 3.8 m across) runs up each
        // slanted side edge on a strip of stone 6 m wide, with the coping line 1.1 m outside the water, so the water
        // that climbs the panel ends against a border as the pool does and not against the bare edge of the slab.
        // It is drawn and painted by the panel's own stage (the same front as its water), with the panel's own loss
        // of paint; far off, while the thicket is only drawn, it is left out with everything but the fan's contour.
        float de = 0.956*(57. - ax) + 0.2932*p.y;                      // metres in from the side edge, square to it
        float bOn = 1. - (1. - smoothstep(3.6, 4.4, st))*smoothstep(0.16, 0.3, px);
        if (de < 6. && bOn > 0.) {
          float sg = p.x < 0. ? -1. : 1., al = 0.2932*(ax - 57.) + 0.956*p.y, bv = de - 2.2;      // al: metres up the edge; bv: across the band
          float bf = (fract(al/3.2) - 0.5)*3.2, bk = mod(floor(al/3.2), 4.), small = smoothstep(0.5, 1.6, px);
          float inB = step(abs(bf), 1.25)*step(abs(bv), 1.25)*(1. - small), inBand = step(abs(bv), 1.9);
          vec3 pg = bk < 0.5 ? uPig[1] : bk < 1.5 ? uPig[3] : bk < 2.5 ? uPig[2] : uPig[4];
          vec3 bandC = mix(mix(uPig[6], pg, inB), mix(uPig[6], (uPig[1] + uPig[3] + uPig[2] + uPig[4])*0.25, 0.5), small);
          float cE = gChipE, cS = gChipS;
          float pb = paintAt(p*0.5 + 9., st, px);
          vec3 bc = mix(stone, bandC, inBand*pb);
          float bl = max(1. - smoothstep(lw, lw + px, abs(abs(bv) - 1.9)), inB > 0.5 ? 1. - smoothstep(lw, lw + px, min(1.25 - abs(bf), 1.25 - abs(bv))) : 0.);
          float cop = 1. - smoothstep(lw, lw + px, abs(de - 4.9));
          bc = mix(bc, mix(uPig[5], uLineC, smoothstep(3.6, 4.4, st)), max(bl, cop)*lk*ink);
          vec2 sb = vec2(dot(s2, vec2(sg*0.2932, 0.956)), dot(s2, vec2(-sg*0.956, 0.2932)));      // the sun up the edge and in from it
          vec2 dd = vec2(1.25) - abs(vec2(bf, bv)), bb = (1. - smoothstep(0.22, 0.22 + px, dd))*inB;
          float ex = -sign(bf)*sb.x*bb.x, ey = -sign(bv)*sb.y*bb.y;
          col = mix(col, bc, bOn); e = mix(e, clamp((abs(ex) > abs(ey) ? ex : ey)*2.2, -1., 1.)*cut, bOn);
          gChipE = mix(cE, gChipE*inBand, bOn); gChipS = mix(cS, gChipS*inBand, bOn);
        }
      }
      gl_FragColor = vec4(edgeTone(col, e), 1.);
    }`,Pt={value:2},Vt=(()=>{const a=f-5,u=a-3,g=[-57,0],b=[57,0],z=[80,75],w=[-80,75],B=[],L=[],G=[],X=(at,ft)=>{const H=B.length/3;for(const st of at)B.push(...st),L.push(...ft);G.push(H,H+1,H+2,H,H+2,H+3)};X([[...g,a],[...b,a],[...z,a],[...w,a]],[0,0,1]),X([[...w,a],[...z,a],[...z,u],[...w,u]],[0,1,0]),X([[...b,a],[...b,u],[...z,u],[...z,a]],[.95,-.3,0]),X([[...g,u],[...g,a],[...w,a],[...w,u]],[-.95,-.3,0]);const J=new P.BufferGeometry;return J.setAttribute("position",new P.Float32BufferAttribute(B,3)),J.setAttribute("normal",new P.Float32BufferAttribute(L,3)),J.setIndex(G),J})(),ct=new P.Mesh(Vt,Rt(e,{uWater:Pt},_t));ct.material.side=P.DoubleSide,ct.frustumCulled=!1,y.add(ct);const mt=a=>5+.2*a,Ft=a=>48+.27*a,Ht=(a,u,g,b=.42,z=.2)=>{const w=K([[a-b,0],[a+b,0],[u+z,g],[u-z,g]],(B,L)=>{const G=Q(L/g,0,1),X=a+(u-a)*G,J=b+(z-b)*G;return k.uv((B-X)/J*.3,G*16)},{thick:.3,bevel:.06});w.off=new Float32Array(w.nv*2),w.wid=new Float32Array(w.nv);for(let B=0;B<w.nv;B++){const L=Q(w.pos[B*3+1]/g,0,1);w.off[B*2]=w.pos[B*3]-(a+(u-a)*L),w.wid[B]=2*(b+(z-b)*L)}return w},tt=1.75,vt=(a,u,g)=>a>13.5&&a<45&&g>22.5&&u<43.5;let St=0;for(let a=0;a<6;a++){const u=a<5?17+10*a:66,g=.68,b=4.9,z=f-.6*a;for(const w of[-1,1])for(let B=0;;B++){const L=mt(u+2)+2.8+B*b;if(L>Ft(u)||B>40)break;const G=t.range(-.35,.35),X=t.range(-.5,.5),J=c>.75||B%3!==1||a===5&&B%2===0,at=w*(L+G),ft=w*(2.6+(L-mt(u+2))*.72),H=u+X;if(!J||vt(at,H,H+4.6))continue;const st=t(),qt=a===5&&B%2===0?0:.3+.7*st;U.add(Ht(ft,at,H),[0,0,z],0,[6,qt,st,1.1]),N(U,m.umbel,[at,H-.25,z+.05],0,[0,qt||-1,1.1],{s:g,ph:st,rot:-Math.atan2(at-ft,H)*.9}),St++,B%8===7&&await n.yield()}await n.yield()}const _=new P.Vector3(29,31,f+1);for(const[a,u,g]of[[17.5,_.x-3.05*tt,_.x+2.6*tt],[27.5,_.x+3.45*tt,_.x+9.4*tt]]){const b=_.y-3.6*tt,z=b+2*tt,w=.5;U.add(K([[a-.45,0],[a+.45,0],[u+w,b-.6],[g,z-w],[g,z+w],[u-w,b+.35]],(B,L)=>k.uv(.12,Q(L/28,0,1)*16),{thick:.3,bevel:.06}),[0,0,f+.4],0,[0,0,.3,.25]),N(U,m.umbel,[g-.2,z,f+.45],0,[0,0,.25],{s:.8,rot:-1.85})}N(U,m.cat,[_.x,_.y,_.z],0,[0,0,.25],{ph:.3,s:tt}),await n.yield();const jt=[m.birds[0],m.birds[1],m.birds[2],m.fly,m.birds[3],m.birds[3]],zt=[12,22,32,42,52,62];let Bt=0;for(let a=0;a<6;a++){const u=a===3?1.5:1.6,g=jt[a],b=zt[a],z=(g.len+(a===3?1:1.9))*u;for(const w of[-1,1])for(let B=0;;B++){const L=mt(b)+3.2+g.len*.5*u+B*z;if(L>Ft(b)-2||B>30)break;const G=t();vt(w*L+g.len*.5*u,b-1,b+g.h*u)||vt(w*L-g.len*.5*u,b-1,b+g.h*u)||a<2&&w>0&&L<47||(N(U,g,[w*L,b,f+1.3],0,[3,a,w],{ph:B%5*.2*.6+G*.1,mir:w<0,s:u}),Bt++)}await n.yield()}const $t=K([[-2.3,0],[2.3,0],[2.3,1.3],[1.75,1.8],[1.5,45],[-1.5,45],[-1.75,1.8],[-2.3,1.3]],(a,u)=>M.uv(Q(a,-1.9,1.9),Q(u/45,0,1)*16),{thick:2.6,bevel:.3});for(const a of[-1,1])U.add($t,[a*11,0,x],0,[0,0,0,0]),N(U,m.cap,[a*11,44.2,x],0,[0,0,0],{mir:a<0}),U.add(m.wreath.cord(.2,5.6),[a*8.15,d.y+11.4,d.z],0,[0,0,0,.9],void 0,1,!1,a*.42);const gt=22,Zt=m.wreath.cord(.42,Math.PI*8.1/gt+.02),Xt=t.shuffle([0,1,2]);for(let a=0;a<gt;a++){const u=(a+.5)/gt*Y,g=Math.cos(u),b=Math.sin(u);U.add(Zt,[d.x+g*8.1,d.y+b*8.1,d.z],0,[0,0,.5,.9],void 0,1,!1,u),U.add(m.wreath.pieces[Xt[a%3]],[d.x+g*8.75,d.y+b*8.75,d.z],0,[0,0,.5,.9],void 0,.72,!1,u-Math.PI/2)}await n.yield();const Yt=U.mesh(Z);y.add(Yt),await n.yield();const xt=new P.Vector3(.8,.29,.53).normalize(),W={tilt:0,flight:0,front:-1e4,rise:-1,driven:!1,look:0},yt=a=>{const u=[[0,30],[.275,30],[.35,18],[.45,5],[.5,0],[1,0]];let g=0;for(;g<u.length-2&&a>u[g+1][0];)g++;const b=u[g],z=u[g+1],w=Q((a-b[0])/(z[0]-b[0]),0,1);return nt(b[1],z[1],g===0?0:g===1?w*w*(2-w):g===3?1-(1-w)*(1-w):w)*Math.PI/180},wt=a=>a<.225?nt(170,60,pt(0,.225,a)):a<.5?nt(60,15,(a-.225)/.275):nt(15,-470,pt(.5,.68,a)*.6+.4*Q((a-.5)/.18,0,1)),bt=a=>Math.max(0,a-.7)*40,Qt=a=>{W.driven=!0,W.tilt=yt(a),W.front=wt(a),W.flight=bt(a)},et=new P.Vector3(0,40,400),ht=new P.Vector3,Lt=new P.Quaternion,Ct=new P.Vector2,ot={u:-1,tilt:0,r:150,h:70,c:new P.Vector3(0,18,-30)};function Tt(a,u,g){if(e.uTime.value=u,!W.driven){const L=ot.u>=0?ot.u:.3+.7*((u+14)/36%1);W.tilt=yt(L)*ot.tilt,W.front=wt(L),W.flight=bt(L),et.set(0,3,nt(330,-150,pt(.1,.8,L)))}p.rotation.x=W.tilt,F.updateMatrixWorld(!0),g&&(ht.setFromMatrixPosition(g.matrixWorld),y.worldToLocal(ht),e.uEyeL.value.copy(ht),W.driven&&et.copy(ht),n.renderer&&(n.renderer.getDrawingBufferSize(Ct),e.uPxAng.value=2/(Math.max(Math.abs(g.projectionMatrix.elements[5]),.1)*Math.max(Ct.y,1)))),e.uCamL.value.copy(et),y.getWorldQuaternion(Lt).invert(),e.uSunL.value.copy(xt).applyQuaternion(Lt).normalize(),e.uFront.value.set(0,0,1,-W.front),e.uFlight.value=W.flight,e.uRise.value.x=W.rise;let b=2;for(let L=0;L<6;L++)b+=(L?10:5)*pt(L*1.5+1,L*1.5+3.2,W.flight);Pt.value=b;const z=et.y-_.y-2,w=Math.max(Math.hypot(et.x-_.x+6,et.z-_.z),6),B=-Q(Math.atan2(z,w)*1.4+.12*Math.sin(u*.5),-.3,.45);W.look+=(B-W.look)*Math.min(1,a*2.5),e.uRise.value.z=W.look}Tt(0,0,null);const Jt=Math.sin(36.2*Math.PI/180),Kt=Math.cos(36.2*Math.PI/180),te={portalSeat:{position:[d.x,d.y,d.z],facing:[0,-Jt,Kt],radius:7.5},flyThrough:[[0,40,262],[0,38,210],[0,20,152],[0,2.2,93],[0,2.2,-40],[0,2.2,-92],[0,4,-101],[0,8.4,-108],[0,26.2,-132.3],[d.x,d.y,d.z]],hinge:{a:[-r,0,o],b:[r,0,o]},pool:{center:[h[0],-.6,h[1]],half:[h[2],h[3]]},viewpoints:{page:[0,40,262],onWater:[0,2.2,40],underTiers:[0,6,-104]},cat:[_.x,_.y,_.z],thicket:[0,35,f],columns:[[-11,0,x],[11,0,x]],tiers:zt,sun:xt.toArray()};return{object:F,radius:ot.r,height:ot.h,center:ot.c,anchors:te,ground:!1,groundY:0,update:Tt,dispose(){R.dispose(),V.dispose()},uniforms:e,garden:y,atlas:v,figures:m,place:N,batches:{flat:I,tall:U},materials:{slab:Z,floor:D,panel:ct.material},setProgress:Qt,tiltAt:yt,frontAt:wt,flightAt:bt,setTilt(a){W.driven=!0,W.tilt=a},setFlight(a){W.driven=!0,W.flight=a},setFront(a){W.driven=!0,W.front=a},setRise(a){W.rise=a},setSun(a){xt.copy(a).normalize()},counts:{trees:lt,lotus:dt,ducks:rt,stems:St,birds:Bt,verts:I.count+U.count,flat:I.count,tall:U.count}}}export{Wt as OUTLINE,kt as PALETTE,oe as SLAB_FS,ee as SLAB_VS,At as STYLE_GLSL,Gt as WATER_GLSL,Fe as buildHero,j as ccw,C as curve,re as ell,q as leaf,ce as makeAtlas,Dt as makeBatch,ne as makeStyleUniforms,$ as offsetPoly,E as part,K as slabGeo,ie as slabMaterial,Rt as stoneMaterial,Pe as xfm};
