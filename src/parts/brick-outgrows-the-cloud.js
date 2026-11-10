import*as u from"three";import{mergeGeometries as $e}from"three/addons/utils/BufferGeometryUtils.js";const se=["#D9C7A3","#A8452E","#7A5C38","#5F7A45","#6E8C96","#2F5560","#EEE6D2"],me="#3B2A14",ze={uTime:{value:0},uSpinT:{value:0},uRim:{value:1500},uU:{value:.5},uLight:{value:new u.Vector3(-.55,.64,.53).normalize()},uEye:{value:new u.Vector3},uView:{value:new u.Vector2(800,450)},uDist:{value:new u.Vector4(500,700,2500,3e3)},uGreen:{value:new u.Color(se[3])},uBlue:{value:new u.Color(se[4])},uShadowC:{value:new u.Color(se[5])},uUmber2:{value:new u.Color(me)},uCloud:{value:new u.Vector4(0,415,0,.3)},uCloudR:{value:new u.Vector2(300,110)},uTowerPos:{value:new u.Vector3},uTowerLean:{value:new u.Vector2(-.0524,0)},uTowerInv:{value:new u.Matrix4},uStainA:{value:new u.Vector4(.5,9,330,210)},uStainB:{value:new u.Vector4(.66,6,300,140)},uStainCA:{value:new u.Color(se[1])},uStainCB:{value:new u.Color(se[6])},uVaultC:{value:new u.Color("#7a3a23")}},Me=`
uniform float uTime, uU, uSpinT, uRim;
uniform vec3 uLight, uEye, uGreen, uBlue, uShadowC, uUmber2, uTowerPos, uVaultC;
uniform vec2 uView, uCloudR, uTowerLean;
uniform vec4 uDist, uCloud;
float bHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
// The tipped-up earth: flat within 1.2 km of the tower, then rising, sea and all, to uRim at 9 km.
float bowlLift(vec2 xz) { float s = clamp((length(xz - uTowerPos.xz) - 1200.0) / 7800.0, 0.0, 1.3); return uRim * (0.3 * s + 0.7 * s * s); }
`,Re=Me+`
// 1 inside the cloud's cast shadow (a lobed ellipse on the plane of the cloud, thrown along the light), hard edged.
float cloudShadow(vec3 wp) {
  float t = max(uCloud.y - wp.y, 0.0) / max(uLight.y, 0.08);
  vec2 p = wp.xz + uLight.xz * t - uCloud.xz;
  float c = cos(uCloud.w), s = sin(uCloud.w);
  vec2 q = vec2(c * p.x + s * p.y, -s * p.x + c * p.y) / max(uCloudR, vec2(1.0));
  float e = dot(q, q) * (1.0 + 0.16 * sin(q.x * 9.0 + 1.3 + uTime * 0.8) * sin(q.y * 7.0 - uTime * 0.5));      // the lobes boil slowly, as the cloud's do
  float fw = max(fwidth(e), 1e-4);
  return (1.0 - smoothstep(1.0 - fw, 1.0 + fw, e)) * step(wp.y, uCloud.y - 4.0);
}
// 1 inside the shadows of the small clouds that drift over the whole country: flat, hard-edged, lobed ellipses on a
// 1.1 km grid, moving with the clock. Every surface asks where its ray to the light meets the ground, so the same shadow
// lies on the sea, climbs a gable and crosses the tower's face.
float driftShadow(vec3 wp) {
  vec2 p = wp.xz - uLight.xz * (max(wp.y - bowlLift(wp.xz), 0.0) / max(uLight.y, 0.08));
  vec2 bg = (p - vec2(uTime * 14.0, uTime * 6.0)) / 1100.0;
  vec2 bc = floor(bg), bf = (fract(bg) - 0.5 - 0.25 * (vec2(bHash(bc), bHash(bc + 3.1)) - 0.5)) * vec2(1.6, 2.6);
  float be = dot(bf, bf) * (1.0 + 0.2 * sin(bf.x * 40.0 + uTime * 0.4) * sin(bf.y * 31.0));
  float bw = max(fwidth(be), 1e-5);
  return (1.0 - smoothstep(0.16 - bw, 0.16 + bw, be)) * step(0.3, bHash(bc + 7.7));
}
// 1 inside the tower's cast shadow (for the ground, the town and the sea; the tower itself does not use it).
float towerShadow(vec3 wp) {
  float sh = 0.0;
  for (int i = 0; i < 9; i++) {
    float h = float(i) * 60.0;
    float t = max(h - (wp.y - uTowerPos.y), 0.0) / max(uLight.y, 0.08);
    vec2 c = uTowerPos.xz + uTowerLean * h - uLight.xz * t;
    float r = 350.0 - 28.0 * float(i);
    vec2 d = wp.xz - c;
    sh = max(sh, step(dot(d, d), r * r));
  }
  return sh;
}
// Distance changes the pigment, never the sharpness: brown, then green, then blue, in rings round the eye.
vec3 pigmentDistance(vec3 c, vec3 wp, float k) {
  float d = length(wp.xz - uEye.xz);
  float l = dot(c, vec3(0.3, 0.5, 0.2));
  vec3 g = uGreen * (0.42 + 1.25 * l), b = mix(uBlue * (0.42 + 1.2 * l), uBlue, 0.2);
  c = mix(c, g, smoothstep(uDist.x, uDist.y, d) * k);
  c = mix(c, b, smoothstep(uDist.z, uDist.w, d) * k);
  return c;
}
// A ruled line every 'period' metres, 'w' metres wide, never thinner than 1.5 px; below 3 px a period it is its flat average.
float ruled(float x, float period, float w) {
  float fw = max(fwidth(x), 1e-6);
  float ww = max(w, 1.5 * fw);
  float d = abs(fract(x / period + 0.5) - 0.5) * period;
  float line = 1.0 - smoothstep(0.5 * ww - 0.5 * fw, 0.5 * ww + 0.5 * fw, d);
  return mix(w / period, line, smoothstep(3.0, 6.0, period / fw));
}
float fadeAt(float x, float period) { return smoothstep(3.0, 6.0, period / max(fwidth(x), 1e-6)); }
// A coarse bond: courses ch tall and bl long, staggered; the lines keep to 1.5 px.
float coarse(vec2 uv, float ch, float bl) {
  float xs = uv.x + bl * 0.5 * mod(floor(uv.y / ch), 2.0);
  float odd = step(0.86, bHash(vec2(floor(xs / bl), floor(uv.y / ch) + 31.0)));
  return max(max(0.36 * ruled(uv.y, ch, ch * 0.1), 0.3 * ruled(xs, bl, ch * 0.1)), 0.16 * odd);
}
// The marks of masonry: returns how much double umber is glazed over the tone (0..~0.5). mark: 1 brick, 2 ashlar, 3 timber.
float masonry(vec2 uv, float mark) {
  float m = 0.0;
  if (mark > 8.5) return 0.0;
  if (mark > 7.5) {                                     // turf: tufts, a dark tick each, and far off whole patches a tone apart
    vec2 tc = floor(uv / vec2(0.9, 0.6)), tf = fract(uv / vec2(0.9, 0.6));
    m = 0.55 * step(0.5, bHash(tc)) * step(abs(tf.x - 0.5), 0.1) * step(abs(tf.y - 0.45), 0.32) * fadeAt(uv.y, 0.25);
    vec2 pc = uv / vec2(2.3, 1.5) + 0.35 * sin(uv.yx * 1.9);
    m = max(m, 0.26 * step(0.5, bHash(floor(pc) + 5.0)) * fadeAt(uv.y, 1.5));
    m = max(m, 0.14 * step(0.6, bHash(floor(uv / vec2(9.0, 6.0)) + 9.0)));
  } else if (mark > 6.5) {                              // living rock: beds and fissures, drawn
    m = max(0.6 * ruled(uv.y + 0.7 * sin(uv.x * 0.31), 2.6, 0.09), 0.5 * ruled(uv.x + 1.1 * sin(uv.y * 0.43) + 3.1 * bHash(vec2(floor((uv.y + 0.7 * sin(uv.x * 0.31)) / 2.6 + 0.5), 2.0)), 6.2, 0.09));
    m = max(m, 0.2 * step(0.55, bHash(floor(vec2(uv.x / 6.2 + 0.13 * sin(uv.y * 0.43), uv.y / 2.6)))) * fadeAt(uv.y, 2.6));
    m = max(m, 0.12 * step(0.5, bHash(floor(vec2(uv.x / 19.0, uv.y / 7.8)) + 4.0)));
  } else if (mark > 4.5) {                              // an arch ring: voussoirs across the band, a contour on each edge
    float vp = mark < 5.5 ? 0.075 : 0.5, v1 = mark < 5.5 ? 4.0 : 3.0, v2 = mark < 5.5 ? 10.0 : 3.0;
    float g0 = fadeAt(uv.x, vp), g1 = fadeAt(uv.x, vp * v1), g2 = fadeAt(uv.x, vp * v2);
    m = max(0.36 * ruled(uv.x, vp, vp * 0.14), 0.8 * ruled(uv.y, 1.5, 0.07));
    // far off the unit grows: the ring is still counted, in groups of bricks on edge
    m = max(m, 0.4 * ruled(uv.x, vp * v1, vp * 0.4) * g1 * (1.0 - 0.85 * g0));
    m = max(m, 0.4 * ruled(uv.x, vp * v2, vp * 0.6) * g2 * (1.0 - 0.85 * g1));
    m = max(m, 0.12 * step(0.8, bHash(vec2(floor(uv.x / vp), 3.0))) * g0);
  } else if (mark > 2.5) {                              // timber: plank joints along the piece
    m = 0.5 * ruled(uv.x, 0.32, 0.03);
  } else if (mark > 0.5) {
    bool brick = mark < 1.5;
    float ch = brick ? 0.065 : 0.46, bl = brick ? 0.215 : 1.05;
    float row = floor(uv.y / ch);
    float xs = uv.x + bl * 0.5 * mod(row, 2.0);
    float fine = fadeAt(uv.y, ch);
    float odd = step(0.9, bHash(vec2(floor(xs / bl), row)));                 // every tenth brick a tone darker
    m = max(m, 0.34 * ruled(uv.y, ch, ch * 0.16));
    m = max(m, 0.30 * ruled(xs, bl, ch * 0.16) * fine);
    m = max(m, mix(0.02, 0.2 * odd, fine));
    // far off the unit grows, as the painter's does: courses are still drawn, a few to a mark, with their perpends
    float k1 = brick ? 4.0 : 3.0, k2 = brick ? 10.0 : 3.0;
    float f1 = fadeAt(uv.y, ch * k1), f2 = fadeAt(uv.y, ch * k2);
    m = max(m, coarse(uv, ch * k1, bl * k1) * f1 * (1.0 - 0.85 * fine));
    m = max(m, coarse(uv, ch * k2, bl * k2) * f2 * (1.0 - 0.85 * f1) * (brick ? 1.0 : 0.0));
    // the lift: a scaffold height of work, its joint and its putlog holes
    float lh = brick ? 1.3 : 1.84, lw = brick ? 2.6 : 3.15;
    float lrow = floor(uv.y / lh);
    m = max(m, 0.26 * ruled(uv.y, lh, 0.035));
    vec2 hp = vec2(fract(uv.x / lw + 0.37 * lrow) * lw, fract(uv.y / lh) * lh) - vec2(0.5 * lw, 0.62 * lh);
    float hw = max(0.09, 0.75 * fwidth(uv.y));
    float hole = (1.0 - smoothstep(hw, hw * 1.3 + 1e-4, max(abs(hp.x), abs(hp.y))));
    m = max(m, mix(0.02, 0.8 * hole, fadeAt(uv.y, lh * 0.33)));
    // the day's work: whole patches a tone apart, flat, so no wall is ever bare
    vec2 dc = floor(vec2(uv.x / (lw * 3.0) + 0.5 * mod(floor(uv.y / (lh * 3.0)), 2.0), uv.y / (lh * 3.0)));
    m = max(m, 0.13 * step(0.62, bHash(dc + 7.0)) * fadeAt(uv.y, lh * 3.0));
    m = min(m * 1.3, 0.7);
  }
  return m;
}
// An arch mouth (mark 9; q in arch units from the springing centre, half span 1). Far off it is flat double umber. Near,
// the vault is drawn running back into the dark in one-point perspective: ring inside ring, each a tone deeper, a rib
// where each begins, the floor and one wall a tone lighter, the end double umber.
vec3 vaultMouth(vec2 q) {
  float px = 1.0 / max(fwidth(q.x) + fwidth(q.y), 1e-4);
  float near = smoothstep(16.0, 34.0, px);
  vec2 vp = vec2(0.14, -0.9), d = q - vp;
  float dd = max(dot(d, d), 1e-5), vd = dot(vp, d);
  float kArc = dd / max(-vd + sqrt(max(vd * vd + dd * (1.0 - dot(vp, vp)), 0.0)), 1e-4);
  float kWall = d.x > 0.0 ? d.x / (1.0 - vp.x) : -d.x / (1.0 + vp.x);
  float kFloor = -d.y / 1.7;
  float k, zone;      // zone: 0 soffit, 1 wall, 2 floor
  if (d.y < 0.0) { k = max(kWall, kFloor); zone = kFloor > kWall ? 2.0 : 1.0; }
  else if (vp.y + d.y / max(kWall, 1e-4) <= 0.0) { k = kWall; zone = 1.0; }
  else { k = kArc; zone = 0.0; }
  k = clamp(k, 0.02, 1.0);
  float lk = log(k) / log(0.76), ring = floor(lk), fl = lk - ring, fw = max(fwidth(lk), 1e-4);
  float m = min(0.08 + 0.24 * ring, 0.96);
  m -= zone > 1.5 ? 0.16 : (zone > 0.5 && d.x > 0.0 ? 0.1 : 0.0);
  float rib = (1.0 - smoothstep(0.1, 0.1 + fw, fl)) * step(0.5, ring) * step(zone, 1.5);
  m = mix(m, max(m - 0.3, 0.0), rib);
  m = mix(m, 0.97, step(4.5, lk));
  return mix(uVaultC, uUmber2, clamp(mix(1.0, m, near), 0.0, 1.0));
}
// THE routine. cl / cs: the light and shade pigments of this surface; n: world normal; wp: world position;
// uv: metres along and up the surface; mark: 0 none, 1 brick, 2 ashlar, 3 timber, 5 brick arch ring, 6 stone arch ring, 7 living rock
// (ring uv: x along the ring, y 0..1.5 across the band); distK: strength of the pigment rings.
vec3 bruegel(vec3 cl, vec3 cs, vec3 n, vec3 wp, vec2 uv, float mark, float distK) {
  float lit = step(0.04, dot(n, uLight));
  if (mark > 6.5 && mark < 7.5) {      // living rock: every bed carries its turf (a band with a ragged lower edge), and whatever lies flat is turf
    float bed = uv.y / 10.5 + 0.3 * sin(uv.x * 0.045) + 0.17 * sin(uv.x * 0.13 + 1.7);
    float bi = floor(bed), bf = bed - bi + 0.05 * sin(uv.x * 0.8 + bi * 2.3) + 0.03 * sin(uv.x * 2.9);
    float gap = step(0.3, bHash(vec2(floor(uv.x / 37.0 + bi * 0.37), bi)));
    if (bf > 0.6 - 0.16 * bHash(vec2(bi, 5.0)) && gap > 0.5 || n.y > 0.82) { cl = mix(uGreen, uUmber2, 0.2); cs = mix(uGreen, uUmber2, 0.58); mark = 8.0; }
  }
  vec3 c = mix(cs, cl, lit);
  vec3 du = cl - uUmber2;
  float sh = max(cloudShadow(wp), driftShadow(wp));
#ifdef TOWER_SHADOW
  sh = max(sh, towerShadow(wp));
#endif
  c = mix(c, mix(cs, uShadowC, 0.25 * step(0.004, dot(du, du))), sh);
  c = mix(c, uUmber2, masonry(uv, mark));
  if (mark > 8.5) c = vaultMouth(uv);
  return pigmentDistance(c, wp, distK);
}
`,Bt=`
attribute vec3 aLight, aShade;
attribute vec2 aUV;
attribute float aMark;
#ifdef INST
attribute vec3 iLight, iShade;     // pigment pair of this instance, taken where the vertex has aTint 1
attribute vec4 iInfo;              // x: mark of tinted parts, y: birth u, z: seed, w: spare
attribute float aTint;
#endif
varying vec3 vL, vS, vN, vW;
varying vec2 vUV;
varying float vMark;
void main() {
  vec3 p = position, n = normal;
  vL = aLight; vS = aShade; vMark = aMark; vUV = aUV;
#ifdef INST
  vL = mix(aLight, iLight, aTint); vS = mix(aShade, iShade, aTint);
  if (aTint > 0.5) vMark = aMark > 3.5 ? iInfo.x + 4.0 : iInfo.x;      // aMark 4 on a tinted vertex = the arch ring of the instance's masonry
#ifdef SPIN
  { float a = uSpinT * iInfo.w, c = cos(a), sn = sin(a); p.yz = vec2(c * p.y - sn * p.z, sn * p.y + c * p.z); n.yz = vec2(c * n.y - sn * n.z, sn * n.y + c * n.z); }
#endif
  float grow = smoothstep(iInfo.y, iInfo.y + 0.035, uU);
  p.y *= grow; p.z *= step(0.001, grow);
  vec3 sc = vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz));
  vUV = aMark > 8.5 ? aUV : aUV * sc.xy + vec2(iInfo.z * 37.0, iInfo.z * 11.0);
  vec4 wp = modelMatrix * instanceMatrix * vec4(p, 1.0);
#ifdef BOWL
  wp.y += bowlLift((modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xz);
#endif
  vN = mat3(modelMatrix) * (mat3(instanceMatrix) * (n / max(sc * sc, vec3(1e-6))));
#else
  vec4 wp = modelMatrix * vec4(p, 1.0);
#ifdef BOWL
  wp.y += bowlLift(wp.xz);
#endif
  vN = mat3(modelMatrix) * n;
#endif
  vW = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`,Wt=`
uniform float uDistK;
varying vec3 vL, vS, vN, vW;
varying vec2 vUV;
varying float vMark;
#ifdef STAIN
uniform mat4 uTowerInv;
uniform vec4 uStainA, uStainB;        // bearing (rad), half width (m), top height, full length (m), all in the tower's frame
uniform vec3 uStainCA, uStainCB;
float stainMask(vec3 tp, vec4 st) {
  float r = length(tp.xz);
  float a = atan(tp.x, r < 1e-3 ? 1.0 : tp.z) - st.x;
  a -= 6.2831853 * floor(a / 6.2831853 + 0.5);
  float d = a * r, tongue = floor(d / 4.5);
  float len = st.w * (0.5 + 0.5 * uU) * (0.45 + 0.55 * bHash(vec2(tongue, st.z)));
  float hw = st.y * (0.75 + 0.25 * bHash(vec2(tongue, 3.0)));
  // near, a tongue is runs and drips a hand wide with wall between them (never a slab of one colour); far, its flat average
  float run = floor(d / 1.3), drip = step(fract(d / 1.3), 0.34 + 0.4 * bHash(vec2(run, 7.0))) * step(st.z - len * (0.35 + 0.65 * bHash(vec2(run, 9.0))), tp.y);
  return step(abs(d), hw) * step(st.z - len, tp.y) * step(tp.y, st.z + 2.0) * mix(0.8, drip, fadeAt(d, 1.3));
}
#endif
void main() {
  vec3 n = vN / max(length(vN), 1e-5);
  if (!gl_FrontFacing) n = -n;
  vec3 cl = vL, cs = vS;
#ifdef STAIN
  vec3 tp = (uTowerInv * vec4(vW, 1.0)).xyz;
  float keep = step(0.02, dot(vL - uUmber2, vL - uUmber2)) * step(n.y, 0.6);          // the dark mouths take no dust, and it runs down faces: the roads stay their own colour
  float sa = stainMask(tp, uStainA) * keep, sb = stainMask(tp, uStainB) * keep;
  cl = mix(cl, uStainCA, 0.82 * sa); cs = mix(cs, mix(uStainCA, uUmber2, 0.5), 0.82 * sa);
  cl = mix(cl, uStainCB, 0.85 * sb); cs = mix(cs, mix(uStainCB, uUmber2, 0.45), 0.85 * sb);
#endif
  gl_FragColor = vec4(bruegel(cl, cs, n, vW, vUV, vMark, uDistK), 1.0);
}
`;function Ke(t={}){return new u.ShaderMaterial({uniforms:{...ze,uDistK:{value:t.distK??1}},defines:{...t.instanced?{INST:1}:{},...t.stain?{STAIN:1}:{},...t.spin?{SPIN:1}:{},...t.towerShadow?{TOWER_SHADOW:1}:{},...t.bowl?{BOWL:1}:{}},vertexShader:Me+Bt,fragmentShader:Re+Wt,side:t.side??u.FrontSide})}function It(t={}){return new u.ShaderMaterial({uniforms:{...ze,uWidth:{value:t.width??1.8},uDistK:{value:t.distK??.5}},defines:t.bowl?{BOWL:1}:{},side:u.BackSide,vertexShader:Me+`
      attribute vec3 hullN;
      uniform float uWidth;
      varying vec3 vW;
      void main() {
        mat4 mm = modelMatrix;
        #ifdef USE_INSTANCING
        mm = modelMatrix * instanceMatrix;
        #endif
        vec4 wp = mm * vec4(position, 1.0);
        #ifdef BOWL
        wp.y += bowlLift((mm * vec4(0.0, 0.0, 0.0, 1.0)).xz);
        #endif
        vec3 wn = mat3(mm) * hullN;
        vW = wp.xyz;
        vec4 cp = projectionMatrix * viewMatrix * wp;
        vec4 cn = projectionMatrix * viewMatrix * vec4(wp.xyz + wn, 1.0);
        vec2 d = (cn.xy / max(abs(cn.w), 1e-4) - cp.xy / max(abs(cp.w), 1e-4)) * uView;
        float l = length(d);
        d = l > 1e-5 ? d / l : vec2(0.0);
        cp.xy += d / uView * 2.0 * uWidth * cp.w;
        gl_Position = cp;
      }`,fragmentShader:Re+`
      uniform float uDistK; varying vec3 vW;
      void main() { gl_FragColor = vec4(pigmentDistance(uUmber2, vW, uDistK), 1.0); }`})}function Le(t){const r=t.attributes.position,e=t.attributes.normal,b=new Map,y=new Float32Array(r.count*3),d=new Array(r.count);for(let s=0;s<r.count;s++){const o=Math.round(r.getZ(s)*50),i=(Math.round(r.getX(s)*50)+4194304)*8388608+Math.round(r.getY(s)*50)+4194304;let l=b.get(i);l||(l=[],b.set(i,l));let f=null;for(let n=0;n<l.length;n++)if(l[n][3]===o){f=l[n];break}f||(f=[0,0,0,o],l.push(f)),f[0]+=e.getX(s),f[1]+=e.getY(s),f[2]+=e.getZ(s),d[s]=f}for(let s=0;s<r.count;s++){const o=d[s],i=Math.hypot(o[0],o[1],o[2])||1;y[s*3]=o[0]/i,y[s*3+1]=o[1]/i,y[s*3+2]=o[2]/i}return t.setAttribute("hullN",new u.BufferAttribute(y,3)),t}async function ht(t,r){const e=t.attributes.position,b=t.attributes.normal,y=new Map,d=new Float32Array(e.count*3),s=new Array(e.count);for(let o=0;o<e.count;o++){o%5e3===4999&&await r();const i=Math.round(e.getZ(o)*50),l=(Math.round(e.getX(o)*50)+4194304)*8388608+Math.round(e.getY(o)*50)+4194304;let f=y.get(l);f||(f=[],y.set(l,f));let n=null;for(let w=0;w<f.length;w++)if(f[w][3]===i){n=f[w];break}n||(n=[0,0,0,i],f.push(n)),n[0]+=b.getX(o),n[1]+=b.getY(o),n[2]+=b.getZ(o),s[o]=n}await r();for(let o=0;o<e.count;o++){o%15e3===14999&&await r();const i=s[o],l=Math.hypot(i[0],i[1],i[2])||1;d[o*3]=i[0]/l,d[o*3+1]=i[1]/l,d[o*3+2]=i[2]/l}return t.setAttribute("hullN",new u.BufferAttribute(d,3)),t}function Ht(t={}){return new u.ShaderMaterial({uniforms:{...ze,uDistK:{value:t.distK??.5}},side:u.DoubleSide,vertexShader:Me+`
      attribute vec3 aOther, aLight;
      attribute vec4 aSway;            // xyz: swing of this end in metres, w: phase
      attribute vec3 aRib;             // x: side -1/+1, y: width in metres, z: birth u (rises from its lower end)
      varying vec3 vC, vW;
      void main() {
        vec3 a = position, b = aOther;
        float grow = smoothstep(aRib.z, aRib.z + 0.03, uU);
        vec3 lo = a.y < b.y ? a : b;
        a = mix(lo, a, grow); b = mix(lo, b, grow);
        a += aSway.xyz * sin(uTime * 0.9 + aSway.w);
        vec4 wa = modelMatrix * vec4(a, 1.0), wb = modelMatrix * vec4(b, 1.0);
        vec4 ca = projectionMatrix * viewMatrix * wa, cb = projectionMatrix * viewMatrix * wb;
        vec2 d = (cb.xy / max(abs(cb.w), 1e-4) - ca.xy / max(abs(ca.w), 1e-4)) * uView;
        float l = length(d);
        d = l > 1e-5 ? d / l : vec2(1.0, 0.0);
        float pxPerM = uView.y * projectionMatrix[1][1] * 0.5 / max(abs(ca.w), 1e-3);
        float wpx = max(aRib.y * pxPerM, 1.5) * step(0.001, grow);
        ca.xy += vec2(-d.y, d.x) * aRib.x * wpx / uView * ca.w;
        vC = aLight; vW = wa.xyz;
        gl_Position = ca;
      }`,fragmentShader:Re+`
      uniform float uDistK; varying vec3 vC, vW;
      void main() { gl_FragColor = vec4(pigmentDistance(vC, vW, uDistK), 1.0); }`})}function mt(){const t=[],r=[],e=[],b=[],y=[],d=[];let s=0;const o=(i,l,f,n,w,S,z,h)=>{t.push(i.x,i.y,i.z),r.push(l.x,l.y,l.z),e.push(w.r,w.g,w.b),b.push(f,n,S),y.push(z?z.x:0,z?z.y:0,z?z.z:0,h)};return{get count(){return s/4},seg(i,l,f,n,w=-1,S=null,z=null,h=0){o(i,l,-1,f,n,w,S,h),o(i,l,1,f,n,w,S,h),o(l,i,1,f,n,w,z,h),o(l,i,-1,f,n,w,z,h),d.push(s,s+1,s+2,s+1,s+3,s+2),s+=4},build(){const i=new u.BufferGeometry;return i.setAttribute("position",new u.Float32BufferAttribute(t,3)),i.setAttribute("aOther",new u.Float32BufferAttribute(r,3)),i.setAttribute("aLight",new u.Float32BufferAttribute(e,3)),i.setAttribute("aRib",new u.Float32BufferAttribute(b,3)),i.setAttribute("aSway",new u.Float32BufferAttribute(y,4)),i.setIndex(d),i}}}const pt=t=>[parseInt(t.slice(1,3),16),parseInt(t.slice(3,5),16),parseInt(t.slice(5,7),16)];function ae(t,r,e){const b=pt(t),y=pt(r);return new u.Color().setRGB((b[0]+(y[0]-b[0])*e)/255,(b[1]+(y[1]-b[1])*e)/255,(b[2]+(y[2]-b[2])*e)/255,u.SRGBColorSpace)}function Nt(t=se){const r=me,e=(y,d=.42)=>[new u.Color(y),ae(y,r,d)],b=y=>"#"+y.getHexString();return{stone:e(t[0]),brick:e(t[1]),timber:e(t[2],.5),lime:e(t[6],.36),thatch:[ae(t[2],t[0],.35),ae(t[2],r,.4)],rock:[ae(t[0],t[2],.42),ae(t[2],r,.55)],turf:[ae(t[3],t[2],.35),ae(t[3],r,.6)],cloud:[new u.Color(t[6]),new u.Color(t[4])],red:e(t[1],.3),smock:[ae(t[0],t[2],.5),ae(t[2],r,.6)],dark:[new u.Color(r),new u.Color(r)],umber2:new u.Color(r),hex:b}}function ue(){const t=[],r=[],e=[],b=[],y=[],d=[],s=[],o=[];let i=0;const l=new u.Vector3,f=new u.Vector3,n=new u.Vector3,w=new u.Vector3,S=new u.Vector3(0,1,0),z={get tris(){return o.length/3},poly(h,I,B=0,H=0,G=null,R=null){if(l.subVectors(h[1],h[0]),f.subVectors(h[h.length-1],h[0]),n.crossVectors(l,f),n.lengthSq()<1e-12)return;n.normalize();const m=Math.abs(n.y)>.9;m||w.crossVectors(S,n).normalize();for(let k=0;k<h.length;k++){const P=h[k],C=R?R[k]:n;t.push(P.x,P.y,P.z),r.push(C.x,C.y,C.z),e.push(I[0].r,I[0].g,I[0].b),b.push(I[1].r,I[1].g,I[1].b),d.push(B),s.push(H),G?y.push(G[k][0],G[k][1]):m?y.push(P.x,P.z):y.push(P.dot(w),P.y)}for(let k=1;k<h.length-1;k++)o.push(i,i+k,i+k+1);i+=h.length},box(h,I,B,H,G,R,m,k=0,P=0,C=null,M="b",v=null){const p=v?v[0]:0,V=v?v[1]:0,L=(ie,c,A)=>{const g=new u.Vector3(ie,c,A);return C?g.applyMatrix4(C):g},K=L(h,I,B),x=L(H,I,B),E=L(h,I,R),D=L(H,I,R),U=L(h+p,G,B+V),q=L(H-p,G,B+V),j=L(h+p,G,R-V),J=L(H-p,G,R-V);z.poly([E,D,J,j],m,k,P),z.poly([x,K,U,q],m,k,P),z.poly([D,x,q,J],m,k,P),z.poly([K,E,j,U],m,k,P),M.includes("t")||z.poly([j,J,q,U],m,k,P),M.includes("b")||z.poly([K,x,D,E],m,k,P)},build(){const h=new u.BufferGeometry;return h.setAttribute("position",new u.Float32BufferAttribute(t,3)),h.setAttribute("normal",new u.Float32BufferAttribute(r,3)),h.setAttribute("aLight",new u.Float32BufferAttribute(e,3)),h.setAttribute("aShade",new u.Float32BufferAttribute(b,3)),h.setAttribute("aUV",new u.Float32BufferAttribute(y,2)),h.setAttribute("aMark",new u.Float32BufferAttribute(d,1)),h.setAttribute("aTint",new u.Float32BufferAttribute(s,1)),h.setIndex(o),h},async buildAsync(h){const I=new u.BufferGeometry;for(const[B,H,G]of[["position",t,3],["normal",r,3],["aLight",e,3],["aShade",b,3],["aUV",y,2],["aMark",d,1],["aTint",s,1]])I.setAttribute(B,new u.Float32BufferAttribute(H,G)),await h();return I.setIndex(o),I}};return z}const a=(t,r,e)=>new u.Vector3(t,r,e),F=Math.PI/180,ee=t=>350-28*t,$=t=>60*t;function Ut(t){const r={seam:t,bearing:e=>t+360*e,frac:e=>((e-t)%360+360)%360/360,dir:(e,b=new u.Vector3)=>b.set(Math.sin(e*F),0,Math.cos(e*F)),at:(e,b,y,d=new u.Vector3)=>d.set(Math.sin(e*F)*b,y,Math.cos(e*F)*b),surface:(e,b)=>{const y=r.frac(e),d=Math.min(6,Math.floor((350-b)/28-y));return d<0?0:60*(d+y)},bite:e=>({b:98+74*e,r:268-122*e,y:138+264*e,wp:8+44*(1-e)*(1-e),ws:8+60*(1-e)*(1-e)}),biteT:e=>(e-98)/74};return r}const Ce=.8,Te=t=>{const r=(t%360+360)%360;return r>98&&r<172};function Dt(t,r,e,b,y,d,s,o,i=2){const l=new u.IcosahedronGeometry(1,i).toNonIndexed(),f=l.attributes.position,n=[a(),a(),a()],w=S=>{const z=e.fbm3(S.x*1.3+o,S.y*1.3,S.z*1.3-o,3),h=1+.38*z+.12*Math.sign(z)*Math.abs(e.n3(S.x*4+o,S.y*4,S.z*4));return a(b.x+S.x*y*h,b.y+Math.round(S.y*d*h/6)*6*.5+S.y*d*h*.5,b.z+S.z*s*h)};for(let S=0;S<f.count;S+=3){for(let h=0;h<3;h++)n[h]=w(a(f.getX(S+h),f.getY(S+h),f.getZ(S+h)));const z=a().subVectors(n[1],n[0]).cross(a().subVectors(n[2],n[0])).normalize().y;t.poly([n[0],n[1],n[2]],z>.8?r.turf:r.rock,z>.8?0:7)}l.dispose()}async function Gt(t,r,e,b,y,d,s){const o=ue(),i=ue(),l=96,f=[ae(se[0],se[2],.45),ae(se[2],me,.5)];let n=0;for(let m=0;m<7*l;m++){const k=m/l,P=(m+1)/l,C=(k+P)/2,M=t.bearing(k),v=t.bearing(P),p=(M+v)/2,V=ee(k),L=ee(P),K=$(k),x=$(P),E=(v-M)*F*(V+L)/2,D=Te(p)&&C>=3,U=C+.5*b.n2(p*.022,C*1.4)<y,q=r.brick,j=1;if(!D){const J=Math.max(0,K-60)-(k<1?0:.5),ie=Math.max(0,x-60)-(k<1?0:.5),c=1.5;o.poly([t.at(M,V,J),t.at(v,L,ie),t.at(v,L,x+c),t.at(M,V,K+c)],q,j,0,[[n,J],[n+E,ie],[n+E,x+c],[n,K+c]]),o.poly([t.at(M,V,K+c),t.at(v,L,x+c),t.at(v,L-1.3,x+c),t.at(M,V-1.3,K+c)],q,0),o.poly([t.at(v,L-1.3,x),t.at(M,V-1.3,K),t.at(M,V-1.3,K+c),t.at(v,L-1.3,x+c)],q,j)}Te(p)&&C>=3.3||o.poly([t.at(M,V-1.3,K),t.at(v,L-1.3,x),t.at(v,L-28.5,x),t.at(M,V-28.5,K)],f,2,0,[[n,0],[n+E,0],[n+E,27],[n,27]]),n+=E,m%64===63&&await s()}const w=96,S=20,z=a(e.range(-22,6),520,e.range(-14,14)),h=[],I=[];for(let m=0;m<=S;m++){const k=[],P=m*10/S;for(let C=0;C<=w;C++){const M=C%w*44/w,v=t.seam+C%w*360/w,p=6+C%w/w,V=t.at(v,ee(p)-27,$(p)-3),L=m/S,K=a(z.x,z.y-95*(.5+.5*b.n2(M*.9,3.3))*(1-L)-30*b.n2(v*.02,9)*(L<1?1:0),z.z),x=V.clone().lerp(K,Math.pow(L,.75)),E=b.fbm3(x.x*.02,x.y*.03,x.z*.02,3),D=m>0&&m<S?1:0;x.addScaledVector(t.dir(v),D*(16*E+(m%2?1:-1)*(1.5+4*Math.abs(b.n2(M*2.1,Math.floor(P)*1.7)))+3*b.n3(x.x*.09,x.y*.09,x.z*.09))),D&&(x.y+=22*b.n2(M*1.3+5,P*.9)*(m/S)+(m%2?-1.6:1.6)),m===S&&x.copy(z),k.push(x)}h.push(k),m%2===1&&await s()}await s();const B=h.map(m=>m.map(()=>a())),H=a(),G=a();for(let m=0;m<=S;m++)for(let k=0;k<=w;k++){const P=(k+1)%w,C=(k+w-1)%w,M=Math.min(S,m+1),v=Math.max(0,m-1);H.subVectors(h[m][P],h[m][C]),G.subVectors(h[M][k],h[v][k]),B[m][k].crossVectors(G,H),B[m][k].lengthSq()<1e-6?B[m][k].set(0,1,0):B[m][k].normalize(),m===S&&B[m][k].set(0,1,0)}for(let m=0;m<=S;m++){const k=B[m].map((P,C)=>P.clone().add(B[m][(C+1)%w]).add(B[m][(C+w-1)%w]).add(B[Math.min(S,m+1)][C]).add(B[Math.max(0,m-1)][C]).normalize());B[m]=k}await s();const R=(m,k)=>[k*9.6,m.y];for(let m=0;m<S;m++){for(let k=0;k<w;k++){const P=h[m][k],C=h[m][k+1],M=h[m+1][k+1],v=h[m+1][k],p=B[m][k],V=B[m][(k+1)%w],L=B[m+1][(k+1)%w],K=B[m+1][k],x=(k*13+m*7)%5<2,E=R(P,k),D=R(C,k+1),U=R(M,k+1),q=R(v,k),j=(k+m)%2?[[[P,C,M],[E,D,U],[p,V,L]],[[P,M,v],[E,U,q],[p,L,K]]]:[[[P,C,v],[E,D,q],[p,V,K]],[[C,M,v],[D,U,q],[V,L,K]]];for(const[J,ie,c]of j)i.poly(J,r.rock,7,0,ie,c),m<S*.7&&(x?(k*7+m*3)%3!==1:(k*5+m*11)%4===0)&&I.push({p:a().add(J[0]).add(J[1]).add(J[2]).multiplyScalar(1/3),thorn:!x||(k+m)%4===0,h:(k*37+m*91)%17/17})}m%2===1&&await s()}for(const m of d)await s(),Dt(i,r,b,m.c,m.rx,m.ry,m.rz,m.seed);return{g:o,rk:i,tufts:I}}function Pe(t,r,e){const{x0:b,x1:y,y0:d,y1:s,cx:o,a:i,ys:l,yc:f,zp:n,zb:w,nseg:S,open:z}=e,h=1,I=e.mark??2,B=Math.min(o-b,y-o),H=s-f,G=Math.atan2(H,B),R=[],m=Math.max(1,Math.round(S*G/Math.PI)),k=Math.max(1,S/2-m);for(let x=0;x<m;x++)R.push(G*x/m);for(let x=0;x<=k;x++)R.push(G+(Math.PI/2-G)*x/k);const P=R.concat(R.slice(0,-1).reverse().map(x=>Math.PI-x)),C=P.map(x=>[o+i*Math.cos(x),f+i*Math.sin(x)]),M=P.map(x=>{const E=Math.cos(x),D=Math.sin(x),U=Math.min(B/Math.max(Math.abs(E),1e-6),H/Math.max(Math.abs(D),1e-6));return[o+E*U,f+D*U]}),v=(x,E)=>a(x[0],x[1],E);o-i>b&&t.poly([a(b,d,n),a(o-i,d,n),a(o-i,f,n),a(b,f,n)],r,I,h),y>o+i&&t.poly([a(o+i,d,n),a(y,d,n),a(y,f,n),a(o+i,f,n)],r,I,h),l>d&&t.poly([a(o-i,d,n),a(o+i,d,n),a(o+i,l,n),a(o-i,l,n)],r,I,h);for(let x=0;x<P.length-1;x++)t.poly([v(C[x],n),v(M[x],n),v(M[x+1],n),v(C[x+1],n)],r,I,h);const p=i*(e.splay??.86),V=n-(e.splayDepth??1.2),L=P.map(x=>[o+p*Math.cos(x),f+p*Math.sin(x)]),K=(x,E,D,U,q=I,j=r,J=h)=>{const ie=x===C?i:p,c=D===C?i:p,A=P.length-1;t.poly([a(o+ie,l,E),v(x[0],E),v(D[0],U),a(o+c,l,U)],j,I,J);for(let g=0;g<A;g++)t.poly([v(x[g],E),v(x[g+1],E),v(D[g+1],U),v(D[g],U)],j,q,J,q===I?null:[[ie*P[g],0],[ie*P[g+1],0],[ie*P[g+1],1.5],[ie*P[g],1.5]]);t.poly([v(x[A],E),a(o-ie,l,E),a(o-c,l,U),v(D[A],U)],j,I,J)};if(K(C,n,L,V,e.edgeMark??I),w<V-.01&&K(L,V,L,w,I,e.soffit??r,e.soffit?0:h),l>d+.01&&t.poly([a(o-i,l,n),a(o+i,l,n),a(o+p,l,V),a(o-p,l,V)],r,I,h),l<=d+.01&&e.floor!==!1&&t.poly([a(o-i,l,n),a(o+i,l,n),a(o+p,l,w),a(o-p,l,w)],e.soffit??r,I,e.soffit?0:h),!z){const x=e.dark,E=(l-f)/p,D=U=>[(U[0]-o)/p,(U[1]-f)/p];t.poly([a(o-p,l,w),a(o+p,l,w),a(o+p,f,w),a(o-p,f,w)],x,9,0,[[-1,E],[1,E],[1,0],[-1,0]]);for(let U=0;U<P.length-1;U+=2){const q=Math.min(U+2,P.length-1);U+1<q?t.poly([v(L[U],w),v(L[U+1],w),v(L[q],w),a(o,f,w)],x,9,0,[D(L[U]),D(L[U+1]),D(L[q]),[0,0]]):t.poly([v(L[U],w),v(L[q],w),a(o,f,w)],x,9,0,[D(L[U]),D(L[q]),[0,0]])}}return{ang:P,arc:C}}function Fe(t,r,e,b,y,d,s,o,i,l,f=!0){const n=(S,z,h)=>a(e+S*Math.cos(z),b+S*Math.sin(z),h),w=y+d;for(let S=0;S<i.length-1;S++){const z=i[S],h=i[S+1];t.poly([n(y,z,s+o),n(w,z,s+o),n(w,h,s+o),n(y,h,s+o)],r,l,1,[[y*z,0],[y*z,1.5],[y*h,1.5],[y*h,0]]),f&&t.poly([n(w,z,s+o),n(w,z,s),n(w,h,s),n(w,h,s+o)],r,0,1)}}function bt(t,r={}){const e=ue(),b=t.stone,y=t.dark,d=12,s=2.1,o=r.nseg??10;e.box(-d-2.5,0,0,-d+2.5,33,7.2,b,2,1,null,"b",[.35,1.3]),e.box(-d-1.8,33,0,-d+1.8,57.2,4.6,b,2,1,null,"b",[.3,1.4]),e.box(-d,0,s,d,3.2,s+1.1,b,2,1,null,"b",[0,.5]),e.box(-d,32.2,s,d,33.6,s+.8,b,0,1,null,"b"),e.box(-d,56.2,0,d,58,s+1.2,b,0,1,null,"b");const i=Pe(e,b,{x0:-d,x1:d,y0:3.2,y1:32.2,cx:.4,a:7.2,ys:3.2,yc:21.5,zp:s,zb:.25,nseg:o,open:r.open,dark:y,edgeMark:4});Fe(e,b,.4,21.5,7.2,1.5,s,.16,i.ang,4,!1);for(const l of[-1,1])Pe(e,b,{x0:l<0?-d:0,x1:l<0?0:d,y0:33.6,y1:56.2,cx:l*6,a:2.5,ys:38.5,yc:46,zp:s,zb:.25,nseg:4,open:r.open,dark:y,splay:.8,splayDepth:1,edgeMark:4});return e}function ge(){const t=[],r=[],e=[],b=[];return{get count(){return t.length},add(y,d,s,o=-1,i=0,l=0){t.push(y.clone()),r.push(d[0].r,d[0].g,d[0].b),e.push(d[1].r,d[1].g,d[1].b),b.push(s,o,i,l)},mesh(y,d){const s=new u.InstancedMesh(y,d,Math.max(1,t.length));for(let o=0;o<t.length;o++)s.setMatrixAt(o,t[o]);return s.count=t.length,y.setAttribute("iLight",new u.InstancedBufferAttribute(new Float32Array(r.length?r:[0,0,0]),3)),y.setAttribute("iShade",new u.InstancedBufferAttribute(new Float32Array(e.length?e:[0,0,0]),3)),y.setAttribute("iInfo",new u.InstancedBufferAttribute(new Float32Array(b.length?b:[0,0,0,0]),4)),s.frustumCulled=!1,s}}}function ke(t,r,e,b,y=1,d=1,s=1,o=!1,i=new u.Matrix4){const l=Math.cos(r*F),f=Math.sin(r*F),n=o?-1:1;return i.set(l*y*n,0,f*s*n,f*e,0,d,0,b,-f*y*n,0,l*s*n,l*e,0,0,0,1),i}function qe(t,r,e,b,y,d=1,s=1,o=new u.Matrix4){const i=Math.cos(r*F),l=Math.sin(r*F),f=y;return o.set(-l*f*d,0,i*f,l*e,0,s,0,b,-i*f*d,0,-l*f,i*e,0,0,0,1),o}async function Et(t,r,e,b,y,d,s,o){const i=ge(),l=ge(),f=[],n=new u.Matrix4,w=a();let S=.3,z=0;for(;S<7;){const h=24.5*(1+.06*(e()*2-1)),I=h/(2*Math.PI*ee(S)),B=S+I/2,H=t.bearing(B);if(S+=I,z++,S>7)break;z%80===0&&await o();const G=Math.max(0,$(B)-60),R=$(B)+1.6-G+e.range(-.3,.3),m=Te(H)&&B>=3;t.at(H,ee(B),G+R*.5,w);const k=d.some(p=>((w.x-p.c.x)/(p.rx*1.05))**2+((w.y-p.c.y)/(p.ry*1.05))**2+((w.z-p.c.z)/(p.rz*1.05))**2<1),P=B+.5*b.n2(H*.022,B*1.4)<y,C=e();if(m||k||R<16)continue;ke(t,H,ee(B)+.15,G,h/24,R/58,e.range(.92,1.1),!1,n);let M=s(B,H),v=!1;M<0&&!P&&C<.3&&(M=.03+.9*(C*37.7%1),v=!0),i.add(n,P?r.stone:r.brick,P?2:1,M,C),f.push({s:B,b:H,r:ee(B),base:G,h:R,w:h,birth:M,stone:P,late:v})}return{closed:i,open:l,list:f}}function yt(t,r,e){const b=ue(),y=Pe(b,t.brick,{x0:-11,x1:11,y0:0,y1:30,cx:0,a:8.3,ys:0,yc:16.2,zp:0,zb:-e,nseg:8,open:r,dark:t.dark,mark:1,edgeMark:4,splay:.84,splayDepth:1.4,soffit:r?null:[t.brick[1],ae(se[1],me,.72)]}),d=[ae(se[1],se[0],.3),ae(se[1],me,.3)],s=(i,l,f)=>a(i*Math.cos(l),16.2+i*Math.sin(l),f),o=y.ang;for(let i=0;i<o.length-1;i++){const l=o[i],f=o[i+1];b.poly([s(8.3,l,.35),s(10.1,l,.35),s(10.1,f,.35),s(8.3,f,.35)],d,5,0,[[8.3*l,0],[8.3*l,1.5],[8.3*f,1.5],[8.3*f,0]]),b.poly([s(10.1,l,.35),s(10.1,l,0),s(10.1,f,0),s(10.1,f,.35)],t.dark,0,0)}for(const i of[-1,1])b.poly(i>0?[a(8.3,0,.35),a(10.1,0,.35),a(10.1,16.2,.35),a(8.3,16.2,.35)]:[a(-10.1,0,.35),a(-8.3,0,.35),a(-8.3,16.2,.35),a(-10.1,16.2,.35)],d,5,0,[[0,0],[0,1.5],[16.2,1.5],[16.2,0]].map((l,f)=>(i>0?[[0,0],[0,1.5],[16.2,1.5],[16.2,0]]:[[0,1.5],[0,0],[16.2,0],[16.2,1.5]])[f]));return b}async function Rt(t,r,e,b){const i=5.6923076923076925,l=138,f=30,n=259,w=22,S=ge(),z=ge(),h=ue(),I=new u.Matrix4,B=[-11,-8.6,-5.5,0,5.5,8.6,11],H=[0,0,.63*Ce,Ce,.63*Ce,0,0],G=new Uint8Array(780),R=(M,v)=>{const p=Math.min(1,Math.max(0,t.biteT(M))),V=t.bite(p);return{d:v-V.r,B:V}};for(let M=0;M<6;M++)for(let v=0;v<13;v++)for(let p=0;p<10;p++){const V=n-w*M-11,L=98+i*v,K=L+i,x=(L+K)/2,E=l+f*p,D=E+f,U=t.surface(x,V);let q=!1,j=!1;for(const ie of[L,x,K]){const c=R(ie,V);c.d>-(c.B.wp+11)&&c.d<c.B.ws+11&&D>c.B.y+2&&(q=!0)}const J=R(x,V);!q&&J.d>=J.B.ws+11&&J.d<J.B.ws+33&&D<=J.B.y+46&&E<=U+14&&v%3!==2&&t.biteT(x)>.12&&(j=!0),G[(M*13+v)*10+p]=!q&&D<=U+14||j?1:0}await b();for(let M=0;M<6;M++)for(let v=0;v<13;v++){let p=-1;for(let V=9;V>=0;V--)if(G[(M*13+v)*10+V]){p=V;break}for(let V=0;V<p;V++)G[(M*13+v)*10+V]=1}const m=(M,v,p)=>p<0||M>=6?!0:v<0||v>=13?p<10&&M>=0&&l+f*(p+1)<=t.surface(v<0?97:173,n-w*M-11)+14:M<0||p>=10?!1:G[(M*13+v)*10+p]===1,k=r.brick,P=[],C=[];for(let M=0;M<6;M++)for(let v=0;v<13;v++)for(let p=0;p<10;p++){if(v===0&&p===0&&await b(),!m(M,v,p))continue;const V=n-w*M,L=V-11,K=V-w,x=98+i*v,E=x+i/2,D=l+f*p,U=e(),q=!m(M-1,v,p)&&!m(M+1,v,p);if(m(M,v+1,p)||(S.add(qe(t,x+i,L,D,1,1,1,I),k,1,-1,U),C.push(I.clone())),m(M,v-1,p)||(S.add(qe(t,x,L,D,-1,1,1,I),k,1,-1,U+.3),C.push(I.clone())),m(M-1,v,p)||(q?z:S).add(ke(t,E,V,D,V*i*F/22,1,1,!1,I),k,1,-1,U+.5),m(M+1,v,p)||(q?z:S).add(ke(t,E,K,D,K*i*F/22,1,1,!0,I),k,1,-1,U+.7),!m(M,v,p+1)){for(let j=0;j<6;j++)h.poly([t.at(x,L+B[j+1],D+f+H[j+1]),t.at(x+i,L+B[j+1],D+f+H[j+1]),t.at(x+i,L+B[j],D+f+H[j]),t.at(x,L+B[j],D+f+H[j])],k,1);for(const[j,J]of[[x,!0],[x+i,!1]]){const ie=[1,5,4,3,2].map(c=>t.at(j,L+B[c],D+f+H[c]));h.poly(J?ie.reverse():ie,k,1)}P.push({b:E,r:L,y:D+f,w:L*i*F})}}for(const[M,v]of[[98,!0],[172,!1]]){const p=t.frac(M);for(let V=3;V<=6;V++){const L=ee(V+p),K=V===6?96:L-28,x=$(V+p),E=[t.at(M,K,l-2),t.at(M,L,l-2),t.at(M,L,x),t.at(M,K,x)];x>l&&h.poly(v?E.reverse():E,k,1)}}return{ends:S,thru:z,tops:h,ledges:P,faces:C}}async function Xt(t,r={}){const e=t.rng,b=t.noise,y=r.detail??t.quality?.detail??1,d=r.palette??se,s=Nt(d),o=ze;o.uGreen.value.set(d[3]),o.uBlue.value.set(d[4]),o.uShadowC.value.set(d[5]),o.uStainCA.value.set(d[1]),o.uStainCB.value.set(d[6]),o.uVaultC.value.copy(s.brick[1]);const i=new u.Group,l=new u.Group;l.rotation.z=3*F,i.add(l);const f=-20+e.range(-12,12),n=Ut(f),w=r.stoneTo??e.range(4.3,5.25),S=[],z=e.int(5,7);for(let W=0;W<z;W++){const _=218+(W+e())*104/z,X=e.int(0,4),ne=X+n.frac(_),pe=e.range(.8,1.35);S.push({c:n.at(_,ee(ne)+2,$(ne)-e.range(18,34)),rx:30*pe,ry:e.range(34,56)*pe,rz:e.range(36,58)*pe,seed:e.range(0,99)})}const h=(W,_)=>{const X=(_%360+360)%360;return W>=3&&W<4&&X>62&&X<98?.486+.079*(X-62)/36:-1},I=Ke({distK:r.distK??.3,stain:!0}),B=Ke({distK:r.distK??.3,stain:!0,instanced:!0}),H=Ke({distK:r.distK??.3,instanced:!0,side:u.DoubleSide}),G=await Gt(n,s,e,b,w,S,t.yield);await t.yield(),l.add(new u.Mesh(await G.g.buildAsync(t.yield),I)),await t.yield();const R=await G.rk.buildAsync(t.yield);await t.yield();const m=await ht(R,t.yield),k=It({width:1.6,distK:.3});l.add(new u.Mesh(m,I),new u.Mesh(m,k)),await t.yield();{const W=ue(),_=ge(),X=new u.Matrix4,ne=new u.Quaternion,pe=a(0,1,0),fe=[],he=[],Ee=a(0,1,0);for(let re=0;re<5;re++)fe.push(a(Math.sin(re/5*6.283)*.7,.6,Math.cos(re/5*6.283)*.7)),he.push(a(Math.sin((re+.5)/5*6.283),0,Math.cos((re+.5)/5*6.283)));for(let re=0;re<5;re++){const xe=(re+1)%5;W.poly([fe[re],fe[xe],Ee],s.turf,0,1),W.poly([fe[re],he[re],fe[xe]],s.turf,0,1),W.poly([he[re],he[xe],fe[xe]],s.turf,0,1)}const Pt=[ae(d[3],me,.35),ae(d[3],me,.72)],Vt=[ae(d[3],d[0],.25),ae(d[3],me,.5)];await t.yield();for(const re of G.tufts){const xe=re.thorn?1.6+2.2*re.h:.9+1.2*re.h;X.compose(re.p,ne.setFromAxisAngle(pe,re.h*40),a(xe*(.9+.5*re.h),xe*(re.thorn?1.1:.55),xe)),_.add(X,re.thorn?Pt:Vt,0,-1,re.h)}await t.yield(),l.add(_.mesh(W.build(),B))}await t.yield(),await t.yield();const P=await Et(n,s,e,b,w,S,h,t.yield);await t.yield();const C=bt(s,{}).build();await t.yield(),l.add(P.closed.mesh(C,B)),await t.yield();const M=await Rt(n,s,e,t.yield);await t.yield(),l.add(M.ends.mesh(yt(s,!1,13).build(),B)),await t.yield(),l.add(M.thru.mesh(yt(s,!0,11).build(),H));const v=Le(M.tops.build());l.add(new u.Mesh(v,I)),await t.yield();const p=qt(n,s,e,P.open);l.add(new u.Mesh(p.geo,I)),await t.yield();const V=bt(s,{open:!0}).build();l.add(P.open.mesh(V,H)),await t.yield();const L=new u.Vector3(185,388,-190),K=new u.Vector3(.85,0,-.53),x=new u.Vector3(.53,0,.85);await t.yield();const E=await Kt(e.fork("cloud"),600,105,62,Math.round(13*(.7+.3*y)),2,t.yield);await t.yield();const D=new u.Mesh(E,et(d[6],d[4],2.2,26));D.rotation.y=-Math.atan2(K.z,K.x),D.frustumCulled=!1,i.add(D),await t.yield();const U=Math.max(2,Math.min(4,Math.floor(w-.35)))+n.frac(30),q=Ot(n,e,S,M.ledges,p,U),j=_t(s),J=ge(),ie=ge(),c=new u.Matrix4;for(const W of q){J.add(W.m,s.timber,3,-1,e());const _=(W.kind==="near"?.5:e.range(.3,.7))*e.sign();for(const X of xt)ie.add(c.copy(W.m).multiply(new u.Matrix4().makeTranslation(X.x,X.y,X.z)),s.timber,0,-1,e(),_)}await t.yield();const A=Le(j.house.build());l.add(J.mesh(A,B),J.mesh(A,k)),l.add(ie.mesh(j.wheel.build(),Ke({distK:r.distK??.3,instanced:!0,spin:!0,side:u.DoubleSide}))),await t.yield(),await t.yield();const g=await Qt(n,s,e,P.list,q,M.ledges,p,y,t.yield,M.faces);await t.yield();const T=n.bite(.36),N=n.at(T.b,T.r+7,0),O=T.y-55,Z=T.y+112;g.rib.seg(a(N.x,O,N.z),a(N.x,Z+5,N.z),.12,s.umber2),g.rib.seg(n.at(T.b,T.r+9,Z+5.5),n.at(T.b+2,T.r-52,Z+3),.5,s.timber[0]),g.rib.seg(n.at(T.b,T.r+3,Z+5.5),n.at(T.b+2,T.r-30,Z-22),.35,s.timber[0]);const Y=Ht({distK:(r.distK??.3)*.35}),Q=new u.Mesh(g.rib.build(),Y);Q.frustumCulled=!1,await t.yield();const oe=ue();oe.box(-.95,-1.5,-.6,.95,-.35,.6,s.stone,2,0,null,"");for(const W of[-.6,.6]){ye(oe,a(W,-1.56,-.66),a(W,-1.56,.66),.09,s.dark,0,"");for(const _ of[-.66,.66])ye(oe,a(W,-1.56,_),a(0,0,0),.07,s.dark,0,"")}await t.yield();const te=Le(oe.build()),le=new u.Group,de=g.nearLoad;le.add(new u.Mesh(te,I),new u.Mesh(te,k)),de?le.position.copy(de.lo):le.scale.setScalar(.001),l.add(le),await t.yield();const Oe=await g.furn.buildAsync(t.yield);await t.yield();const Ve=await ht(Oe,t.yield);l.add(new u.Mesh(Ve,I),new u.Mesh(Ve,k)),await t.yield();const Mt=g.fig.mesh(Yt(s,{distK:(r.distK??.3)*.35,minPx:5.6,nearK:.65,smock:[ae(d[2],me,.3),ae(d[2],me,.78)],smock2:s.timber}));l.add(Q,Mt),await t.yield();const Be=ue();for(const W of[-.75,.75])Be.box(-1.5,0,W-.14,1.5,.2,W+.14,s.timber,3,0,null,"");const gt=[ae(d[1],d[0],.16),s.brick[1]],kt=[ae(d[1],me,.2),ae(d[1],me,.55)];for(let W=0;W<4;W++)for(let _=0;_<4;_++)for(let X=0;X<3;X++){const ne=-1.2+.6*_+(W%2?.08:-.08),pe=-.84+.56*X+(W%2?-.05:.05),fe=.2+.33*W,he=(_*7+X*3+W*5)%6;Be.box(ne+.03,fe+.02,pe+.03,ne+.57,fe+.31,pe+.53,he===0?kt:he===3?gt:s.brick,0,0,null,"")}for(const[W,_]of[[-1.4,-1],[1.4,-1],[-1.4,1],[1.4,1]])ye(Be,a(W,.2,_),a(0,4.2,0),.09,s.dark,0,"bt");await t.yield();const tt=Le(Be.build()),Se=new u.Group;await t.yield(),Se.add(new u.Mesh(tt,I),new u.Mesh(tt,k));const Ye=new u.Mesh(wt(e.fork("dust"),16,2.4,3.2,5,1),et(d[1],"#"+s.brick[1].getHexString(),.25));Ye.rotation.z=Math.PI/2,Ye.position.y=-9,Se.add(Ye),Se.position.copy(N),l.add(Se);const We=ue(),St=(W,_,X)=>a(W,_,X).applyMatrix4(p.frame),Ie=75*F,at=9*Math.cos(Ie),ot=13+9*Math.sin(Ie),nt=10.7*Math.cos(Ie),je=13+10.7*Math.sin(Ie),He=[[-at,ot],[at,ot],[nt,je],[-nt,je]];We.poly(He.map(W=>a(W[0],W[1],1.8)),s.stone,2),We.poly(He.map(W=>a(W[0],W[1],.05)).reverse(),s.stone,2);for(let W=0;W<4;W++){const _=He[W],X=He[(W+1)%4];We.poly([a(_[0],_[1],.05),a(X[0],X[1],.05),a(X[0],X[1],1.8),a(_[0],_[1],1.8)],s.stone,2)}await t.yield();const rt=Le(We.build().applyMatrix4(p.frame)),Ne=new u.Group;Ne.add(new u.Mesh(rt,I),new u.Mesh(rt,k)),l.add(Ne);const At=q[q.length-1],it=_e.clone().applyMatrix4(At.m),Qe=St(0,je,.9),st=mt();st.seg(a(0,0,0),a(0,-1,0),.1,s.umber2);const Ue=new u.Mesh(st.build(),Y);Ue.frustumCulled=!1,Ue.position.set(Qe.x,it.y,Qe.z),l.add(Ue),await t.yield();const De=new u.Mesh(wt(e.fork("fall"),30,6,7,5,1),et(d[1],"#"+s.brick[1].getHexString(),.5)),Ze=n.at(30,ee(U)+9,$(U)-4);De.rotation.set(0,30*F,Math.PI/2),l.add(De),await t.yield(),l.add(new u.Mesh(Le(p.geo),k)),o.uStainA.value.set(30*F,16,$(U)+1,$(U)*.97),o.uStainB.value.set(41*F,9,$(U)+1,$(U)*.66),await t.yield();const lt=new u.Vector3(.55,.64,.53).normalize();l.updateMatrix();const ce=W=>W.clone().applyMatrix4(l.matrix),ve=[new u.Vector3(0,14,580),new u.Vector3(60,40,440)];for(const[W,_,X]of[[34,20,19],[44,26,17],[54,25,15],[64,15,13.5],[74,3,12.5],[84,-6,11.5],[93,-8.5,11]]){const ne=2+n.frac(W);ve.push(ce(n.at(W,ee(ne)+_,$(ne)+X)))}const Ae=[];for(let W=0;W<=8;W++){const _=n.bite(W/8);Ae.push(ce(n.at(_.b,_.r,_.y+12)))}ve.push(...Ae);for(const[W,_,X]of[[192,14,18],[210,62,27],[230,50,22]]){const ne=6+n.frac(W);ve.push(ce(n.at(W,ee(ne)+_,$(ne)+X)))}ve.push(ce(p.anchors.approach),ce(p.anchors.mouth),ce(p.anchors.seat));const zt=q[0],Lt=q[1],ct=n.bite(.6),Ct={portalSeat:{position:ce(p.anchors.seat),facing:p.anchors.facing.clone().transformDirection(l.matrix),width:14},archMouth:ce(p.anchors.mouth),approach:ce(p.anchors.approach),keystoneSlot:ce(p.anchors.crownSlot),flyThrough:ve,biteLine:Ae,rampStart:ve[2].clone(),biteMouth:Ae[0].clone(),biteHead:Ae[8].clone(),nearCrane:ce(a(0,6,0).applyMatrix4(zt.m)),greatCrane:ce(a(0,9,0).applyMatrix4(Lt.m)),hoist:ce(a(N.x,T.y+12,N.z)),fleetGaze:ce(n.at(ct.b,ct.r+900,0)),crown:ce(a(0,470,0)),top:ce(a(0,520,0)),cloud:L.clone(),viewpoints:{entry:new u.Vector3(0,55,1200),reveal:Ae[4].clone(),summit:ve[ve.length-4].clone()},light:lt.clone()},ut=new u.Vector3,Tt=new u.Matrix4,ft=new u.Vector2,be=new u.Vector3,Ge=new u.Quaternion,dt=r.dbg||null;let Xe=null,Je=null;const we={object:i,radius:400,height:520,center:new u.Vector3(-10,250,0),anchors:Ct,ground:!0,groundY:0,setProgress(W){Xe=W},pallet:Se,keystone:Ne,palletHeld:!1,wheelsHeld:!1,frame:n,lean:l,hoistRange:[O,Z],cloud:D,cloudAt(W,_){return _.copy(L).addScaledVector(x,70*(W-.6)).addScaledVector(K,50*(W-.6))},update(W,_,X){o.uTime.value=_,!we.wheelsHeld&&Je!==null&&(o.uSpinT.value+=Math.min(2,Math.max(0,_-Je))),Je=_,o.uU.value=Xe===null?_/46%1:Xe,X&&(X.getWorldPosition(ut),o.uEye.value.copy(ut)),t.renderer&&(t.renderer.getDrawingBufferSize(ft),o.uView.value.copy(ft));const ne=o.uU.value;i.updateWorldMatrix(!0,!1),i.getWorldQuaternion(Ge),r.keepLight||o.uLight.value.copy(lt).applyQuaternion(Ge),we.cloudAt(ne,D.position),be.copy(D.position).applyMatrix4(i.matrixWorld),o.uCloud.value.set(be.x,be.y+4,be.z,0),be.copy(K).applyQuaternion(Ge),o.uCloud.value.w=Math.atan2(be.z,be.x),o.uCloudR.value.set(285,100),o.uTowerPos.value.setFromMatrixPosition(i.matrixWorld),be.set(-Math.tan(3*F),0,0).applyQuaternion(Ge),o.uTowerLean.value.set(be.x,be.z);const pe=Math.min(1,Math.max(0,(ne-.661)/.055));we.palletHeld||(Se.position.y=O+(Z-O)*pe);const fe=_*.11%1;De.position.set(Ze.x,Ze.y-150*fe,Ze.z),De.scale.setScalar(.35+.5*fe);const he=Math.min(1,Math.max(0,(ne-.86)/.135)),Ee=11*(1-he*he*(3-2*he));Ne.position.y=Ee,de&&le.position.copy(de.lo).addScaledVector(de.sw,Math.sin(_*.9+de.ph)),Ue.scale.y=Math.max(.1,it.y-Qe.y-Ee),l.updateWorldMatrix(!0,!1),o.uTowerInv.value.copy(Tt.copy(l.matrixWorld).invert())},dispose(){}};if(dt){const W=(pe,fe,he)=>new u.Vector3(pe,fe,he).applyMatrix4(l.matrix),_=n.bite(.55),ne={bite:[n.at(_.b,_.r,_.y+20),30,60],ramp:[n.at(72,ee(2+n.frac(72))-16,$(2+n.frac(72))+12),22,40],exit:[p.anchors.mouth.clone(),24,30],top:[new u.Vector3(0,430,0),120,200]}[dt];ne&&(we.center=W(ne[0].x,ne[0].y,ne[0].z),we.radius=ne[1],we.height=ne[2],we.ground=!1)}return we}function et(t=se[6],r=se[4],e=1,b=0){return new u.ShaderMaterial({uniforms:{...ze,uWhite:{value:new u.Color(t)},uUnder:{value:new u.Color(r)},uBreath:{value:e},uCell:{value:b}},side:u.DoubleSide,vertexShader:Me+`
      attribute float aPhase, aH;
      uniform float uBreath;
      varying vec3 vN, vW;
      varying float vH;
      void main() {
        vec3 p = position + normal * uBreath * (2.5 * sin(uTime * 0.31 + aPhase) + 1.5 * sin(uTime * 0.53 + aPhase * 1.7 + position.x * 0.05));
        vec4 wp = modelMatrix * vec4(p, 1.0);
        vN = mat3(modelMatrix) * normal; vW = wp.xyz; vH = aH;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,fragmentShader:Me+`
      uniform vec3 uWhite, uUnder; uniform float uCell; varying vec3 vN, vW; varying float vH;
      void main() {
        vec3 n = vN / max(length(vN), 1e-5);
        vec3 c = vH < 0.05 ? uUnder : (dot(n, uLight) < -0.3 ? mix(uWhite, uUnder, 0.38) : uWhite);      // the underside ends on a level line (aH), not along the mesh
        // the pile is told in small round lobes: on the white, a scallop of the shade tone under each (cells of uCell metres;
        // hard edged, flat, and left out where a cell is under about 7 px)
        vec3 q = vW / max(uCell, 1e-3) + vec3(0.0, 0.31, 0.0);
        float fq = max(max(fwidth(q.x), fwidth(q.y)), fwidth(q.z));      // derivatives are taken outside the branch
        if (uCell > 0.0 && vH >= 0.05) {
          vec3 c0 = floor(q), d = fract(q) - 0.5;
          d -= (vec3(bHash(c0.xy + c0.z * 7.1), bHash(c0.yz + c0.x * 3.3), bHash(c0.zx + c0.y * 5.7)) - 0.5) * 0.28;
          float lower = step(length(d), 0.46) * step(0.5, length(d - 0.21 * normalize(uLight + vec3(0.0, 0.6, 0.0))));      // a crescent on the side away from the light, under each lobe
          float keep = step(0.3, bHash(c0.xz + c0.y * 1.7 + 11.0)) * (1.0 - smoothstep(0.1, 0.16, fq));
          c = mix(c, mix(uWhite, uUnder, 0.38), lower * keep);
        }
        gl_FragColor = vec4(c, 1.0);
      }`})}function vt(t,r,e,b,y,d,s){const o=d>1?s/(d-1):.5,i=t.clone(),l=i.attributes.position,f=i.attributes.normal,n=Math.sin(Math.PI*(.08+.84*o)),w=e/d*r.range(1,1.7),S=b*(.45+.55*n)*r.range(.6,1),z=y*(.35+.65*n)*r.range(.6,1.1),h=(o-.5)*e*.86,I=b*.5*r.range(-1,1)*n,B=new Float32Array(l.count).fill(r.range(0,6.28)),H=new Float32Array(l.count);for(let G=0;G<l.count;G++){let R=l.getY(G);H[G]=Math.max(0,R+.3),R<-.3&&(R=-.3,f.setXYZ(G,0,-1,0)),l.setXYZ(G,h+l.getX(G)*w,(R+.3)*z,I+l.getZ(G)*S)}return i.setAttribute("aPhase",new u.BufferAttribute(B,1)),i.setAttribute("aH",new u.BufferAttribute(H,1)),i}async function Kt(t,r,e,b,y,d,s){const o=[],i=new u.IcosahedronGeometry(1,d);for(let f=0;f<y;f++)o.push(vt(i,t,r,e,b,y,f)),f%3===2&&await s();await s();const l=$e(o);return o.forEach(f=>f.dispose()),i.dispose(),l}function wt(t,r,e,b,y,d=2){const s=[],o=new u.IcosahedronGeometry(1,d);for(let l=0;l<y;l++)s.push(vt(o,t,r,e,b,y,l));const i=$e(s);return s.forEach(l=>l.dispose()),o.dispose(),i}function qt(t,r,e,b){const y=ue(),d=ue(),s=new u.Matrix4,o=C=>ee(C)-14.5,i=6+t.frac(270),l=r.brick,f=r.dark;let n=6,w=0;for(;n<7;){const M=12.25/(2*Math.PI*(ee(n)-3.5)),v=n+M/2,p=(t.bearing(v)%360+360)%360;if(n+=M,n>7||p>96&&p<176||p>236&&p<272)continue;const V=v>=i?-1:p<96||p>300?w<3?.012+.02*w:.08+.36*e():.8+.16*(p-176)/60;v<i&&w++,ke(t,p,ee(v)-3.5,$(v),12.25/24*.99,v>=i?.5:e.range(.34,.5),.5,!1,s),b.add(s,l,1,V,e())}const S=Math.max(6,Math.round((7-i)*360/5)),z=[[11,0],[11,15.5],[9.6,19.6],[5.6,23],[0,24.4],[-5.6,23],[-9.6,19.6],[-11,15.5],[-11,0]];for(let C=0;C<S;C++){const M=i+(7-i)*C/S,v=i+(7-i)*(C+1)/S,p=t.bearing(M),V=t.bearing(v);for(let L=0;L<z.length-1;L++){const[K,x]=z[L],[E,D]=z[L+1];y.poly([t.at(p,o(M)+K,$(M)+x),t.at(V,o(v)+K,$(v)+x),t.at(V,o(v)+E,$(v)+D),t.at(p,o(M)+E,$(M)+D)],l,1)}}const h=qe(t,270,o(i),$(i),-1),I=qe(t,t.bearing(7)-.01,o(7),$(7),1),B=ue(),H=ue(),G=Pe(B,l,{x0:-11,x1:11,y0:0,y1:24.4,cx:0,a:9,ys:0,yc:13,zp:0,zb:-26,nseg:12,open:!1,dark:f,mark:1,edgeMark:5,splay:.86,splayDepth:1.3,floor:!1,soffit:[ae(se[1],me,.8),f[0]]});Fe(B,l,0,13,9,1.5,0,.6,G.ang.slice(0,6),5),Fe(B,l,0,13,9,1.5,0,.6,G.ang.slice(7),5),Pe(H,l,{x0:-11,x1:11,y0:0,y1:24.4,cx:0,a:8,ys:0,yc:13,zp:0,zb:-6,nseg:8,open:!1,dark:f,mark:1,edgeMark:5,floor:!1});const R=r.timber;((C,M,v,p)=>{for(let V=0;V<12;V++){const L=Math.PI*V/12,K=Math.PI*(V+1)/12,x=(E,D,U)=>a(E*Math.cos(D),13+E*Math.sin(D),U);d.poly([x(C,L,p),x(M,L,p),x(M,K,p),x(C,K,p)],R,3),d.poly([x(C,K,p),x(C,K,v),x(C,L,v),x(C,L,p)],R,3,0,[[C*K,0],[C*K,p-v],[C*L,p-v],[C*L,0]])}})(7.25,7.8,-2.2,.9),d.box(-6.6,16,.3,6.6,16.6,.9,R,3,0,null,"");for(const C of[-1,1]){d.box(C*7.55-.3,0,.2,C*7.55+.3,13.2,.9,R,3,0,null,"b");const M=new u.Matrix4().makeRotationZ(C*-.62).setPosition(C*3.4,16.3,.55);d.box(-.22,0,-.25,.22,4.6,.25,R,3,0,M,"bt")}d.box(-.25,16.6,.3,.25,20.2,.9,R,3,0,null,"bt");const k=[y.build(),B.build().applyMatrix4(h),H.build().applyMatrix4(I),d.build().applyMatrix4(h)],P=(C,M,v)=>a(C,M,v).applyMatrix4(h);return{geo:$e(k),sE:i,frame:h,anchors:{seat:P(0,7.4,-6),mouth:P(0,7.4,0),approach:P(0,7.4,70),crownSlot:P(0,22.3,.3),facing:a(0,0,1).transformDirection(h),craneAt:P(8.6,20.9,-6)}}}function ye(t,r,e,b,y,d=3,s="b"){const o=a().subVectors(e,r),i=o.length();if(i<1e-4)return;const l=new u.Matrix4().compose(r,new u.Quaternion().setFromUnitVectors(a(0,1,0),o.multiplyScalar(1/i)),a(1,1,1));t.box(-b/2,0,-b/2,b/2,i,b/2,y,d,0,l,s)}const _e=a(0,19,10.5),xt=[a(-4.9,5.2,0),a(4.9,5.2,0)];function _t(t){const r=ue(),e=t.timber,b=t.thatch,y=t.dark;for(const[f,n]of[[-2.7,-2.3],[2.7,-2.3],[-2.7,2.3],[2.7,2.3]])r.box(f-.25,0,n-.25,f+.25,1.2,n+.25,e,3,0,null,"bt");r.box(-3,1.2,-2.6,3,8,2.6,e,3,0,null,""),r.box(-3.3,1,-2.9,3.3,1.4,2.9,e,0,0,null,""),r.poly([a(-.8,1.4,2.62),a(.8,1.4,2.62),a(.8,4.2,2.62),a(-.8,4.2,2.62)],y,0),r.poly([a(1.5,5.4,2.62),a(2.4,5.4,2.62),a(2.4,6.5,2.62),a(1.5,6.5,2.62)],y,0),r.poly([a(3.02,4.3,.9),a(3.02,4.3,-.9),a(3.02,6.1,-.9),a(3.02,6.1,.9)],y,0),r.poly([a(-3.02,4.3,-.9),a(-3.02,4.3,.9),a(-3.02,6.1,.9),a(-3.02,6.1,-.9)],y,0);const d=3.5,s=3.9,o=7.7,i=11.2;r.poly([a(-s,o,d),a(s,o,d),a(s*.93,i,0),a(-s*.93,i,0)],b,3),r.poly([a(s,o,-d),a(-s,o,-d),a(-s*.93,i,0),a(s*.93,i,0)],b,3),r.poly([a(3,8,2.6),a(3,8,-2.6),a(3,10.9,0)],e,3),r.poly([a(-3,8,-2.6),a(-3,8,2.6),a(-3,10.9,0)],e,3),ye(r,a(-6.3,5.2,0),a(6.3,5.2,0),.6,e,0,""),ye(r,a(0,9.6,1.2),_e.clone().add(a(0,.5,.6)),.55,e,3,""),ye(r,a(0,9.8,1.2),a(0,14.5,-1.2),.4,e,3,""),ye(r,a(0,14.4,-1.2),a(0,15.6,6.3),.3,e,3,""),ye(r,a(0,9.3,3.2),a(0,12.4,4.2),.3,e,3,"");const l=ue();for(let f=0;f<12;f++){const n=f/12*2*Math.PI,w=n+.62*2*Math.PI/12,S=(f+1)/12*2*Math.PI,z=(h,I,B)=>a(h,I*Math.cos(B),I*Math.sin(B));l.poly([z(-.8,4.5,n),z(.8,4.5,n),z(.8,4.5,w),z(-.8,4.5,w)],e,0);for(const h of[-.8,.8])l.poly([z(h,4.5,n),z(h,4.5,S),z(h,4,S),z(h,4,n)],e,0)}for(const f of[-.8,.8])for(let n=0;n<2;n++){const w=n*Math.PI/2+.3;ye(l,a(f,-4.2*Math.cos(w),-4.2*Math.sin(w)),a(f,4.2*Math.cos(w),4.2*Math.sin(w)),.32,e,0,"bt")}return{house:r,wheel:l}}function Ot(t,r,e,b,y,d){const s=[],o=(H,G,R,m,k,P)=>s.push({m:ke(t,H,G,R,m,m,m),b:H,r:G,y:R,scale:m,rope:k,kind:P}),i=2+t.frac(78);o(78,ee(i)-28+2.3+3.6,$(i),1,2.6,"near");const l=d;o(30,ee(l)-6.5,$(l),1.5,46,"great");let f=0;for(;s.length<11&&f++<200;){const H=r.int(1,6),G=r.range(0,360),R=H+t.frac(G),m=(G%360+360)%360;Te(m)&&R>=2.9||R>=6&&m>170&&m<292||H===2&&m>20&&m<110||s.some(k=>Math.abs(k.y-$(R))<40&&Math.abs((k.b-m+540)%360-180)<28)||o(m,ee(R)-5.5,$(R),r.range(.85,1.2),r.range(12,50),"far")}const n=[];for(const H of r.shuffle(b.slice()))n.length>=9||H.y<190||n.some(G=>Math.abs(G.y-H.y)<20&&Math.abs(G.b-H.b)<14)||(n.push(H),o(H.b,H.r,H.y+Ce,.9,r.range(8,22),"bite"));const w=y.anchors.crownSlot,S=y.anchors.craneAt,z=a(w.x-S.x,0,w.z-S.z),h=z.length();z.normalize();const I=a(0,1,0).cross(z),B=h/_e.z;return s.push({m:new u.Matrix4().makeBasis(I.multiplyScalar(B),a(0,B,0),z.clone().multiplyScalar(B)).setPosition(S),b:270,r:0,y:S.y,scale:B,rope:0,kind:"key"}),s}function Yt(t,r={}){return new u.ShaderMaterial({uniforms:{...ze,uDistK:{value:r.distK??.5},uMinPx:{value:r.minPx??4.2},uNearK:{value:r.nearK??0},uSmL:{value:(r.smock??t.smock)[0]},uSmS:{value:(r.smock??t.smock)[1]},uSm2:{value:(r.smock2??r.smock??t.smock)[0]},uWhL:{value:t.lime[0]},uWhS:{value:t.lime[1]}},vertexShader:Me+`
      attribute vec3 iPos;
      attribute vec4 iWalk, iLook;       // walk vector (m) and phase; cap colour and speed (negative speed = white smock)
      uniform float uMinPx, uNearK;
      varying vec2 vQ; varying vec3 vCap, vW; varying float vSide, vWhite, vTone;
      void main() {
        float sp = abs(iLook.w);
        vTone = step(0.5, fract(iWalk.w * 3.7));
        vec3 base = iPos + iWalk.xyz * sin(uTime * sp * 0.35 + iWalk.w);
        vec4 wb = modelMatrix * vec4(base, 1.0);
        vec3 up = mat3(modelMatrix) * vec3(0.0, 1.0, 0.0);
        up /= max(length(up), 1e-5);
        vec3 right = cross(up, uEye - wb.xyz);
        float rl = length(right);
        right = rl > 1e-4 ? right / rl : vec3(1.0, 0.0, 0.0);
        vec4 cb = projectionMatrix * viewMatrix * wb;
        float pxPerM = uView.y * projectionMatrix[1][1] * 0.5 / max(abs(cb.w), 1e-3);
        float h = max(1.75, uMinPx * (1.0 + uNearK * (1.0 - smoothstep(260.0, 620.0, abs(cb.w)))) / max(pxPerM, 1e-4));      // nearer than 260 m they are held larger: counted on the tiers above the climb
        float bob = 0.07 * abs(sin(uTime * sp * 2.4 + iWalk.w * 3.0));
        vec3 wp = wb.xyz + right * position.x * h * 0.56 + up * (position.y * h + bob);
        vQ = vec2(position.x + 0.5, position.y); vCap = iLook.rgb; vW = wp;
        vSide = step(0.0, dot(right, uLight)); vWhite = step(iLook.w, 0.0);
        gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
      }`,fragmentShader:Re+`
      uniform float uDistK; uniform vec3 uSmL, uSmS, uSm2, uWhL, uWhS;
      varying vec2 vQ; varying vec3 vCap, vW; varying float vSide, vWhite, vTone;
      void main() {
        float x = abs(vQ.x - 0.5) * 2.0, y = vQ.y;
        bool leg = y < 0.34 && x > 0.1 && x < 0.52;
        bool smock = y >= 0.34 && y < 0.8 && x < mix(0.95, 0.66, (y - 0.34) / 0.46);
        bool head = y >= 0.8 && x < 0.44;
        if (!(leg || smock || head)) discard;
        float litHalf = (vQ.x > 0.5) == (vSide > 0.5) ? 1.0 : 0.0;
        vec3 sm = mix(mix(uSmS, mix(uSmL, uSm2, vTone), litHalf), mix(uWhS, uWhL, litHalf), vWhite);
        vec3 c = leg ? uUmber2 : (smock ? sm : (y > 0.87 ? vCap : mix(uSmS, uSmL, 0.5)));
        gl_FragColor = vec4(pigmentDistance(c, vW, uDistK), 1.0);
      }`})}function jt(){const t=[],r=[],e=[];return{get count(){return t.length/3},add(b,y,d,s=1,o=!1,i=0){t.push(b.x,b.y,b.z),r.push(y.x,y.y,y.z,i),e.push(d.r,d.g,d.b,o?-s:s)},mesh(b){const y=new u.InstancedBufferGeometry;y.setAttribute("position",new u.Float32BufferAttribute([-.5,0,0,.5,0,0,.5,1,0,-.5,1,0],3)),y.setIndex([0,1,2,0,2,3]),y.setAttribute("iPos",new u.InstancedBufferAttribute(new Float32Array(t),3)),y.setAttribute("iWalk",new u.InstancedBufferAttribute(new Float32Array(r),4)),y.setAttribute("iLook",new u.InstancedBufferAttribute(new Float32Array(e),4)),y.instanceCount=t.length/3;const d=new u.Mesh(y,b);return d.frustumCulled=!1,d}}}async function Qt(t,r,e,b,y,d,s,o,i,l=[]){const f=mt(),n=jt(),w=r.umber2,S=ae(se[2],se[0],.4),z=new u.Matrix4,h=a(),I=a(),B=[r.timber[0],r.timber[1],w,r.smock[1],r.lime[0]],H=()=>e()<.1?r.red[0]:e.pick(B);let G=null;for(const c of y){const A=_e.clone().applyMatrix4(c.m),g=a(0,9.8,2.2).applyMatrix4(c.m),T=a(1,0,0).transformDirection(c.m);if(f.seg(A,g,.08,w),c.rope>0){const N=A.clone().add(a(0,-c.rope,0)),O=T.clone().multiplyScalar(.5+.022*c.rope),Z=e.range(0,6.28);f.seg(A,N,.09,w,-1,null,O,Z),c.kind==="near"?G={lo:N,sw:O,ph:Z}:f.seg(N,N.clone().add(a(0,-1.3*c.scale,0)),1.7*c.scale,e()<.6?r.stone[0]:r.brick[0],-1,O,O,Z)}for(let N=0;N<(c.kind==="near"?0:3);N++)n.add(a(e.range(-6,6),0,e.range(-7,-3.5)).applyMatrix4(c.m),T.clone().multiplyScalar(e.range(.5,3)),H(),e.range(.6,1.4),e()<.25,e.range(0,6.28));if(c.kind==="near")for(const N of xt)n.add(a(N.x,N.y-4.4,.3).applyMatrix4(c.m),a(0,0,0),H(),1.3,!1,e.range(0,6.28))}let R=0;for(const c of b){if(R++%40===0&&await i(),!(c.birth>0||e()<(c.stone?.07:.3)*o))continue;ke(t,c.b,c.r+.15,c.base,1,1,1,!1,z);const A=c.h*(c.birth>0||!c.stone?e.range(.8,1.06):e.range(.4,.9)),g=c.birth>0&&!c.late?c.birth-.045:-1,T=c.w/2-3.2,N=(Y,Q,oe,te,le,de,Oe,Ve)=>f.seg(h.set(Y,Q,oe).applyMatrix4(z).clone(),I.set(te,le,de).applyMatrix4(z).clone(),Oe,Ve,g);for(const Y of[-T,0,T])N(Y,0,9.3,Y+e.range(-.3,.3),A+e.range(0,3),9.3,.2,S);let O=0,Z=1;for(let Y=7+e.range(-1,1);Y<A-1;Y+=11.5){N(-T-1,Y,9.4,T+1,Y+e.range(-.3,.3),9.4,.3,S);for(const te of[-T,T])N(te,Y,9.3,te,Y,2.2,.16,S);g<0&&e()<.7&&n.add(h.set(e.range(-T,T)*.8,Y+.15,8.6).applyMatrix4(z),I.set(1,0,0).transformDirection(z).multiplyScalar(e.range(.5,2.5)),H(),e.range(.5,1.2),e()<.12,e.range(0,6.28));const Q=Z*T*.3,oe=Z*T*.75;N(Q,O,9.8,oe,Y,9.8,.1,w),N(Q+.55,O,9.8,oe+.55,Y,9.8,.1,w);for(let te=1;te<5;te++){const le=te/5;N(Q+(oe-Q)*le,O+(Y-O)*le,9.8,Q+(oe-Q)*le+.55,O+(Y-O)*le,9.8,.07,w)}O=Y,Z=-Z}}const m=Math.round(2500*o);for(let c=0;c<m;c++){c%120===0&&await i();const A=.4+6.6*Math.sqrt(e()),g=t.bearing(A),T=(g%360+360)%360,N=ee(A)-e.range(3,25),O=e.range(.5,1.6),Z=e.range(0,6.28),Y=e()<.12,Q=H(),oe=e.range(1.5,13);if(Te(T)&&A>=3.3||A>=6&&c%3!==0||A>=5.9&&T>156&&T<216)continue;const te=T>28&&T<100&&A>2&&A<2.5?ee(A)-19.5-7*(ee(A)-N-3)/22:N,le=A>=6&&T>225&&T<275&&ee(A)-te>8&&ee(A)-te<21?ee(A)-(te%2<1?5:23.5):te;t.at(g,le,$(A)+.1,h),n.add(h,a(Math.cos(g*F),0,-Math.sin(g*F)).multiplyScalar(oe),Q,O,Y,Z)}const k=c=>(c%360+360)%360,P=b.filter(c=>c.birth<0&&c.s<5.9&&!(c.s>1.9&&c.s<2.6&&k(c.b)>20&&k(c.b)<105)&&!(c.s>4.9&&k(c.b)>150&&k(c.b)<222));for(let c=0;c<Math.round(460*o)&&P.length;c++){c%120===0&&await i();let A=P[0];for(let g=0;g<12;g++){A=P[e.int(0,P.length-1)];const T=k(A.b);if(c%2||T>325||T<75)break}t.at(A.b+e.range(-.2,.2)*A.w/A.r/F,A.r+2.9,A.base+A.h+.05,h),n.add(h,a(Math.cos(A.b*F),0,-Math.sin(A.b*F)).multiplyScalar(e.range(1,.22*A.w)),H(),e.range(.5,1.3),e()<.15,e.range(0,6.28))}await i();for(let c=0;c<Math.round(250*o);c++){const A=c%5===4,g=A?e.range(216,268):e.range(30,99),T=(A?6:2)+t.frac(g),N=ee(T)-(A?e()<.5?e.range(2.5,8):e.range(21,26):e.range(19.5,26.5));t.at(g,N,$(T)+.1,h),n.add(h,a(Math.cos(g*F),0,-Math.sin(g*F)).multiplyScalar(e.range(2,14)),H(),e.range(.6,1.5),e()<.12,e.range(0,6.28))}let C=0;for(const c of d)for(let A=0;A<Math.round(13*o);A++){C++%240===239&&await i();const g=A%2?e.range(-9,9):e.sign()*e.range(8.9,10.5),T=c.b+e.range(-.3,.3)*c.w/c.r/F,N=t.bite(Math.min(1,Math.max(0,t.biteT(T))));t.at(T,c.r+g,c.y+(Math.abs(g)>8.6?0:Ce*(1-Math.abs(g)/8.6)),h);const O=Math.hypot(c.r+g-N.r,h.y-N.y-12)<17,Z=a(Math.cos(c.b*F),0,-Math.sin(c.b*F)).multiplyScalar(e.range(1,c.w*.2)),Y=H(),Q=e.range(.5,1.4),oe=e()<.12,te=e.range(0,6.28);O||n.add(h,Z,Y,Q,oe,te)}for(let c=0;c<12;c++){const A=e.range(-7,7),g=e.range(-22,-1.5);n.add(a(A,24.4-.045*A*A*1.6,g).applyMatrix4(s.frame),a(0,0,1).transformDirection(s.frame).multiplyScalar(e.range(.5,3)),H(),e.range(.5,1.3),e()<.22,e.range(0,6.28))}const M=ue(),v=r.lime,p=r.timber,V=r.thatch,L=c=>{M.box(-2.3,0,-1.6,2.3,2.2,1.6,p,3,0,c,"bt");const A=[a(-2.7,2,2),a(2.7,2,2),a(2.7,2,-2),a(-2.7,2,-2),a(-2.5,4.3,0),a(2.5,4.3,0)].map(g=>g.applyMatrix4(c));M.poly([A[0],A[1],A[5],A[4]],V,3),M.poly([A[2],A[3],A[4],A[5]],V,3),M.poly([A[1],A[2],A[5]],p,3),M.poly([A[3],A[0],A[4]],p,3),M.poly([a(-.6,0,1.63),a(.6,0,1.63),a(.6,1.7,1.63),a(-.6,1.7,1.63)].map(g=>g.applyMatrix4(c)),r.dark,0)},K=c=>{M.box(-1.7,0,-.8,1.7,.6,.8,p,3,0,c,"bt"),M.poly([a(-1.7,.6,.8),a(1.7,.6,.8),a(1.7,.6,-.8),a(-1.7,.6,-.8)].map(A=>A.applyMatrix4(c)),v,0)},x=(c,A,g=1)=>M.box(-1.3*g,0,-.75*g,1.3*g,1.25*g,.75*g,A?r.stone:r.brick,A?2:1,0,c,"b"),E=new u.Matrix4,D=new u.Matrix4,U=(c,A,g,T,N,O=0)=>E.copy(ke(t,c,A,g,1,1,1,!1,z)).multiply(D.makeRotationY(O).setPosition(T,0,N));let q=.45,j=0;for(;q<6.95;){const c=t.bearing(q),A=(c%360+360)%360,g=q>=6,T=g&&j%2===1,N=ee(q)-(g?T?6.2:24:25.2),O=$(q)+.05,Z=e.range(44,70)/(2*Math.PI*ee(q))*(g?.42:1);if(q+=Z,Te(A)&&q>=3.2||g&&q>=s.sE-.012){j++;continue}j++%10===9&&await i();const Y=e();if(Y<.62&&L(U(c,N,O,0,0,e.range(-.2,.2)+(T?Math.PI:0))),Y>.3&&K(U(c,N,O,Y<.62?5.6:0,1.6,e.range(-.5,.5))),x(U(c,N,O,-5.4,.6,e.range(-.4,.4)),q<4.4,e.range(.9,1.4)),e()<.5&&x(U(c,N,O,-8.6,1,e.range(-.4,.4)),q<4.4,e.range(.7,1.1)),!g&&e()<.6){const Q=a(2.9,0,-.4).applyMatrix4(U(c,N,O,3.4,0)),oe=a(2.9,9,-2.9).applyMatrix4(E),te=a(3.5,0,-.4).applyMatrix4(E),le=a(3.5,9,-2.9).applyMatrix4(E);f.seg(Q,oe,.1,w),f.seg(te,le,.1,w);for(let de=1;de<8;de++)f.seg(Q.clone().lerp(oe,de/8),te.clone().lerp(le,de/8),.07,w)}}await i();for(const c of d){const A=t.bite(Math.min(1,Math.max(0,t.biteT(c.b))));if(Math.hypot(c.r-A.r,c.y+3-A.y-12)<20||y.some(N=>N.kind==="bite"&&Math.abs(N.b-c.b)<.01&&Math.abs(N.r-c.r)<.01&&Math.abs(N.y-c.y)<4))continue;const g=c.y+Ce*.85,T=e();if(T<.3?L(U(c.b,c.r,g,0,0,Math.PI/2+e.range(-.2,.2))):T<.62&&K(U(c.b,c.r,g,e.range(-3,3),0,e.range(-.6,.6))),x(U(c.b,c.r,g,e.range(-1,1)+(T<.62?5.5:0),e.range(-.8,.8),e.range(-.5,.5)),!1,e.range(.9,1.5)),e()<.55*o){const N=e.range(8,14),O=e.range(-7,-4.5);U(c.b,c.r,g,0,0);const Z=(Y,Q,oe)=>a(Y,Q,oe).applyMatrix4(E);for(let Y=0;Y<3;Y++)f.seg(Z(O+3.2*Y,-.4,4.5),Z(O+3.2*Y+e.range(-.3,.3),N+e.range(0,2.5),4.5),.18,S);f.seg(Z(O-.8,N*.55,4.6),Z(O+7.2,N*.55+e.range(-.3,.3),4.6),.24,S),f.seg(Z(O-.8,N*.96,4.6),Z(O+7.2,N*.96,4.6),.2,S)}}{const c=(g,T,N)=>a(g,T,N).applyMatrix4(s.frame),A=a(1,0,0).transformDirection(s.frame);for(const g of[-13.6,-11.4,11.4,13.6])f.seg(c(g,0,1.6),c(g+e.range(-.3,.3),27+e.range(0,3),1.6),.2,S);for(const g of[-1,1])for(const T of[7.5,15.5,23])f.seg(c(g*10.6,T,1.7),c(g*14.4,T+e.range(-.2,.2),1.7),.3,S),n.add(c(g*e.range(11.6,13.2),T+.15,1.3),A.clone().multiplyScalar(.6),H(),e.range(.5,1.2),!1,e.range(0,6.28));f.seg(c(-14.4,26.2,1.7),c(14.4,26.4,1.7),.3,S);for(let g=0;g<5;g++)n.add(c(e.range(-12,12),26.5,1.3),A.clone().multiplyScalar(e.range(.5,2)),H(),e.range(.5,1.2),e()<.15,e.range(0,6.28));for(const g of[-1,1]){f.seg(c(g*12.1,0,2.6),c(g*12.1,7.5,1.8),.1,w),f.seg(c(g*12.7,0,2.6),c(g*12.7,7.5,1.8),.1,w);for(let T=1;T<7;T++)f.seg(c(g*12.1,T*1.07,2.6-.114*T),c(g*12.7,T*1.07,2.6-.114*T),.07,w)}}const J=[];for(let c=0;c<=40;c++){const A=t.bite(c/40);J.push(t.at(A.b,A.r,A.y+12))}let ie=0;for(const c of l){if(ie++%20===19&&await i(),e()>.6*o)continue;const A=a(0,15,2).applyMatrix4(c);if(J.some(Q=>Q.distanceTo(A)<19))continue;const g=(Q,oe,te)=>a(Q,oe,te).applyMatrix4(c),T=e.sign(),N=T*10.6,O=T*e.range(3.5,7),Z=e.range(17,29),Y=a(1,0,0).transformDirection(c);f.seg(g(N,-.5,1.9),g(N+e.range(-.2,.2),Z+2,1.9),.18,S),f.seg(g(O,-.5,1.9),g(O+e.range(-.2,.2),Z+1,1.9),.18,S);for(let Q=e.range(6,9);Q<Z;Q+=e.range(7.5,9.5)){f.seg(g(N+T*.6,Q,1.9),g(O-T*.6,Q+e.range(-.2,.2),1.9),.3,S),f.seg(g(N,Q,1.9),g(N,Q,.2),.14,S),f.seg(g(O,Q,1.9),g(O,Q,.2),.14,S);const oe=e()<.45?2:1;for(let te=0;te<oe;te++)n.add(g(N+(O-N)*e.range(.2,.8),Q+.15,1.5),Y.clone().multiplyScalar(e.range(.3,1.2)),H(),e.range(.5,1.2),e()<.12,e.range(0,6.28))}}return{rib:f,fig:n,furn:M,nearLoad:G}}export{se as PALETTE,Me as STYLE_DECL,Re as STYLE_GLSL,ze as STYLE_UNIFORMS,Le as addHullNormals,ht as addHullNormalsAsync,Ke as bruegelMaterial,Xt as buildHero,wt as cloudGeometry,Kt as cloudGeometrySteps,et as cloudMaterial,It as contourMaterial,Yt as figureMaterial,jt as makeFigures,ge as makeInstances,ue as makePaint,Nt as makePigments,mt as makeRibbons,ae as mixHex,Ht as ribbonMaterial};
