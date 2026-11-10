import*as u from"three";import{makePath as je,clamp as H0,lerp as Qe,smoothstep as r0,bell as ee}from"../kit/core.js";import{buildHero as Ke,styleMaterial as j0}from"../parts/litho-medusae.js";const G=Math.PI*2,Oe=["#E4E7D3","#3A2A1E","#C9627C","#5E9E90","#C8973A","#3F6F66"],We=`
attribute vec4 aK, aD, aB, aI; attribute vec3 aPv;
uniform vec3 uReg; uniform float uForce;
varying vec3 vRest, vN, vWp, vInk, vBy; varying vec2 vUv; varying vec4 vK, vD;
void main() {
  float sg = aI.x < 0.0 ? -1.0 : 1.0;
  float t = uTime - (sg < 0.0 ? 0.5 : 0.0);
  float rate = aI.z, ph = aI.y;
  vec3 p = position;
  float bt = lmBeat(t * rate + ph - aB.w);                         // pulse: toward the pivot
  p = mix(p, aPv, aK.z * bt);
  float rw = fract(t * rate + ph + aB.w);                          // rowing: a fast power stroke, a slow return
  float jerk = smoothstep(0.0, 0.16, rw) * (1.0 - smoothstep(0.16, 0.9, rw));
  p.z -= aK.y * jerk; p.y += aK.y * 0.35 * jerk;
  float a = t * (1.1 + rate) + ph * 6.283 + aB.w * 6.283;          // wave: tails, tentacles, curtains
  p.x += aK.w * sin(a); p.z += aK.w * 0.7 * cos(a * 0.83 + 1.3);
  mat4 im = modelMatrix * instanceMatrix;
  vec4 wp = im * vec4(p, 1.0);
  vec3 n = mat3(im) * normal;
  vec3 o = im[3].xyz;
  wp.x *= sg; n.x *= sg; o.x *= sg;
  float d = length(o - cameraPosition);
  vInk = max(vec3(uForce), 1.0 - smoothstep(uReg - 30.0, uReg, vec3(d)));
  vRest = position + vec3(3.7, 1.3, 5.1) * aI.w;
  vN = n; vWp = wp.xyz; vUv = uv; vK = aK; vD = aD; vBy = aB.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,Ne=`
