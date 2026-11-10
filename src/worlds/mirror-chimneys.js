import*as u from"three";import{mergeGeometries as Bo}from"three/addons/utils/BufferGeometryUtils.js";import{makePath as Co,clamp as ue,lerp as $,smoothstep as z,makeRng as No}from"../kit/core.js";import{buildHero as qo,LAMP_GLSL as w0,NOISE_GLSL as o0,bearing as h0}from"../parts/mirror-chimneys.js";const Oe=["#03060C","#B8862F","#7A3418","#E9E2CF","#C4D3DA","#D21F2B","#BFE6FF"],y=(r,_,k)=>new u.Vector3(r,_,k),Te=Math.PI/180,ge=Math.PI*2,Ve=(r,_)=>new u.Float32BufferAttribute(r,_),m0=`#include <common>
#include <fog_pars_vertex>
`,y0=`#include <common>
#include <fog_pars_fragment>
`,Jt=`
vec3 mcWater(vec3 D, vec3 lampDir, float time, vec3 bg, vec3 hazeK, float haze){
  float fwd = max(dot(D, lampDir), 0.0);
  float n = mcN(D * 2.6 + vec3(time * 0.013, -time * 0.008, 0.0)), n2 = mcN(D * 7.0 + vec3(0.0, time * 0.02, 3.0));
  float lv = (D.y + 0.04) / 0.34;
  float h = clamp((0.16 + 0.60 * fwd * fwd * fwd + 0.46 * exp(-lv * lv)) * (0.78 + 0.34 * n + 0.10 * n2) * (1.0 - 0.6 * smoothstep(0.35, 1.0, D.y)), 0.0, 1.0);
  // (the grade's toe is steep: under about 0.055 everything is black and by 0.08 it is mid slate, so the whole of the haze
  // lives between these two colours)
  // (and the toe takes red first: at (0.050, 0.054, 0.060) the open water came out (0, 0, 30), black with a blue cast. These two
  // ends come out near (14, 23, 44) and (24, 35, 58): a dark slate with all three channels alive, in every look)
  return bg + mix(vec3(0.0668, 0.0650, 0.0674), vec3(0.0704, 0.0711, 0.0782), h) * hazeK * haze;
}`,eo=`
${m0}
attribute vec3 aBed; attribute float aSteep; varying vec3 vW; varying vec3 vN; varying vec3 vB; varying float vS;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); vB = aBed; vS = aSteep;
  vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,to=`
