import*as t from"three";import{mergeGeometries as Me}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as xe,lerp as E}from"../kit/core.js";const r=2e3,p=1200,G=300,u=Math.PI*2,Pe=["#0a1030","#7fb6ff","#dff1ff","#4f9a56","#2f6f9a","#c9b68a","#ffcf6a"],oe=`
uniform float uTime;
uniform vec3 uHaze, uHazeFar, uSunDir, uSunCol, uAmb;
uniform float uShade, uFogMax, uProgress;
uniform highp sampler3D uNoise;
float hash13(vec3 p){ p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
// value noise from a 64^3 tiling lattice texture: one filtered fetch per tap (smooth interpolation via the warped fraction)
float vnoise(vec3 p){
  vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return texture(uNoise, (i + f + 0.5) / 64.0).r;
}
float fbm3(vec3 p){ return 0.5 * vnoise(p) + 0.25 * vnoise(p * 2.03 + 7.1) + 0.125 * vnoise(p * 4.1 + 3.3) + 0.0625 * vnoise(p * 8.2 + 1.7); }
float fbm2(vec3 p){ return 0.62 * vnoise(p) + 0.38 * vnoise(p * 2.07 + 5.3); }
// day factor around the ring: 1 in sunlight, 0 in the shaded, lamp-lit sector
float dayAt(float th){ return smoothstep(-0.12, 0.30, 0.62 - cos(th - uShade)); }
// blue scattering by distance through the ring's air, then a capped share of the scene fog
vec3 airAndFog(vec3 col, float dist, float day, float fogDepth, vec3 fogCol, float fogF){
  float a = 0.8 * (1.0 - exp(-pow(max(dist, 1.0) / 4200.0, 1.8)));
  vec3 hz = mix(uHaze, uHazeFar, smoothstep(600.0, 3800.0, dist)) * mix(0.16, 1.0, day);
  col = mix(col, hz, a);
  col = mix(col, fogCol * mix(0.12, 1.0, day), min(fogF, uFogMax) * smoothstep(0.0, 400.0, fogDepth));   // (the air of the night side is unlit)
  return col;
}
`,ae=`
  float fogF = 0.0; vec3 fogC = vec3(0.0); float fogD = 0.0;
  #ifdef USE_FOG
    fogD = vFogDepth; fogC = fogColor;
    #ifdef FOG_EXP2
      fogF = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      fogF = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #endif
`,ke=`
#include <common>
#include <fog_pars_vertex>
attribute float aTheta;
varying vec3 vP; varying vec3 vW; varying float vTh; varying float vX;
void main(){
  vP = position - vec3(0.0, ${r}.0, 0.0); vTh = aTheta; vX = position.x;
  vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ae=`
