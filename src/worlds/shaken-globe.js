import*as t from"three";import{mergeGeometries as ne}from"three/addons/utils/BufferGeometryUtils.js";import{makePath as xo,smoothstep as _,clamp as be,lerp as Ie}from"../kit/core.js";import{buildHero as Mo}from"../parts/shaken-globe.js";const W=Math.PI*2,Yt=Math.PI/180,ko=["#f7f4ee","#cfe4f5","#8fb8e6","#1c3e9a","#1f5a4a","#ffe2a0","#d6263a"],So={sunrise:{title:"The Shaken Globe at Sunrise",el:10,az:.42,sun:"#ffb27c",sunK:1.12,top:"#6f93e4",hor:"#ffc7a6",lawn:"#d6dcf2",trees:"#8a97cf",fog:"#c3cdea",skyFill:"#7aaaf0",snow:0,thaw:0,tint:"#fff6ea",fogD:.0033,exp:.76,con:1.13,sat:1.15,caK:1.6,tsTop:.66,bok:.7},morning:{title:"The Shaken Globe",el:22,az:-.22,sun:"#ffe2a0",sunK:1,top:"#6a9fe4",hor:"#e2edf7",lawn:"#cfe4f5",trees:"#93b6e0",fog:"#c0daf3",skyFill:"#a3c6f0",snow:0,thaw:0,tint:"#fffaf0",caK:1.25},overcast:{title:"The Shaken Globe, Snow on Snow",el:34,az:.1,sun:"#fff0d8",sunK:.84,top:"#8aa9de",hor:"#e9eef4",lawn:"#dde8f3",trees:"#8fa6cc",fog:"#c4d6ec",skyFill:"#9dbbea",snow:1,thaw:0,tint:"#f7faff"},thaw:{title:"The Shaken Globe in the Thaw",el:30,az:.5,sun:"#ffcf7a",sunK:1.05,top:"#5fa4ea",hor:"#ffe9c0",lawn:"#9ccf8c",trees:"#78aa86",fog:"#cfe6e0",skyFill:"#a4cbee",snow:0,thaw:1,tint:"#fffbec"}},To=`
  varying vec3 vW;
  void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,qo=`
  uniform vec3 uC, uSunR, uSunCol, uTop, uHor, uLawn, uTrees, uHaze, uVisA, uVisB, uTapDir, uBub, uBubH;
  uniform mat3 uTilt;
  uniform float uTime, uGrow, uSnow, uThaw, uKind, uLand, uHop, uCock, uPeer, uVisX, uTap, uSettle, uBok, uWinAz, uWinK, uSeamY, uBandAz;
  uniform vec3 uVisDir;
  varying vec3 vW;
  float h11(float n){ return fract(sin(n * 127.1) * 43758.5453); }
  float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  vec2 h22(vec2 p){ return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
  float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
  float fbm(vec2 p){ return vn(p) * 0.55 + vn(p * 2.1 + 3.7) * 0.3 + vn(p * 4.3 + 9.1) * 0.15; }
  float ell(vec2 p, vec2 c, vec2 r, float blur){ return smoothstep(1.0 + blur, 1.0 - blur, length((p - c) / r)); }
  // soft bokeh discs on a jittered grid (hoarfrost twigs twinkling)
  float bokeh(vec2 p, float sc, float dens){
    vec2 g = p * sc, i = floor(g); float a = 0.0;
    for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
      vec2 c = i + vec2(float(x), float(y)), h = h22(c);
      float on = step(1.0 - dens, h21(c + 7.3)), r = 0.22 + 0.3 * h.x;
      float d = length(g - c - 0.5 - (h - 0.5) * 0.8);
      float tw = 0.45 + 0.55 * sin(uTime * (1.0 + 2.5 * h.y) + h.x * 40.0);
      a += on * smoothstep(r, r * 0.72, d) * (0.35 + 0.65 * tw * tw) * (0.5 + 0.5 * smoothstep(r * 0.5, r * 0.95, d));
    }
    return a;
  }
  // (polish 2) fairy lights and glints about the dusk room, held sharp in the glass: small warm and white points with a
  // four-point sparkle, twinkling. p is the stereographic map of the room direction, so they never smear.
  float stars(vec2 p, float sc, float dens){
    vec2 g = p * sc, i = floor(g), h = h22(i);
    float on = step(1.0 - dens, h21(i + 3.7)), r = 0.035 + 0.05 * h.x;
    vec2 c = fract(g) - 0.5 - (h - 0.5) * 0.62; float d = length(c);
    float tw = 0.5 + 0.5 * sin(uTime * (1.2 + 2.5 * h.y) + h.x * 40.0);
    float cross_ = smoothstep(r * 0.3, 0.0, min(abs(c.x), abs(c.y))) * smoothstep(r * 5.0, 0.0, d) * step(0.55, h.y);
    return on * (smoothstep(r, r * 0.35, d) + 0.22 * smoothstep(r * 3.5, 0.0, d) + 0.8 * cross_) * (0.35 + 0.65 * tw);
  }
  // (polish) the visitor on the outer sill, SHARP: fur or feathers drawn as fine directional strokes, a fringed outline,
  // a glossy eye that holds the window (the squirrel's is plain, with one catchlight), whiskers or a hard beak. p is in its own
  // space, feet at 0, about 1.3 tall.
  float seg(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-5), 0.0, 1.0); return length(pa - ba * h); }
  // (polish 4) the squirrel's ear about its own middle e: a leaf 0.066 half as wide, round below and drawn to a point 0.115 above;
  // and the tuft at its tip: a wisp leaning back, with a hair either side, that ends 0.15 above the middle
  float earLeaf(vec2 e){
    float w = e.y < 0.0 ? sqrt(max(1.0 - e.y * e.y / 0.0169, 0.0)) : pow(max(1.0 - e.y / 0.115, 0.0), 0.75);
    return smoothstep(0.007, -0.007, abs(e.x) - 0.066 * w) * step(-0.13, e.y) * step(e.y, 0.115);
  }
  float earTuft(vec2 e){
    float ty = clamp((e.y - 0.08) / 0.07, 0.0, 1.0);
    float wisp = smoothstep(0.004, -0.004, abs(e.x + 0.018 * ty * ty) - 0.016 * (1.0 - ty)) * step(0.08, e.y) * step(e.y, 0.15);
    float d = min(seg(e, vec2(-0.004, 0.1), vec2(-0.028, 0.138)), seg(e, vec2(0.004, 0.1), vec2(0.012, 0.142)));
    return max(wisp, smoothstep(0.005, 0.0015, d));
  }
  vec4 critter(vec2 p, vec3 backC, vec3 frontC, float kind, float cock, float peer, vec2 sdir){
    float sq = step(1.5, kind), b = 0.03;
    float fz = vn(p * vec2(64.0, 40.0) + 3.0) - 0.5, fz2 = vn(p * vec2(40.0, 64.0) + 9.0) - 0.5;
    vec2 pf = p + vec2(fz, fz2) * (0.014 + 0.02 * sq);                                   // the fringe of the coat
    vec2 hd = vec2(0.1, 0.84) + vec2(sin(cock), cos(cock) - 1.0) * 0.16 + vec2(-0.03, -0.035) * peer;
    float breath = sin(uTime * 2.2), bp = fract(uTime * 0.27 + 0.2 * kind), blink = smoothstep(0.955, 0.975, bp) * smoothstep(1.0, 0.985, bp);
    float body = ell(pf, vec2(0.0, 0.42), vec2(0.34, 0.4) * (1.0 + 0.03 * breath), b), head = ell(pf, hd, vec2(0.2 + 0.035 * peer + 0.035 * sq, 0.2 + 0.035 * peer + 0.015 * sq), b);
    float sway = 0.035 * sin(uTime * 1.3) * sq, tail, tailTop = 0.0;
    if (sq > 0.5) {
      // (polish 3) as the squirrel sits, the plume curls over at the line of the ears' tops (it stood 0.2 of the creature's own
      // measure above them), so its ears and its plume top out together
      tailTop = max(ell(pf, vec2(-0.43 + sway, 0.9), vec2(0.24, 0.3), b), ell(pf, vec2(-0.3 + 2.0 * sway, 1.08), vec2(0.2, 0.14), b));
      tail = max(ell(pf, vec2(-0.45, 0.5), vec2(0.2, 0.44), b), tailTop);
    } else tail = ell(pf, vec2(-0.4, 0.3 + 0.022 * sin(uTime * 3.1) * sin(uTime * 0.83)), vec2(0.31, 0.075), b);
    float a = max(max(body, head), tail);
    float mot = fbm(p * 9.0 + 3.0 + vec2(0.0, 0.12 * breath));
    // strokes: fine hairs running down and back along the body (curling up the squirrel's tail)
    vec2 fd = mix(vec2(p.x * 1.0 + p.y * 0.35, p.y - p.x * 0.3), vec2(p.x + 0.5 * sin(p.y * 4.0), p.y), sq * step(p.x, -0.26));
    float fur = 0.55 * vn(vec2(fd.x * 95.0, fd.y * 13.0) + 11.0) + 0.45 * vn(vec2(fd.x * 180.0, fd.y * 24.0) + 2.0);
    vec3 c = backC * (0.52 + 0.5 * smoothstep(0.0, 1.0, p.y) + 0.26 * (mot - 0.5) + 0.62 * (fur - 0.5));
    if (sq < 0.5) {                                                                       // the folded wing: rows of scalloped feathers, dark flight feathers
      vec2 wq = (p - vec2(-0.14, 0.43)) / vec2(0.2, 0.29);
      float wing = ell(p, vec2(-0.14, 0.43), vec2(0.2, 0.29), 0.08);
      float sc = abs(sin(wq.x * 7.0 + floor(wq.y * 4.0 + 4.0) * 1.57)) * (0.35 + 0.65 * fract(wq.y * 4.0 + 4.0));
      c = mix(c, backC * (0.3 + 0.42 * sc), wing * 0.92);
      c = mix(c, vec3(0.06, 0.06, 0.08), wing * smoothstep(0.012, 0.0, abs(fract(wq.x * 3.0 - wq.y * 1.2) - 0.5) * 0.33) * step(wq.y, -0.1) * 0.7);
    } else c = mix(c, backC * 1.5 + vec3(0.14, 0.08, 0.02), tail * (0.3 + 0.7 * tailTop) * (0.45 + 0.75 * fur) * step(p.x, -0.2 + 0.2 * tailTop));   // the brush of the tail, lighter and wilder
    c = mix(c, vec3(0.9, 0.88, 0.84) * (0.72 + 0.5 * fur), ell(p, vec2(0.08, 0.2), vec2(0.24, 0.2), 0.14) * 0.85 * body);                    // pale belly
    c = mix(c, frontC * (0.66 + 0.24 * mot + 0.5 * fur), ell(pf, vec2(0.12 - 0.03 * peer, 0.56) + (hd - vec2(0.1, 0.84)) * 0.5, vec2(0.23 + 0.02 * peer, 0.27) * (1.0 + 0.03 * breath), 0.1) * max(body, head)); // the breast, breathing
    if (kind > 0.5 && kind < 1.5) {
      c = mix(c, vec3(0.13, 0.3, 0.72) * (0.7 + 0.6 * fur), ell(pf, hd + vec2(0.0, 0.11), vec2(0.17, 0.085), 0.12) * head);               // blue cap
      c = mix(c, vec3(0.93), ell(pf, hd + vec2(0.04, -0.02), vec2(0.15, 0.07), 0.12) * head * 0.9);                                         // white cheek
      c = mix(c, vec3(0.05, 0.07, 0.16), smoothstep(0.014, 0.004, abs(p.y - hd.y - 0.035 + 0.1 * (p.x - hd.x))) * head * step(hd.x - 0.14, p.x));   // the eye stripe
    }
    if (sq > 0.5) {
      // (polish 4) ears that read as ears: each a leaf standing on the crown, round at its foot and drawn to a point, a tuft
      // of hairs at the tip and a hollow in it; they take a finer fringe than the coat's so that the outline holds. Before the
      // sun-side light below is added the tuft is laid at 0.4 of the back's colour (the leaf's strokes run 0.45 to 0.95 of it)
      // and the rear ear's leaf 0.3 darker than the front one's; that light is then added over leaf and tuft alike. Leaf and
      // tuft together top out where the old ears did (0.15 over the middle)
      vec2 pe = p + vec2(fz, fz2) * 0.01;
      vec2 e1 = pe - hd - vec2(-0.1, 0.22), e2 = pe - hd - vec2(0.07, 0.235);
      float ear1 = earLeaf(e1), ear2 = earLeaf(e2), ears = max(ear1, ear2);
      float tuft = max(earTuft(e1), earTuft(e2));
      a = max(a, max(ears, tuft));
      c = mix(c, backC * (0.45 + 0.5 * fur) * (1.0 - 0.3 * ear1 * (1.0 - ear2)), ears * (1.0 - head));
      c = mix(c, vec3(0.5, 0.26, 0.2), max(ell(e1, vec2(0.004, -0.03), vec2(0.024, 0.07), 0.25), ell(e2, vec2(0.004, -0.03), vec2(0.024, 0.07), 0.25)) * 0.8);
      c = mix(c, backC * 0.4, tuft * (1.0 - ears));
      float paws = max(ell(pf, vec2(0.2, 0.5), vec2(0.07, 0.05), 0.1), ell(pf, vec2(0.11, 0.47), vec2(0.07, 0.05), 0.1));
      c = mix(c, backC * 0.62 * (0.7 + 0.6 * fur), paws); a = max(a, paws);
      c = mix(c, backC * 0.5, smoothstep(0.02, 0.0, abs(length((p - vec2(-0.05, 0.3)) / vec2(0.27, 0.3)) - 1.0)) * step(p.x, 0.05) * step(p.y, 0.5) * 0.6 * body);   // the haunch
    }
    // light from the sun side: a warm rim through the fringe
    vec2 nn = p - vec2(0.02, 0.52); nn /= max(length(nn), 1e-3);
    float edge = a * (1.0 - smoothstep(0.0, 0.07, min(min(1.0 - length((pf - vec2(0.0, 0.42)) / vec2(0.34, 0.4)), 1.0 - length((pf - hd) / 0.2)), 0.2) + 0.2 * (1.0 - max(body, head))));
    c += uSunCol * (0.55 * edge * (0.3 + max(dot(nn, sdir), 0.0)) * (0.5 + fur) + 0.14 * max(dot(nn, sdir), 0.0) * a);
    // the eye: large, wet and black, a pale ring, and the bright window held in it; (polish 4) the squirrel's is smaller and
    // plain: black, the pale ring and one small soft catchlight, no window in it
    vec2 ey = hd + mix(vec2(0.085, 0.035), vec2(0.04, 0.025), peer);
    float er = (0.05 - 0.006 * sq) * (1.0 + (0.5 - 0.25 * sq) * peer), eye = ell(p, ey, vec2(er, er * (1.0 - 0.88 * blink)), 0.07);
    c = mix(c, mix(frontC, vec3(0.9, 0.84, 0.74), 0.6 + 0.3 * sq) * (0.75 + 0.4 * fur), ell(p, ey, vec2(er * 1.3), 0.14) * (0.4 + 0.2 * sq));
    c = mix(c, vec3(0.012, 0.012, 0.02), eye);
    c += vec3(0.05, 0.08, 0.16) * eye * smoothstep(0.2, -0.9, (p.y - ey.y) / er);                                           // sky in the lower half of the cornea
    vec2 hq = (p - ey - vec2(0.3, 0.34) * er) / (er * 0.3);
    c += (vec3(2.6, 2.5, 2.3) + uSunCol) * step(max(abs(hq.x), abs(hq.y) * 0.8), 1.0) * step(0.2, abs(hq.x)) * step(0.16, abs(hq.y)) * eye * (1.0 - blink) * (1.0 - sq);
    c += vec3(0.85, 0.86, 0.9) * sq * ell(p, ey + vec2(0.3, 0.34) * er, vec2(er * 0.22), 0.5) * eye * (1.0 - blink);
    if (sq < 0.5) {                                                                       // a hard little beak, and wire legs
      vec2 bq = p - hd - vec2(0.17 - 0.03 * peer, -0.012 - 0.02 * peer);
      float beak = step(0.0, bq.x) * smoothstep(0.004, -0.004, abs(bq.y) - 0.034 * (1.0 - bq.x / 0.105)) * step(bq.x, 0.105);
      c = mix(c, mix(vec3(0.2, 0.16, 0.13), vec3(0.5, 0.42, 0.3), smoothstep(-0.01, 0.02, bq.y)), beak); a = max(a, beak);
      float legs = (smoothstep(0.016, 0.008, abs(p.x - 0.05 - 0.1 * (0.1 - p.y))) + smoothstep(0.016, 0.008, abs(p.x + 0.1 - 0.1 * (0.1 - p.y)))) * step(p.y, 0.1) * step(0.0, p.y);
      c = mix(c, vec3(0.3, 0.2, 0.16), legs * (1.0 - body)); a = max(a, legs);
    } else {                                                                              // nose and whiskers
      vec2 mz = hd + vec2(0.185 + 0.02 * peer, -0.045);
      c = mix(c, vec3(0.12, 0.07, 0.06), ell(p, mz, vec2(0.022, 0.017), 0.3));
      float wk = 1e3; for (int k = 0; k < 4; k++) { float fk = float(k) - 1.5; wk = min(wk, seg(p, mz + vec2(-0.02, -0.012), mz + vec2(0.17, 0.05 * fk + 0.012 * sin(uTime * 3.0 + fk)) )); wk = min(wk, seg(p, mz + vec2(-0.03, -0.012), mz + vec2(-0.2, -0.03 + 0.045 * fk))); }
      float wl = smoothstep(0.0045, 0.0015, wk);
      c = mix(c, vec3(0.97, 0.95, 0.9), wl); a = max(a, wl * 0.9);
    }
    return vec4(c, a * smoothstep(-0.05, 0.01, p.y));
  }
  float winPatch(vec2 p, vec2 c, vec2 hs, float skew){
    vec2 w = p - c; w.x += skew * w.y;
    float m = smoothstep(hs.x, hs.x * 0.72, abs(w.x)) * smoothstep(hs.y, hs.y * 0.72, abs(w.y));
    return m * (1.0 - 0.8 * max(smoothstep(0.045, 0.015, abs(w.x)), smoothstep(0.04, 0.012, abs(w.y))));
  }
  float paneMask(vec2 q, float soft){ return smoothstep(1.62, 1.62 - soft, abs(q.x)) * smoothstep(-0.34, -0.34 + soft, q.y) * smoothstep(2.25, 2.25 - soft, q.y); }
  vec3 room(vec3 d){
    // ---- the window (+Z): pane coordinates, x right, y up, the outer sill at y = -0.3
    vec2 q = d.xy / max(d.z, 0.06);
    vec3 col = mix(uHor, uTop, smoothstep(-0.05, 0.9, q.y));
    col = mix(col, uTop * vec3(0.4, 0.5, 0.82), smoothstep(0.75, 2.2, q.y));                          // (polish 2) a real sky: deepening overhead,
    col = mix(col, mix(uHor, uSunCol, 0.5) * 1.05, smoothstep(0.55, 0.0, q.y) * 0.5 * (1.0 - 0.6 * uSnow));   // a band of warmth above the garden
    vec2 sq = uSunR.xy / max(uSunR.z, 0.2), sv = q - sq; float sd = length(sv), sa = atan(sv.y, sv.x);
    float veil = 1.0 - 0.7 * uSnow;
    col += uSunCol * (smoothstep(0.1, 0.07, sd) * 5.0 * veil + exp(-sd * 3.2) * 0.75 + exp(-sd * 0.9) * 0.2);
    col += uSunCol * pow(abs(cos(sa * 3.0 + 0.3)), 60.0) * exp(-sd * 1.6) * 1.3 * veil;              // six-point glass flare
    // far trees as soft masses and bokeh, the lawn below
    float tl = 0.34 + 0.2 * fbm(vec2(q.x * 1.7 + 4.0, 1.0)) + 0.1 * vn(vec2(q.x * 5.0, 3.0));
    // (polish 2) the frosted garden is drawn, not smeared: a pale far wood, then a rank of firs in sharp silhouette
    col = mix(col, mix(uTrees, col, 0.5), smoothstep(tl + 0.12, tl + 0.04, q.y) * 0.85);
    float fxx = q.x * 5.0 + 0.6 * vn(vec2(q.x * 1.3, 2.0)), fir = max(1.0 - 3.3 * abs(fract(fxx) - 0.5), 0.0) * (0.07 + 0.15 * h11(floor(fxx)));
    float fx2 = q.x * 8.3 + 3.1, fir2 = max(1.0 - 3.0 * abs(fract(fx2) - 0.5), 0.0) * (0.04 + 0.09 * h11(floor(fx2) + 9.0));
    float trees = smoothstep(tl - 0.15 + max(fir, fir2) + 0.012, tl - 0.15 + max(fir, fir2) - 0.012, q.y);
    col = mix(col, uTrees * (0.34 + 0.2 * vn(q * 3.0) + 0.3 * smoothstep(tl - 0.3, tl, q.y)) + vec3(0.9, 0.95, 1.0) * 0.5 * smoothstep(0.55, 0.8, vn(q * vec2(9.0, 22.0))) * smoothstep(tl - 0.25, tl, q.y), trees * 0.94);   // (polish) dark blue trees rimed white, sharp against the dawn
    float bk = bokeh(q + vec2(0.0, 0.02 * sin(uTime * 0.3)), 9.0, 0.5) * smoothstep(tl + 0.22, tl - 0.05, q.y) * smoothstep(-0.02, 0.1, q.y) + bokeh(q * 1.7 + 5.0, 11.0, 0.4) * trees * smoothstep(0.0, 0.12, q.y);
    col += mix(vec3(1.0), uSunCol, 0.4) * bk * (0.2 + 0.7 * exp(-sd * 1.2)) * uBok * 0.42;
    float lawn = smoothstep(0.06, -0.06, q.y - 0.05 * vn(vec2(q.x * 2.0, 7.0)));
    col = mix(col, uLawn * (0.8 + 0.14 * vn(q * vec2(3.0, 14.0))) + uSunCol * 0.1, lawn);
    // snow falling outside, at two scales (overcast look)
    if (uSnow > 0.01) for (int k = 0; k < 2; k++) {
      float sc = k == 0 ? 3.5 : 9.0; vec2 g = q * sc + vec2(0.6 * sin(uTime * 0.2 + q.y * 2.0), uTime * (k == 0 ? 0.55 : 0.9));
      vec2 i = floor(g), h = h22(i + float(k) * 31.0); float r = 0.1 + 0.16 * h.x;
      col += vec3(0.9, 0.93, 1.0) * uSnow * smoothstep(r, r * 0.5, length(fract(g) - 0.25 - h * 0.5)) * (k == 0 ? 0.5 : 0.3);
    }
    // the visitor on the outer sill
    float hop1 = clamp(uHop, 0.0, 1.0), hop2 = clamp(uHop - 1.0, 0.0, 1.0);
    vec2 base = vec2(uVisX - 0.14 * (hop1 + hop2) * (1.0 - uKind * 0.3) + 1.4 * (1.0 - uLand) * (1.0 - uLand), -0.13 + 2.4 * (1.0 - uLand) + 0.1 * (sin(hop1 * 3.1416) + sin(hop2 * 3.1416)) + 0.004 * sin(uTime * 2.3) * uLand);
    float flut = (1.0 - uLand) * sin(uTime * 22.0);
    float vs = (0.8 + 0.1 * uPeer) * (1.0 - 0.15 * step(1.5, uKind));   // (polish) enormous: the robin and the squirrel stand two thirds to three quarters as tall as the window's lower row of panes, their tops well under the rail; (polish 3) the squirrel, taller than the robin by its ears, is drawn so that, as it sits, its ears' tops stand where the robin's crown stands
    vec4 cr; vec2 sdir = sq - base - vec2(0.0, 0.3); sdir /= max(length(sdir), 1e-3);
    if (uKind > 0.5 && uKind < 1.5) {
      cr = critter((q - base) / vec2(0.56 + 0.08 * flut, 0.56), uVisA, uVisB, 1.0, uCock, uPeer, sdir);
      vec4 c2 = critter((q - base - vec2(-0.72 - 0.5 * (1.0 - uLand), 0.12 * abs(sin(uTime * 0.9)) * step(0.99, uLand))) / vec2(-0.5, 0.5), uVisA, uVisB, 1.0, -uCock * 0.7, 0.0, sdir * vec2(-1.0, 1.0));
      cr = mix(c2, cr, cr.a);  cr.a = max(cr.a, c2.a);
    } else cr = critter((q - base) / vec2(vs * (1.0 + 0.18 * flut), vs), uVisA, uVisB, uKind, uCock, uPeer, sdir);
    cr.rgb *= 0.78 + 0.3 * smoothstep(-0.3, 1.2, q.y);
    col = mix(col, cr.rgb, cr.a * 0.98);
    {   // its breath fogging the pane in front of its nose, coming and going
      vec2 mzp = base + vec2(0.34, 0.8) * vs;
      float fg = smoothstep(1.0, 0.1, length((q - mzp) / (vec2(0.46, 0.32) * vs))) * uLand * (0.5 + 0.5 * sin(uTime * 2.2 - 1.0));
      col = mix(col, vec3(0.84, 0.9, 0.98) * (0.82 + 0.3 * fbm(q * 16.0)), fg * 0.5 * (0.55 + 0.45 * fbm(q * 34.0 + uTime * 0.15)));
    }
    // outer sill with a lip of snow, icicles and drips in the thaw
    col = mix(col, vec3(0.9, 0.93, 0.98) * (0.86 + 0.14 * vn(vec2(q.x * 6.0, 1.0))), smoothstep(-0.06, -0.12, q.y + 0.03 * vn(vec2(q.x * 4.0, 2.0))));
    if (uThaw > 0.01) {
      float cx = floor(q.x * 9.0), hx = h11(cx), fx = fract(q.x * 9.0) - 0.5, len = 0.12 + 0.3 * hx;
      float ic = smoothstep(0.02, -0.02, abs(fx) - 0.3 * clamp((q.y - (2.25 - len)) / len, 0.0, 1.0)) * step(2.25 - len, q.y);
      col = mix(col, vec3(0.92, 0.97, 1.0) + uSunCol * 0.6 * smoothstep(0.1, 0.0, abs(fx + 0.08)), ic * 0.8 * uThaw);
      float ph = fract(uTime * (0.25 + 0.3 * hx) + hx * 7.0), dy = 2.25 - len - ph * ph * 2.4;
      col += (vec3(1.2) + uSunCol) * uThaw * smoothstep(0.05, 0.0, length(vec2(fx * 0.111, (q.y - dy) * 0.6))) * step(0.3, hx);
    }
    // frost ferns growing in from the pane edges and the glazing bars
    float barV = abs(abs(q.x) - 0.98), barH = abs(q.y - 1.16), frameE = min(1.62 - abs(q.x), 2.25 - q.y);
    float e = min(min(frameE - 0.1, q.y + 0.34), min(barV, barH) + 0.2);
    vec2 fq = q * 5.0; float fern = abs(sin(fq.x * 3.0 + 2.5 * vn(fq * 1.3))) * abs(sin(fq.y * 3.0 + 2.5 * vn(fq * 1.3 + 5.0)));
    fern = 0.62 * fbm(fq * 2.3) + 0.2 * vn(fq * 7.0) + 0.18 * pow(fern, 0.5);        // (polish 2) an irregular crystalline fringe, not a row of lobes
    float frost = smoothstep(0.0, 0.16, uGrow * (0.12 + 0.42 * fern) * (1.0 - 0.6 * uThaw) + 0.05 - e);
    col = mix(col, vec3(0.9, 0.94, 1.0) * (0.75 + 0.35 * fern) + uSunCol * 0.9 * pow(fern, 6.0) * (0.5 + 0.5 * sin(uTime * 2.0 + fq.x * 9.0)), frost * 0.74);
    // glazing bars and the frame, painted cream, a blue shadow on one side
    float bars = max(max(smoothstep(0.07, 0.045, barV), smoothstep(0.06, 0.036, barH)), smoothstep(0.17, 0.12, frameE));
    vec3 wood = mix(vec3(0.5, 0.4, 0.34), uTop, 0.25) * (0.34 + 0.16 * smoothstep(-0.5, 2.2, q.y));      // (polish) the frame is darker than the dawn behind it, its sunny edges warm
    // (polish 3) each member of the frame has its own sunny face and its own blue shadow edge, on the side away from the sun's
    // place in the pane (sq): upright members across their width, the rail and the head across their height
    // which member paints a point: the stronger of the masks that draw them; a side runs through its corners, a glazing bar
    // stops under the head and against nothing else, the rail stops against the sides (1 on an upright, 0 on the rail or the head)
    float fS = smoothstep(0.17, 0.12, 1.62 - abs(q.x)), fH = smoothstep(0.17, 0.12, 2.25 - q.y);
    float up_ = step(max(fH, smoothstep(0.06, 0.036, barH) * (1.0 - fS)), max(fS, smoothstep(0.07, 0.045, barV) * (1.0 - fH)));
    float lit = mix((q.y - (q.y > 1.7 ? 2.165 : 1.16)) * sign(sq.y - q.y), (abs(q.x) - (abs(q.x) > 1.3 ? 1.535 : 0.98)) * sign(q.x) * sign(sq.x - q.x), up_);
    col = mix(col, wood * mix(vec3(0.6, 0.72, 1.0), vec3(1.3, 1.08, 0.8), smoothstep(-0.045, 0.015, lit)), bars * 0.96);
    float pane = paneMask(q, 0.05) * smoothstep(0.02, 0.14, d.z);
    // ---- the room: wall, cream curtain folds, one out-of-focus pot plant, pale ceiling
    float az = atan(d.x, -d.z + 1e-5);
    float fold = sin(az * 30.0 + 1.6 * sin(d.y * 2.3 + az * 3.0)) * 0.5 + 0.5;
    float fold2 = sin(az * 14.0 + 0.9 * sin(d.y * 3.1 - az * 2.0) + 2.0);                              // broad curtain folds, out of focus
    // (polish) the room is a deep blue dusk-coloured wall, not a pale veil: the back wall carries the window's own warm
    // band of low sun with the glazing bars' shadow in it, and a dado rail and skirting give it scale
    vec3 deepW = uTop * 0.3 + vec3(0.02, 0.045, 0.13);
    vec3 rm = deepW * (0.7 + 0.5 * smoothstep(-0.25, 0.9, d.y)) * (0.9 + 0.16 * vn(vec2(az * 3.0, d.y * 5.0)) + 0.05 * fold2);
    rm = mix(rm, deepW * 1.5 + vec3(0.03, 0.03, 0.02), smoothstep(0.012, 0.004, abs(d.y - 0.05)) + 0.5 * smoothstep(0.03, 0.0, abs(d.y + 0.03)));
    {
      vec2 bq = vec2(az - uBandAz, d.y - 0.36 + 0.5 * (az - uBandAz) * 0.3);
      float band = smoothstep(0.62, 0.5, abs(bq.x)) * smoothstep(0.34, 0.26, abs(bq.y));
      float bbar = smoothstep(0.02, 0.05, abs(bq.x)) * smoothstep(0.015, 0.04, abs(abs(bq.y) - 0.115));
      rm += mix(uSunCol, vec3(1.0, 0.6, 0.25), 0.55) * band * (0.25 + 0.75 * bbar) * (0.06 + 0.02 * fold) * (1.0 - 0.6 * uSnow);
    }
    vec3 wall = (deepW * 1.25) * (0.7 + 0.45 * smoothstep(-0.2, 0.8, d.y)) * (0.92 + 0.12 * vn(vec2(az * 2.0, d.y * 3.0) + 4.0));
    {   // cream curtains drawn back either side of the window, lit warm from behind, in soft folds
      float cx = abs(q.x) - 1.62;
      // (polish 3) each curtain is drawn back a third of the way up its drop: its inner edge sweeps out from the frame, and
      // the folds are measured across the cloth's own width, so they fan into the gather
      float sw = (1.0 - sqrt(smoothstep(0.62, 2.3, q.y))) * (1.0 - 0.2 * smoothstep(0.62, -0.3, q.y));
      float cin = 0.02 + 0.5 * sw, cout = 1.25 + 0.12 * sin(q.y * 2.0) - 0.12 * sw;
      float cs = clamp((cx - cin) / (cout - cin), 0.0, 1.0), cf = sin(cs * 16.25) * 0.5 + 0.5;
      float cm = smoothstep(0.0, 0.14, cx - cin) * smoothstep(cout, cout - 0.2, cx) * step(0.05, d.z) * smoothstep(-0.5, -0.3, q.y) * smoothstep(2.75, 2.5, q.y);   // (they hang from a rail just above the frame)
      vec3 curt = deepW * (1.05 + 0.75 * cf) + vec3(1.0, 0.55, 0.22) * 0.1 * cf * cf * smoothstep(0.6, 0.0, cx - cin);   // (polish 2) deep blue velvet, gilded by the window only along its near folds
      wall = mix(wall, curt, cm * 0.95);
    }
    vec2 pf = vec2(abs(az) - 2.25, d.y - 0.32);                                                        // a framed picture on each side wall, out of focus
    float pic = smoothstep(0.2, 0.15, abs(pf.x)) * smoothstep(0.15, 0.1, abs(pf.y)), pin = smoothstep(0.16, 0.12, abs(pf.x)) * smoothstep(0.11, 0.07, abs(pf.y));
    wall = mix(wall, mix(vec3(0.86, 0.6, 0.3) * 0.5, deepW * 1.6, pin), pic * 0.5);                      // (polish 2) a dim gilt frame, no pale pane
    rm = mix(rm, wall, smoothstep(0.35, 0.7, abs(az) / 3.1416));                                         // plain wall beside the window
    vec2 pp = vec2(az + 0.75, d.y) / 1.15;
    // (polish 2) not a blurred pot plant: the room's own little fir in its pot, tiered, hung with lights and a star
    float ty = clamp(pp.y / 0.85, 0.0, 1.0), tier = fract(-ty * 5.0);
    float leaves = smoothstep(0.015, -0.015, abs(pp.x) - 0.33 * (1.0 - ty) * (0.7 + 0.3 * tier)) * smoothstep(0.0, 0.03, pp.y) * step(pp.y, 0.85);
    rm = mix(rm, vec3(0.05, 0.21, 0.15) * (0.6 + 0.5 * vn(pp * 11.0)) * (0.55 + 0.75 * tier) + uSunCol * 0.03, leaves * 0.95);
    rm += mix(vec3(1.0, 0.68, 0.32), vec3(0.8, 0.9, 1.0), step(0.6, h21(floor(pp * 21.0) + 5.1))) * stars(pp, 21.0, 0.75) * leaves * 2.4;
    { vec2 tq = pp - vec2(0.0, 0.89); float td = length(tq); rm += vec3(1.0, 0.78, 0.4) * (smoothstep(0.03, 0.01, td) * 2.5 + smoothstep(0.012, 0.0, min(abs(tq.x), abs(tq.y))) * smoothstep(0.1, 0.0, td) * 1.6 + 0.3 * exp(-td * td * 220.0)); }
    rm = mix(rm, vec3(0.8, 0.84, 0.92) * (0.8 + 0.3 * smoothstep(-0.15, 0.15, pp.x)), ell(pp, vec2(0.0, 0.02), vec2(0.16, 0.13), 0.2));   // its pot
    // out-of-focus glints about the room (glass, brass, a mirror): big soft discs, slowly breathing
    rm += mix(vec3(1.0, 0.95, 0.86), uSunCol, 0.4) * bokeh(vec2(az * 0.8, d.y * 1.15) + 3.0, 3.2, 0.42) * 0.04 * smoothstep(-0.05, 0.2, d.y) * smoothstep(-0.2, 0.35, -d.z);
    // the ceiling: pale plaster in blue skylight, a cornice, two window-shaped patches of bounced sun
    vec2 cp = d.xz / max(d.y, 0.05);
    vec2 ee = abs(cp - vec2(0.0, -0.92)) / vec2(1.95, 1.38);                                            // seen through the ball the ceiling's edge is a soft oval, never a straight line
    float ce = (1.0 - pow(pow(ee.x, 2.4) + pow(ee.y, 2.4), 0.4167)) * 1.38;
    vec3 ceil_ = mix(vec3(0.46, 0.47, 0.52), vec3(0.6, 0.54, 0.46), smoothstep(2.2, 0.1, length(cp - vec2(0.0, -0.3))));
    ceil_ = mix(ceil_, ceil_ * (0.55 + uHor * 0.6), 0.5);
    ceil_ = mix(ceil_ * 0.3, deepW * 0.95, 0.88) * (0.9 + 0.3 * smoothstep(2.4, 0.0, length(cp - vec2(0.0, -0.3)))) * (0.94 + 0.1 * vn(cp * 5.0));   // (polish) a deep blue ceiling: the window's light lies on it in warm patches
    float wl = winPatch(cp, vec2(-0.74, -0.66), vec2(0.42, 0.3), 0.35) + winPatch(cp, vec2(0.7, -0.24), vec2(0.36, 0.27), -0.32);
    ceil_ += mix(uSunCol, vec3(1.0, 0.55, 0.22), 0.75) * wl * (0.05 + 0.08 * sin(uTime * 0.9 + cp.x * 5.0) + 0.08 * sin(uTime * 1.4 - cp.y * 7.0)) * (1.0 - 0.45 * uSnow);
    ceil_ *= 1.0 - 0.13 * smoothstep(0.42, 0.0, ce);                                                     // a soft shadow where the ceiling meets the walls
    rm *= 1.0 - 0.12 * smoothstep(-0.6, 0.05, ce) * smoothstep(0.0, 0.12, d.y);
    rm = mix(rm, ceil_, smoothstep(-0.1, 0.14, ce) * smoothstep(0.04, 0.14, d.y));
    {
      vec2 stp = d.xz / (1.0 + max(d.y, -0.6));
      float st = stars(stp, 13.0, 0.55) + 0.7 * stars(stp + 7.3, 27.0, 0.4);
      rm += mix(vec3(1.0, 0.72, 0.38), vec3(0.8, 0.9, 1.0), step(0.6, h21(floor(stp * 13.0) + 1.3))) * st * 1.5 * smoothstep(-0.02, 0.1, d.y);
    }
    col = mix(rm, col, pane);
    // ---- the white sill, stretching away like a salt flat, with the globe's caustic splash on it
    vec2 sp = d.xz / max(-d.y, 0.03);
    vec3 sill = vec3(0.9, 0.9, 0.88) * (0.82 + 0.1 * vn(sp * 0.7)) * mix(vec3(0.34, 0.46, 0.8), vec3(0.8, 0.84, 0.95), smoothstep(-0.5, 2.5, sp.y));
    float barSh = smoothstep(0.3, 0.12, abs(sp.x + sp.y * uSunR.x / max(uSunR.z, 0.3) * 0.4)) * smoothstep(-1.0, 3.0, sp.y);
    sill *= 1.0 - 0.2 * barSh;
    vec2 cc = sp + uSunR.xz * 1.6; float cr2 = length(cc);
    float net = pow(1.0 - abs(sin(cc.x * 5.0 + sin(cc.y * 4.0 + uTime * 1.3) * 1.2)) * abs(sin(cc.y * 5.0 + sin(cc.x * 4.0 - uTime * 1.1) * 1.2)), 6.0);
    sill += uSunCol * (exp(-cr2 * cr2 * 0.55) * (0.5 + 2.2 * net) + smoothstep(0.25, 0.0, abs(cr2 - 1.75 - 0.05 * sin(uTime * 2.0))) * 0.5) * (1.0 - 0.6 * uSnow);
    col = mix(col, sill, smoothstep(-0.07, -0.16, d.y));
    return col;
  }
  // the window as the inside of the ball holds it: a bowed patch of 2 x 3 panes on the glass, centred at (azimuth, elevation)
  float winRefl(vec3 n, vec2 c, vec2 hs, float bow){
    float az = atan(n.x, n.z + 1e-5), el = asin(clamp(n.y, -1.0, 1.0));
    float da = az - c.x; da -= 6.2832 * floor(da / 6.2832 + 0.5);
    vec2 p = vec2(da * cos(c.y), el - c.y);
    p.x += bow * p.y * p.y - 0.25 * bow * p.y; p.y += 0.9 * p.x * p.x;
    vec2 q = p / hs;
    float m = smoothstep(1.0, 0.9, abs(q.x)) * smoothstep(1.0, 0.92, abs(q.y));
    float bars = smoothstep(0.06, 0.13, abs(q.x)) * smoothstep(0.05, 0.11, abs(abs(q.y) - 0.34));
    return m * (0.08 + 0.92 * bars) * (0.55 + 0.45 * q.y);
  }
  void main(){
    vec3 nrm = normalize(vW - uC), V = normalize(vW - cameraPosition);
    float ndv = max(dot(V, nrm), 0.0), dist = length(vW - cameraPosition);
    // thick hand-blown glass: the room is bent toward the normal where the ball curves away, and swims a little
    // behind slow ripples that belong to the glass, not to the room
    vec3 wob = vec3(vn(nrm.yz * 4.0 + 1.7), vn(nrm.zx * 4.0 + 4.1), vn(nrm.xy * 4.0 + 8.3)) - 0.5;
    wob += 0.4 * (vec3(vn(nrm.yz * 11.0 + 5.2), vn(nrm.zx * 11.0 + 9.4), vn(nrm.xy * 11.0 + 2.6)) - 0.5);
    vec3 d = normalize(uTilt * normalize(mix(V, refract(V, -nrm, 0.75), 0.6) + wob * 0.022));
    vec3 col = room(d);
    float hb = nrm.y * 80.0 + uC.y;                      // height on the glass
    // the liquid and the thick foot of the glass: a deeper blue low down when it is seen from across the globe,
    // so the white village stands in front of something
    vec3 deepG = mix(uTop, vec3(0.16, 0.3, 0.66), 0.55);
    col = mix(col, (col * vec3(0.52, 0.62, 1.0) * 0.8 + deepG * 0.3) * (0.85 + 0.25 * vn(nrm.xz * 7.0 + hb * 0.05)), smoothstep(42.0, 9.0, hb) * smoothstep(45.0, 105.0, dist) * 0.7);
    // window-shaped highlights lying on the inside of the glass: they slide as the globe is set down, then drift
    vec3 nT = uTilt * nrm;
    float dr = 0.05 * sin(uTime * 0.11), sl = uSettle;
    float hl = winRefl(nT, vec2(uWinAz + 0.95 * sl + dr, 0.62 - 0.22 * sl), vec2(0.125, 0.155), 0.9)
             + 0.8 * winRefl(nT, vec2(uWinAz - 0.95 - 0.7 * sl - dr, 1.02 - 0.15 * sl), vec2(0.13, 0.105), -1.1)
             + 0.42 * winRefl(nT, vec2(uWinAz + 3.1416 + 1.15 - 0.8 * sl + dr, 0.56 + 0.1 * sl), vec2(0.105, 0.135), -0.9);
    col = mix(col, vec3(1.0, 0.7, 0.36) * 1.15 + uSunCol * 0.3, clamp(hl * uWinK * 1.15, 0.0, 0.92));          // (polish 2) the lit window held small, warm and paned in the curve of the glass
    // the glass curving away: a sheen, a Fresnel veil and a spectral fringe, red outside, blue inside
    float rim = 1.0 - ndv;
    col += uTop * rim * rim * rim * 0.3;
    col = mix(col, mix(uTop, uHor, 0.35) * 0.9, smoothstep(0.6, 1.0, rim) * 0.4);
    col += vec3(0.15, 0.4, 1.0) * smoothstep(0.2, 0.5, rim) * smoothstep(0.8, 0.5, rim) * 0.5 + vec3(1.0, 0.3, 0.12) * smoothstep(0.52, 0.8, rim) * smoothstep(1.0, 0.84, rim) * 0.4;
    // the bright seam where the ball meets its base: a thin prismatic line all the way round, behind the pine rim
    float seam = (hb - uSeamY) + 0.5 * sin(atan(nrm.x, nrm.z + 1e-5) * 3.0);
    float glint = 0.55 + 0.45 * vn(nrm.xz * 38.0 + uTime * 0.6);
    col += (vec3(0.2, 0.45, 1.0) * smoothstep(2.6, 1.0, abs(seam - 1.5)) + vec3(1.0, 0.36, 0.14) * smoothstep(2.6, 1.0, abs(seam + 1.5)) + vec3(1.0, 0.97, 0.9) * 1.5 * smoothstep(0.7, 0.0, abs(seam))) * 0.5 * glint;
    // small bubbles stuck to the glass, crowding toward the big one, and the caustic halo it throws
    float ab = acos(clamp(dot(nrm, uBub), -1.0, 1.0));
    vec3 bt = normalize(cross(uBub, vec3(1.0, 0.0, 0.0))), bs = cross(bt, uBub);
    vec2 g = vec2(dot(nrm, bt), dot(nrm, bs)) * 80.0 / 3.4, gi = floor(g), gh = h22(gi), gc = fract(g) - 0.5 - (gh - 0.5) * 0.5;
    float br = (0.1 + 0.3 * gh.x * gh.x) * (1.0 + 0.08 * sin(uTime * 2.0 + gh.y * 40.0)), bd = length(gc);
    float on = step(h21(gi + 3.1), 0.65 * exp(-ab * 6.5) + 0.012) * step(0.6, dot(nrm, uBub));
    col = mix(col, col * 0.78 + vec3(0.1, 0.12, 0.17), on * smoothstep(br, br * 0.85, bd) * 0.7);
    col += (uSunCol * 0.8 + 0.3) * on * (smoothstep(0.05, 0.0, abs(bd - br * 0.9)) * 0.45 + smoothstep(br * 0.3, 0.0, length(gc - vec2(0.3, 0.35) * br)) * 1.4);
    ab = acos(clamp(dot(nrm, uBubH), -1.0, 1.0));                // the halo follows the lens as it is seen, 6 m below the glass
    float ba = atan(dot(nrm, bs), dot(nrm, bt) + 1e-5), wv = 0.0035 * sin(ba * 9.0 + uTime * 1.6) + 0.0025 * sin(ba * 5.0 - uTime * 2.3);   // (polish 2) clean halo rings, barely breathing
    float rings = 0.4 * smoothstep(0.016, 0.0, abs(ab - 0.2 - wv - 0.012 * sin(uTime * 1.7))) + 0.3 * smoothstep(0.016, 0.0, abs(ab - 0.31 + wv - 0.015 * sin(uTime * 1.3 + 2.0)))
                + 0.22 * smoothstep(0.018, 0.0, abs(ab - 0.44 - wv * 1.4 - 0.016 * sin(uTime * 1.1 + 4.0))) + 0.15 * smoothstep(0.02, 0.0, abs(ab - 0.59 + wv * 1.6 - 0.018 * sin(uTime * 0.9 + 1.0)));
    col += mix(uSunCol, vec3(0.85, 0.92, 1.0), 0.55) * (0.4 * exp(-ab * 5.0) + rings * 0.8 * (0.75 + 0.25 * sin(ba * 23.0 + uTime * 0.7)) + 0.2 * smoothstep(0.03, 0.0, abs(ab - 0.128)));
    {   // (polish) round the visitor the ball itself shows: a faint ring of frost on the glass and one curved window-light highlight
      float va = acos(clamp(dot(nrm, uVisDir), -1.0, 1.0));
      vec3 vt = normalize(cross(uVisDir, vec3(0.0, 1.0, 0.0))), vu = cross(vt, uVisDir);
      float vang = atan(dot(nrm, vu), dot(nrm, vt) + 1e-5), fr = fbm(vec2(vang * 7.0, va * 34.0));
      col = mix(col, vec3(0.88, 0.93, 1.0), smoothstep(0.07, 0.0, abs(va - 0.66 - 0.05 * fr)) * (0.2 + 0.8 * fr * fr) * 0.5 * uLand);
      col += (uSunCol * 0.7 + 0.45) * smoothstep(0.016, 0.0, abs(va - 0.5 - 0.01 * sin(vang * 2.0))) * smoothstep(0.35, 0.95, sin(vang - 2.4)) * 0.8 * uLand;
    }
    // rare: the pressure ring where the beak struck
    float ta = acos(clamp(dot(nrm, uTapDir), -1.0, 1.0));
    col += vec3(1.3, 1.5, 1.8) * smoothstep(0.07, 0.0, abs(ta - uTap * 2.6)) * smoothstep(1.0, 0.25, uTap) * step(0.001, uTap);
    // the milk-blue liquid between here and the glass
    col = mix(col, uHaze, (1.0 - exp(-dist * dist * 0.000022)) * 0.1 * (0.7 + 0.3 * smoothstep(20.0, 52.0, hb)));
    gl_FragColor = vec4(col, 1.0);
  }`,zo=`
  attribute vec3 aCol; attribute vec4 aFx; attribute vec2 aTree;
  uniform float uTime, uS;
  varying vec3 vCol, vN, vW; varying vec2 vUv, vYW; varying float vMat; varying vec4 vBr;
  #include <fog_pars_vertex>
  void main(){
    mat4 im = modelMatrix * instanceMatrix;
    vec3 root = im[3].xyz;
    vec4 w = im * vec4(position, 1.0);
    vec3 n = normalize(mat3(im) * normal);
    vec2 tang = normalize(vec2(root.z, -root.x) + 1e-4);
    float hgt = w.y - root.y;
    float sway = sin(uTime * (1.5 + aTree.x) + aTree.x * 40.0);
    float lean = 0.5 * uS * aTree.y + (0.035 + 0.3 * uS * (1.0 - uS)) * sway;
    float b = lean * hgt * (0.55 + 0.05 * hgt);
    w.xz += tang * b; w.y -= abs(b) * abs(lean) * 0.45;
    w.xz += vec2(-tang.y, tang.x) * 0.02 * hgt * sin(uTime * 1.1 + aTree.x * 17.0);
    n = normalize(n - vec3(tang.x, 0.0, tang.y) * lean * n.y * 0.6);
    vW = w.xyz; vN = n; vCol = aCol; vUv = uv; vMat = aFx.x; vBr = vec4(position.xz, aFx.yz);
    vec4 mvPosition = viewMatrix * w;
    gl_Position = projectionMatrix * mvPosition; vYW = gl_Position.yw;
    #include <fog_vertex>
  }`,Co=`
  attribute vec3 aBase, aSeed;
  uniform float uTime, uS;
  varying vec2 vQ; varying float vSp;
  #include <fog_pars_vertex>
  void main(){
    vec2 tang = normalize(vec2(aBase.z, -aBase.x) + 1e-4);
    float gust = smoothstep(0.2, 1.0, 0.5 + 0.5 * sin(uTime * 0.9 - aSeed.z * 2.5 + aSeed.x * 0.8 + atan(aBase.x, aBase.z + 1e-4) * 3.0));
    float lift = min((0.1 + 1.7 * uS) * gust * (0.3 + aSeed.y), 1.5);
    vec3 c = aBase + vec3(tang.x, 0.0, tang.y) * lift * (2.0 + 6.0 * aSeed.y) + vec3(0.0, 0.07 + lift * (0.6 + 3.4 * aSeed.y), 0.0);
    c += 0.3 * lift * vec3(sin(uTime * 3.0 + aSeed.x * 40.0), sin(uTime * 2.3 + aSeed.y * 40.0), cos(uTime * 2.7 + aSeed.z * 40.0));
    vec4 mv = viewMatrix * modelMatrix * vec4(c, 1.0);
    float dist = length(mv.xyz);
    float rot = aSeed.x * 6.2832 + lift * uTime * 3.0, cr = cos(rot), sr = sin(rot);
    mv.xy += vec2(position.x * cr - position.y * sr, position.x * sr + position.y * cr) * max(0.1 + 0.09 * aSeed.y, dist * 0.0017) * smoothstep(1.5, 8.0, dist);
    vSp = pow(abs(sin(uTime * (1.2 + 2.6 * aSeed.x) * (0.4 + lift) + aSeed.z * 50.0)), 22.0);
    vQ = position.xy;
    vec4 mvPosition = mv;
    gl_Position = projectionMatrix * mv;
    #include <fog_vertex>
  }`,Ao=`
  uniform vec3 uSunCol, uSkyCol;
  varying vec2 vQ; varying float vSp;
  #include <fog_pars_fragment>
  void main(){
    if (sqrt(abs(vQ.x)) + sqrt(abs(vQ.y)) > 1.0) discard;                                // a four-point star
    vec3 col = vec3(0.9, 0.93, 1.0) * (uSkyCol * 0.62 + uSunCol * 0.42) + mix(uSunCol, vec3(1.0), 0.4) * vSp * 5.0;
    gl_FragColor = vec4(col, 1.0);
    #include <fog_fragment>
  }`,Po=`
  attribute vec4 aP; attribute vec3 aK, aN;
  uniform float uTime;
  varying vec2 vQ; varying float vI;
  void main(){
    vec4 mv;
    if (aK.x < 0.5) { mv = viewMatrix * vec4(aP.xyz, 1.0); mv.xy += position.xy * aP.w; }
    else {
      vec3 n = normalize(aN + vec3(0.0, 1e-4, 0.0)), t = normalize(cross(n, vec3(0.0, 0.0, 1.0)) + vec3(1e-5, 0.0, 0.0)), b = cross(t, n);
      mv = viewMatrix * vec4(aP.xyz + (t * position.x + b * position.y) * aP.w, 1.0);
    }
    vQ = position.xy; vI = aK.y * (0.88 + 0.12 * sin(uTime * (1.7 + 2.0 * aK.z) + aK.z * 40.0));
    gl_Position = projectionMatrix * mv;
  }`,Go=`
  uniform vec3 uCol; varying vec2 vQ; varying float vI;
  void main(){
    float d = length(vQ), a = exp(-d * d * 4.5) * smoothstep(1.0, 0.7, d);
    gl_FragColor = vec4(uCol * (a * vI) + vec3(1.0, 0.85, 0.6) * (a * a * a * vI * 0.6), 1.0);
  }`;function Vo(m,A,J,ke){const Q=m/2+ke,xe=A/2+ke,_e=new t.BufferGeometry,K0=[-Q,0,xe,Q,0,xe,Q,J,0,-Q,0,xe,Q,J,0,-Q,J,0,Q,0,-xe,-Q,0,-xe,-Q,J,0,Q,0,-xe,-Q,J,0,Q,J,0],F0=[0,0,1,0,1,1,0,0,1,1,0,1,0,0,1,0,1,1,0,0,1,1,0,1];return _e.setAttribute("position",new t.BufferAttribute(new Float32Array(K0),3)),_e.setAttribute("uv",new t.BufferAttribute(new Float32Array(F0),2)),_e.computeVertexNormals(),_e}function Bo(m,A,J){const ke=m/2,Q=A/2,xe=new t.BufferGeometry;return xe.setAttribute("position",new t.BufferAttribute(new Float32Array([ke,0,Q,ke,0,-Q,ke,J,0,-ke,0,-Q,-ke,0,Q,-ke,J,0]),3)),xe.computeVertexNormals(),xe}var Eo={id:"shaken-globe",name:"The Shaken Globe",category:"domestic",weirdness:.3,media:["tiny","snow","air"],async build(m){const{rng:A,noise:J}=m,ke=m.vary||{},Q=be(ke.density??1,.7,1.3),xe=!!ke.rare,_e=ke.hour||"any",K0=A.pick(["morning","overcast","morning"]),F0=A.pick(["sunrise","morning","overcast","thaw","morning"]),b0=_e==="dawn"||_e==="night"?"sunrise":_e==="golden"?"thaw":_e==="day"?K0:F0,H=So[b0],I0=44,ht=m.quality?.detail??1,L0=A.pick([0,0,0,1,2]),$=new t.Scene,R0=new t.Color(H.fog).lerp(new t.Color(H.top),.55).multiplyScalar(.62);$.background=R0.clone(),$.fog=new t.FogExp2(R0,(H.fogD??.0047)*.58);const Zt=-(Math.sign(H.az)||1),ie=await Mo(m,{palette:ko,flakes:Math.round(17e3*be(Q,.8,1.2)*ht),duration:I0,bubblesAt:[[5.8,72.5],[5.9,71],[5.7,70],...Zt>0?[[6.9,71.5],[7,70]]:[[6.72,72],[6.82,70.5]]].map(([e,o])=>[Math.sin(e)*o,Math.cos(e)*o])}),F=m.core.makeRng("shaken-globe-extras:"+m.seed);$.add(ie.object);const Se=ie.uniforms,$e=ie.anchors,{prep:C,place:w,glazedLathe:Ae,instances:Le,wobble:p0,tube:_0,archShape:Ut,C:p,glaze:Ee}=ie.kit,s0=H.az+A.range(-.12,.12),x0=(H.el+A.range(-2,2))*Yt,M0=new t.Vector3(Math.sin(s0)*Math.cos(x0),Math.sin(x0),Math.cos(s0)*Math.cos(x0)),E0=new t.Color(H.sun);ie.setSun(M0,E0.clone().lerp(new t.Color(1,1,1),.4).multiplyScalar(H.sunK)),Se.uSkyCol.value.set(H.skyFill).lerp(new t.Color(1,1,1),.12).multiplyScalar(b0==="overcast"?1.22:1),Se.uHorizon.value.set(H.hor).lerp(new t.Color(H.fog),.3),Se.uCaK.value=H.caK??1,Se.uTsTop.value=H.tsTop??1,$.add(new t.HemisphereLight(new t.Color(H.skyFill),new t.Color("#f7f4ee"),1.1));const pt=new t.DirectionalLight(E0,1.6*H.sunK);pt.position.copy(M0).multiplyScalar(200),$.add(pt),await m.yield();const ve=(e,o,a)=>new t.Vector3(Math.sin(e)*o,a,Math.cos(e)*o),Me=2.6+A.range(-.07,.07),he=A.range(51,53.5),e0=$e.portalSeat.direction.clone(),De=$e.portalSeat.position.clone().addScaledVector(e0,.25),pe=[ve(Me,68,27),ve(Me+.04,50.5,26.2),ve(Me+.5,46.5,23),ve(Me+.9,48.5,18),ve(Me+1.3,he,13.5),ve(Me+1.7,he,10.6),ve(4.7,he,9.4),ve(5.15,he+1,9.8),ve(5.6,he+4,12),ve(6,60,15.2),ve(6.38,63,14.8),ve(6.8,59,14.5),ve(7.12,47,10.8),ve(7.42,33,8.2),ve(7.66,23.5,7)],Jt=Math.PI/2+W,$t=.95;for(const[e,o,a]of[[0,18.5,6.6],[.785,18.5,6.6],[1.571,18.5,7.4],[2.356,18.8,9.2],[3.142,19.2,12],[3.927,20,16.5],[4.712,20.8,21.5],[5.498,21.2,26],[6.283,21.2,29.5],[7.069,20.5,32.5],[7.854,19.5,35],[8.639,18.5,37.5],[9.425,17.5,39.5],[10.21,16.5,41],[10.996,15.5,42],[11.781,14.5,42.6],[12.566,13.5,43.2],[13.352,13.2,44.2]])pe.push(ve(Jt+e,e>2?o*$t:o,a));pe.push(new t.Vector3(3.4,47.8,-13.2));const u0=39;for(const e of[u0,26,13,0])pe.push(De.clone().addScaledVector(e0,-e));const oe=xo(pe,{samples:480}),k0=400,ut=[];for(let e=0;e<=k0;e++)ut.push(oe.pointAt(e/k0));const Pe=e=>{let o=1e9,a=0;for(let i=0;i<=k0;i++){const l=ut[i].distanceToSquared(e);l<o&&(o=l,a=i)}return a/k0},D0=Pe(pe[6]),qe=Pe(pe[10]),ft=Pe(pe[12]),mt=Pe(pe[15]),No=Pe(pe[20]),Ko=Pe(pe[pe.length-4]),S0=Pe(pe[19]),dt=Pe(pe[23])-.005,vt=Pe(pe[26])-.01,H0=Pe(pe[29]),wt=Pe(pe[4])*.92,yt=e=>.8+.09*Math.sin(e*.11+1),n0=(e,o)=>{const a=Math.hypot(e,o);let i=Math.atan2(e,o)-yt(a);return i-=Math.round(i/W)*W,Math.abs(i)*a},W0=[],j0=(e,o)=>{const a=Math.hypot(e,o),i=Math.atan2(e,o);let l=Math.pow(be(J.fbm2(e*.03+7.3,o*.03-2.1,3)*.6+.5,0,1),1.25)*9.5*_(37.5,50,a)*(1-_(61,71,a));l+=3.4*_(54,63,a)*(1-_(66,72,a))*(.55+.45*J.n2(Math.sin(i)*2.2+3,Math.cos(i)*2.2)),l+=_(72.5,79.5,a)*4.5,l=Ie(-.55,l,_(35.3,39.5,a));const u=oe.nearestXZ(e,o);u.dist<17&&(l=Math.min(l,Ie(u.y-8.6,l,_(7,17,u.dist))));const d=n0(e,o);return a>35&&d<5.5&&(l=Ie(Math.min(l,-.75),l,_(1.7,5.5,d))),l},ue=(e,o)=>{let a=j0(e,o);for(const i of W0){const l=Math.hypot(e-i.x,o-i.z);l<i.r+4&&(a=Ie(i.y,a,_(i.r,i.r+4,l)))}return a},Ge=(e,o,a,i)=>oe.distanceTo(e,o,a)>i,f0=(e,o,a)=>W0.every(i=>Math.hypot(e-i.x,o-i.z)>i.r+a),X0=(e,o,a,i)=>{const l={x:e,z:o,r:a,y:i??j0(e,o)};return W0.push(l),l},t0=4.98+A.range(-.12,.12),ze=X0(Math.sin(t0)*(he+14),Math.cos(t0)*(he+14),4.2,4.6),Q0=1.75+A.range(-.3,.3),o0=X0(Math.sin(Q0)*47,Math.cos(Q0)*47,5.6,1.4),O0=43.5,Y0=yt(O0),He={x:Math.sin(Y0)*O0,z:Math.cos(Y0)*O0,a:Y0},We=[],gt=Math.round(25*Q),Z0=(e,o,a,i)=>{const l=Math.sin(e)*o,u=Math.cos(e)*o;if(!Ge(l,5,u,10.5)||!Ge(l,9,u,9)||!f0(l,u,5)||n0(l,u)<8)return!1;const d=X0(l,u,4.6);d.y=Math.max(d.y,.2);const M={x:l,z:u,y:d.y,ry:e+(a>0?0:Math.PI)+A.range(-.25,.25),type:i??A.int(0,5),s:A.range(.9,1.12)};if(M.type===5){const x=be(o+(o>he?3.8:-3.8),42,72),y=x/o;Ge(l*y,5,u*y,13.5)&&Ge(l*y,9,u*y,12)?(M.x=d.x=l*y,M.z=d.z=u*y,M.y=d.y=Math.max(j0(M.x,M.z),.2)):M.type=2}return We.push(M),!0};for(let e=Me+.95;e<5.85&&We.length<gt*.62;e+=A.range(.17,.25))A.chance(.85)&&Z0(e,he-12.8+A.range(-.6,.8),1),A.chance(.8)&&Z0(e+.08,he+12.8+A.range(-.8,2.5),-1);for(let e=0;e<90&&We.length<gt;e++)Z0(A.range(.95,2.6),A.range(41,58),A.chance(.5)?1:-1);let X=null;for(let e=0;e<40&&!X;e++){const o=5.76+((e>>2)%2?1:-1)*Math.ceil((e>>2)/2)*.04,a=67.5+(e&3)*1.1,i=Math.sin(o)*a,l=Math.cos(o)*a;f0(i,l,6.5)&&Ge(i,10,l,9.5)&&Ge(i,16,l,8.5)&&n0(i,l)>9&&(X={x:i,z:l,y:0,H:25})}X||(X={x:Math.sin(5.76)*70.5,z:Math.cos(5.76)*70.5,y:0,H:25}),await m.yield();{const a=new Float32Array(23688),i=[];for(let x=0;x<=46;x++){const y=35.3+44.60000000000001*Math.pow(x/46,1.08);for(let g=0;g<168;g++){const f=g/168*W,h=Math.sin(f)*y,s=Math.cos(f)*y,c=(x*168+g)*3;a[c]=h,a[c+1]=ue(h,s),a[c+2]=s}x%2===1&&await m.yield()}for(let x=0;x<46;x++)for(let y=0;y<168;y++){const g=x*168+y,f=x*168+(y+1)%168,h=g+168,s=f+168;i.push(g,f,h,f,s,h)}const l=new t.BufferGeometry;l.setAttribute("position",new t.BufferAttribute(a,3)),l.setIndex(i),l.computeVertexNormals(),await m.yield();const u=p.sky.clone().lerp(p.cobalt,.4),d=C(l,{col:(x,y,g,f,h,s)=>{const c=Math.hypot(x,g);s.copy(p.white).lerp(p.pool,be(.46-y*.075+J.n2(x*.22,g*.22)*.2+.2*_(.05,.7,J.n2(x*.085+31,g*.085-7)),.04,.8)),c>36&&s.lerp(u,_(3.4,1.5,n0(x,g))*.9),s.lerp(p.cobalt,Math.max(_(.7,.3,Math.abs(c-74.2)),_(.35,.1,Math.abs(c-76)))*.9)}});await m.yield();const M=new t.Mesh(d,Ee);M.frustumCulled=!1,$.add(M)}await m.yield();const Ce=[],Fo=new t.Color,eo=e=>(o,a,i,l,u,d)=>d.copy(p.white).lerp(p.pool,be(.5-a*.2,0,.5)),je=(e,o,a)=>C(new t.ExtrudeGeometry(Ut(e,o),{depth:.16,bevelEnabled:!1,curveSegments:4}),{col:(i,l,u,d,M,x)=>x.copy(p.lamp).multiplyScalar(.5+.5*be(l/o,0,1)),mat:3,m:a}),a0=(e,o,a,i,l=p.gold,u=1)=>C(new t.SphereGeometry(e,7,5),{col:l,mat:u,m:w(o,a,i)}),to=(e,o,a,i,l,u)=>u.copy(p.cobalt).lerp(p.deep,.35*(1-l));function*T0(e,o,a,i,l,u){const d=[];d.push(C(new t.BoxGeometry(e,a,o),{col:(y,g,f,h,s,c)=>c.copy(p.white).lerp(p.pool,be(.3-g*.2,0,.5)),row:l,rep:.5,m:w(0,a/2,0)})),d.push(C(Vo(e,o,i,.55),u?{col:to,m:w(0,a-.12,0)}:{col:p.white,row:1,rep:1,vrep:2,m:w(0,a-.12,0)})),d.push(C(Bo(e,o,i-.25),{col:p.white,m:w(0,a,0)}));const M=new t.CylinderGeometry(.13,.13,e+1.3,6);M.rotateZ(Math.PI/2),d.push(C(M,{col:p.gold,mat:1,m:w(0,a+i-.1,0)}));for(const y of[-1,1])d.push(a0(.24,y*(e/2+.65),a+i-.05,0));d.push(Ae([[.38,0],[.42,1.1],[.55,1.2],[.5,1.4],[.3,1.55]],8,p.white,p.cobalt,{m:w(e*.24,a+i*.45,-o*.2)})),yield,d.push(je(1,2,w(0,0,o/2-.04)));for(const y of[-1,1])yield,d.push(je(.85,1.3,w(y*e*.31,a*.34,o/2-.04))),a>4.6&&d.push(je(.7,1,w(y*e*.31,a*.7,o/2-.04))),d.push(je(.85,1.3,w(y*e*.25,a*.4,-o/2+.04,Math.PI))),d.push(je(.8,1.3,w(y*(e/2-.04),a*.4,0,y*Math.PI/2))),d.push(C(new t.SphereGeometry(.34,8,5),{col:p.cobalt,m:w(y*(e/2+.02),a+i*.36,0,0,0,0,.25,1,1)}));yield;const x=ne(d);return yield,p0(x,J,.06)}function*U0(e,o,a,i,l){const u=[];u.push(Ae([[e*1.06,0],[e,.35],[e,o]],18,p.white,p.pool,{row:i,rep:1.25})),u.push(Ae([[e+.7,o-.25],[e*.6,o+a*.45],[.14,o+a]],18,p.white,p.pool,l?{tint:(x,y,g,f,h,s)=>s.copy(p.cobalt).lerp(p.deep,.35*(1-h))}:{row:1,rep:2,vrep:2}));const d=new t.TorusGeometry(e+.68,.09,5,20);d.rotateX(Math.PI/2),u.push(C(d,{col:p.gold,mat:1,m:w(0,o-.25,0)})),u.push(a0(.3,0,o+a+.2,0)),yield,u.push(je(1,2,w(0,0,e-.06)));for(let x=1;x<5;x++){const y=x/5*W;u.push(je(.8,1.3,w(Math.sin(y)*(e-.06),o*.45,Math.cos(y)*(e-.06),y)))}yield;const M=ne(u);return yield,p0(M,J,.06)}const i0=[],bt=async e=>{let o;for(;!(o=e.next()).done;)await m.yield();return o.value};for(const e of[()=>T0(7,5.4,4.2,2.8,0,!1),()=>T0(8.4,5.8,5.1,3.1,3,!0),()=>T0(6,5,3.7,3.3,2,!1),()=>U0(3.1,5,3.8,3,!1),()=>U0(2.6,6.1,3.5,0,!0),()=>T0(6,9,4.6,3.4,0,!0)])i0.push(await bt(e())),await m.yield();{const e=await bt(U0(1.9,9.2,4.6,2,!1));e.applyMatrix4(w(0,0,4.2)),await m.yield(),i0[5]=ne([i0[5],e])}const xt=[7,8.2,7,9.1,9.9,8];await m.yield();const Mt=[];for(let e=0;e<i0.length;e++){const o=[];We.forEach((a,i)=>{a.type===e&&(o.push(w(a.x,a.y-.15,a.z,a.ry,0,0,a.s)),i%3===0&&Mt.push(new t.Vector3(a.x,a.y+xt[e]*a.s-.1,a.z)))});for(let a=0;a<o.length;a+=2)Ce.push(Le(i0[e],o.slice(a,a+2))),await m.yield();i0[e].dispose()}await m.yield();{X.y=ue(X.x,X.z)-.4;const e=[],o=X.H,a=p.green.clone().lerp(new t.Color("#2f8a58"),.6),i=9,l=18;e.push(Ae([[2.5,-1.2],[2.6,.5],[1.9,.9],[1,2.8]],14,p.white,p.cobalt,{row:2,rep:2}));for(let g=0;g<i;g++){const f=g/(i-1),h=Ie(6,1.15,f),s=Ie(4.8,2.7,f),c=new t.ConeGeometry(h,s,l,2,!0),r=c.attributes.position;for(let n=0;n<r.count;n++){const b=n%(l+1),G=Math.floor(n/(l+1)),S=b/l*W,E=b%2===1,D=G===0?h*.1:G===1?h*(E?.5:.58):h*(E?1.1:.9);r.setXYZ(n,Math.sin(S)*D,G===0?s/2:G===1?-.08*s:-s/2+(E?-.15*s:.05*s),Math.cos(S)*D)}c.computeVertexNormals(),e.push(C(c,{col:(n,b,G,S,E,D)=>{const j=Math.hypot(n,G)/h;D.copy(a).multiplyScalar(.5+1.25*j).lerp(p.white,_(.8,.95,j)*.95)},m:w(0,2.4+f*(o-6)+s/2,0,g*.5)})),g%3===2&&await m.yield()}await m.yield();const u=[],d=54;for(let g=0;g<=90;g++){const f=g/90,h=f*W*5,s=Ie(6.25,1.3,f)+.25*Math.sin(f*90);u.push([Math.sin(h)*s,2.2+f*(o-4.6)-.5*Math.abs(Math.sin(h*4.5)),Math.cos(h)*s])}e.push(C(_0(u,.13,180,5),{col:p.gold,mat:1})),await m.yield();for(let g=0;g<d;g++){const f=(g+.5)/d,h=f*W*5+.3,s=Ie(6.25,1.3,f)+.2;e.push(C(new t.SphereGeometry(g%3===0?.42:.33,7,5),{col:g%3===0?p.lamp.clone().multiplyScalar(1.5):g%3===1?p.lamp:new t.Color(.75,.85,1),mat:3,m:w(Math.sin(h)*s,1.7+f*(o-4.6),Math.cos(h)*s)})),g%14===13&&await m.yield()}await m.yield();const M=oe.pointAt(.25),x=Math.atan2(M.x-X.x,M.z-X.z);e.push(C(ie.kit.starGeo(ie.kit.K.starPoints,1.05,.25),{col:p.gold,mat:1,flat:!0,m:w(0,o+1.5,0,x,0,0,2.3)})),e.push(C(new t.CylinderGeometry(.12,.2,2.2,6),{col:p.gold,mat:1,m:w(0,o-.6,0)})),e.push(C(new t.SphereGeometry(.5,8,6),{col:p.lamp.clone().multiplyScalar(1.6),mat:3,m:w(0,o+1.5,0)})),await m.yield();const y=ne(e);for(const g of e)g.dispose();await m.yield(),y.applyMatrix4(w(X.x,X.y,X.z)),Ce.push(y)}await m.yield();{const e=[];e.push(Ae([[3.4,-.6],[3.3,.5],[2.85,4.2]],20,p.white,p.pool,{row:0,rep:1.5})),e.push(Ae([[2.85,4.2],[2.95,4.5],[2.75,4.8],[2.1,11],[2.45,11.3]],20,p.white,p.pool)),e.push(Ae([[2.6,11.3],[2.3,12],[1.5,13.2],[.2,13.9]],20,p.white,p.pool,{tint:(l,u,d,M,x,y)=>y.copy(p.cobalt).lerp(p.deep,.3*(1-x))}));const o=new t.TorusGeometry(2.92,.11,5,24);o.rotateX(Math.PI/2),e.push(C(o,{col:p.gold,mat:1,m:w(0,4.5,0)})),e.push(a0(.34,0,14.2,0)),e.push(je(1.1,2.1,w(0,0,3.2)));for(let l=0;l<4;l++){const u=l/4*W+.8;e.push(je(.7,1.2,w(Math.sin(u)*2.45,6.5+l%2*1.8,Math.cos(u)*2.45,u)))}const a=new t.CylinderGeometry(.25,.25,3.2,8);a.rotateX(Math.PI/2),e.push(C(a,{col:p.gold,mat:1,m:w(0,11,2)}));const i=p0(ne(e),J,.07);i.applyMatrix4(w(ze.x,ze.y,ze.z,t0+Math.PI)),Ce.push(i)}await m.yield();{const e=[];e.push(Ae([[4.6,-.5],[4.6,.8],[4.3,.95],[.1,.95]],16,p.white,p.pool,{row:2,rep:3})),e.push(Ae([[5.2,3.9],[4.9,4.2],[2.6,5.1],[.9,6.2],[.15,6.9]],16,p.white,p.pool,{row:1,rep:2.5,vrep:2}));for(let a=0;a<8;a++){const i=(a+.5)/8*W;e.push(C(new t.CylinderGeometry(.11,.13,3.2,6),{col:p.gold,mat:1,m:w(Math.sin(i)*4.1,2.5,Math.cos(i)*4.1)})),e.push(a0(.2,Math.sin(i)*5.05,3.85,Math.cos(i)*5.05))}e.push(a0(.32,0,7.15,0));const o=p0(ne(e),J,.06);o.applyMatrix4(w(o0.x,o0.y,o0.z)),Ce.push(o)}await m.yield();{const e=new t.Shape;e.moveTo(-5.4,-.9),e.lineTo(-5.4,.2),e.quadraticCurveTo(0,5,5.4,.2),e.lineTo(5.4,-.9),e.lineTo(2.9,-.9),e.quadraticCurveTo(0,3.6,-2.9,-.9),e.lineTo(-5.4,-.9);const o=new t.ExtrudeGeometry(e,{depth:3.2,bevelEnabled:!0,bevelThickness:.12,bevelSize:.12,bevelSegments:1,curveSegments:10});o.translate(0,0,-1.6);const a=[C(o,{col:(l,u,d,M,x,y)=>y.copy(p.white).lerp(Math.abs(d)>1.65?p.cobalt:p.pool,Math.abs(d)>1.65?_(1.2,.2,Math.abs(u-1.2+l*l*.05))*.8:.25)})];for(const l of[-1.55,1.55]){const u=[];for(let d=0;d<=8;d++){const M=-5.2+d*1.3;u.push([M,3.35-M*M*.087,l])}a.push(C(_0(u,.08,16,5),{col:p.gold,mat:1}));for(let d=0;d<=8;d+=2){const M=-5.2+d*1.3,x=3.35-M*M*.087;a.push(C(new t.CylinderGeometry(.06,.06,.95,5),{col:p.gold,mat:1,m:w(M,x-.45,l)}))}}const i=p0(ne(a),J,.05);i.applyMatrix4(w(He.x,0,He.z,He.a)),Ce.push(i)}await m.yield();const J0=[],$0=[];{const e=ne([Ae([[.3,-.3],[.34,.2],[.16,.5],[.12,3.6],[.24,3.75],[.1,3.9]],7,p.white,p.cobalt),C(new t.SphereGeometry(.5,10,7),{col:p.lamp.clone().multiplyScalar(1.25),mat:3,m:w(0,4.38,0)}),a0(.14,0,4.95,0)]),o=[],a=[],i=[],l=[],u=[],d=ne([C(new t.BoxGeometry(.2,1,.07),{col:eo(),m:w(0,.45,0)}),C(new t.CylinderGeometry(0,.14,.26,4),{col:p.cobalt,m:w(0,1.08,0,Math.PI/4,0,0,1,1,.5)})]),M=ne([Ae([[.26,-.3],[.28,.15],[.18,.35],[.2,1.25],[.3,1.38],[.12,1.5]],7,p.white,p.cobalt)]),x={kind:1,amp:.13,phase:0},y=ne([C(new t.CylinderGeometry(.035,.035,.42,4),{col:p.gold,mat:1,kind:1,amp:(s,c)=>.13*(c+.21)/.42,m:w(0,1.7,0)}),C(new t.SphereGeometry(.34,9,7),{col:(s,c,r,n,b,G)=>G.copy(r>.02&&c<.2?p.red:c>.12?p.cobalt:p.white),...x,m:w(0,2.15,0,0,-.3,0,.9,.95,1.15)}),C(new t.SphereGeometry(.21,8,6),{col:(s,c,r,n,b,G)=>G.copy(r>.06&&c<.05?p.red:p.cobalt),...x,m:w(0,2.52,.22)}),C(new t.ConeGeometry(.06,.2,5),{col:p.gold,mat:1,...x,m:w(0,2.5,.48,0,Math.PI/2)}),C(new t.BoxGeometry(.22,.05,.5),{col:p.cobalt,...x,m:w(0,2.12,-.5,0,.5)})]),g=Math.round(40*Q),f=(s,c,r)=>{const n=Math.sin(s)*c,b=Math.cos(s)*c;return[n,ue(n,b),b,r??s]},h=(s,c,r)=>Ge(s,3,c,r)&&f0(s,c,.3)&&n0(s,c)>4.5&&Math.hypot(s,c)>38.5;await m.yield();for(let s=Me+1,c=0;s<5.95;s+=.115,c++){c%6===5&&await m.yield();const r=c%2?1:-1,[n,b,G]=f(s,he+r*7.4);c%3===0&&h(n,G,6.5)&&o.push(w(n,b,G,0,0,0,1.15));for(const S of[-1,1]){const E=(c+(S>0?2:0))%4===0,D=he+S*8.3;for(let j=0;j<5;j++){const V=s+j*.023,[Y,re,we]=f(V,D);if(h(Y,we,7)){if(E&&(j===0||j===4))i.push(w(Y,re,we,V)),l.length<g&&(l.push(w(Y,re,we,V+(S>0?Math.PI:0)+A.range(-.6,.6))),u.push(A()*W));else if(!E){a.push(w(Y,re,we,V));const[le,q,L]=f(V+.0115,D);a.push(w(le,q,L,V))}}}}}for(let s=0;s<10;s++){const c=Q0+(s+.5)/10*W,r=o0.x+Math.sin(c)*8,n=o0.z+Math.cos(c)*8;if(h(r,n,7)){const b=ue(r,n);s%2?o.push(w(r,b,n)):(i.push(w(r,b,n)),l.push(w(r,b,n,c+Math.PI)),u.push(A()*W))}}for(const s of[-1,1])for(const c of[-6.6,6.6]){const r=He.x+Math.cos(He.a)*c+Math.sin(He.a)*s*2.3,n=He.z-Math.sin(He.a)*c+Math.cos(He.a)*s*2.3;Ge(r,4,n,6)&&o.push(w(r,ue(r,n),n))}await m.yield(),o.length&&Ce.push(Le(e,o));for(const s of o)J0.push([s.elements[12],s.elements[13]+4.4*(s.elements[0]>1.1?1.15:1),s.elements[14]]);await m.yield();for(let s=0;s<a.length;s+=120)Ce.push(Le(d,a.slice(s,s+120))),await m.yield();i.length&&Ce.push(Le(M,i)),await m.yield(),l.length&&Ce.push(Le(y,l,(s,c)=>{const r=s.attributes.aFx.array;for(let n=0;n<l.length;n++)for(let b=0;b<c;b++)r[(n*c+b)*4+2]=u[n]}));for(const s of[e,d,M,y])s.dispose()}await m.yield();const kt=e=>{const o=[[Me+.9,48.5],[Me+1.3,he],[4.7,he],[5.15,he+1],[5.6,he+4],[6,60]];let a=0;for(;a<o.length-2&&e>o[a+1][0];)a++;return Ie(o[a][1],o[a+1][1],_(o[a][0],o[a+1][0],e))};{const e=[],a=(u,d,M,x)=>{let y=null;for(let g=M;g<=x;g+=.016){const f=kt(g)+u(g)+d,h=Math.sin(g)*f,s=Math.cos(g)*f,c=Math.sin(g),r=Math.cos(g);let n=null;if(f0(h,s,.6)&&n0(h,s)>4.5){const b=ue(h,s)+.1;n=[c*(f-.17),b,r*(f-.17),c*(f+.17),b,r*(f+.17)]}y&&n&&e.push(y[0],y[1],y[2],y[3],y[4],y[5],n[0],n[1],n[2],y[3],y[4],y[5],n[3],n[4],n[5],n[0],n[1],n[2]),y=n}};for(const u of[-.72,.72])a(d=>.4+1.3*Math.sin(d*2.1+.6),u,Me+1.12,5.9),await m.yield(),a(d=>-.7+2.5*Math.sin(d*1.3+2.2),u,Me+1.45,5.62),await m.yield();const i=new t.BufferGeometry,l=new Float32Array(e.length);for(let u=1;u<l.length;u+=3)l[u]=1;i.setAttribute("position",new t.BufferAttribute(new Float32Array(e),3)),i.setAttribute("normal",new t.BufferAttribute(l,3)),e.length&&Ce.push(C(i,{col:p.sky.clone().lerp(p.cobalt,.42)}))}await m.yield();const St=new t.Mesh(ne(Ce),Ee);St.frustumCulled=!1,$.add(St);for(const e of Ce)e.dispose();await m.yield(),await m.yield();const q0=(()=>{const e=[];for(let a=0;a<4;a++){const i=w(0,0,0,0,0,a*Math.PI/2);e.push(C(new t.BoxGeometry(.22,7.6,.22),{col:p.cobalt,m:i.clone().multiply(w(0,4,0))})),e.push(C(new t.PlaneGeometry(1.8,5.8,1,3),{col:p.white,row:2,rep:.14,vrep:3,m:i.clone().multiply(w(1.02,4.8,.06,0,0,.05))}));for(const l of[1.95,7.7])e.push(C(new t.BoxGeometry(1.9,.12,.12),{col:p.gold,mat:1,m:i.clone().multiply(w(1,l,.06))}))}e.push(C(new t.ConeGeometry(.55,1,10),{col:p.gold,mat:1,m:w(0,0,.35,0,Math.PI/2)}));const o=new t.Mesh(ne(e),Ee);for(const a of e)a.dispose();return o.position.set(ze.x-Math.sin(t0)*3.75,ze.y+11,ze.z-Math.cos(t0)*3.75),o.rotation.order="YXZ",o.rotation.y=t0+Math.PI,o.frustumCulled=!1,$.add(o),o})();await m.yield();const Tt=(()=>{const e=[C(new t.CylinderGeometry(.05,.05,1.5,5),{col:p.gold,mat:1,m:w(0,.75,0)})],o=new t.BoxGeometry(1.8,.07,.07);e.push(C(o,{col:p.gold,mat:1,m:w(0,1,0)})),e.push(C(new t.ConeGeometry(.16,.42,4),{col:p.gold,mat:1,m:w(1.05,1,0,0,0,-Math.PI/2)})),e.push(C(new t.BoxGeometry(.5,.42,.04),{col:p.gold,mat:1,m:w(-.8,1,0)})),e.push(C(new t.SphereGeometry(.3,8,6),{col:p.gold,mat:1,m:w(0,1.72,0,0,0,0,1.25,1,.3)})),e.push(C(new t.SphereGeometry(.15,6,5),{col:p.gold,mat:1,m:w(.38,2.02,0,0,0,0,1,1,.4)})),e.push(C(new t.SphereGeometry(.3,7,5),{col:p.gold,mat:1,m:w(-.42,1.98,0,0,0,.6,.6,1.1,.2)})),e.push(C(new t.SphereGeometry(.09,5,4),{col:p.red,m:w(.42,2.2,0)}));const a=ne(e);for(const i of e)i.dispose();return a})(),qt=Mt.slice(0,10).map((e,o)=>{const a=new t.Mesh(Tt,Ee);return a.position.copy(e),a.userData={base:Math.atan2(e.z,-e.x)+Math.PI,k:.6+.8*A(),ph:o*1.7},$.add(a),a});qt.length||Tt.dispose();{const e=[C(new t.CylinderGeometry(.009,.015,.26,5),{col:new t.Color("#3a2a20"),phase:-1,m:w(0,.13,0)})],o=p.green.clone().lerp(new t.Color("#2f8a58"),.6),a=12,i=[.13,.3,.47,.63,.78,.92],l=[.19,.165,.14,.113,.083,.052],u=[.27,.27,.27,.25,.22,.16];for(let c=0;c<6;c++){const r=l[c],n=u[c],b=new t.ConeGeometry(r,n,a,2,!0),G=b.attributes.position,S=b.attributes.normal,E=.36*r,D=-.1*n;for(let j=0;j<G.count;j++){const V=j%(a+1),Y=Math.floor(j/(a+1)),re=V/a*W,we=V%2===1,le=Y===0?0:Y===1?E*(we?.92:1.08):r*(we?1.12:.9),q=Y===0?n/2:Y===1?D:-n/2+(we?-.16*n:.05*n),L=Y<1?E:r-E,z=Y<1?n/2-D:(Y===1?.72:.5)*(D+n/2),B=Math.hypot(L,z);G.setXYZ(j,Math.sin(re)*le,q,Math.cos(re)*le),S.setXYZ(j,Math.sin(re)*z/B,L/B,Math.cos(re)*z/B)}e.push(C(b,{col:(j,V,Y,re,we,le)=>le.copy(o).multiplyScalar(1.5+.9*Math.min(1,Math.hypot(j,Y)/r)),amp:(j,V)=>V<-n*.4?1:V<n*.25?.5:0,phase:c,m:w(0,i[c]+n/2,0,c*.7)}))}const d=ne(e);for(const c of e)c.dispose();await m.yield();const M=Math.round(600*Q),x=[],y=[],g=(c,r,n,b=A,G=1)=>{const S=Math.sin(c)*r,E=Math.cos(c)*r,D=ue(S,E);if(!f0(S,E,1.6)||n0(S,E)<3.2||!Ge(S,D+n,E,4.6)||!Ge(S,D+n*.55,E,5.2+n*.12)||!Ge(S,D+1,E,6)||Math.hypot(r,D+n-20)>76.5||pe[0].distanceTo(h.set(S,D+n,E))<17)return;const j=w(S,D-.2,E,b()*W,0,0,n*G*b.range(.9,1.15),n,n*G*b.range(.9,1.15)),V=b(),Y=b.range(.75,1.2);f++,!(Math.hypot(S-X.x,E-X.z)<7.2)&&(x.push(j),y.push(V,Y),$0.push([S,E,n,.2*n*G]))};let f=0;const h=new t.Vector3;for(let c=0;c<4e3&&f<M*.66;c++){(c&127)===127&&await m.yield();const r=A()*W,n=A.range(61,73.5);J.n2(Math.sin(r)*4,Math.cos(r)*4+9)>-.45&&g(r,n,A.range(8,14))}for(let c=0;c<6e3&&f<M;c++){(c&127)===127&&await m.yield();const r=A()*W,n=A.range(38.5,61);Math.abs(n-he)<15.5&&oe.nearestXZ(Math.sin(r)*n,Math.cos(r)*n).dist<15.5&&A()<.85||J.n2(Math.sin(r)*n*.06+20,Math.cos(r)*n*.06)>-.1&&g(r,n,A.range(6.5,11.5))}for(let c=0;c<200;c++){const r=6.38+F.range(-.5,.5),n=F.range(69.5,75.6),b=Math.sin(r)*n,G=Math.cos(r)*n;g(r,n,be((oe.nearestXZ(b,G).y+2.4-5.6*Math.pow(F(),1.4)-ue(b,G))/1.07,7.5,19.5),F,1.35),(c&31)===31&&await m.yield()}const s=new t.InstancedMesh(d,ie.kit.mat(zo,ie.kit.GLAZE_FRAG,{defines:{PINE:""}}),x.length);await m.yield(),x.forEach((c,r)=>s.setMatrixAt(r,c)),d.setAttribute("aTree",new t.InstancedBufferAttribute(new Float32Array(y),2)),s.frustumCulled=!1,$.add(s)}await m.yield();const z0=(()=>{const e=new t.Shape;e.moveTo(-1.5,.3),e.lineTo(.9,.3),e.quadraticCurveTo(1.95,.35,1.78,1.25),e.quadraticCurveTo(1.72,1.6,1.4,1.45),e.quadraticCurveTo(1.6,.85,.9,.8),e.lineTo(-.9,.8),e.lineTo(-1.45,1.78),e.lineTo(-1.72,1.72),e.lineTo(-1.5,.3);const o=new t.ExtrudeGeometry(e,{depth:1.2,bevelEnabled:!0,bevelThickness:.07,bevelSize:.07,bevelSegments:1,curveSegments:6});o.translate(0,0,-.6);const a=[C(o,{col:(h,s,c,r,n,b)=>b.copy(p.white).lerp(p.pool,be(.5-s*.4,0,.45)).lerp(p.cobalt,Math.max(_(.95,1.1,s),Math.abs(c)>.62?_(.25,.08,Math.abs(Math.sin(h*3.2+s*2))):0)*.9),row:0,rep:.14,vrep:.62})];for(const h of[-.55,.55]){a.push(C(_0([[-1.7,0,h],[-.4,-.02,h],[1.2,0,h],[1.9,.35,h],[1.95,.9,h],[1.7,1.05,h]],.065,14,5),{col:p.gold,mat:1}));for(const s of[-1,.6])a.push(C(new t.CylinderGeometry(.05,.05,.36,5),{col:p.gold,mat:1,m:w(s,.16,h)}))}a.push(a0(.16,1.6,1.62,0));const i=new t.PlaneGeometry(2.3,1.06,6,2);i.rotateX(Math.PI/2),a.push(C(i,{col:(h,s,c,r,n,b)=>b.copy(p.white).lerp(p.pool,.35),row:0,rep:.5,m:w(-.3,.215,0)}));for(const h of[-1,.6]){const s=new t.CylinderGeometry(.05,.05,1.1,5);s.rotateX(Math.PI/2),a.push(C(s,{col:p.gold,mat:1,m:w(h,.02,0)}))}const l=ne(a);for(const h of a)h.dispose();l.applyMatrix4(w(0,0,0,-Math.PI/2));const u=new t.PlaneGeometry(3.6,.52,16,2),d=u.attributes.position,M=p.red.clone().multiplyScalar(.5);for(let h=0;h<d.count;h++){const s=d.getX(h),c=d.getY(h),r=(s+1.8)/3.6;d.setXYZ(h,s-(r>.97&&Math.abs(c)<.1?.55:0),c*(1-.45*r)+.34*Math.sin(r*8.5)*r,.22*Math.sin(r*6+1)*r)}u.computeVertexNormals();const x=C(u,{col:(h,s,c,r,n,b)=>{const G=(h+1.8)/3.6;b.copy(M).lerp(p.red,be(.25+n*.9,0,1)).lerp(p.gold,_(.86,1,G)*.85)},kind:3,phase:0,amp:h=>{const s=(h+1.8)/3.6;return .6*s*s}});x.applyMatrix4(w(0,1.72,-1.7-1.8,Math.PI/2));const y=ne([l,x]);l.dispose(),x.dispose();const g=[],f=Math.round(8*Q);for(let h=0;h<f;h++){const s=new t.Mesh(y,Ee);s.rotation.order="YXZ",s.scale.setScalar(A.range(1.25,1.7));const c=20+15*(h+A())/Math.max(f,1);s.userData={sc:s.scale.x,r:A.range(32.5,37),y:c,ph:h/f*W+A.range(-.3,.3),k:A.range(.8,1.2),w:A()*W},s.frustumCulled=!1,$.add(s),g.push(s)}return f||y.dispose(),g})();await m.yield();const zt=await(async()=>{const{starGeo:e,goose:o}=ie.kit,a=ie.kit.K,i=[],l=(q,L)=>ne([C(e(a.starPoints,1.05,.25),{col:q,mat:L,flat:!0}),a0(.2,0,0,0),C(new t.TorusGeometry(.16,.04,4,8),{col:p.gold,mat:1,m:w(0,1.2,0)})]),u=l(p.sky.clone().lerp(p.glass,.35),2);await m.yield();const d=l((q,L,z,B,R,N)=>N.copy(p.white).lerp(p.cobalt,_(.02,.3,Math.hypot(q,L,z))*.96).lerp(p.deep,.25),0),M=[u,d],x=[[],[]],y=[[],[]],g=26;await m.yield();const f=[],h=new t.Vector3;for(let q=0;q<=300;q++){oe.pointAt(.8+.2*q/300,h),h.sub(De);const L=h.dot(e0);f.push(-L,Math.sqrt(Math.max(0,h.lengthSq()-L*L)))}const s=(q,L)=>{let z=1e9;for(let B=0;B<f.length;B+=2)z=Math.min(z,Math.hypot(f[B]-q,f[B+1]-L));return z};for(let q=0;q<g;q++){const L=8.5+(u0-1.5)*(q+F())/g,z=(L<13||L>u0-3?6.9:4.9)+2.5*F(),B=q*2.399+F.range(-.3,.3),R=q%3===1?1:0;let N=L;for(;N>u0-3&&s(N,z)<5.5;)N-=.25;x[R].push(w(Math.cos(B)*z,-N,Math.sin(B)*z,F()*W,F.range(-.5,.5),F.range(-.5,.5),F.range(.85,1.35))),y[R].push(F()*W)}const c=[],r=[[],[]],n=[[],[]],b=new t.Vector3(0,43,2),G=new t.Vector3(0,58,-17.5),S=new t.Vector3;for(let q=0;q<30;q++){const L=(q+F())/30,z=q*2.399,B=2.5+6.5*F(),R=q%3===1?1:0,N=F.range(.9,1.5),O=F()*W,Te=F.range(-.5,.5),Re=F()*W;S.lerpVectors(b,G,L),S.x+=Math.cos(z)*B,S.z+=Math.sin(z)*B,S.y+=Math.sin(z*1.7)*2.2,!(oe.distanceTo(S.x,S.y,S.z)<5.5||Math.hypot(S.x,S.y-41,S.z)<3)&&(r[R].push(w(S.x,S.y,S.z,O,Te,.3,N)),n[R].push(Re))}await m.yield();for(let q=0;q<2;q++)i.push(Le(M[q],x[q],(L,z)=>{const B=L.attributes.aFx.array;for(let R=0;R<x[q].length;R++)for(let N=0;N<z;N++){const O=(R*z+N)*4;B[O+1]=.45,B[O+2]=y[q][R],B[O+3]=0}})),await m.yield();const E=o(),D=[],j=[],V=E.attributes.position,Y=E.attributes.aFx.array,re=new t.Vector3,we=q=>{let L=1e18;for(let z=0;z<V.count;z++){re.set(V.getX(z),V.getY(z),V.getZ(z)).applyMatrix4(q);const B=-re.y,R=Math.hypot(re.x,re.z),N=Math.abs(Y[z*4+1]);for(let O=0;O<f.length;O+=2){const Te=Math.abs(f[O]-B)-N;if(Te>8)continue;const Re=f[O+1]-R,B0=(Te>0?Te*Te:0)+Re*Re;B0<L&&(L=B0)}}return Math.sqrt(L)};await m.yield();for(let q=0;q<6;q++){const L=12+(u0-15)*(q+.2+.6*F())/6,z=F.range(7.2,9.4),B=q*2.05+.8+F.range(-.3,.3);let R=z,N=w(Math.cos(B)*R,-L,Math.sin(B)*R,Math.PI-B,-.22,.3,1.3);await m.yield();for(let O=0;O<40&&we(N)<5.5;O++)R+=.25,N=w(Math.cos(B)*R,-L,Math.sin(B)*R,Math.PI-B,-.22,.3,1.3);D.push(N),j.push(F()*W)}i.push(Le(E,D,(q,L)=>{const z=q.attributes.aFx.array;for(let B=0;B<D.length;B++)for(let R=0;R<L;R++)z[(B*L+R)*4+2]=j[B]})),await m.yield();{const q=[],L=[];for(let z=0;z<7;z++){const B=(z+.5)/7,R=z*2.2+.6,N=6.5+3*F(),O=F.range(1.4,1.8),Te=F()*W;S.lerpVectors(b,G,B),S.x+=Math.cos(R)*N,S.z+=Math.sin(R)*N,S.y+=1.5+Math.sin(R*1.3)*2,!(oe.distanceTo(S.x,S.y,S.z)<6.5)&&(q.push(w(S.x,S.y,S.z,Math.PI*1.5-R,-.45,.25,O)),L.push(Te))}await m.yield();{const Re=.05/Math.sqrt(3)+.025,B0=48,Qe=Math.SQRT2,Z=new Float32Array(1040*640).fill(1e9);let Be=1040,Ne=-1,Oe=640,Ye=-1;const Ft=new t.Quaternion().setFromUnitVectors(new t.Vector3(0,1,0),e0),N0=Ft.clone().invert(),at=new t.Vector3(0,1,0).applyQuaternion(N0),Ke=new t.Vector3,l0=new t.Vector3,c0=new t.Vector3,It=new t.Matrix4,fo=new t.Matrix4,d0=v=>Math.abs(Y[v*4+1]),mo=()=>.45,vo=(v,K,P)=>{for(let I=K;I<P;I+=3){Ke.fromBufferAttribute(V,I).applyMatrix4(v),l0.fromBufferAttribute(V,I+1).applyMatrix4(v),c0.fromBufferAttribute(V,I+2).applyMatrix4(v);const T=Math.max(1,Math.ceil(Math.max(Ke.distanceTo(l0),l0.distanceTo(c0),c0.distanceTo(Ke))/.05)),k=d0(I),ae=d0(I+1),U=d0(I+2);for(let ee=0;ee<=T;ee++)for(let ce=0;ce<=T-ee;ce++){const te=ee/T,se=ce/T,me=1-te-se,ye=te*Ke.y+se*l0.y+me*c0.y,ge=te*k+se*ae+me*U,de=Math.floor(Math.hypot(te*Ke.x+se*l0.x+me*c0.x,te*Ke.z+se*l0.z+me*c0.z)/.05),Ue=Math.max(0,Math.floor((-ye-ge)/.05)),Je=Math.min(1039,Math.floor((-ye+ge)/.05));de<640&&Ue<=Je&&(Z.fill(0,de*1040+Ue,de*1040+Je+1),Ue<Be&&(Be=Ue),Je>Ne&&(Ne=Je),de<Oe&&(Oe=de),de>Ye&&(Ye=de))}}};for(const v of D)for(let K=0;K<V.count;K+=300)vo(v,K,Math.min(V.count,K+300)),await m.yield();Be=Math.max(0,Be-40),Ne=Math.min(1039,Ne+40),Oe=Math.max(0,Oe-40),Ye=Math.min(639,Ye+40);const wo=(v,K)=>{for(let P=v;P<=K;P++)for(let I=Be,T=P*1040+Be;I<=Ne;I++,T++){let k=Z[T];I>Be&&Z[T-1]+1<k&&(k=Z[T-1]+1),P>Oe&&(Z[T-1040]+1<k&&(k=Z[T-1040]+1),I>Be&&Z[T-1040-1]+Qe<k&&(k=Z[T-1040-1]+Qe),I<Ne&&Z[T-1040+1]+Qe<k&&(k=Z[T-1040+1]+Qe)),Z[T]=k}},yo=(v,K)=>{for(let P=K;P>=v;P--)for(let I=Ne,T=P*1040+Ne;I>=Be;I--,T--){let k=Z[T];I<Ne&&Z[T+1]+1<k&&(k=Z[T+1]+1),P<Ye&&(Z[T+1040]+1<k&&(k=Z[T+1040]+1),I<Ne&&Z[T+1040+1]+Qe<k&&(k=Z[T+1040+1]+Qe),I>Be&&Z[T+1040-1]+Qe<k&&(k=Z[T+1040-1]+Qe)),Z[T]=k}};for(let v=Oe;v<=Ye;v+=64)wo(v,Math.min(Ye,v+63)),await m.yield();for(let v=Ye;v>=Oe;v-=64)yo(Math.max(Oe,v-63),v),await m.yield();const Lt=(v,K,P)=>.05*(Z[Math.min(Ye,Math.max(Oe,Math.floor(Math.hypot(v,P)/.05)))*1040+Math.min(Ne,Math.max(Be,Math.floor(-K/.05)))]/1.0824-Qe)-Re,Ze=(v,K,P,I,T,k,ae,U,ee,ce,te,se,me,ye,ge)=>{const de=(v+T+ee)/3,Ue=(K+k+ce)/3,Je=(P+ae+te)/3,rt=(I+U+se)/3,h0=(me+ye)/2,lt=Math.max(I,U,se),Dt=Math.sqrt(Math.max((v-de)**2+(K-Ue)**2+(P-Je)**2,(T-de)**2+(k-Ue)**2+(ae-Je)**2,(ee-de)**2+(ce-Ue)**2+(te-Je)**2))+(ye-me)/2*lt+Math.abs(h0)*(lt-Math.min(I,U,se));if(Lt(de+at.x*h0*rt,Ue+at.y*h0*rt,Je+at.z*h0*rt)>Dt)return!1;if(Dt<=.015||ge>=B0)return!0;const Ht=(v-T)**2+(K-k)**2+(P-ae)**2,Wt=(T-ee)**2+(k-ce)**2+(ae-te)**2,bo=(ee-v)**2+(ce-K)**2+(te-P)**2,ct=Math.max(Ht,Wt,bo);if(((ye-me)*lt)**2>ct)return Ze(v,K,P,I,T,k,ae,U,ee,ce,te,se,me,h0,ge+1)||Ze(v,K,P,I,T,k,ae,U,ee,ce,te,se,h0,ye,ge+1);if(ct===Ht){const v0=(v+T)/2,w0=(K+k)/2,y0=(P+ae)/2,g0=(I+U)/2;return Ze(v,K,P,I,v0,w0,y0,g0,ee,ce,te,se,me,ye,ge+1)||Ze(v0,w0,y0,g0,T,k,ae,U,ee,ce,te,se,me,ye,ge+1)}if(ct===Wt){const v0=(T+ee)/2,w0=(k+ce)/2,y0=(ae+te)/2,g0=(U+se)/2;return Ze(v,K,P,I,T,k,ae,U,v0,w0,y0,g0,me,ye,ge+1)||Ze(v,K,P,I,v0,w0,y0,g0,ee,ce,te,se,me,ye,ge+1)}const jt=(ee+v)/2,Xt=(ce+K)/2,Qt=(te+P)/2,Ot=(se+I)/2;return Ze(v,K,P,I,T,k,ae,U,jt,Xt,Qt,Ot,me,ye,ge+1)||Ze(jt,Xt,Qt,Ot,T,k,ae,U,ee,ce,te,se,me,ye,ge+1)},Rt=(v,K,P,I)=>{if(Lt(v.o.x+K,v.o.y+P,v.o.z+I)>v.reach+v.sway)return!1;if(!v.F){v.F=[],It.makeRotationFromQuaternion(N0).multiply(fo.makeTranslation(-De.x,-De.y,-De.z)).multiply(v.m);for(let k=0;k<v.pos.count;k++)Ke.fromBufferAttribute(v.pos,k).applyMatrix4(It),v.F.push(Ke.x,Ke.y,Ke.z,v.amp(k))}const T=v.F;for(let k=0;k<T.length;k+=12)if(Ze(T[k]+K,T[k+1]+P,T[k+2]+I,T[k+3],T[k+4]+K,T[k+5]+P,T[k+6]+I,T[k+7],T[k+8]+K,T[k+9]+P,T[k+10]+I,T[k+11],-1,1,0))return!0;return!1},_t=v=>{let K=0;for(let P=0;P<v.count;P++)K=Math.max(K,Ke.fromBufferAttribute(v,P).length());return K},st=[],nt=G.clone().sub(b),it=new t.Vector3,Fe=new t.Vector3,go=v=>Math.hypot(v.elements[0],v.elements[1],v.elements[2]),Et=(v,K,P,I,T,k,ae)=>{const U=new t.Vector3().setFromMatrixPosition(v);st.push({m:v,pos:K,amp:P,sway:I,off:T,tip:k,reach:ae*go(v),c:U,o:U.clone().sub(De).applyQuaternion(N0),F:null})};for(let v=0;v<2;v++){const K=M[v].attributes.position,P=_t(K);for(const I of r[v])Et(I,K,mo,.45,5.5,!0,P)}{const v=_t(V);let K=0;for(let P=0;P<V.count;P++)K=Math.max(K,d0(P));for(const P of q)Et(P,V,d0,K,6.5,!1,v)}for(const v of st){const K=Rt(v,0,0,0);if(await m.yield(),!K)continue;const P=Math.hypot(v.o.x,v.o.z)||1,I=v.o.x/P,T=v.o.z/P;let k=null;for(let ae=1;ae<=60&&!k;ae++){for(let U=0;U<12;U++){const ee=ae/10,ce=I*ee*Math.sin(U*Math.PI/6),te=ee*Math.cos(U*Math.PI/6),se=T*ee*Math.sin(U*Math.PI/6);if(Fe.copy(it.set(ce,te,se).applyQuaternion(Ft)).add(v.c),oe.distanceTo(Fe.x,Fe.y,Fe.z)<v.off||v.tip&&Math.hypot(Fe.x,Fe.y-41,Fe.z)<3||st.some(de=>de!==v&&Fe.distanceTo(de.c)<Math.min(v.c.distanceTo(de.c),v.reach+de.reach)-1e-9))continue;const me=Rt(v,ce,te,se);if(await m.yield(),me)continue;const ye=Math.max(0,Math.min(1,it.copy(Fe).sub(b).dot(nt)/nt.lengthSq())),ge=it.copy(b).addScaledVector(nt,ye).distanceTo(Fe);(!k||ge<k.off)&&(k={off:ge,p:Fe.clone()})}await m.yield()}k&&(v.m.setPosition(k.p),v.c.copy(k.p),v.o.copy(k.p).sub(De).applyQuaternion(N0))}}for(let z=0;z<2;z++)r[z].length&&c.push(Le(M[z],r[z],(B,R)=>{const N=B.attributes.aFx.array;for(let O=0;O<r[z].length;O++)for(let Te=0;Te<R;Te++){const Re=(O*R+Te)*4;N[Re+1]=.45,N[Re+2]=n[z][O],N[Re+3]=0}})),M[z].dispose(),await m.yield();if(q.length&&c.push(Le(E,q,(z,B)=>{const R=z.attributes.aFx.array;for(let N=0;N<q.length;N++)for(let O=0;O<B;O++)R[(N*B+O)*4+2]=L[N]})),await m.yield(),c.length){const z=new t.Mesh(ne(c),Ee);for(const B of c)B.dispose();z.frustumCulled=!1,$.add(z)}}E.dispose(),await m.yield();const le=new t.Mesh(ne(i),Ee);for(const q of i)q.dispose();return le.position.copy(De),le.frustumCulled=!1,$.add(le),le.userData.q0=new t.Quaternion().setFromUnitVectors(new t.Vector3(0,1,0),e0),le.quaternion.copy(le.userData.q0),le})();await m.yield();const oo=await(async()=>{const e=ie.kit.goose(),o=[],a=[],i=9;await m.yield();const l=[],u=new t.Vector3,d=e.attributes.position;for(let f=0;f<=1500;f++)oe.pointAt(f/1500,u),l.push(Math.hypot(u.x,u.z),u.y);const M=(f,h)=>{let s=1e18;for(let c=0;c<l.length;c+=2){const r=l[c]-f,n=l[c+1]-h,b=r*r+n*n;b<s&&(s=b)}return Math.sqrt(s)};let x=0;for(let f=0;f<d.count;f++)x=Math.max(x,Math.hypot(d.getX(f),d.getY(f),d.getZ(f)));await m.yield();for(let f=0;f<i;f++){const h=f/i*W+F.range(-.2,.2),s=9.4+2*F(),c=33.6+5.4*(f*4%i)/i+F.range(-.4,.4),r=F.range(1.3,1.6);let n=s,b=c;const G=5.5+x*r;for(;M(n,b)<G;)if(n>5.5)n-=.25;else if(b>33)b-=.25;else break;o.push(w(Math.sin(h)*n,b,Math.cos(h)*n,h+Math.PI/2,-.08,-.3,r)),a.push(F()*W)}await m.yield();const y=Le(e,o,(f,h)=>{const s=f.attributes.aFx.array;for(let c=0;c<o.length;c++)for(let r=0;r<h;r++)s[(c*h+r)*4+2]=a[c]});e.dispose();const g=new t.Mesh(y,Ee);return g.frustumCulled=!1,$.add(g),g})(),Xe=z0.length?new t.Mesh(z0[0].geometry,Ee):null;Xe&&(Xe.rotation.order="YXZ",Xe.frustumCulled=!1,Xe.scale.setScalar(.001),$.add(Xe)),await m.yield();{const e=[],o=[],a=Math.round(120*Q*ht);for(const u of[...We,ze,o0]){await m.yield();const d=Math.atan2(u.x,u.z),M=Math.cos(d),x=-Math.sin(d);for(let y=0;y<a;y++){const g=3.2+6.5*Math.pow(A(),.7),f=A.gauss()*1.5*(1.15-g/12),h=u.x+M*g+Math.sin(d)*f,s=u.z+x*g+Math.cos(d)*f;Math.hypot(h,s)<38||(e.push(h,ue(h,s),s),o.push(A(),A(),g/9.7))}}await m.yield();for(let u=0,d=Math.round(70*Q);u<d;u++){const M=F.range(Me+1.15,5.9),x=kt(M)+F.sign()*(1.8+5.2*Math.pow(F(),1.4)),y=Math.sin(M)*x,g=Math.cos(M)*x,f=F.int(14,30),h=F.range(.7,1.7);for(let s=0;s<f;s++){const c=y+F.gauss()*h*1.6*Math.cos(M)-F.gauss()*h*.6*Math.sin(M),r=g-F.gauss()*h*1.6*Math.sin(M)-F.gauss()*h*.6*Math.cos(M);Math.hypot(c,r)<38||(e.push(c,ue(c,r),r),o.push(F(),F(),F()*.9))}(u&7)===7&&await m.yield()}const i=new t.InstancedBufferGeometry;i.setAttribute("position",new t.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),3)),i.setIndex([0,1,2,0,2,3]),i.setAttribute("aBase",new t.InstancedBufferAttribute(new Float32Array(e),3)),i.setAttribute("aSeed",new t.InstancedBufferAttribute(new Float32Array(o),3)),i.instanceCount=e.length/3;const l=new t.Mesh(i,ie.kit.mat(Co,Ao));l.frustumCulled=!1,$.add(l)}await m.yield();{const e=[],o=[],a=[],i=(r,n,b,G,S,E=0,D=0,j=1,V=0)=>{e.push(r,n,b,G),o.push(E,S,F()),a.push(D,j,V)},l=(r,n,b,G)=>{const E=ue(r,n),D=new t.Vector3(ue(r-1.2,n)-ue(r+1.2,n),2*1.2,ue(r,n-1.2)-ue(r,n+1.2)).normalize();Math.hypot(r,n)>37.5&&i(r,E+.3,n,b,G,1,D.x,D.y,D.z)};for(let r=0;r<J0.length;r++){const[n,b,G]=J0[r];i(n,b,G,3.4,.5),l(n,G,5.5,.34),r%12===11&&await m.yield()}await m.yield();for(let r=0;r<We.length;r++){const n=We[r];r%6===5&&await m.yield();const b=Math.sin(n.ry),G=Math.cos(n.ry),S=(n.type===3||n.type===4?3.2:3.4)*n.s;i(n.x+b*S,n.y+2.2*n.s,n.z+G*S,4.2,.26),l(n.x+b*(S+2.6),n.z+G*(S+2.6),5.2,.4),l(n.x-b*(S+2.4),n.z-G*(S+2.4),4.2,.26)}await m.yield(),i(ze.x-Math.sin(t0)*3.6,ze.y+2,ze.z-Math.cos(t0)*3.6,4.5,.3),i(X.x,X.y+X.H+1.5,X.z,6.5,.6),i(X.x,X.y+11,X.z,17,.2);for(let r=0;r<5;r++){const n=r/5*W+.4;l(X.x+Math.sin(n)*6.5,X.z+Math.cos(n)*6.5,7.5,.34)}i(0,15.5,0,30,.12),i(0,27,0,11,.12);for(let r=0;r<6;r++){const n=r/6*W;i(Math.sin(n)*29,1.6,Math.cos(n)*29,13,.16,1)}const u=new t.InstancedBufferGeometry;u.setAttribute("position",new t.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),3)),u.setIndex([0,1,2,0,2,3]),u.setAttribute("aP",new t.InstancedBufferAttribute(new Float32Array(e),4)),u.setAttribute("aK",new t.InstancedBufferAttribute(new Float32Array(o),3)),u.setAttribute("aN",new t.InstancedBufferAttribute(new Float32Array(a),3)),u.instanceCount=e.length/4;const d=new t.Mesh(u,new t.ShaderMaterial({uniforms:{uTime:Se.uTime,uCol:{value:new t.Color(1,.56,.2)}},vertexShader:Po,fragmentShader:Go,transparent:!0,depthWrite:!1,blending:t.AdditiveBlending}));d.frustumCulled=!1,d.renderOrder=3,$.add(d),await m.yield();const M=-Math.sin(s0),x=-Math.cos(s0),y=Math.min(1/Math.tan(x0),3.2),g=[],f=[],h=(r,n,b,G,S)=>{const E=Math.min(b*y,30),D=-x,j=M;let V=null;for(let Y=0;Y<=S;Y++){const re=Y/S,we=r+M*E*re,le=n+x*E*re,q=G*(1-.45*re),L=we+D*q,z=le+j*q,B=we-D*q,R=le-j*q,N=[L,ue(L,z)+.22,z,B,ue(B,R)+.22,R,re];if(Math.hypot(we,le)<36.4||Math.hypot(we,le)>78){V=null;continue}V&&(g.push(V[0],V[1],V[2],V[3],V[4],V[5],N[0],N[1],N[2],V[3],V[4],V[5],N[3],N[4],N[5],N[0],N[1],N[2]),f.push(-1,V[6],1,V[6],-1,N[6],1,V[6],1,N[6],-1,N[6])),V=N}};for(let r=0;r<We.length;r++){const n=We[r];h(n.x,n.z,xt[n.type]*n.s,3.6*n.s,6),r%4===3&&await m.yield()}h(ze.x,ze.z,14,3.2,6),h(o0.x,o0.z,7,5,5),h(X.x,X.z,X.H,5.2,7),await m.yield();for(let r=0;r<$0.length;r++){const[n,b,G,S]=$0[r];h(n,b,G*.92,S,3),r%16===15&&await m.yield()}await m.yield();const s=new t.BufferGeometry;s.setAttribute("position",new t.BufferAttribute(new Float32Array(g),3)),s.setAttribute("uv",new t.BufferAttribute(new Float32Array(f),2));const c=new t.Mesh(s,new t.ShaderMaterial({uniforms:{uTint:{value:new t.Color(.5,.62,.96)},uK:{value:H.shK??(b0==="overcast"?.5:.85)}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:"uniform vec3 uTint; uniform float uK; varying vec2 vUv; void main(){ float a = smoothstep(1.0, 0.45, abs(vUv.x)) * smoothstep(1.0, 0.25, vUv.y) * smoothstep(0.0, 0.06, vUv.y) * uK; gl_FragColor = vec4(mix(vec3(1.0), uTint, a), 1.0); }",transparent:!0,depthWrite:!1,blending:t.MultiplyBlending,premultipliedAlpha:!0,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));c.frustumCulled=!1,c.renderOrder=1,$.add(c)}await m.yield();const et=-Math.sign(s0||1)*A.range(.34,.52),Ct=[["#7b6a5a","#d6263a"],["#8a9a55","#f2d85c"],["#b8642f","#efdcc2"]][L0],fe={uC:{value:$e.dome.center.clone()},uSunR:{value:M0.clone()},uSunCol:{value:E0.clone().lerp(new t.Color(1,1,1),.25).multiplyScalar(H.sunK)},uTop:{value:new t.Color(H.top)},uHor:{value:new t.Color(H.hor)},uLawn:{value:new t.Color(H.lawn)},uTrees:{value:new t.Color(H.trees)},uHaze:{value:R0.clone()},uVisA:{value:new t.Color(Ct[0])},uVisB:{value:new t.Color(Ct[1])},uTapDir:{value:new t.Vector3(.2,.25,1).normalize()},uBub:{value:e0.clone()},uBubH:{value:e0.clone()},uTilt:{value:new t.Matrix3},uTime:{value:0},uGrow:{value:.2},uSnow:{value:H.snow},uThaw:{value:H.thaw},uKind:{value:L0},uLand:{value:0},uHop:{value:0},uCock:{value:0},uPeer:{value:0},uVisX:{value:et+.28*(1-.3*L0)},uTap:{value:0},uSettle:{value:1},uBok:{value:H.bok??1},uWinAz:{value:Math.sign(s0||1)*.5},uWinK:{value:H.winK??.8},uSeamY:{value:10.5},uBandAz:{value:-Math.sign(s0||1)*.42},uVisDir:{value:new t.Vector3(et*.8*300,49,300).normalize()}},tt=new t.Mesh(new t.SphereGeometry($e.dome.radius,64,40),new t.ShaderMaterial({uniforms:fe,vertexShader:To,fragmentShader:qo,side:t.BackSide}));tt.position.copy($e.dome.center),tt.frustumCulled=!1,$.add(tt);let Ve=null;xe&&(Ve=new t.Mesh(new t.SphereGeometry(1,40,24),new t.ShaderMaterial({uniforms:{uK:{value:0}},transparent:!0,depthWrite:!1,blending:t.AdditiveBlending,side:t.DoubleSide,vertexShader:"varying vec3 vN, vV; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - w.xyz); gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:"uniform float uK; varying vec3 vN, vV; void main(){ float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 4.0); gl_FragColor = vec4(vec3(0.75, 0.9, 1.1) * f * uK, 1.0); }"})),Ve.position.copy($e.dome.center).addScaledVector(fe.uTapDir.value,79),Ve.scale.setScalar(.001),Ve.frustumCulled=!1,$.add(Ve)),Se.uWhite.value=new t.Color(1.1,1.1,1.13),await m.yield();const C0=qe-.115,ao=qe+.075,A0=new t.Matrix4,At=new t.Vector3,so=new t.Vector3,P0=new t.Vector3,G0=new t.Vector3,ot=new t.Vector3;let Pt=1e9,Gt=A()*W,Vt=0,Bt=0,Nt=0,Kt=0;const V0=new t.Vector3,m0=new t.Vector3,no=new t.Quaternion,io=new t.Vector3(0,1,0),Io=Ve?Ve.position.clone():null,ro=new t.Vector3(0,19,0),lo=new t.Vector3(0,8.5,0),co=new t.Vector3(et*.8*300,82,300),ho=new t.Vector3(q0.position.x,q0.position.y,q0.position.z),po=new t.Vector3,r0=[[S0-.06,12],[S0,14.2],[dt-.03,29],[dt+.01,31.5],[vt-.03,19],[vt+.02,17],[H0,36],[1,40]],uo=e=>{let o=0;for(;o<r0.length-2&&e>r0[o+1][0];)o++;return Ie(r0[o][1],r0[o+1][1],_(r0[o][0],r0[o+1][0],e))};return{scene:$,path:oe,duration:I0,title:H.title,ride:"sleigh",style:"none",camera:{fov:62,near:.3,far:700,lookAhead:15,sway:.8,bank:.22},pois:[{at:ro,from:0,to:D0*.75,weight:.7},{at:ho,from:D0-.09,to:D0+.02,weight:.3},{at:co,from:qe-.085,to:qe+.075,weight:.85,fade:.35},{at:lo,from:ft-.02,to:S0-.03,weight:.55},{at:(e,o)=>po.set(0,uo(o),0),from:S0-.06,to:H0+.02,weight:.82,fade:.2},{at:De,from:H0-.045,to:1,weight:.85,fade:.25}],portal:{shape:"circle",radius:5.5,color:"#e4f2ff",glow:.45,tilt:!0,revealDistance:60},post:{exposure:H.exp??(b0==="overcast"?.78:.79),bloom:{strength:.3,radius:.6,threshold:1.15},grade:{saturation:H.sat??1.08,contrast:H.con??1.04,tint:H.tint,shadowTint:"#14264a",vignette:.34,grain:.012,aberration:.012}},update(e,o,a,i){ie.setProgress(i),Se.uEntry.value=1-_(.05,.1,i),Se.uOpen.value=5.2*_(40,17,(1-i)*oe.length),fe.uBok.value=Ie(H.bok??1,.5,_(.22,.3,i));let l=-1;if(xe){l=(i-ao)*I0;const f=l>0&&l<14;if(f){const h=.85*Math.exp(-l/4.5)*_(0,.5,l);Se.uS.value=Math.min(1,Se.uS.value+h),Se.uSwirl.value+=.85*4.5*(1-Math.exp(-l/4.5)),ie.parts.bubble.scale.setScalar(1+.05*Math.sin(l*38)*Math.exp(-l*1.6));const s=l/2.2;Ve.scale.setScalar(4+170*s),Ve.material.uniforms.uK.value=.55*_(0,.1,s)*(1-_(.5,1,s))}else ie.parts.bubble.scale.setScalar(1);f&&l<2.2||(Ve.scale.setScalar(.001),Ve.material.uniforms.uK.value=0)}const u=Se.uS.value,d=be(i/wt,0,1),M=70*Yt*Math.pow(.2,d*2.5)*Math.cos(Math.PI*d*2.5)*(1-_(.8,1,d));Math.abs(M-Pt)>1e-5&&(Pt=M,A0.makeRotationZ(M),ie.setBubbleDir(At.copy(e0).transformDirection(A0)),fe.uBub.value.copy(At),Se.uSunDir.value.copy(so.copy(M0).transformDirection(A0)),fe.uTilt.value.setFromMatrix4(A0.makeRotationZ(-M))),ie.update(e,o,a);{const f=$e.dome.center,h=$e.dome.radius;ot.setFromMatrixPosition(a.matrixWorld),P0.copy(f).addScaledVector(fe.uBub.value,h-6).sub(ot),G0.copy(ot).sub(f);const s=P0.lengthSq(),c=2*G0.dot(P0),r=G0.lengthSq()-h*h,n=c*c-4*s*r;s>.001&&n>0&&r<0?fe.uBubH.value.copy(G0).addScaledVector(P0,(-c+Math.sqrt(n))/(2*s)).normalize():fe.uBubH.value.copy(fe.uBub.value)}const x=_(C0,C0+.04,i);fe.uTime.value=o,fe.uGrow.value=.22+.78*i,fe.uSettle.value=1-_(0,wt*1.4,i)+.06*Math.sin(o*.23),fe.uLand.value=x,fe.uHop.value=be((i-C0-.05)/.022,0,1)+be((i-C0-.085)/.022,0,1);const y=xe&&l>-.5&&l<.4?Math.sin((l+.5)/.9*Math.PI):0;if(fe.uCock.value=x*(.12*Math.sin(o*1.3)*Math.sin(o*.37)+.55*_(qe-.015,qe+.01,i)-.5*y),fe.uPeer.value=_(qe+.01,qe+.06,i)*(1-.5*_(qe+.2,qe+.3,i))+.6*y,fe.uTap.value=l>0?be(l/1.8,0,1):0,Gt+=e*W*(1/12+11/12*u*u),Vt+=e*5*u*u,Bt+=e*(.1+1*u),q0.rotation.z=Gt,Kt+=e*(.1+.25*u),oo.rotation.y=.9+Kt,Xe){const f=_(qe-9/oe.length,qe+9/oe.length,i)*(1-_(mt-10/oe.length,mt+10/oe.length,i)),h=Math.min(1,i+25/oe.length);oe.pointAt(h,V0),oe.tangentAt(h,m0),Xe.scale.setScalar(Math.max(.001,1.75*f));const s=(i-ft)*60;Xe.position.set(V0.x-m0.z*s,V0.y-4.2+.5*Math.sin(o*.9),V0.z+m0.x*s),Xe.rotation.set(-.06+.06*Math.sin(o*.7),Math.atan2(-m0.z,m0.x)-.35,.1*Math.sin(o*.8))}Nt+=e*(.11+.5*u),zt.quaternion.multiplyQuaternions(zt.userData.q0,no.setFromAxisAngle(io,Nt));for(const f of qt){const h=f.userData;f.rotation.y=h.base+Vt*h.k+.35*(1-u)*Math.sin(o*.7+h.ph)}const g=1-_(.04,.09,i);for(let f=0;f<z0.length;f++){const h=z0[f],s=h.userData,c=34/(s.r+8),r=s.ph+Bt*c*s.k,n=Math.sin(o*.5*s.k+s.w);h.scale.setScalar(s.sc*Math.max(.001,1-(f?g*_(-.25,.35,Math.cos(r-Me)):0))),h.position.set(Math.sin(r)*s.r,s.y+1.6*n,Math.cos(r)*s.r),h.rotation.set(-.12*Math.cos(o*.5*s.k+s.w)-.1*u,r+Math.PI/2+.15*Math.sin(o*.33+s.w),-(.12+.4*u)+.1*Math.sin(o*.8+s.w))}},dispose(){ie.dispose?.()}}}};export{Eo as default};
