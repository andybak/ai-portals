import*as r from"three";import{clamp as y,smoothstep as ne,makeRng as Ne}from"../kit/core.js";import{GLSL_HASH as se}from"../kit/fx.js";const re=["#050506","#E2B13C","#B8B85E","#DCE0E3","#3FD9A0","#7B5CE0","#D8442B"],Se="#8A4B12",_e="#1B2226",D=Math.PI*2,o=(n,t,a)=>new r.Vector3(n,t,a),g=20,ce=2.5,he=36,H=11.2,fe=3.4,M=10,ue=.42,ve=.58;function de(n=re,t=0){const a=(d,m=1)=>{const R=new r.Color(d);return`vec3(${(R.r*m).toFixed(4)},${(R.g*m).toFixed(4)},${(R.b*m).toFixed(4)})`},f=n,b=t===1?.35:0,x=t===2?"vec2(0.52,0.86)":"vec2(0.25,0.70)",p=t===2?.92:1,v=t===2?1.5:t===1?.95:.75;return se+`
#ifndef LACQUER_GLSL
#define LACQUER_GLSL
const vec3 LQ_GROUND = ${a(f[0])};
const vec3 LQ_GOLD = ${a(f[1])};
const vec3 LQ_GREENGOLD = ${a(f[2])};
const vec3 LQ_SILVER = ${a(f[3])};
const vec3 LQ_SHELL_A = ${a(f[4])};
const vec3 LQ_SHELL_B = ${a(f[5])};
const vec3 LQ_VERMILION = ${a(f[6])};
const vec3 LQ_AMBER = ${a(Se)};
const vec3 LQ_SMOKE = ${a(_e)};
const float LQ_PEARL = ${b.toFixed(2)};
const vec2 LQ_GATE = ${x};
const float LQ_GAIN = ${p.toFixed(2)};
const float LQ_FAR = ${v.toFixed(2)};
vec3 lqDepth(vec3 col, float d){ float k = exp(-d / 90.0); return mix(col * vec3(1.0, 0.55, 0.22), col, k) * (0.1 + 0.9 * k); }
// the shell's own depth law (the brief: shell sinks to smoke, HUE KEPT): it dims, and warms only a little
vec3 lqDepthShell(vec3 col, float d){ float k = exp(-d / 90.0); return mix(col * vec3(0.92, 0.8, 0.68), col, k) * (0.2 + 0.8 * k); }
vec3 lqRamp(float t){
  vec3 ga = mix(LQ_SHELL_A, LQ_SILVER * vec3(0.86, 1.0, 0.92), LQ_PEARL);
  vec3 vi = mix(LQ_SHELL_B, LQ_SILVER * vec3(0.93, 0.86, 1.0), LQ_PEARL);
  vec3 teal = mix(ga, vi, 0.42) * 1.08;
  vec3 col = mix(ga, teal, smoothstep(0.08, 0.36, t));
  col = mix(col, vi, smoothstep(0.38, 0.68, t));
  col = mix(col, LQ_SILVER * 0.72, smoothstep(0.92, 1.14, t));
  return col;
}
// N: face normal (any sign), V: unit vector to the eye, L: unit vector to the moon, phase 0..1 per chip
vec3 lqShell(vec3 N, vec3 V, vec3 L, float phase, out float lit){
  float nv = abs(dot(N, V));
  float t = 1.25 * (1.0 - nv) + 0.12 * (phase - 0.5);
  vec3 hv = L + V; hv = hv / max(length(hv), 1e-3);
  lit = smoothstep(LQ_GATE.x - 0.05, LQ_GATE.y - 0.08, abs(dot(N, hv)));
  vec3 film = lqRamp(t) * LQ_GAIN;
  return mix(LQ_SMOKE * 0.5 + film * film * 0.34, film * 0.95, lit);
}
vec3 lqGold(vec3 Nv, vec3 Vv, vec3 objPos, float pxSize){
  vec3 Lk = normalize(vec3(-0.55, 0.65, 0.52));
  float w = dot(Nv, Lk) * 0.6 + 0.4;
  vec3 col = mix(LQ_AMBER * 0.5, LQ_GOLD * 0.95, smoothstep(0.0, 0.9, w));
  vec3 hv = Lk + Vv; hv = hv / max(length(hv), 1e-3);
  float ndh = max(dot(Nv, hv), 0.0);
  float h = hash13(floor(objPos / 0.015) + 0.5);
  float thr = 0.72 + 0.27 * h;
  float glint = smoothstep(thr, thr + 0.012, ndh) * (1.0 - smoothstep(thr + 0.035, thr + 0.07, ndh));
  float fine = clamp(0.03 / max(pxSize, 1e-4), 0.0, 1.0);
  col += LQ_GOLD * (0.55 * glint * fine + 0.12 * (1.0 - fine) * smoothstep(0.7, 1.0, ndh));
  float rim = smoothstep(0.62, 0.93, 1.0 - abs(dot(Nv, Vv)));
  col = mix(col, LQ_GREENGOLD * 1.25, rim * 0.85);
  return min(col, vec3(1.4));
}
vec3 lqSilver(vec2 uv, float lit){
  vec2 g = floor(uv); float h = hash12(g + 3.1), h2 = hash12(floor(uv * 3.0) + 9.7);
  return LQ_SILVER * (0.55 + 0.35 * h + 0.18 * h2) * lit;
}
float lqHair(float coord, float widthPx){
  float fw = max(fwidth(coord), 1e-5);
  float d = abs(fract(coord) - 0.5) / fw;
  return (1.0 - smoothstep(widthPx * 0.5, widthPx * 0.5 + 1.0, d)) * clamp((0.66 / fw - 1.5) * 0.5, 0.0, 1.0);
}
#endif
`}function ke(n="gold",t={}){const a={gold:0,vermilion:1,silver:2,shell:3}[n]??0;return new r.ShaderMaterial({side:t.side??r.DoubleSide,fog:!1,transparent:!!t.transparent,uniforms:{uMoon:{value:t.moon||me.clone()},uGain:{value:t.gain??1}},vertexShader:`
      varying vec3 vNv, vPv, vOp, vNw, vPw; varying vec2 vUv;
      void main(){
        vOp = position; vUv = uv;
        vec4 wp = modelMatrix * vec4(position, 1.0); vPw = wp.xyz;
        vec4 mv = viewMatrix * wp; vPv = mv.xyz;
        vNv = normalize(normalMatrix * normal); vNw = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:de(t.palette,t.shell|0)+`
      uniform vec3 uMoon; uniform float uGain;
      varying vec3 vNv, vPv, vOp, vNw, vPw; varying vec2 vUv;
      float lqLines(vec2 uv, vec3 op){ ${t.lines||"return 0.0;"} }
      void main(){
        vec3 Nv = normalize(vNv); if (!gl_FrontFacing) Nv = -Nv;
        float dist = length(vPv); vec3 Vv = -vPv / max(dist, 1e-3);
        float px = length(fwidth(vOp)) * 0.7;
        vec3 col;
        #if ${a} == 0
          col = lqGold(Nv, Vv, vOp, px);
        #elif ${a} == 1
          float ray = lqHair(vUv.x * 14.0, 1.2);
          col = mix(LQ_VERMILION * 0.9, LQ_GOLD * 1.1, ray * 0.85);
        #elif ${a} == 2
          col = lqSilver(vUv * 40.0, 1.0);
        #else
          float lit; col = lqShell(normalize(vNw), normalize(cameraPosition - vPw), uMoon, hash12(floor(vUv * 31.0)), lit);
        #endif
        col *= 1.0 - 0.92 * lqLines(vUv, vOp);
        gl_FragColor = vec4(lqDepth(col * uGain, dist), 1.0);
      }`})}const me=o(Math.sin(.2094)*.7314,.682,-Math.cos(.2094)*.7314).normalize(),pe=`
#define R_BALL ${g.toFixed(1)}
#define SKIN ${ce.toFixed(1)}
#define FUN_H ${he.toFixed(1)}
#define RING_R ${H.toFixed(1)}
#define RING_T ${fe.toFixed(1)}
#define RIV_N ${M}
#define RIV_SPREAD ${ue.toFixed(2)}
#define RIV_DUR ${ve.toFixed(2)}
uniform float uTime, uSpin, uSpinF, uFunnel, uRiver, uEat, uBreath, uChase, uRingIn, uFray, uLoose, uGhost, uHeart;
uniform vec3 uC, uRingC, uRingX, uRingY, uRingN, uBelt;
uniform vec3 uRivP[RIV_N];
uniform vec4 uRoll, uMouth;
uniform vec2 uDirs;   // which way the ball wheels (x) and the ring swims (y): +1 or -1
uniform vec4 uKeepA[4];
uniform vec3 uKeepB[4];
float funR(float h){ return 2.5 + 9.5 * pow(max(h, 0.0), 1.7); }
float funDR(float h){ return 9.5 * 1.7 * pow(max(h, 1e-4), 0.7) / FUN_H; }
float spinK(float b){ return pow(12.0 / funR(b), 0.6); }
float beltDir(float b){ return 1.0 - 2.0 * step(abs(b - uBelt.x), uBelt.y); }
// the ball is not a perfect sphere: three slow lobes (under 5% of the radius) carried round with the mean turn, none at the poles
float lobe(float a, float b){
  float sl = 2.0 * b - 1.0, cl = sqrt(max(1.0 - sl * sl, 0.0)), q = a - uSpin;
  return 0.034 * cl * (0.6 * sin(2.0 * q + 1.3 + 1.6 * sin(b * 5.0)) + 0.45 * sin(3.0 * q - b * 7.0 + 0.7) + 0.35 * sin(5.0 * q + b * 9.0 + 2.1));
}
float funnelMix(float b){ float t = clamp(uFunnel * 1.5 - b * 0.5, 0.0, 1.0); return t * t * (3.0 - 2.0 * t); }
// raden: the shoal is laid in facets a few metres across, each sharing one tilt, like pieces of shell inlay
float patchRoll(float a, float b){
  vec2 p = vec2(fract(a / 6.2832) * 34.0, b * 12.0), ip = floor(p), fp = p - ip;
  float best = 9.0, id = 0.5;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y)), c = ip + g; c.x = mod(c.x, 34.0);
    vec2 o = g + hash22(c + 7.3) - fp; float dd = dot(o, o);
    if (dd < best) { best = dd; id = hash12(c + 3.7); }
  }
  return id - 0.5;
}
float rollField(float a, float b){
  return 0.52 * sin(uRoll.x * a + uRoll.y * b * 6.2832 + 0.13 * uTime)
       + 0.30 * sin(uRoll.z * a - uRoll.w * b * 6.2832 - 0.21 * uTime + 1.7)
       + 0.30 * patchRoll(a, b);
}
// a startle that runs round the shoal as a narrow band (ambient, eased: never a flash)
float flinch(float a, float b){
  float w = sin(a - uTime * uBelt.z + 1.3 * sin(b * 5.0 + uTime * 0.31));
  w = max(w, 0.0); w *= w; w *= w; return w * w;
}
// the funnel: three helical lobes climbing it and a swaying axis, so it is a living vortex and not a cone
vec3 funPos(float a, float h, float r){
  r *= 1.0 + 0.11 * sin(3.0 * a - 9.0 * h + uTime * 1.3) * smoothstep(0.08, 0.6, h);
  vec2 sway = vec2(sin(h * 2.6 + uTime * 0.9), cos(h * 2.1 - uTime * 0.7)) * 1.5 * h * h;
  return vec3(uC.x + r * cos(a) + sway.x, uC.y - R_BALL + FUN_H * h, uC.z + r * sin(a) + sway.y);
}
float eatFront(){ return uEat * 0.56 - 0.04; }
// a survivor's place in the queue for the river, 0..1 (the top of the funnel goes first)
float rivDel(float b, float h){ return mix(1.0 - (b - 0.5) * 2.0, h, 0.45); }
float capDist(vec3 p, vec4 A, vec3 Bp, out vec3 v){
  vec3 ab = Bp - A.xyz; float t = clamp(dot(p - A.xyz, ab) / max(dot(ab, ab), 1e-4), 0.0, 1.0);
  v = p - (A.xyz + ab * t); return length(v);
}
vec3 keepOne(vec3 p, vec4 A, vec3 Bp){
  vec3 v; float dl = capDist(p, A, Bp, v);
  return v / max(dl, 1e-3) * max(A.w - dl, 0.0) * 0.9;
}
vec3 keepPush(vec3 p){
  return keepOne(p, uKeepA[0], uKeepB[0]) + keepOne(p, uKeepA[1], uKeepB[1]) + keepOne(p, uKeepA[2], uKeepB[2]) + keepOne(p, uKeepA[3], uKeepB[3]);
}
// signed clearance from the nearest keep-out (negative inside), for the core's discard
float keepGap(vec3 p){
  vec3 v;
  float g = capDist(p, uKeepA[0], uKeepB[0], v) - uKeepA[0].w;
  g = min(g, capDist(p, uKeepA[1], uKeepB[1], v) - uKeepA[1].w);
  g = min(g, capDist(p, uKeepA[2], uKeepB[2], v) - uKeepA[2].w);
  g = min(g, capDist(p, uKeepA[3], uKeepB[3], v) - uKeepA[3].w);
  return g;
}
`,h={t1:[.22,.12],t2:[.56,.115],ped:[.83,0],tail:[1,.13],notch:[.92,0]},L=n=>`vec2(${n[0].toFixed(3)},${n[1].toFixed(3)})`,Me=`
float sdl(vec2 p, vec2 a, vec2 b){ vec2 e = b - a; return -(e.x * (p.y - a.y) - e.y * (p.x - a.x)) / length(e); }
// distance (body units) from the cut edge of the chip, inside positive; q = (x, |y|)
float chipEdge(vec2 q){
  float body = min(min(sdl(q, vec2(0.0), ${L(h.t1)}), sdl(q, ${L(h.t1)}, ${L(h.t2)})), sdl(q, ${L(h.t2)}, ${L(h.ped)}));
  float tail = min(sdl(q, ${L(h.ped)}, ${L(h.tail)}), sdl(q, ${L(h.tail)}, ${L(h.notch)}));
  return q.x < ${h.ped[0].toFixed(3)} ? body : tail;
}
`,Ee=`
attribute vec4 aSlot;
uniform float uLen;
varying vec2 vUv; varying vec3 vN, vT, vW; varying vec4 vS;
// the river's shared course: a Catmull-Rom through uRivP, t 0..1 (equal time per span, so close knots mean a slow reach)
vec3 rivAt(float t, out vec3 tn){
  float x = clamp(t, 0.0, 1.0) * float(RIV_N - 1), i = min(floor(x), float(RIV_N - 2)), f = x - i; int k = int(i);
  vec3 p0 = uRivP[max(k - 1, 0)], p1 = uRivP[k], p2 = uRivP[k + 1], p3 = uRivP[min(k + 2, RIV_N - 1)];
  vec3 m1 = 0.5 * (p2 - p0), m2 = 0.5 * (p3 - p1); float f2 = f * f, f3 = f2 * f;
  tn = (6.0 * f2 - 6.0 * f) * (p1 - p2) + (3.0 * f2 - 4.0 * f + 1.0) * m1 + (3.0 * f2 - 2.0 * f) * m2;
  return (2.0 * f3 - 3.0 * f2 + 1.0) * p1 + (f3 - 2.0 * f2 + f) * m1 + (3.0 * f2 - 2.0 * f3) * p2 + (f3 - f2) * m2;
}
void main(){
  float a0 = aSlot.x, b = aSlot.y, d = aSlot.z, sd = aSlot.w;
  float h1 = hash11(sd * 91.7 + 0.3), h2 = hash11(sd * 37.3 + 5.1), h3 = hash11(sd * 13.9 + 9.2), h4 = hash11(sd * 57.1 + 2.7);
  float dir = beltDir(b), sp = 0.9 + 0.2 * h1;
  float a = a0 + uSpin * dir * sp + uSpinF * spinK(b) * sp;
  float fm = funnelMix(b);
  float fl = flinch(a, b) * (1.0 - 0.6 * fm);
  float ca = cos(a), sa = sin(a);
  // ball: chips pave the orb, flank outward
  float sl = clamp(2.0 * b - 1.0, -1.0, 1.0), cl = sqrt(max(1.0 - sl * sl, 0.0));
  vec3 nB = vec3(cl * ca, sl, cl * sa);
  float bob = 0.09 * sin(uTime * (0.5 + 0.5 * h2) + sd * 50.0);
  float hk = mix(1.0, 0.12 + 0.88 * h3, uHeart);            // uHeart (a far shoal): the chips fill the shape, densest at its heart (1 for the hero itself: a skin)
  vec3 pB = uC + ((R_BALL - d * SKIN) * uBreath * (1.0 + lobe(a, b)) * hk - fl * 0.9 + bob + uLoose * (0.6 + 6.5 * h4 * h4)) * nB;   // uLoose: a far shoal's stray halo
  vec3 tB = vec3(-sa, 0.0, ca) * (dir * uDirs.x);
  // funnel: throat down, a helix
  vec3 pF = funPos(a, b, (funR(b) + 0.15 + (1.0 - d) * 1.7) * hk + bob + uLoose * (0.4 + 4.5 * h4 * h4));
  vec3 nF = normalize(vec3(ca, -funDR(b), sa));
  vec3 tF = normalize(vec3(-sa * uDirs.x, 0.28, ca * uDirs.x));
  vec3 P = mix(pB, pF, fm), Nr = mix(nB, nF, fm), T = mix(tB, tF, fm) + vec3(0.0, 0.02, 0.0);
  vec3 Nr0 = Nr;                                           // the shape's own surface normal (for the limb, below)
  // ring, and the river that carries the survivors to it: a shared course (rivAt) that every chip rides in its own
  // lane, a rope where it pours from the funnel, a broad band where it runs beside the lens, a flat ribbon up to the ring.
  // Two in five are heralds that go early and fast, so the ring is winding while the band is still passing.
  float surv = step(0.5, b);
  float th = a0 + uChase * (0.75 + 0.5 * h1);
  float be = h2 * 6.2832 + uTime * 0.22 * (h3 - 0.5);
  float ct = cos(th), st = sin(th);
  vec3 er = uRingX * ct + uRingY * st, et = uRingY * ct - uRingX * st;
  vec3 nT = er * cos(be) + uRingN * sin(be);
  vec3 pT = uRingC + er * RING_R + nT * (RING_T - d * 1.1);
  float herald = step(h4, 0.4);
  float q = clamp((uRiver - rivDel(b, h3) * mix(RIV_SPREAD, 0.3, herald)) / mix(RIV_DUR, 0.3, herald), 0.0, 1.0) * surv;
  vec3 rT; vec3 rP = rivAt(q, rT); rT = rT / max(length(rT), 1e-3);
  vec3 rS = cross(rT, vec3(0.0, 1.0, 0.0)); rS = rS / max(length(rS), 1e-3); vec3 rU = cross(rS, rT);
  float band = smoothstep(0.1, 0.24, q) * (1.0 - smoothstep(0.76, 0.9, q));   // (a broad band until it nears the ring: it streams up into it as a ribbon)
  // (the last climb to the ring is a flat ribbon 7 m wide, not a cord: it reads as a stream of fish from far below)
  vec2 lane = mix(mix(vec2(2.4, 2.4), vec2(7.0, 1.8), smoothstep(0.6, 0.8, q)), vec2(5.6, 4.2), band) * vec2(h1 - 0.5, h2 - 0.5);
  lane += 0.3 * vec2(sin(uTime * (0.7 + h3) + sd * 40.0), cos(uTime * (0.6 + h1) + sd * 70.0));
  rP += rS * lane.x + rU * lane.y;
  float wIn = smoothstep(0.0, 0.13, q), wOut = smoothstep(0.87, 1.0, q), qe = wOut;
  P = mix(mix(P, rP, wIn), pT, wOut);
  T = mix(mix(T, rT + rS * ((h3 - 0.5) * 0.55 * band), wIn), et * uDirs.y, wOut);   // headings wander a little in the band, so its colours break up
  Nr = mix(mix(Nr, rS + rU * (h2 - 0.5), wIn), nT, wOut);
  // frame: heading T, flank normal N (rolled), dorsal B
  T = T / max(length(T), 1e-3);
  vec3 N = Nr - T * dot(Nr, T); N = N / max(length(N), 1e-3);
  vec3 B = cross(N, T);
  float roll = rollField(a0, mix(b, h2, qe)) * (1.0 - 0.55 * wIn * (1.0 - wOut)) + (h2 - 0.5) * 0.22 + fl * 1.2 + qe * 0.75 * sin(th - uTime * 1.5708);
  roll *= mix(dir, 1.0, wIn);                              // the belt swims the other way but keeps the same law
  float cr = cos(roll), sr = sin(roll);
  N = N * cr + B * sr; B = cross(N, T);
  // eaten, or inside the whale's mouth: gone
  vec3 Pw = (modelMatrix * vec4(P, 1.0)).xyz;
  float fe = eatFront();
  float alive = mix(smoothstep(fe - 0.03, fe, b + 0.05 * (h1 - 0.5)) * (1.0 - smoothstep(0.0, 0.06, uRiver)), 1.0, surv);
  float mr = max(uMouth.w, 1e-3);
  alive *= smoothstep(mr * 0.9, mr, distance(Pw, uMouth.xyz));
  // the leaf, with swim bend
  float x = position.x, y = position.y;
  float far = distance(Pw, cameraPosition);
  float L = uLen * (0.84 + 0.34 * h3) * alive * (1.0 + clamp(far - 20.0, 0.0, 80.0) / 70.0 + wIn * (1.0 - wOut) * clamp(far - 35.0, 0.0, 100.0) / 24.0) * (1.0 + 0.3 * band + 0.7 * wOut + 1.6 * step(0.001, uLoose));   // (the river's fish are drawn larger still from over 35 m: its far reach is a ribbon of fish, not dust)
  // THE LIMB: seen edge-on the skin stacks its chips into a bright drawn line round the ball and down the funnel's
  // sides. From 8 m out most of the chips there shrink away (eased, by their own hash), so the edge is stray chips.
  float limbK = abs(dot(normalize(mat3(modelMatrix) * Nr0), (cameraPosition - Pw) / max(far, 1e-3)));
  float thin = 0.92 * smoothstep(8.0, 20.0, far) * (1.0 - smoothstep(0.12, 0.55, limbK)) * (1.0 - wIn) * (1.0 - step(0.001, uLoose));
  L *= smoothstep(thin - 0.07, thin, hash11(sd * 23.3 + 4.4) + 1e-3);
  float ph = sd * 311.0 + uTime * (6.0 + 3.0 * h1);
  float wig = sin(ph - x * 3.3);
  vec3 lp = P + (T * (0.5 - x) + B * y) * L + N * (0.13 * x * x * wig * L);
  vec3 wp = (modelMatrix * vec4(lp, 1.0)).xyz + keepPush(Pw);
  vUv = vec2(x, y); vS = vec4(h1, L, sd, h2);
  vN = mat3(modelMatrix) * normalize(N + T * (0.3 * x * wig));
  vT = mat3(modelMatrix) * T; vW = wp;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
}`,Te=`
uniform vec3 uMoon; uniform float uGain;
varying vec2 vUv; varying vec3 vN, vT, vW; varying vec4 vS;
void main(){
  float L = max(vS.y, 1e-3);
  vec2 pm = vUv * L;                                                       // metres on the chip
  float fw = max(length(vec2(fwidth(pm.x), fwidth(pm.y))) * 0.7, 1e-5);    // metres per pixel
  float e = chipEdge(vec2(vUv.x, abs(vUv.y))) * L;
  vec3 N = normalize(vN), T = normalize(vT);
  vec3 toEye = cameraPosition - vW; float dist = length(toEye); vec3 V = toEye / max(dist, 1e-3);
  // growth lines: rings about the nose, 9 cm apart
  float gfade = clamp((0.09 / fw - 3.0) / 3.0, 0.0, 1.0);
  N = normalize(N + T * (sin(70.0 * length(pm)) * 0.12 * gfade));
  float lit; vec3 col = lqShell(N, V, uMoon, vS.x, lit);
  // the cut bevel: a facet turned toward the edge, so it takes another colour of the film
  vec3 Bv = cross(N, T);
  vec3 Nb = normalize(N + Bv * (vUv.y < 0.0 ? -0.6 : 0.6) + T * 0.25);
  float litb; vec3 cb = lqShell(Nb, V, uMoon, vS.x + 0.25, litb) * 1.4 + LQ_SILVER * 0.035;
  float bw = max(0.011, 1.3 * fw);
  float bev = (1.0 - smoothstep(bw * 0.6, bw, e)) * clamp((0.035 / fw - 1.3) * 0.5, 0.0, 1.0);
  col = mix(col, cb, bev);
  // black lateral hairline
  float hw = max(0.0035, 0.7 * fw);
  float hair = (1.0 - smoothstep(hw * 0.5, hw, abs(pm.y))) * step(0.2, vUv.x) * step(vUv.x, 0.8) * clamp(0.012 / fw - 0.6, 0.0, 1.0);
  col *= 1.0 - 0.9 * hair;
  // gold pin eye in a black ring
  float er = 0.045 * L, de = length(pm - vec2(0.115, 0.024) * L);
  float efade = clamp(er / fw - 0.4, 0.0, 1.0);
  col *= 1.0 - 0.8 * efade * (1.0 - smoothstep(er * 1.25, er * 1.7 + fw, de));
  col = mix(col, LQ_GOLD * (0.45 + 0.85 * lit), efade * (1.0 - smoothstep(er - fw, er + fw * 0.5, de)));
  col *= 1.0 - 0.4 * smoothstep(25.0, 65.0, dist);        // far chips sink toward the mosaic under them
  col *= 1.0 + LQ_FAR * smoothstep(30.0, 72.0, dist);
  // seen from far off (the dive) three chips in ten that catch the moon flash silver over their own colour: sparkle on
  // the ball, each a single fish (by the film law: it comes and goes as the chip turns, never on a timer)
  col += (LQ_SILVER * 0.5 + col * 0.6) * (lit * step(0.7, vS.x) * smoothstep(40.0, 85.0, dist) * (1.0 - step(0.001, uLoose)));
  // the ball from a distance: most of the chips that stand edge-on at the limb go out (edge-on they would stack into a
  // thin silver ring), so its outline is stray silver chips
  col *= mix(1.0, mix(0.1, 1.0, smoothstep(0.05, 0.42, abs(dot(N, V)))), smoothstep(14.0, 30.0, dist) * step(vS.w, 0.88) * (1.0 - uFunnel) * (1.0 - step(0.001, uLoose)));
  col = mix(col, mix(LQ_AMBER * 2.6, LQ_GOLD * 1.5, 0.5 + 0.4 * lit * step(0.8, vS.x)) * dot(col, vec3(0.3, 0.5, 0.2)), step(0.001, uLoose) * max(uGhost, step(0.9, vS.x)));   // a far shoal is an amber-gold ghost with a few gold glints (uGhost 0.95: no green or pink survives; a low uGhost keeps the shell's own colour and one chip in ten is a gold spark)
  col *= 1.0 + 2.4 * step(0.001, uLoose) * step(0.93, vS.x);   // a far shoal's few bright sparks
  gl_FragColor = vec4(mix(lqDepthShell(col * uGain, dist), lqDepth(col * uGain, dist), step(0.001, uLoose) * min(1.0, uGhost / 0.95)), 1.0);
}`,we=`
#define RC (R_BALL - SKIN)
#define CORE_T 2.35
#define ROWH 0.105
#define CELL 0.40
#define ROWH2 0.62
#define CELL2 1.9
#ifdef MID
#define LAYER 1.25
#else
#define LAYER 0.0
#endif
uniform vec2 uMirror;
`,O=`
varying vec3 vN, vT, vW; varying vec2 vP;
void main(){
  float a = position.x, b = position.y;
  float ca = cos(a), sa = sin(a);
#ifdef RING
  float be = b * 6.2832;
  vec3 er = uRingX * ca + uRingY * sa, t = uRingY * ca - uRingX * sa;
  vec3 n = er * cos(be) + uRingN * sin(be);
  vec3 lp = uRingC + er * RING_R + n * CORE_T;
#else
  float fm = funnelMix(b);
  float sl = clamp(2.0 * b - 1.0, -1.0, 1.0), cl = sqrt(max(1.0 - sl * sl, 0.0));
  vec3 nB = vec3(cl * ca, sl, cl * sa);
  vec3 pB = uC + (RC + LAYER) * uBreath * (1.0 + lobe(a, b)) * nB;
  vec3 pF = funPos(a, b, funR(b) + LAYER * 0.7);
  vec3 nF = normalize(vec3(ca, -funDR(b), sa));
  vec3 lp = mix(pB, pF, fm);
  vec3 n = mix(nB, nF, fm); n = n / max(length(n), 1e-3);
  vec3 t = vec3(-sa, 0.0, ca);
#endif
  vec4 wp = modelMatrix * vec4(lp, 1.0);
  vec3 nw = mat3(modelMatrix) * n, tw = mat3(modelMatrix) * t;
  wp.y = mix(wp.y, 2.0 * uMirror.x - wp.y, uMirror.y);
  nw.y *= 1.0 - 2.0 * uMirror.y; tw.y *= 1.0 - 2.0 * uMirror.y;
  vN = nw; vT = tw; vW = wp.xyz; vP = vec2(a, b);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,V=`
uniform vec3 uMoon; uniform float uGain;
varying vec3 vN, vT, vW; varying vec2 vP;
void main(){
  float a = vP.x, b = vP.y;
  float da = fwidth(a), db = fwidth(b);
#ifdef RING
  float arc = b * 6.2832 * CORE_T, darc = db * 6.2832 * CORE_T;
#else
  float sl = clamp(2.0 * b - 1.0, -0.9999, 0.9999);
  float arc = RC * asin(sl), darc = db * RC * 2.0 / sqrt(max(1.0 - sl * sl, 1e-3));
#endif
  float row = arc / ROWH, j = floor(row), fy = row - j;
  float hj = hash11(j * 1.37 + 11.0);
#ifdef RING
  float bj = (j + 0.5) * ROWH / (6.2832 * CORE_T);
  float rho = RING_R + CORE_T * cos(bj * 6.2832);
  float dirj = 1.0, turn = uChase, head = uDirs.y;
#else
  float latj = (j + 0.5) * ROWH / RC;
  float rho = max(RC * cos(latj), 0.2);
  float bj = 0.5 + 0.5 * sin(latj);
  float dirj = beltDir(bj), head = dirj * uDirs.x;
  float turn = uSpin * dirj + uSpinF * spinK(bj);
#endif
#ifdef MID
  turn = turn * 1.05 + 1.7; hj = fract(hj + 0.37);          // the middle layer slides over the inner one
#endif
  float n = max(6.0, floor(6.2832 * rho / (CELL * (0.95 + 0.45 * hash11(j * 3.71 + 2.0)))));   // every row cut to its own cell length (0.38 to 0.56 m)
  float aRel = a - turn;                                  // the angle in the turning frame (the chips' own a0)
  float cx = fract(aRel / 6.2832 + hj) * n, i = floor(cx), fx = cx - i;
  float hc = hash12(vec2(i, j) + 0.5), hc2 = hash12(vec2(i + 17.0, j - 5.0) + 0.5);
  float fwm = max(max(da * rho, darc), 1e-5);             // metres per pixel
  // THE HAND-OVER, in two stages so the two courses never smear into a grey band: lodA (a chip is 7 px high down to 3)
  // the chips take the colour of the leaf they lie in and its grout cuts through them; lodB (3 px down to 1.3) the
  // leaf fills in. A chip is always part of one leaf, so there is one pavement at every distance.
  float lodA = clamp((fwm / ROWH - 0.14) / 0.2, 0.0, 1.0), lod = clamp((fwm / ROWH - 0.3) / 0.45, 0.0, 1.0);
  // --- the second, coarser course: leaf-cut tesserae of CELL2 x ROWH2 in smoke grout. It carries the shoal from the distance
  // where single chips go under a pixel out to where the tesserae do too (only then the flat mean)
  // hand-laid: the courses come in bands of three whose two cuts are hashed (each course 0.26 to 1.1 m high), every
  // course undulates a little round the shoal, and each is cut to its own length (1.1 to 2.9 m)
  float arc2 = arc + 0.2 * ROWH2 * sin(aRel * 5.0 + 1.7 * sin(aRel * 2.0 + arc * 0.11));
  float bnd = floor(arc2 / (3.0 * ROWH2)), fb = arc2 / ROWH2 - bnd * 3.0;
  float s1 = 0.62 + 0.76 * hash11(bnd * 3.17 + 1.3), s2 = s1 + 0.6 + 0.6 * hash11(bnd * 5.71 + 8.9);
  float k2 = step(s1, fb) + step(s2, fb);
  float r0 = k2 < 0.5 ? 0.0 : (k2 < 1.5 ? s1 : s2), r1 = k2 < 0.5 ? s1 : (k2 < 1.5 ? s2 : 3.0);
  float rowH2 = (r1 - r0) * ROWH2, j2 = bnd * 3.0 + k2, fy2 = (fb - r0) / max(r1 - r0, 1e-3), hj2 = hash11(j2 * 2.13 + 5.0);
  float mid2 = (bnd * 3.0 + 0.5 * (r0 + r1)) * ROWH2;
#ifdef RING
  float rho2 = RING_R + CORE_T * cos(mid2 / CORE_T), bj2 = 0.5, turn2 = uChase;
#else
  float lat2 = clamp(mid2 / RC, -1.55, 1.55);
  float rho2 = max(RC * cos(lat2), 0.4), bj2 = 0.5 + 0.5 * sin(lat2);
  float turn2 = uSpin * beltDir(bj2) + uSpinF * spinK(bj2);
#endif
  // on the funnel the leaves are cut 2.2 times longer, so they stream round its helix; a course re-cuts once, as the
  // shape's front passes it, and melts into its own mean for that moment (no popping)
#ifdef RING
  float longK = 1.0, melt = 0.0;
#else
  float fm2 = funnelMix(bj2), longK = 1.0 + 1.2 * step(0.5, fm2), melt = 1.0 - smoothstep(0.0, 0.3, abs(fm2 - 0.5));
#endif
  float n2 = max(4.0, floor(6.2832 * rho2 / (CELL2 * (0.6 + 0.9 * hj2) * longK)));   // each course cut to its own length
  float cx2 = fract((a - turn2) / 6.2832 + hj2) * n2, i2 = floor(cx2), fx2 = cx2 - i2;
  float hd = hash12(vec2(i2, j2) + 7.5), hd2 = hash12(vec2(i2 - 9.0, j2 + 3.0) + 1.5);
  float aCell2 = ((i2 + 0.5) / n2 - hj2) * 6.2832;
  float lod2 = max(clamp((fwm / ROWH2 - 0.55) * 1.6, 0.0, 1.0), melt);
  float hf = hash12(floor(vec2(i2, j2) / vec2(2.0, 5.0)) + 3.3);   // patches of a few tesserae (ragged fronts, fraying)
  float hl = mix(hf, hd, 0.4);                             // ragged by patch and by piece (the limb)
  // --- who has left: the whale's half, then the river (ball core) / who has arrived (ring core)
#ifdef RING
  float wind = abs(fract((a + 1.5708) / 6.2832 + 0.5) - 0.5) * 2.0;         // 0 at the foot of the ring, 1 at its crown
  if (uRingIn * 1.45 < wind + 0.45 * hf) discard;                           // it winds from underneath, both ways round
#else
  if (bj + (hc - 0.5) * 0.03 + 0.07 * (hf - 0.5) + 0.02 * sin(aRel * 9.0) < eatFront()) discard;   // a ragged bite
  if (bj > 1.0 - 0.07 * uFunnel * (0.4 + hc)) discard;      // the flare's lip frays
  if (uRiver > rivDel(bj, hc) * RIV_SPREAD + 0.012) discard;
  // a far shoal frays toward its limb, so its silhouette is never a clean disc
  if (uFray > 0.0 && mix(hf, hd, 0.35) < uFray * (0.16 + 0.84 * smoothstep(0.25, 0.9, 1.0 - abs(dot(normalize(vN), normalize(cameraPosition - vW)))))) discard;
#endif
  float gap = keepGap(vW);
  if (gap < 0.0) discard;
  // the limb frays into stray pieces: no continuous outline (the middle layer always, the inner shell from 6 m out)
  vec3 te = cameraPosition - vW; float tel = length(te), ndv = abs(dot(normalize(vN), te / max(tel, 1e-3)));
#ifdef MID
  if (hc2 < 0.42 + 0.7 * lod) discard;                     // a loose layer: about half its cells, thinning with distance
  if (ndv < 0.1 + 0.26 * hc + (0.16 + 0.3 * hl) * uFunnel) discard;   // on the funnel its limb goes out as widely as the inner shell's: no solid edge bands down the sides
#else
  // (on the funnel every cell also has its own cut-off, so the limb is stray pieces all the way down: never a solid band)
  float lcut = 0.04 + 0.42 * hl;
#ifndef RING
  lcut += uFunnel * (0.1 + 0.3 * hc);
#endif
  if (uFray <= 0.0 && ndv < lcut * smoothstep(6.0, 16.0, tel)) discard;
#endif
  // --- the chip in this cell
  float Lc = 0.36 * (0.8 + 0.2 * hc2), cellLen = 6.2832 * rho / n;
  float xf = head > 0.0 ? 1.0 - fx : fx;
  // each chip has its own seat in its cell and its own slant, and one in five is missing: hand-laid, not a screen
  vec2 uvb = vec2(0.5 + ((xf - 0.5) * cellLen + (hc - 0.5) * 0.8 * max(cellLen - Lc, 0.0)) / Lc, (fy - 0.5) * ROWH / Lc);
  uvb.y += (uvb.x - 0.5) * (hc2 - 0.5) * 0.1;
  float e = chipEdge(vec2(uvb.x, abs(uvb.y))) * Lc;
  float mask = smoothstep(-0.5 * fwm, 0.5 * fwm, e) * step(0.2, hash12(vec2(i - 3.0, j + 31.0) + 0.5));
#ifdef MID
  if (mask < 0.5) discard;                                 // cut pieces: the inner shell shows between them
#endif
  vec3 N0 = normalize(vN), T = normalize(vT);
  vec3 Bn = cross(N0, T); T *= head;
  vec3 toEye = cameraPosition - vW; float dist = length(toEye); vec3 V = toEye / max(dist, 1e-3);
  float fl = flinch(a, bj) * (1.0 - 0.6 * uFunnel);
#ifdef RING
  float wave = 0.75 * sin(a - uTime * 1.5708), rb = 0.5;
#else
  float wave = 0.0, rb = bj;

#endif
  float aCell = ((i + 0.5) / n - hj) * 6.2832;
  float roll = rollField(aCell, rb) + (hc - 0.5) * 0.5 + fl * 1.2 + wave;
  vec3 N = N0 * cos(roll) + Bn * sin(roll);
  float gfade = clamp((0.09 / fwm - 3.0) / 3.0, 0.0, 1.0);
  N = normalize(N + T * (sin(70.0 * length(uvb) * Lc) * 0.12 * gfade));
  float lit; vec3 chip = lqShell(N, V, uMoon, hc, lit);
  vec3 Nb = normalize(N + cross(N, T) * (uvb.y < 0.0 ? -0.6 : 0.6) + T * 0.25);
  float litb; vec3 cb = lqShell(Nb, V, uMoon, hc + 0.25, litb) * 1.3 + LQ_SILVER * 0.03;
  float bw = max(0.011, 1.3 * fwm);
  chip = mix(chip, cb, (1.0 - smoothstep(bw * 0.6, bw, e)) * clamp((0.035 / fwm - 1.3) * 0.5, 0.0, 1.0));
  float hw = max(0.0035, 0.7 * fwm);
  chip *= 1.0 - 0.9 * (1.0 - smoothstep(hw * 0.5, hw, abs(uvb.y) * Lc)) * step(0.2, uvb.x) * step(uvb.x, 0.8) * clamp(0.012 / fwm - 0.6, 0.0, 1.0);
  // --- the coarser course
  float gw = max(0.025, 0.45 * fwm), xn = (fx2 - 0.5) * 2.0;
#ifdef RING
  float head2 = uDirs.y;
#else
  float head2 = beltDir(bj2) * uDirs.x;
#endif
  // a CUT LEAF, pointed at both ends and fuller toward its head, grout all round; each piece its own size, seat and
  // slant, about one in five missing (hand-laid, not a grid of ovals)
  float prof = pow(max(1.0 - xn * xn, 0.0), 0.6) * (1.0 - 0.22 * xn * head2);
  float yc = (fy2 - 0.5 - (hd2 - 0.5) * 0.16 - xn * (hd - 0.5) * 0.14) * rowH2;
  float e2 = 0.5 * rowH2 * (0.8 + 0.2 * hd) * prof - abs(yc);
  float mask2 = smoothstep(gw, gw + 0.8 * fwm, e2) * step(fract(hd * 7.0 + hd2 * 3.0), 0.86);
  float roll2 = rollField(aCell2, bj2) + (hd - 0.5) * 0.7 + fl * 1.2 + wave;
  vec3 N2 = N0 * cos(roll2) + Bn * sin(roll2);
  float lit2; vec3 tess = lqShell(N2, V, uMoon, hd2, lit2) * (0.82 + 0.3 * hd2);
  // its cut bevel (another colour of the film) and an engraved spine, while they are wide enough to draw
  vec3 Nb2 = normalize(N2 + Bn * (yc < 0.0 ? -0.6 : 0.6) + T * 0.25);
  float litb2; vec3 cb2 = lqShell(Nb2, V, uMoon, hd2 + 0.25, litb2) * 1.3 + LQ_SILVER * 0.03;
  float bw2 = gw + max(0.035, 1.6 * fwm), nearK = 1.0 - smoothstep(7.0, 15.0, tel);   // within 7 m the leaf's detail is drawn whatever its footprint (never under 1.5 px wide)
  float bevK = (1.0 - smoothstep(bw2 * 0.7, bw2, e2)) * max(clamp((0.11 / fwm - 1.3) * 0.5, 0.0, 1.0), nearK);
  vec3 leaf = mix(tess, cb2 * (1.0 + 0.25 * litb2) + LQ_SILVER * 0.06 * litb2 * nearK, bevK);
  float sw2 = max(0.012, 0.75 * fwm);
  leaf *= 1.0 - 0.75 * (1.0 - smoothstep(sw2 * 0.5, sw2, abs(yc))) * step(abs(xn), 0.62) * max(clamp(0.04 / fwm - 0.6, 0.0, 1.0), nearK);
  // growth lines: engraved chevrons 12 cm apart running back from the spine, so a leaf near the lens is never a flat patch
  float vein = sin((xn * head2 * 0.5 * 6.2832 * rho2 / n2 + abs(yc) * 1.5) * 52.0);
  leaf *= 1.0 - 0.34 * smoothstep(0.2, 0.9, vein) * clamp((0.12 / fwm - 1.7) / 2.0, 0.0, 1.0);
  // --- the mean of the pattern, for when even that is under a pixel
  float rollA = rollField(aRel, rb) + fl * 1.2 + wave;
  vec3 Na = N0 * cos(rollA) + Bn * sin(rollA);
  float lita; vec3 avg = lqShell(Na, V, uMoon, 0.5, lita) * 0.8;
  // stage A: the chips take their leaf's colour and its grout cuts through them; stage B: the leaf fills in
#ifdef MID
  float carve = 0.0;                                       // the loose middle layer stays whole pieces
#else
  float carve = lodA * (1.0 - melt);
#endif
  vec3 col = mix(LQ_SMOKE * 0.12, mix(chip, mix(leaf * 1.15, avg, melt), lodA), mask * mix(1.0, mask2, carve));
  // near the lens (a wall seen aslant) the leaf fills in at once, bevel, spine and growth lines drawn: no chip is left
  // inside it as a stray dash
  float fill = max(lod, carve * nearK);
  col = mix(col, mix(mix(LQ_SMOKE * 0.1, leaf * 0.96, mask2), avg, lod2), fill);
  // the limb: near the lens it only sinks; from a few metres out it goes out piece by piece (ragged by patch), so
  // neither the ball nor the funnel is ever outlined by a drawn arc: the edge is stray pieces and stray chips
  float limb = 0.45 + 0.55 * smoothstep(0.04, 0.4, abs(dot(N0, V)));
#ifndef RING
  limb = mix(limb, smoothstep(0.07 + 0.33 * hl, 0.4 + 0.4 * hl, ndv), smoothstep(5.0, 14.0, dist));   // (the violet band toward the limb sinks with it, piece by piece)
#endif
  col *= limb;
  col *= 0.35 + 0.65 * smoothstep(0.0, 0.7, gap);         // the lane's lip falls into shadow
#ifndef RING
  // seen from far off every shell kind is a banded orb: at least half the film's own colour for the angle (green heart,
  // teal, violet toward the limb), so a dim kind is never a dark speckled globe
  // ... but never one flat tone: the lift follows the facets' own tilt (so the film's colours stand on the ball in the
  // bands that race round it as it turns, and the unlit bands keep two fifths), it is laid piece by piece while a leaf
  // can still be drawn (each its own strength, the grout left dark: individual fish, not a disc), and here and there
  // a piece that catches the moon glints silver
  float farK = smoothstep(42.0, 85.0, dist) * (1.0 - step(0.001, uFray));
  vec3 farFilm = lqRamp(1.25 * (1.0 - abs(dot(Na, V))) + 0.3 * (hd - 0.5)) * (LQ_GAIN * 0.5);
  col = mix(col, max(col, farFilm * mix(mask2 * (0.55 + 0.9 * hd2), 1.0, lod2) * (0.4 + 0.6 * lita)), farK);
  col += LQ_SILVER * (0.6 * farK * mask2 * step(0.88, hd) * lit2 * (1.0 - lod2));
#endif
  col *= 1.0 + LQ_FAR * smoothstep(30.0, 72.0, dist);
  if (!gl_FrontFacing) col *= 0.45;                       // the inside of the hollow orb: dimmer, same shell
  col = mix(col, mix(LQ_AMBER * 2.6, LQ_GOLD * 1.5, 0.5) * dot(col, vec3(0.3, 0.5, 0.2)), uGhost * step(0.001, uFray));   // a far shoal is an amber-gold ghost (by uGhost)
#ifdef RING
  gl_FragColor = vec4(lqDepth(col * uGain * 1.6, dist * 0.6), 1.0);   // the portal's wreath keeps its colour from the far end of the run
#else
  gl_FragColor = vec4(mix(lqDepthShell(col * uGain, dist), lqDepth(col * uGain, dist), step(0.001, uFray) * min(1.0, uGhost / 0.95)), 1.0);
#endif
}`;function Ae(n,t){const a=new r.InstancedBufferGeometry,f=[[0,0],h.t1,[h.t1[0],-h.t1[1]],h.t2,[h.t2[0],-h.t2[1]],h.ped,h.tail,[h.tail[0],-h.tail[1]],h.notch];return a.setAttribute("position",new r.Float32BufferAttribute(f.flatMap(b=>[b[0],b[1],0]),3)),a.setIndex([0,1,2,1,3,4,1,4,2,3,5,4,5,6,8,5,8,7]),a.setAttribute("aSlot",new r.InstancedBufferAttribute(n,4)),a.instanceCount=t,a.boundingSphere=new r.Sphere(o(0,g,0),400),a}function $(n,t,a){const f=new Float32Array((n+1)*(t+1)*3),b=[];for(let p=0,v=0;p<=t;p++){const d=p/t,m=a?d:.5+.5*Math.sin(Math.PI*(d-.5));for(let R=0;R<=n;R++)f[v++]=R/n*D,f[v++]=m,f[v++]=0}for(let p=0;p<t;p++)for(let v=0;v<n;v++){const d=p*(n+1)+v,m=d+n+1;a?b.push(d,d+1,m,d+1,m+1,m):b.push(d,m,d+1,d+1,m,m+1)}const x=new r.BufferGeometry;return x.setAttribute("position",new r.BufferAttribute(f,3)),x.setIndex(b),x.boundingSphere=new r.Sphere(o(0,g,0),400),x}async function Ge(n,t={}){const a=n.rng,f=n.quality?.detail??1,b=t.palette&&t.palette.length>=7?t.palette:re,x=t.shell??a.pick([0,0,0,1,2]),p=t.density??a.range(.8,1),v=Math.max(0,Math.round((t.count??28e3)*p*f)),d=t.spinDir??a.sign(),m=t.period??16*a.range(.92,1.08),R=a.range(5.5,8),be=o(.5+a.range(-.07,.07),a.range(.05,.085),a.range(1.5,2.3)*a.sign()),ge=new r.Vector4(a.int(2,4),a.range(.6,1.6),a.int(4,7),a.range(1,2.4)),xe=(t.chipLength??.34)*a.range(.95,1.08),Re=a.range(.95,1.3),U=a.sign(),ye=a.range(0,40),E=o(0,g,0),N=t.ringCenter?o().copy(t.ringCenter):o(-97,64,-69),_=(t.ringNormal?o().copy(t.ringNormal):o(-.396,.766,-.507)).normalize(),q=t.river?.[0]?o().copy(t.river[0]):o(-52,-40,22),K=t.river?.[1]?o().copy(t.river[1]):o(-100,12,-72),G=[];for(let e=0;e<M;e++)G.push(o());const W=(t.moonDir?o().copy(t.moonDir):me.clone()).normalize(),s={uTime:{value:0},uSpin:{value:0},uSpinF:{value:0},uFunnel:{value:0},uRiver:{value:0},uEat:{value:0},uBreath:{value:1},uChase:{value:0},uC:{value:E},uRingC:{value:N},uRingX:{value:o(1,0,0)},uRingY:{value:o(0,0,1)},uRingN:{value:_},uRivP:{value:G},uBelt:{value:be},uRingIn:{value:0},uFray:{value:t.fray??0},uLoose:{value:t.loose??0},uGhost:{value:t.ghost??.95},uHeart:{value:t.heart??0},uRoll:{value:ge},uMouth:{value:new r.Vector4(0,-1e4,0,0)},uKeepA:{value:[0,1,2,3].map(()=>new r.Vector4(0,-1e4,0,0))},uKeepB:{value:[0,1,2,3].map(()=>o(0,-1e4,1))},uMoon:{value:W},uLen:{value:xe},uDirs:{value:new r.Vector2(d,U)}},Y=()=>{const e=s.uRingN.value,l=Math.abs(e.y)>.92?o(1,0,0):o(0,1,0);s.uRingX.value.crossVectors(l,e).normalize(),s.uRingY.value.crossVectors(e,s.uRingX.value).normalize()};Y();const X=e=>e.copy(N).addScaledVector(s.uRingY.value,-H),j=()=>{const e=o(0,g+9,0),l=X(o());for(let c=0;c<M;c++){const i=c/(M-1),u=1-i;G[c].set(0,0,0).addScaledVector(e,u*u*u).addScaledVector(q,3*u*u*i).addScaledVector(K,3*u*i*i).addScaledVector(l,i*i*i)}};j();const B=t.gain??1.15,Le=de(b,x),S=new r.Group;S.name="mother-of-pearl-shoal";const T=(e,l,c,i)=>new r.ShaderMaterial({uniforms:{...s,uGain:{value:B},uMirror:{value:new r.Vector2(0,0)},...i},defines:c,side:r.DoubleSide,fog:!1,vertexShader:se+pe+we+e,fragmentShader:Le+pe+we+Me+l}),z=T(O,V,{});z.uniforms.uGain.value=.87*B;const J=T(O,V,{MID:1});J.uniforms.uGain.value=.95*B;const P=new r.Mesh($(96,36,!1),J);P.frustumCulled=!1,P.name="shoal-mid",S.add(P),await n.yield?.();const A=new r.Mesh($(112,44,!1),z);A.frustumCulled=!1,A.name="shoal-core",S.add(A),await n.yield?.();const Z=T(O,V,{RING:1});Z.uniforms.uGain.value=.87*B;const C=new r.Mesh($(96,10,!0),Z);C.frustumCulled=!1,C.name="shoal-ring-core",S.add(C),await n.yield?.();let F=null;if(v>0){const e=new Float32Array(v*4),l=Math.min(v,Math.round(21800*p*f));let c=a;for(let i=0,u=0;i<v;i++){i===l&&(c=Ne(Math.floor(e[0]*1e8)+17)),e[u++]=c()*D,e[u++]=c();const k=c();e[u++]=k*(.55+.45*k),e[u++]=c(),(i&4095)===4095&&await n.yield?.()}F=new r.Mesh(Ae(e,v),T(Ee,Te,{})),F.frustumCulled=!1,F.name="shoal-chips",S.add(F)}await n.yield?.();const w={funnel:[.475,.545],eat:[.585,.615],river:[.5925,.885],ring:[.63,.755],...t.keys||{}};let ee=t.progress??0,Q=null,te=1;const I={object:S,radius:g,height:2*g,center:E.clone(),ground:!1,groundY:0,uniforms:s,chips:F,core:A,mid:P,ringCore:C,count:v,shell:x,keys:w,riverRide:{spread:ue,dur:ve},setProgress(e){ee=e,s.uFunnel.value=ne(w.funnel[0],w.funnel[1],e),s.uEat.value=ne(w.eat[0],w.eat[1],e),s.uRiver.value=y((e-w.river[0])/(w.river[1]-w.river[0]),0,1),s.uRingIn.value=y((e-w.ring[0])/(w.ring[1]-w.ring[0]),0,1)},setFunnel(e){s.uFunnel.value=y(e,0,1)},setSwell(e){te=y(e,.8,1.3)},setEaten(e){s.uEat.value=y(e,0,1)},setRiver(e){s.uRiver.value=y(e,0,1),s.uRingIn.value=y(e*1.6,0,1)},setRing(e,l){e&&N.copy(e),l&&_.copy(l).normalize(),Y(),j(),ae()},setRiverPath(e,l){e&&q.copy(e),l&&K.copy(l),j()},setRiverSpline(e){for(let l=0;l<M;l++)G[l].copy(e[Math.min(l,e.length-1)])},setMoon(e){W.copy(e).normalize()},setKeepOut(e,l,c,i){e<0||e>3||(s.uKeepA.value[e].set(l.x,l.y,l.z,Math.max(0,i)),s.uKeepB.value[e].copy(c))},clearKeepOut(e){e>=0&&e<=3&&s.uKeepA.value[e].set(0,-1e4,0,0)},setMouth(e,l){s.uMouth.value.set(e.x,e.y,e.z,Math.max(0,l))},makeMirror(e,l=.4){const c=T(O,V,{});c.uniforms.uMirror.value.set(e,1),c.uniforms.uGain.value=z.uniforms.uGain.value*l;const i=new r.Mesh(A.geometry,c);return i.frustumCulled=!1,i.name="shoal-mirror",S.add(i),i},anchors:{},update(e,l,c){const i=l+ye,u=Q===null?0:y(l-Q,0,.1);Q=l,s.uTime.value=i,s.uSpin.value=i*(D/m)*d,s.uSpinF.value+=u*Re*s.uFunnel.value*d,s.uBreath.value=(1+.04*Math.sin(i*D/R))*te,s.uChase.value=i*.28*U},dispose(){}};S.userData.hero=I;function ae(){const e=I.anchors,l=o(_.x,0,_.z).normalize();e.center=E.clone(),e.axis=o(0,1,0),e.ball={center:E.clone(),radius:g,skin:ce},e.funnel={throat:o(0,0,0),flare:o(0,he,0),throatRadius:2.5,flareRadius:12},e.ring={center:N.clone(),normal:_.clone(),radius:H,tube:fe},e.ringFoot=X(o()),e.riverKnots=M,e.portalSeat={position:N.clone(),normal:_.clone().negate(),radius:7},e.riverControls=[q.clone(),K.clone()];const c=[o(-23,86,151),o(-23,86,91),o(-23,62,70),o(-23,34,50),o(-23,20,30)];for(let u=0;u<=10;u++){const k=u*32.2,oe=k*Math.PI/180,le=y((k-90)/232,0,1),ie=g+3+11*le;c.push(o(-ie*Math.cos(oe),g-18*le,-ie*Math.sin(oe)))}const i=N.clone().addScaledVector(_,-60);c.push(i.clone().addScaledVector(l,-36).setY(2),i,N.clone()),e.flyThrough=c,e.viewpoints=[{position:o(-23,62,70),target:E.clone()},{position:o(-23,20,0),target:o(-18,20,-12)},{position:o(-30,6,20),target:o(0,18,0)},{position:i.clone(),target:N.clone()}]}return ae(),I.setProgress(ee),I.update(0,0,null),I}export{Ge as buildHero,de as lacquerGLSL,ke as styleMaterial};