#include <common>
#include <fog_pars_fragment>
${oe}
uniform vec3 uGreen, uWater, uTan, uWarm, uPale, uSeed;
uniform vec4 uRiver[3];        // amplitude, integer frequency, unused, unused
uniform vec3 uVillage[8];
uniform float uOpen, uOpenFade, uCloud;
varying vec3 vP; varying vec3 vW; varying float vTh; varying float vX;
float riverX(float th){ return uRiver[0].x * sin(uRiver[0].y * th) + uRiver[1].x * sin(uRiver[1].y * th) + uRiver[2].x * sin(uRiver[2].y * th); }
vec3 rotX(vec3 p, float a){ float c = cos(a), s = sin(a); return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z); }
// small cumulus drifting round the ring: a density field, cut hard so each cloud is a separate heap
float cloudD(vec3 p){
  vec3 q = rotX(p, uTime * 0.0035) * vec3(0.0030, 0.0040, 0.0040) + uSeed.zxy;
  return fbm3(q) + 0.05 * vnoise(q * 3.7 + uTime * 0.008);
}
float cloudCut(float d){ float t0 = mix(0.69, 0.60, uCloud); return smoothstep(t0, t0 + 0.028, d); }
void main(){
  float s = vTh * ${r}.0, x = vX;
  float arc = min(vTh, ${u.toFixed(6)} - vTh) * ${r}.0;       // arc distance from the lowest point
  float alpha = smoothstep(uOpen, uOpen + uOpenFade, arc);
  if (alpha < 0.004) discard;
  float px = length(fwidth(vP)) + 0.001;                 // metres per pixel
  vec3 q = vP + uSeed * 900.0;
  float day = dayAt(vTh);

  // ---- relief (painted) ----
  float hill = fbm2(q * 0.0021);
  float hillL = fbm2((q + vec3(-45.0, 0.0, 0.0)) * 0.0021);
  float relief = clamp((hill - hillL) * 11.0, -1.0, 1.0);

  // ---- water: river and lakes ----
  float rx = riverX(vTh), dr = abs(x - rx);
  // (25 m wide where it meets the real river, drawn finer up the arch so it stays a thread and not a road)
  float rw = max(mix(12.5, 5.0, smoothstep(uOpen + 60.0, uOpen + 900.0, arc)), px * 1.0);
  float river = 1.0 - smoothstep(rw, rw + max(px * 0.8, 2.0), dr);
  float bank = 1.0 - smoothstep(rw, rw + 22.0 + px, dr);
  float lakeN = vnoise(q * 0.0029 + 11.0) + 0.35 * vnoise(q * 0.0105);
  float edge = (1.0 - smoothstep(520.0, 600.0, abs(x)));
  float lake = smoothstep(0.955, 0.97 + px * 0.002, lakeN) * edge * smoothstep(60.0, 120.0, dr);
  float shore = smoothstep(0.90, 0.955, lakeN) * edge;
  float valley = 1.0 - smoothstep(40.0, 260.0, dr);

  // ---- patchwork of fields ----
  vec2 wq = vec2(s, x) + 36.0 * (vec2(vnoise(q * 0.0045), vnoise(q * 0.0045 + 19.0)) - 0.5)
                       + 190.0 * (vec2(vnoise(q * 0.0011 + 3.0), vnoise(q * 0.0011 + 31.0)) - 0.5);
  vec2 fc = vec2((vTh / ${u.toFixed(6)} + 0.5) * 150.0 + wq.x / ${(u*r/150).toFixed(4)} - s / ${(u*r/150).toFixed(4)}, wq.y / 64.0);
  vec2 ci = floor(fc);
  float d1 = 1e9, d2 = 1e9; vec2 cid = vec2(0.0);                       // voronoi fields with hedgerows on the borders
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++){
    vec2 g = ci + vec2(float(i), float(j)); vec2 gw = vec2(mod(g.x, 150.0), g.y);
    vec2 o = vec2(hash12(gw + uSeed.xy * 50.0), hash12(gw * 1.7 + 9.3));
    vec2 r = (g + 0.12 + 0.76 * o - fc) * vec2(${(u*r/150).toFixed(2)}, 64.0);
    float d = dot(r, r);
    if (d < d1){ d2 = d1; d1 = d; cid = gw; } else if (d < d2){ d2 = d; }
  }
  float fh0 = hash12(cid + uSeed.xy * 50.0 + 5.0), fh2 = hash12(cid * 1.7 + 9.0);
  float fh = clamp(0.5 + (fh0 - 0.5) * 1.05 + (vnoise(q * 0.0022 + 50.0) - 0.5) * 0.6, 0.0, 0.999);   // crops cluster a little by district, but every field is its own
  float ed = (sqrt(max(d2, 0.0)) - sqrt(max(d1, 0.0))) * 0.5;
  // hedges: never under a pixel and a half wide, so the patchwork keeps its edges all the way up the arch (fainter where a field is only a few pixels)
  float hwid = max(1.3, px * 0.66);
  float hedge = (1.0 - smoothstep(hwid, hwid + max(px * 0.7, 0.6), ed)) * mix(0.9, 0.4, smoothstep(6.0, 15.0, px));
  vec3 fGreen = mix(uGreen * vec3(0.72, 0.98, 0.6), uGreen * vec3(1.5, 1.2, 0.5), fh2) * (0.7 + 0.42 * fract(fh0 * 13.7));
  vec3 field = fGreen;
  field = mix(field, mix(uGreen, uTan, 0.55) * vec3(1.2, 1.16, 0.8), step(0.46, fh));     // ripening
  field = mix(field, uTan * vec3(1.12, 0.98, 0.62) * (0.8 + 0.36 * fh2), step(0.62, fh)); // wheat and stubble
  field = mix(field, vec3(0.27, 0.17, 0.11) * (0.8 + 0.5 * fh2), step(0.79, fh));         // plough
  field = mix(field, vec3(0.74, 0.66, 0.10), step(0.885, fh));                            // rape
  field = mix(field, vec3(0.52, 0.36, 0.34), step(0.968, fh));                            // orchards in bloom
  float furrow = sin((fh2 > 0.5 ? fc.x * 84.0 : fc.y * 64.0) * 0.9) * 0.5 + 0.5;
  field *= 1.0 - 0.14 * furrow * (1.0 - smoothstep(2.0, 6.0, px)) * step(0.46, fh);
  // strip farming: some fields are ploughed in broad two-tone bands that still read from far off
  float strip = step(0.5, fract((fh2 > 0.5 ? fc.x * 84.0 : fc.y * 64.0) / 21.0 + fh0)) * step(0.7, fract(fh0 * 7.3));
  field *= 1.0 - 0.2 * strip * (1.0 - smoothstep(7.0, 16.0, px));
  // rice paddies: little mirrors in the valley
  float paddy = step(0.72, fh2) * valley * (1.0 - step(0.74, fh));
  field = mix(field, mix(uWater, uGreen, 0.4) * 1.1 + 0.08 * uPale, paddy * 0.7);

  // ---- woods and meadow ----
  float wn = fbm2(q * 0.0046 + 5.0) + 0.12 * vnoise(q * 0.021) - 0.06 + 0.5 * (hill - 0.47);
  float wood = smoothstep(0.53, 0.57, wn) * (1.0 - 0.8 * valley);
  float tuft = vnoise(q * 0.09) * (1.0 - smoothstep(4.0, 14.0, px));
  vec3 woodC = uGreen * vec3(0.8, 1.0, 0.8) * mix(0.26, 0.46, vnoise(q * 0.02)) * (0.8 + 0.6 * tuft);
  woodC = mix(woodC, vec3(0.34, 0.22, 0.08), 0.3 * smoothstep(0.62, 0.8, vnoise(q * 0.035 + 40.0)));   // maples
  vec3 meadow = uGreen * 1.05 * (0.74 + 0.5 * vnoise(q * 0.012)) * (0.86 + 0.28 * fract(fh0 * 5.3));   // hill pasture: each enclosure grazed to its own tone
  vec3 land = mix(field, meadow, smoothstep(0.58, 0.72, hill) * 0.8);
  land = mix(land, uGreen * vec3(0.3, 0.42, 0.26), hedge);
  // the lanes between the villages: a wide net of pale roads that wanders with the land
  vec2 rg = wq / vec2(470.0, 340.0) + uSeed.xy * 3.0, rcell = abs(fract(rg) - 0.5);
  float rdm = min((0.5 - rcell.x) * 470.0, (0.5 - rcell.y) * 340.0), rwd = max(2.4, px * 0.62);
  float road = (1.0 - smoothstep(rwd, rwd + max(px * 0.6, 0.8), rdm)) * mix(0.85, 0.5, smoothstep(7.0, 16.0, px));
  land = mix(land, uPale * 0.5 + uTan * 0.32, road);
  // a hamlet where two lanes cross
  vec2 rcn = floor(rg + 0.5); float hmh = hash12(rcn + 3.0);
  float hamlet = step(0.42, hmh) * (1.0 - smoothstep(42.0 + 30.0 * hmh, 80.0 + 50.0 * hmh, length((rg - rcn) * vec2(470.0, 340.0))));
  land = mix(land, woodC, wood * (1.0 - 0.8 * road));
  land = mix(land, uTan * 0.9, bank * 0.35 + shore * 0.0);
  land *= 0.72 + 0.5 * hill;
  land = max(mix(vec3(dot(land, vec3(0.3, 0.55, 0.15))), land, 1.16), 0.0);

  // ---- villages ----
  float vil = 0.0, vd = 1e5;
  for (int i = 0; i < 8; i++){ float d = distance(vP, uVillage[i]); vd = min(vd, d); }
  float vr = 150.0 + 60.0 * vnoise(q * 0.02);
  vil = 1.0 - smoothstep(vr * 0.45, vr, vd);
  // market towns scattered over the country between the eight big ones (they are what lights the night side)
  float mkt = smoothstep(0.885, 0.925, vnoise(q * 0.0034 + 70.0) + 0.12 * vnoise(q * 0.013 + 4.0)) * (1.0 - lake) * smoothstep(50.0, 110.0, dr) * edge;
  vil = max(vil, max(mkt * 0.8, hamlet * (1.0 - lake)));
  // roofs: houses 13 m apart seen near; from far off whole blocks of roofs between streets, so a town is a cluster of roofs at any distance
  vec2 hc = vec2(s, x) / 13.0; vec2 hi = floor(hc), hf = fract(hc) - 0.5;
  float hh = hash12(hi + 7.0);
  float roof = step(0.3, hh) * (1.0 - smoothstep(0.30, 0.36 + px * 0.03, max(abs(hf.x), abs(hf.y))));
  vec2 bc = wq / 36.0; vec2 bi = floor(bc), bf = fract(bc) - 0.5;
  float bh = hash12(bi + 17.0);
  float block = step(0.2, bh) * (1.0 - smoothstep(0.31, 0.37 + px * 0.012, max(abs(bf.x), abs(bf.y))));
  float farT = smoothstep(2.2, 5.5, px);
  float roofFar = mix(mix(roof, block, farT), 0.62, smoothstep(11.0, 22.0, px));
  float quarter = vnoise(q * 0.016 + 60.0), hsel = mix(hh, bh, farT);
  vec3 roofC = mix(vec3(0.60, 0.25, 0.13), vec3(0.72, 0.66, 0.54), smoothstep(0.45, 0.7, quarter + 0.5 * (hsel - 0.5)));
  vec3 town = mix(uTan * 0.42, roofC * (0.85 + 0.3 * hsel), roofFar);
  town = mix(town, uGreen * 0.5, smoothstep(0.64, 0.72, vnoise(q * 0.03 + 80.0)));       // gardens and squares
  vil *= smoothstep(0.25, 0.5, vil + 0.5 * (vnoise(q * 0.012 + 33.0) - 0.5));
  land = mix(land, town, vil);
  // rim promenade under the glass
  float prom = smoothstep(572.0, 580.0, abs(x));
  land = mix(land, uPale * 0.62 * (0.9 + 0.1 * step(0.5, fract(s / 24.0))), prom);

  // ---- light ----
  vec3 V = normalize(cameraPosition - vW);
  vec3 Nin = -normalize(vec3(0.0, vP.y, vP.z));                   // the floor's normal: toward the axis
  float thin = 0.11 * valley + 0.6 * (1.0 - smoothstep(uOpen + 420.0, uOpen + 1100.0, arc));   // none over the river, none over the near land and the foot of the arch (seen edge-on a cloud there is a white bar)
  float cs = cloudCut(cloudD(vP + vec3(-150.0, 0.0, 0.0) + Nin * 130.0) - thin);   // cloud shadow, thrown from the sun wall
  float sun = (0.74 + 0.55 * relief) * (1.0 - 0.72 * cs);
  vec3 lit = land * (uSunCol * sun * day + uAmb * (0.35 + 0.65 * day) * (1.0 - 0.25 * cs));

  // ---- water shading ----
  float flow = 0.5 + 0.5 * sin(vTh * 2600.0 - uTime * 1.6 + 6.0 * vnoise(vec3(s * 0.02, x * 0.05, uTime * 0.1)));
  float ripple = mix(flow, 0.5, smoothstep(1.0, 5.0, px));
  float glide = 0.5 + 0.5 * sin(vTh * 29.0 - uTime * 0.3);        // bands of sun-glint travelling along the river
  float glint = glide * glide; glint *= glint; glint *= glint;      // (narrow: a flash 80 m long every 400 m)
  float farK = smoothstep(500.0, 1700.0, distance(cameraPosition, vW));
  float flash = 0.5 + 0.5 * sin(dot(vP, vec3(0.011, 0.016, 0.014)) - uTime * 0.5);   // the sun's reflection crossing each lake in turn: a streak, not the whole sheet
  flash *= flash; flash *= flash; flash *= flash; flash *= flash * flash;      // (narrow: a bar of light crossing the water, never the whole sheet white)
  vec3 lakeC = mix(uWater * 0.5, uPale * 0.8, 0.06 + 0.2 * vnoise(q * 0.01 + uTime * 0.02)) * (uSunCol * day + uAmb * 0.6);
  float lkn = vnoise(q * 0.03 + vec3(0.0, uTime * 0.05, 0.0)), lkn2 = lkn * lkn;
  lakeC += uSunCol * day * (1.3 * lkn2 * lkn2 * lkn + 1.7 * flash * (1.0 - 0.7 * cs));
  vec3 silver = mix(uWater * 0.9 + 0.25 * ripple, vec3(0.50, 0.64, 0.84) * (0.9 + 0.2 * ripple) + vec3(1.0, 0.96, 0.88) * glint * (2.4 + 1.2 * uProgress) * (1.0 - 0.6 * cs), farK);
  vec3 riverC = silver * mix(0.2, 1.0, day) + vec3(0.25, 0.4, 0.7) * 0.22 * (1.0 - day);
  lit = mix(lit, lakeC, lake);
  lit = mix(lit, riverC, river);

  // ---- moving glints: boats on the river, monorail on the left bank ----
  float boat = pow(max(1e-4, 1.0 - abs(fract(vTh / ${u.toFixed(6)} * 46.0 + uTime * 0.011) - 0.5) * 2.0), 60.0) * (1.0 - smoothstep(rw * 0.5, rw * 0.5 + px + 2.0, abs(dr - 3.0)));
  lit += vec3(2.2, 2.2, 2.0) * boat * (0.4 + 0.6 * day) + uWarm * 3.0 * boat * (1.0 - day);
  float mx = abs(x - (rx - 110.0)), mw = max(2.0, px * 0.6);
  float rail = 1.0 - smoothstep(mw, mw + max(px, 1.5), mx);
  lit = mix(lit, uPale * 0.38 * (uSunCol * day + uAmb), rail * 0.55 * (1.0 - smoothstep(4.0, 14.0, px)));
  float tr = fract(vTh / ${u.toFixed(6)} * 11.0 - uTime * 0.026);
  float train = smoothstep(0.90, 0.93, tr) * (1.0 - smoothstep(0.985, 1.0, tr));
  lit += (vec3(1.6, 1.9, 2.4) * day + uWarm * 3.5 * (1.0 - day) + vec3(4.0, 3.6, 3.0) * smoothstep(0.975, 0.99, tr)) * train * rail;

  // ---- lamps in the shaded sector ----
  float night = 1.0 - day;
  vec2 lc = vec2(s, x) / 17.0 + 2.0 * vec2(vnoise(q * 0.02 + 90.0), vnoise(q * 0.02 + 70.0)); vec2 li = floor(lc);
  float lh = hash12(li + 21.0);
  vec2 lf = fract(lc) - 0.5 - 0.55 * (vec2(hash12(li + 3.7), hash12(li + 11.3)) - 0.5);
  float tw = 0.75 + 0.25 * sin(uTime * (1.0 + 3.0 * lh) + lh * 40.0);
  float lr = 0.10 + px * 0.02;
  float lampDot = mix(1.0 - smoothstep(lr, lr + 0.12, length(lf)), 0.2, smoothstep(5.0, 16.0, px));
  float street = smoothstep(0.35, 0.75, vnoise(q * 0.03 + 12.0));
  float lamps = lampDot * (step(1.0 - 0.75 * vil * vil * street, lh) * (0.5 + lh) * 1.4 + step(0.9965, lh) * (1.0 - wood) + step(0.86, lh) * prom * 0.5 + step(0.95, lh) * bank * 0.5);
  lit += uWarm * 5.0 * lamps * tw * night * (1.0 - river) * (1.0 - lake);
  lit += uWarm * (0.3 * vil + 0.9 * max(mkt, 0.7 * hamlet) * (0.6 + 0.8 * hash12(li * 0.37 + 5.0)) + 0.3 * road * step(0.6, fract(rdm * 0.01 + (rg.x + rg.y) * 9.0))) * night;   // town glow: each market town a warm cluster on the night side

  // ---- clouds seen from above ----
  // (they float 130 m over the land: looked at aslant they slide off their shadows, and the side toward the sun wall is the bright one)
  vec3 pc = vP + (V - Nin * dot(V, Nin)) * (130.0 / max(dot(V, Nin), 0.3));
  float cd = cloudD(pc) - thin, cl = cloudCut(cd);
  float cdS = cloudD(pc + vec3(-55.0, 0.0, 0.0)) - thin;          // density one step toward the sun: less there means this is the lit flank
  float heap = smoothstep(0.0, 0.07, cd - mix(0.69, 0.60, uCloud));   // 0 at a cloud's rim, 1 in its tall middle
  float lightK = clamp(0.42 + 7.0 * (cd - cdS) + 0.45 * heap, 0.0, 1.0);
  vec3 cloudC = mix(vec3(0.40, 0.50, 0.74), vec3(1.04, 1.02, 0.98), lightK) * (uSunCol * 0.86 * day + uAmb * 0.85);
  lit = mix(lit, cloudC, cl * 0.94);
  // morning mist pooled along the river and lakes
  float mist = (valley * 0.5 + shore * 0.3) * vnoise(q * 0.004 + vec3(uTime * 0.01)) * (1.0 - cl);
  lit = mix(lit, uHazeFar * 0.9 * (0.25 + 0.75 * day), mist * 0.08);

  ${ae}
  vec3 col = airAndFog(lit, distance(cameraPosition, vW), day, fogD, fogC, fogF);
  // lamps and glints punch through the haze a little
  col += uWarm * 1.6 * lamps * tw * night * (1.0 - cl);
  gl_FragColor = vec4(col, alpha);
}`,Ne=`
#include <common>
#include <fog_pars_vertex>
attribute float aTheta; attribute float aH;
varying vec3 vP; varying vec3 vW; varying vec3 vN; varying float vTh; varying float vH;
void main(){
  vP = position; vTh = aTheta; vH = aH;
  vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,qe=`
#include <common>
#include <fog_pars_fragment>
${oe}
uniform vec3 uPale, uWarm, uSpace, uGlowDir;
uniform float uGlowAmt;
varying vec3 vP; varying vec3 vW; varying vec3 vN; varying float vTh; varying float vH;
void main(){
  vec3 V = normalize(cameraPosition - vW);
  float dist = distance(cameraPosition, vW);
  float px = length(fwidth(vP)) + 0.001;
  float day = dayAt(vTh);
  float sunSide = step(vP.x, 0.0);                           // the -X wall lets the sunlight in
  float f1 = clamp(1.0 - abs(dot(V, vN)), 0.0, 1.0), fres = f1 * f1 * f1;
  // frame: mullions every 2 degrees, heavy ribs every 24, rails, cap and stone plinth
  float cellM = ${(u*r/180).toFixed(3)};
  float am = vTh / ${u.toFixed(6)} * 180.0;
  float dm = (0.5 - abs(fract(am) - 0.5)) * cellM;
  float dM = (0.5 - abs(fract(am / 12.0) - 0.5)) * cellM * 12.0;
  float wv = max(0.7, px * 0.46);
  float mull = (1.0 - smoothstep(wv, wv + px, dm)) * (1.0 - smoothstep(10.0, 30.0, px));
  float rib = 1.0 - smoothstep(max(4.0, px * 0.7), max(4.0, px * 0.7) + px, dM);
  float dh = min(abs(vH - 100.0), abs(vH - 200.0));
  float rail = (1.0 - smoothstep(wv, wv + px, dh)) * (1.0 - smoothstep(12.0, 36.0, px));
  float cap = smoothstep(${G-9}.0 - px, ${G-7}.0, vH);
  float plinth = 1.0 - smoothstep(9.0, 10.0 + px, vH);
  // glazing bars: every pane is leaded into four by five lights; seen on the near stretch of wall, lost in the distance
  float gbx = (0.5 - abs(fract(am * 4.0) - 0.5)) * cellM * 0.25, gby = (0.5 - abs(fract(vH / 20.0) - 0.5)) * 20.0;
  float gbw = max(0.26, px * 0.4);
  float bars = (1.0 - smoothstep(gbw, gbw + px, min(gbx, gby))) * (1.0 - smoothstep(1.7, 4.6, px));
  float frame = clamp(max(max(max(mull * 0.85, bars * 0.7), rib), max(rail * 0.85, max(cap, plinth))), 0.0, 1.0);
  vec3 frameC = uPale * 0.74 * (uSunCol * (0.3 + 0.8 * (1.0 - sunSide)) * day + uAmb * 1.0);
  // panes
  vec2 pid = vec2(floor(am), floor(vH / 100.0));
  float ph = hash12(pid + 3.0);
  vec3 glass = uSpace * 0.25 + mix(uHaze, uPale, 0.5) * (0.10 + 0.9 * fres) * (0.8 + 0.4 * ph) * (0.3 + 0.7 * day);
  float a = 0.07 + 0.62 * fres;
  // the sun behind the sunward wall: a core that blooms, a golden fall-off round it, and plain dark glass with stars everywhere else
  float sd = max(dot(-V, uGlowDir), 0.0), sd2 = sd * sd, sd4 = sd2 * sd2, sd16 = sd4 * sd4 * sd4 * sd4, sd64 = sd16 * sd16 * sd16 * sd16;
  float core = sd64 * sd64 * sd64 * sd64 * sd64 * sd64, halo = sd64, skirt = sd4 * sd4, wide = sd16 * sd4 * sd4;
  // (the glass is old and a little dusty: each light passes its own share, and the dust shows as soft vertical streaks in the glow)
  float lightId = hash12(vec2(floor(am * 4.0), floor(vH / 20.0)) + 9.0);
  float dust = 0.72 + 0.56 * vnoise(vec3(am * 5.0, vH * 0.035, 3.0)) * (0.6 + 0.4 * vnoise(vec3(am * 37.0, vH * 0.21, 11.0)));
  float sunK = sunSide * uGlowAmt * (0.8 + 0.2 * ph) * mix(1.0, 0.82 + 0.3 * lightId, 1.0 - smoothstep(1.7, 4.6, px));
  glass += uWarm * uSunCol * (7.0 * core + 1.6 * halo + (0.22 * skirt + 0.55 * wide) * dust) * sunK;
  a += clamp(core + 0.85 * halo + (0.22 * skirt + 0.4 * wide) * dust, 0.0, 0.92) * sunK;
  frameC *= 1.0 - 0.62 * clamp(halo + 0.8 * wide + 0.45 * skirt, 0.0, 1.0) * sunSide * uGlowAmt;      // against the glow the frame is a dark tracery
  // panes that catch the sun: slow travelling glints
  float gl = smoothstep(0.972, 1.0, fract(ph * 7.31 + uTime * 0.05 + vTh * 0.8)) * (1.0 - smoothstep(8.0, 40.0, px));
  gl *= smoothstep(0.0, 0.5, fract(vH / 100.0)) * (1.0 - smoothstep(0.5, 1.0, fract(vH / 100.0))) * (1.0 - abs(fract(am) - 0.5) * 2.0);
  glass += (uWarm * 2.0 + 2.0) * gl * day; a += gl * 0.6;
  vec3 col = mix(glass, frameC, frame);
  a = mix(a, 0.96, frame);
  ${ae}
  float air = 1.0 - exp(-pow(max(dist, 1.0) / 4200.0, 1.8));
  col = airAndFog(col, dist, day, fogD, fogC, fogF);
  a = clamp(a + air * 0.55, 0.0, 1.0);
  gl_FragColor = vec4(col, a);
}`,Ge=`
#include <common>
#include <fog_pars_vertex>
attribute vec3 color; attribute vec2 aFx;      // aFx.x emissive strength, aFx.y position along a spoke (-1: none)
varying vec3 vC; varying vec3 vW; varying vec3 vN; varying vec2 vFx; varying float vLx;
void main(){
  vC = color; vFx = aFx; vLx = position.x;
  vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,We=`
#include <common>
#include <fog_pars_fragment>
${oe}
uniform vec3 uWarm;
varying vec3 vC; varying vec3 vW; varying vec3 vN; varying vec2 vFx; varying float vLx;
void main(){
  vec3 N = normalize(vN);
  float nl = max(dot(N, uSunDir), 0.0);
  vec3 col = vC * (uSunCol * (0.25 + 0.85 * nl) + uAmb * (0.6 + 0.4 * N.y));
  // sun mirrors: a shimmering line of light along the hub
  float shim = 0.8 + 0.2 * sin(vLx * 0.05 - uTime * 0.7) + 0.25 * uProgress;
  col += vC * vFx.x * shim;
  float jw = fwidth(vFx.y * 90.0);
  float joint = step(0.0, vFx.y) * (1.0 - smoothstep(0.06, 0.06 + jw, abs(fract(vFx.y * 90.0) - 0.5))) * (1.0 - smoothstep(0.12, 0.4, jw));
  col *= 1.0 - 0.16 * joint;
  // climbing elevator lights
  float along = max(vFx.y, 0.0);
  float bead = pow(max(1e-4, 1.0 - abs(fract(along * 5.0 - uTime * 0.035) - 0.5) * 2.0), 50.0) * step(0.0, vFx.y);
  col += uWarm * 6.0 * bead;
  ${ae}
  float dist = distance(cameraPosition, vW);
  vec3 outC = airAndFog(col, dist, 1.0, fogD, fogC, fogF);
  outC += (vC * vFx.x * shim + uWarm * 6.0 * bead) * 0.45;      // lights carry through the haze
  gl_FragColor = vec4(outC, 1.0);
}`;function W(b,S,P,d,K){const z=b/r,H=Math.cos(z),k=Math.sin(z),X=r-P;d.set(S,r-X*H,X*k),K.set(0,H,-k)}async function He(b,S={}){const P=b.rng,d=(e=0,o=1)=>e+(o-e)*P(),K=(S.palette&&S.palette.length>=7?S.palette:Pe).map(e=>new t.Color(e)),[z,H,k,X,we,ye,$]=K,Y=S.openArc??500,re=S.openFade??150,_=()=>P()<.5?-1:1,le=[[d(95,135)*_(),P()<.5?2:3],[d(35,55)*_(),5+Math.floor(P()*3)],[d(10,18)*_(),11+Math.floor(P()*5)]],x=e=>{const o=e/r;let a=0;for(const[l,s]of le)a+=l*Math.sin(s*o);return a},be=e=>x(e)-110,se=S.shadeCentre??d(2,2.5),Se=S.cloudCover??d(.3,.5),Q=[];for(let e=0;e<8;e++){const o=.55+(e+d(.15,.85))/8*(u-1.1),a=o*r,l=xe(x(a)+_()*d(110,300),-440,440);Q.push({s:a,x:l,th:o})}const Z=new Uint8Array(4096*64);for(let e=0;e<Z.length;e++)Z[e]=Math.floor(P()*256),(e&65535)===65535&&await b.yield?.();const T=new t.Data3DTexture(Z,64,64,64);T.format=t.RedFormat,T.type=t.UnsignedByteType,T.minFilter=T.magFilter=t.LinearFilter,T.wrapS=T.wrapT=T.wrapR=t.RepeatWrapping,T.unpackAlignment=1,T.needsUpdate=!0;const q={uNoise:{value:T},uTime:{value:0},uProgress:{value:0},uHaze:{value:H.clone().multiplyScalar(.8)},uHazeFar:{value:H.clone().lerp(k,.35).multiplyScalar(.9)},uSunDir:{value:new t.Vector3(-.82,.5,.28).normalize()},uSunCol:{value:new t.Color(1.2,1.02,.8)},uAmb:{value:new t.Color(.15,.23,.42)},uShade:{value:se},uFogMax:{value:S.fogMax??.15},uGlowDir:{value:new t.Vector3(-.96,.19,-.2).normalize()},uGlowAmt:{value:1}},J=()=>t.UniformsUtils.clone(t.UniformsLib.fog),R=new t.Group;R.name="ArchOfTheWorld";let ie=null;{const a=(Y-20)/r,l=u-a,s=new Float32Array(321*9*3),g=new Float32Array(321*9),w=[];let i=0;for(let c=0;c<=320;c++){const f=E(a,l,c/320),h=Math.cos(f),v=Math.sin(f);for(let m=0;m<=8;m++,i++)s[i*3]=(m/8-.5)*p,s[i*3+1]=r-r*h,s[i*3+2]=r*v,g[i]=f}for(let c=0;c<320;c++)for(let f=0;f<8;f++){const h=c*9+f,v=h+8+1;w.push(h,h+1,v,h+1,v+1,v)}const n=new t.BufferGeometry;n.setAttribute("position",new t.BufferAttribute(s,3)),n.setAttribute("aTheta",new t.BufferAttribute(g,1)),n.setIndex(w),n.boundingSphere=new t.Sphere(new t.Vector3(0,r,0),r+p);const F=new t.ShaderMaterial({vertexShader:ke,fragmentShader:Ae,fog:!0,side:t.DoubleSide,transparent:!0,uniforms:{...J(),...q,uGreen:{value:X.clone().multiplyScalar(.95)},uWater:{value:we},uTan:{value:ye.clone().multiplyScalar(.8)},uWarm:{value:$},uPale:{value:k},uSeed:{value:new t.Vector3(d(.5,9),d(.5,9),d(.5,9))},uRiver:{value:le.map(([c,f])=>new t.Vector4(c,f,0,0))},uVillage:{value:Q.map(c=>new t.Vector3(c.x,-r*Math.cos(c.th),r*Math.sin(c.th)))},uOpen:{value:Y},uOpenFade:{value:re},uCloud:{value:Se}}}),y=new t.Mesh(n,F);y.name="ringLand",y.renderOrder=1,R.add(y),ie=F}await b.yield?.();{const a=[],l=[],s=[],g=[],w=[];for(let y=-1;y<=1;y+=2){const c=a.length/3;for(let f=0;f<=360;f++){const h=f/360*u,v=Math.cos(h),m=Math.sin(h);for(let te=0;te<=3;te++){const pe=te/3*G,ge=r-pe;a.push(y*p*.5,r-ge*v,ge*m),l.push(-y,0,0),s.push(h),g.push(pe)}}for(let f=0;f<360;f++)for(let h=0;h<3;h++){const v=c+f*4+h,m=v+3+1;w.push(v,v+1,m,v+1,m+1,m)}}const i=new t.BufferGeometry;i.setAttribute("position",new t.Float32BufferAttribute(a,3)),i.setAttribute("normal",new t.Float32BufferAttribute(l,3)),i.setAttribute("aTheta",new t.Float32BufferAttribute(s,1)),i.setAttribute("aH",new t.Float32BufferAttribute(g,1)),i.setIndex(w),i.boundingSphere=new t.Sphere(new t.Vector3(0,r,0),r+p);const n=new t.ShaderMaterial({vertexShader:Ne,fragmentShader:qe,fog:!0,side:t.DoubleSide,transparent:!0,depthWrite:!1,uniforms:{...J(),...q,uPale:{value:k},uWarm:{value:$},uSpace:{value:z}}}),F=new t.Mesh(i,n);F.name="ringGlass",F.renderOrder=3,R.add(F)}await b.yield?.();const ee=[],C=(e,o,a=0,l=null)=>{const s=e.index?e.toNonIndexed():e;s!==e&&e.dispose();const g=s.attributes.position.count,w=new Float32Array(g*3),i=new Float32Array(g*2);for(let n=0;n<g;n++)w[n*3]=o.r,w[n*3+1]=o.g,w[n*3+2]=o.b,i[n*2]=a,i[n*2+1]=l?l(s.attributes.position,n):-1;s.setAttribute("color",new t.BufferAttribute(w,3)),s.setAttribute("aFx",new t.BufferAttribute(i,2)),s.deleteAttribute("uv"),ee.push(s)},D=k.clone().multiplyScalar(.66),L=k.clone().lerp(z,.45).multiplyScalar(.6),ne=$.clone().lerp(new t.Color(1,1,1),.45),De=new t.Vector3(0,r,0),ce=new t.Matrix4,j=new t.Quaternion,O=new t.Vector3,fe=new t.Vector3(1,1,1),he=new t.Vector3(0,1,0),Fe=new t.Vector3,de=new t.Vector3,I=(e,o,a,l,s,g=6,w=1,i=!1,n=0)=>{const F=Fe.copy(o).sub(e),y=F.length(),c=new t.CylinderGeometry(l,a,y,g,w,!0);j.setFromUnitVectors(he,F.normalize()),O.copy(e).add(o).multiplyScalar(.5);const f=c.toNonIndexed();c.dispose();let h=null;if(i){const v=f.attributes.position;h=new Float32Array(v.count);for(let m=0;m<v.count;m++)h[m]=v.getY(m)/y+.5}f.applyMatrix4(ce.compose(O,j,fe)),C(f,s,n,h?(v,m)=>h[m]:null)};{const e=new t.CylinderGeometry(11,11,p+60,14,1,!1);e.rotateZ(Math.PI/2),e.translate(0,r,0),C(e,L);for(let o=0;o<=12;o++){const a=new t.TorusGeometry(19,5,6,14);a.rotateY(Math.PI/2),a.translate(-p/2+o/12*p,r,0),C(a,D),o%5===4&&await b.yield?.()}await b.yield?.();for(let o=0;o<24;o++)for(let a=0;a<4;a++){const l=new t.BoxGeometry(44,2.5,30),s=a/4*u+o%2*.785+d(-.08,.08);l.rotateZ(d(-.12,.12)),l.translate(0,34,0),l.rotateX(s),l.translate(-p/2+25+o/23*(p-50),r,0),C(l,ne,d(3.6,5.2)),a===3&&o%8===7&&await b.yield?.()}await b.yield?.();for(const o of[-1,1]){const a=new t.TorusGeometry(64,11,8,28);a.rotateY(Math.PI/2),a.translate(o*p/2,r,0),C(a,D);const l=new t.SphereGeometry(30,14,8);l.scale(1.6,1,1),l.translate(o*(p/2+28),r,0),C(l,L);const s=new t.TorusGeometry(r-G,5.5,6,180);s.rotateY(Math.PI/2),s.translate(o*(p/2-14),r,0),C(s,D);const g=new t.TorusGeometry(r-5,7,5,180);g.rotateY(Math.PI/2),g.translate(o*(p/2-4),r,0),C(g,L);const w=d(0,u);for(let i=0;i<6;i++){const n=w+i/6*u,F=Math.cos(n),y=Math.sin(n),c=o*(p/2-14);de.set(c,r-64*F,64*y),I(O.set(c,r-(r-G)*F,(r-G)*y).clone(),de.clone(),3.6,2.2,D,6,1)}await b.yield?.()}}await b.yield?.();const B=[],ve=(typeof S.nearSpoke=="function"?S.nearSpoke(x):S.nearSpoke)??{s:-225,x:120};B.push({s:ve.s,x:ve.x});for(let e=0;e<4;e++){const o=.75+(e+d(.2,.8))/4*(u-1.5),a=o*r;B.push({s:a,x:xe(x(a)+_()*d(120,330),-470,470)})}const V=new t.Vector3,A=new t.Vector3,N=new t.Vector3;for(const e of B){W(e.s,e.x,0,V,N),e.foot=V.toArray(),A.set(e.x,r,0).addScaledVector(N,-14),I(V.clone(),A.clone(),4.6,2.6,D,6,24,!0),W(e.s,e.x,46,A,N),I(V.clone(),A.clone(),17,6,D,10,2),W(e.s,e.x,58,A,N);const o=new t.SphereGeometry(9,10,6);o.scale(1,1.5,1),j.setFromUnitVectors(he,N),o.applyMatrix4(ce.compose(A,j,fe)),C(o,ne,.32);for(let a=0;a<3;a++){const l=a/3*u+.4;W(e.s+Math.cos(l)*90,e.x+Math.sin(l)*90,0,A,N),W(e.s,e.x,260,O,N),I(A.clone(),O.clone(),.9,.9,L,4,1)}}let ue=0;{const e=Me(ee,!1);ee.forEach(l=>l.dispose()),e.boundingSphere=new t.Sphere(new t.Vector3(0,r,0),r+p),ue=e.attributes.position.count/3;const o=new t.ShaderMaterial({vertexShader:Ge,fragmentShader:We,fog:!0,side:t.DoubleSide,uniforms:{...J(),...q,uWarm:{value:$}}}),a=new t.Mesh(e,o);a.name="ringStructure",a.renderOrder=2,R.add(a)}await b.yield?.();const Te=(e,o=0,a=0,l=new t.Vector3,s=new t.Vector3)=>(W(e,o,a,l,s),{position:l,up:s}),M=(e,o,a)=>(W(e,o,a,V,N),V.toArray()),me=[];for(let e=0;e<=8;e++){const o=e/8,a=E(-450,450,o),l=o<.5?E(20,80,Math.sin(o*Math.PI)):E(15,80,Math.sin(o*Math.PI));me.push(M(a,x(a)*(1-.5*Math.sin(o*Math.PI)),l))}const U=1.22*r,Ce={ringCentre:[0,r,0],ringRadius:r,ringWidth:p,wallHeight:G,openArc:Y,openFade:re,portalSeat:{position:M(450,x(450),9),facing:[0,0,-1],up:[0,1,0],s:450},flyThrough:me,archPoi:M(U,x(U),0),overhead:[x(Math.PI*r),2*r,0],viewpoints:[{position:M(0,0,80),look:M(U,x(U),0),note:"mid-path, gaze 35 degrees up the arch"},{position:M(-430,x(-430),22),look:M(900,x(900),0),note:"entry, valley that keeps climbing"},{position:M(300,x(300),30),look:M(1500,x(1500),0),note:"descent, land rising like a wave behind the aqueduct"}],spokes:B.map(e=>({s:e.s,x:e.x,foot:e.foot})),villages:Q.map(e=>({s:e.s,x:e.x})),shadeCentre:se,sunDir:q.uSunDir.value.toArray()};return{object:R,radius:170,height:-560,center:new t.Vector3(0,520,0),anchors:Ce,uniforms:q,ringPoint:Te,riverX:x,monorailX:be,landMaterial:ie,triangles:Math.round(ue+320*8*2+360*3*4),setProgress(e){const o=(e-.45)/.3;q.uProgress.value=Math.exp(-o*o)},update(e,o){q.uTime.value=o},dispose(){T.dispose()},ground:!1,groundY:0}}export{He as buildHero};
