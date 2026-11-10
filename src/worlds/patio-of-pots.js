import*as a from"three";import{makePath as Se,makeRng as Oe,hashSeed as Ce,clamp as d0,lerp as _0,smoothstep as Y}from"../kit/core.js";import*as $ from"../kit/fauna.js";import"../kit/flora.js";import*as Ie from"../kit/fx.js";import{buildHero as ze}from"../parts/patio-of-pots.js";const w0=["#F3EFE4","#A9BCD8","#1F47A6","#D4221E","#3E7A38","#B5653A","#2E62C4"],V0=[[312,11,-30],[280,11,-30],[242,11,-30],[200,12,-27],[160,13,-30],[115,14,-36],[72,13,-30],[40,14,-30],[8,20,-27],[-21,26,-11],[-36,32,13],[-36,42,38],[-20,50,52],[0,55,50],[14,58,36],[17.5,63,15.5],[14,73,-4],[3,86,-19.5],[-12.2,117,-34.7],[-27.4,147.5,-49.9]],j0=44,y0=(e,u,h)=>Y(e,u,h),Le=e=>1.7-.95*y0(.37,.455,e)-.15*y0(.5,.57,e)+.6*y0(.635,.69,e)-.4*y0(.72,.8,e)+.15*y0(.9,.97,e),We={may:{zen:"#2E62C4",hor:"#8FB6E6",fog:"#a9c0e4",fogD:.00105,cirrus:"#f4f7ff",stars:0,lamp:0,mist:0,wet:.5,exposure:1.06,shade:1.25},dawn:{zen:"#4f72c4",hor:"#f9be98",fog:"#c8b9c4",fogD:.0014,cirrus:"#ffd0a8",stars:0,lamp:0,mist:1,wet:.5,exposure:1.08,shade:1.25},moon:{zen:"#060b28",hor:"#1a2a66",fog:"#121b44",fogD:.0011,cirrus:"#8fa2d8",stars:1,lamp:1,mist:0,wet:.45,exposure:1.3,shade:1.25},shower:{zen:"#2a5cbc",hor:"#9fc0e8",fog:"#a4bbdc",fogD:.0011,cirrus:"#ffffff",stars:0,lamp:0,mist:0,wet:1,exposure:1.06,shade:1.25}},I0=`
float boxSun(vec3 p, float xe, float zs, float h){
  float te = max(xe - p.x, 0.) / 0.985, ts = max(zs - p.z, 0.) / 0.174;
  float t = min(te, ts);
  float zz = p.z + t * 0.174;
  float line = h + (abs(sin(zz * 1.5707963)) - 0.55) * 1.3 * step(te, ts);
  float pen = 0.25 + t * 0.008;
  return smoothstep(-pen, pen, p.y + t * uSunTan - line);
}
float worldSun(vec3 wp){
  if (wp.x < 61.) return patioSun((uHeroInv * vec4(wp, 1.)).xyz);
  if (wp.x < 155.) return boxSun(wp, 150., 15., 78.);
  if (wp.x < 230.) return boxSun(wp, 226., 0., 48.);
  return 0.;
}
vec3 skyColor(vec3 d){ return mix(uHor, uZen, smoothstep(0.02, 0.75, d.y)); }
`,Ae=`
uniform float uTime;
attribute vec3 color; attribute float aMat;
#ifdef USE_INSTANCING
attribute vec4 iA, iB;
#endif
varying vec3 vW, vN, vCol, vL; varying vec2 vUv; varying float vMat, vSeed;
#include <fog_pars_vertex>
void main(){
  vec3 lp = position, ln = normal, col = color;
  vSeed = 0.;
  #ifdef USE_INSTANCING
    vSeed = iA.w;
    if (aMat > 11.5 && aMat < 13.5) {                          // leaves and petals nod
      float k = 0.05 * (0.4 + max(lp.y, -lp.y * 0.6));
      lp.x += k * sin(uTime * 1.3 + iA.w * 40. + lp.y * 1.7);
      lp.z += k * cos(uTime * 1.07 + iA.w * 31. + lp.x * 1.3);
    }
    if (aMat > 12.5 && aMat < 13.5) { col = iB.rgb * color.r; if (iB.a < color.b) lp = vec3(0.); }
    else if (aMat > 10.5 && aMat < 11.5) col = iA.rgb * color;
    vec4 wp = modelMatrix * instanceMatrix * vec4(lp, 1.);
    vN = mat3(modelMatrix) * (mat3(instanceMatrix) * ln);
  #else
    vec4 wp = modelMatrix * vec4(lp, 1.);
    vN = mat3(modelMatrix) * ln;
  #endif
  vW = wp.xyz; vL = position; vCol = col; vUv = uv; vMat = aMat;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Re=e=>`
