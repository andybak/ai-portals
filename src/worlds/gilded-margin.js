import*as r from"three";import{makePath as jt,clamp as D0,lerp as _0,smoothstep as y0,bell as Ge}from"../kit/core.js";import*as Xt from"../kit/fx.js";import{mergeGeometries as Zt}from"three/addons/utils/BufferGeometryUtils.js";import{buildHero as Qt}from"../parts/gilded-margin.js";const F0=Math.PI*2,ut=["#EADBB8","#CDB98C","#1F3F9A","#2F7D5B","#C7361F","#3B2A1A","#E8B33A"],pt=!0,fe=120,ue=500,ht=372;function T(v,C){let _=1.1*Math.sin(v*.023+1.3)*Math.sin(C*.019+.4)+.5*Math.sin(v*.051+C*.037+2);const p=y0(55,0,C);_+=5*p*p;const H=y0(430,505,v);return _+=H*H*2.5,_}const vt=`
uniform float uTime, uGust, uU, uCandleI, uFlare;
uniform vec3 uCandleDir, uCandleCol, uShadowCol, uSepia, uWhite, uPaint, uGold;
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y); }
float pageH(vec2 p){
  float h = 1.1 * sin(p.x * 0.023 + 1.3) * sin(p.y * 0.019 + 0.4) + 0.5 * sin(p.x * 0.051 + p.y * 0.037 + 2.0);
  float n = smoothstep(55.0, 0.0, p.y); h += 5.0 * n * n;
  float e = smoothstep(430.0, 505.0, p.x);
  h += e * e * (2.5 + 1.8 * sin(uTime * 0.6 + p.y * 0.012) + uGust * (6.0 + 3.0 * sin(p.y * 0.02 + uTime * 1.7)));
  return h;
}
float ink(float edge, float d, float px){ return 1.0 - smoothstep(edge - px, edge + px, d); }
`,Yt=vt+`
#include <fog_pars_vertex>
`,B0=`
#ifdef SHADOW
  { float ly = max(uCandleDir.y, 0.2); vec2 g = w.xz - uCandleDir.xz * (max(w.y - pageH(w.xz), 0.0) / ly);
    w.xyz = vec3(g.x, pageH(g) + 0.16, g.y); }
#endif
  vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
`,Jt=vt+`
#include <fog_pars_fragment>
// gold leaf: dull ochre under the dark room, a mirror for the candle, tooled with punch-dots
vec3 goldLeaf(vec3 N, vec3 V, vec2 uv, float flare){
  vec2 q = uv; q.x += 0.5 * mod(floor(q.y), 2.0); vec2 id = floor(q), f = fract(q) - 0.5; float r = length(f);
  float dim = smoothstep(0.36, 0.30, r);
  vec3 N2 = normalize(N + vec3(f.x, f.y, -f.x) * dim * 1.3 + 0.05 * vec3(sin(uv.x * 0.9 + uv.y * 0.4), sin(uv.y * 1.3), 0.0));
  vec3 R = reflect(-V, N2);
  vec3 col = uGold * vec3(1.0, 0.86, 0.9) * (0.27 + 0.2 * smoothstep(0.25, -0.6, R.y));
  col *= 1.0 - 0.35 * dim * smoothstep(0.08, 0.3, r);
  float c = max(dot(R, uCandleDir), 0.0);
  col += vec3(1.0, 0.74, 0.32) * uCandleCol * uCandleI * (smoothstep(0.95, 0.997, c) * 3.5 + c * c * c * c * c * c * 0.4);
  float h = hash(id + 3.0), tw = pow(max(0.0, sin(uTime * (2.5 + 5.0 * h) + h * 50.0)), 16.0);
  col += vec3(1.0, 0.5, 0.08) * flare * (0.35 + 0.9 * max(dot(N, V), 0.0)) + vec3(1.0, 0.9, 0.6) * flare * dim * tw * 5.0;
  return col;
}
`,b0=`
#ifdef SHADOW
  { gl_FragColor = vec4(uShadowCol, 1.0);
  #include <fog_fragment>
  }
  return;
#endif
`,S0=`
  #ifdef USE_FOG
  { float mh = smoothstep(100.0, 320.0, vFogDepth) * 0.6; float ml = dot(gl_FragColor.rgb, vec3(0.3, 0.6, 0.1));
    gl_FragColor.rgb = mix(gl_FragColor.rgb, mix(vec3(ml), fogColor, 0.55), mh); }
  #endif
  #include <fog_fragment>
`,eo=`
varying vec2 vQ; varying vec3 vW; varying float vWall;
void main(){
  float s = position.x, z = position.z; vec3 P;
  if (s >= 0.0) { P = vec3(s, pageH(vec2(s, z)), z); vWall = 0.0; }
  else {
    float R = 70.0, th = min(-s / R, 1.5708), ext = max(-s - R * 1.5708, 0.0);
    P = vec3(-R * sin(th) + 2.5 * sin(z * 0.021 + ext * 0.017) * smoothstep(0.0, 60.0, ext), R * (1.0 - cos(th)) + ext + pageH(vec2(0.0, z)), z);
    vWall = th / 1.5708;
  }
  vQ = vec2(s, z); vW = P; vec4 w = vec4(P, 1.0);
  vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,to=`
