import*as h from"three";import{makePath as X0,clamp as C,lerp as Ge,smoothstep as be}from"../kit/core.js";import{buildHero as Z0,inkKit as x}from"../parts/ladder-orchard.js";const Ye=["#14246A","#0C0D12","#E23B2A","#F2C230","#F3EEDD","#8A3B1E","#2F9A6B"],D0=`
  attribute vec3 iA, iB, iC, iQ; attribute vec4 iW, iOwn;
  uniform float uTime, uHop, uShower, uCross; uniform vec2 uRes; uniform vec4 uOff[4];
  vec3 rotK(vec3 v, vec3 k, float a) { float c = cos(a), s = sin(a); return v * c + cross(k, v) * s + k * dot(k, v) * (1. - c); }
  vec3 whip(vec3 p) {
    float d = max(iOwn.x - p.x, 0.), ph = iOwn.w;
    p.y += sin(uTime * 4.2 - d * 0.6 + ph) * d * 0.085;
    p.z += cos(uTime * 3.1 - d * 0.5 + ph * 1.3) * d * 0.06;
    return p;
  }
  vec3 moveP(vec3 p) {
    int mode = int(iW.w + 0.5);
    if (mode == 1 || mode == 6) {
      float h = max(p.y - iOwn.y, 0.), ph = iOwn.w;
      float k = min(h * h * 0.0005, h * 0.03);
      p.x += sin(uTime * 0.5 + ph) * k; p.z += cos(uTime * 0.37 + ph * 1.7) * k;
      if (mode == 6) { p.y += sin(uTime * 1.1 + ph * 3.3) * iW.z; p.x += cos(uTime * 0.8 + ph * 2.1) * iW.z * 0.6; }
    } else if (mode == 2 || mode == 3 || mode == 7) {
      float q = floor(iW.z / 10.), hd = iW.z - 10. * q, S = 1. + 0.1 * q;
      vec3 foot = iOwn.xyz; vec3 dir = vec3(cos(hd), 0., sin(hd));
      float k = mode == 3 ? uCross : mode == 7 ? uTime * 0.75 + iOwn.w : mod(uHop + iOwn.w, 16.);
      float n = floor(k), f = k - n;
      float air = smoothstep(0.3, 0.8, f), arc = sin(3.14159 * air);
      float c1 = smoothstep(0.03, 0.27, f) * (1. - smoothstep(0.27, 0.4, f));
      float c2 = smoothstep(0.78, 0.86, f) * (1. - smoothstep(0.86, 1., f));
      float leg = 1. - 0.6 * c1 - 0.45 * c2 + 0.3 * arc;
      float h = p.y - foot.y, top = 0.8 * S;
      float h2 = h < top ? h * leg : h - top * (1. - leg);
      p.y += h2 - h;
      if (mode == 7) {
        float fwd = mod(n, 2.) < 0.5 ? 1. : -1., to = fwd > 0. ? air : 1. - air;
        p += dir * (max(h - top, 0.) * 0.2 * arc * fwd + (to - 0.5) * 1.9 * S) + vec3(0., 1.1 * S * arc, 0.);
      } else {
        p += dir * (max(h - top, 0.) * 0.22 * arc);
        float sc = smoothstep(0., 0.7, k) * (1. - smoothstep(15.2, 16., k));
        p = foot + (p - foot) * sc;
        if (mode == 3) { float x = 1.05 * (n + air) - 8.4; p += dir * x + vec3(0., 1.2 * arc - 2.4 * (1. - x * x / 81.), 0.); }
        else p += dir * (2.6 * (n + air) - 20.8) + vec3(0., 1.3 * arc, 0.);
      }
    } else if (mode == 16) {
      float sq = floor(iOwn.w / 100.), sp = sq * 0.1, ph = iOwn.w - 100. * sq;
      float q = floor(iW.z / 10.), hd = iW.z - 10. * q, el = 1. + q / 200.;
      vec3 foot = iOwn.xyz, up = vec3(cos(hd) * cos(el), sin(el), sin(hd) * cos(el));
      float k = mod(uHop + ph, 16.), n = floor(k), f = k - n;
      float air = smoothstep(0.3, 0.8, f), arc = sin(3.14159 * air);
      float c1 = smoothstep(0.03, 0.27, f) * (1. - smoothstep(0.27, 0.4, f));
      float c2 = smoothstep(0.78, 0.86, f) * (1. - smoothstep(0.86, 1., f));
      float leg = 1. - 0.6 * c1 - 0.45 * c2 + 0.3 * arc;
      float h = p.y - foot.y, top = 0.8;
      float h2 = h < top ? h * leg : h - top * (1. - leg);
      p.y += h2 - h;
      float sc = smoothstep(0., 0.7, k) * (1. - smoothstep(15.2, 16., k));
      p = foot + (p - foot) * sc;
      p += up * (sp * (n + air)) + vec3(0., 0.5 * arc, 0.);
    } else if (mode == 4) {
      p = whip(p);
      float k = mod(uTime * 0.021 + iW.z, 1.);
      float sc = smoothstep(0., 0.06, k) * (1. - smoothstep(0.94, 1., k));
      p = iOwn.xyz + (p - iOwn.xyz) * sc;
      p.x += (k - 0.5) * 520.; p.y += sin(uTime * 0.7 + iOwn.w) * 2.5 + sin(k * 14. + iOwn.w) * 6.;
    } else if (mode == 5) {
      vec3 nr = cross(iB, iC); float nl = length(nr);
      nr = nl > 1e-6 ? nr / nl : vec3(0., 0., 1.);
      p = iOwn.xyz + rotK(p - iOwn.xyz, nr, uTime * (0.25 + 0.2 * fract(iOwn.w)) + iOwn.w);
    } else if (mode == 8) {
      float fall = mod(uTime * (5. + 3. * fract(iOwn.w * 3.7)) + iOwn.w * 9., max(iOwn.y, 1.));
      p = iOwn.xyz + (p - iOwn.xyz) * uShower * smoothstep(0., 2., iOwn.y - fall);
      p.y -= fall;
    } else if (mode == 9) {
      float s = p.x, t = uTime, a = iW.z;
      vec3 D = vec3(sin(a), 0., cos(a)), S = vec3(D.z, 0., -D.x);
      float ph = s * 55. - t * 0.5, r = sin(s * 9.4 + t * 0.17 + iOwn.w); r = 9. * r * r * step(0., r);
      p = iOwn.xyz + D * ((s - 0.5) * 200. + r * cos(ph)) + S * (5. * sin(s * 5. - t * 0.13))
        + vec3(0., 10. + 4. * sin(s * 11. + t * 0.21) + r * sin(ph), 0.);
    } else if (mode >= 10) {
      int g = mode - 10; g = g > 3 ? 3 : g;
      if (g == 0) p = whip(p);
      p = iOwn.xyz + (p - iOwn.xyz) * uOff[g].w + uOff[g].xyz;
    }
    return p;
  }
`,Y0=`
  varying vec3 vDir;
  void main() { vDir = position; vec4 mv = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mv; }
`,J0=`
  uniform sampler2D uNoise; uniform vec3 uLow, uDeep, uScrub, uPool, uGlow, uRubK; uniform float uTime; uniform vec4 uSun;
  varying vec3 vDir;
  float tri(vec3 d, float sc, vec2 off, int ch) {
    vec3 w = d * d;
    vec4 a = texture2D(uNoise, d.yz * sc + off), b = texture2D(uNoise, d.xz * sc + off.yx), c = texture2D(uNoise, d.xy * sc - off);
    vec4 m = a * w.x + b * w.y + c * w.z;
    return ch == 0 ? m.r : ch == 1 ? m.g : m.b;
  }
  void main() {
    vec3 d = normalize(vDir);
    float creep = uTime * 0.004;
    float w1 = tri(d, 0.11, vec2(creep, 0.3), 0);
    vec3 dw = normalize(d + (vec3(w1, tri(d, 0.09, vec2(0.6, creep), 1), w1) - 0.5) * 0.5);
    float n = tri(dw, 0.17, vec2(0.2, creep * 0.7), 1) * 0.65 + tri(dw, 0.41, vec2(creep, 0.8), 2) * 0.35;
    float quiet = smoothstep(0.80, 0.97, dot(d, uPool));
    float k = clamp(d.y * 0.45 + 0.5 + (n - 0.5) * 1.5 * (1. - 0.8 * quiet) + 0.5 * quiet, 0., 1.);
    vec3 col = mix(uLow, uDeep, smoothstep(0.1, 0.9, k));
    // THE RED SUN'S RUBBED PLACE (the designers' ruling, B): paint, not light. One more scrubbed patch of the wash, where
    // the sun's stalk holds the disc. uSun.xyz: from the eye to that place in world metres (the place is a fixed point of
    // the world: it does not swing with the disc, follow its facing, or change with the clock or the progress; only the
    // eye moves), uSun.w its reach in metres. Its outline is a fixed lobed shape about that point in the world's own
    // axes: c is the way from the place to this ray's nearest point to it, and the reach along c is long to port and
    // down (uRubK, away from the Long Ladder), short toward the ladder, and carried in and out by the wash's noise
    // texture read in the place's own metres and directions (no time in it). So it is lopsided, soft-edged and the same
    // size in the world from near and far. It is mixed in HERE, before the tide-marks, the scrub, the pools and the weave
    // are laid, so all of them run through it; from the wash's blue through the scrub colour to the hour's palest at its
    // heart, and the wash is never left paler than that palest colour.
    float st = dot(uSun.xyz, d);
    vec3 rc = d * st - uSun.xyz; float rl = length(rc); vec3 re = rc / max(rl, 1e-3);
    float rk = dot(re, uRubK);
    float lobe = 1. + 0.6 * rk + 0.16 * (2. * re.y * re.y - 1.)
      + 0.5 * (texture2D(uNoise, re.xz * 0.11 + re.y * 0.07 + 0.37).r - 0.5) + 0.3 * (texture2D(uNoise, rc.xz * 0.006 + rc.y * 0.0041 + 0.11).b - 0.5);
    float rb = rl / (max(uSun.w, 1.) * clamp(lobe, 0.4, 1.9));
    float rub = (1. - smoothstep(0.42, 1., rb)) * smoothstep(0., 10., st);
    col = mix(col, uScrub, 0.85 * rub);
    col = mix(col, uGlow, 0.8 * rub * (1. - smoothstep(0.25, 0.9, rb)));
    float tide = 1. - smoothstep(0., 0.035, abs(n - 0.5));
    col *= 1. - 0.12 * tide * (1. - quiet);
    float sc = tri(dw, 0.27, vec2(0.71, 0.13 + creep), 0);
    col = mix(col, uScrub, smoothstep(0.7, 0.8, sc) * 0.55 * (1. - quiet));
    // depth of tone: broad pools where the stain lies thick and dark, others where it was lifted off pale
    float big = tri(dw, 0.045, vec2(0.33, 0.71 + creep * 0.5), 0), lit = tri(dw, 0.062, vec2(0.83 - creep * 0.4, 0.21), 2);
    col *= mix(0.58, 1.06, smoothstep(0.3, 0.62, big));
    col = mix(col, uGlow, 0.2 * smoothstep(0.56, 0.8, lit) * (1. - quiet));
    col = min(col, uGlow);                                            // nothing in the wash is paler than the hour's palest colour
    float az = atan(d.z, abs(d.x) + 1e-4), el = d.y;
    float pitch = 1. / max(length(fwidth(d)) * 229., 1e-3);            // pixels per weave thread (quarter degree)
    col *= 1. + 0.03 * sin(1440. * az) * sin(1440. * el) * smoothstep(2., 4., pitch);
    gl_FragColor = vec4(col, 1.);
  }
`,$0=`
  varying vec2 vP; varying vec2 vUv;
  void main() { vUv = uv * 2. - 1.; vec4 wp = modelMatrix * vec4(position, 1.); vP = wp.xz; gl_Position = projectionMatrix * viewMatrix * wp; }
`,et=`
  uniform vec4 uIsle;
  varying vec2 vP; varying vec2 vUv;
  void main() {
    vUv = uv * 2. - 1.; vec4 wp = modelMatrix * vec4(position, 1.); vP = wp.xz;
    vec2 o = wp.xz - uIsle.xy; float mx = o.x * uIsle.z - o.y * uIsle.w, my = o.x * uIsle.w + o.y * uIsle.z;
    float dd = max(abs(mx) - (21. + 9. * sin(my * 0.041 + (mx < 0. ? -2.2 : 2.2) + 5.3)), 0.) / 28.;
    wp.y -= 12.6 * (sqrt(1. + dd * dd) - 1.);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`,tt=`
  uniform sampler2D uNoise; uniform vec3 uEarth; uniform float uInk; uniform vec4 uIsle; uniform vec2 uIsleR;
  varying vec2 vP; varying vec2 vUv;
  void main() {
    // ONE broad island (world metres) under the whole approach and round the Long Ladder's feet. uIsle: centre xz and the
    // cosine and sine of its turn, uIsleR: half width and half length; m.y runs the island's length, the way the approach
    // flies. Its two long shores go in and out in bays and headlands (each side its own), so from the low flight the blue
    // comes in close on one side and then the other and the shore is never one level line. It has no outline and no
    // darker rim: toward its shore the stain breaks up into dry-brush tongues that run its length with the blue between
    // them; at the far end (beyond the Long Ladder's feet) that fringe is the last third of the radius.
    vec2 o = vP - uIsle.xy, m = vec2(o.x * uIsle.z - o.y * uIsle.w, o.x * uIsle.w + o.y * uIsle.z);
    float sgn = m.x < 0. ? -1. : 1.;
    float wd = uIsleR.x * (1. + 0.45 * sin(m.y * 0.048 + sgn * 1.7 + 0.6) + 0.14 * sin(m.y * 0.081 + sgn * 0.7 + 2.));
    vec2 p = vec2(m.x / max(wd, 20.), m.y / uIsleR.y);
    float q = length(p);
    float n1 = texture2D(uNoise, vP * 0.0021).r, n2 = texture2D(uNoise, vP * 0.011).g, n3 = texture2D(uNoise, vP * 0.09).b;
    float e = q + (n1 - 0.5) * 0.12 + (n2 - 0.5) * 0.05;          // 1 on the shore
    float far = smoothstep(0.15, 0.8, p.y / max(q, 1e-3));
    e += far * 0.16 * (0.6 * sin(m.x * 0.21 + 1.3 * sin(m.x * 0.057 + 0.4)) + 0.4 * sin(m.x * 0.52 + 2.1));   // the far shore: tongues 12 to 30 m wide, some 70 m longer than their neighbours
    float st = texture2D(uNoise, vec2(m.x * 0.012, m.y * 0.0016) + 0.3).g * 0.7 + texture2D(uNoise, vec2(m.x * 0.045, m.y * 0.006) + 0.7).a * 0.3;
    float cut = st - (smoothstep(mix(0.9, 0.64, far), 1.06, e) * 1.08 - 0.03);            // the dry brush: above 0 there is paint
    float cov = smoothstep(0., max(fwidth(cut) * 1.5, 1e-4), cut);
    if (cov < 0.01) discard;
    float px = max(length(fwidth(vP)), 1e-4);
    float fine = 1. - smoothstep(0.3, 1.2, px * 0.09 * 64.);
    vec3 col = uEarth * (1. + 0.12 * (n2 - 0.5) + 0.1 * (n3 - 0.5) * fine);
    float pool = texture2D(uNoise, vP * 0.0043 + 0.37).a * 0.65 + texture2D(uNoise, vP * 0.0125 + 0.11).r * 0.35;
    col *= mix(0.6, 1.0, smoothstep(0.22, 0.5, pool));                     // umber where the stain pooled
    col = mix(col, uEarth * vec3(1.75, 1.5, 1.15), 0.55 * smoothstep(0.55, 0.82, pool));   // dry orange where it was brushed thin
    // furrows as live paints them: ink strokes 3 m apart that curve with the rows; every third is drawn with a loaded
    // brush, so the field still reads as furrowed from far off
    float fx = vP.x + 9. * sin(vP.y * 0.012) + 4. * sin(vP.y * 0.031 + 1.7) + 0.22 * sin(vP.y * 0.21 + vP.x * 0.37);
    float pf = clamp(fwidth(fx), 1e-4, 6.);                               // metres across the furrow per pixel (not the grazing length)
    float brk = smoothstep(0.35, 0.5, texture2D(uNoise, vec2(fx * 0.05, vP.y * 0.004)).a + 0.25);
    float f = abs(fract(fx / 3.) - 0.5) * 3., w = max(0.075 + 0.05 * n3, 1.05 * pf);
    float line = (1. - smoothstep(w, w + max(pf, 0.01), f)) * brk * (1. - smoothstep(0.5, 1.6, px));
    float f9 = abs(fract(fx / 9.) - 0.5) * 9., w9 = max(0.2 + 0.08 * n3, 0.8 * pf);
    line = max(line, (1. - smoothstep(w9, w9 + max(pf, 0.01), f9)) * (0.55 + 0.45 * brk) * (1. - smoothstep(2.2, 4., pf)));
    col = mix(col, vec3(0.012, 0.011, 0.014), 0.96 * line * uInk);
    gl_FragColor = vec4(col, cov);
  }
`,ot=`
  uniform sampler2D uNoise; uniform vec3 uEarth; uniform vec2 uHalf;
  varying vec2 vP; varying vec2 vUv;
  void main() {
    vec2 m = vUv * uHalf;
    float n1 = texture2D(uNoise, m * 0.0021 + 0.4).r, n2 = texture2D(uNoise, m * 0.011 + 0.2).g, n3 = texture2D(uNoise, m * 0.045).b;
    float q = length(vUv) / 0.62, a = atan(vUv.y, abs(vUv.x) > 1e-4 ? vUv.x : 1e-4);
    float lobe = 1. + 0.12 * sin(2. * a + 2.3) + 0.08 * sin(3. * a + 0.5) + 0.05 * sin(5. * a + 1.9);
    float e = q / max(lobe, 0.5) + (n1 - 0.5) * 0.12 + (n2 - 0.5) * 0.05;
    float st = texture2D(uNoise, vec2(m.x * 0.012, m.y * 0.0016) + 0.55).g * 0.7 + texture2D(uNoise, vec2(m.x * 0.045, m.y * 0.006) + 0.15).a * 0.3;
    float cut = st - (smoothstep(0.8, 1.06, e) * 1.08 - 0.03);
    float cov = smoothstep(0., max(fwidth(cut) * 1.5, 1e-4), cut);
    if (cov < 0.01) discard;
    vec3 col = uEarth * (1. + 0.12 * (n2 - 0.5));
    float pool = texture2D(uNoise, m * 0.0075 + 0.61).a;
    col *= mix(0.6, 1.0, smoothstep(0.22, 0.5, pool));
    col = mix(col, uEarth * vec3(1.75, 1.5, 1.15), 0.55 * smoothstep(0.55, 0.82, pool));
    float fx = m.x + 6. * sin(m.y * 0.02) + 2. * sin(m.y * 0.06 + 1.7);
    float f = abs(fract(fx / 5.) - 0.5) * 5., pf = clamp(fwidth(fx), 1e-4, 2.5);
    float w = max(0.12, 1.05 * pf);
    float line = (1. - smoothstep(w, w + max(pf, 0.01), f)) * smoothstep(0.35, 0.5, texture2D(uNoise, vec2(fx * 0.05, m.y * 0.004)).a + 0.25);
    col = mix(col, vec3(0.012, 0.011, 0.014), 0.9 * line * (1. - smoothstep(1.2, 2.5, pf)));
    gl_FragColor = vec4(col, cov);
  }
`,le=f=>{const N=new h.Color(f);return new h.Vector3(N.r,N.g,N.b)};var it={id:"ladder-orchard",name:"The Ladder Orchard",category:"bizarre",weirdness:.9,media:["air","open"],async build(f){const N=f.rng,he=f.vary||{},j=C(f.quality?.detail??1,.6,1),Je=C(he.density??1,.7,1.3);let Y=N.pick(["evening","evening","night","ochre"]);he.hour==="night"?Y="night":he.hour==="golden"||he.hour==="dawn"?Y="ochre":he.hour==="day"&&(Y="evening");const E=N.pick(["harvest","harvest","blossom","seed"]),Fe=N.pick(["tenders","kites","winds"]),P0=!!he.rare,ge={evening:{low:"#2E5FB4",deep:"#14246A",scrub:"#3E78C6",glow:"#79B0EE",stars:40},night:{low:"#1B3478",deep:"#0C1440",scrub:"#25469A",glow:"#4C80DA",stars:120},ochre:{low:"#D9A942",deep:"#C9952E",scrub:"#E3BC5E",glow:"#F5E3A6",stars:30}}[Y],we=Ye.slice();Y==="ochre"&&(we[3]="#14246A",we[6]="#2E5FB4",we[4]="#F3EEDD");const ne=new h.Scene,ue=await x.makeNoiseTex(N.fork("noise"),f),Ve=[ue],Ae={uNoise:{value:ue},uLow:{value:le(ge.low)},uDeep:{value:le(ge.deep)},uScrub:{value:le(ge.scrub)},uPool:{value:new h.Vector3(-.545,.53,.65).normalize()},uTime:{value:0},uGlow:{value:le(ge.glow)},uSun:{value:new h.Vector4(0,500,0,44)},uRubK:{value:new h.Vector3(.766,-.55,.643).normalize()}},De=new h.Mesh(new h.SphereGeometry(2200,32,20),new h.ShaderMaterial({vertexShader:Y0,fragmentShader:J0,uniforms:Ae,side:h.BackSide,depthWrite:!1,depthTest:!1,fog:!1,toneMapped:!1}));De.renderOrder=-1,De.frustumCulled=!1,ne.add(De);const y=[92,262,Math.cos(.166),Math.sin(.166),52,225],de=new h.Mesh(new h.PlaneGeometry(250,600,50,24),new h.ShaderMaterial({vertexShader:et,fragmentShader:tt,uniforms:{uNoise:{value:ue},uEarth:{value:le(Ye[5])},uInk:{value:1},uIsle:{value:new h.Vector4(y[0],y[1],y[2],y[3])},uIsleR:{value:new h.Vector2(y[4],y[5])}},transparent:!0,fog:!1,toneMapped:!1}));de.rotation.x=-Math.PI/2,de.rotation.z=.166,de.position.set(y[0],0,y[1]),de.renderOrder=0,de.frustumCulled=!1,ne.add(de);const S0={uNoise:{value:ue},uEarth:{value:le(Ye[5])},uHalf:{value:new h.Vector2(85,95)}},J=new h.Mesh(new h.PlaneGeometry(2,2),new h.ShaderMaterial({vertexShader:$0,fragmentShader:ot,uniforms:S0,transparent:!0,fog:!1,toneMapped:!1}));J.renderOrder=0,J.frustumCulled=!1,ne.add(J),Ve.push(J.geometry,J.material),await f.yield();const m=await Z0(f,{palette:we,detail:j,gain:1,earth:!1,duration:45,noiseTex:ue});m.object.position.set(90,0,380),m.object.rotation.y=Math.PI-.699,m.object.updateMatrixWorld(!0),ne.add(m.object);const z=e=>e.clone().applyMatrix4(m.object.matrixWorld);await f.yield();const ae=m.anchors.flyThrough.slice(0,9).map(z);ae[0]=z(m.anchors.at(40,-15,7)),ae[1]=z(m.anchors.at(120,-11.5,10.5)),ae[2]=z(m.anchors.at(200,-11.5,10.5)),ae[3]=z(m.anchors.at(248,-12,9)),ae[4]=z(m.anchors.at(292,-11,7.5)),ae[5]=z(m.anchors.at(328,-2,8));const T0=[[67,14,116],[72,14,168],[84,14,222],[97,13,285],[106,10.5,335],[109,10,360],[102,16.5,397]].concat(ae.map(e=>[e.x,e.y,e.z])),M=X0(T0),O0=new h.Vector3,Pe=new h.Vector3,$e=(e,t)=>M.nearestXZ(e,t),q=x.collector(),re=x.collector(),$=x.collector(),fe=x.collector(),e0=x.collector();let o=N.fork("ink");const t0=N.fork("rows"),E0=N.fork("cast"),I0=N.fork("upper"),o0=o,I={};for(const e of["tall","short","trellis","far","sky","stars","blossom","sprouts","seeds","prints","roam","hair","bold","isle"])I[e]=N.fork(e);const n0=(e,t)=>{const a=o;o=e;const n=t();return o=a,n},F=()=>o.range(0,40),ee=[0,0,0,0],a0=(e,t,a)=>[(e[0]+t[0])/2+(a?a[0]:0),(e[1]+t[1])/2+(a?a[1]:0),(e[2]+t[2])/2+(a?a[2]:0)],U=(e,t,a,n,r,s={})=>e.push(t,a0(t,a,n),a,[r,F(),s.g||0,s.mode||0],s.own||ee,[s.minPx??2,s.taper||0,s.chain?1:0]),H=(e,t,a={})=>$.push(e,[t,0,0],[0,t,0],[a.rag??.7,F(),a.g||0,a.mode||0],a.own||ee,[0,0,a.keep?1:2]),pe=(e,t,a,n,r,s={})=>(r===0?$:r===4?e0:fe).push(e,t,a,[s.rag??1,F(),s.g||0,s.mode||0],s.own||ee,[n,r,0]),Se=(e,t,a,n)=>{const r=1-n;return[e[0]*r*r+t[0]*2*r*n+a[0]*n*n,e[1]*r*r+t[1]*2*r*n+a[1]*n*n,e[2]*r*r+t[2]*2*r*n+a[2]*n*n]},R0=E==="blossom"?[4,4,4,0,4]:[0,0,2,1,4,4,3,2,1,4,0],C0=(e,t,a,n,r,s={})=>{const i=[e[0]+t[0],e[1]+t[1],e[2]+t[2]];if(M.distanceTo(i[0],i[1],i[2])<a+6.5)return;const l=Math.hypot(t[0],t[1],t[2]),d=l>9?re:q;U(d,[e[0]-t[0]*.25,e[1]-t[1]*.25-.3,e[2]-t[2]*.25],i,[0,l*.16,0],s.w||.09,{mode:6,g:s.bob??.25,own:n,minPx:s.minPx??2}),H([e[0]-t[0]*.25,e[1]-t[1]*.25-.3,e[2]-t[2]*.25],Math.max(a*.13,.16),{mode:6,g:s.bob??.25,own:n});const u=s.kind??o.pick(R0),g=o.range(-.7,.7),p=Math.cos(g),w=Math.sin(g),v=-r[1],k=r[0],D=[v*p*a,w*a,k*p*a],P=[-v*w*a,p*a,-k*w*a];pe(i,D,P,u,u===0?2:u===2||u===4?3:u===3?6:0,{mode:6,g:s.bob??.25,own:n,rag:1})},te=(e,t,a,n,r,s,i,l={})=>{const d=[e,t,a,o.range(0,6.28)],u=Math.cos(r)*Math.cos(s),g=Math.sin(r)*Math.cos(s),p=Math.sin(s),w=-Math.sin(r),v=Math.cos(r),k=i*o.range(.65,1.2),D=[e+u*n,t+p*n,a+g*n],P=l.rail||.13,V=1,b=[-1,1].map(S=>{const G=[e+w*i*.5*S,t,a+v*i*.5*S],Q=[D[0]+w*k*.5*S,D[1]+o.range(-.04,.04)*n,D[2]+v*k*.5*S],ce=o.range(-.035,.035)*n,ke=o.range(.01,.05)*n,oe=a0(G,Q,[w*ce-u*ke,0,v*ce-g*ke]);return re.push(G,oe,Q,[P,F(),0,V],d,[l.px||2,0,0]),[G,oe,Q]}),ie=l.spacing||C(n/9,1.5,6),A=Math.max(2,Math.floor(n/ie)-1);for(let S=1;S<=A;S++){const G=(S+o.range(-.15,.15))/(A+1),Q=Se(...b[0],G),ce=Se(...b[1],G+o.range(-.01,.01));U(q,Q,ce,[0,-.09*i,0],P*.8,{mode:V,own:d,minPx:l.px?l.px*.75:-2}),l.far||(H(Q,P*1.25,{mode:V,own:d}),H(ce,P*1.25,{mode:V,own:d}))}const B=l.fruit??0,Z=l.face||[0,-1];for(let S=0;S<B;S++){const G=o.chance(.5)?0:1,Q=o.range(.55,1),ce=Se(...b[G],Q),ke=(G?1:-1)*o.range(.5,1),oe=C(n*o.range(.12,.22),2,l.far?40:12),Q0=C(n*o.range(.05,.11),1,l.far?13:4.5);C0(ce,[w*ke*oe+o.range(-.2,.2)*oe,o.range(-.1,.7)*oe,v*ke*oe+o.range(-.2,.2)*oe],Q0,d,Z,{w:P*.7,bob:C(n*.006,.12,.9)})}return D.rails=b,D},r0=(e,t,a,n)=>{const r=a-e,s=n-t,i=Math.hypot(r,s)||1;return[r/i,s/i]},nt=()=>E==="seed"?0:o.int(1,3),T=new h.Vector3,R=new h.Vector3,O=M.length,ve=e=>1-(1-e)*883.5/O,_e=M.nearestXZ(90,380).u*O,s0=[];for(let e=0;e<=_e;e+=2.5)s0.push(M.pointAt(e/O,new h.Vector3));const N0=[0,80,160,240,320,400,474].map(e=>z(m.anchors.at(e,0,2))).concat([z(m.anchors.at(300,-70,9))]),se=new h.Vector3,xe=new h.Vector3,ye=(e,t,a,n,r=6)=>{for(const s of s0){se.set(e-s.x,t-s.y,a-s.z);const i=se.length();if(i<1)return!0;se.multiplyScalar(1/i);const l=Math.cos(Math.min(r*Math.PI/180+Math.atan2(n,i),1.2));for(const d of N0)if(xe.copy(d).sub(s).normalize(),xe.dot(se)>l)return!0}return!1},Te=z(m.anchors.at(474,0,5)),We=z(m.anchors.axis.clone()).sub(z(new h.Vector3)).normalize(),i0=[];for(let e=O-150;e<O;e+=2.5)i0.push(M.pointAt(e/O,new h.Vector3));const Oe=(e,t,a,n)=>{if((e-Te.x)*We.x+(t-Te.y)*We.y+(a-Te.z)*We.z<-1)return!1;for(const r of i0){se.set(e-r.x,t-r.y,a-r.z);const s=Math.max(se.length(),1);xe.copy(Te).sub(r);const i=Math.max(xe.length(),1);if(se.dot(xe)/(s*i)>Math.cos(Math.min(.4363+Math.atan2(n,s),1.2)))return!0}return!1},c0=(e,t,a,n,r,s)=>{for(let i=.25;i<=1;i+=.25)if(Oe(e+Math.cos(r)*Math.cos(s)*n*i,t+Math.sin(s)*n*i,a+Math.sin(r)*Math.cos(s)*n*i,n/6))return!0;return!1},_=(e,t,a)=>{M.pointAt(e/O,T),M.tangentAt(e/O,R);const n=Math.hypot(R.x,R.z)||1;return a[0]=T.x-R.z/n*t,a[1]=T.z+R.x/n*t,a},c=[0,0],K=(e,t,a=.86)=>{const n=e-y[0],r=t-y[1],s=n*y[2]-r*y[3],i=n*y[3]+r*y[2],l=s<0?-1:1,d=y[4]*(1+.45*Math.sin(i*.048+l*1.7+.6)+.14*Math.sin(i*.081+l*.7+2)),u=i/y[5],g=Math.hypot(s/Math.max(d,20),u),p=be(.15,.8,u/Math.max(g,.001));return g+p*.16*(.6*Math.sin(s*.21+1.3*Math.sin(s*.057+.4))+.4*Math.sin(s*.52+2.1))<a*Ge(1,.64/.9,p)},Le=Math.atan2(y[2],y[3]),Be=[-y[3],-y[2]],W=(e,t)=>{const a=e-y[0],n=t-y[1],r=a*y[2]-n*y[3],s=a*y[3]+n*y[2],i=Math.max(Math.abs(r)-(21+9*Math.sin(s*.041+(r<0?-2.2:2.2)+5.3)),0)/28;return-12.6*(Math.sqrt(1+i*i)-1)};await f.yield();const l0=Math.round(Ge(9,14,(j-.6)/.4)*Math.min(Je,1.1));o=I.tall;for(let e=0;e<l0;e++){const t=34+e/l0*300+o.range(-8,8);let a=-(11+o.range(0,1)**1.6*46+(e%3===2?30:0));t>.16*O-6&&t<.16*O+56&&a>-30&&(a-=24),_(t,a,c),M.pointAt(t/O,T);const n=K(c[0],c[1])?W(c[0],c[1]):-o.range(20,60),r=T.y-n+o.range(4,26)+10,s=te(c[0],n,c[1],r,Le+o.range(-.5,.5),o.range(1.3,1.5),o.range(3,4.4),{rail:.34,px:3.8,spacing:C(r/11,3,6),fruit:E==="seed"?1:o.int(2,3),face:Be});e%2===1&&await f.yield()}const h0=Math.round(Ge(7,11,(j-.6)/.4));o=I.short;for(let e=0;e<h0;e++){const t=216+e/h0*124+o.range(-6,6),a=9+o.range(0,60);if(_(t,a,c),M.pointAt(t/O,T),Math.hypot(c[0]-90,c[1]-380)<20||!K(c[0],c[1],1))continue;const n=o.range(8,17);te(c[0],W(c[0],c[1]),c[1],n,o.range(0,6.28),o.range(1.2,1.48),o.range(2.2,3.2),{rail:.26,px:3,fruit:e%2?1:0,face:Be})}await f.yield();const u0=[];{const e=o;o=t0;for(let t=0;t<3;t++)for(const a of[-1,1]){const n=19+t*3;for(let r=8+(a>0?n*.5:0)+t*5;r<_e;r+=n){const s=r+o.range(-4,4),i=a*(9+24*t+o.range(-3,3));_(s,i,c),M.pointAt(s/O,T);const l=a<0?o.range(17,30)+t*o.range(0,14):o.range(7,12.5),d=o.range(1.15,1.48),u=Le+a*o.range(0,.5),g=o.range(2.2,3.4)*(a<0?1.2:1),p=t===0&&a<0;{let w=1e9;for(let v=0;v<=1;v+=.125)w=Math.min(w,M.distanceTo(c[0]+Math.cos(u)*Math.cos(d)*l*v,Math.sin(d)*l*v,c[1]+Math.sin(u)*Math.cos(d)*l*v));w-.62*g<5.5&&_(s,i+a*(5.5+.62*g-w),c)}!K(c[0],c[1],.93)||Math.hypot(c[0]-90,c[1]-380)<24||(te(c[0],W(c[0],c[1]),c[1],l,u,d,g,{rail:[.28,.2,.15][t],px:[3,2.3,1.8][t],spacing:p?l/17:C(l/8,1.5,4),fruit:E==="seed"?t?0:1:t===0?2:1,face:Be}),p&&u0.push([c[0],c[1],l,u,d,W(c[0],c[1])]))}await f.yield()}for(let t=0;t<33;t++){const a=o.range(0,6.2832),n=o.range(85,210),r=90+Math.cos(a)*n,s=380+Math.sin(a)*n,i=o.range(60,120),l=-o.range(15,50),d=o.range(0,6.28),u=o.range(1.25,1.48),g=o.range(4,7),p=E==="seed"?1:o.int(2,3);K(r,s,1.1)||$e(r,s).dist<45||ye(r,l+i*.6,s,i*.5,4)||c0(r,l,s,i,d,u)||te(r,l,s,i,d,u,g,{rail:.4,px:2.8,spacing:7,fruit:p,face:r0(r,s,90,380)})}await f.yield(),o=e}o=I.trellis;for(let e=0;e<9;e++){const t=140+e*36,a=e%3===0?1:-1,n=z(m.anchors.at(t,a*o.range(24,46)-4,-o.range(10,28))),r=n.y/Math.sin(1.4),s=o.range(0,6.28),i=n.x-Math.cos(s)*Math.cos(1.4)*r,l=n.z-Math.sin(s)*Math.cos(1.4)*r;te(i,K(i,l,1)?W(i,l):0,l,r,s,1.4,o.range(4,7),{rail:.36,px:2.6,spacing:6,fruit:E==="seed"?1:3,face:[.643,-.766]}),e%4===3&&await f.yield()}const q0=Math.round(26*(j<1?.6:1));o=I.far;for(let e=0;e<q0;e++){const t=o.range(0,6.28),a=o.range(320,900),n=20+Math.cos(t)*a,r=350+Math.sin(t)*a,s=e%2===1||a>480,i=o.range(150,320),l=s?-o.range(60,260):0,d=o.range(0,6.28),u=o.range(1.1,1.45);$e(n,r).dist<150||ye(n,l+i*.5,r,i*.5,4)||c0(n,l,r,i,d,u)||(te(n,l,r,i,d,u,o.range(9,16),{rail:.7,px:2.6,spacing:14,far:!0,fruit:E==="seed"?0:o.int(0,2),face:r0(n,r,40,300)}),e%10===9&&await f.yield())}await f.yield();const Ee=(e,t)=>{const a=Math.cos(t)*e,n=Math.sin(t)*e;return[[.643*a,n,.766*a],[-.643*n,a,-.766*n]]},U0=Math.round(64*j*Je);o=I.sky;for(let e=0;e<U0;e++){const t=o.range(0,6.28),a=o.range(110,600),n=20+Math.cos(t)*a,r=420+Math.sin(t)*a,s=o.range(-220,460),i=o.range(2.5,6.5)*(1+a/400),l=o.pick([4,4,1,0,0,2,4]);if(M.distanceTo(n,s,r)<(r<420&&s<130?80:45)+i||ye(n,s,r,i)||Oe(n,s,r,i))continue;const[d,u]=Ee(i,o.range(-.8,.8)),g=[n,s,r,o.range(0,6.28)];pe([n,s,r],d,u,l,E==="seed"&&l===0?0:l===0?2:l===1?0:3,{mode:l===4?5:6,g:1.5,own:g})}o=I.stars;for(let e=0;e<ge.stars;e++){const t=o.range(0,6.28),a=o.range(-.5,1.3),n=o.range(500,1100),r=20+Math.cos(t)*Math.cos(a)*n,s=120+Math.sin(a)*n,i=420+Math.sin(t)*Math.cos(a)*n,[l,d]=Ee(o.range(7,16),o.range(0,1.5)),u=o.range(0,6.28);Oe(r,s,i,16)||pe([r,s,i],l,d,4,4,{mode:5,own:[r,s,i,u],rag:.6})}if(o=I.blossom,E==="blossom"){const e=Math.round(520*j);for(let t=0;t<e;t++){t%60===59&&await f.yield();const a=o.range(20,360),n=t%4!==0,r=n?-o.range(8,60):o.range(8,50);_(a,r,c),M.pointAt(a/O,T);const s=n?T.y+o.range(-24,20):o.range(1,9),i=o.range(.45,1.1);M.distanceTo(c[0],s,c[1])<7||ye(c[0],s,c[1],i,3)||pe([c[0],s,c[1]],[i,0,0],[0,i,0],4,3,{mode:5,own:[c[0],s,c[1],o.range(0,6.28)],rag:.5})}}await f.yield();const d0=(e,t)=>{const a=9*Math.sin(t*.012)+4*Math.sin(t*.031+1.7);return 3*Math.round((e+a)/3)-a},G0=Math.round(70*j*(E==="seed"?2:1)),f0=(e,t,a)=>{for(let n=0;n<e;n++){if(_(o.range(t,a),o.range(-30,30)*(n%3?1:.45),c),!K(c[0],c[1]))continue;const r=c[1],s=d0(c[0],r)+1.5,i=o.range(1.4,3),l=i*.3,d=o.range(0,3.14),u=W(s,r),g=Math.cos(d)*l*.5,p=Math.sin(d)*l*.5,w=[s,u,r,o.range(0,6.28)],v=o.chance(.3)?i*.45:i*.06,k=o.range(-.25,.25)*i,D={mode:6,g:.05,own:w,minPx:-1.8};U(q,[s-g,u,r-p],[s-g+k+v*.5,u+i,r-p],[-v,v*.3,0],.07,D),U(q,[s+g,u,r+p],[s+g+k+v*.5,u+i*.94,r+p],[-v,v*.3,0],.07,D);for(let P=1;P<=3;P++){const V=P/4,b=4*V*(1-V)*-v*.5;U(q,[s-g+k*V+b,u+i*V,r-p],[s+g+k*V+b,u+i*V*.96,r+p],[0,-.03,0],.055,D)}}};o=I.sprouts,f0(G0,214,335),await f.yield();const F0=Math.round(700*j),p0=(e,t,a)=>{for(let n=0;n<e;n++)if(_(o.range(t,a),o.range(-34,34)*(n%2?1:.4),c),!!K(c[0],c[1],.9)){const r=d0(c[0],c[1])+o.range(-.1,.1);H([r,W(r,c[1])+.12,c[1]],o.range(.1,.24),{rag:.9})}};o=I.seeds,p0(F0,212,345),await f.yield();{const e=o;o=t0;for(let t=0;t<2;t++)f0(Math.round(85*j*(E==="seed"?2:1)),2,214),await f.yield();for(let t=0;t<4;t++)p0(Math.round(300*j),2,212),await f.yield();for(let t=0;t<6;t++){_(o.range(10,205),o.range(-22,22),c);let a=c[0],n=c[1],r=o.range(0,6.28);for(let s=0;s<70;s++)r+=o.range(-.3,.3),a+=Math.cos(r)*.7,n+=Math.sin(r)*.7,K(a,n)&&H([a,W(a,n)+.1,n],.11,{rag:1})}o=e}o=I.prints;for(let e=0;e<3;e++){let t=o.range(70,125),a=o.range(350,420),n=o.range(0,6.28);for(let r=0;r<70;r++)n+=o.range(-.3,.3),t+=Math.cos(n)*.7,a+=Math.sin(n)*.7,K(t,a)&&H([t,W(t,a)+.1,a],.11,{rag:1})}await f.yield();const Ie=(e,t,a,n,r,s,i=1,l=0,d=null)=>{n=(n%6.2832+6.2832)%6.2832;const u=l?.34:.2,g=l?.14*i:.085,p=1,w=d?(d.hd%6.2832+6.2832)%6.2832+10*Math.round((C(d.el,1,1.5)-1)*200):n+10*Math.round((i-1)*10),v=[e,t,a,d?s+100*Math.round(d.sp*10):s],k={mode:r,g:w,own:v,minPx:l?2.2:-1.8},D=Math.cos(n),P=Math.sin(n),V=o.chance(.5)?1:-1,b=(A,B)=>[e+D*A*i,t+B*i,a+P*A*i];U(q,b(0,0),b(u,.27),null,g,k),U(q,b(u,.27),b(-u,.53),null,g,k),U(q,b(-u,.53),b(0,.8),null,g,k);const ie=(l?.5:.16)*V*i;U(q,b(0,.8),b(.08*V,2.4),[D*ie,0,P*ie],l?.3*i:.11,l?{...k,minPx:3}:k),U(q,b(.08*V,2.4),b(.5*V*p,2.62),[0,.08*i,0],l?.09*i:.04,k),$.push(b(.62*V*p,2.66),[.25*i*p,0,0],[0,.25*i*p,0],[.7,F(),w,r],v,[0,0,1]),fe.push(b(-.3*V*p,1.5),[D*.36*i*p,0,P*.36*i*p],[0,.3*i*p,0],[1,F(),w,r],v,[5,o.chance(.6)?2:3,0])},_0=Math.round(48*j*(Fe==="tenders"?1.5:1));o=I.roam;for(let e=0;e<_0*2;e++){if(_(o.range(8,345),o.range(-45,45)*(e%4?.5:1.3),c),!K(c[0],c[1]))continue;const t=o.range(0,6.28),a=Math.cos(t)*20.8,n=Math.sin(t)*20.8;W(c[0]+a,c[1]+n)>-1&&W(c[0]-a,c[1]-n)>-1&&Ie(c[0],0,c[1],t,2,o.range(0,16),1)}await f.yield();{o=I.hair,M.pointAt(.16,T),M.tangentAt(.16,R);const e=Math.hypot(R.x,R.z)||1,t=R.x/e,a=R.z/e,n=-a,r=t,s=-n*.906+t*.423,i=-r*.906+a*.423,l=T.y+4.5,d=T.x+t*20-n*6,u=T.z+a*20-r*6,g=Math.atan2(a,t),p=te(d+s*10.6-t*3.4,0,u+i*10.6-a*3.4,l+20,g+o.range(-.08,.08),o.range(1.4,1.46),3.2,{rail:.34,px:4,spacing:(l+20)/9.5,fruit:3,face:[-t,-a]}),w=[[d+s*9,l,u+i*9],[d-s*9,l,u-i*9]];U(re,w[0],w[1],[0,-4.8,0],.12,{minPx:2.4});const v=Se(...p.rails[1],C(l/Math.max(p[1],1),0,1));U(q,w[0],v,[0,.5,0],.12,{minPx:2.4}),H(w[0],.26,{keep:!0}),H(v,.42,{rag:1.1,keep:!0});const k=[w[1][0]-s*.5,l+2.7,w[1][2]-i*.5];U(q,w[1],k,[-s*.8,-.2,-i*.8],.12,{minPx:2.4}),H(w[1],.3,{keep:!0}),fe.push(k,[n*1.05,0,r*1.05],[0,1.05,0],[1,F(),0,0],ee,[0,2,0]),$.push([k[0]-n*1.5,k[1]+2.3,k[2]-r*1.5],[n*1.8,.4,r*1.8],[-n*.4,1.8,-r*.4],[1,F(),0,0],ee,[1,0,0]);for(const A of[-.78,-.52,-.3,.36,.6,.83])H([d+s*9*A,l-2.4*(1-A*A)-.2,u+i*9*A],.14+.08*Math.abs(A),{rag:.9,keep:!0});Ie(d,l,u,Math.atan2(i,s),3,0,1,1),await f.yield(),o=I.bold;for(let A=14,B=0;A<_e;A+=17,B++){const Z=o.range(-4,4),S=B%2?1:-1;for(const G of[S*o.range(3.5,8),-S*o.range(11,19)])_(A+Z,G,c),!(Math.hypot(c[0]-90,c[1]-380)<9||!K(c[0],c[1]))&&Ie(c[0],W(c[0],c[1]),c[1],Le+1.5708+o.range(-.5,.5),7,o.range(0,20),1,1)}o=o0,await f.yield(),n0(E0,()=>{for(const[A,B,Z,S,G,Q]of u0)Ie(A,Q,B,S+1.5708,16,o.range(0,16),1,1,{hd:S,el:G,sp:Z/17})}),await f.yield();const D=z(new h.Vector3),P=z(m.anchors.at(243,-114,-72)),V=z(new h.Vector3(1,0,0)).sub(D),b=z(m.anchors.axis.clone()).sub(D),ie=z(m.anchors.normal.clone()).sub(D);J.position.copy(P),J.quaternion.setFromRotationMatrix(new h.Matrix4().makeBasis(V,b,ie)),J.scale.set(85,95,1),o=I.isle;for(let A=0;A<6;A++){const B=P.clone().addScaledVector(V,o.range(-.42,.42)*85).addScaledVector(b,o.range(-.4,.4)*95),Z=ie.clone().multiplyScalar(.75).add(new h.Vector3(o.range(-.2,.2),.45,o.range(-.2,.2))).normalize();te(B.x,B.y,B.z,o.range(42,80),Math.atan2(Z.z,Z.x),Math.asin(C(Z.y,-1,1)),o.range(4,7),{rail:.36,px:2.6,spacing:6,fruit:E==="seed"?1:3,face:[.643,-.766]})}}await f.yield(),o=o0;const m0=(e,t,a,n,r,s)=>{const i=[e,t,a,s];fe.push([e,t,a],[.6,0,0],[0,.6,0],[1,F(),r,n],i,[0,2,0]),$.push([e-1.5,t+.9,a],[1.15,.25,0],[-.25,1.15,0],[1,F(),r,n],i,[1,0,0]),re.push([e,t,a],[e-4.5,t+1,a],[e-9,t-1.2,a],[.09,F(),r,n],i,[2,.7,0])},W0=Fe==="kites"?6:3;for(let e=0;e<W0;e++){const t=o.int(5,8),a=52+o.range(-30,0)+(e%2?90:0),n=o.range(200,460),r=o();for(let s=0;s<t;s++)m0(40+o.range(-9,9),a+o.range(-5,5),n+o.range(-8,8),4,r,o.range(0,6.28))}for(let e=0;e<9;e++)m0(o.range(-7,7)+(e-4)*.8,o.range(-2.2,3.2),o.range(-2.5,2.5),10,0,o.range(0,6.28));const g0=(e,t,a,n)=>{for(let r=0;r<60;r++)re.push([r/60,0,0],[(r+.5)/60,0,0],[(r+1)/60,0,0],[.1,7.7,a,9],[e,0,t,n],[2,0,1])};{const e=_(10,-10,[0,0]),t=_(210,-10,[0,0]);g0((e[0]+t[0])/2,(e[1]+t[1])/2,Math.atan2(t[0]-e[0],t[1]-e[1]),o.range(0,6))}Fe==="winds"&&g0(170,190,-.3,o.range(0,6)),M.pointAt(.27,T),M.tangentAt(.27,R);for(let e=0;e<20;e++){const t=-(6+o.range(0,11)),a=o.range(14,44),n=T.x-R.z*t+R.x*a,r=T.z+R.x*t+R.z*a,s=o.range(34,60);for(let i=0;i<12;i++)$.push([n,s,r],[o.range(.28,.6),0,0],[0,.3,0],[.8,F(),0,8],[n,s,r,e*.37+i*(s/12)/9],[0,0,1])}const w0=new h.Vector3(-.545,.53,.65).normalize(),Re=new h.Vector3(.766,0,.643),X=w0.clone().multiplyScalar(.8).addScaledVector(new h.Vector3(0,1,0),.35).normalize();$.push([0,0,0],[1.3,0,0],[0,1.3,0],[.8,3.1,0,11],ee,[0,0,1]),re.push([0,0,0],[-X.x*60,-X.y*60-16,-X.z*60],[-X.x*120,-X.y*120,-X.z*120],[.09,4.2,0,11],ee,[2,.9,0]);const je=z(m.anchors.normal.clone()).sub(z(new h.Vector3)).normalize();fe.push([0,0,0],[Re.x*45,0,Re.z*45],[je.x*45,je.y*45,je.z*45],[1,9.3,0,12],ee,[0,3,0]),await f.yield();const L0=we.map(le),L={uTime:{value:0},uHop:{value:0},uShower:{value:0},uCross:{value:0},uRes:{value:new h.Vector2(800,450)},uOff:{value:[new h.Vector4(0,-900,0,0),new h.Vector4(0,-900,0,0),new h.Vector4(0,-900,0,0),new h.Vector4(0,0,0,1)]},uNoise:{value:ue},uCol:{value:L0},uGain:{value:1}},v0=x.strokeVert(D0),Ce=x.quadVert(D0),x0=x.strokeGeometry(6),y0=x.strokeGeometry(24),Ne=x.quadGeometry();n0(I0,()=>{for(let e=0;e<16;e++){const t=z(m.anchors.at(o.range(120,470),(e%2?1:-1)*o.range(45,150),o.range(20,110))),a=o.range(7,13),n=o.pick([4,4,1,0,0,2,4]),[r,s]=Ee(a,o.range(-.8,.8));M.distanceTo(t.x,t.y,t.z)<45+a||Oe(t.x,t.y,t.z,a)||ye(t.x,t.y,t.z,a)||pe([t.x,t.y,t.z],r,s,n,E==="seed"&&n===0?0:n===0?2:n===1?0:3,{})}}),Ve.push(x0,y0,Ne);const Ke=new h.Group;Ke.name="orchard",ne.add(Ke);const me=(e,t,a,n)=>{const r=new h.Mesh(e,t);return r.renderOrder=a,r.frustumCulled=!1,r.name=n,Ke.add(r),r},M0=x.instanced(Ne,fe);me(M0,x.passMaterial(Ce,x.QUAD_FRAG,{...L,uInk:{value:1},uUseCol:{value:0}},"mul"),3,"knock-out"),me(M0,x.passMaterial(Ce,x.QUAD_FRAG,{...L,uInk:{value:1},uUseCol:{value:1}},"stain"),4,"stain"),await f.yield(),me(x.instanced(Ne,$),x.passMaterial(Ce,x.QUAD_FRAG,{...L,uInk:{value:.975},uUseCol:{value:0}},"mul"),5,"ink-dots"),await f.yield(),me(x.instanced(x0,q),x.passMaterial(v0,x.STROKE_FRAG,{...L,uInk:{value:.975},uWave:{value:new h.Vector2(.8,1.7)}},"mul"),5,"ink-short"),await f.yield(),me(x.instanced(y0,re),x.passMaterial(v0,x.STROKE_FRAG,{...L,uInk:{value:.975},uWave:{value:new h.Vector2(2.3,5.1)}},"mul"),5,"ink-long");const z0=M.pointAt(1,new h.Vector3),He=M.tangentAt(1,new h.Vector3).normalize(),k0=new h.Vector3().crossVectors(He,new h.Vector3(0,1,0)).normalize(),B0=new h.Vector3().crossVectors(k0,He).normalize();for(let e=0;e<5;e++){const t=.5+e*1.257,a=11.5+e%2*3.5,n=z0.clone().addScaledVector(k0,Math.cos(t)*a).addScaledVector(B0,Math.sin(t)*a*.85+1).addScaledVector(He,2),[r,s]=Ee(1.3+e%3*.4,e*.5);pe([n.x,n.y,n.z],r,s,4,4,{mode:5,own:[n.x,n.y,n.z,e*1.3],rag:.6})}const b0=new h.ShaderMaterial({uniforms:{uTime:Ae.uTime,uColor:{value:new h.Color("#F3EEDD")}},vertexShader:"varying vec2 vL; void main(){ vL = position.xy; vec4 mv = modelViewMatrix * vec4(0., 0., 0., 1.); mv.xy += position.xy; mv.z -= 0.4; gl_Position = projectionMatrix * mv; }",fragmentShader:`uniform float uTime; uniform vec3 uColor; varying vec2 vL;
        void main(){ float r = length(vL) / 7.; float x = max(r - 0.985, 0.);
          float edge = (1. - smoothstep(1.2, 2.4, x)) * smoothstep(0.93, 0.985, r);
          float g = exp(-x * x * 900.) * 3.2 + exp(-x * 7.) * 0.75 * (0.9 + 0.1 * sin(uTime * 0.9)) + exp(-x * 2.2) * 0.07;
          gl_FragColor = vec4(uColor * g * edge * edge, 1.); }`,blending:h.AdditiveBlending,depthWrite:!1,transparent:!0,toneMapped:!1,fog:!1}),Me=new h.Mesh(new h.PlaneGeometry(52,52),b0);Me.position.copy(z0),Me.renderOrder=6,Me.frustumCulled=!1,ne.add(Me),Ve.push(Me.geometry,b0);const j0=x.QUAD_FRAG.replace("min(col * (cov * vInfo.z), vec3(1.))","col * (cov * vInfo.z)"),V0=x.passMaterial(Ce,j0,{...L,uInk:{value:1},uUseCol:{value:1},uGain:{value:Y==="ochre"?1.25:1.4}},"mul");V0.blending=h.AdditiveBlending,me(x.instanced(Ne,e0),V0,6,"asterisks"),await f.yield();const qe=(e,t,a,n,r)=>be(t,a,e)*(1-be(n,r,e)),Ue=M.pointAt(.08,new h.Vector3).addScaledVector(M.tangentAt(.08,new h.Vector3),14);Ue.y-=3.2;const Qe=M.pointAt(ve(.62),new h.Vector3).addScaledVector(Re,18),Xe=new h.Vector2,ze=new h.Vector3,Ze=z(m.anchors.signs[0].hold),K0=e=>m.signPose(0,e).applyMatrix4(m.object.matrixWorld),A0=(e,t)=>m.signPoseAt(0,Math.max(1-(1-t)*O/883.5,0),e,O0).applyMatrix4(m.object.matrixWorld),H0=z(m.anchors.at(330,-100,-240));return{scene:ne,path:M,duration:45,pace:e=>1.08-.26*be(.36,.45,e)+.18*be(.76,.84,e),title:Y==="night"?"The Ladder Orchard, Night":Y==="ochre"?"The Ladder Orchard, Ochre":"The Ladder Orchard",camera:{fov:62,near:.3,far:2500,lookAhead:22,sway:.5,bank:.6},pois:[{at:(e,t)=>A0(e,t),from:0,to:.42,weight:.4},{at:H0,from:ve(.44),to:ve(.64),weight:.32},{at:(e,t)=>A0(e,t),from:ve(.58),to:ve(.8),weight:.5}],portal:{shape:"circle",radius:7,tilt:!0,color:"#F3EEDD",glow:1,halo:!1,revealDistance:500},post:{flat:1,exposure:1,bloom:{strength:.2,radius:.45,threshold:1},grade:{saturation:1,contrast:1,vignette:0,grain:0}},ride:"none",style:"none",update(e,t,a,n){a.getWorldPosition(ze),De.position.copy(ze);const r=Math.max(1-(1-n)*O/883.5,0);m.setProgress(r),m.update(e,t,a),Ae.uTime.value=t%3600,Ae.uSun.value.set(Ze.x-ze.x,Ze.y-ze.y,Ze.z-ze.z,44),L.uTime.value=t%3600,L.uHop.value=t*.6%16,f.renderer&&f.renderer.getDrawingBufferSize&&(f.renderer.getDrawingBufferSize(Xe),Xe.y>0&&L.uRes.value.copy(Xe)),L.uShower.value=E==="seed"?1:qe(n,.2,.235,.295,.33),L.uCross.value=C((n-.12)/.005,0,16);const s=L.uOff.value;s[0].set(Ue.x+C((n-.076)*2600,-160,160),Ue.y,Ue.z,qe(n,.02,.035,.125,.14));const i=(r-.622)*3e3;s[1].set(Qe.x+X.x*i,Qe.y+X.y*i,Qe.z+X.z*i,qe(r,.565,.58,.68,.695)),P0&&(K0(Pe).addScaledVector(w0,14).addScaledVector(Re,Ge(-80,80,C((r-.64)/.2,0,1))),s[2].set(Pe.x,Pe.y,Pe.z,qe(r,.5,.62,.86,.93)))},dispose(){m.dispose();for(const e of Ve)e.dispose()}}}};export{it as default};