${y0}
${o0}
${w0}
${Jt}
uniform float uTime, uFlow, uVant, uFill, uHaze; uniform vec3 uMat, uOchre, uRust, uHazeK; uniform vec4 uEnd;
varying vec3 vW; varying vec3 vN; varying vec3 vB; varying float vS;
void main(){
  vec3 N = normalize(vN); vec3 V = cameraPosition - vW; float dE = length(V); V /= max(dE, 1e-3);
  float near = 1.0 - smoothstep(12.0, 38.0, dE);
  float fw = length(fwidth(vW)); float k1 = 1.0 - smoothstep(0.12, 0.45, fw), k2 = 1.0 - smoothstep(0.03, 0.12, fw);
  vec4 cv1 = mcCellV(vec3(vW.x * 0.8, vW.y * 0.35, vW.z * 0.8)); vec3 g1 = cv1.xyz * vec3(0.8, 0.35, 0.8); float c1 = cv1.w, dm1 = sqrt(max(1.0 - c1 * c1 * 1.5, 0.0));
  // THE GRAIN ON STEEP FACES: the pillows' cells above stand 2.3 times taller than wide (y is read at 0.35, x and z at 0.8). A
  // level bed, cut across them, never shows it; a wall shows pillows drawn out down the slope, and the mat in their seams as
  // long smears. Where the bed stands steep (vS: 0 up to 42 degrees from level, 1 from 60, from the bed's own normal) the
  // pillows are read round, with the grain of the level bed
  if (vS > 0.0) { vec4 cvS = mcCellV(vW * 0.8 + 4.0); float dmS = sqrt(max(1.0 - cvS.w * cvS.w * 1.5, 0.0)); g1 = mix(g1, cvS.xyz * 0.8, vS); c1 = mix(c1, cvS.w, vS); dm1 = mix(dm1, dmS, vS); }
  float dome = mix(0.6, dm1, k1);
  vec4 cv2 = mcCellV(vW * 3.3 + 2.0); float c2 = cv2.w, dm2 = sqrt(max(1.0 - c2 * c2 * 1.7, 0.0)); float d2 = mix(0.6, dm2, k2);
  float fine = mcF(vW * 6.0);
  float big = mcF(vW * 0.33 + 11.0);
  // the pillows' slopes come from the pillows themselves (smooth close to: screen differences shade in 2 x 2 pixel blocks);
  // only the grain still uses them, and only where a pixel is smaller than it
  float hk = 0.3 + 0.7 * near;
  float h = fine * 0.03 * near * (1.0 - smoothstep(0.010, 0.026, fw)) * hk;
  vec3 dpx = dFdx(vW), dpy = dFdy(vW); float hx = dFdx(h), hy = dFdy(h);
  vec3 r1 = cross(dpy, N), r2 = cross(N, dpx); float det = dot(dpx, r1);
  vec3 sg = sign(det) * (hx * r1 + hy * r2);
  vec3 G = (g1 * (1.5 * 0.26 * k1 / max(dm1, 0.4)) * smoothstep(0.0, 0.25, dm1) + cv2.xyz * (5.61 * 0.06 * near * k2 / max(dm2, 0.4)) * smoothstep(0.0, 0.25, dm2)) * hk;
  G -= N * dot(G, N);
  N = normalize(abs(det) * (N - G * 1.2) - sg * 1.2 + N * 1e-5);
  float crack = smoothstep(0.62, 0.98, c1) * k1;
  // THE GRAIN'S RANGE: the fine grain (a sixth of a metre across) was the one term of the bed's tone that no range thinned.
  // Far off its period falls under two pixels and it crawls as the lens moves, most on a face turned to the eye. By the
  // distance from the eye alone, as a texture thins, it gives way to its own mean (0.469): from 60 m, where its period is
  // 2 pixels of a frame 1920 wide (0.65 of one 640 wide), to 100 m, where it is 1.2 (0.39). Within 60 m the line is not run
  // and the bed is as it was: 85 to 92 in 100 of the bed's pixels nearer than the last stretch (counted from the route); the
  // lander's ground, 50 to 71 m from the eye, loses 0.08 of its grain at most on the mean; the last stretch, 77 to 193 m
  // off, where the crawl was, loses 0.39 of it at 77 m and all of it from 100 m. (From 20 m, two pixels of a frame 640 wide, the lander's ground from the
  // vantage lost its grain whole, 0.15 of its fine contrast, and at 1920 the pillows 40 to 60 m off went smooth: not taken)
  if (dE > 60.0) fine = mix(fine, 0.469, smoothstep(60.0, 100.0, dE));
  vec3 glass = vec3(0.135, 0.135, 0.150) * (0.55 + 0.9 * fine) * (0.7 + 0.5 * d2);
  glass = mix(glass, uRust * 0.30, smoothstep(0.55, 0.8, big) * 0.5);
  // mat: in the seams between pillows, in the low places and along the fissure, stirring in the flow
  float seam = 1.0 - dome;
  float mm = vB.x * 1.25 + mix(0.32, seam, k1) * 0.85 + (mcF(vW * 0.7 + 3.0) - 0.5) * 0.9 - 0.20;      // (too far off to see the seams, the mat they hold still lies in pale patches)
  float matMask = smoothstep(0.22, 0.5, mm);
  float stir = mcN(vec3(vW.x * 1.9 - uTime * 0.8 * uFlow, vW.y * 1.5, vW.z * 1.9 + sin(uTime * 0.27 + vW.x * 0.4) * 0.25));
  float fur = mcN(vec3(vW.x * 8.0 - uTime * 0.7 * uFlow, vW.y * 8.0, vW.z * 15.0 + sin(uTime * 0.9 + vW.x) * 0.3));
  vec3 matc = uMat * (0.50 + 0.56 * stir + 0.24 * fur * near);          // the mat streams: light and dark run down the flow
  vec3 alb = mix(glass, matc, matMask);
  float fl = smoothstep(0.42, 0.68, vB.y + (mcF(vW * 1.2 + 17.0) - 0.5) * 0.9) * (1.0 - matMask * 0.8);
  alb = mix(alb, mix(uOchre, uRust, 0.35 + 0.4 * fine) * 0.85, fl * 0.85);
  alb *= mix(0.22, 1.0, vB.z) * (1.0 - 0.7 * crack * (1.0 - matMask));
  alb = mix(alb, vec3(dot(alb, vec3(0.35, 0.5, 0.15))) * vec3(0.66, 0.88, 1.16), smoothstep(18.0, 70.0, dE) * 0.85);      // beyond the lamps colour drifts to blue-grey (as on the rock): far floc under sodium lamps went olive
  vec3 E = mcLight(vW, N, dE);
  float mE = max(E.r, max(E.g, E.b)); E *= mE > 1.0 ? (1.0 + (mE - 1.0) * 0.45) / mE : 1.0;      // a knee: the mat under the lander's beam keeps its streaming pattern, it does not burn to a white plate
  vec3 col = alb * E;
  // across the north vantage (uVant) the bed between the tower and the lander has to read from 40 m with the lamps looking
  // up at the ring: the lander's lamps spill a pool of cold light on the ground round it, and the pale slate of the lit
  // water lies on every upward face, so the field is pale mat on dark pillows and never a black floor. Round the tour
  // (uFill) the same pale fill lies, weaker, on the bed beyond the headlamps' reach: the field is a floor, not a void
  vec3 Lp = uLandPos[1] - vW; float dl = length(Lp);
  float wrapL = 0.35 + 0.65 * max(dot(N, Lp / max(dl, 1e-3)), 0.0);
  vec3 fillC = mix(vec3(dot(uScatter, vec3(0.3333))), uScatter, 0.08) * (0.45 + 0.55 * N.y);
  col += alb * (uVant * uLandCol * uLandI * 0.20 * wrapL / (1.0 + dl * dl / 500.0) * exp(-uAbsorb * dE) + fillC * 17.0 * max(uVant, uFill * smoothstep(7.0, 24.0, dE)) * exp(-uAbsorb * dE * 0.4));
  col = mix(col, vec3(dot(col, vec3(0.30, 0.55, 0.15))) * vec3(0.74, 0.92, 1.14), smoothstep(18.0, 60.0, dE) * 0.8);      // far off, whatever lit it, the bed is blue-grey: sodium light on the slate fill went olive
  // glassy rind: a tight glint that turns with the lamps
  col += uLampCol * uLampI * (1.0 - matMask) * (1.0 - fl) * mcGlint(vW, N, V, 70.0) * 0.10 * exp(-uAbsorb * 2.0 * dE) / (1.0 + dE / uLampFall);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
  // THE BED'S END: the bed is a mesh and it stops (uEnd: its four ends). Over its last stretch, the last 18 m before an end
  // or from 102 m out from the middle (rawH raises the same stretch in hills), it takes the tone the water shows in its own
  // direction (mcWater, the dome's own law with the dome's own values): none where the stretch begins, its whole share from
  // seven tenths of the way up. THE SHARE (the far hills, see THE FAR HILLS: their ground wears this shader on the stretch and
  // beyond the end): 0.86 as far as the bed's end, 0.91 from 40 m beyond it, and all of it from 48 to 60 m beyond, where
  // that ground stops. So the hills keep 0.14 to 0.09 of their own tone and stand against the water as low, dim ground, the
  // nearer row the darker, and no edge stands where the ground ends. (In pictures: keeping 0.25 to 0.12 the crest stood 15
  // levels under the water behind it, keeping 0.14 to 0.06 it stood 7, as built 8.5 to 9.7; the site's bed end 33 to 35.) By the
  // fissure's mouth (west: within 24 m of z 4, the share whole from 46 m) the melt runs to all, as before. Nearer than the
  // stretch the weight is 0 and the line is not run: the bed is as it was. Nothing stands on the melting stretch or beyond
  // it (seeds 1 to 40: the chimneys' aprons reach 89 m out and stop 27 m short of an end)
  float bE = min(min(vW.x - uEnd.x, uEnd.y - vW.x), min(vW.z - uEnd.z, uEnd.w - vW.z)), rE = length(vW.xz), eE = max(-bE, rE - 118.0);
  float wEnd = smoothstep(0.0, 0.7, max(1.0 - smoothstep(0.0, 18.0, bE), smoothstep(102.0, 118.0, rE))) * mix(1.0, 0.86 + 0.05 * smoothstep(0.0, 40.0, eE) + 0.09 * smoothstep(48.0, 60.0, eE), vW.x < 0.0 ? smoothstep(24.0, 46.0, abs(vW.z - 4.0)) : 1.0);
  if (wEnd > 0.0) gl_FragColor.rgb = mix(gl_FragColor.rgb, mcWater(-V, uLampDir, uTime, fogColor, uHazeK, uHaze), wEnd);
}`,Wo=eo.replace("attribute vec3 aBed;","attribute vec4 aHem; varying float vIn;").replace("vB = aBed;","vB = aHem.xyz; vIn = aHem.w;"),Vo=to.replace("varying vec3 vB;","varying vec3 vB; varying float vIn;").replace("gl_FragColor = vec4(col, 1.0);","gl_FragColor = vec4(col, clamp(vIn, 0.0, 1.0));"),ht=`
${y0}
${o0}
${w0}
uniform float uFoul, uSoft, uFish; uniform vec3 uMat;
varying vec3 vW; varying vec3 vN; varying vec3 vC; varying float vG; varying vec3 vL;
void main(){
  vec3 V = cameraPosition - vW; float dE = length(V); V /= max(dE, 1e-3);
  vec3 N = normalize(vN + V * 1e-4); if (dot(N, V) < 0.0) N = -N;
  float lens = step(1.5, vG), gloss = min(vG, 1.0);
  float thin = uSoft * (1.0 - smoothstep(0.06, 0.2, vG));          // soft bodies: gloss under 0.1 marks the thin parts (web, fins)
  vec3 alb = vC;
  // eelpout (uFish): a mottled grey back, a paler belly, a dark eye on each cheek (in the fish's own frame: z along, y back)
  float eyeF = 1.0 - smoothstep(0.013, 0.027, length(vec3(abs(vL.x) - 0.072, vL.y - 0.030, vL.z - 0.385)));
  alb *= mix(1.0, mix(1.12, 0.50 + 0.22 * mcF(vL * 21.0), smoothstep(-0.03, 0.07, vL.y)) * (1.0 - 0.92 * eyeF), uFish);
  float up = smoothstep(0.25, 0.9, N.y) * smoothstep(0.38, 0.6, mcF(vW * 3.1)) + 0.35 * smoothstep(0.55, 0.75, mcF(vW * 5.0 + 4.0));
  alb = mix(alb, uMat * 0.8, clamp(up, 0.0, 1.0) * uFoul * (1.0 - lens));
  vec3 E = mcLight(vW, normalize(N + V * mix(0.25, 0.04, uSoft)), dE);
  E /= 1.0 + mix(0.45, 0.22, uSoft) * max(max(E.r, E.g), E.b);          // a pale body a metre from the lamps must not burn out and bloom: nothing here glows
  float ndv = max(dot(N, V), 0.0);
  // a soft body is lit from where we sit, so its form has to come from the turn of the surface: a lit cheek facing us, the
  // flanks falling to a third, freckled in its own skin (vL, not the water it swims through)
  alb *= mix(1.0, (0.70 + 0.36 * mcF(vL * 9.0) + 0.26 * mcF(vL * 31.0 + 5.0)) * (0.26 + 0.74 * ndv * sqrt(ndv)), uSoft * (1.0 - lens));
  vec3 col = alb * E;
  col += uSoft * uScatter * 2.2 * vC * pow(max(1.0 - ndv, 0.0), 3.0);                                  // the slate of the water on the turning edge
  col += min(thin * vC * vec3(1.0, 0.50, 0.36) * mcLight(vW, V, dE) * (0.22 + 0.9 * pow(max(1.0 - ndv, 0.0), 1.5)), vec3(0.42, 0.26, 0.22));   // lamp light glowing through the thin web and fins (capped: a glow, never a lit sign)
  col += uLampCol * min(uLampI * gloss * mcGlint(vW, N, V, 46.0) * 0.45 * exp(-uAbsorb.y * 2.0 * dE) / (1.0 + dE / uLampFall), 1.2);
  col = mix(col, uLandCol * (3.5 + 3.0 * pow(max(dot(N, V), 0.0), 3.0)), lens);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,To=ht.replace("  float eyeF = 1.0 - smoothstep(0.013, 0.027, length(vec3(abs(vL.x) - 0.072, vL.y - 0.030, vL.z - 0.385)));",`  float eDf = length(vec3(abs(vL.x) - 0.074, vL.y - 0.030, vL.z - 0.385));
  float eyeF = 1.0 - smoothstep(0.019, 0.028, eDf), eyeR = (1.0 - smoothstep(0.036, 0.046, eDf)) * (1.0 - eyeF);
  float saddle = smoothstep(0.42, 0.62, mcN(vec3(vL.z * 15.0 + 0.5 * sin(vL.y * 38.0), 2.0, abs(vL.x) * 6.0)));
  float finF = smoothstep(0.050, 0.078, abs(vL.y)) * smoothstep(0.18, -0.10, vL.z), ray = 0.72 + 0.28 * sin(vL.z * 330.0 + abs(vL.y) * 70.0);
  float gill = (1.0 - smoothstep(0.004, 0.011, abs(vL.z - 0.292 + 9.0 * vL.y * vL.y))) * (1.0 - smoothstep(0.06, 0.085, abs(vL.y)));
  float mouth = (1.0 - smoothstep(0.003, 0.008, abs(vL.y + 0.012))) * smoothstep(0.405, 0.43, vL.z);`).replace("  alb *= mix(1.0, mix(1.12, 0.50 + 0.22 * mcF(vL * 21.0), smoothstep(-0.03, 0.07, vL.y)) * (1.0 - 0.92 * eyeF), uFish);","  alb *= mix(1.0, mix(mix(1.12, (0.62 + 0.22 * mcF(vL * 21.0)) * (1.0 - 0.45 * saddle), smoothstep(-0.03, 0.07, vL.y)), 1.25 * ray, finF) * (1.0 - 0.5 * max(gill, mouth)) * (1.0 + 0.5 * eyeR) * (1.0 - 0.94 * eyeF), uFish);"),Po=`
${y0}
${o0}
${w0}
uniform vec3 uEyeL;
varying vec3 vW; varying vec3 vN; varying vec3 vC; varying float vG; varying vec3 vL; varying float vFin;
void main(){
  vec3 V = cameraPosition - vW; float dE = length(V); V /= max(dE, 1e-3);
  vec3 N = normalize(vN + V * 1e-4); if (dot(N, V) < 0.0) N = -N;
  float ndv = max(dot(N, V), 0.0), rim1 = 1.0 - ndv;
  float thin = 1.0 - smoothstep(0.06, 0.2, vG), fin = clamp(vFin * 3.0, 0.0, 1.0);          // fin: 1 on the two ear fins (flat paddles: a rim term lit the whole of one as a white flap)
  // skin: freckled with dark chromatophores, faintly banded round the mantle
  float fr = mcF(vL * 11.0), sp = smoothstep(0.52, 0.70, mcN(vL * 46.0 + 3.0));
  vec3 alb = vC * (0.74 + 0.5 * fr) * (1.0 - 0.45 * sp) * (0.92 + 0.08 * sin(vL.y * 60.0 + fr * 4.0));
  // the eight arms: a pale line from the neck to each point of the web's rim (dArm: how far this point of the skin lies from
  // the nearest arm, in the animal's own units; a line 4 cm across on the 1.5 m animal), on the web's upper face and its
  // under face alike, and none at the mouth. Pale areolae: one in about half of the 19 cm cells of the skin, 6 to 10 cm across
  float ang = atan(vL.z / 0.94, vL.x), rad = length(vec2(vL.x, vL.z / 0.94));
  float dArm = abs(fract(ang * 1.2732395 + 0.5) - 0.5) * 0.7853982 * rad;
  float armL = (1.0 - smoothstep(0.008, 0.020, dArm)) * smoothstep(0.03, -0.07, vL.y) * smoothstep(0.05, 0.10, rad) * (1.0 - fin);
  vec4 cs = mcCellV(vL * 8.0);
  float spot = (1.0 - smoothstep(0.15, 0.27, cs.w)) * step(0.45, mcH(floor(vL * 8.0 + cs.xyz) + 0.5)) * (1.0 - fin);
  alb = mix(alb, vec3(0.72, 0.42, 0.37) * (0.85 + 0.3 * fr), max(armL * 0.7, spot * 0.4));
  // the core: how much of the viscera the sight line crosses behind this point of the skin
  vec3 dl = normalize(vL - uEyeL + vec3(1e-5, 0.0, 0.0)), rr = vec3(0.118, 0.160, 0.112);
  vec3 oc = (vL - vec3(0.0, 0.205, 0.0)) / rr, dc = dl / rr;
  float qa = dot(dc, dc), qb = dot(oc, dc), qd = qb * qb - qa * (dot(oc, oc) - 1.0);
  float core = qd > 0.0 ? clamp(2.0 * sqrt(qd) / qa / 0.26, 0.0, 1.0) * step(-0.05, (-qb - sqrt(qd)) / qa + 0.12) : 0.0;
  core *= 1.0 - thin;
  // a dull dark eye low on each cheek, painted (no bead, no highlight): a disc 15 cm across in a pale ring 3 cm wide
  vec3 ep = vec3(abs(vL.x) - 0.185, vL.y - 0.105, vL.z + 0.175); float eD = length(ep), eye = 1.0 - smoothstep(0.044, 0.056, eD), ering = (1.0 - smoothstep(0.066, 0.080, eD)) * (1.0 - eye);
  alb = mix(alb, vec3(0.74, 0.44, 0.39), ering * 0.85);
  alb = mix(alb, vec3(0.05, 0.012, 0.016), max(0.30 * core, eye * 0.95));      // (the gut is a faint darker heart inside the bell: at 0.88 it was a hole in the mantle)
  vec3 E = mcLight(vW, N, dE);                                            // each lamp from where it stands, on the skin's own turn
  float mE = max(max(E.r, E.g), E.b); E *= mE > 1.0 ? (1.0 + (mE - 1.0) * 0.5) / mE : 1.0;      // a knee over 1 (a metre or four from the lamps: lit, never burnt out)
  vec3 col = alb * E * 0.36;             // wine: the face turned to the lamps comes out near 0.2 at 4 to 5 m, the flank at half of it, the limb black (the grade lifts anything over 0.2 to rose and drops anything under 0.06 to black)
  // the turning edge: light from behind comes through it. Slate of the water, and the lander's cold lamps when they stand behind
  vec3 Ll = normalize(uLandPos[1] - vW); float back = max(dot(-V, Ll), 0.0);
  float edge = rim1 * rim1 * sqrt(rim1);
  // (a thin cold line and no more: capped well under white, and none on the fins. At 0.15 uncapped it ringed the mantle in grey-white)
  col += min(uLandCol * (0.16 + 0.84 * back * back) * edge * 0.06 * uLandI * (1.0 - 0.86 * thin) * mix(vec3(1.0), vC * 2.2, 0.25 + 0.65 * thin), vec3(0.085, 0.095, 0.115)) * (1.0 - fin);      // (the web is thin all over, not only at its edge: what comes through it is wine, and less)
  col += uScatter * 1.1 * vC * edge * (1.0 - fin);
  // the lamps through the thin web: a wine glow, capped
  col += min(thin * vC * vec3(1.0, 0.42, 0.34) * mcLight(vW, V, dE) * (0.05 + 0.25 * rim1), vec3(0.075, 0.020, 0.022));
  col += mix(uLampCol, vC * 2.4, 0.6) * min(uLampI * vG * mcGlint(vW, N, V, 420.0) * 0.5 * exp(-uAbsorb.y * 2.0 * dE) / (1.0 + dE / uLampFall), 0.05) * (1.0 - fin);   // a pin of wet glint, rose, never white
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,mt=`
${m0}
attribute vec4 aPos; attribute vec3 aNrm; attribute vec4 aCol;
uniform float uTime, uSize, uRange, uSeethe, uWave;
varying vec3 vW; varying vec3 vN; varying vec3 vC; varying float vG; varying vec3 vL;
void main(){
  vL = position;
  float sd = aPos.w; vec3 n = normalize(aNrm + vec3(0.0, 1e-4, 0.0));
  vec3 t1 = normalize(cross(n, vec3(0.0, 1.0, 0.0)) + vec3(2e-3, 0.0, 1e-3)); vec3 t2 = normalize(cross(n, t1));
  float ph = sd * 61.0, f = (0.5 + fract(sd * 7.0)) * uSeethe;
  vec2 w = vec2(sin(uTime * f + ph) + 0.5 * sin(uTime * f * 2.3 + ph * 1.7), cos(uTime * f * 0.8 + ph * 2.1) + 0.5 * sin(uTime * f * 1.9 + ph)) * uRange * min(length(aNrm), 1.0);
  float hd = ph + sin(uTime * f * 0.6 + ph) * 2.0 * step(1e-4, uRange);
  float ca = cos(hd), sa = sin(hd);
  vec3 fwd = t1 * ca + t2 * sa, rt = t2 * ca - t1 * sa;
  float s = uSize * (0.7 + 0.6 * fract(sd * 13.0));
  vec3 lp = position;
  lp.y += uv.x * (0.5 + 0.5 * sin(uTime * (1.2 + 2.0 * fract(sd * 3.0)) * uWave + ph + uv.y * 3.14159)) * 0.55 * step(1e-4, uWave);
  lp *= s;
  vec3 p = aPos.xyz + t1 * w.x + t2 * w.y + rt * lp.x + n * lp.y + fwd * lp.z;
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vW = wp.xyz; vN = normalize(rt * normal.x + n * normal.y + fwd * normal.z);
  vC = aCol.rgb * (0.8 + 0.4 * fract(sd * 29.0)); vG = aCol.a;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,_o=`
${m0}
attribute vec4 aHome; attribute vec4 aOut; attribute vec4 aCol;
uniform float uTime, uBurst, uSize;
varying vec3 vW; varying vec3 vN; varying vec3 vC; varying float vG; varying vec3 vL;
void main(){
  vL = position;
  float sd = aHome.w;
  float k = clamp(uBurst - aOut.w, 0.0, 3.0) * step(aOut.w, 9.0);   // delay >= 9: this fish never bolts
  float go = 1.0 - exp(-k * 2.6);
  vec3 od = normalize(aOut.xyz + vec3(0.0, 1e-3, 0.0));
  vec3 hang = normalize(vec3(sin(sd * 40.0) * 0.25 + 0.2, 1.0, cos(sd * 31.0) * 0.25));
  vec3 A = normalize(mix(hang, od, smoothstep(0.0, 0.25, k)) + vec3(1e-4, 0.0, 0.0));
  vec3 ex = normalize(cross(A, vec3(0.31, 0.12, 0.94)) + vec3(1e-4, 0.0, 0.0)); vec3 ey = cross(A, ex);
  float dart = exp(-k * 1.5) * step(0.001, k);
  float tail = clamp(0.5 - position.z, 0.0, 1.0);
  float beat = sin(uTime * (2.2 + 9.0 * dart) + sd * 50.0 - tail * 5.0) * (0.035 + 0.10 * dart) * tail * tail * 2.0;
  vec3 lp = position; lp.x += beat;
  lp *= uSize * (0.8 + 0.4 * fract(sd * 9.0));
  vec3 base = aHome.xyz + od * go * (1.9 + 1.6 * fract(sd * 5.0)) + vec3(sin(uTime * 0.5 + sd * 20.0), sin(uTime * 0.37 + sd * 9.0), cos(uTime * 0.43 + sd * 14.0)) * 0.10;
  vec3 p = base + ex * lp.x + ey * lp.y + A * lp.z;
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vW = wp.xyz; vN = normalize(ex * normal.x + ey * normal.y + A * normal.z);
  vC = aCol.rgb; vG = aCol.a;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,oo=`
${m0}
attribute vec4 aCol; uniform float uTime, uRow;
varying vec3 vW; varying vec3 vN; varying vec3 vC; varying float vG; varying vec3 vL; varying float vFin;
void main(){
  vL = position;
  vec3 lp = position;
  float fin = uv.x, sk = uv.y;
  vFin = uv.x * (1.0 - step(0.5, uv.y));                           // the swimmer's two ear fins (its arm tips also row, with uv.y 1)
  float st = sin(uTime * 2.6 * uRow - abs(lp.x) * 5.0);
  lp.y += fin * st * 0.16; lp.z += fin * cos(uTime * 2.6 * uRow - abs(lp.x) * 5.0) * 0.05;
  float pu = sin(uTime * 1.5 * uRow - lp.y * 2.0);
  lp.xz *= 1.0 + sk * 0.20 * pu; lp.y += sk * 0.05 * cos(uTime * 1.5 * uRow);
  vec4 wp = modelMatrix * vec4(lp, 1.0);
  vW = wp.xyz; vN = normalize(mat3(modelMatrix) * normal + vec3(0.0, 1e-5, 0.0));
  vC = aCol.rgb; vG = aCol.a;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Do=`
${m0}
attribute vec4 aB; attribute vec4 aB2; uniform float uTime;
varying vec3 vCen; varying vec2 vQ; varying vec3 vSz;
void main(){
  float sd = aB.w, H = max(aB2.y, 0.1);
  float fr = fract(sd * 7.31 + uTime * aB2.x / H);
  float size = mix(aB2.z, aB2.w, fr * fr);
  float wob = sin(uTime * (5.0 + 4.0 * fract(sd * 3.0)) / (1.0 + size * 6.0) + sd * 40.0);
  float domeK = smoothstep(0.10, 0.22, size);
  float end = smoothstep(0.0, 0.03, fr) * (1.0 - smoothstep(0.96, 1.0, fr));
  vec3 c = vec3(aB.x, aB.y + fr * H, aB.z);
  c.x += sin(uTime * 1.3 + sd * 17.0 + fr * 9.0) * (0.05 + size * 0.5); c.z += cos(uTime * 1.1 + sd * 11.0 + fr * 7.0) * (0.05 + size * 0.5);
  vec2 rad = size * end * vec2((1.0 + 0.16 * wob) * (1.0 + 0.3 * domeK), 1.0 - 0.16 * wob);      // it wobbles: wider as it is lower
  vec4 mv = viewMatrix * modelMatrix * vec4(c, 1.0);
  mv.xy += position.xy * rad * 1.06;                              // (a margin for the soft edge)
  vCen = (modelMatrix * vec4(c, 1.0)).xyz; vQ = position.xy * 1.06; vSz = vec3(rad, size);
  vec4 mvPosition = mv; gl_Position = projectionMatrix * mv;
  #include <fog_vertex>
}`,Ro=`
${y0}
${o0}
${w0}
uniform float uBubWarm;
varying vec3 vCen; varying vec2 vQ; varying vec3 vSz;
void main(){
  float domeK = smoothstep(0.10, 0.22, vSz.z);
  vec2 q = vQ; q.y = q.y < 0.0 ? q.y / mix(1.0, 0.60, domeK) : q.y;          // a big one is a cap: round above, a shallow belly below
  float r2 = dot(q, q), r = sqrt(r2), fw = max(fwidth(r), 1e-4);
  float cov = 1.0 - smoothstep(1.0 - 1.5 * fw, 1.0, r);
  if (cov < 0.004) discard;
  vec3 nl = vec3(q, sqrt(max(1.0 - r2, 0.0)));
  vec3 N = normalize(nl * mat3(viewMatrix) + vec3(0.0, 1e-5, 0.0));          // out of the view frame into the world's
  vec3 vW = vCen + N * max(vSz.x, vSz.y);
  vec3 V = cameraPosition - vW; float dE = length(V); V /= max(dE, 1e-3);
  float nv = nl.z, e1 = 1.0 - nv, e2 = e1 * e1;
  // a bubble under water is a mirror round its edge and clear in the middle; the band is brightest over its cap, where it
  // gives the lamps back, and all but gone underneath: a lit dome with a fine bright line round its outline, never a ring
  float cap = smoothstep(-0.35, 0.85, N.y), band = 1.0 - smoothstep(0.40, 0.92, nv);
  float rim = band * (0.20 + 0.80 * cap);
  float line = 0.5 * e2 * e2 * e2 * (0.45 + 0.55 * cap);
  float frost = 0.75 + 0.25 * mcN(vW * 60.0 / (1.0 + vSz.z * 20.0));
  vec3 E = mcLight(vW, V, dE) + mcLight(vW, -V, dE) * 0.6;
  float gl = mcGlint(vW, N, V, 150.0);                                       // one pin of glint
  // the side that faces the tower gives back its lit stone: a dim gold patch on the body of every bubble, so each is a small
  // lit dome with weight and not an outline
  // (placed on the face we see: toward the tower as the picture has it, and upward of the middle)
  vec2 tw = (mat3(viewMatrix) * vec3(-vCen.x, 0.0, -vCen.z)).xy; tw = tw / max(length(tw), 1e-3) + vec2(0.0, 0.7);
  vec2 qw = q - 0.40 * tw / max(length(tw), 1e-3); float warm = exp(-dot(qw, qw) / 0.075) * (0.35 + 0.65 * nv);
  // (the band gives back the lit water, brighter than the water behind it over the cap; underneath it is a thin dark edge)
  vec3 col = (vec3(0.80, 0.90, 0.96) * min(E, vec3(1.1)) * (rim * 0.66 + 0.05 + line) + vec3(0.185, 0.204, 0.240) * (rim * (0.55 + 1.05 * cap) + 1.5 * line) + vec3(1.0, 0.70, 0.38) * warm * uBubWarm * exp(-uAbsorb * dE)) * frost
           + uLampCol * min(uLampI * gl * 0.5 * exp(-uAbsorb.y * 2.0 * dE) / (1.0 + dE / uLampFall), 0.8);
  float a = clamp(band * 0.42 + rim * 0.48 + 0.05 + 0.45 * warm + gl * 0.5 + line, 0.0, 1.0) * cov;      // (the band always carries a little more than the water's own glow: a bubble is never a dark bead against it)
  gl_FragColor = vec4(col, a);
  #include <fog_fragment>
}`,Io=`
${m0}
uniform float uTime, uRise; varying vec3 vW; varying vec3 vN;
void main(){
  vec3 lp = position;
  float w1 = sin(uTime * 2.1 + lp.y * 1.6), w2 = sin(uTime * 1.6 + lp.x * 1.7 + 1.7), w3 = cos(uTime * 1.9 + lp.z * 1.8);
  float skirt = smoothstep(0.35, -0.25, lp.y);                                                    // the rim of the bell flares and ripples
  float ang = atan(lp.z, lp.x + step(abs(lp.x) + abs(lp.z), 1e-4) * 1e-3);                        // never atan(0, 0): the sphere's poles sit on the axis
  lp.xz *= (1.08 + 0.10 * w1) * (1.0 + 0.10 * skirt * (1.0 + 0.5 * sin(ang * 5.0 + uTime * 2.4)));
  lp.y = lp.y > 0.0 ? lp.y * (1.0 - 0.08 * w1) : lp.y * (0.55 + 0.06 * w2);                      // a bell: round above, a shallower bowl below
  lp.x += 0.06 * w3; lp.z += 0.06 * w2;
  vec3 n = normalize(vec3(normal.x, normal.y > 0.0 ? normal.y : normal.y * 1.7, normal.z) + vec3(w2, -w1, w3) * 0.14 + vec3(0.0, 1e-4, 0.0));
  vec4 wp = modelMatrix * vec4(lp, 1.0);
  vW = wp.xyz; vN = normalize(mat3(modelMatrix) * n);
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Go=`
${y0}
${o0}
${w0}
uniform float uTime; uniform vec3 uBone, uCrimson; varying vec3 vW; varying vec3 vN;
void main(){
  vec3 V = cameraPosition - vW; float dE = length(V); V /= max(dE, 1e-3);
  vec3 N = normalize(vN + V * 1e-4); if (dot(N, V) < 0.0) N = -N;
  N = normalize(N + (vec3(mcN(vW * 2.3 + uTime * 0.6), mcN(vW * 2.3 + 7.0 - uTime * 0.5), mcN(vW * 2.3 + 13.0)) - 0.5) * 0.35);
  vec3 R = reflect(-V, N);
  // what a mirror drop shows down here: lit rock and worms below (warm, with red specks), black water above and around
  float below = smoothstep(0.1, -0.7, R.y);
  float tex = mcF(R * 3.0 + vW * 0.3);
  vec3 scene = mix(uBone * 0.55, vec3(0.42, 0.30, 0.14), tex) * below + uCrimson * smoothstep(0.66, 0.72, mcN(R * 9.0)) * below * 0.7;
  vec3 E = mcLight(vW, N, dE) + mcLight(vW, R, dE) * 0.8;
  float fres = pow(max(1.0 - max(dot(N, V), 0.0), 0.0), 3.0);
  vec3 col = scene * E * 1.1 + vec3(0.50, 0.66, 0.88) * E * (0.10 + 0.55 * fres);
  col += uLampCol * uLampI * (mcGlint(vW, N, V, 90.0) * 1.8 + mcGlint(vW, N, V, 22.0) * 0.22) * exp(-uAbsorb * 1.2 * dE) / (1.0 + dE / (uLampFall * 3.0));
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,Oo=`
uniform vec3 uLandPos[2]; uniform vec3 uLandDir[2]; uniform float uLen[2];
varying vec3 vW; varying vec3 vN; varying float vBi;
void main(){
  int bi = int(uv.y + 0.5);
  vec3 d = normalize(uLandDir[bi]); vec3 ex = normalize(cross(d, vec3(0.13, 0.97, 0.21)) + vec3(1e-4, 0.0, 0.0)); vec3 ey = cross(d, ex);
  float t = uv.x, L = uLen[bi], k = bi == 0 ? 0.20 : 0.30, cap = abs(normal.y);
  float rad = (0.12 + t * L * k) * 1.012;                                  // the 22-gon stands just outside the true cone
  vec3 radial = ex * position.x + ey * position.z;
  vec3 p = uLandPos[bi] + d * (t * L) + radial * rad;
  vW = p; vN = (radial - d * k) * (1.0 - cap) + d * normal.y; vBi = uv.y;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
}`,Ho=`
${o0}
uniform vec3 uLandPos[2]; uniform vec3 uLandDir[2]; uniform vec3 uLandCol; uniform float uLandI, uTime, uBeam, uShaft, uTaper; uniform vec3 uAbsorb; uniform float uLen[2]; uniform vec2 uBeamK, uBeamIn;
varying vec3 vW; varying vec3 vN; varying float vBi;
void main(){
  bool up = vBi > 0.5;
  vec3 A = up ? uLandPos[1] : uLandPos[0]; vec3 d = normalize(up ? uLandDir[1] : uLandDir[0]);
  float k = up ? 0.30 : 0.20, L = up ? uLen[1] : uLen[0], wIn = up ? uBeamIn.y : uBeamIn.x, dimK = up ? uBeamK.y : uBeamK.x;
  vec3 O = cameraPosition; vec3 D = vW - O; float dF = length(D); D /= max(dF, 1e-3);
  // each sight line is counted once: on the hull's near faces while the eye is outside the cone, on its far faces while inside
  // (uBeamIn eases from one to the other in a shell just outside the hull, where both are in view and show the same sum)
  float w = dot(vN, D) < 0.0 ? 1.0 - wIn : wIn;
  if (w < 0.004) discard;
  // where the sight line enters and leaves the cone (h^2 = cos^2 |x - apex|^2), cut to the beam's length
  float h0 = 0.12 / k, c2 = 1.0 / (1.0 + k * k);
  vec3 co = O - (A - d * h0);
  float dd = dot(D, d), cd = dot(co, d), dc = dot(D, co);
  float qa = dd * dd - c2, qb = dd * cd - dc * c2, qc = cd * cd - dot(co, co) * c2;
  qa = abs(qa) < 1e-5 ? (qa < 0.0 ? -1e-5 : 1e-5) : qa;
  float disc = qb * qb - qa * qc;
  float sq = sqrt(max(disc, 0.0));
  float r1 = (-qb - sq) / qa, r2 = (-qb + sq) / qa, lo = min(r1, r2), hi = max(r1, r2);
  float ta = lo, tb = hi;
  if (qa > 0.0) { if (dd > 0.0) { ta = hi; tb = 1e4; } else { ta = -1e4; tb = lo; } }
  float sd = abs(dd) < 1e-4 ? (dd < 0.0 ? -1e-4 : 1e-4) : dd;
  float s0 = (h0 - cd) / sd, s1 = (h0 + L - cd) / sd;
  ta = max(max(ta, min(s0, s1)), 0.5); tb = min(tb, max(s0, s1));
  float span = tb - ta;
  if (disc <= 0.0 || span <= 0.0) discard;
  float sh = up ? uShaft : 0.0;                                             // the up-beam seen from across the field: a shaft that holds all the way to the great pool
  float jit = 0.5 + 0.45 * (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5);   // a fine, even grain on steps that otherwise fall alike from pixel to pixel (the old hash drew arcs in the beam)
  vec3 drift = vec3(-uTime * 0.5, uTime * 0.14, 0.0);
  float pw = mix(1.55, 1.10, sh), aEnd = mix(0.55, 0.80, sh); vec3 ab = uAbsorb * mix(0.6, 0.35, sh);
  // the lit core is thin, so the steps are laid where the sight line passes closest to the beam's axis and close enough
  // together to resolve the core at any angle (steps spread evenly over the whole chord drew ribs across the beam)
  vec3 ow = O - A; float den = max(1.0 - dd * dd, 1e-4), sinA = sqrt(den);
  float tC = clamp((dd * dot(d, ow) - dot(D, ow)) / den, ta, tb);
  float sC = max(dot(O + D * tC - A, d), 0.0);
  float wC = (0.12 + k * sC) * 0.72 * mix(1.0, 0.66, uTaper) * mix(1.0, mix(0.40, 0.17, uTaper), smoothstep(10.0, mix(48.0, 58.0, uTaper), sC)) * mix(0.45, 1.0, smoothstep(5.0, 24.0, tC));
  float hw = clamp(2.6 * wC / sinA, 1.5, span);
  float t0 = max(ta, tC - hw), t1 = min(tb, tC + hw), dt = (t1 - t0) / 18.0;
  vec3 acc = vec3(0.0);
  for (int i = 0; i < 18; i++) {
    float t = t0 + dt * (float(i) + jit);
    vec3 X = O + D * t; vec3 rel = X - A; float s = dot(rel, d), R = 0.12 + k * max(s, 0.0);
    float q = length(rel - d * s) / R;
    float n = mcN(X * 0.42 + drift), n2 = mcN(X * 0.11 + drift * 0.4 + 7.0);
    // a shaft, not a fan: the lit core stays a few metres wide all the way up. uTaper (1 everywhere but across the north
    // vantage) draws it finer still toward its far end and dims its last third: seen from near its foot (the notch, the knee)
    // it is then a shaft that tapers to the ring, not a band of one thickness
    float wS = mix(1.0, mix(0.40, 0.17, uTaper), smoothstep(10.0, mix(48.0, 58.0, uTaper), s));
    float wE = mix(0.45, 1.0, smoothstep(5.0, 24.0, t));                        // and close to the eye it is a narrow core, not a band
    float qq = q / ((0.30 + 0.20 * n + 0.22 * n2) * mix(1.0, 0.66, uTaper) * wS * wE);                   // no edge at all: the light thins away from the axis, by a width that
    float edge = (exp(-qq * qq * 1.4) + 0.035 * exp(-q * q * 3.2) * (1.0 - smoothstep(6.0, 22.0, s))) * (1.0 - smoothstep(0.82, 1.0, q));   // billows with the lit snow, in a faint wide halo (the hull is where it has gone to nothing)
    float along = smoothstep(0.0, 0.8, s) * (1.0 - smoothstep(aEnd, 1.0, s / L)) * (1.0 - 0.8 * uTaper * smoothstep(0.40, 0.90, s / L)) / (pow(max(R, 1.0) / 3.0, pw) * max(wS, 0.40));
    acc += edge * along * (0.35 + 1.3 * n * mix(1.0, 1.25, sh)) * smoothstep(2.5, 15.0, t) * exp(-ab * t);   // and thins close to the eye: beside or inside it we see the lit snow, not a wall
  }
  vec3 Xm = O + D * (0.5 * (t0 + t1));
  float det = 0.82 + 0.36 * smoothstep(0.35, 0.9, mcN(Xm * 1.4 + drift * 2.0)) + sh * 0.5 * (mcN(Xm * 0.3 + drift * 0.9) - 0.4);   // drifts of lit snow in it
  float fs = max(dot(-D, d), 0.0); fs = fs * fs * fs;                       // looking up the beam: forward scatter
  vec3 col = uLandCol * uLandI * uBeam * 0.0105 * (1.0 + sh) * (1.0 + 1.4 * fs) * dt * acc * det * dimK * w * clamp(sinA * 1.7 + 0.18, 0.0, 1.0);      // (looked along, a beam is a long glow: eased, so from beside its lamp it stays a shaft)
  gl_FragColor = vec4(col, 1.0);
}`,jo=`
uniform vec3 uLandPos[2]; uniform vec3 uLandDir[2]; uniform float uLandI;
varying vec2 vQ; varying float vK;
void main(){
  int bi = int(uv.x + 0.5);
  vec3 c = uLandPos[bi] + normalize(uLandDir[bi]) * 0.16;
  vec3 toC = cameraPosition - c; float d = length(toC); toC /= max(d, 1e-3);
  float facing = smoothstep(-0.1, 0.75, dot(toC, normalize(uLandDir[bi])));
  vec4 mv = viewMatrix * vec4(c, 1.0);
  float size = (1.0 + 0.075 * d) * (0.35 + 0.65 * facing);
  mv.xy += position.xy * size;
  vQ = position.xy; vK = facing * uLandI * 0.32 * smoothstep(1.0, 4.0, d) / (1.0 + d / 70.0);
  gl_Position = projectionMatrix * mv;
}`,Ko=`
uniform vec3 uLandCol; varying vec2 vQ; varying float vK;
void main(){
  float r = length(vQ);
  float g = exp(-r * r * 36.0) * 3.4 + exp(-r * 5.5) * 0.42;
  float sx = exp(-abs(vQ.y) * 46.0) * exp(-abs(vQ.x) * 2.6) * 0.8 + exp(-abs(vQ.x) * 46.0) * exp(-abs(vQ.y) * 4.0) * 0.4;
  float edge = 1.0 - smoothstep(0.7, 1.0, r);
  gl_FragColor = vec4(uLandCol * (g + sx) * vK * edge, 1.0);
}`,$o=`
${m0}
attribute vec4 aF; uniform vec3 uBox, uCen, uVel, uCamV; uniform float uTime, uBufH, uStreak, uSizeK, uReach;
varying vec3 vW; varying vec2 vQ; varying float vA;
void main(){
  float sd = aF.w, sp = 0.6 + 0.8 * fract(sd * 7.3);
  vec3 p = aF.xyz * uBox + uVel * uTime * sp + vec3(sin(uTime * 0.6 + sd * 40.0), sin(uTime * 0.45 + sd * 23.0), cos(uTime * 0.5 + sd * 31.0)) * 0.14;
  p = uCen + mod(p - uCen + 0.5 * uBox, uBox) - 0.5 * uBox;
  vec3 q = abs(p - uCen) / (0.5 * uBox);
  float edge = 1.0 - smoothstep(0.80, 1.0, max(q.x, max(q.y, q.z)));
  float d = distance(cameraPosition, p);
  float fr = fract(sd * 17.7);
  float big = 1.0 + 2.2 * (1.0 - smoothstep(0.7, 2.2, d)) * step(0.72, fract(sd * 3.9));   // a few at arm's length are large and out of focus
  float size = mix(0.009, 0.027, fr * fr) * uSizeK * big;
  float pxScale = uBufH * projectionMatrix[1][1] * 0.5;
  float px0 = size * pxScale / max(d, 0.05);
  float px = min(px0, 0.018 * uBufH); size = px * max(d, 0.05) / pxScale;   // never a white plate on the pane
  float k = max(px, 0.85) / max(px, 1e-3);
  vec4 mv = viewMatrix * vec4(p, 1.0);
  vec3 vr = mat3(viewMatrix) * (uVel - uCamV);
  vec2 vd = vr.xy + mv.xy * vr.z / max(-mv.z, 0.4); float vl = length(vd);   // streaked by how they pass the dome (apparent motion)
  vec2 ax = vl > 1e-4 ? vd / vl : vec2(1.0, 0.0);
  float half0 = size * k, len = half0 + min(uStreak * vl * sp, 0.011 * max(d, 0.3));      // a short smear, not a streak: the snow must never read as static
  mv.xy += ax * position.x * len + vec2(-ax.y, ax.x) * position.y * half0;
  vW = p; vQ = position.xy;
  // only the snow the lamps reach: nothing beyond uReach and no flake too small to have a shape, so open water is
  // black water with soft flakes passing close, never a field of pinpoint stars
  vA = smoothstep(0.0010, 0.0034, px0 / uBufH) * edge * smoothstep(0.4, 2.4, d) * (1.0 - smoothstep(uReach * 0.30, uReach, d)) * min(1.0 / (k * k), 1.0) * sqrt(half0 / max(len, 1e-4)) / (big * big * sqrt(big));
  gl_Position = projectionMatrix * mv;
  vec4 mvPosition = mv;
  #include <fog_vertex>
}`,Qo=`
${y0}
${w0}
uniform vec3 uFlocCol; uniform float uFlocI;
varying vec3 vW; varying vec2 vQ; varying float vA;
void main(){
  float r = length(vQ); float a = (1.0 - smoothstep(0.0, 1.0, r)); a = a * a * vA;        // a soft flake, no hard disc
  vec3 V = cameraPosition - vW; float dE = length(V); V /= max(dE, 1e-3);
  // lamps only (no fill): a flake is bright in a beam and black outside it, so the snow shows the light
  vec3 a0 = normalize(uLampPos[0] - vW), a1 = normalize(uLampPos[1] - vW), b0 = normalize(uLandPos[0] - vW), b1 = normalize(uLandPos[1] - vW);
  // honest lamps (no survey reach), and the cone without its floor: outside the beams a flake is black
  vec3 E = uLampCol * uLampI * (max(mcSpot(vW, a0, uLampPos[0], uLampDir, 0.62, 0.93, uLampFall * 0.55, dE, 0.0) - 0.035, 0.0) + max(mcSpot(vW, a1, uLampPos[1], uLampDir, 0.62, 0.93, uLampFall * 0.55, dE, 0.0) - 0.035, 0.0))
         + uLandCol * uLandI * 0.95 * (max(mcSpot(vW, b0, uLandPos[0], uLandDir[0], 0.80, 0.97, uLandFall, dE, 0.0) - 0.03, 0.0) + max(mcSpot(vW, b1, uLandPos[1], uLandDir[1], 0.62, 0.95, uLandFall, dE, 0.0) - 0.03, 0.0));
  gl_FragColor = vec4(uFlocCol * min(E * 1.2, vec3(0.85)) * uFlocI * a, a * 0.4);        // soft and never white: a flake is dimmer than the rock behind it
  #ifdef USE_FOG
    gl_FragColor.rgb *= exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);   // premultiplied: fade, never add the fog colour
  #endif
}`,Uo=`
${m0}
${o0}
attribute vec4 aPl; uniform float uTime, uLeanT; varying vec3 vW; varying vec3 vN; varying float vB; varying float vT; varying float vSd; varying vec3 vQ;
float plB(vec3 q){ return 0.52 * abs(2.0 * mcN(q) - 1.0) + 0.30 * abs(2.0 * mcN(q * 2.3 + vec3(3.1, 7.7, 1.3)) - 1.0) + 0.18 * abs(2.0 * mcN(q * 5.1 + vec3(9.2, 1.4, 4.4)) - 1.0); }
void main(){
  float t = aPl.x, sd = aPl.y, H = aPl.z, r0 = aPl.w, h = t * H;
  float cl = smoothstep(0.84, 1.0, t);
  float rad = r0 * (0.7 + 5.2 * pow(t + 1e-4, 0.9)) * sqrt(max(1.0 - cl * cl, 0.0));          // it ends in a round head (pinched to a point over its top fifth it was a pennant)
  vec3 n = normal; vec3 tg = vec3(-n.z, 0.0, n.x);
  float ky = 1.6 / (0.5 + rad);                                      // (knobs about as tall as they are wide: at 0.9 they were drawn out up the plume and showed as stripes)
  vec3 q = vec3(n.x * 1.4 + sd * 9.0, h * ky - uTime * 1.1, n.z * 1.4 + sd * 5.0);
  float b = plB(q), ba = plB(q + tg * 0.196), bh = plB(q + vec3(0.0, 0.14, 0.0));
  float amp = 0.80 + 0.60 * b;                                       // (fuller still: at 0.58 + 1.15 b the necks pinched the tube flat, and from below the plumes were ribbons on poles)
  vec3 p = position + vec3(0.0, h, 0.0) + n * rad * amp;
  p.x += (uLeanT * 1.1 + 0.10) * h * h / (h + 2.5) + sin(h * 0.9 - uTime * 0.7 + sd * 20.0) * 0.12 * t * H;
  p.z += cos(h * 0.8 - uTime * 0.6 + sd * 13.0) * 0.10 * t * H;
  vec4 wp = modelMatrix * vec4(p, 1.0);
  // the billows' own slopes (round the plume and up it) tilt the normal: every knob gets a rim and a crease
  vW = wp.xyz; vN = normalize(n - tg * (10.0 * (ba - b) / amp) - vec3(0.0, 1.0, 0.0) * (rad * ky * 10.0 * (bh - b)) + vec3(0.0, 0.2, 0.0)); vB = b; vT = t; vSd = sd; vQ = q;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Xo=`
${y0}
${w0}
${o0}
uniform vec3 uSoot, uEmberC; uniform float uCore, uTime, uCold, uPlumeK; varying vec3 vW; varying vec3 vN; varying float vB; varying float vT; varying float vSd; varying vec3 vQ;
float plB(vec3 q){ return 0.52 * abs(2.0 * mcN(q) - 1.0) + 0.30 * abs(2.0 * mcN(q * 2.3 + vec3(3.1, 7.7, 1.3)) - 1.0) + 0.18 * abs(2.0 * mcN(q * 5.1 + vec3(9.2, 1.4, 4.4)) - 1.0); }
void main(){
  vec3 V = cameraPosition - vW; float dE = length(V); V /= max(dE, 1e-3);
  // the billows again, per pixel (the mesh carries only the big knobs): every cauliflower head gets its own rim and crease
  float e = 0.10, b0 = plB(vQ), fineB = plB(vQ * 3.1 + 11.0);
  vec3 gb = vec3(plB(vQ + vec3(e, 0.0, 0.0)), plB(vQ + vec3(0.0, e, 0.0)), plB(vQ + vec3(0.0, 0.0, e))) - b0;
  vec3 N = normalize(vN + V * 1e-4); vec3 gt = gb - N * dot(gb, N);
  N = normalize(N - gt * (0.42 / e) + vec3(0.0, 1e-5, 0.0));
  if (dot(N, V) < 0.0) N = normalize(N - 2.0 * dot(N, V) * V);
  float crease = smoothstep(0.02, 0.40, min(b0, vB + 0.15)) * (0.55 + 0.45 * fineB);
  float rim1 = max(1.0 - max(dot(N, V), 0.0), 0.0), rim = rim1 * rim1;
  vec3 E = mcLight(vW, N, dE), Eb = mcLight(vW, normalize(N - V * 1.2), dE);
  // black in the creases and at the heart; the shape is carried by the rims (milky smoke keeps a lit core)
  vec3 col = uSoot * (E * uCore * crease * crease + Eb * rim * 3.6 * crease) + mix(vec3(dot(uScatter, vec3(0.3333))), uScatter, 0.35 + 0.4 * uCold) * uCold * uPlumeK * mix(0.06 + 1.1 * rim, 0.18 + 2.8 * rim1 * rim1, smoothstep(8.0, 26.0, dE)) * mix(0.78 - 0.68 * uCold, 1.0, crease) * (1.0 - 0.8 * smoothstep(0.78, 1.0, vT)) * exp(-uAbsorb * dE * 0.6);      // (beyond the lamps the slate of the lit water behind models every billow: black smoke has to read against black water from 50 m)
  col *= 1.0 - 0.5 * smoothstep(0.6, 1.0, vT);                         // (and its cold fill thins away over the top fifth: the head goes dark into the water)
  // its own throat lights the root of the smoke from below: a dull ember that breathes (never a flash)
  float fl = 0.75 + 0.25 * sin(uTime * 2.3 + vSd * 40.0) * sin(uTime * 0.9 + vSd * 17.0);
  col += uEmberC * (exp(-vT * 11.0) * 0.55 + exp(-vT * 3.5) * 0.085) * (0.15 + 0.85 * crease) * fl;
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,Yo=`
attribute vec4 aE; uniform float uTime; varying vec2 vQ; varying float vK;
void main(){
  vec4 mv = viewMatrix * vec4(aE.xyz, 1.0); float d = max(-mv.z, 0.1);
  mv.xy += position.xy * (0.85 + 0.018 * d);
  vQ = position.xy;
  vK = (0.75 + 0.25 * sin(uTime * 2.3 + aE.w * 40.0) * sin(uTime * 0.9 + aE.w * 17.0)) * smoothstep(2.0, 8.0, d) / (1.0 + d / 110.0);
  gl_Position = projectionMatrix * mv;
}`,Zo=`
uniform vec3 uEmberC; varying vec2 vQ; varying float vK;
void main(){
  float r = length(vQ);
  float g = exp(-r * r * 10.0) * 0.50 + exp(-r * 3.4) * 0.14;
  gl_FragColor = vec4(uEmberC * g * vK * (1.0 - smoothstep(0.7, 1.0, r)), 1.0);
}`,Jo=`
varying vec3 vD;
void main(){ vD = position; gl_Position = projectionMatrix * viewMatrix * vec4(cameraPosition + position * 60.0, 1.0); }`,ea=`
${o0}
${Jt}
uniform vec3 uLampDir, uBg, uHazeK; uniform float uTime, uHaze;
varying vec3 vD;
void main(){
  vec3 D = normalize(vD + vec3(0.0, 1e-5, 0.0));
  gl_FragColor = vec4(mcWater(D, uLampDir, uTime, uBg, uHazeK, uHaze), 1.0);
}`;function ao(r,_,k){let f=Math.imul(r,374761393)+Math.imul(_,668265263)+Math.imul(k,1274126177)|0;return f=Math.imul(f^f>>>13,1274126177),f^=f>>>16,(f>>>0)/4294967296}const dt=[0,0];function C0(r,_,k){const f=Math.floor(r),V=Math.floor(_);let I=9,K=9;for(let j=-1;j<=1;j++)for(let Z=-1;Z<=1;Z++){const A=f+Z+.15+.7*ao(f+Z,V+j,k),J=V+j+.15+.7*ao(f+Z,V+j,k+7),H=Math.hypot(A-r,J-_);H<I?(K=I,I=H):H<K&&(K=H)}return dt[0]=I,dt[1]=K,dt}async function Y0(r,_,k){const f=new Float32Array(r.length);for(let V=0;V<_.length;V+=3){const I=_[V]*3,K=_[V+1]*3,j=_[V+2]*3,Z=r[K]-r[I],A=r[K+1]-r[I+1],J=r[K+2]-r[I+2],H=r[j]-r[I],U=r[j+1]-r[I+1],F=r[j+2]-r[I+2],Y=A*F-J*U,G=J*H-Z*F,te=Z*U-A*H;f[I]+=Y,f[I+1]+=G,f[I+2]+=te,f[K]+=Y,f[K+1]+=G,f[K+2]+=te,f[j]+=Y,f[j+1]+=G,f[j+2]+=te,V%15e3===14997&&await k()}for(let V=0;V<f.length;V+=3){const I=Math.hypot(f[V],f[V+1],f[V+2])||1;f[V]/=I,f[V+1]/=I,f[V+2]/=I,V%3e4===29997&&await k()}return f}function Ye(r,_,k,f,V,I,K,j,Z,A){const J=A.cols,H=A.rows,U=r.pos.length/3,F=A.sd,Y=3+Math.floor(F*2.99);let G=K*.3;for(let S=0;S<=H;S++){const C=S/H,T=C*I,R=A.mound?$(1.1,.8,z(.1,1,C)):A.flat?$(.32,1,z(0,.6,C))*$(1,.74,z(.6,1,C)):1-.76*Math.pow(C,.72),me=K*R*(1+(A.flat?0:A.bulge??.2)*Math.sin(C*I*1.9+F*40)*(1-.5*C))+(A.flat?0:K*(A.mound?.45:1.2)*Math.pow(1-C,6))+(S===H?K*.05:0);S===H&&(G=me);for(let ne=0;ne<J;ne++){const Pe=ne/J*ge,M0=Math.cos(Pe),a0=Math.sin(Pe),n0=_.n3(M0*1.2+F*30+k*.07,T*.55,a0*1.2+V*.07),He=_.n3(M0*3.1+F*11,T*1.6,a0*3.1),$e=me*(1+.14*Math.cos(Y*Pe+F*9+C*2.5))*(1+.26*n0+(A.flat?.04:.1)*He);r.pos.push(k+j*T+M0*$e,f+T,V+Z*T+a0*$e),r.mat.push(A.smoker?.62*z(.62,1,C):.5*F*z(.7,1,C),(A.fresh??.5)*z(.3,1,C),$(.25,1,z(0,.2,C))*(.8+.2*n0))}}for(let S=0;S<J;S++){const C=S/J*ge;r.pos.push(k+j*I+Math.cos(C)*G*.5,f+I-G*(A.mound?.05:.5),V+Z*I+Math.sin(C)*G*.5),r.mat.push(A.smoker?.985:.3,.9,A.mound?.7:.12)}r.pos.push(k+j*I,f+I-G*(A.mound?.08:.9),V+Z*I),r.mat.push(A.smoker?1:.3,.9,A.mound?.6:.08);for(let S=0;S<=H;S++)for(let C=0;C<J;C++){const T=U+S*J+C,R=U+S*J+(C+1)%J,me=T+J,ne=R+J;r.idx.push(T,me,R,R,me,ne)}const te=U+(H+2)*J,re=U+(H+1)*J;for(let S=0;S<J;S++)r.idx.push(re+S,te,re+(S+1)%J);return r.feet&&!A.flat&&r.feet.push([U,J,k,f,V]),{x:k+j*I,y:f+I,z:V+Z*I,r:G}}function b0(r,_,k=0){const f=[],V=[],I=[],K=[];r.forEach(([j,Z,A,J,H,U])=>{for(let F=0;F<_;F++){const Y=(F+.5)/_*ge;f.push(Math.cos(Y)*Z,J+Math.sin(Y)*A,j),V.push(U||0,k),I.push(H[0],H[1],H[2],H[3])}});for(let j=0;j<r.length-1;j++)for(let Z=0;Z<_;Z++){const A=j*_+Z,J=j*_+(Z+1)%_,H=A+_,U=J+_;K.push(A,J,H,J,U,H)}return{pos:f,uv:V,col:I,idx:K}}function x0(r){const _=[],k=[],f=[],V=[];for(const K of r){const j=_.length/3;_.push(...K.pos),k.push(...K.uv),f.push(...K.col);for(const Z of K.idx)V.push(Z+j)}const I=new u.BufferGeometry;return I.setAttribute("position",Ve(_,3)),I.setAttribute("uv",Ve(k,2)),I.setAttribute("aCol",Ve(f,4)),I.setIndex(V),I.computeVertexNormals(),I}function ut(r,_){for(let k=0;k<r.pos.length;k+=3){const f=_(r.pos[k],r.pos[k+1],r.pos[k+2]);r.pos[k]=f[0],r.pos[k+1]=f[1],r.pos[k+2]=f[2]}return r}function G0(r,_,k,f,V,I=0){const K=[],j=[],Z=[],A=[],J=r.length;for(let H=0;H<J;H++){const U=H/(J-1),F=$(_,k,U),Y=r[H],G=r[Math.min(H+1,J-1)],te=r[Math.max(H-1,0)];let re=G[0]-te[0],S=G[2]-te[2];const C=Math.hypot(re,S)||1;re/=C,S/=C,K.push(Y[0]-S*F,Y[1],Y[2]+re*F,Y[0]+S*F,Y[1],Y[2]-re*F,Y[0],Y[1]+F*1.2,Y[2]);for(let T=0;T<3;T++)j.push(V*U,I),Z.push(f[0],f[1],f[2],f[3])}for(let H=0;H<J-1;H++){const U=H*3;A.push(U,U+3,U+2,U+2,U+3,U+5,U+2,U+5,U+1,U+1,U+5,U+4)}return{pos:K,uv:j,col:Z,idx:A}}function ta(){const r=[.93,.9,.86,.35];return x0([b0([[.5,.02,.02,.1,r,0],[.28,.11,.1,.15,[.95,.74,.7,.35],0],[-.05,.11,.1,.17,r,0],[-.4,.05,.035,.09,r,.25],[-.5,.12,.008,.05,r,.5]],3)])}function oa(){const r=[.92,.88,.74,.25],_=[.8,.7,.45,.1],k=[b0([[.42,.05,.03,.1,r,0],[.25,.22,.1,.13,r,0],[-.1,.26,.12,.14,r,0],[-.4,.16,.08,.11,r,0],[-.5,.03,.02,.09,r,0]],6)];for(const f of[-1,1]){k.push(G0([[f*.16,.14,.3],[f*.34,.2,.62],[f*.36,.22,1],[f*.22,.2,1.3]],.07,.05,_,.9,f>0?0:1));for(let V=0;V<3;V++)k.push(G0([[f*.22,.1,.1-V*.2],[f*.5,.12,.05-V*.24],[f*.66,0,0-V*.27]],.025,.012,r,.25,V*.6))}return x0(k)}function aa(){const r=[.2,.17,.13,.9],_=[.62,.54,.4,.3];return x0([ut(b0([[.5,.36,.3,0,_,0],[.42,.42,.36,0,_,0],[.34,.36,.33,0,r,0],[.12,.25,.25,.02,r,0],[0,.03,.03,.04,r,0]],5),(k,f,V)=>[k,(.5-V)*1.1,f+.05])])}function na(){const r=[.9,.87,.8,.3],_=[b0([[.36,.1,.03,.16,r,0],[.2,.36,.1,.18,r,0],[-.05,.42,.12,.19,r,0],[-.3,.3,.09,.17,r,0],[-.4,.06,.03,.15,r,0]],6)];for(const k of[-1,1]){for(let f=0;f<3;f++){const V=.2-f*.2;_.push(G0([[k*.34,.16,V],[k*.68,.3,V+.03-f*.04],[k*.98,0,V+.05-f*.09]],.035,.012,r,.22,f+(k>0?0:.5)))}_.push(G0([[k*.2,.15,.3],[k*.42,.18,.55],[k*.26,.14,.78]],.05,.085,r,.12,k>0?.3:1.2))}return x0(_)}function sa(r){const _=r?[.36,.23,.09,.6]:[.92,.9,.84,.25],k=r?[.2,.12,.05,.6]:[.7,.66,.58,.2],f=r?.55:1,V=[];for(const I of[0,1]){const K=[],j=[],Z=[],A=[];K.push(0,I?.36:.02,.05),j.push(I?.35:0,0),Z.push(..._);for(let H=0;H<=7;H++){const U=-.15*Math.PI+H/7*1.3*Math.PI,F=.5*(1+.06*(H%2));K.push(Math.cos(U)*F*f,I?.17:.12,Math.sin(U)*F*.9+.1),j.push(I?.5*z(-.3,.6,Math.sin(U)):0,0),Z.push(...H%2?_:k)}for(let H=0;H<7;H++)I?A.push(0,H+2,H+1):A.push(0,H+1,H+2);V.push({pos:K,uv:j,col:Z,idx:A})}return x0(V)}function ra(){const r=[.55,.55,.58,.35],_=[.58,.49,.48,.35],k=[.4,.43,.48,.2],f=[.46,.47,.5,.08],V=[b0([[.5,.03,.025,0,_,0],[.44,.085,.07,0,_,0],[.31,.1,.1,0,r,0],[.12,.072,.105,0,r,0],[-.1,.048,.1,0,r,0],[-.3,.026,.085,0,k,0],[-.45,.008,.06,0,k,0],[-.52,.003,.085,0,k,0]],10)];for(const I of[-1,1])V.push(ut(b0([[0,.008,.02,0,f,0],[.045,.006,.048,0,f,0],[.1,.005,.062,0,f,0],[.14,.003,.05,0,f,0],[.16,.002,.022,0,f,0]],6),(K,j,Z)=>[I*(.086+Z*.62+K),j-.028-Z*.12,.275-Z*.78]));return x0(V)}function ia(r){const _=[.5,.17,.17,.3],k=[.4,.12,.13,.3],f=[.34,.085,.1,.04],V=[.5,.18,.16,.12],I=[.1,.02,.03,.04],K=[.46,.16,.16,.3],j=(S,C,T)=>[$(S[0],C[0],T),$(S[1],C[1],T),$(S[2],C[2],T),$(S[3],C[3],T)],Z=[[0,.44],[.07,.435],[.14,.41],[.2,.37],[.245,.31],[.27,.23],[.275,.15],[.262,.07],[.25,0],[.268,-.06],[.31,-.12],[.37,-.18],[.43,-.235],[.48,-.275],[.505,-.3]],A=[],J=[],H=[],U=[],F=64,Y=Z.length;Z.forEach(([S,C])=>{for(let T=0;T<F;T++){const R=T/F*ge,me=z(0,-.3,C),ne=Math.pow(.5+.5*Math.cos(8*R),3),Pe=S*(1+me*(.05*ne+.085*Math.cos(8*R)))*(1+.03*Math.sin(3*R+1)*(1-me));A.push(Math.cos(R)*Pe,C-me*me*.08*Math.cos(8*R)+me*.012*ne,Math.sin(R)*Pe*.94),J.push(0,me),H.push(...me>0?j(j(k,f,z(0,.45,me)),V,ne*z(.1,.5,me)):j(_,k,z(.3,0,C)))}});for(let S=0;S<Y-1;S++)for(let C=0;C<F;C++){const T=S*F+C,R=S*F+(C+1)%F,me=T+F,ne=R+F;U.push(T,R,me,R,ne,me)}const G=(Y-1)*F,te=A.length/3;for(const[S,C]of[[.55,-.2],[.12,-.08]])for(let T=0;T<F;T++)A.push(A[(G+T)*3]*S,C,A[(G+T)*3+2]*S),J.push(0,S),H.push(...S>.3?[.3,.085,.095,.04]:I);for(let S=0;S<F;S++){const C=G+S,T=G+(S+1)%F,R=te+S,me=te+(S+1)%F,ne=R+F,Pe=me+F;U.push(C,R,T,T,R,me,R,ne,me,me,ne,Pe)}const re=[{pos:A,uv:J,col:H,idx:U}];for(let S=0;S<8;S++){const C=S/8*ge,T=Math.cos(C),R=Math.sin(C)*.94;re.push(G0([[T*.5,-.285,R*.5],[T*.56,-.325,R*.56],[T*.6,-.375,R*.6],[T*.615,-.43,R*.615]],.026,.006,V,.35,1))}for(const S of[-1,1])re.push(ut(b0([[0,.034,.05,0,_,0],[.05,.03,.078,0,K,.2],[.12,.034,.128,0,K,.45],[.2,.036,.158,0,K,.75],[.27,.03,.16,0,K,1],[.32,.022,.13,0,K,1.15],[.35,.013,.085,0,K,1.25],[.365,.005,.035,0,K,1.3]],12),(C,T,R)=>[S*(.235+R*.94),.275+C*S*.94+R*.34-T*.36,T*.93-.03]));return x0(re)}async function la(r,_,k){const f=[.34,.36,.38,.7],V=[.07,.075,.08,.4],I=[.3,.42,.36,1],K=[.62,.42,.06,.3],j=[1,1,1,2],Z=[],A=(G,te,re)=>{re&&G.applyMatrix4(re);const S=G.attributes.position.count,C=new Float32Array(S*4);for(let T=0;T<S;T++)C.set(te,T*4);G.setAttribute("aCol",new u.BufferAttribute(C,4)),G.setAttribute("uv",new u.BufferAttribute(new Float32Array(S*2),2)),Z.push(G)},J=y(0,1,0),H=new u.Quaternion,U=(G,te,re,S,C=7)=>{const T=te.clone().sub(G),R=T.length(),me=new u.CylinderGeometry(re,re,R,C,1);me.applyQuaternion(H.setFromUnitVectors(J,T.normalize())),me.translate((G.x+te.x)/2,(G.y+te.y)/2,(G.z+te.z)/2),A(me,S)},F=(G,te,re)=>new u.Matrix4().makeTranslation(G,te,re);for(let G=0;G<3;G++){const te=G/3*ge+.5,re=Math.cos(te),S=Math.sin(te),C=y(re*1.55,G===1?-.08:.06,S*1.55),T=y(re*1.05,.85,S*1.05),R=y(re*.55,1.75,S*.55);U(C,T,.05,f),U(T,R,.05,f),U(T,y(Math.cos(te+2.094)*1.05,.85,Math.sin(te+2.094)*1.05),.035,f,6),U(R,y(Math.cos(te+2.094)*.55,1.75,Math.sin(te+2.094)*.55),.035,f,6),U(C,y(Math.cos(te+1.05)*.5,.5,Math.sin(te+1.05)*.5),.022,f,5),A(new u.CylinderGeometry(.3,.34,.06,12),f,F(C.x,C.y-.03,C.z)),A(new u.SphereGeometry(.09,8,6),f,F(T.x,T.y,T.z)),await k()}A(new u.TorusGeometry(1.05,.03,5,28).rotateX(Math.PI/2),f,F(0,.85,0)),A(new u.CylinderGeometry(.17,.17,1.25,12).rotateZ(Math.PI/2),V,F(.05,1.12,.3));for(const G of[-1,1])A(new u.SphereGeometry(.17,10,6,0,ge,0,Math.PI/2).rotateZ(-G*Math.PI/2),V,F(.05+G*.625,1.12,.3)),A(new u.TorusGeometry(.18,.02,4,14).rotateY(Math.PI/2),f,F(.05+G*.35,1.12,.3));A(new u.CylinderGeometry(.46,.46,.1,16),f,F(-.1,.52,-.25));for(let G=0;G<10;G++){const te=G/10*ge;A(new u.CylinderGeometry(.05,.05,.34,6),G%3?I:V,F(-.1+Math.cos(te)*.36,.74,-.25+Math.sin(te)*.36))}for(let G=0;G<4;G++){const te=G/4*ge+.4,re=Math.cos(te)*.5,S=Math.sin(te)*.5;A(new u.SphereGeometry(.235,14,10),I,F(re,2.12,S)),A(new u.TorusGeometry(.24,.022,5,16).rotateX(Math.PI/2),K,F(re,2.12,S)),A(new u.SphereGeometry(.25,10,5,0,ge,0,.9),K,F(re,2.115,S)),U(y(re,1.75,S),y(re,1.9,S),.04,f,6);for(let C=0;C<3;C++){const T=te+1.2+C*2.1,R=.5+C*.25;A(new u.ConeGeometry(.035,.03,6),[.75,.7,.6,.2],F(re+Math.cos(T)*Math.cos(R)*.235,2.12-Math.sin(R)*.235+.01,S+Math.sin(T)*Math.cos(R)*.235))}await k()}A(new u.TorusGeometry(.55,.035,5,20).rotateX(Math.PI/2),f,F(0,1.75,0)),U(y(0,1.75,0),y(0,4.4,0),.04,f,7),U(y(.5,1.75,.1),y(0,3.3,0),.02,f,5),U(y(-.4,1.75,-.35),y(0,3.3,0),.02,f,5),U(y(-.2,1.75,.5),y(0,2,0),.03,f,5),U(y(0,4.4,-.6),y(0,4.4,.6),.035,f,7),[r,_].forEach((G,te)=>{const re=y(0,4.4,te?.42:-.42),S=new u.Matrix4().makeRotationFromQuaternion(H.setFromUnitVectors(J,G.clone().normalize())).setPosition(re.clone().addScaledVector(G,.02));A(new u.CylinderGeometry(.1,.075,.26,12),V,S.clone()),A(new u.TorusGeometry(.1,.018,5,14).rotateX(Math.PI/2),f,S.clone().multiply(F(0,.13,0))),A(new u.CircleGeometry(.092,14).rotateX(-Math.PI/2),j,S.clone().multiply(F(0,.132,0)));for(let C=0;C<6;C++){const T=C/6*ge;A(new u.BoxGeometry(.012,.2,.03),f,S.clone().multiply(new u.Matrix4().makeRotationY(T)).multiply(F(.11,-.01,0)))}}),await k();const Y=Bo(Z,!1);for(const G of Z)G.dispose();return Y}const ft=[{name:"snowblower",lamp:"#EAF2FF",water:"snow",mineral:"sulphide",cast:"snails"},{name:"current",lamp:"#EAF2FF",water:"current",mineral:"white",cast:"shrimp"},{name:"sodium",lamp:"#FFD9A0",water:"clear",mineral:"ochre",cast:"yeti"},{name:"clear",lamp:"#EAF2FF",water:"clear",mineral:"ochre",cast:"shrimp"},{name:"sodium-white",lamp:"#FFD9A0",water:"clear",mineral:"white",cast:"snails"}],no=54,Ge=[[32,21.5,7.4],[55,21.6,7],[78,22.4,7.2],[100,23.6,8.4],[124,25.2,12],[148,26,15.4],[170,25.2,16.2],[190,24.6,15.4],[208,24.2,14.2],[226,25,13.6],[246,28.5,13.4]],ca=[[7,13,-38],[-3,10.8,-46.5],[-17,9,-47.5],[-26.5,7.6,-37],[-25,6.6,-21]],vt=[129,17.4],O0=8.6,Z0=r=>{for(let _=1;_<Ge.length;_++)if(r<=Ge[_][0])return $(Ge[_-1][2],Ge[_][2],ue((r-Ge[_-1][0])/(Ge[_][0]-Ge[_-1][0]),0,1));return Ge[Ge.length-1][2]},so=[46,62,80,97,114,132,150,167,184,201,218,234];var ua={id:"mirror-chimneys",name:"The Upside-Down Pools",category:"ocean",weirdness:.45,media:["underwater"],async build(r){const _=r.rng,k=r.noise,f=r.vary||{},V=r.quality?.detail??1,I=ue(f.density??1,.7,1.3),K=t=>new u.Color(t),j={...ft[Math.min(ft.length-1,Math.floor(_()*ft.length))]};f.hour==="golden"||f.hour==="dawn"?j.lamp="#FFD9A0":f.hour==="night"&&(j.lamp="#EAF2FF");const Z=j.lamp==="#FFD9A0",A=j.water==="snow",J=j.water==="current",H=!!f.rare,U=ue(f.mood??.5,0,1),F=No("mirror-chimneys-rank:"+(r.seed??1)),Y=new u.Scene;Y.background=K(Oe[0]),Y.fog=new u.FogExp2(Oe[0],A?.0085:.0055);const G={value:0},te={value:0},re={value:0},S={value:.55},C=so.map(t=>({b:t,y:Z0(t)-.4,off:1,r:1.35})),T=h0(vt[0],vt[1],O0);C.push({p:[T.x,O0-.1,T.z],o:[0,0],r:1.75});const R=await qo(r,{palette:Oe,mineral:j.mineral,lean:J?.61:void 0,lampColor:j.lamp,survey:0,wormCount:Math.round(1e3*$(1,I,.5)),passThickets:C,wormReach:9.5}),me=R.passThickets.slice(0,so.length);Y.add(R.object);const ne=R.lamps,Pe=R.anchors,M0=(j.mineral==="white"?.9:j.mineral==="sulphide"||Z?3.3:2.3)*$(.9,1.15,U);R.setFieldRim(M0),await r.yield();const a0=Pe.flyThrough,n0=Pe.portalSeat.position.clone(),He=a0[9].clone(),$e=n0.clone().sub(He).normalize(),ro=[y(-86,15,4),y(-74,14.7,4.7),y(-65,12.3,5.3),y(-55.5,12,3.9),a0[1],a0[2],...Ge.map(([t,o,i])=>h0(t,o,i)),...ca.map(t=>y(t[0],t[1],t[2])),He,He.clone().addScaledVector($e,9),He.clone().addScaledVector($e,20),He.clone().addScaledVector($e,32),n0],ve=Co(ro,{samples:400}),be=ve.length,Ze=400,ke=new Float32Array((Ze+1)*3),d0=y(),pt=y();for(let t=0;t<=Ze;t++)ve.pointAt(t/Ze,d0),ke[t*3]=d0.x,ke[t*3+1]=d0.y,ke[t*3+2]=d0.z;const s0=t=>{let o=1e9,i=0;for(let s=0;s<=Ze;s++){const d=(ke[s*3]-t.x)**2+(ke[s*3+1]-t.y)**2+(ke[s*3+2]-t.z)**2;d<o&&(o=d,i=s)}return i/Ze*be},z0=R.flanges,gt=s0(a0[1]),wt=s0(h0(Ge[0][0],Ge[0][1],Ge[0][2])),io=s0(h0(z0[0].bearing,18.4,Z0(z0[0].bearing))),yt=s0(h0(z0[1].bearing,18.6,Z0(z0[1].bearing))),u0=s0(h0(z0[2].bearing,19.6,Z0(z0[2].bearing))),N0=s0(He),J0=(t,o,i)=>Math.exp(-(((t-o)/i)**2)),bt=s0(h0(vt[0]-24,23.6,8.6)),xt=s0(h0(160,25.6,15.8)),Mt=t=>{let o=$(6,4.3,z(gt-3,wt,t));return o*=1-.24*J0(t,bt,10)-.26*J0(t,xt,10)-.26*J0(t,u0+2,9.5),o=$(o,5.4,z(u0+12,u0+30,t)),$(o,4.4,z(N0-8,N0+8,t))},zt=t=>Mt(ue(t,0,1)*be)/4.4,L0=256,f0=new Float32Array(L0+1);for(let t=1;t<=L0;t++)f0[t]=f0[t-1]+1/zt((t-.5)/L0);const lo=t=>{const o=t/no*f0[L0];let i=1;for(;i<L0&&f0[i]<o;)i++;return(i-1+(o-f0[i-1])/Math.max(f0[i]-f0[i-1],1e-6))/L0},q0=io/be,co=yt/be,oe=u0/be,Ae=N0/be,Qe=gt/be,Lt=wt/be,et=q0-.022,ho=bt/be,tt=xt/be,mo=[[0,10,14],[5,11,14],[11,24,11],[19,39,6],[28,44,4],[42,47,3],[62,59,-2],[84,70,-5],[104,76,-7],[128,48,4],[150,32,13],[170,28,12],[190,29,3],[210,36,-6],[230,36,-5],[262,29,-3]],r0=y(),uo=y(),ot=(t,o,i)=>{const s=t.length;if(o<=t[0][0])return t[0][i];if(o>=t[s-1][0])return t[s-1][i];let d=0;for(;d<s-2&&o>t[d+1][0];)d++;const v=t[Math.max(d-1,0)],m=t[d],p=t[d+1],a=t[Math.min(d+2,s-1)],e=p[0]-m[0],c=(o-m[0])/e,n=(p[i]-v[i])/Math.max(p[0]-v[0],.001)*e,l=(a[i]-m[i])/Math.max(a[0]-m[0],.001)*e,h=c*c,g=h*c;return(2*g-3*h+1)*m[i]+(g-2*h+c)*n+(-2*g+3*h)*p[i]+(g-h)*l},St=(t,o)=>ot(mo,t,o),kt=[[0,1,-4],[.035,1,-5],[.06,9,0],[.08,17,6],[.098,13,0],[.12,9,-10],[.135,8,-7],[.17,9,8]],W0=y(),fo=(t,o)=>{ve.posAtDist(o*be,W0);const i=ot(kt,o,1)*Te,s=ot(kt,o,2)*Te;return W0.set(W0.x+Math.cos(i)*Math.cos(s)*30,W0.y+Math.sin(s)*30,W0.z+Math.sin(i)*Math.cos(s)*30)},V0=(t,o)=>{ve.posAtDist(o*be,r0);let i=Math.atan2(r0.z,-r0.x)/Te;i<-60&&(i+=360);const s=Math.atan2(-r0.z,-r0.x)+St(i,1)*Te,d=St(i,2)*Te;return uo.set(r0.x+Math.cos(s)*Math.cos(d)*30,r0.y+Math.sin(d)*30,r0.z+Math.sin(s)*Math.cos(d)*30)},Ne=y(-46,7.05,6),At=y(Ne.x,Ne.y+4.4,Ne.z+.42),i0=y(),T0=y(),S0=y(),at=(t,o)=>{ve.posAtDist(o*be,i0),ve.posAtDist(Math.min(o*be+9,be),T0).sub(i0),T0.lengthSq()<1e-4&&ve.tangentAtDist(o*be,T0),T0.normalize();const i=Math.atan2(n0.z-i0.z,n0.x-i0.x);let s=Math.atan2(At.z-i0.z,At.x-i0.x)-i;s=Math.atan2(Math.sin(s),Math.cos(s));const d=z(Ae-.075,Ae-.015,o),v=z(Ae+.02,Ae+.11,o),m=z(oe+.062,oe+.118,o);let p=i+Math.min(.26*Math.max(s,0),17*Te)*(1-d)-5*Te*d,a=$($(-9,15,z(oe+.115,oe+.195,o)),38,d)*Te;if(m<1){S0.copy(V0(t,o)).sub(i0).normalize();const e=Math.atan2(S0.z,S0.x),c=Math.asin(ue(S0.y,-1,1)),n=Math.atan2(Math.sin(p-e),Math.cos(p-e));p=e+n*m,a=$(c,a,m)}return S0.set(Math.cos(p)*Math.cos(a),Math.sin(a),Math.sin(p)*Math.cos(a)),S0.lerp(T0,v).normalize().multiplyScalar(30).add(i0)},nt=y(-88,4.5,3.5).sub(y(-46,11.5,5.6)).normalize(),H0=Pe.greatPool.clone().add(y(1.5,-3.5,-1)).sub(y(-46,11.5,6.4)).normalize(),Ft=A?6.5:5.5;R.setLander(null,nt,H0,Ft),ne.uLandPos.value[0].set(Ne.x,Ne.y+4.4,Ne.z-.42).addScaledVector(nt,.16),ne.uLandPos.value[1].set(Ne.x,Ne.y+4.4,Ne.z+.42).addScaledVector(H0,.16),ne.uLandFall.value=18,ne.uScatter.value.multiplyScalar(5),ne.uLampI.value=Z?2:1.8,ne.uLampFall.value=8;const vo=ne.uAbsorb.value.clone();R.setRing(n0,Pe.portalSeat.normal,Pe.portalSeat.radius,Oe[6],1.6);const po=()=>u.UniformsUtils.clone(u.UniformsLib.fog),go={uOchre:{value:K(Oe[1])},uRust:{value:K(Oe[2])},uBone:{value:K(Oe[3]).multiplyScalar(.9)},uMat:{value:K(Oe[4])},uCrimson:{value:K(Oe[5]).multiplyScalar(1.25)}},Ue=(t,o,i={},s={})=>new u.ShaderMaterial({vertexShader:t,fragmentShader:o,fog:!0,uniforms:{...po(),...ne,...go,uTime:G,...i},...s}),st={value:Z?y(.88,1.03,1.33):y(1,1,1)},k0=Math.floor(_()*1e3),j0=2.4,Et=(t,o,i,s,d,v)=>{const m=[];for(let e=o;e<=i+1e-6;e+=d)m.push(e);let p=d,a=o;for(;a>t;)p*=v,a-=p,m.unshift(a);for(p=d,a=m[m.length-1];a<s;)p*=v,a+=p,m.push(a);return m},ze=Et(-118,-74,30,112,.78,1.09),Fe=Et(-100,-32,26,100,.78,1.1),Bt={value:new u.Vector4(ze[0],ze[ze.length-1],Fe[0],Fe[Fe.length-1])},Ct=(t,o,i)=>{const s=Math.hypot(t,o);let d=C0(t/2.7+31.3,o/2.7+17.1,k0);const v=Math.sqrt(Math.max(0,1-d[0]*d[0]*1.7)),m=d[1]-d[0];d=C0(t/8.5+3.3,o/8.5+9.1,k0+3);const p=Math.sqrt(Math.max(0,1-d[0]*d[0]*1.4));let a=Math.max(0,1.9*p+1*v+1.1*k.fbm2(t*.03,o*.03,3));a*=.08+.92*z(8.5,22,s),a+=11*Math.pow(z(58,115,s),1.6);const e=-44+3*Math.sin(o*.09+1.3)*z(8,22,Math.abs(o-j0))+1.5*Math.sin(o*.23),c=t-e;a=$(a,5.6+.45*a,z(6,-6,c));const n=Math.max(z(18,0,Math.min(t-ze[0],ze[ze.length-1]-t,o-Fe[0],Fe[Fe.length-1]-o)),z(102,118,s))*(t<0?z(8,18,Math.abs(o-4)):1);if(n>0){const q=Math.min(t>0?ze[ze.length-1]/t:t<0?ze[0]/t:1e9,o>0?Fe[Fe.length-1]/o:o<0?Fe[0]/o:1e9),W=t*q,x=o*q;d=C0(W/26+5.7,x/26+2.3,k0+11);const B=5*Math.pow(Math.max(0,1-d[0]*d[0]*2.2),.75);d=C0(W/10+3.1,x/10+8.7,k0+17),a+=n*(1+B+3*Math.pow(Math.max(0,1-d[0]*d[0]*2.2),.75))}const l=20+2.5*Math.sin(o*.11)+1.8*k.n2(o*.07,3.3),h=Math.exp(-((c/(c>0?7.5:9.5))**2));a+=(l+.7*v-a)*h;const g=Math.abs(o-j0),w=7+Math.max(0,g-4.6)*(o<j0?$(2.7,1.1,z(0,4,c)):2.7)+.35*v+30*z(10,22,Math.abs(c)),L=a>w?1:0;a=Math.min(a,w);const M=3+1.6*Math.sin(t*.19+.5)+.7*Math.sin(t*.47)+.6*k.n2(t*.9,7.7),P=z(-114,-102,t)*(1-z(-53,-46,t)),X=1.3+1*(.5+.5*Math.sin(t*.13+2)),N=Math.abs(o-M);return a-=3.6*P*(1-z(X*.35,X,N)),i&&(i.p1=v,i.p2=p,i.s1=m,i.lip=P*(1-z(X*.6,X+2.4,N)),i.notch=L*(1-z(5,7,g)),i.end=n),a},Nt=(t,o)=>{let i=1e9;if(t<-97||t>36||o<-48||o>26)return i;for(let s=0;s<=Ze;s+=2){const d=ke[s*3]-t,v=ke[s*3+2]-o,m=d*d+v*v;if(m<64){const p=ke[s*3+1]-6.4+Math.max(0,Math.sqrt(m)-4.5)*1.6;p<i&&(i=p)}}return Math.max(i,-.3)},_e=(t,o,i)=>Math.min(Ct(t,o,i),Nt(t,o));{const t=ze.length,o=Fe.length,i=new Float32Array(t*o*3),s=new Float32Array(t*o*3),d={};for(let n=0;n<o;n++){for(let l=0;l<t;l++){const h=ze[l],g=Fe[n],w=(n*t+l)*3,L=_e(h,g,d),M=Math.hypot(h,g);i[w]=h,i[w+1]=L,i[w+2]=g,s[w]=ue(.3*(1-d.p2)+1*d.lip+.25*d.notch+.25*(1-z(9,16,M)),0,1)-1.2*d.end,s[w+1]=ue((1-d.p2)*.9*(.5+.5*k.n2(h*.06+40,g*.06))*(1-d.lip),0,1),s[w+2]=ue(.35+.65*z(.02,.22,d.s1)*(.6+.4*d.p1),0,1)*(.45+.55*z(7,13,M)),l%60===59&&await r.yield()}await r.yield()}const v=new Uint32Array((t-1)*(o-1)*6);let m=0;for(let n=0;n<o-1;n++){for(let l=0;l<t-1;l++){const h=n*t+l,g=h+1,w=h+t,L=w+1;l+n&1?(v[m++]=h,v[m++]=w,v[m++]=g,v[m++]=g,v[m++]=w,v[m++]=L):(v[m++]=h,v[m++]=w,v[m++]=L,v[m++]=h,v[m++]=L,v[m++]=g)}n%30===29&&await r.yield()}await r.yield();const p=new u.BufferGeometry;p.setAttribute("position",new u.BufferAttribute(i,3)),p.setAttribute("aBed",new u.BufferAttribute(s,3)),p.setIndex(new u.BufferAttribute(v,1));const a=await Y0(i,v,r.yield);p.setAttribute("normal",new u.BufferAttribute(a,3)),p.boundingSphere=new u.Sphere(y(0,5,0),165);const e=new Float32Array(t*o);for(let n=0;n<e.length;n++)e[n]=z(.26,.5,1-a[n*3+1]);await r.yield();for(let n=0,l=0;n<e.length;n++){if(!(e[n]>0))continue;const h=i[n*3],g=i[n*3+2];_e(h,g,d),s[n*3]=ue(.3*$(1-d.p2,.16,e[n])+1*d.lip+.25*d.notch+.25*(1-z(9,16,Math.hypot(h,g))),0,1)-1.2*d.end,++l%150===0&&await r.yield()}p.setAttribute("aSteep",new u.BufferAttribute(e,1)),await r.yield();const c=new u.Mesh(p,Ue(eo,to,{uFlow:{value:J?2.6:1},uVant:te,uFill:re,uHaze:S,uHazeK:st,uEnd:Bt}));c.name="bed",Y.add(c)}{const t=ze[0],o=ze[ze.length-1],i=Fe[0],s=Fe[Fe.length-1],d=3.2,v=[],m=[],p=q=>Math.pow(Math.max(0,1-q[0]*q[0]*2.2),.75);for(let q=t-62;q<o+62+d;q+=d)v.push(q);for(let q=i-62;q<s+62+d;q+=d)m.push(q);const a=v.length,e=m.length,c=new Float32Array(a*e*3),n=new Float32Array(a*e*3),l=new Uint8Array(a*e),h={};let g=0;for(let q=0;q<e;q++)for(let W=0;W<a;W++){const x=v[W],B=m[q],E=(q*a+W)*3,D=Math.hypot(x,B),Q=Math.min(x-t,o-x,B-i,s-B);if(c[E]=x,c[E+2]=B,Q>18&&D<102||x<0&&Math.abs(B-4)<28)continue;const O=Math.max(-Q,D-118),ie=x<0?z(24,46,Math.abs(B-4)):1,le=Math.min(O,50);let ce=0;O>0&&ie>0&&(ce=ie*z(0,12,O)*(1-z(50,62,O))*((5+.25*le)*p(C0(x/20+1.9,B/20+6.3,k0+23))+(5+.12*le)*p(C0(x/9+7.7,B/9+.9,k0+29)))),l[q*a+W]=1,c[E+1]=_e(x,B,h)+ce+3.35*z(0,.3,h.end*ie)-3,n[E]=ue(.3*(1-h.p2)+1*h.lip,0,1)-1.2*h.end,n[E+1]=ue((1-h.p2)*.9*(.5+.5*k.n2(x*.06+40,B*.06))*(1-h.lip),0,1),n[E+2]=ue(.35+.65*z(.02,.22,h.s1)*(.6+.4*h.p1),0,1),++g%60===0&&await r.yield()}const w=[];for(let q=0;q<e-1;q++)for(let W=0;W<a-1;W++){const x=q*a+W,B=x+1,E=x+a,D=E+1;l[x]&&l[B]&&l[E]&&l[D]&&(W+q&1?w.push(x,E,B,B,E,D):w.push(x,E,D,x,D,B))}await r.yield();const L=new u.BufferGeometry,M=new Uint32Array(w);L.setAttribute("position",new u.BufferAttribute(c,3)),L.setAttribute("aBed",new u.BufferAttribute(n,3)),L.setIndex(new u.BufferAttribute(M,1));const P=await Y0(c,M,r.yield);L.setAttribute("normal",new u.BufferAttribute(P,3)),L.boundingSphere=new u.Sphere(y(0,15,0),260);const X=new Float32Array(a*e);for(let q=0;q<X.length;q++)X[q]=z(.26,.5,1-P[q*3+1]);L.setAttribute("aSteep",new u.BufferAttribute(X,1)),await r.yield();const N=new u.Mesh(L,Y.getObjectByName("bed").material);N.name="far-hills",Y.add(N)}{const t=new u.Mesh(new u.IcosahedronGeometry(1,3),new u.ShaderMaterial({vertexShader:Jo,fragmentShader:ea,side:u.BackSide,depthTest:!1,depthWrite:!1,fog:!1,uniforms:{uLampDir:ne.uLampDir,uBg:{value:K(Oe[0])},uTime:G,uHaze:S,uHazeK:st}}));t.name="water-haze",t.frustumCulled=!1,t.renderOrder=-10,Y.add(t)}await r.yield();const wo=R.object.getObjectByName("spire").material,yo=R.object.getObjectByName("threads").material,xe=_.fork("chimneys"),P0=[],v0=[],b={pos:[],mat:[],idx:[]};b.feet=[];{const t=[[-30,-7],[-27,24],[-34,18],[3,35],[36,9],[33,-14],[-38,-16],[-13,34],[20.5,31.5],[27,25],[38,17,19,1],[41,3,21,0],[40,-9,22,1],[37,-22,24,1],[31,-33,25,0],[22,-41,26,1],[12,-46,24,1],[30,-45,26,1],[44,-30,27,1],[47,-14,25,1],[-36,-26,12,1],[-38,-39,10,0],[-63,-15,11,1],[-77,21,9,0],[-58,23,12,1],[-83,-19,8,0],[-70,-30,13,1],[-66,34,10,0],[-30,-53,23,1],[-15,-59,27,0],[-2,-58,21,1],[-45,-45,19,0],[11,-57,25,1]],o=[],i=(e,c)=>ve.nearestXZ(e,c).dist>9.5&&!(e<-36&&Math.abs(c-j0)<14)&&Math.abs(e+44)>9&&!o.some(n=>Math.hypot(n[0]-e,n[1]-c)<6);for(const e of t)i(e[0],e[1])&&o.push([e[0],e[1],1,e[2]||0,e[3]]);const s=[[8,-40],[-3,-48],[-18,-49],[-28,-38],[-27,-20],[-40,0],[-30,4],[-10,-10],[0,-12],[10,-14]],d=(e,c)=>{let n=!1;for(let l=0,h=s.length-1;l<s.length;h=l++){const g=s[l],w=s[h];g[1]>c!=w[1]>c&&e<(w[0]-g[0])*(c-g[1])/(w[1]-g[1])+g[0]&&(n=!n)}return n};for(let e=0;o.length<46&&e<1200;e++){const c=18+52*Math.pow(xe(),.85),n=xe.range(0,ge),l=Math.cos(n)*c,h=Math.sin(n)*c;i(l,h)&&!d(l,h)&&o.push([l,h,0]),e%120===119&&await r.yield()}await r.yield();for(let e=0;e<o.length;e++){const[c,n,l,h,g]=o[e],w=h?g===1:e%10<3,L=xe(),M=l?xe.range(7,14):3+12*Math.pow(xe(),1.5),P=h||M,X=.55+P*.085,N=_e(c,n)-.5,q=ve.nearestXZ(c,n).dist<17,W=Ye(b,k,c,N,n,P,X,xe.range(-.07,.07),xe.range(-.07,.07),{cols:14,rows:q?ue(Math.round(P*2.7),14,36):ue(Math.round(P*1.8),9,h?32:24),smoker:w,sd:L,fresh:w?.9:.35,bulge:q?.1:.2}),x=1+Math.floor(xe()*2.99);for(let B=0;B<x;B++){const E=xe.range(0,ge),D=P*xe.range(.28,.7),Q=X*xe.range(.75,1.1);Ye(b,k,c+Math.cos(E)*Q,N,n+Math.sin(E)*Q,D,X*xe.range(.5,.72),Math.cos(E)*.1,Math.sin(E)*.1,{cols:10,rows:q?ue(Math.round(D*2.4),8,20):ue(Math.round(D*1.6),6,14),smoker:!1,sd:xe(),fresh:.3,bulge:q?.1:.2})}P0.push({x:W.x,y:W.y,z:W.z,r:W.r,smoker:w,H:P}),e%4===3&&await r.yield()}for(const[e,c,n,l]of[[-6,36,17,1],[9,37,21,0],[24,36,24,1],[-2,47,19,1],[36,28,26,0],[16,50,23,1],[-22,34,14,1]]){if(ve.nearestXZ(e,c).dist<9.5||o.some(M=>Math.hypot(M[0]-e,M[1]-c)<5))continue;const h=.55+n*.085,g=_e(e,c)-.5,w=1+Math.floor(F()*2.99),L=Ye(b,k,e,g,c,n,h,F.range(-.06,.06),F.range(-.06,.06),{cols:12,rows:ue(Math.round(n*1.2),9,26),smoker:l===1,sd:F(),fresh:l?.9:.35});for(let M=0;M<w;M++){const P=F.range(0,ge),X=n*F.range(.28,.7),N=h*F.range(.75,1.1);Ye(b,k,e+Math.cos(P)*N,g,c+Math.sin(P)*N,X,h*F.range(.5,.72),Math.cos(P)*.1,Math.sin(P)*.1,{cols:10,rows:ue(Math.round(X*1.6),6,14),smoker:!1,sd:F(),fresh:.3})}v0.push({x:L.x,y:L.y,z:L.z,r:L.r,smoker:l===1,H:n}),await r.yield()}const v=[];{const e=b.idx.length,c=_e(T.x,T.z)-.6;Ye(b,k,T.x,c,T.z,O0-c,2.5,0,0,{cols:18,rows:22,smoker:!1,sd:.37,fresh:.25,mound:!0,bulge:.07});for(const[M,P,X]of[[2.2,.62,1.25],[4.6,.45,1.05]])Ye(b,k,T.x+Math.cos(M)*2,c,T.z+Math.sin(M)*2,(O0-c)*P,X,Math.cos(M)*.08,Math.sin(M)*.08,{cols:12,rows:10,smoker:!1,sd:.2+.1*M,fresh:.3,mound:!0,bulge:.08});v.push([e,b.idx.length,{x:T.x,y:O0,z:T.z}]);const n=-52.5,l=14,h=15.5,g=.55+h*.085,w=_e(n,l)-.5,L=Ye(b,k,n,w,l,h,g,-.03,-.04,{cols:16,rows:34,smoker:!0,sd:.61,fresh:.9,bulge:.1});Ye(b,k,n-1.5,w,l+.9,h*.55,g*.66,-.09,.05,{cols:12,rows:16,smoker:!1,sd:.23,fresh:.3,bulge:.1}),Ye(b,k,n+1.3,w,l-1.2,h*.36,g*.6,.08,-.08,{cols:12,rows:12,smoker:!1,sd:.82,fresh:.3,bulge:.1}),v0.push({x:L.x,y:L.y,z:L.z,r:L.r,smoker:!0,H:h})}for(const e of me){const c=Math.hypot(e.x,e.z)||1,n=e.x/c,l=e.z/c,h=b.idx.length;Ye(b,k,e.x-n*.75,e.y-2.95,e.z-l*.75,3,1.5,n*.13,l*.13,{cols:16,rows:18,smoker:!1,sd:xe(),fresh:.2,flat:!0}),v.push([h,b.idx.length,e])}{const e=b.repose=Math.tan(35*Te),c=.9,n=.3,l={};b.rays=[],b.fans=[],b.stp=[],b.hem=new Array(b.pos.length/3*4).fill(0);const h=Y.getObjectByName("bed").geometry,g=h.attributes.position.array,w=h.attributes.aBed.array,L=h.attributes.aSteep.array,M=ze.length*3,P=(W,x)=>{let B=0,E=W.length-2;for(;B<E;){const D=B+E+1>>1;W[D]<=x?B=D:E=D-1}return B},X=(W,x)=>{const B=P(ze,W),E=P(Fe,x),D=ue((W-ze[B])/(ze[B+1]-ze[B]),0,1),Q=ue((x-Fe[E])/(Fe[E+1]-Fe[E]),0,1),O=E*M+B*3;l.bh=$($(g[O+1],g[O+4],D),$(g[O+M+1],g[O+M+4],D),Q),l.bs=$($(w[O+2],w[O+5],D),$(w[O+M+2],w[O+M+5],D),Q),l.bm=$($(w[O],w[O+3],D),$(w[O+M],w[O+M+3],D),Q),l.bf=$($(w[O+1],w[O+4],D),$(w[O+M+1],w[O+M+4],D),Q),l.bt=$($(L[O/3],L[O/3+1],D),$(L[(O+M)/3],L[(O+M)/3+1],D),Q)},N=(W,x,B)=>{let E=1e9,D=1e9;for(let Q=0;Q<=Ze;Q++){const O=ke[Q*3]-W,ie=ke[Q*3+2]-B,le=ke[Q*3+1]-x,ce=O*O+ie*ie;ce<E&&(E=ce),ce+le*le<D&&(D=ce+le*le)}l.dh=Math.sqrt(E),l.d3=Math.sqrt(D)},q=(W,x,B,E,D,Q)=>Math.max(D*e,Q-(_e(W+B*D,x+E*D)-c),0);b.lay=(W,x,B,E)=>{const[D,Q,O,ie,le,ce,qe,De]=W,Le=q(O,ie,le,ce,qe,De),Ke=Math.hypot(qe,Le)||1,we=Le/Ke,Ce=qe/Ke;X(O,ie);let Re=De-l.bh,Se=!(Re>0),Ie=Se?0:Q;for(let Ee=1;Ee<=Q;Ee++){const Xe=Ee/Q,ae=O+le*qe*Xe,he=ie+ce*qe*Xe,ye=De-Le*Xe,fe=(D+Ee-1)*3,We=W[9]?0:(.35*k.n3(ae,ye,he)+.15*k.n3(ae*2.7+11,ye*2.7,he*2.7))*z(0,.6,Ke*Xe);x[fe]=ae+le*we*We,x[fe+1]=ye+Ce*We,x[fe+2]=he+ce*we*We,X(x[fe],x[fe+2]);const se=x[fe+1]-l.bh,de=(D+Ee-1)*4;!Se&&se<=0&&(Ie=Ee-1+Re/(Re-se),Se=!0),Re=se,B[fe]=W[12],B[fe+1]=W[13],B[fe+2]=W[14],E[de]=l.bm,E[de+1]=l.bf,E[de+2]=l.bs,b.stp[D+Ee-1]=l.bt}for(let Ee=1;Ee<=Q;Ee++)E[(D+Ee-1)*4+3]=Ie>0?Ee/Ie:1},b.ease=(W,x,B,E)=>{const D=[];for(const Q of[1,x-1])for(let O=0,ie=0;O<2*x;O++,ie=(ie+Q)%x){const le=W[ie],ce=W[(ie+Q)%x];if(!le||!ce||le[11])continue;const qe=le[6]+(Math.hypot(le[2]-B,le[3]-E)+le[6])*ge/x;ce[6]>qe&&(ce[6]=qe,D.push(ce))}return D};for(let W=0;W<b.feet.length;W++){const[x,B,E,D,Q]=b.feet[W];let O=0;for(let ae=0;ae<B;ae++)O=Math.max(O,Math.hypot(b.pos[(x+ae)*3]-E,b.pos[(x+ae)*3+2]-Q));const ie=ve.nearestXZ(E,Q).dist<3*O+6,le=(ae,he)=>{const ye=Math.hypot(ae-E,he-Q)||.001,fe=(ae-E)/ye,We=(he-Q)/ye;if(l.sit=D<=_e(ae,he),l.sit)return 0;for(let se=n;;se+=n){const de=ae+fe*se,Be=he+We*se,Me=D-se*e,e0=Ct(de,Be,l),t0=Nt(de,Be);if(l.lip>0||ie&&(N(de,Me,Be),l.d3<3.5||l.dh<5&&t0<e0))return se-n;if(Me<=Math.min(e0,t0)-c)return se;if(se>=2*ye)return 2*ye}},ce=[],qe=[];let De=0,Le=0,Ke=!0;for(let ae=0;ae<B;ae++){const he=b.pos[(x+ae)*3],ye=b.pos[(x+ae)*3+2],fe=Math.hypot(he-E,ye-Q)||.001;ce.push(le(he,ye)),qe.push(l.sit),De=Math.max(De,ce[ae]),Le=Math.max(Le,Math.hypot(ce[ae],q(he,ye,(he-E)/fe,(ye-Q)/fe,ce[ae],D))),X(he,ye),b.hem[(x+ae)*4]=l.bm,b.hem[(x+ae)*4+1]=l.bf,b.hem[(x+ae)*4+2]=l.bs,b.hem[(x+ae)*4+3]=D>l.bh?0:1,b.stp[x+ae]=l.bt}await r.yield();const we=ue(Math.ceil(ge*(O+.5*De)/B/.9),1,4),Ce=B*we,Re=ue(Math.ceil(Le/.7),2,12),Se=[],Ie=new Int32Array(Ce).fill(-1),Ee=b.rays.length,Xe=b.idx.length;for(let ae=0;ae<Ce;ae++){const he=Math.floor(ae/we),ye=(he+1)%B,fe=ae%we/we,We=(x+he)*3,se=(x+ye)*3,de=$(b.pos[We],b.pos[se],fe),Be=$(b.pos[We+2],b.pos[se+2],fe),Me=fe?le(de,Be):ce[he];Se.push([0,0,de,Be,0,0,Me,0,0,0,0,fe?l.sit:qe[he]])}b.ease(Se,Ce,E,Q),we>1&&await r.yield();for(let ae=0;ae<B;ae++){const he=ae*we,ye=(ae+1)%B;let fe=!1;for(let se=0;se<=we;se++)Se[(he+se)%Ce][6]>0&&(fe=!0);if(!fe){for(let se=0;se<=we;se++)Se[(he+se)%Ce][11]||(Ke=!1);continue}for(let se=0;se<=we;se++){const de=(he+se)%Ce;if(Ie[de]>=0)continue;const Be=Se[de][2],Me=Se[de][3],e0=Math.hypot(Be-E,Me-Q)||.001,t0=de%we/we,E0=(x+Math.floor(de/we))*3,B0=(x+(Math.floor(de/we)+1)%B)*3,I0=[Ie[de]=b.pos.length/3,Re,Be,Me,(Be-E)/e0,(Me-Q)/e0,Se[de][6],D,0,0,de,Se[de][11],$(b.mat[E0],b.mat[B0],t0),$(b.mat[E0+1],b.mat[B0+1],t0),$(b.mat[E0+2],b.mat[B0+2],t0)];for(let Zt=1;Zt<=Re;Zt++)b.pos.push(0,0,0),b.mat.push(0,0,0),b.hem.push(0,0,0,0);b.rays.push(I0),b.lay(I0,b.pos,b.mat,b.hem)}const We=we>>1;for(let se=0;se<we;se++){const de=Ie[(he+se)%Ce],Be=Ie[(he+se+1)%Ce];b.idx.push(de,x+(se<We?ae:ye),Be);for(let Me=1;Me<Re;Me++)b.idx.push(de+Me,de+Me-1,Be+Me,Be+Me,de+Me-1,Be+Me-1)}b.idx.push(Ie[(he+We)%Ce],x+ae,x+ye)}b.fans.push([Xe,b.idx.length,E,Q,O+De,Ee,Re,Ce,b.rays.length,Ke])}}await r.yield();const m=new Float32Array(b.pos);await r.yield();const p=new u.BufferGeometry;p.setAttribute("position",new u.BufferAttribute(m,3)),p.setAttribute("aMat",Ve(b.mat,3)),p.setIndex(b.idx),await r.yield(),p.setAttribute("normal",new u.BufferAttribute(await Y0(m,b.idx,r.yield),3)),p.boundingSphere=new u.Sphere(y(0,8,0),90);const a=new u.Mesh(p,wo);a.name="lesser-chimneys",Y.add(a);{const e=new u.BufferGeometry,c=b.fans.length?b.fans[0][0]:b.idx.length;e.setAttribute("position",p.getAttribute("position")),e.setAttribute("normal",p.getAttribute("normal")),e.setAttribute("aHem",new u.BufferAttribute(b.hem=new Float32Array(b.hem),4)),e.setAttribute("aSteep",new u.BufferAttribute(b.stp=Float32Array.from({length:m.length/3},(l,h)=>b.stp[h]||0),1)),e.setIndex(p.index),e.setDrawRange(c,b.idx.length-c),e.boundingSphere=p.boundingSphere;const n=new u.Mesh(e,Ue(Wo,Vo,{uFlow:Y.getObjectByName("bed").material.uniforms.uFlow,uVant:te,uFill:re,uHaze:S,uHazeK:st,uEnd:Bt},{transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1}));n.name="apron-hems",n.renderOrder=-1,Y.add(n)}R.flanges.forEach((e,c)=>{if(!e.pass)return;const n=[];for(const[h,g,w]of v){const L=w.x*e.o[0]+w.z*e.o[1]-e.r0,M=w.x*e.t[0]+w.z*e.t[1];if(w.y<e.yc&&w.y>e.yc-12&&L<e.Lr+4&&Math.abs(M)<e.Lw+6)for(let P=h;P<g;P++)n.push(b.idx[P])}if(!n.length)return;const l=new u.BufferGeometry;for(const h of["position","normal","aMat"])l.setAttribute(h,p.getAttribute(h));l.setIndex(n),R.mirrorRock(l,c)}),await r.yield()}const qt={value:1},Wt=Math.tan(R.lean??.2),Vt={value:K("#FF8E3C").multiplyScalar(.8*$(.85,1.2,U))};{const t=[],o=[],i=[],s=[];for(const[e,c]of[[P0,xe],[v0,F]])for(const n of e){if(!n.smoker)continue;const l=e===v0,h=t.length/3,g=c(),w=c.range(5,8)+n.H*.3+(l?2.5:0),L=Math.max(n.r*(l?1.15:.8),l?.34:.22);for(let M=0;M<=18;M++)for(let P=0;P<16;P++){const X=P/16*ge;t.push(n.x,n.y-.35,n.z),o.push(Math.cos(X),0,Math.sin(X)),i.push(M/18,g,w,L)}for(let M=0;M<18;M++)for(let P=0;P<16;P++){const X=h+M*16+P,N=h+M*16+(P+1)%16,q=X+16,W=N+16;s.push(X,q,N,N,q,W)}}const m=new u.BufferGeometry;m.setAttribute("position",Ve(t,3)),m.setAttribute("normal",Ve(o,3)),m.setAttribute("aPl",Ve(i,4)),m.setIndex(s),m.boundingSphere=new u.Sphere(y(0,10,0),95);const p=j.mineral==="white"?K(Oe[4]).multiplyScalar(.55):new u.Color(.1,.11,.125),a=new u.Mesh(m,Ue(Uo,Xo,{uLeanT:{value:Wt},uSoot:{value:p},uEmberC:Vt,uCore:{value:j.mineral==="white"?.5:.16},uCold:{value:j.mineral==="white"?.42:1},uPlumeK:qt}));a.name="plumes",Y.add(a)}const bo=t=>3+1.6*Math.sin(t*.19+.5)+.7*Math.sin(t*.47)+.6*k.n2(t*.9,7.7);{const t=[],o=[],i=[],d=(a,e,c,n,l=0,h=xe)=>{const g=t.length/3,w=l?1.02+.96*h():h();for(let L=0;L<=12;L++)for(let M=-1;M<=1;M+=2)t.push(a,e,c),o.push(L/12,M,n,w);for(let L=0;L<12;L++){const M=g+L*2;i.push(M,M+1,M+2,M+1,M+3,M+2)}},v=Math.round(56*V);for(let a=0;a<v;a++){const e=$(-100,-50,(a+xe())/v),c=bo(e)+xe.range(-.8,.8);d(e,_e(e,c)+.6,c,xe.range(3,7),1)}for(const a of P0)if(!a.smoker)for(let e=0;e<2;e++)d(a.x+xe.range(-.2,.2),a.y-.1,a.z+xe.range(-.2,.2),xe.range(2.5,6));for(const a of v0)if(!a.smoker)for(let e=0;e<2;e++)d(a.x+F.range(-.2,.2),a.y-.1,a.z+F.range(-.2,.2),F.range(2.5,6),0,F);{const a=R.flanges[2],e=[0,0,0],c=[],n=y(),l=y(),h=y(),g=y(),w=y(),L=Math.tan(37.5*Te);for(let P=0;P<28;P++){const X=a.phi0+(P/27*2-1)*a.phis*.94,N=a.E(X),q=a.yc+a.rl-a.skirt(X);a.at(N-a.rl+(a.rl+.05)*.64,X,q+(a.rl+.05)*.77,e);let W=0;for(const x of[oe-.04,oe-.015,oe+.01]){ve.pointAt(x,w),h.copy(V0(0,x)).sub(w).normalize(),n.crossVectors(h,y(0,1,0)).normalize(),l.crossVectors(n,h),g.set(e[0],e[1]+1.2,e[2]).sub(w);const B=g.dot(h);if(B<4)continue;const E=g.dot(n)/B/(L*1.6),D=g.dot(l)/B/L,Q=w.clone().addScaledVector(g,2.4);Math.abs(E)<.9&&D>-.6&&D<.8&&Math.hypot(Q.x,Q.z)>10.5&&(W+=1.2-Math.abs(E)-.4*Math.max(D,0))}c.push([W,e[0],e[1],e[2]])}c.sort((P,X)=>X[0]-P[0]);for(let P=0;P<10;P++){const X=c[P];d(X[1]+F.range(-.1,.1),X[2],X[3]+F.range(-.1,.1),F.range(3.5,6.5),1,F)}let M=0;for(const[P,X]of[[-.42,.72],[.02,.8],[.4,.66],[-.2,.6],[.22,.58],[0,.5],[-.5,.5],[.5,.5]]){const N=a.phi0+P*a.phis;if(a.at(X*a.E(N),N,a.yc,e),M>=3||ve.nearestXZ(e[0],e[2]).dist<9.5)continue;M++;const q=_e(e[0],e[2])+.3,W=t.length/3,x=2.05+.9*((P*7.3+10.4)%1);for(let B=0;B<=12;B++)for(let E=-1;E<=1;E+=2)t.push(e[0],q,e[2]),o.push(B/12,E,(a.yc-.15-q)/.98,x);for(let B=0;B<12;B++){const E=W+B*2;i.push(E,E+1,E+2,E+1,E+3,E+2)}}}const m=new u.BufferGeometry;m.setAttribute("position",Ve(t,3)),m.setAttribute("aT",Ve(o,4)),m.setIndex(i),m.boundingSphere=new u.Sphere(y(-20,8,0),110);const p=new u.Mesh(m,yo);p.name="field-shimmer",p.renderOrder=3,Y.add(p)}await r.yield();const rt=new u.Mesh(await la(nt,H0,r.yield),Ue(oo,ht,{uFoul:{value:1},uSoft:{value:0},uFish:{value:0},uRow:{value:0}}));rt.name="lander",rt.position.copy(Ne),Y.add(rt),await r.yield();const xo={value:A?1.4:1},Tt={value:[34,62]},Pt={value:new u.Vector2(1,1)},_t={value:new u.Vector2(0,0)},Dt={value:0},Rt={value:1};{const t=[],o=[],i=[],s=[];for(let l=0;l<2;l++){const h=t.length/3;for(let g=0;g<=6;g++)for(let w=0;w<22;w++){const L=w/22*ge;t.push(Math.cos(L),0,Math.sin(L)),o.push(Math.cos(L),0,Math.sin(L)),i.push(g/6,l)}for(let g=0;g<6;g++)for(let w=0;w<22;w++){const L=h+g*22+w,M=h+g*22+(w+1)%22,P=L+22,X=M+22;s.push(L,P,M,M,P,X)}for(const[g,w]of[[0,-1],[1,1]]){const L=t.length/3;t.push(0,0,0),o.push(0,w,0),i.push(g,l);for(let M=0;M<22;M++){const P=M/22*ge;t.push(Math.cos(P),0,Math.sin(P)),o.push(0,w,0),i.push(g,l)}for(let M=0;M<22;M++)s.push(L,L+1+M,L+1+(M+1)%22)}}const m=new u.BufferGeometry;m.setAttribute("position",Ve(t,3)),m.setAttribute("normal",Ve(o,3)),m.setAttribute("uv",Ve(i,2)),m.setIndex(s);const p=new u.ShaderMaterial({vertexShader:Oo,fragmentShader:Ho,uniforms:{uLandPos:ne.uLandPos,uLandDir:ne.uLandDir,uLandCol:ne.uLandCol,uLandI:ne.uLandI,uAbsorb:ne.uAbsorb,uTime:G,uLen:Tt,uBeam:xo,uBeamK:Pt,uBeamIn:_t,uShaft:Dt,uTaper:Rt},transparent:!0,depthWrite:!1,blending:u.AdditiveBlending,side:u.DoubleSide}),a=new u.Mesh(m,p);a.name="beams",a.frustumCulled=!1,a.renderOrder=4,Y.add(a);const e=new u.BufferGeometry;e.setAttribute("position",Ve([-1,-1,0,1,-1,0,1,1,0,-1,1,0,-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),e.setAttribute("uv",Ve([0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0],2)),e.setIndex([0,1,2,0,2,3,4,5,6,4,6,7]);const c=new u.ShaderMaterial({vertexShader:jo,fragmentShader:Ko,uniforms:{uLandPos:ne.uLandPos,uLandDir:ne.uLandDir,uLandCol:ne.uLandCol,uLandI:ne.uLandI},transparent:!0,depthWrite:!1,blending:u.AdditiveBlending}),n=new u.Mesh(e,c);n.name="lens-star",n.frustumCulled=!1,n.renderOrder=5,Y.add(n)}await r.yield();const ee=_.fork("cast"),p0=(t,o,i,s,d,v=0)=>{const m=new u.InstancedBufferGeometry;m.index=t.index;for(const a in t.attributes)m.setAttribute(a,t.attributes[a]);for(const[a,e,c]of o)m.setAttribute(a,new u.InstancedBufferAttribute(new Float32Array(e),c));m.instanceCount=i;const p=new u.Mesh(m,s);return p.frustumCulled=!1,p.name=d,p.renderOrder=v,Y.add(p),p},it=(t,o)=>Ue(t,ht,{uFoul:{value:0},uSoft:{value:0},uFish:{value:0},...o},{side:u.DoubleSide}),_0=(t,o,i,s)=>({uSize:{value:t},uRange:{value:o},uSeethe:{value:i},uWave:{value:s}});{const t=j.cast,o=Math.round((t==="yeti"?170:t==="snails"?560:760)*V*$(1,I,.6)),i=[.2,.22,.3,.08,.06,.14],s=[],d=[];R.flanges.forEach((p,a)=>{const e=Math.atan2(p.o[1],p.o[0]),c=p.Lw*.95/7.5,n=Math.round(o*i[a]);for(let l=0;l<n;l++){const h=p.yc-.3-3.8*Math.pow(ee(),1.5),g=e+(ee()+ee()-1)*c,w=R.trunkRadius(g,h)+(t==="yeti"?.05:.03),L=ee();l&1||(s.push(Math.cos(g)*w,h,Math.sin(g)*w,L),d.push(Math.cos(g),.12,Math.sin(g)))}});const v=t==="yeti"?oa():t==="snails"?aa():ta(),m=t==="yeti"?_0(.17,.1,.5,1):t==="snails"?_0(.07,.03,.25,0):_0(.085,.16,1.7,3);p0(v,[["aPos",s,4],["aNrm",d,3]],s.length/4,it(mt,m),"wall-cast")}await r.yield();{const t=[],o=[],i=Math.round(110*V*I);for(let s=0,d=0;s<i&&d<i*6;d++){const v=Math.floor(ee.range(.04,.82)*Ze),m=ee.range(0,ge),p=ee.range(1,12),a=ke[v*3]+Math.cos(m)*p,e=ke[v*3+2]+Math.sin(m)*p;Math.hypot(a,e)<10.5||(t.push(a,_e(a,e)+.02,e,ee()),o.push(0,1,0),s++)}for(const[s,d,v]of[[0,4.44,.14],[0,4.44,-.22],[.46,2.37,.19],[-.2,2.37,.46],[.05,1.3,.3],[-.1,.59,-.25],[1.36,.08,.74],[-.45,1.3,.3]])t.push(Ne.x+s,Ne.y+d,Ne.z+v,ee()),o.push(0,.1,0);p0(na(),[["aPos",t,4],["aNrm",o,3]],t.length/4,it(mt,_0(.14,.3,.22,2.2)),"crabs")}await r.yield();{const t=[],o=[],i=Math.round(1200*V*$(1,I,.6)),s={};for(let v=0;t.length/4<i&&v<14e3;v++){const m=Math.floor(ee.range(.2,.84)*Ze),p=ee.range(0,ge),a=14*Math.sqrt(ee()),e=ke[m*3]+Math.cos(p)*a,c=ke[m*3+2]+Math.sin(p)*a;if(Math.hypot(e,c)>8.8&&e>-36){const l=_e(e,c,s);s.s1<.13&&l<5&&(t.push(e,l+.03,c,ee()),o.push(ee.range(-.3,.3),1,ee.range(-.3,.3)))}v%700===699&&await r.yield()}const d=j.cast==="snails";p0(sa(d),[["aPos",t,4],["aNrm",o,3]],t.length/4,it(mt,_0(d?.24:.21,0,.3,.45)),"clams")}await r.yield();{const t=Y.getObjectByName("lesser-chimneys").geometry,o=t.attributes.position.array,i=[],s=[];for(const a of["crabs","clams"]){const e=Y.getObjectByName(a).geometry,c=e.attributes.aPos.array,n=e.attributes.aNrm.array;let l=0;for(let h=0;h<e.instanceCount;h++){const g=c[h*4],w=c[h*4+1],L=c[h*4+2];let M=!1;for(let P=0;P<b.feet.length&&!M;P++){const X=b.feet[P],N=b.fans[P],q=X[0],W=X[1];if(!(!N[9]||w>=X[3]||(g-N[2])*(g-N[2])+(L-N[3])*(L-N[3])>N[4]*N[4]))for(let x=0,B=W-1;x<W;B=x++){const E=o[(q+x)*3],D=o[(q+x)*3+2],Q=o[(q+B)*3],O=o[(q+B)*3+2];D>L!=O>L&&g<(Q-E)*(L-D)/(O-D)+E&&(M=!M)}}h%200===199&&await r.yield(),!M&&(l<h&&(c.copyWithin(l*4,h*4,h*4+4),n.copyWithin(l*3,h*3,h*3+3)),l++)}l<e.instanceCount&&(e.setAttribute("aPos",new u.InstancedBufferAttribute(c.slice(0,l*4),4)),e.setAttribute("aNrm",new u.InstancedBufferAttribute(n.slice(0,l*3),3)),e.instanceCount=l),await r.yield()}for(const a of P0)i.push([a.x,a.y,a.z,a.r+.3]);for(const a of v0)i.push([a.x,a.y,a.z,a.r+.3]);R.passThickets.forEach((a,e)=>i.push([a.x,a.y,a.z,C[e].r]));for(const a of R.wormThickets)a.pass||i.push([a.center.x,a.center.y,a.center.z,a.radius]);const d=R.object.getObjectByName("tubeworms");if(d){const a=d.geometry.attributes.aBase.array,e=d.geometry.attributes.aAxis.array,c=d.geometry.attributes.aInfo.array;for(let n=0;n<d.geometry.instanceCount;n++)R.wormThickets[c[n*3+1]].pass||i.push([a[n*3],a[n*3+1],a[n*3+2],Math.hypot(e[n*3],e[n*3+2])])}i.push([Ne.x,Ne.y,Ne.z,1.55+.34+.3]);for(const a of["crabs","clams"]){const e=Y.getObjectByName(a),c=e.geometry.attributes.aPos.array,n=1.5*Math.SQRT2*e.material.uniforms.uRange.value+1.3*e.material.uniforms.uSize.value;for(let l=0;l<c.length;l+=4)i.push([c[l],c[l+1],c[l+2],n])}const v=(a,e,c,n,l,h)=>{const g=l-c,w=h-n,L=ue(((a-c)*g+(e-n)*w)/(g*g+w*w||1),0,1);return Math.hypot(a-c-g*L,e-n-w*L)};let m=[],p=0;for(const a of i){for(const e of b.fans)e[1]>e[0]&&(a[0]-e[2])*(a[0]-e[2])+(a[2]-e[3])*(a[2]-e[3])<=(e[4]+a[3])*(e[4]+a[3])&&m.push([a,e]);++p%100===0&&await r.yield()}for(;m.length;){const a=[],e=new Set;p=0;for(const[[c,n,l,h],g]of m){const[w,L,,,,M,P]=g,X=b.rays[M][0];for(let N=w;N<L;N+=3){const q=b.idx[N]*3,W=b.idx[N+1]*3,x=b.idx[N+2]*3;if(Math.max(o[q+1],o[W+1],o[x+1])<=n)continue;const B=(c-o[W])*(o[q+2]-o[W+2])-(o[q]-o[W])*(l-o[W+2]),E=(c-o[x])*(o[W+2]-o[x+2])-(o[W]-o[x])*(l-o[x+2]),D=(c-o[q])*(o[x+2]-o[q+2])-(o[x]-o[q])*(l-o[q+2]),Q=!((B<0||E<0||D<0)&&(B>0||E>0||D>0));if(!(!Q&&Math.min(v(c,l,o[q],o[q+2],o[W],o[W+2]),v(c,l,o[W],o[W+2],o[x],o[x+2]),v(c,l,o[x],o[x+2],o[q],o[q+2]))>=h))for(const O of[q,W,x]){if(O/3<X)continue;const ie=b.rays[M+Math.floor((O/3-X)/P)],le=(c-ie[2])*ie[4]+(l-ie[3])*ie[5];if(Math.max(le-h,0)<ie[6])ie[6]=Math.max(le-h,0);else if(Q&&!ie[9])ie[9]=1;else if(Q&&ie[6]>0)ie[6]=0;else continue;a.push(ie),e.add(g)}}++p%12===0&&await r.yield()}for(const[,,c,n,,l,,h,g]of e){const w=[];for(let L=l;L<g;L++)w[b.rays[L][10]]=b.rays[L];a.push(...b.ease(w,h,c,n))}for(const c of a)b.lay(c,o,t.attributes.aMat.array,b.hem),c[8]||(c[8]=1,s.push(c));m=m.filter(c=>e.has(c[1])),await r.yield()}s.length&&t.attributes.normal.array.set(await Y0(o,b.idx,r.yield))}await r.yield();const Je=y(0,1,0),lt={uBurst:{value:0},uSize:{value:.42},uSoft:{value:.6},uFish:{value:1}};{const t=[],o=[],i=y(),s=y(),d=y(),v=y(),m=y(),p=et+.015,a=ve.posAtDist(p*be,y());{const e=V0(0,p);i.set(e.x,e.y-2,e.z).sub(a).normalize()}v.copy(a).addScaledVector(i,4.3),s.crossVectors(i,Je).normalize(),d.crossVectors(s,i);for(let e=0;e<18;e++){const c=e/18*ge+ee.range(-.15,.15),n=ee.range(.25,1.4),l=ee.range(-1,1);m.copy(s).multiplyScalar(Math.cos(c)).addScaledVector(d,Math.sin(c)),t.push(v.x+m.x*n+i.x*l,v.y+m.y*n+i.y*l,v.z+m.z*n+i.z*l,ee());const h=-(m.x*v.x+m.z*v.z)/Math.hypot(v.x,v.z);h>0&&(m.x+=v.x/Math.hypot(v.x,v.z)*h*.8,m.z+=v.z/Math.hypot(v.x,v.z)*h*.8),m.y>0&&(m.y*=.25),m.addScaledVector(i,.45).normalize(),o.push(m.x,m.y,m.z,n*.22+ee.range(0,.15))}for(let e=0;e<12;e++){const c=e<6?$(yt+4,u0-3,e/5):$(N0-8,N0+12,(e-6)/5);ve.posAtDist(c,v),ve.tangentAtDist(c,i),s.crossVectors(i,Je).normalize();const n=e<6?-1:1,l=e<6?ee.range(3.8,4.6):ee.range(3.6,5.2),h=ee.range(-.5,2.2),g=ee();if(e>=3&&e<6){ve.posAtDist(u0+4.9,v),ve.tangentAtDist(u0+4.9,i),s.crossVectors(i,Je).normalize(),t.push(v.x+i.x*(4.6+(e-3)*1.3)+s.x*(1.9-(e-3)*.55),v.y+.4-(e-3)*.4,v.z+i.z*(4.6+(e-3)*1.3)+s.z*(1.9-(e-3)*.55),g),o.push(0,1,0,99);continue}t.push(v.x+s.x*n*l,v.y+h,v.z+s.z*n*l,g),o.push(0,1,0,99)}{const e=lt.uSize.value*1.2,c=1.1+1.02*e+.1*Math.sqrt(3)+.15+.05,n=Math.ceil(be/.025),l=new Float32Array((n+1)*3),h=y(),g=y(),w=y(),L=y(),M=y(),P=y();for(let N=0;N<=n;N++)ve.posAtDist(N/n*be,h),l[N*3]=h.x,l[N*3+1]=h.y,l[N*3+2]=h.z,N%2e3===1999&&await r.yield();const X=(N,q,W)=>{const x=t[N*4],B=t[N*4+1],E=t[N*4+2],D=Math.fround(t[N*4+3]),Q=o[N*4+3],O=Math.fround(D*5),ie=1.9+1.6*(O-Math.floor(O)),le=c+ie+.52*e;let ce=q.x,qe=q.y+.001,De=q.z,Le=Math.hypot(ce,qe,De);ce/=Le,qe/=Le,De/=Le;let Ke=Math.sin(D*40)*.25+.2,we=1,Ce=Math.cos(D*31)*.25;Le=Math.hypot(Ke,we,Ce),Ke/=Le,we/=Le,Ce/=Le;let Re=1e9;for(let Se=0;Se<=n;Se++){const Ie=x-l[Se*3],Ee=B-l[Se*3+1],Xe=E-l[Se*3+2];if(Ie*Ie+Ee*Ee+Xe*Xe>le*le)continue;const ae=ue(ue((Se/n-et)/.012,0,3)-Q,0,3),he=(1-Math.exp(-ae*2.6))*ie,ye=z(0,.25,ae);let fe=Ke+(ce-Ke)*ye+1e-4,We=we+(qe-we)*ye,se=Ce+(De-Ce)*ye;Le=Math.hypot(fe,We,se),fe/=Le,We/=Le,se/=Le;const de=Ie+ce*he,Be=Ee+qe*he,Me=Xe+De*he,e0=ue(-(de*fe+Be*We+Me*se),-.52*e,.5*e),t0=de+fe*e0,E0=Be+We*e0,B0=Me+se*e0,I0=Math.hypot(t0,E0,B0);I0<Re&&(Re=I0,W&&W.set(t0,E0,B0))}return Re};for(let N=0;N<30;N++){if(g.set(o[N*4],o[N*4+1],o[N*4+2]),X(N,g)>=c)continue;const q=N<18,W=t[N*4]/Math.hypot(t[N*4],t[N*4+2]),x=t[N*4+2]/Math.hypot(t[N*4],t[N*4+2]),B=Math.max(g.y,0),E=Math.max(-(g.x*W+g.z*x),0);w.crossVectors(g,Je).lengthSq()<1e-6&&w.set(1,0,0),w.normalize(),L.crossVectors(g,w);for(let D=0,Q=!1;!Q&&D<200;D++){(D||!q)&&(X(N,g,h),h.setY(0).lengthSq()<1e-8&&h.set(W,0,x),h.normalize(),t[N*4]+=h.x*.05,t[N*4+2]+=h.z*.05);for(let O=q&&!D?2:0;O<=(q?180:0)&&!Q;O+=2){let ie=0;for(let le=0;le<(O?12:1);le++){if(M.copy(g).multiplyScalar(Math.cos(O*Te)).addScaledVector(w,Math.sin(O*Te)*Math.cos(le*ge/12)).addScaledVector(L,Math.sin(O*Te)*Math.sin(le*ge/12)),M.y>B+1e-9||-(M.x*W+M.z*x)>E+1e-9)continue;const ce=X(N,M);ce>ie&&(ie=ce,P.copy(M))}ie>=c&&(O&&(o[N*4]=P.x,o[N*4+1]=P.y,o[N*4+2]=P.z),Q=!0),O%8===0&&await r.yield()}}}}p0(ra(),[["aHome",t,4],["aOut",o,4]],30,Ue(_o,To,{uFoul:{value:0},uSoft:{value:0},uFish:{value:0},...lt},{side:u.DoubleSide}),"eelpout")}const It={uRow:{value:1},uEyeL:{value:y(0,0,5)}},pe=[oe-.065,oe-.03,oe+.005,oe+.045,oe+.095,oe+.15,oe+.205,oe+.265],l0=[];{const t=d=>d<oe+.03?V0(0,d):at(0,d),o=(d,v,m,p)=>{const a=ve.pointAt(d,y()),e=t(d).clone().sub(a).normalize(),c=y().crossVectors(e,Je).normalize();return a.addScaledVector(e,v).addScaledVector(c,m).add(y(0,p,0))},i=(d,v,m,p=0)=>{const a=ve.pointAt(d,y()),e=ne.uLandPos.value[1].clone().addScaledVector(H0,v*62);return a.addScaledVector(e.sub(a).normalize(),m).add(y(0,p,0))},s=(d,v,m,p)=>{const a=ve.pointAt(d,y()),e=y(-a.x,0,-a.z).normalize(),c=y().crossVectors(e,Je);return a.addScaledVector(e,Math.cos(v*Te)*m).addScaledVector(c,Math.sin(v*Te)*m).add(y(0,p,0))};l0.push(s(pe[0],60,11.5,-4),s(pe[1],54,7.4,-1.7),s(pe[2],51,5.4,-.3),s(pe[3],51,5,.45),s(pe[4],41,5.2,1),i(pe[5],.44,5),i(pe[6],.37,5.2),s(pe[7],60,16,-5))}const Mo=new u.CatmullRomCurve3(l0),Gt=y(),D0=y(),K0=(t,o)=>{const i=pe.length-1;if(t<=pe[0])o.copy(l0[0]).addScaledVector(Gt.copy(l0[0]).sub(l0[1]),(pe[0]-t)/(pe[1]-pe[0]));else if(t>=pe[i])o.copy(l0[i]).addScaledVector(Gt.copy(l0[i]).sub(l0[i-1]),(t-pe[i])/(pe[i]-pe[i-1]));else{let s=0;for(;s<i-1&&t>pe[s+1];)s++;Mo.getPoint((s+(t-pe[s])/(pe[s+1]-pe[s]))/i,o)}return o};let je;const Ot=1.5;je=new u.Mesh(ia(ee),Ue(oo,Po,It,{side:u.DoubleSide})),je.name="swimmer",je.scale.setScalar(Ot),K0(pe[2],je.position),je.frustumCulled=!1,Y.add(je),await r.yield();{const t=[],o=[],i=y().crossVectors($e,Je).normalize(),s=v=>{let m=4,p=1e9;for(let a=0;a<=80;a++){const e=Math.abs(ke[a*3]-v);e<p&&(p=e,m=ke[a*3+2])}return m};for(let v=0;v<60;v++){const m=$(-86,-50,ee()),p=s(m)+ee.range(1.5,3.2);t.push(m,3+ee.range(0,2),p,ee()),o.push(ee.range(.45,.8),20,.04,ee.range(.14,.24))}for(let v=0;v<150;v++){const m=$(3,38,Math.pow(ee(),.9)),p=Math.min(m/36,1.05),a=ee(),e=v%3!==0,c=e||a<.72?1:-1.25,n=e?ee.range(2,3.2)+4.5*z(22,38,m):(ee.range(2.6,4.2)+2.2*z(30,40,m))*c*(1+.5*p);t.push(He.x+$e.x*m+i.x*n,He.y+$e.y*m-(e?8:6.5),He.z+$e.z*m+i.z*n,ee()),o.push(ee.range(.4,.7),12.5,e?.1+.08*p:.04+.11*p,(e?.36+.3*p:.12+.6*p*p)*ee.range(.55,1))}for(const v of[0,2,1]){const m=R.flanges[v],p=Math.atan2(m.o[1],m.o[0]);for(let a=0;a<10;a++){const e=p+ee.range(-.45,.45),c=R.trunkRadius(e,m.yc-3)+ee.range(.9,2.6);t.push(Math.cos(e)*c,m.yc-7.2,Math.sin(e)*c,ee()),o.push(ee.range(.25,.4),6.7,.02,ee.range(.05,.09))}}const d=new u.BufferGeometry;d.setAttribute("position",Ve([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),d.setIndex([0,1,2,0,2,3]),p0(d,[["aB",t,4],["aB2",o,4]],t.length/4,Ue(Do,Ro,{uBubWarm:{value:Z?.36:.44}},{transparent:!0,depthWrite:!1}),"bubbles",2)}const Ht=new u.Vector2,zo={transparent:!0,depthWrite:!1,blending:u.CustomBlending,blendEquation:u.AddEquation,blendSrc:u.OneFactor,blendDst:u.OneMinusSrcAlphaFactor},jt={value:450},Kt=y(),$0=new u.BufferGeometry;$0.setAttribute("position",Ve([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),$0.setIndex([0,1,2,0,2,3]);{const t=[];for(const i of P0)i.smoker&&t.push(i.x,i.y+.25,i.z,ee());for(const i of v0)i.smoker&&t.push(i.x,i.y+.25,i.z,F());const o=p0($0,[["aE",t,4]],t.length/4,new u.ShaderMaterial({vertexShader:Yo,fragmentShader:Zo,uniforms:{uTime:G,uEmberC:Vt},transparent:!0,depthWrite:!1,blending:u.AdditiveBlending}),"embers",5);o.visible=t.length>0}const $t=(t,o,i)=>{const s=new Float32Array(t*4);for(let d=0;d<s.length;d++)s[d]=ee();return p0($0,[["aF",s,4]],t,Ue($o,Qo,{uBufH:jt,uFlocCol:{value:new u.Color(.85,.86,.82)},...o},zo),i,6)},Lo=J?y(2.6,-.05,.25):A?y(.55,-.14,.06):y(.5,-.08,.06),Q0={value:y()};$t(Math.min(3600,Math.round(2400*V*I*(A?1.4:1))),{uBox:{value:y(20,13,20)},uCen:{value:Kt},uVel:{value:Lo},uCamV:Q0,uStreak:{value:J?.03:.014},uSizeK:{value:A?1.3:1},uFlocI:{value:A?.66:.56},uReach:{value:A?11.5:9.5}},"floc"),await r.yield(),$t(Math.round((A?1300:900)*V),{uBox:{value:y(58,8,7)},uCen:{value:y(-74,6.4,3.2)},uVel:{value:y(J?1.6:.6,A?.7:.34,0)},uCamV:Q0,uStreak:{value:J?.02:.012},uSizeK:{value:3.2},uFlocI:{value:A?.95:.9},uReach:{value:40}},"fissure-floc");const g0=R.flanges[2],Qt={uRise:{value:0}},A0=.1,U0=y().fromArray(g0.at(g0.E(A0)*1.04,A0,g0.yc-2.3,[0,0,0])),Ut=[g0.o[0]*Math.cos(A0)+g0.t[0]*Math.sin(A0),g0.o[1]*Math.cos(A0)+g0.t[1]*Math.sin(A0)],c0=new u.Mesh(new u.SphereGeometry(1,30,22),Ue(Io,Go,Qt,{side:u.DoubleSide}));c0.name="mercury-bell",c0.frustumCulled=!1,c0.visible=H,c0.position.copy(U0),c0.scale.setScalar(.001),Y.add(c0),await r.yield();const F0=y(),So=new u.Matrix4,ct=y(),ko=oe-26/be,Ao=19.5/be,Fo=[{at:fo,from:0,to:Qe+.02,weight:1,fade:.02},{at:V0,from:Qe-.012,to:oe+.065,weight:1,fade:.075},{at,from:oe+.005,to:.95,weight:1,fade:.05},{at,from:oe+.005,to:.95,weight:1,fade:.05}];K0(0,F0);const R0=new u.PerspectiveCamera;ve.pointAt(0,d0),ve.tangentAt(0,pt),R0.position.copy(d0),R0.lookAt(d0.clone().add(pt)),R0.updateMatrixWorld(!0);const X0=y(),Xt=y(),Eo=t=>z(oe-.07,oe-.03,t)*(1-z(oe+.06,oe+.1,t)),Yt=(t,o,i,s)=>{G.value=o;const d=s>0?i:R0;R.update(t,o,d),d.getWorldPosition(X0),d.getWorldDirection(Xt),Kt.copy(X0).addScaledVector(Xt,6),s>0?ve.tangentAt(s,Q0.value).multiplyScalar(Mt(s*be)):Q0.value.set(0,0,0),r.renderer.getDrawingBufferSize(Ht),jt.value=Ht.y;const v=Math.max(1-z(q0-.04,q0,s),z(oe+.01,oe+.08,s)*(1-.45*z(Ae,Ae+.1,s)));ne.uSurvey.value=.8+.05*v+.22*Eo(s)+.15*z(oe+.08,oe+.14,s)*(1-z(Ae,Ae+.08,s));const m=z(Qe-.02,Qe+.03,s)*(1-z(ho+.03,tt-.01,s));ne.uSurvey.value+=.22*m;const p=z(Qe-.02,Qe+.03,s);qt.value=1+.5*(1-z(Qe-.03,Qe+.01,s))+1.3*p;const a=z(Qe-.07,Qe-.01,s)*(1-z(Lt,Lt+.07,s)),e=z(tt-.07,tt-.03,s)*(1-z(oe-.02,oe+.02,s));re.value=Math.max(a,$(.7,1.6,e)*p),S.value=(A?1.01:1)*$(.55,1,z(0,.004,s)),R.setTowerLight(.4+.6*Math.max(a,z(oe+.03,oe+.1,s))),Rt.value=1-z(oe+.03,oe+.11,s)*(1-z(Ae-.1,Ae-.045,s)),te.value=z(oe+.04,oe+.12,s)*(1-z(Ae+.02,Ae+.12,s)),R.setFieldRim(M0*(1+.35*p+.6*e+.95*z(Ae-.04,Ae+.04,s))),Dt.value=z(oe+.03,oe+.11,s)*(1-.55*z(Ae-.03,Ae+.05,s)),ne.uAbsorb.value.copy(vo).multiplyScalar($(.78,.6,v)-.1*m);const c=Math.max(1-z(q0-.04,q0,s),z(oe+.01,oe+.08,s));R.setSmokeRim((.45+.75*c)*(1+1.25*z(oe+.06,oe+.14,s))*$(.94,1.08,U)),R.setLander(null,null,null,Ft*(1-.4*z(Ae,Ae+.12,s)));for(let n=0;n<2;n++){const l=ne.uLandPos.value[n],h=ne.uLandDir.value[n],g=Tt.value[n];ct.copy(X0).sub(l);const w=ct.dot(h),L=.12+Math.max(w,0)*(n?.3:.2)*1.012,M=ct.addScaledVector(h,-w).length(),P=z(-2,-.6,w)*(1-z(g+.6,g+2,w));_t.value.setComponent(n,(1-z(L+.6,L+2,M))*P),Pt.value.setComponent(n,$(1,.3,(1-z(1.4,6,M/L))*P))}if(lt.uBurst.value=ue((s-et)/.012,0,3),K0(s,F0),K0(s+.006,D0).sub(F0),D0.lengthSq()>1e-8?D0.normalize():D0.set(1,0,0),F0.y+=.1*Math.sin(o*2.6-1.2),F0.x+=.1*Math.sin(o*.5),je.position.copy(F0),je.quaternion.setFromUnitVectors(Je,D0.multiplyScalar(.55).add(Je).normalize()),je.scale.setScalar(Ot*Math.max(.02,z(pe[0]-.09,pe[0]-.03,s)*(1-z(pe[7]+.02,pe[7]+.07,s)))),je.updateMatrixWorld(),It.uEyeL.value.copy(X0).applyMatrix4(So.copy(je.matrixWorld).invert()),H){const n=ue((s-ko)/Ao,0,1),l=z(0,.3,n)*(n<.999?1:0),h=4.6*z(0,.3,n)+1.2*n;c0.scale.setScalar(Math.max(.001,2.8*l)),c0.position.set(U0.x+Ut[0]*h+Wt*2*n*n,U0.y+1.6*n+14*z(.72,1,n)*z(.72,1,n),U0.z+Ut[1]*h),Qt.uRise.value=n}};return Yt(0,0,R0,0),{scene:Y,path:ve,duration:no,pace:zt,ride:"glass-dome",camera:{fov:75,near:.2,far:700,lookAhead:9,sway:.35,bank:0},pois:Fo,portal:{shape:"circle",radius:3.75,color:Oe[6],glow:.5,revealDistance:90,tilt:!0},post:{exposure:1.1,bloom:{strength:.5,radius:.6,threshold:.92},grade:{saturation:1.12,contrast:1.1,tint:Z?"#fff3e2":"#f1f6ff",shadowTint:"#040a14",vignette:.26,grain:.024,aberration:0}},update:Yt,dispose(){}}}};export{ua as default};
