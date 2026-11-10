import*as S from"three";const ce=["#A9B9BD","#96301F","#D49A33","#F1EBDB","#1D1A18","#1F3F68","#4F7A3C"],le={GROUND:0,RED:1,OCHRE:2,CHALK:3,SOOT:4,BLUE:5,GREEN:6},h={TEAR:0,C:1,S:2,LINER:3,DOT:4},he=.25,we=.15,ke=`
attribute vec3 iPos;     // head of the stroke (object space; relative to iPiv.xyz when iPiv.w > 0)
attribute vec4 iPiv;     // xyz pivot; w > 0: how far (radians) the sheet may yaw to face the camera; 0: fixed sheet; -1 / -2: fixed sheet nodding about the pivot (and its mirror);
                         // w > 15: a blossom, drawn in its sheet's own frame (x, y, normal +z): w - 20 is its tier's facing, and it turns right round to the viewer as uTurn opens
                         // 8 < w < 15: a free-turning sheet of a MEDIUM that is flown through (the pollen rows): its dots thin by size at the lens (see "a medium" below)
attribute vec3 iTan;     // direction the stroke sets off in
attribute vec3 iNrm;     // normal of the sheet it is painted on
attribute vec4 iShape;   // length, full width, c1, c2
attribute vec4 iShape2;  // c3, kind (0 tear 1 C 2 S 3 liner 4 dot), coat (0 ground 1 loaded 2 liner), rank
attribute vec4 iPots;    // pot A (v=-1 side), pot B (v=+1 side), seed 0..1, load split -1..1
attribute vec4 iTime;    // start (paint clock), run-out duration, curl animation amount, dryness 0..1
uniform vec3 uPots[7];
uniform float uClock, uTime, uPx, uRankStep, uBreeze, uRetouch, uFree, uTurn;
varying vec2 vUv;
varying float vRe;       // seconds since the painter's second coat reached this stroke (-1 = none)
varying vec3 vA, vB;
varying vec4 vInfo;      // seed, kind, wetness, dryness
varying vec3 vDim;       // bristles across, load split, how near a fat stroke is (0..1: finer bristles resolve)
const float TAU = 6.2831853;
float kHead(float s, float h) { float t = clamp(s / h, 0., 1.); return sqrt(max(t * (2. - t), 0.)); }
float kWidth(float kind, float s, float cap, float wid) {
  float w;
  if (kind < 0.5) w = kHead(s, cap) * pow(max(1. - max(s - cap * 0.6, 0.) / (1. - cap * 0.6), 0.), 1.2);                         // teardrop
  else if (kind < 1.5) w = pow(abs(sin(3.14159 * pow(max(s, 0.), 0.72))), 0.8);                   // C: thin, fat, thin
  else if (kind < 2.5) w = kHead(s, cap * 0.7) * (0.3 + 0.7 * (1. - s)) * sqrt(clamp((1. - s) / 0.1, 0., 1.)); // S: fat head, long tail
  else if (kind < 3.5) {                                                                           // liner: the hand wavers; a broad brush pulled straight (a wall, a ground band) keeps its width
    float wav = 0.2 * (1. - smoothstep(1., 2.4, wid));
    w = sqrt(clamp(s / 0.03, 0., 1.)) * sqrt(clamp((1. - s) / 0.2, 0., 1.)) * (1. - wav + wav * sin(s * 11.));
  }
  else w = sqrt(max(1. - (2. * s - 1.) * (2. * s - 1.), 0.));                                     // dot
  return w;
}
void main() {
  float len = iShape.x, wid = iShape.y, kind = iShape2.y, seed = iPots.z;
  float age = uClock - iTime.x;
  float dur = max(iTime.y, 0.01);
  float p = clamp(age / dur, 0., 1.);
  p = 1. - (1. - p) * (1. - p);                              // lands fast, runs out slower
  float done = step(1., p);
  float s = position.x * p, v = position.y;
  // the curve
  float breathe = sin(uTime * (0.55 + 0.5 * seed) + seed * 40.) * (0.6 + 0.4 * uBreeze);
  float c1 = iShape.z * (1. + 0.06 * iTime.z * breathe), c2 = iShape.w * (1. + 0.22 * iTime.z * breathe), c3 = iShape2.x;
  float sway = 0.07 * iTime.z * breathe;
  // (a mirror image that must re-fan as the exact mirror of its twin carries the amount negated: its sway then turns the other way, and its curl breathes as the twin's does)
  if (iTime.z < 0.) { c1 = iShape.z * (1. - 0.06 * iTime.z * breathe); c2 = iShape.w * (1. - 0.22 * iTime.z * breathe); }
  vec2 acc = vec2(0.);
  for (int i = 0; i < 10; i++) {
    float t = (float(i) + 0.5) * 0.1 * s;
    float th = (c1 + sway) * t + c2 * t * t * t + c3 * sin(TAU * t);
    acc += vec2(cos(th), sin(th));
  }
  vec2 c = acc * (0.1 * s * len);
  float th = (c1 + sway) * s + c2 * s * s * s + c3 * sin(TAU * s);
  vec2 n2 = vec2(-sin(th), cos(th));
  // the hand: a slow wobble off the true curve, more for liner work
  float wob = (sin(s * 9. + seed * 31.) + 0.5 * sin(s * 23. + seed * 17.)) * len * (kind > 2.5 && kind < 3.5 ? 0.007 : 0.0025);
  // width: the stroke's own profile, a rounded wet front while it is still running
  float hw = 0.5 * wid * kWidth(kind, s, clamp(0.5 * wid / max(len, 0.01), 0.06, 0.45), wid);
  float front = sqrt(clamp((p - s) / 0.07 + done, 0., 1.));
  hw *= mix(front * (1. + 0.35 * exp(-(p - s) * (p - s) * 180.)), 1., done);
  // frame: a fixed sheet, or a sheet that yaws about its pivot to keep its front to the camera
  vec3 T = iTan, N = iNrm, org;
  float side;
  if (iPiv.w > 0.) {
    vec3 pw = (modelMatrix * vec4(iPiv.xyz, 1.)).xyz;
    vec2 d = cameraPosition.xz - pw.xz;
    vec2 mz = modelMatrix[2].xz;
    float yaw0 = atan(mz.x, mz.y + 1e-6);
    float near = step(dot(d, d), 1e-6);
    float yaw = mix(atan(d.x, d.y + near), yaw0, near);
    // a blossom (iPiv.w > 15) rests in its tier's own plane and nods with its bough; on the climb (uTurn 1) it turns
    // right round on its own upright axis to keep its whole face to the rider, as every house and horse here does
    float bl = step(15., iPiv.w), rest = bl * (iPiv.w - 20.);
    float dy = mod(yaw - yaw0 - rest + 3.14159265, TAU) - 3.14159265;
    // on the climb (uFree 1, set by the world while the village is out of sight) a house, horse or tree turns right round to show us its front: the village is a flat picture below
    float lim = mix(iPiv.w + 3.2 * uFree * step(0.35, iPiv.w), 3.2 * uTurn, bl);
    yaw = yaw0 + rest + clamp(dy, -lim, lim);
    float cy = cos(yaw), sy = sin(yaw);
    mat3 R = mat3(cy, 0., -sy, 0., 1., 0., sy, 0., cy);
    vec3 lp = iPos, cen = vec3(0.);
    if (bl > 0.5) {
      float y1 = yaw0 + rest, c0 = cos(y1), s0 = sin(y1), cx = iPiv.x * cos(rest) - iPiv.z * sin(rest);   // cx: how far along the bough the blossom sits (its mirror: negative)
      float wave = sin(uTime * 0.8 - iPiv.y * 0.045) + 0.4 * sin(uTime * 1.9 - iPiv.y * 0.11 + 1.3);
      float ang = (cx < 0. ? -1. : 1.) * (0.016 + 0.05 * uBreeze) * wave;
      float ca = cos(ang), sa = sin(ang);
      lp = vec3(iPos.x * ca - iPos.y * sa, iPos.x * sa + iPos.y * ca, iPos.z);
      T = vec3(T.x * ca - T.y * sa, T.x * sa + T.y * ca, T.z);
      N = vec3(N.x * ca - N.y * sa, N.x * sa + N.y * ca, N.z);
      cen = mat3(c0, 0., -s0, 0., 1., 0., s0, 0., c0) * vec3(-cx * (1. - ca), cx * sa, 0.);              // where the nodding bough has carried the blossom's centre
    }
    T = R * T; N = R * N; org = pw + cen + R * lp;
    vec3 tb = cameraPosition - org;
    side = mix(1., clamp(dot(N, tb) / max(length(tb), 1e-3) * 8., -1., 1.), bl);
  } else {
    mat3 M = mat3(modelMatrix);
    vec3 lp = iPos;
    if (iPiv.w < -0.5) {                                       // a bough: the stroke nods about its pivot, in its own sheet
      float wave = sin(uTime * 0.8 - iPiv.y * 0.045) + 0.4 * sin(uTime * 1.9 - iPiv.y * 0.11 + 1.3);
      float ang = (iPiv.w < -1.5 ? -1. : 1.) * (0.016 + 0.05 * uBreeze) * wave;
      float ca = cos(ang), sa = sin(ang);
      vec3 r = iPos - iPiv.xyz;
      lp = iPiv.xyz + r * ca + cross(N, r) * sa + N * dot(N, r) * (1. - ca);
      T = T * ca + cross(N, T) * sa;
    }
    T = normalize(M * T); N = normalize(M * N);
    org = (modelMatrix * vec4(lp, 1.)).xyz;
    vec3 tc = cameraPosition - org;
    side = clamp(dot(N, tc) / max(length(tc), 1e-3) * 8., -1., 1.);
  }
  vec3 B = cross(N, T);
  float dist = distance(cameraPosition, org);
  // distance is fewer strokes: beyond rank * step the stroke closes up to nothing over 20 m
  float keep = 1. - smoothstep(iShape2.w * uRankStep, iShape2.w * uRankStep + 20., dist);
  keep *= step(0., age);
  // liner work never thins below a pixel and a half (soot liner: two and a half, a brush's liner)
  if (kind > 2.5 && kind < 3.5) hw = max(hw, (abs(iPots.x - 4.) < 0.5 ? 1.25 : 0.75) * dist / max(uPx, 1.) * step(0.02, hw));
  vec2 q = c + n2 * (v * hw + wob);
  float lift = (seed * 0.08 + iShape2.z * ${he.toFixed(2)} + ${we.toFixed(2)} * (1. - v * v) * clamp(wid * 0.5, 0., 1.)) * side;
  vec3 world = org + keep * (T * q.x + B * q.y) + N * lift;
  // a medium (8 < iPiv.w < 15) takes the kit's near law for particles, by size and not by transparency (the paint is flat and opaque): by the true
  // distance from the lens to the dot's own drawn centre, the dot closes about that centre from 2.5 m and nothing of it is left at 0.8 m
  // (0.8 and not the kit's 0.6: at the frame's corner 0.6 m of true distance lies nearer than the near plane, which then cut a last speck of a dot)
  if (iPiv.w > 8. && iPiv.w < 15.) {
    vec3 cen = org + keep * T * (0.5 * len) + N * ((seed * 0.08 + iShape2.z * ${he.toFixed(2)} + ${we.toFixed(2)} * clamp(wid * 0.5, 0., 1.)) * side);
    float thin = smoothstep(0.8, 2.5, distance(cameraPosition, cen));
    if (thin < 1.) world = cen + thin * (world - cen);
  }
  vUv = vec2(s, v);
  vA = uPots[int(clamp(iPots.x, 0., 6.) + 0.5)]; vB = uPots[int(clamp(iPots.y, 0., 6.) + 0.5)];
  float wet = clamp(1. - (age - dur) * 0.5, 0., 1.) * step(0., age);
  vInfo = vec4(seed, kind, wet, iTime.w);
  float nbr = clamp(wid * 4., 5., 14.);
  // a fat stroke passed near: each bristle of the broad brush is then a hand wide, and finer ones resolve inside it
  vDim = vec3(nbr, iPots.w, smoothstep(0.2, 0.45, wid / nbr) * (1. - smoothstep(18., 45., dist)));
  vRe = (uRetouch > 0.5 && age > dur + 4.) ? mod(uTime - iTime.x, max(uRetouch, 1.)) : -1.;
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.);
}`,me=`
uniform vec3 uChalk;
varying vec2 vUv;
varying float vRe;
varying vec3 vA, vB;
varying vec4 vInfo;
varying vec3 vDim;
float kH(float n) { return fract(sin(n * 127.1) * 43758.5453); }
float kN(float x) { float i = floor(x), f = fract(x); f = f * f * (3. - 2. * f); return mix(kH(i), kH(i + 1.), f); }
void main() {
  float s = vUv.x, v = vUv.y, seed = vInfo.x, kind = vInfo.y, wet = vInfo.z;
  float fv = max(fwidth(v), 1e-4);
  float nb = vDim.x;
  // bristle streaks finer than about three pixels give way to their flat average
  float streak = smoothstep(1.5, 3.5, (2. / nb) / fv);
  float bx = v * nb * 0.5 + seed * 57. + 0.4 * kN(s * 3. + seed * 9.);
  float b = kN(bx) * 0.65 + kN(bx * 2.7 + 3.) * 0.35;
  // seen near, a fat stroke shows the brush's finer hairs inside each broad streak (they give way under three pixels)
  float fine = vDim.z * smoothstep(1.5, 3.5, (2. / (nb * 3.3)) / fv);
  float bf = kN(bx * 3.3 + 17.) * 0.6 + kN(bx * 7.9 + s * 4. + 5.) * 0.4;
  b = mix(b, 0.5 * b + 0.5 * bf, fine);
  // double load: pot A on one side of the brush, pot B on the other, meeting along an uneven,
  // bristle-combed edge (each pixel is one pot or the other, never a mixture, while streaks resolve)
  float m = v - vDim.y - 0.25 * (kN(s * 4. + seed * 23.) - 0.5);
  float soft = smoothstep(-0.2, 0.2, m);
  float b2 = kN(bx * 1.9 + 11.) * 0.6 + kN(bx * 4.3 + s * 2.) * 0.4;
  float drag = smoothstep(0.66, 0.74, b2) * 0.75 * smoothstep(0.02, 0.2, s);    // a few bristles drag the other pot right across
  float hard = smoothstep(-fv, fv, m + (b - 0.5) * 0.6 + drag * vInfo.w);
  vec3 col = mix(vA, vB, mix(soft, hard, streak));
  // dry tail: the brush runs out of paint and breaks into streaks of bare board
  float b3 = kN(bx * 2.3 + 29.) * 0.55 + kN(bx * 5.1 + s * 3.) * 0.45;
  b3 = mix(b3, 0.4 * b3 + 0.6 * bf, fine);
  float dry = vInfo.w * streak * (0.97 * smoothstep(0.24 + 0.2 * fine, 0.97, s) + 0.3 * (1. - fine) * smoothstep(0.04, 0.25, s));   // (near: the fat head stays whole, the tail breaks into fine hairs)
  if (b3 < dry) discard;
  // wet for two seconds: a shade deeper, one thin broken chalk line along the ridge; the painter comes round
  // again in the same order with a second coat, so a wet glint keeps travelling through the finished work
  float tw = vRe - s * 0.45;
  wet = max(wet, step(0., tw) * (1. - smoothstep(1.5, 2.3, tw)) * step(0., vRe));
  col *= 1. - 0.15 * smoothstep(0., 0.3, wet);
  float rl = abs(v - 0.3 - 0.07 * sin(s * 5. + seed * 13.));
  float lw = max(0.05, 1.2 * fv);
  float ridge = (1. - smoothstep(lw * 0.6, lw, rl)) * step(0.3, wet) * step(kN(s * 9. + seed * 5.), 0.7)
    * step(kind, 2.5) * smoothstep(0.03, 0.12, s) * (1. - smoothstep(0.65, 0.9, s));
  col = mix(col, uChalk, ridge);
  gl_FragColor = vec4(col, 1.);
}`,qe={strokeVert:ke,strokeFrag:me};function ye(s=ce,t={}){const i=ce.map((a,r)=>new S.Color(s&&s[r]||a)),e={uPots:{value:i},uChalk:{value:i[le.CHALK]},uClock:{value:0},uTime:{value:0},uPx:{value:900},uRankStep:{value:t.rankStep??150},uBreeze:{value:t.breeze??0},uRetouch:{value:t.retouch??0},uGround:{value:i[le.GROUND]},uTurn:{value:0},uFree:{value:0}},o=new S.Vector2;return{uniforms:e,pots:i,setClock(a){e.uClock.value=a},update(a,r,n,c){e.uTime.value=r,c&&n&&n.projectionMatrix&&(c.getDrawingBufferSize(o),e.uPx.value=.5*o.y*n.projectionMatrix.elements[5])}}}function ge(s){return new S.ShaderMaterial({uniforms:s.uniforms,vertexShader:ke,fragmentShader:me,side:S.DoubleSide,transparent:!1,depthWrite:!0,depthTest:!0,fog:!1,toneMapped:!1})}const ze={tear:[14,1.6],dot:[8,0],stroke:[24,1.3],scroll:[44,1],pip:[5,0],round:[20,0],coil:[28,.75]};function Me(s,t){const i=new Float32Array((s+1)*3*3),e=[];for(let a=0;a<=s;a++){const r=t?Math.pow(a/s,t):.5-.5*Math.cos(Math.PI*a/s);for(let n=0;n<3;n++){const c=(a*3+n)*3;i[c]=r,i[c+1]=n-1,i[c+2]=0}if(a<s)for(let n=0;n<2;n++){const c=a*3+n,l=c+3;e.push(c,l,c+1,c+1,l,l+1)}}const o=new S.BufferGeometry;return o.setAttribute("position",new S.BufferAttribute(i,3)),o.setIndex(e),o}const Te=[["iPos",3],["iPiv",4],["iTan",3],["iNrm",3],["iShape",4],["iShape2",4],["iPots",4],["iTime",4]],be=29;function Se(){const s={tear:[],dot:[],stroke:[],scroll:[],pip:[],round:[],coil:[]};let t=0;return{get count(){return t},add(e){const o=e.kind??0,a=Math.abs(e.c1||0)+Math.abs(e.c2||0)+2*Math.abs(e.c3||0),r=e.strip||(o===4?(e.wid??e.len)>=7?"round":(e.wid??e.len)<1.6?"pip":"dot":a>4.2?o===3?"coil":"scroll":o===0&&a<1.6||o===3&&a<1.2?"tear":"stroke"),n=e.pos,c=e.tan||[0,1,0],l=e.nrm||[0,0,1],p=e.piv||[0,0,0];s[r].push(n[0],n[1],n[2],p[0],p[1],p[2],e.face||0,c[0],c[1],c[2],l[0],l[1],l[2],e.len,e.wid??e.len,e.c1||0,e.c2||0,e.c3||0,o,e.coat??1,e.rank??99,e.a??1,e.b??e.a??1,e.seed??.5,e.split??0,e.t0??-1e3,e.dur??.33,e.anim||0,e.dry??.8),t++},bake(e){const o=e.isMaterial?e:ge(e),a=new S.Group;let r=0;for(const n of Object.keys(s)){const c=s[n],l=c.length/be;if(!l)continue;const[p,d]=ze[n],y=Me(p,d),f=new S.InstancedBufferGeometry;f.index=y.index,f.setAttribute("position",y.getAttribute("position"));const M=new Float32Array(c),E=new S.InstancedInterleavedBuffer(M,be,1);let A=0;for(const[w,g]of Te)f.setAttribute(w,new S.InterleavedBufferAttribute(E,g,A)),A+=g;f.instanceCount=l,f.boundingSphere=new S.Sphere(new S.Vector3,1e5);const O=new S.Mesh(f,o);O.frustumCulled=!1,O.name="kurbits-"+n,a.add(O),r+=l*p*4}return a.userData.triangles=r,a.userData.strokes=t,a.userData.material=o,a}}}const Pe=`
varying vec3 vObj; varying vec3 vWorld;
uniform float uFar;
void main() {
  vObj = position; vec4 w = modelMatrix * vec4(position, 1.); vWorld = w.xyz;
  vec4 p = projectionMatrix * viewMatrix * w;
  if (uFar > 0.5) { if (abs(p.w) < 1e-4) p.w = 1e-4; p = p.xyww; p.z = p.w * 0.99999; }
  gl_Position = p;
}`,Ne=`
uniform vec3 uGround; uniform float uMode, uPlank, uKnots, uKnotSize;
varying vec3 vObj; varying vec3 vWorld;
float bH(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main() {
  vec2 ab;
  if (uMode < 0.5) ab = vWorld.xz / uPlank;
  else if (uMode < 1.5) {
    float r = max(length(vObj.xz), 1e-3);
    ab = vec2(atan(vObj.x, vObj.z + 1e-5 * step(abs(vObj.x) + abs(vObj.z), 0.)) * 57.29578, vObj.y / r * 57.29578) / uPlank;
  } else ab = vec2(vObj.z, vObj.x) / max(abs(vObj.y), 1e-3) * 57.29578 / uPlank;
  vec2 fw = fwidth(ab); float fa = min(max(fw.x, 1e-5), 0.5), fb = max(fw.y, 1e-5);
  float id = floor(ab.x), f = ab.x - id;
  float fine = 1. - smoothstep(0.07, 0.28, fa);                      // planks under ~3 px: flat coat only
  // seams between planks, and a butt joint now and then along each plank
  float d = min(f, 1. - f), sw = max(0.014, 0.75 * fa);
  float seam = 1. - smoothstep(sw, sw + fa, d);
  float jb = ab.y / 26. + bH(vec2(id, 3.)); float jd = abs(fract(jb) - 0.5) * 26.;
  float jw = max(0.014, 0.75 * fb);
  seam = max(seam, (1. - smoothstep(jw, jw + fb, 13. - jd)) * step(0.5, bH(vec2(id, floor(jb)))));
  // knots: about one board in three, a warmer darker oval bleeding through, grain bending round it
  float cell = floor(ab.y / 9.), kh = bH(vec2(id, cell * 1.7 + 5.));
  float has = step(kh, 0.36 * uKnots) * step(bH(vec2(id, 9.)), 0.5);
  vec2 kc = vec2(0.5 + (bH(vec2(id, cell + 0.3)) - 0.5) * 0.4, (cell + 0.5 + (bH(vec2(cell, id)) - 0.5) * 0.6) * 9.);
  vec2 kr = vec2(0.13, 0.24) * (0.7 + 0.9 * bH(vec2(id + 2., cell))) * uKnotSize;
  vec2 kd = (vec2(f, ab.y) - kc) / kr; float k = length(kd);
  float knot = has * (1. - smoothstep(1. - 2. * fa / kr.x, 1., k));
  float halo = has * exp(-k * k * 0.12);
  float gx = f + halo * 0.16 * sign(kd.x) + 0.012 * sin(ab.y * 0.9 + id * 2.3);
  float gp = fract(gx * 9. + bH(vec2(id, 1.)) * 5.), gl = abs(gp - 0.5) * 2.;
  float gfw = min(fa * 9. * 2., 1.);
  float grain = (1. - smoothstep(0.1, 0.1 + gfw, gl)) * (1. - smoothstep(0.12, 0.3, fa * 9.)) * step(0.45, bH(vec2(id, floor(gx * 9.))));
  float ring = has * (1. - smoothstep(0.08, 0.2, abs(fract(k * 2.6) - 0.5))) * step(k, 1.);
  vec3 col = uGround;
  col = mix(col, uGround * vec3(0.93, 0.925, 0.92), grain * 0.9 * fine);
  col = mix(col, uGround * vec3(0.77, 0.67, 0.56), knot * fine);
  col = mix(col, uGround * vec3(0.56, 0.45, 0.35), knot * ring * fine);
  col = mix(col, uGround * vec3(0.6, 0.61, 0.62), seam * fine * 0.85);
  gl_FragColor = vec4(col, 1.);
}`;function de(s,t={}){const i=t.mode??0;return new S.ShaderMaterial({uniforms:{uGround:s.uniforms.uGround,uMode:{value:i},uPlank:{value:t.plank??(i===0?14:2)},uKnots:{value:t.knots??1},uKnotSize:{value:t.knotSize??1},uFar:{value:t.far?1:0}},vertexShader:Pe,fragmentShader:Ne,side:t.side??S.DoubleSide,depthWrite:!t.far,depthTest:!0,fog:!1,toneMapped:!1})}const j=(s,t,i)=>new S.Vector3(s,t,i);function F(s,t,i,e,o={}){const a=j(...t),r=j(...i).normalize(),n=j(...e).normalize(),c=j().crossVectors(r,n).normalize(),l=j(),p=j(),d=j();function y(f){const M=Math.cos(f.ang||0),E=Math.sin(f.ang||0),A=f.lift||0,O=Math.cos(A),w=Math.sin(A);if(l.copy(r).multiplyScalar(M).addScaledVector(n,E),p.copy(c).multiplyScalar(O).addScaledVector(l,-w),l.multiplyScalar(O).addScaledVector(c,w),f.turn){const g=f.turn;d.copy(a).addScaledVector(r,g),s.add({...o,...f,pos:[(f.x||0)-g,f.y||0,f.z||0],tan:[M*O,E*O,w],nrm:[-M*w,-E*w,O],piv:[d.x,d.y,d.z],face:20+Math.atan2(c.x,c.z)});return}d.copy(a).addScaledVector(r,f.x||0).addScaledVector(n,f.y||0).addScaledVector(c,f.z||0),s.add({...o,...f,pos:[d.x,d.y,d.z],tan:[l.x,l.y,l.z],nrm:[p.x,p.y,p.z]})}return{O:a,X:r,Y:n,N:c,put(f){if((f.b??f.a)!==f.a){const E=f.split||0,A=Math.min(Math.abs(E)+.3,.8);f=E<0?{...f,a:f.b,b:f.a,split:-A}:{...f,split:A}}if(y(f),!f.mirror)return;const M={...f,x:-(f.x||0),ang:Math.PI-(f.ang||0),c1:-(f.c1||0),c2:-(f.c2||0),c3:-(f.c3||0),a:f.b??f.a,b:f.a,split:-(f.split||0),t0:(f.t0??-1e3)+(f.mirrorLag||0),seed:((f.seed??.5)*7.31+.137)%1};(f.face??o.face)===-1&&(M.face=-2),f.turn&&(M.turn=-f.turn),y(M)}}}function R(s,t,i=24){let e=0,o=0;const a=s.c1||0,r=s.c2||0,n=s.c3||0,c=s.ang||0;for(let p=0;p<i;p++){const d=(p+.5)/i*t,y=c+a*d+r*d*d*d+n*Math.sin(6.2831853*d);e+=Math.cos(y),o+=Math.sin(y)}const l=t*s.len/i;return[(s.x||0)+e*l,(s.y||0)+o*l,c+a*t+r*t*t*t+n*Math.sin(6.2831853*t)]}const m=Math.PI,I=m*2,{RED:B,OCHRE:v,CHALK:u,SOOT:N,BLUE:U,GREEN:C}=le;function b(s,t){const i=t.n,e=t.span??I,o=e>I-.01;for(let a=0;a<i;a++){const r=o?a/i:i===1?.5:a/(i-1),n=(r-.5)*e+(t.phase||0),c=t.dir+n,l=Math.abs(n)<.001?1:Math.sign(n),p=t.inward!==!1,d=p?t.r0:t.r0-t.len,y=(t.lean||0)*l;s.push({x:t.cx+Math.cos(c)*d,y:t.cy+Math.sin(c)*d,ang:c+(p?m:0)+y,len:t.len*(1+(t.jit||0)*(t.rng()-.5)),wid:t.wid,kind:t.kind??h.TEAR,c1:(t.c1||0)*l,c3:(t.c3||0)*l,c2:(t.c2||0)*l,a:t.a,b:t.b??t.a,split:(t.split??0)*l*(p?1:-1),coat:t.coat??1,rank:t.rank??6,z:(t.bowl||0)*(p?t.len:0),lift:(t.bowl||0)*(p?-1:1),dry:t.dry??.8,anim:t.anim||0,seed:t.rng(),dur:t.dur??.33,strip:t.strip})}}function $(s,t){for(let i=0;i<t.n;i++){const e=t.dir+i/t.n*I*(t.turn||1)+(t.phase||0),o=t.arc;s.push({x:t.cx+Math.cos(e)*t.r,y:t.cy+Math.sin(e)*t.r,ang:e+m/2-(t.open||0),len:t.r*o*(1+(t.open||0)*.5),wid:t.wid,kind:t.kind??h.C,c1:o+(t.open||0)*2,a:t.a,b:t.b??t.a,split:t.split??0,coat:t.coat??1,rank:t.rank??6,dry:t.dry??.7,z:t.z||0,seed:t.rng(),dur:t.dur??.33,strip:t.strip})}}function L(s,t){const i=t.n,e=t.span??I,o=e>I-.01;for(let a=0;a<i;a++){const r=o?a/i:i===1?.5:a/(i-1),n=t.dir+(r-.5)*e+(t.phase||0),c=1-(t.fade??.35)*(a/Math.max(i-1,1))**2;s.push({x:t.cx+Math.cos(n)*t.r,y:t.cy+Math.sin(n)*t.r-t.size*c*.5,ang:m/2,len:t.size*c,wid:t.size*c,kind:h.DOT,a:t.a,b:t.b??t.a,coat:t.coat??2,rank:t.rank??2.2,z:t.z||0,seed:t.rng(),dur:.12,dry:0})}}const Q=s=>({kind:h.LINER,coat:2,rank:3,wid:.42,a:N,dry:.5,dur:.5,seed:.5,...s}),ee=(s,t)=>Q({len:14,c1:1.2*(t.sgn||1),c2:6.5*(t.sgn||1),anim:1,wid:.38,rank:3.5,seed:s(),dur:.7,...t}),ne={gourd(s,t,i,e,o,a,r){const n=r.n||9,c=3.75,l=e*c/n*.92,p=r.warm?v:B;b(s.g,{cx:t,cy:i,dir:o,n:n+1,span:c+c/n,r0:e*1,len:e*.5,wid:l*.7,a:U,b:u,split:.15,coat:0,rng:a,bowl:.12,rank:5}),b(s.p,{cx:t,cy:i,dir:o,n,span:c,r0:e*.86,len:e*.66,wid:l,a:p,b:u,split:.1,rng:a,bowl:.22,jit:.06,rank:9,anim:.5}),b(s.p,{cx:t,cy:i,dir:o+m,n:2,span:1.5,r0:e*.62,len:e*.6,wid:e*.2,a:C,b:u,split:.2,c1:-.9,kind:h.C,inward:!1,rng:a,rank:7}),s.p.push({x:t,y:i-e*.2,ang:m/2,len:e*.4,wid:e*.4,kind:h.DOT,a:v,b:r.warm?B:v,coat:1,rank:8,z:.4,seed:a(),dur:.3,dry:0}),$(s.p,{cx:t,cy:i,dir:o,n:5,r:e*.25,arc:1,wid:e*.09,a:u,b:p,z:.5,rng:a,strip:"tear",rank:4}),b(s.l,{cx:t,cy:i,dir:o,n,span:c,r0:e*.8,len:e*.5,wid:.42,kind:h.LINER,a:N,c1:.5,lean:.12,rng:a,bowl:.22,coat:2,rank:3,dur:.4}),b(s.l,{cx:t,cy:i,dir:o,n:3,span:1.3,r0:e*.98,len:e*.34,wid:.36,kind:h.LINER,a:u,c1:1.6,c2:3.5,inward:!1,rng:a,coat:2,rank:3,anim:1}),L(s.d,{cx:t,cy:i,dir:o,n,span:c,r:e*.95,size:e*.062,a:u,rng:a,z:e*.2}),L(s.d,{cx:t,cy:i,dir:o,n:6,r:e*.1,size:e*.045,a:N,rng:a,z:.8,fade:0})},rose(s,t,i,e,o,a,r){const n=r.warm?B:U,c=r.warm?U:B;$(s.g,{cx:t,cy:i,dir:o,n:8,r:e*.9,arc:.74,wid:e*.2,a:C,b:u,split:-.2,coat:0,rng:a,open:-.25,rank:5,strip:"tear",kind:h.TEAR}),$(s.p,{cx:t,cy:i,dir:o,n:8,r:e*.76,arc:.74,wid:e*.3,a:n,b:u,split:-.1,rng:a,phase:.2,rank:9,open:.42}),$(s.p,{cx:t,cy:i,dir:o,n:6,r:e*.52,arc:.95,wid:e*.27,a:c,b:u,split:-.1,rng:a,phase:.5,z:.5,rank:9,open:.48}),$(s.p,{cx:t,cy:i,dir:o,n:4,r:e*.29,arc:1.3,wid:e*.22,a:v,b:u,split:-.1,rng:a,z:1,rank:7,open:.5}),s.p.push({x:t,y:i-e*.1,ang:m/2,len:e*.2,wid:e*.2,kind:h.DOT,a:v,b:u,coat:1,rank:6,z:1.4,seed:a(),dur:.3,dry:0}),$(s.l,{cx:t,cy:i,dir:o,n:8,r:e*.69,arc:.62,wid:.42,kind:h.LINER,a:N,rng:a,phase:.28,coat:2,rank:3,z:.6,dur:.4,open:.42}),$(s.l,{cx:t,cy:i,dir:o,n:6,r:e*.46,arc:.8,wid:.36,kind:h.LINER,a:N,rng:a,phase:.6,coat:2,rank:3,z:1.1,dur:.4,open:.48}),b(s.l,{cx:t,cy:i,dir:o,n:4,span:2.6,r0:e*.98,len:e*.36,wid:.36,kind:h.LINER,a:N,c1:1.5,c2:4,inward:!1,rng:a,coat:2,rank:3,anim:1}),L(s.d,{cx:t,cy:i,dir:o,n:18,r:e*1.02,size:e*.055,a:u,rng:a,fade:.5}),L(s.d,{cx:t,cy:i,dir:o,n:5,r:e*.06,size:e*.04,a:N,rng:a,z:1.8,fade:0})},bell(s,t,i,e,o,a,r){const n=r.n2||7,c=t-Math.cos(o)*e*.78,l=i-Math.sin(o)*e*.78,p=r.warm?v:B;b(s.g,{cx:c,cy:l,dir:o,n:n-1,span:1.5,r0:e*1.56,len:e*1.45,wid:e*.34,a:U,b:u,split:.2,coat:0,rng:a,rank:5,kind:h.S,c3:-.1,c1:-.3,lean:.2}),b(s.p,{cx:c,cy:l,dir:o,n,span:1.75,r0:e*1.78,len:e*1.7,wid:e*.46,a:p,b:u,split:.15,kind:h.S,c3:-.16,c1:-.45,lean:.3,rng:a,jit:.05,rank:9,bowl:.1}),b(s.p,{cx:c,cy:l,dir:o+m,n:3,span:4.3,r0:e*.5,len:e*.48,wid:e*.2,a:C,b:u,split:.2,inward:!1,rng:a,rank:7}),b(s.p,{cx:c,cy:l,dir:o,n:n-1,span:1.5,r0:e*1.86,len:e*.3,wid:e*.16,a:v,b:u,rng:a,rank:5,z:.5}),b(s.l,{cx:c,cy:l,dir:o,n:3,span:.5,r0:e*2.05,len:e*1.5,wid:.4,kind:h.LINER,a:N,c1:.25,inward:!1,rng:a,coat:2,rank:3,dur:.5}),b(s.l,{cx:c,cy:l,dir:o,n,span:1.75,r0:e*1.5,len:e*1.1,wid:.36,kind:h.LINER,a:u,c1:.35,lean:-.06,inward:!1,rng:a,coat:2,rank:3,dur:.4}),L(s.d,{cx:c,cy:l,dir:o,n:3,span:.5,r:e*2.1,size:e*.09,a:v,b:B,rng:a,fade:0}),L(s.d,{cx:c,cy:l,dir:o,n:n+3,span:2,r:e*1.97,size:e*.05,a:u,rng:a,phase:0}),L(s.d,{cx:c,cy:l,dir:o,n:4,span:1,r:e*.42,size:e*.045,a:u,rng:a,fade:0})}};Object.assign(ne,{wheel(s,t,i,e,o,a,r){const n=r.n3||13,c=e*I/n*.5,l=r.warm?v:u,p=r.warm?u:v;b(s.g,{cx:t,cy:i,dir:o,n,r0:e*1,len:e*.62,wid:c*.9,a:U,b:u,split:.3,coat:0,rng:a,phase:m/n,rank:5,bowl:.1}),b(s.p,{cx:t,cy:i,dir:o,n,r0:e*.9,len:e*.64,wid:c*1.25,a:l,b:p,split:.1,rng:a,bowl:.2,rank:9,jit:.05,anim:.5}),s.p.push({x:t,y:i-e*.24,ang:m/2,len:e*.48,wid:e*.48,kind:h.DOT,a:B,b:v,coat:1,rank:9,z:.5,seed:a(),dur:.3,dry:0}),$(s.p,{cx:t,cy:i,dir:o,n:6,r:e*.3,arc:.85,wid:e*.1,a:v,b:u,z:.8,rng:a,strip:"tear",rank:4}),b(s.l,{cx:t,cy:i,dir:o,n,r0:e*.82,len:e*.42,wid:.4,kind:h.LINER,a:N,c1:.3,rng:a,bowl:.2,coat:2,rank:3,dur:.35}),$(s.l,{cx:t,cy:i,dir:o,n:3,r:e*.17,arc:1.7,wid:.4,kind:h.LINER,a:N,rng:a,coat:2,rank:3,z:1}),L(s.d,{cx:t,cy:i,dir:o,n,r:e*1.04,size:e*.06,a:u,rng:a,phase:m/n,fade:.45}),L(s.d,{cx:t,cy:i,dir:o,n:8,r:e*.12,size:e*.05,a:u,rng:a,z:1.2,fade:0})},tulip(s,t,i,e,o,a,r){const n=t-Math.cos(o)*e*.85,c=i-Math.sin(o)*e*.85,l=r.warm?B:v,p=r.warm?v:B;b(s.g,{cx:n,cy:c,dir:o,n:4,span:2.3,r0:e*1.5,len:e*1.4,wid:e*.34,a:U,b:u,split:.2,coat:0,rng:a,rank:5,c1:-.5,kind:h.C,inward:!1}),b(s.p,{cx:n,cy:c,dir:o,n:2,span:1.1,r0:e*1.62,len:e*1.5,wid:e*.62,a:l,b:u,split:.15,c1:.42,rng:a,rank:9,bowl:.12}),b(s.p,{cx:n,cy:c,dir:o,n:1,r0:e*1.86,len:e*1.75,wid:e*.72,a:p,b:l,split:0,rng:a,rank:9,z:.6}),b(s.p,{cx:n,cy:c,dir:o+m,n:2,span:2.4,r0:e*.6,len:e*.56,wid:e*.22,a:C,b:u,split:.2,c1:.8,inward:!1,rng:a,rank:7}),b(s.p,{cx:n,cy:c,dir:o,n:5,span:1.5,r0:e*2.08,len:e*.36,wid:e*.15,a:u,b:U,split:.2,rng:a,rank:5}),b(s.l,{cx:n,cy:c,dir:o,n:2,span:1.1,r0:e*1.5,len:e*1.2,wid:.42,kind:h.LINER,a:N,c1:.5,lean:.1,rng:a,coat:2,rank:3,dur:.45}),b(s.l,{cx:n,cy:c,dir:o,n:2,span:.34,r0:e*1.7,len:e*1.3,wid:.36,kind:h.LINER,a:u,c1:-.2,rng:a,coat:2,rank:3,z:.7,dur:.45}),b(s.l,{cx:n,cy:c,dir:o,n:2,span:2.2,r0:e*1.7,len:e*.4,wid:.36,kind:h.LINER,a:N,c1:1.6,c2:4,inward:!1,rng:a,coat:2,rank:3,anim:1});for(let d=0;d<6;d++)s.d.push({x:n+Math.cos(o)*e*(.5+d*.2),y:c+Math.sin(o)*e*(.5+d*.2)-e*.035,ang:m/2,len:e*.07*(1-d*.07),wid:e*.07*(1-d*.07),kind:h.DOT,a:N,coat:2,rank:2.2,z:1,seed:a(),dur:.12,dry:0});L(s.d,{cx:n,cy:c,dir:o,n:5,span:1.5,r:e*2.14,size:e*.055,a:u,rng:a})},peacock(s,t,i,e,o,a,r){const n=r.n4||11,c=4.2,l=t-Math.cos(o)*e*.3,p=i-Math.sin(o)*e*.3,d=r.warm?C:U;b(s.p,{cx:l,cy:p,dir:o,n,span:c,r0:e*1.2,len:e*1.08,wid:e*.25,a:d,b:u,split:.2,kind:h.S,c3:.07,anim:.6,inward:!1,rng:a,rank:9,bowl:.16,jit:.04}),b(s.p,{cx:l,cy:p,dir:o,n:n-4,span:c*.62,r0:e*.66,len:e*.5,wid:e*.24,a:B,b:u,split:.1,rng:a,rank:8,z:.5,bowl:.1}),b(s.p,{cx:l,cy:p,dir:o+m,n:2,span:1.3,r0:e*.55,len:e*.5,wid:e*.2,a:C,b:u,split:.2,c1:-.8,kind:h.C,inward:!1,rng:a,rank:7}),L(s.p,{cx:l,cy:p,dir:o,n,span:c,r:e*1.2,size:e*.2,a:v,b:B,rng:a,fade:0,coat:1,rank:7,z:e*.18}),L(s.p,{cx:l,cy:p,dir:o,n:1,r:0,size:e*.26,a:v,rng:a,coat:1,rank:7,z:.9}),b(s.l,{cx:l,cy:p,dir:o,n,span:c,r0:e*1.06,len:e*.7,wid:.38,kind:h.LINER,a:N,inward:!1,rng:a,coat:2,rank:3,bowl:.16,dur:.4}),b(s.l,{cx:l,cy:p,dir:o,n:n-4,span:c*.62,r0:e*.6,len:e*.36,wid:.36,kind:h.LINER,a:N,c1:.5,lean:.1,rng:a,coat:2,rank:3,z:.6}),L(s.d,{cx:l,cy:p,dir:o,n,span:c,r:e*1.2,size:e*.075,a:N,rng:a,fade:0,z:e*.2+.3}),L(s.d,{cx:l,cy:p,dir:o,n:n-1,span:c-c/(n-1),r:e*1.33,size:e*.05,a:u,rng:a,z:e*.2})}});const Ee=Object.keys(ne),Oe={tulip:.8,bell:.84,peacock:.92};function ve(s,t,i,e,o,a,r,n={}){const c={x:t,y:i,ang:e,len:o,wid:o*.13,kind:h.S,c1:-.5*a,c2:-(4.3+r()*1.1)*a,a:C,b:u,split:.15*a,coat:1,rank:12,anim:.5,seed:r(),dur:.8,dry:.75,strip:"scroll"};s.s.push(c);const l=n.leaflets??6;for(let d=0;d<l;d++){const y=.07+.5*(d/(l-1)),f=R(c,y),M=1-.5*d/(l-1);s.s.push({x:f[0],y:f[1],ang:f[2]+(.75+.1*d)*a,len:o*.25*M,wid:o*.085*M,kind:h.TEAR,c1:-.7*a,a:C,b:d%2?v:u,split:.25*a,coat:0,rank:7,seed:r(),dur:.33,strip:"tear"}),d%2===0&&d<l-1&&s.s.push({x:f[0],y:f[1],ang:f[2]-(.8+.1*d)*a,len:o*.13*M,wid:o*.05*M,kind:h.TEAR,c1:.6*a,a:C,b:u,split:-.25*a,coat:0,rank:5,seed:r(),dur:.3,strip:"tear"})}s.l.push(Q({x:t,y:i,ang:e-.05*a,len:o*.6,c1:-.5*.6*a,c2:c.c2*.216,a:N,wid:.45,z:.1,seed:r(),dur:.7,rank:3.5}));const p=R(c,.4);s.l.push(ee(r,{x:p[0],y:p[1],ang:p[2]-1.2*a,sgn:-a,len:o*.3,a:u}));for(let d=0;d<5;d++){const y=R(c,.12+d*.09),f=1.25*(1-d*.12);s.d.push({x:y[0],y:y[1]-f*.5,ang:m/2,len:f,wid:f,kind:h.DOT,a:u,coat:2,rank:2.2,z:.2,seed:r(),dur:.12,dry:0})}}const Ve={FLOWERS:ne,fan:b,ring:$,dots:L,liner:Q,tendril:ee,scrollLeaf:ve};function Y(s,t,i,e,o){const a=i-s,r=e-t,n=Math.hypot(a,r),c=Math.atan2(r,a),l=o/2;return{x:s,y:t,ang:c-l,len:Math.abs(l)<.001?n:n*l/Math.sin(l),c1:o}}const J=[40,80,125,170,215,260,305,350],ae=[58,58,56,53,50,46,42,38],xe={tiers:[[-12,-3,1.6],[2,9,11],[10,17,19],[18.5,24.5,27.2],[23,28.3,30.2],[26.3,31.4,33.2],[29.5,34.5,36.2],[32.5,37.1,38.7]],crown:[33.7,41.55],lead:3.2,journey:42},Z=385,oe=410,ie=[.5,.8660254,0];function pe(s,t){const i=s.tiers;let e=0,o=i[0][0]-s.lead-6;for(let a=0;a<J.length;a++){const r=i[a][0]-s.lead;if(t<=J[a])return o+(r-o)*(t-e)/(J[a]-e);e=J[a],o=r}return o+(s.crown[0]-1.6-o)*Math.min((t-e)/(Z-e),1.2)}function se(s,t,i,e,o){const a=t.length;if(!a)return;const r=(e-i)/a;for(let n=0;n<a;n++)s.put({...t[n],...o,t0:i+n*r,mirror:!0,mirrorLag:r*.5})}function je(s,t,i,e,o,a){const r=J[t],n=ae[t]/60,c=25*n*(Oe[i]||1),l=(t-1)*m/4,p=t>=3&&t%2?-1:1,d=F(s,[0,r,0],[-Math.cos(l)*p,0,Math.sin(l)*p],[0,1,0],{piv:[0,r,0],face:-1}),[y,f,M,E=y]=o.tiers[t],A=y-o.lead,O=.72+e.range(-.12,.2),w=ae[t]-c*1.02,g=17*n+e.range(0,5),z={g:[],p:[],l:[],d:[],s:[]};if(ne[i](z,w,g,c,O,e,a),t<7)for(const T of["g","p","l","d","s"])for(const _ of z[T])_.turn=w;d.put({x:0,y:-4.5*n,ang:m/2,len:9*n,wid:9*n,kind:h.DOT,a:v,b:B,coat:1,rank:20,t0:A,dur:.3,seed:e(),dry:0}),d.put({x:.6,y:-5*n,...Y(.6,-5*n,.6,5*n,-2.2),wid:2.6*n,kind:h.C,a:u,b:v,coat:2,rank:8,t0:A+.25,seed:e(),mirror:!0,mirrorLag:.15}),d.put({x:0,y:3*n,ang:m/2,len:13*n,wid:4.6*n,kind:h.TEAR,a:B,b:u,split:.1,coat:2,rank:9,t0:A+.6,seed:e(),strip:"tear"});const G=w-Math.cos(O)*c*.72,H=g-Math.sin(O)*c*.72,D={...Y(1.5,-1,G,H,1+e.range(0,.35)),wid:4.6*n,kind:h.S,a:U,b:u,split:-.15,coat:0,rank:99,seed:e(),dur:.9,dry:.6};d.put({...D,t0:A+.5,mirror:!0,mirrorLag:.45});const q={s:[],l:[],d:[]};for(let T=0;T<3;T++){const _=R(D,.3+T*.22);q.s.push({x:_[0],y:_[1],ang:_[2]+.9,len:(9-T*1.6)*n,wid:(3.2-T*.5)*n,kind:h.TEAR,c1:-.6,a:C,b:u,split:.25,coat:0,rank:6,seed:e(),strip:"tear"}),T<2&&q.s.push({x:_[0],y:_[1],ang:_[2]-1,len:(6.5-T)*n,wid:2.3*n,kind:h.TEAR,c1:.6,a:v,b:u,split:-.25,coat:0,rank:5,seed:e(),strip:"tear"})}q.l.push(Q({...Y(2.5,-2.2,G,H-1.2*n,D.c1*.96),wid:.5,z:.1,seed:e(),dur:.8,rank:4}));const X=R(D,.5),W=R(D,.16);q.l.push(ee(e,{x:X[0],y:X[1],ang:X[2]+1.3,sgn:-1,len:17*n,a:u})),q.l.push(ee(e,{x:W[0],y:W[1],ang:W[2]+1.9,sgn:1,len:13*n,a:N})),q.l.push(ee(e,{x:1.5,y:-6*n,ang:-1.2,sgn:-1,len:12*n,a:N,c2:5}));for(let T=0;T<8;T++){const _=R(D,.1+T*.1),re=1.5*n*(1-T*.07);q.d.push({x:_[0],y:_[1]-re*.5,ang:m/2,len:re,wid:re,kind:h.DOT,a:u,coat:2,rank:2.4,z:.2,seed:e(),dur:.12,dry:0})}const te=(t+(a.leafFlip?1:0))%2===0;ve(z,1.2,-3*n,te?-.8:-.35,40*n*e.range(.94,1.06),te?-1:1,e),se(d,[...z.s,...q.s],A+1.1,y-.1),se(d,[...z.g,...z.p],E,f),se(d,[...q.l,...z.l],f,M-.9);const k=q.d.length+z.d.length;se(d,[...q.d,...z.d],Math.max(f+.3,M-k/8),M);const P=F(s,[0,r+23*n,0],[d.N.x,0,d.N.z],[0,1,0],{piv:[0,r+23*n,0],face:-1}),x=pe(o,r+23*n)+.5,V=[];V.push({x:1,y:0,ang:.5,len:17*n,wid:5*n,kind:h.TEAR,c1:-1.1,a:C,b:u,split:.2,coat:0,rank:8,seed:e(),strip:"stroke",anim:.6}),V.push({x:1,y:1.5,ang:1.15,len:11*n,wid:3.4*n,kind:h.TEAR,c1:-.7,a:C,b:v,split:.2,coat:0,rank:6,seed:e(),strip:"tear"}),V.push({x:1.2,y:-1,ang:-.3,len:9*n,wid:3*n,kind:h.TEAR,c1:.9,a:B,b:u,split:-.15,coat:1,rank:7,seed:e(),strip:"tear"}),V.push(ee(e,{x:1.5,y:2,ang:.9,sgn:1,len:13*n,a:u,coat:1}));for(let T=0;T<4;T++)V.push({x:(4+T*2.4)*n,y:(-3.4-T*.9)*n,ang:m/2,len:1.3*n*(1-T*.12),wid:1.3*n*(1-T*.12),kind:h.DOT,a:u,coat:2,rank:2.4,seed:e(),dur:.12,dry:0});se(P,V,x,x+2.2),(o.facts||(o.facts=[]))[t]={at:[w,g],dir:O,R:c,sheetX:[d.X.x,d.X.y,d.X.z],turns:t<7,vary:a};const K=T=>d.O.clone().addScaledVector(d.X,T*w).addScaledVector(d.Y,g);return{y:r,angle:l,normal:d.N.clone(),blossoms:[K(1),K(-1)],radius:c*1.08,reach:ae[t],flower:i,petals:[E,f],done:M}}function Ae(s,t,i,e){const o=F(s,[0,0,0],[1,0,0],[0,1,0],{face:7,piv:[0,0,0]});let a=0;for(let r=17;r<Z-6;a++){const n=9-6*(r/Z),c=Math.min(n*2.1+5,Z-r+1),l=a%2?1:-1,p=pe(i,r+c*.5);if(o.put({x:l*n*.1,y:r,ang:m/2+l*.07,len:c,wid:n,kind:h.S,c3:-l*.16,a:e[0],b:e[1],split:l*.12,coat:0,rank:99,t0:p,dur:.5,seed:t(),dry:.55}),a%2===0)o.put(Q({x:-l*n*.3,y:r+1,ang:m/2-l*.05,len:c*.8,c3:l*.2,a:N,wid:.5,coat:1,rank:4,t0:p+.6,seed:t(),dur:.5}));else for(let d=0;d<3;d++)o.put({x:-l*n*.26,y:r+2+d*2.6,ang:m/2,len:1.3-d*.2,wid:1.3-d*.2,kind:h.DOT,a:u,coat:1,rank:2.4,t0:p+.7+d*.25,dur:.12,seed:t(),dry:0});r+=c*.62}}function Ce(s,t){const i=F(s,[0,0,0],[1,0,0],[0,1,0],{face:7,piv:[0,0,0],rank:99}),e=r=>i.put({seed:t(),mirror:!0,...r}),o=r=>i.put({seed:t(),...r});o({x:0,y:17.6,ang:-m/2,len:15,wid:12.5,kind:h.TEAR,a:v,b:v,coat:0,dry:.15,strip:"stroke"}),o({...Y(-6.4,1.1,6.4,1.1,.5),wid:2.6,kind:h.C,a:U,b:u,split:.1,coat:1}),e({...Y(5.2,1.6,1.9,4.6,-1.3),wid:1.9,kind:h.C,a:v,b:u,split:.2,coat:1}),e({...Y(2,3.8,3.3,17.4,2.35),wid:6.2,kind:h.C,a:v,b:u,split:.25,coat:1,dry:.5}),o({x:-8.2,y:11.4,ang:0,len:16.4,wid:2.5,kind:h.S,c3:.07,a:U,b:u,split:.15,coat:1,dry:.7}),o({...Y(-3.9,18.3,3.9,18.3,-.5),wid:2.3,kind:h.C,a:U,b:u,split:-.1,coat:1}),o({...Y(-5.9,21,5.9,21,.45),wid:2.4,kind:h.C,a:v,b:u,split:.2,coat:2}),e({...Y(4,19.8,8,9.6,-2.5),wid:2,kind:h.S,c2:0,a:U,b:u,split:-.2,coat:1}),e({x:8,y:9.6,ang:-2.3,len:6,wid:1.3,kind:h.TEAR,c1:-2.6,c2:-2.5,a:U,b:u,coat:1,strip:"stroke"});const a={p:[],l:[],d:[]};b(a.p,{cx:0,cy:3.6,dir:m/2,n:3,span:1.3,r0:6.6,len:6,wid:2.3,a:B,b:u,split:.15,rng:t,coat:2}),b(a.p,{cx:0,cy:12.6,dir:m/2,n:3,span:1.5,r0:4.6,len:4.2,wid:1.7,a:B,b:u,split:.15,rng:t,coat:2});for(const r of a.p)o(r);e(Q({...Y(4.2,3.4,5.4,17.6,2.3),wid:.34,coat:2})),e(Q({x:1.2,y:4.2,ang:.3,len:5,c1:1.5,c2:4.5,wid:.3,coat:2,a:N,anim:.6})),e(Q({x:8.6,y:15,ang:.6,len:7,c1:1.2,c2:5,wid:.3,coat:2,a:u,anim:1}));for(let r=0;r<11;r++)o({x:-7+r*1.4,y:11.15+.07*16.4/I*(1-Math.cos(I*(r*1.4+1.2)/16.4))*.6,ang:m/2,len:.75,wid:.75,kind:h.DOT,a:u,coat:2,rank:2.4,dry:0});for(let r=0;r<7;r++)o({x:-4.2+r*1.4,y:20.9+.3*Math.sin(r/6*m),ang:m/2,len:.6,wid:.6,kind:h.DOT,a:N,coat:2,rank:2.4,z:.3,dry:0});e({x:2.2,y:21.6,ang:.9,len:9,wid:2.6,kind:h.TEAR,c1:-1.1,a:C,b:u,split:.25,coat:0,strip:"stroke"}),e({x:1.2,y:21.8,ang:1.3,len:6,wid:1.9,kind:h.TEAR,c1:-.5,a:C,b:v,split:.25,coat:0})}function De(s,t,i){const e=j(...ie),o=j(0,0,1),a=j().crossVectors(o,e).normalize(),r=F(s,[0,oe,0],[o.x,o.y,o.z],[a.x,a.y,a.z]),[n,c]=i.crown,l=24,p={g:[],p:[],l:[],d:[],e:[]},d={cx:0,cy:0,dir:m/2,n:l,rng:t,phase:m/l};b(p.g,{...d,phase:0,r0:17.4,len:6.2,wid:2.6,a:C,b:u,split:.25,coat:0,rank:6,bowl:.12}),b(p.p,{...d,r0:15.6,len:8.1,wid:4.9,a:B,b:u,split:.12,bowl:.24,rank:99}),b(p.l,{...d,r0:14.6,len:5.4,wid:.4,kind:h.LINER,a:N,c1:.35,lean:.1,bowl:.24,coat:2,rank:4,dur:.3}),L(p.d,{...d,phase:0,r:16.6,size:1.1,a:u,fade:0,z:2.2,rank:3}),L(p.e,{...d,r:8.4,size:1.5,a:v,fade:0,z:.4,rank:4});const y=c-n,f=i.crownKnots||[[0,0],[11,.22],[19,.62],[l-1,1]],M=w=>{let g=1;for(;g<f.length-1&&w>f[g][0];)g++;const[z,G]=f[g-1],[H,D]=f[g];return n+y*(G+(D-G)*(w-z)/(H-z))};for(let w=0;w<l;w++){const g=Math.abs(((w+.5)/l-.5)*I),z=Math.round((m-g)/(I/l)-.5),G=(z>=8?11-z:4+z)*2+(w<l/2?0:1),H=M(G);r.put({...p.g[w],t0:n-.6+G*.04}),r.put({...p.p[w],t0:H}),r.put({...p.l[w],t0:H+.22}),r.put({...p.d[w],t0:n-.3+G*.05}),r.put({...p.e[w],t0:H+.36})}const E=j(0,oe,0).addScaledVector(a,-16.5),A=F(s,[0,0,0],[1,0,0],[0,1,0]),O=pe(i,Z)+.3;A.put({...Y(0,Z-5,E.x,E.y,-.95),wid:3.6,kind:h.S,a:U,b:u,split:-.15,coat:0,rank:99,t0:O,dur:.6,seed:t()}),A.put(Q({...Y(.8,Z-4,E.x+.6,E.y-.8,-.9),wid:.45,coat:1,t0:O+.7,seed:t()}));for(const w of[1,-1])A.put({x:E.x-1,y:E.y-2,ang:1.05+w*1.25,len:11,wid:3,kind:h.TEAR,c1:-w*.9,a:C,b:u,split:w*.25,coat:1,rank:9,t0:O+1+.2*w,seed:t(),strip:"stroke"});A.put({x:E.x-1.2,y:E.y-3.4,ang:m/2,len:3.4,wid:3.4,kind:h.DOT,a:v,b:B,coat:2,rank:9,t0:O+1.4,seed:t(),dry:0});for(let w=0;w<12;w++){const g=m/2+((w+.5)/12-.5)*I,z=Math.cos(g)>=0?1:-1,G=Math.min(w,11-w),H=G%2===0,D=n+.3+G*.32+(w<6?0:.16),q=Math.cos(g),X=Math.sin(g),W=.13+G*.137;if(r.put(ee(t,{x:q*17.6,y:X*17.6,ang:g-.3*z,sgn:z,len:H?16:11.5,c1:(H?.9:1.2)*z,c2:(H?5:6.5)*z,a:G%2?N:u,wid:.42,rank:5,t0:D,seed:W})),r.put({x:q*18.2,y:X*18.2,ang:g+.75*z,len:H?5.2:4.2,wid:H?1.9:1.6,kind:h.TEAR,c1:-.7*z,a:v,b:u,split:.2*z,coat:1,rank:6,t0:D+.35,seed:W,strip:"tear"}),w===0)continue;const te=m/2+(w/12-.5)*I,k=Math.min(w,12-w),P=n+1.2+k*.4+(w<6?0:.2);for(let x=0;x<5;x++){const V=19.4+x*1.85,K=1.35-x*.17;r.put({x:Math.cos(te)*V,y:Math.sin(te)*V-K*.5,ang:m/2,len:K,wid:K,kind:h.DOT,a:k%2?u:v,coat:2,rank:3,t0:P+x*.25,dur:.12,seed:.2+x*.13,dry:0})}}return{W:a}}function Ie(s,t,i,e=60){const o=F(s,[0,0,0],[1,0,0],[0,0,-1]);for(let a=16.5,r=0;a<e-2;a+=10.2,r++){const n=Math.max(4,Math.round(I*a/21)),c=I/n*1.12;for(let l=0;l<n;l++){const p=(l+.37*r)/n*I;o.put({x:Math.cos(p)*a,y:Math.sin(p)*a,ang:p+m/2,len:a*c,wid:11.6,kind:h.S,c1:c,a:C,b:C,coat:0,z:.05,rank:99,seed:(.137+.618*(l+3*r))%1,dry:.5,anim:.2,strip:"stroke"})}}for(let a=13,r=0;a<e;a+=5.2,r++){const n=Math.round(I*a/7.4*i),c=t()*I;for(let l=0;l<n;l++){const p=c+l/n*I+t.range(-.03,.03),d=a+t.range(-.8,.8);o.put({x:Math.cos(p)*d,y:Math.sin(p)*d,ang:p+m/2-.45,len:6.4*t.range(.85,1.15),wid:2.5,kind:h.C,c1:.9,a:C,b:t()<.22?v:t()<.4?u:C,split:.3,coat:1,rank:2.2+r%3*.9,seed:t(),dry:.9,anim:.4,strip:"dot"})}if(r%3===1)for(let l=0;l<n;l+=2){const p=c+(l+.5)/n*I;o.put({x:Math.cos(p)*(a+2.6),y:Math.sin(p)*(a+2.6)-.45,ang:m/2,len:.9,wid:.9,kind:h.DOT,a:u,coat:1,rank:1.6,seed:t(),dry:0})}}}const ue=(s,t,i)=>{const e=Math.min(1,Math.max(0,(i-s)/(t-s)));return e*e*(3-2*e)},Be=s=>.65+.15*ue(.14,.2,s)+.45*ue(.3,.36,s)-.35*ue(.87,.93,s),fe=(()=>{const t=[0];for(let i=0;i<128;i++)t.push(t[i]+1/Be((i+.5)/128));return t.map(i=>i/t[128])})();function Le(s,t=xe.journey){const i=Math.min(1,Math.max(0,s))*128,e=Math.min(127,Math.floor(i));return t*(fe[e]+(fe[e+1]-fe[e])*(i-e))}function Ge(s){let t=0;for(;t<7&&s>J[t+1];)t++;const i=Math.min(t+1,7),e=Math.min(1,Math.max(0,(s-J[t])/Math.max(J[i]-J[t],1)));return ae[t]+(ae[i]-ae[t])*e}function He(){const s=[],e=2.895*m,o=36;s.push([78,14,-150],[76,16,-70]);for(let n=0;n<=o;n++){const c=n/o,l=20+315*(c*c*.12+c*.88),p=Ge(l)+12+4*(1-c),d=e*c;s.push([Math.cos(d)*p,l,Math.sin(d)*p])}const a=-53,r=18;s.pop(),s.push([a,335,r+2]);for(const n of[m*1.17,m*1.33])s.push([-35+Math.cos(n)*18,335+(349.4-335)*(n-m)/(m/2),18+Math.sin(n)*18]);for(const n of[-70,-46,-23,0,24])s.push([ie[0]*n,oe+ie[1]*n,0]);return s}async function Ue(s,t={}){const i=s.rng.fork?s.rng.fork("kurbits"):s.rng,e=Math.min(1,Math.max(.6,t.detail??s.quality?.detail??1)),o=t.style||ye(t.palette||ce,{rankStep:t.rankStep}),a={...xe,...t.schedule||{}},r=t.backdrop??Object.keys(t).length===0,n=ne[t.cast]?t.cast:"gourd",c=i.shuffle(Ee.filter(k=>k!==n)),l=[];let p=0;for(let k=0;k<8;k++)l.push(k===1||k===6?n:c[p++%c.length]);const d=t.stem==="red"?[B,u]:[U,u],y=new S.Group;y.name="kurbits";const f=Se();Ce(f,i),await s.yield(),t.green!==!1&&Ie(f,i,e,t.greenRadius??60),await s.yield(),Ae(f,i,a,d),await s.yield();const M=[],E=[];for(let k=0;k<8;k++){const P={warm:i.chance(.45),n:i.int(8,10),n2:i.int(6,8),n3:i.int(11,15),n4:i.int(10,13),leafFlip:t.leafFlip},x=l.indexOf(l[k]);x<k&&(P.warm=!E[x]),E.push(P.warm),M.push(je(f,k,l[k],i,a,P)),await s.yield()}const A=De(f,i,a);await s.yield();const O=f.bake(o);y.add(O),await s.yield();let w=null;if(r){const k=new S.Mesh(new S.CircleGeometry(1600,48),de(o,{mode:0,plank:14}));k.rotation.x=-m/2,k.position.y=-.3,y.add(k),w=new S.Group;const P=new S.Mesh(new S.CylinderGeometry(1500,1500,2600,90,1,!0),de(o,{mode:1,plank:2,side:S.BackSide}));P.position.y=500;const x=new S.Mesh(new S.CircleGeometry(1500,48),de(o,{mode:2,plank:2}));x.rotation.x=m/2,x.position.y=1790,w.add(P,x),y.add(w)}const g=j(...ie),z=j(0,oe,0),G=He().map(k=>j(...k)),H=M.flatMap((k,P)=>k.blossoms.map(x=>({c:x,n:k.normal,r:k.radius,turns:P<7}))),D=j();function q(k){let P=Math.hypot(k.x,k.z)-(k.y<24?13:5)+Math.max(0,k.y-Z);for(const K of H){if(D.copy(k).sub(K.c),K.turns){P=Math.min(P,D.length()-K.r);continue}const T=D.dot(K.n),_=Math.sqrt(Math.max(D.lengthSq()-T*T,0));P=Math.min(P,Math.hypot(T,Math.max(_-K.r,0)))}D.copy(k).sub(z);const x=D.dot(g),V=Math.sqrt(Math.max(D.lengthSq()-x*x,0));return Math.min(P,Math.hypot(x,V<7.5?7.5-V:Math.max(V-18,0)))}let X=!1;r&&t.kc&&(y.rotation.z=-m/3);const W=k=>r&&Number(t[k])||0;return{object:y,radius:W("kr")||64,height:W("kh")||428,center:j(W("kx"),W("ky")||205,W("kz")),ground:!1,groundY:0,style:o,flowers:l,tiers:M,schedule:a,triangles:O.userData.triangles,strokes:O.userData.strokes,anchors:{portalSeat:{position:z.clone(),facing:g.clone().negate(),exitDir:g.clone(),radius:7,up:A.W.clone()},lastStraight:[z.clone().addScaledVector(g,-70),z.clone()],flyThrough:G,tiers:M,stemTop:j(0,Z,0),urn:{height:22,halfWidth:13},green:{radius:t.greenRadius??60},viewpoints:{entry:j(0,4,-330),lake:j(0,5,-200),street:j(0,18,-90),urnPass:j(74,20,0),rim:j(-66,176,12),crownApproach:z.clone().addScaledVector(g,-60)},newestBlossom(k){let P=0;for(let x=0;x<8;x++)k>=M[x].petals[0]&&(P=x);return M[P].blossoms[0]}},clearance:q,setClock(k){X=!0,o.setClock(k)},setProgress(k){X=!0,o.setClock(Le(k,a.journey))},setBreeze(k){o.uniforms.uBreeze.value=k},update(k,P,x){if(o.update(k,P,x,s.renderer),X||(o.uniforms.uClock.value=P*2.4%52-4),w&&x){const V=x.matrixWorld.elements;w.position.set(V[12]-y.position.x,0,V[14]-y.position.z)}},dispose(){}}}export{Ne as BOARD_FRAG,Pe as BOARD_VERT,he as COAT_GAP,we as DOME,Ee as FLOWER_NAMES,h as KIND,Ve as PAINT,le as POT,ce as POTS,xe as SCHEDULE,me as STROKE_FRAG,ke as STROKE_VERT,qe as STYLE_GLSL,ae as TIER_REACH,J as TIER_Y,de as boardMaterial,Ue as buildHero,Le as journeyClock,Be as journeyPace,Se as makeStrokeBook,ye as makeStyle,F as sheet,pe as stemTime,ge as strokeMaterial,R as strokePoint};
