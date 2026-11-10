import*as x from"three";import{makePath as Me,clamp as n0,lerp as P,smoothstep as t0}from"../kit/core.js";import{buildHero as Se}from"../parts/drafted-city.js";const r0=0,q=1,D=2,B=0,J0=1,mt=2,e0=0,tt=1,Ht=2,V0=3,X=4,_t=5,a0=0,et=1,Ae=2,Pe=3,Ce=4,ne=5,re=6,Te=7,Ee=[.24,.13,.08],o0=560,v0=60,M0=20,ie=`
  uniform vec2 uRes;
  varying float vS, vLen, vEdge, vHalf, vStyle, vTip, vAlpha, vMpp, vCrawl, vDot; varying vec3 vCol;
  float gMaxPx;     // widest this ribbon may be on screen, in pixels (set by the caller)
  float gFar;       // how far into the distance tone this vertex is (0 near .. 1 at 1.2 km), for the caller's colour
  vec4 ribbon(vec3 A, vec3 E, float fullLen, float width, float rank, float alpha, float dotty, float depthK) {
    vec4 vA = viewMatrix * vec4(A, 1.), vE = viewMatrix * vec4(E, 1.);
    float nearZ = -0.25;
    bool cull = alpha <= 0.003 || (vA.z > nearZ && vE.z > nearZ);
    if (vA.z > nearZ) vA = mix(vE, vA, (nearZ - vE.z) / max(vA.z - vE.z, 1e-4));
    else if (vE.z > nearZ) vE = mix(vA, vE, (nearZ - vA.z) / max(vE.z - vA.z, 1e-4));
    vec4 cA = projectionMatrix * vA, cE = projectionMatrix * vE;
    vec2 sA = cA.xy / max(cA.w, 1e-4) * uRes * 0.5, sE = cE.xy / max(cE.w, 1e-4) * uRes * 0.5;
    vec2 d = sE - sA; float dl = length(d); d = dl > 1e-3 ? d / dl : vec2(1., 0.);
    vec2 nrm = vec2(-d.y, d.x);
    vec4 mv = mix(vA, vE, position.x);
    vec4 c4 = mix(cA, cE, position.x);
    float w = max(c4.w, 1e-3);
    float pxPerM = uRes.y * 0.5 * projectionMatrix[1][1] / w;
    float wpx = width * pxPerM;
    float minPx = rank < 0.5 ? 2.0 : (rank < 1.5 ? 1.5 : 1.15);
    float wd = min(max(wpx, minPx), gMaxPx);
    if (dotty > 0.5) wd = min(wd, 3.2);              // motes are round dots of a few pixels, never squares
    float thin = clamp(wpx / minPx, 0., 1.);
    alpha *= rank < 0.5 ? clamp(thin * 2.4, 0.42, 1.) : (rank < 1.5 ? clamp(thin * 2.2, 0.08, 1.) : clamp(thin * 2.2, 0.04, 1.));
    float dist = -mv.z;
    // depth is line weight and tone: things that stand on the sheet thin out and go pale blue from 300 m, so the
    // near city is white line, the middle distance is lighter line and the far skyline is a pale outline
    float oldF = rank > 1.5 ? 0.75 * smoothstep(600., 2000., dist) : (rank > 0.5 ? 0.6 * smoothstep(700., 2400., dist) : 0.4 * smoothstep(600., 2000., dist));
    gFar = depthK * smoothstep(300., 1200., dist);
    float newF = (rank > 1.5 ? 0.8 : (rank > 0.5 ? 0.66 : 0.5)) * gFar;
    alpha *= 1. - max(oldF, newF);
    float hw = wd * 0.5 + 1.0;
    float cap = dotty > 0.5 ? hw : min(wd * 0.5, 2.);
    c4.xy += (nrm * position.y * hw + d * (position.x * 2. - 1.) * cap) / (uRes * 0.5) * w;
    gl_Position = cull ? vec4(2., 2., 2., 1.) : c4;
    vEdge = position.y * hw; vHalf = wd * 0.5;
    vDot = dotty > 0.5 ? (position.x * 2. - 1.) * hw : -1e4;
    vLen = fullLen; vS = position.x * fullLen;
    vAlpha = alpha; vCrawl = 0.;
    vMpp = 1. / max(pxPerM, 1e-4);
    return mv;
  }`,Re=`
  attribute vec3 aA, aB; attribute vec4 aS, aT; attribute vec2 aX;
  uniform float uU, uTime; uniform vec3 uCol[6]; uniform vec4 uFlock[4];
  uniform vec3 uCam, uScript, uScript2; uniform vec2 uSheet;
  ${ie}
  #include <fog_pars_vertex>
  void main() {
    float kind = aS.w, rank = floor(aS.y / 4. + 0.01), style = aS.y - rank * 4.;
    vec3 A = aA, B = aB; float p = 1., alpha = 1., tipOn = 0., dotty = 0.;
    if (kind < 0.5) {
      // static line ruled on between two epochs; construction lines fade once fadeAt is passed
      p = clamp((uU - aT.x) / max(aT.y - aT.x, 1e-4), 0., 1.);
      alpha *= 1. - 0.9 * smoothstep(aT.z, aT.z + 0.035, uU);
      tipOn = 1.;
      if (aT.w > 0.) {
        float ph = uTime * 1.3 + aA.x * 0.045 + aA.z * 0.06;
        vec2 sw = vec2(sin(ph) + 0.4 * sin(ph * 2.7), cos(ph * 0.8)) * aT.w * 0.03;
        A.xz += sw * A.y; B.xz += sw * B.y;
      }
      if (aX.y > 0.5) { float mx = 0.5 * (aA.x + aB.x); alpha *= step(uSheet.x, mx) * step(mx, uSheet.y); }
    } else if (kind < 1.5) {
      // rigid thing travelling a straight lane: trams, cars, barges, trains
      float s = mod(uTime * aT.y + aT.z * aT.w, aT.w);
      vec3 off = vec3(cos(aT.x), 0., sin(aT.x)) * s;
      A += off; B += off;
      alpha *= smoothstep(0., 25., s) * (1. - smoothstep(aT.w - 25., aT.w, s)) * smoothstep(aX.x, aX.x + 0.02, uU);
    } else if (kind < 2.5) {
      // tick-mark bird: one stroke of a V whose wingbeat is the V opening and closing
      int fi = int(aX.y + 0.5);
      vec4 F = uFlock[fi];
      float a = aA.z + uTime * aB.z;
      vec3 pos = F.xyz + vec3(cos(a) * aA.x, aA.y + sin(uTime * 0.7 + aA.z * 3.) * aT.y, sin(a) * aA.x) * F.w;
      // a drawn mark, so it always faces the page: the V lies in the plane of the picture
      vec3 cr = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), cu = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
      float th = 0.55 + 0.45 * sin(uTime * aT.x + aA.z * 5.);
      A = pos;
      B = pos + (cr * aB.x * cos(th) + cu * sin(th)) * aB.y;
      alpha *= smoothstep(aX.x, aX.x + 0.02, uU);
    } else if (kind < 3.5) {
      // chalk dust: dots drifting with the epoch, wobbling in time
      float k = uU - aT.x;
      vec3 pos = aA + aB * k + vec3(sin(uTime * 0.7 + aT.z), 0.6 * sin(uTime * 0.5 + aT.z * 1.7), cos(uTime * 0.6 + aT.z * 2.3)) * aT.w;
      A = pos; B = pos; dotty = 1.;
      alpha *= smoothstep(0., 0.008, k) * (1. - smoothstep(aT.y - 0.05, aT.y, uU)) * smoothstep(4., 14., length(pos - uCam));
    } else if (kind < 4.5) {
      // falling loop: shed leaves (dots) drifting down and sideways
      float f = fract(uTime / aT.x + aT.y);
      vec3 pos = aA + aB * f + vec3(sin(uTime * 1.1 + aT.y * 40.), 0., cos(uTime * 0.9 + aT.y * 31.)) * aT.w * f;
      A = pos; B = pos; dotty = 1.;
      alpha *= smoothstep(0., 0.1, f) * (1. - smoothstep(0.8, 1., f)) * smoothstep(aX.x, aX.x + 0.02, uU);
    } else if (kind < 5.5) {
      // drafted rain: parallel strokes wrapped in a box round the camera
      float f = fract(uTime / aT.x + aT.y);
      vec3 pos = aA + aB * f;
      pos = uCam + mod(pos - uCam + 0.5 * aT.w, aT.w) - 0.5 * aT.w;
      A = pos; B = pos + aB * (aT.z / max(length(aB), 1e-3)); dotty = aT.z < 0.01 ? 1. : 0.;
      float dc = length(pos - uCam);
      alpha *= 0.5 * smoothstep(aX.x, aX.x + 0.03, uU) * (1. - smoothstep(0.38 * aT.w, 0.5 * aT.w, dc)) * smoothstep(5., 22., dc);
    } else if (kind > 6.5) {
      // riders on a ring road about the origin: A and B are (radius, height, angle)
      float w = uTime * aT.y + aT.z;
      A = vec3(cos(aA.z + w) * aA.x, aA.y, sin(aA.z + w) * aA.x);
      B = vec3(cos(aB.z + w) * aB.x, aB.y, sin(aB.z + w) * aB.x);
      alpha *= smoothstep(aX.x, aX.x + 0.02, uU);
    } else {
      // drifting rigid outline: revision clouds (which keep redrawing their scallops) and airships
      float span = max(aX.y, 1.);
      float off = mod(uTime * aT.y + aT.z, span) - span * 0.5;
      vec3 o = aT.w > 1.5 ? uScript2 : (aT.w > 0.5 ? uScript : vec3(off, 0., 0.));
      A += o; B += o;
      if (aT.w < 0.5) alpha *= 1. - smoothstep(span * 0.42, span * 0.5, abs(off));
      if (aT.x >= 0.) {
        float c = fract(uTime * 0.05 + aT.x);
        p = clamp(c * 7., 0., 1.); alpha *= 1. - smoothstep(0.9, 1., c); tipOn = 1.;
      }
      alpha *= smoothstep(aX.x, aX.x + 0.03, uU);
    }
    A = (modelMatrix * vec4(A, 1.)).xyz; B = (modelMatrix * vec4(B, 1.)).xyz;
    if (p <= 0.) alpha = 0.;
    vec3 E = mix(A, B, p);
    // (red and cream never take the distance tone: the centre-cross must read from the far end of the avenue)
    float dk = (kind < 1.5 || kind > 6.5) ? 1. : (kind < 2.5 ? 0.5 : 0.);
    if (aS.z > 1.5 && aS.z < 3.5) dk = 0.;
    // (the line we ride passes a couple of metres under the lens: it stays a ruled line, never a white bar)
    gMaxPx = (kind < 0.5 && aT.w < -0.5) ? max(4., uRes.y * (aS.z > 2.5 ? 0.016 : 0.012)) : 14.;
    // (and its sleepers are not drawn within a few metres of the lens, where one would be a bar across the picture)
    if (kind < 0.5 && aT.w < -0.5 && aS.z > 3.5) alpha *= smoothstep(3.5, 9., distance(mix(A, E, 0.5), uCam));
    // construction lines right beside the cage sink back: they are scaffolding for the eye, not the picture
    if (kind < 0.5 && aS.z > 0.5 && aS.z < 1.5 && aS.x > 0.03) alpha *= mix(0.5, 1., smoothstep(18., 40., distance(mix(A, E, 0.5), uCam)));
    vec4 mvPosition = ribbon(A, E, length(B - A) * p, aS.x, rank, alpha, dotty, dk);
    vStyle = style;
    vCrawl = (kind < 0.5 && style > 0.5) ? 1. : 0.;     // drawn dashes creep along their line
    vTip = (p < 0.999 && tipOn > 0.5) ? 1. : 0.;
    vCol = mix(uCol[int(aS.z + 0.5)], uCol[1] * 1.5, 0.7 * gFar);
    #include <fog_vertex>
  }`,le=`
  uniform float uTime;
  varying float vS, vLen, vEdge, vHalf, vStyle, vTip, vAlpha, vMpp, vCrawl, vDot; varying vec3 vCol;
  #include <fog_pars_fragment>
  void main() {
    float er = vDot > -5e3 ? length(vec2(vEdge, vDot)) : abs(vEdge);
    float a = vAlpha * (1. - smoothstep(vHalf - 0.45, vHalf + 0.75, er));
    if (vStyle > 0.5) {
      float base = vStyle > 1.5 ? 5.0 : 2.6;
      float per = base * exp2(max(-6., ceil(log2(max(vMpp * 9. / base, 1e-3)))));
      float f = fract(vS / per - vCrawl * uTime * 0.22);
      float on = vStyle > 1.5 ? max(step(f, 0.58), step(0.74, f) * step(f, 0.84)) : step(f, 0.6);
      a *= on;
    }
    if (a < 0.004) discard;
    float tip = vTip * (1. - smoothstep(0., max(3., vMpp * 5.), vLen - vS));
    gl_FragColor = vec4(vCol * (1. + 1.7 * tip), a);
    #include <fog_fragment>
  }`,Ie=`
  attribute vec3 aC0, aC1; attribute vec2 aE; attribute vec4 iPos, iH, iR;
  uniform float uU, uHidden; uniform vec3 uCol[6];
  ${ie}
  #include <fog_pars_vertex>
  void main() {
    float g = smoothstep(iH.z, iH.z + iH.w, uU);
    float H = iH.y * g;
    vec3 sz = vec3(iPos.z, H, iPos.w), org = vec3(iPos.x, iH.x, iPos.y);
    vec3 A = org + (aC0 - vec3(0.5, 0., 0.5)) * sz, B = org + (aC1 - vec3(0.5, 0., 0.5)) * sz;
    vec3 dir = aC1 - aC0;
    float p = 1., alpha = 1., rank = 0.;
    if (aE.x < 0.5) {
      // footprint: ruled side by side just before the walls are pulled up; corners overshoot
      float t0 = iH.z - 0.022 + aE.y * 0.005;
      p = clamp((uU - t0) / 0.005, 0., 1.);
      A -= dir * 0.5; B += dir * 0.5; rank = 1.;
    } else if (aE.x < 1.5) {
      if (g <= 0.) alpha = 0.;
      B.y += 0.5; p = g < 1. ? 0.998 : 1.; rank = 1.;
    } else {
      alpha *= smoothstep(0.02, 0.12, g);
      A -= dir * 0.5; B += dir * 0.5;
    }
    // rubbed out: a 12 percent ghost that lingers, then goes
    alpha *= (1. - 0.88 * smoothstep(iR.x, iR.x + 0.008, uU)) * (1. - smoothstep(iR.x + 0.07, iR.x + 0.14, uU));
    if (p <= 0.) alpha = 0.;
    // hidden edges are a near thing: beyond ~250 m they would stack into grey bands seen through the Spire's slab
    if (uHidden > 0.5) alpha *= 0.17 * (1. - smoothstep(170., 290., length(org + vec3(0., H * 0.5, 0.) - cameraPosition)));
    vec3 E = mix(A, B, p);
    gMaxPx = 14.;
    vec4 mvPosition = ribbon(A, E, length(B - A) * p, rank < 0.5 ? 0.24 : 0.13, rank, alpha, 0., 1.);
    vStyle = uHidden > 0.5 ? 1. : 0.;
    vTip = p < 0.999 ? 1. : 0.;
    vCol = mix(uCol[0], uCol[1] * 1.5, 0.7 * gFar);
    #include <fog_vertex>
  }`,Be=`
  attribute vec4 iPos, iH, iR; uniform float uU;
  varying vec3 vW, vN; varying vec4 vI;
  #include <fog_pars_vertex>
  void main() {
    float g = smoothstep(iH.z, iH.z + iH.w, uU) * (1. - smoothstep(iR.x, iR.x + 0.012, uU));
    float H = iH.y * g;
    vec3 p = vec3(iPos.x + position.x * (iPos.z - 0.5), iH.x + position.y * H, iPos.y + position.z * (iPos.w - 0.5));
    if (H < 0.03) p = vec3(iPos.x, -6., iPos.y);
    vW = p; vN = normal; vI = vec4(iH.x + H, iH.z + iH.w, iR.y, iH.x);
    vec4 mvPosition = viewMatrix * vec4(p, 1.);
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }`,Vt=`
  float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float vnoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y); }
  float hatch(float q, float fw) {
    float base = 1.3, lv = log2(max(9. * fw / base, 1.)), l0 = floor(lv), fr = lv - l0;
    float s0 = base * exp2(l0), s1 = s0 * 2.;
    float d0 = abs(fract(q / s0 + 0.5) - 0.5) * s0, d1 = abs(fract(q / s1 + 0.5) - 0.5) * s1;
    float w = fw * 0.75;
    float h0 = 1. - smoothstep(w * 0.5, w * 1.5, d0), h1 = 1. - smoothstep(w * 0.5, w * 1.5, d1);
    return mix(h0, h1, smoothstep(0.35, 1., fr));
  }`,Fe=`
  uniform vec3 uP0, uP1, uP2, uInk, uCons, uCream; uniform float uU, uNight, uSnow; uniform vec2 uSheet;
  varying vec3 vW, vN; varying vec4 vI;
  #include <fog_pars_fragment>
  ${Vt}
  void main() {
    vec3 n = normalize(vN);
    vec2 nq = floor(n.xz + 0.5);          // exact face normal for hashing (an interpolated 0.9999 turns into pixel noise)
    bool cap = n.y > 0.5;
    float t = abs(n.x) > 0.5 ? vW.z : vW.x;
    vec2 fc = cap ? vW.xz : vec2(t, vW.y);
    float q1 = (fc.x + fc.y) * 0.7071;
    float fw = max(fwidth(q1), 1e-4), fy = max(fwidth(vW.y), 1e-4), ft = max(fwidth(t), 1e-4);
    float mott = 0.5 + 0.25 * sin(fc.x * 0.021 + 1.3) * sin(fc.y * 0.017 + vW.z * 0.01) + 0.25 * sin(fc.x * 0.11 + fc.y * 0.07);
    float shaded = cap ? 0. : max(step(0.5, n.x), step(0.5, -n.z));
    // a wash, as a draughtsman lays one: faces to the light are pale, faces turned away are the dark of the sheet,
    // and everything goes paler with distance, so far blocks are silhouettes against the darker ground
    float dC = length(vW - cameraPosition);
    bool tall = vI.w > 25.;                 // third generation: its roof is a step lighter, so the skyline's top edge reads
    vec3 lit = mix(uP1, uP2, 0.52) + 0.07 * uCons * (1. - smoothstep(150., 300., dC));
    vec3 paper = cap ? mix(uP1, uP2, tall ? 0.62 : 0.35) : mix(lit, uP0, shaded);
    paper *= 0.92 + 0.14 * mott + 0.05 * (hash(floor(fc * 3.) + nq * 7.) - 0.5);
    paper = mix(paper, uP2 * (cap && tall ? 1.14 : 1.), 0.6 * smoothstep(250., 1200., dC));
    vec3 col = paper;
    if (cap) {
      if (uSnow > 0.5) {
        // winter: stippled snow on the roofs
        vec2 c = vW.xz / 1.1, id = floor(c);
        vec2 o = vec2(hash(id), hash(id + 17.3)) * 0.6 + 0.2;
        float d = length(fract(c) - o) * 1.1, fx = max(fwidth(vW.x) + fwidth(vW.z), 1e-4);
        float dot1 = (1. - smoothstep(0.2, 0.2 + fx, d)) * step(0.12, hash(id + 3.1));
        col = mix(col, uInk * 0.85, mix(dot1, 0.16, smoothstep(0.5, 1.6, fx)) * 0.8);
      }
    } else {
      float below = step(vW.y, vI.x - 0.4);
      // floor lines showing through as dashes, window ticks when near
      float fl = abs(fract((vW.y - vI.w) / 3.8 + 0.5) - 0.5) * 3.8;
      float floorLine = (1. - smoothstep(fy * 0.5, fy * 1.5, fl)) * step(fract(t / 2.6), 0.6) * (1. - smoothstep(0.5, 1.6, fy));
      vec2 wc = vec2(t / 3.2, (vW.y - vI.w) / 3.8);
      float wx = abs(fract(wc.x) - 0.5) * 3.2, wy = fract(wc.y);
      float tick = (1. - smoothstep(ft * 0.5, ft * 1.5, wx)) * step(0.28, wy) * step(wy, 0.78) * (1. - smoothstep(0.12, 0.4, ft));
      float ink = max(floorLine * 0.22, tick * 0.34) * below;
      // hatching falls down the shaded faces once the walls are up
      float front = vI.x - (uU - vI.y) * 2600. + 5. * sin(q1 * 0.83) * sin(q1 * 0.29 + 2.);
      col = mix(col, uInk * 0.6, ink);
      // (the hatching is construction blue, lighter than the outline: the heavy white edge always wins)
      // near the camera it is ruled firmly in pale ink; beyond 350 m it sinks to a tone
      float nearH = 1. - smoothstep(180., 350., dC);
      col = mix(col, mix(uCons * 0.8, uInk * 0.75, nearH), shaded * hatch(q1, fw) * smoothstep(0., 2.5, vW.y - front) * mix(0.42, 0.7, nearH) * step(vI.y, uU));
      if (uNight > 0.5) {
        vec2 id = floor(wc), wf = abs(fract(wc) - 0.5);
        float wfw = max(fwidth(wc.x), fwidth(wc.y));
        float sq = (1. - smoothstep(0.22 - wfw, 0.22 + wfw, wf.x)) * (1. - smoothstep(0.26 - wfw, 0.26 + wfw, wf.y));
        float wk = smoothstep(0.14, 0.5, wfw);     // unresolved squares take their mean lighting, not pixel noise
        // near to, a lit window is drawn, not filled: a ruled outline, a mullion cross and a thin wash inside
        float inner = (1. - smoothstep(0.18 - wfw, 0.18 + wfw, wf.x)) * (1. - smoothstep(0.215 - wfw, 0.215 + wfw, wf.y));
        float mull = max(1. - smoothstep(wfw * 0.5, wfw * 1.6 + 0.012, wf.x), 1. - smoothstep(wfw * 0.5, wfw * 1.6 + 0.012, wf.y));
        float drawn = sq * max(max(1. - inner, mull * 0.75), 0.3);
        sq = mix(drawn, sq, smoothstep(0.035, 0.08, wfw));
        sq = mix(sq, 0.11, wk);
        float r = hash(id + nq * 3. + floor(vI.z * 61. + 0.5));
        float on = mix(step(0.42, r), 0.58, wk) * smoothstep(0., 0.01, uU - vI.y - 0.02 - 0.06 * mix(fract(r * 7.3), 0.5, wk)) * below;
        vec3 wcol = mix(uCream, uCons * 1.15, mix(smoothstep(0.3, 0.7, fract(r * 5.3)), 0.5, wk));
        col = mix(col, wcol * mix(0.75 + 0.4 * fract(r * 13.7), 0.95, wk), sq * on * 0.8);
      }
    }
    // rare: under the sheet of tracing paper everything is a little paler, with a pale line where its edges cross
    float zS = step(abs(vW.z + 40.), 620.), fxS = max(fwidth(vW.x), 1e-4);
    float inS = step(uSheet.x, vW.x) * step(vW.x, uSheet.y) * zS;
    float edgeS = max(1. - smoothstep(1., 1. + fxS * 1.5, abs(vW.x - uSheet.x)), 1. - smoothstep(1., 1. + fxS * 1.5, abs(vW.x - uSheet.y))) * zS;
    col = mix(col, uCons, 0.16 * inS);
    col = mix(col, uInk * 0.85, 0.6 * edgeS);
    gl_FragColor = vec4(col, 1.);
    #include <fog_fragment>
  }`,T0=22,qe=`
  uniform vec3 uP0, uP1, uP2, uInk, uCons, uRed; uniform float uU, uTime, uRivK, uRub, uSnow, uPL, uThrough;
  uniform vec2 uRiv[${T0}]; uniform vec4 uPark[2]; uniform vec4 uClear[4]; uniform vec2 uSheet; uniform vec4 uRubBox;
  varying vec3 vP;
  #include <fog_pars_fragment>
  ${Vt}
  float grid(vec2 p, float s, vec2 fw) { vec2 d = abs(fract(p / s + 0.5) - 0.5) * s; vec2 l = 1. - smoothstep(fw * 0.4, fw * 1.4, d); return max(l.x, l.y); }
  void river(vec2 p, out float sd, out float s) {
    float best = 1e9, acc = 0.; sd = 1e4; s = 0.;
    for (int i = 0; i < ${T0-1}; i++) {
      vec2 a = uRiv[i], ab = uRiv[i + 1] - a; float L2 = max(dot(ab, ab), 1e-3), L = sqrt(L2);
      float t = clamp(dot(p - a, ab) / L2, 0., 1.);
      vec2 dv = p - a - ab * t; float dd = dot(dv, dv);
      if (dd < best) { best = dd; s = acc + t * L; sd = sqrt(dd) * (ab.x * dv.y - ab.y * dv.x < 0. ? -1. : 1.); }
      acc += L;
    }
  }
  float fold(float c) { return exp(-c * c * 0.08) - 0.6 * exp(-(c - 2.5) * (c - 2.5) * 0.05); }
  void main() {
    vec2 p = vP.xz; float r = length(p);
    vec2 fw = max(fwidth(p), vec2(1e-4)); float f = max(fw.x, fw.y);
    float mott = vnoise(p * 0.004) * 0.6 + vnoise(p * 0.013 + 7.) * 0.3 + vnoise(p * 0.06) * 0.1;
    // (near the camera the paper is paper: stronger exposure mottling, a finer blotch and a firmer grid)
    float dG = length(vP - cameraPosition), nearG = 1. - smoothstep(120., 320., dG);
    float blotch = vnoise(p * 0.031 + 3.) * 0.6 + vnoise(p * 0.09 + 11.) * 0.4;
    vec3 col = mix(uP0, uP1, clamp(0.375 + (mott - 0.5) * 0.55 * (1. + nearG) + (blotch - 0.5) * 0.3 * nearG, 0., 1.));
    col *= 0.94 + 0.12 * vnoise(p * 1.7) * (1. - smoothstep(0.3, 1.5, f));
    float minor = grid(p, 10., fw * 0.7) * (1. - smoothstep(0.4, 1.6, f)) * (0.1 + 0.05 * nearG);
    float major = grid(p, 50., fw * 0.7) * (1. - smoothstep(3., 12., f)) * 0.17 * (1. + nearG);
    col = mix(col, uCons * 0.5, max(minor, major));
    // old folds every 800 m: a pale ridge with a darker valley beside it
    vec2 fc = mod(p + vec2(318., 345.), 800.) - 400.;
    col *= 1. + 0.5 * (fold(fc.x) + fold(fc.y)) * (1. - smoothstep(1.5, 7., f));
    // and one crease straight across the avenue, a little askew, 60 m ahead of where we come in: a pale ridge
    // with its highlight edge and the darker valley beside it
    float cz = p.y - ${o0-62}. - p.x * 0.07, cf = 1. - smoothstep(2., 9., fw.y);
    col *= 1. + (0.9 * fold(cz * 0.8) * cf);
    col = mix(col, uP2 * 1.25, 0.5 * exp(-cz * cz * 0.9) * cf);

    // ---- the river
    float sd, s; river(p, sd, s);
    float hw = 30. + 15. * smoothstep(60., 260., abs(p.x));
    float tR = 0.02 + s * uRivK, rOn = smoothstep(tR, tR + 0.012, uU);
    float fs = clamp(min(fwidth(sd) + 1e-3, f * 1.5), 1e-3, 40.);
    float inR = 1. - smoothstep(hw - fs, hw + fs, abs(sd));
    col = mix(col, uP2, 0.2 * inR * rOn);
    float sp = hw / 3.6;
    float wv = sd + sin(s * 0.045 - uTime * 0.9) * 2.4 + sin(s * 0.019 + uTime * 0.35) * 1.6;
    float dl = abs(fract(wv / sp + 0.5) - 0.5) * sp;
    float dash = 0.55 + 0.45 * step(fract(s / 46. - uTime * 0.16 + floor(wv / sp + 0.5) * 0.37), 0.72);
    float wl = (1. - smoothstep(fs * 0.5, fs * 1.5, dl)) * step(abs(sd), hw - sp * 0.4) * dash;
    wl = mix(wl, 0.14, smoothstep(1.2, 5., fs)) * inR;
    float bank = 1. - smoothstep(fs * 0.7, fs * 1.9, abs(abs(sd) - hw));
    float tipR = 1. + 1.2 * (1. - smoothstep(0., 0.012, uU - tR)) * (1. - smoothstep(1., 4., fs));
    col = mix(col, uInk * 0.95 * tipR, clamp(max(wl * 0.8, bank * 0.95) * rOn * (1. - 0.6 * smoothstep(3., 14., fs)), 0., 1.));

    // ---- the street plan: kerbs outline the blocks, racing out from the avenue as the epoch passes
    float cityR = 950. + 70. * sin(p.x * 0.004 + 1.) * cos(p.y * 0.0033) + 40. * sin((p.x + p.y) * 0.007);
    float m = (1. - smoothstep(cityR - 20., cityR, r)) * step(hw + 7., abs(sd)) * step(133., r);
    for (int i = 0; i < 2; i++) m *= step(uPark[i].z + 2., length(p - uPark[i].xy));
    for (int i = 0; i < 4; i++) m *= step(uClear[i].z, length(p - uClear[i].xy));
    vec2 c = p - vec2(0., ${M0}.);
    vec2 dxy = abs(fract(c / ${v0}. + 0.5) - 0.5) * ${v0}.;
    float wxs = abs(p.x) < 30. ? 12. : (abs(abs(p.x) - 300.) < 30. || abs(abs(p.x) - 600.) < 30. ? 9. : 6.);
    float wzs = abs(abs(c.y - 300.) - 300.) < 30. || abs(c.y + 300.) < 30. ? 9. : 6.;
    float dg = min(abs(p.x - p.y), abs(p.x + p.y)) * 0.7071;
    float q = min(min(dxy.x - wxs, dxy.y - wzs), dg - 8.);
    float sA = (${o0}. - p.y) / uPL;
    float tS = min((sA < 0.0867 ? sA - 8. / uPL : 0.08 + (sA - 0.0867) * 0.25) + abs(p.x) / 6000., 0.33 + r / 3000.);
    // (the streets nearest the entry are the first thing ruled: the avenue's kerbs run on ahead of us and the first
    // two cross streets shoot out to left and right at u 0.005 and 0.02)
    float ez = ${o0}. - p.y;
    float tE = (ez < 60. ? max(ez, 0.) * (0.005 / 60.) : 0.005 + (ez - 60.) * 0.00025) + abs(p.x) / 9000. + 9. * step(150., ez) - 0.06 * uThrough;
    tS = min(tS, tE);
    float sOn = smoothstep(tS, tS + 0.004, uU);
    float tipS = 1. + 1.6 * (1. - smoothstep(0., 0.01, uU - tS)) * (1. - smoothstep(0.5, 3., f));
    // each family of kerbs is antialiased and faded by its own screen-space derivative, so the lines that run
    // away from us stay crisp to the horizon while the ones across the view thin out before they can shimmer
    float qx = dxy.x - wxs, qz = dxy.y - wzs, fdg = max(fwidth(dg), 1e-4);
    float kx = (1. - smoothstep(fw.x * 0.6, fw.x * 1.6, abs(qx))) * step(-0.5, qz) * step(8., dg) * (1. - 0.8 * smoothstep(1.5, 7., fw.x));
    float kz = (1. - smoothstep(fw.y * 0.6, fw.y * 1.6, abs(qz))) * step(-0.5, qx) * step(8., dg) * (1. - 0.8 * smoothstep(1.5, 7., fw.y));
    float kd = (1. - smoothstep(fdg * 0.6, fdg * 1.6, abs(dg - 8.))) * step(0., min(qx, qz)) * (1. - 0.8 * smoothstep(1.5, 7., fdg));
    float kerb = max(max(kx, kz), kd);
    float walk = (1. - smoothstep(f * 0.5, f * 1.4, abs(q - 2.5))) * (1. - smoothstep(0.25, 0.9, f)) * 0.35;
    float lane = (1. - smoothstep(f * 0.5, f * 1.4, min(dxy.x, dxy.y))) * step(fract((p.x + p.y) / 9.), 0.5) * (1. - smoothstep(0.3, 1.0, f)) * 0.3 * step(q, -1.);
    float st = max(max(kerb * 0.75, walk), lane);
    // the sheet is planned before it is drawn: every lot's building line is there from the start as a faint
    // dashed construction line, and sinks back once the kerbs are ruled over it
    float px = (1. - smoothstep(fw.x * 0.6, fw.x * 1.6, abs(qx - 4.))) * step(3.5, qz) * (1. - 0.85 * smoothstep(1.2, 6., fw.x));
    float pz = (1. - smoothstep(fw.y * 0.6, fw.y * 1.6, abs(qz - 4.))) * step(3.5, qx) * (1. - 0.85 * smoothstep(1.2, 6., fw.y));
    float plan = max(px * step(fract(p.y / 7.), 0.6), pz * step(fract(p.x / 7.), 0.6)) * step(13., dg);
    col = mix(col, uCons * 0.8, plan * 0.42 * m * (1. - 0.65 * sOn) * (1. - smoothstep(500., 900., dG)));
    col = mix(col, uInk * 0.9 * tipS, clamp(st * m * sOn, 0., 1.));

    // ---- parks: stippled dot fields
    for (int i = 0; i < 2; i++) {
      float pr = length(p - uPark[i].xy), pin = 1. - smoothstep(uPark[i].z - 6., uPark[i].z - 1., pr);
      vec2 pc = p / 3.6, id = floor(pc);
      vec2 o = vec2(hash(id), hash(id + 9.7)) * 0.6 + 0.2;
      float d = length(fract(pc) - o) * 3.6;
      float dt = (1. - smoothstep(0.32, 0.32 + f, d));
      dt = mix(dt, 0.07, smoothstep(0.5, 2., f));
      col = mix(col, uInk * 0.85, dt * 0.7 * pin * step(abs(sd), 1e5) * step(hw + 3., abs(sd)) * smoothstep(uPark[i].w, uPark[i].w + 0.08, uU - 0.0004 * pr));
    }
    // ---- the eraser: a soft pale band sweeps the district, leaving a smudge
    vec2 rb = step(uRubBox.xz, p) * step(p, uRubBox.yw);
    float inBox = rb.x * rb.y;
    float bx = p.y - uRub;
    col = mix(col, uP2 * 1.5, 0.55 * exp(-bx * bx / 260.) * inBox * step(uRubBox.z - 30., uRub) * step(uRub, uRubBox.w + 30.));
    col = mix(col, uP2, 0.14 * inBox * step(uRub, p.y) * vnoise(p * 0.09));
    // ---- rare: the sheet of tracing paper
    float inS = step(uSheet.x, p.x) * step(p.x, uSheet.y) * step(abs(p.y + 40.), 620.);
    float eW = max(f, 1.);
    float edgeS = max(1. - smoothstep(eW, eW * 2.2, abs(p.x - uSheet.x)), 1. - smoothstep(eW, eW * 2.2, abs(p.x - uSheet.y))) * step(abs(p.y + 40.), 620.);
    edgeS = max(edgeS, (1. - smoothstep(eW, eW * 2.2, abs(abs(p.y + 40.) - 620.))) * step(uSheet.x, p.x) * step(p.x, uSheet.y));
    col = mix(col, vec3(0.42, 0.55, 0.66), 0.45 * inS);
    col = mix(col, uInk * 0.85, 0.6 * edgeS);
    if (uSnow > 0.5) col = mix(col, uP2, 0.08);
    // the sheet pales towards its far edges, as blueprints do where the exposure was uneven
    col = mix(col, uP2, 0.6 * smoothstep(120., 1900., length(vP - cameraPosition)));
    gl_FragColor = vec4(col, 1.);
    #include <fog_fragment>
  }`,Ue=`
  uniform vec3 uP0, uP1, uP2, uInk, uCons, uWarm, uNorth, uN1, uN2; uniform float uTime, uBand, uWarmK, uNightK;
  varying vec3 vDir;
  ${Vt}
  void main() {
    vec3 d = normalize(vDir); float e = d.y;
    // more paper: darkest overhead, an unevenly exposed pale band above the horizon
    vec2 mp = d.xz / (1. + abs(d.y));
    float mott = vnoise(mp * 3.) * 0.55 + vnoise(mp * 9. + 3.) * 0.3 + vnoise(mp * 31.) * 0.15;
    float band = exp(-max(e, 0.) * uBand * (0.8 + 0.5 * mott));
    // (overhead the sheet is lifted a little off its darkest and mottled more strongly: the finale looks straight up)
    vec3 col = mix(mix(uP0, uP1, mix(0.2, 0.75, uNightK)), uP2, band);
    col = mix(col, uWarm, uWarmK * band * band * (0.6 + 0.4 * mott));
    float amp = mix(0.2, mix(0.36, 0.5, uNightK), smoothstep(0.3, 0.6, e));
    float blot = vnoise(mp * 1.3 + 11.) * 0.6 + vnoise(mp * 4.7 + 5.) * 0.4;
    col *= 1. - 0.5 * amp + amp * mix(mott, blot, 0.5 * smoothstep(0.3, 0.6, e));
    col *= 0.97 + 0.06 * hash(floor(mp * 900.));
    // the grid runs faintly up the sheet and fades out by 30 degrees
    float hl = max(length(d.xz), 1e-3);
    float az = atan(d.x, -d.z + (abs(d.x) + abs(d.z) < 1e-5 ? 1e-5 : 0.)) * 1146.;
    float el = e / hl * 1146.;
    float fa = max(fwidth(el), 1e-3), fb = clamp(fwidth(az), 1e-3, 30.);
    float gl1 = 1. - smoothstep(fa * 0.5, fa * 1.5, abs(fract(el / 50. + 0.5) - 0.5) * 50.);
    float gl2 = 1. - smoothstep(fb * 0.5, fb * 1.5, abs(fract(az / 50. + 0.5) - 0.5) * 50.);
    col = mix(col, uCons * 0.6, max(gl1, gl2) * 0.075 * (1. - smoothstep(0.2, 0.5, e)) * step(0., e) * (1. - smoothstep(4., 14., fa)));
    // overhead there is only more paper, lying flat: a faint ruled grid on a plane (straight lines, never a pole),
    // an old fold crease across it, and the mottling
    vec2 zc = d.xz / max(e, 0.25) * 7. + vec2(0.37, 0.21);
    vec2 zf = max(fwidth(zc), vec2(1e-4)), zd = abs(fract(zc + 0.5) - 0.5);
    float zg = max(1. - smoothstep(zf.x * 0.5, zf.x * 1.5, zd.x), 1. - smoothstep(zf.y * 0.5, zf.y * 1.5, zd.y));
    vec2 zd5 = abs(fract(zc / 5. + 0.5) - 0.5) * 5.;
    float zg5 = max(1. - smoothstep(zf.x * 0.7, zf.x * 2., zd5.x), 1. - smoothstep(zf.y * 0.7, zf.y * 2., zd5.y));
    float over = smoothstep(0.5, 0.74, e);
    col = mix(col, uCons * 0.6, max(zg * 0.045, zg5 * 0.1) * over * (1. - smoothstep(0.2, 0.5, max(zf.x, zf.y))));
    float cz = (zc.x * 0.8 + zc.y * 0.6 - 3.7) * 7.;
    col *= 1. + 0.22 * over * (exp(-cz * cz * 0.08) - 0.6 * exp(-(cz - 2.5) * (cz - 2.5) * 0.05));
    // the north point: a drawn circle with a centre cross and one arrow, turning very slowly
    float nd = dot(d, uNorth);
    if (nd > 0.9) {
      vec2 uv = vec2(dot(d, uN1), dot(d, uN2)) / 0.1045;
      float a = uTime * 0.04, ca = cos(a), sa = sin(a);
      uv = vec2(ca * uv.x - sa * uv.y, sa * uv.x + ca * uv.y);
      float fu = max(fwidth(uv.x) + fwidth(uv.y), 1e-4) * 0.8, rr = length(uv);
      float ln = 1. - smoothstep(fu, fu * 2.2, abs(rr - 1.));
      ln = max(ln, (1. - smoothstep(fu * 0.6, fu * 1.6, abs(rr - 0.9))) * 0.5);
      ln = max(ln, (1. - smoothstep(fu, fu * 2.2, min(abs(uv.x), abs(uv.y)))) * step(rr, 0.28));
      ln = max(ln, (1. - smoothstep(fu, fu * 2.2, abs(uv.x))) * step(0., uv.y) * step(uv.y, 1.45));
      float ah = abs(abs(uv.x) - (1.45 - uv.y) * 0.45);
      ln = max(ln, (1. - smoothstep(fu, fu * 2.2, ah)) * step(1.05, uv.y) * step(uv.y, 1.45));
      col = mix(col, uInk * 1.25, ln * 0.85);
    }
    gl_FragColor = vec4(col, 1.);
  }`;function We(C){const t=T=>(T*(T+.0245786)-90537e-9)/(T*(.983729*T+.432951)+.238081),I=T=>{const H=t(.59719*T[0]+.35458*T[1]+.04823*T[2]),F=t(.076*T[0]+.90834*T[1]+.01566*T[2]),y=t(.0284*T[0]+.13383*T[1]+.83777*T[2]);return[1.60475*H-.53108*F-.07367*y,-.10208*H+1.10813*F-.00605*y,-.00327*H-.07276*F+1.07602*y]},k=new x.Color(C),U=[k.r,k.g,k.b],S=U.slice();for(let T=0;T<500;T++){const H=I(S.map(F=>F/.6));for(let F=0;F<3;F++)S[F]=Math.max(1e-5,S[F]+.3*(U[F]-H[F]))}return new x.Color().setRGB(S[0],S[1],S[2])}function N0(){const C=[],t={d:C,rank:q,style:B,col:e0,kind:a0,ws:1,set(I){return Object.assign(t,I),t},raw(I,k,U,S,T,H,F,y,A,_,Y=0,h0=0){C.push(I,k,U,S,T,H,Ee[t.rank]*t.ws,t.style+4*t.rank,t.col,t.kind,F,y,A,_,Y,h0)},seg(I,k,U,S,T,H,F=-1,y=-.5,A=9,_=0,Y=0){t.raw(I,k,U,S,T,H,F,y,A,_,0,Y)},poly(I,k=-1,U=-.5,S=9,T=0,H=0){const F=I.length-1;for(let y=0;y<F;y++){const A=I[y],_=I[y+1];t.raw(A[0],A[1],A[2],_[0],_[1],_[2],P(k,U,y/F),P(k,U,(y+1)/F),S,T,0,H)}},circle(I,k,U,S,T,H=-1,F=-.5,y=9,A=0,_=0,Y=Math.PI*2){const h0=[];for(let i0=0;i0<=T;i0++){const l0=P(_,Y,i0/T),G=Math.cos(l0)*S,R=Math.sin(l0)*S;h0.push([I[0]+k[0]*G+U[0]*R,I[1]+k[1]*G+U[1]*R,I[2]+k[2]*G+U[2]*R])}t.poly(h0,H,F,y,A)},get count(){return C.length/16}};return t}function He(C){const t=new x.InstancedBufferGeometry;t.setAttribute("position",new x.BufferAttribute(new Float32Array([0,-1,0,1,-1,0,1,1,0,0,1,0]),3)),t.setIndex([0,1,2,0,2,3]);const I=new x.InstancedInterleavedBuffer(new Float32Array(C),16);return t.setAttribute("aA",new x.InterleavedBufferAttribute(I,3,0)),t.setAttribute("aB",new x.InterleavedBufferAttribute(I,3,3)),t.setAttribute("aS",new x.InterleavedBufferAttribute(I,4,6)),t.setAttribute("aT",new x.InterleavedBufferAttribute(I,4,10)),t.setAttribute("aX",new x.InterleavedBufferAttribute(I,2,14)),t.instanceCount=C.length/16,t.boundingSphere=new x.Sphere(new x.Vector3(0,300,0),6e3),t}const vt=()=>x.UniformsUtils.clone(x.UniformsLib.fog);function L0(C,t,I=3){const k=new x.ShaderMaterial({vertexShader:Re,fragmentShader:le,fog:!0,transparent:!0,depthWrite:!1,uniforms:{...vt(),uU:t.uU,uTime:t.uTime,uRes:t.uRes,uCol:t.uCol,uFlock:t.uFlock,uCam:t.uCam,uScript:t.uScript,uScript2:t.uScript2,uSheet:t.uSheet}}),U=new x.Mesh(He(C),k);return U.frustumCulled=!1,U.renderOrder=I,U}function _e(){const C=[[2300,440],[1300,372],[620,300],[270,212],[0,178],[-160,132],[-218,10],[-232,-150],[-400,-420],[-800,-860],[-1500,-1640]],t=new x.CatmullRomCurve3(C.map(y=>new x.Vector3(y[0],0,y[1])),!1,"centripetal"),I=[];for(let y=0;y<T0;y++){const A=y/(T0-1);I.push(A)}const k=I.map(y=>{const A=.5+.5*Math.sign(y-.5)*Math.pow(Math.abs(2*y-1),1.6),_=t.getPoint(A);return[_.x,_.z]});let U=0;const S=[0];for(let y=0;y<T0-1;y++)U+=Math.hypot(k[y+1][0]-k[y][0],k[y+1][1]-k[y][1]),S.push(U);return{pts:k,total:U,near:(y,A)=>{let _=1e18,Y=0,h0=1,i0=0;for(let l0=0;l0<T0-1;l0++){const G=k[l0][0],R=k[l0][1],w0=k[l0+1][0]-G,V=k[l0+1][1]-R,D0=w0*w0+V*V,E0=n0(((y-G)*w0+(A-R)*V)/D0,0,1),s0=y-G-w0*E0,u0=A-R-V*E0,x0=s0*s0+u0*u0;if(x0<_){_=x0;const G0=Math.sqrt(D0);Y=S[l0]+E0*G0,h0=w0/G0,i0=V/G0}}return{d:Math.sqrt(_),s:Y,tx:h0,tz:i0}},at:y=>{y=n0(y,0,U-.01);let A=0;for(;A<T0-2&&S[A+1]<y;)A++;const _=(y-S[A])/(S[A+1]-S[A]),Y=S[A+1]-S[A];return{x:P(k[A][0],k[A+1][0],_),z:P(k[A][1],k[A+1][1],_),tx:(k[A+1][0]-k[A][0])/Y,tz:(k[A+1][1]-k[A][1])/Y}},halfWidth:y=>30+15*t0(60,260,Math.abs(y))}}const ce=(C,t)=>950+70*Math.sin(C*.004+1)*Math.cos(t*.0033)+40*Math.sin((C+t)*.007);var Ge={id:"drafted-city",name:"The Drafted City",category:"city",weirdness:.6,media:["rail","cable"],async build(C){const t=C.rng,I=C.vary||{},k=C.quality?.detail??1,U=n0(I.density??1,.7,1.3),S=new x.Scene,T=t.fork?t.fork("sheet"):t,H=I.hour&&I.hour!=="any"?I.hour:T.pick(["day","day","day","night","night","dawn","golden"]),F=T.pick(["few","many","many","rain"]),y=T.pick(["full","full","autumn","winter"]),A=T.pick(["ziggurat","gothic","drums","ziggurat"]),_=T.pick(["tram","tram","el"]),Y=T.pick(["birds","birds","airships"]),h0=!!I.rare,i0=H==="night",l0=H==="dawn"||H==="golden",G=["#0B2A4A","#12406E","#1E5A94","#F3F7FB","#9FC2E0","#F1E6C8","#E63A2E"];i0?(G[0]="#0A2038",G[1]="#0D2C4C",G[2]="#154270"):H==="dawn"?(G[0]="#0C2D50",G[2]="#2767A4"):H==="golden"&&(G[0]="#0D2B4B",G[1]="#144370",G[2]="#255F98");const R=G.map(e=>new x.Color(e));for(let e=0;e<3;e++)R[e]=We(G[e]),G[e]="#"+R[e].getHexString();const w0=R[2].clone();S.background=w0.clone(),S.fog=new x.FogExp2(w0,F==="rain"?72e-5:55e-5);const V=await Se(C,{palette:G,sheet:!1,progress:0,hoistLine:!1,cast:A,night:i0});S.add(V.object);const D0=V.anchors.flyThrough;await C.yield();const E0=[[0,10,o0],[0,10,500],[0,10,430],[0,10,360],[0,10,290],[0,10.6,240],[0,13.6,178],[0,11.6,138],[9,12.6,116],[28,17,88],[49,23,62]];for(const e of D0)E0.push([e.x,e.y,e.z]);const s0=Me(E0),u0=600,x0=[];for(let e=0;e<=u0;e++)x0.push(s0.pointAt(e/u0));const G0=e=>{const r=n0(e,0,1)*u0,o=Math.min(u0-1,Math.floor(r));return P(x0[o].y,x0[o+1].y,r-o)};let O=.46;{let e=1e9;for(let r=0;r<=u0;r++){const o=x0[r].distanceTo(D0[0]);o<e&&(e=o,O=r/u0)}}const S0=s0.length,O0=e=>n0((o0-e)/S0,0,1),y0=e=>e<.0867?e-8/S0:.08+(e-.0867)*.25,K0=(e,r)=>Math.min(y0((o0-r)/S0)+Math.abs(e)/6e3,.33+Math.hypot(e,r)/3e3),at=.8,fe=e=>e<O?e*.44/O:e<at?.44+(e-O)*.385/(at-O):e<.9?.825+(e-at)*.75:e,he=e=>O+(e-.44)*(at-O)/.385,ue=e=>14+3*t0(.46,.52,e)*(1-t0(.62,.67,e)),pe=e=>P(Math.max(-5,G0(e)-ue(e))+46*t0(.635,.765,e),582,t0(.825,.875,e)),z={uU:{value:0},uTime:{value:0},uRes:{value:new x.Vector2(800,450)},uCol:{value:[R[3].clone().multiplyScalar(1.6),R[4].clone().multiplyScalar(.5),R[5].clone().multiplyScalar(1.4),R[6].clone().multiplyScalar(2),R[3].clone().lerp(R[4],.35).multiplyScalar(.95),R[3].clone().lerp(R[4],.5).multiplyScalar(.6)]},uFlock:{value:[0,1,2,3].map(()=>new x.Vector4(0,-500,0,1))},uCam:{value:new x.Vector3},uScript:{value:new x.Vector3},uScript2:{value:new x.Vector3(0,-900,0)},uSheet:{value:new x.Vector2(1e5,1e5)},uHidden:{value:0},uP0:{value:R[0]},uP1:{value:R[1]},uP2:{value:R[2]},uInk:{value:R[3]},uNight:{value:i0?1:0},uSnow:{value:y==="winter"?1:0}},$=_e(),wt=V.anchors.scribed,ot=[{x:wt.center.x,z:wt.center.z,r:wt.radius-3,t:.2},{x:-430+t.range(-40,40),z:150+t.range(-50,50),r:t.range(85,120),t:.36}],st=V.anchors.compassStand,xt=[[st.x,st.z,34],[st.x+.35*180,st.z+.937*180,30],[386,440,26],[0,0,0]],Nt=e=>Math.abs(e)<30?12:Math.abs(Math.abs(e)-300)<30||Math.abs(Math.abs(e)-600)<30?9:6,Lt=e=>{const r=e-M0;return Math.abs(Math.abs(r-300)-300)<30||Math.abs(r+300)<30?9:6},de=(e,r,o)=>{const l=Math.hypot(e,r);if(l>ce(e,r)-25-o||l<138+o||$.near(e,r).d<$.halfWidth(e)+8+o)return!1;for(const s of ot)if(Math.hypot(e-s.x,r-s.z)<s.r+4+o)return!1;for(const s of xt)if(s[2]>0&&Math.hypot(e-s[0],r-s[1])<s[2]+o)return!1;return!(Math.min(Math.abs(e-r),Math.abs(e+r))*.7071<9+o)},E={x0:-176,x1:-12,z0:226,z1:326,u0:.185,u1:.21},gt={...vt(),uP0:z.uP0,uP1:z.uP1,uP2:z.uP2,uInk:z.uInk,uCons:{value:R[4]},uRed:{value:R[6]},uU:z.uU,uTime:z.uTime,uRivK:{value:.17/2300},uPL:{value:S0},uRub:{value:1e4},uSnow:z.uSnow,uThrough:{value:0},uRiv:{value:$.pts.map(e=>new x.Vector2(e[0],e[1]))},uPark:{value:ot.map(e=>new x.Vector4(e.x,e.z,e.r,e.t))},uClear:{value:xt.map(e=>new x.Vector4(e[0],e[1],e[2],0))},uSheet:z.uSheet,uRubBox:{value:new x.Vector4(E.x0-6,E.x1+2,E.z0-6,E.z1+6)}},nt=new x.Mesh(new x.PlaneGeometry(11e3,11e3).rotateX(-Math.PI/2),new x.ShaderMaterial({fog:!0,uniforms:gt,polygonOffset:!0,polygonOffsetFactor:4,polygonOffsetUnits:8,vertexShader:`varying vec3 vP;
        #include <fog_pars_vertex>
        void main() { vP = position; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:qe}));nt.position.y=-.25,nt.frustumCulled=!1,nt.renderOrder=0,S.add(nt);const yt=new x.Vector3(-.72,l0?.2:.56,-.42).normalize(),Dt=new x.Vector3(0,1,0).cross(yt).normalize(),me=yt.clone().cross(Dt).normalize(),rt=new x.Mesh(new x.SphereGeometry(4600,32,20),new x.ShaderMaterial({side:x.BackSide,depthWrite:!1,depthTest:!1,fog:!1,uniforms:{uP0:z.uP0,uP1:z.uP1,uP2:{value:w0},uNightK:{value:i0?1:0},uInk:z.uInk,uCons:{value:R[4]},uWarm:{value:R[5].clone().multiplyScalar(.5)},uNorth:{value:yt},uN1:{value:Dt},uN2:{value:me},uTime:z.uTime,uBand:{value:l0?2.3:i0?6.5:4.6},uWarmK:{value:H==="golden"?.3:H==="dawn"?.1:0}},vertexShader:"varying vec3 vDir; void main() { vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:Ue}));rt.frustumCulled=!1,rt.renderOrder=-1,S.add(rt),await C.yield();const bt=[],kt=[],zt=[],X0=(e,r,o,l,a,s,m,h,p,v)=>{(e?bt:kt).push(r,o,l,a,s,m,h,p,v,t())},Gt=e=>P(E.u0,E.u1,n0((E.z1-e)/(E.z1-E.z0),0,1)),it=17;for(let e=-it;e<it;e++){(e&3)===0&&await C.yield();for(let r=-it-1;r<it;r++){const o=v0*e,l=o+v0,a=M0+v0*r,s=a+v0,m=(e===-1||e===0)&&a>200,h=o+Nt(o)+(e===0&&m?4:3),p=l-Nt(l)-(e===-1&&m?4:3),v=a+Lt(a)+3,n=s-Lt(s)-3,u=(h+p)/2,i=(v+n)/2;if(Math.hypot(u,i)>1060)continue;const f=r===3&&(e===-1||e===0),w=m?[2,2]:t.pick([[1,1],[2,1],[1,2],[2,2],[2,2],[3,2]]),c=f?[2,2]:w,g=Math.hypot(u,i)>620,b=g&&k<1?1:c[0],M=g&&k<1?1:c[1],W=(p-h)/b,L=(n-v)/M;for(let K=0;K<b;K++)for(let Q=0;Q<M;Q++){const J=(W-1.6)*t.range(.84,1),m0=(L-1.6)*t.range(.84,1),N=h+(K+.5)*W,Z=v+(Q+.5)*L,p0=Math.hypot(N,Z);if(!de(N,Z,Math.max(J,m0)*.62))continue;const g0=f&&Math.abs(N)<30;if(!m&&t()>.86*U&&!g0)continue;const A0=N>E.x0&&N<E.x1&&Z>E.z0&&Z<E.z1,k0=Math.abs(N)<200&&Z>130;let c0,f0,z0,W0,H0,_0;if(k0){if(c0=Math.max(.08,O0(Z)-.19)+Math.abs(N)*25e-5+t()*.012,W0=.022,H0=.026,_0=.03,f0=c0+.03+t()*.01,z0=f0+.03+t()*.01,Math.abs(N)<125){const j=f0-c0-.03,Q0=z0-f0-.03;W0=.014,H0=.018,_0=.022,f0=c0+.01+j*.5,z0=f0+.012+Q0*.5}}else{const j=1-t0(380,520,p0);c0=P(.12,.1,j)+P(4e-4,3e-4,j)*p0+t()*P(.04,.03,j),W0=.03,H0=P(.05,.035,j),_0=P(.06,.04,j),f0=c0+P(.05,.032,j)+t()*P(.05,.03,j),z0=f0+P(.06,.036,j)+t()*P(.06,.035,j)}const ee=K0(N,Z),ae=ee+(k0&&Math.abs(N)<64?.01:k0&&Math.abs(N)<125?.014:.02);if(c0<ae){const j=ae-c0;c0+=j,f0+=j,z0+=j}const $0=A0?Gt(Z):9;A0&&(c0=ee+.01+t()*.004,W0=H0=_0=.014,f0=c0+.016,z0=f0+.016);const qt=Math.abs(N)<125&&Z>120,pt=t.range(8,15),dt=t.range(30,60),oe=Math.max(m?t.range(88,135):P(90,220,n0(1-(p0-150)/380,0,1)*t.range(.45,1)),g0?104:0),Ut=t()<(m?.92:n0(1.05-p0/900,.06,.9))||g0,se=Ut&&(t()<(m?Z<430?.76:.6:n0(1.12-p0/470,0,.82))||g0);X0(qt,N,Z,J,m0,0,pt,c0,W0,$0);let Y0=pt,P0=J,C0=m0;if(Ut&&(P0=J*t.range(.76,.93),C0=m0*t.range(.76,.93),X0(qt,N,Z,P0,C0,pt,dt-pt,f0,H0,$0),Y0=dt),se&&(P0*=t.range(.62,.86),C0*=t.range(.62,.86),X0(qt,N,Z,P0,C0,dt,oe-dt,z0,_0,$0),Y0=oe),A0){const j=$0+.008+t()*.004,Q0=Math.min(Y0*2,250),Wt=Q0*t.range(.3,.5);X0(!0,N,Z,J,m0,0,Wt,j,.012,9),P0=J*t.range(.7,.85),C0=m0*t.range(.7,.85),X0(!0,N,Z,P0,C0,Wt,Q0-Wt,j+.01,.016,9),Y0=Q0}p0<520&&zt.length<400&&zt.push([N,Y0,Z,P0,C0,A0?$0+.07:se?z0+_0:Ut?f0+H0:c0+W0])}}}await C.yield();const Z0=bt.length/10,R0=Z0+kt.length/10,Ot=new Float32Array(R0*4),Kt=new Float32Array(R0*4),Xt=new Float32Array(R0*4);for(let e=0;e<R0;e++){const r=e<Z0?bt:kt,o=(e<Z0?e:e-Z0)*10;Ot.set([r[o],r[o+1],r[o+2],r[o+3]],e*4),Kt.set([r[o+4],r[o+5],r[o+6],r[o+7]],e*4),Xt.set([r[o+8],r[o+9],0,0],e*4)}const ve=new x.InstancedBufferAttribute(Ot,4),we=new x.InstancedBufferAttribute(Kt,4),xe=new x.InstancedBufferAttribute(Xt,4),Mt=(e,r)=>(e.setAttribute("iPos",ve),e.setAttribute("iH",we),e.setAttribute("iR",xe),e.instanceCount=r,e.boundingSphere=new x.Sphere(new x.Vector3,3e3),e);{const e=[],r=[],o=[],l=(m,h,p,v,n)=>{const u=e.length/3;e.push(...m,...h,...p,...v);for(let i=0;i<4;i++)r.push(...n);o.push(u,u+1,u+2,u,u+2,u+3)};l([-.5,0,.5],[.5,0,.5],[.5,1,.5],[-.5,1,.5],[0,0,1]),l([.5,0,.5],[.5,0,-.5],[.5,1,-.5],[.5,1,.5],[1,0,0]),l([.5,0,-.5],[-.5,0,-.5],[-.5,1,-.5],[.5,1,-.5],[0,0,-1]),l([-.5,0,-.5],[-.5,0,.5],[-.5,1,.5],[-.5,1,-.5],[-1,0,0]),l([-.5,1,.5],[.5,1,.5],[.5,1,-.5],[-.5,1,-.5],[0,1,0]);const a=new x.InstancedBufferGeometry;a.setAttribute("position",new x.Float32BufferAttribute(e,3)),a.setAttribute("normal",new x.Float32BufferAttribute(r,3)),a.setIndex(o);const s=new x.Mesh(Mt(a,R0),new x.ShaderMaterial({fog:!0,vertexShader:Be,fragmentShader:Fe,polygonOffset:!0,polygonOffsetFactor:2,polygonOffsetUnits:4,uniforms:{...vt(),uU:z.uU,uP0:z.uP0,uP1:z.uP1,uP2:z.uP2,uInk:z.uInk,uNight:z.uNight,uSnow:z.uSnow}}));s.frustumCulled=!1,s.renderOrder=1,S.add(s),s.material.uniforms.uSheet=z.uSheet,s.material.uniforms.uCons={value:R[4]},s.material.uniforms.uCream={value:R[5]}}const Zt=()=>{const e=[],r=[],o=[],l=[],a=[],s=(p,v,n,u)=>{const i=e.length/3;e.push(0,-1,0,1,-1,0,1,1,0,0,1,0);for(let f=0;f<4;f++)r.push(...p),o.push(...v),l.push(n,u);a.push(i,i+1,i+2,i,i+2,i+3)},m=[[0,0],[1,0],[1,1],[0,1]];for(let p=0;p<4;p++){const v=m[p],n=m[(p+1)%4];s([v[0],0,v[1]],[n[0],0,n[1]],0,p),s([v[0],0,v[1]],[v[0],1,v[1]],1,p),s([v[0],1,v[1]],[n[0],1,n[1]],2,p)}const h=new x.InstancedBufferGeometry;return h.setAttribute("position",new x.Float32BufferAttribute(e,3)),h.setAttribute("aC0",new x.Float32BufferAttribute(r,3)),h.setAttribute("aC1",new x.Float32BufferAttribute(o,3)),h.setAttribute("aE",new x.Float32BufferAttribute(l,2)),h.setIndex(a),h},jt=e=>new x.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,vertexShader:Ie,fragmentShader:le,depthFunc:e?x.GreaterDepth:x.LessEqualDepth,uniforms:{...vt(),uU:z.uU,uTime:z.uTime,uRes:z.uRes,uCol:z.uCol,uHidden:{value:e?1:0}}}),St=new x.Mesh(Mt(Zt(),R0),jt(!1));St.frustumCulled=!1,St.renderOrder=3;const At=new x.Mesh(Mt(Zt(),Z0),jt(!0));At.frustumCulled=!1,At.renderOrder=2,S.add(At,St),await C.yield();const d=N0(),I0=[1,0,0],B0=[0,1,0],Pt=[0,0,1],j0=e=>Math.max(.082+O0(e)*.1,y0(O0(e))+.008);{const e=Math.ceil(S0/4),r=new x.Vector3(0,1,0),o=new x.Vector3,l=new x.Vector3,a=new x.Vector3;let s=null,m=null;const h=V.anchors.tiers,p=v=>{let n=h[0].half;for(const u of h)v>=u.y0&&(n=u.half);return n};for(let v=0;v<=e;v++){const n=v/e,u=s0.pointAt(n);s0.tangentAt(n,o),l.copy(r).addScaledVector(o,-o.y).normalize(),a.crossVectors(o,l).normalize();const i=2.1+6.9*n0((n*S0-(S0-90))/90,0,1),f=[u.x-l.x*i,u.y-l.y*i,u.z-l.z*i],w=[u.x+l.x*2.7,u.y+l.y*2.7,u.z+l.z*2.7];if(s&&(d.set({kind:a0,rank:r0,col:e0,style:B,ws:.45}),d.seg(s[0],s[1],s[2],f[0],f[1],f[2],y0((v-1)/e),y0(n),9,-1),n>O-.06&&n<.875)){d.set({rank:q,col:V0,style:mt,ws:.6});const c=P(.3,.46,n0(((v-1)/e-O+.06)/(1-O),0,1)),g=P(.3,.46,n0((n-O+.06)/(1-O),0,1));d.seg(m[0],m[1],m[2],w[0],w[1],w[2],c,g+1e-4,9,-1)}if(v%2===0){d.set({rank:q,col:X,style:B,ws:.5});const c=n<O?.85:.6;d.seg(f[0]-a.x*c,f[1]-a.y*c,f[2]-a.z*c,f[0]+a.x*c,f[1]+a.y*c,f[2]+a.z*c,y0(n)+.004,y0(n)+.008,9,-1)}if(n>O+.01&&n<.86&&v%8===0){const c=Math.hypot(u.x,u.z),g=u.x/c,b=u.z/c,M=p(u.y-2)/(V.anchors.round?1:Math.max(Math.abs(g),Math.abs(b)));d.set({rank:D,col:tt,style:J0,ws:1}),d.seg(f[0],f[1],f[2],g*M,f[1],b*M,y0(n)+.01,y0(n)+.03,n+.05)}s=f,m=w}}const Ct=[],$t=(e,r,o,l,a,s)=>{const m=o*t.range(.2,.26),h=o-2*m;if(d.set({kind:a0,rank:a?q:D,col:e0,style:B,ws:1}),d.seg(e,0,r,e,h+(y==="winter"?m:0),r,l,l+.006,9,1),y==="winter"){for(const v of[-1,1]){const n=s?[0,v]:[v,0];d.seg(e,h*.7,r,e+n[0]*m*.9,h+m*.8,r+n[1]*m*.9,l+.006,l+.01,9,1)}return}d.set({rank:D,col:a?e0:X,style:y==="autumn"?J0:B});const p=a?14:6;d.circle([e,h+m,r],s?Pt:I0,B0,m,p,l+.006,l+.02,9,1,-Math.PI/2,Math.PI*1.5),a&&d.circle([e,h+m,r],s?I0:Pt,B0,m,p,l+.01,l+.024,9,1,-Math.PI/2,Math.PI*1.5),y==="autumn"&&a&&Ct.length<420&&Ct.push([e,h+m,r,l+.03])},Tt=(e,r,o)=>{const l=Math.hypot(e,r);if(l>ce(e,r)-30||l<136+o||$.near(e,r).d<$.halfWidth(e)+5+o)return!1;for(const a of ot)if(Math.hypot(e-a.x,r-a.z)<a.r+o)return!1;return!0};{for(let r=o0;r>222;r-=26){const o=Math.max(r-26,218);d.set({kind:a0,rank:q,col:X,style:B,ws:1});for(const l of[-5.8,-4.4,4.4,5.8])d.seg(l,.12,r,l,.12,o,j0(r),j0(o)+.001);d.set({rank:D,col:V0,style:mt,ws:1.3}),d.seg(0,.14,r,0,.14,o,j0(r)+.004,j0(o)+.005)}let e=0;for(let r=o0-14;r>226;r-=13){const o=j0(r)+.008;e++;for(const l of[-1,1])if(e%2){const a=l*12.9;d.set({kind:a0,rank:q,col:e0,style:B,ws:1}),d.seg(a,0,r,a,6.2,r,o,o+.005),d.seg(a,6.2,r,a-l*1.5,6.6,r,o+.005,o+.007),d.set({rank:D}),d.seg(a-l*1.5,6.6,r,a-l*1.5,6,r,o+.007,o+.008)}else $t(l*13.7,r,t.range(8,11.5),o+.004,!0,!1)}for(let r=o0-40;r>240;r-=t.range(34,60)){const o=t.chance(.5)?1:-1,l=o*14.6,a=t.range(8,14),s=Math.max(.09,O0(r)-.1),m=t.range(14,24);d.set({kind:a0,rank:D,col:tt,style:B,ws:1.2}),d.seg(l,a+2.4,r,l,a+2.4,r-m,s,s+.012,s+.09);for(const h of[r,r-m])d.seg(l,.2,h,l,a+3.6,h,s-.006,s,s+.09),d.seg(l,a+1.6,h+.8,l,a+3.2,h-.8,s+.012,s+.014,s+.09)}}await C.yield();{const e=U*(k<1?.6:1),r=(o,l,a,s,m,h,p)=>{const v=-s,n=a;for(let u=0;u<m;u+=p?20:23)for(const i of[-1,1]){const f=o+a*u+v*h*i,w=l+s*u+n*h*i;t()>e||!Tt(f,w,3)||Math.abs(f)<15||s0.nearestXZ(f,w).dist<14&&w<140||$t(f,w,t.range(7,p?11:13),K0(f,w)+.03+t()*.012,p,Math.abs(a)>.5)}};for(const o of[500,440,380,320,260])r(-250,o,1,0,500,7.4,!0);for(const o of[-600,-300,300,600])r(o,-900,0,1,1800,10.4,!1);for(const o of[M0,M0-300,M0+600])r(-900,o,1,0,1800,10.4,!1);r(-640,-640,.7071,.7071,1810,9.6,!1),r(-640,640,.7071,-.7071,1810,9.6,!1);for(const o of ot){const l=Math.round(o.r*o.r/520*e);for(let a=0;a<l;a++){const s=t()*Math.PI*2,m=Math.sqrt(t())*(o.r-9),h=o.x+Math.cos(s)*m,p=o.z+Math.sin(s)*m;if($.near(h,p).d<$.halfWidth(h)+9)continue;const v=t.range(3,6.5),n=o.t+.05+m*4e-4+t()*.03;if(d.set({kind:a0,rank:q,col:X,style:y==="autumn"?J0:B,ws:1.4}),d.circle([h,.3,p],I0,Pt,v,9,n,n+.02,9,0,s,s+Math.PI*2),y!=="winter"){const u=[];for(let i=0;i<5;i++){const f=t()*6.283,w=t()*v*.75;u.push([h+Math.cos(f)*w,.3,p+Math.sin(f)*w])}d.set({rank:D,style:B}),d.poly(u,n+.02,n+.03)}else d.set({rank:D,style:B}),d.seg(h-v*.5,.3,p,h+v*.5,.3,p,n+.02,n+.025),d.seg(h,.3,p-v*.5,h,.3,p+v*.5,n+.02,n+.025)}}d.set({kind:a0,rank:D,col:X,style:B,ws:1});for(let o=1500;o<$.total-1400;o+=3.6/e){const l=$.at(o);if(Math.hypot(l.x,l.z)>640||Math.abs(l.x)<16)continue;const a=$.halfWidth(l.x)+t.range(.5,3),s=t.chance(.5)?1:-1,m=l.x-l.tz*a*s,h=l.z+l.tx*a*s,p=.02+o*(.17/2300)+.02+t()*.01;d.seg(m,0,h,m+t.range(-.3,.3),t.range(1.6,3.4),h,p,p+.004,9,7)}for(const o of zt){if(t()>.55)continue;const l=t.range(4,13),a=o[0]+t.range(-.3,.3)*o[3],s=o[2]+t.range(-.3,.3)*o[4];d.set({rank:D,col:X}),d.seg(a,o[1],s,a,o[1]+l,s,o[5],o[5]+.01),l>8&&d.seg(a-1.2,o[1]+l*.7,s,a+1.2,o[1]+l*.7,s,o[5]+.01,o[5]+.012)}}await C.yield();const Yt=(e,r,o,l,a,s,m,h)=>{const p=-l,v=o,n=14,u=s/2;for(const i of[-1,1]){const f=e+p*u*i,w=r+v*u*i,c=[],g=[];for(let b=0;b<=n;b++){const M=b/n,W=(M-.5)*a,L=.3+m*4*M*(1-M);c.push([f+o*W,L,w+l*W]),g.push([f+o*W,L+1.2,w+l*W])}d.set({kind:a0,rank:D,col:tt,style:mt,ws:1.3}),d.circle([f,.3,w],[o,0,l],B0,a*.5,18,h-.03,h+.01,h+.09,0,Math.PI,0),d.set({rank:r0,col:e0,style:B,ws:1}),d.poly(c,h+.01,h+.065),d.set({rank:q,col:X}),d.poly(g,h+.02,h+.075),d.set({rank:D});for(let b=1;b<n;b++){const M=h+.012+.055*b/n;d.seg(c[b][0],.1,c[b][2],c[b][0],c[b][1],c[b][2],M,M+.006)}d.set({rank:q});for(const b of[.25,.5,.75]){const M=(b-.5)*a,W=f+o*M,L=w+l*M,K=h+.02+.05*b;d.seg(W-o*2,.15,L-l*2,W+p*5*i,.15,L+v*5*i,K,K+.005),d.seg(W+o*2,.15,L+l*2,W+p*5*i,.15,L+v*5*i,K,K+.005)}}d.set({rank:D,col:X});for(const i of[.25,.5,.75]){const f=(i-.5)*a,w=.3+m*4*i*(1-i),c=h+.02+.05*i;d.seg(e+o*f-p*u,w,r+l*f-v*u,e+o*f+p*u,w,r+l*f+v*u,c,c+.01)}};await C.yield(),Yt(0,178,0,-1,88,24,4.2,O0(222)-.035),[[-219,-40],[420,256],[900,330],[-545,-580]].forEach((e,r)=>{const o=$.at($.near(e[0],e[1]).s);Yt(o.x,o.z,-o.tz,o.tx,2*$.halfWidth(o.x)+t.range(34,66),14,t.range(5,8),[.3,.37,.53,.64][r]+t()*.02)});{const e=(n,u,i,f,w,c,g,b,M)=>{const W=Math.cos(f),L=Math.sin(f);for(const K of M)d.raw(n+K[0]*W-K[1]*L,i,u+K[0]*L+K[1]*W,n+K[2]*W-K[3]*L,i,u+K[2]*L+K[3]*W,f,c,g,w,b,0)},r=[[0,0,9,0],[10.5,0,19.5,0],[21,0,30,0],[31.5,0,40.5,0]],o=[0,1,2,3,4,5].map(n=>[n*16,0,n*16+14,0]),l=[[0,0,4.2,0]],a=[[0,0,4,2.6],[4,2.6,13,2.6],[13,2.6,17,0],[17,0,13,-2.6],[13,-2.6,4,-2.6],[4,-2.6,0,0],[17,0,-8,8.5],[17,0,-8,-8.5],[4,-2.6,4,2.6]],s=Math.PI/2;d.set({kind:et,rank:r0,col:e0,style:B,ws:1.5});for(let n=0;n<2;n++)e(-5.1,o0+20,.5,-s,o0+20-226,14,n*.5+t()*.2,.11,r),e(5.1,226,.5,s,o0+20-226,14,n*.5+t()*.2,.12,r);const m=(n,u,i,f)=>{const w=[];let c=null;for(let g=i;g<=f+1;g+=30){const b=n?g:u,M=n?u:g,W=g<=f&&Tt(b,M,8)&&!xt.some(L=>Math.hypot(b-L[0],M-L[1])<L[2]+6);W&&c===null&&(c=g),!W&&c!==null&&(g-30-c>=150&&w.push([c,g-30]),c=null)}return w},h=[];for(let n=-9;n<=9;n++)if(n!==0)for(const u of m(!1,v0*n,-620,620))h.push([!1,v0*n,u[0],u[1]]);for(let n=-10;n<=9;n++)for(const u of m(!0,M0+v0*n,-620,620))h.push([!0,M0+v0*n,u[0],u[1]]);const p=(n,u,i,f,w,c,g,b)=>{const M=n[3]-n[2],W=u>0?n[2]:n[3];n[0]?e(W,n[1]+i*u,f,u>0?0:Math.PI,M,w,c,g,b):e(n[1]-i*u,W,f,u>0?s:-s,M,w,c,g,b)};for(const n of h){const u=n[3]-n[2],i=(n[2]+n[3])/2,f=K0(n[0]?i:n[1],n[0]?n[1]:i)+.05,w=Math.round(u/75*U*k);d.set({kind:et,rank:q,col:X,style:B,ws:1.6});for(let c=0;c<w;c++)p(n,t.chance(.5)?1:-1,1.9,.35,t.range(7,13),t(),f,l);_==="tram"&&n[0]&&u>400&&t.chance(.6)&&(d.set({rank:r0,col:e0,ws:1.5}),p(n,1,.9,.5,14,t(),f+.02,r),p(n,-1,.9,.5,14,t(),f+.02,r))}if(_==="el"){for(let i=-700;i<700;i+=20){const f=K0(i,320)+.04,w=K0(i+(i<0?0:20),320)+.045;d.set({kind:a0,rank:r0,col:e0,style:B,ws:1});for(const c of[-1.3,1.3])d.seg(i,24,320+c,i+20,24,320+c,Math.min(f,w),Math.max(f,w)+.004);if(d.set({rank:D,col:X}),d.seg(i,22,320-1.3,i+20,22,320-1.3,f+.005,f+.012),d.seg(i,24,320-1.3,i+10,22,320-1.3,f+.008,f+.012),d.seg(i+10,22,320-1.3,i+20,24,320-1.3,f+.008,f+.012),!(Math.abs(i)<15||!Tt(i,320,4))){d.set({rank:q,col:e0});for(const c of[-1,1])d.seg(i,0,320+c*4.6,i,24,320+c*1.6,f-.01,f);d.set({rank:D,col:X}),d.seg(i,24*.45,320-3.25,i,24*.8,320+2.2,f,f+.004),d.seg(i,24*.45,320+3.25,i,24*.8,320-2.2,f,f+.004)}}d.set({kind:et,rank:r0,col:e0,style:B,ws:1.8});for(let i=0;i<3;i++)e(-700,320-1.3,24+.9,0,1400,19,i/3+t()*.1,.16,o),e(700,320+1.3,24+.9,Math.PI,1400,19,i/3+t()*.1,.16,o)}{const n=(u,i,f,w,c,g)=>d.raw(u,i,f,u,i,f+w/u,0,c/u,0,0,g,0);d.set({kind:Te,rank:r0,col:e0,style:B,ws:1.5});for(let u=0;u<2;u++)for(let i=0;i<4;i++)n(126.5,.5,u*Math.PI+.4+i*10.5/126.5,9,14,.27);d.set({rank:q,col:X,ws:1.6});for(let u=0;u<22;u++){const i=u%2===0;n(i?124.4:128.6,.35,u/22*Math.PI*2+t()*.2,4.2,(i?-1:1)*t.range(8,12),.25+t()*.04)}d.set({kind:et})}const v=(n,u,i,f)=>{const w=$.at($.near(n,u).s),c=$.at($.near(i,f).s);return[w.x,w.z,Math.atan2(c.z-w.z,c.x-w.x),Math.hypot(c.x-w.x,c.z-w.z)]};d.set({kind:et,rank:q,col:e0,style:B,ws:1.5});for(const n of[v(1250,368,640,302),v(600,296,300,220),v(-224,0,-232,-150),v(-420,-440,-790,-850)]){const u=Math.max(1,Math.round(n[3]/170));for(let i=0;i<u;i++)e(n[0],n[1],.25,n[2],n[3],t.range(4.5,6.5),(i+t()*.5)/u,.2+t()*.05,a)}}await C.yield();const lt=.7,Qt=350,d0=new x.Vector3,Et=O-.05,ct=new x.Vector3,ge=Y==="birds"?3:1;{d.set({kind:Ae,rank:q,col:e0,style:B,ws:.9});const e=(a,s,m,h)=>{const p=t()*6.283,v=a===3?t.range(.8,1.3):t.range(2,3.2),n=(a===3?.03:t.range(.13,.3))*(a%2?-1:1),u=t.range(6.5,10);for(const i of[-1,1])d.raw(s,m,p,i,v,n,u,1.8,0,0,h,a)},r=Math.round((Y==="birds"?100:70)*(k<1?.7:1));for(let a=0;a<ge;a++)for(let s=0;s<r;s++)e(a,t.range(105,180)+t.gauss()*8,t.gauss()*10,a===0?-1:.3+t()*.06);d.set({ws:.55});for(let a=0;a<60;a++)e(3,Math.sqrt(t())*17,t.gauss()*3.2,.4);if(Y==="airships")for(let a=0;a<3;a++){const s=[-250,260,-520][a]+t.range(-40,40),m=[200,330,440][a]+t.range(-20,20),h=52,p=11.5,v=t()*3200,n=t.range(7,10),u=[];for(let f=0;f<=18;f++){const w=f/18*Math.PI*2;u.push([Math.cos(w)*h*(1-.12*Math.cos(w)),m+Math.sin(w)*p,s])}d.set({kind:re,rank:r0,col:e0,style:B,ws:2.2});const i=(f,w)=>d.raw(f[0],f[1],f[2],w[0],w[1],w[2],-1,n,v,0,.05,3200);for(let f=0;f<18;f++)i(u[f],u[f+1]);d.set({rank:q}),i([-9,m-p-.5,s],[-7,m-p-4,s]),i([-7,m-p-4,s],[7,m-p-4,s]),i([7,m-p-4,s],[9,m-p-.5,s]),i([-h*.82,m+p*.5,s],[-h*1.18,m+p*1.3,s]),i([-h*1.18,m+p*1.3,s],[-h*1.1,m,s]),i([-h*.82,m-p*.5,s],[-h*1.18,m-p*1.3,s]),i([-h*1.18,m-p*1.3,s],[-h*1.1,m,s]),d.set({rank:D,style:J0}),i([-h*.95,m,s],[h*1.1,m,s])}const o=(a,s,m,h,p,v,n=5200,u=-1)=>{const i=h/2,f=h*t.range(.16,.26),w=Math.cos(v),c=Math.sin(v),g=t(),b=Math.PI*(3*(i+f)-Math.sqrt((3*i+f)*(i+3*f))),M=Math.max(7,Math.round(b/t.range(26,36)));if(!p&&n>1e3){const Q=10+240*(o0-m)/o0,J=72+f*Math.abs(c);Math.abs(s-Q)<J&&(s=Q+(s>=Q?J:-J))}const W=(Q,J)=>{const m0=Math.cos(Q)*(i+J),N=Math.sin(Q)*(f+J);return[a+m0,s+N*c,m+N*w]},L=t()*5e3,K=t.range(5,7);d.set({kind:re,rank:r0,col:e0,style:B,ws:2.2});for(let Q=0;Q<M;Q++){const J=Q/M*Math.PI*2,m0=(Q+1)/M*Math.PI*2,N=b/M*t.range(.32,.5),Z=(g+Q/M)%1;let p0=W(J,0);for(let g0=1;g0<=7;g0++){const A0=g0/7,k0=W(P(J,m0,A0),Math.sin(A0*Math.PI)*N);d.raw(p0[0],p0[1],p0[2],k0[0],k0[1],k0[2],(Z-(g0-1)*.014+1)%1,p?0:K,L,p?p===2?2:1:0,u,n),p0=k0}}},l=F==="few"?5:F==="many"?12:9;for(let a=0;a<l;a++){let s=t.range(-1500,900);Math.abs(s)<170&&(s=170*Math.sign(s||1)+s),o(0,t.range(250,500),s,t.range(150,400),!1,t.range(.35,.8))}for(let a=0;a<3;a++)o(0,t.range(640,760),[-150,250,480][a]+t.range(-40,40),t.range(160,260),!1,.3+.75*(t.range(.9,1.3)-.9));o(-200,t.range(118,146),300,t.range(120,150),!1,t.range(1,1.25),220),o(250,t.range(185,225),120,t.range(150,200),!1,t.range(.9,1.2),250);{const a=V.anchors.portalSeat.position,s=V.anchors.portalSeat.normal,m=new x.Vector3(s.z,0,-s.x).normalize().negate(),h=new x.Vector3().crossVectors(m,s).normalize(),p=(i,f,w)=>new x.Vector3().copy(a).addScaledVector(s,i).addScaledVector(m,f).addScaledVector(h,w),v=p(120,-125,5),n=p(175,130,70),u=p(100,75,-75);o(v.x,v.y,v.z,t.range(130,170),!1,t.range(.25,.5),250),o(n.x,n.y,n.z,t.range(170,220),!1,t.range(.3,.6),290),o(u.x,u.y,u.z,t.range(110,150),!1,t.range(.3,.5),230)}{const a=s0.pointAt(lt),s=s0.tangentAt(lt),m=Math.hypot(s.x,s.z)||1,h=Math.hypot(a.x,a.z)||1;d0.set(a.x+s.x/m*105-a.x/h*68,a.y+14,a.z+s.z/m*105-a.z/h*68);const p=V.anchors.portalSeat.position,v=(.76-lt)*Qt;o(0,0,0,t.range(108,124),!0,.7,5200,.5),o(p.x+3-d0.x-v,p.y-78-d0.y,p.z+58-d0.z,t.range(130,150),!0,t.range(.4,.55),5200,.5),o(p.x+73-d0.x-v,p.y-58-d0.y,p.z-17-d0.z,t.range(135,160),!0,t.range(.4,.55),5200,.5)}{const a=s0.pointAt(Et),s=s0.tangentAt(Et),m=Math.hypot(s.x,s.z)||1;ct.set(a.x+s.x/m*170-240+t.range(-30,30),a.y+122+t.range(-8,16),a.z+s.z/m*170),o(0,0,0,t.range(112,146),2,t.range(.75,.95))}d.set({kind:a0,rank:q,col:V0,style:mt,ws:1.6}),d.seg(0,0,0,0,430,0,-1,-.5,.11),d.set({rank:r0,style:B,ws:1.3}),d.seg(-11,250,0,11,250,0,-1,-.5,.11),d.seg(0,239,0,0,261,0,-1,-.5,.11),d.set({rank:q,col:tt,style:J0,ws:2}),d.circle([0,250,0],I0,B0,17,32,-1,-.5,.11),d.set({kind:Pe,rank:q,col:X,style:B,ws:3.4});for(let a=0;a<Math.round(460*k);a++){const s=t.range(E.z0,E.z1),m=Gt(s)+t()*.012;d.raw(t.range(E.x0,E.x1+6),t.range(1,90),s,t.range(60,380),t.range(30,200),t.range(-160,160),m,m+t.range(.1,.2),t()*6.283,t.range(.6,2),0,0)}if(y==="autumn"){d.set({kind:Ce,rank:q,col:X,style:B,ws:1.8});for(const a of Ct)for(let s=0;s<2;s++)d.raw(a[0]+t.range(-2,2),a[1]+t.range(-1,2),a[2]+t.range(-2,2),t.range(-5,5),-a[1],t.range(-5,5),t.range(4,9),t(),0,t.range(.8,2.2),a[3],0)}d.set({kind:ne,rank:q,col:_t,style:B,ws:1.35});for(let a=0;a<Math.round(500*k);a++)d.raw(t.range(0,90),t.range(0,90),t.range(0,90),t.range(20,60),t.range(-30,8),t.range(-40,40),t.range(7,13),t(),0,90,-1,0);if(F==="rain"){d.set({kind:ne,rank:D,col:X,style:B,ws:1.5});const a=300;for(let s=0;s<Math.round(900*k);s++)d.raw(t.range(0,a),t.range(0,a),t.range(0,a),a*.5,-a*.866,0,t.range(3.4,4.6),t(),t.range(6,11),a,-1,0)}if(h0){const a=N0();a.set({kind:a0,rank:q,col:V0,style:B,ws:1.6});for(let h=0;h<40;h++){const p=t.range(170,780),v=t.range(-600,500),n=t.range(22,60)/2,u=t.range(22,60)/2,i=t.range(60,280)*(1-Math.abs(v+50)/900);if(Math.hypot(p,v)<190)continue;const f=.6+t()*.09,w=[[-n,-u],[n,-u],[n,u],[-n,u]];for(let c=0;c<4;c++){const g=w[c],b=w[(c+1)%4];a.seg(p+g[0],.4,v+g[1],p+b[0],.4,v+b[1],f+c*.004,f+c*.004+.004,9,0,1),a.seg(p+g[0],.4,v+g[1],p+g[0],i,v+g[1],f+.016,f+.04,9,0,1),a.seg(p+g[0],i,v+g[1],p+b[0],i,v+b[1],f+.04,f+.046,9,0,1)}}const s=z.uCol.value.map((h,p)=>p===V0?R[6].clone().multiplyScalar(1.2):h),m=L0(a.d,{...z,uCol:{value:s}},5);S.add(m)}}const ye=L0(d.d,z,3);S.add(ye),await C.yield();const F0=new x.Group;F0.name="cage";const q0=new x.Group,Rt=new x.Group,ft=new x.Group;{const e=N0(),r=.062,o=.075,l=.085,a=-1.75,s=-1.52,m=(c,g,b)=>e.poly([...c,c[0]],g,b),h=2.29,p=1.12,v=-1.03;e.set({kind:a0,rank:q,col:_t,style:B,ws:o}),m([[-1.93,-1.55,-.4],[-1.93,-1.55,-2.5],[1.93,-1.55,-2.5],[1.93,-1.55,-.4]],.1,.125),e.set({rank:q,col:Ht,ws:.07});for(const c of[-1,1])e.seg(c*h,-1.55,a,c*h,p,a,.13,.155),e.seg(c*h,-1.55,-.4,c*h,p,-.4,.14,.16);e.seg(-h-.06,p,a,h+.06,p,a,.16,.18),e.set({rank:q,ws:o});for(const c of[-1,1])e.seg(c*h,p,a,c*h,p,-.4,.17,.185),e.seg(s+c*.12,p,-1.8,s+c*.04,p-.14,-1.8,.185,.19);e.set({rank:r0,col:X,ws:r*.8}),e.seg(-h,v,a,h,v,a,.195,.207),e.set({rank:D,col:tt,ws:l});for(let c=0;c<10;c++){const g=2*h/10,b=-h+c*g,M=.205+c*.001;c%2?e.seg(b,v,a,b+g,-1.55,a,M,M+.004):e.seg(b+g,v,a,b,-1.55,a,M+.002,M+.006)}e.set({rank:D,col:Ht,ws:o});for(const c of[-1,1])e.seg(c*h,p-.25,a,c*(h-.25),p,a,.215,.22),e.seg(c*h,v+.25,a,c*(h-.25),v,a,.217,.222);e.set({rank:r0,col:V0,ws:r*1.3}),e.seg(1.24,-1.5,-1.6,1.5,-.6,-1.72,.222,.228),e.set({rank:q,ws:o}),e.seg(1.43,-.6,-1.72,1.6,-.56,-1.72,.228,.23),e.set({col:X});const n=z.uCol.value.map((c,g)=>g===Ht?R[5].clone().multiplyScalar(.9):c),u=L0(e.d,{...z,uCol:{value:n}},6);F0.add(u);const i=N0();i.set({kind:a0,rank:r0,col:X,style:B,ws:r}),i.circle([0,0,0],[0,1,0],[0,0,1],.38,14,.112,.128),i.set({rank:q,ws:o}),i.circle([0,0,0],[0,1,0],[0,0,1],.09,6,.126,.13),i.set({rank:D,ws:l});for(let c=0;c<6;c++){const g=c/6*6.283;i.seg(0,Math.cos(g)*.09,Math.sin(g)*.09,0,Math.cos(g)*.38,Math.sin(g)*.38,.128,.132)}Rt.add(L0(i.d,z,6)),q0.position.set(0,-1.72,-2.9),q0.add(Rt);const f=N0();f.set({kind:a0,rank:q,col:X,style:B,ws:o});for(const c of[-1,1])f.seg(c*.12,0,0,c*.3,.2,.42,.124,.13);q0.add(L0(f.d,z,6));const w=N0();w.set({kind:a0,rank:r0,col:_t,style:B,ws:r*.8}),w.circle([0,0,0],I0,B0,.125,12,.186,.196),w.set({rank:q,ws:o}),w.circle([0,0,0],I0,B0,.085,8,.19,.198),w.set({rank:D,ws:l});for(let c=0;c<4;c++){const g=c/4*Math.PI;w.seg(-Math.cos(g)*.085,-Math.sin(g)*.085,0,Math.cos(g)*.085,Math.sin(g)*.085,0,.196,.2)}ft.add(L0(w.d,z,6)),ft.position.set(s,.98,-1.8),F0.add(q0,ft)}S.add(F0),await C.yield();const U0=new x.Mesh(new x.PlaneGeometry(E.x1-E.x0+30,170),new x.ShaderMaterial({transparent:!0,depthWrite:!1,side:x.DoubleSide,fog:!1,uniforms:{uC:{value:R[2].clone().lerp(R[3],.35)},uK:{value:0},uTime:z.uTime},vertexShader:"varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`uniform vec3 uC; uniform float uK, uTime; varying vec2 vUv;
        void main() {
          float e = smoothstep(0., 0.2, vUv.x) * smoothstep(1., 0.8, vUv.x) * smoothstep(1., 0.35, vUv.y) * smoothstep(0., 0.04, vUv.y);
          float st = 0.7 + 0.3 * sin(vUv.x * 90. + sin(vUv.y * 7. + uTime * 2.) * 2.);
          gl_FragColor = vec4(uC, 0.3 * e * st * uK);
        }`}));U0.position.set((E.x0+E.x1)/2-6,85,E.z1),U0.renderOrder=4,U0.frustumCulled=!1,S.add(U0);const be=he(.575),b0=new x.Vector3,Ve=new x.Vector3,It=new x.Vector2,ke=new x.Vector3,ht=new x.Vector3,Jt=new x.Quaternion,ut=V.anchors.portalSeat.position.clone(),Bt=V.anchors.portalSeat.normal.clone();let te=0,Ft=1;const ze=(e,r)=>{const o=n0(r,0,1)*u0,l=Math.min(u0-1,Math.floor(o)),a=x0[l],s=x0[l+1],m=o-l,h=P(a.x,s.x,m),p=P(a.z,s.z,m),v=s.x-a.x,n=s.z-a.z,u=22*(1-t0(.69,.75,r))/(Math.hypot(v,n)||1);return ke.set(v*u,P(a.y,s.y,m)-.95*Math.hypot(h,p),n*u).lerp(ut,.29*t0(.65,.765,r)+.56*t0(.755,.8,r)+.15*t0(.8,.85,r))};return{scene:S,path:s0,duration:40,title:i0?"The Drafted City: Night Shift":F==="rain"?"The Drafted City in Rain":y==="winter"?"The Drafted City in Winter":"The Drafted City",ride:"none",style:"none",variant:{hour:H,weather:F,season:y,spire:A,transit:_,airCast:Y,rare:h0},camera:{fov:68,near:.3,far:5200,lookAhead:25,sway:.2,bank:.5},pois:[{at:[0,250,0],from:0,to:.17,weight:.3},{at:[0,40,0],from:.3,to:O+.02,weight:.55},{at:ze,from:O-.03,to:1,weight:.7,fade:.07}],portal:{shape:"circle",radius:7,color:"#E63A2E",glow:.42,revealDistance:200,tilt:!0},post:{exposure:1,bloom:{strength:.14,radius:.15,threshold:1.05},grade:{saturation:1,contrast:1.02,tint:"#ffffff",shadowTint:"#000000",vignette:.3,grain:.035,aberration:0}},update(e,r,o,l){z.uU.value=l,z.uTime.value=r,C.renderer&&(C.renderer.getDrawingBufferSize(It),It.x>0&&z.uRes.value.copy(It)),ht.setFromMatrixPosition(o.matrixWorld),Jt.setFromRotationMatrix(o.matrixWorld),rt.position.copy(ht),z.uCam.value.copy(ht);const a=pe(l);V.setDrawFront(a),V.setProgress(fe(l)),V.update(e,r,o),C.through&&(te=1),gt.uThrough.value=te,Ft+=((C.through?1.5:1)-Ft)*Math.min(1,e*1.5),V.setGhost(Ft);const s=P(E.z1+24,E.z0-24,(l-E.u0+.006)/(E.u1-E.u0+.012));gt.uRub.value=l<E.u0-.006?1e4:l>E.u1+.006?-1e4:s,U0.position.z=s,U0.material.uniforms.uK.value=l<E.u0-.006||l>E.u1+.006?0:Math.sin(Math.PI*n0((l-E.u0+.006)/(E.u1-E.u0+.012),0,1));const m=1-t0(.05,.3,l),h=t0(.66,.82,l),p=t0(.47,.55,l);for(let w=0;w<3;w++){const c=z.uFlock.value[w],g=Math.max(a,14)+P(26,9,p)+P(15,10,p)*w,b=h*(w===0?1:w===1?.7:.8),M=w===1?-40:14;c.set(P(0,ut.x-Bt.x*M,b),P(g,ut.y-Bt.y*M-w*9,b),P(0,ut.z-Bt.z*M,b),P(1,w===0?.36:w===1?.7:.52,b)),w===0&&m>0&&(c.x=P(c.x,-95,m),c.z=P(c.z,o0-215-l*900,m),c.y=P(c.y,62,m),c.w=P(c.w,.55,m))}s0.pointAt(l,b0);const v=Math.hypot(b0.x,b0.z)||1,n=-b0.x/v,u=-b0.z/v,i=l-be;if(z.uFlock.value[3].set(b0.x+n*15+u*i*1500,b0.y-7-i*260,b0.z+u*15-n*i*1500,1),z.uScript.value.set(d0.x+(l-lt)*Qt,d0.y,d0.z),z.uScript2.value.set(ct.x+(l-Et)*1100,ct.y,ct.z),h0){const w=P(1700,150,t0(.5,.6,l))+1700*t0(.86,.96,l);z.uSheet.value.set(w,w+760)}F0.position.copy(ht),F0.quaternion.copy(Jt);const f=t0(O-.07,O-.02,l);Rt.rotation.x=-r*11*(1-f),q0.position.y=-1.72-f*1.4,q0.rotation.x=f*1.2,ft.rotation.z=r*(l>O-.02?5.5:1.2)},dispose(){V.dispose&&V.dispose()}}}};export{Ge as default};