${e}
uniform vec3 uZen, uHor, uLime, uCobalt, uScarlet, uLampCol;
uniform vec4 uLamp[7];
uniform float uFloorWet, uPuddle, uLampK, uLift, uOpenSky;
${I0}
${Te}
${Ee}
varying vec3 vW, vN, vCol, vL; varying vec2 vUv; varying float vMat, vSeed;
#include <fog_pars_fragment>
// black and white river stones laid in stars, rings and waves; returns the stone colour
vec3 pebbles(vec2 w, out float edge, out float dome){
  vec2 p = w * 1.3, ip = floor(p), fp = fract(p);
  float f1 = 9., f2 = 9.; vec2 cc = ip;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j));
    vec2 o = g + h22(ip + g) * 0.8 + 0.1 - fp;
    float d = dot(o, o);
    if (d < f1) { f2 = f1; f1 = d; cc = ip + g; } else if (d < f2) { f2 = d; }
  }
  f1 = sqrt(f1); f2 = sqrt(f2);
  edge = smoothstep(0.03, 0.17, f2 - f1);
  dome = edge * (1. - f1 * 0.7);
  vec2 c = (cc + 0.5) / 1.3;
  vec2 g = fract(c / 26. + 0.5) - 0.5;
  float a = atan(g.y, g.x + 1e-5), r = length(g);
  float star = 0.25 + 0.11 * cos(a * 8.) - r;
  float ring = 0.022 - abs(r - 0.44);
  float wave = abs(sin(c.x * 0.5 + 1.7 * sin(c.y * 0.24))) - 0.86;
  float core = r - 0.07;
  float white = max(max(step(0., star) * step(0., core), step(0., ring)), step(0., wave) * step(0.47, r));
  float rr = h21(cc);
  return mix(vec3(0.045, 0.05, 0.065) + 0.05 * rr, vec3(0.66, 0.65, 0.6) * (0.78 + 0.3 * rr), white);
}
// what a wet floor mirrors: the sky square, or the wall the reflected ray meets
vec3 mirror(vec3 wp, vec3 r){
  vec4 bx = wp.x < 61. ? vec4(-50., 50., -70., 70.) : wp.x < 155. ? vec4(72., 150., -75., 15.) : vec4(160., 226., -60., 0.);
  float top = wp.x < 61. ? 140. : wp.x < 155. ? 78. : 48.;
  if (wp.x > 230.) return gateMirror(wp, r);
  float tx = r.x > 0. ? (bx.y - wp.x) / max(r.x, 1e-3) : (wp.x - bx.x) / max(-r.x, 1e-3);
  float tz = r.z > 0. ? (bx.w - wp.z) / max(r.z, 1e-3) : (wp.z - bx.z) / max(-r.z, 1e-3);
  float t = min(tx, tz);
  vec3 hit = wp + r * t;
  vec3 sky = skyColor(normalize(r + vec3(0., 1e-4, 0.)));
  float lit = worldSun(hit - r * 0.5);
  float dots = smoothstep(0.62, 0.8, vnoise(vec2(hit.x + hit.z, hit.y) * 0.27));
  vec3 wall = uLime * (uSunCol * 0.62 * lit + uSkyCol * 0.8);
  wall = mix(wall, mix(uCobalt, uScarlet, lit) * (0.25 + 0.75 * lit), dots * 0.6);
  return mix(wall, sky, smoothstep(top - 3., top + 3., hit.y));
}
void main(){
  vec3 n = normalize(vN + vec3(0., 1e-5, 0.));
  if (vMat > 11.5 && vMat < 13.5 && dot(n, cameraPosition - vW) < 0.) n = -n;      // cards are two-sided
  vec3 vv = cameraPosition - vW;
  float dist = length(vv);
  vec3 v = vv / max(dist, 1e-4);
  vec3 sunW = vec3(uSunDir.z, uSunDir.y, -uSunDir.x);
  float sun = worldSun(vW);
  vec3 alb = vCol; float gloss = 0., wrap = 0.15, wetRefl = 0., back = 0., ao = 1., sheen = 0., petal = 0.;
  float tc = vW.x * abs(n.z) + vW.z * abs(n.x) + (vW.x + vW.z) * abs(n.y);          // a coordinate along the surface
  vec2 sp = vec2(tc, vW.y);
  // arch 2 (x 50..72): its soffit and jambs are a dark, brush-marked frame for the hero wall beyond
  float arch2 = step(49.9, vW.x) * step(vW.x, 72.1) * step(abs(vW.z + 30.), 11.2) * step(0.5, vW.y);
  sp = mix(sp, vec2(vW.x, vW.y + vW.z * abs(n.y)), arch2);
  float n1 = vnoise(sp * 0.9 + 3.), n2 = vnoise(sp * 4.3 + 11.), n3 = vnoise(sp * 15.);
  float lod = smoothstep(160., 25., dist);
  if (vMat < 1.5) {                                            // lime (0: with a cobalt band at its foot, 1: plain)
    float br = mix(vnoise(vec2(sp.x * 0.33 + sp.y * 0.07, sp.y * 2.7)), vnoise(vec2(sp.x * 2.3, sp.y * 0.38)), smoothstep(0.35, 0.65, vnoise(sp * 0.11 + 9.3)));
    float coat = fbm3(sp * 0.045 + 3.3);
    alb = uLime * vCol * (0.76 + 0.13 * coat + 0.17 * (br - 0.5) * lod + 0.06 * (n3 - 0.5) * lod);
    alb = mix(alb, alb * vec3(1.03, 0.97, 0.88), smoothstep(0.42, 0.62, fbm3(sp * 0.021 + 17.)) * 0.8);        // an older, creamier coat
    float fl = fbm3(sp * 0.33 + 41.);
    alb *= 1. - 0.08 * smoothstep(0.615, 0.635, fl) * lod;
    alb = mix(alb, alb * vec3(0.9, 0.96, 0.86), 0.55 * smoothstep(0.5, 0.9, coat) * smoothstep(34., 0., vW.y));
    alb *= 1. - 0.16 * smoothstep(0.45, 0.85, fbm3(vec2(sp.x * 0.5, sp.y * 0.045))) * abs(n.x + n.z);     // rain streaks
    alb *= 1. + arch2 * (0.16 * (br - 0.5) + 0.4 * (n1 - 0.5) + 0.24 * (n2 - 0.5) - 0.16 * smoothstep(0.5, 0.8, fbm3(sp * 0.16 + 23.)));   // heavy brush marks, old damp
    if (vMat < 0.5 && abs(n.y) < 0.5) {
      float yb = 8.3 + 0.3 * (vnoise(vec2(sp.x * 0.35, 1.7)) - 0.5);
      float band = 1. - smoothstep(yb - 0.08, yb + 0.08, vW.y);
      vec3 dado = uCobalt * (0.8 + 0.5 * coat + 0.25 * (br - 0.5));
      dado = mix(dado, uCobalt * 0.5, smoothstep(0.5, 0.2, abs(vW.y - (yb - 0.55))) * 0.7);
      dado = mix(dado, uLime * 0.6, smoothstep(0.7, 0.9, n2) * smoothstep(4., 0., vW.y) * 0.8);
      alb = mix(alb, dado, band);
    }
    wrap = 0.1;
  } else if (vMat < 2.5) {                                     // pebble mosaic, wet
    float fw = fwidth(vW.x) + fwidth(vW.z);
    float edge, dome;
    vec3 st = pebbles(vW.xz, edge, dome);
    float far = smoothstep(0.25, 0.9, fw);
    alb = mix(st * (0.35 + 0.65 * edge) * (0.85 + 0.3 * dome), vec3(0.2, 0.2, 0.2), far);
    float moss = smoothstep(0.55, 0.8, fbm3(vW.xz * 0.07 + 5.)) * (1. - sun * 0.7);
    alb = mix(alb, vec3(0.1, 0.19, 0.06) * (0.7 + 0.6 * n2), moss * (1. - 0.6 * edge) * 0.8);
    float pud = smoothstep(0.42, 0.6, fbm3(vW.xz * 0.045 + 17.)) * uPuddle;
    wetRefl = uFloorWet * mix(0.35 + 0.65 * edge * (1. - far), 1., max(pud, 0.85 * far));     // far off, at a grazing angle, wet stones are a mirror
    alb *= 1. - 0.35 * uFloorWet;                               // wet stone is darker
    n = normalize(n + vec3(dFdx(dome), 0., dFdy(dome)) * ((1. - pud) * (1. - far) * 6.));
    gloss = 0.5 * uFloorWet; ao = vCol.r;
  } else if (vMat < 3.5) { alb = vCol * (0.7 + 0.5 * n2); alb = mix(alb, vec3(0.2, 0.09, 0.04), smoothstep(0.7, 0.9, n1) * 0.4); gloss = 0.4; wrap = 0.3; }
  else if (vMat < 4.5) { float gr = vnoise(vec2(vUv.x * 3., vUv.y * 46.) + vL.x * 0.3); alb = vCol * (0.66 + 0.5 * gr + 0.14 * n3); gloss = 0.1; }
  else if (vMat < 5.5) {                                       // blue and white tiles (uv in tiles)
    vec2 f = fract(vUv) - 0.5, id = floor(vUv);
    float d1 = abs(f.x) + abs(f.y), d2 = max(abs(f.x), abs(f.y)), rr = length(f);
    float star = min(d1 - 0.36, d2 - 0.27);
    float kb = step(star, 0.) * step(0.1, rr);
    float corner = step(0.56, d1);
    float lace = step(abs(rr - 0.455), 0.022);
    vec3 col = vec3(0.82, 0.81, 0.76);
    col = mix(col, uCobalt * 1.1, max(kb, lace));
    col = mix(col, vec3(0.75, 0.5, 0.12), step(rr, 0.075));
    col = mix(col, mix(vec3(0.12, 0.36, 0.2), uCobalt, step(0.5, h21(id))), corner);
    float grout = step(0.47, d2);
    alb = mix(col * (0.86 + 0.2 * h21(id + 3.)), vec3(0.42, 0.4, 0.36), grout) * vCol;
    gloss = 0.7 * (1. - grout); wrap = 0.1; sheen = 1. - grout;
  } else if (vMat < 6.5) { alb = vCol * (0.75 + 0.35 * n2 + 0.1 * n3); alb = mix(alb, vec3(0.62, 0.6, 0.55), smoothstep(0.62, 0.85, n1) * 0.35); wrap = 0.3; gloss = 0.06; }
  else if (vMat < 7.5) {                                       // water in a basin or bucket
    float rp = length(vUv - 0.5) * 2.;
    float rip = sin(rp * 26. - uTime * 5.) * (1. - rp) + 0.4 * sin(vW.x * 3. + uTime * 1.7) * sin(vW.z * 2.6 - uTime * 1.3);
    n = normalize(vec3(dFdx(rip) * 2.2, 1., dFdy(rip) * 2.2));
    alb = vec3(0.02, 0.07, 0.08); wetRefl = 1.; gloss = 1.;
  } else if (vMat < 8.5) { alb = vCol; wrap = 0.4; }
  else if (vMat < 9.5) { alb = vCol * 0.2; }
  else if (vMat < 11.5) {                                      // a painted clay pot
    float chip = smoothstep(0.6, 0.72, vnoise(vL.xy * 3.1 + vSeed * 60.) * 0.6 + vnoise(vL.zy * 7. + vSeed * 20.) * 0.4);
    alb = mix(vCol, vec3(0.5, 0.24, 0.13), chip * 0.75) * (0.82 + 0.3 * n2);
    alb = mix(alb, uLime * 0.8, smoothstep(0.55, 0.9, vnoise(vL.xz * 2. + vSeed * 9.)) * smoothstep(-0.5, -1.5, vL.y) * 0.5);
    alb *= 0.6 + 0.4 * smoothstep(-1.5, -0.9, vL.y);
    gloss = 0.3;
  } else if (vMat < 12.5) {                                    // geranium leaves: a card of round scalloped leaves
    vec2 q = vUv * 2. - 1.;
    float th = atan(q.y, q.x + 1e-5);
    float d = min(length(q - vec2(-0.4, -0.27)) - 0.55, min(length(q - vec2(0.42, -0.2)) - 0.5, length(q - vec2(0., 0.44)) - 0.52));
    d += 0.05 * sin(th * 9. + vSeed * 20.);
    if (d > 0.) discard;
    float band = smoothstep(0.1, 0.0, abs(d + 0.27) - 0.05);
    alb = vCol * (0.75 + 0.5 * vnoise(q * 3. + vSeed * 50.)) * (1. - 0.38 * band);
    wrap = 0.7; back = 0.5; gloss = 0.12;
  } else if (vMat < 13.5) {                                    // an umbel of florets
    vec2 q = vUv * 2. - 1.;
    float th = atan(q.y, q.x + 1e-5), rr = length(q);
    if (rr > 0.8 + 0.17 * sin(th * 7. + vSeed * 30.)) discard;
    float fl = 0.72 + 0.28 * smoothstep(0.1, 0.45, abs(sin(th * 3.5 + rr * 4.)) + 0.4 * vnoise(q * 5.));
    alb = vCol * fl * (0.66 + 0.5 * smoothstep(-0.5, 0.5, q.y)) * (1. - 0.3 * rr * rr);     // a shaded dome, not a flat disc
    wrap = 0.9; back = 0.2; petal = 1.;
  } else if (vMat < 14.5) { alb = vec3(0.09, 0.06, 0.04) * (0.6 + 0.8 * n2); }
  else {                                                       // roof tiles
    float ridge = abs(sin(tc * 1.5707963));
    alb = vCol * (0.6 + 0.45 * ridge) * (0.8 + 0.35 * n1);
    alb = mix(alb, vec3(0.4, 0.38, 0.28), smoothstep(0.55, 0.85, n2) * 0.4);
    wrap = 0.3;
  }
  // light: the sun through the roofs' shadow, blue sky from above (less at the foot of a deep patio), the warm
  // bounce off whatever is lit (strongest high on the shaded walls of the last patio), and the lanterns.
  // The passage is lit by the bright patio beyond its gate.
  float ndl = max((dot(n, sunW) + wrap) / (1. + wrap), 0.);
  float well = wp_well(vW);
  float inPass = smoothstep(228., 236., vW.x);
  well *= 1. - arch2 * (0.55 - 0.3 * abs(vW.x - 61.) / 11.);          // darkest in the middle of the arch's depth
  // the east galleries: the wall behind each deck and the deck's underside sit in a recess of blue shade, while the
  // posts, the rails and the front of each floor take the warm bounce of the lit wall opposite
  float east = step(vW.x, 50.05) * smoothstep(36., 41., vW.x);
  float recess = east * smoothstep(41.4, 46., vW.x) * (0.14 + 0.86 * exp(-(35. - mod(vW.y, 35.)) / 16.)) * step(vW.y, 105.);
  well *= 1. - 0.8 * recess;
  vec3 skyA = mix(uSkyCol, vec3(dot(uSkyCol, vec3(0.3, 0.5, 0.2))), 0.2) * 1.22;
  skyA = mix(skyA, gateGlow() * 0.6, 0.62 * inPass);
  float hemi = mix(0.6 + 0.4 * n.y, 0.78 + 0.22 * n.y, inPass);
  float lift = vW.x < 61. ? (0.5 + 1.7 * smoothstep(-75., 25., vW.y - uEdgeY)) * uLift : 0.45;
  vec3 amb = skyA * (hemi * well * ao) + uBounce * ((0.75 + 0.25 * abs(n.x)) * lift * well * (1. - inPass) * (1. - recess) * (1. + 0.9 * east));
  vec3 lamp = vec3(0.);
  for (int i = 0; i < 7; i++) {
    vec3 dl = uLamp[i].xyz - vW; float d2 = dot(dl, dl);
    lamp += uLampCol * (uLamp[i].w * max(dot(n, dl) / sqrt(d2 + 1e-3) + 0.25, 0.) / (1. + d2 * 0.0026));
  }
  // petals are held under the tone map's shoulder so that sunlit scarlet stays scarlet
  vec3 col = alb * (uSunCol * (ndl * sun * (1. - 0.4 * petal)) + amb + lamp);
  col += alb * uSunCol * (back * sun * max(-dot(n, sunW), 0.) * 0.6);
  if (vMat > 8.5 && vMat < 9.5) col += vCol * (uLampK * 5.);
  // the bright wet patio throws slow ripples of light up the passage's tiles and vault
  if (inPass > 0. || arch2 > 0.) {
    vec2 cq = mix(vec2(vW.x * 0.6 + vW.z * 0.35, vW.y * 0.75 + vW.z * 0.4), vec2(vW.x * 2.6 + vW.z * 0.3, (vW.y + vW.z * abs(n.y)) * 1.5), arch2) * 0.42;
    float ca = sin(cq.x * 1.9 + uTime * 0.9 + 2.1 * sin(cq.y * 1.3 - uTime * 0.6));
    float cb = sin(cq.y * 2.3 - uTime * 0.7 + 1.9 * sin(cq.x * 1.1 + uTime * 0.5));
    float cau = clamp(0.5 + 0.25 * (ca + cb + sin((cq.x + cq.y) * 1.5 + uTime * 1.1)), 0., 1.);
    col += alb * gateGlow() * (cau * cau * cau * 0.62 * inPass * exp(-max(vW.x - 234., 0.) / 70.));
    col += alb * gateGlow() * ((0.1 + cau * cau * 0.36) * (1. - 0.6 * smoothstep(12., 32., vW.y)) * arch2 * step(vMat, 5.5) * (1. - step(1.5, vMat) * step(vMat, 2.5)));     // and up arch 2
  }
  // the passage floor: the pool of light that comes through the gate, crossed by the shadow of its lace
  if (vMat > 1.5 && vMat < 2.5 && vW.x > 232.) col += alb * gateGlow() * (gatePool(vW) * 1.5);
  col = patioTone(col, 1.0);
  vec3 hv = normalize(sunW + v + vec3(0., 1e-4, 0.));
  float ndh = max(dot(n, hv), 0.), fr = 1. - max(dot(n, v), 0.);
  float fr5 = fr * fr * fr * fr * fr;
  if (wetRefl > 0.) {
    vec3 r = reflect(-v, normalize(mix(n, vec3(0., 1., 0.), inPass * step(1.5, vMat)))); r.y = abs(r.y) + 0.03;   // the film lies flatter than the stones
    // a film of water still creeping over the passage floor makes the mirrored arch shiver
    r.xz += inPass * 0.07 * (vec2(vnoise(vW.xz * 0.7 + vec2(uTime * 0.5, 0.)), vnoise(vW.zx * 0.7 + vec2(0., uTime * 0.4))) - 0.5);
    vec3 m = mirror(vW, normalize(r));
    col = mix(col, m, clamp(wetRefl * (0.05 + 0.95 * fr5 + 0.5 * uPuddle * wetRefl) + inPass * (0.16 + 0.6 * fr * fr), 0., 0.92));
  }
  if (sheen > 0. && vW.x > 232.) col += gateMirror(vW, normalize(reflect(-v, n) + vec3(0., 1e-4, 0.))) * (sheen * (0.05 + 0.75 * fr * fr * fr));
  col += uSunCol * (gloss * sun * (pow(ndh, 60.) * 1.2 + pow(ndh, 8.) * 0.05)) + uSkyCol * (gloss * fr * fr * 0.35 * well);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,Te=`
float wp_well(vec3 w){
  float inPass = smoothstep(228., 236., w.x);
  float fall = 0.36 + 0.95 * exp(-max(w.x - 234., 0.) / 46.);
  float deep = w.x < 61. ? 0.62 + 0.38 * smoothstep(0., 90., w.y) : w.x < 155. ? 0.68 + 0.32 * smoothstep(0., 60., w.y) + 0.2 * uOpenSky : 0.78 + 0.22 * smoothstep(0., 40., w.y) + 0.36 * uOpenSky;
  return mix(deep, fall, inPass);
}
`,Ee=`
uniform float uGateOpen, uGateH;
vec3 gateGlow(){ return uLime * (uSunCol * 0.55 + uSkyCol * 1.05); }
float gateLace(vec2 g, float blur){
  float az = abs(g.x);
  float top = 18. + sqrt(max(100. - g.x * g.x, 0.));
  float inside = (1. - smoothstep(9.5, 10.1 + blur, az)) * (1. - smoothstep(top - 0.3, top + 0.3 + blur, g.y)) * step(0., g.y);
  float w = 0.2 + blur;
  vec2 f = vec2(g.x, max(g.y - 18., 0.));
  float r = length(f), a = atan(f.y, f.x + 1e-4);
  float ray = abs(fract(a / 3.14159265 * 14. + 0.5) - 0.5) * 0.2244 * max(r, 0.5);
  float rings = min(min(abs(r - 3.2), abs(r - 6.6)), abs(r - 9.7));
  float fan = 1. - smoothstep(w * 0.55, w * 1.5, min(min(ray, rings), abs(g.y - 18.)));
  float c = max(cos(uGateOpen), 0.03);
  float sl = (10. - az) / c;                                   // metres along a leaf from its hinge
  float bars = abs(fract((sl - 0.15) / 0.97 + 0.5) - 0.5) * 0.97 * c;
  float rails = min(min(abs(g.y - 0.5), abs(g.y - 5.4)), min(abs(g.y - 7.4), abs(g.y - 15.4)));
  float scroll = abs(length(vec2((fract((sl - 1.1) / 1.94 + 0.5) - 0.5) * 1.94 * c, g.y - 11.4)) - 0.9);
  float leaf = 1. - smoothstep(w * 0.5, w * 1.4, min(min(bars, rails), scroll));
  leaf *= step(sl, 10.) * step(g.y, 17.6);
  return inside * (1. - 0.92 * (g.y > 17.8 ? fan : leaf) * clamp(0.34 / w, 0., 1.));     // thin bars lose their bite as they blur
}
// the wet floor and the glazed tiles mirror the bright arch, lace and all
vec3 gateMirror(vec3 wp, vec3 r){
  float t = (wp.x - 230.) / max(-r.x, 1e-3);
  vec3 h = wp + r * t;
  float lace = step(1e-3, -r.x) * gateLace(vec2(h.z + 30., h.y), 0.12 + t * 0.008);
  vec3 beyond = mix(uLime * (uSkyCol * 1.5 + uSunCol * 0.14), uLime * (uSunCol * 0.72 + uSkyCol * 0.6), smoothstep(8., 16., h.y));
  return uLime * gateGlow() * 0.16 + beyond * lace;
}
// light thrown down the passage floor from the bright wall beyond the gate (a source uGateH high, 60 m past it)
float gatePool(vec3 wp){
  float sg = max(wp.x - 230., 0.), k = 60. / (sg + 60.);
  float lace = gateLace(vec2((wp.z + 30.) * k, uGateH * (1. - k)), 0.02 + sg * 0.004);
  return lace * (0.25 + 0.75 * exp(-sg / 55.)) * smoothstep(0., 3., sg);
}
`,i={LIME:0,LIME1:1,FLOOR:2,IRON:3,WOOD:4,TILE:5,CLAY:6,WATER:7,PLAIN:8,GLASS:9,POT:11,LEAF:12,PETAL:13,SOIL:14,ROOF:15},F=[1,1,1];function n0(){const e=[],u=[],h=[],k=[],y=[],n=new a.Vector3,c=new a.Matrix3,r={uvS:[1,1],count:()=>y.length,quad(t,o,s,d,f,p,x=F,g=[0,0,1,1],b=null){const v=[t,o,s,t,s,d],m=b?[b[0],b[1],b[2],b[0],b[2],b[3]]:null,P=[[g[0],g[1]],[g[2],g[1]],[g[2],g[3]],[g[0],g[1]],[g[2],g[3]],[g[0],g[3]]];for(let z=0;z<6;z++){const C=v[z],M=m?m[z]:1;e.push(C[0],C[1],C[2]),u.push(f[0],f[1],f[2]),h.push(x[0]*M,x[1]*M,x[2]*M),k.push(P[z][0],P[z][1]),y.push(p)}},geo(t,o,s=F,d=null,f=null){const p=t.index?t.toNonIndexed():t,x=p.attributes.position,g=p.attributes.normal,b=p.attributes.uv,v=p.attributes.color;d&&c.getNormalMatrix(d);for(let m=0;m<x.count;m++){n.fromBufferAttribute(x,m),d&&n.applyMatrix4(d),e.push(n.x,n.y,n.z);const P=f?f(n.x,n.y,n.z):1;s?h.push(s[0]*P,s[1]*P,s[2]*P):v?h.push(v.getX(m)*P,v.getY(m)*P,v.getZ(m)*P):h.push(P,P,P),n.fromBufferAttribute(g,m),d&&n.applyMatrix3(c).normalize(),u.push(n.x,n.y,n.z),b?k.push(b.getX(m)*r.uvS[0],b.getY(m)*r.uvS[1]):k.push(0,0),y.push(o)}p!==t&&p.dispose(),t.dispose()},box(t,o,s,d,f,p,x,g=F,b=0,v=null){const m=new a.Matrix4().makeRotationY(b).setPosition(t,o,s);r.geo(new a.BoxGeometry(d,f,p),x,g,m,v)},rod(t,o,s,d,f=F,p=5){const x=new a.Vector3(o[0]-t[0],o[1]-t[1],o[2]-t[2]),g=x.length(),b=new a.CylinderGeometry(s,s,g,p,1,!0),v=new a.Quaternion().setFromUnitVectors(new a.Vector3(0,1,0),x.normalize()),m=new a.Matrix4().compose(new a.Vector3((t[0]+o[0])/2,(t[1]+o[1])/2,(t[2]+o[2])/2),v,new a.Vector3(1,1,1));r.geo(b,d,f,m)},lathe(t,o,s,d,f=F,p=1,x=null){const g=t.map(v=>new a.Vector2(v[0]*p,v[1]*p)),b=new a.Matrix4().setPosition(s[0],s[1],s[2]);r.geo(new a.LatheGeometry(g,o),d,f,b,x)},build(){const t=new a.BufferGeometry;return t.setAttribute("position",new a.Float32BufferAttribute(e,3)),t.setAttribute("normal",new a.Float32BufferAttribute(u,3)),t.setAttribute("color",new a.Float32BufferAttribute(h,3)),t.setAttribute("uv",new a.Float32BufferAttribute(k,2)),t.setAttribute("aMat",new a.Float32BufferAttribute(y,1)),t.computeBoundingSphere(),t}};return r.wallX=(t,o,s,d,f,p,x,g=.82,b=1)=>r.quad([t,d,o],[t,d,s],[t,f,s],[t,f,o],[p,0,0],x,F,[o/1.5,d/1.5,s/1.5,f/1.5],[g,g,b,b]),r.wallZ=(t,o,s,d,f,p,x,g=.82,b=1)=>r.quad([o,d,t],[s,d,t],[s,f,t],[o,f,t],[0,0,p],x,F,[o/1.5,d/1.5,s/1.5,f/1.5],[g,g,b,b]),r.floor=(t,o,s,d,f=7,p=0)=>{const x=[t,t+f,o-f,o],g=[s,s+f,d-f,d],b=[.45,1,1,.45];for(let v=0;v<3;v++)for(let m=0;m<3;m++){const P=(z,C)=>Math.min(b[z],b[C]);r.quad([x[v],p,g[m]],[x[v],p,g[m+1]],[x[v+1],p,g[m+1]],[x[v+1],p,g[m]],[0,1,0],i.FLOOR,F,[0,0,1,1],[P(v,m),P(v,m+1),P(v+1,m+1),P(v+1,m)])}},r.archX=(t,o,s,d,f,p,x,g,b,v=i.LIME)=>{const m=d/2,P=f-m,z=14;r.wallX(t,p,s-m,0,g,b,v),r.wallX(t,s+m,x,0,g,b,v);for(let C=0;C<z;C++){const M=Math.PI*C/z,W=Math.PI*(C+1)/z,Z=s-m*Math.cos(M),H=P+m*Math.sin(M),G=s-m*Math.cos(W),D=P+m*Math.sin(W);r.quad([t,H,Z],[t,D,G],[t,g,G],[t,g,Z],[b,0,0],v,F,[0,0,1,1],[.9,.9,1,1]),o!==t&&r.quad([t,H,Z],[o,H,Z],[o,D,G],[t,D,G],[0,-Math.sin((M+W)/2),Math.cos((M+W)/2)],i.LIME1,[.86,.86,.86])}o!==t&&(r.quad([t,0,s-m],[o,0,s-m],[o,P,s-m],[t,P,s-m],[0,0,1],i.LIME,[.88,.88,.88],[0,0,1,1],[.7,.7,1,1]),r.quad([t,0,s+m],[o,0,s+m],[o,P,s+m],[t,P,s+m],[0,0,-1],i.LIME,[.88,.88,.88],[0,0,1,1],[.7,.7,1,1]))},r}function he(e,u){const h=n0();h.lathe([[.001,-1.5],[.62,-1.5],[1,-.06],[1.1,.04],[.001,-.1]],6,[0,0,0],i.POT);const k=(n,c,r,t,o,s)=>{const d=[n[0]-c[0]*t-r[0]*t,n[1]-c[1]*t-r[1]*t,n[2]-c[2]*t-r[2]*t],f=[n[0]+c[0]*t-r[0]*t,n[1]+c[1]*t-r[1]*t,n[2]+c[2]*t-r[2]*t],p=[n[0]+c[0]*t+r[0]*t,n[1]+c[1]*t+r[1]*t,n[2]+c[2]*t+r[2]*t],x=[n[0]-c[0]*t+r[0]*t,n[1]-c[1]*t+r[1]*t,n[2]-c[2]*t+r[2]*t],g=[c[1]*r[2]-c[2]*r[1],c[2]*r[0]-c[0]*r[2],c[0]*r[1]-c[1]*r[0]];h.quad(d,f,p,x,g,o,s)},y=n=>[.13*n,.34*n,.1*n];if(u){for(let n=0;n<5;n++){const c=(n-2)*.42+e.range(-.1,.1),r=.55+e.range(0,.5),t=e.range(.6,1);for(let o=0;o<3;o++){const s=.3-(o+.5)*1.5*t,d=e.range(-.5,.5);k([c+e.range(-.15,.15),s,r+o*.1],[Math.cos(d),0,Math.sin(d)],[0,1,0],.8,i.LEAF,y(e.range(.8,1.35))),(n+o)%2===0&&k([c+e.range(-.4,.4),s-.3,r+.35+o*.1],[1,0,0],[0,.94,.34],e.range(.34,.5),i.PETAL,[e.range(.8,1.05),0,(n*3+o)/15])}}k([0,.45,.2],[1,0,0],[0,.5,-.86],.95,i.LEAF,y(1.1))}else{for(let n=0;n<10;n++){const c=n/10*6.283*1.3+e.range(-.3,.3),r=n<3?e.range(.9,1.3):e.range(.15,.7),t=[Math.cos(c)*Math.cos(r),Math.sin(r),Math.sin(c)*Math.cos(r)],o=e.range(.75,1.15),s=[-Math.sin(c),0,Math.cos(c)],d=[-Math.cos(c)*Math.sin(r),Math.cos(r),-Math.sin(c)*Math.sin(r)];k([t[0]*o,.25+t[1]*o*.9,t[2]*o+.25],s,d,e.range(.8,1.1),i.LEAF,y(e.range(.7,1.35)*(.75+.25*t[1])))}for(let n=0;n<6;n++){const c=n*2.4+e.range(-.4,.4),r=e.range(.35,1.2),t=e.range(1.35,1.95),o=[Math.cos(c)*Math.cos(r),Math.sin(r),Math.sin(c)*Math.cos(r)],s=[-Math.sin(c),0,Math.cos(c)],d=[-Math.cos(c)*Math.sin(r),Math.cos(r),-Math.sin(c)*Math.sin(r)];k([o[0]*t,.3+o[1]*t,o[2]*t+.3],s,d,e.range(.42,.6),i.PETAL,[e.range(.8,1.05),0,n/6+.02])}}return h.build()}const L=[.035,.04,.05],N=[.34,.2,.11],ve=[.62,.5,.26],h0=[.6,.3,.16],Z0=[.07,.24,.12],r0=[.62,.3,.17],b0=[[.01,0],[.9,0],[1.45,1.1],[1.7,2.5],[1.4,3.9],[.85,4.5],[1.05,4.95],[.8,5],[.7,4.6]],g0=e=>(u,h)=>.55+.45*d0((h-e)/2.5,0,1);function me(e,u,h,k){const y=Math.cos(k),n=Math.sin(k),c=(r,t,o)=>[u+r*y+o*n,t,h-r*n+o*y];for(const[r,t]of[[-2,-2],[2,-2],[-2,2],[2,2]])e.rod(c(r,0,t),c(r,t<0?9.6:4.5,t),.26,i.WOOD,N,6);e.box(u,4.5,h,4.6,.45,4.6,i.WOOD,ve,k);for(const r of[1.6,3])e.rod(c(-2,r,-2),c(2,r,-2),.15,i.WOOD,N,5),e.rod(c(-2,r,2),c(2,r,2),.15,i.WOOD,N,5),e.rod(c(-2,r-.4,-2),c(-2,r-.4,2),.15,i.WOOD,N,5),e.rod(c(2,r-.4,-2),c(2,r-.4,2),.15,i.WOOD,N,5);for(const r of[6.2,7.6,9]){const t=new a.Matrix4().makeRotationY(k).setPosition(...c(0,r,-2));e.geo(new a.BoxGeometry(4.2,.8,.22),i.WOOD,N,t)}}function j(e,u,h,k,y,n,c=5,r=7){const t=(s,d,f)=>y==="z"?[u+s,d,k+n*f]:[u+n*f,d,k+s],o=(s,d,f,p,x,g,b,v,m=0)=>{const P=t(s,d,f);y==="z"?e.box(P[0],P[1],P[2],p,x,g,b,v,m):e.box(P[0],P[1],P[2],g,x,p,b,v,m)};o(0,h,.12,c,r,.2,i.PLAIN,[.02,.025,.04]),o(0,h-r/2-.3,.5,c+1.4,.6,1.2,i.LIME1,[.95,.95,.95]);for(let s=-2;s<=2;s++)e.rod(t(s*c/5,h-r/2,.6),t(s*c/5,h+r/2,.6),.12,i.IRON,L,4);for(let s=-1;s<=1;s++)e.rod(t(-c/2,h+s*r/3.2,.6),t(c/2,h+s*r/3.2,.6),.12,i.IRON,L,4);for(const s of[-1,1])o(s*(c/2+c/4-.1),h,.45,c/2,r,.25,i.WOOD,Z0,s*n*.25*(y==="z"?1:-1))}async function qe(e,u,h){e.floor(226,340,-40,-20,3);for(const[n,c]of[[-40,1],[-20,-1]])e.wallZ(n,234,340,0,14,c,i.TILE,.7,1),e.wallZ(n,234,340,14,16.1,c,i.LIME1,1,1),e.box(287,14.2,n+c*.25,106,.7,.5,i.PLAIN,[.05,.11,.36]),e.box(287,.6,n+c*.3,106,1.2,.6,i.PLAIN,[.05,.11,.36]);const k=12;for(let n=0;n<k;n++){const c=Math.PI*n/k,r=Math.PI*(n+1)/k,t=(c+r)/2,o=-30-10*Math.cos(c),s=16+10*Math.sin(c),d=-30-10*Math.cos(r),f=16+10*Math.sin(r);e.quad([234,s,o],[340,s,o],[340,f,d],[234,f,d],[0,-Math.sin(t),Math.cos(t)],i.LIME1);for(const p of[247,273,299,325])e.rod([p,s-.15*Math.sin(c),o+.15*Math.cos(c)],[p,f-.15*Math.sin(r),d+.15*Math.cos(r)],.7,i.LIME1,[.9,.9,.9],5)}e.wallX(340,-40,-20,0,26,-1,i.LIME,.6),e.box(339.5,9,-30,.6,18,12,i.WOOD,[.2,.12,.07]);for(let n=0;n<5;n++){const c=252+n*17,r=n%2?-37.6:-22.4;e.lathe(b0,10,[c,0,r],i.CLAY,h0,1.1+.25*u(),g0(0))}e.geo(new a.SphereGeometry(1.5,8,5,0,6.283,1.5,1.7),i.CLAY,[.3,.22,.16],new a.Matrix4().setPosition(268,24.2,-35)),await h(),e.archX(226,234,-30,20,28,-60,0,48,-1);const y=[230,18,-30];e.rod([230,18,-40],[230,18,-20],.42,i.IRON,L,6);for(let n=1;n<14;n++){const c=Math.PI*n/14;e.rod(y,[230,18+9.9*Math.sin(c),-30-9.9*Math.cos(c)],.2,i.IRON,L,4)}for(const n of[3.2,6.6,9.7])for(let c=0;c<14;c++){const r=Math.PI*c/14,t=Math.PI*(c+1)/14;e.rod([230,18+n*Math.sin(r),-30-n*Math.cos(r)],[230,18+n*Math.sin(t),-30-n*Math.cos(t)],.2,i.IRON,L,4)}for(let n=0;n<14;n++){const c=Math.PI*(n+.5)/14,r=new a.Matrix4().makeRotationY(Math.PI/2).setPosition(230,18+8.1*Math.sin(c),-30-8.1*Math.cos(c));e.geo(new a.TorusGeometry(.75,.14,4,9),i.IRON,L,r)}await h(),e.floor(160,226,-60,0,7),e.wallZ(-60,160,226,0,48,1,i.LIME),e.wallZ(0,160,226,0,48,-1,i.LIME),e.quad([160,48,-60],[226,48,-60],[226,46.6,-56.5],[160,46.6,-56.5],[0,-.85,.5],i.ROOF,r0),e.quad([160,48,0],[226,48,0],[226,46.6,-3.5],[160,46.6,-3.5],[0,-.85,-.5],i.ROOF,r0),e.archX(160,150,-30,20,28,-60,0,78,1),j(e,176,30,-60,"z",1),j(e,208,31,0,"z",-1),j(e,184,33,0,"z",-1,4.6,6.4),e.box(212,8,-59.7,8,16,.6,i.WOOD,Z0),e.box(212,16.6,-59.5,10,1.2,1,i.LIME1,[.95,.95,.95]),await h(),e.uvS=[22,2],e.lathe([[4.3,0],[5.1,0],[5.3,1.7],[5.1,2.1],[4.4,2.1],[4.3,1.3]],16,[196,0,-44],i.TILE),e.uvS=[1,1],e.geo(new a.CircleGeometry(4.35,20),i.WATER,F,new a.Matrix4().makeRotationX(-Math.PI/2).setPosition(196,1.55,-44)),e.lathe([[.7,0],[.5,2.6],[1.7,3.5],[1.8,3.75],[.3,3.6]],10,[196,0,-44],i.LIME1,[.85,.85,.82]),me(e,178,-50,.5),me(e,186,-53.5,-.35),e.geo(new a.CylinderGeometry(3,3,.4,14),i.WOOD,N,new a.Matrix4().setPosition(181.5,6.2,-55));for(let n=0;n<3;n++){const c=n*2.094+.4;e.rod([181.5+2.3*Math.cos(c),0,-55+2.3*Math.sin(c)],[181.5+.6*Math.cos(c),6,-55+.6*Math.sin(c)],.2,i.WOOD,N,5)}e.lathe([[.01,0],[.6,0],[.95,.9],[.8,1.8],[.4,2.2],[.5,2.6]],9,[181,6.4,-55.3],i.CLAY,h0),e.archX(150,150,-30,20,28,-75,15,78,-1)}function Fe(){const e=n0();for(let u=0;u<=10;u++){const h=.15+u*.97,k=u%2?16.4:17.6;e.rod([0,.3,h],[0,k,h],u===0||u===10?.3:.17,i.IRON,L,5),u>0&&u<10&&e.geo(new a.ConeGeometry(.34,1.1,4),i.IRON,L,new a.Matrix4().setPosition(0,k+.5,h))}for(const u of[.5,5.4,7.4,15.4])e.rod([0,u,0],[0,u,9.95],.26,i.IRON,L,5);for(let u=0;u<5;u++)for(const[h,k]of[[6.4,.78],[11.4,1.5]]){const y=new a.Matrix4().makeRotationY(Math.PI/2).setPosition(0,h,1.1+u*1.94);e.geo(new a.TorusGeometry(k>1?.9:k,.13,4,12),i.IRON,L,y),k>1&&(e.geo(new a.TorusGeometry(.55,.12,4,10,4.4),i.IRON,L,new a.Matrix4().makeRotationY(Math.PI/2).setPosition(0,h+1.6,1.1+u*1.94)),e.geo(new a.TorusGeometry(.55,.12,4,10,4.4),i.IRON,L,new a.Matrix4().makeRotationY(Math.PI/2).multiply(new a.Matrix4().makeRotationZ(Math.PI)).setPosition(0,h-1.6,1.1+u*1.94)))}for(let u=0;u<5;u++)e.geo(new a.TorusGeometry(.72,.12,4,12),i.IRON,L,new a.Matrix4().makeRotationY(Math.PI/2).setPosition(0,2.95,1.1+u*1.94));return e.build()}const pe=[[66.5,22.6,-37.3,1.2],[66.5,23.6,-22.7,1.1],[55.5,23.2,-37.5,1.15],[55.5,22.2,-22.5,1.25]];async function Ne(e,u){e.floor(72,150,-75,15,7),e.floor(150,160,-40,-20,0),e.floor(50,72,-41,-19,0),e.wallZ(-75,72,150,0,78,1,i.LIME),e.wallZ(15,72,150,0,78,-1,i.LIME),e.quad([72,78,-75],[150,78,-75],[150,76.4,-71],[72,76.4,-71],[0,-.85,.5],i.ROOF,r0),e.quad([72,78,15],[150,78,15],[150,76.4,11],[72,76.4,11],[0,-.85,-.5],i.ROOF,r0),e.archX(72,50,-30,22,32,-75,15,140,1),e.quad([72,141.5,-75],[72,141.5,15],[76,139.6,15],[76,139.6,-75],[.5,-.85,0],i.ROOF,r0);for(const[h,k]of[[-41,1],[-19,-1]])e.wallZ(h+k*.06,50,72,0,13.5,k,i.TILE,.7,1),e.box(61,13.7,h+k*.22,22,.7,.5,i.PLAIN,[.05,.11,.36]),e.box(61,.6,h+k*.28,22,1.2,.6,i.PLAIN,[.05,.11,.36]);for(const[h,k,y,n]of pe){const c=21+Math.sqrt(Math.max(121-(y+30)*(y+30),0)),r=k+3.4*n;for(let t=0;t<3;t++){const o=t*2.094+.5;e.rod([h+Math.cos(o)*1.05*n,k,y+Math.sin(o)*1.05*n],[h,r,y],.07,i.IRON,L,4)}e.rod([h,r,y],[h,c,y],.08,i.IRON,L,4),e.geo(new a.TorusGeometry(.28,.07,4,8),i.IRON,L,new a.Matrix4().setPosition(h,r,y))}j(e,96,40,-75,"z",1),j(e,128,52,-75,"z",1,4.6,6.6),j(e,110,44,15,"z",-1),j(e,72,58,-52,"x",1,5.4,7.6),j(e,72,86,-8,"x",1),j(e,72,112,-44,"x",1,5,7),j(e,72,52,2,"x",1,4.6,6.4),await u(),e.uvS=[36,2],e.lathe([[5.6,0],[8.6,0],[8.6,2.6],[8.3,3],[5.9,3],[5.6,2.6]],18,[112,0,-14],i.TILE),e.uvS=[1,1],e.geo(new a.CircleGeometry(5.7,14),i.SOIL,F,new a.Matrix4().makeRotationX(-Math.PI/2).setPosition(112,2.5,-14)),e.lathe(b0,10,[84,0,-66],i.CLAY,h0,1.5,g0(0)),e.lathe(b0,10,[141,0,6],i.CLAY,h0,1.3,g0(0)),e.lathe(b0,10,[80,0,7],i.CLAY,h0,1.2,g0(0))}async function Ge(e,u,h,k,y){e.floor(-50,50,-70,70,8),e.wallZ(-70,-50,50,0,140,1,i.LIME,.8),e.wallZ(70,-50,50,0,140,-1,i.LIME,.8),e.archX(50,50,-30,22,32,-70,70,140,-1);const n=(o,s,d,f,p)=>e.quad(o,s,d,f,p,i.ROOF,r0);n([-50,141.5,-70],[50,141.5,-70],[50,139.6,-66],[-50,139.6,-66],[0,-.85,.5]),n([-50,139.6,-66],[50,139.6,-66],[50,140.5,-66],[-50,140.5,-66],[0,0,1]),n([-50,141.5,70],[50,141.5,70],[50,139.6,66],[-50,139.6,66],[0,-.85,-.5]),n([-50,139.6,66],[50,139.6,66],[50,140.5,66],[-50,140.5,66],[0,0,-1]),n([50,141.5,-70],[50,141.5,70],[46,139.6,70],[46,139.6,-70],[-.5,-.85,0]),n([46,139.6,-70],[46,139.6,70],[46,140.5,70],[46,140.5,-70],[-1,0,0]),n([-90,152,-100],[90,152,-100],[90,140.5,-66],[-90,140.5,-66],[0,.95,.31]),n([-90,152,100],[90,152,100],[90,140.5,66],[-90,140.5,66],[0,.95,-.31]),n([61,150,-100],[61,150,100],[46,140.5,100],[46,140.5,-100],[-.55,.83,0]),n([-84,152,-100],[-84,152,100],[-45.4,141.2,100],[-45.4,141.2,-100],[.27,.96,0]),await y();const c=(o,s,d,f,p)=>{e.box(o,140+p/2,s,d,p,f,i.LIME1),e.box(o,140+p+.5,s,d+1.2,1,f+1.2,i.ROOF,r0),e.box(o,140+p+1.8,s,d*.6,1.6,f*.6,i.LIME1,[.9,.9,.9])};c(50,h,5,8.4,k+2.5),c(20,-76,6,4,13),c(-58,-30,4,6,11),c(-30,77,6,4,9);const r=[-63,-49,-35,-21,-7,7,21,35,49,63];for(const o of r){const s=o===-35||o===-21?35:0;e.box(41.6,(140+s)/2,o,1.3,140-s,1.3,i.WOOD,N)}for(const o of[35,70,105]){await y(),e.box(45.5,o-.4,0,9,.8,140,i.WOOD,N),e.box(41.4,o-1.3,0,.9,1.6,140,i.WOOD,[.28,.16,.09]),e.box(41.3,o+4.9,0,.6,.5,140,i.WOOD,N);for(let s=0;s<20;s++)e.box(45.6,o-1.3,-66.5+s*7,8.6,1,.7,i.WOOD,[.26,.15,.085]);await y();for(let s=0;s<80;s++)e.lathe([[.2,0],[.34,1.1],[.15,2.3],[.34,3.5],[.2,4.7]],4,[41.3,o,-69.1+s*1.75],i.WOOD,N);for(const s of r)e.rod([41.6,o-5,s],[44.6,o-1.2,s],.4,i.WOOD,N,4);await y();for(let s=0;s<5;s++){const d=-56+s*28+(o===70?9:0);e.box(49.7,o+6.5,d,.5,13,6.4,i.WOOD,s%2?Z0:[.2,.12,.07]),j(e,50,o+9,d+13,"x",-1,4.4,6)}}for(let o=0;o<6;o++)e.lathe(b0,10,[45.5,0,-62+o*14+(o>1?30:0)-(o>3?4:0)],i.CLAY,h0,1.45+.3*u(),g0(0));await y();for(let o=0;o<560;o++){const s=o>=300&&o<470,d=o>=470;(o&127)===0&&await y();let f=s?2+u()*104:2+u()*136,p=u()*6.283,x=.9+u()*(s?1.1:1.5),g=.75+u()*.8,b=s?21:-63;if(d){const M=[35,70,105][o%3],W=u();b=(o%2?21:-63)+(u()<.5?-1:1)*W*9,f=M+4.6-3.4*W*(1-W)*4*.5+u()*1.2,x=.3+u()*.6,p=Math.PI+(u()-.5)*2.4}const v=[41.6+Math.cos(p)*x,f,b+Math.sin(p)*x],m=[-Math.sin(p)*g,0,Math.cos(p)*g],P=[0,g,0],z=.7+.6*u(),C=o%3===0;e.quad([v[0]-m[0]-P[0],v[1]-P[1],v[2]-m[2]-P[2]],[v[0]+m[0]-P[0],v[1]-P[1],v[2]+m[2]-P[2]],[v[0]+m[0]+P[0],v[1]+P[1],v[2]+m[2]+P[2]],[v[0]-m[0]+P[0],v[1]+P[1],v[2]-m[2]+P[2]],[Math.cos(p),0,Math.sin(p)],C?i.PETAL:i.LEAF,C?[.85,.85,.78]:[.09*z,.25*z,.07*z])}const t=[];for(let o=0;o<3;o++){await y();const s=o%2?-32:8,d=o%2?1:-1,f=o*26;for(let x=0;x<20;x++){const g=s+d*(x+.5)*2,b=f+(x+1)*1.3;e.box(g,b,66.4,2.3,.28,6.6,i.IRON,[.05,.055,.065]),t.push([g,b+.14,68.6]),x%2===0&&e.rod([g,b,63.3],[g,b+5,63.3],.14,i.IRON,L,4)}for(const x of[63.2,69.7])e.rod([s,f+.4,x],[s+d*40,f+26.4,x],.34,i.IRON,L,5);e.rod([s,f+5.6,63.3],[s+d*40,f+31.6,63.3],.2,i.IRON,L,5);const p=s+d*43;e.box(p,f+26,66.4,6,.3,6.6,i.IRON,[.05,.055,.065]),e.rod([p,f+26,63.4],[p,f+21,70],.3,i.IRON,L,5),e.rod([p-d*3,f+26,63.4],[p-d*3,f+20,70],.3,i.IRON,L,5),e.rod([p+d*3,f+26,63.3],[p+d*3,f+31.2,63.3],.16,i.IRON,L,4),e.rod([p-d*3,f+31.2,63.3],[p+d*3,f+31.2,63.3],.2,i.IRON,L,5);for(const x of[s+d*14,s+d*28])e.rod([x,f+(x-s)*d*.65,63.4],[x,f+(x-s)*d*.65-5,70],.26,i.IRON,L,5)}await y(),e.uvS=[18,6],e.lathe([[3.4,0],[4.2,0],[4.2,8.4],[4.45,8.5],[4.45,9],[3.5,9],[3.4,8.2]],20,[0,0,28],i.TILE,F,1,(o,s)=>.6+.4*d0(s/3,0,1)),e.uvS=[1,1],e.geo(new a.CircleGeometry(3.45,16),i.WATER,F,new a.Matrix4().makeRotationX(-Math.PI/2).setPosition(0,7.2,28));for(const o of[-4.3,4.3])e.rod([o,0,28],[o,14.6,28],.34,i.IRON,L,6),e.geo(new a.TorusGeometry(1.1,.16,4,12),i.IRON,L,new a.Matrix4().setPosition(o*.72,13.6,28));for(let o=0;o<10;o++){const s=Math.PI*o/10,d=Math.PI*(o+1)/10;e.rod([-4.3*Math.cos(s),14.6+4.3*Math.sin(s),28],[-4.3*Math.cos(d),14.6+4.3*Math.sin(d),28],.32,i.IRON,L,6)}return e.rod([0,18.9,28],[0,20.4,28],.2,i.IRON,L,4),e.geo(new a.TorusGeometry(.9,.3,5,12),i.IRON,L,new a.Matrix4().setPosition(0,17.4,28)),e.rod([.9,17.4,28],[.9,12.6,28],.1,i.WOOD,ve,4),e.lathe([[.01,0],[.75,0],[1,1.9],[.92,1.9],[.7,.2]],10,[.9,10.4,28],i.WOOD,[.3,.2,.12]),e.geo(new a.TorusGeometry(1,.07,4,10,Math.PI),i.IRON,L,new a.Matrix4().setPosition(.9,12.2,28)),{treads:t}}function t0(e,u,h){const k=Math.floor(h.len/4.3),y=Math.floor((h.y1-h.y0)/4.9),n=[];for(let r=0;r<y;r++)for(let t=0;t<k;t++)n.push([t,r]);u.shuffle(n);let c=0;for(const[r,t]of n){if(c>=h.count)break;const o=(r+.5)*(h.len/k)+u.range(-1.1,1.1),s=h.y0+(t+.5)*((h.y1-h.y0)/y)+u.range(-.8,.8),d=.7+1*Math.pow(u(),.8),f=u(),p=[u(),u(),u(),u(),u()];h.skip&&h.skip(o,s)||(e.push({p:[h.at[0]+h.along[0]*o+h.n[0]*3,s,h.at[1]+h.along[1]*o+h.n[1]*3],n:h.n,s:d,kind:f,q:p,wall:!0}),c++)}}const i0=(e,u,h,k,y,n,c)=>e.push({p:[h,k+1.5*c,y],n,s:c,kind:u()*.92,q:[u(),u(),u(),u(),u()],wall:!1});function H0(e,u,h,k,y,n){const c=n==="dawn",t=c?[.12,.52,.3,.06]:n==="moon"?[.1,.08,.76,.06]:[.72,.14,.09,.05],o=c?.34:.14,s=new a.Group,d=new a.Matrix4,f=new a.Quaternion,p=new a.Euler,x=new a.Vector3,g=new a.Vector3;for(const v of[!1,!0]){const m=e.filter(M=>(M.kind>=.72&&M.kind<.92)===v);if(!m.length)continue;const P=new a.InstancedMesh(v?u.trail:u.mound,h,m.length),z=new Float32Array(m.length*4),C=new Float32Array(m.length*4);m.forEach((M,W)=>{const Z=Math.atan2(M.n[0],M.n[1]);p.set((M.q[0]-.5)*.28,Z+(M.q[1]-.5)*.5,(M.q[2]-.5)*.28,"YXZ");const H=v?M.s*(.9+.5*M.q[3]):M.s;d.compose(x.set(M.p[0],M.p[1],M.p[2]),f.setFromEuler(p),g.set(H,H,H)),P.setMatrixAt(W,d);const G=M.q[3]<o?y.terra:M.q[3]<o+.08?y.glaze:y.cobalt,D=M.q[4],o0=D<t[0]?y.scarlet:D<t[0]+t[1]?y.coral:D<t[0]+t[1]+t[2]?y.white:y.pink;z.set([G.r,G.g,G.b,M.q[0]],W*4),C.set([o0.r,o0.g,o0.b,M.kind>=.92||M.fern?0:.2+.8*M.q[2]],W*4)}),P.geometry=P.geometry.clone(),P.geometry.setAttribute("iA",new a.InstancedBufferAttribute(z,4)),P.geometry.setAttribute("iB",new a.InstancedBufferAttribute(C,4)),P.computeBoundingSphere(),s.add(P)}const b=e.filter(v=>v.wall);if(b.length){const v=new a.InstancedBufferGeometry;v.setAttribute("position",new a.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),v.setIndex([0,1,2,0,2,3]);const m=new Float32Array(b.length*4),P=new Float32Array(b.length*2),z=new a.Box3;b.forEach((M,W)=>{m.set([M.p[0]-M.n[0]*3,M.p[1],M.p[2]-M.n[1]*3,M.s*1.5],W*4),P.set(M.n,W*2),z.expandByPoint(x.set(M.p[0],M.p[1],M.p[2]))}),v.setAttribute("iP",new a.InstancedBufferAttribute(m,4)),v.setAttribute("iN",new a.InstancedBufferAttribute(P,2)),v.instanceCount=b.length,v.boundingSphere=z.getBoundingSphere(new a.Sphere),v.boundingSphere.radius+=14;const C=new a.Mesh(v,k);C.renderOrder=1,s.add(C)}return s}const De=e=>`
${e}
attribute vec4 iP; attribute vec2 iN;
varying vec2 vQ; varying vec3 vW, vPar;
#include <fog_pars_vertex>
void main(){
  vec3 n = vec3(iN.x, 0., iN.y), t = vec3(-n.z, 0., n.x);
  vec3 S = vec3(uSunDir.z, uSunDir.y, -uSunDir.x);
  float sn = dot(S, n);
  float k = sn > 0.02 ? 1. / max(sn, 0.4) : 1.;                 // a raking sun stretches the shadow
  vec2 sh = sn > 0.02 ? -3. * vec2(dot(S, t), S.y) * k : vec2(0., -0.01);
  float L = length(sh); vec2 e = sh / max(L, 1e-3);
  float r = iP.w, R = r + 1.7;
  float al = mix(-R, L + r * k + 0.6, position.x * 0.5 + 0.5), ac = position.y * R;
  vQ = vec2(al, ac);
  vec2 w2 = e * al + vec2(-e.y, e.x) * ac;
  vec3 wp = iP.xyz + t * w2.x + vec3(0., w2.y, 0.) + n * 0.08;
  vW = wp; vPar = vec3(L, r * k, r);
  vec4 mvPosition = viewMatrix * vec4(wp, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,_e=e=>`
${e}
uniform vec3 uZen, uHor, uLime;
${I0}
varying vec2 vQ; varying vec3 vW, vPar;
#include <fog_pars_fragment>
void main(){
  float ao = exp(-dot(vQ, vQ) / (vPar.z * vPar.z * 1.5)) * 0.55;
  vec2 q = (vQ - vec2(vPar.x, 0.)) / max(vPar.yz, vec2(1e-3));
  float sh = (1. - smoothstep(0.72, 1.08, length(q))) * worldSun(vW) * 0.9;
  float a = max(ao, sh);
  if (a < 0.01) discard;
  vec3 col = uLime * uSkyCol * mix(0.32, 0.7, clamp(sh / max(a, 1e-3) - ao, 0., 1.));
  gl_FragColor = vec4(col, a);
  #include <fog_fragment>
}`,Ve=`
varying vec3 vDir;
void main(){ vDir = position; vec4 p = projectionMatrix * viewMatrix * vec4(position + cameraPosition, 1.); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }`,je=e=>`
${e}
uniform vec3 uZen, uHor, uCirrus; uniform float uCloudT, uStars, uPuff, uHorTop;
varying vec3 vDir;
void main(){
  vec3 d = normalize(vDir + vec3(0., 1e-5, 0.));
  vec3 col = mix(uHor, uZen, smoothstep(-0.02, uHorTop, d.y));
  vec2 p = d.xz / max(d.y + 0.3, 0.12);
  p.x += uCloudT;
  // the north-west corner of the sky square, where the portal hangs, stays clean deep blue
  float clear = 1. - 0.9 * smoothstep(0.55, 0.9, dot(d, vec3(-0.38, 0.84, -0.38)));
  float band = fbm3(p * vec2(0.55, 1.7) + 4.);
  float comb = vnoise(vec2(p.x * 1.1 + 2.5 * vnoise(p * 0.6), p.y * 13.));
  float c = smoothstep(0.6, 0.84, band) * (0.25 + 0.75 * comb * comb) * smoothstep(0.0, 0.35, d.y) * clear;
  col = mix(col, uCirrus, c * 0.5);
  float pf = smoothstep(0.62, 0.76, fbm3(p * 1.25 + vec2(uCloudT * 1.6, 9.))) * uPuff * smoothstep(0.05, 0.4, d.y) * clear;
  col = mix(col, uCirrus * (0.62 + 0.3 * fbm3(p * 4. + uCloudT)), pf * 0.85);
  // stars: one small round point somewhere inside a cell in sixteen, each with its own size and twinkle
  vec2 sq = d.xz / max(d.y + 0.2, 0.1) * 60., sg = floor(sq);
  vec2 sr = h22(sg);
  float sd = length(fract(sq) - 0.5 - (sr - 0.5) * 0.6);
  float mag = h21(sg + 3.7);
  float st = step(0.94, h21(sg)) * (1. - smoothstep(0.03, 0.1 + 0.1 * mag, sd)) * (0.5 + 2.2 * mag * mag) * (0.72 + 0.28 * sin(uTime * (1.5 + 3. * sr.x) + sr.y * 40.));
  col += vec3(0.75, 0.84, 1.) * (st * uStars * (1. - c) * smoothstep(0.08, 0.4, d.y));
  gl_FragColor = vec4(col, 1.);
}`,Ze=e=>`
${e}
uniform vec3 uZen, uHor;
${I0}
attribute vec4 iP;
uniform vec3 uCam; uniform float uPx, uMist;
varying vec2 vQ; varying vec3 vCol;
void main(){
  vec3 box = vec3(70., 56., 70.);
  vec3 drift = vec3(0.5 * sin(uTime * 0.21 + iP.w * 30.), 0.35 + 0.3 * sin(uTime * 0.17 + iP.w * 50.), 0.5 * cos(uTime * 0.19 + iP.w * 40.));
  vec3 p = iP.xyz * box + drift * 2. + vec3(uTime * 0.25, uTime * 0.12, 0.);
  p = mod(p - uCam + box * 0.5, box) - box * 0.5 + uCam;
  float sun = worldSun(p);
  vec4 mv = viewMatrix * vec4(p, 1.);
  float dist = max(-mv.z, 0.01);
  float size = 0.018 + 0.03 * fract(iP.w * 7.3);
  float minS = 1.4 * dist / max(uPx, 1.);
  float k = min(size / minS, 1.); k *= k;
  size = max(size, minS);
  float tw = 0.55 + 0.45 * sin(uTime * (1.5 + 3. * fract(iP.w * 3.1)) + iP.w * 80.);
  float fade = smoothstep(2.5, 8., dist) * (1. - smoothstep(26., 36., dist)) * (1. - smoothstep(126., 137., p.y)) * step(0.3, p.y);
  float gate = smoothstep(232., 240., p.x) * exp(-max(p.x - 234., 0.) / 50.);
  vCol = (uSunCol * (sun * 0.6 * tw) + uSkyCol * (0.07 + 0.1 * uMist) + (uSunCol * 0.8 + uSkyCol * 1.2) * (gate * tw)) * (k * fade);
  vQ = position.xy;
  mv.xy += position.xy * size;
  gl_Position = projectionMatrix * mv;
}`,He=`
varying vec2 vQ; varying vec3 vCol;
void main(){ float a = 1. - smoothstep(0.3, 1., length(vQ)); gl_FragColor = vec4(vCol * a, 0.); }`,Ue=e=>`
${e}
uniform vec3 uZen, uHor;
${I0}
attribute vec4 iP, iV;
varying vec2 vQ; varying vec3 vCol;
#include <fog_pars_vertex>
void main(){
  float life = iV.w, t = fract(uTime / life + iP.w) * life;
  vec3 p = iP.xyz + iV.xyz * t + vec3(0., -9. * t * t, 0.);
  vec4 mvPosition = viewMatrix * vec4(p, 1.);
  float s = 0.09 + 0.1 * fract(iP.w * 9.7);
  vQ = position.xy;
  mvPosition.xy += position.xy * vec2(s, s * 1.5);
  vCol = uSkyCol * 1.3 + skyColor(vec3(0., 1., 0.)) * 0.5 + uSunCol * (worldSun(p) * 1.5);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Qe=`
varying vec2 vQ; varying vec3 vCol;
#include <fog_pars_fragment>
void main(){ float r = length(vQ); if (r > 1.) discard; gl_FragColor = vec4(vCol * (0.5 + 0.7 * smoothstep(0.9, 0.2, length(vQ - vec2(-0.3, 0.3)))), 0.75); 
  #include <fog_fragment>
}`;function U0(e,u){const h=new a.InstancedBufferGeometry;h.setAttribute("position",new a.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),h.setIndex([0,1,2,0,2,3]);const k=new Float32Array(e*4),y=new Float32Array(e*4);for(let n=0;n<e;n++)u(n,k,y);return h.setAttribute("iP",new a.InstancedBufferAttribute(k,4)),h.setAttribute("iV",new a.InstancedBufferAttribute(y,4)),h.instanceCount=e,h}function we(e,u){const h=n0(),k=u.height,y=u.radius,n=k-y*.95;h.lathe([[y*.085,0],[y*.075,k*.2],[y*.06,n-y*.5],[y*.03,n]],8,[0,0,0],i.WOOD,[.2,.15,.1]);for(let r=0;r<6;r++){const t=r*1.047+e()*.5,o=y*(.45+.3*e());h.rod([0,n-y*(.75-.08*r),0],[Math.cos(t)*o,n+y*(-.1+.5*e()),Math.sin(t)*o],y*.028,i.WOOD,[.2,.15,.1],5)}const c=u.leaves;for(let r=0;r<c;r++){const t=e()*6.283,o=Math.asin(e()*1.7-.7),s=y*(.55+.45*Math.pow(e(),.4)),d=[Math.cos(t)*Math.cos(o),Math.sin(o),Math.sin(t)*Math.cos(o)],f=[d[0]*s,n+d[1]*s*.92,d[2]*s],p=y*(.13+.07*e()),x=e()*6.283,g=[-Math.sin(t),0,Math.cos(t)],b=[-d[1]*Math.cos(t),Math.cos(o),-d[1]*Math.sin(t)],v=[(g[0]*Math.cos(x)+b[0]*Math.sin(x))*p,(g[1]*Math.cos(x)+b[1]*Math.sin(x))*p,(g[2]*Math.cos(x)+b[2]*Math.sin(x))*p],m=[(b[0]*Math.cos(x)-g[0]*Math.sin(x))*p,(b[1]*Math.cos(x)-g[1]*Math.sin(x))*p,(b[2]*Math.cos(x)-g[2]*Math.sin(x))*p],P=(.5+.7*(s/y-.55)/.45)*(.75+.5*e())*(.7+.3*(d[1]+1)/2),z=[[f[0]-v[0]-m[0],f[1]-v[1]-m[1],f[2]-v[2]-m[2]],[f[0]+v[0]-m[0],f[1]+v[1]-m[1],f[2]+v[2]-m[2]],[f[0]+v[0]+m[0],f[1]+v[1]+m[1],f[2]+v[2]+m[2]],[f[0]-v[0]+m[0],f[1]-v[1]+m[1],f[2]-v[2]+m[2]]];if(h.quad(z[0],z[1],z[2],z[3],d,i.LEAF,[.1*P,.3*P,.07*P]),r<u.fruit){const C=new a.Matrix4().makeScale(1,u.long,1).setPosition(d[0]*y*.98,n+d[1]*y*.9-y*.06,d[2]*y*.98);h.geo(new a.IcosahedronGeometry(y*.055,1),i.PLAIN,u.fruitColor,C,(M,W)=>.75+.25*d0((W-n)/y+.5,0,1))}else if(r<u.fruit+u.blossom){const C=[d[0]*y*1.02,n+d[1]*y*.95,d[2]*y*1.02],M=y*.05;h.quad([C[0]-g[0]*M-b[0]*M,C[1]-b[1]*M,C[2]-g[2]*M-b[2]*M],[C[0]+g[0]*M-b[0]*M,C[1]-b[1]*M,C[2]+g[2]*M-b[2]*M],[C[0]+g[0]*M+b[0]*M,C[1]+b[1]*M,C[2]+g[2]*M+b[2]*M],[C[0]-g[0]*M+b[0]*M,C[1]+b[1]*M,C[2]-g[2]*M+b[2]*M],d,i.PETAL,[.86,.86,.8])}}return h.build()}function Xe(){const e=n0(),u=[.42,.3,.1];e.rod([0,0,0],[0,-4.2,0],.11,i.IRON,L,4),e.geo(new a.ConeGeometry(1.25,1.1,6),i.IRON,u,new a.Matrix4().setPosition(0,-4.6,0));for(let h=0;h<6;h++){const k=h*1.047;e.rod([Math.cos(k)*1.05,-5.1,Math.sin(k)*1.05],[Math.cos(k)*.8,-7.4,Math.sin(k)*.8],.09,i.IRON,u,4)}return e.geo(new a.CylinderGeometry(.98,.74,2.2,6,1,!0),i.GLASS,[1,.62,.22],new a.Matrix4().setPosition(0,-6.25,0)),e.geo(new a.CylinderGeometry(.85,.5,.35,6),i.IRON,u,new a.Matrix4().setPosition(0,-7.55,0)),e.geo(new a.TorusGeometry(.3,.07,4,8),i.IRON,u,new a.Matrix4().setPosition(0,-8,0)),e.build()}var Je={id:"patio-of-pots",name:"Patio of Three Thousand Pots",category:"domestic",weirdness:.05,media:["air","interior"],async build(e){const u=e.rng.fork("patio-of-pots"),h=e.quality?.detail??1,k=e.vary||{},y=d0(k.density??1,.7,1.3),n=!!k.rare,c=["may","dawn","moon","shower","may"][Math.abs(Math.floor(e.seed||0))%5],r=k.hour||"any",t=r==="night"?"moon":r==="dawn"||r==="golden"?"dawn":r==="day"?c==="shower"?"shower":"may":c,o=We[t],s=new a.Scene;s.fog=new a.FogExp2(o.fog,o.fogD);const d=Se(V0),f=await ze(e,{palette:w0,look:t,altitude:t==="dawn"?[9,53]:void 0,demo:!1});f.object.position.set(-50,0,0),f.object.rotation.y=Math.PI/2,s.add(f.object),f.object.updateMatrixWorld(!0),f.uniforms.uSkyCol.value.multiply(new a.Color(.86,.97,1.1)).multiplyScalar(o.shade),await e.yield();const p=l=>new a.Color(l),x={lime:p(w0[0]),cobalt:p(w0[2]),scarlet:p(w0[3]),terra:p(w0[5]),glaze:new a.Color(.78,.78,.74),coral:p("#F0603E"),white:new a.Color(.84,.84,.8),pink:p("#C2185B")},g=f.anchors.toWorld(f.anchors.lamp),b=[new a.Vector4(286,19.5,-30,0),new a.Vector4(196,20,-56,0),new a.Vector4(112,21,10.5,0),new a.Vector4(7.5,12,28,0),new a.Vector4(g.x,g.y,g.z,0),new a.Vector4(69.5,23.8,-30,0),new a.Vector4(39.4,59.6,27,0)],v={...a.UniformsLib.fog,...f.uniforms,uZen:{value:p(o.zen)},uHor:{value:p(o.hor)},uCirrus:{value:p(o.cirrus)},uLime:{value:x.lime},uCobalt:{value:x.cobalt},uScarlet:{value:x.scarlet},uLamp:{value:b},uLampCol:{value:new a.Color(1,.56,.2)},uLampK:{value:o.lamp},uFloorWet:{value:o.wet},uPuddle:{value:t==="shower"?1:0},uCloudT:{value:0},uStars:{value:o.stars},uPuff:{value:t==="shower"?1:0},uHorTop:{value:t==="dawn"?1.08:.72},uCam:{value:new a.Vector3},uPx:{value:500},uMist:{value:o.mist},uGateOpen:{value:0},uGateH:{value:50},uLift:{value:t==="moon"?.3:1},uOpenSky:{value:t==="moon"?0:1}};if(o.lamp){for(const l of b)l.w=1.5;b[4].w=2.2,f.uniforms.uHLamp.value.w=3}const m=f.glsl,P=new a.ShaderMaterial({uniforms:v,vertexShader:Ae,fragmentShader:Re(m),fog:!0,side:a.DoubleSide}),z=new a.ShaderMaterial({uniforms:v,vertexShader:De(m),fragmentShader:_e(m),fog:!0,transparent:!0,depthWrite:!1,side:a.DoubleSide});await e.yield();const C=new a.Group,M=new a.Group,W=new a.Group;s.add(C,M,W);const Z=(l,w)=>{const S=new a.Mesh(l.build(),P);return w.add(S),S};{const l=n0();await qe(l,u.fork("zone-a"),e.yield),await e.yield(),Z(l,C),await e.yield()}{const l=n0();await Ne(l,e.yield),await e.yield(),Z(l,M),await e.yield()}let H;{const l=n0();({treads:H}=await Ge(l,u.fork("zone-c"),-f.uniforms.uChimX.value,f.uniforms.uChimH.value,e.yield)),await e.yield(),Z(l,W),await e.yield()}const G=Fe(),D=new a.Mesh(G,P),o0=new a.Mesh(G,P);D.position.set(230,0,-40),o0.position.set(230,0,-20),o0.scale.z=-1,C.add(D,o0);const ye=Xe(),z0=b.map((l,w)=>{const S=new a.Mesh(ye,P),O=w===5?1.3:1;return S.scale.setScalar(O),S.position.set(l.x,l.y+6.3*O,l.z),S.visible=w===0||w>=4||!!o.lamp,(w<2?C:w===2||w===5?M:W).add(S),S});await e.yield();const I=u.fork("pots"),K=l=>Math.round(l*(.85+.15*y)),U=[],l0=[],_=[];t0(U,I,{at:[160,-60],along:[1,0],len:66,y0:6,y1:44,n:[0,1],count:K(105),skip:(l,w)=>Math.abs(l-52)<7&&w<20}),t0(U,I,{at:[160,0],along:[1,0],len:66,y0:6,y1:44,n:[0,-1],count:K(95)}),t0(U,I,{at:[160,-60],along:[0,1],len:60,y0:6,y1:75,n:[1,0],count:K(140),skip:(l,w)=>Math.abs(l-30)<13.5&&w<33});{const l=Oe(Ce("patio-of-pots:garland:"+e.seed)),w=()=>[l(),l(),l(),l(),l()];for(const S of[-12.4,12.4])for(let O=0;O<4;O++)U.push({p:[163,10.5+O*4.4+l(),-30+S+(l()-.5)],n:[1,0],s:.95+.4*l(),kind:l()*.7,q:w(),wall:!0});for(let S=0;S<7;S++){const O=Math.PI*(S+.5)/7;U.push({p:[163,18.5+13.2*Math.sin(O)+(l()-.5),-30-13.2*Math.cos(O)+(l()-.5)],n:[1,0],s:.95+.4*l(),kind:l()*.7,q:w(),wall:!0})}for(const[S,O,E,V]of pe)l0.push({p:[S,O,E],n:[1,0],s:V,kind:.8,q:[l(),l(),.3+.7*l(),.25+.2*l(),l()],wall:!1})}for(let l=0;l<4;l++)i0(U,I,196+6.6*Math.cos(l*1.57+.6),0,-44+6.6*Math.sin(l*1.57+.6),[0,1],.8+.3*I());for(const[l,w,S]of[[252,-37.6,1.2],[269,-22.4,1.2],[286,-37.6,1.25],[303,-22.4,1.2],[320,-37.6,1.2]])i0(U,I,l,5.7-1.5*S,w,[0,w<-30?1:-1],S),U[U.length-1].fern=!0;t0(l0,I,{at:[72,-75],along:[0,1],len:90,y0:6,y1:136,n:[1,0],count:K(320),skip:(l,w)=>Math.abs(l-45)<14.5&&w<37}),t0(l0,I,{at:[72,-75],along:[1,0],len:78,y0:6,y1:75,n:[0,1],count:K(140)}),t0(l0,I,{at:[72,15],along:[1,0],len:78,y0:6,y1:75,n:[0,-1],count:K(110)});for(let l=0;l<7;l++)i0(l0,I,112+7.2*Math.cos(l*.9+.3),3,-14+7.2*Math.sin(l*.9+.3),[Math.cos(l*.9+.3),Math.sin(l*.9+.3)],.75+.3*I());t0(_,I,{at:[-50,-70],along:[1,0],len:100,y0:6,y1:136,n:[0,1],count:K(420)});const be=(l,w)=>{const S=l-50;if(S<-41||S>17||w>90)return!1;for(let O=0;O<3;O++){const E=O%2?-32:8,V=O%2?1:-1,q=(S-E)*V;if(q>-4&&q<47&&Math.abs(w-(O*26+d0(q,0,40)*.65+1.5))<6.5)return!0}return!1};t0(_,I,{at:[-50,70],along:[1,0],len:100,y0:6,y1:136,n:[0,-1],count:K(390),skip:be});for(const l of[18,52,87,121])t0(_,I,{at:[50,-70],along:[0,1],len:140,y0:l,y1:l+14.7,n:[-1,0],count:K(46),skip:(w,S)=>l<30&&Math.abs(w-40)<15});for(const l of H)i0(_,I,l[0],l[1],l[2],[0,-1],.5+.12*I());for(const l of[35,70,105]){for(let w=-68;w<69;w+=2.9)I()<.82&&i0(_,I,41.3,l+5.15,w+I()*.8,[-1,0],.5+.28*I());for(const w of[-63,-49,-35,-21,-7,7,21,35,49,63])for(let S=0;S<2;S++)_.push({p:[40,l+12+S*11+I()*3,w+(I()-.5)],n:[-1,0],s:.7+.5*I(),kind:I(),q:[I(),I(),I(),I(),I()],wall:!1})}for(let l=0;l<6;l++)i0(_,I,45.5,6.4,-62+l*14+(l>1?30:0)-(l>3?4:0),[-1,0],1.3),_[_.length-1].fern=!0;for(let l=0;l<7;l++){const w=l*.9+1.2;i0(_,I,6.8*Math.cos(w),0,28+6.8*Math.sin(w),[Math.cos(w),Math.sin(w)],.8+.5*I())}await e.yield();const v0={mound:he(u.fork("mound"),!1),trail:he(u.fork("trail"),!0)};C.add(H0(U,v0,P,z,x,t)),await e.yield(),M.add(H0(l0,v0,P,z,x,t)),await e.yield(),W.add(H0(_,v0,P,z,x,t)),await e.yield();const L0=u.fork("trees"),Q0=L0.chance(.35),X0=new a.Mesh(we(L0,{height:34,radius:12.5,leaves:Math.round(420*h),fruit:14,blossom:90,fruitColor:[.85,.36,.03],long:1}),P);X0.position.set(112,2.4,-14),M.add(X0),await e.yield();const Y0=new a.Mesh(we(L0,{height:30,radius:11,leaves:Math.round(380*h),fruit:60,blossom:0,fruitColor:Q0?[.85,.36,.03]:[.86,.7,.06],long:Q0?1:1.3}),P);Y0.position.set(10,0,36),W.add(Y0),await e.yield();const W0=new a.Mesh(new a.SphereGeometry(100,24,14),new a.ShaderMaterial({uniforms:v,vertexShader:Ve,fragmentShader:je(m),side:a.BackSide,depthWrite:!1,fog:!1}));W0.renderOrder=-1,W0.frustumCulled=!1,s.add(W0);const M0=u.fork("motes"),A0=new a.Mesh(U0(Math.round(2400*h),(l,w)=>w.set([M0(),M0(),M0(),M0()],l*4)),new a.ShaderMaterial({uniforms:v,vertexShader:Ze(m),fragmentShader:He,transparent:!0,depthWrite:!1,blending:a.CustomBlending,blendSrc:a.OneFactor,blendDst:a.OneFactor,fog:!1}));A0.frustumCulled=!1,A0.renderOrder=3,s.add(A0);const $0=new a.ShaderMaterial({uniforms:v,vertexShader:Ue(m),fragmentShader:Qe,transparent:!0,depthWrite:!1,fog:!0}),J=u.fork("drops"),R0=new a.Mesh(U0(Math.round(260*(.5+.5*h)),(l,w,S)=>{const O=11+2.2*J(),E=J()*6.283,V=.12+.75*J()*J();w.set([196,3.7,-44,J()],l*4),S.set([Math.cos(E)*V,O,Math.sin(E)*V,(O+Math.sqrt(O*O+77))/18],l*4)}),$0);R0.frustumCulled=!1,R0.renderOrder=2,C.add(R0);const T0=new a.Mesh(U0(16,(l,w,S)=>{w.set([.9+(J()-.5)*1.4,10.4,28+(J()-.5)*1.4,J()],l*4),S.set([0,0,0,.6+.1*J()],l*4)}),$0);T0.frustumCulled=!1,T0.renderOrder=2,W.add(T0),await e.yield();const m0=f.parts,x0=[[39.6,33.2,-42],[39.6,33.2,14],[39.6,68.2,-14],[39.6,68.2,42],[39.6,103.2,0]],P0=new a.InstancedMesh(m0.cageGeometry,m0.material,5),k0=new a.InstancedMesh(m0.birdGeometry,m0.material,10);P0.frustumCulled=!1,k0.frustumCulled=!1,W.add(P0,k0);const E0=new a.Matrix4,K0=new a.Matrix4,J0=new a.Quaternion,S0=new a.Euler,ge=new a.Vector3,B0=new a.Vector3(1,1,1),ee=new a.Vector3,te=u.fork("cages"),oe=x0.map(()=>te()*6.283),Me=Array.from({length:10},()=>te());function ae(l){for(let w=0;w<5;w++){S0.set(.03*Math.sin(l*1.1+oe[w]),.9*Math.sin(l*.29+oe[w])+.25*Math.sin(l*.8+w),.035*Math.sin(l*1.3+w)),E0.compose(ge.set(x0[w][0],x0[w][1],x0[w][2]),J0.setFromEuler(S0),B0),P0.setMatrixAt(w,E0);for(let S=0;S<2;S++){const O=w*2+S,E=2.1+S*.9+w*.17,V=l/E+Me[O],q=Math.floor(V),f0=V-q,R=m0.birdSpots[S],u0=R[q%3],p0=R[(q+1)%3],X=Y(.82,1,f0);ee.set(_0(u0[0],p0[0],X),_0(u0[1],p0[1],X)+Math.sin(X*Math.PI)*.55+.03*Math.abs(Math.sin(l*9+O)),_0(u0[2],p0[2],X));const de=Math.sin(q*12.9898+O*4.1)*43758.5453;S0.set(0,(de-Math.floor(de))*6.283+Math.floor(f0*4)*.5+X*1.2,.12*Math.sin(l*5+O*2)-.25*Math.sin(X*Math.PI)),K0.compose(ee,J0.setFromEuler(S0),B0).premultiply(E0),k0.setMatrixAt(O,K0)}}P0.instanceMatrix.needsUpdate=!0,k0.instanceMatrix.needsUpdate=!0}ae(0),await e.yield();const A=t==="moon",a0=t==="dawn",xe=new a.Vector3,Q={sunDir:new a.Vector3(.78,.6,.14).normalize(),sunColor:A?"#c9d6ff":a0?"#ffd9b0":"#fff4dc",sunIntensity:A?.7:1.7,sky:A?"#2a3a80":"#a9bcd8",skyIntensity:A?.5:.9,ground:A?"#1a2450":"#c8c4b8",groundIntensity:A?.3:.55},B=$.makeFauna(s,{light:Q}),e0=u.fork("fauna"),q0=a0?{body:"#1c2440",belly:"#e8dccb",wingC:"#182036",trail:"#1c2440",tip:"#0c1020",head:"#7a2a1c"}:{body:"#15161c",belly:"#2a2a30",wingC:"#111218",trail:"#191a20",tip:"#08080c",head:"#1c1c22"},F0=A?"bats":"swifts",N0=A?6.5:6;B.add($.makeFlock({rng:e0.fork("a"),species:F0,count:Math.round(27*y),size:N0,speed:A?20:34,form:"loose",spread:[16,9,60],wander:[7,4,6,.6],route:[[-30,128,-42],[28,137,-44],[36,124,18],[12,112,50],[-30,122,42],[-38,134,-4]],closed:!0,light:Q,...A?{}:q0})),B.add($.makeFlock({rng:e0.fork("b"),species:F0,count:11,size:N0,speed:A?18:30,form:"loose",spread:[12,7,40],wander:[6,4,5,.6],route:[[205,60,-30],[172,72,-50],[122,92,-42],[98,98,-8],[140,84,2],[192,64,-10]],closed:!0,light:Q,...A?{}:q0})),B.add($.makeFlock({rng:e0.fork("dive"),species:F0,count:9,size:N0,form:"loose",spread:[9,6,22],wander:[3,2,3,.6],light:Q,...A?{}:q0,cross:{path:d,u:.46,lead:42,angle:62,side:1,height:16,span:230,rise:-34,duration:j0}})),B.add($.makeFlock({rng:e0.fork("sparrows"),species:"swifts",count:8,size:3.6,speed:15,form:"loose",spread:[5,3,9],wander:[2,1.5,2,.9],flap:9,glide:.1,light:Q,body:"#6a5038",belly:"#c8b89c",wingC:"#4e3a28",trail:"#6a543c",tip:"#2e241a",head:"#5a3a24",cross:{path:d,u:.165,lead:24,angle:55,side:-1,height:0,span:110,rise:34,duration:j0}})),B.add($.makeFlock({rng:e0.fork("swallows"),species:"swifts",count:2,size:4,form:"loose",spread:[3,1.5,7],wander:[2.2,1.2,2,.9],glide:.35,light:{...Q,sunIntensity:.6,skyIntensity:1.9,groundIntensity:1.2},body:"#27325c",belly:"#f0e6d6",wingC:"#222c50",trail:"#27325c",tip:"#141a30",head:"#9a3a26",along:{path:d,side:3.6,up:3.2,lead:25,from:-.05,to:.2,drift:6}})),await e.yield(),B.add($.makeBees({rng:e0.fork("bees"),count:Math.round(120*(.6+.4*h)),size:4,path:d,uFrom:.565,uTo:.685,clear:4,spread:10,lift:[-5,5],light:Q})),B.add($.makeButterflies({rng:e0.fork("bf"),count:24,size:6.5,path:d,uFrom:.34,uTo:.72,clear:5,spread:24,lift:[-6,12],varieties:[["#f6f2e8","#fff8e0"],["#f2f0ea","#e8e0c8"]],light:Q})),A&&B.add($.makeMoths({rng:e0.fork("moths"),count:60,size:6,positions:b.map(l=>[l.x,l.y,l.z]),jitter:5,light:Q})),await e.yield();let T=null;const s0=[[40,109,-6],[20.1,87.1,4.4],[6.3,74,-6.7],[13.5,83.5,-16.3],[5.8,96.5,-17.5],[-4,99.5,-23],[5,106,-40],[11,119,-50],[16,134,-52],[17,153,-58],[10,192,-86],[-6,255,-120]],c0=s0.map((l,w)=>.74+w*.0196),O0=s0.map(()=>0),se=26,C0=new a.Vector3,ne=new a.Color,G0=new a.Color,re=new a.Color,ie=new a.Color;if(n){T=$.makeFlock({rng:e0.fork("doves"),species:"gulls",count:40,size:5,speed:se,form:"loose",spread:[10,9,26],wander:[3,2.5,3,.5],flap:4.2,amp:.8,glide:.12,route:s0,closed:!1,start:0,light:{...Q,sunIntensity:A?1.5:2.3,skyIntensity:1.5,groundIntensity:.9},body:"#f3f0e8",belly:"#ffffff",wingC:"#ebe8e0",trail:"#f6f4ee",tip:"#d2ccc2",beak:"#d28a6a",head:"#f8f6f0"}),T.object.visible=!1,s.add(T.object);const l=T.route.length;for(let w=0;w<s0.length;w++){let S=1e9;for(let O=0;O<=400;O++){const E=T.route.pointAt(l*O/400,C0).distanceToSquared(xe.set(s0[w][0],s0[w][1],s0[w][2]));E<S&&(S=E,O0[w]=l*O/400)}}ne.copy(T.uniforms.uSunColor.value),G0.copy(T.uniforms.uSkyColor.value),re.copy(T.uniforms.uGroundColor.value),ie.copy(G0).multiplyScalar(.75)}await e.yield();const le={value:0},D0=Ie.makeParticles({rng:u.fork("petals"),preset:"petals",time:le,count:Math.round(400*h),box:[64,46,64],size:[.2,.42],velocity:[.5,-1.6,.3],colors:a0?["#f0603e","#f6c8b0","#e8e6dc"]:A?["#c8d0f0","#e0e4ff","#9aa4d0"]:["#d4221e","#e8402c","#f0d8d0"],intensity:A?.35:.8});s.add(D0.object),await e.yield();const ce=new a.Vector3,fe=new a.Vector2,ue=new a.Vector3,Pe=f.anchors.toWorld(f.anchors.cage),ke=new a.Vector3(...V0[V0.length-1]);return{scene:s,path:d,duration:j0,pace:Le,camera:{fov:66,near:.5,far:1600,lookAhead:22,sway:.6,bank:.35},pois:[{at:new a.Vector3(72,66,-30),from:.2,to:.36,weight:.4},{at:(l,w)=>ue.copy(f.anchors.edgeAt(w,18-44*Y(.44,.63,w))).applyMatrix4(f.object.matrixWorld).setY(ue.y-2),from:.33,to:.63,weight:.78},{at:Pe,from:.585,to:.67,weight:.5},{at:new a.Vector3(15,95,-70),from:.655,to:.8,weight:.5},{at:ke,from:.72,to:1,weight:.5}],portal:{shape:"circle",radius:7,tilt:!0,color:A?"#aebcff":"#cfe0ff",glow:.5,revealDistance:420},post:{exposure:o.exposure,bloom:{strength:.3,radius:.6,threshold:1},grade:{saturation:1.08,contrast:1.03,tint:A?"#e6ecff":a0?"#ffe9da":"#ffffff",shadowTint:A?"#050818":a0?"#0c0920":"#060a1c",vignette:.2,grain:.02,aberration:0}},ride:"none",style:"none",update(l,w,S,O){le.value=w,t==="shower"&&f.setCloud(1-.5*Y(.3,.7,.5+.5*Math.sin(w*.8+1.3*Math.sin(w*.31)))),f.setProgress(O),f.update(l,w,S),v.uCloudT.value=O*2.4+w*.006;const E=1-Y(.12,.62,O),V=A?0:(a0?.5:2.3)*(1-Y(.03,.24,O));s.fog.density=o.fogD*(1+V+(a0?1.9*E:0)),a0&&(v.uMist.value=E),A&&(v.uLampK.value=1+.07*Math.sin(w*9.1)*Math.sin(w*5.3)),ce.setFromMatrixPosition(S.matrixWorld),v.uCam.value.copy(ce),e.renderer.getDrawingBufferSize(fe),v.uPx.value=fe.y/(2*Math.tan((S.fov||60)*Math.PI/360));const q=Y(.02,.1,O),f0=.1+q*(Math.PI/2-.1)+.05*Math.sin(q*Math.PI*3)*(1-q)+.035*Math.sin(w*1.1)*(1-.8*q);D.rotation.y=-f0,o0.rotation.y=f0,v.uGateOpen.value=f0,v.uGateH.value=52-24*Y(0,.14,O);for(let R=0;R<z0.length;R++)z0[R].rotation.z=.1*Math.sin(w*.9+R*2.1),z0[R].rotation.x=.05*Math.sin(w*.7+R);if(C.visible=O<.5,ae(w),B.update(l,w,S,O),D0.setOpacity(.6+.4*Y(.1,.22,O)),D0.update(l,w,S),T){T.object.visible=O>c0[0];let R=0;for(;R<c0.length-2&&O>c0[R+1];)R++;const u0=O0[R]+(O0[R+1]-O0[R])*d0((O-c0[R])/(c0[R+1]-c0[R]),0,1.6);T.update(l,u0/se,S),T.route.pointAt(Math.max(u0-10,0),C0);const p0=140-(50-C0.x)*f.uniforms.uSunTan.value/.985,X=Y(-9,7,C0.y-p0);T.uniforms.uSunColor.value.copy(ne).multiplyScalar(X),T.uniforms.uSkyColor.value.copy(G0).multiplyScalar(1.15-.15*X),T.uniforms.uGroundColor.value.copy(re).lerp(ie,1-X)}},dispose(){v0.mound.dispose(),v0.trail.dispose()}}}};export{Je as default};
