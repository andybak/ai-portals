import*as e from"three";import*as he from"../kit/interior.js";const Ge={RD:27,Y0:20,YD0:35,YD1:59,Y1:85,FY:47,PITCH:Math.PI/12,RIN:26},ve=Math.PI*2,B=Ge.PITCH,Ie=.965,ae=(i,p=1)=>new e.Color(i).multiplyScalar(p),ce={PLAIN:0,WOOD:1,FABRIC:2,STONE:3,BRICK:4,FLOOR:5,BELT:6,PLATE:7,LAP:8,TUNNEL:9,ROOF:20,WINDOW:21},O=(i,p=.2,h=0,T=0,W=0)=>he.surf(i,p,h,T,W),Y=`
uniform float uLensAng, uTime, uBeamGain, uTopGain, uFogDen, uLeafOpen, uLeafSt, uFlare, uFlameGain, uJet, uBlind, uSnow, uBladeDen, uSway, uExit, uBladeHot, uRain, uBladeK, uSpark, uBayDim, uBayBeam, uFloorK, uBladePh;
uniform vec3 uBeamCol, uTopCol, uFogCol, uFlameCol, uRimCol, uPortalPos, uPortalCol, uShadowCol, uJetCol, uRoofCol, uGlassTint, uHatch, uLan, uLan2; uniform float uTun;
`,me=`
const float LW_PITCH = 0.2617994;
float lwHash(vec3 p){ p = fract(p * 0.3183099 + vec3(0.1, 0.17, 0.23)); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float lwNoise(vec3 x){ vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(lwHash(i), lwHash(i + vec3(1,0,0)), f.x), mix(lwHash(i + vec3(0,1,0)), lwHash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(lwHash(i + vec3(0,0,1)), lwHash(i + vec3(1,0,1)), f.x), mix(lwHash(i + vec3(0,1,1)), lwHash(i + vec3(1,1,1)), f.x), f.y), f.z); }
float lwBearing(vec2 xz){ return atan(xz.x, abs(xz.y) + abs(xz.x) < 1e-5 ? 1e-5 : xz.y); }
float lwMask(float i){ float k = mod(i, 24.0); float m = max(step(1.5, k) * (1.0 - uExit * (1.0 - step(0.5, abs(k - 2.0)))), uBayBeam * step(0.5, k) * (1.0 - step(1.5, k))); m *= 1.0 - uLeafOpen * (1.0 - step(1.0, abs(k - uLeafSt - 0.5))); return m; }
// x: metres sideways from the nearest blade's centre plane, y: radius, z: that station's mask, w: station index
vec4 lwStation(vec3 wp){ float r = length(wp.xz); float s = (lwBearing(wp.xz) - uLensAng) / LW_PITCH - 0.5; float i = floor(s + 0.5);
  return vec4(r * sin((s - i) * LW_PITCH), r, lwMask(i), i); }
float lwHeight(float y){ float a = smoothstep(16.0, 26.0, y) * (1.0 - smoothstep(77.0, 88.0, y)); float b = smoothstep(33.0, 38.0, y) * (1.0 - smoothstep(56.0, 61.0, y)); return 0.38 * a + 0.62 * b; }
float lwRadial(float r){ return smoothstep(27.0, 42.0, r) * (0.4 + 0.6 * exp(-r * 0.008)) / (1.0 + r * 0.0065); }
// (uFloorK: the lowest rings' spill, a spoke of light on the floor under every blade, from the foot of the pedestal outward)
float lwBeam(vec3 wp){ vec4 st = lwStation(wp); float lo = uFloorK * (1.0 - smoothstep(3.0, 17.0, wp.y)) * smoothstep(15.5, 25.0, st.y) * (0.4 + 0.6 * exp(-st.y * 0.008)) / (1.0 + st.y * 0.0065);
  return exp(-st.x * st.x * 0.09) * (lwHeight(wp.y) * lwRadial(st.y) + lo) * st.z * (1.0 - smoothstep(80.2, 82.2, wp.x)); }
// the optic's outline (glass radius at height y), as lensRadius() below
float lwLensR(float y){ float a = clamp((y - 59.5) / 25.5, 0.0, 1.0), b = clamp((35.0 - y) / 15.0, 0.0, 1.0); return 26.9 - 11.3 * a * sqrt(a) - 5.3 * b * sqrt(b); }
vec3 lwFog(vec3 col, vec3 wp){ float f = 1.0 - exp(-distance(wp, cameraPosition) * uFogDen); return mix(col, uFogCol * (1.0 - smoothstep(80.3, 82.5, wp.x)), f); }
// THE SPECTRA. Where a blade leaves a bull's-eye it is white-gold, but the prism rings beside the standards also throw
// thin sheets of dispersed light: each leaves the axis at one height between two slopes (red on one side, violet on the
// other) and only in a few bays. They turn with the optic, so broad soft bands of colour slide over floor, brick, rack,
// truss and dust: arcs on the floor round the pedestal, a low band across the walls and racks, a high one in the trusses.
vec3 lwHue(float t){ return clamp(abs(fract(t + vec3(0.0, 0.6667, 0.3333)) * 6.0 - 3.0) - 1.0, 0.0, 1.0); }
vec3 lwSheet(float slope, float t0, float t1){ float t = (slope - t0) / (t1 - t0); float e = sin(clamp(t, 0.0, 1.0) * 3.14159); return (lwHue(clamp(t, 0.0, 1.0) * 0.76) * 0.85 + 0.15) * e * e; }
float lwBay(float lb, float a){ float x = (fract((lb - a) * 0.25 + 0.5) - 0.5) * 4.0; return exp(-x * x * 2.6); }
vec3 lwRainbow(vec3 wp){
  float r = length(wp.xz); if (r < 28.5) return vec3(0.0);
  float lb = (lwBearing(wp.xz) - uLensAng) / LW_PITCH, m = mod(lb, 24.0);
  float glass = smoothstep(2.2, 2.9, m) * (1.0 - smoothstep(23.5, 24.0, m));
  vec3 c = lwSheet(wp.y - 30.0 > 0.0 ? 9.0 : (wp.y - 30.0) / r, -0.40, -0.68) * lwBay(lb, 3.0)
         + lwSheet((wp.y - 47.0) / r, -0.03, -0.10) * lwBay(lb, 2.4) * 0.85 * (1.0 - smoothstep(150.0, 220.0, r))
         + lwSheet((wp.y - 72.0) / r, 0.12, 0.27) * lwBay(lb, 0.4) * 0.8;
  return c * glass * smoothstep(28.5, 40.0, r) / (1.0 + r * 0.011) * (1.0 - smoothstep(80.2, 82.2, wp.x)) * uRain;
}
`,Me=`
vec3 lwRoof(vec3 wp){
  float sx = wp.x + 40.0, s = abs(sx), zc = wp.z;
  float bz = abs(fract(zc / 7.5 + 0.5) - 0.5) * 7.5, bs = abs(fract(s / 20.0 + 0.5) - 0.5) * 20.0;
  float bar = smoothstep(0.3, 0.85, bz) * smoothstep(0.5, 1.3, bs), soot = smoothstep(0.3, 3.0, bz);
  float pane = lwHash(vec3(floor(zc / 7.5), floor(s / 20.0), 7.0));
  float cloud = lwNoise(vec3(wp.x * 0.011, wp.z * 0.011, uTime * 0.03));
  vec3 c = uRoofCol * (0.7 + 0.16 * pane + 0.24 * cloud) * mix(0.6, 1.0, soot);
  c = mix(c, c * vec3(0.6, 0.98, 0.62), (1.0 - soot) * smoothstep(92.0, 118.0, s) * 0.75);
  float sl = s - uTime * 1.8;
  float sv = lwNoise(vec3(zc * 0.019 + step(0.0, sx) * 40.0, sl * 0.027, 3.0)) + 0.08 * lwNoise(vec3(zc * 0.21, sl * 0.3, 5.0));
  float sn = smoothstep(0.5, 0.52, sv) * uSnow, lip = (1.0 - smoothstep(0.02, 0.075, abs(sv - 0.52))) * uSnow;
  // snow lies on the glass in sheets that slide toward the eaves: from below they are blue-grey shadows on the bright panes
  c = mix(c, uRoofCol * vec3(0.2, 0.3, 0.5) * (0.8 + 0.3 * lwNoise(vec3(zc * 0.05, sl * 0.07, 9.0))), sn * 0.96) * (1.0 - 0.45 * lip);
  // the blinds: dark warm canvas running down from the ridge, bay by bay, a hard edge and a batten against the bright glass
  float bp = 126.0 * clamp(uBlind * 2.2 - 1.2 * fract(floor(zc / 30.0 + 0.4) * 0.618 + 0.3), 0.0, 1.0), on = step(0.05, bp);
  float bl = (1.0 - smoothstep(-0.35, 0.0, s - bp)) * on;
  vec3 canvas = uRoofCol * vec3(0.33, 0.215, 0.1) * (0.72 + 0.34 * lwNoise(vec3(zc * 0.35, s * 0.05, 1.0))) * (0.8 + 0.2 * step(0.06, fract(zc / 30.0 + 0.4))) * (0.86 + 0.14 * step(0.07, fract(s / 6.5)));
  c = mix(c, canvas, bl);
  c = mix(c, uRoofCol * vec3(0.045, 0.03, 0.018), (1.0 - smoothstep(0.75, 1.25, abs(s - bp + 0.3))) * on * (1.0 - step(125.9, bp)));
  float pg = 0.0;
  for (int i = 0; i < 12; i++) { float fi = float(i); vec3 h = vec3(lwHash(vec3(fi, 1.0, 2.0)), lwHash(vec3(fi, 5.0, 9.0)), lwHash(vec3(fi, 3.0, 4.0)));
    vec2 c0 = vec2(-150.0 + h.x * 220.0, -110.0 + h.y * 300.0); float ph = uTime * (0.25 + 0.3 * h.z) + h.x * 30.0;
    c0 += vec2(sin(ph) + 0.5 * sin(ph * 2.7), cos(ph * 0.8) + 0.4 * sin(ph * 3.1)) * 5.0;
    float fly = step(fi, 1.5) * smoothstep(0.8, 1.0, fract(uTime * 0.09 + h.y)); c0 += fly * vec2(46.0, 30.0 - 60.0 * h.z);
    float d = length((wp.xz - c0) * vec2(1.0, 0.75)); pg = max(pg, (1.0 - smoothstep(1.8, 3.6 + 6.0 * fly, d)) * (1.0 - 0.6 * fly)); }
  c *= 1.0 - 0.55 * pg * (1.0 - bl);
  return c * bar + uRoofCol * 0.035;
}
vec3 lwWindow(vec3 wp){
  float x = wp.x, y = wp.y, g = 0.8 + 0.12 * lwNoise(vec3(x * 0.05, y * 0.05, 2.0));
  float line = 50.0 + (x + 160.0) * 0.11, slope = 1.0 - smoothstep(line - 2.0, line + 2.0, y);
  float ch = (1.0 - smoothstep(3.0, 4.5, abs(x + 30.0))) * (1.0 - smoothstep(line + 24.0, line + 26.0, y));
  float sy = y - (line + 26.0), sxx = x + 30.0 - sy * 0.9 - 3.0 * sin(sy * 0.12 - uTime * 0.45);
  float sm = (1.0 - smoothstep(2.0 + sy * 0.25, 5.0 + sy * 0.45, abs(sxx))) * smoothstep(0.0, 3.0, sy) * (1.0 - smoothstep(22.0, 46.0, sy)) * (0.45 + 0.55 * lwNoise(vec3(sxx * 0.2, sy * 0.15 - uTime * 0.6, 1.0)));
  vec3 c = uRoofCol * 0.78 * g * (1.0 - 0.26 * max(slope, ch) - 0.16 * sm);
  float bx = abs(fract(x / 7.5 + 0.5) - 0.5) * 7.5, by = abs(fract(y / 9.0 + 0.5) - 0.5) * 9.0;
  return (c * smoothstep(0.25, 0.7, bx) * smoothstep(0.25, 0.7, by) + uRoofCol * 0.03) * uTopGain;
}
vec3 lwDetail(float id, vec3 q, vec3 qo, vec3 n, vec3 alb, inout float gloss, inout float emis){
  if (id < 0.5) { alb *= 0.8 + 0.3 * lwNoise(q * 0.9) + 0.12 * (lwNoise(q * 4.7) - 0.5); }
  else if (id < 1.5) { float g1 = lwNoise(vec3(q.x * 2.4, q.y * 0.2, q.z * 2.4)), g2 = lwNoise(vec3(q.x * 9.0, q.y * 0.7, q.z * 9.0)); alb *= 0.7 + 0.42 * g1 + 0.16 * (g2 - 0.5); }
  else if (id < 2.5) { alb *= 0.72 + 0.3 * lwNoise(q * 5.5) + 0.26 * lwNoise(q * 1.1); }
  else if (id < 3.5) { alb *= 0.8 + 0.25 * lwNoise(q * 2.2) + 0.1 * (lwHash(floor(q * 6.0)) - 0.5); }
  else if (id < 4.5) {
    vec2 uv = abs(n.x) > 0.6 ? q.zy : (abs(n.z) > 0.6 ? q.xy : q.xz);
    float row = floor(uv.y / 1.75), bu = uv.x / 5.6 + 0.5 * mod(row, 2.0), bi = floor(bu); vec2 f = vec2(fract(bu), fract(uv.y / 1.75));
    float h = lwHash(vec3(bi, row, 3.0));
    float body = smoothstep(0.0, 0.03, f.x) * (1.0 - smoothstep(0.97, 1.0, f.x)) * smoothstep(0.0, 0.1, f.y) * (1.0 - smoothstep(0.9, 1.0, f.y));
    float lb = smoothstep(0.16, 0.55, max(fwidth(uv.x) / 5.6, fwidth(uv.y) / 1.75)); h = mix(h, 0.45, lb); body = mix(body, 0.86, lb);
    vec3 brick = alb * (0.66 + 0.6 * h); brick = mix(brick, brick * vec3(0.6, 0.62, 0.72), step(0.86, h));
    brick = mix(brick, dot(brick, vec3(0.3, 0.5, 0.2)) * vec3(1.45, 0.82, 0.6), 0.3);       // warm red, a little browned
    brick *= 0.86 + 0.28 * lwNoise(q * 0.3);
    float lum = dot(alb, vec3(0.3, 0.5, 0.2));
    alb = mix(vec3(0.5, 0.47, 0.43) * (lum * 1.5 + 0.03), brick, body);
    alb *= mix(1.0, 0.55, smoothstep(88.0, 112.0, q.y)) * mix(0.62, 1.0, smoothstep(13.0, 15.0, q.y));
    // soot round the photometry hatch and up the wall above its lanterns
    vec2 hq = vec2(q.z - uHatch.z, (q.y - uHatch.y) * 0.75 - 4.0); float st = (1.0 - smoothstep(13.0, 40.0, length(hq))) * step(70.0, q.x) * (0.45 + 0.55 * lwNoise(vec3(q.z * 0.16, q.y * 0.05, 4.0)));
    alb = mix(alb, vec3(dot(alb, vec3(0.3, 0.5, 0.2))) * vec3(0.7, 0.52, 0.42), st * 0.8);
  }
  else if (id < 5.5) {
    float row = floor(q.z / 9.0), bu = q.x / 14.0 + 0.37 * row; vec2 f = vec2(fract(bu), fract(q.z / 9.0));
    float h = lwHash(vec3(floor(bu), row, 5.0));
    float joint = smoothstep(0.0, 0.02, f.x) * (1.0 - smoothstep(0.98, 1.0, f.x)) * smoothstep(0.0, 0.03, f.y) * (1.0 - smoothstep(0.97, 1.0, f.y));
    float wear = lwNoise(vec3(q.x * 0.045, 0.0, q.z * 0.045)), rouge = smoothstep(0.52, 0.8, lwNoise(vec3(q.x * 0.03 + 9.0, 2.0, q.z * 0.03)));
    alb *= (0.7 + 0.45 * h) * (0.75 + 0.5 * wear) * mix(0.45, 1.0, joint);
    alb = mix(alb, alb * vec3(1.9, 0.75, 0.55), rouge * 0.7);
    alb *= 1.0 + 0.5 * (1.0 - smoothstep(4.0, 17.0, abs(q.x))) * smoothstep(40.0, 70.0, q.z);
    gloss += 0.25 * wear;
  }
  else if (id < 6.5) { float t = qo.y * 0.11 + uTime * 1.3 * (emis > 0.5 ? 1.0 : -1.0); float lace = 1.0 - smoothstep(0.02, 0.05, abs(fract(t) - 0.5));
    alb *= 0.75 + 0.35 * lwNoise(vec3(q.x * 3.0, fract(t) * 9.0, q.z * 3.0)); alb = mix(alb, vec3(0.42, 0.36, 0.26), lace); emis = 0.0; }
  else if (id < 7.5) { vec2 p = (q.xz + q.yy * 0.5) * 1.1; vec2 d = abs(fract(vec2(p.x + p.y, p.x - p.y)) - 0.5); float stud = smoothstep(0.12, 0.2, min(d.x, d.y) + 0.25 * max(d.x, d.y));
    alb *= mix(1.25, 0.8, stud) * (0.8 + 0.3 * lwNoise(q * 0.5)); gloss += 0.2 * (1.0 - stud); }
  else if (id < 8.5) { float r = length(qo.xz); float a = atan(qo.z, abs(qo.x) + abs(qo.z) < 1e-5 ? 1e-5 : qo.x) + uTime * 2.4;
    float st = lwNoise(vec3(cos(a) * 3.0, sin(a) * 3.0, r * 1.6)); float wet = smoothstep(0.25, 0.45, r) * (1.0 - smoothstep(0.86, 0.97, r));
    alb = mix(alb, vec3(0.56, 0.1, 0.055) * (0.55 + 0.9 * st), wet * step(0.0, n.y - 0.5)); gloss = mix(gloss, 0.85, wet); }
  else {      // the tunnel's black-painted iron plate: seams, a row of rivets down each seam, the paint rubbed and streaked
    float ua = q.x / 3.3, ub = (abs(n.y) > 0.6 ? q.z : q.y) / 4.1;
    vec2 f = abs(fract(vec2(ua, ub)) - 0.5);
    float seam = max(smoothstep(0.478, 0.494, f.x), smoothstep(0.482, 0.495, f.y));
    vec2 r1 = vec2((0.5 - f.x) * 3.3 - 0.42, (fract(ub * 6.0) - 0.5) * 0.683), r2 = vec2((0.5 - f.y) * 4.1 - 0.42, (fract(ua * 5.0) - 0.5) * 0.66);
    float stud = 1.0 - smoothstep(0.1, 0.19, min(length(r1), length(r2)));
    float wear = lwNoise(vec3(q.x * 0.12, q.y * 0.9, q.z * 0.9)), pl = lwHash(vec3(floor(ua), floor(ub), 11.0));
    alb *= (0.5 + 0.5 * wear + 0.3 * pl) * (1.0 - 0.7 * seam);
    alb = mix(alb, alb * 1.3 + 0.004, stud); gloss = clamp(gloss + 0.35 * stud + 0.2 * (wear - 0.5), 0.05, 0.95);
  }
  return alb;
}
vec3 lwLight(vec3 wp, vec3 n, vec3 V, vec3 alb, float gloss, float metal){
  float up = n.y * 0.5 + 0.5;
  float ao = mix(0.42, 1.0, smoothstep(-2.0, 30.0, wp.y)) * mix(0.3, 1.0, max(smoothstep(21.0, 28.0, length(wp.xz)), 1.0 - smoothstep(17.0, 21.0, wp.y)));
  float dw = min(min(wp.x + 160.0, 80.0 - wp.x), min(wp.z + 150.0, 230.0 - wp.z));
  ao *= mix(1.0, mix(0.5, 1.0, smoothstep(0.0, 34.0, dw)), smoothstep(0.3, 0.7, n.y));
  float tun = smoothstep(79.6, 82.6, wp.x); ao *= 1.0 - 0.97 * tun;
  vec3 lit = uTopCol * uTopGain * (0.16 + 0.84 * pow(max(up, 0.0), 1.3)) * ao + uShadowCol * 0.035 * (1.0 - tun);
  float r = max(length(wp.xz), 1e-3); vec3 rad = vec3(wp.x, 0.0, wp.z) / r;
  float bm = lwBeam(wp) * uBeamGain * 1.5;      // where a blade lands it is a bright patch
  // under the warm lights (the blades, the lanterns, the gas) a surface gives back a browner, less saturated colour than
  // its own, so lit brick stays brown-red and never burns orange
  float lum = dot(alb, vec3(0.3, 0.5, 0.2)); vec3 albW = mix(alb, lum * vec3(1.2, 0.94, 0.74), 0.4);
  vec3 gasL = mix(uJetCol, vec3(1.0, 0.86, 0.68), 0.65);      // gaslight on a surface is pale straw, whatever the colour of the flame's own glow
  vec3 warm = uBeamCol * bm * clamp(dot(n, -rad) * 0.62 + 0.38, 0.0, 1.0);
  vec3 Lf = vec3(0.0, 47.0, 0.0) - wp; float d2 = dot(Lf, Lf); Lf /= sqrt(max(d2, 1e-3));
  float fl = (1.0 - smoothstep(27.0, 30.5, r)) * 520.0 / (d2 + 70.0); fl = 1.25 * (1.0 - exp(-fl / 1.25)) * uFlameGain;
  float fw = clamp(dot(n, Lf) * 0.86 + 0.14, 0.0, 1.0); lit += uFlameCol * fl * fw * fw * (1.0 - 0.7 * metal);
  if (uJet > 0.001) {
    float zj = clamp(floor((wp.z + 135.0) / 60.0 + 0.5), 0.0, 5.0) * 60.0 - 135.0;
    vec3 a = vec3(-156.0, 36.0, zj) - wp; float zk = clamp(floor((wp.z + 181.5) / 61.0 + 0.5), 1.0, 6.0) * 61.0 - 181.5; vec3 b = vec3(76.0, 36.0, zk) - wp;
    float da = dot(a, a), db = dot(b, b);
    warm += gasL * uJet * 0.42 * (600.0 / (da + 90.0) * clamp(dot(n, a / sqrt(max(da, 1e-3))) * 0.7 + 0.3, 0.0, 1.0) + 600.0 / (db + 90.0) * clamp(dot(n, b / sqrt(max(db, 1e-3))) * 0.7 + 0.3, 0.0, 1.0)) * (1.0 - tun);
  }
  vec3 col = (alb * lit + albW * warm) * (1.0 - 0.55 * metal);
  col += (albW * 0.55 + 0.06) * lwRainbow(wp) * clamp(dot(n, -rad) * 0.45 + 0.55 + 0.4 * n.y, 0.25, 1.0) * mix(0.6, 1.0, abs(n.y)) * (1.0 - tun);
  // the two signal lanterns hung in the upper corners of the hatch
  vec3 hv = vec3(uHatch.x + uLan.x, uHatch.y + uLan.y, uHatch.z + (wp.z > uHatch.z ? uLan.z : -uLan.z)) - wp; float hd = dot(hv, hv); hv /= sqrt(max(hd, 1e-3));
  float hs = wp.z > uHatch.z ? 1.7 : 0.0, hf = 0.86 + 0.09 * sin(uTime * 9.1 + hs) + 0.05 * sin(uTime * 23.7 + hs * 2.3);      // the flames breathe
  vec3 lanC = gasL * hf * 380.0 / (hd + 60.0) * (1.0 - 0.5 * tun);      // (inside the mouth the black plate takes less of it)
  // (inside the mouth the iron stays dark: the lanterns give it a lit edge and a highlight, and the portal's cool light carries the depth)
  col += albW * lanC * clamp(dot(n, hv) * 0.8 + 0.2, 0.0, 1.0) * (1.0 - 0.5 * metal) * (1.0 - 0.72 * tun);
  // and the pair hung inside the tunnel (uLan2: metres in, up, sideways off its centre line, which runs skew to the wall)
  float zc2 = uHatch.z - uLan2.x * uTun, s2 = wp.z > uHatch.z - max(wp.x - uHatch.x, 0.0) * uTun ? 1.0 : -1.0;
  vec3 hv2 = vec3(uHatch.x + uLan2.x, uHatch.y + uLan2.y, zc2 + s2 * uLan2.z) - wp; float hd2 = dot(hv2, hv2); hv2 /= sqrt(max(hd2, 1e-3));
  vec3 lanC2 = gasL * (0.86 + 0.09 * sin(uTime * 8.3 + s2) + 0.05 * sin(uTime * 21.1 + s2 * 2.3)) * 75.0 / (hd2 + 90.0) * tun;
  col += albW * lanC2 * clamp(dot(n, hv2) * 0.8 + 0.2, 0.0, 1.0) * (1.0 - 0.5 * metal) * 0.3;
  vec3 R = reflect(-V, n); vec3 f0 = mix(vec3(0.045), alb, metal);
  float sky = 0.3 + 0.7 * smoothstep(-0.2, 0.85, R.y), rl = max(dot(R, Lf), 0.0);
  sky = mix(sky, 0.03 + 0.5 * smoothstep(0.1, 0.95, R.y), (1.0 - smoothstep(24.0, 30.0, r)) * metal);
  col += f0 * gloss * (uTopCol * uTopGain * sky * ao * (0.3 + 1.5 * metal)
       + uBeamCol * bm * 2.2 * pow(max(dot(R, -rad), 0.0), 6.0 + 40.0 * gloss)
       + uFlameCol * fl * (3.0 * pow(rl, 8.0 + 60.0 * gloss) + 0.2 * metal * rl * rl * rl * rl)
       + lanC * 2.2 * (1.0 - 0.75 * tun) * pow(max(dot(R, hv), 0.0), 8.0 + 50.0 * gloss) + lanC2 * 0.7 * pow(max(dot(R, hv2), 0.0), 8.0 + 50.0 * gloss));
  // turned brass and bronze by the flame: dark where it faces the eye, bright round its limb, a broad warm gleam on the side toward the fire
  float rimM = 1.0 - max(dot(n, V), 0.0), glM = max(dot(n, Lf), 0.0);
  col += f0 * metal * uFlameCol * fl * (0.9 * rimM * rimM * rimM + 0.75 * glM * glM * glM) * (0.4 + 0.6 * gloss);
  // the portal's own cool light down the tunnel: on the plate and, at a glancing angle, mirrored along walls, floor and ribs
  vec3 pv = uPortalPos - wp; float pd = max(length(pv), 1e-3); pv /= pd;
  float pk = tun * 84.0 / (pd + 10.0), fr = 1.0 - max(dot(n, V), 0.0); fr *= fr; fr *= fr;
  col += uPortalCol * pk * ((alb * 1.7 + 0.008) * clamp(dot(n, pv) * 0.56 + 0.44, 0.0, 1.0) * (1.0 - 0.5 * metal)
       + (f0 + (1.0 - f0) * fr * 0.6) * gloss * 1.4 * pow(max(dot(R, pv), 0.0), 3.0 + 16.0 * gloss));
  return col;
}
`,Te=`
attribute vec4 surf;
#ifdef LW_SPIN
attribute vec2 aSpin;
#endif
varying vec3 vW, vN, vC, vO; varying vec4 vS;
void main(){
  vec3 p = position, n = normal;
  #ifdef LW_SPIN
    float a = uTime * aSpin.x + aSpin.y, c = cos(a), s = sin(a); p.xz = vec2(c * p.x + s * p.z, -s * p.x + c * p.z); n.xz = vec2(c * n.x + s * n.z, -s * n.x + c * n.z);
  #endif
  vO = position; vS = surf; vC = color;
  #ifdef USE_INSTANCING_COLOR
    vC *= instanceColor;
  #endif
  #ifdef USE_INSTANCING
    mat4 m = modelMatrix * instanceMatrix;
  #else
    mat4 m = modelMatrix;
  #endif
  vec4 w = m * vec4(p, 1.0);
  float sw = (1.0 - surf.w) * uSway;
  w.xz += sw * vec2(sin(uTime * 1.3 + w.y * 0.21 + w.z * 0.13), cos(uTime * 1.07 + w.x * 0.17 + w.y * 0.19));
  vW = w.xyz; vN = normalize(mat3(m) * n);
  gl_Position = projectionMatrix * viewMatrix * w;
}`,Se=`
varying vec3 vW, vN, vC, vO; varying vec4 vS;
void main(){
  vec3 n = normalize(vN); vec3 V = normalize(cameraPosition - vW);
  if (!gl_FrontFacing) n = -n;
  float id = floor(vS.x + 0.001), gloss = clamp((fract(vS.x) - 0.02) / 0.95, 0.0, 1.0), metal = vS.y, emis = vS.z;
  vec3 col;
  if (id > 20.5) col = lwWindow(vW);
  else if (id > 19.5) col = lwRoof(vW);
  else {
    #ifdef LW_OBJ
      vec3 q = vO; vec3 qn = n;
    #else
      vec3 q = vW; vec3 qn = n;
    #endif
    vec3 alb = lwDetail(id, q, vO, qn, vC, gloss, emis);
    col = lwLight(vW, n, V, alb, gloss, metal) + alb * emis;
  }
  gl_FragColor = vec4(lwFog(col, vW), 1.0);
}`,Le=`
attribute float aK;
#ifdef LW_PRISM
attribute vec4 aRing; attribute float aSt;
#endif
varying vec3 vW, vN, vP; varying vec2 vUv; varying float vK, vG;
void main(){
  vP = position; vG = 0.0;
  #ifdef LW_PRISM
    float cl = cos(aRing.z), sl = sin(aRing.z);
    vec2 sec = vec2(position.z, position.y) * aRing.w; sec = vec2(cl * sec.x - sl * sec.y, sl * sec.x + cl * sec.y);
    vec2 ns = vec2(normal.z, normal.y); ns = vec2(cl * ns.x - sl * ns.y, sl * ns.x + cl * ns.y);
    float b = (aSt + 0.5 + position.x * 0.992) * LW_PITCH;
    vec3 er = vec3(sin(b), 0.0, cos(b)), et = vec3(cos(b), 0.0, -sin(b));
    vec3 p = er * (aRing.x + sec.x) + vec3(0.0, aRing.y + sec.y, 0.0);
    vec3 n = er * ns.x + vec3(0.0, ns.y, 0.0) + et * normal.x;
    vec4 w = modelMatrix * vec4(p, 1.0); vN = normalize(mat3(modelMatrix) * n);
  #else
    #ifdef USE_INSTANCING
      mat4 m = modelMatrix * instanceMatrix;
    #else
      mat4 m = modelMatrix;
    #endif
    vec4 w = m * vec4(position, 1.0); vN = normalize(mat3(m) * normal);
    vG = dot(normalize(cameraPosition - m[3].xyz), normalize(m[0].xyz));      // how far to one side of this piece the eye stands (the same at every corner)
  #endif
  vW = w.xyz; vUv = uv; vK = aK;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,Re=`
