import*as k from"three";const ie=["#F6F1E4","#8091AD","#36476A","#131C33","#F4DC3C","#EC6A94","#27B7B4","#DD2A1E","#7A5230"],A={PAPER:0,INK1:1,INK2:2,INK3:3,LEMON:4,ROSE:5,TURQ:6,SCARLET:7,SEPIA:8},D={uTime:{value:0},uProg:{value:0},uWashO:{value:new k.Vector3(0,0,300)},uWashD:{value:new k.Vector3(0,0,-1)},uFront:{value:new k.Vector4(90,-60,-60,60)},uPool:{value:0},uDamp:{value:1},uGran:{value:1},uSepia:{value:0},uSky2:{value:-300},uSky3:{value:-900},uSheen:{value:.86},uPx:{value:.0025},uPal:{value:ie.map(r=>new k.Color(r))}};function he(r){if(!r||!r.length)return;const e=D.uPal.value;if(r.length>=9){for(let s=0;s<9;s++)e[s].set(r[s]);return}const n=[0,1,3,4,5,6,7];for(let s=0;s<Math.min(7,r.length);s++)e[n[s]].set(r[s]);e[2].copy(e[1]).lerp(e[3],.68),r.length===7&&r[1].toUpperCase()==="#8091AD"&&r[2].toUpperCase()==="#131C33"&&e[2].set("#36476A")}const ee=`
uniform float uTime; uniform float uProg; uniform vec3 uWashO; uniform vec3 uWashD; uniform vec4 uFront;
uniform float uPool; uniform float uDamp; uniform float uGran; uniform float uPx; uniform float uSepia; uniform float uSheen; uniform float uSky2; uniform float uSky3; uniform vec3 uPal[9];
float fwFace = 0.0;                                                    // 0 on level paper .. 1 on an upright face (set by the paper shader before paperInk)
float fwHash(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float fwVn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(fwHash(i), fwHash(i + vec2(1., 0.)), f.x), mix(fwHash(i + vec2(0., 1.)), fwHash(i + vec2(1., 1.)), f.x), f.y); }
float fwTooth(vec2 p){ return 0.62 * fwVn(p * 9.0) + 0.38 * fwVn(p * 31.0 + 17.3); }
vec3 inkTone(float c){ c = clamp(c, 0.0, 3.0);
  vec3 a = mix(uPal[0], uPal[1], clamp(c, 0.0, 1.0)); a = mix(a, uPal[2], clamp(c - 1.0, 0.0, 1.0)); return mix(a, uPal[3], clamp(c - 2.0, 0.0, 1.0)); }
// one front: d = metres behind the lip (negative ahead). Returns (cover, wet, lip)
vec3 fwFront(float d, vec2 sl){
  float finger = mix(4.2, 1.3, uDamp);                               // dry-brush fingers 1 to 3 m long
  float streak = fwVn(vec2(sl.y * 2.3, sl.x * 0.22)) * 0.75 + fwVn(vec2(sl.y * 7.0, sl.x * 0.6)) * 0.25; // long along the travel, narrow across
  float zone = clamp(-d / finger, 0.0, 1.0);                         // 0 at the solid lip, 1 at the finger tips
  float cover = d > 0.0 ? 1.0 : step(zone * 0.9 + 0.12, streak) * step(zone, 0.999);
  cover *= mix(1.0, step(0.34, fwTooth(sl * 0.6)), zone);            // fingers skip the paper's tooth
  float wet = cover * (1.0 - smoothstep(uFront.w * 0.55, uFront.w, d));
  return vec3(cover, wet, cover * (1.0 - clamp(d / 1.5, 0.0, 1.0)));
}
vec4 coats(vec3 wp, float base){
  vec3 r = wp - uWashO; float s = dot(r, uWashD);
  vec3 lat = cross(uWashD, vec3(0., 1., 0.)); float l = dot(r, lat) + r.y * 0.35;
  vec2 sl = vec2(s, l);
  float wob = (fwVn(vec2(l * 0.06, 3.1)) - 0.5) * 9.0 + (fwVn(vec2(l * 0.31, 9.7)) - 0.5) * 2.4;   // the lip is a hand's line, never straight
  // coat 1: dry from the first frame, everything beyond its fringed edge
  float d1 = s - uFront.x + wob * 0.6;
  float c1 = d1 > 0.0 ? 1.0 : step(clamp(-d1 / 2.2, 0.0, 1.0) * 0.9 + 0.15, fwVn(vec2(l * 2.6, s * 0.2))) * step(-2.2, d1);
  vec3 f2 = fwFront(uFront.y + wob - s, sl + 40.0);
  vec3 f3 = fwFront(uFront.z + wob * 1.3 - s, sl + 91.0);
  float c = base + c1 + f2.x + f3.x;
  float back = max(uFront.z + wob * 1.3 - s, 0.0) * f3.x + (1.0 - f3.x) * max(uFront.y + wob - s, 0.0);
  return vec4(min(c, 3.0), max(f2.y, f3.y), max(f2.z, f3.z), back);
}
// the drying-edge fringe of coat 1: a turquoise line and a sepia line (returns rgb, a)
vec4 fwEdgeFringe(vec3 wp, float lw){
  vec3 r = wp - uWashO; float s = dot(r, uWashD); float l = dot(r, cross(uWashD, vec3(0., 1., 0.))) + r.y * 0.35;
  float wob = (fwVn(vec2(l * 0.06, 3.1)) - 0.5) * 9.0 + (fwVn(vec2(l * 0.31, 9.7)) - 0.5) * 2.4;
  float d1 = s - uFront.x + wob * 0.6;
  // lw >= 1 widens both lines so that the dried edge stays a drawn line of a few pixels however far off and however flat it lies
  float brk = step(0.22, fwVn(vec2(l * 0.55, 1.7))) * mix(1.0, step(0.3, fwVn(vec2(l * 3.1, s * 0.4))), step(lw, 1.5));
  float t = 1.0 - smoothstep(0.05 * lw, 0.16 * lw, abs(d1 - 0.12 * lw)); float sp = 1.0 - smoothstep(0.04 * lw, 0.13 * lw, abs(d1 - 0.42 * lw));
  if (lw > 1.5) { t = step(0.5, t); sp = step(0.5, sp); }
  return vec4(mix(uPal[6], uPal[8], max(step(t, sp), uSepia)), max(t, sp) * brk * (0.75 + 0.25 * uSepia));
}
vec3 paperInk(vec3 wp, float base, float viewDist, float grazing, float gloss){
  vec4 k = coats(wp, base);
  float pooled = gloss * step(2.5, k.x);                             // pooled ink never dries: no tooth, all sheen
  k.y = max(k.y, pooled);
  float near = 1.0 - smoothstep(18.0, 60.0, viewDist);               // granulation is gone (its flat average) by 60 m
  vec2 tp = wp.xz + wp.y * vec2(0.37, 0.71);
  float fineA = 1.0 - smoothstep(0.008, 0.03, viewDist * uPx);      // the tooth itself, only while a pixel is finer than it
  float spk = smoothstep(0.38, 0.62, fwTooth(tp * 2.3)) - 0.5;
  float inked = min(k.x, 1.0);
  float sAx = dot(wp - uWashO, uWashD);
  float lAx = dot(wp - uWashO, cross(uWashD, vec3(0., 1., 0.)));
  float soft = (fwVn(tp * vec2(0.5, 1.1)) - 0.5) * 0.2 * near;
  // an upright face is washed in level bands that overlap with a hard, hand-uneven edge (never a soft streak)
  float hb = wp.y * 0.45 + 0.8 * fwVn(vec2(sAx * 0.13, lAx * 0.13 + 4.0)) + 0.35 * fwVn(vec2(sAx * 0.55 + 9.0, lAx * 0.55));
  float hard = (step(0.5, fract(hb)) - 0.5) * 0.22 * (1.0 - smoothstep(70.0, 150.0, viewDist));
  float gran = (spk * 0.55 * fineA + mix(soft, hard, fwFace)) * uGran * inked * (1.0 - 0.75 * k.y);   // dry: pigment settles in the tooth; wet: smooth
  float c = k.x + gran + 0.5 * k.y * inked;                          // wet ink is a step darker than it dries
  // wash bands overlap: level brush bands a few metres wide, a tenth of a coat apart
  c += (step(0.5, fwVn(vec2(sAx / 8.0, lAx / 95.0))) - 0.5) * 0.07 * inked * (1.0 - k.y) * (1.0 - smoothstep(70.0, 200.0, viewDist));   // overlapping level brush bands
  vec3 col = inkTone(c);
  // the drawn sheen: one hard pale band at grazing angles while wet
  float band = step(0.55, fwVn(vec2(sAx * 0.9, dot(wp, cross(uWashD, vec3(0., 1., 0.))) * 0.07) + vec2(-uTime * 0.16, uTime * 0.05)));   // the sheen creeps on downhill with the wash
  float shEdge = uSheen + 0.045 + (fwVn(vec2(lAx * 0.33, sAx * 1.7 + 5.0)) - 0.5) * 0.085 + (fwVn(vec2(lAx * 1.9 + 3.0, sAx * 6.0)) - 0.5) * 0.02;   // the lip of the sheen: a hand's edge, hard
  col = mix(col, uPal[1], 0.55 * step(0.3, k.y) * band * step(shEdge, grazing) * inked * (1.0 - pooled));
  float rip = fwVn(vec2(sAx * 0.16 + uTime * 0.07, dot(wp, cross(uWashD, vec3(0., 1., 0.))) * 1.1 + sin(sAx * 0.8 + uTime * 0.9) * 0.25));
  col = mix(col, uPal[2], pooled * step(0.74, rip) * step(0.945 + (fwVn(vec2(lAx * 0.21, sAx * 0.9 + 2.0)) - 0.5) * 0.05, grazing));   // gloss: thin level strokes of the paler coat, wavering
  vec4 fr = fwEdgeFringe(wp, clamp(6.0 * viewDist * uPx / (0.6 * max(1.0 - grazing, 0.03)), 1.0, 34.0));
  col = mix(col, fr.rgb, fr.a * (1.0 - min(k.x - base - 1.0, 1.0) * 0.6) * step(k.x - base, 1.5) * (1.0 - fwFace));
  return col;
}
`,de=`
varying vec3 vW; varying vec3 vN;
void main(){ vec4 w = modelMatrix * vec4(position, 1.0);
#ifdef USE_INSTANCING
  w = modelMatrix * instanceMatrix * vec4(position, 1.0);
  vN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal + vec3(0., 1e-5, 0.));
#else
  vN = normalize(mat3(modelMatrix) * normal + vec3(0., 1e-5, 0.));
#endif
  vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,ue=`
