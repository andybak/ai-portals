import*as t from"three";import{mergeGeometries as Lo}from"three/addons/utils/BufferGeometryUtils.js";import{makePath as Xo,makeRng as Bo,hashSeed as Fo,clamp as we,lerp as $,smoothstep as Ie}from"../kit/core.js";import*as Zo from"../kit/water.js";import*as Pe from"../kit/fx.js";import{buildHero as Jo}from"../parts/the-leader.js";const R=(o,n,h)=>new t.Vector3(o,n,h),_e=Math.PI/180,$o={dusk:{band:"#E9E38A",amt:1,cloud:"#394145",fog:"#2b353c",sea:"#0b2a30",deep:"#10424a",exposure:1.45,rim:"#E9E38A",sat:1.02,hemi:1.3,osky:"#32434a"},copper:{band:"#F2A06A",amt:1,cloud:"#3d4058",fog:"#33364a",sea:"#0f2a36",deep:"#12404a",exposure:1.55,rim:"#F2A06A",sat:1.08,hemi:1.3,osky:"#343c52"},dawn:{band:"#F3C6D2",amt:.95,cloud:"#3f4560",fog:"#363b52",sea:"#0f2a38",deep:"#103142",exposure:1.4,rim:"#F3C6D2",sat:1.08,hemi:1.3},day:{band:"#F2FBEF",amt:1,cloud:"#3a4a48",fog:"#36423f",sea:"#0c3a30",deep:"#0e4638",exposure:1.25,rim:"#F2FBEF",sat:1.1,hemi:1.3,seaLit:.45,glint:.35},night:{band:"#9aa6b8",amt:.45,cloud:"#2a3236",fog:"#1e282c",sea:"#0a292d",deep:"#12464c",exposure:1.65,rim:"#8E62FF",sat:.98,hemi:3,osky:"#34474d",seaLit:1.15}};function ea(o,n){const h=o.length,C=[],m=new Array(h);for(let s=0;s<h-1;s++)C.push((n[s+1]-n[s])/(o[s+1]-o[s]));m[0]=C[0],m[h-1]=C[h-2];for(let s=1;s<h-1;s++)m[s]=C[s-1]*C[s]<=0?0:2*C[s-1]*C[s]/(C[s-1]+C[s]);return s=>{if(s<=o[0])return n[0];if(s>=o[h-1])return n[h-1];let S=0,z=h-1;for(;z-S>1;){const B=S+z>>1;o[B]<=s?S=B:z=B}const u=o[z]-o[S],A=(s-o[S])/u,p=A*A,M=p*A;return(2*M-3*p+1)*n[S]+(M-2*p+A)*u*m[S]+(-2*M+3*p)*n[z]+(M-p)*u*m[z]}}const Ge=`
  uniform vec3 uFogC; uniform float uFogD;
  vec3 wfog(vec3 c, float d) { float q = uFogD * d; return mix(uFogC, c, exp(-q * q)); }`,ta=`
  varying vec3 vDir;
  void main() { vDir = position; vec4 mv = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mv; }`,To=`
  vec2 bandAlong(vec2 hz, vec2 bd) {
    float c = dot(hz, bd), sn = hz.y * bd.x - hz.x * bd.y;
    float az = abs(c) + abs(sn) < 1e-4 ? 0. : atan(sn, c);
    return vec2(smoothstep(0., 0.5, c), exp(-(az + 0.17) * (az + 0.17) / 0.4));
  }
  float slotAz(vec2 hz, vec2 bd) {
    float c = dot(hz, bd), sn = hz.y * bd.x - hz.x * bd.y;
    return abs(c) + abs(sn) < 1e-4 ? 0. : atan(sn, c);
  }
  vec4 slotAt(vec2 hz, vec2 bd, float t) {
    float az = slotAz(hz, bd), a1 = az + 0.17;
    float core = exp(-a1 * a1 / 0.4), heart = exp(-a1 * a1 / 0.04);
    float w1 = vnoise(vec2(az * 3.3 + 13.7, t * 0.0015)), w2 = vnoise(vec2(az * 9. + 4.1, 3.3 - t * 0.002));
    float win = smoothstep(0.22, 0.8, w1);
    return vec4(smoothstep(0., 0.5, dot(hz, bd)), core, (0.25 + 0.4 * win + 0.1 * w2) * (0.42 + 0.58 * core) + 0.95 * heart, heart);
  }
  float slotSheen(vec4 sl, float az, float dn, float resY) {    // the slot's light on the far sea: GLITTER (fine dashes a pixel tall, lying along the swell, thick under the heart and sparse either side: never patches)
    float n = vnoise(vec2(az * 80. + 3., dn * clamp(resY * 0.8, 240., 800.)));
    float thr = mix(0.66, 0.5, sl.w), glit = 0.3 + 1.9 * smoothstep(thr, thr + 0.2, n);
    return sl.x * (0.25 * sl.z + 0.5 * sl.w * exp(-dn * 6.)) * exp(-dn * 13.) * 0.22 * glit;
  }
  float farTone(vec2 p, float dn) {                             // the far sea's tone: broad soft lanes of swell a kilometre and more apart (nothing finer: at this range it would be blocks)
    float w = vnoise(p * 0.0008 + 11.);
    float lanes = sin(p.y * 0.0046 + p.x * 0.0011 + w * 5.) * (0.4 + 0.6 * w);
    return 1. + (lanes * 0.24 + (vnoise(vec2(p.x * 0.00045 + 3., p.y * 0.0011 + 7.)) - 0.5) * 0.7) * smoothstep(0.012, 0.08, dn);
  }`,io=`
  float cbPouch(vec2 p) { float n = 2. * vnoise(p) - 1.; return sqrt(n * n + 0.09) * 0.96; }
  vec2 cloudBase(vec2 p, vec2 dr, float far) {               // x = pouch (1 where it hangs lowest), y = the slow tone; far 0..1: far off only the large pouches are drawn
    float a = cbPouch(p * 0.0052 + dr * 0.5 + 3.1), b = cbPouch(p * 0.0118 - dr + 11.7);
    return vec2(mix(0.62 * a + 0.38 * b, a, far), fbmLo(p * 0.0016 + dr * 0.2 + 5.));
  }`,oa=Pe.GLSL_NOISE+To+io+`
  uniform vec3 uCloudC, uBandC, uSeaC, uFogC, uViolet, uCam, uFarSea; uniform float uBandAmt, uTime, uStroke, uFogD, uResY; uniform vec2 uBandDir;
  varying vec3 vDir;
  void main() {
    vec3 d = normalize(vDir + vec3(0., 1e-5, 0.));
    float hl = max(length(d.xz), 1e-4); vec2 hz = d.xz / hl; float el = d.y / hl;
    vec4 sl = slotAt(hz, uBandDir, uTime); float west = sl.x, core = sl.y, A = sl.z, heart = sl.w, amt = min(uBandAmt, 1.);
    float azb = slotAz(hz, uBandDir);
    float n = fbm(hz * 3.2 + vec2(el * 5., uTime * 0.004));
    vec3 cloud = mix(uFogC * 1.2, uCloudC * 1.02, smoothstep(0.02, 0.6, el)) * (0.84 + 0.36 * n);
    // THE CLOUD BASE CARRIED ON beyond the ceiling mesh: the same pouches (CLOUD_GLSL), found where this ray meets the
    // base, so they lie in rows that foreshorten toward the horizon and melt into the rain murk well above the slot
    // (they start 6 degrees up: lower down their rows would read as a far coast of hills over the slot)
    float dc = (770. - uCam.y) / max(d.y, 0.02);
    vec2 pc = uCam.xz + d.xz * dc, dr = vec2(uTime * 0.012, -uTime * 0.008);
    float farK = smoothstep(1100., 2600., dc);                                       // (far off the pouches are drawn broader, so that no row is finer than a pixel)
    vec2 cb = cloudBase(pc, dr, smoothstep(500., 1500., dc));
    float ph = mix(cb.x, cbPouch(pc * 0.0021 + dr * 0.2 + 5.), farK);
    float kc = exp(-dc / 3000.) * smoothstep(0.1, 0.2, d.y);
    vec3 base = uCloudC * (0.68 + 1.05 * ph * ph) * (0.7 + 0.6 * cb.y);
    base += uBandC * uBandAmt * west * (1. - ph) * 0.05 * exp(-el * 3.);          // the creases between the pouches take a little of the slot
    // ... and THE BELLIES ARE LIT FROM BELOW BY THE SLOT, green-grey, most over its heart and low in the west, less and
    // less up the sky: from the pull-out to the portal the base is rows of lit pouches over slate creases
    base += mix(uBandC, uCloudC * 1.7, 0.6) * uBandAmt * west * (0.35 + 0.65 * core) * exp(-el * 2.) * 0.8 * ph * ph;
    cloud = mix(cloud, base, kc);
    // THE SLOT: LIGHT UNDER A CLOUD BASE, SEEN THROUGH WEATHER. Below, it ends on the sea horizon (hard, broken by far
    // swell crests). Above, it has no edge at all: the underside of the base hangs into it in large soft pouches (a
    // field in bearing and height, tens of pixels across, drifting slowly), so the top of the glow is billowed cloud,
    // lit green-grey from beneath, and never a ruled line, a tooth or a tear. Inside it the light is slotAt's: a pale
    // blaze at the heart, lemon windows, green-gold between them and toward the ends, brightest on the horizon and
    // deepening upward. From just under the base (the entry) the slot is a thinner line, as it would be. The rain
    // shafts that cross it are the shaft mesh's curtains, drawn in front of it.
    float altK = 1. - 0.4 * smoothstep(300., 680., uCam.y);
    float Hb = (0.056 + 0.04 * core + 0.016 * min(A, 1.)) * altK;
    float x1 = 2. * vnoise(vec2(azb * 3.4 + 1.3, uTime * 0.0012)) - 1.;
    float top = Hb * (1.1 - 0.5 * sqrt(x1 * x1 + 0.03)), K = 15. / altK;
    float bil = fbmLo(vec2(azb * 15. + 3. + uTime * 0.01, el * K + 7.)), bil2 = vnoise(vec2(azb * 6.1 + 9. - uTime * 0.006, el * K * 0.4 + 2.));
    float x = max(el, 0.) / max(top, 1e-3);
    float open = 1. - smoothstep(0.55, 1.25, x + (bil - 0.5) * 0.95 + (bil2 - 0.5) * 0.5);
    float lowK = exp(-x * 2.);
    float mxc = max(max(uBandC.r, max(uBandC.g, uBandC.b)), 1e-3);
    vec3 hot = mix(uBandC, uBandC * uBandC / mxc, 0.8 * smoothstep(0.3, 0.7, uBandC.g / mxc));   // (a copper slot deepens to amber, not to red)                              // the slot's own hue, deeper: lemon, not cream
    vec3 pale = mix(uBandC, vec3(mxc), 0.45) * 1.15, gold = hot * vec3(0.84, 0.96, 0.66);
    float Av = A * (0.45 + 0.55 * lowK);
    vec3 bc = mix(gold, uBandC, smoothstep(0.1, 0.55, Av));
    bc = mix(bc, pale, clamp(heart * (0.25 + 0.75 * lowK) + 0.22 * lowK * lowK, 0., 1.)) * min(Av, 1.2) * (0.62 + 0.4 * lowK);   // palest and brightest along the horizon, deepening upward: a glow, never one flat tone   // (the heart stays under the bloom threshold: a blaze, not a lamp)
    vec3 greenGrey = mix(uBandC, uCloudC * 1.7, 0.6);
    bc = mix(bc, greenGrey * (0.12 + 0.3 * A), smoothstep(0.6, 1.5, x));             // feathering to green-grey above
    float puff = smoothstep(0.25, 0.8, fbmLo(vec2(azb * 7. + 9., el * 11. - uTime * 0.006)));
    float lit = exp(-max(el - top * 0.7, 0.) / (0.07 + 0.13 * core)) * (0.3 + 0.7 * puff) * (0.1 + 0.5 * A) * west * uBandAmt;
    cloud += greenGrey * lit * 0.75;                                                  // the underside of the base takes the last of it, in billows
    vec3 col = mix(cloud, bc, open * west * amt);
    // THE FAR SEA (beyond what the sea meshes draw) and THE HORIZON: deep teal, never black, its broad lanes of swell
    // just visible from height, the slot's light lying on it under the heart; far swell crests break the line
    float hb = smoothstep(0.45, 0.8, vnoise(vec2(azb * 38. + 5., 1.7))) * (0.3 + 0.7 * vnoise(vec2(azb * 13., 9.))) * 0.0045;
    float dn = max(-el, 0.), ew = max(fwidth(el) * 0.75, 3e-4);
    vec2 ps = uCam.xz + hz * min(max(uCam.y, 1.) / max(dn, 1e-4), 40000.);
    vec3 sea = uFarSea * farTone(ps, dn) + uBandC * uBandAmt * slotSheen(sl, azb, dn, uResY) * smoothstep(30., 150., uCam.y);
    col = mix(sea, col, smoothstep(hb - ew, hb + ew, el));
    col += uViolet * uStroke * 0.035;
    gl_FragColor = vec4(max(col, 0.), 1.);
  }`,aa=Pe.GLSL_NOISE+io+`
  uniform float uTime; uniform vec2 uAxis;
  varying vec3 vW; varying float vDist; varying float vHang;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.);
    float r = length(wp.xz - uAxis);
    // THE POUCHES HANG (never below 700 m): the large ones 30 m deep, the 85 m ones another 24 m, so that from just
    // under the base (the entry) each belly stands in front of the creases behind it and the ceiling is rows of
    // rounded shapes, never a level sheet. vHang: 1 where the base hangs lowest, 0 up in a crease.
    vec2 dr = vec2(uTime * 0.012, -uTime * 0.008);
    float up = 30. * (1.01 - cbPouch(wp.xz * 0.0052 + dr * 0.5 + 3.1)) + 24. * (1. - cbPouch(wp.xz * 0.0118 - dr + 11.7)) + vnoise(wp.xz * 0.024 - uTime * 0.013) * 7.;
    wp.y += 0.085 * max(r - 220., 0.) + up;
    vHang = 1. - up / 50.;
    vW = wp.xyz; vec4 mv = viewMatrix * wp; vDist = length(mv.xyz); gl_Position = projectionMatrix * mv;
  }`,sa=Pe.GLSL_NOISE+Ge+io+`
  uniform vec3 uCloudC, uBandC, uViolet, uKey, uCam; uniform float uTime, uBandAmt, uKeyI, uGlowR, uStroke, uResY; uniform vec2 uAxis, uBandDir;
  varying vec3 vW; varying float vDist; varying float vHang;
  void main() {
    // BILLOWED CLOUD, larger and softer than anything on the sea: hanging pouches, light on their bellies and dark in
    // the creases between them, a slow broad tone under them; far off only the large ones are drawn
    vec2 p = vW.xz, dr = vec2(uTime * 0.012, -uTime * 0.008);
    float far = smoothstep(500., 1500., vDist), hang = clamp(vHang, 0., 1.);
    vec2 cb = cloudBase(p, dr, far); float ph = cb.x;
    // (close under the base, where the entry flies, the pouches carry smaller pouches of their own, 85 and 45 m
    // across: from ten metres below it the ceiling is cloud with form in it, never one even sheet of colour)
    float nearK = 1. - smoothstep(140., 460., vDist);
    float nearer = 1. - smoothstep(50., 240., vDist);                            // (and within 200 m, smaller ones again, 18 m across: right under the base the cloud still has form)
    float F = mix(1., 0.6, nearK) * (2. * vnoise(p * 0.0118 - dr + 11.7) - 1.) + 0.4 * nearK * (2. * vnoise(p * 0.022 - dr * 1.4 + 7.7) - 1.) + 0.3 * nearer * (2. * vnoise(p * 0.055 + dr * 2. + 3.3) - 1.);
    ph = mix(ph, 0.45 * ph + 0.55 * min(sqrt(F * F + 0.03) * 1.9, 1.), 0.35 * (1. - far) + 0.65 * nearK);
    // WHERE THE BASE IS SEEN EDGE-ON AND FAR OFF (a pixel covering eight metres of it and more: a pouch only a few
    // pixels tall) its pattern is eased to the mean and the whole of it goes into the murk: the ceiling RECEDES, in
    // rounded rows that soften and are gone, and never ends in stacked bars or a ruled edge
    vec2 pw = fwidth(p); float foot = max(pw.x, pw.y) * uResY / 360., ease = smoothstep(8., 40., foot);
    ph = mix(ph, 0.5, 0.85 * ease);
    // slate LIT FROM BELOW: a belly that hangs low is lighter than the crease above it (never black), and its lip takes
    // the last of the slot's light, green-grey
    vec3 col = uCloudC * (0.68 + 1.05 * ph * ph) * (0.7 + 0.6 * cb.y) * (0.8 + 0.5 * hang * hang);
    float e = cloudBase(p + uBandDir * 60., dr, far).x - cb.x;                   // the pouch's flank that faces the slot
    col += uBandC * uBandAmt * clamp(-e * 2.2, 0., 1.) * 0.16 * (0.4 + 0.6 * ph) * (1. - 0.7 * ease);
    col += mix(uBandC, uCloudC * 1.7, 0.6) * uBandAmt * 0.24 * hang * hang * hang * (1. - 0.5 * ease);   // (the underside of a belly is the lightest part of it: the slot lights the base from below)
    float r = length(p - uAxis);
    // THE LEADER'S UPPER HALF INSIDE THE CLOUD lights it from within (a steady glow, brightest round the hole the trunk
    // comes out of): the light comes through where the cloud is thin, UP IN THE CREASES between the pouches and in
    // soft veins along them, and the bellies that hang below stay slate against it. Its reach is ragged, not a ring.
    float seam = exp(-F * F / 0.02), crease = (1. - hang) * sqrt(1. - hang);
    float rr = r * (0.7 + 0.6 * fbmLo(p * 0.004 + vec2(2.1, 5.3)));
    float g = exp(-rr * rr / max(uGlowR * uGlowR, 1.)) * (0.02 + 0.8 * seam * (0.5 + cb.y) + 0.7 * crease) * (1. - 0.6 * ease) + 0.5 * exp(-r * r / 1600.);
    vec3 kd = uKey - vW; float kl = length(kd);
    g += uKeyI * 0.04 * exp(-kl / 110.) * (0.15 + 1.2 * hang * hang);            // (the nearest tip's light on the bellies of the pouches; the creases stay slate)
    col += uViolet * g * (0.22 + 0.9 * uStroke);
    float fq = uFogD * vDist * 0.45; col = mix(uFogC * 1.2, col, exp(-fq * fq) * (1. - 0.65 * ease));   // big shapes stay readable through the murk (the dome carries the same pouches on); the murk under the base is lit slate, a little lighter than the rain's
    // the mesh ends in a ragged, feathered edge (broad noise, 400 m and more), never in a straight line: the dome carries the same pouches on beyond it
    float a = 1. - smoothstep(850., 1700., length(p - uCam.xz) + (fbmLo(p * 0.0017 + 7.3) - 0.5) * 700.);
    // FAR ROWS GO INTO THE HAZE BY THE DISTANCE THE EYE LOOKS THROUGH THE MURK UNDER THE BASE (a layer some 60 m deep,
    // the depth the pouches hang): seen from below, a sight line leaves it at once and the ceiling is whole; seen
    // from just under the base, level, the line runs on in it and a row 800 m off is all but gone: no far row stands
    // as a dark ridge in front of the slot (the dome behind carries the slot's own feathered top).
    vec3 tv = vW - uCam; float murk = min(vDist, 60. / max(abs(tv.y) / max(vDist, 1.), 1e-3)) / 700.;
    a *= exp(-murk * murk);
    gl_FragColor = vec4(col, a);
  }`,ra=`
  attribute float aSeed; varying vec2 vUv; varying float vSeed; varying vec3 vW;
  void main() { vUv = uv; vSeed = aSeed; vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }`,na=Pe.GLSL_NOISE+`
  uniform vec3 uFogC, uCam; uniform float uTime;
  varying vec2 vUv; varying float vSeed; varying vec3 vW;
  void main() {
    float x = clamp(vUv.x, 0., 1.), y = clamp(vUv.y, 0., 1.);
    vec3 tv = vW - uCam; float sky = smoothstep(-0.03, 0.004, tv.y / max(length(tv.xz), 1.));
    float wv = (fbm(vec2(y * 2.6 + vSeed * 9., vSeed * 31. + uTime * 0.004)) - 0.5) * 0.3;          // wandering sides
    float xs = clamp(x + wv * (0.4 + 0.6 * y), 0., 1.);
    float body = sin(3.14159 * xs); body *= body * smoothstep(0., 0.2, x) * (1. - smoothstep(0.8, 1., x));
    float sn = fbm(vec2(xs * 3.6 + vSeed * 13. + wv * 3., y * 1.1 + vSeed * 3.));
    float strands = 0.3 + 0.7 * smoothstep(0.25, 0.75, sn);                                          // three or four soft strands that wander
    float comb = fbm(vec2((xs + 0.1 * (1. - y) * (1. - y)) * 22. + vSeed * 30. + uTime * 0.012, y * 1.3 + vSeed * 7.));   // fall streaks: they wander with the curtain's sides and sweep as they near the sea, soft (live's law), never ruled
    float top = 1. - smoothstep(0.6, 0.96, y);                                                       // frays out of the cloud base
    float foot = mix(1., smoothstep(0., 0.05 + 0.2 * sn, y), (1. - smoothstep(0.3, 0.55, sn)) * 0.8) * (0.3 + 0.7 * smoothstep(0., 0.4, y));   // the thin strands lift off the sea
    float a = body * strands * (0.3 + 0.7 * comb) * top * foot * sky;
    gl_FragColor = vec4(uFogC * 0.74, a * 0.6);
  }`,ia=`
  attribute vec3 aC; attribute float aK; attribute vec3 iPos; attribute vec4 iParm;     // iParm: scale, phase, rate, seed
  uniform float uTime;
  varying vec3 vW; varying vec3 vN; varying float vDist; varying float vH;
  void main() {
    float g = fract(uTime * iParm.z + iParm.y);
    vH = aK < 0.5 ? position.y : 1.;
    float rise = sin(3.14159 * pow(max(g, 0.), 0.7));
    float rad = mix(0.35, 1., smoothstep(0., 0.6, g));
    float env = smoothstep(0., 0.06, g) * (1. - smoothstep(0.9, 1., g));
    vec3 p = position;
    if (aK < 0.5) { p.xz *= rad * (1. + 0.4 * p.y * g); p.y *= rise * 1.15; }
    else if (aK < 1.5) {
      float fly = smoothstep(0.42, 1., g);
      vec3 c = vec3(aC.x * rad * (1. + 0.4 * g) * (1. + 0.7 * fly), aC.y * rise * 1.15 + fly * 0.9, aC.z * rad * (1. + 0.4 * g) * (1. + 0.7 * fly));
      p = c + (position - aC) * smoothstep(0.12, 0.4, g) * (1. + 0.6 * fly);
    } else { float h = smoothstep(0.5, 0.92, g); p.y *= h * 1.7; p.xz *= 0.7 * step(0.01, h); }
    vec3 wp = iPos + p * iParm.x * env;
    vW = wp; vN = normal;
    vec4 mv = viewMatrix * vec4(wp, 1.); vDist = length(mv.xyz); gl_Position = projectionMatrix * mv;
  }`,Eo=`
  uniform vec3 uCloudC, uBandC, uSeaC, uViolet, uGlowC, uKey, uCam; uniform float uBandAmt, uKeyI, uStroke; uniform vec2 uBandDir;
  // water lit by the two lights: the slot (rim) and the leader (key), over a deep teal body
  vec3 glass(vec3 n, vec3 w, vec3 body, vec2 skyK, vec2 gloss) {       // gloss: exponent and gain of the leader's glint
    vec3 v = normalize(uCam - w); if (dot(n, v) < 0.) n = -n;
    float ndv = clamp(dot(n, v), 0., 1.), fres = pow(max(1. - ndv, 0.), 3.);
    vec3 rf = reflect(-v, n);
    float hl = max(length(rf.xz), 1e-3), el = rf.y / hl;
    float west = smoothstep(0.0, 0.7, dot(rf.xz / hl, uBandDir));
    vec3 sky = mix(uCloudC, uBandC * uBandAmt * 1.1, west * smoothstep(-0.05, 0.02, el) * (1. - smoothstep(0.06, 0.3, el)));
    vec3 l = uKey - w; float ld = max(length(l), 1e-3); l /= ld;
    float ki = uKeyI * (1. + 1.2 * uStroke) * 160. / (160. + ld);
    vec3 col = body * (0.55 + 0.45 * n.y) + sky * (skyK.x + skyK.y * fres);
    col += uBandC * uBandAmt * 0.3 * fres * max(dot(n.xz, uBandDir), 0.);
    col += uGlowC * ki * pow(max(dot(rf, l), 0.), gloss.x) * gloss.y + uViolet * ki * 0.07 * max(dot(n, l), 0.);
    return col;
  }`,la=Ge+Eo+`
  varying vec3 vW; varying vec3 vN; varying float vDist; varying float vH;
  void main() {
    vec3 n = normalize(vN + vec3(0., 1e-4, 0.));
    // clear water: darker than the sea at its foot, mostly reflection, the slot's colour along the rim
    vec3 col = glass(n, vW, uSeaC * 1.2 * mix(0.5, 1.1, vH), vec2(0.2, 0.8), vec2(40., 1.6));
    col += uBandC * uBandAmt * smoothstep(0.7, 1., vH) * 0.5;
    gl_FragColor = vec4(wfog(max(col, 0.), vDist), 1.);
  }`,Do=`
  attribute vec3 iPos; attribute vec4 iParm;   // iParm: radius, seed, drift, kind (0 free, 1 a petrel's halo)
  uniform float uTime, uResY, uBirdDz;
  varying vec2 vQ; varying float vA; varying float vDist; varying vec3 vW;
  void main() {
    float sd = iParm.y * 60.;
    vec3 c = iPos + vec3(sin(uTime * 0.31 + sd), -0.3 + 0.6 * fract(sd) - 0.02 * uTime * (0.5 + fract(sd * 3.1)), cos(uTime * 0.27 + sd * 1.7)) * iParm.z;
    c.y = iPos.y + mod(c.y - iPos.y + 2., 4.) - 2.;
    c.xz += vec2(0.096, 1.) * uBirdDz * iParm.w;               // a petrel's halo travels with its bird
    vec4 mv = viewMatrix * vec4(c, 1.);
    float dist = max(length(mv.xyz), 0.3), px = uResY * projectionMatrix[1][1] * 0.5 / dist;
    float grow = max(1., 1.3 / max(iParm.x * px, 1e-4));
    vA = (1. / (grow * grow)) * smoothstep(0.5, 1.4, dist);
    vQ = position.xy; vDist = dist; vW = c;
    mv.xy += position.xy * iParm.x * grow;
    gl_Position = projectionMatrix * mv;
  }`,Ro=Ge+`
  uniform vec3 uCloudC, uBandC, uSeaC, uViolet, uGlowC, uKey; uniform float uBandAmt, uKeyI, uStroke;
  varying vec2 vQ; varying float vA; varying float vDist; varying vec3 vW;
  void main() {
    float r = length(vQ); if (r > 1.) discard;
    float edge = 1. - smoothstep(0.82, 1., r), rim = smoothstep(0.45, 0.98, r);
    vec3 col = uSeaC * 1.5 + uCloudC * 0.6 * rim;
    col += uBandC * uBandAmt * (smoothstep(0.25, 0.8, vQ.y) * rim * 1.1 + 1.7 * exp(-dot(vQ - vec2(0., 0.55), vQ - vec2(0., 0.55)) * 30.));
    float ki = uKeyI * (1. + 1.5 * uStroke) * 120. / (120. + distance(uKey, vW));
    col += uGlowC * ki * exp(-dot(vQ - vec2(0.3, -0.35), vQ - vec2(0.3, -0.35)) * 40.) * 2.2 + uViolet * ki * rim * 0.4;
    float a = edge * vA * (0.55 + 0.45 * rim);
    gl_FragColor = vec4(max(wfog(col, vDist), 0.) * a, a);
  }`,lo=`
  attribute vec3 aInfo;                                      // thin (0 body .. 1 lip edge), finger root (0..1), along-crest 0..1
  attribute vec2 aDir; attribute vec3 aL;                    // the lip's own forward direction (xz); crest coordinates (along, up, forward)
  uniform float uTime, uT, uLip;
  varying vec3 vW; varying vec3 vN; varying vec3 vInfo; varying float vDist; varying vec3 vL;
  void main() {
    vec3 p = position;
    float th = aInfo.x * aInfo.x;                            // the whole lip creeps forward (the fingers ride on it: FINGER_VERT)
    p.xz += aDir * th * (0.3 + 1.2 * uT / 40. + 0.12 * sin(uTime * 0.6 + aInfo.z * 40.));
    p.y -= 2.2 * (1. - smoothstep(-0.6, 1., aL.y));          // its foot goes down under the troughs of the storm sea: the wave never stands on the water with an edge showing
    vec4 wp = modelMatrix * vec4(p, 1.);
    vW = wp.xyz; vN = normalize(mat3(modelMatrix) * normal); vInfo = aInfo; vL = aL;
    vec4 mv = viewMatrix * wp; vDist = length(mv.xyz);
    mv.xyz *= 1. - uLip * 0.04 / max(vDist, 0.3);              // the lip lies over the body's outer rows: 4 cm nearer the lens, so the two never fight
    gl_Position = projectionMatrix * mv;
  }`,Io=`
  vec3 envSky(vec3 d) {
    float hl = max(length(d.xz), 1e-4), el = d.y / hl;
    float west = smoothstep(0.05, 0.6, dot(d.xz / hl, uBandDir));
    vec3 sky = mix(uFogC * 1.15 + uBandC * uBandAmt * 0.05 * west, uCloudC * 0.8, smoothstep(0.02, 0.6, el));
    float band = smoothstep(0., 0.012, el) * (1. - smoothstep(0.04, 0.15, el));
    sky = mix(sky, uBandC * 1.15, band * west * min(uBandAmt, 1.));
    vec3 sea = mix(uSeaC * 0.6, uSeaC * 1.9 + uBandC * uBandAmt * 0.1 * west, smoothstep(-0.5, 0., el));
    return mix(sea, sky, smoothstep(-0.006, 0.006, el));
  }`,Po=Pe.GLSL_NOISE+Ge+Eo+Io+`
  uniform float uTime, uLip, uOut, uLAmb, uSeaDrop; uniform vec3 uRimC, uLTeal; uniform vec4 uSeaL[4];
  varying vec3 vW; varying vec3 vN; varying vec3 vInfo; varying float vDist; varying vec3 vL;
  void main() {
    vec3 n = normalize(vN + vec3(0., 1e-4, 0.));
    vec3 vd = normalize(vW - uCam + vec3(0., 1e-5, 0.));
    float inside = smoothstep(0., 0.12, dot(n, vd) * uOut);                  // this face is seen from within the water (only ever through the glass of the lip)
    if (dot(n, vd) > 0.) n = -n;                                             // turned to the lens BEFORE it is rippled, so body and lip (whose faces wind the other way) are shaded as one surface
    float thin = vInfo.x;
    // FROM HEIGHT AND FROM FAR OFF (above 60 m, beyond 150 m) the breaker is a torn line of white water on a green-black
    // back; its emerald glass comes up only as we level out toward it (glassK 0 -> 1)
    float glassK = (1. - smoothstep(25., 90., uCam.y)) * (1. - smoothstep(120., 260., vDist));
    float far = 1. - glassK, farM = max(far, 0.6 * smoothstep(60., 130., vDist));     // (from 60 m out it already keeps part of its torn white cap and its melting ends)
    float aE = vInfo.z, envS = pow(max(smoothstep(0., 0.44, aE), 0.), 0.95) * pow(max(1. - smoothstep(0.8, 1., aE), 0.), 0.8);
    // fine streaks drawn up the face and out along the lip: reflections are threads, not bands
    float rip = fbm(vec2(vL.x * 2.7, vL.y * 1.05 + vL.z * 0.6 - uTime * 0.03));
    n = normalize(n + vec3(rip - 0.5, 0., fbmLo(vec2(vL.x * 5.1 + 9., vL.y * 1.05)) - 0.5) * 0.2);
    // the trough in front of the face is sea, not glass: chopped, and mirroring the cloud and the slot as the ocean does
    float foot = (1. - smoothstep(0.8, 3.2, vL.y)) * step(0., vL.z);
    n = normalize(n + vec3(fbmLo(vW.xz * 0.8 + uTime * 0.02) - 0.5, 0., fbmLo(vW.xz * 0.8 + 17.3 - uTime * 0.016) - 0.5) * foot * 0.9);
    float toSlot = max(dot(vd.xz, uBandDir), 0.);
    float level = 1. - smoothstep(0.12, 0.45, -vd.y);                       // seen from above there is only sea behind it
    float behind = 1. - smoothstep(0.1, 0.42, vd.y);                        // seen from below there is only cloud behind it
    float ndv = abs(dot(n, vd)), fres = 1. - ndv; fres *= fres * fres;
    // glass: dark bottle green where it is thick, clear teal where it curls, backlit emerald where the slot stands
    // behind it; only the rim (the last 0.4 m) takes the slot's own colour
    vec3 thick = uSeaC * 1.1 + vec3(0., 0.01, 0.007);
    vec3 teal = vec3(0.016, 0.13, 0.115) + uSeaC * 0.7;
    vec3 mint = mix(vec3(0.2, 0.8, 0.55), uBandC, 0.55) * (0.3 + 0.7 * min(uBandAmt, 1.));
    vec3 body = mix(thick, teal, smoothstep(0.04, 0.62, thin) * glassK) * (0.82 + 0.4 * rip);
    float thread = smoothstep(0.48, 0.74, fbm(vec2(vL.x * 3.2, (vL.y + vL.z) * 0.13 + 4.)));   // flow lines from the crest out to the edge
    float fine = smoothstep(0.5, 0.68, fbmLo(vec2(vL.x * 11., (vL.y + vL.z) * 0.11 + 1.7)));   // and hair-fine ones between them
    // the leader's reflection on the wave: a few hard glints strung along the flow lines (a tight lobe, on the threads
    // only), never a soft white patch; the chopped trough at its foot keeps the sea's broad glint
    vec3 col = glass(n, vW, body, mix(vec2(0.03, 0.12), vec2(0.14, 0.8), foot), mix(vec2(400., 2.4 * thread * fine), vec2(40., 1.6), foot * (1. - smoothstep(0.3, 1.1, vL.y))));
    col += (teal * 1.5 + uCloudC * 0.25) * fres * 0.55 * glassK;            // a green sheen at grazing angles, not the cloud's blue
    col += vec3(0.02, 0.3, 0.22) * (0.3 + 0.7 * min(uBandAmt, 1.)) * smoothstep(0.25, 0.85, thin) * (0.35 + 0.65 * thread) * toSlot * level * behind * 0.7 * glassK;   // backlit emerald
    col += mint * thread * thin * 0.16 * level * (0.35 + 0.65 * behind) * glassK;
    // THE LIP FROM BELOW AND ITS EDGE: the sheet lets a little of what is above it through (more where it thins), its
    // threads stay dark-and-bright right out to the edge, and the light of the slot is piped to a narrow rim
    float lipK = smoothstep(0.56, 0.96, thin) * glassK, up = 1. - behind;         // (the glass terms come in exactly where the lip's alpha does: wall and roof are one curve)
    col += body * up * (0.3 + 0.5 * thread * smoothstep(0.15, 0.5, thin));       // the roof of the barrel, from below: lit off the sea, its threads still showing
    vec3 through = envSky(refract(vd, n, 0.8) + vec3(0., 1e-4, 0.)) * vec3(0.55, 1., 0.88);
    through = mix(min(through, teal * 2.5), through, smoothstep(0.62, 0.9, thin));   // thick glass lets no more than its own teal through: the slot shows only where the sheet thins
    col += through * lipK * (0.25 + 0.5 * up) * (0.55 + 0.45 * fine);
    col *= mix(1., 0.62 + 0.55 * thread + 0.25 * fine, lipK);
    col += (teal * 2.2 + uViolet * uKeyI * 0.25) * lipK * up * (0.2 * thread + 0.3 * fine * fine);   // threads catch the leader from below
    col -= teal * 0.9 * fres * thin * up * smoothstep(0.78, 1., thin);       // a darker outline where the sheet turns away (the rim only: the roof behind it is lit glass, as the wall is)
    // the face seen head-on (the inside corner of the hook) is streaked glass, never a dark pane; and where the wall
    // stands in the sea it darkens into the trough, with a torn line of foam along the waterline
    float front = step(0., vL.z) * (1. - smoothstep(0.3, 0.6, thin));
    col += teal * 0.3 * ndv * ndv * front * smoothstep(0.5, 3., vL.y) * (0.4 + 1.2 * rip * thread) * glassK;
    float wy = vW.y + uSeaDrop;                                              // height over the sea's own level
    col *= 1. - 0.5 * front * (1. - smoothstep(0.2, 2.2, wy)) * smoothstep(0.3, 0.8, envS);   // (no trough shadow where the wave runs out into the swell: its ends are the sea's own tone)
    float wlace = smoothstep(0.42, 0.68, fbmLo(vec2(vL.x * 0.8, wy * 1.6 - uTime * 0.02))) * (1. - smoothstep(0.2, 1.3, wy)) * front;
    col = mix(col, uCloudC * 1.9 + uBandC * uBandAmt * 0.12, wlace * 0.55);
    float edge = smoothstep(0.955, 1., thin), root = vInfo.y;
    col += (uRimC * max(min(uBandAmt, 1.), 0.75) * (0.35 + 0.65 * toSlot) + mint * 0.5) * min(edge * (0.45 + 0.55 * thread) * (1. - 0.6 * root), 1.) * 0.55 * level;   // (dimmer where the sheet runs out into a finger's root: that is dark glass)
    // foam only as fine lace down the back (close to: glassK 1)
    float backN = (1. - smoothstep(0.02, 0.3, thin)) * (1. - smoothstep(-2., 1.5, vL.z)) * smoothstep(-0.5, 3., vL.y);
    float laceN = smoothstep(0.46, 0.7, fbm(vec2(vL.x * 0.5, vL.z * 0.22 - uTime * 0.01))) * (0.3 + 0.7 * smoothstep(0.3, 0.62, vnoise(vec2(vL.x * 1.9, vL.z * 0.9))));
    // FROM HEIGHT AND FROM FAR OFF it is a long low back of green-black water with ONE torn line of white along its
    // crest: the foam runs ALONG the crest (drawn out eight times longer than it is deep), at full weight only on the
    // crest strip, its lower edge torn; below that it thins to a few veins trailing down the face and the back
    float tornLo = mix(0.25, 0.8, fbm(vec2(vL.x * 0.12, 3.3 + uTime * 0.004)));          // (the line is the overhanging lip, two to five metres of it, torn along its length: a LINE from above, never a white slab)
    float crestK = smoothstep(tornLo, tornLo + 0.14, thin) * (0.62 + 0.38 * smoothstep(0.3, 0.6, fbm(vec2(vL.x * 0.12, vL.z * 0.5 - uTime * 0.01))));
    float veins = smoothstep(0.56, 0.74, fbm(vec2(vL.x * 0.16, vL.y * 0.55 + vL.z * 0.4 + 7.))) * smoothstep(5., 9., vL.y) * 0.3;
    float foamF = clamp(crestK + veins * (1. - crestK), 0., 1.);
    float lsum = 0.;                                                                 // the leader's light as the sea round it takes it (SEA_LIGHT_GLSL)
    for (int i = 0; i < 4; i++) { vec4 q = uSeaL[i]; vec3 ld = q.xyz - vW; float S = 120. + 0.8 * max(q.y, 0.); lsum += q.w * S * S / (S * S + dot(ld, ld)) * 0.5; }
    vec3 seaLit = uSeaC * 1.2 + uCloudC * 0.05 + uLTeal * (uLAmb * 0.8 + 0.8 * lsum / (1. + 0.45 * lsum));
    col = mix(col, seaLit * vec3(0.7, 1., 0.84) * (0.26 + 0.3 * rip + 0.22 * smoothstep(4., 9., vL.y)), far * 0.86);   // its body: the sea's own tone, in shadow (green-black against the lit water round it)
    col = mix(col, uCloudC * mix(3.4, 2.2, glassK) + uBandC * uBandAmt * 0.2 + uViolet * uKeyI * 0.12, mix(foamF, laceN * backN * 0.7, 1. - farM));
    // and its two ends MELT into the swell: where the crest tapers out the body breaks up into torn patches and goes
    // to the sea's own tone, so the wave never ends in a cut edge standing on flat water
    float melt = farM * (1. - smoothstep(0.12, 0.74, envS));
    if (melt > 0.03 + 0.97 * fbm(vec2(vL.x * 0.45 + 1.7, vL.y * 0.8 + vL.z * 0.25))) discard;
    col = mix(col, seaLit, melt * 0.75 * (1. - foamF));
    // WALL AND ROOF ARE ONE CURVE OF GLASS. The roof stays all but solid, shaded as the wall is, until the last
    // metre and a half before the rim (thin > 0.8), where it clears; and whatever shows through it of the wave's own
    // back slope, seen from within (uOut: the body only), is one deep green: no foam, no second surface, no edge
    col = mix(col, thick * (0.7 + 0.35 * rip), inside);
    float a = mix(1., mix(1., mix(0.97, 0.34, smoothstep(0.8, 1., thin)) + 0.3 * edge + 0.25 * fres, smoothstep(0.56, 0.9, thin)), uLip);
    a = max(a, farM * foamF);                                                         // (from afar the lip's edge is foam, not clear glass)
    gl_FragColor = vec4(wfog(max(col, 0.), vDist), clamp(a, 0., 1.));
  }`,ha=`
  varying vec3 vInfo; varying float vDist;
  void main() { if (vInfo.x > 0.8 || vDist > 150. || (vDist > 60. && (vInfo.z < 0.36 || vInfo.z > 0.9))) discard; gl_FragColor = vec4(0.); }`,ca=`
  attribute vec3 aC; attribute vec4 aRing; attribute vec4 aFi; attribute vec2 aTau;   // aC: centre line from the root; aRing: radial offset, feature radius; aFi: lip direction xz, creep share, along-crest; aTau: 0..1 along, kind (0 web root .. 1 string .. 2 bead)
  uniform float uTime, uT, uResY;
  varying vec3 vW; varying vec3 vN; varying float vDist; varying float vA; varying vec2 vTau;
  void main() {
    float g = 0.7 + 0.46 * uT / 40. + 0.03 * sin(uTime * 0.8 + aFi.w * 90.);
    vec3 p = position + aC * (g - 1.);
    p.xz += aFi.xy * aFi.z * (0.3 + 1.2 * uT / 40. + 0.12 * sin(uTime * 0.6 + aFi.w * 40.));
    float reach = length(aC);
    p.xz += vec2(aFi.y, -aFi.x) * 0.035 * reach * sin(uTime * 0.55 + aFi.w * 200.);     // the strings sway a little
    p.y += 0.02 * reach * sin(uTime * 0.4 + aFi.w * 130.);
    vec4 wp = modelMatrix * vec4(p, 1.);
    vec4 mv = viewMatrix * wp; float dist = max(length(mv.xyz), 0.3), px = uResY * projectionMatrix[1][1] * 0.5 / dist;
    float grow = max(1., 0.75 / max(aRing.w * px, 1e-4));      // a string never under a pixel and a half: widened and thinned instead
    wp.xyz += mat3(modelMatrix) * aRing.xyz * (grow - 1.);
    vA = 1. / grow; vTau = aTau;
    vW = wp.xyz; vN = normalize(mat3(modelMatrix) * normal + vec3(0., 1e-5, 0.));
    mv = viewMatrix * wp; vDist = length(mv.xyz); gl_Position = projectionMatrix * mv;
  }`,da=Ge+`
  uniform vec3 uCloudC, uBandC, uRimC, uSeaC, uViolet, uGlowC, uKey, uCam; uniform float uBandAmt, uKeyI, uStroke; uniform vec2 uBandDir;`+Io+`
  varying vec3 vW; varying vec3 vN; varying float vDist; varying float vA; varying vec2 vTau;
  void main() {
    vec3 rw = normalize(vW - uCam + vec3(0., 1e-5, 0.)), n = normalize(vN);
    if (dot(n, rw) > 0.) n = -n;
    float ndv = clamp(dot(n, -rw), 0., 1.), rim = (1. - ndv) * (1. - ndv);
    // a lens: refract in, cross, refract out (what is behind comes out upside down and reversed)
    vec3 r1 = refract(rw, n, 0.75);
    vec3 p2 = n - 2. * dot(r1, n) * r1;
    vec3 outd = refract(r1, -p2, 1.333);
    if (dot(outd, outd) < 1e-4) outd = reflect(r1, -p2);
    outd = normalize(outd + vec3(0., 1e-5, 0.));
    vec3 refl = reflect(rw, n);
    float F = 0.03 + 0.97 * rim * rim;
    vec3 l = uKey - vW; float ld = max(length(l), 1e-3); l /= ld;
    float ki = uKeyI * (1. + 1.4 * uStroke) * 140. / (140. + ld);
    float web = clamp(1. - vTau.y, 0., 1.), bead = clamp(vTau.y - 1., 0., 1.), str = (1. - web) * (1. - bead);   // the flat root (still part of the sheet), the string, the drops
    float toSlot = max(dot(rw.xz, uBandDir), 0.);
    vec3 teal = vec3(0.016, 0.13, 0.115) + uSeaC * 0.7, lit = uRimC * max(min(uBandAmt, 1.), 0.75);   // the slot's colour, or at night the violet that rims the crests
    vec3 col = (envSky(outd) * vec3(0.86, 1., 0.95) * (1. - F) + envSky(refl) * F) * mix(1., 0.3, web);
    col += teal * (0.2 + 0.8 * web) * (0.4 + 0.6 * ndv);                      // the water's own colour: the web is the lip's dark glass
    col *= 1. - 0.3 * bead * ndv * ndv;                                       // a drop has a dark heart, so its rim and the slot's line read
    col *= mix(1., 0.5 + 0.5 * ndv, str);                                     // a string is dark at its edges ...
    float r2 = rim * rim;
    // ... with the light of the slot piped down its middle and the leader as one bright line along it
    col += (lit * (0.3 + 0.7 * toSlot) * 0.2 + uViolet * ki * 0.25) * ndv * ndv * str;
    col += uGlowC * ki * pow(max(ndv, 0.), 24.) * 0.5 * str;
    col += lit * (0.35 + 0.65 * toSlot) * r2 * web * 0.6;
    col += uGlowC * ki * (pow(max(dot(refl, l), 0.), 90.) * 3.2 + pow(max(dot(outd, l), 0.), 60.) * 0.9);   // the leader: a glint and a caustic heart
    col += uViolet * ki * rim * (0.25 + max(dot(n, l), 0.)) * 0.7 + uCloudC * r2 * 1.6;
    col += lit * mix(r2, rim, bead) * max(-dot(n.xz, uBandDir) * 0.5 + 0.55, 0.) * 1.0;     // the slot's edge on the side that faces it
    float a = vA * mix(0.62, 0.97, smoothstep(0.1, 0.8, vTau.y)) * smoothstep(0., 0.16, ndv + 0.06);
    gl_FragColor = vec4(wfog(max(col, 0.), vDist), a);
  }`,ua=`
  uniform vec4 uPool[6];
  float poolInAir(vec3 w) {
    float s = 0.;
    for (int i = 0; i < 6; i++) { vec4 q = uPool[i]; vec3 d = w - q.xyz; s += q.w * 3600. / (3600. + dot(d, d)); }
    return s;
  }`,Go=`
  vec4 seaRule(vec2 p, float t) {
    float warp = (fbm(p * 0.0021 + 3.1) - 0.5) * 165. + (vnoise(p * 0.0046 + 9.3) - 0.5) * 60. + (vnoise(p * 0.012 + 1.7) - 0.5) * 12.;
    float ph = (p.y + warp + t * 0.3) / 82., f = fract(ph), id = floor(ph);
    float h = hash12(vec2(id * 0.731 + 3.1, 7.7)), c = 0.3 + 0.4 * fract(h * 7.31);
    f = f < c ? 0.5 * f / c : 0.5 + 0.5 * (f - c) / (1. - c);
    float amp = smoothstep(0.34, 0.6, vnoise(vec2(p.x * 0.0072 + id * 3.7, id * 1.3))) * step(0.34, h);
    return vec4(f, id, amp, 1. - abs(f - 0.5) * 2.);
  }`,fa=`
  attribute float aIdx; uniform vec4 uPool[6];
  varying vec3 vW; varying vec4 vQ;
  void main() {
    vec4 q = uPool[int(aIdx + 0.5)];
    float r = 9. + 0.42 * max(q.y, 10.);
    vec3 wp = vec3(q.x + position.x * r * 2.5, position.y, q.z + position.z * r * 2.5);
    vW = wp; vQ = vec4(position.xz * 2.5, q.w * 60. / (60. + max(q.y, 10.)), r);
    gl_Position = q.w <= 0.002 ? vec4(2., 2., 2., 1.) : projectionMatrix * viewMatrix * vec4(wp, 1.);
  }`,ma=Pe.GLSL_NOISE+Go+`
  uniform vec3 uViolet, uGlowC, uCam; uniform float uTime, uStroke, uPoolK, uFogD, uResY;
  varying vec3 vW; varying vec4 vQ;
  void main() {
    float d2 = dot(vQ.xy, vQ.xy);
    float I = vQ.z * (exp(-d2) * 0.7 + exp(-d2 * 7.) * 1.1) * (1. - smoothstep(4.4, 6.2, d2));
    vec2 p = vW.xz; vec4 sr = seaRule(p, uTime);
    float dist = distance(uCam, vW), fp = dist * 1.25 / max(uResY, 1.);
    float crest = sr.w * sr.w * (3. - 2. * sr.w) * (0.4 + 0.6 * sr.z);
    float glit = smoothstep(0.5, 0.8, fbmLo(vec2(p.x * 0.13, p.y * 0.55) + uTime * 0.05)) * (1. - smoothstep(0.5, 2.2, fp));
    float lace = smoothstep(0.5, 0.56, sr.x) * (1. - smoothstep(0.6, 0.9, sr.x)) * sr.z * smoothstep(0.42, 0.7, fbmLo(vec2(p.x * 0.085 + sr.y * 4.3, (sr.x - 0.5) * 3.7 + sr.y * 1.9)));
    float lit = 0.42 + 0.75 * crest + 0.7 * glit + 0.5 * lace;
    vec3 col = (uViolet * 0.8 + uGlowC * 0.2) * I * lit * (1. + 1.4 * uStroke) * uPoolK;
    float fq = uFogD * dist; col *= exp(-fq * fq);
    gl_FragColor = vec4(max(col, 0.), 1.);
  }`,pa=`
  varying vec3 vW;
  void main() { vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }`,va=Pe.GLSL_NOISE+Ge+Go+To+`
  uniform vec3 uCloudC, uBandC, uRimC, uSeaC, uViolet, uGlowC, uCam, uKey, uShipLit, uRoadC, uFarSea; uniform float uBandAmt, uTime, uHigh, uResY, uStroke, uKeyI, uSeaLift, uLitK, uSeaAmb; uniform vec2 uBandDir, uRoadDir; uniform vec4 uPool[6];
  varying vec3 vW;
  void main() {
    vec3 tv = vW - uCam; float dist = max(length(tv), 1.); vec3 v = tv / dist;
    vec2 p = vW.xz;
    float hl = max(length(v.xz), 1e-3), el = v.y / hl; vec2 hz = v.xz / hl;
    float fp = dist * 1.25 / max(uResY, 1.);                             // metres per pixel across the view
    float fpz = fp * mix(1., 1. / max(-v.y, 0.06), abs(v.z) / hl);       // and along Z, across the crests
    float fpm = fp / max(-v.y, 0.08);                                    // the long side of a pixel's footprint on the water
    vec4 sr = seaRule(p, uTime);
    float f = sr.x, id = sr.y, amp = sr.z, tri = sr.w;                   // each crest is a length, not a line across the world
    // THE RANK: a third of a kilometre west of the schooner four or five crests in a row stand right up and break along
    // most of their length: a rank of long white breakers, the one large lit subject on the floor of the dive (it lies
    // under the corona in the look at the schooner, along the foot of the frame in the look at the slot)
    vec2 qk = p - vec2(-20., -350.);
    float rank = smoothstep(0.22, 0.6, exp(-(qk.x * qk.x / 150000. + qk.y * qk.y / 36000.)) * (0.7 + 0.6 * fbmLo(p * 0.0045 + 41.)));
    amp = max(amp, rank * 0.95);
    float melt = 1. - smoothstep(0.1, 0.45, fpz / 82.);                  // far off the swell melts into tone
    float crest = tri * tri * (3. - 2. * tri);
    float grain = fbm(vec2(p.x * 0.011, p.y * 0.034) + 5.);              // wind-drawn
    float gk = 1. - smoothstep(1.5, 9., fp);
    float near = 1. - smoothstep(0.35, 1.6, fp);
    float chopN = fbmLo(vec2(p.x * 0.085 + grain * 2., p.y * 0.4) + 2.3);   // short chop drawn out along the wind, close to
    // squall shadow and rain-beaten light: two or three broad tones across the view
    float squall = fbm(p * 0.0012 + vec2(3.7, 1.1 + uTime * 0.002));
    float tone = 0.7 + 0.55 * smoothstep(0.25, 0.75, squall);
    // two shorter trains crossing the swell (36 m at +24 degrees, 63 m at -20), each strong in its own patches
    vec2 dA = vec2(0.407, 0.914), dB = vec2(-0.342, 0.94);
    float wA = (fbmLo(p * 0.006 + 11.) - 0.5) * 30., wB = (fbmLo(p * 0.0045 + 4.) - 0.5) * 44.;
    float sA = sin((dot(p, dA) + wA + uTime * 0.2) * 0.1745), sB = sin((dot(p, dB) + wB - uTime * 0.15) * 0.0997);
    float patchK = smoothstep(0.3, 0.7, fbmLo(p * 0.0031 + 17.));
    float kA = 1. - smoothstep(0.08, 0.4, fpm / 36.), kB = 1. - smoothstep(0.08, 0.4, fpm / 63.);
    float facet = sA * kA * (0.3 + 0.7 * patchK) + sB * kB * (1. - 0.7 * patchK);
    float swell = (crest - 0.45) * amp * melt;                           // the back of a length of swell: a breath lighter, no more
    float sl0 = dot(uSeaC, vec3(0.2126, 0.7152, 0.0722));                // every mood's sea is held to the same near-black, and a third of the way from its own hue to slate
    vec3 seaC = uSeaC * min(1., 0.02 / max(sl0, 1e-3)); seaC = mix(seaC, min(sl0, 0.02) * vec3(0.8, 1., 1.2), 0.3);
    vec3 body = (seaC * 1.2 + uCloudC * 0.05) * uSeaLift * tone * (0.85 + 0.3 * swell + 0.15 * facet) * mix(1., 0.8 + 0.4 * grain, gk) * (1. + 0.4 * (chopN - 0.5) * near);
    body += uRimC * uBandAmt * 0.03 * smoothstep(0.56, 0.8, chopN) * near;   // close to, the chop's west faces catch the slot
    float w = max(0.012, 1.3 * fpz / 82.), rx = (f - 0.462) / w;
    float rim = exp(-rx * rx) * min(1., 0.03 / w) * smoothstep(0.42, 0.8, amp) * (0.2 + 0.8 * smoothstep(0.3, 0.68, vnoise(vec2(p.x * 0.012 + id * 2.1, id * 7.7))));   // THE BRIEF'S LEMON RIM: thin and cold, on every length of crest that stands up
    // WHITE CAPS: short, in groups. Each is 8-14 m of crest that has broken, longer than it is deep: a sharp front
    // and a torn tail a few metres behind it. Past the point where one is smaller than a pixel they join the tone of their group.
    float grp = max(smoothstep(0.4, 0.62, fbmLo(p * 0.0043 + 21.)), rank);
    float lz = (f - 0.5) * 82.;                                          // metres behind the crest
    float seg = max(smoothstep(0.55, 0.66, vnoise(vec2(p.x * 0.034 + id * 9.1, id * 5.3))), rank * smoothstep(0.25, 0.4, vnoise(vec2(p.x * 0.011 + id * 9.1, id * 5.3))));   // 8-14 m of crest in every 30 (in the rank: lengths of 60-150 m)
    float brk = smoothstep(0.45, 0.8, amp) * grp;
    float wpx = max(1.1, 1.3 * fpz);
    float lc = lz - (vnoise(vec2(p.x * 0.021 + id * 5.7, id * 2.9)) - 0.5) * 18.;   // each breaks at its own place, ahead of or behind the crest line: never beads on one thread
    float tear = 0.55 + 0.9 * vnoise(vec2(p.x * 0.31 + id * 3.3, lc * 0.3));
    float capS = smoothstep(-wpx, 0., lc + 0.5) * exp(-max(lc, 0.) / ((1.6 + 4. * brk + 2.5 * rank) * tear + wpx)) * seg * brk;
    float capK = 1. - smoothstep(4., 14., fpm);
    float cap = mix((0.16 + 0.2 * rank) * brk * exp(-lz * lz / (500. - 380. * rank)), capS, capK);
    float lace = smoothstep(0.44, 0.7, fbm(vec2(p.x * 0.085 + id * 4.3, lz * 0.045 + id * 1.9)));
    lace *= 0.35 + 0.65 * smoothstep(0.3, 0.62, vnoise(vec2(p.x * 0.33, lz * 0.16 + id)));   // veined, never a white sheet
    lace *= smoothstep(0.5, 0.53, f) * (1. - smoothstep(0.62, 0.92, f)) * amp * (0.25 + 0.75 * grp) * (0.35 + 0.65 * melt) * (1. + 0.7 * rank);   // (the rank trails its torn foam down the back of every crest)
    // and the crossing train's own caps: short streaks along the wind, inside the same groups
    float wc = smoothstep(0.72, 0.97, sA) * smoothstep(0.55, 0.78, fbmLo(vec2(p.x * 0.05 + 3., p.y * 0.16))) * grp * (1. - smoothstep(0.6, 3.5, fp));
    vec3 foamC = uCloudC * 3.2 + uRimC * uBandAmt * 0.1;
    float foam = clamp(cap * 1.05 + lace * 0.6 + wc * 0.9, 0., 0.95);
    // THE LEADER'S LIGHT ON THE SEA (the brief's key light, seen from height). Every low tip (uPool: trunk, dive limbs,
    // the key) throws a wide pool, wider the higher it hangs, falling off over a few hundred metres. In it
    // the water takes its own lit colour, teal, and the swell is modelled: the light rakes it from the tip's side, so
    // the faces of the swell and of the two crossing trains that look at the tip are bright (violet-white at their
    // brightest) and the far faces stay deep teal; foam in the pool goes violet-white. Beyond it the sea is dark teal.
    float dcr = (f < 0.5 ? 1. : -1.) * 2.4 * tri * tri * tri * (0.3 + 0.7 * smoothstep(0.25, 0.7, vnoise(vec2(p.x * 0.019 + id * 3.1, id * 1.7))));   // steep at the crest, level in the trough, and broken along it
    vec2 gH = vec2(0., dcr * amp * melt * 0.6) + dA * cos((dot(p, dA) + wA + uTime * 0.2) * 0.1745) * kA * (0.3 + 0.7 * patchK) * 0.24
            + dB * cos((dot(p, dB) + wB - uTime * 0.15) * 0.0997) * kB * (1. - 0.7 * patchK) * 0.3 + (vec2(chopN, grain) - 0.5) * (0.25 * gk + 0.6 * near);
    gH += (vec2(fbmLo(vec2(p.x * 0.013, p.y * 0.031) + 61.), fbmLo(vec2(p.x * 0.013, p.y * 0.031) + 87.)) - 0.5) * 0.9 * (1. - smoothstep(2.5, 9., fpm));   // hummocks 40-80 m across, longer along the crests: the pool lies on a heaving floor, not on ruled lines
    float Es = 0.; vec3 Lv = vec3(0., 1e-3, 0.);
    for (int i = 0; i < 6; i++) {
      vec4 q = uPool[i]; vec2 dl = q.xz - p; float S = 180. + 0.75 * q.y, e = S * S / (S * S + dot(dl, dl)); e = q.w * e * sqrt(max(e, 0.));
      Es += e; Lv += e * vec3(dl.x, 0.45 * max(q.y, 30.) + 40., dl.y) / (S + length(dl));
    }
    Lv = normalize(Lv); Es = Es / (1. + 0.6 * Es) * (1. + uStroke) * (0.7 + 0.6 * squall);   // (broken by the squalls' rain)
    float shade = clamp(0.13 + 0.33 * Lv.y - 1.6 * dot(gH, Lv.xz), 0.04, 1.9);
    vec3 litC = mix(vec3(0.016, 0.105, 0.115), uSeaC * (0.085 / max(sl0, 1e-3)), 0.25) * uLitK, keyC = uViolet * 0.55 + uGlowC * 0.45;
    body += (litC * shade + keyC * 0.035 * shade * shade * shade) * Es * (0.75 + 0.35 * tone);
    body += litC * 0.2 * uSeaAmb * tone * (0.8 + 0.5 * swell + 0.25 * facet);                 // and beyond every pool the water is still deep teal under the cloud's own light, its swell just visible: never black
    vec3 col = mix(body, foamC * (0.8 + 0.3 * tone) * (1. + 0.5 * capS) + keyC * Es * (0.14 + 0.26 * shade) * (1. + 0.8 * rank), foam);   // a breaking front is the whitest thing on the floor, and the rank takes the leader's violet-white
    col += uRimC * uBandAmt * rim * 0.3;
    // THE GLITTER ROAD: the slot's light on the water, from under the camera out toward the slot. Glints drawn out
    // along the crests where a pixel can hold them, a steady sheen beyond; broad, cold, and nowhere else on the sea
    float rd = max(dot(hz, uRoadDir), 0.), rd2 = rd * rd, rd4 = rd2 * rd2; rd = rd4 * rd4 * rd2; rd *= rd;   // one tapering road, a third of the frame wide
    rd *= 0.55 + 0.45 * smoothstep(0.3, 0.7, fbmLo(p * 0.004 + 31.));   // ragged along its edges
    float spk = fbmLo(vec2(p.x * 0.1 + grain * 3., p.y * 0.38) + uTime * 0.05);
    float sk = 1. - smoothstep(1.5, 7., fpm);
    float glit = mix(0.3, 0.16 + smoothstep(0.58, 0.7, spk) * 1.7 * (0.6 + 0.4 * sA), sk) * (0.2 + 0.9 * crest * amp);   // bunched on the backs of the swell, dark water between
    float graze = 1. - clamp(-v.y, 0., 1.); graze = 0.6 + 1.1 * graze * graze * graze;
    col += uRoadC * uBandAmt * rd * glit * graze * 2.4 * (0.5 + 0.5 * tone);
    // the schooner's sign (she lies at the origin, bow to +X): a foam skirt round the hull, the wake astern, lamp
    // amber, and the violet of the ship limb, which is feeling its way down to her, lying on the water round her
    vec2 q = p - vec2(-10., 2.); float aft = -q.x - 18.;
    float skirt = exp(-(q.x * q.x / 600. + q.y * q.y / 42.)) * (0.5 + 0.5 * fbmLo(p * 0.4));
    float ww = 5. + 0.06 * max(aft, 0.), wk = smoothstep(-4., 14., aft) * exp(-max(aft, 0.) / 130.);
    float wake = wk * exp(-q.y * q.y / (ww * ww)) * (0.35 + 0.65 * fbmLo(vec2(p.x * 0.11, p.y * 0.3) + 3.));
    float ax = (abs(q.y) - 0.28 * max(aft, 0.) - 3.) / (2.2 + 0.02 * max(aft, 0.) + 2. * fp), arm = wk * exp(-max(aft, 0.) / 70.) * exp(-ax * ax) * 0.6;
    float shipK = 1. - smoothstep(4., 12., fp);
    col = mix(col, foamC * 1.1, clamp((skirt * 0.8 + wake * 0.85 + arm * 0.5) * shipK, 0., 0.9));
    col += vec3(1., 0.62, 0.3) * 0.2 * exp(-dot(q, q) / 1500.) * shipK;
    vec2 qs = p - uShipLit.xy; float sl = exp(-dot(qs, qs) / 16000.) + 0.5 * exp(-dot(qs, qs) / 2500.);
    col += (uViolet * 0.8 + uGlowC * 0.2) * uShipLit.z * sl * (0.35 + 0.8 * crest * amp + 1.6 * foam + 0.5 * smoothstep(0.55, 0.72, spk) * sk) * (1. + uStroke);
    // the breaker's sign: the whitewater of its broken shoulder running off to the south, the dark trough under its face
    vec2 qb = p - vec2(-28., 223. + 0.0004 * (p.x + 28.) * (p.x + 28.));
    float along = -qb.x, shK = smoothstep(-6., 10., along) * exp(-max(along, 0.) / 95.);
    float shW = 4. + 0.07 * max(along, 0.) + 1.5 * fpz, sh = shK * exp(-qb.y * qb.y / (shW * shW)) * (0.3 + 0.7 * smoothstep(0.3, 0.6, fbmLo(vec2(p.x * 0.12, p.y * 0.35) + 9.)));
    float sh2 = shK * (1. - smoothstep(-3., 0., qb.y)) * exp(min(qb.y, 0.) / (14. + 0.1 * max(along, 0.))) * smoothstep(0.42, 0.7, fbmLo(vec2(p.x * 0.07, p.y * 0.2) + 5.)) * 0.6;   // foam left behind it, torn into lace
    col = mix(col, foamC * 1.1, clamp((sh + sh2) * shipK, 0., 0.9));
    vec2 qt = p - vec2(4., 236.); col *= 1. - 0.45 * exp(-(qt.x * qt.x / 1500. + qt.y * qt.y / 110.)) * shipK;
    // the leader's own light on the water under its nearest tip (the violet pools are drawn over this)
    vec3 kd = uKey - vW; col += uViolet * uKeyI * (1. + uStroke) * 0.05 * 9000. / (9000. + dot(kd, kd)) * (0.5 + crest * amp + foam);
    // pocked by the rain, close to: soft rings walking outward in 7 m cells (never finer than a pixel and a half)
    vec2 pc = p / 7., ci = floor(pc), cf = fract(pc) - 0.5 - (hash22(ci) - 0.5) * 0.5;
    float pg = fract(hash12(ci + 7.7) + uTime * 0.09), pw = max(0.035, 1.6 * fp / 7.), pr = (length(cf) - (0.05 + 0.22 * pg)) / pw;
    float pk = exp(-pr * pr) * (1. - pg) * step(0.4, hash12(ci + 3.1)) * min(1., 0.035 / pw) * (1. - smoothstep(0.15, 0.5, fp));
    col += foamC * 0.3 * pk;
    col = wfog(col, dist * mix(1., 0.62, smoothstep(90., 380., uCam.y)));   // from height the floor keeps its shapes through the murk, as the ceiling does
    vec4 slt = slotAt(hz, uBandDir, uTime); float dnH = max(-el, 0.);
    col = mix(col, uFarSea * farTone(p, dnH), smoothstep(1500., 3100., dist));      // (the dome carries the far sea on from here: the same tone, lanes and sheen)
    col += uBandC * uBandAmt * slotSheen(slt, slotAz(hz, uBandDir), dnH, uResY) * smoothstep(30., 150., uCam.y);
    gl_FragColor = vec4(max(col, 0.), uHigh);
  }`,ga=`
  attribute float aLayer; uniform vec3 uCam;
  varying vec3 vW; varying float vFade; varying float vSeed;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vSeed = aLayer;
    vFade = smoothstep(25., 170., uCam.y - wp.y);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }`,wa=Pe.GLSL_NOISE+Ge+ua+`
  uniform vec3 uCloudC, uBandC, uSeaC, uViolet, uCam; uniform float uBandAmt, uTime, uStroke; uniform vec2 uBandDir;
  varying vec3 vW; varying float vFade; varying float vSeed;
  void main() {
    if (vFade < 0.004) discard;
    vec2 p = vW.xz + vSeed * 517.3, dr = vec2(uTime * 0.9, -uTime * 0.5);
    float n = fbm((p + dr) * 0.0042), n2 = fbm((p - dr * 1.6) * 0.017 + 9.);
    float a = smoothstep(0.47, 0.76, n + (n2 - 0.5) * 0.4);
    float e = fbm((p + dr + uBandDir * 40.) * 0.0042) - n;               // the flank that faces the slot
    vec3 col = mix(uFogC * 1.2, uCloudC * 1.3 + uSeaC * 0.6, n2);
    col += uBandC * uBandAmt * clamp(-e * 6., 0., 1.) * 0.2;
    col += uViolet * min(poolInAir(vW), 1.2) * 0.11 * (1. + 1.2 * uStroke);
    col = wfog(col, length(vW - uCam) * 0.7);
    float rad = 1. - smoothstep(700., 1450., length(vW.xz - uCam.xz));
    gl_FragColor = vec4(max(col, 0.), a * 0.14 * vFade * rad);                 // a breath of murk over the dark floor, never a pale blob
  }`,ya=`
  attribute vec3 iPos; attribute vec4 iParm; attribute vec2 iSlope;      // iParm: radius, phase, rate, seed
  uniform float uTime;
  varying vec2 vQ; varying float vG; varying float vDist; varying vec3 vW; varying float vPx;
  void main() {
    vG = fract(uTime * iParm.z + iParm.y);
    vec3 t1 = normalize(vec3(1., iSlope.x, 0.)), t2 = normalize(vec3(0., iSlope.y, 1.));
    vec3 wp = iPos + (t1 * position.x + t2 * position.y) * iParm.x;
    vQ = position.xy; vW = wp;
    vec4 mv = viewMatrix * vec4(wp, 1.); vDist = length(mv.xyz); vPx = iParm.x / max(vDist, 0.3);
    gl_Position = projectionMatrix * mv;
  }`,xa=Ge+`
  uniform vec3 uCloudC, uBandC, uSeaC, uViolet, uKey; uniform float uBandAmt, uKeyI; uniform vec2 uBandDir;
  varying vec2 vQ; varying float vG; varying float vDist; varying vec3 vW; varying float vPx;
  void main() {
    float r = length(vQ); if (r > 1.) discard;
    float g = vG, R = mix(0.14, 0.9, sqrt(max(g, 0.)));                           // the ring walks outward
    float life = smoothstep(0., 0.08, g) * (1. - smoothstep(0.5, 1., g)) * smoothstep(0.003, 0.009, vPx);
    float w = 0.05 + 0.05 * g, d1 = (r - R) / w, d2 = (r - R * 0.55) / w;
    float ring = exp(-d1 * d1) + 0.5 * exp(-d2 * d2);
    float crater = (1. - smoothstep(0., 0.16 + 0.1 * g, r)) * (1. - smoothstep(0.15, 0.6, g));
    vec2 dn = vQ / max(r, 1e-3);
    float lit = 0.5 + 0.5 * dot(dn, uBandDir);                           // the flank of the ring that faces the slot
    vec3 light = uCloudC * 1.1 + uBandC * uBandAmt * 0.8 * smoothstep(0.35, 1., lit) + uViolet * uKeyI * 0.3 * 120. / (120. + distance(uKey, vW));
    float al = ring * life * 0.5, ad = (crater * 0.65 + ring * 0.3 * (1. - lit)) * life;
    float a = clamp(al * 0.6 + ad, 0., 0.92);
    vec3 col = light * al + uSeaC * 0.35 * ad;
    float fq = uFogD * vDist, ft = exp(-fq * fq);
    gl_FragColor = vec4(max(mix(uFogC * a, col, ft), 0.), a);
  }`,ba=`
  attribute vec3 aQ;                                                     // ribbon: metres round the hull, 0 foot .. 1 top, 1;  sheet: 0, 0, 0
  varying vec3 vW; varying vec3 vQ; varying float vDist;
  void main() { vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vQ = aQ; vec4 mv = viewMatrix * wp; vDist = length(mv.xyz); gl_Position = projectionMatrix * mv; }`,Ca=Pe.GLSL_NOISE+Ge+`
  uniform vec3 uCloudC, uRimC, uViolet; uniform float uBandAmt, uTime, uHigh, uKeyI, uStroke;
  varying vec3 vW; varying vec3 vQ; varying float vDist;
  void main() {
    vec3 foamC = uCloudC * 2.4 + uRimC * uBandAmt * 0.14 + uViolet * uKeyI * 0.12 * (1. + uStroke);
    float a = 0., lamp = 0.;
    if (vQ.z > 0.5) {
      float top = 0.3 + 0.65 * fbmLo(vec2(vQ.x * 0.7, uTime * 0.05));
      a = (1. - smoothstep(top * 0.45, top, vQ.y)) * smoothstep(0., 0.1, vQ.y) * (0.5 + 0.5 * fbmLo(vec2(vQ.x * 2.3 + 5., vQ.y * 3. - uTime * 0.04))) * 0.85;
    } else {
      vec2 q = vW.xz - vec2(-10., 1.5);
      float e = sqrt(q.x * q.x / 470. + q.y * q.y / 30.), d1 = (e - 1.) * 3.;
      float skirt = exp(-d1 * d1) * (0.3 + 0.7 * fbmLo(vW.xz * 0.5 + uTime * 0.03));
      float aft = -q.x - 20., ww = 4. + 0.07 * max(aft, 0.), wk = smoothstep(-6., 8., aft) * exp(-max(aft, 0.) / 60.) * (1. - smoothstep(70., 100., aft));
      float wake = wk * exp(-q.y * q.y / (ww * ww)) * smoothstep(0.3, 0.62, fbmLo(vec2(vW.x * 0.16, vW.z * 0.45) + 3. - uTime * 0.02));
      a = clamp(skirt * 0.8 + wake * 0.75, 0., 0.9);
      float xi = (vW.x + 24.) / 4., ni = clamp(floor(xi + 0.5), 0., 7.), dx = (xi - ni) * 4., dz = max(vW.z - 4.4, 0.);
      lamp = exp(-dx * dx / (0.4 + 0.03 * dz * dz)) * smoothstep(3.6, 5., vW.z) * exp(-dz / 9.) * (1. - smoothstep(18., 26., dz));
      lamp *= 0.3 + 0.7 * smoothstep(0.3, 0.6, vnoise(vec2(vW.x * 1.3, vW.z * 0.8 - uTime * 0.25)));
    }
    float k = 1. - uHigh, fq = uFogD * vDist, ft = exp(-fq * fq);
    a *= k;
    gl_FragColor = vec4(max(mix(uFogC * a, foamC * a, ft) + vec3(1., 0.62, 0.3) * lamp * 1.1 * k * ft, 0.), a);
  }`,ka=`
  attribute vec2 aF;                                                     // wing: chord (0 leading edge .. 1 trailing), span (0 root .. 1 wrist tip, > 1 primaries); body: x < 0
  varying vec3 vW; varying vec3 vN; varying vec3 vC; varying float vDist; varying vec2 vF;
  void main() {
    mat4 m = modelMatrix * instanceMatrix;
    vec4 wp = m * vec4(position, 1.); vW = wp.xyz; vN = mat3(m) * normal; vC = color; vF = aF;
    vec4 mv = viewMatrix * wp; vDist = length(mv.xyz); gl_Position = projectionMatrix * mv;
  }`,Sa=Ge+`
  uniform vec3 uCloudC, uBandC, uSeaC, uViolet, uGlowC, uKey, uCam; uniform float uBandAmt, uKeyI, uStroke; uniform vec2 uBandDir;
  varying vec3 vW; varying vec3 vN; varying vec3 vC; varying float vDist; varying vec2 vF;
  void main() {
    float wing = step(0., vF.x), ch = clamp(vF.x, 0., 1.), sp = vF.y, fk = wing * (1. - smoothstep(3., 9., vDist)) * step(sp, 1.02);
    float fs = fract(sp * 13. + 0.5), tipC = 1. - 0.085 * (1. - sin(3.14159 * fs)) * fk;
    if (ch > tipC) discard;                                              // the secondaries' rounded tips
    vec3 n = normalize(vN + vec3(0., 1e-4, 0.)), v = normalize(uCam - vW + vec3(0., 1e-5, 0.));
    if (dot(n, v) < 0.) n = -n;
    float ndv = clamp(dot(n, v), 0., 1.), rim = (1. - ndv) * (1. - ndv);
    vec3 lb = normalize(vec3(uBandDir.x, 0.14, uBandDir.y));             // light from the slot, low in the west
    vec3 l = uKey - vW; float ld = max(length(l), 1e-3); l /= ld;
    float ki = uKeyI * (1. + 1.2 * uStroke) * 60. / (60. + ld);
    vec3 E = mix(uSeaC * 3., uCloudC * 4.5, 0.5 + 0.5 * n.y) + uBandC * uBandAmt * 1.3 * max(dot(n, lb), 0.) + uViolet * ki * 1.6 * max(dot(n, l), 0.);
    float white = smoothstep(0.2, 0.6, vC.r);                            // the rump
    float under = 1. - smoothstep(-0.35, 0.1, n.y);                           // the side that looks at the sea: a second, paler tone
    float wrap = dot(n, lb) * 0.5 + 0.5; wrap *= wrap;                   // the slot's light wraps round the bird
    vec3 alb = mix(vC * 0.85 + 0.035, vC * 0.6 + vec3(0.11, 0.1, 0.1), under * (1. - white));
    // feathers
    float seam = smoothstep(0., 0.14, fs) * (1. - smoothstep(0.84, 1., fs));    // dark where one feather lies on the next
    float sec = smoothstep(0.54, 0.58, ch), cov = smoothstep(0.3, 0.35, ch) * (1. - sec);
    float fsc = fract(sp * 21.), seamC = smoothstep(0., 0.2, fsc) * (1. - smoothstep(0.75, 1., fsc));
    float shade = mix(1., 0.55 + 0.45 * seam, sec) * mix(1., 0.72 + 0.28 * seamC, cov);
    shade *= 1. - 0.5 * smoothstep(0.54, 0.575, ch) * (1. - smoothstep(0.575, 0.68, ch));   // the coverts' shadow on the secondaries
    shade *= 1. - 0.28 * sec * smoothstep(0.6, 1., ch);                  // each secondary darkens toward its tip
    float shaft = (1. - smoothstep(0.03, 0.08, abs(fs - 0.5))) * sec;
    float bar = cov * (1. - smoothstep(0.5, 0.82, sp));                   // the pale carpal bar
    alb = mix(alb, (alb * shade + vec3(0.05, 0.045, 0.045) * shaft) + vec3(0.17, 0.15, 0.14) * bar * (0.55 + 0.45 * seamC), fk);
    vec3 col = alb * (E + uBandC * uBandAmt * 0.7 * wrap + uCloudC * 1.6 * under);
    col += uBandC * uBandAmt * rim * (0.3 + 0.7 * wrap) * 1.5 + uCloudC * rim * 0.6;   // lemon edge on the wing nearest the slot
    col += uBandC * uBandAmt * wing * (1. - smoothstep(0., 0.08, ch)) * (0.25 + 0.75 * wrap) * 0.55;   // and along the leading edge
    col += white * uBandC * uBandAmt * (0.5 + 0.5 * wrap) * 0.6 + uGlowC * ki * pow(max(dot(reflect(-v, n), l), 0.), 16.) * 0.35;
    gl_FragColor = vec4(wfog(max(col, 0.), vDist), 1.);
  }`,Aa=`
  attribute vec3 aOther; attribute vec2 aCorner; uniform float uResY;
  varying float vA; varying float vDist;
  void main() {
    vec4 a = modelViewMatrix * vec4(position, 1.), b = modelViewMatrix * vec4(aOther, 1.);
    vec3 ax = b.xyz - a.xyz; float L = length(ax); ax = L > 1e-4 ? ax / L : vec3(0., 1., 0.);
    vec3 p = mix(a.xyz, b.xyz, aCorner.x);
    float dist = max(length(p), 0.3);
    vec3 sd = cross(ax, -p / dist); float sl = length(sd); sd = sl > 1e-4 ? sd / sl : vec3(1., 0., 0.);
    float pxPerM = uResY * projectionMatrix[1][1] * 0.5 / dist;
    float w = max(0.035, 0.8 / max(pxPerM, 1e-4));
    vA = clamp(0.035 / w, 0.3, 1.); vDist = dist;
    gl_Position = projectionMatrix * vec4(p + sd * aCorner.y * w, 1.);
  }`,za=Ge+`
  varying float vA; varying float vDist;
  void main() { gl_FragColor = vec4(wfog(vec3(0.011, 0.01, 0.012), vDist), vA * 0.92); }`,Ma=`
  uniform vec4 uSeaL[4]; uniform vec3 uLTeal, uLKeyC, uLRimC; uniform vec2 uLBandDir; uniform float uLAmb, uLStroke;
  vec3 leaderOnSea(vec3 P, vec3 N, vec3 V, float crest, float fa, float rough, float dist, float glit) {
    float body = 0., spec = 0., ndv = max(dot(N, V), 0.), fres = 1. - ndv; fres = 0.2 + 0.8 * fres * fres;
    float r = clamp(rough * 1.2 + 0.085, 0.085, 0.5), r2 = r * r;
    for (int i = 0; i < 4; i++) {
      vec4 q = uSeaL[i]; vec3 l = q.xyz - P; float d2 = dot(l, l), S = 120. + 0.8 * max(q.y, 0.);
      float e = q.w * S * S / (S * S + d2);
      l *= inversesqrt(max(d2, 1e-4));
      float ndl = dot(N, l);
      body += e * clamp(0.26 + 3.4 * (ndl - 0.8 * l.y), 0.05, 2.);
      vec3 h = l + V; h *= inversesqrt(max(dot(h, h), 1e-6));
      float ndh = max(dot(N, h), 0.), n2 = ndh * ndh, t2 = (1. - n2) / max(n2, 1e-3);
      spec += e * exp(-t2 / r2) / (r * 4.5) * step(0., ndl);
    }
    body = body / (1. + 0.45 * body) * (1. + uLStroke);
    float rim = smoothstep(0.14, 0.33, dot(N.xz, uLBandDir)) * crest * (0.35 + 0.65 * crest) * exp(-dist * 0.0045);   // (only where a west face is steep, 10 to 20 degrees: the shoulder of a crest. A thin rim, never a wash: from the skim every west face is seen edge-on)
    spec *= mix(1., 0.3 + 5. * glit, smoothstep(0.1, 0.24, r));                      // unresolved chop breaks the road into glitter (the kit's own)
    vec3 col = uLTeal * (uLAmb * (0.62 + 0.6 * crest) + 0.8 * body * (0.5 + 0.8 * crest)) * (1. - 0.55 * fa);   // (the troughs take half of it: the sea heaves; foam keeps the kit's own tone and takes little more)
    col += uLKeyC * (min(spec * fres, 0.8) * (1. - 0.6 * fa) + 0.04 * body * fa) * (1. + uLStroke);
    col += uLRimC * rim * 0.6;                                                       // THE BRIEF'S LEMON RIM on every crest that shoulders up toward the slot
    // (5) THE SLOT LYING ON THE FAR WATER: out toward the west, where the water is seen at a grazing angle, it mirrors
    // the slot: glints of its colour, a road of them (and a soft sheen under them) below the slot's heart and a thin
    // scatter either side, where the water between the glints stays teal; near the lens there is none of it
    vec2 hz = -V.xz * inversesqrt(max(dot(V.xz, V.xz), 1e-6));
    float ch = max(dot(hz, vec2(uLBandDir.x * 0.9856 + uLBandDir.y * 0.169, uLBandDir.y * 0.9856 - uLBandDir.x * 0.169)), 0.);
    float c2 = ch * ch, core = c2 * c2 * ch, h2 = core * core, h4 = h2 * h2, heart = h4 * h4 * h2;
    float gz = 1. - clamp(V.y, 0., 1.); gz *= gz; gz *= gz; gz *= gz;
    col += uLRimC * ((0.1 * core + 0.9 * heart) * (0.15 + 2.2 * smoothstep(0.05, 0.3, glit)) + 0.6 * heart) * gz * smoothstep(120., 500., dist) * 0.3 * (1. - fa);
    return col;
  }
  // ... laid over what the kit drew. Near the lens the kit's broad mirror of the slot (cream blotches, white by day) is
  // drawn in under a soft knee first, so the water there stays teal and the slot is glints on it; and where the kit's
  // water is already bright (foam, the glitter path) the leader adds little: nothing of the water burns out.
  vec3 leaderSeaMix(vec3 col, vec3 lit, float fa, float dist) {
    const vec3 LW = vec3(0.2126, 0.7152, 0.0722);
    col *= 1. / (1. + 3. * max(dot(col, LW) - 0.08, 0.) * (1. - fa) * exp(-dist * 0.008));
    return col + lit * (1. - 0.85 * smoothstep(0.07, 0.35, dot(col, LW)));
  }
`;function Ke(o,n){o.index&&(o=o.toNonIndexed());const h=o.attributes.position.count,C=new Float32Array(h*3),m=new t.Color(n);for(let s=0;s<h;s++)C[s*3]=m.r,C[s*3+1]=m.g,C[s*3+2]=m.b;return o.setAttribute("color",new t.BufferAttribute(C,3)),o.attributes.uv&&o.deleteAttribute("uv"),o.attributes.normal||o.computeVertexNormals(),o}const La=R(0,1,0),Ko=new t.Quaternion,Ba=new t.Matrix4;function qe(o,n,h,C,m,s=6){const S=R(...o),z=R(...n),u=z.clone().sub(S),A=u.length(),p=new t.CylinderGeometry(C,h,A,s,1);return Ko.setFromUnitVectors(La,u.multiplyScalar(1/A)),p.applyMatrix4(Ba.compose(S.add(z).multiplyScalar(.5),Ko,R(1,1,1))),Ke(p,m)}function qo(o,n,h,C,m,s,S){const z=[],u=[];for(let p=0;p<=m;p++)for(let M=0;M<=m;M++){const B=M/m,j=p/m,g=Math.sin(Math.PI*B)*Math.sin(Math.PI*(.15+.7*j))*s;for(let i=0;i<3;i++)z.push($($(o[i],n[i],B),$(C[i],h[i],B),j)+(i===2?g:0))}for(let p=0;p<m;p++)for(let M=0;M<m;M++){const B=p*(m+1)+M;u.push(B,B+1,B+m+1,B+1,B+m+2,B+m+1)}const A=new t.BufferGeometry;return A.setAttribute("position",new t.Float32BufferAttribute(z,3)),A.setIndex(u),A.computeVertexNormals(),Ke(A,S)}const Dt=o=>3.7*Math.pow(Math.sin(Math.PI*Math.min(1,.1+.9*o)),.6),Rt=o=>2.4+1.7*o*o+.5*(1-o)*(1-o);async function Fa(o){const n=[],m=[],s=[];for(let y=0;y<=20;y++){const D=y/20,G=-30+40*D,N=Dt(D),Z=Rt(D),ue=-3.2*(1-D*D*D*D);for(let ae=0;ae<=8;ae++){const Y=Math.PI*ae/8;m.push(G,Z-(Z-ue)*Math.pow(Math.sin(Y),.7),N*Math.cos(Y))}}for(let y=0;y<20;y++)for(let D=0;D<8;D++){const G=y*9+D;s.push(G,G+1,G+8+1,G+1,G+8+2,G+8+1)}const S=new t.BufferGeometry;S.setAttribute("position",new t.Float32BufferAttribute(m,3)),S.setIndex(s),S.computeVertexNormals(),n.push(Ke(S,"#10141a"));const z=[],u=[];for(let y=0;y<=20;y++){const D=y/20,G=-30+40*D,N=Dt(D)*.94,Z=Rt(D)-.55;z.push(G,Z,N,G,Z,-N)}for(let y=0;y<20;y++)u.push(y*2,y*2+2,y*2+1,y*2+1,y*2+2,y*2+3);const A=new t.BufferGeometry;A.setAttribute("position",new t.Float32BufferAttribute(z,3)),A.setIndex(u),A.computeVertexNormals(),n.push(Ke(A,"#4a4234")),await o.yield();const p="#2b2118",M="#17130f",B="#8f8876",j=[],g=[[0,30],[-11,30.5],[-22,28]];for(const[y,D]of g){n.push(qe([y,0,0],[y,D,0],.32,.13,p,7)),n.push(qe([y,D*.74,-1.6],[y,D*.74,1.6],.07,.07,M,4));for(const G of[-1,1])for(let N=0;N<3;N++){const Z=y-.4-N*.9,ue=(Z+30)/40;j.push([y,D*.74,G*.2],[Z,Rt(ue),G*Dt(ue)])}}await o.yield(),n.push(qe([8.5,3.9,0],[17.5,6.2,0],.24,.1,p)),n.push(qe([0,22,-3.2],[0,22,3.2],.12,.08,p)),n.push(qe([-.4,5.6,0],[-9.6,6.2,0],.16,.13,p),qe([-.4,14.2,0],[-8.6,16.8,0],.13,.1,p)),n.push(qe([-11.4,5.6,0],[-21,6,0],.16,.13,p),qe([-11.3,6.1,0],[-20.6,6.5,0],.36,.3,B,7)),n.push(qe([-22.4,5.4,0],[-31.5,5.9,0],.15,.12,p),qe([-22.3,5.9,0],[-31,6.4,0],.33,.27,B,7)),n.push(qo([-.6,6.1,0],[-9.2,6.6,0],[-8.3,16.4,0],[-.6,14,0],7,1,B)),n.push(qo([2.4,4.6,0],[16.8,6.1,0],[.5,19.5,0],[.5,19.5,0],6,.7,B)),j.push([17.5,6.2,0],[0,29,0],[0,29.6,0],[-11,30.1,0],[-11,30.1,0],[-22,27.7,0],[-22,27.7,0],[-30,3.2,0],[17.5,6.2,0],[0,21.5,0]);for(const[y,D]of[[-6,4],[-17,5.2],[-26.5,2.4]]){const G=new t.BoxGeometry(D,1.5,2.7);G.translate(y,Rt((y+30)/40)+.2,0),n.push(Ke(G,"#241f1a"))}await o.yield();const i=Lo(n,!1);for(const y of n)y.dispose();await o.yield();const I=j.length/2,x=[],k=[],K=[],X=[];for(let y=0;y<I;y++){const D=j[y*2],G=j[y*2+1];for(let N=0;N<4;N++)x.push(D[0],D[1],D[2]),k.push(G[0],G[1],G[2]),K.push(N>>1,(N&1)*2-1);X.push(y*4,y*4+1,y*4+2,y*4+2,y*4+1,y*4+3)}const V=new t.BufferGeometry;return V.setAttribute("position",new t.Float32BufferAttribute(x,3)),V.setAttribute("aOther",new t.Float32BufferAttribute(k,3)),V.setAttribute("aCorner",new t.Float32BufferAttribute(K,2)),V.setIndex(X),V.boundingSphere=new t.Sphere(R(-8,14,0),40),{hull:i,rigging:V}}async function Ta(o){const n=[],h=new t.SphereGeometry(1,14,10);{const x=h.attributes.position;for(let k=0;k<x.count;k++){const K=x.getX(k),X=K<0?1-.55*K*K:1-.18*K*K,V=K<0?.25*K*K:0;x.setXYZ(k,K*.088,(x.getY(k)*X+V)*.034-(K>0?.004*K:0),x.getZ(k)*X*.039)}h.computeVertexNormals()}await o.yield(),n.push(Ke(h,"#1d1b1d"));const C=new t.SphereGeometry(1,10,8);C.scale(.027,.024,.023),C.translate(.09,.014,0),n.push(Ke(C,"#19171a"));const m=new t.ConeGeometry(.0065,.032,5);m.rotateZ(-Math.PI/2-.25),m.translate(.124,.007,0),n.push(Ke(m,"#0c0c0d"));const s=new t.SphereGeometry(1,10,8);s.scale(.03,.019,.034),s.translate(-.058,.019,0),n.push(Ke(s,"#d9dde0"));for(const x of[-1,1]){const k=new t.BoxGeometry(.075,.005,.024);k.rotateY(x*.16),k.translate(-.118,.008,x*.012),n.push(Ke(k,"#151416"))}await o.yield();for(const x of[-1,1]){n.push(qe([-.03,-.025,x*.012],[-.056,-.086,x*.017],.0017,.0012,"#0d0d0e",4));const k=new t.BoxGeometry(.02,.002,.012);k.rotateZ(.5),k.translate(-.05,-.091,x*.017),n.push(Ke(k,"#101011"))}await o.yield();const S=Lo(n,!1);for(const x of n)x.dispose();await o.yield();{const x=S.attributes.position.count,k=new Float32Array(x*2);for(let K=0;K<x;K++)k[K*2]=-1;S.setAttribute("aF",new t.BufferAttribute(k,2))}const z=[[0,.04,-.046,0],[.028,.045,-.047,.005],[.056,.049,-.046,.009],[.084,.052,-.042,.012],[.112,.05,-.037,.014],[.138,.04,-.04,.014],[.162,.026,-.045,.012],[.184,.01,-.049,.009],[.204,-.008,-.05,.005],[.222,-.03,-.047,0]],u=[],A=[],p=[],M=[],B=new t.Color("#201d21"),j=new t.Color("#5a5356"),g=new t.Color("#141215"),i=z.length;z.forEach(([x,k,K,X],V)=>{const y=V/(i-1),D=k-K,G=D*.14;u.push(k,X-G*.5,x,k-D*.35,X+G*.5,x,K,X-G*.35,x),M.push(0,y,.35,y,1,y);const N=B.clone().lerp(g,y),Z=y<.7?j.clone().lerp(B,y/.7):g.clone(),ue=N.clone().lerp(Z,.3);if(A.push(N.r,N.g,N.b,ue.r,ue.g,ue.b,Z.r,Z.g,Z.b),V<i-1)for(let ae=0;ae<2;ae++){const Y=V*3+ae;p.push(Y,Y+1,Y+3,Y+1,Y+4,Y+3)}});for(let x=0;x<3;x++){const k=u.length/3,K=-.012-.014*x,X=.2-.006*x,V=.75+.2*x,y=.05-.007*x,D=-Math.sin(V),G=Math.cos(V);u.push(K+G*.006,.003,X+D*-.006,K-G*.006,.002,X-D*-.006,K+D*y,-.002-.002*x,X+G*y);for(let N=0;N<3;N++)A.push(g.r,g.g,g.b),M.push(.5,1.5);p.push(k,k+1,k+2)}const I=new t.BufferGeometry;return I.setAttribute("position",new t.Float32BufferAttribute(u,3)),I.setAttribute("color",new t.Float32BufferAttribute(A,3)),I.setAttribute("aF",new t.Float32BufferAttribute(M,2)),I.setIndex(p),I.computeVertexNormals(),{body:S,wing:I}}function Ea(o){const n=[],h=[],C=[],m=[],s=[],S=o?40:32,z=o?3:2;for(let g=0;g<=z;g++)for(let i=0;i<=S;i++){const I=i/S*Math.PI*2,x=g/z,k=.62+.38*x*x,K=g===z?.8+.2*Math.cos(I*8):1,X=o?-.76*x-.12:-.34,V=Math.hypot(1,X);n.push(Math.cos(I)*k,x*K,Math.sin(I)*k),h.push(Math.cos(I)/V,X/V,Math.sin(I)/V),C.push(0,0,0),m.push(0)}for(let g=0;g<z;g++)for(let i=0;i<S;i++){const I=g*(S+1)+i;s.push(I,I+S+1,I+1,I+1,I+S+1,I+S+2)}const u=o?new t.OctahedronGeometry(1,1):null,A=o?[]:[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],p=[0,2,4,2,1,4,1,3,4,3,0,4,2,0,5,1,2,5,3,1,5,0,3,5];if(u){const g=u.attributes.position;for(let i=0;i<g.count;i++)A.push([g.getX(i),g.getY(i),g.getZ(i)]);u.dispose()}for(let g=0;g<8;g++){const i=g/8*Math.PI*2,I=[Math.cos(i),1.05,Math.sin(i)],x=n.length/3;for(const k of A)n.push(I[0]+k[0]*.075,I[1]+k[1]*.085,I[2]+k[2]*.075),h.push(k[0],k[1],k[2]),C.push(I[0],I[1],I[2]),m.push(1);if(o)for(let k=0;k<A.length;k++)s.push(x+k);else for(const k of p)s.push(x+k)}const M=n.length/3,B=o?10:6;for(let g=0;g<B;g++){const i=g/B*Math.PI*2;n.push(Math.cos(i)*.16,0,Math.sin(i)*.16),h.push(Math.cos(i),.3,Math.sin(i)),C.push(0,0,0),m.push(2)}if(o){for(let g=0;g<B;g++){const i=g/B*Math.PI*2;n.push(Math.cos(i)*.1,.82,Math.sin(i)*.1),h.push(Math.cos(i),.5,Math.sin(i)),C.push(0,0,0),m.push(2)}n.push(0,1,0),h.push(0,1,0),C.push(0,0,0),m.push(2);for(let g=0;g<B;g++){const i=(g+1)%B;s.push(M+g,M+B+g,M+i,M+i,M+B+g,M+B+i,M+B+g,M+2*B,M+B+i)}}else{n.push(0,1,0),h.push(0,1,0),C.push(0,0,0),m.push(2);for(let g=0;g<6;g++)s.push(M+g,M+6,M+(g+1)%6)}const j=new t.InstancedBufferGeometry;return j.setAttribute("position",new t.Float32BufferAttribute(n,3)),j.setAttribute("normal",new t.Float32BufferAttribute(h,3)),j.setAttribute("aC",new t.Float32BufferAttribute(C,3)),j.setAttribute("aK",new t.Float32BufferAttribute(m,1)),j.setIndex(s),j}const Wo=[[-30,222],[-12,225],[6,226],[18,224],[25.5,218],[28.6,210],[28.2,203],[24,195.5],[17,188]],Jt=[[13,-.6,0],[7,.5,0],[3.4,2.6,0],[1.9,5.4,.1],[2.4,7.8,.3],[4.6,9.5,.6],[7.4,10.1,.85],[9.8,9.6,1],[7.7,10.5,.75],[4.6,11,.4],[1,10.4,.12],[-3,8.6,.03],[-8,5,0],[-13,1.6,0],[-18,-.6,0]];async function ho(o,n){const h=o.attributes.position.array,C=o.index.array,m=new Float32Array(h.length);for(let s=0;s<C.length;s+=3){const S=C[s]*3,z=C[s+1]*3,u=C[s+2]*3,A=h[u]-h[z],p=h[u+1]-h[z+1],M=h[u+2]-h[z+2],B=h[S]-h[z],j=h[S+1]-h[z+1],g=h[S+2]-h[z+2],i=p*g-M*j,I=M*B-A*g,x=A*j-p*B;m[S]+=i,m[S+1]+=I,m[S+2]+=x,m[z]+=i,m[z+1]+=I,m[z+2]+=x,m[u]+=i,m[u+1]+=I,m[u+2]+=x,s%9e3===8997&&await n.yield()}for(let s=0;s<m.length;s+=3){const S=Math.hypot(m[s],m[s+1],m[s+2])||1;m[s]/=S,m[s+1]/=S,m[s+2]/=S}o.setAttribute("normal",new t.BufferAttribute(m,3))}function It(o,n,h){const C=o.getPointAt(n),m=o.getTangentAt(n),s=.012,S=o.getTangentAt(Math.max(0,n-s)),z=o.getTangentAt(Math.min(1,n+s)),u=(S.x*z.z-S.z*z.x)/Math.max((Math.min(1,n+s)-Math.max(0,n-s))*o.getLength(),.001);h.cx=C.x,h.cz=C.z,h.nx=-m.z,h.nz=m.x;const A=.2*(1-Ie(.4,.54,n))*we(.5+.3*Math.sin(n*21+.9)+.2*Math.sin(n*47+2.3),0,1);return h.env=Math.pow(Ie(0,.44,n),.95)*Math.pow(1-Ie(.8,1,n),.8)*(1-A),h.over=Ie(.8,.975,h.env),h.rc=u<-1e-4?we(-.85/u,4,1e4):1e4,h}function co(o,n,h){if(n>=0)return Math.min(n,3.4)*(.45+.55*o.env)+Math.max(n-3.4,0)*o.over+h*1.5;const C=n*(.45+.55*o.env)+h*1.5;return C<0?-o.rc*(1-Math.exp(C/o.rc)):C}async function Da(o,n,h,C){const m=new t.CatmullRomCurve3(Wo.map(a=>R(a[0],0,a[1])),!1,"centripetal"),s=m.getLength(),S=new t.CatmullRomCurve3(Jt.map(a=>R(a[0],a[1],0)),!1,"centripetal"),z=Jt.length-1,u=52,A=260,p=16,M=36,B=18,j=34,g=R(),i={},I=a=>{S.getPoint(a/z,g);const v=Math.min(z-1,Math.floor(a));return[g.x,g.y,$(Jt[v][2],Jt[v+1][2],a-v)]},x=a=>a.env*(.5+.5*a.over),k=(a,v,c,b,q)=>{const _=new t.BufferGeometry;return _.setAttribute("position",new t.Float32BufferAttribute(a,3)),_.setAttribute("aInfo",new t.Float32BufferAttribute(v,3)),_.setAttribute("aDir",new t.Float32BufferAttribute(c,2)),_.setAttribute("aL",new t.Float32BufferAttribute(b,3)),_.setIndex(q),_},K=[],X=[],V=[],y=[],D=[],G=[],N=[];for(let a=0;a<=u;a++)N.push(I(a/u*z));for(let a=0;a<=A;a++){const v=a/A,c=v*s;It(m,v,i);const b=o.n2(c*.08,9.1),q=x(i);for(let _=0;_<=u;_++){const[H,ee,he]=N[_],ve=co(i,H,b);K.push(i.cx+i.nx*ve,(ee+.6)*i.env-.6,i.cz+i.nz*ve),X.push(he*q,0,v),V.push(i.nx,i.nz),y.push(c,ee,H)}a%8===7&&await n.yield()}for(let a=0;a<A;a++)for(let v=0;v<u;v++){const c=a*(u+1)+v;(v>=B&&v<j?G:D).push(c,c+1,c+u+1,c+1,c+u+2,c+u+1)}await n.yield();const Z=k(K,X,V,y,D.concat(G));await n.yield(),await ho(Z,n),await n.yield();const ue=k(K,X,V,y,D);ue.setAttribute("normal",Z.attributes.normal),Z.dispose(),await n.yield();const ae=[];let Y=5;for(let a=5;a<s-4;a+=.4){const v=h(),c=h(),b=h.range(.4,.8),q=h.range(.16,.55),_=h.range(-.17,.17),H=h.range(.02,.036),ee=h.range(0,.07),he=h(),ve=h.range(.4,.75),be=h.range(.3,.5),ne=h(),te=h.range(.9,2.2),Se=h()<.2,fe=a+h.range(0,.4);if(fe<Y)continue;It(m,fe/s,i);const ge=Math.pow(x(i),6);if(ge<.3)continue;const Ce=(v<.2?$(.8,1.3,c):v<.75?$(1.4,2.8,c):$(3.2,5,c))*(.35+.65*ge),Re=fe/s>.6;ae.push({s:fe,L:Ce,w:b*Math.min(1,.5+.25*Ce)*(Re?.62:1),drop:q,lean:_,rs:H,rb:.12+.03*Ce+ee,sat:he<.7?ve:0,satR:be,seed:ne}),Y=fe+te*(Re?.42:1)*(Se?1.8:1)}const Pt=a=>{let v=-.16+.12*o.n2(a*.45,5.3),c=0;for(const b of ae){const q=Math.abs(a-b.s)/(b.w*2.6);if(q<1){const _=(1-q*q)*(1-q*q);v+=.4*Math.min(1,b.L)*_,c=Math.max(c,_)}}return[v,c]},Ve=A*2,He=11,F=7,Gt=p/u*z,it=M/u*z,Qe=[Gt-.3];for(let a=0;a<=He;a++)Qe.push(F-(F-Gt)*Math.pow(1-a/He,1.7));for(let a=1;a<=He;a++)Qe.push(F+(it-F)*Math.pow(a/He,1.7));Qe.push(it+.3);const ye=Qe.length,tt=Qe.map(I),Xe=[],Me=[],lt=[],bt=[],ht=[],Kt=[];for(let a=0;a<=Ve;a++){const v=a/Ve,c=v*s;It(m,v,i);const b=o.n2(c*.08,9.1),q=x(i),[_,H]=Pt(c);for(let ee=0;ee<ye;ee++){const[he,ve,be]=tt[ee],ne=be*q,te=co(i,he,b)+_*Math.pow(ne,6);Xe.push(i.cx+i.nx*te,(ve+.6)*i.env-.6,i.cz+i.nz*te),Me.push(ne,H,v),lt.push(i.nx,i.nz),bt.push(c,ve,he)}a%8===7&&await n.yield()}for(let a=0;a<Ve;a++){for(let v=0;v<ye-1;v++){const c=a*ye+v,b=[c,c+1,c+ye,c+1,c+ye+1,c+ye];ht.push(...b),v>0&&v<ye-2&&Kt.push(...b)}a%24===23&&await n.yield()}const Ct=k(Xe,Me,lt,bt,ht);await n.yield(),await ho(Ct,n),await n.yield();const Te=k(Xe,Me,lt,bt,Kt);Te.setAttribute("normal",Ct.attributes.normal),Ct.dispose();{const a=(Math.round(Ve*.6)*ye+He-1)*3+1;if(Te.attributes.normal.array[a]>0){const v=Te.index.array;for(let b=0;b<v.length;b+=3){const q=v[b+1];v[b+1]=v[b+2],v[b+2]=q}const c=Te.attributes.normal.array;for(let b=0;b<c.length;b++)c[b]=-c[b]}}{const a=Te.attributes.normal.array,v=ue.attributes.normal.array,c=u+1;for(let b=0;b<=Ve;b++){const q=b/2,_=Math.min(A-1,Math.floor(q)),H=q-_;for(let ee=0;ee<ye;ee++){const he=1-Ie(.45,.6,tt[ee][2]);if(he<=0)continue;const ve=we(Qe[ee]/z*u,0,u),be=Math.min(u-1,Math.floor(ve)),ne=ve-be,te=(b*ye+ee)*3;let Se=0,fe=0,ge=0;for(const[P,W,U]of[[0,0,(1-H)*(1-ne)],[1,0,H*(1-ne)],[0,1,(1-H)*ne],[1,1,H*ne]]){const me=((_+P)*c+be+W)*3;Se+=v[me]*U,fe+=v[me+1]*U,ge+=v[me+2]*U}const Ce=Se*a[te]+fe*a[te+1]+ge*a[te+2]<0?-1:1;Se=$(a[te],Se*Ce,he),fe=$(a[te+1],fe*Ce,he),ge=$(a[te+2],ge*Ce,he);const Re=1/Math.max(Math.hypot(Se,fe,ge),1e-6);a[te]=Se*Re,a[te+1]=fe*Re,a[te+2]=ge*Re}b%24===23&&await n.yield()}}await n.yield();const ct=a=>{const v=new t.BufferGeometry;for(const c of Object.keys(Te.attributes))v.setAttribute(c,Te.attributes[c]);return v.setIndex(a),v},Le=Te.index.array,kt=(ye-3)*6,pe=He*6,Ze=[],St=[];for(let a=0;a<Le.length;a+=kt){for(let v=0;v<pe;v++)Ze.push(Le[a+v]);for(let v=pe;v<kt;v++)St.push(Le[a+v])}const $t=ct(Ze),eo=ct(St);await n.yield();const At=new t.BufferGeometry;for(const a of Object.keys(ue.attributes))At.setAttribute(a,ue.attributes[a]);{const a=[],v=2*(u+1);for(let c=0;c<A;c+=2)for(let b=0;b<u;b+=2){if(b>=B&&b<j)continue;const q=c*(u+1)+b;a.push(q,q+2,q+v,q+2,q+v+2,q+v)}At.setIndex(a)}const zt=Le[1]!==Le[0]+1,dt=[],Mt=[];for(let a=0;a<Ve;a+=4)for(let v=1;v<ye-2;v++){const c=a*ye+v,b=c+4*ye,q=zt?[c,b,c+1,c+1,b,b+1]:[c,c+1,b,c+1,b+1,b];(v<=He?dt:Mt).push(...q)}const qt={body:At,lipUnder:ct(dt),lipTop:ct(Mt)};await n.yield();const Ee=12,ut=[],Wt=[],ot=[],Ot=[],Lt=[],xe=[],L=R(),Je=R(),le=R(),$e=R(),We=R(),ft=R(),et=R(),Oe=R(),De=R();let Bt=0;for(const a of ae){It(m,a.s/s,i);const v=o.n2(a.s*.08,9.1),c=x(i),b=Math.pow(c,6),q=co(i,9.8,v)+Pt(a.s)[0]*b-.42;Oe.set(i.cx+i.nx*q,(9.74+.6)*i.env-.6,i.cz+i.nz*q),ft.set(i.nx,0,i.nz),et.set(i.nz,0,-i.nx);const _=(P,W,U)=>U.copy(ft).multiplyScalar(P*(W-.22*W*W*W)).addScaledVector(et,P*a.lean*W*W).setY(-P*(.14*W+a.drop*W*W));let H=a.L,ee=!1;for(let P=0;P<4&&!ee;P++){ee=!0;for(const[W,U]of[[1,.9],[1.18,1.4]])for(const me of[0,.2,.4,.7,1])_(H*W,me,L).add(Oe).addScaledVector(ft,U*c*c),C.distanceTo(L.x,L.y,L.z)<(me<.3?2.9:2.6)&&(ee=!1);ee||(H*=.6)}if(!ee||H<.3)continue;const he=Math.min(a.rb,.16*H),ve=1-he/H,be=1-2.5*he/H,ne=Math.min(we(.5/H+.12,.2,.6),be-.1),te=[];for(const P of[0,.12,.26,.42,.6,.8,1]){const W=1-P,U=a.rs+(a.w-a.rs)*Math.pow(W,2.3),me=a.rs+(.16-a.rs)*Math.pow(W,1.8);te.push([P*ne,U,me,-1,Math.max(U,me),0,P])}const Se=he*a.satR,fe=$(ne,be,a.sat),ge=a.sat>0&&(be-ne)*H>.55;for(let P=1;P<=6;P++){const W=$(ne,be,P/7);if(ge&&Math.abs(W-fe)*H<1.7*Se)continue;const U=a.rs*(1+.35*Math.sin(W*H*5+a.seed*20));te.push([W,U,U,-1,U,0,1])}const Ce=(P,W)=>{for(const U of[-1.5,-1.15,-.8,-.45,0,.4,.72,.92,1]){const me=Math.max(U<0?W*Math.sqrt(Math.max(1-U*U/2.25,0)):W*Math.sqrt(Math.max(1-U*U,0)),U<1?a.rs*.9:0);te.push([P+U*W/H,me,me,P,W,U*W,U<-1.2?1.3:2])}};ge&&Ce(fe,Se),Ce(ve,he),te.sort((P,W)=>P[0]-W[0]);const Re=ut.length/3;for(let P=0;P<te.length;P++){const[W,U,me,Nt,je,Ue,Ft]=te[P],at=Nt>=0?Nt:W;_(H,at,De),_(H,Math.min(at+.01,1.01),Je),le.subVectors(Je,De).normalize(),$e.copy(et).addScaledVector(le,-et.dot(le)).normalize(),We.crossVectors(le,$e);for(let Ae=0;Ae<Ee;Ae++){const Ye=Ae/Ee*Math.PI*2,Ne=Math.cos(Ye)*U,Be=Math.sin(Ye)*me;L.copy($e).multiplyScalar(Ne).addScaledVector(We,Be),ot.push(L.x,L.y,L.z,je),Wt.push(De.x,De.y,De.z),ut.push(Oe.x+De.x+le.x*Ue+L.x,Oe.y+De.y+le.y*Ue+L.y,Oe.z+De.z+le.z*Ue+L.z),Ot.push(i.nx,i.nz,c*c,a.s/s),Lt.push(we(W,0,1),Ft)}if(P>0)for(let Ae=0;Ae<Ee;Ae++){const Ye=Re+(P-1)*Ee+Ae,Ne=Re+(P-1)*Ee+(Ae+1)%Ee;xe.push(Ye,Ye+Ee,Ne,Ne,Ye+Ee,Ne+Ee)}}++Bt%2===0&&await n.yield()}const ke=new t.BufferGeometry;ke.setAttribute("position",new t.Float32BufferAttribute(ut,3)),ke.setAttribute("aC",new t.Float32BufferAttribute(Wt,3)),ke.setAttribute("aRing",new t.Float32BufferAttribute(ot,4)),ke.setAttribute("aFi",new t.Float32BufferAttribute(Ot,4)),ke.setAttribute("aTau",new t.Float32BufferAttribute(Lt,2)),ke.setIndex(xe),await n.yield(),await ho(ke,n),await n.yield();{const a=ke.attributes.normal.array;let v=0;for(let c=0;c<ut.length/3;c+=7)v+=a[c*3]*ot[c*4]+a[c*3+1]*ot[c*4+1]+a[c*3+2]*ot[c*4+2];if(v<0){for(let c=0;c<xe.length;c+=3){const b=xe[c+1];xe[c+1]=xe[c+2],xe[c+2]=b}ke.setIndex(xe);for(let c=0;c<a.length;c++)a[c]=-a[c]}}return ke.boundingSphere=new t.Sphere(R(10,8,210),80),{geometry:ue,lip:Te,lipUnder:$t,lipTop:eo,far:qt,fingers:ke,fingerCount:Bt,line:m,len:s,out:ue.attributes.normal.getY(Math.round(A*.4)*(u+1)+42)>0?1:-1}}function uo(o,n){const h=new t.InstancedBufferGeometry,C=new Float32Array(o*3),m=new Float32Array(o*4);for(let s=0;s<o;s++)n(s,C,m);return h.setAttribute("position",new t.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,-1,1,0,1,1,0]),3)),h.setIndex([0,1,2,2,1,3]),h.setAttribute("iPos",new t.InstancedBufferAttribute(C,3)),h.setAttribute("iParm",new t.InstancedBufferAttribute(m,4)),h.instanceCount=o,h.boundingSphere=new t.Sphere(R(0,0,0),1e5),h}var Ga={id:"the-leader",name:"The Leader",category:"sky",weirdness:.6,media:["air"],async build(o){const n=o.rng,h=o.vary||{},C=o.quality?.detail??1,m=h.density??1,s=new t.Scene,S=n(),z=n(),u=n.fork("the-leader-world");let A=S<.42?"dusk":S<.62?"copper":S<.81?"day":"night";h.hour==="night"?A="night":h.hour==="day"?A="day":h.hour==="golden"?A="copper":h.hour==="dawn"&&(A="dawn");const p=$o[A],M=e=>new t.Color(e),B=M(p.band),j=M(p.cloud),g=M(p.fog),i=M(p.sea),I=M(p.rim);s.fog=new t.FogExp2(g.clone(),.0011),s.background=g.clone(),await o.yield();const x=e=>e>290?$(45,52,we((e-290)/60,0,1)):$(33,45,we((e-165)/125,0,1)),k=new t.Color(i.r*.6+g.r*.3,i.g*1.25+g.g*.35,i.b+g.b*.3),K="#"+k.getHexString(),X=Zo.makeOcean({rng:n.fork("sea"),preset:"storm",height:$(3,3.7,z),wavelength:42,spread:.3,speed:.004,windAngle:Math.PI/2,spray:!1,detail:1.05,glitter:.6,deep:p.deep,scatter:"#3d8088",radius:3600,horizonColor:K,light:{preset:"storm",sunDir:[-.17,.07,-.985],sunColor:p.rim,sunIntensity:1.5*p.amt,zenith:p.osky||p.cloud,mid:p.osky||p.cloud,horizon:p.fog,scatterColor:p.rim,scatter:.85*p.amt,glint:p.glint??.45,fogColor:p.fog,clouds:!1}});s.add(X.object);const V=[0,1,2,3].map(()=>new t.Vector4(0,100,0,0)),y=Math.max(i.r*.2126+i.g*.7152+i.b*.0722,.001),D=.98/p.exposure*(p.seaLit??1),G={uSeaL:{value:V},uLTeal:{value:new t.Color(.016,.105,.115).lerp(i.clone().multiplyScalar(.085/y),.25).multiplyScalar(D)},uLKeyC:{value:new t.Color("#8E62FF").multiplyScalar(.5).add(new t.Color("#E4DCFF").multiplyScalar(.5)).multiplyScalar(D)},uLRimC:{value:I.clone().multiplyScalar(p.amt*Math.sqrt(p.seaLit??1))},uLBandDir:{value:new t.Vector2(0,-1)},uLAmb:{value:.4},uLStroke:{value:0}};{const e=X.material,r=e&&e.fragmentShader,f="void main(){",l="col += spec*(1.-fa);";r&&r.includes(f)&&r.includes(l)&&(Object.assign(e.uniforms,G),e.fragmentShader=r.replace(f,Ma+f).replace(l,l+" col = leaderSeaMix(col, leaderOnSea(vWorld, N, V, crest, fa, alpha, dist, gl), fa, dist);"))}let N=0;for(let e=150;e<=300;e+=1.5)for(let r=-2.5;r<=2.5;r+=2.5)N=Math.max(N,X.heightAt(x(e)+r,e,20)-3.4);X.object.position.y=-N;const Z=(e,r)=>X.heightAt(e,r,20)-N;await o.yield();const ue=await Fa(o);await o.yield();const ae=new t.Mesh(ue.hull,new t.MeshLambertMaterial({vertexColors:!0,side:t.DoubleSide}));ae.position.set(0,we(Z(-10,0)*.7,-1.2,1.6),0),ae.rotation.set(14*_e,0,2.5*_e),ae.updateMatrixWorld(!0),ae.name="schooner",s.add(ae);const Y=(e,r,f)=>R(e,r,f).applyMatrix4(ae.matrixWorld),Pt=[Y(0,30,0),Y(-11,30.5,0),Y(-22,28,0)],Ve=[];for(let e=0;e<9;e++){const r=(e+.5)/9,f=$(45,33,r)+(e%2?-1:1)*(10+5*(e%3)),l=$(290,165,r)-12-4*(e%4);Ve.push(R(f,Z(f,l)+.1,l))}await o.yield();const He=B.clone().multiplyScalar(p.amt),F=await Jo(o,{palette:[p.cloud,p.sea,p.band,"#E4DCFF","#8E62FF","#B4506F","#FFB45A"],mastheads:Pt,crests:Ve,stray:!!h.rare});F.setEnv({band:He,cloud:j,sea:i}),s.add(F.object),await o.yield();const Gt=F.anchors.flyThrough,it=F.anchors.portalSeat.position,Qe=Math.sin(18*_e),ye=Math.cos(18*_e),tt=e=>R(it.x,it.y-e*Qe,it.z+e*ye),Xe=[R(60,690,548),...Gt.slice(0,24).map(e=>e.clone()),R(33.3,6.1,171),tt(80),tt(55),tt(28),tt(0)];await o.yield();const Me=Xo(Xe);await o.yield();const lt=16,bt=new t.CatmullRomCurve3(Xe,!1,"centripetal",.5),ht=bt.getLengths((Xe.length-1)*lt),Kt=ht[ht.length-1],Ct=Xe.map((e,r)=>ht[r*lt]/Kt),Te=[...F.anchors.entryTimes,...F.anchors.helixTimes,17.9,19.5,24.75,30,32.4,34.8,37.3,40],ct=ea(Ct,Te),Le=e=>ct(we(e,0,1)),kt=e=>{const r=we(e-.004,0,1),f=we(e+.004,0,1);return we((f-r)*40/Math.max(Le(f)-Le(r),1e-4),.3,2.6)},pe=e=>{let r=0,f=1;for(let l=0;l<30;l++){const w=(r+f)/2;Le(w)<e?r=w:f=w}return(r+f)/2},Ze=F.anchors.trunkTop,St=F.anchors.trunkFoot,$t=F.anchors.junction,eo=R(),At=R(),zt=F.anchors.overtake,dt=pe(zt-.25),Mt=dt-pe(zt-1.25),qt=-2*Mt,Ee=pe(2.5),ut=Ze.clone().lerp(St,.06),Wt=R(4,58,8),ot=R(4,105,8),Ot=R(-8,6,0),Lt=[{at:ut,from:0,to:Ee,weight:.45},{at:ot,from:pe(zt-2),to:pe(19.5),weight:.8,fade:.3},{at:(e,r)=>F.leadAt(Le(r||0),At),from:qt,to:dt,weight:1,fade:Mt/(dt-qt)},{at:(e,r)=>F.tipAt("trunk",Le(r||0),eo),from:pe(14),to:pe(16),weight:.2},{at:Wt,from:pe(15.5),to:pe(30.5),weight:.45},{at:$t.clone(),from:pe(31),to:pe(37.6),weight:.22}];F.anchors.stray&&Lt.push({at:F.anchors.stray.clone().add(R(.5,2.5,-2)),from:pe(21.9),to:pe(23.8),weight:.26}),await o.yield();const xe=[0,1,2,3,4,5].map(()=>new t.Vector4(0,300,0,0)),L={uTime:{value:0},uT:{value:0},uSeaDrop:{value:N},uStroke:{value:0},uKey:{value:St.clone()},uKeyI:{value:.5},uCam:{value:R(60,690,548)},uResY:{value:450},uCloudC:{value:j},uBandC:{value:B},uSeaC:{value:i},uFarSea:{value:k.clone()},uSeaAmb:{value:1},uFogC:{value:g},uFogD:{value:.0011},uRimC:{value:I},uViolet:{value:F.uniforms.uViolet.value},uGlowC:{value:F.uniforms.uGlowC.value},uBandAmt:{value:p.amt},uBandDir:{value:new t.Vector2(0,-1)},uAxis:{value:new t.Vector2(Ze.x,Ze.z)},uGlowR:{value:150},uHigh:{value:1},uPool:{value:xe},uPoolK:{value:1},uBirdDz:{value:0},...G,uRoadDir:{value:new t.Vector2(Math.sin(-14*_e),-Math.cos(-14*_e))},uShipLit:{value:R(-8,0,0)},uRoadC:{value:I.clone().multiplyScalar(A==="copper"?.35:.7).add(j.clone().multiplyScalar(1.4))},uSeaLift:{value:A==="dusk"?1.3:1},uLitK:{value:1.25/p.exposure}},Je=new t.Mesh(new t.SphereGeometry(3e3,32,16),new t.ShaderMaterial({uniforms:L,vertexShader:ta,fragmentShader:oa,side:t.BackSide,depthWrite:!1,depthTest:!1,fog:!1}));Je.renderOrder=-1,Je.frustumCulled=!1,Je.name="dome",s.add(Je),await o.yield();const le=128,$e=new Float32Array((le+1)*(le+1)*3),We=new Uint16Array(le*le*6),ft=e=>1900*(.3*e+.7*e*e*e);for(let e=0,r=0;e<=le;e++)for(let f=0;f<=le;f++)$e[r++]=Ze.x+ft(2*f/le-1),$e[r++]=700,$e[r++]=Ze.z-40-ft(2*e/le-1);for(let e=0,r=0;e<le;e++)for(let f=0;f<le;f++){const l=e*(le+1)+f,w=l+le+1;We[r++]=l,We[r++]=w,We[r++]=l+1,We[r++]=w,We[r++]=w+1,We[r++]=l+1}const et=new t.BufferGeometry;et.setAttribute("position",new t.BufferAttribute($e,3)),et.setIndex(new t.BufferAttribute(We,1)),await o.yield();const Oe=new t.Mesh(et,new t.ShaderMaterial({uniforms:L,vertexShader:aa,fragmentShader:sa,side:t.DoubleSide,transparent:!0,depthWrite:!0,fog:!1}));Oe.renderOrder=0,Oe.frustumCulled=!1,Oe.name="ceiling",s.add(Oe),await o.yield();const De=[],Bt=[],ke=[],a=[];[[-40,1500,300],[29,2150,640],[98,1300,420],[142,2100,700],[-104,1700,560],[-152,2400,680]].forEach(([e,r,f],l)=>{const w=e*_e,T=40+Math.sin(w)*r,J=250-Math.cos(w)*r,ie=Math.cos(w)*f*.5,Q=Math.sin(w)*f*.5,d=(l%2?1:-1)*260;De.push(T-ie,-5,J-Q,T+ie,-5,J+Q,T-ie+d,1120,J-Q,T+ie+d,1120,J+Q),Bt.push(0,0,1,0,0,1,1,1);const E=u();ke.push(E,E,E,E),a.push(l*4,l*4+1,l*4+2,l*4+2,l*4+1,l*4+3)});const c=new t.BufferGeometry;c.setAttribute("position",new t.Float32BufferAttribute(De,3)),c.setAttribute("uv",new t.Float32BufferAttribute(Bt,2)),c.setAttribute("aSeed",new t.Float32BufferAttribute(ke,1)),c.setIndex(a);const b=new t.Mesh(c,new t.ShaderMaterial({uniforms:L,vertexShader:ra,fragmentShader:na,side:t.DoubleSide,transparent:!0,depthWrite:!1,fog:!1}));b.renderOrder=-.5,b.frustumCulled=!1,b.name="rain-shafts",s.add(b),await o.yield();const q=new t.RingGeometry(30,3700,40,6);q.rotateX(-Math.PI/2);const _=new t.Mesh(q,new t.ShaderMaterial({uniforms:L,vertexShader:pa,fragmentShader:va,transparent:!0,depthWrite:!1,fog:!1}));_.position.set(60,3.4,548),_.renderOrder=1.2,_.frustumCulled=!1,_.name="sea-from-height",s.add(_);const H=[],ee=[],he=[],ve=28;[55,135,250].forEach((e,r)=>{const f=H.length/3;H.push(0,e,0),ee.push(r);for(let l=0;l<ve;l++){const w=l/ve*Math.PI*2;H.push(Math.cos(w)*1500,e,Math.sin(w)*1500),ee.push(r)}for(let l=0;l<ve;l++)he.push(f,f+1+(l+1)%ve,f+1+l)});const be=new t.BufferGeometry;be.setAttribute("position",new t.Float32BufferAttribute(H,3)),be.setAttribute("aLayer",new t.Float32BufferAttribute(ee,1)),be.setIndex(he);const ne=new t.Mesh(be,new t.ShaderMaterial({uniforms:L,vertexShader:ga,fragmentShader:wa,side:t.DoubleSide,transparent:!0,depthWrite:!1,fog:!1}));ne.position.set(60,0,548),ne.renderOrder=1.5,ne.frustumCulled=!1,ne.name="haze-decks",s.add(ne);const te=[],Se=[],fe=[];for(let e=0;e<6;e++)te.push(-1,3.7,-1,1,3.7,-1,-1,3.7,1,1,3.7,1),fe.push(e,e,e,e),Se.push(e*4,e*4+2,e*4+1,e*4+1,e*4+2,e*4+3);const ge=new t.BufferGeometry;ge.setAttribute("position",new t.Float32BufferAttribute(te,3)),ge.setAttribute("aIdx",new t.Float32BufferAttribute(fe,1)),ge.setIndex(Se);const Ce=new t.Mesh(ge,new t.ShaderMaterial({uniforms:L,vertexShader:fa,fragmentShader:ma,transparent:!0,depthWrite:!1,blending:t.AdditiveBlending,side:t.DoubleSide,fog:!1}));Ce.renderOrder=1.3,Ce.frustumCulled=!1,Ce.name="pools-of-light",s.add(Ce);const Re=["trunk","dive0","dive1","dive2"].map(e=>F.branches.find(r=>r.name===e)||null),P=R();await o.yield();const W=Math.round(340*C*m),U=[[],[]],me=[[],[]];for(let e=0;e<W;e++){const r=$(345,120,u()),f=(u()<.5?-1:1)*(2+58*Math.pow(u(),1.7)),l=x(r)+f,w=Math.abs(f)<8?1:0;U[w].push(l,Z(l,r)-.04,r),me[w].push(u.range(.28,.62)*(Math.abs(f)<12?1.15:1),u(),u.range(.11,.26),u()),e%80===79&&await o.yield()}const Nt=new t.ShaderMaterial({uniforms:L,vertexShader:ia,fragmentShader:la,side:t.DoubleSide,fog:!1});for(let e=0;e<2;e++){const r=Ea(e===1),f=me[e].length/4;r.setAttribute("iPos",new t.InstancedBufferAttribute(new Float32Array(U[e]),3)),r.setAttribute("iParm",new t.InstancedBufferAttribute(new Float32Array(me[e]),4)),r.instanceCount=f,r.boundingSphere=new t.Sphere(R(40,0,230),400);const l=new t.Mesh(r,Nt);l.frustumCulled=!1,l.name=e?"splash-crowns-near":"splash-crowns",s.add(l),await o.yield()}const je=u.fork("decals"),Ue=Math.round(3600*C*m),Ft=new Float32Array(Ue*2),at=new Float32Array(Ue*3),Ae=new Float32Array(Ue*4);for(let e=0;e<Ue;e++){const r=$(350,118,je()),f=(je()<.5?-1:1)*(1.2+46*Math.pow(je(),1.6)),l=x(r)+f,w=Z(l,r);at[e*3]=l,at[e*3+1]=w+.07,at[e*3+2]=r,Ft[e*2]=we((Z(l+.5,r)-w)*2,-.9,.9),Ft[e*2+1]=we((Z(l,r+.5)-w)*2,-.9,.9),Ae[e*4]=je.range(.22,.6)*(Math.abs(f)<10?1.3:1),Ae[e*4+1]=je(),Ae[e*4+2]=je.range(.1,.24),Ae[e*4+3]=je(),e%60===59&&await o.yield()}const Ye=uo(Ue,(e,r,f)=>{for(let l=0;l<3;l++)r[e*3+l]=at[e*3+l];for(let l=0;l<4;l++)f[e*4+l]=Ae[e*4+l]});Ye.setAttribute("iSlope",new t.InstancedBufferAttribute(Ft,2));const Ne=new t.Mesh(Ye,new t.ShaderMaterial({uniforms:L,vertexShader:ya,fragmentShader:xa,transparent:!0,depthWrite:!1,premultipliedAlpha:!0,side:t.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3,fog:!1}));Ne.frustumCulled=!1,Ne.renderOrder=1.1,Ne.name="ring-decals",s.add(Ne),await o.yield();const Be=await Da(o.noise,o,Bo(Fo("the-leader-fingers:"+(o.seed??1))),Me);await o.yield();const st=new t.Mesh(Be.geometry,new t.ShaderMaterial({uniforms:{...L,uLip:{value:0},uOut:{value:Be.out}},vertexShader:lo,fragmentShader:Po,side:t.DoubleSide,fog:!1}));st.position.set(0,we(Z(10,224)*.5,-.2,.8),0),st.frustumCulled=!1,st.name="breaker",s.add(st);const _t=new t.ShaderMaterial({uniforms:{...L,uLip:{value:1},uOut:{value:0}},vertexShader:lo,fragmentShader:Po,side:t.DoubleSide,transparent:!0,forceSinglePass:!0,depthWrite:!1,fog:!1}),Oo=new t.ShaderMaterial({uniforms:{...L,uLip:{value:.5}},vertexShader:lo,fragmentShader:ha,side:t.DoubleSide,transparent:!0,forceSinglePass:!0,colorWrite:!1,fog:!1});for(const[e,r,f,l]of[[Be.lip,Oo,.69,"breaker-lip-depth"],[Be.lipTop,_t,.695,"breaker-lip-top"],[Be.lipUnder,_t,.7,"breaker-lip"]]){const w=new t.Mesh(e,r);w.position.copy(st.position),w.renderOrder=f,w.frustumCulled=!1,w.name=l,s.add(w)}const Tt=new t.Mesh(Be.fingers,new t.ShaderMaterial({uniforms:L,vertexShader:ca,fragmentShader:da,transparent:!0,depthWrite:!1,fog:!1}));Tt.position.copy(st.position),Tt.renderOrder=.75,Tt.frustumCulled=!1,Tt.name="lip-fingers",s.add(Tt),await o.yield();{const e=Bo(Fo("the-leader-lesser:"+(o.seed??1))),r=[],f=[],l=90,w=300;for(let d=0;d<24;d++){const E=e()*Math.PI*2,O=Math.sqrt($(l*l,w*w,e()));r.push({x:ae.position.x+Math.sin(E)*O,z:ae.position.z-Math.cos(E)*O,L:e.range(15,30),yaw:e.range(-.15,.15),sd:e()})}const T=(d,E,O,ce,ze,se)=>{for(let re=290;re>=165;re-=2.5){if(O>=re||O<=se)continue;const oe=x(re),de=(re-O)/(re-se);if(E+4>$(oe,ce,de)&&d-4<$(oe,ze,de))return!0}return!1};for(const d of r){if(f.length>=3)break;let E=d.z,O=-1e9;for(let oe=-45;oe<=45;oe+=1){const de=Z(d.x,d.z+oe);de>O&&(O=de,E=d.z+oe)}const ce=d.L/60,ze=d.x-d.L/2,se=d.x+d.L/2;let re=O+N>=1.2&&!(Math.abs(E)<40&&se>-60&&ze<40);for(let oe=ze;re&&oe<=se;oe+=2.5)for(let de=-18*ce;de<=13*ce+.01;de+=15.5*ce)Me.distanceTo(oe,3,E+de)<12&&(re=!1);re&&(T(ze,se,E,-32,12,0)||T(ze,se,E,26,40,70))&&(re=!1);for(const oe of Wo)re&&Math.hypot(oe[0]-d.x,oe[1]-E)<45+d.L/2&&(re=!1);for(const oe of f)re&&Math.hypot(oe.x-d.x,oe.z-E)<45+(oe.L+d.L)/2&&(re=!1);re&&f.push({x:d.x,z:E,L:d.L,yaw:d.yaw,sc:ce,sd:d.sd}),await o.yield()}const J=70,ie=new Float32Array(f.length*J*3),Q=new Float32Array(f.length*J*4);if(f.forEach((d,E)=>{const O=Math.cos(d.yaw),ce=Math.sin(d.yaw),ze=d.x-d.sc*ce*224,se=d.z-d.sc*O*224,re=we(Z(d.x,d.z)*.5,-.8,.4)-.4;for(const[oe,de,Xt,Zt]of[[Be.far.body,st.material,0,"lesser-breaker"],[Be.far.lipTop,_t,.695,"lesser-lip-top"],[Be.far.lipUnder,_t,.7,"lesser-lip"]]){const nt=new t.Mesh(oe,de);nt.position.set(ze,re,se),nt.rotation.y=d.yaw,nt.scale.setScalar(d.sc),nt.renderOrder=Xt,nt.frustumCulled=!1,nt.name=Zt,s.add(nt)}for(let oe=0;oe<J;oe++){const de=E*J+oe,Xt=e.range(-.5,.5)*d.L,Zt=Math.abs(e.gauss())*5*d.sc+1;ie[de*3]=d.x+Xt*O+Zt*ce,ie[de*3+1]=re+e.range(4.5,12.5)*d.sc,ie[de*3+2]=d.z-Xt*ce+Zt*O,Q[de*4]=e.range(.03,.11),Q[de*4+1]=e(),Q[de*4+2]=e.range(.05,.22),Q[de*4+3]=0}}),f.length){const d=uo(f.length*J,(O,ce,ze)=>{for(let se=0;se<3;se++)ce[O*3+se]=ie[O*3+se];for(let se=0;se<4;se++)ze[O*4+se]=Q[O*4+se]}),E=new t.Mesh(d,new t.ShaderMaterial({uniforms:L,vertexShader:Do,fragmentShader:Ro,transparent:!0,depthWrite:!1,premultipliedAlpha:!0,fog:!1}));E.frustumCulled=!1,E.renderOrder=9,E.name="lesser-spray",s.add(E)}}await o.yield();const mt=2.2,fo=4.5,to=20.5,No=27.6,mo=[1.2,1.9,1.4,2.2,1,1.7,1.3],po=[-.05,-.3,.15,-.25,.1,-.2,.2],Vt=[],Ht=R();for(let e=0;e<7;e++){const r=21.6+.6*e;Me.pointAt(pe(r),Ht);const f=Ht.z+fo*(r-to);Vt.push({z0:f,dx:mo[e],y:Ht.y+po[e],p:R(x(f)+mo[e],Ht.y+po[e],f),yaw:Math.PI/2+u.range(.35,.85),roll:u.range(-.25,.1),ph:u()*6.28})}const jt=Math.round(2200*C),pt={},vo=[];for(let e=290;e>=226;e-=4){const r=[x(e),6,e];vo.push({e:r,az:Math.atan2(-10-r[0],r[2]),el:Math.atan2(12-r[1],Math.hypot(-10-r[0],r[2]))})}const _o=(e,r,f)=>{let l,w,T,J,ie=0;const Q=u();if(e<84){const d=Vt[e%7],E=u()*6.28,O=u.range(.25,1);l=d.p.x+Math.cos(E)*O,w=d.p.y-.15-u()*.7,T=d.p.z+Math.sin(E)*O,J=u.range(.012,.03),ie=1}else if(Q<.55)l=u.range(29,49),w=u.range(6.6,14),T=u.range(190,234),J=u.range(.06,.2),Me.distanceTo(l,w,T)<1.5&&(w+=3.2);else{It(Be.line,u.range(.08,.9),pt);const d=5+Math.abs(u.gauss())*4.5;l=pt.cx+pt.nx*d,T=pt.cz+pt.nz*d,w=u.range(4.5,12.5)*Math.max(pt.env,.4),J=u.range(.03,.11),Me.distanceTo(l,w,T)<1.5&&(w+=3.2)}if(!ie)for(const d of vo){const E=l-d.e[0],O=w-d.e[1],ce=T-d.e[2],ze=Math.hypot(E,O,ce)||1,se=Math.atan2(E,-ce)-d.az,re=Math.asin(O/ze)-d.el;ce<0&&Math.abs(se)<9*_e&&re>-4*_e&&re<9*_e&&(J=0)}r[e*3]=l,r[e*3+1]=w,r[e*3+2]=T,f[e*4]=J,f[e*4+1]=u(),f[e*4+2]=ie?.03:u.range(.05,.22),f[e*4+3]=ie},go=new Float32Array(jt*3),wo=new Float32Array(jt*4);for(let e=0;e<jt;e++)_o(e,go,wo),e%150===149&&await o.yield();const Vo=uo(jt,(e,r,f)=>{for(let l=0;l<3;l++)r[e*3+l]=go[e*3+l];for(let l=0;l<4;l++)f[e*4+l]=wo[e*4+l]}),Ut=new t.Mesh(Vo,new t.ShaderMaterial({uniforms:L,vertexShader:Do,fragmentShader:Ro,transparent:!0,depthWrite:!1,premultipliedAlpha:!0,fog:!1}));Ut.frustumCulled=!1,Ut.renderOrder=9,Ut.name="spray",s.add(Ut),await o.yield();const yo=await Ta(o);await o.yield();const xo=new t.ShaderMaterial({uniforms:L,vertexShader:ka,fragmentShader:Sa,vertexColors:!0,side:t.DoubleSide,fog:!1}),Et=new t.InstancedMesh(yo.body,xo,7),vt=new t.InstancedMesh(yo.wing,xo,14),oo=new t.Matrix4,Yt=new t.Quaternion,Qt=new t.Quaternion,ao=new t.Euler,bo=R(mt,mt,mt),Ho=R(mt,mt,-mt);Vt.forEach(e=>{e.q=new t.Quaternion().setFromEuler(ao.set(e.roll,e.yaw,.12,"YXZ"))});const Co=(e,r)=>{const f=-fo*(we(e,to,No)-to);L.uBirdDz.value=f;for(let l=0;l<7;l++){const w=Vt[l],T=.6+.21*e/40+.035*Math.sin(r*1.3+w.ph),J=w.z0+f;w.p.set(x(J)+w.dx,w.y+.04*Math.sin(r*.7+w.ph),J),Et.setMatrixAt(l,oo.compose(w.p,w.q,bo)),Qt.setFromEuler(ao.set(-T,0,0,"XYZ")),Yt.copy(w.q).multiply(Qt),vt.setMatrixAt(l*2,oo.compose(w.p,Yt,bo)),Qt.setFromEuler(ao.set(T,0,0,"XYZ")),Yt.copy(w.q).multiply(Qt),vt.setMatrixAt(l*2+1,oo.compose(w.p,Yt,Ho))}Et.instanceMatrix.needsUpdate=!0,vt.instanceMatrix.needsUpdate=!0};Co(22,0),Et.frustumCulled=!1,vt.frustumCulled=!1,Et.name="petrels",vt.name="petrel-wings",s.add(Et,vt),await o.yield();const gt=new t.Mesh(ue.rigging,new t.ShaderMaterial({uniforms:L,vertexShader:Aa,fragmentShader:za,transparent:!0,depthWrite:!1,side:t.DoubleSide,fog:!1}));gt.position.copy(ae.position),gt.rotation.copy(ae.rotation),gt.renderOrder=1.9,gt.frustumCulled=!1,gt.name="rigging",s.add(gt);{const e=[],r=[],f=[],l=ae.position.y,w=20,T=[];e.push(-130,l+.2,-24,28,l+.2,-24,-130,l+.2,34,28,l+.2,34),r.push(0,0,0,0,0,0,0,0,0,0,0,0),f.push(0,2,1,1,2,3);for(let d=1;d>=-1;d-=2)for(let E=0;E<=w;E++){const O=d>0?E/w:1-E/w,ce=Rt(O),ze=-3.2*(1-O*O*O*O),se=Dt(O)*Math.sqrt(Math.max(1-Math.pow(Math.min(1,ce/(ce-ze)),2/.7),0))+.14;T.push(Y(-30+40*O,0,d*se))}T.push(T[0].clone());let J=0;for(let d=0;d<T.length;d++)if(d>0&&(J+=Math.hypot(T[d].x-T[d-1].x,T[d].z-T[d-1].z)),e.push(T[d].x,l-.5,T[d].z,T[d].x,l+1.3,T[d].z),r.push(J,0,1,J,1,1),d>0){const E=4+(d-1)*2;f.push(E,E+2,E+1,E+1,E+2,E+3)}const ie=new t.BufferGeometry;ie.setAttribute("position",new t.Float32BufferAttribute(e,3)),ie.setAttribute("aQ",new t.Float32BufferAttribute(r,3)),ie.setIndex(f);const Q=new t.Mesh(ie,new t.ShaderMaterial({uniforms:L,vertexShader:ba,fragmentShader:Ca,transparent:!0,depthWrite:!1,premultipliedAlpha:!0,side:t.DoubleSide,fog:!1}));Q.renderOrder=1.15,Q.frustumCulled=!1,Q.name="schooner-on-the-water",s.add(Q)}await o.yield();const ko=Pe.makeMist({rng:n.fork("mist"),count:Math.round(60*C),area:[320,5,320],center:[0,1.2,0],size:[45,90],color:"#"+j.clone().lerp(M("#8a94b0"),.35).lerp(g,.5).getHexString(),opacity:.07,drift:[.25,0,.5],follow:!0,time:L.uTime});s.add(ko.object),await o.yield();const wt=[],yt=[],rt=[],xt="#FFB45A";for(let e=0;e<8;e++){const r=-24+e*4,f=(r+30)/40;wt.push(Y(r,1.25,Dt(f)*.99+.1)),yt.push(xt),rt.push(.8)}wt.push(Y(-4,5.4,1.2),Y(-19,5.3,1.2)),yt.push(xt,xt),rt.push(1.5,1.5),wt.push(Y(3,4.8,3.3),Y(3,4.8,-3.3)),yt.push("#46ffa0","#ff4634"),rt.push(.7,.7),wt.push(Y(0,22,3.2),Y(0,22,-3.2),Y(-8.6,16.8,0)),yt.push("#9a78ff","#9a78ff","#9a78ff"),rt.push(1.1,1.1,1.1),wt.push(Y(0,28.2,0),Y(-11,28.7,0),Y(-22,26.2,0)),yt.push(xt,xt,xt),rt.push(2,2,2);const so=Pe.makeGlows({positions:wt,colors:yt,sizes:rt,size:1.7,intensity:2.4,flicker:.18,fogAmount:.4,time:L.uTime});s.add(so.object);const jo=rt.slice(),ro=[0,1,2,3,4,5,6,7,15,16,17];await o.yield();const So=new t.HemisphereLight(j.clone().multiplyScalar(2.2),i.clone().multiplyScalar(1.5),p.hemi),Ao=new t.DirectionalLight(M(p.rim),1.5*p.amt);Ao.position.set(0,14,-100);const no=new t.PointLight(M("#cdbcff"),0,0,1);s.add(So,Ao,no);const Uo={exposure:p.exposure,bloom:{strength:.4,radius:.6,threshold:1},grade:{saturation:p.sat,contrast:1.06,tint:"#f6f6f4",shadowTint:"#06141a",vignette:.34,grain:.03,aberration:0}},Fe=R(60,690,548),zo=R(),Yo={position:Fe},Mo=new t.Vector2;function Qo(e,r,f,l){const w=l||0,T=Le(w);f.getWorldPosition(Fe),F.setTime(T),Me.tangentAt(w,zo).multiplyScalar(kt(w)*Me.length/40),F.setVelocity(zo),F.update(e,r,f),L.uTime.value=r,L.uT.value=T,L.uStroke.value=F.stroke,L.uKey.value.copy(F.key.position),L.uKeyI.value=F.key.intensity,L.uCam.value.copy(Fe),L.uGlowR.value=120+5*T;const J=$(.4,1,1-Math.exp(-Math.max(700-Fe.y,0)/90));L.uFarSea.value.copy(k).multiplyScalar(J),L.uSeaAmb.value=J,o.renderer&&(o.renderer.getDrawingBufferSize(Mo),L.uResY.value=Mo.y),Je.position.copy(Fe),L.uHigh.value=Ie(40,100,Fe.y),L.uPoolK.value=Ie(14,40,Fe.y),_.position.set(Fe.x,3.4,Fe.z),ne.position.set(Fe.x,0,Fe.z);for(let Q=0;Q<4;Q++){const d=Re[Q];d&&T>d.birth[0]?(F.tipAt(d,T,P),xe[Q].set(P.x,P.y,P.z,Ie(0,.6,T-d.birth[0])*(d.stall<900?1-Ie(d.end+.5,d.end+3,T):1))):xe[Q].w=0}xe[4].w=0,xe[5].set(F.key.position.x,F.key.position.y,F.key.position.z,.6*F.key.intensity),F.tipAt("ship",T,P),L.uShipLit.value.set($(-8,P.x,.22),$(0,P.z,.22),.1*Ie(4.5,9.5,T)),V[0].set(F.key.position.x,F.key.position.y,F.key.position.z,.7*F.key.intensity),V[1].set(P.x,P.y,P.z,1.5*Ie(13,17,T)),V[2].copy(xe[3]),V[3].copy(xe[0]),V[3].w*=.6,G.uLStroke.value=F.stroke,X.update(e,r,Yo);const ie=1+.5*(1-Math.exp(-Fe.distanceTo(Ot)/140));for(let Q=0;Q<ro.length;Q++)so.setSize(ro[Q],jo[ro[Q]]*ie);ko.update(e,r,f),so.update(e,r,f),no.position.copy(F.key.position),no.intensity=70*F.key.intensity*(1+.6*F.stroke),So.intensity=p.hemi*(1+.6*F.stroke),Co(T,r)}return{scene:s,path:Me,duration:40,pace:kt,camera:{fov:62,near:.3,far:5e3,lookAhead:22,sway:.5,bank:.1},pois:Lt,portal:{shape:"circle",radius:7,color:"#F1E79A",glow:1,revealDistance:320,tilt:!0},post:Uo,ride:"none",update:Qo,dispose(){F.dispose()}}}};export{Ga as default};
