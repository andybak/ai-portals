import*as o from"three";const mt=Math.PI/180,Ae=["#0B0B10","#F3F0E6","#1A0F02","#FFB648","#06140C","#9CF5B0"],se=`
uniform vec3 uK; uniform vec3 uW; uniform float uPx;
float obB2(vec2 v){ return fract(v.x * 0.5 + v.y * v.y * 0.75); }
float obBayer(vec2 c){ vec2 p = mod(c, 4.0); vec2 q = floor(p * 0.5); vec2 r = p - 2.0 * q; return obB2(q) * 0.25 + obB2(r) + 0.03125; }
float obCell(vec2 c, float tone){ return step(obBayer(c), tone); }
float obPat(vec2 uv, float tone, vec2 fw){
  float f = max(max(fw.x, fw.y), 1e-5);
  if (f > 0.3333) return step(0.5, tone);
  if (tone <= 0.0) return 0.0;
  if (tone >= 1.0) return 1.0;
  vec2 g = fract(uv) - 0.5;
  vec2 s = floor(uv) + 0.5 + sign(g) * clamp((abs(g) - 0.5 + fw * 0.5) / max(fw, vec2(1e-5)), 0.0, 0.5);
  vec2 b = floor(s - 0.5); vec2 w = s - 0.5 - b;
  float i00 = obCell(b, tone), i10 = obCell(b + vec2(1.0, 0.0), tone), i01 = obCell(b + vec2(0.0, 1.0), tone), i11 = obCell(b + vec2(1.0, 1.0), tone);
  return mix(mix(i00, i10, w.x), mix(i01, i11, w.x), w.y);
}
float obHash(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
vec3 obInk(float i){ return mix(uK, uW, clamp(i, 0.0, 1.0)); }
`,xe=`
uniform float uPx; attribute vec3 aTan; attribute float aSide; attribute float aW;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vec3 t = mat3(modelViewMatrix) * aTan; t = t / max(length(t), 1e-5);
  vec3 v = mv.xyz / max(length(mv.xyz), 1e-5);
  vec3 s = cross(t, v); s = s / max(length(s), 1e-4);
  float hw = max(aW, 0.78 * max(-mv.z, 0.0) / max(uPx, 1.0));
  mv.xyz += s * aSide * hw;
  gl_Position = projectionMatrix * mv;
}`,Re=`
uniform vec3 uMoonDir; uniform float uStep; uniform float uCell;
attribute float aCell;                                   // metres per cell, one value per facet (0 or absent: the material's uCell)
flat varying float vTone; flat varying vec3 vN; flat varying float vCell; varying vec3 vWp;
void main(){
  vCell = aCell > 0.0 ? aCell : uCell;
  vec3 n = mat3(modelMatrix) * normal; n = n / max(length(n), 1e-5);
  float c = dot(n, uMoonDir);
  float tone = c > 0.5736 ? 1.0 : (c > 0.342 ? 0.75 : (c > 0.0872 ? 0.5 : (c > -0.1736 ? 0.25 : 0.0)));
  vTone = max(tone - uStep * 0.25, 0.0); vN = n;
  vec4 wp = modelMatrix * vec4(position, 1.0); vWp = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,Be=`