varying vec3 vW, vN, vP; varying vec2 vUv; varying float vK, vG;
// the hall as a piece of glass holds it: pewter roof with its glazing bars above, red brick and the north windows round
// the horizon (with the gold patches of the blades standing on the walls), the dark floor below
vec3 lwEnv2(vec3 d, float wk, float bk){
  float az = lwBearing(d.xz), up = d.y / max(length(d), 1e-3);
  float bars = smoothstep(0.06, 0.2, abs(fract(az * 7.0) - 0.5));
  vec3 roof = uRoofCol * uTopGain * mix(vec3(1.0), vec3(0.34, 0.28, 0.19), uBlind) * (0.5 + 0.38 * bars) * (0.72 + 0.28 * smoothstep(0.2, 0.9, up));
  float win = smoothstep(0.55, 0.8, -cos(az)) * smoothstep(0.1, 0.25, abs(fract(az * 5.0) - 0.5));
  vec3 wall = vec3(0.30, 0.085, 0.052) * wk * uTopCol * uTopGain * (0.6 + 0.4 * sin(az * 9.0) * sin(az * 23.0 + 1.3));
  wall = mix(wall, uRoofCol * uTopGain * 0.5, win * (1.0 - 0.6 * uBlind));
  float sx = (fract((az - uLensAng) / LW_PITCH) - 0.5) * 5.0;
  wall += uBeamCol * bk * exp(-sx * sx) + uJetCol * uJet * 1.4 * pow(0.5 + 0.5 * cos(az * 12.0), 60.0);
  vec3 ground = uShadowCol * 0.05 + vec3(0.05, 0.036, 0.026) * uTopCol * uTopGain;
  return mix(mix(ground, wall, smoothstep(-0.2, -0.05, up)), roof, smoothstep(0.08, 0.24, up));
}
vec3 lwEnv(vec3 d){ return lwEnv2(d, 1.0, 0.16); }
void main(){
  vec3 V = normalize(cameraPosition - vW); vec3 N = normalize(vN); if (dot(N, V) < 0.0) N = -N;
  float s = vK > 4.5 ? length(vUv * 2.0 - 1.0) : vUv.y, fw = min(fwidth(s), 1.0);
  vec3 px = dFdx(vW), py = dFdy(vW); float sx = dFdx(s), sy = dFdy(s);
  float rr = max(length(vW.xz), 1e-3); vec3 rad = vec3(vW.x, 0.0, vW.z) / rr;
  vec3 Lf = vec3(0.0, 47.0, 0.0) - vW; float dl = max(length(Lf), 1e-3); Lf /= dl;
  float dist = distance(vW, cameraPosition);
  float inner = smoothstep(0.05, 0.3, dot(N, Lf));          // a face the flame shines on: seen from the hollow, or through a gap
  float camIn = 1.0 - smoothstep(24.5, 27.5, length(cameraPosition.xz));      // the eye is inside the optic
  vec2 vh = V.xz; float vl = length(vh); vh = vl > 1e-3 ? vh / vl : rad.xz;
  float wb = lwBearing(vW.xz), fwb = min(fwidth(wb), 0.2);
  #ifdef LW_STOCK
    float xp = 0.0, stM = 0.0, stI = 0.0, bayDim = 0.0; inner = 0.0; camIn = 0.0;
  #else
    vec4 st = lwStation(vW); float xp = clamp(st.x / (rr * LW_PITCH), -0.6, 0.6), stM = st.z, stI = st.w;
    // the glass beside the empty bay stands in its own shadow as we leave by it: dark standards, not walls of lit glass
    float bayDim = uBayDim * inner * (1.0 - smoothstep(1.0, 6.0, abs(mod(stI + 11.5, 24.0) - 12.0)));
  #endif
  // the axis across the bar (the way s grows), and how far round it the eye stands
  #ifdef LW_PRISM
    vec3 Ac = vec3(0.0, 1.0, 0.0) - N * N.y; float al = length(Ac); Ac = al > 0.05 ? Ac / al : vec3(0.0, 1.0, 0.0);
    float sh = vK < 0.5 ? dot(V, Ac) : V.y;
  #else
    float ga = dot(px, px), gb = dot(px, py), gc = dot(py, py), det = ga * gc - gb * gb;
    vec3 Ac = det > 1e-12 ? px * ((sx * gc - sy * gb) / det) + py * ((sy * ga - sx * gb) / det) : vec3(0.0, 1.0, 0.0);
    float al = length(Ac); Ac = al > 1e-5 ? Ac / al : vec3(0.0, 1.0, 0.0);
    float sh = dot(V, Ac);
  #endif
  float c = clamp(0.56 - 0.4 * sh, 0.36, 0.86);
  // GLASS. A bar is a little cylinder lens: through it the far side of the hall is seen flipped across the bar and
  // squeezed into its width (so every bar and every step holds the roof, a line of brick and the floor), its face
  // mirrors the hall at a glancing angle, and thick glass is a deep bottle colour of its own.
  float sq = s - 0.5, bendK = (vK > 0.5 && vK < 1.5) ? 1.5 : 1.15;
  vec3 Nc = normalize(N + Ac * sq * bendK);
  float f1 = 1.0 - max(dot(Nc, V), 0.0), f5 = f1 * f1; f5 *= f5 * f1; float F = 0.05 + 0.95 * f5;
  vec3 side = vec3(-V.z, 0.0, V.x) * (xp * 1.7);
  vec3 Td = -V + side - Ac * sq * 2.5;
  vec3 Rc = reflect(-V, Nc);
  vec3 black = uShadowCol * 0.04 + uRimCol * 0.004;
  vec3 deep = black + uRimCol * uTopGain * (0.010 + 0.05 * f1 * f1);
  vec3 thru = lwEnv(Td) * uGlassTint;
  if (inner > 0.01) {      // from within, a ring holds a soft band of pewter roof over red brick (no black floor), the bright roof held down
    vec3 Ti = -V + side - Ac * sq * 1.3 + vec3(0.0, 0.1, 0.0); float til = max(length(Ti.xz), 1e-3); Ti.y = max(Ti.y, -0.03 * til);
    vec3 ti = lwEnv(Ti) * uGlassTint; float tl = dot(ti, vec3(0.3, 0.5, 0.2));
    ti = ti * 1.9 / (1.0 + 3.0 * tl) * mix(vec3(1.45, 0.95, 0.85), vec3(1.0), smoothstep(0.06, 0.26, Ti.y / til)) + uFlameCol * uFlameGain * 0.015;
    thru = mix(thru, ti, inner);
  }
  vec3 body = deep + thru * (0.17 + 0.4 * inner) * (1.0 - F) + lwEnv(Rc) * F * (0.48 + 0.02 * inner);
  // thick glass has a colour of its own: sea-green, graded across each bar from a deep edge to a pale one (the pale side
  // slides with the eye), so a panel reads as stepped glass and not as stripes
  float ramp = smoothstep(-0.1, 1.1, s + 0.45 * sh);
  body += (uRimCol * (0.04 + 0.3 * ramp * ramp) + uRoofCol * 0.04 * ramp * ramp * ramp) * uTopGain * (1.0 - 0.6 * uBlind) * (1.0 - inner);
  body += uRoofCol * uTopGain * (1.0 - 0.6 * uBlind) * 0.28 * pow(max(Rc.y, 0.0), 10.0) * (1.0 - inner);      // the ridge light, a soft band to a bar
  vec3 pd = uPortalPos - vW; vec2 ph = pd.xz; float pl = length(ph); ph = pl > 1e-3 ? ph / pl : vec2(1.0, 0.0);
  vec2 hl = Td.xz; float hll = length(hl); hl = hll > 1e-3 ? hl / hll : -vh; float tdy = Td.y / max(length(Td), 1e-3);
  body += uPortalCol * smoothstep(0.988, 0.9985, dot(hl, ph)) * exp(-tdy * tdy * 90.0) * 2.4;
  float ed = min(s, 1.0 - s);
  body *= mix(0.45 + 0.55 * smoothstep(0.0, 0.3 + fw, ed), 1.0, 0.62 * inner);     // each bar deepens toward its two edges
  if (vK > 0.5 && vK < 1.5) body *= mix(0.6 + 0.4 * smoothstep(0.0, 0.12 + fw, abs(s - 0.4)), 1.0, 0.4 * inner);    // and the ridge of a prism seen from within
  // the edges: a hairline of sea-green that the light splits into a thread of spectrum, sliding as the lens turns
  float hair = (1.0 - smoothstep(0.02 + 0.5 * fw, 0.042 + fw, ed)) * 0.03 / (0.03 + fw);
  float fringe = (1.0 - smoothstep(0.03, 0.2 + fw, ed)) * 0.42 * (1.0 - smoothstep(0.25, 0.7, fw)) * (1.0 - 0.9 * inner);
  vec3 rimC = (uRimCol * 0.55 + uRimCol * (0.25 + uRimCol.g) * 0.42) * (0.56 * uTopGain + 0.14 * uFlameGain * inner);
  // one glint of the flame to a bar: it stands where the eye's line meets the flame's, shifted by the panel's
  // figure, so it slides along the bar as the lens turns; the bars level with the eye hold the hardest ones
  float a = rad.x * vh.y - rad.z * vh.x;
  float farK = smoothstep(30.0, 90.0, dist);
  float f = a + 0.6 * xp, wa = 0.034 + dist * 0.0007;
  float sg = clamp(mix(c + 0.2, c - 0.36, smoothstep(0.55, 0.65, c)), 0.12, 0.88), ws = max(0.05, fw * 0.8);
  float dy = (vW.y - cameraPosition.y) / 9.0;
  float gl = exp(-f * f / (wa * wa) - a * a * 9.0 * farK) * exp(-(s - sg) * (s - sg) / (ws * ws)) * mix(0.22 + 0.78 * exp(-dy * dy), 0.8, farK) * (0.05 / ws) * (1.0 - inner);
  // the flame's own light on the faces that look at it: a soft warm sheen, and its mirror image
  vec3 Nb = vK > 4.5 ? normalize(N - Ac * s * 0.8) : normalize(N + Ac * (s - 0.5) * 0.9); vec3 Rr = reflect(-V, Nb); float rl = max(dot(Rr, Lf), 0.0);
  float sheen = inner * (0.035 * pow(rl, 10.0) + 4.0 * pow(rl, 220.0) + 0.012 * max(dot(N, Lf), 0.0)) * (1.0 - 0.85 * bayDim);
  // far off, a bar is thinner than a pixel: use its mean
  float lod = smoothstep(0.14, 0.55, fw);
  float n1 = 1.0 - max(dot(N, V), 0.0), n5 = n1 * n1; n5 *= n5 * n1;
  vec3 mean = deep + (lwEnv(-V + side + Ac * 0.8) + lwEnv(-V + side) + lwEnv(-V + side - Ac * 0.8)) * uGlassTint * ((0.15 + 0.3 * inner) / 3.0) + lwEnv(reflect(-V, N)) * (0.05 + 0.95 * n5) * 0.7 + (uRoofCol * 0.03 + uRimCol * 0.085) * uTopGain * (1.0 - 0.6 * uBlind) * (1.0 - inner);
  vec3 col = mix(mix(mix(body, body * 0.6 + rimC * 0.5, fringe), rimC, hair), mean, lod * (1.0 - inner * (1.0 - smoothstep(0.3, 0.8, fw))));
  if (vK > 3.5) {             // the boss: a small lens; the hall hangs upside down in it
    vec3 Nd = vK > 4.5 ? Nb : N;
    vec3 tilt = vK > 4.5 ? Ac * s * 0.9 : Nd - V * dot(Nd, V);
    vec3 Tb = -V + side - tilt * 2.4;
    float nd1 = 1.0 - max(dot(Nd, V), 0.0), nd5 = nd1 * nd1; nd5 *= nd5 * nd1;
    col = deep * (1.0 + 2.0 * (1.0 - s)) + lwEnv(Tb) * uGlassTint * (0.5 + 0.3 * inner) * (1.0 - smoothstep(0.55, 1.0, s)) + lwEnv(reflect(-V, Nd)) * (0.04 + 0.96 * nd5);
    col = mix(col, rimC, smoothstep(0.9, 0.95, s) * (1.0 - smoothstep(0.97, 1.03, s)) * (1.0 - lod));
    col += uRoofCol * uTopGain * 0.9 * pow(max(reflect(-V, Nd).y, 0.0), 24.0) * (1.0 - smoothstep(0.5, 0.8, s)) * (1.0 - inner);
    gl = exp(-f * f / (wa * wa)) * (1.0 - smoothstep(0.08, 0.34, s)) * exp(-dy * dy) * (1.0 - inner) * 0.6;
  } else if (vK > 2.5) {      // risers: glass seen edge-on, deep at the root, a pale lip, the hall mirrored at a glancing angle
    float lip = smoothstep(0.55, 1.0, s);
    col = black + rimC * (0.025 + 0.13 * lip * lip) * (1.0 - 0.5 * inner) + uRimCol * uTopGain * (1.0 - 0.6 * uBlind) * (0.045 + 0.13 * lip) * (1.0 - inner) + uRimCol * 0.02 * uFlameGain * inner * (0.3 + 0.7 * lip) + lwEnv(reflect(-V, N)) * (0.03 + 0.6 * n5)
        + lwEnv(-V + side) * uGlassTint * 0.26 * inner;      // from within a riser is glass too, not a black line
  }
  else if (vK > 1.5) col = rimC * 0.1 + black;
  #ifndef LW_STOCK
  float inK = max(camIn, 0.85 * inner);
  // close to, from outside, a bar holds the hall in the same way (nearO): the close sweep passes glass, not paint
  float nearO = 0.0;      // (from outside the bars keep their sea-green body at every distance: blind viewers chose it over clear grey glass at close range)
  if (inK > 0.001 || nearO > 0.001) {
    // FROM WITHIN the optic is a cool room walled in clear, finely stepped glass. Every facet (each of a prism ring's two
    // inner faces, each step of a bull's-eye panel) is a small lens that holds the hall once, squeezed and upside down:
    // the pewter roof as a pale silver body that grades away from the facet's edge, the red brick as one thin line with
    // the gold of a blade sliding along it, then the dark floor. Green is an edge colour only: a rim along a bar's free
    // edges. The flame gives the glass one hard glint to a bar, so it stays the one gold thing in the room.
    float isP = (vK > 0.5 && vK < 1.5) ? 1.0 : 0.0;
    float tt, faceW, rimD;      // tt: 0..1 across one facet; faceW: the facet's share of s; rimD: how far from a free edge
    float stepK = 1.0;      // a panel's step has one free edge and takes a thinner rim than a prism bar
    if (isP > 0.5) { if (s > 0.4) { tt = (s - 0.4) / 0.6; faceW = 0.6; } else { tt = s / 0.4; faceW = 0.4; } rimD = min(s, 1.0 - s) * 2.0; stepK = 0.0; }
    else if (vK > 4.5) { tt = clamp(s * 0.75, 0.0, 1.0); faceW = 1.0; rimD = 1.0; }
    else { tt = s; faceW = 1.0; rimD = s; }
    float wI = fw / faceW, lodI = smoothstep(0.1, 0.4, wI);      // a pixel's width across the facet
    float tv = mix(tt * 1.15 + 0.05 + 0.1 * sh, tt + 0.2 * sh - 0.04, inK);      // the picture slides in the facet as the eye moves
    vec2 hh = -V.xz + vec2(-V.z, V.x) * (xp * 0.9); float hhl = length(hh); hh = hhl > 1e-3 ? hh / hhl : rad.xz;
    vec3 roofI = lwEnv2(vec3(hh.x * 0.8, 0.6, hh.y * 0.8), 2.2, 0.3), wallI = lwEnv2(vec3(hh.x, -0.02, hh.y), 2.2, 0.3);
    roofI = roofI / (1.0 + 0.9 * dot(roofI, vec3(0.3, 0.5, 0.2))) * (vec3(0.52, 0.92, 0.80) + uRimCol * 0.34);      // thick glass: the roof light comes through it sea-green
    wallI = wallI / (1.0 + 0.6 * dot(wallI, vec3(0.3, 0.5, 0.2))) * (1.3 - 0.3 * inK) * vec3(1.18, 0.82, 0.74);      // (seen through from outside the brick is in the open light)
    float wrapL = clamp(dot(N, Lf) * 0.55 + 0.45, 0.0, 1.0);
    vec3 floorI = uShadowCol * 0.07 + uRimCol * mix(0.045, 0.07, inK) * (uTopGain + 0.2 * uFlameGain);      // the arris: deep green, never black
    // across the facet: bright at its edge, greying toward the brick line (the roof seen lower and lower), with the faint
    // ladder of the glazing bars; then the brick; then the floor
    float gradeI = mix(1.05, 0.5, smoothstep(0.0, 0.6, tv)) * (0.9 + 0.1 * smoothstep(0.3 - wI, 0.34 + wI, abs(fract(tv * 5.0 + 0.5) - 0.5) * 2.0));
    float a1 = smoothstep(0.57 - wI, 0.62 + wI, tv), a2 = smoothstep(0.71 - wI, 0.8 + wI, tv);
    vec3 gI = mix(mix(roofI * gradeI, wallI, a1), floorI, a2) * (0.72 + 0.28 * wrapL);
    vec3 meanI = (roofI * 0.46 + wallI * 0.2 + floorI * 0.2) * (0.72 + 0.28 * wrapL) + uRimCol * 0.03 * uTopGain;
    gI = mix(gI, meanI, lodI);
    // the green rim along a bar's free edges, and inside it a hairline of shadow where bar meets bar
    // (from outside it is a hairline: its width is held to the edge band however few pixels the facet has, and it thins instead of spreading)
    float rimI = (1.0 - smoothstep(mix(0.015, 0.05, inK) + 0.5 * wI, mix(0.05, 0.15 - 0.06 * stepK, inK) + wI, rimD)) * (1.0 - lodI) * mix(0.05 / (0.05 + wI), 1.0, inK);
    gI = mix(gI, uRimCol * (0.95 * uTopGain + 0.15 * uFlameGain) + uRoofCol * 0.06 * uTopGain, rimI * 0.9);
    gI *= mix(1.0, 0.45 + 0.55 * smoothstep(0.0, 0.03 + wI, rimD), 1.0 - lodI);
    gI = mix(gI, gI * (uRimCol * 1.5 + 0.25), (0.5 - 0.25 * stepK) * inK * (1.0 - smoothstep(0.0, 0.32 - 0.1 * stepK, rimD)) * (1.0 - lodI));      // the green runs a little way in from the rim
    gI += uFlameCol * uFlameGain * 0.012 * wrapL;
    // one hard glint of the flame to a bar: each ring carries it at a bearing of its own on the wall beyond the lamp, and
    // they slide along the bars as the lens turns
    if (isP > 0.5) {
      float rid = floor(vW.y / 1.36), gh = lwHash(vec3(rid, 3.0, 7.0));
      float gd = wb - lwBearing(-cameraPosition.xz) - (gh - 0.5) * 2.6 - uLensAng * (0.6 + 0.8 * gh);
      gd = (fract(gd / 6.2832 + 0.5) - 0.5) * 6.2832;
      float gw = 0.011 + 0.4 * fwb, gt = (tt - 0.22) / (0.1 + wI);
      gI += uFlameCol * vec3(1.0, 0.86, 0.55) * uFlameGain * 2.6 * exp(-gd * gd / (gw * gw) - gt * gt) * min(1.0, 0.011 / gw * 2.0) * (1.0 - 0.8 * lodI) * inK;
    }
    float oK = nearO * (vK < 1.5 ? 0.94 : (vK > 2.5 && vK < 3.5 ? 0.85 : 0.0));
    vec3 colO = mix(col, vK < 1.5 ? gI * vec3(0.9, 0.98, 0.97) * 0.95 : meanI * 0.42 + uRimCol * 0.02 * uTopGain, oK);
    if (vK > 4.5) {          // the boss pane holds the flame, upright and gold
      vec2 bq = vUv * 2.0 - 1.0; float fim = exp(-bq.x * bq.x * 12.0 * (1.0 + 1.6 * max(bq.y + 0.2, 0.0)) - (bq.y + 0.05) * (bq.y + 0.05) * 5.0);
      gI = mix(gI, col, 0.3) * (0.55 + 0.45 * smoothstep(0.2, 1.0, s)) + uFlameCol * vec3(1.0, 0.8, 0.46) * uFlameGain * (2.3 * fim + 0.1 * exp(-dot(bq, bq) * 1.5)) * (1.0 - 0.85 * bayDim);
    }
    else if (vK > 3.5) gI = mix(gI, col, 0.6);
    else if (vK > 1.5) gI = mix(gI * 0.7, uRimCol * 0.1 * uTopGain, 0.45);      // risers and end caps: glass seen edge-on, deeper and greener
    col = mix(colO, gI, inK);
  }
  #endif
  col *= 1.0 - 0.8 * bayDim;
  #ifdef LW_STOCK
    // glass in stock is dark clear glass: the hall dim in it, a pale line where its ground edge catches the roof, and
    // (below) one glint; no bright stripes, and green only as a thread on that edge
    float pe = max(abs(vP.x) / 3.32, abs(vP.y) / 11.75), edge = smoothstep(0.955, 0.972, pe) * (1.0 - smoothstep(0.985, 1.0, pe)) * step(0.2, vP.z) * step(2.8, max(abs(vP.x), abs(vP.y)));
    vec3 clear = black + lwEnv(Td) * uGlassTint * 0.09 * (1.0 - F) + lwEnv(Rc) * F * 0.8 + uRimCol * uTopGain * 0.006;
    clear *= 0.75 + 0.25 * smoothstep(0.02, 0.1 + fw, ed);
    col = mix(clear, col, 0.16) + (uRoofCol * 0.13 + uRimCol * 0.05) * uTopGain * edge * (1.0 - lod);
  #endif
  // sparkle: now and then one facet in fourteen throws the roof straight at the eye for an instant, white-gold
  #ifdef LW_STOCK
    vec2 cp = vec2(vW.z * 0.8 + vW.x * 0.31, vW.y * 0.8); float swing = vh.x * 23.0 + vh.y * 17.0 + V.y * 9.0 + uTime * 0.7;
  #else
    vec2 cp = vec2((wb - uLensAng) * 24.0, vW.y * 0.75); float swing = wb * 31.0 + lwBearing(vh) * 17.0 + V.y * 9.0;
  #endif
  vec2 ci = floor(cp), cf = fract(cp) - 0.5; float hs = lwHash(vec3(ci, 3.0));
  float fwc = min(max(fwidth(cp.x), fwidth(cp.y)), 1.0);
  float tw = max(sin(hs * 6.2832 * 7.0 + swing), 0.0); tw *= tw; tw *= tw; tw *= tw; tw *= tw; tw *= tw;
  float spark = tw * step(0.93, hs) * exp(-dot(cf, cf) / (0.012 + fwc * fwc * 0.6)) * min(1.0, 0.3 / max(fwc, 0.03)) * (1.0 - inner) * uSpark;
  vec3 sparkC = uRoofCol * uTopGain * (1.0 - 0.5 * uBlind) * 0.3 + uFlameCol * vec3(1.0, 0.9, 0.68) * 0.5;      // roof-white warmed by the flame: never a colour of its own (the brief forbids spectra)
  vec3 emis = vec3(0.0);
  #ifdef LW_STOCK
    // glass in stock (racks, benches, the cradle): it catches the blade as it slides over, and the spectra
    float bm = lwBeam(vW) * uBeamGain;
    col += uBeamCol * bm * (0.05 + 0.4 * hair + 0.5 * edge + 0.2 * smoothstep(0.05, 0.4, tdy) + 0.5 * pow(max(dot(reflect(-V, N), -rad), 0.0), 24.0));
    col += lwRainbow(vW) * (0.05 + 0.3 * hair + 0.3 * edge);
    // one glint to a panel: the roof caught at one place on its top edge, sliding along it as the eye moves
    float gx = (vP.x - 2.4 * vG) / 0.3;
    emis += uRoofCol * uTopGain * (1.0 - 0.6 * uBlind) * 1.5 * edge * step(10.5, vP.y) * exp(-gx * gx) * (1.0 - 0.7 * lod);
    emis += sparkC * spark * (0.5 + 2.0 * min(bm, 1.5));
  #else
    emis += sparkC * spark * 3.2;
    // THE LIT LENS, seen from outside. Light that leaves the glass is added after the fog, so the lamp shows through dust.
    float outK = 1.0 - inner;
    vec2 ce = cameraPosition.xz; float cr = length(ce); vec2 e2 = cr > 1e-3 ? ce / cr : rad.xz;
    float bi = (stI + 0.5) * LW_PITCH + uLensAng; vec2 p2 = vec2(sin(bi), cos(bi));
    float cd = dot(p2, e2), sd = e2.x * p2.y - e2.y * p2.x;              // cos and sin of the eye's bearing off this panel's own axis
    float limb = max(dot(rad.xz, e2), 0.0), away = smoothstep(27.5, 33.0, cr) * outK;
    col += uFlameCol * uFlameGain * sheen;
    // the glints, and far off a lantern's worth of stray light in the body of the glass
    float farK2 = smoothstep(100.0, 200.0, dist);
    emis += uFlameCol * uFlameGain * (gl * (5.0 + 7.0 * farK + 5.0 * farK2) + away * limb * limb * (0.012 + 0.06 * farK + 0.05 * farK2));
    // the panel turned toward the eye fills with the flame: boss blooming, steps burning, and the bars of its bay in the tiers
    float hy = (cameraPosition.y - 47.0) / 13.0;
    #ifdef LW_PRISM
      float hk = smoothstep(14.0, 26.0, cameraPosition.y) * (1.0 - smoothstep(77.0, 90.0, cameraPosition.y)) * 0.34 * farK, q = 0.5;
    #else
      float hk = exp(-hy * hy), q = clamp(max(abs(xp) * 2.0, abs(vW.y - 47.0) / 12.0), 0.0, 1.0);
      emis += uBeamCol * away * limb * (0.34 * farK + 0.2 * farK2) * (vK > 3.5 ? 1.0 : 0.62);      // far off the whole waist band burns
    #endif
    float face = exp(-(1.0 - cd) * 64.0) * stM * away * hk;
    // close to, a lit step is a dark bar with one line of fire down its middle; far off the lines run together and the panel is full
    float core = mix(0.3 + 0.7 * (1.0 - smoothstep(0.08, 0.5, abs(s - 0.5))), 0.62, max(lod, farK));
    float flr = mix(uFlare * 0.8, max(uFlare, 1.0), farK) * (1.0 + 0.35 * farK2);
    float bx = st.x / (1.0 + dist * 0.004), by = (vW.y - 47.0) / (2.0 + dist * 0.006);      // the boss burns from its middle, not as a flat pane
    emis += uBeamCol * face * flr * (1.0 - (vK > 3.5 ? 0.3 : 0.9) * nearO) * (vK > 3.5 ? 0.22 + 2.8 * exp(-bx * bx - by * by) : (1.7 - 1.1 * q) * core * (vK > 2.5 ? 1.0 : smoothstep(0.0, 0.08, ed)));
    // and every boss holds a small upright image of the flame, leaning toward the eye's side; far off it fills the boss
    if (vK > 3.5) {
      float wx = 0.22 + dist * 0.0028, wy = 0.75 + dist * 0.0032;
      float fx = (st.x - 0.42 * sd) / wx, fy = (vW.y - 46.7) / wy;
      float img = exp(-fx * fx * (1.0 + 0.9 * max(fy, 0.0)) - fy * fy);
      emis += uFlameCol * uFlameGain * img * (0.9 + 2.4 * max(cd, 0.0)) * outK;
    }
  #endif
  gl_FragColor = vec4(lwFog(col, vW) + emis * exp(-dist * uFogDen * 0.6), 1.0);
}`,ye=[-7.6,13,15],xe=[7.6,92,262],Pe=`
attribute float aSt; varying vec3 vL, vO, vWp; varying float vM;
void main(){
  float a = (aSt + 0.5) * LW_PITCH + uLensAng, c = cos(a), s = sin(a);
  vec3 lp = position;
  if (lp.z > 100.0) {
    float m = 1000.0;
    if (s > 1e-4) m = min(m, (79.6 - c * lp.x) / s); else if (s < -1e-4) m = min(m, (-159.6 - c * lp.x) / s);
    if (c > 1e-4) m = min(m, (229.6 + s * lp.x) / c); else if (c < -1e-4) m = min(m, (-149.6 + s * lp.x) / c);
    lp.z = clamp(m, 32.0, lp.z);
  }
  vec3 w = vec3(c * lp.x + s * lp.z, lp.y, -s * lp.x + c * lp.z);
  vWp = w; vL = lp; vO = vec3(c * cameraPosition.x - s * cameraPosition.z, cameraPosition.y, s * cameraPosition.x + c * cameraPosition.z);
  vM = lwMask(aSt);
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
}`,Ae=`
varying vec3 vL, vO, vWp; varying float vM;
uniform vec3 uBMin, uBMax; uniform float uBladeGain, uBladeVeil;
float lwErf(float x){ float a = abs(x); float t = 1.0 - exp(-a * a * (1.2732 + 0.14 * a * a) / (1.0 + 0.14 * a * a)); return sign(x) * sqrt(max(t, 0.0)); }
// a blade in the dust is a tall plank of light with three bright courses, one from each tier of the optic: a ribbon
// off the crown rings (seen from below it passes overhead), the hot core off the bull's-eyes, a ribbon off the lowest
// rings. lwBand is the mean of one soft course over the heights y0..y1 that a ray crosses inside the plank.
float lwQ(float x){ float c = clamp(x, 0.0, 1.0); return 0.5 * c * c + max(x - 1.0, 0.0); }
float lwBand(float y0, float y1, float a, float b, float e){
  float d = y1 - y0;
  if (abs(d) < 0.05) { float y = 0.5 * (y0 + y1); return clamp((y - a) / e, 0.0, 1.0) - clamp((y - b) / e, 0.0, 1.0); }
  return e * ((lwQ((y1 - a) / e) - lwQ((y1 - b) / e)) - (lwQ((y0 - a) / e) - lwQ((y0 - b) / e))) / d;
}
// density of lit dust at p, t metres down the ray. Seen from far off (the aisle, the previous portal) a blade starts at
// the glass, is thickest and hottest there and thins outward; close to the eye the root is left clear, so that on the
// orbit the lens is not lost in its own glare. x: density, y: density weighted by the root's heat, z: weight
vec3 lwHR(vec3 p, float t){ float r = length(p.xz), r0 = lwLensR(p.y) + 0.9, far = smoothstep(42.0, 105.0, t), root = exp(-max(r - r0, 0.0) * 0.024);
  float w = smoothstep(r0, r0 + 2.4, r) * exp(-t * uFogDen) * (0.3 * smoothstep(0.5, 7.0, t) + 0.7 * smoothstep(3.0, 30.0, t));
  float dn = 0.03 + 0.75 * smoothstep(27.0, 70.0, r) * exp(-r * 0.005), df = 0.2 + 0.8 * root;
  return vec3(w * mix(dn, df, far), w * root * far, w); }
