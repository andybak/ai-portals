import*as t from"three";import{clamp as Se,lerp as _,smoothstep as G,makePath as Da}from"../kit/core.js";import{makeSky as Ea,makeLightRig as Pa,skyDirection as Ze}from"../kit/sky.js";import*as Te from"../kit/fx.js";import{buildHero as Ba}from"../parts/dawn-tracks-contrail.js";const Ha=["#0B1522","#2C3E5E","#131A3F","#C9809A","#FF7F57","#FFC98A","#6FE3C8"],he=Math.PI/180,Xe=Math.PI*2,me=[[-150,-128,0],[-150,-128,98],[-148,-167,186],[-141,-169,236],[-128,-146,330],[-118,-126,420],[-60,-78,630],[-20,-112,690],[0,-135,750],[18,-108,810],[0,-85,870],[-20,-112,930],[-5,-140,975],[0,-147,1003],[0,-92,1068],[0,-58,1150],[0,-46,1230],[0,-44,1330],[-4,-42,1440],[0,-40,1560],[2,-35.5,1660],[0,-14,1750],[14,12,1975],[12,8,2020],[8,12,2090],[0,8,2240],[0,30.2,2293],[0,52.4,2346],[0,75,2400]],Ra=[[0,40],[90,38],[250,34],[430,40],[640,18],[985,18],[1010,20],[1120,34],[1300,44],[1450,50],[1700,52],[1800,44],[1960,28],[2085,28],[2170,35],[2400,35]],ut=68,Va=-3e3,a=(s,y=1)=>new t.Color(s).multiplyScalar(y),La={dawn:{sky:{zenith:"#0e1436",mid:"#1b2a63",horizon:"#33507f",ground:"#1a2740",horizonPow:3.2,scatterColor:"#ff7a48",scatter:.3,scatterPow:4.5,scatterHigh:.03,scatterFall:7,stars:.4,starDensity:.5},ember:a("#FF5A30",1),gold:a("#FFC98A",.78),top:a("#6FE3C8",.6),slate:a("#2C3E5E",.5),rose:a("#C9809A",.62),glow:1,belt:1,sea:a("#22315a",1),wall:a("#3c4c70",.62),wallHi:a("#7888ae",.62),wallRose:a("#C9809A",.55),haze:a("#2C3E5E",.7),hazeSun:a("#6e3f50",.62),term:a("#FF9A84",.62),fog:a("#26305c",.8),fogDensity:21e-5,trackAway:a("#27356a",.75),trackSun:a("#a8584e",.75),veil:1},golden:{sky:{zenith:"#150f3a",mid:"#2c1f66",horizon:"#4a3272",ground:"#1c1836",horizonPow:3.2,scatterColor:"#ff5a48",scatter:.4,scatterPow:4.5,scatterHigh:.03,scatterFall:7,stars:.3,starDensity:.45},ember:a("#E2452C",.95),gold:a("#FF9C70",.72),top:a("#9A5AD8",.75),slate:a("#2a2850",.5),rose:a("#B86AA8",.6),glow:1,belt:.9,sea:a("#2a2452",1),wall:a("#463e6c",.78),wallHi:a("#8676aa",.78),wallRose:a("#c070a8",.55),haze:a("#3A3358",.7),hazeSun:a("#70345a",.62),term:a("#FF7A9A",.62),fog:a("#2a2058",.8),fogDensity:21e-5,trackAway:a("#2c2466",.75),trackSun:a("#8a3a5a",.75),veil:1},night:{sky:{zenith:"#040818",mid:"#0a1438",horizon:"#18274f",ground:"#0a1022",horizonPow:3,scatterColor:"#3a5a9a",scatter:.2,scatterPow:3,scatterHigh:.02,scatterFall:6,stars:1,starDensity:.9,milkyWay:.3},ember:a("#24407a",.5),gold:a("#3a5a9a",.4),top:a("#3fae9a",.18),slate:a("#0c1428",.5),rose:a("#2a3a6a",.3),glow:.7,belt:.35,sea:a("#16223e",1),wall:a("#4e5e86",.7),wallHi:a("#b4c0de",.66),wallRose:a("#aab8e0",.6),haze:a("#131d3a",.8),hazeSun:a("#1a2a52",.8),term:a("#000000",0),fog:a("#0d1736",.9),fogDensity:19e-5,trackAway:a("#16224a",.8),trackSun:a("#22346a",.8),veil:.6}},Na=[{name:"ember",arch:.72,glow:1.08,belt:.8,emberMix:["#FF4422",.5],trail:null,stars:1.25},{name:"gold",arch:1.28,glow:1,belt:1,emberMix:["#FF8A3A",.45],trail:["#FF9A52",.25],stars:.85},{name:"rose",arch:1,glow:.92,belt:1.55,emberMix:["#FF4A6E",.55],trail:["#FF6A86",.2],stars:1}],Ga={dawn:{lit:a("#FF6248",.35),sun:a("#FFA468",.5),amb:1,el:6.5,warm:1,bodyTo:a("#FF9A60",.9),rimTo:a("#FFE2A4",1.65),emberTo:a("#FF9438",1.05),sunTo:a("#FFBC7C",1.6)},golden:{lit:a("#E84A7A",.32),sun:a("#FF7A9A",.5),amb:1,el:6.5,warm:.4,bodyTo:a("#F0706A",.85),rimTo:a("#FFA0C0",1.6),emberTo:a("#F2603A",1),sunTo:a("#FF7A5A",1.4)},night:{lit:a("#AEBCE0",.26),sun:a("#000000",0),amb:.6,el:42,warm:0,bodyTo:a("#C9D4EE",.8),rimTo:a("#EAF0FF",1.45),emberTo:a("#24407a",.5),sunTo:a("#9FB4E8",.75)}},Wa=[[.27,.8,.6,900],[.24,.42,.4,850],[.05,.62,1,900]],Xt=10,ke=256,Qt=`
varying vec3 vDir;
void main() {
  vDir = position;
  vec4 p = projectionMatrix * vec4(mat3(viewMatrix) * position, 1.0);
  if (abs(p.w) < 1e-4) p.w = 1e-4;
  gl_Position = p.xyww;
}`,_a=`
uniform vec3 uSunAz, uEmber, uGold, uTop, uSlate, uRose, uLimbDir, uVenusDir;
uniform float uGlow, uArch, uBelt, uLimb, uVenus, uTime, uGreen, uTopW;
varying vec3 vDir;
void main() {
  vec3 d = normalize(vDir);
  float e = asin(clamp(d.y, -1.0, 1.0)) * 57.29578;
  vec2 h = d.xz / max(length(d.xz), 1e-4);
  float ca = dot(h, uSunAz.xz);
  float ws = smoothstep(-0.5, 1.0, ca); ws *= ws;
  float H = mix(4.0, 15.0, ws) * uArch;
  float x = (e + 3.7) / H;
  float xe = (x - 0.07) / 0.17, xg = (x - 0.36) / 0.2, xt = (x - 0.66 - 0.06 * uTopW) / (0.17 * uTopW);
  float ember = exp(-xe * xe), gold = exp(-xg * xg), top = exp(-xt * xt);
  float wa = smoothstep(-0.75, 0.85, ca);
  vec3 col = (uEmber * ember + uGold * gold * (0.35 + 0.65 * ws) + uTop * top * 0.5 * ws) * wa * uGlow;
  float a = clamp(ember * 0.9 + gold * 0.7 + top * 0.25, 0.0, 1.0) * wa * 0.85;
  // opposite the sun: the Earth's shadow, a slate band 6 degrees deep, and the rose belt above it to 15 degrees
  float anti = smoothstep(0.05, 0.9, -ca) * uBelt;
  float shadow = (1.0 - smoothstep(0.5, 4.5, e)) * anti;
  float belt = smoothstep(0.5, 5.0, e) * (1.0 - smoothstep(6.5, 16.0, e)) * anti;
  float a2 = clamp(shadow * 0.85 + belt * 0.62, 0.0, 1.0);
  col = col * (1.0 - a2) + uSlate * shadow * 0.85 + uRose * belt * 0.62;
  a = a + a2 * (1.0 - a);
  // the sun's upper limb (rare): a disc cut by the cloud horizon, green on its upper rim
  float sd = acos(clamp(dot(d, uLimbDir), -1.0, 1.0)) * 57.29578;
  float disc = 1.0 - smoothstep(0.42, 0.56, sd);
  float above = smoothstep(-3.62, -3.48, e);
  float le = asin(clamp(uLimbDir.y, -1.0, 1.0)) * 57.29578;
  float rim = smoothstep(0.22, 0.46, e - le) * disc;
  vec3 sun = mix(vec3(7.0, 3.0, 1.1), vec3(1.2, 6.0, 2.2), rim * uGreen) * disc + vec3(1.0, 0.4, 0.17) * exp(-sd * 0.5) + vec3(0.26, 0.09, 0.035) * exp(-sd * 0.1);
  col += sun * above * uLimb;
  // Venus
  float vd = acos(clamp(dot(d, uVenusDir), -1.0, 1.0)) * 57.29578;
  col += vec3(1.0, 0.95, 0.85) * uVenus * (3.0 * (1.0 - smoothstep(0.1, 0.22, vd)) + 0.5 * exp(-vd * 1.6)) * (0.92 + 0.08 * sin(uTime * 3.1));
  gl_FragColor = vec4(col, a);
}`,qa=`
uniform sampler2D uNoise, uDeck;
uniform float uTime, uTerm, uCell, uPix, uLitK;
uniform vec2 uOff, uRollDir;
uniform vec4 uShape;                       // gap level, cross-roll stretch (1 round heads, 0.4 long rolls), tower amount, relief (m)
uniform vec3 uSunAz, uKey, uSea, uWall, uWallHi, uWallRose, uHaze, uHazeSun, uTermCol, uGlowCol;
varying vec3 vDir;
const float DG = ${Xt}.0, DS = ${ke}.0, TWK = 0.22;
// the dome texture at p (cell units): r heads, g turrets, b the heads blurred. The texel fraction is eased, so the field is smooth
vec4 deckT(vec2 p, float lod) {
  vec2 q = vec2(p.x * uRollDir.x + p.y * uRollDir.y, (p.y * uRollDir.x - p.x * uRollDir.y) * uShape.y) * (DS / DG) + 0.5;
  vec2 i = floor(q), f = q - i;
  f = f * f * (3.0 - 2.0 * f);
  return textureLod(uDeck, (i + f - 0.5) / DS, lod);
}
// height of the cloud tops, 0..1 of the relief (turrets stand up to TWK above that). cov: the slow cover field
float deckH(vec4 k, float cov) {
  float s = k.r + cov - uShape.x;
  return min(max(s, 0.0) / (1.3 - uShape.x), 1.0) + k.g * TWK * uShape.z * smoothstep(0.0, 0.25, s);
}
// the colour of the deck where the ray is at distance t
vec4 deckShade(float t, vec3 d, float cov, float lod, float fp, float Ht, vec3 hazeC) {
  vec2 P = cameraPosition.xz + d.xz * t;
  vec2 p = P / uCell + uOff + uTime * vec2(0.006, 0.0022);
  vec4 k0 = deckT(p, lod);
  float h0 = deckH(k0, cov);
  float crease = clamp((k0.r - k0.b) * 6.0 + 0.5, 0.0, 1.0);          // 0 in the folds between bulges, 1 on their tops
  // light: the slope toward the light and five look-ups along it (long soft shadows)
  float cosE = max(length(uKey.xz), 0.05);
  vec2 l = uKey.xz / cosE;
  float tanE = uKey.y / cosE, sl = 0.0, occ = 0.0, s = 110.0;
  for (int k = 0; k < 5; k++) {
    float hk = deckH(deckT(p + l * (s / uCell), lod + 0.4 * float(k)), cov);
    float rise = (hk - h0) * Ht;
    if (k == 0) sl = rise / s;
    occ = max(occ, (rise - s * tanE) / (30.0 + 0.22 * s));
    s *= 2.05;
  }
  float shadow = 1.0 - clamp(occ, 0.0, 1.0);
  float lodN = log2(max(fp * 256.0, 1e-3));
  float n3 = textureLod(uNoise, p * 1.7 + uTime * vec2(-0.004, 0.003), lodN + 1.6).g;
  float low = textureLod(uNoise, p * 0.57 + 0.37, max(lodN - 0.8, 0.0)).g;
  // smaller bulges in the light: a smooth field (lumps 100-250 m across) whose slope toward the light tilts it a little. (Folded
  // into billows with creases, or any stronger, it drew dark veins and blotches over every head: brain, not cloud.)
  float bl = max(lodN + 1.8, 2.5), be = 60.0 / uCell;
  float b0 = textureLod(uNoise, p * 1.7 + vec2(0.5, 0.2), bl).r;
  float b1 = textureLod(uNoise, (p + l * be) * 1.7 + vec2(0.5, 0.2), bl).r;
  float slb = sl + (b1 - b0) * 0.67 * smoothstep(0.02, 0.2, h0);
  float lam = clamp(((uKey.y - slb * cosE) * inversesqrt(1.0 + slb * slb) + 0.25) / 1.25, 0.0, 1.0);
  float cl = smoothstep(0.0, 0.06, h0);
  vec3 amb = mix(uWall, uWallHi, smoothstep(0.05, 0.6, h0)) * (0.8 + 0.4 * n3) * (0.72 + 0.56 * crease) * (0.86 + 0.28 * b0);
  amb = mix(amb, uWallRose * 0.7, clamp(sl * 0.6, 0.0, 0.22));    // flanks turned from the glow face the Belt of Venus
  amb *= 0.4 + 0.6 * shadow;
  float along = dot(P - cameraPosition.xz, uSunAz.xz);
  float direct = smoothstep(0.0, 1.0, (along - uTerm) / 9000.0 + h0 * 1.1 - 0.75);
  vec3 lightC = uGlowCol * uLitK + uTermCol * direct;
  vec3 cloudC = amb + lightC * lam * shadow * (0.78 + 0.44 * n3) * (0.8 + 0.4 * crease);
  // the gaps: sea far below, a thin lower layer drifting over it, darker under the clouds' own shadow
  vec3 seaC = uSea * (0.5 + 0.55 * low) * (0.7 + 0.3 * shadow);
  vec3 col = mix(seaC, cloudC, cl);
  // far off the gaps close up behind the heads in front of them: one pale layer, lighter toward the glow
  float farK = smoothstep(-0.3, 2.7, lod);
  col = mix(col, mix(uWall, uWallHi, 0.42) * (0.8 + 0.2 * shadow) + lightC * 0.17, farK * 0.85);
  col = mix(col, hazeC, 1.0 - exp(-t / 13500.0));
  return vec4(col, 1.0 - smoothstep(46000.0, 94000.0, t));
}
void main() {
  vec3 d = normalize(vDir);
  const float R = 1.6e6;
  float hgt = max(cameraPosition.y - (${Va}.0), 1600.0);
  float c = (1.0 - d.y * d.y) / (2.0 * R);
  float discB = d.y * d.y - 4.0 * c * hgt;
  vec2 hd = d.xz / max(length(d.xz), 1e-4);
  float ca = dot(hd, uSunAz.xz);
  float ws = smoothstep(-0.2, 1.0, ca); ws *= ws;
  vec3 hazeC = mix(uHaze, uHazeSun, ws);
  if (d.y >= 0.0 || discB <= 0.0) {
    // above the cloud horizon: cumulus towers 60-90 km off, standing through the deck. Soft silhouettes, bases lost in the haze;
    // the ones toward the glow are dark against it with lit rims, the ones opposite take the rose light on their faces
    float eh = asin(clamp(d.y, -1.0, 1.0)) + sqrt(2.0 * hgt / R);
    float az = atan(d.x, -d.z + 1e-5);
    float grp = textureLod(uNoise, vec2(az * 0.52 + uOff.x * 0.13, 0.21), 0.0).r;
    float tur = textureLod(uNoise, vec2(az * 1.5 + uOff.y * 0.11, 0.63), 1.0).g;
    float edge = textureLod(uNoise, vec2(az * 4.0, eh * 30.0 + uTime * 0.0006), 0.5).b;
    float m = smoothstep(0.5, 0.8, grp);
    // (broad rounded heads, wider than tall, soft: as thin dark spikes they read as trees standing on the horizon)
    float top = uShape.z * 0.06 * sqrt(m) * (0.4 + 0.6 * smoothstep(0.25, 0.8, tur)) + (edge - 0.5) * 0.009 * m;
    float a = (1.0 - smoothstep(-2.5 * uPix, 2.5 * uPix, eh - top)) * smoothstep(-0.001, 0.008, eh) * step(0.001, m);
    if (a <= 0.003) discard;
    float rimK = smoothstep(top - 0.016, top, eh);
    float direct = smoothstep(0.0, 1.0, (70000.0 * ca - uTerm) / 20000.0);
    vec3 lightC = uGlowCol * uLitK + uTermCol * direct;
    vec3 col = mix(hazeC, uWall, 0.4) * (0.75 + 0.25 * edge) + lightC * (rimK * (0.5 + 0.9 * ws) + (0.5 - 0.5 * ca) * 0.4 * edge);
    gl_FragColor = vec4(col, a * 0.7);
    return;
  }
  float sq = sqrt(discB);
  float tB = 2.0 * hgt / (-d.y + sq);
  // relief settles toward the horizon (a march cannot carry it there, and the towers stand for it)
  float Ht = uShape.w * mix(1.0, 0.22, smoothstep(9000.0, 42000.0, tB)), top = Ht * (1.0 + TWK * uShape.z);
  float tT = 2.0 * (hgt - top) / (-d.y + sqrt(max(d.y * d.y - 4.0 * c * (hgt - top), 0.0)));
  vec2 drift = uOff + uTime * vec2(0.006, 0.0022);
  vec2 pB = (cameraPosition.xz + d.xz * tB) / uCell + drift;
  // the width of a pixel on the deck, in cells, and the mip level that goes with it
  float fp = tB * uPix / uCell * sqrt(0.5 / max(-d.y, 0.05));
  float lod = max(0.0, log2(max(fp * DS / DG, 1e-3)));
  // (the cover field drifts a little faster than the heads, so they swell and sink slowly)
  float cov = (textureLod(uNoise, pB * 0.037 + vec2(0.23 + uTime * 0.0004, 0.23), 0.0).g - 0.5) * 0.46 + (textureLod(uNoise, pB * 0.011 + 0.61, 0.0).r - 0.5) * 0.3;
  // THE MARCH. Each step is the ray's clearance over the cloud divided by the steepest the cloud can rise toward it (never
  // less than a pixel and a half of ground), so it creeps over a head and strides over a gap; the last steps are stretched
  // to reach the foot of the slab. gBest: the nearest the ray came to a head it then cleared, in pixels; tg: where.
  float K = 1.4 * Ht / uCell, t = tT, tp = tT, lo = tB, hi = tB, gPrev = 1e9, tPrev = tT, gBest = 1e9, tg = tT;
  bool found = false;
  for (int i = 0; i < STEPS; i++) {
    float hr = hgt + d.y * t + c * t * t;
    float f = hr - deckH(deckT((cameraPosition.xz + d.xz * t) / uCell + drift, lod), cov) * Ht;
    if (!found) {
      if (f < 0.0) { found = true; lo = tp; hi = t; }
      else {
        float gi = f / (t * uPix);
        if (gi > gPrev && gPrev < gBest) { gBest = gPrev; tg = tPrev; }
        gPrev = gi; tPrev = t; tp = t;
        float st = max(f / (-d.y + K), t * uPix * 1.5);
        st = max(st, (tB - t) / float(STEPS - i) * smoothstep(0.5, 0.9, float(i) / float(STEPS)));
        t = min(t + st, tB);
      }
    }
  }
  for (int i = 0; i < 5; i++) {
    float tm = 0.5 * (lo + hi);
    float hr = hgt + d.y * tm + c * tm * tm;
    if (hr < deckH(deckT((cameraPosition.xz + d.xz * tm) / uCell + drift, lod), cov) * Ht) hi = tm; else lo = tm;
  }
  float th = found ? hi : tB;
  vec4 col = deckShade(th, d, cov, lod, fp, Ht, hazeC);
  // the feather: a head the ray only just cleared, well in front of what it hit
  float w = (1.0 - smoothstep(0.0, 1.6, gBest)) * smoothstep(0.0, 3.0, (th - tg) / (tg * uPix));
  if (w > 0.004) col = mix(col, deckShade(tg, d, cov, lod, fp, Ht, hazeC), w);
  gl_FragColor = col;
}`,Ua=`
varying vec3 vWp;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWp = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,Ia=`
uniform sampler2D uNoise;
uniform float uTime, uCover;
uniform vec3 uSunDir, uBody, uRim, uShade, uHazeC;
varying vec3 vWp;
void main() {
  vec3 V = vWp - cameraPosition; float dist = length(V); V /= max(dist, 1e-3);
  vec2 p = vWp.xz;
  vec2 q = vec2(p.x * 0.34 + p.y * 0.94, p.x * 0.94 - p.y * 0.34);
  float ptc = texture2D(uNoise, p * 0.00043 + vec2(uTime * 0.001, 0.0)).g;
  // CIRRUS, NOT SPEED LINES: the fibres are bent (hooked mares' tails: each strand swings 30 m aside every 500-900 m, by a
  // different amount from tuft to tuft), they are 6 and 8 times as long as wide (at 12 and 14 they were ruled straight lines,
  // and from under the veil every one of them ran to the same vanishing point), and they come in tufts 150-300 m across with
  // clear sky between. All of it is laid in the air's own coordinates and drifts slowly.
  // (the bend is 31 m, half what it was, and where the view only grazes the veil (gz) the fibres give way to the soft tufts:
  // hooked 62 m and seen along the sheet, the strands were foreshortened into a marbled swirl, oil on water)
  q.x += 31.0 * sin(q.y * 0.0088 + ptc * 9.0) + 12.0 * sin(q.y * 0.023 - q.x * 0.004 + 1.7);
  float gz = smoothstep(0.07, 0.32, abs(V.y));
  float f1 = texture2D(uNoise, vec2(q.x * 0.0041, q.y * 0.00068 + uTime * 0.0017)).b;
  float f2 = texture2D(uNoise, vec2(q.x * 0.0127 + uTime * 0.0008, q.y * 0.0016 + 0.3 + uTime * 0.0034)).r;
  float tuft = texture2D(uNoise, vec2(q.x * 0.0031 + 0.17, q.y * 0.0019 - uTime * 0.0006)).r;
  float fib = mix(0.56, f1 * 0.6 + f2 * 0.4, gz);
  float a = smoothstep(0.66 - uCover * 0.22, 0.98 - uCover * 0.2, ptc * 0.72 + fib * 0.5) * (0.3 + 0.7 * smoothstep(0.3, 0.72, fib)) * (0.25 + 0.75 * smoothstep(0.34, 0.62, tuft));
  a *= (1.0 - smoothstep(-340.0, -90.0, p.x)) * smoothstep(-2700.0, -1900.0, p.x) * (1.0 - smoothstep(250.0, 800.0, p.y)) * smoothstep(-1750.0, -1150.0, p.y);
  // the shadow of the trail, thrown upward by a sun that is still below the horizon
  float sx = -400.0 + 34.0 * sin(p.y * 0.0031 + uTime * 0.06) + 15.0 * sin(p.y * 0.011 - uTime * 0.09);
  float sq = (p.x - sx) / 46.0;
  float sh = 1.0 - 0.8 * exp(-sq * sq);
  float fwd = max(dot(V, uSunDir), 0.0);
  float lit = clamp((0.4 + 0.45 * fib + 0.7 * fwd * fwd) * sh, 0.0, 1.0);
  vec3 col = mix(uShade * 0.5, uBody * 0.8, lit) + uRim * fwd * fwd * fwd * fwd * 0.3 * sh;
  float hz = 1.0 - exp(-dist / 5200.0);
  col = mix(col, uHazeC, hz * 0.75);
  a *= 0.42 * (1.0 - 0.75 * smoothstep(2200.0, 5200.0, dist)) * smoothstep(40.0, 120.0, dist);
  gl_FragColor = vec4(col * a, a);
}`,Oa=`
attribute vec4 aA; attribute vec4 aB; attribute vec4 aC;
uniform float uTime, uHeavyZ, uHeavyZ2, uPix;
varying vec4 vT; varying vec3 vWp; varying vec3 vS; varying float vK;
void main() {
  float t = aA.x, tt = t * t;
  float head = aB.z - aC.x * uTime;
  float tail = head + aB.w;
  if (aA.w > 0.5) { head = aA.w > 1.5 ? uHeavyZ2 : uHeavyZ; tail = aB.z; }
  float z = mix(head, tail, tt);
  float age = clamp(aC.w + abs(z - head) / 26000.0, 0.0, 1.0);
  float x = aB.x + sin(z * 0.00037 + aA.z * 40.0) * 110.0 * age + sin(z * 0.0021 + aA.z * 17.0) * 14.0 * age;
  float y = aB.y - 70.0 * age * age;
  // a young staged line wanders slowly and irregularly, more with age (two wavelengths that never repeat together, the longer one
  // itself bent; as one sine of 600 m it was a regular ripple)
  if (aA.w > 0.5) x += (sin(z * 0.0043 + 1.9 * sin(z * 0.0011 + aA.w) + uTime * 0.07) * 3.2 + sin(z * 0.0117 + 2.9 - uTime * 0.11) * 1.3) * smoothstep(0.01, 0.08, age) * (1.0 - smoothstep(0.12, 0.3, age));   // (straight for its first 300 m, wandering by 2 km)
  vec3 c = vec3(x, y, z);
  vec3 toC = c - cameraPosition;
  float dist = length(toC);
  vec3 side = cross(vec3(0.0, 0.0, 1.0), toC);
  float sl = length(side);
  side = sl > 1e-3 ? side / sl : vec3(1.0, 0.0, 0.0);
  float w = mix(aC.y, aC.z, sqrt(age)) * (0.25 + 0.75 * smoothstep(0.0, 0.05, t));
  float wd = max(w, dist * uPix);
  vec3 wp = c + side * aA.y * wd;
  vT = vec4(aA.y, age, w / wd, z);
  vS = vec3(aA.z, t, -aA.y * side.y); vK = aA.w;
  vWp = wp;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
}`,Ka=`
uniform sampler2D uNoise;
uniform vec3 uBody, uRim, uShade, uHazeAway, uHazeSun, uHazeDeck, uSunAz;
uniform float uGain;
uniform float uTime;
varying vec4 vT; varying vec3 vWp; varying vec3 vS; varying float vK;
void main() {
  float v = vT.x, age = vT.y, seed = vS.x, t = vS.y, low = vS.z;
  float n = texture2D(uNoise, vec2(vT.w * 0.00023 + seed + uTime * 0.0006, v * 0.21 + seed * 7.0)).r;
  float n2 = texture2D(uNoise, vec2(vT.w * 0.0011 - uTime * 0.0021, v * 0.5 + seed * 3.0 + uTime * 0.0012)).g;
  float av = abs(v) - 0.5 - (vK > 0.5 ? 0.2 * (n2 - 0.5) * smoothstep(0.01, 0.08, age) * (1.0 - smoothstep(0.08, 0.2, age)) : 0.0);   // the heavy's twin tubes already swinging, irregularly (noise, not a sine)
  float two = exp(-av * av / (vK > 1.5 ? 0.003 : 0.035));   // the crossing heavy's line passes 100 m from the lens: two hard thin cores, 18 m apart
  float one = (1.0 - v * v) * exp(-2.4 * v * v);
  one *= smoothstep(0.28, 0.78, n * 0.75 + n2 * 0.5 + 0.22 * (1.0 - age));
  float prof = mix(two * (0.7 + 0.6 * n2), one, vK > 0.5 ? smoothstep(0.1, 0.3, age) : smoothstep(0.012, 0.07, age));
  float a = prof * (1.0 - smoothstep(0.72, 1.0, t)) * smoothstep(0.0, 0.012, t) * mix(0.85, 0.42, age) * vT.z;
  vec3 V = vWp - cameraPosition; float dist = length(V); V /= max(dist, 1e-3);
  // seen from below a track shows its sunlit underside; from above only its shadowed top, coral on the low edge alone
  float up = smoothstep(-0.2, 0.2, V.y);
  vec3 col = mix(uShade, uBody, clamp(mix(0.12, 0.62, up) + 0.36 * low + 0.5 * (n - 0.5), 0.0, 1.0));
  float lw = max(low, 0.0);
  col = mix(col, uRim, lw * lw * lw * 0.35 * (0.4 + 0.6 * up));
  vec2 hd = V.xz / max(length(V.xz), 1e-4);
  float ws = smoothstep(-0.2, 1.0, dot(hd, uSunAz.xz)); ws *= ws;
  vec3 hazeC = mix(mix(uHazeAway, uHazeSun, ws), uHazeDeck, smoothstep(0.035, 0.11, -V.y));
  col = mix(col, hazeC, (1.0 - exp(-dist / 15000.0)) * 0.88);
  gl_FragColor = vec4(col * a * uGain, a);
}`,ja=`
attribute vec4 iA;
uniform float uTime, uPix;
varying vec3 vN; varying vec3 vWp;
void main() {
  vec3 c = vec3(iA.x, iA.y, iA.z - iA.w * uTime);
  float dist = length(c - cameraPosition);
  float sc = max(1.0, dist * uPix * 7.0 / 65.0);
  vec3 wp = c + position * sc;
  vN = normal; vWp = wp;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
}`,Ya=`
uniform vec3 uSunDir, uSunCol, uAmbUp, uAmbDn, uHazeAway, uHazeSun, uHazeDeck, uSunAz;
varying vec3 vN; varying vec3 vWp;
void main() {
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0));
  vec3 V = vWp - cameraPosition; float dist = length(V); V /= max(dist, 1e-3);
  if (dot(N, V) > 0.0) N = -N;
  float k = smoothstep(-0.35, 0.85, dot(N, uSunDir));
  vec3 col = 0.72 * (uSunCol * k + mix(uAmbDn, uAmbUp, 0.5 + 0.5 * N.y));
  vec2 hd = V.xz / max(length(V.xz), 1e-4);
  float ws = smoothstep(-0.2, 1.0, dot(hd, uSunAz.xz)); ws *= ws;
  vec3 hazeC = mix(mix(uHazeAway, uHazeSun, ws), uHazeDeck, smoothstep(0.035, 0.11, -V.y));
  col = mix(col, hazeC, (1.0 - exp(-dist / 15000.0)) * 0.8);
  gl_FragColor = vec4(col, 1.0);
}`,Za=`
attribute vec4 aA; attribute vec4 aL;
uniform float uTime, uPix;
uniform vec3 uGlint, uBeacon;
varying vec2 vQ; varying vec3 vC;
float blink(float x) { return smoothstep(0.0, 0.1, x) * (1.0 - smoothstep(0.1, 0.42, x)); }
void main() {
  vec3 c = vec3(aA.x, aA.y + (aL.z > 0.5 ? 4.0 : -1.0), aA.z - aA.w * uTime);
  vec4 mv = viewMatrix * vec4(c, 1.0);
  float dist = length(mv.xyz);
  float I = aL.z > 0.5 ? blink(fract(uTime + aL.w)) : 0.75 + 0.25 * sin(uTime * 1.7 + aL.w * 40.0);
  float size = max(aL.z > 0.5 ? 2.5 : 5.0, dist * uPix * (aL.z > 0.5 ? 3.2 : 2.6)) * (0.6 + 0.4 * I);
  mv.xy += aL.xy * size;
  vQ = aL.xy;
  vC = (aL.z > 0.5 ? uBeacon : uGlint) * I * exp(-dist / 30000.0);
  gl_Position = projectionMatrix * mv;
}`,Xa=`
varying vec2 vQ; varying vec3 vC;
void main() {
  float r2 = dot(vQ, vQ);
  float g = max(1.0 - r2, 0.0);
  gl_FragColor = vec4(vC * (g * g * g * 0.5 + exp(-r2 * 9.0)) * g, 1.0);
}`,Qa=`
attribute vec4 aA;
uniform float uTime, uHead, uPix, uLen;
varying vec4 vT; varying vec3 vWp; varying vec3 vSd;
void main() {
  float t = aA.x, d = uLen * t * t;
  float m = smoothstep(20.0, 340.0, d);
  float th = (aA.w < 0.5 ? 3.14159 : 0.0) + 6.6 * m;
  float rho = mix(4.75, 1.15, m);
  float air = uHead - d;
  float old = smoothstep(120.0, 1400.0, d);
  vec3 lp = vec3(aA.z * (16.25 + rho * cos(th)), -3.9 + rho * sin(th) * 0.5 - 0.0035 * d, 31.0 + d);
  lp.x += sin(air * 0.017 + aA.z * 1.3) * 5.0 * old;
  lp.y += sin(air * 0.023 + 2.0 + aA.z) * 3.0 * old;
  vec3 c = (modelMatrix * vec4(lp, 1.0)).xyz;
  vec3 ax = normalize((modelMatrix * vec4(0.0, 0.0, 1.0, 0.0)).xyz);
  vec3 toC = c - cameraPosition; float dist = length(toC);
  vec3 side = cross(ax, toC); float sl = length(side);
  side = sl > 1e-3 ? side / sl : vec3(0.0, 1.0, 0.0);
  float bead = 1.0 + 0.3 * sin(air * 0.19 + aA.w * 2.0 + aA.z) * sin(air * 0.047 + 1.0);
  float w = mix(0.8, 3.3, smoothstep(0.0, 700.0, d)) * bead * (0.3 + 0.7 * smoothstep(0.0, 16.0, d));
  float wd = max(w, dist * uPix * 1.2);
  vec3 wp = c + side * aA.y * wd;
  vT = vec4(aA.y, d, w / wd, air);
  vSd = side; vWp = wp;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
}`,$a=`
uniform sampler2D uNoise;
uniform vec3 uBody, uRim, uShade, uSunDir;
uniform float uTime, uGain, uLen;
varying vec4 vT; varying vec3 vWp; varying vec3 vSd;
void main() {
  float v = vT.x, d = vT.y, air = vT.w;
  vec3 V = cameraPosition - vWp; float dist = length(V); V /= max(dist, 1e-3);
  float age = smoothstep(0.0, 900.0, d);
  float n = texture2D(uNoise, vec2(air * 0.011, v * 0.16 + 0.3)).r;
  float n2 = texture2D(uNoise, vec2(air * 0.045 - uTime * 0.004, v * 0.4 + 0.7)).g;
  float fl = texture2D(uNoise, vec2(air * 0.05 - uTime * 0.8, 0.4)).b;
  float core = pow(max(1.0 - v * v, 0.0), 1.3);
  // young: a crisp bright core; older: it widens and puffs (the noise eats its edge into heads)
  float a = core * smoothstep(mix(0.02, 0.3, age), mix(0.3, 0.75, age), core * (0.55 + 0.9 * (n * 0.55 + n2 * 0.45)));
  // frozen out of clear air in flickers, 30 m behind the nozzles
  a *= smoothstep(0.0, 9.0, d) * mix(smoothstep(0.3, 0.6, fl + smoothstep(0.0, 30.0, d) * 0.5), 1.0, smoothstep(10.0, 40.0, d));
  // (a lens-facing ribbon cannot be a rope of cloud at arm's length: within 60 m of the lens the line dissolves, all along it.
  // Kept to 15 m, the two ropes lay across the whole picture as glassy bands while the lens climbed through them)
  a *= (1.0 - smoothstep(0.6, 1.0, d / uLen)) * mix(0.95, 0.6, age) * vT.z * smoothstep(18.0, 60.0, dist);
  // lit round: the normal turns across the ribbon
  vec3 N = normalize(vSd * v + V * sqrt(max(1.0 - v * v, 0.0)) + vec3(0.0, 1e-5, 0.0));
  float wrap = smoothstep(-0.45, 0.85, dot(N, uSunDir));
  float vs = max(dot(-V, uSunDir), 0.0);
  float lit = clamp(0.2 + 0.62 * wrap + 0.3 * vs * vs + (n2 - 0.5) * 0.35 + 0.2 * core * (1.0 - age), 0.0, 1.0);
  vec3 col = mix(uShade, uBody, lit);
  col = mix(col, uRim, (1.0 - core) * (0.15 + 0.85 * vs * vs) * 0.5);
  gl_FragColor = vec4(col * a * uGain, a);
}`;function ct(s,y=!0){return f=>{if(f<=s[0][0])return s[0][1];for(let p=0;p<s.length-1;p++)if(f<=s[p+1][0]){const g=(f-s[p][0])/(s[p+1][0]-s[p][0]);return _(s[p][1],s[p+1][1],y?g*g*(3-2*g):g)}return s[s.length-1][1]}}function $t(s,y,f,p,g){const o=ke,w=o-1;for(let u=y;u<f;u+=5){const r=s[u],d=s[u+1],h=s[u+2],T=1/(h*h),C=(.55+.45*s[u+3])*p,H=Math.floor(r-h),D=Math.ceil(r+h),c=Math.ceil(d+h);for(let x=Math.floor(d-h);x<=c;x++){const m=x+.5-d,A=(x&w)*o;for(let W=H;W<=D;W++){const P=W+.5-r,b=1-(P*P+m*m)*T;if(b>0){const E=b*(2-b)*C,B=A+(W&w);E>g[B]&&(g[B]=E)}}}}}function Ja(s,y,f,p,g,o){const w=ke,u=w-1;for(let r=y;r<f;r+=5){const d=s[r],h=s[r+1],T=s[r+2],C=1/(T*T),H=s[r+3],D=s[r+4],c=T*1.09,x=.45+.55*(Math.min(D,.76)-.42)/.34*(.75+.25*H),m=H>.78&&D>.56,A=Math.floor(d-c),W=Math.ceil(d+c),P=Math.ceil(h+c);for(let b=Math.floor(h-c);b<=P;b++){const E=b+.5-h,B=(b&u)*w;for(let R=A;R<=W;R++){const K=R+.5-d,ve=(K*K+E*E)*C,L=B+(R&u),F=p[L],oe=1-ve+.34*(F-.5);if(oe>0){const j=oe<1?oe:1,Y=x*j*(1.6-.6*j);Y>g[L]&&(g[L]=Y)}if(m){const j=1-ve*4.5+.3*(F-.5);if(j>0){const Y=j<1?j:1,Z=Y*(1.6-.6*Y);Z>o[L]&&(o[L]=Z)}}}}}}function e0(s,y,f,p,g){const o=ke,w=o-1;for(let u=0;u<o*o;u++){const r=s[u];y[u]=Math.max(y[u]*(.6+.4*r),.2*r),f[u]*=.7+.3*r}for(let u=0;u<o;u++)for(let r=0;r<o;r++){let d=0;for(let h=-2;h<=2;h++)d+=y[u*o+(r+h&w)];p[u*o+r]=d/5}for(let u=0;u<o;u++)for(let r=0;r<o;r++){let d=0;for(let T=-2;T<=2;T++)d+=p[(u+T&w)*o+r];const h=(u*o+r)*4;g[h]=Math.round(255*Math.min(1,y[u*o+r])),g[h+1]=Math.round(255*Math.min(1,f[u*o+r])),g[h+2]=Math.round(255*Math.min(1,d/5)),g[h+3]=255}}async function t0(s,y){const f=ke,p=Xt,g=(c,x,m)=>{const A=Math.sin(c*127.1+x*311.7+m*74.7+y)*43758.5453;return A-Math.floor(A)},o=new Float32Array(f*f),w=new Float32Array(f*f),u=new Float32Array(f*f),r=new Float32Array(f*f),d=new Uint8Array(f*f*4),h=(c,x,m,A,W)=>{const P=new Float32Array(c*c*5),b=f/c;for(let E=0,B=0;E<c;E++)for(let R=0;R<c;R++,B+=5){const K=m+(A-m)*g(R,E,x+2);P[B]=(R+.5+(g(R,E,x)-.5)*W)*b,P[B+1]=(E+.5+(g(R,E,x+1)-.5)*W)*b,P[B+2]=K*b,P[B+3]=g(R,E,x+3),P[B+4]=K}return P},T=h(p*3,11,.6,.95,.8),C=h(p*6,21,.6,1,.8),H=h(p,1,.42,.76,.7);for(let c=0,x=0;c<p;c++)for(let m=0;m<p;m++,x+=5)if(g(m,c,7)<.1){const A=1.7+.4*g(m,c,8);H[x+2]*=A,H[x+4]*=A}await s.yield();for(let c=0;c<T.length;c+=1500)$t(T,c,Math.min(T.length,c+1500),.62,o),await s.yield();for(let c=0;c<C.length;c+=3e3)$t(C,c,Math.min(C.length,c+3e3),.38,r),await s.yield();for(let c=0;c<f*f;c++)o[c]+=r[c];for(let c=0;c<H.length;c+=100)Ja(H,c,Math.min(H.length,c+100),o,w,u),await s.yield();e0(o,w,u,r,d),await s.yield();const D=new t.DataTexture(d,f,f,t.RGBAFormat);return D.wrapS=D.wrapT=t.RepeatWrapping,D.minFilter=t.LinearMipmapLinearFilter,D.magFilter=t.LinearFilter,D.generateMipmaps=!0,D.needsUpdate=!0,D}function a0(){const s=[],y=[],f=(o,w,u,r,d)=>{for(const h of[o,w,u,o,u,r])s.push(h[0],h[1],h[2]),y.push(d[0],d[1],d[2])},p=(o,w,u,r)=>{for(let d=0;d<o.length-1;d++)for(let h=0;h<w;h++){const T=h/w*Xe,C=(h+1)/w*Xe,H=(T+C)/2,D=o[d],c=o[d+1],x=(m,A)=>[u+Math.cos(A)*m[1],r+(m[2]||0)+Math.sin(A)*m[1],m[0]];f(x(D,T),x(c,T),x(c,C),x(D,C),[Math.cos(H),Math.sin(H),0])}};p([[-35,.4,-.6],[-31,2.2,-.2],[-24,3,0],[8,3,0],[26,1.9,.9],[35,.5,1.8]],8,0,0);for(const o of[-1,1])f([o*2.5,-1.2,-9],[o*32.5,2.4,11.5],[o*32.5,2.4,15],[o*2.5,-1.2,4.5],[0,1,0]),f([o*32.5,2.4,12],[o*33.2,5.2,14.5],[o*33.2,5.2,16],[o*32.5,2.4,15],[o,.3,0]),f([o*1.2,1.6,26],[o*11,2.4,32.5],[o*11,2.4,35],[o*1.2,1.6,33],[0,1,0]),p([[-9,1.5],[-2.5,1.3]],6,o*11.5,-3),p([[-1,1.5],[5.5,1.3]],6,o*21,-1.6);f([0,2.6,23],[0,13.5,31.5],[0,13.5,35],[0,2.6,33.5],[1,0,0]);const g=new t.BufferGeometry;return g.setAttribute("position",new t.BufferAttribute(new Float32Array(s),3)),g.setAttribute("normal",new t.BufferAttribute(new Float32Array(y),3)),g}var i0={id:"dawn-tracks-contrail",name:"The Dawn Tracks",category:"sky",weirdness:.35,media:["air"],async build(s){const y=s.rng,f=s.quality?.detail??1,p=s.vary||{},g=Se(p.density??1,.7,1.3),o=new t.Scene,w={value:0},u=p.hour==="golden"?"golden":p.hour==="night"?"night":"dawn",r=La[u],d=Na[Math.min(2,Math.floor(y()*3))],h=Math.min(2,Math.floor(y()*3)),T=2+Math.floor(y()*5),C=[y.range(0,40),y.range(0,40)],H=y.range(1450,1750),D=Se(y.range(.35,1)*g*r.veil,0,1.2),c=!!p.rare&&u!=="night",x=p.mood??.5,m=y.fork("tracks"),A=y.fork("fx"),W=u==="dawn"?r.ember.clone().lerp(a(d.emberMix[0],1.05),d.emberMix[1]):r.ember,P=Da(me.map(e=>[e[0],e[1],-e[2]]));await s.yield();const b=480,E=new Float32Array(b+1),B=new Float32Array(b+1),R=new t.Vector3;for(let e=0;e<=b;e++)P.pointAt(e/b,R),E[e]=-R.z,e%60===59&&await s.yield();const K=(e,l)=>{const i=Se(l,0,1)*b,n=Math.min(b-1,Math.floor(i));return _(e[n],e[n+1],i-n)},ve=(e,l)=>{let i=0,n=b;for(;n-i>1;){const S=i+n>>1;e[S]<=l?i=S:n=S}return Se((i+(l-e[i])/Math.max(1e-6,e[n]-e[i]))/b,0,1)},L=e=>K(E,e),F=e=>ve(E,e),oe=ct(Ra),j=P.length/ut,Y=e=>oe(L(e))/j;{let e=0;for(let l=1;l<=b;l++)e+=1/Se(Y((l-.5)/b),.35,2.5),B[l]=e;for(let l=1;l<=b;l++)B[l]*=ut/e}const Z=e=>K(B,e),Ce=e=>ve(B,e);await s.yield();const z=u==="night",Qe=Ze(-3,40),le=z?Ze(50,34):Qe,pe=new t.Vector3(Qe.x,0,Qe.z).normalize(),Jt=z?[{elevation:50,azimuth:34,size:1.5,phase:.8,phaseAngle:200,glow:.5,glowSize:5,color:"#eef2ff",texture:.5}]:[{elevation:20,azimuth:28,size:1.7,phase:.17,phaseAngle:222,intensity:3,dark:.045,glow:.07,glowSize:2.5,color:"#fff0de",texture:.4}],we=Ea({rng:y,preset:"dawn",...r.sky,stars:r.sky.stars*d.stars,twinkle:.8,sunElevation:z?-30:-3,sunAzimuth:40,sunIntensity:0,sunGlow:z?0:.1,clouds:!1,clouds2:!1,bodies:Jt,key:z?0:"sun",aurora:z?.4:0,auroraAzimuth:-100,auroraSpread:1,auroraColors:["#3fe0a0","#6a5ae0"],lightColor:z?"#9fb4e8":u==="golden"?"#ff5a6a":"#ff8a62",lightIntensity:z?1.1:1.6,lightElevationMin:6,ambientColor:z?"#3a4f9a":"#5a6599",groundLight:z?"#3a4a6a":"#6a4658",ambientIntensity:1.3,bake:!0,renderer:s.renderer});o.add(we.object),await s.yield(),o.fog=new t.FogExp2(r.fog.clone(),r.fogDensity);const ft=Pa(we,{intensity:.8,ambient:1,bounce:.3});o.add(ft.object),await s.yield();const ea=u==="night",v=await Ba(s,{palette:Ha,hour:u,pathPoints:me,sunDir:le});o.add(v.object),u==="dawn"&&d.trail&&v.uniforms.uBody.value.lerp(a(d.trail[0],.9),d.trail[1]),v.uniforms.uStreak.value=ea?1.1:1.7,!z&&v.hullUniforms&&v.hullUniforms.uAmbUp.value.lerp(a("#5A6599",.6),.6),!z&&v.hullUniforms&&v.hullUniforms.uEnvZen.value.lerp(a("#3a4a78",.7),.6);const $=v.noiseTex,I=v.anchors;await s.yield();const dt=r.glow*d.glow*_(.92,1.08,x),V=Ga[u],ta=W.clone(),ht=W.clone(),aa=r.gold.clone(),mt=r.gold.clone(),re={uSunAz:{value:pe},uEmber:{value:ht},uGold:{value:mt},uGreen:{value:c?1:0},uTop:{value:r.top},uSlate:{value:r.slate},uRose:{value:r.rose},uLimbDir:{value:Ze(-4.4,40)},uVenusDir:{value:Ze(25,10)},uGlow:{value:dt},uArch:{value:d.arch},uBelt:{value:r.belt*d.belt},uLimb:{value:0},uTopW:{value:1},uVenus:{value:u==="golden"?1:0},uTime:w},Fe=new t.Mesh(new t.SphereGeometry(100,28,14),new t.ShaderMaterial({uniforms:re,vertexShader:Qt,fragmentShader:_a,transparent:!0,depthWrite:!1,depthTest:!0,premultipliedAlpha:!0,side:t.BackSide,fog:!1}));Fe.frustumCulled=!1,Fe.renderOrder=-.9,Fe.name="twilight",o.add(Fe);const oa=r.hazeSun.clone(),vt=r.hazeSun.clone(),la=await t0(s,C[0]+1.7*C[1]),Me={uNoise:{value:$},uDeck:{value:la},uTime:w,uTerm:{value:1e9},uCell:{value:H},uOff:{value:new t.Vector2(C[0],C[1])},uSunAz:{value:pe},uSea:{value:r.sea},uWall:{value:r.wall.clone().multiplyScalar(.8*V.amb)},uWallHi:{value:r.wallHi.clone().multiplyScalar(.7*V.amb)},uWallRose:{value:r.wallRose},uHaze:{value:r.haze},uHazeSun:{value:vt},uTermCol:{value:V.sun},uPix:{value:.003},uLitK:{value:1},uGlowCol:{value:V.lit},uShape:{value:new t.Vector4(...Wa[h])},uRollDir:{value:new t.Vector2(Math.cos(C[0]*.37),Math.sin(C[0]*.37))},uKey:{value:z?new t.Vector3(le.x,0,le.z).normalize().multiplyScalar(Math.cos(V.el*he)).setY(Math.sin(V.el*he)):pe.clone().multiplyScalar(Math.cos(V.el*he)).setY(Math.sin(V.el*he))}},De=new t.Mesh(new t.SphereGeometry(100,28,9,0,Xe,Math.PI/2-.03,Math.PI/2+.03),new t.ShaderMaterial({uniforms:Me,vertexShader:Qt,fragmentShader:qa,defines:{STEPS:Math.max(16,Math.round(28*f))},transparent:!0,depthWrite:!1,depthTest:!0,side:t.BackSide,fog:!1}));De.frustumCulled=!1,De.renderOrder=-.8,De.name="deck",o.add(De),await s.yield();const $e=r.trackAway,pt=r.trackSun,ie=v.uniforms.uBody.value,ge=v.uniforms.uRim.value,Je=v.uniforms.uShade.value,wt=new t.PlaneGeometry(1,1,18,22),Ee=wt.attributes.position;for(let e=0;e<Ee.count;e++){const l=_(-2700,-90,Ee.getX(e)+.5),i=_(-800,1750,Ee.getY(e)+.5);Ee.setXYZ(e,l,12+.055*i,-i)}const ra={uNoise:{value:$},uTime:w,uCover:{value:D},uSunDir:{value:le},uBody:{value:ie},uRim:{value:ge},uShade:{value:Je},uHazeC:{value:$e}},Pe=new t.Mesh(wt,new t.ShaderMaterial({uniforms:ra,vertexShader:Ua,fragmentShader:Ia,transparent:!0,depthWrite:!1,premultipliedAlpha:!0,side:t.DoubleSide,fog:!1}));Pe.frustumCulled=!1,Pe.renderOrder=2,Pe.name="cirrus-veil",o.add(Pe),await s.yield();const ia=22,sa=e=>e<20?40:220,Be=820*2+442*2,gt=new Float32Array(Be*4),yt=new Float32Array(Be*4),xt=new Float32Array(Be*4),bt=new Uint16Array(1240*6),He=[],At=-160,zt=175,Re=-70,Ve=10;for(let e=0,l=0,i=0;e<ia;e++){const n=e<21?m():.37;let S=At,k=zt,U=-52e3,te=0,Q=0,ae=9,O=44,ce=0,fe=1;if(e<20){fe=0;const M=e%2?1:-1,N=e%5<3,Fa=e>=20-T,Ma=e<6?m.range(850,1900):m.range(1500,6e3);S=M*Ma,k=-55+(N?-1:1)*m.range(300,900),U=e<9?-m.range(600,5200):-m.range(7500,19e3),te=m.range(3e4,6e4),Q=m.range(-14,22),ae=10,O=m.range(45,105),Fa?(U=-6e4,te=9e4,Q=0,ae=90,O=m.range(150,240),ce=m.range(.5,.8)):He.push([S,k,U,Q])}else e===21&&(fe=2,S=Re,k=Ve-2,ae=18);const ze=l,de=sa(e);for(let M=0;M<=de;M++)for(const N of[-1,1])gt.set([M/de,N,n,fe],l*4),yt.set([S,k,U,te],l*4),xt.set([Q,ae,O,ce],l*4),l++;for(let M=0;M<de;M++){const N=ze+M*2;bt.set([N,N+1,N+2,N+1,N+3,N+2],i),i+=6}}const se=new t.BufferGeometry;se.setAttribute("position",new t.BufferAttribute(new Float32Array(Be*3),3)),se.setAttribute("aA",new t.BufferAttribute(gt,4)),se.setAttribute("aB",new t.BufferAttribute(yt,4)),se.setAttribute("aC",new t.BufferAttribute(xt,4)),se.setIndex(new t.BufferAttribute(bt,1));const Le={uNoise:{value:$},uTime:w,uHeavyZ:{value:-14e3},uHeavyZ2:{value:-9e3},uPix:{value:.002},uBody:{value:ie},uRim:{value:ge},uShade:{value:Je},uHazeAway:{value:$e},uHazeSun:{value:pt},uHazeDeck:{value:r.haze},uSunAz:{value:pe},uGain:{value:.85}},Ne=new t.Mesh(se,new t.ShaderMaterial({uniforms:Le,vertexShader:Oa,fragmentShader:Ka,transparent:!0,depthWrite:!1,premultipliedAlpha:!0,side:t.DoubleSide,fog:!1}));Ne.frustumCulled=!1,Ne.renderOrder=1,Ne.name="other-tracks",o.add(Ne),await s.yield();const Ge=v.hullUniforms,We=He.length,ye=new t.InstancedBufferGeometry,et=a0(),St=new Float32Array(We*4);for(let e=0;e<We;e++)St.set(He[e],e*4);ye.setAttribute("position",et.attributes.position),ye.setAttribute("normal",et.attributes.normal),ye.setAttribute("iA",new t.InstancedBufferAttribute(St,4)),ye.instanceCount=We;const Tt={uTime:w,uPix:{value:.002},uSunDir:{value:le},uSunCol:{value:Ge.uSunCol.value},uAmbUp:{value:Ge.uAmbUp.value},uAmbDn:{value:Ge.uAmbDn.value},uHazeAway:{value:$e},uHazeSun:{value:pt},uHazeDeck:{value:r.haze},uSunAz:{value:pe}},tt=new t.Mesh(ye,new t.ShaderMaterial({uniforms:Tt,vertexShader:ja,fragmentShader:Ya,side:t.DoubleSide,fog:!1}));tt.frustumCulled=!1,tt.name="far-airliners",o.add(tt);const xe=We*2,kt=new Float32Array(xe*16),Ct=new Float32Array(xe*16),Ft=new Uint16Array(xe*6),Mt=[[-1,-1],[1,-1],[1,1],[-1,1]];for(let e=0;e<xe;e++){const l=He[e>>1],i=m();for(let n=0;n<4;n++)kt.set(l,(e*4+n)*4),Ct.set([Mt[n][0],Mt[n][1],e&1,i],(e*4+n)*4);Ft.set([e*4,e*4+1,e*4+2,e*4,e*4+2,e*4+3],e*6)}const be=new t.BufferGeometry;be.setAttribute("position",new t.BufferAttribute(new Float32Array(xe*12),3)),be.setAttribute("aA",new t.BufferAttribute(kt,4)),be.setAttribute("aL",new t.BufferAttribute(Ct,4)),be.setIndex(new t.BufferAttribute(Ft,1));const Dt={uTime:w,uPix:{value:.002},uGlint:{value:z?a("#dfe8ff",1.6):ie.clone().multiplyScalar(2.4)},uBeacon:{value:a("#ff2416",3.6)}},_e=new t.Mesh(be,new t.ShaderMaterial({uniforms:Dt,vertexShader:Za,fragmentShader:Xa,transparent:!0,depthWrite:!1,blending:t.AdditiveBlending,fog:!1}));_e.frustumCulled=!1,_e.renderOrder=3,_e.name="far-lights",o.add(_e),await s.yield();const J=new t.Group;J.name="westbound-heavy",J.rotation.y=Math.PI,J.position.set(At,zt,-14e3);let qe=null,Et=null;if(v.airliner){const e=v.airliner.hull.material.clone(),l=v.airliner.lamps.material.clone();e.uniforms.uNoise.value=$,e.uniforms.uTail.value.set(m.pick(["#0E6F7A","#B01E3C","#1D3FA6","#D99A1B","#5E2A6E"])).multiplyScalar(.85);const i=new t.Mesh(v.airliner.hull.geometry,e),n=new t.Mesh(v.airliner.lamps.geometry,l);i.position.set(0,-2.2,2024),n.position.copy(i.position),i.frustumCulled=!1,n.frustumCulled=!1,n.renderOrder=9,J.add(i,n),qe=e.uniforms,Et=l.uniforms}o.add(J);const Pt=100,na=56,ua=-I.airliner.nose.z,ca=e=>ua+Pt*(55-Z(e))-L(e);await s.yield();const ee=new t.Group;ee.name="crossing-heavy",ee.rotation.y=Math.PI,ee.position.set(Re,Ve,-9e3);let Ue=null,Bt=null;if(v.airliner){const e=v.airliner.hull.material.clone(),l=v.airliner.lamps.material.clone();e.uniforms.uNoise.value=$,e.uniforms.uTail.value.set(["#1E6B45","#C8452A","#1D3FA6","#B01E3C","#0E6F7A"][T%5]).multiplyScalar(.85);const i=new t.Mesh(v.airliner.hull.geometry,e),n=new t.Mesh(v.airliner.lamps.geometry,l);i.position.set(0,-2.2,2024),n.position.copy(i.position),i.frustumCulled=!1,n.frustumCulled=!1,n.renderOrder=9,ee.add(i,n),Ue=e.uniforms,Bt=l.uniforms,z&&(e.uniforms.uAmbDn.value.multiplyScalar(4.5),e.uniforms.uEnvDeck.value.multiplyScalar(2.2))}o.add(ee);const Ht=1440,at=Z(F(Ht)),Rt=e=>Ht+Pt*(at-Z(e))-L(e),ot=new t.Vector3(Re,Ve,-9e3),Vt=new t.Vector3,fa=new t.Vector3,da=ct([[990,-110],[1110,-104],[1230,-94.5],[1350,-95],[1750,-22],[1990,-3]],!1),ha=(e,l)=>{const i=L(l),n=i+90;return ot.set(Re,Ve,-(i+Rt(l))),P.pointAt(l,Vt),fa.set(0,da(n)+4,-n).lerp(ot,1-G(200,620,ot.distanceTo(Vt)))};await s.yield();const q={x:8,y:-90,z:-1066,hx:-.989,hz:.148},X=new t.Group;X.name="early-heavy",X.rotation.order="YXZ",X.rotation.set(0,Math.atan2(-q.hx,-q.hz),.2),X.position.set(q.x,q.y,q.z);const lt=new t.Group;X.add(lt);let Ie=null,Lt=null;if(v.airliner){const e=v.airliner.hull.material.clone(),l=v.airliner.lamps.material.clone();e.uniforms.uNoise.value=$,e.uniforms.uTail.value.set(["#D99A1B","#0E6F7A","#5E2A6E","#C8452A","#1D3FA6"][T%5]).multiplyScalar(.85);const i=new t.Mesh(v.airliner.hull.geometry,e),n=new t.Mesh(v.airliner.lamps.geometry,l);i.position.set(0,-2.2,2024),n.position.copy(i.position),i.frustumCulled=!1,n.frustumCulled=!1,n.renderOrder=9,lt.add(i,n),Ie=e.uniforms,Lt=l.uniforms,z?(e.uniforms.uAmbDn.value.multiplyScalar(4.5),e.uniforms.uAmbUp.value.multiplyScalar(1.6),e.uniforms.uEnvDeck.value.multiplyScalar(2.2)):(e.uniforms.uAmbDn.value.copy(a(u==="golden"?"#B86AA8":"#C9809A",.4)),e.uniforms.uAmbUp.value.multiplyScalar(1.7),e.uniforms.uEnvAnti.value.multiplyScalar(2),e.uniforms.uEnvDeck.value.copy(a("#6a4658",.7)))}o.add(X);const ne=110,ma=2600,Nt=new Float32Array(4*(ne+1)*2*4),Gt=new Uint16Array(4*ne*6);for(let e=0,l=0,i=0;e<4;e++){const n=l;for(let S=0;S<=ne;S++)for(const k of[-1,1])Nt.set([S/ne,k,e<2?-1:1,e%2],l*4),l++;for(let S=0;S<ne;S++){const k=n+S*2;Gt.set([k,k+1,k+2,k+1,k+3,k+2],i),i+=6}}const Oe=new t.BufferGeometry;Oe.setAttribute("position",new t.BufferAttribute(new Float32Array(4*(ne+1)*2*3),3)),Oe.setAttribute("aA",new t.BufferAttribute(Nt,4)),Oe.setIndex(new t.BufferAttribute(Gt,1));const Ke={uNoise:{value:$},uTime:w,uHead:{value:0},uPix:{value:.002},uLen:{value:ma},uGain:{value:.95},uBody:{value:ie},uRim:{value:ge},uShade:{value:Je},uSunDir:{value:le}},Ae=new t.Mesh(Oe,new t.ShaderMaterial({uniforms:Ke,vertexShader:Qa,fragmentShader:$a,transparent:!0,depthWrite:!1,premultipliedAlpha:!0,side:t.DoubleSide,fog:!1}));Ae.frustumCulled=!1,Ae.renderOrder=9.5,Ae.name="early-heavy-line",X.add(Ae);const va=Z(F(1003)),pa=e=>na*(Z(e)-va);await s.yield();const rt=z?"#dfe8ff":"#cfe6ff",Wt=z?"#aebcf0":u==="golden"?"#ff7aa0":"#ff9f7a",_t=Te.makeParticles({rng:A.fork("glitter"),preset:"dust",shape:"sparkle",count:Math.round(7e3*f*Math.max(.9,g)),box:[150,90,170],size:[.08,.26],colors:[Wt,rt,z?"#ffffff":"#ffd9a8"],intensity:3,additive:1,twinkle:.5,blink:2.2,velocity:[3,-.6,1.8],velocityRandom:[1.5,.6,1.5],turbulence:[1.6,.8,.05],minAngle:.0032,near:[6,18],time:w});o.add(_t.object);const je=Te.makeParticles({rng:A.fork("streaks"),preset:"dust",mode:"streak",shape:"streak",count:Math.round(300*f),box:[56,40,150],size:[.04,.09],colors:[rt,Wt,rt],intensity:1.3,additive:1,velocity:[0,0,64],velocityRandom:[1.5,1.5,10],stretch:.03,minAngle:.0016,near:[2.5,7],time:w});o.add(je.object),je.setOpacity(0);const ue=I.portalSeat.position,qt=me[me.length-1],Ut=me[me.length-2],Ye=Math.atan2(qt[1]-Ut[1],qt[2]-Ut[2]),It=[],Ot=Math.round(96*Math.max(.75,f));for(let e=0;e<Ot;e++){const l=(e+A()*.7)/Ot*Xe,i=15+A.gauss()*1.2,n=A.range(-1.5,1.5);It.push([ue.x+Math.cos(l)*i,ue.y+Math.sin(l)*i*Math.cos(Ye)+n*Math.sin(Ye),ue.z+Math.sin(l)*i*Math.sin(Ye)-n*Math.cos(Ye)])}const Kt=Te.makeGlows({rng:A.fork("ring"),positions:It,colors:["#CFE4FF",z?"#ffffff":"#FFC98A","#6FE3C8","#CFE4FF"],size:1.3,sizeJitter:.6,intensity:2.3,flicker:.8,minAngle:.0032,fogAmount:.15,time:w});o.add(Kt.object);const it=Te.makeGlow({rng:A.fork("star"),position:[ue.x,ue.y,ue.z],color:"#CFE4FF",size:34,intensity:0,spikes:.5,minAngle:.011,fogAmount:.1,time:w});o.add(it.object);const jt=Te.makeShootingStars({rng:A.fork("meteors"),count:Math.round(8*g),period:[5,13],duration:.9,minElevation:.62,radius:1500,intensity:4,color:"#fff4e4",tailColor:"#8fb8ff",time:w});o.add(jt.object),await s.yield();const st=I.loop7,wa=new t.Vector3,nt=I.airliner.fuselage,ga=new t.Vector3,ya=ct([[990,-110],[1110,-104],[1230,-94.5],[1350,-95],[1750,-22],[1990,-3]],!1),xa=new t.Vector3,ba=[{at:I.rings[0].center.clone(),from:0,to:F(440),weight:.42},{at:new t.Vector3(-60,-40,-400),from:.04,to:.125,weight:.7},{at:I.loop5.clone(),from:F(450),to:F(655),weight:.3},{at:I.rings[1].center.clone(),from:F(650),to:F(770),weight:.5},{at:I.rings[2].center.clone(),from:F(765),to:F(885),weight:.5},{at:(e,l)=>wa.set(0,_(st.y+32,st.y+12,G(940,992,L(l))),st.z-8),from:F(845),to:F(1062),weight:.75,fade:.25},{at:(e,l)=>{const i=L(l)+90;return xa.set(0,ya(i)+4,-i)},from:F(1105),to:F(1400),weight:.6,fade:.2},{at:ha,from:Ce(at-5.6),to:Ce(at+.7),weight:.6,fade:.45},{at:(e,l)=>{const i=L(l);return ga.set(nt.x,nt.y,-Math.max(-nt.z,i+23+.8*Math.max(0,i-2007)))},from:F(1955),to:F(2062),weight:.5},{at:I.wreath.center.clone(),from:.835,to:.95,weight:.45,fade:.4}];await we.prewarm(s.renderer,null,o);const Yt=new t.Vector2,Aa=re.uLimbDir.value,za=Ce(55.5),Sa=Ce(64.5),Ta=ie.clone(),ka=ge.clone(),Ca=[Ge,qe,Ue,Ie].filter(Boolean).map(e=>({u:e,c:e.uSunCol.value.clone()})),Zt=40*he;return{scene:o,path:P,duration:ut,pace:Y,camera:{fov:75,near:.5,far:6e4,lookAhead:55,sway:.5,bank:.6},pois:ba,portal:{shape:"circle",radius:7,color:"#CFE4FF",glow:1,tilt:!0},post:{exposure:1,bloom:{strength:.4,radius:.6,threshold:.92},grade:{saturation:u==="golden"?.92:1.12,contrast:1.06,tint:"#ffffff",shadowTint:"#05071a",vignette:.34,grain:.02,aberration:0}},ride:"none",update(e,l,i,n){w.value=l,we.update(e,l,i),ft.update(e,l,i),v.update(e,l,i),v.setProgress(n),s.renderer.getDrawingBufferSize(Yt);const S=2/(Math.max(.2,i.projectionMatrix.elements[5])*Math.max(64,Yt.y));Le.uPix.value=S*.85,Tt.uPix.value=S,Dt.uPix.value=S;const k=L(n),U=G(.3,.88,n)*V.warm,te=G(.3,.62,n)*V.warm,Q=z?0:G(.54,.64,n)*(u==="dawn"||c?1:0);let ae=dt*_(.84,1.12,n)*(1+.16*U);ht.copy(ta).lerp(V.emberTo,.6*U),mt.copy(aa).multiplyScalar(1+.45*U),re.uArch.value=d.arch*_(.86,1,G(0,.45,n))*(1+.42*U),ie.copy(Ta).lerp(V.bodyTo,.5*te),ge.copy(ka).lerp(V.rimTo,.5*te),re.uTopW.value=1+.7*te;for(const M of Ca)M.u.uSunCol.value.copy(M.c).lerp(V.sunTo,.6*U),M.u.uPix.value=S;vt.copy(oa).lerp(V.emberTo,.3*U),Me.uPix.value=S,Me.uLitK.value=z?1:_(.85,1.12,G(0,.6,n));const O=pa(n);X.position.set(q.x+q.hx*O,q.y,q.z+q.hz*O),lt.visible=O>-2600&&O<1500,Ke.uHead.value=O,Ke.uPix.value=S*.85,Ke.uGain.value=v.uniforms.uGain.value,Ae.renderOrder=i.matrixWorld.elements[13]<q.y?10.5:9.5,Ie&&(Ie.uTime.value=l+5.1,Lt.uTime.value=l);const ce=ca(n),fe=-(k+ce);J.position.z=fe,J.visible=ce<7500&&ce>-1200,Le.uHeavyZ.value=fe-34,qe&&(qe.uTime.value=l+3.3,Et.uTime.value=l);const ze=Rt(n),de=-(k+ze);ee.position.z=de,ee.visible=ze<7500&&ze>-1200,Le.uHeavyZ2.value=de-34,Ue&&(Ue.uTime.value=l+1.7,Bt.uTime.value=l),je.setOpacity(G(44,68,oe(k))*.7),it.uniforms.uIntensity.value=G(1250,1600,k)*_(.2,1.25,G(90,620,2400-k));{const M=c?G(za,Sa,n):0,N=(_(-4.3,-3.52,Q)+.2*G(.64,1,n)*Q+.42*M)*he;Aa.set(Math.sin(Zt)*Math.cos(N),Math.sin(N),-Math.cos(Zt)*Math.cos(N)),re.uLimb.value=Q*(.7+.3*M),Me.uTerm.value=z?1e9:_(6e4,6500,G(.5,.98,n)*(u==="dawn"||c?1:.45))-15e3*M,ae+=.1*M}re.uGlow.value=ae,_t.update(e,l,i),je.update(e,l,i),Kt.update(e,l,i),it.update(e,l,i),jt.update(e,l,i)},dispose(){we.dispose(),v.dispose(),et.dispose()}}}};export{i0 as default};
