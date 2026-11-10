import*as r from"three";import{makePath as _o}from"../kit/core.js";import{makeSky as Eo,makeCloudField as Ho,skyDirection as Qo}from"../kit/sky.js";import*as z0 from"../kit/flora.js";import*as Se from"../kit/fauna.js";import*as vo from"../kit/fx.js";import{buildHero as Yo,HERO_GLSL as e0}from"../parts/ice-arcade.js";const po=["#FBF6F1","#F6C3CC","#FFD79A","#5E86C4","#243F7A","#BCE3F4","#C8202A"],f0=125,V0=440,E0=80,Zo=[[0,2.2,2.7],[20,2.2,2.6],[40,2.1,2.7],[56,4.2,3.1],[70,7.2,3.1],[84,9.4,2.8],[97,9.8,2.6],[109,7.6,2.5],[120,3.6,2.5],[132,-.8,2.4],[146,-2.6,2.3],[160,-2.9,2.3],[173,-1,2.8],[185,2,3.5],[198,2.9,3.5],[211,2.9,2.8],[224,2.7,2],[237,2.6,1.8],[247,4.4,2.1],[255,8.6,2.8],[262,13.8,3.3],[268,17.8,3.6],[275,19.6,3.8],[282,18.2,3.9],[289,15,3.9],[297,11.6,3.7],[306,9.9,3.5],[316,9.4,3.4],[327,9.5,3.7],[337,9.2,4.5],[354,4.6,3.3],[369,3.9,2.2],[385,3.6,1.9],[401,2.9,1.9],[416,1.8,1.9],[428,.8,1.9],[440,0,1.9]],Xo=[[0,10],[.08,12],[.13,10.5],[.17,9.5],[.22,8.5],[.26,8],[.3,7.2],[.34,6.6],[.38,7.2],[.43,7],[.47,6.2],[.52,4.6],[.55,6.5],[.63,13],[.66,9],[.7,6.6],[.74,5.6],[.78,2.2],[.8,-.8],[.83,-3.7],[.9,-3.7],[.94,-2.2],[1,-1.7]],mo=[.55,.63],Jo=[[0,-25],[.22,-63],[.3,-56],[.36,-47],[.4,-38],[.44,-27],[.47,-16],[.5,-4],[.53,6.5],[.56,22],[.6,36],[.64,39],[.68,39],[.72,39],[.75,42],[.78,47],[.8,52],[.84,54],[.88,50],[.92,46],[1,115]],wo=[[112,142],[209,233]],go=(a,m)=>{let M=0;for(;M<a.length-2&&m>a[M+1][0];)M++;const q=a[M],L=a[M+1];return q[1]+(L[1]-q[1])*Math.min(1,Math.max(0,(m-q[0])/(L[0]-q[0])))},La=(a,m,M)=>{let q=0,L=0;const C=a/6;for(let $=0;$<6;$++){const v=($+.5)*C,S=m*v*(.45+.55*v);q+=Math.sin(S),L+=Math.cos(S)}return[q*C*M,L*C*M]},Y=(a,m,M)=>{const q=Math.min(1,Math.max(0,(M-a)/(m-a)));return q*q*(3-2*q)},P0=(a,m,M)=>a+(m-a)*M,H0=(a,m,M)=>Math.min(M,Math.max(m,a)),Lt=a=>{const m=Math.sin(a*127.1+311.7)*43758.5453;return m-Math.floor(m)},dt=`
  float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash2(i), hash2(i + vec2(1.0, 0.0)), f.x), mix(hash2(i + vec2(0.0, 1.0)), hash2(i + vec2(1.0, 1.0)), f.x), f.y);
  }
`,G0=`
    #ifdef USE_FOG
      vFogDepth = -mv.z;
    #endif
`,$o=e0.common+e0.fogV+`
  attribute vec2 aUV;                         // arcade distance, lateral offset (right of travel positive)
  attribute vec2 aM;                          // pond metric (< 1 inside), wood shadow amount
  attribute vec2 aT;                          // the trail's direction (xz) beside this point
  attribute vec3 aOff;                        // zero on the ground; on the apron, the way to the ground point it stands for
  attribute vec2 aF;                          // the old trail the flight follows where it leaves the team: metres to its right, how much of it there is (0..1)
  varying vec2 vUV; varying vec2 vM; varying vec3 vW; varying vec3 vN; varying vec2 vT; varying vec2 vF;
  void main() {
    vUV = aUV; vM = aM; vN = normal; vT = aT; vF = aF;
    vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz + aOff;
    vec4 mv = viewMatrix * wp; gl_Position = projectionMatrix * mv;
`+G0+`  }
`,ta=e0.common+e0.fogF+dt+`
  uniform sampler2D uShadow;
  uniform vec3 uSnow, uHorizon, uZenith, uIceCol, uSnowSun;
  uniform vec4 uTrunk[8];                     // birch feet by the pond: x, z, height, radius (their white stems stand in the ice)
  uniform vec4 uFloor;                        // shadow span, -, shadow lateral span, bar contrast
  uniform vec4 uGnd;                          // arcade length, snow-snake strength, sparkle, far-shadow strength
  uniform vec4 uDir;                          // sun xz (unit), wind xz (unit)
  uniform vec4 uLook;                         // wood shadow strength, shafts of light on the lane, hoar glints, the sun's path on the ice
  varying vec2 vUV; varying vec2 vM; varying vec3 vW; varying vec3 vN; varying vec2 vT; varying vec2 vF;
  // wind-carved snow in wind space (x downwind, metres): long sastrugi, and between them ripples that climb slowly
  // and drop sharply on the lee side, so a low sun rakes them into rose crests and blue troughs
  float relief(vec2 p) {
    float w = vnoise(p * vec2(0.09, 0.4) + 3.7);                            // where the wind has worked the snow
    float drift = vnoise(p * vec2(0.11, 0.42));                             // long soft drifts lying down the wind
    float tongue = vnoise(p * vec2(0.3, 0.95) + 7.0);                        // shorter tongues on them
    // ripples across the wind: the phase rises steadily downwind and only wanders, so the crests are lines that never close into loops
    float saw = fract(p.x * 0.55 + 0.45 * vnoise(p * vec2(0.07, 0.42) + 11.0));
    float rip = saw * saw * (1.0 - smoothstep(0.74, 1.0, saw));
    return 1.05 * drift + 0.5 * tongue + 0.42 * rip * (0.25 + 0.75 * w * w) + 0.17 * vnoise(p * vec2(1.3, 3.6) + 9.0);
  }
  // the packed track: a shallow trench between two soft berms
  float trk(float l) { float al = abs(l); return -0.07 * (1.0 - smoothstep(1.1, 1.55, al)) + 0.1 * smoothstep(1.3, 1.75, al) * (1.0 - smoothstep(1.75, 2.7, al)); }
  float cellEdge(vec2 x) {
    vec2 n = floor(x), f = fract(x); float d1 = 8.0, d2 = 8.0;
    for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j)); vec2 o = vec2(hash2(n + g), hash2(n + g + 17.3));
      vec2 r = g + o - f; float d = dot(r, r);
      if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; }
    }
    return sqrt(d2) - sqrt(d1);
  }
  // storm litter: one fallen twig with a side shoot in each cell. Returns (distance to it in metres, its hash, place along it)
  vec3 twig(vec2 p, float sc, float seed) {
    vec2 g = p / sc, id = floor(g), f = fract(g);
    float h = hash2(id + seed), ang = hash2(id + seed + 1.7) * 6.283;
    vec2 dir = vec2(cos(ang), sin(ang));
    vec2 q = f - 0.5 - (vec2(hash2(id + seed + 2.9), hash2(id + seed + 4.1)) - 0.5) * 0.26;
    float hl = 0.17 + 0.16 * hash2(id + seed + 5.3);
    float t = clamp(dot(q, dir), -hl, hl);
    q -= vec2(-dir.y, dir.x) * ((hash2(id + seed + 7.7) - 0.5) * 0.5 * hl * (t * t / (hl * hl) - 0.4));      // no fallen twig is straight
    float d = length(q - dir * t);
    float a2 = ang + (h > 0.5 ? 0.7 : -0.7); vec2 d2 = vec2(cos(a2), sin(a2));
    vec2 q2 = q - dir * (hl * (0.6 * hash2(id + seed + 6.1) - 0.2));
    float t2 = clamp(dot(q2, d2), 0.0, hl * 0.8);
    d = min(d, length(q2 - d2 * t2));
    return vec3(d * sc, h, (t + t2) * sc);
  }
  void main() {
    float a = vUV.x, l = vUV.y;
    vec3 Vv = cameraPosition - vW; float dist = length(Vv); vec3 V = Vv / max(dist, 1e-3);
    vec2 p = vW.xz;
    vec2 pw = fwidth(p); float fwp = max(pw.x, pw.y) + 1e-5;
    float sgn = uSkew > 0.0 ? 1.0 : -1.0, ls = l * sgn;                    // ls > 0: the sun's side of the trail
    float al = abs(l);
    float track = 1.0 - smoothstep(1.2, 1.7, al);
    float nearK = 1.0 - smoothstep(30.0, 95.0, dist);
    float em = vM.x + 0.07 * (vnoise(p * 0.35) - 0.5);
    float ice = 1.0 - smoothstep(0.86, 0.93, em);
    // relief and its slope, in wind space
    vec2 wq = vec2(dot(p, uDir.zw), dot(p, vec2(-uDir.w, uDir.z)));
    float e = 0.07;
    float h0 = relief(wq), hx = relief(wq + vec2(e, 0.0)), hz = relief(wq + vec2(0.0, e));
    float amp = 0.25 * (1.0 - 0.8 * track) * nearK * (1.0 - 0.45 * smoothstep(0.22, 0.6, V.y));      // seen from above the relief is a quiet grain, not a pattern
    vec2 gw = vec2(hx - h0, hz - h0) / e * amp;
    vec2 grad = gw.x * uDir.zw + gw.y * vec2(-uDir.w, uDir.z);
    // the track: trench walls, lumpy berms, two runner grooves
    vec2 Lw = vec2(-vT.y, vT.x);
    float lump = 0.55 + 0.9 * vnoise(vec2(a * 0.8, l * 0.5 + 7.0));
    float trkK = (1.0 - smoothstep(60.0, 140.0, dist)) * (1.0 - ice);
    float gd = abs(al - 0.26);
    float gw0 = 0.045 + 0.35 * fwp;                                          // the grooves never get thinner than a pixel or two
    float grooveM = (1.0 - smoothstep(gw0, gw0 + 0.035, gd)) * track * min(1.0, 0.045 / gw0) * (1.0 - smoothstep(0.04, 0.09, fwp));   // a groove counts for its share of the pixel, and is gone when far finer than one
    float dGr = -1.1 * smoothstep(gw0 - 0.01, gw0 + 0.01, gd) * (1.0 - smoothstep(gw0 + 0.01, gw0 + 0.045, gd)) * sign(al - 0.26) * sign(l) * (1.0 - smoothstep(12.0, 30.0, dist));
    grad += Lw * ((trk(l + 0.03) - trk(l - 0.03)) / 0.06 * lump * 1.6 - dGr) * trkK;
    // the old trail under the flight where it leaves the team: yesterday's run, half drifted in: a soft trench between low
    // berms and two runner lines, leading on into the wood (its direction is taken from the field itself)
    float oK = vF.y * (1.0 - ice) * (1.0 - smoothstep(50.0, 110.0, dist));
    float oGroove = 0.0, oTrack = 0.0;
    if (oK > 0.01) {
      float ol = vF.x, oal = abs(ol);
      vec2 px = dFdx(p), py = dFdy(p); float ox = dFdx(ol), oy = dFdy(ol), det = px.x * py.y - px.y * py.x;
      vec2 oDir = vec2(ox * py.y - oy * px.y, oy * px.x - ox * py.x) * (det < 0.0 ? -1.0 : 1.0);      // the way "ol" grows over the ground
      float odl = length(oDir); oDir = odl > 1e-9 ? oDir / odl : vec2(1.0, 0.0);
      float olump = 0.6 + 0.8 * vnoise(p * 0.7 + 3.0);
      grad += oDir * ((trk(ol * 1.15 + 0.03) - trk(ol * 1.15 - 0.03)) / 0.06 * olump * 1.5) * oK;
      float ogd = abs(oal - 0.26), ogw = 0.05 + 0.35 * fwp;
      oGroove = (1.0 - smoothstep(ogw, ogw + 0.04, ogd)) * (1.0 - smoothstep(1.0, 1.3, oal)) * min(1.0, 0.05 / ogw) * (1.0 - smoothstep(0.05, 0.11, fwp)) * oK * (0.45 + 0.55 * vnoise(p * 1.3));
      oTrack = (1.0 - smoothstep(1.0, 1.5, oal)) * oK;
    }
    vec3 Ng = normalize(vN + vec3(0.0, 1e-4, 0.0));
    vec3 N = normalize(Ng + vec3(-grad.x, 0.0, -grad.y));
    // paw prints in the dogs' lanes: shaded dimples near, a darker lane further off
    vec2 pc = vec2(a / 0.43 + floor(l / 0.19) * 0.37, l / 0.19); vec2 pi = floor(pc), pf = fract(pc) - 0.5;
    vec2 po = (vec2(hash2(pi + 3.3), hash2(pi + 8.1)) - 0.5) * 0.4;
    float lane = step(abs(pi.y + 0.5), 3.1) * step(0.42, hash2(pi));
    float pawFar = smoothstep(0.2, 0.6, fwidth(a) / 0.43);
    vec2 pm = (pf - po) * vec2(0.43, 0.19);
    float paw = (1.0 - smoothstep(0.035, 0.06, length(pm))) * lane;
    float pawRim = (1.0 - smoothstep(0.035, 0.06, length(pm + vec2(0.0, 0.03 * sgn)))) * lane;
    paw = mix(paw, 0.16 * (1.0 - smoothstep(0.45, 0.7, al)), pawFar) * track * (1.0 - ice);
    float pawLit = clamp(pawRim - paw, 0.0, 1.0) * (1.0 - pawFar) * track * (1.0 - ice);
    // shadows: baked trunk bars inside the band beside the trail, long streaks of the wood's shadow beyond it
    float inBand = 1.0 - smoothstep(uFloor.z * 0.5 - 8.0, uFloor.z * 0.5 - 1.5, al);
    float bars = texture2D(uShadow, vec2((a + uA0) / uFloor.x, clamp(l / uFloor.z + 0.5, 0.02, 0.98))).r * inBand;
    // the wood's shadow, in the sun's own frame (sq.x across the light, sq.y toward it, metres). A low sun throws every
    // crown as a soft lobe five metres wide and forty long, and every stem as a thin line that runs from its foot to
    // its lobe: long blue bars raking the snow, with the sun between them
    vec2 sq = vec2(dot(p, vec2(-uDir.y, uDir.x)), dot(p, uDir.xy));
    float lobe = smoothstep(0.47, 0.64, vnoise(vec2(sq.x * 0.2, sq.y * 0.026)) * 0.62 + vnoise(vec2(sq.x * 0.47 + 7.0, sq.y * 0.05 + 3.0)) * 0.38);
    float lnx = sq.x / 2.7, li = floor(lnx);
    float sph = -sq.y / 66.0 + hash1(li * 7.3), seg = floor(sph), sy = fract(sph);       // sy: 0 at the foot, growing down the light
    float lh = hash2(vec2(li, seg)), lw = 0.11 + 0.1 * hash1(li + seg * 3.1);
    float lx = (fract(lnx) - 0.2 - 0.6 * lh) * 2.7 + 0.5 * (vnoise(vec2(li * 5.0, sq.y * 0.06)) - 0.5);
    float soft = 0.04 + 0.55 * sy + 1.2 * fwp;
    float line = (1.0 - smoothstep(lw, lw + soft, abs(lx))) * step(0.3, lh) * step(sy, 0.55 + 0.4 * lh) * smoothstep(0.0, 0.02, sy) * (1.0 - 0.45 * sy) * min(1.0, (2.0 * lw + soft) / (2.0 * lw + soft + 2.0 * fwp));
    float streak = max(lobe * 0.9, line);
    float wood = smoothstep(0.0, 0.5, vM.y) * (0.82 + 0.18 * vM.y) * (1.0 - 0.35 * inBand * smoothstep(-78.0, -48.0, a) * (1.0 - smoothstep(4.0, 9.0, al))) * uGnd.w;      // in the open wood the long blue shadows bar the trail itself
    float age = (uFront - a) / 12.0 - 1.2;
    float inArc = smoothstep(-6.0, 8.0, a) * (1.0 - smoothstep(uGnd.x - 4.0, uGnd.x + 10.0, a));
    float canopy = mix(0.56, 0.16, smoothstep(0.0, 1.5, age)) * (0.55 + 0.45 * vnoise(p * 0.23 + 3.0)) * (1.0 - smoothstep(5.0, 13.0, al)) * inArc;
    // between the ribs the sun comes through in shafts: bands of light that lie down the light across the lane
    float shaft = smoothstep(0.5, 0.68, vnoise(vec2(sq.x * 0.4 + 31.0, sq.y * 0.014))) * (0.6 + 0.4 * vnoise(vec2(sq.x * 1.7, sq.y * 0.09 + 5.0)));
    canopy *= 1.0 - uLook.y * shaft;
    float face = smoothstep(-0.06, 0.1, dot(Ng, uSun));
    float bermSh = smoothstep(0.3, 0.6, ls) * (1.0 - smoothstep(1.35, 1.7, ls)) * (0.55 + 0.45 * lump) * trkK;   // the sun-side berm's shadow lies in the trench
    float lit = litAt(a - l * uSkew, 0.0) * (1.0 - min(0.86, uFloor.w * 1.4 * bars)) * (1.0 - canopy) * (1.0 - uLook.x * wood * streak) * face;
    lit *= (1.0 - 0.6 * bermSh) * (1.0 - 0.9 * grooveM * trkK) * (1.0 - 0.7 * paw) * (1.0 - 0.8 * oGroove);
    float grain = vnoise(p * 9.0) - 0.5;
    vec3 alb = uSnow * (1.0 - 0.07 * track - 0.05 * oTrack - 0.3 * grooveM - 0.25 * oGroove - 0.14 * paw + 0.06 * grain * nearK);
    float ndl = dot(N, uSun);
    // crests and drift lips that face the low sun take it full; their lee sides fall into the sky's blue
    float sunT = 0.1 + 0.58 * smoothstep(-0.12, 0.4, ndl) + 0.34 * smoothstep(0.3, 0.7, ndl) + 0.3 * pawLit;
    float rl = clamp(0.5 + (N.x + N.z) * 1.6, 0.0, 1.0);
    vec3 fill = mix(uDeep * 1.6, uSkyCol, 0.25 + 0.3 * h0 + 0.45 * rl) * (1.0 - 0.3 * grooveM - 0.25 * paw);
    // snow is white: the sun on it is the sun with most of its colour taken out, the shade is the sky's blue
    fill = mix(fill, dot(fill, vec3(0.3, 0.5, 0.2)) * vec3(0.84, 0.95, 1.22), 0.3) * 1.07;      // snow shade is a soft blue, never ink
    vec3 col = alb * (uSnowSun * lit * sunT + fill * (0.8 - 0.42 * lit));
    // sparkle: facets that flash as the eye moves; only near, so it never shimmers far off
    vec2 sc = floor(p * 26.0);
    float fl = hash2(sc + floor(dot(V, vec3(31.0, 17.0, 23.0)) + hash2(sc) * 6.0));
    float backS = max(dot(-V, uSun), 0.0); backS *= backS;
    col += (uSnowSun * lit * (2.2 + 3.0 * backS) + uSkyCol * 0.5) * step(0.992 - 0.004 * backS, fl) * (1.0 - smoothstep(6.0, 26.0, dist)) * (0.4 + 0.6 * hash2(sc + 3.0)) * uGnd.z;
    // hoar: single big crystals close to the lens, each a point of fire that turns on and off as the eye passes
    vec2 hc = p * 7.0, hi = floor(hc), hf = fract(hc) - 0.5;
    float hh = hash2(hi + 41.0);
    float hOn = step(0.93, hh) * step(0.45, hash2(hi + floor(dot(V, vec3(13.0, 7.0, 11.0)) * 0.8 + hh * 9.0)));
    vec2 ho = (vec2(hash2(hi + 5.0), hash2(hi + 9.0)) - 0.5) * 0.5;
    float hr = length(hf - ho);
    float star = (1.0 - smoothstep(0.03, 0.09 + 0.6 * fwp, hr)) + 0.5 * (1.0 - smoothstep(0.0, 0.02 + 0.3 * fwp, min(abs(hf.x - ho.x), abs(hf.y - ho.y)))) * (1.0 - smoothstep(0.1, 0.28, hr));
    col += (uSnowSun * lit * (3.0 + 5.0 * backS) + uSkyCol * 0.7) * hOn * star * (1.0 - smoothstep(4.0, 15.0, dist)) * (1.0 - ice) * (1.0 - 0.7 * track) * uLook.z;
    // storm litter: glazed twigs and branch ends brought down by the ice, thick under the birches, thin on the packed track
    float litK = (0.3 + 0.7 * smoothstep(-20.0, 10.0, a) * (1.0 - smoothstep(3.0, 26.0, al))) * (1.0 - 0.75 * track) * (1.0 - smoothstep(16.0, 34.0, dist));
    if (litK > 0.01 && ice < 0.5) {
      vec3 t1 = twig(p, 1.25, 0.0), t2 = twig(p + 3.3, 0.5, 9.0);
      float w1 = 0.01, w2 = 0.006, aa = fwp * 0.7;
      float c1 = (1.0 - smoothstep(max(w1, aa) - aa * 0.5, max(w1, aa) + aa * 0.5, t1.x)) * min(1.0, w1 / aa + 0.25) * step(t1.y, 0.55 * litK);
      float c2 = (1.0 - smoothstep(max(w2, aa) - aa * 0.5, max(w2, aa) + aa * 0.5, t2.x)) * min(1.0, w2 / aa + 0.2) * step(t2.y, 0.7 * litK);
      float g1 = (1.0 - smoothstep(w1, w1 + 0.03, t1.x)) * step(t1.y, 0.55 * litK), g2 = (1.0 - smoothstep(w2, w2 + 0.018, t2.x)) * step(t2.y, 0.7 * litK);
      float bead = 0.5 + 0.5 * sin((t1.z + t2.z) * 47.0 + dot(V, vec3(37.0, 11.0, 29.0)) + t1.y * 30.0); bead *= bead; bead *= bead; bead *= bead; bead *= bead;
      float cT = max(c1, c2), gT = max(g1, g2 * 0.7);
      col *= 1.0 - 0.22 * gT;                                                   // the hollow each one melted and its shadow
      col = mix(col, vec3(0.085, 0.04, 0.036) * (uSkyCol * 1.2 + uSunCol * lit * 0.6), cT * 0.9);
      col += (uSunCol * lit * 2.6 + uSkyCol * 0.5) * bead * cT * (1.0 - smoothstep(0.02, 0.06, fwp));
    }
    // the pond
    if (ice > 0.002) {
      float drift = vnoise(wq * vec2(0.08, 0.3)) * 0.6 + vnoise(wq * vec2(0.27, 1.0) + 4.0) * 0.4;
      float snowPatch = smoothstep(0.5, 0.66, drift);
      vec2 pk = p + 5.0 * vec2(vnoise(p * 0.11), vnoise(p * 0.11 + 31.7)) + 0.6 * vec2(vnoise(p * 0.9 + 5.0), vnoise(p * 0.9 + 11.0));
      float c1 = cellEdge(pk * 0.16), c2 = cellEdge(pk * 0.61 + 3.1), c3 = cellEdge((pk + V.xz / max(V.y, 0.15) * 0.1) * 0.16 + 0.011);
      float w1 = 0.006, f1 = fwp * 0.16, w2 = 0.008, f2 = fwp * 0.61;
      float crack = (1.0 - smoothstep(w1, w1 + 1.5 * f1, c1)) * min(1.0, w1 / f1 + 0.06) * (0.5 + 0.5 * vnoise(p * 0.7))
                  + 0.5 * (1.0 - smoothstep(w2, w2 + 1.5 * f2, c2)) * min(1.0, w2 / f2) * (1.0 - smoothstep(8.0, 26.0, dist)) * step(0.45, vnoise(p * 0.23 + 9.0))
                  + 0.25 * (1.0 - smoothstep(0.02, 0.02 + 1.5 * f1, c3)) * min(1.0, 0.02 / f1);
      vec2 bq = fract(p * 7.0) - 0.5;
      float bub = step(0.97, hash2(floor(p * 7.0))) * (1.0 - smoothstep(0.08, 0.2, length(bq))) * (1.0 - smoothstep(3.0, 11.0, dist)) * 0.5;
      vec3 R = reflect(-V, vec3(0.0, 1.0, 0.0));
      float fres = 0.06 + 0.56 * pow(1.0 - clamp(V.y, 0.0, 1.0), 5.0);
      vec3 skyR = mix(uHorizon, uZenith, pow(clamp(R.y, 0.0, 1.0), 0.45));
      float az = atan(R.z, R.x + 1e-5);
      float trees = 1.0 - smoothstep(0.03, 0.1, R.y - 0.035 * vnoise(vec2(az * 26.0, 1.0)));
      skyR = mix(skyR, uDeep * 0.8 + uSkyCol * 0.12, trees * 0.6);
      // the birches on the shore stand in the ice as pale wavering stems
      float rl = length(R.xz), stemR = 0.0;
      if (rl > 1e-3) {
        vec2 rn = R.xz / rl; float tanE = R.y / rl;
        vec2 pr = p + 0.25 * vec2(vnoise(p * 1.7 + 3.0), vnoise(p * 1.7 + 19.0)) - 0.125;
        for (int i = 0; i < 8; i++) {
          vec4 tk = uTrunk[i]; vec2 tv = tk.xy - pr; float along = dot(tv, rn), off = abs(tv.x * rn.y - tv.y * rn.x);
          float wd = tk.w + 0.012 * along + 1.2 * fwp;
          stemR = max(stemR, step(0.0, along) * (1.0 - smoothstep(wd * 0.5, wd, off)) * (1.0 - smoothstep(tk.z * 0.6, tk.z, along * tanE)) * min(1.0, tk.w / (0.6 * fwp + 1e-4)));
        }
      }
      skyR = mix(skyR, uSnow * (uSnowSun * 0.55 + uSkyCol * 0.6), stemR * 0.85);
      // a low sun ahead lays its path down the ice: a column of glare toward it, broken by frost and blown snow
      float sAz = rl > 1e-3 ? max(dot(R.xz / rl, uDir.xy), 0.0) : 0.0;
      float sPath = pow(sAz, 260.0) * exp(-abs(R.y - uSun.y) * 5.0) + 0.35 * pow(sAz, 40.0) * exp(-abs(R.y - uSun.y) * 9.0);
      skyR += uSunCol * sPath * uLook.w * 2.0 * (0.45 + 0.55 * vnoise(p * vec2(2.3, 2.3) + 1.0)) * (1.0 - 0.6 * trees);
      float frost = smoothstep(0.3, 0.8, vnoise(wq * vec2(0.05, 0.21) + 7.0) * 0.6 + vnoise(p * 0.8 + 2.0) * 0.4);
      vec3 body = uIceCol * (0.55 + 0.6 * h0) + uSkyCol * 0.085 * frost;
      vec3 iceCol = mix(body, skyR, fres);
      iceCol += (uSkyCol * 0.9 + uSunCol * 0.3) * vec3(0.8, 0.9, 1.0) * (min(crack, 1.0) * 0.55 + bub) * (1.0 - 0.6 * fres);
      iceCol += uSkyCol * (1.0 - smoothstep(0.02, 0.06, gd)) * track * 0.6 * nearK;               // the runners' scratches on the ice
      float snake = smoothstep(0.6, 0.92, vnoise(vec2(wq.x * 0.07 - uTime * 0.9, wq.y * 0.5 + 1.3 * sin(wq.x * 0.11 + uTime * 0.3)))) * (0.4 + 0.6 * vnoise(wq * 0.5 - vec2(uTime * 2.0, 0.0)));
      vec3 snowLit = uSnow * (uSnowSun * sunT * face + uSkyCol * 0.35);
      iceCol = mix(iceCol, snowLit, clamp(snake * uGnd.y, 0.0, 0.7));
      col = mix(col, mix(iceCol, col, snowPatch), ice);
    }
    gl_FragColor = vec4(mix(col, fogCol(), fogAmt()), 1.0);
  }
`,ea=e0.common+e0.fogV+`
  attribute vec4 aI0;                         // x, y, z, yaw
  attribute vec4 aI1;                         // width, height, kind + seed, arcade distance
  attribute float aCard;
  varying vec2 vUv; varying vec4 vS; varying vec3 vW; varying vec2 vDim;
  void main() {
    vec3 P = position; float y = P.y;
    P.x *= aI1.x; P.y *= aI1.y; P.z *= aI1.x;
    float seed = fract(aI1.z);
    float sway = uWind * 0.05 * aI1.y * y * y;
    P.x += sin(uTime * 1.6 + seed * 40.0 + aI0.x * 0.3) * sway; P.z += cos(uTime * 1.27 + seed * 23.0 + aI0.z * 0.3) * sway;
    float c = cos(aI0.w), s = sin(aI0.w);
    vec3 Q = vec3(P.x * c + P.z * s, P.y, -P.x * s + P.z * c) + aI0.xyz;
    vec4 wp = modelMatrix * vec4(Q, 1.0); vW = wp.xyz;
    vUv = uv; vS = vec4(floor(aI1.z), fract(seed + aCard * 0.137), aI1.w, y * aI1.y); vDim = aI1.xy;
    vec4 mv = viewMatrix * wp; gl_Position = projectionMatrix * mv;
`+G0+`  }
`,oa=e0.common+e0.fogF+`
  uniform vec3 uIceTint;
  uniform float uGlint;
  varying vec2 vUv; varying vec4 vS; varying vec3 vW; varying vec2 vDim;
  void main() {
    float x = vUv.x * 2.0 - 1.0, y = vUv.y, kind = vS.x, seed = vS.y;
    float fw = fwidth(x) + 1e-4;
    float yM = y * vDim.y, fwy = fwidth(yM) + 1e-5;                    // metres up the stem, metres a pixel
    vec3 Vv = cameraPosition - vW; float dist = length(Vv); vec3 V = Vv / max(dist, 1e-3);
    float spread = kind < 0.5 ? 1.1 : 0.9, wid = kind < 0.5 ? 0.02 : (kind < 1.5 ? 0.014 : 0.012);
    float mB = 1.25 * vDim.y / max(vDim.x, 0.1);                       // a twig 32 degrees off the leader, in card units
    float cov = 0.0, sa = 0.0, tip = 0.0, ph = 0.0;
    for (int i = 0; i < 7; i++) {
      float fi = float(i);
      float h1 = hash1(seed * 31.0 + fi * 7.1), h2 = hash1(seed * 17.0 + fi * 3.3), h3 = hash1(seed * 5.0 + fi * 1.7);
      float cx, w, on, cs = 1.0;
      if (kind > 1.5) {
        if (i == 0) {
          cx = 0.045 * sin(y * 5.0 + seed * 40.0) * y; w = wid * (1.4 - 1.1 * y); on = 1.0;
        } else {
          float y0 = 0.1 + 0.115 * fi + 0.07 * h1, yy = y - y0;
          float m = mB * (0.65 + 0.7 * h2), sg = h3 > 0.5 ? 1.0 : -1.0;
          float lk = min((0.2 + 0.34 * h2) * (1.0 - 0.45 * y0), 0.9 / m);
          cx = 0.045 * sin(y0 * 5.0 + seed * 40.0) * y0 + sg * m * yy * (1.0 - 0.3 * yy / lk);
          w = wid * 0.62 * (1.0 - 0.6 * yy / lk); on = step(0.0, yy) * step(yy, lk);
          float tn = m * vDim.x * 0.5 / max(vDim.y, 0.1); cs = inversesqrt(1.0 + tn * tn);
        }
      } else {
        float len = 0.4 + 0.6 * h3;
        cx = (h1 - 0.5) * 0.2 + (h2 - 0.5) * spread * y + (h1 - 0.5) * 0.9 * y * y;
        w = wid * (1.15 - 0.75 * y / len); on = step(y, len);
      }
      float hw = max(w, 0.7 * fw);
      float c = clamp((hw - abs(x - cx) * cs) / fw + 0.5, 0.0, 1.0) * on * (w / hw);
      if (c > cov) { cov = c; sa = (x - cx) * cs / hw; tip = w / hw; ph = h1 * 41.0 + fi * 2.39; }
    }
    if (kind > 1.5) cov *= 1.0 - 0.6 * smoothstep(25.0, 70.0, dist);       // far saplings thin to a haze the wood shows through
    if (cov < 0.02) discard;
    float lit = litAt(vS.z, vS.w);
    float back = max(dot(-V, uSun), 0.0);
    vec3 core = kind < 0.5 ? vec3(0.46, 0.33, 0.17) : (kind < 1.5 ? vec3(0.13, 0.055, 0.05) : vec3(0.15, 0.058, 0.042));
    vec3 amb = mix(uDeep * 1.4, uSkyCol, 0.75);
    float vw = dot(V, vec3(23.0, 9.0, 17.0));
    float bead = 0.5 + 0.5 * sin(yM * 105.0 + ph + vw + uTime * 0.6); bead *= bead; bead *= bead;
    float unres = smoothstep(0.5, 1.5, fwy * 105.0);
    float cell = exp2(ceil(log2(max(fwy * 2.0, 0.04))));                   // single glints: one cell of stem in a dozen, no two stems alike
    float gl = step(0.92, hash2(vec2(floor(yM / cell) + ph * 3.7, floor(vw * 0.35 + ph))));
    bead = mix(bead, (kind > 1.5 ? 0.03 : 0.12) + 2.4 * gl, unres);
    float edge = smoothstep(0.2, 0.9, abs(sa)) * tip;
    vec3 col = core * (amb + uSunCol * lit * 0.75) * (1.0 - 0.4 * edge) + uIceTint * uSkyCol * 0.6 * edge;
    col *= 0.45 + 0.55 * smoothstep(0.0, 0.25, vS.w);                                            // dark where it stands in the snow
    col += uSunCol * lit * uGlint * (0.16 * edge + bead * (0.55 + 2.0 * back * back) * (0.35 + 0.65 * edge)) * (1.0 - smoothstep(20.0, 60.0, dist) * 0.8);
    float fa = fogAmt();
    gl_FragColor = vec4(mix(col * cov, fogCol() * cov, fa), cov);
  }
`,yo=e0.common+e0.fogV+`
  attribute float aK;                         // 0 bark, 1 berry card
  attribute vec4 aI0;                         // x, y, z, yaw
  attribute vec4 aI1;                         // scale, seed, arcade distance, -
  uniform vec4 uMir;                          // 1 = this is the tree's image in the pond ice, the ice's height, -, -
  varying vec2 vUv; varying vec3 vN; varying vec3 vW; varying vec4 vS; varying vec3 vSunV;
  void main() {
    vec3 P = position * aI1.x;
    float sw = uWind * 0.012 * position.y;
    P.x += sin(uTime * 1.1 + aI1.y * 30.0 + position.y * 0.7) * sw; P.z += cos(uTime * 0.93 + aI1.y * 17.0 + position.y * 0.5) * sw;
    float c = cos(aI0.w), s = sin(aI0.w);
    vec3 Q = vec3(P.x * c + P.z * s, P.y, -P.x * s + P.z * c) + aI0.xyz;
    if (uMir.x > 0.5) Q.y = 2.0 * uMir.y - Q.y;
    vN = vec3(normal.x * c + normal.z * s, normal.y, -normal.x * s + normal.z * c);
    vec4 wp = modelMatrix * vec4(Q, 1.0); vW = wp.xyz;
    vec4 mv = viewMatrix * wp;
    if (aK > 0.5) mv.xy += (uv * 2.0 - 1.0) * 0.14 * aI1.x;
    vUv = uv; vS = vec4(aK, fract(dot(position, vec3(12.9898, 78.233, 37.719)) * 43.7 + aI1.y), aI1.z, P.y);
    vSunV = (viewMatrix * vec4(uSun, 0.0)).xyz;
    gl_Position = projectionMatrix * mv;
`+G0+`  }
`,xo=e0.common+e0.fogF+`
  uniform vec3 uRed;
  uniform vec4 uMir, uPondC;                  // uPondC: the pond's centre (x, z) and the trail's direction there
  varying vec2 vUv; varying vec3 vN; varying vec3 vW; varying vec4 vS; varying vec3 vSunV;
  void main() {
    float lit = litAt(vS.z, vS.w);
    float mirA = 1.0;
    if (uMir.x > 0.5) {                       // the image lies under the ice: shown only where the ray to it crosses the pond, by the ice's own mirror strength
      float tI = (cameraPosition.y - uMir.y) / max(cameraPosition.y - vW.y, 1e-3);
      vec2 ip = cameraPosition.xz + (vW.xz - cameraPosition.xz) * tI + 0.07 * sin(vW.y * 9.0 + vW.x * 3.0 + uTime * 0.7);
      vec2 rel = ip - uPondC.xy;
      float e = length(vec2(dot(rel, uPondC.zw) / 31.0, (rel.x * uPondC.w - rel.y * uPondC.z) / 46.0));
      float vy = (cameraPosition.y - uMir.y) / max(length(cameraPosition - vec3(ip.x, uMir.y, ip.y)), 1e-3);
      mirA = (1.0 - smoothstep(0.7, 0.84, e)) * clamp(0.14 + 1.15 * pow(1.0 - clamp(vy, 0.0, 1.0), 4.5), 0.0, 0.82) * step(vW.y, uMir.y) * step(uMir.y, cameraPosition.y);
      if (mirA < 0.01) discard;
    }
    vec3 col;
    if (vS.x > 0.5) {
      vec2 q = vUv * 2.0 - 1.0; float cid = vS.y * 91.0;
      float fw = fwidth(q.x) + 1e-4;
      float far = smoothstep(0.1, 0.3, fw);
      float inside = 0.0; vec2 nn = vec2(0.0);
      for (int i = 0; i < 8; i++) {
        float fi = float(i);
        vec2 c = (vec2(hash1(cid + fi * 1.3), hash1(cid * 1.7 + fi * 2.9)) - 0.5) * 1.35;
        vec2 d = (q - c) / 0.27;
        if (dot(d, d) < 1.0) { inside = 1.0; nn = d; }
      }
      float r = length(q);
      if (inside < 0.5 && (far < 0.5 || r > 0.45)) discard;
      if (inside < 0.5) nn = q / 0.45;
      vec3 n = vec3(nn, sqrt(max(1.0 - dot(nn, nn), 0.0)));
      float ndl = dot(n, vSunV);
      vec3 hh = normalize(vSunV + vec3(0.0, 0.0, 1.0001));
      float sp = pow(max(dot(n, hh), 0.0), 50.0);
      col = uRed * (uSunCol * lit * clamp(ndl * 0.6 + 0.45, 0.0, 1.0) * 0.55 + uSkyCol * 0.5 + 0.12);
      col += uSunCol * lit * sp * 1.6 + uSkyCol * 0.35 * pow(1.0 - n.z, 3.0);
      float thru = max(-vSunV.z, 0.0);                                         // against the light every bead is a small red lamp with a bright edge
      col += uRed * uSunCol * lit * thru * thru * (0.3 + 0.9 * pow(1.0 - n.z, 2.0));
    } else {
      vec3 N = normalize(vN + vec3(0.0, 1e-4, 0.0));
      vec3 V = normalize(cameraPosition - vW + vec3(0.0, 1e-4, 0.0));
      float ndl = dot(N, uSun), wrap = clamp(ndl * 0.8 + 0.2, 0.0, 1.0);
      vec3 alb = vec3(0.11, 0.085, 0.08) * (0.8 + 0.4 * hash2(floor(vec2(vW.y * 9.0, vW.x * 5.0 + vW.z * 5.0))));
      vec3 fill = mix(uDeep * 1.5, uSkyCol, 0.35 + 0.65 * (N.y * 0.5 + 0.5));
      col = alb * (uSunCol * lit * wrap * 0.6 + fill);
      vec3 Hh = normalize(uSun + V + vec3(0.0, 1e-4, 0.0));
      float fres = 1.0 - max(dot(N, V), 0.0); fres = fres * fres * fres;
      float ndh = max(dot(N, Hh), 0.0);
      col += uSunCol * lit * (pow(ndh, 160.0) * 5.0 + fres * 1.6 * max(dot(-V, uSun), 0.0)) + uSkyCol * fres * 1.1;
    }
    gl_FragColor = vec4(mix(col, fogCol(), fogAmt()) * mirA, mirA);
  }
`,aa=e0.common+e0.fogV+`
  attribute vec4 aRig; attribute vec3 aKnee; attribute vec3 color;
  attribute vec4 aI0;                         // x, y, z, yaw
  attribute vec4 aI1;                         // gait phase, pitch, run (0 standing .. 1), arcade distance
  attribute vec3 aTint;
  uniform vec4 uGait, uAmp, uBob;             // leg phases | hind swing, fore swing, knee fold, body rock | bob, spine flex, tail sway, hip height
  uniform float uScale;
  varying vec3 vN, vW, vObj, vCol, vTint, vL;
  vec2 rotYZ(vec2 q, float t) { float c = cos(t), s = sin(t); return vec2(q.x * c + q.y * s, -q.x * s + q.y * c); }
  void main() {
    float ph = aI1.x, run = aI1.z, part = aRig.x, w = aRig.y;
    vec3 P = position, Nn = normal;
    if (part > 0.5 && part < 4.5) {
      float lp = part < 1.5 ? uGait.x : (part < 2.5 ? uGait.y : (part < 3.5 ? uGait.z : uGait.w));
      float a = ph + lp;
      float sw = mix(uAmp.y, uAmp.x, step(part, 2.5)) * sin(a) * run;
      float fold = uAmp.z * max(0.0, sin(a + 1.9)) * run;
      vec2 hip = aRig.zw;
      vec2 k2 = hip + rotYZ(aKnee.xy - hip, sw);
      vec2 q = hip + rotYZ(P.yz - hip, sw);
      if (w > 0.5) q = k2 + rotYZ(q - k2, -fold);
      Nn.yz = rotYZ(Nn.yz, sw - step(0.5, w) * fold);
      P.yz = q;
    } else if (part < 0.5) {
      P.y += uBob.y * sin(ph + 0.6) * (w * w - 0.35) * run;
    } else if (part < 5.5) {
      P.x += w * w * uBob.z * (sin(ph + w * 2.5 + aTint.r * 40.0) * run + 0.7 * sin(uTime * 4.0 + aTint.g * 30.0) * (1.0 - run));
      P.y += w * w * uBob.z * 0.6 * sin(ph * 2.0 + w * 3.0) * run;
    } else if (part < 6.5) {
      float nod = -uAmp.w * 0.9 * sin(ph + 0.3) * run + 0.04 * sin(uTime * 1.3 + aTint.b * 20.0);
      P.yz = aRig.zw + rotYZ(P.yz - aRig.zw, nod); Nn.yz = rotYZ(Nn.yz, nod);
    } else {
      float sgn = part < 7.5 ? -1.0 : 1.0, xs = aRig.z;
      float span = abs(P.x) - xs, fold = 1.0 - run;
      float th = (uAmp.x * sin(ph - w * 0.9) + uAmp.y) * (0.35 + 0.65 * w) * run;
      float sp = span * mix(1.0, 0.16, fold);
      P.x = sgn * (xs + sp * cos(th));
      P.y += sp * sin(th) - fold * w * 0.2;
      P.z -= fold * w * 0.3;
    }
    float pitch = uAmp.w * sin(ph + 0.3) * run * step(part, 6.5) + aI1.y;
    P.yz = vec2(uBob.w, 0.0) + rotYZ(vec2(P.y - uBob.w, P.z), pitch); Nn.yz = rotYZ(Nn.yz, pitch);
    P.y += uBob.x * (0.5 - 0.5 * cos(ph + 0.9)) * run;
    float c = cos(aI0.w), s = sin(aI0.w);
    vec3 Q = vec3(P.x * c + P.z * s, P.y, -P.x * s + P.z * c) * uScale + aI0.xyz;
    vN = vec3(Nn.x * c + Nn.z * s, Nn.y, -Nn.x * s + Nn.z * c);
    vec4 wp = modelMatrix * vec4(Q, 1.0); vW = wp.xyz; vObj = position; vCol = color; vTint = aTint;
    vL = vec3(aKnee.z, aI1.w, P.y * uScale);
    vec4 mv = viewMatrix * wp; gl_Position = projectionMatrix * mv;
`+G0+`  }
`,na=e0.common+e0.fogF+dt+`
  uniform vec3 uDark;
  uniform vec4 uFur;                          // fur noise, rim, contact shade height, self light
  uniform float uWeave;                       // canvas folds and weave on parts whose coat is 0.4 (the sled's load)
  uniform vec4 uCoat;                         // fur relief on the normal, shade pulled toward slate, sun rim, bars across the flight feathers (per metre; the owl)
  uniform vec3 uBounce;                       // light thrown up by sunlit snow (the look with the sun ahead: backs in shade keep their colour)
  varying vec3 vN, vW, vObj, vCol, vTint, vL;
  void main() {
    vec3 N = normalize(vN + vec3(0.0, 1e-4, 0.0));
    vec3 V = normalize(cameraPosition - vW + vec3(0.0, 1e-4, 0.0));
    if (uCoat.x > 0.0) {                      // guard hairs: the light breaks up across the coat instead of sliding over a smooth tube
      vec3 fq = vObj * vec3(46.0, 30.0, 17.0);
      N = normalize(N + uCoat.x * 0.6 * (vec3(vnoise(fq.xy + fq.z), vnoise(fq.yz + 7.0 + fq.x), vnoise(fq.zx + 3.0 + fq.y)) - 0.5));
    }
    float coat = vL.x;
    vec3 alb = coat <= 1.0 ? mix(vCol, vTint, clamp(coat, 0.0, 1.0)) : mix(vTint, uDark, clamp(coat - 1.0, 0.0, 1.0));
    alb *= 1.0 + uFur.x * (vnoise(vObj.xz * vec2(70.0, 11.0) + vObj.y * 45.0) - 0.5);
    float cloth = uWeave * (1.0 - smoothstep(0.03, 0.12, abs(coat - 0.4)));
    alb *= 1.0 + cloth * (0.5 * (vnoise(vec2(vObj.z * 13.0 + vObj.x * 5.0, vObj.y * 16.0 - vObj.x * 9.0)) - 0.5) + 0.07 * sin(vObj.x * 430.0) * sin(vObj.z * 430.0) * (1.0 - smoothstep(1.2, 3.2, length(cameraPosition - vW))));
    if (uCoat.w > 0.0) {                      // the owl: dark bars across the flight feathers and the tail, rings round each eye
      float wing = smoothstep(0.1, 0.17, abs(vObj.x)), tailK = 1.0 - smoothstep(-0.26, -0.18, vObj.z);
      float bz = vObj.z * uCoat.w + abs(vObj.x) * 3.0;
      float bar = 1.0 - smoothstep(0.2, 0.34, abs(fract(bz) - 0.5));
      alb *= 1.0 - 0.6 * bar * max(wing, tailK);
      alb *= 1.0 + 0.35 * wing * (1.0 - bar) * smoothstep(0.5, 0.75, abs(vObj.x));              // pale between the bars toward the tips
      float faceK = step(0.3, vObj.z) * (1.0 - wing);
      float ring = 0.5 + 0.5 * sin(length(vec2(abs(vObj.x) - 0.048, vObj.y - 0.022)) * 330.0);
      alb *= 1.0 - 0.45 * faceK * ring * smoothstep(0.036, 0.05, length(vec2(abs(vObj.x) - 0.048, vObj.y - 0.022)));
    }
    float lit = litAt(vL.y, vL.z);
    float ndl = dot(N, uSun), wrap = clamp(ndl * 0.75 + 0.25, 0.0, 1.0);
    vec3 fill = mix(uDeep * 1.5, uSkyCol, 0.35 + 0.65 * (N.y * 0.5 + 0.5));
    fill = mix(fill, vec3(0.94, 1.0, 1.1) * dot(fill, vec3(0.3, 0.5, 0.2)), uCoat.y);                 // pale fur in shade is slate, not cobalt
    vec3 col = alb * (uSunCol * lit * wrap * 0.5 + fill + uFur.w + uBounce * (0.75 - 0.25 * N.y));
    float fres = pow(1.0 - max(dot(N, V), 0.0), 2.5);
    col += (uSunCol * lit * max(ndl + 0.5, 0.0) * (0.3 + 0.55 * uCoat.z) + uSkyCol * 0.22 * (1.0 - 0.65 * uCoat.y)) * fres * uFur.y * (0.35 + 0.65 * alb);
    col *= 0.55 + 0.45 * smoothstep(0.0, uFur.z, vL.z);
    gl_FragColor = vec4(mix(col, fogCol(), fogAmt()), 1.0);
  }
`,sa=e0.common+e0.fogV+`
  attribute vec4 aP;                          // centre, size
  attribute vec4 aC;                          // alpha, lit, seed, -
  varying vec2 vUv; varying vec3 vC; varying vec2 vSun; varying float vBack;
  void main() {
    vSun = (viewMatrix * vec4(uSun, 0.0)).xy;
    vec4 wp0 = modelMatrix * vec4(aP.xyz, 1.0);
    vBack = max(dot(normalize(wp0.xyz - cameraPosition + vec3(0.0, 1e-4, 0.0)), uSun), 0.0);
    vec4 mv = viewMatrix * wp0;
    float d = max(-mv.z, 0.05);
    float size = min(aP.w, d * 0.9);
    mv.xy += position.xy * size;
    vUv = position.xy * 2.0; vC = vec3(aC.x * smoothstep(0.7, 2.4, d), aC.y, aC.z);
    gl_Position = projectionMatrix * mv;
`+G0+`  }
`,ra=e0.common+e0.fogF+dt+`
  uniform vec3 uSnow;
  varying vec2 vUv; varying vec3 vC; varying vec2 vSun; varying float vBack;
  void main() {
    float r = length(vUv);
    float soft = exp(-r * r * 3.0) * (1.0 - smoothstep(0.75, 1.0, r));
    float n = vnoise(vUv * 2.6 + vC.z * 17.0 + uTime * 0.35);
    float a = soft * (0.5 + 0.7 * n) * vC.x;
    if (a < 0.004) discard;
    // lit from the side like everything else: a rose-gold sun flank, a blue shaded flank, so powder shows against snow
    float sl = length(vSun);
    float sideK = clamp(dot(vUv, vSun / max(sl, 1e-3)) * 1.3 + 0.2 * vUv.y, -1.0, 1.0) * smoothstep(0.05, 0.3, sl);
    vec3 col = uSnow * (uSunCol * vC.y * (0.12 + 0.9 * smoothstep(-0.5, 0.8, sideK) + 0.25 * n) + mix(uDeep * 1.7, uSkyCol, 0.62) * (1.15 - 0.4 * sideK));
    // against the light a plume is lit through: its thin rim burns, its thick middle stays blue
    float bk = vBack * vBack; bk *= bk;
    col += uSnow * uSunCol * vC.y * bk * (0.25 + 1.3 * smoothstep(0.25, 0.95, r) + 0.5 * n);
    gl_FragColor = vec4(mix(col, fogCol(), fogAmt()) * a, a);
  }
`,ia=e0.common+e0.fogV+`
  attribute vec3 aA;                          // metres ahead of the eye, lateral, layer (0 low .. 1 top)
  uniform vec4 uWake;                         // the sled's track distance, powder amount, light, -
  varying vec3 vA; varying float vD; varying vec3 vW;
  void main() {
    vA = aA; vD = uWake.x + aA.x;
    vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz;
    vec4 mv = viewMatrix * wp; gl_Position = projectionMatrix * mv;
`+G0+`  }
`,la=e0.common+e0.fogF+dt+`
  uniform vec3 uSnow;
  uniform vec4 uWake;
  varying vec3 vA; varying float vD; varying vec3 vW;
  float kick(float b) { return smoothstep(-0.5, 0.2, b) * exp(-max(b, 0.0) / 2.6); }
  void main() {
    float a = vA.x, l = vA.y, ly = vA.z;
    // thrown at each pair of dogs and by the runners, spreading as it hangs
    float src = 0.62 * (kick(3.5 - a) + kick(5.8 - a) + kick(8.1 - a)) + 0.5 * kick(2.4 - a);
    float wd = 0.42 + 0.075 * (8.6 - a) + 0.1 * ly;
    float dens = min(src, 1.25) * exp(-l * l / (wd * wd));
    vec2 q = vec2(vD * 0.95 + ly * 2.3, l * 1.5 + uTime * 0.12 + ly * 1.9);
    float n = vnoise(q) * 0.58 + vnoise(q * 2.4 + vec2(uTime * 0.5, 5.0)) * 0.42;
    float sgn = uSkew > 0.0 ? 1.0 : -1.0;
    float n2 = vnoise(q + vec2(-0.12, 0.4 * sgn)) * 0.58 + vnoise((q + vec2(-0.12, 0.4 * sgn)) * 2.4 + vec2(uTime * 0.5, 5.0)) * 0.42;
    float body = smoothstep(0.32 + 0.22 * ly, 0.8 + 0.1 * ly, n + 0.4 * dens);
    float dist = length(cameraPosition - vW);
    float al = dens * body * (0.62 - 0.26 * ly) * uWake.y * smoothstep(1.0, 3.0, dist);
    if (al < 0.004) discard;
    float side = clamp(0.5 + (n - n2) * 2.6, 0.0, 1.0);                       // thinner toward the sun: that flank takes the light
    vec3 col = uSnow * (uSunCol * uWake.z * (0.16 + 0.8 * side) + mix(uDeep * 1.7, uSkyCol, 0.6) * (1.15 - 0.45 * side));
    float bk = max(dot(normalize(vW - cameraPosition + vec3(0.0, 1e-4, 0.0)), uSun), 0.0); bk *= bk; bk *= bk;
    col += uSnow * uSunCol * uWake.z * bk * (0.2 + 0.8 * (1.0 - body) + 0.45 * ly);       // blown powder against the light: the thin top of it burns
    gl_FragColor = vec4(mix(col, fogCol(), fogAmt()) * al, al);
  }
`,ca=e0.common+e0.fogV+`
  attribute vec2 aK;                          // 0 core / 1 bough, seed
  attribute vec4 aI0;                         // x, y, z, yaw
  attribute vec4 aI1;                         // scale, seed, arcade distance, -
  varying vec2 vUv; varying vec3 vN, vW; varying vec4 vS;
  void main() {
    vec3 P = position * aI1.x;
    float tipw = uv.y * uv.y * step(0.5, aK.x);
    P.y += sin(uTime * 1.5 + aK.y * 40.0 + aI1.y * 9.0) * 0.045 * tipw * uWind * aI1.x;
    float sw = uWind * 0.0016 * P.y * P.y;
    P.x += sin(uTime * 0.8 + aI1.y * 30.0) * sw; P.z += cos(uTime * 0.67 + aI1.y * 17.0) * sw;
    float c = cos(aI0.w), s = sin(aI0.w);
    vec3 Q = vec3(P.x * c + P.z * s, P.y, -P.x * s + P.z * c) + aI0.xyz;
    vN = vec3(normal.x * c + normal.z * s, normal.y, -normal.x * s + normal.z * c);
    vec4 wp = modelMatrix * vec4(Q, 1.0); vW = wp.xyz;
    vUv = uv; vS = vec4(aK.x, aK.y + aI1.y, aI1.z, P.y);
    vec4 mv = viewMatrix * wp; gl_Position = projectionMatrix * mv;
`+G0+`  }
`,fa=e0.common+e0.fogF+dt+`
  uniform vec3 uIceTint;
  uniform float uGlint;
  varying vec2 vUv; varying vec3 vN, vW; varying vec4 vS;
  void main() {
    float u = vUv.x, v = vUv.y, au = abs(u), seed = vS.y;
    float shade = 0.5, tipK = 0.0, lock = 0.5;
    if (vS.x > 0.5) {
      // branchlets leave the rib and sweep toward the tip, each ending in its own point: a ragged, shaggy outline
      float k1 = v * 6.5 - au * 1.7 + seed * 9.0, k2 = v * 23.0 - au * 5.5 + seed * 31.0;
      float t1 = abs(fract(k1) * 2.0 - 1.0), t2 = abs(fract(k2) * 2.0 - 1.0);
      float envl = (1.0 - 0.72 * v * v) * smoothstep(-0.02, 0.1, v);
      float w = envl * (0.4 + 0.4 * t1 + 0.2 * t2);
      if (au > w) discard;
      float e = au / max(w, 0.02);
      shade = (0.42 + 0.58 * smoothstep(0.0, 0.85, e)) * (0.5 + 0.5 * smoothstep(0.0, 0.5, v));
      tipK = smoothstep(0.5, 1.0, e) * (0.4 + 0.6 * v);
      lock = hash1(floor(k1) * 3.1 + seed * 7.0);
    }
    vec3 Vv = cameraPosition - vW; float dist = length(Vv); vec3 V = Vv / max(dist, 1e-3);
    vec3 N = normalize(vN + vec3(0.0, 1e-4, 0.0));
    float lit = litAt(vS.z, vS.w);
    float ndl = dot(N, uSun), wrap = clamp(ndl * 0.7 + 0.3, 0.0, 1.0);
    vec3 alb = vec3(0.036, 0.074, 0.062) * (0.7 + 0.6 * lock) * shade;
    vec3 fill = mix(uDeep * 1.5, uSkyCol, 0.4 + 0.6 * (N.y * 0.5 + 0.5));
    vec3 col = alb * (uSunCol * lit * wrap * (vS.x > 0.5 ? 1.1 : 0.25) + fill * 1.25);
    // the glaze: a cold sheen on every bough end, beads of fire along the tips on the sun side
    float sunSide = smoothstep(-0.15, 0.45, ndl);
    vec2 gc = floor(vec2(u * 8.0, v * 26.0));
    float sp = step(0.9, hash2(gc + seed * 17.0 + floor(dot(V, vec3(19.0, 7.0, 13.0)) * 4.0 + hash2(gc) * 6.0))) * step(0.5, vS.x);     // boughs only: the core has no beads
    float back = max(dot(-V, uSun), 0.0);
    col += uIceTint * uSkyCol * 0.2 * tipK;
    col += uSunCol * lit * uGlint * sunSide * (0.2 * tipK + sp * (0.5 + 1.6 * tipK) * (0.6 + 1.4 * back * back)) * (1.0 - 0.75 * smoothstep(25.0, 80.0, dist));
    col *= 0.6 + 0.4 * smoothstep(0.0, 1.6, vS.w);
    gl_FragColor = vec4(mix(col, fogCol(), fogAmt()), 1.0);
  }
`,ha=e0.common+e0.fogV+`
  attribute vec4 aB0;                         // the sun end of the beam (x, y, z), length
  attribute vec4 aB1;                         // width, seed, arcade distance, height above the snow at its middle
  varying vec2 vUv; varying vec4 vB; varying vec3 vW;
  void main() {
    vec3 C = aB0.xyz - uSun * (aB0.w * position.y);
    vec3 toEye = cameraPosition - C;
    vec3 sideV = cross(uSun, toEye); float sl = length(sideV); sideV = sl > 1e-4 ? sideV / sl : vec3(1.0, 0.0, 0.0);
    float d = length(toEye);
    float w = max(aB1.x, 0.004 * d);
    vec4 wp = modelMatrix * vec4(C + sideV * (position.x * w), 1.0); vW = wp.xyz;
    vUv = vec2(position.x * 2.0, position.y); vB = vec4(aB1.y, aB1.z, aB1.w, aB0.w);
    vec4 mv = viewMatrix * wp; gl_Position = projectionMatrix * mv;
`+G0+`  }
`,ua=e0.common+e0.fogF+dt+`
  uniform vec4 uBeam;                         // strength, glints, -, -
  varying vec2 vUv; varying vec4 vB; varying vec3 vW;
  void main() {
    float x = vUv.x, y = vUv.y, seed = vB.x, len = vB.w;
    vec3 Vv = cameraPosition - vW; float dist = length(Vv); vec3 V = Vv / max(dist, 1e-3);
    float back = max(dot(-V, uSun), 0.0);
    float sinA = sqrt(max(1.0 - back * back, 0.0));
    float ends = sin(3.14159 * y); ends *= ends;
    float m = y * len;
    float body = exp(-x * x * 3.0) * (1.0 - smoothstep(0.6, 1.0, abs(x))) * (0.5 + 0.5 * vnoise(vec2(m * 0.22 + seed * 31.0 - uTime * 0.06, seed * 9.0 + x * 0.7)));
    float lit = litAt(vB.y, vB.z);
    float b2 = back * back, phase = 0.07 + 0.93 * b2 * b2 * b2;
    float k = ends * lit * smoothstep(0.05, 0.22, sinA) * smoothstep(2.0, 7.0, dist) * (1.0 - fogAmt()) * uBeam.x;
    // glints: single crystals turning in the beam, drifting down it
    vec2 gc = vec2(x * 3.0, m * 5.0 + uTime * 0.35 + seed * 50.0), gi = floor(gc), gf = fract(gc) - 0.5;
    float gh = hash2(gi + seed * 17.0);
    float tw = hash2(gi * 1.3 + floor(uTime * 3.0 + gh * 9.0)); tw *= tw; tw *= tw;
    float px = fwidth(m) * 5.0;
    float glint = step(0.9, gh) * tw * (1.0 - smoothstep(0.06, 0.16 + px, length(gf))) * min(1.0, 0.4 / (px + 0.1)) * (1.0 - smoothstep(0.75, 1.0, abs(x)));
    vec3 col = uSunCol * (body * phase * 0.17 + glint * (0.5 + 2.5 * b2) * uBeam.y) * k;
    gl_FragColor = vec4(col, 0.0);
  }
`,da=e0.common+e0.fogV+`
  attribute vec3 aTan; attribute float aSide;
  uniform float uPx, uW;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vec2 t = (modelViewMatrix * vec4(aTan, 0.0)).xy; float tl = length(t);
    t = tl > 1e-5 ? t / tl : vec2(1.0, 0.0);
    float d = max(-mv.z, 0.3);
    mv.xy += vec2(-t.y, t.x) * aSide * max(uW, 1.7 * uPx * d) * 0.5;
    gl_Position = projectionMatrix * mv;
`+G0+`  }
`,va=e0.common+e0.fogF+`
  uniform vec3 uLineCol; uniform float uLit;
  void main() {
    vec3 col = uLineCol * (uSkyCol * 0.9 + uSunCol * uLit * 0.5);
    gl_FragColor = vec4(mix(col, fogCol(), fogAmt()), 1.0);
  }
`,pa=`
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`,ma=`
  uniform vec3 uLow, uTop, uHaze;
  varying vec2 vUv;
  float h2(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  float vn(float x) { float i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f); return mix(h2(vec2(i, 3.0)), h2(vec2(i + 1.0, 3.0)), f); }
  void main() {
    float x = vUv.x * 520.0;
    float top = 0.42 + 0.22 * vn(x * 0.11) + 0.2 * vn(x * 0.6) + 0.12 * vn(x * 2.3);
    float y = vUv.y;
    if (y > top) discard;
    float k = smoothstep(top - 0.3, top, y);
    vec3 col = mix(uLow, uTop, k * k);
    gl_FragColor = vec4(mix(col, uHaze, 0.5 + 0.35 * (1.0 - y)), 1.0);
  }
`,wa=`
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`,ga=`
  uniform vec3 uLitC, uShadeC, uHazeC, uTimber;
  uniform vec4 uMt;                           // bearing of the high range (0..1 round the cylinder), bearing of the sun, peak height, horizon line
  varying vec2 vUv;
  float h1(float n) { return fract(sin(n * 127.1 + 311.7) * 43758.5453); }
  float vn(float x) { float i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f); return mix(h1(i), h1(i + 1.0), f); }
  float ridge(float x, float seed) {
    float a = 0.0, w = 0.52, f = 1.0;
    for (int i = 0; i < 5; i++) { float n = vn(x * f + seed + float(i) * 17.3); a += w * (1.0 - abs(2.0 * n - 1.0)); w *= 0.5; f *= 2.13; }
    return a;
  }
  void main() {
    float az = vUv.x, y = (vUv.y - uMt.w) / (1.0 - uMt.w);
    float fw = fwidth(vUv.y) / (1.0 - uMt.w) + 1e-4;
    float dAz = abs(fract(az - uMt.x + 0.5) - 0.5) * 2.0;
    float env = 0.36 + 0.64 * pow(1.0 - smoothstep(0.0, 0.8, dAz), 1.4);
    float sunS = sin((az - uMt.y) * 6.2832);
    vec3 col = vec3(0.0); float alpha = 0.0;
    for (int L = 0; L < 3; L++) {
      float fl = float(L) * 0.5;
      float x = az * mix(38.0, 74.0, fl), seed = 11.0 + float(L) * 53.0, e = 0.012;
      float rr = ridge(x, seed), dr = (ridge(x + e, seed) - ridge(x - e, seed)) / (2.0 * e);
      float r = uMt.z * mix(1.0, 0.36, fl) * (mix(env, 0.8, fl) * (0.16 + 0.84 * rr) + 0.05);
      float cover = 1.0 - smoothstep(r - fw, r + fw, y);
      if (cover < 0.004) continue;
      float below = (r - y) / max(r, 1e-3);                                     // 0 on the crest .. 1 at the foot
      float gul = vn(x * 6.0 + below * 9.0 * (dr > 0.0 ? 1.0 : -1.0) + seed);
      float face = clamp(0.5 + sunS * (dr * 0.55 + (gul - 0.5) * 1.5), 0.0, 1.0);
      face = smoothstep(0.25, 0.75, face);
      vec3 c = mix(uShadeC, uLitC, face * (0.55 + 0.45 * (1.0 - below)));
      float rock = smoothstep(0.55, 0.8, vn(x * 17.0 + below * 23.0)) * smoothstep(0.03, 0.2, below) * (1.0 - fl);
      c = mix(c, uTimber * 1.6 + uShadeC * 0.25, rock * 0.45);
      float timber = smoothstep(mix(0.72, 0.3, fl), mix(0.95, 0.75, fl), below + 0.12 * vn(x * 31.0)) * mix(0.4, 0.9, fl);
      c = mix(c, uTimber, timber);
      float hz = clamp(mix(0.66, 0.34, fl) + 0.3 * below * below, 0.0, 0.96);
      c = mix(c, uHazeC, hz);
      col = col * (1.0 - cover) + c * cover; alpha = alpha * (1.0 - cover) + cover;
    }
    gl_FragColor = vec4(col, alpha) * smoothstep(-0.02, 0.03, y);
  }
`,ya=e0.common+e0.fogV+`
  attribute vec4 aI0;                         // x, y, z, yaw
  attribute vec4 aI1;                         // width, height, seed, arcade distance
  varying vec2 vUv; varying vec4 vS; varying vec3 vW;
  void main() {
    float c = cos(aI0.w), s = sin(aI0.w), x = position.x * aI1.x;
    vec3 Q = vec3(x * c, position.y * aI1.y, -x * s) + aI0.xyz;
    vec4 wp = modelMatrix * vec4(Q, 1.0); vW = wp.xyz;
    vUv = vec2((position.x + 0.5) * aI1.x / 3.4, position.y); vS = vec4(aI1.z, aI1.w, position.y * aI1.y, aI1.x / 3.4);
    vec4 mv = viewMatrix * wp; gl_Position = projectionMatrix * mv;
`+G0+`  }
`,xa=e0.common+e0.fogF+dt+`
  uniform vec3 uBark, uTwigCol, uIceTint;
  uniform float uGlint;
  varying vec2 vUv; varying vec4 vS; varying vec3 vW;
  // one row of birches: x = overall cover, y = the stem's share of it, z = twig density
  vec3 birches(float x, float y, float seed, float fwx, float hK) {
    float cell = floor(x), fx = fract(x);
    float h1 = hash2(vec2(cell, seed * 91.0)), h2 = hash2(vec2(cell + 7.0, seed * 37.0));
    float hTop = (0.5 + 0.48 * h1) * hK, yy = y / hTop;
    float dx = fx - (0.3 + 0.4 * h2 + (h1 - 0.5) * 0.5 * y * y);
    float w = 0.024 * (1.0 - 0.8 * min(yy, 1.0)) + 0.004, hw = max(w, 0.6 * fwx);
    float trunk = clamp((hw - abs(dx)) / fwx + 0.5, 0.0, 1.0) * step(yy, 1.0) * min(1.0, w / hw + 0.3);
    float cr = exp(-dx * dx / 0.11) * smoothstep(0.22, 0.5, yy) * (1.0 - smoothstep(0.82, 1.1, yy));
    float tw = vnoise(vec2(x * 9.0, y * 46.0) + seed * 13.0) * 0.6 + vnoise(vec2(x * 31.0 + 3.0, y * 19.0)) * 0.4;
    float crown = cr * smoothstep(0.3, 0.62, tw) * 0.8;
    return vec3(max(trunk, crown), trunk, tw);
  }
  void main() {
    float x = vUv.x, y = vUv.y, seed = vS.x;
    float fwx = fwidth(x) + 1e-4;
    float edgeK = smoothstep(0.0, 0.5, x) * smoothstep(0.0, 0.5, vS.w - x);
    float lit = litAt(vS.y, vS.z);
    vec3 V = normalize(cameraPosition - vW + vec3(0.0, 1e-4, 0.0));
    float back = max(dot(-V, uSun), 0.0);
    vec3 fill = mix(uDeep * 1.4, uSkyCol, 0.7);
    vec3 b1 = birches(x, y, seed, fwx, 1.0), b2 = birches(x * 1.7 + 0.37, y, seed + 0.31, fwx * 1.7, 0.74);
    float a = max(b1.x, b2.x), tr = max(b1.y, b2.y * 0.8), tw = max(b1.z, b2.z);
    float scar = step(0.72, hash2(vec2(floor(x * 1.7), floor(y * 26.0) + seed)));
    vec3 bark = uBark * 0.62 * (1.0 - 0.4 * scar) * (uSunCol * lit * 0.5 + fill);
    vec3 twig = mix(uTwigCol, uIceTint * 0.55, 0.5) * (fill + uSunCol * lit * 0.4) + uSunCol * lit * uGlint * (0.03 + 0.4 * back * back) * smoothstep(0.45, 0.7, tw);
    vec3 col = mix(twig, bark, tr / max(a, 1e-3));
    // a spruce here and there: a dark stepped spire with glazed bough tips
    float xs = x * 0.42 + seed * 7.0, cs = floor(xs), fs = fract(xs);
    float g1 = hash2(vec2(cs, seed * 53.0)), g2 = hash2(vec2(cs + 3.0, seed * 29.0));
    float hS = 0.45 + 0.4 * g2, ys = y / hS, sx = fs - (0.3 + 0.4 * g2);
    float sw = 0.13 * (1.0 - ys) * (0.72 + 0.28 * abs(fract(ys * 9.0) - 0.5) * 2.0) + 0.006;
    float aS = clamp((sw - abs(sx)) / (fwx * 0.42) + 0.5, 0.0, 1.0) * step(ys, 1.0) * step(0.62, g1);
    float tipK = smoothstep(0.5, 1.0, abs(sx) / max(sw, 0.01));
    vec3 spruce = vec3(0.03, 0.055, 0.05) * (fill + uSunCol * lit * 0.5) + (uSkyCol * 0.3 + uSunCol * lit * 0.2) * tipK;
    col = mix(col, spruce, aS); a = max(a, aS) * edgeK;
    if (a < 0.01) discard;
    gl_FragColor = vec4(mix(col, fogCol(), fogAmt()) * a, a);
  }
`;function Mt(){const a=[],m=[],M=[],q=[],L=[],C=[];return{tube(v,S,W,O,U,b=[1,1,1]){const _=a.length/3,E=v.length;for(let P=0;P<E;P++){const N=v[P],x=v[Math.max(0,P-1)].p,V=v[Math.min(E-1,P+1)].p;let n=V[1]-x[1],l=V[2]-x[2];const f=Math.hypot(n,l)||1;n/=f,l/=f;const h=l,y=-n;for(let d=0;d<S;d++){const A=d/S*Math.PI*2,T=Math.cos(A),R=Math.sin(A);a.push(N.p[0]+T*N.r[0],N.p[1]+R*N.r[1]*h,N.p[2]+R*N.r[1]*y);const w=T/Math.max(N.r[0],.001),Z=R/Math.max(N.r[1],.001),X=Math.hypot(w,Z)||1;m.push(w/X,Z*h/X,Z*y/X);const h0=N.c||b;M.push(h0[0],h0[1],h0[2]),q.push(W,N.w??0,O[0],O[1]),L.push(U[0],U[1],typeof N.coat=="function"?N.coat(R*h,T,R*y):N.coat??0)}if(P)for(let d=0;d<S;d++){const A=_+(P-1)*S+d,T=_+(P-1)*S+(d+1)%S,R=A+S,w=T+S;C.push(A,T,R,T,w,R)}}},rod(v,S,W,O,U,b,_=0,E=0,P=[0,0],N=0){const x=a.length/3;let V=S[0]-v[0],n=S[1]-v[1],l=S[2]-v[2];const f=Math.hypot(V,n,l)||1;V/=f,n/=f,l/=f;let h=l,y=0,d=-V,A=Math.hypot(h,d);A<.001&&(h=1,d=0,A=1),h/=A,d/=A;const T=n*d-l*y,R=l*h-V*d,w=V*y-n*h;for(let Z=0;Z<2;Z++){const X=Z?S:v,h0=Z?O:W;for(let d0=0;d0<U;d0++){const g0=d0/U*Math.PI*2,r0=Math.cos(g0),u0=Math.sin(g0),a0=h*r0+T*u0,n0=y*r0+R*u0,c0=d*r0+w*u0;a.push(X[0]+a0*h0,X[1]+n0*h0,X[2]+c0*h0),m.push(a0,n0,c0),M.push(b[0],b[1],b[2]),q.push(E,N,P[0],P[1]),L.push(0,0,Array.isArray(_)?_[Z]:_)}}for(let Z=0;Z<U;Z++){const X=x+Z,h0=x+(Z+1)%U;C.push(X,h0,X+U,h0,h0+U,X+U)}},pipe(v,S,W,O,U=0){const b=a.length/3,_=v.length;let E=0,P=1,N=0;for(let x=0;x<_;x++){const V=v[Math.max(0,x-1)],n=v[Math.min(_-1,x+1)];let l=n[0]-V[0],f=n[1]-V[1],h=n[2]-V[2];const y=Math.hypot(l,f,h)||1;l/=y,f/=y,h/=y;let d=f*N-h*P,A=h*E-l*N,T=l*P-f*E,R=Math.hypot(d,A,T);if(R<.05){d=1,A=0,T=0;const r0=d*l;d-=l*r0,A-=f*r0,T-=h*r0,R=Math.hypot(d,A,T)||1}d/=R,A/=R,T/=R;const w=A*h-T*f,Z=T*l-d*h,X=d*f-A*l;E=w,P=Z,N=X;const h0=x/(_-1),d0=typeof S=="function"?S(h0):S,g0=typeof U=="function"?U(h0):U;for(let r0=0;r0<W;r0++){const u0=r0/W*Math.PI*2,a0=Math.cos(u0),n0=Math.sin(u0),c0=d*a0+w*n0,q0=A*a0+Z*n0,i=T*a0+X*n0;a.push(v[x][0]+c0*d0,v[x][1]+q0*d0,v[x][2]+i*d0),m.push(c0,q0,i),M.push(O[0],O[1],O[2]),q.push(0,0,0,0),L.push(0,0,g0)}if(x)for(let r0=0;r0<W;r0++){const u0=b+(x-1)*W+r0,a0=b+(x-1)*W+(r0+1)%W;C.push(u0,a0,u0+W,a0,a0+W,u0+W)}}},strip(v,S,W,O,U=1){const b=a.length/3;v.forEach((_,E)=>{for(const P of[_.a,_.b])a.push(P[0],P[1],P[2]),m.push(0,U,0),M.push(O[0],O[1],O[2]),q.push(S,_.w??0,W[0],W[1]),L.push(0,0,_.coat??0);if(E){const P=b+E*2;C.push(P-2,P-1,P,P-1,P+1,P)}})},fin(v,S,W,O,U,b,_,E,P,N=0){const x=a.length/3;for(const V of[v,S,W])a.push(V[0],V[1],V[2]),m.push(O[0],O[1],O[2]),M.push(P[0],P[1],P[2]),q.push(U,b,_[0],_[1]),L.push(E[0],E[1],N);C.push(x,x+1,x+2)},build(){const v=new r.BufferGeometry;return v.setAttribute("position",new r.Float32BufferAttribute(a,3)),v.setAttribute("normal",new r.Float32BufferAttribute(m,3)),v.setAttribute("color",new r.Float32BufferAttribute(M,3)),v.setAttribute("aRig",new r.Float32BufferAttribute(q,4)),v.setAttribute("aKnee",new r.Float32BufferAttribute(L,3)),v.setIndex(C),v.userData.triangles=C.length/3,v}}}function bo(a){const m=Mt(),M=a.H,q=a.L,L=a.rx,C=a.ry,$=a.c,v=a.hs,S=[[-1.14,.22,.22,.04],[-1,.74,.72,.02],[-.7,1*a.rump,.98*a.rump,0],[-.22,.92,.94,-.02],[.28,1,1.1,-.04],[.72,1.06,1.18,-.03],[1.02,.84,1,.03]];m.tube(S.map(([l,f,h,y])=>({p:[0,M+y*C*4,l*q],r:[f*L,h*C],w:l,coat:(d,A)=>a.torso(d,l,A)})),12,0,[0,0],[0,0],$);const W=M+.3*C,O=q*.93,U=[W,O],b=[[0,0,.105,.125,0],[.08,.085,.09,.105,0],[.155,.165,.085,.095,0],[.18,.245,.09,.09,0],[.165,.315,.07,.068,1],[.14,.375,.046,.042,2],[.13,.44+a.muzzle,.032,.03,2],[.125,.475+a.muzzle,.012,.012,3]];m.tube(b.map(([l,f,h,y,d],A)=>({p:[0,W+l*v*a.neck,O+f*v],r:[h*v*(A<2?a.neckR:1),y*v*(A<2?a.neckR:1)],w:A/7,coat:T=>d===3?2:a.head(T,d)})),10,6,U,[0,0],$);for(const l of[1,-1]){const f=l*a.ear[2]*v,h=W+(.18*a.neck+.075)*v,y=O+.225*v,d=a.ear[0],A=a.ear[3];m.tube([{p:[f,h-.02,y],r:[a.ear[1],a.ear[1]*.55],coat:1},{p:[f,h+d*.55,y-d*.55*A],r:[a.ear[1]*.8,a.ear[1]*.4],coat:1},{p:[f,h+d,y-d*A],r:[.006,.005],coat:a.ear[4]}],5,6,U,[0,0],$),a.tuft&&m.tube([{p:[f,h+d*.9,y-d*A*.9],r:[.011,.009],coat:2},{p:[f*1.08,h+d+a.tuft*.6,y-d*A-.01],r:[.008,.007],coat:2},{p:[f*1.15,h+d+a.tuft,y-d*A-.02],r:[.003,.003],coat:2}],4,6,U,[0,0],$),a.ruff&&m.tube([{p:[l*.07*v,W+.1*v*a.neck,O+.2*v],r:[.05*v,.07*v],coat:.6},{p:[l*.115*v,W+.02*v,O+.17*v],r:[.04*v,.06*v],coat:.2},{p:[l*.16*v,W-a.ruff*v,O+.15*v],r:[.008,.012],coat:2}],6,6,U,[0,0],$)}const _=M+C*.45,E=-q*1.04,P=a.tail[0],N=a.tail[1],x=7,V=a.tail[4],n=[[0,0]];if(V)for(let l=1;l<x;l++){const f=P0(V[0],V[1],(l-.5)/(x-1)),h=n[l-1];n.push([h[0]+Math.sin(f)*P/(x-1),h[1]-Math.cos(f)*P/(x-1)])}m.tube(Array.from({length:x},(l,f)=>{const h=f/(x-1);return{p:V?[0,_+n[f][0],E+n[f][1]]:[0,_+P*(a.tail[2]*h-.3*h*h),E-P*h*.94],r:[N*(.45+.75*Math.sin(Math.PI*Math.min(1,h*1.08+.04))),N*(.45+.75*Math.sin(Math.PI*Math.min(1,h*1.08+.04)))],w:h,coat:a.tail[3](h)}}),7,5,[_,E],[0,0],$);for(let l=1;l<=4;l++){const f=l<=2,h=(l%2?1:-1)*a.legX,y=f?[M-.1*C,-q*.76]:[M-.25*C,q*.72],d=f?[M*.46,-q*.76-a.hock]:[M*.42,q*.74],A=f?[.03,-q*.76-a.hock*.45+.02]:[.03,q*.78],T=a.leg[0]*(f?a.thigh??1.25:1),R=a.leg[1],w=a.leg[2],Z=(d0,g0,r0)=>[d0[0]+(g0[0]-d0[0])*r0,d0[1]+(g0[1]-d0[1])*r0],X=Z(y,d,.5),h0=Z(d,A,.55);f&&(X[1]+=a.stifle??0),m.tube([{p:[h,y[0],y[1]],r:[T,T*1.5],w:0,coat:a.legCoat[0]},{p:[h,X[0],X[1]],r:[T*.8,T*1.05],w:.25,coat:a.legCoat[1]},{p:[h,d[0],d[1]],r:[R*1.1,R*1.25],w:.5,coat:a.legCoat[2]},{p:[h,h0[0],h0[1]],r:[R,R],w:.75,coat:a.legCoat[2]},{p:[h,A[0]+.035,A[1]],r:[R*.95,R],w:.95,coat:a.legCoat[2]},{p:[h,A[0],A[1]+w*.5],r:[w,w*1.5],w:1,coat:a.legCoat[2]}],6,l,y,d,$)}return m.build()}function ba(){const a=Mt(),m=.47,M=.34,q=.125,L=.145,C=[.6,.575,.55],$=(n,l)=>l<-.8?Y(.15,.6,n)*(n>.93?1.5:1):n>.9&&l<.86?1.85:Y(-.62,-.02,n),v=[[-1.17,.3,.3,.035],[-1.07,.72,.74,.022],[-.88,.99,.99,.006],[-.62,1.07,1.01,0],[-.3,.95,.94,-.012],[0,.93,.99,-.02],[.3,1,1.1,-.034],[.6,1.08,1.2,-.036],[.84,1.05,1.15,-.022],[1.03,.82,.98,.02]];a.tube(v.map(([n,l,f,h])=>({p:[0,m+h*L*4,n*M],r:[l*q,f*L],w:n,coat:y=>$(y,n)})),14,0,[0,0],[0,0],C);const S=m+.3*L,W=M*.93,O=[S,W],U=[[0,0,.118,.138,0],[.085,.085,.104,.118,0],[.155,.165,.09,.098,0],[.182,.245,.093,.092,0],[.165,.315,.07,.068,1],[.14,.375,.046,.042,2],[.13,.44,.032,.03,2],[.125,.475,.012,.012,3]];a.tube(U.map(([n,l,f,h,y],d)=>({p:[0,S+n,W+l],r:[f,h],w:d/7,coat:A=>y===3?2:y===0?Y(-.25,.35,A)*(A>.8?1.5:1):y===1?Y(.1,.7,A)*.8:0})),10,6,O,[0,0],C);for(const n of[1,-1]){const l=n*.06,f=S+.25,h=W+.222,y=.128;a.tube([{p:[l,f-.03,h],r:[.046,.026],coat:1.5},{p:[l*1.12,f+y*.5,h-.008],r:[.036,.017],coat:1.7},{p:[l*1.25,f+y,h-.016],r:[.007,.006],coat:2}],6,6,O,[0,0],C);for(let d=0;d<4;d++){const A=(.25+.42*d)*n,T=[Math.sin(A),Math.cos(A)],R=S+.05+.01*d,w=W+.03;a.fin([T[0]*.105,R+T[1]*.125,w+.022],[T[0]*.105,R+T[1]*.125,w-.022],[T[0]*.128,R+T[1]*.15,w-.055],[T[0],T[1],-.2],6,.05,O,[0,0],C,d<3?1:.3)}}const b=m+.36*L,_=-M*1.03,E=[[0,0],[-.004,-.06],[-.012,-.125],[-.026,-.19],[-.045,-.25],[-.068,-.305],[-.092,-.352],[-.112,-.39],[-.122,-.418]],P=E.length,N=n=>{const l=n/(P-1);return(.026+.043*Math.pow(Math.sin(Math.PI*Math.min(1,l*1.1+.08)),.7))*(n&1?1.13:.92)*(n===P-1?.4:1)},x=(n,l)=>n>=P-3?.1:l>.8?1.5:l>.1?1:.15;a.tube(E.map(([n,l],f)=>({p:[0,b+n,_+l],r:[N(f),N(f)*.9],w:f/(P-1),coat:h=>x(f,h)})),9,5,[b,_],[0,0],C);for(let n=1;n<P-1;n++){const l=E[n-1],f=E[n+1],h=E[n];let y=f[0]-l[0],d=f[1]-l[1];const A=Math.hypot(y,d)||1;y/=A,d/=A;const T=N(n),R=n/(P-1),w=b+h[0],Z=_+h[1];for(let X=0;X<5;X++){const h0=(X+(n&1)*.5)/5*Math.PI*2,d0=Math.cos(h0),g0=Math.sin(h0),r0=d0,u0=g0*d,a0=-g0*y,n0=T*.86,c0=T+.02;a.fin([r0*n0,w+u0*n0-y*.02,Z+a0*n0-d*.02],[r0*n0,w+u0*n0+y*.02,Z+a0*n0+d*.02],[r0*c0,w+u0*c0+y*.05,Z+a0*c0+d*.05],[r0,u0,a0],5,R,[b,_],[0,0],C,x(n,u0))}}for(let n=1;n<=4;n++){const l=n<=2,f=(n%2?1:-1)*(l?.088:.08);if(l){const h=-M*.74,y=[m-.08*L,h],d=[.205,h-.135],A=(T,R,w)=>w<-.1?.08:1;a.tube([{p:[f*.9,y[0]+.03,h-.012],r:[.07,.118],w:0,coat:A},{p:[f,.405,h+.012],r:[.068,.108],w:.12,coat:A},{p:[f,.33,h+.028],r:[.054,.082],w:.25,coat:A},{p:[f,.268,h-.07],r:[.037,.052],w:.38,coat:A},{p:[f,d[0]+.012,d[1]+.006],r:[.032,.042],w:.5,coat:.2},{p:[f,d[0]-.04,d[1]+.016],r:[.026,.031],w:.6,coat:.12},{p:[f,.092,d[1]+.034],r:[.025,.028],w:.8,coat:.1},{p:[f,.052,d[1]+.045],r:[.03,.033],w:.92,coat:.08},{p:[f,.036,d[1]+.078],r:[.04,.034],w:1,coat:.08},{p:[f,.022,d[1]+.124],r:[.023,.016],w:1,coat:.3}],8,n,y,d,C);for(let T=0;T<4;T++){const R=.43-.045*T,w=h-.095-.004*T+.03*(T>2?1:0),Z=f*(1+.12*(T&1?1:-1));a.fin([Z-.022,R,w+.02],[Z+.022,R,w+.02],[Z,R-.042,w-.028],[0,.2,-1],n,.1,y,d,C,.08)}}else{const h=M*.7,y=[m-.22*L,h],d=[.2,h+.006];a.tube([{p:[f,y[0],h],r:[.05,.088],w:0,coat:1},{p:[f,.34,h+.012],r:[.04,.056],w:.25,coat:.6},{p:[f,d[0],d[1]],r:[.03,.034],w:.5,coat:.15},{p:[f,.1,h+.004],r:[.026,.028],w:.8,coat:.1},{p:[f,.052,h+.012],r:[.03,.033],w:.92,coat:.08},{p:[f,.036,h+.045],r:[.039,.034],w:1,coat:.08},{p:[f,.022,h+.09],r:[.022,.016],w:1,coat:.3}],8,n,y,d,C)}}const V=n=>{for(let l=1;l<v.length;l++)if(n<=v[l][0]){const f=v[l-1],h=v[l],y=(n-f[0])/(h[0]-f[0]);return[P0(f[1],h[1],y)*q,m+P0(f[3],h[3],y)*L*4,P0(f[2],h[2],y)*L]}return[q,m,L]};for(const n of[1,-1]){const l=[];for(let f=0;f<=6;f++){const h=P0(.8,-1.02,f/6),y=P0(.62,0,Math.pow(f/6,.8))*n,[d,A,T]=V(h);l.push({p:[Math.sin(y)*(d+.004),A+Math.cos(y)*(T+.004),h*M],r:[.014,.008],w:h,coat:2})}a.tube(l,5,0,[0,0],[0,0],C)}{const n=[],[l,f,h]=V(.82);for(let y=0;y<=12;y++){const d=y/12*Math.PI*2;n.push([Math.sin(d)*(l+.016),f+.008+Math.cos(d)*(h+.016),.82*M+.012*Math.cos(d)])}a.pipe(n,.013,5,C,2)}return a.build()}function za(){const a=Mt(),m=[.3,.27,.25],M=[[-.4,.1,.012,.8],[-.24,.1,.08,.6],[-.04,.14,.13,.35],[.1,.155,.15,.2],[.2,.172,.172,.25],[.28,.168,.17,.45],[.318,.15,.152,.5],[.33,.132,.136,1.9],[.345,.03,.03,2.1]];a.tube(M.map(([q,L,C,$])=>({p:[0,0,q],r:[L,C],w:0,coat:v=>$+(v<-.2&&$<1?-.15:0)})),10,0,[0,0],[0,0],m);for(const q of[-1,1]){const C=[];for(let v=0;v<=8;v++){const S=v/8,W=q*(.11+.64*S),O=.44*(1-.22*S*S)*(v===8?.55:v===7?.86:1),U=.14-.05*S*S-(v===8?.06:0);C.push({a:[W,.02,U],b:[W,0,U-O],w:S,coat:.25+.45*(v%2)+.35*S})}a.strip(C,q<0?7:8,[.11,0],m),a.rod([q*.048,.022,.332],[q*.048,.022,.352],.031,.001,7,[.95,.7,.1]),a.rod([q*.048,.022,.344],[q*.048,.022,.357],.015,.001,6,[.01,.01,.012]),a.rod([q*.012,.075,.338],[q*.085,.052,.344],.012,.008,4,[.08,.07,.07])}return a.rod([0,-.005,.342],[0,-.05,.372],.02,.004,5,[.7,.55,.2]),a.build()}function ka(){const a=Mt(),m=[.4,.27,.14],M=[.06,.07,.11],q=[.33,.3,.26],L=[.5,.42,.3],C=(n,l)=>new r.CatmullRomCurve3(n.map(f=>new r.Vector3(f[0],f[1],f[2])),!1,"centripetal").getPoints(l).map(f=>[f.x,f.y,f.z]),$=(n,l)=>a.pipe([[n[0],n[1]-.03,n[2]],[n[0],n[1],n[2]],[n[0],n[1]+.03,n[2]]],f=>l*(.75+.25*Math.sin(f*Math.PI)),6,L,0);a.pipe(C([[-.26,.44,.34],[-.262,.7,.23],[-.24,.92,.14],[-.14,1.03,.095],[0,1.055,.085],[.14,1.03,.095],[.24,.92,.14],[.262,.7,.23],[.26,.44,.34]],24),.021,8,m,0),a.pipe(C([[-.1,1.04,.09],[-.05,1.052,.086],[0,1.055,.085],[.05,1.052,.086],[.1,1.04,.09]],8),n=>.026+.0015*Math.sin(n*50),8,[.17,.095,.05],0),a.pipe(C([[-.26,.2,2.02],[-.255,.225,2.36],[-.17,.25,2.62],[0,.258,2.71],[.17,.25,2.62],[.255,.225,2.36],[.26,.2,2.02]],20),.024,7,m,0);for(const n of[1,-1]){const l=n*.26;a.pipe(C([[l,.026,-.85],[l,.026,.6],[l,.026,1.9],[l,.07,2.2],[l*.94,.17,2.4],[l*.86,.25,2.5]],12),.022,6,M,0),a.pipe(C([[l,.44,.22],[l,.44,1.1],[l,.43,1.95],[l*.98,.32,2.3],[l*.9,.25,2.48]],10),.017,6,m,0);for(const f of[.3,1,1.7])a.rod([l,.03,f],[l,.44,f+.04],.018,.016,6,m),$([l,.43,f+.04],.028),$([l,.06,f],.03);a.rod([l,.44,.95],[n*.258,.78,.2],.013,.013,5,m),a.strip([{a:[l-.05,.052,-.62],b:[l+.05,.052,-.62]},{a:[l-.05,.052,-.02],b:[l+.05,.052,-.02]}],0,[0,0],M)}for(let n=0;n<5;n++){const l=-.2+n*.1;a.strip([{a:[l-.04,.2,.24],b:[l+.04,.2,.24]},{a:[l-.04,.2,2],b:[l+.04,.2,2]}],0,[0,0],m)}const v=15,S=n=>Math.pow(Math.sin(Math.PI*Math.min(1,Math.max(0,n*.96+.02))),.42),W=n=>(.2+.03*Math.sin(n*9+1)+.02*Math.sin(n*23))*S(n)+.01,O=n=>(.25+.02*Math.sin(n*13+2))*S(n)+.01,U=n=>.41+.035*Math.sin(n*5.3);a.tube(Array.from({length:v},(n,l)=>{const f=l/(v-1);return{p:[0,U(f),.52+1.5*f],r:[O(f),W(f)],coat:.4}}),14,0,[0,0],[0,0],q);for(const n of[.2,.42,.63,.83]){const l=[];for(let f=0;f<=14;f++){const h=f/14*Math.PI*2;l.push([Math.cos(h)*(O(n)+.008),U(n)+Math.sin(h)*(W(n)+.008),.52+1.5*n+.03*Math.sin(h*2+n*9)])}a.pipe(l,.011,5,M,2)}const b=[.5,.032,.036],_=[.3,.02,.026],E=[.045,.06,.12],P=[.42,.3,.17],N=[.66,.6,.52],x=[.09,.065,.055];for(const n of[1,-1])a.tube([{p:[n*.26,.085,-.25],r:[.058,.135],c:P},{p:[n*.26,.15,-.27],r:[.06,.1],c:P},{p:[n*.256,.26,-.3],r:[.06,.07],c:P},{p:[n*.25,.44,-.29],r:[.078,.084],c:P},{p:[n*.25,.475,-.285],r:[.086,.09],c:N},{p:[n*.248,.5,-.28],r:[.07,.074],c:E},{p:[n*.235,.6,-.235],r:[.078,.084],c:E},{p:[n*.2,.8,-.31],r:[.094,.102],c:E},{p:[n*.15,.97,-.38],r:[.1,.11],c:E}],8,0,[0,0],[0,0],E),a.pipe(C([[n*.24,1.44,-.2],[n*.31,1.3,-.12],[n*.325,1.16,-.02],[n*.265,1.05,.06]],8),l=>.07-.016*l,7,b,0),a.pipe([[n*.265,1.06,.045],[n*.235,1.02,.1],[n*.205,.985,.135]],l=>.05+.02*Math.sin(l*Math.PI),6,x,0),a.pipe([[n*.27,1.085,.02],[n*.262,1.06,.05]],.066,6,N,0);const V=[[.79,-.395,.262,.205,_],[.83,-.39,.27,.21,b],[.97,-.37,.238,.178,b],[1.03,-.355,.228,.168,_],[1.06,-.35,.23,.17,b],[1.22,-.305,.236,.172,b],[1.37,-.25,.25,.165,b],[1.47,-.2,.242,.145,b],[1.53,-.17,.15,.125,b],[1.59,-.16,.128,.135,b],[1.69,-.15,.138,.152,b],[1.78,-.145,.12,.134,b],[1.85,-.14,.066,.076,b],[1.875,-.14,.006,.006,b]];a.tube(V.map(([n,l,f,h,y])=>({p:[0,n,l],r:[f,h],c:y})),12,0,[0,0],[0,0],b);{const n=[];for(let l=0;l<=12;l++){const f=l/12*Math.PI*2;n.push([Math.sin(f)*.125,1.695+Math.cos(f)*.145,-.035-.035*Math.cos(f)])}a.pipe(n,.042,6,N,0)}return a.tube([{p:[0,1.57,-.03],r:[.09,.02],c:M},{p:[0,1.7,-.02],r:[.1,.02],c:M},{p:[0,1.81,-.03],r:[.07,.02],c:M}],8,0,[0,0],[0,0],M),a.build()}function Ma(a){const m=Mt(),M=[.78,.76,.75],q=[.13,.09,.07],L=[[0,3.6],[.45,3.2],[1.1,2.5],[1.75,1.7],[2.2,.95],[2.5,.25],[2.55,.02]];return m.tube(L.map(([C,$],v)=>{const S=a.range(.9,1.1);return{p:[0,C,0],r:[$*S,$*S],c:v<2?M:null,coat:(W,O)=>v>=4||Lt(v*7.1+Math.round(O*6))>.45?0:1}}),14,0,[0,0],[0,0],M),m.build()}function Aa(){const a=Mt(),m=[.62,.5,.33];return a.rod([0,0,-.8],[0,0,-.55],.03,.04,5,m,0),a.rod([0,0,-.55],[0,0,.6],.04,.035,5,m,1),a.rod([0,0,.6],[0,0,.85],.035,.012,5,m,0),a.build()}function Ca(a){const m=[],M=[],q=[],L=[],C=[],$=(U,b,_,E,P)=>{const N=m.length/3,x=new r.Vector3().subVectors(b,U).normalize(),V=new r.Vector3(x.z,0,-x.x);V.lengthSq()<1e-4&&V.set(1,0,0),V.normalize();const n=new r.Vector3().crossVectors(x,V);for(let l=0;l<2;l++)for(let f=0;f<P;f++){const h=f/P*Math.PI*2,y=Math.cos(h),d=Math.sin(h),A=l?b:U,T=l?E:_,R=V.x*y+n.x*d,w=V.y*y+n.y*d,Z=V.z*y+n.z*d;m.push(A.x+R*T,A.y+w*T,A.z+Z*T),M.push(R,w,Z),q.push(0,0),L.push(0)}for(let l=0;l<P;l++){const f=N+l,h=N+(l+1)%P;C.push(f,h,f+P,h,h+P,f+P)}},v=U=>{const b=m.length/3;for(const[_,E]of[[0,0],[1,0],[1,1],[0,1]])m.push(U.x,U.y,U.z),M.push(0,1,0),q.push(_,E),L.push(1);C.push(b,b+1,b+2,b,b+2,b+3)},S=(U,b,_)=>new r.Vector3(U,b,_),W=a.int(3,4);for(let U=0;U<W;U++){const b=U/W*6.283+a.range(-.4,.4),_=a.range(.12,.3),E=S(Math.cos(b)*Math.sin(_),Math.cos(_),Math.sin(b)*Math.sin(_)),P=S(Math.cos(b)*.12,0,Math.sin(b)*.12),N=P.clone().addScaledVector(E,1.5),x=N.clone().addScaledVector(E,1.3).add(S(0,.15,0));$(P,N,.075,.055,5),$(N,x,.055,.04,5);for(let V=0;V<3;V++){const n=b+(V-1)*1.3+a.range(-.4,.4),l=a.range(.35,.95),f=a.range(1.8,2.7),h=S(Math.cos(n)*Math.sin(l),Math.cos(l),Math.sin(n)*Math.sin(l)),y=V===0?x:N.clone().lerp(x,a.range(.2,.9)),d=y.clone().addScaledVector(h,f*.55),A=d.clone().addScaledVector(h,f*.45).add(S(0,-.12*f*l,0));$(y,d,.035,.024,4),$(d,A,.024,.012,4);for(let T=0;T<6;T++){const R=a.range(.25,1),w=R<.55?y.clone().lerp(d,R/.55):d.clone().lerp(A,(R-.55)/.45),Z=S(a.gauss(),a.gauss()*.5-.15,a.gauss()).normalize().multiplyScalar(.6).addScaledVector(h,.5).normalize(),X=w.clone().addScaledVector(Z,a.range(.45,.95)).add(S(0,-.1,0));$(w,X,.011,.006,3),v(X),v(w.clone().lerp(X,a.range(.45,.8)).add(S(0,-.05,0))),a.chance(.6)&&v(w.clone().lerp(X,a.range(.15,.4)).add(S(a.range(-.08,.08),-.07,a.range(-.08,.08))))}v(A)}}const O=new r.BufferGeometry;return O.setAttribute("position",new r.Float32BufferAttribute(m,3)),O.setAttribute("normal",new r.Float32BufferAttribute(M,3)),O.setAttribute("uv",new r.Float32BufferAttribute(q,2)),O.setAttribute("aK",new r.Float32BufferAttribute(L,1)),O.setIndex(C),O.userData.triangles=C.length/3,O}function Sa(a,m=54){const M=[],q=[],L=[],C=[],$=[],S=b=>.3+1.5*Math.pow(Math.max(0,1-b/12),.9),W=(b,_,E,P,N,x,V,n,l,f)=>(M.push(b,_,E),q.push(P,N,x),L.push(V,n),C.push(l,f),M.length/3-1),O=[[0,.17],[.5,.14],[1,.3],[2.2,.44],[4,.44],[6,.37],[8,.27],[9.8,.2],[11.2,.12],[12.3,.01]];for(let b=0;b<O.length;b++){const[_,E]=O[b],P=b<2?E:S(_)*E;for(let N=0;N<8;N++){const x=N/8*6.2832+b*.4,V=P*(b<2?1:.8+.4*a());W(Math.cos(x)*V,_,Math.sin(x)*V,Math.cos(x)*.85,.5,Math.sin(x)*.85,0,0,0,0)}if(b)for(let N=0;N<8;N++){const x=(b-1)*8+N,V=(b-1)*8+(N+1)%8;$.push(x,V,x+8,V,V+8,x+8)}}for(let b=0;b<m;b++){const _=(b+a())/m,E=.5+(12-.85)*Math.pow(_,1.05),P=b*2.39996+a.range(-.3,.3),N=E/12,x=S(E)*a.range(.88,1.2)+.25,V=P0(1,.25,Math.pow(N,1.4))*a.range(.8,1.15),n=Math.cos(P),l=Math.sin(P),f=a(),h=.3*x+.2,y=d=>[n*(.12+x*d),E+x*(.2*d-.78*d*d*V+.3*d*d*d*V),l*(.12+x*d)];for(let d=0;d<2;d++){let A=-1;for(let T=0;T<=3;T++){const R=T/3,w=y(R),Z=y(Math.min(1,R+.05)),X=y(Math.max(0,R-.05));let h0=Z[0]-X[0],d0=Z[1]-X[1],g0=Z[2]-X[2];const r0=Math.hypot(h0,d0,g0)||1;h0/=r0,d0/=r0,g0/=r0;let u0,a0,n0;d===0?(u0=-l,a0=0,n0=n):(u0=-d0*n,a0=Math.hypot(h0,g0),n0=-d0*l);const c0=h*(d?.8:1),q0=W(w[0]-u0*c0,w[1]-a0*c0,w[2]-n0*c0,n*.85,.5,l*.85,-1,R,1,f+d*.37);W(w[0]+u0*c0,w[1]+a0*c0,w[2]+n0*c0,n*.85,.5,l*.85,1,R,1,f+d*.37),A>=0&&$.push(A,A+1,q0,A+1,q0+1,q0),A=q0}}}const U=new r.BufferGeometry;return U.setAttribute("position",new r.Float32BufferAttribute(M,3)),U.setAttribute("normal",new r.Float32BufferAttribute(q,3)),U.setAttribute("uv",new r.Float32BufferAttribute(L,2)),U.setAttribute("aK",new r.Float32BufferAttribute(C,2)),U.setIndex($),U.userData.triangles=$.length/3,U}function Pa(){const a=[],m=[],M=[],q=[];for(let C=0;C<3;C++){const $=C*Math.PI/3+.2,v=Math.cos($),S=Math.sin($),W=C*4;for(const[O,U]of[[-.5,0],[.5,0],[.5,1],[-.5,1]])a.push(O*v,U,O*S),m.push(O+.5,U),M.push(C);q.push(W,W+1,W+2,W,W+2,W+3)}const L=new r.BufferGeometry;return L.setAttribute("position",new r.Float32BufferAttribute(a,3)),L.setAttribute("uv",new r.Float32BufferAttribute(m,2)),L.setAttribute("aCard",new r.Float32BufferAttribute(M,1)),L.setIndex(q),L}const Fa={H:.2,L:.19,rx:.07,ry:.082,rump:1.25,hs:.6,neck:.75,neckR:.85,muzzle:-.05,legX:.05,hock:.085,leg:[.036,.016,.022],c:[.82,.82,.83],torso:()=>.5,head:()=>.5,ear:[.125,.02,.035,.55,2],tail:[.05,.035,.6,()=>.3],legCoat:[.5,.4,.3]},Ia={H:.3,L:.28,rx:.075,ry:.088,rump:1,hs:.72,neck:.9,neckR:.85,muzzle:.03,legX:.055,hock:.06,leg:[.032,.016,.02],c:[.8,.78,.76],torso:a=>Y(-.55,-.1,a),head:(a,m)=>m<2?Y(-.3,.2,a):0,ear:[.09,.03,.045,.1,2],tail:[.42,.07,.12,a=>1-Y(.7,.95,a)],legCoat:[1,1.6,2]},Va={H:.57,L:.31,rx:.1,ry:.128,rump:1.16,hs:1.02,neck:.72,neckR:1.15,muzzle:-.09,legX:.08,hock:.14,leg:[.058,.035,.066],thigh:1.55,stifle:.05,c:[.78,.74,.68],torso:(a,m,M)=>Y(-.6,-.05,a)*(1+.5*(Lt(Math.round(m*9)*3.1+Math.round(M*2.5)*1.7)>.7?1:0)),head:(a,m)=>m<2?Y(-.3,.3,a):.35,ear:[.07,.04,.066,.12,1.6],tuft:.032,ruff:.11,tail:[.1,.045,.1,a=>1+Y(.45,.7,a)],legCoat:[1,.9,.75]},Ta={rose:{el:7,az:128,mtAz:12,beam:.55,shaft:.6,bounce:0,icePath:0,fog:"#aab6e2",fogD:.0029,exposure:.8,horizon:"#f4c6c0",zenith:"#2f5fb4",portal:"#ffe9dc",sky:{preset:"dawn",zenith:"#1f55b8",mid:"#a6d4f2",horizon:"#f8c4be",ground:"#a9b6dc",horizonPow:8,midPow:3,scatterColor:"#ffc49a",scatter:.5,scatterPow:4,sunColor:"#ffe0c4",sunSize:1.5,sunIntensity:11,sunGlow:.7,stars:0,clouds:!1,clouds2:!1,bodies:[{elevation:8,azimuth:-72,size:1.5,phase:.96,intensity:.7,texture:.6,glow:.05}]},cloudLit:"#f7b4b4",cloudShade:"#6258a0",grade:{saturation:1.12,contrast:1.06,tint:"#fff8f6",shadowTint:"#0d1838",vignette:.3,grain:.02}},golden:{el:8.5,az:-12,mtAz:80,beam:1,shaft:.85,bounce:.14,icePath:.8,glint:.62,fog:"#b4b0d2",fogD:.0027,exposure:.8,horizon:"#ffd2a6",zenith:"#2c55a6",portal:"#ffe2bc",sun:"#FFC892",sunI:2.5,snowWhite:.66,sky:{preset:"goldenHour",zenith:"#1d4fa8",mid:"#a2cbee",horizon:"#ffd0a2",ground:"#a9aac8",horizonPow:7,midPow:2.6,scatterColor:"#ffa860",scatter:.6,scatterPow:4,sunColor:"#ffc88c",sunSize:1.7,sunIntensity:12,sunGlow:.75,clouds:!1,clouds2:!1},cloudLit:"#f3a878",cloudShade:"#5f5290",grade:{saturation:1.1,contrast:1.06,tint:"#fffaf2",shadowTint:"#101a3c",vignette:.3,grain:.02}},night:{el:31,az:116,mtAz:12,beam:0,shaft:.4,bounce:0,icePath:0,fog:"#16234c",fogD:.0026,exposure:1.6,horizon:"#2a4078",zenith:"#081230",portal:"#cfe0ff",sky:{preset:"night",zenith:"#040a1e",mid:"#0c1c44",horizon:"#1c3468",ground:"#0a1430",clouds:!1,clouds2:!1,milkyWay:.8,bodies:[{elevation:31,azimuth:116,size:2.2,phase:1,intensity:1.1,dark:.03,glow:.22,glowColor:"#a8c0ff"}],key:0},cloudLit:"#8ea4dc",cloudShade:"#1a2850",grade:{saturation:1.08,contrast:1.05,tint:"#eef2ff",shadowTint:"#040a22",vignette:.34,grain:.025}}},Ba=[["#6d7078","#3a3d46","#8a8c90"],["#17181d","#2a2c33","#101116"],["#c9b89a","#d8ccb4","#bfa988"]],Da=[{body:"#8e8f96",belly:"#e9e2d2",wingC:"#5c5f69",trail:"#d5d6da",tip:"#2a2b31",head:"#15161a",beak:"#1a1a1c",tailC:"#55575f"},{body:"#a88a72",belly:"#b79a84",wingC:"#3a3c44",trail:"#f0e9d8",tip:"#e8c63a",head:"#b98f70",beak:"#1a1a1c",tailC:"#d8b830"},{body:"#b84a54",belly:"#c9666c",wingC:"#2e3038",trail:"#e8e6e2",tip:"#24252b",head:"#c2505a",beak:"#2a2a2c",tailC:"#2e3038"}];var Ga={id:"ice-arcade",name:"The Glass Birches",category:"wilderness",weirdness:.15,media:["snow"],async build(a){const m=a.rng,M=a.noise,q=a.vary||{},L=a.quality?.detail??1,C=H0(q.density??1,.7,1.3),$=!!q.rare,v=new r.Scene,S=m.fork("look"),W=q.hour||"any",O=S.pick(["rose","rose","rose","golden","rose","rose","golden","golden","rose","rose","night","night"]),U=W==="golden"?"golden":W==="night"?"night":W==="dawn"||W==="day"?"rose":O,b=S.pick(["clear","clear","dust","shower"]),_=S.pick(["normal","normal","heavy","light"]),E=S.int(0,2),P=S.int(0,2),N=S.chance(.3),x=Ta[U],V=U==="night",n=U==="golden"?-1:1,l=Qo(x.el,x.az*n).clone().normalize(),f=E0+V0+121,h=new Float32Array(f),y=new Float32Array(f),d=m.range(.8,1.2),A=m.range(.85,1.15),T=Math.PI/180,R=t=>n*T*(20-24*d*Y(133,205,t)+(24*d+26*A)*Y(205,300,t));{let t=0,e=0;for(let o=E0;o<f;o++){h[o]=t,y[o]=e;const c=R(o-E0+.5);t+=Math.sin(c),e-=Math.cos(c)}const s=R(0);for(let o=E0-1;o>=0;o--)h[o]=h[o+1]-Math.sin(s),y[o]=y[o+1]+Math.cos(s)}const w=(t,e,s)=>{const o=H0(t+E0,0,f-1.001),c=Math.floor(o),u=o-c,p=h[c+1]-h[c],z=y[c+1]-y[c];return s.x=h[c]+p*u-z*e,s.z=y[c]+z*u+p*e,s.dx=p,s.dz=z,s},Z=(t,e,s)=>{let o=1e18,c=0;for(let B=0;B<f-1;B+=8){const j=h[B]-t,D=y[B]-e,t0=j*j+D*D;t0<o&&(o=t0,c=B)}const u=Math.max(0,c-8),p=Math.min(f-2,c+8);for(let B=u;B<=p;B++){const j=h[B]-t,D=y[B]-e,t0=j*j+D*D;t0<o&&(o=t0,c=B)}const z=h[c+1]-h[c],G=y[c+1]-y[c],F=t-h[c],K=e-y[c];return s.d=c-E0+F*z+K*G,s.lat=-F*G+K*z,s},X=w(220,0,{x:0,z:0}),h0=R(230),d0=Math.cos(h0),g0=Math.sin(h0),r0=220,u0=r0+780,a0=new Float32Array(u0).fill(NaN);for(let t=0;t<f;t++){const e=h[t]-X.x,s=y[t]-X.z,o=Math.round(e*g0-s*d0+220+r0);o>=0&&o<u0&&(a0[o]=(e*d0+s*g0)*n)}{let t=NaN;for(let e=0;e<u0;e++)a0[e]===a0[e]?t=a0[e]:t===t&&(a0[e]=t);for(let e=u0-2;e>=0;e--)a0[e]!==a0[e]&&(a0[e]=a0[e+1])}const n0=0,c0=(t,e,s,o)=>Math.hypot((t-94)/31,(e+14)/46)+.06*M.n2(s/15,o/15),q0=(t,e,s,o)=>{let c=n0+2.1+1.25*M.fbm2(t/90,e/90,3)+.3*M.n2(t/21,e/21);const u=t-X.x,p=e-X.z,z=u*g0-p*d0+220,G=H0(z+r0,0,u0-1.001),F=Math.floor(G),K=(u*d0+p*g0)*n-(a0[F]+(a0[F+1]-a0[F])*(G-F)),B=Y(55,150,K)*(.3+.7*Y(40,150,z)*(1-.55*Y(330,470,z)));return c+=22*B*(.8+.25*M.n2(t/60,e/60)),c+=9*Y(170,420,-K)*(.6+.4*M.n2(t/110,e/110)),n0+(c-n0)*Y(.97,1.32,c0(s,o,t,e))},i={x:0,z:0,dx:0,dz:0},i0={d:0,lat:0},Gt=new Float32Array(f);{const t=new Float32Array(f);for(let e=0;e<f;e++)t[e]=q0(h[e],y[e],e-E0,0);for(let e=0;e<f;e++){let s=0,o=0;for(let c=Math.max(0,e-5);c<=Math.min(f-1,e+5);c++)s+=t[c],o++;Gt[e]=s/o}}const m0=t=>{const e=H0(t+E0,0,f-1.001),s=Math.floor(e);return Gt[s]+(Gt[s+1]-Gt[s])*(e-s)},I0=(t,e,s,o)=>P0(m0(s),q0(t,e,s,o*n),Y(3,22,Math.abs(o))),Q0=(t,e)=>(Z(t,e,i0),I0(t,e,i0.d,i0.lat));await a.yield();const Pe=[];for(const[t,e,s]of Zo)w(t,e*n,i),Pe.push([i.x,I0(i.x,i.z,t,e*n)+s,i.z]);const k0=_o(Pe),qa=k0.length,vt=46,At=(t,e,s)=>Y(e,e+.045,t)*(1-Y(s-.045,s,t)),Fe=t=>1+.14*At(t,.1,.28)-.16*At(t,.3,.55)+.05*At(t,.555,.635)-.16*At(t,.64,.77)-.06*At(t,.79,.9),l0=512,pt=new Float32Array(l0+1),C0=new Float32Array(l0+1),tt=new Float32Array(l0+1),Ct=new Float32Array(l0+1),Y0=new Float32Array(l0+1),oe=(t,e,s)=>{for(let o=0;o<=l0;o++){const c=Math.min(s,o,l0-o);let u=0;for(let p=o-c;p<=o+c;p++)u+=t[p];e[o]=u/(2*c+1)}};{let t=0;for(let o=0;o<l0;o++)t+=1/Fe((o+.5)/l0),pt[o+1]=t;for(let o=0;o<=l0;o++)pt[o]*=vt/t;const e=new Float32Array(l0+1),s=new r.Vector3;for(let o=0;o<=l0;o++)k0.pointAt(o/l0,s),Z(s.x,s.z,i0),tt[o]=o?Math.max(tt[o-1]+.001,i0.d):i0.d,Ct[o]=i0.lat*n;for(let o=0;o<=l0;o++)e[o]=tt[o]+go(Jo,o/l0)-f0;oe(e,C0,7);for(let o=1;o<=l0;o++)C0[o]=Math.max(C0[o-1]+.02,C0[o]);for(let o=0;o<=l0;o++)e[o]=go(Xo,o/l0);oe(e,Y0,6);for(let o=0;o<=l0;o++)e[o]=tt[o]+Y0[o];{const o=Math.round(mo[0]*l0),c=Math.round(mo[1]*l0);for(let u=o+1;u<c;u++)e[u]=P0(e[o],e[c],(u-o)/(c-o))}oe(e,Y0,5);for(let o=1;o<=l0;o++)Y0[o]=Math.max(Y0[o-1]+.02,Y0[o])}const Z0=(t,e)=>{const s=H0(e,0,1)*l0,o=Math.min(l0-1,Math.floor(s));return t[o]+(t[o+1]-t[o])*(s-o)},jt=(t,e)=>{if(e<=t[0])return 0;if(e>=t[l0])return 1;let s=0,o=l0;for(;o-s>1;){const c=s+o>>1;t[c]<=e?s=c:o=c}return(s+(e-t[s])/Math.max(1e-6,t[s+1]-t[s]))/l0},mt=t=>Z0(pt,t),U0=t=>Z0(Y0,t),Ie=t=>t<=C0[0]?(t-C0[0])/16:t>=C0[l0]?vt+(t-C0[l0])/16:mt(jt(C0,t)),zo=t=>t<=0?C0[0]+16*t:t>=vt?C0[l0]+16*(t-vt):Z0(C0,jt(pt,t));await a.yield();const et=[],w0=new r.Vector3,y0=new r.Vector3;for(let t=0;t<=300;t++){const e=t/300;Math.abs(Z0(Ct,e))>3.1&&(k0.pointAt(e,w0),et.push(w0.x,w0.z))}const St=(t,e,s)=>{for(let o=0;o<et.length;o+=2){const c=et[o]-t,u=et[o+1]-e;if(c*c+u*u<s*s)return!0}return!1},ae=[],ot=[],s0=m.fork("trees"),Ve=(t,e,s,o,c,u)=>{ae.push({x:t,z:e,dir:s,bow:o,scale:c,release:u.release,light:!!u.light,corr:u.corr,clear:u.clear,whip:u.whip,rag:u.rag}),ot.push([t,e])},N0=(t,e,s,o,c={})=>{w(t,e*n,i);const u=Math.sign(e*n)||1,p=u*i.dz,z=-u*i.dx,G=Math.cos(o),F=Math.sin(o),K=[p*G-z*F,p*F+z*G],B=c.scale??s0.range(.82,1.08),j=H0(13*s,3,12)*B;for(let D=0;D<4;D++)if(St(i.x+K[0]*j*D/3,i.z+K[1]*j*D/3,D?5.5:6.5))return;Ve(i.x,i.z,K,s,B,c)};N0(38,5.7,1,.1,{scale:1.04}),N0(38.6,-5.6,.98,-.08,{scale:1.02}),N0(9,-11,.2,2.6),N0(19,11.5,.3,3.4),N0(27,-14,.55,2.2),N0(14,17.5,.12,4);const ko=Math.round(30*Math.min(1.1,C));for(let t=0;t<ko;t++){const e=s0.range(-34,62),s=s0.sign()*(e<16?s0.range(9.5,44):s0.range(8,44));N0(e,s,s0.chance(.3)?s0.range(.5,.85):s0.range(.05,.4),s0.range(1.7,4.6),{light:Math.abs(s)>13})}for(let t=0;t<14;t++){const e=s0.range(0,6.283),s=s0.range(1.18,1.6),o=94+Math.cos(e)*31*s,c=-14+Math.sin(e)*46*s;Math.abs(c)<9||o>118&&Math.abs(c)<14||N0(o,c,s0.range(.1,.9),s0.range(1.7,4.6),{light:!0})}await a.yield();const Te=(t,e)=>Ie(t-f0)+.016*Math.abs(e)+s0.range(-.1,.7),Mo=(t,e)=>e>0&&wo.some(([s,o])=>t-f0>s-2&&t-f0<o+2),Be=Math.round(18*Math.min(1.15,C));for(let t=0;t<Be;t++){const e=133+(t+s0.range(.1,.9))*(292/Be),s=(t&1?1:-1)*s0.range(8.8,11.4),o=s0.range(.5,.95),c=s0.range(-.45,.45),u=s0.range(.8,1.02),p=Te(e,s);Mo(e,s)||N0(e,s,o,c,{scale:u,release:p})}const De=Math.round(96*Math.min(1.05,C));for(let t=0;t<De;t++){const e=126+(t+s0.range(0,1))*(316/De),s=(t&1?1:-1)*(12.5+33.5*Math.pow(s0(),1.25));if(e>428&&Math.abs(s)<20){s0(),s0(),s0();continue}const o=s0.chance(.4)?s0.range(.7,1.05):s0.chance(.5)?s0.range(.35,.7):s0.range(.05,.3),c=Math.abs(s)<19?s0.range(1.9,4.4):s0.range(0,6.283),u=s0.range(.78,1.12),p=Te(e,s),z=s0();Math.hypot(e-270,s-19)<13||z<-1||N0(e,s,o,c,{light:!0,scale:u,release:p})}let qe=null;{k0.pointAt(.6,w0),k0.tangentAt(.6,y0);const e=Math.hypot(y0.x,y0.z)||1,s=-y0.z/e*n,o=y0.x/e*n;Ve(w0.x-s*6.8,w0.z-o*6.8,[s,o],1.6,1.25,{corr:6.8,clear:6.3,release:mt(.566)-3.175,whip:mt(.632)-mt(.566)+3.175-.95,rag:2.4}),qe=new r.Vector3(w0.x+s*2,w0.y+1.4,w0.z+o*2)}await a.yield();const Ue=[];for(let t=0;t<=V0;t+=5)w(t,0,i),Ue.push([i.x,0,i.z]);const Ao=t=>jt(tt,t),wt=await Yo(a,{palette:po,centerline:Ue,lead:f0,groundAt:Q0,hour:U,load:_,weather:b,sunDir:l,sunSide:n,floor:!1,extraTrees:ae,sunColor:x.sun,sunIntensity:x.sunI,glint:x.glint??1,curtain:.42,shadowLat:96,heraldArc:[55.5,81.5],heraldCam:[18.5,35.3],owlArc:106,skip:(t,e)=>e>0&&wo.some(([s,o])=>t>s&&t<o),releaseAt:Ie,frontAt:zo,timeAtCamArc:t=>mt(Ao(t+f0)),shardBoost:t=>.8+.5*Y(70,100,t)*(1-Y(262,292,t))});v.add(wt.object);const b0=wt.uniforms,at=wt.anchors;V&&b0.uTwigCol.value.lerp(new r.Color("#8f96b4"),.5).multiplyScalar(1.35);for(const t of at.trees)ot.push([t.x,t.z]);await a.yield();const Co=()=>r.UniformsUtils.clone(r.UniformsLib.fog),T0=(t,e,s={},o={})=>new r.ShaderMaterial({uniforms:{...Co(),...b0,...s},vertexShader:t,fragmentShader:e,fog:!0,...o}),Pt={transparent:!0,depthWrite:!1,blending:r.CustomBlending,blendEquation:r.AddEquation,blendSrc:r.OneFactor,blendDst:r.OneMinusSrcAlphaFactor,blendSrcAlpha:r.OneFactor,blendDstAlpha:r.OneMinusSrcAlphaFactor},nt=(t,e)=>{const s=Math.min((t-b0.uFront.value)*.45,b0.uRidge.value);return Math.max(Y(s-1.6,s+1.6,e),b0.uLitAll.value,1-Y(b0.uPre.value-22,b0.uPre.value,t))},Ot=[],ne=[],se=[],re=[],X0={lat:40,k:0};{let t=1,e=0;for(let s=0;s<=400;s++){const o=s/400;o>.45&&o<.9&&Math.abs(Z0(Ct,o))>2.6&&(t=Math.min(t,o),e=Math.max(e,o))}for(let s=t-.012;s<=e+.012;s+=.0025){k0.pointAt(s,w0),k0.tangentAt(s,y0);const o=Math.hypot(y0.x,y0.z)||1;Ot.push(w0.x),ne.push(w0.z),se.push(y0.x/o),re.push(y0.z/o)}}const So=(t,e)=>{let s=1e18,o=0;const c=Ot.length;for(let z=0;z<c;z++){const G=t-Ot[z],F=e-ne[z],K=G*G+F*F;K<s&&(s=K,o=z)}const u=t-Ot[o],p=e-ne[o];return X0.lat=-u*re[o]+p*se[o],(o===0||o===c-1)&&Math.abs(u*se[o]+p*re[o])>.5&&(X0.lat=Math.sign(X0.lat||1)*Math.sqrt(s)),X0.k=Y(0,12,o)*Y(0,12,c-1-o)*(1-Y(7,13,Math.abs(X0.lat))),X0};{const t=[];for(let I=-E0;I<-30;I+=6)t.push(I);for(let I=-30;I<=V0+12;I+=2.5)t.push(I);for(let I=V0+20;I<=V0+118;I+=7)t.push(I);const e=[0,.7,1.4,2.1,3.2,5,8,12,17,24,32,40],s=[5,8,11.5,15,19,23.5,28,33,38,43,48,53,58,64,71],o=[14,34,66,115,190,310,500],c=[],u=[];for(let I=o.length-1;I>=0;I--)c.push([-40,-o[I]]);for(let I=e.length-1;I>=1;I--)c.push([-e[I],0]);for(let I=0;I<5;I++)c.push([e[I],0]);for(const I of s)c.push([I,0]);for(const I of o)c.push([71,I]);for(const[I,v0]of c)u.push([I*n,v0*n]);n<0&&u.reverse();const p=[0,.15,.32,.52,.76,1.05,1.4,1.85,2.4,3.1,4,5.2,6.8,9,12],z=29,G=p.length*z,F=t.length,K=u.length,B=F*K,j=B+G,D=new Float32Array(j*3),t0=new Float32Array(j*2),g=new Float32Array(j*2),k=new Float32Array(j*2),J=new Float32Array(j*3),H=new Float32Array(j*2),p0=[];for(let I=0;I<j;I++)H[I*2]=40;for(let I=0;I<F;I++){(I&7)===7&&await a.yield();for(let v0=0;v0<K;v0++){const Q=I*K+v0,[x0,R0]=u[v0];w(t[I],x0,i);const K0=i.x+d0*R0,B0=i.z+g0*R0;k[Q*2]=i.dx,k[Q*2+1]=i.dz;let D0=t[I],_0=x0;R0!==0&&(Z(K0,B0,i0),D0=i0.d,_0=i0.lat);const kt=c0(D0,_0*n,K0,B0);D[Q*3]=K0,D[Q*3+1]=I0(K0,B0,D0,_0),D[Q*3+2]=B0,t0[Q*2]=D0-f0,t0[Q*2+1]=_0,g[Q*2]=kt,g[Q*2+1]=Y(1,1.3,kt)*(.55+.45*M.n2(K0/40,B0/40)),D0>200&&D0<386&&Math.abs(_0)<62&&(So(K0,B0),H[Q*2]=X0.lat,H[Q*2+1]=X0.k),I&&v0&&p0.push(Q-K-1,Q-K,Q-1,Q-K,Q,Q-1)}}await a.yield();for(let I=0;I<p.length;I++)for(let v0=0;v0<z;v0++){const Q=B+I*z+v0,x0=(v0-(z-1)/2)*1,R0=p[I],K0=2/(2+R0),B0=-36*(1-K0),D0=x0*K0;w(.5,x0,i);const _0=i.x,kt=i.z,uo=I0(_0,kt,.5,x0)-.04-R0;w(I?B0:.5,I?D0:x0,i),D[Q*3]=_0,D[Q*3+1]=uo,D[Q*3+2]=kt,J[Q*3]=i.x-_0,J[Q*3+1]=I0(i.x,i.z,I?B0:.5,I?D0:x0)-uo-(I?0:.04),J[Q*3+2]=i.z-kt,k[Q*2]=i.dx,k[Q*2+1]=i.dz,t0[Q*2]=(I?B0:.5)-f0,t0[Q*2+1]=I?D0:x0,g[Q*2]=c0(B0,D0*n,i.x,i.z),g[Q*2+1]=.55+.45*M.n2(i.x/40,i.z/40),I&&v0&&p0.push(Q-z-1,Q-z,Q-1,Q-z,Q,Q-1)}const o0=new r.BufferGeometry;o0.setAttribute("position",new r.BufferAttribute(D,3)),o0.setAttribute("aUV",new r.BufferAttribute(t0,2)),o0.setAttribute("aM",new r.BufferAttribute(g,2)),o0.setAttribute("aT",new r.BufferAttribute(k,2)),o0.setAttribute("aOff",new r.BufferAttribute(J,3)),o0.setAttribute("aF",new r.BufferAttribute(H,2)),o0.setIndex(p0),await a.yield(),o0.computeVertexNormals();{const I=o0.attributes.normal.array;for(let v0=B;v0<j;v0++)I[v0*3]=0,I[v0*3+1]=1,I[v0*3+2]=0}await a.yield(),w(95,0,i);const S0=Math.hypot(l.x,l.z)||1,$0=[];{const I=w(119,4*n,{x:0,z:0}),v0=[];for(const[Q,x0]of ot){Z(Q,x0,i0);const R0=c0(i0.d,i0.lat*n,Q,x0);R0>.9&&R0<1.5&&v0.push([Math.hypot(Q-I.x,x0-I.z),Q,x0])}v0.sort((Q,x0)=>Q[0]-x0[0]);for(let Q=0;Q<8;Q++){const x0=v0[Q];$0.push(x0?new r.Vector4(x0[1],x0[2],7.5,.2):new r.Vector4(0,0,0,.001))}}const ut=b0.uSunCol.value,F0=.2126*ut.r+.7152*ut.g+.0722*ut.b,A0=new r.Mesh(o0,T0($o,ta,{uSnowSun:{value:ut.clone().lerp(new r.Color(F0,F0,F0),x.snowWhite??.42)},uTrunk:{value:$0},uHorizon:{value:new r.Color(x.horizon)},uZenith:{value:new r.Color(x.zenith)},uIceCol:{value:new r.Color(V?"#0b1838":"#0f2550")},uGnd:{value:new r.Vector4(at.arcLength,.6,V?.5:1,V?.75:1)},uLook:{value:new r.Vector4(V?.7:.86,x.shaft,V?.5:1,x.icePath)},uDir:{value:new r.Vector4(l.x/S0,l.z/S0,i.dz*n,-i.dx*n)}},{side:r.DoubleSide}));A0.frustumCulled=!1,A0.renderOrder=-10,v.add(A0)}await a.yield();const gt={rng:m,...x.sky,bake:!0,renderer:a.renderer};V||(gt.sunElevation=x.el,gt.sunAzimuth=x.az*n),gt.bodies&&(gt.bodies=gt.bodies.map(t=>({...t,azimuth:t.azimuth*n})));const Ft=Eo(gt);v.add(Ft.object),v.fog=new r.FogExp2(x.fog,x.fogD),await a.yield();const st=b0.uSunCol.value,rt=b0.uSkyCol.value,ie=Math.max(st.r,st.g,st.b,.001),le=Math.max(rt.r,rt.g,rt.b,.001),Ne=ie*1.2,It=new r.DirectionalLight(st.clone().multiplyScalar(1/ie),Ne);It.position.copy(l).multiplyScalar(200).add(new r.Vector3(X.x,0,X.z)),It.target.position.set(X.x,0,X.z);const Po=new r.HemisphereLight(rt.clone().multiplyScalar(1/le),rt.clone().multiplyScalar(.55/le).lerp(st.clone().multiplyScalar(.25/ie),.3),le*1.9);v.add(It,It.target,Po),await a.yield();const We=[],Rt=m.fork("bank");for(let t=0;t<6;t++)We.push([X.x-n*(500+t*260+Rt.range(0,120)),Rt.range(-10,30)-34,X.z-Rt.range(1500,2100),Rt.range(360,620)]);const Le=Ho({rng:m,sky:Ft,at:We,puffs:30,height:.36,wind:[n*5,0,-1.5],fogFade:.06,opacity:.9,litColor:x.cloudLit,shadeColor:x.cloudShade,renderOrder:-.95});v.add(Le.object),await a.yield();const Kt=new r.Color(x.fog);{const t=new r.CylinderGeometry(600,600,46,96,1,!0),e=new r.Mesh(t,new r.ShaderMaterial({vertexShader:pa,fragmentShader:ma,side:r.BackSide,uniforms:{uLow:{value:Kt.clone().multiplyScalar(.5).lerp(b0.uDeep.value,.35)},uTop:{value:Kt.clone().multiplyScalar(.6).add(st.clone().multiplyScalar(V?.05:.16))},uHaze:{value:Kt}}}));e.position.set(X.x,n0+22,X.z),e.frustumCulled=!1,v.add(e)}const Vt=new r.Mesh(new r.CylinderGeometry(2600,2600,760,96,1,!0),new r.ShaderMaterial({vertexShader:wa,fragmentShader:ga,side:r.BackSide,depthWrite:!1,transparent:!0,blending:r.CustomBlending,blendEquation:r.AddEquation,blendSrc:r.OneFactor,blendDst:r.OneMinusSrcAlphaFactor,blendSrcAlpha:r.OneFactor,blendDstAlpha:r.OneMinusSrcAlphaFactor,uniforms:{uLitC:{value:st.clone().multiplyScalar(V?.5:.3).add(rt.clone().multiplyScalar(.42))},uShadeC:{value:rt.clone().multiplyScalar(.62).add(b0.uDeep.value.clone().multiplyScalar(.25))},uHazeC:{value:Kt.clone().lerp(new r.Color(x.horizon),V?.3:.45)},uTimber:{value:b0.uDeep.value.clone().multiplyScalar(.3)},uMt:{value:new r.Vector4(((Math.PI-n*T*x.mtAz)/(2*Math.PI)%1+1)%1,((Math.PI-n*T*x.az)/(2*Math.PI)%1+1)%1,.66,.1)}}}));Vt.frustumCulled=!1,Vt.renderOrder=-.9,Vt.position.set(X.x,n0+300,X.z),v.add(Vt),await a.yield();{const t=m.fork("wood"),e=[],s=[],o=Math.round(330*(.6+.4*L));for(let p=0;p<o;p++){const z=p%9===0,G=z?t.range(V0+45,V0+115):t.range(-70,V0+100),F=z?t.range(-70,70):t.sign()*(56+250*Math.pow(t(),1.7)),K=t.range(26,44),B=t.range(14,19.5),j=t.range(-.45,.45),D=t();if(c0(G,F*n,0,0)<1.3)continue;w(G,F,i);const t0=i.x,g=i.z,k=Math.atan2(-i.dz,i.dx)+(z?Math.PI/2:0)+j;e.push(t0,I0(t0,g,G,F)-.4,g,k),s.push(K,B,D,G-f0-F*.35*n)}const c=new r.InstancedBufferGeometry;c.setAttribute("position",new r.Float32BufferAttribute([-.5,0,0,.5,0,0,.5,1,0,-.5,1,0],3)),c.setIndex([0,1,2,0,2,3]),c.setAttribute("aI0",new r.InstancedBufferAttribute(new Float32Array(e),4)),c.setAttribute("aI1",new r.InstancedBufferAttribute(new Float32Array(s),4)),c.instanceCount=e.length/4;const u=new r.Mesh(c,T0(ya,xa,{},{...Pt,side:r.DoubleSide}));u.frustumCulled=!1,u.renderOrder=.5,v.add(u)}await a.yield();const Fo=z0.makeWind({direction:[-d0*n,-g0*n],strength:.45});await a.yield();const Ge={size:512};await z0.prepareLeafTexture(Ge,a.yield);const Io=z0.makeLeafTexture(Ge);await a.yield();const ce=z0.windMaterial({wind:Fo,map:Io,backlight:.25,backlightTint:"#ffd9b8",ambient:1.6,leafAmbient:1.5,sheen:.15});await a.yield();const Tt=m.fork("conifers"),_t={leaf:"#1c3a30",leafLight:"#2c5544",leafDark:"#0f211d",bark:"#3a2c26",snow:.35,snowColor:"#cfd6ea"},je=[z0.coniferGeometry({rng:Tt,detail:1,height:13,..._t})];await a.yield(),je.push(z0.coniferGeometry({rng:Tt,detail:1,height:10,slim:1.3,..._t})),await a.yield();const Vo=[z0.coniferGeometry({rng:Tt,detail:0,height:13,..._t}),z0.coniferGeometry({rng:Tt,detail:0,height:10,slim:1.3,..._t})];await a.yield();const Oe=(t,e)=>(Z(t,e,i0),c0(i0.d,i0.lat*n,t,e)),Re=C<=1.06?C:Math.max(.75,1.06-1.7*(C-1.06)),Ke=z0.makeScatter({rng:Tt,path:k0,heightAt:Q0,material:ce,variants:je,farVariants:Vo,farDistance:75,count:Math.round(88*Re*(.6+.4*L)),radius:250,corridor:42,spacing:1.6,scale:[.7,1.3],falloff:.25,tint:.1,density:(t,e)=>Oe(t,e)<1.12?0:i0.lat*n>55?.8:M.n2(t/34+7,e/34)>.22?1:.05});v.add(Ke.object),await a.yield();const Et=m.fork("farbirch"),fe={detail:0,foliage:!1,bark:"#ddd8d2",barkDark:"#3a3438"},_e=z0.makeScatter({rng:Et,path:k0,heightAt:Q0,material:ce,variants:[z0.birchGeometry({rng:Et,height:15,...fe}),z0.birchGeometry({rng:Et,height:12,...fe}),z0.birchGeometry({rng:Et,height:13.5,...fe})],count:Math.round(58*Re*L),radius:150,corridor:48,spacing:1.2,scale:[.8,1.25],falloff:.35,tint:.08,density:(t,e)=>Oe(t,e)<1.15?0:1});v.add(_e.object),await a.yield();const W0=m.fork("snags"),Ee=[];for(const[t,e]of[[68,15.5],[83,-27],[104,27],[108,-33],[119,18.5],[88,26]])w(t,e*n,i),Ee.push({x:i.x,y:n0-.2,z:i.z,s:W0.range(.5,.85),rot:W0.range(0,6.28),v:W0.int(0,1)});const He=z0.makeScatter({rng:W0,points:Ee,material:ce,variants:[z0.deadTreeGeometry({rng:W0,detail:1,bark:"#6f6a70"}),z0.deadTreeGeometry({rng:W0,detail:1,bark:"#7a7478"})],tint:.05,sink:0});v.add(He.object);const Bt=[];for(const[t,e,s]of[[436.5,9.2,1],[441,11.6,1.1],[445.5,8.8,.92],[448,-13,.8],[301,47,1.05],[311,44,.8],[291,50,.9],[264,38,.7],[243,39,.75],[336,31,.85],[150,-21,.9],[176,25,.8],[200,-27,1],[262,-23,.85],[308,-19,.95],[372,-17,.8],[394,21,.9],[22,-24,.9],[52,27,.8]]){w(t,e*n,i);const o=W0.range(0,6.28);t<430&&St(i.x,i.z,7.5)||Bt.push({x:i.x,y:Q0(i.x,i.z)-.15,z:i.z,s,rot:o,v:0})}const Qe=(t,e,s)=>{k0.pointAt(t,w0),k0.tangentAt(t,y0);const o=Math.hypot(y0.x,y0.z)||1;return s.x=w0.x-y0.z/o*e*n,s.z=w0.z+y0.x/o*e*n,s};for(const[t,e,s]of[[.585,7.6,.34],[.648,8,.4],[.69,7.4,.3],[.728,6.9,.42],[.752,9,.34]])Qe(t,e,i),Bt.push({x:i.x,y:Q0(i.x,i.z)-.1,z:i.z,s,rot:W0.range(0,6.28),v:0});let Ht=0;{const t=U0(.84),e=o=>{let c=1e9;for(let u=0;u<=24;u++){const p=9.4-22.4*u/24,z=t-(p-.8)/1.5+11.3+o;w(z,p*n,i);for(const[G,F]of ot)c=Math.min(c,Math.hypot(G-i.x,F-i.z))}return c};let s=-1;for(const o of[0,.6,-.6,1.2,-1.2,1.8,-1.8,2.4]){const c=e(o);if(c>s+.25&&(s=c,Ht=o),c>1.3)break}$&&(w(t-(10-.8)/1.5+11.3+Ht,10*n,i),Bt.push({x:i.x,y:Q0(i.x,i.z)-.1,z:i.z,s:.36,rot:W0.range(0,6.28),v:0}))}{const t=Sa(W0.fork("spruce")),e=new r.InstancedBufferGeometry,s=[],o=[];e.index=t.index;for(const u in t.attributes)e.setAttribute(u,t.attributes[u]);for(const u of Bt)Z(u.x,u.z,i0),s.push(u.x,u.y-.1,u.z,u.rot),o.push(u.s,Lt(u.x*.37+u.z),i0.d-f0-i0.lat*n*.35,0),ot.push([u.x,u.z]);e.setAttribute("aI0",new r.InstancedBufferAttribute(new Float32Array(s),4)),e.setAttribute("aI1",new r.InstancedBufferAttribute(new Float32Array(o),4)),e.instanceCount=Bt.length;const c=new r.Mesh(e,T0(ca,fa,{},{side:r.DoubleSide}));c.frustumCulled=!1,v.add(c)}await a.yield();{const t=m.fork("rods"),e=[],s=[],o=(B,j,D,t0,g)=>{w(B,j*n,i),e.push(i.x,I0(i.x,i.z,B,j*n)-.03,i.z,t.range(0,6.28)),s.push(t0,g,D+t.range(.02,.98),B-f0-j*.35)},c=Math.round(5400*L*Math.min(1.05,C));for(let B=0;B<c;B++){const j=t.range(-32,V0+26),D=t.sign()*(1.95+13*Math.pow(t(),2.3)),t0=Math.abs(D)>4.6&&t.chance(.22);if(c0(j,D,0,0)<.93||j>V0-3&&Math.abs(D)<4.6){t(),t();continue}if(w(j,D*n,i),t0&&St(i.x,i.z,4.5)){t(),t(),t(),t();continue}t0?o(j,D,2,t.range(.8,1.6),t.range(1.2,2.6)):o(j,D,0,t.range(.45,.95),t.range(.3,.85)),(B&127)===127&&await a.yield()}const u=Math.round(600*L*Math.min(1.05,C));for(let B=0;B<u;B++){const j=t.range(-36,V0+40),D=t.sign()*t.range(8,48);if(w(j,D*n,i),c0(j,D,0,0)<1||j>V0-6&&Math.abs(D)<12||St(i.x,i.z,6.5)){t(),t();continue}o(j,D,2,t.range(1.7,3.4),t.range(2.6,5.2)),(B&127)===127&&await a.yield()}const p=Math.round(1100*L);for(let B=0;B<p;B++){const j=2*Math.floor(t()*(et.length/2)),D=t.range(0,6.283),t0=1.2+12*Math.pow(t(),1.6),g=t.chance(.2),k=et[j]+Math.cos(D)*t0,J=et[j+1]+Math.sin(D)*t0,H=g?t.range(.8,1.6):t.range(.45,.95),p0=g?t.range(1.2,2.4):t.range(.3,.85),o0=t.range(0,6.28),S0=t.range(.02,.98);Z(k,J,i0),!(Math.abs(i0.lat)<7.6||c0(i0.d,i0.lat*n,k,J)<1||g&&St(k,J,4.5))&&(e.push(k,I0(k,J,i0.d,i0.lat)-.03,J,o0),s.push(H,p0,(g?2:0)+S0,i0.d-f0-i0.lat*n*.35),(B&127)===127&&await a.yield())}const z=Math.round(640*L);for(let B=0;B<z;B++){const j=t.range(0,6.283),D=B%3===0,t0=D?t.range(1,1.22):t.range(.9,1.1),g=94+Math.cos(j)*31*t0,k=-14+Math.sin(j)*46*t0;if(Math.abs(k)<(D?5.2:2.2)){t(),t();continue}D?o(g,k,1,t.range(1.6,2.8),t.range(1.7,2.9)):o(g,k,0,t.range(.6,1.1),t.range(.45,.95))}const G=new r.InstancedBufferGeometry,F=Pa();G.index=F.index;for(const B in F.attributes)G.setAttribute(B,F.attributes[B]);G.setAttribute("aI0",new r.InstancedBufferAttribute(new Float32Array(e),4)),G.setAttribute("aI1",new r.InstancedBufferAttribute(new Float32Array(s),4)),G.instanceCount=e.length/4;const K=new r.Mesh(G,T0(ea,oa,{},{...Pt,side:r.DoubleSide}));K.frustumCulled=!1,K.renderOrder=1,v.add(K)}await a.yield();{const t=m.fork("ash"),e=Ca(t),s=[[41,-7.2],[33,8.8],[47,10.6],[61,-9],[65,12],[57,17],[92,31.5],[106,27.5],[121.5,-9.5],[126,11.8],[117.5,-17],[232,19],[250,30],[297,26],[323,23]];for(const[D,t0]of[[.572,6.4],[.642,-5.4],[.668,11.5],[.712,12.5]])Qe(D,t0,i),Z(i.x,i.z,i0),s.push([i0.d,i0.lat*n]);const o=[],c=[],u=[],p=[];for(const[D,t0]of s){w(D,t0*n,i);const g=Q0(i.x,i.z)-.05,k=t.range(0,6.28),J=t.range(.85,1.15),H=t();o.push(i.x,g,i.z,k),c.push(J,H,D-f0-t0*.35,0),ot.push([i.x,i.z]),D>55&&D<130&&(u.push(i.x,g,i.z,k),p.push(J,H,D-f0-t0*.35,0))}const z=(D,t0)=>{const g=new r.InstancedBufferGeometry;g.index=e.index;for(const k in e.attributes)g.setAttribute(k,e.attributes[k]);return g.setAttribute("aI0",new r.InstancedBufferAttribute(new Float32Array(D),4)),g.setAttribute("aI1",new r.InstancedBufferAttribute(new Float32Array(t0),4)),g.instanceCount=D.length/4,g},G=w(94,-14*n,{x:0,z:0,dx:0,dz:0}),F={value:new r.Color(po[6])},K={value:new r.Vector4(G.x,G.z,G.dx,G.dz)},B=new r.Mesh(z(o,c),T0(yo,xo,{uRed:F,uMir:{value:new r.Vector4(0,n0,0,0)},uPondC:K},{side:r.DoubleSide}));B.frustumCulled=!1,v.add(B);const j=new r.Mesh(z(u,p),T0(yo,xo,{uRed:F,uMir:{value:new r.Vector4(1,n0,0,0)},uPondC:K},{side:r.DoubleSide,depthTest:!1,depthWrite:!1,blending:r.CustomBlending,blendEquation:r.AddEquation,blendSrc:r.OneFactor,blendDst:r.OneMinusSrcAlphaFactor,blendSrcAlpha:r.OneFactor,blendDstAlpha:r.OneMinusSrcAlphaFactor}));j.frustumCulled=!1,j.renderOrder=-9,v.add(j)}await a.yield();const To=b0.uSunCol.value.clone().multiplyScalar(x.bounce),it=(t,e,s)=>{const o=new r.InstancedBufferGeometry;o.index=t.index;for(const F in t.attributes)o.setAttribute(F,t.attributes[F]);const c=new r.InstancedBufferAttribute(new Float32Array(e*4),4),u=new r.InstancedBufferAttribute(new Float32Array(e*4),4),p=new r.InstancedBufferAttribute(new Float32Array(e*3),3);s.dynamic!==!1&&(c.setUsage(r.DynamicDrawUsage),u.setUsage(r.DynamicDrawUsage)),o.setAttribute("aI0",c),o.setAttribute("aI1",u),o.setAttribute("aTint",p),o.instanceCount=e;const z=new r.Mesh(o,T0(aa,na,{uGait:{value:new r.Vector4(...s.gait||[0,0,0,0])},uAmp:{value:new r.Vector4(...s.amp||[0,0,0,0])},uBob:{value:new r.Vector4(...s.bob||[0,0,0,0])},uScale:{value:s.scale??1},uWeave:{value:s.weave??0},uCoat:{value:new r.Vector4(...s.coat||[0,0,0,0])},uDark:{value:new r.Color(s.dark||"#10131f")},uFur:{value:new r.Vector4(...s.fur||[.3,.6,.3,.02])},uBounce:{value:To}},{side:r.DoubleSide}));z.frustumCulled=!1,v.add(z);const G=new r.Color;return{mesh:z,set(F,K,B,j,D,t0,g,k,J){const H=c.array,p0=u.array,o0=F*4;H[o0]=K,H[o0+1]=B,H[o0+2]=j,H[o0+3]=D,p0[o0]=t0,p0[o0+1]=g,p0[o0+2]=k,p0[o0+3]=J,c.needsUpdate=!0,u.needsUpdate=!0},tint(F,K,B=1){G.set(K).multiplyScalar(B),p.array[F*3]=G.r,p.array[F*3+1]=G.g,p.array[F*3+2]=G.b,p.needsUpdate=!0}}},Dt=Math.PI*2,Qt=m.fork("cast"),Bo=ba();await a.yield();const Ye=it(Bo,6,{gait:[0,.7,Math.PI+.35,Math.PI+1.05],amp:[.6,.66,.9,.055],bob:[.045,.02,.085,.47],scale:1.16,dark:"#14151c",fur:[.34,1,.3,.03],coat:[1,.45,1,0]}),Ze=[],Xe=[];for(let t=0;t<6;t++)Ye.tint(t,Ba[E][Qt.int(0,2)],Qt.range(.85,1.1)),Ze.push(Qt.range(0,Dt)),Xe.push(Qt.range(-.12,.12));const Do=[3.5,5.8,8.1],qo=3.3;await a.yield();const Je=it(ka(),1,{dark:"#15171f",fur:[.22,.5,.3,.09],weave:1});Je.tint(0,"#8a7f6a"),await a.yield();const he=it(bo(N?Ia:Fa),1,{gait:[0,.15,Math.PI-.3,Math.PI-.1],amp:[1,.75,1.1,.16],bob:[N?.1:.17,.03,.03,N?.3:.2],scale:N?1.45:1.65,dark:"#14100f",fur:[.3,1.2,.2,.05]});he.tint(0,N?"#b4521c":"#dfe6f2"),await a.yield();const Yt=it(bo(Va),1,{gait:[0,.2,Math.PI-.35,Math.PI-.1],amp:[.95,.85,1,.15],bob:[.3,.05,.02,.57],scale:1.55,dark:"#1c1613",fur:[.55,1.3,.3,.03],coat:[1,.7,1,0]});Yt.tint(0,"#94846f"),Yt.mesh.visible=$,await a.yield();const ue=it(za(),1,{amp:[.78,.12,0,0],scale:1.95,dark:"#d9d2c4",fur:[.55,1.1,.01,.05],coat:[.8,.6,1,12]});ue.tint(0,"#5c544c"),await a.yield();const J0=w(92,-14*n,{x:0,z:0}),Zt=new r.Vector3(J0.x,n0+2.6,J0.z);{const t=m.fork("lodge"),e=it(Ma(t),1,{dynamic:!1,fur:[.7,.3,.5,0]});e.set(0,J0.x,n0-.05,J0.z,t.range(0,6.28),0,0,0,92-f0),e.tint(0,"#2a1d17");const s=170,o=it(Aa(),s,{dynamic:!1,fur:[.6,.5,.2,0]}),c=[[0,3.6],[.45,3.2],[1.1,2.5],[1.75,1.7],[2.2,.95],[2.5,.25]];for(let u=0;u<s;u++)if(u<86){const p=t.range(.05,2.45),z=t.range(0,6.28);let G=.3;for(let F=0;F<5;F++)p>=c[F][0]&&p<=c[F+1][0]&&(G=P0(c[F][1],c[F+1][1],(p-c[F][0])/(c[F+1][0]-c[F][0])));o.set(u,J0.x+Math.cos(z)*(G+.05),n0+p+.05,J0.z+Math.sin(z)*(G+.05),Math.atan2(Math.cos(z),Math.sin(z))+t.range(-.9,.9),0,t.range(.15,.8),0,92-f0),o.tint(u,t.chance(.25)?"#8f7a5c":"#3a2a20",t.range(.6,1.2))}else if(u<156){const p=P0(.95,2.2,(u-86)/70)+t.range(-.03,.03),z=1+t.range(-.02,.03),G=94+Math.cos(p)*31*z,F=-14+Math.sin(p)*46*z;w(G,F*n,i),o.set(u,i.x,n0+t.range(.05,.9),i.z,t.range(0,6.28),0,t.range(-.5,.5),0,G-f0),o.tint(u,t.chance(.2)?"#8f7a5c":"#33261e",t.range(.6,1.2))}else{const p=u<163,z=t.range(0,6.28),G=t.range(4.2,8);p?w(t.range(72,116),t.sign()*t.range(2.6,5.5),i):(i.x=J0.x+Math.cos(z)*G,i.z=J0.z+Math.sin(z)*G),o.set(u,i.x,n0+.035,i.z,t.range(0,6.28),0,0,0,92-f0),o.tint(u,"#c9b48a",t.range(.8,1.1))}}await a.yield();const Xt=33,j0=new Float32Array(Xt*2*3),de=new Float32Array(Xt*2*3),lt=new r.BufferGeometry,$e={value:1};{const t=new Float32Array(Xt*2),e=[];for(let p=0;p<Xt;p++)t[p*2]=-1,t[p*2+1]=1;const s=p=>e.push(p*2,p*2+1,p*2+2,p*2+1,p*2+3,p*2+2);for(let p=0;p<8;p++)s(p);for(let p=0;p<12;p++)s(9+p*2);const o=new r.BufferAttribute(j0,3),c=new r.BufferAttribute(de,3);o.setUsage(r.DynamicDrawUsage),c.setUsage(r.DynamicDrawUsage),lt.setAttribute("position",o),lt.setAttribute("aTan",c),lt.setAttribute("aSide",new r.BufferAttribute(t,1)),lt.setIndex(e);const u=new r.Mesh(lt,T0(da,va,{uW:{value:.024},uLineCol:{value:new r.Color("#1d2238")},uLit:$e},{side:r.DoubleSide}));u.frustumCulled=!1,v.add(u)}const qt=(t,e,s,o)=>{const c=t*6;j0[c]=j0[c+3]=e,j0[c+1]=j0[c+4]=s,j0[c+2]=j0[c+5]=o},ve=(t,e)=>{for(let s=t;s<=e;s++){const o=Math.max(t,s-1)*6,c=Math.min(e,s+1)*6,u=s*6;for(let p=0;p<3;p++)de[u+p]=de[u+3+p]=j0[c+p]-j0[o+p]}},pe=98,Ut=new Float32Array(pe*4),Jt=new Float32Array(pe*4),yt=new r.InstancedBufferGeometry;yt.setAttribute("position",new r.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),yt.setIndex([0,1,2,0,2,3]);const me=new r.InstancedBufferAttribute(Ut,4),we=new r.InstancedBufferAttribute(Jt,4);me.setUsage(r.DynamicDrawUsage),we.setUsage(r.DynamicDrawUsage),yt.setAttribute("aP",me),yt.setAttribute("aC",we),yt.instanceCount=pe;const ge=new r.Mesh(yt,T0(sa,ra,{},Pt));ge.frustumCulled=!1,ge.renderOrder=4,v.add(ge);const ct=[],to=25,eo=[-1.7,-1.05,-.55,0,.55,1.05,1.7],Uo=[.07,.19,.33],xt=new r.BufferGeometry,oo={value:new r.Vector4(0,0,1,0)};{const t=[],e=eo.length;for(let c=0;c<3;c++)for(let u=0;u<to;u++)for(let p=0;p<e;p++)if(ct.push(-2+u*.5,eo[p],c/2),u&&p){const z=(c*to+u)*e+p;t.push(z-e-1,z-e,z-1,z-e,z,z-1)}const s=new r.BufferAttribute(new Float32Array(ct.length),3);s.setUsage(r.DynamicDrawUsage),xt.setAttribute("position",s),xt.setAttribute("aA",new r.Float32BufferAttribute(ct,3)),xt.setIndex(t);const o=new r.Mesh(xt,T0(ia,la,{uWake:oo},{...Pt,side:r.DoubleSide}));o.frustumCulled=!1,o.renderOrder=3.5,v.add(o)}const bt=(t,e,s,o,c,u,p)=>{const z=t*4;Ut[z]=e,Ut[z+1]=s,Ut[z+2]=o,Ut[z+3]=c,Jt[z]=u,Jt[z+1]=p,Jt[z+2]=Lt(t*3.7)};await a.yield();const ye={value:0},ao=V?["#cfdcff","#ffffff","#9fb6ff"]:["#ffe2d6","#fff4e2","#ffd9a8"],xe=b==="shower"?vo.makeParticles({rng:m.fork("air"),preset:"snow",time:ye,count:Math.round(2600*L),box:[38,18,38],velocity:[-n*1.4,-1.5,.3],colors:ao,intensity:V?.8:1.25,size:[.045,.11]}):vo.makeParticles({rng:m.fork("air"),preset:"dust",time:ye,count:Math.round((b==="dust"?2600:500)*L),box:[38,V?16:b==="dust"?7.5:5.5,38],velocity:[-n*.25,-.22,.05],colors:ao,intensity:V?1.2:b==="dust"?1.7:1.3,size:[.016,.045],twinkle:.9});v.add(xe.object);const No=b==="shower";await a.yield();{const t=m.fork("beams"),e=Math.round(280*L),s=new Float32Array(e*4),o=new Float32Array(e*4);for(let F=0;F<e;F++){const K=t.chance(.82)?t.range(128,430):t.range(-30,58),B=t.range(-12,12),j=t.range(1.1,4.6),D=Math.min(t.range(13,28),(j-.4)*2/Math.max(.05,l.y)),t0=t.range(.5,1.5);w(K,B,i);const g=I0(i.x,i.z,K,B)+j;s.set([i.x+l.x*D*.5,g+l.y*D*.5,i.z+l.z*D*.5,D],F*4),o.set([t0,t(),K-f0-B*n*.35,j],F*4)}const c=new r.InstancedBufferGeometry,u=[],p=[],z=8;for(let F=0;F<=z;F++)if(u.push(-.5,F/z,0,.5,F/z,0),F){const K=F*2;p.push(K-2,K-1,K,K-1,K+1,K)}c.setAttribute("position",new r.Float32BufferAttribute(u,3)),c.setIndex(p),c.setAttribute("aB0",new r.InstancedBufferAttribute(s,4)),c.setAttribute("aB1",new r.InstancedBufferAttribute(o,4)),c.instanceCount=e;const G=new r.Mesh(c,T0(ha,ua,{uBeam:{value:new r.Vector4(x.beam,1,0,0)}},{...Pt,side:r.DoubleSide}));G.frustumCulled=!1,G.renderOrder=2.6,G.visible=x.beam>0,v.add(G)}await a.yield();const no=Se.makeFauna(v,{light:Se.lightFrom(v)}),ft=m.fork("birds"),so=[.03,.13,.26,.36,.53,.62,.71,.86,.94];for(let t=0;t<so.length;t++){const e=Math.max(3,Math.round(ft.range(5,8)*C));no.add(Se.makeFlock({rng:ft,species:"crows",count:e,size:.46,speed:ft.range(6,8),flap:9,amp:.8,glide:.5,spread:[3.2,1.3,5],wander:[1.3,1,1.1,1.3],palette:Da[P],rim:.6,cross:{path:k0,u:so[t],lead:t===0?17:ft.range(12,17),span:54,angle:ft.range(55,100),side:ft.sign(),height:t===0?2:ft.range(.8,2.6),duration:vt,sag:1.2}})),await a.yield()}await a.yield();const L0=new r.Vector3,Nt=new r.Vector3,be=new r.Vector3,O0=new r.Vector3,Wo=new r.Vector3,ze=new r.Vector3,Lo=new r.Vector3,Go=at.heralds[0].curtain.clone(),jo=at.heralds[1].curtain.clone(),ht=.467,$t=Math.max(ht-.068,Math.min(ht-.05,jt(pt,at.owlLiftTime))),Wt=at.owlPerch.clone(),zt=new r.Vector3,te=new r.Vector3;{k0.pointAt(ht,w0),k0.tangentAt(ht,y0);const t=Math.hypot(y0.x,y0.z)||1,e=y0.x/t,s=y0.z/t,o=s*n,c=-e*n;zt.set(w0.x+e*4.6+o*.4,w0.y+.6,w0.z+s*4.6+c*.4),te.set(w0.x-e*5+o*7.5,w0.y+3.6,w0.z-s*5+c*7.5)}const ee=(t,e)=>{const s=H0((t-$t)/((ht-$t)/.671),0,1.35),o=Math.pow(s,1.2),c=(o-.62)*(o-1)/.62,u=o*(o-1)/(.62*-.38),p=o*(o-.62)/.38;return e.set(Wt.x*c+zt.x*u+te.x*p,Wt.y*c+zt.y*u+te.y*p,Wt.z*c+zt.z*u+te.z*p),s},ke=.8,ro=U0(ke),io=ro+11.5,Me=(t,e)=>{const s=U0(t),o=s-ro;return o<=0?(e.x=io,e.y=6.3,0):(e.x=s+11.5-2.4*Y(0,8,o)+8*Y(15,31,o),e.y=6.3-1.3*Y(0,7,o)-23*Y(27,47,o),Y(0,1.2,o))},lo=U0(.84),Ae=10.7+Ht,co=9.4,fo=t=>.8-1.5*(t-lo),Ce=(t,e)=>{const s=U0(t);return e.x=s+Ae,e.y=fo(s),e.y};w(95,0,i);const Oo=i.dz*n,Ro=-i.dx*n,M0={x:0,z:0,dx:0,dz:0},ho=w(127,1.5*n,{x:0,z:0}),Ko=new r.Vector3(ho.x,m0(127)+4.5,ho.z);return await Ft.prewarm(a.renderer,null,v),{scene:v,path:k0,duration:vt,pace:Fe,title:"The Glass Birches",ride:"none",style:"none",camera:{fov:64,near:.3,far:4e3,lookAhead:22,sway:.5,bank:.6},pois:[{at:(t,e)=>{const s=U0(e)+3;return w(s,0,M0),ze.set(M0.x,m0(s)+1.3,M0.z)},from:.1,to:.27,weight:.5},{at:Zt,from:.09,to:.24,weight:.2},{at:Ko,from:.21,to:.31,weight:.3},{at:(t,e)=>{const s=Z0(tt,e)+30;return w(s,0,M0),Lo.set(M0.x,m0(s)+8.5,M0.z)},from:.27,to:.56,weight:.3},{at:Go,from:.29,to:.4,weight:.35},{at:jo,from:.365,to:.455,weight:.3},{at:(t,e)=>(ee(e,O0),O0),from:$t-.01,to:ht+.012,weight:.4},{at:(t,e)=>{const s=U0(e)+4;return w(s,0,M0),ze.set(M0.x,m0(s)+2,M0.z)},from:.44,to:.575,weight:.4},{at:qe,from:.53,to:.61,weight:.3},{at:(t,e)=>{const s=Z0(C0,e)+f0-27;return w(s,0,M0),Wo.set(M0.x,m0(s)+4.2,M0.z)},from:.6,to:.8,weight:.7},{at:(t,e)=>{const s=U0(e)+5.5;return w(s,0,M0),ze.set(M0.x,m0(s)+.8,M0.z)},from:.74,to:.83,weight:.5}],portal:{shape:"arch",width:9,height:14,color:x.portal,glow:1,revealDistance:260},post:{exposure:x.exposure,bloom:{strength:.42,radius:.35,threshold:.95},grade:x.grade},info:{camD:tt,camQ:Ct,sledT:Y0,Ft:C0,Tt:pt,sledAt:U0,trackPos:w,profAt:m0,groundAt:Q0,treeFeet:ot,extraTrees:ae,heroTrees:at.trees,uLift:$t,uCross:ht,owlAt:ee,runAt:Me,lynxAt:Ce,lynxShift:Ht,sd:n,LEAD:f0},update(t,e,s,o){ye.value=e;const c=U0(o),u=c-f0,p=Y(0,.004,o);No&&xe.setOpacity(1-.75*Y(.42,.5,o)*(1-Y(.88,.96,o))),b0.uFull.value=Y(5.5,9,Math.abs(Z0(Ct,o))),wt.setTime(mt(o)),wt.update(t,e,s),It.intensity=Ne*(b0.uLitAll.value>.5?1:1-.78*Y(.27,.32,o)*(1-Y(.44,.5,o))),Ft.update(t,e,s),Le.update(t,e,s),xe.update(t,e,s),Ke.update(t,e,s),_e.update(t,e,s),He.update(t,e,s),no.update(t,e,s,o),s.getWorldPosition(be),Vt.position.set(be.x,n0+300,be.z),w(c,0,i),Je.set(0,i.x,m0(c)+.006*Math.sin(e*13)*p,i.z,Math.atan2(i.dx,i.dz),0,Math.atan((m0(c+1.5)-m0(c-1))/2.5),0,u);const z=g=>m0(c+g)+P0(.27,.47,(g-2.67)/5.6)+.015*Math.sin(e*11+g*2)*p;for(let g=0;g<9;g++){const k=2.67+5.6*g/8;w(c+k,0,i),qt(g,i.x,z(k),i.z)}ve(0,8);let G=0;for(let g=0;g<6;g++){const k=g&1?1:-1,J=Do[g>>1]+Xe[g],H=c+J,p0=k*.33+.03*Math.sin(e*.8+g*2.1);w(H,p0,i),Ye.set(g,i.x,m0(H)-.025,i.z,Math.atan2(i.dx,i.dz),H/qo*Dt+Ze[g],Math.atan(m0(H+.5)-m0(H-.5)),p,H-f0);const o0=9+g*2,S0=21+g*2;w(H-.46,p0*.85,i),qt(o0,i.x,m0(H)+.66,i.z),w(H-1.3,0,i),qt(o0+1,i.x,z(J-1.3),i.z),ve(o0,o0+1),w(H+.4,p0*.8,i),qt(S0,i.x,m0(H)+.7,i.z),w(H+.3,0,i),qt(S0+1,i.x,z(Math.min(J+.3,8.27)),i.z),ve(S0,S0+1);const $0=(c0(H,0,0,0)<.93?.35:1)*p,ut=Math.floor(H/.2);for(let F0=0;F0<8;F0++){const A0=(ut-F0)*.2-.15,I=H0((H-.15-A0)/1.6,0,1),v0=Lt(ut-F0+g*17.3);w(A0,p0+k*(.08+.3*I)+(v0-.5)*.22,i),bt(G++,i.x,m0(A0)+.06+.2*I+.05*v0,i.z,.17+.3*I,.5*Math.pow(Math.max(0,1-I),1.2)*Y(0,.12,I)*$0,nt(A0-f0,.4))}for(let F0=0;F0<2;F0++){const A0=(e/.95+g*.37+F0*.5)%1;w(H+.55-9*A0*p,p0+.25*A0*k,i),bt(48+g*2+F0,i.x,m0(H)+.72+.55*A0,i.z,.16+.65*A0,.6*(1-A0)*Y(0,.12,A0),nt(H-f0,.9))}}for(let g=0;g<8;g++){const k=g&1?1:-1,J=((c/2.6+g*.29)%1+1)%1,H=2.5-2.3*J;w(c+H,k*(.4+.5*J),i),bt(90+g,i.x,m0(c+H)+.08+.3*J,i.z,.2+.45*J,.45*(1-J)*Y(0,.1,J)*p*(c0(c,0,0,0)<.93?.3:1),nt(u+H,.3))}{const g=xt.attributes.position.array;for(let k=0,J=ct.length/3;k<J;k++){const H=ct[k*3];w(c+H,ct[k*3+1],i),g[k*3]=i.x,g[k*3+1]=m0(c+H)+Uo[Math.round(ct[k*3+2]*2)],g[k*3+2]=i.z}xt.attributes.position.needsUpdate=!0,oo.value.set(c,p*(c0(c+5,0,0,0)<.93?.4:1),nt(u+5,.3),0)}$e.value=nt(u+5,.4),lt.attributes.position.needsUpdate=!0,lt.attributes.aTan.needsUpdate=!0;const F=Me(o,Nt),K=Nt.x,B=Nt.y,j=o>ke-.1&&o<ke+.14&&B>-16;if(j){w(K,B*n,i);const g=i.x,k=i.z;let J=i.dx,H=i.dz;F>0&&(Me(o+.0015,L0),w(L0.x,L0.y*n,i),J=i.x-g,H=i.z-k),he.set(0,g,I0(g,k,K,B*n)-.02,k,Math.atan2(J,H),K/1.5*Dt,0,F,K-f0-B*.35)}else he.set(0,0,-300,0,0,0,0,0,0);const D=Math.floor(K/1.5);for(let g=0;g<8;g++){const k=(D-g)*1.5,J=(K-k)/12;w(k,B*n,i),bt(60+g,i.x,m0(k)+.1+.4*J,i.z,.2+.7*J,j&&k>io?.85*(1-J)*Y(0,.05,J)*F:0,nt(k-f0,.3))}if($){const g=Ce(o,Nt),k=Nt.x,J=g<co&&g>-13;if(J){w(k,g*n,i);const p0=i.x,o0=i.z;Ce(o+.0015,L0),w(L0.x,L0.y*n,i),Yt.set(0,p0,I0(p0,o0,k,g*n)-.02,o0,Math.atan2(i.x-p0,i.z-o0),(k-lo-Ae)/2.4*Dt+2.24,0,1,k-f0-g*.35)}else Yt.set(0,0,-300,0,0,0,0,0,0);const H=Math.floor(k/2.4);for(let p0=0;p0<8;p0++){const o0=(H-p0)*2.4,S0=(k-o0)/19,$0=fo(o0-Ae);w(o0,$0*n,i),bt(68+p0,i.x,I0(i.x,i.z,o0,$0*n)+.14+.5*S0,i.z,.34+.9*S0,J&&$0<co-.6?.9*(1-S0)*Y(0,.05,S0):0,nt(o0-f0,.3))}}for(let g=0;g<14;g++){const k=(e*.14+g/14)%1,J=Math.sin(g*2.4+e*.6)*.3*k;bt(76+g,Zt.x+Oo*k*k*5+J,Zt.y-.2+5.5*k,Zt.z+Ro*k*k*5+J,.6+2.6*k,.5*(1-k)*Y(0,.12,k),1)}me.needsUpdate=!0,we.needsUpdate=!0;const t0=ee(o,O0);if(t0<1.34){let g=zt.x-Wt.x,k=0,J=zt.z-Wt.z;t0>0&&(ee(o+.002,L0),g=L0.x-O0.x,k=L0.y-O0.y,J=L0.z-O0.z);const H=Y(0,.08,t0);ue.set(0,O0.x,O0.y+.12,O0.z,Math.atan2(g,J),e*Dt*1.9,P0(1.2,H0(Math.atan2(k,Math.hypot(g,J)+1e-4),-.5,.5),H),H,P0(u,b0.uFront.value+1.4,Y(.25,.52,t0)))}else ue.set(0,0,-300,0,0,0,0,0,0)},dispose(){Ft.dispose(),wt.dispose()}}}};export{Ga as default};