uniform float uSeed, uFres, uSil, uSh, uNightK, uTime;
varying vec3 vRest, vN, vWp, vInk, vBy; varying vec2 vUv; varying vec4 vK, vD;
void main() {
  float w = lmLineW(vRest);
  float lattice = step(0.5, vBy.z);                                // hexagonal pores cut from the barycentrics
  vec3 b = vec3(vBy.xy, 1.0 - vBy.x - vBy.y);
  float hi = max(b.x, max(b.y, b.z)), lo = min(b.x, min(b.y, b.z)), e = hi - (1.0 - hi - lo);
  float fe = max(fwidth(e), 1e-5), bw = max(vD.z, 1.1 * fe);       // bars never thinner than about 2 px
  bool cut = lattice > 0.5 && e > bw;                              // the pores are decided here and cut after the silhouette line: a derivative taken after a discard is not defined
  float hexLine = lattice * lmLine((bw - e) / fe, w * 0.8) * step(2.4 * fe, vD.z);
  float fu = max(fwidth(vUv.x), 1e-6), fvy = max(fwidth(vUv.y), 1e-6);
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0)), V = normalize(cameraPosition - vWp + vec3(0.0, 1e-5, 0.0));
  // surface ribbons flagged aB.z = 0.25 (the comb rows of the great glass comb jellies) carry the body's outward
  // normal: on the far side of the body they print at 30%, so eight fine rows read, not sixteen straps
  float farK = mix(1.0, mix(0.3, 1.0, smoothstep(-0.1, 0.4, dot(N, V))), step(0.1, vBy.z) * (1.0 - lattice));
  if (dot(N, V) < 0.0) N = -N;
  float ndv = abs(dot(N, V));
  float foot = lmFoot(vRest), g = lmGrain(vRest, foot, uSeed), g2 = lmGrainB(vRest + 23.7, foot, uSeed + 7.0);
  float shade = 0.5 - 0.5 * dot(N, uLight);
  float f1 = max(1.0 - ndv, 0.0), kind = vK.x;
  float tone = vD.x + uSh * smoothstep(0.35, 0.92, shade) + uFres * f1 * sqrt(f1);
  float rG = lmReg(vInk.x, vD.y, g), rR = lmReg(vInk.y, vD.y, g2), rO = lmReg(vInk.z, vD.y, g);
  vec3 m = vec3(1.0);
  if (kind < 0.5) {
    m = mix(m, m * lmMul(uRose), lmOn(tone, g) * rR);
    m = mix(m, m * lmMul(uShade), lmOn(min((tone - 0.72) * 2.4, 0.6), g2) * rG);
  } else if (kind < 1.5) {
    float tg = tone + 0.18 - 0.3 * uNightK;
    m = mix(m, m * lmMul(uGreen), lmOn(tg, g) * rG);
    m = mix(m, lmMul(uDeep), lmOn(min((tg - 0.78) * 2.2, 0.6), g2) * rG);
  } else if (kind < 2.5) {
    m = mix(m, m * lmMul(uOchre), lmOn(0.6 + 0.45 * tone, g) * rO * farK);
  } else {
    m = mix(m, lmMul(uSepia), lmOn(0.55 + 0.5 * tone, g));
  }
  float line = lmLine(ndv / max(fwidth(ndv), 1e-4), w * 0.9) * uSil;
  if (cut) discard;                                                // the pores (decided above): no derivative is taken below this line
  line = max(line, hexLine);
  float lu = vD.z * (1.0 - lattice), lv = vD.w;
  {                                                                // meridians: canals, flutes, strut edges
    float l1 = max(lu, 1.0), a = abs(fract(vUv.x * l1 + 0.5) - 0.5) / (l1 * fu);
    line = max(line, step(0.5, lu) * lmLine(a, w * 0.7) * mix(step(0.35, fract(vUv.y * 9.0)), 1.0, smoothstep(0.45, 0.7, shade)) * 0.85 * smoothstep(2.0, 4.5, 1.0 / (l1 * fu)));
  }
  {                                                                // rings: segments, comb plates (the plates travel)
    float scroll = step(1.5, kind) * step(kind, 2.5) * uTime * 1.6;
    float l2 = max(lv, 1.0), fv = l2 * fvy;
    float r = abs(fract(vUv.y * l2 - scroll) - 0.5) / fv;
    line = max(line, step(0.5, lv) * lmLine(r, w * 0.6) * smoothstep(2.5, 5.0, 1.0 / fv) * 0.8);
  }
  gl_FragColor = lmFinish(m, line * farK, length(cameraPosition - vWp));
}`,Ue=`
attribute vec3 aRoot, aDir; attribute vec4 aH, aG;
uniform float uViewH; uniform vec3 uReg;
varying vec3 vWp, vInk; varying float vS, vSide, vWpx, vCov, vKind, vPh, vHw, vT;
vec3 hairC(float s, vec3 e1, vec3 e2, float L) {
  float reel = 1.0 - aG.z * (0.5 + 0.5 * sin(uTime * 0.45 + aH.z * 3.0));
  float sr = s * reel, a = sr * L * 0.33 - uTime * 0.9 + aH.z, amp = aG.y * sr * L;
  return aRoot + aDir * sr + (e1 * sin(a) + e2 * cos(a * 0.77 + 1.9)) * amp + e1 * amp * 0.7 * sin(sr * 2.3 - uTime * 0.31 + aH.z * 2.0);
}
void main() {
  float sg = aG.w < 0.0 ? -1.0 : 1.0, L = max(length(aDir), 1e-3);
  vec3 dm = aDir * vec3(sg, 1.0, 1.0);                             // wave axes built on the unmirrored twin
  vec3 e1 = cross(dm, vec3(0.31, 0.2, 0.93)); e1 = e1 / max(length(e1), 1e-4);
  vec3 e2 = cross(dm, e1); e2 = e2 / max(length(e2), 1e-4);
  e1.x *= sg; e2.x *= sg;
  vec3 c = hairC(aH.x, e1, e2, L), c2 = hairC(aH.x + 0.02, e1, e2, L);
  vec3 toCam = cameraPosition - c; float dist = max(length(toCam), 0.01);
  vec3 sd = cross(c2 - c, toCam); sd = sd / max(length(sd), 1e-5);
  float pxm = 2.0 / (projectionMatrix[1][1] * max(uViewH, 1.0)) * dist;
  float hw0 = aH.w * (1.0 - 0.55 * aH.x), hw = max(hw0, 0.8 * pxm);
  vec3 wp = c + sd * aH.y * hw;
  vS = aH.x * L; vSide = aH.y; vWpx = hw / pxm; vCov = hw0 / hw; vKind = aG.x; vPh = aH.z; vHw = hw; vT = aH.x;
  vWp = wp; vInk = 1.0 - smoothstep(uReg - 30.0, uReg, vec3(length(aRoot - cameraPosition)));
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
}`,Xe=`
uniform float uTime;
varying vec3 vWp, vInk; varying float vS, vSide, vWpx, vCov, vKind, vPh, vHw, vT;
void main() {
  float e = abs(vSide), w = uPx;
  vec3 rest = vec3(vSide * vHw + vPh * 9.0, vS, vPh * 4.0);
  float foot = lmFoot(rest), g = lmGrain(rest, foot, 3.0);
  float thin = 1.0 - smoothstep(1.2, 3.0, vWpx);
  float cov = mix(1.0, clamp(vCov, 0.3, 1.0), thin);
  vec3 m = vec3(1.0); float line = 0.0;
  if (vKind < 1.5) {
    line = max(lmLine(e * vWpx, 0.7 * w), thin) * (1.0 - 0.5 * vT);            // the hair, paler toward its tip
    float bs = (fract(vS * 0.3 - uTime * 0.16 + vPh) - 0.5) / 0.3;             // metres from the nearest bead
    float bd = length(vec2(bs, vSide * vHw)), br = vHw * 0.85;
    float bead = (1.0 - smoothstep(br - 0.02, br + 0.02, bd)) * step(0.5, vKind) * (1.0 - thin);
    m = mix(m, lmMul(uOchre), bead * lmReg(vInk.z, 0.1, g) * lmOn(0.8, g));
    line = max(line * (1.0 - bead), bead * lmLine(abs(bd - br) * vWpx / max(vHw, 1e-4), 0.6 * w));
  } else if (vKind < 2.5) {
    m = mix(m, m * lmMul(uRose), lmOn(0.2 + 0.6 * smoothstep(-0.4, 0.9, vSide), g) * lmReg(vInk.y, 0.1 + 0.6 * vT, g));
    line = lmLine((1.0 - e) * vWpx, 0.7 * w) * (1.0 - thin) + thin * 0.75;
    float kn = abs(fract(vS * 0.9 + vPh) - 0.5) / 0.9;                         // stinging knots
    line = max(line, lmLine(kn * vWpx / max(vHw, 1e-4), 0.6 * w) * (1.0 - thin) * 0.7);
  } else {
    m = mix(m, m * lmMul(uGreen), lmOn(0.35 + 0.55 * smoothstep(-0.4, 0.9, vSide), g) * lmReg(vInk.x, 0.1, g));
    line = lmLine((1.0 - e) * vWpx, 0.75 * w) * (1.0 - thin) + thin * 0.8;
  }
  m = mix(vec3(1.0), m, cov); line *= cov;
  gl_FragColor = lmFinish(m, clamp(line, 0.0, 1.0), length(cameraPosition - vWp));
}`,Ye=`
attribute vec4 aP, aQ;
uniform float uViewH; uniform vec3 uReg;
varying vec2 vQ; varying vec4 vI; varying vec3 vWp, vInk; varying float vCov, vSize;
void main() {
  float sg = aQ.z < 0.0 ? -1.0 : 1.0, ghost = step(4.5, aQ.x), live = 1.0 - ghost;
  float t = uTime - (sg < 0.0 ? 0.5 : 0.0);
  vec3 c = aP.xyz;
  float fr = fract(aQ.y * 7.31 + t * (0.004 + 0.006 * aQ.y));                  // specks rise slowly through a 70 m band
  c.y += live * (fr - 0.5) * 70.0;
  c.x += live * sin(t * 0.3 + aQ.y * 40.0) * 0.5; c.z += live * cos(t * 0.23 + aQ.y * 31.0) * 0.5;
  c.x *= sg;
  float fadeW = mix(1.0, smoothstep(0.0, 0.06, fr) * (1.0 - smoothstep(0.94, 1.0, fr)), live);
  float dist = max(length(cameraPosition - c), 0.01);
  float pxm = 2.0 / (projectionMatrix[1][1] * max(uViewH, 1.0)) * dist;
  float sz = max(aP.w, 1.3 * pxm);
  vCov = clamp(aP.w / sz, 0.0, 1.0);
  sz *= fadeW * mix(1.0, smoothstep(1.2, 3.2, dist) * (1.0 - smoothstep(55.0, 110.0, dist)), live);                    // nothing smears across the lens
  sz *= mix(1.0, smoothstep(5.0, 12.0, dist), step(2.5, aQ.x) * step(aQ.x, 3.5));                                  // chains stay small type, deep in the page
  float a = live * (t * (0.25 + 0.5 * aQ.y) + aQ.y * 80.0);
  float k = mix(1.0, 0.45 + 0.55 * abs(sin(t * 0.37 * (0.6 + aQ.y) + aQ.y * 50.0)), live * step(0.5, aQ.x) * step(aQ.x, 3.5));
  vec2 q = position.xy * vec2(1.0, k);
  vec2 r = vec2(q.x * cos(a) - q.y * sin(a), q.x * sin(a) + q.y * cos(a)); r.x *= sg;
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  vec3 wp = c + (right * r.x + up * r.y) * sz;
  vQ = position.xy; vI = aQ; vWp = wp; vSize = aP.w;
  vInk = 1.0 - smoothstep(uReg - 30.0, uReg, vec3(dist));
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
}`,Ze=`
uniform float uNightK, uTime;
varying vec2 vQ; varying vec4 vI; varying vec3 vWp, vInk; varying float vCov, vSize;
float sdSeg(vec2 p, vec2 a, vec2 b) { vec2 pa = p - a, ba = b - a; return length(pa - ba * clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0)); }
void main() {
  vec2 q = vQ; float shape = vI.x, w = uPx;
  float fq = max(length(fwidth(q)) * 0.7071, 1e-5), pxs = 1.0 / fq;            // quad units per pixel; half size in px
  float dist = length(cameraPosition - vWp);
  float r = length(q), ang = atan(q.y, q.x + 1e-5);
  if (shape > 4.5) {                                                           // ---- ghosts: line only
    float dl = 9.0, t = uTime * 0.5 + vI.y * 20.0, ax = abs(q.x);
    if (shape < 5.5) {
      float bp = fract(uTime * 0.2 + vI.y * 3.0), bt = smoothstep(0.0, 0.24, bp) * (1.0 - smoothstep(0.24, 1.0, bp)), rx = 0.42 * (1.0 - 0.12 * bt), cy = 0.55;
      vec2 e = (q - vec2(0.0, cy)) / vec2(rx, 0.3);
      if (q.y > cy) dl = abs(length(e) - 1.0) * 0.3;
      float rim = cy - 0.035 * abs(sin(q.x * 44.0));
      if (ax < rx) dl = min(dl, abs(q.y - rim));
      float under = step(q.y, cy);
      float wv = 0.035 * sin(q.y * 16.0 + t) * (cy - q.y);
      float yy = clamp((q.y + 0.35) / 0.6, 0.0, 1.0);                          // arms end at y = -0.35
      dl = min(dl, mix(9.0, min(abs(ax - 0.06 - wv), abs(ax - 0.17 - wv * 1.3)), under * step(-0.35, q.y)));
      float sp = (cy - q.y) * 0.1;
      dl = min(dl, mix(9.0, min(abs(ax - 0.27 - sp - wv * 0.6), abs(ax - 0.37 - sp * 1.6 + wv * 0.5)), under * step(-0.96, q.y)));
    } else if (shape < 6.5) {
      float a2 = ang + uTime * 0.03 * (vI.y - 0.5);
      dl = min(min(abs(r - 0.36), abs(r - 0.31)), abs(r - 0.13));
      float rk = a2 * 16.0 / 6.2832 + 0.5, rl = 0.5 + 0.45 * lmHash(vec3(floor(rk), floor(vI.y * 50.0), 2.0));
      float ray = abs(fract(rk) - 0.5) * (6.2832 / 16.0) * r;
      if (r > 0.36 && r < rl) dl = min(dl, ray);
      float hx = abs(fract(a2 * 24.0 / 6.2832) - 0.5) * (6.2832 / 24.0) * r;
      if (r > 0.13 && r < 0.31) dl = min(dl, hx + step(0.5, fract(r * 34.0)) * 9.0);
    } else {
      vec2 e = q / vec2(0.3, 0.52); float le = length(e);
      dl = abs(le - 1.0) * 0.3;
      float cu = sqrt(max(1.0 - (q.y / 0.52) * (q.y / 0.52), 0.0));
      float rows = min(abs(ax - 0.1 * cu), abs(ax - 0.22 * cu)) + step(0.55, fract(q.y * 22.0 - uTime * 0.4)) * 9.0;
      if (le < 1.0) dl = min(dl, rows);
      dl = min(dl, mix(9.0, abs(ax - 0.05 - 0.02 * sin(q.y * 20.0 + t)), step(q.y, -0.5) * step(-0.95, q.y)));
    }
    float gl = lmLine(dl / fq, 0.5 * w) * 0.8;
    if (gl < 0.03) discard;                                                    // made here: a billboard is ghost or not as a whole, and no derivative is taken below on this path
    gl_FragColor = lmFinish(vec3(1.0), gl, dist);
    return;
  }
  float d = 1.0, inner = 9.0, seta = 9.0, setaK = 0.0, core = 0.0, chain = 0.0;             // ---- diatoms and dinoflagellates
  if (shape < 0.5) {
    d = r - 0.9; inner = abs(r - 0.48);
    if (r > 0.5) inner = min(inner, abs(fract(ang * 14.0 / 6.2832) - 0.5) * (6.2832 / 14.0) * r);
  } else if (shape < 1.5) {
    float x2 = 1.0 - q.x * q.x / 0.9025, h = 0.36 * sqrt(max(x2, 0.0)) * max(x2, 0.0);
    d = abs(q.y) - h + step(x2, 0.0);
    inner = min(abs(q.y), abs(fract(q.x * 6.0) - 0.5) / 6.0 + step(abs(q.y), 0.05) * 9.0);
  } else if (shape < 2.5) {
    d = max(q.y * -1.0, max(dot(q, vec2(0.866, 0.5)), dot(q, vec2(-0.866, 0.5)))) - 0.44 - 0.1 * cos(ang * 3.0 + 1.5708);
    inner = min(abs(r - 0.2), abs(d + 0.16));
  } else if (shape < 3.5) {
    // a Chaetoceros chain: five rounded glass cells on a gentle arch, a girdle band and a grain-dark chloroplast in
    // each, and hair-fine setae crossing out from every junction
    vec2 p = vec2(q.x, q.y + 0.2 * (q.x * q.x - 0.4));
    float cl = (fract(p.x / 0.38 + 0.5) - 0.5) * 0.38, jx = abs(fract(p.x / 0.38) - 0.5) * 0.38, ay = abs(p.y);
    vec2 bx = abs(vec2(cl, p.y)) - vec2(0.105, 0.15);
    d = max(length(max(bx, 0.0)) + min(max(bx.x, bx.y), 0.0) - 0.07, abs(p.x) - 0.95);
    inner = abs(abs(cl) - 0.045);
    core = 1.0 - smoothstep(0.04, 0.12, length(vec2(cl, p.y)));
    seta = abs(jx - 0.45 * max(ay - 0.2, 0.0)) + step(ay, 0.2) * 9.0;
    setaK = 1.0 - smoothstep(0.45, 0.92, ay);
    chain = 1.0;
  } else {
    vec2 p = vec2(abs(q.x), q.y);
    d = min(length(q - vec2(0.0, -0.12)) - 0.25, sdSeg(q, vec2(0.0, -0.1), vec2(0.0, 0.92)) - 0.085 * (1.0 - 0.6 * smoothstep(0.1, 0.9, q.y)));
    d = min(d, min(sdSeg(p, vec2(0.1, -0.25), vec2(0.5, -0.62)) - 0.075, sdSeg(p, vec2(0.5, -0.62), vec2(0.8, -0.1)) - 0.05));
    inner = abs(q.y + 0.1) + step(0.24, abs(q.x)) * 9.0;
  }
  float hairL = lmLine(seta / fq, 0.45 * w) * smoothstep(9.0, 18.0, pxs) * 0.6 * setaK, inside = step(d, 0.0);
  bool cut = inside < 0.5 && hairL < 0.03;                                     // the outline is decided here and cut after the grain: a derivative taken after a discard is not defined
  vec3 rest = vec3(q * vSize, vI.y * 37.0);
  float foot = lmFoot(rest), g = lmGrain(rest, foot, vI.y * 11.0);
  if (cut) discard;                                                            // the outline (decided above): no derivative is taken below this line
  float tone = 0.42 + 0.4 * (0.5 - 0.5 * dot(q, uLight.xy)) + 0.25 * smoothstep(-0.3, 0.0, d);
  tone = mix(tone, 0.1 + 0.2 * (0.5 - 0.5 * dot(q, uLight.xy)) + 0.7 * core + 0.3 * smoothstep(-0.06, 0.0, d), chain);
  float isO = step(0.5, vI.w);
  vec3 ink = mix(mix(lmMul(uGreen), vec3(1.0), uNightK), lmMul(uOchre), isO);
  vec3 m = mix(vec3(1.0), ink, lmOn(tone, g) * lmReg(mix(vInk.x, vInk.z, isO), 0.2, g) * inside);
  float line = lmLine(-d / fq, 1.0 * w) * inside;
  line = max(line, lmLine(inner / fq, 0.55 * w) * smoothstep(7.0, 14.0, pxs) * 0.8 * inside);
  line = max(line, hairL * (1.0 - inside));
  float cov = mix(0.45, 1.0, vCov);
  m = mix(vec3(1.0), m, cov); line *= cov * mix(0.5, 1.0, smoothstep(2.0, 6.0, pxs)) * (1.0 - 0.35 * step(2.5, shape) * step(shape, 3.5));
  gl_FragColor = lmFinish(m, line, dist);
}`,Je=`
varying vec3 vDir;
void main() { vDir = position; vec4 p = projectionMatrix * vec4(mat3(viewMatrix) * position, 1.0); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p; }`,$e=`
uniform vec3 uPaperLow; uniform float uNight;
varying vec3 vDir;
void main() {
  vec3 d = vDir / max(length(vDir), 1e-4);
  vec3 col = mix(uPaperLow, uPaper, smoothstep(-0.9, 0.1, d.y));
  vec2 f = gl_FragCoord.xy / max(uPx, 0.25);
  float n = lmVn(vec3(f.x * 0.55, f.y * 0.9, 1.0)) * 0.6 + lmVn(vec3(f.x * 0.09, f.y * 1.7, 5.0)) * 0.4;
  float gg = clamp((mix(lmVn(vec3(f * 0.62, 3.0)), lmVn(vec3(f * 0.27, 9.0)), 0.35) - 0.5) * 1.9 + 0.5, 0.0, 1.0);
  float ground = lmOn(clamp((0.61 - f.y / 450.0) / 0.22, 0.0, 1.0), gg) * uNight;
  col *= mix(vec3(1.0), lmMul(uGreen), ground);
  col *= 1.0 + (n - 0.5) * 0.03;
  gl_FragColor = vec4(col, 1.0);
}`,et=`
uniform vec3 uPaper;
void main() { gl_FragColor = vec4(uPaper, 1.0); }`,tt=`
varying vec3 vDirL;
void main() { vDirL = normal; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,at=`
uniform vec3 uPaper, uPa, uPb; uniform float uPc;
varying vec3 vDirL;
void main() {
  vec3 n = vDirL / max(length(vDirL), 1e-4);
  if (max(dot(n, uPa), dot(n, uPb)) > uPc) discard;
  gl_FragColor = vec4(uPaper, 1.0);
}`;class X{constructor(){this.pos=[],this.nor=[],this.uv=[],this.k=[],this.d=[],this.b=[],this.pv=[],this.idx=[],this.n=0,this.jobs=[]}grid(w,n,d,i={}){return this.jobs.push({nu:w,nv:n,fn:d,o:i,P:[0,0,0],A:[0,0,0],C:[0,0,0]}),this}lattice(w,n,d={}){return this.jobs.push({radius:w,detail:n,o:d}),this}_rows(w,n,d){const{nu:i,nv:t,fn:s,o:m,P:y,A:r,C:h}=w,v=.002,z=(x,b,f)=>typeof x=="function"?x(b,f):x??0;for(let x=n;x<d;x++)for(let b=0;b<=i;b++){const f=b/i,P=x/t,M=Math.min(.994,Math.max(.006,P));s(f+v,M,r),s(f-v,M,h);const q=r[0]-h[0],E=r[1]-h[1],D=r[2]-h[2];s(f,M+v,r),s(f,M-v,h);const R=r[0]-h[0],L=r[1]-h[1],$=r[2]-h[2];let e0=E*$-D*L,l0=D*R-q*$,t0=q*L-E*R;const Q=Math.hypot(e0,l0,t0);Q>1e-12?(e0/=Q,l0/=Q,t0/=Q):(e0=0,l0=1,t0=0),s(f,P,y),this.pos.push(y[0],y[1],y[2]),this.nor.push(e0,l0,t0),this.uv.push(f,P),this.k.push(m.kind??0,z(m.row,f,P),z(m.pulse,f,P),z(m.wave,f,P)),this.d.push(z(m.dark,f,P),z(m.body,f,P),m.lu??0,m.lv??0),this.b.push(0,0,m.far?.25:0,z(m.delay,f,P));const B=m.pivot?typeof m.pivot=="function"?m.pivot(y):m.pivot:y;this.pv.push(B[0],B[1],B[2])}}_faces(w){const{nu:n,nv:d,o:i}=w,t=this.n,s=n+1;for(let m=0;m<d;m++)for(let y=0;y<n;y++){const r=t+m*s+y,h=r+1,v=r+s,z=v+1;i.cull&&i.cull(this.pos[r*3],this.pos[r*3+1],this.pos[r*3+2])||this.idx.push(r,v,h,h,v,z)}this.n+=s*(d+1)}_shell(w,n,d,i){const t=n.center||[0,0,0];for(let s=d;s<i;s++){const m=w[s*3],y=w[s*3+1],r=w[s*3+2],h=Math.hypot(m,y,r)||1;this.pos.push(m+t[0],y+t[1],r+t[2]),this.nor.push(m/h,y/h,r/h),this.uv.push(0,0),this.k.push(n.kind??1,0,n.pulse??0,0),this.d.push(n.dark??.2,n.body??.3,n.bar??.16,0),this.b.push(s%3===0?1:0,s%3===1?1:0,1,0),this.pv.push(t[0],t[1],t[2]),this.idx.push(this.n+s)}}async build(w){for(const i of this.jobs){if(i.fn){const t=Math.max(1,Math.round(32/(i.nu+1)));for(let s=0;s<=i.nv;s+=t)this._rows(i,s,Math.min(i.nv+1,s+t)),await w();this._faces(i)}else{const t=await Se(i.radius,i.detail,w),s=t.length/3;for(let m=0;m<s;m+=96)this._shell(t,i.o,m,Math.min(s,m+96)),await w();this.n+=s}await w()}this.jobs.length=0;const n=new u.BufferGeometry,d=(i,t)=>new u.BufferAttribute(new Float32Array(i),t);return n.setAttribute("position",d(this.pos,3)),n.setAttribute("normal",d(this.nor,3)),n.setAttribute("uv",d(this.uv,2)),await w(),n.setAttribute("aK",d(this.k,4)),n.setAttribute("aD",d(this.d,4)),n.setAttribute("aB",d(this.b,4)),n.setAttribute("aPv",d(this.pv,3)),n.setIndex(new u.BufferAttribute(this.n<65536?new Uint16Array(this.idx):new Uint32Array(this.idx),1)),n}}async function Se(c,w,n){const d=(1+Math.sqrt(5))/2,i=w+1,t=[-1,d,0,1,d,0,-1,-d,0,1,-d,0,0,-1,d,0,1,d,0,-1,-d,0,1,-d,d,0,-1,d,0,1,-d,0,-1,-d,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],m=new Float32Array(s.length*i*i*3),y=new u.Vector3,r=new u.Vector3,h=new u.Vector3,v=new u.Vector3;let z=0;const x=f=>{v.x=f.x,v.y=f.y,v.z=f.z,v.normalize().multiplyScalar(c),m[z++]=v.x,m[z++]=v.y,m[z++]=v.z},b=f=>{y.set(t[s[f]*3],t[s[f]*3+1],t[s[f]*3+2]),r.set(t[s[f+1]*3],t[s[f+1]*3+1],t[s[f+1]*3+2]),h.set(t[s[f+2]*3],t[s[f+2]*3+1],t[s[f+2]*3+2]);const P=[];for(let M=0;M<=i;M++){P[M]=[];const q=y.clone().lerp(h,M/i),E=r.clone().lerp(h,M/i),D=i-M;for(let R=0;R<=D;R++)P[M][R]=R===0&&M===i?q:q.clone().lerp(E,R/D)}for(let M=0;M<i;M++)for(let q=0;q<2*(i-M)-1;q++){const E=Math.floor(q/2);q%2===0?(x(P[M][E+1]),x(P[M+1][E]),x(P[M][E])):(x(P[M][E+1]),x(P[M+1][E+1]),x(P[M+1][E]))}};for(let f=0;f<s.length;f+=3)b(f),await n();return m}const F=(c,w)=>(n,d,i)=>{const t=n*G,s=d*Math.PI,m=Math.sin(s);i[0]=c[0]+w[0]*m*Math.cos(t),i[1]=c[1]+w[1]*Math.cos(s),i[2]=c[2]+w[2]*m*Math.sin(t)};function C(c,w,n=1){const d=c.map(v=>new u.Vector3(v[0],v[1],v[2])),i=new u.CatmullRomCurve3(d,!1,"centripetal"),t=d[d.length-1].clone().sub(d[0]).normalize(),s=Math.abs(t.y)>.8?new u.Vector3(1,0,0):new u.Vector3(0,1,0),m=new u.Vector3,y=new u.Vector3,r=new u.Vector3,h=new u.Vector3;return(v,z,x)=>{const b=Math.min(1,Math.max(0,z));i.getPoint(b,h),i.getTangent(b,r),m.crossVectors(r,s).normalize(),y.crossVectors(r,m);const f=v*G,P=w(b),M=Math.cos(f)*P,q=Math.sin(f)*P*n;x[0]=h.x+m.x*M+y.x*q,x[1]=h.y+m.y*M+y.y*q,x[2]=h.z+m.z*M+y.z*q}}function te(c,w,n=!1){const d=new X;if(w==="girdle"){const r=b=>Math.sqrt(Math.max(0,1-Math.pow(Math.abs(2*b-1),5))),h=b=>.8*r(b)*(1+.07*Math.sin((b*2-1)*18)),v=(b,f)=>.5+2.5*Math.abs(2*f-1),z=(b,f)=>f*2,x=(b,f)=>Math.abs(2*f-1);d.grid(8,96,(b,f,P)=>{const M=2*b-1;P[0]=M*h(f),P[1]=.24*(1-M*M)*r(f),P[2]=(f*2-1)*20},{kind:0,dark:b=>.01+.5*Math.pow(Math.abs(2*b-1),4),body:x,wave:v,delay:z,lu:2});for(const b of[-1,1])d.grid(3,96,(f,P,M)=>{const q=f*G,E=r(P);M[0]=b*(h(P)+.03)+.14*Math.cos(q)*E,M[1]=.14*Math.sin(q)*E,M[2]=(P*2-1)*20},{kind:2,dark:.3,body:x,wave:v,delay:z,lv:130});return d.grid(10,6,F([0,.1,0],[.62,.36,.9]),{kind:0,dark:.35,lu:8,wave:.5,delay:1}),d.grid(6,4,F([0,.3,0],[.3,.26,.3]),{kind:2,dark:.4,wave:.5,delay:1}),d.build(c)}const i=w==="gooseberry",t=i?1.7:2.5,s=i?1.5:1.3,m=n?22:14,y=r=>Math.pow(Math.max(0,Math.sin(Math.PI*r)),i?.5:.62)*(i?1:.78+.44*r);d.grid(n?36:24,m,(r,h,v)=>{const z=r*G,x=s*y(h)*(1+.06*Math.cos(8*z));v[0]=x*Math.cos(z),v[1]=t*Math.cos(Math.PI*h),v[2]=x*Math.sin(z)},{kind:0,dark:n?-.12:0,body:(r,h)=>h});for(let r=0;r<8;r++){const h=r/8*G,v=[];if(n){d.grid(1,30,(z,x,b)=>{const f=.07+.8*x,P=s*y(f)*1.07+.03,M=h+(2*z-1)*.062*(.35+.65*Math.sin(Math.PI*x))/Math.max(P,.25);b[0]=P*Math.cos(M),b[1]=t*Math.cos(Math.PI*f),b[2]=P*Math.sin(M)},{kind:2,dark:.1,body:(z,x)=>x,lv:36,far:!0});continue}for(let z=0;z<=8;z++){const x=.07+.8*z/8,b=s*y(x)*1.07+.03;v.push([b*Math.cos(h),t*Math.cos(Math.PI*x),b*Math.sin(h)])}d.grid(3,m,C(v,z=>.14*(.45+.55*Math.sin(Math.PI*z))),{kind:2,dark:.25,body:(z,x)=>x,lv:n?24:30})}if(d.grid(8,6,C([[0,t*.8,0],[0,0,0],[0,-t*.85,0]],n?r=>.06+.05*r:r=>.2+.25*r,.4),{kind:0,dark:n?.2:.75,body:(r,h)=>h}),d.grid(6,4,F([0,t+.05,0],[.17,.17,.17]),{kind:2,dark:.4}),i)for(const r of[-1,1])d.grid(5,3,C([[r*.5,-.2,0],[r*1.2,-.9,0],[r*1.6,-1.6,0]],h=>.14-.06*h),{kind:0,dark:.6});else for(const r of[-1,1])d.grid(n?14:10,n?9:7,F(n?[r*.85,-t*1.06,0]:[r*.8,-t*.98,0],n?[.68,1.25,1]:[.75,1,1.05]),{kind:0,dark:n?.04:.12,body:.9,wave:.07,delay:r*.2,lu:n?6:0});if(n){for(let r=0;r<4;r++){const h=r<2?1:-1,v=r%2?1:-1;d.grid(4,6,C([[h*.5,-t*.62,v*.75],[h*.7,-t*.9,v*1.15],[h*.55,-t*1.22,v*1.3]],z=>.13*(1-.6*z),.5),{kind:0,dark:.3,body:.95,lv:9,wave:(z,x)=>.14*x,delay:(z,x)=>.4*x+r*.25})}for(const r of[-1,1])d.grid(4,6,C([[0,t*.72,r*.12],[0,t*.35,r*.5],[0,-t*.2,r*.62]],h=>.032,1),{kind:2,dark:.15,body:(h,v)=>v})}return d.build(c)}function st(c,w){const n=new X,d=(i,t)=>s=>i*(1-t*s);if(w==="pluteus"){n.grid(12,8,(i,t,s)=>{const m=i*G,y=.58*Math.pow(t,.7)*(1+.1*Math.cos(4*m))+.02;s[0]=y*Math.cos(m),s[1]=-1+1.05*t,s[2]=y*Math.sin(m)},{kind:0,dark:(i,t)=>.3*(1-t),lu:4,body:(i,t)=>1-t,row:(i,t)=>.05*t}),n.grid(8,5,F([0,-.4,0],[.24,.32,.24]),{kind:2,dark:.5});for(let i=0;i<8;i++){const t=(i+.5)/8*G,s=Math.cos(t),m=Math.sin(t),y=i%2?1.5:1.15;n.grid(4,6,C([[s*.5,-.05,m*.5],[s*.72,y*.5,m*.72],[s*.95,y,m*.95]],d(.085,.6)),{kind:0,dark:.4,lu:1,lv:7,body:.5,row:(r,h)=>.05+.16*h*h,delay:i%2*.12}),n.grid(4,3,F([s*.96,y+.04,m*.96],[.07,.09,.07]),{kind:2,dark:.4,row:.21,delay:i%2*.12})}return n.build(c)}if(w==="copepod"){n.grid(10,9,C([[0,0,1.15],[0,.03,.35],[0,0,-.5]],i=>.42*Math.pow(Math.sin(Math.PI*(.1+.82*i)),.7)),{kind:0,dark:.12,lv:6,body:(i,t)=>t*.5}),n.grid(6,5,C([[0,0,-.45],[0,-.05,-1],[0,0,-1.4]],d(.13,.4)),{kind:0,dark:.35,lv:4,body:.6,wave:(i,t)=>.07*t,delay:(i,t)=>t*.3}),n.grid(5,3,F([0,.14,1.02],[.1,.1,.1]),{kind:3});for(const i of[-1,1]){n.grid(4,8,C([[i*.2,.05,.92],[i*.85,.12,.8],[i*1.6,.16,.5]],d(.06,.6)),{kind:0,dark:.45,lv:14,body:.4,row:(t,s)=>.6*s*s}),n.grid(4,3,C([[i*.06,0,-1.4],[i*.3,0,-1.95]],d(.04,.5)),{kind:0,dark:.5,wave:.07,delay:.3}),n.grid(6,4,F([i*.24,-.06,-.92],[.15,.15,.3]),{kind:2,dark:.45});for(let t=0;t<4;t++)n.grid(3,3,C([[i*.16,-.25,.55-t*.24],[i*.3,-.75,.6-t*.24]],d(.045,.5)),{kind:0,dark:.5,row:(s,m)=>.3*m,delay:t*.12})}return n.build(c)}n.grid(12,9,C([[0,.05,.64],[0,.1,.1],[0,0,-.47]],i=>.52*Math.pow(Math.sin(Math.PI*(.12+.8*i)),.7)),{kind:0,dark:.1,body:(i,t)=>t*.5}),n.grid(5,6,C([[0,.35,-.05],[0,1,-.3],[0,1.6,-.78]],d(.1,.85)),{kind:0,dark:.45,lu:1,body:.4}),n.grid(5,6,C([[0,-.05,.6],[0,-.62,.86],[0,-1.2,.8]],d(.1,.85)),{kind:0,dark:.45,lu:1,body:.4}),n.grid(6,7,C([[0,-.1,-.45],[0,-.45,-.9],[0,-.95,-.95],[0,-1.3,-.6]],d(.16,.45)),{kind:0,dark:.3,lv:6,body:(i,t)=>.5+.5*t,wave:(i,t)=>.1*t*t,delay:(i,t)=>t*.3});for(const i of[-1,1]){n.grid(8,6,F([i*.37,.08,.42],[.2,.2,.2]),{kind:3,lu:6,lv:5}),n.grid(4,3,F([i*.3,.32,-.1],[.1,.07,.12]),{kind:2,dark:.4}),n.grid(3,3,C([[0,-1.3,-.6],[i*.24,-1.62,-.35]],d(.05,.6)),{kind:0,dark:.5,wave:.1,delay:.3});for(let t=0;t<2;t++){const s=.22-t*.32;n.grid(4,6,C([[i*.3,-.3,s],[i*.78,-.75,s+.1],[i*1.02,-1.28,s-.1]],d(.075,.45)),{kind:0,dark:.4,lv:5,body:.7,row:(m,y)=>.6*y*y,delay:t*.15}),n.grid(5,3,F([i*1.04,-1.4,s-.12],[.05,.24,.17]),{kind:0,dark:.15,lu:5,row:.6,delay:t*.15})}}return n.build(c)}function ot(c,w){const n=new X;n.lattice(1,3,{kind:1,dark:.16,bar:.17}),n.grid(10,7,F([0,0,0],[.44,.44,.44]),{kind:0,dark:.5,pulse:.12,pivot:[0,0,0]});for(let d=0;d<w;d++){const i=1-2*(d+.5)/w,t=Math.sqrt(1-i*i),s=d*2.39996,m=1.9+.7*(d*7%5)/4,y=[t*Math.cos(s),i,t*Math.sin(s)];n.grid(3,3,C([y.map(r=>r*.45),y,y.map(r=>r*m)],r=>.075*(1-.72*r)),{kind:1,dark:.55,lu:1})}return n.build(c)}function Pe(c,w=!1){const n=new X,d=t=>.5*(t/60)*(t/60),i=t=>-t/60*1.3;n.grid(8,5,F([0,.7,0],[.45,.85,.45]),{kind:2,dark:.3});for(let t=0;t<14;t++){const s=t%2?1:-1,m=t%4<2?.25:-.25,y=[s*.82,-.8-t*1.02,m],r=[s*.8,-.56,m*.8],h=Math.hypot(r[0],r[1],r[2]);r[0]/=h,r[1]/=h,r[2]/=h;const v=[-r[1],r[0],0],z=Math.hypot(v[0],v[1])||1;v[0]/=z,v[1]/=z;const x=[r[1]*v[2]-r[2]*v[1],r[2]*v[0]-r[0]*v[2],r[0]*v[1]-r[1]*v[0]];n.grid(w?12:8,w?7:5,(b,f,P)=>{const M=b*G,q=.04+f*2.25,E=.86*Math.sin(q)*(1+.04*Math.cos(4*M)*f),D=-.74*Math.cos(q)-.1,R=Math.cos(M)*E,L=Math.sin(M)*E;P[0]=y[0]+r[0]*D+v[0]*R+x[0]*L,P[1]=y[1]+r[1]*D+v[1]*R+x[1]*L,P[2]=y[2]+r[2]*D+v[2]*R+x[2]*L},{kind:0,dark:(b,f)=>.02+.3*f*f*f,body:t/40,lu:4,lv:1.5,pulse:(b,f)=>.34*f*f,pivot:y,delay:t/14}),w&&n.grid(5,3,F([y[0]-r[0]*.42,y[1]-r[1]*.42,y[2]-r[2]*.42],[.17,.17,.17]),{kind:2,dark:.4})}n.grid(3,40,C([[0,.2,0],[0,-30,0],[0,-60,0]],()=>.13),{kind:1,dark:.4,body:(t,s)=>s,wave:(t,s)=>d(60*s),delay:(t,s)=>1.3*s});for(let t=0;t<18;t++){const s=-16.5-t*2.4,m=t%2?1:-1,y=(t%3-1)*.3,r={body:.3+.7*(-s/60),wave:d(s),delay:i(s)};n.grid(5,4,C([[0,s,0],[m*.5,s-.7,y],[m*.65,s-1.7,y]],h=>.1+.3*Math.sin(Math.PI*h)),{kind:0,dark:.5,...r}),n.grid(4,3,F([m*.66,s-1.78,y],[.15,.17,.15]),{kind:2,dark:.4,...r}),n.grid(6,4,F([-m*.62,s+.4,-y],[.62,.45,.13]),{kind:0,dark:.04,lu:3,...r})}return n.build(c)}function Ae(c,w=!1){const n=new X,d=t=>[0,t[1],0];if(n.grid(w?32:20,w?12:9,(t,s,m)=>{const y=t*G,r=.02+s*1.9,h=Math.sin(r)*(1+.035*Math.cos(4*y)*s+(w?.035*Math.cos(16*y)*s*s*s:0));m[0]=h*Math.cos(y),m[1]=.85*Math.cos(r)+.1,m[2]=h*Math.sin(y)},{kind:0,dark:(t,s)=>(w?.24:.3)*s*s*s,body:(t,s)=>s*.6,pulse:(t,s)=>.3*s*s,pivot:d,lu:4}),n.grid(w?8:6,w?7:5,C([[0,.9,0],[0,.2,0],[0,-.4,0]],w?t=>.11-.05*Math.sin(Math.PI*t)+.09*t*t:t=>.17-.1*Math.sin(Math.PI*t)+.08*t*t),{kind:0,dark:w?.4:.8,body:.3,lu:w?4:0}),w)for(let t=0;t<4;t++){const s=(t+.5)/4*G;n.grid(5,4,F([.15*Math.cos(s),-.47,.15*Math.sin(s)],[.1,.17,.1]),{kind:0,dark:.3,body:.4,wave:.03,delay:t*.25})}for(let t=0;t<4;t++){const s=t/4*G;n.grid(6,4,F([.54*Math.cos(s),.7,.54*Math.sin(s)],[.14,.1,.14]),{kind:2,dark:.4,body:.3,pulse:.12,pivot:d})}const i=w?16:8;for(let t=0;t<i;t++){const s=(t+.5)/i*G,m=Math.cos(s),y=Math.sin(s),r=w?1+.3*(t*5%3)/2:1;w?n.grid(3,12,C([[.94*m,-.19,.94*y],[1.12*m,-1.3*r,1.12*y],[1*m,-2.9*r,1*y]],h=>.034*(1-.55*h)),{kind:0,dark:.5,body:(h,v)=>.6+.4*v,wave:(h,v)=>.3*v*v,delay:(h,v)=>v*1.3+t*.13,pulse:(h,v)=>.3*(1-v),pivot:d}):n.grid(3,6,C([[.94*m,-.19,.94*y],[1.05*m,-1.2,1.05*y],[1*m,-2.4,1*y]],h=>.06*(1-.6*h)),{kind:0,dark:.5,body:(h,v)=>.6+.4*v,wave:(h,v)=>.22*v*v,delay:(h,v)=>v*.5+t*.13,pulse:(h,v)=>.3*(1-v),pivot:d})}return n.build(c)}function nt(c){const w=new X;return w.grid(32,1,(n,d,i)=>{const t=n*G,s=Math.pow(Math.abs(Math.cos(4*t)),1.5),m=.75*d*(.2+.8*s);i[0]=m*Math.cos(t),i[1]=.26*(1-d)-.1*d*s,i[2]=m*Math.sin(t)},{kind:0,dark:(n,d)=>.42*d,body:(n,d)=>d,lv:1.5,pulse:(n,d)=>.4*d*d,pivot:[0,-.7,0]}),w.grid(5,3,F([0,.2,0],[.13,.08,.13]),{kind:2,dark:.4}),w.build(c)}function it(c){return new X().grid(3,6,(w,n,d)=>{const i=w*G+Math.PI/2,t=2*n-1,s=.52*(1+1.1*t*t*t*t);d[0]=s*Math.cos(i),d[1]=s*Math.sin(i),d[2]=n},{kind:1,dark:.36,lu:3,body:.2}).build(c)}function rt(c,w){const n=new X;return n.grid(8,5,F([0,0,0],[.98,.78,.98]),{kind:1,dark:.44,body:.2,lu:6,lv:3}),n.grid(4,3,C([[0,.5,0],[0,.5+w*.5,0],[0,.5+w,0]],d=>.24*Math.pow(1-d,1.2)+.03),{kind:1,dark:.5,body:.3,lu:2}),n.build(c)}async function lt(c,w){const n=await Se(1,w,c),d=new Map,i=[],t=[],s=h=>{const v=n[h*3],z=n[h*3+1],x=n[h*3+2],b=Math.round(v*2e3)+","+Math.round(z*2e3)+","+Math.round(x*2e3);let f=d.get(b);return f===void 0&&(f=i.length,i.push(new u.Vector3(v,z,x).normalize()),d.set(b,f)),f};for(let h=0;h<n.length/3;h+=3)t.push([s(h),s(h+1),s(h+2)]),h%120===117&&await c();await c();const m=i.map(()=>new Set),y=new Map,r=[];return t.forEach((h,v)=>{for(let z=0;z<3;z++){const x=h[z],b=h[(z+1)%3],f=x<b?x+"_"+b:b+"_"+x;m[x].add(b),m[b].add(x);const P=y.get(f);P===void 0?y.set(f,v):r.push([P,v,x,b])}}),{verts:i,tris:t,nbr:m,struts:r}}const _=new u.Matrix4,b0=new u.Quaternion,dt=new u.Quaternion,j=new u.Vector3,Ie=new u.Vector3,ct=new u.Vector3,Q0=new u.Vector3,ht=new u.Vector2,ut=new u.Vector3(1,0,0),qe=new u.Vector3(0,1,0);var yt={id:"litho-medusae",name:"The Plate of Medusae",category:"ocean",weirdness:.4,media:["underwater","tiny"],async build(c){const w=c.rng,n=c.vary||{},d=c.quality?.detail??1,i=H0(n.density??1,.7,1.3),t=!!n.rare,s=w.fork("edition"),m=s.pick(["golden","day","day","dawn","day","golden","night","day"]),y=["dawn","day","golden","night"].includes(n.hour)?n.hour:m,r=s.pick(["chrysaora","pelagia","cyanea","chrysaora"]),h=s.pick(["actinomma","star","aulonia","actinomma"]),v=s.pick(["lobate","gooseberry","girdle"]),z=s.pick(["zoea","pluteus","copepod"]),x=4+2*H0(n.mood??.5,0,1),b=w.fork("cast"),f=w.fork("specks"),P=w.fork("hair"),M=w.fork("rare"),q=y==="night"?1:0,E=Oe.slice();y==="golden"&&(E[2]="#B9506E"),q&&(E[5]="#33564C");const D=new u.Scene;D.background=new u.Color(E[0]);const R=()=>c.yield(),L=await Ke(c,{palette:E,species:r,period:x,shadeInk:y==="golden"?E[4]:void 0,page:!1});L.object.position.set(0,-232,0),D.add(L.object);const $=L.uniforms;await c.yield();const e0={value:450},l0={value:q},t0={value:y==="dawn"?new u.Vector3(120,90,60):new u.Vector3(220,180,140)},Q=e=>j0($,{tint:!!e.tint,side:u.DoubleSide,vertex:We,fragment:Ne,uniforms:{uReg:t0,uNightK:l0,uForce:{value:e.force??0},uSeed:{value:e.seed??0},uFres:{value:e.fres??.3},uSil:{value:e.sil??1},uSh:{value:e.sh??.5}}}),B=(e,o,a,l)=>{const p=new u.InstancedMesh(e,o,a);p.frustumCulled=!1,p.renderOrder=l;const g=new Float32Array(a*4);return e.setAttribute("aI",new u.InstancedBufferAttribute(g,4)),D.add(p),{mesh:p,aI:g,set(k,A,S,I,V){g[k*4]=A,g[k*4+1]=S,g[k*4+2]=I,g[k*4+3]=V}}},R0=L.anchors.mouth.clone().add(L.object.position),ae=L.anchors.axis,se=[433-R0.z,R0.y],N=[-ae.z,ae.y],d0=[se[0]-60*N[0],se[1]-60*N[1]],a0=45,m0=[d0[0]-a0*N[1],d0[1]+a0*N[0]],Ve=Math.atan2(N[1],N[0]);let f0=.128,x0=[0,0];for(let e=0;e<8;e++)x0=[m0[0]-a0*Math.sin(f0),m0[1]-a0*Math.cos(f0)],f0=Math.atan2(-x0[1],x0[0]-190);const M0=e=>e<=190?0:e<=x0[0]?-(e-190)*Math.tan(f0):e<d0[0]?m0[1]-Math.sqrt(Math.max(0,a0*a0-(e-m0[0])**2)):d0[1]+(e-d0[0])*N[1]/N[0],C0=e=>6*(1-.8*r0(105,140,e)*(1-r0(200,235,e)))*(1-r0(290,335,e))*Math.cos(G*e/168),v0=[];for(let e=0;e<186;e+=12)v0.push([C0(e),0,433-e]);v0.push([C0(190),-.2,243]);for(let e=206;e<x0[0]-8;e+=16)v0.push([C0(e),M0(e),433-e]);for(let e=0;e<=8;e++){const o=-f0+(Ve+f0)*e/8,a=m0[0]+a0*Math.sin(o);v0.push([C0(a),m0[1]-a0*Math.cos(o),433-a])}for(let e=1;e<=3;e++)v0.push([0,d0[1]+20*e*N[1],433-(d0[0]+20*e*N[0])]);await c.yield();const p0=je(v0);await c.yield();const Re=(e,o,a,l)=>p0.distanceTo(e,o,a)>l+7&&p0.distanceTo(-e,o,a)>l+7,oe=j0($,{side:u.BackSide,depthTest:!1,vertex:Je,fragment:$e,uniforms:{uPaperLow:{value:new u.Color("#D8DDC6")},uNight:{value:q}}});oe.depthWrite=!1,await c.yield();const K0=new u.Mesh(new u.IcosahedronGeometry(1500,2),oe);K0.frustumCulled=!1,K0.renderOrder=-1,D.add(K0);const K={root:[],dir:[],h:[],g:[],idx:[],n:0},ne=(e,o,a,l,p,g,k,A,S)=>{for(let I=0;I<=a;I++)for(let V=0;V<2;V++)K.root.push(e[0]*S,e[1],e[2]),K.dir.push(o[0]*S,o[1],o[2]),K.h.push(I/a,V*2-1,A-(S<0?.45:0),l),K.g.push(p,g,k,S);for(let I=0;I<a;I++){const V=K.n+I*2;K.idx.push(V,V+2,V+1,V+1,V+2,V+3)}K.n+=(a+1)*2},k0=(e,o,a,l,p,g,k)=>{const A=P.range(0,G);ne(e,o,a,l,p,g,k,A,1),ne(e,o,a,l,p,g,k,A,-1)};await c.yield();const H=await lt(R,3),U=20;await c.yield();const E0=H.verts.map((e,o)=>o).filter(e=>Math.abs(H.verts[e].x)<1e-4&&H.nbr[e].size===6);let s0=[E0[0],E0[1],9];for(const e of E0)for(const o of E0){const a=Math.abs(H.verts[e].angleTo(H.verts[o])-2.08);e!==o&&a<s0[2]&&(s0=[e,o,a])}const z0=H.verts[s0[0]],S0=H.verts[s0[1]],ie=z0.clone().add(S0).normalize(),re=new u.Matrix4().makeRotationX(Math.atan2(-ie.z,ie.y));H.verts.forEach(e=>e.applyMatrix4(re));const le=U*Math.cos(z0.angleTo(S0)/2),O=new u.Vector3(0,-le,263),W=new Set([s0[0],...H.nbr[s0[0]],s0[1],...H.nbr[s0[1]]]),de=(e,o)=>e.dot(z0)>o||e.dot(S0)>o,P0=H.tris.map(e=>new u.Vector3().add(H.verts[e[0]]).add(H.verts[e[1]]).add(H.verts[e[2]]).normalize());await c.yield();const O0=Q({force:1,seed:11,fres:.25}),W0=H.struts.filter(e=>!(W.has(e[2])&&W.has(e[3]))),ce=B(await it(R),O0,W0.length,0),Ce=(e,o)=>{const a=j.copy(P0[e[0]]).multiplyScalar(U),l=Ie.copy(P0[e[1]]).multiplyScalar(U),p=l.clone().sub(a),g=p.length();p.normalize();const k=a.clone().add(l).normalize(),A=new u.Vector3().crossVectors(k,p).normalize();k.crossVectors(p,A);const S=W.has(e[2])!==W.has(e[3])?1.32:1.15;_.makeBasis(A.multiplyScalar(S),k.multiplyScalar(S),p.multiplyScalar(g)).setPosition(a.add(O)),ce.mesh.setMatrixAt(o,_),ce.set(o,1,0,0,o*.37)};for(let e=0;e<W0.length;e++)Ce(W0[e],e),e%60===59&&await c.yield();await c.yield();const F0=[];H.tris.forEach((e,o)=>{W.has(e[0])&&W.has(e[1])&&W.has(e[2])||F0.push(o)});const he=B(await rt(R,h==="aulonia"?2.8:1.7),O0,F0.length,0),Ee=(e,o)=>{const a=P0[e],l=j.crossVectors(a,Math.abs(a.y)>.9?ut:qe).normalize().clone(),p=new u.Vector3().crossVectors(l,a),g=H.tris[e],k=W.has(g[0])||W.has(g[1])||W.has(g[2])?1.14:1;if(_.makeBasis(l.multiplyScalar(k),a.clone().multiplyScalar(k),p.multiplyScalar(k)).setPosition(Ie.copy(a).multiplyScalar(U).add(O)),he.mesh.setMatrixAt(o,_),he.set(o,1,0,0,o*.61),a.x>.12&&!de(a,.74)&&P()<.5){const A=P.range(9,17),S=ct.copy(a).multiplyScalar(U+1).add(O);k0([S.x,S.y,S.z],[a.x*A,a.y*A,a.z*A],8,.2,1,.05,0)}};for(let e=0;e<F0.length;e++)Ee(F0[e],e),e%40===39&&await c.yield();await c.yield();{const e=new X;e.lattice(3.5,2,{kind:1,dark:.25,bar:.2}),h==="aulonia"&&e.lattice(5.9,2,{kind:1,dark:.2,bar:.15}),e.grid(16,10,F([0,0,0],[2.3,2.3,2.3]),{kind:0,dark:.5,pulse:.1,pivot:[0,0,0],lu:8});let o=[];if(h==="actinomma")o=[[.88,-.24,-.41],[-.88,-.24,-.41],[.766,.643,0],[-.766,.643,0],[.766,-.643,0],[-.766,-.643,0]].map(A=>new u.Vector3(...A).normalize());else if(h==="star"){const A=new u.IcosahedronGeometry(1,0),S=A.attributes.position.array;for(let I=0;I<20;I++)o.push(new u.Vector3(S[I*9]+S[I*9+3]+S[I*9+6],S[I*9+1]+S[I*9+4]+S[I*9+7],S[I*9+2]+S[I*9+5]+S[I*9+8]).normalize().applyMatrix4(re));A.dispose()}const a=h==="star"?36:50,l=h==="star"?.6:.95;for(const A of o){const S=Math.abs(A.z)>.2&&h==="actinomma"?46:a;let I=!0;for(let V=3;V<=S;V+=1)Math.hypot(A.x*V,A.y*V-le)<8&&(I=!1);I&&e.grid(6,16,C([[A.x*3.3,A.y*3.3,A.z*3.3],[A.x*S*.5,A.y*S*.5,A.z*S*.5],[A.x*S,A.y*S,A.z*S]],V=>l*Math.pow(1-.94*V,1.25)*(1+.5*Math.exp(-((V*S-U)**2)/6))),{kind:1,dark:.42,lu:6,body:.2})}await c.yield();const p=B(await e.build(R),O0,1,0);p.mesh.setMatrixAt(0,_.makeTranslation(O.x,O.y,O.z)),p.set(0,1,0,.22,5),await c.yield();const g=await new X().grid(40,26,F([0,0,0],[U-.5,U-.5,U-.5]),{kind:1,dark:-.3,body:.2,cull:(A,S,I)=>(j.set(A,S,I).normalize(),de(j,.86))}).build(R);await c.yield();const k=B(g,Q({tint:!0,force:1,seed:17,fres:.8,sil:.5,sh:.3}),1,1);k.mesh.setMatrixAt(0,_.makeTranslation(O.x,O.y,O.z)),k.set(0,1,0,0,9)}await c.yield();const A0=[],o0=1.8,Fe=3,_e=4.6,I0=(e,o,a,l)=>{const p=p0.pointAt(e,j);return[a,p.y+l,p.z-o]},_0=[I0(.5,26,18,13),I0(.6,26,19.5,17)],N0=[I0(.55,26,17.5,2),I0(.65,26,18,7)];for(const e of _0)for(const o of[0,-14,-28,-44,-62,-80,-98])A0.push([e[0],e[1]+o,e[2],7]);const G0=I0(.7,26,19,9);for(const e of N0)A0.push([e[0],e[1]-1.5,e[2],11]);A0.push([G0[0],G0[1]-4,G0[2],11]);let L0=null;if(v==="girdle"){const e=p0.pointAt(.47,new u.Vector3);e.x=0;const o=new u.Vector3(24,e.y+3,e.z-34),a=new u.Vector3(.2,.62,-.76).normalize(),l=e.clone().sub(o);l.addScaledVector(a,-l.dot(a)).normalize(),L0=new u.Matrix4().makeBasis(new u.Vector3().crossVectors(l,a),l,a).setPosition(o);for(let p=-2;p<=2;p++)A0.push([o.x+a.x*9*p,o.y+a.y*9*p,o.z+a.z*9*p,5])}await c.yield();const ue=(e,o,a,l,p)=>{const g=(k,A)=>A0.some(S=>Math.hypot(S[0]-e,S[1]-k,S[2]-a)<S[3]+A+2);for(let k=0;k<8&&(g(o,l)||p&&(g(o-30,9)||g(o-55,9)));k++)e+=7;return[e,o,a]},y0=[],me=[],g0=(e,o,a,l,p,g,k)=>{for(let A=0;A<80;A++){const S=b.range(o,a),I=b.range(l,p)+e,V=M0(Math.min(S,395))+b.range(g,k),Y=433-S;if(Re(I,V,Y,e+3)&&!(Math.hypot(I,V-O.y,Y-O.z)<e+42)&&!(S>300&&I<26+e)&&!(S>350&&I<48+e)&&!y0.some(T=>Math.hypot(T[0]-I,T[1]-V,T[2]-Y)<T[3]+e+3))return y0.push([I,V,Y,e]),ue(I,V,Y,e)}return null},U0=e=>g0(e,325,448,48,88,-25,85),T0=e=>new u.Quaternion().setFromEuler(new u.Euler(b.range(-e,e),b.range(0,G),b.range(-e,e))),c0=(e,o,a,l,p,g,k,A,S={})=>{e.set(o,1,k,A,o*.73),e.set(o+1,-1,k,A,o*.73),me.push({I:e,i:o,pos:new u.Vector3(a[0],a[1],a[2]),quat:l,scale:p,kind:g,phase:k,rate:A,...S})},q0=e=>Math.max(2,Math.round(e*i)),fe=[13,M0(240)+.6,193];y0.push([...fe,3]);const ve=q0(6),pe=Q({tint:!q,seed:2,fres:.55,sh:.3});await c.yield();const n0=B(await te(R,v==="girdle"?"lobate":v),pe,ve*2,3);await c.yield();const Ge=(e,o)=>{for(const a of[-1,1]){const l=[e[0]+a*1.6*o,e[1]-1.6*o,e[2]],p=[a*3.5,-11,1.5];k0(l,p,22,.1,2,.05,.35);for(let g=1;g<=7;g++){const k=g/8;k0([l[0]+p[0]*k,l[1]+p[1]*k,l[2]+p[2]*k],[a*1.4,-1.3,.5],4,.05,0,.1,.35)}}};for(let e=0;e<ve;e++){await c.yield();const o=e===0&&v!=="girdle",a=o?fe:g0(3,30,400,11,60,-30,30);if(!a){n0.mesh.setMatrixAt(e*2,_.makeScale(0,0,0)),n0.mesh.setMatrixAt(e*2+1,_);continue}const l=o?1:b.range(.8,1.25),p=o?new u.Quaternion().setFromEuler(new u.Euler(.25,.4,-.3)):T0(.7),g=b();v==="gooseberry"?(n0.set(e*2,1,g,.3,e),n0.set(e*2+1,-1,g,.3,e),_.compose(j.set(a[0],a[1],a[2]),b0.identity(),Q0.setScalar(l)),n0.mesh.setMatrixAt(e*2,_),n0.mesh.setMatrixAt(e*2+1,_),Ge(a,l)):c0(n0,e*2,a,p,l,3,g,.3)}if(L0){await c.yield();const e=B(await te(R,"girdle"),pe,2,3);e.set(0,1,.2,.25,3),e.set(1,-1,.2,.25,3),e.mesh.setMatrixAt(0,L0),e.mesh.setMatrixAt(1,L0)}await c.yield();const ye=B(await te(R,"lobate",!0),Q({tint:!q,seed:3,fres:.55,sh:.3}),N0.length*2,3);await c.yield(),N0.forEach((e,o)=>c0(ye,o*2,e,new u.Quaternion().setFromEuler(new u.Euler(o?-.16:.2,o?2.1:.5,o?.28:-.25)),Fe,3,.3+.37*o,.3)),await c.yield(),await c.yield();const ge=q0(5),we=B(await st(R,z),Q({seed:4,fres:.3}),ge*2,0);await c.yield();const V0=[12,.4,333];y0.push([...V0,2]);for(let e=0;e<ge;e++){await c.yield();const o=e===0?V0:(e===3?U0(2):g0(2,25,380,9,40,-18,18))||[70+e*9,30,200],a=e===0?new u.Quaternion().setFromEuler(new u.Euler(z==="pluteus"?.3:-.15,-.5,.1)):T0(.5);c0(we,e*2,o,a,e===0?1:b.range(.8,1.2),2,b(),b.range(.9,1.4),{fwd:new u.Vector3(0,0,1).applyQuaternion(a),wob:e===0?.35:1.2})}await c.yield(),await c.yield();const X0=q0(14),Y0=B(await ot(R,14),Q({seed:6,fres:.25}),X0*2+2,0);await c.yield();for(let e=0;e<X0;e++){await c.yield();const o=b.range(2,6)*(e<4?.7:1),a=(e%4===1?U0(o*2.4):g0(o*2.4,20,430,10,95,-55,55))||[120+e*20,60,100];c0(Y0,e*2,a,T0(3),o,0,b(),.25,{axis:new u.Vector3(b.range(-1,1),b.range(.3,1),b.range(-1,1)).normalize(),spin:b.range(.08,.22)})}await c.yield(),await c.yield();const be=q0(4),D0=B(await Pe(R,!1),Q({tint:!q,seed:8,fres:.5,sh:.3}),be*2,3);await c.yield();for(let e=0;e<be;e++){await c.yield();const o=g0(5,70+e*30,180+e*60,22,62,22,40)||[80+e*15,35,250-e*40],a=ue(o[0],o[1],o[2],5,!0),l=b();y0.push([a[0],a[1]-30,a[2],9],[a[0],a[1]-55,a[2],9]),D0.set(e*2,1,l,.7,e),D0.set(e*2+1,-1,l,.7,e),_.makeTranslation(a[0],a[1],a[2]),D0.mesh.setMatrixAt(e*2,_),D0.mesh.setMatrixAt(e*2+1,_);for(let p=0;p<18;p++){const g=-16.5-p*2.4,k=p%2?1:-1;k0([a[0]+k*.66,a[1]+g-1.9,a[2]+(p%3-1)*.3],[k*.6,-P.range(5,9),.3],10,.07,2,.05,.45)}}await c.yield(),await c.yield();const B0=B(await Pe(R,!0),Q({tint:!q,seed:9,fres:.5,sh:.3}),_0.length*2,3);await c.yield();for(let e=0;e<_0.length;e++){await c.yield();const o=_0[e],a=.15+.45*e;B0.set(e*2,1,a,.7,e+4),B0.set(e*2+1,-1,a,.7,e+4),_.compose(j.set(o[0],o[1],o[2]),b0.identity(),Q0.setScalar(o0)),B0.mesh.setMatrixAt(e*2,_),B0.mesh.setMatrixAt(e*2+1,_);for(let l=0;l<18;l++){const p=-16.5-l*2.4,g=l%2?1:-1;k0([o[0]+g*.66*o0,o[1]+(p-1.9)*o0,o[2]+(l%3-1)*.3*o0],[g*.6*o0,-(6+l*7%5*.9)*o0,.3*o0],12,.07*o0,2,.05,.45)}}await c.yield(),await c.yield();const xe=q0(15),Me=B(await Ae(R),Q({tint:!q,seed:10,fres:.6,sh:.3}),xe*2,3);await c.yield();for(let e=0;e<xe;e++){await c.yield();const o=b.range(1,2),a=(e%3===1?U0(o*1.6):g0(o*1.6,15,410,8,55,-28,28))||[90+e*8,-40,150],l=T0(.6);c0(Me,e*2,a,l,o,1,b(),b.range(.34,.66),{up:new u.Vector3(0,1,0).applyQuaternion(l)})}await c.yield();const ke=B(await Ae(R,!0),Q({tint:!q,seed:13,fres:.6,sh:.3}),2,3);{const e=new u.Quaternion().setFromEuler(new u.Euler(.22,.4,-.2));c0(ke,0,G0,e,_e,1,.2,.3,{up:new u.Vector3(0,1,0).applyQuaternion(e)})}await c.yield();{const e=[[16.6,3.5,405],[17,-5,404],[17.4,8,403],[16.6,0,402]],o=e.find(a=>!y0.some(l=>Math.hypot(l[0]-a[0],l[1]-a[1],l[2]-a[2])<l[3]+9.5))||e[0];c0(Y0,X0*2,o,new u.Quaternion().setFromEuler(new u.Euler(.5,.9,-.3)),2.8,0,.37,.25,{axis:new u.Vector3(.35,.9,.25).normalize(),spin:.13})}await c.yield();{const e=new u.BufferGeometry,o=(l,p)=>new u.BufferAttribute(new Float32Array(l),p);e.setAttribute("position",o(K.root,3)),e.setAttribute("aRoot",o(K.root,3)),e.setAttribute("aDir",o(K.dir,3)),await c.yield(),e.setAttribute("aH",o(K.h,4)),e.setAttribute("aG",o(K.g,4)),await c.yield(),e.setIndex(K.idx),await c.yield();const a=new u.Mesh(e,j0($,{tint:!0,side:u.DoubleSide,vertex:Ue,fragment:Xe,uniforms:{uViewH:e0,uReg:t0}}));a.frustumCulled=!1,a.renderOrder=4,D.add(a)}await c.yield();{const e=Math.round(3e3*d*i),o=[8,9,9],a=26,l=(e+a)*2,p=new Float32Array(l*4),g=new Float32Array(l*4);let k=0;const A=(T,Z,J,u0,i0,w0,$0)=>{for(const He of[1,-1])p.set([T,Z,J,u0],k*4),g.set([i0,w0,He,$0],k*4),k++};for(let T=0;T<e;T++){const Z=f.range(-15,398),J=3+44*Math.pow(f(),1.7),u0=f.range(0,G),i0=f(),w0=i0<.3?0:i0<.55?1:i0<.7?2:i0<.9?3:4,$0=w0===4?f.range(.5,.8):f.range(.1,.33)*(w0===3?1.5:1);A(Math.abs(J*Math.cos(u0)),M0(Math.max(0,Z))+J*Math.sin(u0),433-Z,$0,w0,f(),f()<(w0===4?.5:.3)?1:0),T%100===99&&await c.yield()}const S=[[350,500],[600,800],[1e3,1400]],I=[[28,50],[45,80],[80,140]];for(let T=0;T<3;T++)for(let Z=0;Z<o[T];Z++){const J=f.range(S[T][0],S[T][1]),u0=f.range(-.6,1.4),i0=Z%3===0?433+J*f.range(-.1,.5):J*f.range(1.2,2.4);A(J*Math.cos(u0),J*Math.sin(u0),433-i0,f.range(I[T][0],I[T][1]),5+(Z+T)%3,f(),0)}await c.yield();const V=new u.PlaneGeometry(2,2);V.setAttribute("aP",new u.InstancedBufferAttribute(p,4)),V.setAttribute("aQ",new u.InstancedBufferAttribute(g,4));const Y=new u.InstancedMesh(V,j0($,{side:u.DoubleSide,vertex:Ye,fragment:Ze,uniforms:{uViewH:e0,uReg:t0,uNightK:l0}}),l);Y.frustumCulled=!1,Y.renderOrder=1,D.add(Y)}await c.yield();let h0=null;if(t){const o=B(await nt(R),Q({tint:!q,seed:12,fres:.2,sh:.1,sil:.6}),300,3),a=[];for(let l=0;l<150;l++){const p=M.range(240,352),g=M()<.62;a.push({d:p,A:55+M.range(0,25),y:M0(p)+(g?M.range(8,17):-M.range(8,14)),rise:M.range(8,24)*(g?1:-.4),z:433-p+M.range(-5,5),q:new u.Quaternion().setFromEuler(new u.Euler(Math.PI/2+M.range(-.5,.5),M.range(0,G),M.range(-.5,.5))),s:M.range(1.55,1.95),ph:M()}),o.set(l*2,1,a[l].ph,2,l),o.set(l*2+1,-1,a[l].ph,2,l),l%50===49&&await c.yield()}h0={I:o,items:a}}if(await c.yield(),q){const e=g=>new u.ShaderMaterial({uniforms:g.uniforms,vertexShader:g.vertexShader,fragmentShader:et,side:g.side,depthWrite:!1});let o=0,a=0;for(const g of H.struts)if(W.has(g[2])!==W.has(g[3]))for(const k of[g[0],g[1]])o+=Math.max(P0[k].dot(z0),P0[k].dot(S0)),a++;await c.yield();const l=new u.Mesh(new u.SphereGeometry(U-.5,44,28),new u.ShaderMaterial({vertexShader:tt,fragmentShader:at,side:u.FrontSide,depthWrite:!1,uniforms:{uPaper:$.uPaper,uPa:{value:z0.clone()},uPb:{value:S0.clone()},uPc:{value:o/Math.max(a,1)}}}));l.position.copy(O),l.frustumCulled=!1,l.renderOrder=-.5,D.add(l),await c.yield();const p=[];L.object.traverse(g=>{g.isMesh&&g.material.transparent&&p.push(g)});for(const g of p){const k=new u.Mesh(g.geometry,e(g.material));k.frustumCulled=!1,k.renderOrder=-.5,g.parent.add(k)}}await c.yield();const Le=e=>e-Math.floor(e),Te=[n0,ye,we,Y0,Me,ke],ze=(e,o)=>{for(const a of me)for(let l=0;l<2;l++){const p=e-l*.5;if(j.copy(a.pos),b0.copy(a.quat),a.kind===0)b0.setFromAxisAngle(a.axis,p*a.spin).multiply(a.quat),j.y+=Math.sin(p*.21+a.phase*9)*.8;else if(a.kind===1)j.addScaledVector(a.up,a.scale*.55*Math.sin(G*(p*a.rate+a.phase)-1.3));else if(a.kind===2){const g=Le(p*a.rate+a.phase),k=r0(0,.16,g)*(1-r0(.16,.9,g));j.addScaledVector(a.fwd,.5*k),j.x+=Math.sin(p*.17+a.phase*7)*a.wob,j.y+=Math.cos(p*.13+a.phase*5)*.75*a.wob}else b0.multiply(dt.setFromAxisAngle(qe,p*.12+a.phase*6)),j.y+=Math.sin(p*.19+a.phase*6),j.z+=Math.cos(p*.11+a.phase*4)*1.2;a.I.mesh.setMatrixAt(a.i+l,_.compose(j,b0,Q0.setScalar(a.scale)))}for(const a of Te)a.mesh.instanceMatrix.needsUpdate=!0;if(h0){const a=o*p0.length;for(let l=0;l<h0.items.length;l++){const p=h0.items[l],g=H0((a-(p.d-62))/74,0,1),k=p.s*r0(0,.06,g)*(1-r0(.94,1,g));j.set(Qe(-p.A,p.A,g),p.y+(g-.5)*p.rise+Math.sin(e*.7+p.ph*20)*.6,p.z),_.compose(j,p.q,Q0.setScalar(k)),h0.I.mesh.setMatrixAt(l*2,_),h0.I.mesh.setMatrixAt(l*2+1,_)}h0.I.mesh.instanceMatrix.needsUpdate=!0}};ze(0,0),await c.yield();let Z0=0;const De=(e,o,a)=>{if(a>.02&&a<.93){let l=((o+Z0+(.925-a)*40)/x-.24)%1;l<0&&(l+=1),l>.5&&(l-=1),Z0-=H0(l*x*.6,-.22,.22)*Math.min(e,.1)}L.setPulseClock(o+Z0)},J0=(e,o,a)=>r0(o,a,e),Be=[{at:O.clone().add(new u.Vector3(0,7,0)),from:.02,to:.3,weight:.3},{at:new u.Vector3(-V0[0],V0[1],V0[2]),from:.12,to:.215,weight:.4},{at:R0.clone().add(new u.Vector3(0,-16,0)),from:.37,to:.62,weight:.4},{at:R0.clone(),from:.55,to:.93,weight:.6}];return{scene:D,path:p0,duration:40,pace:e=>1-.14*ee(e,.3,.42,.4)+.1*ee(e,.48,.7,.4)-.28*ee(e,.72,.9,.35),camera:{fov:62,near:.3,far:4e3,sway:0,bank:0},pois:Be,portal:{shape:"circle",radius:4.5,tilt:!0,revealDistance:160,color:"#F4F1DC",glow:.7},post:{exposure:1,flat:1,bloom:{strength:0},grade:{saturation:1,contrast:1,vignette:0,grain:0}},ride:"none",style:"none",update(e,o,a,l){y==="dawn"?L.setInks(J0(l,.66,.74),J0(l,.4,.46),J0(l,.76,.84)):L.setProgress(l),De(e,o,l),L.update(e,o,a),e0.value=c.renderer?c.renderer.getDrawingBufferSize(ht).y:450,ze(o,l)},dispose(){L.dispose()}}}};export{yt as default};