uniform float uDust; uniform vec2 uCourse; uniform float uDark; uniform float uCourseDist;
flat varying float vTone; flat varying vec3 vN; flat varying float vCell; varying vec3 vWp;
${se}
void main(){
  vec3 a = abs(vN);
  vec2 uv = (a.y > a.x && a.y > a.z) ? vWp.xz : ((a.x > a.z) ? vWp.zy : vWp.xy);
  float cs = max(vCell, 1e-3);
  uv /= cs;
  vec2 fw = fwidth(uv);
  float ink = obPat(uv, vTone, fw);
  // dust on the plate: a few stray white squares (0.4 m) on black land, only where one is a clear 3 px
  vec2 dc = floor(uv * cs * 2.5); vec2 dfw = fw * cs * 2.5;
  if (max(dfw.x, dfw.y) < 0.3333 && vTone <= 0.0 && obHash(dc) < uDust) ink = 1.0;
  // courses (uCourse.x metres high; 0: none): drawn joints on the standing faces, the face's own ink reversed along a line
  // never under 1.5 px, and dropped whole where a course is under 7 px. On a white face every bed joint and staggered
  // upright joints (uCourse.y); on a black face only a stroke here and there. Pinned to the rock, no time in it.
  float ch = max(uCourse.x, 1e-3);
  float cy = vWp.y / ch + 0.37, row = floor(cy);
  float al = ((a.x > a.z) ? vWp.z : vWp.x) / (ch * 2.7) + 0.5 * mod(row, 2.0) + 0.35 * obHash(vec2(row, 7.0));
  float fy = max(fwidth(vWp.y) / ch, 1e-5), fa = max(fwidth(al), 1e-5);
  if (fy > 0.5) fa = 1.0;                                                     // a row boundary inside this pixel's neighbourhood
  vec3 cd = vWp - cameraPosition;
  if (uCourse.x > 0.0 && a.y < 0.6 && (vTone <= 0.0 || vTone >= 1.0) && fy < 0.143 && dot(cd, cd) < uCourseDist * uCourseDist) {
    float dj = min(fract(cy), 1.0 - fract(cy)), da = min(fract(al), 1.0 - fract(al));
    float seg = obHash(vec2(row, floor(al)));
    bool bed = dj < max(0.05 / ch, 0.8 * fy) && (vTone >= 1.0 ? seg > 0.12 : seg > uDark);
    bool up = uCourse.y > 0.5 && fa < 0.06 && da < max(0.05 / (ch * 2.7), 0.8 * fa) && (vTone >= 1.0 ? obHash(vec2(row, floor(al))) > 0.2 : (uCourse.y > 1.5 && obHash(vec2(row + 3.0, floor(al))) > 0.5));
    if (bed || up) ink = 1.0 - ink;
  }
  gl_FragColor = vec4(obInk(ink), 1.0);
}`,ie="void main(){ gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",Ce="varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",de="uniform vec3 uInk; void main(){ gl_FragColor = vec4(uInk, 1.0); }",ye="uniform vec3 uK; uniform vec3 uW; void main(){ gl_FragColor = vec4(uK + uW, 1.0); }",we=`
uniform vec3 uGateP; uniform vec3 uGateN; uniform vec2 uGateDim;
bool obGated(vec3 wp){
  vec3 rd = wp - cameraPosition; float dn = dot(rd, uGateN);
  if (abs(dn) < 1e-5) return false;
  float t = dot(uGateP - cameraPosition, uGateN) / dn;
  if (t < 1.0) return false;
  vec3 h = cameraPosition + rd * t - uGateP;
  if (h.y < 0.0) return false;                                  // under the sill is the sea in front of the arch
  float a = h.x * uGateN.z - h.z * uGateN.x, yc = uGateDim.y - uGateDim.x;
  return h.y > yc ? (a * a + (h.y - yc) * (h.y - yc) < uGateDim.x * uGateDim.x) : abs(a) < uGateDim.x;
}`,Fe=`varying vec3 vGw;
void main(){ vGw = (modelMatrix * vec4(position, 1.0)).xyz;`,be=`uniform vec3 uK; uniform vec3 uW; varying vec3 vGw;${we}
void main(){ if (obGated(vGw)) discard; gl_FragColor = vec4(uK + uW, 1.0); }`,Le=`uniform float uTone; uniform vec2 uCells; varying vec2 vUv;
${se}
void main(){ vec2 c = vUv * uCells; gl_FragColor = vec4(obInk(obPat(c, uTone, fwidth(c))), 1.0); }`,oe={transparent:!0,depthWrite:!1,depthTest:!0,blending:o.CustomBlending,blendEquation:o.SubtractEquation,blendSrc:o.OneFactor,blendDst:o.OneFactor,blendEquationAlpha:o.AddEquation,blendSrcAlpha:o.ZeroFactor,blendDstAlpha:o.OneFactor},We=`
varying vec3 vDir;
void main(){
  vDir = position;                                   // world directions, whatever the dome is parented to
  vec4 p = projectionMatrix * viewMatrix * vec4(cameraPosition + vDir, 1.0);
  if (abs(p.w) < 1e-4) p.w = 1e-4;
  gl_Position = p.xyww;
}`,Ve=`
uniform vec2 uApex; uniform vec2 uRoadDir; uniform float uTime; uniform vec2 uRoadTan; uniform float uRoadOn; uniform float uRoadNear;
const float OB_ROW = 1.6; const float OB_DASH = 5.0;
// the road's angular coordinate at a point of the water: 0 on the axis, uRoadTan.y at the core's edge, uRoadTan.x at the fringe's
float obWedge(vec2 q){
  vec2 v = q - uApex;
  float al = dot(v, uRoadDir), ac = abs(dot(v, vec2(uRoadDir.y, -uRoadDir.x)));
  float tt = al > max(uRoadNear, 0.5) ? ac / al : 9.0;                       // uRoadNear: the road is laid toward us dash by dash
  return mix(9.0, tt, uRoadOn);
}
// (polish 2) light on water: inside the core's edge the joined dashes of every row swell, a needle that thickens toward
// the axis until the rows meet. Each row reaches as far as it likes (the hand), so the road's edge is a comb of strokes,
// never a block. T: the tier of rows drawn (spacing OB_ROW * 2^T); grow: 0.25 to 0.5 of that spacing; pull: the tier
// that is about to drop out draws its strokes back into the white.
float obStroke(vec2 p, float fz, float T, float grow, float pull){
  float RS = OB_ROW * exp2(T);
  float r = floor(p.y / RS + 0.5), dz = abs(p.y - r * RS);
  float c = max(uRoadTan.y, 1e-4);
  float rid = r * exp2(T);
  float tt = obWedge(p) + (obHash(vec2(rid, 3.7)) - 0.5) * 0.5 * c + pull * 0.75 * c;
  // (true 1) the sea has one motion: the 7 s wave travelling along the row. A joined row is a dash like any other, and
  // its end lengthens and shortens on that same wave (the row's own phase, the same 45 m wave as its dashes).
  tt += 0.15 * c * sin(6.2831853 * (p.x / 45.0 - uTime / 7.0) + obHash(vec2(rid, 7.5)) * 6.2831853);
  if (tt >= c) return 0.0;
  float s = clamp((c - tt) / (0.45 * c), 0.0, 1.0);
  float hw = mix(max(0.09, 0.78 * fz), grow * RS + fz, s * s);
  return clamp((hw - dz) / fz + 0.5, 0.0, 1.0);
}
float obSea(vec2 p, vec2 fwp){
  float fz = max(fwp.y, 1e-4), fx = max(fwp.x, 1e-4);
  float rz = p.y / OB_ROW; float r = floor(rz + 0.5); float dzm = (rz - r) * OB_ROW;
  float L = 0.0;
  if (mod(r, 2.0) < 0.5) L = 1.0;
  if (mod(r, 4.0) < 0.5) L = 2.0;
  if (mod(r, 8.0) < 0.5) L = 3.0;
  if (mod(r, 16.0) < 0.5) L = 4.0;
  if (mod(r, 32.0) < 0.5) L = 5.0;
  if (mod(r, 64.0) < 0.5) L = 6.0;
  float vis = clamp((OB_ROW * exp2(L) / fz - 4.0) * 0.5, 0.0, 1.0);      // rows drop out in fixed tiers, dashes shortening to nothing
  vis *= clamp((OB_DASH / fx - 3.0) * 0.5, 0.0, 1.0);
  float o = obHash(vec2(r, 1.5)) * OB_DASH;
  float xx = (p.x + o) / OB_DASH; float i = floor(xx); float u = xx - i - 0.5;
  float ph = obHash(vec2(r, 7.5)) * 6.2831853;
  float wv = sin(6.2831853 * ((i + 0.5) * OB_DASH / 45.0 - uTime / 7.0) + ph);
  float f0 = (0.25 + 0.10 * wv) * (0.88 + 0.24 * obHash(vec2(i, r)));
  float c = max(uRoadTan.y, 1e-4);
  float tc = obWedge(vec2((i + 0.5) * OB_DASH - o, r * OB_ROW)) + (obHash(vec2(i * 0.37 + 3.0, r)) - 0.5) * 0.012;   // the hand: the wedge's edges are not ruled
  float g = clamp((uRoadTan.x - tc) / max(uRoadTan.x - uRoadTan.y, 1e-4), 0.0, 1.0);
  float f = mix(f0, 1.0, g * g * (3.0 - 2.0 * g)) * vis;                    // the fringe: the dashes lengthen until they join
  float covx = f >= 0.985 ? 1.0 : (f <= 0.002 ? 0.0 : clamp((f * 0.5 - abs(u)) * OB_DASH / fx + 0.5, 0.0, 1.0));
  float hw = max(0.09, 0.78 * fz);                                         // rows are 0.18 m thick, never under 1.5 px
  float covz = clamp((hw - abs(dzm)) / fz + 0.5, 0.0, 1.0);
  float ink = covx * covz;
  // the core: the joined rows swell until they meet. Two tiers of rows are drawn, the finer one withdrawing as it closes up
  // Only every fourth row swells (tongues of light 6.4 m apart): we sail across the rows at ten metres a second, and
  // a comb of every row would flip under the eye six times a second; these pass at under two.
  float lv = max(log2(max(4.0 * fz / OB_ROW, 1.0)), 2.0), T0 = floor(lv), k = clamp((lv - T0) * 2.0, 0.0, 1.0);
  float gw = mix(0.37, 0.5, clamp(fz / 0.8 - 0.5, 0.0, 1.0));
  ink = max(ink, max(obStroke(p, fz, T0 + 1.0, 0.5 * gw * (1.0 + k), 0.0), obStroke(p, fz, T0, gw, k)));   // (polish 4) near the eye the swollen rows stop short of meeting: bands of light with a black thread between, never one blank sheet
  // deep in the core the sea is white and its dashes are black, growing from nothing
  float fb = (0.2 + 0.06 * wv) * (0.8 + 0.4 * obHash(vec2(i, r + 5.0))) * vis * clamp((0.97 * c - tc) / (0.12 * c), 0.0, 1.0);   // (polish 4) the white water is never blank: its black dashes run out to the comb (polish 5: right out to it). (true 1) thinned toward the brief's "fraction 0.1 to 0.2": 0.11 to 0.31, mean 0.2 (it was 0.29 to 0.82)
  float cbx = fb <= 0.002 ? 0.0 : clamp((fb * 0.5 - abs(u)) * OB_DASH / fx + 0.5, 0.0, 1.0);
  float hwb = max(0.15, 0.78 * fz);                                       // (polish 5) on the white the black dashes are strokes a hand wide: near the eye the road is hatched, not a blank sheet
  float covb = clamp((hwb - abs(dzm)) / fz + 0.5, 0.0, 1.0);
  return step(0.5, min(ink, 1.0 - cbx * covb));                             // (polish 4) cut hard at half coverage: no feathered ends, no grey far rows; the sea stair-steps like the maria
}`,Oe=`
varying vec3 vDir;
uniform vec3 uMoonDir; uniform vec3 uMoonR3; uniform vec3 uMoonU3; uniform float uMoonTan; uniform float uCells;
uniform sampler2D uMaria; uniform vec4 uBars[3]; uniform float uBarT; uniform float uStarP; uniform float uSeaY; uniform float uCrescent;
${se}
${Ve}
void main(){
  vec3 d = vDir / max(length(vDir), 1e-5);
  float ink = 0.0;
  float pr = 1.0 / max(uPx, 1.0);
  float h = cameraPosition.y - uSeaY;
  // the sea: taken before the branch so the derivatives are valid on both sides of the horizon
  float dy = min(d.y, -1e-4);
  vec2 sp = cameraPosition.xz + d.xz * (max(h, 0.05) / -dy);
  vec2 fwp = fwidth(sp);
  if (d.y < 0.0) {
    ink = obSea(sp, fwp);
  } else {
    float el = asin(clamp(d.y, -1.0, 1.0));
    float zz = (abs(d.z) < 1e-6 && abs(d.x) < 1e-6) ? 1e-6 : d.z;
    float az = atan(d.x, zz);
    // stars: one hashed cell in 3 degree bands, each a square 2 px across
    float bj = floor(el / 0.05236);
    float n = max(floor(120.0 * cos((bj + 0.5) * 0.05236)), 1.0);
    float a = (az / 6.2831853 + 0.5) * n; float ai = floor(a);
    vec2 hc = vec2(ai, bj * 7.0 + 3.0);
    if (obHash(hc) < uStarP) {
      float sa = 0.2 + 0.6 * obHash(hc + 11.3), se = 0.2 + 0.6 * obHash(hc + 23.7);
      float da = (a - ai - sa) / n * 6.2831853 * cos(el), de = el - (bj + se) * 0.05236;
      ink = clamp((pr - abs(da)) * uPx + 0.5, 0.0, 1.0) * clamp((pr - abs(de)) * uPx + 0.5, 0.0, 1.0);
    }
    // the disc
    float md = dot(d, uMoonDir);
    if (md > 0.3) {
      vec3 q = d / md;
      vec2 m = vec2(dot(q, uMoonR3), dot(q, uMoonU3)) / uMoonTan;
      float rpx = uMoonTan * uPx;
      float edge = clamp((1.0 - length(m)) * rpx + 0.5, 0.0, 1.0);
      if (uCrescent > 0.5) {                                             // phase: a thin crescent holding the old moon at 25 per cent
        float lit = clamp((length(m - vec2(-0.2, 0.45)) - 1.0) * rpx + 0.5, 0.0, 1.0);
        vec2 tuv = m * 0.5 + 0.5; vec2 c = tuv * uCells;
        float tone = mix(0.25, 1.0, step(0.5, lit));
        float eld = el / 0.0174533;
        tone = min(tone, eld < 1.0 ? 0.5 : (eld < 2.0 ? 0.75 : 1.0));
        ink = mix(ink, obPat(c, tone, vec2(uCells * 0.5 / max(rpx, 1.0))), edge);
      } else if (edge > 0.0) {
        vec2 tuv = m * 0.5 + 0.5; vec2 c = tuv * uCells;
        float mt = floor(textureLod(uMaria, tuv, 0.0).r * 4.0 + 0.5) * 0.25;
        float eld = el / 0.0174533;
        float tone = min(mt, eld < 1.0 ? 0.5 : (eld < 2.0 ? 0.75 : 1.0));
        ink = mix(ink, obPat(c, tone, vec2(uCells * 0.5 / max(rpx, 1.0))), edge);
      }
    }
    // cloud bars: flat-ended strips, exclusive-or with whatever is behind
    vec2 mh = uMoonDir.xz / max(length(uMoonDir.xz), 1e-5);
    float rx = d.x * mh.y - d.z * mh.x, rzz = d.x * mh.x + d.z * mh.y;
    float raz = atan(rx, (abs(rzz) < 1e-6 && abs(rx) < 1e-6) ? 1e-6 : rzz);
    for (int k = 0; k < 3; k++) {
      vec4 b = uBars[k];
      float ba = mod(b.x + uBarT + 1.5708, 3.14159265) - 1.5708;
      // (polish 4) a drawn cloud, not a bare bar: a flat foot, and a top that climbs in stairs toward a crown set off
      // the middle, with a second lower hump; every edge a hard step (a bar across the disc read as a glitch dash)
      float cx = (raz - ba) / max(b.z, 1e-4);                                // -1..1 along the cloud
      float hump = max(1.0 - abs(cx - 0.18) * 1.5, 0.62 - abs(cx + 0.5) * 1.6);
      float stairs = floor(clamp(hump, 0.0, 1.0) * 4.0 + 0.999);             // 0 outside, 1..4 inside
      float topEl = b.y - b.w + 2.0 * b.w * stairs;
      float inx = step(abs(cx), 1.0) * step(0.5, stairs);
      float iny = step(b.y - b.w, el) * step(el, topEl);
      // a slit of what lies behind, low in the cloud: the foot is a separate thin bar under the body
      float slit = step(b.y - b.w + 0.9 * b.w, el) * step(el, b.y - b.w + 1.5 * b.w) * step(abs(cx + 0.1), 0.7);
      float cl = inx * iny * (1.0 - slit);
      ink = mix(ink, 1.0 - ink, cl);
    }
  }
  gl_FragColor = vec4(obInk(ink), 1.0);
}`,Ie=[[-.25,.48,.3,.27],[.24,.42,.19,.18],[.43,.14,.22,.18],[.76,.3,.1,.12],[.66,-.1,.13,.16],[.45,-.3,.09,.09],[-.62,.2,.2,.42],[-.2,-.36,.22,.17],[-.52,-.42,.11,.1],[.02,.83,.42,.055],[.1,.12,.12,.08]];function Ee(b,v){const e=new Uint8Array(2304),m=b.range(-.7,.7),p=b.chance(.25)?-1:1,c=Math.cos(m),d=Math.sin(m),B=b.range(0,50);for(let h=0;h<48;h++)for(let P=0;P<48;P++){const T=((P+.5)/48*2-1)*p,g=(h+.5)/48*2-1,A=T*c+g*d,I=-T*d+g*c;let z=9;for(const C of Ie){const s=(A-C[0])/C[2],M=(I-C[1])/C[3];z=Math.min(z,(Math.sqrt(s*s+M*M)-1)*Math.min(C[2],C[3]))}z+=(v?v.fbm2(A*2.2+B,I*2.2,2):0)*.05-.02;const k=Math.sqrt(T*T+g*g);k>.93&&(z=Math.max(z,(k-.93)*2+.031)),e[h*48+P]=z<-.12?128:z<0?191:255}const f=new o.DataTexture(e,48,48,o.RedFormat,o.UnsignedByteType);return f.magFilter=f.minFilter=o.NearestFilter,f.generateMipmaps=!1,f.needsUpdate=!0,f}function qe(b,v={}){const n=b.rng.fork?b.rng.fork("one-bit-style"):b.rng,e=v.palette||Ae,m=v.colourway||(n()<.62?"bone":n()<.5?"amber":"green"),p=m==="amber"?[e[2],e[3]]:m==="green"?[e[4],e[5]]:[e[0],e[1]];v.negative&&p.reverse();const c=s=>new o.Color(s),d={black:c(e[0]),white:c(e[1]),amberBlack:c(e[2]),amber:c(e[3]),greenBlack:c(e[4]),green:c(e[5]),K:c(p[0]),W:c(p[1])},B=Ee(n,b.noise),f=[];for(let s=0;s<3;s++)f.push(new o.Vector4((-17+s*12+n.range(-3,3))*mt,(3.6+s*5.2+n.range(-1,1))*mt,(8.5-1.5*s)*mt,(.62-.08*s)*mt));const h={uK:{value:d.K},uW:{value:d.W},uPx:{value:600},uTime:{value:0},uGateP:{value:new o.Vector3(0,-1e5,0)},uGateN:{value:new o.Vector3(0,0,1)},uGateDim:{value:new o.Vector2(0,0)},uMoonDir:{value:new o.Vector3(0,0,1)},uMoonR3:{value:new o.Vector3(1,0,0)},uMoonU3:{value:new o.Vector3(0,1,0)},uMoonTan:{value:Math.tan(15*mt)},uCells:{value:96},uMaria:{value:B},uBars:{value:f},uBarT:{value:0},uStarP:{value:.39*(v.density??1)},uSeaY:{value:0},uCrescent:{value:v.crescent?1:0},uApex:{value:new o.Vector2(0,0)},uRoadDir:{value:new o.Vector2(0,1)},uRoadTan:{value:new o.Vector2(Math.tan(10*mt),Math.tan(5*mt)).multiplyScalar(v.crescent?1/3:1)},uRoadOn:{value:1},uRoadNear:{value:0}},P=(...s)=>Object.fromEntries(s.map(M=>[M,h[M]])),T=()=>P("uK","uW","uPx"),g={palette:d,K:d.K,W:d.W,colourway:m,uniforms:h,glsl:se,xorBlend:oe,moonAz:0,moonEl:0};g.ink=(s=!1,M={})=>new o.ShaderMaterial({uniforms:{uInk:s?h.uW:h.uK},vertexShader:ie,fragmentShader:de,side:M.side??o.FrontSide}),g.pattern=(s=.5,M=[16,16],D={})=>new o.ShaderMaterial({uniforms:{...T(),uTone:{value:s},uCells:{value:new o.Vector2(M[0],M[1])}},vertexShader:Ce,fragmentShader:Le,side:D.side??o.FrontSide}),g.land=(s={})=>new o.ShaderMaterial({uniforms:{...T(),uMoonDir:h.uMoonDir,uStep:{value:s.step??0},uCell:{value:s.cell??.1},uDust:{value:s.dust??.004},uCourse:{value:new o.Vector2(s.course??0,s.joints??0)},uDark:{value:s.dark??.84},uCourseDist:{value:s.courseDist??1e5}},vertexShader:Re,fragmentShader:Be,side:s.side??o.FrontSide});const A=()=>P("uGateP","uGateN","uGateDim"),I=s=>s.replace("void main(){",Fe);g.figure=(s={})=>new o.ShaderMaterial({uniforms:{...P("uK","uW"),...s.gate?A():{}},vertexShader:s.vertexShader??(s.gate?I(ie):ie),fragmentShader:s.gate?be:ye,side:s.side??o.DoubleSide,...oe}),g.line=(s={})=>new o.ShaderMaterial({uniforms:s.figure?{...P("uK","uW","uPx"),...s.gate?A():{}}:{uInk:s.black?h.uK:h.uW,uPx:h.uPx},vertexShader:s.figure&&s.gate?I(xe):xe,fragmentShader:s.figure?s.gate?be:ye:de,side:o.DoubleSide,...s.figure?oe:{}}),g.gateGlsl=we,g.setGate=(s,M,D,Y)=>{h.uGateP.value.copy(s),h.uGateN.value.copy(M).setY(0).normalize(),h.uGateDim.value.set(D,Y)},g.skyMaterial=new o.ShaderMaterial({uniforms:{...h},vertexShader:We,fragmentShader:Oe,side:o.BackSide,depthWrite:!1,depthTest:!1});const z=new o.Vector2;g.hook=function(s,M,D){const Y=s.getRenderTarget(),V=Y?Y.height:s.getDrawingBufferSize(z).y;h.uPx.value=Math.max(50,.5*V*D.projectionMatrix.elements[5]),h.uCells.value=2*h.uMoonTan.value*h.uPx.value/96>=3?96:48},g.makeSky=()=>{const s=new o.Mesh(new o.IcosahedronGeometry(1,2),g.skyMaterial);return s.frustumCulled=!1,s.renderOrder=-.9,s.onBeforeRender=g.hook,s};const k=[];g.makeSeaDepth=(s=1500)=>{const M=[0,1.5,4,9,20,45,100,230,520,s],D=28,Y=[],V=[];for(let E=0;E<M.length;E++)for(let H=0;H<D;H++){const S=H/D*Math.PI*2;Y.push(Math.cos(S)*M[E],-.06,Math.sin(S)*M[E])}for(let E=0;E<M.length-1;E++)for(let H=0;H<D;H++){const S=E*D+H,q=E*D+(H+1)%D,X=S+D,y=q+D;V.push(S,q,X,q,y,X)}const R=new o.BufferGeometry;R.setAttribute("position",new o.Float32BufferAttribute(Y,3)),R.setIndex(V);const U=new o.Mesh(R,new o.ShaderMaterial({uniforms:{uInk:h.uK},vertexShader:ie,fragmentShader:de,colorWrite:!1,side:o.DoubleSide}));return U.frustumCulled=!1,U.renderOrder=-.5,k.push(U),U},g.setMoon=(s,M)=>{g.moonAz=s,g.moonEl=M,h.uMoonDir.value.set(Math.sin(s)*Math.cos(M),Math.sin(M),Math.cos(s)*Math.cos(M)),h.uMoonR3.value.set(-Math.cos(s),0,Math.sin(s)),h.uMoonU3.value.crossVectors(h.uMoonR3.value,h.uMoonDir.value).normalize()},g.setRoad=(s,M,D)=>{h.uApex.value.set(s,M),h.uRoadDir.value.set(Math.sin(D),Math.cos(D))};const C=new o.Vector3;return g.update=(s,M,D)=>{if(h.uTime.value=M,h.uBarT.value=.2*mt*M,D){C.setFromMatrixPosition(D.matrixWorld);for(const Y of k)Y.position.set(C.x,h.uSeaY.value,C.z),Y.parent&&(Y.parent.updateWorldMatrix(!0,!1),Y.parent.worldToLocal(Y.position))}},g.ribbon=_e,g.setMoon(0,2*mt),g}function _e(b,v=.1){const n=[],e=[],m=[],p=[],c=[],d=f=>f.isVector3?[f.x,f.y,f.z]:f;for(const f of b){const h=f.length;if(h<2)continue;const P=n.length/3;for(let T=0;T<h;T++){const g=d(f[T]),A=d(f[Math.max(T-1,0)]),I=d(f[Math.min(T+1,h-1)]);for(const z of[-1,1])n.push(g[0],g[1],g[2]),e.push(I[0]-A[0],I[1]-A[1],I[2]-A[2]),m.push(z),p.push(g[3]??v);if(T<h-1){const z=P+T*2;c.push(z,z+1,z+2,z+1,z+3,z+2)}}}const B=new o.BufferGeometry;return B.setAttribute("position",new o.Float32BufferAttribute(n,3)),B.setAttribute("aTan",new o.Float32BufferAttribute(e,3)),B.setAttribute("aSide",new o.Float32BufferAttribute(m,1)),B.setAttribute("aW",new o.Float32BufferAttribute(p,1)),B.setIndex(c),B}function Ge(b,v,n){const e=[],m=[],p=[],c=n.shuffle([-11.3,-3.8,3.8,11.3]);for(let f=0;f<4;f++){const h=1500+f*480+n.range(-80,80),P=(c[f]+n.range(-.5,.5))*mt,T=n.range(2,2.8),g=h*Math.tan(T*mt),A=h*Math.tan(T*n.range(.78,.95)*mt),I=Math.sin(P)*h,z=-Math.cos(P)*h,k=n.sign(),C=n.range(.12,.5),s=n.range(.42,.6),M=n.range(-.035,.035),D=[[-1,0],[-.965,1-M],[C-.012,1+M*C],[C+.012,s],[.97,s*(1-.6*M)],[1,0]],Y=e.length/3;for(let V=0;V<D.length;V++){const R=D[V][0]*k,U=I+R*g*Math.cos(P),E=z+R*g*Math.sin(P);if(e.push(U,0,E,U,D[V][1]*A,E),V<D.length-1){const H=Y+V*2;m.push(H,H+2,H+1,H+1,H+2,H+3)}}p.push({position:new o.Vector3(I,A*.5,z),halfWidth:g,height:A})}const d=new o.BufferGeometry;d.setAttribute("position",new o.Float32BufferAttribute(e,3)),d.setIndex(m);const B=new o.Mesh(d,v.ink(!1,{side:o.DoubleSide}));return B.frustumCulled=!1,{mesh:B,list:p}}async function Ye(b,v={}){const n=v.style||qe(b,{...v,crescent:!!v.crescent});await b.yield();const e=b.rng,m=v.detail??b.quality?.detail??1,p=v.duration??42,c=new o.Group,d=[];v.sky!==!1&&(c.add(n.makeSky()),c.add(n.makeSeaDepth())),await b.yield();const B=Ge(b,n,e.fork("islands"));c.add(B.mesh),await b.yield();const f=new o.Vector3,h=await ze(b,n,e.fork("fleet"),{...v,detail:m});c.add(h.mesh),await b.yield();const P=await Ue(b,n,e.fork("terns"),{...v,detail:m});c.add(P.mesh),await b.yield();const T=v.stragglers?await ze(b,n,e.fork("stragglers"),{...v,...v.stragglers,detail:m}):null;if(T&&c.add(T.mesh),v.demo){const V=new o.IcosahedronGeometry(5.5,1),R=V.attributes.position;for(let S=0;S<R.count;S++){const q=.75+.4*b.noise.n3(R.getX(S)*.2,R.getY(S)*.2,R.getZ(S)*.2);R.setXYZ(S,R.getX(S)*q,R.getY(S)*q*.8,R.getZ(S)*q)}V.computeVertexNormals();const U=new o.Mesh(V,n.land());U.position.set(3,1.2,-92),c.add(U);const E=[];for(let S=0;S<=24;S++){const q=S/24*Math.PI;E.push([3+Math.cos(q)*6.2,1.2+Math.sin(q)*5,-92.5])}c.add(new o.Mesh(n.ribbon([E],.1),n.line()));const H=new o.Mesh(new o.PlaneGeometry(6,6),n.pattern(.75,[60,60],{side:o.DoubleSide}));H.position.set(-9,3.5,-96),c.add(H)}const g={position:new o.Vector3(19,0,123),rotationY:Math.PI+12*mt},A=Math.cos(12*mt),I=Math.sin(12*mt),z=(V,R,U)=>new o.Vector3(-(V-19)*A+(U-123)*I,R,-((V-19)*I+(U-123)*A)),k=[[0,0],[0,75],[5.5,104],[12,128],[41.5,188.5],[71,249],[95,275],[127.6,284.4],[170,284.2],[212,284]].map(V=>z(V[0],3.2,V[1])),C=!!v.demo;let s=-1,M=0;const D=c.matrixWorld.elements,Y={object:c,radius:50,height:C?5:10,center:new o.Vector3(0,C?1.3:3,-190),ground:!1,groundY:0,style:n,anchors:{roadApex:new o.Vector3(0,0,0),roadAxis:new o.Vector3(0,0,-1),moonAzimuthLocal:new o.Vector3(0,0,-1),islands:B.list,fleetLane:h.lane,terns:P.info,placement:g,flyThrough:k,portalSeat:{position:z(212,0,284),facing:z(211,0,284).sub(z(212,0,284)).normalize()},viewpoints:{entry:z(0,3.2,0),reveal:z(12,3.2,128),core:z(47,3.2,200),ternsOverhead:z(59,3.2,225),bearAway:z(71,3.2,249)},moonElevationAt:V=>(v.moonEl?v.moonEl(V*42):-1+10.5*V)*mt},setProgress(V){s=Math.min(Math.max(V,0),1)},update(V,R,U){c.updateWorldMatrix(!0,!1);const E=Math.atan2(-D[8],-D[10]);M=s>=0?s*p:R%p,n.setRoad(D[12],D[14],E),n.setMoon(E,(v.moonEl?v.moonEl(M*(42/p)):-1+.25*M*(42/p))*mt),n.uniforms.uSeaY.value=D[13],n.update(V,R,U),U&&(f.setFromMatrixPosition(U.matrixWorld),c.worldToLocal(f),h.uCamL.value.copy(f),P.uCamL.value.copy(f),T&&T.uCamL.value.copy(f)),P.uT.value=M,h.uT.value=M,T&&(T.uT.value=M);for(const H of d)H.update(V,R,M,U)},async fleetBerth(V){const R={fleet:await h.berth(b,V,T?[T.F]:[]),stragglers:T?await T.berth(b,V,[h.F]):null};return delete V.tab,Y.anchors.fleetBerth=R,R},dispose(){n.uniforms.uMaria.value.dispose()}};return Y}function Ne(b){const v=[],n=[],e=[],m=[],p=(y,w,O)=>(v.push(y[0],y[1],y[2]),n.push(w),e.push(O[0],O[1],O[2],O[3]),v.length/3-1),c=[-4.5,-2.3,.8,3,4.55],d=[.95,1.36,1.3,.8,.02],B=[1.08,.9,.92,1.12,1.5],f=[0,.3,0],h=(y,w,O,tt)=>{const Z=[w[0]-y[0],w[1]-y[1],w[2]-y[2]],at=[tt[0]-y[0],tt[1]-y[1],tt[2]-y[2]],st=[Z[1]*at[2]-Z[2]*at[1],Z[2]*at[0]-Z[0]*at[2],Z[0]*at[1]-Z[1]*at[0]],pt=st[0]*(y[0]-f[0])+st[1]*(y[1]-f[1])+st[2]*(y[2]-f[2])>=0,Q=[y,w,O,tt].map(Lt=>p(Lt,0,[0,0,0,0]));pt?m.push(Q[0],Q[1],Q[2],Q[0],Q[2],Q[3]):m.push(Q[0],Q[2],Q[1],Q[0],Q[3],Q[2])},P=c.map((y,w)=>{const O=w===4?4.05:y,tt=d[w]*.68;return{DR:[y,B[w],d[w]],DL:[y,B[w],-d[w]],WR:[O,-.3,tt],WL:[O,-.3,-tt]}}),T=(y,w,O)=>[y[0]+(w[0]-y[0])*O,y[1]+(w[1]-y[1])*O,y[2]+(w[2]-y[2])*O],g=(y,w,O,tt)=>{h(y,w,T(w,O,.69),T(y,tt,.69)),h(T(y,tt,.76),T(w,O,.76),O,tt)};for(let y=0;y<4;y++){const w=P[y],O=P[y+1];g(w.WR,O.WR,O.DR,w.DR),g(w.WL,O.WL,O.DL,w.DL),h(w.DR,O.DR,O.DL,w.DL)}h(P[0].WL,P[0].WR,P[0].DR,P[0].DL);const A=b==="lateen",I=A?[4.4,1.25]:[3.3,1.55],z=A?[-4.1,1.9]:[-4,1.95],k=A?[3.9,1.9]:[2.5,7.4],C=A?[-3.3,11.6]:[-2.9,10.5],s=6,M=5,D=.8,Y=y=>(D-y)*.2+.12,V=(y,w,O,tt)=>{const Z=I[0]+(z[0]-I[0])*y,at=I[1]+(z[1]-I[1])*y+tt*y*(1-w),st=k[0]+(C[0]-k[0])*y,pt=k[1]+(C[1]-k[1])*y,Q=Z+(st-Z)*w,Lt=at+(pt-at)*w-.35*Math.sin(Math.PI*y)*(1-w)*(1-w);return[Q-O*.25*Math.sin(Math.PI*w)*y,Lt,Y(Q)+O*Math.sin(Math.PI*Math.min(y*1.15,1))*Math.sin(Math.PI*(.12+.8*w))]},R=(y,w,O)=>{const tt=v.length/3;for(let Z=0;Z<=O;Z++)for(let at=0;at<=s;at++){const st=y+(w-y)*Z/O,pt=V(at/s,st,.95,0),Q=V(at/s,st,.3,.35);p(pt,1,[Q[0]-pt[0],Q[1]-pt[1],Q[2]-pt[2],0])}for(let Z=0;Z<O;Z++)for(let at=0;at<s;at++){const st=tt+Z*(s+1)+at;m.push(st,st+1,st+s+2,st,st+s+2,st+s+1)}};R(0,.27,2),R(.292,1,M-1);const U=(y,w,O)=>{const tt=[w[0]-y[0],w[1]-y[1],w[2]-y[2]],Z=[p(y,2,[...tt,-O]),p(y,2,[...tt,O]),p(w,2,[...tt,-O]),p(w,2,[...tt,O])];m.push(Z[0],Z[1],Z[2],Z[1],Z[3],Z[2])};U([D,.95,0],[D,A?8.2:11.2,0],.1),U([4.35,1.5,0],[6.6,1.86,0],.06);const E=[C[0]-k[0],C[1]-k[1]],H=Math.hypot(E[0],E[1]),S=[k[0]-E[0]/H*.6,k[1]-E[1]/H*.6],q=[C[0]+E[0]/H*.5,C[1]+E[1]/H*.5];U([S[0],S[1],Y(S[0])-.1],[q[0],q[1],Y(q[0])-.1],.085);for(let y=0;y<6;y++){const w=[p([0,.04,-.13],3,[y,-1,0,0]),p([0,.04,.13],3,[y,-1,0,0]),p([0,.04,-.13],3,[y,1,0,0]),p([0,.04,.13],3,[y,1,0,0])];m.push(w[0],w[1],w[2],w[1],w[3],w[2])}const X=new o.InstancedBufferGeometry;return X.setAttribute("position",new o.Float32BufferAttribute(v,3)),X.setAttribute("aPart",new o.Float32BufferAttribute(n,1)),X.setAttribute("aAux",new o.Float32BufferAttribute(e,4)),X.setIndex(m),X}const le=[2,.13,40],St=[.1,.07],ce=[.12,.06],ue=[26,14],Et=b=>Number.isInteger(b)?b.toFixed(1):String(b),ge=`
attribute float aPart; attribute vec4 aAux; attribute vec4 aBoat; attribute vec4 aBoat2;
uniform float uTime; uniform float uT; uniform float uPx; uniform vec4 uLane; uniform vec2 uLaneDim; uniform vec3 uCamL; uniform vec2 uThin; uniform vec2 uFleetOpt;
varying float vPart; varying vec3 vDir;
void main(){
  vPart = aPart;
  float ph = aBoat.z, sz = aBoat2.w;
  vec3 p = position;
  bool isSail = aPart > 0.5 && aPart < 1.5, isRib = aPart > 1.5 && aPart < 2.5, isWake = aPart > 2.5;
  if (isSail) p += aAux.xyz * (0.5 + 0.5 * sin(uTime * 0.8 + ph * 31.0));
  if (isWake) { float s = (aAux.x + fract(uTime * uLaneDim.y / 2.4 + ph * 5.0)) * 2.4; p.x = -4.9 - s + aAux.y * 0.85 * max(1.0 - s / 14.4, 0.0); }
  if (isWake && uLaneDim.y < 0.05) p = vec3(0.0);                      // a boat lying hove-to drags no wake
  p *= sz;
  float roll = isWake ? 0.0 : ${Et(St[0])} + ${Et(St[1])} * sin(uTime * 0.9 + ph * 17.0);
  float cr = cos(roll), sr = sin(roll);
  p = vec3(p.x, p.y * cr - p.z * sr, p.y * sr + p.z * cr);
  if (!isWake) p.y += ${Et(ce[0])} * sin(uTime * 0.9 + ph * 17.0 + 1.3) + ${Et(ce[1])} * p.x * sin(uTime * 0.9 + ph * 17.0 + 2.6);
  vec2 d0 = uLane.zw; vec2 n0 = vec2(-d0.y, d0.x);
  float cy = cos(aBoat2.x), sy = sin(aBoat2.x);
  vec2 dir = vec2(d0.x * cy - d0.y * sy, d0.x * sy + d0.y * cy);
  float s = mod(aBoat.x + uT * uLaneDim.y + ${Et(le[0])} * sin(uT * ${Et(le[1])} + ph * ${Et(le[2])}), uLaneDim.x);   // her place: by the journey's seconds
  vec2 c = uLane.xy + d0 * s + n0 * aBoat.y;
  vec3 fw = vec3(dir.x, 0.0, dir.y), rt = vec3(-dir.y, 0.0, dir.x);
  vec3 lp = vec3(c.x, 0.0, c.y) + fw * p.x + vec3(0.0, p.y, 0.0) + rt * p.z;
  float edge = fract(ph * 7.0 + 0.11) > uFleetOpt.x ? min(s - uThin.x, uThin.y - s) : min(s, uLaneDim.x - s);   // four boats in five keep to the near part of the lane, so the far road and the islands stay readable
  lp.y -= (1.0 - clamp(edge / ${Et(ue[0])}, 0.0, 1.0)) * ${Et(ue[1])} * sz;          // at the lane's two ends a boat comes up out of the sea, the waterline crossing it
  vec4 mv = modelViewMatrix * vec4(lp, 1.0);
  if (isRib) {
    vec3 t3 = fw * aAux.x + vec3(0.0, aAux.y, 0.0) + rt * aAux.z;
    vec3 t = mat3(modelViewMatrix) * t3; t = t / max(length(t), 1e-5);
    vec3 v = mv.xyz / max(length(mv.xyz), 1e-5);
    vec3 sd = cross(t, v); sd = sd / max(length(sd), 1e-4);
    float rw = length(mv.xyz) > uFleetOpt.y ? 0.0 : max(abs(aAux.w) * sz, 0.78 * max(-mv.z, 0.0) / max(uPx, 1.0));   // beyond 170 m a boat is hull and sail only
    mv.xyz += sd * sign(aAux.w) * rw;
  }
  vDir = mat3(modelMatrix) * (lp - uCamL);
  gl_Position = projectionMatrix * mv;
}`,Me=`uniform vec3 uK; uniform vec3 uW; uniform vec3 uMoonDir; uniform float uMoonTan; uniform float uPass; uniform float uFleetSolid; varying float vPart; varying vec3 vDir;
void main(){
  if (vPart < 0.5 && !gl_FrontFacing) discard;
  vec3 d = vDir / max(length(vDir), 1e-4);
  bool onDisc = uFleetSolid > 0.5 && d.y > 0.0 && dot(d, uMoonDir) > inversesqrt(1.0 + uMoonTan * uMoonTan);
  if (uPass < 0.5) { if (onDisc) discard; gl_FragColor = vec4(uK + uW, 1.0); }
  else { if (!onDisc) discard; gl_FragColor = vec4(uK, 1.0); }
}`;async function ze(b,v,n,e){const m=e.cast||(n()<.7?"lug":"lateen"),p=Ne(m),c=(e.slant??n.range(17,24))*mt,d=new o.Vector2(Math.sin(c),-Math.cos(c)),B=new o.Vector2(-d.y,d.x),f=e.crossing||new o.Vector3(-14,0,-100),h=e.astern??60,P=e.length??760,T=e.width??120,g=new o.Vector2(f.x,f.z).addScaledVector(d,-h),A=e.place?e.place.length:Math.max(40,Math.round((e.fleetCount??200)*e.detail*(e.density??1))),I=5,z=Math.ceil(A/I),k=new Float32Array(A*4),C=new Float32Array(A*4);for(let S=0;S<A;S++){const q=S%I,X=Math.floor(S/I),y=((q+.5)/I-.5)*T+n.range(-7,7);k[S*4]=(X+.1+q*2%I/I)/z*P+(e.fleetShift??0)+n.range(-5,5)+y*d.y/(Math.abs(d.x)>.3?d.x:1e9),k[S*4+1]=y,k[S*4+2]=n(),k[S*4+3]=0,C[S*4]=n.range(-.07,.07),C[S*4+3]=n.range(.86,1.18)*(e.boatScale??1),e.place?(k[S*4]=e.place[S][0],k[S*4+1]=e.place[S][1]):e.keep&&(k[S*4]<e.keep[0]||k[S*4]>e.keep[1])&&(C[S*4+3]=0),S%64===63&&await b.yield()}p.setAttribute("aBoat",new o.InstancedBufferAttribute(k,4)),p.setAttribute("aBoat2",new o.InstancedBufferAttribute(C,4)),p.instanceCount=A;const s=v.uniforms,M={value:new o.Vector3(0,1e4,0)},D={value:0},Y=S=>({uK:s.uK,uW:s.uW,uPx:s.uPx,uTime:s.uTime,uT:D,uLane:{value:new o.Vector4(g.x,g.y,d.x,d.y)},uLaneDim:{value:new o.Vector2(P,e.speed??6)},uCamL:M,uThin:{value:new o.Vector2(e.thin?e.thin[0]:0,e.thin?e.thin[1]:330)},uFleetOpt:{value:new o.Vector2(e.allThin?-1:.2,e.ribFar??170)},uMoonDir:s.uMoonDir,uMoonTan:s.uMoonTan,uPass:{value:S},uFleetSolid:{value:e.crescent?0:1}}),V=new o.ShaderMaterial({uniforms:Y(0),vertexShader:ge,fragmentShader:Me,side:o.DoubleSide,...oe}),R=new o.Mesh(p,V);R.frustumCulled=!1,R.renderOrder=2;const U=new o.Mesh(p,new o.ShaderMaterial({uniforms:Y(1),vertexShader:ge,fragmentShader:Me,side:o.DoubleSide,transparent:!0,depthWrite:!1}));U.frustumCulled=!1,U.renderOrder=2,R.add(U);const E={origin:new o.Vector3(g.x,0,g.y),direction:new o.Vector3(d.x,0,d.y),normal:new o.Vector3(B.x,0,B.y),length:P,width:T,speed:e.speed??6,cast:m,count:A},H={g:p,a1:k,a2:C,N:A,origin:g,dir:d,length:P,speed:e.speed??6,thin:[e.thin?e.thin[0]:0,e.thin?e.thin[1]:330],optX:e.allThin?-1:.2};return{mesh:R,lane:E,uCamL:M,uT:D,F:H,berth:async(S,q,X)=>(R.userData.berthSpec=q,R.userData.berth=await je(S,H,q,X)),update(){}}}const fe=b=>{const v=b.slice().sort((c,d)=>c[0]-d[0]||c[1]-d[1]),n=(c,d,B)=>(d[0]-c[0])*(B[1]-c[1])-(d[1]-c[1])*(B[0]-c[0]),e=[],m=[];for(const c of v){for(;e.length>=2&&n(e[e.length-2],e[e.length-1],c)<=0;)e.pop();e.push(c)}for(let c=v.length-1;c>=0;c--){const d=v[c];for(;m.length>=2&&n(m[m.length-2],m[m.length-1],d)<=0;)m.pop();m.push(d)}e.pop(),m.pop();const p=[];for(const c of e.concat(m))p.push(c[0],c[1]);return p},Se=(b,v,n,e,m,p)=>{const c=m-n,d=p-e,B=c*c+d*d;let f=B>0?((b-n)*c+(v-e)*d)/B:0;f=f<0?0:f>1?1:f;const h=b-n-c*f,P=v-e-d*f;return h*h+P*P},He=(b,v,n,e,m,p)=>{let c=0;for(let d=0;d<e;d++){const B=(d+1)%e,f=(n[B*2]-n[d*2])*(v-p-n[d*2+1])-(n[B*2+1]-n[d*2+1])*(b-m-n[d*2]);if(f!==0){if(c===0)c=f>0?1:-1;else if((f>0?1:-1)!==c)return!1}}return!0},jt=(b,v,n,e,m,p)=>{if(He(b,v,n,e,m,p))return 0;let c=1/0;for(let d=0;d<e;d++){const B=(d+1)%e,f=Se(b,v,m+n[d*2],p+n[d*2+1],m+n[B*2],p+n[B*2+1]);f<c&&(c=f)}return Math.sqrt(c)},me=(b,v,n,e,m,p,c,d)=>{let B=1/0;for(let f=0;f<v;f++){const h=jt(n+b[f*2],e+b[f*2+1],m,p,c,d);h<B&&(B=h)}for(let f=0;f<p;f++){const h=jt(c+m[f*2],d+m[f*2+1],b,v,n,e);h<B&&(B=h)}if(B===0)return 0;for(let f=0;f<v;f++){const h=(f+1)%v,P=n+b[f*2],T=e+b[f*2+1],g=n+b[h*2],A=e+b[h*2+1];for(let I=0;I<p;I++){const z=(I+1)%p,k=c+m[I*2],C=d+m[I*2+1],s=c+m[z*2],M=d+m[z*2+1],D=(g-P)*(C-T)-(A-T)*(k-P),Y=(g-P)*(M-T)-(A-T)*(s-P),V=(s-k)*(T-C)-(M-C)*(P-k),R=(s-k)*(A-C)-(M-C)*(g-k);if(D*Y<0&&V*R<0)return 0}}return B},Te=b=>{const v=b.attributes.position.array,n=b.attributes.aPart.array,e=[];for(let m=0;m<n.length;m++)if(n[m]<.5)for(const p of[St[0]-St[1],St[0]+St[1]])e.push([v[m*3],v[m*3+1]*Math.sin(p)+v[m*3+2]*Math.cos(p)]);return fe(e)};async function je(b,v,n,e=[]){const{g:m,a1:p,a2:c,N:d}=v,B={shifted:[],unbuilt:[],boats:d};if(!n)return B;const f=n.hull,h=n.body,P=n.clear,T=n.grain,g=n.reach,A=n.steps,I=n.duration,z=Math.round(I*A),[k,C,s]=le,M=v.dir.x,D=v.dir.y,Y=-D,V=M,R=v.length,U=v.speed,E=v.thin[0],H=v.thin[1],S=n.own,q=n.course,X=q.pts,y=X.length/3,w=U+k*C,O=n.routeLen/I,tt=O+S.aheadRate,Z=S.sideRate,at=m.attributes.position.array,st=m.attributes.aPart.array,pt=m.attributes.aAux.array,Q=m.index.array,Lt=at.length/3,he=St[0]-St[1],ne=St[0]+St[1],Kt=[he,St[0],ne],it=new Float64Array(Lt*6);for(let t=0;t<Lt;t++){const a=st[t]>.5&&st[t]<1.5;let u=1/0,i=1/0,l=1/0,W=-1/0,F=-1/0,_=-1/0,ot=0;for(let K=0;K<=(a?1:0);K++){const dt=at[t*3]+K*pt[t*4],nt=at[t*3+1]+K*pt[t*4+1],ct=at[t*3+2]+K*pt[t*4+2];ot=Math.max(ot,Math.hypot(nt,ct)),u=Math.min(u,dt),W=Math.max(W,dt);for(const Vt of Kt){const kt=Math.cos(Vt),Ht=Math.sin(Vt),zt=nt*kt-ct*Ht,rt=nt*Ht+ct*kt;i=Math.min(i,zt),F=Math.max(F,zt),l=Math.min(l,rt),_=Math.max(_,rt)}}const $=ot*(1-Math.cos(St[1]/2));it.set([u,i-$,l-$,W,F+$,_+$],t*6)}const ut=[],Tt=(t,a,u,i)=>{for(let l=0;l<3;l++){const W=i==null?it[a*6+l]:it[a*6+l]+(it[i*6+l]-it[a*6+l])*u,F=i==null?it[a*6+3+l]:it[a*6+3+l]+(it[i*6+3+l]-it[a*6+3+l])*u;t[l]=Math.min(t[l],W),t[l+3]=Math.max(t[l+3],F)}},At=()=>[1/0,1/0,1/0,-1/0,-1/0,-1/0],Qt=At();for(let t=0;t<Q.length;t+=6){const a=st[Q[t]];if(a<.5)for(let u=0;u<6;u++)Tt(Qt,Q[t+u]);else if(a<1.5){const u=At();for(let i=0;i<6;i++)Tt(u,Q[t+i]);ut.push(u)}else if(a<2.5){const u=Q[t],i=Q[t+2],l=Math.abs(pt[u*4+3]);for(let W=0;W<4;W++){const F=At();Tt(F,u,W/4,i),Tt(F,u,(W+1)/4,i);for(let _=0;_<3;_++)F[_]-=l,F[_+3]+=l;ut.push(F)}}}ut.push(Qt);const wt=Te(m),vt=wt.length/2;let Ut=0,qt=0,Yt=0;for(let t=0;t<vt;t++)Ut=Math.max(Ut,Math.hypot(wt[t*2],wt[t*2+1]));for(const t of ut){qt=Math.max(qt,Math.hypot(Math.max(Math.abs(t[0]),Math.abs(t[3])),Math.max(Math.abs(t[2]),Math.abs(t[5]))));for(const a of[t[0],t[3]])for(const u of[t[2],t[5]])Yt=Math.max(Yt,jt(a,u,wt,vt,0,0))}const x=n.ownOutline||(n.ownOutline=fe(S.hull)),j=x.length/2;let G=0;for(let t=0;t<j;t++)G=Math.max(G,Math.hypot(x[t*2],x[t*2+1]));const L=n.tab||(n.tab={lx:new Float64Array(z+1).fill(NaN),ly:new Float64Array(z+1),lz:new Float64Array(z+1),iA:new Float64Array(z+1),iB:new Float64Array(z+1),mx:new Float64Array(z+1),mz:new Float64Array(z+1),side:new Float64Array(z+1),px:new Float64Array(z+1).fill(NaN),pz:new Float64Array(z+1),pfx:new Float64Array(z+1),pfz:new Float64Array(z+1),o:{}}),J=[0,0,0],ft=t=>{const a=Math.min(Math.max(Math.floor(t),0),y-2),u=Math.min(Math.max(t-a,0),1);return J[0]=X[a*3]+(X[a*3+3]-X[a*3])*u,J[1]=X[a*3+1]+(X[a*3+4]-X[a*3+1])*u,J[2]=X[a*3+2]+(X[a*3+5]-X[a*3+2])*u,J},bt=t=>{if(L.lx[t]===L.lx[t])return;const a=t/A/I,u=a*n.routeLen,i=L.o;S.keys(a,i);const l=u+i.ahead;L.iA[t]=(Math.min(u,l+S.stern,t===0?q.from:u)-q.from)/q.step,L.iB[t]=(Math.max(u,l+S.bow)-q.from)/q.step,ft((l-q.from)/q.step),L.mx[t]=J[0],L.mz[t]=J[2],L.side[t]=Math.abs(i.side),ft((u-q.from)/q.step),L.lx[t]=J[0],L.ly[t]=J[1],L.lz[t]=J[2]},$t=t=>{if(L.px[t]!==L.px[t]){const a=L.o;S.pose(t/A/I,a),L.px[t]=a.x,L.pz[t]=a.z,L.pfx[t]=a.fx,L.pfz[t]=a.fz}},gt=S.ahead+S.bow,r={i:0,a:0,ac:0,ph:0,sz:0,fx:0,fz:0,rx:0,rz:0,thinned:!0,poly:new Float64Array(vt*2),Rh:0,Rb:0,Eb:0,cx:0,cz:0,s:0,edge:0},Xt=t=>{const a=c[t*4],u=Math.cos(a),i=Math.sin(a),l=c[t*4+3];r.i=t,r.a=p[t*4],r.ac=p[t*4+1],r.ph=p[t*4+2],r.sz=l,r.fx=M*u-D*i,r.fz=M*i+D*u,r.rx=-r.fz,r.rz=r.fx;const W=Math.fround(Math.fround(r.ph*7)+Math.fround(.11));r.thinned=W-Math.floor(W)>v.optX;for(let F=0;F<vt;F++)r.poly[F*2]=(r.fx*wt[F*2]+r.rx*wt[F*2+1])*l,r.poly[F*2+1]=(r.fz*wt[F*2]+r.rz*wt[F*2+1])*l;r.Rh=Ut*l,r.Rb=qt*l,r.Eb=Yt*l},Rt=(t,a)=>{const u=a/A,i=t+U*u+k*Math.sin(C*u+s*r.ph),l=i-R*Math.floor(i/R);r.s=l,r.cx=v.origin.x+M*l+Y*r.ac,r.cz=v.origin.y+D*l+V*r.ac,r.edge=r.thinned?Math.min(l-E,H-l):Math.min(l,R-l)},te=()=>{const t=r.thinned?r.s<=E?E-r.s:R-r.s+E:0;return Math.max(1,Math.floor(t/Math.max(w,1e-6)*A))},_t=t=>Math.max(1,Math.floor(Math.min(t,r.thinned?1/0:(R-r.s)/Math.max(w,1e-6))*A)),ee=t=>{const a=L.iB[t],u=f*f;for(let i=L.iA[t];i<a;){ft(i);const l=J[0],W=J[2],F=jt(l,W,r.poly,vt,r.cx,r.cz);if(F<f)return!0;const _=(F-f)/q.step;if(_>=1){i=Math.min(i+_,a);continue}const ot=Math.min(Math.floor(i)+1,a);ft(ot);for(let $=0;$<vt;$++)if(Se(r.cx+r.poly[$*2],r.cz+r.poly[$*2+1],l,W,J[0],J[2])<u)return!0;i=ot}return ft(a),jt(J[0],J[2],r.poly,vt,r.cx,r.cz)<f},re=t=>{const a=L.iB[t];let u=1/0;for(let i=L.iA[t];;){ft(i);const l=jt(J[0],J[2],r.poly,vt,r.cx,r.cz);if(l<f)return l-f;if(i>=a)return Math.min(u,l)-f;const W=Math.min(Math.max(.5*(l-f),.5),(a-i)*q.step);u=Math.min(u,l-W),i+=W/q.step}},N=t=>{const a=L.lx[t]-r.cx,u=L.lz[t]-r.cz;if(Math.hypot(a,u)>r.Rb+h)return!1;const i=r.sz,l=a*r.fx+u*r.fz,W=a*r.rx+u*r.rz,F=L.ly[t]+(1-Math.min(Math.max(r.edge/ue[0],0),1))*ue[1]*i;for(const _ of ut){const ot=ce[0]+ce[1]*i*Math.max(Math.abs(_[0]),Math.abs(_[3])),$=Math.max(_[0]*i-l,0,l-_[3]*i),K=Math.max(_[1]*i-ot-F,0,F-_[4]*i-ot),dt=Math.max(_[2]*i-W,0,W-_[5]*i);if($*$+K*K+dt*dt<h*h)return!0}return!1},et=new Float64Array(j*2),ht=t=>{if($t(t),Math.hypot(L.px[t]-r.cx,L.pz[t]-r.cz)>r.Rh+G+P)return!1;const a=L.pfx[t],u=L.pfz[t];for(let i=0;i<j;i++)et[i*2]=u*x[i*2]+a*x[i*2+1],et[i*2+1]=-a*x[i*2]+u*x[i*2+1];return me(r.poly,vt,r.cx,r.cz,et,j,L.px[t],L.pz[t])<P},Mt=t=>jt(L.mx[t],L.mz[t],r.poly,vt,r.cx,r.cz)-L.side[t]-G-P,Zt=t=>jt(L.lx[t],L.lz[t],r.poly,vt,r.cx,r.cz)-r.Eb-h,xt=(t,a)=>(Rt(t,a),r.edge<=0?0:(bt(a),ee(a)?1:N(a)?2:ht(a)?3:0));let yt=0,Gt=0;const Bt=async t=>{for(let a=0;a<=z;){if(Rt(t,a),r.edge<=0){a+=te();continue}bt(a),++Gt%256===0&&await b.yield();const u=Math.hypot(r.cx-L.lx[a],r.cz-L.lz[a])-gt-Math.max(r.Rh+Math.max(f,S.side+G+P),r.Rb+h);if(u>0){a+=_t(u/(w+O));continue}const i=re(a),l=Mt(a),W=Zt(a),F=Math.min(i/(w+tt),l/(w+tt+Z),W/(w+O));if(F*A>=1){a+=_t(F);continue}const _=i<=0&&ee(a)?1:W<=0&&N(a)?2:l<=0&&ht(a)?3:0;if(_)return yt=_,a;a++}return-1},Wt=(t,a,u,i)=>{const l=fe(a),W=l.length/2;let F=0,_=0,ot=0;for(let $=0;$<W;$++)F+=l[$*2]/W,_+=l[$*2+1]/W;for(let $=0;$<W;$++)ot=Math.max(ot,Math.hypot(l[$*2]-F,l[$*2+1]-_));return{name:t,o:l,n:W,cx:F,cz:_,R:ot,off:u,speed:i,x:0,z:0,lim:1/0}},Pt=[];(n.movers||[]).forEach((t,a)=>Pt.push(Wt("mover "+a,t.pts,(u,i)=>{const l=t.run(u);return i.x=t.dir[0]*l,i.z=t.dir[1]*l,0},t.speed))),(n.statics||[]).forEach((t,a)=>Pt.push(Wt("static "+a,t,null,0))),e.forEach((t,a)=>{const u=Te(t.g),i=t.dir.x,l=t.dir.y,W=t.length,F=t.speed,_=F+k*C,ot=t.thin[0],$=t.thin[1];for(let K=0;K<t.N;K++){const dt=t.a2[K*4+3];if(!(dt>0))continue;const nt=t.a2[K*4],ct=Math.cos(nt),Vt=Math.sin(nt),kt=i*ct-l*Vt,Ht=i*Vt+l*ct,zt=t.a1[K*4+1],rt=t.a1[K*4+2],Ft=[],ve=Math.fround(Math.fround(rt*7)+Math.fround(.11)),ke=ve-Math.floor(ve)>t.optX;for(let Ot=0;Ot<u.length;Ot+=2)Ft.push([(kt*u[Ot]-Ht*u[Ot+1])*dt,(Ht*u[Ot]+kt*u[Ot+1])*dt]);Pt.push(Wt("other fleet "+a+" boat "+K,Ft,(Ot,ae)=>{const pe=t.a1[K*4]+F*Ot+k*Math.sin(C*Ot+s*rt),It=pe-W*Math.floor(pe/W);return ae.x=t.origin.x+i*It-l*zt,ae.z=t.origin.y+l*It+i*zt,ke?It>ot&&It<$?(ae.lim=($-It)/_,0):(ae.lim=1/0,It<=ot?(ot-It)/_:(W-It+ot)/_):(ae.lim=(W-It)/_,0)},_))}});const lt=(t,a,u)=>{if(Rt(t,u),r.edge<=0)return 1/0;const i=a.off?a.off(u/A,a):0;if(i>0)return i*(w+a.speed);const l=Math.hypot(r.cx-a.cx-a.x,r.cz-a.cz-a.z)-r.Rh-a.R-P;return l>0?l:me(r.poly,vt,r.cx,r.cz,a.o,a.n,a.x,a.z)-P},Ct=async(t,a)=>{for(let u=0;u<=z;){const i=lt(t,a,u);if(i===1/0){u+=te();continue}if(i<0)return u;u+=_t(Math.min(i/(w+a.speed),a.lim)),++Gt%256===0&&await b.yield()}return-1},Dt=new Uint8Array(d),Nt=t=>t-R*Math.round(t/R);for(let t=0;t<d;t++){if(!(c[t*4+3]>0))continue;if(Xt(t),!r.thinned){Dt[t]=1;continue}const a=r.a-k,u=r.a+U*I+k;for(let i=-2;i<=2;i++)a+i*R<H&&u+i*R>E&&(Dt[t]=1)}const Jt=(t,a)=>{const u=c[a*4+3],i=Nt(p[a*4]-t),l=p[a*4+1]-r.ac;if(Math.abs(l)>r.Rh+Ut*u+P||Math.abs(i)>r.Rh+Ut*u+P+2*k)return!1;const W=c[a*4],F=Math.cos(W),_=Math.sin(W),ot=M*F-D*_,$=M*_+D*F,K=[];for(const nt of[-2*k,2*k])for(let ct=0;ct<vt;ct++)K.push([(ot*wt[ct*2]-$*wt[ct*2+1])*u+M*nt,($*wt[ct*2]+ot*wt[ct*2+1])*u+D*nt]);const dt=fe(K);return me(r.poly,vt,0,0,dt,dt.length/2,M*i+Y*l,D*i+V*l)<P};for(let t=0;t<d;t++){if(!Dt[t])continue;Xt(t);const a=r.a,u=await Bt(a);if(u<0){await b.yield();continue}const i=yt,l=[],W=[];let F=0,_=!1;for(const K of Pt){let dt=!1;for(let nt=0;nt<=z&&!dt;nt+=A)Rt(a,nt),K.off&&K.off(nt/A,K),dt=r.s<g||r.s>R-g||Math.hypot(r.cx-K.cx-K.x,r.cz-K.cz-K.z)-r.Rh-K.R-P-g-.5*(w+K.speed)<0;dt&&l.push(K)}const ot=[u,u],$=[null,null];for(let K=1;K*T<=g&&!_;K++)for(const dt of[1,-1]){const nt=Math.fround(a+dt*K*T),ct=dt>0?0:1;let Vt=!1;for(const rt of[0,A>>3,A>>2,A>>1])for(const Ft of rt?[ot[ct]-rt,ot[ct]+rt]:[ot[ct]])!Vt&&Ft>=0&&Ft<=z&&xt(nt,Ft)>0&&(Vt=!0,ot[ct]=Ft);if(Vt)continue;const kt=$[ct];if(kt&&(kt.m?lt(nt,kt.m,kt.k)<0:Jt(nt,kt.j))){F++;continue}const Ht=await Bt(nt);if(Ht>=0){ot[ct]=Ht;continue}let zt=null;for(let rt=0;rt<d&&!zt;rt++)rt!==t&&Dt[rt]&&Jt(nt,rt)&&(zt={j:rt,name:"boat "+rt});for(let rt=0;rt<l.length&&!zt;rt++){const Ft=await Ct(nt,l[rt]);Ft>=0&&(zt={m:l[rt],k:Ft,name:l[rt].name})}if(zt){$[ct]=zt,F++,W.length<8&&W.push([nt-a,zt.name]);continue}p[t*4]=nt,B.shifted.push({boat:t,from:a,by:nt-a,term:i,nTaken:F,taken:W}),_=!0;break}_||(c[t*4+3]=0,Dt[t]=0,B.unbuilt.push({boat:t,from:a,term:i,nTaken:F,taken:W})),await b.yield()}return m.attributes.aBoat.needsUpdate=!0,m.attributes.aBoat2.needsUpdate=!0,B}const Pe=`
attribute float aFlex; attribute vec3 aPerch; attribute vec4 aFly; attribute vec4 aOff;
uniform float uT; uniform float uTime; uniform float uPx; uniform vec3 uSpl[12]; uniform vec3 uSplLen; uniform vec3 uD0; uniform vec3 uCamL; uniform float uTernPx; uniform vec3 uStrandN; uniform float uStrandPx;
varying vec3 vDir;
vec3 bez(int k, float t){
  vec3 a = uSpl[k * 4], b = uSpl[k * 4 + 1], c = uSpl[k * 4 + 2], d = uSpl[k * 4 + 3];
  float tc = clamp(t, 0.0, 1.0), m = 1.0 - tc;
  vec3 p = a * (m * m * m) + b * (3.0 * m * m * tc) + c * (3.0 * m * tc * tc) + d * (tc * tc * tc);
  vec3 dv = (b - a) * (3.0 * m * m) + (c - b) * (6.0 * m * tc) + (d - c) * (3.0 * tc * tc);
  return p + dv * (t - tc);
}
vec3 posAt(float q, int k, float len, float blend){
  vec3 nrm = k == 2 ? uStrandN : vec3(-uD0.z, 0.0, uD0.x);              // the strand's tube lies across its own run-in, not across the ribbon's heading
  float wob = sin(q * 0.035 + aOff.z * 6.2831853);
  vec3 sp = bez(k, (q - aFly.z) / max(len, 1.0)) + nrm * (aOff.x + wob * 1.5) + vec3(0.0, aOff.y + wob, 0.0);
  vec3 lf = aPerch + uD0 * q + vec3(0.0, 14.0 * clamp(q / 50.0, 0.0, 1.0), 0.0);
  float w = clamp(q / max(blend, 1.0), 0.0, 1.0);
  return mix(lf, sp, w * w * (3.0 - 2.0 * w));
}
void main(){
  int k = int(aFly.y + 0.5);
  float len = k == 0 ? uSplLen.x : (k == 1 ? uSplLen.y : uSplLen.z);
  float blend = k == 2 ? 60.0 : 140.0;
  float tau = uT - aFly.x;
  float fly = step(0.0, tau);
  float q = max(tau, 0.0) * aFly.w;
  vec3 c = posAt(q, k, len, blend);
  vec3 fw = posAt(q + 1.5, k, len, blend) - c; fw = fw / max(length(fw), 1e-4);
  vec3 tc = uCamL - c; float dist = max(length(tc), 1e-3); tc /= dist;
  // a flat cut-out that always faces the viewer: its long axis is the line of flight as the viewer sees it; a bird
  // flying straight at us or away is drawn head up, so it is still a two-winged mark and never an edge-on stroke
  vec3 fp = fw - tc * dot(fw, tc); float fl = length(fp);
  vec3 upP = vec3(0.0, 1.0, 0.0) - tc * tc.y; upP = upP / max(length(upP), 1e-3);
  fp = mix(upP, fp / max(fl, 1e-4), smoothstep(0.12, 0.4, fl));
  float fpl = length(fp); fp = fpl > 1e-3 ? fp / fpl : vec3(1.0, 0.0, 0.0);
  vec3 rt = cross(fp, tc); rt = rt / max(length(rt), 1e-3);
  // the three held shapes: wings up, level, down (a perched bird holds the folded one)
  float shape = mod(floor(uTime * 3.0 + aOff.z * 3.0), 3.0);
  float up = shape < 0.5 ? 1.0 : (shape < 1.5 ? 0.0 : -0.65);
  vec2 g = position.xy;
  float f1 = step(0.5, aFlex) * step(aFlex, 1.5), f2 = step(1.5, aFlex);
  g.y += up * (0.08 * f1 + 0.24 * f2);
  g.x *= 1.0 - abs(up) * (0.05 * f1 + 0.2 * f2);
  g = mix(vec2(g.x * 0.28, g.y * 0.8), g, fly);
  float least = (k == 2 ? mix(uTernPx, uStrandPx, fly) : uTernPx) * dist / (max(uPx, 1.0) * mix(2.4, 1.1, fly));   // (polish 2: a perched bird is a dot of the crest's dotted line)        // a flying bird is never under uTernPx pixels across the wings
  // (true 1, round 2) a bird of the strand is its own size or the strand's least size (uStrandPx), whichever is larger: far
  // off the sixty are a thread of small marks, and none is drawn larger for being far away
  float sc = k == 2 ? max(aOff.w, least) : max(1.0, least) * aOff.w;
  vec3 lp = c + (rt * g.x + fp * g.y) * sc;
  vDir = mat3(modelMatrix) * (lp - uCamL);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(lp, 1.0);
}`,De=`uniform vec3 uK; uniform vec3 uW; uniform vec3 uMoonDir; uniform float uMoonTan; uniform float uPass; uniform float uTernSolid;
varying vec3 vDir;
void main(){
  vec3 d = vDir / max(length(vDir), 1e-4);
  bool onDisc = uTernSolid > 0.5 && d.y > 0.0 && dot(d, uMoonDir) > inversesqrt(1.0 + uMoonTan * uMoonTan);
  if (uPass < 0.5) { if (onDisc) discard; gl_FragColor = vec4(uK + uW, 1.0); }
  else { if (!onDisc) discard; gl_FragColor = vec4(uK, 1.0); }
}`;function Ke(){const b=[],v=[],n=[],e=(g,A,I)=>(b.push(g,A,0),v.push(I),b.length/3-1);for(const g of[1,-1]){const A=e(.035*g,.1,0),I=e(.035*g,-.07,0),z=e(.26*g,.125,1),k=e(.25*g,0,1),C=e(.55*g,-.09,2);n.push(A,I,k,A,k,z,z,k,C)}const m=e(-.035,.1,0),p=e(.035,.1,0),c=e(.035,-.07,0),d=e(-.035,-.07,0),B=e(0,.26,0),f=e(0,-.07,0),h=e(-.06,-.29,0),P=e(.06,-.29,0);n.push(m,p,c,m,c,d,m,p,B,d,f,h,f,c,P);const T=new o.InstancedBufferGeometry;return T.setAttribute("position",new o.Float32BufferAttribute(b,3)),T.setAttribute("aFlex",new o.Float32BufferAttribute(v,1)),T.setIndex(n),T}async function Ue(b,v,n,e){const m=x=>x.isVector3?x.clone():new o.Vector3(x[0],x[1],x[2]),p=(e.crest||[[-139.5,30,-272],[-148,32,-232],[-156,30.5,-193],[-165,32,-152],[-173,30,-115]]).map(m),c=[0];for(let x=1;x<p.length;x++)c.push(c[x-1]+p[x].distanceTo(p[x-1]));const d=c[c.length-1],B=x=>{const j=x*d;let G=1;for(;G<p.length-1&&c[G]<j;)G++;return p[G-1].clone().lerp(p[G],(j-c[G-1])/Math.max(c[G]-c[G-1],.001))},f=e.liftAt??18,h=e.ternWave??3,P=30,T=(e.ternHeading?m(e.ternHeading):new o.Vector3(.84,0,-.545)).normalize(),g=new o.Vector3(0,1,0),A=p[p.length-1].clone().sub(p[0]).normalize(),I=Math.max(0,-A.dot(T))*d,z=p[0].clone().addScaledVector(g,12),k=(x,j,G)=>z.clone().addScaledVector(T,x).add(new o.Vector3(0,j,G)),C=n.range(.7,1.3),s=e.ternHeight??80,M=[z,k(110,(s-42)*.42,0),k(250,(s-42)*.92,-30*C),k(420,s-42,-90*C),z,k(110,(s-42)*.42+5,8),k(250,(s-42)*.92+7,-22*C),k(420,s-36,-70*C)],D=e.strandPoint?m(e.strandPoint):new o.Vector3(-18,13.5,-106),Y=e.strandAt??25,V=e.strandFrom??.5,R=B(V).addScaledVector(g,6),U=e.strandVia?e.strandVia.map(m):[R.clone().lerp(D,.34).setY(R.y-10),R.clone().lerp(D,.67).setY(D.y)];M.push(R,U[0],U[1],D.clone());const E=new o.Vector3().crossVectors(g,D.clone().sub(U[1]).setY(0));E.lengthSq()<1e-6&&E.set(1,0,0),E.normalize();const H=x=>{let j=0;const G=new o.Vector3,L=new o.Vector3,J=new o.CubicBezierCurve3(M[x*4],M[x*4+1],M[x*4+2],M[x*4+3]);J.getPoint(0,G);for(let ft=1;ft<=24;ft++)J.getPoint(ft/24,L),j+=G.distanceTo(L),G.copy(L);return j},S=new o.Vector3(H(0),H(1),H(2)),q=Math.max(40,Math.round((e.ternCount??5e3)*e.detail*(e.density??1))),X=Math.min(60,Math.max(Math.round(q*.012),e.strandCount??0)),y=Math.max(0,Math.min(60-X,Math.round(e.strandExtra??0))),w=q+y,O=X+y,tt=new Int32Array(w).fill(-1),Z=new Uint8Array(Math.max(O,1));for(let x=0;x<X;x++){const j=Math.floor(x*O/X);tt[x]=j,Z[j]=1}for(let x=q,j=0;x<w;x++){for(;Z[j];)j++;tt[x]=j,Z[j]=1}const at=e.strandWindow??[-2.5,2.5],st=e.strandRadius??9,pt=e.strandPerch??.1;let Q=null;const Lt=e.ternBig??0,he=Math.sign(D.clone().sub(z).dot(new o.Vector3(-T.z,0,T.x)))||1,ne=e.ternRadius??12,Kt=new Float32Array(w*3),it=new Float32Array(w*4),ut=new Float32Array(w*4);for(let x=0;x<w;x++){x===q&&(Q=n.fork("strand"));const j=tt[x]>=0,G=x>=q?Q:n,L=tt[x],J=j?Math.min(Math.max(V-pt+2*pt*(L+.5+10*G.range(-.04,.04))/O,0),1):G(),ft=B(J);Kt[x*3]=ft.x+G.range(-.5,.5),Kt[x*3+1]=ft.y+.25,Kt[x*3+2]=ft.z+G.range(-.5,.5);const bt=j?2:G()<.7?0:1,$t=P*G.range(.96,1.04),gt=!j&&G()<(e.ternTail??0)?h+(e.ternTailFor??16)*Math.pow(G(),1.4):0;it[x*4]=j?Y-S.z/$t+at[0]+(at[1]-at[0])*(L+.5+.5*G.range(-.7,.7))/O:f+(gt||h*J)+G.range(0,.5),it[x*4+1]=bt,it[x*4+2]=j?0:I*J,it[x*4+3]=$t;const r=(j?st:e.ternRadius??12)*Math.sqrt(G())*(j?.6+.4*G():.35+.65*G()),Xt=G.range(0,Math.PI*2);if(ut[x*4]=Math.cos(Xt)*r,ut[x*4+1]=Math.sin(Xt)*r*.8,ut[x*4+2]=G(),ut[x*4+3]=G.range(.9,1.12)*(j?e.strandScale??1:1),!j&&x<X+Lt){const Rt=(x-X+.5)/Lt;ut[x*4]=he*ne*(1.15+.9*(Rt*7%1)),ut[x*4+1]=ne*(.9*(Rt*3%1)-.75),ut[x*4+3]=2.1+.9*(Rt*5%1)}x%400===399&&await b.yield()}if(e.course){const x=e.course,j=e.berth??2,G=e.duration??42,L=Math.hypot(.55,.09),J=8,ft=new Map,bt=[1/0,1/0,1/0,-1/0,-1/0,-1/0],$t=(N,et)=>(Math.floor(N/J)+4096)*8192+Math.floor(et/J)+4096;for(let N=0;N<x.length;N+=3){const et=$t(x[N],x[N+2]);ft.has(et)||ft.set(et,[]),ft.get(et).push(N);for(let ht=0;ht<3;ht++)bt[ht]=Math.min(bt[ht],x[N+ht]),bt[ht+3]=Math.max(bt[ht+3],x[N+ht])}const gt=M.map(N=>[N.x,N.y,N.z]),r=[T.x,T.y,T.z],Xt=[-T.z,0,T.x],Rt=[E.x,E.y,E.z],te=[S.x,S.y,S.z],_t=[0,0,0],ee=(N,et,ht)=>{const Mt=it[N*4+1],Zt=(et-it[N*4+2])/Math.max(te[Mt],1),xt=Math.min(Math.max(Zt,0),1),yt=1-xt,Gt=gt[Mt*4],Bt=gt[Mt*4+1],Wt=gt[Mt*4+2],Pt=gt[Mt*4+3],lt=Math.sin(et*.035+ut[N*4+2]*6.2831853),Ct=Math.min(Math.max(et/(Mt===2?60:140),0),1),Dt=Ct*Ct*(3-2*Ct),Nt=Mt===2?Rt:Xt;let Jt=0;for(let t=0;t<3;t++){const a=Gt[t]*yt*yt*yt+Bt[t]*3*yt*yt*xt+Wt[t]*3*yt*xt*xt+Pt[t]*xt*xt*xt,u=(Bt[t]-Gt[t])*3*yt*yt+(Wt[t]-Bt[t])*6*yt*xt+(Pt[t]-Wt[t])*3*xt*xt,i=a+u*(Zt-xt)+Nt[t]*(ut[N*4]+lt*1.5)+(t===1?ut[N*4+1]+lt:0),l=Kt[N*3+t]+r[t]*et+(t===1?14*Math.min(Math.max(et/50,0),1):0);_t[t]=l+(i-l)*Dt,Jt+=(i-l)*(i-l)}return ht?Math.sqrt(Jt):0},re=N=>{const et=it[N*4+1],ht=it[N*4+3],Mt=L*ut[N*4+3]+.006,Zt=et===2?60:140,xt=Math.max(-it[N*4],0)*ht,yt=Math.max(G-it[N*4],0)*ht,Gt=3*Math.max(...[0,1,2].map(lt=>Math.hypot(gt[et*4+lt+1][0]-gt[et*4+lt][0],gt[et*4+lt+1][1]-gt[et*4+lt][1],gt[et*4+lt+1][2]-gt[et*4+lt][2])))/Math.max(te[et],1)+.0631;let Bt=0;for(let lt=xt;lt<Math.min(yt,Zt)+5;lt+=5)Bt=Math.max(Bt,ee(N,lt,!0));const Wt=Math.max(1.28,Gt)+1.5/Zt*(Bt+2.5*(1.28+Gt));let Pt=1/0;for(let lt=xt;;){ee(N,lt,!1);const Ct=_t[0],Dt=_t[1],Nt=_t[2],Jt=Math.max(bt[0]-Ct,0,Ct-bt[3]),t=Math.max(bt[1]-Dt,0,Dt-bt[4]),a=Math.max(bt[2]-Nt,0,Nt-bt[5]);let u=Math.hypot(Jt,t,a);if(u<j+Mt){u=J;for(let i=-1;i<=1;i++)for(let l=-1;l<=1;l++){const W=ft.get($t(Ct+i*J,Nt+l*J));if(W)for(const F of W)u=Math.min(u,Math.hypot(x[F]-Ct,x[F+1]-Dt,x[F+2]-Nt))}}if(Pt=Math.min(Pt,u-Mt),lt>=yt)break;lt=Math.min(lt+Math.max(.2,u-Mt-j)/Wt,yt)}return Pt};for(let N=0;N<w;N++){for(let et=re(N),ht=0;et<j&&ht<400;ht++)ut[N*4+1]+=Math.max(j-et,.001),et=re(N),await b.yield();await b.yield()}}const Tt=Ke();Tt.setAttribute("aPerch",new o.InstancedBufferAttribute(Kt,3)),Tt.setAttribute("aFly",new o.InstancedBufferAttribute(it,4)),Tt.setAttribute("aOff",new o.InstancedBufferAttribute(ut,4)),Tt.instanceCount=w;const At=v.uniforms,Qt={value:0},wt={value:new o.Vector3(0,5,0)},vt=x=>({uK:At.uK,uW:At.uW,uPx:At.uPx,uTime:At.uTime,uT:Qt,uCamL:wt,uSpl:{value:M},uSplLen:{value:S},uD0:{value:T},uTernPx:{value:e.ternPx??6.6},uStrandN:{value:E},uStrandPx:{value:e.strandPx??e.ternPx??6.6},uMoonDir:At.uMoonDir,uMoonTan:At.uMoonTan,uPass:{value:x},uTernSolid:{value:e.crescent?0:1}}),Ut=new o.ShaderMaterial({uniforms:vt(0),vertexShader:Pe,fragmentShader:De,side:o.DoubleSide,...oe}),qt=new o.Mesh(Tt,Ut);qt.frustumCulled=!1,qt.renderOrder=3;const Yt=new o.Mesh(Tt,new o.ShaderMaterial({uniforms:vt(1),vertexShader:Pe,fragmentShader:De,side:o.DoubleSide,transparent:!0,depthWrite:!1}));return Yt.frustumCulled=!1,Yt.renderOrder=3,qt.add(Yt),{mesh:qt,uT:Qt,uCamL:wt,info:{crest:p,liftAt:f,wave:h,speed:P,strandPoint:D,strandAt:Y,splines:M,count:w,strand:O}}}export{we as OB_GATE_GLSL,se as OB_GLSL,Ye as buildHero,_e as makeRibbon,qe as makeStyle};
