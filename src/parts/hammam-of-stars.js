import*as t from"three";const qt=["#F7F2E7","#E2DDD2","#D9A65C","#2E2925","#2F7F5C","#B96A3B","#7C8FA0"],V=55,ze=8.3,ye=32,ie=40,he=45,Ee=74.5,ae=15,Mt=26,ce=34,se=17,Me=.3,Pt=14,ue=2.5,Ye=20,ge=28,Ce=60,Xe=[[18,4.8],[17,3.45],[14,2.2]],Gt=l=>l%2===1?2:l%4===0?0:1,Je=(l,n)=>{const[r,c]=Xe[l],u=10+c,i=Math.abs(n)+c;return r+Math.sqrt(Math.max(u*u-i*i,0))},H={ABLAQ:0,PLASTER:1,FLOOR:2,MARBLE:3,BRASS:4,VOUSSOIR:5,MEDALLION:6,CARVED:7,MUQARNAS:8,PLAIN:9,CLOTH:10,METAL:11,GLOW:12,TILE:13},J=`
uniform vec3 uSunL;        // unit direction the light travels
uniform vec3 uSunC;        // the same in the cool hall, where the roof is low: leaning 24 degrees at most
uniform float uSteamBase;  // height of the steam underside
uniform float uTime;
uniform vec4 uCloud;       // x: z of the drifting cloud edge, y: its depth 0..0.33, z,w: rare event fronts 0..1
uniform float uDarkFrac;   // share of eyes that are dark (snow on the domes)
uniform vec3 uGlass[5];    // glass colours: 0 clear, 1 emerald, 2 cobalt, 3 amber, 4 ruby
uniform vec3 uDeep;        // the blue-violet of deep shade
float hOctD(vec2 q){ q = abs(q); return max(max(q.x, q.y), (q.x + q.y) * 0.70710678); }
float hHash(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float hHash3(vec3 p){ p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float hNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hHash(i), hHash(i + vec2(1., 0.)), f.x), mix(hHash(i + vec2(0., 1.)), hHash(i + vec2(1., 1.)), f.x), f.y); }
float hNoise3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  float a = mix(mix(hHash3(i), hHash3(i + vec3(1., 0., 0.)), f.x), mix(hHash3(i + vec3(0., 1., 0.)), hHash3(i + vec3(1., 1., 0.)), f.x), f.y);
  float b = mix(mix(hHash3(i + vec3(0., 0., 1.)), hHash3(i + vec3(1., 0., 1.)), f.x), mix(hHash3(i + vec3(0., 1., 1.)), hHash3(i + vec3(1., 1., 1.)), f.x), f.y);
  return mix(a, b, f.z); }
float hFbm(vec2 p){ return 0.5 * hNoise(p) + 0.3 * hNoise(p * 2.13 + 7.1) + 0.2 * hNoise(p * 4.31 + 3.7); }
float hCloud(float z, float rnd){
  float amb = 1. - uCloud.y * exp(-(z - uCloud.x) * (z - uCloud.x) / 700.);
  float zn = (60. - z) / 120.;
  float dark = smoothstep(-0.1, 0.1, uCloud.z * 1.2 - 0.1 - zn) * (1. - smoothstep(-0.1, 0.1, uCloud.w * 1.2 - 0.1 - zn));
  return amb * (1. - dark) * mix(1., 0.04, step(rnd, uDarkFrac));
}
float hCaustic(vec2 p){            // a net of light crawling: bright where two drifting fields agree
  float a = hNoise(p + vec2(uTime * 0.31, uTime * 0.17)), b = hNoise(p * 1.37 + 5.3 - vec2(uTime * 0.23, -uTime * 0.19));
  float c = 1. - abs(a - b); c *= c; c *= c; return c * c;
}
float hStar(vec2 p, float r){ float a = max(abs(p.x) * 0.8660254 + p.y * 0.5, -p.y), b = max(abs(p.x) * 0.8660254 - p.y * 0.5, p.y); return min(a, b) - r * 0.5; }
float hHex(vec2 p, float r){ p = abs(p); return max(p.x * 0.8660254 + p.y * 0.5, p.y) - r; }
vec4 hHexCell(vec2 p){
  const vec2 s = vec2(1., 1.7320508);
  vec4 hC = floor(vec4(p, p - vec2(0.5, 1.)) / s.xyxy) + 0.5;
  vec4 h = vec4(p - hC.xy * s, p - (hC.zw + 0.5) * s);
  return dot(h.xy, h.xy) < dot(h.zw, h.zw) ? vec4(h.xy, hC.xy) : vec4(h.zw, hC.zw + 0.5);
}
float hVor(vec2 p){                // distance between the two nearest of a field of wandering points: 0 on the net between cells
  vec2 i = floor(p), f = fract(p); float d1 = 4., d2 = 4.;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y));
    vec2 o = vec2(hHash(i + g + 1.7), hHash(i + g + 23.1));
    o = 0.5 + 0.38 * sin(uTime * 1.15 + 6.2831853 * o);
    vec2 r = g + o - f; float d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d;
  }
  return sqrt(d2) - sqrt(d1);
}
`,At=`
float hArchH(float cls, float s){
  float hs = cls < 0.5 ? 18. : (cls < 1.5 ? 17. : 14.), c = cls < 0.5 ? 4.8 : (cls < 1.5 ? 3.45 : 2.2);
  float R = 10. + c, x = abs(s) + c; return hs + sqrt(max(R * R - x * x, 0.));
}
float hLand(vec3 e, vec4 dome, float kind, vec3 L, out vec3 n, out float show){
  float dn = max(-L.y, 0.05);
  n = vec3(0., 1., 0.); show = 1.;
  if (kind > 1.5) {            // the world's rooms: dome = (half width, east end z, west end z, water level or 0)
    float tf = e.y / dn; vec3 pf = e + L * tf;
    if (dome.w > 0.01) { float tw2 = (e.y - dome.w) / dn; vec3 pw2 = e + L * tw2;
      if (abs(pw2.x) < 6. || hOctD(pw2.xz - vec2(0., 191.)) < 18.) { tf = tw2; pf = pw2; } }
    if (L.x < -0.001) { float tn = (e.x + dome.x) / (-L.x);
      if (tn < tf) { tf = tn; pf = e + L * tn; n = vec3(1., 0., 0.); if (pf.y > 19.) show = 0.; } }
    if (pf.z < dome.y || pf.z > dome.z) show = 0.;
    return tf;
  }
  vec3 c = vec3(dome.x, dome.w, dome.y);
  float ts = max(-2. * dot(e - c, L), 0.);                 // second crossing of the dome sphere
  vec3 ps = e + L * ts;
  if (ps.y > dome.w + 0.5) { n = (c - ps) / dome.z; return ts; }
  float t = e.y / dn;
  vec3 p = e + L * t;
  float tp = (e.y - ${ue.toFixed(1)}) / dn; vec3 pp = e + L * tp;
  float tw = (e.y - ${Me.toFixed(1)}) / dn; vec3 pw = e + L * tw;
  if (hOctD(pp.xz) < ${Pt.toFixed(1)}) t = tp;
  else if (length(pw.xz - vec2(0., ${ce.toFixed(1)})) < ${se.toFixed(1)}) t = tw;
  if (kind < 0.5) {
    for (int k = 0; k < 8; k++) {
      float a = float(k) * 0.78539816; vec2 nk = vec2(sin(a), cos(a)), tk = vec2(cos(a), -sin(a));
      float den = dot(nk, L.xz);
      if (den > 0.001) {
        float tt = (${V.toFixed(1)} - dot(nk, e.xz)) / den; vec3 pk = e + L * tt; float s = dot(pk.xz, tk);
        if (tt < t && abs(s) < 22.9) {
          float cls = mod(float(k), 2.) > 0.5 ? 2. : (mod(float(k), 4.) < 0.5 ? 0. : 1.);
          if (!(abs(s) < 10. && pk.y < hArchH(cls, s))) { t = tt; n = vec3(-nk.x, 0., -nk.y); if (pk.y > ${ye.toFixed(1)} - 3.2) show = 0.; }
        }
      }
    }
    if (hOctD((e + L * t).xz) > 70.) show = 0.;
  } else {
    vec2 o = e.xz - dome.xy; vec2 d = L.xz; float dd = dot(d, d);
    if (dd > 1e-5) {
      float b = dot(o, d), cc = dot(o, o) - dome.z * dome.z, disc = b * b - dd * cc;
      if (disc > 0.) { float tt = (-b + sqrt(disc)) / dd; vec3 pk = e + L * tt;
        if (tt < t && tt > 0.) { vec2 rd = normalize(pk.xz - dome.xy + vec2(1e-4)); vec2 toC = -normalize(dome.xy);
          if (!(dot(rd, toC) > 0.72 && pk.y < 24.)) { t = tt; n = vec3(-rd.x, 0., -rd.y); } else if (length(pk.xz) < 60.) show = 0.; } }
    }
  }
  return t;
}
`,St=`
uniform vec4 uCEye[${Ce}];
uniform vec3 uAccentBeam;
uniform float uStarGain;
vec3 hCoolStars(vec3 p, float ew){
  vec3 L = uSunC;
  vec3 A = normalize(cross(L, vec3(1e-3, 0., 1.))), B = cross(L, A);
  float pa = dot(p, A), pb = dot(p, B), pt = dot(p, L), dn = max(-L.y, 0.05);
  vec3 s = vec3(0.);
  for (int i = 0; i < ${Ce}; i++) {
    vec4 e = uCEye[i];
    float ci = floor(e.w / 100. + 1e-3), w = e.w - 100. * ci, shp = step(10., w), sc = w - 10. * shp;
    float t = pt - dot(e.xyz, L);
    float rad = max(sc * mix(0.6, 1., clamp(t * dn / max(e.y, 1.), 0., 1.)), 0.05);
    vec2 q = vec2(pa - dot(e.xyz, A), pb - dot(e.xyz, B)) / rad;
    float sd = shp < 0.5 ? hStar(q, 1.25) : hHex(q, 0.86);
    float er = min(ew, 0.3 * rad) / rad;
    float c = (1. - smoothstep(-er, er, sd)) * step(0.5, t);
    vec3 gc = uGlass[int(ci + 0.5)];
    s += mix(uBeamCol, gc * gc * 1.1 - 0.16, step(0.5, ci)) * c;   // (a coloured pane also takes a little of the other colours out, so it stays coloured on pale water)
  }
  return s * hCloud(p.z, 1.);
}
`,Le=`
float hFogKeep(){
#ifdef USE_FOG
  #ifdef FOG_EXP2
    return exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  #else
    return 1. - smoothstep(fogNear, fogFar, vFogDepth);
  #endif
#else
  return 1.;
#endif
}
`,It=`
attribute vec3 aCol; attribute float aMat;
uniform float uTime;
varying vec3 vW, vN, vCol; varying vec2 vUv; varying float vMat;
#include <fog_pars_vertex>
void main(){
  vec4 lp = vec4(position, 1.); vec3 ln = normal;
#ifdef USE_INSTANCING
  lp = instanceMatrix * lp; ln = mat3(instanceMatrix) * ln;
#endif
  vec4 wp = modelMatrix * lp;
  float sw = aMat > 9.5 && aMat < 10.5 ? uv.y : (aMat > 8.5 && aMat < 9.5 ? uv.x : 0.);   // a draught in cloth and leaves
  if (sw > 0.) { float ph = dot(wp.xz, vec2(0.23, 0.19));
    wp.x += sw * (sin(uTime * 1.3 + ph) * 0.34 + sin(uTime * 2.9 + ph * 2.3) * 0.1);
    wp.z += sw * (cos(uTime * 1.1 + ph * 1.4) * 0.3 + sin(uTime * 2.3 + ph * 3.1) * 0.08); }
  vW = wp.xyz; vN = mat3(modelMatrix) * ln; vCol = aCol; vUv = uv; vMat = aMat;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ot=`