uniform float uBase; uniform float uGloss; varying vec3 vW; varying vec3 vN;
void main(){ vec3 v = cameraPosition - vW; float d = length(v); vec3 vd = v / max(d, 1e-4);
  vec3 nn = normalize(vN); float graz = 1.0 - abs(dot(nn, vd)); fwFace = 1.0 - smoothstep(0.3, 0.6, abs(nn.y));
  gl_FragColor = vec4(paperInk(vW, uBase, d, graz, uGloss), 1.0); }`;function oe(r={}){return new k.ShaderMaterial({uniforms:{...D,uBase:{value:r.base??0},uGloss:{value:r.gloss??0}},vertexShader:de,fragmentShader:ee+ue,side:r.side??k.FrontSide})}const pe=`
uniform vec4 uBackrun[3]; varying vec3 vDir;
void main(){ vec3 dir = vDir / max(length(vDir), 1e-4);
  float el = clamp(dir.y, -1.0, 1.0);
  vec3 lat = cross(uWashD, vec3(0., 1., 0.));
  float along = dot(dir, uWashD), across = dot(dir, lat);
  float k = 70.0 / (max(el, 0.0) + 0.28);
  vec3 wp = vec3(0.); wp = uWashO + uWashD * (dot(cameraPosition - uWashO, uWashD) + along * k) + lat * (dot(cameraPosition - uWashO, lat) + across * k);
  // the second and third coats cross the sky ahead of the ground fronts (uSky2, uSky3: metres ahead of the eye in this
  // projection): overhead as the lip passes under us, down to the far horizon soon after, so the fountains leap out
  // against two coats and the night ends blue-black above its paler foot. Their lips are fingered like the ground's.
  vec2 skl = vec2(along * k, across * k) / 7.0; float swob = (fwVn(vec2(across * 2.6, 7.7)) - 0.5) * 46.0;
  vec3 f2s = fwFront((uSky2 - along * k + swob) / 7.0, skl + 47.0), f3s = fwFront((uSky3 - along * k - swob * 0.8) / 7.0, skl + 13.0);
  float s3 = f3s.x; vec4 c4 = vec4(1.0 + f2s.x + f3s.x, max(f2s.y, f3s.y), 0.0, 0.0);
  float c = c4.x;                                                     // the sky has its first coat from the first frame
  float bandN = fwVn(vec2(across * 1.5, el * 40.0));
  c += (step(0.5, fract(el * 11.0 + bandN * 0.6)) - 0.5) * 0.09;      // wide level brush bands, overlapping
  c -= 0.85 * (1.0 - smoothstep(0.02, 0.17, el + (bandN - 0.5) * 0.03)) * step(1.5, c);   // one coat paler near the horizon
  c -= 0.18 * (1.0 - smoothstep(0.0, 0.2, el)) * (1.0 - step(1.5, c));                    // the first coat thins toward the horizon
  float zb = 2.0 - smoothstep(0.0, 0.035, abs(el - 0.80 - (bandN - 0.5) * 0.05)) - smoothstep(0.0, 0.03, abs(el - 0.66 - (fwVn(vec2(across * 2.3, 5.)) - 0.5) * 0.06));
  c += 0.9 * min(zb, 1.0) * s3;                                       // third coat pooled in two long bands
  c += 0.4 * c4.y;
  // backruns: where fresh wash met damp. Paler inside, a dark crinkled hard edge. They stand for smoke.
  float px = max(fwidth(el), 1e-5);
  for (int i = 0; i < 3; i++){
    vec3 bd = uBackrun[i].xyz; vec3 q = dir - bd; float rr = uBackrun[i].w;
    vec3 bu = normalize(cross(bd, vec3(0., 1., 0.)) + vec3(1e-4, 0., 0.)); vec3 bv = cross(bu, bd); vec2 q2 = vec2(dot(q, bu), dot(q, bv) * 1.5) / max(rr, 1e-4);
    float rad = length(q2); vec2 qd = q2 / max(rad, 1e-4);
    float ang = atan(q2.y, q2.x + sign(q2.x + 1e-6) * 1e-5), wv = fwVn(qd * 1.3 + float(i) * 9.1 + 4.0);
    float lobe = sqrt(abs(sin(ang * 2.5 + float(i) * 2.1 + 5.5 * wv))), lobe2 = sqrt(abs(sin(ang * 8.0 + 7.0 * fwVn(qd * 3.1 + float(i) * 3.3))));
    float cr = 0.42 + 0.34 * wv + 0.2 * lobe + 0.07 * lobe2;
    float inside = step(rad, cr);
    float edge = inside * step(cr - 0.045 - 0.03 * lobe2, rad);                     // the pigment line the bloom pushed out: dark, hard
    float inner = step(cr * (0.5 + 0.16 * lobe2 + 0.12 * wv), rad);                 // a second, smaller bloom inside: two flat steps, no gradient
    c += (edge * 0.75 - inside * (1.0 - edge) * (0.42 + 0.4 * inner)) * step(1.5, c4.x) * step(1e-4, rr);
  }
  vec3 col = inkTone(c);
  // stars: candle dots the ink could not wet, each with a dark bead beside it
  vec2 sp = dir.xz / (1.0 + max(el, -0.5)) * 34.0; vec2 ci = floor(sp), cf = fract(sp);
  float h = fwHash(ci), h2 = fwHash(ci + 7.7);
  vec2 sc = vec2(0.25 + 0.5 * h2, 0.25 + 0.5 * fwHash(ci + 3.1));
  float spx = max(fwidth(sp.x), 1e-5);
  float sr = max(0.035 + 0.05 * h2, 1.1 * spx);
  float star = step(0.52, h) * (1.0 - smoothstep(sr - spx, sr, length(cf - sc) + (fwVn(sp * 9.0) - 0.5) * 0.03));
  float bead = step(0.52, h) * (1.0 - smoothstep(sr * 0.55 - spx, sr * 0.55, length(cf - sc - vec2(sr * 1.25, -sr * 0.9))));
  float vis = smoothstep(0.03, 0.12, el);
  col = mix(col, uPal[3], bead * vis * step(1.5, c4.x));
  col = mix(col, uPal[0], star * vis);
  gl_FragColor = vec4(col, 1.0); }`;function we(r={}){const e=r.backruns??[new k.Vector4(-.33,.42,-.84,.16),new k.Vector4(.1,.55,-.83,.12),new k.Vector4(.42,.36,-.83,.2)];return new k.ShaderMaterial({uniforms:{...D,uBackrun:{value:e}},vertexShader:"varying vec3 vDir; void main(){ vDir = position; vec4 p = projectionMatrix * viewMatrix * vec4(position + cameraPosition, 1.0); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }",fragmentShader:ee+pe,side:k.BackSide,depthWrite:!1,depthTest:!1})}const ve=`
