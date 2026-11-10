import*as a from"three";const $=["#6C7CB8","#BCC0DE","#E9C85A","#1F3A33","#C97B6A","#D5D0C2","#7A3B4A"],Ce={ultra:0,pale:1,gold:2,wood:3,pink:4,canvas:5,madder:6};function ye(n=$){const h=e=>new a.Color(n[e]||$[e]);return{ultra:h(0),pale:h(1),gold:h(2),wood:h(3),pink:h(4),canvas:h(5),madder:h(6)}}const M={uTime:{value:0},uLift:{value:0},uViewH:{value:800},uCanvas:{value:new a.Color($[5])}},re=`
uniform float uLift;
vec3 liftWorld(vec3 wp){
  float d = length(wp.xz - cameraPosition.xz);
  wp.y += d * tan(0.262 * smoothstep(60., 600., d)) * uLift;
  return wp;
}
// size of one pixel in metres at a clip-space w (perspective camera)
uniform float uViewH;
float pixelSize(float w){ return 2.0 * max(w, 0.05) / (max(projectionMatrix[1][1], 1e-3) * max(uViewH, 1.)); }
`,ie=`
#ifndef WN_RAG
#define WN_RAG 0.16
#endif
float wn_h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float wn_vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(wn_h21(i), wn_h21(i + vec2(1., 0.)), f.x), mix(wn_h21(i + vec2(0., 1.)), wn_h21(i + vec2(1., 1.)), f.x), f.y); }
// plain weave of coarse flax: returns how deep a point lies between threads (0 on a thread crown, 1 in a valley).
// q in metres, pitch in metres, px = metres per pixel; flat mean (0.42) once a thread is under 3 pixels.
float wn_weave(vec2 q, float pitch, float px){
  float slub = wn_vn(vec2(floor(q.y / pitch) * 0.37, q.x * 0.11)) ;          // a thick thread now and then
  vec2 u = q / pitch + vec2(0., 0.18 * (slub - 0.5));
  u.x += 0.34 * (wn_h21(vec2(floor(u.y), 3.)) - 0.5); u.y += 0.34 * (wn_h21(vec2(floor(u.x), 7.)) - 0.5);   // no two threads alike
  vec2 c = abs(fract(u) - 0.5) * 2.;
  float par = mod(floor(u.x) + floor(u.y), 2.);
  float crown = mix((1. - c.x) * (0.55 + 0.45 * (1. - c.y)), (1. - c.y) * (0.55 + 0.45 * (1. - c.x)), par);
  float valley = 1. - smoothstep(0.12, 0.6, crown + 0.25 * (slub - 0.5));
  float keep = 1. - smoothstep(pitch / 6., pitch / 3., px);
  return mix(0.42, valley, keep);
}
// the same weave with its pitch doubled in rings as it shrinks on screen, so a thread is always 5 to 10 pixels:
// the canvas is seen in thin paint at any distance and never shimmers. base = finest pitch in metres.
#define WN_PITCH 0.09
float wn_weaveR(vec2 q, float px, float base){
  float lod = log2(max(px * 5.5 / base, 1.)), l0 = floor(lod), f = lod - l0;
  float p0 = base * exp2(l0);
  return mix(wn_weave(q, p0, 0.), wn_weave(q, p0 * 2., 0.), smoothstep(0.35, 1., f));
}
// The weave seen at a slant. Warp and weft each double their pitch in rings by their OWN screen rate, so a thread
// stays a few pixels both ways however flat the cloth lies to the eye (no long blocks under a grazing view).
// q in metres, pq = screen rate of q.x and of q.y (metres per pixel). Returns 0 on a crown .. 1 in a valley.
float wn_weave2(vec2 q, vec2 pitch){
  float slub = wn_vn(vec2(floor(q.y / pitch.y) * 0.37, q.x * 0.11 / (pitch.x / WN_PITCH)));
  vec2 u = q / pitch + vec2(0., 0.18 * (slub - 0.5));
  u.x += 0.34 * (wn_h21(vec2(floor(u.y), 3.)) - 0.5); u.y += 0.34 * (wn_h21(vec2(floor(u.x), 7.)) - 0.5);
  vec2 c = abs(fract(u) - 0.5) * 2.;
  float par = mod(floor(u.x) + floor(u.y), 2.);
  float crown = mix((1. - c.x) * (0.55 + 0.45 * (1. - c.y)), (1. - c.y) * (0.55 + 0.45 * (1. - c.x)), par);
  return 1. - smoothstep(0.12, 0.6, crown + 0.25 * (slub - 0.5));
}
float wn_weaveA(vec2 q, vec2 pq, float base){
  vec2 lod = log2(max(pq * 3.6 / base, vec2(1.))), l0 = floor(lod), f = smoothstep(0.35, 1., lod - l0);
  vec2 p0 = base * exp2(l0);
  float a = wn_weave2(q, p0), b = a, c = a, d = a;
  if (f.x > 0.001) b = wn_weave2(q, vec2(p0.x * 2., p0.y));
  if (f.y > 0.001) { c = wn_weave2(q, vec2(p0.x, p0.y * 2.)); d = c; if (f.x > 0.001) d = wn_weave2(q, p0 * 2.); }
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
// what is left of the slant once each axis has its own pitch (1 = none): fade the weave to its mean above about 3
float wn_skew(vec2 qx, vec2 qy){
  float px = length(qx), py = length(qy), area = abs(qx.x * qy.y - qx.y * qy.x);
  return px * py / max(area, 1e-9);
}
// Bristle lanes that the eye can always resolve (polish pass): along = metres along the stroke, across = metres across
// it, px = metres per pixel across, stretch = how many times longer than wide a lane is. Returns 0..1 noise whose
// lanes are 7 to 14 pixels across at any distance (their width doubles in rings, cross-faded, like the weave).
float wn_lanes(float along, float across, float px, float stretch, float seed){
  float lod = log2(max(px * 7. / 0.02, 1.)), l0 = floor(lod), f = smoothstep(0.2, 1., lod - l0), w0 = 0.02 * exp2(l0);
  float a = wn_vn(vec2(along / (w0 * stretch) + seed * 3.1 + l0 * 5.1, across / w0 + seed * 17.3));
  float b = wn_vn(vec2(along / (w0 * stretch * 2.) + seed * 3.1 + (l0 + 1.) * 5.1, across / (w0 * 2.) + seed * 17.3));
  return mix(a, b, f);
}
// The mark: one long stroke of thinned paint. s = metres along from the loaded head, y = metres across (0 on the
// centre line), L = length, hh = half width, seed = per stroke, px = metres per pixel across, dry0 = extra dryness.
// Returns coverage 0..1 of paint: dense at the head, streaked and dry toward the tail, ragged at both ends,
// bristly along both edges. Streak lanes under 3 pixels fade to their mean, so nothing shimmers.
float wn_stroke(float s, float y, float L, float hh, float seed, float px, float dry0, out float thin){
  float t = clamp(s / max(L, 1e-3), 0., 1.);
  float v = abs(y) / max(hh, 1e-3);
  float f0 = 1. - smoothstep(0.45, 1.3, px), f1 = 1. - smoothstep(0.16, 0.5, px), f2 = 1. - smoothstep(0.03, 0.09, px), f3 = 1. - smoothstep(0.007, 0.02, px);
  float n0 = wn_vn(vec2(s * 0.022 + seed * 23.1, y * 0.36 + seed * 41.3));          // lanes 3 m across: the brush's own unevenness
  float n1 = wn_vn(vec2(s * 0.040 + seed * 17.3, y * 0.95 + seed * 31.7));          // 1 m: clumps of bristles
  float n2 = wn_vn(vec2(s * 0.150 + seed * 7.1, y * 5.5 + seed * 13.9));            // 0.18 m: bristle streaks
  float n3 = wn_vn(vec2(s * 0.450 + seed * 3.3, y * 21. + seed * 5.7));             // 0.05 m: single hairs
  n2 = smoothstep(0.2, 0.8, n2); n3 = smoothstep(0.25, 0.75, n3);
  float b = 0.27 * mix(0.5, n0, f0) + 0.27 * mix(0.5, n1, f1) + 0.28 * mix(0.5, n2, f2) + 0.18 * mix(0.5, n3, f3);
  float dry = clamp(smoothstep(0.08, 1.0, t) + dry0, -0.6, 1.25);
  float e = smoothstep(0.66, 1.15, v);      // (slim pass) scrubbed at the edges: the bristles give out over the outer third
  float rag = min(2., 0.2 * L) + WN_RAG * L * (0.6 * wn_vn(vec2(y * 0.6 + seed * 9., seed * 3.)) + 0.4 * wn_vn(vec2(y * 3.3 + seed * 5., seed * 8.)));   // tail: bristles lift off unevenly
  float tail = smoothstep(L - rag, L, s);
  float lobe = (0.4 + 2.4 * wn_vn(vec2(y * 0.8 + seed * 5., seed)) + 1.1 * wn_vn(vec2(y * 4.1 + seed * 2., seed * 6.))) * min(1., L / 20.);   // head: a loaded, blunt, uneven start
  float head = 1. - smoothstep(0., lobe, s - 2.2 * v * v * min(1., L / 20.));
  float skip = 0.16 * (wn_vn(vec2(s * 0.055 + seed * 29., seed * 13.)) - 0.5);        // the brush skips where the hand lifts
  float th = mix(0.2, 0.57, dry) + skip + 1.3 * e * e + 0.9 * tail + 1.6 * head;
  float d = b - th;
  float aa = clamp(fwidth(d) * 0.8, 0.012, 0.09) + 0.04 * (1. - f1) + 0.04 * (1. - f0);
  thin = 1. - smoothstep(0., 0.22, d);                                                  // where the film is thinnest
  return smoothstep(-aa, aa, d) * step(s, L) * step(0., s);
}
`,be=`
attribute vec2 aUV;      // s (metres from the loaded head), y (metres across)
attribute vec4 aDim;     // painted length L, half width hh, seed, amount of underpaint 0..1
attribute vec3 aCol;     // pigment (linear)
attribute vec3 aUnder;   // underpaint pigment (linear)
attribute vec3 aSide;    // unit vector across the stroke
attribute vec4 aWave;    // sway: amplitude m, wavelength m, phase, speed rad/s
attribute vec4 aExt;     // x: clip radius (pillar head, 0 = none), y: extra dryness, z: slide weight, w: slide phase
uniform float uTime; uniform float uMinPx;
uniform vec2 uFace; uniform float uBreath; uniform float uSwell; uniform vec2 uLane;
varying vec2 vUV; varying vec4 vDim; varying vec3 vCol; varying vec3 vUnder; varying vec4 vExt; varying float vFade; varying vec2 vPlane; varying float vDist;
${re}
void main(){
  vec3 p = position; vec3 sd = aSide;
  // the medium moves: every band sways along its length like weed in a slow current
  p += aSide * aWave.x * sin(6.2832 * aUV.x / max(aWave.y, 1.) - uTime * aWave.w + aWave.z);
#ifdef WN_PILLAR
  // breathing (keyed to u by the world): strokes slide sideways against each other, the column swells by 3 m
  p.x = p.x * (1. + uSwell * sin(6.2832 * uBreath * 0.5 + aExt.w * 0.3)) + aExt.z * sin(6.2832 * uBreath + aExt.w);
  vPlane = p.xy;
  // cylindrical billboard about the pillar's own axis: it never narrows and never shows an edge
  p = vec3(p.x * uFace.x + p.z * uFace.y, p.y, -p.x * uFace.y + p.z * uFace.x);
  sd = vec3(sd.x * uFace.x + sd.z * uFace.y, sd.y, -sd.x * uFace.y + sd.z * uFace.x);
  vec4 wp = modelMatrix * vec4(p, 1.);
#else
  vPlane = aUV;
#ifdef WN_LANE
  // the reflection lying down the water (lane pass). Its strokes are built all one size, a fixed pitch apart along local
  // z; here each is set a fixed RATIO nearer the eye than the last and drawn in by as much, so in the picture they are
  // evenly spaced level strokes of the column's own width from its foot to the bottom edge. Mesh z runs 0 (the foot) to
  // uLane.y (the eye); the world scales it to the eye's distance.
  { float q = 0.975 * exp(-uLane.x * max(p.z, 0.)); p.x *= q; p.z = (1. - q) * uLane.y; }
#endif
  vec4 wp = modelMatrix * vec4(p, 1.);
  wp.xyz = liftWorld(wp.xyz);
#endif
  vDist = length(wp.xz - cameraPosition.xz);
  vec4 cp = projectionMatrix * viewMatrix * wp;
  // thin marks never go under uMinPx pixels: widen across, and thin the film by the same ratio
  float px = pixelSize(cp.w);
  float hh = max(aDim.y, 1e-3);
  float want = max(hh, 0.5 * uMinPx * px);
  vFade = hh / want;
  if (want > hh) {
    vec3 sideW = normalize(mat3(modelMatrix) * sd + vec3(0., 1e-5, 0.));
    wp.xyz += sideW * (aUV.y / hh) * (want - hh);
    cp = projectionMatrix * viewMatrix * wp;
  }
  vUV = aUV; vDim = aDim; vCol = aCol; vUnder = aUnder; vExt = aExt;
  gl_Position = cp;
}`,_e=`
uniform vec3 uCanvas; uniform float uLanes; uniform float uHead; uniform float uWeave; uniform float uUnit; uniform vec2 uDisc; uniform float uOpacity; uniform float uReach; uniform float uStagger; uniform float uNear;
varying vec2 vUV; varying vec4 vDim; varying vec3 vCol; varying vec3 vUnder; varying vec4 vExt; varying float vFade; varying vec2 vPlane; varying float vDist;
${ie}
void main(){
  float pxy = length(vec2(dFdx(vUV.y), dFdy(vUV.y)));
  float pxs = length(vec2(dFdx(vUV.x), dFdy(vUV.x)));
  float px = max(pxy, 0.06 * pxs) * vFade;
  float L = vDim.x, hh = vDim.y, seed = vDim.z;
  float s = vUV.x;
  // the hand: the centre line wanders and the width swells and pinches
  float y = vUV.y + hh * 0.34 * (wn_vn(vec2(s * 0.023 + seed * 11.1, seed * 7.3)) - 0.5)
                  + hh * 0.10 * (wn_vn(vec2(s * 0.11 + seed * 2.9, seed * 1.7)) - 0.5);
  float hw = hh * (0.88 + 0.24 * wn_vn(vec2(s * 0.017 + seed * 4.1, seed * 9.9)));
  // a stroke being laid: nothing ahead of the head, a loaded lobe at it, bristle streaks opening for 60 m behind
  float behind = uHead - s - uStagger * wn_h21(vec2(seed * 57.3, 9.7));
  // seen close (a pixel under 3 cm) every stroke is thin paint: streaks open and the weave comes through even where
  // the brush was loaded; thin lines (rail, posts, echoes) keep their body
  float nearK = (1. - smoothstep(0.006, 0.06, px * uUnit)) * smoothstep(0.1, 0.7, hh * uUnit) * uNear;
  // the loaded lobe breaks into bristle streaks within a few metres, and goes on drying for 60 m
  float dry0 = vExt.y + mix(-0.75, -0.16, smoothstep(0.4, 6., behind)) + 0.16 * smoothstep(6., 60., behind) + 0.42 * nearK;
  float vv = clamp(abs(y) / max(hw, 1e-3), 0., 1.);
  float front = behind - hw * 1.2 * (1. - sqrt(max(1. - vv * vv, 0.)));
  // the leading edge is the bristles' own: notched, a few hairs ahead of the rest
  front -= hh * (0.30 * wn_vn(vec2(y * 7. / max(hh, 0.05) + seed * 7., seed * 3.)) + 0.14 * wn_vn(vec2(y * 23. / max(hh, 0.05) + seed * 5., seed * 11.)));
  float laid = smoothstep(0., max(px * 1.5, 0.02), front);
  float lip = 1. - smoothstep(0., 0.5 * hh + 0.05, front);                      // the film is thin at the lip: weave shows
  hw *= 1. + 0.3 * (1. - smoothstep(0., 2.5 * hh, behind));
  float thin, thinU;
  float cov = wn_stroke(s, y, L, hw, seed, px, dry0, thin);
  // thin paint streaks at every distance: wherever the stroke is broad on screen, dry lanes of canvas run along it
  { float lane = wn_lanes(s, y, px, 46., seed);
    float gap = (1. - smoothstep(0.2, 0.33, lane)) * smoothstep(8., 20., hh / max(px, 1e-5));
    cov *= 1. - 0.82 * gap * uLanes; thin = max(thin, gap * uLanes); }
  float covU = wn_stroke(s + 3., y + 0.22 * hh, L + 6.5, hw * 1.06, seed + 4.7, px, 0.62, thinU) * vDim.w;
  float ends = max(1. - smoothstep(0., 0.10 * L, s), smoothstep(0.78 * L, L, s));
  covU *= mix(0.22, 1., ends);
  // thin paint sits on the crowns of the weave and misses the valleys
  // the weave under the paint: its pitch follows the larger of the two screen rates; where the stroke is seen so
  // nearly end-on that a thread would be a long block, the paint takes the weave's mean instead
  vec2 gx = vec2(dFdx(vPlane.x), dFdy(vPlane.x)), gy = vec2(dFdx(vPlane.y), dFdy(vPlane.y));
  float valley = mix(wn_weaveA(vPlane, vec2(length(gx), length(gy)) * vFade, WN_PITCH / max(uUnit, 0.01)), 0.42, smoothstep(2.5, 6., wn_skew(gx, gy)));
  cov *= 1. - uWeave * valley * clamp(thin * 0.62 + 0.03 + 0.3 * nearK + 0.5 * lip * step(uHead, 1e8), 0., 1.);   // loaded paint is the pigment exactly; weave shows in it close to
  covU *= 1. - uWeave * valley * 0.6;
  float a = cov + covU * (1. - cov);
  vec3 col = (vCol * cov + vUnder * covU * (1. - cov)) / max(a, 1e-4);
  a *= laid * vFade * uOpacity;
  // the unfinished canvas (rare): no paint yet beyond uReach metres from the eye; each stroke gives out at its own distance
  { float rr = uReach * (0.72 + 0.56 * wn_h21(vec2(seed * 91.7, 3.1)));
    a *= 1. - smoothstep(rr, rr + 6. + 0.12 * rr, vDist + 22. * (wn_vn(vec2(s * 0.05 + seed * 7., y * 0.4)) - 0.5)); }
#ifdef WN_PILLAR
  if (vExt.x > 0.) {            // the head: strokes clipped to a disc with a hand-cut edge
    vec2 r = vPlane - uDisc;
    float rr = length(r) + 1.5 * (wn_vn(r * 0.16 + 3.) - 0.5) + 0.5 * (wn_vn(r * 0.7) - 0.5);
    a *= 1. - smoothstep(vExt.x - max(px, 0.05), vExt.x + max(px, 0.05), rr);
  }
#endif
  if (a < 0.02) discard;
  gl_FragColor = vec4(col, a);
}`;function ke(n={}){return new a.ShaderMaterial({vertexShader:be,fragmentShader:_e,defines:n.pillar?n.rag?{WN_PILLAR:1,WN_RAG:n.rag}:{WN_PILLAR:1}:n.lane?{WN_LANE:1}:{},uniforms:{uTime:M.uTime,uLift:M.uLift,uViewH:M.uViewH,uCanvas:M.uCanvas,uLanes:{value:n.lanes??(n.pillar?.55:1)},uMinPx:{value:n.minPx??0},uUnit:{value:n.unit??1},uHead:{value:1e9},uNear:{value:n.near??1},uReach:{value:1e9},uStagger:{value:0},uWeave:{value:n.weave??1},uOpacity:{value:1},uFace:{value:new a.Vector2(1,0)},uBreath:{value:0},uSwell:{value:0},uDisc:{value:new a.Vector2(0,0)},uLane:{value:new a.Vector2(.0104,100)}},transparent:!0,depthWrite:n.depthWrite??!1,depthTest:n.depthTest??!0,side:a.DoubleSide,forceSinglePass:!0})}async function Me(n,h){let e=0,m=0;for(const b of n)e+=b.pts.length*2,m+=(b.pts.length-1)*6;const C=new Float32Array(e*3),L=new Float32Array(e*2),g=new Float32Array(e*4),z=new Float32Array(e*3),w=new Float32Array(e*3),y=new Float32Array(e*3),i=new Float32Array(e*4),c=new Float32Array(e*4);h&&await h();const W=e>65535?new Uint32Array(m):new Uint16Array(m);let o=0,Q=0,ve=0;h&&await h();for(const b of n){const A=b.pts,I=A.length,Z=b.margin??4,he=b.half,G=he*1.5;let K=0;const J=[0];for(let u=1;u<I;u++)K+=Math.hypot(A[u][0]-A[u-1][0],A[u][1]-A[u-1][1],A[u][2]-A[u-1][2]),J.push(K);const de=Math.max(K-2*Z,1),T=b.color,P=b.under||b.color,N=b.wave||[0,100,0,0],U=b.ext||[0,0,0];for(let u=0;u<I;u++){const X=A[Math.max(u-1,0)],B=A[Math.min(u+1,I-1)];let H,R,O;const E=typeof b.side=="function"?b.side(u):b.side;if(E)H=E[0],R=E[1],O=E[2];else{const S=B[0]-X[0],F=B[2]-X[2],V=Math.hypot(S,F)||1;H=-F/V,R=0,O=S/V}for(let S=0;S<2;S++){const F=S?1:-1;C[o*3]=A[u][0]+H*G*F,C[o*3+1]=A[u][1]+R*G*F,C[o*3+2]=A[u][2]+O*G*F,L[o*2]=J[u]-Z,L[o*2+1]=G*F,g[o*4]=de,g[o*4+1]=he,g[o*4+2]=b.seed??.5,g[o*4+3]=b.underAmt??0,z[o*3]=T.r,z[o*3+1]=T.g,z[o*3+2]=T.b,w[o*3]=P.r,w[o*3+1]=P.g,w[o*3+2]=P.b,y[o*3]=H,y[o*3+1]=R,y[o*3+2]=O,i[o*4]=N[0],i[o*4+1]=N[1],i[o*4+2]=N[2],i[o*4+3]=N[3],c[o*4]=U[0],c[o*4+1]=b.dry??0,c[o*4+2]=U[1],c[o*4+3]=U[2],o++}if(u<I-1){const S=o-2;W[Q++]=S,W[Q++]=S+1,W[Q++]=S+2,W[Q++]=S+1,W[Q++]=S+3,W[Q++]=S+2}}h&&++ve%6===0&&await h()}h&&await h();const q=new a.BufferGeometry;return q.setAttribute("position",new a.BufferAttribute(C,3)),q.setAttribute("aUV",new a.BufferAttribute(L,2)),q.setAttribute("aDim",new a.BufferAttribute(g,4)),q.setAttribute("aCol",new a.BufferAttribute(z,3)),q.setAttribute("aUnder",new a.BufferAttribute(w,3)),q.setAttribute("aSide",new a.BufferAttribute(y,3)),q.setAttribute("aWave",new a.BufferAttribute(i,4)),q.setAttribute("aExt",new a.BufferAttribute(c,4)),q.setIndex(new a.BufferAttribute(W,1)),q}function ze(n={}){return new a.ShaderMaterial({defines:n.dome?{WN_DOME:1}:{},uniforms:{uLift:n.lift===!1||n.dome?{value:0}:M.uLift,uViewH:M.uViewH,uCanvas:M.uCanvas},vertexShader:`
      varying vec3 vW; varying vec3 vD;
      ${re}
      void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vD = position; wp.xyz = liftWorld(wp.xyz); vW = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:`
      uniform vec3 uCanvas; varying vec3 vW; varying vec3 vD;
      ${ie}
      void main(){
      #ifdef WN_DOME
        vec3 d = normalize(vD + vec3(1e-4, 0., 1e-4));
        vec2 q = vec2(atan(d.x, d.z + 1e-5) * 600., d.y * 700.);
      #else
        vec2 q = vW.xz;
      #endif
        vec2 gx = vec2(dFdx(q.x), dFdy(q.x)), gy = vec2(dFdx(q.y), dFdy(q.y));
        float v = mix(wn_weaveA(q, vec2(length(gx), length(gy)), WN_PITCH), 0.42, smoothstep(2.5, 6., wn_skew(gx, gy)));
        vec2 qs = q + 60. * vec2(wn_vn(q * 0.013 + 3.), wn_vn(q * 0.013 + 11.)) + 9. * vec2(wn_vn(q * 0.09), wn_vn(q * 0.09 + 5.));
        float stain = wn_vn(qs * 0.009 + 7.) * 0.7 + wn_vn(vec2(qs.x + qs.y, qs.y - qs.x) * 0.021) * 0.3;
        float tide = smoothstep(0.585, 0.605, stain) * (1. - smoothstep(0.605, 0.70, stain));   // the dried edge of a water stain
        float tone = 1.03 - 0.06 * v - 0.014 * tide - 0.03 * smoothstep(0.42, 0.72, stain) - 0.012 * (wn_vn(q * vec2(0.5, 0.07)) - 0.5);
        gl_FragColor = vec4(uCanvas * tone, 1.);
      }`,side:n.side??(n.dome?a.BackSide:a.FrontSide),depthWrite:!n.dome})}function We(n={}){return new a.ShaderMaterial({uniforms:{uLift:M.uLift,uViewH:M.uViewH,uCanvas:M.uCanvas,uCol:{value:(n.color||new a.Color($[3])).clone()},uThin:{value:n.thin??.75}},vertexShader:`
      attribute float aEdge; varying float vEdge; varying vec3 vP;
      ${re}
      void main(){ vEdge = aEdge; vP = position; vec4 wp = modelMatrix * vec4(position, 1.); wp.xyz = liftWorld(wp.xyz);
        gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:`
      uniform vec3 uCanvas, uCol; uniform float uThin; varying float vEdge; varying vec3 vP;
      ${ie}
      void main(){
        float h = vP.x * 0.8 + vP.z * 0.6;                                  // along the mass
        float px = max(length(vec2(dFdx(h), dFdy(h))), 1e-4);
        float f1 = 1. - smoothstep(0.2, 0.6, px), f2 = 1. - smoothstep(0.04, 0.12, px);
        float n = 0.65 * mix(0.5, wn_vn(vec2(h * 0.8, vP.y * 0.035)), f1) + 0.35 * mix(0.5, wn_vn(vec2(h * 4.5, vP.y * 0.12 + 3.)), f2);
        float th = mix(-0.3, 0.2 + 0.75 * uThin, vEdge * vEdge);
        float aa = clamp(fwidth(n - th), 0.02, 0.1) + 0.06 * (1. - f1);
        float cov = smoothstep(-aa, aa, n - th);
        cov *= 1. - wn_weave(vec2(h, vP.y), 0.35, px) * 0.9 * vEdge;      // the body of the mass is the pigment exactly
        gl_FragColor = vec4(mix(uCanvas, uCol, cov), 1.);
      }`})}function Se(n){const e=new a.InstancedBufferGeometry,m=[],C=[];for(let i=0;i<=6;i++)m.push(-1,i/6,0,1,i/6,0);for(let i=0;i<6;i++){const c=i*2;C.push(c,c+2,c+1,c+1,c+2,c+3)}e.setAttribute("position",new a.Float32BufferAttribute(m,3)),e.setIndex(C);const L=n.length,g=new Float32Array(L*2),z=new Float32Array(L*3),w=new Float32Array(L*4),y=new Float32Array(L*3);return n.forEach((i,c)=>{z.set([i.x,i.y,i.z],c*3),w.set([i.width,i.length,i.seed,i.at],c*4),y.set([i.color.r,i.color.g,i.color.b],c*3),g.set([i.slide||0,i.phase||0],c*2)}),e.setAttribute("iPos",new a.InstancedBufferAttribute(z,3)),e.setAttribute("iDim",new a.InstancedBufferAttribute(w,4)),e.setAttribute("iCol",new a.InstancedBufferAttribute(y,3)),e.setAttribute("iSlide",new a.InstancedBufferAttribute(g,2)),e.instanceCount=L,e}function Le(n={}){return new a.ShaderMaterial({defines:n.pillar?{WN_PILLAR:1}:{},uniforms:{uLift:M.uLift,uViewH:M.uViewH,uRun:{value:0},uFace:{value:new a.Vector2(1,0)},uGrow:{value:new a.Vector2(1e8,1e9)},uBreath:{value:0},uSwell:{value:0}},vertexShader:`
      attribute vec3 iPos; attribute vec4 iDim; attribute vec3 iCol; attribute vec2 iSlide;
      uniform float uRun; uniform vec2 uFace; uniform float uBreath; uniform float uSwell; uniform vec2 uGrow;
      varying vec3 vCol; varying vec3 vQ; varying vec2 vWL; varying float vFade;
      ${re}
      void main(){
        float len = iDim.y * smoothstep(iDim.w, iDim.w + 0.4, uRun);
      #ifndef WN_PILLAR
        len *= 1. - smoothstep(uGrow.x, max(uGrow.y, uGrow.x + 1.), length((modelMatrix * vec4(iPos, 1.)).xz - cameraPosition.xz));
      #endif
        float t = position.y;
        vec3 p = iPos; p.y -= t * len;
        p.x += 0.07 * sin(p.y * 0.9 + iDim.z * 40.) * smoothstep(0., 2., t * len);       // it finds its way down the weave
      #ifdef WN_PILLAR
        p.x = p.x * (1. + uSwell * sin(6.2832 * uBreath * 0.5 + iSlide.y * 0.3)) + iSlide.x * sin(6.2832 * uBreath + iSlide.y);
        vec3 ax = vec3(uFace.x, 0., -uFace.y);
        p = vec3(p.x * uFace.x + p.z * uFace.y, p.y, -p.x * uFace.y + p.z * uFace.x);
        vec4 wp = modelMatrix * vec4(p, 1.);
      #else
        vec3 ax = normalize(vec3(viewMatrix[0][0], 0., viewMatrix[2][0]) + vec3(1e-5, 0., 0.));   // faces the eye about the vertical
        vec4 wp = modelMatrix * vec4(p, 1.); wp.xyz = liftWorld(wp.xyz);
      #endif
        vec4 cp = projectionMatrix * viewMatrix * wp;
        float hw = 0.5 * iDim.x * 1.5, want = max(hw, 0.75 * pixelSize(cp.w));      // never under 1.5 pixels
        vFade = sqrt(hw / want) * step(0.02, len);
        wp.xyz += normalize(mat3(modelMatrix) * ax) * position.x * want;
        vCol = iCol; vQ = vec3(position.x * 1.5, t * len, len); vWL = vec2(iDim.x * 0.5, iDim.z);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,fragmentShader:`
      varying vec3 vCol; varying vec3 vQ; varying vec2 vWL; varying float vFade;
      ${ie}
      void main(){
        float a = abs(vQ.x), down = vQ.y, len = vQ.z, hw = max(vWL.x, 1e-3);
        float db = (len - down) / hw;                                    // distance from the tip in half widths
        float neck = mix(1.0, 0.46, smoothstep(0., 2.5, down)) * (0.75 + 0.5 * wn_vn(vec2(vWL.y * 31., down * 0.3)));
        float q = (db - 2.2) / 2.2;
        float tip = 0.68 * sqrt(max(1. - q * q, 0.));                       // the heavier end of the run, a long drop
        float w = max(neck * step(2.2, db), max(tip, neck * (1. - step(2.2, db)) * step(q * q, 1.) * sqrt(max(1. - q * q, 0.))));
        float e = max(fwidth(a), 1e-3);
        float cov = 1. - smoothstep(w - e, w + e, a);
        float pxm = max(length(vec2(dFdx(down), dFdy(down))), 1e-4);
        float film = smoothstep(0.15, 0.6, wn_vn(vec2(vWL.y * 17., down * 0.22)) + 0.5 * step(db, 5.));   // thinned paint: it breaks, then gathers at the tip
        cov *= 1. - wn_weaveR(vec2(vQ.x * hw + vWL.y * 50., down), pxm, WN_PITCH) * mix(0.6, 0.1, film);
        if (cov * vFade < 0.02) discard;
        gl_FragColor = vec4(vCol, cov * vFade);
      }`,transparent:!0,depthWrite:n.depthWrite??!1,side:a.DoubleSide,forceSinglePass:!0})}const Ae=44,we=250,Fe=27,ce=19,le=35;async function Ee(n,h={}){const e=n.rng.fork?n.rng.fork("white-night-pillar"):n.rng,m=!!h.billboard,C=m?.5:6,L=h.shaftW??Ae,g=h.headR??Fe,z=we+g-4,w=!!h.gaps,y=ye(h.palette);M.uCanvas.value.copy(y.canvas);const i=Math.min(1,Math.max(.6,h.detail??1)),c=h.wind??e.chance(.3),W=new a.Group;W.name="pillar-of-the-white-night";const o=[],Q=[],ve=w?c?46:32:c?70:46,q=c?3.2:5,b=c?5.6:9,A=[],I=(t,s,d)=>{const f=[],v=[];let _=0;for(let l=0;l<d;l++){const r=e.range(q,b);f.push(r);const k=r*e.range(c?.64:.5,1.04);v.push(k),_+=k}let x=t;const p=(s-t)/_;for(let l=0;l<d;l++){const r=w?v[l]*p*e.range(.92,1.04):Math.min(f[l],v[l]*p*1.7);A.push({y:x+v[l]*p*.5,h:r}),x+=v[l]*p}},Z=c?5:3;if(m?I(.5,we,ve+2):(I(.5,ce-.5,Z),I(le+.5,we,ve-Z)),!m)for(const t of A){const s=t.h*.575+.5;t.y<(ce+le)/2?t.y=Math.min(t.y,ce-s+1.2):t.y=Math.max(t.y,le+s-1.2)}const he=t=>(t*2+(e.chance(.35)?1:0))%3,G=(t,s,d,f,v,_,x,p,l)=>{for(let r=0;r<_;r++){let k=t+e.range(-.47,.47)*f;Math.abs(k)<x&&(k=(k<0?-1:1)*(x+e.range(0,4)));const D=e.chance(p?.45:.16);Q.push({x:k,y:s-d*e.range(.05,.3),z:v+.012,width:(m?e.range(.3,.7)*(w?1.5:1):e.range(.15,.4))*(D?m?1.6:1.25:1),length:d*.3+(D?e.range(7,14)*(w?1.5:1):e.range(1.5,6)),seed:e(),at:e.range(0,.55),slide:l[1],phase:l[2],color:e.chance(.05)?y.pink:y.gold})}};A.forEach((t,s)=>{const d=he(s),f=(d-1)*C+s*.004,v=w?L*e.range(.86,1.08):L+(m?e.range(-4.2,-.6):e.range(-1.6,1.6)),_=w?e.range(-.05,.05)*L:e.range(-1,1),x=e.chance(.5)?1:-1,p=w?e.range(-.06,.06):m?e.range(-.035,.035):e.range(-.008,.008),l=w?e.range(-.7,.7):m?e.range(-1,1):e.range(-.35,.35),r=w?2:4,k=[],D=18,ae=_-x*(v/2+r),pe=_+x*(v/2+r);for(let j=0;j<=D;j++){const oe=j/D,se=ae+(pe-ae)*oe;k.push([se,t.y+p*se+l*(4*oe*(1-oe)-.6),f])}const ne=!m&&Math.abs(t.y-t.h/2-le)<4;o.push({pts:k,half:t.h/2,side:[0,1,0],color:y.gold,under:y.pink,underAmt:e.range(.4,.9),seed:e(),dry:w?e.range(-.62,-.34):e.range(-.5,-.02),margin:r,z:f,wave:[e.range(.3,.7),e.range(60,130),e.range(0,6.28),e.range(.5,1)*(e.chance(.5)?1:-1)],ext:[0,e.range(1.1,2.3)*(m?.42:1)*(e.chance(.8)?1:-1),t.y*.07+e.range(-.7,.7)]}),G(_,t.y,t.h,v,f,Math.round((ne?16:e.int(5,10))*i),ne?3.2:0,ne,o[o.length-1].ext)}),await n.yield();const K=Math.max(5,Math.round(11*g/27+(w?.6:0))),J=z-g+1,de=z+g-1;for(let t=0;t<K;t++){const s=J+(de-J)*(t+.5)/K+e.range(-.8,.8),d=w?e.range(4.6,5.8):e.range(5.6,8.2),f=Math.min(Math.abs(s-z),g-2),v=2*Math.sqrt(g*g-f*f)+(e.chance(.3)?4:13),_=(t*2+1)%3,x=(_-1)*C+.3+t*.004,p=e.chance(.5)?1:-1,l=3,r=[],k=12,D=e.range(-.8,.8),ae=D-p*(v/2+l),pe=D+p*(v/2+l),ne=e.range(-.012,.012);for(let j=0;j<=k;j++){const oe=j/k,se=ae+(pe-ae)*oe;r.push([se,s+ne*se,x])}o.push({pts:r,half:d/2,side:[0,1,0],color:y.gold,under:y.pink,underAmt:e.range(.4,.8),seed:e(),dry:e.range(-.45,-.15),margin:l,z:x,wave:[e.range(.2,.45),e.range(60,110),e.range(0,6.28),e.range(.4,.8)],ext:[g,e.range(.5,1.2)*(e.chance(.5)?1:-1),e.range(0,6.28)]}),s<z&&G(D,s,d,v*.7,x,Math.round(e.int(2,4)*i),0,!1,o[o.length-1].ext)}{const s=-1.75+e.range(-.12,.12),d=5.05+e.range(-.2,.15),f=[],v=[],_=e.range(0,6.28),x=e.range(3,4.2);for(let p=0;p<=64;p++){const l=p/64,r=s+d*l,k=g+x+1.1*Math.sin(r*1.7+_)+.5*Math.sin(r*4.3+_*2)+1.6*l*l;f.push([Math.cos(r)*k,z+Math.sin(r)*k,C+.6]),v.push([Math.cos(r),Math.sin(r),0])}o.push({pts:f,half:.9,side:p=>v[p],color:y.madder,under:y.madder,underAmt:0,seed:e(),dry:-.3,margin:2,z:C+.6,wave:[.3,400,e.range(0,6.28),.55],ext:[0,0,0]})}if(m){const t=n.rng.fork?n.rng.fork("white-night-pillar-echo"):e;for(const[s,d,f]of w?[[-1,52,131],[1,148,226]]:[[-1,9,118],[-1,131,243],[1,30,171],[1,183,247]]){const v=[],_=Math.max(8,Math.round((f-d)/6)),x=t.range(0,6.28),p=t.range(3.2,4.4);for(let l=0;l<=_;l++){const r=d+(f-d)*l/_;v.push([s*(L/2+p+1*Math.sin(r*.05+x)+.45*Math.sin(r*.17+x*2)),r,C+.6])}s>0&&v.reverse(),o.push({pts:v,half:.85,side:[1,0,0],color:y.madder,under:y.madder,underAmt:0,seed:t(),dry:t.range(-.3,0),margin:2,z:C+.6,wave:[.35,160,t.range(0,6.28),.5],ext:[0,0,0]})}}o.sort((t,s)=>t.z-s.z);const T=await Me(o,n.yield);T.boundingSphere=new a.Sphere(new a.Vector3(0,150,0),170);const P=ke({pillar:!0,depthWrite:!0,minPx:1.5,lanes:w?.38:m?.6:void 0,rag:w?"0.22":m?"0.05":void 0});P.uniforms.uDisc.value.set(0,z),P.uniforms.uSwell.value=.034;const N=new a.Mesh(T,P);N.renderOrder=40,N.frustumCulled=!1,W.add(N);const U=new a.BufferGeometry;for(const t of Object.keys(T.attributes))U.setAttribute(t,T.attributes[t]);{const t=T.index.array,s=new t.constructor(t.length);for(let d=0,f=t.length/3;d<f;d++){const v=(f-1-d)*3;s[d*3]=t[v],s[d*3+1]=t[v+1],s[d*3+2]=t[v+2]}U.setIndex(new a.BufferAttribute(s,1))}U.boundingSphere=T.boundingSphere;const u=new a.Mesh(U,P);u.renderOrder=40,u.frustumCulled=!1,u.visible=!1,W.add(u),await n.yield(),Q.sort((t,s)=>t.z-s.z);const X=Se(Q);X.boundingSphere=new a.Sphere(new a.Vector3(0,150,0),170);const B=Le({pillar:!0,depthWrite:!1});B.uniforms.uSwell.value=.034;const H=new a.Mesh(X,B);H.renderOrder=41,H.frustumCulled=!1,W.add(H),await n.yield();const R=null,O=new a.Vector3,E=new a.Vector3,S=a.MathUtils.smoothstep;let F=0,V=0,ee=!1,fe=null,ue=null;const me=h.side??1,te=R&&R.view?-40:h.freeze??150;function xe(t,s,d){M.uTime.value=s,d.getWorldPosition(O),W.updateWorldMatrix(!0,!1),E.copy(O),W.worldToLocal(E);const f=Math.hypot(E.x,E.z);if(f>.001){const p=Math.atan2(E.x,E.z);if(m)F=p,V=p,ee=!0;else if(te>0){const r=S(f,30,te),k=E.x*r,D=.643*E.z+.766*k*me>0;F=Math.atan2(k,Math.abs(E.z)<1e-4?1e-4:E.z)+(D?Math.PI:0),V=F,ee=!0}else{ee||(V=p,ee=!0);let r=p-V;r-=Math.round(r/Math.PI)*Math.PI,f>=te+40?(V+=r,F=V):F=V+r*S(f,te,te+40)}const l=Math.cos(p-F)>=0;N.visible=l,u.visible=!l}const v=Math.cos(F),_=Math.sin(F);P.uniforms.uFace.value.set(v,_),B.uniforms.uFace.value.set(v,_);const x=fe===null?s/41:fe;P.uniforms.uBreath.value=x*9,B.uniforms.uBreath.value=x*9,B.uniforms.uRun.value=ue===null?1-S(f,150,640):ue,R&&R.update(t,s,d)}const ge={slit:{center:[0,27,0],height:le-ce,width:L},flyThrough:[[0,27,-220],[0,27,-90],[0,27,-20],[0,27,0],[0,27,20],[0,30,70],[0,55,140]],portalSeat:{position:[121,5,20],facing:[.7071,0,.7071],radius:7},viewpoints:{first:[0,2.5,-780],reveal:[-9,4,-357],middle:[0,24,-150],exit:[171,5,70]},headCenter:[0,z,0],headRadius:g,footprint:{width:L+4,depth:2*C+2}},Y=R?R.view:null;return{object:W,radius:Y?Y[0]:150,height:Y?Y[1]:300,center:new a.Vector3(0,Y?Y[2]:150,0),anchors:ge,update:xe,setProgress(t){fe=t},setRuns(t){ue=t},snapFacing(){ee=!1},materials:{stroke:P,runs:B},windy:c,dispose(){},ground:!1,groundY:0}}function qe(n={}){return new a.ShaderMaterial({defines:n.rim?{WN_RIM:1}:{},uniforms:{uLift:M.uLift,uViewH:M.uViewH,uCanvas:M.uCanvas,uTime:M.uTime,uThin:{value:n.thin??.75},uReach:{value:1e9},uEdgeAmt:{value:1},uLanes:{value:n.lanes??1},uStreak:{value:n.streak??0},uShade:{value:(n.shade||new a.Color($[0])).clone()},uLit:{value:new a.Color($[2])},uLine:{value:new a.Color($[6])}},vertexShader:`
      attribute vec3 aCol; attribute vec2 aQ; attribute float aEdge; attribute float aShade;
      varying vec3 vCol; varying vec2 vQ; varying float vEdge; varying float vShade; varying float vDist; varying float vRim;
      uniform float uEdgeAmt;
      ${re}
      void main(){
        vCol = aCol; vQ = aQ; vEdge = aEdge * uEdgeAmt; vShade = aShade;
        vec4 wp = modelMatrix * vec4(position, 1.);
        vRim = 1.;
      #ifdef WN_RIM
        vec3 n = normalize(mat3(modelMatrix) * normal + vec3(0., 1e-5, 0.));
        vec3 v = normalize(cameraPosition - wp.xyz + vec3(1e-4));
        vRim = abs(dot(n, v));
      #endif
        wp.xyz = liftWorld(wp.xyz);
        vDist = length(wp.xz - cameraPosition.xz);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,fragmentShader:`
      uniform vec3 uCanvas, uShade, uLine, uLit; uniform float uThin, uReach, uTime, uLanes, uStreak;
      varying vec3 vCol; varying vec2 vQ; varying float vEdge; varying float vShade; varying float vDist; varying float vRim;
      ${ie}
      void main(){
        float px = max(max(length(vec2(dFdx(vQ.x), dFdy(vQ.x))), 0.05 * length(vec2(dFdx(vQ.y), dFdy(vQ.y)))), 1e-4);
        // long downward strokes: lanes 12 m, 2.5 m and 0.5 m across, stretched 20 to 1 down the form; a lane the
        // eye cannot resolve (under 3 pixels) is replaced by its mean, so a far mass is flat paint with a cut edge
        float f0 = 1. - smoothstep(1.6, 4.0, px), f1 = 1. - smoothstep(0.35, 0.85, px), f2 = 1. - smoothstep(0.07, 0.17, px);
        float n0 = wn_vn(vec2(vQ.x * 0.085, vQ.y * 0.006 + 1.7));
        float n1 = wn_vn(vec2(vQ.x * 0.42, vQ.y * 0.022 + 5.1));
        float n2 = wn_vn(vec2(vQ.x * 2.1, vQ.y * 0.1 + 3.));
        float n = 0.4 * mix(0.5, n0, f0) + 0.34 * mix(0.5, n1, f1) + 0.26 * mix(0.5, n2, f2);
        // paint thins to bare canvas only at the contour (aEdge 1): a ragged, streaked edge, never a gradient
        float th = mix(0.12, 0.22 + 0.62 * uThin, vEdge);
        float aa = clamp(fwidth(n - th) * 0.9, 0.012, 0.05);
        // inside the mass the long downward strokes leave a few dry slits of canvas, seen only where the lanes resolve
        float slit = 0.33;
      #ifdef WN_RIM
        slit = mix(0.19, 0.33, smoothstep(0.1, 0.4, vCol.g));      // a dark crown seen close keeps its body: a slit of canvas now and then, never a hole
      #endif
        float cov = mix(smoothstep(-aa, aa, n - mix(-1., slit, 1. - smoothstep(0.05, 0.13, px))), smoothstep(-aa, aa, n - th), smoothstep(0.02, 0.2, vEdge));
        vec2 gx = vec2(dFdx(vQ.x), dFdy(vQ.x)), gy = vec2(dFdx(vQ.y), dFdy(vQ.y));
        float wv = mix(wn_weaveA(vQ, vec2(length(gx), length(gy)), WN_PITCH), 0.42, smoothstep(2.5, 6., wn_skew(gx, gy)));
        // the long downward strokes at every distance (polish pass): dry lanes of canvas run down the form, more of them
        // toward the contour, gathered in patches so the mass is scrubbed here and loaded there
        { float lane = wn_lanes(vQ.y, vQ.x, px, 15., 0.37);
          float clump = wn_vn(vec2(vQ.x * 0.021 + 3.7, vQ.y * 0.004));
          float gap = 1. - smoothstep(0.1, 0.3, lane - 0.3 * (clump - 0.5) - 0.12 * vEdge);
          cov *= 1. - 0.7 * gap * uLanes; }
        cov *= 1. - wv * 0.22 * vEdge * mix(0.3, 1., smoothstep(0.05, 0.15, vCol.g));
        // seen close, the threads show through any paint (a third as much through the green-black, which is loaded: a dark
        // crown must not read as a net of light dots)
        cov *= 1. - wv * 0.17 * (1. - smoothstep(0.012, 0.06, length(gx) + length(gy))) * mix(0.3, 1., smoothstep(0.05, 0.15, vCol.g));
        vec3 col = vCol;
        // (lane pass) opts.streak: the dark mass is not one flat green-black. Among its long downward strokes a go of the
        // ultramarine is laid here and there, streaked, gathered in patches, lanes the eye can always resolve
        { float ln2 = wn_lanes(vQ.y + 40., vQ.x + 31.7, px, 22., 0.71);
          float cl2 = wn_vn(vec2(vQ.x * 0.035 + 9.1, vQ.y * 0.006 + 2.));
          float st = smoothstep(0.77, 0.84, ln2 + 0.45 * (cl2 - 0.5)) * uStreak * (1. - smoothstep(0.06, 0.2, vCol.g));
          col = mix(col, uShade, 0.9 * st); }
        // the one shade stroke: streaked, dry at its ends
        float sn = 0.3 * (mix(0.5, wn_vn(vec2(vQ.x * 0.5, vQ.y * 3.)), f1) - 0.5) + 0.16 * (mix(0.5, wn_vn(vec2(vQ.x * 2.5, vQ.y * 14.)), f2) - 0.5);
        float sa = clamp(fwidth(vShade + sn) * 0.9, 0.01, 0.06);
        float sh = smoothstep(0.5 - sa, 0.5 + sa, vShade + sn);
        col = mix(col, uShade, sh);
        cov = max(cov, sh);
        float lt = smoothstep(0.5 - sa, 0.5 + sa, -vShade + sn);      // the lit stroke (negative aShade): the gold, on stones and crowns by the pillar
        col = mix(col, uLit, lt);
        cov = max(cov, lt);
        vec3 c = mix(uCanvas * (1.03 - 0.06 * wv), col, cov);
      #ifdef WN_RIM
        // the contour: a madder line where the form turns away, broken where the hand lifts (it never closes)
        float brk = wn_vn(vec2(vQ.x * 0.5 + 7., 2.3));
        float w = 0.26 + 0.13 * wn_vn(vec2(vQ.x * 1.7, vQ.y * 0.8));
        float aw = clamp(fwidth(vRim) * 0.9, 0.008, 0.1);
        float rim = (1. - smoothstep(w - aw, w + aw, vRim)) * smoothstep(0.26, 0.3, brk);
        c = mix(c, uLine, rim);
      #endif
        // the unfinished canvas (rare): beyond the reach a solid is bare canvas inside its contour; the edge of the
        // painted part is a streaked one
        float rr = uReach * (0.85 + 0.3 * wn_vn(vec2(vQ.x * 0.02, 5.)));
        float ut = (vDist - rr) / 50. + 1.4 * (wn_vn(vec2(vQ.x * 0.045, vQ.y * 0.004 + 2.)) - 0.5) + 0.5 * (n - 0.5);
        float uw = clamp(fwidth(ut), 0.004, 0.06);
        float un = smoothstep(-uw, uw, ut) * step(uReach, 1e8);
        c = mix(c, uCanvas, un);
        gl_FragColor = vec4(c, 1.);
      }`,side:n.side??a.FrontSide})}export{re as LIFT_GLSL,$ as PALETTE,Ce as PIGMENT,_e as STROKE_FRAG,be as STROKE_VERT,M as STYLE,ie as STYLE_GLSL,Ee as buildHero,ze as canvasMaterial,We as massMaterial,ye as pigments,Se as runGeometry,Le as runMaterial,qe as solidMaterial,Me as strokeGeometry,ke as strokeMaterial};
