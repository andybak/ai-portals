import*as a from"three";import{makePath as To,lerp as q,smoothstep as E,makeRng as Eo}from"../kit/core.js";import{makeSky as Go,makeLightRig as Vo}from"../kit/sky.js";import*as Io from"../kit/terrain.js";import*as Se from"../kit/fx.js";import*as Be from"../kit/flora.js";import*as he from"../kit/structures.js";import{buildHero as Wo}from"../parts/aurora-fjord.js";const We=`
float hash3(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float vnoise(vec3 x){
  vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash3(i), hash3(i + vec3(1,0,0)), f.x), mix(hash3(i + vec3(0,1,0)), hash3(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash3(i + vec3(0,0,1)), hash3(i + vec3(1,0,1)), f.x), mix(hash3(i + vec3(0,1,1)), hash3(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float fbm3(vec3 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 3; i++) { s += a * vnoise(p); p = p * 2.03 + 17.1; a *= 0.5; } return s / 0.875; }
// slow patches of aurora light sliding over the ground (shared by snow, floes and water)
float auroraPatch(vec2 xz, float t){ return 0.5 + 1.0 * vnoise(vec3(xz.x * 0.0042 + t * 0.013, xz.y * 0.0031 - t * 0.021, t * 0.027)); }
`,Oo=`
varying vec3 vP; varying vec3 vN;
#include <fog_pars_vertex>
void main(){
  vP = position; vN = normal;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,qo=`