void main(){
  if (vM < 0.004) discard;
  vec3 ro = vO, d = vL - vO; float dl = length(d); if (dl < 1e-3) discard; vec3 rd = d / dl;
  vec3 sg = vec3(rd.x < 0.0 ? -1.0 : 1.0, rd.y < 0.0 ? -1.0 : 1.0, rd.z < 0.0 ? -1.0 : 1.0);
  vec3 inv = sg / max(abs(rd), vec3(1e-5));
  vec3 t1 = (uBMin - ro) * inv, t2 = (uBMax - ro) * inv; vec3 tn = min(t1, t2), tx = max(t1, t2);
  float t0 = max(max(tn.x, tn.y), tn.z), tE = min(min(tx.x, tx.y), tx.z);
  // the plank stops at the hall's walls and floor
  vec3 wd = vWp - cameraPosition; wd /= max(length(wd), 1e-4);
  float hx = ((wd.x > 0.0 ? 80.0 : -160.0) - cameraPosition.x) / (abs(wd.x) < 1e-5 ? (wd.x < 0.0 ? -1e-5 : 1e-5) : wd.x);
  float hz = ((wd.z > 0.0 ? 230.0 : -150.0) - cameraPosition.z) / (abs(wd.z) < 1e-5 ? (wd.z < 0.0 ? -1e-5 : 1e-5) : wd.z);
  float hy = wd.y < -1e-4 ? -cameraPosition.y / wd.y : 1e6;
  tE = min(tE, min(min(hx, hz), hy));
  if (tE <= max(t0, 0.0)) discard;
  // near faces draw the plank where it starts more than a metre off, far faces where it starts nearer (or round the eye);
  // the two hand over across a soft band, so no seam shows where they meet
  float wgt = smoothstep(0.8, 1.2, t0); if (!gl_FrontFacing) wgt = 1.0 - wgt;
  if (wgt < 0.002) discard;
  float ta = max(t0, 0.0), tb = tE, len = tb - ta;
  float K = uBladeK;
  float ax = abs(rd.x), ua = (ro.x + rd.x * ta) * K, ub = (ro.x + rd.x * tb) * K, tm = 0.5 * (ta + tb);
  float gA = 0.8862 / (K * max(ax, 1e-3)) * abs(lwErf(ub) - lwErf(ua));
  float um = (ro.x + rd.x * tm) * K, gB = exp(-um * um) * len;
  float gi = min(mix(gB, gA, smoothstep(0.0005, 0.002, ax)), len);
  gi = 30.0 * (1.0 - exp(-gi / 30.0));      // (a blade seen along its length is many times brighter than one seen through its face: that is what parts the fan)
  // sample the stretch of the ray that lies inside the plank's body (within 5 m of its centre plane)
  float ivx = 1.0 / (rd.x + (rd.x < 0.0 ? -1e-5 : 1e-5)), i1 = (-5.0 - ro.x) * ivx, i2 = (5.0 - ro.x) * ivx;
  float s0 = clamp(min(i1, i2), ta, tb), s1 = clamp(max(i1, i2), ta, tb);
  float tA = mix(s0, s1, 0.15), ts = mix(s0, s1, 0.5), tC = mix(s0, s1, 0.85);
  vec3 h3 = (lwHR(ro + rd * tA, tA) + lwHR(ro + rd * ts, ts) + lwHR(ro + rd * tC, tC)) / 3.0;
  float hr = h3.x, heat = h3.y / max(h3.z, 1e-3);
  float yA = ro.y + rd.y * s0, yC = ro.y + rd.y * s1;
  hr *= 0.04 * lwBand(yA, yC, 18.0, 84.0, 5.0) + 0.34 * lwBand(yA, yC, 35.0, 59.0, 4.0) + 0.6 * lwBand(yA, yC, 72.5, 80.5, 4.5) + 0.55 * lwBand(yA, yC, 15.5, 22.5, 4.0);
  vec3 pc = ro + rd * ts;
  float grain = 0.4 + 0.72 * lwNoise(vec3(pc.x * 0.16, pc.y * 0.11 - uTime * 0.07, pc.z * 0.045 + uTime * 0.05)) + 0.56 * lwNoise(vec3(pc.x * 0.5 + 7.0, pc.y * 0.34 - uTime * 0.16, pc.z * 0.12 + uTime * 0.11));
  // dust throws light mostly onward: a blade that comes toward the eye stands out as a slab, one that goes away is faint,
  // so the fan is a set of separate blades with darker air between and not one even haze
  // (only once it is clear of the optic: in front of the glass a blade keeps its plain strength, so the lens is not lost in glare)
  vec3 pm = ro + rd * mix(s0, s1, 0.5);
  float fwd = clamp(0.5 - 0.5 * rd.z, 0.0, 1.0), phase = mix(1.0, mix(0.72, 0.42 + 2.2 * fwd * fwd * fwd, smoothstep(34.0, 76.0, pm.z)), uBladePh);
  float glow = wgt * (1.0 - exp(-gi * hr * grain * uBladeDen * vM * phase)) * mix(0.5, 1.0, max(smoothstep(1.5, 8.0, abs(ro.x)), 1.0 - smoothstep(20.0, 29.0, ro.z)));
  // hottest and most golden where it leaves the glass
  vec3 bc = uBeamCol * mix(vec3(1.0, 0.78, 0.46), vec3(1.08, 0.9, 0.6), heat) * (1.0 + uBladeHot * heat);
  gl_FragColor = vec4(bc * uBeamGain * uBladeGain * glow, glow * uBladeVeil);
}`;function Ne(i={}){const p={uLensAng:{value:0},uTime:{value:0},uBeamGain:{value:2},uTopGain:{value:1},uFogDen:{value:.0042},uLeafOpen:{value:0},uLeafSt:{value:i.leafStation??14},uFlare:{value:1},uFlameGain:{value:1},uJet:{value:0},uBlind:{value:0},uSnow:{value:0},uBladeDen:{value:.05},uSway:{value:.45},uRain:{value:.6},uBladeK:{value:.3},uSpark:{value:1},uBayDim:{value:0},uBayBeam:{value:0},uFloorK:{value:1.3},uBladePh:{value:1},uBeamCol:{value:ae("#FFE7AE")},uTopCol:{value:ae("#a9b0b6",1.15)},uFogCol:{value:ae("#8f8c86",.42)},uFlameCol:{value:ae("#ffdf9c")},uRimCol:{value:ae("#3FBF9F")},uPortalPos:{value:new e.Vector3(86,47,12)},uHatch:{value:new e.Vector3(80,47,-29)},uPortalCol:{value:ae("#ffe7ae",0)},uShadowCol:{value:ae("#23201E")},uJetCol:{value:ae("#ffb36a")},uRoofCol:{value:ae("#C4CACB",1.25)},uGlassTint:{value:ae("#dfeee8")},uLan:{value:new e.Vector3(-2.4,8.2,9.2)},uLan2:{value:new e.Vector3(13.4,6.9,7.9)},uTun:{value:0},uBMin:{value:new e.Vector3(...ye)},uBMax:{value:new e.Vector3(...xe)},uBladeGain:{value:.22},uBladeVeil:{value:.08},uExit:{value:0},uBladeHot:{value:2}},h=new Map;return{uniforms:p,surface:(m={})=>{const C=(m.obj?"o":"w")+(m.spin?"s":"")+(m.side??e.FrontSide);if(h.has(C))return h.get(C);const w={};(m.obj||m.spin)&&(w.LW_OBJ=1),m.spin&&(w.LW_SPIN=1);const K=new e.ShaderMaterial({uniforms:p,defines:w,vertexColors:!0,side:m.side??e.FrontSide,vertexShader:Y+Te,fragmentShader:Y+me+Me+Se});return h.set(C,K),K},glass:m=>{const C="g"+(m===!0?"p":m==="stock"?"s":"m");if(h.has(C))return h.get(C);const w=new e.ShaderMaterial({uniforms:p,defines:m===!0?{LW_PRISM:1}:m==="stock"?{LW_STOCK:1}:{},side:e.DoubleSide,vertexShader:Y+me+Le,fragmentShader:Y+me+Re});return h.set(C,w),w},blade:()=>new e.ShaderMaterial({uniforms:p,side:e.DoubleSide,transparent:!0,depthWrite:!1,blending:e.CustomBlending,blendSrc:e.OneFactor,blendDst:e.OneMinusSrcAlphaFactor,blendEquation:e.AddEquation,vertexShader:Y+me+Pe,fragmentShader:Y+me+Ae}),GLSL_UNI:Y,GLSL_FN:me,dispose(){for(const m of h.values())m.dispose()}}}const Be=new e.Matrix4,ze=new e.Vector3,J=new e.Vector3,S=new e.Vector3,ue="#8a6a34",D="#5c4524",A="#c79a45",U="#34383b",Fe="#1f2224",F=O(ce.PLAIN,.62,.9),u=O(ce.PLAIN,.8,1),L=O(ce.PLAIN,.35,.55),ge=O(ce.PLAIN,.12,.2);function b(i,p,h,T,W,z,m,C){J.set(h[0]-p[0],h[1]-p[1],h[2]-p[2]);const w=J.length()||.001;J.divideScalar(w),S.set(z[0],z[1],z[2]),S.addScaledVector(J,-S.dot(J)),S.lengthSq()<1e-6&&S.set(J.y,-J.x,.01),S.normalize(),ze.crossVectors(J,S),Be.makeBasis(ze,J,S).setPosition((p[0]+h[0])/2,(p[1]+h[1])/2,(p[2]+h[2])/2),i.add(new e.BoxGeometry(T,w,W),{m:Be,c:m,surf:C})}function fe(i){return i>=59.5?26.9-11.3*Math.pow(Math.min(1,(i-59.5)/25.5),1.5):i<=35?26.9-5.3*Math.pow(Math.min(1,(35-i)/15),1.5):27}function We(i=4){const p=[],h=[],T=[],W=[],z=[],m=[0,.5],C=[0,-.5],w=[-.9,-.1],K=[[C,m,[1,0],0],[w,C,[-.406,-.914],1],[m,w,[-.555,.832],1]];for(const[oe,se,E,le]of K){const X=p.length/3;for(let N=0;N<=i;N++){const V=N/i-.5;for(let $=0;$<2;$++){const Z=$?se:oe;p.push(V,Z[1],Z[0]),h.push(0,E[1],E[0]),T.push(N/i,Z[1]+.5),z.push(le)}}for(let N=0;N<i;N++){const V=X+N*2;W.push(V,V+2,V+1,V+1,V+2,V+3)}}for(const oe of[-.5,.5]){const se=p.length/3;for(const E of[m,C,w])p.push(oe,E[1],E[0]),h.push(Math.sign(oe),0,0),T.push(oe<0?0:1,.5),z.push(2);W.push(se,se+1,se+2)}const Q=new e.BufferGeometry;return Q.setAttribute("aK",new e.Float32BufferAttribute(z,1)),Q.setAttribute("position",new e.Float32BufferAttribute(p,3)),Q.setAttribute("normal",new e.Float32BufferAttribute(h,3)),Q.setAttribute("uv",new e.Float32BufferAttribute(T,2)),Q.setIndex(W),Q}function ke(i=9){const p=[],h=[],T=[],W=[],z=[],m=(v,M,R,t,r,l=0)=>{const f=p.length/3;ze.set(M[0]-v[0],M[1]-v[1],M[2]-v[2]),J.set(t[0]-v[0],t[1]-v[1],t[2]-v[2]),S.crossVectors(ze,J).normalize(),(S.z<0||Math.abs(S.z)<1e-4&&S.x*v[0]+S.y*v[1]<0)&&S.negate();const y=[v,M,R,t],d=r||[[0,0],[1,0],[1,1],[0,1]];for(let o=0;o<4;o++)p.push(y[o][0],y[o][1],y[o][2]),h.push(S.x,S.y,S.z),T.push(d[o][0],d[o][1]),z.push(l);W.push(f,f+1,f+2,f,f+2,f+3)},E=(v,M)=>{const R=3.32-v*.272,t=11.75-v*1.02;return[[R,-t,M],[R,t,M],[-R,t,M],[-R,-t,M]]};for(let v=0;v<i;v++){const M=E(v,.52),R=E(v+1,.08);for(let t=0;t<4;t++)m(M[t],M[(t+1)%4],R[(t+1)%4],R[t]);if(v<i-1){const t=E(v+1,.08),r=E(v+1,.52);for(let l=0;l<4;l++)m(r[l],r[(l+1)%4],t[(l+1)%4],t[l],[[0,.5],[1,.5],[1,.5],[0,.5]],3)}}const le=E(i,.08);m(le[0],le[1],le[2],le[3],null,5);const X=14,N=5,V=p.length/3,$=.84,Z=3.32-i*.272;for(let v=0;v<=N;v++){const M=v/N*1.12,R=Math.sin(M)/Math.sin(1.12),t=(Math.cos(M)-Math.cos(1.12))/(1-Math.cos(1.12));for(let r=0;r<=X;r++){const l=r/X*ve,f=Math.cos(l)*R*$*(Z/$)*.96,y=Math.sin(l)*R*$*1.9;p.push(f,y,.08+t*.85),S.set(Math.cos(l)*Math.sin(M),Math.sin(l)*Math.sin(M)*.6,Math.cos(M)).normalize(),h.push(S.x,S.y,S.z),T.push(.5,v/N),z.push(4)}}for(let v=0;v<N;v++)for(let M=0;M<X;M++){const R=V+v*(X+1)+M,t=R+X+1;W.push(R,t,R+1,R+1,t,t+1)}const H=new e.BufferGeometry;return H.setAttribute("position",new e.Float32BufferAttribute(p,3)),H.setAttribute("normal",new e.Float32BufferAttribute(h,3)),H.setAttribute("uv",new e.Float32BufferAttribute(T,2)),H.setAttribute("aK",new e.Float32BufferAttribute(z,1)),H.setIndex(W),H.computeBoundingSphere(),H}function qe({teeth:i=20,spokes:p=6,thick:h=.18,color:T=A,surf:W=u,rim:z=.14}={}){const m=he.makeBuilder(),C=[[1-z,-h/2],[1,-h/2],[1,h/2],[1-z,h/2],[1-z,-h/2]].map(w=>new e.Vector2(w[0],w[1]));m.add(new e.LatheGeometry(C,28),{c:T,surf:W}),m.add(new e.CylinderGeometry(.2,.2,h*1.7,12),{c:T,surf:W}),m.add(new e.CylinderGeometry(.09,.09,h*3.2,8),{c:U,surf:L});for(let w=0;w<p;w++){const K=w/p*ve;m.add(new e.BoxGeometry(.72,h*.55,.11),{p:[Math.cos(K)*.52,0,-Math.sin(K)*.52],r:[0,K,0],c:T,surf:W})}for(let w=0;w<i;w++){const K=w/i*ve;m.add(new e.BoxGeometry(.09,h*.9,.5*ve/i),{p:[Math.cos(K)*1.035,0,-Math.sin(K)*1.035],r:[0,K,0],c:T,surf:W})}return m.build()}const a=(i,p=1,h=0)=>[Math.sin(i)*p,h,Math.cos(i)*p];async function Ke(i,p={}){const h=!p.light,T=p.leafStation??14,W=i.quality?.detail??1,z=p.light||Ne({leafStation:T}),m=z.uniforms;m.uLeafSt.value=T;const C=new e.Group,w=new e.Group;C.add(w);const K=z.surface(),Q=z.surface({obj:!0}),oe=z.surface({spin:!0});{const t=he.makeBuilder(),r=[20,23.75,27.5,31.25,35,59.5,63,66.5,70,73.5,77,80.5,83,85];for(let o=0;o<24;o++){const G=o>>1,I=o&1,c=o*B,x=I?.5:1.15,g=I?.95:1.6,ee=I?ue:D;for(let pe=0;pe<r.length-1;pe++){const q=r[pe],j=r[pe+1],s=q>=35&&j<=59.5;if(s&&I&&(G===0||G===T/2))continue;const n=fe(q)+.25,P=fe(j)+.25,ne=s?0:I?.14:.3,be=s?g:g-2*ne+.04;if(b(t,a(c,n+ne,q),a(c,P+ne,j),x,be,a(c),ee,F),!s){const k=(q<35?1.7:1.35)*.9*Ie+.38;b(t,a(c,n-k,q),a(c,P-k,j),I?.42:.7,.2,a(c),I?"#9a7636":"#86652e",F)}if(!I&&s){b(t,a(c,n-.95,q),a(c,P-.95,j),.46,.4,a(c),"#9a7636",F);for(const k of[-.5,.5])b(t,a(c+k/n,n-.84,q),a(c+k/P,P-.84,j),.12,.14,a(c),"#d9b25a",u);for(let k=0;k<10;k++){const we=q+(j-q)*(k+.5)/10;t.add(new e.CylinderGeometry(.15,.19,.3,6),{p:a(c,n-1.2,we),r:[Math.PI/2,c,0],c:A,surf:u})}}if(!I){b(t,a(c,n+.85,q),a(c,P+.85,j),.4,.35,a(c),ue,F);const k=s?8:1;for(let we=0;we<k;we++){const te=(we+.5)/k,ie=q+(j-q)*te,_=n+(P-n)*te+.82;for(const re of[-.4,.4]){const de=a(c+re/_,_,ie);t.add(new e.CylinderGeometry(.17,.2,.3,6),{p:de,r:[Math.PI/2,c,0],c:A,surf:u})}}}}await i.yield()}await i.yield();for(const[o,G,I]of[[20,1.5,1.9],[35,1.3,1.7],[59.5,1.3,1.7],[85,1.4,1.8]]){const c=fe(o)+.3;for(let x=0;x<24;x++)b(t,a(x*B,c,o),a((x+1)*B,c,o),G,I,a((x+.5)*B),D,F);await i.yield()}for(const o of[27.5,66.5,73.5,80.5]){const G=fe(o)+.2;for(let I=0;I<24;I++)b(t,a(I*B,G,o),a((I+1)*B,G,o),.34,.5,a((I+.5)*B),ue,F);await i.yield()}const l=[[15.9,85.2],[16.4,86.4],[13.2,88.6],[7.4,91],[3.2,92.2],[3.2,95],[4.6,95.7],[2.2,96.6],[.01,98.2]].map(o=>new e.Vector2(o[0],o[1]));t.add(new e.LatheGeometry(l,24),{c:ue,surf:F});for(let o=0;o<12;o++)b(t,a(o*B*2,15.6,86.4),a(o*B*2,3.4,92.3),.45,.6,[0,1,0],A,u);await i.yield();{const o="#d9b25a",G="#6e5222",I=[[4.75,65.1],[4.95,65.5],[4.7,66],[4.2,66.5],[3.3,68.3],[2.6,70.4],[2.2,72.6],[2.2,79.6],[2.5,79.9],[2.5,80.6],[2.2,80.9],[2.2,91.9]].map(c=>new e.Vector2(c[0],c[1]));t.add(new e.LatheGeometry(I,24),{c:"#b58c3e",surf:u,grad:[65,92,1.15,.7]}),t.add(new e.TorusGeometry(4.9,.24,6,28).rotateX(Math.PI/2),{p:[0,65.4,0],c:o,surf:u});for(const[c,x,g]of[[66.6,4.15,G],[68.3,3.35,o],[70.4,2.66,G],[72.7,2.3,o],[76.4,2.3,G],[84.2,2.3,o],[88,2.3,G]])t.add(new e.TorusGeometry(x,.15,5,22).rotateX(Math.PI/2),{p:[0,c,0],c:g,surf:u});await i.yield();for(let c=0;c<12;c++){const x=c*B*2+B;b(t,a(x,2.35,80.2),a(x,15.5,85.5),.34,.55,[0,1,0],A,u),t.add(new e.SphereGeometry(.42,7,5),{p:a(x,2.6,80.25),c:o,surf:u}),t.add(new e.SphereGeometry(.5,7,5),{p:a(x,15.3,85.4),c:o,surf:u}),t.add(new e.BoxGeometry(.5,1.5,.12),{p:a(x,2.24,74.6),r:[0,x,0],c:"#120c05",surf:ge}),t.add(new e.BoxGeometry(.62,.14,.3),{p:a(x,2.34,75.42),r:[0,x,0],c:o,surf:u});const g=c*B*2;if(b(t,a(g,15.7,85.9),a(g,13.1,88.2),.3,.7,[0,1,0],G,F),b(t,a(g,13.1,88.2),a(g,7.4,90.6),.3,.7,[0,1,0],G,F),b(t,a(g,7.4,90.6),a(g,2.3,91.9),.3,.6,[0,1,0],G,F),c%2===0){const ee=x+B*2;b(t,a(ee,4.55,66.05),a(ee,fe(73.5)-.2,73.5),.2,.2,[0,1,0],"#a88238",u),t.add(new e.SphereGeometry(.36,7,5),{p:a(ee,4.6,66.1),c:o,surf:u})}c%3===2&&await i.yield()}for(const[c,x,g]of[[13,88,A],[10.2,89.2,G],[7.3,90.4,A],[4.4,91.2,G]])t.add(new e.TorusGeometry(c,.2,5,36).rotateX(Math.PI/2),{p:[0,x,0],c:g,surf:u});for(let c=0;c<24;c++)t.add(new e.BoxGeometry(1.5,.12,.7),{p:a(c*B+B/2,10.2,89.55),r:[0,c*B+B/2+Math.PI/2,.42],c:"#1a1208",surf:ge})}await i.yield();const f=new e.RingGeometry(3.4,21.9,48,3);f.rotateX(-Math.PI/2),t.add(f,{p:[0,20.35,0],c:"#4a4d4c",surf:O(ce.PLATE,.3,.5)}),t.add(new e.CylinderGeometry(21.9,21.9,1.1,48,1,!0),{p:[0,19.8,0],c:U,surf:L}),t.add(new e.TorusGeometry(3.5,.28,6,24).rotateX(Math.PI/2),{p:[0,20.6,0],c:A,surf:u});for(let o=0;o<12;o++)b(t,a(o*B*2+B,3.6,20.5),a(o*B*2+B,21.6,20.5),.3,.22,[0,1,0],"#3a3d3c",L);await i.yield();const y=t.build(),d=new e.Mesh(y,z.surface({obj:!0,side:e.DoubleSide}));w.add(d)}await i.yield();{const t=We(4),r=new e.InstancedBufferGeometry;r.index=t.index;for(const d of["position","normal","uv","aK"])r.setAttribute(d,t.attributes[d]);const l=[],f=[],y=(d,o)=>{const G=fe(d),I=fe(d+.5)-fe(d-.5),c=Math.atan(-I);for(let x=0;x<24;x++)l.push(G,d,c,o*Ie),f.push(x)};for(let d=0;d<8;d++)y(20.9+(d+.5)*(13.6/8),13.6/8);for(let d=0;d<18;d++)y(60.2+(d+.5)*(24.3/18),24.3/18);r.setAttribute("aRing",new e.InstancedBufferAttribute(new Float32Array(l),4)),r.setAttribute("aSt",new e.InstancedBufferAttribute(new Float32Array(f),1)),r.instanceCount=f.length,r.boundingSphere=new e.Sphere(new e.Vector3(0,52,0),46),w.add(new e.Mesh(r,z.glass(!0)))}const se=ke(9),E=z.glass(!1);{const t=[];for(let f=0;f<24;f++)f>1&&f!==T&&f!==T+1&&t.push(f);const r=new e.InstancedMesh(se,E,t.length),l=new e.Object3D;t.forEach((f,y)=>{const d=(f+.5)*B;l.position.set(...a(d,26.6,47)),l.rotation.set(0,d,0),l.updateMatrix(),r.setMatrixAt(y,l.matrix)}),r.instanceMatrix.needsUpdate=!0,r.computeBoundingSphere(),w.add(r)}await i.yield();const le=[];for(const t of[0,1]){const r=(T+t*2)*B,l=t?-1:1,f=new e.Group;f.position.set(...a(r,26.85,47)),f.userData={closed:r+l*B/2,sgn:-l};const y=new e.Mesh(se,E);y.position.set(l*3.5,0,-.2),f.add(y);const d=he.makeBuilder(),o=l*.12,G=l*6.9;b(d,[o,-11.95,0],[o,11.95,0],.55,.9,[0,0,1],D,F),b(d,[G,-11.95,0],[G,11.95,0],.42,.8,[0,0,1],ue,F),b(d,[o,11.95,0],[G,11.95,0],.5,.85,[0,0,1],ue,F),b(d,[o,-11.95,0],[G,-11.95,0],.5,.85,[0,0,1],ue,F);for(const c of[-9,0,9])d.add(new e.CylinderGeometry(.42,.42,1.7,10),{p:[0,c,.1],c:A,surf:u}),d.add(new e.SphereGeometry(.3,8,6),{p:[G,c*.5,.75],c:A,surf:u});const I=new e.CylinderGeometry(2.6,2.6,.22,20,1,!1,0,Math.PI);I.rotateY(l>0?-Math.PI/2:Math.PI/2),d.add(I,{p:[l*.2,-12.3,0],c:A,surf:u}),f.add(new e.Mesh(d.build(),z.surface({obj:!0,side:e.DoubleSide}))),w.add(f),le.push(f)}const X=t=>{const r=Math.max(0,Math.min(1,t))*1.95;for(const l of le)l.rotation.y=l.userData.closed+l.userData.sgn*r;m.uLeafOpen.value=Math.min(1,t*4)};X(0),await i.yield();{const t=new e.BoxGeometry(xe[0]-ye[0],xe[1]-ye[1],xe[2]-ye[2],1,20,1);t.translate(0,(xe[1]+ye[1])/2,(xe[2]+ye[2])/2);{const f=t.attributes.position;for(let y=0;y<f.count;y++)f.getZ(y)<ye[2]+.01&&f.setZ(y,fe(f.getY(y))+1.5)}const r=new e.InstancedBufferGeometry;r.index=t.index,r.setAttribute("position",t.attributes.position),r.setAttribute("aSt",new e.InstancedBufferAttribute(new Float32Array(24).map((f,y)=>y),1)),r.instanceCount=24;const l=new e.Mesh(r,z.blade());l.frustumCulled=!1,l.renderOrder=6,C.add(l)}const N=Math.PI/4,V=13.86;{const t=he.makeBuilder();t.add(new e.CylinderGeometry(19.2,19.8,4.2,8,1).rotateY(N/2),{p:[0,2.1,0],c:"#3b3d3c",surf:O(ce.STONE,.12),grad:[0,4.2,.6,1]}),t.add(new e.CylinderGeometry(17.6,19.2,1,8,1).rotateY(N/2),{p:[0,4.7,0],c:U,surf:L});for(let s=0;s<8;s++){const n=s*N,P=s===0,ne=Math.sin(n),be=Math.cos(n),k=Math.cos(n),we=-Math.sin(n),te=(_,re,de=0)=>[ne*(V+de)+k*_,re,be*(V+de)+we*_];if(P){for(const[_,re,de,Ce]of[[-5.1,12.2,1.4,14.2],[5.1,12.2,1.4,14.2],[0,18.5,11.6,1.6],[0,5.9,11.6,1.6]])t.add(new e.BoxGeometry(de,Ce,.7),{p:te(_,re),r:[0,n,0],c:U,surf:L});for(const[_,re,de,Ce]of[[-4.3,12.2,.22,11],[4.3,12.2,.22,11],[0,17.6,8.8,.22],[0,6.8,8.8,.22]])t.add(new e.BoxGeometry(de,Ce,.3),{p:te(_,re,.4),r:[0,n,0],c:A,surf:u});t.add(new e.BoxGeometry(11.4,14,.3),{p:te(0,12.2,-6.5),r:[0,n,0],c:"#17191a",surf:ge})}else{t.add(new e.BoxGeometry(11.6,14.2,.6),{p:te(0,12.2),r:[0,n,0],c:U,surf:L,grad:[5,19,.7,1]}),t.add(new e.BoxGeometry(8.6,10.6,.5),{p:te(0,12.2,.3),r:[0,n,0],c:"#2a2d2f",surf:ge}),t.add(new e.BoxGeometry(7.4,9.4,.4),{p:te(0,12.2,.55),r:[0,n,0],c:U,surf:L});for(let _=0;_<10;_++)for(const re of[6.2,18.2])t.add(new e.SphereGeometry(.2,6,4),{p:te(-4.95+_*1.1,re,.38),c:"#4a4e50",surf:L})}await i.yield();const ie=n+N/2;t.add(new e.CylinderGeometry(.62,.72,14.4,10),{p:a(ie,15,12.2),c:"#40444a",surf:L,grad:[5,19,.7,1.05]}),t.add(new e.CylinderGeometry(.95,1.05,.7,10),{p:a(ie,15,5.35),c:D,surf:F}),t.add(new e.CylinderGeometry(1.1,.8,.8,10),{p:a(ie,15,19),c:D,surf:F}),b(t,a(ie,15.4,15.5),a(ie,21.2,18.9),.5,.8,[0,1,0],U,L),b(t,a(ie,15.4,18.9),a(ie,21.2,18.9),.5,.6,[0,1,0],U,L)}await i.yield(),t.add(new e.CylinderGeometry(16.6,15.2,1.2,8,1).rotateY(N/2),{p:[0,19.7,0],c:"#2c2f31",surf:L});const r=[[20.4,18.9],[22.2,18.9],[22.2,19.5],[20.4,19.5],[20.4,18.9]].map(s=>new e.Vector2(s[0],s[1]));t.add(new e.LatheGeometry(r,48),{c:"#2c2f31",surf:L});const l=[[2.6,19.9],[2.6,21.2],[1.5,22.4],[1.15,30],[1.35,30.6],[1,31.2],[.95,38.6],[2.6,39.6],[2.8,40.2],[1.3,40.8],[1.3,42.4],[1.75,42.9],[1.75,43.6],[1.25,44]].map(s=>new e.Vector2(s[0],s[1]));t.add(new e.LatheGeometry(l,24),{c:"#b0883a",surf:u,grad:[20,44,.6,1.1]}),await i.yield();for(let s=0;s<4;s++)t.add(new e.CylinderGeometry(.28+s*.24,.28+s*.24,.5,14,1,!0),{p:[0,44.1,0],c:"#d9b25a",surf:u});for(const[s,n,P]of[[21.3,2.62,D],[22.5,1.56,A],[26.2,1.34,D],[30.3,1.4,"#d9b25a"],[34.8,1.02,D],[38.7,1.1,"#d9b25a"],[39.9,2.86,D],[40.9,1.36,"#d9b25a"],[42.6,1.5,D],[43.7,1.8,"#d9b25a"]])t.add(new e.TorusGeometry(n,.11,5,20).rotateX(Math.PI/2),{p:[0,s,0],c:P,surf:u});for(let s=0;s<16;s++){const n=s*ve/16;t.add(new e.BoxGeometry(.2,.42,.1),{p:a(n,1.77,43.25),r:[0,n,0],c:"#140e06",surf:ge}),t.add(new e.BoxGeometry(.34,.5,.1),{p:a(n+.2,2.72,39.9),r:[0,n+.2,0],c:"#2a1e0e",surf:ge})}t.add(new e.CylinderGeometry(.5,.5,.16,14),{p:[2.25,43.2,0],r:[0,0,Math.PI/2],c:"#d9b25a",surf:u}),t.add(new e.CylinderGeometry(.07,.07,.7,6),{p:[1.95,43.2,0],r:[0,0,Math.PI/2],c:D,surf:u});for(let s=0;s<3;s++){const n=s*ve/3+.5;b(t,a(n,2.5,40),a(n,1.55,45.2),.12,.12,[0,1,0],A,u),b(t,a(n,1,31),a(n,5.2,20.6),.3,.3,[0,1,0],D,F)}t.add(new e.TorusGeometry(1.62,.09,5,20).rotateX(Math.PI/2),{p:[0,45.2,0],c:A,surf:u});{const s=[[.01,-1.3],[.75,-1.3],[.8,-1.12],[.5,-1],[.55,-.82],[1.25,-.5],[1.58,.02],[1.66,.1],[1.58,.18],[1.3,.6],[.78,.86],[.86,.94],[.8,1.04],[.4,1.06],[.4,1.3],[.52,1.32],[.52,1.52],[.3,1.6],[.01,1.62]].map(n=>new e.Vector2(n[0],n[1]));t.add(new e.LatheGeometry(s,20),{p:[3.6,39.5,.6],c:"#b0883a",surf:u,grad:[38.2,41.1,.55,1.2]}),t.add(new e.TorusGeometry(1.6,.07,5,18).rotateX(Math.PI/2),{p:[3.6,39.6,.6],c:"#8a6a34",surf:u}),t.add(new e.CylinderGeometry(.1,.1,.9,6),{p:[4.9,39.5,.6],r:[0,0,1.2],c:"#d9b25a",surf:u})}b(t,[3.2,39.6,.6],[1.2,41.4,.2],.16,.16,[0,1,0],A,u),t.add(new e.CylinderGeometry(1.36,1.24,.7,18,1,!0),{p:[0,56.75,0],c:"#b58c3e",surf:u});for(const s of[56.4,57.1])t.add(new e.TorusGeometry(1.36,.1,5,18).rotateX(Math.PI/2),{p:[0,s,0],c:"#d9b25a",surf:u});for(let s=0;s<3;s++){const n=s*ve/3+.5;b(t,a(n,1.62,45.2),a(n,2.25,48.2),.11,.11,[0,1,0],A,u),b(t,a(n,2.25,48.2),a(n,1.42,56.5),.11,.11,[0,1,0],A,u)}await i.yield();const f=.62,y=a(f,17.2,0);t.add(new e.CylinderGeometry(1.2,1.5,3.2,10),{p:[y[0],6.6,y[2]],c:U,surf:L}),t.add(new e.CylinderGeometry(.2,.2,9.2,8),{p:[y[0],12.6,y[2]],c:"#9aa0a4",surf:O(0,.8,.9)}),b(t,[y[0],16.9,y[2]],a(f,15.2,16.9),.5,.5,[0,1,0],U,L);const d=-.56,o=a(d,22.4,0);b(t,a(d,15.2,17.2),a(d,23.4,17.2),.7,.9,[0,1,0],U,L),b(t,a(d,15.2,12.5),a(d,21.6,16.9),.5,.6,[0,1,0],U,L),b(t,a(d,15.3,16.2),a(d,21.3,16.2),.2,.2,[0,1,0],"#6a6f72",O(ce.BELT,.5,.8,1)),b(t,[o[0],16.2,o[2]],[o[0],-2,o[2]],.24,.24,[1,0,0],"#6a6f72",O(ce.BELT,.5,.8,0));for(let s=0;s<4;s++){const n=s*Math.PI/2+d,P=Math.cos(n),ne=Math.sin(n);t.add(new e.BoxGeometry(9.6,2.6,1.1),{p:[o[0]+ne*4.3,1.3,o[2]+P*4.3],r:[0,n,0],c:"#3a3c3b",surf:O(ce.STONE,.1)})}t.add(new e.BoxGeometry(7.6,.2,7.6),{p:[o[0],.5,o[2]],r:[0,d,0],c:"#050505",surf:ge}),await i.yield(),C.add(new e.Mesh(t.build(),K)),await i.yield();const G=qe(),I=[],c=[[-2.6,13.6,3.4,.5],[1.6,10.9,1.6,-1.06],[3,14.2,2,.85],[.4,15.6,1.1,-1.55],[-.4,8.7,1.5,1.13],[o[0],17,1.3,.55,1],[y[0],8.6,1,2.4,2]],x=new e.InstancedMesh(G,oe,c.length),g=new e.Object3D;c.forEach(([s,n,P,ne,be],k)=>{be===1?(g.position.set(o[0],n,o[2]),g.rotation.set(0,d,Math.PI/2),g.scale.set(P,3.4,P)):be===2?(g.position.set(s,n,y[2]),g.rotation.set(0,0,0),g.scale.set(P,2.2,P)):(g.position.set(s,n,V-1.6-k*.55),g.rotation.set(Math.PI/2,0,0),g.scale.set(P,2.6,P)),g.updateMatrix(),x.setMatrixAt(k,g.matrix),I.push(ne,k*1.3)}),G.setAttribute("aSpin",new e.InstancedBufferAttribute(new Float32Array(I),2)),x.computeBoundingSphere(),C.add(x);const ee=he.makeBuilder();ee.add(new e.CylinderGeometry(.62,.74,1.5,12),{c:ue,surf:F}),ee.add(new e.CylinderGeometry(.16,.16,2.3,6),{c:U,surf:L});for(let s=0;s<4;s++)ee.add(new e.BoxGeometry(.2,1.52,.2),{p:[Math.cos(s*1.571)*.6,0,Math.sin(s*1.571)*.6],c:D,surf:F});const pe=ee.build(),q=new e.InstancedMesh(pe,oe,24),j=[];for(let s=0;s<24;s++){const n=s*B+.1;g.position.set(...a(n,21.3,19.72)),g.rotation.set(Math.PI/2,0,0),g.rotation.order="YXZ",g.rotation.y=n,g.scale.set(1,1,1),g.updateMatrix(),q.setMatrixAt(s,g.matrix),j.push(-2.1,s)}pe.setAttribute("aSpin",new e.InstancedBufferAttribute(new Float32Array(j),2)),q.computeBoundingSphere(),C.add(q)}await i.yield();const $=new e.ShaderMaterial({uniforms:m,transparent:!0,depthWrite:!1,side:e.DoubleSide,blending:e.AdditiveBlending,vertexShader:Y+"varying vec3 vW, vN; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:Y+me+`varying vec3 vW, vN; void main(){ vec3 V = normalize(cameraPosition - vW); vec3 n = normalize(vN); float f = 1.0 - abs(dot(n, V)); f = f * f;
      vec3 R = reflect(-V, n); float sk = smoothstep(0.3, 0.95, abs(R.y)) * (0.6 + 0.4 * lwNoise(vW * 0.7));
      float nearL = 1.0 - smoothstep(2.0, 6.0, length(vW.xz));
      vec3 c = uRimCol * f * 0.34 + uRoofCol * uTopGain * (0.03 + 0.1 * sk * (0.3 + f)) + uFlameCol * uFlameGain * 0.05 * f * nearL;
      // heat shimmer: the hot air climbing the chimney, wavering threads of warm light that rise and thin
      float ang = lwBearing(vW.xz), hy = vW.y * 0.5 - uTime * 2.4;
      float sh1 = lwNoise(vec3(ang * 2.2 + 0.7 * sin(hy * 0.9), hy, uTime * 0.35)), sh2 = lwNoise(vec3(ang * 5.0 - 3.0, hy * 1.7 + 4.0, uTime * 0.5));
      float shim = smoothstep(0.45, 0.8, sh1 * 0.65 + sh2 * 0.35) * smoothstep(49.5, 53.0, vW.y) * (1.0 - 0.6 * smoothstep(58.0, 66.5, vW.y));
      c = c * (0.75 - 0.25 * smoothstep(56.0, 60.0, vW.y)) + (uFlameCol * 0.42 + vec3(0.05, 0.07, 0.08)) * uFlameGain * shim * nearL * (0.5 + 0.5 * (1.0 - f));
      gl_FragColor = vec4(c * exp(-distance(vW, cameraPosition) * uFogDen), 1.0); }`});{const t=new e.Mesh(new e.PlaneGeometry(8.7,10.9),$);t.position.set(0,12.2,V+.2),t.renderOrder=3,C.add(t);const r=[[1.5,44.4],[1.72,45.6],[1.95,47.4],[1.78,49.6],[1.3,51.4],[1.18,53.4],[1.2,56.4],[1.34,57.1],[1.42,61],[1.62,64.6],[1.75,66.6]].map(f=>new e.Vector2(f[0],f[1])),l=new e.Mesh(new e.LatheGeometry(r,20),$);l.renderOrder=5,C.add(l)}const Z=new e.Group;{const t=he.makeBuilder();for(const l of[-1,1])b(t,[0,7.4,0],[l*2.5,4.2,0],.22,.3,[0,0,1],"#9aa0a4",O(0,.8,.9)),b(t,[l*2.5,4.2,0],[l*.5,1.9,0],.16,.24,[0,0,1],"#9aa0a4",O(0,.8,.9)),t.add(new e.SphereGeometry(1.25,14,10),{p:[l*2.6,4.1,0],s:[1,1.12,1],c:"#b88a3c",surf:u}),t.add(new e.TorusGeometry(1.26,.09,5,16),{p:[l*2.6,4.1,0],r:[Math.PI/2,0,0],c:Fe,surf:L});t.add(new e.CylinderGeometry(.55,.55,.8,10),{p:[0,1.9,0],c:A,surf:u}),t.add(new e.SphereGeometry(.6,10,8),{p:[0,7.7,0],c:A,surf:u}),Z.add(new e.Mesh(t.build(),Q));const r=a(.62,17.2,0);Z.position.set(r[0],9.2,r[2]),C.add(Z)}const H=new e.Group;{const t=he.makeBuilder(),r=[[.01,0],[2.1,0],[2.3,.5],[2.3,4.4],[1.9,5],[.9,5.3],[.5,6.2],[.01,6.3]].map(f=>new e.Vector2(f[0],f[1]));t.add(new e.LatheGeometry(r,16),{c:"#2b2e30",surf:L,grad:[0,6,.75,1.1]});for(const f of[1.2,2.6,4])t.add(new e.TorusGeometry(2.32,.1,5,20).rotateX(Math.PI/2),{p:[0,f,0],c:"#4a4e50",surf:L});t.add(new e.TorusGeometry(.6,.14,6,12),{p:[0,6.6,0],c:"#6a6f72",surf:O(0,.6,.8)}),H.add(new e.Mesh(t.build(),Q));const l=a(-.56,22.4,0);H.position.set(l[0],9,l[2]),C.add(H)}const v=t=>{H.position.y=10.5-18*Math.max(0,Math.min(1,t))};await i.yield();const M=new e.Mesh(new e.PlaneGeometry(1,1),new e.ShaderMaterial({uniforms:m,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,vertexShader:Y+`varying vec2 vUv; void main(){ vUv = uv; vec3 c = vec3(0.0, 48.6, 0.0); vec2 t = cameraPosition.xz; float l = length(t); t = l > 1e-3 ? t / l : vec2(0.0, 1.0);
      vec3 p = c + vec3(t.y, 0.0, -t.x) * position.x * 11.0 + vec3(0.0, 1.0, 0.0) * position.y * 13.0; gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0); }`,fragmentShader:Y+me+`varying vec2 vUv; void main(){ vec2 p = (vUv - 0.5) * vec2(11.0, 13.0); p.y += 4.0; float body = 0.0;
      for (int i = 0; i < 4; i++) { float fi = float(i); float x0 = (fi - 1.5) * 0.52; float h = 4.2 + 0.9 * sin(uTime * (7.0 + fi * 1.7) + fi * 2.1) * (0.5 + 0.5 * sin(uTime * 2.3 + fi)) + 0.5 * sin(fi * 1.9);
        float y = clamp(p.y / h, 0.0, 1.0); float lean = 0.28 * y * y * sin(uTime * 5.0 + fi * 1.3 + p.y);
        float w = 0.62 * sqrt(y) * (1.0 - y) * 2.1 + 0.03; float d = abs(p.x - x0 * (1.0 - 0.6 * y) - lean) / w;
        body = max(body, (1.0 - smoothstep(0.3, 1.0, d)) * (0.55 + 0.45 * smoothstep(0.0, 0.6, d)) * step(0.0, p.y) * (1.0 - smoothstep(0.8, 1.0, p.y / h))); }
      float r = length(p - vec2(0.0, 2.0)); float halo = 0.5 / (1.0 + r * r * 0.5) * (1.0 - smoothstep(2.5, 6.5, r)) * (0.9 + 0.1 * sin(uTime * 11.0));
      vec3 c = mix(vec3(1.0, 0.62, 0.22), uFlameCol, smoothstep(0.2, 2.6, p.y)) * body * (1.25 + 1.0 * smoothstep(0.0, 2.5, p.y)) + uFlameCol * halo * 0.3 + vec3(0.2, 0.32, 0.6) * body * (1.0 - smoothstep(0.0, 0.9, p.y)) * 1.2;
      gl_FragColor = vec4(c * uFlameGain * exp(-distance(vec3(0.0, 47.0, 0.0), cameraPosition) * uFogDen * 0.6), 1.0); }`}));M.frustumCulled=!1,M.renderOrder=4,C.add(M);const R=t=>{w.rotation.y=t,m.uLensAng.value=t};return{object:C,radius:30,height:98,center:new e.Vector3(0,47,0),light:z,ground:!0,groundY:0,anchors:{axis:new e.Vector3(0,0,0),flame:new e.Vector3(0,47,0),bayBearing:B,leafBearing:(T+1)*B,drumRadius:Ge.RD,hollowRadius:Ge.RIN,flyRadius:12,governor:Z.position.clone().setY(13),weight:new e.Vector3(H.position.x,8,H.position.z)},setAngle:R,setLeaves:X,setWeight:v,update(t,r){Z.rotation.y=r*2.6,h&&(m.uTime.value=r,R(-r*.0654),X(.5-.5*Math.cos(r*.35)),v(r%40/40))},dispose(){h&&z.dispose()}}}export{Ge as LENS,ce as SID,Ke as buildHero,fe as lensRadius,Ne as makeLensLight,ke as panelGeometry,O as sf,b as strut,qe as wheelGeometry};
