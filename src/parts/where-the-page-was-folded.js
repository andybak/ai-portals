import*as t from"three";import{mergeGeometries as Ke}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as W,lerp as L,smoothstep as R,makeRng as je,hashSeed as Ze}from"../kit/core.js";const N=260,fe=130,Se=180,Be=[[-300,14,180,45],[0,14,180,45],[440,28,75,40],[730,58,60,100],[900,77,38,165],[1e3,83,22,180],[1150,87,9,180],[1210,89.6,1,180],[1500,89.6,1,180]],$e=Be.map(F=>F[0]);function He(F){let A=1;for(;A<Be.length-1&&F>Be[A][0];)A++;const k=Be[A-1],E=Be[A],w=W((F-k[0])/(E[0]-k[0]),0,1),V=w*w*(3-2*w);return{slope:L(k[1],E[1],V)*Math.PI/180,halfGap:L(k[2],E[2],V),pathY:L(k[3],E[3],V)}}function et(F,A,k=new t.Vector3){const E=He(F).slope,w=.4*Math.exp(-(A*A)/2.2);return k.set(A*Math.cos(E)+(w-.4)*Math.sin(E)*.3,A*Math.sin(E)-w*Math.cos(E),F)}const _e={day:{card:"#F5F3EE",blank:"#FBFAF7",fold:"#DADCDF",black:"#15151A",slate:"#6E7887",mist:"#B4BBC6",carmine:"#C3243B",rose:"#EAA3AC",orange:"#E88B3C",seaGreen:"#4FA78F",blue:"#5A86C6",yellow:"#EDCB57"},dawn:{card:"#F3EBDD",blank:"#F9F4EA",fold:"#DCD3C4",black:"#3B2A1E",slate:"#8A735F",mist:"#C9B9A6",carmine:"#A8324A",rose:"#E0A5AE",orange:"#E88B3C",seaGreen:"#4FA78F",blue:"#E88B3C",yellow:"#4FA78F"},golden:{card:"#E6D3A8",blank:"#EEDFBC",fold:"#CDBB92",black:"#1B2233",slate:"#59647C",mist:"#A3A796",carmine:"#2F8F7F",rose:"#9CCBB8",orange:"#E88B3C",seaGreen:"#4FA78F",blue:"#5A86C6",yellow:"#EDCB57"},night:{card:"#17171C",blank:"#101014",fold:"#2A2C33",black:"#F2F0EA",slate:"#A9AEB8",mist:"#6E7887",carmine:"#C3243B",rose:"#EAA3AC",orange:"#E88B3C",seaGreen:"#4FA78F",blue:"#5A86C6",yellow:"#EDCB57"}},ne=`
#define FIG_R 160.
uniform vec3 uCard, uFold, uSlate, uInk[6], uThin[6], uHi[6];   // full-strength ink, its thinned wash, its wet highlight
uniform float uTime, uViewH;
// THE SECOND FOLD (the rare event): a horizontal crease at path height. uFold2 = (how far it has opened 0..1, 0, 1 when the
// world has one). Objects drawn under a y-flipped parent (modelMatrix[1].y < 0) are folded about it; the fragment stage
// keeps the original above the crease and the folded copy below it. With uFold2.z = 0 nothing is folded or clipped.
uniform vec3 uFold2;
float fold2Y(float z){ return uFold2.x * (mix(100., 165., smoothstep(730., 900., z)) + 15. * smoothstep(900., 1000., z)) * smoothstep(650., 740., z); }
vec3 foldW(vec3 w, float my){ if (my < 0.) w.y = 2. * fold2Y(w.z) + w.y; return w; }
float h21(vec2 p){ p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float fbm3(vec2 p){ return vn(p) * .5 + vn(p * 2.03 + 7.1) * .3 + vn(p * 4.1 + 3.7) * .2; }
vec3 inkAt(float idx){ int i = int(clamp(idx + .5, 0., 5.)); return uInk[i]; }
vec3 thinAt(float idx){ int i = int(clamp(idx + .5, 0., 5.)); return uThin[i]; }
vec3 hiAt(float idx){ int i = int(clamp(idx + .5, 0., 5.)); return uHi[i]; }
// ink thinned by t 0..1 in flat steps that meet without mixing (black goes by way of slate)
vec3 wash2(float idx, float t, float w){ t = clamp(t, 0., 1.); float q = smoothstep(.33 - w, .33 + w, t) * .5 + smoothstep(.69 - w, .69 + w, t) * .5;
  vec3 full = inkAt(idx), pale = thinAt(idx); vec3 mid = idx < .5 ? uSlate : mix(full, pale, .5);
  return q < .5 ? mix(full, mid, q * 2.) : mix(mid, pale, q * 2. - 1.); }
vec3 wash(float idx, float t){ return wash2(idx, t, .03); }
// the only light: the white slit overhead, mirrored in wet ink. n and v are unit, world space, v toward the eye.
float slit(vec3 n, vec3 v, float lo, float hi){ n = n * sign(dot(n, v) + 1e-5); vec3 r = reflect(-v, n);
  return smoothstep(lo, hi, r.y); }
// The Figure's own colouring, shared by its wing and by the prints it leaves on the card.
// f = field texel (r: rim distance, .5 on the rim, +1/96 per metre inward; g: vein; b: pooled depth; a: band noise)
// q = (s, r) in metres on the wing; st = (red 0..1, stripes 0..1, seed)
float figBand(vec2 q, float seed, out float id){
  float y = q.y * .058 + (vn(vec2(q.x * .012, q.y * .02) + seed) - .5) * 1.1 + (vn(q * .13 + seed) - .5) * .3 + (vn(q * .47 - seed) - .5) * .1;      // streaks 17 m apart, running along the hinge (so they lie ACROSS each arm of the tall V)
  id = floor(y); float fy = fract(y), w = .34 + .26 * h21(vec2(id, seed));
  float taper = smoothstep(.16, .4, vn(vec2(q.x * .017 + id * 3.7, id + seed)));   // each starts and stops somewhere
  float hw = w * .5 * taper; return 1. - smoothstep(hw - .03, hw, abs(fy - .5)); }
// (the print on the card keeps the streaks it was first drawn with: narrower, 20 m apart, inks by lot)
float figBandP(vec2 q, float seed, out float id){
  float y = q.y * .05 + (vn(vec2(q.x * .012, q.y * .02) + seed) - .5) * 1.3 + (vn(q * .13 + seed) - .5) * .3 + (vn(q * .47 - seed) - .5) * .1;
  id = floor(y); float fy = fract(y), w = .28 + .4 * h21(vec2(id, seed));
  float taper = smoothstep(.25, .5, vn(vec2(q.x * .017 + id * 3.7, id + seed)));
  float hw = w * .5 * taper; return 1. - smoothstep(hw - .03, hw, abs(fy - .5)); }
float seed2(float s){ return s * 2.3 + 11.; }
float figReach(vec4 f, vec2 q, vec3 st){ return FIG_R * (1. - st.x * .42) - f.g * st.x * 105. - (vn(q * .05 + st.z) - .5) * 26. - (vn(q * .31 + st.z) - .5) * 6.; }
float figFront(vec2 q, vec3 st, float id){ return q.x + (vn(q * .09 + seed2(st.z)) - .5) * 34. + (vn(q * .4) - .5) * 7. - 130. + 260. * (st.y * 1.1 - h21(vec2(id * 7.3, st.z + 2.))) / .09; }
float figInkIndex(vec4 f, vec2 q, vec3 st, out float thin){
  float idx = 0.; thin = 0.;
  if (st.x > .001 && q.y > figReach(f, q, st)) idx = 1.;                        // carmine from the tips, running in along veins
  float id; float b = figBand(q, st.z, id);
  if (b > .5 && figFront(q, st, id) > 0.) { float pick = h21(vec2(id, st.z * 3.1 + 5.));
    idx = pick < .12 ? 1. : 2. + mod(id + floor(h21(vec2(st.z, 9.)) * 4.), 4.); }     // the four washes in turn, so that they can be counted
  return idx; }
float figInkIndexP(vec4 f, vec2 q, vec3 st, out float thin){
  float idx = 0.; thin = 0.;
  if (st.x > .001 && q.y > figReach(f, q, st)) idx = 1.;
  float id; float b = figBandP(q, st.z, id);
  if (b > .5 && figFront(q, st, id) > 0.) { float pick = h21(vec2(id, st.z * 3.1 + 5.));
    idx = pick < .14 ? 1. : 2. + floor(clamp((pick - .14) / .86, 0., .999) * 4.); }
  return idx; }
`,Fe=`
uniform mat4 modelMatrix;
void foldClip(vec3 w, float my){ float f = fold2Y(w.z); if (uFold2.z > .5 && (my < 0. ? (f < .5 || w.y > f) : (f > .5 && w.y < f))) discard; }
`,Oe=`
        uniform sampler2D uFig; uniform vec4 uPose; uniform vec3 uFigPos, uSlope3; uniform float uPitch, uPeel, uShut, uCurl, uBend, uRear, uSize, uTwist;
        vec3 wingPos(vec2 q){
          float xs = q.x / 110., a0 = uSlope3.x + uSlope3.y * xs + uSlope3.z * xs * xs, ca = cos(a0), sa = sin(a0), g = .4 * exp(-q.y * q.y / 2.2);
          // THE REARING BLOT: beyond 38 m from the hinge the sheet already stands curled up off the page (an arc whose
          // curvature grows toward the far end, so the far half rears over the near half and shows its face to the entry)
          float rb = min(q.y, 38.), sr = max(q.y - 38., 0.), sn = clamp(xs * .5 + .5, 0., 1.);
          float kq = max(uRear * (.0028 + .0078 * sn * sn) * (.93 + .07 * sin(uTime * .8 + q.x * .03)), 1e-5), a1 = a0 + kq * sr, c1 = cos(a1), s1 = sin(a1);
          vec3 ng = vec3(-s1, c1, 0.), pg = vec3(rb * ca + (s1 - sa) / kq + g * sa * .3, rb * sa + (ca - c1) / kq - g * ca, q.x) + ng * .3;
          float d = (textureLod(uFig, vec2(q.x / 260. + .5, q.y / 180.), 0.).r - .5) * 96.;
          float k = clamp((uPeel - d) / 34., 0., 1.), lift = k * k * (3. - 2. * k);
          pg += ng * lift * (4. + 12. * lift) * (.75 + .25 * sin(q.x * .09 + q.y * .05 + uTime * .9));   // the lifted edge curls and breathes
          pg.x -= lift * lift * 5. * c1; pg.y -= lift * lift * 5. * s1;
          float rs = clamp((q.x + 70.) / 180., 0., 1.); pg.y += uRear * 94. * rs * rs * (.95 + .05 * sin(uTime * .6));   // and its far half is already off the page, head up
          float rr = q.y / FIG_R;
          float kb = clamp(q.y / max(uBend, 1.), 0., 1.), prof = kb * kb * (3. - 2. * kb);           // root angle -> tip angle: a V on the floor, a tulip in the cleft
          float a = mix(uPose.y, uPose.z, prof) + uTwist * xs * prof + uCurl * (1. + sin(uPose.w - 1.1 * rr)) * (.35 + .65 * rr) + .04 * rr * sin(q.x * .05 + uTime * 1.3);
          a = min(mix(a, 1.47, uShut), 1.5708);          // shut like a book, but a book has a thickness: a blade two metres open at its tips
          float cp = cos(uPitch), sp = sin(uPitch); vec3 hd = vec3(0., sp, cp), nr = vec3(0., cp, -sp);
          vec3 pa = uFigPos + (hd * q.x + (vec3(cos(a), 0., 0.) + nr * sin(a)) * q.y) * uSize;
          return mix(pg, pa, uPose.x); }
`;function Qe(F,A={}){const k={..._e[A.stock]||_e.day},E=A.palette;E&&E.length>=7&&Object.assign(k,{card:E[0],black:E[1],slate:E[2],mist:E[3],carmine:E[4],rose:E[5],seaGreen:E[6]});const w={};for(const n in k)w[n]=new t.Color(k[n]);const V=[w.black,w.carmine,w.orange,w.seaGreen,w.blue,w.yellow],De=[w.mist,w.rose,...V.slice(2).map(n=>n.clone().lerp(w.card,.55))],ze=[w.mist,w.rose,...V.slice(2).map(n=>n.clone().lerp(w.card,.7))],Z={uCard:{value:w.card},uFold:{value:w.fold},uSlate:{value:w.slate},uInk:{value:V},uThin:{value:De},uHi:{value:ze},uTime:{value:0},uViewH:{value:900},uFold2:{value:new t.Vector3(0,0,0)}},ie=n=>A.slope!=null?{slope:A.slope,halfGap:45/Math.tan(A.slope),pathY:45}:He(n),Pe=(n,d,r=new t.Vector3)=>{const v=ie(n).slope,T=.4*Math.exp(-(d*d)/2.2);return r.set(d*Math.cos(v)+(T-.4)*Math.sin(v)*.3,d*Math.sin(v)-T*Math.cos(v),n)},re=new Uint8Array([255,0,0,0]),U=new t.DataTexture(re,1,1,t.RGBAFormat);U.needsUpdate=!0;function me(n={}){return new t.ShaderMaterial({side:t.DoubleSide,uniforms:{...Z,uMap:{value:n.map||U},uMapRect:{value:n.mapRect||new t.Vector4(0,0,1,1)},uMapSize:{value:new t.Vector2(n.map?n.map.image.width:1,n.map?n.map.image.height:1)},uGrow:{value:1},uBloomZ:{value:1e6},uBloomFrom:{value:9},uBloomLen:{value:160},uBloomMin:{value:0},uBloomBlackZ:{value:1e6},uFig:{value:n.fig||U},uStampA:{value:new t.Vector2(N,0)},uGhost:{value:0},uStampB:{value:new t.Vector2(1215,185)},uStampBK:{value:1},uPrint:{value:0},uFigState:{value:n.figState||new t.Vector3(0,0,1)}},vertexShader:ne+`
        attribute vec2 leaf; attribute float fold;
        varying vec2 vLeaf; varying float vFoldV, vSide; varying vec3 vW, vN;
        void main(){ vLeaf = leaf; vFoldV = fold;
          vec4 w = modelMatrix * vec4(position, 1.); w.xyz = foldW(w.xyz, modelMatrix[1].y); vW = w.xyz; vN = mat3(modelMatrix) * normal;
          vSide = dot(cross(modelMatrix[0].xyz, modelMatrix[1].xyz), modelMatrix[2].xyz) < 0. ? -1. : 1.;   // -1 on the mirrored (left) leaf
          gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:ne+Fe+`
        uniform sampler2D uMap, uFig; uniform vec4 uMapRect; uniform vec2 uMapSize, uStampA, uStampB;
        uniform float uGrow, uBloomZ, uBloomFrom, uBloomLen, uBloomMin, uBloomBlackZ, uGhost, uPrint, uStampBK; uniform vec3 uFigState;
        varying vec2 vLeaf; varying float vFoldV, vSide; varying vec3 vW, vN;
        float figEdge(vec2 q, float d, float grow){ float aa = fwidth(d) * .75 + 1e-3; return smoothstep(-aa, aa, d - grow); }
        void main(){
          // every texture read and derivative below is taken outside flow control (Direct3D), then masked
          vec3 col = mix(uCard, uFold, clamp(vFoldV, 0., 1.));
          vec3 toEye = cameraPosition - vW; float dist = length(toEye); vec3 v = toEye / max(dist, 1e-3);
          float near = 1. - smoothstep(60., 400., dist), feather = vSide < 0. ? 1.1 : 1.;
          // (polish 5) every noise is faded out as its cell shrinks under a pixel (BL: cells per metre along the crease and up the
          // leaf): thresholded noise finer than the pixel grid is speckle and stairs, and it blew the antialiasing widths up into smears
          vec2 fwL = fwidth(vLeaf);
          #define BL(sx, sy) (1. - smoothstep(.08, .28, max(fwL.x * (sx), fwL.y * (sy))))   // gone before a cell is four pixels wide: a finger is drawn crisp or not at all
          vec2 pA = vec2(vLeaf.x * .035, vLeaf.y * .5);
          float fibA = .5 + (vn(pA) - .5) * .5 * BL(.035, .5) + (vn(pA * 2.03 + 7.1) - .5) * .3 * BL(.071, 1.015) + (vn(pA * 4.1 + 3.7) - .5) * .2 * BL(.1435, 2.05);
          float fibB = .5 + (vn(vec2(vLeaf.x * .9, vLeaf.y * 11.)) - .5) * BL(.9, 11.);   // fibres lie along the crease
          float fibLo = .5 + (vn(pA) - .5) * BL(.035, .5);                                 // the broad lie of the fibres alone: what a wash border follows (fine fibres there read as a smear)
          // ---- the Figure's ghost (A, lying along the crease) and its last print (B, standing up the wall, hinge at uStampB.x)
          vec2 qa = vLeaf - uStampA, qb = vec2(vLeaf.y - uStampB.y, uStampB.x - vLeaf.x);
          vec2 ua = vec2(qa.x / 260. + .5, qa.y / 180.), ub = vec2(qb.x / (260. * uStampBK) + .5, qb.y / (180. * uStampBK));
          float inA = step(0., ua.x) * step(ua.x, 1.) * step(0., ua.y) * step(ua.y, 1.), inB = step(0., ub.x) * step(ub.x, 1.) * step(0., ub.y) * step(ub.y, 1.);
          float fz = (fibA - .5) * 3. + (fibB - .5) * .5 * near;
          vec4 fa = texture2D(uFig, clamp(ua, 0., 1.)), fb = texture2D(uFig, clamp(ub, 0., 1.));
          float creep = (vn(vLeaf * .07 + vec2(uTime * .06, -uTime * .045)) - .5) * 3.2;
          float da = (fa.r - .5) * 96. + fz * feather - 2. + creep * .5, db = (fb.r - .5) * 96. * uStampBK + fz * feather + creep;
          float ea = figEdge(qa, da, 0.) * inA * uGhost;
          float tideA = 1. - smoothstep(1.2, 3., da);
          col = mix(col, mix(uCard, uThin[0], .3 + .14 * step(.55, fa.b) + .22 * tideA), ea);
          // ---- the ink map
          vec2 uv = (vLeaf - uMapRect.xy) * uMapRect.zw, uc = clamp(uv, 0., 1.), px = 1. / uMapSize;
          float inM = step(0., uv.x) * step(uv.x, 1.) * step(0., uv.y) * step(uv.y, 1.);
          vec4 m = texture2D(uMap, uc), mz = texture2D(uMap, uc + vec2(px.x, 0.)), mr = texture2D(uMap, uc + vec2(0., px.y));
          float bz = mz.b - m.b, br = mr.b - m.b;
          // at arm's length the ink has anatomy of its own: the map only sketches a blot, and noise in METRES along the fibres
          // (g0 six metres, g1 and g3 two, g2 half a metre) breaks every edge into capillary fingers, grains the tide line and
          // squeezes the film into flat washes. gm = how fast the arrival order rises per metre, so that a metre is a metre on any blot.
          float near2 = 1. - smoothstep(12., 110., dist), g1 = .5 + (vn(vLeaf * vec2(.55, 1.7)) - .5) * BL(.55, 1.7), g2 = .5 + (vn(vLeaf * vec2(2.3, 7.)) - .5) * BL(2.3, 7.), g0 = .5 + (vn(vLeaf * vec2(.16, .33) + 4.4) - .5) * BL(.16, .33), g3 = .5 + (vn(vLeaf * vec2(.5, 1.5) + 19.3) - .5) * BL(.5, 1.5);
          vec2 tex = 1. / max(uMapRect.zw * uMapSize, vec2(1e-6)), gd = vec2(mz.r - m.r, mr.r - m.r);
          float gl = length(gd / tex), gm = clamp(gl, .0035, .08);
          vec2 jit = ((vec2(vn(vLeaf * .21), vn(vLeaf * .21 + 31.7)) - .5) * 2.4 + (vec2(g1, g3) - .5) * 2.8 * near + (vec2(g2, .5 + (vn(vLeaf * vec2(2.3, 7.) + 11.) - .5) * BL(2.3, 7.)) - .5) * 1.2 * near2) * px;
          // which ink: the one that owns most of the four texels around the (wandering) point, so borders between inks are curves, not stairs
          vec2 tc = clamp(uc + jit, 0., .9999) * uMapSize - .5, ti = max(floor(tc), vec2(0.)), tf = clamp(tc - ti, 0., 1.); ivec2 i0 = ivec2(ti), i1 = min(i0 + 1, ivec2(uMapSize) - 1);
          float a00 = texelFetch(uMap, i0, 0).a, a10 = texelFetch(uMap, ivec2(i1.x, i0.y), 0).a, a01 = texelFetch(uMap, ivec2(i0.x, i1.y), 0).a, a11 = texelFetch(uMap, i1, 0).a;
          float w00 = (1. - tf.x) * (1. - tf.y), w10 = tf.x * (1. - tf.y), w01 = (1. - tf.x) * tf.y, w11 = tf.x * tf.y;
          float s00 = w00 + w10 * step(abs(a10 - a00), .01) + w01 * step(abs(a01 - a00), .01) + w11 * step(abs(a11 - a00), .01);
          float s10 = w10 + w00 * step(abs(a00 - a10), .01) + w01 * step(abs(a01 - a10), .01) + w11 * step(abs(a11 - a10), .01);
          float s01 = w01 + w00 * step(abs(a00 - a01), .01) + w10 * step(abs(a10 - a01), .01) + w11 * step(abs(a11 - a01), .01);
          float s11 = w11 + w00 * step(abs(a00 - a11), .01) + w10 * step(abs(a10 - a11), .01) + w01 * step(abs(a01 - a11), .01);
          float aBest = a00, sBest = s00; if (s10 > sBest) { sBest = s10; aBest = a10; } if (s01 > sBest) { sBest = s01; aBest = a01; } if (s11 > sBest) { sBest = s11; aBest = a11; }
          float idx = floor(aBest * 6.375 + .5);
          float g = uGrow * mix(1., mix(uBloomMin * step(1.5, idx), 1., smoothstep(0., max(uBloomLen, 1.), uBloomZ - vLeaf.x)), max(step(uBloomFrom, idx), smoothstep(uBloomBlackZ - 30., uBloomBlackZ + 30., vLeaf.x)));
          float fing = ((g0 - .5) * 3.4 + (g1 - .5) * 2.6) * near + (g2 - .5) * 1. * near2;                  // metres
          float a = g * .75 - m.r - ((fibA - .5) * .07 + (fibB - .5) * .012 * near) * feather + (vn(vLeaf * .07 + vec2(uTime * .06, -uTime * .045)) - .5) * .028 - fing * gm * feather;
          float aa = fwidth(a) * .75 + 1e-4, e = smoothstep(-aa, aa, a) * inM, am = a / gm;                      // am: metres inside the rim
          // is the card bare just outside this rim? (where two blots meet there is no pale feather between them: they meet without mixing)
          float rOut = texture2D(uMap, clamp(uc + gd / max(length(gd), 1e-5) * px * 2.6, 0., 1.)).r, rimOpen = smoothstep(-.03, .0, rOut - g * .75) * step(1e-5, length(gd));
          float tide = mix(smoothstep(.004, .012, a) * (1. - smoothstep(.02, .034, a)), clamp(smoothstep(.3, .55, am) * (1. - smoothstep(.95, 1.5, am)) * (.3 + 1.5 * g2), 0., 1.), near);   // the tide line is granular
          float band = smoothstep(.95, 1.5, am) * (1. - smoothstep(2.2 + 6. * g0, 3.4 + 8. * g0, am)) * rimOpen;   // behind it the film was squeezed thin
          vec2 wv = (vec2(g1, g3) - .5) * .42 + (vec2(g0, g2) - .5) * .5;                                       // washes never run straight
          float gW = vn(vLeaf * vec2(.045, .08) + wv + idx * 3.3 + 1.7), tW = clamp((gW * .6 + g0 * .25 + fibLo * .15 - .5) * 3. + .1, 0., 1.);
          float tg = m.g + smoothstep(0., .06, m.g) * ((vn(vLeaf * .045 - vec2(uTime * .035, uTime * .05)) - .5) * .16 + (fibLo - .5) * .42 + (g1 - .5) * .22 * near + (g2 - .5) * .12 * near2);
          tg = max(tg, max(tW, band * .52) * near);
          tg = max(tg, exp(-vLeaf.y * vLeaf.y / 1.6) * .78 * step(.5, idx));                                  // the embossed gutter drinks less: a pale crease through any colour that crosses it
          // TIDE LINES INSIDE A BLOT: a blot spreads in fits and every pause leaves its mark, a granular line of full-strength ink
          // with a bled, squeezed band on its rim side, following the blot's own contours (the arrival order), a few metres apart.
          // In every ink but black, the carmine and the four washes alike (the brief: 'tide line following the feathered edge' of
          // blots, not of the carmine alone); gone where the lines would crowd, and beyond 400 m with the washes.
          float lgm = gm * 13., lv = m.r * 13. + (g0 - .5) * .9 + (g1 - .5) * .3 * near, lf = fract(lv) - .5, lw = fwidth(lv) + 1e-4;
          float lOn = (1. - smoothstep(.12, .3, lw)) * (1. - smoothstep(.24, .42, lgm)) * step(.5, idx) * smoothstep(3.5, 7., am) * near;
          float lhw = max(.2 * lgm * (.6 + .8 * g2), lw * .6), lbw = min((1.6 + 4. * g0) * lgm, .46) * lOn;                  // (where the lines must go, the bands narrow to nothing: never paler, never a ghost)
          float lineIn = (1. - smoothstep(lhw, lhw + lw, abs(lf))) * lOn, bandIn = smoothstep(lhw, lhw + lw, lf) * (1. - smoothstep(lbw * .8, lbw + lw, lf)) * step(.02, lOn);
          tg = max(tg, bandIn * mix(.5, .92, smoothstep(lbw * .12, lbw * .5, lf) * (.55 + .9 * g3)));              // rose against the line, the middle step behind it
          float t = max(tg * (1. - .85 * tide), mix((1. - smoothstep(.0, .008, a)) * .6, (1. - smoothstep(.08, .32, am)) * .8, near) * mix(1., rimOpen, near));   // squeezed washes, tide line, feathered rim
          t *= 1. - lineIn;
          float nearInk = smoothstep(460., 240., dist);                                                       // beyond 400 m a blot is one flat tone
          float tt = t * nearInk; vec3 ink = wash2(idx, tt, min(fwidth(tt) * .75 + .0006, .06)), n = vN / max(length(vN), 1e-4);
          float pb = m.b + (fibLo - .5) * .08 + (g1 - .5) * .07 * near + (g2 - .5) * .03 * near2;
          float wp = min(fwidth(pb) * .75 + .0006, .05), pool = smoothstep(.62 - wp, .62 + wp, pb);                      // pooled gloss mirrors the slit
          ink = mix(ink, inkAt(idx), pool);
          // a pool stands proud with a meniscus: its flanks tilt, so the slit shows in it even when we skim the leaf
          vec3 tr = cross(n, vec3(0., 0., 1.)) * vSide, pn = n - (vec3(0., 0., 1.) * (bz + (g1 - .5) * .03) + tr * (br + (g3 - .5) * .03)) * 22.; pn = pn / max(length(pn), 1e-4);
          vec3 pf = pn * sign(dot(pn, v) + 1e-5); float ry = reflect(-v, pf).y, rw = min(fwidth(ry) * .75 + .002, .05);            // the slit in a pool is a flat shape with an edge
          vec3 nf = n * sign(dot(n, v) + 1e-5); float ryn = reflect(-v, nf).y + (g0 - .5) * .24 + (g1 - .5) * .1, rwn = min(fwidth(ryn) * .75 + .002, .05);   // and on the open film it ends in a blot edge, never a ruled one
          float hl = max(smoothstep(.32 - rwn, .32 + rwn, ryn) * smoothstep(.73 - wp, .73 + wp, pb), smoothstep(.25 - rw, .25 + rw, ry) * smoothstep(.65 - wp, .65 + wp, pb));   // (polish 5) every border of the highlight is an edge: the ramps it had were a blur of rose into carmine many pixels wide
          ink = mix(ink, hiAt(idx), pool * hl * nearInk);
          col = mix(col, ink, e);
          // satellite spatter: drops thrown just beyond the rim, half a metre to three across, one to a 5 m cell
          vec2 sc = vLeaf / 5., ci = floor(sc), cf = fract(sc); float sh = h21(ci + 3.1), srad = (.05 + .23 * sh * sh) * step(.42, h21(ci + 5.5));
          // (a drop far from its rim is a smaller drop, never a paler one: at arm's length a faded disc is a ghost, not ink)
          float sgate = srad * smoothstep(-.11, -.02, a);
          float sdd = length(cf - vec2(.3 + .4 * h21(ci + 7.7), .3 + .4 * h21(ci + 1.3))) - sgate, saa = min(fwidth(sdd) * .75 + 1e-3, .05);
          float spat = (1. - smoothstep(-saa, saa, sdd)) * step(.001, sgate) * inM * near * (1. - e);
          col = mix(col, inkAt(idx), spat);
          // veins: hair-thin pulls of thin ink running up the leaf from a blot's rim, 14 m and more apart, each its own length; they pale when far
          float vx = vLeaf.x * .045 + (vn(vec2(vLeaf.x * .02, vLeaf.y * .012)) - .5) * .9 + (vn(vec2(vLeaf.x * .05, vLeaf.y * .11)) - .5) * .2, vid = floor(vx), vh = h21(vec2(vid, 3.7));
          vx += vh * .7; float vfw = fwidth(vx);
          vec2 uvb = clamp(uv - vec2(0., (6. + 26. * vh) * uMapRect.w), 0., 1.);
          float below = texture2D(uMap, uvb).r, bidx = floor(texelFetch(uMap, ivec2(min(uvb, vec2(.9999)) * uMapSize), 0).a * 6.375 + .5);
          float vl = abs(fract(vx) - .5), vw = min(vfw, .05) * 1.2 + .006;
          float vein = (1. - smoothstep(vw * .5, vw, vl)) * step(below, g * .75 - .02) * (1. - e) * inM * smoothstep(700., 400., dist) * (1. - smoothstep(.05, .14, vfw));
          col = mix(col, wash(bidx, mix(.5, .8, smoothstep(40., 300., dist))), vein * .9);
          // the Figure's last print lies over whatever the wall carries, and it is ink like any other: fingered rim, granular
          // tide line, a squeezed band, flat washes, standing pools, and stripes whose borders are blot edges
          vec2 qw = qb / uStampBK + ((vec2(g1, g3) - .5) * 6. + (vec2(g0, vn(vLeaf * vec2(.16, .33) + 41.)) - .5) * 9.) * near + (vec2(g2, fibB) - .5) * 1.6 * near2;
          float th; float idxB = figInkIndexP(fb, qw, uFigState, th);
          float dP = min(db + fing * feather - (1. - uPrint) * 30. * uStampBK, min(qb.y, min(min(ub.x, 1. - ub.x) * 260., (1. - ub.y) * 180.) * uStampBK) - 3. + fing * 1.5 + (g0 - .5) * 7.), aP = fwidth(dP) * .75 + 1e-3, eb = smoothstep(-aP, aP, dP) * inB * step(.001, uPrint);
          float tideP = clamp(smoothstep(.3, .55, dP) * (1. - smoothstep(.95, 1.5, dP)) * (.3 + 1.5 * g2), 0., 1.) * near;
          float bandP = smoothstep(.95, 1.5, dP) * (1. - smoothstep(2.2 + 6. * g0, 3.4 + 8. * g0, dP));
          float gWb = vn(vLeaf * vec2(.05, .075) + wv + idxB * 5.1 + 23.), tWP = clamp((gWb * .6 + g3 * .25 + fibA * .15 - .5) * 3. + .16, 0., 1.);
          float tP = max(max(max(tWP, bandP * .52) * near, (.2 - fb.b) * 4. * smoothstep(.6, 1., uPrint)) * (1. - .85 * tideP), (1. - smoothstep(.08, .32, dP)) * .8 * near);
          float pbP = fb.b + (g1 - .5) * .1, wpP = min(fwidth(pbP) * .75 + .0006, .05), poolP = smoothstep(.74 - wpP, .74 + wpP, pbP) * smoothstep(1.5, 2.5, dP);
          vec3 inkP = mix(wash2(idxB, tP, min(fwidth(tP) * .75 + .0006, .06)), inkAt(idxB), poolP);
          vec3 pnP = n - (vec3(0., 0., 1.) * (g1 - .5) + tr * (g3 - .5)) * 1.1; pnP = pnP / max(length(pnP), 1e-4);
          vec3 pg2 = pnP * sign(dot(pnP, v) + 1e-5); float ry2 = reflect(-v, pg2).y, rw2 = min(fwidth(ry2) * .75 + .002, .05);
          inkP = mix(inkP, hiAt(idxB), poolP * smoothstep(.31 - rw2, .31 + rw2, ry2) * near);
          col = mix(col, inkP, eb);
          foldClip(vW, modelMatrix[1].y); gl_FragColor = vec4(col, 1.); }`})}function se(n={}){return new t.ShaderMaterial({side:t.DoubleSide,defines:{...n.inkAttr?{INK_ATTR:1}:{},...n.drip?{DRIP:1}:{}},uniforms:{...Z,uIdx:{value:n.ink||0}},vertexShader:ne+`
        #ifdef INK_ATTR
        attribute float ink;
        #endif
        #ifdef DRIP
        attribute vec4 drip;                 // xyz: the drop's root, w: its phase (0 = this vertex never drips)
        #endif
        uniform float uIdx; varying vec3 vW, vN; varying float vInk;
        void main(){ vec4 p = vec4(position, 1.); vec3 n = normal;
          #ifdef DRIP
          if (drip.w > 0.) { float ph = fract(uTime * .16 + drip.w), sw = smoothstep(0., .45, ph), fall = max(ph - .5, 0.) * 2.;
            p.xyz = drip.xyz + (p.xyz - drip.xyz) * sw * (1. - smoothstep(.75, 1., fall)); p.y -= fall * fall * 90. + sw * .9; }
          #endif
          #ifdef USE_INSTANCING
          p = instanceMatrix * p; n = mat3(instanceMatrix) * n;
          #endif
          vec4 w = modelMatrix * p; w.xyz = foldW(w.xyz, modelMatrix[1].y); vW = w.xyz; vN = mat3(modelMatrix) * n; vInk = uIdx;
          #ifdef INK_ATTR
          vInk = ink;
          #endif
          gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:ne+Fe+`
        varying vec3 vW, vN; varying float vInk;
        void main(){ vec3 e = cameraPosition - vW; vec3 v = e / max(length(e), 1e-3); vec3 n = vN / max(length(vN), 1e-4);
          vec3 nn = n * sign(dot(n, v) + 1e-5); float ry = reflect(-v, nn).y, rw = min(fwidth(ry) * .75 + .004, .12);   // (polish 5) the highlight has an edge
          foldClip(vW, modelMatrix[1].y); gl_FragColor = vec4(mix(inkAt(vInk), hiAt(vInk), smoothstep(.68 - rw, .68 + rw, ry) * .96), 1.); }`})}function Q(n,d=16){const r=new t.InstancedBufferGeometry,v=[],T=[];for(let o=0;o<=d;o++)if(v.push(o/d,-1,0,o/d,1,0),o<d){const f=o*2;T.push(f,f+1,f+2,f+1,f+3,f+2)}r.setAttribute("position",new t.Float32BufferAttribute(v,3)),r.setIndex(T);const I=n.length,C=new Float32Array(I*3),P=new Float32Array(I*3),a=new Float32Array(I*4),i=new Float32Array(I*3),m=new Float32Array(I*2);return n.forEach((o,f)=>{m[f*2]=o.period??0,m[f*2+1]=o.phase??0,C.set(o.a,f*3),P.set(o.b,f*3),a.set([o.grow??-1e6,o.breakAt??1e6,o.seed??0,o.width??.5],f*4),i.set([o.sag??0,o.half?1:.5,o.ink??0],f*3)}),r.setAttribute("aA",new t.InstancedBufferAttribute(C,3)),r.setAttribute("aB",new t.InstancedBufferAttribute(P,3)),r.setAttribute("aL",new t.InstancedBufferAttribute(m,2)),r.setAttribute("aT",new t.InstancedBufferAttribute(a,4)),r.setAttribute("aS",new t.InstancedBufferAttribute(i,3)),r.instanceCount=I,r.boundingSphere=new t.Sphere(new t.Vector3,1e5),r}function ae(n={}){return new t.ShaderMaterial({side:t.DoubleSide,defines:n.tied?{WING_TIED:1}:{},uniforms:{...Z,...n.tied||{},uClock:{value:0},uNeckDur:{value:n.neckDur??1.5},uSnapDur:{value:n.snapDur??.7},uRoot:{value:new t.Vector2(n.root??3,n.rootLen??.045)},uFigCut:{value:new t.Vector2(-1e6,50)}},vertexShader:ne+(n.tied?Oe:"")+`
        attribute vec3 aA, aB, aS; attribute vec4 aT; attribute vec2 aL;
        uniform float uClock, uNeckDur, uSnapDur; uniform vec2 uRoot, uFigCut; vec3 gB; float gDroop;
        varying float vAcross, vPale, vInk; varying vec3 vW, vSideV;
        vec3 curve(float t, float len, float sagK){ float tn = aS.y;
          float c = clamp(1. - abs(t - tn) / max(tn, 1. - tn), 0., 1.);
          // a cut stump no longer reaches for its twin: it hangs down its own leaf (toward the crease, a little off the card)
          vec3 dB = gB - aA, dn = vec3(-aA.x * 1.12, -aA.y, 0.) * (length(dB) / max(length(aA.xy), 1.));
          vec3 p = aA + mix(dB, dn, gDroop) * (t * len); float cc = 1. - c;
          #ifdef WING_TIED
          p.y -= aS.x * sagK * (1. - cc * cc);
          #else
          p.y -= aS.x * sagK * (.45 * c + .55 * (1. - cc * cc * cc));     // wet ink hangs: steep off the wall, easing toward the fold, and falling yet where it meets its twin (the two halves hang from each other at the neck). Never a straight line.
          #endif
          return p; }
        void main(){ float t = position.x, tn = aS.y;
          #ifdef WING_TIED
          gDroop = 0.; gB = wingPos(aB.xy);                                              // far end rides the wing; it snaps by stretch (aT.y = the length it can bear)
          float stretch = length(gB - aA) / max(aT.y, 1e-3), len = 1., born = step(.04, stretch);
          float neck = smoothstep(.45, 1., stretch), q = clamp((stretch - 1.) / .45, 0., 1.), qe = 1. - (1. - q) * (1. - q);
          #else
          gB = aB;
          float clk = aL.x > 0. ? mod(uTime + aL.y, max(aL.x, 1.)) : uClock;
          float len = clamp((clk - aT.x) / max(aT.y - aT.x, 1e-3), 0., 1.), born = step(aT.x, clk) * (aL.x > 0. ? smoothstep(0., 3., clk) : 1.);
          float neck = smoothstep(aT.y - uNeckDur, aT.y, clk);
          float q = clamp((clk - aT.y) / max(uSnapDur, 1e-3), 0., 1.);
          // the Figure cuts every looping thread it flies through (uFigCut.x = its nose, crease-frame z): each necks and
          // snaps as it arrives and stays a beaded stump on its wall
          float py = mix(100., 165., smoothstep(730., 900., aB.z)) + 15. * smoothstep(900., 1000., aB.z);
          float cutK = clamp((uFigCut.x - aB.z) / 30., 0., 1.) * step(.0001, aL.x) * step(py - uFigCut.y, aB.y) * step(aB.y, py + 165.);
          // ... four in ten stay, as stumps of varied length that droop down the wall and end in a round bead; the rest are gone
          float keep = step(fract(aT.z * 57.3), .4), qs = 1. - sqrt(mix(.05, .15, fract(aT.z * 23.7)) * (1. + .45 * sin(uTime * (.9 + fract(aT.z * 3.3)) + aT.z * 40.)));
          float qc = mix(1., qs, keep) * smoothstep(.35, 1., cutK); neck = max(neck, smoothstep(0., .4, cutK));
          q = min(max(q, qc), mix(1., mix(1., qs, keep), smoothstep(.5, 1., cutK)));
          gDroop = keep * smoothstep(.45, 1., cutK);
          float qe = 1. - (1. - q) * (1. - q);
          #endif
          float c = clamp(1. - abs(t - tn) / max(tn, 1. - tn), 0., 1.), c2 = c * (1. - qe);
          #ifdef WING_TIED
          float taut = .55;
          #else
          float taut = .3;                                    // a necking thread of wet ink goes on hanging
          #endif
          float t2 = t <= tn ? c2 * tn : 1. - c2 * (1. - tn), sagK = (1. - taut * neck) * (1. - qe) + qe * .35 * c2;
          float sg = t <= tn ? 1. : -1.;
          vec3 p = curve(t2, len, sagK), tg = (curve(t2 + .02, len, sagK) - curve(t2 - .02, len, sagK)) * sg;
          vec4 w = modelMatrix * vec4(p, 1.); w.xyz = foldW(w.xyz, modelMatrix[1].y); vec3 tw = mat3(modelMatrix) * tg;
          vec3 e = cameraPosition - w.xyz; float dist = length(e); e = e / max(dist, 1e-3);
          vec3 sd = cross(tw, e); sd = sd / max(length(sd), 1e-5);
          float wd = aT.w * (1. + uRoot.x * exp(-c2 / max(uRoot.y, 1e-3)));                                     // root cone on the leaf
          wd *= 1. - .86 * neck * (1. - step(.0001, q)) * exp(-(1. - c) * (1. - c) / .05);        // the neck, thinning to a hair
          float bx = (c - .72) / .28, bead = mix((2.2 + 2. * fract(aT.z * 7.31)) * exp(-(1. - c) * (1. - c) / .004), (1.3 + 1.5 * fract(aT.z * 7.31)) * sqrt(max(1. - bx * bx, 0.)), gDroop);
          wd *= (1. + step(.0001, q) * bead) * (1. - gDroop * smoothstep(.94, 1., c));                                                        // the bead on each recoiling end (round, on a stump)
          wd *= born * (1. - smoothstep(.8, 1., q)) * smoothstep(0., .04, len);
          #ifndef WING_TIED
          wd *= mix(1.9, .42, pow(c, .6));                                                           // drawn out of the wall's ink: stout at the root, thinning all the way to the fold
          wd *= step(fract(aT.z * 91.7), mix(1., .3, smoothstep(330., 760., dist)) + (1. - step(.0001, aL.x)));   // far off, only a third of the looping threads are drawn
          wd *= 1. - step(mix(250., 470., fract(aT.z * 37.1)), dist) * step(.0001, aL.x);                    // (polish 1) and from further still none: the far cleft is a quiet grey seam, and the web is strung as we come
          #endif
          float px = dist * 2. / max(projectionMatrix[1][1] * uViewH, 1.), hw = wd * .5, mn = px * .8;
          vPale = wd > 0. ? clamp(1. - hw / mn, 0., 1.) : 0.; hw = wd > 0. ? max(hw, mn) : 0.;
          w.xyz += sd * position.y * hw; vW = w.xyz; vSideV = sd; vAcross = position.y; vInk = aS.z;
          gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:ne+Fe+`
        varying float vAcross, vPale, vInk; varying vec3 vW, vSideV;
        void main(){ vec3 e = cameraPosition - vW; vec3 v = e / max(length(e), 1e-3);
          float x = clamp(vAcross, -1., 1.); vec3 n = vSideV * x + v * sqrt(max(1. - x * x, 0.)); n = n / max(length(n), 1e-4);
          vec3 col = mix(inkAt(vInk), hiAt(vInk), slit(n, v, .5, .85) * .9 * (1. - vPale));
          foldClip(vW, modelMatrix[1].y); float far = smoothstep(260., 620., length(e));                          // hair-thin things pale when far: the far cleft is a haze
          gl_FragColor = vec4(mix(mix(col, wash(vInk, mix(.5, 1., far)), mix(vPale * .8, 1., far * step(.001, vPale))), uFold, .5 * far * step(.001, vPale)), 1.); }`})}function We(n=5e3){const d=new t.Mesh(new t.SphereGeometry(n,16,8),new t.ShaderMaterial({side:t.BackSide,depthWrite:!1,uniforms:{c:{value:w.blank}},vertexShader:"void main(){ gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"uniform vec3 c; void main(){ gl_FragColor = vec4(c, 1.); }"}));return d.renderOrder=-1,d.frustumCulled=!1,d}function Ce(n){const d=new t.Group,r=new t.Group,v=n.clone();return v.traverse(T=>{T.frustumCulled=!1}),r.scale.x=-1,r.add(v),d.add(n,r),d.userData.twin=r,d}function ve(n){const{z0:d=-300,z1:r=1300,nz:v=200,rMax:T=2e3,nr:I=120,rPow:C=2.2,cockle:P=null,deckle:a=30}=n,i=(v+1)*(I+1);return{z0:d,z1:r,nz:v,rMax:T,nr:I,rPow:C,cockle:P,deckle:a,pos:new Float32Array(i*3),nor:new Float32Array(i*3),leaf:new Float32Array(i*2),fold:new Float32Array(i),idx:new Uint32Array(v*I*6),p:new t.Vector3}}function qe(n,d,r){const{z0:v,z1:T,nz:I,rMax:C,nr:P,rPow:a,cockle:i,deckle:m,pos:o,nor:f,leaf:x,fold:z,idx:b,p:g}=n;for(let S=d;S<=r;S++){const B=L(v,T,S/I),q=ie(B),l=R(.17,1.4,q.slope),e=Math.sin(q.slope),s=Math.cos(q.slope),c=m*(.5+.5*F.noise.fbm2(B*.011,3.3,3))+m*.35*F.noise.n2(B*.19,9.1);for(let u=0,h=S*(P+1);u<=P;u++,h++){let p=C*Math.pow(u/P,a);if(u===P&&(p-=c),Pe(B,p,g),i){const y=i(B,p)*Math.min(1,p/3);g.x-=e*y,g.y+=s*y}if(o[h*3]=g.x,o[h*3+1]=g.y,o[h*3+2]=g.z,x[h*2]=B,x[h*2+1]=p,f[h*3]=-e,f[h*3+1]=s,z[h]=Math.min(1,l*(.4+.6*Math.exp(-p/500))+.5*Math.exp(-(p*p)/2.5)),S<I&&u<P){const y=(S*P+u)*6,D=h,_=h+1,M=h+P+1,H=h+P+2;b[y]=D,b[y+1]=M,b[y+2]=_,b[y+3]=_,b[y+4]=M,b[y+5]=H}}}}function $(n){const d=new t.BufferGeometry;return d.setAttribute("position",new t.BufferAttribute(n.pos,3)),d.setAttribute("normal",new t.BufferAttribute(n.nor,3)),d.setAttribute("leaf",new t.BufferAttribute(n.leaf,2)),d.setAttribute("fold",new t.BufferAttribute(n.fold,1)),d.setIndex(new t.BufferAttribute(n.idx,1)),d.boundingSphere=new t.Sphere(new t.Vector3(0,0,(n.z0+n.z1)/2),1e5),d}function ye(n={}){const d=ve(n);return qe(d,0,d.nz),$(d)}async function be(n={}){const d=ve(n);for(let r=0;r<=d.nz;r+=10)qe(d,r,Math.min(d.nz,r+9)),await F.yield();return $(d)}async function ge(n,d={}){const{width:r=1024,height:v=512,z0:T=-300,r0:I=0,zLen:C=1600,rLen:P=2e3}=d,a=new Uint8Array(r*v*4);for(let e=0;e<r*v;e++)a[e*4]=255;const i=new Float32Array(r*v*4),m=new Float32Array(r*v).fill(1);for(let e=0;e<r*v;e++)i[e*4]=1;const o=F.noise,f=C/r,x=P/v;let z=0;await F.yield();for(const e of n){const s=(e.seed??1)*17.13,c=e.rz,u=e.rr??e.rz,h=1.45,p=e.lobes??3,y=[];for(let K=0;K<p;K++){const Y=s*(K+1)*2.4,X=.25+.5*Math.abs(Math.sin(s*(K+3)));y.push([Math.cos(Y)*X,Math.sin(Y)*X,.42+.3*Math.abs(Math.cos(s*(K+5)))])}const D=Math.max(0,Math.floor((e.z-c*h-T)/f)),_=Math.min(r-1,Math.ceil((e.z+c*h-T)/f)),M=Math.max(0,Math.floor((e.r-u*h-I)/x)),H=Math.min(v-1,Math.ceil((e.r+u*h-I)/x)),he=!e.late;for(let K=M;K<=H;K++){for(let Y=D;Y<=_;Y++){const X=T+(Y+.5)*f,oe=I+(K+.5)*x;let pe=(X-e.z)/c,j=(oe-e.r)/u;if(he&&Math.max(Math.abs(pe),Math.abs(j))>1.32)continue;pe+=.16*o.n2(X*.013+s,oe*.013),j+=.16*o.n2(X*.013,oe*.013+s);let ee=Math.hypot(pe,j)-.62;for(const te of y){const le=Math.hypot(pe-te[0],j-te[1])-te[2],J=W(.5+(le-ee)/.3,0,1);ee=L(le,ee,J)-.15*J*(1-J)}ee+=.09*o.fbm2(X*.045+s,oe*.045,3)+2*R(1.18,1.45,Math.max(Math.abs(X-e.z)/c,Math.abs(oe-e.r)/u));const de=W(.75*(1+ee/.7),0,1),Ae=e.late??0,we=Ae+de*(1-Ae/.75),xe=Math.max(0,we)*255,O=(K*r+Y)*4,ue=we,Ne=xe<a[O],Ve=ue<m[O>>2];if(Ne||Ve){let te=0,le=0;const J=ee<.05;if(J){const Le=.5+.5*o.fbm2(X*.014-s,oe*.014+s*.3,2);te=W((Le-.78+.5*(e.thin??.3))*4,0,1),le=W(.5+(o.n2(X*.022+s*2,oe*.022)*.5+(e.pool??.4)-.5)*R(0,-.25,ee)*1.2-.2*R(-.2,0,ee),0,1)}Ne&&(a[O]=xe,a[O+3]=(e.ink??0)*40,J&&(a[O+1]=255*te,a[O+2]=255*le)),Ve&&(m[O>>2]=ue,i[O+3]=(e.ink??0)*40/255,J&&(i[O+1]=te,i[O+2]=le))}{const te=i[O],le=Math.min(te,ue),J=.07*(1-R(.82,.97,Math.max(te,ue)));if(J>1e-4){const Le=Math.max(J-Math.abs(te-ue),0)/J;i[O]=le-Le*Le*J*.25}else i[O]=le}}(z+=_-D+1)>1400&&(z=0,await F.yield())}}await F.yield();{const e=new Float32Array(r*v*2),s=[.0625,.25,.375,.25,.0625];for(let u=0;u<v;u++){const h=u*r;for(let p=0;p<r;p++){let y=0,D=0;if(p>=2&&p<r-2){const M=(h+p)*4;y=.0625*(i[M-7]+i[M+9])+.25*(i[M-3]+i[M+5])+.375*i[M+1],D=.0625*(i[M-6]+i[M+10])+.25*(i[M-2]+i[M+6])+.375*i[M+2]}else for(let M=-2;M<=2;M++){const H=(h+Math.min(r-1,Math.max(0,p+M)))*4;y+=s[M+2]*i[H+1],D+=s[M+2]*i[H+2]}const _=(h+p)*2;e[_]=y,e[_+1]=D}u%40===39&&await F.yield()}const c=r*2;for(let u=0;u<v;u++){const h=Math.max(0,u-2)*c,p=Math.max(0,u-1)*c,y=u*c,D=Math.min(v-1,u+1)*c,_=Math.min(v-1,u+2)*c;for(let M=0,H=u*r*4;M<c;M+=2,H+=4)i[H+1]=.0625*(e[h+M]+e[_+M])+.25*(e[p+M]+e[D+M])+.375*e[y+M],i[H+2]=.0625*(e[h+M+1]+e[_+M+1])+.25*(e[p+M+1]+e[D+M+1])+.375*e[y+M+1];u%40===39&&await F.yield()}}const b=new Uint16Array(r*v*4),g=t.DataUtils.toHalfFloat,S=g(1),B=[];for(let e=0;e<7;e++)B.push(g(e*40/255));for(let e=0;e<v;e++){for(let s=e*r*4,c=s+r*4;s<c;s+=4){const u=i[s];if(b[s+3]=B[Math.round(i[s+3]*6.375)],u>=1){b[s]=S;const h=i[s+1],p=i[s+2];h>1e-4&&(b[s+1]=g(h)),p>1e-4&&(b[s+2]=g(p))}else b[s]=g(Math.max(u,-4)),b[s+1]=g(i[s+1]),b[s+2]=g(i[s+2])}e%32===31&&await F.yield()}const q=new t.DataTexture(b,r,v,t.RGBAFormat,t.HalfFloatType);q.minFilter=q.magFilter=t.LinearFilter,q.wrapS=q.wrapT=t.ClampToEdgeWrapping,q.needsUpdate=!0;const l=(e,s)=>{const c=W(Math.floor((e-T)/f),0,r-1),u=W(Math.floor((s-I)/x),0,v-1),h=(u*r+c)*4;return[a[h]/255,a[h+1]/255,a[h+2]/255,Math.round(a[h+3]/40)]};return{texture:q,rect:new t.Vector4(T,I,1/C,1/P),data:a,sample:l}}const ce={moth:[["C",-70,0,78,0,9,11],["E",88,0,12,13,0],["E",38,78,50,82,-.25],["E",72,128,26,30,0],["E",-48,58,44,62,.3],["C",-70,62,-112,84,12,4],["E",-116,86,7,7,0],["C",96,5,122,40,3.5,2],["E",124,43,5.5,5.5,0],["H",48,92,11,14,0],["H",-4,90,7,34,.5],["H",-52,72,8,9,0],["H",20,40,5,12,-.4]],bat:[["C",-55,0,62,0,12,13],["E",74,0,14,14,0],["C",78,8,106,22,8,2],["C",50,6,84,78,7,5],["C",84,78,62,152,5,3],["C",84,78,8,142,3.5,2.5],["C",84,78,-42,114,3.5,2.5],["E",32,72,52,66,0],["E",-12,60,44,56,0],["E",-45,30,30,34,0],["H",38,156,21,17,0],["H",-24,136,23,19,0],["H",-68,80,20,23,0],["C",-55,6,-100,30,6,3],["C",-55,0,-94,0,5,3],["H",30,30,6,10,.3]],dancers:[["E",84,42,14,13,0],["C",72,42,60,43,6,6],["C",62,44,12,50,17,11],["E",-28,60,44,59,0],["C",-50,45,-108,30,9,4],["C",-48,75,-100,96,9,4],["E",-110,26,5,9,0],["E",-103,100,5,9,.5],["C",58,36,40,0,6,5],["C",60,54,88,104,7,4],["C",88,104,118,96,4,3],["E",121,95,5,5,0],["E",96,60,9,16,.6],["H",-30,78,9,20,.3],["H",-22,30,6,13,-.2]],crown:[["E",-60,45,22,88,0],["C",-80,0,-80,122,12,10],["C",-50,0,80,0,16,6],["E",92,0,13,13,0],["C",-45,55,60,70,15,5],["E",68,72,11,11,0],["C",-45,110,32,150,13,5],["E",38,153,10,10,0],["H",-58,30,7,12,0],["H",-58,84,7,12,0],["E",-100,60,8,40,0],["H",-12,30,12,7,0]],pelvis:[["E",30,80,58,72,-.3],["C",70,0,-30,0,20,9],["E",-62,46,34,30,0],["C",-60,40,-52,0,10,10],["H",-58,44,15,13,0],["H",-8,22,17,9,0],["E",-20,112,16,18,0],["C",-25,118,-102,130,11,8],["E",-106,131,12,12,0],["H",40,90,10,22,-.3]],birds:[["E",-5,80,40,52,.5],["E",40,40,20,20,0],["C",44,28,50,0,9,3.5],["E",44,112,50,24,-.9],["C",-30,118,-78,152,14,20],["C",-38,66,-88,52,4,3],["C",-88,52,-98,30,3,2],["E",-104,20,10,30,0],["H",44,42,4.5,4.5,0],["H",10,100,6,20,.5],["C",62,44,84,56,5,2]]},Me={dancers:["E",8,46,86,44,0],crown:["E",-4,50,80,54,0],birds:["E",4,56,72,52,0]};async function ke(n,d){const T=2*fe/288,I=Se/200,C=F.noise,P=n.range(1,90),i=(ce[d]||ce.moth).map(l=>l.map((e,s)=>s===0?e:(l[0]==="E"||l[0]==="H")&&s===5?e+n.range(-.12,.12):e*(1+n.range(-.07,.07))));Me[d]&&i.unshift(Me[d]);const m=(l,e)=>{let s=1e3;for(const c of i){let u;if(c[0]==="C"){const h=c[3]-c[1],p=c[4]-c[2],y=W(((l-c[1])*h+(e-c[2])*p)/(h*h+p*p+1e-6),0,1);u=Math.hypot(l-c[1]-h*y,e-c[2]-p*y)-L(c[5],c[6],y)}else{const h=Math.cos(c[5]),p=Math.sin(c[5]),y=(l-c[1])*h+(e-c[2])*p,D=-(l-c[1])*p+(e-c[2])*h;u=(Math.hypot(y/c[3],D/c[4])-1)*Math.min(c[3],c[4])}if(c[0]==="H")s=Math.max(s,-u-1.5);else{const h=W(.5+(u-s)/14,0,1);s=L(u,s,h)-7*h*(1-h)*.5}}return s},o=(l,e)=>{const s=l+9*C.n2(l*.016+P,e*.016),c=Math.abs(e+9*C.n2(l*.016,e*.016+P)*Math.min(1,e/12));return m(s,c)+4.5*C.fbm2(l*.06+P,e*.06,3)},f=14,x=Math.ceil(2*fe/f),z=Math.ceil(Se/f),b=new Array(x*z).fill(null);for(let l=0;l<z;l++)for(let e=0;e<x;e++){const s=-fe+(e+n.range(.2,.8))*f,c=(l+n.range(.2,.8))*f,u=.8+3.2*n()*n(),h=n(),p=o(s,c);p>u+1.5&&p<22&&h<.75-p/40&&c>u+1&&(b[l*x+e]=[s,c,u])}await F.yield();const g=new Uint8Array(288*200*4),S=new Float32Array(288*200);for(let l=0;l<200;l++){for(let e=0;e<288;e++){const s=-fe+(e+.5)*T,c=(l+.5)*I;let u=o(s,c);const h=Math.floor((s+fe)/f),p=Math.floor(c/f);for(let M=Math.max(0,p-1);M<=Math.min(z-1,p+1);M++)for(let H=Math.max(0,h-1);H<=Math.min(x-1,h+1);H++){const he=b[M*x+H];he&&(u=Math.min(u,Math.hypot(s-he[0],c-he[1])-he[2]))}const y=Math.min(1,Math.min(s+fe,fe-s,Se-c)/6);u=L(8,u,W(y,0,1));const D=(l*288+e)*4,_=1-R(0,.1,Math.abs(C.n2(s*.034+2.2*C.n2(s*.01,c*.012+P),c*.006+P)));S[l*288+e]=-u,g[D]=255*W(.5-u/96,0,1),g[D+1]=255*_*R(0,10,c),g[D+2]=255*W(.5+.55*C.fbm2(s*.035-P,c*.035+P,2)+Math.min(-u,18)/70-.12,0,1),g[D+3]=255}l%4===3&&await F.yield()}const B=new t.DataTexture(g,288,200,t.RGBAFormat);return B.minFilter=B.magFilter=t.LinearFilter,B.wrapS=B.wrapT=t.ClampToEdgeWrapping,B.needsUpdate=!0,{texture:B,inside:(l,e)=>S[W(Math.floor(e/I),0,199)*288+W(Math.floor((l+fe)/T),0,287)],family:d,seed:P}}function Te(n=60,d=40){const r=new t.PlaneGeometry(2*fe,Se,n,d);return r.translate(0,Se/2,0),r.boundingSphere=new t.Sphere(new t.Vector3,1e5),r}function Ge(n={}){return new t.ShaderMaterial({side:t.DoubleSide,uniforms:{...Z,uFig:{value:n.fig||U},uPose:{value:new t.Vector4(0,.6,.3,0)},uPitch:{value:0},uFigPos:{value:new t.Vector3},uSlope3:{value:(()=>{const d=ie(N).slope,r=ie(N-110).slope,v=ie(N+110).slope;return new t.Vector3(d,(v-r)/2,(v+r)/2-d)})()},uPeel:{value:0},uShut:{value:0},uCurl:{value:.3},uRear:{value:1},uSize:{value:1},uTwist:{value:0},uBend:{value:160},uFigState:{value:n.figState||new t.Vector3(0,0,1)}},vertexShader:ne+Oe+`
        varying vec2 vQ; varying vec3 vW, vN, vTs, vTr;
        void main(){ vec2 q = position.xy; vQ = q;
          vec3 p = wingPos(q), ds = wingPos(q + vec2(2., 0.)) - p, dr = wingPos(q + vec2(0., 2.)) - p;
          vec3 n = cross(ds, dr); vN = mat3(modelMatrix) * (n / max(length(n), 1e-5));
          vTs = mat3(modelMatrix) * (ds / max(length(ds), 1e-5)); vTr = mat3(modelMatrix) * (dr / max(length(dr), 1e-5));
          vec4 w = modelMatrix * vec4(p, 1.); w.xyz = foldW(w.xyz, modelMatrix[1].y); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:ne+Fe+`
        uniform sampler2D uFig; uniform vec3 uFigState; uniform float uShut;
        varying vec2 vQ; varying vec3 vW, vN, vTs, vTr;
        void main(){
          vec2 uv = vec2(vQ.x / 260. + .5, vQ.y / 180.); vec4 f = texture2D(uFig, uv);
          vec3 e = cameraPosition - vW; float dist = length(e); vec3 v = e / max(dist, 1e-3);
          float near = 1. - smoothstep(80., 500., dist);
          float fib = fbm3(vec2(vQ.x * .11, vQ.y * .9)), fine = vn(vec2(vQ.x * .9, vQ.y * 7.));
          float d = (f.r - .5) * 96. + (fib - .5) * 2.6 + (fine - .5) * .7 * near;        // capillary fingers along the fibres
          if (d < 0.) discard;
          // in flight its streaks are broad and take the four washes in turn; as it shuts they draw back to the streaks its print carries
          float th; float idx = uShut > .1 + .8 * vn(vQ * .21 + 3.) ? figInkIndexP(f, vQ, uFigState, th) : figInkIndex(f, vQ, uFigState, th);
          float rim = 1. - smoothstep(.4, 1.3 + 1.6 * fib, d);                          // feathered rim: the film is thin there
          float tide = smoothstep(1.6, 2.6, d) * (1. - smoothstep(3.4, 4.6, d));
          float t = max(rim * .5, (.2 - f.b) * 4.) * (1. - tide);              // squeezed-thin washes
          t = max(t, f.g * .9 * (1. - smoothstep(3., 16., d)) * step(idx, .5));         // pale veins toward the edge of the black
          vec3 col = wash2(idx, t, min(fwidth(t) * .75 + .0006, .03));   // (polish 5) flat steps with edges, not ramps
          vec3 n = vN / max(length(vN), 1e-4);
          float pool = smoothstep(.6, .64, f.b) * (1. - rim);
          n = n * sign(dot(n, v) + 1e-5);
          vec3 pn = n + vTs * (vQ.x / 70.) + vTr * ((vQ.y - 75.) / 52.); pn = pn / max(length(pn), 1e-4);
          // (polish 5) the one wet highlight is a flat pale shape with an ink edge (it was a soft ramp: an airbrushed grey bloom
          // on the black): the slit's mirror image thresholded, its border wandering with the film, antialiased over a pixel
          pn = pn * sign(dot(pn, v) + 1e-5);
          float ry = reflect(-v, pn).y + (vn(vQ * .06 + 5.) - .5) * .1 + (vn(vQ * .23 + 11.) - .5) * .035, thr = mix(.875, .915, uShut), rw = min(fwidth(ry) * .75 + .0015, .03);
          col = mix(col, hiAt(idx), smoothstep(thr - rw, thr + rw, ry) * (1. - step(.33, t)));
          foldClip(vW, modelMatrix[1].y); gl_FragColor = vec4(col, 1.); }`})}function Ie(n={}){const d=n.wallX??9.6,r=F.rng.fork("hoop"),v=[],T=F.noise,I=(o,f,x,z,b)=>{const g=new t.CylinderGeometry(1,1,1,7,6,!0),S=g.attributes.position,B=new t.Vector3().subVectors(f,o),q=B.length();for(let l=0;l<S.count;l++){const e=S.getY(l)+.5,s=L(x,z,e)*(1-b*Math.sin(Math.PI*e));S.setXYZ(l,S.getX(l)*s,(e-.5)*q,S.getZ(l)*s)}return g.applyQuaternion(new t.Quaternion().setFromUnitVectors(new t.Vector3(0,1,0),B.clone().divideScalar(Math.max(q,1e-4)))),g.translate((o.x+f.x)/2,(o.y+f.y)/2,(o.z+f.z)/2),g.computeVertexNormals(),g},C=new t.TorusGeometry(8,1,10,56,Math.PI),P=C.attributes.position,a=C.attributes.normal;C.rotateZ(-Math.PI/2);for(let o=0;o<P.count;o++){const f=P.getX(o),x=P.getY(o),z=Math.atan2(x,Math.max(f,0)),b=.22*T.n2(z*2.3,4.2)+.2*R(-.2,-1.4,z);P.setXYZ(o,f+a.getX(o)*b,x+a.getY(o)*b,P.getZ(o)+a.getZ(o)*b)}C.computeVertexNormals(),v.push(C);for(let o=0;o<6;o++){const f=L(-1.25,1.25,(o+r.range(.2,.8))/6),x=new t.Vector3(Math.cos(f)*8.6,Math.sin(f)*8.6,0),z=new t.Vector3(d+.4,Math.sin(f)*8.6*r.range(1.2,2.1)+r.range(-2,2),r.range(-5,5));v.push(I(x,z,r.range(.8,1.3),r.range(1.1,2),r.range(.45,.7)))}for(const o of v)o.deleteAttribute("uv"),o.setAttribute("drip",new t.BufferAttribute(new Float32Array(o.attributes.position.count*4),4));for(let o=0;o<5;o++){const f=-Math.PI/2+L(.08,1,o/4)*.9+r.range(-.05,.05),x=Math.cos(f)*8.2,z=Math.sin(f)*9.1-.2,b=r.range(.45,.85),g=new t.SphereGeometry(b,8,6),S=g.attributes.position;g.deleteAttribute("uv");for(let l=0;l<S.count;l++){const e=S.getY(l)/b;S.setY(l,S.getY(l)*(e>0?2.1:1)-b);const s=e>0?1-.75*e:1;S.setX(l,S.getX(l)*s),S.setZ(l,S.getZ(l)*s)}g.computeVertexNormals(),g.translate(x,z,0);const B=new Float32Array(S.count*4),q=r.range(.05,.95);for(let l=0;l<S.count;l++)B.set([x,z+b,0,q],l*4);g.setAttribute("drip",new t.BufferAttribute(B,4)),v.push(g)}const i=Ke(v.map(o=>o.index?o.toNonIndexed():o)),m=new t.Mesh(i,se({ink:0,drip:!0}));return i.boundingSphere=new t.Sphere(new t.Vector3,120),m.frustumCulled=!1,m}function G(n={}){const d=n.inner??8.6,r=new t.RingGeometry(d-.6,36,40,10,-Math.PI/2,Math.PI);r.deleteAttribute("uv"),r.deleteAttribute("normal"),r.boundingSphere=new t.Sphere(new t.Vector3,120);const v=new t.ShaderMaterial({side:t.DoubleSide,uniforms:{...Z,uOpen:{value:1},uInner:{value:d},uSeedC:{value:n.seed??3.7}},vertexShader:ne+`
        varying vec3 vW; varying vec2 vP;
        void main(){ vP = position.xy; vec4 w = modelMatrix * vec4(position, 1.); w.xyz = foldW(w.xyz, modelMatrix[1].y); vW = w.xyz;
          gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:ne+Fe+`
        uniform float uOpen, uInner, uSeedC; varying vec3 vW; varying vec2 vP;
        void main(){
          vec2 p = vP; float rho = max(length(p), 1e-3), ang = atan(p.y, max(p.x, 1e-4)), sy = p.y / rho, fw = length(fwidth(p));
          float fine = 1. - smoothstep(.2, .6, fw * 31. / rho), mid = 1. - smoothstep(.2, .6, fw * 9. / rho);
          // how far the colour has bled at this bearing: most up and down the cleft, heavier at the foot
          float lobe = abs(sy); lobe = lobe * sqrt(lobe);
          float reach = (2.4 + 15.5 * lobe * (1. + .3 * smoothstep(0., -1., sy))) * (.7 + .6 * vn(vec2(ang * 2.1 + uSeedC, 1.7))) * uOpen;
          float creep = (vn(vec2(ang * 5. + uSeedC, uTime * .11)) - .5) * 1.4;
          float tong = vn(vec2(ang * 21. + uSeedC * 3., 2.2)); tong = (tong * tong - .28) * 7.5 * (1. - smoothstep(.2, .6, fw * 21. / rho));   // tongues run out along the pull
          float fing = (vn(vec2(ang * 9. + uSeedC, rho * .12 - uTime * .03)) - .5) * 5. * mid + (vn(vec2(ang * 31., rho * .3 + uSeedC)) - .5) * 2.6 * fine + tong;
          float d = uInner + reach + fing * min(1., reach * .25) + creep - rho;                // metres inside the rim
          float b = clamp((rho - uInner) / max(reach, .5), 0., 1.) + (vn(vec2(ang * 5. - uSeedC, rho * .2)) - .5) * .32 * mid;
          // the washes in sectors: borders are curves, antialiased, never mixed
          float sc = ang * 2.3 + (vn(vec2(ang * 4. + 9., rho * .15 + uSeedC)) - .5) * 1.1 + uSeedC * 5., id = floor(sc), f = sc - id, sa = min(fwidth(sc) * 1.2 + 1e-3, .2);
          float iA = 2. + mod(id, 4.), iB = 2. + mod(id + 1., 4.);
          float t = smoothstep(.5, 1., b) * .9, tide = smoothstep(.1, .25, d) * (1. - smoothstep(.45, .75, d));
          t = max(t * (1. - tide), (1. - smoothstep(.0, .1, d)) * .6); float tw = min(fwidth(t) * .75 + .001, .06);
          vec3 colW = mix(wash2(iA, t, tw), wash2(iB, t, tw), smoothstep(1. - sa, 1., f));
          float cb = b - .3 - (vn(vec2(ang * 13. + uSeedC, rho * .5)) - .5) * .16 * mid, ca = fwidth(cb) * .75 + 1e-3;
          vec3 col = mix(inkAt(1.), colW, smoothstep(-ca, ca, cb));                              // carmine against the black rim
          // the one wet highlight: a flat pale shape with an ink edge, where the film stands thick by the hoop
          float hv = vn(vec2(ang * 3.1 + uSeedC * 2., rho * .45 - uTime * .04)) - .64 - max(cb, 0.) * 3., ha = fwidth(hv) * .75 + 1e-3;
          col = mix(col, hiAt(1.), smoothstep(-ha, ha, hv) * (1. - smoothstep(-ca, ca, cb)) * mid);
          if (d < 0. || rho < uInner - .5) discard;
          foldClip(vW, modelMatrix[1].y); gl_FragColor = vec4(col, 1.); }`}),T=new t.Mesh(r,v);return T.frustumCulled=!1,T}function Re(n,d,r){Z.uTime.value=d;const v=F.renderer;v&&v.getDrawingBufferSize&&(Z.uViewH.value=Math.max(240,v.getDrawingBufferSize(Ye).y))}return{palette:w,uniforms:Z,card:me,wet:se,hoop:Ie,corona:G,thread:ae,threadGeometry:Q,wing:Ge,wingGeometry:Te,sky:We,mirror:Ce,leafGeometry:ye,leafGeometryAsync:be,paintInkMap:ge,paintFigure:ke,sheetAt:ie,leafPoint:Pe,families:Object.keys(ce),update:Re,noMap:U}}const Ye=new t.Vector2,Ee=[[0,0],[.171,182],[.366,438],[.585,735],[.805,960],[1,1152]];function Ue(F){let A=1;for(;A<Ee.length-1&&F>Ee[A][0];)A++;const k=Ee[A-1],E=Ee[A];return L(k[1],E[1],W((F-k[0])/(E[0]-k[0]),0,1))}async function tt(F,A={}){const k=A.debug&&!A.style?{get:a=>A.debug[a]??null}:null,E=!A.style&&A.slope==null&&!(k&&(k.get("figreal")||k.get("figpage"))),w=A.style||Qe(F,E?{...A,slope:.105}:A),V=F.rng,De=W(A.detail??1,.6,1),ze=A.family||k&&k.get("figfam")||V.pick(w.families),Z=A.wetness??V.range(.2,1),ie=A.page??!0,Pe=A.backdrop??ie,re=await w.paintFigure(V,ze);await F.yield();const U=new t.Vector3(0,0,re.seed),me=new t.Group,se=new t.Group,Q=w.wing({fig:re.texture,figState:U}),ae=new t.Mesh(w.wingGeometry(),Q);ae.frustumCulled=!1,se.add(ae);const We=Math.round((36+40*Z)*De),Ce=[],ve=new t.Vector3;for(let a=0,i=0;a<We&&i<4e3;i++){const m=V.range(-112,112),o=V.range(3,150),f=V.range(.28,.6)*(.7+.6*Z),x=V.range(.45,.85),z=V(),b=re.inside(m,o);b<2.5||(w.leafPoint(N+m,o,ve),Ce.push({a:[ve.x,ve.y,m],b:[m,o,0],breakAt:5+70*x*x*z+.25*b,width:f*2,sag:0,ink:0,seed:z}),a++)}const qe=w.thread({tied:Q.uniforms}),$=new t.Mesh(w.threadGeometry(Ce,12),qe);$.frustumCulled=!1,se.add($),await F.yield();const ye=[];let be=null;if(ie){const a=A.pageZ??(k&&k.get("figpage")?+k.get("figpage"):N),i=a-470,m=1120,o=780,f=[],x=V.fork("page");for(let B=0;B<16;B++){const q=i+x.range(40,m-40),l=x.range(20,o*.85),e=x.range(18,75)*(x.chance(.25)?1.8:1),s=q>N+260;Math.abs(q-N)<150+e&&l<185+e||f.push({z:q,r:l,rz:e,rr:e*x.range(.7,1.3),ink:s?1:0,seed:x.range(1,50),thin:x.range(.1,.7),pool:.25+.5*Z,lobes:x.int(2,4)})}f.push({z:N-330,r:46,rz:32,rr:4.5,ink:0,seed:7.7,thin:.75,pool:.1,lobes:1});const z=await w.paintInkMap(f,{width:512,height:384,z0:i,r0:0,zLen:m,rLen:o});await F.yield();const b=(B,q)=>{const l=z.sample(B,q);return l[0]<.75?(l[2]-.45)*.9:0},g=w.leafGeometry({z0:i,z1:i+m,nz:96,rMax:o,nr:56,rPow:1.5,cockle:b,deckle:26});g.translate(0,0,-N),be=w.card({map:z.texture,mapRect:z.rect,fig:re.texture,figState:U});const S=new t.Mesh(g,be);S.frustumCulled=!1,se.add(S),ye.push(be),await F.yield()}if(k&&k.get("fighoop")){const a=w.hoop();k.get("fighoop")==="seat"?a.position.set(0,180,1150-N):(a.position.set(0,60,-170),a.scale.setScalar(4)),se.add(a)}let ge=null;if(k&&k.get("figthreads")){const a=V.fork("tt"),i=[];for(let o=0;o<40;o++){const f=a.range(170,300),x=a.range(-170,170);i.push({a:[a.range(60,110),f+a.range(-15,25),x+a.range(-10,10)],b:[0,f,x],half:!0,breakAt:a.range(4,30),width:a.range(.5,1.6),sag:a.range(4,16),ink:o%6,seed:a()})}ge=w.thread({neckDur:3,snapDur:1.2});const m=new t.Mesh(w.threadGeometry(i),ge);m.frustumCulled=!1,se.add(m)}me.add(w.mirror(se));let ce=null;Pe&&(ce=w.sky(2600),me.add(ce));const Me=160,ke=112,Te=Q.uniforms.uFigPos.value,Ge=Q.uniforms.uPose.value,Ie=je(Ze("wingbeat:"+F.seed))()*Math.PI*2,G={u:0,camZ:null,auto:!0,phase:Ie,fly:0,shut:0,law:null,body:{},sizeNow:1},Re=k?k.get("figz")!=="1":!1,n=k&&k.get("figslope")?+k.get("figslope")*Math.PI/180:null;function d(a,i){const m=i??Ue(a);return Math.min(1150,N+Math.max(0,m+235-N)*R(.07,.2,a))}function r(a,i,m,o){const f=Math.cos(m),x=Math.sin(m),z=Me*i,b=ke*i,g=(u,h)=>{const p=Math.tan(Math.min(w.sheetAt(a+h*f).slope,1.555)),y=o+h*x-1-1.8*p,D=Math.hypot(f,p);return y>=u*D?0:Math.atan2(p,f)-Math.asin(W(y/(u*D),-1,1))+.02},S=-.9*b,B=.9*b,q=W(g(z,S),.35,1.5),l=W(g(z,B),.35,1.5),e=(q+l)/2,s=70*i;let c=Math.max(.12,e-.9);for(let u=1;u<=8;u++){const h=z*u/8,p=W(h/s,0,1),y=p*p*(3-2*p);if(y>.98)break;c=Math.max(c,(g(h,S)-q*y)/(1-y),(g(h,B)-l*y)/(1-y))}return c=Math.min(c,Math.min(q,l)),{aTip:e,aRoot:c,twist:(l-q)/2/.916,bend:s}}function v(a,i,m={}){const o=R(.07,.17,a),f=R(.855,.885,a),x=R(.77,.855,a);return m.fly=o,m.shut=f,m.size=L(i.size,i.sizeOpen??i.size,f),m.pitch=o*L(.75,i.pitch,R(.15,.26,a))*(1-.9*f),m.y=Math.max(L(i.y,210,x),14+ke*m.size*Math.sin(m.pitch)),m}function T(a,i){const m=R(.07,.17,a),o=Re?N:d(a,G.camZ),f=w.sheetAt(o),x=n??f.slope,z=R(.35,1.4,x),b=R(.855,.885,a),g=G.law!=null,S=g?v(a,G.law,G.body):null,B=g?S.size:1,q=Me*B,l=ke*B,e=g?S.pitch:m*L(.75,1.1,z),s=(n!=null?120:f.pathY)+L(55,A.cleftLift??150,z),c=14+l*Math.sin(e),u=L(.3,.1,z)*(1-b)*m;let h=g?S.y:Math.max(s,c),p=.14,y=.12,D=0;const _=Math.cos(e),M=Math.tan(Math.min(x,1.555)),H=Math.hypot(_,M),he=Math.atan2(M,_);let K=L(160,75,z)*B;{const j=h-l*Math.sin(e)-6,ee=de=>j>=de*H?0:he-Math.asin(j/(de*H))+.087;p=W(ee(q),.14,1.5),y=Math.max(.12,p-L(.35,1.3,z));for(let de=1;de<=8;de++){const Ae=q*de/8,we=W(Ae/K,0,1),xe=we*we*(3-2*we),O=L(y,p,xe),ue=ee(Ae);ue>O&&xe<.999&&(y=Math.min(p,y+(ue-O)/(1-xe)))}}h+=a>.84&&!g?40*R(.84,.88,a):0;const Y=g?G.law.cleft*(1-b):0;if(Y>.001){const j=r(o,B,e,h);p=L(p,j.aTip,Y),y=L(y,j.aRoot,Y),D=j.twist*Y,K=L(K,j.bend,Y)}G.sizeNow=B,Q.uniforms.uTwist.value=D,Q.uniforms.uSize.value=L(1,B,m),Ge.set(m,y,p,G.phase),Q.uniforms.uPitch.value=e,Q.uniforms.uShut.value=b,Q.uniforms.uBend.value=K/B,Q.uniforms.uCurl.value=u,Q.uniforms.uPeel.value=7+100*R(0,.14,a),Te.set(0,h,o-N),U.x=R(.27,.52,a),U.y=R(.44,.64,a);const X=R(.872,.94,a);ae.visible=!0,$.visible=a<.3;const oe=ae.userData.twin,pe=$.userData.twin;oe&&(oe.visible=ae.visible),pe&&(pe.visible=$.visible);for(const j of ye)j.uniforms.uGhost.value=1,j.uniforms.uPrint.value=X;G.fly=m,G.shut=b}me.traverse(a=>{a!==ae&&a.geometry===ae.geometry&&(ae.userData.twin=a),a!==$&&a.geometry===$.geometry&&($.userData.twin=a)});const I=new t.Vector3,C=k&&k.get("figcam")?k.get("figcam").split(",").map(Number):null,P={object:me,radius:190,height:190,center:new t.Vector3(0,95,0),ground:!1,groundY:0,style:w,family:ze,wetness:Z,figure:{texture:re.texture,state:U,inside:re.inside},anchors:{origin:[0,0,N],portalSeat:{position:[0,180,1150-N],facing:[0,0,-1],radius:7},flyThrough:[[0,45,-260],[0,45,-78],[0,40,180],[58,66,280],[58,78,410],[0,100,470],[0,165,640],[0,180,740],[0,180,890]],viewpoints:{entry:[0,45,-260],peel:[0,45,-150],behind:[0,45,0]},ghost:[0,0,0],print:{hingeZ:1215-N,r:185},shut:[0,280,1240-N]},setFlight(a){G.law=a},bodyAt(a,i,m){return v(a,i,m)},figureSize(){return G.sizeNow},setProgress(a,i){G.u=W(a,0,1),G.camZ=i??null,G.auto=!1},figurePosition(a=new t.Vector3){return G.fly<.02?a.set(0,4,0):a.copy(Te).multiplyScalar(G.fly)},bindCard(a){a.uniforms.uFig.value=re.texture,a.uniforms.uFigState.value=U,ye.push(a)},update(a,i,m){w.update(a,i,m),G.phase=Ie+i*Math.PI*2/4,G.auto&&(G.u=k&&k.get("figu")?+k.get("figu"):Math.min(.84,i%60/41)),T(G.u,i),ge&&(ge.uniforms.uClock.value=i),C&&m&&(m.position.set(C[0],C[1],C[2]),m.lookAt(C[3],C[4],C[5]),m.updateMatrixWorld(!0)),ce&&m&&(I.setFromMatrixPosition(m.matrixWorld),me.worldToLocal(I),ce.position.copy(I))},dispose(){}};return T(0,0),P}export{fe as FIG_HALF_LEN,Se as FIG_REACH,N as FIG_Z0,Fe as FOLD_FRAG,$e as FOLD_ROWS,ne as GLSL_COMMON,tt as buildHero,et as leafPoint,Qe as makeStyle,He as sheetAt};