uniform vec3 uVellum, uLapis, uVerm, uVine, uPageTint, uBeamCol;
uniform vec4 uInk, uBeam, uPaw[6];
uniform float uSeason, uBlockFlare, uHeroXZ, uBarG;
varying vec2 vQ; varying vec3 vW; varying float vWall;
float lineAA(float d, float w, float px){ float ww = max(w, px * 0.7); return (1.0 - smoothstep(ww - px, ww + px, d)) * clamp(w / max(px * 0.7, 1e-4), 0.35, 1.0); }
// a painted bar: gold leaf and pigment, counter-changed along its length, with gold lozenge nodes at the joints
// d = signed offset across the bar (m), al = metres along it
vec3 barPaint(vec3 col, float d, float al, float px, vec3 gcol, float amt){
  float bd = abs(d), seg = floor(al / 16.0), jd = abs(al - seg * 16.0 - 8.0), odd = mod(seg, 2.0);
  float isGold = abs(step(0.0, d) - odd);
  vec3 pc = mod(seg, 4.0) < 1.5 ? uLapis * 1.3 : uVerm;
  pc = mix(pc, uWhite, ink(0.2, length(vec2(bd - 0.64, mod(al, 1.5) - 0.75)), px) * step(fract(al / 6.0), 0.75));
  vec3 bc = mix(pc, gcol, isGold);
  bc = mix(bc, uSepia, max(lineAA(bd, 0.07, px), smoothstep(1.12 - px, 1.12 + px, bd)));
  col = mix(col, bc, (1.0 - smoothstep(1.3 - px, 1.3 + px, bd)) * amt);
  float lz = bd + (8.0 - jd) * 0.75 - 2.5;
  col = mix(col, gcol, ink(0.0, lz, px) * amt);
  col = mix(col, uSepia, lineAA(abs(lz), 0.1, px) * amt);
  col = mix(col, uVerm, ink(0.5, length(vec2(bd, 8.0 - jd)), px) * amt);
  return col;
}
// pen spraywork beside a bar: hairline curls that end in a gold bezant and a three-lobed ivy leaf
// ox = distance from the bar (m), al = metres along it
vec3 spray(vec3 col, float ox, float al, float reach, float px, vec3 gcol, float seed, float amt){
  float fade = (1.0 - smoothstep(reach - 5.0, reach, ox)) * amt * (1.0 - 0.7 * smoothstep(0.45, 1.5, px));
  float sw = ox + 1.3 * sin(al * 0.33 + seed) + 1.2 * sin(al * 0.11 + 2.0 + seed);
  col = mix(col, uSepia, lineAA(abs(mod(sw, 9.0) - 4.5), 0.08, px) * 0.6 * fade * step(ox, 26.0));
  vec2 c = vec2(ox, al) / 9.0; c.y += 0.5 * mod(floor(c.x), 2.0);
  vec2 id = floor(c) + seed * 13.0, f = fract(c) - 0.5;
  float h = hash(id), h2 = hash(id + 17.3);
  if (h2 < mix(0.86, 0.5, smoothstep(4.0, 40.0, ox))) {
    vec2 d = (f - (vec2(h, hash(id + 5.7)) - 0.5) * 0.2) * 9.0; float r = length(d), th = -h * 6.2832, rr = 2.2 + 1.1 * h2;
    float a = atan(d.y, d.x + 1e-5) - th;
    col = mix(col, uSepia, lineAA(abs(r - rr), 0.09, px) * step(cos(a), 0.697) * 0.85 * fade);
    vec2 e1 = rr * vec2(cos(th + 0.8), sin(th + 0.8)), e2 = rr * vec2(cos(th - 0.8), sin(th - 0.8));
    float db = length(d - e1);
    col = mix(col, gcol, ink(1.0, db, px) * fade);
    col = mix(col, uSepia, lineAA(abs(db - 1.0), 0.1, px) * fade);
    vec2 t = d - e2; float tr = length(t), ta = atan(t.y, t.x + 1e-5) - th, lobe = tr - 1.5 * (0.6 + 0.4 * cos(3.0 * ta));
    float hc = hash(id + 2.9);
    vec3 tc = hc < 0.4 ? uLapis * 1.3 : (hc < 0.75 ? uVerm : uVine);
    col = mix(col, tc * mix(0.7, 1.0, step(0.0, sin(ta))), ink(0.0, lobe, px) * fade);
    col = mix(col, uSepia, lineAA(abs(lobe), 0.09, px) * fade);
    col = mix(col, uWhite, ink(0.2, tr, px) * fade);
  }
  return col;
}
void main(){
  vec2 q = vQ; float px = max(fwidth(q.x), fwidth(q.y));
  // the deckled edges of the leaf
  float dk = 3.0 * vnoise(q * 0.11) + 1.2 * vnoise(q * 0.47);
  if (q.x > 499.0 + dk || q.y < 1.0 - 4.0 + dk || q.y > 719.0 + dk || q.x < -326.0 + dk * 2.0) discard;
  vec3 col = uVellum;
  col *= 0.93 + 0.07 * vnoise(q * 0.03) + 0.05 * vnoise(q * 0.14);
  // hair follicles
  vec2 fq = q * 1.4, fi = floor(fq), ff = fract(fq) - 0.5 - (vec2(hash(fi), hash(fi + 9.1)) - 0.5) * 0.6;
  col *= 1.0 - 0.13 * smoothstep(0.17, 0.06, length(ff)) * step(0.5, hash(fi + 7.0)) * clamp(0.22 / max(px, 1e-4), 0.0, 1.0);
  // show-through of the writing on the other side
  float rowz = mod(q.y - 60.0, 14.0);
  float band = smoothstep(3.2, 1.6, abs(rowz - 7.0)) * step(54.0, q.y) * step(q.y, 690.0);
  float xs = abs(q.x) ; float inX = smoothstep(36.0, 44.0, xs) * smoothstep(338.0, 330.0, xs);
  float strokes = smoothstep(0.1, 0.6, sin(q.x * 2.1 + 2.0 * vnoise(q * 0.2)) ) * step(0.33, vnoise(vec2(q.x * 0.07, floor((q.y - 60.0) / 14.0) * 3.1)));
  float wallK = step(q.x, 0.0), rowi = floor((q.y - 60.0) / 14.0);
  float sAmt = band * inX * strokes * clamp(0.6 / max(px, 1e-4), 0.0, 1.0);
  float words = smoothstep(0.26, 0.4, vnoise(vec2(q.x * 0.045, rowi * 3.1)));
  float wAmt = smoothstep(4.8, 1.6, abs(rowz - 7.0)) * step(54.0, q.y) * step(q.y, 690.0) * inX * words * (0.5 + 0.5 * smoothstep(-0.5, 0.6, sin(q.x * 1.7 + 2.0 * vnoise(q * 0.2))));
  col = mix(col, col * vec3(0.5, 0.47, 0.45), mix(sAmt * 0.09, wAmt * 0.62, wallK));
  if (q.x < -50.0) {
    // ghosts of the painted panels on the other side of the facing leaf
    for (int i = 0; i < 2; i++) {
      vec3 gp = i == 0 ? vec3(338.0, 128.0, 44.0) : vec3(642.0, 112.0, 36.0);
      vec2 g = (vec2(q.y, -q.x - 40.0) - gp.xy) / gp.z + 0.06 * (vec2(vnoise(q * 0.07), vnoise(q * 0.07 + 9.0)) - 0.5);
      float m = max(abs(g.x), abs(g.y)), inP = smoothstep(1.06, 0.92, m);
      vec3 gc = mix(uVerm, uLapis * 1.3, smoothstep(0.74, 0.84, m));
      float ro = length(g * vec2(1.14, 1.0));
      gc = mix(gc, uLapis * 1.3, smoothstep(0.5, 0.42, ro));
      gc = mix(gc, uGold * 0.55, smoothstep(0.14, 0.06, abs(ro - 0.58)));
      col = mix(col, gc, inP * (0.19 + 0.07 * vnoise(q * 0.21)));
    }
  }
  if (q.x > 0.0) {
    // drypoint ruling
    float rd = min(min(rowz, abs(rowz - 5.0)), 14.0 - rowz);
    float rule = lineAA(rd, 0.07, px) * step(40.0, q.x) * step(q.x, 472.0) * step(50.0, q.y) * step(q.y, 596.0);
    float vd = min(min(abs(q.x - 50.0), abs(q.x - 330.0)), min(abs(q.x - 341.0), abs(q.x - 459.0)));
    rule = max(rule, lineAA(vd, 0.07, px) * step(20.0, q.y));
    col *= 1.0 - 0.17 * rule;
    // margin strip: winter's blue diaper, and red rules round it
    float inM = step(344.0, q.x) * step(q.x, 456.0) * step(30.0, q.y) * step(q.y, 594.0);
    if (uSeason > 2.5 && inM > 0.5) {
      vec2 dq = vec2(q.x + q.y, q.x - q.y) * 0.7071 / 7.0, df = fract(dq) - 0.5, di = floor(dq);
      vec3 dcol = mix(uLapis * 1.25, uLapis * 1.6, mod(di.x + di.y, 2.0));
      dcol = mix(dcol, uWhite, lineAA((0.5 - max(abs(df.x), abs(df.y))) * 7.0, 0.12, px));
      dcol = mix(dcol, uWhite, ink(0.3, length(df) * 7.0, px));
      col = mix(col, dcol, 0.42);
    }
    float md = min(min(abs(q.x - 344.0), abs(q.x - 456.0)), min(abs(q.y - 30.0), abs(q.y - 594.0)));
    col = mix(col, uVerm, lineAA(md, 0.28, px) * step(343.5, q.x) * step(q.x, 456.5) * step(29.5, q.y) * step(q.y, 594.5) * 0.85);
    // the illumination painted on the page itself: bar borders down both sides of the margin with pen spraywork,
    // bezants and ivy between them, and a bar frame that grows out of the Great Initial round the lines it heads
    bool inMar = q.x > 334.0 && q.x < 492.0 && q.y > 34.0 && q.y < 595.5;
    bool inBlk = q.x > 134.0 && q.x < 340.0 && q.y > 430.0 && q.y < 596.0;
    if (inMar || inBlk) {
      vec3 Vv = normalize(cameraPosition - vW);
      float gw = max(sin(q.y * 0.045 + q.x * 0.03 - uTime * 0.8), 0.0); gw *= gw; gw *= gw;
      vec3 gcol = goldLeaf(vec3(0.0, 1.0, 0.0), Vv, q * 1.1, 0.1 * gw + 0.5 * uFlare * step(q.x, 340.0)) + uGold * 0.36;
      if (inMar) {
        float sx = q.x < 399.0 ? 1.0 : -1.0, bx = q.x < 399.0 ? 364.5 : 433.5, ox = (q.x - bx) * sx;
        float reach = ox > 0.0 ? 36.0 : (sx > 0.0 ? 23.0 : 56.0), inZ = step(56.0, q.y) * step(q.y, 593.0);
        if (abs(ox) > 1.3) col = spray(col, abs(ox), q.y, reach, px, gcol, sx + sign(ox) * 0.37, inZ * step(abs(ox), reach));
        col = barPaint(col, ox, q.y - 56.0, px, gcol, inZ);
      }
      if (inBlk && uBarG > 0.001) {
        float xm = 138.0 + 199.0 * uBarG, tip = 1.0 - smoothstep(xm - 3.0, xm, q.x);
        float dn = 445.6 - q.y, ds = q.y - 584.4, on = step(138.0, q.x) * tip;
        if (dn > 1.3) col = spray(col, dn, q.x, 13.0, px, gcol, 3.1, on * step(dn, 13.0));
        if (ds > 1.3) col = spray(col, ds, q.x, 10.0, px, gcol, 4.3, on * step(ds, 10.0));
        col = barPaint(col, dn, q.x - 138.0, px, gcol, on);
        col = barPaint(col, ds, q.x - 138.0, px, gcol, on);
        col = barPaint(col, q.x - 138.2, q.y - 445.6, px, gcol, step(444.3, q.y) * step(q.y, 585.7) * smoothstep(0.0, 0.05, uBarG));
      }
    }
    // the wave border, painted flat under the standing scallops
    float wb = smoothstep(598.0, 598.6, q.y + 0.6 * sin(q.x * 0.9)) * smoothstep(622.0, 621.4, q.y + 0.6 * sin(q.x * 0.9 + 2.0));
    if (wb > 0.0) {
      float r = floor((q.y - 598.0) / 4.0), dir = mod(r, 2.0) * 2.0 - 1.0;
      vec2 sc = vec2(q.x / 5.0 + dir * uTime * 0.22 + r * 0.37, fract((q.y - 598.0) / 4.0));
      float d = length(vec2(fract(sc.x) - 0.5, sc.y * 0.8));
      vec3 wc = mix(uLapis * 0.7, uLapis, step(d, 0.46));
      wc = mix(wc, uWhite, lineAA(abs(d - 0.46) * 5.0, 0.13, px));
      wc = mix(wc, uWhite, ink(0.3, length(vec2(fract(sc.x) - 0.5, sc.y - 0.3) * vec2(5.0, 4.0)), px) * 0.9);
      col = mix(col, wc * uPaint, wb);
      col = mix(col, uSepia, lineAA(min(abs(q.y + 0.6 * sin(q.x * 0.9) - 598.3), abs(q.y + 0.6 * sin(q.x * 0.9 + 2.0) - 621.7)), 0.2, px));
    }
    // the lines the Initial heads, written flat on the page: textura minims with lozenge feet, a few words rubricated
    if (q.x > 146.0 && q.x < 331.0 && q.y > 452.0 && q.y < 578.0) {
      float rz = mod(q.y - 452.0, 14.0) - 7.0, ri = floor((q.y - 452.0) / 14.0);
      float cx = q.x / 2.8 + ri * 0.37, cf = (fract(cx) - 0.5) * 2.8;
      float word = smoothstep(0.3, 0.34, vnoise(vec2(q.x * 0.1, ri * 3.7 + 1.0))) * step(q.x, 330.0 - 60.0 * step(0.6, hash(vec2(ri, 4.0))) * hash(vec2(ri, 8.0)));
      float d = max(abs(cf) - 0.5, abs(rz) - 2.4);
      d = min(d, abs(cf + sign(rz) * 0.3) + abs(abs(rz) - 2.25) - 0.9);
      float m = 1.0 - smoothstep(-px, px, d);
      m = mix(m, 0.42 * step(abs(rz), 2.9), smoothstep(0.6, 1.5, px)) * word;
      float rw = hash(vec2(floor(q.x * 0.1 * 0.5 + ri * 0.7), ri + 5.0));
      vec3 ic = rw > 0.9 ? uVerm : (rw < 0.07 ? uLapis * 1.3 : vec3(0.05, 0.034, 0.024));
      col = mix(col, ic, m * 0.93);
    }
    // the quill's line: wet black with a bleeding halo behind the nib, drying to sepia
    if (q.y > uInk.y && q.y < uInk.x) {
      float cx = ${ht.toFixed(1)} + 5.0 * sin(q.y * 0.035 + uInk.z), sl = 0.175 * cos(q.y * 0.035 + uInk.z);
      float d = abs(q.x - cx) / sqrt(1.0 + sl * sl), wet = 1.0 - clamp((q.y - uInk.y) / 110.0, 0.0, 1.0);
      float nibT = smoothstep(0.0, 2.5, q.y - uInk.y);
      float wob = 0.75 + 0.25 * vnoise(q * 0.9);
      col = mix(col, uSepia * 0.8, smoothstep(0.75 + 2.6 * wet + px, 0.75, d / wob) * 0.5 * wet * nibT);
      col = mix(col, mix(uSepia, vec3(0.012, 0.01, 0.012), wet), ink(0.75 * nibT, d, px) * 0.96);
    }
    // rare: a cat has walked across the page
    for (int i = 0; i < 6; i++) {
      vec4 pw = uPaw[i];
      if (pw.z > 0.001) {
        vec2 d = (q - pw.xy) / 15.0; float cs = cos(pw.w), sn = sin(pw.w); d = vec2(d.x * cs - d.y * sn, d.x * sn + d.y * cs);
        float dm = length((d - vec2(0.0, 0.22)) * vec2(1.0, 1.25)) - 0.47;
        for (int k = 0; k < 4; k++) { float a = -0.9 + 0.6 * float(k); dm = min(dm, length(d - vec2(sin(a) * 0.74, -cos(a) * 0.62 + 0.1)) - 0.19); }
        float grow = smoothstep(0.0, 0.5, pw.z), dry = smoothstep(0.5, 1.0, pw.z);
        dm += (1.0 - grow) * 0.3 + 0.03 * vnoise(q * 0.7);
        col = mix(col, uSepia * 0.8, smoothstep(0.14, 0.0, dm) * 0.4 * (1.0 - dry * 0.7) * grow);
        col = mix(col, mix(vec3(0.012, 0.01, 0.012), uSepia * 0.75, dry), smoothstep(0.02, 0.0, dm) * 0.95);
      }
    }
  }
  // light: the candle lifts the page toward it, cockles take 10 % shading, the flaring gold warms the vellum
  vec2 xz = vW.xz; float hx = pageH(xz + vec2(1.5, 0.0)) - pageH(xz), hz = pageH(xz + vec2(0.0, 1.5)) - pageH(xz);
  vec3 n = normalize(mix(vec3(-hx / 1.5, 1.0, -hz / 1.5), vec3(1.0, 0.0, 0.0), vWall));
  float lit = dot(n, uCandleDir) - uCandleDir.y * (1.0 - vWall);
  col *= (1.0 + clamp(lit * 1.1, -0.12, 0.10)) * (0.955 + 0.06 * (uCandleI - 1.0) * 4.0 * 0.25 + 0.045 * smoothstep(0.0, 500.0, vW.x));
  col *= uPageTint;
  col *= mix(vec3(1.0), vec3(0.80, 0.75, 0.62), vWall * smoothstep(25.0, 260.0, vW.y));
  col *= 1.0 - 0.3 * smoothstep(165.0, 290.0, vW.y);
  { vec2 hs = vec2((vW.z - 500.0) / 150.0, (vW.y - 50.0) / 115.0); col *= 1.0 + 0.18 * vWall * exp(-dot(hs, hs)) * uCandleI; }
  col *= mix(vec3(0.975, 0.965, 0.955), vec3(1.02, 1.0, 0.95), smoothstep(200.0, 500.0, vW.x) * (1.0 - vWall));
  if (uBeam.z > 0.0) {
    vec2 b = xz - uBeam.xy; float cs = cos(uBeam.w), sn = sin(uBeam.w); b = vec2(b.x * cs - b.y * sn, b.x * sn + b.y * cs);
    float lx = abs(abs(b.x) - 17.0) - 12.0 * (1.0 - smoothstep(30.0, 62.0, b.y) * 0.999);
    float beam = smoothstep(2.5, -2.5, lx) * smoothstep(-70.0, -64.0, b.y) * step(q.x, 500.0) * (1.0 - vWall);
    beam *= 1.0 - 0.6 * lineAA(abs(mod(b.y + 70.0, 22.0) - 11.0), 0.7, px);
    col = col * (1.0 + 0.3 * beam * uBeam.z) + uBeamCol * 0.05 * beam * uBeam.z + vec3(0.1, 0.22, 0.5) * 0.16 * beam * (1.0 - beam) * 4.0 * uBeam.z;
  }
  vec4 hq = vec4((vW.x - 185.0) / 120.0, (vW.z - 500.0) / 85.0, (vW.z - 500.0) / 110.0, (vW.y - 60.0) / 110.0); hq *= hq;
  float hg = exp(-hq.x - hq.y) * step(119.0, vW.x) + 0.55 * vWall * exp(-hq.z - hq.w);
  col += vec3(1.0, 0.56, 0.2) * 0.2 * uFlare * hg * (0.92 + 0.08 * sin(uTime * 9.0) * sin(uTime * 5.3));
  col += vec3(1.0, 0.6, 0.22) * 0.25 * uBlockFlare * exp(-dot(vW.xz - vec2(uHeroXZ, 298.0), vW.xz - vec2(uHeroXZ, 298.0)) / 500.0);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,oo=`
uniform vec3 uRoom, uRoomGlow, uCandleDir, uCandleCol, uWin; uniform float uTime, uCandleI, uHour, uShelf;
varying vec3 vD;
float hash1(float n){ return fract(sin(n * 91.345) * 47453.5453); }
float rh(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float rn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(rh(i), rh(i + vec2(1.0, 0.0)), f.x), mix(rh(i + vec2(0.0, 1.0)), rh(i + vec2(1.0, 1.0)), f.x), f.y); }
void main(){
  vec3 d = normalize(vD);
  vec3 c = normalize(uCandleDir), rt = normalize(cross(vec3(0.0, 1.0, 0.0), c)), up = cross(c, rt);
  float fz = dot(d, c); vec2 t = vec2(dot(d, rt), dot(d, up)) / max(fz + 1.0, 0.2) * 2.0;   // stereographic, about the light
  float a = length(t) + step(fz, -0.5) * 4.0;
  vec3 col = uRoom * (0.75 + 0.5 * smoothstep(-0.6, 0.5, d.y)) + uRoomGlow * (exp(-a * 2.2) * 0.55 + 0.06 * smoothstep(0.1, -0.5, d.y) * exp(-a * 0.8));
  // the scriptorium, far out of focus: bays of shelved books between piers, a tall window, the desk below
  float azm = atan(d.z, d.x + 1e-5), elv = asin(clamp(d.y, -1.0, 1.0));
  float bandS = smoothstep(-0.1, 0.02, elv) * smoothstep(0.9, 0.5, elv);
  float se = elv / 0.15, sh = floor(se), sf = fract(se);
  float spine = rn(vec2(azm * 30.0, sh * 7.3)) * 0.6 + rn(vec2(azm * 75.0, sh * 3.1)) * 0.4;
  vec3 sc = mix(vec3(0.42, 0.16, 0.07), vec3(0.16, 0.2, 0.12), rn(vec2(azm * 11.0 + 3.0, sh * 1.7)));
  sc = mix(sc, vec3(0.3, 0.24, 0.14), rn(vec2(azm * 19.0, sh * 5.1)));
  float pier = smoothstep(0.03, 0.12, abs(fract(azm / 0.9) - 0.5));
  // (the flight looks south down the margin for a third of its length: that side of the room is given more of the glow)
  float southK = smoothstep(-0.25, 0.75, d.z) * smoothstep(-0.9, 0.2, d.x) * (uHour > 0.5 && uHour < 1.5 ? 0.3 : 1.0), shelfK = uShelf * (1.0 + 1.9 * southK);
  col += sc * shelfK * bandS * pier * smoothstep(0.0, 0.14, sf) * smoothstep(1.0, 0.78, sf) * (0.25 + 0.75 * spine) * (0.3 + 0.7 * exp(-a * 0.8) + 0.45 * southK);
  col += vec3(0.3, 0.15, 0.06) * shelfK * smoothstep(-0.02, -0.5, d.y) * (0.25 + 0.75 * exp(-a * 0.6)) * (0.6 + 0.4 * rn(vec2(azm * 3.0, elv * 40.0)));
  col += uRoomGlow * southK * (0.2 * exp(-elv * elv / 0.05) + 0.07 * smoothstep(0.9, 0.0, elv));
  // three great soft discs of light, far out of focus, drifting on that side
  vec3 bk = vec3(0.0);
  { vec3 b0 = normalize(vec3(0.55 + 0.05 * sin(uTime * 0.11), 0.26, 0.8)); float r0 = 0.2, d0 = length(d - b0);
    bk += vec3(0.075) * smoothstep(r0, r0 * 0.86, d0) * (0.65 + 0.35 * smoothstep(r0 * 0.7, r0 * 0.95, d0));
    vec3 b1 = normalize(vec3(-0.12, 0.4 + 0.03 * sin(uTime * 0.13 + 1.0), 0.9)); float r1 = 0.15, d1 = length(d - b1);
    bk += vec3(0.06) * smoothstep(r1, r1 * 0.86, d1) * (0.65 + 0.35 * smoothstep(r1 * 0.7, r1 * 0.95, d1));
    vec3 b2 = normalize(vec3(-0.62, 0.2, 0.75 + 0.05 * sin(uTime * 0.09 + 2.0))); float r2 = 0.25, d2 = length(d - b2);
    bk += vec3(0.05) * smoothstep(r2, r2 * 0.86, d2) * (0.65 + 0.35 * smoothstep(r2 * 0.7, r2 * 0.95, d2)); }
  col += (uRoomGlow * 1.4 + uCandleCol * 0.35) * bk * (uHour > 0.5 && uHour < 1.5 ? 0.4 : 1.0);
  vec3 wd = normalize(vec3(0.3, 0.42, 1.0)), wr = normalize(cross(vec3(0.0, 1.0, 0.0), wd)), wu = cross(wd, wr);
  float wf = dot(d, wd); vec2 wt = vec2(dot(d, wr), dot(d, wu)) / max(wf, 0.05);
  float wl = smoothstep(0.15, 0.0, abs(wt.x)) * smoothstep(-0.4, -0.2, wt.y) * smoothstep(0.0, 0.22, 0.4 - abs(wt.x) * 2.4 - wt.y) * step(0.2, wf); wl *= wl;
  col += uWin * wl * (0.7 + 0.3 * smoothstep(0.01, 0.03, abs(mod(wt.y + 0.36, 0.17) - 0.085)));
  if (uHour < 0.5 || uHour > 1.5) {
    // the candle flame, far out of focus: an amber orb with a paler core, and a wisp of smoke at dawn
    float e = length(t * vec2(1.0, 0.72) - vec2(0.0, 0.012));
    float r0 = uHour > 1.5 ? 0.07 : 0.105;
    col += uCandleCol * uCandleI * (smoothstep(r0, r0 * 0.62, e) * 1.25 + smoothstep(r0 * 0.6, 0.0, e) * 1.3 + exp(-e * 9.0) * 0.5);
    if (uHour > 1.5) {
      float sy = max(t.y - 0.08, 0.0), sx = t.x - 0.05 * sin(sy * 9.0 - uTime * 1.1) * sy * 3.0 - 0.03 * sin(sy * 21.0 - uTime * 1.9) * sy;
      col += vec3(0.5, 0.42, 0.45) * 0.3 * exp(-sx * sx / (0.0008 + sy * 0.012)) * smoothstep(0.0, 0.08, sy) * smoothstep(0.9, 0.2, sy);
      col += vec3(0.9, 0.42, 0.4) * 0.3 * exp(-(d.y + 0.02) * (d.y + 0.02) / 0.0256) * smoothstep(-0.2, 0.8, fz);   // first light along the sill
    }
  } else {
    // a cloister window: two blurred lancets of cool daylight
    float ty = t.y - 0.28;                         // the lancets stand high, out of the level view
    float lx = abs(abs(t.x) - 0.11) - 0.075 * (1.0 - smoothstep(0.1, 0.36, ty) * 0.999);
    float win = smoothstep(0.075, -0.065, lx) * smoothstep(-0.44, -0.2, ty) * step(-0.5, fz);
    win *= 0.85 + 0.15 * smoothstep(0.0, 0.05, abs(mod(ty + 0.36, 0.14) - 0.07));
    col += uCandleCol * (min(win, 0.85) * 0.78 + exp(-a * 3.0) * 0.16);
    float sd = max(-ty - 0.2, 0.0), sx = (abs(t.x) - 0.11) / (0.09 + 0.3 * sd);
    col += uCandleCol * 0.13 * exp(-sx * sx) * smoothstep(0.0, 0.25, sd) * smoothstep(2.2, 0.5, sd) * (0.8 + 0.2 * rn(vec2(t.x * 9.0 + uTime * 0.05, t.y * 2.0 - uTime * 0.03))) * step(-0.5, fz);
  }
  // dust motes in the light: slow bokeh discs
  for (int i = 0; i < 14; i++) {
    float fi = float(i), sp = 0.012 + 0.02 * hash1(fi + 3.0);
    vec2 p = vec2(hash1(fi) * 2.4 - 1.2 + sin(uTime * sp * 3.0 + fi) * 0.25, hash1(fi + 7.0) * 1.3 - 0.45 + mod(uTime * sp + hash1(fi + 11.0), 1.0) * 0.3 - 0.15);
    float rr = 0.03 + 0.06 * hash1(fi + 5.0), dd = length(t - p);
    col += uCandleCol * (0.05 + 0.07 * hash1(fi + 2.0)) * smoothstep(rr, rr * 0.82, dd) * (0.6 + 0.4 * smoothstep(rr * 0.8, rr * 0.95, dd)) * step(-0.2, fz);
  }
  gl_FragColor = vec4(col, 1.0);
}`,dt=`
attribute vec3 aTint; varying vec3 vT, vL, vW;
void main(){
  vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0);
  vT = aTint; vL = position; vW = w.xyz;
${B0}}`,mt=`
uniform vec3 uVellum; varying vec3 vT, vL, vW;
void main(){
${b0}
  vec3 V = normalize(cameraPosition - vW), n = cross(dFdx(vW), dFdy(vW));
  n = normalize(n + vec3(0.0, 1e-6, 0.0)); if (dot(n, V) < 0.0) n = -n;
  float top = smoothstep(0.6, 0.85, n.y), isInk = step(vT.r + vT.g + vT.b, 0.4), lightK = mix(0.3, 1.0, isInk);
  vec2 lh = normalize(uCandleDir.xz + vec2(1e-4, 0.0));
  float face = max(dot(n.xz, lh), 0.0);
  float st = vnoise(vec2((vW.x + vW.z) * 1.3, vW.y * 0.16)), fib = vnoise(vec2((vW.x + vW.z) * 2.6, vW.y * 0.3));
  vec3 col = vT * mix(mix(0.72, 1.08, step(0.15, face)), 1.0, isInk) * (0.92 + 0.12 * st);
  col += uCandleCol * vec3(1.0, 0.72, 0.45) * 0.03 * face * face * uCandleI * (0.6 + 0.8 * fib) * lightK * (1.0 - top);
  float lowK = 1.0 - clamp(vL.y, 0.0, 1.0);
  col += uVellum * (0.003 + 0.01 * lowK * lowK * lowK) * (1.0 - top) * lightK;
  vec3 R = reflect(-V, n); float sp = max(dot(R, uCandleDir), 0.0), sp4 = sp * sp * sp * sp;
  float fres = 1.0 - max(dot(n, V), 0.0); fres *= fres * fres;
  col += uCandleCol * uCandleI * vec3(1.0, 0.7, 0.4) * (sp4 * sp4 * sp4 * 0.25 + sp4 * 0.012) * (0.2 + 0.8 * fres) * (0.4 + 1.2 * fib) * lightK;
  col = mix(col, vT * (0.92 + 0.12 * st) + uCandleCol * vec3(1.0, 0.75, 0.5) * 0.004 * uCandleI * isInk * (0.5 + fib), top * 0.9);
  col = mix(col, vT * 0.5, isInk * (1.0 - top) * smoothstep(0.93, 0.99, vL.y) * 0.6);
  gl_FragColor = vec4(col * mix(uPaint, vec3(1.0), isInk), 1.0);
${S0}}`,ao=`
attribute float aR, aBirth, aArc; varying vec3 vN, vV; varying float vVis, vArc;
void main(){
  float vis = smoothstep(aBirth, aBirth + 0.012, uU);
  vec3 p = position + normal * aR * vis * (1.0 + 0.5 * sin(vis * 3.1416));
  vec4 w = modelMatrix * vec4(p, 1.0);
  vN = normal; vVis = vis; vArc = aArc; vV = cameraPosition - w.xyz;
${B0}}`,no=`
uniform vec3 uVine; varying vec3 vN, vV; varying float vVis, vArc;
void main(){
  if (vVis < 0.02) discard;
${b0}
  vec3 n = normalize(vN);
  float tone = step(0.1, n.y * 0.8 + dot(n.xz, uCandleDir.xz) * 0.45);
  vec3 col = uVine * mix(0.58, 1.1, tone);
  col = mix(col, uWhite, step(0.9, n.y) * step(0.45, fract(vArc * 0.22)) * 0.85);
  float rim = 1.0 - abs(dot(n, normalize(vV)));
  col = mix(col, uSepia, smoothstep(0.6, 0.72, rim));
  gl_FragColor = vec4(col * uPaint, 1.0);
${S0}}`,xt=`
attribute vec3 iPos, iRot; attribute vec4 iData;
varying vec2 vP; varying vec4 vD; varying float vVis, vAsp; varying vec3 vNw, vV;
void main(){
  float vis = smoothstep(iData.y, iData.y + 0.022, uU);
  float lean = iRot.y + (1.0 - vis) * 1.4 + (sin(uTime * 1.6 + iData.z * 40.0) * 0.07 + uGust * 0.35 * sin(uTime * 5.0 + iData.z * 9.0)) * vis;
  vec2 l = vec2(position.x, position.y * iData.w) * iRot.z * vis * (1.0 + 0.25 * sin(vis * 3.1416));
  vec3 p = vec3(l.x, l.y * cos(lean), l.y * sin(lean)), nl = vec3(0.0, -sin(lean), cos(lean));
  float cy = cos(iRot.x), sy = sin(iRot.x);
  p = vec3(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy); nl = vec3(nl.z * sy, nl.y, nl.z * cy);
  vec4 w = vec4(iPos + p, 1.0);
  vP = vec2(position.x * 2.0, position.y * 2.0 - 1.0); vD = iData; vVis = vis; vAsp = iData.w; vNw = nl; vV = cameraPosition - w.xyz;
${B0}}`,gt=`
uniform vec4 uLeaf, uFlA; uniform vec3 uLeafCol, uLeafCol2, uFlACol, uFlBCol, uVine, uLapis, uVerm; uniform float uFlB;
varying vec2 vP; varying vec4 vD; varying float vVis, vAsp; varying vec3 vNw, vV;
void main(){
  if (vVis < 0.02) discard;
  float kind = vD.x, h = vD.z; vec2 p = vP; vec3 col; float px = fwidth(p.y) * 1.2;
  if (kind > 3.5) {
    // line-filler: one pointed lobe of a pleated red and blue pen flourish
    vec2 a = abs(p); float e = pow(a.x + 1e-4, 1.35) / 0.86 + pow(a.y + 1e-4, 1.35);
    if (e > 1.0) discard;
${b0}
    col = (h < 0.5 ? uLapis * 1.3 : uVerm) * mix(0.66, 1.0, step(0.0, p.x * 0.8 - p.y * 0.35 + 0.05));
    col = mix(col, uWhite, ink(0.03, abs(e - 0.56), px * 1.4) * 0.9);
    float d3 = min(length(p * vec2(0.7, 1.0)), min(length((p - vec2(0.0, 0.34)) * vec2(0.7, 1.0)), length((p + vec2(0.0, 0.34)) * vec2(0.7, 1.0))));
    col = mix(col, uWhite, ink(0.075, d3, px));
    col = mix(col, uSepia, smoothstep(0.84 - px * 1.5, 0.84 + px * 1.5, e));
    col *= uPaint;
  } else if (kind < 1.5) {
    // leaf: lobed outline about a point above the stalk
    vec2 lp = p - vec2(0.0, -0.3); lp.x *= uFlA.x; float f = atan(lp.x + 1e-5, lp.y), r = length(lp);
    float rad = (uLeaf.x + uLeaf.y * pow(abs(cos(uLeaf.z * f)), uLeaf.w)) * 1.22;
    float stalk = step(abs(p.x), 0.05) * step(p.y, -0.3);
    float e = r / rad;
    if (e > 1.0 && stalk < 0.5) discard;
${b0}
    if (kind < 0.5) {
      col = mix(uLeafCol, uLeafCol2, step(0.62, h)) * mix(0.6, 1.12, step(0.0, p.x)) * (0.9 + 0.2 * fract(h * 7.0));
      float d3 = min(length(lp - vec2(0.3, 0.05)), min(length(lp - vec2(0.3, 0.35)), length(lp - vec2(0.3, -0.25))));
      col = mix(col, uWhite, ink(0.075, d3, px));
      col = mix(col, uSepia, ink(0.03, abs(p.x), px) * step(p.y, 0.55));
      col *= uPaint;
    } else {
      vec3 N = normalize(vNw + 0.2 * vec3(sin(h * 40.0), 0.0, cos(h * 31.0))); vec3 V = normalize(vV);
      if (dot(N, V) < 0.0) N = -N;
      col = goldLeaf(N, V, p * 3.0, uFlare * 0.6) * uPaint;
    }
    col = mix(col, uSepia, max(smoothstep(0.84 - px, 0.84 + px, e), stalk));
  } else {
    // a bloom on a stalk; the bloom square is the top of the card
    vec2 b = vec2(p.x, (p.y + 1.0) * vAsp - (2.0 * vAsp - 1.0));
    float open = vVis * vVis, mask, edge;
    float stalk = step(abs(p.x), 0.045) * step(b.y, -0.2);
    if (kind < 2.5) {
      float f = atan(b.x + 1e-5, b.y), r = length(b), rad = 0.42 + 0.53 * open * pow(abs(cos(uFlA.w * 0.5 * f + h * 6.0)), 0.7);
      edge = r / rad; mask = step(edge, 1.0);
      col = uFlACol * mix(0.62, 1.0, step(0.52, edge)) * (0.85 + 0.3 * fract(h * 5.0));
      col = mix(col, uWhite, ink(0.05, abs(edge - 0.52) * rad, px) * 0.8);
      col = mix(col, uGold * 0.9, ink(0.2, r, px));
      col = mix(col, uSepia, ink(0.03, abs(r - 0.2), px));
    } else if (uFlB < 0.5) {
      // strawberry
      float wd = 0.5 + 0.22 * (b.y + 1.0); edge = length(vec2(b.x / wd, b.y * 0.98 + 0.02));
      mask = step(edge, 1.0);
      col = uFlBCol * mix(0.66, 1.0, step(b.x * 0.6 - b.y * 0.3, 0.1));
      vec2 g = b * 3.2; g.x += 0.5 * mod(floor(g.y), 2.0); col = mix(col, uWhite, ink(0.16, length(fract(g) - 0.5), px * 3.2));
      float cap = step(0.52 + 0.14 * abs(sin(b.x * 9.0)), b.y); col = mix(col, uVine, cap);
    } else if (uFlB < 1.5) {
      // ear of wheat
      edge = length(vec2(b.x / 0.42, b.y)); mask = step(edge, 1.0);
      float ch = fract((b.y - abs(b.x) * 1.5) * 3.0);
      col = uFlBCol * mix(0.66, 1.05, step(0.5, ch));
      col = mix(col, uSepia, ink(0.06, abs(ch - 0.5), px * 3.0) * 0.8);
      col = mix(col, uWhite, ink(0.05, length(vec2(abs(b.x) - 0.16, fract(b.y * 3.0) - 0.5) * vec2(1.0, 0.33)), px));
    } else if (uFlB < 2.5) {
      // bunch of grapes
      vec2 g = b * 3.3; g.x += 0.5 * mod(floor(g.y), 2.0); vec2 gi = floor(g); float gr = length(fract(g) - 0.5);
      float inT = step(abs((gi.x + 0.5 - 0.5 * mod(gi.y, 2.0)) / 3.3), 0.3 * ((gi.y + 0.5) / 3.3 + 1.15));
      edge = gr / 0.5; mask = step(edge, 1.0) * inT * step(abs(b.y), 0.95);
      col = uFlBCol * mix(0.62, 1.0, step(length(fract(g) - vec2(0.42, 0.58)), 0.33));
      col = mix(col, uWhite, ink(0.09, length(fract(g) - vec2(0.36, 0.64)), px * 3.3));
    } else {
      // holly berries
      float d = min(length(b - vec2(-0.4, -0.2)), min(length(b - vec2(0.4, -0.2)), length(b - vec2(0.0, 0.45)))) / 0.42;
      edge = d; mask = step(edge, 1.0);
      col = uFlBCol * mix(0.66, 1.0, step(d, 0.7));
      vec2 hb = vec2(abs(b.x) - 0.3 * step(b.y, 0.1), b.y - (b.y > 0.1 ? 0.55 : -0.1));
      col = mix(col, uWhite, ink(0.07, length(hb), px));
    }
    if (mask < 0.5 && stalk < 0.5) discard;
${b0}
    col = mask > 0.5 ? mix(col, uSepia, smoothstep(0.86 - px, 0.86 + px, edge)) : uVine * 0.75;
    col *= uPaint;
  }
  gl_FragColor = vec4(col, 1.0);
${S0}}`,wt=`
attribute vec4 iUV, iFx; varying vec2 vUv; varying vec4 vFx;
void main(){
  vec3 p = position;
  p.z += sin(p.x * 7.0 - uTime * (4.0 + iFx.z)) * iFx.y * (p.x + 0.5);
  p.y += sin(p.x * 5.0 - uTime * (3.1 + iFx.z)) * iFx.y * 0.5 * (p.x + 0.5);
  vec4 w = modelMatrix * instanceMatrix * vec4(p, 1.0);
  vUv = iUV.xy + uv * iUV.zw; vFx = iFx;
${B0}}`,yt=`
uniform sampler2D uAtlas; varying vec2 vUv; varying vec4 vFx;
void main(){
  vec4 t = texture2D(uAtlas, vUv);
  if (t.a < 0.5) discard;
${b0}
  vec3 col = t.rgb / max(t.a, 0.5) * uPaint;
  float lamp = step(0.8, t.r) * step(0.5, t.g) * step(t.b, 0.25) * vFx.x;
  col *= 1.0 + lamp * (2.2 + 1.2 * sin(uTime * 7.0 + vUv.x * 90.0) * sin(uTime * 4.3 + vUv.y * 70.0));
  gl_FragColor = vec4(col, 1.0);
${S0}}`,bt=`
attribute vec3 iC; attribute vec4 iD; uniform vec4 uScare;
varying vec2 vUv; varying float vH;
void main(){
  float ph = iD.x, t = uTime * iD.w;
  vec3 c = iC + vec3(sin(t * 0.5 + ph) * 5.0, sin(t * 0.83 + ph * 2.0) * 2.2 + sin(t * 3.1 + ph) * 0.35, cos(t * 0.41 + ph * 1.3) * 5.0);
  vec2 sd = c.xz - uScare.xy; float sl = max(length(sd), 1.0), sk = uScare.z * smoothstep(80.0, 12.0, sl);
  c.xz += sd / sl * sk * 34.0; c.y += sk * 16.0;
  float yaw = atan(cos(t * 0.5 + ph) * 2.5, -sin(t * 0.41 + ph * 1.3) * 2.05 + 1e-4);
  float flap = 0.25 + 0.95 * sin(uTime * (12.0 + 5.0 * fract(ph * 3.7)) * (1.0 + sk) + ph * 7.0);
  vec3 l = vec3(position.x * cos(flap), abs(position.x) * sin(flap), position.z) * iD.y;
  l = vec3(l.x, l.y * 0.88 - l.z * 0.47, l.y * 0.47 + l.z * 0.88);
  float cy = cos(yaw), sy = sin(yaw);
  vec4 w = vec4(c + vec3(l.x * cy + l.z * sy, l.y, -l.x * sy + l.z * cy), 1.0);
  vUv = vec2(abs(position.x), -position.z); vH = iD.z;
${B0}}`,Mt=`
uniform vec3 uLapis, uVerm; varying vec2 vUv; varying float vH;
void main(){
  vec2 q = vUv;
  float d = min(length((q - vec2(0.5, 0.12)) / vec2(0.5, 0.36)), length((q - vec2(0.38, -0.25)) / vec2(0.38, 0.25)));
  if (d > 1.0 && q.x > 0.07) discard;
${b0}
  vec3 base = vH < 0.3 ? uLapis * 1.6 : (vH < 0.55 ? uVerm : (vH < 0.8 ? uGold : uWhite));
  vec3 col = mix(base, base * 0.5, step(0.66, d));
  float es = length(q - vec2(0.56, 0.16));
  col = mix(col, uWhite, step(es, 0.13)); col = mix(col, uSepia, step(es, 0.06));
  col = mix(col, uWhite, step(length(vec2(fract(q.x * 5.0) - 0.5, (d - 0.83) * 4.0)), 0.3) * step(0.66, d));
  col = mix(col, uSepia, max(step(0.92, d), step(q.x, 0.07)));
  gl_FragColor = vec4(col * uPaint, 1.0);
${S0}}`,so=`
uniform vec4 uRow; varying vec2 vUv; varying float vX;
void main(){
  vec3 p = position; p.y += sin(uTime * 1.1 + uRow.y * 2.0) * 0.35;
  vec4 w = modelMatrix * vec4(p, 1.0); w.y += pageH(w.xz); vUv = uv; vX = w.x;
${B0}}`,lo=`
uniform vec3 uLapis; uniform vec4 uRow; varying vec2 vUv; varying float vX;
void main(){
  float s = vX / uRow.z + uRow.x * uTime * 0.26 + uRow.y * 0.41, c = fract(s) - 0.5;
  float top = 0.5 + 0.5 * sqrt(max(1.0 - 4.0 * c * c, 0.0)) * 0.92;
  float e = top - vUv.y; if (e < 0.0) discard;
${b0}
  float pe = fwidth(vUv.y) * 1.5;
  vec3 col = uLapis * mix(0.62, 1.0, step(0.34, e) * 0.0 + step(e, 0.34));
  col = mix(col, uLapis * 1.9 + 0.05, step(e, 0.2));
  col = mix(col, uWhite, ink(0.03, abs(e - 0.2), pe));
  vec2 dq = vec2(c * 3.0, (top - 0.42 - vUv.y) * 4.0);
  col = mix(col, uWhite, step(min(length(dq), min(length(dq - vec2(0.55, 0.0)), length(dq + vec2(0.55, 0.0)))), 0.17));
  col = mix(col, uSepia, step(e, 0.045));
  gl_FragColor = vec4(col * uPaint, 1.0);
${S0}}`,At=`
attribute float aK; varying vec3 vL, vN, vW; varying float vK;
void main(){
  vec3 p = position;
  if (aK > 0.5) p.z += sin(p.y * 0.05 + uTime * 1.3) * 1.2 * abs(p.x) / 13.0 + p.x * p.x * 0.03;
  vec4 w = modelMatrix * vec4(p, 1.0); vL = position; vN = normalize(mat3(modelMatrix) * normal); vK = aK; vW = w.xyz;
${B0}}`,zt=`
uniform vec3 uRoom; varying vec3 vL, vN, vW; varying float vK;
void main(){
  vec3 col;
  if (vK > 0.5) {
    float u = vL.x / 13.0, v = (vL.y - 14.0) / 186.0;
    float wd = pow(max(sin(pow(clamp(v, 0.0, 1.0), 0.62) * 3.1416), 0.0), 0.55) * smoothstep(-0.02, 0.28, v) * (u > 0.0 ? 1.0 : 0.62);
    float bl = v * 58.0 - abs(u) * 9.0, notch = step(0.86, vnoise(vec2(floor(bl * 0.5), 3.0))) * 0.3 * smoothstep(0.2, 1.0, abs(u) / max(wd, 1e-3));
    if (abs(u) > wd * (1.0 - notch)) discard;
${b0}
    col = vec3(0.80, 0.77, 0.68) * mix(0.82, 1.0, step(0.0, u));
    col *= 1.0 - 0.22 * ink(0.1, abs(fract(bl) - 0.5), fwidth(bl));
    col = mix(col, vec3(0.62, 0.55, 0.38), ink(0.05, abs(u), fwidth(u)));
    col = mix(col, uSepia, smoothstep(0.93, 0.97, abs(u) / max(wd * (1.0 - notch), 1e-3)) * 0.7);
  } else {
${b0}
    vec3 n = normalize(vN);
    col = vec3(0.74, 0.68, 0.5) * mix(0.62, 1.0, step(0.0, dot(n, uCandleDir)));
    col = mix(col, uSepia, smoothstep(0.62, 0.78, 1.0 - abs(dot(n, normalize(cameraPosition - vW)))) * 0.85);
    col = mix(vec3(0.014, 0.012, 0.014), col, smoothstep(6.0, 13.0, vL.y + 3.0 * vnoise(vec2(vL.x * 2.0 + vL.z * 2.0, vL.y * 0.6))));
  }
  col = mix(col * uPaint, uRoom * 0.9, smoothstep(60.0, 190.0, vW.y));
  gl_FragColor = vec4(col, 1.0);
${S0}}`,Ct=`
varying vec3 vL, vN, vV;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.0); vL = position; vN = normalize(mat3(modelMatrix) * normal); vV = cameraPosition - w.xyz;
${B0}}`,kt=`
uniform vec3 uLapis, uVerm; uniform float uBlockFlare; varying vec3 vL, vN, vV;
void main(){
${b0}
  vec3 N = normalize(vN), V = normalize(vV); vec2 p = vL.xy; float px = max(fwidth(p.x), fwidth(p.y));
  float m = max(abs(p.x), abs(p.y)); vec3 col;
  float face = step(0.5, abs(N.z));
  if (face < 0.5 || m > 5.4) {
    vec3 Nb = normalize(N + face * vec3(sign(p.x) * step(abs(p.y), abs(p.x)), sign(p.y) * step(abs(p.x), abs(p.y)), 0.0) * smoothstep(5.4, 5.9, m) * (1.0 - smoothstep(6.5, 7.0, m)) * -0.5);
    col = goldLeaf(Nb, V, p * 1.4 + vL.z, uBlockFlare * 0.45);
    col = mix(col, uSepia, face * ink(0.07, abs(m - 5.45), px));
  } else {
    // leaf-scroll: counter-wound spirals, red on blue and blue on red, gold buds
    vec2 c = p / 3.6 + 0.5; vec2 id = floor(c), f = fract(c) - 0.5; float r = length(f), a = atan(f.y, f.x + 1e-5);
    float dir = mod(id.x + id.y, 2.0) * 2.0 - 1.0;
    float sp = fract(a * dir / 6.2832 + r * 3.2 - uTime * 0.04 * dir);
    vec3 A = dir > 0.0 ? uLapis * 1.3 : uVerm, B = dir > 0.0 ? uVerm : uLapis * 1.3;
    col = mix(A * 0.72, A, step(0.0, f.x - f.y));
    float leaf = smoothstep(0.3, 0.26, abs(sp - 0.5)) * step(r, 0.47) * step(0.07, r);
    col = mix(col, B, leaf);
    col = mix(col, uWhite, ink(0.02, abs(abs(sp - 0.5) - 0.28) / 3.2, px / 3.6) * step(r, 0.47) * 0.9);
    if (r < 0.085) col = goldLeaf(N, V, p * 2.0, uBlockFlare * 0.45);
    col = mix(col, uSepia, ink(0.012, abs(r - 0.085), px / 3.6));
    col = mix(col, uWhite, ink(0.035, length(abs(f) - 0.5), px / 3.6));
  }
  gl_FragColor = vec4(col * uPaint, 1.0);
${S0}}`,io=()=>r.UniformsUtils.clone(r.UniformsLib.fog),$0=v=>(v=D0(v,0,1),v*v*(3-2*v));function W(v,C,_=.6){const p=C.length,H=(v%1+1)%1*p,R=Math.floor(H),N=H-R;return _0(C[R],C[(R+1)%p],$0((N-_)/(1-_)))}function _e(v){const C=[[-.95,-.35],[-.1,-.5],[.42,-.31],[.25,0],[.4,.27],[.95,.35],[.1,.5],[-.42,.31],[-.25,0],[-.4,-.27]].map(([h,m])=>[h-m*.55,m]),_=v?[[0,1.06,1.02],[.55,1,1],[1,.7,.94]]:[[0,1,1],[1,.8,.96]],p=C.length,H=[],R=(h,m)=>[C[m][0]*h[1],h[0],C[m][1]*h[2]];for(let h=0;h<_.length-1;h++)for(let m=0;m<p;m++){const r0=R(_[h],m),i=R(_[h],(m+1)%p),F=R(_[h+1],(m+1)%p),p0=R(_[h+1],m);H.push(...r0,...p0,...F,...r0,...F,...i)}const N=_[_.length-1];for(let h=0;h<p;h++)H.push(0,1,0,...R(N,(h+1)%p),...R(N,h));const k=new r.BufferGeometry;return k.setAttribute("position",new r.Float32BufferAttribute(H,3)),k}function ro(){const v=[],C=[],_=[],p=[],H=[],R=[],N=new r.Vector3,k=new r.Vector3,h=new r.Vector3,m=new r.Vector3(1,0,0),r0=new r.Vector3(0,1,0);return{add(i,F,p0,O,D=6){let K=0,b=-1;const Z=i.length;for(let n0=0;n0<Z;n0++){const c0=i[n0],n=i[Math.max(0,n0-1)],l=i[Math.min(Z-1,n0+1)];n0&&(K+=Math.hypot(c0[0]-i[n0-1][0],c0[1]-i[n0-1][1],c0[2]-i[n0-1][2])),N.set(l[0]-n[0],l[1]-n[1],l[2]-n[2]).normalize(),k.crossVectors(N,Math.abs(N.y)>.9?m:r0).normalize(),h.crossVectors(k,N);const w=n0/(Z-1),A=_0(F,p0,w)*(n0===Z-1?.2:1),y=O(n0),L=v.length/3;for(let E=0;E<D;E++){const s0=E/D*F0,V0=Math.cos(s0),$=Math.sin(s0);v.push(c0[0],c0[1],c0[2]),C.push(k.x*V0+h.x*$,k.y*V0+h.y*$,k.z*V0+h.z*$),_.push(A),p.push(y),H.push(K)}if(b>=0)for(let E=0;E<D;E++){const s0=(E+1)%D;R.push(b+E,b+s0,L+s0,b+E,L+s0,L+E)}b=L}},geometry(){const i=new r.BufferGeometry;return i.setAttribute("position",new r.Float32BufferAttribute(v,3)),i.setAttribute("normal",new r.Float32BufferAttribute(C,3)),i.setAttribute("aR",new r.Float32BufferAttribute(_,1)),i.setAttribute("aBirth",new r.Float32BufferAttribute(p,1)),i.setAttribute("aArc",new r.Float32BufferAttribute(H,1)),i.setIndex(R),i}}}const a={lap:"#2B4DB0",lapD:"#1B3382",ver:"#C7361F",verD:"#8E2414",grn:"#2F7D5B",grnD:"#1F5A40",wht:"#F1EBDB",gry:"#B4AE9E",och:"#D9A441",ochD:"#A87A2A",pink:"#E0A58E",pinkD:"#B97A66",tan:"#C9A26B",tanD:"#9A774A",brn:"#8A5A32",brnD:"#5E3B1E",pale:"#C9D3A0",paleD:"#9CAB78",fox:"#C8642A",foxD:"#93431A",sep:"#3B2A1A",lamp:"#FFC020"};function co(v,C){const _=typeof OffscreenCanvas<"u"?new OffscreenCanvas(v,v):Object.assign(document.createElement("canvas"),{width:v,height:v}),p=_.getContext("2d"),H=v/C,R={};let N=0,k=!1;const h=(n,l,w,A,y=0)=>()=>{p.moveTo(n+w*Math.cos(y),l+w*Math.sin(y)),p.ellipse(n,l,w,A,y,0,F0)},m=(...n)=>()=>{p.moveTo(n[0],n[1]);for(let l=2;l<n.length;l+=2)p.lineTo(n[l],n[l+1]);p.closePath()},r0=(...n)=>()=>{const l=n.length/2,w=y=>[(n[y%l*2]+n[(y+1)%l*2])/2,(n[y%l*2+1]+n[(y+1)%l*2+1])/2],A=w(0);p.moveTo(A[0],A[1]);for(let y=1;y<=l;y++){const L=w(y);p.quadraticCurveTo(n[y%l*2],n[y%l*2+1],L[0],L[1])}p.closePath()},i=(n,l,w,A=.04,y=-.06,L=.08)=>{p.beginPath(),n(),p.fillStyle=w||l,p.fill(),w&&(p.save(),p.clip(),p.translate(y,L),p.beginPath(),n(),p.fillStyle=l,p.fill(),p.restore()),A&&(p.beginPath(),n(),p.lineWidth=A,p.strokeStyle=a.sep,p.stroke())},F=(n,l,w=a.sep)=>{p.beginPath(),p.moveTo(n[0],n[1]);for(let A=2;A<n.length;A+=2)p.lineTo(n[A],n[A+1]);p.lineWidth=l,p.strokeStyle=w,p.stroke()},p0=(n,l,w)=>{F(n,l+.07),F(n,l,w)},O=(n,l,w=.04,A=a.wht)=>{p.beginPath(),p.arc(n,l,w,0,F0),p.fillStyle=A,p.fill()},D=(n,l,w,A,y=.04)=>{for(let L=-1;L<=1;L++)O(n+w*L,l+A*L,y)},K=(n,l)=>{O(n,l,.05,a.wht),O(n+.01,l,.028,a.sep)},b=n=>{k&&p.restore();const l=N%C*H,w=Math.floor(N/C)*H;N++,k=!0,p.save(),p.setTransform(H*.47,0,0,-H*.47,l+H/2,w+H/2),p.beginPath(),p.rect(-1.05,-1.05,2.1,2.1),p.clip(),p.lineJoin=p.lineCap="round",R[n]=[l/v+.015/C,1-(w+H)/v+.015/C,.97/C,.97/C]};return{g:p,cv:_,rects:R,paint:{shell(){b("shell"),i(h(0,0,.9,.86),a.pink,a.pinkD),p.beginPath();for(let n=0;n<=90;n++){const l=n/90*5.6*Math.PI,w=.86*(1-l/(6.3*Math.PI)),A=w*Math.cos(l+.8),y=w*Math.sin(l+.8);n?p.lineTo(A,y):p.moveTo(A,y)}p.lineWidth=.05,p.strokeStyle=a.sep,p.stroke();for(let n=0;n<9;n++){const l=n*.7;O(.73*Math.cos(l),.7*Math.sin(l),.035)}},snail(){b("snail"),F([.8,.45,.7,.9],.04),F([.9,.42,.99,.82],.04),O(.7,.9,.05,a.sep),O(.99,.82,.05,a.sep),i(r0(-.98,-.62,-.3,-.4,.3,-.36,.52,0,.6,.42,.86,.52,.97,.3,.82,.05,.8,-.4,.6,-.7,-.5,-.72),a.pale,a.paleD),K(.82,.34),D(.2,-.55,.2,0)},knight(){b("knight"),i(m(-.05,-.55,.3,-.55,.36,-.98,.62,-.98,.62,-.86,.5,-.86,.42,-.5),a.gry,null),i(m(-.36,-.7,.36,-.7,.3,.18,-.3,.18),a.lap,a.lapD),F([0,-.6,0,.1],.07,a.wht),F([-.2,-.2,.2,-.2],.07,a.wht),i(h(-.2,.9,.3,.09,.5),a.ver,null,.03),i(m(-.26,.18,.26,.18,.3,.72,0,.88,-.3,.72),a.wht,a.gry),F([0,.5,.28,.5],.06),D(.12,.33,.07,0,.025)},lance(){b("lance"),i(m(.2,.04,.2,.34,-.3,.3,-.12,.2,-.3,.1),a.ver,a.verD),D(.02,.2,.1,0,.03),i(m(-.98,-.035,.98,-.012,.98,.012,-.98,.035),a.wht,null,.03);for(let n=0;n<9;n++)F([-.9+n*.2,-.02,-.82+n*.2,.02],.035,a.ver);i(h(-.5,0,.1,.13),a.gry,null),i(m(-.75,-.08,-.5,-.08,-.5,.08,-.75,.08),a.lap,null)},hare(){b("hare"),i(h(-.15,-.6,.34,.3),a.tan,a.tanD),i(h(-.48,-.66,.1,.1),a.wht,null,.03),i(m(-.2,-.86,.35,-.86,.42,-.98,-.2,-.98),a.tan,null),i(h(.02,-.15,.27,.52,-.2),a.tan,a.tanD),i(h(0,.76,.07,.26,.55),a.tan,a.tanD),i(h(.13,.8,.07,.26,.25),a.tan,a.tanD),i(h(.24,.42,.2,.16,.3),a.tan,a.tanD),K(.3,.46),D(0,-.2,0,.18)},shield(){b("shield"),p0([-.6,0,.3,.05],.1,a.tan),i(m(.1,.5,.9,.5,.9,-.05,.5,-.6,.1,-.05),a.wht,a.gry),F([.5,.42,.5,-.42],.12,a.ver),F([.18,.15,.82,.15],.12,a.ver)},pulpit(){b("pulpit"),i(m(-.2,-.98,.2,-.98,.12,-.3,-.12,-.3),a.brn,a.brnD),i(m(-.6,.3,.6,.3,.45,-.35,-.45,-.35),a.lap,a.lapD);for(let n=-1;n<=1;n++)F([n*.3-.1,-.25,n*.3-.1,.1,n*.3,.2,n*.3+.1,.1,n*.3+.1,-.25],.03,a.wht),O(n*.3,-.05,.035);i(m(-.68,.3,.68,.3,.68,.42,-.68,.42),a.och,a.ochD)},fox(){b("fox"),i(h(-.45,-.5,.36,.17,.6),a.fox,a.foxD),i(h(-.7,-.2,.1,.1),a.wht,null,.03),i(h(0,-.3,.3,.62),a.fox,a.foxD),i(h(.1,-.2,.13,.4),a.wht,null,0),i(m(-.12,.62,-.1,.92,.06,.68),a.fox,null),i(m(.06,.66,.16,.92,.24,.62),a.fox,null),i(m(-.15,.3,.2,.68,.72,.36,.2,.22),a.fox,a.foxD),O(.7,.37,.04,a.sep),K(.22,.5),i(m(-.32,.25,.3,.25,.36,.12,-.38,.12),a.wht,null,.03)},monkey(){b("monkey"),p0([-.35,-.62,-.7,-.78,-.92,-.45,-.78,-.08,-.6,-.22],.07,a.brn),i(m(-.1,-.74,.46,-.74,.62,-.95,-.1,-.95),a.brn,null),i(h(-.1,-.35,.34,.5,-.15),a.brn,a.brnD),i(h(.02,-.32,.15,.3,-.15),a.tan,null,0),i(h(-.14,.42,.12,.12),a.brn,a.brnD),i(h(-.14,.42,.06,.06),a.pink,null,0),i(h(.08,.4,.27,.25),a.brn,a.brnD),i(h(.25,.33,.17,.14),a.tan,a.tanD,.03),K(.16,.47),O(.37,.36,.025,a.sep),F([.2,.27,.36,.27],.025),i(m(-.14,.6,.06,.9,.32,.58),a.ver,a.verD,.03),O(.06,.9,.05,a.och),D(-.12,-.45,0,.14,.03)},mArmPipe(){b("mArmPipe"),i(m(-.9,-.11,.15,-.08,.15,.08,-.9,.11),a.brn,a.brnD),i(m(0,-.05,.98,-.14,.98,.14,0,.05),a.och,a.ochD,.03);for(let n=0;n<3;n++)O(.35+.18*n,0,.03,a.sep)},mArmStick(){b("mArmStick"),F([.1,0,.92,.3],.1),F([.1,0,.92,.3],.05,a.wht),O(.92,.3,.08,a.och),i(m(-.9,-.11,.2,-.08,.2,.08,-.9,.11),a.brn,a.brnD)},tabor(){b("tabor"),i(m(-.7,-.5,.7,-.5,.7,.5,-.7,.5),a.lap,a.lapD);for(let n=0;n<6;n++)F([-.7+n*.28,n%2?.5:-.5,-.42+n*.28,n%2?-.5:.5],.035,a.wht);i(h(-.7,0,.16,.5),a.wht,a.gry),i(h(.7,0,.16,.5),a.wht,a.gry),D(0,0,.3,0,.035)},foxArm(){b("foxArm"),i(m(-.9,-.14,.6,-.1,.9,0,.6,.12,-.9,.14),a.fox,a.foxD),i(h(.82,0,.14,.13),a.wht,null,.03)},fan(){b("fan"),i(m(0,-.95,-.34,.72,-.18,.93,.18,.93,.34,.72),a.grn,a.grnD);for(let n=-1;n<=1;n++)F([0,-.95,n*.2,.6],.025);i(h(0,.55,.2,.25),a.och,a.ochD,.03),i(h(0,.52,.11,.14),a.lap,null,.03),O(0,.5,.04),D(0,0,0,.2,.03)},dragon(){b("dragon");for(const n of[-.25,.3])i(m(n-.08,-.3,n+.1,-.3,n+.16,-.82,n+.34,-.9,n-.06,-.9),a.ver,a.verD);i(m(.9,.42,1,.2,.86,.36),a.ver,null,.03),i(r0(-.98,-.1,-.5,.12,-.1,-.1,.3,.08,.48,.5,.78,.66,.98,.48,.76,.3,.62,-.1,.3,-.46,-.2,-.5,-.62,-.3),a.grn,a.grnD);for(let n=0;n<6;n++)O(-.6+n*.2,-.12+.07*Math.sin(n*1.6),.035);i(m(.62,.66,.66,.86,.74,.66),a.grn,null,.03),K(.8,.52)},wing(){b("wing"),i(m(-.8,-.8,-.5,.6,0,.2,.3,.85,.6,.25,.95,.6,.7,-.5,.2,-.3,-.2,-.55),a.ver,a.verD);for(const[n,l]of[[-.5,.6],[.3,.85],[.95,.6]])F([-.8,-.8,n,l],.03);D(.2,.1,.16,.05,.035)},hull(){b("hull"),i(m(-.05,.05,.05,.05,.04,1,-.04,1),a.brn,null,.03),i(m(-.97,.1,-.74,-.46,.7,-.46,.98,.16,.74,.1,.74,.38,.44,.38,.44,.08,-.56,.08,-.56,.32,-.9,.32),a.brn,a.brnD);for(const n of[-.08,-.26])F([-.84-n*.4,n,.84+n*.5,n],.025);for(let n=0;n<8;n++)O(-.7+n*.2,-.17,.025);for(const n of[.5,.62,-.84,-.7])i(m(n-.04,.38-(n<0?.06:0),n+.04,.38-(n<0?.06:0),n+.04,.48-(n<0?.06:0),n-.04,.48-(n<0?.06:0)),a.och,null,.025)},sail(){b("sail"),i(r0(-.8,.8,0,.84,.8,.8,.9,0,.7,-.75,0,-.6,-.7,-.75,-.9,0),a.wht,a.gry),p.save(),p.beginPath(),r0(-.8,.8,0,.84,.8,.8,.9,0,.7,-.75,0,-.6,-.7,-.75,-.9,0)(),p.clip();for(const n of[-.45,0,.45])F([n,.9,n*1.05,-.9],.13,a.ver);p.restore(),F([-.88,.82,.88,.82],.06,a.brn)},pennant(){b("pennant"),i(m(-.95,.3,.95,0,-.95,-.3),a.wht,null),p.save(),p.beginPath(),m(-.95,.3,.95,0,-.95,-.3)(),p.clip();for(let n=0;n<5;n++)F([-.8+n*.4,.4,-.8+n*.4,-.4],.2,a.ver);p.restore(),p.beginPath(),m(-.95,.3,.95,0,-.95,-.3)(),p.lineWidth=.04,p.strokeStyle=a.sep,p.stroke()},castle(){b("castle");const n=(l,w,A,y,L)=>{const E=[l-w,A,l-w,y];for(let s0=0;s0<3;s0++){const V0=l-w+2*w*(s0*2)/5,$=l-w+2*w*(s0*2+1)/5;E.push(V0,y+.08,$,y+.08,$,y,Math.min(l+w,$+2*w/5),y)}E.push(l+w,A),i(m(...E),a.wht,a.gry),L&&i(m(l-w*1.2,y+.08,l,y+.5,l+w*1.2,y+.08),L,null),i(m(l-.035,y-.34,l+.035,y-.34,l+.035,y-.12,l-.035,y-.12),a.lamp,null,.02)};n(-.6,.2,-.95,.2,a.lap),n(.6,.2,-.95,.2,a.ver),n(0,.42,-.95,-.05,null),n(0,.24,-.1,.45,a.lap),i(m(-.14,-.95,-.14,-.6,0,-.45,.14,-.6,.14,-.95),a.sep,null,0);for(const l of[-.28,.28])i(m(l-.035,-.5,l+.035,-.5,l+.035,-.28,l-.035,-.28),a.lamp,null,.02);F([0,.9,0,1],.03),i(m(0,1,.25,.93,0,.86),a.ver,null,.025)},mill(){b("mill"),i(m(-.42,-.98,.42,-.98,.26,.3,-.26,.3),a.wht,a.gry),i(m(-.36,.3,0,.72,.36,.3),a.ver,a.verD),i(m(-.1,-.98,-.1,-.66,0,-.56,.1,-.66,.1,-.98),a.sep,null,0),i(h(0,-.2,.07,.09),a.lamp,null,.025),D(0,.05,.12,0,.03),b("millSails");for(let n=0;n<4;n++){p.save(),p.rotate(n*Math.PI/2),F([0,0,.95,0],.05,a.brn),i(m(.22,.03,.95,.03,.95,.3,.22,.3),a.wht,null,.03);for(let l=1;l<5;l++)F([.22+l*.146,.03,.22+l*.146,.3],.02);F([.22,.165,.95,.165],.02),p.restore()}O(0,0,.09,a.och)}},beast:(n,l)=>{b(n),l.tail==="long"&&p0([-.5,0,-.75,.12,-.92,.38,-.8,.6],.07,l.c),l.tail==="brush"&&(i(h(-.72,.08,.3,.14,-.4),l.c,l.d),i(h(-.92,.2,.1,.08,-.4),a.wht,null,.03)),l.tail==="thin"&&F([-.5,0,-.7,-.1,-.85,.05,-.98,-.05],.045,l.d),i(h(0,0,.56,.22*(l.fat||1),.05),l.c,l.d),l.tail==="scut"&&i(h(-.56,.1,.11,.1),a.wht,null,.03),l.ear==="long"&&(i(h(.5,.52,.07,.28,.5),l.c,l.d),i(h(.62,.55,.07,.28,.2),l.c,l.d)),i(h(.64,.18,.2,.15,.25),l.c,l.d),l.snout&&i(m(.76,.26,.98,.12,.78,.06),l.c,null),l.ear==="flop"&&i(h(.52,.16,.08,.17,-.3),l.d,null),l.ear==="point"&&(i(m(.52,.28,.5,.5,.64,.33),l.c,null),i(m(.64,.32,.7,.52,.78,.3),l.c,null)),l.ear==="round"&&(i(h(.56,.36,.1,.1),l.c,l.d),i(h(.56,.36,.05,.05),a.pink,null,0)),l.collar&&F([.44,-.04,.5,.3],.07,a.ver),K(.72,.22),D(-.05,.03,.17,0),b(n+"Legs");for(const[w,A]of[[.05,.55],[-.05,-.5]])i(m(w-.1,.85,w+.1,.85,A+.1,-.8,A+.22,-.92,A-.06,-.92),l.c,l.d)},bird:(n,l)=>{b(n);const w=l.nx??.45,A=l.ny??.5;if(l.legs!==!1&&(F([-.05,-.5,-.02,-.92,.12,-.92],.05,a.och),F([-.2,-.5,-.22,-.92,-.08,-.92],.05,a.och)),l.tail==="plume")for(let y=0;y<4;y++)p0([-.5,-.2,-.75-.05*y,.15+.14*y,-.95+.06*y,-.05+.2*y],.06,y%2?l.c2:l.c);else i(m(-.5,-.15,-.92,.02,-.55,-.4),l.c,l.d);if(p0(l.sNeck?[.25,-.15,.5,.1,.3,.35,w-.1,A-.1,w,A]:[.25,-.15,.36,.15,w-.03,A-.1,w,A],.13,l.c),i(h(-.1,-.25,.5,.3,.12),l.c,l.d),i(h(-.15,-.2,.3,.16,-.15),l.c2||l.c,l.d,.035),D(-.15,-.2,.13,-.02),l.comb&&(i(h(w-.02,A+.15,.12,.08,.3),a.ver,null,.03),i(h(w+.08,A-.14,.05,.09),a.ver,null,.03)),l.crest)for(let y=-1;y<=1;y++)F([w,A+.05,w+.1*y,A+.32],.025),O(w+.1*y,A+.34,.04,a.och);i(h(w+.02,A,.12,.1),l.c,l.d),i(m(w+.11,A+.05,w+.32,A-.02,w+.11,A-.06),l.beak||a.och,null,.03),K(w+.04,A+.02)},finish(){k&&p.restore(),k=!1}}}const fo=[{name:"candle",room:"#24170E",glow:"#6a3410",light:"#FFC98A",I:1,tint:[1,1,1],shadow:"#C4AD7C",fog:"#DCCBA2",el:.35,grade:"#fff6e6",paint:[1,1,1],shelf:.2,win:"#26335c"},{name:"cloister morning",room:"#2c3440",glow:"#5f7890",light:"#EEF4FF",I:.9,tint:[.93,.92,.88],shadow:"#8E9288",fog:"#DAD5C0",el:.56,grade:"#f6f8ff",paint:[.96,.99,1.04],shelf:.2,win:"#4e5d74"},{name:"rose dawn",room:"#3a2030",glow:"#a04c5c",light:"#FF9C62",I:.75,tint:[1,.925,.9],shadow:"#C7A698",fog:"#E2C6B4",el:.24,grade:"#fff0ec",paint:[1.04,.96,.97],shelf:.24,win:"#a8505c"}],Ft=[{name:"spring",leaf:[.42,.58,1.5,.9],leafCol:"#2F7D5B",leafCol2:"#3E9160",flA:"#3557C4",petals:5,flB:0,flBCol:"#C7361F",vine:"#2F7D5B"},{name:"August",leaf:[.25,.75,.5,1.4],narrow:2.6,leafCol:"#6E8F3A",leafCol2:"#B9963A",flA:"#C7361F",petals:4,flB:1,flBCol:"#D9A441",vine:"#5F8A3E"},{name:"autumn",leaf:[.45,.55,2.5,.8],leafCol:"#3F7A4A",leafCol2:"#B5522A",flA:"#E9E2CF",petals:5,flB:2,flBCol:"#6B3A8E",vine:"#5A6B33"},{name:"winter",leaf:[.5,.45,3.5,2.5],leafCol:"#1F5F45",leafCol2:"#2A6E4E",flA:"#EFEADB",petals:6,flB:3,flBCol:"#C7361F",vine:"#27634A"}];var vo={id:"gilded-margin",name:"The Gilded Margin",category:"bizarre",weirdness:.8,media:["air","tiny"],async build(v){const C=v.rng,_=v.vary||{},p=v.quality?.detail??1,H=D0(_.density??1,.7,1.3),R={text:C.fork("text"),vine:C.fork("vine"),cast:C.fork("cast"),fly:C.fork("fly"),misc:C.fork("misc")},N=_.hour==="night"||_.hour==="golden"?0:_.hour==="day"?1:_.hour==="dawn"?2:C.pick([1,0,2]),k=fo[N],h=Ft[C.int(0,3)],m=Ft.indexOf(h),r0=C(),i={joust:r0<.42?"joust":r0<.72?"fox":"monkeys",chase:C.chance(.55)?"hound":"cat",dragon:C.chance(.6),ship:C.chance(.65)},F=C.chance(.45),p0=!!_.rare,O=C.sign()*C.range(.22,.4),D=e=>new r.Color(e),K=ut.map(D);K[2].offsetHSL(C.range(-.015,.015),0,C.range(0,.03)),K[4].offsetHSL(C.range(-.008,.008),0,0);const b=new r.Scene;b.background=D(k.room),b.fog=new r.Fog(D(k.fog),135,1250);const Z={uTime:{value:0},uGust:{value:0},uU:{value:0},uCandleI:{value:1},uFlare:{value:0},uCandleDir:{value:new r.Vector3(Math.cos(k.el),Math.sin(k.el),0)},uCandleCol:{value:D(k.light)},uShadowCol:{value:D(k.shadow)},uSepia:{value:K[5]},uWhite:{value:D("#F6F0E0").multiplyScalar(.86)},uPaint:{value:new r.Color(k.paint[0],k.paint[1],k.paint[2])},uGold:{value:K[6]}},n0={uLapis:{value:K[2]},uVerm:{value:K[4]},uVine:{value:D(h.vine)}},c0={value:0},n=(e,t,o={},s={})=>new r.ShaderMaterial({vertexShader:Yt+e,fragmentShader:Jt+t,uniforms:{...io(),...Z,...n0,...o},fog:!0,side:r.DoubleSide,...s}),l=(e,t,o={})=>n(e,t,o,{defines:{SHADOW:1},transparent:!0,depthWrite:!1,blending:r.CustomBlending,blendEquation:r.MinEquation,blendSrc:r.OneFactor,blendDst:r.OneFactor}),w=(e,t)=>{const o=e.isInstancedMesh?new r.InstancedMesh(e.geometry,t,e.count):new r.Mesh(e.geometry,t);return e.isInstancedMesh&&(o.instanceMatrix=e.instanceMatrix),o.position.copy(e.position),o.quaternion.copy(e.quaternion),o.frustumCulled=!1,o.renderOrder=1,b.add(o),o};await v.yield();const A=T(fe,ue)-.4,y=A+45,L=jt([[205,9,298],[262,10,298],[318,11,298.5],[352,12,303],[380,17,318],[396,19,345],[400,16.5,385],[400,15,430],[398,15,475],[396,15,520],[392,13.5,553],[378,10.5,574],[352,8.5,582],[318,9.5,583],[284,13,578],[256,25,549],[232,39.5,515],[204,y-.5,501.5],[185,y,500],[150,y,500],[fe,y,ue]]),E=(e,t)=>L.nearestXZ(e,t).u,s0=L.length/882.33,V0=e=>1-(1-e)*s0,$=e=>D0(1-(1-e)/s0,0,1),pe=(e,t,o,s)=>y0(t-s,t+s,e)*(1-y0(o-s,o+s,e)),h0=new r.Vector3;await v.yield();const he=new r.PlaneGeometry(834,730,167,146);he.rotateX(-Math.PI/2),he.translate(87,0,360),await v.yield();const ve={value:new r.Vector4(596,596,C.range(0,F0),0)},de={value:new r.Vector4(300,380,N===1?1:0,.5)},Re={value:0},Ue={value:Array.from({length:6},()=>new r.Vector4(0,0,0,0))},k0=Math.round(R.misc.range(245,252)),ee=286.5,O0=E(k0,298),He=new r.Mesh(he,n(eo,to,{uVellum:{value:K[0].clone()},uPageTint:{value:new r.Color(k.tint[0],k.tint[1],k.tint[2])},uBeamCol:{value:D(k.light)},uInk:ve,uBeam:de,uPaw:Ue,uSeason:{value:m},uBlockFlare:c0,uHeroXZ:{value:k0},uBarG:Re},{side:r.FrontSide}));He.frustumCulled=!1,b.add(He),await v.yield();const te=new r.Mesh(new r.SphereGeometry(1800,32,20),new r.ShaderMaterial({uniforms:{uRoom:{value:D(k.room)},uRoomGlow:{value:D(k.glow)},uCandleDir:Z.uCandleDir,uCandleCol:Z.uCandleCol,uTime:Z.uTime,uCandleI:Z.uCandleI,uHour:{value:N},uShelf:{value:k.shelf},uWin:{value:D(k.win)}},vertexShader:"varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:oo,side:r.BackSide,depthWrite:!1,depthTest:!1,fog:!1}));te.renderOrder=-1,te.frustumCulled=!1,b.add(te),await v.yield();const Ne=1.25,me=[],xe=[],oe=[],ge={M:[],T:[]},ae={M:[],T:[]};let j0=ae;const qt=[.015,.0115,.009],Pt=[K[4].r,K[4].g,K[4].b],Dt=[K[2].r*1.3,K[2].g*1.3,K[2].b*1.3],Bt=(e,t,o,s,c,f)=>{j0.M.push(o,0,0,0,0,s,0,0,0,0,c,0,e,T(e,t)-.4,t,1),j0.T.push(f[0],f[1],f[2])},we=(e,t,o,s=3.1)=>{for(let c=e,f=0;c<t;c+=s*.74,f++)me.push(c,T(c,o)-.15,o),xe.push(f%2?.62:-.62,0,s),oe.push(4,-1,(f%2?.75:.25)+.2*R.text(),1.45)},X0=(e,t,o,s,c,f=Ne)=>{const u=R.text;let x=t+u.range(0,3);const d=u.chance(.3)?u.range(t+(o-t)*.68,o-12):o;for(;x<d;){const M=u.int(2,7),S=u.chance(.05),X=u.chance(.6)?Pt:Dt,q=S&&j0===ge;for(let e0=0;e0<M&&x<d;e0++){const a0=!c&&u.chance(.07),G0=!c&&!a0&&u.chance(.04);Bt(x,e+u.range(-.15,.15)+(a0?-s*.32:G0?s*.3:0),1.25,(a0?f*1.35:f)*u.range(.96,1.05),s*(a0||G0?1.62:1),q?X:qt),x+=u.range(2.5,3.1)}x+=u.range(3.4,6)}d<o&&we(d+3,o-1,e,f<4?2.3:3.1)};for(let e=0;e<26;e++){const t=67+14*e;j0=e>=14&&e<=19?ge:ae,e===16?X0(290.2,k0+11,330,3.6,!0):e===17?X0(305.8,244,330,3.6,!0):e===15||e===18?X0(t,257,330,5,!0):X0(t,50,330,5,!1,e>=20?.95:Ne),e>=15&&e<=18&&(j0=ae,X0(e===16?290.2:e===17?305.8:t,50,186,e===16||e===17?3.6:5,!0))}await v.yield(),we(196,k0-10,288.2,2.7),we(196,240,307.8,2.7);const Ke={value:K[0]},St=n(dt,mt,{uVellum:Ke}),Vt=l(dt,mt,{uVellum:Ke}),It=_e(!1);for(const[e,t]of[[ge,_e(!0)],[ae,_e(!1)]]){const o=e.T.length/3,s=new r.InstancedMesh(t,St,o);s.instanceMatrix=new r.InstancedBufferAttribute(new Float32Array(e.M),16),t.setAttribute("aTint",new r.InstancedBufferAttribute(new Float32Array(e.T),3)),s.frustumCulled=!1,b.add(s);const c=new r.InstancedMesh(It,Vt,o);c.instanceMatrix=s.instanceMatrix,c.frustumCulled=!1,c.renderOrder=1,b.add(c)}await v.yield();const ne=new r.Mesh(new r.BoxGeometry(14,14,3),n(Ct,kt,{uBlockFlare:c0}));ne.position.set(k0,T(k0,ee)+6.8,ee),ne.rotation.y=-.5,b.add(ne);const $e=l(Ct,kt,{uBlockFlare:c0});w(ne,$e),await v.yield();const v0=await Qt(v,{palette:ut,candleDir:[Math.cos(k.el)*Math.cos(O),Math.sin(k.el),Math.cos(k.el)*Math.sin(O)],glow:!1,demo:!1});v0.object.position.set(fe,A,ue),v0.object.rotation.y=Math.PI/2,b.add(v0.object),v0.uniforms.uPaint.value.copy(Z.uPaint.value),v0.uniforms.uCandleCol.value.copy(Z.uCandleCol.value);const Z0=new r.Mesh(new r.PlaneGeometry(90,90).translate(0,45,0),$e);Z0.position.copy(v0.object.position),Z0.rotation.y=Math.PI/2,Z0.frustumCulled=!1,Z0.renderOrder=1,b.add(Z0),await v.yield();const d0=ro(),g=R.vine,Tt=.085,Wt=ve.value.z,Oe=e=>ht+5*Math.sin(e*.035+Wt),Lt=e=>$(.4+(596-e)/346*.24),m0=(e,t,o,s,c,f,u,x,d=1)=>{me.push(t,o,s),xe.push(c,f,u),oe.push(e,x,g(),d)},Et=(e,t)=>(L.pointAt(E(e,t),h0),Math.atan2(h0.x-e,h0.z-t)),je=(e,t,o,s,c=1)=>{const f=(e>338&&o>335&&o<600?g.range(6,9):g.range(4.2,6))*c,u=g.range(1.5,2);L.distanceTo(e,t+f*u*.5,o)<f*u*.5+7||m0(g.chance(.5)?2:3,e,t-.3,o,Et(e,o)+g.range(-.35,.35),g.range(-.1,.12),f,s,u)},ye=(e,t,o,s,c)=>L.distanceTo(e[0],e[1]+c*.5,e[2])>c*.5+4.5&&m0(g.chance(.17)?1:0,e[0],e[1]+.15,e[2],Math.PI/2-(t+o*g.range(.9,1.35)),g.range(.7,1.15),c,s),Gt=(e,t,o,s,c,f,u,x=2.2)=>{const d=[[e,T(e,t)+.5,t]],M=1.5,S=f*F0;let X=0;for(;X<S&&d.length<60;){const q=Math.max(1.3,c*(1-.75*X/S));if(o+=s*M/q,X+=M/q,e+=Math.cos(o)*M,t+=Math.sin(o)*M,u&&!u(e,t))return null;d.push([e,T(e,t)+.5+x*X/S,t])}return d},be=(e,t,o,s,c,f=.4,u=g.range(6.5,10),x=4)=>{let d=null;for(let S=0;S<3&&!d;S++)d=Gt(e[0],e[2],t+o*g.range(.5,.9),-o,u,g.range(1.2,1.7),c),u*=.7;if(!d||d.length<6)return;d[0][1]=e[1],d0.add(d,f,f*.45,S=>s+S*.0011);for(let S=2;S<d.length-2;S+=3){const X=d[S],q=Math.atan2(d[S+1][2]-d[S-1][2],d[S+1][0]-d[S-1][0]);ye(X,q,o,s+S*.0011+.012,g.range(.8,1.2)*x)}const M=d[d.length-1];x>=3&&je(M[0],M[1],M[2],Math.max(s+d.length*.0011,E(M[0],M[2])-.045))},x0=(e,t,o,s=(f,u)=>E(f,u)-Tt,c=.5)=>{const f=Math.ceil(t/1.5),u=[];for(let q=0;q<=f;q++){const[e0,a0]=e(q/f);u.push([e0,T(e0,a0)+.55,a0])}const x=u.map(q=>s(q[0],q[2]));d0.add(u,c,c*.8,q=>x[q]);let d=g.range(5,12),M=2,S=g.sign(),X=1;for(let q=1;q<f;q++){const e0=q*1.5,a0=Math.atan2(u[q+1][2]-u[q-1][2],u[q+1][0]-u[q-1][0]);e0>M&&(M+=g.range(3.4,4.8)/H,X=-X,ye(u[q],a0,X,x[q]+.012,g.range(3.2,4.8))),e0>d&&(d+=g.range(13,19)/H,S=-S,be(u[q],a0,S,x[q]+.004,o))}},g0=()=>g.range(0,F0),R0=(e,t)=>e>338&&e<468&&t>25&&t<596;{const e=g0();x0(t=>{const o=250+310*t;return[398+9*Math.sin(o*.03+e),o]},315,R0)}await v.yield();{const e=g0();x0(t=>{const o=40+550*t;return[352+5*Math.sin(o*.027+e),o]},555,R0)}await v.yield(),await v.yield();{const e=g0();x0(t=>{const o=60+530*t;return[423+6*Math.sin(o*.024+e),o]},535,R0)}await v.yield();{const e=g0();x0(t=>{const o=40+215*t;return[380+7*Math.sin(o*.033+e),o]},220,R0)}await v.yield();{const e=g0();x0(t=>{const o=40+550*t;return[447+5*Math.sin(o*.031+e),o]},555,R0)}await v.yield();{const e=g0();x0(t=>{const o=455-435*t;return[o,591+2.5*Math.sin(o*.04+e)]},440,(t,o)=>o>576&&o<597.5&&t>8&&t<470)}await v.yield();{const e=g0();x0(t=>{const o=452+96*t;return[131.5+2*Math.sin(o*.08+e),o]},98,(t,o)=>t>124&&t<141,(t,o)=>$(.6+.0028*Math.abs(o-500)),.42)}await v.yield();{const e=g0();x0(t=>{const o=380+300*t;return[28+5*Math.sin(o*.03+e),o]},302,(t,o)=>t>6&&t<47,(t,o)=>$(.56+(o-380)*8e-4))}await v.yield();{const e=g0();x0(t=>{const o=482-464*t;return[o,656+7*Math.sin(o*.03+e)]},470,(t,o)=>o>627&&o<713&&t>6&&t<494)}await v.yield(),await v.yield();const P={x:406,y:16.2,z:590,r:13.5,yaw:Math.PI+.3};{const e=E(P.x,P.z)-.36,t=[],o=[],s=Math.cos(P.yaw),c=-Math.sin(P.yaw),f=Math.sin(P.yaw),u=Math.cos(P.yaw);for(let x=0;x<=50;x++){const d=x/48*F0,M=Math.sin(d);t.push([P.x+s*P.r*M,P.y+P.r*Math.cos(d),P.z+c*P.r*M]);const S=P.r+.8*Math.cos(d*7),X=.8*Math.sin(d*7);o.push([P.x+s*S*M+f*X,P.y+S*Math.cos(d),P.z+c*S*M+u*X])}d0.add(t,.8,.8,()=>e),d0.add(o,.42,.42,x=>e+x*6e-4),d0.add([[P.x,T(P.x,P.z),P.z],[P.x+f*.4,1.4,P.z+u*.4],[P.x,P.y-P.r,P.z]],.7,.55,()=>e);for(const[x,d,M]of[[380,545,6.6],[414,567,5.8]])m0(g.chance(.5)?2:3,x,T(x,d)-.3,d,Math.PI+g.range(-.25,.25),g.range(-.06,.08),M,E(x,d)-.2,2.1);for(let x=1;x<48;x+=2){if(x>19&&x<29)continue;const d=t[x],M=x>12&&x<36?-1:1;m0(x%6===1?1:0,d[0],d[1]+(M<0?-.3:.3),d[2],P.yaw+(M<0?Math.PI:0)+g.range(-.3,.3),M<0?Math.PI-g.range(.05,.3):g.range(.05,.3),g.range(3.2,4.4),e+.03+x*.0012)}}const f0={x:428,z:552,top:15.5};{const e=E(f0.x,f0.z)-.13,t=[],o=T(f0.x,f0.z);for(let s=0;s<=60;s++){const c=s/60,f=c*3*F0,u=6*(1-.8*c);t.push([f0.x+u*Math.cos(f),o+.4+f0.top*Math.pow(c,.9),f0.z+u*Math.sin(f)])}d0.add(t,.9,.55,s=>e+s*6e-4)}const j={x:350,z:518,top:9.5};{const e=E(j.x,j.z)-.13,t=T(j.x,j.z);d0.add([[j.x-2,t+.3,j.z+3],[j.x-.5,t+2.5,j.z+1.5],[j.x+.4,t+5,j.z+.3],[j.x,t+j.top,j.z]],.6,.45,()=>e),m0(0,j.x-5,t+j.top-1.4,j.z,Math.PI/2,1.3,16,e+.01),m0(0,j.x+1,t+j.top-1.2,j.z,-Math.PI/2,1.2,10,e+.02)}const l0={x:448,z:476};if(i.dragon){const e=T(l0.x,l0.z),t=[],o=E(l0.x,l0.z)-.075;for(let s=0;s<=18;s++){const c=s/18,f=l0.z-8.5-32*c,u=l0.x+4*Math.sin(c*4.2);t.push([u,_0(e+7,T(u,f)+.5,$0(c*1.7)),f])}d0.add(t,1.1,.5,s=>o+s*.0012);for(let s=4;s<18;s+=3)ye(t[s],-Math.PI/2,s%2?1:-1,o+s*.0012+.012,g.range(2.6,3.6));be(t[18],-Math.PI/2,g.sign(),o+.022,R0,.42,9)}await v.yield();const se=(e,t,o,s,c,f,u,x=.12,d=1,M=1)=>{const S=T(e,t),X=26,q=[],e0=o/30,a0=e0*d,G0=(Q,i0,u0)=>L.distanceTo(Q[0],i0,Q[2])>u0,ce=g.sign()*o*.045,Y0=g.range(0,1);for(let Q=0;Q<=X;Q++){const i0=Q/X,u0=ce*Math.sin(i0*5.2+Y0)*(.3+.7*i0);q.push([e+s*u0,S+.3+o*i0,t+c*u0])}d0.add(q,.95*e0*M,.4*e0*M,Q=>u(Q/X));let t0=g.sign();for(const Q of[.16,.34,.52,.68,.82]){t0=-t0;const i0=q[Math.round(Q*X)],u0=o*(.2-.09*Q)*g.range(.85,1.1),ct=g.range(1.25,1.55)*F0,$t=u0/6,P0=[[i0[0],i0[1],i0[2]]];let Ve=g.range(.45,.75),Ie=0,ft=i0[1],Te=0;for(;Te<ct&&P0.length<64;){const z0=Math.max(u0*.1,u0*(1-.8*Te/ct)),C0=Math.min($t,z0*.55);Ve+=C0/z0,Te+=C0/z0,Ie+=Math.cos(Ve)*C0,ft+=Math.sin(Ve)*C0,P0.push([i0[0]+s*t0*Ie,Math.max(ft,S+.6),i0[2]+c*t0*Ie])}const Ot=u(Q)+.006,We=z0=>Ot+z0*9e-4;d0.add(P0,.6*e0*M,.26*e0*M,We);for(let z0=2;z0<P0.length-3;z0+=3){const C0=P0[z0],Ee=g.range(5,7.5)*a0*(1.05-.4*Q);G0(C0,C0[1]+Ee*.5,Ee*.5+5)&&m0(g.chance(x)?1:0,C0[0],C0[1],C0[2],f+g.range(-.45,.45),g.range(-.15,.5),Ee,We(z0)+.012)}const J0=P0[P0.length-1],Le=g.range(5.5,7)*a0;G0(J0,J0[1],Le*.5+6)&&m0(x>=1?1:g.chance(.5)?2:3,J0[0],J0[1]-Le*(x>=1?.3:.9),J0[2],f+g.range(-.2,.2),g.range(-.05,.1),Le,We(P0.length)+.01,x>=1?1:1.25)}const o0=q[X];m0(1,o0[0],o0[1]-.5*e0,o0[2],f+g.range(-.15,.15),.08,10*a0,u(1)+.01)};for(const[e,t,o]of[[358,374,31],[357,426,35],[424,464,30],[359,478,33],[437,503,36]]){const s=E(e,t);se(e,t,o*g.range(.94,1.06),1,0,Math.atan2(399-e,-45),c=>s-.2+.05*c),await v.yield()}se(227,285.2,19,0,1,-Math.PI/2,()=>-1,1,.82),se(238,310.8,20.5,0,1,-Math.PI/2,()=>-1,1,.82),await v.yield();for(const e of[431,569])se(124,e,76,0,1,Math.PI/2,t=>$(.57+.15*t),.28,.72,.62),await v.yield();await v.yield();for(let e=352;e<566;e+=g.range(11,16))for(const t of[-1,1]){const o=E(399,e);L.pointAt(o,h0);const s=h0.x+t*g.range(13,25);je(s,T(s,e),e,o-g.range(.1,.16))}await v.yield();for(let e=586;e>256;e-=g.range(8,13)/H){const t=Oe(e),o=g.sign();be([t,T(t,e)+.4,e],o>0?0:Math.PI,g.sign(),Lt(e)+.012,null,.26,g.range(3,4.6),2)}await v.yield();for(const[e,t,o]of[[280.5,271.5,286],[315.5,310,326.5]]){const s=g0(),c=e<298?k0-12:253,f=(u,x)=>u>195&&u<c+2&&x>t&&x<o;x0(u=>{const x=198+(c-198)*u;return[x,e+1.6*Math.sin(x*.11+s)]},c-198,f,()=>-1,.45);for(let u=204,x=0;u<c;u+=g.range(4.5,7),x++){const d=e+1.6*Math.sin(u*.11+s)+(e<298?1:-1)*g.range(.5,2.5),M=x%2===1;m0(1,u,T(u,d)+(M?1.2:.2),d,-Math.PI/2+g.range(-.6,.6),M?g.range(1.3,1.6):g.range(.2,.5),g.range(4.4,5.6),-1)}}for(const[e,t,o]of[[293.9,1,276],[302.3,-1,290]]){const s=g0(),c=328;x0(f=>{const u=o+(c-o)*f;return[u,e+.5*Math.sin(u*.2+s)]},c-o,()=>!1,(f,u)=>E(f,u)-.055,.36);for(let f=o+3;f<c;f+=g.range(4,6))m0(1,f,T(f,e)+.2,e-t*g.range(.2,.9),-Math.PI/2+g.range(-.7,.7),g.range(.25,.6),g.range(3,4.2),E(f,e)-.045)}await v.yield();const Xe={uLeaf:{value:new r.Vector4(...h.leaf)},uFlA:{value:new r.Vector4(h.narrow||1,0,0,h.petals)},uLeafCol:{value:D(h.leafCol)},uLeafCol2:{value:D(h.leafCol2)},uFlACol:{value:D(h.flA)},uFlBCol:{value:D(h.flBCol)},uFlB:{value:h.flB}},Ze=new r.Mesh(d0.geometry(),n(ao,no));Ze.frustumCulled=!1,b.add(Ze),await v.yield();const I0=new r.InstancedBufferGeometry,Qe=new r.PlaneGeometry(1,1).translate(0,.5,0);I0.index=Qe.index,I0.setAttribute("position",Qe.getAttribute("position")),I0.setAttribute("iPos",new r.InstancedBufferAttribute(new Float32Array(me),3)),I0.setAttribute("iRot",new r.InstancedBufferAttribute(new Float32Array(xe),3)),I0.setAttribute("iData",new r.InstancedBufferAttribute(new Float32Array(oe),4)),I0.instanceCount=oe.length/4;const Me=new r.Mesh(I0,n(xt,gt,Xe));Me.frustumCulled=!1,b.add(Me),w(Me,l(xt,gt,Xe)),await v.yield(),await v.yield();const M0=co(2048,5),Y=M0.paint,T0=[],w0=[],Ye=.4845;M0.g.clearRect(0,0,1,1);const B=(e,t,o,s=0,c=0,f={})=>(T0.push({name:e,w:t,h:o,px:s,py:c,flip:f.flip?-1:1,glow:f.glow||0,wave:f.wave||0}),T0.length-1);await v.yield();const U=new r.Matrix4,z=new r.Matrix4,Ae=new r.Matrix4,_t=new r.Matrix4,G=new r.Matrix4,Q0=new r.Matrix4,Je=new r.Matrix4,Rt=new r.Vector3,ze=2.85,W0=414,A0=(e,t,o,s,c,f=1)=>c.makeRotationY(s).scale(Rt.set(f,f,f)).setPosition(e,t,o),V=(e,t,o,s,c,f=0)=>c.copy(e).multiply(Ae.makeRotationZ(s).setPosition(t,o,f));let U0=null;const I=(e,t)=>{const o=T0[e];Ae.makeScale(o.w*o.flip,o.h,1).setPosition(-o.px*Ye*o.w*o.flip,-o.py*Ye*o.h,0),U0.setMatrixAt(e,_t.multiplyMatrices(t,Ae))},H0=-Math.PI/2,Ut=Math.PI/2;if(i.joust==="joust"){Y.shell(),Y.snail(),Y.knight(),Y.lance(),Y.hare(),Y.shield();const e=T(442,W0)+.2,t=B("snail",13,13,0,-.72),o=B("shell",8,8),s=B("knight",5.6,5.6,0,-.7),c=B("lance",13,13,-.5,0),f=B("hare",9.5,9.5,0,-.98,{flip:1}),u=B("shield",5,5,-.6,0,{flip:1});w0.push(x=>{const d=x/6;A0(442,e,W0,H0,U,ze),V(U,W(d,[-15,-4.5,-8.5,-15],.35),0,W(d,[0,.03,-.05,0],.35),z),I(t,z),V(z,-1.6,4.6,W(d,[0,.1,-.12,0],.35),G,.08),I(o,G),V(G,.3,3.4,W(d,[0,.06,-.2,0],.35),Q0,.08),I(s,Q0),V(Q0,.7,.7,W(d,[.1,-.02,.5,.1],.35),Je,.08),I(c,Je),V(U,W(d,[7,7,10,7],.35),0,W(d,[0,.12,-.32,0],.35),z),I(f,z),V(z,-1.2,5.2,W(d,[.2,-.1,.7,.2],.35),G,.08),I(u,G)})}else if(i.joust==="monkeys"){Y.monkey(),Y.mArmPipe(),Y.mArmStick(),Y.tabor();const e=T(442,W0)+.2,t=B("monkey",10,10,0,-.95),o=B("mArmPipe",6,6,-.9,0),s=B("tabor",4.6,4.6),c=B("monkey",10,10,0,-.95,{flip:1}),f=B("mArmStick",5.5,5.5,-.9,0,{flip:1}),u=B("monkey",8.5,8.5,0,-.95,{flip:1}),x=B("mArmPipe",5,5,-.9,0,{flip:1});w0.push(d=>{const M=d/3.6;A0(442,e,W0,H0,U,ze),V(U,-11,0,W(M,[-.06,.08,0],.5),z),I(t,z),V(z,.5,5.3,W(M,[.22,.5,.08],.5),G,.1),I(o,G),V(U,3.5,0,W(M+.3,[.05,-.07,0],.5),z,.05),I(c,z),V(z,-3.6,3.3,W(M*2,[.08,-.06],.3),G,.08),I(s,G),V(z,-.5,5,W(M*2,[-.75,.15],.3),G,.14),I(f,G),V(U,12.5,W(M+.5,[0,2.4,.5],.4),W(M+.5,[.1,-.3,.2],.4),z,.03),I(u,z),V(z,-.4,4.4,W(M+.5,[-.3,-1.1,-.6],.4),G,.1),I(x,G)})}else{Y.pulpit(),Y.fox(),Y.foxArm(),M0.bird("goose",{c:a.wht,d:a.gry,nx:.5,ny:.56});const e=T(442,W0)+.2,t=B("pulpit",11,11,0,-.98),o=B("fox",10.5,10.5,0,-.9),s=B("foxArm",5.5,5.5,-.9,0),c=[0,1,2,3].map(()=>B("goose",7,7,0,-.92,{flip:1}));w0.push(f=>{const u=f/5;A0(442,e,W0,H0,U,ze),V(U,-11,5.8,W(u,[-.06,.1,.02],.5),G),I(o,G),V(U,-11,0,0,z,.1),I(t,z),V(G,1.2,5.5,W(u,[.9,.1,1.2],.5),Q0,.18),I(s,Q0),c.forEach((x,d)=>{V(U,-1+6.4*d,W(u+d*.21,[0,0,1.3],.5),W(u+d*.17,[0,-.28,.12],.5),z,.03*d),I(x,z)})})}await v.yield();{const t=(i.chase==="hound"?[["hareRun",{c:a.tan,d:a.tanD,ear:"long",tail:"scut"},9],["hound",{c:a.wht,d:a.gry,ear:"flop",tail:"long",snout:!0,collar:!0},11.5]]:[["mouse",{c:a.brn,d:a.brnD,ear:"round",tail:"thin"},7],["cat",{c:"#8E8A80",d:"#66625A",ear:"point",tail:"long",fat:1.15},11.5]]).map(([o,s,c])=>(M0.beast(o,s),{s:c,b:B(o,c,c),f:B(o+"Legs",c*.45,c*.45,0,.85),h:B(o+"Legs",c*.45,c*.45,0,.85)}));w0.push(o=>{A0(P.x,P.y,P.z,P.yaw,U),t.forEach((s,c)=>{const f=-o*.85+c*1.25,u=P.r+.5+s.s*.36,x=o*2.6+c*.4;V(U,u*Math.cos(f),u*Math.sin(f),f-Math.PI/2+W(x,[.12,-.1],.2),z,.4+c*.1),I(s.b,z),V(z,s.s*.2,-s.s*.02,W(x,[.6,-.5],.2),G,-.04),I(s.f,G),V(z,-s.s*.2,-s.s*.02,W(x,[-.5,.6],.2),G,-.05),I(s.h,G)})})}await v.yield();{M0.bird("peacock",{c:a.lap,d:a.lapD,c2:a.grn,crest:!0,nx:.42,ny:.62}),Y.fan();const e={x:350,z:664},t=T(e.x,e.z)+.2,o=[0,1,2,3,4,5,6].map(()=>B("fan",10.5,10.5,0,-.95)),s=B("peacock",10,10,0,-.95);w0.push(c=>{const f=c/7,u=W(f,[.1,.5,.9,1.3],.7);A0(e.x,t,e.z,Math.PI,U,3),o.forEach((x,d)=>{V(U,-2.1,3.9,.3+(d-3)/3*u,z,-.05-.012*Math.abs(d-3)),I(x,z)}),V(U,0,0,W(f,[0,.03,-.03,.05],.7),z,.05),I(s,z)})}if(i.dragon){Y.dragon(),Y.wing();const e=T(l0.x,l0.z)+.2,t=B("dragon",12,12,0,-.9),o=B("wing",8.2,8.2,-.8,-.8);w0.push(s=>{const c=s/3.2;A0(l0.x,e,l0.z,H0,U,2.1),V(U,0,0,W(c,[0,.05,-.03],.5),z),I(t,z),V(z,-.8,5.3,W(c,[.05,.8,.3],.5),G,-.06),I(o,G)})}else{M0.bird("cock",{c:a.och,d:a.ochD,c2:a.ver,comb:!0,tail:"plume",nx:.4,ny:.42});const e=T(l0.x,l0.z)+.2,t=[B("cock",8.5,8.5,0,-.92),B("cock",8.5,8.5,0,-.92,{flip:1})];w0.push(o=>{A0(l0.x,e,l0.z,H0,U,2.1),t.forEach((s,c)=>{const f=c?1:-1,u=o/2.4+c*.5;V(U,f*W(u,[6.5,3,6.5],.4),W(u,[0,3.2,0],.4),-f*W(u,[0,.4,-.1],.4),z,c*.05),I(s,z)})})}await v.yield();{Y.castle(),Y.mill();const e=B("castle",25,25,0,-.95,{glow:1}),t=B("mill",16,16,0,-.98,{glow:1}),o=B("millSails",20,20),s=T(f0.x,f0.z)+f0.top,c=T(j.x,j.z)+j.top-.4;w0.push(f=>{A0(f0.x,s,f0.z,H0,U),V(U,0,0,Math.sin(f*.6)*.03,z),I(e,z),A0(j.x,c,j.z,Ut,U),V(U,0,0,Math.sin(f*.5+1)*.02,z),I(t,z),V(z,0,10.2,f*.9,G,.1),I(o,G)})}await v.yield();const q0={x:480,y:0};{let e,t=-1,o=-1;i.ship?(Y.hull(),Y.sail(),Y.pennant(),e=B("hull",15,15,0,-.46),t=B("sail",8.6,8.6,0,.82,{wave:.05}),o=B("pennant",5,5,-.95,0,{wave:.14,flip:1})):(M0.bird("swan",{c:a.wht,d:a.gry,c2:a.wht,sNeck:!0,nx:.56,ny:.66,legs:!1,beak:a.ver}),e=B("swan",13,13,0,-.52)),w0.push((s,c)=>{q0.x=D0(358-(c-.66)*980,30,492);const f=Math.sin(s*1.3+q0.x*.3)*.45+Math.sin(s*2.1)*.2;q0.y=T(q0.x,611.5)+1.7+f,A0(q0.x,q0.y,611.5,Math.PI,U),V(U,0,0,Math.sin(s*1.3+1)*.07,z),I(e,z),t>=0&&(V(z,0,10.2,Math.sin(s*.9)*.04,G,.06),I(t,G),V(z,0,10.9,.1*Math.sin(s*2),G,.1),I(o,G))})}await v.yield(),M0.finish();const le=new r.CanvasTexture(M0.cv);le.colorSpace=r.SRGBColorSpace,le.anisotropy=4,await v.yield();const Ce=new r.PlaneGeometry(1,1,6,1),et=new Float32Array(T0.length*4),tt=new Float32Array(T0.length*4);T0.forEach((e,t)=>{et.set(M0.rects[e.name],t*4),tt.set([e.glow,e.wave,R.cast.range(0,2),e.flip],t*4)}),Ce.setAttribute("iUV",new r.InstancedBufferAttribute(et,4)),Ce.setAttribute("iFx",new r.InstancedBufferAttribute(tt,4));const ot={value:le};U0=new r.InstancedMesh(Ce,n(wt,yt,{uAtlas:ot}),T0.length),U0.frustumCulled=!1,b.add(U0),w(U0,l(wt,yt,{uAtlas:ot}));for(const e of w0)e(0,0);await v.yield(),[[604,4,1,5.5],[609,5,-1,6.5],[615,6.5,1,7.5]].forEach(([e,t,o,s],c)=>{const f=new r.Mesh(new r.PlaneGeometry(524,t,130,1).translate(248,t/2-1,e),n(so,lo,{uRow:{value:new r.Vector4(o,c,s,0)}}));f.frustumCulled=!1,b.add(f)}),await v.yield();const ke=[new r.CylinderGeometry(.35,1.05,190,8,1,!0).translate(0,105,0),new r.CylinderGeometry(1.05,.08,10,8,1,!0).translate(0,5,0),new r.PlaneGeometry(26,186,2,18).translate(0,107,0)];ke.forEach((e,t)=>e.setAttribute("aK",new r.Float32BufferAttribute(new Float32Array(e.attributes.position.count).fill(t===2?1:0),1)));const at={uRoom:{value:D(k.room)}},L0=new r.Mesh(Zt(ke),n(At,zt,at));L0.frustumCulled=!1,b.add(L0);const nt=w(L0,l(At,zt,at));ke.forEach(e=>e.dispose()),await v.yield();const J=R.fly,N0=Math.round(70*H*p),ie=N0+18,Fe=new Float32Array(ie*3),qe=new Float32Array(ie*4),Pe=new r.Vector3;for(let e=N0;e<ie;e++){const t=e-N0>=8,o=t?266+(e-N0-8)*7+J.range(-3,3):J.range(230,264),s=298+J.sign()*J.range(8,12.5);Fe.set([o,t?J.range(6,11.5):J.range(6.5,11),s],e*3),qe.set([J.range(0,25),J.range(1.5,2.3),J(),J.range(.6,1.1)],e*4)}for(let e=0;e<N0;e++){const t=.012+.96*(e+J())/N0;L.pointAt(t,h0),L.tangentAt(t,Pe);const o=h0.x<335&&h0.z<310,s=J.sign(),c=o?J.range(8,13):J.range(5,20),f=h0.x-Pe.z*s*c,u=h0.z+Pe.x*s*c;Fe.set([f,Math.max(T(f,u)+3,h0.y+(o?J.range(-3,3):J.range(-4,6))),u],e*3),qe.set([J.range(0,25),J.range(1,1.9),J(),J.range(.6,1.2)],e*4)}const K0=new r.InstancedBufferGeometry,st=new r.PlaneGeometry(2,1,2,1).rotateX(-Math.PI/2);K0.index=st.index,K0.setAttribute("position",st.getAttribute("position")),K0.setAttribute("iC",new r.InstancedBufferAttribute(Fe,3)),K0.setAttribute("iD",new r.InstancedBufferAttribute(qe,4)),K0.instanceCount=ie;const re={value:new r.Vector4(0,0,0,0)},De=new r.Mesh(K0,n(bt,Mt,{uScare:re}));De.frustumCulled=!1,b.add(De),w(De,l(bt,Mt,{uScare:re})),await v.yield();const lt=Xt.makeParticles({rng:R.misc,preset:"dust",time:Z.uTime,count:Math.round((N===1?240:420)*p),box:[80,40,80],size:N===1?[.15,.5]:[.3,1],intensity:N===1?.35:.5,twinkle:.2,colors:N===1?["#FFFFFF","#E6F0FF","#FFF6DC"]:["#FFD98A","#FFC060","#FFF0C0"]});b.add(lt.object);const E0=new r.Group,Be=[],it={uA:{value:0},uT:Z.uTime},Ht=new r.Vector3;if(pt){const e=new r.MeshBasicMaterial({color:new r.Color(.045,.03,.018),fog:!1});for(const t of[-1,1]){const o=new r.CatmullRomCurve3([new r.Vector3(0,0,0),new r.Vector3(t*.14,.17,-.4),new r.Vector3(t*.34,.21,-.8),new r.Vector3(t*.46,.09,-1.1)]),s=new r.Group;s.position.set(t*.16,-.95,-.9),s.add(new r.Mesh(new r.TubeGeometry(o,14,.02,6),e));const c=new r.Mesh(new r.SphereGeometry(.042,8,6),e);c.position.set(t*.46,.09,-1.1),s.add(c),E0.add(s),Be.push(s);const f=new r.Mesh(new r.PlaneGeometry(1.2,2.4),new r.ShaderMaterial({uniforms:it,transparent:!0,depthWrite:!1,depthTest:!1,blending:r.AdditiveBlending,vertexShader:"varying vec2 vUv; void main(){ vUv = uv - 0.5; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:"uniform float uA, uT; varying vec2 vUv; void main(){ vec2 q = vUv * vec2(2.2, 1.6); float g = exp(-dot(q, q) * 5.0) * (0.85 + 0.15 * sin(vUv.y * 9.0 + uT * 61.0) * sin(vUv.y * 5.0 - uT * 37.0)); gl_FragColor = vec4(vec3(0.9, 0.85, 0.7) * g * uA, 1.0); }"}));f.position.set(t*1.98,-.1,-1.6),f.rotation.y=-t*.5,f.renderOrder=20,E0.add(f)}E0.visible=!1,b.add(E0)}await v.yield();const Se=[];if(p0)for(let e=0;e<6;e++){const t=446+e*23+R.misc.range(-4,4),o=426+(e%2?13:-9)+R.misc.range(-3,3);Se.push({x:o,z:t,u0:.33+e*.035,rot:Math.PI+(e%2?-.2:.2)+R.misc.range(-.15,.15)})}const Nt=new r.Vector3,Kt=new r.Vector3(fe,y,ue),rt=Z.uCandleDir.value;return{scene:b,path:L,duration:42,pace:e=>1+.4*(1-y0(.1,.19,e))-.3*pe(e,$(.31),$(.44),.035)-.25*pe(e,$(.62),$(.72),.03)-.2*pe(e,$(.76),$(.88),.03),title:"The Gilded Margin",ride:"none",style:"none",camera:{fov:62,near:.3,far:3e3,lookAhead:24,bank:.35},pois:[{at:[k0,T(k0,ee)+8,ee+1],from:0,to:O0+.02,weight:.4},{at:[442,15,W0-6],from:$(.265),to:$(.43),weight:.6},{at:[P.x,P.y-2,P.z],from:$(.47),to:$(.585),weight:.5},{at:()=>Nt.set(q0.x,q0.y+5,611.5),from:$(.6),to:$(.7),weight:.5},{at:Kt,from:$(.66),to:1,weight:.8}],portal:{shape:"circle",radius:7,color:N===1?"#EAF2FF":"#FFD890",glow:1,revealDistance:280},post:{exposure:1.08,bloom:{strength:.45,radius:.6,threshold:1},grade:{saturation:1.06,contrast:1.03,tint:k.grade,shadowTint:"#000000",vignette:.25,grain:.035,aberration:0}},update(e,t,o,s){Z.uTime.value=t,Z.uU.value=s;const c=s;s=V0(s);const f=F?Ge(s,.26,.42,.3)*(.65+.35*Math.sin(t*2.1)):0;Z.uGust.value=f;const u=y0(.765,.8,s),x=_0(O,Math.abs(O),y0(.5,.64,s))*(1-u)+.1*Math.sin(t*.7)+.05*Math.sin(t*1.9+1)+f*.3*Math.sin(t*3.1),d=k.el+.025*Math.sin(t*1.3)+f*.05*Math.sin(t*2.3);let M=1+.1*Math.sin(t*9)*Math.sin(t*5.3+1)+.04*Math.sin(t*23);N===2&&(M*=.8+.2*Math.sin(t*2.3)*Math.sin(t*1.7+2)),N===1&&(M=1+.03*Math.sin(t*.9)),rt.set(Math.cos(d)*Math.cos(x),Math.sin(d),Math.cos(d)*Math.sin(x));const S=Ge(s,.77,.9,.3);if(Z.uCandleI.value=M*k.I*(1+.35*S),c0.value=Math.max(Ge(c,O0-.045,O0+.04,.4),.45*(1-y0(O0,O0+.06,c)))*(.85+.15*M),v0.setCandle(rt,Z.uCandleI.value),v0.setProgress(D0((s-.775)/.075,0,1)),v0.setGrowth(.5+.57*$0((s-.45)/.5)),v0.update(e,t,o),Z.uFlare.value=v0.flare,te.position.setFromMatrixPosition(o.matrixWorld),N===1){const t0=$0(s/.8);de.value.x=_0(455,205,t0*t0)+6*Math.sin(t*.1),de.value.y=_0(330,500,Math.sqrt(t0))}const X=D0((s-.4)/.24,0,1),q=_0(596,250,X),e0=$0((s-.33)/.07),a0=$0((s-.64)/.06),G0=s<.3||s>.72,ce=Oe(q);L0.position.set(ce+(1-e0)*120+(G0?5e3:0),T(ce,q)+(1-e0+a0)*160,q+(1-e0)*60),L0.rotation.set(.12+.03*Math.sin(t*5),0,-.44+.04*Math.sin(t*3.3)),nt.position.copy(L0.position),nt.quaternion.copy(L0.quaternion),ve.value.y=s<.4?596:q,Re.value=y0(.55,.71,s);for(const t0 of w0)t0(t,s);U0.instanceMatrix.needsUpdate=!0;let Y0=0;for(let t0=0;t0<Se.length;t0++){const o0=Se[t0],Q=s-o0.u0,i0=D0(Q/.03,0,1)*.5+D0((Q-.03)/.12,0,1)*.5;if(Ue.value[t0].set(o0.x,o0.z,i0,o0.rot),Q>0&&Q<.035){const u0=Math.sin(Q/.035*Math.PI);u0>Y0&&(Y0=u0,re.value.set(o0.x,o0.z,u0,0))}}if(re.value.z=Y0,lt.update(e,t,o),pt){const t0=y0(0,.012,c)*(1-y0(.985,1,c));E0.visible=t0>.001,o.matrixWorld.decompose(E0.position,E0.quaternion,Ht);for(let o0=0;o0<Be.length;o0++){const Q=Be[o0];Q.rotation.x=(1-t0)*-.5+.05*Math.sin(t*2.3+o0*1.7)+.02*Math.sin(t*7.1+o0),Q.rotation.z=.04*Math.sin(t*1.7+o0*2.2)}it.uA.value=t0*(.15+.05*Math.sin(t*53)*Math.sin(t*31))}},dispose(){le.dispose()}}}};export{vo as default};
