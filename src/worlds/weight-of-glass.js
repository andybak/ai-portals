import*as a from"three";import{makePath as Ft}from"../kit/core.js";import{buildHero as Bt,HIPS as Te,STRIDE as ze,SEA_BARS_GLSL as Nt,VEIL_GLSL as _t}from"../parts/weight-of-glass.js";const Lt=["#CBC7C0","#E9D58A","#C2386A","#2B2F86","#2D9CC9","#5DBF8F","#15161B"],Ae=i=>new a.Color(i),R=(i,x,g)=>{const u=Math.min(1,Math.max(0,(g-i)/(x-i)));return u*u*(3-2*u)},Mt=`
float h21(vec2 p) { p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
float vn(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm3(vec2 p) { return vn(p) * 0.55 + vn(p * 2.13 + 7.1) * 0.29 + vn(p * 4.31 + 3.7) * 0.16; }
`,zt=`
float mistSeg(vec3 eye, vec3 P) {
  vec3 d = P - eye; float len = length(d), py = abs(P.y);
  float T = 9.0 + 0.034 * length(d.xz);                    // the top of the layer as seen from here: it stands taller with distance
  float y0 = min(eye.y, py), y1 = max(eye.y, py), dy = y1 - y0;
  float inside = max(min(y1, T) - min(y0, T), 0.0);
  float frac = dy > 0.01 ? clamp(inside / max(dy, 0.01), 0.0, 1.0) : 1.0 - step(T, y0);
  float band = 1.0 - smoothstep(0.55 * T, 1.05 * T, py);  // a clean top: what stands above the band is clear
  return (1.0 - exp(-max(len * frac - 35.0, 0.0) / 120.0)) * band;
}
`,Kt="varying vec3 vD; void main() { vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",qt=`
uniform vec3 uSunDir, uZen, uHor, uVeilC, uPatch, uMistC; uniform float uTime, uMist, uVeilAmt;
varying vec3 vD;
${Mt}
${_t}
void main() {
  vec3 d = normalize(vD + vec3(0.0, 1e-4, 0.0)); float y = abs(d.y);
  vec3 c = mix(uHor, uZen, smoothstep(0.0, 0.6, y));
  // the faintest slow marbling of the overcast, so the dome is alive but never shows a cloud edge
  vec2 sp = d.xz / (y + 0.35);
  float mar = fbm3(sp * 1.6 + vec2(uTime * 0.012, -uTime * 0.008)) - 0.5;
  float mar2 = 0.6 * vn(sp * 3.4 - vec2(uTime * 0.012, uTime * 0.008) + 4.0) + 0.4 * vn(sp * 1.3 + vec2(uTime * 0.006, 2.0)) - 0.5;        // and broad slow shoals of lighter and darker overcast
  c *= (1.0 + 0.06 * mar + 0.24 * mar2 * smoothstep(0.1, 0.5, y)) * (1.0 - 0.09 * smoothstep(0.55, 1.0, y));    // a little darker still straight overhead
  float s = max(dot(vec3(d.x, y, d.z), uSunDir), 0.0);
  c += uPatch * s * s * s;
  // the rain band (VEIL_GLSL, shared with the glass): a dark deck with a flat base, curtains hanging from it to the sea,
  // gaps of light between them and a little more light under the deck where no rain falls
  vec2 rb = rainBand(d, uTime);
  vec2 hh = d.xz / max(length(d.xz), 1e-3);
  float st = rbN(vec2(y * 30.0 + 2.5 * rbN(hh * 1.6 + 2.0), dot(hh, vec2(1.3, 0.9)) * 1.4 + uTime * 0.004)) - 0.5;      // long level shoals of stratus above the band
  c *= 1.0 - 0.10 * st * smoothstep(0.07, 0.20, y) * (1.0 - smoothstep(0.42, 0.85, y));
  c = mix(c, uVeilC * mix(0.98, 0.88, rb.y), 0.94 * rb.x * uVeilAmt);
  // sea mist (a seeded look): a white band that swallows the horizon
  c = mix(c, uMistC, 0.4 * (1.0 - uMist) * (1.0 - smoothstep(0.002, 0.013, y)));    // a thin pale line of haze between the dark band and the dark far sea: the band's sharp lower edge
  c = mix(c, uMistC, uMist * (1.0 - smoothstep(0.034, 0.078, y)));
  c *= 1.0 - 0.14 * step(d.y, 0.0);                        // the half the sea mirrors: water gives back a little less than it is shown
  gl_FragColor = vec4(c, 1.0);
}`,Ht="varying vec3 vW; void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",Ut=`
uniform float uTime; uniform vec3 uHor, uZen, uSunDir, uSand, uDeep, uMistC; uniform float uMist;
uniform vec4 uRings[8]; uniform vec4 uWind, uGust;       // xz centre, age (s), strength
varying vec3 vW;
${Mt}
${Nt}
${zt}
void main() {
  vec3 Vv = cameraPosition - vW; float d = max(length(Vv), 1e-3); vec3 V = Vv / d;
  float up = clamp(abs(V.y), 0.0, 1.0);
  vec2 p = vW.xz;
  float fw = max(fwidth(p.x) + fwidth(p.y), 1e-4);        // metres per pixel on the sand
  // depth 0.2..1.5 m: broad bars and channels, read from height as well as from the deck
  // a tidal flat: long sand bars barely awash and slate channels between them, sweeping in roughly parallel curves;
  // small runnels (chan) fret the edges of the bars
  float bars = seaBars(p), chan = fbm3(p * 0.035 + vec2(bars * 2.0, 11.0));
  float dn = bars + 0.10 * (chan - 0.5) * (1.0 - smoothstep(1.5, 6.0, fw));
  float lodB = 1.0 - smoothstep(10.0, 36.0, fw);
  float deepT = mix(0.5, smoothstep(0.465, 0.515, dn), lodB);       // 0 on a bar .. 1 in a channel
  float deepM = mix(0.3, smoothstep(0.53, 0.82, dn), lodB);       // the bed of the channel: the second, darker opal tone
  // rippled sand: wavy crests about 1.4 m apart, a finer set across them; each fades out before it would alias
  float wob = 1.7 * sin(p.y * 0.23 + bars * 5.0) + 1.1 * sin(p.x * 0.11);
  float r1 = sin(p.x * 4.4 + wob * 2.2 + chan * 9.0);
  float r2 = sin(p.y * 9.0 + 1.3 * sin(p.x * 0.9) + bars * 14.0);
  float r3 = sin((p.x + p.y) * 0.9 + wob);
  float r4 = sin(p.x * 1.75 + wob * 1.4 + chan * 6.0 + 0.8 * sin(p.y * 0.35));
  float ripple = 0.55 * r1 * (1.0 - smoothstep(0.25, 0.7, fw)) + 0.25 * r2 * (1.0 - smoothstep(0.12, 0.35, fw)) + 0.4 * r4 * (1.0 - smoothstep(0.6, 1.7, fw)) + 0.4 * r3 * (1.0 - smoothstep(1.4, 4.0, fw));
  // the shallowest bars: paler sand barely awash, with a darker wet line where each one shelves away
  float bar = 1.0 - smoothstep(0.26, 0.40, dn), lip = (1.0 - smoothstep(0.0, 0.016, abs(dn - 0.46))) * (1.0 - smoothstep(3.0, 9.0, fw));
  // megaripples on the bars, read from the air: crests square to the run of the bar, their troughs holding slate water
  float aB = 0.80 * p.x + 0.60 * p.y;
  float mr = sin(aB * 1.05 + 2.4 * sin((p.y * 0.8 - p.x * 0.6) * 0.06) + chan * 5.0);
  float mega = (0.5 - 0.5 * mr) * (1.0 - deepT) * smoothstep(0.12, 0.5, fw) * (1.0 - smoothstep(1.6, 4.5, fw));
  // the caustic net: two drifting cell patterns multiplied, bright threads on the sand
  vec2 q = p * 0.55 + vec2(uTime * 0.55, uTime * 0.36);
  float n1 = abs(vn(q) - 0.5), n2 = abs(vn(q * 1.7 - vec2(uTime * 0.66, 3.0)) - 0.5);
  float net = (1.0 - smoothstep(0.0, 0.11, n1 + n2 * 0.6)) * (1.0 - smoothstep(0.5, 1.4, fw));
  vec2 q2 = p * 0.12 + vec2(uTime * 0.28, -uTime * 0.18);
  float m1 = abs(vn(q2) - 0.5), m2 = abs(vn(q2 * 1.9 + vec2(4.0, uTime * 0.36)) - 0.5);
  net += 0.9 * (1.0 - smoothstep(0.0, 0.12, m1 + m2 * 0.6)) * smoothstep(0.3, 1.2, fw) * (1.0 - smoothstep(2.5, 7.0, fw));
  vec3 sand = uSand * (1.0 + 0.26 * ripple) * (1.0 + 0.36 * net) * (1.06 - 0.16 * chan) * (1.0 + 0.09 * bar - 0.10 * lip);
  vec3 col = mix(sand, (uDeep * 1.45 + vec3(0.0, 0.012, 0.010)) * (1.0 + 0.10 * net), 0.06 + 0.80 * deepT);     // shelving blue-green at a channel's edge
  col = mix(col, uDeep * 0.92, 0.75 * deepM);
  col = mix(col, uDeep * 1.15, 0.30 * mega);
  // ring sources from the waders' pads: three crests spreading at 3.2 m/s and thinning
  float ring = 0.0;
  for (int i = 0; i < 8; i++) {
    vec4 R = uRings[i];
    float rr = length(p - R.xy), front = R.z * 3.2;
    float w = sin((rr - front) * 2.4) * exp(-abs(rr - front + 2.0) * 0.32) * step(rr, front + 1.0);
    ring += w * R.w * exp(-R.z * 0.33) / (1.0 + 0.04 * rr);
  }
  // the slow swell tilts the mirror: bands of brighter and darker reflection sliding over the surface
  float swell = sin(p.x * 0.07 + p.y * 0.045 + uTime * 0.5) * 0.6 + sin(p.y * 0.13 - p.x * 0.05 - uTime * 0.37) * 0.4;
  float chop = (vn(p * 0.8 + vec2(uTime * 0.35, -uTime * 0.2)) - 0.5) * (1.0 - smoothstep(0.5, 2.5, fw));
  // cat's-paws: the same gust fronts that bow the reeds ruffle the water, darker and less of a mirror, and run on
  float along = dot(p, uWind.xy);
  float g1 = sin(along * 0.021 - uTime * 0.55 + 1.3 * sin(dot(p, vec2(-uWind.y, uWind.x)) * 0.013));
  float paw = smoothstep(0.45, 0.70, g1) * uWind.w * (0.75 + 0.25 * fbm3(p * 0.03 + uWind.xy * uTime * 0.4)) + 0.45 * uWind.z;
  paw += uGust.w * (1.0 - smoothstep(0.35 * uGust.z, uGust.z, distance(p, uGust.xy)));
  float ruffle = 0.6 + 0.4 * vn(p * 1.1 + uWind.xy * uTime * 2.4) * (1.0 - smoothstep(0.6, 2.0, fw));
  // in a gale the wind lays long streaks down the water and drives them on (steady wind only: uWind.z)
  float crossW = dot(p, vec2(-uWind.y, uWind.x));
  float wstr = vn(vec2(crossW * 0.075, along * 0.011 - uTime * 0.55)) * 0.65 + vn(vec2(crossW * 0.21 + 3.0, along * 0.027 - uTime * 1.1)) * 0.35;
  paw += 1.1 * uWind.z * (wstr - 0.5) * (1.0 - smoothstep(6.0, 22.0, fw));
  col = mix(col, uDeep * 1.2, 0.55 * clamp(paw, 0.0, 1.0) * ruffle);
  col *= 1.0 + 0.42 * uWind.z * (wstr - 0.5) * (1.0 - smoothstep(6.0, 22.0, fw));      // the streaks themselves, lighter and darker       // a ruffled patch loses the mirror and shows the water's own slate: dark fronts running over the flat
  float tilt = 0.035 * swell + 0.05 * chop + 0.2 * ring;
  float upT = clamp(up + tilt, 0.0, 1.0);
  col *= 1.0 + (0.2 + 0.3 * smoothstep(0.04, 0.3, fw)) * ring + 0.03 * swell;     // rings stay readable from the crown
  // seen flat, a bar is a pale mirror of the sky and a channel keeps most of its own slate: the flat has values at any height
  float a = mix(mix(0.36, 0.60, deepT), 0.94, smoothstep(0.03, 0.45, upT)); a = min(1.0, a + 0.5 * clamp(paw, 0.0, 1.0));
  // sheen of the bright patch where the surface tilts toward it
  vec3 Rv = reflect(-V, normalize(vec3(tilt * 1.5, 1.0, tilt)));
  float sd = max(dot(Rv, uSunDir), 0.0); float s2 = sd * sd; s2 *= s2; s2 *= s2; s2 *= s2;
  col += uHor * 0.35 * s2 * s2;
  // distance: the sand and the tint go to the pearl veil, the mirror takes over
  float far = 1.0 - exp(-d / 1300.0);
  col = mix(col, mix(uDeep, uHor, 0.2) * 0.62, far);       // the far sea is a dark band under the horizon
  a = mix(a, 0.86, far);
  // white only where the sight line runs along the water: a band on the horizon, clear from height. The mist lies in
  // wisps that drift down the wind, thinning and thickening over the flat
  float wisp = 1.0 + 0.7 * (vn(p * 0.013 - uWind.xy * uTime * 0.27) - 0.6) * (1.0 - smoothstep(30.0, 120.0, fw));
  float mi = min(0.92 * uMist * mistSeg(cameraPosition, vW) * wisp, 0.96);
  col = mix(col, uMistC, mi);
  a = mix(a, 1.0, mi);
  gl_FragColor = vec4(col, a);
}`,Ot=`
uniform sampler2D uRamp; uniform vec3 uSunDir, uLine; uniform float uVeil, uGlint, uPix;
uniform float uMist;
varying vec3 vWN; varying vec3 vWP; varying vec4 vK;
#ifdef GLIDER
varying vec2 vG;
#endif
${zt}
void main() {
  vec3 n = normalize(vWN + vec3(0.0, 1e-5, 0.0));
  vec3 Vv = cameraPosition - vWP; float dist = max(length(Vv), 1e-3); vec3 V = Vv / dist;
  float ndv = abs(dot(n, V)), flat_ = step(vK.y, -0.001), body = abs(vK.y);
  float veil = 1.0 - exp(-dist / uVeil) * (1.0 - 0.92 * uMist * mistSeg(cameraPosition, vWP));
  vec3 col = texture2D(uRamp, vec2(clamp(vK.x, 0.0, 5.2) / 5.2, 0.5)).rgb;
  #ifdef REED
    // a clear rod is a lens: a pale bright core between two fine dark edges, and a brighter bead at its tip. Both walls
    // of the tube are drawn (two multiplies), so each carries the square root of the look.
    // (multiplies compound where reeds overlap, so the brightening is kept small and only for reeds near the lens)
    col = sqrt(col);                                        // both walls multiply: each carries the root of the band colour too
    float nearR = smoothstep(0.1, 0.55, (vK.z - 0.3) / 0.7), core = smoothstep(0.2, 0.8, ndv);
    col *= mix(mix(vec3(0.875, 0.89, 0.885), vec3(1.0) + vec3(0.07, 0.068, 0.06) * nearR, core), mix(vec3(0.80, 0.84, 0.83), vec3(1.0) + vec3(0.20, 0.195, 0.18) * nearR, core), body);
  #else
    col *= mix(uLine, vec3(1.0), max(flat_, clamp(smoothstep(0.04, mix(0.5, 0.26, body), ndv) * mix(1.0, 0.85, body) + mix(0.2, 0.15, body), 0.0, 1.0)));
  #endif
  float lw = max(0.05, 1.5 * uPix * dist);
  col *= mix(uLine, vec3(1.0), mix(0.35, 1.0, smoothstep(lw * 0.4, lw, vK.w)));
  #ifndef REED
    col *= mix(vec3(1.0), mix(vec3(0.90, 0.96, 0.92), vec3(0.80, 0.88, 0.84), flat_), body);
  #endif
  #ifdef GLIDER
    // a wing is a clear blade with a dark spar along its leading edge, fine veins raking back from it, and a bright rim
    // where the trailing edge and the tip catch the sky: it reads as a wing from above as well as from below
    if (flat_ > 0.5) {
      float gs = vG.x, gf = vG.y;
      float spar = 1.0 - smoothstep(0.0, 0.18, gf);
      float rib = (1.0 - smoothstep(0.0, 0.11, abs(fract(gs * 4.0 + 0.9 * gf) - 0.5))) * smoothstep(0.12, 0.3, gf) * (1.0 - smoothstep(22.0, 55.0, dist));
      float rim = clamp(smoothstep(0.78, 0.97, gf) + smoothstep(0.88, 1.0, gs), 0.0, 1.0);
      col *= mix(vec3(0.76, 0.84, 0.85), vec3(0.62, 0.71, 0.75), 0.6 * gs);
      col *= mix(vec3(1.0), uLine * 1.1, max(0.8 * spar, 0.4 * rib));
      col *= 1.0 + 0.5 * rim;
    }
  #endif
  vec3 R = reflect(-V, n);
  float fz = 1.0 - ndv, F = min(0.04 + 0.96 * fz * fz * fz, 0.5);
  float sd = max(dot(vec3(R.x, abs(R.y), R.z), uSunDir), 0.0);
  float s2 = sd * sd, s8 = s2 * s2 * s2 * s2, s32 = s8 * s8 * s8 * s8;
  col *= 1.0 + 0.22 * F * body + uGlint * 0.9 * s32 * s8 * (0.3 + 0.7 * body);
  col = mix(vec3(1.0), col, vK.z * (1.0 - veil));
  gl_FragColor = vec4(col, 1.0);
}`;function Ge(i,x,g={}){const u=new a.ShaderMaterial({uniforms:i,vertexShader:x,fragmentShader:Ot,defines:g,transparent:!0,depthWrite:!1,fog:!1,side:a.DoubleSide});return u.blending=a.CustomBlending,u.blendEquation=a.AddEquation,u.blendSrc=a.DstColorFactor,u.blendDst=a.ZeroFactor,u.blendSrcAlpha=a.ZeroFactor,u.blendDstAlpha=a.OneFactor,u}function Re(i,x,g,u,W){const e=new a.Mesh(g,u);if(e.frustumCulled=!1,e.renderOrder=12,i.add(e),W){const p=new a.Mesh(g,u);p.frustumCulled=!1,p.renderOrder=3,x.add(p)}return e}const At=`
attribute vec4 aD; attribute vec4 aI0; attribute vec4 aI1;
uniform float uTime, uPix; uniform vec4 uWind;     // wind: dir x, dir z, steady, gust gain
uniform vec4 uGust;                                // scripted gust: centre x, z, radius, strength
varying vec3 vWN; varying vec3 vWP; varying vec4 vK;
void main() {
  float t = aD.x, hgt = aI0.z;
  vec2 root = aI0.xy;
  // gust fronts: bands marching down the wind, plus the scripted one that runs along the path
  float along = dot(root, uWind.xy);
  float g1 = sin(along * 0.021 - uTime * 0.55 + 1.3 * sin(dot(root, vec2(-uWind.y, uWind.x)) * 0.013));
  float g2 = sin(along * 0.047 - uTime * 0.9 + aI0.w);
  float gust = smoothstep(0.35, 1.0, g1) * (0.75 + 0.25 * g2);
  float sg = uGust.w * (1.0 - smoothstep(0.35 * uGust.z, uGust.z, distance(root, uGust.xy)));
  float bend = clamp(uWind.z + uWind.w * gust + sg, 0.0, 1.6);
  float flutter = 0.06 * sin(uTime * (2.2 + 0.7 * fract(aI0.w)) + aI0.w * 7.0) * (0.3 + bend);
  float widen = 1.0;
  #ifdef REED
    float d0 = distance(cameraPosition, vec3(root.x, 1.0, root.y));
    widen = max(1.0, 1.25 * uPix * d0 / (0.035 * aI1.y));
  #endif
  vec3 p = vec3(position.x * aI1.y * widen, position.y * hgt, position.z * aI1.y * widen);
  #ifdef REED
    // the bead keeps a round look however far off: once the rod is widened to a pixel the bead grows taller with it
    p.y = hgt * min(position.y, 0.92) + max(position.y - 0.92, 0.0) / 0.08 * max(0.08 * hgt, 0.21 * widen * aI1.y);
  #endif
  vec3 nn = normal;
  #ifndef REED
    float ca = cos(aI1.x + 1.5708), sa = sin(aI1.x + 1.5708);     // blades face across their lean
    p.xz = vec2(p.x * ca - p.z * sa, p.x * sa + p.z * ca); nn.xz = vec2(nn.x * ca - nn.z * sa, nn.x * sa + nn.z * ca);
  #endif
  vec2 ld = vec2(cos(aI1.x), sin(aI1.x));
  float k = t * t;
  vec2 off = ld * aI1.z * k * hgt + uWind.xy * (bend + flutter) * aI1.w * k * hgt;
  p.xz += off; p.y -= 0.5 * dot(off, off) / max(hgt, 0.5) * t;
  vec4 wp = modelMatrix * vec4(p.x + root.x, p.y, p.z + root.y, 1.0);
  vWP = wp.xyz; vWN = mat3(modelMatrix) * nn;
  float root2 = (1.0 - t) * (1.0 - t);
  #ifdef REED
    // a short ladder of bands that climbs from the root with the bend and drains back
    float N = min(1.2 * bend, 0.90) * root2 * root2 * (1.0 - t) * (0.55 + 0.45 * abs(aD.y));     // straw, then one step of magenta, in the bottom fifth only
    vK = vec4(N, aD.z, mix(0.3, 1.0, 1.0 / widen) * mix(1.0, 0.22, smoothstep(55.0, 260.0, d0)), 999.0);
  #else
    float N = 3.4 * (bend * 0.8 + 0.12 + 1.15 * aI1.z) * root2 * (0.3 + 0.7 * abs(aD.y)) + 0.5 * bend * aD.z * t * abs(aD.y);   // a leaning blade is loaded at its root by its own weight: flushed there in any wind
    vK = vec4(N, 1.0, 1.0, aD.w * aI1.y);
  #endif
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;function Dt(i){const x=[],g=[],u=[],W=[];if(i==="reed")[[0,1,0],[.5,.8,0],[.92,.55,0],[.955,2.3,1],[.985,2.1,1],[1,.3,1]].forEach(([w,y,d],h)=>{for(let v=0;v<3;v++){const b=v/3*Math.PI*2;x.push(Math.cos(b)*y*.035,w,Math.sin(b)*y*.035),g.push(Math.cos(b),0,Math.sin(b)),u.push(w,[1,-1,0][v],d,999)}if(h)for(let v=0;v<3;v++){const b=(h-1)*3+v,I=(h-1)*3+(v+1)%3;W.push(b,I,I+3,b,I+3,b+3)}});else{const w=[-1,-.4,.4,1];for(let y=0;y<=12;y++){const d=y/12,h=(.3+.7*Math.sin(Math.PI*(.12+.6*d)))*(1-d*d*d)+.02;for(const v of w){x.push(v*h,d,.12*h*(1-v*v));const b=Math.hypot(v*.7,1);g.push(-v*.7/b,0,1/b),u.push(d,v,1,(1-Math.abs(v))*h)}if(y)for(let v=0;v<3;v++){const b=(y-1)*4+v;W.push(b,b+1,b+5,b,b+5,b+4)}}}const e=new a.InstancedBufferGeometry;return e.setAttribute("position",new a.Float32BufferAttribute(x,3)),e.setAttribute("normal",new a.Float32BufferAttribute(g,3)),e.setAttribute("aD",new a.Float32BufferAttribute(u,4)),e.setIndex(W),e}function $e(i,x,g,u){return i.setAttribute("aI0",new a.InstancedBufferAttribute(x.subarray(0,u*4),4)),g&&i.setAttribute("aI1",new a.InstancedBufferAttribute(g.subarray(0,u*4),4)),i.instanceCount=u,i}const Zt=`
attribute vec2 aD; attribute vec4 aI0;
uniform float uTime;
varying vec3 vWN; varying vec3 vWP; varying vec4 vK;
void main() {
  float r = aD.x, R = aI0.z, ph = aI0.w;
  vec2 c = aI0.xy + 1.2 * vec2(sin(uTime * 0.07 + ph), cos(uTime * 0.053 + ph * 1.7));
  float sw = sin(c.x * 0.07 + c.y * 0.045 + uTime * 0.5), bob = 0.05 * sin(uTime * 0.9 + ph * 3.0) + 0.04 * sw;
  vec2 tl = 0.07 * vec2(sin(uTime * 0.8 + ph * 5.0), cos(uTime * 0.67 + ph * 2.0));       // rocking
  vec3 p = vec3(position.x * R, position.y * R + 0.03 + bob + R * dot(position.xz, tl), position.z * R);
  vec4 wp = modelMatrix * vec4(p.x + c.x, p.y, p.z + c.y, 1.0);
  vWP = wp.xyz; vWN = mat3(modelMatrix) * normalize(normal + vec3(tl.x, 0.0, tl.y));
  float breathe = 0.80 + 0.20 * sin(uTime * 0.9 + ph * 3.0);
  float ring = exp(-(r - 0.36) * (r - 0.36) / 0.035);
  vK = vec4(breathe * ring + 0.35 * (1.0 - smoothstep(0.0, 0.12, r)), 1.0, mix(1.0, 0.25, smoothstep(40.0, 170.0, distance(cameraPosition, wp.xyz))), min((1.0 - r) * R, abs(r - 0.09) * R * 2.0 + 0.02));
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;function jt(){const i=[],x=[],g=[],u=[],e=[.09,.36,.62,.86,1];i.push(0,.2,0),x.push(0,1,0),g.push(0,0),e.forEach((w,y)=>{for(let d=0;d<10;d++){const h=d/10*Math.PI*2,v=.2*(1-w*w);i.push(Math.cos(h)*w,v,Math.sin(h)*w);const b=Math.hypot(w*.55,1);x.push(Math.cos(h)*w*.55/b,1/b,Math.sin(h)*w*.55/b),g.push(w,h);const I=(d+1)%10,k=1+y*10;y===0?u.push(0,k+I,k+d):u.push(k-10+d,k-10+I,k+I,k-10+d,k+I,k+d)}});const p=new a.InstancedBufferGeometry;return p.setAttribute("position",new a.Float32BufferAttribute(i,3)),p.setAttribute("normal",new a.Float32BufferAttribute(x,3)),p.setAttribute("aD",new a.Float32BufferAttribute(g,2)),p.setIndex(u),p}const $t=`
attribute vec4 aD; attribute vec4 aG;
uniform float uTime; uniform vec3 uGC, uGH; uniform vec2 uGS;   // flock centre, heading (unit, level), stream axis (unit xz)
varying vec3 vWN; varying vec3 vWP; varying vec4 vK; varying vec2 vG;
void main() {
  float ph = aG.w, cyc = uTime / 1.4 + ph, beat = sin(6.2832 * cyc);
  vG = vec2(aD.x, aD.w / (0.64 * (1.0 - 0.75 * aD.x * sqrt(max(aD.x, 0.0))) + 0.03)) * aD.z;      // span and chord fraction, for the blade's spar, veins and rim
  float flap = 0.62 * beat + 0.30, s = aD.x * 1.2;       // wings beat about a raised V, so a level lens always sees blade, not an edge
  vec3 p = position; vec3 nn = normal;
  if (aD.z > 0.5) {
    float ang = flap * (0.55 + 0.45 * aD.x), ca = cos(ang), sa = sin(ang);
    p.y = s * sa + position.y; p.z = aD.y * s * ca;
    nn = vec3(0.0, ca, -aD.y * sa);
  }
  p.y -= 0.16 * beat;                                             // the body rides against the wings
  vec3 H = uGH, S = vec3(-H.z, 0.0, H.x);
  vec3 wob = vec3(sin(uTime * 0.31 + ph * 9.0), sin(uTime * 0.43 + ph * 5.0), sin(uTime * 0.27 + ph * 13.0)) * vec3(2.2, 1.1, 2.2);
  vec3 c = uGC + vec3(uGS.x, 0.0, uGS.y) * aG.x + vec3(-uGS.y, 0.0, uGS.x) * aG.y + vec3(0.0, aG.z, 0.0) + wob;
  float roll = 0.45 * sin(uTime * 0.43 + ph * 5.0);
  p.yz = vec2(p.y * cos(roll) - p.z * sin(roll), p.y * sin(roll) + p.z * cos(roll));
  nn.yz = vec2(nn.y * cos(roll) - nn.z * sin(roll), nn.y * sin(roll) + nn.z * cos(roll));
  vec3 w = c + H * p.x + S * p.z + vec3(0.0, p.y, 0.0);
  vec4 wp = modelMatrix * vec4(w, 1.0);
  vWP = wp.xyz; vWN = mat3(modelMatrix) * (H * nn.x + S * nn.z + vec3(0.0, nn.y, 0.0));
  // the flash: 0.3 s at the top of each downstroke, straw on the way up the ramp and magenta at the peak
  float f = fract(cyc - 0.22), fl = smoothstep(0.0, 0.07, f) * (1.0 - smoothstep(0.12, 0.28, f));
  float root = (1.0 - aD.x) * (0.35 + 0.65 * (1.0 - aD.x));       // the inner half of each wing takes the colour
  vK = vec4((0.07 + 0.93 * fl * root) * aD.z + 0.5 * fl * (1.0 - aD.z), mix(0.9, -0.9, aD.z), 1.0, aD.w * 0.6);   // w scaled: a broader leading-edge line
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;function Xt(){const i=[],x=[],g=[],u=[];[[.95,.012],[.55,.075],[-.35,.06],[-.95,.012]].forEach(([p,w],y)=>{for(let d=0;d<3;d++){const h=d/3*Math.PI*2+.52;i.push(p,Math.sin(h)*w,Math.cos(h)*w),x.push(0,Math.sin(h),Math.cos(h)),g.push(0,0,0,999)}if(y)for(let d=0;d<3;d++){const h=(y-1)*3+d,v=(y-1)*3+(d+1)%3;u.push(h,v,v+3,h,v+3,h+3)}});for(const p of[-1,1]){const w=i.length/3,y=5;for(let d=0;d<=y;d++){const h=d/y,v=.36-.55*h*h,b=.64*(1-.75*h*Math.sqrt(h))+.03;for(let I=0;I<3;I++){const k=I/2;i.push(v-b*k,.03*Math.sin(Math.PI*k),p*h*1.2),x.push(0,1,0),g.push(h,p,1,b*k)}if(d)for(let I=0;I<2;I++){const k=w+(d-1)*3+I;u.push(k,k+1,k+4,k,k+4,k+3)}}}const e=new a.InstancedBufferGeometry;return e.setAttribute("position",new a.Float32BufferAttribute(i,3)),e.setAttribute("normal",new a.Float32BufferAttribute(x,3)),e.setAttribute("aD",new a.Float32BufferAttribute(g,4)),e.setIndex(u),e}const Yt=`
attribute vec2 aD; attribute vec4 aI0; attribute vec4 aI1;
uniform float uTime;
varying vec3 vWN; varying vec3 vWP; varying vec4 vK;
void main() {
  float s = aD.x, R = max(aI0.z, 4.0), ph = aI0.w;
  float ang = ph + uTime * aI1.x / R - s * aI1.y / R * sign(aI1.x);
  float und = sin(s * 7.0 - uTime * 3.1 + ph * 4.0) * (0.15 + 0.85 * s);
  float rad = R + 0.55 * und + aD.y * aI1.z * (1.0 - 0.75 * s * s) * (0.35 + 0.65 * smoothstep(0.0, 0.12, s));
  float y = 0.16 + 0.10 * cos(s * 7.0 - uTime * 3.1 + ph * 4.0) * aD.y + 0.05 * sin(uTime * 0.9 + ph);
  vec4 wp = modelMatrix * vec4(aI0.x + cos(ang) * rad, y, aI0.y + sin(ang) * rad, 1.0);
  vWP = wp.xyz; vWN = mat3(modelMatrix) * normalize(vec3(cos(ang) * aD.y * 0.6, 1.0, sin(ang) * aD.y * 0.6));
  float b = s - fract(uTime * 0.23 + ph);
  float N = 1.35 * exp(-b * b / 0.012) + 0.5 * (1.0 - smoothstep(0.0, 0.1, s));
  vK = vec4(N, -0.8, 1.0, (1.0 - abs(aD.y)) * aI1.z);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;function Qt(){const i=[],x=[],g=[],W=[-1,0,1];for(let p=0;p<=22;p++){for(const w of W)i.push(0,0,0),x.push(p/22,w);if(p)for(let w=0;w<2;w++){const y=(p-1)*3+w;g.push(y,y+1,y+4,y,y+4,y+3)}}const e=new a.InstancedBufferGeometry;return e.setAttribute("position",new a.Float32BufferAttribute(i,3)),e.setAttribute("aD",new a.Float32BufferAttribute(x,2)),e.setIndex(g),e}const Jt=`
attribute vec3 aD;
uniform float uTime;
varying vec3 vWN; varying vec3 vWP; varying vec4 vK;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWP = wp.xyz; vWN = mat3(modelMatrix) * normal;
  vK = vec4(aD.x * (0.88 + 0.12 * sin(uTime * 0.7 + aD.y)), 1.0, 1.0, aD.z);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;function ea(i){const x=[],g=[],u=[],W=[];for(const p of i){const{x:w,z:y,span:d,rise:h,yaw:v,ph:b}=p,I=d/2,k=d*.075,H=d*.055,F=30,M=Math.cos(v),P=Math.sin(v),Be=[];for(let S=0;S<=F;S++){const T=-1.06+2.12*S/F,X=I*T,re=h*(1-T*T),O=Math.hypot(I,2*h*T),te=2*h*T/O,ae=I/O,xe=k*(1+.5*T*T),he=2.7*Math.pow(R(.5,1,Math.abs(T)),1.5)+.25*(1-Math.abs(T)),me=[],nt=(ne,$)=>[X+te*ne*xe/2,re+ae*ne*xe/2,$*H],N=[[[1,-1],[1,1],[te,ae,0],2*H],[[1,1],[-1,1],[0,0,1],xe],[[-1,1],[-1,-1],[-te,-ae,0],2*H],[[-1,-1],[1,-1],[0,0,-1],xe]];for(const[ne,$,K,De]of N){const Ie=[];for(const[Y,ye]of[[ne,0],[[(ne[0]+$[0])/2,(ne[1]+$[1])/2],De/2],[$,0]]){const fe=nt(Y[0],Y[1]);x.push(w+fe[0]*M+fe[2]*P,fe[1],y-fe[0]*P+fe[2]*M),g.push(K[0]*M+K[2]*P,K[1],-K[0]*P+K[2]*M),u.push(he*(Y[0]<0?1:.7),b,ye),Ie.push(x.length/3-1)}me.push(Ie)}Be.push(me)}for(let S=0;S<F;S++)for(let T=0;T<4;T++){const X=Be[S][T],re=Be[S+1][T];for(let O=0;O<2;O++)W.push(X[O],X[O+1],re[O+1],X[O],re[O+1],re[O])}}const e=new a.BufferGeometry;return e.setAttribute("position",new a.Float32BufferAttribute(x,3)),e.setAttribute("normal",new a.Float32BufferAttribute(g,3)),e.setAttribute("aD",new a.Float32BufferAttribute(u,3)),e.setIndex(W),e}const ta={pearl:{zen:"#A5A6AD",hor:"#CECAC3",veil:"#7F8098",patch:[.02,.019,.016],glint:1.6,mist:0,veilAmt:1,sand:"#A9A398",deep:"#44575F",exposure:1},sunveil:{zen:"#A29E96",hor:"#D6CEBC",veil:"#8A879E",patch:[.075,.066,.046],glint:1.9,mist:0,veilAmt:1,sand:"#AFA690",deep:"#485B56",exposure:.98},mist:{zen:"#8F9199",hor:"#B2B2B9",veil:"#84859A",patch:[.016,.016,.016],glint:1.3,mist:1,veilAmt:.75,sand:"#A6A198",deep:"#43555D",exposure:1},dusk:{zen:"#6A6E86",hor:"#8E8C9E",veil:"#5D5F7C",patch:[.03,.028,.034],glint:1.5,mist:0,veilAmt:1,sand:"#807D88",deep:"#333A4C",exposure:1.12}};var sa={id:"weight-of-glass",name:"The Weight of Glass",category:"alien",weirdness:.6,media:["air","open","water"],async build(i){const x=i.vary??{},g=i.quality?.detail??1,u=x.density??1,W=i.rng.fork("looks"),e=i.rng.fork("scatter"),p=!!x.rare,w=x.hour??"any",y=w==="night"?"dusk":w==="dawn"||w==="golden"?"sunveil":w==="day"?W.pick(["pearl","pearl","mist"]):W.pick(["sunveil","pearl","mist","pearl","sunveil","pearl","mist"]),d=W.pick(["nine","nine","clump","giant"]),h=p?"nine":d,v=W.pick(["clear","clear","clear","smoke","deep"]),b=W.chance(.3),I=W.chance(.55),k=Math.max(28,Math.round(W.int(40,70)*Math.min(1.15,u)*g)),H=ta[y],F=new a.Scene;F.background=Ae(H.hor);const M=await Bt(i,{palette:Lt,detail:g,glass:v,load:h,herd:p?"even":void 0,padBeat:p?.46:.4,reflection:!1,preview:!1});F.add(M.object),F.add(M.makeReflection());const P=M.uniforms;P.uZen.value.copy(Ae(H.zen)),P.uHor.value.copy(Ae(H.hor)),P.uGlint.value=H.glint,y==="mist"&&(P.uVeil.value=1350),P.uVeilC.value.copy(Ae(H.veil)),P.uPatch.value.set(...H.patch),P.uMistC.value.copy(Ae("#D0CFCC")),P.uMist.value=H.mist,P.uVeilAmt.value=H.veilAmt,P.uSand.value.copy(Ae(H.sand)),P.uDeep.value.copy(Ae(H.deep));const Be=P.uSunDir.value;await i.yield();const S=Ft(M.anchors.flyThrough),T=M.anchors,X=S.length,re=new a.Vector3,O=(t,n,o)=>{let s=1e9,r=0;for(let c=0;c<=1500;c++){S.posAtDist(c/1500*X,re);const m=(re.x-t)**2+(re.y-n)**2+(re.z-o)**2;m<s&&(s=m,r=c/1500*X)}return r},te=O(-73,26,0),ae=O(0,104,0),xe=819.8,pe=.411,he=.585,me=t=>{const n=t*X;return n<te?pe-(te-n)/xe:n<ae?pe+(n-te)/(ae-te)*(he-pe):he+(n-ae)/(X-ae)*(1-he)},nt=t=>(t<pe?te-(pe-t)*xe:t<he?te+(t-pe)/(he-pe)*(ae-te):ae+(t-he)/(1-he)*(X-ae))/X;await i.yield();const N={...P,uWind:{value:new a.Vector4(.83,.55,b?.8:.07,b?.6:.95)},uGust:{value:new a.Vector4(0,0,40,0)},uGC:{value:new a.Vector3},uGH:{value:new a.Vector3(1,0,0)},uGS:{value:new a.Vector2(1,0)},uRings:{value:Array.from({length:16},()=>new a.Vector4(0,0,99,0))}},ne=new a.Mesh(new a.SphereGeometry(3500,40,20),new a.ShaderMaterial({uniforms:N,vertexShader:Kt,fragmentShader:qt,side:a.BackSide,depthWrite:!1,depthTest:!1,fog:!1}));ne.renderOrder=-1,ne.frustumCulled=!1,F.add(ne);const $=new a.Mesh(new a.CircleGeometry(3400,72),new a.ShaderMaterial({uniforms:N,vertexShader:Ht,fragmentShader:Ut.replace("uRings[8]","uRings[16]").replace("i < 8","i < 16"),transparent:!0,depthWrite:!1,fog:!1}));$.rotation.x=-Math.PI/2,$.renderOrder=5,$.frustumCulled=!1,F.add($);const K=new a.Group;K.scale.y=-1,F.add(K),await i.yield();const De=(t,n,o=0)=>Math.abs(Math.abs(t)-152)<33+o&&Math.abs(n)<38+o||Math.abs(t)<135+o&&Math.abs(n)<15+o&&Math.abs(t)>96-o,Ie=(t,n)=>{const o=S.nearestXZ(t,n);return o.y<34?o.dist:99},Y=new a.Vector3,ye=new a.Vector3,fe=t=>S.pointAt(t,new a.Vector3),kt=t=>{const n=S.tangentAt(t,new a.Vector3);return n.y=0,n.lengthSq()>1e-6?n.normalize():n.set(0,0,1)},We=[];for(let t=14;t<S.length-40;t+=e.range(34,52))if(S.posAtDist(t,Y),S.tangentAtDist(t,ye),!(Y.y>42))for(const n of e.chance(.5)?[1,-1]:[-1,1]){if(e.chance(.2))continue;const o=e.range(11,24),s=n*(o*e.range(.55,1)+e.range(3,16)+(Y.y>34?10:0));We.push([Y.x+ye.z*s+ye.x*e.range(-10,10),Y.z-ye.x*s+ye.z*e.range(-10,10),o])}for(let t=0;t<16;t++){const n=e.range(0,6.283),o=e.range(120,480);We.push([Math.cos(n)*o*1.2,Math.sin(n)*o-60,e.range(16,32)])}for(let t=0;t<1;t++)We.push([-85,-163,12,1]);const Ne=Math.round(5200*g*Math.min(1.2,.5+.5*u)),ot=new Float32Array(Ne*4),st=new Float32Array(Ne*4);let Pe=0;for(let t=0;Pe<Ne&&t<Ne*6;t++){const n=We[t%We.length],o=e.range(0,6.283),s=n[2]*Math.pow(e(),.7);if(i.noise.n2(n[0]*.3+Math.cos(o)*s*.16,n[1]*.3+Math.sin(o)*s*.16)<-.25)continue;const c=n[0]+Math.cos(o)*s,m=n[1]+Math.sin(o)*s;if(De(c,m,3)||Ie(c,m)<5.5)continue;const l=1-.45*(s/n[2]),G=e.range(2,5)*l*(n[3]?1.3:1);ot.set([c,m,G,e.range(0,6.283)],Pe*4),st.set([e.range(0,6.283),e.range(.8,1.35)*(n[3]?2.3:1),e.range(.02,.1),e.range(.16,.3)],Pe*4),Pe++}const St=Ge(N,At,{REED:1});Re(F,K,$e(Dt("reed"),ot,st,Pe),St,!1),await i.yield();const Ee=[],Q=[],ue=[];for(let t=0;Ee.length<14&&t<600;t++){const n=e.range(0,6.283),o=e.range(150,520),s=Math.cos(n)*o*1.15,r=Math.sin(n)*o-40;if(De(s,r,60)||S.nearestXZ(s,r).dist<55||Ee.some(l=>Math.hypot(l[0]-s,l[1]-r)<90))continue;Ee.push([s,r]);const c=e.range(0,6.283),m=e.int(3,5);for(let l=0;l<m;l++){const G=e.range(30,60)*(l?e.range(.55,.95):1),A=c+e.range(-.9,.9);Q.push(s+e.range(-5,5),r+e.range(-5,5),G,e.range(0,6.283)),ue.push(A,G*e.range(.055,.08),e.range(.1,.3),e.range(.035,.06))}for(let l=0;l<9;l++){const G=e.range(2.5,9),A=e.range(0,6.283),V=e.range(2,15);Q.push(s+Math.cos(A)*V,r+Math.sin(A)*V,G,e.range(0,6.283)),ue.push(A+e.range(-.5,.5),G*e.range(.12,.2),e.range(.15,.5),.02)}}for(const t of[.1,.145,.83]){const n=fe(t),o=kt(t),s=e.chance(.5)?1:-1,r=s*e.range(16,26),c=n.x+o.z*r,m=n.z-o.x*r;if(!De(c,m,8))for(let l=0;l<7;l++){const G=e.range(2,7.5),A=e.range(0,6.283),V=e.range(0,6),U=c+Math.cos(A)*V,z=m+Math.sin(A)*V;Ie(U,z)<9||(Q.push(U,z,G,e.range(0,6.283)),ue.push(A,G*e.range(.1,.17),e.range(.1,.45),.03))}}for(const[t,n,o,s]of[[68,-193,-1.33,[58,44,33,38,26]],[140,-172,-.3,[50,38,28,33]]]){Ee.push([t,n]),s.forEach((r,c)=>{Q.push(t+[0,6,-5,-9,9][c],n+[0,-4,5,-3,4][c],r,1.7*c+.4),ue.push(o+[0,.55,-.5,-.95,1][c],r*.095,[.3,.36,.24,.42,.4][c],.045)});for(let r=0;r<9;r++){const c=r*.7+.3,m=3+r*5%12,l=3+r*3.7%6;Q.push(t+Math.cos(c)*m,n+Math.sin(c)*m,l,r*1.3),ue.push(c+.3,l*.16,.2+.03*r,.02)}}const E=i.core.makeRng(i.core.hashSeed("outer-groves:"+i.seed));for(let t=0;t<12;t++){const n=(t+E.range(.15,.85))/12*6.283,o=E.range(300,480),s=Math.cos(n)*o,r=Math.sin(n)*o,c=E.range(0,6.283),m=E.int(3,5),l=[],G=[];for(let A=0;A<m;A++){const V=E.range(30,60)*(A?E.range(.55,.95):1),U=c+E.range(-.9,.9);l.push(s+E.range(-5,5),r+E.range(-5,5),V,E.range(0,6.283)),G.push(U,V*E.range(.055,.08),E.range(.1,.3),E.range(.035,.06))}for(let A=0;A<9;A++){const V=E.range(2.5,9),U=E.range(0,6.283),z=E.range(2,15);l.push(s+Math.cos(U)*z,r+Math.sin(U)*z,V,E.range(0,6.283)),G.push(U+E.range(-.5,.5),V*E.range(.12,.2),E.range(.15,.5),.02)}Ee.some(A=>Math.hypot(A[0]-s,A[1]-r)<90)||(Q.push(...l),ue.push(...G))}const Tt=Ge(N,At);Re(F,K,$e(Dt("blade"),new Float32Array(Q),new Float32Array(ue),Q.length/4),Tt,!0);const Xe=Math.round(520*g*Math.min(1.2,u)),rt=new Float32Array(Xe*4);let _e=0;for(let t=0;_e<Xe&&t<Xe*8;t++){let n,o;if(e.chance(.72)){S.posAtDist(e.range(0,S.length-30),Y);const s=e.range(0,6.283),r=3+52*Math.pow(e(),1.6);n=Y.x+Math.cos(s)*r,o=Y.z+Math.sin(s)*r}else{const s=e.range(0,6.283),r=e.range(60,450);n=Math.cos(s)*r,o=Math.sin(s)*r-60}De(n,o,2.5)||(rt.set([n,o,e.range(.5,1.5)*(e.chance(.15)?1.4:1),e.range(0,6.283)],_e*4),_e++)}Re(F,K,$e(jt(),rt,null,_e),Ge(N,Zt),!1),await i.yield();const it=new Float32Array(k*4);for(let t=0;t<k;t++){const n=e.range(-1,1),o=n*27+e.range(-4,4);it.set([o,.6*e.range(0,9)+1.5*Math.abs(n),.6*(e.range(-4,4)+2*Math.sin(n*3)),.5+o*.03+e.range(-.06,.06)],t*4)}const Ye=Xt();if(Ye.setAttribute("aG",new a.InstancedBufferAttribute(it,4)),Ye.instanceCount=k,Re(F,K,Ye,Ge(N,$t,{GLIDER:1}),!0),I){const t=Math.round(44*g),n=new Float32Array(t*4),o=new Float32Array(t*4),s=fe(.13),r=fe(.8),c=[[-152,0,48,74],[152,0,48,74],[s.x+30,s.z+10,6,22],[r.x-12,r.z-24,6,26]];for(let m=0;m<t;m++){const l=c[m%c.length],G=l[2]>20||m%8<4?1:-1;n.set([l[0],l[1],e.range(l[2],l[3]),e.range(0,6.283)],m*4),o.set([G*e.range(2.2,3.4),e.range(6.5,9.5),e.range(.32,.5),0],m*4)}Re(F,K,$e(Qt(),n,o,t),Ge(N,Yt),!1)}const Ve=[],lt=Math.max(7,Math.round(12*g));for(let t=0,n=0;Ve.length<lt&&n<400;n++){const o=(Ve.length+e.range(.15,.85))/lt*6.283+.4,s=e.range(700,2500),r=Math.cos(o)*s,c=Math.sin(o)*s,m=e.range(60,150)*(1+s/2600);S.nearestXZ(r,c).dist<150+m||Ve.some(l=>Math.hypot(l.x-r,l.z-c)<260)||Ve.push({x:r,z:c,span:m,rise:m*e.range(.3,.46),yaw:e.range(0,3.1416),ph:e.range(0,6.283)})}Re(F,K,ea(Ve),Ge(N,Jt),!0),await i.yield();const Qe=3,ke=new a.InstancedMesh(M.walkerGeometry,M.walkerMaterial,Qe);ke.frustumCulled=!1,ke.instanceMatrix.setUsage(a.DynamicDrawUsage),F.add(ke);const Je=new a.InstancedMesh(M.walkerGeometry,M.walkerMaterial,Qe);Je.instanceMatrix=ke.instanceMatrix,Je.frustumCulled=!1,K.add(Je);const Gt=[[me(.08),-70,-91,.25],[me(.7),118,-170,-.5],[me(.6),52,-203,2.6]].map(([t,n,o,s],r)=>({u:t,x:n,z:o,dx:Math.cos(s),dz:Math.sin(s),ph:M.herd[r].ph,sc:M.herd[r].sc>1.6?1:M.herd[r].sc})),f={cx:T.oculus.x,cz:T.oculus.z,R:Math.hypot(T.springings[1].x-T.crown.x,T.springings[1].z-T.crown.z),sink:.45,list:[]};{const t=M.walkerGeometry.attributes.position,n=M.walkerGeometry.attributes.aA,o=.9,s=1.1;let r=0,c=1/0;for(let z=0;z<t.count;z++)r=Math.max(r,t.getX(z)),n.getZ(z)<.5&&(c=Math.min(c,t.getY(z)));const m=o*(c-f.sink);for(let z=!0;z;){z=!1;for(let C=0;C<Q.length;C+=4){const B=Q[C+2];if(B<=m)continue;const Z=B>12?6:ue[C+1]+ue[C+2]*B,q=Math.hypot(Q[C]-f.cx,Q[C+1]-f.cz);f.R>q-6-Z&&f.R<q+13.5+Z&&(f.R=q-6-Z,z=!0)}}const l=i.core.makeRng(i.core.hashSeed("wading-round:"+i.seed)),G=2*Math.PI*f.R;f.turn=l.chance(.5)?1:-1,f.start=l.range(0,G/3);const A=f.R<2*Math.hypot(f.cx-T.springings[1].x,f.cz-T.springings[1].z)?0:3;for(let z=0;z<A;z++){const C=f.list.length;for(let q=0;q<3;q++)f.list.push({s:z*G/3+q*40,r:f.R,sc:l.range(o,s),ph:l.range(0,1),k:1});const B=f.list[C+l.int(0,2)],Z=.5*B.sc;f.list.push({s:B.s+(r*(B.sc-Z)-5)*f.R/(f.R-10),r:f.R-10,sc:Z,ph:l.range(0,1),k:.5})}f.list.forEach((z,C)=>{z.slot=N.uRings.value.length+C*8});for(let z=0;z<f.list.length*8;z++)N.uRings.value.push(new a.Vector4(0,0,99,0));const V=N.uRings.value.length;$.material.fragmentShader=$.material.fragmentShader.replace("uRings[16]","uRings["+V+"]").replace("i < 16","i < "+V);const U=z=>{const C=f.list.filter(j=>j.k===z),B=new a.BufferGeometry,Z=M.walkerGeometry,q=M.walkerMaterial;B.setAttribute("position",Z.attributes.position),B.setAttribute("normal",Z.attributes.normal),B.setAttribute("aA",Z.attributes.aA),B.setIndex(Z.index),B.setAttribute("aI",new a.InstancedBufferAttribute(new Float32Array(C.flatMap(j=>[j.ph,0])),2));const oe={value:0},J=new a.ShaderMaterial({uniforms:{...P,uTravel:oe},vertexShader:q.vertexShader,fragmentShader:q.fragmentShader,fog:q.fog,side:q.side}),ee=new a.InstancedMesh(B,J,C.length);ee.name="wading-round",ee.frustumCulled=!1,ee.instanceMatrix.setUsage(a.DynamicDrawUsage),F.add(ee);const ge=new a.InstancedMesh(B,J,C.length);return ge.name="wading-round",ge.instanceMatrix=ee.instanceMatrix,ge.frustumCulled=!1,K.add(ge),{list:C,k:z,mesh:ee,trav:oe}};f.sets=[U(1),U(.5)]}const Rt=t=>{if(h==="giant"){const o=Math.min(1,Math.max(0,(t-.58)/.08)),s=.08*(o*o*o-.5*o*o*o*o)+Math.max(0,t-.66);return t+.134*(1-R(0,.3,t))+.114*R(.4,.57,t)-.58*s}if(!p)return t;if(t<=.4)return 1.15*t;if(t<.5){const o=(t-.4)/.1;return .46+.14*(.82*o+1.11*o*o-.93*o*o*o)}const n=Math.min(1,Math.max(0,(t-.62)/.04));return .6+.35*(t-.5)+.65*(t<.66?.02*n*n:t-.64)},It=t=>p?.35*Math.min(.12,Math.max(0,t-.5))*125:0,ct=t=>p?R(.455,.505,t)*(1-R(.565,.612,t)):0,Le=new a.Matrix4,Ke=new a.Quaternion,ht=new a.Vector3(0,1,0),ft=new a.Vector3,L=new a.Vector3,ie=new a.Vector3,qe=new a.Vector3,le=new a.Vector3,be=new a.Vector3,et=new a.Vector3,aa=0,Wt=new a.Vector3(-22,80,0),Pt=(t,n)=>{S.pointAt(n,be);const o=be.x,s=be.y,r=be.z,c=R(2,18,r),m=o+9;if(h==="giant"){const l=M.herd[1].pos;be.set(l.x-4,l.y-14,Math.max(-6,Math.min(r+9.5,6)))}else be.set(o+4,s+30,Math.max(-6,Math.min(r+9.5,7)));return et.set(m,86*(1-m/117*(m/117))+6,0),p&&et.lerp(Wt,.7*ct(me(n)+.02)),be.lerp(et,c)},He=new a.Vector3;let ut=0;const tt=new a.Vector3,dt=new a.Vector3(0,4,0),Et=new a.Vector3(0,8,0),Vt=()=>h==="giant"?tt.copy(M.herd[1].pos).add(Et):h==="clump"?tt.copy(M.herd[3].pos).lerp(M.herd[4].pos,.6).add(dt):tt.copy(M.herd[2].pos).add(dt);function pt(t,n,o,s){s<=0&&(ut=Math.max(0,Math.min(n,60)));const r=me(s),c=p?r+.02*R(.4,.45,r):r,m=Rt(c)+24*(1-Math.exp(-ut/12))*(1-R(.2,.39,c))/125;M.setProgress(m),M.setPool(ct(c),1,It(c)),M.update(t,n,o),o.getWorldPosition(le),ne.position.copy(le),$.position.set(le.x,0,le.z),S.pointAt(Math.min(1,s+.04),L),N.uGust.value.set(L.x,L.z,48,1.15*R(.03,.075,s)*(1-R(.13,.19,s))),o.getWorldDirection(He);const l=Math.max(-.75,Math.min(.2,He.y)),G=Math.sqrt(1-l*l);L.set(He.x,0,He.z),L.lengthSq()<1e-6&&L.set(0,0,1),L.normalize();const A=L.z,V=-L.x,U=75*(1-R(.02,.115,s))+55*R(.125,.175,s),z=.42*(10+U),C=Math.max(-z,Math.min(z,(s-.115)*900)),B=10+.25*Math.abs(C)+U,Z=(.52-s)*320,q=26+130*R(.6,.74,s),oe=1-R(.185,.235,s),J=R(.4,.455,s),ee=1-oe-J,ge=R(.22,.42,s),j=N.uGC.value;j.set(0,0,0),j.x+=oe*(le.x+L.x*B*G+A*C),j.y+=oe*Math.max(le.y+l*B+2.5+.13*U,6),j.z+=oe*(le.z+L.z*B*G+V*C),j.x+=ee*(-48+48*ge),j.y+=ee*(101+13*ge),j.z+=ee*(2-6*ge),j.x+=J*(le.x+L.x*q*G+A*Z),j.y+=J*Math.max(le.y+l*q-7,6),j.z+=J*(le.z+L.z*q*G+V*Z),ie.set(oe*A+ee+J*(.55*L.x-.84*A),0,oe*V+J*(.55*L.z-.84*V)),ie.lengthSq()<1e-6&&ie.set(1,0,0),ie.normalize();const mt=1-.38*J;N.uGS.value.set(ie.x*mt,ie.z*mt),qe.set(oe*(L.x*.7+A*.75)+ee+J*ie.x,0,oe*(L.z*.7+V*.75)+J*ie.z),qe.lengthSq()<1e-6&&qe.set(1,0,0),N.uGH.value.copy(qe.normalize());const Ct=P.uTravel.value,gt=N.uRings.value;for(let ce=0;ce<Qe;ce++){const D=Gt[ce],ve=(m-D.u)*125,we=D.x+D.dx*ve,_=D.z+D.dz*ve;if(Ke.setFromAxisAngle(ht,Math.atan2(-D.dz,D.dx)),Le.compose(ie.set(we,-.45,_),Ke,ft.set(D.sc,D.sc,D.sc)),ke.setMatrixAt(ce,Le),!(ce>1))for(let de=0;de<4;de++){const Ce=Ct/ze+D.ph+Te[de][2],Me=Ce-Math.floor(Ce),Ue=(Te[de][0]+.31*ze)*D.sc,Oe=Te[de][1]*D.sc;for(let se=0;se<2;se++){const Se=(Me+se)*ze,Fe=Se/3;gt[ce*8+de*2+se].set(we-D.dx*Se+Ue*D.dx-Oe*D.dz,_-D.dz*Se+Ue*D.dz+Oe*D.dx,Fe,R(0,.25,Fe)*(1-R(4.4,6,Fe)))}}}ke.instanceMatrix.needsUpdate=!0;for(let ce=0;ce<2;ce++){const D=f.sets[ce],ve=D.k;for(let we=0;we<D.list.length;we++){const _=D.list[we],de=3*_.r/f.R,Ce=de*n/ve;we===0&&(D.trav.value=Ce%(40*ze));const Me=f.turn*((f.start+_.s+3*n)/f.R),Ue=-Math.sin(Me)*f.turn,Oe=Math.cos(Me)*f.turn;Ke.setFromAxisAngle(ht,Math.atan2(-Oe,Ue)),Le.compose(ie.set(f.cx+Math.cos(Me)*_.r,-f.sink*_.sc,f.cz+Math.sin(Me)*_.r),Ke,ft.set(_.sc,_.sc,_.sc)),D.mesh.setMatrixAt(we,Le);for(let se=0;se<4;se++){const Se=Ce/ze+_.ph+Te[se][2],Fe=Se-Math.floor(Se),vt=(Te[se][0]+.31*ze)*_.sc,wt=Te[se][1]*_.sc;for(let Ze=0;Ze<2;Ze++){const xt=(Fe+Ze)*ze*ve,at=xt/de,je=Me-f.turn*xt/_.r,yt=-Math.sin(je)*f.turn,bt=Math.cos(je)*f.turn;gt[_.slot+se*2+Ze].set(f.cx+Math.cos(je)*_.r+vt*yt-wt*bt,f.cz+Math.sin(je)*_.r+vt*bt+wt*yt,at,ve*R(0,.25,at)*(1-R(4.4*ve,6*ve,at)))}}}D.mesh.instanceMatrix.needsUpdate=!0}}{const t=new a.PerspectiveCamera(62,i.aspect||1.78,.3,4e3);S.pointAt(0,t.position),t.updateMatrixWorld(),pt(0,0,t,0)}return{scene:F,path:S,duration:41.5,pace:t=>1-.2*R(.19,.25,t)*(1-R(.4,.47,t))+.14*R(.47,.54,t)*(1-R(.62,.72,t)),title:"The Weight of Glass",camera:{fov:62,near:.3,far:4e3,lookAhead:24,sway:.6,bank:.25},pois:[{at:new a.Vector3(45,28,0),from:.02,to:.115,weight:.8},{at:new a.Vector3(-88,64,-2),from:.095,to:.2,weight:.85},{at:Pt,from:.165,to:.41,weight:.92,fade:.15},{at:p?new a.Vector3(-22,95,0):Vt,from:p?.355:.39,to:.5,weight:p?.8:.9},{at:new a.Vector3(68,25,-193),from:.53,to:.66,weight:.5},{at:new a.Vector3(134,20,-172),from:.63,to:.745,weight:.5},{at:new a.Vector3(128,26,0),from:.72,to:.85,weight:.75},{at:T.oculus.clone(),from:.8,to:.95,weight:.7}],portal:{shape:"circle",radius:7,color:"#2B2F86",glow:1,revealDistance:420},post:{exposure:H.exposure,bloom:{strength:.22,radius:.5,threshold:1},grade:{saturation:1,contrast:1.06,tint:"#ffffff",shadowTint:"#000000",vignette:.12,grain:0,aberration:0}},ride:"none",style:"none",companion:"none",update:pt,dispose(){M.dispose()}}}};export{sa as default};