uniform float uTime, uBright, uPulse, uDetail;
uniform vec3 uLight, uSky, uSnow, uRock, uMoonDir, uMoonCol;
varying vec3 vP; varying vec3 vN;
#include <fog_pars_fragment>
${We}
void main(){
  vec3 p = vP;
  vec3 N = normalize(vN);
  float mpp = max(max(length(dFdx(p)), length(dFdy(p))), 1e-4);
  float kd = clamp(1.25 - mpp * 0.4, 0.0, 1.0);
  vec3 bp = p * vec3(0.06, 0.1, 0.06);
  vec3 Ng = N;
  float n1 = vnoise(p * 0.011 + 3.0);
  float n2 = vnoise(p * vec3(0.23, 0.5, 0.23));
  float v0 = vnoise(bp);
  vec3 g = vec3(vnoise(bp + vec3(0.4, 0.0, 0.0)), vnoise(bp + vec3(0.0, 0.4, 0.0)), vnoise(bp + vec3(0.0, 0.0, 0.4))) - v0;
  // a broader bump too, so the lighting never follows the mesh triangles
  vec3 bq = p * vec3(0.017, 0.03, 0.017) + 7.0;
  float w0 = vnoise(bq);
  vec3 g2 = vec3(vnoise(bq + vec3(0.3, 0.0, 0.0)), vnoise(bq + vec3(0.0, 0.3, 0.0)), vnoise(bq + vec3(0.0, 0.0, 0.3))) - w0;
  g = (1.5 * kd) * g + 0.9 * g2;
  N = normalize(N - uDetail * (g - dot(g, N) * N));
  float up = N.y;
  // snow lies wherever the slope lets it, with ragged noisy edges; steep faces stay dark rock with snow in the cracks
  float snow = smoothstep(0.33, 0.6, mix(Ng.y, up, 0.6) + (n1 - 0.5) * 0.2 + (n2 - 0.5) * 0.25 + (w0 - 0.5) * 0.2);
  float strata = 0.5 + 0.5 * sin(p.y * 0.42 + n1 * 9.0 + n2 * 1.5);
  vec3 rock = uRock * (0.55 + 0.9 * strata * (0.35 + 0.65 * n2));
  // wind-packed drifts and sastrugi: long low ridges across the slope, strongest near the shore
  float sas = vnoise(vec3(p.x * 0.5 + p.z * 0.22, p.y * 0.9, p.z * 0.07 - p.x * 0.03));
  float drift = vnoise(vec3(p.x * 0.05, p.y * 0.08, p.z * 0.021) + 31.0);
  float snowAlb = 0.66 + 0.12 * v0 + (0.16 * (sas - 0.5) * kd + 0.2 * (drift - 0.5)) * (0.5 + 0.5 * smoothstep(120.0, 10.0, p.y));
  vec3 alb = mix(rock, uSnow * snowAlb, snow);
  // the aurora hangs over the fjord: light falls from above and from the water side, in slow sliding patches
  vec3 Lk = normalize(vec3(-sign(p.x) * 0.62, 0.74, -0.22));
  float key = clamp(dot(N, Lk) * 0.72 + 0.28, 0.0, 1.0);
  float ap = auroraPatch(p.xz, uTime);
  float open = 0.4 + 0.6 * smoothstep(0.0, 280.0, p.y);                  // the fjord floor sees less sky
  vec3 light = uLight * (0.2 + 0.8 * key * key) * ap * open * (0.72 + 0.28 * uPulse) + uSky * (0.55 + 0.6 * up);
  light += uMoonCol * max(dot(N, uMoonDir), 0.0);
  vec3 col = alb * light;
#ifndef MIRROR
  float sp = step(0.99, hash3(floor(p * 3.0))) * snow * clamp(1.0 - mpp * 6.0, 0.0, 1.0);
  col += uSnow * sp * 0.6 * (0.5 + 0.5 * sin(uTime * 3.0 + p.x * 9.0));
#endif
  gl_FragColor = vec4(col * uBright, 1.0);
  #include <fog_fragment>
}`,Ho=`
varying vec3 vWorld;
#include <fog_pars_vertex>
void main(){
  vec4 wp = modelMatrix * vec4(position, 1.0); vWorld = wp.xyz;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Uo=`
uniform float uTime, uPulse;
uniform vec3 uBody, uSheen, uLight;
uniform vec4 uRing[6];            // x, z, radius, strength
uniform vec4 uLamp[5];            // xyz of a light above the water, w strength
uniform vec3 uLampCol[5];
varying vec3 vWorld;
#include <fog_pars_fragment>
${We}
void main(){
  vec3 toCam = cameraPosition - vWorld;
  float dist = length(toCam);
  vec3 V = toCam / dist;
  vec2 q = vWorld.xz;
  float lod = 1.0 / (1.0 + dist * 0.012);
  float r1 = vnoise(vec3(q * vec2(0.8, 0.2) + vec2(uTime * 0.05, uTime * 0.02), uTime * 0.07));
  float r2 = vnoise(vec3(q * vec2(0.21, 0.05) - vec2(uTime * 0.02, 0.0), uTime * 0.03 + 5.0));
  float rip = (r1 - 0.5) * lod + (r2 - 0.5) * 0.6;
  // rings spreading from the orcas and the whale
  float ring = 0.0;
  for (int i = 0; i < 6; i++) {
    vec4 R = uRing[i];
    float d = length(q - R.xy), w = 0.7 + R.z * 0.06;
    float a = (d - R.z) / w, b = (d - R.z * 0.55) / w;
    ring += R.w * (exp(-a * a) + 0.5 * exp(-b * b));
  }
  float ndv = clamp(abs(V.y) + rip * 0.05, 0.0, 1.0);
  float a = mix(0.34, 0.9, smoothstep(0.0, 0.8, ndv));
  a = clamp(a + rip * 0.17 + ring * 0.5, 0.06, 0.96);
  vec3 body = uBody + uSheen * pow(1.0 - ndv, 4.0);
  // soft glints of aurora light on the slow ripples and on the ring crests
  body += uLight * (0.07 * smoothstep(0.22, 0.5, rip) * pow(1.0 - ndv, 2.0) + 0.5 * ring) * (0.7 + 0.3 * uPulse);
  // long reflections of the warm lights (and the portal): narrow in azimuth, stretched toward the eye
  vec3 streak = vec3(0.0);
  vec3 Rv = vec3(-V.x, V.y, -V.z);
  vec2 rh = normalize(Rv.xz);
  for (int i = 0; i < 5; i++) {
    vec4 L = uLamp[i];
    vec3 toL = L.xyz - vWorld;
    float d2 = dot(toL, toL);
    vec3 Ld = toL * inversesqrt(d2);
    vec2 lh = normalize(Ld.xz);
    float da = rh.x * lh.y - rh.y * lh.x + rip * 0.03;
    float de = (Ld.y - Rv.y) / (Ld.y + Rv.y + 0.01);
    float sa = (0.008 + 0.022 * abs(de)) * (i == 4 ? 3.2 : 1.0);
    float s = exp(-da * da / (sa * sa) - de * de * 2.6) * step(0.0, dot(rh, lh)) / (1.0 + d2 / 8100.0);
    streak += uLampCol[i] * (s * L.w);
  }
  streak *= 0.6 + 0.8 * r1;
  #ifdef USE_FOG
    float ff = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    body = mix(body, fogColor, ff); streak *= 1.0 - ff;
  #endif
  gl_FragColor = vec4(body * a + streak, a);       // premultiplied: the mirror below shows through by (1 - a)
}`,Zo=`
attribute vec4 aFloe;            // x, z, radius, seed
uniform float uTime;
varying vec3 vP; varying float vRim; varying float vSeed; varying vec2 vL;
#include <fog_pars_vertex>
void main(){
  float sd = aFloe.w, ang = sd * 40.0 + uTime * 0.02 * (sd - 0.5);
  float c = cos(ang), s = sin(ang);
  vec3 p = position;
  vRim = p.y; vSeed = sd; vL = p.xz;
  p.x *= 0.82 + 0.36 * fract(sd * 13.7);
  p.xz = vec2(c * p.x - s * p.z, s * p.x + c * p.z) * aFloe.z;
  p.y = p.y * (0.6 + 0.4 * aFloe.z) + 0.012 * sin(uTime * 0.5 + sd * 50.0);
  vec2 drift = vec2(sin(uTime * 0.045 + sd * 31.0), cos(uTime * 0.038 + sd * 17.0)) * 1.4;
  vec3 wp = vec3(aFloe.x + drift.x + p.x, p.y + 0.02, aFloe.y + drift.y + p.z);
  vP = wp;
  vec4 mvPosition = viewMatrix * vec4(wp, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Xo=`
uniform float uTime, uPulse;
uniform vec3 uLight, uSky, uSnow, uDeep;
varying vec3 vP; varying float vRim; varying float vSeed; varying vec2 vL;
#include <fog_pars_fragment>
${We}
void main(){
  float n = fract(vSeed * 7.31);
  float r = length(vL);
  vec3 gp = vec3(vL * 5.0, vSeed * 40.0);
  float grain = vnoise(gp * 2.6), blot = vnoise(gp * 0.55 + 9.0);
  // a frosted, bumped-up rim around a greyer, wetter centre; slush at the very edge
  float rim = smoothstep(0.62, 0.88, r + (blot - 0.5) * 0.22) * (1.0 - 0.5 * smoothstep(0.98, 1.06, r));
  float cover = clamp(0.42 + 0.35 * n + 0.55 * rim + 0.3 * (blot - 0.5) + 0.22 * (grain - 0.5), 0.0, 1.0);
  vec3 alb = mix(uDeep, uSnow * 0.85, cover) * smoothstep(0.0, 0.07, vRim) * (0.86 + 0.28 * grain);
  vec3 light = uLight * auroraPatch(vP.xz, uTime) * (0.72 + 0.28 * uPulse) * (0.5 + 0.25 * rim) + uSky;
  gl_FragColor = vec4(alb * light, 1.0);
  #include <fog_fragment>
}`,Yo=`
attribute vec3 color;
varying vec3 vW; varying vec3 vNw; varying vec3 vCol;
#include <fog_pars_vertex>
void main(){
  vCol = color;
  vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz;
  vNw = mat3(modelMatrix) * normal;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,$o=`
uniform float uFlip, uBright, uPulse;
uniform vec3 uLight, uSky, uMoonDir, uMoonCol;
varying vec3 vW; varying vec3 vNw; varying vec3 vCol;
#include <fog_pars_fragment>
void main(){
  if (vW.y * uFlip < 0.0) discard;
  vec3 N = normalize(vNw); N.y *= uFlip;
  vec3 V = normalize(cameraPosition - vW); V.y *= uFlip;
  if (dot(N, V) < 0.0) N = -N;
  float ndv = clamp(dot(N, V), 0.0, 1.0);
  vec3 R = reflect(-V, N);
  vec3 light = uLight * (0.72 + 0.28 * uPulse);
  vec3 col = vCol * (light * (0.45 + 0.55 * clamp(N.y, 0.0, 1.0)) + uSky);
  col += light * (0.012 + 0.03 * clamp(N.y, 0.0, 1.0) + 0.2 * pow(clamp(R.y, 0.0, 1.0), 24.0));     // a dull wet gleam along the back
  col += light * 1.5 * pow(1.0 - ndv, 3.0) * (1.0 - 0.8 * N.y * N.y);                             // wet rim on flanks and fin edges, not on the flat of the back
  col += uMoonCol * (pow(max(dot(R, uMoonDir), 0.0), 40.0) * 2.5 + 0.25 * max(dot(N, uMoonDir), 0.0));
  col += light * 0.17 * smoothstep(0.5, 3.2, vW.y * uFlip);             // tall fins and the raised fluke stand up into the aurora light
  float wl = 1.0 - smoothstep(0.0, 0.14, vW.y * uFlip);               // bright wet line where the body cuts the mirror
  col += light * wl * 0.7;
  gl_FragColor = vec4(col * uBright, 1.0);
  #include <fog_fragment>
}`,Ko=`
attribute vec4 aSeed;            // x: which animal, yzw: random
uniform vec4 uBlow[6];           // x, z, age (s, < 0 = none), heading
uniform float uScale;
varying float vA;
void main(){
  vec4 B = uBlow[int(aSeed.x + 0.5)];
  float t = B.z / 3.2;
  float live = step(0.0, B.z) * step(t, 1.0);
  float k = 1.0 - exp(-t * 3.0);
  vec2 fw = vec2(sin(B.w), cos(B.w));
  vec3 p = vec3(B.x, 0.35, B.y);
  float cone = 0.25 + 0.75 * aSeed.y;
  p.y += k * (6.4 + 5.0 * aSeed.z) * cone - t * t * 1.6;
  p.xz += fw * (-0.8 * k - 1.6 * t) + vec2(aSeed.w - 0.5, fract(aSeed.w * 7.3) - 0.5) * (0.5 + 2.6 * k) + vec2(0.9, 0.35) * t * 1.6;
  vA = live * smoothstep(0.0, 0.06, t) * pow(max(1.0 - t, 0.0), 1.6) * (0.5 + 0.5 * aSeed.z);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = live * clamp(uScale * (0.7 + 2.3 * k) * (0.6 + 0.8 * aSeed.y) / max(-mvPosition.z, 1.0), 1.0, 110.0);
}`,Jo=`
uniform vec3 uColor; uniform float uBright;
varying float vA;
void main(){
  vec2 d = gl_PointCoord - 0.5;
  float a = smoothstep(0.5, 0.0, length(d));
  gl_FragColor = vec4(uColor * (a * a * vA * uBright), 1.0);
}`,Qo=`
varying vec3 vDir;
void main(){
  vDir = position * vec3(1.0, -1.0, 1.0);
  vec4 p = projectionMatrix * vec4(mat3(viewMatrix) * position, 1.0);
  if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww;
}`,et=`
uniform vec3 uZen, uMid, uHor, uGreen, uMoonDir, uMoonCol;
uniform vec3 uP;                 // horizonPow, midPow, moon cos radius
uniform float uTime, uPulse;
varying vec3 vDir;
float hash3(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
void main(){
  vec3 d = normalize(vDir);
  float inv = 1.0 - clamp(d.y, 0.0, 1.0);
  vec3 c = mix(mix(uZen, uMid, pow(inv, uP.y)), uHor, pow(inv, uP.x));
  vec3 q = d * 150.0, id = floor(q), f = fract(q) - 0.5;
  float h = hash3(id);
  c += vec3(0.75, 0.88, 1.0) * step(0.99, h) * smoothstep(0.32, 0.0, length(f)) * (0.5 + 0.5 * sin(uTime * 2.3 + h * 90.0)) * smoothstep(0.02, 0.25, d.y) * 1.4;
  c += uGreen * 0.05 * (0.7 + 0.3 * uPulse) * smoothstep(0.02, 0.5, d.y);        // the dome's faint aurora wash
  float md = dot(d, uMoonDir);
  c += uMoonCol * (0.3 * pow(max(md, 0.0), 30000.0) + 0.03 * pow(max(md, 0.0), 1500.0));
  gl_FragColor = vec4(c * 0.85, 1.0);
}`,ot=`
uniform float uTime, uSpeed;
attribute vec4 aRib;             // u along the ribbon, v (0 hem .. 1 top), phase, fold amplitude (m)
attribute vec3 aDir;             // horizontal unit normal of the curtain (x, z) and arc length (m)
varying vec2 vUv; varying float vPh; varying vec3 vW; varying vec3 vTan;
void main(){
  float t = uTime * uSpeed, ph = aRib.z * 6.2831853, s = aDir.z;
  float fold = sin(s * 0.0105 + t * 0.16 + ph) + 0.55 * sin(s * 0.027 - t * 0.23 + ph * 2.1) + 0.3 * sin(s * 0.066 + t * 0.31 + ph * 3.3);
  vec3 p = position;
  float amp = aRib.w * (0.7 + 0.3 * aRib.y);
  float dfold = 0.0105 * cos(s * 0.0105 + t * 0.16 + ph) + 0.01485 * cos(s * 0.027 - t * 0.23 + ph * 2.1) + 0.0198 * cos(s * 0.066 + t * 0.31 + ph * 3.3);
  p.xz += aDir.xy * (fold * amp);
  p.y += sin(s * 0.006 + t * 0.1 + ph) * aRib.w * 0.3;
  vUv = aRib.xy; vPh = aRib.z;
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vW = wp.xyz; vTan = vec3(-aDir.y + aDir.x * dfold * amp, 0.0, aDir.x + aDir.y * dfold * amp);      // tangent of the folded sheet
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,tt=`
uniform vec3 uColorA, uColorB, uColorC;
uniform float uTime, uSpeed, uRays, uIntensity, uEnds, uEdge, uFar;
varying vec2 vUv; varying float vPh; varying vec3 vW; varying vec3 vTan;
${We}
void main(){
  float u = vUv.x, v = vUv.y, t = uTime * uSpeed, ph = vPh * 37.0;
  float n1 = vnoise(vec3(u * uRays + ph, t * 0.2, ph * 0.3));                    // rays
  float n2 = vnoise(vec3(u * uRays * 2.3 + ph * 2.0, v * 1.5 - t * 0.3, 1.0));   // fine shimmer running up them
  float n3 = vnoise(vec3(u * uRays * 0.21 - t * 0.05, ph, t * 0.04));            // hem height and ray length
  float slow = vnoise(vec3(u * 9.0 + t * 0.07 + ph, t * 0.03, 4.0));             // brightness travelling along the curtain
  float lo = 0.02 + 0.08 * n3 + 0.07 * n1;                                       // a ragged hem: each ray ends at its own height
  float bottom = smoothstep(lo * 0.15, lo + 0.13, v);
  float top = exp(-max(v - lo, 0.0) * (1.7 + 3.0 * n3)) * smoothstep(1.0, 0.7, v);
  float curtain = (0.42 + 0.66 * n1) * (0.8 + 0.2 * n2);                        // soft sheets, not bars
  float ends = smoothstep(0.0, uEnds, u) * smoothstep(1.0, 1.0 - uEnds, u);
  // a sheet seen along its own length stacks into a hard striped column: fade it there
  // (also where a fold turns end-on to the eye, so folds brighten softly instead of becoming bars)
  vec3 toP = vW - cameraPosition; float dCam = length(toP);
  float along = abs(dot(normalize(toP.xz + 1e-3), normalize(vTan.xz)));
  float edge = mix(uEdge, 1.0, smoothstep(0.0, 0.74, sqrt(max(1.0 - along * along, 0.0)))) * mix(1.0, uFar, smoothstep(600.0, 1700.0, dCam));
  float I = bottom * top * curtain * (0.35 + 0.65 * smoothstep(0.2, 0.7, slow)) * ends * edge;
  vec3 col = mix(uColorA, uColorB, smoothstep(0.22, 0.85, v + (n1 - 0.5) * 0.3));
  col = mix(uColorC, col, smoothstep(lo * 0.15, lo + 0.2, v));
  gl_FragColor = vec4(col * (I * uIntensity), 1.0);
}`;function eo(y,n,S){const u=new a.BufferGeometry;return u.setAttribute("position",new a.Float32BufferAttribute(y,3)),n&&u.setAttribute("color",new a.Float32BufferAttribute(n,3)),u.setIndex(S),u.computeVertexNormals(),u.computeBoundingSphere(),u}function go(y,n){const S=[],u=[],d=[],D=y*.13,Y=[.014,.017,.022],B=[.5,.55,.58],ee=[.06,.075,.09];for(let R=0;R<=18;R++){const m=R/18,C=(.5-m)*y,U=D*Math.pow(Math.sin(Math.PI*Math.pow(m,.72)),.75)*(1-.25*m)+.02;for(let V=0;V<14;V++){const $=V/14*Math.PI*2,Ne=Math.sin($)*U*.9,de=Math.cos($)*U;S.push(Ne,de,C);const se=m>.1&&m<.2&&Math.abs(Math.abs($-Math.PI)-2.2)<.36,ze=m>.5&&m<.66&&Math.cos($)>.55,Q=Math.cos($)<-.82&&m<.72||se?B:ze?ee:Y;u.push(Q[0],Q[1],Q[2])}}for(let R=0;R<18;R++)for(let m=0;m<14;m++){const C=R*14+m,U=R*14+(m+1)%14,V=C+14,$=U+14;d.push(C,V,U,U,V,$)}const P=S.length/3,j=y*.06,F=y*.2,b=.07*y/7,w=[[0,0,.5],[.3,.42,.34],[.62,.8,.2],[.9,1,.07]];for(const[R,m,C]of w)for(const U of[-1,1]){const V=j-R*F*.9,$=D*.92+m*n;S.push(U*b*(1-m*.8),$,V+C*F,U*b*(1-m*.8),$,V-C*F),u.push(...Y,...Y)}for(let R=0;R<w.length-1;R++){const m=P+R*4,C=m+4;d.push(m,C,m+1,m+1,C,C+1,m+2,m+3,C+2,m+3,C+3,C+2),d.push(m,m+2,C,m+2,C+2,C,m+1,C+1,m+3,m+3,C+1,C+3)}const T=P+(w.length-1)*4;return d.push(T,T+2,T+1,T+1,T+2,T+3),eo(S,u,d)}function at(y){const n=[],S=[],u=[],d=[.02,.024,.03],z=[.07,.085,.1],G=8,D=8,Y=y*.9;for(let j=0;j<=G;j++){const F=j/G,b=F*Y,w=q(y*.17,y*.035,Math.pow(F,.7)),T=q(y*.24,y*.05,Math.pow(F,.6));for(let R=0;R<D;R++){const m=R/D*Math.PI*2;n.push(Math.sin(m)*w,b,Math.cos(m)*T),S.push(...d)}}for(let j=0;j<G;j++)for(let F=0;F<D;F++){const b=j*D+F,w=j*D+(F+1)%D,T=b+D,R=w+D;u.push(b,w,T,w,R,T)}const B=n.length/3,ee=7,P=y*.018;for(const j of[-1,1])for(let F=0;F<=ee;F++){const b=F/ee,w=j*b*y*.5,T=Y+y*(.02+.2*Math.sin(b*1.9)),R=y*(.26*(1-Math.pow(b,1.7))+.02),m=T-R+y*.07*(1-b)*(1-b);for(const C of[1,-1]){const U=P*(1-b*.7);n.push(w,T,C*U*.4,w,m,C*U*.15),S.push(...C>0?d:z,...C>0?d:z)}}for(let j=0;j<2;j++)for(let F=0;F<ee;F++){const b=B+(j*(ee+1)+F)*4,w=b+4;u.push(b,w,b+1,b+1,w,w+1,b+2,b+3,w+2,b+3,w+3,w+2,b,b+2,w,b+2,w+2,w,b+1,w+1,b+3,b+3,w+1,w+3)}return eo(n,S,u)}function nt(){const y=[0,.1,0],n=[],S=14;for(let u=0;u<S;u++){const d=u/S*Math.PI*2,z=Math.cos(d),G=Math.sin(d),D=1+.1*Math.sin(d*3+1)+.06*Math.sin(d*5)+.045*Math.sin(d*8+2.2)+.03*Math.sin(d*11+.7);y.push(z*.78*D,.12,G*.78*D,z*.95*D,.2,G*.95*D,z*1.06*D,0,G*1.06*D)}for(let u=0;u<S;u++){const d=1+u*3,z=1+(u+1)%S*3;n.push(0,z,d,d,z,d+1,z,z+1,d+1,d+1,z+1,d+2,z+1,z+2,d+2)}return eo(y,null,n)}const rt={emerald:{green:"#3dffb0",violet:"#a25bff",fringe:"#ff6fa8",portal:"#d8c4ff",title:"Aurora Fjord"},jade:{green:"#3fe0ff",violet:"#4a52ff",fringe:"#7fffe0",portal:"#c4dcff",title:"Aurora Fjord"},storm:{green:"#6aff8a",violet:"#ff3fd0",fringe:"#ff4f8a",portal:"#ffc8f0",title:"Aurora Fjord"}};var ut={id:"aurora-fjord",name:"Aurora Fjord",category:"wilderness",weirdness:.1,async build(y){const n=y.rng,S=y.noise,u=new a.Scene,d=async()=>{y.yield&&await y.yield()},z={value:0},G=[],D=[],Y=n.pick(["emerald","jade","storm","emerald","jade","storm","emerald"]),B=rt[Y],ee=Y==="storm"?n.range(1.6,2):Y==="jade"?n.range(.6,.9):n.range(.8,1.15),P=n.chance(.6)?1:-1,j=n.pick([420,470,520]),F=n.pick([.6,.8,1,1.3,1.6]),b=n.range(.75,1.25),w=n.range(728,772),T=n.int(3,4),R=n.sign()*n.range(8,25),m=n.range(14,24),C=n.range(.07,.5),U=["#020712","#0e3842",B.green,B.violet,"#16324a","#cfe9f5","#ffb060"],V=new a.Color(B.green),$=new a.Color(B.violet),Ne=new a.Color("#cfe9f5"),de=new a.Color(1,1,1),se=V.clone().lerp(de,.52).multiplyScalar(.56),ze=new a.Color("#0a1a44").multiplyScalar(.5),Q=await Wo({...y,rng:n.fork("hero")},{palette:U,mirror:!0,water:!1,avenueFar:j});u.add(Q.object),Q.setAurora(B.green,1);const pe=Q.anchors,Oe=pe.portalSeat.position;await d();const ae=n.range(0,500),ie=(e,t)=>{const o=126+13*S.n2(e*.0042+ae,t*3.1)+5*S.n2(e*.014,t*8.3+ae);return q(q(98,112,E(-70,0,e)),o,E(0,120,e))},Ce=(e,t,o)=>{if(t<=0)return 0;const r=e*(ie(o,e)+t),p=S.fbm2(r*.0015+11*e+ae,o*.0015,3),g=S.ridged2(r*.0034+5+ae,o*.0034+e*9,4),f=1-Math.exp(-Math.pow(t/(235+60*S.n2(o*.003+ae,e*7)),1.25)),k=S.ridged2(o*.0105+ae,r*.0022+e*4,3);let s=(440+120*p)*f*(.62+.36*g+.3*k);const h=72,v=.8*S.n2(r*.005,o*.005+e*3+ae),l=s/h+v,c=Math.floor(l),i=h*(c+E(.3,.7,l-c)-v);if(s=q(s,i,.5*E(0,40,t)),s+=7*S.fbm2(r*.021,o*.021,3)*E(0,45,t),s+=55*E(-15,-70,o)*E(0,28,t),e===P){const x=Math.exp(-Math.pow((o-w)/75,2));s=s*q(1,E(0,120,t),x)+x*2.4*E(0,9,t)}return Math.max(s,.15*Math.min(t,4))},oo=pe.flyThrough.map(e=>[e[0],Math.min(e[1],7.2+6*E(600,380,e[2])),e[2]]),qe=P*n.range(-14,4),He=P*n.range(44,54),wo=[[qe,5,968],[qe+3*P,5,905],[q(qe,He,.6),5.2,845],[He,5.6,w+6],[He*.45,6,w-72],[-6*P,6.6,652],[q(-6*P,oo[0][0],.6),7,612],...oo],me=To(wo),je=e=>me.posAtDist(e*me.length,new a.Vector3),Ue=e=>me.tangentAtDist(e*me.length,new a.Vector3),I=Go({rng:n.fork("sky"),preset:"polar",quality:.5,renderOrder:1e3,bake:!!y.renderer,renderer:y.renderer,aurora:.3,auroraColors:[B.green,B.violet],auroraSpeed:ee,stars:1,starDensity:n.range(.8,1),milkyWay:n.range(.45,.8),milkyAngle:n.range(0,60),bodies:[{elevation:m,azimuth:R,size:1.5,phase:C,phaseAngle:n.range(-50,-20),intensity:2.2,glow:.22,glowColor:"#a8c8ff",color:"#e8f1ff"}]});u.add(I.object);const Ze=I.bodyDirections[0]?I.bodyDirections[0].clone():new a.Vector3(-.2,.3,-.93).normalize(),Xe=new a.Color("#0a2a33").lerp(V,.06).multiplyScalar(.8);u.fog=new a.FogExp2(Xe,.0011*b),u.background=new a.Color("#020712");const Pe=Vo(I,{intensity:1.1,ambient:.7,bounce:.35});u.add(Pe.object),Pe.sun.color.copy(V).lerp(de,.4);const yo=Pe.sun.intensity;G.push((e,t,o)=>{I.update(e,t,o),Pe.update(e,t,o)});const ne=new a.Group;ne.name="mirror",ne.scale.y=-1,u.add(ne);const Te=()=>a.UniformsUtils.clone(a.UniformsLib.fog),le={value:.5};{const e=(f,k)=>{const s=new a.BoxGeometry(2,1,2);s.translate(0,f,0);const h=Array.from(s.index.array);return h.splice(k,6),s.setIndex(h),s.clearGroups(),s},t=e(.5,18);I.object.geometry.dispose(),I.object.geometry=t;const o=e(-.5,12),r=I.options||{},p=new a.ShaderMaterial({name:"MirrorSky",vertexShader:Qo,fragmentShader:et,side:a.DoubleSide,depthWrite:!1,depthTest:!0,fog:!1,uniforms:{uTime:z,uPulse:le,uZen:{value:I.zenithColor.clone()},uMid:{value:I.uniforms.uMid?I.uniforms.uMid.value.clone():I.zenithColor.clone().lerp(I.horizonColor,.4)},uHor:{value:I.horizonColor.clone()},uGreen:{value:V.clone()},uMoonDir:{value:Ze.clone()},uMoonCol:{value:new a.Color("#e8f1ff")},uP:{value:new a.Vector3(r.horizonPow??3.4,r.midPow??1.5,Math.cos(1.5*Math.PI/180))}}}),g=new a.Mesh(o,p);g.name="sky-mirror",g.frustumCulled=!1,g.renderOrder=1e3,u.add(g)}const bo={uTime:z,uPulse:le,uLight:{value:se.clone()},uSky:{value:ze.clone()},uSnow:{value:Ne.clone()},uRock:{value:new a.Color("#232e3a")},uMoonDir:{value:Ze.clone()},uMoonCol:{value:new a.Color("#9fc0ff").multiplyScalar(.16)}},to=(e,t,o)=>new a.ShaderMaterial({uniforms:{...bo,uBright:{value:e},uDetail:{value:t},...Te()},defines:o,vertexShader:Oo,fragmentShader:qo,fog:!0,side:a.DoubleSide}),xo=to(1,1,{}),Mo=to(.5,.5,{MIRROR:1}),ko=-520,So=1160,Ae=260,oe=48,zo=640;for(const e of[-1,1]){const t=new Float32Array((Ae+1)*(oe+1)*3),o=[];for(let s=0;s<=Ae;s++){s%16===0&&await d();const h=q(ko,So,s/Ae),v=ie(h,e);for(let l=0;l<=oe;l++){const c=zo*Math.pow(l/oe,1.7),i=(s*(oe+1)+l)*3;t[i]=e*(v+c),t[i+1]=Ce(e,c,h),t[i+2]=h}}for(let s=0;s<Ae;s++)for(let h=0;h<oe;h++){const v=s*(oe+1)+h,l=v+oe+1,c=l+1,i=v+1;e>0?o.push(v,l,c,v,c,i):o.push(v,c,l,v,i,c)}await d();const r=new a.BufferGeometry;r.setAttribute("position",new a.BufferAttribute(t,3)),r.setIndex(o),r.computeVertexNormals(),r.computeBoundingSphere();const p=new a.Mesh(r,xo);p.name="fjord-wall",u.add(p);const g=[];for(let s=0;s<Ae;s+=2)for(let h=0;h<oe;h++){const v=s*(oe+1)+h,l=v+2*(oe+1),c=l+1,i=v+1;g.push(v,l,c,v,c,i)}const f=new a.BufferGeometry;f.setAttribute("position",r.attributes.position),f.setAttribute("normal",r.attributes.normal),f.setIndex(g),f.boundingSphere=r.boundingSphere.clone();const k=new a.Mesh(f,Mo);k.name="fjord-wall-mirror",ne.add(k),await d()}{const e={layers:3,radius:[1900,3300],height:[260,560],base:60,jagged:.75,coverage:.8,colorNear:"#070d14",haze:Xe.clone().multiplyScalar(1.1),hazeNear:.2,hazeFar:.55,footHaze:.75,sunDir:[.05,.96,.25],sunColor:V.clone().lerp(de,.4),sunIntensity:.16,ambient:"#06121c",snow:"#cfe9f5",snowLine:.35,rim:0},t=Io.makeHorizonRidges({...e,rng:Eo(y.seed+77)});u.add(t.object);const o=new a.Mesh(t.geometry,t.material);o.frustumCulled=!1,o.position.y=60,ne.add(o),G.push((r,p,g)=>{t.update(r,p,g),o.position.x=t.object.position.x,o.position.z=t.object.position.z})}const ao=[];{const t=(p,g,f,k,s,h,v,l=1)=>{const c=n(),i=p===0?n.range(34,58):n.range(24,38),x=new Float32Array(261*2),M=new Float32Array(261);for(let A=0;A<=260;A++){const K=g(A/260);x[A*2]=K[0],x[A*2+1]=K[1],A>0&&(M[A]=M[A-1]+Math.hypot(K[0]-x[A*2-2],K[1]-x[A*2-1]))}const L=new Float32Array(261*6),W=new Float32Array(261*8),O=new Float32Array(261*6),H=[];for(let A=0;A<=260;A++){const K=A/260,xe=Math.max(A-1,0),Ve=Math.min(A+1,260),Ie=x[Ve*2]-x[xe*2],Me=x[Ve*2+1]-x[xe*2+1],re=Math.hypot(Ie,Me)||1,ke=x[A*2],vo=x[A*2+1],jo=f(K,ke,vo)*(1+.1*Math.sin(K*5.1+c*9));for(let J=0;J<2;J++){const te=A*2+J;L[te*3]=ke,L[te*3+1]=jo+J*k,L[te*3+2]=vo,W[te*4]=K,W[te*4+1]=J,W[te*4+2]=c,W[te*4+3]=i,O[te*3]=Me/re,O[te*3+1]=-Ie/re,O[te*3+2]=M[A]}if(A<260){const J=A*2;H.push(J,J+2,J+1,J+1,J+2,J+3)}}const _=new a.BufferGeometry;_.setAttribute("position",new a.BufferAttribute(L,3)),_.setAttribute("aRib",new a.BufferAttribute(W,4)),_.setAttribute("aDir",new a.BufferAttribute(O,3)),_.setIndex(H);const X=M[260]/n.range(55,80),_e=()=>new a.ShaderMaterial({uniforms:{uTime:z,uSpeed:{value:ee},uRays:{value:X},uIntensity:{value:s},uEnds:{value:h},uEdge:{value:v},uFar:{value:l},uColorA:{value:V.clone()},uColorB:{value:$.clone()},uColorC:{value:new a.Color(B.fringe)}},vertexShader:ot,fragmentShader:tt,transparent:!0,depthWrite:!1,side:a.DoubleSide,blending:a.AdditiveBlending,fog:!1}),be=_e(),fe=new a.Mesh(_,be);fe.name="aurora",fe.frustumCulled=!1,fe.renderOrder=0,u.add(fe);const ue=_e(),De=new a.Mesh(_,ue);De.frustumCulled=!1,De.renderOrder=0,ne.add(De),ao.push({m:be,mm:ue,base:s,ph:n.range(0,6.28)})};{const p=n.range(-60,60),g=n.range(300,400),f=n.range(0,90);t(0,k=>{const s=q(1560,-2300,k);return[p+80*S.n2(s*.0011+f,7.3),s]},()=>g,n.range(340,420),.5*n.range(.85,1.15),.1,.3,.5)}const o=Y==="storm"?[520,60,-420,-1250]:n.chance(.5)?[350,-300,-1200]:[430,-120,-700,-1300];let r=n.sign();for(let p=0;p<o.length;p++){const g=o[p]+n.range(-70,70),f=n.range(25,40)*Math.PI/180,k=1/Math.tan(f),s=n.range(0,90),h=n.range(180,250),v=r;r=-r,t(p+1,l=>{const c=q(-900,900,l);return[c,g-v*c*k+110*S.n2(c*.0013+s,p*5.1+2)]},(l,c)=>h+.62*Math.max(Math.abs(c)-130,0),n.range(350,450),(Y==="storm"?.98:.8)*n.range(.85,1.15),.25,.16)}}G.push((e,t)=>{for(const o of ao){const r=o.base*(.72+.4*le.value+.12*Math.sin(t*.21*ee+o.ph));o.m.uniforms.uIntensity.value=r,o.mm.uniforms.uIntensity.value=r*.9}}),await d();const ve=[],Re=[],it=new a.Color("#ffb060"),ce=he.makeMaterials({night:1,lit:1,glow:4.2,warm:"#ffb060",halo:1.1});ce.setSky({top:"#020712",horizon:"#0e3842",sun:B.green,sunDir:[0,1,0]});const N=n.fork("hamlet"),no=[],ro=[],Co=[-52,-27,-3,24,49],Po={wall:["#5a3a34","#3d4a52","#6b4a32","#4a2f2f"],roof:["#cfe0ea","#b8ccd8"],trim:"#2a2422",wood:"#4a3a2e",accent:"#ffb060"};for(let e=0;e<5;e++){const t=w+Co[e]+N.range(-4,4),o=P*(ie(t,P)-N.range(7,17)-(e===2?5:0)),r=-P*N.range(.55,1.25),p=he.makeBuilding({rng:N.fork("h"+e),style:"stilt",stilts:N.range(2.4,3.4),pileDepth:0,lit:N.range(.85,1.25),mats:ce,palette:Po,position:[o,0,t],rotationY:r});no.push(p),e%2===0&&(ve.push(new a.Vector4(o+Math.sin(r)*3.2,4.4,t+Math.cos(r)*3.2,N.range(.85,1.2))),Re.push(new a.Color("#ffb060").multiplyScalar(1.1))),(e%2===0||N.chance(.3))&&ro.push([o,p.size.h-.4,t]),await d()}const Ye=w+N.range(6,16),io=P*(ie(Ye,P)-4),Ao=N.range(26,34),Fe=[io-P*Ao,0,Ye+N.range(2,8)],Ro=he.makePier({rng:N.fork("pier"),from:[io,0,Ye],to:Fe,width:3,height:1.7,pileDepth:0,lamps:!1,ladder:!1,mats:ce}),Ee=[Fe[0]+2.4*P,1.7,Fe[2]-.6],Fo=he.makeLamps({rng:N.fork("lamp"),mats:ce,positions:[Ee],type:"post",height:3.3,color:"#ffb060",power:2.8,poolPower:.45}),ge=[Ee[0],Ee[1]+3.3,Ee[2]];ve.push(new a.Vector4(ge[0],ge[1],ge[2],1.5)),Re.push(new a.Color("#ffb060").multiplyScalar(1.6));const Ge=he.makeBoat({rng:N.fork("boat"),type:N.pick(["rowboat","rowboat","sailboat"]),mats:ce,lit:1,position:[Fe[0]+P*N.range(3,7),0,Fe[2]+N.range(3.5,5)],heading:N.range(0,6.28),heightAt:(e,t,o)=>.05*Math.sin(o*.7+e*.4)+.03*Math.sin(o*1.1+t*.5)});await d();const $e=he.mergeObjects([...no,Ro,Fo]);u.add($e.object,Ge.object),await d();const so=he.makeReflection([$e,Ge],{mats:ce,waterY:0});u.add(so.object);const Ke=(e,t)=>e.traverse(o=>{o.isMesh&&o.material&&o.material.transparent&&(o.renderOrder=t)});Ke($e.object,4),Ke(Ge.object,4),Ke(so.object,0);const Je=new a.PointLight("#ffb060",140,70,2);Je.position.set(ge[0],ge[1],ge[2]),u.add(Je),G.push((e,t)=>{ce.update(e,t),Ge.update(e,t),Je.intensity=140*(.9+.07*Math.sin(t*7.3)+.05*Math.sin(t*13.1))});for(const e of ro){const t=Se.makeSmokeColumn({rng:N.fork("smoke"),time:z,position:e,height:N.range(22,27),radius:[.3,3.2],size:[.7,4.6],count:80,color:"#8fa8b4",colorTop:"#7fa0ae",shadowColor:"#4c6672",ambient:"#2a3c46",hot:"#6a3a18",hotFalloff:9,opacity:.25,rate:.06,wind:[-.9,0,-.5],sunDir:[0,1,0],sunColor:B.green,rim:.3,renderOrder:5});u.add(t.object)}await d();{const e=n.fork("trees"),t=Be.makeWind({direction:[.8,.45],strength:.7,speed:.7});await d();const o=Be.windMaterial({wind:t,backlight:0,ambient:1.5,leafAmbient:1.5});await d();const r={leaf:"#1d3d2e",leafLight:"#46705a",leafDark:"#08160f",bark:"#3a2c24",barkDark:"#1a130f",snowColor:"#cfe9f5"},p=[0,1].map(l=>Be.coniferGeometry({rng:e,detail:1,snow:.9,slim:1+l*.25,...r})),g=[0,1,2].map(l=>Be.coniferGeometry({rng:e,detail:0,snow:1,slim:.95+l*.2,...r}));await d();const f=[],k=(l,c,i,x)=>{const M=Ce(l,i,c);if(M>185||M<.6||(Ce(l,i+5,c)-Ce(l,Math.max(i-5,.01),c))/10>.95)return;const L=l*(ie(c,l)+i);!x&&S.n2(L*.011+ae,c*.011)<-.15-.25*e()||f.push({x:L,y:M,z:c,s:e.range(.65,1.3)*(x?.8:1)*(1-.3*E(60,185,M)),rot:e.range(0,6.28),d:x?0:999,u:0,v:e.int(0,5)})};for(let l=0;l<2600&&f.length<300;l++)k(e.sign(),e.range(-40,1130),6+250*Math.pow(e(),1.5),!1);const s=f.length;for(let l=0;l<40&&f.length<s+240;l++){const c=e.sign(),i=e.range(40,1100),x=e.range(10,95),M=e.int(5,11);for(let L=0;L<M;L++){const W=i+e.gauss()*16,O=Math.max(x+e.gauss()*13,5),H=f.length;if(!(Ce(c,O,W)>62)&&(k(c,W,O,!0),f.length>H)){const _=f[f.length-1];_.s*=1.6,_.d=999}}}const h=f.length;for(let l=0;l<700&&f.length<h+64;l++){const c=f.length;k(P,w+e.range(-110,110),11+95*Math.pow(e(),1.4),!0),f.length>c&&(f[f.length-1].s*=1.45)}await d();const v=Be.makeScatter({rng:e,points:f,variants:p,farVariants:g,farDistance:100,material:o,sink:.04,tint:.15,hue:.03});u.add(v.object),G.push((l,c,i)=>v.update(l,c,i))}await d();const Lo=new a.Color(B.portal);for(ve.push(new a.Vector4(Oe[0],Oe[1],Oe[2],.5)),Re.push(Lo.clone().multiplyScalar(1.5));ve.length<5;)ve.push(new a.Vector4(0,1,0,0)),Re.push(new a.Color(0,0,0));const we=[];for(let e=0;e<6;e++)we.push(new a.Vector4(0,0,0,0));{const e=new a.PlaneGeometry(600,1560,1,1);e.rotateX(-Math.PI/2),e.translate(0,0,560);const t=new a.ShaderMaterial({uniforms:{uTime:z,uPulse:le,uBody:{value:new a.Color("#020a12")},uSheen:{value:new a.Color("#0b2a36").multiplyScalar(.5)},uLight:{value:se.clone()},uRing:{value:we},uLamp:{value:ve.slice(0,5)},uLampCol:{value:Re.slice(0,5)},...Te()},vertexShader:Ho,fragmentShader:Uo,fog:!0,transparent:!0,depthWrite:!1,premultipliedAlpha:!0}),o=new a.Mesh(e,t);o.name="water",o.renderOrder=2,o.frustumCulled=!1,u.add(o)}{const e=n.fork("floes"),t=pe.icebergs,o=[],r=(s,h,v)=>t.some(l=>Math.hypot(l.position[0]-s,l.position[2]-h)<l.radius+v+1);for(let s=0;s<4e3&&o.length<620*4;s++){s%256===0&&await d();const h=e.range(0,.94),v=je(h),l=Ue(h),c=e.sign()*(2+95*Math.pow(e(),1.6)),i=v.x-l.z*c+e.range(-6,6),x=v.z+l.x*c+e.range(-10,10);if(Math.abs(i)>ie(x,Math.sign(i))-4||x<30||S.n2(i*.02+ae,x*.02)<-.25+.5*e())continue;const M=.45+2.3*Math.pow(e(),2.2);r(i,x,M)||o.push(i,x,M,e())}const p=nt(),g=new a.InstancedBufferGeometry;g.index=p.index,g.setAttribute("position",p.attributes.position),g.setAttribute("aFloe",new a.InstancedBufferAttribute(new Float32Array(o),4)),g.instanceCount=o.length/4;const f=new a.ShaderMaterial({uniforms:{uTime:z,uPulse:le,uLight:{value:se.clone()},uSky:{value:ze.clone()},uSnow:{value:Ne.clone()},uDeep:{value:new a.Color("#1c4a5c")},...Te()},vertexShader:Zo,fragmentShader:Xo,fog:!0,side:a.DoubleSide}),k=new a.Mesh(g,f);k.name="pancake-ice",k.frustumCulled=!1,u.add(k)}await d();const _o={uPulse:le,uLight:{value:se.clone()},uSky:{value:ze.clone().multiplyScalar(1.5)},uMoonDir:{value:Ze.clone()},uMoonCol:{value:new a.Color("#9fc0ff").multiplyScalar(.5)}},lo=(e,t)=>new a.ShaderMaterial({uniforms:{..._o,uFlip:{value:e},uBright:{value:t},...Te()},vertexShader:Yo,fragmentShader:$o,fog:!0,side:a.DoubleSide}),co=lo(1,1),fo=lo(-1,.75),Le=[];for(let e=0;e<6;e++)Le.push(new a.Vector4(0,0,-1,0));const Qe=[],uo=new a.Vector3;let ho=()=>uo;const Z=n.fork("orcas");{const e=go(8,2.6),t=go(6.2,2.4),o=je(.44),r=Ue(.44);r.y=0,r.normalize();const p=-P,g=Z.range(23,28),f=Z.range(9,10.5),k=Z(),s=new a.Vector3(o.x-r.z*p*g,0,o.z+r.x*p*g),h=Z.range(.5,.68),v=-r.z*p,l=r.x*p,c=Math.atan2(r.x*Math.cos(h)-v*Math.sin(h),r.z*Math.cos(h)-l*Math.sin(h));for(let M=0;M<T;M++){const L=M===0?e:t,W=(M===0?1:Z.range(.8,1.05))*1.6,O=new a.Mesh(L,co),H=new a.Mesh(L,fo);for(const _ of[O,H])_.rotation.order="YXZ",_.scale.setScalar(W),_.frustumCulled=!1;u.add(O),ne.add(H),Qe.push({a:O,b:H,sc:W,lat:(M-(T-1)/2)*Z.range(5,7)+Z.range(-1.5,1.5),along:Z.range(-16,16),period:f,phase:(k+.5*M/T+Z.range(-.04,.04))%1,finH:M===0?1.9:1})}const i=new a.Vector3(Math.sin(c),0,Math.cos(c)),x=new a.Vector3(i.z,0,-i.x);ho=M=>{const L=Math.max(Math.min((M-.42)*700,8),-92);return uo.set(s.x+i.x*L,2,s.z+i.z*L)},G.push((M,L,W,O)=>{const H=Math.max(Math.min((O-.42)*700,8),-92);for(let _=0;_<Qe.length;_++){const X=Qe[_],_e=(L/X.period+X.phase)%1,be=_e*X.period,fe=.74*X.period,ue=Math.min(_e/.74,1),De=Math.pow(Math.sin(Math.PI*ue),.55),A=H+X.along+be*1.5-6,K=s.x+i.x*A+x.x*X.lat,xe=s.z+i.z*A+x.z*X.lat,Ve=(-3.4+3.68*De)*X.sc,Ie=.2*Math.cos(Math.PI*ue)*(ue<1?1:0);for(const ke of[X.a,X.b])ke.position.set(K,Ve,xe),ke.rotation.set(-Ie,c,.06*Math.sin(L*.9+_)),ke.visible=ue<1;const Me=be-.3*fe;Le[_].set(K+i.x*1.6*X.sc,xe+i.z*1.6*X.sc,Me>=0&&Me<3.2?Me:-1,c);const re=be-.12*fe;re>0?we[_].set(K-i.x*1.5*re,xe-i.z*1.5*re,1.4+re*1.7,.95*Math.exp(-re/4.2)*E(0,.6,re)):we[_].w=0}})}let po=null;{const e=je(.6),t=Ue(.6);t.y=0,t.normalize();let o=null;for(let h=0;h<14&&!o;h++){const v=42+h%3*5,l=20+h*4,c=e.x+t.x*v-t.z*l,i=e.z+t.z*v+t.x*l;pe.icebergs.every(M=>Math.hypot(M.position[0]-c,M.position[2]-i)>M.radius+9)&&me.nearestXZ(c,i).dist>16&&(o=[c,i])}o||(o=[e.x+t.x*66-t.z*40,e.z+t.z*66+t.x*40]),po=new a.Vector3(o[0],4,o[1]);const r=je(.55),p=Z.range(8.5,10),g=at(p),f=Math.atan2(o[0]-r.x,o[1]-r.z)+Z.range(-.25,.25),k=new a.Mesh(g,co),s=new a.Mesh(g,fo);for(const h of[k,s])h.rotation.order="YXZ",h.frustumCulled=!1;u.add(k),ne.add(s),G.push((h,v,l,c)=>{const i=(c-.47)/.19,x=i>0&&i<1;for(const H of[k,s])H.visible=x;const M=q(q(-p*1.25,-.4,E(0,.3,i)),-p*1.5,E(.72,1,i))+.25*Math.sin(v*.7),L=q(-1.15,.04,E(.03,.32,i))+.35*E(.7,1,i)+.05*Math.sin(v*.55);for(const H of[k,s])H.position.set(o[0],M,o[1]),H.rotation.set(L,f,.05*Math.sin(v*.8));we[4].set(o[0],o[1],2+Math.max(i-.08,0)*34,i>.08&&i<1.8?1.1*Math.exp(-Math.max(i-.5,0)*2.2):0),we[5].set(o[0],o[1],1+Math.max(i-.7,0)*30,i>.7&&i<2.2?1*Math.exp(-(i-.7)*1.6):0);const W=(c-.43)*62;Le[5].set(o[0]+Math.sin(f)*9,o[1]+Math.cos(f)*9,W>=0&&W<3.2?W:-1,f);const O=(c-.485)*62%2.6;Le[4].set(o[0],o[1],i>.08&&i<.8&&O>=0?O*1.2:-1,f)})}{const t=new Float32Array(432),o=new Float32Array(576);for(let f=0;f<144;f++)o[f*4]=Math.floor(f/24),o[f*4+1]=Z(),o[f*4+2]=Z(),o[f*4+3]=Z();const r=new a.BufferGeometry;r.setAttribute("position",new a.BufferAttribute(t,3)),r.setAttribute("aSeed",new a.BufferAttribute(o,4));const p=new a.Vector2(960,540);y.renderer&&y.renderer.getDrawingBufferSize&&y.renderer.getDrawingBufferSize(p);const g=(f,k)=>{const s=new a.ShaderMaterial({uniforms:{uBlow:{value:Le},uScale:{value:p.y*.87},uColor:{value:se.clone().lerp(de,.1).multiplyScalar(1)},uBright:{value:f}},vertexShader:Ko,fragmentShader:Jo,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending}),h=new a.Points(r,s);return h.frustumCulled=!1,h.renderOrder=k,h};u.add(g(1,4)),ne.add(g(.6,0))}await d();const ye=Se.fxGroup();u.add(ye.object),ye.add(Se.makeParticles({rng:n.fork("snow"),preset:"snow",time:z,count:Math.round(1300*F),velocity:[.7,-.75,.3],velocityRandom:[.5,.4,.5],colors:["#e8f6ff","#b4ffdc","#cfe9f5"],size:[.03,.09],intensity:1.35,additive:.5,twinkle:.5,renderOrder:6})),await d(),ye.add(Se.makeShootingStars({rng:n.fork("stars"),time:z,count:n.int(5,8),period:[6,18],minElevation:.16,color:"#f0ffff",tailColor:B.green,intensity:2.5})),await d();const mo=Xe.clone().lerp(V,.08).multiplyScalar(1.5);ye.add(Se.makeMist({rng:n.fork("mist"),time:z,count:90,area:[560,5,560],center:[0,2,0],size:[50,120],color:mo,opacity:.13*b,drift:[.8,0,.45],flatten:.3,follow:!0,renderOrder:5})),await d();{const e=n.fork("mist2"),t=[];for(let o=0;o<18;o++)t.push([e.range(-125,125),e.range(2,5),e.range(18,110)]);for(let o=0;o<14;o++){const r=w+e.range(-95,95);t.push([P*(ie(r,P)-e.range(-12,55)),e.range(1.5,4),r])}ye.add(Se.makeMist({rng:e,time:z,positions:t,size:[34,80],color:mo.clone().lerp(new a.Color("#7fd8e8"),.25),opacity:.16*b,drift:[.25,0,.12],flatten:.3,renderOrder:5}))}const Do=[P*(ie(w,P)-14),4,w-6],Bo=new a.Vector3(pe.caveMouth.center[0],15,0),No=[{at:Do,from:.02,to:.26,weight:.58,fade:.35},{at:(e,t)=>ho(t),from:.26,to:.45,weight:.7},{at:po,from:.47,to:.65,weight:.5},{at:Bo,from:.66,to:.93,weight:.3}];return{scene:u,path:me,duration:46,title:B.title,camera:{fov:60,near:.5,far:7e3,lookAhead:34,sway:.6,bank:.55},pois:No,portal:{shape:"circle",radius:pe.portalSeat.radius,color:B.portal,glow:.7,revealDistance:320},post:{exposure:1.18,bloom:{strength:.62,radius:.72,threshold:.8},grade:{saturation:1.08,contrast:1.06,tint:"#eef8ff",shadowTint:"#030a16",vignette:.38,grain:.03,aberration:0}},update(e,t,o,r){z.value=t;const p=.5+.35*Math.sin(t*.31)+.15*Math.sin(t*.83+1.3);le.value=p,Pe.sun.intensity=yo*(.75+.5*p);for(const g of G)g(e,t,o,r);ye.update(e,t,o),Q.setAurora(B.green,q(1.45,1,E(.05,.55,r))*q(1,.62,E(.78,.96,r))),Q.setProgress(Math.min(r,.7)),Q.update(e,t,o)},dispose(){Q.dispose(),I.dispose&&I.dispose();for(const e of D)e.dispose&&e.dispose()}}}};export{ut as default};