attribute vec3 iA; attribute vec3 iB; attribute vec3 iC; attribute vec4 iN; attribute vec4 iK; attribute vec4 iS; attribute vec4 iSpin;
uniform float uPass; uniform vec4 uSpin; uniform float uMargin; uniform float uThin; uniform float uMinPx;
varying vec2 vUV; varying vec3 vCol; varying vec2 vRange; varying vec4 vDim; varying vec4 vMisc; varying vec3 vW; varying float vFade; varying float vFlat; varying float vFlat2; varying float vPer;
vec3 fwRot(vec3 p, vec3 piv, vec3 ax, float a){ vec3 r = p - piv; float c = cos(a), s = sin(a); return piv + r * c + cross(ax, r) * s + ax * dot(ax, r) * (1.0 - c); }
void main(){
  float t = position.x, side = position.y;
  vec3 A = iA, B = iB, C = iC;
  if (uSpin.w > 0.5) { float a = iSpin.w * uTime; A = fwRot(A, iSpin.xyz, uSpin.xyz, a); B = fwRot(B, iSpin.xyz, uSpin.xyz, a); C = fwRot(C, iSpin.xyz, uSpin.xyz, a); }
  A = (modelMatrix * vec4(A, 1.0)).xyz; B = (modelMatrix * vec4(B, 1.0)).xyz; C = (modelMatrix * vec4(C, 1.0)).xyz;
  float Lc = length(B - A) + length(C - B);
  float it = 1.0 - t;
  vec3 P = it * it * A + 2.0 * it * t * B + t * t * C;
  vec3 T = 2.0 * it * (B - A) + 2.0 * t * (C - B) + (C - A) * 1e-3;
  T = T / max(length(T), 1e-5);
  vec3 toEye = cameraPosition - P; float dist = length(toEye);
  float pxm = dist * uPx;
  P += T * (t - 0.5) * max(0.0, 1.6 * pxm - Lc);                        // never shorter than a pixel and a half either
  vec3 nrm = iN.xyz; float fixedN = step(0.25, dot(nrm, nrm));
  vec3 sv = cross(T, mix(toEye, mat3(modelMatrix) * nrm, fixedN));
  sv = sv / max(length(sv), 1e-5);
  // draw clock
  float kind = iK.y, e = 0.0, r = 1.0;
  if ((kind > 0.5 && kind < 1.5) || (kind > 3.5 && kind < 4.5)) { float per = max(iK.w, 0.2); float x = fract(uTime / per + iK.z); float lay = min(clamp(Lc / 13.0, 0.12, 0.7) / per, 0.45);          // laid at hand speed: 13 m a second, a dab pressed in an eighth
    float endAt = (iS.w > 0.0 && kind < 3.5) ? iS.w : 1.0;                               // iS.w: lifted early (a willow's strokes all go with their rocket)
    r = smoothstep(0.0, lay, x); e = smoothstep(endAt - lay, endAt, x); }
  else if (kind > 1.5 && kind < 2.5) { r = smoothstep(iK.z, max(iK.w, iK.z + 1e-3), uProg); }
  else if (kind > 2.5 && kind < 3.5) { float w = max(iK.w, 1e-3); r = smoothstep(iK.z, iK.z + w, uProg); e = smoothstep(iK.z + 8.0 * w, iK.z + 9.0 * w, uProg); }
  float gate = 1.0;
  if (kind > 3.5) { float dA = length(cameraPosition - A);
    if (kind < 4.5) r *= 1.0 - smoothstep(iS.w * 0.72, max(iS.w, 1.0), dA);      // laid base to tip as the eye comes within reach
    else gate = smoothstep(iK.z, max(iK.w, iK.z + 1.0), dA); }                  // a far mark: the bold stroke that stands for a crowd of fine ones
  float live = step(e + 0.002, r);
  // width: never under 1.5 pixels; the pooled margin shrinks to nothing once the stroke is a pixel wide
  float W = iN.w; float zig = iS.y;
  // a crowd of strokes thins with distance (by seed) so it stays separate marks about 2.5 px apart, never a solid sheet
  float keep = uThin > 0.0 ? clamp(uThin / max(pxm * 2.5, 1e-4), 0.0, 1.0) : 1.0;
  live *= 1.0 - smoothstep(keep * 0.85, keep * 1.15 + 0.01, fract(iS.x * 7.31 + 0.137));
  float far = clamp((0.75 * pxm - 0.5 * W) / max(W, 1e-4), 0.0, 1.0);
  // a mark lying flat is foreshortened at a grazing angle: a batch built with minPx over 1 widens it on its surface so
  // that it never shows thinner than that on screen (far rows of broderie merge to fewer, bolder strokes, not speckle)
  float fs = 1.0; if (fixedN > 0.5 && uMinPx > 1.01) fs = max(length(cross(sv, toEye / max(dist, 1e-4))), 0.06);
  float Wd = max(W, uMinPx * pxm / fs);
  float M = mix(uMargin, 1.08, far);
  float R = (Wd + zig) * M * live * gate * smoothstep(1.0, 1.7, dist);       // strokes within 1.2 m of the lens scale to zero
  vec3 wp = P + sv * side * R;
  wp -= toEye / max(dist, 1e-4) * (1.0 - uPass) * 0.012;              // the pooled pass sits a hair behind the wax
  float L = Lc;
  vUV = vec2(t, side); vRange = vec2(e, r); vDim = vec4(L, Wd, max(R, 1e-5), zig); vMisc = vec4(iS.x, pxm, far, iS.z); vW = wp; vPer = iS.w;
  float ci = floor(iK.x + 1e-3); float cf = iK.x - ci;
  vCol = uPal[int(ci)]; vFade = clamp(t * cf * 4.0, 0.0, 1.0); vFlat = fixedN * step(ci, 0.5); vFlat2 = fixedN;
  vec4 clip = projectionMatrix * viewMatrix * vec4(wp, 1.0);
  gl_Position = clip; }`,me=`