uniform vec3 uPearl, uSteam, uHoney, uBasalt, uAccent, uBrass, uShade, uBeamCol;
uniform float uHaze, uLight, uSeed;
uniform vec4 uBlob[${Ye}];      // x, z, radius, strength of a contact shadow on the floor
uniform vec4 uGlow;                // the exit portal's glow as the wet floor mirrors it: x, y, z of its centre, strength
uniform vec4 uLamp[${ge}];      // a hanging lamp: x, y, z, strength (negative: a pair, mirrored in x)
uniform vec3 uLampCol, uPortalCol;
uniform vec3 uRoomKey, uRoomAmb;   // this hour's tint of the light in the cool hall and the warm room: what their roofs let in, and their shade
uniform float uRecZ;               // the exit recess begins east of this z
varying vec3 vW, vN, vCol; varying vec2 vUv; varying float vMat;
#include <fog_pars_fragment>
${J}
${St}
vec3 marble(vec2 p, vec3 base){
  float v = hFbm(p * 0.35 + uSeed); float vein = smoothstep(0.035, 0., abs(hFbm(p * 0.22 + 11.3 + v) - 0.5));
  return base * (0.9 + 0.14 * v) * (1. - 0.22 * vein);
}
vec3 stripes(float u, float w, vec2 id){     // ablaq: honey / basalt alternating blocks with joints
  float i = floor(u / w), f = fract(u / w) * w;
  float joint = smoothstep(0., 0.07, min(f, w - f));
  float h = hHash(vec2(i, 3.7) + id);
  vec3 c = mod(i, 2.) < 0.5 ? uHoney * (0.86 + 0.24 * h) : uBasalt * (0.85 + 0.4 * h);
  return c * mix(0.55, 1., joint);
}
uniform float uThrough;
void main(){
  if (uThrough > 0.5 && vW.z > 289.5 && vW.y > 0.7) discard;   // seen through the previous portal from behind the entry, the hall's west wall stands aside
  vec3 V = normalize(cameraPosition - vW);
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
  if (dot(N, V) < 0.) N = -N;
  float od = hOctD(vW.xz);
  int m = int(vMat + 0.5);
  vec3 alb = uPearl; float gloss = 0.; float wetGlint = 0.;
  vec2 bump = vec2(0.);                          // faked relief: tilt of the normal along the wall (x) and upward (y)
  float lodK = clamp(0.045 / max(fwidth(vUv.x) + fwidth(vUv.y), 1e-4), 0., 1.);   // fine detail fades with distance
  float fwy = max(fwidth(vUv.y), 1e-4);
  float ewS = clamp(0.45 * length(fwidth(vW)), 0.03, 0.22);             // edge softness of a thrown star, in metres
  if (m == 0) {                                  // ablaq courses below 20 m, plaster above
    float y = vUv.y;
    if (y < 20.) {
      // cut stone: courses 2.5 m high, blocks 2.9 to 3.8 m long, pillow-faced with dark recessed joints; over every
      // basalt course a thin inlaid fillet of pale stone set with honey lozenges
      // (courses 1.25 m high in bands of two, blocks 1.5 to 2.3 m long, thin joints, a shallow drafted margin: cut stone, not pillows)
      float band = floor(y / 2.5), course = floor(y / 1.25), fy = y - course * 1.25;
      bool dk = mod(band, 2.) < 0.5; bool upper = mod(course, 2.) > 0.5;
      float bl = 1.5 + 0.8 * hHash(vec2(course, 4.3));
      float u = vUv.x + hHash(vec2(course, 9.1)) * 7.;
      float bi = floor(u / bl), fx = u - bi * bl;
      float topC = dk && upper ? 0.95 : 1.25;
      // now and then one great block takes the height of both courses of its band
      float ub = vUv.x + hHash(vec2(band, 2.7)) * 9., bgi = floor(ub / 3.3);
      if (hHash(vec2(bgi, band) + uSeed + 11.) < 0.24 && !(dk && y > band * 2.5 + 2.2)) {
        course = band * 2. + 0.5; fy = y - band * 2.5; bl = 3.3; u = ub; bi = bgi + 40.; fx = ub - bgi * 3.3; topC = dk ? 2.2 : 2.5; upper = false;
      }
      float h = hHash(vec2(bi, course) + uSeed), h2 = hHash(vec2(course, bi) + 5.7);
      vec3 honeyS = mix(vec3(dot(uHoney, vec3(0.3, 0.55, 0.15))), uHoney, 0.74);                // cut limestone, not paint
      vec3 stone = dk ? uBasalt * (0.6 + 0.6 * h) : honeyS * (0.62 + 0.5 * h);
      stone *= 0.8 + 0.42 * hFbm(vec2(vUv.x * 0.11, y * 0.16) + uSeed);                       // the wall's own weathering, over many blocks
      float vn = hFbm(vec2(u * 0.9 + h * 13., y * 2.6 + h2 * 7.));
      stone *= 1. - 0.28 * smoothstep(0.05, 0., abs(vn - 0.5)) * step(0.45, h2) * lodK;      // a vein through some blocks
      if (!dk) stone = mix(stone, stone * vec3(1.1, 0.88, 0.7), step(0.7, h2) * 0.55);     // a redder block now and then
      else stone = mix(stone, stone * vec3(0.9, 1.0, 1.14), step(0.6, h2) * 0.6);          // a bluer one in the basalt
      stone *= 0.74 + 0.5 * hFbm(vec2(u, y) * 1.3 + h * 9.);                               // mottling
      float tool = hNoise(vec2(u * 7. + y * 4. + h * 31., y * 13.)) * 0.6 + hNoise(vec2(u * 23. - y * 9., y * 31.)) * 0.4;
      stone *= 1. + (tool - 0.5) * 0.34 * lodK;                                            // slanting chisel strokes
      stone *= 1. - 0.45 * step(0.9, hNoise(vec2(u, y) * 9.7 + 3.)) * lodK;                // pits
      stone *= 1. - 0.2 * smoothstep(0.5, 0.85, hFbm(vec2(u * 2.1, y * 0.33) + 7.));       // streaks of old water
      float top = topC;
      float jx = min(fx, bl - fx), jy = min(fy, top - fy), jd = min(jx, jy);
      float joint = smoothstep(0.018, 0.05, jd);
      stone *= 0.93 + 0.12 * smoothstep(0., top, fy);
      float bev = 1. - smoothstep(0.03, 0.14, jd);
      bump = (jx < jy ? vec2(fx < bl * 0.5 ? -1. : 1., 0.) : vec2(0., fy < top * 0.5 ? -1. : 1.)) * bev * joint * 0.3;
      stone *= 1. + 0.05 * bev * joint * step(top * 0.5, fy) * step(jy, jx) * (0.3 + 1.4 * hNoise(vec2(u * 0.8, course)));   // the worn upper arris catches the light, here and there
      stone *= 1. - 0.08 * bev * joint * step(fy, top * 0.5) * step(jy, jx);              // and the lower one is in its own shade
      float field = smoothstep(0.14, 0.2, jd);                                            // inside a smooth drafted margin the face is picked rough
      stone *= 1. - field * (0.04 + 0.16 * hNoise(vec2(u, y) * 15. + h * 7.) * lodK);
      stone *= 1. - 0.16 * smoothstep(0.03, 0., abs(jd - 0.17)) * lodK;                   // the margin's cut line
      stone *= 1. - 0.22 * smoothstep(0.75, 0.95, hNoise(vec2(u, y) * 1.9 + h * 40.)) * (1. - smoothstep(0.02, 0.16, jd)) * lodK;   // chipped arrises
      stone *= 1. - 0.14 * smoothstep(0.45, 0.8, hFbm(vec2(u * 0.6, y * 0.12) + 17.)) * smoothstep(21., 14., y);      // damp running down from the carved band
      stone *= 1. - 0.34 * smoothstep(15.5, 20., y) * (0.45 + 0.55 * hFbm(vec2(vUv.x * 0.45, y * 0.1) + 9.));      // damp under the carved band
      stone *= 1. - 0.3 * smoothstep(9.5, 5., y) * (0.4 + 0.6 * hFbm(vec2(vUv.x * 0.37, y * 0.12) + 3.));           // and at the foot, over the tiles
      alb = mix(stone * 0.3, stone, joint);
      if (y > 12.5 && y < 13.75) {                                                         // an inlaid frieze at mid-height: cream stone set with basalt stars, turquoise eyes, honey lozenges between
        float t = (y - 12.5) / 1.25; vec2 fq = vec2(fract(vUv.x / 1.25) - 0.5, t - 0.5);
        float s8 = min(max(abs(fq.x), abs(fq.y)), (abs(fq.x) + abs(fq.y)) * 0.7071) - 0.27;
        vec3 fr = uPearl * 0.7 * (0.9 + 0.16 * hNoise(vec2(vUv.x * 2.3, y * 3.)));
        fr = mix(fr, uBasalt * 0.8, smoothstep(0.02, -0.01, s8));
        fr = mix(fr, vec3(0.03, 0.38, 0.4), smoothstep(0.1, 0.07, length(fq)));
        fr = mix(fr, honeyS * 0.9, smoothstep(0.02, 0., abs(abs(fq.x) - 0.5) + abs(fq.y) * 0.6 - 0.1));
        fr *= smoothstep(0., 0.07, t) * smoothstep(1., 0.93, t) * 0.7 + 0.3;               // seated between two shadow lines
        alb = mix(alb, fr, clamp(0.4 / fwy, 0., 1.)); bump = vec2(0.);
      }
      if (dk && upper && fy > 0.95) {                                                      // the inlaid fillet
        float t = (fy - 0.95) / 0.3, lu = abs(fract(u / 0.62) - 0.5) * 0.62;
        vec3 fil = uPearl * 0.74 * (0.92 + 0.12 * hNoise(vec2(u * 3., course)));
        fil = mix(fil, uHoney * 0.85, smoothstep(0.02, 0., lu + abs(t - 0.5) * 0.3 - 0.115));
        fil *= smoothstep(0., 0.14, t) * (0.72 + 0.28 * smoothstep(1., 0.82, t));          // seated in a shadow line
        alb = mix(uBasalt * 0.9, fil, clamp(0.3 / fwy, 0., 1.));
        bump = vec2(0.);
      }
      float glaze = 0.;
      if (y < 5.) {                                                                        // a dado of glazed tiles: turquoise ground, cobalt and emerald stars, a cobalt border
        vec3 turq = vec3(0.02, 0.36, 0.38), emer = vec3(0.015, 0.25, 0.1), cob = vec3(0.028, 0.075, 0.44), cream = uPearl * 0.8;
        vec3 tc;
        if (y < 0.5) tc = uBasalt * 0.55;
        else if (y > 4.3) {
          float bz = (y - 4.3) / 0.7, zz = abs(fract(vUv.x / 0.7) - 0.5) * 2.;
          tc = mix(cob, cream, smoothstep(0.12, 0.05, abs(zz * 0.5 + 0.28 - bz)));
          tc = mix(tc, turq * 1.25, step(bz, 0.16)); tc = mix(tc, cream * 0.9, step(0.88, bz));
        } else {
          vec2 tq = vec2(vUv.x, y - 0.5) / 0.95, ti = floor(tq), tf = fract(tq) - 0.5;
          float keep = clamp(0.35 / max(fwidth(tq.x) + fwidth(tq.y), 1e-4), 0., 1.);
          float s8 = min(max(abs(tf.x), abs(tf.y)), (abs(tf.x) + abs(tf.y)) * 0.7071) - 0.3;      // an eight-pointed star: a square and a diamond together
          tc = turq * (0.8 + 0.4 * hHash(ti + 3.));
          tc = mix(tc, mod(ti.x + ti.y, 2.) < 0.5 ? cob : emer, smoothstep(0.02, -0.02, s8));
          tc = mix(tc, cream, smoothstep(0.045, 0.012, abs(s8)));
          tc = mix(tc, vec3(0.8, 0.42, 0.05), smoothstep(0.1, 0.07, length(tf)));
          tc *= 0.55 + 0.45 * smoothstep(0.5, 0.455, max(abs(tf.x), abs(tf.y)));
          tc = mix(vec3(0.03, 0.25, 0.33), tc, keep);
        }
        alb = tc * (0.88 + 0.24 * hNoise(vec2(vUv.x, y) * 2.3)); bump = vec2(0.); glaze = 1.;
      }
      float damp = smoothstep(8., 0., y) * (0.35 + 0.65 * hFbm(vec2(u * 0.3, y * 0.08) + 5.)) * (1. - 0.75 * glaze);
      alb = mix(alb, alb * vec3(0.5, 0.6, 0.54), damp * 0.7);
      alb = mix(alb, uAccent * 0.4 + alb * 0.4, smoothstep(0.62, 0.9, hFbm(vec2(u * 0.5, 3.))) * smoothstep(2.4, 0.2, y) * 0.5);
      gloss = mix(0.24 * smoothstep(7., 0., y), 0.6, glaze);
    } else {
      alb = uPearl * (0.74 + 0.1 * hFbm(vec2(vUv.x, y) * 0.6 + uSeed)) * (0.94 + 0.06 * hNoise(vec2(vUv.x, y) * 5.));
      alb *= 1. - 0.25 * smoothstep(0.5, 0., y - 20.);                       // shadow line over the last course
      alb *= mix(1., 0.86, smoothstep(0.55, 0.8, hFbm(vec2(vUv.x * 0.25, y * 0.05) + 2.)));   // old damp
      if (vW.z > 127.) {                                                    // the cool hall: no bare plaster. A painted scroll over the arcade, a row of painted blind niches under the ceiling
        vec3 turq = vec3(0.03, 0.4, 0.42), cob = vec3(0.04, 0.1, 0.5);
        float sv = (y - 27.0) / 3.4;
        if (sv > 0. && sv < 1.) {
          float su = vUv.x * 0.85;
          float w1 = abs(sv - 0.5 - 0.27 * sin(su)), w2 = abs(sv - 0.5 + 0.27 * sin(su));
          vec3 bc = cob * (0.75 + 0.3 * hNoise(vec2(vUv.x * 0.7, y * 1.3)));
          bc = mix(bc, turq, smoothstep(0.16, 0.1, length(vec2((fract(su / 3.14159 + 0.5) - 0.5) * 2.2, sv - 0.5))));
          bc = mix(bc, uPearl * 0.82, smoothstep(0.085, 0.05, min(w1, w2)));
          bc = mix(bc, uHoney * 0.8, step(sv, 0.09) + step(0.91, sv));
          alb = mix(alb, bc, 0.9);
        }
        float nv = (y - 32.6) / 6.4;
        if (nv > 0. && nv < 1.) {
          float nu = (fract(vUv.x / 5.6) - 0.5) * 5.6, ax = abs(nu), yy = nv * 6.4 - 0.7;
          float d = yy < 2.6 ? ax - 1.75 : length(vec2(ax + 1.05, yy - 2.6)) - 2.8; d = max(d, -yy);
          vec3 nc = mix(turq * 0.9, cob * 0.8, smoothstep(0.5, 4.6, yy));                  // deeper colour toward the head of the niche
          nc *= 0.72 + 0.28 * smoothstep(0., 0.7, -d);                                     // a shadow under its rim
          vec2 sq = vec2(nu, yy - 2.1);
          nc = mix(nc, uPearl * 0.85, smoothstep(0.05, 0., abs(hStar(sq, 1.5)) - 0.05));
          nc = mix(nc, uHoney * 0.85, smoothstep(0.03, -0.03, hHex(sq, 0.42)));
          vec3 pl = mix(alb, cob * 0.9, smoothstep(0.03, -0.03, abs(ax - 2.8) + abs(yy - 2.6) * 0.6 - 0.42));      // a lozenge between niches
          pl = mix(pl, uHoney * 0.75, smoothstep(0.08, 0.02, abs(d - 0.28)));              // a honey line round each
          alb = mix(pl, nc, smoothstep(0.04, -0.04, d));
        }
      }
      // inlaid roundels in the spandrels of the eight great arches
      float sW = mod(vUv.x + 22.78, 45.56) - 22.78;
      vec2 rq = vec2(abs(sW) - 16.4, y - 24.3); float rd = length(rq);
      if (rd < 2.7 && od < 56.) {
        vec3 rc = uPearl * 0.8;
        rc = mix(rc, uHoney * 0.9, smoothstep(0.05, 0., hStar(rq, 1.9)));
        rc = mix(rc, hHash(vec2(floor(vUv.x / 45.56), sign(sW)) + uSeed) < 0.3 ? uAccent * 0.75 : uBasalt * 1.1, smoothstep(0.05, 0., hHex(rq, 0.62)));
        rc = mix(rc, uBasalt * 1.1, smoothstep(2.05, 2.1, rd) * (1. - smoothstep(2.3, 2.35, rd)));
        rc = mix(rc, uHoney * 0.9, smoothstep(2.35, 2.4, rd));
        alb = mix(rc, alb * 0.7, smoothstep(2.6, 2.7, rd));
      }
    }
  } else if (m == 1) {                           // plaster (domes): meridian ribs and trowel marks
    float rib = abs(fract(vUv.x) - 0.5);
    alb = uPearl * (0.62 + 0.1 * hFbm(vW.xz * 0.21 + vW.y * 0.13)) * (1. - 0.14 * smoothstep(0.03, 0., rib));
    alb *= 0.95 + 0.05 * hNoise(vW.xz * 2.3 + vW.y);
    if (vW.z < uRecZ) {                                       // the recess vault: raised cross ribs, a carved band along each springing, an inlaid star at the crown of every bay
      alb = mix(alb, uHoney * 0.52, smoothstep(0.062, 0.05, rib));
      alb *= 1. - 0.4 * smoothstep(0.022, 0., abs(rib - 0.072));
      float bv = (vW.y - 22.15) / 2.7;
      if (bv > 0. && bv < 1.) {
        float bu = vW.z * 1.25;
        float s1 = abs(bv - 0.5 - 0.27 * sin(bu)), s2 = abs(bv - 0.5 + 0.27 * sin(bu)), s3 = abs(bv - 0.5 - 0.27 * sin(bu * 0.5 + 1.57));
        float strand = smoothstep(0.1, 0.06, min(min(s1, s2), s3)), border = step(bv, 0.1) + step(0.9, bv);
        alb = uPearl * mix(0.42, 0.8, max(strand, border)) * (1. - 0.2 * smoothstep(0.035, 0., min(min(s1, s2), s3)));
        alb = mix(alb, uHoney * 0.75, border * 0.55);
      }
      vec2 mq = vec2(vW.x, (vUv.x - floor(vUv.x + 0.5)) * 7.7); float mr = length(mq);
      if (mr < 3.6) {
        vec3 mc = uPearl * 0.7;
        mc = mix(mc, uHoney * 0.85, smoothstep(0.07, 0., hStar(mq, 2.5)));
        mc = mix(mc, hHash(vec2(floor(vUv.x + 0.5), 3.) + uSeed) < 0.34 ? uAccent * 0.75 : uBasalt * 1.2, smoothstep(0.06, 0., hHex(mq, 0.8)));
        mc = mix(mc, uBasalt * 1.2, smoothstep(0.1, 0.03, abs(mr - 3.05)));
        alb = mix(mc, alb, smoothstep(3.3, 3.5, mr));
      }
    }
    if (vW.z > 127. && vW.y < 40.5 && vW.y > 39.5) {         // the cool hall's flat ceiling: painted coffers between dark beams
      vec2 cq = vec2(vW.x, vW.z - 131.) / 6.36, cf = fract(cq) - 0.5, ci = floor(cq);
      float cb = max(abs(cf.x), abs(cf.y));                    // 0 at the middle of a coffer, 0.5 on a beam
      vec3 panel = uPearl * 0.62 * (0.9 + 0.1 * hHash(ci + 2.));
      panel = mix(panel, uHoney * 0.8, smoothstep(0.03, 0., hStar(cf * 1.9, 0.52)));
      panel = mix(panel, hHash(ci + uSeed) < 0.25 ? uAccent * 0.7 : uBasalt * 1.2, smoothstep(0.025, 0., hHex(cf * 1.9, 0.14)));
      panel = mix(panel, uShade * 0.75, smoothstep(0.03, 0., abs(cb - 0.33) - 0.012));       // a painted line round each panel
      panel *= 0.62 + 0.38 * smoothstep(0.42, 0.24, cb);                                     // the coffer is sunk: its edges are in shade
      vec3 beam = uHoney * 0.34 * (0.8 + 0.4 * hNoise(vec2(cq.x * 14., cq.y * 1.3) + (abs(cf.x) > abs(cf.y) ? 0. : 9.)));
      alb = mix(panel, beam, smoothstep(0.415, 0.43, cb));
    }
  } else if (m == 2) {                           // wet floor: star-and-hexagon marble, striped borders
    vec2 p = vW.xz;
    vec4 hc = hHexCell(p / 5.4);
    float ds = hStar(hc.xy, 0.43), dh = hHex(hc.xy, 0.15), db = hHex(hc.xy.yx, 0.468);
    float hid = hHash(hc.zw + uSeed);
    vec3 white = marble(p, uPearl * 0.8), honey = marble(p * 1.3, uHoney * 0.92), dark = marble(p * 0.7, uBasalt * 1.15);
    vec3 c = white;
    c = mix(c, honey, smoothstep(0.012, 0., ds));
    c = mix(c, hid < 0.09 ? uAccent * 0.75 : dark, smoothstep(0.012, 0., dh));
    c = mix(c, dark, smoothstep(0., 0.012, db));
    c *= 1. - 0.35 * smoothstep(0.014, 0.002, min(min(abs(ds), abs(dh)), abs(db)));     // grout
    float pd = hOctD(p), ang = atan(p.x, p.y);
    float band1 = smoothstep(15.4, 15.6, pd) * smoothstep(21.2, 21., pd);               // striped collar round the platform
    c = mix(c, stripes(ang * 9.2, 1., vec2(floor(pd / 1.4), 2.)), band1 * step(0.12, fract(pd / 1.4)));
    c = mix(c, dark, band1 * (1. - step(0.12, fract(pd / 1.4))));
    float band2 = smoothstep(47.8, 48., pd) * smoothstep(53.2, 53., pd);                // striped margin under the walls
    c = mix(c, stripes(ang * 28. + floor(pd / 1.3) * 0.5, 1., vec2(floor(pd / 1.3), 5.)), band2);
    float pl = length(p - vec2(0., ${ce.toFixed(1)}));
    float band3 = smoothstep(18.3, 18.5, pl) * smoothstep(21.3, 21.1, pl) * step(pd, 47.8); // honey and basalt ring round the pool
    c = mix(c, stripes(atan(p.x, p.y - ${ce.toFixed(1)}) * 10.5, 1., vec2(1., 8.)), band3);
    alb = c;
    // contact shadows: platform foot, pool kerb, walls; moss and old overflow round the basins
    float sh = 1. - 0.42 * smoothstep(17.4, 15.2, pd) - 0.3 * (1. - smoothstep(18.2, 20.4, pl)) * step(18., pl);
    sh *= 1. - 0.3 * smoothstep(51., 55., pd) * step(pd, 56.);
    float ba = (floor(ang / 0.78539816) + 0.5) * 0.78539816;
    float bd = length(p - vec2(sin(ba), cos(ba)) * 51.5);
    sh *= 1. - 0.45 * smoothstep(6.2, 3.6, bd);
    float moss = smoothstep(8.5, 4.2, bd) * smoothstep(0.35, 0.7, hFbm(p * 0.45 + 4.));
    alb = mix(alb, alb * vec3(0.5, 0.74, 0.5) + uAccent * 0.08, moss * 0.6);
    for (int i = 0; i < ${Ye}; i++) {                                       // soft contact shadows under what stands on the floor
      vec4 bl = uBlob[i]; float bq = length(p - bl.xy);
      sh *= 1. - bl.w * (1. - smoothstep(bl.z * 0.45, bl.z, bq));
    }
    alb *= sh;
    float puddle = smoothstep(0.3, 0.62, hFbm(p * 0.085 + uSeed * 0.37));
    gloss = 0.55 + 0.45 * puddle; wetGlint = 1.;
    alb *= mix(0.8, 0.64, puddle);                                           // wet stone is darker: the stars stand out on it
    { float hotF = smoothstep(66., 57., vW.z) * smoothstep(uRecZ - 3., uRecZ + 5., vW.z); alb = mix(alb, alb * alb * 1.25 + alb * 0.12, 0.8 * hotF); }   // the hot room's floor runs with water: dark, deep-coloured marble
    if (vW.z > 127.) { gloss *= 0.4; wetGlint = 0.; alb *= 1.3; }            // the cool hall's floor is dry
  } else if (m == 3) {                           // white marble with inlaid bands (vUv.y = band coordinate 0..1)
    alb = marble(vUv * vec2(1., 6.) + vW.xz * 0.3, uPearl * 0.86);
    alb *= 1. - 0.3 * smoothstep(0.05, 0., abs(hFbm(vW.xz * 0.55 + vW.y * 0.9 + 3.1) - 0.5)) * (0.4 + 0.6 * hNoise(vW.xz * 0.2 + 7.));   // grey veins
    float v = vUv.y;
    if (v > 0.3 && v < 0.7) {
      float t = (v - 0.3) / 0.4; float u = vUv.x / 0.9; float tri = abs(fract(u) - 0.5) * 2.;
      vec3 inl = tri > t ? uBasalt * 1.1 : uHoney * 0.9;
      if (hHash(vec2(floor(u), 4.) + uSeed) < 0.12 && tri <= t) inl = uAccent * 0.7;
      float edge = min(min(t, 1. - t), abs(tri - t));
      alb = mix(alb * 0.6, inl, smoothstep(0., 0.05, edge));
    }
    gloss = 0.5;
  } else if (m == 4) {                           // brass (taps, grilles: vUv.y > 0.5 marks the pierced disc)
    alb = uBrass * 0.5 + uHoney * 0.45; gloss = 0.9;
    if (vUv.y > 0.5) {
      vec4 hc = hHexCell(vW.xz / 0.9);
      float hole = min(hStar(hc.xy, 0.36), 1.);
      alb *= mix(0.12, 1., smoothstep(-0.02, 0.03, hole)) * (0.8 + 0.2 * smoothstep(0.03, 0.08, abs(hole - 0.07)));
    }
    alb *= 0.85 + 0.3 * hNoise(vW.xz * 6. + vW.y * 4.);
  } else if (m == 5) {                           // striped voussoirs (vUv.x metres round the arch)
    float vf = mod(vUv.x, 2.3), vi = floor(vUv.x / 2.3);
    alb = stripes(vUv.x, 2.3, vec2(1.)) * (0.86 + 0.28 * hFbm(vUv * vec2(1.5, 3.) + vi * 3.7));
    alb *= 1. + (hNoise(vec2(vUv.x * 9. + vUv.y * 11., vUv.y * 30.)) - 0.5) * 0.3 * lodK;      // tooling
    alb *= 1. + 0.2 * (smoothstep(0.36, 0.09, vf) - smoothstep(0.36, 0.09, 2.3 - vf)) * step(0.07, min(vf, 2.3 - vf));   // each voussoir is cushioned: one arris lit, one in shade
    float ve = min(vUv.y, 1. - vUv.y) * 2.4;
    alb *= mix(0.62, 1., smoothstep(0.06, 0.14, abs(ve - 0.22))) * mix(0.8, 1., smoothstep(0., 0.1, ve));   // a cut moulding line inside each edge of the ring
  } else if (m == 6) {                           // platform top: a great rosette of inlay on white marble
    vec2 p = vW.xz; float r = length(p), a = atan(p.x, p.y);
    vec3 white = marble(p * 1.5, uPearl * 0.82), honey = uHoney * 0.92, dark = uBasalt * 1.15;
    vec3 c = white;
    float pet = abs(fract(a * 16. / 6.2831853 + 0.5) - 0.5) * 2.;
    float starR = mix(6.2, 10.6, pet);
    c = mix(c, honey, smoothstep(0.06, 0., r - starR) * step(4.9, r));
    float star2 = mix(4.9, 8.4, abs(fract(a * 16. / 6.2831853) - 0.5) * 2.);
    c = mix(c, dark, smoothstep(0.06, 0., r - star2) * step(4.9, r) * step(r, starR));
    c = mix(c, dark, smoothstep(0.1, 0.02, abs(r - 11.4)) + smoothstep(0.1, 0.02, abs(r - 4.9)));
    c = mix(c, stripes(a * 12.6, 1., vec2(3., 1.)), smoothstep(11.9, 12., hOctD(p)) * smoothstep(13.3, 13.2, hOctD(p)));
    vec4 hc = hHexCell(p / 1.5);
    float inner = step(r, 4.9);
    c = mix(c, mix(honey, hHash(hc.zw) < 0.2 ? uAccent * 0.75 : dark, smoothstep(0.01, 0., hHex(hc.xy, 0.2))), inner * smoothstep(0.012, 0., hStar(hc.xy, 0.42)));
    alb = c * 0.82; gloss = 0.7; wetGlint = 1.;
  } else if (m == 7) {                           // carved interlace band (vUv.x metres, vUv.y 0..1)
    float u = vUv.x * 1.25, v = vUv.y;
    float s1 = abs(v - 0.5 - 0.27 * sin(u)), s2 = abs(v - 0.5 + 0.27 * sin(u)), s3 = abs(v - 0.5 - 0.27 * sin(u * 0.5 + 1.57));
    float strand = smoothstep(0.1, 0.06, min(min(s1, s2), s3));
    float core = smoothstep(0.035, 0.0, min(min(s1, s2), s3));
    float border = step(v, 0.1) + step(0.9, v);
    alb = uPearl * mix(0.5, 0.8, max(strand, border)) * (1. - 0.2 * core);
    alb = mix(alb, uHoney * 0.75, border * 0.55);
    alb *= 0.93 + 0.1 * hNoise(vUv * vec2(3., 9.));
  } else if (m == 9) {                           // plain vertex-coloured prop
    alb = vec3(0.88 + 0.14 * hNoise(vW.xz * 3.1 + vW.y * 2.3)); gloss = vUv.y;
  } else if (m == 10) {                          // striped cloth
    float s = fract(vUv.x / 1.7);
    float stripe = step(0.5, s) * step(s, 0.84) + step(0.07, s) * step(s, 0.13) + step(0.91, s) * step(s, 0.95);
    alb = mix(uPearl * 0.84 / max(vCol, vec3(0.04)), vec3(1.), stripe) * (0.9 + 0.12 * hNoise(vUv * vec2(9., 40.)));
  } else if (m == 11) {                          // hammered metal: every dimple is a small facet that turns the light
    float sat = clamp((max(vCol.r, max(vCol.g, vCol.b)) - min(vCol.r, min(vCol.g, vCol.b))) / max(max(vCol.r, max(vCol.g, vCol.b)), 1e-3) * 2.2, 0., 1.);   // copper 1, tin 0
    vec2 hq = vUv * mix(21., 13., sat), hi = floor(hq);
    vec2 hc2 = fract(hq) - 0.5 - 0.36 * (vec2(hHash(hi), hHash(hi + 7.3)) - 0.5);
    float hd = length(hc2);
    float dim = smoothstep(0.5, 0.12, hd);
    alb = vec3(0.8 + 0.2 * dim) * (0.86 + 0.28 * hNoise(vUv * 2.3));
    alb *= 1. - 0.3 * smoothstep(0.42, 0.5, hd);                                // tarnish in the creases between dimples
    bump = ((vec2(hHash(hi + 1.7), hHash(hi + 4.9)) - 0.5) * 0.5 * dim + hc2 * 0.5) * mix(0.4, 1., sat);
    float bv = vUv.y - 10.;
    if (bv > 0. && bv < 1.) {                      // the engraved band of knotwork: dark-cut strands between two ruled lines
      float u = vUv.x * 5.2;
      float s1 = abs(bv - 0.5 - 0.25 * sin(u)), s2 = abs(bv - 0.5 + 0.25 * sin(u)), s3 = abs(bv - 0.5 - 0.25 * sin(u * 0.5 + 1.57));
      float cut = smoothstep(0.075, 0.03, min(min(s1, s2), s3));
      float rule = smoothstep(0.03, 0.0, abs(bv - 0.1) - 0.02) + smoothstep(0.03, 0.0, abs(bv - 0.9) - 0.02);
      alb = vec3(1.02) * (1. - 0.72 * max(cut, rule));
      alb *= 0.9 + 0.2 * step(0.5, hHash(floor(vec2(u * 2.2, bv * 9.))));         // punched ground between the strands
      bump = vec2(0.);
    }
    gloss = 0.85; wetGlint = 2.;
  } else if (m == 12) {                          // lit glass (set below)
    alb = vec3(0.);
  } else if (m == 13) {                          // a glazed tile panel (vUv in metres): a lattice of stars in cobalt and turquoise, a zigzag border
    vec3 turq = vec3(0.02, 0.38, 0.4), emer = vec3(0.015, 0.26, 0.1), cob = vec3(0.028, 0.075, 0.46), cream = uPearl * 0.82, ruby = vec3(0.42, 0.03, 0.05);
    vec4 hc = hHexCell(vUv / 1.25);
    float keep = clamp(0.3 / max(fwidth(vUv.x) + fwidth(vUv.y), 1e-4), 0., 1.);
    float ds = hStar(hc.xy, 0.44), dh = hHex(hc.xy, 0.13), hid = hHash(hc.zw + uSeed);
    vec3 tc = cob * (0.85 + 0.3 * hid);
    tc = mix(tc, hid < 0.5 ? turq : emer, smoothstep(0.012, -0.012, ds));
    tc = mix(tc, cream, smoothstep(0.04, 0.012, abs(ds)));
    tc = mix(tc, hid < 0.3 ? ruby : vec3(0.8, 0.44, 0.05), smoothstep(0.012, -0.012, dh));
    tc = mix(vec3(0.03, 0.17, 0.4), tc, keep);
    alb = tc * (0.88 + 0.24 * hNoise(vUv * 2.1)); gloss = 0.6;
  } else {                                       // muqarnas cell: plaster, honey lip
    alb = uPearl * 0.8 * (0.92 + 0.1 * hNoise(vW.xz * 1.7 + vW.y));
    alb = mix(alb, uHoney * 0.9, smoothstep(0.8, 0.93, vUv.y) * 0.85);
    alb = mix(alb, uBasalt * 1.3, smoothstep(0.1, 0.02, vUv.y) * 0.35);
    if (vW.z < uRecZ) {                          // the half-dome over the portal is painted: turquoise and cobalt hollows tier by tier, a cream line, gilded lips
      float tj = floor(asin(clamp((vW.y - 20.8) / 9.5, 0., 1.)) / 1.5237 * 8.);
      vec3 hol = mod(tj, 2.) < 0.5 ? vec3(0.02, 0.34, 0.38) : vec3(0.03, 0.09, 0.46);
      hol *= 0.75 + 0.5 * vUv.y + 0.2 * hNoise(vW.xz * 2.3 + vW.y * 1.7);
      alb = mix(hol, uPearl * 0.85, smoothstep(0.035, 0.015, abs(vUv.y - 0.74)));
      alb = mix(alb, vec3(0.95, 0.6, 0.14), smoothstep(0.8, 0.86, vUv.y));
      float au = abs(vUv.x - 0.5);
      alb = mix(alb, vec3(0.95, 0.6, 0.14), smoothstep(0.06, 0.03, au) * smoothstep(0.1, 0.3, vUv.y) * (1. - smoothstep(0.55, 0.7, vUv.y)) * 0.8);   // a gilt rib up the middle of each cell
    }
  }
  alb *= vCol;

  // ---- relief: cushioned stones and hammer dimples tilt the normal
  if (bump.x != 0. || bump.y != 0.) {
    vec3 T = cross(vec3(0., 1., 0.), N); float tl = length(T);
    T = tl > 0.05 ? T / tl : vec3(1., 0., 0.);
    vec3 B = cross(N, T);
    N = normalize(N + (T * bump.x + B * bump.y) * 0.75);
  }
  // ---- light: no lamps. Pearl fill from the glowing steam under the domes, blue-grey shade below and in corners.
  float up = N.y * 0.5 + 0.5;
  vec3 lc = vec3(0., 72., 0.); float chamber = 0.;
  float room = 0., reach = 1.;
  if (od > 61. && abs(abs(vW.x) - abs(vW.z)) < 24.) { lc = vec3(sign(vW.x) * 52.7, 38., sign(vW.z) * 52.7); chamber = 1.; }
  else if (vW.z > 127.) { lc = vec3(8., 70., 191.); room = 1.; reach = 105.; }       // the world's cool hall: its dome
  else if (vW.z > 63.2) { lc = vec3(8., 44., 93.3); room = 1.; reach = 56.; }        // the warm room: its vault
  else if (vW.z < uRecZ) { lc = vec3(9., 40., -108.); room = 1.; reach = 72.; }      // the exit recess: its south haunch
  vec3 toL = lc - vW; float dl = length(toL) + 1e-3; float ndl = max(dot(N, toL / dl), 0.);
  float fall = 1. / (1. + dl * dl / (reach * reach));
  ndl = mix(ndl, (0.2 + 0.8 * ndl) * 1.75 * fall, room);                   // rooms: the corners fall off
  float passage = smoothstep(54., 60., od) * (1. - chamber) * (1. - room);
  float lift = smoothstep(0., 70., vW.y);
  float upS = up * up * (3. - 2. * up);
  upS = mix(upS, max(upS, 0.4), room);                                     // rooms: the floor's bounce reaches ceilings and soffits
  vec3 fill = mix(uDeep * 0.5, uPearl, upS) * mix(0.46, 0.4, lift) * (1. + room * (0.62 * fall + 0.02));
  vec3 key = uPearl * ndl * mix(0.44, 0.3, chamber);
  if (vW.z > 63.2) { fill *= uRoomAmb; key *= uRoomKey; }
  float hush = clamp(uCloud.z - uCloud.w, 0., 1.);                         // the real cloud is over the domes
  vec3 light = (fill * mix(1., 0.92, passage) + key * mix(1., 0.8, passage)) * uLight;   // passages and iwans: dimmer, never dark
  float hot = (1. - room) * (1. - chamber);
  light += uHoney * (0.07 + 0.07 * hot) * (1. - up) * smoothstep(24., 0., vW.y);   // warm bounce off the stone floor band
  light += uBeamCol * uHoney * 0.3 * hot * smoothstep(9., 0.5, vW.y) * (1. - 0.6 * up) * hCloud(vW.z, 1.) * smoothstep(40., 2., uSteamBase);   // the floor's stars thrown back up the lowest courses
  if (vW.z > 63.2) {                                                        // shade deepens into the side bays of the cool hall and warm room
    float bay = vW.z > 127. ? smoothstep(24., 45., abs(vW.x)) : smoothstep(15., 30., abs(vW.x));
    light *= mix(vec3(1.), uDeep * 1.6, 0.7 * bay * (1. - 0.6 * smoothstep(24., 40., vW.y)));
  }
  // the light lies on the floor: walls climb into blue-violet shade, and the vaults and domes keep only that and their eyes
  float deepK = smoothstep(6., mix(30., 22., room), vW.y) * 0.95;
  light = mix(light, light * uDeep * mix(0.85, 1.1, room), deepK);
  if (m == 8) light += (uDeep / max(uDeep.b, 0.2) * (0.15 + 0.2 * hush) + uPearl * (0.04 + 0.04 * hush)) * uLight;
  if (m == 8 && vW.z < uRecZ) light += (uPortalCol * 0.3 + vec3(0.5, 0.52, 0.56) + uLampCol * 0.55 * smoothstep(0.7, 0.9, vUv.y)) * (0.75 + 0.25 * sin(uTime * 0.9 + vW.x * 0.4 + vW.y * 0.7)) * uLight;   // the half-dome over the portal: turquoise in every hollow, gold on every lip             // the honeycomb catches the floor's bounce: no darker than lit basalt
  light += (uDeep * 0.2 + uPearl * 0.035) * hush * hot * uLight;           // under the cloud the room is hushed, not dark: the steam's own glow fills it
  light *= mix(vec3(1.), uDeep * 1.6, 0.5 * (1. - ndl) * (1. - up));       // cool the faces turned away
  vec3 sunAdd = vec3(0.);
  if (vW.z > 127.) {
    // the cool hall is lit by its dome and by nothing else: a pool of pearl light under it, falling off toward the ends;
    // blind bays, the arch passage and every soffit are out of its sight and keep only blue-grey shade
    vec3 toD = vec3(0., 62., 191.) - vW; float dd = length(toD) + 1e-3; vec3 Dn = toD / dd;
    float rdc = length(vW.xz - vec2(0., 191.));
    float see = max(dot(N, Dn), 0.), lobe = max(Dn.y, 0.); lobe *= sqrt(lobe);
    float occ = max(smoothstep(45.3, 47.4, abs(vW.x)), smoothstep(130.7, 128.8, vW.z));
    float kd = 1.35 * see * lobe / (1. + dd * dd / 5200.) * (1. - 0.8 * occ) * (1. - 0.75 * smoothstep(7., 28., vW.y));   // the upper walls stand in shade
    float upc = up * up * (3. - 2. * up);
    vec3 amb = mix(uDeep * 0.5 + uHoney * 0.02, uPearl * 0.36, upc * (0.4 + 0.6 * upc)) * (1. - 0.3 * occ);
    amb += uPearl * 0.2 * (1. - up) / (1. + rdc * rdc / 1500.);               // the bright floor under the dome, thrown back up
    vec3 lcool = amb * uRoomAmb + uPearl * uRoomKey * kd;
    // the fountain stands in the sun the eyes let in: its flank toward the sun is lit by what the water throws up, crawling
    float fz = (1. - smoothstep(6.5, 9.5, rdc)) * (1. - smoothstep(9.5, 12., vW.y));
    vec2 hs = normalize(-uSunC.xz + vec2(1e-4, 0.)); hs = vec2(hs.x * 0.825 - hs.y * 0.565, hs.x * 0.565 + hs.y * 0.825);   // (from the sun's side, swung west: the side we come from)
    vec3 Kf = normalize(vec3(hs.x, 0.3, hs.y));
    float sideK = smoothstep(-0.25, 0.65, dot(N, Kf));
    lcool *= 1. - 0.35 * fz * (1. - sideK);
    lcool += uBeamCol * fz * sideK * (0.5 + 0.85 * hCaustic(vW.xz * 0.5 + vW.y * 0.37));
    // inside the dome the plaster glows with what the floor sends back
    float inD = smoothstep(41., 48., vW.y);
    lcool = mix(lcool, uDeep * (0.62 + 0.3 * smoothstep(46., 78., vW.y)) + uPearl * 0.05, inD);
    light = lcool * uLight;
    float nl = dot(N, -uSunC);
    if (nl > 0.) sunAdd = hCoolStars(vW, ewS) * (0.3 + 0.7 * smoothstep(0., 0.5, nl)) * uStarGain * uLight * (1. - inD);
  }
  if (vW.z < uRecZ) {                                                       // the recess: dimmer, and the portal's glow on what faces it
    vec3 tp = uGlow.xyz - vW; float dp = length(tp) + 1e-3;
    light = light * 0.8 + uPortalCol * (0.2 + 0.8 * max(dot(N, tp / dp), 0.)) * 0.5 / (1. + dp * dp / 300.) * uLight;
  }
  if (vW.z > 63.2) {                                                        // caustics thrown up from the water of the cool hall and warm room
    float cw = vW.z > 127. ? ((m == 3 ? 1.1 * smoothstep(0.1, -0.5, N.y) * smoothstep(11., 6., vW.y) : 0.) + (m == 1 ? 0.11 * smoothstep(44., 50., vW.y) : 0.) + (m == 0 ? 0.1 * smoothstep(21., 27., vW.y) : 0.))
                           : (m == 1 ? 0.2 * smoothstep(17., 24., vW.y) : 0.);
    if (cw > 0.) light += uPearl * cw * hCaustic(vW.xz * 0.42 + vW.y * 0.3) * uLight;
  }
  if (vW.z < uRecZ && m == 1) light += uPearl * 0.14 * smoothstep(22., 27., vW.y) * hCaustic(vW.xz * 0.36 + vW.y * 0.3) * uLight;   // the wet floor's light crawling on the recess vault
  alb += vec3(0.03, 0.031, 0.035) * room * (1. - alb);                      // the world's rooms: no black basalt
  // hanging lamps and the furnace mouth: amber pools on whatever is near them
  vec3 Rl = reflect(-V, N); float lampD = 0., lampS = 0.;
  for (int i = 0; i < ${ge}; i++) {
    vec4 l = uLamp[i];
    vec3 d = vec3(l.w < 0. && vW.x < 0. ? -l.x : l.x, l.y, l.z) - vW;
    float d2 = dot(d, d) + 1e-3;
    float att = abs(l.w) * max(1. / (1. + d2 / 26.) - 0.08, 0.) * (1. + 0.07 * sin(uTime * (4.3 + float(i) * 0.37) + float(i) * 2.1));
    vec3 dn = d / sqrt(d2);
    lampD += att * (0.22 + 0.78 * max(dot(N, dn), 0.));
    float sp = max(dot(Rl, dn), 0.); sp *= sp; sp *= sp; sp *= sp; lampS += att * sp * sp;
  }
  light += uLampCol * lampD * (1. + 0.45 * hush);
  vec3 col = alb * light;
  if (m == 8) col += uDeep * uLight * (0.12 * smoothstep(0.76, 0.95, vUv.y) + 0.07 * pow(max(1. - max(dot(N, V), 0.), 0.), 2.));   // a faint blue rim on every cell

  // ---- wet sheen: the pearl dome mirrored in the film of water, with the eyes as soft glints
  if (gloss > 0.) {
    vec3 Ng = N;
    if (wetGlint > 0.5 && wetGlint < 1.5) {                                 // the film is never still: slow ripples tilt the mirror
      vec2 rip = vec2(hNoise(vW.xz * 0.55 + uTime * vec2(0.5, 0.3)), hNoise(vW.xz * 0.55 + 31. - uTime * vec2(0.35, 0.45))) - 0.5;
      Ng = normalize(N + vec3(rip.x, 0., rip.y) * 0.11);
    }
    vec3 R = reflect(-V, Ng);
    float fres = 0.04 + 0.96 * pow(max(1. - max(dot(Ng, V), 0.), 0.), 5.);
    vec3 env = mix(uDeep * 0.3, uDeep * 0.5 + uPearl * (wetGlint > 0.5 && wetGlint < 1.5 ? 0.1 : 0.24), smoothstep(-0.1, 0.5, R.y)) * uLight;
    float spec = pow(max(dot(R, toL / dl), 0.), 28.);                       // the glowing dome itself, as a soft highlight
    if (wetGlint > 0.5) {
      vec2 q = R.xz / max(R.y + 0.35, 0.2) * 3.1 + vW.xz * 0.012;
      vec4 hc = hHexCell(q + 0.25 * hFbm(vW.xz * 0.6 + uTime * 0.05));
      float eye = smoothstep(0.16, 0.05, length(hc.xy)) * step(0.05, R.y) * step(hHash(hc.zw + 3.), 0.75);
      env += uBeamCol * eye * (wetGlint < 1.5 ? 0.22 : 1.6) * hCloud(vW.z, 1.);      // (on the wet floor only a faint memory of the roof: the stars at the shafts' feet are the lights there)
      if (wetGlint < 1.5) {
        // drip rings widening on the film, two sizes
        vec2 g = vW.xz / 11.; vec2 gi = floor(g); vec2 gc = (gi + 0.25 + 0.5 * vec2(hHash(gi + 1.3), hHash(gi + 7.7))) * 11.;
        float ph = fract(uTime * 0.31 + hHash(gi + 2.9)); float rr = length(vW.xz - gc);
        float rings = (1. - ph) * smoothstep(0.35, 0., abs(rr - ph * 3.6)) * step(hHash(gi + 5.1), 0.7);
        g = vW.xz / 6.3 + 3.7; gi = floor(g); gc = (gi + 0.25 + 0.5 * vec2(hHash(gi + 4.3), hHash(gi + 8.1)) - 3.7) * 6.3;
        ph = fract(uTime * 0.47 + hHash(gi + 6.9)); rr = length(vW.xz - gc);
        rings += 0.8 * (1. - ph) * smoothstep(0.22, 0., abs(rr - ph * 2.2)) * step(hHash(gi + 1.1), 0.55);
        env *= 1. + 1.1 * rings;
        // the portal's glow laid down the wet floor of the recess as a long broken streak
        if (uGlow.w > 0. && vW.z < uRecZ + 3. && R.z < -0.02) {
          float tg = (uGlow.z - vW.z) / R.z; vec3 hp = vW + R * tg;
          float sx = (hp.x - uGlow.x) / 6.2, sy = (hp.y - uGlow.y) / 12.;
          env += uPortalCol * 1.25 * uGlow.w * exp(-sx * sx - sy * sy) * (0.55 + 0.9 * hNoise(vW.xz * 1.3 + vec2(0., uTime * 0.8)));
        }
        if (vW.z < uRecZ + 3.) {                                              // the chamber's polished floor carries every lamp as a long amber streak laid toward the eye
          float rl = max(length(R.xz), 1e-3); vec2 rn = R.xz / rl; float rel = R.y / rl; float streak = 0.;
          for (int i = 0; i < ${ge}; i++) {
            vec4 l = uLamp[i];
            vec3 d = vec3(l.w < 0. && vW.x < 0. ? -l.x : l.x, l.y, l.z) - vW;
            float dl = max(length(d.xz), 1e-3); vec2 dn = d.xz / dl; float del = d.y / dl;
            float ea = (rn.x * dn.y - rn.y * dn.x) / 0.034, ee = (rel - del) / (0.12 + 0.5 * del);
            streak += abs(l.w) * exp(-ea * ea - ee * ee) * step(0., dot(rn, dn)) / (1. + dl * dl / 2600.);
          }
          env += uLampCol * streak * 0.75 * (0.45 + 1.1 * hNoise(vW.xz * 2.7 + uTime * vec2(0.3, -0.4)));
        }
      }
    }
    if (m == 11) {                                                          // metal: mostly mirror, tinted by itself
      col = alb * (light * 0.5 + env * 0.8 + uPearl * spec * 1.6 * uLight + uPearl * pow(max(1. - max(dot(Ng, V), 0.), 0.), 3.) * 0.25 * uLight + uLampCol * lampS * 1.5);
    } else {
      col = mix(col, env, clamp(fres * gloss * 1.25 + 0.05 * gloss, 0., 1.));
      if (m == 3 || m == 4) col += uPearl * spec * gloss * 0.5 * uLight;
      col += uLampCol * lampS * gloss * 0.9;
    }
  }
  if (m == 12) {                                                            // lit glass behind a brass lattice; a fire behind bars
    float flick = 0.88 + 0.12 * sin(uTime * 6.3 + vW.x * 1.7 + vW.z * 2.3) * sin(uTime * 2.1 + vW.z);
    if (vUv.y < 1.5) {
      vec2 lg = vec2(vUv.x * 2.2, vUv.y * 3.);
      float lat = min(abs(fract(lg.x + lg.y) - 0.5), abs(fract(lg.x - lg.y) - 0.5));
      float open = smoothstep(0.05, 0.14, lat) * smoothstep(0., 0.08, vUv.y) * smoothstep(1., 0.92, vUv.y);
      float facing = max(dot(N, V), 0.);
      col = mix(uBrass * 0.3 * (light + uLampCol * 0.4), vCol * (0.7 + 0.9 * facing * facing) * flick, open);
    } else {
      float fv = vUv.y - 2.;
      float f1 = hFbm(vec2(vUv.x * 1.1, fv * 2.2 - uTime * 1.5) + 3.), f2 = hNoise(vec2(vUv.x * 2.7 + 9., fv * 4. - uTime * 3.1));
      float fire = smoothstep(0.25, 0.85, f1 * 0.7 + f2 * 0.3 + (1. - fv) * 0.55 - 0.25);
      col = vCol * (0.12 + 1.5 * fire) * mix(0.05, 1., smoothstep(0.1, 0.17, abs(fract(vUv.x / 0.9) - 0.5))) * flick;
    }
  }

  col = max(col + mix(alb * 1.5 + 0.03, alb * 2.4 + 0.25, smoothstep(0.3, 0.7, N.y)) * sunAdd, 0.);      // (on a wall it is light on stone: the stone shows through)                                        // a star or hexagon of sun from one of the cool hall's eyes
  // ---- steam: the layer above the underside glows pearl and thickens with the length of sight through it
  vec3 seg = vW - cameraPosition; float sl = length(seg);
  float yhi = max(vW.y, cameraPosition.y), ylo = min(vW.y, cameraPosition.y);
  float frac = clamp((yhi - max(ylo, uSteamBase)) / max(yhi - ylo, 0.5), 0., 1.);
  frac = max(frac, 0.2 * smoothstep(0., 1., uHaze));
  float haze = 1. - exp(-sl * frac * 0.0042 * uHaze);
  col = mix(col, (uSteam * 0.07 + uDeep * 0.3) * uLight, haze);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,et=`
attribute vec3 aEye; attribute vec3 aNrm; attribute vec4 aDome; attribute vec4 aParam; attribute vec2 aShape; attribute float aSel;   // aSel: 1 a principal shaft, about 0.3 a pale far one, 0 glass only
// aParam: x delay (m), y 1 = accent glass, z random, w 0 great dome / 1 corner dome / 2 + beam gain: a room of the world.   aShape: x 0 star / 1 hexagon, y scale
`,Qt=`
${et}
varying vec2 vQ; varying vec3 vW, vTint; varying vec4 vP; varying float vShape;
#include <fog_pars_vertex>
${J}
void main(){
  vTint = uGlass[int(clamp(aParam.y, 0., 4.) + 0.5)];
  vec3 n = aNrm; vec3 t1 = normalize(cross(n, abs(n.y) > 0.95 ? vec3(1., 0., 0.) : vec3(0., 1., 0.))); vec3 t2 = cross(n, t1);
  vW = aEye + n * 0.15 + (t1 * position.x + t2 * position.y) * 1.9 * aShape.y;
  vQ = position.xy / 0.316; vShape = aShape.x;
  vP = vec4(aParam.y, aParam.z, hCloud(aEye.z, aParam.z), 0.);
  vec4 mvPosition = viewMatrix * vec4(vW, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Vt=`
uniform vec3 uPearl, uShade, uBeamCol, uAccentGlow, uSunL;
uniform float uEyeGain;
varying vec2 vQ; varying vec3 vW, vTint; varying vec4 vP; varying float vShape;
#include <fog_pars_fragment>
float eStar(vec2 p, float r){ float a = max(abs(p.x) * 0.8660254 + p.y * 0.5, -p.y), b = max(abs(p.x) * 0.8660254 - p.y * 0.5, p.y); return min(a, b) - r * 0.5; }
float eHex(vec2 p, float r){ p = abs(p); return max(p.x * 0.8660254 + p.y * 0.5, p.y) - r; }
float eHash(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
${Le}
void main(){
  float sd = vShape < 0.5 ? eStar(vQ, 1.25) : eHex(vQ, 0.86);
  float r = length(vQ);
  vec3 tint = vTint;
  vec3 V = normalize(cameraPosition - vW);
  float lit = vP.z;
  float hot = pow(max(dot(V, uSunL), 0.), 60.) * 5. + exp(-r * r * 5.) * 2.2;
  float bub = step(0.83, eHash(floor(vQ * 9.) + vP.y * 31.)) * smoothstep(0.25, 0.05, abs(r - 0.62));
  vec3 glass = tint * (2.6 + hot * 1.4 + bub * 1.6) * lit * uEyeGain + uShade * 0.2 * (1. - lit);
  float collar = clamp(sd / 1.1, 0., 1.);
  vec3 reveal = uPearl * mix(0.2, 0.5, collar) + tint * 0.5 * exp(-sd * 3.5) * lit;
  vec3 col = mix(glass, reveal, smoothstep(-0.03, 0.03, sd));
  float a = 1. - smoothstep(1.0, 1.9, sd);
  float keep = sqrt(hFogKeep());
#ifdef USE_FOG
  col = mix(fogColor, col, keep);
#endif
  gl_FragColor = vec4(col * a, a);
}`,jt=`
${et}
uniform float uBeamW;
varying vec3 vW, vN, vTint; varying vec4 vP;
#include <fog_pars_vertex>
${J}
${At}
void main(){
  vec3 L = uSunL; vec3 n; float show;
  vTint = uGlass[int(clamp(aParam.y, 0., 4.) + 0.5)] * (aParam.y > 0.5 ? 1.35 : 1.);
  float len = hLand(aEye, aDome, aParam.w, L, n, show);
  vec3 A = normalize(cross(L, vec3(0., 0., 1.) + vec3(1e-3, 0., 0.))), B = cross(L, A);
  float t = position.y * len;
  float dAxis = length(cross(cameraPosition - aEye, L));
  float gainW = aParam.w > 1.5 ? aParam.w - 2. : 1.;      // the world's rooms: 2 + gain (0 = clear air, no beam)
  float hall = step(1.5, aParam.w);
  // a principal shaft of the hot room is a metre and more of light, widening toward the floor; a pale far one a third of that
  float rad = aShape.y * mix(uBeamW * 2.3 * mix(0.58, 1., smoothstep(0.2, 0.8, aSel)), uBeamW, hall) * mix(0.62, 1.0, clamp(t / max(aEye.y / max(-L.y, 0.05), 1.), 0., 1.));
  rad = min(rad, max(mix(0.3, 0.026, hall) * dAxis, 0.04));      // (a shaft we pass close by keeps its width and fades instead: see vP.z)
  rad *= mix(1., mix(0.72, 0.45, hall), smoothstep(22., 70., dAxis));   // the far ones draw in
  vN = A * position.x + B * position.z;
  vW = aEye + L * t + vN * rad * step(0.01, aSel);
  vP = vec4(aParam.x, aParam.y, hCloud(aEye.z, aParam.z) * smoothstep(mix(3., 5., hall), mix(9., 17., hall), dAxis) * gainW * aSel, aParam.z);
  vec4 mvPosition = viewMatrix * vec4(vW, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Kt=`
uniform vec3 uBeamCol, uAccentBeam;
uniform float uBeamGain;
uniform vec4 uGlow;
varying vec3 vW, vN, vTint; varying vec4 vP;
#include <fog_pars_fragment>
${J}
${Le}
void main(){
  vec3 V = normalize(cameraPosition - vW);
  float f = abs(dot(normalize(vN + vec3(1e-5)), V));
  f = clamp(f / max(length(cross(V, uSunL)), 0.3), 0., 1.);      // the same core-and-skin profile however obliquely the rod is seen
  float nz = hNoise3(vec3(vW.xz * 1.3, vW.y * 0.3 + uTime * 0.9) + vP.w * 17.);
  float cx = clamp(sqrt(max(1. - f * f, 0.)) + 0.13 * (nz - 0.5), 0., 1.);   // 0 on the rod's axis, 1 at its skin
  float edge = max(exp(-cx * cx * 4.4) - 0.012, 0.);                        // bright along the axis, falling softly to nothing at the skin: a rod with clear air beside it
  float gh = vW.y - (uSteamBase + vP.x);
  float grow = smoothstep(0., 6., gh);
  grow *= 1. + 2.2 * (1. - smoothstep(5., 26., gh)) * smoothstep(-13., 2., uSteamBase);   // the growing end is the brightest: the steam is thickest at its underside
  // steam rolling through the shaft: slow billows sinking, finer wisps sliding down the rod
  float r1 = hNoise3(vec3(vW.xz * 0.14 + uTime * vec2(0.22, 0.15), vW.y * 0.1 + uTime * 0.4) + vP.w * 9.);
  float r2 = hNoise3(vec3(vW.xz * 0.45 - uTime * vec2(0.4, 0.5), vW.y * 0.33 + uTime * 1.7));
  float roll = clamp(0.26 + 1.7 * smoothstep(0.22, 0.78, r1) * (0.45 + 1.1 * r2), 0.26, 1.9);         // light shows where the steam is: brightest where a billow drifts through the shaft, never quite gone between
  // near shafts stand bright, far ones pale in the haze
  float far = mix(0.24, 1., exp(-max(length(cameraPosition - vW) - 16., 0.) * 0.021));
  // no beam veils the way out: where a rod crosses the line of sight to the portal it thins
  vec3 toP = uGlow.xyz - cameraPosition; float lp = length(toP) + 1e-3;
  float win = mix(1., mix(0.1, 1., smoothstep(0.9976, 0.9877, dot(-V, toP / lp))), step(0.001, uGlow.w));
  float a = edge * grow * roll * vP.z * uBeamGain * far * win * hFogKeep();
  a = 0.5 * a / (1. + 1.1 * a);                                // always see-through: the room shows through every shaft, and the steam's texture stays in it
  gl_FragColor = vec4(vTint * a, 1.);
}`,Wt=`
${et}
uniform float uWallStar;      // 0: this mesh draws the stars that land on floors and water, 1: those on walls and domes
varying vec2 vQ; varying vec4 vP; varying float vShape; varying vec3 vTint;
#include <fog_pars_vertex>
${J}
${At}
void main(){
  vec3 L = uSunL; vec3 n; float show;
  float len = hLand(aEye, aDome, aParam.w, L, n, show);
  vec3 hit = aEye + L * len;
  vTint = uGlass[int(clamp(aParam.y, 0., 4.) + 0.5)] * (aParam.y > 0.5 ? 1.6 : 1.);
  vec3 A = normalize(cross(L, vec3(0., 0., 1.) + vec3(1e-3, 0., 0.))), B = cross(L, A);
  float ln = dot(L, n); ln = ln < 0. ? min(ln, -0.17) : 0.17;
  vec3 A2 = A - L * dot(A, n) / ln, B2 = B - L * dot(B, n) / ln;
  float rad = aShape.y * mix(0.6, 1.0, clamp(len / max(aEye.y / max(-L.y, 0.05), 1.), 0., 1.));
  float wall = 1. - step(0.5, n.y), pick = (1. - abs(wall - uWallStar)) * max(step(0.01, aSel), wall);      // on the floor one star for each standing shaft and none for the rest; walls and domes keep the soft light of every eye
  float selK = smoothstep(0.2, 0.8, aSel); rad *= mix(0.7, mix(1.5, 1., step(1.5, aParam.w)), selK);
  vec3 wp = hit + n * 0.07 + (A2 * position.x + B2 * position.y) * rad * 2.8 * pick;
  vQ = position.xy * 2.8; vShape = aShape.x;
  float grown = 1. - smoothstep(-4., 2., uSteamBase + aParam.x - hit.y);
  vP = vec4(grown * show * hCloud(aEye.z, aParam.z) * clamp(abs(dot(L, n)) * 1.25, 0.12, 1.) * pick * mix(0.5, 1., selK), aParam.y, aParam.z, wall);
  float wy = aParam.w > 1.5 ? aDome.w : ${Me.toFixed(1)};
  if (wall < 0.5 && wy > 0.01 && abs(hit.y - wy) < 0.03) vP.w = 0.25;      // it lies on water: the fragment shader breaks it into glints
  vec4 mvPosition = viewMatrix * vec4(wp, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ct=`
uniform vec3 uBeamCol, uAccentBeam;
uniform float uStarGain, uTime;
varying vec2 vQ; varying vec4 vP; varying float vShape; varying vec3 vTint;
#include <fog_pars_fragment>
float sStar(vec2 p, float r){ float a = max(abs(p.x) * 0.8660254 + p.y * 0.5, -p.y), b = max(abs(p.x) * 0.8660254 - p.y * 0.5, p.y); return min(a, b) - r * 0.5; }
float sHex(vec2 p, float r){ p = abs(p); return max(p.x * 0.8660254 + p.y * 0.5, p.y) - r; }
${Le}
void main(){
  float sd = vShape < 0.5 ? sStar(vQ, 1.25) : sHex(vQ, 0.86);
  if (vP.w > 0.5) {      // on a wall or a dome it is light on stone: soft-edged, and (by this mesh's blending) it multiplies what is there, so courses, joints and block colour show through
    float soft = smoothstep(0.3, -0.22, sd) * (0.85 + 0.15 * sin(uTime * 1.9 + vP.z * 40. + vQ.x * 2.1));
    gl_FragColor = vec4(vTint * soft * 3.4 * vP.x * min(uStarGain, 1.), 1.);
    return;
  }
  if (vP.w > 0.1) {      // on water a star is a patch of glints: the ripples break its outline and only their crests carry the light
    float w1 = sin(vQ.x * 5.1 + uTime * 1.3 + vP.z * 30.) * sin(vQ.y * 4.3 - uTime * 1.1 + vP.z * 17.);
    float w2 = sin((vQ.x + vQ.y) * 8.7 + uTime * 2.1) * sin((vQ.x - vQ.y) * 7.3 - uTime * 1.7 + vP.z * 9.);
    float soft = smoothstep(0.3, -0.25, sd + 0.3 * w1);
    float crest = max(w2, 0.) * max(w1 + 0.45, 0.);
    gl_FragColor = vec4(vTint * soft * (0.1 + 1.9 * crest) * vP.x * uStarGain * hFogKeep(), 1.);
    return;
  }
  float core = smoothstep(0.05, -0.03, sd);
  float r2 = dot(vQ, vQ);
  float halo = exp(-r2 * 1.1) * 0.16 * (1. - smoothstep(5., 7.8, r2));       // a little of itself blurred in the wet, close in: the marble round it stays dark
  halo *= 1. + 0.55 * sin(sqrt(r2) * 5.5 - uTime * 3.6 + vP.z * 20.);                        // rings running out through the wet
  core *= 0.74 + 0.36 * sin(uTime * 2.3 + vP.z * 40. + vQ.x * 2.1) * sin(uTime * 1.6 + vQ.y * 1.7 + vP.z * 13.)
        + 0.22 * sin(uTime * 5.1 + vP.z * 71. + (vQ.x + vQ.y) * 3.3);                        // steam crossing the shaft
  vec3 col = vTint * (core * 2.3 + halo) * vP.x * uStarGain * hFogKeep();
  gl_FragColor = vec4(col, 1.);
}`,Lt=`
varying vec3 vW; varying vec2 vUv;
#include <fog_pars_vertex>
void main(){
  vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vUv = uv;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,$t=`
uniform vec3 uPearl, uSteam, uHoney, uBasalt, uShade, uBeamCol, uPortalCol, uRoomKey, uRoomAmb;
uniform float uHaze, uLight;
uniform vec4 uFount;      // a fountain standing in the water: x, z, the radius where its water lands, strength
uniform vec4 uGlow;       // the exit portal: x, y, z of its centre, strength
uniform vec4 uLamp[${ge}]; uniform vec3 uLampCol;
varying vec3 vW; varying vec2 vUv;
#include <fog_pars_fragment>
${J}
${St}
float wH(vec2 p){ return hFbm(p * 0.42 + vec2(uTime * 0.14, -uTime * 0.1)) + 0.2 * hFbm(p * 1.5 - vec2(uTime * 0.23, uTime * 0.07)); }
float wArch(float cls, float s){ float hs = cls < 0.5 ? 18. : 17., c = cls < 0.5 ? 4.8 : 3.45; float R = 10. + c, x = min(abs(s), 10.) + c; return hs + sqrt(max(R * R - x * x, 0.)); }
void main(){
  vec2 p = vW.xz; vec3 V = normalize(cameraPosition - vW);
  float fw = length(fwidth(p));                                            // metres of water under one pixel
  float ewS = clamp(0.45 * length(fwidth(vW)), 0.03, 0.22);
  float room = vW.z > 127. ? 2. : (vW.z > 63.2 ? 1. : 0.);                 // 2 the cool hall, 1 the warm room, 0 the hot room
  float e = 0.3; float h0 = wH(p);
  vec2 g = vec2(wH(p + vec2(e, 0.)) - h0, wH(p + vec2(0., e)) - h0) / e;
  // fine wavelets near the eye: four trains of crests bent by a slow noise, each fading out where a pixel can no longer hold it
  vec2 pq = p + 0.5 * vec2(hNoise(p * 0.6 + uTime * 0.11), hNoise(p * 0.6 + 9.3 - uTime * 0.09));
  vec2 wv = vec2(0.8, 0.6) * cos(dot(pq, vec2(0.8, 0.6)) * 4.7 - uTime * 2.2) * 0.2 * (1. - smoothstep(0.9, 2.2, 4.7 * fw));
  wv += vec2(-0.6, 0.8) * cos(dot(pq, vec2(-0.6, 0.8)) * 7.9 - uTime * 3.0) * 0.2 * (1. - smoothstep(0.9, 2.2, 7.9 * fw));
  wv += vec2(0.28, -0.96) * cos(dot(pq, vec2(0.28, -0.96)) * 12.7 - uTime * 3.9) * 0.18 * (1. - smoothstep(0.9, 2.2, 12.7 * fw));
  wv += vec2(-0.96, -0.28) * cos(dot(pq, vec2(-0.96, -0.28)) * 19.3 - uTime * 5.3) * 0.15 * (1. - smoothstep(0.9, 2.2, 19.3 * fw));
  g += wv;
  // rings from drips and from the basins' running taps
  vec2 c = vW.xz / 7.; vec2 ci = floor(c); vec2 cc = (ci + 0.25 + 0.5 * vec2(hHash(ci + 1.3), hHash(ci + 7.7))) * 7.;
  float ph = fract(uTime * 0.36 + hHash(ci + 2.9)); vec2 dv = p - cc; float rr = length(dv) + 1e-3;
  float ring = (1. - ph) * sin((rr - ph * 4.) * 5.) * smoothstep(1.4, 0., abs(rr - ph * 4.));
  g += dv / rr * ring * 1.2;
  // rings running out from where the fountain's threads land, and the broken white water there
  vec2 fv = p - uFount.xy; float fr = length(fv) + 1e-3;
  float fk = uFount.w * smoothstep(uFount.z + 14., uFount.z + 1., fr) * smoothstep(uFount.z - 1.4, uFount.z - 0.2, fr);
  g += fv / fr * sin((fr - uTime * 2.4) * 4.2 + 1.5 * hNoise(p * 0.6)) * fk * 2.2;
  float foam = uFount.w * smoothstep(1.2, 0., abs(fr - uFount.z - 0.15)) * (0.25 + 0.75 * hNoise(p * 3.1 + uTime * vec2(1.3, -0.9)))
             * (0.55 + 0.45 * cos(atan(fv.x, fv.y + 1e-4) * 12. + 3.14159));
  vec3 N = normalize(vec3(-g.x * 0.085, 1., -g.y * 0.085));      // calm water: fine ripples, long unbroken reflections
  vec3 R = reflect(-V, N); R.y = abs(R.y) + 1e-3;
  float fres = 0.05 + 0.95 * pow(max(1. - max(dot(N, V), 0.), 0.), 5.);
  // ---- what the surface mirrors: the vault or dome overhead ...
  vec3 env = mix(uDeep * 0.3, uPearl * 0.08 + uDeep * 0.5, smoothstep(-0.05, 0.55, R.y)) * uLight;
  float domeRef = 1., poolK = 1.;
  if (room > 1.5) {                                                        // the cool hall's water mirrors a dark ceiling with one bright dome in it
    vec2 hp = p + R.xz * (40. - vW.y) / max(R.y, 0.03); float rdh = length(hp - vec2(0., 191.));
    domeRef = 1. - smoothstep(27., 37., rdh);
    env = mix(uDeep * 0.36 + uPearl * 0.03, uPearl * 0.14 + uDeep * 0.55, domeRef) * uLight;
    float rdc = length(p - vec2(0., 191.)); poolK = 0.5 + 0.7 / (1. + rdc * rdc / 1500.);
  }
  // ... the wall we travel toward, its striped courses, tiled dado and arch, and what glows beyond the opening ...
  if (R.z < -0.03) {
    float zw = room > 1.5 ? 131. : (room > 0.5 ? 63.3 : -55.);
    float tw = (zw - vW.z) / R.z; vec3 hp = vW + R * tw;
    float top = room > 1.5 ? 40. : (room > 0.5 ? 38. : 32.), halfW = room > 1.5 ? 45. : (room > 0.5 ? 30. : 62.);
    float aH = wArch(room > 1.5 ? 1. : 0., hp.x);
    float open = (1. - smoothstep(9.6, 10.2, abs(hp.x))) * (1. - smoothstep(aH - 0.4, aH + 0.4, hp.y));
    float course = floor(hp.y / 2.5);
    vec3 wc = (mod(course, 2.) < 0.5 ? uBasalt * 0.95 : uHoney * 0.85) * (0.78 + 0.44 * hHash(vec2(floor(hp.x / 3.3 + course * 0.37), course)));
    wc = mix(wc, vec3(0.03, 0.3, 0.34), step(hp.y, 5.));                   // the tiled dado
    wc = mix(wc, uPearl * 0.6, step(20., hp.y));                           // plaster above the courses
    float ringK = step(abs(hp.x), 12.4) * step(hp.y, aH + 2.4) * step(14., hp.y);
    wc = mix(wc, mod(floor(atan(hp.x + 1e-4, hp.y - 16.) * 8.), 2.) < 0.5 ? uHoney * 0.9 : uBasalt * 0.95, ringK);   // the striped ring of the arch
    vec3 wl = mix(vec3(0.52), uDeep * 0.6, smoothstep(5., 24., hp.y)) * uLight * (room > 0.5 ? 0.5 * (uRoomKey + uRoomAmb) : vec3(1.));
    vec3 thru = room > 1.5 ? uDeep * 0.24 + uLampCol * 0.1 : (room > 0.5 ? uDeep * 0.3 + uSteam * 0.1 + uBeamCol * 0.1 * hCloud(0., 1.) : uDeep * 0.24 + uLampCol * 0.05);
    if (room < 0.5 && uGlow.w > 0.) {                                      // the portal at the end of the recess
      float tg = (uGlow.z - vW.z) / R.z; vec3 gp = vW + R * tg;
      float gx = (gp.x - uGlow.x) / 7., gy = (gp.y - uGlow.y) / 9.5;
      thru += uPortalCol * 1.3 * exp(-gx * gx - gy * gy);
      float tq = (14.4 - vW.z) / R.z, py = vW.y + R.y * tq;                  // the platform stands before that wall
      float pk = step(0., tq) * (1. - smoothstep(2.3, 2.6, py)) * (1. - smoothstep(5.6, 6.2, abs(vW.x + R.x * tq)));
      wc = mix(wc, uPearl * 0.8, pk); open *= 1. - pk;
    }
    float wm = (1. - smoothstep(top - 1., top + 1., hp.y)) * (1. - smoothstep(halfW - 1., halfW + 1., abs(hp.x))) * step(0., tw);
    env = mix(env, mix(wc * wl, thru * uLight, open), wm * 0.9);
  }
  if (vW.z < -57. && uGlow.w > 0. && R.z < -0.02) {                       // the chamber's pool mirrors the portal
    float tg = (uGlow.z - vW.z) / R.z; vec3 gp = vW + R * tg;
    float gx = (gp.x - uGlow.x) / 7., gy = (gp.y - uGlow.y) / 9.5;
    env += uPortalCol * 1.1 * exp(-gx * gx - gy * gy) * uLight;
  }
  // ... and the fountain, standing white in the pool
  if (uFount.w > 0.) {
    vec2 fo = uFount.xy - p; float tF = dot(fo, R.xz) / max(dot(R.xz, R.xz), 1e-4);
    float dm = length(fo - R.xz * tF), hF = vW.y + R.y * tF;
    float pr = 0.95 + 4.3 * exp(-(hF - 3.3) * (hF - 3.3) * 2.2) + 2.6 * exp(-(hF - 5.8) * (hF - 5.8) * 3.) + 1.3 * exp(-(hF - 7.85) * (hF - 7.85) * 4.);
    float fm = smoothstep(pr + 0.3, pr - 0.3, dm) * step(0., tF) * (1. - smoothstep(8.8, 9.6, hF));
    float veil = 0.4 * smoothstep(5.9, 5.2, dm) * step(0., tF) * (1. - smoothstep(3.0, 3.6, hF)) * (0.6 + 0.4 * sin(atan(fo.x, fo.y + 1e-4) * 24.));   // the threads falling from its lowest lip
    env = mix(env, uPearl * (0.5 + 0.2 * smoothstep(2., 8., hF)) * uLight * uRoomKey, max(fm, veil) * uFount.w);
  }
  vec2 q = R.xz / max(R.y + 0.3, 0.2) * 2.5 + p * 0.012;                   // the eyes overhead, as soft glints
  const vec2 s = vec2(1., 1.7320508);
  vec4 hC = floor(vec4(q, q - vec2(0.5, 1.)) / s.xyxy) + 0.5; vec4 hh = vec4(q - hC.xy * s, q - (hC.zw + 0.5) * s);
  bool first = dot(hh.xy, hh.xy) < dot(hh.zw, hh.zw);
  vec2 hl = first ? hh.xy : hh.zw; vec2 hid2 = first ? hC.xy : hC.zw + 0.5;
  // (only where the water is seen steeply, near the bowl: far water keeps broad calm reflections)
  env += uBeamCol * smoothstep(0.2, 0.05, length(hl)) * 0.7 * smoothstep(0.09, 0.34, R.y) * domeRef * step(hHash(hid2 + 1.9), 0.6) * hCloud(vW.z, 1.);
  // ---- the bed: inlaid marble a hand's depth down, swimming under the ripples, a fine net of caustics crawling over it
  vec2 pb = p + g * 0.16 + wv * 0.08;
  vec4 hc = hHexCell(pb / 2.6);
  float ew = clamp(fw / 2.6 * 1.2, 0.012, 0.3);
  float ds = hStar(hc.xy, 0.43), dh = hHex(hc.xy, 0.15), db = hHex(hc.xy.yx, 0.468);
  float hid = hHash(hc.zw + 3.1);
  vec3 turq = vec3(0.04, 0.36, 0.4), cob = vec3(0.03, 0.08, 0.42);
  vec3 bed = uPearl * (0.5 + 0.14 * hFbm(pb * 0.6 + 3.));
  bed = mix(bed, room > 0.5 && room < 1.5 ? uHoney * 0.8 : turq, smoothstep(ew, -ew, ds));
  bed = mix(bed, hid < 0.28 ? (room > 0.5 && room < 1.5 ? turq : uHoney * 0.85) : cob, smoothstep(ew, -ew, dh));
  bed = mix(bed, uBasalt * 0.8, smoothstep(-ew, ew, db));
  bed *= 1. - 0.3 * smoothstep(ew * 1.5, 0., min(abs(ds), abs(dh)));
  bed = mix(vec3(dot(bed, vec3(0.3, 0.5, 0.2))), bed, 0.7) * vec3(0.3, 0.5, 0.56);        // seen through deep green water: a step darker and quieter than the floors beside it
  vec2 cq = pb * 2.1 + 0.6 * vec2(hNoise(p * 0.5 + uTime * 0.2), hNoise(p * 0.5 + 5.1 - uTime * 0.17));
  float ce = hVor(cq);
  float net = smoothstep(0.13, 0., ce); net = net * net + 0.22 * smoothstep(0.42, 0., ce);
  bed *= mix(1., 0.9 + 0.5 * net, (1. - smoothstep(0.06, 0.22, fw * 2.1)) * exp(-length(vW - cameraPosition) / 16.));      // a faint net, only near the eye
  vec3 col = mix(bed * uLight * 0.6 * poolK * (room > 0.5 ? 0.5 * (uRoomKey + uRoomAmb) : vec3(1.)), env, clamp(fres * 1.5 + 0.16, 0., 1.));      // the mirror leads, the inlay shows faint beneath
  col += uPearl * foam * 0.55 * uLight;
  // ---- the lamps: long broken amber paths laid toward the eye
  float rl = max(length(R.xz), 1e-3); vec2 rn = R.xz / rl; float rel = R.y / rl;
  float lampS = 0.;
  for (int i = 0; i < ${ge}; i++) {
    vec4 l = uLamp[i];
    vec3 d = vec3(l.w < 0. && vW.x < 0. ? -l.x : l.x, l.y, l.z) - vW;
    float dl = max(length(d.xz), 1e-3); vec2 dn = d.xz / dl; float del = d.y / dl;
    float ea = (rn.x * dn.y - rn.y * dn.x) / 0.026, ee = (rel - del) / (0.1 + 0.45 * del);
    lampS += abs(l.w) * exp(-ea * ea - ee * ee) * step(0., dot(rn, dn)) / (1. + dl * dl / 2600.);
  }
  col += uLampCol * lampS * 0.6 * (0.25 + 1.5 * hNoise(p * 5.5 + uTime * vec2(0.9, -1.3)));
  if (room > 1.5) {      // the eyes' stars lying on the water: glints, never a flat patch. The ripples break the outline and only the crests carry the light
    float crest = hNoise(p * 2.3 + uTime * vec2(0.7, -0.5)) * hNoise(p * 5.1 - uTime * vec2(0.9, 0.6) + 4.);
    vec3 st = hCoolStars(vW + vec3(g.x, 0., g.y) * 0.55, max(ewS, 0.3));
    col = max(col + st * (0.16 + 2.6 * crest) * mix(vec3(1.), uPearl, 0.5) * uStarGain * uLight, 0.);
  }
  vec3 seg = vW - cameraPosition; float sl = length(seg);
  float yhi = max(vW.y, cameraPosition.y), ylo = min(vW.y, cameraPosition.y);
  float frac = max(clamp((yhi - max(ylo, uSteamBase)) / max(yhi - ylo, 0.5), 0., 1.), 0.25 * uHaze);
  col = mix(col, (uSteam * 0.07 + uDeep * 0.3) * uLight, 1. - exp(-sl * frac * 0.0042 * uHaze));
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,Zt=`
uniform vec3 uPearl; uniform float uLight;
uniform vec4 uFount;
varying vec3 vW; varying vec2 vUv;
#include <fog_pars_fragment>
${J}
void main(){
  float a; vec3 col;
  if (vUv.x >= 100.) {
    // water leaving a scalloped lip: one bright thread from each cusp fraying into beads, a dribble that comes and goes
    // from each lobe, almost nothing between (vUv.x - 100 counts scallops, fract 0.5 = the cusp; vUv.y runs down the fall)
    float u = vUv.x - 100., id = floor(u), s = fract(u) - 0.5, v = vUv.y;
    float h = hHash(vec2(id, 7.3));
    float w = mix(0.04, 0.085, v) * (0.8 + 0.4 * h);
    float wob = (hNoise(vec2(id * 3.1, v * 3. - uTime * 2.6)) - 0.5) * 0.1 * v;
    float ds = abs(s - wob);
    float th = smoothstep(w, w * 0.55, ds);
    float rim = th * (0.45 + 0.55 * smoothstep(w * 0.25, w * 0.8, ds));         // a thread of water is clear in the middle and bright at its edges
    float bd = hNoise(vec2(id * 5.7, v * (9. + 6. * h) - uTime * (4.5 + 2. * h)));
    float beads = smoothstep(0.34, 0.62, bd);                                    // lower down it breaks into drops with air between
    rim *= mix(1., beads, smoothstep(0.12, 0.7, v));
    float id2 = floor(u + 0.5), s2 = 0.5 - abs(s);
    float gate = smoothstep(0.42, 0.6, hNoise(vec2(id2 * 1.9 + 3., uTime * 0.35)));
    float dr = smoothstep(0.03, 0.008, s2) * gate * smoothstep(0.35, 0.65, hNoise(vec2(id2 * 9.1, v * 11. - uTime * 6.)));
    float veil = 0.03 * (0.4 + 0.6 * hNoise(vec2(u * 3., v * 4. - uTime * 2.2)));
    a = clamp(rim * 0.5 + dr * 0.5 + veil, 0., 1.) * smoothstep(0., 0.04, v);
    float glint = hNoise(vec2(u * 31., v * 23. - uTime * 9.)); glint *= glint; glint *= glint;
    col = uPearl * (0.75 + 0.5 * rim + 3.2 * glint * (rim + dr)) * uLight;
  } else {
    float lane = hNoise(vec2(vUv.x * 1.6, 3.));
    float run = hNoise(vec2(vUv.x * 7., vUv.y * 3. - uTime * 2.2)) * 0.6 + hNoise(vec2(vUv.x * 19., vUv.y * 5. - uTime * 3.1)) * 0.4;
    a = smoothstep(0.3, 0.62, lane) * (0.3 + 0.5 * run) * smoothstep(0., 0.06, vUv.y) * (1. - 0.4 * vUv.y);
    col = uPearl * (0.7 + 0.5 * run) * uLight;
  }
  if (vW.z > 127.) {                                // the cool hall's fountain: the threads toward the sun catch it, the others stand in shade
    vec2 fd = vW.xz - uFount.xy, hs = normalize(-uSunC.xz + vec2(1e-4, 0.)); hs = vec2(hs.x * 0.825 - hs.y * 0.565, hs.x * 0.565 + hs.y * 0.825);
    float sk = smoothstep(-0.35, 0.8, dot(fd, hs) / (length(fd) + 1e-3));
    col *= mix(0.5, 1.5, sk); a = min(a * mix(0.85, 1.1, sk), 1.);
  }
  col *= 1. + 0.5 * clamp(uCloud.z - uCloud.w, 0., 1.);        // under the real cloud the running water is what glints
  gl_FragColor = vec4(col * a, a);
  #include <fog_fragment>
}`,Yt=`
attribute float aMat;
uniform float uSteamBase;
varying vec3 vW; varying float vLayer;
#include <fog_pars_vertex>
void main(){
  vec3 p = position; p.y = max(uSteamBase, 9.) + aMat * 7.;
  vec4 wp = modelMatrix * vec4(p, 1.); vW = wp.xyz; vLayer = aMat;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Xt=`
uniform vec3 uSteam; uniform float uLight, uSheet;
varying vec3 vW; varying float vLayer;
#include <fog_pars_fragment>
${J}
void main(){
  vec2 p = vW.xz * 0.03 + vLayer * 17.3 + vec2(uTime * 0.07, uTime * 0.045) * (1. + vLayer * 0.4);
  float n = hFbm(p + 0.6 * hFbm(p * 1.9 - uTime * 0.03));
  float a = smoothstep(0.36, 0.72, n) * 0.12 * (1. - smoothstep(38., 60., length(vW.xz)));
  a *= smoothstep(1.5, 9., abs(cameraPosition.y - vW.y)) * (1. - smoothstep(60., 80., vW.y)) * uSheet;
  vec3 col = (uSteam * 0.3 + uDeep * 0.25) * (0.6 + 0.25 * n) * uLight;
  gl_FragColor = vec4(col * a, a);
  #include <fog_fragment>
}`,Jt=`
attribute vec4 aPuff;     // x, z of the grille, phase, random
uniform float uSteamBase, uTime;
varying vec2 vQ; varying float vA, vR;
#include <fog_pars_vertex>
void main(){
  float t = fract(uTime * 0.05 * (0.8 + 0.4 * aPuff.w) + aPuff.z);
  float top = clamp(uSteamBase + 6., 18., 62.);
  vec3 c = vec3(aPuff.x, t * top, aPuff.y);
  c.xz += vec2(sin(uTime * 0.21 + aPuff.w * 40. + t * 5.), cos(uTime * 0.17 + aPuff.w * 23. + t * 4.)) * t * 3.5;
  float size = mix(1.8, 8.5, sqrt(t)) * (0.8 + 0.5 * aPuff.w);
  vA = smoothstep(0., 0.1, t) * (1. - smoothstep(0.55, 1., t)) * 0.11; vQ = position.xy; vR = aPuff.w;
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(c, 1.);
  vA *= smoothstep(8., 24., -mvPosition.z);                       // a column the eye passes close by thins: it never veils the room
  mvPosition.xy += position.xy * size;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,eo=`
uniform vec3 uSteam; uniform float uLight;
varying vec2 vQ; varying float vA, vR;
#include <fog_pars_fragment>
${J}
void main(){
  float d = length(vQ);
  float a = smoothstep(1., 0.15, d) * (0.45 + 0.55 * hNoise(vQ * 2.1 + vR * 30. + uTime * 0.07)) * vA;
  float hush = clamp(uCloud.z - uCloud.w, 0., 1.);                // while the real cloud passes the steam is what glows
  vec3 col = (uSteam * (0.44 + 0.3 * hush) + uDeep * 0.3) * uLight;
  a = min(a * (1. + 0.45 * hush), 1.);
  gl_FragColor = vec4(col * a, a);
  #include <fog_fragment>
}`,to=`
attribute vec3 aEye; attribute vec4 aD;      // yc (height where it crosses its beam), phase, speed, delay
varying vec2 vQ; varying float vB;
#include <fog_pars_vertex>
${J}
void main(){
  vec3 L = uSunL; float dn = max(-L.y, 0.05);
  vec3 c = aEye + L * ((aEye.y - aD.x) / dn);
  float y0 = min(aEye.y - 1., aD.x + 24.);
  float s = fract(uTime * aD.z + aD.y);
  float y = y0 - (y0 - 0.3) * s * s;
  vec3 wp = vec3(c.x, y, c.z);
  vec3 toC = cameraPosition - wp; float dist = length(toC);
  vec3 right = normalize(cross(vec3(0., 1., 0.), toC) + vec3(1e-4, 0., 0.));
  float w = max(0.1, dist * 0.003), len = 0.22 + 0.5 * s;      // a spark, not a streak
  wp += right * position.x * w + vec3(0., position.y * len, 0.);
  float grown = smoothstep(0., 6., aD.x - (uSteamBase + aD.w));
  float dy = (y - aD.x) / 1.7;
  vB = (0.07 + 9. * exp(-dy * dy) * grown) * hCloud(aEye.z, 1.);      // all but unseen until it falls through its shaft: there it is a spark
  vQ = position.xy;
  vec4 mvPosition = viewMatrix * vec4(wp, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,oo=`
uniform vec3 uBeamCol;
varying vec2 vQ; varying float vB;
#include <fog_pars_fragment>
${Le}
void main(){
  float a = max(1. - abs(vQ.x), 0.) * max(1. - vQ.y * vQ.y, 0.);      // max: multisampling extrapolates vQ past the quad when it is edge-on
  gl_FragColor = vec4(uBeamCol * a * a * vB * 0.5 * hFogKeep(), 1.);
}`,ao=`
attribute vec3 aEye; attribute vec4 aB; attribute vec4 aB2;   // aB: yc, phase, speed, heading.  aB2: size, delay, random, accent
varying vec2 vQ; varying vec3 vP;
#include <fog_pars_vertex>
${J}
void main(){
  vec3 L = uSunL; float dn = max(-L.y, 0.05);
  vec3 c = aEye + L * ((aEye.y - aB.x) / dn);
  float off = (fract(uTime * aB.z + aB.y) * 2. - 1.) * 16.;
  c += vec3(cos(aB.w), 0., sin(aB.w)) * off;
  c.y += sin(uTime * 0.6 + aB2.z * 20.) * 0.25 + off * 0.05;
  float grown = smoothstep(0., 6., aB.x - (uSteamBase + aB2.y));
  float flash = exp(-off * off / 1.2) * grown * hCloud(aEye.z, 1.);
  vP = vec3(flash, aB2.z, (1. - smoothstep(11., 16., abs(off))));
  vQ = position.xy;
  vec4 mvPosition = viewMatrix * vec4(c, 1.);
  float dist = -mvPosition.z;
  mvPosition.xy += position.xy * max(aB2.x, dist * 0.004);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,so=`
uniform vec3 uBeamCol;
varying vec2 vQ; varying vec3 vP;
#include <fog_pars_fragment>
${Le}
void main(){
  float d = length(vQ);
  float rim = smoothstep(0.5, 0.92, d) * (1. - smoothstep(0.92, 1., d));
  vec3 irid = uBeamCol * 0.7 + 0.3 * cos(6.2831853 * (d * 1.3 + vP.y + vec3(0., 0.33, 0.67)));
  float spot = smoothstep(0.22, 0.05, length(vQ - vec2(-0.36, 0.4))) + 0.5 * smoothstep(0.14, 0.03, length(vQ - vec2(0.4, -0.38)));
  vec3 col = (irid * rim * 0.42 + uBeamCol * spot * 0.7) * (0.4 + vP.x * 4.) * vP.z * hFogKeep();
  gl_FragColor = vec4(col, 1.);
}`;function Pe(){const l=[],n=[],r=[],c=[],u=[],i={tint:[1,1,1],count:0};function d(h,S,B){l.push(h[0],h[1],h[2]),n.push(S[0],S[1],S[2]);const a=h[5]===void 0?1:h[5];r.push(i.tint[0]*a,i.tint[1]*a,i.tint[2]*a),c.push(h[3]||0,h[4]||0),u.push(B)}const M=(h,S,B,a)=>{const p=h[0]-S[0],v=h[1]-S[1],m=h[2]-S[2],P=B[0]-a[0],W=B[1]-a[1],T=B[2]-a[2],A=[v*T-m*W,m*P-p*T,p*W-v*P],q=Math.hypot(A[0],A[1],A[2]);return q<1e-9?null:(A[0]/=q,A[1]/=q,A[2]/=q,A)};return i.grid=(h,S,B,a,p=!1)=>{const v=h+1,m=[];for(let W=0;W<=S;W++)for(let T=0;T<=h;T++)m.push(B(T/h,W/S));const P=[];if(!p)for(let W=0;W<=S;W++)for(let T=0;T<=h;T++)P.push(M(m[W*v+Math.min(T+1,h)],m[W*v+Math.max(T-1,0)],m[Math.min(W+1,S)*v+T],m[Math.max(W-1,0)*v+T])||[0,1,0]);for(let W=0;W<S;W++)for(let T=0;T<h;T++){const A=W*v+T,q=A+1,O=A+v+1,L=A+v;if(p){const b=M(m[q],m[A],m[L],m[A])||M(m[O],m[A],m[L],m[A])||M(m[q],m[A],m[O],m[A])||[0,1,0];d(m[A],b,a),d(m[q],b,a),d(m[O],b,a),d(m[A],b,a),d(m[O],b,a),d(m[L],b,a)}else d(m[A],P[A],a),d(m[q],P[q],a),d(m[O],P[O],a),d(m[A],P[A],a),d(m[O],P[O],a),d(m[L],P[L],a);i.count+=2}},i.lathe=(h,S,B,a,p,v,m,P=-1,W=null,T=!1)=>{for(let A=0;A<B.length-1;A++){const[q,O]=B[A],[L,b]=B[A+1];i.grid(v,1,(g,y)=>{const F=a+(p-a)*g,G=O+(b-O)*y;let N=q+(L-q)*y;return W&&(N*=W(F,G)),[h+Math.sin(F)*N,G,S+Math.cos(F)*N,F*Math.max(q,2),A===P?y:0,1]},m,T)}},i.build=()=>{const h=new t.BufferGeometry;return h.setAttribute("position",new t.Float32BufferAttribute(l,3)),h.setAttribute("normal",new t.Float32BufferAttribute(n,3)),h.setAttribute("aCol",new t.Float32BufferAttribute(r,3)),h.setAttribute("uv",new t.Float32BufferAttribute(c,2)),h.setAttribute("aMat",new t.Float32BufferAttribute(u,1)),h},i}const lo=V*Math.tan(Math.PI/8),tt=l=>[Math.sin(l*Math.PI/4),Math.cos(l*Math.PI/4)];function no(l,n,r,c){const u=l*Math.PI/4,i=Math.sin(u),d=Math.cos(u);return[i*(V+c)+d*n,r,d*(V+c)-i*n]}const Ne=l=>{const n=Math.PI/4;let r=((l+n/2)%n+n)%n-n/2;return V/Math.cos(r)},le=(l,n,r)=>{const c=Math.min(1,Math.max(0,(r-l)/(n-l)));return c*c*(3-2*c)};function ro(l,n){const{pt:r,cls:c,uo:u=0,sc:i=1,back:d=!1,band:M=!0}=n,h=n.hs??lo,S=n.top??ye,B=n.depth??ze,a=n.open??c===0,[p,v]=Xe[c],m=10+v,P=(L,b,g,y,F,G)=>{const N=r(L,b,g);return[N[0],N[1],N[2],y,F,G]},W=(L,b,g,y=1)=>P(L,b,g,L*i+u,b*i,y),T=(L,b)=>(.74+.26*le(0,7,b))*(.8+.2*le(h,h-6,Math.abs(L)));for(const L of[-1,1])l.grid(4,6,(b,g)=>{const y=L*(10+(h-10)*b),F=g*S;return W(y,F,0,T(y,F))},H.ABLAQ),l.grid(2,1,(b,g)=>{const y=L*(12.4+(h-12.4)*b);return W(y,g*2.5,-.45,.8+.2*g)},H.ABLAQ,!0),l.grid(2,1,(b,g)=>{const y=L*(12.4+(h-12.4)*b);return W(y,2.5+g*.45,-.45+.45*g,1)},H.ABLAQ,!0),l.grid(1,5,(b,g)=>{const y=L*(10+2.4*b),F=g*p;return W(y,F,-.35,.8+.2*le(0,6,F))},H.ABLAQ,!0),l.grid(1,5,(b,g)=>P(L*12.4,g*p,-.35*(1-b),u+(L*12.4+b*.4)*i,g*p*i,.72),H.ABLAQ,!0),l.grid(3,5,(b,g)=>{const y=-.35+(B+.35)*b,F=g*p;return P(L*10,F,y,u+(60+y*L)*i,F*i,(.86-.3*b*(a?.4:1))*(.8+.2*le(0,6,F)))},H.ABLAQ,!0);l.grid(20,3,(L,b)=>{const g=-10+20*L,y=Je(c,g*.9999),F=y+(Math.max(S,y)-y)*b;return W(g,F,0,1)},H.ABLAQ);const A=Math.acos(-v/m),q=Math.acos(-v/(m+2.4)),O=m*(Math.PI-A);for(const L of[-1,1]){const b=(g,y,F)=>{const G=m+2.4*y,N=Math.PI+(A+(q-A)*y-Math.PI)*g,Z=L*(v+G*Math.cos(N)),I=p+G*Math.sin(N),me=m*(Math.PI-N);return P(Z,I,F,(L<0?me:2*O-me)*i,y,1)};l.grid(12,1,(g,y)=>b(g,y,-.35),H.VOUSSOIR),l.grid(12,1,(g,y)=>{const F=b(g,1,-.35*(1-y));return F[4]=.5,F[5]=.62,F},H.VOUSSOIR),l.grid(12,3,(g,y)=>{const F=b(g,0,-.35+(B+.35)*y);return F[4]=.08+.84*y,F[5]=.84-(a?.12:.34)*y,F},H.VOUSSOIR)}if(M){const b=p+Math.sqrt(m*m-v*v)+2.4>S-3.6?[[-h+.1,-12.45],[12.45,h-.1]]:[[-h+.1,h-.1]];for(const[g,y]of b){const F=Math.max(2,Math.round((y-g)/5.5));l.grid(F,1,(G,N)=>{const Z=g+(y-g)*G;return P(Z,S-3.6+3.4*N,-.3,Z*i+u,N,1)},H.CARVED,!0),l.grid(F,1,(G,N)=>{const Z=g+(y-g)*G;return P(Z,S-3.6,-.3*N,Z*i+u,.02,.55)},H.CARVED,!0)}}d&&(l.grid(10,6,(L,b)=>{const g=-10+20*L,y=b*Je(c,g*.9999);return P(g,y,B,g*i+u,y*i,.62*(.8+.2*le(0,6,y)))},H.ABLAQ),l.grid(1,1,(L,b)=>P(-7+14*L,5.6+8.2*b,B-.25,(L*14-7)*i,b*8.2*i,.9),H.TILE,!0))}async function io(l,n,r){l.grid(48,12,(c,u)=>{const i=c*Math.PI*2,d=u*97;return[Math.sin(i)*d,0,Math.cos(i)*d,0,0,1]},H.FLOOR,!0),await n.yield();for(let c=0;c<8;c++){const u=Gt(c);ro(l,{pt:(i,d,M)=>no(c,i,d,M),cls:u,uo:c*45.56,back:u===1,open:u===0,depth:c===4?r:ze}),await n.yield()}l.grid(80,4,(c,u)=>{const i=c*Math.PI*2,d=Ne(i)+(he-Ne(i))*Math.pow(u,.8);return[Math.sin(i)*d,ye+(ie-ye)*u,Math.cos(i)*d,0,0,.66]},H.PLASTER),await n.yield(),l.grid(64,16,(c,u)=>{const i=c*Math.PI*2,d=u*Math.PI/2,M=he*Math.cos(d);return[Math.sin(i)*M,ie+he*Math.sin(d),Math.cos(i)*M,c*32,u,.88+.12*u]},H.PLASTER),await n.yield(),l.grid(64,1,(c,u)=>{const i=c*Math.PI*2,d=ie+.2+3.3*u,M=Math.sqrt(he*he-(d-ie)*(d-ie))-.28;return[Math.sin(i)*M,d,Math.cos(i)*M,i*he,u,1]},H.CARVED),await n.yield();for(let c=0;c<4;c++){const u=1+c*2,[i,d]=tt(u),M=i*Ee,h=d*Ee,S=Math.atan2(-i,-d),B=Math.asin(10/ae);l.grid(22,3,(a,p)=>{const v=S+B+(Math.PI*2-2*B)*a;return[M+Math.sin(v)*ae,23*p,h+Math.cos(v)*ae,v*ae+c*31,23*p,.72+.2*le(0,8,23*p)]},H.ABLAQ),l.grid(22,1,(a,p)=>{const v=S+B+(Math.PI*2-2*B)*a;return[M+Math.sin(v)*(ae-.2),23+3*p,h+Math.cos(v)*(ae-.2),v*ae,p,.9]},H.CARVED),l.grid(28,8,(a,p)=>{const v=a*Math.PI*2,m=p*Math.PI/2,P=ae*Math.cos(m);return[M+Math.sin(v)*P,Mt+ae*Math.sin(m),h+Math.cos(v)*P,a*16,p,.85]},H.PLASTER),await n.yield()}}const ho=[[2.3,0],[2.3,.3],[2,.42],[1.5,.5],[.9,1.05],[.82,1.7],[1.25,2.1],[2.9,2.5],[3.85,2.98],[4.05,3.22],[3.9,3.32],[3.6,3.16],[3,2.82],[2.2,2.62],[0,2.5]];function co(l,n,r,c){const u=(M,h)=>1+.1*le(2,2.9,h)*(Math.pow(Math.abs(Math.cos(6*M)),.6)-.6);l.lathe(n.x,n.z,ho,0,Math.PI*2,48,H.MARBLE,5,u);const i=M=>{if(M<.5)return[4.7,M*2*4.5,0,1];const h=(M-.5)*2*3.5;return[3.2+1.5*Math.cos(h),4.5+1.5*Math.sin(h),-Math.sin(h),Math.cos(h)]};l.grid(6,16,(M,h)=>{const[S,B,a,p]=i(h),v=M*Math.PI*2,m=.2*(h<.04?1.8:h>.96?1.25:1),P=Math.cos(v)*m,W=Math.sin(v)*m,T=S+P*p,A=B-P*a;return[n.x+r*T-c*W,A,n.z+c*T+r*W,0,0,1]},H.BRASS);const d=i(1);n.spout=[n.x+r*d[0],d[1],n.z+c*d[0]]}function mo(l,n,r){l.grid(48,3,(d,M)=>{const h=d*Math.PI*2,S=4.08+.22*M*M,B=1+.1*(1-M)*(Math.pow(Math.abs(Math.cos(6*h)),.6)-.6);return[n.x+Math.sin(h)*S*B,3.22-3.2*(M*.3+.7*M*M),n.z+Math.cos(h)*S*B,h*12/(Math.PI*2)+100+r*17,M,1]},0);const[c,u,i]=n.spout;for(let d=0;d<2;d++){const M=d?.16:0,h=d?0:.16;l.grid(1,2,(S,B)=>[c+(S-.5)*2*M,u-(u-2.7)*B,i+(S-.5)*2*h,3.3+r,B*.4+.1,1],0)}}function fo(l,n){l.grid(14,1,(r,c)=>{const u=r*Math.PI*2,i=2.3*c;return[n.x+Math.sin(u)*i,2.67,n.z+Math.cos(u)*i,0,0,1]},0,!0)}async function vo(l,n,r,c){const u=Math.tan(Math.PI/8),i=(a,p,v=1)=>{for(let m=0;m<8;m++){const[P,W]=tt(m);for(let T=0;T<a.length-1;T++){const[A,q]=a[T],[O,L]=a[T+1];l.grid(4,1,(b,g)=>{const y=A+(O-A)*g,F=(b*2-1)*y*u;return[P*y+W*F,q+(L-q)*g,W*y-P*F,(F+m*13)*v,T===p?g:0,L===q?1:.92]},H.MARBLE,!0)}}},d=(a,p)=>l.grid(8,3,(v,m)=>{const P=(v*8-.5)*Math.PI/4,W=a/Math.cos(Math.PI/8)*m;return[Math.sin(P)*W,p,Math.cos(P)*W,0,0,1]},H.MEDALLION,!0);i([[15.3,0],[15.3,.5],[15.1,.6],[14.45,.6],[14.45,.85],[14.3,.9],[14.3,2.1],[14.42,2.2],[14.42,2.38],[14.2,2.5],[14,ue]],5),d(14,ue),i([[5,ue],[5,ue+.3],[4.75,ue+.42]],-1),d(4.75,ue+.42);const M=Math.asin(6/17.6),h=[[se,-.1],[se,.5],[se+.12,.62],[se+1.1,.62],[se+1.25,.5],[se+1.25,.12],[se+1.4,0]];l.lathe(0,ce,h,M,Math.PI*2-M,60,H.MARBLE,4,null,!0);const S=ce+17.6*Math.cos(M),B=V+ze;for(const a of[-1,1]){const p=[[6,-.1],[6,.5],[6.12,.62],[7.1,.62],[7.25,.5],[7.25,0]];for(let v=0;v<p.length-1;v++)l.grid(4,1,(m,P)=>[a*(p[v][0]+(p[v+1][0]-p[v][0])*P),p[v][1]+(p[v+1][1]-p[v][1])*P,S+(B-S)*m,m*(B-S),v===4?P:0,1],H.MARBLE,!0)}await c.yield();for(const a of n){const p=Math.hypot(a.x,a.z);co(l,a,a.x/p,a.z/p),await c.yield()}for(const a of r)l.grid(20,1,(p,v)=>{const m=p*Math.PI*2,P=2.5*v;return[a.x+Math.sin(m)*P,.06,a.z+Math.cos(m)*P,0,1,1]},H.BRASS,!0),l.tint=[.32,.3,.29],l.lathe(a.x,a.z,[[2.5,.06],[2.5,.16],[3,.16],[3.12,0]],0,Math.PI*2,20,H.MARBLE,-1,null,!0),l.tint=[1,1,1]}function uo(){const l=Pe();return l.grid(6,4,(n,r)=>{const c=n*2-1,u=r*(1-.32*Math.pow(Math.abs(c),1.6)),i=r*r*.95-.34*(1-c*c)*(1-r*r);return[.5*c,u,i,n,r,.56+.44*r*(.7+.3*c*c)]},H.MUQARNAS),l.build()}function po(l){const n=Pe();return l.forEach((r,c)=>mo(n,r,c)),n.build()}function xo(l){const n=Pe();n.grid(40,1,(r,c)=>{const u=r*Math.PI*2,i=(se+.02)*c;return[Math.sin(u)*i,Me,ce+Math.cos(u)*i,0,0,1]},0,!0),n.grid(1,1,(r,c)=>[-6.02+12.04*r,Me,ce+15+(V+ze-ce-15)*c,0,0,1],0,!0);for(const r of l)fo(n,r);return n.build()}async function yo(l,n={}){const r=l.rng.fork("hammam-hero"),c=l.quality?.detail??1,u=(n.palette||qt).map(e=>new t.Color(e)),i=n.look||(()=>{const e=r();return e<.5?"noon":e<.78?"afternoon":"winter"})(),d=n.accent||(()=>{const e=r();return e<.6?"#"+u[4].getHexString():e<.8?"#2B5FB8":"#D98A1E"})(),M=n.eastDepth??ze,h=new t.Color(d),S=/2B5FB8/i.test(d)?2:/D98A1E/i.test(d)?3:1,B={noon:{elev:66+r.range(-2,2),az:12+r.range(-8,8),beam:"#F7F2E7",light:1,haze:1,dark:0,beamGain:.62,beamW:.5,lean:.445,roomKey:[1,1,1],roomAmb:[1,1,1],shade:1,warm:0,deep:"#6A70D4",lamp:"#FFBE5C",lampGain:1.45},afternoon:{elev:34+r.range(-2,2),az:33+r.range(-6,6),beam:"#FFD9A0",light:.94,haze:1,dark:0,beamGain:.62,beamW:.6,lean:.62,roomKey:[1.34,.9,.5],roomAmb:[.92,.84,.98],shade:.8,warm:1,deep:"#5656C8",lamp:"#FFB050",lampGain:1.45},winter:{elev:57+r.range(-2,2),az:40+r.range(-6,6),beam:"#E6F0FF",light:.9,haze:1.4,dark:.5,beamGain:.76,beamW:.58,lean:.5,roomKey:[.66,.86,1.2],roomAmb:[.66,.8,1.1],shade:1.1,warm:0,deep:"#4A84CC",lamp:"#FFC468",lampGain:1.8}},a=B[i]||B.noon;let p=(n.sunElevation??a.elev)*Math.PI/180,v=(n.sunAzimuth??a.az)*Math.PI/180;const m=n.growFrom??.4,P=n.growTo??.57,W=n.driftRate??.014,T=n.haze??1,A=new t.Color(a.beam),q=Math.max(h.r,h.g,h.b,.001),O=h.clone().multiplyScalar(1/q),L=u[3].clone().multiplyScalar(2).addScalar(.11),b=u[6].clone();a.warm&&b.lerp(new t.Color("#4466a8"),.45);const g=u[2].clone();a.warm&&g.lerp(new t.Color("#F0A040"),.3);const y=u[0].clone();a.warm&&y.lerp(new t.Color("#FFE2B8"),.35),i==="winter"&&y.lerp(new t.Color("#E8EEF8"),.5);const F=u[1].clone();a.warm&&F.lerp(new t.Color("#F2D9B4"),.4),i==="winter"&&F.lerp(new t.Color("#DDE4EE"),.6);const G={uSunL:{value:new t.Vector3(0,-1,0)},uSunC:{value:new t.Vector3(0,-1,0)},uCEye:{value:Array.from({length:Ce},()=>new t.Vector4(0,-1e5,0,1))},uSteamBase:{value:-14},uTime:{value:0},uCloud:{value:new t.Vector4(200,.33,0,0)},uDarkFrac:{value:a.dark},uPearl:{value:y},uSteam:{value:F},uHoney:{value:g},uBasalt:{value:L},uAccent:{value:h},uBrass:{value:u[5]},uShade:{value:b.multiplyScalar(a.shade)},uBeamCol:{value:A},uAccentGlow:{value:O.clone().multiplyScalar(.92).addScalar(.04)},uAccentBeam:{value:O.clone().lerp(A,.2)},uHaze:{value:a.haze},uLight:{value:a.light},uSeed:{value:r.range(0,50)},uEyeGain:{value:1},uBeamGain:{value:a.beamGain},uStarGain:{value:1},uSheet:{value:1},uBeamW:{value:a.beamW},uWallStar:{value:0},uThrough:{value:0},uRoomKey:{value:new t.Vector3(...a.roomKey)},uRoomAmb:{value:new t.Vector3(...a.roomAmb)},uBlob:{value:Array.from({length:Ye},(e,s)=>{const f=(n.blobs||[])[s];return f?new t.Vector4(f[0],f[1],f[2],f[3]):new t.Vector4(0,1e4,1,0)})},uGlow:{value:new t.Vector4(0,16,(n.portalZ??-131)+1.5,n.glow??0)},uGlass:{value:[A,new t.Color(.2,1,.48),new t.Color(.22,.42,1),new t.Color(1,.66,.16),new t.Color(1,.16,.26)]},uDeep:{value:new t.Color(a.deep)},uLampCol:{value:new t.Color(a.lamp).multiplyScalar(a.lampGain)},uLamp:{value:Array.from({length:ge},()=>new t.Vector4(0,-1e4,0,0))},uPortalCol:{value:new t.Color(n.portalColor||"#F6E6C2")},uRecZ:{value:-(V+M)+.1},uFount:{value:new t.Vector4(0,1e4,1,0)}},N=(e,s,f={})=>new t.ShaderMaterial(Object.assign({vertexShader:e,fragmentShader:s,fog:!0,uniforms:Object.assign(t.UniformsUtils.clone(t.UniformsLib.fog),G)},f)),Z=new t.Group;Z.name="hammam-of-stars-hero";const I=(e,s=0)=>(e.frustumCulled=!1,e.renderOrder=s,Z.add(e),e),me=[],de=[],Fe=[];for(let e=0;e<8;e++){const s=(e+.5)*Math.PI/4;me.push({x:Math.sin(s)*51.5,z:Math.cos(s)*51.5})}for(const e of[50,100,150,210,260,310]){const s=e*Math.PI/180;de.push({x:Math.sin(s)*33,z:Math.cos(s)*33})}for(let e=0;e<4;e++){const[s,f]=tt(1+e*2);Fe.push({x:s*Ee,z:f*Ee})}const ke=N(It,Ot,{side:t.DoubleSide});let fe=0;{const e=Pe();await io(e,l,M),await l.yield();const s=e.build();await l.yield(),I(new t.Mesh(s,ke)),fe+=e.count,await l.yield();const f=Pe();await vo(f,me,de,l),await l.yield(),I(new t.Mesh(f.build(),ke)),fe+=f.count}await l.yield();{const e=uo(),s=6,f=80,w=s*f,x=new t.InstancedMesh(e,ke,w),U=new t.Matrix4;let D=0;const _=(C,k)=>Ne(C)+(he-Ne(C))*Math.pow(Math.min(k,1),.8);for(let C=0;C<s;C++)for(let k=0;k<f;k++){const Q=(k+.5*(C%2))/f*Math.PI*2,ne=C/s,ve=_(Q,ne)-.1,te=Math.PI*2*ve/f*1.03,pe=(ie-ye)/s*1.32,o=ve-_(Q,ne+1/s)+.9,z=Math.sin(Q),R=Math.cos(Q);U.set(R*te,0,-z*o,z*ve,0,pe,0,ye+(ie-ye)*ne-.1,-z*te,0,-R*o,R*ve,0,0,0,1),x.setMatrixAt(D++,U)}x.instanceMatrix.needsUpdate=!0,I(x),fe+=w*48}await l.yield();const K=[],ot=(e,s,f,w,x,U,D)=>{const _=r.int(0,2);x.forEach(([C,k],Q)=>{const ne=(C+(Q?r.range(-1.5,1.5):0))*Math.PI/180,ve=r()*Math.PI*2;for(let te=0;te<k;te++){const pe=ve+(te+(k>1?r.range(-.12,.12):0))/k*Math.PI*2,o=Math.sin(ne)*Math.cos(pe),z=Math.cos(ne),R=Math.sin(ne)*Math.sin(pe),oe=_===0?Q%2:_===1?te%2:r()<.5?0:1;K.push({p:[e+o*w,s+z*w,f+R*w],n:[-o,-z,-R],dome:[e,f,w,s],kind:U,shape:oe,scale:D*r.range(.92,1.08),delay:r.range(0,9),accent:0,rnd:r()})}})};ot(0,ie,0,he,[[0,1],[10,6],[21,12],[32,18],[43,24],[54,28],[65,31]],0,1);for(const e of Fe)ot(e.x,Mt,e.z,ae,[[0,1],[24,6],[47,13],[70,25]],1,.72);{const e=r.shuffle(K.map((x,U)=>U)),s=Math.round(K.length*.17),f=Math.round(K.length*.05),w=[1,2,3,4].filter(x=>x!==S);for(let x=0;x<s+3*f;x++)K[e[x]].accent=x<s?S:w[Math.floor((x-s)/f)%3]}if(a.dark>0){const e=Math.cos(p),s=-e*Math.cos(v),f=-Math.sin(p),w=-e*Math.sin(v);for(const x of K){const U=.75*x.p[1]/Math.max(-f,.05),D=x.p[0]+s*U+.9,_=22.3-(x.p[2]+w*U),k=x.kind===0&&_>5&&_<90&&Math.abs(D)<.55*_+4?x.rnd>.1:x.rnd>(x.kind===0?.86:.55);x.rnd=(k?a.dark:0)+x.rnd*(k?1-a.dark:a.dark)*.999}}{const e=n.views||[{p:[5.5,2.3,34],u:.5},{p:[-12,11.5,10],u:.6},{p:[-8,18.5,-14],u:.68}],s=(o,z)=>(o=Math.abs(o),z=Math.abs(z),Math.max(o,z,(o+z)*.70710678)),f=o=>{const z=v+W*50*(o-(n.growTo??.57)),R=Math.cos(p);return[-R*Math.cos(z),-Math.sin(p),-R*Math.sin(z)]},w=f(n.growTo??.57),x=o=>{const z=Math.sin(o*127.1+311.7)*43758.5453;return z-Math.floor(z)},U=[];K.forEach((o,z)=>{o.sel=0;const R=[o.dome[0],o.dome[3],o.dome[1]],oe=Math.max(-2*((o.p[0]-R[0])*w[0]+(o.p[1]-R[1])*w[1]+(o.p[2]-R[2])*w[2]),0);if(o.p[1]+w[1]*oe>o.dome[3]+.5)return;const j=o.p[1]/Math.max(-w[1],.05),re=o.p[0]+w[0]*j,be=o.p[2]+w[2]*j;let gt=0,Qe=re,Ve=be,Te=j;if(o.kind===0&&s(re,be)>V-2){gt=1;const we=(V-2)/s(re,be);if(s(o.p[0],o.p[2])<V-2){const xe=s(o.p[0],o.p[2]),$=(V-2-xe)/Math.max(s(re,be)-xe,.001);Qe=o.p[0]+(re-o.p[0])*$,Ve=o.p[2]+(be-o.p[2])*$,Te=j*$}else Qe=re*we,Ve=be*we}if(Te<26&&o.kind===0)return;let je=!1;for(const we of e){const xe=f(we.u),$=we.p,Se=Math.max($[2]+V,1),bt=we.u<.55||i==="afternoon"?5.5:10.5,Ht=Math.atan2(-bt-$[0],Se),Et=Math.atan2(bt-$[0],Se),Nt=Math.atan2(-1-$[1],Se),Ut=Math.atan2(35.5-$[1],Se),Dt=o.p[1]/Math.max(-xe[1],.05)*(Te/j);for(let Ke=0;Ke<=24&&!je;Ke++){const $e=Dt*Ke/24,Ze=o.p[0]+xe[0]*$e-$[0],_t=o.p[1]+xe[1]*$e-$[1],We=-(o.p[2]+xe[2]*$e-$[2]);if(We<1.5||We>Se+4)continue;const He=1.4/Math.hypot(Ze,We)+.008,wt=Math.atan2(Ze,We),zt=Math.atan2(_t,Math.hypot(Ze,We));wt>Ht-He&&wt<Et+He&&zt>Nt-He&&zt<Ut+He&&(je=!0)}}je||U.push({i:z,e:o,lx:Qe,lz:Ve,wall:gt,len:Te,r:x(o.rnd*91.7+z*.37)})});const D=[],_=(o,z)=>D.every(R=>Math.hypot(R.lx-o.lx,R.lz-o.lz)>=z&&Math.hypot(R.e.p[0]-o.e.p[0],R.e.p[2]-o.e.p[2])>=z*.6),C=n.stand||[[10,-23],[-27,-34],[-21,9],[13,-7],[-31,-13],[-12,30],[9,9],[-40,-44],[-45,-16],[-33,34],[-37,12],[-51,-2],[-4,46],[-16,-52]];{const o=59/Math.tan(p),z=w[0]/Math.hypot(w[0],w[2])*o,R=w[2]/Math.hypot(w[0],w[2])*o,oe=[-.39,0,.42].map(j=>[z+40.2*Math.cos(j),R+40.2*Math.sin(j)]);C.unshift(oe[0]),C.splice(3,0,oe[1]),C.splice(6,0,oe[2])}let k=0;for(const[o,z]of C){let R=null,oe=7.5;for(const j of U){if(j.e.kind!==0||j.wall||!_(j,10))continue;const re=Math.hypot(j.lx-o,j.lz-z);re<oe&&(oe=re,R=j)}R&&(R.e.sel=.86+.28*R.r,D.push(R),k++)}const Q=o=>{let z=1e9;for(const R of e)z=Math.min(z,Math.abs(Math.hypot(o.lx-R.p[0],o.lz-R.p[2])-22));return z},ne=U.filter(o=>!o.e.sel&&o.e.kind===0&&!o.wall).sort((o,z)=>Q(o)-Q(z));for(const o of ne){if(k>=13)break;_(o,10.5)&&(o.e.sel=.86+.28*o.r,D.push(o),k++)}if(k<12)for(const o of U.filter(z=>!z.e.sel&&z.e.kind===0&&z.wall).sort((z,R)=>Q(z)-Q(R))){if(k>=12)break;_(o,6.5)&&(o.e.sel=.8+.2*o.r,D.push(o),k++)}const ve=U.filter(o=>!o.e.sel).sort((o,z)=>o.r-z.r);let te=0,pe=[0,0,0,0];for(const o of ve)if(o.e.kind===0)te<(i==="afternoon"?16:10)&&_(o,12)&&(o.e.sel=(o.wall&&i==="afternoon"?.5:.2)+.1*o.r,D.push(o),te++);else{const z=Fe.findIndex(R=>Math.hypot(R.x-o.e.dome[0],R.z-o.e.dome[1])<1);z>=0&&pe[z]<2&&_(o,7)&&(o.e.sel=.24+.1*o.r,D.push(o),pe[z]++)}}if(a.dark>0)for(const e of K)e.sel>0&&e.rnd<=a.dark&&(e.rnd=a.dark+(1-a.dark)*(.15+.7*e.rnd/a.dark));const Y=K.length,at=new Float32Array(Y);K.forEach((e,s)=>{at[s]=e.sel});const st=new Float32Array(Y*3),lt=new Float32Array(Y*3),nt=new Float32Array(Y*4),rt=new Float32Array(Y*4),it=new Float32Array(Y*2);K.forEach((e,s)=>{st.set(e.p,s*3),lt.set(e.n,s*3),nt.set(e.dome,s*4),rt.set([e.delay,e.accent,e.rnd,e.kind],s*4),it.set([e.shape,e.scale],s*2)});const Be={aEye:new t.InstancedBufferAttribute(st,3),aNrm:new t.InstancedBufferAttribute(lt,3),aDome:new t.InstancedBufferAttribute(nt,4),aParam:new t.InstancedBufferAttribute(rt,4),aShape:new t.InstancedBufferAttribute(it,2),aSel:new t.InstancedBufferAttribute(at,1)},X=(e,s,f)=>{const w=new t.InstancedBufferGeometry;w.index=e.index,w.setAttribute("position",e.getAttribute("position"));for(const x in f)w.setAttribute(x,f[x]);return w.instanceCount=s,w},ee=new t.PlaneGeometry(2,2),Ue=new t.CylinderGeometry(1,1,1,8,1,!0).translate(0,.5,0),De={transparent:!0,depthWrite:!1,blending:t.AdditiveBlending},Ft={transparent:!0,depthWrite:!1,blending:t.CustomBlending,blendEquation:t.AddEquation,blendSrc:t.OneMinusDstColorFactor,blendDst:t.OneFactor,blendSrcAlpha:t.ZeroFactor,blendDstAlpha:t.OneFactor},Re={transparent:!0,depthWrite:!1,premultipliedAlpha:!0},ht=N(Qt,Vt,{...Re,side:t.DoubleSide}),ct=N(Wt,Ct,{...De,side:t.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),_e=N(Wt,Ct,{transparent:!0,depthWrite:!1,blending:t.CustomBlending,blendEquation:t.AddEquation,blendSrc:t.DstColorFactor,blendDst:t.OneFactor,blendSrcAlpha:t.ZeroFactor,blendDstAlpha:t.OneFactor,side:t.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2});_e.uniforms.uWallStar={value:1};const mt=N(jt,Kt,{...Ft,side:t.DoubleSide});I(new t.Mesh(X(ee,Y,Be),ht),1),I(new t.Mesh(X(ee,Y,Be),ct),4),I(new t.Mesh(X(ee,Y,Be),_e),4),I(new t.Mesh(X(Ue,Y,Be),mt),5),fe+=Y*20;const kt=(e,s={})=>{const f=e.length,w=new Float32Array(f*3),x=new Float32Array(f*3),U=new Float32Array(f*4),D=new Float32Array(f*4),_=new Float32Array(f*2);e.forEach((k,Q)=>{w.set(k.p,Q*3),x.set(k.n,Q*3),U.set(k.dome,Q*4),D.set([-400,k.accent||0,k.rnd??.5,2+(k.gain??0)],Q*4),_.set([k.shape||0,k.scale||1],Q*2)});const C={aEye:new t.InstancedBufferAttribute(w,3),aNrm:new t.InstancedBufferAttribute(x,3),aDome:new t.InstancedBufferAttribute(U,4),aParam:new t.InstancedBufferAttribute(D,4),aShape:new t.InstancedBufferAttribute(_,2),aSel:new t.InstancedBufferAttribute(new Float32Array(f).fill(1),1)};I(new t.Mesh(X(ee,f,C),ht),1),s.stars!==!1&&(I(new t.Mesh(X(ee,f,C),ct),4),I(new t.Mesh(X(ee,f,C),_e),4)),s.beams!==!1&&I(new t.Mesh(X(Ue,f,C),mt),5),fe+=f*(2+(s.stars!==!1?2:0)+(s.beams!==!1?16:0))},Bt=e=>{e.slice(0,Ce).forEach((s,f)=>G.uCEye.value[f].set(s.p[0],s.p[1],s.p[2],(s.scale||1)+(s.shape?10:0)+100*(s.accent|0)))};await l.yield();const ft=N(Lt,$t,{side:t.DoubleSide}),vt=N(Lt,Zt,{...Re,side:t.DoubleSide});I(new t.Mesh(xo(me),ft)),I(new t.Mesh(po(me),vt),1);{const e=Pe();for(let x=0;x<4;x++)e.grid(40,1,(U,D)=>{const _=U*Math.PI*2,C=62*D;return[Math.sin(_)*C,0,Math.cos(_)*C,0,0,1]},x,!0);I(new t.Mesh(e.build(),N(Yt,Xt,{...Re,side:t.DoubleSide})),2);const s=Math.max(8,Math.round(16*c)),f=de.length*s,w=new Float32Array(f*4);for(let x=0;x<f;x++){const U=de[x%de.length];w.set([U.x,U.z,(Math.floor(x/de.length)+r())/s,r()],x*4)}I(new t.Mesh(X(ee,f,{aPuff:new t.InstancedBufferAttribute(w,4)}),N(Jt,eo,Re)),3),fe+=600+f*2}await l.yield();{let e=K.filter(C=>C.kind===0&&C.sel>.6);e.length||(e=K.filter(C=>C.kind===0&&C.p[1]>56));const s=Math.round(90*c),f=new Float32Array(s*3),w=new Float32Array(s*4);for(let C=0;C<s;C++){const k=r.pick(e);f.set(k.p,C*3),w.set([r.range(5,Math.min(k.p[1]-14,46)),r(),r.range(.16,.3),k.delay],C*4)}I(new t.Mesh(X(ee,s,{aEye:new t.InstancedBufferAttribute(f,3),aD:new t.InstancedBufferAttribute(w,4)}),N(to,oo,De)),6);const x=Math.round(120*c),U=new Float32Array(x*3),D=new Float32Array(x*4),_=new Float32Array(x*4);for(let C=0;C<x;C++){const k=r.pick(e);U.set(k.p,C*3),D.set([r.range(2.5,26),r(),r.range(.012,.03),r()*Math.PI*2],C*4),_.set([r.range(.22,.6),k.delay,r(),k.accent],C*4)}I(new t.Mesh(X(ee,x,{aEye:new t.InstancedBufferAttribute(U,3),aB:new t.InstancedBufferAttribute(D,4),aB2:new t.InstancedBufferAttribute(_,4)}),N(ao,so,De)),7),fe+=(s+x)*2}await l.yield();let Ae=-1,qe=null,Ge=0,ut=0,dt=0;const Ie=new t.Vector3,Rt=(e,s)=>{const f=Math.hypot(e.x,e.z),w=Math.min(1,a.lean*Math.abs(e.y)/Math.max(f,1e-4));return s.set(e.x*w,e.y,e.z*w).normalize()},pt=(e,s)=>{const f=Math.cos(p);return Rt(s.set(-f*Math.cos(e+.4),-Math.sin(p),-f*Math.sin(e+.4)),s)},Oe=e=>{const s=Math.cos(p);Ie.set(-s*Math.cos(e),-Math.sin(p),-s*Math.sin(e)),G.uSunL.value.copy(Ie),pt(e,G.uSunC.value)},xt=e=>v+W*50*(e-P);Oe(v-W*26);const yt=e=>88-102*Math.pow(Math.min(1,Math.max(0,e)),.85),E=(e,s,f)=>new t.Vector3(e,s,f),Tt={entry:E(0,1.9,V+ze),portalSeat:{position:E(0,16,n.portalZ??-131),normal:E(0,0,1),width:14},flyThrough:[E(0,1.9,63.3),E(0,1.9,52),E(3.5,1.9,40),E(1,3.2,28),E(-12,8,18),E(-24,14,2),E(-12,19,-14),E(10,22,-24),E(4,18,-40),E(0,16,-52),E(0,16,-63.3),E(0,16,-131)],frame57:{position:E(1,3.2,28),target:E(0,24,-55)},platformTop:E(0,ue,0),platformRadius:Pt,pool:{center:E(0,Me,ce),radius:se},waterY:Me,basins:me.map(e=>E(e.x,3.2,e.z)),grilles:de.map(e=>E(e.x,0,e.z)),chambers:Fe.map(e=>E(e.x,0,e.z)),archW:E(0,0,V),archE:E(0,0,-V),eastArch:{width:20,height:34,zFrom:-V,zTo:-V-M},domeCrown:E(0,ie+he,0),sunDir:()=>Ie.clone(),viewpoints:[E(1,3.2,28),E(-24,14,2),E(10,22,-24),E(0,16,-52)]};return{object:Z,radius:13,height:-70,center:E(0,40,0),bounds:{radius:92,height:85},anchors:Tt,look:i,accent:d,ground:!1,groundY:0,stoneMaterial:ke,waterMaterial:ft,sheetMaterial:vt,addEyes:kt,setCoolEyes:Bt,maxCoolEyes:Ce,maxLamps:ge,accentIndex:S,uniforms:G,coolSunAt(e){return pt(xt(e),new t.Vector3)},get triangles(){return fe},MAT:H,setProgress(e){Ae=e},setSteamBase(e){qe=e},setCloud(e,s){ut=e,dt=s},setSun(e,s){p=e*Math.PI/180,v=s*Math.PI/180},update(e,s){const f=s%3600;G.uTime.value=f;let w,x;if(Ae<0){const D=f%48,_=D<20?D/20:D<42?1:1-le(42,48,D);w=yt(_),x=.3+.7*le(0,1,_),Ge=Math.min(Ge+e,70),Oe(v+W*(Ge-26))}else{const D=(Ae-m)/(P-m);w=yt(D),x=.3+.7*le(m-.04,P,Ae),Oe(xt(Ae))}G.uSteamBase.value=qe===null?w:qe,G.uHaze.value=a.haze*x*T;const U=f%20/20;G.uCloud.value.set(300-470*Math.min(U*1.5,1),.33,ut,dt)},dispose(){ee.dispose(),Ue.dispose()}}}export{Xe as ARCH,H as MAT,ro as archBay,Je as archH,co as basinInto,mo as basinSheetInto,fo as basinWaterInto,uo as buildCell,yo as buildHero,Pe as makeBuilder};
