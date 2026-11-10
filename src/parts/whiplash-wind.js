import*as s from"three";import{mergeGeometries as Oe}from"three/addons/utils/BufferGeometryUtils.js";const Ee=["#F2E8CF","#A3B18A","#3B3F22","#D4918C","#F3BE94","#5E8C8A","#C8A24B"],ze=2.2,Le=new s.Matrix3().set(.59719,.35458,.04823,.076,.90834,.01566,.0284,.13383,.83777),je=new s.Matrix3().set(1.60475,-.53108,-.07367,-.10208,1.10813,-.00605,-.00327,-.07276,1.07602),Ke=Le.clone().invert(),Ye=je.clone().invert();function Ae(W){W=Math.min(Math.max(W,0),.97);const T=1-.983729*W,H=.0245786-.432951*W,R=-(90537e-9+.238081*W);return(-H+Math.sqrt(Math.max(H*H-4*T*R,0)))/(2*T)}function ot(W,T=ze,H=.96){return Be(W,T,H)}function Be(W,T,H=.96){const R=new s.Color(W),V=new s.Vector3(R.r,R.g,R.b);V.addScalar(-.5).multiplyScalar(1/1.04).addScalar(.5);const n=.2126*V.x+.7152*V.y+.0722*V.z;V.set(n+(V.x-n)/1.05,n+(V.y-n)/1.05,n+(V.z-n)/1.05),V.applyMatrix3(Ye),V.set(Ae(V.x),Ae(V.y),Ae(V.z)),V.applyMatrix3(Ke);const w=.6/T,a=r=>Math.min(Math.max(r*w,.002),H);return new s.Color(a(V.x),a(V.y),a(V.z))}const ve=`
uniform float uTime;
uniform vec3 uSun;        // unit vector toward the undrawn port-side sun (world space): only gold answers to it
uniform vec3 uPaper;      // bare cream paper
uniform vec3 uOlive;      // keyline ink
uniform vec3 uTint;       // the transparent olive tint stone: every second tone is its ink 58 percent under this
uniform vec3 uBronze;     // gold turned away
uniform vec3 uGold;       // gold, the printed bronze-powder working
uniform vec3 uGoldHot;    // gold catching the sun (HDR, the only value over 1)
uniform vec4 uPlane;      // x,y: distance over which inner hairlines go; z,w: distance over which colour pales
uniform float uGrain;     // crayon grain strength
float wwHash(vec3 p){ p = fract(p * vec3(0.1031, 0.1030, 0.0973)); p += dot(p, p.yxz + 33.33); return fract((p.x + p.y) * p.z); }
float wwNoise(vec3 p){
  vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  float a = mix(mix(wwHash(i), wwHash(i + vec3(1,0,0)), f.x), mix(wwHash(i + vec3(0,1,0)), wwHash(i + vec3(1,1,0)), f.x), f.y);
  float b = mix(mix(wwHash(i + vec3(0,0,1)), wwHash(i + vec3(1,0,1)), f.x), mix(wwHash(i + vec3(0,1,1)), wwHash(i + vec3(1,1,1)), f.x), f.y);
  return mix(a, b, f.z);
}
// crayon grain: paper showing through the flat as soft stipple; scale = stipples per metre (coarser in big flats)
vec3 wwGrain(vec3 col, vec3 p, float scale, float fw){
  if (scale < 0.0) {                                                // stipple: hard little dots of bare paper, in clusters
    float sc = -scale;
    float keepS = clamp(1.0 - fw * sc * 1.2, 0.0, 1.0);
    float dots = smoothstep(0.69, 0.75, wwNoise(p * sc)) * smoothstep(0.40, 0.60, wwNoise(p * sc * 0.09 + 3.7));
    float lumS = dot(col, vec3(0.3, 0.6, 0.1)) / max(dot(uPaper, vec3(0.3, 0.6, 0.1)), 1e-3);
    return mix(col, uPaper, min(uGrain * 2.2, 1.0) * keepS * smoothstep(0.08, 0.5, lumS) * dots);
  }
  float g = wwNoise(p * scale) * 0.65 + wwNoise(p * scale * 2.7 + 7.1) * 0.35;
  float keep = clamp(1.0 - fw * scale * 0.9, 0.0, 1.0);          // fades before it can shimmer
  float lum = dot(col, vec3(0.3, 0.6, 0.1)) / max(dot(uPaper, vec3(0.3, 0.6, 0.1)), 1e-3);
  return mix(col, uPaper, uGrain * keep * smoothstep(0.08, 0.5, lum) * smoothstep(0.50, 0.78, g));
}
// the second tone: the same ink under the transparent olive tint
vec3 wwTone(vec3 ink){ return mix(ink, uTint, 0.58); }
// bronze-powder gold. g = strand / brush direction (aniso > 0.5) or surface normal (aniso < 0.5), V = to eye.
// Dark bronze turned away, hot pale gold when it catches uSun; 'phase' walks the glint from one piece to the next.
vec3 wwGold(vec3 g, vec3 V, float phase, float aniso){
  vec3 hv = uSun + V; float hl = length(hv);
  vec3 H = hl > 1e-3 ? hv / hl : vec3(0.0, 1.0, 0.0);
  float d = dot(g, H);
  float comb = 0.5 + 0.5 * sin(phase - uTime * 1.7);              // the comb drawn through: glints take turns
  float sA = 1.0 - d * d; sA = max(sA, 0.0);
  float kA = sA * sA; kA *= kA; kA *= kA; kA *= kA;               // (1-d^2)^16: tight band where g is square to H
  float dB = max(d, 0.0);
  float kB = dB * dB; kB *= kB; kB *= kB; kB *= dB * dB;          // d^10
  float k = mix(kB, kA, step(0.5, aniso));
  float w = mix(max(d, 0.0), sA * sA, step(0.5, aniso));           // broad lobe: where the metal is merely turned toward the light
  float lit = smoothstep(0.40, 0.56, w * (0.75 + 0.5 * comb));     // bronze -> gold, a printed step
  float hot = smoothstep(0.45, 0.80, k * (0.55 + 0.75 * comb));    // gold -> hot pale gold
  return mix(mix(uBronze, uGold, lit), uGoldHot, hot);
}
// distance by plane: 1 near -> 0 far for inner hairlines; colour pales toward paper
float wwInner(float dist){ return 1.0 - smoothstep(uPlane.x, uPlane.y, dist); }
vec3 wwPale(vec3 col, float dist){ return mix(col, uPaper, 0.72 * smoothstep(uPlane.z, uPlane.w, dist)); }
`,We=`
uniform vec4 uBend;       // x amplitude (m at the tip), y wavelength (m), z speed (m/s), w extra gust 0..1 (world-driven)
uniform vec2 uBendDir;    // unit xz direction the nearest tress is flowing
uniform vec4 uRing;       // the snap: x,z centre, radius (m) of the ring now passing, amplitude (m at the tip)
uniform vec4 uPass;       // the hair passing: x,z of the tress tip, reach (m), amplitude (m at the tip)
vec3 wwBend(vec3 wp, vec3 root, float hgt, float seed){
  vec2 rd = root.xz - uRing.xy; float rl = length(rd);
  float rq = (rl - uRing.z) / 7.0;
  float ring = exp(-rq * rq) * uRing.w;
  vec2 pd = root.xz - uPass.xy; float pl = length(pd);
  float pq = pl / max(uPass.z, 1.0);
  float pass2 = exp(-pq * pq) * uPass.w;
  vec2 outw = rl > 1e-3 ? rd / rl : vec2(0.0);
  wp.xz += outw * ring * hgt * (0.4 + 0.6 * hgt);
  wp.y -= ring * 0.45 * hgt * hgt;
  float ph = (dot(root.xz, uBendDir) - uTime * uBend.z) * 6.2831853 / max(uBend.y, 1.0) + seed * 0.7;
  float pass = 0.5 + 0.5 * sin(ph);                                // the curve passing through
  pass = pass * pass * (3.0 - 2.0 * pass);
  float amp = uBend.x * (0.25 + 0.75 * pass + uBend.w) + pass2;
  float sShape = sin(hgt * 3.9 - 0.7 + 0.6 * sin(ph)) * hgt;       // an S, with its quick return at the tip
  vec2 side = vec2(-uBendDir.y, uBendDir.x);
  wp.xz += (uBendDir * 0.55 + side * 0.45) * amp * sShape;
  wp.y -= amp * 0.18 * hgt * hgt * pass;
  return wp;
}
`,Ue=`
attribute vec3 ink; attribute vec4 aux;
#ifdef WW_BENDY
attribute float bnd;
#endif
#ifdef WW_INST
attribute vec4 iA;
#endif
varying vec3 vInk; varying vec4 vAux; varying vec3 vWp; varying vec3 vG; varying vec3 vPh; varying float vDist;
${ve}
${We}
void main(){
  mat4 m = modelMatrix;
  #ifdef USE_INSTANCING
  m = modelMatrix * instanceMatrix;
  #endif
  vec4 wp = m * vec4(position, 1.0);
  #ifdef WW_ROSETTE
  wp.xyz = mix(m[3].xyz, wp.xyz, 1.0 - smoothstep(110.0, 190.0, distance(m[3].xyz, cameraPosition)));
  #endif
  vec3 ph = vec3(0.0);
  #ifdef WW_INST
  ph = iA.xyz;
  #endif
  #ifdef WW_BENDY
  float bg = 1.0;
  #ifdef WW_INST
  bg += iA.w;                                                      // tall things take a bigger curve
  #endif
  wp.xyz += (wwBend(wp.xyz, m[3].xyz, bnd, ph.x) - wp.xyz) * bg;
  #endif
  vec3 g = mat3(m) * normal;
  float gl = length(g);
  vG = gl > 1e-5 ? g / gl : vec3(0.0, 0.0, 1.0);
  vInk = ink; vAux = aux; vWp = wp.xyz; vPh = ph;
  vec4 mv = viewMatrix * wp;
  vDist = length(mv.xyz);
  gl_Position = projectionMatrix * mv;
}`,He=`
varying vec3 vInk; varying vec4 vAux; varying vec3 vWp; varying vec3 vG; varying vec3 vPh; varying float vDist;
${ve}
uniform vec2 uOff;        // the hand's fault: the colour lies this many pixels off its keyline, everywhere
uniform float uGrainScale;
uniform float uLineGain;  // 1 = full keyline, 0 = none (far planes)
uniform float uLineHold;  // 0: a line thinner than a pixel fades out (inner lines) .. 1: it holds 1.3 px (silhouettes)
#ifdef WW_COMB
uniform vec4 uComb;       // hill grass: x = z the strokes are combed toward, y = spacing (m), z = gain, w = slide (m/s)
uniform vec4 uField;      // x: 0 none | 1 flower drifts (land) | 2 the darker reach (water); y: disc cell (m); z: rosette cell (m); w: amount
uniform vec3 uDriftInk;   // the flowers' ink
float wwRiverZ(float x){ return 425.0 + 26.0 * sin(x * 0.0045 + 0.6); }
// how full a place is, 0..1 (evaluated at a disc's centre, so a drift is whole discs)
float wwOcc(vec2 c, float mode){
  float rz = wwRiverZ(c.x);
  if (mode > 1.5) {                                                 // one long reach meandering down the river, a whiplash band
    float zc = rz + 21.0 * sin(c.x * 0.017 + 0.8) + 6.0 * sin(c.x * 0.041);
    float w = 11.0 + 7.0 * sin(c.x * 0.012 + 2.0);
    return 1.0 - smoothstep(w - 3.0, w + 3.0, abs(c.y - zc));
  }
  float n = wwNoise(vec3(c.x * 0.013, c.y * 0.009, 2.3));
  float n2 = wwNoise(vec3(c.x * 0.004, c.y * 0.004, 8.1));
  float beside = exp(-c.x * c.x / 9000.0);                          // densest beside the ridden tress
  float down = 1.0 - smoothstep(rz - 105.0, rz - 62.0, c.y);        // the flower down, this side of the river
  float hill = smoothstep(rz + 70.0, rz + 130.0, c.y) * (1.0 - smoothstep(60.0, 150.0, 240.0 - length(vec2(c.x, c.y - 910.0))));
  float cl = smoothstep(0.46, 0.62, n + 0.25 * (n2 - 0.5));         // flowers grow in drifts: full inside, thin between
  float occ = down * (cl * 0.92 + (1.0 - cl) * 0.34 * beside) + hill * cl * 0.85 * smoothstep(0.35, 0.6, n2);
  return clamp(occ * uField.w, 0.0, 1.0);
}
// a drawn drift: the union of jittered discs, so its edge is scalloped. Metres inside (+) or outside (-).
float wwDiscs(vec2 p, float cell, float mode){
  vec2 ci = floor(p / cell);
  float best = -cell;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 c = ci + vec2(float(i), float(j));
      float h1 = wwHash(vec3(c, 1.3)), h2 = wwHash(vec3(c, 4.7)), h3 = wwHash(vec3(c, 9.1));
      vec2 ctr = (c + 0.5 + 0.7 * (vec2(h1, h2) - 0.5)) * cell;
      float occ = wwOcc(ctr, mode);
      float r = cell * (0.50 + 0.34 * h1) * step(h3, occ);
      best = max(best, r - length(p - ctr) - cell * (1.0 - step(h3, occ)));
    }
  }
  return best;
}
#endif
void main(){
  float e = vAux.x, lw = vAux.y;
  float tzR = 0.0, heart = 0.0;
  bool cut = false;                                                  // the rosette's outside: cut away LAST (see the end of main)
  #ifdef WW_ROSETTE
  if (vAux.x < 50.0) {                                               // a four-petalled rosette drawn on one quad: aux.xy = -1..1 across it
    vec2 q = vAux.xy; float r2 = dot(q, q), rr = sqrt(r2);
    float c2 = (q.x * q.x - q.y * q.y) / max(r2, 1e-4);
    float er = 0.36 + 0.62 * sqrt(abs(c2)) - rr;
    cut = er < 0.0;
    e = er * 0.42; lw = 0.05;
    tzR = step(abs(q.y), q.x);                                       // one petal darker
    heart = max(1.0 - smoothstep(0.13, 0.17, rr), (1.0 - smoothstep(0.02, 0.05, abs(abs(q.x) - abs(q.y)))) * (1.0 - smoothstep(0.30, 0.42, rr)));
  }
  #endif
  float fe = fwidth(e) + 1e-5;
  float fp = max(fwidth(vWp.x), max(fwidth(vWp.y), fwidth(vWp.z)));
  vec3 dv = cameraPosition - vWp; float dl = length(dv);
  vec3 V = dl > 1e-4 ? dv / dl : vec3(0.0, 0.0, 1.0);
  // flat + second tone (a drawn shape with a hard edge)
  float tz = vAux.z + vPh.z + tzR;
  #ifdef WW_COMB
  tz += (wwNoise(vec3(vWp.x * 0.016, vWp.z * 0.010, 1.7)) - 0.5) * 1.9 + (wwNoise(vec3(vWp.x * 0.05, vWp.z * 0.035, 5.2)) - 0.5) * 0.5;   // the hollows' edges are drawn curves, not the mesh
  float fld = 0.0, fldLine = 0.0;
  if (uField.x > 0.5) {
    float dsc = wwDiscs(vWp.xz, uField.y, uField.x);
    float fd = fwidth(dsc) + 1e-4;
    fld = smoothstep(-fd, fd, dsc);
    float lwD = max(0.16, 0.7 * fd);
    fldLine = (1.0 - smoothstep(lwD, lwD + fd, abs(dsc))) * wwInner(vDist);
    if (uField.x > 1.5) tz = fld;                                    // the river's second tone is this one drawn reach
  }
  #endif
  float ft = fwidth(tz) + 1e-4;
  float tone = smoothstep(0.5 - ft, 0.5 + ft, tz);
  vec3 col = mix(vInk, wwTone(vInk), tone);
  #ifdef WW_COMB
  if (uField.x > 0.5 && uField.x < 1.5) {
    // inside a drift the flat is flowers: near the eye each one a rosette lying on the ground, far off one flat of their ink
    vec2 g = vWp.xz / max(uField.z, 0.1), gi = floor(g);
    float fg = max(fwidth(g.x), fwidth(g.y));
    vec2 jt = vec2(wwHash(vec3(gi, 2.1)), wwHash(vec3(gi, 6.3)));
    vec2 q = (fract(g) - 0.5 - 0.34 * (jt - 0.5)) * (3.3 + 1.6 * fract(jt.x * 7.3 + jt.y * 3.1));
    float qa = 6.2831853 * jt.x, qc = cos(qa), qs = sin(qa); q = vec2(q.x * qc - q.y * qs, q.x * qs + q.y * qc);
    float r2 = dot(q, q), rr = sqrt(r2);
    float c2 = (q.x * q.x - q.y * q.y) / max(r2, 1e-4);
    float er = 0.40 + 0.58 * sqrt(abs(c2)) - rr;
    float fr = fg * 4.0 + 1e-4;
    float ros = smoothstep(-fr, fr, er) * step(0.22, fract(jt.y * 5.7 + jt.x));
    float farK = smoothstep(0.10, 0.34, fg);                         // rosettes run together into the flat
    float cov = mix(ros, 1.0, farK) * fld;
    vec3 dcol = mix(uDriftInk, wwTone(uDriftInk), max(tone, step(abs(q.y), q.x) * (1.0 - farK)));
    float rl = (1.0 - smoothstep(0.05, 0.05 + fr, abs(er - 0.05))) * (1.0 - smoothstep(0.03, 0.12, fg));
    col = mix(col, mix(dcol, uOlive, rl), cov);
    col = mix(col, uOlive, fldLine * farK * 0.85);
  }
  #endif
  col = wwGrain(col, vWp, uGrainScale, fp);
  #ifdef WW_COMB
  {
    // hill grass is not blades: hairline contour strokes on the flat, combed toward the roundel, sliding home
    float den = max(uComb.x - vWp.z, 70.0);
    float q = (vWp.x * 420.0 / den + 7.0 * sin(vWp.z * 0.021 + vWp.x * 0.011) + 2.6 * sin(vWp.z * 0.067 - vWp.x * 0.03) + 0.9 * sin(vWp.z * 0.15 + vWp.x * 0.06)) / max(uComb.y, 0.1);
    float fq = fwidth(q) + 1e-4;
    float cell = floor(q), dq = abs(fract(q) - 0.5);
    float h1 = wwHash(vec3(cell, 3.0, 7.0));
    float al = (vWp.z + vWp.y * 0.6 + uTime * uComb.w) * 0.15 + h1 * 40.0;
    float sl = sin(al + 1.3 * sin(al * 0.37));
    float dash = smoothstep(0.05, 0.6, sl);                          // a stroke swells in its middle and ends in a point
    float wq = max(0.035 * dash, 0.6 * fq);
    float ln = (1.0 - smoothstep(wq - 0.5 * fq, wq + 0.5 * fq, dq)) * step(0.02, dash) * step(0.35, h1);
    ln *= clamp(0.16 / fq, 0.0, 1.0) * uComb.z * (1.0 - smoothstep(0.55, 0.9, fq * 4.0));
    col = mix(col, mix(col, uOlive, 0.8), ln * (1.0 - fld));
  }
  #endif
  col = wwPale(col, vDist);
  if (vAux.w > 0.5) {
    col = wwGold(vG, V, vPh.y + vWp.x * 0.11 + vWp.y * 0.07, step(vAux.w, 1.5));
    // laid slightly thick: it stands proud at its edges, a bright lip just inside the line
    float lip = (1.0 - smoothstep(lw + 1.0 * fe, lw + 2.6 * fe, e)) * step(e, 90.0);
    col += uGoldHot * 0.28 * lip;
  }
  // colour off its keyline: the fill is evaluated a hair away, bare paper shows in the sliver
  float e2 = e + dFdx(e) * uOff.x + dFdy(e) * uOff.y;
  float fill = smoothstep(0.0, fe * 0.8, e2 - lw * 0.35);
  float res = clamp(lw / (1.3 * fe), 0.0, 1.0);                    // 1 when the line is at least 1.3 px wide: distance takes it away
  res = mix(res, 1.0, uLineHold);
  col = mix(col, mix(uPaper, col, max(fill, step(90.0, e))), res);
  // the keyline: never under ~1.3 px, inner hairlines (thin ones) go first with distance
  float wpx = max(lw, 1.3 * fe);
  float line = 1.0 - smoothstep(wpx - fe * 0.6, wpx + fe * 0.6, e);
  line *= uLineGain * res;
  col = mix(col, uOlive, line * step(e, 90.0));
  col = mix(col, uOlive, heart * res);
  // The cut comes after every fwidth and dFdx above. A discard before them leaves the derivatives of the pixels beside the cut
  // undefined: the software renderer (and a strict driver) then draws each rosette's rim differently in every frame.
  #ifdef WW_ROSETTE
  if (cut) discard;                                                  // (inside the define, so only the poppies' text holds a discard, as before)
  #endif
  gl_FragColor = vec4(col, 1.0);
}`,Ze=`
uniform float uHull;      // line weight as a fraction of frame width (0.0035 heavy near .. 0.0012 far)
uniform vec2 uHair;       // constant clip-space shift (0.12 percent of frame width)
uniform vec4 uPlane;
#ifdef WW_BENDY
attribute float bnd;
#endif
#ifdef WW_INST
attribute vec4 iA;
#endif
uniform float uTime;
${We}
void main(){
  mat4 m = modelMatrix;
  #ifdef USE_INSTANCING
  m = modelMatrix * instanceMatrix;
  #endif
  vec4 wp = m * vec4(position, 1.0);
  #ifdef WW_BENDY
  float sd = 0.0;
  #ifdef WW_INST
  sd = iA.x;
  #endif
  float bg = 1.0;
  #ifdef WW_INST
  bg += iA.w;
  #endif
  wp.xyz += (wwBend(wp.xyz, m[3].xyz, bnd, sd) - wp.xyz) * bg;
  #endif
  vec4 mv = viewMatrix * wp;
  vec4 p = projectionMatrix * mv;
  vec3 nv = mat3(viewMatrix) * (mat3(m) * normal);
  vec2 n2 = nv.xy; float nl = length(n2);
  n2 = nl > 1e-5 ? n2 / nl : vec2(0.0);
  float aspect = projectionMatrix[1][1] / max(projectionMatrix[0][0], 1e-4);
  float w = uHull * mix(1.0, 0.4, smoothstep(uPlane.x, uPlane.w, length(mv.xyz)));
  p.xy += (n2 * w * 2.0 + uHair) * vec2(1.0, aspect) * p.w;
  gl_Position = p;
}`,$e=`
uniform vec3 uOlive;
void main(){ gl_FragColor = vec4(uOlive, 1.0); }`,Xe=`
attribute vec3 hT; attribute vec4 hA; attribute vec4 hB;
uniform float uTime;
uniform vec4 uWave;       // x sway amplitude m, y wavelength m, z wave speed m/s (toward the tip), w turn-over spacing m
uniform float uReveal;    // coil arc length wound so far (m); beyond it nothing is drawn; 1e6 = everything
uniform float uWidth;     // width multiplier
uniform vec3 uTip;        // x: arc length of the free tip (the ridden tress: nothing is drawn before it), y: 1 = the ridden tress (drawn by distance ahead of its tip), z: lift (m) of the tip curl
uniform vec4 uRide;       // the ridden tress: x half width at the tip (m), y widening per metre ahead, z sway per metre ahead (m/m), w sway cap (m)
uniform float uRideK;     // 1: this is the ridden tress and the laws above apply (0: a free tip keeps the plain taper)
uniform vec4 uFar;        // x: least half width per metre of view distance (the line never thins below this share of the frame), y..z: arc lengths over which that floor lets go
varying vec4 vA; varying vec4 vB; varying vec3 vWp; varying vec3 vT; varying vec3 vN; varying float vDist; varying float vK;
void main(){
  float tl = length(hT); vec3 T = tl > 1e-5 ? hT / tl : vec3(1.0, 0.0, 0.0);
  vec3 N = normal; vec3 B = cross(N, T); float bl = length(B); B = bl > 1e-5 ? B / bl : vec3(0.0, 1.0, 0.0);
  float s = hA.y, k = 6.2831853 / max(uWave.y, 1.0);
  float wph = (s + uWave.z * uTime) * k + hB.y * 1.3;
  float dd = max(s - uTip.x, 0.0);                                   // metres ahead of the free tip
  float calm0 = mix(1.0, smoothstep(uTip.x + 45.0, uTip.x + 150.0, s), uTip.y);   // a free tip: sway and roll calm toward it
  float calm = smoothstep(uTip.x + 30.0, uTip.x + 95.0, s);
  // the ridden tress: the whiplash grows with distance from the tip, so the S keeps its size in the picture
  float amp = hB.x * mix(uWave.x * calm0, min(dd * uRide.z, uRide.w) * smoothstep(0.0, 22.0, dd), uRideK);
  float ampN = mix(amp, min(amp, 1.6), uRideK);
  vec3 c = position + B * amp * sin(wph) + N * ampN * 0.35 * sin(wph * 0.5 + 1.0);
  vK = hA.z - amp * k * k * sin(wph);                              // drawn curvature = built bend + the wave's bend
  float rp = sin((s + uWave.z * uTime) * 6.2831853 / max(uWave.w, 1.0) + hB.y * 2.1);
  float th = 3.14159265 * mix(smoothstep(0.80, 0.97, rp) * calm0, smoothstep(0.50, 0.78, rp - 1.3 * (1.0 - calm)), uRideK) * hB.w; // the turn-over travels with the wave
  float h = hA.w * uWidth * smoothstep(0.0, 14.0, uReveal - hB.z); // the wound end tapers to a point
  h = mix(h * mix(1.0, 0.2 + 0.8 * smoothstep(uTip.x, uTip.x + 85.0, s), uTip.y), min(h, uRide.x + uRide.y * dd), uRideK);   // the ridden tress runs out to its tip under the eye: a true taper in perspective
  float vd = length((viewMatrix * modelMatrix * vec4(c, 1.0)).xyz);
  h = max(h, uFar.x * vd * (1.0 - smoothstep(uFar.y, uFar.z, s)) * step(1e-3, hA.w));   // and far off it never thins below a line's width
  float flatK = mix(1.0, 0.2, uRideK);                               // the ridden tress turns over as a ribbon is DRAWN turning: a pinch in its own plane and the underside beyond it, never a plank on edge
  vec3 p = c + (B * cos(th) + N * (sin(th) * flatK)) * hA.x * h + N * (abs(sin(th)) * h * 0.2 * uRideK);
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vA = vec4(hA.x, s, hA.z, h); vB = hB; vWp = wp.xyz;
  vT = mat3(modelMatrix) * T; vN = mat3(modelMatrix) * (N * cos(th) - B * sin(th));
  vec4 mv = viewMatrix * wp; vDist = length(mv.xyz);
  gl_Position = projectionMatrix * mv;
}`,Qe=`
varying vec4 vA; varying vec4 vB; varying vec3 vWp; varying vec3 vT; varying vec3 vN; varying float vDist; varying float vK;
${ve}
uniform vec3 uHairInk;    // peach
uniform vec2 uOff; uniform float uSlide; uniform float uReveal; uniform float uStrands; uniform float uStrandN; uniform float uGrainScale; uniform float uTipS;
uniform float uCalm;      // 1: strands and hairlines run as long smooth parallels and the lock is one slow shape (the world's near tresses)
void main(){
  if (vB.z > uReveal) discard;
  if (vA.y < uTipS) discard;
  float a = vA.x, s = vA.y, h = max(vA.w, 1e-3);
  float flow = s - uSlide * uTime;                                 // the hair being reeled in: every mark slides home
  float e = (1.0 - abs(a)) * h;
  float fe = fwidth(e) + 1e-5, fa = fwidth(a) + 1e-5;
  float fp = max(fwidth(vWp.x), max(fwidth(vWp.y), fwidth(vWp.z)));
  vec3 dv = cameraPosition - vWp; float dl = length(dv);
  vec3 V = dl > 1e-4 ? dv / dl : vec3(0.0, 0.0, 1.0);
  float inner = wwInner(vDist);
  float front = gl_FrontFacing ? 1.0 : 0.0;
  // flat: peach on top, ochre (peach under the olive tint) underneath; the second tone is one long drawn lock
  float lockEdge = 0.30 + mix(0.34 * sin(flow * 0.045 + vB.y * 2.0) + 0.12 * sin(flow * 0.11 + vB.y), 0.40 * sin(flow * 0.021 + vB.y * 2.0), uCalm);
  float fl = mix(fa, 0.7 * fwidth(a - lockEdge) + 1e-5, uCalm);       // hard to the pixel at any angle
  float lock = smoothstep(-fl, fl, a - lockEdge);
  vec3 col = mix(uHairInk, wwTone(uHairInk), max(lock, 1.0 - front));
  col = wwGrain(col, vWp, uGrainScale, fp);
  col = wwPale(col, vDist);
  // strands: seven gold lines combed down the length, wandering a little, breaking into long dashes that slide
  float sp = 2.0 / (uStrandN + 1.0), hn = 0.5 * (uStrandN - 1.0);   // strand spacing in a; outermost strand index
  float x = a / sp;
  float i = clamp(floor(x + 0.5), -hn, hn);
  float wob = (0.20 * sin(flow * 0.085 + i * 1.7 + vB.y) + 0.10 * sin(flow * 0.23 + i * 4.1)) * (1.0 - uCalm);
  float dS = abs(x + wob - i) * sp * h;                            // metres from the strand
  float fS = fwidth(x) * sp * h + 1e-5;
  float wS = max(0.11 * sp * h, 0.8 * fS);
  float dash = smoothstep(-0.75, -0.55, sin(flow * 0.060 + i * 2.4 + vB.y * 3.0));
  float strand = (1.0 - smoothstep(wS - fS * 0.5, wS + fS * 0.5, dS)) * dash * uStrands;
  float room = 1.0 / (fwidth(x) + 1e-5);                           // pixels between neighbouring strands
  strand *= inner * smoothstep(1.5, 3.0, room);
  vec3 Tn = vT; float tl = length(Tn); Tn = tl > 1e-5 ? Tn / tl : vec3(1.0, 0.0, 0.0);
  vec3 g = Tn + vN * (0.55 * sin(i * 2.1 + flow * 0.021)); g /= max(length(g), 1e-4);
  vec3 gold = wwGold(g, V, i * 0.9 + s * 0.045 + vB.y, 1.0);
  col = mix(col, mix(gold, uBronze * 0.8, (1.0 - front) * 0.6), strand);
  // olive hairlines between the strands (the first thing distance removes)
  float xh = x + 0.5 + 0.16 * (1.0 - uCalm) * sin(flow * 0.07 + floor(x + 1.0) * 2.3);
  float dH = abs(fract(xh) - 0.5);
  float fH = fwidth(x) + 1e-5;
  float hair = (1.0 - smoothstep(0.5 * fH, 1.1 * fH, dH)) * step(abs(x), hn + 0.3) * inner * 0.75 * smoothstep(5.0, 9.0, room);
  hair *= smoothstep(-0.2, 0.3, sin(flow * mix(0.045, 0.019, uCalm) + floor(xh) * 1.9)) * (1.0 - 0.35 * uCalm);
  col = mix(col, uOlive, hair * (1.0 - strand));
  // colour off its keyline
  float e2 = e + dFdx(e) * uOff.x + dFdy(e) * uOff.y;
  // contours: thick on the outside of the bend, thin on the inside, and the swell runs along with the wave
  float bendK = clamp(-sign(a) * vK * 26.0, -0.62, 1.5);
  float lw = h * 0.085 * (1.0 + bendK);
  col = mix(uPaper, col, smoothstep(0.0, fe * 0.8, e2 - lw * 0.35));
  float wpx = max(lw, 1.3 * fe);
  col = mix(col, uOlive, 1.0 - smoothstep(wpx - fe * 0.6, wpx + fe * 0.6, e));
  gl_FragColor = vec4(col, 1.0);
}`,Je=`
varying vec3 vD;
void main(){
  vD = position;
  vec4 p = projectionMatrix * vec4(mat3(viewMatrix) * position, 1.0);
  if (abs(p.w) < 1e-4) p.w = 1e-4;
  gl_Position = p.xyww;
}`,et=`
varying vec3 vD;
${ve}
uniform vec3 uTop; uniform vec3 uCloud; uniform vec3 uStars[9]; uniform float uStarSize; uniform float uFrieze; uniform float uStarN;
void main(){
  float dl = length(vD); vec3 d = dl > 1e-5 ? vD / dl : vec3(0.0, 1.0, 0.0);
  float px = length(fwidth(d)) + 1e-5;                              // radians per pixel
  float el = asin(clamp(d.y, -1.0, 1.0));
  float az = (abs(d.x) + abs(d.z)) > 1e-5 ? atan(d.x, d.z) : 0.0;
  float t = clamp(d.y / 0.9, 0.0, 1.0);
  vec3 col = mix(uPaper, uTop, smoothstep(0.0, 1.0, sqrt(t)));
  col = wwGrain(col, d * 260.0, 0.5, px * 260.0);
  // the frieze
  float N = 40.0, cu = px * N / 6.2831853;
  float u = az / 6.2831853 * N - uTime * 0.018, v = (el - 0.175) / (0.175 * uFrieze);
  if (v > -0.3 && v < 1.3) {
    float cell = floor(u); vec2 q = vec2(fract(u) - 0.5, v - 0.52);
    float r = length(q), th = r > 1e-4 ? atan(q.y, q.x) : 0.0;
    float sdf = min(r - 0.46, v - 0.2);                             // volute + the bank that joins it to the next
    float unroll = 0.35 * sin(uTime * 0.13 + cell * 1.3);
    float sp = r / 0.13 - th / 6.2831853 + unroll;
    float dsp = abs(fract(sp) - 0.5) * 0.13;
    float lw = max(0.022, 0.8 * cu);
    float fill = 1.0 - smoothstep(-cu, cu, sdf);
    float line = (1.0 - smoothstep(lw - cu, lw + cu, abs(sdf))) + (1.0 - smoothstep(lw * 0.7 - cu, lw * 0.7 + cu, dsp)) * step(r, 0.44) * step(0.07, r);
    col = mix(col, uCloud, fill);
    col = mix(col, uOlive, clamp(line, 0.0, 1.0) * step(-0.05, v) * clamp(0.03 / cu, 0.0, 1.0));
  }
  // nine gold stars, flat, four-pointed, glinting in turn
  for (int i = 0; i < 9; i++) {
    vec3 s = uStars[i]; float fi = float(i);
    if (fi < uStarN && dot(d, s) > 0.99) {
      vec3 ex = normalize(cross(s, vec3(0.0, 1.0, 0.0))), ey = cross(ex, s);
      vec2 q = vec2(dot(d, ex), dot(d, ey)) / uStarSize;
      float a = sqrt(abs(q.x)) + sqrt(abs(q.y)), aa = 0.6 * px / uStarSize + 0.02;
      float g = max(sin(uTime * 0.7 - fi * 0.9), 0.0); g *= g; g *= g;
      vec3 sc = mix(uGold, uGoldHot, g);
      col = mix(col, uOlive, 1.0 - smoothstep(1.0 - aa, 1.0 + aa, a));
      col = mix(col, sc, 1.0 - smoothstep(0.84 - aa, 0.84 + aa, a));
    }
  }
  gl_FragColor = vec4(col, 1.0);
}`;function tt(W,T={}){const H=T.palette||Ee,R=T.exposure??ze,V=t=>Be(t,R,.96*ze/R),n={cream:V(H[0]),sage:V(H[1]),olive:V(H[2]),rose:V(H[3]),peach:V(H[4]),teal:V(H[5]),gold:V(H[6])},w=n.olive.clone(),a=t=>t.clone().lerp(w,.58);n.ochre=a(n.peach),n.sage2=a(n.sage),n.rose2=a(n.rose),n.teal2=a(n.teal),n.cream2=a(n.cream),n.bronze=V(T.bronze||"#6B4E1E"),n.goldHot=Be("#FBE6A2",R,99).multiplyScalar(T.goldGain??1.7);const r=new s.Vector3().copy(T.sun||{x:-.93,y:.26,z:.26}).normalize(),h={uTime:{value:0},uSun:{value:r},uPaper:{value:n.cream},uOlive:{value:n.olive},uTint:{value:w},uBronze:{value:n.bronze},uGold:{value:n.gold},uGoldHot:{value:n.goldHot},uPlane:{value:new s.Vector4(260,620,900,4e3)},uGrain:{value:T.grain??.2},uOff:{value:new s.Vector2(1,-.8)},uHair:{value:new s.Vector2(.0024,-.0018)},uBend:{value:new s.Vector4(1.6,180,12,0)},uBendDir:{value:new s.Vector2(0,-1)},uRing:{value:new s.Vector4(0,0,-1e3,0)},uPass:{value:new s.Vector4(0,0,30,0)}},m=[],M=t=>(m.push(t),t),Y=t=>{const b={};return t.bendy&&(b.WW_BENDY=1),t.inst&&(b.WW_INST=1),t.comb&&(b.WW_COMB=1),t.rosette&&(b.WW_ROSETTE=1),b},D=(t={})=>M(new s.ShaderMaterial({vertexShader:Ue,fragmentShader:He,defines:Y(t),side:t.side??s.DoubleSide,uniforms:{...h,uGrainScale:{value:t.grainScale??1.2},uLineGain:{value:t.lineGain??1},uLineHold:{value:t.lineHold??0},uComb:{value:new s.Vector4(t.combZ??1e3,t.combSpacing??3.2,t.comb?t.combGain??1:0,t.combSlide??6)},uField:{value:new s.Vector4(t.field??0,t.fieldCell??9,t.fieldRosette??1.7,t.fieldAmount??1)},uDriftInk:{value:t.driftInk||n.rose}},polygonOffset:!!t.offset,polygonOffsetFactor:t.offset||0,polygonOffsetUnits:t.offset||0})),$=(t,b={},x={})=>M(new s.ShaderMaterial({vertexShader:t,fragmentShader:He,side:x.side??s.DoubleSide,uniforms:{...h,uGrainScale:{value:x.grainScale??1.2},uLineGain:{value:x.lineGain??1},uLineHold:{value:x.lineHold??0},...b}})),C=(t={})=>M(new s.ShaderMaterial({vertexShader:Ze,fragmentShader:$e,defines:Y(t),side:s.BackSide,uniforms:{...h,uHull:{value:t.weight??.0035}}})),B=(t={})=>M(new s.ShaderMaterial({vertexShader:Xe,fragmentShader:Qe,side:s.DoubleSide,uniforms:{...h,uHairInk:{value:t.ink||S.hairInk||n.peach},uStrands:{value:t.strands??1},uStrandN:{value:t.strandCount??7},uWave:{value:new s.Vector4(t.sway??3,t.waveLen??150,t.waveSpeed??12,t.rollLen??420)},uReveal:{value:1e6},uWidth:{value:t.width??1},uSlide:{value:t.slide??25},uTip:{value:new s.Vector3(-1e6,0,0)},uTipS:{value:-1e6},uCalm:{value:t.calm??0},uRideK:{value:t.ride?1:0},uRide:{value:new s.Vector4(t.tipHalf??.8,t.tipWiden??.02,t.rideSway??.07,t.rideSwayMax??14)},uFar:{value:new s.Vector4(t.farFloor??0,t.farS0??1e6,t.farS1??2e6,0)},uGrainScale:{value:t.grainScale??1}}})),y=(t={})=>{const b=t.rng||W.rng,x=[];for(let J=0;J<9;J++){const oe=J/9*6.283+b.range(-.25,.25),ie=b.range(.48,1.05);x.push(new s.Vector3(Math.sin(oe)*Math.cos(ie),Math.sin(ie),Math.cos(oe)*Math.cos(ie)))}const U=M(new s.ShaderMaterial({vertexShader:Je,fragmentShader:et,side:s.BackSide,depthWrite:!1,uniforms:{...h,uTop:{value:t.top||n.peach},uCloud:{value:t.cloud||n.cream},uStars:{value:x},uStarSize:{value:t.starSize??.03},uFrieze:{value:t.frieze??1},uStarN:{value:t.stars??9}}})),E=new s.Mesh(new s.SphereGeometry(10,48,24),U);return E.renderOrder=-1,E.frustumCulled=!1,E.name="ww-sky",E},g=new s.Vector2,S={pal:n,tint:w,sun:r,uniforms:h,ink:D,inkWith:$,hull:C,hair:B,sky:y,toInk:V,materials:m,glsl:{common:ve,bend:We},update(t,b,x){h.uTime.value=b;const U=W.renderer;if(U&&U.getDrawingBufferSize){U.getDrawingBufferSize(g);const E=Math.max(g.x,400)*.0012;h.uOff.value.set(E,-.8*E)}},setSun(t){r.copy(t).normalize()},setBend(t,b,x,U=0){const E=Math.hypot(t,b)||1;h.uBendDir.value.set(t/E,b/E),x!==void 0&&(h.uBend.value.x=x),h.uBend.value.w=U}};return at(S),S}function at(W){const T=()=>new s.Vector3,H=T(),R=T(),V=T(),n=T(),w=T();W.batch=()=>({pos:[],nor:[],ink:[],aux:[],bnd:[],idx:[]}),W.geometry=r=>{const h=new s.BufferGeometry;return h.setAttribute("position",new s.Float32BufferAttribute(r.pos,3)),h.setAttribute("normal",new s.Float32BufferAttribute(r.nor,3)),h.setAttribute("ink",new s.Float32BufferAttribute(r.ink,3)),h.setAttribute("aux",new s.Float32BufferAttribute(r.aux,4)),h.setAttribute("bnd",new s.Float32BufferAttribute(r.bnd,1)),h.setIndex(r.idx),h.computeBoundingSphere(),h};function a(r,h){const m=r.length,M=[],Y=[],D=[],$=[],C=[0];for(let B=0;B<m;B++){const y=r[Math.max(B-1,0)],g=r[Math.min(B+1,m-1)],S=T().subVectors(g,y);S.lengthSq()<1e-12&&S.set(1,0,0),S.normalize(),M.push(S);const t=T().copy(typeof h=="function"?h(B,B/(m-1)):h),b=T().crossVectors(t,S);b.lengthSq()<1e-10&&b.set(0,1,0),b.normalize(),t.crossVectors(S,b).normalize(),D.push(t),Y.push(b),B>0&&C.push(C[B-1]+r[B].distanceTo(r[B-1]))}for(let B=0;B<m;B++){const y=Math.max(B-1,0),g=Math.min(B+1,m-1),S=Math.max(C[g]-C[y],1e-4);$.push(H.subVectors(M[g],M[y]).dot(Y[B])/S)}return{T:M,B:Y,N:D,K:$,S:C}}W.frames=a,W.ribbon=(r,h,m={})=>{const M=a(h,m.normal||new s.Vector3(0,0,1)),Y=h.length,D=m.across||2,$=r.pos.length/3,C=m.lw??.05,B=m.swell??5;for(let y=0;y<Y;y++){const g=y/(Y-1),S=typeof m.half=="function"?m.half(g):m.half??.5;for(let t=0;t<=D;t++){const b=-1+2*t/D;w.copy(h[y]).addScaledVector(M.B[y],b*S).addScaledVector(M.N[y],(m.lift||0)+(m.crown||0)*(1-b*b)),r.pos.push(w.x,w.y,w.z);const x=m.gold===1?M.T[y]:M.N[y];r.nor.push(x.x,x.y,x.z);const U=typeof m.ink=="function"?m.ink(g,b):m.ink;r.ink.push(U.r,U.g,U.b);const E=Math.abs(b)<.001?0:Math.min(Math.max(-Math.sign(b)*M.K[y]*S*B,-.6),1.3),J=typeof m.tone=="function"?m.tone(b,g):m.tone||0;r.aux.push(C>0?(1-Math.abs(b))*S:99,C*(1+E),J,m.gold||0),r.bnd.push(m.bnd?m.bnd(g):0)}}for(let y=0;y<Y-1;y++)for(let g=0;g<D;g++){const S=$+y*(D+1)+g,t=S+D+1;r.idx.push(S,t,S+1,S+1,t,t+1)}},W.fan=(r,h,m,M={})=>{const Y=r.pos.length/3,D=m.length,$=M.lw??.05,C=M.normal||n.set(0,0,1);let B=M.inset;if(B===void 0){B=1e9;for(const g of m)B=Math.min(B,g.distanceTo(h))}const y=(g,S,t)=>{r.pos.push(g.x,g.y,g.z),r.nor.push(C.x,C.y,C.z),r.ink.push(M.ink.r,M.ink.g,M.ink.b),r.aux.push($>0?S:99,$,t,M.gold||0),r.bnd.push(M.bnd||0)};y(h,B,M.toneC??0);for(let g=0;g<D;g++)y(m[g],0,typeof M.tone=="function"?M.tone(g):M.tone||0);for(let g=0;g<D;g++)r.idx.push(Y,Y+1+g,Y+1+(g+1)%D)},W.whiplash=r=>{const h=r.n||24,m=[],M=r.len/(h-1),Y=r.curlAt??.7;let D=0,$=0,C=r.heading||0;for(let B=0;B<h;B++){m.push(T().copy(r.origin).addScaledVector(r.u,D).addScaledVector(r.v,$));const y=(B+.5)/(h-1),g=Math.max(0,(y-Y)/(1-Y));C+=((r.bend||0)*(.4+1.2*y*(1-y)*2)+(r.curl||0)*3*g*g/(1-Y))/(h-1);const S=1-.55*g*g;D+=Math.cos(C)*M*S,$+=Math.sin(C)*M*S}return m},W.tressGeometry=(r,h={})=>{const m=a(r,h.normal||new s.Vector3(0,1,0)),M=r.length,Y=h.across||4,D=Y+1,$=new Float32Array(M*D*3),C=new Float32Array(M*D*3),B=new Float32Array(M*D*3),y=new Float32Array(M*D*4),g=new Float32Array(M*D*4),S=[],t=(x,U,E,J)=>typeof x=="function"?x(U,E):x??J;for(let x=0;x<M;x++){const U=x/(M-1),E=(h.s0||0)+m.S[x],J=t(h.half,U,E,4),oe=t(h.sway,U,E,1),ie=t(h.roll,U,E,1);for(let se=0;se<D;se++){const le=x*D+se;$.set([r[x].x,r[x].y,r[x].z],le*3),C.set([m.N[x].x,m.N[x].y,m.N[x].z],le*3),B.set([m.T[x].x,m.T[x].y,m.T[x].z],le*3),y.set([-1+2*se/Y,E,m.K[x],J],le*4),g.set([oe,t(h.phase,U,E,0),E-(h.coilStart??1e9),ie],le*4)}}for(let x=0;x<M-1;x++)for(let U=0;U<Y;U++){const E=x*D+U,J=E+D;S.push(E,J,E+1,E+1,J,J+1)}const b=new s.BufferGeometry;return b.setAttribute("position",new s.BufferAttribute($,3)),b.setAttribute("normal",new s.BufferAttribute(C,3)),b.setAttribute("hT",new s.BufferAttribute(B,3)),b.setAttribute("hA",new s.BufferAttribute(y,4)),b.setAttribute("hB",new s.BufferAttribute(g,4)),b.setIndex(S),b}}const re=60,ee=62,A=1.7,ce=7,fe=8.6,he=20.6,we=32,de=54,Re=53.2,ue=2.5,Te=5,Pe=ue*Te;async function it(W,T={}){const H=W.rng,R=Math.PI*2,V=Math.min(1,Math.max(.5,T.detail??W.quality?.detail??1)),n=T.style||tt(W,{palette:T.palette,exposure:T.exposure}),w=n.pal,a=(e,l,f)=>new s.Vector3(e,l,f),r=new s.Group;r.name="whiplash-wind-roundel";const h=a(0,0,1),m=H.pick([10,12,12,14]),M=H.range(-.12,.12),Y=H.range(.42,.58),D=H.range(0,R),$=H.pick([32,36,40]);await W.yield?.();const C=n.batch(),B=240,y=(e,l,f,c,I,v={})=>{const q=C.pos.length/3,P=v.lw??.22,_=Math.hypot(f-e,c-l);for(let N=0;N<3;N++){const j=N/2,k=e+(f-e)*j,F=l+(c-l)*j;for(let G=0;G<=B;G++){const u=G/B*R,i=Math.sin(u),d=Math.cos(u);C.pos.push(k*i,ee+k*d,F),C.nor.push(0,0,v.back?-1:1),C.ink.push(I.r,I.g,I.b);const o=1+.55*Math.sin(u*(v.lobes??1)+(v.ph??0)+N*2.2),z=v.tone?v.tone(u,j):0;C.aux.push(v.noLine?99:N===1?_/2:0,P*o,z,0),C.bnd.push(0)}}for(let N=0;N<2;N++)for(let j=0;j<B;j++){const k=q+N*(B+1)+j,F=k+B+1;v.back?C.idx.push(k,k+1,F,k+1,F+1,F):C.idx.push(k,F,k+1,k+1,F,F+1)}},g=(e,l,f,c)=>(I,v)=>{const q=.3+.46*Math.abs(Math.sin((I*e+l)*.5));return .5+(c>f?v-q:q-v)*3};y(ce,A+.9,fe,A+.9,w.olive,{noLine:!0}),y(fe,A+.9,fe+.01,A,w.olive,{noLine:!0}),y(fe,A,he,A,w.olive,{noLine:!0}),y(he,A+.25,we,A+.25,w.teal,{lw:.34,lobes:2,ph:1,tone:g(24,D,.2,.8)}),y(we,A,de,A,w.sage,{lw:.3,lobes:1,ph:3,tone:g(m,.4,.8,.1)}),y(de,A+1.1,re,A+1.1,w.olive,{noLine:!0}),y(de,A,de+.01,A+1.1,w.olive,{noLine:!0}),y(re,A+1.1,re,-A-1.1,w.olive,{noLine:!0}),y(ce,A+.9,ce,-A-.9,w.olive,{noLine:!0}),y(ce,-A-.9,he,-A-.9,w.olive,{noLine:!0,back:!0}),y(he,-A,we+6,-A,w.sage,{lw:.3,back:!0,tone:g(18,0,.2,.8)}),y(we+6,-A,de,-A,w.teal,{lw:.3,back:!0,lobes:2,tone:g(m*2,1,.8,.2)}),y(de,-A-1.1,re,-A-1.1,w.olive,{noLine:!0,back:!0}),await W.yield?.();const S=n.batch(),t=(e,l,f=0)=>a(l*Math.sin(e),ee+l*Math.cos(e),A+f);for(let e=0;e<$;e++){const l=e/$*R,f=t(l,57,1.45),c=[];for(let I=0;I<10;I++){const v=I/10*R;c.push(t(l,57,1.2).add(a(Math.cos(v)*1.15,Math.sin(v)*1.15,0)))}n.fan(S,f,c,{ink:w.gold,gold:1,lw:.2,normal:a(Math.cos(l+e*.9),-Math.sin(l+e*.9),.25).normalize()})}for(let e=0;e<24;e++){const l=D+e/24*R,f=e%2===0?1:.62,c=t(l,(he+we)/2+(e%2?2.1:-.6),.5),I=[];for(let v=0;v<16;v++){const q=v/16*R+l*-1,P=v%4/4,_=f*(v%4===0?3.5:1.05+2.4*(1-Math.sin(P*Math.PI))**2);I.push(a(c.x+Math.cos(q)*_,c.y+Math.sin(q)*_,c.z))}n.fan(S,c,I,{ink:w.gold,gold:1,lw:.17,inset:1*f,normal:a(Math.cos(e*2.4),Math.sin(e*2.4),.3).normalize()})}await W.yield?.();const b=(e,l=.75)=>f=>e*Math.pow(Math.max(Math.sin(Math.PI*Math.pow(f,l)),0),.8),x=e=>l=>l*e>.12?1:0;for(let e=0;e<m;e++){const l=(e+.5)/m*R,f=e%2?-1:1,c=t(l,44.5,0),I=a(-Math.sin(l),-Math.cos(l),0),v=a(Math.cos(l),-Math.sin(l),0).multiplyScalar(f),q=H.range(-.1,.1),P=[],_=[];for(let u=0;u<=18;u++){const i=u/18,d=53.9-i*9.4,o=f*(5.2*Math.sin(i*Math.PI*1.5+.2)*(1-i)*(1-i)-0);P.push(t(l+o/d,d,.1));const z=53.9-i*6.6,Z=f*(-3-6.4*Math.sin(i*Math.PI*.9)-2.2*i*i);_.push(t(l+Z/z,z,.06))}n.ribbon(S,_,{half:u=>.3+.14*(1-u),ink:w.teal,lw:.11,normal:h}),n.ribbon(S,P,{half:u=>.44+.2*u,ink:w.teal,lw:.14,normal:h,tone:x(f)});for(const u of[1,-1]){const i=P[u>0?3:6],d=n.whiplash({origin:a(i.x,i.y,A+.03),u:I,v,len:u>0?13.5:10.5,n:18,heading:u*1.25,bend:-u*1.05,curl:u*2.4,curlAt:.66});n.ribbon(S,d,{half:b(u>0?1:.85,.6),ink:w.teal,lw:.13,normal:h,tone:x(u)})}const N=_[18],j=_[16],k=a().subVectors(N,j).normalize(),F=a().crossVectors(h,k);n.ribbon(S,n.whiplash({origin:a(N.x,N.y,A+.14),u:k,v:F,len:4.6,n:12,bend:f*.5}),{half:b(.85,.9),ink:w.cream,lw:.15,normal:h,tone:x(-f)});const G=(u,i,d,o,z,Z,X)=>n.ribbon(S,n.whiplash({origin:a(c.x,c.y,A+Z),u:I,v,len:u,n:16,heading:d+q,bend:o,curl:z,curlAt:.62}),{half:b(i,.7),ink:w.cream,lw:.17,normal:h,tone:x(X)});G(8.6,1.05,1.02,.35,3,.14,1),G(8.6,1.05,-1.02,-.35,-3,.14,-1),G(9.6,1.3,.46,-.1,1.9,.18,1),G(9.6,1.3,-.46,.1,-1.9,.18,-1),G(10.2,1.4,0,.12*f,0,.22,f),n.ribbon(S,[a(c.x,c.y,A+.26).addScaledVector(I,-1.5),a(c.x,c.y,A+.26).addScaledVector(I,.3),a(c.x,c.y,A+.26).addScaledVector(I,2.1)],{half:u=>.95*Math.sin(Math.PI*(.12+.88*u))**.7,ink:w.teal,tone:1,lw:.15,normal:h});for(let u=-1;u<=1;u++){const i=n.whiplash({origin:a(c.x,c.y,A+.3).addScaledVector(I,1.5),u:I,v,len:9.2+(u===0?1.2:0),n:10,heading:q+u*.2,bend:u*.25,curl:u*.9+.3*f});n.ribbon(S,i,{half:()=>.15,ink:w.gold,gold:1,lw:0,normal:h});const d=i[9],o=[];for(let z=0;z<8;z++)o.push(a(d.x+Math.cos(z*R/8)*.5,d.y+Math.sin(z*R/8)*.5,d.z));n.fan(S,d,o,{ink:w.gold,gold:1,lw:.1,normal:a(Math.cos(e+u),Math.sin(e+u),.2).normalize()})}e%4===3&&await W.yield?.()}const U=n.ink({grainScale:.9,lineHold:1}),E=new s.Mesh(n.geometry(C),U);E.name="disc";const J=new s.Mesh(n.geometry(S),n.ink({grainScale:2.2,lineHold:.3}));J.name="ornament",r.add(E,J),await W.yield?.();{const e=H.fork?H.fork("chips"):H,l=.43/Math.sqrt(V),f=[];for(let k=fe+.42;k<he-.3;k+=l)f.push([k,Math.floor(R*k/l),l*.86,.07]);f.push([(ce+fe)/2,64,.62,.98]);let c=0;for(const k of f)c+=k[1];const I=n.batch(),v=a(0,0,0);n.fan(I,v,[a(-.5,-.5,0),a(.5,-.5,0),a(.5,.5,0),a(-.5,.5,0)],{ink:w.gold,gold:1,lw:.075,inset:.5,normal:a(1,0,0)});const q=n.geometry(I),P=new Float32Array(c*16),_=new Float32Array(c*4);let N=0;for(const[k,F,G,u]of f){const i=e()*R;for(let d=0;d<F;d++,N++){const o=i+d/F*R,z=Math.sin(o),Z=Math.cos(o),X=(e()-.5)*1.3,Q=(e()-.5)*.5,ae=(e()-.5)*.5,te=G*(.86+.2*e()),p=Math.cos(X),O=Math.sin(X);let K=[Z*p+z*O,-z*p+Z*O,0],L=[Q,ae,1];const ne=Math.hypot(L[0],L[1],L[2]);L=[L[0]/ne,L[1]/ne,L[2]/ne];const me=K[0]*L[0]+K[1]*L[1];K=[K[0]-L[0]*me,K[1]-L[1]*me,-L[2]*me];const ke=Math.hypot(K[0],K[1],K[2]);K=[K[0]/ke,K[1]/ke,K[2]/ke];const Se=[L[1]*K[2]-L[2]*K[1],L[2]*K[0]-L[0]*K[2],L[0]*K[1]-L[1]*K[0]];P.set([K[0]*te,K[1]*te,K[2]*te,0,Se[0]*te,Se[1]*te,Se[2]*te,0,L[0],L[1],L[2],0,k*z,ee+k*Z,A+u,1],N*16),_.set([e()*6.28,k*1.5+2.4*Math.sin(o*9),0,0],N*4),N%900===899&&await W.yield?.()}}const j=new s.InstancedMesh(q,n.ink({inst:!0,grainScale:3}),c);j.instanceMatrix.array.set(P),j.instanceMatrix.needsUpdate=!0,q.setAttribute("iA",new s.InstancedBufferAttribute(_,4)),j.frustumCulled=!1,j.name="mosaic",r.add(j)}await W.yield?.();const oe=(e,l)=>{const f=Math.hypot(e,l*.92),c=Math.min(f/190,1);return-52*c*c*(3-2*c)-1.2},ie=[],se=[],le=[0,52,20,74,36];for(let e=0;e<Te;e++){const l=i=>Re+ue*e-Pe*i/R,f=-74+e/(Te-1)*128+H.range(-8,8),c=96+H.range(-10,12)+8*Math.sin(e*2.1),I=-.9,v=(Re+ue*e-35.5)/Pe*R,q=18-ue*e,P=i=>{const d=i*Math.PI/180,o=Math.max(0,(25-i)/75);return a(57+q*Math.cos(d),16.6+q*Math.sin(d),A+.55+13*o*o)},_=(i,d,o)=>(T.hillY||oe)(i,d)+o,N=[a(f*1.25-6,_(f*1.25-6,c+38,2.2),c+38),a(f,_(f,c,2.4),c),a(f*.4+40,_(f*.4+40,66,3+e*.7),66-e*2.5),a(68+q*1.15,_(68+q*1.15,42,5+e),42-e*1.6),a(62+q*1.12,_(62+q*1.12,24,12+e*1.5),24-e)];for(let i=-50;i<=125;i+=25)N.push(P(i));N.push(P(141.5));const j=new s.CatmullRomCurve3(N,!1,"centripetal"),k=120,F=[];for(let i=0;i<k;i++)F.push(j.getPoint(i/k));const G=Math.ceil((v-I)*46/1.25);let u=0;for(let i=1;i<k;i++)u+=F[i].distanceTo(F[i-1]);for(let i=0;i<=G;i++){const d=I+(v-I)*i/G,o=l(d);F.push(a(-o*Math.sin(d),ee-o*Math.cos(d),A+.55))}u+=F[k].distanceTo(F[k-1])+.9*l(-.45),ie.push(n.tressGeometry(F,{phase:e*1.7+H.range(0,6),coilStart:u-le[e],normal:i=>{const d=Math.min(Math.max((i/k-.26)/.2,0),1),o=d*d*(3-2*d);return a(0,1-o,o+.001).normalize()},half:(i,d)=>{const o=Math.min(Math.max((u-d-100)/110,0),1);return ue/2+1.7*o*o*(3-2*o)},sway:(i,d)=>{const o=Math.min(Math.max((u-d-135)/70,0),1),z=T.joinFeet?Math.min(Math.max(d/55,0),1):1;return o*o*(3-2*o)*z*z*(3-2*z)},roll:(i,d)=>u-d>150&&(!T.joinFeet||d>70)?1:0})),se.push({position:N[0].clone(),direction:a().subVectors(N[1],N[0]).normalize(),halfWidth:ue/2+1.7}),await W.yield?.()}const qe=n.hair({sway:2.4,waveLen:130,rollLen:520,strandCount:3}),pe=new s.Mesh(Oe(ie),qe);pe.frustumCulled=!1,pe.name="coil";for(const e of ie)e.dispose();r.add(pe),await W.yield?.();const Ne=[],Ie=a(-33,ee+36,0),_e=Math.atan2(.676,.737)+M,Ge=n.ink({grainScale:2}),Ve=n.hull({weight:.0028});for(let e=0;e<2;e++){const l=_e+(e===0?-Y:Y),f=e===0?-1:1,c=a(Math.cos(l)*-f,Math.sin(l)*-f,0),I=a(-c.y,c.x,0),v=Ie.clone().addScaledVector(c,-42),q=n.batch(),P=[],_=[],N=(p,O,K)=>{const L=Math.min(Math.max((p-57)/13,0),1),ne=Math.min(Math.max((18-p)/18,0),1),me=A+1.35+e*1.3-1.5*L*L+1.3*ne*ne;P.push(a(v.x+c.x*p+I.x*O,v.y+c.y*p+I.y*O,me)),_.push(K)},j=p=>1.3-1.1*Math.max(0,(p-8)/62)**1.2+.42*Math.sin((p-22)*.62)*Math.min(Math.max((p-22)/6,0),1)*Math.min(Math.max((46-p)/6,0),1),k=p=>.62*Math.min(1,.1+(70-p)/11)**.8;for(let p=0;p<=34;p++){const O=70-62*p/34;N(O,j(O),k(O))}for(let p=1;p<20;p++){const O=.34+(R-.68)*p/20;N(3.6+Math.cos(O)*4.6,Math.sin(O)*4.6*.92,.72)}for(let p=0;p<=34;p++){const O=8+62*p/34;N(O,-j(O),k(O))}const F=P.length,G=8,u=a(),i=a(),d=a(),o=a();for(let p=0;p<F;p++){u.subVectors(P[Math.min(p+1,F-1)],P[Math.max(p-1,0)]).normalize(),i.crossVectors(h,u),i.lengthSq()<1e-8&&i.set(1,0,0),i.normalize(),d.crossVectors(u,i);for(let O=0;O<G;O++){const K=O/G*R;if(o.copy(i).multiplyScalar(Math.cos(K)).addScaledVector(d,Math.sin(K)),q.pos.push(P[p].x+o.x*_[p],P[p].y+o.y*_[p],P[p].z+o.z*_[p]),q.nor.push(o.x,o.y,o.z),q.ink.push(w.gold.r,w.gold.g,w.gold.b),q.aux.push(99,.1,0,2),q.bnd.push(0),p<F-1){const L=p*G+O,ne=p*G+(O+1)%G;q.idx.push(L,ne,L+G,ne,ne+G,L+G)}}}const z=a(v.x+c.x*3.6,v.y+c.y*3.6,P[40].z+.2),Z=[];for(let p=0;p<20;p++){const O=p/20*R;Z.push(a(z.x+Math.cos(O)*3.3,z.y+Math.sin(O)*3.1,z.z))}n.fan(q,z,Z,{ink:w.rose,lw:.2,inset:3.1,tone:p=>Math.cos(p/20*R-2.4)>.1?1.4:-.4,toneC:.15});const X=n.geometry(q),Q=new s.Group,ae=new s.Mesh(X,Ge),te=new s.Mesh(X,Ve);Q.add(te,ae),Q.userData.dir=c.clone(),Q.name="hairpin"+e,r.add(Q),Ne.push(Q),await W.yield?.()}const Ce=5.4;{const e=n.batch(),l=a(0,1,0),f=o=>Math.min(Math.max(o/Ce,0),1),c=[];for(let o=0;o<=3;o++)c.push(a(.2*Math.sin(o*1.2),o/3*4.1,0));for(const o of[a(0,0,1),a(1,0,0)])n.ribbon(e,c,{half:z=>.11-.03*z,ink:w.teal,lw:.035,normal:o,bnd:z=>f(z*4.1)});for(let o=0;o<2;o++){const z=o*2.9+.4,Z=a(Math.cos(z),0,Math.sin(z)),X=.6+o*1.2,Q=n.whiplash({origin:a(0,X,0),u:l,v:Z,len:2.6-o*.3,n:6,heading:.55,bend:.5,curl:1.5});n.ribbon(e,Q,{half:b(.2,.6),ink:w.teal,lw:.04,tone:x(1),swell:2,normal:a().copy(l).multiplyScalar(.62).addScaledVector(Z,-.78),bnd:ae=>f(X+ae*1.2)})}for(let o=0;o<6;o++){const z=o/6*R,Z=a(Math.cos(z),0,Math.sin(z)),X=n.whiplash({origin:a(0,4,0),u:l,v:Z,len:2.05,n:6,heading:.26,bend:.25,curl:1.9,curlAt:.5});n.ribbon(e,X,{half:b(.42,.7),ink:w.cream,lw:.055,tone:x(o%2?1:-1),swell:2,normal:a().copy(l).multiplyScalar(.62).addScaledVector(Z,-.78),bnd:()=>1})}for(let o=0;o<3;o++){const z=o*2.1+.5,Z=a(Math.cos(z),0,Math.sin(z)),X=n.whiplash({origin:a(0,4.3,0),u:l,v:Z,len:1.75,n:4,heading:.16,bend:.2});n.ribbon(e,X,{half:Q=>.05+.1*Q*Q,ink:w.gold,gold:1,lw:0,normal:a(-Z.z,0,Z.x),bnd:()=>1})}const I=n.geometry(e),v=H.fork?H.fork("lilies"):H,q=Math.round(300*V),P=[],_=pe.geometry.getAttribute("position"),N=pe.geometry.getAttribute("hB");for(let o=0;o<_.count;o+=15)N.getZ(o)<0&&P.push(_.getX(o),_.getZ(o));const j=new Float32Array(q*16),k=new Float32Array(q*4),F=new s.Matrix4,G=new s.Quaternion,u=new s.Euler;let i=0;for(let o=0;o<q*12&&i<q;o++){const z=Math.floor(v()*9),Z=12+z*6.5+v.range(-1.2,1.2),X=v.range(-1.35,1.35)+(v()<.22?Math.PI:0),Q=Math.sin(X)*Z*1.25,ae=Math.cos(X)*Z+2;if(v()<z/12||Math.abs(ae)<7&&Math.abs(Q)<30)continue;let te=!0;for(let O=0;O<P.length;O+=2)if((P[O]-Q)**2+(P[O+1]-ae)**2<30){te=!1;break}if(!te)continue;const p=v.range(1.1,1.75)*(1+.3*Math.max(0,1-Z/30));F.compose(a(Q,(T.hillY||oe)(Q,ae)-.1,ae),G.setFromEuler(u.set(v.range(-.1,.1),v()*R,v.range(-.1,.1))),a(p,p,p)),F.toArray(j,i*16),k.set([v()*6.28,v()*6.28,0,0],i*4),i++,o%400===399&&await W.yield?.()}const d=new s.InstancedMesh(I,n.ink({inst:!0,bendy:!0,grainScale:3}),i);d.instanceMatrix.array.set(j.subarray(0,i*16)),d.instanceMatrix.needsUpdate=!0,I.setAttribute("iA",new s.InstancedBufferAttribute(k.subarray(0,i*4),4)),d.frustumCulled=!1,d.name="lilies",r.add(d)}if(await W.yield?.(),T.mound!==!1){const e=n.batch(),l=26,f=80,c=W.noise;for(let P=0;P<=l;P++)for(let _=0;_<=f;_++){const N=P/l,j=196*N*(.55+.45*N),k=_/f*R,F=Math.sin(k)*j,G=Math.cos(k)*j,u=c?c.fbm2(F*.011+3.1,G*.011-1.7,3):Math.sin(F*.05)*Math.sin(G*.04);e.pos.push(F,oe(F,G)+u*3.2*N-.4,G),e.nor.push(Math.sin(k)*.5*N,1,Math.cos(k)*.5*N),e.ink.push(w.sage.r,w.sage.g,w.sage.b);const i=(c?c.fbm2(F*.017-9.2,G*.009+4.4,2):Math.sin(F*.07+G*.03))*1.6+.32+.25*Math.sin(k*3+j*.03);if(e.aux.push(99,.1,i,0),e.bnd.push(0),P<l&&_<f){const d=P*(f+1)+_,o=d+f+1;e.idx.push(d,o,d+1,d+1,o,o+1)}}const I=n.geometry(e),v=new s.Mesh(I,n.ink({grainScale:.45})),q=new s.Mesh(I,n.hull({weight:.003}));v.name="mound",q.name="mound-keyline",r.add(q,v)}await W.yield?.();const xe=e=>(e=Math.min(Math.max(e,0),1),e*e*(3-2*e)),ge=()=>{};let Fe=T.progress??ge("wwp")??.6,ye=T.letDown??ge("wwdown")??0;const be=()=>{const e=215+215*xe(Fe);qe.uniforms.uReveal.value=Math.max(e*(1-xe((ye-.25)/.75)),-80);for(const l of Ne)l.position.copy(l.userData.dir).multiplyScalar(-95*xe(ye*2.2))};be();const Me=[];for(let e=0;e<=8;e++){const l=e/8,f=-Math.PI/2+R*l,c=45*Math.pow(1-l,.85);Me.push(a(Math.cos(f)*c,ee+Math.sin(f)*c,210-140*l))}Me.push(a(0,ee,35),a(0,ee,0),a(0,ee,-30));const De=!T.style;return(T.sky??ge("wwsky"))&&r.add(n.sky()),{object:r,radius:78,height:2*re+18,center:a(0,ee,0),ground:!1,groundY:0,style:n,anchors:{portalSeat:{position:a(0,ee,0),normal:a(0,0,1),radius:ce},flyThrough:Me,tressFeet:se,hairpinCross:Ie.clone().setZ(A+2),viewpoints:[a(0,ee-20,240),a(95,ee+8,120),a(-60,ee+30,95),a(0,ee,70)],hillY:oe,discRadius:re,centreY:ee,faceZ:A},setProgress(e){Fe=e,be()},setLetDown(e){ye=Math.min(Math.max(e,0),1),be()},update(e,l,f){De&&n.update(e,l,f)},dispose(){}}}export{ze as WW_EXPOSURE,Ee as WW_PALETTE,it as buildHero,tt as makeStyle,ot as toInk};