uniform float uPass; varying vec2 vUV; varying vec3 vCol; varying vec2 vRange; varying vec4 vDim; varying vec4 vMisc; varying vec3 vW; varying float vFade; varying float vFlat; varying float vFlat2; varying float vPer;
void main(){
  if (vUV.x < vRange.x || vUV.x > vRange.y) discard;
  float L = vDim.x, W = vDim.y, R = vDim.z, zig = vDim.w, seed = vMisc.x, pxm = vMisc.y, far = vMisc.z;
  float x = vUV.x * L, y = vUV.y * R, band = 0.0, zmin = 0.0;
  if (zig > 0.0) {                                                     // a hand's zigzag: uneven pitch and swing, wavering on the ink
    float per = (vPer > 0.05 ? vPer : 0.85) * (0.75 + 0.6 * fwVn(vec2(seed * 40.0, 1.0)));     // vPer: a lazier, broader wave where the hand asks for one
    float fx = max(fwidth(x), 1e-5), fy = max(pxm, 1e-5);              // metres to a pixel along the stroke (it lies flat: foreshortened) and across it
    float ph = x / per + seed * 7.0 + 0.55 * fwVn(vec2(x * 0.45, seed * 23.0));
    float tr0 = abs(fract(ph) - 0.5) * 4.0 - 1.0, tri = tr0 * (1.5 - 0.5 * tr0 * tr0);                    // the turns are round, not points
    // seen end-on a zigzag stays a lazy wave (its swing never more than 0.7 of the pitch it shows), and where its turns
    // would be finer than a few pixels it is its flat average: one narrow band of the wax, a column of light. No sawteeth.
    float fz = smoothstep(3.0, 9.0, per / fx);
    float amp = min(zig * (0.45 + 0.55 * fwVn(vec2(x * 0.3 + 3.0, seed * 71.0))), 0.7 * per * fy / fx) * (0.8 + 0.2 * sin(uTime * 1.3 + seed * 40.0 + x * 0.4));
    band = zig * (1.0 - fz) * (0.3 + 0.3 * fwVn(vec2(x * 0.5 + 9.0, seed * 53.0)));
    y += 0.07 * sin(uTime * 0.8 + x * 0.6 + seed * 20.0);
    float slope = 6.0 * amp / per * (1.0 - tr0 * tr0), c2 = 1.0 / (1.0 + slope * slope);
    zmin = 2.6 * sqrt(c2 * fy * fy + (1.0 - c2) * fx * fx);            // the line never under about 5 px, whichever way it runs across the ink
    y = (y - amp * tri) * sqrt(c2); }
  float fine = 1.0 - smoothstep(0.02, 0.07, pxm);                    // tooth finer than ~3 px becomes its flat average
  float press = 0.70 + 0.30 * fwVn(vec2(x * 1.4 + seed * 31.0, seed * 57.0));
  float cap = min(W * 1.6, L * 0.3);
  float ends = clamp(x / max(cap, 1e-4), 0.0, 1.0) * clamp((vRange.y * L - x) / max(cap, 1e-4) + 0.25, 0.0, 1.0) * clamp((L - x) / max(cap, 1e-4), 0.0, 1.0);
  float fat = mix(1.12, 0.78, clamp(x / max(min(L, 1.2), 1e-4), 0.0, 1.0));            // fat where it was pressed, thinner where it lifted
  float hw = (max(W * press * fat, zmin) + band) * sqrt(clamp(ends, 0.0, 1.0));
  float edgeN = (fwTooth(vec2(x, y) * 1.7 + seed * 13.0) - 0.5) * W * 0.9 * mix(0.25, 1.0, fine);
  float d = abs(y) - hw + edgeN;
  float tooth = fwTooth(vec2(x * 0.55, y * 3.4) + seed * 3.0);        // the crayon skips the tooth in streaks along the stroke
  float hole = step(0.55 + 0.36 * press, tooth + 0.5 * (1.0 - step(0.16, fwVn(vec2(x * 0.7 + seed * 17.0, seed * 91.0))))) * fine;
  float wax = step(d, 0.0) * (1.0 - hole);
  vec4 k = coats(vW, 0.0); float inked = min(k.x, 1.0);
  if (uPass > 0.5) {
    if (wax < 0.5) discard;
    // a second crayon over the first: candle white takes over through the tooth, never as a gradient
    vec3 col = mix(vCol, uPal[0], mix(vFade, step(fwTooth(vec2(x * 0.9, y * 2.0) * 1.3 + seed * 29.0) * 0.8 + 0.1, vFade), fine));
    // on bare paper a candle mark is seen only by its tooth: flecks of the palest wash caught along its edges
    // (all over it, densest along its edges; farther off than the tooth can be seen, their flat average)
    if (vFlat > 0.5 && inked < 0.5) col = mix(col, uPal[1], mix(0.4, step(0.5, fwTooth(vec2(x * 1.3, y * 2.2) * 2.4 + seed * 7.0)) * mix(0.6, 1.0, step(-W * 0.6, d)), fine));
    // beads: the ink stands on the wax in droplets, each with a paper-white window; they swell behind the lip and some roll
    float amt = vMisc.w * k.y * fine * smoothstep(0.3, 5.0, k.w);
    if (amt > 0.01) {
      for (int i = 0; i < 2; i++) {
        float fi = float(i); vec2 bp = vec2(x - fi * uTime * 0.11 * uDamp, y) / mix(0.12, 0.085, fi) + seed * 19.0 + fi * 5.3;
        vec2 id = floor(bp), f = fract(bp) - 0.5; float h = fwHash(id + fi * 3.7), h2 = fwHash(id + 11.1);
        float rad = (0.16 + 0.26 * h2) * amt * mix(0.6, 1.0, uDamp) * step(0.45 + 0.2 * fi, h);
        vec2 q = f - (vec2(h2, h) - 0.5) * 0.3; float bd = length(q);
        if (bd < rad) { col = uPal[3]; if (abs(q.x + rad * 0.32) < rad * 0.22 && abs(q.y - rad * 0.3) < rad * 0.2) col = uPal[0]; }
      }
    }
    gl_FragColor = vec4(col, 1.0);
  } else {
    if (wax > 0.5 || far > 0.98) discard;
    float F = max(R - W, 1e-4) * 0.85; float q = clamp(1.0 - d / F, 0.0, 1.0);
    float wet = k.y;
    float puddle = step(1.0 - q, 0.22 + 0.34 * fwVn(vec2(x, y) * 4.0 + seed * 5.0) + 0.1 * fwVn(vec2(x, y) * 13.0 + seed * 9.0));      // the pool has a hard crinkled shore
    float a = inked * puddle * step(0.25, wet + 0.5 * step(k.x, 1.5));
    vec3 col = inkTone(min(k.x + 1.0 + 0.5 * k.y, 3.0));                                   // one flat tone: a coat deeper than the wash it stands in
    // on bare paper the wax is seen by its tooth shadow: flecks of the palest wash caught against its edge, a flat tone, broken
    float shade = (1.0 - inked) * step(0.4, q) * mix(0.55, step(0.3, fwTooth(vec2(x * 1.3, y * 2.2) * 1.6 + seed * 7.0)), fine) * step(0.5, vFlat2);
    if (shade > 0.5) { a = 1.0; col = uPal[1]; }
    // dry: the pool leaves a turquoise line and a sepia line
    float tl = (1.0 - smoothstep(0.05, 0.14, abs(q - 0.72))) * fine * (1.0 - 0.7 * uSepia), sl = (1.0 - smoothstep(0.03, mix(0.16, 0.075, uSepia), abs(q - mix(0.4, 0.3, uSepia)))) * fine;
    float dry = (1.0 - wet) * inked * step(mix(0.4, 0.27, uSepia), fwVn(vec2(x * mix(0.9, 1.6, uSepia) + seed * 9.0, 2.0)));
    col = mix(col, uPal[6], tl * dry); a = max(a, tl * dry * 0.7);
    col = mix(col, uPal[8], sl * dry * (1.0 - tl)); a = max(a, sl * dry * (0.6 + 0.25 * uSepia));
    if (a < 0.03) discard;
    gl_FragColor = vec4(col * a, a);
  }
}`;function se(r={}){const e=r.pass??1,n=r.spinAxis,s=new k.ShaderMaterial({uniforms:{...D,uPass:{value:e},uMargin:{value:e?1.12:r.margin??2.4},uSpin:{value:n?new k.Vector4(n.x,n.y,n.z,1):new k.Vector4(0,0,1,0)},uThin:{value:r.spacing??0},uMinPx:{value:r.minPx??.75}},vertexShader:ee+ve,fragmentShader:ee+me,side:k.DoubleSide});return e||(s.transparent=!0,s.depthWrite=!1,s.blending=k.CustomBlending,s.blendSrc=k.OneFactor,s.blendDst=k.OneMinusSrcAlphaFactor,s.blendSrcAlpha=k.OneFactor,s.blendDstAlpha=k.OneMinusSrcAlphaFactor),s}function xe(r){const e=new Float32Array((r+1)*2*3),n=[];for(let c=0;c<=r;c++)e[c*6]=c/r,e[c*6+1]=-1,e[c*6+3]=c/r,e[c*6+4]=1;for(let c=0;c<r;c++){const i=c*2;n.push(i,i+1,i+2,i+1,i+3,i+2)}const s=new k.BufferGeometry;return s.setAttribute("position",new k.BufferAttribute(e,3)),s.setIndex(n),s}class H{constructor(e=1024){this.cap=e,this.n=0,this._alloc(e)}_alloc(e){const n=this.A,s=(c,i)=>{const u=new Float32Array(e*i);n&&u.set(this[c].subarray(0,this.n*i)),this[c]=u};s("A",3),s("B",3),s("C",3),s("N",4),s("K",4),s("S",4),s("P",4),this.cap=e}stroke(e,n,s,c){this.n>=this.cap&&this._alloc(this.cap*2);const i=this.n++,u=i*3,t=i*4;this.A[u]=e[0],this.A[u+1]=e[1],this.A[u+2]=e[2],this.C[u]=s[0],this.C[u+1]=s[1],this.C[u+2]=s[2],n?(this.B[u]=n[0],this.B[u+1]=n[1],this.B[u+2]=n[2]):(this.B[u]=(e[0]+s[0])/2,this.B[u+1]=(e[1]+s[1])/2,this.B[u+2]=(e[2]+s[2])/2);const y=c.n;y&&(this.N[t]=y[0],this.N[t+1]=y[1],this.N[t+2]=y[2]),this.N[t+3]=c.w??.08,this.K[t]=c.col??0,this.K[t+1]=c.kind??0,this.K[t+2]=c.k0??0,this.K[t+3]=c.k1??1,this.S[t]=c.seed??.5,this.S[t+1]=c.zig??0,this.S[t+2]=c.bead??1,this.S[t+3]=c.hold??0;const h=c.pivot;return h&&(this.P[t]=h[0],this.P[t+1]=h[1],this.P[t+2]=h[2],this.P[t+3]=c.spin??0),i}build(e={}){const n=this.n,s=new k.InstancedBufferGeometry,c=xe(e.segs??1);s.setAttribute("position",c.getAttribute("position")),s.setIndex(c.getIndex());const i=(h,g,z)=>s.setAttribute(h,new k.InstancedBufferAttribute(g.subarray(0,n*z),z));i("iA",this.A,3),i("iB",this.B,3),i("iC",this.C,3),i("iN",this.N,4),i("iK",this.K,4),i("iS",this.S,4),i("iSpin",this.P,4),s.instanceCount=n;const u=new k.Box3;for(let h=0;h<n*3;h+=3)u.expandByPoint(ne.set(this.A[h],this.A[h+1],this.A[h+2])),u.expandByPoint(ne.set(this.C[h],this.C[h+1],this.C[h+2])),u.expandByPoint(ne.set(this.B[h],this.B[h+1],this.B[h+2]));s.boundingSphere=new k.Sphere,u.getBoundingSphere(s.boundingSphere),s.boundingSphere.radius+=2+(e.pad??0),s.boundingBox=u;const t=new k.Group;if(e.fringe){const h=new k.Mesh(s,se({pass:0,margin:e.margin,spinAxis:e.spinAxis,spacing:e.spacing,minPx:e.minPx}));h.renderOrder=(e.renderOrder??2)-1,t.add(h)}const y=new k.Mesh(s,se({pass:1,spinAxis:e.spinAxis,spacing:e.spacing,minPx:e.minPx}));return y.renderOrder=e.renderOrder??2,t.add(y),t.userData.count=n,t}}const ne=new k.Vector3;function re(r){let e=r%2147483647||7;const n=()=>(e=e*16807%2147483647,e/2147483647);return n.range=(s,c)=>s+(c-s)*n(),n.chance=s=>n()<s,n.sign=()=>n()<.5?-1:1,n}function te(r,e){const n=[0,0,0],s=[0,0,0],c={count:0,batch:r,run(i,u,t={}){const y=(t.pitch??.38)/(c.density??1),h=Math.max(1,Math.round(u/y)),g=t.per??e.range(2.3,2.9),z=t.ph??e(),a=g*(t.hand??9),l=e.sign(),f=t.w??.115,v=t.jit??.07,M=t.white??.25,S=t.col??A.LEMON;for(let o=0;o<h;o++){const p=(o+.5+e.range(-.3,.3))*(u/h),m=e.range(.25,.4)*(t.len??1);if(t.turn&&e.chance(.1))continue;i(Math.max(0,p-m*.5),n),i(Math.min(u,p+m*.5),s);let x=s[0]-n[0],d=s[1]-n[1],b=s[2]-n[2];const E=Math.hypot(x,d,b)||1;x/=E,d/=E,b/=E;const W=e.range(-.5,.5)*(t.turn??1),V=-d,P=x,N=e.range(-v,v),T=m*.5,K=(n[0]+s[0])/2+V*N,Q=(n[1]+s[1])/2+P*N,U=(n[2]+s[2])/2+(Math.abs(b)>.7?0:e.range(-v,v)),$=x+V*W,Y=d+P*W,w=e.chance(.5)?1:-1;r.stroke([K-$*T*w,Q-Y*T*w,U-b*T*w],null,[K+$*T*w,Q+Y*T*w,U+b*T*w],{w:f*e.range(.75,1.3),col:e.chance(M)?A.PAPER:S,kind:t.kind??1,k0:(z+l*p/a+100)%1,k1:g,seed:e(),bead:t.bead??1,hold:t.hold??0})}c.count+=h},line(i,u,t,y,h,g,z){const a=Math.hypot(y-i,h-u,g-t);a<.05||c.run((l,f)=>{const v=l/a;f[0]=i+(y-i)*v,f[1]=u+(h-u)*v,f[2]=t+(g-t)*v},a,z)},arc(i,u,t,y,h,g,z,a){const l=Math.abs(z-g)*(y+h)*.5;l<.05||c.run((f,v)=>{const M=g+(z-g)*(f/l);v[0]=i+Math.cos(M)*y,v[1]=u+Math.sin(M)*h,v[2]=t},l,a)},spiral(i,u,t,y,h,g,z,a){const l=Math.abs(z-g)*(y+h)*.5;c.run((f,v)=>{const M=f/l,S=g+(z-g)*M,o=y+(h-y)*M;v[0]=i+Math.cos(S)*o,v[1]=u+Math.sin(S)*o,v[2]=t},l,a)}};return c}async function ge(r,e,n,s){const c={white:.9},i={white:.12},u={white:.35},t=[[0,8,14]];for(const o of[-1,1])for(const p of[18.5,32.5,46.5])t.push([o*p,4.5,10.5]);const y=t.map(o=>[o[0]-o[1],o[0]+o[1]]).sort((o,p)=>o[0]-p[0]);let h=-60;for(const[o,p]of y.concat([[60,60]]))e.line(h,.45,0,o,.45,0,i),e.line(h,1.4,0,o,1.4,0,u),h=p;await r.yield();for(const[o,p,m]of t){const x=p>6,d={w:.074,len:1.55,pitch:.47,jit:.09,turn:1.15,hold:.8,hand:3.2,per:void 0},b=P=>x?{...P,...d,per:1.7+.9*n()}:P;for(const P of[-1,1])e.line(o+P*p,1.4,0,o+P*p,m,0,b(c)),e.line(o+P*(p+.95),1.4,0,o+P*(p+.95),m,0,b(i)),e.line(o+P*(p-.3),m,0,o+P*(p+1.7),m,0,i),e.line(o+P*(p-.2),m+.55,0,o+P*(p+1.5),m+.55,0,c);e.arc(o,m+.55,0,p,p,0,Math.PI,b(c)),e.arc(o,m+.55,0,p+.95,p+.95,0,Math.PI,b(i)),x&&(e.arc(o,m+.55,0,p+1.9,p+1.9,.04,Math.PI-.04,b(i)),e.arc(o,m+.55,0,p-.9,p-.9,.05,Math.PI-.05,b({white:.5})));const E=m+.55+p;for(const P of[-.55,0,.55])e.line(o+P*1.2,E-.3,0,o+P*1.7,E+(x?2.6:1.7),0,P===0?c:i);const W=x?[-3.5,-7,-10.5]:[-5.5];for(const P of W){e.arc(o,m+.55,P,p,p,0,Math.PI,b({white:x?.3:.7,pitch:.5}));for(const N of[-1,1])e.line(o+N*p,1,P,o+N*p,m+.55,P,b({white:.6,pitch:.55}))}const V=W[W.length-1];for(const P of[-1,1])e.line(o+P*p,m+.55,0,o+P*p,m+.55,V,b({white:.5,pitch:.5}));if(x){e.line(o,E,0,o,E,V,b(c));for(const P of[-1,1])e.line(o+P*p*.71,m+.55+p*.71,0,o+P*p*.71,m+.55+p*.71,V,b({white:.2}))}await r.yield()}for(const o of[-1,1])for(const p of[18.5,32.5,46.5]){const m=o*p,x=21.4;e.arc(m,x,0,1.7,1.7,0,Math.PI*2,i),e.arc(m,x,0,.5,.5,0,Math.PI*2,c);for(let d=0;d<8;d++){const b=d*Math.PI/4+.2;e.line(m+Math.cos(b)*.7,x+Math.sin(b)*.7,0,m+Math.cos(b)*1.45,x+Math.sin(b)*1.45,0,{col:s.accent[o<0?0:1],white:.1,per:1.6})}}const g=[];for(const o of[-1,1])for(const p of[10.4,13.4,25.5,39.5,53.6,57.2])g.push(o*p);const z=te(new H(64),n),a=re(90211),l=te(e.batch,a);z.density=l.density=e.density;const f=o=>({...o,w:.074,len:1.55,jit:.09,turn:1.15,hold:.8,hand:3.2,pitch:o.pitch??.47,per:1.7+.9*a()});for(const o of g){const m=Math.abs(o)<14,x=m?z:e;x.line(o-1.25,1.4,2.2,o+1.25,1.4,2.2,i),x.line(o-1.25,1.4,2.2,o-1.25,2.5,2.2,i),x.line(o+1.25,1.4,2.2,o+1.25,2.5,2.2,i),x.line(o-1.05,2.5,2.2,o+1.05,2.5,2.2,c),x.arc(o,2.9,2.2,.95,.4,0,Math.PI,i),x.line(o-.82,3.2,2.2,o-.66,23.9,2.2,i),x.line(o+.82,3.2,2.2,o+.66,23.9,2.2,i),x.line(o-.27,3.6,2.2,o-.22,23.5,2.2,{white:1,pitch:.8}),x.line(o+.27,3.6,2.2,o+.22,23.5,2.2,{white:1,pitch:.8}),x.line(o-.8,24,2.2,o+.8,24,2.2,c);for(const d of[-1,1])x.spiral(o+d*.95,24.85,2.2,.62,.12,(d>0,Math.PI*.5),d>0?-Math.PI*2.2:Math.PI*3.2,{white:.2,pitch:.3,len:.8});if(x.line(o-1.5,25.8,2.2,o+1.5,25.8,2.2,i),m){const d=l;d.line(o-1.25,1.4,2.2,o+1.25,1.4,2.2,f(i)),d.line(o-1.25,1.5,2.2,o-1.25,2.5,2.2,f(i)),d.line(o+1.25,1.5,2.2,o+1.25,2.5,2.2,f(i)),d.line(o-1.05,2.55,2.2,o+1.05,2.55,2.2,f(c)),d.line(o-.84,3.1,2.2,o-.68,23.9,2.2,f({white:.3})),d.line(o+.84,3.1,2.2,o+.68,23.9,2.2,f({white:.3})),d.line(o-.24+a.range(-.1,.1),3.6,2.2,o-.2,23.5,2.2,f({white:.85,pitch:.95})),d.line(o+.24+a.range(-.1,.1),3.6,2.2,o+.2,23.5,2.2,f({white:.85,pitch:.95})),d.line(o-.85,24,2.2,o+.85,24,2.2,f(c));for(const b of[-1,1])d.spiral(o+b*.95,24.85,2.2,.62,.12,Math.PI*.5,b>0?-Math.PI*2.2:Math.PI*3.2,{white:.2,pitch:.3,len:.8});d.line(o-1.5,25.8,2.2,o+1.5,25.8,2.2,f(i))}await r.yield()}const v=g.slice().sort((o,p)=>o-p);for(let o=0;o+1<v.length;o++){const p=v[o]+1.5,m=v[o+1]-1.5,x=(p+m)/2,d=(m-p)/2;if(d<1.5||Math.abs(x)<1)continue;const b=Math.min(2.6,.9+d*.22),E={col:s.accent[x<0?0:1],white:.12,per:2};e.run((W,V)=>{const P=W/(d*2.15)*2-1;V[0]=x+P*d,V[1]=25.25-b*(1-P*P),V[2]=2.2},d*2.15,E),e.run((W,V)=>{const P=W/(d*2.05)*2-1;V[0]=x+P*d,V[1]=25.25-b*.55*(1-P*P),V[2]=2.2},d*2.05,{white:.9,pitch:.55});for(const W of[p,m])e.line(W,25.2,2.2,W+n.range(-.15,.15),23.4,2.2,E)}const M=t.map(o=>[o[0]-o[1]-1.3,o[0]+o[1]+1.3]).sort((o,p)=>o[0]-p[0]);let S=-60;for(const[o,p]of M.concat([[60,60]])){if(o-S>1.2)for(const m of[3.6,5.8,8,10.2])e.line(S+.3,m,0,o-.3,m,0,{white:.85,pitch:.62});S=p}for(const o of[26.2,30.1])e.line(-60.6,o,-10.5,60.6,o,-10.5,{white:.5,pitch:.6});await r.yield();for(const[o,p,m]of[[26.2,i,.4],[26.95,c,.4],[28.7,i,.6],[29.85,i,2.6],[30.3,u,2.9]])e.line(-60.6,o,m,60.6,o,m,p);await r.yield();for(let o=-59.2;o<59.6;o+=1.62){const p=Math.round((o+59.2)/1.62)%3===0;e.line(o,27.25,.5,o+n.range(-.05,.05),28.45,.5,p?{col:s.accent[o<0?0:1],white:.05}:c),p&&e.line(o+.3,27.25,.5,o+.3,28.45,.5,{col:s.accent[o<0?0:1],white:.05})}e.line(-60,29.3,1.4,60,29.3,1.4,{white:.6,pitch:.62,jit:.02,len:.75});for(const o of[-1,1])e.line(o*60.6,1.4,0,o*60.6,26.2,0,i),e.line(o*60.6,30.1,2.6,o*60.6,30.1,-10.5,i),e.line(o*60.6,26.2,0,o*60.6,26.2,-10.5,{white:.5,pitch:.6}),e.line(o*60.6,1.4,-10.5,o*60.6,30.1,-10.5,{white:.5,pitch:.6});return await r.yield(),g}const ae={windows:[[18.5,4.5,10.5],[32.5,4.5,10.5],[46.5,4.5,10.5]],fallHalf:45,parting:12.6,half:60.6};function ye(r,e){if(r.core?.makeRng)return r.core.makeRng(r.core.hashSeed(e+":"+r.seed));let n=2166136261;for(const c of e+":"+r.seed)n^=c.charCodeAt(0),n=Math.imul(n,16777619);const s=re((n>>>0)%2147483646+1);return s.int=(c,i)=>Math.floor(c+(i-c+1)*s()),s}async function ke(r,e,n,s){const c=ye(r,"palace-windows"),i=te(e,c);i.density=s;const u={white:.16,pitch:.42,len:1,jit:.05,w:.12,turn:.6},t=-.7;for(const h of[-1,1])for(const[g,z,a]of ae.windows){const l=h*g,f=a+.55;for(let v=2.3+c.range(0,.2);v<f+z-.7;v+=.5){if(Math.abs(v-f)<.36)continue;const M=(v<f?z:Math.sqrt(Math.max(z*z-(v-f)*(v-f),0)))-.75;if(M<.9)continue;const S=c.range(-.05,.05);i.line(l-M,v+S,t,l-.4,v+S,t,u),i.line(l+.4,v+S,t,l+M,v+S,t,u)}await r.yield()}const y={white:.3,pitch:.3,len:.8,jit:.035,w:.1};if(i.line(-ae.half,30.06,2.75,ae.half,30.06,2.75,y),await r.yield(),n.front==="dome")i.arc(0,36.9,2,12.15,6.95,0,Math.PI,y),i.line(-13.4,36.55,2,13.4,36.55,2,y);else{for(const h of[-1,1])i.line(h*24.4,34.27,2,0,44.37,2,y);i.line(-23.4,33.62,2,23.4,33.62,2,y)}return await r.yield(),i.count}async function Me(r,e,n,s,c){const i={white:.9},u={white:.12},t=2,y=c.front==="dome"?14.5:23;for(const a of[-1,1]){e.line(a*y,30.75,t,a*60.4,30.75,t,u),e.line(a*y,33.1,t,a*60.4,33.1,t,u),e.line(a*y,32.75,t,a*60.4,32.75,t,i);for(let l=y+.6;l<60;l+=.86)e.line(a*l,31,t,a*l+s.range(-.04,.04),32.6,t,{white:.55,pitch:.55,jit:.03})}await r.yield();const h=a=>a<.4?.62-a*.8:a<.75?.3:a<1.7?.3+.78*Math.sin((a-.75)/.95*Math.PI*.5):a<2.5?1.08-.6*Math.pow((a-1.7)/.8,1.6):.48+(a-2.5)*.75,g=c.front==="dome"?[20,30,40,50,58.6]:[27,35,43,51,58.6];for(const a of[-1,1])for(let l=0;l<5;l++){const f=a*g[l],v=33.5,M=l===4?1.25:1;l===0&&await r.yield();for(const m of[-1,1])e.line(f+m*1,30.75,t+.2,f+m*1,33.4,t+.2,u),e.run((x,d)=>{d[0]=f+m*h(x/M)*M,d[1]=v+x,d[2]=t+.2},2.95*M,{white:.15,pitch:.34,len:.85});e.line(f-1.15,33.4,t+.2,f+1.15,33.4,t+.2,i),e.arc(f,v+1.7*M,t+.2,1.08*M,.22,Math.PI,Math.PI*2,i),e.line(f-.82*M,v+2.95*M,t+.2,f+.82*M,v+2.95*M,t+.2,u);const S=v+2.95*M,o=s.range(1.3,1.9),p=s();for(let m=0;m<3;m++){const x=(m-1)*.9+s.range(-.3,.3),d=s.range(3.2,5.2)*(m===1?1.25:1);n.stroke([f+x*.25,S,t+.2],[f+x*1.3,S+d*.55,t+.2],[f+x*.4+s.range(-.5,.5),S+d,t+.2],{w:.11,col:(m===1?A.LEMON:c.accent[a<0?0:1])+.3,kind:1,k0:(p+m*.33)%1,k1:o,seed:s()})}}if(await r.yield(),c.front==="dome"){for(const a of[-1,1])e.line(a*13.2,30.75,t,a*13.2,36.2,t,u),e.line(a*12.2,31.2,t,a*12.2,35.8,t,i);for(const a of[33.2,36.2,36.9])e.line(-13.6,a,t,13.6,a,t,a>36.5?i:u);for(let a=-10.5;a<=10.6;a+=3.5)e.arc(a,34.9,t,.95,.95,0,Math.PI,i),e.line(a-.95,33.5,t,a-.95,34.9,t,i),e.line(a+.95,33.5,t,a+.95,34.9,t,i);e.arc(0,36.9,t,12.6,7.3,0,Math.PI,u),e.arc(0,36.9,t,11.7,6.6,.03,Math.PI-.03,i);for(const a of[4.2,8.4])e.arc(0,36.9,t,a,7,0,Math.PI*.5,{white:.4}),e.arc(0,36.9,t,a,7,Math.PI*.5,Math.PI,{white:.4});e.line(0,37.2,t,0,43.8,t,{white:.4});for(const a of[-1,1])e.line(a*1.3,44,t,a*1.1,46.2,t,u);e.line(-1.7,44,t,1.7,44,t,i),e.arc(0,46.2,t,1.25,1.25,0,Math.PI,u),e.line(0,47.4,t,0,49,t,i)}else{for(const f of[33.3,33.95])e.line(-23.6,f,t,23.6,f,t,u);for(let f=-21;f<=21.1;f+=3)e.line(f,31,t,f,32.9,t,i),e.line(f+1.5,31.4,t,f+1.5,32.5,t,{col:c.accent[f<0?0:1],white:.1});e.line(-23.6,30.75,t,23.6,30.75,t,u);for(const f of[-1,1])e.line(f*24.2,33.95,t,0,44,t,u),e.line(f*24.6,34.6,t,0,44.75,t,u),e.line(f*19.6,34.8,t,0,42.4,t,i);const a=35;e.arc(0,a,t,1.7,1.7,0,Math.PI,{col:A.SCARLET,white:0,pitch:.36}),e.arc(0,a,t,2.5,2.5,0,Math.PI,i);const l=c.rays;for(let f=0;f<l;f++){const v=Math.PI*(.06+.88*(f+.5)/l),M=Math.cos(v),S=Math.sin(v),o=(42.4-a)/(S+.388*Math.abs(M))*(f%2?.66:.86);e.line(M*3.1,a+S*3.1,t,M*o,a+S*o,t,{col:f%2?c.accent[f<l/2?1:0]:A.LEMON,white:f%2?.1:.3,per:2.6,ph:1-f/l,hand:30})}}const z=c.front==="dome"?[[0,49,.7]]:[[0,44.6,1.25],[-24.4,34.3,.8],[24.4,34.3,.8]];for(const[a,l,f]of z)for(let v=-2;v<=2;v++){const M=Math.PI/2-v*.42,S=(2.6-Math.abs(v)*.45)*f;n.stroke([a,l,t],[a+Math.cos(M)*S*.6,l+Math.sin(M)*S*.75,t],[a+Math.cos(M-v*.35)*S,l+Math.sin(M-v*.35)*S,t],{w:.1,col:A.LEMON+(v===0?.5:0),kind:1,k0:(v+2)/5,k1:2.2,seed:s()})}await r.yield()}function be(r,e,n=185,s=262){let c=12345;const i=()=>(c=c*16807%2147483647,c/2147483647),u=(a,l)=>a+(l-a)*i(),t=(a,l,f,v,M)=>r.stroke(a,l,f,{w:v*u(.85,1.2),col:M,kind:5,k0:n,k1:s,seed:i(),bead:0}),y=(a,l,f,v,M,S,o,p=5,m=.08)=>{const x=Math.hypot(f-a,v-l),d=Math.max(1,Math.round(x/p));for(let b=0;b<d;b++){if(i()<m)continue;const E=(b+u(.04,.16))/d,W=(b+u(.8,.97))/d,V=(E+W)/2,P=u(-.25,.25),N=u(-.3,.3);t([a+(f-a)*E,l+(v-l)*E+P,M],[a+(f-a)*V-(v-l)/x*N,l+(v-l)*V+P+(f-a)/x*N,M],[a+(f-a)*W,l+(v-l)*W+P,M],S,typeof o=="function"?o():o)}},h=A.LEMON,g=A.PAPER,z=()=>i()<.3?g:h;y(-60.6,30.4,60.6,30.4,3,.62,z,6),y(-60.4,33.2,60.4,33.2,2.2,.4,h,5,.3),y(-60.6,26.4,60.6,26.4,.6,.4,h,7,.25);for(const a of[-1,1]){y(a*60.6,1.5,a*60.6,30,.2,.55,h,7,0);for(const l of[11.9,25.5,39.5,55.4])y(a*l,2,a*l,25.5,2.4,l<13||l>50?.62:.45,z,8,0);for(const l of[18.5,32.5,46.5])t([a*l-4.5,10.8,.2],[a*l,20.6,.2],[a*l+4.5,10.8,.2],.42,g);for(const l of e.front==="dome"?[20,30,40,50,58.6]:[27,35,43,51,58.6])t([a*l,33.6,2.4],null,[a*l,36.6,2.4],.62,h),t([a*l,37,2.4],[a*l+.5,39.5,2.4],[a*l-.3,42,2.4],.38,e.accent[a<0?0:1]+.3)}t([-8.6,14.4,.3],[0,31.5,.3],[8.6,14.4,.3],.6,g);for(const a of[-1,1])y(a*8.6,1.6,a*8.6,14,.3,.5,g,7,0);if(e.front==="dome"){for(const a of[-1,1])y(a*13.3,31,a*13.3,36.6,2.2,.55,h,6,0),t([a*12.6,37.1,2.2],[a*11.2,43.4,2.2],[0,44.3,2.2],.66,h),t([a*6.3,37.4,2.2],[a*5.6,42,2.2],[0,44,2.2],.3,g);y(-13.6,36.9,13.6,36.9,2.2,.5,z,5,0),t([0,44.2,2.2],null,[0,49.2,2.2],.6,h),t([-1.6,46.4,2.2],[0,48.2,2.2],[1.6,46.4,2.2],.4,g)}else{for(const a of[-1,1])y(a*24.4,34.2,0,44.6,2.2,.62,h,6.5,0);y(-23.6,33.9,23.6,33.9,2.2,.5,z,6,0),t([-2.2,35.2,2.2],[0,38.4,2.2],[2.2,35.2,2.2],.6,A.SCARLET);for(let a=0;a<5;a++){const l=Math.PI*(.14+.72*a/4),f=Math.cos(l),v=Math.sin(l),M=(42.4-35)/(v+.388*Math.abs(f))*.8;t([f*3.6,35+v*3.6,2.2],null,[f*M,35+v*M,2.2],.32,a%2?e.accent[a<2?1:0]:h)}t([0,44.8,2.2],null,[0,48,2.2],.45,h+.5)}for(let a=0;a<46;a++){const l=(a+u(.1,.9))/46*88-44;if(Math.abs(l)<7.6&&i()<.6)continue;const f=u(1.5,12),v=u(-.8,.8);t([l,29.8+u(-.2,.3),3.6],[l+v*.4,(30+f)/2+1,4.6],[l+v,f,6.5],u(.34,.6),h+u(.45,.9))}}function Pe(r,e,n,s,c){const i=Math.round(1500*(.6+.4*c)),u=30.15,t=3.4;for(let h=0;h<i;h++){const g=(h+n())/i*90-45,z=Math.abs(g),a=z<12.6+1.2*Math.sin(g*2.7),l=h%5===0,f=n.chance(.6)||l&&!a,v=a?n.chance(z<9.5?.2:.36):l||h%5<3,M=f||a?u+n.range(-.15,.25):n.range(7,26),S=a?n.range(3,7.5)*(z<9.5?1:1.3):f?n.range(10,24)*(l?1.2:1):n.range(5,13),o=Math.max(.15,M-S),p=(u-M)/u,m=(u-o)/u,x=U=>t+1.2*U+3.2*U*U,d=n.range(-.5,.5),b=n.range(-.7,.7),E=n.range(0,1.6),W=n(),V=s.accent[g<0?0:1],P=A.LEMON+Math.min(.9,.25*30/S*n.range(1.2,2.4)),N=W<.13?V+n.range(.15,.4):W<.25?A.LEMON:f||a?P:A.PAPER,T=l&&!a?n.range(.2,.34):n.chance(.2)?n.range(.1,.135):n.range(.06,.1),K=n.range(2.2,3.3)+(l?1.2:0),Q=l?n.range(.8,.92):n.range(.55,.86);v&&r.stroke([g,M,x(p)+d*.2+E],[g+b*.3,(M+o)/2+.6,x((p+m)/2)+d+E],[g+b,o,x(m)+d*.4+E],{w:T,col:N,kind:1,k0:(g/37+n.range(0,.45)+10)%1,k1:K,hold:Q,seed:n(),bead:.55})}const y=Math.round(240*c);for(let h=0;h<y;h++){const g=n.range(-45,45),z=n.range(6.5,9),a=n.range(.7,2.6),l=n.range(.6,2.4),f=n.range(-.8,.8);e.stroke([g,.1,z],[g+f*.5,a*1.4,z+l*.5],[g+f,a*.5,z+l],{w:.07,col:A.PAPER,kind:1,k0:n(),k1:n.range(.9,1.5),seed:n(),bead:0})}}function ze(r,e,n){const[s,c,i]=n.c,u=n.r,t=n.dir??1,y=n.col??A.ROSE,h=t*Math.PI/2,g=[0,0,1],z=[s,c,i],a=!!n.plain,l=.85,f=e()*6.283,v=e.range(2.2,2.8),M=(p,m,x)=>{const d=m-t*l*6.283*p,b=u*(.13+.87*p);x[0]=s+Math.cos(d)*b,x[1]=c+Math.sin(d)*b},S=[0,0],o=[0,0];for(let p=0;p<5;p++){const m=f+p*6.283/5,x=Math.round(u*3.3/.4);for(let d=0;d<x;d++){const b=(d+.5+e.range(-.2,.2))/x,E=e.range(.3,.46)/(u*3.3)*.5;M(Math.max(0,b-E),m,S),M(Math.min(1,b+E),m,o);const W=e.range(-.07,.07);r.stroke([S[0]+W,S[1]-W,i],null,[o[0]+W,o[1]-W,i],{n:g,w:.1*e.range(.8,1.25),col:a?y:e.chance(.15+b*.4)?A.PAPER:e.chance(.12)?A.LEMON:y,kind:1,k0:(p/5+b*.55)%1,k1:v,seed:e(),pivot:z,spin:h})}for(let d=0;d<(a?0:x*.45);d++){const b=.35+.65*(d+e())/(x*.45);M(b-.012,m+.2,S),M(b+.012,m+.2,o),r.stroke([S[0],S[1],i],null,[o[0],o[1],i],{n:g,w:.075,col:A.PAPER,kind:1,k0:(p/5+b*.55+.1)%1,k1:v,seed:e(),pivot:z,spin:h})}}for(let p=0;p<16;p++){const m=p/16,x=m*6.283*2.2,d=u*(.02+.1*m),b=x+.32/Math.max(d,.15);r.stroke([s+Math.cos(x)*d,c+Math.sin(x)*d,i+.02],null,[s+Math.cos(b)*d,c+Math.sin(b)*d,i+.02],{n:g,w:.12,col:A.SCARLET,kind:0,seed:e(),pivot:z,spin:h,bead:.5})}for(let p=0;p<(a?16:26);p++){const m=e()*6.283,x=u*e.range(.9,1.04),d=a?e.range(.45,.95):e.range(.9,2.6),b=-Math.sin(m)*t,E=Math.cos(m)*t,W=s+Math.cos(m)*x,V=c+Math.sin(m)*x,P=e.range(.1,.5),N=m+t*d*.5/x,T=m+t*d/x,K=x*1.03/Math.cos(d*.5/x);r.stroke([W,V,i],a?[s+Math.cos(N)*K,c+Math.sin(N)*K,i]:[W+b*d*.55+Math.cos(m)*P*.3,V+E*d*.55+Math.sin(m)*P*.3,i],a?[s+Math.cos(T)*x*1.04,c+Math.sin(T)*x*1.04,i]:[W+b*d+Math.cos(m)*P,V+E*d+Math.sin(m)*P-d*.12,i],{n:g,w:a?.085:.07,col:a?y:e.chance(.5)?A.PAPER:y+.4,kind:1,k0:e(),k1:e.range(.8,1.3),seed:e(),bead:0})}}function Ae(r,e,n={}){const s=new H(256*e.length);for(const c of e)ze(s,r,c);return s.build({segs:2,fringe:n.fringe??!1,spinAxis:new k.Vector3(0,0,1),pad:8})}function Se(r,e,n,s,c,i,u){for(let t=0;t<s;t++){const y=e()*e(),h=11+y*112,g=e.range(-1,1)*(58-y*6),z=e.range(4,9)+y*8,a=Math.abs(g)<45,l=a?e.chance(.22)?A.LEMON:A.PAPER:e.chance(.55)?A.LEMON:n.accent[g<0?0:1],f=g*.012+e.range(-.04,.04),v=u?u(h+z*.5):c+(i-c)*(1-(h+z)/135);r.stroke([g,.07,h],null,[g+f*z,.07,h+z],{n:[0,1,0],w:e.range(.07,.1)*(1.15+1.5*y),zig:e.range(.22,.5)*(1+.7*y),col:l,kind:2,k0:v,k1:v+(u?.02:.03),seed:e(),bead:.6})}}function ce(r,e,n,s,c,i,u,t,y,h={}){const g=e.range(-.12,.12)*c,z=n+g,a=[z,c,s],l=h.w??.16,f=h.loop,v=h.y0??1,M=h.step??.03,S=Math.cos(h.yaw??0),o=Math.sin(h.yaw??0),p=d=>f?{kind:1,k0:(f.ph-(d<0?0:.08+d*M)+2)%1,k1:f.per,hold:.95-(d<0?0:.08+d*M)}:{kind:3,k0:d<0?u:u+t*(.9+d*.28),k1:t};r.stroke([n,v,s],[n+g*.2,v+(c-v)*.55,s],a,{w:l,col:h.trunk??A.PAPER,seed:e(),bead:0,...p(-1)});const m=h.n??(y?5:e.int(9,12)),x=c*(h.spread??(y?.16:e.range(.2,.3)));for(let d=0;d<m;d++){const b=(d+.5)/m,E=Math.PI*(1.02-b*1.04)+e.range(-.06,.06),W=Math.cos(E),V=Math.max(.1,Math.sin(E)),P=c*e.range(.3,.5)*(h.drop??1),N=s+e.range(-3,3),T=x*e.range(1.25,1.6);r.stroke(a,[z+W*x*.9*S,c+V*x*.75,N+W*x*.9*o],[z+W*T*S,c+V*x*.3-P,N+W*T*o],{w:l*.94,col:i+.27,seed:e(),bead:0,...p(d)})}}function le(r,e,n,s,c,i,u,t=.05,y=1){const h=Math.cos(i),g=Math.sin(i),z=[0,1,0],a=(f,v)=>[n+(f*h-v*g)*c,t,s+(f*g+v*h)*c],l=()=>({n:z,w:e.range(.085,.125)*y,col:e.chance(.3)?A.PAPER:u,kind:0,seed:e(),bead:1});r.stroke(a(-1,0),a(-.2,1.1),a(.75,.25),l()),r.stroke(a(.75,.25),a(1.15,-.2),a(.55,-.4),l()),r.stroke(a(-1,0),a(-1.3,-.6),a(-.6,-.75),l()),r.stroke(a(.05,-.15),null,a(.3,-.05),l()),r.stroke(a(-.35,-.9),null,a(0,-.95),l())}function Ee(r={}){const e=new k.Mesh(new k.SphereGeometry(1,32,16),we(r));return e.frustumCulled=!1,e.renderOrder=-10,e}const Re=[[0,-60],[.03,-30],[.0625,18],[.1,55],[.2,97],[.28,300],[.36,430],[1,430]],We=[[0,-90],[.28,-60],[.34,135],[.45,178],[.6,240],[.79,300],[.85,324],[.95,430],[1,430]];function fe(r,e){for(let n=1;n<r.length;n++)if(e<=r[n][0]){const s=r[n-1],c=r[n];return s[1]+(c[1]-s[1])*(e-s[0])/Math.max(c[0]-s[0],1e-6)}return r[r.length-1][1]}function Fe(r){return[fe(Re,r),fe(We,r),Math.min(1,Math.max(0,(r-.45)/.34))]}async function Ve(r,e={}){const n=r.rng,s=Math.min(1,Math.max(.6,e.detail??r.quality?.detail??1));he(e.palette??ie),D.uGran.value=e.gran??1;const c=e.programme??n.pick(["rose-turquoise","rose-turquoise","turquoise-rose","lemon"]),i={front:e.front??(n.chance(.3)?"dome":"pediment"),accent:c==="lemon"?[A.LEMON,A.LEMON]:c==="turquoise-rose"?[A.TURQ,A.ROSE]:[A.ROSE,A.TURQ],rays:n.int(11,17),bouquet:e.bouquet??n.chance(.12)};D.uDamp.value=e.damp??(n.chance(.7)?1:.25);const u=e.preview??Object.keys(e).length===0,t=new k.Group;if(t.name="fire-palace",await r.yield(),e.ground??!0){const w=new k.Mesh(new k.CircleGeometry(e.groundRadius??320,48),oe({base:0}));w.rotation.x=-Math.PI/2,w.position.y=-.04,t.add(w)}const y=new k.Mesh(new k.PlaneGeometry(130,130),oe({base:0,gloss:1}));y.rotation.x=-Math.PI/2,y.position.set(0,0,65),t.add(y);const h=new k.BufferGeometry;{const w=[],R=[],F=[],I=(C,B,O,L,_)=>{const q=w.length/3,Z=[[C,0,L],[B,0,L],[B,0,_],[C,0,_],[C,O,L],[B,O,L],[B,O,_],[C,O,_]],J=[[4,7,6,5,0,1,0],[3,2,6,7,0,0,1],[0,4,5,1,0,0,-1],[0,3,7,4,-1,0,0],[1,5,6,2,1,0,0]];let G=0;for(const j of J){for(let X=0;X<4;X++)w.push(...Z[j[X]]),R.push(j[4],j[5],j[6]);F.push(q+G,q+G+1,q+G+2,q+G,q+G+2,q+G+3),G+=4}};for(const C of[-1,1])for(let B=0;B<5;B++){const O=C*(67+B*5),L=C*112;I(Math.min(O,L),Math.max(O,L),(B+1)*1.05,-14+B,28-B*2.5)}h.setAttribute("position",new k.Float32BufferAttribute(w,3)),h.setAttribute("normal",new k.Float32BufferAttribute(R,3)),h.setIndex(F)}t.add(new k.Mesh(h,oe({base:1}))),await r.yield();const g=new H(2048),z=[0,1,0],a=(w,R,F,I,C,B)=>{const O=Math.hypot(F-w,I-R),L=Math.max(1,Math.round(O/2.6));for(let _=0;_<L;_++){if(n.chance(.12))continue;const q=(_+n.range(.02,.12))/L,Z=(_+n.range(.85,1))/L,J=n.range(-.06,.06),G=n.range(-.12,.12),j=(I-R)/O,X=-(F-w)/O;g.stroke([w+(F-w)*q+j*J,C,R+(I-R)*q+X*J],[w+(F-w)*(q+Z)/2+j*G,C,R+(I-R)*(q+Z)/2+X*G],[w+(F-w)*Z+j*J,C,R+(I-R)*Z+X*J],{n:z,w:n.range(.07,.1),col:B,kind:0,seed:n()})}};for(const w of[.5,1.5])a(-65-w,130+w,65+w,130+w,.05,A.PAPER),a(-65-w,0,-65-w,130+w,.05,A.PAPER),a(65+w,0,65+w,130+w,.05,A.PAPER);for(const w of[-1,1])for(let R=0;R<5;R++){const F=w*(67+R*5+.25),I=(R+1)*1.05+.05,C=-14+R,B=28-R*2.5;a(F,C,F,B-.25,I,A.PAPER),a(F,B-.25,w*112,B-.25,I,A.PAPER);const O=Math.round((R===4?16:3)*s);for(let L=0;L<O;L++)le(g,n,w*(67+R*5+n.range(1.8,R===4?22:3.4)),n.range(C+2,B-2.5),n.range(.9,1.5),n()*6.283,n.chance(.6)?A.LEMON:A.PAPER,I)}const l=Math.round(150*s);for(let w=0;w<l;w++){const R=n.sign(),F=R*n.range(68,125),I=n.range(32,150);Math.abs(F)<112&&I<30||(le(g,n,F,I,n.range(1,1.9),n()*6.283,n.chance(.55)?A.LEMON:A.PAPER),w%60===0&&await r.yield())}const f=g.build({segs:3,fringe:!0,margin:5});t.add(f),await r.yield();const v=new H(24e3),M=new H(1024),S=te(v,n);S.density=.8+.2*s,await ge(r,S,n,i),await Me(r,S,M,n,i),await r.yield();const o=await ke(r,v,i,S.density),p=v.build({segs:1,fringe:!0,margin:2.2,spacing:.4});t.add(p),await r.yield();{const w=new H(256);be(w,i),t.add(w.build({segs:4,minPx:1}))}const m=new H(2048);Pe(m,M,n,i,s),await r.yield(),t.add(m.build({segs:6,spacing:.3})),await r.yield();const x=new H(512);Se(x,n,i,e.zigN??Math.round(400*(.7+.3*s)),.46,.78,e.zigAt),t.add(x.build({segs:1,minPx:1.15,spacing:.55}));const d=[[78,13.6,13,8.6],[93.5,11.4,8,6.2],[106,11.2,3,4.6]],b=[];for(const w of[-1,1]){const R=d.map((F,I)=>({c:[w*F[0],F[1]+(I===1?n.range(4,6.5):0),F[2]],r:F[3]*n.range(.92,1.08),col:i.accent[w<0?0:1]===A.LEMON?I%2?A.PAPER:A.LEMON:i.accent[w<0?0:1],plain:i.accent[w<0?0:1]===A.LEMON,dir:-w}));t.add(Ae(n,R));for(const F of R)b.push({position:new k.Vector3(...F.c),radius:F.r})}await r.yield();const E=new H(512);for(let w=0;w<16;w++){const R=w%2?1:-1,F=R*n.range(30,105);ce(E,n,F,n.range(-95,-35),n.range(68,120),i.accent[R<0?0:1]===A.LEMON?A.ROSE:i.accent[R<0?0:1],.25+w*.045+n.range(-.008,.008),.013,!1)}if(i.bouquet)for(let w=0;w<40;w++){const R=w/39,F=Math.PI*(.92-.84*R);let I=Math.cos(F)*150;Math.abs(I)<26&&(I=Math.sign(I||1)*26),ce(E,n,I,-112-16*Math.sin(F),80+70*Math.sin(F)+n.range(-5,5),A.ROSE,.42+.1*R,.03,!0,{w:.55,n:6,spread:.2,drop:.85,trunk:w%3?A.PAPER:A.ROSE+.5})}const W=[];for(let w=0;w+1<E.n;w++)E.A[w*3+1]<2&&W.push({x:E.A[w*3],z:E.A[w*3+2],apexX:E.C[w*3],apexY:E.C[w*3+1],col:Math.floor(E.K[(w+1)*4]+.001),u0:E.K[w*4+2],w:E.K[w*4+3]});t.add(E.build({segs:10,minPx:1.1})),t.add(M.build({segs:6}));const V=u?Ee():null;V&&(V.renderOrder=-.5,t.add(V));const P=(w,R)=>e[w]!==void 0?[].concat(e[w]):R;await r.yield();let N=!1,T=0;const K=e.driveWash??!0,Q=new k.Vector3,U=new k.Vector3,$=new k.Vector2,Y=w=>{if(T=w,D.uProg.value=w,K){const R=Fe(w);D.uFront.value.y=R[0],D.uFront.value.z=R[1],D.uPool.value=R[2],D.uSky3.value=(w-.37)*3200,D.uSky2.value=(w-.04)*1500}};return Y(0),{object:t,radius:P("heroR",[80])[0],height:P("heroH",[48])[0],center:new k.Vector3(...P("heroC",[0,20,0])),ground:!1,groundY:0,variant:i,counts:{palaceDabs:v.n,fall:m.n,zigzags:x.n,ground:g.n,rockets:E.n,air:M.n},rockets:W,front:ae,litDabs:o,anchors:{portalSeat:{position:new k.Vector3(0,9,-80),facing:new k.Vector3(0,0,1),radius:7},flyThrough:[[14,2.5,112],[10,2.5,70],[3,3,34],[0,4,12],[0,5,0],[0,6,-12],[0,8,-44],[0,9,-80]].map(w=>new k.Vector3(...w)),viewpoints:{theImage:{position:new k.Vector3(10,2.5,96),lookAt:new k.Vector3(0,19,0)},palaceWhole:{position:new k.Vector3(0,6,190),lookAt:new k.Vector3(0,18,0)},throughTheFall:{position:new k.Vector3(0,4,14),lookAt:new k.Vector3(0,8,-20)}},arch:{center:new k.Vector3(0,11,0),width:16,height:22.5,depth:10.5},fallLip:{y:30.15,z:3.4,halfWidth:45},basin:{min:new k.Vector3(-65,0,0),max:new k.Vector3(65,0,130)},wheelHubs:b,rocketField:{zMin:-95,zMax:-35,keepClearHalfWidth:26},washOrigin:new k.Vector3(0,0,300),washDir:new k.Vector3(0,0,-1)},setProgress(w){N=!0,Y(Math.min(1,Math.max(0,w)))},update(w,R,F){if(D.uTime.value=R,N||Y(P("heroU",[.3+.62*(R/44%1)])[0]),K&&(t.updateWorldMatrix(!0,!1),D.uWashO.value.copy(Q.set(0,0,300).applyMatrix4(t.matrixWorld)),D.uWashD.value.copy(U.set(0,0,-1).transformDirection(t.matrixWorld))),F){const I=r.renderer?.getDrawingBufferSize?r.renderer.getDrawingBufferSize($).y:720;D.uPx.value=2/(Math.max(F.projectionMatrix.elements[5],.1)*Math.max(I,64))}},dispose(){}}}export{ae as FRONT,A as PAL,ee as STYLE_GLSL,ie as WAX_PALETTE,H as WaxBatch,le as addScroll,ze as addWheel,Ve as buildHero,ce as drawRocket,Ee as makeSky,Ae as makeWheels,oe as paperMaterial,he as setPalette,we as skyMaterial,D as wash,Fe as washSchedule,se as waxMaterial};
