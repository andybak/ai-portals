import*as v from"three";import{makePath as co,clamp as t0,lerp as B,smoothstep as N}from"../kit/core.js";import{buildHero as uo,Geo as Ie,plate as xe,roundRect as pa}from"../parts/still-on-the-sprue.js";const E=Math.PI*2,b=(s,u,p)=>new v.Vector3(s,u,p),da=s=>{const u=new v.Color(s);return[u.r,u.g,u.b]},f0=(s,u,p)=>[B(s[0],u[0],p),B(s[1],u[1],p),B(s[2],u[2],p)],va=24,ht=16,ma=.19;function fo(s){const u=s[0]/.6,p=s[1]/.6,M=s[2]/.6,w=[.59719*u+.35458*p+.04823*M,.076*u+.90834*p+.01566*M,.0284*u+.13383*p+.83777*M].map(d=>(d*(d+.0245786)-90537e-9)/(d*(.983729*d+.432951)+.238081));return[1.60475*w[0]-.53108*w[1]-.07367*w[2],-.10208*w[0]+1.10813*w[1]-.00605*w[2],-.00327*w[0]-.07276*w[1]+1.07602*w[2]].map(d=>t0(d,0,1))}function xa(s){const u=s.slice();for(let p=0;p<60;p++){const M=fo(u);for(let w=0;w<3;w++)u[w]=t0(u[w]*t0(s[w]/Math.max(M[w],1e-4),.7,1.4),0,6)}return u}const ga=s=>new v.Color().setRGB(...xa(da(s))),ya=`
vec3 qrot(vec4 q, vec3 v) { return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v); }
vec4 qmul(vec4 a, vec4 b) { return vec4(a.w * b.xyz + b.w * a.xyz + cross(a.xyz, b.xyz), a.w * b.w - dot(a.xyz, b.xyz)); }
vec4 qaxis(vec3 ax, float ang) { return vec4(ax * sin(ang * 0.5), cos(ang * 0.5)); }
`,ho=`
uniform vec3 uRareP; uniform vec4 uRareQ;
void creature(vec4 c0, vec4 c1, float time, out vec3 cp, out vec4 cq) {
  cp = c0.xyz;
  if (c1.x > 0.0) {
    float a = c1.w + time * c1.z; float ca = cos(a), sa = sin(a);
    cp += vec3(ca * c1.x, c0.w * sin(a * 2.0 + c1.w * 3.0), sa * c1.y);
    vec2 tg = vec2(-sa * c1.x, ca * c1.y) * (c1.z < 0.0 ? -1.0 : 1.0);
    float yaw = (abs(tg.x) + abs(tg.y)) > 1e-5 ? atan(tg.x, tg.y) : 0.0;
    cq = vec4(0.0, sin(yaw * 0.5), 0.0, cos(yaw * 0.5));
  } else if (c1.x < 0.0) { cp = uRareP; cq = uRareQ; }
  else {
    cq = vec4(0.0, sin(c0.w * 0.5), 0.0, cos(c0.w * 0.5));
    if (c1.y != 0.0) {                                           // a walker: c1 = (0, metres per unit of u, the u it is keyed to, how far past it goes)
      cp.xz += vec2(sin(c0.w), cos(c0.w)) * c1.y * clamp(uU - c1.z, -1.0, c1.w);
      cp.y += 0.14 * sin(time * 2.1 + c1.z * 40.0);
    }
  }
}`,wa=`
attribute vec2 aux;
attribute vec3 iHomeP; attribute vec4 iHomeQ; attribute vec3 iDockP; attribute vec4 iDockQ;
attribute vec4 iCre0; attribute vec4 iCre1; attribute vec4 iRel; attribute vec4 iJoint; attribute vec3 iCol; attribute vec4 iFlex; attribute vec3 iGap;
uniform float uU; uniform float uTime; uniform float uFlex; uniform vec3 uScar; uniform vec3 uPin;
varying vec3 vN; varying vec3 vW; varying vec3 vC; varying vec3 vO; varying float vThin; varying float vSt;
${ya}
${ho}
void main() {
  vec3 cp; vec4 cq; creature(iCre0, iCre1, uTime, cp, cq);
  float psc = max(length(iFlex.xy), 1e-3); vec3 lp = position * psc;      // iFlex.xy: frame normal times the part's scale
  float k = (uU - iRel.x) / max(iRel.y, 1e-4);
  float seated = step(1.0, k);
  // the stiff joint, only once seated: 1 two-position wingbeat about z, 2 clicking leg about x, 3 sway about x, 4 tier
  float jm = iJoint.x; float sw = sin(uTime * iJoint.z + iJoint.w);
  float wv = jm < 1.5 ? smoothstep(-0.25, 0.25, sw) * 2.0 - 1.0 : (jm < 2.5 ? clamp(sw * 1.7, -1.0, 1.0) : sw);
  float ang = (jm > 0.5 && jm < 3.5) ? iJoint.y * wv * seated : 0.0;
  vec4 jq = jm < 1.5 ? qaxis(vec3(0.0, 0.0, 1.0), ang) : qaxis(vec3(1.0, 0.0, 0.0), ang);
  vec4 sq = qmul(cq, qmul(iDockQ, jq));
  vec3 sp = cp + qrot(cq, iDockP);
  // home: leaf tremble, then three twists on the gates, riding the flex of its frame
  float j = clamp((uU - (iRel.x - 0.012)) / 0.012, 0.0, 1.0);
  float exc = smoothstep(iRel.x - 0.07, iRel.x - 0.012, uU);
  float ph = iFlex.z * 3.1 + iHomeP.x * 0.7 + iHomeP.y * 1.3;
  float trem = (0.02 + 0.045 * exc) * (sin(uTime * 23.0 + ph) + sin(uTime * 17.3 + ph * 1.7));
  float ta = abs(iRel.z) * (trem + sin(18.85 * j) * (0.35 + 0.65 * j));
  vec4 tq = iRel.z >= 0.0 ? qaxis(vec3(1.0, 0.0, 0.0), ta) : qaxis(vec3(0.0, 1.0, 0.0), ta);
  vec4 hq = qmul(iHomeQ, tq);
  float fk = clamp((iHomeP.y - iFlex.w) / ${ht}.0, 0.0, 1.3); fk *= fk;
  vec3 hp = iHomeP + vec3(iFlex.x, 0.0, iFlex.y) / psc * (uFlex * fk * sin(uTime * 0.8 + iFlex.z));
  vec3 wpos; vec4 q; float st = 0.0;
  if (k >= 1.0) { q = sq; wpos = sp + qrot(q, lp); }
  else if (k <= 0.0) { q = hq; wpos = hp + qrot(q, lp); st = 0.6 * j; }
  else {
    vec3 gap = qrot(cq, iGap);
    st = 0.6 * (1.0 - k);
    if (k < 0.8) {
      float e = k / 0.8; e = e * e * (3.0 - 2.0 * e);
      vec3 pre = sp + gap; float d = distance(hp, pre);
      vec3 c1 = (hp + pre) * 0.5 + vec3(0.0, iRel.w * d + 1.5, 0.0);
      float s1 = 1.0 - e;
      vec3 c = s1 * s1 * hp + 2.0 * s1 * e * c1 + e * e * pre;
      vec4 qb = dot(hq, sq) < 0.0 ? -sq : sq;
      q = normalize(mix(hq, qb, e));
      wpos = c + qrot(q, lp);
    } else {
      float t = (k - 0.8) / 0.2; float s2 = t - 1.0; float bo = 1.0 + 2.2 * s2 * s2 * s2 + 1.2 * s2 * s2;
      q = jm > 3.5 ? qmul(sq, qaxis(vec3(0.0, 1.0, 0.0), 1.5708 * s2 * s2)) : sq;   // a tier spins a quarter turn as it drops
      wpos = sp + gap * (1.0 - bo) + qrot(q, lp);
    }
  }
  vW = wpos; vN = qrot(q, normal); vO = position; vThin = aux.x; vSt = st;
  vC = mix(mix(iCol, uScar, step(0.5, aux.y) * step(aux.y, 1.5)), uPin, step(2.5, aux.y) * step(aux.y, 3.5)) * (1.0 - 0.5 * step(3.5, aux.y));
  gl_Position = projectionMatrix * viewMatrix * vec4(wpos, 1.0);
}`,po=`
attribute vec2 aux;
attribute vec3 iPos; attribute vec4 iQuat; attribute vec3 iCol; attribute vec4 iFx;   // iFx: phase, topple u0, flex amount, scale
uniform float uU; uniform float uTime; uniform float uFlex; uniform float uPix; uniform vec3 uScar; uniform vec3 uPin;
varying vec3 vN; varying vec3 vW; varying vec3 vC; varying vec3 vO; varying float vThin; varying float vSt;
${ya}
void main() {
  vec3 p = position * iFx.w; vec3 n = normal;
  float fk = clamp(p.y / ${ht}.0, 0.0, 1.3); fk *= fk;
  p.z += uFlex * iFx.z * fk * sin(uTime * 0.8 + iFx.x);
  float tk = clamp((uU - iFx.y) / 0.06, 0.0, 1.0);
  float fall = tk * tk * (1.0 + 0.06 * sin(tk * 9.42) * (1.0 - tk)) * 1.5;           // slow at first, like a card
  vec4 fq = qaxis(vec3(1.0, 0.0, 0.0), fall);
  p = qrot(fq, p); n = qrot(fq, n);
  vec3 wn = qrot(iQuat, n);
  vec3 wpos = iPos + qrot(iQuat, p);
  float dcam = distance(cameraPosition, wpos);
  wpos += wn * clamp(dcam * uPix * 1.1 - ${ma.toFixed(2)} * iFx.w, 0.0, 1.6) * step(aux.y, 1.5);   // runners never under two pixels
  vW = wpos; vN = wn; vO = position; vThin = aux.x; vSt = 0.0;
  vC = mix(mix(iCol, uScar, step(0.5, aux.y) * step(aux.y, 1.5)), uPin, step(2.5, aux.y) * step(aux.y, 3.5)) * (1.0 - 0.5 * step(3.5, aux.y));
  gl_Position = projectionMatrix * viewMatrix * vec4(wpos, 1.0);
}`,ba=`
uniform vec3 uSun; uniform vec3 uKey; uniform vec3 uFill; uniform vec3 uSky; uniform vec3 uFogCol; uniform float uFogDen; uniform float uPix;
varying vec3 vN; varying vec3 vW; varying vec3 vC; varying vec3 vO; varying float vThin; varying float vSt;
float hazeAt(float dist) { float f = uFogDen * dist; return 1.0 - exp(-f * f); }
`,Ma=ba+`
void main() {
  vec3 N = vN; float nl = length(N); N = nl > 1e-5 ? N / nl : vec3(0.0, 1.0, 0.0);
  vec3 Vv = cameraPosition - vW; float dist = length(Vv); vec3 V = Vv / max(dist, 1e-4);
  float inside = 0.0;
  if (!gl_FrontFacing) { N = -N; inside = 1.0; }
  float ndl = dot(N, uSun);
  float wrap = clamp((ndl + 0.6) / 1.6, 0.0, 1.0);
  vec3 col = mix(max(vC, vec3(0.0)), vec3(0.86, 0.84, 0.80), clamp(vSt, 0.0, 1.0) * 0.5);
  float lit = smoothstep(-0.25, 0.75, ndl);
  vec3 body = col * (mix(uFill * (0.50 + 0.10 * N.y), uKey * 1.12, lit) + uKey * 0.10 * max(-N.y, 0.0));   // a harder terminator; the lit floor bounces up
  body += (vec3(0.018, 0.020, 0.026) + col * 0.08) * (1.0 - lit);       // the same floor of sky light on the shadow side of every part
  body *= 1.0 - 0.16 * inside;
  vec3 H = uSun + V; float hl = length(H); H = hl > 1e-4 ? H / hl : N;
  float nh = clamp(dot(N, H), 0.0, 1.0); float nv = clamp(dot(N, V), 0.0, 1.0);
  float s2 = nh * nh; float s4 = s2 * s2; float s10 = s4 * s4 * s2;
  float f = 1.0 - nv;
  float toward = 0.5 + 0.5 * dot(-V, uSun);
  vec3 sheen = 0.16 * s10 * uKey + 0.07 * f * f * f * uSky + col * uKey * 0.45 * f * f * toward * toward;   // and a rim of light on whatever stands against the sun
  vec3 bleed = clamp(vThin, 0.0, 1.0) * (0.5 - 0.5 * ndl) * 0.45 * mix(col, vec3(1.0), 0.5) * (0.3 + 0.7 * toward) * uKey;
  gl_FragColor = vec4(mix(body + sheen + bleed, uFogCol, hazeAt(dist)), 1.0);
}`,vo=ba+`
uniform vec3 uAmber; uniform vec3 uTrA; uniform vec3 uTrB; uniform vec3 uHot; uniform float uFire;
void main() {
  vec3 N = vN; float nl = length(N); N = nl > 1e-5 ? N / nl : vec3(0.0, 1.0, 0.0);
  vec3 Vv = cameraPosition - vW; float dist = length(Vv); vec3 V = Vv / max(dist, 1e-4);
  if (!gl_FrontFacing) N = -N;
  float nv = clamp(dot(N, V), 0.0, 1.0); float g = 1.0 - nv; float fa = hazeAt(dist);
  float rib = clamp(vThin, 0.0, 1.0);
#ifdef AMBER_MUL
  vec3 T = mix(uTrA, uTrB, clamp(rib * 0.8 + g * g * 0.7, 0.0, 1.0));
  gl_FragColor = vec4(mix(T, vec3(1.0), fa), 1.0);
#else
  float ndl = dot(N, uSun);
  float through = clamp(dot(-V, uSun), 0.0, 1.0); float fire = through * through * through;
  float face = 0.3 + 0.7 * nv;
  vec3 c = uAmber * (0.08 + 0.13 * rib + 0.04 * g) * face;
  c += mix(uAmber, uHot, 0.45) * uFire * fire * face * face * (0.35 + 0.65 * rib);
  c += rib * 0.3 * uAmber * (0.5 - 0.5 * ndl) * face + 0.04 * g * g * g * uSky * face;
  gl_FragColor = vec4(c * (1.0 - fa), 1.0);
#endif
}`,mo=`
attribute vec2 aux; attribute vec3 acol;
varying vec3 vN; varying vec3 vW; varying vec3 vCol; varying float vPale; varying float vRiver;
void main() { vW = position; vN = normal; vCol = acol; vPale = aux.x; vRiver = aux.y; gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0); }`,Sa=`
// the valley sides are five moulded shells a side (the same sums of sines as ground() in build): where shell k's riser stands
float shellE(float k, float z, float w, float s) {
  return max(w * 0.44, 58.0) + k * max(w * 0.15, 19.0) + max(w * 0.04, 4.5) * (sin(z * 0.0105 + k * 2.1 + s * 1.3) + 0.6 * sin(z * 0.0231 + k * 4.3 + 1.0 - s * 0.7));
}
// the shade a riser throws inward over the tread below it, when the sun stands behind that side: len in riser widths
float shellShade(float e, float dx, float rw, float len) {
  float r = (e - dx) / rw; len = max(len, 0.05);
  return step(0.0, r) * (1.0 - smoothstep(len * 0.55, len, r)) + (1.0 - step(0.0, r)) * (1.0 - smoothstep(0.0, 0.5, -r));
}
// the shade of a whole shell and all that stands on it, thrown inward across the lower treads and the floor: reach in
// metres from its foot, and never across our own line, so the floor has a shadow side and a lit one
float wallShade(float e, float dx, float reach) {
  float lim = min(reach, max(e - 9.0, 0.0)); float r = e - dx;
  return step(0.0, r) * (1.0 - smoothstep(lim * 0.86 - 2.0, lim, r));
}
`,Aa=Sa+`
// how far the valley side takes the sun from a point of the floor or the benches (the same sums as in the ground shader):
// the painted shadows of frames and parts leave off there, since no sun reaches the ground to be kept from it
float sideShd(vec3 W, vec3 sun) {
  float cx = 0.2589 * max(0.0, W.z - 850.0); float sd = W.x >= cx ? 1.0 : -1.0; float dxc = abs(W.x - cx);
  float vw = mix(250.0, 105.0, smoothstep(760.0, 1090.0, W.z)); float rw = max(vw * 0.04, 5.0);
  float sunOut = sd * sun.x / max(sun.y, 0.25) / rw; if (sunOut <= 0.0) return 0.0;
  float e0 = shellE(0.0, W.z, vw, sd), e1 = shellE(1.0, W.z, vw, sd), e2 = shellE(2.0, W.z, vw, sd), e3 = shellE(3.0, W.z, vw, sd), e4 = shellE(4.0, W.z, vw, sd);
  float so = sunOut * rw;
  float a = max(max(shellShade(e0, dxc, rw, 18.0 * sunOut), shellShade(e1, dxc, rw, 24.0 * sunOut)), max(max(shellShade(e2, dxc, rw, 27.0 * sunOut), shellShade(e3, dxc, rw, 30.0 * sunOut)), shellShade(e4, dxc, rw, 14.0 * sunOut)));
  return max(a, max(max(wallShade(e1, dxc, 42.0 * so), wallShade(e2, dxc, 69.0 * so)), max(wallShade(e3, dxc, 99.0 * so), wallShade(e4, dxc, 113.0 * so))));
}
`,xo=`
uniform vec3 uSun; uniform vec3 uKey; uniform vec3 uFill; uniform vec3 uSky; uniform vec3 uFogCol; uniform float uFogDen; uniform float uPix;
uniform vec3 uPale; uniform float uTime; uniform vec2 uDarkZ; uniform float uCast; uniform vec3 uDeep;
uniform vec3 uFrP; uniform vec3 uFrX; uniform vec3 uFrN; uniform vec3 uHullP; uniform vec3 uHullA; uniform float uHullK;
varying vec3 vN; varying vec3 vW; varying vec3 vCol; varying float vPale; varying float vRiver;
float h21(vec2 p) { p = fract(p * vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.y); }
// a dome bump in each cell of a jittered grid: returns xy = slope, z = mask
vec3 bumps(vec2 x, float cell, float rmin, float rmax, float density) {
  vec2 g = x / cell; vec2 id = floor(g); vec2 f = fract(g) - 0.5;
  float h = h21(id + cell * 7.3); float on = step(h, density);
  vec2 c = (vec2(h21(id + 3.1), h21(id + 11.7)) - 0.5) * 0.5;
  float r = mix(rmin, rmax, h21(id + 5.5)) / cell;
  vec2 d = f - c; float l = length(d); float m = on * (1.0 - smoothstep(r * 0.7, r, l));
  float edge = on * smoothstep(r * 0.35, r * 0.9, l) * (1.0 - smoothstep(r * 0.9, r * 1.05, l));
  return vec3(d / max(l, 1e-3) * edge, m);
}
// an ejector-pin witness mark at landscape scale: x = the raised ring, y = the disc inside it, zw = outward on the ring
vec4 pinMark(vec2 x, float cell, float rmin, float rmax, float density, float lw) {
  vec2 g = x / cell; vec2 id = floor(g); vec2 f = fract(g) - 0.5;
  float h = h21(id + cell * 3.7); float on = step(h, density);
  vec2 c = (vec2(h21(id + 13.1), h21(id + 27.7)) - 0.5) * 0.4;
  float r = mix(rmin, rmax, h21(id + 45.5));
  vec2 d = (f - c) * cell; float l = length(d); float e = (l - r) / lw;
  float band = on * (1.0 - smoothstep(0.5, 1.0, abs(e)));
  return vec4(band, on * (1.0 - smoothstep(r - lw, r, l)), d / max(l, 1e-3) * clamp(e * 2.0, -1.0, 1.0));     // zw: the bead's two slopes
}
${Sa}
// x = on the riser, y = the pale lip at its crest (never under a pixel wide), z = above it
vec3 shellAt(float e, float dx, float rw, float px) {
  float r = (dx - e) / rw; float lw = 0.2 + 0.55 * px / rw;
  return vec3(smoothstep(0.0, 0.2, r) * (1.0 - smoothstep(0.75, 1.0, r)), smoothstep(0.66, 0.82, r) * (1.0 - smoothstep(0.82 + lw * 0.6, 0.82 + lw, r)), smoothstep(0.6, 1.0, r));
}
// CAST SHADOWS, painted from what is known: the ground point is carried along the sun ray to the Great Frame's plane and
// tested against its runners (the numbers are frameRuns() in src/parts/still-on-the-sprue.js, metres in the Frame's plane)
float vbar(float lx, float ly, float X, float y0, float y1, float hw) { return (1.0 - smoothstep(hw, hw * 2.0 + 0.4, abs(lx - X))) * step(y0, ly) * step(ly, y1); }
float hbar(float lx, float ly, float Y, float x0, float x1, float hw) { return (1.0 - smoothstep(hw, hw * 2.0 + 0.4, abs(ly - Y))) * step(x0, lx) * step(lx, x1); }
float frameShade(vec3 P) {
  float dn = dot(uSun, uFrN); dn = dn < 0.0 ? min(dn, -0.05) : max(dn, 0.05);
  float t = dot(uFrP - P, uFrN) / dn;
  vec3 hit = P + uSun * t - uFrP; float lx = dot(hit, uFrX), ly = hit.y;
  if (t <= 0.0 || abs(lx) > 112.0 || ly < 2.0 || ly > 142.0) return 0.0;
  float hw = 1.0 + 0.005 * t, th = hw * 0.7;
  float m = max(max(vbar(lx, ly, -109.4, 4.0, 139.4, hw), vbar(lx, ly, 109.4, 4.0, 139.4, hw)), max(vbar(lx, ly, -44.0, 4.0, 139.4, hw), vbar(lx, ly, 16.0, 4.0, 139.4, hw)));
  m = max(m, max(max(vbar(lx, ly, -77.0, 30.0, 104.0, hw), vbar(lx, ly, 34.0, 30.0, 104.0, hw)), max(vbar(lx, ly, 66.0, 30.0, 104.0, hw), vbar(lx, ly, 98.0, 30.0, 104.0, hw))));
  m = max(m, max(max(hbar(lx, ly, 4.0, -109.4, 109.4, hw), hbar(lx, ly, 139.4, -109.4, 109.4, hw)), max(hbar(lx, ly, 30.0, -109.4, 109.4, hw), hbar(lx, ly, 104.0, -109.4, 109.4, hw))));
  float n = max(max(vbar(lx, ly, -29.0, 30.0, 104.0, th), vbar(lx, ly, -14.0, 30.0, 104.0, th)), max(vbar(lx, ly, 1.0, 30.0, 104.0, th), vbar(lx, ly, 25.0, 30.0, 104.0, th)));
  n = max(n, max(max(hbar(lx, ly, 48.5, -44.0, 16.0, th), hbar(lx, ly, 67.0, -44.0, 16.0, th)), hbar(lx, ly, 85.5, -44.0, 16.0, th)));
  n = max(n, max(max(vbar(lx, ly, -76.7, 104.0, 139.4, th), vbar(lx, ly, -14.0, 104.0, 139.4, th)), max(vbar(lx, ly, 62.6, 104.0, 139.4, th), hbar(lx, ly, 17.0, -109.4, 109.4, th) * step(16.0, abs(lx + 14.0) - 14.0))));
  return max(m, 0.6 * n);
}
// the hull's shadow: a spindle 60 m long about its axis, wherever the sun ray from the ground point passes within its girth
float hullShade(vec3 P) {
  vec3 d = P - uHullP; float ds = dot(d, uSun);
  vec3 dp = d - uSun * ds; vec3 ap = uHullA - uSun * dot(uHullA, uSun);
  float sA = clamp(dot(dp, ap) / max(dot(ap, ap), 1e-3), -30.0, 30.0); float kA = sA / 30.0;
  float r = length(dp - ap * sA), rs = 7.6 * (1.0 - 0.62 * kA * kA);
  return uHullK * step(ds, 0.0) * (1.0 - smoothstep(rs * 0.55, rs * 1.1 + 1.5 - 0.012 * min(ds, 0.0), r));
}
void main() {
  vec3 N = vN; float nl = length(N); N = nl > 1e-5 ? N / nl : vec3(0.0, 1.0, 0.0);
  vec3 Vv = cameraPosition - vW; float dist = length(Vv); vec3 V = Vv / max(dist, 1e-4);
  float px = dist * uPix * 2.0;
  float fStip = clamp(1.0 - px / 0.45, 0.0, 1.0), fPeb = clamp(1.0 - px / 1.6, 0.0, 1.0), fSock = clamp(1.0 - px / 3.0, 0.0, 1.0), fFold = clamp(1.0 - px / 9.0, 0.0, 1.0);
  float river = smoothstep(0.35, 0.65, vRiver); float land = step(-0.5, vRiver);          // the far shells beyond the portal carry -1
  vec2 x = vW.xz; vec2 off = vec2(0.0); float pale = vPale; float dark = 0.0;
  vec3 st = bumps(x, 0.55, 0.12, 0.2, 0.75); off += st.xy * 1.0 * fStip * (1.0 - river);            // grass stipple
  vec3 s2b = bumps(x + 5.0, 1.45, 0.3, 0.5, 0.6); off += s2b.xy * 0.7 * clamp(1.0 - px / 1.3, 0.0, 1.0) * (1.0 - river);
  float flat1 = smoothstep(0.82, 0.97, N.y); fPeb *= flat1; fSock *= flat1;
  float dz = smoothstep(uDarkZ.x, uDarkZ.y, vW.z);
  // the moulded shells of the valley sides: a soft shade on each riser, a pale lip where the sheet stretched over
  // the tool's edge, each tread a little paler than the one below
  float cx = 0.2589 * max(0.0, vW.z - 850.0); float sd = vW.x >= cx ? 1.0 : -1.0; float dxc = abs(vW.x - cx);
  float vw = mix(250.0, 105.0, smoothstep(760.0, 1090.0, vW.z)); float rw = max(vw * 0.04, 5.0);
  float e0 = shellE(0.0, vW.z, vw, sd), e1 = shellE(1.0, vW.z, vw, sd), e2 = shellE(2.0, vW.z, vw, sd), e3 = shellE(3.0, vW.z, vw, sd), e4 = shellE(4.0, vW.z, vw, sd);
  float floorM0 = 1.0 - smoothstep(e0 - 16.0, e0 - 3.0, dxc);
  vec3 sh = shellAt(e0, dxc, rw, px) + shellAt(e1, dxc, rw, px) + shellAt(e2, dxc, rw, px) + shellAt(e3, dxc, rw, px) + shellAt(e4, dxc, rw, px);
  float riser = min(sh.x, 1.0) * land, lip = min(sh.y, 1.0) * land, level = sh.z * land;
  float sunOut = sd * uSun.x / max(uSun.y, 0.25) / rw; float shd = 0.0;
  if (sunOut > 0.0) shd = max(max(shellShade(e0, dxc, rw, 18.0 * sunOut), shellShade(e1, dxc, rw, 24.0 * sunOut)),
    max(max(shellShade(e2, dxc, rw, 27.0 * sunOut), shellShade(e3, dxc, rw, 30.0 * sunOut)), shellShade(e4, dxc, rw, 14.0 * sunOut))) * land;
  if (sunOut > 0.0) { float so = sunOut * rw; shd = max(shd, max(max(wallShade(e1, dxc, 42.0 * so), wallShade(e2, dxc, 69.0 * so)), max(wallShade(e3, dxc, 99.0 * so), wallShade(e4, dxc, 113.0 * so))) * land); }
  // kit tells on the risers, large enough to read from across the valley: a row of ejector-pin rings half way up
  // each wall and an upright parting seam every third ring; the panels between seams step darker toward the portal
  float eR = dxc > e4 ? e4 : dxc > e3 ? e3 : dxc > e2 ? e2 : dxc > e1 ? e1 : e0;
  float kR = dxc > e4 ? 4.0 : dxc > e3 ? 3.0 : dxc > e2 ? 2.0 : dxc > e1 ? 1.0 : 0.0;
  float hR = kR > 3.5 ? 14.0 : 18.0 + 4.2 * kR; float rfr = clamp((dxc - eR) / rw, 0.0, 1.0);
  float yR = (rfr * rfr * (3.0 - 2.0 * rfr) - 0.5) * hR; float cR = 34.0 + 5.0 * kR;
  float zc = vW.z / cR + kR * 0.37 + sd * 0.21; float zR = (fract(zc) - 0.5) * cR; float lwR = max(0.5, px * 0.75);
  float hRn = h21(vec2(floor(zc), kR * 7.0 + sd)); float rR = hR * (0.2 + 0.1 * hRn);
  float dR = length(vec2(zR, yR)) + 60.0 * step(0.72, fract(hRn * 7.3)); float fR = riser * (1.0 - lip) * (1.0 - smoothstep(9.0, 22.0, px));
  float ringR = (1.0 - smoothstep(lwR * 0.5, lwR, abs(dR - rR))) * fR; float discR = (1.0 - smoothstep(rR - lwR, rR, dR)) * fR;
  float zs = vW.z / (cR * 3.0) + kR * 0.37 + sd * 0.21 + 0.5 / 3.0; float zS = (fract(zs) - 0.5) * cR * 3.0;
  float seamR = (1.0 - smoothstep(lwR * 0.4, lwR * 0.9, abs(zS))) * fR; float stepR = floor((vW.z - 760.0) / 80.0) * step(760.0, vW.z) * land;
  pale += 0.035 * level + 0.6 * lip * (1.0 - 0.35 * dz) + 0.26 * max(ringR, seamR); dark += (0.27 - 0.09 * dz) * riser * (1.0 - lip) + 0.07 * discR * (1.0 - ringR) + 0.03 * min(stepR, 5.0) * (1.0 - floorM0) * (1.0 - lip);
  float floorM = (1.0 - smoothstep(e0 - 16.0, e0 - 3.0, dxc)) * (1.0 - river) * land;
  vec3 pb = bumps(x, 2.3, 0.2, 0.55, 0.3); off += pb.xy * 0.55 * fPeb; pale += pb.z * 0.08 * fPeb;      // pebbles
  vec3 pc = bumps(x + 17.0, 9.3, 0.7, 1.5, 0.22); off += pc.xy * 0.5 * fSock; pale += pc.z * 0.06 * fSock;
  vec3 sk = bumps(x + 41.0, 19.0, 1.0, 1.3, 0.3); off -= sk.xy * 0.9 * fSock * (1.0 - river); dark += sk.z * 0.12 * fSock * (1.0 - river);   // empty sockets
  // kit tells at the scale of the land: ejector-pin rings 15 to 70 m across pressed into the floor, and the mould's
  // parting seams running straight across floor and hills alike, each panel between them a slightly different pull
  float lwr = max(0.55, px * 0.6);
  vec4 m1 = pinMark(x + 91.0, 64.0, 6.5, 12.0, 0.5, lwr); vec4 m2 = pinMark(x + 300.0, 190.0, 22.0, 34.0, 0.6, lwr * 1.4);
  float f1 = (1.0 - smoothstep(3.0, 8.0, px)) * floorM, f2 = (1.0 - smoothstep(6.0, 14.0, px)) * floorM;
  float farK = smoothstep(0.4, 2.2, px);                                    // close to, a bead is seen by its light and shade; from the air, as a pale ring
  pale += (0.07 + 0.2 * farK) * (m1.x * f1 + m2.x * f2); dark += 0.09 * m1.y * (1.0 - m1.x) * f1 + 0.08 * m2.y * (1.0 - m2.x) * f2;
  off += (m1.zw * m1.x * f1 + m2.zw * m2.x * f2) * 1.1;
  vec2 sm = vec2(dot(x, vec2(0.906, 0.423)), dot(x, vec2(-0.423, 0.906))); vec2 sc = vec2(150.0, 230.0);
  vec2 sf = (fract(sm / sc + 0.5) - 0.5) * sc; vec2 sa = abs(sf); float lws = max(0.4, px * 0.55);
  float fSeam = (1.0 - smoothstep(4.0, 11.0, px)) * (1.0 - river) * land * (0.25 + 0.75 * floorM);
  float seam = max(1.0 - smoothstep(lws * 0.5, lws, sa.x), 1.0 - smoothstep(lws * 0.5, lws, sa.y)) * fSeam;
  float sshade = max((1.0 - smoothstep(lws, lws * 4.0, sa.x)) * step(0.0, sf.x), (1.0 - smoothstep(lws, lws * 4.0, sa.y)) * step(0.0, sf.y)) * fSeam;
  float panel = (h21(floor(sm / sc + 0.5) + 7.0) - 0.5) * land;
  pale += (0.08 + 0.2 * farK) * seam; dark += 0.10 * sshade * (1.0 - seam);
  float fw = sin(x.x * 0.21 + sin(x.y * 0.05) * 2.0) + sin(x.y * 0.17 + sin(x.x * 0.043) * 2.4);                  // soft radiused folds
  off += vec2(cos(x.x * 0.21 + sin(x.y * 0.05) * 2.0), cos(x.y * 0.17 + sin(x.x * 0.043) * 2.4)) * 0.10 * fFold * (1.0 - river);
  pale += 0.035 * fw * (1.0 - river);
  // the river: the same plastic, glossier, with moulded ripple ridges that do not flow but catch the light
  float rp = sin(x.y * 1.3 + sin(x.x * 0.35 + x.y * 0.11) * 2.2) * 0.5 + sin(x.y * 0.47 + x.x * 0.3) * 0.5;
  off += vec2(0.12, 1.0) * rp * 0.42 * river * clamp(1.0 - px / 4.0, 0.0, 1.0);
  N = normalize(N + vec3(off.x, 0.0, off.y));
  float ndl = dot(N, uSun); float wrap = clamp((ndl + 0.6) / 1.6, 0.0, 1.0);
  // the valley sides are a deeper plastic than the floor, so the pale parts and the clear wings stand against them
  float wallM = (1.0 - floorM0) * land;
  vec3 col = mix(mix(vCol, uDeep, 0.55 * wallM * (1.0 - 0.7 * dz)), uPale, clamp(pale, 0.0, 0.85)) * (1.0 - 0.34 * wallM * (1.0 - 0.6 * lip));
  col = mix(col, vCol * 0.88, river * 0.6) * (1.0 - dark) * (1.0 + 0.10 * panel);
  // down the dark valley the key cools and weakens, so both walls stay in one slate family; the shade is a blue of its own
  // the avenue lies in the warmest of the light, the open floor in the plain key
  vec3 keyG = mix(uKey * 1.05 * mix(vec3(1.0), vec3(1.15, 1.0, 0.76), 1.0 - smoothstep(170.0, 330.0, vW.z)), uFill * 0.98 + vec3(0.03, 0.02, 0.05), 0.35 * dz);
  vec3 fillG = uFill * vec3(0.78, 0.92, 1.16);
  float castS = max(frameShade(vW), hullShade(vW)) * land;
  float lit = smoothstep(-0.12, 0.62, ndl) * (1.0 - 0.85 * uCast * shd * (1.0 - lip)) * (1.0 - 0.8 * uCast * castS);
  vec3 body = col * (mix(fillG * (0.48 + 0.12 * N.y), keyG, lit) + uKey * 0.06 * (1.0 - N.y) * (1.0 - lit));
  body += (vec3(0.038, 0.034, 0.038) + col * 0.11) * (1.0 - lit);       // light thrown back from the lit side under every shade: the shadow side keeps its moulding, a slate navy, never black
  vec3 H = uSun + V; float hl = length(H); H = hl > 1e-4 ? H / hl : N;
  float nh = clamp(dot(N, H), 0.0, 1.0); float nv = clamp(dot(N, V), 0.0, 1.0);
  float s2 = nh * nh; float s4 = s2 * s2; float s10 = s4 * s4 * s2; float f = 1.0 - nv;
  float f3 = f * f * f;
  vec3 sheen = (0.12 + 0.5 * river) * s10 * uKey * (1.0 - 0.8 * uCast * shd) + (0.05 + 0.40 * river) * f3 * uSky;
  gl_FragColor = vec4(mix(body + sheen, uFogCol, 1.0 - exp(-uFogDen * uFogDen * dist * dist)), 1.0);
}`,go=`
varying vec3 vD;
void main() { vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,yo=`
uniform vec3 uZenith; uniform vec3 uHorizon; uniform vec3 uSun; uniform vec3 uKey; uniform float uGlow;
varying vec3 vD;
void main() {
  vec3 d = vD / max(length(vD), 1e-4);
  float t = clamp(d.y, 0.0, 1.0); t = 1.0 - (1.0 - t) * (1.0 - t) * (1.0 - t);
  vec3 col = mix(uHorizon, uZenith, t);
  float sd = clamp(dot(d, uSun), 0.0, 1.0); float s2 = sd * sd; float s8 = s2 * s2 * s2 * s2; float s32 = s8 * s8 * s8 * s8;
  col += uKey * uGlow * (0.02 * s2 + 0.06 * s8 + 0.22 * s32 * s32);          // the sun is a soft bright place in the sky, never a disc
  gl_FragColor = vec4(col, 1.0);
}`,wo=`
attribute vec3 iPos; attribute vec4 iSz; attribute vec4 iOrb;
uniform float uTime; uniform float uU; uniform vec3 uSun;
varying vec2 vUv; varying float vK; varying float vDist; varying vec3 vW;
void main() {
  vec3 c = iPos;
  if (iOrb.x > 0.0) { float a = iOrb.w + uTime * iOrb.z; c.x += cos(a) * iOrb.x; c.z += sin(a) * iOrb.y; }
  else if (iOrb.y != 0.0) c.xz += vec2(sin(iSz.z), cos(iSz.z)) * iOrb.y * clamp(uU - iOrb.z, -1.0, iOrb.w);       // under a walker
  float cr = cos(iSz.z), sr = sin(iSz.z);
  vec2 q = position.xz * iSz.xy; q = vec2(cr * q.x + sr * q.y, -sr * q.x + cr * q.y);
  vec2 D = -uSun.xz / max(length(uSun.xz), 1e-3); float len = min(iSz.x, iSz.y) * clamp(0.75 / max(uSun.y, 0.2), 0.3, 2.6) * (iSz.w < 0.0 ? 0.0 : 1.0);
  vec3 w = c + vec3(q.x, 0.0, q.y); w.xz += D * (len * step(0.0, dot(q, D)) + min(iSz.x, iSz.y) * 0.3);      // each shadow is drawn out away from the sun
  vUv = position.xz; vK = abs(iSz.w) * (iSz.w < 0.0 ? smoothstep(iPos.y, iPos.y + 0.004, uU) : 1.0);
  if (iSz.w < 0.0) w.y = 0.12;
  vDist = distance(cameraPosition, w); vW = w;
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
}`,bo=`
uniform vec3 uShadow; uniform float uFogDen; uniform vec3 uSun; uniform float uCast;
varying vec2 vUv; varying float vK; varying float vDist; varying vec3 vW;
${Aa}
void main() {
  float d = clamp((1.0 - length(vUv)) * 1.45, 0.0, 1.0); float f = uFogDen * vDist;
  float a = d * d * (3.0 - 2.0 * d) * vK * exp(-f * f) * (1.0 - 0.9 * uCast * sideShd(vW, uSun));
  vec3 F = mix(vec3(1.0), uShadow, a);
  gl_FragColor = vec4(F, 1.0 - 0.08 * a / max(F.b, 0.2));               // blended as dst * F + F * 0.08 a / F.b: see SHADE
}`,Mo=`
attribute vec4 aux;
varying vec2 vUv; varying vec4 vK; varying float vDist; varying vec3 vW;
void main() { vUv = uv; vK = aux; vW = position; vDist = distance(cameraPosition, position); gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0); }`,So=`
uniform vec3 uShadow; uniform float uFogDen; uniform float uCast; uniform vec3 uSun;
varying vec2 vUv; varying vec4 vK; varying float vDist; varying vec3 vW;
${Aa}
float h21(vec2 p) { p = fract(p * vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.y); }
void main() {
  vec2 cs = vec2(23.2 / max(vK.x, 1.0), 14.3 / max(vK.y, 1.0)); vec2 p = vec2(vUv.x + 11.6, vUv.y - 1.3);
  vec2 cell = floor(p / cs); vec2 f = p - (cell + 0.5) * cs;
  float blur = 0.3 + 0.07 * max(vUv.y, 0.0);
  float line = 1.0 - smoothstep(0.2, 0.2 + blur, min(abs(abs(f.x) - cs.x * 0.5), abs(abs(f.y) - cs.y * 0.5)));
  float inside = step(-0.3, p.x) * step(p.x, 23.5) * step(-0.3, p.y) * step(p.y, 14.6);
  float hh = h21(cell + vK.z * 17.0);
  float part = (1.0 - smoothstep(0.2, 0.2 + blur * 0.12, length(f / cs))) * step(0.2, hh);
  float fo = uFogDen * vDist;
  float a = max(0.85 * line, 0.9 * part) * inside * vK.w * uCast * exp(-fo * fo) * (1.0 - 0.9 * uCast * sideShd(vW, uSun));
  vec3 F = mix(vec3(1.0), uShadow, a);
  gl_FragColor = vec4(F, 1.0 - 0.08 * a / max(F.b, 0.2));
}`,Ao=`
attribute vec3 aUv;
varying vec3 vUv; varying float vDist;
void main() { vUv = aUv; vDist = distance(cameraPosition, position); gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0); }`,Fo=`
uniform float uFogDen; uniform float uStrength; uniform vec3 uTrA; uniform vec3 uTrB; uniform vec3 uAmber;
varying vec3 vUv; varying float vDist;
void main() {
  vec2 q = vUv.xy;                                           // x along the span 0..1, y across the chord -1..1
  float sx = clamp(q.x, 0.0, 1.0); float taper = 0.16 + 0.84 * sin(3.14159 * sqrt(sx) * (0.55 + 0.45 * sx));
  float m = smoothstep(0.0, 0.05, q.x) * (1.0 - smoothstep(0.78, 1.0, q.x)) * (1.0 - smoothstep(taper * 0.45, taper, abs(q.y)));    // a soft-edged pool
  float rib = smoothstep(0.55, 0.9, abs(sin(q.x * 31.4))) * 0.5 + smoothstep(0.8, 0.95, abs(q.y) / max(taper, 0.1)) * 0.5;
  float f = uFogDen * vDist; float a = m * uStrength * vUv.z * exp(-f * f);
#ifdef PATCH_ADD
  gl_FragColor = vec4(uAmber * (0.52 - 0.3 * rib) * a, 1.0);                       // light through clear plastic: brighter than the ground it falls on
#else
  vec3 T = mix(vec3(1.0), mix(uTrA, uTrB, rib) * 1.25, 0.55);
  gl_FragColor = vec4(mix(vec3(1.0), min(T, vec3(1.0)), a), 1.0);
#endif
}`,zo=`
attribute vec3 aVel; attribute vec4 aSeed;
uniform float uU; uniform float uTime; uniform float uPx; uniform vec3 uCam; uniform vec3 uWind; uniform float uBox;
varying float vA; varying float vRot;
void main() {
  vec3 p = position; float on = 1.0; float a = 0.0;
#ifdef WEATHER
  p += uWind * uTime * aSeed.w + vec3(sin(uTime * 0.6 + aSeed.z) * 1.5, 0.0, cos(uTime * 0.47 + aSeed.z * 1.7) * 1.5);
  p = uCam + mod(p - uCam + uBox * 0.5, vec3(uBox)) - uBox * 0.5;
  vec3 e = abs(p - uCam) / (uBox * 0.5);
  vA = (1.0 - smoothstep(0.75, 1.0, max(e.x, max(e.y, e.z)))) * 0.85;
#else
  float age = (uU - aSeed.x) / (0.05 * aSeed.w);
  on = step(0.0, age) * step(age, 1.0); a = clamp(age, 0.0, 1.0);
  p += aVel * (1.0 - exp(-3.5 * a)) * 1.4; p.y -= 7.0 * a * a;
  p.x += sin(uTime * 0.9 + aSeed.z) * 0.6 * a; p.z += cos(uTime * 0.7 + aSeed.z * 1.7) * 0.6 * a;
  vA = on * smoothstep(0.0, 0.04, a) * (1.0 - a * a);
#endif
  vec4 mv = viewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = on * clamp(aSeed.y * uPx / max(-mv.z, 1.0), 1.5, 36.0);
  if (on < 0.5) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
  vRot = aSeed.z + uTime * (1.2 + aSeed.w);
}`,ko=`
uniform vec3 uKey;
varying float vA; varying float vRot;
void main() {
  vec2 q = gl_PointCoord - 0.5; float c = cos(vRot), s = sin(vRot);
  q = vec2(c * q.x - s * q.y, s * q.x + c * q.y);
  float d = abs(q.x) * 1.2 + abs(q.y) * 2.6;
  float m = 1.0 - smoothstep(0.32, 0.5, d);
  if (m * vA < 0.01) discard;
  gl_FragColor = vec4(vec3(0.84, 0.82, 0.78) * uKey, m * vA * 0.9);
}`,pt=1,Po=3,Fa=4;function T0(s,u,p,M,w){const d=s.part;s.part=pt,s.lathe([u,p,M],[0,1,0],[[w,-w*.3,1],[0,w*.8,1]],3),s.part=d}function dt(s,u,p,M,w,d,y,k=0,P=[.3,.62],O=0,a0=null,i0=.16){s.part=0;const n0=_=>{const W=t0(_,.001,.999);return Math.pow(Math.sin(Math.PI*Math.pow(W,w)),.6)*(1+k*Math.exp(-((W-.2)*(W-.2))/.01))};s.grid(y,d,(_,W,i)=>{const U=(_-.5)*Math.PI,R0=n0(W);return i[0]=Math.cos(U)*p*R0,i[1]=Math.sin(U)*M*R0,i[2]=(W-.5)*u,_<.01||_>.99?1:0});for(const _ of P){const W=n0(_),i=(_-.5)*u;s.grid(y,1,(U,R0,K)=>{const m0=(U-.5)*Math.PI,x0=R0?1:.55;return K[0]=Math.cos(m0)*p*W*x0,K[1]=Math.sin(m0)*M*W*x0,K[2]=i,.5})}if(s.lathe([0,0,u*.12],[-1,0,0],[[p*.1,0,0],[p*.07,p*.5,.6]],3),O>.2&&(s.part=Fa),O)for(const _ of[1,-1])s.grid(1,d,(W,i,U)=>{const R0=.1+.8*i,K=n0(R0);return U[0]=W*p*O*.6,U[1]=_*M*K*(1+O*(1-W)),U[2]=(R0-.5)*u,1});if(s.part=0,a0)for(const _ of a0){const W=n0(_),i=.42,U=p*.2;s.part=Po,s.lathe([Math.cos(i)*p*W*.97,Math.sin(i)*M*W*.97,(_-.5)*u],[Math.cos(i)*M,Math.sin(i)*p,0],[[U,0,0],[U,U*.6,0],[0,U*.9,0]],5),s.part=0}if(i0>.2){const W=n0(.47),i=[Math.cos(-.3)*p*W*.985,Math.sin(-.3)*M*W*.985,-u*.03],U=[Math.cos(-.3)*M,Math.sin(-.3)*p,0];s.part=Fa,s.lathe(i,U,[[p*i0*1.35,0,0],[p*i0*1.1,.03,0],[0,.03,0]],6),s.part=pt,s.lathe(i,U,[[p*i0*.8,.03,1],[p*i0*.5,.1,1],[0,.1,1]],5),s.part=0}else T0(s,p*n0(.5)*.98,0,0,p*i0)}function za(s,u,p,M=[]){s.part=0;const w=new v.Matrix4().makeRotationX(Math.PI/2);s.m=w,xe(s,u.map(d=>[d[0],d[1]]),-p,p,p*.8,1),s.m=null;for(const d of M)s.lathe([d[0],p,d[1]],[d[2]-d[0],0,d[3]-d[1]],[[p*1.4,0,.6],[p*1.1,Math.hypot(d[2]-d[0],d[3]-d[1]),.6]],3)}function Ro(s){za(s,[[.05,-.42],[.95,-.62],[2.05,-.2],[1.25,.5],[.05,.4]],.035,[[.1,-.1,1.9,-.12],[.1,.18,1.3,.3]]),s.lathe([0,0,-.42],[0,0,1],[[.09,0,0],[.09,.84,0]],3),T0(s,1,.03,.42,.07)}function qo(s){const u=[[.1,-.24,1.7,-.34],[.1,-.02,1.95,-.14],[.1,.18,1.55,.24],[.1,.32,1.1,.42]],p=.035;za(s,[[.05,-.42],[.95,-.62],[2.05,-.2],[1.25,.5],[.05,.4]],p,u);for(const M of u)s.lathe([M[0],-p,M[1]],[M[2]-M[0],0,M[3]-M[1]],[[p*1.5,0,.6],[p*1.1,Math.hypot(M[2]-M[0],M[3]-M[1]),.6]],3);s.lathe([0,0,-.5],[0,0,1],[[0,0,.5],[.17,.02,0],[.17,.1,0],[.09,.12,0],[.09,.88,0],[.17,.9,0],[.17,.98,0],[0,1,.5]],6),T0(s,1,.03,.44,.09),T0(s,1.5,.03,-.42,.07)}function ka(s){s.part=0;const u=new v.Matrix4().makeRotationY(Math.PI/2);s.m=u,xe(s,[[0,0],[-.25,.75],[-.75,.85],[-.95,.1],[-.6,-.08]],-.03,.03,.025,1),s.m=null,T0(s,0,.85,.5,.06)}function Co(s){ka(s);for(const u of[.03,-.03])s.lathe([u,.05,.15],[0,.72,.45],[[.045,0,.6],[.03,.8,.6]],3);T0(s,0,.87,.72,.11)}function Do(s){s.part=0;const u=[[0,.85],[.6,.62],[3.2,.5],[6.4,.38],[9.4,.24]];s.grid(4,u.length-1,(p,M,w)=>{const d=Math.round(M*(u.length-1)),y=(p-.5)*Math.PI;return w[0]=Math.cos(y)*u[d][1],w[1]=u[d][0],w[2]=Math.sin(y)*u[d][1],p<.01||p>.99?1:0}),s.lathe([0,9.4,0],[0,1,0],[[.13,0,0],[.1,1.2,.5]],3),T0(s,.52,3,0,.12)}function Eo(s){s.part=0;const u=[[.13,.36,.4],[.62,.24,0],[1,-.08,1],[.5,.06,0],[.13,.22,.4]];s.grid(6,u.length-1,(p,M,w)=>{const d=Math.round(M*(u.length-1)),y=p*E,k=1+.06*Math.cos(y*4)*u[d][0];return w[0]=Math.cos(y)*u[d][0]*k,w[1]=u[d][1],w[2]=Math.sin(y)*u[d][0]*k,u[d][2]},!0),T0(s,.985,-.03,0,.05)}function To(s){s.part=0,s.lathe([-.28,0,0],[1,0,0],[[0,0,0],[.6,.05,.5],[.6,.5,.5],[0,.56,0]],6),s.lathe([0,0,0],[.06,-1,.02],[[.3,0,0],[.26,2.4,0],[.34,3.4,0],[.14,6.5,0],[.48,6.95,.8],[0,7,1]],4),T0(s,.3,-2,0,.1)}function No(s){s.part=0,s.lathe([-2.2,.12,0],[1,0,0],[[0,-.1,.5],[.13,0,0],[.13,4.4,0],[0,4.5,.5]],3);for(let u=0;u<9;u++){const p=-2+u*.5,M=2+.9*Math.sin(u*2.3+1);s.grid(1,1,(w,d,y)=>(y[0]=p+(w-.5)*.2*(1-d*.7),y[1]=.12+d*M,y[2]=d*.22,.7))}}function Pa(s,u,p){s.part=0,s.m=new v.Matrix4().makeScale(p,1,1),s.lathe([-.5,.3,0],[1,0,0],[[0,0,1],[.24,0,1],[.3,.03,.2],[.3,.97,.2],[.24,1,1],[0,1,1]],6),u&&s.lathe([.1,.3,0],[0,.25,1],[[.26,0,0],[.24,.22,.2],[.18,.25,1],[0,.25,1]],6),s.part=pt,s.lathe([.5,.3,0],[1,0,0],[[.2,-.002,1],[0,.012,1]],6),s.part=0,s.m=null}const Ke=(s,u,p)=>new v.Quaternion().setFromRotationMatrix(new v.Matrix4().makeBasis(b(...s),b(...u),b(...p))),vt=Ke([0,0,1],[1,0,0],[0,1,0]),Oo=Ke([0,0,1],[0,-1,0],[1,0,0]),le=Ke([1,0,0],[0,0,1],[0,-1,0]),Wo=Ke([0,0,1],[0,1,0],[-1,0,0]),Ho=new v.Quaternion,re=-va/2+.4,Ra=va/2-.4,ie=1.3,mt=ht-.4;function xt(s,u,p){const M=(Ra-re)/s,w=(mt-ie)/u,d=[];for(let y=0;y<u;y++)for(let k=0;k<s;k++)p(d,re+(k+.5)*M,ie+(y+.5)*w,M,w,k,y);return{nx:s,ny:u,cw:M,ch:w,slots:d}}const qa=xt(4,3,(s,u,p,M,w,d,y)=>{const k=y*4+d,P=p+w/2,O=p-w/2;s.push({part:"body",cell:k,k:0,x:u-2,y:p,q:vt,gates:[[u-2,P,u-2,p+1.28]]}),s.push({part:"body",cell:k,k:1,x:u-.9,y:p,q:vt,gates:[[u-.9,O,u-.9,p-1.28]]}),s.push({part:"wing",cell:k,k:2,x:u+.1,y:p+1.25,q:le,gates:[[u+1,P,u+1,p+1.8]]}),s.push({part:"wing",cell:k,k:3,x:u+.1,y:p-1.25,q:le,gates:[[u+1.1,O,u+1.1,p-1.72]]}),s.push({part:"vane",cell:k,k:4,x:u+1.9,y:p-.4,q:Wo,gates:[[u+M/2,p,u+1.92,p]]})}),gt=[3.3,2.6,1.9],yt=xt(3,2,(s,u,p,M,w,d,y)=>{const k=gt[d];s.push({part:"tier",cell:y,k:d,x:u,y:p,q:le,gates:[[u,p+w/2,u,p+k*.99],[u,p-w/2,u,p-k*.99]]})}),ge=xt(4,2,(s,u,p,M,w,d,y)=>{const k=d>>1,P=p+w/2,O=p-w/2;if(y===1)s.push({part:"gbody",cell:k,k:d&1,x:u,y:p,q:Oo,gates:[[u-1.2,P,u-1.2,p+.95],[u+1.2,O,u+1.2,p-.95]]});else{for(const a0 of[-1,1])s.push({part:"leg",cell:k,k:2+(d&1)*2+(a0>0?1:0),x:u+a0*1.5,y:p+1.6,q:Ho,gates:[[u+a0*1.5,P,u+a0*1.5,p+1.75]]});s.push({part:"ghead",cell:k,k:6+(d&1),x:u,y:p-.6,q:vt,gates:[[u,O,u,p-1.75]]})}});function Bo(s,u,p){s.part=-1;const M=ma,w=(d,y,k,P,O,a0)=>{const i0=Math.hypot(k-d,P-y),n0=[[0,-O*.5,.4]];for(let _=0;_<=a0;_++)n0.push([O,_/a0*i0,0]);n0.push([0,i0+O*.5,.4]),s.lathe([d,y,0],[(k-d)/i0,(P-y)/i0,0],n0,5)};for(let d=0;d<=u.nx;d++){const y=re+d*u.cw;w(y,ie,y,mt,d===0||d===u.nx?M:M*.8,2)}for(let d=0;d<=u.ny;d++){const y=ie+d*u.ch;w(re,y,Ra,y,d===0||d===u.ny?M:M*.8,1)}for(let d=0;d<=u.nx;d+=u.nx)for(let y=0;y<=u.ny;y+=u.ny){const k=re+d*u.cw,P=ie+y*u.ch,O=M*2.5,a0=M*1.3;s.lathe([k,P,0],[0,0,1],[[0,-a0,0],[O,0,.4],[0,a0,0]],6)}for(const d of u.slots)for(const y of d.gates){const k=[y[2]-y[0],y[3]-y[1],0],P=Math.hypot(k[0],k[1]);s.lathe([y[0],y[1],0],k,[[M*.75,0,0],[M*.2,P,1]],3)}for(let d=0;d<u.nx;d++){const y=re+(d+.5)*u.cw+u.cw*.36,k=mt-.62;xe(s,[[y-.6,k-.3],[y+.6,k-.3],[y+.6,k+.3],[y-.6,k+.3]],-.05,.05,.04,.7);for(let P=0;P<3;P++){const O=y-.36+P*.36;p.chance(.45)?s.lathe([O-.11,k,.07],[1,0,0],[[.045,0,0],[.045,.22,0]],3):s.lathe([O,k,.04],[0,0,1],[[.07,0,0],[0,.06,.5]],3)}}s.part=2;for(const d of[-7.5,7.5])s.m=new v.Matrix4().makeTranslation(d,0,0).multiply(new v.Matrix4().makeScale(2.2,1,1.5)),s.lathe([0,0,0],[0,1,0],[[.9,0,.5],[.95,.12,.8],[.62,.42,0],[.3,.9,0],[.12,ie,0]],7),s.m=null;s.part=-1}const Ca=[["iHomeP",3],["iHomeQ",4],["iDockP",3],["iDockQ",4],["iCre0",4],["iCre1",4],["iRel",4],["iJoint",4],["iCol",3],["iFlex",4],["iGap",3]],Z0=[["iPos",3],["iQuat",4],["iCol",3],["iFx",4]];class N0{constructor(u){this.attrs=u,this.data=u.map(()=>[]),this.count=0}push(...u){for(let p=0;p<u.length;p++){const M=this.data[p],w=u[p];for(let d=0;d<w.length;d++)M.push(w[d])}this.count++}mesh(u,p,M=0){const w=new v.InstancedBufferGeometry;w.index=u.index;for(const y of["position","normal","aux"])w.setAttribute(y,u.attributes[y]);this.attrs.forEach(([y,k],P)=>w.setAttribute(y,new v.InstancedBufferAttribute(new Float32Array(this.data[P]),k))),w.instanceCount=this.count;const d=new v.Mesh(w,p);return d.frustumCulled=!1,d.renderOrder=M,d.matrixAutoUpdate=!1,d}}const O0=s=>[s.x,s.y,s.z,s.w],V0=s=>new v.Quaternion().setFromAxisAngle(b(0,1,0),s),_o=[{name:"oxblood, sand, sea-grey, olive and clear amber",pal:["#E8E0CF","#93A6AA","#8E3B32","#F0A94A","#7C8455","#DDE9EA","#5C6B73"],trA:[1,.64,.23],trB:[.9,.4,.09],hot:[1,.22,.02],portal:"#FFF4E0"},{name:"navy, bone, brick and clear smoke",pal:["#E9E3D6","#9AA3AE","#2F4A78","#8F84BE","#B25A40","#E2E6EA","#4E5A6E"],trA:[.64,.6,.8],trB:[.29,.25,.47],hot:[1,.7,.8],portal:"#F2F6FF",land:3.1},{name:"pistachio, cream, coral and clear rose",pal:["#F1E7CE","#A2B3AE","#D4705C","#F590A8","#8FB58A","#E6EEE6","#5E7272"],trA:[1,.66,.74],trB:[.9,.34,.5],hot:[1,.25,.4],portal:"#FFF2F0"}],Qo=[{name:"raking morning sun",sun:[-.45,.41,.79],key:"#FFE7BE",fill:"#AFC3E6",zen:"#5E93D0",hor:"#EDD3A6",glow:1.7,fire:.95,shadow:1,patch:1,keyK:1.08},{name:"low gold sun on the starboard bow",sun:[-.507,.292,.811],key:"#FFD49A",fill:"#A6B4DC",zen:"#7C9CD6",hor:"#F5CDA2",glow:2.3,fire:1.25,shadow:1,patch:1.15,keyK:1.32},{name:"a silver sun through sea haze",sun:[-.38,.52,.765],key:"#FFF4DA",fill:"#A6C2D2",zen:"#6A9FB8",hor:"#CFE0CE",glow:1.2,fire:.85,shadow:.95,patch:.9,keyK:1.12}];var Lo={id:"still-on-the-sprue",name:"Still on the Sprue",category:"bizarre",weirdness:.9,media:["air","open"],async build(s){const u=s.rng,p=s.quality&&s.quality.detail||1,M=s.vary||{},w=t0(M.density||1,.7,1.3),d=u.chance(.4)?0:u.int(1,2),y=_o[d];let k=u.chance(.45)?0:u.int(1,2);M.hour==="day"?k=0:M.hour==="golden"||M.hour==="dawn"?k=1:M.hour==="night"&&(k=2);const P=Qo[k],O=u.int(0,2),a0=Math.round(B(110,200,u())*(.5+.5*p)),i0=u.int(8,14),n0=u.chance(.5)?20:40,_=u.chance(.1)?2:4,W=!!M.rare,i=u.fork("place"),U=y.pal,R0=U.map(da),[K,m0,x0,wt,X,ce,Ve]=R0,A0=b(...P.sun).normalize(),g0=new v.Scene,ye=ga(P.hor),bt=31e-5*(k===2?1.3:1);g0.fog=new v.FogExp2(ye,bt),g0.background=ye.clone();const Mt=new v.Color(P.key).multiplyScalar(P.keyK),R={uSun:{value:A0.clone()},uKey:{value:Mt},uFill:{value:new v.Color(P.fill)},uSky:{value:new v.Color("#D6E4EA")},uFogCol:{value:ye.clone()},uFogDen:{value:bt},uPix:{value:.0027},uPx:{value:400},uU:{value:0},uTime:{value:0},uFlex:{value:O===1?2:.9},uScar:{value:new v.Color().setRGB(...f0(ce,[.9,.88,.84],.5))},uPin:{value:b(...x0.map(e=>e*.85))},uRareP:{value:b(0,-500,0)},uRareQ:{value:new v.Vector4(0,0,0,1)},uAmber:{value:new v.Color(U[3])},uTrA:{value:b(...y.trA)},uTrB:{value:b(...y.trB)},uHot:{value:b(...y.hot)},uFire:{value:P.fire},uPale:{value:new v.Color(U[5])},uShadow:{value:new v.Color("#5E76B6")},uStrength:{value:.75*P.patch},uZenith:{value:ga(P.zen)},uHorizon:{value:ye.clone()},uGlow:{value:P.glow},uDarkZ:{value:new v.Vector2(740,1030)},uCast:{value:P.shadow},uDeep:{value:b(.2,.25,.3)},uFrP:{value:b(0,0,0)},uFrX:{value:b(1,0,0)},uFrN:{value:b(0,0,1)},uHullP:{value:b(0,500,0)},uHullA:{value:b(0,0,1)},uHullK:{value:0},uCam:{value:b(0,0,0)},uWind:{value:O===1?b(-5.5,-.5,1.5):O===2?b(-.6,-1.7,.2):b(-1.3,-.4,.5)},uBox:{value:90}},Da=new v.ShaderMaterial({uniforms:R,vertexShader:wa,fragmentShader:Ma,side:v.DoubleSide}),ue=new v.ShaderMaterial({uniforms:R,vertexShader:po,fragmentShader:Ma,side:v.DoubleSide}),Le={transparent:!0,depthWrite:!1,blending:v.CustomBlending,blendEquation:v.AddEquation,blendSrcAlpha:v.ZeroFactor,blendDstAlpha:v.OneFactor},St={...Le,blendSrc:v.DstColorFactor,blendDst:v.ZeroFactor},At={...Le,blendSrc:v.OneFactor,blendDst:v.OneFactor},Ft={...Le,blendSrc:v.OneMinusSrcAlphaFactor,blendDst:v.SrcColorFactor};await s.yield();const o0=730,we=956,H=co([[0,7,0],[0,7,70],[0,7,140],[0,7.5,200],[0,8.6,255],[0,11,305],[0,19,360],[0,28.5,415],[0,34,455],[0,37,490],[0,54,565],[0,64,630],[0,67,680],[0,68,o0],[0,65,772],[2,50,835],[10,32,890],[20,19.5,932],[28.4,13.5,we],[41.3,13,1004.3],[56.9,13,1062.2],[72.4,13,1120.2]]);await s.yield();const Ea=e=>t0(H.nearestXZ(.2589*Math.max(0,e-850),e).u,0,1),je=new Float32Array(141);for(let e=0;e<=140;e++)je[e]=Ea(e*10);const h0=e=>{const t=t0(e/10,0,139.999),a=t|0;return B(je[a],je[a+1],t-a)};await s.yield();const zt=2,$0=.25,kt=.05,J0=Math.ceil(H.length/$0)+1,W0=new Float64Array(J0*3);for(let e=0,t=b(0,0,0);e<J0;e++)H.posAtDist(Math.min(H.length,e*$0),t),W0[e*3]=t.x,W0[e*3+1]=t.y,W0[e*3+2]=t.z;const Ta=(e,t,a,o,n,c=0,l=J0)=>{const r=[];for(let f=0;f<e.length;f+=3)for(let x=c;x<l;){const m=W0[x*3]-e[f],A=W0[x*3+1]-e[f+1],g=W0[x*3+2]-e[f+2],F=m*a+A*o+g*n,S=Math.sqrt(Math.max(0,m*m+A*A+g*g-F*F));if(S<t){const C=Math.sqrt(t*t-S*S);F+C>0&&r.push([F-C,F+C])}x+=Math.max(1,Math.floor((S-t)/$0))}r.sort((f,x)=>f[0]-x[0]);let h=0;for(const f of r){if(f[0]>=h)break;f[1]>h&&(h=f[1])}return h};await s.yield();const y0=new v.Quaternion().setFromUnitVectors(b(.643,0,-.766).normalize(),b(0,0,1)),L0=b(0,0,o0).sub(b(40.2,0,0).applyQuaternion(y0)),Pt=y0.clone().invert(),be=e=>e.clone().sub(L0).applyQuaternion(Pt),s0=[[0,0],[.29,.2],[h0(o0-215),.515],[h0(o0-150),.564],[h0(o0-105),.61],[h0(o0-70),.64],[h0(o0-8),.682],[1,1]],F0=e=>{for(let t=0;t<s0.length-1;t++)if(e<=s0[t+1][0])return B(s0[t][1],s0[t+1][1],(e-s0[t][0])/Math.max(s0[t+1][0]-s0[t][0],1e-5));return 1},Na=e=>{for(let t=0;t<s0.length-1;t++)if(e<=s0[t+1][1])return B(s0[t][0],s0[t+1][0],(e-s0[t][1])/Math.max(s0[t+1][1]-s0[t][1],1e-5));return 1},Oa=[[.29,-25,39,436,.2,.5],[.34,-25,43,460,.2,.5],[.37,-25,46,485,.2,.5],[.4,-25,49,518,.2,.5],[.43,-27,54,556,.2,.45],[.46,-35,63,618,.12,.25],[.48,-42,70,665,.05,.1],[.5,-47.4,75,705.8,0,0]],Xe=b(0,0,0),V=await uo(s,{palette:U,detail:p,wings:_,sunDir:A0.clone().applyQuaternion(Pt),slip:Oa.map(e=>[F0(e[0]),...be(b(e[1],e[2],e[3])).toArray(),e[4],e[5]]),partVia:(e,t,a,o,n)=>{const c=Na(o),l=H.pointAt(c);return Xe.copy(H.pointAt(Math.min(1,c+.004))).sub(l).normalize(),e==="shell"?be(l.addScaledVector(Xe,46).add(b(8+4*Math.sin(t*1.7)+a*3,9+2*(t%3),0))).toArray():be(l.addScaledVector(Xe,15+t%3).add(b(4+t%2,t0((n.y-l.y)*.25,-4,5)+2,0))).toArray()},flight:[[.625,61,75,49],[.637,66,108,40],[.647,76,142,15],[.6565,95,152,0],...[[.618,-58,147,797],[.632,-52,139,838],[.66,-22,110,886],[.7,14,66,925],[.745,-40,45,956],[.79,-32,33,990],[.84,22,32,1046],[.88,64,30,1102],[.94,92,76,1205],[1,125,170,1330]].map(e=>[F0(e[0]),...be(b(e[1],e[2],e[3])).toArray()])]});V.object.position.copy(L0),V.object.quaternion.copy(y0),g0.add(V.object),V.setSun(A0,Mt,R.uFill.value),V.uniforms.uTrA.value.copy(R.uTrA.value),V.uniforms.uTrB.value.copy(R.uTrB.value),V.uniforms.uHot.value.copy(R.uHot.value),V.uniforms.uFire.value=P.fire,V.uniforms.uFlex.value=O===1?1.8:1;const G0=e=>e.clone().applyQuaternion(y0).add(L0);R.uFrP.value.copy(L0),R.uFrX.value.set(1,0,0).applyQuaternion(y0),R.uFrN.value.set(0,0,1).applyQuaternion(y0);const p0=G0(V.anchors.dock.position),Uo=G0(V.anchors.hole.position),q0=G0(b(-112,0,0)),C0=G0(b(112,0,0)),w0=V.anchors.flight.map(e=>[e.u,G0(e.position)]),ee=b(0,0,0),Me=e=>{if(V.bodyAt(e,ee))return ee.applyQuaternion(y0).add(L0);const t=w0.length-1;if(e<=w0[0][0])return ee.copy(w0[0][1]);if(e>=w0[t][0])return ee.copy(w0[t][1]);for(let a=0;a<t;a++)if(e<w0[a+1][0])return ee.lerpVectors(w0[a][1],w0[a+1][1],(e-w0[a][0])/(w0[a+1][0]-w0[a][0]));return ee};await s.yield();const Se=s.noise,H0=e=>37+15*Math.sin(e*.011+1)+6*Math.sin(e*.029),Rt=e=>N(150,235,e)*(1-N(560,640,e)),Y=e=>.2589*Math.max(0,e-850),B0=e=>B(250,105,N(760,1090,e)),D0=(e,t,a,o)=>{const n=o.x-a.x,c=o.z-a.z,l=t0(((e-a.x)*n+(t-a.z)*c)/(n*n+c*c),0,1);return Math.hypot(e-a.x-n*l,t-a.z-c*l)},Ae=e=>Y(e)-37-9*Math.sin(e*.013+2),Wa=e=>N(o0+45,o0+120,e)*(1-N(1190,1270,e)),l0=(e,t)=>Math.max(Rt(t)*(1-N(8.5,13.5,Math.abs(e-H0(t)))),Wa(t)*(1-N(6.5,10.5,Math.abs(e-Ae(t))))),Ha=[18,24,27,30,14],Fe=e=>Math.max(e*.04,5),_0=(e,t,a,o)=>Math.max(a*.44,58)+e*Math.max(a*.15,19)+Math.max(a*.04,4.5)*(Math.sin(t*.0105+e*2.1+o*1.3)+.6*Math.sin(t*.0231+e*4.3+1-o*.7));function J(e,t){const a=Y(t),o=e>=a?1:-1,n=Math.abs(e-a),c=B0(t);let l=1.2+.9*Se.fbm2(e*.011,t*.011,3)+.5*Math.sin(e*.047+t*.021)*Math.sin(t*.033);const r=_0(0,t,c,o);if(n>r){const h=Fe(c),f=_0(4,t,c,o)+h;l+=.055*(Math.min(n,f)-r)-.12*Math.max(0,n-f);for(let x=0;x<5;x++)l+=Ha[x]*(1+.14*Math.sin(t*.0068+x*1.7+o*2))*N(0,h,n-_0(x,t,c,o))}return l=B(.25,l,N(14,55,n)),l=B(0,l,N(9,42,D0(e,t,q0,C0))),l-=1.7*l0(e,t),l}const Ye=(e,t)=>{const a=.3*e[0]+.55*e[1]+.15*e[2];return e.map(o=>Math.max(0,a+(o-a)*t))},Ze=xa(Ye(m0.map(e=>e*.62),y.land||2.3).map((e,t)=>e*[1,1.03,.95][t])).map(e=>e/.94),ze=Ye(Ve.map(e=>e*.86),1.3);R.uDeep.value.set(...Ye(Ve.map(e=>e*.62),1.5));const b0=new Ie;{const a=b0.count,o=112/2,n=new Float32Array(o+1),c=(l,r,h)=>{const f=Fe(r),x=_0(0,l,r,h),m=[[0,0],[14,Math.min(r*.2,x*.5)]];for(let g=0;g<5;g++){const F=Math.max(_0(g,l,r,h),m[m.length-1][1]+1.5);m.push([22+g*5,F],[24+g*5,F+f])}const A=m[m.length-1][1];for(let g=1;g<=o-44;g++)m.push([44+g,B(A,470,Math.pow(g/(o-44),1.7))]);return m};for(let l=0;l<=112;l++){const r=-180+l/112*1760,h=Y(r),f=B0(r),x=.92*N(o0-260,o0+300,r),m=f0(Ze,ze,x);for(let A=0;A<=112;A++){const g=A>=o?1:-1,F=Math.abs(A-o);if(A===0||A===o){const D=c(r,f,g);for(let T=0;T<D.length-1;T++)for(let Z=D[T][0];Z<=D[T+1][0];Z++)n[Z]=B(D[T][1],D[T+1][1],(Z-D[T][0])/(D[T+1][0]-D[T][0]))}const S=h+g*n[F],C=J(S,r);b0.P.push(S,C,r),b0.C.push(m[0],m[1],m[2]),b0.A.push(t0(.05+.05*Se.n2(S*.02,r*.02),0,1)*(1-x*.85),l0(S,r))}await s.yield()}for(let l=0;l<112;l++)for(let r=0;r<112;r++){const h=a+l*113+r;b0.quad(h,h+112+1,h+112+2,h+1)}await s.yield();for(let l=0;l<5;l++){const r=1270+l*105,h=62+l*34,f=f0(f0(Ze,ze,.8),ze.map(g=>g*.8),l/4),x=b0.count,m=44,A=[[0,-6,.04],[.55,10,.08],[.9,30,.14],[1,58,.5],[.86,95,.2]];for(let g=0;g<A.length;g++)for(let F=0;F<=m;F++){const S=-520+F/m*1180,C=h*(.62+.38*Se.n2(S*.0035+l*9.1,l*3.3)+.12*Se.n2(S*.011,l*5.7))*(.55+.45*N(0,260,Math.abs(S-95-l*12)));b0.P.push(S,A[g][0]*C+(g?0:-6),r+A[g][1]),b0.C.push(f[0],f[1],f[2]),b0.A.push(A[g][2],-1)}for(let g=0;g<A.length-1;g++)for(let F=0;F<m;F++){const S=x+g*(m+1)+F;b0.quad(S,S+m+1,S+m+2,S+1)}}}await s.yield();const $e=new v.Mesh(await b0.buildSteps(s),new v.ShaderMaterial({uniforms:R,vertexShader:mo,fragmentShader:xo}));$e.frustumCulled=!1,$e.matrixAutoUpdate=!1,g0.add($e),await s.yield();const ke=new v.Mesh(new v.SphereGeometry(3e3,24,12),new v.ShaderMaterial({uniforms:R,vertexShader:go,fragmentShader:yo,side:v.BackSide,depthWrite:!1,depthTest:!1}));ke.renderOrder=-1,ke.frustumCulled=!1,g0.add(ke),await s.yield();const d0=new Ie;d0.part=2;for(const e of[1,-1]){const t=n=>{const c=B0(n),l=Fe(c),r=_0(4,n,c,e),h=Y(n),f=h+e*(r+l*.95);return[f,J(f,n),n,h+e*(r+l+16)]};for(let n=-170;n<1270;n+=208){if(e<0&&n>420&&n<880)continue;const c=t(n),l=t(n+208),r=[c[3],152,n],h=[l[3],152,n+208];d0.rod(r,h,3.3,6),d0.lathe(r,[0,0,1],[[0,-2.8,0],[6,-2,.4],[6,2,.4],[0,2.8,0]],10),d0.lathe(r,[0,1,0],[[2.6,0,0],[2.2,9,0],[1.2,12,1],[0,12.6,1]],7);for(const f of[.27,.76]){const x=n+f*208,m=t(x),A=[B(r[0],h[0],f),152,x],g=[m[0]-A[0],m[1]-A[1],0],F=Math.hypot(g[0],g[1]);d0.lathe(A,g,[[3.4,0,0],[2.6,F*.3,0],[1.3,F*.8,.3],[.8,F+.8,1]],6)}{const x=B(r[0],h[0],.52),m=n+.52*208,A=Math.atan2(h[0]-r[0],208);d0.rod([x,152,m],[x,145,m],1.1,6),d0.m=new v.Matrix4().makeTranslation(x,152-12.5,m).multiply(new v.Matrix4().makeRotationY(A-Math.PI/2)),xe(d0,pa(0,0,30,11,1.6,2),-.9,.9,.6,.7);for(let g=0;g<4;g++)for(const F of[-1,1]){const S=-10.5+g*7;(g+(n/208|0)+(e>0?1:0))%3?d0.rod([S-2,0,F*1],[S+2,0,F*1],1,4):d0.lathe([S,0,F*.8],[0,0,F],[[1.7,0,0],[0,1.1,.5]],5)}d0.m=null}}await s.yield()}const qt=new N0(Z0);qt.push([0,0,0],[0,0,0,1],f0(Ze,ze,.4),[0,9,0,1]);const Ct={fly:new N0(Z0),tree:new N0(Z0),beast:new N0(Z0)},Dt={fly:qa,tree:yt,beast:ge},Pe={};for(const e of["body","wing","vane","trunk","tier","gbody","leg","reed","ebody","ewing","evane"])Pe[e]=new N0(Ca);const Re=new N0(Ca),qe=[new N0(Z0),new N0(Z0)],Q0={p:[],s:[],o:[],n:0},c0=(e,t,a,o,n,c,l,r)=>{Q0.p.push(e,t,a),Q0.s.push(o,n,c,l*P.shadow),Q0.o.push(...r||[0,0,0,0]),Q0.n++},Et=[],Ce=[],Ba=new v.Quaternion().setFromAxisAngle(b(1,0,0),-Math.PI/2*.985),Je=[];function M0(e,t,a,o,n,c={}){const l=c.scale||1,r=J(t,a)-.12*l+(c.lie?.3*l:0),h=V0(o);c.lie&&h.multiply(Ba),c.lean&&h.multiply(new v.Quaternion().setFromAxisAngle(b(1,0,0),-c.lean));const f=i.range(0,E);Ct[e].push([t,r,a],O0(h),n,[f,c.topple??9,c.lie||c.lean?0:1,l]);const x=b(0,0,1).applyQuaternion(h);c.lie?c0(t-Math.sin(o)*8*l,r-.2,a-Math.cos(o)*8*l,15*l,11*l,o,.7):c.topple===void 0?c0(t,r+.2,a,13.5*l,2.6*l,o,.8):c0(t+Math.sin(o)*8*l,c.topple+.05,a+Math.cos(o)*8*l,14*l,10*l,o,-.5),c.topple!==void 0&&Et.push([t+Math.sin(o)*9*l,r+1.2,a+Math.cos(o)*9*l,c.topple+.052,5*l]);const m={kind:e,pos:b(t,r,a),q:h,sc:l,lie:!!c.lie,nx:x.x,nz:x.z,phase:f,col:n,yaw:o,stand:!c.lie&&c.topple===void 0,lean:c.lean||0};return Je.push(m),m}const z0=b(0,0,0);function Ge(e,t,a,o,n,c,l,r,h,f,x=1,m=[0,0,0],A=.45,g=.22){let F=[0,0,0],S=[0,0,0,1],C=[x,0,0,0];if(e){z0.set(t.x*e.sc,t.y*e.sc,0).applyQuaternion(e.q).add(e.pos),F=[z0.x,z0.y,z0.z],S=O0(e.q.clone().multiply(t.q));const D=Math.hypot(e.nx,e.nz);C=e.lie||D<.2?[x,0,e.phase,e.pos.y]:[e.nx/D*x,e.nz/D*x,e.phase,e.rigid?1e4:e.pos.y],l>0&&l<1&&H.distanceTo(z0.x,z0.y,z0.z)<70&&Ce.push([z0.x,z0.y,z0.z,l,x])}return[F,S,a,o,n,c,[l,r,A,g],h,f,C,m]}const q=(e,...t)=>Pe[e].push(...Ge(...t)),Q=-1,I=[0,0,0,0],L=[0,0,0,1],U0=O0(new v.Quaternion().setFromAxisAngle(b(0,0,1),Math.PI)),fe=O0(V0(Math.PI)),_a=2.42,Qa=3.53,De=16;function Ua(e,t,a){const o=zt+a+kt,n=o+De*$0/2;let c=J0,l=0;for(let x=0;x<J0;x+=De)Math.abs(W0[x*3]-e[0])<t[0]+n&&Math.abs(W0[x*3+2]-e[2])<t[1]+n&&(c=Math.min(c,x-De),l=x+De+1);if(l===0)return;c=Math.max(0,c),l=Math.min(J0,l);const r=Math.ceil(E*(Math.max(t[0],t[1])+2*e[3])/$0),h=new Float64Array(r*3);for(let x=0;x<r;x++){const m=x/r*E;h[x*3]=e[0]+Math.cos(m)*t[0],h[x*3+1]=e[1]+e[3]*Math.sin(m*2+t[3]*3),h[x*3+2]=e[2]+Math.sin(m)*t[1]}const f=Ta(h,o,0,1,0,c,l);f!==0&&(e[1]+=f)}const j0=[K,x0,f0(m0,ce,.25)];let Tt=0;function X0(e,t,a,o,n,c,l=!!c){const r=qa.slots,h=t*5,f=e?e.col:i.pick(j0),x=a.ph+i.range(-.5,.5),m=i.range(.82,1.15),A=c?c[0]:[a.x+i.range(-3,3),a.y+i.range(-2.5,2.5),a.z+i.range(-3,3),a.bob],g=c?c[1]:[a.rx*m,a.rz*m,a.sp*i.range(.92,1.08),x];!c&&o<1&&Ua(A,g,n*(o<0?_a:Qa));const F=[1,.55,i.range(6.5,8.5),i.range(0,E)],S=.5*n,C=l?"e":"",D=l?j0[(j0.indexOf(f)+1)%3]:f,T=l?j0[(j0.indexOf(f)+2)%3]:f;q(C+"body",e,r[h],[0,0,0],L,A,g,o,.03,I,f,n,[S,0,0]),q(C+"body",e,r[h+1],[0,0,0],U0,A,g,o+.004,.03,I,D,n,[-S,0,0]),q(C+"wing",e,r[h+2],[.32*n,.12*n,.1*n],L,A,g,o+.011,.03,F,T,n,[S*2,S,0],-.5),q(C+"wing",e,r[h+3],[-.32*n,.12*n,.1*n],fe,A,g,o+.015,.03,F,T,n,[-S*2,S,0],-.5),q(C+"vane",e,r[h+4],[0,.3*n,-1.05*n],L,A,g,o+.02,.03,I,D,n,[0,S,-S*2],.6),Tt++}const et=[];for(let e=0;e<12;e++)for(const t of[1,-1]){const a=14+e*16.5+(t>0?0:5),o=t*24.5,n=M0("fly",o,a,Math.PI+t*.72,j0[(e*2+(t>0?0:1)+d)%3]);et.push(n)}await s.yield();const Ia=t0(Math.round((a0-60)/24),3,4);for(let e=0;e<et.length;e++){const t=et[e],a=t.pos.x>0?1:-1,o=e%3!==2,n=o?i.range(22,34):i.range(9,14),c=o?i.range(19,27):i.range(9,20),l={x:o?a*i.range(2,12):a*(n+11+i.range(0,8)),y:c,z:t.pos.z+i.range(25,60),rx:n,rz:i.range(26,48),sp:a*i.range(.3,.42),ph:i.range(0,E),bob:i.range(1.5,3)},r=i.shuffle([0,1,2,3,4,5,6,7,8,9,10,11]),h=t.pos.z-i.range(55,85);for(let f=0;f<Ia;f++)X0(t,r[f],l,h<0?Q-f:h0(h)+.004+f*.006,1);await s.yield()}await s.yield();const Nt=b(.2589,0,.9659),Ee=b(-.9659,0,.2589),Ka=Math.atan2(Nt.x,Nt.z);for(let e=0;e<6;e++)for(const t of[1,-1]){const a=we+12+e*24+(t>0?0:9),o=t*15.5,n=28.4+.268*(a-we)+Ee.x*o,c=a+Ee.z*o,l=M0("fly",n,c,Ka+Math.PI-t*.8,j0[(e+(t>0?1:0)+d)%3],{scale:.6}),r=i.range(7,11),h=t*(r+13+i.range(0,10)),f=a+i.range(25,50),x={x:28.4+.268*(f-we)+Ee.x*h,y:i.range(9,24),z:f+Ee.z*h,rx:r,rz:i.range(14,24),sp:t*i.range(.4,.55),ph:i.range(0,E),bob:1.5},m=i.shuffle([0,1,2,3,4,5,6,7,8,9,10,11]);for(let A=0;A<4;A++)X0(l,m[A],x,h0(a-i.range(60,95))+A*.007,.6);await s.yield()}await s.yield();for(let e=0;e<Math.min(10,Math.round(9*w));e++){const t=235+e*76+i.range(-20,20),a=e%2?1:-1,o=i.range(12,20),n=i.range(22,40),c=Y(t)+a*(o*1.15+12+i.range(0,10)),l=H.nearestXZ(Y(t),t).y;if(D0(c,t,q0,C0)<Math.max(o,n)+12||Math.hypot(c-p0.x,t-p0.z)<95)continue;const r={x:c,y:Math.max(12,l+i.range(-10,12)),z:t,rx:o,rz:n,sp:a*i.range(.26,.4),ph:i.range(0,E),bob:3};for(let h=0;h<4;h++)X0(null,0,r,Q,i.range(1.3,1.7)*(t>o0?1.4:1));await s.yield()}for(const[e,t,a,o,n,c]of[[0,14,128,13,64,7],[0,21,285,24,62,12],[18,39,395,22,50,9]]){const l={x:e,y:t,z:a,rx:o,rz:n,sp:(e?-1:1)*i.range(.3,.38),ph:0,bob:2.5},r=Math.round(c*(.5+.5*p));for(let h=0;h<r;h++)l.ph=h/r*E+i.range(-.2,.2),X0(null,0,l,Q,i.range(1.35,1.75),null,a<300),await s.yield();await s.yield()}for(const[e,t,a,o,n]of[[.31,-11,15,377,1.9],[.31,8,18.5,375,1.8],[.31,-17,22.5,392,1.3]])X0(null,0,{ph:0},Q,n,[[t,a,o,-.03],[0,800,e,.12]]);await s.yield();const Y0=[],Va=(e,t,a)=>{for(const o of Y0){const n=Math.hypot((e-o[0])/o[2],(t-o[1])/o[3]);if(Math.abs(n-1)*Math.min(o[2],o[3])<a+4)return!1}return!0},v0=[],I0=(e,t,a)=>{for(const o of v0)if(Math.hypot(e-o[0],t-o[1])<a+o[2])return!1;return Va(e,t,a)};for(const e of Je)v0.push([e.pos.x,e.pos.z,14*e.sc]);const Ot=[K,X,f0(m0,ce,.25),X,K];let Wt=0;const La=f0(X,K,.3),Ht=[[1,250,66,2],[1,338,80,2.3],[-1,486,78,2.2],[1,446,70,1.9],[-1,548,84,2.4],[1,540,74,2.1],[-1,628,78,1.8],[1,820,40,1.3],[1,890,42,1.4],[-1,960,46,1.25]];for(let e=0;e<Ht.length;e++){const[t,a,o,n]=Ht[e];for(let c=0;c<8;c++){const l=a+i.range(-14,14),r=Y(l)+t*(o+i.range(-5,7)),h=Math.PI+t*i.range(.55,.95);if(!I0(r,l,12*n)||l0(r,l)>.02||l0(r-t*9*n,l)>.02||D0(r,l,q0,C0)<18*n||Math.hypot(r-p0.x,l-p0.z)<66)continue;const f=M0("fly",r,l,h,Ot[(e+d)%5],{scale:n});v0.push([r,l,13*n]);const x=i.range(16,24),m={x:r-t*i.range(8,20),y:i.range(30,46),z:l+i.range(20,50),rx:x,rz:i.range(26,40),sp:t*i.range(.22,.3),ph:i.range(0,E),bob:3},A=i.shuffle([0,1,2,3,4,5,6,7,8,9,10,11]),g=Math.round(5*(.6+.4*p)),F=h0(l-i.range(100,150));for(let S=0;S<g;S++)X0(f,A[S],m,S<3?F+S*.012:9+S,n*.9);Wt++;break}await s.yield()}await s.yield();const ja=(e,t,a,o)=>{const n=B0(t);return B(_0(e,t,n,a)+Fe(n),_0(e+1,t,n,a),o)},Bt=[[1,878,0,"tree",2.5,0],[1,962,1,"beast",2.3,.5],[1,1038,0,"fly",1.7,0],[-1,905,0,"fly",2.4,0],[-1,988,1,"tree",2.2,.48],[-1,1062,0,"beast",1.7,0]];for(let e=0;e<Bt.length;e++){const[t,a,o,n,c,l]=Bt[e],r=Y(a)+t*ja(o,a,t,l?.62:.42),h=M0(n,r,a,-t*Math.PI/2+.25+(e%2?.14:-.1),Ot[(e+1+d)%5],l?{scale:c,lean:l}:{scale:c});if(v0.push([r,a,12*c]),n==="tree")for(const f of l?[1,5]:[0,1,2,4])q("tier",h,yt.slots[f],[0,0,0],L,[0,-400,0,0],[0,0,0,0],9,.01,[4,0,0,0],La,gt[f%3]*c,[0,0,0],.5);if(n==="fly"&&c>2){const f=i.shuffle([0,1,2,3,4,5,6,7,8,9,10,11]);for(let x=0;x<3;x++)X0(h,f[x],{x:r,y:60,z:a,rx:10,rz:10,sp:.3,ph:0,bob:1},9+x,c*.9)}}Y0.push([Y(860)-38,860,14,24]);for(let e=5,t=0;e<i0&&t<200;t++){const a=i.range(250,1070),o=i.chance(.5)?1:-1,n=i.range(18,30),c=i.range(26,60),l=Y(a)+o*(n+i.range(26,50));if(Math.abs(l-Y(a))+n>B0(a)*.4||D0(l,a,q0,C0)<Math.max(n,c)+12||Math.hypot(l-p0.x,a-p0.z)<Math.max(n,c)+30)continue;let r=!0;for(const h of Y0)Math.hypot(l-h[0],a-h[1])<Math.max(n,c)+Math.max(h[2],h[3])+6&&(r=!1);for(const h of v0)Math.abs(Math.hypot((h[0]-l)/n,(h[1]-a)/c)-1)*Math.min(n,c)<h[2]+5&&(r=!1);r&&(Y0.push([l,a,n,c]),e++)}const Te=[K,x0,f0(m0,ce,.25)];function _t(e,t,a,o){const n=E*a/10.9,c=i.int(0,2),l=(c+i.int(1,2))%3;q("gbody",null,null,[0,0,0],L,e,t,Q,.01,I,Te[c],1.3),q("gbody",null,null,[0,0,0],U0,e,t,Q,.01,I,Te[l],1.3),q("gbody",null,null,[0,1,4],L,e,t,Q,.01,I,Te[l],.5),q("gbody",null,null,[0,1,4],U0,e,t,Q,.01,I,Te[c],.5);for(let r=0;r<4;r++){const h=r&1?1:-1,f=r&2?1:-1;q("leg",null,null,[h*1.05,-.25,f*2.1],h>0?L:fe,e,t,Q,.01,[2,.4,n,(f>0?0:Math.PI)+o],X,1)}}for(const[e,t,a,o,n]of[[.03,8.5,52,.3,.954],[.17,-6,224.5,-.8,.6],[.2,-9,257.5,-.95,.31],[.22,-7.5,279.5,-.6,.8],[.26,-9,322,-.3,.954],[.285,-2,364,-.6,.8],[.3,-10,392,-.5,.866]]){const c=Math.atan2(o,n),l=220,r=i.range(0,E);_t([t,7.1,a,c],[0,l,e,.05],l/44,r),c0(t,.3,a,4.6,4.6,c,.75,[0,l,e,.05])}for(let e=0;e<Y0.length;e++){const[t,a,o,n]=Y0[e],c=i.range(3,4.2),l=(e%2?-1:1)*c/((o+n)*.5),r=i.range(0,E);_t([t,J(t,a)*.5+7,a,.12],[o,n,l,r],c,r),c0(t,.3,a,4.6,4.6,0,.7,[o,n,l,r])}await s.yield();const Xa=[5,7.3,9.3],Qt=[X,X,f0(X,K,.45),X,f0(X,m0,.5)];function Ut(e,t,a,o,n,c,l){const r=J(e,t)-.1,h=i.range(0,E),f=[e,r,t,h],x=[0,0,0,0];q("trunk",null,null,[0,0,0],L,f,x,Q,.01,I,X,a),q("trunk",null,null,[0,0,0],fe,f,x,Q,.01,I,X,a);for(let m=0;m<3;m++){const A=n?yt.slots[c*3+m]:null;q("tier",n,A,[0,Xa[m]*a,0],O0(V0(m*1.1)),f,x,n?l+m*.014:Q,.034,[4,0,0,0],o,gt[m]*a,[0,3.2,0],.5,.32)}c0(e,r+.25,t,4.3*a,4.3*a,0,.9),v0.push([e,t,4.5*a])}const It=Math.round(132*w*(.45+.55*p)),Ya=(e,t)=>{for(let a=0;a<30;a++){const o=i.range(e,t),n=B0(o),c=i.chance(.5)?1:-1,l=i(),r=Y(o)+c*B(o<215?46:26,n*.92,l*l*.9+l*.1);if(!(D0(r,o,q0,C0)<22||l0(r,o)>.02||!I0(r,o,5)||H.nearestXZ(r,o).dist<20)&&!(Math.hypot(r-p0.x,o-p0.z)<30))return[r,o]}return null},tt=Math.round(It*.13);for(let e=0;e<tt;e++){const t=120+e/tt*960+i.range(-20,20),a=e%2?1:-1,o=Y(t)+a*i.range(t<215?52:30,62);if(D0(o,t,q0,C0)<34||l0(o,t)>.02||l0(o-a*12,t)>.02||!I0(o,t,16))continue;const n=i.pick(Qt),c=M0("tree",o,t,Math.PI+a*i.range(.5,1.1),n);v0.push([o,t,14]);for(let l=0;l<2;l++){const r=c.yaw+(l?.6:-.6),h=i.range(13,17),f=o+Math.sin(r)*h-a*2,x=t+Math.cos(r)*h;Ut(f,x,1,n,c,l,h0(x-i.range(70,110))+l*.02)}e%2===1&&await s.yield()}await s.yield();for(let e=0,t=0,a=0,o=0;e<It-tt*2;e++){let n=null;if(t>0){t--;for(let c=0;c<6&&!n;c++){const l=i.range(0,E),r=i.range(7,12),h=a+Math.sin(l)*r,f=o+Math.cos(l)*r;I0(h,f,3)&&l0(h,f)<.02&&H.nearestXZ(h,f).dist>18&&(n=[h,f])}}n||(n=Ya(0,1210),n&&n[1]>770&&(t=i.int(2,3),a=n[0],o=n[1])),n&&(Ut(n[0],n[1],i.range(.8,1.25)*(n[1]>770?1.25:1),i.pick(Qt),null,0,0),e%5===4&&await s.yield())}await s.yield();const Kt=f0(m0,Ve,.6),k0=(e,t,a)=>e.slots.find(o=>o.cell===t&&o.k===a),Za=b(.06,-1,.02).normalize().multiplyScalar(7),$a=1.12,at=.034,Vt=.3,Lt=(e,t)=>e+(t===1?0:.022);function Ja(e,t,a,o,n,c,l,r){const h=a.clone().add(n),f=Vt*e.distanceTo(h)+1.5,x=Math.ceil(at*H.length/$0),m=t.dot(o)<0?-1:1,A=new v.Quaternion,g=b(0,0,0),F=b(0,0,0),S=b(0,0,0);let C=r;for(let D=0;D<=x;D++){const T=D/x,Z=T<.8?T/.8*(T/.8)*(3-2*T/.8):1;if(T<.8)g.lerpVectors(e,h,Z),g.y+=2*Z*(1-Z)*f;else{const z=(T-.8)/.2-1;g.copy(a).addScaledVector(n,-2.2*z*z*z-1.2*z*z)}A.set(t.x+(m*o.x-t.x)*Z,t.y+(m*o.y-t.y)*Z,t.z+(m*o.z-t.z)*Z,t.w+(m*o.w-t.w)*Z).normalize(),F.copy(Za).multiplyScalar(l).applyQuaternion(A),H.posAtDist(t0((c+T*at)*H.length,0,H.length),S).sub(g),C=Math.min(C,S.addScaledVector(F,-t0(S.dot(F)/F.lengthSq(),0,1)).length())}return C}function ot(e,t,a,o,n,c,l,r=1,h=0){const f=!!o,x=e,m=t,A=z=>[(z&1?1:-1)*.8*r,-.1*r,(z&2?1:-1)*1.5*r],g=z=>[(z&1?1:-1)*1.2,-1.2,0],F=V0(a),S=zt+$a*.4*r+kt,C=z=>{let j=S;for(const $ of[1,2]){const u0=k0(ge,c,2+$),K0=b(u0.x*n.sc,u0.y*n.sc,0).applyQuaternion(n.q).add(n.pos),Qe=b(...A($)).applyQuaternion(F).add(b(e,J(e,z)+2.72*r,z)),Ue=$&1?F:F.clone().multiply(V0(Math.PI));j=Ja(K0,n.q.clone().multiply(u0.q),Qe,Ue,b(...g($)).applyQuaternion(F),Lt(l,$),.4*r,j)}return j};if(t+=h,f){for(;t>m&&C(t)<S;)t=Math.max(m,t-.25);for(let z=0,j=C(t);z<80&&j<S;z++,j=C(t))t+=S-j+.05}const D=J(e,t)+2.72*r,T=[e,D,t,a],Z=[0,0,0,0];q("gbody",null,null,[0,0,0],L,T,Z,Q,.01,I,K,r),q("gbody",null,null,[0,0,0],U0,T,Z,Q,.01,I,Kt,r);for(let z=0;z<2;z++)q("gbody",f?o:null,f?k0(ge,c,6+z):null,[0,.75*r,2.75*r],z?U0:L,T,Z,f?l+.05+z*.006:Q,.03,I,z?K:Kt,.42*r,[z?-.5:.5,.3,.8],.5,.3);for(let z=0;z<4;z++){const j=z&1?1:-1,$=z&2?1:-1,u0=f&&(z===1||z===2),K0=u0?[3,.32,i.range(2.2,3.4),i.range(0,E)]:[3,.035,i.range(.8,1.6),i.range(0,E)];q("leg",u0?n:null,u0?k0(ge,c,2+z):null,A(z),j>0?L:fe,T,Z,u0?Lt(l,z):Q,at,K0,X,.4*r,g(z),.5,Vt)}if(f){const z=Math.cos(a),j=Math.sin(a),$=e+(j*-1.4+z*.9)*r,u0=t+(z*-1.4-j*.9)*r;qe[0].push([$,D-1.45*r,u0],O0(new v.Quaternion().setFromEuler(new v.Euler(.12,a,Math.PI/2-.1,"YXZ"))),m0.map(K0=>K0*.92),[0,9,0,.45*r])}return c0(e,D-2.5*r,t,3*r,4.2*r,a,.9),v0.push([x,m,4*r]),t-m}const jt=n0===40?10:6;for(let e=0;e<jt/2;e++){const t=258+e*44+i.range(-2,2),a=-i.range(41,46)+13,o=i.range(-.3,.3),n=M0("beast",a,t,o,X,{lie:1}),c=M0("beast",a-27,t+i.range(-5,5),o+i.range(-.2,.2),K,{lie:1});v0.push([a,t-8,15],[a-27,t-8,15]);let l=0;for(let h=0;h<2;h++){const f=t+6+h*13+i.range(-1.5,1.5),x=t0(H0(f)-18.5-i.range(0,3),9.5,14.5);l=ot(x,f,i.range(-.6,.6)+(h?Math.PI:0),c,n,h,h0(f-24)-.02,i.range(1.15,1.3),l),await s.yield()}const r=t+31+i.range(-1.5,1.5);ot(t0(H0(r)-18.5-i.range(0,3),9.5,14.5),r,i.range(0,E),null,null,0,0,i.range(1,1.25),l)}await s.yield();for(let e=0,t=0;e<n0-jt&&t<400;t++){const a=i.range(215,520),o=i.chance(.55),n=o?H0(a)+i.range(15,46):t0(H0(a)-i.range(15,22),9.5,40);!I0(n,a,4.5)||l0(n,a)>.02||(ot(n,a,i.range(0,E),null,null,0,0),e++)}await s.yield();const he=[K,x0,X,f0(m0,ce,.25)];for(let e=0,t=0;e<Math.round(9*(.5+.5*p))&&t<300;t++){const a=i.range(215,960),o=i.chance(.5)?1:-1,n=i.chance(.25),c=n?2:1,l=Y(a)+o*i.range(n?56:27,100);if(!I0(l,a,15*c)||l0(l,a)>.02||D0(l,a,q0,C0)<26*c||Math.hypot(l-p0.x,a-p0.z)<50)continue;const r=e%3,h=n?"beast":i.pick(["fly","tree","beast"]),f=r===0?{lie:1,scale:c}:r===1&&a>760?{topple:h0(a-i.range(50,90)),scale:c}:{scale:c};M0(h,l,a,r===1&&a>760?(o>0?.5:-.5)+i.range(-.3,.3):i.range(0,E),i.pick(he),f),v0.push([l,a,15*c]),e++}for(let e=0;e<4;e++){const t=828+e*30,a=e%2?1:-1,o=Y(t)+a*i.range(27,36);I0(o,t,10)&&(M0(e%2?"tree":"fly",o,t,Math.PI+a*.5,he[(e+d)%4],{topple:h0(t-85)}),v0.push([o,t-8,15]))}await s.yield();for(let e=0,t=0;e<Math.round(14*(.5+.5*p))&&t<500;t++){const a=e%5>=3,o=a?i.range(790,1060):i.range(300,690),n=a?i.chance(.8)?1:-1:i.chance(.5)?1:-1,c=Y(o)+n*i.range(a?22:28,Math.min(120,B0(o)*.42));!I0(c,o,14)||l0(c,o)>.02||l0(c,o-9)>.02||D0(c,o,q0,C0)<20||Math.hypot(c-p0.x,o-p0.z)<30||(M0(i.pick(["fly","tree","beast"]),c,o,i.range(0,E),i.pick(he),{lie:1}),v0.push([c,o,14]),e++)}await s.yield();const nt=O0(new v.Quaternion().setFromAxisAngle(b(0,0,1),Math.PI/2)),Ga=e=>40+2.3*Math.max(0,e.y-9),Xt=(e,t)=>{const a=H.pointAt(e),o=i.range(-1,1),n=a.z+i.range(-7,7),c=Math.min(Ga(a),B0(n)*.5-6);return[a.x+o*(.35+.65*Math.abs(o))*c*t,n]},Yt=(e,t,a)=>{if(l0(e,t)>.02||D0(e,t,q0,C0)<5)return;const o=i.chance(.3)?1:0,n=i.range(.7,1.25)*a,c=i.range(0,E),l=J(e,t)-.06;qe[o].push([e,l,t],O0(V0(c)),i.pick(he).map(r=>r*.97),[0,9,0,n]),c0(e,l+.2,t,(o?5.4:3.8)*n,1.5*n,c,.85)},Zt=(e,t,a)=>{if(l0(e,t)>.02)return;const o=i.pick(["wing","vane","tier","tier","leg","body","gbody"]),n=J(e,t),c=i.range(0,E),l=[e,n,t,c],r=i.pick(he),h=[0,0,0,0];if(o==="wing"||o==="vane"){const f=i.range(1,1.8)*a;q(o,null,null,[0,o==="wing"?.06:.04,0],o==="wing"?L:nt,l,h,Q,.01,I,r,f),c0(e+Math.cos(c)*f*(o==="wing"?1:0),n+.15,t-Math.sin(c)*f*(o==="wing"?1:0),1.5*f,1.1*f,c,.65)}else if(o==="tier"){const f=i.range(.8,2.2)*a*(Math.abs(e)<8&&t<700?.4:1);q("tier",null,null,[0,.07*f,0],i.chance(.5)?L:U0,l,h,Q,.01,I,r,f),c0(e,n+.15,t,f*1.45,f*1.45,0,.75)}else if(o==="leg"){const f=i.range(.3,.6)*a;q("leg",null,null,[0,.3,0],nt,l,h,Q,.01,I,r,f),c0(e+Math.cos(c)*3.5*f,n+.15,t-Math.sin(c)*3.5*f,4.2*f,1.2*f,c,.65)}else{const f=(o==="body"?i.range(1,1.6):i.range(.4,.8))*a;q(o,null,null,[0,.1*f,0],nt,l,h,Q,.01,I,r,f);const x=o==="body"?1.5:2.9;c0(e,n+.15,t,1.3*f,x*f,c,.7)}},st=Math.round(135*(.4+.6*p));for(let e=0;e<st;e++){const t=Xt((e+i())/st,1);Yt(t[0],t[1],1+.8*N(20,60,H.pointAt(e/st).y))}await s.yield();const lt=Math.round(245*w*(.4+.6*p));for(let e=0;e<lt;e++){const t=Xt((e+i())/lt,1);Zt(t[0],t[1],1+1.2*N(20,60,H.pointAt(e/lt).y)),e%25===24&&await s.yield()}const $t=Math.round(52*(.5+.5*p));for(let e=0;e<$t;e++){const t=16+(e+i())/$t*190,a=i.range(-15,15);Math.abs(a)<1.5||(e%4===0?Yt(a,t,.9):Zt(a,t,1.15))}await s.yield();const Ne=Math.round(52*(.5+.5*p));for(let e=0;e<Ne;e++)for(const t of[-1,1]){const a=232+e/Ne*370+i.range(-2,2),o=H0(a)+t*i.range(11.5,14.5);if(Rt(a)<.5||Math.abs(o)<7)continue;const n=Math.PI/2+Math.atan((H0(a+2)-H0(a-2))/4)+i.range(-.25,.25);q("reed",null,null,[0,0,0],L,[o,J(o,a)-.05,a,n],[0,0,0,0],Q,.01,[3,.13,i.range(.9,1.3),a*.06],i.chance(.7)?X:K,i.range(.8,1.3))}for(let e=0;e<Math.round(Ne*.7);e++)for(const t of[-1,1]){const a=o0+100+e/(Ne*.7)*400+i.range(-2,2),o=Ae(a)+t*i.range(8.8,11.5),n=Math.PI/2+Math.atan((Ae(a+2)-Ae(a-2))/4)+i.range(-.25,.25);q("reed",null,null,[0,0,0],L,[o,J(o,a)-.05,a,n],[0,0,0,0],Q,.01,[3,.13,i.range(.9,1.3),a*.06],i.chance(.6)?X:K,i.range(.9,1.5))}await s.yield();const Jt=3.2,E0=H.end.clone(),Oe=J(E0.x,E0.z)-.2,G=E0.y-Oe,r0=new Ie;r0.part=-1;{const t=(a,o,n,c,l=.6)=>r0.rod([a,o,0],[n,c,0],l,8);t(-19.4,1.6,19.4,1.6),t(-19.4,29.4,19.4,29.4),t(-19.4,1.6,-19.4,29.4),t(19.4,1.6,19.4,29.4),t(-10.6,1.6,-10.6,29.4,.5),t(10.6,1.6,10.6,29.4,.5),t(-10.6,G+10.6,10.6,G+10.6,.5),t(-19.4,G,-10.6,G,.4),t(10.6,G,19.4,G,.4),r0.grid(36,8,(a,o,n)=>{const c=a*E,l=o*E,r=7.75+Math.cos(l)*.55;return n[0]=Math.cos(c)*r,n[1]=G+Math.sin(c)*r,n[2]=Math.sin(l)*.55,Math.cos(l)>.9?1:0},!0);for(const[a,o]of[[1,0],[-1,0],[0,1],[0,-1]]){const n=o<0?G-1.6-8.3:2.299999999999999;n<.3||r0.lathe([a*(8.3+n),G+o*(8.3+n),0],[-a,-o,0],[[.75,0,0],[.45,n*.7,.3],[.3,n,1]],7)}for(const[a,o]of[[-19.4,1.6],[19.4,1.6],[-19.4,29.4],[19.4,29.4],[-10.6,29.4],[10.6,29.4],[-10.6,G+10.6],[10.6,G+10.6]])r0.lathe([a,o,0],[0,0,1],[[0,-.8,0],[1.5,-.65,.4],[1.5,.65,.4],[0,.8,0]],10);xe(r0,pa(0,G+14.2,13,3.6,.5),-.2,.2,.1,.7);for(let a=0;a<9;a++){const o=-5.2+a*1.3;(a*7+d)%3?r0.rod([o-.35,G+14.2,.25],[o+.35,G+14.2,.25],.16,4):r0.lathe([o,G+14.2,.18],[0,0,1],[[.26,0,0],[0,.2,.5]],6)}t(0,G+16,0,29.4,.3);for(const a of[-13,13])r0.m=new v.Matrix4().makeTranslation(a,0,0).multiply(new v.Matrix4().makeScale(2.4,1,1.4)),r0.lathe([0,0,0],[0,1,0],[[0,0,0],[2.6,0,.5],[2.7,.25,.8],[1.8,.9,0],[.8,1.6,0]],12),r0.m=null;for(let a=0;a<r0.P.length;a++)r0.P[a]/=Jt}const Gt=Math.atan2(-H.endTangent.x,-H.endTangent.z),ea=V0(Gt),ta=new N0(Z0);ta.push([E0.x,Oe,E0.z],O0(ea),X,[0,9,0,Jt]);const eo={pos:b(E0.x,Oe,E0.z),q:ea,sc:1,lie:!1,nx:-H.endTangent.x,nz:-H.endTangent.z,phase:0,col:X,rigid:!0};for(const e of[-1,1])for(const[t,a]of[[5.6,3.3],[-5.6,2.6]])q("tier",eo,{x:e*15,y:G+t*(e>0?1:-1),q:le},[0,0,0],L,[0,-400,0,0],[0,0,0,0],9,.01,[4,0,0,0],X,a,[0,0,0],.5);c0(E0.x,Oe+.3,E0.z,22,4.5,Gt,.85),await s.yield();const aa=b(-64,44,o0-60),P0=[];if(W){const e=M0("beast",-96,o0-38,Math.PI-.55,x0,{scale:2.5}),t=[0,0,0,0],a=[-1,0,0,0],o=ge,n=[1,.5,2.3,0];q("gbody",e,k0(o,0,0),[0,0,0],L,t,a,.45,.045,I,K,2.5,[3,0,0],.4,.3),q("gbody",e,k0(o,0,1),[0,0,0],U0,t,a,.46,.045,I,K,2.5,[-3,0,0],.4,.3),q("gbody",e,k0(o,0,6),[0,1.6,6.6],L,t,a,.485,.04,I,x0,1.05,[1.5,1,2],.5,.3),q("gbody",e,k0(o,0,7),[0,1.6,6.6],U0,t,a,.495,.04,I,x0,1.05,[-1.5,1,2],.5,.3),q("vane",e,k0(o,0,2),[0,1.6,-5.2],L,t,a,.51,.04,I,x0,5,[0,3,-4],.5,.3);const c=k0(o,1,0),l=k0(o,1,1);Re.push(...Ge(e,{x:c.x-1.2,y:c.y,q:le},[1.7,1,.6],L,t,a,.525,.05,n,wt,11,[5,4,0],-.3,.3)),Re.push(...Ge(e,{x:l.x-1.2,y:l.y,q:le},[-1.7,1,.6],fe,t,a,.545,.05,n,wt,11,[-5,4,0],-.3,.3));const r=V.anchors.flight,h=b(14,-30,-34);P0.push([.4,aa.clone()],[.655,aa.clone()]);for(const f of r)f.u>.64&&f.u<.67&&P0.push([f.u+.04,G0(f.position).add(h)]);for(const f of[[.69,-44,126,815],[.725,-62,110,893],[.76,-75,90,965],[.8,-52,92,1032],[.84,-12,92,1088],[.875,20,80,1112],[.93,30,80,1165],[.96,42,105,1198],[1,68,160,1245]])P0.push([F0(f[0]),b(f[1],f[2],f[3])])}const oa=W?new v.CatmullRomCurve3(P0.map(e=>e[1]),!1,"centripetal"):null;await s.yield();const We=async e=>{const t=new Ie;e(t),await s.yield();const a=await t.buildSteps(s);return await s.yield(),a},pe=new v.Group,rt=new v.Group;g0.add(pe,rt);const to=u.fork("geo");for(const e of["fly","tree","beast"])pe.add(Ct[e].mesh(await We(t=>Bo(t,Dt[e],to)),ue));pe.add(qe[0].mesh(await We(e=>Pa(e,0,6)),ue),qe[1].mesh(await We(e=>Pa(e,1,9)),ue)),pe.add(ta.mesh(await r0.buildSteps(s),ue)),await s.yield(),pe.add(qt.mesh(await d0.buildSteps(s),ue)),await s.yield();const ao={body:e=>dt(e,2.6,.42,.46,.8,4,4,0,[.45]),wing:Ro,vane:ka,trunk:Do,tier:Eo,gbody:e=>dt(e,5,.95,1.05,.7,6,5,.12,[.3,.62],.3,[.7,.3],.3),leg:To,reed:No,ebody:e=>dt(e,2.6,.42,.46,.8,7,6,0,[.3,.62],.14),ewing:qo,evane:Co},He={};for(const e of Object.keys(Pe))He[e]=await We(ao[e]),rt.add(Pe[e].mesh(He[e],Da));if(W){const e=(t,a,o)=>new v.ShaderMaterial({uniforms:R,vertexShader:wa,fragmentShader:vo,defines:t,side:v.DoubleSide,...a});rt.add(Re.mesh(He.wing,e({AMBER_MUL:1},St),5),Re.mesh(He.wing,e({},At),6))}await s.yield();{const e=new v.InstancedBufferGeometry;e.setAttribute("position",new v.Float32BufferAttribute([-1,0,-1,1,0,-1,1,0,1,-1,0,1],3)),e.setIndex([0,2,1,0,3,2]),e.setAttribute("iPos",new v.InstancedBufferAttribute(new Float32Array(Q0.p),3)),e.setAttribute("iSz",new v.InstancedBufferAttribute(new Float32Array(Q0.s),4)),e.setAttribute("iOrb",new v.InstancedBufferAttribute(new Float32Array(Q0.o),4)),e.instanceCount=Q0.n;const t=new v.Mesh(e,new v.ShaderMaterial({uniforms:R,vertexShader:wo,fragmentShader:bo,...Ft,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));t.frustumCulled=!1,t.renderOrder=1,t.matrixAutoUpdate=!1,g0.add(t)}{const e=Math.hypot(A0.x,A0.z),t=-A0.x/Math.max(e,.001),a=-A0.z/Math.max(e,.001),o=Math.min(e/Math.max(A0.y,.2),2.6),n=[],c=[],l=[],r=[],h=6,f=4;let x=0;for(const g of Je){if(!g.stand)continue;const F=J(g.pos.x,g.pos.z);if(F-J(Y(g.pos.z),g.pos.z)>3)continue;const S=Dt[g.kind],C=Math.cos(g.yaw),D=-Math.sin(g.yaw),T=n.length/3,Z=16*Math.cos(g.lean);for(let z=0;z<=f;z++)for(let j=0;j<=h;j++){const $=(j/h-.5)*24,u0=z/f*Z,K0=g.pos.x+(C*$+t*u0*o)*g.sc,Qe=g.pos.z+(D*$+a*u0*o)*g.sc,Ue=J(K0,Qe),ha=Math.abs(Ue-F)<1.5;n.push(K0,(ha?Ue:F)+.22,Qe),c.push($,z/f*16),l.push(S.nx,S.ny,g.phase,ha?.9:0)}for(let z=0;z<f;z++)for(let j=0;j<h;j++){const $=T+z*(h+1)+j;r.push($,$+h+1,$+1,$+1,$+h+1,$+h+2)}++x%12===0&&await s.yield()}const m=new v.BufferGeometry;m.setAttribute("position",new v.Float32BufferAttribute(n,3)),m.setAttribute("uv",new v.Float32BufferAttribute(c,2)),m.setAttribute("aux",new v.Float32BufferAttribute(l,4)),m.setIndex(r);const A=new v.Mesh(m,new v.ShaderMaterial({uniforms:R,vertexShader:Mo,fragmentShader:So,...Ft,side:v.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));A.frustumCulled=!1,A.renderOrder=1,A.matrixAutoUpdate=!1,g0.add(A)}await s.yield();const S0=6,te=2,Be=(S0+1)*(te+1),ae=new Float32Array(4*Be*3),de=new Float32Array(4*Be*3),oe=new v.BufferGeometry;{const e=[];for(let t=0;t<4;t++)for(let a=0;a<=te;a++)for(let o=0;o<=S0;o++){const n=t*Be+a*(S0+1)+o;de[n*3]=o/S0,de[n*3+1]=a/te*2-1,ae[n*3+1]=-50,o<S0&&a<te&&e.push(n,n+1,n+S0+2,n,n+S0+2,n+S0+1)}oe.setAttribute("position",new v.BufferAttribute(ae,3)),oe.setAttribute("aUv",new v.BufferAttribute(de,3)),oe.setIndex(e)}const ve=b(A0.x*.14,1,A0.z*.14).normalize();for(const[e,t,a]of[[{},St,2],[{PATCH_ADD:1},At,3]]){const o=new v.Mesh(oe,new v.ShaderMaterial({uniforms:R,vertexShader:Ao,fragmentShader:Fo,defines:e,side:v.DoubleSide,...t,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3}));o.frustumCulled=!1,o.renderOrder=a,o.matrixAutoUpdate=!1,g0.add(o)}await s.yield();const na=(e,t,a,o)=>{const n=new v.BufferGeometry;n.setAttribute("position",new v.Float32BufferAttribute(e,3)),n.setAttribute("aVel",new v.Float32BufferAttribute(t,3)),n.setAttribute("aSeed",new v.Float32BufferAttribute(a,4));const c=new v.Points(n,new v.ShaderMaterial({uniforms:R,vertexShader:zo,fragmentShader:ko,defines:o,transparent:!0,depthWrite:!1}));return c.frustumCulled=!1,c.renderOrder=7,c.matrixAutoUpdate=!1,g0.add(c),c};{const e=[],t=[],a=[],o=u.fork("swarf"),n=(m,A,g)=>{for(let F=0;F<A;F++){const S=o.range(0,E),C=o.range(.3,1),D=g?2.2:1;e.push(m[0]+o.range(-1,1)*m[4],m[1]+o.range(-.5,.5)*(g?1:m[4]),m[2]+o.range(-1,1)*m[4]),t.push(Math.cos(S)*C*3.2*D,o.range(g?.6:-.3,g?3:1.6)*D,Math.sin(S)*C*3.2*D),a.push(m[3],o.range(.22,.5)*(g?1.5:1),o.range(0,E),o.range(.7,1.3)*(g?1.6:1))}},c=Math.round(170*p),l=Math.max(1,Ce.length/c);for(let m=0;m<Ce.length;m+=l)n(Ce[Math.floor(m)],4,!1);for(const m of Et)n(m,Math.round(26*p),!0);na(e,t,a,{});const r=[],h=[],f=[],x=Math.round([240,460,820][O]*(.5+.5*p));for(let m=0;m<x;m++)r.push(o.range(0,90),o.range(0,90),o.range(0,90)),h.push(0,0,0),f.push(0,o.range(.16,.36),o.range(0,E),o.range(.6,1.4));na(r,h,f,{WEATHER:1})}await s.yield();const it=new v.Vector2,ct=b(0,0,0),sa=b(0,0,0),ut=new v.Quaternion,e0=b(0,0,0),la=b(0,0,0),me=b(0,0,0),ft=b(0,0,0),ra=new v.Matrix4,ne=new v.Quaternion,ia=new v.Quaternion,ca=V0(.69),oo=b(0,1,0),no=[1,-1,1,-1];function so(){const e=R.uHullP.value.z-ve.z/ve.y*(R.uHullP.value.y-.5),t=N(1e3,1070,e);for(let a=0;a<4;a++){const o=a<_;let n=0;V.partLocal(a,sa),V.partQuaternion(a,ut),la.set(0,1,0).applyQuaternion(ut).applyQuaternion(y0),o&&(n=N(.08,.45,Math.abs(la.dot(ve))));for(let c=0;c<=te;c++)for(let l=0;l<=S0;l++){const r=(a*Be+c*(S0+1)+l)*3;if(!o){ae[r+1]=-50,de[r+2]=0;continue}if(e0.set(no[a]*70*(l/S0),0,4+(c/te*2-1)*15).applyQuaternion(ut).add(sa).applyQuaternion(y0).add(L0),e0.addScaledVector(ve,-(e0.y-.5)/ve.y),t>0){e0.z=B(e0.z,e+(e0.z-e)*2.2-16,t);const m=Y(e0.z);e0.x=B(e0.x,m+17*Math.tanh((e0.x-m)/17),t)}const h=J(e0.x,e0.z),f=J(Y(e0.z),e0.z),x=h-f<2;ae[r]=e0.x,ae[r+1]=(x?h:f)+.35,ae[r+2]=e0.z,de[r+2]=x?n:0}}oe.attributes.position.needsUpdate=!0,oe.attributes.aUv.needsUpdate=!0}const ua=new v.Quaternion;function fa(e,t,a,o){R.uTime.value=t,R.uU.value=o,ct.setFromMatrixPosition(a.matrixWorld),ke.position.copy(ct),R.uCam.value.copy(ct);const n=a.projectionMatrix.elements;if(s.renderer.getDrawingBufferSize(it),R.uPx.value=n[5]*it.y*.5,R.uPix.value=2/Math.max(n[5]*it.y,64),V.setProgress(F0(o)),V.update(e,t,a),V.bodyNow(R.uHullP.value,ua),R.uHullP.value.applyQuaternion(y0).add(L0),R.uHullA.value.set(0,0,1).applyQuaternion(ua).applyQuaternion(y0),R.uHullK.value=N(.28,.46,o),so(),W){const c=P0.length-1,l=F0(o);let r=1;if(l<=P0[0][0])r=0;else for(let h=0;h<c;h++)if(l<P0[h+1][0]){r=(h+(l-P0[h][0])/(P0[h+1][0]-P0[h][0]))/c;break}oa.getPoint(r,me),oa.getPoint(Math.min(1,r+.01),ft),ne.copy(ca),l>.655&&ft.distanceToSquared(me)>1e-4&&(ra.lookAt(ft,me,oo),ia.setFromRotationMatrix(ra),ne.slerpQuaternions(ca,ia,N(.655,.7,l))),me.y+=Math.sin(t*.9)*.6,R.uRareP.value.copy(me),R.uRareQ.value.set(ne.x,ne.y,ne.z,ne.w)}}fa(0,0,{matrixWorld:new v.Matrix4().setPosition(H.start),projectionMatrix:new v.Matrix4().makePerspective(-1,1,.6,-.6,1,100)},0);const lo={kit:y.name,hour:P.name,weather:["still","breeze","swarf fall"][O],flyers:Tt,striders:Y0.length+7,sheets:Wt,herd:n0,wings:_,rare:W},ro=18,io=e=>{let t=B(1.13,1.07,N(.12,.18,e));return t=B(t,.87,N(.28,.36,e)),t=B(t,.75,N(.43,.5,e)),t=B(t,1.1,N(.65,.73,e)),B(t,1,N(.82,.9,e))},se=b(0,0,0),_e=(e,t,a)=>a?se.copy(Me(F0(t))):(se.copy(Me(F0(t))).multiplyScalar(2).add(Me(F0(Math.max(0,t-.015)))).add(Me(F0(Math.min(1,t+.015)))).multiplyScalar(.25),se.y-=ro*N(84,150,se.y)*(1-N(.6,.68,t)),se.y+=31*N(.65,.705,t)*(1-N(.89,.95,t)),se);return{scene:g0,path:H,duration:44,pace:io,title:"Still on the Sprue",camera:{fov:62,near:.3,far:4e3,lookAhead:26,sway:.6,bank:.6},pois:[{at:_e,from:.25,to:.7,weight:.62,fade:.24},{at:_e,from:.56,to:.97,weight:.6,fade:.15},...[0,1,2,3,4,5,6,7].map(e=>({at:_e,from:.518+e*.0045,to:.71-e*.0045,weight:.85,fade:.45})),{at:_e,from:.72,to:.87,weight:.6,fade:.35}],portal:{shape:"circle",radius:7,color:y.portal,glow:1,revealDistance:420},post:{exposure:1,bloom:{strength:.12,radius:.5,threshold:.95},grade:{saturation:1.12,contrast:1.06,tint:"#ffffff",shadowTint:"#000000",vignette:.16,grain:0,aberration:0}},ride:"none",style:"none",info:lo,heroU:F0,update:fa,dispose(){V.dispose()}}}};export{Lo as default};
